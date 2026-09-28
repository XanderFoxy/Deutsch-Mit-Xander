/* Misst die Malzeit je Modell (Sprite) bei typischem Zoom und die Zeit bis Winterhausen fertig gemalt ist. */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt.html"; const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2 });
  const t0 = Date.now();
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?neu=1", { waitUntil: "load" });
  await pg.waitForFunction(() => window.__fertig, null, { timeout: 60000 });
  const tLaden = Date.now() - t0;
  await pg.waitForFunction(() => !document.querySelector(".st-vorhang"), null, { timeout: 60000 }).catch(() => {});
  const tVorhang = Date.now() - t0;
  const zeiten = await pg.evaluate(() => {
    const aus = {};
    const Z = Object.assign({ name: "abend" }, STADT.ZEITEN.abend);
    for (const id of Object.keys(STADT.MODELLE)) {
      const d = STADT.MODELLE[id]; if (d.live) continue;
      const r = [];
      for (const s of [12, 32, 80]) { const a = performance.now(); try { STADT.spriteMalen(id, { jahr: "winter", bau: 1, saat: 3, schluessel: "t" }, 30, s, Z, 1); } catch (e) { r.push("FEHLER " + e.message); continue; } r.push(Math.round(performance.now() - a)); }
      aus[id] = r;
    }
    return aus;
  });
  console.log("Laden bis __fertig:", tLaden, "ms · Vorhang weg:", tVorhang, "ms");
  console.log("Malzeit je Modell (ms) bei s = 12 / 32 / 80 Gerätepixel je Meter:");
  for (const [id, r] of Object.entries(zeiten).sort((a, b) => (b[1][1] | 0) - (a[1][1] | 0))) console.log("  " + id.padEnd(16) + r.join(" / "));
  await br.close(); srv.close();
})();
