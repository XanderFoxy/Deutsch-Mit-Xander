#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 96 — EIN BESETZTER PLATZ IST KEINE SACKGASSE
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Der Fahrstuhl funktioniert auch nicht. Die
   Animation solltest du machen, da funktioniert noch gar nix."

   ZWEI FEHLER STECKTEN DAHINTER, und der zweite ist der groessere:
     1. „/fahrstuhl 5" stuerzte ab (siehe pruefe-runde92-reisenummern).
     2. Und danach passierte trotzdem nichts — weil Platz 5 BESETZT
        war. Eine Reise auf einen besetzten Platz wurde abgelehnt:
        „Platz 5 ist besetzt." Im leeren Testraum faellt das nie auf.
        In einem Raum mit vier Leuten ist die Haelfte aller Plaetze
        besetzt, und dann tut die Haelfte aller Reisen scheinbar gar
        nichts.

   Beim NAMEN machte das Programm es laengst richtig („zu Bea" heisst:
   auf den naechsten freien Platz neben Bea). Diese Sonde misst, dass
   das jetzt auch fuer eine besetzte NUMMER gilt — bei JEDER Reise.
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.reiseArten,
    { timeout: 20000 });

  const arten = await pg.evaluate(() => window.DMA_PRUEF.reiseArten()
    /* „fahren" und „spielzug" bewegen sich auf der Strasse und
       brauchen einen freien WEG — sie haben ihre eigene Sonde
       (pruefe-runde87-pacman, pruefe-reisen34). */
    .filter((a) => a !== "fahren" && a !== "spielzug"));
  console.log("\n" + arten.length + " Reisen auf einen BESETZTEN Platz (Nr. 5, dort sitzt Emmi)\n");

  const erg = await pg.evaluate(async (arten) => {
    const raus = {};
    for (const art of arten) {
      document.querySelectorAll(".lc-reise, .lc-lok-gleis").forEach((x) => x.remove());
      window.DMA_PRUEF.effektBuehne();
      const wo = document.getElementById("lcPlaetze").parentElement;
      const vor = wo.querySelectorAll("*").length;
      window.DMA_PRUEFUNG.wirkung(art, "5", "Alex", {});
      await new Promise((f) => setTimeout(f, 700));
      raus[art] = wo.querySelectorAll("*").length - vor;
    }
    return raus;
  }, arten);

  arten.forEach((art) => {
    sage(erg[art] > 0, "„/" + art + " 5“ faehrt trotzdem los",
      erg[art] > 0 ? erg[art] + " neue Bausteine" : "nichts passiert");
  });

  sage(aufSeite.length === 0, "und keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
