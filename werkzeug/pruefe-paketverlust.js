/* PRÜFT, OB EINE WORTMELDUNG EIN VERLORENES PAKET ÜBERLEBT.
   ---------------------------------------------------------------
   GEMELDET: „Emmy sagt, sie würde versuchen zu sprechen, es kommt
   aber nicht durch … Geht das nur in Deutschland?"

   Nein. Eine Aufnahme wird in Pakete zerlegt. Ging EINES verloren,
   passierte gar nichts mehr — zusammengesetzt wird nur, was
   vollständig da ist, und niemand hat es gemerkt. Gemessen wird
   genau das: neun Pakete, das fünfte fällt aus. */
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
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.pruefSprachVerlust) return "Prüfnaht fehlt";
    return LiveChat.pruefSprachVerlust(9, 4);
  });

  console.log("");
  if (typeof erg === "string") console.log("  " + erg);
  else {
    console.log("  Neun Pakete geschickt, das fünfte geht verloren.");
    console.log("    danach schon vollständig: " + (erg.vollstaendigVorher ? "ja (wäre falsch)" : "nein"));
    console.log("    vermisst wird           : Paket " + erg.fehlte.join(", "));
    console.log("    nach dem Nachliefern    : "
      + (erg.ergebnis === erg.erwartet ? "vollständig und in der richtigen Reihenfolge"
                                       : "FALSCH — " + JSON.stringify(erg.ergebnis)));
  }
  /* Und wie gross sind die Pakete jetzt? */
  const roh = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const gr = /var PAKET_BYTES = (\d+);/.exec(roh);
  const luft = /var PAKET_LUFT = (\d+);/.exec(roh);
  console.log("");
  console.log("  Paketgröße: " + (gr ? gr[1] : "?") + " Bytes   Luft dazwischen: "
    + (luft ? luft[1] : "?") + " ms");
  await br.close(); srv.close();
})();
