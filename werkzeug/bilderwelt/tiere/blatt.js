#!/usr/bin/env node
/* =====================================================================
   TIER-BLATT — alle Arten auf einem Bild (FASSUNG 854)
   node werkzeug/bilderwelt/tiere/blatt.js <ausgabe.png> [--nur gruppe.js|id,id] [--spalten 6]
        [--breite 1800] [--massstab]
   Ohne --massstab: jedes Tier füllt seine Kachel (zum Begutachten).
   Mit  --massstab: alle Tiere im echten Größenverhältnis nebeneinander.
   Mit  --gross <id>: EIN Tier groß (für den Kritiker) + <ausgabe>-kopf.png (Kopfbereich in voller Auflösung)
        und <ausgabe>-szene.png (so klein wie in einer Bilderwelt-Szene, mit T.fein = false).
   FASSUNG 880 — Mit --szene: alle Tiere im SZENE-Modus (T.fein = false, keine Filter) – zum Prüfen, dass in Szenen
        nichts Wichtiges verloren geht; die Konsole meldet zusätzlich die Filterzahl je Art (Ziel 0).
        XANDER (Funk 299): „… kümmere Dich jetzt mal bitte intensiv um das alles“.
   FASSUNG 881 — Die Konsole meldet zusätzlich jede Art, deren SVG ungültige Zahlen (NaN/undefined) enthält (fein und
        Szene) – vorher galt „ohne Ausnahme“ schon als fehlerfrei.
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
const gross = wert("--gross", "");
const szene = arg.includes("--szene");
const modus = szene ? { fein: false } : {};

let arten = alleArten();
if (gross) arten = arten.filter((a) => a.id === gross);
if (nur && !gross) {
  const teile = nur.split(",");
  arten = arten.filter((a) => teile.includes(a.id) || teile.includes(a.datei) || teile.includes(a.datei.replace(/\.js$/, "")));
}
if (!arten.length) { console.error("keine Arten"); process.exit(1); }

const S = neueSzene({ id: "tierblatt", kuerzel: "tb", titel: "Tiere", emoji: "", thema: "", fassung: 854 });
let inhalt = "", W, H, kopfBox = null, gx = 0, gy = 0, gk = 1, gmx = 0;
const schrift = `font-family="Nunito, Arial, sans-serif"`;
const T_HG = "#ece6da";

if (gross) {
  const a = arten[0];
  const k = Math.min(1500 / a.laenge, 900 / a.hoehe);
  W = 1600; H = Math.round(a.hoehe * k + 80);
  const s1 = setze(S, a, W / 2, H - 40, k, Object.assign({ praefix: a.id }, modus));
  { const S3 = neueSzene({ id: "x", kuerzel: "x" }); const z = a.zeichne(require("./kern").werkzeug(S3, a.id)); kopfBox = z.kopf || null; gmx = (z.box[0] + z.box[2]) / 2; }
  gx = W / 2; gy = H - 40; gk = k / 100;
  inhalt = `<rect width="${W}" height="${H}" fill="${T_HG}"/>` + s1.svg;
  /* klein wie in einer Szene: 1 m = 30 Einheiten, ohne Feinheit, rechts unten eingeblendet */
  const s2 = setze(S, a, W - 20 - a.laenge * 15, H - 12, 30, { praefix: a.id + "_sz", fein: false });
  inhalt += `<g opacity=".98">${s2.svg}</g>`;
} else if (!massstab) {
  const ZB = 160, ZH = 120;
  const zeilen = Math.ceil(arten.length / spalten);
  W = spalten * ZB; H = zeilen * ZH;
  arten.forEach((a, i) => {
    const cx = (i % spalten) * ZB, cy = Math.floor(i / spalten) * ZH;
    /* passend skalieren: höchstens 140 × 84 Einheiten */
    const k = Math.min(140 / a.laenge, 84 / a.hoehe);
    let s;
    try { s = setze(S, a, cx + ZB / 2, cy + 98, k, Object.assign({ praefix: a.id }, modus)); }
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
      inhalt += setze(S, e.a, e.x, y, epm, Object.assign({ praefix: e.a.id }, modus)).svg;
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
  await pg.screenshot({ path: aus, fullPage: true, timeout: 240000 });
  if (gross) {
    /* Kopf: Blick nach rechts → rechtes Drittel, obere zwei Drittel, in doppelter Auflösung */
    const hPx = Math.round(breitePx * H / W);
    await pg.setViewportSize({ width: breitePx, height: hPx });
    const pg2 = await br.newPage({ viewport: { width: breitePx, height: hPx }, deviceScaleFactor: 2 });
    await pg2.setContent(html);
    /* FASSUNG 854 — gibt zeichne() z.kopf = [x0, y0, x1, y1] (cm) zurück, wird genau dieser Bereich (mit Rand) gezeigt
       (Kritiker Pteranodon: „das Kopf-Bild zeigt nur die Schnabelspitze") */
    let clip = { x: Math.round(breitePx * 0.58), y: 0, width: Math.round(breitePx * 0.42), height: Math.round(hPx * 0.7) };
    if (kopfBox) {
      const px = breitePx / W, [a, b, c, d] = kopfBox, rand = 0.12 * Math.max(c - a, d - b);
      const X0 = (gx + (a - rand - gmx) * gk) * px, X1 = (gx + (c + rand - gmx) * gk) * px, Y0 = (gy + (b - rand) * gk) * px, Y1 = (gy + (d + rand) * gk) * px;
      clip = { x: Math.max(0, Math.round(X0)), y: Math.max(0, Math.round(Y0)), width: Math.round(Math.min(breitePx, X1) - Math.max(0, X0)), height: Math.round(Math.min(hPx, Y1) - Math.max(0, Y0)) };
    }
    await pg2.screenshot({ path: aus.replace(/\.png$/, "") + "-kopf.png", clip, timeout: 240000 });
  }
  await br.close();
  /* FASSUNG 881 — ungültige Zahlen melden (Prüfer 880, Punkt 16): blatt.js fing bisher nur Ausnahmen ab; „MNaNQ…“
     oder „url(#…NaN)“ im SVG zeichnet der Browser stillschweigend falsch oder gar nicht */
  const kaputt = [];
  const groesse = (a, fein) => {
    const S2 = neueSzene({ id: "x", kuerzel: "x" }); const T = require("./kern").werkzeug(S2, a.id); T.fein = fein;
    let d;
    try { d = a.zeichne(T).svg + S2.defs.join(""); } catch (e) { kaputt.push(`${a.id} (${fein ? "fein" : "Szene"}): Ausnahme ${String(e.message).split("\n")[0]}`); return "FEHLER"; }
    const nan = d.match(/[^\s"<>]{0,20}(NaN|undefined)[^\s"<>]{0,10}/g);
    if (nan) kaputt.push(`${a.id} (${fein ? "fein" : "Szene"}): ${nan.length}× ungültige Zahl, z. B. ${nan[0]}`);
    return fein ? d.length : d.length + (szene ? "/" + (d.match(/<filter/g) || []).length + "F" : "");
  };
  console.log(aus, arten.length + " Arten", "Größe je Art in Bytes (fein / Szene" + (szene ? "/Filter" : "") + "):", arten.map((a) => a.id + " " + groesse(a, true) + " / " + groesse(a, false)).join(", "));
  if (kaputt.length) console.log("UNGÜLTIG (NaN/undefined oder Ausnahme) – " + kaputt.length + ":\n  " + kaputt.join("\n  "));
  else console.log("ungültige Zahlen (NaN/undefined): keine");
})();
