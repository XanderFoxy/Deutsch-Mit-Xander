/* PRÜFT, OB DAS KLASSENZIMMER DAS KONTO ÜBERHAUPT FINDET.
   ---------------------------------------------------------------
   GEMELDET: „Zum Unterricht rufen darf nur der Betreiber … Emmi ist
   gerade nirgends zu finden und das Postfach steht hier nicht zur
   Verfügung."

   Die Ursache war eine Kleinigkeit mit grosser Wirkung: backend.js
   beginnt mit „const Backend = …". Ein const auf oberster Ebene
   erzeugt einen globalen NAMEN, aber KEINE Eigenschaft am Fenster.
   „Backend" gibt es also, „window.Backend" nicht — und jede Prüfung
   der Form „window.Backend && …" ist damit immer falsch.

   Gemessen wird deshalb dreierlei:
     1. Gibt es Backend als Namen? Und am Fenster?
     2. Findet livechat.js es jetzt (konto())?
     3. Fragt der Lehrer-Rang das Konto — statt einer Marke, die
        beim Betreten einmal gesetzt wurde? */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(W, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage();
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2200);

  const erg = await pg.evaluate(() => {
    const vorher = {
      alsName: typeof Backend,
      amFenster: typeof window.Backend,
      /* So sah die alte Prüfung aus — genau diese Zeile stand in
         livechat.js und war immer falsch. */
      altePruefung: Boolean(window.Backend && Backend.currentUser)
    };
    /* Und so fragt es jetzt. Das Konto sagt „nicht angemeldet" —
       das ist richtig und nicht dasselbe wie „gibt es nicht". */
    const jetzt = {
      findetKonto: Boolean(LiveChat.binBetreiber),
      betreiberJetzt: LiveChat.binBetreiber ? LiveChat.binBetreiber() : null,
      lehrerJetzt: LiveChat.binLehrer ? LiveChat.binLehrer() : null,
      /* Der Kern: fragt binBetreiber() WIRKLICH das Konto? Dann muss
         es sich ändern, wenn man das Konto tauscht. */
      reagiertAufKonto: (() => {
        const echt = Backend.isOwner;
        try {
          Backend.isOwner = () => true;
          const a = LiveChat.binBetreiber();
          Backend.isOwner = () => false;
          Backend.canModerate = () => false;
          const b = LiveChat.binBetreiber();
          return a === true && b === false;
        } finally { Backend.isOwner = echt; }
      })()
    };
    return { vorher, jetzt };
  });

  console.log("Backend als Name          : " + erg.vorher.alsName);
  console.log("Backend am Fenster        : " + erg.vorher.amFenster);
  console.log("alte Prüfung window.Backend: " + erg.vorher.altePruefung + "   ← das war der Fehler");
  console.log("");
  console.log("LiveChat.binBetreiber da  : " + erg.jetzt.findetKonto);
  console.log("betreiber jetzt (abgemeldet): " + erg.jetzt.betreiberJetzt);
  console.log("fragt wirklich das Konto  : " + erg.jetzt.reagiertAufKonto);

  const ok = erg.vorher.altePruefung === false && erg.jetzt.findetKonto && erg.jetzt.reagiertAufKonto;
  console.log(ok
    ? "\n✅ Der Rang wird jetzt beim Konto nachgefragt, nicht aus einer alten Marke gelesen."
    : "\n❌ Es hängt noch.");
  await br.close(); srv.close();
})();
