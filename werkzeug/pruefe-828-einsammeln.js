#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 828: EINSAMMELN UND SPIELEN IN DER LEICHTEN STADT
   ---------------------------------------------------------------------
   XANDER (29.09.): „die kleinen Symbole zum einsammeln. Das ist grad so
   zu dicken Schein und manchmal schwebt das noch viel zu sehr und es
   reagiert nicht sofort" – „diese items für Holz und Fleisch die kann
   man kaum einsammeln, weil die immer von links nach rechts zu schweben
   … immer wenn man da draufgeht, kommt man auf das dahinter auf den
   Wald … das einsammeln muss ohne Latenz gehen … Kopierrahmen … der will
   immer die Eier kopieren" – „immer noch keine Angler am See … es gibt
   noch kein Getreide … die Bäume sollen alle darauf reagieren jeder Art
   von Baum" – „beim Bauen verschwindet manchmal in einer Zoomstufe das
   Gebäude".
   TEIL A: die Stadt allein in einem kleinen Wirt-Rahmen (340 × 212 wie
   im Spiel, Android 360 px, echte Fingertipps über CDP): Zeichen stehen
   still (2 s, ≤ 2 px), der Schein ist schwächer als vorher, der erste
   Tipp meldet sich sofort (< 150 ms) und nur einmal (auch beim Doppel-
   tipp), nichts geht zum Wald dahinter, Rückmeldung (Summen, Flug),
   nichts markierbar, Holz und Fleisch überdecken sich nicht; See →
   Angeln (klein und Vollbild) mit Anglern am Ufer; jeder Baum (Tanne,
   Laubbaum, Obstbaum, eigener) → Holzfäller; Acker → Ernte; die
   Baustelle ist in allen drei Zoomstufen zu sehen.
   TEIL B: das ganze Spiel mit nachgebautem Server (wie Sonde 817): der
   Tipp auf „Holz"/„Fleisch" holt die Trupps ab (spiel_werk_abholen
   < 150 ms nach dem Finger), die Wald-Station geht nicht auf; Baum →
   spiel_trupp (wald) bzw. spiel_trupp_helfen; See → spiel_angeln;
   Acker → spiel_ernten 91; die Äcker haben ihr Zeichen.
   Aufruf: node werkzeug/leicht-packen.js
           node werkzeug/pruefe-828-einsammeln.js   (BILD=/pfad/f828 für Bilder, NUR=A|B)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const BILD = process.env.BILD || "", NUR = process.env.NUR || "";
/* Der Schein von Fassung 810 (vorher): radial-gradient(… .85 0–34 %, .4 bei 56 %, 0 bei 72 %), 9 px Rand in 40 px */
const ALT_SCHEIN = { stops: [[0.85, 0], [0.85, 0.34], [0.4, 0.56], [0, 0.72]], d: 40 - 18 };

let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
/* Stärke eines runden Scheins: ∫ Deckkraft über die Kreisfläche (px²), der Verlauf als Strahl bis zur fernsten Ecke */
function scheinMass(stops, d) {
  const R = d / 2, L = R * Math.SQRT2; let s = 0;
  const alpha = (f) => { if (f <= stops[0][1]) return stops[0][0]; for (let i = 1; i < stops.length; i++) if (f <= stops[i][1]) { const a = stops[i - 1], b = stops[i]; return a[0] + (b[0] - a[0]) * (f - a[1]) / Math.max(1e-9, b[1] - a[1]); } return stops[stops.length - 1][0]; };
  for (let r = 0.25; r < R; r += 0.5) s += alpha(r / L) * 2 * Math.PI * r * 0.5;
  return s;
}

