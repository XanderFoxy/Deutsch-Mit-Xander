#!/usr/bin/env node
/* =====================================================================
   TIER-BLATT — alle Arten auf einem Bild (FASSUNG 854)
   node werkzeug/bilderwelt/tiere/blatt.js <ausgabe.png> [--nur gruppe.js|id,id] [--spalten 6]
        [--breite 1800] [--massstab]
   Ohne --massstab: jedes Tier füllt seine Kachel (zum Begutachten).
   Mit  --massstab: alle Tiere im echten Größenverhältnis nebeneinander.
   ===================================================================== */
"use strict";
const path = require("path"), fs = require("fs");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { neueSzene } = require("../bau");
const { alleArten, setze, r } = require("./kern");

const arg = process.argv.slice(2);
const aus = arg[0];
const wert = (k, d) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : d; };
const nur = wert("--nur", "");
const spalten = Number(wert("--spalten", 6));
const breitePx = Number(wert("--breite", 1800));
const massstab = arg.includes("--massstab");

let arten = alleArten();
if (nur) {
  const teile = nur.split(",");
  arten = arten.filter((a) => teile.includes(a.id) || teile.includes(a.datei) || teile.includes(a.datei.replace(/\.js$/, "")));
}
if (!arten.length) { console.error("keine Arten"); process.exit(1); }

const S = neueSzene({ id: "tierblatt", kuerzel: "tb", titel: "Tiere", emoji: "", thema: "", fassung: 854 });
let inhalt = "", W, H;
const schrift = `font-family="Nunito, Arial, sans-serif"`;

if (!massstab) {
  const ZB = 160, ZH = 120;
  const zeilen = Math.ceil(arten.length / spalten);
  W = spalten * ZB; H = zeilen * ZH;
  arten.forEach((a, i) => {
    const cx = (i % spalten) * ZB, cy = Math.floor(i / spalten) * ZH;
    /* passend skalieren: höchstens 140 × 84 Einheiten */
    const k = Math.min(140 / a.laenge, 84 / a.hoehe);
    let s;
    try { s = setze(S, a, cx + ZB / 2, cy + 98, k, { praefix: a.id }); }
    catch (e) { s = { svg: `<text x="${cx + 10}" y="${cy + 50}" fill="#c00" font-size="9">${a.id}: ${String(e.message).slice(0, 60)}</text>` }; }
    inhalt += `<rect x="${cx + 2}" y="${cy + 2}" width="${ZB - 4}" height="${ZH - 4}" rx="6" fill="#f4f1ea" stroke="#d8d1c2"/>`;
    inhalt += `<rect x="${cx + 2}" y="${cy + 98}" width="${ZB - 4}" height="20" rx="0" fill="#e7e1d3"/>`;
    inhalt += s.svg;
    inhalt += `<text x="${cx + ZB / 2}" y="${cy + 112}" text-anchor="middle" font-size="10" fill="#2a241c" ${schrift} font-weight="700">${a.de}</text>`;
    inhalt += `<text x="${cx + ZB - 8}" y="${cy + 14}" text-anchor="end" font-size="7" fill="#8a8170" ${schrift}>${a.laenge} m × ${a.hoehe} m</text>`;
  });
} else {
  /* Maßstab: 1 m = epm Einheiten, Reihen nach Größe */
  const sortiert = arten.slice().sort((a, b) => b.hoehe - a.hoehe);
  const epm = 40, rand = 10, reiheH = [];
  W = 1600; let x = rand, y = 0, zeileMaxH = 0, zeile = [];
  const zeilen = [];
  for (const a of sortiert) {
    const w = a.laenge * epm + 14;
    if (x + w > W - rand && zeile.length) { zeilen.push({ arten: zeile, h: zeileMaxH }); zeile = []; x = rand; zeileMaxH = 0; }
    zeile.push({ a, x: x + w / 2 }); x += w; zeileMaxH = Math.max(zeileMaxH, a.hoehe * epm);
  }
  if (zeile.length) zeilen.push({ arten: zeile, h: zeileMaxH });
  y = 10;
  for (const z of zeilen) {
    y += z.h + 6;
    inhalt += `<line x1="0" y1="${r(y)}" x2="${W}" y2="${r(y)}" stroke="#bfb6a3" stroke-width=".6"/>`;
    for (const e of z.arten) {
      inhalt += setze(S, e.a, e.x, y, epm, { praefix: e.a.id }).svg;
      inhalt += `<text x="${r(e.x)}" y="${r(y + 9)}" text-anchor="middle" font-size="7" fill="#2a241c" ${schrift}>${e.a.de.replace(/^(der|die|das) /, "")}</text>`;
    }
    y += 14;
  }
  H = y + 10;
  inhalt = `<g>${inhalt}</g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs>${S.defs.join("")}</defs><rect width="${W}" height="${H}" fill="#fbf9f4"/>${inhalt}</svg>`;
const html = `<!doctype html><html><head><style>body{margin:0;background:#fff}svg{display:block;width:${breitePx}px}</style></head><body>${svg}</body></html>`;
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: breitePx, height: Math.round(breitePx * H / W) } });
  await pg.setContent(html);
  await pg.screenshot({ path: aus, fullPage: true });
  await br.close();
  const bytes = arten.map((a) => { const T = require("./kern").werkzeug(neueSzene({ id: "x", kuerzel: "x" }), a.id); return [a.id, a.zeichne(T).svg.length]; });
  console.log(aus, arten.length + " Arten", "SVG-Größe je Art (Bytes):", bytes.map(([i, n]) => i + " " + n).join(", "));
})();
