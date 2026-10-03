#!/usr/bin/env node
/* =====================================================================
   DAS THEATER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Logentheater/Rangtheater in Deutschland, z. B. Staatstheater
   und Stadttheater mit Guckkastenbühne; Bühnenkunde: Portal, Hauptvorhang,
   Schabracke, Souffleurkasten, Orchestergraben, Seitenkulissen):
   - GUCKKASTENBÜHNE hinter dem goldenen Portal, der rote Hauptvorhang ist
     zur Seite gerafft, oben hängt die Schabracke mit Fransen.
   - Auf der BÜHNE (Holzboden) das BÜHNENBILD: gemalter Prospekt hinten,
     seitlich die KULISSEN, dazu REQUISITEN (Gartenbank, Laterne).
   - Vorn in der Mitte der SOUFFLEURKASTEN (die Souffleuse sagt leise den
     Text vor), davor der ORCHESTERGRABEN mit Messinggeländer – vom
     Parkett aus sieht man nur Notenpultlampen und den Hals des Kontrabasses.
   - Seitlich die RÄNGE mit roter Samtbrüstung und die Proszeniums-LOGE,
     an den Brüstungen die SCHEINWERFER, deren Licht auf die Spieler fällt.
   - Im ansteigenden Parkett die SITZREIHEN mit Reihennummern, das
     PUBLIKUM (im Dunkeln von hinten), eine BESUCHERIN mit PROGRAMMHEFT
     sucht ihren Platz; die GARDEROBENMARKE liegt auf der Lehne; am Portal
     die Tafel mit Beginn und PAUSE.
   BLICK: Zentralperspektive aus dem hinteren, ansteigenden Parkett,
   Augenhöhe 3,0 m über dem vorderen Parkett, Fluchtpunkt (160 | 99);
   Portal 9,2 m entfernt (≈ 22 Einheiten je Meter), Spieler ≈ 11 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "theater", titel: "Das Theater", emoji: "🎭", thema: "Kultur", kuerzel: "b12d", fassung: 852 });
const rnd = zufall(1782);
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
const VX = 160, HY = 99, E = 3.0, F = 200;
const ms = (Z) => F / Z;
const P = (X, H, Z) => [r(VX + F * X / Z), r(HY + F * (E - H) / Z)];
const boden = (Z) => Math.max(0, 1.3 * (7.6 - Z) / 7.6);   // ansteigendes Parkett
const PORTAL = { Z: 9.2, X: 4.6, H0: 1.0, H1: 7.4 };
const BUEHNE = { Zv: 9.0, Zh: 15.5, H: 1.0 };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("blur")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>`);
const GOLD = S.lg("gold", [[0, "#f6dc8a"], [0.35, "#c9982e"], [0.6, "#8a6418"], [1, "#e2bc5a"]]);
const GOLD_V = S.lg("goldv", [[0, "#8a6418"], [0.4, "#f2d27a"], [0.7, "#b8862a"], [1, "#6e4c12"]], 0, 0, 1, 0);
const SAMT = S.lg("samt", [[0, "#5a0a12"], [0.3, "#b01e28"], [0.55, "#6e0e18"], [0.8, "#a01a24"], [1, "#4a0810"]], 0, 0, 1, 0);
const SAMT_H = S.lg("samth", [[0, "#c02a32"], [1, "#6a0c14"]]);

/* =====================================================================
   KULISSE — dunkler Zuschauerraum, zweiter Rang, Portalwand, Bühnenhaus
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="${S.lg("saal", [[0, "#1a0c0e"], [1, "#2a1416"]])}"/>`;
  /* Bühnenhaus hinter dem Portal: schwarz, Soffitten */
  const o = P(-PORTAL.X, PORTAL.H1, PORTAL.Z), u = P(PORTAL.X, PORTAL.H0, PORTAL.Z);
  k += `<rect x="${o[0]}" y="0" width="${r(u[0] - o[0])}" height="${u[1]}" fill="#0a0808"/>`;
  /* Seitenwände links/rechts unten (Parkett): Tür mit Notausgang links */
  for (const s of [-1, 1]) {
    const a = P(s * 6.4, 0, 7.6), b = P(s * 6.4, 0, PORTAL.Z), c = P(s * 6.4, 3.0, PORTAL.Z), d = P(s * 6.4, 3.0, 7.6);
    k += poly([a, b, c, d], S.lg("seitw" + (s < 0 ? "l" : "r"), [[0, "#3a1418"], [1, "#4a1c20"]], 0, 0, 1, 0));
  }
  { const a = P(-6.4, 2.1, 8.0), b = P(-6.4, 0, 8.8), c = P(-6.4, 2.1, 8.8), d = P(-6.4, 0, 8.0);
    k += poly([a, c, b, d], "#2a0e10") + `<path d="M${a[0]} ${a[1]} L${c[0]} ${c[1]} L${b[0]} ${b[1]} L${d[0]} ${d[1]} Z" fill="none" stroke="${GOLD}" stroke-width=".5"/>`;
    const n1 = P(-6.4, 2.45, 8.1), n2 = P(-6.4, 2.22, 8.7);
    k += `<path d="M${n1[0]} ${n1[1]} L${n2[0]} ${r(n1[1] + 0.6)} L${n2[0]} ${n2[1]} L${n1[0]} ${r(n2[1] - 0.4)} Z" fill="#12b04a"/><path d="M${n1[0]} ${n1[1]} L${n2[0]} ${r(n1[1] + 0.6)} L${n2[0]} ${n2[1]} L${n1[0]} ${r(n2[1] - 0.4)} Z" fill="#3aff8a" opacity=".25" filter="url(#${S.id("blur")})"/>`; }
  /* Portalwand neben dem goldenen Rahmen */
  for (const s of [-1, 1]) {
    const a = P(s * 5.3, 0, PORTAL.Z), b = P(s * 6.4, 9, PORTAL.Z);
    k += `<rect x="${r(Math.min(a[0], b[0]))}" y="${b[1]}" width="${r(Math.abs(b[0] - a[0]))}" height="${r(a[1] - b[1])}" fill="${S.lg("portalwand", [[0, "#4a1a1e"], [1, "#2e1012"]])}"/>`;
  }
  /* zweiter Rang oben (nur Kulisse): Brüstung mit Gold */
  for (const s of [-1, 1]) {
    const pts = [P(s * 5.4, 6.8, 6.0), P(s * 5.4, 6.8, PORTAL.Z), P(s * 5.4, 6.0, PORTAL.Z), P(s * 5.4, 6.0, 6.0)];
    k += poly(pts, SAMT_H) + `<path d="M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]}" stroke="${GOLD}" stroke-width="1.4"/>`;
    for (let Z = 6.4; Z < PORTAL.Z; Z += 0.55) { const a = P(s * 5.4, 6.7, Z), b = P(s * 5.4, 6.1, Z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e2bc5a" stroke-width=".5" opacity=".7"/>`; }
    /* dunkle Ränge dahinter mit Köpfen als Lichtpunkte der Pultlampen */
    const q1 = P(s * 5.6, 9, 6.0), q2 = P(s * 5.6, 6.8, PORTAL.Z);
    k += poly([P(s * 5.4, 9, 6.0), P(s * 5.4, 9, PORTAL.Z), pts[1], pts[0]], "#160809");
    const l = P(s * 5.6, 7.4, 7.6); k += `<circle cx="${l[0]}" cy="${l[1]}" r="1.4" fill="#ffd27a"/><circle cx="${l[0]}" cy="${l[1]}" r="5" fill="#ffd27a" opacity=".15"/>`;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DAS BÜHNENBILD (gemalter Prospekt: Garten bei Nacht, Schloss)
   ===================================================================== */
{
  const Zb = BUEHNE.Zh, a = P(-5.2, 7.4, Zb), b = P(5.2, BUEHNE.H, Zb), w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" fill="${S.lg("prospekt", [[0, "#0e1a3a"], [0.55, "#2a4a7a"], [0.8, "#5a7a8a"], [1, "#3a5a3a"]])}"/>`;
  k += `<circle cx="${r(a[0] + w * 0.78)}" cy="${r(a[1] + h * 0.22)}" r="${r(h * 0.08)}" fill="${S.rg("pmond", [[0, "#fffbe0"], [1, "#e8dca0"]])}"/><circle cx="${r(a[0] + w * 0.78)}" cy="${r(a[1] + h * 0.22)}" r="${r(h * 0.16)}" fill="#fffbe0" opacity=".12"/>`;
  for (let i = 0; i < 20; i++) k += `<circle cx="${r(a[0] + rnd() * w)}" cy="${r(a[1] + rnd() * h * 0.45)}" r=".3" fill="#fff" opacity=".7"/>`;
  /* Schloss rechts mit erleuchteten Fenstern */
  const sx = a[0] + w * 0.55, sy = a[1] + h * 0.45;
  k += `<path d="M${r(sx)} ${r(b[1] - h * 0.18)} L${r(sx)} ${r(sy)} L${r(sx + w * 0.1)} ${r(sy - h * 0.08)} L${r(sx + w * 0.2)} ${r(sy)} L${r(sx + w * 0.42)} ${r(sy)} L${r(sx + w * 0.42)} ${r(b[1] - h * 0.18)} Z" fill="#c9b48a"/>`;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) k += `<rect x="${r(sx + 2 + i * w * 0.065)}" y="${r(sy + 3 + j * h * 0.12)}" width="${r(w * 0.03)}" height="${r(h * 0.07)}" fill="${(i + j) % 3 ? "#ffd27a" : "#3a3a4a"}"/>`;
  /* Gartenmauer, Bäume (gemalt, weiche Pinselkanten) */
  k += `<rect x="${a[0]}" y="${r(b[1] - h * 0.2)}" width="${r(w)}" height="${r(h * 0.08)}" fill="#8a7a62"/>`;
  for (const [tx, ts] of [[0.08, 1], [0.24, 0.8], [0.4, 0.95]]) {
    const x = a[0] + w * tx, y = b[1] - h * 0.18;
    k += `<rect x="${r(x - 1.2)}" y="${r(y - h * 0.3 * ts)}" width="2.4" height="${r(h * 0.3 * ts)}" fill="#2a1e14"/>`;
    k += `<ellipse cx="${r(x)}" cy="${r(y - h * 0.42 * ts)}" rx="${r(w * 0.09 * ts)}" ry="${r(h * 0.2 * ts)}" fill="${S.rg("baum", [[0, "#3a6a3a"], [1, "#1a3a1e"]], 0.4, 0.35, 0.7)}"/>`;
  }
  k += `<rect x="${a[0]}" y="${r(b[1] - h * 0.12)}" width="${r(w)}" height="${r(h * 0.12)}" fill="${S.lg("rasen", [[0, "#3a5a2a"], [1, "#24401c"]])}"/>`;
  /* schwarze Soffitten oben, die den Bühnenturm verdecken */
  for (const [Z, H] of [[11, 6.2], [13.4, 6.6]]) { const p = P(-6, 8.5, Z), q = P(6, H, Z); k += `<rect x="${p[0]}" y="${p[1]}" width="${r(q[0] - p[0])}" height="${r(q[1] - p[1])}" fill="#0c0a0a"/>`; }
  const cx = a[0] + w / 2;
  S.teil({ id: "th_buehnenbild", de: "das Bühnenbild", syl: "BÜH-nen-bild", it: "la scenografia", itSyl: "sce-no-gra-FI-a", en: "set", x: r(cx), y: b[1], kunst: um(cx, b[1], k),
    tipp: "Gemalte Wände und Bäume — sie sagen, wo das Stück spielt." });
}

/* =====================================================================
   2 — DIE BÜHNE (Holzboden in Flucht, Rampe)
   ===================================================================== */
{
  const { Zv, Zh, H } = BUEHNE;
  const vl = P(-PORTAL.X, H, Zv), vr = P(PORTAL.X, H, Zv), hl = P(-PORTAL.X, H, Zh), hr = P(PORTAL.X, H, Zh);
  let k = poly([hl, hr, vr, vl], S.lg("dielen", [[0, "#5a3a22"], [1, "#9a6a3e"]]));
  for (let X = -4.4; X <= 4.4; X += 0.3) { const a = P(X, H, Zh), b = P(X, H, Zv); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a2412" stroke-width=".3" opacity=".7"/>`; }
  for (const Z of [10.2, 11.6, 13.3]) { const a = P(-PORTAL.X, H, Z), b = P(PORTAL.X, H, Z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a2412" stroke-width=".25" opacity=".5"/>`; }
  /* Spielfläche hell ausgeleuchtet */
  const c = P(-0.4, H, 11);
  k += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="52" ry="5.5" fill="#ffe7b0" opacity=".28" filter="url(#${S.id("blur")})"/>`;
  /* Rampe: Vorderkante der Bühne (dunkles Holz) */
  const rl = P(-PORTAL.X, 0.55, Zv), rr = P(PORTAL.X, 0.55, Zv);
  k += poly([vl, vr, rr, rl], S.lg("rampe", [[0, "#3a2412"], [1, "#1a0e08"]]));
  k += `<rect x="${vl[0]}" y="${r(vl[1] - 0.5)}" width="${r(vr[0] - vl[0])}" height="1" fill="#c99a5a" opacity=".6"/>`;
  const cx = (vl[0] + vr[0]) / 2;
  S.teil({ id: "th_buehne", de: "die Bühne", syl: "BÜH-ne", it: "il palcoscenico", itSyl: "pal-co-SCE-ni-co", en: "stage", x: r(cx), y: rl[1], kunst: um(cx, rl[1], k),
    tipp: "Darauf wird gespielt. Der Boden ist aus Holz, damit die Schritte zu hören sind." });
}

/* =====================================================================
   3 — DIE KULISSEN (gemalte Seitenwände: Bäume) und 4 — DIE REQUISITE
   ===================================================================== */
{
  let k = "";
  const fl = (X0, X1, Z, H1) => {
    const a = P(X0, H1, Z), b = P(X1, BUEHNE.H, Z), w = b[0] - a[0], h = b[1] - a[1];
    let g = `<path d="M${a[0]} ${b[1]} L${a[0]} ${r(a[1] + h * 0.2)} Q${r(a[0] + w * 0.2)} ${a[1]} ${r(a[0] + w * 0.6)} ${r(a[1] + h * 0.04)} Q${r(b[0] + w * 0.1)} ${r(a[1] + h * 0.15)} ${b[0]} ${r(a[1] + h * 0.35)} L${b[0]} ${b[1]} Z" fill="${S.lg("kulisse", [[0, "#2a4a26"], [0.6, "#3a6a32"], [1, "#24401e"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 9; i++) g += `<ellipse cx="${r(a[0] + w * (0.2 + rnd() * 0.7))}" cy="${r(a[1] + h * (0.08 + rnd() * 0.4))}" rx="${r(w * 0.22)}" ry="${r(h * 0.06)}" fill="${rnd() < 0.5 ? "#4a7a3a" : "#1e3a1a"}" opacity=".8"/>`;
    g += `<rect x="${r(a[0] + w * 0.4)}" y="${r(a[1] + h * 0.5)}" width="${r(w * 0.18)}" height="${r(h * 0.5)}" fill="#3a2a1a"/>`;
    return g;
  };
  k += fl(-4.5, -3.3, 13.2, 6.4) + fl(3.3, 4.5, 13.2, 6.4) + fl(-4.6, -3.2, 10.6, 6.0) + fl(3.2, 4.6, 10.6, 6.0);
  const [x, y] = P(-3.9, BUEHNE.H, 10.6);
  S.teil({ id: "th_kulisse", de: "die Kulisse", syl: "Ku-LIS-se", it: "la quinta", itSyl: "QUIN-ta", en: "wing flat", x, y, kunst: um(x, y, k),
    tipp: "Die Kulissen stehen seitlich auf der Bühne. Dahinter warten die Schauspieler auf ihren Auftritt." });
}
{
  let k = "";
  /* Gartenbank (Gusseisen und Holz) */
  { const Z = 13, m = ms(Z), [x, y] = P(1.95, BUEHNE.H, Z), w = 0.75 * m;
    k += schatten(x, y, w, 1, 0.35);
    for (const s of [-1, 1]) k += `<path d="M${r(x + s * w * 0.9)} ${r(y)} q${r(s * -0.5)} ${r(-0.25 * m)} 0 ${r(-0.45 * m)} l0 ${r(-0.4 * m)}" stroke="#1e1e22" stroke-width=".9" fill="none"/>`;
    for (let i = 0; i < 3; i++) k += `<rect x="${r(x - w)}" y="${r(y - 0.45 * m - i * 1.1)}" width="${r(2 * w)}" height=".8" fill="#7a5a32"/>`;
    for (let i = 0; i < 3; i++) k += `<rect x="${r(x - w)}" y="${r(y - 0.62 * m - i * 1.4)}" width="${r(2 * w)}" height=".9" fill="#8a6a3a"/>`; }
  /* Laterne (Gaslaterne) */
  { const Z = 13.2, m = ms(Z), [x, y] = P(-2.85, BUEHNE.H, Z), h = 2.6 * m;
    k += `<rect x="${r(x - 1.2)}" y="${r(y - 0.6)}" width="2.4" height=".9" fill="#1e1e22"/><rect x="${r(x - 0.35)}" y="${r(y - h)}" width=".7" height="${r(h)}" fill="#1e1e22"/>`;
    k += `<path d="M${r(x - 1.8)} ${r(y - h)} L${r(x + 1.8)} ${r(y - h)} L${r(x + 1.2)} ${r(y - h - 3.6)} L${r(x - 1.2)} ${r(y - h - 3.6)} Z" fill="#ffe7a0"/><path d="M${r(x - 2)} ${r(y - h - 3.6)} L${r(x + 2)} ${r(y - h - 3.6)} L${r(x)} ${r(y - h - 5.2)} Z" fill="#1e1e22"/>`;
    k += `<circle cx="${x}" cy="${r(y - h - 1.8)}" r="7" fill="#ffd27a" opacity=".22" filter="url(#${S.id("blur")})"/>`; }
  const [x, y] = P(1.95, BUEHNE.H, 13);
  S.teil({ id: "th_requisite", de: "die Requisite", syl: "Re-qui-SI-te", it: "l'oggetto di scena", itSyl: "og-GET-to di SCE-na", en: "prop", x, y, kunst: um(x, y, k),
    tipp: "Requisiten sind alle Dinge auf der Bühne, die man anfassen kann: Bank, Laterne, Brief." });
}

/* =====================================================================
   5 — DIE SCHAUSPIELERIN und 6 — DER SCHAUSPIELER (im Scheinwerferlicht)
   ===================================================================== */
{
  const X = -1.55, Z = 11.2, m = ms(Z), [x, y] = P(X, BUEHNE.H, Z);
  const f = figur({ id: "b12d_sp_w", geschlecht: "w", pose: "halten", blick: 55, frisur: "dutt", haarfarbe: "rot", haut: "hell",
    kleidung: { kleid: { stueck: "abendkleid", farbe: "#e8b8c8" }, schuhe: { stueck: "halbschuh", farbe: "#e8d8c8" } } }, 1.68 * m);
  S.teil({ id: "th_schauspielerin", de: "die Schauspielerin", syl: "SCHAU-spie-le-rin", it: "l'attrice", itSyl: "at-TRI-ce", en: "actress", x, y, kunst: schatten(0, 0.2, 4, 0.7, 0.4) + f.svg,
    tipp: "Sie spricht ihre Rolle laut, damit man sie hinten noch hört." });
}
{
  const X = 0.55, Z = 10.8, m = ms(Z), [x, y] = P(X, BUEHNE.H, Z);
  const f = figur({ id: "b12d_sp_m", geschlecht: "m", pose: "zeigen", blick: -60, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "#2a3a6a" }, unterteil: { stueck: "anzughose", farbe: "#e8dcc0" }, schuhe: { stueck: "stiefel", farbe: "schwarz" } } }, 1.8 * m);
  S.teil({ id: "th_schauspieler", de: "der Schauspieler", syl: "SCHAU-spie-ler", it: "l'attore", itSyl: "at-TO-re", en: "actor", x, y, kunst: schatten(0, 0.2, 4.4, 0.7, 0.4) + f.svg,
    tipp: "Er spielt eine Rolle — er ist im Stück jemand anderes." });
}

/* =====================================================================
   7 — DER SOUFFLEURKASTEN (vorn in der Mitte der Rampe)
   ===================================================================== */
{
  const Z = 9.3, m = ms(Z), [x, y] = P(0, BUEHNE.H, Z), w = 0.48 * m, h = 0.45 * m;
  let k = `<path d="M${r(x - w)} ${r(y)} L${r(x - w)} ${r(y - h * 0.4)} Q${r(x - w)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + w)} ${r(y - h)} ${r(x + w)} ${r(y - h * 0.4)} L${r(x + w)} ${r(y)} Z" fill="${S.lg("souffleur", [[0, "#2a1a10"], [0.5, "#4a2e1a"], [1, "#1a0e08"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(x - w)} ${r(y - h * 0.4)} Q${r(x - w)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + w)} ${r(y - h)} ${r(x + w)} ${r(y - h * 0.4)}" stroke="${GOLD}" stroke-width=".9" fill="none"/>`;
  k += `<path d="M${r(x - w * 0.7)} ${r(y)} L${r(x - w * 0.7)} ${r(y - h * 0.35)} Q${r(x)} ${r(y - h * 0.62)} ${r(x + w * 0.7)} ${r(y - h * 0.35)} L${r(x + w * 0.7)} ${r(y)} Z" fill="#0a0604"/>`;
  k += `<ellipse cx="${x}" cy="${r(y - 0.8)}" rx="${r(w * 0.4)}" ry="1" fill="#ffe7a0" opacity=".5"/>`;
  S.teil({ oben: true, id: "th_souffleurkasten", de: "der Souffleurkasten", syl: "souf-FLÖR-kas-ten", it: "la buca del suggeritore", itSyl: "BU-ca del sug-ge-ri-TO-re", en: "prompt box", x, y, kunst: um(x, y, k),
    tipp: "Darin sitzt die Souffleuse. Sie flüstert den Text, wenn jemand ihn vergisst." });
}

/* =====================================================================
   8 — DER VORHANG (gerafft) mit Schabracke, im goldenen Portal
   ===================================================================== */
{
  const o = P(-PORTAL.X, PORTAL.H1, PORTAL.Z), u = P(PORTAL.X, PORTAL.H0, PORTAL.Z), W = u[0] - o[0];
  let k = "";
  /* gerafft: oben breit, unten zur Seite gezogen mit Kordel */
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? o[0] : u[0], xi = x0 - s * W * 0.17, xm = x0 - s * W * 0.08, yk = o[1] + (u[1] - o[1]) * 0.62;
    k += `<path d="M${x0} ${r(o[1])} L${r(xi)} ${r(o[1])} Q${r(xi + s * 3)} ${r(yk - 30)} ${r(xm)} ${r(yk)} Q${r(xm - s * 1)} ${r(yk + 10)} ${r(x0 - s * W * 0.05)} ${u[1]} L${x0} ${u[1]} Z" fill="${SAMT}"/>`;
    for (let i = 1; i < 5; i++) { const t = i / 5; k += `<path d="M${r(x0 - s * W * 0.17 * t)} ${r(o[1])} Q${r(x0 - s * W * 0.14 * t)} ${r(yk - 20)} ${r(x0 - s * W * 0.08 * t)} ${r(yk)} L${r(x0 - s * W * 0.05 * t)} ${u[1]}" stroke="#3a0408" stroke-width=".6" fill="none" opacity=".7"/>`; }
    k += `<path d="M${r(xm + s * 1)} ${r(yk - 1)} q${r(-s * 3)} 2 ${r(-s * 1)} 5" stroke="${GOLD}" stroke-width="1" fill="none"/><circle cx="${r(xm - s * 0.8)}" cy="${r(yk + 5)}" r="1.3" fill="${GOLD}"/>`;
  }
  /* Schabracke mit Goldfransen */
  const ys = o[1] + 22;
  k += `<path d="M${r(o[0] - 2)} ${r(o[1])} L${r(u[0] + 2)} ${r(o[1])} L${r(u[0] + 2)} ${r(ys)} ${Array.from({ length: 12 }, (_, i) => { const x1 = u[0] + 2 - (i + 0.5) * (W + 4) / 12, x2 = u[0] + 2 - (i + 1) * (W + 4) / 12; return `Q${r(x1)} ${r(ys + 6)} ${r(x2)} ${r(ys)}`; }).join(" ")} Z" fill="${SAMT_H}"/>`;
  for (let i = 0; i < 12; i++) { const x1 = o[0] - 2 + (i + 0.5) * (W + 4) / 12; k += `<path d="M${r(x1 - (W + 4) / 24)} ${r(ys)} Q${r(x1)} ${r(ys + 6)} ${r(x1 + (W + 4) / 24)} ${r(ys)}" stroke="${GOLD}" stroke-width="1.2" fill="none"/>`; }
  for (let x = o[0]; x < u[0]; x += 1.2) { const t = (x - o[0]) / W * 12, yy = ys + Math.sin((t % 1) * Math.PI) * 6; k += `<line x1="${r(x)}" y1="${r(yy)}" x2="${r(x)}" y2="${r(yy + 2.2)}" stroke="#e2bc5a" stroke-width=".35"/>`; }
  k += `<rect x="${r(o[0] - 2)}" y="${r(o[1] + 5)}" width="${r(W + 4)}" height="1.4" fill="${GOLD}"/>`;
  const cx = (o[0] + u[0]) / 2;
  S.teil({ id: "th_vorhang", de: "der Vorhang", syl: "VOR-hang", it: "il sipario", itSyl: "si-PA-rio", en: "curtain", x: r(cx), y: u[1], kunst: um(cx, u[1], k),
    tipp: "Er geht auf, wenn das Stück beginnt." });
  /* goldenes Portal (Rahmen) — Kulisse über dem Vorhang, nicht antippbar */
  let p = "";
  for (const s of [-1, 1]) { const a = P(s * PORTAL.X, 9, PORTAL.Z), b = P(s * (PORTAL.X + 0.7), 0, PORTAL.Z); p += `<rect x="${r(Math.min(a[0], b[0]))}" y="0" width="${r(Math.abs(b[0] - a[0]))}" height="${b[1]}" fill="${GOLD_V}"/>`; for (let y = 6; y < b[1]; y += 9) p += `<ellipse cx="${r((a[0] + b[0]) / 2)}" cy="${y}" rx="${r(Math.abs(b[0] - a[0]) * 0.32)}" ry="3" fill="none" stroke="#8a6418" stroke-width=".6"/>`; }
  S.hinten(`<g>${p}</g>`);
  PORTAL.o = o; PORTAL.u = u;
}

/* =====================================================================
   9 — DER ORCHESTERGRABEN (Messinggeländer, Pultlampen, Kontrabass)
   ===================================================================== */
{
  const Zg = 8.0, a = P(-PORTAL.X, 0.95, Zg), b = P(PORTAL.X, 0.95, Zg), rv = P(-PORTAL.X, 0.55, BUEHNE.Zv), rb = P(PORTAL.X, 0.55, BUEHNE.Zv);
  let k = poly([rv, rb, [b[0], b[1] + 2], [a[0], a[1] + 2]], "#050304");
  /* Pultlampen und Notenblätter (leuchten aus der Tiefe) */
  for (let i = 0; i < 9; i++) { const X = -4 + i * 1, [x, y] = P(X, 0.88, 8.75); k += `<path d="M${r(x - 2.2)} ${r(y + 1.6)} L${r(x + 2.2)} ${r(y + 1.6)} L${r(x + 1.8)} ${r(y - 0.6)} L${r(x - 1.8)} ${r(y - 0.6)} Z" fill="#f4ecd6" opacity=".8"/><ellipse cx="${x}" cy="${r(y - 0.8)}" rx="2.4" ry=".7" fill="#ffe7a0" opacity=".7"/>`; }
  /* Hals und Schnecke des Kontrabasses ragen heraus */
  { const [x, y] = P(3.4, 0.82, 8.6); k += `<path d="M${x} ${r(y + 2)} L${r(x + 1)} ${r(y - 7)}" stroke="#5a2a10" stroke-width="1.1"/><circle cx="${r(x + 1.2)}" cy="${r(y - 7.8)}" r="1.2" fill="#6a3214"/><path d="M${r(x - 3)} ${r(y + 2.5)} Q${r(x)} ${r(y - 1)} ${r(x + 3)} ${r(y + 2.5)}" fill="#7a3a14"/>`; }
  /* Dirigentenpult in der Mitte mit Licht */
  { const [x, y] = P(0, 0.93, 8.3); k += `<rect x="${r(x - 3)}" y="${r(y - 0.6)}" width="6" height="1.4" fill="#1e1e22"/><ellipse cx="${x}" cy="${r(y - 1)}" rx="4" ry="1" fill="#ffe7a0" opacity=".6"/>`; }
  /* Geländer: Messingrohr auf Pfosten mit rotem Samt dahinter */
  k += poly([[a[0], a[1]], [b[0], b[1]], [b[0], r(b[1] + 6)], [a[0], r(a[1] + 6)]], SAMT_H);
  for (let i = 0; i <= 12; i++) { const X = -PORTAL.X + i * PORTAL.X * 2 / 12, p = P(X, 0.95, Zg), q = P(X, 0.6, Zg); k += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${GOLD}" stroke-width=".7"/>`; }
  k += `<rect x="${a[0]}" y="${r(a[1] - 1)}" width="${r(b[0] - a[0])}" height="2" rx="1" fill="${GOLD}"/>`;
  const cx = (a[0] + b[0]) / 2;
  S.teil({ id: "th_orchestergraben", de: "der Orchestergraben", syl: "Or-CHES-ter-gra-ben", it: "la buca d'orchestra", itSyl: "BU-ca d'or-CHE-stra", en: "orchestra pit", x: r(cx), y: r(a[1] + 6), kunst: um(cx, a[1] + 6, k),
    tipp: "Die Vertiefung zwischen Bühne und erster Reihe. Dort sitzt das Orchester." });
}

/* =====================================================================
   10 — DER RANG (links, erster Rang) und 11 — DIE LOGE (rechts)
   ===================================================================== */
const bruestung = (s, Z0, Z1, H0, H1) => {
  const pts = [P(s * 5.3, H1, Z0), P(s * 5.3, H1, Z1), P(s * 5.3, H0, Z1), P(s * 5.3, H0, Z0)];
  let g = poly(pts, S.lg("brue" + (s < 0 ? "l" : "r"), [[0, "#8a5a1e"], [0.5, "#d8b056"], [1, "#7a4c14"]]));
  /* Kartuschen (Goldornament) */
  for (let Z = Z0 + 0.3; Z < Z1 - 0.1; Z += 0.65) { const c = P(s * 5.3, (H0 + H1) / 2 - 0.08, Z), m = ms(Z); g += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(0.1 * m * Math.abs(Z1 - Z0) / 3)}" ry="${r(0.22 * m)}" fill="#f6dc8a" stroke="#6e4c12" stroke-width=".4"/>`; }
  /* rote Samtauflage oben */
  const t = [P(s * 5.3, H1 + 0.12, Z0), P(s * 5.3, H1 + 0.12, Z1), pts[1], pts[0]];
  g += poly(t, SAMT_H);
  return { g, pts };
};
{
  let k = "";
  /* Inneres des Rangs: dunkle Sitzreihen mit roten Lehnen */
  const inn = [P(-5.3, 3.0, 6.55), P(-5.3, 3.0, PORTAL.Z), P(-5.3, 5.9, PORTAL.Z), P(-5.3, 5.9, 6.55)];
  k += poly([inn[0], inn[1], inn[2], inn[3]], "#1e0a0c");
  for (let i = 0; i < 3; i++) { const a = P(-5.6 - i * 0.6, 4.4 + i * 0.4, Math.max(6.6, 200 * (5.6 + i * 0.6) / 162)), b = P(-5.6 - i * 0.6, 4.4 + i * 0.4, PORTAL.Z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7a1a22" stroke-width="${r(1.6 - i * 0.3)}"/>`; }
  const br = bruestung(-1, 6.55, PORTAL.Z, 3.0, 4.0);
  k += br.g;
  /* Wandleuchte */
  { const l = P(-5.3, 4.8, 8.6); k += `<rect x="${r(l[0] - 0.4)}" y="${l[1]}" width=".8" height="4" fill="${GOLD}"/><ellipse cx="${l[0]}" cy="${l[1]}" rx="1.8" ry="2.2" fill="#ffe7b0"/><circle cx="${l[0]}" cy="${l[1]}" r="6" fill="#ffd27a" opacity=".18"/>`; }
  const [x, y] = P(-5.3, 3.0, 8.2);
  S.teil({ id: "th_rang", de: "der Rang", syl: "RANG", it: "la galleria", itSyl: "gal-le-RI-a", en: "balcony", x, y, kunst: um(x, y, k),
    tipp: "Die oberen Plätze an der Seite. Von dort sieht man auf die Bühne hinunter." });
}
{
  let k = "";
  const Z0 = 7.0, Z1 = PORTAL.Z;
  /* Logeninneres, roter Stoff, zwei Stühle */
  const inn = [P(5.3, 3.0, Z0), P(5.3, 3.0, Z1), P(5.3, 6.0, Z1), P(5.3, 6.0, Z0)];
  k += poly(inn, S.lg("logeinnen", [[0, "#5a1018"], [1, "#2a080c"]], 0, 0, 1, 0));
  for (const Z of [7.6, 8.4]) { const a = P(5.6, 4.0, Z), b = P(5.6, 4.9, Z); k += `<rect x="${r(a[0] - 2.4)}" y="${b[1]}" width="4.8" height="${r(a[1] - b[1])}" rx="1.2" fill="#8a1a22"/><rect x="${r(a[0] - 2.4)}" y="${b[1]}" width="4.8" height="1" fill="${GOLD}"/>`; }
  /* Vorhänge links und rechts der Logenöffnung, Baldachin */
  for (const [Z, s] of [[Z0, 1], [Z1, -1]]) { const a = P(5.3, 6.0, Z), b = P(5.3, 3.9, Z); k += `<path d="M${a[0]} ${a[1]} L${r(a[0] + s * 6)} ${a[1]} Q${r(a[0] + s * 2)} ${r((a[1] + b[1]) / 2)} ${r(b[0] + s * 1)} ${b[1]} L${b[0]} ${b[1]} Z" fill="${SAMT}"/>`; }
  const d1 = P(5.3, 6.4, Z0), d2 = P(5.3, 6.4, Z1), d3 = P(5.3, 5.9, Z1), d4 = P(5.3, 5.9, Z0);
  k += poly([d1, d2, d3, d4], GOLD) + `<path d="M${d4[0]} ${d4[1]} Q${r((d3[0] + d4[0]) / 2)} ${r((d3[1] + d4[1]) / 2 + 4)} ${d3[0]} ${d3[1]}" stroke="${SAMT_H}" stroke-width="2.4" fill="none"/>`;
  k += bruestung(1, Z0, Z1, 3.0, 4.0).g;
  { const l = P(5.3, 4.9, 7.3); k += `<ellipse cx="${l[0]}" cy="${l[1]}" rx="1.8" ry="2.2" fill="#ffe7b0"/><circle cx="${l[0]}" cy="${l[1]}" r="6" fill="#ffd27a" opacity=".18"/>`; }
  const [x, y] = P(5.3, 3.0, 8.1);
  S.teil({ id: "th_loge", de: "die Loge", syl: "LO-ge", it: "il palco", itSyl: "PAL-co", en: "box", x, y, kunst: um(x, y, k),
    tipp: "Eine Loge ist ein kleiner, abgetrennter Raum mit wenigen Plätzen – direkt neben der Bühne." });
}

/* =====================================================================
   12 — DIE SCHEINWERFER (an den Brüstungen) — Licht auf die Spieler
   ===================================================================== */
{
  let k = "", v = "";
  const ziel = [[P(-1.55, 2.0, 11.2), P(0.55, 2.2, 10.8)]];
  const spots = [[-5.3, 7.0], [-5.3, 7.9], [5.3, 7.4], [5.3, 8.2]];
  spots.forEach(([X, Z], i) => {
    const m = ms(Z), [x, y] = P(X, 4.12, Z), s = X < 0 ? 1 : -1;
    const tz = ziel[0][i % 2];
    const ang = Math.atan2(tz[1] - y, tz[0] - x) * 57.3;
    k += `<rect x="${r(x - 0.6)}" y="${r(y - 0.12 * m)}" width="1.2" height="${r(0.12 * m)}" fill="#1a1a1e"/>`;
    k += `<g transform="translate(${x} ${r(y - 0.16 * m)}) rotate(${Math.round(ang)})"><rect x="${r(-0.18 * m)}" y="${r(-0.07 * m)}" width="${r(0.36 * m)}" height="${r(0.14 * m)}" rx=".8" fill="${S.lg("spot", [[0, "#3a3a40"], [1, "#0e0e12"]])}"/><rect x="${r(0.16 * m)}" y="${r(-0.08 * m)}" width="${r(0.05 * m)}" height="${r(0.16 * m)}" fill="#2a2a30"/><ellipse cx="${r(0.21 * m)}" cy="0" rx=".6" ry="${r(0.06 * m)}" fill="#fff6d0"/></g>`;
    v += `<path d="M${x} ${r(y - 0.16 * m)} L${r(tz[0] - 9)} ${r(tz[1] + 26)} L${r(tz[0] + 9)} ${r(tz[1] + 26)} Z" fill="${S.lg("strahl" + i, [[0, "#fff1c4", 0.22], [1, "#fff1c4", 0.03]], x < tz[0] ? 0 : 1, 0, x < tz[0] ? 1 : 0, 1)}"/>`;
  });
  const [x, y] = P(-5.3, 4.1, 7.1);
  S.teil({ oben: true, id: "th_scheinwerfer", de: "der Scheinwerfer", syl: "SCHEIN-wer-fer", it: "il riflettore", itSyl: "ri-flet-TO-re", en: "spotlight", x, y, kunst: um(x, y, k),
    tipp: "Er wirft das Licht auf den, der gerade spricht." });
  S.davor(v);
}

/* =====================================================================
   13 — DIE PAUSE (Tafel am Portal: Beginn, Pause, Ende)
   ===================================================================== */
{
  const a = P(-6.3, 2.35, PORTAL.Z), b = P(-5.4, 1.3, PORTAL.Z), w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx=".6" fill="${GOLD}"/><rect x="${r(a[0] + 1)}" y="${r(a[1] + 1)}" width="${r(w - 2)}" height="${r(h - 2)}" fill="#1a1416"/>`;
  const t = (y, s, txt, f = "#f1eee2", wgt = "normal") => `<text x="${r(a[0] + w / 2)}" y="${r(a[1] + y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Georgia,serif" font-weight="${wgt}">${txt}</text>`;
  k += t(4.4, 2.3, "Heute", "#e2bc5a", "bold") + t(7.4, 1.8, "Beginn 19:30") + t(10.8, 2.4, "PAUSE", "#ffcf6a", "bold") + t(13.6, 1.8, "ca. 20:45 · 20 Min.") + t(17, 1.8, "Ende 22:15");
  const cx = a[0] + w / 2;
  S.teil({ id: "th_pause", de: "die Pause", syl: "PAU-se", it: "l'intervallo", itSyl: "in-ter-VAL-lo", en: "interval", x: r(cx), y: b[1], kunst: um(cx, b[1], k),
    tipp: "Nach etwa einer Stunde ist Pause. Dann darf man hinaus." });
}

/* =====================================================================
   14 — DIE SITZREIHEN (Parkett, ansteigend) und 15 — DAS PUBLIKUM
   ===================================================================== */
const REIHEN = [[7.0, 1], [6.1, 2], [5.2, 3]];
const sitzOben = (Z) => boden(Z) + 1.0;
{
  let k = "";
  REIHEN.forEach(([Z, nr]) => {
    const m = ms(Z), f = boden(Z), yo = P(0, f + 1.0, Z)[1], yu = P(0, f + 0.42, Z)[1], sw = 0.55 * m;
    /* Stufe (Podest) der Reihe */
    const s0 = P(-6.5, f, Z + 0.45), s1 = P(2.3, f, Z + 0.45);
    k += `<rect x="0" y="${r(yo)}" width="${r(s1[0])}" height="${r(Math.max(s0[1], yu + 4) - yo + 6)}" fill="#1a0a0c"/>`;
    for (let X = -6.4; X < 2.3 - 0.05; X += 0.55) {
      const x = P(X, 0, Z)[0];
      if (x + sw < 2) continue;
      const xl = Math.max(0, x + 0.5);
      k += `<path d="M${r(xl)} ${r(yu)} L${r(xl)} ${r(yo + 1.6)} Q${r(xl)} ${r(yo)} ${r(Math.max(xl, x + sw / 2))} ${r(yo - 0.4)} Q${r(x + sw - 0.5)} ${r(yo)} ${r(x + sw - 0.5)} ${r(yo + 1.6)} L${r(x + sw - 0.5)} ${r(yu)} Z" fill="${S.lg("lehne", [[0, "#b02a32"], [0.3, "#8a1820"], [1, "#4a080e"]])}"/>`;
      k += `<path d="M${r(x + 1.5)} ${r(yo + 0.7)} Q${r(x + sw / 2)} ${r(yo - 0.1)} ${r(x + sw - 1.5)} ${r(yo + 0.7)}" stroke="#e8a0a0" stroke-width=".4" opacity=".25" fill="none"/>`;
      if (x > 0.5) k += `<rect x="${r(x - 0.5)}" y="${r(yo + (yu - yo) * 0.35)}" width="1" height="${r((yu - yo) * 0.65)}" fill="${GOLD}" opacity=".7"/>`;
    }
    /* Reihennummer am Gang */
    const [gx, gy] = P(2.3, f + 0.75, Z);
    k += `<rect x="${r(gx - 1.8)}" y="${r(gy - 1.6)}" width="3.6" height="3.2" rx=".5" fill="${GOLD}"/><text x="${gx}" y="${r(gy + 0.9)}" font-size="2.4" text-anchor="middle" fill="#2a1a08" font-family="Georgia" font-weight="bold">${nr}</text>`;
  });
  /* Gang rechts: Teppich mit Stufenlicht */
  for (const [Z] of REIHEN) { const [x, y] = P(2.55, boden(Z) + 0.05, Z + 0.3); k += `<circle cx="${x}" cy="${y}" r=".7" fill="#ffb84a"/><ellipse cx="${x}" cy="${y}" rx="4" ry=".9" fill="#ffb84a" opacity=".2"/>`; }
  const [x, y] = P(-2, sitzOben(5.2), 5.2);
  S.teil({ id: "th_sitzreihe", de: "die Sitzreihe", syl: "SITZ-rei-he", it: "la fila", itSyl: "FI-la", en: "row of seats", x, y, kunst: um(x, y, k),
    tipp: "Auf der Eintrittskarte steht Reihe und Platz." });
}
{
  /* Publikum von hinten: nur Kopf und Schultern über der Lehne */
  let k = "";
  const leute = [
    [7.0, -2.2, { geschlecht: "m", frisur: "glatze", haarfarbe: "grau", jacke: "#2a2a30" }],
    [7.0, 0.55, { geschlecht: "w", frisur: "dutt", haarfarbe: "blond", jacke: "#3a1a4a" }],
    [6.1, -1.0, { geschlecht: "w", frisur: "lang", haarfarbe: "dunkelbraun", jacke: "#1a2a4a" }],
    [6.1, 1.6, { geschlecht: "m", frisur: "kurz", haarfarbe: "schwarz", jacke: "#3a3a3e" }],
  ];
  let ax = 0, ay = 0;
  leute.forEach(([Z, X, p], i) => {
    const m = ms(Z), f = boden(Z), [sx, sy] = P(X + 0.27, f + 0.45, Z + 0.25);
    const spec = { id: "b12d_pub" + i, geschlecht: p.geschlecht, pose: "sitzen", blick: 180, frisur: p.frisur, haarfarbe: p.haarfarbe, haut: "hell",
      kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: p.jacke }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } };
    const probe = B.mensch(spec, (p.geschlecht === "w" ? 1.66 : 1.78) * m);
    const x = sx - probe.z.sitz.x * probe.k, y = sy - probe.z.sitz.y * probe.k;
    const yo = P(0, f + 1.0, Z)[1];
    const fg = figur(spec, (p.geschlecht === "w" ? 1.66 : 1.78) * m, y - yo + 0.5);
    const cid = S.id("pub" + i);
    k += `<clipPath id="${cid}"><rect x="${r(x - 30)}" y="0" width="60" height="${r(yo + 0.3)}"/></clipPath><g clip-path="url(#${cid})"><g transform="translate(${r(x)} ${r(y)})">${fg.svg}</g></g>`;
    if (i === 1) { ax = x; ay = yo; }
  });
  /* Schein der Bühne auf den Köpfen */
  S.teil({ id: "th_publikum", de: "das Publikum", syl: "PU-bli-kum", it: "il pubblico", itSyl: "PUB-bli-co", en: "audience", x: r(ax), y: r(ay), kunst: um(ax, ay, k),
    tipp: "Alle sehen in dieselbe Richtung — nach vorn zur Bühne." });
}
{
  /* DIE GARDEROBENMARKE — liegt oben auf der Lehne der dritten Reihe */
  const Z = 5.2, [x, y] = P(-3.1, sitzOben(Z), Z), m = ms(Z);
  let k = `<ellipse cx="${x}" cy="${r(y - 0.2)}" rx="2.6" ry=".9" fill="${S.lg("marke", [[0, "#f2d27a"], [1, "#9a6a1e"]])}" stroke="#6e4c12" stroke-width=".25"/>`;
  k += `<path d="M${r(x - 2.6)} ${r(y - 0.2)} q-1.6 .4 -2.8 1.4" stroke="#c8202a" stroke-width=".5" fill="none"/>`;
  k += `<text x="${x}" y="${r(y + 0.25)}" font-size="1.1" text-anchor="middle" fill="#3a2408" font-family="Georgia" font-weight="bold">117</text>`;
  S.teil({ oben: true, id: "th_garderobe", de: "die Garderobenmarke", syl: "Gar-de-RO-ben-mar-ke", it: "il gettone del guardaroba", itSyl: "get-TO-ne", en: "cloakroom token", x, y, kunst: um(x, y, k + flaeche(x - 6, y - 2.4, 9.2, 4)),
    tipp: "Mantel abgeben, Marke behalten — ohne sie bekommt man ihn nicht zurück." });
}

