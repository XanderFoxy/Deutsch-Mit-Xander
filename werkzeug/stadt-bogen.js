/* Kontaktbogen: mehrere Ansichten der Baukasten-Stadt in EINEM Bild.
   node werkzeug/stadt-bogen.js <aus.png> <breite> <hoehe> "<suche1>" "<suche2>" …
   Jede Ansicht bekommt ihre Suchzeile als Beschriftung. Pixeldichte 1.
   Beispiel:
   node werkzeug/stadt-bogen.js /tmp/b.png 600 600 "werkbank=probehaus&gier=0&still=1" "werkbank=probehaus&gier=90&still=1" */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
(async () => {
  const [aus, breite, hoehe, ...suchen] = process.argv.slice(2);
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const pg = await br.newPage({ viewport: { width: +breite, height: +hoehe } });
  const fehler = [];
  pg.on("pageerror", (e) => fehler.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) fehler.push("Konsole: " + m.text()); });
  const bilder = [];
  for (const s of suchen) {
    const t0 = Date.now();
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/stadt.html?" + (/buendel=1/.test(s) ? "" : "quelle=1&") + s + (/still=/.test(s) ? "" : "&still=1"), { waitUntil: "load", timeout: +(process.env.ZEIT || 180000) });
    try { await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: +(process.env.ZEIT || 180000) }); } catch (e) { fehler.push("Zeitüberschreitung: " + s); }
    await pg.waitForTimeout(+(process.env.WARTE || 150));
    bilder.push({ s: s.replace(/&?still=1/, ""), b: (await pg.screenshot()).toString("base64"), ms: Date.now() - t0 });
  }
  const spalten = Math.min(suchen.length, Math.max(1, Math.floor(2400 / +breite)));
  const html = "<body style='margin:0;background:#222;font:12px sans-serif;color:#eee'><div style='display:grid;grid-template-columns:repeat(" + spalten + "," + breite + "px);gap:4px;padding:4px'>" +
    bilder.map((b) => "<div><img src='data:image/png;base64," + b.b + "' style='display:block;width:" + breite + "px;height:" + hoehe + "px'><div style='padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:" + (breite - 8) + "px'>" + b.s.replace(/</g, "&lt;") + " (" + b.ms + " ms)</div></div>").join("") + "</div></body>";
  const p2 = await br.newPage({ viewport: { width: spalten * (+breite + 4) + 4, height: 200 } });
  await p2.setContent(html);
  await p2.screenshot({ path: aus, fullPage: true });
  console.log("Bogen: " + aus + " (" + bilder.length + " Ansichten)");
  if (fehler.length) console.log(fehler.join("\n"));
  await br.close(); srv.close();
})();
