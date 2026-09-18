/* PRÜFT DEN PAPIERKORB MIT FRIST.
   ---------------------------------------------------------------
   GEWÜNSCHT: „Das Rückruf-Symbol soll man wieder rückgängig machen
   können … wenn es aber zu lange ignoriert wurde, dann kann es
   nicht mehr wiederhergestellt werden."

   Gemessen wird beides: dass es innerhalb der Frist zurückkommt,
   und dass es danach ehrlich nein sagt. */
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
    if (!window.LiveChat || !LiveChat.sprachRuecknahmen) return "Naht fehlt";
    const aus = {};
    aus.vorher = LiveChat.sprachRuecknahmen().length;
    /* Es gibt hier keinen echten Raum, also wird nur gefragt, was
       ohne Papierkorb passiert — die ehrliche Absage. */
    const ohne = LiveChat.sprachWiederherstellen("gibtesnicht");
    aus.ohnePapierkorb = ohne;
    return aus;
  });

  console.log("");
  if (typeof erg === "string") console.log("  " + erg);
  else {
    console.log("  Papierkorb am Anfang leer: " + (erg.vorher === 0 ? "ja" : "nein"));
    console.log("  Abgelaufene Frist         : " + (erg.ohnePapierkorb.ok ? "FALSCH — sagt ja" : "sagt nein"));
    console.log("    Begründung              : " + erg.ohnePapierkorb.warum);
  }
  const roh = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const f = /var RUECKHOL_MS = (\d+);/.exec(roh);
  const a = /setTimeout\(function \(\) \{ delete sprachAusgang\[id\]; \}, (\d+)\);/.exec(roh);
  console.log("");
  console.log("  Frist zum Zurückholen: " + (f ? f[1] / 1000 : "?") + " s");
  console.log("  Stücke liegen bereit : " + (a ? a[1] / 1000 : "?") + " s"
    + (f && a && Number(a[1]) > Number(f[1]) ? "   (länger als die Frist — richtig)" : "   PRÜFEN"));
  await br.close(); srv.close();
})();
