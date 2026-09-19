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

    /* ---- 5. DER GEMELDETE FALL: die Frage ist eine Stunde alt,
              sie hat zwischendurch geplaudert und scrollt jetzt hoch,
              um sie doch noch zu beantworten. ------------------- */
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeFrei("Schreib drei Sätze über dein Wochenende");
    const STUNDE = 60 * 60 * 1000;
    const e1 = zeile("s1", "emmy", "Moment, ich bin gleich zurück", Date.now() + 5000);
    const e2 = zeile("s2", "emmy", "ok", Date.now() + 60000);
    const e3 = zeile("s3", "emmy", "Am Samstag war ich im Park. Es war schön. Danach habe ich gelesen.",
                     Date.now() + STUNDE);
    LiveChat.pruefVerlaufSetzen([e1, e2, e3]);
    raus.push(["eine Stunde später doch noch beantwortet", knopf(e3)]);
    raus.push(["auch das Geplauder von vorhin ist benotbar", knopf(e1)]);

    /* ---- 6. Die Klasse: was schlägt die Seite vor? ------------- */
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeStellen("satz", "Der Hund läuft über die Wiese");
    const k1 = zeile("k1", "emmy", "Der Hund über die Wiese läuft", Date.now() + 1000);
    LiveChat.pruefVerlaufSetzen([k1]);
    const kb = LiveChat.aufgabeBezug(k1);
    raus.push(["Satzpuzzle — die Klasse", kb ? { frage: kb.klasse || "(keine)" } : null]);
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeStellen("wort", "Fahrrad");
    const k2 = zeile("k2", "emmy", "Radfahr", Date.now() + 1000);
    LiveChat.pruefVerlaufSetzen([k2]);
    const kb2 = LiveChat.aufgabeBezug(k2);
    raus.push(["Wortpuzzle — die Klasse", kb2 ? { frage: kb2.klasse || "(keine)" } : null]);

    /* ---- 7. DER NEUE, SICHERE WEG: sie tippt die Aufgabe an.
              Die Nachricht trägt die Kennung selbst mit sich — dann
              ist nichts mehr zu raten, und es gilt auch, wenn die
              Aufgabe längst beendet ist. ------------------------- */
    LiveChat.pruefAufgabeFrei("");
    LiveChat.pruefAufgabeFrei("Beschreib dein Wochenende");
    const aufg = LiveChat.lage().nachrichten.filter((x) => x.art === "aufgabe").pop();
    const g1 = zeile("g1", "emmy", "Ich war im Park und habe gelesen.", Date.now() + 9000);
    g1.aufgabeId = aufg ? aufg.id : "x";
    g1.aufgabeFrage = "Beschreib dein Wochenende";
    LiveChat.pruefVerlaufSetzen([g1]);
    raus.push(["angetippt: die Antwort sagt selbst, wozu sie gehört", knopf(g1)]);
    LiveChat.pruefAufgabeFrei("");
    raus.push(["angetippt, und die Aufgabe ist längst beendet", knopf(g1)]);

    /* ---- 8. Vor der Aufgabe geschrieben ------------------------ */
    const d1 = zeile("p1", "emmy", "guten Morgen", T0 - 120000);
    raus.push(["was VOR der Aufgabe stand", knopf(d1)]);

    LiveChat.pruefAufgabeFrei("");
    return raus;
  });

  if (!erg) { console.log("  Testnaht fehlt — nur auf localhost."); await br.close(); srv.close(); process.exit(1); }

  /* DIE REGEL HAT SICH GEÄNDERT, und zwar auf seinen Einspruch hin:
     „Du sollst nicht Trick 17 machen und einfach überall eine Benotung
     dranmachen. Es soll die Benotung für die Aufgabe sein, und das
     soll das System verstehen, dass diese Antwort von der Aufgabe
     kommt."

     Geraten wird deshalb nicht mehr. Es gibt nur noch zwei Wege, auf
     denen eine Zeile zur Antwort wird:
       1. Sie sagt es selbst — jemand hat „Darauf antworten" angetippt,
          und die Kennung der Aufgabe reist mit (aufgabeId). Das ist
          sicher, gilt für jede Frage und auch noch morgen.
       2. Ein Wort- oder Satzpuzzle: dort gibt es eine Musterlösung,
          mit der sich wirklich VERGLEICHEN lässt.

     Bei einer Aufgabe in eigenen Worten gibt es nichts zu vergleichen
     — dort führt nur noch Weg 1 hin. Was hier früher „Notenknopf"
     hiess, heisst deshalb jetzt „kein Notenknopf, ausser man tippt
     die Aufgabe an". */
  const soll = {
    "eigene Aufgabe — Emmis Antwort": false,
    "eigene Aufgabe — ihr Geplauder danach": false,
    "eigene Aufgabe — Toms Antwort": false,
    "nach Neuladen, bevor die Aufgabe zurück ist": false,
    "nach Neuladen, Aufgabe zurückgeholt": false,
    "Wortpuzzle — ganz daneben, aber die erste Zeile": false,
    "Wortpuzzle — der zweite Versuch derselben Person": true,
    "ein Befehl gilt nicht als Antwort": false,
    "die Zeile danach schon": false,
    "eine Stunde später doch noch beantwortet": false,
    "auch das Geplauder von vorhin ist benotbar": false,
    "Satzpuzzle — die Klasse": true,
    "Wortpuzzle — die Klasse": true,
    "was VOR der Aufgabe stand": false,
    "angetippt: die Antwort sagt selbst, wozu sie gehört": true,
    "angetippt, und die Aufgabe ist längst beendet": true
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
