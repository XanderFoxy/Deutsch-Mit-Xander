/* PRÜFT: EINE FALSCH GEHENDE UHR SCHALTET NIEMANDEN STUMM.
   ---------------------------------------------------------------
   GEMELDET: „Emmy kann mich auf ihrer Seite nicht mehr hören."

   Im Empfänger stand:
       if (w.zeit && Date.now() - w.zeit > 90 Sekunden) → wegwerfen
   Das Alter wurde also aus SEINER Uhr und IHRER Uhr gerechnet. Geht
   ein Telefon anderthalb Minuten nach — und das kommt vor —, galt
   jede seiner Wortmeldungen bei ihr als „zu alt" und verschwand.
   Stillschweigend, denn der Hinweis darauf ist abgeschaltet.

   Gemessen wird mit vier Wortmeldungen: eine mit richtiger Uhr, eine
   von einem Telefon, das zwei Minuten nachgeht, eine von einem, das
   vorgeht — und eine, die wirklich alt in der eigenen Reihe liegt. */
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
    const jetzt = Date.now();
    const ton = "data:audio/webm;base64,AAAA";
    const rein = (id, zeit, sek) => {
      LiveChat.pruefWarteschlangeLeeren();
      LiveChat.pruefLiveRein({ id: id, von: "emmy", name: "Emmy", sprach: ton + id,
                               sprachSek: sek, zeit: zeit, art: "live" });
      return LiveChat.pruefWarteschlange();
    };
    const raus = {};
    raus.richtigeUhr = rein("u1", jetzt, 3).length;
    raus.uhrGehtNach = rein("u2", jetzt - 120000, 4).length;   // sein Telefon: 2 min zurück
    raus.uhrGehtVor = rein("u3", jetzt + 120000, 5).length;    // sein Telefon: 2 min vor
    /* Und eine, die wirklich in der eigenen Reihe alt geworden ist. */
    rein("u4", jetzt, 6);
    LiveChat.pruefReiheAltern(120000);
    raus.inDerReiheAlt = LiveChat.pruefNaechste ? (LiveChat.pruefNaechste() ? 1 : 0) : -1;
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  KOMMT SIE IN DIE REIHE?");
  ok(erg.richtigeUhr === 1, "richtig gehende Uhr", erg.richtigeUhr + " in der Reihe");
  ok(erg.uhrGehtNach === 1, "sein Telefon geht zwei Minuten NACH — sie wird trotzdem gehört",
     erg.uhrGehtNach + " in der Reihe");
  ok(erg.uhrGehtVor === 1, "sein Telefon geht zwei Minuten VOR", erg.uhrGehtVor + " in der Reihe");
  console.log("\n  UND WAS WIRKLICH ALT IST");
  ok(erg.inDerReiheAlt === 0, "was zwei Minuten in der eigenen Reihe lag, wird übersprungen");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Keine fremde Uhr schaltet mehr jemanden stumm.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
