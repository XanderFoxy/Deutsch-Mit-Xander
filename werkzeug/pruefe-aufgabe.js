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

    /* 2. Satzpuzzle: Geplauder ist keine Antwort, ein Versuch schon */
    LiveChat.pruefAufgabeStellen("satz", "Der Hund läuft über die Wiese");
    raus.push(["Satzpuzzle, Geplauder", versuch("hallo, bin gleich zurück")]);
    raus.push(["Satzpuzzle, Versuch aus denselben Wörtern", versuch("Der Hund über die Wiese läuft")]);
    raus.push(["Satzpuzzle, richtig gelöst", versuch("der hund läuft über die wiese.")]);

    /* 3. Wortpuzzle */
    LiveChat.pruefAufgabeStellen("wort", "Fahrrad");
    raus.push(["Wortpuzzle, Geplauder", versuch("keine Ahnung ehrlich gesagt")]);
    raus.push(["Wortpuzzle, Versuch aus denselben Buchstaben", versuch("Radfahr")]);
    raus.push(["Wortpuzzle, richtig gelöst", versuch("fahrrad")]);

    /* 4. Aufgabe in eigenen Worten: die ERSTE Zeile ist die Antwort */
    LiveChat.pruefAufgabeFrei("Schreib einen Satz mit „weil“");
    raus.push(["eigene Aufgabe, erste Zeile", versuch("Ich bleibe zu Hause, weil es regnet.")]);
    raus.push(["eigene Aufgabe, danach weiterplaudern", versuch("und du so?")]);

    /* 5. Das Aktualisieren der Seite */
    LiveChat.pruefAufgabeFrei("Schreib einen Satz mit „weil“");
    LiveChat.pruefAufgabeMerken();
    LiveChat.pruefAufgabeVergessenImSpeicher();
    const nachVergessen = versuch("Ich bleibe zu Hause, weil es regnet.");
    LiveChat.pruefAufgabeZurueckholen();
    const nachNeuladen = versuch("Ich bleibe zu Hause, weil es regnet.");
    raus.push(["nach Neuladen, ohne Zurueckholen", nachVergessen]);
    raus.push(["nach Neuladen, mit Zurueckholen", nachNeuladen]);

    /* 6. beendet */
    LiveChat.pruefAufgabeFrei("");
    raus.push(["Aufgabe beendet", versuch("Der Hund läuft über die Wiese")]);
    return raus;
  });

  const soll = {
    "ohne offene Aufgabe": null,
    "Satzpuzzle, Geplauder": null,
    "Satzpuzzle, Versuch aus denselben Wörtern": { versuch: true, richtig: false, frei: false },
    "Satzpuzzle, richtig gelöst": { versuch: true, richtig: true, frei: false },
    "Wortpuzzle, Geplauder": null,
    "Wortpuzzle, Versuch aus denselben Buchstaben": { versuch: true, richtig: false, frei: false },
    "Wortpuzzle, richtig gelöst": { versuch: true, richtig: true, frei: false },
    "eigene Aufgabe, erste Zeile": { versuch: true, richtig: false, frei: true },
    "eigene Aufgabe, danach weiterplaudern": null,
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
    console.log("  " + (gut ? "ok   " : "FEHL ") + was.padEnd(44) + wort);
  });
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Erkennung sitzt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
