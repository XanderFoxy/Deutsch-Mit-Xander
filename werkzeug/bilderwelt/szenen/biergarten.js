#!/usr/bin/env node
/* =====================================================================
   DER BIERGARTEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (muenchen.travel „Biergärten in und um München“,
   muenchen.de „Biergarten-Klassiker“, Bayerische Biergartenverordnung):
   - Unter großen KASTANIENBÄUMEN (früher über die Bierkeller gepflanzt:
     Schatten kühlt, flache Wurzeln stören den Keller nicht), Boden aus
     KIES.
   - Lange Holz-BIERTISCHE und BIERBÄNKE (Bierzeltgarnitur, Klappbeine
     aus Metall), getrunken wird aus dem 1-Liter-MASSKRUG.
   - Die SCHÄNKE (Ausschank-Hütte) mit Holzfass, Zapfhahn, Krugregal,
     Kasse und PREISTAFEL; daneben die weiß-blaue Fahne.
   - Echter Biergarten = Selbstbedienung, die eigene Brotzeit darf
     mitgebracht werden (SCHILD). Im bedienten Teil bringt die KELLNERIN
     auf dem TABLETT Hendl und Brezn.
   - Auf dem Tisch: Brezn am Brezn-Ständer, RADI (spiralig geschnittener
     Rettich), Obatzda auf dem Brotzeitbrett. Abends LICHTERKETTE und
     bunte LAMPIONS zwischen den Bäumen.
   BLICK: Zentralperspektive, Augenhöhe 1,75 m, Fluchtpunkt (160 | 70).
   Vorderer Tisch 4,2 m entfernt (≈ 60 Einheiten je Meter, Tischhöhe
   0,77 m, Bank 0,48 m), Schänke 12 m (≈ 21 je Meter).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "biergarten", titel: "Der Biergarten", emoji: "🍺", thema: "Freizeit", kuerzel: "b12b", fassung: 852 });
const rnd = zufall(1812);
const r = B.r;
/* ---------- Hilfen (B12): Fluchtpunkt-Perspektive, Figuren schlank -------- */
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => r(p[0]) + " " + r(p[1])).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
/* Figur: Maßstab in die Koordinaten eingebacken; was hinter einer Theke /
   einem Tisch ganz verdeckt ist (unterhalb von „ab“ Einheiten über dem
   Fußpunkt), wird gar nicht erst mitgeschickt — spart Ladezeit. */
function zahl(v) { const a = Math.abs(v); const s = String(a < 1 ? Math.round(v * 100) / 100 : Math.round(v * 10) / 10); return s.replace(/^(-?)0\./, "$1."); }
const PZ = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
function pfad(d, k, ys) {
  let out = "", m, cmd = null, idx = 0, cx = 0, cy = 0, sx = 0, sy = 0, buf = [];
  const re = /([A-Za-z])|(-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?)/g;
  while ((m = re.exec(d))) {
    if (m[1]) { cmd = m[1]; idx = 0; out += cmd; if (cmd === "Z" || cmd === "z") { cx = sx; cy = sy; } continue; }
    let v = parseFloat(m[2]);
    const C = cmd.toUpperCase(), n = PZ[C], pos = n ? idx % n : 0, rel = cmd !== C;
    const winkel = C === "A" && pos >= 2 && pos <= 4;
    if (!winkel) v *= k;
    const t = (C === "A" && (pos === 3 || pos === 4)) ? String(Math.round(v)) : zahl(v);
    if (!/[A-Za-z]$/.test(out) && !t.startsWith("-")) out += " ";
    out += t; idx++;
    /* Endpunkte mitschreiben (für die Unterkante) */
    buf.push(v);
    if (buf.length === n) {
      let ex, ey;
      if (C === "H") { ex = rel ? cx + buf[0] : buf[0]; ey = cy; }
      else if (C === "V") { ex = cx; ey = rel ? cy + buf[0] : buf[0]; }
      else { ex = buf[n - 2]; ey = buf[n - 1]; if (rel) { ex += cx; ey += cy; } }
      if (C !== "A" && C !== "H" && C !== "V") for (let i = 1; i < n - 2; i += 2) ys.push(rel ? cy + buf[i] : buf[i]);
      ys.push(ey); cx = ex; cy = ey; if (C === "M") { sx = ex; sy = ey; }
      buf = [];
      if (C === "M") cmd = rel ? "l" : "L";
    }
  }
  return out;
}
const SKAL = new Set(["cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "stroke-width", "x1", "y1", "x2", "y2", "fx", "fy"]);
function figur(spec, hoehe, ab = null) {
  const roh = B.mensch(spec, hoehe);
  const mm = roh.svg.match(/^<g transform="scale\(([\d.]+)\)">([\s\S]*)<\/g>$/);
  const k = +mm[1];
  let body = mm[2];
  body = body.replace(/<([a-zA-Z]+)((?:\s+[a-zA-Z0-9:-]+="[^"]*")*)\s*(\/?)>/g, (all, tag, attrs, sl) => {
    const objBox = (tag === "linearGradient" || tag === "radialGradient") && !/gradientUnits="userSpaceOnUse"/.test(attrs);
    let ys = [];
    const a2 = attrs.replace(/\s+([a-zA-Z0-9:-]+)="([^"]*)"/g, (x, key, val) => {
      if (key === "d") return ` d="${pfad(val, k, ys)}"`;
      if (key === "transform") return ` transform="${val.replace(/rotate\(([-\d.]+),([-\d.]+),([-\d.]+)\)/g, (q, a, b, c) => `rotate(${a},${zahl(b * k)},${zahl(c * k)})`)}"`;
      if (SKAL.has(key) && !objBox && /^-?[\d.]+$/.test(val)) return ` ${key}="${zahl(val * k)}"`;
      return x;
    });
    let oy = null;
    if (tag === "path" && ys.length) oy = Math.min(...ys);
    const at = (n) => { const q = a2.match(new RegExp(`\\s${n}="([^"]*)"`)); return q ? +q[1] : null; };
    if (tag === "ellipse") oy = at("cy") - at("ry");
    if (tag === "circle") oy = at("cy") - at("r");
    if (tag === "rect") oy = at("y");
    return `<${tag}${a2}${oy != null ? ` data-oy="${zahl(oy)}"` : ""}${sl}>`;
  });
  /* verdeckte Teile weglassen (nur außerhalb der defs) */
  const dEnde = body.indexOf("</defs>") + 7;
  let defs = body.slice(0, dEnde), rest = body.slice(dEnde);
  if (ab != null) rest = rest.replace(/<(path|ellipse|circle|rect)\b[^>]*data-oy="([-\d.]+)"[^>]*\/>/g, (all, t, oy) => (+oy > -ab ? "" : all));
  rest = rest.replace(/ data-oy="[^"]*"/g, "");
  defs = defs.replace(/ data-oy="[^"]*"/g, "");
  /* unbenutzte Verläufe/Masken entfernen */
  for (let i = 0; i < 2; i++) defs = defs.replace(/<(linearGradient|radialGradient|clipPath) id="([^"]+)"[\s\S]*?<\/\1>/g, (all, t, id) => ((rest + defs.replace(all, "")).includes("#" + id + ")") || (rest + defs.replace(all, "")).includes("#" + id + "\"") ? all : ""));
  return { svg: defs + rest, k, z: roh.z };
}

/* ---------- Kamera ------------------------------------------------------ */
const VX = 160, HY = 70, E = 1.75, F = 250;
const ms = (Z) => F / Z;
const P = (X, H, Z) => [r(VX + F * X / Z), r(HY + F * (E - H) / Z)];