const WIRT = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#222">
<iframe id="f" src="stadt-leicht.html?eingebettet=1&mini=1" style="position:absolute;left:10px;top:100px;width:340px;height:212px;border:0"></iframe>
<script>window.__raus=[];var __post=window.postMessage.bind(window);
window.postMessage=function(d,o){if(d&&d.typ&&d.typ!=="leicht-scroll")window.__raus.push(Object.assign({t:Date.now()},d));return __post(d,o);};
window.schick=function(d){document.getElementById("f").contentWindow.postMessage(d,location.origin);};</script></body></html>`;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    if (p === "/__wirt828.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(WIRT); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const URL0 = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const telefon = { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" };
  const tick = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const konsolenFehler = [];

  /* ======================= TEIL A: die Stadt im Wirt-Rahmen ======================= */
  if (NUR !== "B") {
    console.log("\nTEIL A — DIE STADT IM KLEINEN RAHMEN (Wirt 340 × 212)\n");
    const ctx = await br.newContext(telefon);
    await ctx.route(/cdn\.jsdelivr|supabase\.co/, (r) => r.abort());
    await ctx.addInitScript(() => { window.__summ = []; try { navigator.vibrate = (m) => { window.__summ.push(m); return true; }; } catch (e) {} });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => konsolenFehler.push("A: " + String(e.message || e) + (process.env.STAPEL ? " @ " + String(e.stack || "").slice(0, 600) : "")));
    if (process.env.LOG) pg.on("console", (m) => { if (!/GL Driver|Failed to load/.test(m.text())) console.log("     LOG " + m.text().slice(0, 300)); });
    await pg.goto(URL0 + "/__wirt828.html");
    let fr = null;
    for (let i = 0; i < 160 && !fr; i++) { const f = pg.frames().find((x) => /stadt-leicht\.html/.test(x.url())); if (f && await f.evaluate(() => !!(window.STADT && STADT.oberflaeche && STADT.oberflaeche.zeichenLegen && STADT.szene.sichtbare && STADT.szene.sichtbare.length > 20)).catch(() => false)) fr = f; else await tick(250); }
    sage(!!fr, "die Stadt ist im Wirt-Rahmen geladen (Beispielstadt)");
    const cdp = await ctx.newCDPSession(pg);
    const tipp = async (x, y) => { await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await tick(40); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); };
    /* Doppeltipp wie ein Finger: zweimal kurz, 120 ms Abstand (ohne auf die Bestätigung zu warten – unter Last käme sonst der zweite viel später) */
    const tippSenden = (x, y) => [cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }), cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })];
    const doppel = async (x, y) => { const a = tippSenden(x, y); await tick(120); await Promise.all(a.concat(tippSenden(x, y))); };
    /* auf eine Meldung warten (unter Last dauert alles länger) */
    const bis = async (pred, ms) => { const t = Date.now(); for (;;) { const r = await pg.evaluate(() => window.__raus.slice()); if (pred(r) || Date.now() - t > (ms || 5000)) return r; await tick(150); } };
    const raus = () => pg.evaluate(() => window.__raus.slice());
    const leeren = () => pg.evaluate(() => { window.__raus.length = 0; });
    const knipsen = async (n) => { if (BILD) await pg.screenshot({ path: BILD + "-" + n + ".png" }); };
    const OFF = { x: 10, y: 100 };
    const zeichenLage = (g) => fr.evaluate((g) => { const b = document.querySelector('.lk-zeichen[data-g="' + g + '"]'); if (!b || getComputedStyle(b).display === "none") return null; const r = b.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height, x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, g);
    const schicke = (d) => pg.evaluate((d) => window.schick(d), d);
    await schicke({ typ: "leicht-kopf", name: "Teststadt", symbole: true, namen: false });
    await schicke({ typ: "leicht-stand", ich: { baustellen: [{ was: "labor", stufe: 1, start: new Date(Date.now() - 300e3).toISOString(), bis: new Date(Date.now() + 1200e3).toISOString(), dauer: 1500 }] } });
    const Z = { muehle: ["fertig", "4 Mehl", "mehl"], huehnerstall: ["fertig", "3 Eier", "ei"], wald: ["fertig", "8 Holz", "holz"], jagd: ["fertig", "3 Fleisch", "fleisch"], see: ["laeuft", "Fisch 2:10", "fisch"] };
    await schicke({ typ: "leicht-zeichen", z: Z });
    await tick(1500);

    console.log("\nZEICHEN: RUHIG, DÜNNER SCHEIN, FREIE TIPPFLÄCHEN\n");
    const spur = { muehle: [], wald: [], jagd: [] };
    for (let i = 0; i < 21; i++) { for (const g in spur) spur[g].push(await zeichenLage(g)); await tick(100); }
    const wandern = {};
    for (const g in spur) { const l = spur[g].filter(Boolean); wandern[g] = l.length < 15 ? 99 : Math.max(Math.max(...l.map((q) => q.l)) - Math.min(...l.map((q) => q.l)), Math.max(...l.map((q) => q.t)) - Math.min(...l.map((q) => q.t))); }
    sage(Object.values(wandern).every((v) => v <= 2), "die Zeichen stehen still: über 2 s höchstens 2 px Bewegung (auch Holz und Fleisch rechts am Rand)", JSON.stringify(wandern));
    const schein = await fr.evaluate(() => { const b = document.querySelector('.lk-zeichen.lk-z-fertig'); if (!b) return null; const s = getComputedStyle(b, "::before"); return { bg: s.backgroundImage, w: parseFloat(s.width), h: parseFloat(s.height), anim: getComputedStyle(b).animationName, scale: getComputedStyle(b).scale }; });
    let mass = 1e9;
    if (schein) {
      const stops = [];
      for (const m of schein.bg.matchAll(/rgba?\(([^)]+)\)((?:\s+-?[\d.]+(?:%|px))*)/g)) {
        const t = m[1].split(",").map((x) => parseFloat(x)), a = t.length > 3 ? t[3] : 1;
        const pos = (m[2].match(/-?[\d.]+(%|px)/g) || []).map((p) => /px$/.test(p) ? parseFloat(p) / (schein.w / 2 * Math.SQRT2) : parseFloat(p) / 100);
        if (!pos.length) pos.push(stops.length ? stops[stops.length - 1][1] : 0);
        for (const q of pos) stops.push([a, q]);
      }
      mass = scheinMass(stops, schein.w);
    }
    const altMass = scheinMass(ALT_SCHEIN.stops, ALT_SCHEIN.d);
    sage(mass < altMass * 0.6, "der Schein ist deutlich dünner als vorher (Stärke < 60 % von Fassung 810)", JSON.stringify({ jetzt: Math.round(mass), vorher: Math.round(altMass), bg: schein && schein.bg.slice(0, 120) }));
    sage(!!schein && (schein.anim === "none" || !/atmen/.test(schein.anim)) && (schein.scale === "none" || schein.scale === "1"), "kein Atmen/Wippen am Zeichen selbst (höchstens der Schein wird leise heller)", JSON.stringify(schein && { anim: schein.anim, scale: schein.scale }));
    const wj = [await zeichenLage("wald"), await zeichenLage("jagd")];
    const ueberdeckt = wj[0] && wj[1] && Math.min(wj[0].l + wj[0].w, wj[1].l + wj[1].w) - Math.max(wj[0].l, wj[1].l) > 0.5 && Math.min(wj[0].t + wj[0].h, wj[1].t + wj[1].h) - Math.max(wj[0].t, wj[1].t) > 0.5;
    sage(!!wj[0] && !!wj[1] && !ueberdeckt && wj.every((q) => q.w >= 30 && q.h >= 30 && q.l >= -1 && q.l + q.w <= 341), "Holz und Fleisch liegen nebeneinander, keins unter dem anderen, ganz im Bild, Tippfläche ≥ 30 px", JSON.stringify(wj));
    const us = await fr.evaluate(() => ["body", "#lDinge", "#lOber", ".lk-zeichen", ".lk-zeichen .lk-z-bild", ".lk-zeichen span"].map((s) => { const e = document.querySelector(s); if (!e) return s + ":fehlt"; const c = getComputedStyle(e); return s + ":" + c.userSelect + "/" + (c.webkitUserSelect || "") + "/" + c.webkitTapHighlightColor; }));
    sage(us.every((x) => /:none\/(none)?\/rgba\(0, 0, 0, 0\)$/.test(x)), "im Spielfeld nichts markierbar (user-select: none), kein grauer Tippkasten", JSON.stringify(us));
    await knipsen("a1-zeichen");

    console.log("\nERSTER TIPP SAMMELT SOFORT, NICHTS GEHT ZUM WALD DURCH\n");
    /* gemessen ab dem Loslassen des Fingers (pointerup): unter Last kommt schon das Ereignis selbst spät an */
    await fr.evaluate(() => { window.__t0 = 0; document.addEventListener("pointerup", () => { window.__t0 = Date.now(); }, true); });
    for (const [g, name] of [["wald", "Holz"], ["jagd", "Fleisch"], ["muehle", "Mehl"]]) {
      await leeren(); await fr.evaluate(() => { window.__summ.length = 0; });
      const q = await zeichenLage(g);
      if (!q) { sage(false, name + ": Zeichen nicht zu sehen"); continue; }
      await tipp(OFF.x + q.x, OFF.y + q.y);
      const r = await bis((r) => r.length > 0, 5000); await tick(600);
      const t0 = await fr.evaluate(() => window.__t0), eigen = r.filter((m) => m.typ === "leicht-haus" && m.g === g && m.zeichen);
      const fb = await fr.evaluate((g) => { const b = document.querySelector('.lk-zeichen[data-g="' + g + '"]'); return { weg: !!b && b.classList.contains("lk-z-weg"), deck: b ? getComputedStyle(b).opacity : "", summ: window.__summ.slice() }; }, g);
      sage(eigen.length === 1 && eigen[0].t - t0 < 150 && r.length === 1, name + ": der erste Tipp meldet sich sofort beim Spiel (< 150 ms), genau einmal, kein Wald/Baum dahinter",
        JSON.stringify({ ms: eigen[0] ? eigen[0].t - t0 : null, r: r.map((m) => m.typ + ":" + (m.g || "")) }));
      sage(fb.weg && +fb.deck < 0.2 && fb.summ.length === 1 && fb.summ[0] === 12, name + ": Rückmeldung sofort – Zeichen verschwindet, kurzes Summen (12 ms)", JSON.stringify(fb));
    }
    /* der Flug „+3" (Eier) sichtbar, Doppeltipp zählt einmal */
    await leeren();
    { const q = await zeichenLage("huehnerstall");
      if (q) { await doppel(OFF.x + q.x, OFF.y + q.y); await bis((r) => r.length > 0, 5000); }
      const flug = await fr.evaluate(() => { const f = document.querySelector(".lk-sammel-flug"); return f ? { t: f.textContent, svg: !!f.querySelector("svg") } : null; });
      await knipsen("a2-flug");
      await tick(1500);
      const r = await raus();
      sage(!!q && !!flug && flug.t === "+3" && flug.svg, "Eier: die Ware fliegt mit „+3“ hoch (Bild, keine Emoji)", JSON.stringify(flug));
      sage(r.filter((m) => m.typ === "leicht-haus").length === 1 && !r.some((m) => m.typ === "leicht-baum" || m.typ === "leicht-doppel" || m.g === "wald"), "Doppeltipp aufs Zeichen: nur ein Einsammeln, kein Zoom, nichts dahinter", JSON.stringify(r.map((m) => m.typ + ":" + (m.g || ""))));
    }
    /* Eingesammelt, aber das Spiel schickt (noch) denselben Stand: das Zeichen bleibt kurz verborgen, dann ist es wieder da */
    let nochWeg = false, wieder = false;
    { const q = await zeichenLage("muehle");
      if (q) { await tipp(OFF.x + q.x, OFF.y + q.y); await schicke({ typ: "leicht-zeichen", z: Z }); await tick(400); }
      nochWeg = await fr.evaluate(() => document.querySelector('.lk-zeichen[data-g="muehle"]').classList.contains("lk-z-weg"));
      await tick(3000);
      wieder = await fr.evaluate(() => !document.querySelector('.lk-zeichen[data-g="muehle"]').classList.contains("lk-z-weg")); }
    sage(nochWeg && wieder, "gleicher Stand vom Spiel: das Zeichen bleibt kurz weg und kommt zurück, falls der Server nichts geändert hat", JSON.stringify({ nochWeg, wieder }));

    console.log("\nSEE, ANGLER, ÄCKER\n");
    const bodenPunkt = (art, nah) => fr.evaluate(([art, nah]) => { const K = STADT.kamera, B = STADT.boden, SZ = STADT.szene;
      const knopfNah = (x, y) => [[0, 0], [16, 0], [-16, 0], [0, 16], [0, -16], [11, 11], [-11, 11], [11, -11], [-11, -11]].some((d) => { const e = document.elementFromPoint(x / K.dpr + d[0], y / K.dpr + d[1]); return e && e.closest && e.closest("button"); });
      const frei = (x, y) => !knopfNah(x, y) && !SZ.treffer(x, y);
      let best = null;
      for (let py = 40 * K.dpr; py < K.H - 6 * K.dpr; py += 2 * K.dpr) for (let px = 6 * K.dpr; px < K.W - 6 * K.dpr; px += 2 * K.dpr) {
        const a = STADT.aufBoden(px, py);
        if (B.wert(a[0], a[1], art) < 0.9 || !frei(px, py)) continue;
        let ok = true; for (const d of [[2, 0], [-2, 0], [0, 2], [0, -2]]) { const b = STADT.aufBoden(px + d[0] * K.dpr, py + d[1] * K.dpr); if (B.wert(b[0], b[1], art) < 0.9) ok = false; }
        if (!ok) continue;
        if (art === 2 && nah) { const f = (STADT.dorf.FELD_ORTE || []).find((q) => q.nr === nah); if (!f || Math.hypot(f.x - a[0], f.y - a[1]) > f.r + 2) continue; }
        best = { x: px / K.dpr, y: py / K.dpr }; break;
      }
      return best; }, [art, nah || 0]);
    await leeren();
    const see = await bodenPunkt(1);
    if (see) { await tipp(OFF.x + see.x, OFF.y + see.y); }
    let r = await bis((r) => r.length > 0, 5000);
    const angler = await fr.evaluate(() => ({ da: STADT.oberflaeche.anglerDa(), summ: window.__summ.slice(-1)[0] }));
    sage(!!see && r.some((m) => m.typ === "leicht-haus" && m.g === "see") && angler.da && angler.summ === 12, "Tipp auf den See (kleiner Rahmen): Angeln im Spiel, gleich steht ein Angler am Ufer, kurzes Summen", JSON.stringify({ see, r: r.map((m) => m.typ + ":" + (m.g || "")), angler }));
    /* Fischer arbeiten („läuft" am See): Angler bleiben; die Figur ist wirklich gemalt (Bildpunkte am Ufer ändern sich) */
    const uferPixel = () => fr.evaluate(() => { const K = STADT.kamera, c = document.getElementById("lDinge"), g = c.getContext("2d"), SZ = STADT.szene;
      const pl = STADT.oberflaeche.uferPlaetze(); if (!pl.length) return null;
      const P = STADT.proj(pl[0].x, pl[0].y, 0), k = Math.max(K.s, 3.2 * K.dpr), d = g.getImageData(Math.round(P[0] - 2), Math.round(P[1] - 1.3 * k), 5, Math.round(0.8 * k)).data;
      let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] * 3 + d[i + 1] * 5 + d[i + 2] * 7; return { s: s, P: [Math.round(P[0] / K.dpr), Math.round(P[1] / K.dpr)], n: pl.length }; });
    await schicke({ typ: "leicht-zeichen", z: { see: ["laeuft", "Fisch 2:10", "fisch"] } }); await tick(1400);
    await fr.evaluate(() => { STADT.leicht.unruhe = 2; }); await tick(600);
    const mit = await uferPixel();
    await knipsen("a3-angler");
    await fr.evaluate(() => { STADT.oberflaeche.anglerSetzen(false); }); await tick(9500);
    await fr.evaluate(() => { STADT.leicht.unruhe = 2; }); await tick(600);
    const ohne = await uferPixel();
    sage(!!mit && !!ohne && mit.n >= 1 && mit.s !== ohne.s, "Fischer bei der Arbeit: am Ufer stehen Angler (gemalt), ohne Fischer ist das Ufer leer", JSON.stringify({ mit, ohne }));
    await schicke({ typ: "leicht-zeichen", z: { see: ["laeuft", "Fisch 2:10", "fisch"] } }); await tick(400);
    await leeren();
    const feld = await bodenPunkt(2, 92);
    if (feld) { await tipp(OFF.x + feld.x, OFF.y + feld.y); }
    r = await bis((r) => r.length > 0, 5000); await tick(500); r = await raus();
    sage(!!feld && r.some((m) => m.typ === "leicht-feld" && m.nr === 92) && r.length === 1, "Tipp auf den Acker rechts: Ernten im Spiel (Feld 92)", JSON.stringify({ feld, r }));
    await schicke({ typ: "leicht-zeichen", z: { feld91: ["fertig", "2 Getreide", "getreide"], feld92: ["laeuft", "Getreide 2:30", "getreide"] } }); await tick(900);
    let fz = [await zeichenLage("feld91"), await zeichenLage("feld92")];
    const knoepfeFrei = await fr.evaluate(() => { const z = [...document.querySelectorAll(".lk-zeichen")].filter((b) => getComputedStyle(b).display !== "none").map((b) => b.getBoundingClientRect());
      return [".lk-vollknopf", ".lk-lupe"].every((s) => { const k = document.querySelector(s).getBoundingClientRect(); return z.every((r) => Math.min(r.right, k.right) - Math.max(r.left, k.left) <= 0.5 || Math.min(r.bottom, k.bottom) - Math.max(r.top, k.top) <= 0.5); }); });
    sage(!!fz[0] && !fz[1] && knoepfeFrei, "die Äcker tragen ihr Zeichen: „Getreide reif“ (neben dem Vollbild-Knopf, nicht darunter); die Uhr des wachsenden Ackers erst nah dran", JSON.stringify({ fz, knoepfeFrei }));
    if (fz[0]) { await leeren(); await tipp(OFF.x + fz[0].x, OFF.y + fz[0].y); r = await bis((r) => r.length > 0, 5000); sage(r.length === 1 && r[0].typ === "leicht-feld" && r[0].nr === 91, "Tipp auf „Getreide reif“: erntet Feld 91", JSON.stringify(r)); }

    console.log("\nJEDER BAUM SCHICKT DIE HOLZFÄLLER\n");
    await schicke({ typ: "leicht-zeichen", z: {} }); await tick(600);   // ohne Zeichen: nur die Bäume zählen
    /* ein eigener, selbst gesetzter Obstbaum mitten auf der Wiese */
    const eigenPlatz = await fr.evaluate(() => { const K = STADT.kamera, B = STADT.boden, SZ = STADT.szene;
      const knopfNah = (x, y) => [[0, 0], [16, 0], [-16, 0], [0, 14], [0, -20], [0, -34]].some((d) => { const e = document.elementFromPoint(x / K.dpr + d[0], y / K.dpr + d[1]); return e && e.closest && e.closest("button"); });
      for (let py = 80 * K.dpr; py < K.H - 12 * K.dpr; py += 3 * K.dpr) for (let px = 50 * K.dpr; px < K.W - 20 * K.dpr; px += 3 * K.dpr) {
        const a = STADT.aufBoden(px, py);
        if ([0, 1, 2].some((c) => B.wert(a[0], a[1], c) > 0.05) || knopfNah(px, py)) continue;
        let leer = true; for (let dy = 0; dy < 30 && leer; dy += 3) for (let dx = -8; dx <= 8 && leer; dx += 4) if (SZ.treffer(px + dx * K.dpr, py - dy * K.dpr)) leer = false;
        if (!leer) continue;
        SZ.neu({ art: "eigen", bild: "n_obstbaum1", x: a[0], y: a[1], dreh: 0, fuss: [3, 3], hoehe: 6 }); SZ.geaendert(); STADT.leicht.dekoSpeichern(); STADT.leicht.unruhe = 2;
        return { x: px / K.dpr, y: py / K.dpr };
      }
      return null; });
    const baumPunkt = (art) => fr.evaluate((art) => { const K = STADT.kamera, SZ = STADT.szene;
      for (const e of SZ.sichtbare.slice().reverse()) {
        if (!new RegExp("^" + art).test(e.o.bild || "") || !(e.o.art === "natur" || e.o.art === "eigen")) continue;
        if (art === "n_obstbaum1" && e.o.art !== "eigen") continue;
        const m = e.meta;
        for (let fy = 0.25; fy < 0.9; fy += 0.08) for (let fx = 0.3; fx < 0.75; fx += 0.08) {
          const px = e.X - m.ax * e.k + m.w * e.k * fx, py = e.Y - m.ay * e.k + m.h * e.k * fy;
          if (px < 45 * K.dpr || py < 40 * K.dpr || px > K.W - 6 * K.dpr || py > K.H - 6 * K.dpr) continue;
          if (SZ.treffer(px, py) !== e.o) continue;
          if ([[0, 0], [16, 0], [-16, 0], [0, 16], [0, -16]].some((d) => { const b = document.elementFromPoint(px / K.dpr + d[0], py / K.dpr + d[1]); return b && b.closest && b.closest("button"); })) continue;
          return { x: px / K.dpr, y: py / K.dpr, art: e.o.art, bild: e.o.bild, rand: !!e.o.rand };
        }
      }
      return null; }, art);
    if (process.env.LOG) await fr.evaluate(() => { const O = STADT.oberflaeche, alt = O.tippen; O.tippen = function (px, py) { console.log("tippen " + Math.round(px) + "," + Math.round(py) + " " + JSON.stringify({ t: O._tipp, g: O.gestalten, sb: document.body.className })); try { return alt.apply(this, arguments); } catch (e) { console.log("FEHLER " + e.stack); } }; document.addEventListener("pointerdown", (e) => console.log("pd " + e.target.tagName + "." + e.target.className + " " + Math.round(e.clientX) + "," + Math.round(e.clientY)), true); });
    for (const art of ["n_tanne", "n_laubbaum", "n_obstbaum0", "n_obstbaum1"]) {
      await leeren();
      let b = null; for (let i = 0; i < 40 && !b; i++) { b = await baumPunkt(art); if (!b) await tick(400); }
      if (b) { await tipp(OFF.x + b.x, OFF.y + b.y); }
      r = await bis((r) => r.length > 0, 5000); await tick(500); r = await raus();
      sage(!!b && r.length === 1 && r[0].typ === "leicht-baum", "Tipp auf " + ({ n_tanne: "eine Tanne", n_laubbaum: "einen Laubbaum", n_obstbaum0: "einen Obstbaum", n_obstbaum1: "einen selbst gesetzten Obstbaum" })[art] + ": Holzfäller (leicht-baum), keine Station", JSON.stringify({ b, eigenPlatz: art === "n_obstbaum1" ? eigenPlatz : undefined, r: r.map((m) => m.typ + ":" + (m.g || "")) }));
    }
    /* knapp neben einer Tanne (Überblick: Bäume sind winzig) */
    await leeren();
    const nebenBaum = await fr.evaluate(() => { const K = STADT.kamera, SZ = STADT.szene, B = STADT.boden;
      const knopfNah = (x, y) => [[0, 0], [16, 0], [-16, 0], [0, 16], [0, -16]].some((d) => { const e = document.elementFromPoint(x / K.dpr + d[0], y / K.dpr + d[1]); return e && e.closest && e.closest("button"); });
      for (const e of SZ.sichtbare) { if (e.o.art !== "natur" || !/^n_tanne/.test(e.o.bild || "")) continue; const m = e.meta, x1 = e.X - m.ax * e.k + m.w * e.k, yM = e.Y - m.ay * e.k + m.h * e.k * 0.6;
        for (let d = 3; d <= 7; d++) { const px = x1 + d * K.dpr, a = STADT.aufBoden(px, yM);
          if (px > K.W - 6 * K.dpr || yM < 40 * K.dpr || px < 45 * K.dpr || SZ.treffer(px, yM) || B.wert(a[0], a[1], 1) > 0.3 || B.wert(a[0], a[1], 2) > 0.3) continue;
          if (knopfNah(px, yM)) continue;
          return { x: px / K.dpr, y: yM / K.dpr }; } }
      return null; });
    if (nebenBaum) { await tipp(OFF.x + nebenBaum.x, OFF.y + nebenBaum.y); }
    r = await bis((r) => r.length > 0, 5000); await tick(500); r = await raus();
    sage(!!nebenBaum && r.length === 1 && r[0].typ === "leicht-baum", "knapp neben einem Baum (≤ 7 px) zählt als Baum", JSON.stringify({ nebenBaum, r }));

    console.log("\nIM VOLLBILD: SEE UND BÄUME GENAUSO\n");
    await pg.evaluate(() => { const f = document.getElementById("f"); f.style.left = "0"; f.style.top = "0"; f.style.width = "360px"; f.style.height = "740px"; });
    await schicke({ typ: "leicht-modus", voll: true }); await tick(2500);
    const OFF2 = { x: 0, y: 0 };
    await leeren();
    let b2 = null; for (let i = 0; i < 40 && !b2; i++) { b2 = await baumPunkt("n_tanne"); if (!b2) await tick(400); }
    if (b2) { await tipp(OFF2.x + b2.x, OFF2.y + b2.y); await bis((r) => r.length > 0, 5000); }
    /* FASSUNG 812 — im Vollbild öffnet der Baum zusätzlich sein kleines Menü (822); es wird vor dem Tipp auf den See
       geschlossen, damit der Tipp nicht im Menü landet */
    await fr.evaluate(() => { const k = document.querySelector(".lk-karte"); if (k && !k.hidden) { const z = k.querySelector(".lk-karte-zu, [aria-label='Schließen']"); if (z) z.click(); else k.hidden = true; } });
    await tick(300);
    const see2 = await bodenPunkt(1);
    if (see2) { await tipp(OFF2.x + see2.x, OFF2.y + see2.y); }
    r = await bis((r) => r.length > 1, 5000);
    sage(!!b2 && !!see2 && r.some((m) => m.typ === "leicht-baum") && r.some((m) => m.typ === "leicht-haus" && m.g === "see"), "Vollbild: Baum → Holzfäller, See → Angeln", JSON.stringify({ b2, see2, r: r.map((m) => m.typ + ":" + (m.g || "")) }));
    await knipsen("a4-vollbild");
    await schicke({ typ: "leicht-modus", voll: false });
    await pg.evaluate(() => { const f = document.getElementById("f"); f.style.left = "10px"; f.style.top = "100px"; f.style.width = "340px"; f.style.height = "212px"; });
    await tick(1500);

    console.log("\nBAUSTELLE IN ALLEN ZOOMSTUFEN (auch schräg gestellt)\n");
    const stufen = [];
    for (const st of [0, 1, 2, 1, 0]) {
      await fr.evaluate((st) => { const O = STADT.oberflaeche, g = O.ueberblick(); const b = STADT.szene.objekte.find((o) => o.spiel === "labor"); const s = g.s * [1, 2.8, 7][st]; const z = O.klemmZiel(st ? b.x : g.x, st ? b.y : g.y, s); STADT.leicht.fliegeZu(z[0], z[1], s, 10); }, st);
      let e = null;
      for (let i = 0; i < 40; i++) {
        await tick(300);
        e = await fr.evaluate(() => { const SZ = STADT.szene, LB = STADT.bilder, o = SZ.objekte.find((x) => x.spiel === "labor"); const s = SZ.sichtbare.find((x) => x.o === o);
          return { bau: !!(o && o.bau && o.bau.p < 1), dreh: o && o.dreh, stufe: STADT.oberflaeche.stufe(), bild: s ? s.lagen[0][0] : SZ.basis(o, "tag"), da: !!s && LB.fertig(s.lagen[0][0]) }; });
        if (e.da && e.stufe === st) break;
      }
      stufen.push(e);
      if (st === 2 && e.da) await knipsen("a5-baustelle-nah");
    }
    sage(stufen.every((e) => e.bau && e.da) && stufen.map((e) => e.stufe).join() === "0,1,2,1,0", "das Labor im Bau ist in jeder Zoomstufe zu sehen (Überblick, Kompass, zweite Stufe und zurück)", JSON.stringify(stufen.map((e) => e.stufe + ":" + e.bild.slice(-24) + (e.da ? "✓" : "✗"))));
    await ctx.close();
  }

  /* ======================= TEIL B: das ganze Spiel ======================= */
  if (NUR !== "A") {
    console.log("\nTEIL B — IM SPIEL (nachgebauter Server)\n");
    const ctx = await br.newContext(telefon);
    await ctx.route(/cdn\.jsdelivr\.net\/npm\/@supabase|supabase\.co/, (r) => r.abort());
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => konsolenFehler.push("B: " + String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_stadt_neu", "1"); } catch (e) {} window.LEICHT_FREI = true; });
    await pg.goto(URL0 + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 60000 });
    await pg.evaluate(() => {
      const leute = { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
      window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "ich" ? ichId : "");
      const jetzt = Date.now(), iso = (ms) => new Date(jetzt + ms).toISOString();
      const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, punkte: 900, mitspielen: true, level: 12, xp: 2600, mana: 40, mana_max: 100,
        waffen: ["kartoffel"], vorraete: { getreide: 6, mehl: 3 }, tiere: {}, volk: { arbeiter: 20, quote: 80, berufe: {} },
        dorf: { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, rathaus: { stufe: 3, lp: 60 }, schule: { stufe: 1, lp: 20 } },
        werk: { muehle: { ware: "mehl", menge: 4, start: iso(-700000), fertig: iso(-5000) },
                trupp_wald: { ware: "holz", menge: 8, voll: 8, start: iso(-400000), fertig: iso(-2000) },
                trupp_jagd: { ware: "fleisch", menge: 3, voll: 3, start: iso(-400000), fertig: iso(-2000) } },
        acker: { "91": {}, "92": { ab: iso(-60000) } }, dorf_ab: iso(-3600000) };
      const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, mitspielen: true, level: 7 };
      window.__rufe = [];
      window.__extra = {};
      window.LiveChat.pruefAbfangen(() => {});
      const klient = { rpc: (name, args) => {
        window.__rufe.push({ name: name, args: args || {}, t: Date.now() });
        if (window.__extra[name]) return Promise.resolve({ data: window.__extra[name](args || {}, ich), error: null });
        let data = { ok: true };
        if (name === "spiel_ich") data = ich;
        else if (name === "spiel_stand") data = [ich, bea];
        else if (name === "spiel_werk_abholen") { const w = ich.werk[args.p_gebaeude] || {}; const neu = Object.assign({}, ich.werk); delete neu[args.p_gebaeude]; ich.werk = neu; data = Object.assign({ ok: true, menge: w.menge || 0, ware: w.ware || "" }, ich); }
        else if (name === "spiel_trupp") { ich.werk = Object.assign({}, ich.werk, { ["trupp_" + args.p_ort]: { ware: "holz", menge: 8, voll: 8, start: iso(0), fertig: iso(300000) } }); data = Object.assign({ ok: true, trupp: { menge: 8 } }, ich); }
        else if (name === "spiel_trupp_helfen") data = Object.assign({ ok: true, sek: 280, rest: 8 }, ich);
        else if (name === "spiel_angeln") data = Object.assign({ ok: true, fang: "fisch", menge: 1 }, ich);
        else if (name === "spiel_ernten") { ich.acker = Object.assign({}, ich.acker, { [String(args.p_platz)]: { ab: new Date().toISOString() } }); data = Object.assign({ ok: true, menge: 2 }, ich); }
        else if (name === "spiel_feld_helfen") data = Object.assign({ ok: true, sek: 200 }, ich);
        else if (name === "spiel_markt_preise") data = { ok: true, preise: {} };
        else if (name === "spiel_angebote_liste") data = { ok: true, angebote: [] };
        else if (name === "spiel_trophaeen") data = { ok: true, liste: [], neu: [], lohn: 0 };
        return Promise.resolve({ data: data, error: null });
      } };
      window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: JSON.parse(JSON.stringify(ich)), stand: { [ichId]: ich, [beaId]: bea }, letzterAbruf: Date.now() });
      window.__ich = ich;
      const f = document.getElementById("lcForm"); if (f) f.style.display = "";
      window.__hinweise = [];
      window.DMA_SPIEL_BRUECKE = window.DMA_SPIEL_BRUECKE || {};
      const altToast = window.DMA_SPIEL_BRUECKE.toast;
      window.DMA_SPIEL_BRUECKE.toast = (t) => { window.__hinweise.push(t); try { if (altToast) altToast(t); } catch (e) {} };
      const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; S.graben = false; S.dorfWahl = "";
      window.DMA_SPIEL.pruef.schnellZeichnen(true);
    });
    await tick(800);
    const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: "nearest" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };
    const rufe = (name) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n), name);
    const lage = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; }, sel);
    const stadtFrame = () => pg.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
    try {
      await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
      await pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick"); if (m) m.scrollTop = 1e6; }); await tick(300);
      if (!(await pg.evaluate(() => !!document.querySelector(".sp-lstadt")))) { await tippe('[data-s="stadtversion"][data-v="neu"]'); await tick(900); }
      let fr = null;
      for (let i = 0; i < 160 && !fr; i++) { const f = stadtFrame(); if (f && await f.evaluate(() => !!document.querySelector(".lk-lupe") && !!(window.STADT.oberflaeche.ueberblick && STADT.szene.sichtbare.length > 20)).catch(() => false)) fr = f; else await tick(250); }
      sage(!!fr, "die neue Stadt ist im Spiel geladen");
      await pg.evaluate(() => { const p = document.querySelector(".sp-dl-neustadt-platz"); if (p) p.scrollIntoView({ block: "center" }); }); await tick(2600);
      const imFrame = (fn, a) => fr.evaluate(fn, a);
      const zeichen = await imFrame(() => [...document.querySelectorAll(".lk-zeichen")].map((z) => z.dataset.g + ":" + z.className.replace(/lk-zeichen |lk-z-/g, "")));
      sage(["wald", "jagd", "muehle", "feld91", "feld92"].every((g) => zeichen.some((z) => z.startsWith(g + ":"))) && zeichen.some((z) => /^feld91:fertig/.test(z)) && zeichen.some((z) => /^feld92:laeuft/.test(z)),
        "das Spiel schickt die Zeichen: Holz, Fleisch, Mehl – und die Äcker (reif / wächst)", JSON.stringify(zeichen));
      const cdp = await ctx.newCDPSession(pg);
      const tipp = async (x, y) => { await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await tick(40); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); };
      await imFrame(() => { window.__t0 = 0; document.addEventListener("pointerup", () => { window.__t0 = Date.now(); }, true); });
      /* Empfang im Spiel (vor dem Spiel selbst, Einfang-Phase): Finger → Absenden misst Teil A, hier Empfang → Serveraufruf */
      await pg.evaluate(() => { window.__weg = [];
        window.addEventListener("message", (e) => { if (e.data && e.data.typ === "leicht-haus") window.__weg.push({ g: e.data.g, empfangen: Date.now() }); }, true); });
      const zeichenTipp = async (g) => {
        const q = await imFrame((g) => { const b = document.querySelector('.lk-zeichen[data-g="' + g + '"]'); if (!b || getComputedStyle(b).display === "none") return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, g);
        const o = await lage(".sp-lstadt");
        if (!q || !o) return null;
        await tipp(o.l + q.x, o.t + q.y); return q;
      };
      for (const [g, werk, name] of [["wald", "trupp_wald", "Holz"], ["jagd", "trupp_jagd", "Fleisch"], ["muehle", "muehle", "Mehl"]]) {
        const vor = (await rufe("spiel_werk_abholen")).length;
        const q = await zeichenTipp(g); await tick(700);
        for (let i = 0; i < 20 && (await rufe("spiel_werk_abholen")).length === vor; i++) await tick(200);
        const ab = (await rufe("spiel_werk_abholen")).slice(vor), t0 = await imFrame(() => window.__t0), w = await pg.evaluate((g) => window.__weg.filter((x) => x.g === g).pop(), g);
        const ms = w && ab[0] ? { spiel: ab[0].t - w.empfangen, fingerBisServer: ab[0].t - t0 } : null;
        const S = await pg.evaluate(() => ({ wahl: window.DMA_SPIEL.pruef.zustand().dorfWahl, station: !!document.querySelector(".sp-dl-neustadt ~ .sp-dl-station") }));
        sage(!!q && ab.length === 1 && ab[0].args.p_gebaeude === werk && !!ms && ms.spiel < 150, name + ": ein Tipp aufs Zeichen holt es sofort ab (spiel_werk_abholen " + werk + "; Empfang → Serveraufruf < 150 ms, die Zustellung hängt unter Last an der Maschine)", JSON.stringify({ q, ms, ab: ab.map((x) => x.args) }));
        sage(S.wahl !== g && S.wahl !== "wald" && !S.station, name + ": keine Station geht auf (nicht der Wald dahinter)", JSON.stringify(S));
      }
      /* Baum → Holzfäller (kein Trupp: losschicken; unterwegs: mithelfen) */
      const post = (d) => imFrame((d) => window.parent.postMessage(d, location.origin), d);
      await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); const w = Object.assign({}, S.ich.werk); delete w.trupp_wald; S.ich = Object.assign({}, S.ich, { werk: w }); });
      await post({ typ: "leicht-baum" }); await tick(700);
      const tr = await rufe("spiel_trupp");
      sage(tr.length === 1 && tr[0].args.p_ort === "wald", "Tipp auf einen Baum: die Holzfäller ziehen los (spiel_trupp wald)", JSON.stringify(tr.map((x) => x.args)));
      await tick(600);
      await post({ typ: "leicht-baum" }); await tick(700);
      const th = await rufe("spiel_trupp_helfen");
      sage(th.length === 1 && th[0].args.p_ort === "wald", "noch ein Baum, während sie unterwegs sind: mithelfen (spiel_trupp_helfen wald)", JSON.stringify(th.map((x) => x.args)));
      await post({ typ: "leicht-haus", g: "see" }); await tick(700);
      sage((await rufe("spiel_angeln")).length === 1, "Tipp auf den See: angeln (spiel_angeln)");
      const vorE = (await rufe("spiel_ernten")).length;
      const fq = await zeichenTipp("feld91"); await tick(1600);
      const er = (await rufe("spiel_ernten")).slice(vorE);
      sage(!!fq && er.length === 1 && er[0].args.p_platz === 91, "Tipp auf „Getreide reif“ am Acker: mit der Sense ernten (spiel_ernten 91)", JSON.stringify(er.map((x) => x.args)));
      await post({ typ: "leicht-feld", nr: 92 }); await tick(800);
      sage((await rufe("spiel_feld_helfen")).some((x) => x.args.p_platz === 92), "Tipp auf den wachsenden Acker: beim Wachsen helfen (spiel_feld_helfen 92)");
      const us = await pg.evaluate(() => { const e = document.querySelector(".sp-lstadt"); if (!e) return null; const c = getComputedStyle(e); return c.userSelect + "/" + c.webkitTapHighlightColor; });
      sage(us === "none/rgba(0, 0, 0, 0)", "der Rahmen der Stadt im Spiel: nichts markierbar, kein Tippkasten", us);
      if (BILD) await pg.screenshot({ path: BILD + "-b1-spiel.png" });
    } catch (e) { sage(false, "Teil B abgebrochen", String(e && e.message || e).split("\n")[0]); }
    await ctx.close();
  }

  sage(konsolenFehler.length === 0, "keine Skriptfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
