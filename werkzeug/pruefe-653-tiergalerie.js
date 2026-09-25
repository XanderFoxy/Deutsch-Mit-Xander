#!/usr/bin/env node
/* =====================================================================
   BILDPROBE — FASSUNG 653: DIE TIERE NEU GEZEICHNET
   XANDER: „überarbeite mal den Baby Fuchs und den Schäferhund. Das soll
   wirklich nach dem aussehen, was es aussagt … nicht alle nur so
   Dreiecks oder Kreisköpfe" · „das Einhorn und den Phoenix besser
   gestalten … die Form bisschen realistischer".
   Legt oben die Kacheln und unten die Tiere am Platz nebeneinander und
   speichert ein Bild:  BILD=/pfad/bild.png [ARTEN=a,b,c] node …
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = path.join(__dirname, "..");
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(W, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 1000, height: 560 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html");
  await pg.waitForFunction(() => window.DMA_SPIEL && window.DMA_SPIEL.pruef, { timeout: 25000 });
  const arten = (process.env.ARTEN || "babyfuchs,schaeferhund,einhorn,phoenix").split(",");
  await pg.evaluate((arten) => {
    const P = window.DMA_SPIEL.pruef;
    document.body.innerHTML = '<div id="g" style="display:flex;flex-wrap:wrap;gap:10px;padding:10px;background:#f4efe6"></div>';
    const g = document.getElementById("g");
    arten.forEach((a) => {
      const k = document.createElement("div");
      k.style.cssText = "width:230px;height:230px;background:#fff;border-radius:12px;position:relative";
      k.innerHTML = P.tierSvg(a, true).replace("<svg ", '<svg style="width:230px;height:230px" ');
      g.appendChild(k);
    });
    arten.forEach((a) => {
      const k = document.createElement("div");
      k.style.cssText = "width:230px;height:230px;position:relative;background:#e9e2d4;border-radius:12px";
      k.innerHTML = '<div style="position:absolute;left:35px;top:35px;width:150px;height:150px;border-radius:50%;background:#2b7a66"></div><div style="position:absolute;left:35px;top:35px;width:150px;height:150px;transform:scale(1.35);transform-origin:' + (/phoenix|drache|eule|fee/.test(a) ? "90% 12%" : "50% 85%") + '">' + P.tierSvg(a).replace("<svg ", '<svg style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" ') + "</div>";
      g.appendChild(k);
    });
  }, arten);
  await pg.waitForTimeout(300);
  const fehlt = await pg.evaluate(() => [...document.querySelectorAll("#g svg")].filter((v) => !v.getBBox || v.getBBox().width < 5).length);
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD });
  console.log(fehlt ? "ROT: " + fehlt + " Zeichnung(en) leer" : "Alle Zeichnungen da (" + arten.length + " Tiere).");
  process.exitCode = fehlt ? 1 : 0;
  await br.close(); srv.close();
})();
