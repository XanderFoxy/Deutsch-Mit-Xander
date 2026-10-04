#!/usr/bin/env node
/* =====================================================================
   TIER-SONDE (FASSUNG 880 — W10)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „perfekter Löwe … perfekter Wolf … Licht und Schatten realistisch plastisch“.

   FASSUNG 880 — Warum: Bisher maß nur der Kritiker nach Augenmaß; Proportionen verschoben sich von Runde zu Runde.
   Die Sonde misst objektiv, BEVOR ein Kritiker urteilt:
   (a) schwarze Silhouette + automatische Messung gegen den Bauplan (Bauchfreiheit/Widerrist, Rumpflänge/Widerrist,
       Kopf/Rumpf, Sprunggelenkwinkel, Kruppe vs. Widerrist; Toleranz ±5 %),
   (b) Graustufen-Render: dunkelster Bereich im unteren Rumpfdrittel? Rücken heller als Bauch?
   (c) Verbote: Umriss an Teilen (T.koerper mit Rand), T.volumen je Teil, gedrehte Textur-Rechtecke,
   (d) Größe fein/Szene, Renderzeit (Ziel < 1 s je Art), Filter im Szene-Modus (Ziel: keine).
   Ausgabe: Textbericht + PNGs (Silhouette, Graustufen, Skelett) im Ordner --aus.

   Aufruf: node werkzeug/bilderwelt/tiere/pruefe-tier.js <id> [--art <datei.js>] [--aus <ordner>] [--alle]
   (--art lädt die Art aus einer anderen Datei, z. B. einem Entwurf; --alle prüft jede Art, nur Text + Zahlen)
   ===================================================================== */
"use strict";
const path = require("path"), fs = require("fs");
const TIERE = __dirname;
const { neueSzene } = require(path.join(TIERE, "../bau"));
const kern = require(path.join(TIERE, "kern"));
const MODULE = ["bauplan", "form880", "fuss880", "kopf880", "fell880"];

/* Werkzeug: kern.js; falls die 880-Module (noch) nicht eingehängt sind, hier nachrüsten */
function werkzeug(S, id) {
  const T = kern.werkzeug(S, id);
  if (!T.skelett) for (const m of MODULE) require(path.join(TIERE, m)).installiere(T);
  return T;
}
function zeichneArt(art, fein) {
  const S = neueSzene({ id: "sonde", kuerzel: "sd" });
  const T = werkzeug(S, art.id);
  T.fein = fein;
  const t0 = process.hrtime.bigint();
  const z = art.zeichne(T);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const defs = S.defs.join("");
  return { z, defs, ms, bytes: z.svg.length + defs.length };
}

/* ---------- (c) Verbote: statisch im SVG und im Quelltext der Art ---------- */
function verbote(art, fein) {
  const src = String(art.zeichne), svg = fein.z.svg + fein.defs;
  const res = [];
  /* gedrehte Textur-Rechtecke: Rechteck mit Filter und rotate (selbst oder in rotierter Gruppe direkt darum) */
  const rot = (svg.match(/<rect[^>]*filter="url\([^)]*\)"[^>]*transform="rotate/g) || []).length +
    (svg.match(/<g transform="rotate\([^)]*\)"><rect[^>]*filter=/g) || []).length;
  res.push(["gedrehte Textur-Rechtecke", rot, rot === 0]);
  /* T.volumen je Teil: Filter-Ids aus kern T.volumen ("vol…") bzw. Gruppen-Helfer volumen()/teil() */
  const vol = new Set((svg.match(/id="[^"]*_vol[^"]*"/g) || [])).size + new Set((svg.match(/id="[^"]*_vl[0-9][^"]*"/g) || [])).size;
  res.push(["T.volumen je Teil (Filter)", vol, vol === 0]);
  /* Umriss an Teilen: gefüllter Pfad + identischer Strich-Pfad ohne Füllung (T.koerper-Standardrand) */
  const gefuellt = new Set(), umriss = [];
  for (const m of svg.matchAll(/<path d="([^"]+)" fill="(?!none)[^"]*"/g)) gefuellt.add(m[1]);
  for (const m of svg.matchAll(/<path d="([^"]+)" fill="none" stroke="[^"]*" stroke-opacity="[^"]*" stroke-width="[^"]*" stroke-linejoin="round"\/>/g)) if (gefuellt.has(m[1])) umriss.push(m[1]);
  const koerperOhneRand = (src.match(/T\.koerper\(/g) || []).length - (src.match(/rand:\s*false/g) || []).length;
  res.push(["Umriss an Teilen (T.koerper-Rand)", umriss.length, umriss.length === 0, koerperOhneRand > 0 ? `${koerperOhneRand} T.koerper-Aufrufe ohne rand:false im Quelltext` : ""]);
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
    for (let i = 0; i < W * H; i++) out[i] = modus === "alpha" ? d[i * 4 + 3] : Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) * (d[i * 4 + 3] > 127 ? 1 : -1);
    return out;
  }, { svgText, W, H, modus });
}