/* =====================================================================
   16 — DIE BESUCHERIN (im Gang rechts) mit 17 — DEM PROGRAMMHEFT
   ===================================================================== */
{
  const X = 2.85, Z = 5.55, m = ms(Z), f = boden(Z), [x, y] = P(X, f, Z);
  const spec = { id: "b12d_bes", geschlecht: "w", pose: "halten", blick: -70, frisur: "locken", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { kleid: { stueck: "abendkleid", farbe: "#1a3a6a" }, jacke: { stueck: "jacke", farbe: "#2a2a30" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } };
  const fg = figur(spec, 1.66 * m);
  S.teil({ id: "th_besucherin", de: "die Besucherin", syl: "Be-SU-che-rin", it: "la spettatrice", itSyl: "spet-ta-TRI-ce", en: "theatregoer", x, y, kunst: schatten(0, 0.3, 7, 1.2, 0.45) + fg.svg,
    tipp: "Sie sucht ihren Platz — Reihe 7, Platz 12." });
  const hand = [fg.z.handL, fg.z.handR].filter(Boolean).sort((a, b) => a.x - b.x)[0];
  const hx = x + hand.x * fg.k, hy = y + hand.y * fg.k;
  let k = `<path d="M${r(hx - 3.4)} ${r(hy - 4.6)} L${r(hx + 0.6)} ${r(hy - 5.2)} L${r(hx + 1)} ${r(hy + 0.6)} L${r(hx - 3)} ${r(hy + 1.2)} Z" fill="${S.lg("heft", [[0, "#8a1a22"], [1, "#5a0a12"]])}" stroke="#3a0408" stroke-width=".2"/>`;
  k += `<text x="${r(hx - 1.2)}" y="${r(hy - 2.4)}" font-size=".9" text-anchor="middle" fill="${GOLD}" font-family="Georgia" font-weight="bold" transform="rotate(-6 ${r(hx)} ${r(hy)})">Kabale</text><text x="${r(hx - 1.2)}" y="${r(hy - 1.2)}" font-size=".9" text-anchor="middle" fill="${GOLD}" font-family="Georgia" font-weight="bold" transform="rotate(-6 ${r(hx)} ${r(hy)})">und Liebe</text>`;
  S.teil({ oben: true, id: "th_programmheft", de: "das Programmheft", syl: "Pro-GRAMM-heft", it: "il programma di sala", itSyl: "pro-GRAM-ma di SA-la", en: "programme", x: r(hx), y: r(hy), kunst: um(hx, hy, k + flaeche(hx - 4.6, hy - 6.4, 7, 8.4)),
    tipp: "Darin steht, wer wen spielt und wann die Pause ist." });
}

/* Dunkel im Saal: leichte Abdunklung vorn, warmes Bühnenlicht hinten */
S.davor(`<rect x="0" y="140" width="320" height="60" fill="${S.lg("saaldunkel", [[0, "#000", 0], [1, "#000", 0.25]])}"/>`);

S.defs = [...new Set(S.defs)];   /* doppelte Verläufe nur einmal */
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/theater.js"));
console.log(aus);
