#!/usr/bin/env node
/* =====================================================================
   DAS KONZERT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Technical Rider eines Kulturamts, Bonedo „Soundcheck-Tipps
   vom FOH für Musiker“, Bühnenpläne von Club-Bands):
   - Rock-/Popkonzert im Club: Blick vom FOH-Platz (Front of House)
     hinten im Saal über das MISCHPULT (Fader, Touchscreens, Kopfhörer)
     auf die BÜHNE.
   - Auf der Bühne die Backline: SCHLAGZEUG auf dem Drumpodest (Bassdrum,
     Snare, Toms, BECKEN, Hi-Hat, Overhead-Mikrofone), GitarrenVERSTÄRKER
     (Topteil auf 4×12-Box, davor ein Mikrofon), Bassverstärker, KEYBOARD,
     E-GITARRE im Ständer, vorn MONITORBOXEN (Wedges), Gesangs-MIKROFON
     auf dem Ständer.
   - Neben der Bühne die PA-BOXEN (Subwoofer und Tops), darüber die
     LICHTTRAVERSE mit SCHEINWERFERN (Moving Heads, PARs), hinten die
     VIDEOWAND (LED). Vor der Bühne die ABSPERRUNG (Wellenbrecher) mit
     Graben, davor das PUBLIKUM mit erhobenen Händen und HANDYS.
   BLICK: Zentralperspektive vom FOH-Podest, Augenhöhe 2,2 m, Fluchtpunkt
   (160 | 72); Bühnenkante 9,5 m entfernt (≈ 24 Einheiten je Meter,
   Bühnenhöhe 1,2 m), Sänger 1,80 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "konzert", titel: "Das Konzert", emoji: "🎤", thema: "Freizeit", kuerzel: "b12e", fassung: 852 });
const rnd = zufall(1969);
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
const VX = 160, HY = 72, E = 2.2, F = 230;
const ms = (Z) => F / Z;
const P = (X, H, Z) => [r(VX + F * X / Z), r(HY + F * (E - H) / Z)];
const BUE = { Zv: 9.5, Zh: 15.2, H: 1.2, X: 6.0 };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("blur")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>`);
const SCHWARZ = S.lg("schwarz", [[0, "#2a2a30"], [1, "#0e0e12"]]);
const TOLEX = S.lg("tolex", [[0, "#26262a"], [0.5, "#34343a"], [1, "#18181c"]], 0, 0, 1, 0);
const CHROM = S.lg("chrom", [[0, "#6e767d"], [0.35, "#f4f6f7"], [0.6, "#b9c0c6"], [1, "#5e666d"]], 0, 0, 1, 0);
const ALU = S.lg("alu", [[0, "#cfd4d8"], [1, "#8a9096"]]);

/* =====================================================================
   KULISSE — schwarzer Club-Saal, Bühnenportal, Boden mit Licht
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="${S.lg("saal", [[0, "#07060c"], [0.5, "#120e1c"], [1, "#0a0810"]])}"/>`;
  /* Rückwand der Bühne (über der Videowand) */
  const a = P(-7, 7, BUE.Zh + 0.3), b = P(7, BUE.H, BUE.Zh + 0.3);
  k += `<rect x="${a[0]}" y="0" width="${r(b[0] - a[0])}" height="${b[1]}" fill="#0a0a10"/>`;
  /* Seitenvorhänge (schwarzer Molton) */
  for (const s of [-1, 1]) { const p = P(s * 6.2, 0, BUE.Zv), q = P(s * 6.2, 7, BUE.Zh); k += poly([P(s * 6.2, 7, BUE.Zv), q, P(s * 6.2, BUE.H, BUE.Zh), P(s * 6.2, BUE.H, BUE.Zv)], "#121018"); for (let i = 1; i < 6; i++) { const Z = BUE.Zv + i * (BUE.Zh - BUE.Zv) / 6, t = P(s * 6.2, 7, Z), u = P(s * 6.2, BUE.H, Z); k += `<line x1="${t[0]}" y1="${t[1]}" x2="${u[0]}" y2="${u[1]}" stroke="#08060c" stroke-width=".6"/>`; } }
  /* Saalboden (dunkel, mit Lichtpfützen) */
  const f0 = P(0, 0, BUE.Zv);
  k += `<rect x="0" y="${f0[1]}" width="320" height="${r(200 - f0[1])}" fill="${S.lg("boden", [[0, "#16121e"], [1, "#0c0a10"]])}"/>`;
  k += `<ellipse cx="160" cy="${r(f0[1] + 8)}" rx="150" ry="12" fill="#c83aa8" opacity=".12" filter="url(#${S.id("blur")})"/>`;
  /* ferne Notausgang-Schilder an den Saalwänden */
  for (const [x, y] of [[6, 52], [306, 52]]) k += `<rect x="${x - 4}" y="${y}" width="8" height="3.4" rx=".4" fill="#12b04a"/><rect x="${x - 6}" y="${y - 2}" width="12" height="7.4" fill="#3aff8a" opacity=".12" filter="url(#${S.id("blur")})"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE VIDEOWAND (LED-Wand hinten auf der Bühne)
   ===================================================================== */
{
  const a = P(-5.4, 6.4, BUE.Zh), b = P(5.4, BUE.H + 0.6, BUE.Zh), w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" fill="${S.lg("led", [[0, "#0a0a3a"], [0.5, "#3a0a6a"], [1, "#0a2a5a"]])}"/>`;
  /* Nordlicht-Grafik */
  for (const [c, dy, amp] of [["#3affc8", 0.45, 8], ["#8a5aff", 0.55, 10], ["#ff4ab0", 0.62, 6]]) k += `<path d="M${a[0]} ${r(a[1] + h * dy)} Q${r(a[0] + w * 0.25)} ${r(a[1] + h * dy - amp)} ${r(a[0] + w * 0.5)} ${r(a[1] + h * dy)} T${b[0]} ${r(a[1] + h * dy)}" stroke="${c}" stroke-width="${r(h * 0.07)}" fill="none" opacity=".55" filter="url(#${S.id("blur")})"/>`;
  k += `<text x="${r(a[0] + w / 2)}" y="${r(a[1] + h * 0.28)}" font-size="${r(h * 0.15)}" text-anchor="middle" fill="#ffffff" font-family="Arial Black,Arial" font-weight="bold" letter-spacing="1.2">NORDLICHT</text>`;
  k += `<text x="${r(a[0] + w / 2)}" y="${r(a[1] + h * 0.38)}" font-size="${r(h * 0.06)}" text-anchor="middle" fill="#cfe0ff" font-family="Arial" letter-spacing="1">LIVE · TOUR 2026</text>`;
  S.def(`<pattern id="${S.id("pixel")}" width="1.6" height="1.6" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="none" stroke="#000" stroke-width=".25" opacity=".45"/></pattern>`);
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" fill="url(#${S.id("pixel")})"/>`;
  const cx = a[0] + w / 2;
  S.teil({ id: "kz_videowand", de: "die Videowand", syl: "VI-de-o-wand", it: "il videowall", itSyl: "vi-de-o-UOLL", en: "video wall", x: r(cx), y: b[1], kunst: um(cx, b[1], k),
    tipp: "Die Videowand besteht aus vielen kleinen LED-Lämpchen." });
}

