/* PRÜFT: EINE HÄNGENGEBLIEBENE WORTMELDUNG BLOCKIERT NICHT MEHR.
   ---------------------------------------------------------------
   GEMELDET: „Manchmal hängt sich die Sprachnachricht auf, also dieser
   grüne Balken, und er bleibt dann stehen. Gibt es eine Möglichkeit zu
   überprüfen, ob die Leitung frei ist und ob das nur ein Hängen ist?
   Ich würde gern weitersprechen und muss jedes Mal die Seite neu
   aktualisieren."

   Drei Dinge werden gemessen:
     1. Wie lange die Leitung überhaupt gehalten werden darf — vorher
        waren es stur fünf Minuten, egal wie kurz die Aufnahme war.
     2. Ob ein abgelaufener Balken das Mikrofon noch sperrt. Er darf
        es nicht: darfSprechen() räumt ihn selbst weg.
     3. Ob das Freigeben von Hand wirkt (der Tipp auf den Balken). */
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
    /* Der Fokus-Modus muss an sein, sonst sperrt ohnehin nichts. */
    const antwort = {};
    LiveChat.pruefFokus ? LiveChat.pruefFokus(true) : null;

    /* Eine kurze Wortmeldung: drei Sekunden. */
    LiveChat.liveLaeuft({ von: "emmy", name: "Emmy", sek: 3 });
    antwort.restAmAnfang = LiveChat.liveRest();
    antwort.gesperrt = LiveChat.darfSprechen().ja === false;

    /* Und jetzt tun wir so, als sei der Ton nie zu Ende gegangen:
       die Frist läuft ab (wir stellen sie zurück, statt 13 Sekunden
       zu warten). */
    LiveChat.liveLaeuft({ von: "emmy", name: "Emmy", sek: 3 });
    LiveChat.pruefLeitungAltern(20000);
    antwort.restNachAblauf = LiveChat.liveRest();
    const frei = LiveChat.darfSprechen();
    antwort.wiederFrei = frei.ja === true;
    antwort.alsHaengenErkannt = frei.warHaengen === true;

    /* Und das Freigeben von Hand, während sie noch läuft. */
    LiveChat.liveLaeuft({ von: "emmy", name: "Emmy", sek: 30 });
    antwort.restLang = LiveChat.liveRest();
    antwort.vonHand = LiveChat.liveFreigeben();
    antwort.danachFrei = LiveChat.darfSprechen().ja === true;
    return antwort;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  WIE LANGE DARF EINE WORTMELDUNG DIE LEITUNG HALTEN?");
  ok(erg.restAmAnfang >= 12 && erg.restAmAnfang <= 16,
     "drei Sekunden Aufnahme → rund 13 Sekunden Frist (vorher: 300)",
     erg.restAmAnfang + " s");
  ok(erg.restLang >= 38 && erg.restLang <= 42,
     "dreissig Sekunden Aufnahme → rund 40 Sekunden Frist", erg.restLang + " s");

  console.log("\n  UND WENN SIE HÄNGENBLEIBT?");
  ok(erg.gesperrt, "solange sie läuft, wartet mein Mikrofon — das soll so sein");
  ok(erg.restNachAblauf === 0, "nach Ablauf ist nichts mehr übrig", erg.restNachAblauf + " s");
  ok(erg.wiederFrei, "und das Mikrofon ist wieder frei, ohne Neuladen");
  ok(erg.alsHaengenErkannt, "es wird auch als Hängen erkannt, nicht nur zufällig frei");

  console.log("\n  FREIGEBEN VON HAND (Tipp auf den Balken)");
  ok(erg.vonHand === true, "die Leitung war zu vergeben");
  ok(erg.danachFrei, "danach darf gesprochen werden");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Leitung lässt sich prüfen und freigeben.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