/* ---------- Farben ------------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("blur")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>`);
const FICHTE = S.lg("fichte", [[0, "#e6c48e"], [0.5, "#d6b077"], [1, "#c29a60"]]);
const KANTE = S.lg("kante", [[0, "#b98a50"], [1, "#8a6236"]]);
const METALL = S.lg("metall", [[0, "#6e767d"], [0.4, "#c9cfd4"], [1, "#5a6066"]], 0, 0, 1, 0);
const RINDE = S.lg("rinde", [[0, "#3a2e24"], [0.35, "#6a5a48"], [0.6, "#54463a"], [1, "#2a211a"]], 0, 0, 1, 0);
const BIER = S.lg("bier", [[0, "#f9cf55"], [0.6, "#eba92a"], [1, "#cf8414"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.55], [0.3, "#eef6f7", 0.15], [0.75, "#d7e6ea", 0.1], [1, "#ffffff", 0.45]], 0, 0, 1, 0);
const LAUGE = S.rg("lauge", [[0, "#b36a2c"], [0.6, "#8a4614"], [1, "#5e2c0a"]], 0.4, 0.35, 0.8);
/* Kastanienblatt: fünf bis sieben Fiederblätter wie eine Hand */
{
  /* Fiederblatt: verkehrt eiförmig (vorn am breitesten), gesägter Rand angedeutet */
  const fieder = (a, l) => { const w = 0.34 * l; return `<path transform="rotate(${Math.round(a * 57.3)})" d="M0 0 C${r(-w * 0.4)} ${r(-l * 0.3)} ${r(-w * 1.1)} ${r(-l * 0.55)} ${r(-w * 0.9)} ${r(-l * 0.82)} Q${r(-w * 0.5)} ${r(-l * 1.03)} 0 ${r(-l)} Q${r(w * 0.5)} ${r(-l * 1.03)} ${r(w * 0.9)} ${r(-l * 0.82)} C${r(w * 1.1)} ${r(-l * 0.55)} ${r(w * 0.4)} ${r(-l * 0.3)} 0 0 Z"/><path transform="rotate(${Math.round(a * 57.3)})" d="M0 -.5 L0 ${r(-l * 0.92)}" stroke="#bfe0a0" stroke-width=".22" opacity=".45"/>`; };
  for (const [n, f1, f2] of [["b1", "#2f6a2a", "#3f8a36"], ["b2", "#24521f", "#326e2a"], ["b3", "#4a8a3a", "#6aa84a"], ["b4", "#1a3c17", "#24521f"]]) {
    const g = S.lg("bl" + n, [[0, f2], [1, f1]]);
    S.def(`<g id="${S.id(n)}" fill="${g}">${fieder(-1.45, 5.5)}${fieder(-0.75, 8)}${fieder(0, 9.5)}${fieder(0.75, 8)}${fieder(1.45, 5.5)}<path d="M0 0 L0 3.5" stroke="${f1}" stroke-width=".5"/></g>`);
  }
}
const blatt = (n, x, y, a, s) => `<use href="#${S.id(n)}" transform="translate(${r(x)} ${r(y)}) rotate(${Math.round(a)}) scale(${s.toFixed(2)})"/>`;

/* =====================================================================
   KULISSE — Himmel, Hecke und Wirtshaus hinten, Kiesboden mit Licht
   ===================================================================== */
