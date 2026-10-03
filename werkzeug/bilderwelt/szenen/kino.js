#!/usr/bin/env node
/* =====================================================================
   DAS KINO (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Dorling Kindersley „Durchblick: Kino“, Schwäbische Zeitung
   „Wie ein Film auf die Leinwand kommt“ und Kino-Umbau Friedrichshafen,
   Ling „German movie theater vocabulary“):
   - Im FOYER die KINOKASSE (Tickets, auch Abholung online gekaufter
     Karten) und die SNACKTHEKE mit POPCORNMASCHINE (Popcorn süß oder
     salzig, wird warm gehalten), Getränkespender, NACHOS mit Käsesoße,
     BECHER mit Deckel und Strohhalm, 3D-BRILLEN.
   - Darüber Bildschirme mit Preisen (PREISTAFEL); vor der Kasse ein
     Personenleitsystem aus Pfosten und Gurtband – dort steht die
     SCHLANGE.
   - FILMPLAKATE in Leuchtkästen, ein Papp-AUFSTELLER zum neuen Film,
     über der Saaltür ein Bildschirm mit der VORSTELLUNG (Saal, Uhrzeit,
     Titel, FSK).
   - Im SAAL: LEINWAND mit VORHANG an den Seiten, SITZREIHEN mit roten
     Sesseln, grün leuchtendes NOTAUSGANG-Schild, Bodenlicht an den
     Stufen, der Lichtkegel des Projektors kommt von hinten oben.
   BLICK: Zentralperspektive, Augenhöhe 1,65 m, Fluchtpunkt (150 | 72),
   Rückwand 7,5 m (≈ 33 Einheiten je Meter), Theke 6,9 m (Höhe 1,05 m).
   Durch die offene Saaltür sieht man in den dunklen Saal bis zur
   Leinwand (21 m).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kino", titel: "Das Kino", emoji: "🎬", thema: "Freizeit", kuerzel: "b12c", fassung: 852 });
const rnd = zufall(1895);
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
const VX = 150, HY = 72, E = 1.65, F = 250;
const ms = (Z) => F / Z;
const P = (X, H, Z) => [r(VX + F * X / Z), r(HY + F * (E - H) / Z)];
const ZW = 7.5, RH = 3.3, XL = -4.4, XR = 4.0;
const TUER = { X0: 0.6, X1: 2.8, H: 2.6 };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("blur")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
const CHROM = S.lg("chrom", [[0, "#6e767d"], [0.35, "#f4f6f7"], [0.6, "#b9c0c6"], [1, "#5e666d"]], 0, 0, 1, 0);
const EICHE = S.lg("eiche", [[0, "#8a5a32"], [0.5, "#a8743f"], [1, "#7a4c28"]], 0, 0, 1, 0);
const ROT = S.lg("rot", [[0, "#c8202a"], [1, "#8a1218"]]);

/* =====================================================================
   KULISSE — dunkle Decke mit Spots, Rückwand, Teppich mit Kino-Muster
   ===================================================================== */
{
  const yD = P(0, RH, ZW)[1], yB = P(0, 0, ZW)[1], xl = P(XL, 0, ZW)[0], xr = P(XR, 0, ZW)[0];
  let k = `<rect x="0" y="0" width="320" height="${r(yD + 1)}" fill="${S.lg("decke", [[0, "#0e0e16"], [1, "#1c1a26"]])}"/>`;
  for (const Z of [3.6, 4.6, 5.8, 7.0]) for (let X = -3.5; X <= 3.6; X += 1.75) { const [x, y] = P(X, RH, Z); if (x > 2 && x < 318) k += `<ellipse cx="${x}" cy="${y}" rx="${r(0.09 * ms(Z))}" ry="${r(0.025 * ms(Z))}" fill="#fff4d6"/><ellipse cx="${x}" cy="${r(y + 0.5)}" rx="${r(0.3 * ms(Z))}" ry="${r(0.08 * ms(Z))}" fill="#ffe8b0" opacity=".18"/>`; }
  /* Rückwand */
  k += `<rect x="${xl}" y="${yD}" width="${r(xr - xl)}" height="${r(yB - yD)}" fill="${S.lg("wand", [[0, "#2a2030"], [1, "#3a2c3e"]])}"/>`;
  /* Holzlamellen hinter Kasse und Theke */
  { const a = P(XL, RH, ZW), b = P(-0.55, 0, ZW);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${S.lg("lamellen", [[0, "#5a3a22"], [1, "#7a5232"]])}"/>`;
    for (let x = a[0] + 1.2; x < b[0]; x += 2.2) k += `<rect x="${r(x)}" y="${a[1]}" width="1" height="${r(b[1] - a[1])}" fill="#2a1a10" opacity=".55"/>`;
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${S.lg("lamlicht", [[0, "#ffd08a", 0.25], [0.5, "#ffd08a", 0], [1, "#000", 0.25]])}"/>`; }
  /* LED-Band unter der Decke */
  k += `<rect x="${xl}" y="${r(yD + 0.5)}" width="${r(xr - xl)}" height="1.2" fill="#ff5a8a" opacity=".7"/><rect x="${xl}" y="${r(yD + 1.7)}" width="${r(xr - xl)}" height="5" fill="${S.lg("ledschein", [[0, "#ff5a8a", 0.35], [1, "#ff5a8a", 0]])}"/>`;
  /* Leuchtschild „Kasse · Tickets“ über der Kasse */
  { const a = P(-4.1, 2.95, ZW), b = P(-2.6, 2.45, ZW);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx="1" fill="#14141c" stroke="#f2c230" stroke-width=".6"/>`;
    k += `<text x="${r((a[0] + b[0]) / 2)}" y="${r(a[1] + 8.6)}" font-size="7" text-anchor="middle" fill="#f2c230" font-family="Arial Black,Arial" font-weight="bold" letter-spacing=".6">KASSE</text>`;
    k += `<text x="${r((a[0] + b[0]) / 2)}" y="${r(a[1] + 13.5)}" font-size="3" text-anchor="middle" fill="#fff" font-family="Arial" letter-spacing=".4">TICKETS · ABHOLUNG</text>`; }
  /* Rückbuffet hinter der Theke: Getränkespender, Becherstapel (Kulisse) */
  { const [x, y] = P(-1.9, 0.95, ZW), m = ms(ZW);
    k += `<rect x="${r(x - 0.35 * m)}" y="${r(y - 0.62 * m)}" width="${r(0.7 * m)}" height="${r(0.62 * m)}" rx="1" fill="#1e2228"/><rect x="${r(x - 0.32 * m)}" y="${r(y - 0.58 * m)}" width="${r(0.64 * m)}" height="${r(0.24 * m)}" fill="${S.lg("postmix", [[0, "#2a8ad8"], [1, "#1a5aa8"]])}"/>`;
    for (let i = 0; i < 4; i++) k += `<rect x="${r(x - 0.28 * m + i * 0.15 * m)}" y="${r(y - 0.3 * m)}" width="${r(0.1 * m)}" height="2.2" rx=".4" fill="${["#c8202a", "#f2a230", "#3aa84a", "#e8e8e8"][i]}"/>`;
    for (let i = 0; i < 3; i++) k += `<path d="M${r(x + 0.42 * m + i * 3.4)} ${r(y)} l.5 ${r(-0.3 * m)} l2.2 0 l.5 ${r(0.3 * m)} Z" fill="${["#c8202a", "#1a5aa8", "#f4efe6"][i]}"/><ellipse cx="${r(x + 0.42 * m + i * 3.4 + 1.6)}" cy="${r(y - 0.3 * m)}" rx="1.2" ry=".35" fill="#f4efe6"/>`; }
  /* rechte Seitenwand */
  { const zr = F * XR / (320 - VX), a = P(XR, RH, ZW), b = P(XR, RH, zr), c = P(XR, 0, zr), d = P(XR, 0, ZW);
    k += poly([a, b, c, d], S.lg("wandr", [[0, "#241a28"], [1, "#30243a"]], 0, 0, 1, 0));
    const e1 = P(XR, 2.9, ZW), e2 = P(XR, 2.9, zr);
    k += `<line x1="${e1[0]}" y1="${e1[1]}" x2="${e2[0]}" y2="${e2[1]}" stroke="#ff5a8a" stroke-width="1" opacity=".7"/>`; }
  /* Teppich: dunkles Blau mit buntem Kinomuster, vorn größer */
  k += `<rect x="0" y="${yB}" width="320" height="${r(200 - yB)}" fill="${S.lg("teppich", [[0, "#1c1630"], [1, "#2c2248"]])}"/>`;
  const muster = (id, w, h, n, s) => S.def(`<pattern id="${S.id(id)}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${Array.from({ length: n }, (_, i) => { const x = r(rnd() * w), y = r(rnd() * h), c = ["#e8402a", "#f2c230", "#3a9ad8", "#8a5ad8", "#e86aa0"][i % 5]; return i % 3 === 0 ? `<circle cx="${x}" cy="${y}" r="${r(0.5 * s)}" fill="${c}" opacity=".55"/>` : `<rect x="${x}" y="${y}" width="${r(1.4 * s)}" height="${r(0.45 * s)}" fill="${c}" opacity=".5" transform="rotate(${Math.round(rnd() * 180)} ${x} ${y})"/>`; }).join("")}</pattern>`);
  muster("tf", 8, 3, 10, 0.5); muster("tn", 16, 7, 12, 1.1);
  k += `<rect x="0" y="${yB}" width="320" height="22" fill="url(#${S.id("tf")})"/><rect x="0" y="${r(yB + 22)}" width="320" height="${r(200 - yB - 22)}" fill="url(#${S.id("tn")})"/>`;
  k += `<rect x="0" y="${yB}" width="320" height="${r(200 - yB)}" fill="${S.lg("tlicht", [[0, "#000", 0.35], [0.5, "#000", 0], [1, "#ffcf9a", 0.06]])}"/>`;
  /* Sockelleiste */
  k += `<rect x="${xl}" y="${r(yB - 1.4)}" width="${r(xr - xl)}" height="1.4" fill="#121016"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE PREISTAFEL (drei Bildschirme über der Theke)
   ===================================================================== */
{
  const a = P(-2.45, 2.9, ZW), b = P(-0.6, 2.3, ZW), w = (b[0] - a[0] - 2) / 3, h = b[1] - a[1];
  let k = "";
  const tafeln = [["POPCORN", [["Klein", "4,50"], ["Mittel", "5,90"], ["Groß", "6,90"]], "#c8202a"], ["GETRÄNKE", [["0,5 l", "4,20"], ["0,8 l", "5,20"], ["Wasser", "3,50"]], "#1a6ad8"], ["SNACKS", [["Nachos", "5,50"], ["Hotdog", "4,90"], ["Menü", "11,90"]], "#e8902a"]];
  tafeln.forEach(([t, z, c], i) => {
    const x = a[0] + i * (w + 1);
    k += `<rect x="${r(x)}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx=".6" fill="#0c0c10"/><rect x="${r(x + 0.7)}" y="${r(a[1] + 0.7)}" width="${r(w - 1.4)}" height="${r(h - 1.4)}" fill="#18141e"/>`;
    k += `<rect x="${r(x + 0.7)}" y="${r(a[1] + 0.7)}" width="${r(w - 1.4)}" height="4" fill="${c}"/><text x="${r(x + w / 2)}" y="${r(a[1] + 3.8)}" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="bold">${t}</text>`;
    z.forEach(([n, p], j) => { k += `<text x="${r(x + 1.6)}" y="${r(a[1] + 8.4 + j * 3.6)}" font-size="2.2" fill="#f1eee2" font-family="Arial">${n}</text><text x="${r(x + w - 1.6)}" y="${r(a[1] + 8.4 + j * 3.6)}" font-size="2.2" text-anchor="end" fill="#f2c230" font-family="Arial" font-weight="bold">${p} €</text>`; });
  });
  const cx = (a[0] + b[0]) / 2;
  S.teil({ id: "kn_preistafel", de: "die Preistafel", syl: "PREIS-ta-fel", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price board", x: r(cx), y: b[1], kunst: um(cx, b[1], k),
    tipp: "Popcorn gibt es in drei Größen: klein, mittel und groß." });
}

