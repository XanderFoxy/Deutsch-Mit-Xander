/* PRÜFT: DIE AUFGABE GEHÖRT DEM RAUM, NICHT DEM GERÄT.
   ---------------------------------------------------------------
   GEMELDET, immer wieder: „Die Benotung wird immer noch nicht
   angezeigt zu der Antwort, die von der Frage kommt."

   Zweite Ursache, und sie war so still wie die erste: Die offene
   Aufgabe lag NUR auf dem Gerät, das /aufgabe getippt hat. An alle
   anderen ging bloss eine Chatzeile — schön zu lesen, aber ohne
   Wirkung. Wer die Aufgabe auf dem Telefon stellt und später am
   Rechner die Antworten durchsieht, hat dort gar keine offene Aufgabe
   und damit an keiner Zeile einen Notenknopf. Von aussen sieht das
   aus wie ein kaputter Knopf.

   Gemessen wird deshalb der Weg von Gerät zu Gerät:
     1. Kommt die Aufgabe drüben überhaupt an?
     2. Steht dort danach ein Notenknopf?
     3. Und — das ist der Haken — kommt die LÖSUNG NICHT mit? Sonst
        stünde sie bei einem Wortpuzzle auf jedem Gerät im Raum, und
        wer nachsieht, hat gelöst, ohne zu lösen.
     4. Beendet die eine Seite die Aufgabe, ist sie drüben auch weg. */
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
    if (!LiveChat.pruefAbfangen || !LiveChat.pruefEmpfangen) return { fehlt: true };
    const raus = {};

    /* --- GERÄT 1: hier wird die Aufgabe gestellt.
           Mitgeschrieben wird, was wirklich über die Leitung geht —
           nur so lässt sich beweisen, dass die Lösung NICHT mitreist. */
    const rausgegangen = [];
    LiveChat.pruefAbfangen((p) => rausgegangen.push(JSON.parse(JSON.stringify(p))));
    LiveChat.pruefAufgabeStellen("wort", "Fahrrad");
    LiveChat.pruefAbfangen(null);
    const raus1 = rausgegangen.filter((p) => p && p.art === "aufgabeAn");
    raus.verkuendet = raus1.length;
    raus.paket = raus1[0] || null;

    /* --- GERÄT 2: hier kommt nur das Paket an --- */
    LiveChat.pruefAufgabeFrei("");                       // dieses Gerät weiss nichts
    raus.vorher = LiveChat.offeneAufgabeInfo();
    /* ACHTUNG: „von" MUSS überschrieben werden. Das Paket trägt die
       eigene Kennung, und ein Paket von einem selbst wird beim
       Empfangen zu Recht übergangen — sonst hörte jedes Gerät sich
       selbst zu. Hier soll es ja vom anderen Gerät kommen. */
    LiveChat.pruefEmpfangen(Object.assign({}, raus1[0] || {}, { von: "xander-telefon" }));
    raus.nachher = LiveChat.offeneAufgabeInfo();

    /* Steht jetzt ein Notenknopf an einer Antwort?
       ACHTUNG, und das ist eine ehrliche Folge davon, dass die LÖSUNG
       nicht mitreist: Auf dem zweiten Gerät lässt sich nichts
       vergleichen — geraten wird ja nicht mehr. Eine Zeile, die nur
       zufällig nach der Aufgabe kam, bekommt deshalb hier KEINEN
       Knopf, und das ist richtig so.
       Was zählt, ist der andere Weg: Emmi hat „Darauf antworten"
       angetippt, und ihre Nachricht trägt die Kennung der Aufgabe
       selbst mit sich. Das funktioniert auf JEDEM Gerät, ohne Lösung
       und ohne Raten. */
    const blind = { id: "x0", von: "emmy", name: "Emmi", text: "Motorrad",
                    art: "text", zeit: Date.now() + 1000, eigen: false };
    const n = { id: "x1", von: "emmy", name: "Emmi", text: "Radfahr",
                art: "text", zeit: Date.now() + 2000, eigen: false,
                aufgabeId: (raus1[0] && raus1[0].zeileId) || "a1",
                aufgabeFrage: "Wortpuzzle", aufgabeKlasse: "Rechtschreibung" };
    LiveChat.pruefVerlaufSetzen([blind, n]);
    raus.knopfGeraten = LiveChat.aufgabeBezug(blind) ? true : false;
    const b = LiveChat.aufgabeBezug(n);
    raus.knopf = b ? { klasse: b.klasse || "", frage: b.frage || "" } : null;

    /* --- Und wieder aus --- */
    LiveChat.pruefEmpfangen({ art: "aufgabeAus", von: "xander" });
    raus.nachSchluss = LiveChat.offeneAufgabeInfo();
    raus.knopfDanach = LiveChat.aufgabeBezug(n);
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  if (erg.fehlt) { console.log("  Testnaht fehlt — nur auf localhost."); await br.close(); srv.close(); process.exit(1); }

  console.log("\n  DIE AUFGABE WIRD IM RAUM VERKÜNDET");
  ok(erg.verkuendet === 1, "genau ein Paket geht raus", erg.verkuendet + "×");
  ok(erg.paket && erg.paket.typ === "wort", "mit der Art der Aufgabe",
     erg.paket ? erg.paket.typ : "—");

  console.log("\n  DIE LÖSUNG BLEIBT HIER");
  const feld = erg.paket ? Object.keys(erg.paket).join(", ") : "";
  ok(erg.paket && !("loesung" in erg.paket) && !("teile" in erg.paket),
     "im Paket steht KEINE Lösung — niemand kann spicken", "Felder: " + feld);
  ok(erg.paket && JSON.stringify(erg.paket).indexOf("Fahrrad") < 0,
     "und das Wort selbst taucht nirgends darin auf");

  console.log("\n  AUF DEM ZWEITEN GERÄT");
  ok(!erg.vorher, "vorher weiss es von nichts");
  ok(Boolean(erg.nachher), "danach läuft die Aufgabe auch dort",
     erg.nachher ? erg.nachher.typ + (erg.nachher.klasse ? " → " + erg.nachher.klasse : "") : "—");
  ok(!erg.knopfGeraten, "eine bloss zufällig passende Zeile bekommt KEINEN Knopf — geraten wird nicht");
  ok(Boolean(erg.knopf), "an der angetippten Antwort steht er — auch ohne Lösung auf diesem Gerät",
     erg.knopf ? "Klasse: " + (erg.knopf.klasse || "(keine)") : "KEIN KNOPF");

  console.log("\n  UND WIEDER AUS");
  ok(!erg.nachSchluss, "beendet die andere Seite sie, ist sie auch hier weg");
  /* Eine ANGETIPPTE Antwort gehört auch dann noch zu ihrer Frage, wenn
     die Aufgabe beendet ist — sonst könnte man sie nachträglich nicht
     mehr benoten, und genau das war sein Fall („die Frage ist eine
     Stunde alt"). */
  ok(Boolean(erg.knopfDanach), "die angetippte Antwort bleibt benotbar, auch nach dem Schluss");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Aufgabe gehört jetzt dem Raum.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
