/* =====================================================================
   TIER-BIBLIOTHEK — HOFVÖGEL (FASSUNG 854, Maßstab 2)
   Hahn, Henne, Küken, Ente (Stockenten-Erpel), Gans (weiße Höckergans), Truthahn (Bronzepute, balzend)
   Zentimeter, Blick nach rechts, Boden y = 0, Licht von links oben (siehe ANLEITUNG.md).
   Jede Feder als Feder: Konturfedern als Feld (Schattenbogen auf der Feder darunter, helle Kante, Schaft,
   Tonvarianten), lange Federn (Behang, Sicheln, Schwingen, Steuerfedern) einzeln mit Schaft, Fahne und Glanzkante.
   Mikrodetails (Strahlen, Kanten, Poren-Relief, Netzschuppen) nur bei T.fein – die Szene bleibt klein.
   ===================================================================== */
"use strict";
let Q = 10;                                   // Rundung (10 = 1 mm); das Küken rechnet feiner
/* knappe Zahlen für Pfade: „0.5" → „.5", Trenner nur wo nötig */
const N = (n) => { let s = String(Math.round(n * Q) / Q); if (s.startsWith("0.")) s = s.slice(1); else if (s.startsWith("-0.")) s = "-" + s.slice(2); return s === "-0" ? "0" : s; };
function J(...ns) {
  let o = "", punkt = false;
  for (const n of ns) {
    const s = N(n);
    if (o && !(s[0] === "-" || (s[0] === "." && punkt))) o += " ";
    o += s; punkt = s.includes(".");
  }
  return o;
}
const P = (x, y) => J(x, y);
const rad = (g) => g * Math.PI / 180;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const zug = (d, farbe, w, op = 1, extra = "") => d ? `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round"${extra}/>` : "";
const fl = (d, farbe, op = 1, extra = "") => d ? `<path d="${d}" fill="${farbe}"${op < 1 ? ` opacity="${op}"` : ""}${extra}/>` : "";
/* glatte Kurve (Catmull-Rom) mit knappen Zahlen; [x, y, 1] = harte Ecke */
function G(pts, zu = true) {
  const n = pts.length, A = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = "M" + J(pts[0][0], pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = A(i - 1), p1 = A(i), p2 = A(i + 1), p3 = A(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += "C" + J(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
  }
  return d + (zu ? "Z" : "");
}
/* Punkt auf einer Polylinie (t 0..1) */
function auf(pts, t) {
  const n = pts.length - 1, f = Math.max(0, Math.min(0.9999, t)) * n, i = Math.floor(f);
  return lerp(pts[i], pts[i + 1], f - i);
}

/* Band entlang einer Mittellinie: Breite w0 → w1; rund = runde Federspitze, sonst spitz */
function band(pts, w0, w1, rund = false) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const t = i / (n - 1), w = (w0 + (w1 - w0) * t) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const e = pts[n - 1], v = pts[n - 2], l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1;
  if (rund) return [...L, [e[0] + (e[0] - v[0]) / l * w1 * 0.55, e[1] + (e[1] - v[1]) / l * w1 * 0.55], ...R.reverse()];
  return [...L.slice(0, -1), [e[0], e[1], 1], ...R.slice(0, -1).reverse()];
}

/* Lange Feder (Sichel, Schwinge, Steuerfeder): Fläche, Schaft und Glanzkante je als EINE Kurve, Fahnenstrahlen
   (nur fein). Der Rand kommt von der umgebenden Gruppe (gruppe()). o: { rund, schaft, strahl, strahlN, kante, kanteOp, kw, aussen } */
function mitte3(pts, t0, t1, seite, w0, w1) {   // Punkt-Tripel entlang der Feder, seitlich versetzt (Anteil der Halbbreite)
  const p = (t) => {
    const f = t * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), q = lerp(pts[i], pts[i + 1], f - i);
    let dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1]; const l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * t) / 2 * seite;
    return [q[0] - dy / l * w, q[1] + dx / l * w];
  };
  const a = p(t0), m = p((t0 + t1) / 2), e = p(t1);
  return "M" + J(a[0], a[1]) + "Q" + J(2 * m[0] - (a[0] + e[0]) / 2, 2 * m[1] - (a[1] + e[1]) / 2, e[0], e[1]);
}
/* Sammler: Federflächen in eine Gruppe mit gemeinsamem Rand, Striche gleicher Art in EINEN Pfad (klein!) */
function sammler() {
  const m = new Map(); let f = "";
  return {
    f: (x) => { f += x; },
    z: (d, farbe, w, op) => { if (!d) return; const k = farbe + "|" + w + "|" + op; m.set(k, (m.get(k) || "") + d); },
    aus: (rand, rw = 0.1, ra = 0.45) => (rand ? `<g stroke="${rand}" stroke-width="${rw}" stroke-opacity="${ra}">${f}</g>` : f) +
      [...m].map(([k, d]) => { const [c, w, op] = k.split("|"); return zug(d, c, +w, +op); }).join(""),
  };
}
function langfeder(T, pts, w0, w1, fill, o = {}, K = null) {
  const k = K || sammler();
  k.f(`<path d="${G(band(pts, w0, w1, o.rund))}" fill="${fill}"/>`);
  if (T.fein) {
    const zwei = pts.length > 3, sv = (o.aussen || 0) * 0.3;
    if (o.schaft) k.z(zwei ? mitte3(pts, 0, 0.5, sv, w0, w1) + mitte3(pts, 0.5, 0.95, sv, w0, w1) : mitte3(pts, 0, 0.95, sv, w0, w1), o.schaft, o.sw || 0.08, o.schaftOp || 0.6);
    if (o.kante) k.z(zwei ? mitte3(pts, 0.05, 0.5, 0.72, w0, w1) + mitte3(pts, 0.5, 0.93, 0.72, w0, w1) : mitte3(pts, 0.05, 0.93, 0.72, w0, w1), o.kante, o.kw || 0.14, o.kanteOp || 0.5);
    if (o.strahl) {
      let st = "";
      const m = o.strahlN || 10, n = pts.length;
      for (let j = 1; j < m; j++) {
        const t = j / m, f = t * (n - 1), i = Math.min(n - 2, Math.floor(f)), p = lerp(pts[i], pts[i + 1], f - i);
        let dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
        const w = (w0 + (w1 - w0) * t) / 2 * 0.9;
        for (const sg of [-1, 1]) st += "M" + J(p[0], p[1]) + "l" + J(-dy * sg * w + dx * w * 0.6, dx * sg * w + dy * w * 0.6);
      }
      k.z(st, o.strahl, 0.05, o.strahlOp || 0.35);
    }
  }
  return K ? "" : k.aus(o.rand, o.rw, o.ra);
}
/* Gruppe mit gemeinsamem feinem Rand (spart je Feder die Attribute) */
const gruppe = (inh, rand, rw = 0.1, ra = 0.45) => `<g stroke="${rand}" stroke-width="${rw}" stroke-opacity="${ra}">${inh}</g>`;
/* Lanzettfeder (Hals- und Sattelbehang): Ansatz b, Spitze t, Breite w, Biegung bg; zwei Bögen je Seite */
function lanze(b, t, w, bg = 0, rund = false) {
  const dx = t[0] - b[0], dy = t[1] - b[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, ux = dx / l, uy = dy / l;
  const m = [b[0] + dx * 0.5 + nx * bg, b[1] + dy * 0.5 + ny * bg], h = w * 0.5;
  const s1 = [m[0] + nx * h * 1.15, m[1] + ny * h * 1.15], s2 = [m[0] - nx * h * 1.15, m[1] - ny * h * 1.15];
  const sp = rund ? [t[0] - ux * w * 0.35, t[1] - uy * w * 0.35] : t;
  let d = "M" + J(b[0] + nx * h * 0.6, b[1] + ny * h * 0.6) + "Q" + J(s1[0] - ux * l * 0.15, s1[1] - uy * l * 0.15, s1[0], s1[1]);
  if (rund) d += "Q" + J(sp[0] + nx * h * 1.2, sp[1] + ny * h * 1.2, t[0], t[1]) + "Q" + J(sp[0] - nx * h * 1.2, sp[1] - ny * h * 1.2, s2[0], s2[1]);
  else d += "Q" + J(s1[0] + ux * l * 0.3, s1[1] + uy * l * 0.3, t[0], t[1]) + "Q" + J(s2[0] + ux * l * 0.3, s2[1] + uy * l * 0.3, s2[0], s2[1]);
  return d + "Q" + J(s2[0] - ux * l * 0.15, s2[1] - uy * l * 0.15, b[0] - nx * h * 0.6, b[1] - ny * h * 0.6) + "Z";
}

/* Federspitze: Mitte c, Richtung a (Grad), Länge L, Breite W */
function spitze(c, a, L, W) {
  const u = [Math.cos(rad(a)), Math.sin(rad(a))], n = [-u[1], u[0]], R = W / 2;
  return { u, n, R, T0: [c[0] + u[0] * (L / 2 - R), c[1] + u[1] * (L / 2 - R)] };
}
/* Bogen um die Federspitze (relativ geschrieben, knapp); k = Radius-Faktor, Versatz ox/oy */
function bogen(F, k = 1, ox = 0, oy = 0, spitz = false) {
  const R = F.R * k, u = F.u, n = F.n, x = F.T0[0] + ox + n[0] * R, y = F.T0[1] + oy + n[1] * R;
  if (spitz) return "M" + J(x, y) + "q" + J(u[0] * R * 1.4 - n[0] * R * 0.3, u[1] * R * 1.4 - n[1] * R * 0.3, u[0] * R * 2 - n[0] * R, u[1] * R * 2 - n[1] * R) +
    "q" + J(-u[0] * R * 0.6 - n[0] * R * 0.7, -u[1] * R * 0.6 - n[1] * R * 0.7, -u[0] * R * 2 - n[0] * R, -u[1] * R * 2 - n[1] * R);
  return "M" + J(x, y) + "c" + J(u[0] * R * 1.33, u[1] * R * 1.33, u[0] * R * 1.33 - n[0] * 2 * R, u[1] * R * 1.33 - n[1] * 2 * R, -n[0] * 2 * R, -n[1] * 2 * R);
}
const zunge = (F, spitz, lang = 1.6) => bogen(F, 1, 0, 0, spitz) + "l" + J(-F.u[0] * F.R * lang, -F.u[1] * F.R * lang) + "l" + J(F.n[0] * F.R * 2, F.n[1] * F.R * 2) + "Z";

/* Konturfedern als Feld in einer Fläche (poly, ungeglättet). Jede Feder ist eine eigene Federzunge (runde oder spitze
   Spitze), in Dachziegel-Reihenfolge gezeichnet (stromab zuerst, die kopfnähere Feder liegt oben), mit Tonvarianten,
   dunkler Kante (Schatten auf der Feder darunter), heller Saum-Kante und Schaft (nur fein).
   o: { abst, L, W, winkel(x,y), gr(x,y), streu, spitz, toene: [farbe…], rand, rw, ra, saum, sw, sop, schaft, szene } */
function federfeld(T, poly, o) {
  if (!T.fein && !o.szene) return "";
  const a = o.abst * (T.fein ? 1 : 1.6), fs = [];
  const [x0, y0, x1, y1] = T.box(poly);
  let j = 0;
  for (let y = y0 - a * 0.3; y <= y1 + a * 0.3; y += a * 0.72, j++)
    for (let x = x0 + (j % 2) * a * 0.5; x <= x1 + a * 0.3; x += a) {
      const px = x + (T.rnd() - 0.5) * a * 0.4, py = y + (T.rnd() - 0.5) * a * 0.35;
      if (!T.inPoly(px, py, poly)) continue;
      const g = (o.gr ? o.gr(px, py) : 1) * (T.fein ? 1 : 1.6);
      const F = spitze([px, py], o.winkel(px, py) + (T.rnd() - 0.5) * (o.streu || 10), o.L * g * (0.88 + T.rnd() * 0.24), o.W * g * (0.85 + T.rnd() * 0.3));
      F.key = px * F.u[0] + py * F.u[1];
      fs.push(F);
    }
  fs.sort((p, q) => q.key - p.key);
  const toene = o.toene;
  let s = "", sa = "", sf = "";
  fs.forEach((F) => {
    s += `<path d="${zunge(F, o.spitz, o.lang || 1.7)}" fill="${toene[Math.floor(T.rnd() * toene.length)]}"/>`;
    if (!T.fein) return;
    if (o.saum) sa += bogen(F, 0.9, 0, 0, o.spitz);
    if (o.schaft) sf += "M" + J(F.T0[0] - F.u[0] * F.R * 0.9, F.T0[1] - F.u[1] * F.R * 0.9) + "l" + J(F.u[0] * F.R * (o.spitz ? 2.4 : 1.55), F.u[1] * F.R * (o.spitz ? 2.4 : 1.55));
  });
  return `<g stroke="${o.rand}" stroke-width="${o.rw || 0.12}" stroke-opacity="${o.ra || 0.5}">${s}</g>` + zug(sa, o.saum, o.sw || 0.15, o.sop || 0.4) + zug(sf, o.schaft, o.sfw || 0.06, o.sfop || 0.35);
}

/* Körperteil: Füllung, geklippte Innenzeichnung, Volumen, feiner Rand (Pfad knapp geschrieben) */
const teil = (T, pts, fill, innen, o = {}) => {
  const d = typeof pts === "string" ? pts : G(pts);
  if (!T.fein && !innen) return `<path d="${d}" fill="${fill}"/>` + (o.vol !== false ? `<path d="${d}" fill="${T.VOL()}"/>` : "");
  return T.koerper(d, fill, Object.assign({ innen, rw: 0.12, randA: 0.25 }, o));
};
const relief = (T, n, inh, o) => (T.fein ? `<g filter="${T.relief(n, o)}">${inh}</g>` : inh);
/* feine Gefiederstruktur (Rauschen, in Federrichtung gestreckt) – nur fein */
const struktur = (T, pts, n, winkel, farbe, op, fx = 0.9, fy = 0.25) => (T.fein ? T.textur(typeof pts === "string" ? pts : G(pts), T.rauschen(n, { fx, fy, farbe, staerke: 2.2, okt: 2 }), winkel, op, T.box(pts.map ? pts : [[-50, -100], [50, 0]])) : "");
/* Einfachkamm: Blatt mit runden Zacken (spitzen: [[x, y], …] von vorn nach hinten), Tal-Tiefe tal, Basis vorn/hinten */
function kammPfad(vorn, spitzen, tal, hinten) {
  const p = [...vorn];
  spitzen.forEach(([x, y, w = 0.5], i, A) => {
    p.push([x + w, y + w * 1.7], [x + w * 0.25, y], [x - w * 0.25, y], [x - w, y + w * 1.7]);
    if (i < A.length - 1) p.push([(x + A[i + 1][0]) / 2, Math.max(y, A[i + 1][1]) + tal]);
  });
  return G([...p, ...hinten]);
}

/* Vogelbein (Huhn, Pute): Lauf mit Gürtelschuppen vorn, Netzschuppen hinten, Fersengelenk, vier Zehen mit Gliedern,
   Ringschuppen und Krallen, Sporn. o: { H: [x, y] Ferse, A: [x, y] Fußwurzel, w0, w1, hell, mittel, dunkel, kralle,
   sporn (Länge), k (Fußgröße), fern, zehen: [hinten, innen, außen, mitte] Längen } */
function lauf(T, o) {
  const { H, A, w0, w1, k = 1, fern } = o;
  const dx = A[0] - H[0], dy = A[1] - H[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l; // n zeigt nach vorn
  const Z = o.zehen || [2.6, 4.4, 4.8, 6.4];
  const g = !T.fein ? (fern ? o.dunkel : o.mittel) : T.lg(fern ? "laufF" : "lauf", fern ? [[0, o.mittel], [1, o.dunkel]] : [[0, o.mittel], [0.28, o.hell], [0.62, o.mittel], [1, o.dunkel]], 0, 0, 1, 0);
  const B = [A[0] + 0.2 * k, A[1] + 0.3 * k];
  const zeh = (ende, w, glieder, farbe, hinten) => {
    if (!T.fein) { glieder = 1; if (farbe.startsWith("url")) farbe = o.mittel; }
    const ex = ende[0] - B[0], ey = ende[1] - B[1], el = Math.hypot(ex, ey), ux = ex / el, uy = ey / el, mx = -uy, my = ux;
    const oben = [], unten = [];
    for (let i = 0; i <= glieder * 2; i++) {
      const t = i / (glieder * 2), c = [B[0] + ex * t, B[1] + ey * t], ww = w * (1 - t * 0.38) * (i % 2 === 0 && i > 0 ? 0.56 : 0.5);
      oben.push([c[0] + mx * ww, c[1] + my * ww]);
      unten.push([c[0] - mx * w * (1 - t * 0.38) * (i % 2 ? 0.55 : 0.48), c[1] - my * w * (1 - t * 0.38) * (i % 2 ? 0.55 : 0.48)]);
    }
    const tip = [ende[0] + ux * w * 0.3, ende[1] + uy * w * 0.3];
    let z = `<path d="${G([...oben, tip, ...unten.reverse()])}" fill="${farbe}"/>`;
    /* Kralle: gebogen nach unten, Horn mit Glanzlinie */
    const kl = w * (hinten ? 1.1 : 1.25), kx = ende[0] + ux * w * 0.05, ky = ende[1] + uy * w * 0.05;
    const kp = [kx + ux * kl, Math.min(-0.02, ky + uy * kl + w * 0.42)];
    z += `<path d="M${J(kx + mx * w * 0.3, ky + my * w * 0.3)}Q${J(kx + ux * kl * 0.75 + mx * w * 0.25, ky + uy * kl * 0.75 + my * w * 0.25, kp[0], kp[1])}Q${J(kx + ux * kl * 0.45 - mx * w * 0.05, ky + uy * kl * 0.45 - my * w * 0.05, kx - mx * w * 0.3, ky - my * w * 0.3)}Z" fill="${o.kralle}"/>`;
    if (T.fein && !fern) {
      let ri = "";
      const nR = Math.round(el / (0.42 * k));
      for (let i = 1; i < nR; i++) {
        const t = i / nR, c = [B[0] + ex * t, B[1] + ey * t], ww = w * (1 - t * 0.38) * 0.5;
        ri += "M" + J(c[0] + mx * ww, c[1] + my * ww) + "q" + J(ux * ww * 0.35 - mx * ww, uy * ww * 0.35 - my * ww, -mx * ww * 1.7, -my * ww * 1.7);
      }
      z += zug(ri, o.dunkel, 0.045 * k, 0.55);
      z += zug("M" + J(kx + mx * w * 0.12 + ux * kl * 0.2, ky + my * w * 0.12 + uy * kl * 0.2) + "Q" + J(kx + ux * kl * 0.7 + mx * w * 0.12, ky + uy * kl * 0.7 + my * w * 0.12, kp[0] - ux * w * 0.2, kp[1] - w * 0.15), "#fff", 0.05 * k, 0.55);
    }
    return z;
  };
  const zy = -0.42 * k;
  let s = "";
  s += zeh([B[0] - Z[0] * k, zy + 0.08 * k], 0.78 * k, 2, o.dunkel, true);                  // Hinterzehe (Hallux)
  s += zeh([B[0] + Z[1] * k, zy - 0.32 * k], 0.8 * k, 3, fern ? "#000" : o.dunkel);       // innere Zehe (dahinter)
  /* Lauf und Fersengelenk */
  const lp = [[H[0] - nx * w0 * 0.5, H[1] - ny * w0 * 0.5], [H[0] + nx * w0 * 0.5, H[1] + ny * w0 * 0.5], [A[0] + nx * w1 * 0.5, A[1] + ny * w1 * 0.5],
    [A[0] + nx * w1 * 0.7 + 0.25 * k, A[1] + 0.55 * k], [A[0] - nx * w1 * 0.62, A[1] + 0.6 * k], [A[0] - nx * w1 * 0.5, A[1] + ny * w1 * 0.5]];
  s += `<path d="${G(lp)}" fill="${g}"/><ellipse cx="${N(H[0] - nx * w0 * 0.08)}" cy="${N(H[1] + 0.15 * k)}" rx="${N(w0 * 0.6)}" ry="${N(w0 * 0.58)}" fill="${g}"/>`;
  if (!fern) {
    /* Gürtelschuppen (Scutellae) vorn: Platten mit dunkler Fuge und heller Kante */
    let fu = "", ka = "";
    const nP = Math.round(l / (0.82 * k));
    for (let i = 1; i < nP; i++) {
      const t = i / nP, x = H[0] + dx * t, y = H[1] + dy * t, w = (w0 + (w1 - w0) * t) / 2;
      fu += "M" + J(x + nx * w, y + ny * w) + "q" + J(-nx * w * 0.5, -ny * w * 0.5 + 0.3 * k, -nx * w * 1.25, -ny * w * 1.25 + 0.12 * k);
      if (T.fein) ka += "M" + J(x + nx * w * 0.92, y + ny * w * 0.92 + 0.12 * k) + "q" + J(-nx * w * 0.45, -ny * w * 0.45 + 0.28 * k, -nx * w * 1.1, -ny * w * 1.1 + 0.12 * k);
    }
    s += zug(fu, o.dunkel, 0.09 * k, 0.8) + zug(ka, "#fff", 0.06 * k, 0.45);
    if (T.fein) {
      /* Netzschuppen hinten: kleine Vielecke */
      let ne = "";
      for (let i = 0; i < nP * 2; i++) {
        const t = (i + 0.5) / (nP * 2), x = H[0] + dx * t, y = H[1] + dy * t, w = (w0 + (w1 - w0) * t) / 2;
        for (const q of [-0.82, -0.5]) ne += "M" + J(x + nx * w * q, y + ny * w * q) + "l" + J(-nx * w * 0.18, 0.22 * k) + "l" + J(nx * w * 0.2, 0.2 * k);
      }
      s += zug(ne, o.dunkel, 0.04 * k, 0.5);
      s += zug("M" + J(H[0] - nx * w0 * 0.2, H[1] + 0.9 * k) + "L" + J(A[0] - nx * w1 * 0.16, A[1] - 0.3 * k), "#fff", 0.16 * k, 0.3);
    }
  }
  if (o.sporn) {
    const sx = H[0] + dx * 0.68 - nx * w0 * 0.42, sy = H[1] + dy * 0.68 - ny * w0 * 0.42, sl = o.sporn;
    s += `<path d="M${J(sx + 0.3 * k, sy - 0.55 * k)}Q${J(sx - sl * 0.5, sy - 0.5 * k, sx - sl, sy - sl * 0.5)}Q${J(sx - sl * 0.4, sy + 0.25 * k, sx + 0.3 * k, sy + 0.55 * k)}Z" fill="${fern || !T.fein ? o.dunkel : T.lg("sporn", [[0, "#efe0b8"], [0.55, "#bea06a"], [1, "#6a5434"]])}"/>`;
    if (!fern && T.fein) s += zug("M" + J(sx - sl * 0.15, sy - 0.32 * k) + "Q" + J(sx - sl * 0.55, sy - 0.35 * k, sx - sl * 0.88, sy - sl * 0.46), "#fff", 0.08 * k, 0.6);
  }
  s += zeh([B[0] + Z[2] * k, zy + 0.12 * k], 0.88 * k, 3, fern ? o.dunkel : T.lg("zeh2", [[0, o.mittel], [1, o.dunkel]]));   // äußere Zehe
  s += zeh([B[0] + Z[3] * k, zy - 0.02 * k], 0.95 * k, 4, fern ? o.mittel : T.lg("zeh", [[0, o.hell], [0.55, o.mittel], [1, o.dunkel]])); // Mittelzehe
  return s;
}

/* Schimmer für schwarze Federn mit grünem Metallglanz */
const gruenSchwarz = (T, n, x2 = 1, y2 = 1) => T.lg(n, [[0, "#0c1210"], [0.3, "#173a2c"], [0.45, "#2f7052"], [0.55, "#143326"], [0.8, "#090c0b"], [1, "#050606"]], 0, 0, x2, y2);

/* Behang (Hals, Sattel): Federn entspringen zwischen den Linien hinten und vorn (oben → unten) und fallen Richtung
   Kante; höher entspringende Federn liegen oben und sind kürzer (reich). o: { w, rund, bieg, farben, rand, schaft } */
function behang(T, hinten, vorn, kante, reihen, je, o) {
  if (!T.fein) { reihen = Math.ceil(reihen * 0.45); je = Math.ceil(je * 0.55); }
  const liste = [];
  for (let v = reihen - 1; v >= 0; v--) {
    const tv = v / (reihen - 1), reihe = [];
    for (let i = 0; i < je; i++) {
      const th = (i + 0.5 + (T.rnd() - 0.5) * 0.6) / je;
      const b = lerp(auf(hinten, tv), auf(vorn, tv), th);
      const e = auf(kante, Math.min(1, Math.max(0, (o.nachV ? tv : th) + (T.rnd() - 0.5) * 0.1)));
      const t = lerp(b, e, (o.reich ? o.reich(tv) : 1) * (0.92 + T.rnd() * 0.12));
      reihe.push({ th, b, t });
    }
    reihe.sort((a, b) => Math.abs(b.th - 0.5) - Math.abs(a.th - 0.5));
    liste.push(...reihe);
  }
  let s = "", sf = "";
  liste.forEach(({ b, t }, i) => {
    const w = o.w * (0.85 + T.rnd() * 0.3) * (T.fein ? 1 : 1.5);
    s += `<path d="${lanze(b, t, w, (o.bieg || 0) * Math.hypot(t[0] - b[0], t[1] - b[1]), o.rund)}" fill="${o.farben[i % o.farben.length]}"/>`;
    if (T.fein && o.schaft) {
      const L = Math.hypot(t[0] - b[0], t[1] - b[1]) || 1, bg = (o.bieg || 0) * L, m = [(b[0] + t[0]) / 2 - (t[1] - b[1]) / L * bg, (b[1] + t[1]) / 2 + (t[0] - b[0]) / L * bg];
      const a0 = lerp(b, m, 0.7);
      sf += "M" + J(a0[0], a0[1]) + "Q" + J(m[0] + (t[0] - b[0]) * 0.15, m[1] + (t[1] - b[1]) * 0.15, t[0] + (b[0] - t[0]) * 0.12, t[1] + (b[1] - t[1]) * 0.12);
    }
  });
  return `<g stroke="${o.rand}" stroke-width="${o.rw || 0.07}" stroke-opacity="${o.ra || 0.3}">${s}</g>` + zug(sf, o.schaft, 0.06, o.sfop || 0.35);
}

module.exports = [
  /* ------------------------------------------------------------------ HAHN */
  { id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "rooster",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.64, hoehe: 0.6,
    /* RECHERCHE: Bankiva-/Goldhalsfarbe (wie Italiener, rebhuhnfarbig) – Haushahn ca. 60–65 cm von Schnabel bis
       Sichelspitze, 55–60 cm hoch bis Kammspitze. Gefiederzonen: Halsbehang (Hackles) lang, schmal, spitz, goldorange;
       Sattelbehang (Saddle) lang, spitz, rotorange über dem Schwanzansatz; Rücken und Flügelbug dunkelrot,
       Flügelbinde (große Decken) schwarz-grün glänzend, Flügeldreieck (Armschwingen außen) braun-bay; Brust, Bauch,
       Schenkel schwarz; Steuerfedern schwarz, darüber die großen Sicheln (gebogene Schwanzdecken) und viele kleine
       Sicheln mit grünem Metallglanz. Einfacher Kamm mit 5 Zacken, zwei Kehllappen, rote Ohrscheibe, orangerote
       Iris, nackter roter Augenring, hornfarbener, leicht gebogener Oberschnabel (ca. 3 cm). Lauf gelb, vorn mit
       Gürtelschuppen (Scutellae), hinten Netzschuppen, Sporn hinten-innen am Lauf, vier Zehen: drei nach vorn,
       Hinterzehe (Hallux) nach hinten. Quellen: extension.org „External anatomy of chickens", mypetchicken.com
       „hackles, sickles, saddles". */
    zeichne(T) {
      Q = 10;
      let s = "";
      const F = T.fein;
      const BEIN = { hell: "#f8da7c", mittel: "#e4b040", dunkel: "#9a6a1c", kralle: "#8a7656", k: 1 };
      /* fernes Bein mit eigenem (dunklem) Schenkel */
      s += lauf(T, Object.assign({}, BEIN, { H: [-5.4, -13.6], A: [-4.2, -1.3], w0: 2.15, w1: 1.75, fern: true, sporn: 2.1 }));
      s += T.form(G([[-9, -20], [-2, -20], [-3, -15], [-4.6, -12.6], [-6.6, -13.2], [-8.4, -16]]), "#050707");
      /* Steuerfedern (schwarz, runde Spitzen) und ferne Sicheln */
      let K = sammler();
      const schwarz = T.lg("schwarz", [[0, "#1e2a26"], [1, "#07090a"]]);
      for (const t of [[-21.6, -53.4], [-25, -51.6], [-28.2, -48], [-30.4, -43.4], [-31, -38.6]])
        langfeder(T, [[-15, -35], lerp([-15, -35], t, 0.5), t], 2.8, 2.5, schwarz, { rund: true, schaft: "#46564f", kante: "#5a7a6c", kanteOp: 0.35 }, K);
      const sichelF = T.lg("sichelF", [[0, "#0b100e"], [0.5, "#1b4234"], [1, "#060807"]], 0, 0, 1, 1);
      for (const p of [[[-15, -39], [-19.5, -51], [-25, -56.6], [-31, -55.2], [-34.4, -47], [-35.4, -38], [-34.6, -31]], [[-16, -37], [-22, -47.6], [-28, -50.2], [-32, -45], [-33, -36], [-32.2, -28.4]]])
        langfeder(T, p, 3.2, 0.5, sichelF, { schaft: "#2a3a34", kante: "#3e7a5e", kanteOp: 0.45 }, K);
      s += K.aus("#000", 0.1, 0.35);
      /* Rumpf: Brust und Bauch schwarz mit Grünglanz (jede Feder einzeln), Schlagschatten unter dem Behang */
      const rumpf = [[15.8, -34], [15.6, -28], [13, -22.6], [8.4, -19], [2.4, -17.2], [-5.6, -17.4], [-12.4, -20.2], [-16.8, -25], [-18.6, -30.6], [-17.2, -35.6], [-12, -38.6], [-4, -39.8], [5, -39.8], [11.5, -38]];
      const sicht = [[16.6, -36], [16.2, -27.5], [13.4, -22], [8.4, -18.4], [2.4, -16.6], [-5.6, -16.8], [-13, -19.6], [-17.6, -25.4], [-14, -26], [-5, -24], [4, -25.5], [9, -29.5], [12, -34]];
      const ton = ["#0c1412", "#101a17", "#0a0f0e", "#15241f"];
      s += teil(T, rumpf, gruenSchwarz(T, "rumpf", 0.6, 1),
        federfeld(T, sicht, { abst: 1.7, L: 3.4, W: 2.5, winkel: (x, y) => (x > 7 ? 96 + (y + 34) * 1.6 : 140 - (y + 30) * 2), streu: 14, gr: (x, y) => 0.8 - (y + 30) * 0.02,
          toene: ton, rand: "#4a8a6c", rw: 0.14, ra: 0.35, saum: T.lg("glanzK", [[0, "#8ad8b0"], [0.5, "#3a7e60"], [1, "#16302a"]]), sw: 0.2, sop: 0.4 }) +
        struktur(T, rumpf, "rumpf", 100, "#000", 0.35) +
        `<ellipse cx="10.5" cy="-30" rx="6.5" ry="6" fill="${T.rg("brustGlanz", [[0, "#62c092", 0.25], [1, "#62c092", 0]])}"/>` +
        zug("M16 -31Q15.4 -22 8 -18.4", "#5a8a74", 0.5, 0.3) +
        `<path d="M-6 -37Q4 -32 17 -33L17 -30Q4 -28.6 -6 -33Z" fill="${T.lg("schl", [[0, "#000", 0.6], [1, "#000", 0]])}"/>`);
      /* nahes Bein mit Sporn, darüber die Schenkelfedern („Hosen"), die die Ferse halb verdecken */
      s += lauf(T, Object.assign({}, BEIN, { H: [0.8, -13.6], A: [2.6, -1.3], w0: 2.25, w1: 1.85, sporn: 2.7 }));
      const hose = [[-6.4, -24], [5.4, -24], [5.8, -18], [4.4, -14.4], [2.8, -12.6], [0.8, -13.1], [-1.2, -12.4], [-3.4, -13.4], [-5.8, -15.8], [-6.9, -20]];
      s += teil(T, hose, "#0a0e0d", federfeld(T, [[-6, -21], [5.2, -21], [4.4, -14.6], [0.8, -13.4], [-3, -14], [-5.6, -17.4]], { abst: 1.45, L: 2.8, W: 2, winkel: (x) => 96 + x * 1.5,
          toene: ton, rand: "#4a8a6c", rw: 0.12, ra: 0.3, saum: "#3e7a5e", sw: 0.16, sop: 0.35 }) + struktur(T, hose, "hose", 95, "#3e6656", 0.35, 1.2, 0.3) +
        `<path d="${G(hose)}" fill="${T.lg("hoseV", [[0, "#000", 0], [0.55, "#000", 0.15], [1, "#000", 0.5]], 0, 0, 1, 0.3)}"/>`, { rand: false, vol: false });
      /* Flügel: Bug dunkelrot, Binde grün-schwarz, Dreieck bay, Handschwingen schwarz */
      const flug = [[10.4, -36.4], [9.4, -30], [5, -25.8], [-3, -23.8], [-11.5, -23.6], [-17, -25.2], [-13.5, -28.8], [-6, -32.8], [2, -36.6]];
      let fi = "";
      const nH = F ? 6 : 2, nA = F ? 9 : 4, nD = F ? 9 : 4;
      K = sammler();
      for (let i = 0; i < nH; i++) langfeder(T, [[-1 - i * 7 / nH, -27.6], [-8 - i * 7.8 / nH, -26.2], [-14.6 - i * 3 / nH, -25]], 2.2, 1.5, "#111413", { rund: true, schaft: "#4a4a44", kante: "#6a6a60", kanteOp: 0.6 }, K);
      fi += K.aus("#000", 0.1, 0.4);
      for (let i = 0; i < nA; i++) {
        const x = 8.8 - i * 13.9 / nA, k = F ? 1 : 1.6;
        fi += langfeder(T, [[x + 1.2, -30.6], [x - 1.4, -27.6], [x - 4.4, -24.6], [x - 6.6, -23.4]], 2.4 * k, 2.1 * k, T.lg("bay", [[0, "#c87634"], [0.55, "#a8561f"], [1, "#6a2c10"]], 1, 0, 0, 1),
          { rund: true, schaft: "#4a1e08", strahl: "#5a2a10", strahlN: 6, kante: "#f0a868", kanteOp: 0.5, rand: "#2a0e04", ra: 0.4 });
      }
      for (let i = 0; i < nD; i++) {
        const x = 9.4 - i * 18.9 / nD;
        fi += langfeder(T, [[x + 0.6, -33.4 + i * 0.9 / nD], [x - 0.8, -30.8 + i * 1.3 / nD], [x - 2, -29.2 + i * 1.8 / nD]], F ? 3.2 : 4.6, F ? 2.9 : 4.2, gruenSchwarz(T, "binde", 1, 0.4),
          { rund: true, schaft: "#2a3a34", kante: "#98e4bc", kanteOp: 0.22, kw: 0.3, rand: "#000", ra: 0.4 });
      }
      const bug = [[10.8, -37.4], [10.2, -32.2], [4, -31.6], [-4, -32.6], [-8, -34.2], [-6, -37.6], [2, -38.6]];
      fi += T.form(G(bug), "#7a2210") + federfeld(T, bug, { abst: 1.25, L: 2.4, W: 1.7, winkel: () => 158, toene: ["#8e2a14", "#a83418", "#74200e", "#b8401e"], rand: "#2a0602", rw: 0.1, ra: 0.55, saum: "#e07448", sw: 0.14, sop: 0.35 });
      s += teil(T, flug, "#6a2a12", fi, { randA: 0.35 });
      /* kleine Sicheln (viele, überlappend) und die große Sichel (vorn) mit grünem Metallglanz */
      const sichel = gruenSchwarz(T, "sichel");
      const kleine = [[[[-17.2, -30.4], [-20.8, -30.4], [-23.4, -25.4], [-23.4, -18.6]], 2], [[[-17, -31.6], [-21.6, -32], [-25, -27], [-25.6, -19.6]], 2.1], [[[-16.8, -32.8], [-22.6, -34], [-26.6, -29.2], [-27.6, -21]], 2.2],
        [[[-16.4, -34.2], [-22.8, -36.6], [-27.8, -33], [-29.6, -24.4]], 2.3], [[[-16, -35.4], [-23, -40], [-28.6, -37.2], [-30.8, -29], [-30.6, -22.4]], 2.4], [[[-15.6, -37], [-23.4, -45.4], [-30.2, -44.4], [-33.2, -36], [-33.6, -25.4]], 2.6]];
      K = sammler();
      for (const [p, w] of (F ? kleine : kleine.filter((x, i) => i % 2)))
        langfeder(T, p, w * (F ? 1 : 1.3), 0.4, sichel, { schaft: "#4a6a5c", kante: "#a2e6c2", kanteOp: 0.5 }, K);
      langfeder(T, [[-14.6, -40], [-19, -52.6], [-25.4, -58.8], [-32.2, -57.2], [-36.6, -48.6], [-38.2, -38.6], [-37.4, -29.4]], 3.6, 0.5, sichel,
        { schaft: "#4a6a5c", strahl: "#24463a", strahlN: 16, kante: "#b4f0d0", kanteOp: 0.6, kw: 0.2 }, K);
      s += K.aus("#000", 0.1, 0.45);
      /* Sattelbehang: entspringt am Rücken unter dem Halsbehang, fällt über Flügelende und Schwanzansatz */
      s += T.form(G([[1, -40.4], [-6, -41], [-12.4, -39.6], [-16.8, -33.6], [-15.4, -28.4], [-11, -26.8], [-6, -28.6], [-2, -33]]), "#6a1e0c");
      s += behang(T, [[1.2, -40], [-5.6, -40.6], [-12.4, -39]], [[0.6, -37.6], [-5.4, -37.8], [-12, -36]], [[-4.8, -28.8], [-8.6, -26.8], [-12.6, -26.6], [-15.6, -28.4], [-17.6, -32]], 8, 5,
        { w: 1.25, bieg: -0.07, nachV: true, farben: [T.lg("sat1", [[0, "#8e2a12"], [0.5, "#d0602a"], [1, "#f2a848"]]), T.lg("sat2", [[0, "#7e2410"], [0.6, "#c45624"], [1, "#e89a40"]]), T.lg("sat3", [[0, "#a03416"], [1, "#f4b050"]])],
          schaft: "#ffe2a0", rand: "#3a1004", ra: 0.35, reich: (t) => 0.82 + t * 0.18 });
      /* Halsbehang: lange, schmale, spitze goldorange Federn bis über die Schultern */
      s += T.form(G([[11.8, -53.4], [17.5, -54.4], [19.6, -50], [19.4, -45.2], [18, -40], [16.2, -35], [8, -34.6], [-1.6, -38], [-3, -39.6], [4, -42.4], [8.6, -47]]), "#b05a1c");
      s += behang(T, [[12.4, -53.2], [9.6, -48.4], [5.6, -43.4], [1.5, -40.6]], [[18.6, -51], [20, -46.8], [18.8, -41.8], [16.8, -36.6]], [[-2.8, -38.8], [1.6, -36.4], [6.6, -34.8], [11.6, -34], [16.6, -34]], 9, 8,
        { w: 1.6, bieg: 0.05, farben: [T.lg("hals1", [[0, "#d07e28"], [0.55, "#f2b450"], [1, "#e68c2c"]]), T.lg("hals2", [[0, "#e09a3c"], [0.6, "#f8c868"], [1, "#d87424"]]), T.lg("hals3", [[0, "#c47426"], [0.5, "#f4bc5c"], [1, "#e48a2c"]])],
          schaft: "#fff0c0", rand: "#5a2208", ra: 0.35, reich: (t) => 0.4 + t * 0.6 });
      s += `<path d="${G([[12.4, -52], [15.6, -46], [14.4, -40], [10, -36.4], [12.2, -42], [12.4, -47]])}" fill="${T.rg("satin", [[0, "#fff6d0", 0.35], [1, "#fff6d0", 0]])}"/>`;
      /* Kopf: kleine Federn, rote nackte Gesichtshaut, Ohrscheibe, Auge, Schnabel, Kamm, Kehllappen */
      const kopf = [[12.4, -50.8], [14, -53.8], [18, -54.6], [21.4, -52.6], [22, -49.2], [20.4, -46.4], [16.4, -46.6], [13, -48]];
      s += teil(T, kopf, T.lg("kopfF", [[0, "#f6c460"], [1, "#d87a28"]]), F ? struktur(T, kopf, "kopf", 178, "#8a4410", 0.35, 1.6, 0.4) +
        federfeld(T, kopf, { abst: 0.9, L: 1.7, W: 0.95, winkel: () => 178, spitz: true, toene: ["#f2b850", "#eaa844", "#f8c868"], rand: "#9a5014", rw: 0.06, ra: 0.4 }) : "", { rand: false, vol: F });
      const rot = T.lg("rot", [[0, "#f0434a"], [0.55, "#cc1c26"], [1, "#8a0c14"]]);
      let haut = teil(T, [[17.3, -52.4], [21.4, -52.6], [22.1, -49.2], [21, -46.6], [18.4, -46.8], [16.8, -49.4]], rot, "", { rand: false, vol: false });
      haut += `<ellipse cx="17.7" cy="-48" rx=".85" ry="1.05" fill="${T.rg("ohr", [[0, "#f07070"], [1, "#b8242c"]], 0.4, 0.35, 0.6)}"/>`;
      haut += T.form(G([[21.8, -48.4], [23, -47], [23.2, -44.2], [22.5, -41.8], [21.3, -41.4], [21.1, -44.6]]), "#8a0c14");
      haut += teil(T, [[20.6, -48.4], [22.3, -47.8], [22.7, -44.8], [21.9, -42], [20.1, -41], [18.7, -42.4], [18.9, -46]], rot, F ?
        zug("M19.5 -46Q19.4 -43 20.6 -41.8", "#ffc0c0", 0.25, 0.45) + `<path d="M18.6 -47.6Q21 -46.4 22.8 -47.6L22.8 -48.6L18.6 -48.6Z" fill="#4a0008" opacity=".3"/>` : "", { randA: 0.3, rw: 0.08 });
      /* Kamm: Blatt mit 5 runden Zacken, nach hinten auslaufend */
      haut += teil(T, kammPfad([[21.8, -52.2, 1], [22.1, -54.2]], [[20.6, -57.2, 0.75], [18.4, -59.3, 0.85], [16, -60.2, 0.9], [13.6, -59.4, 0.85], [11.4, -57.6, 0.75]], 1.3, [[9.6, -56.6], [9.4, -55.4], [10.6, -54], [13, -53.4], [17.5, -53.8]]),
        T.lg("kamm", [[0, "#f4525a"], [0.45, "#d6202a"], [1, "#9a1018"]], 0, 0, 0.3, 1), F ? T.textur(G([[9, -61], [23, -61], [23, -52], [9, -52]]), T.rauschen("poren", { fx: 3.5, fy: 3.5, farbe: "#6a0008", staerke: 3, okt: 2 }), 0, 0.18, [9, -61, 23, -52]) +
            zug("M11.2 -57.2l.3.6M13.4 -59l.3.6M15.8 -59.8l.3.6M18.2 -59l.3.6M20.4 -56.9l.2.5", "#fff", 0.22, 0.6) +
            `<path d="M10 -54.4Q16 -53.8 22 -52.6L22 -51.6L10 -53Z" fill="#5a0008" opacity=".35"/>` : "", { randA: 0.35, rw: 0.08 });
      s += relief(T, "kamm", haut, { f: 4, tiefe: 0.03, okt: 2, k1: 1.1 });
      /* Schnabel: Oberschnabel leicht gebogen (First dunkler), Unterschnabel, Nasenloch */
      s += teil(T, [[21.4, -52.2], [23.2, -51.7], [24.6, -50.4], [25.1, -48.8, 1], [23.8, -49.4], [21.7, -49.6]], T.lg("schn", [[0, "#8a7040"], [0.35, "#ecd086"], [1, "#b88c3a"]]),
        F ? zug("M21.8 -51.9Q24 -51.4 24.9 -49.2", "#fff8d8", 0.14, 0.65) : "", { rw: 0.08, randA: 0.5 });
      s += teil(T, [[21.7, -49.6], [24, -49.3], [24.5, -49.1], [22, -48.5]], "#c8a050", "", { rw: 0.06, randA: 0.5, vol: false });
      s += `<ellipse cx="22.5" cy="-51" rx=".38" ry=".15" fill="#2a1a08" transform="rotate(14 22.5 -51)"/>` + zug("M21.6 -49.6L24.4 -49.2", "#4a3010", 0.07, 0.8);
      /* Auge mit nacktem Augenring */
      s += `<ellipse cx="19.6" cy="-50.6" rx="1.12" ry="1" fill="#a8121a" opacity=".85"/>`;
      s += T.augeReal(19.7, -50.6, 0.64, { iris: "#f2901e", iris2: "#a8460c", pupille: "rund", offen: 1.1, lid: "#5a0a0c" });
      return { svg: s, box: [-38.8, -60.2, 25.1, 0] };
    } },

  /* ------------------------------------------------------------------ HENNE */
  { id: "henne", de: "die Henne", syl: "HEN-ne", it: "la gallina", itSyl: "gal-LI-na", en: "hen",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.44, hoehe: 0.42,
    /* RECHERCHE: braunes Legehuhn (ISA Brown / Lohmann Brown, aus Rhode Island Red × Rhode Island White) – rötlich
       kastanienbraun, Halsbehang goldbraun mit runderen, kürzeren Federn als beim Hahn, Steuerfedern dunkelbraun bis
       schwarz, darüber braune Schwanzdecken; kleiner Einfachkamm (meist 5 Zacken), kleine Kehllappen, rote Ohrscheibe,
       orangegelbe Iris; Schnabel hornfarben, ca. 2 cm; Lauf gelb, ohne Sporn. Ca. 40–44 cm lang, 38–42 cm hoch.
       Konturfedern rund mit hellerem Saum und hellem Schaft; Flügel: kleine/mittlere/große Decken, Armschwingen
       (hell gesäumt), Handschwingen dunkler, großteils verdeckt. Quellen: Wikipedia „ISA Brown", extension.org. */
    zeichne(T) {
      Q = 10;
      let s = "", g = "";
      const F = T.fein;
      const BEIN = { hell: "#f6d679", mittel: "#e0ae44", dunkel: "#9a6c22", kralle: "#8a7656", k: 0.8 };
      s += lauf(T, Object.assign({}, BEIN, { H: [-4.8, -9.6], A: [-3.8, -1], w0: 1.6, w1: 1.3, fern: true }));
      s += T.form(G([[-8, -15], [-2, -15], [-2.8, -10.6], [-4.2, -8.8], [-5.8, -9.4], [-7.4, -12]]), "#4a1c08");
      /* Schwanz: Steuerfedern dunkelbraun, darüber braune Schwanzdecken */
      const st = T.lg("steuer", [[0, "#6a3a1c"], [0.5, "#3a2010"], [1, "#1c1008"]]);
      for (const t of [[-19.6, -39.4], [-21.2, -38.4], [-22.6, -36.6], [-23.6, -34.2], [-24, -31.6]])
        g += langfeder(T, [[-15.4, -27], lerp([-15.4, -27], t, 0.55), t], 2.5, 2.3, st, { rund: true, schaft: "#a07850", kante: "#8a5a34", kanteOp: 0.45 });
      s += gruppe(g, "#000", 0.1, 0.35); g = "";
      const decke = T.lg("sdecke", [[0, "#a85a26"], [1, "#6a3014"]]);
      for (const t of [[-18.2, -35.4], [-20.2, -33.8], [-21.8, -31.4], [-22.2, -28.6]])
        g += langfeder(T, [[-14.6, -27.6], lerp([-14.6, -27.6], t, 0.5), t], 2.4, 2.1, decke, { rund: true, schaft: "#f0c890", schaftOp: 0.4, kante: "#e8b47a", kanteOp: 0.55 });
      s += gruppe(g, "#2a0e02", 0.1, 0.4); g = "";
      /* Rumpf mit Konturfedern (runde Spitzen, heller Saum); Schlagschatten von Behang und Flügel */
      const rumpf = [[10.8, -28.8], [12.7, -24.6], [12.4, -20], [10, -16.2], [5.4, -13.2], [-0.6, -11.8], [-7, -12.2], [-12.2, -14.2], [-16.4, -17.6], [-19, -22.4], [-19.8, -26.8], [-17.8, -30.2], [-13, -31.6], [-6, -31.2], [0.5, -30.4], [6, -29.8]];
      const winkel = (x, y) => (x > 6 ? 98 + (y + 28) * 1.4 : 172 - (y + 31) * 3 + (x < -13 ? -14 : 0));
      s += teil(T, rumpf, T.lg("braun", [[0, "#b4602a"], [0.5, "#984a1c"], [1, "#5a2810"]]),
        struktur(T, rumpf, "rumpf", 170, "#3a1404", 0.4) +
        federfeld(T, rumpf, { abst: 1.6, L: 3, W: 2.3, winkel, streu: 14, gr: (x, y) => 0.88 - (y + 31) * 0.008 + (x < -10 ? 0.1 : 0),
          toene: ["#a4521f", "#b05c24", "#984a1a", "#ba6a2e", "#8e4418"], rand: "#3a1204", rw: 0.12, ra: 0.5, saum: T.lg("kanteH", [[0, "#f0c088"], [1, "#a8642c"]]), sw: 0.22, sop: 0.4, schaft: "#e8b880", sfop: 0.25 }) +
        `<ellipse cx="-15.5" cy="-17" rx="5" ry="4" fill="${T.rg("flaum", [[0, "#e8b07a", 0.3], [1, "#e8b07a", 0]])}"/>` +
        zug("M12.4 -22Q11.6 -15 4 -12.6", "#eaa262", 0.45, 0.3) +
        `<path d="M-1 -29.6Q6 -25.6 14 -26.2L14 -23.6Q6 -22.6 -1 -27Z" fill="${T.lg("schl", [[0, "#000", 0.45], [1, "#000", 0]])}"/>`);
      /* nahes Bein, darüber die Schenkelfedern (verdecken die Ferse halb) */
      s += lauf(T, Object.assign({}, BEIN, { H: [0.6, -9.6], A: [2.1, -1], w0: 1.68, w1: 1.36 }));
      const hose = [[-5.2, -18], [4.4, -18], [4.8, -13.6], [3.4, -10.4], [2, -9.2], [0.5, -9.7], [-1, -8.9], [-2.6, -9.6], [-4.6, -11.8], [-5.6, -15]];
      s += teil(T, hose, "#7a3616", struktur(T, hose, "hose", 95, "#e0a060", 0.4, 1.2, 0.3) +
        federfeld(T, [[-5, -17], [4.4, -17], [3.8, -10.4], [0.5, -9.8], [-2.6, -9.8], [-4.6, -12.4]], { abst: 1.3, L: 2.4, W: 1.8, winkel: (x) => 96 + x * 1.5, toene: ["#8a4018", "#7a3614", "#94481c"], rand: "#2a0c02", rw: 0.1, ra: 0.45, saum: "#d8945a", sw: 0.16, sop: 0.35 }) +
        `<path d="${G(hose)}" fill="${T.lg("hoseV", [[0, "#000", 0], [0.6, "#000", 0.12], [1, "#000", 0.42]], 0, 0, 1, 0.3)}"/>`, { rand: false, vol: false });
      /* Flügel: Handschwingen (dunkel, hinten unten), Armschwingen gesäumt, große/mittlere/kleine Decken */
      const flug = [[8.2, -28], [7.6, -23.4], [4.8, -19.6], [-1, -17.6], [-8, -17], [-14, -18], [-15.6, -19.6], [-12, -22.4], [-5, -25.8], [1.5, -28], [5.2, -28.8]];
      let fi = "";
      const nA = F ? 9 : 4, nD = F ? 8 : 4;
      for (let i = 0; i < (F ? 5 : 2); i++) g += langfeder(T, [[-2 - i, -20.6 + i * 0.2], [-9 - i * 0.9, -19.4 + i * 0.1], [-15 - i * 0.2, -19.2]], 2, 1.6, "#3e1c0a", { rund: true, schaft: "#a07040", kante: "#9a6a40" });
      for (let i = 0; i < nA; i++) {
        const x = 6.4 - i * 13.5 / nA, k = F ? 1 : 1.5;
        g += langfeder(T, [[x + 0.8, -23.4], [x - 1.6, -21], [x - 4.6, -18.8], [x - 6.8, -17.8]], 2.2 * k, 1.9 * k, T.lg("arm", [[0, "#b06a32"], [0.6, "#8a4218"], [1, "#5a2408"]], 1, 0, 0, 1),
          { rund: true, schaft: "#f0c890", schaftOp: 0.45, strahl: "#3a1404", strahlN: 6, kante: "#f2c088", kanteOp: 0.6 });
      }
      for (let i = 0; i < nD; i++) {
        const x = 7.6 - i * 15.2 / nD, k = F ? 1 : 1.5;
        g += langfeder(T, [[x + 0.6, -26 + i * 2 / nD], [x - 0.8, -24.2 + i * 2 / nD], [x - 1.8, -23 + i * 2 / nD]], 2.3 * k, 2.1 * k, T.lg("decke", [[0, "#c0763a"], [1, "#8a4218"]]),
          { rund: true, schaft: "#f6d0a0", schaftOp: 0.4, kante: "#f6cc94", kanteOp: 0.65 });
      }
      fi += gruppe(g, "#2a0e02", 0.1, 0.4); g = "";
      const bug = [[8.4, -28.6], [8, -25.2], [3, -24.8], [-4, -25.6], [-6.5, -26.4], [-1, -28.6], [4.5, -29.4]];
      fi += T.form(G(bug), "#a85c28") + federfeld(T, bug, { abst: 1.15, L: 2.1, W: 1.55, winkel: () => 160, toene: ["#b4662c", "#a85c26", "#c27434", "#9a5220"], rand: "#3a1404", rw: 0.1, ra: 0.5, saum: "#f2c890", sw: 0.16, sop: 0.45, schaft: "#f0c890" });
      s += teil(T, flug, "#6a3014", fi, { randA: 0.35 });
      /* Halsbehang goldbraun: schmale, rundliche Federn, oben kurz, unten bis über die Schultern */
      s += T.form(G([[10.2, -39.4], [14.8, -40.4], [16.4, -36], [15.4, -30.6], [13.4, -26.4], [7, -25.4], [-0.4, -28.6], [3.6, -31.8], [7.6, -35]]), "#9a5220");
      s += behang(T, [[10.6, -39.2], [8, -35.4], [4.6, -31.8], [1.6, -29.8]], [[15.6, -38.4], [16.2, -35], [15.4, -31], [13.6, -28]], [[-0.8, -28.4], [3, -26.2], [7.4, -25], [11, -25.2], [13.6, -26.4]], 8, 8,
        { w: 1.35, rund: true, bieg: 0.05, farben: [T.lg("h1", [[0, "#9a5224"], [0.6, "#c47e3e"], [1, "#d4924c"]]), T.lg("h2", [[0, "#a85c28"], [1, "#d89c56"]]), T.lg("h3", [[0, "#8e4a20"], [0.7, "#bc7638"], [1, "#cc8a46"]])],
          schaft: "#f6d4a0", sfop: 0.25, rand: "#4a1e08", ra: 0.25, reich: (t) => 0.4 + t * 0.6 });
      s += `<path d="${G([[10.8, -38], [13.4, -33], [12, -28.6], [8, -27], [10, -32]])}" fill="${T.rg("satin", [[0, "#ffe2b8", 0.25], [1, "#ffe2b8", 0]])}"/>`;
      /* Kopf */
      const kopf = [[11, -37.4], [12.6, -40.4], [16, -41], [18.8, -39.2], [18.8, -36], [16.8, -34], [13.6, -34.4], [11.4, -35.4]];
      s += teil(T, kopf, T.lg("kopf", [[0, "#cc8c4a"], [1, "#9a5422"]]), struktur(T, kopf, "kopf", 175, "#5a2a0c", 0.35, 1.8, 0.45) +
        federfeld(T, kopf, { abst: 0.75, L: 1.4, W: 0.9, winkel: () => 172, toene: ["#c4844a", "#b87840", "#cc9050"], rand: "#6a3410", rw: 0.05, ra: 0.4 }), { rand: false });
      const rot = T.lg("rot", [[0, "#ea3c42"], [0.6, "#c41a22"], [1, "#8c1016"]]);
      let haut = teil(T, [[14.8, -39], [18.1, -39.2], [19.1, -36], [17.4, -34.2], [15.2, -34.6], [14.4, -36.8]], rot, "", { rand: false, vol: false });
      haut += `<ellipse cx="15" cy="-35.4" rx=".62" ry=".85" fill="${T.rg("ohr", [[0, "#ee6a6a"], [1, "#b8242c"]], 0.4, 0.35, 0.6)}"/>`;
      haut += teil(T, [[17.8, -36], [19.1, -35.6], [19.1, -33.6], [18.1, -32.7], [17.1, -33.6]], rot, "", { randA: 0.3, rw: 0.07 });
      haut += T.koerper(kammPfad([[18.6, -38.9, 1], [18.8, -40.1]], [[17.8, -41.2, 0.45], [16.5, -42.2, 0.5], [15, -42.5, 0.5], [13.6, -42, 0.5], [12.4, -41, 0.45]], 0.75, [[11.6, -40.4], [12.6, -39.8], [15.6, -40]]),
        T.lg("kamm", [[0, "#f24c52"], [1, "#a01219"]]), { randA: 0.35, rw: 0.07, innen: zug("M13.5 -41.7l.2.4M15 -42.2l.2.4M16.5 -41.9l.2.4", "#fff", 0.16, 0.6) });
      s += relief(T, "kamm", haut, { f: 4.5, tiefe: 0.03, okt: 2, k1: 1.1 });
      /* Schnabel (ca. 2 cm), geschlossen */
      s += teil(T, [[18.5, -38.8], [19.8, -38.4], [20.7, -37.4], [21, -36.3, 1], [20.2, -36.6], [18.7, -36.7]], T.lg("schn", [[0, "#9a7a48"], [0.35, "#ecd08a"], [1, "#b88e44"]]),
        F ? zug("M18.8 -38.5Q20.2 -38.1 20.8 -36.7", "#fff6d0", 0.12, 0.6) : "", { rw: 0.07, randA: 0.5 });
      s += teil(T, [[18.8, -36.7], [20.2, -36.5], [20.5, -36.3], [19, -35.9]], "#c8a058", "", { rw: 0.05, randA: 0.5, vol: false });
      s += `<ellipse cx="19.25" cy="-37.9" rx=".3" ry=".12" fill="#2a1a08" transform="rotate(14 19.25 -37.9)"/>`;
      s += `<ellipse cx="16.3" cy="-37.4" rx=".9" ry=".8" fill="#a8141c" opacity=".75"/>`;
      s += T.augeReal(16.4, -37.4, 0.52, { iris: "#f2a432", iris2: "#a8560c", pupille: "rund", offen: 1.1, lid: "#5a0a0c" });
      return { svg: s, box: [-24.2, -42.6, 21, 0] };
    } },
];