/* =====================================================================
   2 — DIE FILMPLAKATE (Leuchtkästen links und rechts der Saaltür)
   ===================================================================== */
{
  const plakat = (X0, X1, art) => {
    const a = P(X0, 2.2, ZW), b = P(X1, 0.95, ZW), w = b[0] - a[0], h = b[1] - a[1];
    let g = `<rect x="${r(a[0] - 1)}" y="${r(a[1] - 1)}" width="${r(w + 2)}" height="${r(h + 2)}" rx=".6" fill="${CHROM}"/>`;
    if (art === "mond") {
      g += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" fill="${S.lg("pmond", [[0, "#0a1440"], [0.6, "#2a3a8a"], [1, "#e88a3a"]])}"/>`;
      g += `<circle cx="${r(a[0] + w * 0.62)}" cy="${r(a[1] + h * 0.28)}" r="${r(w * 0.24)}" fill="${S.rg("mond", [[0, "#fffbe8"], [1, "#d8d0b0"]])}"/>`;
      for (let i = 0; i < 12; i++) g += `<circle cx="${r(a[0] + rnd() * w)}" cy="${r(a[1] + rnd() * h * 0.5)}" r=".25" fill="#fff"/>`;
      g += `<path d="M${r(a[0] + w * 0.35)} ${r(a[1] + h * 0.72)} l2 -9 l2 9 l-1 0 l0 2 l-2 0 l0 -2 Z" fill="#e8e8f0"/><path d="M${r(a[0] + w * 0.35 + 1)} ${r(a[1] + h * 0.72 + 2)} l1 3 l1 -3 Z" fill="#ffb03a"/>`;
      g += `<path d="M${a[0]} ${r(a[1] + h * 0.85)} Q${r(a[0] + w / 2)} ${r(a[1] + h * 0.76)} ${b[0]} ${r(a[1] + h * 0.86)} L${b[0]} ${b[1]} L${a[0]} ${b[1]} Z" fill="#1a1020"/>`;
      g += `<text x="${r(a[0] + w / 2)}" y="${r(a[1] + h * 0.56)}" font-size="3.1" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="bold">DIE REISE</text><text x="${r(a[0] + w / 2)}" y="${r(a[1] + h * 0.56 + 3.4)}" font-size="3.1" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="bold">ZUM MOND</text>`;
      g += `<text x="${r(a[0] + w / 2)}" y="${r(b[1] - 1.6)}" font-size="1.5" text-anchor="middle" fill="#cfd6ff" font-family="Arial">AB DONNERSTAG IM KINO</text>`;
    } else {
      g += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" fill="${S.lg("pwald", [[0, "#f6d36a"], [0.5, "#f29a3a"], [1, "#3a6a2a"]])}"/>`;
      for (let i = 0; i < 5; i++) { const tx = a[0] + 2 + i * (w - 4) / 4; g += `<path d="M${r(tx)} ${r(b[1] - 3)} l${r(-2.2 - i % 2)} 0 l${r(2.2 + i % 2)} ${r(-9 - (i % 3) * 3)} l${r(2.2 + i % 2)} ${r(9 + (i % 3) * 3)} Z" fill="#1f4a22"/>`; }
      g += `<circle cx="${r(a[0] + w * 0.5)}" cy="${r(a[1] + h * 0.6)}" r="2.2" fill="#3a2a1a"/><path d="M${r(a[0] + w * 0.5 - 2)} ${r(a[1] + h * 0.6 + 1)} q-2 4 0 6 l4 0 q2 -2 0 -6 Z" fill="#c8202a"/>`;
      g += `<text x="${r(a[0] + w / 2)}" y="${r(a[1] + 6)}" font-size="3" text-anchor="middle" fill="#3a1a0a" font-family="Georgia,serif" font-weight="bold" font-style="italic">Ronja und</text><text x="${r(a[0] + w / 2)}" y="${r(a[1] + 9.6)}" font-size="3" text-anchor="middle" fill="#3a1a0a" font-family="Georgia,serif" font-weight="bold" font-style="italic">der Wald</text>`;
      g += `<text x="${r(a[0] + w / 2)}" y="${r(b[1] - 1.4)}" font-size="1.5" text-anchor="middle" fill="#f6efe0" font-family="Arial">FSK 0 · FAMILIENFILM</text>`;
    }
    g += `<path d="M${a[0]} ${a[1]} L${r(a[0] + w * 0.4)} ${a[1]} L${a[0]} ${r(a[1] + h * 0.5)} Z" fill="#fff" opacity=".12"/>`;
    return g;
  };
  let k = plakat(-0.45, 0.35, "mond") + plakat(3.2, 3.92, "wald");
  const [x, y] = P(-0.05, 0.95, ZW);
  S.teil({ id: "kn_filmplakat", de: "das Filmplakat", syl: "FILM-pla-kat", it: "la locandina", itSyl: "lo-can-DI-na", en: "film poster", x, y, kunst: um(x, y, k),
    tipp: "Auf dem Filmplakat stehen Titel, Start und die Altersfreigabe (FSK)." });
}

