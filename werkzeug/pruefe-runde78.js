#!/usr/bin/env node
/* =========================================================
   RUNDE 78 — JEMAND ANDEREN ALS ZIEL NEHMEN
   ---------------------------------------------------------
   XANDER: „Der Frisbee ist Mega cool. Vielleicht kannst du es
   auch moeglich machen, dass man jemand anderen auch
   wegwerfen kann … dass man in dem Reisemenue jemand anderen
   als Ziel nehmen kann, bei dem Frisbee … und er taucht an
   meinem Platz wieder auf, und vielleicht auch noch ne
   Variante fuer die Roehre."

   Das ist ein TAUSCH. Den Sitzwechsel konnte das Haus schon:
   LiveChat.platzNehmen ruft bei einem besetzten Ziel von
   selbst platzTauschenMit auf. Gefehlt haben zwei Dinge:
   lcReise hat besetzte Ziele rundweg abgelehnt, und es flog
   nur EIN Bild.

   Gemessen wird deshalb beides — im Text, dass die Sperre
   richtig gelockert ist, und im Browser, dass wirklich ZWEI
   Bilder unterwegs sind.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs"), path = require("path"), http = require("http");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = ohneK(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"));
const lc = ohneK(fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8"));

(async () => {
  console.log("\nDIE SPERRE GEGEN BESETZTE PLAETZE IST GELOCKERT — ABER NUR DORT\n");
  pruefe("lcReise kennt den Tausch",
    /function lcReise\(wen, von, art, tausch\) \{/.test(js));
  /* Nur Frisbee und Roehre: bei allen anderen Reisen bliebe einer
     von beiden in der Luft, weil es fuer ihn keinen Rueckweg gibt. */
  pruefe("und er gilt nur fuer Frisbee und Roehre",
    /const tauschbar = tausch && \(art === "frisbee" \|\| art === "rohr"\);/.test(js)
    && /if \(!zu\.frei && !tauschbar\) \{/.test(js));
  pruefe("auf einem LEEREN Platz ist es die gewoehnliche Reise",
    /if \(tauschbar && zu\.frei\) \{[\s\S]{0,200}?tausch = false;/.test(js));
  pruefe("der Tausch faehrt mit der Nachricht, nicht nur beim Absender",
    /lcReise\(wenR, vonR, art, Boolean\(nachricht && nachricht\.tausch\)\)/.test(js)
    /* RUNDE 76 — hier stand „wen: rest.trim()". Seit Flugzeug,
       Sprungfeder und Maulwurf auch eine gemalte Kette annehmen, wird
       die Zielnummer vorher aus dem Rest gezogen („zielNrR"); beim
       Tausch faehrt weiterhin genau diese eine Nummer mit. */
    && /\{ wirkung: art, wen: String\(zielNrR\), tausch: 1 \}/.test(lc));
  pruefe("livechat erkennt den besetzten Platz selbst",
    /if \(zielR && !zielR\.leer && zielR\.id !== zustand\.ichId\) tauschR = 1;/.test(lc));
  pruefe("und es gibt einen Weg dorthin im Platzmenue",
    /knopf\("\\ud83d\\udd01", "Tauschen"/.test(js)
    && /\["\\ud83e\\udd4f", "Frisbee", "frisbee"\]/.test(js)
    && /\["\\ud83d\\udfe2", "R\\u00f6hre",  "rohr"\]/.test(js));

  /* --- Und jetzt im Browser: fliegen wirklich zwei? ------------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });

  console.log("\nDIE FRISBEE: ZWEI SCHEIBEN, ZWEI BOGEN\n");
  const f = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("frisbee", "2", "Alex", { tausch: 1 });
    await new Promise((x) => setTimeout(x, 1250));
    const alle = [...document.querySelectorAll(".lc-frisbee")];
    const kasten = alle.map((s) => {
      const b = s.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    });
    return { anzahl: alle.length,
             gegen: document.querySelectorAll(".lc-frisbee-gegen").length,
             mitten: kasten };
  });
  pruefe("es fliegen zwei Scheiben", f.anzahl === 2, f.anzahl + " Stueck");
  pruefe("eine davon ist die Gegenscheibe", f.gegen === 1);
  /* Auf demselben Bogen wuerden sie einander durchdringen. Der eine
     geht nach oben, der andere nach unten — sie muessen sich auf der
     Hoehe also deutlich unterscheiden. */
  const hoehen = (f.mitten || []).map((m) => m.y);
  pruefe("und sie weichen einander auf der Hoehe aus",
    hoehen.length === 2 && Math.abs(hoehen[0] - hoehen[1]) > 20,
    hoehen.length === 2 ? Math.round(Math.abs(hoehen[0] - hoehen[1])) + " px auseinander" : "");

  console.log("\nDIE ROEHRE: JEDER PLATZ BRAUCHT BEIDE ROEHREN\n");
  const r = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-roehre, .lc-rohr-doppel").forEach((x) => x.remove());
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("rohr", "2", "Alex", { tausch: 1 });
    /* 600 ms: beide sinken ein — da muessen an BEIDEN Plaetzen
       Roehren stehen. */
    await new Promise((x) => setTimeout(x, 600));
    const sichtbar = [...document.querySelectorAll(".lc-roehre")].filter((s) => {
      const b = s.getBoundingClientRect();
      return b.width > 4 && b.height > 4;
    });
    const spalten = {};
    sichtbar.forEach((s) => {
      const b = s.getBoundingClientRect();
      spalten[Math.round((b.left + b.width / 2) / 20)] = 1;
    });
    return { gesamt: document.querySelectorAll(".lc-roehre").length,
             offen: sichtbar.length, stellen: Object.keys(spalten).length };
  });
  /* Zwei aus der alten Schleife, zwei neue fuer die Gegenrichtung. */
  pruefe("es stehen vier Roehren statt zwei", r.gesamt === 4, r.gesamt + " Stueck");
  pruefe("und beim Einsinken steht an JEDEM der beiden Plaetze eine",
    r.stellen === 2, r.stellen + " Stellen, " + r.offen + " offen");

  const raus = await pg.evaluate(async () => {
    /* 2700 ms: beide sind heraus — und zwar ueber Kreuz. */
    await new Promise((x) => setTimeout(x, 2100));
    return [...document.querySelectorAll(".lc-rohr-doppel")].map((s) => {
      const b = s.getBoundingClientRect();
      return { x: Math.round(b.left + b.width / 2), text: (s.textContent || "").trim() };
    });
  });
  pruefe("beide steigen wieder heraus", raus.length === 2,
    raus.map((z) => z.text + "@" + z.x).join("  "));
  pruefe("und zwar an verschiedenen Plaetzen",
    raus.length === 2 && Math.abs(raus[0].x - raus[1].x) > 40,
    raus.length === 2 ? Math.abs(raus[0].x - raus[1].x) + " px auseinander" : "");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 78 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
