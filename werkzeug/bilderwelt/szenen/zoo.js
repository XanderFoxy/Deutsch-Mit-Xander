#!/usr/bin/env node
/* =====================================================================
   DER ZOO (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   Diese Datei enthält oben den TIER-BAUKASTEN (realistische Tiere in
   Seitenansicht, echte Proportionen in Dezimetern), den auch zoo2,
   tiere_welt und meer benutzen: require("./zoo.js").tierBaukasten(S).
   Darunter wird die Szene „Der Zoo“ gebaut (nur wenn die Datei direkt
   gestartet wird).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = B;
const r = B.r;

/* =====================================================================
   TIER-BAUKASTEN
   Alle Tiere schauen nach rechts (dir = -1 spiegelt), stehen mit den
   Füßen auf y = 0 und sind in DEZIMETERN gezeichnet (1 = 10 cm). Der
   Aufruf bekommt m = Einheiten je Meter der Szene an dieser Tiefe:
   so stimmen die Größenverhältnisse von selbst (Giraffe 5 m, Elefant
   3,2 m Schulterhöhe, Nashorn 1,7 m, Zebra 1,3 m, Löwe 1,2 m …).
   ===================================================================== */
function tierBaukasten(S) {
  const done = new Set();
  const einmal = (n, f) => { if (!done.has(n)) { done.add(n); f(); } };
  const rnd = zufall(4711);
  const f = (n) => r(n);
  /* Gruppe in Szeneneinheiten: Dezimeter → Einheiten (k = m / 10) */
  const gr = (m, dir, inner, extra = "") => `<g transform="scale(${(dir * m / 10).toFixed(4)} ${(m / 10).toFixed(4)})"${extra}>${inner}</g>`;
  /* Volumen: oben Licht, unten Schatten — über jede Körperform gelegt */
  const VOL = () => LG("tw_vol", [[0, "#fff", 0.2], [0.4, "#fff", 0], [0.62, "#000", 0], [1, "#000", 0.38]]);
  const VOLX = () => LG("tw_volx", [[0, "#000", 0.16], [0.35, "#000", 0], [0.75, "#fff", 0.06], [1, "#000", 0.12]], 0, 0, 1, 0);
  const koerper = (d, fuell, umriss = "#000", extra = "") => `<path d="${d}" fill="${fuell}"/><path d="${d}" fill="${VOL()}"/><path d="${d}" fill="${VOLX()}" stroke="${umriss}" stroke-opacity=".35" stroke-width=".12"${extra}/>`;
  const auge = (x, y, rr = 0.35, iris = "#1a0f08") => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr * 1.15)}" ry="${f(rr)}" fill="${iris}"/><circle cx="${f(x + rr * 0.35)}" cy="${f(y - rr * 0.35)}" r="${f(rr * 0.32)}" fill="#fff" opacity=".85"/>`;
  /* Verläufe nur einmal anlegen (sonst doppelte Einträge in <defs>) */
  const LG = (name, ...a) => { if (!done.has("lg" + name)) { done.add("lg" + name); return S.lg(name, ...a); } return `url(#${S.id(name)})`; };
  const RG = (name, ...a) => { if (!done.has("rg" + name)) { done.add("rg" + name); return S.rg(name, ...a); } return `url(#${S.id(name)})`; };
  /* Verlauf in Dezimeter-Koordinaten des Tieres: so gehen Rumpf und Beine nahtlos ineinander über */
  const U = (name, stops, y1, y2) => LG(name, stops, 0, y1, 0, y2, ' gradientUnits="userSpaceOnUse"');
  const VOLH = (h) => U("tw_volh" + Math.round(h), [[0, "#fff", 0.24], [0.3, "#fff", 0.04], [0.55, "#000", 0], [0.8, "#000", 0.18], [1, "#000", 0.26]], -h, 0);
  /* Gliedmaße aus Gelenken [x, y, Breite hinten, Breite vorn], von oben nach unten, weich verbunden */
  const glied = (p) => {
    const L = p.map((q) => [q[0] - q[2], q[1]]), R = p.map((q) => [q[0] + q[3], q[1]]).reverse();
    const zug = (a) => { let s = ""; for (let i = 1; i < a.length - 1; i++) { const mx = (a[i][0] + a[i + 1][0]) / 2, my = (a[i][1] + a[i + 1][1]) / 2; s += `Q${f(a[i][0])} ${f(a[i][1])} ${f(mx)} ${f(my)} `; } return s + `L${f(a[a.length - 1][0])} ${f(a[a.length - 1][1])} `; };
    return `M${f(L[0][0])} ${f(L[0][1])} ${zug(L)}L${f(R[0][0])} ${f(R[0][1])} ${zug(R)}Z`;
  };
  const versch = (p, dx) => p.map(([x, y, a, b]) => [x + dx, y, a, b]);
  /* Huf: dunkle Kappe unten am Bein */
  const huf = (p, farbe = "#2b2420", h = 0.55) => { const q = p[p.length - 1]; return `<path d="M${f(q[0] - q[2] * 0.82)} ${f(-h)} L${f(q[0] + q[3] * 0.8)} ${f(-h)} L${f(q[0] + q[3])} 0 L${f(q[0] - q[2])} 0 Z" fill="${farbe}"/>`; };
  /* Fläche zeichnen: Grundfarbe + Licht (nahtlos über alle Teile) */
  const fl = (dd, fuell, h, dunkel = 0) => `<path d="${dd}" fill="${fuell}"/><path d="${dd}" fill="${VOLH(h)}"/>` + (dunkel ? `<path d="${dd}" fill="#000" opacity="${dunkel}"/>` : "");
  const linie = (d, farbe = "#000", o = 0.25, w = 0.14) => `<path d="${d}" stroke="${farbe}" stroke-opacity="${o}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  /* Netz-Fleckenmuster (Giraffe): verzerrtes Gitter, Flecken = geschrumpfte Vierecke */
  const netzMuster = (name, c, N, farben, spalt, seed) => {
    const z = zufall(seed), jx = [], jy = [];
    for (let i = 0; i < N; i++) { jx.push([]); jy.push([]); for (let j = 0; j < N; j++) { jx[i].push((z() - 0.5) * c * 0.55); jy[i].push((z() - 0.5) * c * 0.55); } }
    const P = (i, j) => { const a = ((i % N) + N) % N, b = ((j % N) + N) % N; return [i * c + jx[a][b], j * c + jy[a][b]]; };
    let g = "";
    for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) {
      const q = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)];
      const mx = q.reduce((s, p) => s + p[0], 0) / 4, my = q.reduce((s, p) => s + p[1], 0) / 4;
      const pts = q.map(([x, y]) => [mx + (x - mx) * (1 - spalt), my + (y - my) * (1 - spalt)]);
      const fa = farben[(((i % farben.length) + farben.length) + ((j * 2) % farben.length)) % farben.length];
      g += `<path d="M${pts.map(([x, y]) => f(x) + " " + f(y)).join(" L")} Z" fill="${fa}" stroke="${fa}" stroke-width="${f(c * 0.12)}" stroke-linejoin="round"/>`;
    }
    S.def(`<pattern id="${S.id(name)}" patternUnits="userSpaceOnUse" width="${f(N * c)}" height="${f(N * c)}">${g}</pattern>`);
    return `url(#${S.id(name)})`;
  };
  /* Rosetten (Leopard) */
  const rosetten = (name, grund) => {
    const z = zufall(77), c = 1.15;
    let g = "";
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const x = i * c + (j % 2) * c / 2 + (z() - 0.5) * 0.25, y = j * c + (z() - 0.5) * 0.25, rr = 0.36 + z() * 0.1;
      g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr * 0.75)}" fill="${grund}"/>`;
      for (let a = 0; a < 5; a++) {
        const w = a * 1.257 + z() * 0.4;
        g += `<circle cx="${f(x + Math.cos(w) * rr)}" cy="${f(y + Math.sin(w) * rr)}" r="${f(0.13 + z() * 0.06)}" fill="#2a1a0c"/>`;
      }
    }
    S.def(`<pattern id="${S.id(name)}" patternUnits="userSpaceOnUse" width="${f(5 * c)}" height="${f(5 * c)}">${g}</pattern>`);
    return `url(#${S.id(name)})`;
  };

  const T = {};

  /* ---------------- GIRAFFE (Netzgiraffe), 5 m hoch ---------------- */
  T.giraffe = (m, dir = 1) => {
    einmal("gir", () => {
      netzMuster("tw_girnetz", 2.0, 4, ["#8a4a1e", "#7d4219", "#94521f", "#83461c"], 0.2, 31);
      S.def(`<clipPath id="${S.id("tw_girclip")}"><rect x="-30" y="-60" width="60" height="48.5"/></clipPath>`);
    });
    const NETZ = `url(#${S.id("tw_girnetz")})`, CREME = U("tw_gircreme", [[0, "#f3e4c4"], [1, "#dcc69c"]], -50, 0);
    const vn = [[5.2, -21, 2.2, 1.8], [5.2, -17.4, 1.4, 1.3], [5.5, -13, 0.75, 0.8], [5.6, -10.6, 0.78, 0.78], [5.6, -9, 0.5, 0.55], [5.7, -1.4, 0.6, 0.62], [5.85, -0.6, 0.5, 0.56], [5.95, 0, 0.72, 0.85]];
    const hn = [[-7.8, -23.5, 2.8, 2.2], [-7.6, -19.5, 2.7, 1.7], [-8.3, -14, 1.25, 0.95], [-8.5, -10.6, 1.05, 0.55], [-8.2, -8.4, 0.5, 0.55], [-7.9, -1.4, 0.6, 0.62], [-7.75, -0.6, 0.5, 0.56], [-7.6, 0, 0.72, 0.85]];
    const vf = versch(vn, -2.2), hf = versch(hn, -1.4);
    const leib = "M-10.5 -25.4 C-6 -27.6 0 -29.6 4 -31.6 C8 -36 11.4 -42 13.2 -46.6 Q13.7 -48.3 15.3 -48 L19.8 -45.4 Q20.9 -44.8 20.3 -43.9 Q19.4 -43.1 17.6 -43.6 Q15.6 -43.8 14.9 -44.4 C13.6 -40 10.6 -30 8.4 -23.4 Q7.6 -20 6.2 -18.6 C3 -17.3 -3 -17.1 -6.4 -18 Q-8.4 -18.6 -9.8 -17.6 C-11.6 -19 -11.9 -23.4 -10.5 -25.4 Z";
    const netz = (d) => `<path d="${d}" fill="${NETZ}" clip-path="url(#${S.id("tw_girclip")})"/>`;
    let k = "";
    for (const p of [vf, hf]) { const d = glied(p); k += `<path d="${d}" fill="${CREME}"/>` + netz(d) + `<path d="${d}" fill="#000" opacity=".3"/>` + huf(p); }
    k += `<path d="M-10.6 -24.6 Q-11.6 -20 -11.4 -14.2" stroke="#b9925a" stroke-width=".45" fill="none"/><path d="M-11.4 -15.2 q-.8 1.6 -.2 3.6 q.6 .4 .9 -.2 q.2 -2 -.2 -3.4 Z" fill="#1d140c"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${CREME}"/>` + netz(d);
    k += `<path d="M14.6 -47.2 Q15.4 -48 16.6 -47.4 L19.8 -45.4 Q20.9 -44.8 20.3 -43.9 Q19.4 -43.1 17.6 -43.6 Q15.6 -43.8 14.9 -44.4 Z" fill="#d9b98a"/>`;
    k += `<path d="M18.6 -45.4 Q20.2 -45.2 20.5 -44.2 Q19.6 -43.4 18.2 -43.7 Z" fill="#7a5a3d" opacity=".55"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(50)}"/>`;
    k += huf(vn) + huf(hn);
    /* Muskeln: Schulter, Oberschenkel, Bauchlinie */
    k += linie("M6.6 -27 Q4.4 -23 5.4 -19") + linie("M-6 -24.6 Q-4.6 -21 -6 -18.4") + linie("M-9.4 -13.4 l-.4 1.4", "#000", 0.3) + linie("M5.2 -11.4 l.5 .8", "#000", 0.25);
    /* Mähne, Ohr, Hörnchen (Ossikone), Auge, Nüster */
    k += `<path d="M4.4 -31.4 C8.2 -35.6 11.2 -41.4 13 -46.2 L13.5 -45.8 C11.8 -41 8.8 -35.2 5 -31 Z" fill="#6e3d18"/>`;
    k += `<path d="M14.6 -46.9 q-1.8 -.9 -2.6 -.2 q1 .9 2.6 .9 Z" fill="#cfa877" stroke="#7c5634" stroke-width=".1"/>`;
    k += `<path d="M14.9 -47.8 L14.6 -50.2 M16 -47.6 L15.9 -50" stroke="#a37a4c" stroke-width=".55" stroke-linecap="round"/><circle cx="14.6" cy="-50.3" r=".42" fill="#2a1a0e"/><circle cx="15.9" cy="-50.1" r=".42" fill="#2a1a0e"/>`;
    k += auge(16.9, -46.3, 0.42) + `<path d="M16.3 -46.9 q.6 -.4 1.3 0" stroke="#3a2412" stroke-width=".12" fill="none"/>`;
    k += `<ellipse cx="19.9" cy="-44.9" rx=".35" ry=".18" fill="#2a1a0e"/><path d="M18.8 -43.9 q.8 .2 1.4 -.1" stroke="#3a2412" stroke-width=".12" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- ZEBRA (Steppenzebra), Schulterhöhe 1,3 m ---------------- */
  T.zebra = (m, dir = 1) => {
    const leib = "M-8.6 -13.2 C-5 -13.6 -0.5 -13.2 3 -13.8 Q6.4 -15.4 8.6 -18.2 Q9.4 -18.4 9.8 -17.6 L12.2 -14.2 Q12.6 -13.2 11.9 -12.9 L11.1 -13 Q10.2 -13.6 9.5 -14.3 Q8.6 -15.4 7.9 -15.2 C7 -13.2 6 -10.8 5.4 -9.6 Q5 -7.8 3.6 -7 C1 -6.3 -2.5 -6.3 -4.8 -6.9 Q-6.8 -7.4 -8.4 -8.6 C-9.6 -10.2 -9.6 -12.4 -8.6 -13.2 Z";
    const vn = [[3.9, -9.5, 1.3, 1.4], [3.8, -7, 1.15, 1.0], [4.0, -5, 0.62, 0.7], [4.1, -3.6, 0.55, 0.55], [4.1, -2.6, 0.36, 0.42], [4.15, -1.05, 0.44, 0.46], [4.35, -0.5, 0.36, 0.42], [4.45, 0, 0.5, 0.62]];
    const hn = [[-7, -11, 1.8, 1.6], [-6.9, -8.4, 1.9, 1.7], [-7.4, -5.9, 0.95, 0.85], [-7.35, -4.3, 0.78, 0.42], [-7.15, -2.7, 0.36, 0.38], [-7.05, -1.05, 0.44, 0.42], [-6.9, -0.5, 0.36, 0.4], [-6.8, 0, 0.5, 0.6]];
    const vf = versch(vn, -1.5), hf = versch(hn, -1.2);
    einmal("zeb", () => {
      let st = "";
      for (let x = -3.4; x < 4.4; x += 1.0) st += `<path d="M${f(x)} -14.5 Q${f(x + 0.5)} -10.5 ${f(x - 0.1)} -6" stroke="#161210" stroke-width=".52" fill="none"/>`;
      for (let i = 0; i < 6; i++) { const t = i / 5; const x0 = 4.4 + t * 3.6, y0 = -14.4 - t * 3.8; st += `<path d="M${f(x0 - 0.6)} ${f(y0 - 0.6)} L${f(x0 + 1.9)} ${f(y0 + 2.6 - t * 0.4)}" stroke="#161210" stroke-width=".5"/>`; }
      for (let i = 0; i < 5; i++) st += `<path d="M${f(-4.4 - i * 0.9)} -14.6 Q${f(-4.8 - i * 0.7)} ${f(-10.5 + i * 0.3)} -11 ${f(-12.6 + i * 1.3)}" stroke="#161210" stroke-width=".48" fill="none"/>`;
      st += `<path d="M-4.4 -9.2 Q-7 -10 -9.8 -9.2 M-4.6 -7.8 Q-7 -8.6 -9.6 -8" stroke="#161210" stroke-width=".42" fill="none"/>`;
      for (let i = 0; i < 4; i++) st += `<path d="M${f(9.4 + i * 0.6)} ${f(-17.4 + i * 1)} L${f(8.8 + i * 0.5)} ${f(-14.8 + i * 0.5)}" stroke="#161210" stroke-width=".28"/>`;
      for (let y = -7.4; y < -1.2; y += 0.6) st += `<path d="M-12 ${f(y)} L8 ${f(y)}" stroke="#161210" stroke-width="${f(0.22 + (y + 7.4) * 0.012)}"/>`;
      S.def(`<clipPath id="${S.id("tw_zebclip")}"><path d="${leib}"/><path d="${glied(vn)}"/><path d="${glied(vf)}"/><path d="${glied(hn)}"/><path d="${glied(hf)}"/></clipPath>`);
      S.def(`<g id="${S.id("tw_zebst")}">${st}</g>`);
    });
    const WEISS = U("tw_zebw", [[0, "#fbfaf6"], [1, "#e9e6de"]], -18, 0);
    const streifen = `<g clip-path="url(#${S.id("tw_zebclip")})"><use href="#${S.id("tw_zebst")}"/></g>`;
    let k = "";
    for (const p of [vf, hf]) k += `<path d="${glied(p)}" fill="${WEISS}"/>`;
    k += streifen;
    for (const p of [vf, hf]) k += `<path d="${glied(p)}" fill="#000" opacity=".22"/>` + huf(p, "#1a1614", 0.5);
    k += `<path d="M-9 -12.8 Q-10 -10 -9.8 -7.4" stroke="#efece5" stroke-width=".4" fill="none"/><path d="M-9.9 -8.4 q-.4 1.4 0 2.6 q.5 .2 .6 -.3 q0 -1.4 -.3 -2.4 Z" fill="#141010"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${WEISS}"/>`;
    k += streifen;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(18)}"/>`;
    k += huf(vn, "#1a1614", 0.5) + huf(hn, "#1a1614", 0.5);
    k += `<path d="M11.4 -14 Q12.7 -13.6 12.1 -12.9 L11.1 -13 Q10.6 -13.4 11.4 -14 Z" fill="#141010"/>`;
    k += `<path d="M3.2 -14 Q6.4 -15.6 8.6 -18.3 L8.4 -19.2 Q6 -16.6 2.9 -14.7 Z" fill="#efebe2"/>`;
    for (let i = 0; i < 9; i++) { const t = i / 8; k += `<path d="M${f(3.3 + t * 5)} ${f(-14.2 - t * 4)} l${f(-0.25)} ${f(-0.85)}" stroke="#151110" stroke-width=".3"/>`; }
    k += `<path d="M8.8 -18 Q8.4 -20.4 9.1 -20.7 Q9.7 -19.5 9.5 -17.9 Z" fill="#f3f0ea" stroke="#151110" stroke-width=".15"/><path d="M9 -20.2 L9.1 -18.5" stroke="#151110" stroke-width=".28"/>`;
    k += auge(10.1, -16.4, 0.3);
    return gr(m, dir, k);
  };

  /* ---------------- ELEFANT (Afrikanischer), Schulterhöhe 3,2 m ---------------- */
  T.elefant = (m, dir = 1) => {
    const HAUT = U("tw_ele", [[0, "#a29c96"], [1, "#7c766f"]], -34, 0);
    const leib = "M-14 -28.5 C-9 -31.6 -2 -31.4 4 -31.6 Q8 -34.4 11.2 -33.8 C13.8 -33.2 15.2 -29 15.3 -24 C15.6 -17 16.6 -10 17.5 -4.2 Q17.9 -2.4 16.9 -2.2 Q16 -2.4 16.3 -3.4 C15.4 -8 14.2 -15 13 -20.4 Q12.2 -20.2 11.6 -21 C10.4 -19.8 9.6 -18.4 8.6 -16.4 C4 -13.4 -6 -12.8 -11 -14 C-15 -16 -15.9 -24 -14 -28.5 Z";
    const vn = [[7.2, -20, 3.0, 2.8], [7.2, -14, 2.6, 2.5], [7.3, -8, 2.2, 2.2], [7.3, -2.2, 2.15, 2.2], [7.4, 0, 2.4, 2.5]];
    const hn = [[-9.4, -23, 3.8, 3.2], [-9.6, -15, 3.1, 2.8], [-9.4, -8, 2.2, 2.3], [-9.3, -2.2, 2.2, 2.2], [-9.2, 0, 2.45, 2.5]];
    const vf = versch(vn, -3), hf = versch(hn, 2.6);
    let k = "";
    for (const p of [vf, hf]) k += fl(glied(p), HAUT, 34, 0.25);
    k += `<path d="M-14.3 -27 Q-15.8 -22 -15.4 -16" stroke="#7b746e" stroke-width=".45" fill="none"/><path d="M-15.6 -16.4 l-.3 1.6 l.8 0 l-.1 -1.6 Z" fill="#2a2623"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${HAUT}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(34)}"/>`;
    for (const x of [-9.2, 7.4]) k += `<path d="M${x - 2} -.6 q.5 -.6 1 0 M${x - .4} -.6 q.5 -.6 1 0 M${x + 1.2} -.6 q.5 -.6 1 0" stroke="#d8d2c6" stroke-width=".35" fill="none"/>`;
    for (let i = 0; i < 12; i++) { const t = i / 11, y = -22 + t * 18.5, x0 = 13.3 + t * 2.4; k += linie(`M${f(x0)} ${f(y)} q${f(0.9)} ${f(-0.3)} ${f(1.8)} ${f(0.1)}`, "#3a3531", 0.45); }
    for (const x of [-9.3, 7.3]) for (let i = 0; i < 5; i++) k += linie(`M${f(x - 2)} ${f(-3 - i * 2.2)} q2 .6 4 0`, "#3a3531", 0.3, 0.12);
    k += linie("M-11 -21 Q-9 -17 -10 -14") + linie("M-6 -27 Q-3.6 -23 -4.6 -14.6", "#000", 0.18) + linie("M-13.6 -20 Q-12 -18 -12.6 -15", "#000", 0.2);
    k += `<path d="M12.3 -21.4 Q14.4 -19.2 16.8 -18.4 Q14.6 -18 12 -20.2 Z" fill="${LG("tw_elfz", [[0, "#f6efdc"], [1, "#d8cba8"]])}" stroke="#a89b78" stroke-width=".1"/>`;
    const ohr = "M10.6 -32.6 C7 -35.6 1.2 -34.6 0.4 -29.2 C-0.2 -24 1.2 -19 3.8 -16.8 C5.8 -15.6 7.4 -17.4 7.9 -19.6 C8.8 -23 10.8 -27.6 10.6 -32.6 Z";
    k += `<path d="${ohr}" fill="${LG("tw_eleohr", [[0, "#aaa49e"], [1, "#878079"]], 0, 0, 1, 0)}"/><path d="${ohr}" fill="${VOLH(34)}" stroke="#5c5651" stroke-width=".15"/>`;
    k += `<path d="M9 -31.6 C6 -30 4 -27 4.4 -22 M7 -32.6 C4 -31 2.2 -28 2.6 -24 M9.6 -27 C7.6 -25 6.6 -22 6.4 -19" stroke="#6d6761" stroke-width=".14" fill="none" opacity=".7"/>`;
    k += `<path d="M10.4 -32.4 C8 -33.6 4 -33.6 2 -31.4" stroke="#c4beb7" stroke-width=".3" fill="none"/>`;
    k += auge(12.3, -27.2, 0.32) + `<path d="M11.7 -27.8 q.7 -.4 1.3 .1" stroke="#4d4743" stroke-width=".14" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- NASHORN (Breitmaulnashorn), Schulterhöhe 1,7 m ---------------- */
  T.nashorn = (m, dir = 1) => {
    const HAUT = U("tw_nas", [[0, "#aaa298"], [1, "#857c72"]], -18, 0);
    const leib = "M-15 -15.5 C-10 -17.2 -4 -17 0 -16.9 Q3 -19.2 5.6 -17.2 C8 -15.6 10 -13 12.2 -11 L13.8 -10.2 L18.6 -8 Q19.3 -7 18.7 -5.8 L15.8 -5.8 Q13 -6.2 12.6 -6.8 C10 -7.6 8.6 -7.6 7 -7.2 C3 -5 -8 -4.8 -12 -6.2 C-16 -8 -16.8 -13 -15 -15.5 Z";
    const vn = [[6, -9, 2.3, 2.0], [5.9, -5.4, 1.8, 1.7], [6.1, -1.6, 1.6, 1.7], [6.2, 0, 1.85, 2.0]];
    const hn = [[-10, -12, 2.8, 2.6], [-10.2, -7, 2.2, 1.8], [-10.6, -4, 1.7, 1.4], [-10.3, -1.4, 1.6, 1.6], [-10.2, 0, 1.85, 1.95]];
    const vf = versch(vn, -2.4), hf = versch(hn, 2.2);
    let k = "";
    for (const p of [vf, hf]) k += fl(glied(p), HAUT, 18, 0.25);
    k += `<path d="M-15.2 -15 Q-16.6 -12 -16.2 -9" stroke="#8a8177" stroke-width=".5" fill="none"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${HAUT}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(18)}"/>`;
    for (const x of [-10.2, 6.2]) k += `<path d="M${x - 1.6} -.5 q.4 -.5 .9 0 M${x - .4} -.5 q.4 -.5 .9 0 M${x + .8} -.5 q.4 -.5 .9 0" stroke="#5f574e" stroke-width=".3" fill="none"/>`;
    k += linie("M3 -16.6 Q1.6 -12 3.2 -8", "#2a241e", 0.35, 0.2) + linie("M-8.6 -16.6 Q-10.4 -12 -8.4 -7.2", "#2a241e", 0.35, 0.2) + linie("M7.6 -15.2 Q6.8 -12 7.8 -8", "#2a241e", 0.3, 0.18) + linie("M-6 -6 Q0 -5 4 -6.6", "#2a241e", 0.2);
    k += `<path d="M15.4 -9.4 Q16.4 -13.6 15.4 -16 Q17.8 -12.6 17.8 -8.8 Z" fill="${LG("tw_horn", [[0, "#8b8172"], [1, "#b1a796"]])}"/>`;
    k += `<path d="M13 -10.6 Q13.6 -12.6 13.2 -13.6 Q14.6 -12 14.4 -10.2 Z" fill="#9a907f"/>`;
    k += `<path d="M11.2 -11.6 Q10.4 -14 11 -14.8 Q11.8 -13.8 12 -11.4 Z" fill="#9b9289" stroke="#5f574e" stroke-width=".1"/>`;
    k += auge(13.6, -8.9, 0.26) + `<path d="M17.2 -6.7 q.8 .3 1.3 -.1" stroke="#4a433c" stroke-width=".15" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- FLUSSPFERD, Schulterhöhe 1,5 m (optional im Wasser) ---------------- */
  T.nilpferd = (m, dir = 1, wasser = null) => {
    const HAUT = U("tw_nil", [[0, "#8f7c7c"], [0.65, "#7b6a6c"], [1, "#a8827c"]], -16, 0);
    const leib = "M-15 -13 C-10 -15.6 0 -15.8 6 -15 Q9 -14.6 10.4 -15.2 Q10.8 -16.8 11.8 -16.2 Q12.2 -16.8 13.2 -16.4 C14.6 -15.6 16 -14 18.8 -12.8 Q20.6 -12 20.4 -9.6 Q20.3 -7.6 18.6 -7 L15 -7 Q12.2 -6.8 11 -7.6 C9.6 -6.6 9 -6.4 8 -6.2 C4 -4.4 -8 -4.4 -13 -5.6 C-16.6 -7 -17 -11 -15 -13 Z";
    const vn = [[6.4, -7, 2.2, 2.2], [6.4, -3, 1.8, 1.8], [6.5, 0, 2.0, 2.0]], hn = [[-9.6, -8, 2.8, 2.4], [-9.4, -3, 1.9, 1.8], [-9.3, 0, 2.0, 2.0]];
    let k = "";
    for (const p of [versch(vn, -2.2), versch(hn, 2)]) k += fl(glied(p), HAUT, 16, 0.25);
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${HAUT}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(16)}"/>`;
    k += `<path d="M20 -9.4 Q16.6 -9.2 12.6 -10.6" stroke="#4d3a3c" stroke-width=".22" fill="none"/>`;
    k += `<ellipse cx="14.6" cy="-9.4" rx="2.4" ry="1.6" fill="#c99a8e" opacity=".45"/>`;
    k += `<ellipse cx="19.2" cy="-12.6" rx=".45" ry=".22" fill="#3a2a2b"/><path d="M11 -15.8 q.2 -1.4 .9 -1 q-.1 .8 -.5 1.2 Z" fill="#6c5a5c"/>`;
    k += linie("M4.6 -12.6 Q3.8 -10 4.6 -7.4", "#000", 0.15) + linie("M-8.6 -12.6 Q-10 -10 -9.2 -6.4", "#000", 0.15) + auge(13, -15.3, 0.28);
    let g = gr(m, dir, k);
    if (wasser) {
      const y = -wasser * m / 10;
      g = `<g>${g}<path d="M${f(-17 * m / 10)} ${f(y)} L${f(21 * m / 10)} ${f(y)} L${f(21 * m / 10)} ${f(y + 1.6 * m / 10)} Q0 ${f(y + 2.4 * m / 10)} ${f(-17 * m / 10)} ${f(y + 1.6 * m / 10)} Z" fill="${LG("tw_nilw", [[0, "#5d7f74", 0.92], [1, "#4b6a60", 0.98]])}"/>` +
        `<path d="M${f(-16 * m / 10)} ${f(y + 0.2)} q${f(16 * m / 10)} ${f(-0.6 * m / 10)} ${f(36 * m / 10)} 0" stroke="#d6e6df" stroke-width=".35" opacity=".7" fill="none"/></g>`;
    }
    return g;
  };

  /* ---------------- GROSSKATZEN: Löwe, Löwin, Tiger, Leopard, Puma ---------------- */
  const KATZE = {
    loewe: { sx: 1, sy: 1.02, fell: ["#b88544", "#e8c896"], maehne: true, quaste: true, kopf: 0.8, auge: "#8a6420" },
    loewin: { sx: 0.94, sy: 0.92, fell: ["#bd8c4c", "#ecd5a6"], quaste: true, kopf: 0.76, auge: "#8a6420" },
    tiger: { sx: 1.1, sy: 0.92, fell: ["#cf6c1a", "#f0a457"], streifen: true, bauch: "#f6efe2", kopf: 0.8, auge: "#9a8a1e" },
    leopard: { sx: 0.72, sy: 0.64, fell: ["#c39a55", "#ecd49c"], rosette: true, bauch: "#f3e8d2", kopf: 0.82, auge: "#9a8a1e" },
    puma: { sx: 0.74, sy: 0.64, fell: ["#a47e55", "#dcc09a"], bauch: "#efe3d2", spitze: true, kopf: 0.72, auge: "#8a6a20" }
  };
  T.katze = (art, m, dir = 1, pose = "stehen") => {
    const K = KATZE[art], lieg = pose === "liegen";
    const FELL = U("tw_k_" + art, [[0, K.fell[0]], [0.55, K.fell[0]], [1, K.fell[1]]], -12, 0);
    const BAUCH = K.bauch || K.fell[1];
    const leib = lieg
      ? "M-9 -5.4 C-6 -6.8 -1 -7.2 3 -7.6 Q5.6 -8 6.8 -7.2 C7.6 -6.4 7.6 -5 7 -3.8 Q6.4 -2.8 5.6 -2.4 L5.4 0 L-7.6 0 C-10 -.6 -10.6 -4 -9 -5.4 Z"
      : "M-8.2 -10.2 C-5 -9.9 -1 -10.2 2.4 -11 Q4.6 -11.7 6 -11.2 C7.4 -10.6 7.9 -9.2 7.5 -7.8 Q6.8 -6 5 -5.3 C2.4 -4.8 .4 -5 -1.4 -5.6 C-3.4 -6.2 -5 -6.4 -6.6 -6.8 Q-8.6 -7.6 -9 -8.8 Q-9 -9.8 -8.2 -10.2 Z";
    const vn = [[3.8, -9.4, 2.1, 1.9], [3.2, -6.2, 1.7, 1.25], [3.7, -4.2, 1.0, 1.0], [3.9, -1.6, 0.78, 0.82], [4.2, -0.6, 0.8, 1.1], [4.4, 0, 0.9, 1.5]];
    const hn = [[-6.4, -9.4, 2.6, 2.2], [-6.0, -7.2, 2.5, 2.0], [-7.0, -4.8, 1.2, 0.85], [-7.5, -3.4, 0.95, 0.6], [-7.1, -1.4, 0.65, 0.66], [-6.8, -0.55, 0.7, 0.95], [-6.6, 0, 0.8, 1.35]];
    const teile = lieg
      ? ["M4.4 -2.6 C6 -2.4 8 -1.8 9.8 -1.3 Q10.9 -.8 10.4 0 L4.2 0 Z", "M-9.4 -2.8 C-9.6 -5.2 -7.6 -6.2 -5.6 -5.8 C-3.4 -5.2 -2.8 -2.6 -4 -1 L-1.4 -.8 Q-.8 -.3 -1.3 0 L-8 0 C-9 -.6 -9.4 -1.6 -9.4 -2.8 Z"]
      : [glied(hn), glied(vn)];
    let k = "";
    /* Schwanz */
    const sw = art === "tiger" ? 1.1 : 0.8;
    k += lieg ? `<path d="M-9.2 -1 C-11.6 -.6 -13.6 -.4 -14.6 -.9" stroke="${K.fell[0]}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`
      : `<path d="M-8.4 -9.8 C-10.6 -9 -11 -5 -10.6 -2.4 Q-10.4 -1.2 -9.6 -1.6" stroke="${K.fell[0]}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
    const ende = lieg ? [-14.6, -0.9] : [-9.7, -1.6];
    if (K.quaste) k += `<ellipse cx="${ende[0]}" cy="${ende[1]}" rx=".75" ry=".6" fill="#3a2614"/>`;
    if (K.spitze || art === "tiger") k += `<circle cx="${ende[0]}" cy="${ende[1]}" r="${sw / 2}" fill="#20150c"/>`;
    if (art === "tiger") k += lieg ? linie("M-11 -1.3 l0 1 M-12.4 -1.2 l0 1 M-13.6 -1.4 l0 1", "#1c120a", 1, 0.4) : linie("M-10.6 -7.4 l1 .3 M-11 -5.4 l1 .2 M-10.9 -3.4 l1 0", "#1c120a", 1, 0.4);
    if (art === "leopard") k += lieg ? linie("M-11 -1.3 l.2 .6 M-12.6 -1.1 l.2 .6", "#2a1a0c", 1, 0.3) : linie("M-10.6 -7 l.6 .2 M-11 -4.6 l.6 .2", "#2a1a0c", 1, 0.3);
    if (!lieg) for (const p of [versch(vn, -1.8), versch(hn, -1.4)]) k += `<path d="${glied(p)}" fill="${FELL}"/><path d="${glied(p)}" fill="#000" opacity=".3"/>`;
    for (const d of [...teile, leib]) k += `<path d="${d}" fill="${FELL}"/>`;
    k += lieg ? `<path d="M-7.6 -.9 Q0 -1.6 5.4 -1.2 L5.4 0 L-7.6 0 Z" fill="${BAUCH}" opacity=".75"/>`
      : `<path d="M-4.6 -6.4 Q0 -5.4 5 -6 Q6.6 -6.6 7.2 -7.6 Q6.8 -6 5 -5.3 C2.4 -4.8 .4 -5 -1.4 -5.6 C-3 -6.1 -4 -6.3 -4.6 -6.4 Z" fill="${BAUCH}" opacity=".85"/>`;
    const clipN = "tw_kcl" + (lieg ? "l" : "s");
    einmal(clipN, () => S.def(`<clipPath id="${S.id(clipN)}">${[...teile, leib].map((d) => `<path d="${d}"/>`).join("")}</clipPath>`));
    if (K.streifen) {
      einmal("tigst" + pose, () => {
        let st = "";
        const yb = lieg ? -8 : -11.6, yu = lieg ? -1 : -5.2;
        for (let i = 0; i < 14; i++) {
          const x = -9 + i * 1.15 + (i % 2) * 0.25, h = (yu - yb) * (0.5 + (i % 3) * 0.13);
          st += `<path d="M${f(x)} ${f(yb - 0.2)} Q${f(x + 0.7)} ${f(yb + h * 0.5)} ${f(x + 0.1)} ${f(yb + h)} Q${f(x - 0.1)} ${f(yb + h * 0.5)} ${f(x - 0.5)} ${f(yb - 0.2)} Z" fill="#1c120a"/>`;
        }
        if (!lieg) for (const [x, y0] of [[-6.6, -7], [3.6, -5.6]]) for (let j = 0; j < 3; j++) st += `<path d="M${f(x - 1.6)} ${f(y0 + j * 1.3)} q1.4 .5 2.8 0" stroke="#1c120a" stroke-width=".32" fill="none"/>`;
        else st += `<path d="M-8.6 -3.6 q2 -.6 3.4 .6 M-8.8 -2.4 q2 -.4 3.6 .6 M6 -1.8 l0 1.6 M7.4 -1.6 l0 1.4" stroke="#1c120a" stroke-width=".32" fill="none"/>`;
        S.def(`<g id="${S.id("tw_tst" + pose)}">${st}</g>`);
      });
      k += `<g clip-path="url(#${S.id(clipN)})"><use href="#${S.id("tw_tst" + pose)}"/></g>`;
    }
    if (K.rosette) {
      einmal("leoros", () => rosetten("tw_leoros", "#b58237"));
      k += `<g clip-path="url(#${S.id(clipN)})"><rect x="-12" y="-14" width="22" height="14" fill="url(#${S.id("tw_leoros")})"/></g>`;
    }
    for (const d of [...teile, leib]) k += `<path d="${d}" fill="${VOLH(12)}"/>`;
    if (!lieg) k += linie("M-5.2 -9.6 Q-3.8 -7.6 -5 -6.2", "#3a2412", 0.3) + linie("M3.6 -10.4 Q2.4 -8.4 3.2 -6.4", "#3a2412", 0.3) + linie("M2.2 -6.8 l.4 .8", "#3a2412", 0.25);
    else k += linie("M-6.6 -4.4 Q-5 -3.4 -5.4 -1.6", "#3a2412", 0.3);
    /* Kopf: Stirn, Nasenrücken, Nase, Schnurrhaarkissen, Kinn, Wange, Ohr */
    const [kx, ky] = lieg ? [6.2, -7.4] : [6.4, -9.6];
    let kopf = "";
    if (K.maehne) {
      const MA = LG("tw_maehne", [[0, "#8f5e2c"], [0.55, "#6b3f1d"], [1, "#4a2a12"]]);
      const md = "M2.4 -3.4 C.4 -5.6 -3.4 -5.2 -4.8 -2.4 C-5.8 0 -5.2 3.4 -4.2 5.8 C-2.4 6.8 .6 6.4 2.2 4.4 C3 3 3.4 1.8 3 1.2 Q1.8 1 1.2 0 Q1 -2 2.4 -3.4 Z";
      kopf += `<path d="${md}" fill="${MA}"/>`;
      for (let i = 0; i < 22; i++) { const a = -2.9 + i * 0.2, x0 = -1.2 + Math.cos(a) * 3.4, y0 = 0.6 + Math.sin(a) * 4.2; kopf += `<path d="M${f(x0)} ${f(y0)} q${f(Math.cos(a) * 0.8)} ${f(Math.sin(a) * 0.8 + 0.3)} ${f(Math.cos(a) * 1.3)} ${f(Math.sin(a) * 1.3 + 0.9)}" stroke="#3a210d" stroke-width=".2" fill="none" opacity=".6"/>`; }
      kopf += `<path d="M-1 -3.6 q-1.4 .6 -2.6 2.4 M0 4.8 q-1.6 .4 -3 -.4" stroke="#b07a3e" stroke-width=".25" fill="none" opacity=".6"/>`;
    }
    const HK = "M-1.2 -1.6 Q-.4 -3.2 1.4 -3.3 Q2.8 -3.2 3.4 -2.2 L4.5 -1.1 Q4.9 -.8 4.8 -.3 Q4.7 .2 4.3 .3 Q4.2 .9 3.6 1 Q3 1.5 2.4 1.3 Q1.4 1.2 .6 .8 Q-.6 .4 -1.2 -.4 Z";
    kopf += `<path d="M-.1 -2.8 Q-.5 -4.3 .6 -4.1 Q1.2 -3.7 1.1 -2.9 Z" fill="${K.fell[0]}" stroke="#2a1a0c" stroke-width=".14"/>`;
    if (art === "tiger") kopf += `<circle cx=".45" cy="-3.6" r=".22" fill="#fff"/>`;
    kopf += `<path d="${HK}" fill="${FELL}"/><path d="${HK}" fill="${VOLH(12)}"/>`;
    kopf += `<ellipse cx="3.9" cy=".15" rx=".8" ry=".55" fill="${BAUCH}"/><path d="M2 1.1 Q3 1.5 3.6 1 Q3 .7 2.2 .8 Z" fill="${BAUCH}"/>`;
    kopf += `<path d="M1.8 -2.2 Q2.6 -2.4 3.1 -1.9" stroke="${BAUCH}" stroke-width=".3" fill="none" opacity=".8"/>`;
    if (art === "tiger") kopf += linie("M1 -2.9 q.4 .8 .2 1.4 M2 -3.2 q.1 .6 -.1 1 M-.6 -1.2 q.8 .4 1.6 .2 M-.8 -.2 q.8 .3 1.6 .1 M.2 .6 q.6 -.1 1 .2", "#1c120a", 1, 0.22);
    if (art === "leopard") for (const [x, y] of [[.6, -2.6], [1.4, -2.9], [.2, -1.6], [1, -1.9], [-.4, -.6], [.4, .3]]) kopf += `<circle cx="${x}" cy="${y}" r=".16" fill="#2a1a0c"/>`;
    if (art === "puma") kopf += `<path d="M3.4 -.3 Q3.4 .6 3 .9" stroke="#3a2412" stroke-width=".18" fill="none" opacity=".6"/>`;
    kopf += `<path d="M4.42 -.98 L4.86 -.62 L4.76 -.22 L4.32 -.44 Z" fill="${art === "puma" || art === "loewin" ? "#b9806e" : "#3b2416"}"/>`;
    kopf += linie("M4.3 .3 Q3.8 .5 3.4 .4", "#2a1a0c", 0.8, 0.12);
    kopf += `<ellipse cx="2.6" cy="-1.7" rx=".36" ry=".24" fill="${K.auge}" stroke="#1c120a" stroke-width=".1"/><ellipse cx="2.68" cy="-1.7" rx=".1" ry=".17" fill="#111"/><circle cx="2.74" cy="-1.78" r=".05" fill="#fff"/>`;
    kopf += `<path d="M3.6 .2 l1.4 -.3 M3.6 .4 l1.5 .1 M3.6 .5 l1.3 .5" stroke="#f6f0e6" stroke-width=".05" opacity=".8"/>`;
    k += `<g transform="translate(${kx} ${ky}) scale(${K.kopf})">${kopf}</g>`;
    return gr(m, dir, `<g transform="scale(${K.sx} ${K.sy})">${k}</g>`);
  };

  /* ---------------- GORILLA (Silberrücken), auf den Knöcheln ---------------- */
  T.gorilla = (m, dir = 1) => {
    const leib = "M-6 -9.4 C-3 -11.2 1 -13.2 4 -13.6 Q5.6 -15 6.6 -14.4 Q8.2 -13.6 8.5 -12.4 Q8.9 -11.6 8.6 -11 Q9.1 -10.4 8.9 -9.8 Q8.6 -9.2 8 -9.3 Q7.4 -9 6.8 -9.4 C7.6 -7 7.9 -3 7.7 -.8 Q8.4 -.4 8.2 0 L6 0 Q5.8 -3.6 5.2 -6.6 C3 -5.6 -1 -5.2 -2.4 -5.6 C-2.6 -3.4 -2.6 -1.6 -2.2 -.6 Q-1.2 -.4 -1.2 0 L-4.6 0 Q-5.4 -1.6 -5.6 -3.4 C-6.4 -5 -6.8 -7.6 -6 -9.4 Z";
    let k = "";
    /* fernes Bein und Arm */
    k += `<path d="M5.2 -8 C5.6 -5 5.8 -2.6 5.6 -.6 Q6.2 -.3 6 0 L4.2 0 Q4.2 -3 3.8 -6.4 Z" fill="#141416"/>`;
    k += `<path d="M-4 -6 Q-4.6 -3 -4.2 -.6 Q-3.4 -.3 -3.6 0 L-6 0 Q-6.4 -2.4 -5.6 -5.6 Z" fill="#141416"/>`;
    k += `<path d="${leib}" fill="${LG("tw_gor", [[0, "#3a3a3d"], [1, "#1c1c1e"]])}"/>`;
    /* silberner Sattel auf dem Rücken */
    k += `<path d="M-5.6 -9.2 C-3 -11 1 -12.8 3.4 -13.2 Q2.6 -11 1.2 -10 C-1 -8.8 -3.6 -8.2 -5.8 -8.2 Z" fill="${LG("tw_gors", [[0, "#c9c8c4"], [1, "#8c8b88", 0.6]])}"/>`;
    k += `<path d="${leib}" fill="${VOL()}" stroke="#000" stroke-opacity=".4" stroke-width=".1"/>`;
    /* Haar-Strich */
    for (let i = 0; i < 18; i++) { const x = -5 + rnd() * 11, y = -12 + rnd() * 6; k += `<path d="M${f(x)} ${f(y)} l${f(-0.5)} ${f(0.4)}" stroke="#55555a" stroke-width=".12" opacity=".6"/>`; }
    /* Gesicht: schwarz glänzend, Brauenwulst, Nase */
    k += `<path d="M7.4 -12.6 Q8.4 -12.4 8.5 -11.8 Q8.8 -10.8 8.6 -10 Q8.2 -9.4 7.6 -9.6 Q7 -10.6 7.4 -12.6 Z" fill="#0d0d0e"/>`;
    k += `<path d="M7.2 -12.8 Q8 -12.9 8.6 -12.2" stroke="#3a3a3e" stroke-width=".3" fill="none"/>`;
    k += auge(7.9, -11.9, 0.16, "#3b2414");
    k += `<path d="M8.4 -11.2 q.4 .2 .3 .5" stroke="#555" stroke-width=".12" fill="none"/>`;
    k += `<path d="M5.2 -14.6 Q6.6 -15.2 7.6 -13.6" stroke="#4a3a34" stroke-width=".25" fill="none" opacity=".7"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- SCHIMPANSE (sitzend) ---------------- */
  T.schimpanse = (m, dir = 1) => {
    const FELL = LG("tw_schi", [[0, "#2d2722"], [1, "#171310"]]);
    let k = "";
    /* Rumpf sitzend, Beine angezogen */
    k += `<path d="M-2.4 -7.6 C-3.4 -5 -3.4 -2 -2.6 0 L2.6 0 C3 -1 2.8 -2 2 -2.4 C2.6 -4 2.4 -6.4 1.4 -7.8 C.4 -8.6 -1.6 -8.6 -2.4 -7.6 Z" fill="${FELL}"/>`;
    k += `<path d="M-1 -3.2 C1 -3.6 3 -3 3.6 -1.6 Q4 -.4 3.4 0 L-.6 0 Q-1.6 -1.6 -1 -3.2 Z" fill="${FELL}"/>`;
    k += `<path d="M3.2 -.9 Q4.2 -.8 4.2 0 L2.8 0 Z" fill="#5a4436"/>`;
    /* Arm auf dem Knie */
    k += `<path d="M.8 -7 Q2.6 -6.6 3.2 -4.2 Q3.4 -3 2.8 -2.6 Q2.4 -3.6 1.4 -4.8 Q.4 -5.6 .8 -7 Z" fill="#221d19"/>`;
    k += `<path d="M2.6 -2.9 q.8 0 .9 .6 q-.6 .4 -1.2 .1 Z" fill="#5a4436"/>`;
    k += `<path d="M-2.6 -7.8 C-3.4 -5 -3.4 -2 -2.6 0 L3.4 0 C4 -1 3.6 -4 1.4 -7.8 Z" fill="${VOL()}"/>`;
    /* Kopf mit großen Ohren und hellem Gesicht */
    k += `<path d="M-1.6 -8.4 Q-1.8 -10.4 -.2 -10.8 Q1.6 -11 2 -9.6 Q2.2 -8.4 1.4 -7.8 Q0 -7.4 -1.6 -8.4 Z" fill="#221c18"/>`;
    k += `<ellipse cx="-.9" cy="-9.4" rx=".7" ry=".85" fill="#9b7a64"/>`;
    k += `<path d="M.4 -10.2 Q1.8 -10.2 2.3 -9.2 Q2.6 -8.2 2 -7.7 Q1 -7.4 .4 -8 Q.1 -9.2 .4 -10.2 Z" fill="${LG("tw_schig", [[0, "#c9a189"], [1, "#a7826c"]])}"/>`;
    k += `<path d="M.6 -9.7 Q1.4 -10.1 2.1 -9.5" stroke="#5c4232" stroke-width=".16" fill="none"/>` + auge(1.4, -9.35, 0.13, "#3a2414");
    k += `<path d="M1.6 -8.2 q.4 .1 .6 -.1" stroke="#5c4232" stroke-width=".1" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- PAVIAN (Affe mit Schwanz, sitzend) ---------------- */
  T.affe = (m, dir = 1) => {
    const FELL = LG("tw_pav", [[0, "#8f8a73"], [1, "#6e6a57"]]);
    let k = "";
    k += `<path d="M-2.2 -1 C-4.6 -1.2 -5.8 -.4 -6.2 0" stroke="#7b7662" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M-1.8 -6.4 C-3.2 -4.6 -3 -1.6 -2.2 0 L1.8 0 C2.4 -1 2.2 -2.4 1.6 -2.8 C2.2 -4 2 -5.8 1 -6.8 C0 -7.4 -1.2 -7.2 -1.8 -6.4 Z" fill="${FELL}"/>`;
    k += `<path d="M-.6 -2.8 C1 -3.2 2.6 -2.6 3 -1.4 Q3.2 -.4 2.8 0 L-.6 0 Z" fill="${FELL}"/>`;
    k += `<path d="M.6 -6 Q2.2 -5.4 2.6 -3.2 L2.4 0 L1.6 0 L1.6 -3 Q1 -4.6 .6 -6 Z" fill="#7a755f"/>`;
    k += `<path d="M-1.8 -6.6 C-3.2 -4.6 -3 -1.6 -2.2 0 L3 0 C3.2 -1 2.6 -4 1 -6.8 Z" fill="${VOL()}"/>`;
    /* Mantel-Mähne */
    k += `<path d="M-2.2 -6.4 Q-1.6 -8.6 .4 -8.6 Q1.8 -8.4 1.8 -7 Q1 -6 -.8 -5.2 Z" fill="#a39d84"/>`;
    /* Hundeschnauze */
    k += `<path d="M.2 -8.2 Q.4 -8.8 1.2 -8.6 L3.1 -7.8 Q3.5 -7.4 3.2 -7.1 L1.6 -6.9 Q.6 -7 .2 -8.2 Z" fill="${LG("tw_pavg", [[0, "#a58c80"], [1, "#7e665c"]])}"/>`;
    k += `<path d="M3.1 -7.7 l.3 .3" stroke="#3a2a24" stroke-width=".16"/>` + auge(1.1, -8.2, 0.12, "#5a3a14");
    k += `<path d="M.7 -8.5 q.5 -.2 .9 .1" stroke="#4a3a2a" stroke-width=".12" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- BRAUNBÄR, Schulterhöhe 1,1 m ---------------- */
  T.baer = (m, dir = 1) => {
    const FELL = U("tw_bae", [[0, "#7a5233"], [1, "#4f3220"]], -12, 0);
    const leib = "M-9.4 -8 C-7.4 -9.8 -3 -10 0 -10.4 Q2.6 -11.8 4.6 -11.1 C6 -10.6 6.8 -9.8 7.6 -9.6 Q8.4 -10.4 9 -9.8 L10.8 -8.6 Q11.3 -8.1 10.8 -7.7 L9.4 -7.4 Q8.4 -7 7.4 -6.8 C6.8 -6 6 -5.4 5 -5.2 C2 -4.4 -3 -4.4 -6.6 -4.8 C-8.8 -5.2 -10.2 -6.6 -9.4 -8 Z";
    const vn = [[4.2, -8, 1.7, 1.5], [4.0, -4.6, 1.35, 1.25], [4.1, -1.4, 1.15, 1.15], [4.3, 0, 1.25, 1.9]];
    const hn = [[-6.4, -7.4, 2.4, 2.0], [-6.3, -5, 1.9, 1.4], [-6.7, -2, 1.35, 1.1], [-6.4, 0, 1.45, 2.0]];
    let k = "";
    for (const p of [versch(vn, -1.6), versch(hn, -1.4)]) k += fl(glied(p), FELL, 12, 0.3);
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${FELL}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(12)}"/>`;
    for (let i = 0; i < 26; i++) { const x = -8 + rnd() * 15, y = -10 + rnd() * 5; k += `<path d="M${f(x)} ${f(y)} q-.3 .5 -.7 .6" stroke="#3a2414" stroke-width=".14" fill="none" opacity=".5"/>`; }
    k += linie("M1.6 -11 Q3.6 -12.2 5.2 -10.8", "#a87a52", 0.6, 0.35) + linie("M-4.8 -8.4 Q-3.6 -6.6 -4.6 -5", "#2a180c", 0.35) + linie("M3 -9 Q2 -7 2.6 -5.4", "#2a180c", 0.35);
    k += `<circle cx="6.9" cy="-10.5" r=".7" fill="#5e3e26"/><circle cx="6.9" cy="-10.5" r=".35" fill="#3a2414"/>`;
    k += `<path d="M8.8 -9.4 L10.8 -8.6 Q11.3 -8.1 10.8 -7.7 L9.4 -7.4 Z" fill="#8a6446"/><ellipse cx="10.8" cy="-8.3" rx=".38" ry=".3" fill="#1c120a"/>`;
    k += auge(8.4, -9.4, 0.17);
    for (const x of [4.3, -6.4]) k += `<path d="M${x + 0.7} -.2 l.3 .2 M${x + 1.2} -.25 l.3 .2 M${x + 1.7} -.3 l.3 .2" stroke="#d9cbb4" stroke-width=".14"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- KROKODIL (Nilkrokodil), 4 m lang, liegend ---------------- */
  T.krokodil = (m, dir = 1) => {
    const HAUT = LG("tw_kro", [[0, "#5d6a3c"], [0.6, "#4a5530"], [1, "#a7a37a"]]);
    const leib = "M-22 -0.4 C-16 -0.8 -10 -1.6 -5 -2.8 C-2 -3.6 2 -3.6 6 -3.2 Q8 -3.2 9 -2.8 L13.6 -2.2 Q16.6 -2 17.4 -1.4 Q17.6 -.8 17 -.6 L13 -.4 L8.6 -.3 C4 0 -4 0 -8 0 L-22 0 Z";
    let k = schatten(0, 0, 18, 0.6, 0.25);
    k += `<path d="M5.6 -1 Q6.6 .2 7.8 0 L4.6 0 Z M-4.2 -1 Q-3.6 .2 -2.2 0 L-5.4 0 Z" fill="#3e4728"/>`;
    k += koerper(leib, HAUT);
    /* Rückenschilde (Schuppenreihen) und Schwanzkamm */
    for (let i = 0; i < 22; i++) { const x = -20 + i * 1.25, y = x < -5 ? -0.5 - (x + 22) * 0.13 : -3.2 + Math.abs(x) * 0.02; k += `<path d="M${f(x)} ${f(y)} l.4 -.5 l.4 .5" fill="#3c4526"/>`; }
    for (let i = 0; i < 26; i++) k += `<path d="M${f(-18 + i * 1)} ${f(-0.7 - Math.max(0, i - 4) * 0.08)} l0 .5" stroke="#3c4526" stroke-width=".12" opacity=".7"/>`;
    k += `<path d="M9.2 -2.6 Q13 -1.6 17 -1.2" stroke="#2f361e" stroke-width=".15" fill="none"/>`;
    for (let i = 0; i < 6; i++) k += `<path d="M${f(10.5 + i * 1.1)} ${f(-1.45 + i * 0.03)} l.2 .35 l.2 -.35" fill="#f2ecd6"/>`;
    k += `<path d="M7.8 -3.4 Q8.6 -4 9.4 -3.3 Z" fill="#4a5530"/>` + auge(8.6, -3.25, 0.22, "#7a7a1e");
    k += `<ellipse cx="17" cy="-1.7" rx=".3" ry=".18" fill="#2a2f1a"/>`;
    k += `<path d="M5.6 -1.6 L7.6 -.2 L7 0 M-3.8 -1.4 L-2.4 -.1" stroke="#3e4728" stroke-width=".4" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- FLAMINGO (Rosaflamingo), 1,3 m, auf einem Bein ---------------- */
  T.flamingo = (m, dir = 1, kopfUnten = false) => {
    const ROSA = LG("tw_fla", [[0, "#f6b5ae"], [1, "#e98c86"]]);
    let k = "";
    /* Standbein mit Fersengelenk (der „Knick“ ist die Ferse) */
    k += `<path d="M.2 -7.4 L.4 -4 L.3 0" stroke="#e07a78" stroke-width=".32" fill="none"/><circle cx=".4" cy="-4" r=".25" fill="#d86e6c"/>`;
    k += `<path d="M-.6 0 L1.2 0 L1.6 -.2" stroke="#d86e6c" stroke-width=".28" fill="none"/>`;
    /* angezogenes Bein */
    k += `<path d="M-.4 -7.4 L.6 -5.6 L-1.4 -6.4" stroke="#e07a78" stroke-width=".3" fill="none" stroke-linejoin="round"/>`;
    /* Körper */
    k += `<path d="M-3.4 -8.8 C-2.8 -10.4 1 -10.6 2.4 -9.6 C3 -9 2.6 -7.8 1.4 -7.4 C-.4 -7 -2.6 -7.4 -3.4 -8.8 Z" fill="${ROSA}"/>`;
    k += `<path d="M-3.4 -8.8 L-4.4 -8.4 L-3 -8 Z" fill="#1a1414"/><path d="M-2.6 -9.4 Q-1 -9 0 -8.2 Q-2 -8 -3.2 -8.6 Z" fill="#e0606a"/>`;
    k += `<path d="M-3.4 -8.8 C-2.8 -10.4 1 -10.6 2.4 -9.6 C3 -9 2.6 -7.8 1.4 -7.4 C-.4 -7 -2.6 -7.4 -3.4 -8.8 Z" fill="${VOL()}"/>`;
    /* S-Hals und Kopf mit geknicktem Schnabel */
    if (!kopfUnten) {
      k += `<path d="M1.8 -9.4 C3 -10.6 1 -11.6 1 -12.6 C1 -13.8 2.2 -14.2 2.8 -13.4" stroke="${ROSA}" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
      k += `<ellipse cx="2.7" cy="-13.5" rx=".55" ry=".45" fill="#f2a8a2"/>`;
      k += `<path d="M3 -13.8 L4 -13.4 Q4.3 -12.9 4 -12.4 L3.7 -12.6 Q3.6 -13 3 -13.1 Z" fill="#f3e9e2"/><path d="M4 -13.2 Q4.3 -12.8 4 -12.3 L3.7 -12.6 Z" fill="#1a1414"/>`;
      k += `<circle cx="2.8" cy="-13.6" r=".1" fill="#c9a400"/>`;
    } else {
      k += `<path d="M1.8 -9.4 C3.4 -9.6 3.8 -7 3.6 -4" stroke="${ROSA}" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
      k += `<ellipse cx="3.6" cy="-3.6" rx=".45" ry=".55" fill="#f2a8a2"/><path d="M3.3 -3.2 L3.4 -2.2 Q3.7 -2 4 -2.4 L3.9 -3.2 Z" fill="#1a1414"/>`;
    }
    return gr(m, dir, k);
  };

  /* ---------------- PELIKAN (Rosapelikan), steht ~1,1 m ---------------- */
  T.pelikan = (m, dir = 1) => {
    const W = LG("tw_pel", [[0, "#fdfbf8"], [1, "#e6dfd8"]]);
    let k = "";
    k += `<path d="M-.4 -3 L-.6 -.4 M1 -3 L1 -.4" stroke="#e8a253" stroke-width=".5"/><path d="M-1.6 0 L.4 0 L-.4 -.5 Z M0 0 L2 0 L1 -.5 Z" fill="#e8a253"/>`;
    k += `<path d="M-5.6 -6 C-4 -9 1 -9.6 2.8 -7.8 C3.6 -6.6 3 -3.6 1 -2.8 C-1.6 -2.2 -4.4 -3.4 -5.6 -6 Z" fill="${W}"/>`;
    k += `<path d="M-5.6 -6 C-4.2 -7.6 -1.6 -7.4 .4 -6.2 C-1.6 -5 -4 -5 -5.6 -6 Z" fill="#2a2420"/><path d="M-5.6 -6 L-6.6 -5.4 L-5.2 -5.2 Z" fill="#2a2420"/>`;
    k += `<path d="M-4.6 -6.6 Q-2 -7.4 .6 -6.4" stroke="#d9cfc6" stroke-width=".2" fill="none"/>`;
    k += `<path d="M-5.6 -6 C-4 -9 1 -9.6 2.8 -7.8 C3.6 -6.6 3 -3.6 1 -2.8 C-1.6 -2.2 -4.4 -3.4 -5.6 -6 Z" fill="${VOL()}"/>`;
    /* Hals und Kopf, langer Schnabel mit gelbem Kehlsack */
    k += `<path d="M2 -7.8 C3.4 -9 2.2 -10.4 2.4 -11.4 Q2.8 -12.4 3.8 -12" stroke="${W}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    k += `<ellipse cx="3.6" cy="-12" rx=".9" ry=".75" fill="#fbf6f0"/>`;
    k += `<path d="M4.2 -12.4 L9.4 -10.6 Q9.8 -10.3 9.3 -10.1 L4.4 -11.4 Z" fill="#c9b07a"/><path d="M9.2 -10.7 l.5 .3 l-.4 .3" fill="#e0582a"/>`;
    k += `<path d="M4.4 -11.4 L9.2 -10.1 Q7 -8.8 5 -9.6 Q4.2 -10.4 4.4 -11.4 Z" fill="${LG("tw_pels", [[0, "#f7d35a"], [1, "#e8a530"]])}"/>`;
    k += `<circle cx="3.9" cy="-12.2" r=".24" fill="#f2c9a8"/><circle cx="3.9" cy="-12.2" r=".1" fill="#2a1a0c"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- HUNDEARTIGE: Wolf (Schulter 0,8 m), Fuchs (0,4 m) ---------------- */
  T.hund = (art, m, dir = 1) => {
    const W = art === "wolf";
    const FELL = U("tw_h_" + art, W ? [[0, "#6a655d"], [0.45, "#8e8578"], [1, "#cfc6b6"]] : [[0, "#b0521a"], [0.6, "#cf6e28"], [1, "#e2a066"]], -10, 0);
    const leib = "M-7 -7.4 C-4 -8 0 -7.8 3 -8.4 Q4.6 -9.6 5.6 -9.8 Q6.4 -10.6 6.8 -9.8 L9 -8.6 L10 -8.1 Q10.2 -7.7 9.8 -7.6 L8.4 -7.5 Q7.4 -7.2 6.4 -7 C5.8 -5.8 5.4 -5 4.2 -4.6 C1 -4.2 -3 -4.2 -5.2 -4.6 C-7.4 -5 -8 -6.6 -7 -7.4 Z";
    const vn = [[3.4, -6.6, 1.1, 1.0], [3.1, -4.4, 0.8, 0.6], [3.3, -2.6, 0.42, 0.45], [3.4, -1, 0.36, 0.4], [3.6, -0.3, 0.4, 0.6], [3.7, 0, 0.45, 0.8]];
    const hn = [[-5.2, -6.8, 1.6, 1.4], [-5, -5, 1.5, 1.1], [-5.8, -3, 0.6, 0.45], [-6, -2.2, 0.45, 0.32], [-5.7, -0.8, 0.34, 0.36], [-5.5, 0, 0.45, 0.75]];
    let k = "";
    for (const p of [versch(vn, -1.2), versch(hn, -1)]) k += fl(glied(p), FELL, 10, 0.3) + (W ? "" : `<path d="${glied(p.slice(2))}" fill="#2a1a10"/>`);
    k += `<path d="M-6.8 -7 C-9 -6.6 -10.6 -4.6 -11.4 -2.4 Q-11 -1.6 -10.2 -2.4 C-9.2 -4 -8 -5.4 -6.6 -5.6 Z" fill="${FELL}"/><path d="M-6.8 -7 C-9 -6.6 -10.6 -4.6 -11.4 -2.4 Q-11 -1.6 -10.2 -2.4 C-9.2 -4 -8 -5.4 -6.6 -5.6 Z" fill="${VOLH(10)}"/>`;
    k += `<path d="M-11.4 -2.4 Q-11 -1.6 -10.2 -2.4 L-10.6 -3.2 Z" fill="${W ? "#2a2620" : "#fbf6ee"}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${FELL}"/>`;
    if (!W) for (const p of [vn, hn]) k += `<path d="${glied(p.slice(2))}" fill="#2a1a10"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(10)}"/>`;
    k += `<path d="M6.4 -7 Q7.6 -7.2 8.4 -7.5 L9.8 -7.6 Q8 -6.6 6.6 -6.4 Z" fill="${W ? "#e6ddd0" : "#fbf6ee"}"/>`;
    if (!W) k += `<path d="M5 -6.6 Q6 -6.2 6.4 -7 Q6 -5.6 5.2 -5 Z" fill="#fbf6ee"/>`;
    k += `<path d="M5.6 -9.8 L5.8 -11.6 L6.8 -10 Z" fill="${W ? "#6a6359" : "#a4501a"}" stroke="#2a1a10" stroke-width=".12"/>`;
    k += `<ellipse cx="10" cy="-8" rx=".22" ry=".2" fill="#151010"/>` + auge(7.6, -9, 0.17, W ? "#9a7a1e" : "#7a4a10");
    k += linie("M-4 -7.2 Q-3 -5.8 -3.8 -4.8", "#2a1a10", 0.3) + linie("M2.6 -7.6 Q2 -6.2 2.6 -5", "#2a1a10", 0.3);
    if (W) for (let i = 0; i < 12; i++) { const x = -6 + rnd() * 10, y = -8 + rnd() * 3; k += `<path d="M${f(x)} ${f(y)} l-.4 .5" stroke="#4a463f" stroke-width=".12" opacity=".6"/>`; }
    return gr(m * (W ? 1 : 0.52), dir, k);
  };

  /* ---------------- STEINADLER, sitzend, ~0,85 m ---------------- */
  T.adler = (m, dir = 1) => {
    const F = LG("tw_adl", [[0, "#7a5230"], [1, "#3e2814"]]);
    const leib = "M.6 -8.6 Q1.6 -9.4 2.4 -8.8 Q2.8 -8.4 2.8 -7.9 L3.5 -8 Q3.9 -7.7 3.6 -7.2 L3.3 -7.4 L2.8 -7.4 Q2.9 -6.8 2.7 -6.4 C3 -5.4 2.8 -3.8 2 -2.6 C1.6 -1.8 1.4 -1.2 1.4 -.6 L.4 -.6 C0 -1.2 -1.2 -1 -1.8 -.2 L-2.8 1.6 L-3.4 1.2 L-2.2 -1.6 C-1.6 -4.6 -.6 -7.4 .6 -8.6 Z";
    let k = `<path d="${leib}" fill="${F}"/>`;
    k += `<path d="M.8 -7.2 C2 -6.6 2 -4 1 -2.4 L-2.6 1.1 Q-2.2 -2 -.8 -5.6 Z" fill="#33210f"/>`;
    k += linie("M.6 -5.6 L-1.6 .2 M1.2 -4.4 L-1.2 .6 M.2 -6.4 L-1.8 -.8", "#6e4a28", 0.8, 0.12);
    k += `<path d="M.5 -8.5 Q1.6 -9.3 2.4 -8.8 Q2.7 -8.2 2.4 -7.7 Q1.4 -7.4 .6 -8 Z" fill="#c38d3c"/>`;
    k += `<path d="M2.8 -7.9 L3.5 -8 Q3.9 -7.7 3.6 -7.2 L3.3 -7.4 L2.8 -7.4 Z" fill="#3a3a3a"/><path d="M2.6 -8 L3 -8 L3 -7.4 L2.6 -7.4 Z" fill="#f2c430"/>`;
    k += `<circle cx="2.2" cy="-8.1" r=".15" fill="#5a3a10"/><path d="M1.9 -8.35 q.3 -.15 .6 0" stroke="#2a1a0c" stroke-width=".1" fill="none"/>`;
    k += `<path d="M.5 -.6 L.4 0 M1.2 -.6 L1.3 0" stroke="#e8c540" stroke-width=".32"/><path d="M0 0 L1.8 0" stroke="#1a1a1a" stroke-width=".15"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- MEERESTIERE: Hai, Delfin, Buckelwal, Fisch, Qualle, Möwe ---------------- */
  /* Meerestiere liegen waagrecht; Ursprung = Körpermitte */
  T.hai = (m, dir = 1) => {
    const O = LG("tw_hai", [[0, "#6f7f8c"], [0.5, "#8a98a3"], [0.56, "#eef0ee"], [1, "#d9dcd8"]]);
    const d = "M-24 -1.6 C-18 -3 -8 -6.4 4 -6 Q14 -5.4 21 -2.2 Q24.6 -.8 24.6 0 Q24.4 1.6 21 2.4 Q14 4.4 2 4 C-8 3.6 -18 1.6 -24 .6 Z";
    let k = `<path d="M-21 -1.8 L-27.6 -9.6 L-25 -1 L-28.4 6.4 L-21 .4 Z" fill="#76858f"/>`;
    k += `<path d="M-2 -5.8 L1.6 -14.6 L7 -5.8 Z" fill="#76858f"/>`;
    k += koerper(d, O);
    k += `<path d="M5 2.6 L-2 9 L.6 9.2 L9 3.4 Z" fill="#6b7b86"/>`;
    for (let i = 0; i < 5; i++) k += `<path d="M${f(12 - i * 1.2)} -1.6 q-.6 1.8 0 3.6" stroke="#55626b" stroke-width=".25" fill="none"/>`;
    k += auge(18.4, -1.4, 0.45, "#0b0d10") + `<path d="M17.6 2.2 Q20 3 22.6 1.8" stroke="#3d464d" stroke-width=".25" fill="none"/>`;
    return gr(m, dir, k);
  };
  T.delfin = (m, dir = 1, steigen = 0) => {
    const O = LG("tw_del", [[0, "#5f6f7c"], [0.5, "#8996a1"], [0.62, "#dfe4e6"], [1, "#eef0f0"]]);
    const d = "M-11 -.6 C-7 -2 -2 -4.2 4 -3.8 Q7.6 -3.2 8.6 -1.6 L11.6 -1 Q12.2 -.6 11.6 -.2 L8.6 .4 Q6 1.8 2 2 C-4 2 -8 .6 -11 .2 Z";
    let k = `<path d="M-10.6 -.4 L-13.6 -3.6 Q-13 -1 -12.4 0 Q-13 1.2 -13.4 3 L-10.6 .4 Z" fill="#65737f"/>`;
    k += `<path d="M-1 -3.8 Q0 -7.2 -2.4 -8 Q2.4 -6.4 2.8 -3.8 Z" fill="#65737f"/>`;
    k += koerper(d, O);
    k += `<path d="M2.6 1.4 Q2 3.6 .2 4.2 Q2.6 4 4.2 1.6 Z" fill="#6b7985"/>`;
    k += `<path d="M8.6 -1.2 Q10 -.4 11.4 -.6" stroke="#3d464d" stroke-width=".15" fill="none"/>` + auge(7.2, -1.1, 0.26, "#0b0d10");
    k += `<path d="M6.4 -3.4 Q7.6 -3.4 8.4 -2" stroke="#fff" stroke-width=".25" opacity=".45" fill="none"/>`;
    return gr(m, dir, `<g transform="rotate(${-steigen})">${k}</g>`);
  };
  T.wal = (m, dir = 1) => {
    const O = LG("tw_wal", [[0, "#2f3a46"], [0.55, "#3d4a57"], [0.7, "#6d7a86"], [1, "#a9b2b8"]]);
    const d = "M-60 -1 C-44 -6 -20 -14 10 -13 Q40 -12 58 -4 Q64 -1 63 2 Q60 6 48 7 C30 9 0 10 -26 6 C-40 4 -52 1.6 -60 1 Z";
    let k = `<path d="M-57 -.6 L-70 -9 Q-74 -10 -76 -8 L-72 -2 L-76 3 Q-74 6 -70 5 L-57 1 Z" fill="#2e3944"/>`;
    k += `<path d="M-74 -8.6 l2 1.4 l-1 1 Z M-75 4.8 l2 -1 l-1 -1.2 Z" fill="#c9cfd2" opacity=".7"/>`;
    k += `<path d="M-22 -9 Q-20 -12.6 -16 -12.4 Q-18 -10.4 -16 -9.4 Z" fill="#2e3944"/>`;
    k += koerper(d, O);
    /* Kehlfurchen */
    for (let i = 0; i < 7; i++) k += `<path d="M${f(58 - i * 0.6)} ${f(3 + i * 0.7)} Q30 ${f(7 + i * 0.45)} 6 ${f(8.4 + i * 0.1)}" stroke="#1f2730" stroke-width=".35" fill="none" opacity=".45"/>`;
    /* lange Brustflosse (Buckelwal), weiß gerandet, mit Höckern */
    k += `<path d="M30 4 C22 12 10 22 -2 26 Q-4 26 -3 24 C6 18 16 10 22 3 Z" fill="${LG("tw_walf", [[0, "#3a4652"], [1, "#d7dcde"]], 0, 0, 1, 1)}"/>`;
    for (let i = 0; i < 5; i++) k += `<circle cx="${f(24 - i * 5.2)}" cy="${f(6.4 + i * 3.8)}" r=".7" fill="#e8ecee" opacity=".7"/>`;
    /* Knubbel am Kopf */
    for (let i = 0; i < 8; i++) k += `<circle cx="${f(44 + i * 2.2)}" cy="${f(-9.6 + i * 0.95)}" r=".55" fill="#232c35"/>`;
    k += auge(46, 1.6, 0.6, "#0b0d10") + `<path d="M62 1.6 Q54 2.6 42 2.4" stroke="#1a2128" stroke-width=".4" fill="none"/>`;
    for (let i = 0; i < 6; i++) k += `<ellipse cx="${f(-10 + i * 9 + rnd() * 4)}" cy="${f(-6 + rnd() * 6)}" rx="${f(0.8 + rnd() * 1.2)}" ry=".4" fill="#c9cfd2" opacity=".25"/>`;
    return gr(m, dir, k);
  };
  T.fisch = (m, dir = 1, farbe = "hering") => {
    const O = farbe === "makrele"
      ? LG("tw_mak", [[0, "#1f4f63"], [0.45, "#3d8aa0"], [0.55, "#d8e6ea"], [1, "#f2f6f6"]])
      : LG("tw_her", [[0, "#3c5f78"], [0.4, "#7fa3b8"], [0.5, "#dbe6ec"], [1, "#f4f7f8"]]);
    const d = "M-1.5 -.15 C-1 -.5 .2 -.75 1.1 -.55 Q1.7 -.35 1.85 0 Q1.7 .35 1.1 .45 C.2 .6 -1 .4 -1.5 .15 Z";
    let k = `<path d="M-1.4 0 L-2.1 -.55 L-1.95 0 L-2.1 .55 Z" fill="#5b7a8e"/>`;
    k += `<path d="${d}" fill="${O}"/>`;
    if (farbe === "makrele") for (let i = 0; i < 5; i++) k += `<path d="M${f(-1 + i * 0.45)} -.48 q.15 .2 0 .36" stroke="#14303c" stroke-width=".08" fill="none"/>`;
    k += `<circle cx="1.25" cy="-.12" r=".12" fill="#0e1418"/><circle cx="1.28" cy="-.15" r=".04" fill="#fff"/>`;
    k += `<path d="M.8 -.35 Q.95 0 .8 .3" stroke="#56707e" stroke-width=".05" fill="none"/>`;
    return gr(m, dir, k);
  };
  T.qualle = (m, art = "ohren") => {
    const S1 = RG("tw_qu", [[0, "#f6e9ff", 0.85], [0.7, "#d9c6ef", 0.55], [1, "#bfa9e0", 0.35]], 0.5, 0.3, 0.7);
    let k = `<path d="M-3 0 Q-3 -3 0 -3.2 Q3 -3 3 0 Q2 -.4 1.5 .1 Q.8 -.3 0 .1 Q-.8 -.3 -1.5 .1 Q-2 -.4 -3 0 Z" fill="${S1}" stroke="#e8dcf5" stroke-width=".08"/>`;
    /* vier Ringe (Gonaden) der Ohrenqualle */
    for (const [x, y] of [[-1, -1.6], [1, -1.6], [-.4, -.9], [.6, -.9]]) k += `<circle cx="${x}" cy="${y}" r=".42" fill="none" stroke="#a46bbf" stroke-width=".18" opacity=".8"/>`;
    for (let i = 0; i < 4; i++) k += `<path d="M${f(-0.9 + i * 0.6)} 0 q${f(-0.4 + (i % 2) * 0.8)} 1.6 0 3.2 q.4 1 -.1 2" stroke="#e7d6f3" stroke-width=".22" fill="none" opacity=".75"/>`;
    for (let i = 0; i < 9; i++) k += `<path d="M${f(-2.8 + i * 0.7)} ${f(-0.1)} q${f(0.3)} 2.4 ${f(-0.2)} ${f(4 + (i % 3))}" stroke="#efe4f8" stroke-width=".06" fill="none" opacity=".6"/>`;
    return gr(m, 1, k);
  };
  T.moewe = (m, dir = 1, fluegel = 0) => {
    let k = "";
    /* Silbermöwe im Flug: graue Flügel, schwarze Spitzen mit weißen Flecken */
    const fl = (s) => `<path d="M-.6 -.2 Q${-2} ${f(-3 - fluegel)} ${-5.6} ${f(-3.6 - fluegel)} L${-6.6} ${f(-3.4 - fluegel)} Q-3 ${f(-1.2 - fluegel * 0.4)} -.2 .4 Z" fill="${s ? "#a8b3bb" : "#b9c3ca"}"/>` +
      `<path d="M-5.6 ${f(-3.6 - fluegel)} L-6.6 ${f(-3.4 - fluegel)} L-5.2 ${f(-2.8 - fluegel)} Z" fill="#1d1d1f"/>`;
    k += `<g transform="translate(1.4 0) scale(.85)">${fl(1)}</g>`;
    k += `<path d="M-3 .2 Q-1 -.8 2.2 -.4 Q3.2 -.2 3.4 .3 Q2.4 .9 .6 .9 Q-1.6 .9 -3 .2 Z" fill="#f8f9f9"/>`;
    k += `<path d="M-3 .2 L-3.9 0 L-3.8 .6 Z" fill="#f0f2f2"/>`;
    k += `<path d="M3.3 .1 L4.3 .3 Q4.4 .5 4.1 .6 L3.3 .6 Z" fill="#f2c62e"/><circle cx="4" cy=".5" r=".09" fill="#d33"/>`;
    k += `<circle cx="2.8" cy="-.05" r=".12" fill="#222"/>`;
    k += `<g transform="translate(.6 .3) scale(1 1)">${fl(0)}</g>`;
    return gr(m, dir, k);
  };
  return T;
}
module.exports = { tierBaukasten };
if (require.main !== module) return;

/* =====================================================================
   DIE SZENE „DER ZOO“ folgt hier.
   ===================================================================== */