/* =====================================================================
   3 — DIE VORSTELLUNG (Bildschirm über der Saaltür)
   ===================================================================== */
{
  const a = P(TUER.X0 + 0.3, 3.12, ZW), b = P(TUER.X1 - 0.3, 2.74, ZW), w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx=".8" fill="#0a0a0e"/><rect x="${r(a[0] + 0.8)}" y="${r(a[1] + 0.8)}" width="${r(w - 1.6)}" height="${r(h - 1.6)}" fill="${S.lg("anz", [[0, "#10203a"], [1, "#0a1428"]])}"/>`;
  k += `<rect x="${r(a[0] + 0.8)}" y="${r(a[1] + 0.8)}" width="13" height="${r(h - 1.6)}" fill="#f2c230"/><text x="${r(a[0] + 7.3)}" y="${r(a[1] + 6)}" font-size="2.4" text-anchor="middle" fill="#14141c" font-family="Arial Black,Arial" font-weight="bold">SAAL</text><text x="${r(a[0] + 7.3)}" y="${r(a[1] + 11)}" font-size="5.4" text-anchor="middle" fill="#14141c" font-family="Arial Black,Arial" font-weight="bold">1</text>`;
  k += `<text x="${r(a[0] + 16)}" y="${r(a[1] + 5.2)}" font-size="3.4" fill="#ffffff" font-family="Arial" font-weight="bold">20:15</text>`;
  k += `<text x="${r(a[0] + 16)}" y="${r(a[1] + 8.8)}" font-size="2.5" fill="#cfe0ff" font-family="Arial">Die Reise zum Mond</text>`;
  k += `<text x="${r(a[0] + 16)}" y="${r(a[1] + 11.6)}" font-size="1.8" fill="#8fe0a0" font-family="Arial">FSK 6 · 112 Min. · Einlass</text>`;
  const cx = a[0] + w / 2;
  S.teil({ id: "kn_vorstellung", de: "die Vorstellung", syl: "VOR-stel-lung", it: "lo spettacolo", itSyl: "spet-TA-co-lo", en: "screening", x: r(cx), y: b[1], kunst: um(cx, b[1], k),
    tipp: "Die Vorstellung um 20:15 Uhr beginnt mit Werbung – der Film kommt etwa 20 Minuten später." });
}

