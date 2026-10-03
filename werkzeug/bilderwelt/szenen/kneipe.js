#!/usr/bin/env node
/* =====================================================================
   DIE KNEIPE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Berliner Eckkneipen – tip Berlin „Tresen-Treff“, taz „In der
   Eckkneipe“, Explore Parts Unknown „Eckkneipen“; Rechtslexikon „Kneipe“):
   - Herzstück ist der große TRESEN aus dunklem Holz mit Messing-Fußstange,
     davor BARHOCKER. Auf dem Tresen die ZAPFANLAGE (Schanksäule mit
     Zapfhähnen und Tropfblech), Biergläser auf BIERDECKELN – der Wirt
     macht für jedes Bier einen Strich auf den Deckel, abgerechnet wird
     am Schluss („Zusammen oder getrennt?“).
   - Hinter dem Tresen das FLASCHENREGAL (Rückbuffet) mit Spiegel,
     Schnapsflaschen, Schnapsgläsern, kopfüber gestapelten Pilsgläsern,
     dazu Radio, Wimpel und Pokale.
   - Wände holzgetäfelt, darüber vergilbte Tapete, Emailleschilder,
     Mannschaftsfotos; zwei blau leuchtende SPIELAUTOMATEN (Pflicht-
     Warnhinweis, ab 18), eine DARTSCHEIBE im Schrank mit Kreidetafeln
     (Abwurflinie 2,37 m davor), ein FERNSEHER für die Bundesliga.
   - Der runde STAMMTISCH mit dem schmiedeeisernen STAMMTISCHSCHILD,
     grüne Pendelleuchten aus Messing und Glas, Dielenboden.
   BLICK: Zentralperspektive, Kamera 1,9 m hoch, Fluchtpunkt (150 | 58);
   Rückwand 7 m entfernt (≈ 36 Einheiten je Meter), Tresen 4,4 m
   (≈ 57 je Meter, Tresenhöhe 1,12 m), Barhocker-Sitz 0,78 m,
   Stammtisch 0,76 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kneipe", titel: "Die Kneipe", emoji: "🍺", thema: "Freizeit", kuerzel: "b12a", fassung: 852 });
const rnd = zufall(1987);
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
const VX = 150, HY = 58, E = 1.9, F = 250;
const ms = (Z) => F / Z;
const P = (X, H, Z) => [r(VX + F * X / Z), r(HY + F * (E - H) / Z)];
const ZW = 7, RH = 2.9, XL = -4.2, XR = 4.2;

/* ---------- Grundfarben --------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("blur")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
const HOLZ_D = S.lg("holzd", [[0, "#5a3820"], [0.5, "#4a2c17"], [1, "#3a2210"]]);
const HOLZ_V = S.lg("holzv", [[0, "#3f2512"], [0.35, "#5b371c"], [0.65, "#563319"], [1, "#3a2210"]], 0, 0, 1, 0);
const HOLZ_P = S.lg("holzp", [[0, "#6e4426"], [1, "#4f2f18"]]);
const MESSING = S.lg("messing", [[0, "#f6dd8c"], [0.45, "#c99b3c"], [0.6, "#9c7426"], [1, "#e2bf68"]]);
const MESSING_V = S.lg("messingv", [[0, "#9c7426"], [0.35, "#f3d988"], [0.6, "#c99b3c"], [1, "#8a6420"]], 0, 0, 1, 0);
const CHROM = S.lg("chrom", [[0, "#7d858c"], [0.3, "#f4f6f7"], [0.55, "#b9c0c6"], [1, "#6e767d"]], 0, 0, 1, 0);
const BIER = S.lg("bier", [[0, "#f7c64a"], [0.6, "#e9a524"], [1, "#c97f12"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.5], [0.3, "#e9f3f5", 0.18], [0.7, "#d7e6ea", 0.12], [1, "#ffffff", 0.4]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Holzdecke, Rückwand (Täfelung + vergilbte Tapete), Dielen
   ===================================================================== */
{
  const yW = P(0, RH, ZW)[1], yB = P(0, 0, ZW)[1], yT = P(0, 1.2, ZW)[1];
  let k = `<rect x="0" y="0" width="320" height="${r(yW + 2)}" fill="${S.lg("decke", [[0, "#2e1c0f"], [1, "#4a2f1a"]])}"/>`;
  for (let X = -9; X <= 9; X += 0.6) { const a = P(X, RH, ZW), b = P(X, RH, 2.2); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#24150a" stroke-width=".45" opacity=".8"/>`; }
  for (const Z of [3.6, 4.8, 6.0]) {
    const a = P(-12, RH, Z), b = P(12, RH - 0.2, Z);
    k += `<rect x="0" y="${a[1]}" width="320" height="${r(b[1] - a[1])}" fill="${S.lg("balken", [[0, "#3a2413"], [0.8, "#5a3a20"], [1, "#2a180b"]])}"/>`;
  }
  /* Rückwand: Tapete */
  k += `<rect x="0" y="${yW}" width="300" height="${r(yT - yW)}" fill="${S.lg("tapete", [[0, "#bf9a5c"], [0.5, "#d1b276"], [1, "#c4a265"]])}"/>`;
  S.def(`<pattern id="${S.id("tap")}" width="6" height="8" patternUnits="userSpaceOnUse"><path d="M3 0 q2 2 0 4 q-2 2 0 4" stroke="#8f6c38" stroke-width=".35" fill="none" opacity=".35"/><circle cx="0" cy="4" r=".45" fill="#8f6c38" opacity=".3"/><circle cx="6" cy="4" r=".45" fill="#8f6c38" opacity=".3"/></pattern>`);
  k += `<rect x="0" y="${yW}" width="300" height="${r(yT - yW)}" fill="url(#${S.id("tap")})"/>`;
  /* Rauch- und Lichtschimmer: oben dunkler (alte Kneipe), um die Lampen warm */
  k += `<rect x="0" y="${yW}" width="300" height="${r(yT - yW)}" fill="${S.lg("vergilbt", [[0, "#3b2410", 0.45], [0.5, "#3b2410", 0.08], [1, "#3b2410", 0]])}"/>`;
  k += `<ellipse cx="275" cy="66" rx="40" ry="26" fill="#ffd27a" opacity=".22" filter="url(#${S.id("blur")})"/>`;
  k += `<ellipse cx="62" cy="50" rx="70" ry="22" fill="#ffd27a" opacity=".16" filter="url(#${S.id("blur")})"/>`;
  /* Täfelung mit Kassetten */
  k += `<rect x="0" y="${yT}" width="300" height="${r(yB - yT)}" fill="${HOLZ_D}"/>`;
  for (let X = XL; X < XR - 0.3; X += 0.6) {
    const a = P(X + 0.06, 1.1, ZW), b = P(X + 0.54, 0.12, ZW);
    if (a[0] > 300) break;
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(Math.min(b[0], 299) - a[0])}" height="${r(b[1] - a[1])}" rx=".6" fill="${HOLZ_P}" stroke="#2a180b" stroke-width=".5"/>`;
    k += `<line x1="${r(a[0] + 0.6)}" y1="${r(a[1] + 0.6)}" x2="${r(Math.min(b[0], 299) - 0.6)}" y2="${r(a[1] + 0.6)}" stroke="#a87548" stroke-width=".35" opacity=".6"/>`;
  }
  k += `<rect x="0" y="${r(yT - 1.6)}" width="300" height="2.6" fill="${S.lg("leiste", [[0, "#8a5a32"], [1, "#3e2412"]])}"/>`;
  /* rechte Seitenwand (schmaler Keil) */
  const zr = F * XR / (320 - VX);
  const s1 = P(XR, RH, ZW), s2 = P(XR, RH, zr), s3 = P(XR, 0, zr), s4 = P(XR, 0, ZW), t1 = P(XR, 1.2, ZW), t2 = P(XR, 1.2, zr);
  k += poly([s1, s2, t2, t1], "#a98450") + poly([t1, t2, s3, s4], "#3c2311");
  k += `<path d="M${t1[0]} ${t1[1]} L${t2[0]} ${t2[1]}" stroke="#8a5a32" stroke-width="1.6"/>`;
  k += `<line x1="300" y1="${s1[1]}" x2="300" y2="${s4[1]}" stroke="#2a180b" stroke-width=".6" opacity=".6"/>`;
  /* Dielenboden in Flucht */
  k += `<rect x="0" y="${yB}" width="320" height="${r(200 - yB)}" fill="${S.lg("boden", [[0, "#3a2414"], [0.5, "#5a3a22"], [1, "#6a4428"]])}"/>`;
  for (let X = -10; X <= 10; X += 0.2) { const a = P(X, 0, ZW), b = P(X, 0, 3.1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#24150a" stroke-width=".35" opacity=".7"/>`; }
  for (let i = 0; i < 34; i++) { const X = -9 + Math.floor(rnd() * 90) * 0.2, Z = 3.3 + rnd() * 3.6, a = P(X, 0, Z), b = P(X + 0.2, 0, Z); if (b[0] > 0 && a[0] < 320) k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#24150a" stroke-width=".3" opacity=".7"/>`; }
  k += `<rect x="0" y="${yB}" width="320" height="${r(200 - yB)}" fill="${S.lg("bodenglanz", [[0, "#000", 0.3], [0.35, "#000", 0], [1, "#ffcf7a", 0.08]])}"/>`;
  /* Abwurflinie vor der Dartscheibe: Messingleiste im Boden, 2,37 m */
  { const a = P(1.55, 0, ZW - 2.37), b = P(2.15, 0, ZW - 2.37); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#d7b45c" stroke-width="1.1" stroke-linecap="round"/>`; }
  /* Fotos und Emailleschild an der Wand über dem Stammtisch */
  {
    const a = P(2.3, 2.62, ZW), b = P(3.1, 2.12, ZW);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx="1.6" fill="${S.lg("emaille", [[0, "#1f4c8f"], [1, "#163a6e"]])}" stroke="#e8e2d0" stroke-width=".9"/>`;
    k += `<text x="${r((a[0] + b[0]) / 2)}" y="${r(a[1] + 8.4)}" font-size="7.4" text-anchor="middle" fill="#f3e9cc" font-family="Georgia,serif" font-weight="bold" letter-spacing=".8">PILS</text>`;
    k += `<text x="${r((a[0] + b[0]) / 2)}" y="${r(a[1] + 13.6)}" font-size="2.6" text-anchor="middle" fill="#f3e9cc" font-family="Georgia,serif" letter-spacing=".4">VOM FASS · SEIT 1952</text>`;
    k += `<circle cx="${r(a[0] + 2)}" cy="${r(a[1] + 2)}" r=".5" fill="#c9c2b0"/><circle cx="${r(b[0] - 2)}" cy="${r(a[1] + 2)}" r=".5" fill="#c9c2b0"/>`;
    const c = P(3.3, 2.55, ZW), d = P(4.0, 2.05, ZW);
    k += `<rect x="${c[0]}" y="${c[1]}" width="${r(d[0] - c[0])}" height="${r(d[1] - c[1])}" fill="#2b1a0d"/><rect x="${r(c[0] + 1.3)}" y="${r(c[1] + 1.3)}" width="${r(d[0] - c[0] - 2.6)}" height="${r(d[1] - c[1] - 2.6)}" fill="${S.lg("foto", [[0, "#cdbf9c"], [1, "#9a8a68"]])}"/>`;
    for (let i = 0; i < 6; i++) k += `<circle cx="${r(c[0] + 4 + i * 3.3)}" cy="${r(c[1] + 7)}" r="1" fill="#5a4a34"/><rect x="${r(c[0] + 3.1 + i * 3.3)}" y="${r(c[1] + 8)}" width="1.8" height="4" fill="${i % 2 ? "#3a5a8a" : "#4a6a9a"}"/>`;
    /* Stuhllehne hinter dem Stammgast (der Stuhl ist hinter ihm, nicht antippbar) */
    const l = P(2.62, 0.95, 6.45), l2 = P(3.0, 0.95, 6.45), l3 = P(2.62, 0.45, 6.45);
    k += `<rect x="${l[0]}" y="${l[1]}" width="${r(l2[0] - l[0])}" height="${r(l3[1] - l[1])}" rx="1" fill="${HOLZ_V}"/>`;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DER FERNSEHER (Wandarm über dem Spielautomaten)
   ===================================================================== */
{
  const Z = 6.9, a = P(0.35, 2.72, Z), b = P(1.35, 2.15, Z), w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${r(a[0] + w / 2 - 2)}" y="${r(a[1] + h / 2 - 2)}" width="4" height="4" fill="#222"/>`;
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx=".8" fill="#141618"/>`;
  const ix = a[0] + 1, iy = a[1] + 1, iw = w - 2, ih = h - 2.4;
  k += `<rect x="${r(ix)}" y="${r(iy)}" width="${r(iw)}" height="${r(ih)}" fill="${S.lg("rasen", [[0, "#3f8a3a"], [1, "#2d6e2b"]])}"/>`;
  for (let i = 1; i < 6; i++) k += `<rect x="${r(ix + i * iw / 6)}" y="${r(iy)}" width="${r(iw / 12)}" height="${r(ih)}" fill="#4a9a44" opacity=".35"/>`;
  k += `<line x1="${r(ix + iw / 2)}" y1="${r(iy)}" x2="${r(ix + iw / 2)}" y2="${r(iy + ih)}" stroke="#e8f2e4" stroke-width=".3"/><ellipse cx="${r(ix + iw / 2)}" cy="${r(iy + ih * 0.55)}" rx="4" ry="2.2" fill="none" stroke="#e8f2e4" stroke-width=".3"/>`;
  for (const [dx, dy, c] of [[0.3, 0.5, "#d33"], [0.42, 0.7, "#d33"], [0.6, 0.45, "#fff"], [0.7, 0.62, "#fff"], [0.52, 0.35, "#d33"]]) k += `<rect x="${r(ix + iw * dx)}" y="${r(iy + ih * dy - 1)}" width=".8" height="1.6" fill="${c}"/>`;
  k += `<rect x="${r(ix + 1)}" y="${r(iy + 1)}" width="13" height="2.6" fill="#101820" opacity=".85"/><text x="${r(ix + 7.5)}" y="${r(iy + 3)}" font-size="1.9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">HEIM 1:0 GAST</text>`;
  k += `<path d="M${r(ix)} ${r(iy)} L${r(ix + iw * 0.35)} ${r(iy)} L${r(ix)} ${r(iy + ih * 0.8)} Z" fill="#fff" opacity=".08"/>`;
  k += `<rect x="${r(a[0] + w / 2 - 3)}" y="${r(b[1] - 1.1)}" width="6" height=".6" fill="#444"/>`;
  S.teil({ id: "fernseher", de: "der Fernseher", syl: "FERN-se-her", it: "il televisore", itSyl: "te-le-vi-SO-re", en: "TV", x: r(a[0] + w / 2), y: b[1], kunst: um(a[0] + w / 2, b[1], k),
    tipp: "Am Samstag läuft hier die Bundesliga – dann ist die Kneipe voll." });
}

/* =====================================================================
   2 — DAS FLASCHENREGAL (Rückbuffet mit Spiegel) — Lupe
   ===================================================================== */
const REG = { x0: 2, x1: 124 };
{
  const yS = (H) => P(0, H, ZW)[1];
  const x0 = REG.x0, x1 = REG.x1, W = x1 - x0;
  let k = "";
  /* Unterschrank (Kühlung, Spüle) — meist hinter dem Tresen verborgen */
  k += `<rect x="${x0}" y="${yS(1.0)}" width="${W}" height="${r(yS(0) - yS(1.0))}" fill="${HOLZ_D}"/><rect x="${x0}" y="${r(yS(1.0) - 1)}" width="${W}" height="2" fill="#6e4426"/>`;
  /* Aufsatz: Spiegel, Säulen, Krone mit Namen */
  const yo = yS(2.5), yu = yS(1.25);
  k += `<rect x="${x0}" y="${r(yo)}" width="${W}" height="${r(yS(1.0) - yo)}" fill="${S.lg("spiegel", [[0, "#5d6a6c"], [0.5, "#7d8b8a"], [1, "#4f5a5b"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M${x0 + 8} ${r(yo)} L${x0 + 26} ${r(yo)} L${x0 + 6} ${r(yS(1.0))} L${x0} ${r(yS(1.0))} L${x0} ${r(yo + 10)} Z" fill="#fff" opacity=".1"/><path d="M${x0 + 64} ${r(yo)} L${x0 + 72} ${r(yo)} L${x0 + 52} ${r(yS(1.0))} L${x0 + 46} ${r(yS(1.0))} Z" fill="#fff" opacity=".07"/>`;
  const krone0 = yS(2.72);
  k += `<path d="M${x0 - 1.5} ${r(yo)} L${x0 - 1.5} ${r(krone0 + 2)} Q${(x0 + x1) / 2} ${r(krone0 - 4)} ${x1 + 1.5} ${r(krone0 + 2)} L${x1 + 1.5} ${r(yo)} Z" fill="${HOLZ_V}"/>`;
  k += `<rect x="${x0 - 2}" y="${r(yo - 1.6)}" width="${W + 4}" height="2.4" fill="#6e4426"/>`;
  k += `<text x="${(x0 + x1) / 2}" y="${r(yo - 3)}" font-size="5.6" text-anchor="middle" fill="${MESSING}" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-weight="bold" letter-spacing=".5">Zur Linde</text>`;
  const sp = [x0, x0 + W / 3, x0 + 2 * W / 3, x1];
  for (const x of sp) k += `<rect x="${r(x - 1.3)}" y="${r(yo)}" width="2.6" height="${r(yS(1.0) - yo)}" fill="${HOLZ_V}"/><rect x="${r(x - 1.6)}" y="${r(yo + 1)}" width="3.2" height="1.2" fill="#8a5a32"/>`;
  const boeden = [2.12, 1.72, 1.3].map(yS);
  for (const y of boeden) k += `<rect x="${x0}" y="${r(y)}" width="${W}" height="1.2" fill="#cfe2e4" opacity=".75"/><rect x="${x0}" y="${r(y + 1.2)}" width="${W}" height=".5" fill="#2b3a3c" opacity=".5"/>`;
  /* Lichtleiste oben */
  k += `<rect x="${x0}" y="${r(yo)}" width="${W}" height="6" fill="${S.lg("regallicht", [[0, "#ffe2a0", 0.55], [1, "#ffe2a0", 0]])}"/>`;
  const bay = (i) => [sp[i] + 1.6, sp[i + 1] - 1.6];
  const flasche = (x, y, h, w, farbe, etikett, hals = 0.42, kapsel = "#c9a14a") => {
    const hh = h * hals, bw = w / 2;
    let g = `<path d="M${r(x - bw)} ${r(y)} L${r(x - bw)} ${r(y - h + hh + 1.4)} Q${r(x - bw)} ${r(y - h + hh)} ${r(x - bw * 0.36)} ${r(y - h + hh - 1)} L${r(x - bw * 0.36)} ${r(y - h)} L${r(x + bw * 0.36)} ${r(y - h)} L${r(x + bw * 0.36)} ${r(y - h + hh - 1)} Q${r(x + bw)} ${r(y - h + hh)} ${r(x + bw)} ${r(y - h + hh + 1.4)} L${r(x + bw)} ${r(y)} Z" fill="${farbe}"/>`;
    g += `<rect x="${r(x - bw * 0.4)}" y="${r(y - h)}" width="${r(bw * 0.8)}" height="1.2" fill="${kapsel}"/>`;
    if (etikett) g += `<rect x="${r(x - bw + 0.3)}" y="${r(y - h * 0.48)}" width="${r(w - 0.6)}" height="${r(h * 0.26)}" fill="${etikett}"/>`;
    g += `<rect x="${r(x - bw + 0.4)}" y="${r(y - h + hh + 1)}" width=".5" height="${r(h - hh - 1.6)}" fill="#fff" opacity=".45"/>`;
    return g;
  };
  const unter = [];
  const fl = (X0, X1, y0, y1) => flaeche(X0, y0, X1 - X0, y1 - y0);
  const add = (u, X0, X1, y0, y1) => unter.push(Object.assign(u, { x: (X0 + X1) / 2, y: y1, kunst: um((X0 + X1) / 2, y1, fl(X0, X1, y0, y1)) }));
  /* oben, Fach 1: Schnapsflaschen (Korn klar, Kräuter grün, Obstler) */
  { const [a, b] = bay(0); const y = boeden[0];
    const farben = ["#e9f1ef", "#1f4a2a", "#e9f1ef", "#7a3b12", "#e9f1ef", "#1f4a2a", "#d9e6e4"];
    farben.forEach((f, i) => { k += flasche(a + 3 + i * ((b - a - 6) / 6), y, 11 + (i % 2) * 1.5, 4, f === "#e9f1ef" || f === "#d9e6e4" ? S.lg("klar", [[0, "#cfe0de"], [0.5, "#f7fbfa"], [1, "#bcd0ce"]], 0, 0, 1, 0) : f, i % 2 ? "#e4c46a" : "#f5f1e6", 0.45, i % 3 ? "#b23a2a" : "#c9a14a"); });
    add({ id: "kn_schnapsflasche", de: "die Schnapsflasche", syl: "SCHNAPS-fla-sche", it: "la bottiglia di grappa", itSyl: "bot-TI-glia di GRAP-pa", en: "liquor bottle", tipp: "Korn, Kräuter, Obstler – der Schnaps kommt in kleinen Gläsern." }, a, b, y - 14, y); }
  /* oben, Fach 2: Weinflaschen */
  { const [a, b] = bay(1); const y = boeden[0];
    for (let i = 0; i < 6; i++) k += flasche(a + 3.2 + i * ((b - a - 6.4) / 5), y, 12.5, 3.8, i % 3 === 2 ? "#5a1420" : "#1f3a22", i % 2 ? "#efe6cf" : "#e9d9a8", 0.36, i % 2 ? "#7a1420" : "#2a2a2a");
    add({ id: "kn_weinflasche", de: "die Weinflasche", syl: "WEIN-fla-sche", it: "la bottiglia di vino", itSyl: "bot-TI-glia di VI-no", en: "wine bottle" }, a, b, y - 14, y); }
  /* oben, Fach 3: Röhrenradio und Whisky */
  { const [a, b] = bay(2); const y = boeden[0];
    const rx = a + 2, rw = 22, rh = 11;
    k += `<rect x="${r(rx)}" y="${r(y - rh)}" width="${rw}" height="${rh}" rx="2" fill="${S.lg("radio", [[0, "#8a5a30"], [1, "#5c3a1c"]])}"/>`;
    k += `<rect x="${r(rx + 1.4)}" y="${r(y - rh + 1.4)}" width="10" height="7" rx="1" fill="#d9c79c"/>`;
    for (let i = 0; i < 6; i++) k += `<line x1="${r(rx + 2)}" y1="${r(y - rh + 2.6 + i * 1)}" x2="${r(rx + 10.8)}" y2="${r(y - rh + 2.6 + i * 1)}" stroke="#8a7650" stroke-width=".3"/>`;
    k += `<rect x="${r(rx + 12.6)}" y="${r(y - rh + 1.6)}" width="8" height="3" rx=".5" fill="#f3e7c0"/><line x1="${r(rx + 15)}" y1="${r(y - rh + 1.8)}" x2="${r(rx + 15)}" y2="${r(y - rh + 4.4)}" stroke="#c33" stroke-width=".3"/>`;
    k += `<circle cx="${r(rx + 14.4)}" cy="${r(y - 3.2)}" r="1.4" fill="#e8dcc0"/><circle cx="${r(rx + 18.6)}" cy="${r(y - 3.2)}" r="1.4" fill="#e8dcc0"/><rect x="${r(rx + 2)}" y="${r(y - 2.4)}" width="9" height="1.2" fill="#f0e2bc"/>`;
    k += flasche(b - 7, y, 11, 4.4, S.lg("whisky", [[0, "#9a5a18"], [0.5, "#d18a2a"], [1, "#8a4c12"]], 0, 0, 1, 0), "#1e1e1e", 0.4);
    k += flasche(b - 2.6, y, 10, 3.6, "#d9e6e4", "#f2e2b0", 0.42);
    add({ id: "kn_radio", de: "das Radio", syl: "RA-di-o", it: "la radio", itSyl: "RA-dio", en: "radio" }, a, a + 25, y - 12.5, y); }
  /* Mitte, Fach 1: Pilsgläser kopfüber */
  { const [a, b] = bay(0); const y = boeden[1];
    for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) {
      const x = a + 3.4 + i * 5.6 + row * 2.6, yy = y - row * 0.9;
      if (x > b - 2) continue;
      k += `<path d="M${r(x - 1.9)} ${r(yy)} L${r(x + 1.9)} ${r(yy)} L${r(x + 1.5)} ${r(yy - 4.2)} Q${r(x + 2.2)} ${r(yy - 7)} ${r(x + 0.4)} ${r(yy - 8.6)} L${r(x + 0.4)} ${r(yy - 10)} L${r(x + 1.4)} ${r(yy - 10.4)} L${r(x - 1.4)} ${r(yy - 10.4)} L${r(x - 0.4)} ${r(yy - 10)} L${r(x - 0.4)} ${r(yy - 8.6)} Q${r(x - 2.2)} ${r(yy - 7)} ${r(x - 1.5)} ${r(yy - 4.2)} Z" fill="${GLAS}" stroke="#e8f2f4" stroke-width=".25"/>`;
    }
    add({ id: "kn_bierglas", de: "das Bierglas", syl: "BIER-glas", it: "il bicchiere da birra", itSyl: "bic-CHIE-re da BIR-ra", en: "beer glass", tipp: "Die Pilsgläser stehen kopfüber – so bleibt kein Staub darin." }, a, b, y - 11, y); }
  /* Mitte, Fach 2: Schnapsgläser (Stamperl) in Reihen */
  { const [a, b] = bay(1); const y = boeden[1];
    for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
      const x = a + 2.8 + i * 4.2 + (row % 2) * 1.6, yy = y - row * 1.1;
      if (x > b - 2) continue;
      k += `<path d="M${r(x - 1.2)} ${r(yy - 3.6)} L${r(x + 1.2)} ${r(yy - 3.6)} L${r(x + 0.9)} ${r(yy)} L${r(x - 0.9)} ${r(yy)} Z" fill="${GLAS}" stroke="#eef6f7" stroke-width=".22"/><rect x="${r(x - 0.9)}" y="${r(yy - 0.8)}" width="1.8" height=".8" fill="#dfeeee" opacity=".7"/>`;
    }
    add({ id: "kn_schnapsglas", de: "das Schnapsglas", syl: "SCHNAPS-glas", it: "il bicchierino", itSyl: "bic-chie-RI-no", en: "shot glass" }, a, b, y - 7, y); }
  /* Mitte, Fach 3: Wimpel und Dartpokal */
  { const [a, b] = bay(2); const y = boeden[1];
    const wx = a + 4;
    k += `<line x1="${r(wx - 1)}" y1="${r(boeden[0] + 2)}" x2="${r(wx + 13)}" y2="${r(boeden[0] + 2)}" stroke="#2a2a2a" stroke-width=".4"/>`;
    k += `<path d="M${r(wx)} ${r(boeden[0] + 2)} L${r(wx + 12)} ${r(boeden[0] + 2)} L${r(wx + 6)} ${r(y - 1.5)} Z" fill="${S.lg("wimpel", [[0, "#c8202a"], [1, "#9a1620"]])}"/>`;
    k += `<path d="M${r(wx + 1.6)} ${r(boeden[0] + 4.2)} L${r(wx + 10.4)} ${r(boeden[0] + 4.2)}" stroke="#fff" stroke-width=".9"/><circle cx="${r(wx + 6)}" cy="${r(boeden[0] + 7.4)}" r="1.8" fill="#fff"/><circle cx="${r(wx + 6)}" cy="${r(boeden[0] + 7.4)}" r="1" fill="#c8202a"/>`;
    k += `<path d="M${r(wx)} ${r(boeden[0] + 2)} q-1 .8 -.4 1.8 M${r(wx + 12)} ${r(boeden[0] + 2)} q1 .8 .4 1.8" stroke="#e4c46a" stroke-width=".4" fill="none"/>`;
    /* Pokal */
    const px = b - 8;
    k += `<rect x="${r(px - 3)}" y="${r(y - 2)}" width="6" height="2" fill="#2a2a2a"/><rect x="${r(px - 0.6)}" y="${r(y - 5)}" width="1.2" height="3" fill="${MESSING_V}"/><path d="M${r(px - 3)} ${r(y - 10)} L${r(px + 3)} ${r(y - 10)} Q${r(px + 2.6)} ${r(y - 5)} ${r(px)} ${r(y - 4.8)} Q${r(px - 2.6)} ${r(y - 5)} ${r(px - 3)} ${r(y - 10)} Z" fill="${MESSING_V}"/><path d="M${r(px - 3)} ${r(y - 9)} q-2 .6 -.4 2.8 M${r(px + 3)} ${r(y - 9)} q2 .6 .4 2.8" stroke="#c99b3c" stroke-width=".5" fill="none"/>`;
    add({ id: "kn_wimpel", de: "der Wimpel", syl: "WIM-pel", it: "il gagliardetto", itSyl: "ga-gliar-DET-to", en: "pennant", tipp: "Der Wimpel vom Fußballverein – die Kneipe ist das Vereinslokal." }, wx - 1, wx + 13, boeden[0] + 1.5, y - 1); }
  /* unten: Liköre und Saftflaschen (nicht einzeln) */
  { const y = boeden[2];
    const farben = ["#7a1c2c", "#e2b83a", "#2a6a3a", "#d9e6e4", "#a8501a", "#3a2a6a", "#e9f1ef", "#7a1c2c", "#c86a1a", "#2a6a3a", "#d9e6e4", "#5a3a1a", "#e2b83a", "#7a1c2c", "#d9e6e4", "#3a6a8a", "#a8501a", "#e9f1ef", "#2a6a3a", "#7a1c2c"];
    farben.forEach((f, i) => { const x = x0 + 4 + i * 8.4; if (x < x1 - 3) k += flasche(x, y, 10 + (i * 7 % 3), 3.8, f, i % 2 ? "#f5f1e6" : "#e4c46a", 0.42); }); }
  S.teil({ id: "kn_regal", de: "das Flaschenregal", syl: "FLA-schen-re-gal", it: "lo scaffale", itSyl: "scaf-FA-le", en: "back bar", x: (x0 + x1) / 2, y: yS(0), steht: true,
    kunst: um((x0 + x1) / 2, yS(0), k),
    zoom: { x: 0, y: 26, w: 128, h: 85 },
    unter,
    tipp: "Hinter dem Tresen stehen die Flaschen für die kurzen Getränke." });
}

/* =====================================================================
   3 — DER SPIELAUTOMAT (Geldspielgerät an der Wand)
   ===================================================================== */
{
  const Z = 6.72, a = P(0.42, 2.0, Z), b = P(1.12, 1.15, Z), w = b[0] - a[0], h = b[1] - a[1], cx = a[0] + w / 2;
  let k = `<rect x="${r(a[0] - 1.2)}" y="${r(a[1] + 0.6)}" width="1.4" height="${r(h - 1)}" fill="#14101e"/>`;
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx="1.4" fill="${S.lg("gsg", [[0, "#2a2140"], [0.5, "#1b1530"], [1, "#120e20"]], 0, 0, 1, 0)}"/>`;
  /* Kopf mit Leuchtschrift */
  k += `<rect x="${r(a[0] + 1)}" y="${r(a[1] + 1)}" width="${r(w - 2)}" height="5" rx="1" fill="${S.lg("gsgkopf", [[0, "#6a5cff"], [0.5, "#33c7ff"], [1, "#7a3cff"]], 0, 0, 1, 0)}"/>`;
  k += `<text x="${r(cx)}" y="${r(a[1] + 4.8)}" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="bold" font-style="italic">Super 7</text>`;
  /* oberer Bildschirm: Walzen */
  const sx = a[0] + 2, sw = w - 4;
  k += `<rect x="${r(sx)}" y="${r(a[1] + 7.2)}" width="${r(sw)}" height="8" rx=".6" fill="#0a1a3a"/>`;
  const sym = ["7", "🍒", "🔔"];
  for (let i = 0; i < 3; i++) {
    const zx = sx + 0.8 + i * (sw - 1.6) / 3;
    k += `<rect x="${r(zx)}" y="${r(a[1] + 7.8)}" width="${r((sw - 1.6) / 3 - 0.6)}" height="6.8" rx=".4" fill="${S.lg("walze", [[0, "#9aa4b0"], [0.5, "#ffffff"], [1, "#9aa4b0"]])}"/>`;
    const mx = zx + ((sw - 1.6) / 3 - 0.6) / 2;
    if (i === 0) k += `<text x="${r(mx)}" y="${r(a[1] + 13)}" font-size="5" text-anchor="middle" fill="#d0102a" font-family="Arial Black,Arial" font-weight="bold">7</text>`;
    if (i === 1) k += `<circle cx="${r(mx - 1)}" cy="${r(a[1] + 12)}" r="1.2" fill="#c8102a"/><circle cx="${r(mx + 1.1)}" cy="${r(a[1] + 12.3)}" r="1.2" fill="#c8102a"/><path d="M${r(mx - 1)} ${r(a[1] + 10.8)} Q${r(mx)} ${r(a[1] + 8.8)} ${r(mx + 1.4)} ${r(a[1] + 9.2)} M${r(mx + 1.1)} ${r(a[1] + 11.1)} Q${r(mx + 1.2)} ${r(a[1] + 9.6)} ${r(mx + 1.4)} ${r(a[1] + 9.2)}" stroke="#2a7a2a" stroke-width=".35" fill="none"/>`;
    if (i === 2) k += `<path d="M${r(mx - 1.8)} ${r(a[1] + 12.6)} Q${r(mx - 1.6)} ${r(a[1] + 9)} ${r(mx)} ${r(a[1] + 9)} Q${r(mx + 1.6)} ${r(a[1] + 9)} ${r(mx + 1.8)} ${r(a[1] + 12.6)} Z" fill="#f2c230"/><circle cx="${r(mx)}" cy="${r(a[1] + 13)}" r=".5" fill="#c9961a"/>`;
  }
  /* unterer Bildschirm: Punkte, Risiko-Leiter */
  k += `<rect x="${r(sx)}" y="${r(a[1] + 16.4)}" width="${r(sw)}" height="6" rx=".6" fill="#100828"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(sx + 1 + i * (sw - 2) / 5)}" y="${r(a[1] + 17.2)}" width="${r((sw - 2) / 5 - 0.6)}" height="1.4" rx=".3" fill="${["#ff3a6a", "#ffb02a", "#4ad0ff", "#9aff4a", "#c86aff"][i]}"/>`;
  k += `<text x="${r(cx)}" y="${r(a[1] + 21.6)}" font-size="2.2" text-anchor="middle" fill="#7cf5ff" font-family="monospace">PUNKTE 1200</text>`;
  /* Tasten, Münzeinwurf, Ausgabeschale */
  for (let i = 0; i < 4; i++) k += `<rect x="${r(sx + 0.6 + i * (sw - 1.2) / 4)}" y="${r(a[1] + 23.4)}" width="${r((sw - 1.2) / 4 - 0.8)}" height="1.8" rx=".5" fill="${["#ffcf3a", "#ff4a4a", "#4aff7a", "#4ab0ff"][i]}"/>`;
  k += `<rect x="${r(sx + 1)}" y="${r(a[1] + 26)}" width="3" height="1.4" rx=".3" fill="#888"/><rect x="${r(sx + 2.2)}" y="${r(a[1] + 26.3)}" width=".5" height=".8" fill="#111"/>`;
  k += `<rect x="${r(sx + sw - 9)}" y="${r(a[1] + 26)}" width="8" height="1.4" rx=".3" fill="#333"/>`;
  k += `<rect x="${r(sx + 2)}" y="${r(b[1] - 2.6)}" width="${r(sw - 4)}" height="2" rx=".8" fill="${CHROM}"/>`;
  /* Pflicht-Aufkleber */
  k += `<rect x="${r(sx + 4.5)}" y="${r(a[1] + 25.9)}" width="6" height="1.6" fill="#fff"/><text x="${r(sx + 7.5)}" y="${r(a[1] + 27.1)}" font-size="1.1" text-anchor="middle" fill="#c00" font-family="Arial" font-weight="bold">ab 18</text>`;
  k += `<path d="M${r(a[0] + 0.6)} ${r(a[1] + 1)} L${r(a[0] + 3)} ${r(a[1] + 1)} L${r(a[0] + 0.6)} ${r(b[1] - 3)} Z" fill="#fff" opacity=".08"/>`;
  /* blaues Leuchten auf der Wand */
  const glow = `<ellipse cx="${r(cx)}" cy="${r(a[1] + h / 2)}" rx="${r(w * 0.9)}" ry="${r(h * 0.7)}" fill="#5a7aff" opacity=".22" filter="url(#${S.id("blur")})"/>`;
  S.hinten(glow);
  S.teil({ id: "kn_spielautomat", de: "der Spielautomat", syl: "SPIEL-au-to-mat", it: "la macchinetta", itSyl: "mac-chi-NET-ta", en: "slot machine", x: r(cx), y: b[1], kunst: um(cx, b[1], k),
    tipp: "Spielen erst ab 18 – auf jedem Gerät steht: Glücksspiel kann süchtig machen." });
}

/* =====================================================================
   4 — DIE DARTSCHEIBE im Schrank mit Kreidetafeln, 5 — DIE DARTPFEILE
   ===================================================================== */
const DART = (() => { const Z = 6.95, c = P(1.85, 1.73, Z); return { Z, cx: c[0], cy: c[1], m: ms(Z) }; })();
{
  const { cx, cy, m } = DART;
  const hw = 0.31 * m, hh = 0.38 * m;
  let k = schatten(cx, cy + hh + 0.6, hw * 1.2, 1, 0.18);
  /* offene Türen (schräg, mit Kreidetafel innen) */
  for (const s of [-1, 1]) {
    const x1 = cx + s * hw, x2 = cx + s * (hw + 9.5);
    k += `<path d="M${r(x1)} ${r(cy - hh)} L${r(x2)} ${r(cy - hh - 1.6)} L${r(x2)} ${r(cy + hh + 1.6)} L${r(x1)} ${r(cy + hh)} Z" fill="${HOLZ_V}"/>`;
    const i1 = x1 + s * 1.1, i2 = x2 - s * 1.1;
    k += `<path d="M${r(i1)} ${r(cy - hh + 1.4)} L${r(i2)} ${r(cy - hh - 0.2)} L${r(i2)} ${r(cy + hh + 0.2)} L${r(i1)} ${r(cy + hh - 1.4)} Z" fill="#26302b"/>`;
    const tx = (i1 + i2) / 2;
    k += `<text x="${r(tx)}" y="${r(cy - hh + 4.6)}" font-size="2.2" text-anchor="middle" fill="#f1eee2" font-family="'Comic Sans MS','Segoe Print',cursive">${s < 0 ? "Uwe" : "Gabi"}</text>`;
    const zahlen = s < 0 ? ["501", "441", "380", "321"] : ["501", "457", "397", "300"];
    zahlen.forEach((z, i) => { k += `<text x="${r(tx)}" y="${r(cy - hh + 8.4 + i * 3.6)}" font-size="2.3" text-anchor="middle" fill="#e9e5d6" font-family="'Comic Sans MS','Segoe Print',cursive" opacity=".9">${z}</text>`; if (i < 3) k += `<line x1="${r(tx - 2.6)}" y1="${r(cy - hh + 7.6 + i * 3.6)}" x2="${r(tx + 2.6)}" y2="${r(cy - hh + 7.6 + i * 3.6)}" stroke="#e9e5d6" stroke-width=".25" opacity=".8"/>`; });
  }
  /* Korpus */
  k += `<rect x="${r(cx - hw)}" y="${r(cy - hh)}" width="${r(2 * hw)}" height="${r(2 * hh)}" rx=".8" fill="${HOLZ_V}"/>`;
  k += `<rect x="${r(cx - hw + 1.2)}" y="${r(cy - hh + 1.2)}" width="${r(2 * hw - 2.4)}" height="${r(2 * hh - 2.4)}" fill="#1c1410"/>`;
  /* Scheibe: Sisal, 20 Segmente, Doppel- und Dreifachring */
  const R = 0.225 * m;
  k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R + 1.2)}" fill="#141414"/>`;
  /* 20 Segmente als gestrichelte Ringe (spart hunderte Pfade) */
  const ring = (r0, r1, hell, dunkel) => {
    const rr = (r0 + r1) / 2, C = 2 * Math.PI * rr, d = C / 20;
    return `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="none" stroke="${hell}" stroke-width="${r(r1 - r0)}"/>` +
      `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="none" stroke="${dunkel}" stroke-width="${r(r1 - r0)}" stroke-dasharray="${d.toFixed(3)} ${d.toFixed(3)}" transform="rotate(-99 ${r(cx)} ${r(cy)})"/>`;
  };
  k += ring(R * 0.1, R * 0.58, "#efe3c4", "#1b1b1b") + ring(R * 0.58, R * 0.64, "#1f8a3a", "#c8202a") + ring(R * 0.64, R * 0.94, "#efe3c4", "#1b1b1b") + ring(R * 0.94, R, "#1f8a3a", "#c8202a");
  for (let i = 0; i < 20; i++) { const a = (i + 0.5) * Math.PI / 10; k += `<line x1="${r(cx + Math.sin(a) * R * 0.1)}" y1="${r(cy - Math.cos(a) * R * 0.1)}" x2="${r(cx + Math.sin(a) * R)}" y2="${r(cy - Math.cos(a) * R)}" stroke="#c9c9c9" stroke-width=".12"/>`; }
  k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.1)}" fill="#1f8a3a"/><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.04)}" fill="#c8202a"/>`;
  const nums = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  nums.forEach((n, i) => { const a = i * Math.PI / 10; k += `<text x="${r(cx + Math.sin(a) * (R + 0.75))}" y="${r(cy - Math.cos(a) * (R + 0.75) + 0.45)}" font-size="1.1" text-anchor="middle" fill="#fff" font-family="Arial">${n}</text>`; });
  k += `<circle cx="${r(cx - R * 0.3)}" cy="${r(cy - R * 0.35)}" r="${r(R * 0.6)}" fill="#fff" opacity=".05"/>`;
  S.teil({ id: "kn_dartscheibe", de: "die Dartscheibe", syl: "DART-schei-be", it: "il bersaglio", itSyl: "ber-SA-glio", en: "dartboard", x: r(cx), y: r(cy + hh), kunst: um(cx, cy + hh, k),
    tipp: "Drei Pfeile pro Wurf. Die Mitte zählt am meisten." });
}
{
  const { cx, cy, m } = DART, R = 0.225 * m;
  let k = "";
  for (const [a, rr] of [[0.05, 0.62], [-0.2, 0.75], [0.55, 0.3]]) {
    const x = cx + Math.sin(a) * R * rr, y = cy - Math.cos(a) * R * rr;
    /* Pfeil steckt in der Scheibe; man sieht ihn leicht von links */
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x - 2.2)}" y2="${r(y + 0.6)}" stroke="${CHROM}" stroke-width=".55" stroke-linecap="round"/>`;
    k += `<line x1="${r(x - 2.2)}" y1="${r(y + 0.6)}" x2="${r(x - 3.2)}" y2="${r(y + 0.9)}" stroke="#222" stroke-width=".4"/>`;
    k += `<path d="M${r(x - 3)} ${r(y + 0.85)} L${r(x - 4.6)} ${r(y - 0.9)} L${r(x - 5)} ${r(y + 1.3)} Z" fill="#e8302a"/><path d="M${r(x - 3)} ${r(y + 0.85)} L${r(x - 4.4)} ${r(y + 2.6)} L${r(x - 5)} ${r(y + 1.3)} Z" fill="#b51f1a"/>`;
  }
  S.teil({ oben: true, id: "kn_dartpfeil", de: "der Dartpfeil", syl: "DART-pfeil", it: "la freccetta", itSyl: "frec-CET-ta", en: "dart", x: r(cx), y: r(cy), kunst: um(cx, cy, k + flaeche(cx - 7, cy - 6, 11, 9)) });
}