const yH = HY;
{
  let k = `<rect x="0" y="0" width="320" height="${yH + 2}" fill="${S.lg("himmel", [[0, "#9cc8e8"], [1, "#dff0f8"]])}"/>`;
  /* Wirtshaus hinten links: gelb verputzt, grüne Fensterläden */
  const w0 = P(-9, 0, 26), w1 = P(-2.5, 7, 26);
  k += `<path d="M${w0[0]} ${w1[1]} L${r((w0[0] + w1[0]) / 2)} ${r(w1[1] - 14)} L${w1[0]} ${w1[1]} Z" fill="#8a3a2a"/>`;
  k += `<rect x="${w0[0]}" y="${w1[1]}" width="${r(w1[0] - w0[0])}" height="${r(w0[1] - w1[1])}" fill="${S.lg("haus", [[0, "#f0d898"], [1, "#d9bb72"]])}"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) {
    const x = w0[0] + 4 + i * (w1[0] - w0[0] - 8) / 4.6, y = w1[1] + 5 + j * 12;
    k += `<rect x="${r(x - 1.6)}" y="${r(y)}" width="1.4" height="6" fill="#2f6a3a"/><rect x="${r(x)}" y="${r(y)}" width="4" height="6" fill="#4a5a66"/><rect x="${r(x + 4.2)}" y="${r(y)}" width="1.4" height="6" fill="#2f6a3a"/>`;
  }
  /* Hecke und ferne Stämme */
  k += `<path d="M0 ${r(yH - 8)} ${Array.from({ length: 33 }, (_, i) => `Q${i * 10 + 5} ${r(yH - 13 - rnd() * 4)} ${i * 10 + 10} ${r(yH - 8 - rnd() * 2)}`).join(" ")} L320 ${r(yH + 3)} L0 ${r(yH + 3)} Z" fill="${S.lg("hecke", [[0, "#3f6a32"], [1, "#2a4a22"]])}"/>`;
  for (const [X, Z] of [[-6, 22], [-1.5, 24], [3, 21], [7.5, 23], [12, 22]]) { const a = P(X, 0, Z), h = 6 * ms(Z); k += `<rect x="${r(a[0] - 1.2)}" y="${r(a[1] - h)}" width="2.4" height="${r(h)}" fill="#4a3c30"/>`; }
  /* Kies */
  const yB = 200;
  k += `<rect x="0" y="${yH}" width="320" height="${yB - yH}" fill="${S.lg("kies", [[0, "#bfb29a"], [0.3, "#cfc2a6"], [1, "#d9ccae"]])}"/>`;
  S.def(`<pattern id="${S.id("kiesf")}" width="5" height="2.4" patternUnits="userSpaceOnUse">${Array.from({ length: 9 }, () => `<circle cx="${r(rnd() * 5)}" cy="${r(rnd() * 2.4)}" r="${r(0.18 + rnd() * 0.2)}" fill="${["#8f8270", "#efe6d2", "#a89a82", "#6f6456"][Math.floor(rnd() * 4)]}"/>`).join("")}</pattern>`);
  S.def(`<pattern id="${S.id("kiesn")}" width="9" height="6" patternUnits="userSpaceOnUse">${Array.from({ length: 14 }, () => `<ellipse cx="${r(rnd() * 9)}" cy="${r(rnd() * 6)}" rx="${r(0.35 + rnd() * 0.4)}" ry="${r(0.25 + rnd() * 0.25)}" fill="${["#8f8270", "#f3ead8", "#a89a82", "#6f6456", "#c9bba0"][Math.floor(rnd() * 5)]}"/>`).join("")}</pattern>`);
  k += `<rect x="0" y="${yH}" width="320" height="40" fill="url(#${S.id("kiesf")})" opacity=".7"/>`;
  k += `<rect x="0" y="${yH + 40}" width="320" height="${yB - yH - 40}" fill="url(#${S.id("kiesn")})" opacity=".85"/>`;
  k += `<rect x="0" y="${yH}" width="320" height="${yB - yH}" fill="${S.lg("kiesschatten", [[0, "#2a3a1a", 0.35], [0.4, "#2a3a1a", 0.12], [1, "#2a3a1a", 0.05]])}"/>`;
  /* Sonnenflecken durch das Laub */
  for (let i = 0; i < 16; i++) { const X = -5 + rnd() * 11, Z = 3.6 + rnd() * 9, p = P(X, 0, Z); if (p[0] > -10 && p[0] < 330) k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(0.5 * ms(Z) * (0.5 + rnd()))}" ry="${r(0.09 * ms(Z))}" fill="#fff6c8" opacity=".35" filter="url(#${S.id("blur")})"/>`; }
  /* hintere Tischreihen (weit weg, Kulisse) */
  for (const [X0, X1, Z] of [[-5.5, -3.3, 13], [3.6, 5.8, 13.5]]) {
    const a = P(X0, 0.77, Z), b = P(X1, 0.77, Z), f = P(X0, 0, Z);
    k += `<rect x="${a[0]}" y="${r(a[1] - 0.8)}" width="${r(b[0] - a[0])}" height="1.8" fill="#b48a52"/><rect x="${a[0]}" y="${r(a[1] + 0.9)}" width="${r(b[0] - a[0])}" height=".6" fill="#7a5a34"/>`;
    for (const x of [a[0] + 2, b[0] - 2]) k += `<line x1="${r(x)}" y1="${r(a[1])}" x2="${r(x)}" y2="${f[1]}" stroke="#555" stroke-width=".6"/>`;
    const bb = P(X0, 0.48, Z - 0.5); k += `<rect x="${r(bb[0])}" y="${bb[1]}" width="${r(b[0] - a[0])}" height="1" fill="#a87c48"/>`;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DER KIES (vorne, eigener Streifen mit grobem Kies)
   ===================================================================== */
{
  const y0 = 186;
  let k = `<path d="M0 200 L0 ${y0 + 3} Q80 ${y0 - 1} 160 ${y0} Q240 ${y0 + 1} 320 ${y0 - 1} L320 200 Z" fill="${S.lg("kiesvorn", [[0, "#cbbd9f"], [1, "#b9ab8e"]])}"/>`;
  for (let i = 0; i < 150; i++) {
    const x = rnd() * 320, y = y0 + 1.5 + rnd() * (200 - y0 - 1.5), s = 0.4 + rnd() * 0.9;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s)}" ry="${r(s * 0.65)}" fill="${["#8f8270", "#f3ead8", "#a89a82", "#6f6456", "#d9ccb0"][Math.floor(rnd() * 5)]}"/>`;
  }
  S.teil({ id: "bg_kies", de: "der Kies", syl: "KIES", it: "la ghiaia", itSyl: "GHIA-ia", en: "gravel", x: 160, y: 200, kunst: um(160, 200, k),
    tipp: "Kies statt Rasen: Er knirscht unter den Schuhen, und im Regen gibt es keinen Matsch." });
}

/* =====================================================================
   2 — DIE SCHÄNKE (Ausschank-Hütte) mit Lupe
   ===================================================================== */
{
  const Z = 12, X0 = 0.4, X1 = 4.4, m = ms(Z);
  const a = P(X0, 2.75, Z), b = P(X1, 0, Z), w = b[0] - a[0], h = b[1] - a[1];
  const yD = P(0, 1.08, Z)[1], yF = P(0, 2.15, Z)[1];
  let k = schatten((a[0] + b[0]) / 2, b[1], w * 0.6, 2, 0.35);
  /* Satteldach mit Schindeln */
  k += `<path d="M${r(a[0] - 4)} ${r(a[1] + 2)} L${r((a[0] + b[0]) / 2)} ${r(a[1] - 10)} L${r(b[0] + 4)} ${r(a[1] + 2)} Z" fill="${S.lg("dach", [[0, "#7a3a24"], [1, "#5a2a1a"]])}"/>`;
  for (let i = 1; i < 4; i++) k += `<path d="M${r(a[0] - 4 + i * 3.4)} ${r(a[1] + 2 - i * 3)} L${r(b[0] + 4 - i * 3.4)} ${r(a[1] + 2 - i * 3)}" stroke="#3a1a10" stroke-width=".35" opacity=".6"/>`;
  /* Wände aus Holz (senkrechte Bretter) */
  k += `<rect x="${a[0]}" y="${r(a[1] + 2)}" width="${r(w)}" height="${r(h - 2)}" fill="${S.lg("huette", [[0, "#8a5a32"], [1, "#6a4224"]])}"/>`;
  for (let x = a[0] + 2.2; x < b[0]; x += 2.4) k += `<line x1="${r(x)}" y1="${r(a[1] + 2)}" x2="${r(x)}" y2="${b[1]}" stroke="#4a2c16" stroke-width=".3"/>`;
  /* Schild über der Öffnung */
  k += `<rect x="${r(a[0] + 6)}" y="${r(a[1] + 3)}" width="${r(w - 12)}" height="7" rx="1" fill="#f3e9cc" stroke="#2a4a8a" stroke-width=".6"/><text x="${r(a[0] + w / 2)}" y="${r(a[1] + 8.3)}" font-size="4.6" text-anchor="middle" fill="#2a4a8a" font-family="Georgia,serif" font-weight="bold" letter-spacing=".6">Schänke</text>`;
  /* Öffnung mit Innenraum, Krugregal */
  const ox0 = a[0] + 4, ox1 = b[0] - 22;
  k += `<rect x="${r(ox0)}" y="${r(yF)}" width="${r(ox1 - ox0)}" height="${r(yD - yF)}" fill="#2a1a0e"/>`;
  for (let j = 0; j < 2; j++) {
    const yy = yF + 6 + j * 6;
    k += `<rect x="${r(ox0 + 1)}" y="${r(yy)}" width="${r(ox1 - ox0 - 2)}" height=".7" fill="#8a5a32"/>`;
    for (let x = ox0 + 3; x < ox1 - 2; x += 3.4) k += `<path d="M${r(x - 1.2)} ${r(yy - 4.4)} L${r(x + 1.2)} ${r(yy - 4.4)} L${r(x + 1.1)} ${r(yy)} L${r(x - 1.1)} ${r(yy)} Z" fill="#d9e8ea" opacity=".85"/><path d="M${r(x + 1.2)} ${r(yy - 3.6)} q1 .4 0 2.4" stroke="#cfe0e2" stroke-width=".35" fill="none"/>`;
  }
  /* Tresen (Brett) und Front */
  k += `<rect x="${r(ox0 - 1)}" y="${r(yD - 1.2)}" width="${r(ox1 - ox0 + 2)}" height="2" fill="#b48a52"/>`;
  /* rechts: Tür */
  k += `<rect x="${r(b[0] - 14)}" y="${r(yF - 4)}" width="9" height="${r(b[1] - yF + 4)}" fill="#5a3a20" stroke="#3a2210" stroke-width=".4"/><circle cx="${r(b[0] - 6.6)}" cy="${r(b[1] - 9)}" r=".5" fill="#c9a14a"/>`;
  /* Fahnenmast mit weiß-blauer Rautenfahne */
  const fx = b[0] + 3, fTop = a[1];
  k += `<rect x="${r(fx - 0.5)}" y="${r(fTop)}" width="1" height="${r(b[1] - fTop)}" fill="#e8e8e8"/>`;
  S.def(`<pattern id="${S.id("raute")}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="4" height="4" fill="#fff"/><rect width="2" height="2" fill="#3a7ac8"/><rect x="2" y="2" width="2" height="2" fill="#3a7ac8"/></pattern>`);
  k += `<path d="M${r(fx + 0.5)} ${r(fTop + 1)} Q${r(fx + 7)} ${r(fTop - 1)} ${r(fx + 13)} ${r(fTop + 1.6)} L${r(fx + 13)} ${r(fTop + 9.6)} Q${r(fx + 7)} ${r(fTop + 7)} ${r(fx + 0.5)} ${r(fTop + 9)} Z" fill="url(#${S.id("raute")})" stroke="#c9d6e6" stroke-width=".2"/>`;
  /* Lupe: Preistafel, Holzfass mit Hahn, Kasse, Fahne */
  const unter = [];
  const add = (u, x0, y0, x1, y1) => unter.push(Object.assign(u, { x: (x0 + x1) / 2, y: y1, kunst: um((x0 + x1) / 2, y1, flaeche(x0, y0, x1 - x0, y1 - y0, 0.6)) }));
  /* Preistafel rechts neben der Öffnung */
  const px = ox1 + 1.6, pw = 10.8, py = yF - 3, ph = 14;
  k += `<rect x="${r(px)}" y="${r(py)}" width="${pw}" height="${ph}" rx=".5" fill="#26302b" stroke="#8a5a32" stroke-width=".7"/>`;
  const zeilen = [["Maß", "11,90"], ["Radler", "11,50"], ["Spezi", "4,80"], ["Brez'n", "4,50"], ["Obatzda", "8,90"]];
  k += `<text x="${r(px + pw / 2)}" y="${r(py + 2.4)}" font-size="1.7" text-anchor="middle" fill="#f6e7a1" font-family="'Comic Sans MS',cursive">Preise</text>`;
  zeilen.forEach(([t, p], i) => { k += `<text x="${r(px + 0.8)}" y="${r(py + 4.6 + i * 2)}" font-size="1.25" fill="#f1eee2" font-family="'Comic Sans MS',cursive">${t}</text><text x="${r(px + pw - 0.8)}" y="${r(py + 4.6 + i * 2)}" font-size="1.25" text-anchor="end" fill="#f1eee2" font-family="'Comic Sans MS',cursive">${p}</text>`; });
  add({ id: "bg_preistafel", de: "die Preistafel", syl: "PREIS-ta-fel", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price board", tipp: "Eine Maß ist ein Liter Bier. Das Pfand für den Krug kommt oft noch dazu." }, px, py, px + pw, py + ph);
  /* Holzfass auf dem Tresen */
  const hx = ox0 + 7, hy = yD - 1.2, hw = 5.4, hh = 6.4;
  k += `<path d="M${r(hx - hw)} ${r(hy)} Q${r(hx - hw - 1)} ${r(hy - hh / 2)} ${r(hx - hw)} ${r(hy - hh)} L${r(hx + hw)} ${r(hy - hh)} Q${r(hx + hw + 1)} ${r(hy - hh / 2)} ${r(hx + hw)} ${r(hy)} Z" fill="${S.lg("fass", [[0, "#6a3e1c"], [0.45, "#b07a40"], [1, "#5a3214"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.18, 0.82]) k += `<rect x="${r(hx - hw - 0.4)}" y="${r(hy - hh * t - 0.5)}" width="${r(2 * hw + 0.8)}" height="1" fill="#2a2a2a"/>`;
  k += `<rect x="${r(hx - 0.6)}" y="${r(hy - hh / 2 - 0.4)}" width="1.2" height="2.4" fill="#c9a14a"/><rect x="${r(hx - 1.2)}" y="${r(hy - hh / 2 - 2.2)}" width="2.4" height="1" rx=".3" fill="#c9a14a"/>`;
  k += `<rect x="${r(hx - hw - 1)}" y="${r(hy - 0.8)}" width="${r(2 * hw + 2)}" height="1" fill="#4a2c16"/>`;
  add({ id: "bg_bierfass", de: "das Bierfass", syl: "BIER-fass", it: "la botte di birra", itSyl: "BOT-te di BIR-ra", en: "beer barrel", tipp: "Aus dem Holzfass wird ohne Kohlensäure-Druck gezapft – „O'zapft is!“" }, hx - hw - 1, hy - hh - 3, hx + hw + 1, hy + 0.2);
  /* Kasse in der Öffnung rechts */
  const kx = ox1 - 6, ky = yD - 1.2;
  k += `<rect x="${r(kx - 3.4)}" y="${r(ky - 2)}" width="6.8" height="2" rx=".3" fill="#2b2f33"/><path d="M${r(kx - 3)} ${r(ky - 2)} L${r(kx - 2.4)} ${r(ky - 5.6)} L${r(kx + 2.4)} ${r(ky - 5.6)} L${r(kx + 3)} ${r(ky - 2)} Z" fill="#1d2125"/><rect x="${r(kx - 2)}" y="${r(ky - 5.2)}" width="4" height="2.4" fill="#2c6b8f"/>`;
  add({ id: "bg_kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "till", tipp: "Selbstbedienung: Man holt sein Bier an der Schänke und zahlt sofort." }, kx - 4, ky - 6.4, kx + 4, ky + 0.2);
  add({ id: "bg_fahne", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", tipp: "Weiß-blaue Rauten: die Fahne von Bayern." }, fx - 1, fTop, fx + 13.4, fTop + 10.4);
  const cx = (a[0] + b[0]) / 2;
  S.teil({ id: "bg_schaenke", de: "die Schänke", syl: "SCHÄN-ke", it: "la mescita", itSyl: "ME-sci-ta", en: "beer stand", x: r(cx), y: b[1], steht: true, kunst: um(cx, b[1], k),
    zoom: { x: r(a[0] - 6), y: r(fTop - 3), w: 104, h: 69 }, unter,
    tipp: "An der Schänke holt man sich das Bier selbst – mit Pfand für den Krug." });
}

/* =====================================================================
   3 — DAS SCHILD „Biergarten – Selbstbedienung“ (auf zwei Pfosten)
   ===================================================================== */
{
  const Z = 8, [x, y] = P(-2.3, 0, Z), m = ms(Z);
  const top = P(-2.3, 2.15, Z)[1], bw = 1.05 * m, bh = 0.62 * m;
  let k = schatten(x, y, bw * 0.55, 1, 0.3);
  for (const s of [-1, 1]) k += `<rect x="${r(x + s * bw * 0.4 - 0.8)}" y="${r(top)}" width="1.6" height="${r(y - top)}" fill="${S.lg("pfosten", [[0, "#5a3a20"], [0.5, "#8a5a32"], [1, "#4a2c16"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(x - bw / 2 - 1)} ${r(top + 1)} L${r(x)} ${r(top - 4)} L${r(x + bw / 2 + 1)} ${r(top + 1)} Z" fill="#5a2a1a"/>`;
  k += `<rect x="${r(x - bw / 2)}" y="${r(top + 1)}" width="${r(bw)}" height="${r(bh)}" rx=".8" fill="${S.lg("schildholz", [[0, "#efe2c0"], [1, "#d9c79c"]])}" stroke="#5a3a20" stroke-width=".8"/>`;
  k += `<text x="${r(x)}" y="${r(top + 6.4)}" font-size="4.4" text-anchor="middle" fill="#2a4a8a" font-family="Georgia,serif" font-weight="bold" font-style="italic">Biergarten</text>`;
  k += `<text x="${r(x)}" y="${r(top + 10.6)}" font-size="2.2" text-anchor="middle" fill="#3a2a18" font-family="Georgia,serif">Selbstbedienung</text>`;
  k += `<text x="${r(x)}" y="${r(top + 14)}" font-size="1.75" text-anchor="middle" fill="#3a2a18" font-family="Georgia,serif">Eigene Brotzeit erlaubt</text>`;
  k += `<text x="${r(x)}" y="${r(top + 17)}" font-size="1.6" text-anchor="middle" fill="#7a2a1a" font-family="Georgia,serif">täglich 11 – 23 Uhr</text>`;
  S.teil({ id: "bg_schild_bg", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x, y, kunst: um(x, y, k),
    tipp: "Im Biergarten darf man seine eigene Brotzeit mitbringen – nur die Getränke kauft man hier." });
}

/* =====================================================================
   4 — DIE KASTANIEN (Stämme und Blätterdach)
   ===================================================================== */
const STAMM = [[-2.9, 5.4, 0.62], [4.4, 8, 0.5]];
{
  let k = "";
  for (const [X, Z, d] of STAMM) {
    const m = ms(Z), [x, y] = P(X, 0, Z), w = d * m / 2;
    k += schatten(x, y + 1, w * 1.8, 2.4, 0.45);
    k += `<path d="M${r(x - w * 1.7)} ${r(y)} Q${r(x - w * 1.05)} ${r(y - 6)} ${r(x - w)} ${r(y - 16)} L${r(x - w * 0.9)} 0 L${r(x + w * 0.9)} 0 L${r(x + w)} ${r(y - 16)} Q${r(x + w * 1.05)} ${r(y - 6)} ${r(x + w * 1.8)} ${r(y)} Z" fill="${RINDE}"/>`;
    /* Borke: gedrehte Längsrisse */
    for (let i = 0; i < 9; i++) { const t = -0.8 + i * 0.2; k += `<path d="M${r(x + t * w)} ${r(y - 2)} Q${r(x + t * w + 2)} ${r(y - 40)} ${r(x + t * w * 0.9 - 1)} 0" stroke="#241a12" stroke-width="${r(0.3 + rnd() * 0.4)}" fill="none" opacity=".7"/>`; }
    k += `<path d="M${r(x - w * 0.55)} ${r(y - 4)} Q${r(x - w * 0.45)} ${r(y - 40)} ${r(x - w * 0.5)} 0" stroke="#a89880" stroke-width="${r(w * 0.25)}" fill="none" opacity=".18"/>`;
  }
  /* Blätterdach: dunkle Masse, darin hunderte Fächerblätter (wiederverwendet) */
  k += `<path d="M0 0 L320 0 L320 34 Q300 46 284 38 Q270 50 250 40 Q236 30 220 36 Q200 26 182 32 Q162 22 140 30 Q120 24 100 34 Q84 44 66 38 Q46 52 26 44 Q10 50 0 42 Z" fill="${S.lg("krone", [[0, "#173214"], [1, "#24521f"]])}"/>`;
  for (let i = 0; i < 110; i++) {
    const x = 11 + rnd() * 298, yRand = 28 + Math.sin(x / 26) * 6 - (x > 160 && x < 280 ? 6 : 0), y = rnd() * yRand + 2;
    const n = y < 14 ? (rnd() < 0.6 ? "b4" : "b2") : ["b1", "b2", "b3", "b1"][Math.floor(rnd() * 4)];
    k += blatt(n, x, Math.max(13, y), rnd() * 360, 0.7 + rnd() * 0.4);
  }
  /* Lücken mit Himmel */
  /* Kastanienfrüchte (stachelig, grün) */
  for (const [x, y] of [[44, 38], [96, 33], [228, 36], [300, 40]]) k += `<circle cx="${x}" cy="${y}" r="1.6" fill="#7aa83a"/><circle cx="${x}" cy="${y}" r="1.6" fill="none" stroke="#a8d05a" stroke-width=".5" stroke-dasharray=".3 .5"/>`;
  S.teil({ id: "bg_kastanie", de: "die Kastanie", syl: "Ka-STA-ni-e", it: "il castagno", itSyl: "ca-STA-gno", en: "chestnut tree", x: 160, y: P(STAMM[0][0], 0, STAMM[0][1])[1], kunst: um(160, P(STAMM[0][0], 0, STAMM[0][1])[1], k),
    tipp: "Kastanien spenden viel Schatten. Früher standen sie über den Bierkellern, damit das Bier kühl blieb." });
}
{
  /* DAS BLATT — ein großes Fächerblatt ganz vorn oben rechts */
  const x = 294, y = 14;
  let k = `<path d="M${x} ${y} L${x + 14} ${y - 10}" stroke="#2f5a26" stroke-width="1"/>`;
  k += `<g transform="translate(${x} ${y}) rotate(160) scale(2.3)"><use href="#${S.id("b3")}"/><path d="M0 0 L0 -9.5 M0 0 L5 -6.5 M0 0 L-5 -6.5" stroke="#2f6a2a" stroke-width=".18" fill="none"/></g>`;
  S.teil({ oben: true, id: "bg_blatt", de: "das Blatt", syl: "BLATT", it: "la foglia", itSyl: "FO-glia", en: "leaf", x, y: y + 22, kunst: um(x, y + 22, k),
    tipp: "Das Kastanienblatt sieht aus wie eine Hand mit fünf bis sieben Fingern." });
}

/* =====================================================================
   5 — DIE LICHTERKETTE und 6 — DIE LAMPIONS
   ===================================================================== */
const kette = (x0, y0, x1, y1, sag, t) => { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag; const u = 1 - t; return [u * u * x0 + 2 * u * t * mx + t * t * x1, u * u * y0 + 2 * u * t * my + t * t * y1]; };
{
  const [x0, y0, x1, y1, sag] = [22, 30, 300, 32, 12];
  let k = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}" stroke="#2a2a2a" stroke-width=".45" fill="none"/>`;
  let f = "";
  for (let i = 1; i < 26; i++) {
    const [x, y] = kette(x0, y0, x1, y1, sag * 2, i / 26);
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + 1.6)}" stroke="#2a2a2a" stroke-width=".35"/><ellipse cx="${r(x)}" cy="${r(y + 2.6)}" rx=".9" ry="1.25" fill="${S.rg("birne", [[0, "#ffffff"], [0.5, "#fff3b0"], [1, "#ffcf5a"]])}"/><circle cx="${r(x)}" cy="${r(y + 2.6)}" r="2.6" fill="#ffe8a0" opacity=".25"/>`;
    f += flaeche(x - 2, y - 1, 4, 5.5, 1);
  }
  S.teil({ oben: true, id: "bg_lichterkette", de: "die Lichterkette", syl: "LICH-ter-ket-te", it: "la catena luminosa", itSyl: "ca-TE-na lu-mi-NO-sa", en: "string lights", x: 160, y: 66, kunst: um(160, 66, k + f) });
}
{
  const [x0, y0, x1, y1, sag] = [8, 34, 312, 36, 14];
  let k = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}" stroke="#3a3a3a" stroke-width=".4" fill="none"/>`;
  const farben = [["#e8402a", "#b8201a"], ["#f2c230", "#d0941a"], ["#3a7ac8", "#24508a"], ["#e86aa0", "#b83a70"], ["#58b04a", "#2f7a2a"], ["#f28a2a", "#c85a14"], ["#3a7ac8", "#24508a"]];
  farben.slice(0, 6).forEach(([c1, c2], i) => {
    const t = [0.07, 0.2, 0.33, 0.46, 0.83, 0.95][i], [x, y] = kette(x0, y0, x1, y1, sag * 2, t), s = 1 + (i % 2) * 0.15;
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + 2)}" stroke="#3a3a3a" stroke-width=".3"/>`;
    k += `<rect x="${r(x - 1.4 * s)}" y="${r(y + 1.6)}" width="${r(2.8 * s)}" height="1" fill="#2a2a2a"/>`;
    k += `<ellipse cx="${r(x)}" cy="${r(y + 2.6 + 4 * s)}" rx="${r(4.4 * s)}" ry="${r(4.2 * s)}" fill="${S.rg("lamp" + i, [[0, "#fff4d0"], [0.45, c1], [1, c2]], 0.45, 0.45, 0.6)}"/>`;
    for (const dy of [-2, 0, 2]) k += `<path d="M${r(x - 4.3 * s * Math.cos(dy / 5))} ${r(y + 2.6 + 4 * s + dy * s)} Q${r(x)} ${r(y + 3.6 + 4 * s + dy * s)} ${r(x + 4.3 * s * Math.cos(dy / 5))} ${r(y + 2.6 + 4 * s + dy * s)}" stroke="${c2}" stroke-width=".3" fill="none" opacity=".7"/>`;
    k += `<rect x="${r(x - 1.4 * s)}" y="${r(y + 2.6 + 8 * s)}" width="${r(2.8 * s)}" height=".9" fill="#2a2a2a"/>`;
  });
  S.teil({ oben: true, id: "bg_lampion", de: "der Lampion", syl: "LAM-pi-on", it: "la lanterna di carta", itSyl: "lan-TER-na di CAR-ta", en: "paper lantern", x: 160, y: 84, kunst: um(160, 84, k),
    tipp: "Bunte Lampions aus Papier leuchten abends, wenn es dunkel wird." });
}