async function pruefe(art, o) {
  const fein = zeichneArt(art, true), szene = zeichneArt(art, false);
  const z = fein.z, sk = z.sk || null;
  const [x0, y0, x1, y1] = z.box;
  const bericht = [];
  const zeile = (k, v, ok, extra = "") => bericht.push(`${ok === null ? "  ·" : ok ? "  ✓" : "  ✗"} ${k}: ${v}${extra ? "  (" + extra + ")" : ""}`);
  bericht.push(`TIER-SONDE ${art.id} (${art.de}) — Datei ${art.datei || o.art || "?"}`);
  /* (d) Größe, Zeit, Filter */
  bericht.push("(d) Größe und Leistung");
  zeile("Größe fein", `${(fein.bytes / 1024).toFixed(1)} KB`, fein.bytes <= 70 * 1024 * (/saurier|rex|raptor|stego|tricera|brachio|diplo|ankylo|para|spino|allo|pteran/i.test(art.id) ? 90 / 70 : 1), "Ziel ≤ 70 KB, Saurier ≤ 90 KB");
  zeile("Größe Szene", `${(szene.bytes / 1024).toFixed(1)} KB`, szene.bytes <= 25 * 1024, "Ziel ≤ 25 KB");
  const filterSz = (szene.defs.match(/<filter/g) || []).length, filterFein = (fein.defs.match(/<filter/g) || []).length;
  zeile("Filter im Szene-Modus", filterSz, filterSz === 0, `fein: ${filterFein}`);
  zeile("zeichne() fein / Szene", `${fein.ms.toFixed(0)} ms / ${szene.ms.toFixed(0)} ms`, fein.ms < 1000);
  /* (c) Verbote */
  bericht.push("(c) Verbote");
  for (const [k, n, ok, extra] of verbote(art, fein)) zeile(k, n, ok, extra);

  if (o.nurText) return { bericht, fein, szene };
  /* ---------- Render: Silhouette (schwarz), Graustufen, Skelett ---------- */
  const { chromium } = require("/tmp/claude-0/node_modules/playwright");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 1200, height: 900 } });
  const rand = 4, bw = x1 - x0 + 2 * rand, bh = y1 - y0 + 2 * rand;
  const px = Math.min(1100 / bw, 800 / bh), W = Math.round(bw * px), H = Math.round(bh * px);
  const vb = `${x0 - rand} ${y0 - rand} ${bw} ${bh}`;
  const svgDoc = (inhalt, defs, hg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${H}"><defs>${defs}<filter id="sdSchwarz" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter></defs>${hg ? `<rect x="${x0 - rand}" y="${y0 - rand}" width="${bw}" height="${bh}" fill="${hg}"/>` : ""}${inhalt}</svg>`;
  const tR0 = Date.now();
  await pg.setContent(`<html><body style="margin:0;background:#fff">${svgDoc(z.svg, fein.defs, "#ffffff")}</body></html>`);
  await pg.screenshot({ path: path.join(o.aus, art.id + "-farbe.png"), clip: { x: 0, y: 0, width: W, height: H } });
  const renderMs = Date.now() - tR0;
  zeile("Render im Browser (fein, inkl. Bildschirmfoto)", `${renderMs} ms`, renderMs < 1000);
  /* (a) Silhouette */
  const sil = svgDoc(`<g filter="url(#sdSchwarz)">${z.svg}</g>`, fein.defs, null);
  await pg.setContent(`<html><body style="margin:0;background:#fff">${sil}</body></html>`);
  await pg.screenshot({ path: path.join(o.aus, art.id + "-silhouette.png"), clip: { x: 0, y: 0, width: W, height: H } });
  const alpha = await pixel(pg, sil, W, H, "alpha");
  /* Graustufen (auf neutralem Grau, damit helles Fell nicht mit dem Grund verschmilzt) */
  const grauDoc = svgDoc(z.svg, fein.defs, null);
  await pg.setContent(`<html><body style="margin:0;background:#8a8a8a"><div style="filter:grayscale(1)">${svgDoc(z.svg, fein.defs, "#8a8a8a")}</div></body></html>`);
  await pg.screenshot({ path: path.join(o.aus, art.id + "-grau.png"), clip: { x: 0, y: 0, width: W, height: H } });
  const lum = await pixel(pg, grauDoc, W, H, "lum");
  /* Hilfen: cm → Pixel, Spaltenabtastung */
  const PX = (x) => Math.round((x - (x0 - rand)) * px), PY = (y) => Math.round((y - (y0 - rand)) * px);
  const deckt = (i, j) => i >= 0 && j >= 0 && i < W && j < H && alpha[j * W + i] > 127;
  const oben = (i) => { for (let j = 0; j < H; j++) if (deckt(i, j)) return j; return null; };
  const ersterLauf = (i) => { const a = oben(i); if (a === null) return null; let b = a; while (b + 1 < H && deckt(i, b + 1)) b++; return [a, b]; };
  const boden = PY(0);
  bericht.push("(a) Silhouette gegen den Bauplan" + (sk ? ` (${sk.bauplan}, W = ${sk.W} cm)` : " – kein Skelett (alte Art): nur Umrissmaße"));
  if (sk) {
    const Wpx = sk.W * px, lm = sk.lm, bp = sk.masse;
    const vgl = (name, ist, soll, einheit = "W") => { const abw = (ist - soll) / soll; zeile(name, `${ist.toFixed(2)} ${einheit} (Bauplan ${soll.toFixed(2)}, ${abw >= 0 ? "+" : ""}${(abw * 100).toFixed(0)} %)`, Math.abs(abw) <= 0.05); };
    /* Widerrist und Kruppe: Oberkante der Silhouette an der Landmarke */
    const hWid = (boden - oben(PX(lm.widerrist[0]))) / Wpx, hKr = (boden - oben(PX(lm.kruppe[0]))) / Wpx;
    vgl("Widerristhöhe (gemessen, mit Fell)", hWid, 1);
    vgl("Kruppe / Widerrist", hKr / hWid, bp.kruppe);
    /* Bauchfreiheit: tiefster Punkt des oberen Laufs (Rumpf) zwischen Ellbogen und Kniefalte, Spalten mit Bein übersprungen */
    let unter = null;
    const xa = PX(lm.flanke[0]), xb = PX(sk.beine.vn.extra.ellbogenhoecker[0]);
    /* nur die mittleren 60 % zwischen Flanke und Ellbogen (an den Rändern biegt der Umriss schon in die Läufe) */
    const xm0 = Math.min(xa, xb) + Math.round(Math.abs(xb - xa) * 0.2), xm1 = Math.max(xa, xb) - Math.round(Math.abs(xb - xa) * 0.2);
    for (let i = xm0; i <= xm1; i++) { const r = ersterLauf(i); if (!r || r[1] >= boden - 2) continue; if (unter === null || r[1] > unter) unter = r[1]; }
    if (unter !== null) vgl("Bauchfreiheit / Widerrist (Brust)", (boden - unter) / Wpx / hWid, bp.bauchfreiheit);
    /* Rumpflänge: Bugspitze (vorderster Punkt in der Zeile) bis Gesäß. Liefert zeichne() den Körperumriss (z.umriss),
       wird am Umriss gemessen (die hängende Rute würde sonst als „Gesäß“ zählen), sonst an den Pixeln. */
    const zeileBug = PY(lm.bugspitze[1]), zeileSb = PY(lm.sitzbein[1]);
    let vorn = PX(lm.bugspitze[0]); while (deckt(vorn + 1, zeileBug)) vorn++;
    let hinten = PX(lm.sitzbein[0]); while (deckt(hinten - 1, zeileSb) && hinten > PX(lm.sitzbein[0] - sk.W * 0.15)) hinten--;
    if (z.umriss) {
      const U = z.umriss, imBand = (p, y, h) => Math.abs(p[1] - y) <= h;
      hinten = PX(Math.min(...U.filter((p) => imBand(p, lm.sitzbein[1], sk.W * 0.08) && p[0] < lm.sitzbein[0] + sk.W * 0.1).map((p) => p[0])));
      vorn = PX(Math.max(...U.filter((p) => imBand(p, lm.bugspitze[1], sk.W * 0.05) && p[0] < lm.bugspitze[0] + sk.W * 0.15).map((p) => p[0])));
    }
    vgl("Rumpflänge / Widerrist (Bug bis Gesäß, mit Fell)", (vorn - hinten) / Wpx, bp.rumpfL + 0.06);
    /* Kopf / Rumpf: Hinterhaupt bis Nasenspitze, waagerecht (am Umriss, sonst an den Pixeln um die Nasenhöhe) */
    let nase;
    if (z.umriss) nase = PX(Math.max(...z.umriss.filter((p) => p[0] > sk.kopf.hinterhaupt[0]).map((p) => p[0])));
    else { const kz = PY(sk.kopf.nase[1]); nase = PX(sk.kopf.nase[0]) - 10; for (let j = kz - 6; j <= kz + 6; j++) { let i = PX(sk.kopf.nase[0]) - 10; while (deckt(i + 1, j)) i++; nase = Math.max(nase, i); } }
    vgl("Kopf / Rumpf", (nase - PX(sk.kopf.hinterhaupt[0])) / (vorn - hinten), bp.kopfL * Math.cos((sk.kopf.winkel || 0) * Math.PI / 180) / (bp.rumpfL + 0.06));
    /* Sprunggelenk: Winkel aus dem Skelett; Fersenhöcker als hinterster Punkt des Hinterbeins zwischen Knie und Fessel */
    const hn = sk.beine.hn.p;
    zeile("Sprunggelenkwinkel (Skelett)", `${bp.sprungWinkel}°`, bp.sprungWinkel >= 110 && bp.sprungWinkel <= 160, "Säuger 130–150°, Katze ~120°");
    let fx = null, fy = null;
    if (z.umriss) {
      /* hinterster Umrisspunkt des Hinterbeins zwischen Knie und Fessel (nahe am Sprunggelenk) */
      for (const p of z.umriss) if (p[1] > hn.knie[1] && p[1] < hn.fessel[1] && Math.abs(p[0] - hn.sprung[0]) < sk.W * 0.15 && (fx === null || p[0] < fx)) { fx = p[0]; fy = PY(p[1]); }
    } else for (let j = PY(hn.knie[1]); j <= PY(hn.fessel[1]); j++) { let i = PX(hn.sprung[0]) - 1; if (!deckt(i, j)) continue; while (deckt(i - 1, j) && i > PX(hn.sprung[0] - sk.W * 0.2)) i--; if (fx === null || i < fx) { fx = i; fy = j; } }
    if (fy !== null) vgl("Fersenhöcker-Höhe (hinterster Punkt)", (boden - fy) / Wpx, bp.fersenH);
    zeile("Knie vor dem Hüftlot", `${(bp.knieVorHueftlot * 100).toFixed(0)} % W`, bp.knieVorHueftlot > 0);
    /* (b) Graustufen im Rumpf: Drittel zwischen Rückenlinie und Bauch, Spalten zwischen Flanke und Ellbogen */
    bericht.push("(b) Licht (Graustufen)");
    const dr = [[0, 0], [0, 0], [0, 0]], rueck = [0, 0], bauch = [0, 0];
    for (let i = Math.min(xa, xb); i <= Math.max(xa, xb); i++) {
      const r = ersterLauf(i); if (!r || r[1] >= boden - 2) continue;
      const h = r[1] - r[0];
      for (let j = r[0]; j <= r[1]; j++) {
        const l = lum[j * W + i]; if (l < 0) continue;
        const k = Math.min(2, Math.floor((j - r[0]) / (h / 3 || 1))); dr[k][0] += l; dr[k][1]++;
        if (j - r[0] < h * 0.15) { rueck[0] += l; rueck[1]++; }
        if (r[1] - j < h * 0.15) { bauch[0] += l; bauch[1]++; }
      }
    }
    const m = dr.map(([s, n]) => (n ? s / n : 0));
    const dunkelst = m.indexOf(Math.min(...m));
    zeile("Rumpf-Drittel (oben / Mitte / unten, Helligkeit 0–255)", m.map((v) => v.toFixed(0)).join(" / "), dunkelst === 2, dunkelst === 2 ? "dunkelstes unten" : "dunkelstes NICHT unten");
    const rv = rueck[1] ? rueck[0] / rueck[1] : 0, bv = bauch[1] ? bauch[0] / bauch[1] : 0;
    zeile("Rücken heller als Bauch", `${rv.toFixed(0)} gegen ${bv.toFixed(0)}`, rv > bv);
    /* Skelett-Bild: Knochen über der Silhouette */
    let lin = "";
    const L = (p, q, f, w) => { lin += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`; };
    for (const [wo, f] of [["vf", "#7aa6ff"], ["hf", "#7aa6ff"], ["vn", "#ff4d4d"], ["hn", "#ff4d4d"]]) { const k = sk.beine[wo].kette; for (let i = 0; i < k.length - 1; i++) L(k[i], k[i + 1], f, 0.9); }
    L(lm.hueftHoecker, lm.sitzbein, "#ffb000", 1); L(sk.ruecken[0], sk.ruecken[sk.ruecken.length - 1], "#ffb000", 0.6);
    for (let i = 0; i < sk.hals.kette.length - 1; i++) L(sk.hals.kette[i], sk.hals.kette[i + 1], "#3fd16f", 1);
    L(sk.kopf.hinterhaupt, sk.kopf.nase, "#3fd16f", 1);
    for (let i = 0; i < sk.schwanz.kette.length - 1; i++) L(sk.schwanz.kette[i], sk.schwanz.kette[i + 1], "#c070ff", 0.8);
    let pk = ""; for (const n of Object.keys(lm)) pk += `<circle cx="${lm[n][0]}" cy="${lm[n][1]}" r="1.1" fill="#ffe000" stroke="#000" stroke-width=".3"/>`;
    const skel = svgDoc(`<g opacity=".35">${z.svg}</g>${lin}${pk}<line x1="${x0 - rand}" y1="0" x2="${x1 + rand}" y2="0" stroke="#000" stroke-width=".4"/>`, fein.defs, "#ffffff");
    await pg.setContent(`<html><body style="margin:0">${skel}</body></html>`);
    await pg.screenshot({ path: path.join(o.aus, art.id + "-skelett.png"), clip: { x: 0, y: 0, width: W, height: H } });
  } else {
    /* alte Arten: Umriss-Box und grobe Lichtprüfung im mittleren Rumpfbereich (mittlere 40 % der Länge) */
    zeile("Box (cm)", `${(x1 - x0).toFixed(0)} × ${(y1 - y0).toFixed(0)}`, null);
    bericht.push("(b) Licht (Graustufen, grob: mittlere 40 % der Länge, oberer Lauf)");
    const dr = [[0, 0], [0, 0], [0, 0]];
    for (let i = Math.round(W * 0.3); i < Math.round(W * 0.7); i++) {
      const r = ersterLauf(i); if (!r) continue; const h = r[1] - r[0];
      for (let j = r[0]; j <= r[1]; j++) { const l = lum[j * W + i]; if (l < 0) continue; const k = Math.min(2, Math.floor((j - r[0]) / (h / 3 || 1))); dr[k][0] += l; dr[k][1]++; }
    }
    const m = dr.map(([s, n]) => (n ? s / n : 0)), dunkelst = m.indexOf(Math.min(...m));
    zeile("Drittel (oben / Mitte / unten)", m.map((v) => v.toFixed(0)).join(" / "), dunkelst === 2);
  }
  await br.close();
  return { bericht, fein, szene };
}

if (require.main === module) {
  const arg = process.argv.slice(2);
  const wert = (k, d) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : d; };
  const id = arg[0] && !arg[0].startsWith("--") ? arg[0] : null;
  const datei = wert("--art", null);
  const aus = wert("--aus", "/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/tiere880/sonde");
  fs.mkdirSync(aus, { recursive: true });
  let arten;
  if (datei) { const p = path.resolve(datei); delete require.cache[p]; arten = require(p).map((a) => Object.assign({ datei: path.basename(p) }, a)); }
  else arten = kern.alleArten();
  const liste = arg.includes("--alle") ? arten : arten.filter((a) => a.id === id);
  if (!liste.length) { console.error("Art nicht gefunden: " + id); process.exit(1); }
  (async () => {
    for (const art of liste) {
      const r = await pruefe(art, { aus, art: datei, nurText: arg.includes("--alle") });
      const text = r.bericht.join("\n");
      console.log(text + "\n");
      if (!arg.includes("--alle")) { fs.writeFileSync(path.join(aus, art.id + ".txt"), text + "\n"); console.log("PNGs: " + ["farbe", "silhouette", "grau", "skelett"].map((k) => path.join(aus, art.id + "-" + k + ".png")).join(", ")); }
    }
  })().catch((e) => { console.error(e); process.exit(1); });
}
module.exports = { pruefe, verbote, zeichneArt };
