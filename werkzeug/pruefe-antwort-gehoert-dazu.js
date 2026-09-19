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

   Jetzt sitzt die Regel im ABSCHICKEN: Steht eine Aufgabe offen, trägt
   jede abgeschickte Nachricht die Kennung dieser Aufgabe mit sich.
   Niemand muss etwas anklicken, beliebig viele können antworten, und
   wer sich eine Stunde später doch noch traut, ist genauso dabei.

   Gemessen wird:
     1. Trägt die Nachricht die Kennung — über die Leitung?
     2. Steht der Notenknopf dann an ihr, und sonst nirgends?
     3. Können MEHRERE nacheinander auf dieselbe Frage antworten?
     4. Gilt es auch, wenn die Aufgabe längst beendet ist?
     5. Und bleibt die Aufgabenzeile EINZEILIG — die Frage rechts neben
        der Uhrzeit, nicht darunter? */
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

    /* Kein Knopf, kein Band — einfach schreiben und abschicken. */
    LiveChat.schreiben("Am Samstag war ich im Park. Es war schön.");
    LiveChat.schreiben("Und am Sonntag habe ich gelernt.");
    LiveChat.pruefAbfangen(null);
    /* ACHTUNG: Die Aufgabenzeile selbst geht auch als „text" raus
       (mit chatArt „aufgabe") — sie ist keine Antwort und muss hier
       heraus, sonst misst man die falsche Nachricht. */
    const alleText = rausgegangen.filter((p) => p.art === "text" && p.chatArt !== "aufgabe");
    const gesendet = alleText[0];
    raus.imPaket = gesendet ? String(gesendet.aufgabeId || "") : "";
    raus.mehrere = alleText.filter((p) => p.aufgabeId).length;

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

  console.log("\n  SIE SCHREIBT UND SCHICKT AB — MEHR NICHT");
  ok(erg.aufgabeHatKennung, "die Aufgabenzeile hat eine Kennung");
  ok(Boolean(erg.imPaket), "die Kennung reist mit der Nachricht über die Leitung",
     erg.imPaket || "NICHTS");
  ok(erg.mehrere >= 2, "und zwar bei JEDER Nachricht, nicht nur der ersten",
     erg.mehrere + " von 2");

  console.log("\n  BEI IHM KOMMT SIE AN");
  ok(Boolean(erg.zeileTraegt), "die Zeile trägt die Kennung ihrer Aufgabe", erg.zeileTraegt || "—");
  ok(Boolean(erg.knopf && erg.knopf.sicher), "der Notenknopf steht dort — und zwar sicher, nicht geraten",
     erg.knopf ? "zur Frage „" + erg.knopf.frage + "“" : "KEIN KNOPF");
  ok(!erg.knopfDaneben, "an ihrer gewöhnlichen Zeile daneben steht KEINER — kein Trick 17");

  console.log("\n  UND AUCH SPÄTER NOCH");
  ok(erg.nachSchluss, "die Aufgabe ist beendet — die Antwort gehört trotzdem zu ihrer Frage");
  ok(!erg.nachSchlussDaneben, "und die gewöhnliche Zeile bleibt gewöhnlich");

  /* =================================================================
     UND DIE AUFGABENZEILE BLEIBT EINZEILIG
     -----------------------------------------------------------------
     GEMELDET: „Jetzt steht die Frage untereinander unter der Uhrzeit,
     deswegen hast du alles total zerstört. Die Frage soll so sein, wie
     sie vorher war — rechts neben der Uhrzeit."

     Der Grund war ein Knopf, den ich in die Zeile gehängt hatte. Eine
     Chatzeile ist ein Gitter aus drei Spalten (Uhrzeit | Name |
     Inhalt); ein viertes Kind landet zwangsläufig in einer neuen
     Zeile darunter. Gemessen wird deshalb ganz direkt: Steht der Text
     RECHTS von der Uhrzeit, auf derselben Höhe?
     ================================================================= */
  const zeile = await pg.evaluate(() => {
    LiveChat.pruefBetreiber(true);
    LiveChat.pruefAufgabeFrei("");
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    window.DMA_PRUEFUNG.chatStand([
      { id: "a1", von: "ich", eigen: true, name: "Xander", art: "aufgabe",
        /* Kurz halten: ein langer Satz UMBRICHT ganz normal und macht
           die Zeile höher — das ist kein Fehler und würde die Messung
           nur verwischen. Gemessen werden soll, ob der Text NEBEN der
           Uhrzeit steht oder darunter. */
        text: "📝 Aufgabe: Schreib drei Sätze",
        zeit: Date.now() }
    ]);
    const z = document.querySelector("#lcVerlauf .lc-zeile");
    if (!z) return null;
    const uhr = z.querySelector(".lc-zeit");
    const txt = z.querySelector(".lc-zeilentext") || z.lastElementChild;
    const zr = z.getBoundingClientRect(), ur = uhr.getBoundingClientRect(),
          tr = txt.getBoundingClientRect();
    return {
      kinder: z.children.length,
      hoehe: Math.round(zr.height),
      uhrUnten: Math.round(ur.bottom), textOben: Math.round(tr.top),
      textLinks: Math.round(tr.left), uhrRechts: Math.round(ur.right),
      textBreite: Math.round(tr.width), spalten: getComputedStyle(z).gridTemplateColumns,
      text: txt.textContent.slice(0, 40)
    };
  });
  console.log("\n  DIE AUFGABENZEILE SELBST");
  if (!zeile) { ok(false, "die Zeile wird gezeichnet"); }
  else {
    ok(zeile.textOben < zeile.uhrUnten, "der Text steht auf derselben Höhe wie die Uhrzeit — nicht darunter",
       "Uhrzeit endet bei " + zeile.uhrUnten + " px, Text beginnt bei " + zeile.textOben + " px");
    ok(zeile.textLinks >= zeile.uhrRechts - 2, "und rechts daneben",
       "Uhrzeit bis " + zeile.uhrRechts + " px, Text ab " + zeile.textLinks + " px");
    /* DAS ist das eigentliche Mass. Vorher landete der Text in der
       NAMENSSPALTE — gemessene 80 Pixel — und brach dort in einen
       schmalen Turm um. Jetzt bekommt er den ganzen Rest der Zeile.
       (Die Höhe selbst sagt hier nichts: eine Aufgabenzeile trägt
       zusätzlich die antippbaren Satzteile, und die dürfen Platz
       brauchen.) */
    ok(zeile.textBreite > 200, "der Text bekommt die ganze Breite, nicht die schmale Namensspalte",
       zeile.textBreite + " px breit (vorher 80) — Spalten: " + zeile.spalten);
    ok(zeile.kinder <= 3, "und sie hat höchstens drei Gitterkinder — kein vierter Knopf",
       zeile.kinder + " Kinder");
  }

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Das System weiss es jetzt, statt zu raten — und die Zeile sitzt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
