/* PRÜFT, OB EIN BLOCKIERTER TON DEN RAUM ANHÄLT.
   ---------------------------------------------------------------
   GEFRAGT: „Bist du sicher, dass Emmy mich hören kann mit der
   Pseudovariante?"

   Der Browser lässt Ton erst durch, wenn die Person die Seite einmal
   berührt hat. Nachgestellt wird genau das: play() wird abgelehnt.
   Gemessen wird, ob die Reihe danach weiterläuft — also ob „fertig"
   irgendwann kommt. Tut es das nicht, bleibt liveLaeuftGerade stehen
   und im Fokus-Modus geht gar nichts mehr. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 430, height: 880 } });
  /* Jedes play() wird abgelehnt — wie bei einem Browser, der noch
     keine Berührung gesehen hat. */
  await pg.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      return Promise.reject(new DOMException("blocked", "NotAllowedError"));
    };
    /* Damit NUR der Weg „play() abgelehnt" gemessen wird und nicht
       zufaellig der Ladefehler: onerror wird stillgelegt. */
    Object.defineProperty(HTMLMediaElement.prototype, "onerror", {
      configurable: true, get: function () { return null; }, set: function () {}
    });
  });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const erg = await pg.evaluate(async () => {
    if (!window.LiveChat || !LiveChat.tonAusVorrat) return "LiveChat.tonAusVorrat fehlt";
    let fertig = false;
    const start = Date.now();
    document.querySelectorAll("audio").forEach((a) => { a.onerror = null; });
    const gestartet = LiveChat.tonAusVorrat(
      "ton/schrei.m4a",   // eine echte, ladbare Aufnahme
      () => { fertig = true; }, 0, 0);
    /* onerror wuerde ebenfalls freigeben — das waere aber nicht der
       Fall, den wir pruefen wollen. Deshalb wird er hier abgeklemmt,
       damit NUR der Weg „play() abgelehnt" uebrigbleibt. */
    /* Bis zu zehn Sekunden zusehen. */
    for (let i = 0; i < 100 && !fertig; i++) await new Promise((r) => setTimeout(r, 100));
    return { gestartet: gestartet, fertig: fertig, nachMs: Date.now() - start };
  });

  console.log("");
  if (typeof erg === "string") { console.log("  " + erg); }
  else {
    console.log("  Abspielen versucht: " + erg.gestartet);
    console.log("  Reihe lief weiter : " + (erg.fertig ? "ja, nach " + erg.nachMs + " ms" : "NEIN — der Raum bliebe stehen"));
    console.log("  " + (erg.fertig
      ? "Damit kann ein geblockter Ton den Fokus-Modus nicht mehr festfahren."
      : "FEHLER: liveLaeuftGerade bliebe gesetzt, niemand duerfte mehr sprechen."));
  }
  await br.close(); srv.close();
})();
