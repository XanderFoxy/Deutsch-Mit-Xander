/* PRÜFT, WANN EINE ZEILE ALS ANTWORT AUF EINE AUFGABE GILT.
   ---------------------------------------------------------------
   GEWUENSCHT: „Ich moechte diese Benotung nicht global haben, nur an
   den Antworten von den Aufgaben. Die Stelle, wenn es wirklich als
   diese Antwort von dieser Aufgabe erkannt wird, soll rechts Note
   stehen."

   Also zwei Dinge messen:
     1. Erkennung — was gilt als Antwort und was nicht, bei den
        Puzzles (/satz, /wort) und bei einer Aufgabe in eigenen
        Worten (/aufgabe).
     2. Ueberleben — eine gestellte Aufgabe muss das Aktualisieren
        der Seite ueberstehen. Genau daran ist es gescheitert: sie lag
        nur im Arbeitsspeicher, und nach jedem Neuladen war keine
        Antwort mehr eine Antwort. */
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

  const erg = await pg.evaluate(() => {
    const raus = [];
    const versuch = (t) => {
      const v = LiveChat.pruefAufgabeVersuch("emmy", t);
      return v ? { versuch: Boolean(v.versuch), richtig: Boolean(v.richtig), frei: Boolean(v.frei) }
               : null;
    };
    /* 1. ohne Aufgabe ist nichts eine Antwort */
    LiveChat.pruefAufgabeFrei("");                     // alles beenden
    raus.push(["ohne offene Aufgabe", versuch("Der Hund läuft über die Wiese")]);

    /* 2. Satzpuzzle */
    LiveChat.pruefAufgabeStellen("satz", "Der Hund läuft über die Wiese");
    raus.push(["Satzpuzzle, falsche Antwort", versuch("Hund der läuft")]);
    raus.push(["Satzpuzzle, richtige Antwort", versuch("der hund läuft über die wiese.")]);

    /* 3. Aufgabe in eigenen Worten */
    LiveChat.pruefAufgabeFrei("Schreib einen Satz mit „weil“");
    const frei = versuch("Ich bleibe zu Hause, weil es regnet.");
    raus.push(["eigene Aufgabe, irgendeine Antwort", frei]);

    /* 4. Das Aktualisieren der Seite */
    LiveChat.pruefAufgabeMerken();
    LiveChat.pruefAufgabeVergessenImSpeicher();
    const nachVergessen = versuch("Ich bleibe zu Hause, weil es regnet.");
    LiveChat.pruefAufgabeZurueckholen();
    const nachNeuladen = versuch("Ich bleibe zu Hause, weil es regnet.");
    raus.push(["nach Neuladen, ohne Zurueckholen", nachVergessen]);
    raus.push(["nach Neuladen, mit Zurueckholen", nachNeuladen]);

    /* 5. beendet */
    LiveChat.pruefAufgabeFrei("");
    raus.push(["Aufgabe beendet", versuch("Noch ein Satz")]);
    return raus;
  });

  const soll = {
    "ohne offene Aufgabe": null,
    "Satzpuzzle, falsche Antwort": { versuch: true, richtig: false, frei: false },
    "Satzpuzzle, richtige Antwort": { versuch: true, richtig: true, frei: false },
    "eigene Aufgabe, irgendeine Antwort": { versuch: true, richtig: false, frei: true },
    "nach Neuladen, ohne Zurueckholen": null,
    "nach Neuladen, mit Zurueckholen": { versuch: true, richtig: false, frei: true },
    "Aufgabe beendet": null
  };
  let fehler = 0;
  console.log("");
  erg.forEach(([was, ist]) => {
    const w = soll[was];
    const gut = JSON.stringify(ist) === JSON.stringify(w);
    if (!gut) fehler++;
    const wort = ist ? (ist.frei ? "Antwort (ohne Musterlösung)" : ist.richtig ? "Antwort, richtig" : "Antwort, noch nicht richtig")
                     : "keine Antwort — kein Notenknopf";
    console.log("  " + (gut ? "ok   " : "FEHL ") + was.padEnd(36) + wort);
  });
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Erkennung sitzt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
