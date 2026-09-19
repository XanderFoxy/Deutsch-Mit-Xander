/* PRÜFT DEN GANZEN WEG EINER NOTE — VOM KNOPF BIS ZU IHR.
   ---------------------------------------------------------------
   GEMELDET, zum fünften Mal: „Die Benotung zeigt es immer noch nicht
   an, das Mädchen versucht es die ganze Zeit und ist schon am
   Verzweifeln. Mache es möglich, dass ich sie anklicken kann als
   Betreiber und dass sie auf der anderen Seite diese Note auch
   wirklich kriegt, mit einer Meldung, dass sie die Note kriegt."

   Dreimal habe ich an der ERKENNUNG gebaut, und dreimal lag noch eine
   Bedingung dahinter. Deshalb hängt der Knopf jetzt nicht mehr davon
   ab, ob die Seite eine Antwort erkennt: Der Lehrer sieht ihn an jeder
   fremden Zeile.

   Gemessen wird beides, und zwar am echten gezeichneten Chat:
     1. Steht der Knopf da — mit offener Aufgabe UND ohne?
     2. Steht er bei den anderen NICHT da?
     3. Geht beim Antippen wirklich ein Paket an die Person raus —
        auch bei einer 5, wo es keine Punkte gibt?
     4. Wird daraus auf ihrer Seite eine sichtbare Meldung? */
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

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  const bauen = async (lehrer, mitAufgabe) => pg.evaluate(([istLehrer, aufgabeLaeuft]) => {
    LiveChat.binLehrer = () => istLehrer;
    LiveChat.pruefAufgabeFrei("");
    if (aufgabeLaeuft) LiveChat.pruefAufgabeFrei("Schreib drei Sätze über dein Wochenende");
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    const t = Date.now() + 2000;
    window.DMA_PRUEFUNG.chatStand([
      { id: "e1", von: "emmy", name: "Emmi", text: "Am Samstag war ich im Park.", art: "text", zeit: t },
      { id: "e2", von: "emmy", name: "Emmi", text: "ach ja und hallo :)", art: "text", zeit: t + 1000 },
      { id: "m1", von: "ich", eigen: true, name: "Xander", text: "Sehr gut!", art: "text", zeit: t + 2000 },
      { id: "s1", von: "", name: "", text: "Emmi betritt den Raum.", art: "kommen", zeit: t + 3000 }
    ]);
    return [...document.querySelectorAll("#lcVerlauf .lc-zeile")].map((z) => ({
      text: (z.querySelector(".lc-zeilentext") || z).textContent.slice(0, 30),
      knopf: Boolean(z.querySelector(".lc-benoten")),
      blass: Boolean(z.querySelector(".lc-benoten-blass"))
    }));
  }, [lehrer, mitAufgabe]);

  console.log("\n  ALS LEHRER, AUFGABE LÄUFT");
  const mit = await bauen(true, true);
  ok(mit.filter((z) => z.knopf).length === 2, "an beiden Zeilen von Emmi steht ein Knopf",
     mit.filter((z) => z.knopf).length + " von " + mit.length + " Zeilen");
  ok(mit.filter((z) => z.knopf && z.blass).length === 0, "und keiner davon ist blass — sie gehören zur Aufgabe");

  console.log("\n  ALS LEHRER, KEINE AUFGABE OFFEN");
  const ohne = await bauen(true, false);
  ok(ohne.filter((z) => z.knopf).length === 2, "der Knopf ist trotzdem da — er kann nicht mehr fehlen",
     ohne.filter((z) => z.knopf).length + " Zeilen");
  ok(ohne.filter((z) => z.knopf && z.blass).length === 2, "aber blass, weil gerade keine Aufgabe läuft");

  console.log("\n  ALS TEILNEHMERIN");
  const gast = await bauen(false, true);
  ok(gast.filter((z) => z.knopf).length === 0, "sie sieht keinen einzigen Knopf",
     gast.filter((z) => z.knopf).length + " Knöpfe");

  console.log("\n  EINE FÜNF — DA GIBT ES KEINE PUNKTE, UND TROTZDEM MUSS SIE ES ERFAHREN");
  const weg = await pg.evaluate(async () => {
    /* Wirklich Betreiber sein — LiveChat.binLehrer von aussen zu
       überschreiben reicht nicht: innerhalb von livechat.js wird die
       eigene Funktion aufgerufen. Daran ist diese Messung beim ersten
       Anlauf vorbeigelaufen. */
    LiveChat.pruefBetreiber(true);
    LiveChat.pruefPersonSetzen && LiveChat.pruefPersonSetzen("emmy", "Emmi");
    const raus = [];
    LiveChat.pruefAbfangen(() => {});           // Raumpakete ignorieren
    const echtesPost = LiveChat.pruefPostAbfangen
      ? LiveChat.pruefPostAbfangen((an, p) => raus.push({ an: an, p: p })) : null;
    void echtesPost;
    LiveChat.noteGeben("emmy", 5, "Satzbau");
    LiveChat.pruefAbfangen(null);
    if (LiveChat.pruefPostAbfangen) LiveChat.pruefPostAbfangen(null);
    return raus;
  });
  const fuerSie = weg.filter((x) => x.p && x.p.art === "note-fuer-dich");
  const punkte = weg.filter((x) => x.p && x.p.art === "punkte");
  ok(fuerSie.length === 1, "ein eigenes Paket geht an sie raus", fuerSie.length + "×");
  ok(punkte.length === 0, "Punkte gibt es bei einer 5 keine — richtig", punkte.length + "×");
  ok(fuerSie[0] && fuerSie[0].p.zahl === 5 && fuerSie[0].p.wofuer === "Satzbau",
     "mit Zahl und Klasse darin",
     fuerSie[0] ? "Note " + fuerSie[0].p.zahl + " in " + fuerSie[0].p.wofuer : "—");

  console.log("\n  UND AUF IHRER SEITE");
  const beiIhr = await pg.evaluate(async () => {
    document.getElementById("lcNotenmeldung")?.remove();
    LiveChat.pruefEmpfangenPost
      ? LiveChat.pruefEmpfangenPost({ art: "note-fuer-dich", von: "xander", vonName: "Xander",
                                      zahl: 5, wort: "mangelhaft", wofuer: "Satzbau", punkte: 0 })
      : null;
    await new Promise((r) => setTimeout(r, 200));
    const m = document.getElementById("lcNotenmeldung");
    const zeilen = LiveChat.lage().nachrichten.map((x) => String(x.text || ""));
    return { meldung: m ? m.textContent.replace(/\s+/g, " ").trim() : "",
             sichtbar: Boolean(m && m.getBoundingClientRect().width > 80),
             imChat: zeilen.filter((t) => t.indexOf("Du hast eine 5") >= 0).length };
  });
  ok(beiIhr.sichtbar, "sie sieht die Note gross in der Mitte", beiIhr.meldung || "NICHTS");
  ok(beiIhr.imChat >= 1, "und im Chat steht sie auch — die geht nicht verloren");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Knopf ist da, und die Note kommt an.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
