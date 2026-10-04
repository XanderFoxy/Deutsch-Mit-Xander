#!/usr/bin/env node
/* =====================================================================
   TIER-SONDE (FASSUNG 880 — W10, überarbeitet FASSUNG 881)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „perfekter Löwe … perfekter Wolf … Licht und Schatten realistisch plastisch“.

   FASSUNG 880 — Warum: Bisher maß nur der Kritiker nach Augenmaß; Proportionen verschoben sich von Runde zu Runde.
   FASSUNG 881 — Der unabhängige Prüfer fand die Sonde ZIRKULÄR: die Silhouette wurde gegen sk.masse geprüft, also gegen
   genau die Art-Parameter, aus denen sie gebaut war (ein absichtlich kaputter Wolf – Dackelbrust, Riesenrumpf,
   Mini-Kopf – bestand alle Anatomie-Zeilen), und die Lichtprüfung maß nur die Ausgabe von T.licht (besteht immer).
   Jetzt:
   (a) Proportionen am BILD gegen UNABHÄNGIGE Soll-Spannen aus der Recherche (bauplan.js SOLL je Art/Bauplan, art.soll
       überschreibt) – nicht mehr gegen den Bauplan. Dazu ⚠, wenn ein Art-Parameter > 15 % (Winkel > 15°) vom
       Basis-Bauplan abweicht. Arten mit Skelett: Messstellen an den Landmarken; ALTE Arten (ohne Skelett): Ersatzmessung
       am Pixelumriss (Widerrist = höchster Punkt im vorderen Rumpfdrittel, Bauchfreiheit = tiefster Rumpfpunkt
       zwischen den Beinen, Kopflänge = Nase bis Ohransatz) – damit taugt die Sonde als Vorher-Messung für alle Arten.
   (b) Licht im FERTIGEN Bild: die Art wird zweimal gerendert, normal und mit T.licht als leerem svg; die Differenz
       je Rumpfdrittel ist die echte Lichtwirkung (nach Fell, Muster, Lokalfarbe). ✗, wenn oben − unten < 20 Graustufen
       oder das dunkelste Drittel nicht unten liegt. Alte Arten ohne T.licht: grobe Graustufen am fertigen Bild.
   (c) Verbote: Umriss an Teilen (T.koerper mit Rand), T.volumen je Teil (nur <filter id="…_vol…">, nicht der
       Verlauf aus T.VOL), gedrehte Textur-Rechtecke, ungültige Zahlen (NaN/undefined) im SVG fein und Szene.
   (d) Größe fein/Szene, Renderzeit (Ziel < 1 s je Art), Filter im Szene-Modus (Ziel: keine).
   Ausgabe: Textbericht + PNGs (Farbe, Silhouette, Graustufen, Lichtwirkung, Skelett) im Ordner --aus.

   Aufruf: node werkzeug/bilderwelt/tiere/pruefe-tier.js <id> [--art <datei.js>] [--aus <ordner>]
           node werkzeug/bilderwelt/tiere/pruefe-tier.js --alle [--bilder]   (jede Art, mit Bildmessung; Tabelle am Ende)
           node werkzeug/bilderwelt/tiere/pruefe-tier.js --alle --schnell    (nur (c) und (d), ohne Browser)
   (--art lädt die Art aus einer anderen Datei, z. B. einem Entwurf oder vorlage880.js)
   ===================================================================== */
"use strict";
const path = require("path"), fs = require("fs");
const TIERE = __dirname;
const { neueSzene } = require(path.join(TIERE, "../bau"));
const kern = require(path.join(TIERE, "kern"));
const BAU = require(path.join(TIERE, "bauplan"));
const MODULE = ["bauplan", "form880", "fuss880", "kopf880", "fell880"];

/* Werkzeug: kern.js; falls die 880-Module (noch) nicht eingehängt sind, hier nachrüsten */
function werkzeug(S, id) {
  const T = kern.werkzeug(S, id);
  if (!T.skelett) for (const m of MODULE) require(path.join(TIERE, m)).installiere(T);
  return T;
}
/* o.ohneLicht: T.licht liefert ein leeres Ergebnis (für die Differenzmessung (b)); lichtNutzt meldet, ob die Art T.licht
   überhaupt aufruft (sonst ist (b) nur grob möglich) */
function zeichneArt(art, fein, o = {}) {
  const S = neueSzene({ id: "sonde", kuerzel: "sd" });
  const T = werkzeug(S, art.id);
  T.fein = fein;
  let lichtNutzt = false;
  const tl = T.licht;
  if (tl) T.licht = (sil, lo) => { lichtNutzt = true; return o.ohneLicht ? { svg: "", innen: "", hell: () => 0, daten: [] } : tl(sil, lo); };
  const t0 = process.hrtime.bigint();
  const z = art.zeichne(T);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const defs = S.defs.join("");
  return { z, defs, ms, bytes: z.svg.length + defs.length, lichtNutzt };
}
/* ungültige Zahlen im erzeugten SVG (Prüfer 880, Punkt 16: riesenhirsch fein „MNaNQ…“, pinguin Szene „_f0000NaN“) */
function ungueltig(text) {
  const m = text.match(/[^\s"<>]{0,24}(NaN|undefined)[^\s"<>]{0,12}/g) || [];
  return { n: m.length, beispiel: m.slice(0, 2).join("  ") };
}