/* =====================================================================
   4 — DER SAAL (Blick durch die offene Tür) — Lupe: Leinwand,
       Sitzreihe, Vorhang, Notausgang
   ===================================================================== */
{
  const o = P(TUER.X0, TUER.H, ZW), u = P(TUER.X1, 0, ZW), w = u[0] - o[0], h = u[1] - o[1];
  const cid = S.id("tuer");
  let k = `<clipPath id="${cid}"><rect x="${o[0]}" y="${o[1]}" width="${r(w)}" height="${r(h)}"/></clipPath>`;
  let g = `<rect x="${o[0]}" y="${o[1]}" width="${r(w)}" height="${r(h)}" fill="#07070c"/>`;
  /* Leinwand an der Stirnwand (Z 21), zentriert im Türblick */
  const ZL = 21, L0 = P(2.4, 3.8, ZL), L1 = P(7.1, 1.2, ZL);
  g += `<rect x="${r(L0[0] - 3)}" y="${r(L0[1] - 3)}" width="${r(L1[0] - L0[0] + 6)}" height="${r(L1[1] - L0[1] + 6)}" fill="#120e14"/>`;
  g += `<rect x="${L0[0]}" y="${L0[1]}" width="${r(L1[0] - L0[0])}" height="${r(L1[1] - L0[1])}" fill="${S.lg("film", [[0, "#0a1440"], [0.55, "#3a4aa8"], [0.8, "#e8a050"], [1, "#2a1a1a"]])}"/>`;
  const lw = L1[0] - L0[0], lh = L1[1] - L0[1];
  g += `<circle cx="${r(L0[0] + lw * 0.7)}" cy="${r(L0[1] + lh * 0.3)}" r="${r(lh * 0.2)}" fill="#fffbe8"/>`;
  g += `<path d="M${L0[0]} ${r(L0[1] + lh * 0.82)} Q${r(L0[0] + lw * 0.3)} ${r(L0[1] + lh * 0.7)} ${r(L0[0] + lw * 0.55)} ${r(L0[1] + lh * 0.8)} Q${r(L0[0] + lw * 0.8)} ${r(L0[1] + lh * 0.72)} ${L1[0]} ${r(L0[1] + lh * 0.8)} L${L1[0]} ${L1[1]} L${L0[0]} ${L1[1]} Z" fill="#1a1020"/>`;
  g += `<path d="M${r(L0[0] + lw * 0.3)} ${r(L0[1] + lh * 0.74)} l1.4 -6 l1.4 6 Z" fill="#e8e8f0"/><path d="M${r(L0[0] + lw * 0.3 + 0.6)} ${r(L0[1] + lh * 0.74)} l.8 2.4 l.8 -2.4 Z" fill="#ffb03a"/>`;
  /* Vorhang links und rechts (roter Samt, Falten) */
  const vorhang = (X0, X1) => { const a = P(X0, 4.3, ZL), b = P(X1, 0, ZL); let v = `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${S.lg("samt", [[0, "#5a0a12"], [0.25, "#a81a24"], [0.5, "#6a0e16"], [0.75, "#a81a24"], [1, "#5a0a12"]], 0, 0, 1, 0, ' spreadMethod="repeat"')}"/>`; for (let x = a[0] + 1.6; x < b[0]; x += 2.4) v += `<line x1="${r(x)}" y1="${a[1]}" x2="${r(x)}" y2="${b[1]}" stroke="#3a0608" stroke-width=".4"/>`; return v; };
  g += vorhang(1.6, 2.35) + vorhang(7.15, 7.9);
  /* Lichtkegel des Projektors (von hinten oben rechts) */
  const q = P(4.75, 3.0, 7.7);
  g += `<path d="M${q[0]} ${q[1]} L${L0[0]} ${L0[1]} L${L0[0]} ${L1[1]} L${L1[0]} ${L1[1]} L${L1[0]} ${L0[1]} Z" fill="${S.lg("kegel", [[0, "#cfe0ff", 0.04], [1, "#cfe0ff", 0.16]], 1, 0, 0, 1)}"/>`;
  for (let i = 0; i < 14; i++) { const t = rnd(), x = q[0] + (L0[0] + lw * rnd() - q[0]) * t, y = q[1] + (L0[1] + lh * rnd() - q[1]) * t; g += `<circle cx="${r(x)}" cy="${r(y)}" r=".25" fill="#fff" opacity=".5"/>`; }
  /* Notausgang-Schild (hängt an der Decke vorn links) */
  const N = P(2.2, 2.75, 15.5), nm = ms(15.5);
  g += `<line x1="${N[0]}" y1="${r(N[1] - 3)}" x2="${N[0]}" y2="${N[1]}" stroke="#333" stroke-width=".3"/><rect x="${r(N[0] - 0.3 * nm)}" y="${N[1]}" width="${r(0.6 * nm)}" height="${r(0.22 * nm)}" rx=".3" fill="#0f9a4a"/>`;
  g += `<rect x="${r(N[0] - 0.3 * nm + 0.5)}" y="${r(N[1] + 0.5)}" width="${r(0.22 * nm - 1)}" height="${r(0.22 * nm - 1)}" fill="#fff"/><circle cx="${r(N[0] - 0.3 * nm + 1.9)}" cy="${r(N[1] + 1)}" r=".35" fill="#0f9a4a"/><path d="M${r(N[0] - 0.3 * nm + 1.9)} ${r(N[1] + 1.4)} l-.8 1.2 M${r(N[0] - 0.3 * nm + 1.9)} ${r(N[1] + 1.4)} l.6 1.3" stroke="#0f9a4a" stroke-width=".35"/>`;
  g += `<path d="M${r(N[0] + 0.2)} ${r(N[1] + 0.22 * nm / 2)} l-2.4 0 m1 -1 l-1 1 l1 1" stroke="#fff" stroke-width=".45" fill="none"/>`;
  g += `<rect x="${r(N[0] - 0.3 * nm - 2)}" y="${r(N[1] - 1.5)}" width="${r(0.6 * nm + 4)}" height="${r(0.22 * nm + 3)}" fill="#3aff8a" opacity=".12" filter="url(#${S.id("blur")})"/>`;
  /* Sitzreihen: rote Sessel, von hinten nach vorn gezeichnet */
  for (let i = 10; i >= 0; i--) {
    const Z = 8.4 + i * 1.05, m = ms(Z);
    const yo = P(0, 1.02, Z)[1], yu = P(0, 0.42, Z)[1], ys = P(0, 0.48, Z - 0.35)[1];
    const sw = 0.56 * m;
    const xa = P(1.15, 0, Z)[0];
    let x = xa;
    const hell = i > 5 ? 0.18 : 0.1;
    while (x < u[0] + sw) {
      if (x + sw > o[0]) {
        g += `<path d="M${r(x + 0.4)} ${r(yu)} L${r(x + 0.4)} ${r(yo + 1.2)} Q${r(x + 0.4)} ${r(yo)} ${r(x + sw / 2)} ${r(yo - 0.3)} Q${r(x + sw - 0.4)} ${r(yo)} ${r(x + sw - 0.4)} ${r(yo + 1.2)} L${r(x + sw - 0.4)} ${r(yu)} Z" fill="${S.lg("sessel", [[0, "#c83a42"], [0.25, "#8a1a22"], [1, "#4a0a10"]])}"/>`;
        g += `<path d="M${r(x + 1.2)} ${r(yo + 0.6)} Q${r(x + sw / 2)} ${r(yo - 0.1)} ${r(x + sw - 1.2)} ${r(yo + 0.6)}" stroke="#e8a0a0" stroke-width=".4" opacity="${hell}" fill="none"/>`;
        g += `<rect x="${r(x - 0.4)}" y="${r(yu - (yu - yo) * 0.45)}" width=".9" height="${r((yu - yo) * 0.45)}" fill="#1a0a0e"/>`;
      }
      x += sw;
    }
    /* Bodenlicht am Gang links */
    const [gx, gy] = P(1.05, 0.05, Z - 0.5);
    if (gx > o[0]) g += `<circle cx="${gx}" cy="${gy}" r="${r(0.018 * m + 0.2)}" fill="#ffb84a"/><ellipse cx="${gx}" cy="${gy}" rx="${r(0.1 * m)}" ry="${r(0.025 * m)}" fill="#ffb84a" opacity=".22"/>`;
  }
  /* Schein der Leinwand auf den Sitzlehnen */
  g += `<rect x="${o[0]}" y="${o[1]}" width="${r(w)}" height="${r(h)}" fill="${S.lg("saalschein", [[0, "#3a4aa8", 0.12], [0.6, "#000", 0], [1, "#000", 0.35]])}"/>`;
  k += `<g clip-path="url(#${cid})">${g}</g>`;
  /* Türrahmen und die beiden geöffneten Türflügel */
  k += `<rect x="${r(o[0] - 1.6)}" y="${r(o[1] - 1.6)}" width="${r(w + 3.2)}" height="1.6" fill="#0c0c10"/><rect x="${r(o[0] - 1.6)}" y="${r(o[1] - 1.6)}" width="1.6" height="${r(h + 1.6)}" fill="#0c0c10"/><rect x="${u[0]}" y="${r(o[1] - 1.6)}" width="1.6" height="${r(h + 1.6)}" fill="#0c0c10"/>`;
  const fl = (X, s) => { const a = P(X, TUER.H, ZW), b = P(X, 0, ZW), c = P(X, 0, ZW - 1.0), d = P(X, TUER.H, ZW - 1.0); return poly([a, d, c, b], S.lg("fluegel" + (s > 0 ? "l" : "r"), [[0, "#3a1a22"], [1, "#5a2a34"]], 0, 0, 1, 0)) + `<line x1="${r((a[0] + d[0]) / 2 + s * 1.6)}" y1="${r((a[1] + b[1]) / 2 - 2)}" x2="${r((a[0] + d[0]) / 2 + s * 1.6)}" y2="${r((a[1] + b[1]) / 2 + 3)}" stroke="${CHROM}" stroke-width=".9"/>`; };
  k += fl(TUER.X0, 1) + fl(TUER.X1, -1);
  const unter = [];
  const add = (u2, x0, y0, x1, y1) => unter.push(Object.assign(u2, { x: (x0 + x1) / 2, y: y1, kunst: um((x0 + x1) / 2, y1, flaeche(x0, y0, x1 - x0, y1 - y0, 0.6)) }));
  add({ id: "kn_leinwand", de: "die Leinwand", syl: "LEIN-wand", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", tipp: "Hinter der Leinwand stehen die Lautsprecher – sie hat winzige Löcher für den Ton." }, L0[0] + 1, L0[1], L1[0] - 1, L1[1] - 4);
  add({ id: "kn_sitzreihe", de: "die Sitzreihe", syl: "SITZ-rei-he", it: "la fila", itSyl: "FI-la", en: "row of seats", tipp: "Auf der Kinokarte stehen Reihe und Platz." }, o[0] + 4, P(0, 1.02, 13)[1], u[0] - 3, u[1] - 4);
  add({ id: "kn_vorhang", de: "der Vorhang", syl: "VOR-hang", it: "il sipario", itSyl: "si-PA-rio", en: "curtain", tipp: "Vor dem Film geht der Vorhang auf, und das Licht wird langsam dunkel." }, P(7.15, 0, ZL)[0], P(0, 4.3, ZL)[1] + 1, Math.min(u[0], P(7.9, 0, ZL)[0]), L1[1]);
  add({ id: "kn_notausgang", de: "der Notausgang", syl: "NOT-aus-gang", it: "l'uscita di emergenza", itSyl: "u-SCI-ta di e-mer-GEN-za", en: "emergency exit", tipp: "Das grüne Schild leuchtet immer – auch wenn der Film läuft." }, N[0] - 0.3 * nm - 1.4, N[1] - 1.4, N[0] + 0.3 * nm + 1.4, N[1] + 0.22 * nm + 1.4);
  const cx = o[0] + w / 2;
  S.teil({ id: "kn_saal", de: "der Saal", syl: "SAAL", it: "la sala", itSyl: "SA-la", en: "auditorium", x: r(cx), y: u[1], steht: true, kunst: um(cx, u[1], k),
    zoom: { x: r(o[0] - 8), y: r(o[1] - 4), w: r(w + 16), h: r((w + 16) / 1.5) }, unter,
    tipp: "Saal 1 ist schon offen – Einlass ist etwa 30 Minuten vor der Vorstellung." });
}

/* =====================================================================
   5 — DIE KASSIERERIN hinter der Kasse
   ===================================================================== */
const THEKE = { Zv: 6.9, Zh: 7.3, H: 1.05 };
{
  const X = -3.7, Z = 7.3, m = ms(Z), [x, y] = P(X, 0, Z);
  const yTop = P(0, THEKE.H, THEKE.Zh)[1];
  const f = figur({ id: "b12c_kass", geschlecht: "w", pose: "halten", blick: 90, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#14141c" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" } } }, 1.66 * m, y - yTop - 1.5);
  S.teil({ id: "kn_kassiererin_p", de: "die Kassiererin", syl: "Kas-SIE-re-rin", it: "la cassiera", itSyl: "cas-SIE-ra", en: "cashier", x, y, kunst: f.svg,
    tipp: "Sie fragt: „Welcher Film? Und wo möchten Sie sitzen?“" });
}

/* =====================================================================
   6 — DIE KINOKASSE und 7 — DIE THEKE (Snacks) — mit Lupe
   ===================================================================== */
const tresen = (X0, X1, front, oben) => {
  const { Zv, Zh, H } = THEKE;
  const a = P(X0, H, Zv), b = P(X1, 0, Zv), ah = P(X0, H, Zh), bh = P(X1, H, Zh);
  const x0 = Math.max(0, a[0]), w = b[0] - x0, hh = b[1] - a[1];
  let g = schatten((x0 + b[0]) / 2, b[1] + 0.5, w * 0.55, 1.6, 0.45);
  g += `<rect x="${r(x0)}" y="${a[1]}" width="${r(w)}" height="${r(hh)}" fill="${front}"/>`;
  g += poly([[Math.max(0, ah[0]), ah[1]], [bh[0], bh[1]], [b[0] + 0.6, a[1]], [x0, a[1]]], oben);
  g += `<rect x="${r(x0)}" y="${r(a[1] - 0.4)}" width="${r(w + 0.6)}" height="1.8" fill="${S.lg("kante", [[0, "#f4f4f2"], [1, "#a8aaa8"]])}"/>`;
  g += `<rect x="${r(x0)}" y="${r(b[1] - 2.6)}" width="${r(w)}" height="2.6" fill="#0c0a0e"/>`;
  /* Stirnseite rechts sichtbar, wenn das Ende links vom Fluchtpunkt liegt */
  if (X1 < 0) { const bv = P(X1, H, Zv), bb = P(X1, 0, Zh); g += poly([bv, bh, bb, b], "#1a141e"); }
  return { g, x0, x1: b[0], yo: a[1], yu: b[1] };
};
{
  const t = tresen(-4.3, -2.55, S.lg("kassefront", [[0, "#2a2232"], [1, "#1a141e"]]), "#d9d6cf");
  let k = t.g;
  k += `<rect x="${r(t.x0 + 3)}" y="${r(t.yo + 4)}" width="${r(t.x1 - t.x0 - 6)}" height="9" rx="1" fill="#14141c" stroke="#f2c230" stroke-width=".5"/>`;
  k += `<text x="${r((t.x0 + t.x1) / 2)}" y="${r(t.yo + 10.4)}" font-size="5" text-anchor="middle" fill="#f2c230" font-family="Arial Black,Arial" font-weight="bold">KINO</text>`;
  k += `<rect x="${r(t.x0)}" y="${r(t.yo + 15.5)}" width="${r(t.x1 - t.x0)}" height=".8" fill="#ff5a8a" opacity=".8"/>`;
  /* Kassenbildschirm (Rückseite), Kundendisplay, Ticketdrucker */
  const [mx, my] = P(-4.12, THEKE.H, 7.15), m = ms(7.15);
  k += `<rect x="${r(mx - 0.5)}" y="${r(my - 0.22 * m)}" width="1" height="${r(0.22 * m)}" fill="#3a3a40"/><path d="M${r(mx - 0.2 * m)} ${r(my - 0.46 * m)} L${r(mx + 0.2 * m)} ${r(my - 0.46 * m)} L${r(mx + 0.22 * m)} ${r(my - 0.2 * m)} L${r(mx - 0.22 * m)} ${r(my - 0.2 * m)} Z" fill="#26262c"/>`;
  k += `<rect x="${r(mx + 0.3 * m)}" y="${r(my - 0.14 * m)}" width="${r(0.2 * m)}" height="${r(0.14 * m)}" rx=".5" fill="#2a2a30"/><rect x="${r(mx + 0.33 * m)}" y="${r(my - 0.12 * m)}" width="${r(0.14 * m)}" height="1.2" fill="#3a9ad8"/>`;
  const cx = (t.x0 + t.x1) / 2;
  S.teil({ id: "kn_kassiererin", de: "die Kinokasse", syl: "KI-no-kas-se", it: "la cassa del cinema", itSyl: "CAS-sa del CI-ne-ma", en: "box office", x: r(cx), y: t.yu, steht: true, kunst: um(cx, t.yu, k),
    tipp: "An der Kinokasse kauft man die Karte – oder holt die online gekaufte ab." });
}
const THEKE_UNTER = [];
{
  const t = tresen(-2.4, -0.55, S.lg("thekefront", [[0, "#3a1a22"], [1, "#24101a"]]), "#d9d6cf");
  let k = t.g;
  /* beleuchtete Front mit Popcorn-Motiv */
  k += `<rect x="${r(t.x0 + 3)}" y="${r(t.yo + 4)}" width="${r(t.x1 - t.x0 - 6)}" height="14" rx="1" fill="${S.lg("lichtfront", [[0, "#f2c230"], [1, "#e8902a"]])}"/>`;
  for (let i = 0; i < 30; i++) k += `<circle cx="${r(t.x0 + 5 + rnd() * (t.x1 - t.x0 - 10))}" cy="${r(t.yo + 6 + rnd() * 10)}" r="${r(0.6 + rnd() * 0.6)}" fill="#fff6dc" opacity=".8"/>`;
  k += `<text x="${r((t.x0 + t.x1) / 2)}" y="${r(t.yo + 13.4)}" font-size="5.4" text-anchor="middle" fill="#7a1018" font-family="Arial Black,Arial" font-weight="bold" letter-spacing=".5">SNACKS</text>`;
  /* Dinge auf der Theke (in der Lupe einzeln) */
  const auf = (X) => P(X, THEKE.H, 7.05), m = ms(7.05);
  const add = (u2, x0, y0, x1, y1) => THEKE_UNTER.push(Object.assign(u2, { x: (x0 + x1) / 2, y: y1, kunst: um((x0 + x1) / 2, y1, flaeche(x0, y0, x1 - x0, y1 - y0, 0.5)) }));
  { /* Popcorn-Eimer rot-weiß gestreift, randvoll */
    const [x, y] = auf(-2.0), w = 0.11 * m, h = 0.24 * m;
    k += `<path d="M${r(x - w)} ${r(y - h)} L${r(x + w)} ${r(y - h)} L${r(x + w * 0.75)} ${r(y)} L${r(x - w * 0.75)} ${r(y)} Z" fill="#fff"/>`;
    for (let i = 0; i < 3; i++) { const t0 = -1 + i * 0.66 + 0.11; k += `<path d="M${r(x + w * t0)} ${r(y - h)} L${r(x + w * (t0 + 0.33))} ${r(y - h)} L${r(x + w * 0.75 * (t0 + 0.33))} ${r(y)} L${r(x + w * 0.75 * t0)} ${r(y)} Z" fill="#d8202a"/>`; }
    for (let i = 0; i < 14; i++) k += `<circle cx="${r(x - w + rnd() * 2 * w)}" cy="${r(y - h - rnd() * 2.2)}" r="${r(0.55 + rnd() * 0.35)}" fill="${rnd() < 0.7 ? "#fff3cc" : "#f2d27a"}"/>`;
    add({ id: "kn_popcorn", de: "das Popcorn", syl: "POP-corn", it: "i popcorn", itSyl: "POP-corn", en: "popcorn", tipp: "Süß oder salzig? In Deutschland essen die meisten das Popcorn süß." }, x - w - 1, y - h - 3, x + w + 1, y + 0.4); }
  { /* Becher mit Deckel und Strohhalm */
    const [x, y] = auf(-1.65), w = 0.06 * m, h = 0.2 * m;
    k += `<path d="M${r(x - w)} ${r(y - h)} L${r(x + w)} ${r(y - h)} L${r(x + w * 0.78)} ${r(y)} L${r(x - w * 0.78)} ${r(y)} Z" fill="${S.lg("becher", [[0, "#1a5aa8"], [0.5, "#3a8ad8"], [1, "#1a4a8a"]], 0, 0, 1, 0)}"/><rect x="${r(x - w * 0.6)}" y="${r(y - h * 0.6)}" width="${r(w * 1.2)}" height="${r(h * 0.25)}" fill="#fff" opacity=".85"/>`;
    k += `<ellipse cx="${x}" cy="${r(y - h)}" rx="${r(w * 1.05)}" ry=".6" fill="#f4f4f2"/><line x1="${r(x + 0.4)}" y1="${r(y - h)}" x2="${r(x + 1.6)}" y2="${r(y - h - 4)}" stroke="#e8402a" stroke-width=".6"/>`;
    add({ id: "kn_getraenk", de: "der Becher", syl: "BE-cher", it: "il bicchiere", itSyl: "bic-CHIE-re", en: "cup" }, x - w - 1.2, y - h - 4.5, x + w + 1.2, y + 0.4); }
  { /* Nachos mit Käsesoße in der Schale */
    const [x, y] = auf(-1.3), w = 0.13 * m;
    k += `<path d="M${r(x - w)} ${r(y - 2.2)} L${r(x + w)} ${r(y - 2.2)} L${r(x + w * 0.85)} ${r(y)} L${r(x - w * 0.85)} ${r(y)} Z" fill="#1a1a1e"/>`;
    for (let i = 0; i < 7; i++) { const nx = x - w * 0.8 + i * w * 0.27; k += `<path d="M${r(nx - 1.2)} ${r(y - 2.2)} L${r(nx + 0.2)} ${r(y - 4.6 - (i % 2))} L${r(nx + 1.4)} ${r(y - 2.2)} Z" fill="${i % 2 ? "#f2c05a" : "#e8a83a"}"/>`; }
    k += `<ellipse cx="${r(x + w * 0.45)}" cy="${r(y - 2.6)}" rx="1.4" ry=".7" fill="#ffcf3a"/>`;
    add({ id: "kn_nachos", de: "die Nachos", syl: "NA-chos", it: "i nachos", itSyl: "NA-chos", en: "nachos", tipp: "Nachos sind Maischips – im Kino mit warmer Käsesoße." }, x - w - 0.6, y - 6, x + w + 0.6, y + 0.4); }
  { /* 3D-Brillen in der Box */
    const [x, y] = auf(-0.95), w = 0.1 * m;
    k += `<rect x="${r(x - w)}" y="${r(y - 3)}" width="${r(2 * w)}" height="3" fill="#f2f2f0"/><text x="${x}" y="${r(y - 0.9)}" font-size="1.4" text-anchor="middle" fill="#14141c" font-family="Arial Black,Arial">3D</text>`;
    k += `<path d="M${r(x - w * 0.9)} ${r(y - 4.6)} h${r(w * 0.8)} v1.6 h${r(-w * 0.8)} Z M${r(x + w * 0.1)} ${r(y - 4.6)} h${r(w * 0.8)} v1.6 h${r(-w * 0.8)} Z" fill="#2a3a5a" stroke="#0a0a0e" stroke-width=".5"/><path d="M${r(x - w * 0.1)} ${r(y - 4.2)} h${r(w * 0.2)}" stroke="#0a0a0e" stroke-width=".5"/>`;
    add({ id: "kn_brille3d", de: "die 3D-Brille", syl: "drei-DE-bril-le", it: "gli occhiali 3D", itSyl: "oc-CHIA-li tre-DI", en: "3D glasses", tipp: "Mit der 3D-Brille sieht der Film räumlich aus." }, x - w - 0.6, y - 6, x + w + 0.6, y + 0.4); }
  const cx = (t.x0 + t.x1) / 2;
  S.teil({ id: "kn_theke_kn", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: r(cx), y: t.yu, steht: true, kunst: um(cx, t.yu, k),
    zoom: { x: r(t.x0 - 3), y: r(t.yo - 30), w: r(t.x1 - t.x0 + 6), h: r((t.x1 - t.x0 + 6) / 1.5) }, unter: THEKE_UNTER,
    tipp: "An der Theke gibt es Popcorn, Nachos und Getränke." });
}

/* =====================================================================
   8 — DIE POPCORNMASCHINE (auf der Theke rechts)
   ===================================================================== */
{
  const [x, y] = P(-0.82, THEKE.H, 7.1), m = ms(7.1), w = 0.29 * m, h = 0.78 * m;
  let k = schatten(x, y, w * 1.1, 1, 0.35);
  k += `<rect x="${r(x - w)}" y="${r(y - h * 0.18)}" width="${r(2 * w)}" height="${r(h * 0.18)}" fill="${ROT}"/><rect x="${r(x - w * 0.8)}" y="${r(y - h * 0.15)}" width="${r(w * 1.6)}" height="${r(h * 0.1)}" rx=".5" fill="#6a0a10"/>`;
  /* Glasschrank mit Popcorn und Kessel */
  const g0 = y - h * 0.82, g1 = y - h * 0.18;
  k += `<rect x="${r(x - w)}" y="${r(g0)}" width="${r(2 * w)}" height="${r(g1 - g0)}" fill="#fff6dc" opacity=".35"/>`;
  k += `<path d="M${r(x - w + 0.6)} ${r(g1)} Q${r(x - w * 0.5)} ${r(g1 - h * 0.22)} ${r(x)} ${r(g1 - h * 0.25)} Q${r(x + w * 0.5)} ${r(g1 - h * 0.2)} ${r(x + w - 0.6)} ${r(g1)} Z" fill="#fff3cc"/>`;
  for (let i = 0; i < 26; i++) k += `<circle cx="${r(x - w + 1 + rnd() * (2 * w - 2))}" cy="${r(g1 - 0.6 - rnd() * h * 0.2)}" r="${r(0.5 + rnd() * 0.3)}" fill="${rnd() < 0.6 ? "#fffbe8" : "#f2d27a"}"/>`;
  k += `<path d="M${r(x - w * 0.35)} ${r(g0 + h * 0.08)} L${r(x + w * 0.35)} ${r(g0 + h * 0.08)} L${r(x + w * 0.3)} ${r(g0 + h * 0.2)} Q${r(x)} ${r(g0 + h * 0.24)} ${r(x - w * 0.3)} ${r(g0 + h * 0.2)} Z" fill="${CHROM}"/><line x1="${x}" y1="${r(g0)}" x2="${x}" y2="${r(g0 + h * 0.08)}" stroke="#9aa2a8" stroke-width=".6"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(x - w * 0.2 + rnd() * w * 0.4)}" cy="${r(g0 + h * 0.25 + rnd() * h * 0.15)}" r=".55" fill="#fffbe8"/>`;
  k += `<rect x="${r(x - w)}" y="${r(g0)}" width="${r(2 * w)}" height="${r(g1 - g0)}" fill="none" stroke="${ROT}" stroke-width="1.2"/>`;
  k += `<path d="M${r(x - w + 1)} ${r(g0 + 1)} L${r(x - w + 4)} ${r(g0 + 1)} L${r(x - w + 1)} ${r(g1 - 6)} Z" fill="#fff" opacity=".35"/>`;
  /* Kopf mit Leuchtschrift */
  k += `<path d="M${r(x - w - 1)} ${r(g0)} L${r(x - w - 1)} ${r(g0 - h * 0.1)} Q${r(x)} ${r(g0 - h * 0.2)} ${r(x + w + 1)} ${r(g0 - h * 0.1)} L${r(x + w + 1)} ${r(g0)} Z" fill="${ROT}"/>`;
  k += `<text x="${x}" y="${r(g0 - h * 0.035)}" font-size="${r(0.075 * m)}" text-anchor="middle" fill="#ffe27a" font-family="Arial Black,Arial" font-weight="bold">POPCORN</text>`;
  S.teil({ id: "kn_popcornmaschine", de: "die Popcornmaschine", syl: "POP-corn-ma-schi-ne", it: "la macchina per popcorn", itSyl: "MAC-chi-na per POP-corn", en: "popcorn machine", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Im Kessel oben platzen die Maiskörner. Unten wird das Popcorn warm gehalten." });
}
{
  /* DIE KINOKARTE — gerade gedruckt, liegt auf der Kasse */
  const [x, y] = P(-3.35, THEKE.H, 7.0), m = ms(7);
  let k = `<path d="M${r(x - 3.2)} ${r(y)} L${r(x + 2.6)} ${r(y - 0.6)} L${r(x + 3)} ${r(y - 4)} L${r(x - 2.8)} ${r(y - 3.4)} Z" fill="#fffdf4" stroke="#b9a37a" stroke-width=".2"/>`;
  k += `<path d="M${r(x + 1.2)} ${r(y - 0.4)} L${r(x + 1.5)} ${r(y - 3.8)}" stroke="#b9a37a" stroke-width=".2" stroke-dasharray=".4 .3"/>`;
  k += `<text x="${r(x - 0.8)}" y="${r(y - 2.2)}" font-size="1" fill="#14141c" font-family="Arial" transform="rotate(-6 ${x} ${y})">SAAL 1</text><text x="${r(x - 0.8)}" y="${r(y - 1)}" font-size=".8" fill="#14141c" font-family="Arial" transform="rotate(-6 ${x} ${y})">R 7 · P 12</text>`;
  S.teil({ oben: true, id: "kn_kinokarte", de: "die Kinokarte", syl: "KI-no-kar-te", it: "il biglietto del cinema", itSyl: "bi-GLIET-to del CI-ne-ma", en: "cinema ticket", x, y, kunst: um(x, y, k + flaeche(x - 4, y - 5, 8, 5.6)),
    tipp: "Saal 1, Reihe 7, Platz 12 – das steht auf der Kinokarte." });
}

/* =====================================================================
   9 — DIE SCHLANGE (Pfosten mit Gurtband und eine wartende Frau),
   10 — DER BESUCHER an der Kasse
   ===================================================================== */
{
  let k = "";
  const pfosten = (X, Z) => { const m = ms(Z), [x, y] = P(X, 0, Z), t = P(X, 0.95, Z)[1]; return { x, y, t, m, svg: schatten(x, y, 0.2 * m, 0.04 * m + 0.4, 0.4) + `<ellipse cx="${x}" cy="${r(y - 0.2)}" rx="${r(0.16 * m)}" ry="${r(0.035 * m)}" fill="#2a2a30"/><rect x="${r(x - 0.025 * m)}" y="${r(t)}" width="${r(0.05 * m)}" height="${r(y - t)}" fill="${CHROM}"/><rect x="${r(x - 0.035 * m)}" y="${r(t - 0.4)}" width="${r(0.07 * m)}" height="${r(0.05 * m)}" rx=".4" fill="#3a3a40"/>` }; };
  const gurt = (p, q) => { const y1 = p.t + 0.03 * p.m, y2 = q.t + 0.03 * q.m; return `<path d="M${p.x} ${r(y1)} Q${r((p.x + q.x) / 2)} ${r((y1 + y2) / 2 + 1.2)} ${q.x} ${r(y2)}" stroke="#c8202a" stroke-width="${r(0.05 * (p.m + q.m) / 2)}" fill="none"/>`; };
  const hinten = [pfosten(-1.5, 6.15), pfosten(-0.25, 6.15)];
  k += hinten.map((p) => p.svg).join("") + gurt(hinten[0], hinten[1]);
  /* wartende Frau in der Gasse, schaut nach links zur Kasse */
  const Xw = -1.95, Zw = 5.55, mw = ms(Zw), [xw, yw] = P(Xw, 0, Zw);
  const f = figur({ id: "b12c_wart", geschlecht: "w", pose: "stehen", blick: -90, frisur: "lang", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#d8c7a6" }, jacke: { stueck: "mantel", farbe: "#6a2a3a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "schwarz" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.64 * mw);
  k += `<g transform="translate(${r(xw)} ${r(yw)})">${f.svg}</g>`;
  const vorn = [pfosten(-2.75, 4.95), pfosten(-1.5, 4.95), pfosten(-0.25, 4.95)];
  k += gurt(hinten[1], vorn[2]) + vorn.map((p) => p.svg).join("") + gurt(vorn[0], vorn[1]) + gurt(vorn[1], vorn[2]);
  S.teil({ id: "kn_warteschlange", de: "die Schlange", syl: "SCHLAN-ge", it: "la fila", itSyl: "FI-la", en: "queue", x: r(xw), y: r(yw), kunst: um(xw, yw, k),
    tipp: "In der Schlange wartet man, bis man dran ist. „Wer ist der Letzte?“" });
}
{
  const X = -2.85, Z = 6.3, m = ms(Z), [x, y] = P(X, 0, Z);
  const f = figur({ id: "b12c_bes", geschlecht: "m", pose: "halten", blick: -90, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e8e8e8" }, jacke: { stueck: "jacke", farbe: "#2f5f95" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.8 * m);
  S.teil({ id: "kn_besucher", de: "der Besucher", syl: "Be-SU-cher", it: "lo spettatore", itSyl: "spet-ta-TO-re", en: "cinemagoer", x, y, kunst: schatten(0, 0.3, 9, 1.4, 0.4) + f.svg,
    tipp: "Er sagt: „Zwei Karten für 20:15 Uhr, bitte. Reihe 7, in der Mitte.“" });
}

/* =====================================================================
   11 — DER AUFSTELLER (Pappfigur zum neuen Film, rechts vorn)
   ===================================================================== */
{
  const X = 2.68, Z = 4.4, m = ms(Z), [x, y] = P(X, 0, Z), w = 0.6 * m, h = 1.85 * m;
  let k = schatten(x, y, w * 0.45, 1.8, 0.45);
  /* Stütze hinten */
  k += `<path d="M${r(x + w * 0.1)} ${r(y - h * 0.5)} L${r(x + w * 0.38)} ${r(y)} L${r(x + w * 0.32)} ${r(y)} Z" fill="#8a7a5a"/>`;
  /* Mondsichel als Form, davor Astronaut und Rakete */
  k += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2)} ${r(y - h * 0.62)} Q${r(x - w * 0.55)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + w * 0.55)} ${r(y - h)} ${r(x + w / 2)} ${r(y - h * 0.62)} L${r(x + w / 2)} ${r(y)} Z" fill="${S.lg("aufst", [[0, "#0a1440"], [0.6, "#2a3a8a"], [1, "#4a2a6a"]])}"/>`;
  k += `<circle cx="${r(x + w * 0.12)}" cy="${r(y - h * 0.78)}" r="${r(w * 0.3)}" fill="${S.rg("aufmond", [[0, "#fffbe8"], [1, "#cfc6a0"]])}"/>`;
  for (const [dx, dy, rr] of [[0.02, 0.74, 0.05], [0.22, 0.84, 0.04], [0.18, 0.7, 0.03]]) k += `<circle cx="${r(x + w * dx)}" cy="${r(y - h * dy)}" r="${r(w * rr)}" fill="#bdb38e"/>`;
  /* Astronaut */
  const ax = x - w * 0.08, ay = y - h * 0.22;
  k += `<rect x="${r(ax - 5)}" y="${r(ay - 26)}" width="10" height="16" rx="3" fill="#eef0f2"/><circle cx="${r(ax)}" cy="${r(ay - 30)}" r="5.4" fill="#eef0f2"/><circle cx="${r(ax)}" cy="${r(ay - 30)}" r="3.8" fill="${S.lg("visier", [[0, "#f2b84a"], [1, "#8a4a1a"]])}"/><path d="M${r(ax - 2)} ${r(ay - 32)} q1.2 -1 2.4 -.4" stroke="#fff" stroke-width=".6" opacity=".7" fill="none"/>`;
  k += `<rect x="${r(ax - 4.6)}" y="${r(ay - 10)}" width="4" height="10" rx="1.6" fill="#e2e4e6"/><rect x="${r(ax + 0.6)}" y="${r(ay - 10)}" width="4" height="10" rx="1.6" fill="#e2e4e6"/><rect x="${r(ax - 8)}" y="${r(ay - 24)}" width="3" height="10" rx="1.4" fill="#e2e4e6" transform="rotate(20 ${r(ax - 6.5)} ${r(ay - 24)})"/><rect x="${r(ax + 5)}" y="${r(ay - 30)}" width="3" height="10" rx="1.4" fill="#e2e4e6" transform="rotate(-40 ${r(ax + 6.5)} ${r(ay - 24)})"/>`;
  k += `<rect x="${r(ax - 1.8)}" y="${r(ay - 22)}" width="3.6" height="2.4" fill="#c8202a"/>`;
  k += `<text x="${x}" y="${r(y - h * 0.1)}" font-size="${r(0.05 * m)}" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="bold">DIE REISE ZUM MOND</text>`;
  k += `<text x="${x}" y="${r(y - h * 0.04)}" font-size="${r(0.03 * m)}" text-anchor="middle" fill="#cfd6ff" font-family="Arial">JETZT IM KINO · SAAL 1</text>`;
  k += `<path d="M${r(x - w / 2)} ${r(y - h * 0.62)} Q${r(x - w * 0.55)} ${r(y - h)} ${r(x)} ${r(y - h)}" stroke="#fff" stroke-width=".8" opacity=".2" fill="none"/>`;
  S.teil({ id: "kn_aufsteller", de: "der Aufsteller", syl: "AUF-stel-ler", it: "la sagoma pubblicitaria", itSyl: "SA-go-ma pub-bli-ci-TA-ria", en: "cardboard standee", x, y, kunst: um(x, y, k),
    tipp: "Der Aufsteller aus Pappe macht Werbung für einen neuen Film." });
}

S.defs = [...new Set(S.defs)];   /* doppelte Verläufe nur einmal */
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kino.js"));
console.log(aus);
