#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER SPIELFUEHRER BEI STADT · LAND · FLUSS
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „das Stadt Land Fluss muss auch auf allen
   Seiten funktionieren. Wie gesagt, es gibt einen Spielfuehrer, und
   der sieht dann das Alphabet durchlaufen und kriegt dann Stop … und
   dann geht's los. Jeder soll sein Ausfuellen, dann gibt's ein Timing,
   irgendwann ist die Runde zu Ende und dann wird's verglichen, der
   Spielfuehrer gibt die Punkte, und dann ist der mit den meisten
   Punkten der naechste Spielfuehrer, der dann beim Alphabet den
   Buchstaben bestimmt … und er klickt den Buchstaben dann an, und
   dann muessen alle den Buchstaben spielen, den er ansagt, und dann
   immer so weiter, bis man die Runde von selbst beendet."

   WAS VORHER FEHLTE: es gab nur den RAUMGEBER. Er bestimmte den
   Buchstaben, er strich die Woerter, er startete jede weitere Runde —
   bis zum Schluss. Einen Wechsel zum Punktbesten gab es nicht.

   JETZT sind es zwei Rollen:
     · der RAUMGEBER richtet den Raum ein und schreibt den Stand in
       alle Zeilen zurueck (nur er kann das),
     · der SPIELFUEHRER bestimmt den Buchstaben, entscheidet ueber die
       Woerter und startet die naechste Runde. Nach jeder Runde geht
       die Fuehrung an den mit den meisten Punkten.

   GEMESSEN:
     1. Am Anfang fuehrt der Raumgeber.
     2. Nach der Runde fuehrt der Punktbeste.
     3. Bei Gleichstand bleibt die Fuehrung, wo sie ist.
     4. Der Spielfuehrer sieht das Alphabet und den Startknopf, auch
        wenn er NICHT der Raumgeber ist — und der Raumgeber sieht sie
        dann nicht mehr.
     5. Und er darf ueber die Woerter entscheiden.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.slfProbeFuehrung,
    { timeout: 20000 });

  const MITGLIEDER = [{ id: "pa", name: "Alex" }, { id: "pb", name: "Bea" },
                      { id: "pc", name: "Cem" }];

  console.log("\nAM ANFANG FUEHRT DER RAUMGEBER\n");
  const start = await pg.evaluate((m) => window.DMA_PRUEF.slfProbeFuehrung({
    ich: "pa", host: "pa", hostName: "Alex", mitglieder: m, gesamt: {} }), MITGLIEDER);
  sage(start.fuehrer === "pa" && start.binFuehrer,
    "der Raumgeber ist auch der erste Spielfuehrer",
    start.fuehrerName + " (" + start.fuehrer + ")");
  sage(start.darfUrteilen, "und er darf ueber die Woerter entscheiden");

  console.log("\nNACH DER RUNDE FUEHRT DER PUNKTBESTE\n");
  const wechsel = await pg.evaluate((m) => {
    window.DMA_PRUEF.slfProbeFuehrung({ ich: "pa", host: "pa", hostName: "Alex",
      mitglieder: m, gesamt: { Alex: 30, Bea: 75, Cem: 45 } });
    return window.DMA_PRUEF.slfProbeFuehrungWechseln();
  }, MITGLIEDER);
  sage(wechsel.uebergeben && wechsel.uebergeben.name === "Bea",
    "die Fuehrung geht an die mit den meisten Punkten",
    wechsel.uebergeben ? wechsel.uebergeben.name + " mit "
      + wechsel.uebergeben.punkte + " Punkten" : "niemand");
  sage(wechsel.fuehrer === "pb" && !wechsel.binFuehrer,
    "und der bisherige Spielfuehrer fuehrt nicht mehr",
    "jetzt: " + wechsel.fuehrerName);

  console.log("\nBEI GLEICHSTAND BLEIBT ES, WIE ES IST\n");
  const gleich = await pg.evaluate((m) => {
    window.DMA_PRUEF.slfProbeFuehrung({ ich: "pa", host: "pa", hostName: "Alex",
      mitglieder: m, gesamt: { Alex: 40, Bea: 75, Cem: 75 } });
    return window.DMA_PRUEF.slfProbeFuehrungWechseln();
  }, MITGLIEDER);
  sage(!gleich.uebergeben && gleich.fuehrer === "pa",
    "zwei mit derselben Punktzahl — die Fuehrung wechselt nicht",
    "Spielfuehrer bleibt " + gleich.fuehrerName);

  console.log("\nDER SPIELFUEHRER SIEHT DAS ALPHABET — AUCH ALS GAST\n");
  const alsGast = await pg.evaluate((m) => window.DMA_PRUEF.slfProbeFuehrung({
    /* ICH bin Bea, der Raum gehoert Alex, und ich fuehre. */
    ich: "pb", host: "pa", hostName: "Alex", fuehrer: "pb", fuehrerName: "Bea",
    mitglieder: m, gesamt: { Alex: 30, Bea: 75, Cem: 45 } }), MITGLIEDER);
  sage(alsGast.binFuehrer && alsGast.host !== alsGast.ich,
    "ich fuehre, obwohl der Raum jemand anderem gehoert",
    "Raum: " + alsGast.host + ", Fuehrung: " + alsGast.fuehrer);
  sage(alsGast.darfUrteilen, "und ich darf ueber die Woerter entscheiden");
  sage(alsGast.warteraum.indexOf('id="slfRad"') >= 0,
    "das Alphabet zum Anhalten steht bei mir");
  sage(alsGast.warteraum.indexOf('id="slfJetztStarten"') >= 0,
    "und der Startknopf auch");
  sage(alsGast.warteraum.indexOf('id="slfRaumSchliessen"') < 0,
    "das Abbrechen bleibt beim Raumgeber — es steht bei mir nicht");

  console.log("\nUND DER RAUMGEBER, DER NICHT MEHR FUEHRT\n");
  const alsRaumgeber = await pg.evaluate((m) => window.DMA_PRUEF.slfProbeFuehrung({
    ich: "pa", host: "pa", hostName: "Alex", fuehrer: "pb", fuehrerName: "Bea",
    mitglieder: m, gesamt: { Alex: 30, Bea: 75, Cem: 45 } }), MITGLIEDER);
  sage(!alsRaumgeber.binFuehrer, "ich fuehre nicht mehr");
  sage(alsRaumgeber.warteraum.indexOf('id="slfRad"') < 0,
    "das Alphabet steht jetzt NICHT mehr bei mir");
  sage(alsRaumgeber.warteraum.indexOf('id="slfJetztStarten"') < 0,
    "und der Startknopf auch nicht");
  sage(alsRaumgeber.warteraum.indexOf('id="slfRaumSchliessen"') >= 0,
    "aber der Raum ist weiterhin meiner — Abbrechen steht da");
  sage(alsRaumgeber.warteraum.indexOf("Bea") >= 0,
    "und im Kopf steht, wer jetzt führt");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
