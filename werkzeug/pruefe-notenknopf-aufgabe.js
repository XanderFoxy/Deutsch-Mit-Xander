/* PRÜFT, OB DER NOTENKNOPF AN DER ANTWORT STEHT — AUCH NACH DEM
   NEULADEN UND AUCH BEI EINER AUFGABE IN EIGENEN WORTEN.
   ---------------------------------------------------------------
   GEMELDET, zum dritten Mal: „Ich kann, wenn sie eine Aufgabe löst,
   immer noch nicht diesen Note-Button sehen, um sie zu benoten für
   die Aufgabe. Das Ding muss erkennen, dass sie von der Aufgabe kommt
   mit ihrer Antwort, damit ich weiß: diese Antwort gehört zu der
   Frage, die sie beantwortet hat."

   Der Knopf hängt an LiveChat.aufgabeBezug() — die Frage, die beim
   ZEICHNEN jeder Zeile gestellt wird. Dort stand eine einzige Zeile,
   die genau den gemeldeten Fall ausgeschlossen hat:
       if (offeneAufgabe.typ === "frei") return null;
   Also ausgerechnet die Aufgabe ohne Musterlösung — die einzige, bei
   der überhaupt nur der Lehrer urteilen kann.

   Gemessen wird deshalb der Weg, den eine Antwort wirklich nimmt:
   Aufgabe stellen, Verlauf setzen (so wie er nach dem Neuladen aus
   dem Gerät zurückkommt), und dann fragen, ob an der Zeile ein
   Notenknopf stünde. */
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
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    if (!LiveChat.aufgabeBezug || !LiveChat.pruefVerlaufSetzen) return null;
    const raus = [];
    /* Die Zeitpunkte liegen NACH der Aufgabe — was davor geschrieben
       wurde, ist keine Antwort, und genau das prüft Fall 5. */
    const T0 = Date.now();
    const zeile = (id, von, text, zeit) => ({ id: id, von: von, name: von, text: text,
                                              zeit: zeit, art: "text", eigen: false });

    function knopf(n) {
      const b = LiveChat.aufgabeBezug(n);
      return b && b.versuch ? { frage: String(b.frage || "").slice(0, 28), richtig: Boolean(b.richtig) } : null;
    }

    /* ---- 1. Aufgabe in eigenen Worten ------------------------- */
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeFrei("Schreib einen Satz mit „weil“");
    const a1 = zeile("m1", "emmy", "Ich bleibe zu Hause, weil es regnet.", T0 + 5000);
    const a2 = zeile("m2", "emmy", "und du so?", T0 + 9000);
    const a3 = zeile("m3", "tom", "Ich lerne, weil morgen Prüfung ist.", T0 + 12000);
    LiveChat.pruefVerlaufSetzen([a1, a2, a3]);
    raus.push(["eigene Aufgabe — Emmis Antwort", knopf(a1)]);
    raus.push(["eigene Aufgabe — ihr Geplauder danach", knopf(a2)]);
    raus.push(["eigene Aufgabe — Toms Antwort", knopf(a3)]);

    /* ---- 2. Dasselbe nach dem Neuladen ------------------------ */
    LiveChat.pruefAufgabeMerken();
    LiveChat.pruefAufgabeVergessenImSpeicher();
    const wegOhne = knopf(a1);
    LiveChat.pruefAufgabeZurueckholen();
    LiveChat.pruefVerlaufSetzen([a1, a2, a3]);
    raus.push(["nach Neuladen, bevor die Aufgabe zurück ist", wegOhne]);
    raus.push(["nach Neuladen, Aufgabe zurückgeholt", knopf(a1)]);

    /* ---- 3. Wortpuzzle: auch eine ganz falsche Antwort ist eine
              Antwort — sonst kann er sie nicht benoten. ---------- */
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeStellen("wort", "Fahrrad");
    const b1 = zeile("n1", "emmy", "Motorrad", Date.now() + 1000);
    const b2 = zeile("n2", "emmy", "Radfahr", Date.now() + 2000);
    LiveChat.pruefVerlaufSetzen([b1, b2]);
    raus.push(["Wortpuzzle — ganz daneben, aber die erste Zeile", knopf(b1)]);
    raus.push(["Wortpuzzle — der zweite Versuch derselben Person", knopf(b2)]);

    /* ---- 4. Ein Befehl ist keine Antwort ----------------------- */
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeFrei("Beschreib dein Zimmer");
    const c1 = zeile("o1", "emmy", "/konfetti", Date.now() + 1000);
    const c2 = zeile("o2", "emmy", "Mein Zimmer ist klein und hell.", Date.now() + 2000);
    LiveChat.pruefVerlaufSetzen([c1, c2]);
    raus.push(["ein Befehl gilt nicht als Antwort", knopf(c1)]);
    raus.push(["die Zeile danach schon", knopf(c2)]);

    /* ---- 5. Vor der Aufgabe geschrieben ------------------------ */
    const d1 = zeile("p1", "emmy", "guten Morgen", T0 - 120000);
    raus.push(["was VOR der Aufgabe stand", knopf(d1)]);

    LiveChat.pruefAufgabeFrei("");
    return raus;
  });

  if (!erg) { console.log("  Testnaht fehlt — nur auf localhost."); await br.close(); srv.close(); process.exit(1); }

  const soll = {
    "eigene Aufgabe — Emmis Antwort": true,
    "eigene Aufgabe — ihr Geplauder danach": false,
    "eigene Aufgabe — Toms Antwort": true,
    "nach Neuladen, bevor die Aufgabe zurück ist": false,
    "nach Neuladen, Aufgabe zurückgeholt": true,
    "Wortpuzzle — ganz daneben, aber die erste Zeile": true,
    "Wortpuzzle — der zweite Versuch derselben Person": true,
    "ein Befehl gilt nicht als Antwort": false,
    "die Zeile danach schon": true,
    "was VOR der Aufgabe stand": false
  };
  let fehler = 0;
  console.log("");
  erg.forEach(([was, ist]) => {
    const gut = Boolean(ist) === soll[was];
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + was.padEnd(48)
      + (ist ? "Notenknopf — zur Frage „" + ist.frage + "“" : "kein Notenknopf"));
  });
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Notenknopf steht an der Antwort.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
