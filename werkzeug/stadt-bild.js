/* Macht Bilder von der Baukasten-Stadt (Werkbank oder ganze Stadt).
   node werkzeug/stadt-bild.js <ausgabe.png> "<suche>" [breite] [hoehe] [dpr]
   Beispiel: node werkzeug/stadt-bild.js /tmp/a.png "werkbank=probehaus&gier=20&zeit=tag&still=1" 900 900 2 */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
(async () => {
  const [aus, suche, breite, hoehe, dpr] = process.argv.slice(2);
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: +(breite || 900), height: +(hoehe || 900) }, deviceScaleFactor: +(dpr || 1) });
  const fehler = [];
  pg.on("pageerror", (e) => fehler.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => { if (m.type() === "error") fehler.push("Konsole: " + m.text()); });
  const t0 = Date.now();
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?" + (suche || ""), { waitUntil: "load", timeout: +(process.env.ZEIT || 180000) });
  try { await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: +(process.env.ZEIT || 180000) }); } catch (e) { fehler.push("Zeitüberschreitung"); }
  const warte = +(process.env.WARTE || 400);
  await pg.waitForTimeout(warte);
  await pg.screenshot({ path: aus });
  console.log("Bild: " + aus + " (" + (Date.now() - t0) + " ms)");
  if (fehler.length) console.log(fehler.join("\n"));
  await br.close(); srv.close();
})();