/* ---------- (c) Verbote: statisch im SVG und im Quelltext der Art ---------- */
function verbote(art, fein, szene) {
  const src = String(art.zeichne), svg = fein.z.svg + fein.defs;
  const res = [];
  /* gedrehte Textur-Rechtecke: Rechteck mit Filter und rotate (selbst oder in rotierter Gruppe direkt darum) */
  const rot = (svg.match(/<rect[^>]*filter="url\([^)]*\)"[^>]*transform="rotate/g) || []).length +
    (svg.match(/<g transform="rotate\([^)]*\)"><rect[^>]*filter=/g) || []).length;
  res.push(["gedrehte Textur-Rechtecke", rot, rot === 0]);
  /* T.volumen je Teil: NUR Filter zählen – Filter-Ids aus kern T.volumen („…_vol…“) bzw. Gruppen-Helfern („…_vl<Ziffer>…“).
     FASSUNG 881: vorher zählte auch der Verlauf aus T.VOL() (linearGradient id …_vol) – Fehlalarm bei 8 Arten. */
  const vol = new Set((svg.match(/<filter id="[^"]*_vol[^"]*"/g) || [])).size + new Set((svg.match(/<filter id="[^"]*_vl[0-9][^"]*"/g) || [])).size;
  res.push(["T.volumen je Teil (Filter)", vol, vol === 0]);
  /* Umriss an Teilen: gefüllter Pfad + identischer Strich-Pfad ohne Füllung (T.koerper-Standardrand) */
  const gefuellt = new Set(), umriss = [];
  for (const m of svg.matchAll(/<path d="([^"]+)" fill="(?!none)[^"]*"/g)) gefuellt.add(m[1]);
  for (const m of svg.matchAll(/<path d="([^"]+)" fill="none" stroke="[^"]*" stroke-opacity="[^"]*" stroke-width="[^"]*" stroke-linejoin="round"\/>/g)) if (gefuellt.has(m[1])) umriss.push(m[1]);
  const koerperOhneRand = (src.match(/T\.koerper\(/g) || []).length - (src.match(/rand:\s*false/g) || []).length;
  res.push(["Umriss an Teilen (T.koerper-Rand)", umriss.length, umriss.length === 0, koerperOhneRand > 0 ? `${koerperOhneRand} T.koerper-Aufrufe ohne rand:false im Quelltext` : ""]);
  /* ungültige Zahlen */
  const nf = ungueltig(svg), ns = ungueltig(szene.z.svg + szene.defs);
  res.push(["ungültige Zahlen (NaN/undefined) fein / Szene", `${nf.n} / ${ns.n}`, nf.n + ns.n === 0, (nf.beispiel || ns.beispiel) ? "z. B. " + (nf.beispiel || ns.beispiel) : ""]);
  return res;
}

/* ---------- Bild-Seite im Browser: SVG als Bild in ein Canvas, Pixel zurück ---------- */
async function pixel(pg, svgText, W, H, modus) {
  return pg.evaluate(async ({ svgText, W, H, modus }) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml" }));
    await new Promise((ok, f) => { img.onload = ok; img.onerror = f; img.src = url; });
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    const out = new Array(W * H);
    for (let i = 0; i < W * H; i++) out[i] = modus === "alpha" ? d[i * 4 + 3] : (d[i * 4 + 3] > 127 ? Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) : -1);
    return out;
  }, { svgText, W, H, modus });
}
/* Lichtwirkung als Bild: Grau 128 + 2 × (mit − ohne Licht); hell = Licht, dunkel = Schatten */
async function diffBild(pg, svgA, svgB, W, H, pfad) {
  await pg.evaluate(async ({ svgA, svgB, W, H }) => {
    const lade = async (t) => { const img = new Image(); img.src = URL.createObjectURL(new Blob([t], { type: "image/svg+xml" })); await new Promise((ok, f) => { img.onload = ok; img.onerror = f; }); const c = document.createElement("canvas"); c.width = W; c.height = H; c.getContext("2d").drawImage(img, 0, 0, W, H); return c.getContext("2d").getImageData(0, 0, W, H); };
    const a = await lade(svgA), b = await lade(svgB);
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d"), o = g.createImageData(W, H);
    for (let i = 0; i < W * H; i++) {
      const la = 0.299 * a.data[i * 4] + 0.587 * a.data[i * 4 + 1] + 0.114 * a.data[i * 4 + 2], lb = 0.299 * b.data[i * 4] + 0.587 * b.data[i * 4 + 1] + 0.114 * b.data[i * 4 + 2];
      const v = a.data[i * 4 + 3] > 127 ? Math.max(0, Math.min(255, 128 + 2 * (la - lb))) : 255;
      o.data[i * 4] = o.data[i * 4 + 1] = o.data[i * 4 + 2] = v; o.data[i * 4 + 3] = 255;
    }
    g.putImageData(o, 0, 0);
    document.body.innerHTML = ""; document.body.style.margin = "0"; document.body.appendChild(c);
  }, { svgA, svgB, W, H });
  await pg.screenshot({ path: pfad, clip: { x: 0, y: 0, width: W, height: H } });
}
/* Abfragen auf der Alpha-Maske */
function maske(alpha, W, H) {
  const deckt = (i, j) => i >= 0 && j >= 0 && i < W && j < H && alpha[j * W + i] > 127;
  const oben = (i) => { for (let j = 0; j < H; j++) if (deckt(i, j)) return j; return null; };
  const ersterLauf = (i) => { const a = oben(i); if (a === null) return null; let b = a; while (b + 1 < H && deckt(i, b + 1)) b++; return [a, b]; };
  return { deckt, oben, ersterLauf };
}