/* =====================================================================
   2 — DIE BÜHNE (schwarzer Boden, Kante, Drumpodest)
   ===================================================================== */
{
  const { Zv, Zh, H, X } = BUE;
  const vl = P(-X, H, Zv), vr = P(X, H, Zv), hl = P(-X, H, Zh), hr = P(X, H, Zh), ul = P(-X, 0, Zv), ur = P(X, 0, Zv);
  let k = poly([hl, hr, vr, vl], S.lg("bboden", [[0, "#1a1820"], [1, "#2c2834"]]));
  for (let Xi = -X + 1.2; Xi < X; Xi += 1.2) { const a = P(Xi, H, Zh), b = P(Xi, H, Zv); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#0e0c12" stroke-width=".35"/>`; }
  /* Gaffa-Markierungen und Kabel */
  k += `<path d="M${P(-3, H, 11)[0]} ${P(-3, H, 11)[1]} Q${P(0, H, 10.4)[0]} ${P(0, H, 10.4)[1]} ${P(3, H, 12)[0]} ${P(3, H, 12)[1]}" stroke="#050506" stroke-width=".8" fill="none"/>`;
  /* Lichtpfützen der Scheinwerfer */
  for (const [Xl, Zl, c] of [[-0.6, 10.4, "#ffd27a"], [2.4, 11, "#c83aff"], [-3.5, 12, "#3ac8ff"]]) { const p = P(Xl, H, Zl); k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(1.1 * ms(Zl))}" ry="${r(0.18 * ms(Zl))}" fill="${c}" opacity=".35" filter="url(#${S.id("blur")})"/>`; }
  /* Drumpodest */
  const d = [P(-0.6, H + 0.5, 12.2), P(1.9, H + 0.5, 12.2), P(1.9, H + 0.5, 14.4), P(-0.6, H + 0.5, 14.4)], dv = [P(-0.6, H, 12.2), P(1.9, H, 12.2)];
  k += poly([d[3], d[2], d[1], d[0]], "#2a2632") + poly([d[0], d[1], dv[1], dv[0]], "#121016");
  k += `<rect x="${d[0][0]}" y="${r(d[0][1] + 0.6)}" width="${r(d[1][0] - d[0][0])}" height=".8" fill="#3ac8ff" opacity=".6"/>`;
  /* Bühnenkante (Front, schwarzer Molton) */
  k += poly([vl, vr, ur, ul], "#0a090e") + `<rect x="${vl[0]}" y="${r(vl[1] - 0.4)}" width="${r(vr[0] - vl[0])}" height="1" fill="#f2f2f2" opacity=".35"/>`;
  const cx = (vl[0] + vr[0]) / 2;
  S.teil({ id: "buehne", de: "die Bühne", syl: "BÜH-ne", it: "il palco", itSyl: "PAL-co", en: "stage", x: r(cx), y: ul[1], kunst: um(cx, ul[1], k),
    tipp: "Sie steht höher als der Boden — damit alle sie sehen." });
}

/* =====================================================================
   3 — DER VERSTÄRKER (Gitarre rechts, Bass links: Topteil auf Box)
   ===================================================================== */
{
  let k = "";
  const stack = (X, Z, bass) => {
    const m = ms(Z), [x, y] = P(X, BUE.H, Z), w = (bass ? 0.62 : 0.76) * m, hc = (bass ? 1.0 : 0.76) * m, hh = 0.27 * m;
    let g = schatten(x, y, w * 0.7, 1, 0.5);
    g += `<rect x="${r(x - w / 2)}" y="${r(y - hc)}" width="${r(w)}" height="${r(hc)}" rx=".6" fill="${TOLEX}"/>`;
    g += `<rect x="${r(x - w / 2 + 0.8)}" y="${r(y - hc + 0.8)}" width="${r(w - 1.6)}" height="${r(hc - 1.6)}" fill="${S.lg("bespannung", [[0, "#3a3628"], [1, "#2a2618"]])}"/>`;
    S.def(`<pattern id="${S.id("gitter")}" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M0 0 L1 1 M1 0 L0 1" stroke="#4a4634" stroke-width=".18"/></pattern>`);
    g += `<rect x="${r(x - w / 2 + 0.8)}" y="${r(y - hc + 0.8)}" width="${r(w - 1.6)}" height="${r(hc - 1.6)}" fill="url(#${S.id("gitter")})"/>`;
    g += `<rect x="${r(x - w * 0.14)}" y="${r(y - hc + 1.4)}" width="${r(w * 0.28)}" height="1.4" rx=".3" fill="#d8d0b8"/>`;
    /* Topteil mit Reglern und rotem Lämpchen */
    g += `<rect x="${r(x - w / 2)}" y="${r(y - hc - hh)}" width="${r(w)}" height="${r(hh)}" rx=".6" fill="${TOLEX}"/><rect x="${r(x - w / 2 + 0.8)}" y="${r(y - hc - hh * 0.55)}" width="${r(w - 1.6)}" height="${r(hh * 0.35)}" fill="${bass ? "#c9cfd4" : "#d8b866"}"/>`;
    for (let i = 0; i < 7; i++) g += `<circle cx="${r(x - w / 2 + 2 + i * (w - 4) / 6)}" cy="${r(y - hc - hh * 0.38)}" r=".42" fill="#1a1a1a"/>`;
    g += `<circle cx="${r(x + w / 2 - 1.4)}" cy="${r(y - hc - hh * 0.78)}" r=".5" fill="#ff3a2a"/>`;
    /* Mikrofon vor dem Lautsprecher (SM57 am Galgen) */
    g += `<line x1="${r(x - w * 0.15)}" y1="${y}" x2="${r(x - w * 0.15)}" y2="${r(y - hc * 0.35)}" stroke="#1a1a1e" stroke-width=".5"/><rect x="${r(x - w * 0.15 - 0.5)}" y="${r(y - hc * 0.42)}" width="1" height="${r(hc * 0.1)}" rx=".4" fill="#3a3a40"/>`;
    return g;
  };
  k += stack(-5.0, 13.6, true) + stack(4.5, 13.6, false);
  const [x, y] = P(4.5, BUE.H, 13.6);
  S.teil({ id: "verstaerker", de: "der Verstärker", syl: "Ver-STÄR-ker", it: "l'amplificatore", itSyl: "am-pli-fi-ca-TO-re", en: "amplifier", x, y, kunst: um(x, y, k),
    tipp: "Der Verstärker macht den Klang der E-Gitarre laut. Ein Mikrofon davor nimmt ihn für die Anlage ab." });
}

/* =====================================================================
   4 — DAS SCHLAGZEUG auf dem Podest — Lupe: Becken, Trommel, Stöcke
   ===================================================================== */
{
  const Z = 13.3, m = ms(Z), [x, y] = P(0.65, BUE.H + 0.5, Z);
  let k = schatten(x, y, 0.9 * m, 1, 0.45);
  const u = [];
  const add = (q, x0, y0, x1, y1) => u.push(Object.assign(q, { x: (x0 + x1) / 2, y: y1, kunst: um((x0 + x1) / 2, y1, flaeche(x0, y0, x1 - x0, y1 - y0, 0.5)) }));
  const kessel = (cx, cy, rw, rh, d, farbe) => `<rect x="${r(cx - rw)}" y="${r(cy - rh)}" width="${r(2 * rw)}" height="${r(d)}" fill="${farbe}"/><ellipse cx="${r(cx)}" cy="${r(cy - rh + d)}" rx="${r(rw)}" ry="${r(rh * 0.25)}" fill="${farbe}"/><ellipse cx="${r(cx)}" cy="${r(cy - rh)}" rx="${r(rw)}" ry="${r(rh * 0.25)}" fill="#e8e6e0" stroke="#9aa2a8" stroke-width=".3"/>`;
  const ROT = S.lg("kessel", [[0, "#5a0a14"], [0.4, "#b8202e"], [1, "#4a0810"]], 0, 0, 1, 0);
  /* Hocker (leer, der Schlagzeuger ist gerade nicht da) */
  k += `<rect x="${r(x + 0.3 * m - 0.4)}" y="${r(y - 0.5 * m)}" width=".8" height="${r(0.5 * m)}" fill="#1a1a1e"/><ellipse cx="${r(x + 0.3 * m)}" cy="${r(y - 0.5 * m)}" rx="${r(0.16 * m)}" ry=".9" fill="#2a2a2e"/>`;
  /* Bassdrum mit Logo auf dem Fell */
  const bd = 0.28 * m;
  k += `<circle cx="${x}" cy="${r(y - bd)}" r="${r(bd)}" fill="${ROT}"/><circle cx="${x}" cy="${r(y - bd)}" r="${r(bd * 0.9)}" fill="#1a1a22"/><text x="${x}" y="${r(y - bd + 1)}" font-size="${r(bd * 0.32)}" text-anchor="middle" fill="#3affc8" font-family="Arial Black,Arial" font-weight="bold">NORD</text>`;
  k += `<circle cx="${x}" cy="${r(y - bd)}" r="${r(bd)}" fill="none" stroke="${CHROM}" stroke-width=".6"/>`;
  /* Toms und Snare (Trommeln), Standtom */
  const toms = [[-0.22, 0.62, 0.11], [0.2, 0.62, 0.12]];
  for (const [dx, hh, rw] of toms) k += kessel(x + dx * m, y - hh * m, rw * m, rw * m * 0.9, rw * m * 1.1, ROT);
  k += kessel(x - 0.5 * m, y - 0.6 * m, 0.17 * m, 0.1 * m, 0.08 * m, "#c9cfd4") + `<line x1="${r(x - 0.5 * m)}" y1="${r(y - 0.5 * m)}" x2="${r(x - 0.5 * m)}" y2="${y}" stroke="#555" stroke-width=".5"/>`;
  k += kessel(x + 0.55 * m, y - 0.48 * m, 0.17 * m, 0.13 * m, 0.42 * m, ROT);
  /* Trommelstöcke auf der Snare */
  const sx = x - 0.5 * m, sy = y - 0.6 * m - 0.1 * m;
  k += `<line x1="${r(sx - 2.4)}" y1="${r(sy + 0.2)}" x2="${r(sx + 2.6)}" y2="${r(sy - 0.6)}" stroke="#e8d0a0" stroke-width=".45" stroke-linecap="round"/><line x1="${r(sx - 2.2)}" y1="${r(sy + 0.7)}" x2="${r(sx + 2.8)}" y2="${r(sy - 0.1)}" stroke="#d8bc88" stroke-width=".45" stroke-linecap="round"/>`;
  /* Becken (Hi-Hat, Crash, Ride) auf Ständern, Overhead-Mikrofone */
  const becken = (bx, hh, rw, tilt) => `<line x1="${r(bx)}" y1="${r(y)}" x2="${r(bx)}" y2="${r(y - hh * m)}" stroke="${CHROM}" stroke-width=".45"/><ellipse cx="${r(bx)}" cy="${r(y - hh * m)}" rx="${r(rw * m)}" ry="${r(rw * m * 0.22)}" fill="${S.lg("becken", [[0, "#f6dc8a"], [0.5, "#c99b3c"], [1, "#e8c46a"]])}" transform="rotate(${tilt} ${r(bx)} ${r(y - hh * m)})"/>`;
  k += becken(x - 0.75 * m, 1.0, 0.18, 0) + becken(x - 0.55 * m, 1.35, 0.22, -12) + becken(x + 0.65 * m, 1.25, 0.25, 10);
  for (const s of [-1, 1]) k += `<path d="M${r(x + s * 0.9 * m)} ${r(y)} L${r(x + s * 0.9 * m)} ${r(y - 1.7 * m)} L${r(x + s * 0.5 * m)} ${r(y - 1.6 * m)}" stroke="#1a1a1e" stroke-width=".4" fill="none"/><rect x="${r(x + s * 0.5 * m - 0.4)}" y="${r(y - 1.62 * m)}" width=".8" height="2" fill="#2a2a30"/>`;
  add({ id: "kz_becken", de: "das Becken", syl: "BE-cken", it: "il piatto", itSyl: "PIAT-to", en: "cymbal", tipp: "Die Becken sind aus Messing – sie zischen und klirren." }, x - 0.98 * m, y - 1.48 * m, x - 0.36 * m, y - 1.0 * m);
  add({ id: "kz_trommel", de: "die Trommel", syl: "TROM-mel", it: "il tamburo", itSyl: "tam-BU-ro", en: "drum" }, x - 0.34 * m, y - 0.75 * m, x + 0.34 * m, y - 0.38 * m);
  add({ id: "kz_trommelstock", de: "der Trommelstock", syl: "TROM-mel-stock", it: "la bacchetta", itSyl: "bac-CHET-ta", en: "drumstick", tipp: "Schlagzeuger sagen meist „Sticks“." }, sx - 3.4, sy - 2, sx + 3.4, sy + 1.6);
  S.teil({ id: "schlagzeug", de: "das Schlagzeug", syl: "SCHLAG-zeug", it: "la batteria", itSyl: "bat-te-RI-a", en: "drum kit", x, y, steht: true, kunst: um(x, y, k),
    zoom: { x: r(x - 1.1 * m), y: r(y - 1.9 * m), w: r(2.2 * m), h: r(2.2 * m / 1.5) }, unter: u,
    tipp: "Das Schlagzeug steht auf einem Podest, damit man den Schlagzeuger sieht." });
}

/* =====================================================================
   5 — DAS KEYBOARD und 6 — DIE E-GITARRE im Ständer
   ===================================================================== */
{
  const Z = 12.2, m = ms(Z), [x, y] = P(-3.4, BUE.H, Z), w = 0.62 * m, hk = 0.92 * m;
  let k = schatten(x, y, w, 0.8, 0.4);
  k += `<path d="M${r(x - w * 0.7)} ${r(y)} L${r(x + w * 0.7)} ${r(y - hk)} M${r(x + w * 0.7)} ${r(y)} L${r(x - w * 0.7)} ${r(y - hk)}" stroke="#2a2a30" stroke-width=".9"/>`;
  k += `<rect x="${r(x - w)}" y="${r(y - hk - 2.6)}" width="${r(2 * w)}" height="2.6" rx=".5" fill="#1a1a1e"/>`;
  for (let i = 0; i < 26; i++) k += `<rect x="${r(x - w + 0.6 + i * (2 * w - 1.2) / 26)}" y="${r(y - hk - 1.4)}" width="${r((2 * w - 1.2) / 26 - 0.1)}" height="1.4" fill="#f4f4f0"/>`;
  for (let i = 0; i < 26; i++) if ([1, 2, 4, 5, 6].includes(i % 7)) k += `<rect x="${r(x - w + 0.6 + i * (2 * w - 1.2) / 26 - 0.25)}" y="${r(y - hk - 1.4)}" width=".45" height=".8" fill="#111"/>`;
  k += `<rect x="${r(x - w * 0.3)}" y="${r(y - hk - 2.3)}" width="${r(w * 0.6)}" height=".7" fill="#3ac8ff"/>`;
  S.teil({ id: "kz_keyboard", de: "das Keyboard", syl: "KEY-board", it: "la tastiera", itSyl: "ta-STIE-ra", en: "keyboard", x, y, kunst: um(x, y, k),
    tipp: "Das Keyboard hat Tasten wie ein Klavier, klingt aber elektronisch." });
}
{
  const Z = 11.4, m = ms(Z), [x, y] = P(-2.1, BUE.H, Z);
  let k = schatten(x, y, 0.2 * m, 0.6, 0.4);
  k += `<path d="M${r(x - 0.16 * m)} ${r(y)} L${r(x)} ${r(y - 0.3 * m)} L${r(x + 0.16 * m)} ${r(y)}" stroke="#1a1a1e" stroke-width=".6" fill="none"/>`;
  /* Korpus (Single-Cut, sunburst), Hals, Kopf */
  const by = y - 0.33 * m;
  k += `<path d="M${r(x - 0.17 * m)} ${r(by)} Q${r(x - 0.2 * m)} ${r(by - 0.18 * m)} ${r(x - 0.1 * m)} ${r(by - 0.22 * m)} Q${r(x - 0.05 * m)} ${r(by - 0.28 * m)} ${r(x + 0.02 * m)} ${r(by - 0.26 * m)} Q${r(x + 0.1 * m)} ${r(by - 0.3 * m)} ${r(x + 0.15 * m)} ${r(by - 0.22 * m)} Q${r(x + 0.21 * m)} ${r(by - 0.1 * m)} ${r(x + 0.16 * m)} ${r(by)} Q${r(x)} ${r(by + 0.06 * m)} ${r(x - 0.17 * m)} ${r(by)} Z" fill="${S.rg("sunburst", [[0, "#f2b84a"], [0.6, "#c8501a"], [1, "#3a0e06"]], 0.45, 0.5, 0.6)}"/>`;
  k += `<rect x="${r(x - 0.6)}" y="${r(by - 0.78 * m)}" width="1.2" height="${r(0.56 * m)}" fill="#5a3214"/><path d="M${r(x - 1)} ${r(by - 0.78 * m)} L${r(x + 1)} ${r(by - 0.78 * m)} L${r(x + 0.8)} ${r(by - 0.92 * m)} L${r(x - 0.8)} ${r(by - 0.92 * m)} Z" fill="#1a0e06"/>`;
  k += `<rect x="${r(x - 0.08 * m)}" y="${r(by - 0.12 * m)}" width="${r(0.16 * m)}" height=".7" fill="#1a1a1a"/><circle cx="${r(x + 0.07 * m)}" cy="${r(by - 0.04 * m)}" r=".5" fill="#e8d8a0"/>`;
  S.teil({ oben: true, id: "kz_egitarre", de: "die E-Gitarre", syl: "E-gi-tar-re", it: "la chitarra elettrica", itSyl: "chi-TAR-ra e-LET-tri-ca", en: "electric guitar", x, y, kunst: um(x, y, k),
    tipp: "Die E-Gitarre im Ständer ist die Ersatzgitarre – falls eine Saite reißt." });
}

/* =====================================================================
   7 — DER SÄNGER mit 8 — DEM MIKROFON, 9 — DER GITARRIST
   ===================================================================== */
{
  const X = -0.55, Z = 10.4, m = ms(Z), [x, y] = P(X, BUE.H, Z);
  const f = figur({ id: "b12e_saenger", geschlecht: "m", pose: "winken", blick: 12, frisur: "locken", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#1a1a1e" }, jacke: { stueck: "jacke", farbe: "#3a2a22" }, unterteil: { stueck: "jeans", farbe: "#1e2430" }, schuhe: { stueck: "stiefel", farbe: "schwarz" } } }, 1.8 * m);
  S.teil({ id: "saenger", de: "der Sänger", syl: "SÄN-ger", it: "il cantante", itSyl: "can-TAN-te", en: "singer", x, y, kunst: schatten(0, 0.3, 6, 1, 0.5) + f.svg,
    tipp: "Er ruft: „Hallo Hamburg! Seid ihr gut drauf?“" });
}
{
  const Z = 10.2, m = ms(Z), [x, y] = P(-0.72, BUE.H, Z);
  const mh = P(-0.72, BUE.H + 1.62, Z)[1];
  let k = schatten(x, y, 0.14 * m, 0.5, 0.45);
  k += `<path d="M${r(x - 0.14 * m)} ${r(y)} L${x} ${r(y - 0.1 * m)} L${r(x + 0.14 * m)} ${r(y)}" stroke="#1a1a1e" stroke-width=".6" fill="none"/>`;
  k += `<line x1="${x}" y1="${r(y - 0.1 * m)}" x2="${x}" y2="${r(mh + 2.6)}" stroke="${CHROM}" stroke-width=".55"/><line x1="${x}" y1="${r(mh + 2.6)}" x2="${r(x + 1.6)}" y2="${r(mh + 1.2)}" stroke="#1a1a1e" stroke-width=".6"/>`;
  k += `<rect x="${r(x + 1.2)}" y="${r(mh - 0.4)}" width="1.1" height="2.4" rx=".5" fill="#2a2a30" transform="rotate(-50 ${r(x + 1.7)} ${r(mh + 0.8)})"/><circle cx="${r(x + 2.3)}" cy="${r(mh - 0.2)}" r=".95" fill="${S.rg("korb", [[0, "#e8ecef"], [1, "#7a8288"]])}"/>`;
  k += `<path d="M${x} ${r(y - 0.1 * m)} Q${r(x + 4)} ${r(y + 1)} ${r(x + 8)} ${r(y - 0.2)}" stroke="#08080a" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "mikrofon", de: "das Mikrofon", syl: "Mi-kro-FON", it: "il microfono", itSyl: "mi-CRO-fo-no", en: "microphone", x, y, kunst: um(x, y, k + flaeche(x - 2, mh - 2.4, 6, y - mh + 2.4)),
    tipp: "Ins Mikrofon singt der Sänger. Ein Kabel führt zum Mischpult." });
}
{
  const X = 2.35, Z = 11, m = ms(Z), [x, y] = P(X, BUE.H, Z);
  const f = figur({ id: "b12e_git", geschlecht: "m", pose: "halten", blick: -25, frisur: "lang", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#8a1a22" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" } } }, 1.82 * m);
  /* Gitarre in den Händen (Korpus vor der Hüfte, Hals schräg nach links oben) */
  const hs = [f.z.handL, f.z.handR].filter(Boolean).map((h) => [h.x * f.k, h.y * f.k]).sort((a, b) => a[0] - b[0]);
  const [hx, hy] = [(hs[0][0] + hs[1][0]) / 2, Math.max(hs[0][1], hs[1][1])];
  const s = m / 22;
  const g = `<g transform="translate(${r(hx + 0.6)} ${r(hy + 1.6)}) rotate(28) scale(${s.toFixed(2)})"><rect x="-17" y="-.9" width="15" height="1.8" fill="#3a1e0a"/><rect x="-19.5" y="-1.3" width="3" height="2.6" rx=".4" fill="#111"/>` +
    `<path d="M-3 -3.2 Q0 -4.6 2.4 -3.4 Q4.6 -4.4 6.4 -2.6 Q7.4 0 6.4 2.6 Q4.6 4.4 2.4 3.4 Q0 4.6 -3 3.2 Q-4.2 0 -3 -3.2 Z" fill="${S.lg("strat", [[0, "#f4f4f0"], [1, "#b8b8b0"]])}"/><path d="M-1 -2 L4 -2 L4 2 L-1 2 Z" fill="#1a1a1a" opacity=".85"/><line x1="-18" y1="0" x2="4" y2="0" stroke="#d8d8d0" stroke-width=".25"/></g>`;
  S.teil({ id: "gitarrist", de: "der Gitarrist", syl: "Gi-tar-RIST", it: "il chitarrista", itSyl: "chi-tar-RI-sta", en: "guitarist", x, y, kunst: schatten(0, 0.3, 6, 1, 0.5) + f.svg + g,
    tipp: "Der Gitarrist spielt E-Gitarre. Das Kabel steckt im Verstärker." });
}

/* =====================================================================
   10 — DIE MONITORBOXEN (Wedges vorn auf der Bühne)
   ===================================================================== */
{
  let k = "";
  for (const [X, Z] of [[-0.6, 9.85], [2.3, 9.9]]) {
    const m = ms(Z), [x, y] = P(X, BUE.H, Z), w = 0.32 * m, h = 0.3 * m;
    k += `<path d="M${r(x - w)} ${r(y)} L${r(x + w)} ${r(y)} L${r(x + w * 0.9)} ${r(y - h)} L${r(x - w * 0.9)} ${r(y - h * 0.55)} Z" fill="${TOLEX}"/>`;
    k += `<path d="M${r(x - w * 0.8)} ${r(y - 0.6)} L${r(x + w * 0.8)} ${r(y - 0.6)} L${r(x + w * 0.75)} ${r(y - h + 0.8)} L${r(x - w * 0.75)} ${r(y - h * 0.55 + 0.6)} Z" fill="#1a1a1e"/>`;
    S.def(`<pattern id="${S.id("lochblech")}" width="1" height="1" patternUnits="userSpaceOnUse"><circle cx=".5" cy=".5" r=".22" fill="#3a3a40"/></pattern>`);
    k += `<path d="M${r(x - w * 0.8)} ${r(y - 0.6)} L${r(x + w * 0.8)} ${r(y - 0.6)} L${r(x + w * 0.75)} ${r(y - h + 0.8)} L${r(x - w * 0.75)} ${r(y - h * 0.55 + 0.6)} Z" fill="url(#${S.id("lochblech")})"/>`;
  }
  const [x, y] = P(-0.6, BUE.H, 9.85);
  S.teil({ oben: true, id: "kz_monitor", de: "die Monitorbox", syl: "MO-ni-tor-box", it: "la spia", itSyl: "SPI-a", en: "stage monitor", x, y, kunst: um(x, y, k),
    tipp: "Die schräge Box zeigt zum Musiker: So hört er sich selbst auf der lauten Bühne." });
}

/* =====================================================================
   11 — DIE BOXEN (PA links und rechts neben der Bühne)
   ===================================================================== */
{
  let k = "";
  for (const s of [-1, 1]) {
    const Z = 8.9, m = ms(Z), [x, y] = P(s * 5.65, 0, Z), w = 0.72 * m;
    k += schatten(x, y, w * 0.7, 1.4, 0.5);
    const teile = [[0, 0.62, "sub"], [0.62, 1.24, "sub"], [1.24, 1.82, "top"], [1.82, 2.4, "top"], [2.4, 2.92, "top"]];
    for (const [h0, h1, art] of teile) {
      const y0 = y - h1 * m, y1 = y - h0 * m;
      k += `<rect x="${r(x - w / 2)}" y="${r(y0 + 0.2)}" width="${r(w)}" height="${r(y1 - y0 - 0.4)}" rx=".5" fill="${TOLEX}"/>`;
      if (art === "sub") k += `<circle cx="${x}" cy="${r((y0 + y1) / 2)}" r="${r((y1 - y0) * 0.38)}" fill="#0e0e12" stroke="#2a2a30" stroke-width=".5"/><circle cx="${x}" cy="${r((y0 + y1) / 2)}" r="${r((y1 - y0) * 0.1)}" fill="#2a2a30"/>`;
      else k += `<rect x="${r(x - w / 2 + 0.8)}" y="${r(y0 + 1)}" width="${r(w - 1.6)}" height="${r(y1 - y0 - 2)}" fill="url(#${S.id("lochblech")})"/><rect x="${r(x - w * 0.3)}" y="${r(y0 + (y1 - y0) * 0.4)}" width="${r(w * 0.6)}" height="1" fill="#3a3a40"/>`;
    }
  }
  const [x, y] = P(5.65, 0, 8.9);
  S.teil({ id: "verstaerker2", de: "die Box", syl: "BOX", it: "la cassa", itSyl: "CAS-sa", en: "speaker", x, y, kunst: um(x, y, k),
    tipp: "Aus den großen Boxen kommt der Ton für den ganzen Saal. Unten die Bässe, oben die Höhen." });
}

/* =====================================================================
   12 — DIE TRAVERSE und 13 — DIE SCHEINWERFER (mit Lichtstrahlen)
   ===================================================================== */
const TR = { Z: 10.2, H: 5.0, X: 6.6 };
{
  const a = P(-TR.X, TR.H, TR.Z), b = P(TR.X, TR.H, TR.Z), hh = 0.3 * ms(TR.Z);
  let k = `<rect x="${a[0]}" y="${r(a[1] - hh)}" width="${r(b[0] - a[0])}" height="1.1" fill="${ALU}"/><rect x="${a[0]}" y="${r(a[1] - 0.6)}" width="${r(b[0] - a[0])}" height="1.1" fill="${ALU}"/>`;
  let z = `M${a[0]} ${r(a[1])}`;
  for (let x = a[0], i = 0; x < b[0]; x += hh * 0.9, i++) z += ` L${r(x + hh * 0.45)} ${r(i % 2 ? a[1] : a[1] - hh + 0.6)}`;
  k += `<path d="${z}" stroke="#aeb4ba" stroke-width=".45" fill="none"/>`;
  /* Kettenzüge nach oben */
  for (const X of [-5, 0, 5]) { const p = P(X, TR.H, TR.Z); k += `<line x1="${p[0]}" y1="0" x2="${p[0]}" y2="${r(p[1] - hh)}" stroke="#3a3a40" stroke-width=".5"/><rect x="${r(p[0] - 1.4)}" y="${r(Math.max(0, p[1] - hh - 4))}" width="2.8" height="2.6" rx=".6" fill="#1a1a1e"/>`; }
  S.teil({ oben: true, id: "kz_traverse", de: "die Traverse", syl: "Tra-VER-se", it: "il traliccio", itSyl: "tra-LIC-cio", en: "lighting truss", x: 160, y: r(a[1] + 1), kunst: um(160, a[1] + 1, k + flaeche(a[0], a[1] - hh - 1, b[0] - a[0], hh + 2.5)),
    tipp: "An der Traverse aus Aluminium hängen die Scheinwerfer." });
}
{
  let k = "", v = "";
  const farben = ["#ff3ab0", "#3ac8ff", "#ffd27a", "#8a5aff", "#ffd27a", "#3ac8ff", "#ff3ab0"];
  for (let i = 0; i < 7; i++) {
    const X = -5.4 + i * 1.8, p = P(X, TR.H, TR.Z), m = ms(TR.Z), c = farben[i];
    const moving = i % 2 === 0;
    if (moving) {
      /* Moving Head: Bügel und Kopf */
      k += `<rect x="${r(p[0] - 0.18 * m)}" y="${r(p[1] + 0.2)}" width="${r(0.36 * m)}" height="${r(0.08 * m)}" rx=".5" fill="#1a1a1e"/><path d="M${r(p[0] - 0.16 * m)} ${r(p[1] + 0.08 * m)} L${r(p[0] - 0.16 * m)} ${r(p[1] + 0.3 * m)} M${r(p[0] + 0.16 * m)} ${r(p[1] + 0.08 * m)} L${r(p[0] + 0.16 * m)} ${r(p[1] + 0.3 * m)}" stroke="#1a1a1e" stroke-width="1"/>`;
      k += `<ellipse cx="${p[0]}" cy="${r(p[1] + 0.3 * m)}" rx="${r(0.13 * m)}" ry="${r(0.11 * m)}" fill="#24242a"/><ellipse cx="${p[0]}" cy="${r(p[1] + 0.36 * m)}" rx="${r(0.08 * m)}" ry="${r(0.04 * m)}" fill="${c}"/>`;
    } else {
      /* PAR-Scheinwerfer */
      k += `<rect x="${r(p[0] - 0.3)}" y="${r(p[1] + 0.2)}" width=".6" height="${r(0.08 * m)}" fill="#1a1a1e"/><rect x="${r(p[0] - 0.09 * m)}" y="${r(p[1] + 0.08 * m)}" width="${r(0.18 * m)}" height="${r(0.24 * m)}" rx=".6" fill="#2a2a30"/><ellipse cx="${p[0]}" cy="${r(p[1] + 0.32 * m)}" rx="${r(0.08 * m)}" ry="${r(0.035 * m)}" fill="${c}"/>`;
    }
    /* Strahl durch den Bühnennebel */
    const zx = [P(-0.55, BUE.H, 10.4), P(2.35, BUE.H, 11), P(-3.4, BUE.H, 12.2), P(0.65, BUE.H, 13.3), P(-3.2, 1.2, 8.6), P(2.35, BUE.H, 11), P(4.2, 1.2, 8.6)][i];
    const sy = p[1] + 0.36 * m, wv = (moving ? 0.6 : 1) * 14;
    v += `<path d="M${r(p[0] - 1)} ${r(sy)} L${r(zx[0] - wv)} ${r(zx[1])} L${r(zx[0] + wv)} ${r(zx[1])} L${r(p[0] + 1)} ${r(sy)} Z" fill="${S.lg("strahl" + i, [[0, c, 0.42], [1, c, 0.04]])}"/>`;
  }
  const p = P(0, TR.H, TR.Z);
  S.teil({ oben: true, id: "scheinwerfer", de: "der Scheinwerfer", syl: "SCHEIN-wer-fer", it: "il faro", itSyl: "FA-ro", en: "spotlight", x: p[0], y: r(p[1] + 0.4 * ms(TR.Z)), kunst: um(p[0], p[1] + 0.4 * ms(TR.Z), k),
    tipp: "Die beweglichen Scheinwerfer heißen Moving Heads – sie drehen sich zur Musik." });
  S.davor(`<g opacity=".85">${v}</g>`);
}

/* =====================================================================
   14 — DIE ABSPERRUNG (Wellenbrecher aus Stahl vor dem Bühnengraben)
   ===================================================================== */
{
  const Z = 8.6, a = P(-5.8, 1.15, Z), b = P(5.8, 1.15, Z), c = P(5.8, 0, Z), d = P(-5.8, 0, Z);
  let k = poly([a, b, c, d], S.lg("gitterwand", [[0, "#24262c"], [1, "#0e0f12"]]));
  for (let i = 0; i <= 14; i++) { const X = -5.8 + i * 11.6 / 14, p = P(X, 1.15, Z), q = P(X, 0, Z); k += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#3a3e44" stroke-width=".6"/>`; }
  k += `<rect x="${a[0]}" y="${r(a[1] - 1.2)}" width="${r(b[0] - a[0])}" height="2.4" rx="1.2" fill="${S.lg("rohr", [[0, "#c9cfd4"], [0.5, "#7a8288"], [1, "#4a5056"]])}"/>`;
  k += `<rect x="${a[0]}" y="${r(a[1] + 2.4)}" width="${r(b[0] - a[0])}" height="2.4" fill="#f2c230" opacity=".7"/><text x="${r((a[0] + b[0]) / 2)}" y="${r(a[1] + 4.3)}" font-size="1.9" text-anchor="middle" fill="#14141c" font-family="Arial Black,Arial" font-weight="bold" letter-spacing="2">SECURITY · BITTE NICHT KLETTERN · SECURITY</text>`;
  const cx = (a[0] + b[0]) / 2;
  S.teil({ id: "absperrung", de: "die Absperrung", syl: "AB-sper-rung", it: "la transenna", itSyl: "tran-SEN-na", en: "barrier", x: r(cx), y: d[1], kunst: um(cx, d[1], k),
    tipp: "Hinter der Absperrung ist der Graben – dort steht die Security." });
}

/* =====================================================================
   15 — DAS PUBLIKUM (von hinten, Hände hoch) mit 16 — DEM HANDY,
   17 — DAS MISCHPULT (vorn, FOH) — Lupe
   ===================================================================== */
const PULT = { Zh: 2.65, Zv: 1.4, H: 1.4 };
const yPult = P(0, PULT.H, PULT.Zh)[1];
let HANDY = null;
{
  let k = "";
  const leute = [
    [6.6, -3.1, "m", "winken", "kurz", "schwarz", "#2a3a5a", 170],
    [6.0, 0.95, "w", "stehen", "zopf", "blond", "#5a2a6a", 190],
    [3.9, -1.75, "m", "stehen", "glatze", "dunkelbraun", "#1a1a1e", 175],
    [3.6, 1.95, "w", "winken", "lang", "rot", "#3a5a3a", 200],
  ];
  let ax = 0, ay = 0;
  leute.forEach(([Z, X, g, pose, fr, hf, jf, bl], i) => {
    const m = ms(Z), [x, y] = P(X, 0, Z);
    const spec = { id: "b12e_pub" + i, geschlecht: g, pose, blick: bl, frisur: fr, haarfarbe: hf, haut: ["hell", "mittel", "hell", "hell"][i],
      kleidung: { oberteil: { stueck: "tshirt", farbe: jf }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } };
    const fg = figur(spec, (g === "w" ? 1.66 : 1.8) * m, y - yPult + 1);
    k += `<g transform="translate(${r(x)} ${r(y)})">${fg.svg}</g>`;
    if (pose === "winken" && i === 3) { const h = [fg.z.handL, fg.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0]; HANDY = [x + h.x * fg.k, y + h.y * fg.k, m]; }
    if (i === 2) { ax = x; ay = yPult; }
  });
  S.teil({ id: "publikum", de: "das Publikum", syl: "PU-bli-kum", it: "il pubblico", itSyl: "PUB-bli-co", en: "audience", x: r(ax), y: r(ay), kunst: um(ax, ay, k),
    tipp: "Das Publikum singt mit und hebt die Hände." });
}
{
  const [hx, hy, m] = HANDY, w = 0.075 * m, h = 0.15 * m;
  let k = `<rect x="${r(hx - w / 2)}" y="${r(hy - h - 0.6)}" width="${r(w)}" height="${r(h)}" rx=".8" fill="#14141a"/><rect x="${r(hx - w / 2 + 0.5)}" y="${r(hy - h)}" width="${r(w - 1)}" height="${r(h - 1.2)}" fill="${S.lg("display", [[0, "#3a0a6a"], [0.5, "#ff3ab0"], [1, "#2a2a6a"]])}"/>`;
  k += `<rect x="${r(hx - w / 2 + 0.5)}" y="${r(hy - h * 0.55)}" width="${r(w - 1)}" height="${r(h * 0.25)}" fill="#ffd27a" opacity=".6"/><circle cx="${r(hx)}" cy="${r(hy - h * 0.5)}" r="${r(w * 0.6)}" fill="#ffffff" opacity=".18"/>`;
  S.teil({ oben: true, id: "kz_handy", de: "das Handy", syl: "HAN-dy", it: "il cellulare", itSyl: "cel-lu-LA-re", en: "mobile phone", x: r(hx), y: r(hy), kunst: um(hx, hy, k + flaeche(hx - w / 2 - 1, hy - h - 1.6, w + 2, h + 2.6)),
    tipp: "Viele filmen das Konzert mit dem Handy." });
}
{
  const { Zh, Zv, H } = PULT;
  const hl = P(-1.45, H, Zh), hr = P(1.45, H, Zh), vl = P(-1.45, H - 0.18, Zv), vr = P(1.45, H - 0.18, Zv);
  const x0 = Math.max(-2, vl[0]), x1 = Math.min(322, vr[0]);
  let k = `<path d="M${hl[0] < 0 ? 0 : hl[0]} ${hl[1]} L${hr[0] > 320 ? 320 : hr[0]} ${hr[1]} L320 200 L0 200 Z" fill="${S.lg("pult", [[0, "#2a2c32"], [1, "#16171c"]])}"/>`;
  /* Meterbrücke hinten mit Pegelanzeigen */
  const mb = P(0, H + 0.12, Zh)[1];
  k += `<rect x="0" y="${r(mb)}" width="320" height="${r(hl[1] - mb)}" fill="#121318"/>`;
  for (let i = 0; i < 64; i++) { const x = 4 + i * 4.9, lv = 0.3 + rnd() * 0.7; const hh = (hl[1] - mb - 1.4) * lv; k += `<rect x="${r(x)}" y="${r(hl[1] - 0.7 - hh)}" width="1.6" height="${r(hh)}" fill="${S.lg("pegel", [[0, "#ff3a2a"], [0.25, "#ffd23a"], [0.5, "#3ae86a"], [1, "#3ae86a"]])}"/>`; }
  /* Kanalzüge: Drehregler, farbige Beschriftung, Fader */
  const zeile = (Z, fn) => { const y = P(0, H - (Zh - Z) * 0.1, Z)[1], m = ms(Z); for (let i = 0; i < 24; i++) { const X = -1.38 + i * 0.12, x = P(X, 0, Z)[0]; if (x > 1 && x < 319) k += fn(x, y, m, i); } };
  zeile(2.45, (x, y, m) => `<circle cx="${x}" cy="${y}" r="${r(0.018 * m)}" fill="#3a3c44"/><circle cx="${x}" cy="${y}" r="${r(0.008 * m)}" fill="#e8e8ea"/>`);
  zeile(2.2, (x, y, m, i) => `<circle cx="${x}" cy="${y}" r="${r(0.02 * m)}" fill="${["#3ac8ff", "#ff3ab0", "#ffd27a", "#3ae86a"][i % 4]}" opacity=".85"/>`);
  zeile(1.95, (x, y, m, i) => `<rect x="${r(x - 0.04 * m)}" y="${r(y - 0.02 * m)}" width="${r(0.08 * m)}" height="${r(0.035 * m)}" fill="${["#c83a3a", "#3a8ac8", "#e8b83a", "#5ac85a", "#c85ac8"][Math.floor(i / 5) % 5]}"/><text x="${x}" y="${r(y)}" font-size="${r(0.022 * m)}" text-anchor="middle" fill="#fff" font-family="Arial">${["KICK", "SNR", "HH", "TOM", "BASS", "GIT", "KEY", "VOX"][i % 8]}</text>`);
  zeile(1.75, (x, y, m, i) => `<rect x="${r(x - 0.004 * m)}" y="${r(y - 0.05 * m)}" width="${r(0.008 * m)}" height="${r(0.05 * m)}" fill="#050506"/><rect x="${r(x - 0.03 * m)}" y="${r(y - (0.012 + (i * 37 % 10) / 320) * m)}" width="${r(0.06 * m)}" height="${r(0.014 * m)}" rx=".3" fill="${i % 8 === 7 ? "#e83a3a" : "#c9cfd4"}"/>`);
  /* zwei Touchscreens in der Mitte, Kopfhörer, Laptop rechts */
  const sc = (X0, X1) => { const a = P(X0, H + 0.3, Zh - 0.05), b = P(X1, H + 0.03, Zh - 0.18); return { a, b, svg: `<path d="M${a[0]} ${a[1]} L${b[0]} ${a[1]} L${b[0]} ${b[1]} L${a[0]} ${b[1]} Z" fill="#0a0a0e"/><rect x="${r(a[0] + 1)}" y="${r(a[1] + 1)}" width="${r(b[0] - a[0] - 2)}" height="${r(b[1] - a[1] - 2)}" fill="${S.lg("screen", [[0, "#10203a"], [1, "#1a2a4a"]])}"/>` }; };
  const s1 = sc(-0.42, 0.02), s2 = sc(0.06, 0.5);
  k += s1.svg + s2.svg;
  for (let i = 0; i < 8; i++) { const x = s1.a[0] + 3 + i * (s1.b[0] - s1.a[0] - 6) / 8; k += `<rect x="${r(x)}" y="${r(s1.b[1] - 3 - (i * 13 % 7) * 1.6)}" width="2" height="${r(2 + (i * 13 % 7) * 1.6)}" fill="#3ae86a"/>`; }
  k += `<path d="M${r(s2.a[0] + 3)} ${r((s2.a[1] + s2.b[1]) / 2)} ${Array.from({ length: 10 }, (_, i) => `L${r(s2.a[0] + 3 + i * (s2.b[0] - s2.a[0] - 6) / 9)} ${r((s2.a[1] + s2.b[1]) / 2 + Math.sin(i * 1.3) * 4)}`).join(" ")}" stroke="#3ac8ff" stroke-width=".8" fill="none"/>`;
  k += `<text x="${r(s2.a[0] + 3)}" y="${r(s2.a[1] + 5)}" font-size="2.4" fill="#cfe0ff" font-family="Arial">EQ · VOX</text>`;
  const [kx, ky] = P(0.75, H + 0.02, 2.1), km = ms(2.1);
  k += `<path d="M${r(kx - 0.08 * km)} ${ky} Q${r(kx)} ${r(ky - 0.2 * km)} ${r(kx + 0.08 * km)} ${ky}" stroke="#1a1a1e" stroke-width="${r(0.02 * km)}" fill="none"/><ellipse cx="${r(kx - 0.08 * km)}" cy="${r(ky)}" rx="${r(0.035 * km)}" ry="${r(0.05 * km)}" fill="#2a2a30"/><ellipse cx="${r(kx + 0.08 * km)}" cy="${r(ky)}" rx="${r(0.035 * km)}" ry="${r(0.05 * km)}" fill="#2a2a30"/>`;
  const unter = [];
  const add = (q, x0, y0, x1, y1) => unter.push(Object.assign(q, { x: (x0 + x1) / 2, y: y1, kunst: um((x0 + x1) / 2, y1, flaeche(x0, y0, x1 - x0, y1 - y0, 0.6)) }));
  const yf = P(0, H - 0.09, 1.75)[1], mf = ms(1.75);
  add({ id: "kz_schieberegler", de: "der Schieberegler", syl: "SCHIE-be-reg-ler", it: "il cursore", itSyl: "cur-SO-re", en: "fader", tipp: "Mit dem Schieberegler macht man ein Instrument lauter oder leiser." }, P(-0.5, 0, 1.75)[0], yf - 0.07 * mf, P(-0.02, 0, 1.75)[0], yf + 1);
  add({ id: "kz_kopfhoerer", de: "der Kopfhörer", syl: "KOPF-hö-rer", it: "le cuffie", itSyl: "CUF-fie", en: "headphones", tipp: "Mit dem Kopfhörer hört der Tontechniker einzelne Kanäle ab." }, kx - 0.13 * km, ky - 0.22 * km, kx + 0.13 * km, ky + 0.06 * km);
  add({ id: "kz_bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen" }, s1.a[0], s1.a[1], s2.b[0], s2.b[1]);
  S.teil({ id: "mischpult", de: "das Mischpult", syl: "MISCH-pult", it: "il mixer", itSyl: "MI-xer", en: "mixing desk", x: 160, y: 200, kunst: um(160, 200, k),
    zoom: { x: r(s1.a[0] - 30), y: r(s1.a[1] - 4), w: 120, h: 80 }, unter,
    tipp: "Hier wird der Ton gemischt — ohne Mischpult klingt nichts." });
}

/* Bühnennebel über allem (fängt nichts ab) */
S.davor(`<rect x="0" y="0" width="320" height="120" fill="${S.lg("nebel", [[0, "#8a6aff", 0.06], [0.6, "#ff6ab0", 0.05], [1, "#000", 0]])}"/>`);

S.defs = [...new Set(S.defs)];   /* doppelte Verläufe nur einmal */
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/konzert.js"));
console.log(aus);
