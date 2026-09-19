/* PRÜFT DEN NOTENKNOPF AN DER NACHRICHT.
   ---------------------------------------------------------------
   GEMELDET: „Es gibt keine Notenanzeige, nachdem sie mir den Satz
   geschickt hat."
   Und früher, genauso deutlich: „Bei normalen Nachrichten soll dieses
   Zensieren nicht dabeistehen."

   Und, ausdruecklich gegen meinen ersten Weg: „Ich moechte diese
   Benotung nicht global haben, nur an den Antworten von den
   Aufgaben."

   Es gilt also genau eine Regel: der Knopf steht an einer Zeile, die
   als Antwort auf eine gestellte Aufgabe erkannt wurde — und sonst
   nirgends. Gemessen an vier Zeilen in der echten App. */
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

  const lauf = async (lehrer, mitAufgabe) => pg.evaluate(([istLehrer, aufgabeLaeuft]) => {
    LiveChat.binLehrer = () => istLehrer;
    /* Eine Aufgabe stellen — und dann so tun, als sei die Seite
       neu geladen worden: die Zeilen tragen KEINE Marke mehr, sie
       kommen ja aus dem Geraet zurueck. */
    LiveChat.pruefAufgabeFrei("");
    if (aufgabeLaeuft) LiveChat.pruefAufgabeStellen("satz", "Der Hund läuft über die Wiese");
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    const t = Date.now();
    window.DMA_PRUEFUNG.chatStand([
      { id: "a", von: "emmy", name: "Emmy", text: "Der Hund läuft über die Wiese", art: "text", zeit: t },
      { id: "b", von: "emmy", name: "Emmy", text: "Der Hund läuft", art: "text", zeit: t, versuch: true, richtig: false },
      { id: "c", von: "ich", eigen: true, name: "Xander", text: "Sehr gut!", art: "text", zeit: t },
      { id: "d", von: "emmy", name: "Emmy", text: "", art: "text", zeit: t, sprach: "data:audio/webm;base64,AA" }
    ]);
    return window.DMA_PRUEFUNG.notenKnoepfe();
  }, [lehrer, mitAufgabe]);

  /* WIEDER GEÄNDERT in v315, und zwar zurück auf seinen Einspruch:
     „Jetzt steht die Note überall, das soll nicht so sein. Du sollst
     nicht Trick 17 machen … es soll die Benotung für die Aufgabe sein,
     und das soll das System verstehen, dass diese Antwort von der
     Aufgabe kommt."

     Er hat recht: Überall einen Knopf hinzusetzen hat die Frage nicht
     gelöst, sondern übergangen. Der Knopf steht wieder nur an einer
     Antwort — nur wird sie jetzt nicht mehr geraten: entweder sie
     trägt die Kennung ihrer Aufgabe selbst mit sich („Darauf
     antworten"), oder es ist ein Puzzle mit Musterlösung, mit der
     sich vergleichen lässt.
     „Der Hund läuft" ist ein Versuch am Satzpuzzle (versuch: true),
     „Der Hund läuft über die Wiese" ohne Marke und ohne offene
     Aufgabe dagegen eine ganz gewöhnliche Zeile. */
  const erwartet = {
    "Der Hund läuft über die Wiese": false,
    "Der Hund läuft": true,                   // trägt versuch: true
    "Sehr gut!": false                        // meine eigene Zeile — nie
  };
  let fehler = 0;
  const zeilen = await lauf(true, false);
  console.log("\n  ALS LEHRER, OHNE OFFENE AUFGABE");
  zeilen.forEach((z) => {
    const name = z.text || "(Sprachnachricht)";
    /* Nur was zu einer Aufgabe gehört — alles andere nicht. */
    const soll = erwartet[z.text] !== undefined ? erwartet[z.text] : false;
    const gut = z.note === soll;
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + (z.note ? "Notenknopf   " : "kein Knopf   ") + name);
  });
  /* UND DIE GEGENPROBE, die der eigentliche Punkt ist:
     GEMELDET: „Ich habe gesehen, dass Emmi in ihrem Screenshot diese
     Benotung noch hat. Die soll fuer die anderen gar nicht da sein."
     Also dasselbe noch einmal aus der Sicht von jemandem, der NICHT
     Lehrer ist — dort darf kein einziger Knopf stehen. */
  /* UND DER EIGENTLICHE FALL: die Aufgabe laeuft, aber die Zeilen
     kommen ohne Marke zurueck — so wie nach jedem Neuladen. */
  const nachNeuladen = await lauf(true, true);
  console.log("\n  ALS LEHRER, AUFGABE LÄUFT (Zeilen ohne Marke, wie nach dem Neuladen)");
  nachNeuladen.forEach((z) => {
    /* Mit offener Aufgabe (Satzpuzzle „Der Hund läuft über die Wiese"):
       die richtige Lösung und der erkennbare Versuch — mehr nicht. */
    const soll = z.text === "Der Hund läuft über die Wiese" || z.text === "Der Hund läuft";
    const gut = z.note === soll;
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + (z.note ? "Notenknopf   " : "kein Knopf   ")
      + (z.text || "(Sprachnachricht)"));
  });

  /* =================================================================
     UND DIE VORAUSWAHL: WOFÜR WIRD BENOTET?
     -----------------------------------------------------------------
     GEWÜNSCHT: „Leg gleich auch einmal eine Klasse fest für diese Art
     von Spiel … dann gib als Vorauswahl mal, für was ich die Note
     gebe. Ist das Satzbau oder ist das Grammatik?"
     Es heisst Satzbau. Hier wird gemessen, ob beim Satzpuzzle wirklich
     Satzbau angewählt ist — und beim Wortpuzzle Rechtschreibung.
     ================================================================= */
  const klassen = await pg.evaluate(async () => {
    const wahlAnsehen = (typ, loesung) => {
      LiveChat.binLehrer = () => true;
      LiveChat.pruefAufgabeFrei("");
      LiveChat.pruefAufgabeStellen(typ, loesung);
      document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
      const chat = document.createElement("div");
      chat.className = "lc-chat";
      chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
      document.body.appendChild(chat);
      window.DMA_PRUEFUNG.chatStand([
        { id: "z1", von: "emmy", name: "Emmy", text: loesung, art: "text", zeit: Date.now() }
      ]);
      const knopf = document.querySelector("#lcVerlauf .lc-benoten");
      if (!knopf) return { fehlt: true };
      knopf.click();
      const chips = [...document.querySelectorAll("#lcVerlauf .lc-notenklasse")];
      const an = chips.filter((c) => c.classList.contains("lc-notenklasse-an")).map((c) => c.textContent);
      const feld = document.querySelector("#lcVerlauf .lc-notenfach");
      return { chips: chips.map((c) => c.textContent), an: an, feld: feld ? feld.value : "" };
    };
    return { satz: wahlAnsehen("satz", "Der Hund läuft über die Wiese"),
             wort: wahlAnsehen("wort", "Fahrrad") };
  });
  console.log("\n  WOFÜR DIE NOTE? (Vorauswahl)");
  const pruefKlasse = (was, erg, soll) => {
    const gut = !erg.fehlt && erg.an.length === 1 && erg.an[0] === soll && erg.feld === soll;
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + was + "   angewählt: "
      + (erg.fehlt ? "KEIN NOTENKNOPF" : (erg.an.join(", ") || "(nichts)"))
      + (erg.chips ? "   zur Auswahl: " + erg.chips.join(" · ") : ""));
  };
  pruefKlasse("Satzpuzzle  → Satzbau        ", klassen.satz, "Satzbau");
  pruefKlasse("Wortpuzzle  → Rechtschreibung", klassen.wort, "Rechtschreibung");

  const alsGast = await lauf(false, true);
  console.log("\n  ALS TEILNEHMER (nicht Lehrer)");
  const knoepfe = alsGast.filter((z) => z.note).length;
  if (knoepfe) fehler++;
  console.log("  " + (knoepfe ? "FEHL " : "ok   ") + "Notenknöpfe insgesamt: " + knoepfe
    + (knoepfe ? "" : "   (keiner — richtig)"));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Alles wie gewuenscht.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
