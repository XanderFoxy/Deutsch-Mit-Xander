#!/usr/bin/env node
/* =====================================================================
   ALTE TIERE — Blatt zum Vergleich (FASSUNG 854)
   node werkzeug/bilderwelt/tiere/alt-blatt.js <ausgabe.png> [--breite 1800]
   Zeichnet die Tiere aus den bisherigen Baukästen (bauernhof.js: tierKasten,
   zoo.js: tierBaukasten) in Kacheln – jedes Tier wird im Browser vermessen
   (getBBox) und in seine Kachel eingepasst.
   ===================================================================== */
"use strict";
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { neueSzene } = require("../bau");
const { tierKasten } = require("../szenen/bauernhof");
const { tierBaukasten } = require("../szenen/zoo");
const arg = process.argv.slice(2);
const aus = arg[0];
const breitePx = Number((arg[arg.indexOf("--breite") + 1]) || 1800) || 1800;

const S = neueSzene({ id: "altblatt", kuerzel: "ab", titel: "", emoji: "", thema: "", fassung: 854 });
const K = tierKasten(S), Z = tierBaukasten(S);
const liste = [];
const dazu = (name, f) => { try { liste.push([name, f()]); } catch (e) { liste.push([name + " (Fehler)", ""]); } };
/* Bauernhof-Baukasten: f(k, dir) */
[["Kuh", "kuh"], ["Kalb", "kalb"], ["Pferd", "pferd"], ["Schwein", "schwein"], ["Schaf", "schaf"], ["Huhn", "huhn"], ["Hahn", "hahn"],
 ["Küken", "kueken"], ["Hund", "hund"], ["Welpe", "welpe"], ["Katze", "katze"], ["Ente", "ente"], ["Kaninchen", "kaninchen"],
 ["Meerschweinchen", "meerschweinchen"], ["Hamster", "hamster"], ["Wellensittich", "wellensittich"], ["Schildkröte", "schildkroete"]]
  .forEach(([n, f]) => dazu(n, () => K[f](1, 1)));
/* Zoo-Baukasten: f(m, dir) bzw. f(art, m, dir) */
[["Giraffe", () => Z.giraffe(10, 1)], ["Zebra", () => Z.zebra(10, 1)], ["Elefant", () => Z.elefant(10, 1)], ["Nashorn", () => Z.nashorn(10, 1)],
 ["Nilpferd", () => Z.nilpferd(10, 1)], ["Löwe", () => Z.katze("loewe", 10, 1)], ["Tiger", () => Z.katze("tiger", 10, 1)],
 ["Gorilla", () => Z.gorilla(10, 1)], ["Schimpanse", () => Z.schimpanse(10, 1)], ["Affe", () => Z.affe(10, 1)], ["Bär", () => Z.baer(10, 1)],
 ["Krokodil", () => Z.krokodil(10, 1)], ["Flamingo", () => Z.flamingo(10, 1)], ["Pelikan", () => Z.pelikan(10, 1)], ["Adler", () => Z.adler(10, 1)],
 ["Hai", () => Z.hai(10, 1)], ["Delfin", () => Z.delfin(10, 1)], ["Wal", () => Z.wal(10, 1)], ["Fisch", () => Z.fisch(10, 1)],
 ["Qualle", () => Z.qualle(10)], ["Möwe", () => Z.moewe(10, 1)]].forEach(([n, f]) => dazu(n, f));

const SP = 8, ZB = 160, ZH = 120, W = SP * ZB, H = Math.ceil(liste.length / SP) * ZH;
const zellen = liste.map(([n, svg], i) => {
  const cx = (i % SP) * ZB, cy = Math.floor(i / SP) * ZH;
  return `<rect x="${cx + 2}" y="${cy + 2}" width="${ZB - 4}" height="${ZH - 4}" rx="6" fill="#efeae0" stroke="#d3c9b6"/>` +
    `<g class="tier" data-cx="${cx}" data-cy="${cy}"><g class="innen">${svg}</g></g>` +
    `<text x="${cx + ZB / 2}" y="${cy + 112}" text-anchor="middle" font-size="10" font-family="Arial" font-weight="700" fill="#3a3226">${n}</text>`;
}).join("");
const html = `<!doctype html><html><head><style>body{margin:0}svg{display:block;width:${breitePx}px}</style></head><body>
<svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs>${S.defs.join("")}</defs><rect width="${W}" height="${H}" fill="#f7f4ee"/>${zellen}</svg>
<script>
document.querySelectorAll(".tier").forEach((g) => {
  const i = g.querySelector(".innen"), b = i.getBBox();
  if (!b.width || !b.height) return;
  const k = Math.min(140 / b.width, 84 / b.height), cx = +g.dataset.cx, cy = +g.dataset.cy;
  g.setAttribute("transform", "translate(" + (cx + 80 - (b.x + b.width / 2) * k) + " " + (cy + 98 - (b.y + b.height) * k) + ") scale(" + k + ")");
});
</script></body></html>`;
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: breitePx, height: Math.round(breitePx * H / W) } });
  await pg.setContent(html);
  await pg.waitForTimeout(200);
  await pg.screenshot({ path: aus, fullPage: true });
  await br.close();
  console.log(aus, liste.length + " alte Tiere");
})();
