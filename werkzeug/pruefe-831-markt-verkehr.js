#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 831: AUTOS AM MARKT MIT DEM GROSSEN FERNSEHTURM,
   LATERNEN NICHT IN DEN WÄNDEN
   ---------------------------------------------------------------------
   XANDER (wörtlich): „dieses Batmobil hätte ich nicht nur in dem Spiel
   gerne, das als fahrendes Auto zu sehen" (815), „die Autos … fahren
   durch den Brunnen durch" (830), „große Wahrzeichen frei aufstellbar"
   (826). Seit 826 reicht der Fernsehturm (16 × 16 m) bis an die Mitte
   des Marktes; mit 830 fuhren die Autos dort Haken und Schleifen,
   schoben sich beim Anfahren seitwärts und schnitten spitze Abzweige.

   Geprüft (stadt-leicht.html?demo=1&quelle=1&autos=viper,batmobil):
     • fünf Fahrten à 300 s, jede frisch aufgestellt (anderer Vorlauf):
       je Auto höchstens 1 % der Schritte über 30° schräg, nie über 60°,
       Drehung unter 300°/s, jeder Schritt < 2 m vom Weg (außer an
       Hindernissen) – wie Sonde 815, aber in mehreren Abläufen;
     • frisch aufgestellte Autos fahren in Blickrichtung los (der erste
       Meter höchstens 35° neben der Blickrichtung; vorher bis 69°);
     • keine Laterne steht in einer Hauswand oder im Sockel eines
       Wahrzeichens (≥ 0,9 m davor);
     • keine Seitenfehler.
   Gegenprobe: WURZEL=<Ordner mit dem Stand 382570b> → rot.
   Aufruf: node werkzeug/pruefe-831-markt-verkehr.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  pg.setDefaultTimeout(600000);
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(e.message));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt-leicht.html?demo=1&quelle=1&autos=viper,batmobil&zeit=tag&jahr=herbst", { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
  await pg.waitForTimeout(800);

  console.log("\nFÜNF FAHRTEN À 300 s (frisch aufgestellt)\n");
  const R = await pg.evaluate(() => {
    const AU = STADT.autos, dt = 0.05, W = (a, b) => Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
    const erg = [];
    for (const vor of [0, 13, 34, 89, 144]) {
      AU.liste.length = 0; AU.neu = true; AU.vorspulen(vor + 0.05, dt, { fuhrwerke: true });
      const mit = []; AU.vorspulen(300, dt, { mit: mit, fuhrwerke: true });
      for (const a of AU.liste) {
        let schief = 0, n = 0, maxS = 0, maxDh = 0, weit = 0, bei = "";
        for (let i = 1; i < mit.length; i++) {
          const p = mit[i].find((x) => x.id === a.id), o = mit[i - 1].find((x) => x.id === a.id); if (!p || !o) continue;
          const d = Math.hypot(p.x - o.x, p.y - o.y), dh = W(p.h, o.h) / dt * 57.3;
          let e = 0; if (d > 0.03) { n++; e = W(Math.atan2(p.y - o.y, p.x - o.x) + (p.r ? Math.PI : 0), p.h) * 57.3; if (e > 30) schief++; }
          const wa = AU.inUmfahrung(p.x, p.y) ? 0 : AU.wegAbstand(p.x, p.y);
          if ((e > 60 || dh > 300 || wa > 2) && !bei) bei = "(" + p.x.toFixed(1) + " | " + p.y.toFixed(1) + ") " + p.z + " " + e.toFixed(0) + "° " + dh.toFixed(0) + "°/s " + wa.toFixed(2) + " m";
          maxS = Math.max(maxS, e); maxDh = Math.max(maxDh, dh); weit = Math.max(weit, wa);
        }
        erg.push({ vor: vor, id: a.id, schief: schief, n: n, maxS: Math.round(maxS), maxDh: Math.round(maxDh), weit: +weit.toFixed(2), bei: bei });
      }
    }
    return erg;
  });
  for (const r of R) sage(r.schief / r.n < 0.01 && r.maxS < 60 && r.maxDh < 300 && r.weit < 2, "[" + r.id + ", Vorlauf " + r.vor + " s] Blick passt zur Fahrt, keine Sprünge, auf den Wegen",
    r.schief + " von " + r.n + " Schritten über 30°, höchstens " + r.maxS + "°, Drehung höchstens " + r.maxDh + "°/s, weitester Abstand " + r.weit + " m" + (r.bei ? " · zuerst bei " + r.bei : ""));

  console.log("\nLOSFAHREN NACH DEM AUFSTELLEN\n");
  const A = await pg.evaluate(() => {
    const AU = STADT.autos, W = (a, b) => Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI), aus = [];
    for (const vor of [0, 1, 2, 3, 5, 8]) {
      AU.liste.length = 0; AU.neu = true; AU.vorspulen(0.05, 0.05); AU.vorspulen(vor * 0.3, 0.05);
      const start = AU.liste.map((a) => ({ id: a.id, x: a.x, y: a.y, h: a.h }));
      for (let i = 0; i < 400; i++) {
        AU.vorspulen(0.05, 0.05);
        for (const s of start) { if (s.fertig) continue; const a = AU.auto(s.id); if (Math.hypot(a.x - s.x, a.y - s.y) >= 1) { s.fertig = true; s.w = +(W(Math.atan2(a.y - s.y, a.x - s.x) + (a.rueck ? Math.PI : 0), s.h) * 57.3).toFixed(0); s.z = a.zustand; } }
        if (start.every((s) => s.fertig)) break;
      }
      for (const s of start) aus.push(s.id + " " + (s.w == null ? "steht" : s.w + "°" + (s.z === "wendet" ? " (wendet)" : "")));
    }
    return aus;
  });
  const schraeg = A.filter((t) => { const w = parseFloat(t.split(" ")[1]); return isFinite(w) && w > 35; });
  sage(schraeg.length === 0 && A.filter((t) => /steht/.test(t)).length < A.length / 2, "frisch aufgestellte Autos fahren in Blickrichtung los (erster Meter ≤ 35° daneben – so viel lässt die Anfahr-Regel zu, darüber wird erst gewendet)", A.join(", "));

  console.log("\nLATERNEN\n");
  const L = await pg.evaluate(() => {
    const SZ = STADT.szene, D = STADT.dorf, aus = [];
    const lat = SZ.objekte.filter((o) => /^d_laterne/.test(o.bild || ""));
    const abst = (o, x, y) => { const k = o.art === "haus" ? (o.stufe || 1) : 1, w = (o.dreh || 0) * Math.PI / 2, dx = x - o.x, dy = y - o.y, u = Math.abs(dx * Math.cos(w) + dy * Math.sin(w)) - o.fuss[0] * k / 2, v = Math.abs(-dx * Math.sin(w) + dy * Math.cos(w)) - o.fuss[1] * k / 2; return Math.hypot(Math.max(0, u), Math.max(0, v)); };
    let min = Infinity, wo = "";
    for (const l of lat) for (const o of SZ.objekte) {
      if (!o.fuss || o.versteckt || !(o.art === "haus" || o.art === "wunder")) continue;
      /* (das Rathaus: nur seine Flügel – vor dem Portal ist Pflaster) */
      const d = o.spiel === "rathaus" && D.imGrundriss ? (D.imGrundriss("rathaus", l.x, l.y, 0.9) ? 0 : 9) : abst(o, l.x, l.y);
      if (d < min) { min = d; wo = (o.name || o.bild) + " (" + l.x.toFixed(1) + " | " + l.y.toFixed(1) + ")"; }
    }
    return { n: lat.length, min: +min.toFixed(2), wo: wo };
  });
  sage(L.n >= 20 && L.min >= 0.9, "keine Laterne in einer Hauswand oder im Sockel eines Wahrzeichens", L.n + " Laternen, nächste " + L.min + " m vor " + L.wo);
  sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.join(" | "));
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
