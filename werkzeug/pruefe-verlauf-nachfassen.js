/* PRÜFT, OB DER GEMEINSAME VERLAUF WIRKLICH NACHGEHOLT WIRD.
   ---------------------------------------------------------------
   GEMELDET: „Ich bin ins Klassenzimmer zurück und hab wieder einen
   alten Stand geladen bekommen, der nicht der aktuelle Chat ist."

   Der Grund steht in angemeldeterZugang(): Ohne fertige Anmeldung gibt
   es keinen Zugang zur Tabelle — dann liefert serverLaden() eine
   LEERE Liste, ganz ohne Fehler. Genau das passiert beim Betreten
   direkt nach dem Laden der Seite, weil der Anmeldeschlüssel in dem
   Moment erst wiederhergestellt wird. Es blieb dann bei dem, was im
   Gerät lag — also beim alten Stand, und sichtbar war davon nichts.

   Hier wird genau dieser Ablauf nachgestellt: Beim ersten Anlauf gibt
   es noch keine Anmeldung, danach schon. Gemessen wird, ob das
   Nachfassen den Verlauf wirklich noch holt — und ob es aufhört,
   sobald etwas da ist. */
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
    if (!LiveChat.pruefVerlaufFrisch || !LiveChat.pruefVerlaufStand) return null;
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    const raus = {};

    /* Eine Tabelle, wie PostgREST sie zurückgibt — aber nur, wenn die
       „Anmeldung" schon steht. Vorher gibt es gar keinen Zugang, genau
       wie im Ernstfall. */
    let angemeldet = false;
    let abfragen = 0;
    const ZEILEN = [
      { id: 1, raum: "klassenzimmer", autor: "u-emmy", name: "Emmi",
        text: "Bist du noch da?", art: "text", quelle_id: "e-1",
        erstellt: new Date(Date.now() - 60000).toISOString() },
      { id: 2, raum: "klassenzimmer", autor: "u-emmy", name: "Emmi",
        text: "Ich habe die Aufgabe gemacht.", art: "text", quelle_id: "e-2",
        erstellt: new Date(Date.now() - 30000).toISOString() }
    ];
    const kette = (daten) => {
      const k = {};
      ["select","eq","is","not","or","neq","gte","lt","order","limit"].forEach((m) => { k[m] = () => k; });
      k.then = (ok, schief) => Promise.resolve({ data: daten, error: null }).then(ok, schief);
      k.catch = (f) => Promise.resolve({ data: daten, error: null }).catch(f);
      return k;
    };
    window.Backend = window.Backend || {};
    Backend.currentUser = () => ({ id: "u-xander" });
    Backend.zugang = () => {
      if (!angemeldet) return null;          // genau der gemeldete Fall
      abfragen += 1;
      return { from: (tisch) => kette(tisch ? ZEILEN : []) };
    };

    LiveChat.pruefRaum("klassenzimmer");
    LiveChat.pruefVerlaufSetzen([
      { id: "alt-1", von: "u-xander", name: "Xander", text: "Guten Morgen",
        art: "text", zeit: Date.now() - 300000, eigen: true }
    ]);
    LiveChat.pruefLageSetzen ? LiveChat.pruefLageSetzen("drin") : null;
    raus.hatLageNaht = Boolean(LiveChat.pruefLageSetzen);

    /* 1. Der erste Anlauf — ohne Anmeldung. */
    await LiveChat.pruefVerlaufFrisch(true);
    raus.nachErstem = {
      zeilen: LiveChat.lage().nachrichten.length,
      stand: LiveChat.pruefVerlaufStand()
    };

    /* 2. Jetzt steht die Anmeldung — und das Nachfassen muss greifen. */
    angemeldet = true;
    await warte(3200);
    raus.nachNachfassen = {
      zeilen: LiveChat.lage().nachrichten.length,
      texte: LiveChat.lage().nachrichten.map((n) => String(n.text || "").slice(0, 28)),
      stand: LiveChat.pruefVerlaufStand()
    };

    /* 3. Und danach ist Ruhe: es wird nicht endlos weitergefragt. */
    const vorher = abfragen;
    await warte(2600);
    raus.weitereAbfragen = abfragen - vorher;
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  if (!erg) { console.log("  Testnaht fehlt — nur auf localhost."); await br.close(); srv.close(); process.exit(1); }

  console.log("\n  DER ERSTE ANLAUF — DIE ANMELDUNG STEHT NOCH NICHT");
  ok(erg.nachErstem.zeilen === 1, "es bleibt beim alten Stand aus dem Gerät",
     erg.nachErstem.zeilen + " Zeile(n)");
  ok(!erg.nachErstem.stand.vomServer, "vom Server kam nichts — und das wird gemerkt");
  ok(erg.nachErstem.stand.uhren >= 1, "das Nachfassen ist eingeplant",
     erg.nachErstem.stand.uhren + " Nachfass-Termine");

  console.log("\n  DIE ANMELDUNG STEHT — JETZT MUSS ES KOMMEN");
  ok(erg.nachNachfassen.zeilen > erg.nachErstem.zeilen,
     "der gemeinsame Verlauf ist da", erg.nachNachfassen.zeilen + " Zeilen: "
       + erg.nachNachfassen.texte.join(" · "));
  ok(erg.nachNachfassen.stand.vomServer, "und es ist als „vom Server“ vermerkt");
  ok(erg.nachNachfassen.stand.versuche >= 2, "es hat mehr als einen Anlauf gebraucht",
     erg.nachNachfassen.stand.versuche + " Anläufe");

  console.log("\n  UND DANN IST RUHE");
  ok(erg.weitereAbfragen === 0, "es wird nicht endlos weitergefragt",
     erg.weitereAbfragen + " weitere Abfragen");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der aktuelle Chat kommt nach, auch wenn die Anmeldung hinterherhinkt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