/* ---------- Ersatzmessung am Pixelumriss (alte Arten ohne Skelett; bei neuen Arten als Gegenprobe) ----------
   Bodenkontakt-Spalten → zwei Beingruppen (größte Lücke trennt hinten/vorn); Widerrist = höchster Punkt im vorderen
   Rumpfdrittel (über den Vorderbeinen, Kopf/Hals davor nicht mitgezählt), Kruppe = höchster Punkt über den Hinterbeinen,
   Bauchfreiheit = tiefster Punkt des Rumpfs zwischen den Beinen (Spalten, in denen ein Bein bis zum Boden reicht, zählen
   nicht), Kopflänge = Nasenspitze (vorderster Pixel) bis zum hinteren Ohransatz (hinter der Ohrspitze dort, wo die
   Kontur flach wird) ÷ 0,92 (der Ohransatz liegt ≈ 8 % der Kopflänge vor dem Hinterhaupt). */
function pixelMessung(M, W, H, boden, o = {}) {
  const kontakt = [];
  for (let i = 0; i < W; i++) if (M.deckt(i, boden - 3) && M.deckt(i, boden - 5)) kontakt.push(i);
  if (kontakt.length < 4) return { fehler: "keine Bodenberührung (liegt, schwimmt oder fliegt)" };
  const cl = [];
  let a = kontakt[0], b = a;
  for (const i of kontakt.slice(1)) { if (i - b > 3) { cl.push([a, b]); a = i; } b = i; }
  cl.push([a, b]);
  if (cl.length < 2) return { fehler: "Beine am Boden nicht getrennt erkennbar" };
  let gi = 0, gl = -1;
  for (let k = 0; k < cl.length - 1; k++) { const g = cl[k + 1][0] - cl[k][1]; if (g > gl) { gl = g; gi = k; } }
  const mitte = (arr) => arr.reduce((s, c) => s + (c[0] + c[1]) / 2, 0) / arr.length;
  const xH = Math.round(mitte(cl.slice(0, gi + 1))), xV = Math.round(mitte(cl.slice(gi + 1))), span = xV - xH;
  if (span < 10) return { fehler: "Beine zu dicht" };
  /* Oberkante „dick“: erster Pixel, unter dem mindestens 5 weitere gedeckt sind (einzelne Haare zählen nicht) */
  const topC = new Map();
  const top = (i) => {
    i = Math.max(0, Math.min(W - 1, Math.round(i)));
    if (topC.has(i)) return topC.get(i);
    let t = H;
    for (let j = 0; j < H - 5; j++) if (M.deckt(i, j) && M.deckt(i, j + 2) && M.deckt(i, j + 5)) { t = j; break; }
    topC.set(i, t); return t;
  };
  /* Widerrist: von der Kruppe nach vorn die Rückenlinie entlang; der höchste Punkt, bevor die Kontur steil (> 25°) in
     den Hals steigt (sonst zählten Hals, Kopf oder Geweih als „Widerrist“) – frühestens in der vorderen Rumpfhälfte */
  let wx = null, wy = null;
  const anstieg = (i, d) => (top(i) - top(i + d)) / d;
  for (let i = Math.round(xH + 0.5 * span); i <= Math.round(xV + 0.3 * span); i++) {
    const t = top(i);
    if (t < H && (wy === null || t < wy)) { wy = t; wx = i; }
    /* anhaltend steil (über 0,12 Widerristhöhe im Mittel > 25°) = Hals beginnt */
    if (i > xH + 0.6 * span && wy !== null && anstieg(i, Math.max(4, Math.round(0.12 * (boden - wy)))) > 0.47) break;
  }
  if (wy === null) return { fehler: "kein Widerrist gefunden" };
  const hWid = boden - wy;
  /* Kruppe: mittlere Oberkante knapp über den Hinterfüßen (das Maximum eines Fensters läge am Hang zum Widerrist) */
  const kr = [];
  for (let i = Math.round(xH - 0.05 * span); i <= Math.round(xH + 0.1 * span); i++) { const t = M.oben(i); if (t !== null) kr.push([t, i]); }
  kr.sort((p, q) => p[0] - q[0]);
  const [ky, kx] = kr.length ? kr[Math.floor(kr.length / 2)] : [null, null];
  /* Brust: tiefster Punkt der Rumpfunterkante im vorderen Rumpfstück. Eine Spalte zählt nur, wenn die Zeile knapp über
     ihrem Ende breit gedeckt ist (Rumpf) – endet sie an einem schräg gestellten Lauf, ist die Zeile dort nur laufbreit. */
  const unterkante = (i) => { const r = M.ersterLauf(i); return r ? r[1] : null; };
  let unter = null, ux = null;
  const k3 = Math.max(2, Math.round(0.015 * span));
  for (let i = Math.round(xV - 0.55 * span); i <= Math.round(xV - 0.1 * span); i++) {
    const b0 = unterkante(i), bl = unterkante(i - k3), br = unterkante(i + k3);
    if (b0 === null || bl === null || br === null || b0 >= boden - 0.12 * hWid) continue;
    /* flach (< 30°) = Rumpfunterkante; die Kante eines Laufs fällt steil ab */
    if (Math.abs(br - bl) / (2 * k3) > 0.58) continue;
    if (unter === null || b0 > unter) { unter = b0; ux = i; }
  }
  /* Nase: vorderste Spalte mit mindestens 5 zusammenhängend gedeckten Pixeln (Tasthaare, einzelne Haare zählen nicht) */
  const dick = (i) => { let best = null; for (let j = 0; j < H; j++) { if (!M.deckt(i, j)) continue; let k = j; while (k + 1 < H && M.deckt(i, k + 1)) k++; if (k - j >= 4 && (!best || k - j > best[1] - best[0])) best = [j, k]; j = k; } return best; };
  let xn = W - 1; while (xn > 0 && !dick(xn)) xn--;
  const ln = dick(xn) || [0, 0];
  const nase = [xn, (ln[0] + ln[1]) / 2];
  /* Ohr: höchster Punkt der Oberkontur im Kopfbereich (bis 0,5 Widerrist hinter der Nase), nur wenn er als Spitze
     heraussteht; hinterer Ohransatz = stärkste Einbuchtung unter der Sehne von der Ohrspitze nach hinten (Mulde oder
     Knick zwischen Ohr und Nacken). Geweih/Hörner (Spitze weit über dem Widerrist) oder kein Ohr → nicht bewertet. */
  let ex = null, ey = null;
  for (let i = Math.max(0, Math.round(xn - 0.5 * hWid)); i <= xn; i++) { const t = top(i); if (t < H && (ey === null || t < ey)) { ey = t; ex = i; } }
  let ohr = null, kopfGrund = "";
  /* steht die Spitze nach beiden Seiten (innerhalb 0,15 Widerrist) mindestens 0,04 Widerrist heraus? */
  const seiteTiefer = (v) => { for (let k = 1; k <= Math.round(0.15 * hWid); k++) if (top(ex + v * k) - ey > 0.04 * hWid) return true; return false; };
  if (ex === null) kopfGrund = "kein Kopf gefunden";
  else if (o.hoerner) kopfGrund = "Hörner/Geweih überragen die Ohren – nicht bewertet";
  else if (!(seiteTiefer(-1) && seiteTiefer(1))) kopfGrund = "kein abstehendes Ohr gefunden – nicht bewertet";
  else {
    const i0 = Math.max(0, Math.round(ex - 0.2 * hWid)), t0 = top(i0);
    let best = -1, ib = ex;
    for (let i = i0; i <= ex; i++) { const sehne = t0 + (ey - t0) * (i - i0) / ((ex - i0) || 1), tief = top(i) - sehne; if (tief > best) { best = tief; ib = i; } }
    ohr = [ib, top(ib)];
  }
  const kopfPx = ohr ? Math.hypot(nase[0] - ohr[0], nase[1] - ohr[1]) / 0.92 : null;
  /* Rumpflänge (nur Info): Zeile auf 0,6 Widerristhöhe, Lauf durch die Rumpfmitte */
  const yr = Math.round(boden - 0.6 * hWid), xm = Math.round((xH + xV) / 2);
  let l = xm, r = xm;
  if (M.deckt(xm, yr)) { while (M.deckt(l - 1, yr)) l--; while (M.deckt(r + 1, yr)) r++; }
  return { xH, xV, span, hWid, wx, wy, kx, ky, unter, ux, nase, ohr, ohrSpitze: [ex, ey], kopfPx, kopfGrund, rumpfPx: r - l, rumpfL: [l, r, yr], rumpfMitKopf: r >= xn - 0.1 * hWid };
}