/* =====================================================================
   6 — DIE LAMPEN (grüne Kneipenleuchten aus Glas und Messing)
   ===================================================================== */
const LAMPEN = [[-2.04, 4.75, 2.05], [-1.27, 4.75, 2.05], [2.8, 5.6, 1.8]];
{
  let k = "", cxs = [];
  for (const [X, Z, H] of LAMPEN) {
    const m = ms(Z), [x, y] = P(X, H, Z), dy = P(X, RH, Z)[1], w = 0.17 * m, h = 0.2 * m;
    k += `<line x1="${x}" y1="${r(Math.max(0, dy))}" x2="${x}" y2="${r(y - h)}" stroke="#2a2016" stroke-width=".5"/>`;
    k += `<rect x="${r(x - 1)}" y="${r(y - h - 1.4)}" width="2" height="1.8" rx=".4" fill="${MESSING}"/>`;
    k += `<path d="M${r(x - w)} ${r(y)} Q${r(x - w)} ${r(y - h * 0.8)} ${r(x)} ${r(y - h)} Q${r(x + w)} ${r(y - h * 0.8)} ${r(x + w)} ${r(y)} Z" fill="${S.lg("schirm", [[0, "#2f6a3a"], [0.45, "#4f9a5a"], [1, "#1f4a28"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(x - w * 0.55)} ${r(y - h * 0.55)} Q${r(x - w * 0.3)} ${r(y - h * 0.9)} ${r(x)} ${r(y - h * 0.95)}" stroke="#bfe8c4" stroke-width=".5" opacity=".6" fill="none"/>`;
    k += `<rect x="${r(x - w - 0.3)}" y="${r(y - 0.6)}" width="${r(2 * w + 0.6)}" height="1.1" rx=".5" fill="${MESSING}"/>`;
    k += `<ellipse cx="${x}" cy="${r(y + 0.8)}" rx="${r(w * 0.7)}" ry="1" fill="#fff3c4"/>`;
    cxs.push([x, y, w]);
  }
  const mitte = cxs[0][0] + (cxs[2][0] - cxs[0][0]) / 2, unten = Math.max(...cxs.map((c) => c[1]));
  S.teil({ id: "kn_lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: r(mitte), y: r(unten), kunst: um(mitte, unten, k) });
  /* warme Lichtkegel (fangen nichts ab) */
  let v = "";
  for (const [x, y, w] of cxs) v += `<path d="M${r(x - w)} ${r(y + 0.5)} L${r(x - w * 3.6)} ${r(y + 46)} L${r(x + w * 3.6)} ${r(y + 46)} L${r(x + w)} ${r(y + 0.5)} Z" fill="${S.lg("kegel", [[0, "#ffe7a8", 0.26], [1, "#ffe7a8", 0]])}"/>`;
  S.davor(v);
}

/* =====================================================================
   7 — DER WIRT hinter dem Tresen (zapft gerade)
   ===================================================================== */
const TRESEN = { Zv: 4.4, Zh: 5.0, H: 1.12, Xe: -0.5 };
{
  const X = -2.73, Z = 5.7, [x, y] = P(X, 0, Z), m = ms(Z);
  const yTop = P(0, TRESEN.H, TRESEN.Zh)[1];
  const f = figur({ id: "b12a_wirt", geschlecht: "m", pose: "halten", blick: 90, frisur: "glatze", haarfarbe: "grau", haut: "hell", bart: "bart_kurz",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#6d2a2a" }, schuerze: { stueck: "schuerze", farbe: "schwarz" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.78 * m, y - yTop - 2);
  S.teil({ id: "kn_wirt", de: "der Wirt", syl: "WIRT", it: "l'oste", itSyl: "O-ste", en: "landlord", x, y, kunst: f.svg,
    tipp: "Ihm gehört die Kneipe. Er zapft und kassiert." });
}

/* =====================================================================
   8 — DER STAMMGAST, 9 — DER STAMMTISCH, 10 — DIE BIERKRÜGE,
   11 — DAS STAMMTISCHSCHILD
   ===================================================================== */
const TISCH = { X: 2.8, Z: 5.6, R: 0.55, H: 0.76 };
{
  const X = 2.78, Z = 6.3, [x, y] = P(X, 0, Z), m = ms(Z);
  const yT = P(0, TISCH.H, TISCH.Z + TISCH.R)[1];
  const f = figur({ id: "b12a_stg", geschlecht: "m", pose: "sitzen", blick: 18, frisur: "glatze", haarfarbe: "grau", haut: "hell", alter: "alt",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#c9c2a8" }, jacke: { stueck: "weste", farbe: "#4a5a3a" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.74 * m, y - yT - 1.5);
  S.teil({ id: "kn_stammgast", de: "der Stammgast", syl: "STAMM-gast", it: "il cliente abituale", itSyl: "cli-EN-te a-bi-TUA-le", en: "regular", x, y, kunst: f.svg,
    tipp: "Er sitzt hier jeden Donnerstag – immer auf demselben Platz." });
}
{
  const { X, Z, R, H } = TISCH, m = ms(Z);
  const c = P(X, H, Z), v = P(X, H, Z - R), h = P(X, H, Z + R), rx = R * m, fuss = P(X, 0, Z);
  const ry = (v[1] - h[1]) / 2, cy = (v[1] + h[1]) / 2;
  let k = schatten(fuss[0], fuss[1] + 0.5, rx * 0.8, 2.6, 0.4);
  /* Säulenfuß mit Kreuzfüßen */
  k += `<path d="M${r(fuss[0] - rx * 0.55)} ${r(fuss[1])} L${r(fuss[0] - 3)} ${r(fuss[1] - 3)} L${r(fuss[0] + 3)} ${r(fuss[1] - 3)} L${r(fuss[0] + rx * 0.55)} ${r(fuss[1])} L${r(fuss[0] + rx * 0.5)} ${r(fuss[1] + 1.4)} L${r(fuss[0] - rx * 0.5)} ${r(fuss[1] + 1.4)} Z" fill="${HOLZ_D}"/>`;
  k += `<rect x="${r(fuss[0] - 3)}" y="${r(cy + 2)}" width="6" height="${r(fuss[1] - cy - 4)}" fill="${HOLZ_V}"/>`;
  k += `<rect x="${r(fuss[0] - 4)}" y="${r(fuss[1] - 10)}" width="8" height="3" rx="1.2" fill="${HOLZ_V}"/><rect x="${r(fuss[0] - 4)}" y="${r(cy + 3)}" width="8" height="2.4" rx="1" fill="${HOLZ_V}"/>`;
  /* Platte: Eiche, dick, mit Kante */
  k += `<path d="M${r(c[0] - rx)} ${r(cy)} L${r(c[0] - rx)} ${r(cy + 2.6)} A${r(rx)} ${r(ry)} 0 0 0 ${r(c[0] + rx)} ${r(cy + 2.6)} L${r(c[0] + rx)} ${r(cy)} Z" fill="${S.lg("kante", [[0, "#3a2210"], [0.5, "#6a4224"], [1, "#3a2210"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${c[0]}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${S.rg("platte", [[0, "#8a5a32"], [0.7, "#6e4426"], [1, "#4f2f18"]], 0.45, 0.4, 0.7)}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(c[0] - rx * 0.9)} ${r(cy - ry * 0.6 + i * ry * 0.24)} Q${r(c[0])} ${r(cy - ry * 0.5 + i * ry * 0.24)} ${r(c[0] + rx * 0.9)} ${r(cy - ry * 0.6 + i * ry * 0.24)}" stroke="#4a2c16" stroke-width=".25" opacity=".5" fill="none"/>`;
  k += `<ellipse cx="${r(c[0] - rx * 0.25)}" cy="${r(cy - ry * 0.3)}" rx="${r(rx * 0.4)}" ry="${r(ry * 0.3)}" fill="#ffd98a" opacity=".18"/>`;
  S.teil({ id: "kn_stammtisch", de: "der Stammtisch", syl: "STAMM-tisch", it: "il tavolo degli abituali", itSyl: "TA-vo-lo", en: "regulars' table", x: fuss[0], y: fuss[1], kunst: um(fuss[0], fuss[1], k),
    tipp: "Der runde Tisch, an dem immer dieselben sitzen. „Ist hier besetzt?“ — „Das ist der Stammtisch.“" });
  TISCH.cy = cy; TISCH.ry = ry; TISCH.rx = rx; TISCH.cx = c[0];
}
{
  /* zwei Steinkrüge mit Zinndeckel */
  let k = "";
  const krug = (X, Z, offen) => {
    const m = ms(Z), [x, y] = P(X, TISCH.H, Z), w = 0.055 * m, h = 0.2 * m;
    let g = schatten(x, y, w * 1.3, .8, .35);
    g += `<path d="M${r(x - w)} ${r(y - h)} L${r(x + w)} ${r(y - h)} Q${r(x + w * 1.12)} ${r(y - h / 2)} ${r(x + w)} ${r(y)} L${r(x - w)} ${r(y)} Q${r(x - w * 1.12)} ${r(y - h / 2)} ${r(x - w)} ${r(y - h)} Z" fill="${S.lg("stein", [[0, "#9ea3a6"], [0.4, "#e2e4e2"], [1, "#868c90"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x - w * 0.7)} ${r(y - h * 0.62)} q${r(w * 0.7)} -1.2 ${r(w * 1.4)} 0 M${r(x - w * 0.7)} ${r(y - h * 0.38)} q${r(w * 0.7)} 1.2 ${r(w * 1.4)} 0" stroke="#2a4a8a" stroke-width=".45" fill="none"/>`;
    g += `<circle cx="${r(x)}" cy="${r(y - h / 2)}" r="${r(w * 0.3)}" fill="#2a4a8a" opacity=".85"/>`;
    g += `<path d="M${r(x + w)} ${r(y - h * 0.8)} q${r(w * 0.9)} 0 ${r(w * 0.9)} ${r(h * 0.3)} q0 ${r(h * 0.3)} ${r(-w * 0.9)} ${r(h * 0.32)}" stroke="#8a9094" stroke-width="${r(w * 0.35)}" fill="none"/>`;
    g += offen ? `<path d="M${r(x - w)} ${r(y - h)} L${r(x + w * 0.3)} ${r(y - h * 1.6)} L${r(x + w * 0.6)} ${r(y - h * 1.5)} L${r(x + w)} ${r(y - h)} Z" fill="${CHROM}"/>` : `<ellipse cx="${r(x)}" cy="${r(y - h - 0.4)}" rx="${r(w * 1.05)}" ry=".9" fill="${CHROM}"/>`;
    return g;
  };
  k += krug(2.62, 5.75, false) + krug(3.12, 5.45, true);
  const [x, y] = P(2.85, TISCH.H, 5.6);
  S.teil({ oben: true, id: "kn_bierkrug", de: "der Bierkrug", syl: "BIER-krug", it: "il boccale di birra", itSyl: "boc-CA-le di BIR-ra", en: "beer mug", x, y, kunst: um(x, y, k),
    tipp: "Am Stammtisch hat mancher seinen eigenen Krug mit Zinndeckel." });
}
{
  const [x, y] = P(2.9, TISCH.H, 5.62), m = ms(5.62);
  const h = 0.4 * m, w = 0.3 * m;
  let k = `<ellipse cx="${x}" cy="${r(y - 0.3)}" rx="${r(w * 0.36)}" ry=".9" fill="#1d1a18"/>`;
  k += `<rect x="${r(x - 0.5)}" y="${r(y - h)}" width="1" height="${r(h)}" fill="#24201c"/>`;
  k += `<path d="M${r(x)} ${r(y - h)} q${r(-w * 0.5)} -2 ${r(-w * 0.55)} 1 M${r(x)} ${r(y - h)} q${r(w * 0.5)} -2 ${r(w * 0.55)} 1 M${r(x)} ${r(y - h + 1)} L${r(x)} ${r(y - h - 2.2)}" stroke="#24201c" stroke-width=".55" fill="none"/><circle cx="${x}" cy="${r(y - h - 2.4)}" r=".7" fill="#24201c"/>`;
  k += `<path d="M${r(x - w / 2)} ${r(y - h + 1.6)} L${r(x - w / 2)} ${r(y - h * 0.4)} L${r(x + w / 2)} ${r(y - h * 0.4)} L${r(x + w / 2)} ${r(y - h + 1.6)} Z" fill="#1d1a18"/>`;
  k += `<rect x="${r(x - w / 2 + 0.7)}" y="${r(y - h + 2.3)}" width="${r(w - 1.4)}" height="${r(h * 0.6 - 3.7)}" fill="${S.lg("schildgold", [[0, "#e8c86a"], [1, "#b8902e"]])}"/>`;
  k += `<text x="${x}" y="${r(y - h * 0.62)}" font-size="2.3" text-anchor="middle" fill="#2a1a0a" font-family="'Old English Text MT','UnifrakturMaguntia',Georgia,serif" font-weight="bold">Stammtisch</text>`;
  k += `<path d="M${r(x - w / 2)} ${r(y - h * 0.4)} q${r(w / 4)} 1.6 ${r(w / 2)} 0 q${r(w / 4)} 1.6 ${r(w / 2)} 0" stroke="#1d1a18" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "kn_stammtischschild", de: "das Stammtischschild", syl: "STAMM-tisch-schild", it: "il cartello del tavolo fisso", itSyl: "car-TEL-lo del TA-vo-lo FIS-so", en: "regulars' table sign", x, y, kunst: um(x, y, k),
    tipp: "Das Schild sagt: Dieser Tisch ist für die Stammgäste reserviert." });
}

/* =====================================================================
   12 — DIE STÜHLE (vorne, und rechts unter der Stammgästin)
   ===================================================================== */
const STUHL2 = { X: 3.52, Z: 5.5 };
{
  const stuhl = (X, Z, lehne) => {
    /* lehne: "hinten" (Lehne zum Betrachter) oder "rechts" (Profil, Lehne rechts) */
    const m = ms(Z), [x, yf] = P(X, 0, Z), ys = P(X, 0.45, Z)[1], yl = P(X, 0.98, Z)[1];
    const w = 0.21 * m;
    let g = schatten(x, yf + 0.4, w * 1.3, 1.6, 0.35);
    if (lehne === "hinten") {
      for (const dx of [-w * 0.92, w * 0.92]) g += `<rect x="${r(x + dx - 0.9)}" y="${r(ys)}" width="1.8" height="${r(yf - ys)}" fill="${HOLZ_V}"/>`;
      g += `<path d="M${r(x - w)} ${r(ys - 1.6)} L${r(x + w)} ${r(ys - 1.6)} L${r(x + w * 1.05)} ${r(ys + 1)} L${r(x - w * 1.05)} ${r(ys + 1)} Z" fill="${HOLZ_P}"/>`;
      g += `<rect x="${r(x - w * 1.05)}" y="${r(yl)}" width="${r(w * 2.1)}" height="${r(ys - yl)}" rx="1" fill="none"/>`;
      for (const dx of [-w * 0.95, w * 0.95]) g += `<rect x="${r(x + dx - 1.1)}" y="${r(yl)}" width="2.2" height="${r(ys - yl + 1)}" rx=".6" fill="${HOLZ_V}"/>`;
      g += `<path d="M${r(x - w * 1.05)} ${r(yl)} Q${r(x)} ${r(yl - 2)} ${r(x + w * 1.05)} ${r(yl)} L${r(x + w * 1.05)} ${r(yl + 4.6)} Q${r(x)} ${r(yl + 2.6)} ${r(x - w * 1.05)} ${r(yl + 4.6)} Z" fill="${HOLZ_V}"/>`;
      for (const dx of [-w * 0.4, 0, w * 0.4]) g += `<rect x="${r(x + dx - 0.6)}" y="${r(yl + 3.5)}" width="1.2" height="${r(ys - yl - 4.5)}" fill="${HOLZ_D}"/>`;
      g += `<path d="M${r(x - w * 0.8)} ${r(yl - 0.4)} Q${r(x)} ${r(yl - 1.8)} ${r(x + w * 0.8)} ${r(yl - 0.4)}" stroke="#c08a52" stroke-width=".5" fill="none" opacity=".7"/>`;
    } else {
      const xb = x + w * 0.9;
      g += `<rect x="${r(x - w * 0.9 - 0.8)}" y="${r(ys)}" width="1.6" height="${r(yf - ys)}" fill="${HOLZ_V}"/><rect x="${r(xb - 0.9)}" y="${r(yl)}" width="1.9" height="${r(yf - yl)}" rx=".5" fill="${HOLZ_V}"/>`;
      g += `<rect x="${r(x - w)}" y="${r(ys - 1.4)}" width="${r(w * 2)}" height="2.4" rx=".6" fill="${HOLZ_P}"/>`;
      g += `<path d="M${r(xb - 0.6)} ${r(yl)} L${r(xb + 1.6)} ${r(yl - 0.6)} L${r(xb + 1.6)} ${r(yl + 6)} L${r(xb - 0.6)} ${r(yl + 6.4)} Z" fill="${HOLZ_V}"/>`;
    }
    return g;
  };
  let k = stuhl(2.48, 4.86, "hinten") + stuhl(STUHL2.X, STUHL2.Z, "rechts");
  const [x, y] = P(2.48, 0, 4.86);
  S.teil({ id: "kn_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x, y, kunst: um(x, y, k) });
}

/* =====================================================================
   13 — DIE STAMMGÄSTIN AM TISCH (rechts, im Profil)
   ===================================================================== */
{
  const { X, Z } = STUHL2, m = ms(Z), [x, y] = P(X - 0.1, 0, Z);
  const f = figur({ id: "b12a_stgw", geschlecht: "w", pose: "sitzen", blick: -90, frisur: "kurz", haarfarbe: "weiss", haut: "hell", alter: "alt",
    kleidung: { oberteil: { stueck: "bluse", farbe: "#8a3b4a" }, jacke: { stueck: "jacke", farbe: "#3a4a6a" }, unterteil: { stueck: "rock_knie", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.62 * m);
  S.teil({ id: "kn_stammgaestin", de: "die Stammgästin am Tisch", syl: "STAMM-gäs-tin am TISCH", it: "la cliente al tavolo", itSyl: "cli-EN-te al TA-vo-lo", en: "regular at the table", x, y, kunst: f.svg,
    tipp: "Sie kommt seit dreißig Jahren – und weiß alles, was im Viertel passiert." });
}

/* =====================================================================
   14 — DER TRESEN (dunkles Holz, Kassetten, Messing-Fußstange)
   ===================================================================== */
{
  const { Zv, Zh, H, Xe } = TRESEN;
  const xr = P(Xe, 0, Zv)[0], yb = P(Xe, 0, Zv)[1], yt = P(Xe, H, Zv)[1], yth = P(Xe, H, Zh)[1], xrh = P(Xe, 0, Zh)[0], ybh = P(Xe, 0, Zh)[1];
  const m = ms(Zv);
  let k = schatten(xr / 2, yb + 1, xr / 2 + 6, 3, 0.45);
  /* Front */
  k += `<rect x="0" y="${r(yt + 3)}" width="${r(xr)}" height="${r(yb - yt - 3)}" fill="${HOLZ_V}"/>`;
  k += `<rect x="0" y="${r(yt + 3)}" width="${r(xr)}" height="${r(yb - yt - 3)}" fill="${S.lg("frontlicht", [[0, "#ffcf7a", 0.12], [0.3, "#000", 0], [1, "#000", 0.3]])}"/>`;
  /* Kassetten */
  const n = Math.round(xr / (0.62 * m));
  const bw = xr / n;
  for (let i = 0; i < n; i++) {
    const x = i * bw + 2.2, w = bw - 4.4, y = yt + 7, h = (yb - 12) - y;
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="1" fill="${HOLZ_P}" stroke="#2a160a" stroke-width=".6"/>`;
    k += `<rect x="${r(x + 2.2)}" y="${r(y + 2.2)}" width="${r(w - 4.4)}" height="${r(h - 4.4)}" rx=".6" fill="${S.lg("kassette", [[0, "#7a4a28"], [0.5, "#5e3a1e"], [1, "#4a2c16"]])}"/>`;
    k += `<line x1="${r(x + 1)}" y1="${r(y + 0.7)}" x2="${r(x + w - 1)}" y2="${r(y + 0.7)}" stroke="#b07a48" stroke-width=".4" opacity=".7"/>`;
  }
  /* Sockel und Fußstange aus Messing mit Haltern */
  k += `<rect x="0" y="${r(yb - 4)}" width="${r(xr)}" height="4" fill="#1e1209"/>`;
  const yf = P(0, 0.2, Zv - 0.18)[1];
  for (let i = 0; i < n + 1; i++) { const x = Math.min(xr - 2, i * bw + 1.2); k += `<path d="M${r(x)} ${r(yb - 9)} L${r(x + 1)} ${r(yf)}" stroke="${MESSING}" stroke-width="1.1"/>`; }
  k += `<rect x="0" y="${r(yf - 1.3)}" width="${r(xr - 1)}" height="2.6" rx="1.3" fill="${MESSING}"/>`;
  /* Ende rechts (Stirnseite) */
  k += poly([[xr, yt], [xrh, yth], [xrh, ybh], [xr, yb]], "#2e1a0c");
  /* Platte mit dicker Nase */
  k += poly([[0, yth], [xrh + 0.6, yth], [xr + 1.2, yt - 0.4], [0, yt - 0.4]], S.lg("platteT", [[0, "#3a2210"], [1, "#6a4224"]]));
  k += `<rect x="0" y="${r(yt - 0.6)}" width="${r(xr + 1.4)}" height="3.8" rx="1.4" fill="${S.lg("nase", [[0, "#a06a3a"], [0.4, "#6e4426"], [1, "#3a2210"]])}"/>`;
  k += `<rect x="0" y="${r(yt - 0.2)}" width="${r(xr)}" height=".7" fill="#ffd98a" opacity=".35"/>`;
  /* Spiegelungen der Lampen auf der Platte */
  for (const [X, Z] of LAMPEN.slice(0, 2)) { const x = P(X, 0, Z)[0]; k += `<ellipse cx="${x}" cy="${r((yt + yth) / 2)}" rx="6" ry="1" fill="#fff1c4" opacity=".3"/>`; }
  S.teil({ id: "kn_tresen", de: "der Tresen", syl: "TRE-sen", it: "il bancone", itSyl: "ban-CO-ne", en: "bar counter", x: r(xr / 2), y: yb, steht: true, kunst: um(xr / 2, yb, k),
    tipp: "Wer am Tresen steht, kommt am schnellsten ins Gespräch." });
  TRESEN.yt = yt; TRESEN.yth = yth; TRESEN.xr = xr;
}

/* Dinge auf dem Tresen: Standfläche bei Z = 4.7 */
const AUF = (X) => P(X, TRESEN.H, 4.7);
{
  /* DIE SPEISEKARTE — Aufsteller in Holzhülle */
  const [x, y] = AUF(-2.66), m = ms(4.7), h = 0.24 * m, w = 0.15 * m;
  let k = schatten(x, y, w * 0.7, .6, .35);
  k += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2 + 1)} ${r(y - h)} L${r(x + w / 2 + 1)} ${r(y - h)} L${r(x + w / 2)} ${r(y)} Z" fill="#5a3418"/>`;
  k += `<path d="M${r(x - w / 2 + 0.8)} ${r(y - 1)} L${r(x - w / 2 + 1.6)} ${r(y - h + 1)} L${r(x + w / 2 + 0.4)} ${r(y - h + 1)} L${r(x + w / 2 - 0.4)} ${r(y - 1)} Z" fill="#f4ecd6"/>`;
  k += `<text x="${r(x + 0.5)}" y="${r(y - h + 3.6)}" font-size="1.7" text-anchor="middle" fill="#5a1a10" font-family="Georgia,serif" font-weight="bold">Speisen</text>`;
  ["Schnitzel", "Frikadelle", "Brotzeit", "Soljanka"].forEach((t, i) => { k += `<text x="${r(x + 0.4)}" y="${r(y - h + 6 + i * 1.9)}" font-size="1.25" text-anchor="middle" fill="#3a2a18" font-family="Georgia,serif">${t}</text>`; });
  S.teil({ oben: true, id: "kn_speisekarte", de: "die Speisekarte", syl: "SPEI-se-kar-te", it: "il menù", itSyl: "me-NÙ", en: "menu", x, y, kunst: um(x, y, k),
    tipp: "Kneipenessen: Schnitzel, Frikadelle, Brotzeit." });
}
{
  /* DER ZAPFHAHN — Schanksäule mit zwei Hähnen, Tropfblech, Glas darunter */
  const [x, y] = AUF(-2.05), m = ms(4.7);
  const h = 0.46 * m, cw = 0.05 * m;
  let k = schatten(x, y, 0.22 * m, .9, .4);
  /* Tropfblech */
  k += `<rect x="${r(x - 0.2 * m)}" y="${r(y - 1.6)}" width="${r(0.4 * m)}" height="1.8" rx=".5" fill="${CHROM}"/>`;
  for (let i = 0; i < 12; i++) k += `<line x1="${r(x - 0.19 * m + i * 0.034 * m)}" y1="${r(y - 1.5)}" x2="${r(x - 0.19 * m + i * 0.034 * m)}" y2="${r(y - 0.2)}" stroke="#6e767d" stroke-width=".25"/>`;
  /* Säule */
  k += `<rect x="${r(x - cw)}" y="${r(y - h)}" width="${r(2 * cw)}" height="${r(h - 1.6)}" fill="${CHROM}"/>`;
  k += `<rect x="${r(x - 0.18 * m)}" y="${r(y - h)}" width="${r(0.36 * m)}" height="${r(0.09 * m)}" rx="1.6" fill="${CHROM}"/>`;
  /* Hähne mit Griffen */
  for (const s of [-1, 1]) {
    const hx = x + s * 0.12 * m, hy = y - h + 0.09 * m;
    k += `<rect x="${r(hx - 0.8)}" y="${r(hy)}" width="1.6" height="3.2" fill="${CHROM}"/><path d="M${r(hx - 0.8)} ${r(hy + 3)} L${r(hx + 0.8)} ${r(hy + 3)} L${r(hx + 0.5)} ${r(hy + 4.6)} L${r(hx - 0.5)} ${r(hy + 4.6)} Z" fill="#9aa2a8"/>`;
    k += `<rect x="${r(hx - 1)}" y="${r(hy - 6.8)}" width="2" height="6.8" rx=".9" fill="${s < 0 ? "#1d1d1d" : "#f2efe6"}"/><rect x="${r(hx - 0.7)}" y="${r(hy - 6.2)}" width="1.4" height="2.8" rx=".4" fill="${s < 0 ? "#c8202a" : "#2a5aa8"}"/>`;
  }
  /* Medaillon „Pils“ */
  k += `<circle cx="${r(x)}" cy="${r(y - h + 0.045 * m)}" r="2.2" fill="${S.rg("medaillon", [[0, "#ffffff"], [1, "#d8d0bc"]])}" stroke="${MESSING}" stroke-width=".5"/><text x="${r(x)}" y="${r(y - h + 0.045 * m + 0.6)}" font-size="1.5" text-anchor="middle" fill="#a8101a" font-family="Georgia" font-weight="bold">Pils</text>`;
  /* Glas unter dem linken Hahn, halb voll, Strahl */
  const gx = x - 0.12 * m, gb = y - 1.6, gh = 0.2 * m;
  k += `<line x1="${r(gx)}" y1="${r(y - h + 0.09 * m + 4.6)}" x2="${r(gx + 0.2)}" y2="${r(gb - gh * 0.55)}" stroke="#f2b83a" stroke-width=".6" opacity=".85"/>`;
  k += `<path d="M${r(gx - 2.2)} ${r(gb - gh)} L${r(gx + 2.2)} ${r(gb - gh)} L${r(gx + 1.6)} ${r(gb)} L${r(gx - 1.6)} ${r(gb)} Z" fill="${GLAS}" stroke="#eef6f7" stroke-width=".25"/>`;
  k += `<path d="M${r(gx - 1.95)} ${r(gb - gh * 0.55)} L${r(gx + 1.95)} ${r(gb - gh * 0.55)} L${r(gx + 1.6)} ${r(gb)} L${r(gx - 1.6)} ${r(gb)} Z" fill="${BIER}" opacity=".9"/><rect x="${r(gx - 1.95)}" y="${r(gb - gh * 0.62)}" width="3.9" height="1.2" rx=".4" fill="#fff8ea"/>`;
  k += `<rect x="${r(x - cw + 0.4)}" y="${r(y - h + 2)}" width=".8" height="${r(h - 4)}" fill="#fff" opacity=".6"/>`;
  S.teil({ oben: true, id: "kn_zapfhahn", de: "der Zapfhahn", syl: "ZAPF-hahn", it: "la spina", itSyl: "SPI-na", en: "beer tap", x, y, kunst: um(x, y, k),
    tipp: "Ein Pils zapft man langsam — es braucht seine Zeit." });
}
{
  /* DER BIERDECKEL — Stapel im Halter, einer liegt vorn mit Strichen */
  const [x, y] = AUF(-1.75), m = ms(4.7), d = 0.107 * m;
  let k = schatten(x, y, d * 0.9, .5, .3);
  k += `<rect x="${r(x - d / 2 - 0.6)}" y="${r(y - d * 0.55)}" width="${r(d + 1.2)}" height="${r(d * 0.55)}" rx=".4" fill="#5a3418"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${r(x - 0.6 + i * 0.3)}" cy="${r(y - d * 0.58 - 0.1)}" r="${r(d / 2)}" fill="${i === 4 ? "#f4efe2" : "#e2dccb"}" stroke="#bdb39c" stroke-width=".15"/>`;
  k += `<circle cx="${r(x + 0.6)}" cy="${r(y - d * 0.58 - 0.1)}" r="${r(d / 2 - 0.6)}" fill="none" stroke="#a8101a" stroke-width=".5"/><text x="${r(x + 0.6)}" y="${r(y - d * 0.58 + 0.5)}" font-size="1.5" text-anchor="middle" fill="#a8101a" font-family="Georgia" font-weight="bold">Pils</text>`;
  /* liegender Deckel mit Strichen (Bleistift) */
  k += `<ellipse cx="${r(x + d * 1.15)}" cy="${r(y - 0.4)}" rx="${r(d / 2)}" ry="1" fill="#f4efe2" stroke="#bdb39c" stroke-width=".15"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${r(x + d * 0.85 + i * 0.6)}" y1="${r(y - 0.9)}" x2="${r(x + d * 0.85 + i * 0.6)}" y2="${r(y + 0.1)}" stroke="#333" stroke-width=".18"/>`;
  k += `<line x1="${r(x + d * 0.75)}" y1="${r(y - 0.2)}" x2="${r(x + d * 0.85 + 2.2)}" y2="${r(y - 0.8)}" stroke="#333" stroke-width=".18"/>`;
  S.teil({ oben: true, id: "kn_bierdeckel", de: "der Bierdeckel", syl: "BIER-de-ckel", it: "il sottobicchiere", itSyl: "sot-to-bic-CHIE-re", en: "beer mat", x, y, kunst: um(x, y, k + flaeche(x - d / 2 - 1, y - d * 1.1 - 1, d * 2.2 + 2, d * 1.1 + 2)),
    tipp: "Jeder Strich darauf ist ein Bier. Am Ende wird abgerechnet." });
}
{
  /* DAS WEINGLAS — Weinschorle vor der Stammgästin */
  const [x, y] = AUF(-1.45), m = ms(4.7), h = 0.19 * m;
  let k = schatten(x, y, 2.2, .5, .3);
  k += `<ellipse cx="${x}" cy="${r(y - 0.3)}" rx="2" ry=".5" fill="${GLAS}" stroke="#eef6f7" stroke-width=".2"/><rect x="${r(x - 0.25)}" y="${r(y - h * 0.5)}" width=".5" height="${r(h * 0.5)}" fill="#e8f2f4"/>`;
  k += `<path d="M${r(x - 2.3)} ${r(y - h)} Q${r(x - 2.6)} ${r(y - h * 0.5)} ${r(x)} ${r(y - h * 0.48)} Q${r(x + 2.6)} ${r(y - h * 0.5)} ${r(x + 2.3)} ${r(y - h)} Z" fill="${GLAS}" stroke="#eef6f7" stroke-width=".25"/>`;
  k += `<path d="M${r(x - 2.35)} ${r(y - h * 0.78)} Q${r(x - 2.2)} ${r(y - h * 0.5)} ${r(x)} ${r(y - h * 0.5)} Q${r(x + 2.2)} ${r(y - h * 0.5)} ${r(x + 2.35)} ${r(y - h * 0.78)} Z" fill="#f3e3a0" opacity=".85"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="${r(x - 1.2 + i * 0.8)}" cy="${r(y - h * 0.6 - (i % 2) * 0.8)}" r=".2" fill="#fff"/>`;
  S.teil({ oben: true, id: "kn_weinglas", de: "das Weinglas", syl: "WEIN-glas", it: "il bicchiere da vino", itSyl: "bic-CHIE-re da VI-no", en: "wine glass", x, y, kunst: um(x, y, k + flaeche(x - 3, y - h - 1, 6, h + 1.5)),
    tipp: "Eine Weinschorle: Wein mit Sprudelwasser." });
}
{
  /* DAS KLEINGELD — Münzen auf dem Zahlteller */
  const [x, y] = P(-2.42, TRESEN.H, 4.6), m = ms(4.6);
  let k = `<ellipse cx="${x}" cy="${r(y - 0.3)}" rx="4.2" ry="1.1" fill="#2a2a2a"/><ellipse cx="${x}" cy="${r(y - 0.6)}" rx="3.6" ry=".8" fill="#4a4a4a"/>`;
  for (const [dx, dy, c] of [[-1.6, -0.6, "#c9a227"], [0.4, -0.9, "#b87333"], [1.8, -0.5, "#c7c9cc"], [-0.4, -1.4, "#c9a227"], [0.9, -1.8, "#c7c9cc"]]) k += `<ellipse cx="${r(x + dx)}" cy="${r(y + dy)}" rx="1.3" ry=".5" fill="${c}" stroke="#7a5a1a" stroke-width=".12"/>`;
  k += `<rect x="${r(x - 3.4)}" y="${r(y - 3.6)}" width="3.6" height="2.4" fill="#e9e2c8" transform="rotate(-8 ${x} ${y})"/>`;
  S.teil({ oben: true, id: "kn_muenzen", de: "das Kleingeld", syl: "KLEIN-geld", it: "gli spiccioli", itSyl: "SPIC-cio-li", en: "change", x, y, kunst: um(x, y, k + flaeche(x - 4.6, y - 4.6, 9.2, 5.6)),
    tipp: "Getrennt zahlen ist üblich: „Zusammen oder getrennt?“" });
}
{
  /* DAS BIER — frisch gezapftes Pils in der Tulpe, auf dem Deckel */
  const [x, y] = AUF(-0.62), m = ms(4.7), h = 0.24 * m;
  let k = `<ellipse cx="${x}" cy="${r(y - 0.2)}" rx="${r(0.055 * m)}" ry=".9" fill="#f4efe2" stroke="#bdb39c" stroke-width=".15"/>`;
  k += `<ellipse cx="${x}" cy="${r(y - 0.5)}" rx="1.7" ry=".45" fill="${GLAS}"/><rect x="${r(x - 0.35)}" y="${r(y - h * 0.3)}" width=".7" height="${r(h * 0.3)}" fill="#f2c24a"/>`;
  k += `<path d="M${r(x - 0.4)} ${r(y - h * 0.3)} Q${r(x - 2.6)} ${r(y - h * 0.5)} ${r(x - 2.2)} ${r(y - h * 0.82)} L${r(x - 2.5)} ${r(y - h)} L${r(x + 2.5)} ${r(y - h)} L${r(x + 2.2)} ${r(y - h * 0.82)} Q${r(x + 2.6)} ${r(y - h * 0.5)} ${r(x + 0.4)} ${r(y - h * 0.3)} Z" fill="${BIER}"/>`;
  k += `<path d="M${r(x - 2.5)} ${r(y - h)} Q${r(x - 2.6)} ${r(y - h - 2.4)} ${r(x)} ${r(y - h - 2.6)} Q${r(x + 2.6)} ${r(y - h - 2.4)} ${r(x + 2.5)} ${r(y - h)} Z" fill="#fffaf0"/><path d="M${r(x - 2.45)} ${r(y - h - 0.2)} L${r(x + 2.45)} ${r(y - h - 0.2)} L${r(x + 2.3)} ${r(y - h * 0.86)} L${r(x - 2.3)} ${r(y - h * 0.86)} Z" fill="#fbf0d6"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(x - 1.2 + rnd() * 2.4)}" cy="${r(y - h * (0.4 + rnd() * 0.4))}" r=".18" fill="#fff6d0"/>`;
  k += `<path d="M${r(x - 1.8)} ${r(y - h * 0.85)} Q${r(x - 2)} ${r(y - h * 0.55)} ${r(x - 0.8)} ${r(y - h * 0.38)}" stroke="#fff" stroke-width=".45" opacity=".55" fill="none"/>`;
  S.teil({ oben: true, id: "kn_bier", de: "das Bier", syl: "BIER", it: "la birra", itSyl: "BIR-ra", en: "beer", x, y, kunst: um(x, y, k + flaeche(x - 3, y - h - 3, 6, h + 3.5)),
    tipp: "„Ein Bier, bitte.“ — „Ein großes oder ein kleines?“" });
}

/* =====================================================================
   15 — DIE BARHOCKER vor dem Tresen
   ===================================================================== */
const HOCKER = [[-2.05, 3.95], [-1.0, 3.95]];
{
  const hocker = (X, Z) => {
    const m = ms(Z), [x, yf] = P(X, 0, Z), ys = P(X, 0.78, Z)[1], yr = P(X, 0.36, Z)[1], w = 0.19 * m;
    let g = schatten(x, yf + 0.5, w * 1.25, 2, 0.45);
    /* vier gespreizte Beine (Buche dunkel) */
    for (const [dx0, dx1, f] of [[-0.55, -1.0, HOLZ_D], [0.55, 1.0, HOLZ_D], [-0.3, -0.5, HOLZ_V], [0.3, 0.5, HOLZ_V]]) {
      const lift = f === HOLZ_D ? 2.4 : 0;
      g += `<path d="M${r(x + dx0 * w - 1)} ${r(ys + 2)} L${r(x + dx0 * w + 1)} ${r(ys + 2)} L${r(x + dx1 * w + 1)} ${r(yf - lift)} L${r(x + dx1 * w - 1)} ${r(yf - lift)} Z" fill="${f}"/>`;
    }
    /* Fußring aus Messing */
    g += `<ellipse cx="${x}" cy="${r(yr)}" rx="${r(w * 0.78)}" ry="${r(w * 0.16)}" fill="none" stroke="${MESSING}" stroke-width="1.2"/>`;
    /* Sitz: Polster mit Leder, Knöpfe, Zarge */
    g += `<path d="M${r(x - w)} ${r(ys)} L${r(x - w)} ${r(ys + 2.6)} A${r(w)} ${r(w * 0.2)} 0 0 0 ${r(x + w)} ${r(ys + 2.6)} L${r(x + w)} ${r(ys)} Z" fill="${S.lg("zarge", [[0, "#2a160a"], [0.5, "#5a3418"], [1, "#2a160a"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x - w * 1.02)} ${r(ys)} Q${r(x - w * 1.02)} ${r(ys - 3.4)} ${r(x)} ${r(ys - 3.6)} Q${r(x + w * 1.02)} ${r(ys - 3.4)} ${r(x + w * 1.02)} ${r(ys)} A${r(w * 1.02)} ${r(w * 0.2)} 0 0 1 ${r(x - w * 1.02)} ${r(ys)} Z" fill="${S.rg("leder", [[0, "#b0402e"], [0.6, "#7a2416"], [1, "#4a140a"]], 0.4, 0.3, 0.8)}"/>`;
    for (const dx of [-0.45, 0, 0.45]) g += `<circle cx="${r(x + dx * w)}" cy="${r(ys - 1.6)}" r=".35" fill="#3a0e06"/>`;
    g += `<path d="M${r(x - w * 0.6)} ${r(ys - 2.4)} Q${r(x - w * 0.1)} ${r(ys - 3.4)} ${r(x + w * 0.3)} ${r(ys - 3)}" stroke="#ffd0b0" stroke-width=".6" opacity=".4" fill="none"/>`;
    return g;
  };
  let k = HOCKER.map(([X, Z]) => hocker(X, Z)).join("");
  const [x, y] = P(HOCKER[0][0], 0, HOCKER[0][1]);
  S.teil({ id: "kn_barhocker", de: "der Barhocker", syl: "BAR-ho-cker", it: "lo sgabello", itSyl: "sga-BEL-lo", en: "bar stool", x, y, kunst: um(x, y, k),
    tipp: "Ein hoher Hocker ohne Lehne — er passt zur Tresenhöhe." });
}

/* =====================================================================
   16 — DIE STAMMGÄSTIN auf dem Barhocker, 17 — DER GAST am Tresenende
   ===================================================================== */
{
  const [X, Z] = HOCKER[1], m = ms(Z), ys = P(X, 0.78, Z)[1] - 2.4;
  const spec = { id: "b12a_gw", geschlecht: "w", pose: "sitzen", blick: -90, frisur: "locken", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f6a6a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" } } };
  const probe = B.mensch(spec, 1.65 * m);
  const x = P(X, 0, Z)[0] - probe.z.sitz.x * probe.k, y = ys - probe.z.sitz.y * probe.k;
  const f = figur(spec, 1.65 * m);
  S.teil({ id: "kn_gaestin", de: "die Stammgästin", syl: "STAMM-gäs-tin", it: "la cliente abituale", itSyl: "cli-EN-te a-bi-TUA-le", en: "regular", x, y, kunst: f.svg,
    tipp: "Eine Stammgästin kommt jede Woche und hat ihren Platz." });
}
{
  const X = -0.3, Z = 4.3, [x, y] = P(X, 0, Z), m = ms(Z);
  const f = figur({ id: "b12a_gast", geschlecht: "m", pose: "stehen", blick: -90, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#3d5f8c" }, jacke: { stueck: "jacke", farbe: "#5a3a22" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.78 * m);
  S.teil({ id: "kn_gast", de: "der Gast", syl: "GAST", it: "il cliente", itSyl: "cli-EN-te", en: "guest", x, y, kunst: f.svg,
    tipp: "Er steht am Tresen — das ist in einer Kneipe ganz normal." });
}

S.defs = [...new Set(S.defs)];   /* doppelte Verläufe nur einmal */
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kneipe.js"));
console.log(aus);