/* =====================================================================
   7 — DIE BIERTISCHE (vorn bedient, dahinter Selbstbedienung)
   ===================================================================== */
const TV = { X0: -1.55, X1: 0.75, Z: 4.2, T: 0.5 };   // vorderer Tisch
const TH = { X0: 0.55, X1: 2.85, Z: 8.4, T: 0.5 };    // hinterer Tisch
const garnitur = (t, art) => {
  /* art: "tisch" oder "bank" (Bank vor dem Tisch: Z − 0,4) */
  const tisch = art === "tisch";
  const H = tisch ? 0.77 : 0.48, tiefe = tisch ? t.T : 0.25, Z = tisch ? t.Z : t.Z - 0.42;
  const vl = P(t.X0, H, Z), vr = P(t.X1, H, Z), hl = P(t.X0, H, Z + tiefe), hr = P(t.X1, H, Z + tiefe), m = ms(Z);
  const dick = 0.03 * m;
  let g = schatten((vl[0] + vr[0]) / 2, P(0, 0, Z + tiefe / 2)[1], (vr[0] - vl[0]) * 0.5, 1.6 + tiefe * m * 0.08, 0.35);
  /* Klappbeine (Metall) an beiden Enden */
  for (const [X, s] of [[t.X0 + 0.22, 1], [t.X1 - 0.22, -1]]) {
    const o = P(X, H - 0.03, Z + tiefe * 0.15), u = P(X + s * 0.02, 0, Z + tiefe * 0.05), u2 = P(X + s * 0.02, 0, Z + tiefe * 0.95), o2 = P(X, H - 0.03, Z + tiefe * 0.85);
    g += `<path d="M${o2[0]} ${o2[1]} L${u2[0]} ${u2[1]}" stroke="#4a5056" stroke-width="${r(0.025 * m)}"/>`;
    g += `<path d="M${o[0]} ${o[1]} L${u[0]} ${u[1]}" stroke="${METALL}" stroke-width="${r(0.03 * m)}"/>`;
    const q = P(X, H * 0.45, Z + tiefe * 0.12), q2 = P(X, H * 0.45, Z + tiefe * 0.88);
    g += `<line x1="${q[0]}" y1="${q[1]}" x2="${q2[0]}" y2="${q2[1]}" stroke="#5a6066" stroke-width="${r(0.015 * m)}"/>`;
    g += `<rect x="${r(u[0] - 0.05 * m)}" y="${r(u[1] - 0.6)}" width="${r(0.1 * m)}" height="1.2" rx=".5" fill="#2a2a2a"/>`;
  }
  /* Platte: Bretter, Kante */
  g += poly([hl, hr, vr, vl], FICHTE);
  const n = tisch ? 4 : 2;
  for (let i = 1; i < n; i++) { const a = P(t.X0, H, Z + tiefe * i / n), b = P(t.X1, H, Z + tiefe * i / n); g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#a07a48" stroke-width=".3"/>`; }
  g += `<rect x="${vl[0]}" y="${vl[1]}" width="${r(vr[0] - vl[0])}" height="${r(dick)}" fill="${KANTE}"/>`;
  g += `<rect x="${vl[0]}" y="${r(vl[1] + dick)}" width="${r(vr[0] - vl[0])}" height="${r(dick * 0.6)}" fill="#3a2a18" opacity=".35"/>`;
  /* Seitenkante rechts (wir sehen die Stirnseite, wenn das Ende links vom Fluchtpunkt liegt) */
  if (t.X1 < 0) g += poly([vr, hr, [hr[0], hr[1] + dick], [vr[0], vr[1] + dick]], "#8a6236");
  if (t.X0 > 0) g += poly([vl, hl, [hl[0], hl[1] + dick], [vl[0], vl[1] + dick]], "#8a6236");
  return g;
};
{
  let k = garnitur(TH, "bank") + garnitur(TH, "tisch") + garnitur(TV, "tisch");
  const [x, y] = P((TV.X0 + TV.X1) / 2, 0, TV.Z);
  S.teil({ id: "bg_biertisch", de: "der Biertisch", syl: "BIER-tisch", it: "il tavolo da birreria", itSyl: "TA-vo-lo da bir-re-RI-a", en: "beer table", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Biertisch und Bierbänke heißen zusammen „Bierzeltgarnitur“ – man kann sie zusammenklappen." });
}

/* =====================================================================
   8 — DER GAST und 9 — DIE GÄSTIN (sitzen hinter dem vorderen Tisch)
   ===================================================================== */
const sitzend = (spec, hoehe, X, Zsitz, Hsitz, yVerdeckt) => {
  const probe = B.mensch(spec, hoehe);
  const [sx, sy] = P(X, Hsitz, Zsitz);
  const x = sx - probe.z.sitz.x * probe.k, y = sy - probe.z.sitz.y * probe.k;
  const f = figur(spec, hoehe, yVerdeckt != null ? y - yVerdeckt : null);
  /* was hinter der Tischplatte liegt, wird abgeschnitten (Knie unter dem Tisch) */
  const cid = S.id("clip_" + spec.id);
  const clip = `<clipPath id="${cid}"><rect x="-60" y="-200" width="120" height="${r(200 + yVerdeckt - 1.5 - y)}"/></clipPath>`;
  return { x, y, svg: clip + `<g clip-path="url(#${cid})">${f.svg}</g>` };
};
const yTischV = P(0, 0.77, TV.Z + TV.T)[1];
{
  const Z = TV.Z + TV.T + 0.35, m = ms(Z);
  const f = sitzend({ id: "b12b_gast", geschlecht: "m", pose: "sitzen", blick: 22, frisur: "kurz", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#c9302a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.8 * m, -0.85, Z, 0.48, yTischV + 1.5);
  S.teil({ id: "bg_gast1", de: "der Gast", syl: "GAST", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x: f.x, y: f.y, kunst: f.svg,
    tipp: "Er sagt: „Prost!“ – beim Anstoßen schaut man sich in die Augen." });
}
{
  const Z = TV.Z + TV.T + 0.35, m = ms(Z);
  const f = sitzend({ id: "b12b_gaestin", geschlecht: "w", pose: "sitzen", blick: -24, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f1ead8" }, jacke: { stueck: "weste", farbe: "#2f5a35" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.66 * m, 0.2, Z, 0.48, yTischV + 1.5);
  S.teil({ id: "bg_gast2", de: "die Gästin", syl: "GÄS-tin", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x: f.x, y: f.y, kunst: f.svg,
    tipp: "Zur Maß gehört eine Brotzeit: Brezn, Radi und Obatzda." });
}

/* =====================================================================
   10 — DIE BIERBANK (vorn, vor dem Tisch; auch am hinteren Tisch)
   ===================================================================== */
{
  let k = garnitur(TV, "bank");
  const [x, y] = P((TV.X0 + TV.X1) / 2, 0, TV.Z - 0.42);
  S.teil({ id: "bg_bierbank", de: "die Bierbank", syl: "BIER-bank", it: "la panca da birra", itSyl: "PAN-ca da BIR-ra", en: "beer bench", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Auf der Bierbank sitzt man eng – oft neben Fremden. Das ist ganz normal." });
}

/* =====================================================================
   11 — AUF DEN TISCHEN: Maßkrüge, Brezn am Ständer, Radi, Brotzeitbrett
   ===================================================================== */
const AUF = (X, t, dz = 0.25) => P(X, 0.77, t.Z + dz);
const masskrug = (x, y, m, voll = 1, henkel = 1) => {
  const w = 0.058 * m, h = 0.2 * m;
  let g = schatten(x, y, w * 1.3, .7, .3);
  /* Glaskörper mit Dellen, Bier, Schaumkrone */
  g += `<path d="M${r(x - w)} ${r(y - h)} L${r(x + w)} ${r(y - h)} L${r(x + w * 0.96)} ${r(y)} L${r(x - w * 0.96)} ${r(y)} Z" fill="${GLAS}" stroke="#e6f0f2" stroke-width=".25"/>`;
  if (voll > 0) {
    const yb = y - h * voll * 0.86;
    g += `<path d="M${r(x - w * 0.92)} ${r(yb)} L${r(x + w * 0.92)} ${r(yb)} L${r(x + w * 0.88)} ${r(y - h * 0.08)} L${r(x - w * 0.88)} ${r(y - h * 0.08)} Z" fill="${BIER}" opacity=".92"/>`;
    g += `<path d="M${r(x - w * 0.95)} ${r(yb + 0.6)} Q${r(x - w)} ${r(yb - h * 0.12)} ${r(x)} ${r(yb - h * 0.13)} Q${r(x + w)} ${r(yb - h * 0.12)} ${r(x + w * 0.95)} ${r(yb + 0.6)} Z" fill="#fffaf0"/>`;
  }
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) g += `<ellipse cx="${r(x - w * 0.55 + i * w * 0.55)}" cy="${r(y - h * (0.22 + j * 0.24))}" rx="${r(w * 0.2)}" ry="${r(h * 0.08)}" fill="#fff" opacity=".28"/>`;
  g += `<rect x="${r(x - w)}" y="${r(y - h * 0.08)}" width="${r(2 * w)}" height="${r(h * 0.08)}" fill="#e6f0f2" opacity=".6"/>`;
  g += `<path d="M${r(x + henkel * w)} ${r(y - h * 0.82)} q${r(henkel * w * 0.85)} 0 ${r(henkel * w * 0.85)} ${r(h * 0.35)} q0 ${r(h * 0.32)} ${r(-henkel * w * 0.85)} ${r(h * 0.34)}" stroke="#e8f2f4" stroke-width="${r(w * 0.32)}" fill="none" opacity=".85"/>`;
  g += `<rect x="${r(x - w * 0.82)}" y="${r(y - h * 0.9)}" width="${r(w * 0.22)}" height="${r(h * 0.75)}" fill="#fff" opacity=".45"/>`;
  return g;
};
{
  const mv = ms(TV.Z + 0.25), mh = ms(TH.Z + 0.25);
  let k = "";
  for (const [X, voll, hk] of [[1.0, 0.2, 1], [1.4, 0, -1], [2.3, 0.6, 1]]) { const [x, y] = AUF(X, TH); k += masskrug(x, y, mh, voll, hk); }
  for (const [X, voll, hk] of [[-0.62, 0.85, -1], [0.42, 0.65, 1]]) { const [x, y] = AUF(X, TV); k += masskrug(x, y, mv, voll, hk); }
  const [x, y] = AUF(-0.1, TV);
  S.teil({ oben: true, id: "bg_masskrug", de: "der Maßkrug", syl: "MASS-krug", it: "il boccale", itSyl: "boc-CA-le", en: "beer stein", x, y, kunst: um(x, y, k),
    tipp: "In einen Maßkrug passt ein Liter Bier. Man sagt „eine Maß“." });
}
{
  /* DIE BREZEL — zwei große Brezn am Holzständer */
  const [x, y] = AUF(-0.12, TV, 0.3), m = ms(TV.Z + 0.3), h = 0.36 * m;
  let k = schatten(x, y, 6, .7, .3);
  k += `<ellipse cx="${x}" cy="${r(y - 0.5)}" rx="5" ry="1" fill="#8a5a32"/><rect x="${r(x - 0.6)}" y="${r(y - h)}" width="1.2" height="${r(h)}" fill="${S.lg("staender", [[0, "#7a4a24"], [1, "#b07a40"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(x - 7.6)}" y="${r(y - h)}" width="15.2" height="1.2" rx=".5" fill="#8a5a32"/>`;
  const brezel = (bx, by, s) => {
    const p = (dx, dy) => `${r(bx + dx * s)} ${r(by + dy * s)}`;
    const d = `M${p(-5, 4)} C${p(-8, 1)} ${p(-6, -5)} ${p(-1, -4.6)} C${p(3, -4.2)} ${p(4, 0)} ${p(1.2, 2.6)} M${p(5, 4)} C${p(8, 1)} ${p(6, -5)} ${p(1, -4.6)} C${p(-3, -4.2)} ${p(-4, 0)} ${p(-1.2, 2.6)}`;
    let g = `<path d="${d}" stroke="${LAUGE}" stroke-width="${r(2.3 * s)}" fill="none" stroke-linecap="round"/>`;
    g += `<path d="${d}" stroke="#c98a4a" stroke-width="${r(0.6 * s)}" opacity=".55" fill="none" stroke-linecap="round" transform="translate(-.3 -.4)"/>`;
    for (let i = 0; i < 7; i++) g += `<rect x="${r(bx + (-5 + rnd() * 10) * s)}" y="${r(by + (-4 + rnd() * 6) * s)}" width="${r(0.45 * s)}" height="${r(0.35 * s)}" fill="#fffaf0"/>`;
    return g;
  };
  for (const s of [-1, 1]) { const bx = x + s * 4.8, by = y - h + 6.6; k += `<line x1="${r(bx)}" y1="${r(y - h + 1)}" x2="${r(bx)}" y2="${r(by - 4)}" stroke="#3a3a3a" stroke-width=".35"/>` + brezel(bx, by, 0.95); }
  S.teil({ oben: true, id: "bg_brezel", de: "die Brezel", syl: "BRE-zel", it: "il bretzel", itSyl: "BRET-zel", en: "pretzel", x, y, kunst: um(x, y, k),
    tipp: "In Bayern heißt sie „Brezn“ – frisch, groß und mit grobem Salz." });
}
{
  /* DER RETTICH (Radi) — spiralig geschnitten auf dem Brett, gesalzen */
  const [x, y] = AUF(0.17, TV, 0.12), m = ms(TV.Z + 0.12);
  let k = `<ellipse cx="${x}" cy="${r(y - 0.4)}" rx="6.2" ry="1.3" fill="${S.lg("brett", [[0, "#d6a868"], [1, "#a8783e"]])}" stroke="#8a5a2a" stroke-width=".2"/>`;
  for (let i = 0; i < 7; i++) { const dx = -3.6 + i * 1.2; k += `<ellipse cx="${r(x + dx)}" cy="${r(y - 1.6 - Math.sin(i / 6 * Math.PI) * 0.6)}" rx="1.25" ry="1.6" fill="${S.rg("radi", [[0, "#ffffff"], [1, "#e6e8dc"]])}" stroke="#d8dccb" stroke-width=".2"/>`; }
  k += `<path d="M${r(x + 4.4)} ${r(y - 2.2)} q2 -1.6 3.4 -.4 q-1.4 -.2 -2.2 1 Z" fill="#6aa84a"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(x - 3 + rnd() * 6)}" cy="${r(y - 2.4 + rnd() * 1.4)}" r=".18" fill="#fff"/>`;
  S.teil({ oben: true, id: "bg_radi", de: "der Rettich", syl: "RET-tich", it: "il ravanello", itSyl: "ra-va-NEL-lo", en: "radish", x, y, kunst: um(x, y, k + flaeche(x - 6.5, y - 4, 13, 5)),
    tipp: "In Bayern sagt man „Radi“: Er wird spiralig geschnitten und gesalzen." });
}
{
  /* DAS BROTZEITBRETT — Obatzda, Käse, Radieschen, Brot */
  const [x, y] = AUF(-1.12, TV, 0.18);
  let k = schatten(x, y, 7, .6, .3);
  k += `<path d="M${r(x - 7)} ${r(y)} L${r(x + 7)} ${r(y)} L${r(x + 6.2)} ${r(y - 1.6)} L${r(x - 6.2)} ${r(y - 1.6)} Z" fill="${S.lg("brett2", [[0, "#c8965a"], [1, "#9a6a34"]])}"/><rect x="${r(x - 7)}" y="${r(y - 0.2)}" width="14" height=".9" fill="#7a5028"/>`;
  k += `<ellipse cx="${r(x - 3)}" cy="${r(y - 2.4)}" rx="2.8" ry="1.6" fill="${S.rg("obatzda", [[0, "#f6c98a"], [1, "#e09a4a"]])}"/><circle cx="${r(x - 3.6)}" cy="${r(y - 3.2)}" r=".5" fill="#fff6e0"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(x - 4.4 + i * 0.9)} ${r(y - 3.6)} l.6 -.6" stroke="#4a8a3a" stroke-width=".3"/>`;
  k += `<path d="M${r(x + 0.2)} ${r(y - 1.6)} L${r(x + 3.8)} ${r(y - 1.6)} L${r(x + 3.8)} ${r(y - 3.4)} Z" fill="#f2d070"/><circle cx="${r(x + 2.6)}" cy="${r(y - 2.2)}" r=".3" fill="#d9a83a"/>`;
  for (const dx of [4.6, 5.8]) k += `<circle cx="${r(x + dx)}" cy="${r(y - 2.4)}" r=".9" fill="#d8283a"/><circle cx="${r(x + dx - 0.2)}" cy="${r(y - 2.7)}" r=".25" fill="#fff" opacity=".6"/>`;
  k += `<path d="M${r(x - 0.4)} ${r(y - 1.6)} q1.4 -2.6 3 -.2" fill="#7a4a24"/>`;
  S.teil({ oben: true, id: "bg_brotzeitbrett", de: "das Brotzeitbrett", syl: "BROT-zeit-brett", it: "il tagliere", itSyl: "ta-GLIE-re", en: "snack board", x, y, kunst: um(x, y, k + flaeche(x - 7.4, y - 5, 14.8, 5.8)),
    tipp: "Obatzda ist ein bayerischer Käseaufstrich mit Paprika und Zwiebeln." });
}

/* =====================================================================
   12 — DIE KELLNERIN mit 13 — DEM TABLETT (rechts, kommt an den Tisch)
   ===================================================================== */
{
  const X = 2.05, Z = 5.3, m = ms(Z), [x, y] = P(X, 0, Z);
  const spec = { id: "b12b_kell", geschlecht: "w", pose: "servieren", blick: -55, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "#2a5aa8" }, unterteil: { stueck: "rock_knie", farbe: "#7a1c2c" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } };
  const f = figur(spec, 1.68 * m);
  f.svg = schatten(2, 0.5, 9, 1.6, 0.4) + f.svg;
  S.teil({ id: "bg_kellnerin", de: "die Kellnerin", syl: "KELL-ne-rin", it: "la cameriera", itSyl: "ca-me-RIE-ra", en: "waitress", x, y, kunst: f.svg,
    tipp: "Im bedienten Teil kommt die Kellnerin an den Tisch – im Dirndl." });
  /* das Tablett liegt auf der erhobenen Hand */
  const hand = [f.z.handL, f.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0];
  const hx = x + hand.x * f.k, hy = y + hand.y * f.k;
  const tw = 0.24 * m;
  let k = `<ellipse cx="${r(hx)}" cy="${r(hy - 0.6)}" rx="${r(tw)}" ry="1.8" fill="${S.lg("tablett", [[0, "#e9eef1"], [1, "#9aa3aa"]])}" stroke="#7d868d" stroke-width=".3"/>`;
  /* halbes Hendl auf dem Teller, Brezn */
  k += `<ellipse cx="${r(hx - 2.4)}" cy="${r(hy - 1.8)}" rx="5.2" ry="1.3" fill="#fbfbf8" stroke="#d6d6d0" stroke-width=".2"/>`;
  k += `<path d="M${r(hx - 6)} ${r(hy - 2)} Q${r(hx - 5.6)} ${r(hy - 6.4)} ${r(hx - 2)} ${r(hy - 6)} Q${r(hx + 1.4)} ${r(hy - 5.4)} ${r(hx + 1)} ${r(hy - 2)} Z" fill="${S.rg("hendl", [[0, "#e8a04a"], [0.6, "#b8641e"], [1, "#7a3a10"]], 0.4, 0.3, 0.8)}"/><path d="M${r(hx - 4.6)} ${r(hy - 5)} q1.6 -.8 3 0" stroke="#fff3c0" stroke-width=".5" opacity=".5" fill="none"/>`;
  k += `<path d="M${r(hx + 1.6)} ${r(hy - 2.2)} C${r(hx + 1)} ${r(hy - 5.6)} ${r(hx + 5)} ${r(hy - 6)} ${r(hx + 4.2)} ${r(hy - 3)} C${r(hx + 7)} ${r(hy - 6)} ${r(hx + 8.6)} ${r(hy - 3)} ${r(hx + 6.6)} ${r(hy - 2)}" stroke="${LAUGE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "bg_tablett_bg", de: "das Tablett", syl: "Ta-BLETT", it: "il vassoio", itSyl: "vas-SO-io", en: "tray", x: r(hx), y: r(hy), kunst: um(hx, hy, k + flaeche(hx - tw - 1, hy - 7, 2 * tw + 2, 9)),
    tipp: "Auf dem Tablett: ein halbes Hendl und eine Brezn." });
}

/* Licht und Schatten des Laubs über allem (fängt nichts ab) */
{
  let v = "";
  for (let i = 0; i < 10; i++) { const x = rnd() * 320, y = 90 + rnd() * 90; v += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(6 + rnd() * 10)}" ry="${r(2 + rnd() * 3)}" fill="#fff6c8" opacity=".12" filter="url(#${S.id("blur")})"/>`; }
  v += `<rect x="0" y="0" width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.7, "#000", 0], [1, "#0a1a08", 0.28]], 0.5, 0.45, 0.75)}"/>`;
  S.davor(v);
}

S.defs = [...new Set(S.defs)];   /* doppelte Verläufe nur einmal */
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/biergarten.js"));
console.log(aus);