async function pruefe(art, o) {
  const fein = zeichneArt(art, true), szene = zeichneArt(art, false);
  const z = fein.z, sk = z.sk || null;
  const [x0, y0, x1, y1] = z.box;
  const bericht = [], zaehl = { "✗": 0, "⚠": 0 };
  const zeile = (k, v, ok, extra = "") => {
    const z0 = ok === null ? "·" : ok === "warn" ? "⚠" : ok ? "✓" : "✗";
    if (z0 in zaehl) zaehl[z0]++;
    bericht.push(`  ${z0} ${k}: ${v}${extra ? "  (" + extra + ")" : ""}`);
  };
  bericht.push(`TIER-SONDE ${art.id} (${art.de}) — Datei ${art.datei || o.art || "?"}`);
  /* (d) Größe, Zeit, Filter */
  bericht.push("(d) Größe und Leistung");
  zeile("Größe fein", `${(fein.bytes / 1024).toFixed(1)} KB`, fein.bytes <= 70 * 1024 * (/^dinos_/.test(art.datei || "") || /saur|rex|raptor|stego|tricera|brachio|diplo|ankylo|spino|allo|pteran/i.test(art.id) ? 90 / 70 : 1), "Ziel ≤ 70 KB, Saurier ≤ 90 KB");
  zeile("Größe Szene", `${(szene.bytes / 1024).toFixed(1)} KB`, szene.bytes <= 25 * 1024, "Ziel ≤ 25 KB");
  const filterSz = (szene.defs.match(/<filter/g) || []).length, filterFein = (fein.defs.match(/<filter/g) || []).length;
  zeile("Filter im Szene-Modus", filterSz, filterSz === 0, `fein: ${filterFein}`);
  zeile("zeichne() fein / Szene", `${fein.ms.toFixed(0)} ms / ${szene.ms.toFixed(0)} ms`, fein.ms < 1000);
  /* (c) Verbote */
  bericht.push("(c) Verbote");
  for (const [k, n, ok, extra] of verbote(art, fein, szene)) zeile(k, n, ok, extra);
  const ergebnis = { id: art.id, datei: art.datei, feinKB: fein.bytes / 1024, szeneKB: szene.bytes / 1024, filterSz };
  const ende = () => { bericht.push(`ERGEBNIS ${art.id}: ${zaehl["✗"]} ✗, ${zaehl["⚠"]} ⚠`); return Object.assign(ergebnis, { bericht, fein, szene, fehler: zaehl["✗"], warn: zaehl["⚠"] }); };
  if (o.nurText) return ende();

  /* ---------- Render: Silhouette (schwarz), Graustufen, Lichtwirkung, Skelett ---------- */
  const pg = o.pg, bilder = o.bilder !== false;
  const rand = 4, bw = x1 - x0 + 2 * rand, bh = y1 - y0 + 2 * rand;
  const px = Math.min(1100 / bw, 800 / bh), W = Math.round(bw * px), H = Math.round(bh * px);
  const vb = `${x0 - rand} ${y0 - rand} ${bw} ${bh}`;
  const svgDoc = (inhalt, defs, hg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${H}"><defs>${defs}<filter id="sdSchwarz" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter></defs>${hg ? `<rect x="${x0 - rand}" y="${y0 - rand}" width="${bw}" height="${bh}" fill="${hg}"/>` : ""}${inhalt}</svg>`;
  const bild = async (name, html) => { if (!bilder) return; await pg.setContent(html); await pg.screenshot({ path: path.join(o.aus, art.id + "-" + name + ".png"), clip: { x: 0, y: 0, width: W, height: H } }); };
  const tR0 = Date.now();
  await pg.setContent(`<html><body style="margin:0;background:#fff">${svgDoc(z.svg, fein.defs, "#ffffff")}</body></html>`);
  if (bilder) await pg.screenshot({ path: path.join(o.aus, art.id + "-farbe.png"), clip: { x: 0, y: 0, width: W, height: H } });
  const renderMs = Date.now() - tR0;
  zeile("Render im Browser (fein" + (bilder ? ", inkl. Bildschirmfoto" : "") + ")", `${renderMs} ms`, renderMs < 1000);
  /* (a) Silhouette */
  const sil = svgDoc(`<g filter="url(#sdSchwarz)">${z.svg}</g>`, fein.defs, null);
  await bild("silhouette", `<html><body style="margin:0;background:#fff">${sil}</body></html>`);
  const alpha = await pixel(pg, sil, W, H, "alpha");
  const M = maske(alpha, W, H);
  const grauDoc = svgDoc(z.svg, fein.defs, null);
  await bild("grau", `<html><body style="margin:0;background:#8a8a8a"><div style="filter:grayscale(1)">${svgDoc(z.svg, fein.defs, "#8a8a8a")}</div></body></html>`);
  const lum = await pixel(pg, grauDoc, W, H, "lum");
  const PX = (x) => Math.round((x - (x0 - rand)) * px), PY = (y) => Math.round((y - (y0 - rand)) * px);
  const boden = PY(0);
  /* Arten mit Hörnern/Geweih: die höchste Kopfspitze ist kein Ohr */
  const pm = pixelMessung(M, W, H, boden, { hoerner: art.hoerner || /hirsch|elch|rentier|^reh$|gnu|ziege|schaf|wisent|moschus|^kuh$|nashorn|giraffe|antilope|gazelle|triceratops/.test(art.id) });
  /* Messpunkte der Pixelmessung als Bild (zum Nachprüfen der Ersatzmessung) */
  if (bilder && !pm.fehler) {
    const kreuz = (x, y, f) => `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${f}" stroke-width="2.5"/>`;
    const mk = kreuz(pm.wx, pm.wy, "#e00") + kreuz(pm.kx, pm.ky, "#e80") + (pm.unter !== null ? kreuz(pm.ux, pm.unter, "#08f") : "") + kreuz(pm.nase[0], pm.nase[1], "#0a0") +
      (pm.ohr ? kreuz(pm.ohr[0], pm.ohr[1], "#a0a") + kreuz(pm.ohrSpitze[0], pm.ohrSpitze[1], "#f0f") : "") +
      `<line x1="${pm.xH}" y1="${boden}" x2="${pm.xH}" y2="${boden - 20}" stroke="#000" stroke-width="3"/><line x1="${pm.xV}" y1="${boden}" x2="${pm.xV}" y2="${boden - 20}" stroke="#000" stroke-width="3"/>` +
      `<line x1="${pm.rumpfL[0]}" y1="${pm.rumpfL[2]}" x2="${pm.rumpfL[1]}" y2="${pm.rumpfL[2]}" stroke="#08f" stroke-width="1.5" stroke-dasharray="6 4"/>`;
    const img = svgDoc(`<g filter="url(#sdSchwarz)" opacity=".25">${z.svg}</g>`, fein.defs, "#ffffff");
    await bild("pixel", `<html><body style="margin:0;position:relative">${img}<svg style="position:absolute;left:0;top:0" width="${W}" height="${H}">${mk}</svg></body></html>`);
  }
  const soll = BAU.sollFuer(art.id, sk ? sk.bauplan : null, art.soll || z.soll);
  const f2 = (v) => (v == null || !isFinite(v) ? "–" : v.toFixed(2));
  /* gegen Soll-Spanne prüfen (tol: zusätzliche Toleranz für grobe Pixelmessungen) */
  const gegenSoll = (name, ist, key, extra = "", tol = 0) => {
    const sp = soll && soll[key];
    if (ist == null || !isFinite(ist)) { zeile(name, "nicht messbar", null, extra); return; }
    if (!sp) { zeile(name, f2(ist) + (key === "sprungWinkel" ? "°" : " W"), null, (extra ? extra + "; " : "") + "kein Soll"); return; }
    const lo = sp[0] * (1 - tol), hi = sp[1] * (1 + tol), e = key === "sprungWinkel" ? "°" : " W";
    zeile(name, `${key === "sprungWinkel" ? ist.toFixed(0) : f2(ist)}${e} (Soll ${sp[0]}–${sp[1]}${e}${tol ? `, ±${Math.round(tol * 100)} %` : ""})`, ist >= lo && ist <= hi, extra);
  };
  bericht.push(`(a) Proportionen am Bild gegen Soll-Spannen (unabhängig vom Bauplan)` + (soll ? ` — Soll: ${soll.von}` : " — KEIN Soll für diese Art (nur Messwerte)"));
  if (soll && soll.quelle) bericht.push(`    Quelle: ${soll.quelle}`);
  let xa, xb;
  if (sk) {
    /* Abweichung der Art-Parameter vom Basis-Bauplan */
    const basis = BAU.BAUPLAENE[sk.bauplan];
    if (basis) for (const a of BAU.abweichungen(sk.bp, basis)) zeile(`Art-Parameter ${a.pfad}`, `${a.wert} (Bauplan ${sk.bauplan}: ${a.basis}, ${a.rel != null ? (a.rel >= 0 ? "+" : "") + Math.round(a.rel * 100) + " %" : (a.grad >= 0 ? "+" : "") + a.grad + "°"})`, "warn", "weicht > 15 % ab – bewusst und belegt?");
    const Wpx = sk.W * px, lm = sk.lm;
    /* Widerrist (Oberkante der Silhouette an der Landmarke) – alle Verhältnisse beziehen sich auf die GEMESSENE Höhe */
    const hWid = (boden - M.oben(PX(lm.widerrist[0]))) / Wpx, hKr = (boden - M.oben(PX(lm.kruppe[0]))) / Wpx;
    zeile("Widerristhöhe mit Fell / eingegebenes W", f2(hWid), hWid >= 0.97 && hWid <= 1.08, "Soll 0,97–1,08 (Fell)");
    gegenSoll("Kruppe / Widerrist", hKr / hWid, "kruppe");
    /* Bauchfreiheit: tiefster Punkt des oberen Laufs (Rumpf) zwischen Ellbogen und Kniefalte, Spalten mit Bein übersprungen */
    let unter = null;
    xa = PX(lm.flanke[0]); xb = PX(sk.beine.vn.extra.ellbogenhoecker[0]);
    const xm0 = Math.min(xa, xb) + Math.round(Math.abs(xb - xa) * 0.2), xm1 = Math.max(xa, xb) - Math.round(Math.abs(xb - xa) * 0.2);
    for (let i = xm0; i <= xm1; i++) { const r = M.ersterLauf(i); if (!r || r[1] >= boden - 2) continue; if (unter === null || r[1] > unter) unter = r[1]; }
    gegenSoll("Bauchfreiheit / Widerrist (Brust)", unter !== null ? (boden - unter) / Wpx / hWid : null, "bauchfreiheit");
    /* Rumpflänge: Bugspitze bis Gesäß (am Umriss z.umriss, sonst an den Pixeln) */
    const zeileBug = PY(lm.bugspitze[1]), zeileSb = PY(lm.sitzbein[1]);
    let vorn = PX(lm.bugspitze[0]); while (M.deckt(vorn + 1, zeileBug)) vorn++;
    let hinten = PX(lm.sitzbein[0]); while (M.deckt(hinten - 1, zeileSb) && hinten > PX(lm.sitzbein[0] - sk.W * 0.15)) hinten--;
    if (z.umriss) {
      const U = z.umriss, imBand = (p, y, h) => Math.abs(p[1] - y) <= h;
      const hU = U.filter((p) => imBand(p, lm.sitzbein[1], sk.W * 0.08) && p[0] < lm.sitzbein[0] + sk.W * 0.1), vU = U.filter((p) => imBand(p, lm.bugspitze[1], sk.W * 0.05) && p[0] < lm.bugspitze[0] + sk.W * 0.15);
      if (hU.length) hinten = PX(Math.min(...hU.map((p) => p[0])));
      if (vU.length) vorn = PX(Math.max(...vU.map((p) => p[0])));
    }
    gegenSoll("Rumpflänge / Widerrist (Bug bis Gesäß, mit Fell)", (vorn - hinten) / Wpx / hWid, "rumpfL");
    /* Kopflänge: Hinterhaupt bis Nasenspitze (vorderster Umriss-/Pixelpunkt vor dem Hinterhaupt) */
    const hh = sk.kopf.hinterhaupt;
    let nase = null;
    if (z.umriss) { for (const p of z.umriss) if (p[0] > hh[0] && (!nase || p[0] > nase[0])) nase = p; }
    else if (pm.nase) nase = [(pm.nase[0] / px) + x0 - rand, (pm.nase[1] / px) + y0 - rand];
    gegenSoll("Kopflänge / Widerrist (Hinterhaupt bis Nase)", nase ? Math.hypot(nase[0] - hh[0], nase[1] - hh[1]) / sk.W / hWid : null, "kopfL");
    /* Sprunggelenk: Winkel aus dem Skelett gegen die Soll-Spanne; Fersenhöcker = hinterster Umrisspunkt zwischen Knie und Fessel */
    const bp = sk.masse, hn = sk.beine.hn.p;
    if (sk.gang !== "sohle" && sk.gang !== "saeule" && sk.gang !== "flosse") {
      gegenSoll("Sprunggelenkwinkel (Skelett)", bp.sprungWinkel, "sprungWinkel");
      let fy = null, fx = null;
      if (z.umriss) {
        for (const p of z.umriss) if (p[1] > hn.knie[1] && p[1] < hn.fessel[1] && Math.abs(p[0] - hn.sprung[0]) < sk.W * 0.15 && (fx === null || p[0] < fx)) { fx = p[0]; fy = PY(p[1]); }
      } else for (let j = PY(hn.knie[1]); j <= PY(hn.fessel[1]); j++) { let i = PX(hn.sprung[0]) - 1; if (!M.deckt(i, j)) continue; while (M.deckt(i - 1, j) && i > PX(hn.sprung[0] - sk.W * 0.2)) i--; if (fx === null || i < fx) { fx = i; fy = j; } }
      gegenSoll("Fersenhöcker-Höhe / Widerrist (hinterster Punkt)", fy !== null ? (boden - fy) / Wpx / hWid : null, "fersenH");
    }
    zeile("Knie vor dem Hüftlot (Skelett)", `${(bp.knieVorHueftlot * 100).toFixed(0)} % W`, sk.zwei ? null : bp.knieVorHueftlot > 0);
    if (!pm.fehler) zeile("Gegenprobe Pixelmessung (wie bei alten Arten)", `Kruppe ${f2((boden - pm.ky) / pm.hWid)}, Bauchfreiheit ${f2(pm.unter !== null ? (boden - pm.unter) / pm.hWid : null)}, Kopf ${f2(pm.kopfPx / pm.hWid)} W`, null);
  } else if (pm.fehler) {
    zeile("Ersatzmessung am Pixelumriss", pm.fehler, null);
  } else {
    /* ALTE Art: Ersatzmessung am Pixelumriss gegen dieselben Soll-Spannen (grob: ±10 % zusätzliche Toleranz) */
    const hW = pm.hWid;
    zeile("Box (cm)", `${(x1 - x0).toFixed(0)} × ${(y1 - y0).toFixed(0)}`, null);
    gegenSoll("Kruppe / Widerrist (Pixel)", (boden - pm.ky) / hW, "kruppe", "", 0.03);
    gegenSoll("Bauchfreiheit / Widerrist (Pixel)", pm.unter !== null ? (boden - pm.unter) / hW : null, "bauchfreiheit", "", 0.1);
    if (pm.kopfPx != null) gegenSoll("Kopflänge / Widerrist (Pixel: Nase bis Ohransatz ÷ 0,92)", pm.kopfPx / hW, "kopfL", "", 0.1);
    else zeile("Kopflänge / Widerrist (Pixel)", pm.kopfGrund, null);
    zeile("Rumpflänge / Widerrist (Pixel, Zeile auf 0,6 Höhe)", f2(pm.rumpfPx / hW) + " W", null, pm.rumpfMitKopf ? "Zeile läuft bis in den Kopf – nur Info" : "nur Info");
    xa = Math.round(pm.xH + 0.2 * pm.span); xb = Math.round(pm.xV - 0.2 * pm.span);
  }

  /* ---------- (b) Licht ---------- */
  const rumpfSpalten = xa != null ? [Math.min(xa, xb), Math.max(xa, xb)] : [Math.round(W * 0.3), Math.round(W * 0.7)];
  const drittel = (werte) => {
    const dr = [[0, 0], [0, 0], [0, 0]], rb = [[0, 0], [0, 0]];
    for (let i = rumpfSpalten[0]; i <= rumpfSpalten[1]; i++) {
      const r = M.ersterLauf(i); if (!r || r[1] >= boden - 2) continue;
      const h = r[1] - r[0];
      for (let j = r[0]; j <= r[1]; j++) {
        const v = werte(j * W + i); if (v === null) continue;
        const k = Math.min(2, Math.floor((j - r[0]) / (h / 3 || 1))); dr[k][0] += v; dr[k][1]++;
        if (j - r[0] < h * 0.15) { rb[0][0] += v; rb[0][1]++; }
        if (r[1] - j < h * 0.15) { rb[1][0] += v; rb[1][1]++; }
      }
    }
    const m = dr.map(([s, n]) => (n ? s / n : 0));
    return { m, dunkelst: m.indexOf(Math.min(...m)), ruecken: rb[0][1] ? rb[0][0] / rb[0][1] : 0, bauch: rb[1][1] ? rb[1][0] / rb[1][1] : 0 };
  };
  const ges = drittel((k) => (lum[k] < 0 ? null : lum[k]));
  const fmtM = (d, vz) => d.m.map((v) => (vz && v > 0 ? "+" : "") + v.toFixed(0)).join(" / ");
  if (fein.lichtNutzt) {
    bericht.push("(b) Licht im fertigen Bild: Differenz mit/ohne T.licht je Rumpfdrittel");
    const ohne = zeichneArt(art, true, { ohneLicht: true });
    const ohneDoc = svgDoc(ohne.z.svg, ohne.defs, null);
    const lumO = await pixel(pg, ohneDoc, W, H, "lum");
    const d = drittel((k) => (lum[k] < 0 || lumO[k] < 0 ? null : lum[k] - lumO[k]));
    const kontrast = d.m[0] - d.m[2];
    zeile("Lichtwirkung oben / Mitte / unten (Graustufen, mit − ohne Licht)", fmtM(d, true), kontrast >= 20 && d.dunkelst === 2,
      `oben − unten = ${kontrast.toFixed(0)}, Soll ≥ 20; ${d.dunkelst === 2 ? "dunkelstes unten" : "dunkelstes NICHT unten"}`);
    zeile("Lichtwirkung Rücken gegen Bauch", `${d.ruecken >= 0 ? "+" : ""}${d.ruecken.toFixed(0)} gegen ${d.bauch >= 0 ? "+" : ""}${d.bauch.toFixed(0)}`, d.ruecken - d.bauch >= 20, "Soll: Rücken mindestens 20 heller");
    zeile("Gesamtbild Rumpf-Drittel (mit Lokalfarbe, nur Info)", fmtM(ges) + `; Rücken ${ges.ruecken.toFixed(0)} / Bauch ${ges.bauch.toFixed(0)}`, null);
    if (bilder) await diffBild(pg, grauDoc, ohneDoc, W, H, path.join(o.aus, art.id + "-licht.png"));
  } else {
    bericht.push("(b) Licht (grob: Graustufen am fertigen Bild, Lokalfarbe zählt mit – Art nutzt T.licht nicht)");
    zeile("Rumpf-Drittel (oben / Mitte / unten, Helligkeit 0–255)", fmtM(ges), ges.dunkelst === 2, ges.dunkelst === 2 ? "dunkelstes unten" : "dunkelstes NICHT unten");
  }
  /* Skelett-Bild: Knochen über der Silhouette */
  if (sk && bilder) {
    let lin = "";
    const L = (p, q, f, w) => { lin += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`; };
    for (const [wo, f] of [["vf", "#7aa6ff"], ["hf", "#7aa6ff"], ["vn", "#ff4d4d"], ["hn", "#ff4d4d"]]) { const k = sk.beine[wo].kette; for (let i = 0; i < k.length - 1; i++) L(k[i], k[i + 1], f, 0.9); }
    const lm = sk.lm;
    L(lm.hueftHoecker, lm.sitzbein, "#ffb000", 1); L(sk.ruecken[0], sk.ruecken[sk.ruecken.length - 1], "#ffb000", 0.6);
    for (let i = 0; i < sk.hals.kette.length - 1; i++) L(sk.hals.kette[i], sk.hals.kette[i + 1], "#3fd16f", 1);
    L(sk.kopf.hinterhaupt, sk.kopf.nase, "#3fd16f", 1);
    for (let i = 0; i < sk.schwanz.kette.length - 1; i++) L(sk.schwanz.kette[i], sk.schwanz.kette[i + 1], "#c070ff", 0.8);
    let pk = ""; for (const n of Object.keys(lm)) pk += `<circle cx="${lm[n][0]}" cy="${lm[n][1]}" r="1.1" fill="#ffe000" stroke="#000" stroke-width=".3"/>`;
    const skel = svgDoc(`<g opacity=".35">${z.svg}</g>${lin}${pk}<line x1="${x0 - rand}" y1="0" x2="${x1 + rand}" y2="0" stroke="#000" stroke-width=".4"/>`, fein.defs, "#ffffff");
    await bild("skelett", `<html><body style="margin:0">${skel}</body></html>`);
  }
  return ende();
}

if (require.main === module) {
  const arg = process.argv.slice(2);
  const wert = (k, d) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : d; };
  const id = arg[0] && !arg[0].startsWith("--") ? arg[0] : null;
  const datei = wert("--art", null);
  const aus = wert("--aus", "/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/tiere880/sonde");
  const alle = arg.includes("--alle"), schnell = arg.includes("--schnell");
  fs.mkdirSync(aus, { recursive: true });
  let arten;
  if (datei) { const p = path.resolve(datei); delete require.cache[p]; const m = require(p); arten = (Array.isArray(m) ? m : m.arten || []).map((a) => Object.assign({ datei: path.basename(p) }, a)); }
  else arten = kern.alleArten();
  const liste = alle ? arten : arten.filter((a) => a.id === id);
  if (!liste.length) { console.error("Art nicht gefunden: " + id); process.exit(1); }
  (async () => {
    let br = null, pg = null;
    if (!schnell) {
      const { chromium } = require("/tmp/claude-0/node_modules/playwright");
      br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
      pg = await br.newPage({ viewport: { width: 1200, height: 900 } });
    }
    const tab = [];
    for (const art of liste) {
      let r;
      try { r = await pruefe(art, { aus, art: datei, nurText: schnell, pg, bilder: !alle || arg.includes("--bilder") }); }
      catch (e) { console.log(`TIER-SONDE ${art.id}: ABBRUCH – ${String(e.message).split("\n")[0]}\n`); tab.push({ id: art.id, abbruch: true }); continue; }
      const text = r.bericht.join("\n");
      console.log(text + "\n");
      tab.push(r);
      if (!alle) { fs.writeFileSync(path.join(aus, art.id + ".txt"), text + "\n"); console.log("PNGs: " + ["farbe", "silhouette", "grau", "licht", "skelett"].map((k) => path.join(aus, art.id + "-" + k + ".png")).join(", ")); }
    }
    if (alle) {
      console.log("ÜBERSICHT (✗ / ⚠ je Art)");
      for (const r of tab) console.log(`  ${r.id.padEnd(22)} ${r.abbruch ? "ABBRUCH" : `${String(r.fehler).padStart(2)} ✗ ${String(r.warn).padStart(2)} ⚠   fein ${r.feinKB.toFixed(1)} KB, Szene ${r.szeneKB.toFixed(1)} KB, Filter Szene ${r.filterSz}`}`);
      fs.writeFileSync(path.join(aus, "alle.txt"), tab.map((r) => r.bericht ? r.bericht.join("\n") : r.id + ": ABBRUCH").join("\n\n") + "\n");
    }
    if (br) await br.close();
  })().catch((e) => { console.error(e); process.exit(1); });
}
module.exports = { pruefe, verbote, zeichneArt, pixelMessung, ungueltig };
