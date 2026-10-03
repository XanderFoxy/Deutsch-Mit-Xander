#!/usr/bin/env node
/* Vorschau einer Bilderwelt-Szene als PNG (FASSUNG 851).
   node werkzeug/bilderwelt/vorschau.js <szenen-datei.js> <ausgabe.png> [--rahmen] [--breite 1280]
   --rahmen zeichnet die Trefferflächen (rot) und die Wortmarken der Teile darüber. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs"), path = require("path");
const arg = process.argv.slice(2);
const datei = arg[0], aus = arg[1], rahmen = arg.includes("--rahmen");
const breite = Number((arg[arg.indexOf("--breite") + 1]) || 1280) || 1280;
const w = {}; new Function("window", fs.readFileSync(datei, "utf8"))(w);
const szene = Object.values(w.DMA_SZENE)[0];
const css = fs.readFileSync(path.join(__dirname, "../../korrekturen.css"), "utf8").match(/\.bw-[^{]*\{[^}]*\}/g) || [];
const zoomTeile = arg.includes("--unter") ? (szene.teile || []).flatMap((t) => t.unter || []) : [];
const teile = [...(szene.teile || []), ...zoomTeile].map((t) => `<g transform="translate(${t.x},${t.y})">${t.kunst || ""}</g>`).join("");
let marken = "";
if (rahmen) {
  marken = [...(szene.teile || []), ...(szene.teile || []).flatMap((t) => t.unter || [])].map((t) => `<g transform="translate(${t.x},${t.y})" class="m">${(t.kunst || "")}<circle r="1.2" fill="#e00"/><text y="-2" font-size="4" text-anchor="middle" fill="#000" stroke="#fff" stroke-width=".6" paint-order="stroke">${t.de}</text></g>`).join("");
}
const html = `<!doctype html><html><head><style>body{margin:0;background:#222}svg{display:block;width:${breite}px}
.m .bw-flaeche{fill:rgba(255,0,0,.12)!important;stroke:#e00;stroke-width:.4}</style></head><body>
<svg viewBox="0 0 ${szene.breite} ${szene.hoehe}">${szene.kulisse}${teile}${szene.vorne || ""}${marken}</svg></body></html>`;
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: breite, height: Math.round(breite * szene.hoehe / szene.breite) } });
  await pg.setContent(html);
  await pg.screenshot({ path: aus, fullPage: true });
  await br.close();
  console.log(aus, szene.id, (szene.teile || []).length, "Teile");
})();
