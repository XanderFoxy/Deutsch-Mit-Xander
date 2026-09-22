#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — DER AUFGESPRUEHTE LACK BLEIBT, BIS JEMAND WISCHT
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Das mit dem Gesicht einspruehen und dass es
   bleibt die ganze Zeit, ungeachtet davon, ob man es durch Klicken aufs
   eigene Profilbild resettet — das geht in dem Moment nicht. Es geht
   nur durch den Scheibenwischer wieder weg."

   Gemessen wird deshalb:
     1. Nach dem Spruehen liegt eine bleibende Lackschicht auf dem Bild.
     2. Das Spruehzeug (Dose, Nebel) ist dann weg — nur der Lack bleibt.
     3. Ein Auffrischen nimmt ihn nicht ab.
     4. Ein komplettes Neuzeichnen der Sitzreihe auch nicht.
     5. Ein Tipp auf das eigene Profilbild auch nicht.
     6. Und „/wischer" nimmt ihn ab — als Einziges.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
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
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nSPRUEHEN UND LIEGENBLEIBEN\n");
  const erg = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const beaPlatz = () => [...document.querySelectorAll(".lc-platz")]
      .find((p) => ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .trim().toLowerCase().indexOf("bea") === 0);
    window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex", { stueck: "froh" });
    await new Promise((f) => setTimeout(f, 3000));
    const beimSpruehen = { dose: document.querySelectorAll(".lc-spray-dose").length,
                           lack: beaPlatz().querySelectorAll(".lc-sprayfarbe").length };
    /* 6,2 s ist das Spruehen vorbei — danach darf NUR der Lack noch da sein. */
    await new Promise((f) => setTimeout(f, 3600));
    const danach = { dose: document.querySelectorAll(".lc-spray-dose").length,
                     lack: beaPlatz().querySelectorAll(".lc-sprayfarbe").length,
                     bild: Boolean(beaPlatz().querySelector(".lc-sprayfarbe-bild")) };
    window.DMA_PRUEF.auffrischen();
    await new Promise((f) => setTimeout(f, 250));
    const nachAuf = beaPlatz().querySelectorAll(".lc-sprayfarbe").length;
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 500));
    const nachNeu = beaPlatz() ? beaPlatz().querySelectorAll(".lc-sprayfarbe").length : -1;
    /* Ein Tipp auf das eigene Profilbild — er darf nichts abwischen. */
    const meins = document.querySelector(".lc-platz-ich .lc-kreis");
    if (meins) meins.click();
    await new Promise((f) => setTimeout(f, 300));
    const nachTipp = beaPlatz() ? beaPlatz().querySelectorAll(".lc-sprayfarbe").length : -1;
    /* Und jetzt der Wischer. */
    window.DMA_PRUEFUNG.wirkung("wischer", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 3200));
    const nachWischer = beaPlatz() ? beaPlatz().querySelectorAll(".lc-sprayfarbe").length : -1;
    return { beimSpruehen, danach, nachAuf, nachNeu, nachTipp, nachWischer };
  });

  sage(erg.beimSpruehen.dose >= 1, "die Dose sprüht",
    erg.beimSpruehen.dose + " Dose(n)");
  sage(erg.danach.lack === 1 && erg.danach.bild,
    "danach liegt der Lack auf dem Bild", erg.danach.lack + " Schicht");
  sage(erg.danach.dose === 0, "und das Sprühzeug ist weg",
    erg.danach.dose + " Dosen");
  sage(erg.nachAuf === 1, "ein Auffrischen nimmt ihn nicht ab", erg.nachAuf + " Schicht");
  sage(erg.nachNeu === 1, "ein komplettes Neuzeichnen auch nicht", erg.nachNeu + " Schicht");
  sage(erg.nachTipp === 1, "und ein Tipp auf das eigene Bild erst recht nicht",
    erg.nachTipp + " Schicht");
  sage(erg.nachWischer === 0, "erst der Scheibenwischer macht ihn weg",
    erg.nachWischer + " Schicht");

  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
