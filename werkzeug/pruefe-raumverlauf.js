/* PRÜFT: DER VERLAUF BLEIBT IM VERLASSENEN RAUM LIEGEN.
   ---------------------------------------------------------------
   GEWUENSCHT: „Der Verlauf soll in einem verlassenen Raum bleiben —
   dass man alle Nachrichten dort auch wieder sieht, wenn man in
   diesen Raum zurueckkehrt, nachdem man ihn komplett verlassen hat."

   Gemessen wird der Weg, den das Geraet dabei geht: ablegen beim
   Hinausgehen, hervorholen beim Wiederkommen — aus dem kleinen
   Speicher (localStorage) UND aus dem Lager (IndexedDB), in dem der
   vollstaendige Verlauf liegt. Und die Gegenprobe: ein anderer Raum
   bringt nichts davon mit. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 780 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((f) => setTimeout(f, ms));
    const zeit = Date.now();
    /* In Raum A ein paar Zeilen — darunter eine gefluesterte, denn die
       soll die Person ueberallhin begleiten. */
    LiveChat.pruefRaum("probe-a");
    LiveChat.pruefVerlaufSetzen([
      { id: "a1", von: "emmy", name: "Emmy", art: "text", text: "Hallo in Raum A", zeit: zeit },
      { id: "a2", von: "emmy", name: "Emmy", art: "text", text: "Zweite Zeile", zeit: zeit + 1 },
      { id: "a3", von: "emmy", name: "Emmy", art: "fluester", text: "psst", zeit: zeit + 2 }
    ]);
    /* In Raum B etwas ganz anderes. */
    LiveChat.pruefRaum("probe-b");
    LiveChat.pruefVerlaufSetzen([
      { id: "b1", von: "reza", name: "Reza", art: "text", text: "Hier ist Raum B", zeit: zeit + 3 }
    ]);
    await warte(500);          // das Lager schreibt nebenher
    return {
      aSpeicher: LiveChat.pruefVerlaufAusSpeicher("probe-a").map((n) => n.text),
      aLager: (await LiveChat.pruefVerlaufAusLager("probe-a")).map((n) => n.text),
      bSpeicher: LiveChat.pruefVerlaufAusSpeicher("probe-b").map((n) => n.text),
      bLager: (await LiveChat.pruefVerlaufAusLager("probe-b")).map((n) => n.text)
    };
  });

  let fehler = 0;
  const ok = (bedingung, was, zusatz) => {
    if (!bedingung) fehler++;
    console.log("  " + (bedingung ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : ""));
  };
  const a = ["Hallo in Raum A", "Zweite Zeile", "psst"];
  console.log("\n  RAUM A — verlassen und wiedergekommen");
  ok(JSON.stringify(erg.aSpeicher) === JSON.stringify(a), "aus dem Speicher vollständig zurück",
     "„" + erg.aSpeicher.join("“ · „") + "“");
  ok(JSON.stringify(erg.aLager) === JSON.stringify(a), "aus dem Lager vollständig zurück",
     "„" + erg.aLager.join("“ · „") + "“");
  console.log("\n  RAUM B — und nichts vermischt sich");
  ok(JSON.stringify(erg.bSpeicher) === JSON.stringify(["Hier ist Raum B"]),
     "nur die eigene Zeile", "„" + erg.bSpeicher.join("“ · „") + "“");
  ok(JSON.stringify(erg.bLager) === JSON.stringify(["Hier ist Raum B"]),
     "auch im Lager getrennt", "„" + erg.bLager.join("“ · „") + "“");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Jeder Raum behält seinen Verlauf.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
