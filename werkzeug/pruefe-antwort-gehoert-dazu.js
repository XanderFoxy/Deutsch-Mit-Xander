/* PRÜFT: DAS SYSTEM RÄT NICHT MEHR, ES WEISS.
   ---------------------------------------------------------------
   GEMELDET: „Du sollst nicht Trick 17 machen und einfach überall eine
   Benotung dranmachen, sondern es soll die Benotung für die Aufgabe
   sein. Es soll dazugehören, und das soll das System verstehen, dass
   diese Antwort von der Aufgabe kommt und deswegen soll die Benotung
   dranstehen für diese Klasse."

   Viermal habe ich versucht, es zu ERRATEN — an der Uhrzeit, an der
   Reihenfolge, an der Ähnlichkeit zur Lösung. Beim fünften Mal habe
   ich überall einen Knopf hingesetzt; das war noch schlechter, weil es
   die Frage übergangen hat.

   Jetzt sagt es die Antwort selbst: Wer die Aufgabenzeile antippt,
   antwortet darauf, und die Nachricht trägt die Kennung der Aufgabe
   mit sich. Gemessen wird genau das:
     1. Trägt die Nachricht die Kennung wirklich — über die Leitung?
     2. Steht der Notenknopf dann an IHR, und sonst nirgends?
     3. Gilt das auch noch, wenn die Aufgabe längst beendet ist?
     4. Und wird ohne Antippen nicht mehr geraten? */
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

  const erg = await pg.evaluate(async () => {
    const raus = {};
    LiveChat.pruefBetreiber(true);
    LiveChat.pruefLageSetzen("drin");

    /* --- Auf IHRER Seite: die Aufgabe antippen und antworten --- */
    LiveChat.pruefAufgabeFrei("");
    const rausgegangen = [];
    LiveChat.pruefAbfangen((p) => rausgegangen.push(JSON.parse(JSON.stringify(p))));
    LiveChat.pruefAufgabeFrei("Schreib drei Sätze über dein Wochenende");
    const aufgabenZeile = LiveChat.lage().nachrichten.filter((n) => n.art === "aufgabe").pop();
    raus.aufgabeHatKennung = Boolean(aufgabenZeile && aufgabenZeile.id);

    LiveChat.antwortAufSetzen(aufgabenZeile.id, "Schreib drei Sätze über dein Wochenende", "");
    raus.band = LiveChat.antwortAufLage();
    LiveChat.schreiben("Am Samstag war ich im Park. Es war schön.");
    LiveChat.pruefAbfangen(null);
    const gesendet = rausgegangen.filter((p) => p.art === "text").pop();
    raus.imPaket = gesendet ? String(gesendet.aufgabeId || "") : "";
    raus.bandDanach = LiveChat.antwortAufLage();

    /* --- Auf SEINER Seite: dasselbe Paket kommt an --- */
    LiveChat.pruefVerlaufSetzen([]);
    LiveChat.pruefEmpfangen(Object.assign({}, gesendet, { von: "emmy", name: "Emmi" }));
    const ihre = LiveChat.lage().nachrichten.filter((n) => n.von === "emmy").pop();
    raus.zeileTraegt = ihre ? String(ihre.aufgabeId || "") : "";
    const b = LiveChat.aufgabeBezug(ihre);
    raus.knopf = b ? { sicher: Boolean(b.sicher), frage: String(b.frage || "").slice(0, 40) } : null;

    /* --- Eine gewöhnliche Zeile daneben: kein Knopf --- */
    const egal = { id: "x9", von: "emmy", name: "Emmi", text: "ach ja und hallo",
                   art: "text", zeit: Date.now() + 5000, eigen: false };
    LiveChat.pruefVerlaufSetzen([ihre, egal]);
    raus.knopfDaneben = LiveChat.aufgabeBezug(egal);

    /* --- Und wenn die Aufgabe längst beendet ist? --- */
    LiveChat.pruefAufgabeFrei("");
    raus.nachSchluss = LiveChat.aufgabeBezug(ihre) ? true : false;
    raus.nachSchlussDaneben = LiveChat.aufgabeBezug(egal) ? true : false;
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  console.log("\n  SIE TIPPT DIE AUFGABE AN UND ANTWORTET");
  ok(erg.aufgabeHatKennung, "die Aufgabenzeile hat eine Kennung");
  ok(Boolean(erg.band), "das Band über der Schreibzeile sagt, worauf sie antwortet",
     erg.band ? "„" + erg.band.frage.slice(0, 40) + "“" : "—");
  ok(Boolean(erg.imPaket), "die Kennung reist mit der Nachricht über die Leitung",
     erg.imPaket || "NICHTS");
  ok(!erg.bandDanach, "nach dem Absenden ist das Band wieder weg");

  console.log("\n  BEI IHM KOMMT SIE AN");
  ok(Boolean(erg.zeileTraegt), "die Zeile trägt die Kennung ihrer Aufgabe", erg.zeileTraegt || "—");
  ok(Boolean(erg.knopf && erg.knopf.sicher), "der Notenknopf steht dort — und zwar sicher, nicht geraten",
     erg.knopf ? "zur Frage „" + erg.knopf.frage + "“" : "KEIN KNOPF");
  ok(!erg.knopfDaneben, "an ihrer gewöhnlichen Zeile daneben steht KEINER — kein Trick 17");

  console.log("\n  UND AUCH SPÄTER NOCH");
  ok(erg.nachSchluss, "die Aufgabe ist beendet — die Antwort gehört trotzdem zu ihrer Frage");
  ok(!erg.nachSchlussDaneben, "und die gewöhnliche Zeile bleibt gewöhnlich");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Das System weiss es jetzt, statt zu raten.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
