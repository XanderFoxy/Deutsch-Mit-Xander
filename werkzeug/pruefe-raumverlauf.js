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
    const zeilen = (wieviele, wo, ab) => {
      const l = [];
      for (let i = 0; i < wieviele; i++) {
        l.push({ id: wo + (ab + i), von: "emmy", name: "Emmy", art: "text",
                 text: wo + "-Zeile " + (ab + i), zeit: zeit + ab + i });
      }
      return l;
    };

    /* RAUM A: ein langer Verlauf, ordentlich abgelegt. */
    LiveChat.pruefRaum("probe-a");
    await LiveChat.pruefVerlaufAusLager("probe-a");     // wie beim Betreten
    LiveChat.pruefVerlaufSetzen(zeilen(10, "A", 0));
    await warte(400);
    const nachAblegen = (await LiveChat.pruefVerlaufAusLager("probe-a")).length;

    /* UND JETZT DER GEMELDETE FEHLER: man betritt den Raum wieder, es
       steht erst der kurze Auszug da, und noch bevor das Lager gelesen
       ist, kommt eine Zeile herein. Frueher hat dieser Augenblick den
       langen Verlauf durch den kurzen ersetzt. */
    LiveChat.pruefLagerVergessen();
    LiveChat.pruefVerlaufSetzen(zeilen(3, "A", 7));     // nur die letzten drei
    await warte(400);
    const nachKurzschluss = (await LiveChat.pruefVerlaufAusLager("probe-a")).length;

    /* Ist das Lager gelesen, darf natuerlich wieder geschrieben werden. */
    LiveChat.pruefVerlaufSetzen(zeilen(12, "A", 0));
    await warte(400);
    const nachRichtig = (await LiveChat.pruefVerlaufAusLager("probe-a")).length;

    /* RAUM B: bleibt davon unberuehrt. */
    LiveChat.pruefRaum("probe-b");
    await LiveChat.pruefVerlaufAusLager("probe-b");
    LiveChat.pruefVerlaufSetzen([
      { id: "b1", von: "reza", name: "Reza", art: "text", text: "Hier ist Raum B", zeit: zeit + 99 }
    ]);
    await warte(400);
    return {
      nachAblegen: nachAblegen,
      nachKurzschluss: nachKurzschluss,
      nachRichtig: nachRichtig,
      aSpeicher: LiveChat.pruefVerlaufAusSpeicher("probe-a").length,
      aLager: (await LiveChat.pruefVerlaufAusLager("probe-a")).map((n) => n.text),
      bLager: (await LiveChat.pruefVerlaufAusLager("probe-b")).map((n) => n.text)
    };
  });

  let fehler = 0;
  const ok = (bedingung, was, zusatz) => {
    if (!bedingung) fehler++;
    console.log("  " + (bedingung ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : ""));
  };
  console.log("\n  DER VERLAUF EINES RAUMS");
  ok(erg.nachAblegen === 10, "zehn Zeilen liegen im Lager", erg.nachAblegen + " Zeilen");
  ok(erg.nachKurzschluss === 10,
     "ein kurzer Auszug überschreibt sie NICHT, solange das Lager nicht gelesen ist",
     erg.nachKurzschluss + " Zeilen");
  ok(erg.nachRichtig === 12, "danach wird wieder ganz normal gesichert", erg.nachRichtig + " Zeilen");
  ok(erg.aSpeicher === 12, "auch der kleine Speicher hat sie", erg.aSpeicher + " Zeilen");
  console.log("\n  UND DIE RÄUME BLEIBEN GETRENNT");
  ok(JSON.stringify(erg.bLager) === JSON.stringify(["Hier ist Raum B"]),
     "Raum B hat nur seine eigene Zeile", "„" + erg.bLager.join("“ · „") + "“");
  ok(erg.aLager.length === 12 && erg.aLager[0] === "A-Zeile 0",
     "Raum A fängt weiterhin bei seiner ersten Zeile an", "„" + erg.aLager[0] + "“");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Jeder Raum behält seinen ganzen Verlauf.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
