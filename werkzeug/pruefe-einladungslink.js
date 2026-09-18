/* PRÜFT, OB EIN EINLADUNGSLINK WIRKLICH IM KLASSENZIMMER LANDET. */
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
  const pruefe = async (adresse, was) => {
    const pg = await br.newPage();
    await pg.goto(adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForTimeout(2600);
    const r = await pg.evaluate(() => ({
      ansicht: (document.querySelector('.view[data-active="true"]') || {}).id || "—",
      /* Der richtige Unterreiter ist der IM AKTIVEN Bereich — es gibt
         mehrere Unterleisten, und die versteckten tragen ihre eigene
         Auswahl weiter. */
      unterreiter: (document.querySelector('.view[data-active="true"] .subnav-pill[aria-selected="true"]') || {}).dataset?.sub || "—",
      sichtbar: (document.querySelector('.view[data-active="true"] .subview[data-active="true"]') || {}).id || "—"
    }));
    console.log(was.padEnd(34) + " → " + r.ansicht + " / " + r.unterreiter + " / sichtbar: " + r.sichtbar);
    await pg.close();
    return r;
  };
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const ohne = await pruefe(basis, "ohne Link");
  const mit = await pruefe(basis + "#raum=emmys-raum", "mit #raum=emmys-raum");
  console.log(mit.ansicht === "view-knowledge" && mit.unterreiter === "sub-livechat"
    ? "\n✅ Der Einladungslink landet im Klassenzimmer."
    : "\n❌ Der Link landet woanders.");
  await br.close(); srv.close();
})();
