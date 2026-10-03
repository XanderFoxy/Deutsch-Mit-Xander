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
const zunge = (F, spitz, lang = 2) => {   // ganze Feder als Blatt: runde (oder spitze) Spitze, Ansatz zulaufend
  const R = F.R, u = F.u, n = F.n, L = R * lang;
  return bogen(F, 1, 0, 0, spitz) + "q" + J(-u[0] * L * 0.55, -u[1] * L * 0.55, -u[0] * L + n[0] * R, -u[1] * L + n[1] * R) + "q" + J(u[0] * L * 0.45 + n[0] * R, u[1] * L * 0.45 + n[1] * R, u[0] * L + n[0] * R, u[1] * L + n[1] * R) + "Z";
};

/* Farben mischen: mische("#a05020", "#fff", 0.3) */
function mische(c1, c2, t) {
  const h = (c) => (c.length === 4 ? c.replace(/([0-9a-f])/gi, "$1$1") : c);
  const a = h(c1), b = h(c2);
  return "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
}
/* Konturfedern als Feld in einer Fläche (poly, ungeglättet). Jede Feder ist eine eigene Federzunge (runde oder spitze
   Spitze), in Dachziegel-Reihenfolge gezeichnet (stromab zuerst, die kopfnähere Feder liegt oben). Jede Zunge hat
   einen Verlauf: dunkler Ansatz → Farbe → heller Saum an der Spitze; dunkle Kante = Schatten auf der Feder darunter.
   o: { name, abst, L, W, winkel(x,y), gr(x,y), streu, spitz, toene: [farbe…], saum, saumT, rand, rw, ra, szene } */
function federfeld(T, poly0, o) {
  if (!T.fein && !o.szene) return "";
  /* Feld etwas über den Umriss hinaus säen (die Form klippt): so sind auch am Rand alle Federansätze bedeckt */
  const cx = poly0.reduce((a, p) => a + p[0], 0) / poly0.length, cy = poly0.reduce((a, p) => a + p[1], 0) / poly0.length;
  const poly = poly0.map(([x, y]) => { const l = Math.hypot(x - cx, y - cy) || 1, d = o.ueber != null ? o.ueber : o.abst * 0.9; return [x + (x - cx) / l * d, y + (y - cy) / l * d]; });
  const a = o.abst * (T.fein ? 1 : 1.6), fs = [];
  const [x0, y0, x1, y1] = T.box(poly);
  let j = 0, ux = 0, uy = 0;
  for (let y = y0 - a * 0.3; y <= y1 + a * 0.3; y += a * 0.72, j++)
    for (let x = x0 + (j % 2) * a * 0.5; x <= x1 + a * 0.3; x += a) {
      const px = x + (T.rnd() - 0.5) * a * 0.4, py = y + (T.rnd() - 0.5) * a * 0.35;
      if (!T.inPoly(px, py, poly)) continue;
      const g = (o.gr ? o.gr(px, py) : 1) * (T.fein ? 1 : 1.6);
      const F = spitze([px, py], o.winkel(px, py) + (T.rnd() - 0.5) * (o.streu || 10), o.L * g * (0.88 + T.rnd() * 0.24), o.W * g * (0.85 + T.rnd() * 0.3));
      F.key = px * F.u[0] + py * F.u[1]; ux += F.u[0]; uy += F.u[1];
      fs.push(F);
    }
  fs.sort((p, q) => q.key - p.key);
  const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
  const toene = T.fein && o.saum ? o.toene.map((c, i) => T.lg(o.name + i, [[0, mische(c, "#000", 0.25)], [0.55, c], [0.8, mische(c, o.saum, (o.saumT || 0.4) * 0.5)], [1, mische(c, o.saum, o.saumT || 0.4)]],
    N(0.5 - ux * 0.5), N(0.5 - uy * 0.5), N(0.5 + ux * 0.5), N(0.5 + uy * 0.5))) : o.toene;
  let s = "";
  fs.forEach((F) => { const i = Math.floor(T.rnd() * toene.length); s += `<path d="${zunge(F, o.spitz, o.lang || 2.2)}"${i ? ` fill="${toene[i]}"` : ""}/>`; });
  return `<g fill="${toene[0]}" stroke="${o.rand}" stroke-width="${o.rw || 0.12}" stroke-opacity="${o.ra || 0.5}">${s}</g>`;
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
        for (const q of [-0.7]) ne += "M" + J(x + nx * w * q, y + ny * w * q) + "l" + J(-nx * w * 0.18, 0.22 * k) + "l" + J(nx * w * 0.2, 0.2 * k);
      }
      s += zug(ne, o.dunkel, 0.04 * k, 0.5);
      s += zug("M" + J(H[0] - nx * w0 * 0.2, H[1] + 0.9 * k) + "L" + J(A[0] - nx * w1 * 0.16, A[1] - 0.3 * k), "#fff", 0.16 * k, 0.3);
    }
  }
  if (o.sporn) {
    /* Sporn: an der Hinterkante des Laufs, kegelförmig, nach hinten und leicht nach oben gebogen */
    const t = 0.66, w = (w0 + (w1 - w0) * t) / 2, sx = H[0] + dx * t - nx * w * 0.85, sy = H[1] + dy * t - ny * w * 0.85, sl = o.sporn;
    const sp = [sx - sl, sy - sl * 0.42];
    s += `<path d="M${J(sx + 0.2 * k, sy - 0.62 * k)}Q${J(sx - sl * 0.55, sy - 0.5 * k, sp[0], sp[1])}Q${J(sx - sl * 0.5, sy + 0.35 * k, sx + 0.2 * k, sy + 0.62 * k)}Z" fill="${fern || !T.fein ? o.dunkel : T.lg("sporn", [[0, "#f2e6c4"], [0.5, "#c8ac74"], [1, "#7a6040"]])}"/>`;
    if (!fern && T.fein) s += zug("M" + J(sx - sl * 0.1, sy - 0.36 * k) + "Q" + J(sx - sl * 0.55, sy - 0.32 * k, sp[0] + 0.25 * k, sp[1] + 0.05 * k), "#fff", 0.09 * k, 0.65) +
      zug("M" + J(sx - sl * 0.05, sy + 0.45 * k) + "Q" + J(sx - sl * 0.5, sy + 0.2 * k, sp[0] + 0.3 * k, sp[1] + 0.25 * k), "#3a2a14", 0.08 * k, 0.5);
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
    const w = o.w * (0.85 + T.rnd() * 0.3) * (T.fein ? 1 : 1.5), f = i % o.farben.length;
    s += `<path d="${lanze(b, t, w, (o.bieg || 0) * Math.hypot(t[0] - b[0], t[1] - b[1]), o.rund)}"${f ? ` fill="${o.farben[f]}"` : ""}/>`;
    if (T.fein && o.schaft) {
      const L = Math.hypot(t[0] - b[0], t[1] - b[1]) || 1, bg = (o.bieg || 0) * L, m = [(b[0] + t[0]) / 2 - (t[1] - b[1]) / L * bg, (b[1] + t[1]) / 2 + (t[0] - b[0]) / L * bg];
      const a0 = lerp(b, m, 0.7);
      sf += "M" + J(a0[0], a0[1]) + "Q" + J(m[0] + (t[0] - b[0]) * 0.15, m[1] + (t[1] - b[1]) * 0.15, t[0] + (b[0] - t[0]) * 0.12, t[1] + (b[1] - t[1]) * 0.12);
    }
  });
  return `<g fill="${o.farben[0]}" stroke="${o.rand}" stroke-width="${o.rw || 0.07}" stroke-opacity="${o.ra || 0.3}">${s}</g>` + zug(sf, o.schaft, 0.06, o.sfop || 0.35);
}

/* Daunen-/Flaumrand: kurze, gebogene Strähnen entlang einer (ungeglätteten) Umrisslinie nach außen. Ein Pfad je Farbe. */
function flaum(T, pts, n, laenge, farben, zu = true) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const seg = [];
  let L = 0;
  for (let i = 0; i < pts.length - (zu ? 0 : 1); i++) { const a = pts[i], b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, L, l]); L += l; }
  const eimer = farben.map(() => "");
  const m = Math.round(n * (T.fein ? 1 : 0.3));
  for (let i = 0; i < m; i++) {
    const t = (i + T.rnd() * 0.8) / m * L, sg = seg.find((g) => t >= g[2] && t <= g[2] + g[3]) || seg[seg.length - 1];
    const p = lerp(sg[0], sg[1], (t - sg[2]) / (sg[3] || 1));
    let nx = sg[1][1] - sg[0][1], ny = -(sg[1][0] - sg[0][0]); const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    if (nx * (p[0] - cx) + ny * (p[1] - cy) < 0) { nx = -nx; ny = -ny; }
    const w = (T.rnd() - 0.5) * 0.9, ux = nx * Math.cos(w) - ny * Math.sin(w), uy = nx * Math.sin(w) + ny * Math.cos(w), l = laenge * (0.5 + T.rnd() * 0.8);
    const sx = p[0] - ux * l * 0.35, sy = p[1] - uy * l * 0.35, k = (T.rnd() - 0.5) * l * 0.6;
    eimer[i % farben.length] += "M" + J(sx, sy) + "q" + J(ux * l * 0.5 - uy * k, uy * l * 0.5 + ux * k, ux * l, uy * l);
  }
  return eimer.map((d, i) => zug(d, farben[i][0], farben[i][1], farben[i][2])).join("");
}

/* Schwimmfuß (Ente, Gans), leicht von oben gesehen: kurzer Lauf, drei Vorderzehen mit Schwimmhaut, kleine Hinterzehe.
   o: { H: Ferse, A: Fußwurzel, w0, w1, L (Zehenlänge), hell, mittel, dunkel, kralle, fern } */
function schwimmfuss(T, o) {
  const { H, A, w0, w1, L, fern } = o;
  const dx = A[0] - H[0], dy = A[1] - H[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
  const g = !T.fein || fern ? (fern ? o.dunkel : o.mittel) : T.lg("lauf", [[0, o.mittel], [0.3, o.hell], [0.7, o.mittel], [1, o.dunkel]], 0, 0, 1, 0);
  const B = [A[0] + 0.2, A[1] + 0.25];
  /* Zehenspitzen (leicht von oben): außen (zum Betrachter, tiefer), Mitte, innen (weiter weg, höher) */
  const za = [B[0] + L * 0.84, -0.04], zm = [B[0] + L, -L * 0.1], zi = [B[0] + L * 0.78, -L * 0.21];
  let s = "";
  /* Hinterzehe (klein, hoch angesetzt) */
  s += zug("M" + J(B[0] - 0.1, B[1] - 0.45) + "q" + J(-L * 0.1, L * 0.02, -L * 0.17, L * 0.07), o.dunkel, L * 0.05, 1);
  /* Lauf mit Querschildern */
  s += `<path d="${G([[H[0] - nx * w0 / 2, H[1] - ny * w0 / 2], [H[0] + nx * w0 / 2, H[1] + ny * w0 / 2], [A[0] + nx * w1 / 2, A[1]], [A[0] + nx * w1 * 0.7, A[1] + 0.4], [A[0] - nx * w1 * 0.6, A[1] + 0.45], [A[0] - nx * w1 / 2, A[1]]])}" fill="${g}"/>`;
  if (!fern && T.fein) {
    let q = "";
    const n = Math.round(l / (w1 * 0.55));
    for (let i = 1; i < n; i++) { const t = i / n, x = H[0] + dx * t, y = H[1] + dy * t, w = (w0 + (w1 - w0) * t) / 2; q += "M" + J(x + nx * w, y + ny * w) + "q" + J(-nx * w * 0.6, 0.25 * w, -nx * w * 1.6, 0.05 * w); }
    s += zug(q, o.dunkel, w1 * 0.05, 0.55);
  }
  /* Schwimmhaut: zwischen den Zehen eingebuchtet, durchscheinend heller */
  const ein = (p, q, t) => [p[0] + (q[0] - p[0]) * 0.5 - L * 0.13 * t, p[1] + (q[1] - p[1]) * 0.5 + L * 0.015 * t];
  const haut = [[B[0] - L * 0.03, B[1] - 0.25], zi, ein(zi, zm, 1), zm, ein(zm, za, 1), za, [B[0] + L * 0.25, -0.02], [B[0] - L * 0.02, B[1] + 0.15]];
  s += `<path d="${G(haut)}" fill="${fern ? o.dunkel : (T.fein ? T.lg("haut", [[0, o.mittel], [0.5, o.hell], [1, o.mittel]], 0, 0, 1, 0.5) : o.hell)}"/>`;
  /* Zehen als Wülste mit Gliedern */
  let ze = "";
  for (const z of [zi, zm, za]) ze += "M" + J(B[0], B[1] - 0.15) + "Q" + J(B[0] + (z[0] - B[0]) * 0.5, B[1] + (z[1] - B[1]) * 0.5 - L * 0.03, z[0], z[1]);
  s += zug(ze, fern ? "#000" : o.dunkel, L * 0.085, fern ? 0.25 : 0.5) + zug(ze, fern ? o.dunkel : o.mittel, L * 0.06, 1);
  if (!fern) {
    s += zug(ze, o.hell, L * 0.018, 0.7, ` transform="translate(0 ${N(-L * 0.012)})"`);
    if (T.fein) {
      let q = "";
      for (const z of [zm, za]) for (let i = 2; i < 10; i++) { const t = i / 10, x = B[0] + (z[0] - B[0]) * t, y = B[1] + (z[1] - B[1]) * t - L * 0.03 * 4 * t * (1 - t); q += "M" + J(x - L * 0.004, y - L * 0.028) + "l" + J(L * 0.01, L * 0.056); }
      s += zug(q, o.dunkel, L * 0.007, 0.6);
      s += zug("M" + J(H[0] - nx * w0 * 0.2, H[1] + 0.5) + "L" + J(A[0] - nx * w1 * 0.15, A[1] - 0.3), "#fff", w1 * 0.12, 0.3);
    }
  }
  let kr = "";
  for (const z of [zi, zm, za]) kr += "M" + J(z[0] - L * 0.03, z[1] - L * 0.02) + "l" + J(L * 0.07, L * 0.025);
  s += zug(kr, o.kralle, L * 0.035, 1);
  return s;
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
      const ton = ["#0c1412", "#101a17", "#15241f"];
      s += teil(T, rumpf, gruenSchwarz(T, "rumpf", 0.6, 1),
        federfeld(T, sicht, { abst: 2, L: 3.8, W: 2.8, winkel: (x, y) => (x > 7 ? 96 + (y + 34) * 1.6 : 140 - (y + 30) * 2), streu: 14, gr: (x, y) => 0.8 - (y + 30) * 0.02,
          toene: ton, rand: "#000", rw: 0.14, ra: 0.55, saum: "#5ac894", saumT: 0.45, name: "brF" }) +
        struktur(T, rumpf, "rumpf", 100, "#000", 0.35) +
        `<ellipse cx="10.5" cy="-30" rx="6.5" ry="6" fill="${T.rg("brustGlanz", [[0, "#62c092", 0.25], [1, "#62c092", 0]])}"/>` +
        zug("M16 -31Q15.4 -22 8 -18.4", "#5a8a74", 0.5, 0.3) +
        `<path d="M-6 -37Q4 -32 17 -33L17 -30Q4 -28.6 -6 -33Z" fill="${T.lg("schl", [[0, "#000", 0.6], [1, "#000", 0]])}"/>`);
      /* nahes Bein mit Sporn, darüber die Schenkelfedern („Hosen"), die die Ferse halb verdecken */
      s += lauf(T, Object.assign({}, BEIN, { H: [0.8, -13.6], A: [2.6, -1.3], w0: 2.25, w1: 1.85, sporn: 2.7 }));
      const hose = [[-6.4, -24], [5.4, -24], [5.8, -18], [4.4, -14.4], [2.8, -12.6], [0.8, -13.1], [-1.2, -12.4], [-3.4, -13.4], [-5.8, -15.8], [-6.9, -20]];
      s += teil(T, hose, "#0a0e0d", federfeld(T, [[-6, -21], [5.2, -21], [4.4, -14.6], [0.8, -13.4], [-3, -14], [-5.6, -17.4]], { abst: 1.7, L: 3, W: 2.2, winkel: (x) => 96 + x * 1.5,
          toene: ton, rand: "#000", rw: 0.12, ra: 0.5, saum: "#4aa880", saumT: 0.35, name: "hoF" }) + struktur(T, hose, "hose", 95, "#3e6656", 0.35, 1.2, 0.3) +
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
          { rund: true, schaft: "#4a1e08", kante: "#f0a868", kanteOp: 0.5, rand: "#2a0e04", ra: 0.4 });
      }
      for (let i = 0; i < nD; i++) {
        const x = 9.4 - i * 18.9 / nD;
        fi += langfeder(T, [[x + 0.6, -33.4 + i * 0.9 / nD], [x - 0.8, -30.8 + i * 1.3 / nD], [x - 2, -29.2 + i * 1.8 / nD]], F ? 3.2 : 4.6, F ? 2.9 : 4.2, gruenSchwarz(T, "binde", 1, 0.4),
          { rund: true, schaft: "#2a3a34", kante: "#98e4bc", kanteOp: 0.22, kw: 0.3, rand: "#000", ra: 0.4 });
      }
      const bug = [[10.8, -37.4], [10.2, -32.2], [4, -31.6], [-4, -32.6], [-8, -34.2], [-6, -37.6], [2, -38.6]], bugS = [[10.4, -35.4], [10.2, -32.2], [4, -31.6], [-4, -32.6], [-8, -34.2], [-6, -36.6], [2, -35.4]];
      fi += T.form(G(bug), "#7a2210") + federfeld(T, bugS, { abst: 1.5, L: 2.7, W: 2, winkel: () => 158, toene: ["#8e2a14", "#a83418", "#74200e"], rand: "#2a0602", rw: 0.1, ra: 0.55, saum: "#f08850", saumT: 0.4, name: "bugF" });
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
      s += T.form(G([[2, -40.6], [-5, -41], [-11.6, -39.8], [-15.6, -35], [-16.4, -30.4], [-13, -27.6], [-8, -28], [-3, -33]]), "#9a3a14");
      s += behang(T, [[1.6, -40.4], [-5, -40.8], [-11.6, -39.4]], [[1, -37.8], [-5, -38], [-11.4, -36.4]], [[-4.6, -29.6], [-8.4, -27.8], [-12.4, -27.4], [-15.4, -29.2], [-17, -32.4]], 9, 6,
        { w: 1.05, bieg: -0.1, nachV: true, farben: [T.lg("sat1", [[0, "#b8481a"], [0.45, "#e07a30"], [1, "#f6b450"]]), T.lg("sat2", [[0, "#a43c16"], [0.6, "#d86e2c"], [1, "#eea444"]]), T.lg("sat3", [[0, "#c25220"], [1, "#f8c060"]])],
          schaft: "#ffe8b0", rand: "#4a1406", ra: 0.3, reich: (t) => 0.8 + t * 0.2 });
      /* Halsbehang: lange, schmale, spitze goldorange Federn bis über die Schultern */
      s += T.form(G([[11.8, -53.4], [17.5, -54.4], [19.6, -50], [19.4, -45.2], [18, -40], [16.2, -35], [8, -34.6], [-1.6, -38], [-3, -39.6], [4, -42.4], [8.6, -47]]), "#b05a1c");
      s += behang(T, [[12.4, -53.2], [9.6, -48.4], [5.6, -43.4], [1.5, -40.6]], [[18.6, -51], [20, -46.8], [18.8, -41.8], [16.8, -36.6]], [[-2.8, -38.8], [1.6, -36.4], [6.6, -34.8], [11.6, -34], [16.6, -34]], 8, 7,
        { w: 1.6, bieg: 0.05, farben: [T.lg("hals1", [[0, "#d07e28"], [0.55, "#f2b450"], [1, "#e68c2c"]]), T.lg("hals2", [[0, "#e09a3c"], [0.6, "#f8c868"], [1, "#d87424"]]), T.lg("hals3", [[0, "#c47426"], [0.5, "#f4bc5c"], [1, "#e48a2c"]])],
          schaft: "#fff0c0", rand: "#5a2208", ra: 0.35, reich: (t) => 0.4 + t * 0.6 });
      s += `<path d="${G([[12.4, -52], [15.6, -46], [14.4, -40], [10, -36.4], [12.2, -42], [12.4, -47]])}" fill="${T.rg("satin", [[0, "#fff6d0", 0.35], [1, "#fff6d0", 0]])}"/>`;
      /* Kopf: kleine Federn, rote nackte Gesichtshaut, Ohrscheibe, Auge, Schnabel, Kamm, Kehllappen */
      const kopf = [[12.4, -50.8], [14, -53.8], [18, -54.6], [21.4, -52.6], [22, -49.2], [20.4, -46.4], [16.4, -46.6], [13, -48]];
      s += teil(T, kopf, T.lg("kopfF", [[0, "#f6c460"], [1, "#d87a28"]]), F ? struktur(T, kopf, "kopf", 178, "#8a4410", 0.35, 1.6, 0.4) +
        federfeld(T, kopf, { abst: 1.2, L: 2, W: 1.15, winkel: () => 178, spitz: true, toene: ["#f2b850", "#eaa844", "#f8c868"], rand: "#9a5014", rw: 0.06, ra: 0.4, saum: "#fff0b0", saumT: 0.4, name: "kF" }) : "", { rand: false, vol: F });
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
      s += lauf(T, Object.assign({}, BEIN, { H: [-3.6, -9.6], A: [-3, -1], w0: 1.6, w1: 1.3, fern: true }));
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
        federfeld(T, rumpf, { abst: 1.8, L: 3.4, W: 2.6, winkel, streu: 8, gr: (x, y) => 0.88 - (y + 31) * 0.008 + (x < -10 ? 0.1 : 0),
          toene: ["#a4521f", "#b05c24", "#984a1a"], rand: "#3a1204", rw: 0.12, ra: 0.5, saum: "#f4c890", saumT: 0.5, name: "rF" }) +
        `<ellipse cx="-15.5" cy="-17" rx="5" ry="4" fill="${T.rg("flaum", [[0, "#e8b07a", 0.3], [1, "#e8b07a", 0]])}"/>` +
        zug("M12.4 -22Q11.6 -15 4 -12.6", "#eaa262", 0.45, 0.3) +
        `<path d="M-1 -29.6Q6 -25.6 14 -26.2L14 -23.6Q6 -22.6 -1 -27Z" fill="${T.lg("schl", [[0, "#000", 0.45], [1, "#000", 0]])}"/>`);
      /* nahes Bein, darüber die Schenkelfedern (verdecken die Ferse halb) */
      s += lauf(T, Object.assign({}, BEIN, { H: [0.6, -9.6], A: [2.1, -1], w0: 1.68, w1: 1.36 }));
      const hose = [[-5.2, -18], [4.4, -18], [4.8, -13.6], [3.4, -10.4], [2, -9.2], [0.5, -9.7], [-1, -8.9], [-2.6, -9.6], [-4.6, -11.8], [-5.6, -15]];
      s += teil(T, hose, "#7a3616", struktur(T, hose, "hose", 95, "#e0a060", 0.4, 1.2, 0.3) +
        federfeld(T, [[-5, -17], [4.4, -17], [3.8, -10.4], [0.5, -9.8], [-2.6, -9.8], [-4.6, -12.4]], { abst: 1.55, L: 2.7, W: 2, winkel: (x) => 96 + x * 1.5, toene: ["#8a4018", "#7a3614", "#94481c"], rand: "#2a0c02", rw: 0.1, ra: 0.45, saum: "#e8a868", saumT: 0.4, name: "hoF" }) +
        `<path d="${G(hose)}" fill="${T.lg("hoseV", [[0, "#000", 0], [0.6, "#000", 0.12], [1, "#000", 0.42]], 0, 0, 1, 0.3)}"/>`, { rand: false, vol: false });
      /* Flügel: Handschwingen (dunkel, hinten unten), Armschwingen gesäumt, große/mittlere/kleine Decken */
      const flug = [[8.2, -28], [7.6, -23.4], [4.8, -19.6], [-1, -17.6], [-8, -17], [-14, -18], [-15.6, -19.6], [-12, -22.4], [-5, -25.8], [1.5, -28], [5.2, -28.8]];
      let fi = "";
      const nA = F ? 9 : 4, nD = F ? 8 : 4;
      for (let i = 0; i < (F ? 5 : 2); i++) g += langfeder(T, [[-2 - i, -20.6 + i * 0.2], [-9 - i * 0.9, -19.4 + i * 0.1], [-15 - i * 0.2, -19.2]], 2, 1.6, "#3e1c0a", { rund: true, schaft: "#a07040", kante: "#9a6a40" });
      for (let i = 0; i < nA; i++) {
        const x = 6.4 - i * 13.5 / nA, k = F ? 1 : 1.5;
        g += langfeder(T, [[x + 0.8, -23.4], [x - 1.6, -21], [x - 4.6, -18.8], [x - 6.8, -17.8]], 2.2 * k, 1.9 * k, T.lg("arm", [[0, "#b06a32"], [0.6, "#8a4218"], [1, "#5a2408"]], 1, 0, 0, 1),
          { rund: true, schaft: "#f0c890", schaftOp: 0.45, kante: "#f2c088", kanteOp: 0.6 });
      }
      for (let i = 0; i < nD; i++) {
        const x = 7.6 - i * 15.2 / nD, k = F ? 1 : 1.5;
        g += langfeder(T, [[x + 0.6, -26 + i * 2 / nD], [x - 0.8, -24.2 + i * 2 / nD], [x - 1.8, -23 + i * 2 / nD]], 2.3 * k, 2.1 * k, T.lg("decke", [[0, "#c0763a"], [1, "#8a4218"]]),
          { rund: true, schaft: "#f6d0a0", schaftOp: 0.4, kante: "#f6cc94", kanteOp: 0.65 });
      }
      fi += gruppe(g, "#2a0e02", 0.1, 0.4); g = "";
      const bug = [[8.4, -28.6], [8, -25.2], [3, -24.8], [-4, -25.6], [-6.5, -26.4], [-1, -28.6], [4.5, -29.4]];
      fi += T.form(G(bug), "#a85c28") + federfeld(T, bug, { abst: 1.35, L: 2.4, W: 1.8, winkel: () => 160, toene: ["#b4662c", "#a85c26", "#c27434"], rand: "#3a1404", rw: 0.1, ra: 0.5, saum: "#f8d4a0", saumT: 0.55, name: "bugF" });
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
        federfeld(T, kopf, { abst: 1, L: 1.7, W: 1.1, winkel: () => 172, toene: ["#c4844a", "#b87840", "#cc9050"], rand: "#6a3410", rw: 0.05, ra: 0.4, saum: "#ffe0b0", saumT: 0.4, name: "kF" }), { rand: false });
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

  /* ------------------------------------------------------------------ KÜKEN */
  { id: "kueken", de: "das Küken", syl: "KÜ-ken", it: "il pulcino", itSyl: "pul-CI-no", en: "chick",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.117, hoehe: 0.1,
    /* RECHERCHE: Eintagsküken (Haushuhn) ca. 40 g, 8–10 cm lang, ca. 9–10 cm hoch; dichtes gelbes Daunenkleid (Dunen,
       noch keine Konturfedern), oben kräftiger gelb, Bauch heller cremegelb; Kopf groß und rund im Verhältnis zum
       Körper, Flügel nur kleine Daunenstummel (erste Schwungfederkiele ab Tag 3–4), kein Schwanz; kurzer, kegeliger,
       blass gelb-rosa Schnabel, an der Spitze noch der kleine helle Eizahn; große, dunkle, runde Augen mit hellem
       Lidrand; Beine blass orange-gelb, fein geschuppt, vier dünne Zehen. */
    zeichne(T) {
      Q = 100;
      let s = "";
      const F = T.fein;
      const BEIN = { hell: "#f8cf86", mittel: "#eab066", dunkel: "#b87a3a", kralle: "#c89a6a", k: 0.2 };
      s += lauf(T, Object.assign({}, BEIN, { H: [-1.2, -2.6], A: [-0.9, -0.3], w0: 0.4, w1: 0.32, fern: true, zehen: [2.4, 4.6, 5, 6.4] }));
      const umriss = [[-5.2, -4.8], [-4.8, -6.4], [-3.4, -7.4], [-1.2, -7.9], [0.6, -8.5], [1.6, -9.3], [3, -9.65], [4.4, -9.3], [5.25, -8.2], [5.25, -6.9], [4.6, -5.9], [3.8, -4.7], [2.6, -3.2], [0.8, -2.2], [-1.4, -1.95], [-3.4, -2.4], [-4.7, -3.4]];
      /* Flaumrand hinter dem Körper (weiche Silhouette) */
      s += flaum(T, umriss, 330, 0.4, [["#e6b23c", 0.035, 0.75], ["#f6d258", 0.035, 0.8], ["#fdeaa0", 0.03, 0.8]]);
      const winkel = (x, y) => (x > 2.2 && y < -6 ? 200 - (y + 8) * 20 : x > 1 ? 120 : 170 - (y + 5) * 18);
      s += teil(T, umriss, T.rg("daune", [[0, "#fff4b0"], [0.45, "#ffd954"], [0.8, "#f2bc36"], [1, "#d89a26"]], 0.42, 0.32, 0.72),
        (F ? T.haare(umriss, 950, winkel, 0.3, { farben: [["#fff6c4", 1, 0.03, 0.6], ["#e8ac30", 1, 0.03, 0.4], ["#c88a20", 0.5, 0.03, 0.35]], streuung: 40, kruemmung: 0.35 }) : "") +
        `<ellipse cx="3.1" cy="-7.4" rx="2.3" ry="2.1" fill="${T.rg("kopfL", [[0, "#fff8d0", 0.55], [1, "#fff8d0", 0]], 0.4, 0.35, 0.6)}"/>` +
        `<ellipse cx="2.9" cy="-5.3" rx="1.8" ry=".9" fill="${T.rg("kinn", [[0, "#a86a10", 0.25], [1, "#a86a10", 0]])}"/>` +
        `<ellipse cx="-0.6" cy="-2.9" rx="3.6" ry="1.4" fill="${T.rg("bauchL", [[0, "#fff4d0", 0.3], [1, "#fff4d0", 0]])}"/>`, { rand: false });
      /* Flügelstummel mit Daunen */
      const flg = [[0.6, -6.2], [-0.5, -4.7], [-2.4, -3.9], [-3.9, -4.3], [-3.4, -5.3], [-1.6, -6.3]];
      s += teil(T, flg, T.lg("fl", [[0, "#ffe27a"], [1, "#e4ac32"]]), F ? T.haare(flg, 160, 165, 0.3, { farben: [["#fff2b0", 1, 0.03, 0.6], ["#c88a20", 1, 0.03, 0.4]], streuung: 25 }) : "", { rand: false });
      s += flaum(T, [[-1.6, -4.1], [-2.6, -3.85], [-3.9, -4.3]], 40, 0.28, [["#d8a030", 0.03, 0.7], ["#f8dc70", 0.03, 0.75]], false);
      s += zug("M0.5 -6.1Q-0.8 -4.4 -3 -3.9", "#b07a18", 0.07, 0.35);
      /* nahes Bein */
      s += lauf(T, Object.assign({}, BEIN, { H: [0.85, -2.25], A: [1.2, -0.3], w0: 0.42, w1: 0.34, zehen: [2.4, 4.6, 5, 6.4] }));
      s += flaum(T, [[-0.3, -2.3], [0.85, -2.0], [2, -2.4]], 44, 0.3, [["#f2c444", 0.03, 0.85], ["#fbe08a", 0.03, 0.85]], false);
      /* Schnabel mit Eizahn, Nasenloch */
      s += teil(T, [[4.95, -8.05], [5.5, -7.9], [6.05, -7.5, 1], [5.6, -7.32], [5, -7.25]], T.lg("schn", [[0, "#f6d8a0"], [0.6, "#e8b878"], [1, "#b8885a"]]), "", { rw: 0.03, randA: 0.45 });
      s += teil(T, [[5.05, -7.3], [5.75, -7.32], [5.2, -7.0]], "#dca878", "", { rw: 0.03, randA: 0.4, vol: false });
      s += `<circle cx="5.86" cy="-7.62" r=".055" fill="#fff8e8"/><ellipse cx="5.2" cy="-7.83" rx=".08" ry=".04" fill="#6a4a2a"/>`;
      /* Auge: groß, dunkel, heller Lidrand */
      s += `<ellipse cx="3.68" cy="-7.78" rx=".42" ry=".39" fill="#e8c070" opacity=".9"/>`;
      s += T.augeReal(3.7, -7.78, 0.29, { iris: "#2e1c0e", iris2: "#140a04", pupille: "rund", offen: 1.12, lid: "#7a5a2a" });
      return { svg: s, box: [-5.65, -10.05, 6.05, 0] };
    } },

  /* ------------------------------------------------------------------ ENTE */
  { id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.576, hoehe: 0.31,
    /* RECHERCHE: Stockente (Anas platyrhynchos), Erpel im Prachtkleid – 50–65 cm lang, stehend ca. 30–35 cm hoch.
       Kopf und Hals flaschengrün metallisch glänzend (je nach Licht violett-blau), schmaler weißer Halsring (hinten
       offen), Brust kastanien-purpurbraun mit feinen hellen Säumen, Flanken und Bauch hellgrau, fein dunkel gewellt
       (Wellenzeichnung), Schulterfedern graubraun gewellt, Rücken graubraun, Bürzel und Unter-/Oberschwanzdecken
       samtschwarz mit grünem Schimmer, Schwanz weißlich-grau mit zwei schwarzen, nach oben eingerollten
       Mittelfedern („Erpellocke"), Flügelspiegel blau-violett schillernd mit schwarzer und weißer Einfassung vorn und
       hinten; Schirmfedern (Schulter/Tertiären) graubraun mit kastanienbraunem Saum; Handschwingen graubraun über dem
       Schwanz. Schnabel gelb bis olivgelb mit schwarzem Nagel, Nasenloch nahe der Basis, Lamellen an der Kante;
       Auge dunkelbraun; Beine und Schwimmfüße orange. Quellen: Wildlife Trusts „How to identify dabbling ducks",
       NZ Birds Online „Mallard", naturalis.nl „Anas platyrhynchos". */
    zeichne(T) {
      Q = 10;
      let s = "";
      const F = T.fein;
      const FUSS = { hell: "#ffb24c", mittel: "#f28a26", dunkel: "#b85c14", kralle: "#3a2418", L: 6.4 };
      s += schwimmfuss(T, Object.assign({}, FUSS, { H: [-4.6, -6.4], A: [-4.3, -1.3], w0: 1.5, w1: 1.1, fern: true }));
      /* Schwanz: weißlich-graue Steuerfedern, spitz, dunkle Mitte */
      let K = sammler();
      for (const [t, w] of [[[-29.2, -19.4], 2.6], [[-29.8, -18.2], 2.8], [[-29.6, -16.9], 2.8], [[-28.6, -15.7], 2.5], [[-27.2, -14.9], 2.2]])
        langfeder(T, [[-21.4, -17.4], lerp([-21.4, -17.4], t, 0.55), t], w, 0.6, T.lg("schw", [[0, "#8a8a84"], [0.45, "#d8d6ce"], [1, "#f6f5ee"]], 0, 0, 1, 0), { schaft: "#6a6a64", schaftOp: 0.5 }, K);
      s += K.aus("#6a6a64", 0.07, 0.35);
      /* Rumpf: graue Flanken mit feiner Wellenzeichnung, kastanienbraune Brust, samtschwarzes Heck */
      const rumpf = [[16.4, -19.2], [15.6, -14.6], [12.6, -10.8], [7, -7.9], [-1, -6.7], [-9, -7.2], [-15.4, -9.6], [-20.2, -12.8], [-23.4, -16.4], [-22.6, -20], [-17, -22.2], [-8, -23.2], [2, -23], [10, -22.2]];
      const brust = [[7.6, -24.5], [18, -24.5], [18, -6], [10.4, -6], [11.6, -9.6], [11.4, -14.6], [10, -19]];
      let ri = "";
      if (F) {
        ri += struktur(T, rumpf, "well", 90, "#3a3c38", 0.55, 3.2, 0.22);
        ri += struktur(T, rumpf, "well2", 90, "#2a2c28", 0.35, 4.5, 0.3);
      }
      ri += T.form(G(brust), T.lg("brust", [[0, "#7c4434"], [0.45, "#6a3428"], [1, "#3e2020"]], 0, 0, 0.4, 1));
      if (F) ri += federfeld(T, brust, { abst: 0.9, L: 1.7, W: 1.35, winkel: (x, y) => 100 + (y + 16) * 2, toene: ["#74402e", "#6c3a2a", "#7a4632"], rand: "#2a1410", rw: 0.05, ra: 0.35, saum: "#b48474", saumT: 0.35, name: "brF" }) +
        struktur(T, brust, "brS", 100, "#2a1008", 0.3, 2, 0.4);
      ri += T.form(G([[-16, -24], [-30, -24], [-30, -6], [-17.4, -8], [-16.6, -13], [-17.2, -18.4]]), T.lg("heck", [[0, "#1e2a26"], [0.5, "#0c100f"], [1, "#050606"]]));
      if (F) ri += federfeld(T, [[-16.8, -23], [-26, -23], [-26, -10], [-17.8, -9]], { abst: 1.3, L: 2.3, W: 1.8, winkel: () => 170, toene: ["#0e1412", "#121c18", "#0a0e0d"], rand: "#000", rw: 0.07, ra: 0.5, saum: "#3a6656", saumT: 0.45, name: "heF" });
      ri += `<path d="M-6 -24Q6 -19.6 16 -21.6L16 -18.6Q6 -17.6 -6 -21Z" fill="${T.lg("schl", [[0, "#000", 0.35], [1, "#000", 0]])}"/>` +
        `<ellipse cx="2" cy="-9.4" rx="12" ry="2.4" fill="${T.rg("bauchR", [[0, "#fff", 0.18], [1, "#fff", 0]])}"/>`;
      s += teil(T, rumpf, T.lg("flanke", [[0, "#e0e0da"], [0.6, "#c6c6c0"], [1, "#9a9a94"]]), ri, { randA: 0.3 });
      s += schwimmfuss(T, Object.assign({}, FUSS, { H: [-0.6, -6.6], A: [-0.2, -1.5], w0: 1.6, w1: 1.15 }));
      /* Erpellocke: zwei schwarze, aufgerollte Federn */
      s += zug("M-20.2 -20Q-21.4 -23.8 -19.4 -24.2Q-17.9 -24.4 -18.4 -22.9", "#0e1210", 0.7) + zug("M-21 -19.8Q-22.8 -22.8 -21.2 -23.6Q-20.1 -24 -20.4 -22.9", "#0e1210", 0.6);
      if (F) s += zug("M-20.4 -20.6Q-21.3 -23.3 -19.6 -23.7", "#5aa080", 0.12, 0.6);
      /* Flügel: Schulterfedern graubraun gewellt, Schirmfedern mit kastanienbraunem Saum, Spiegel, Handschwingen */
      const flug = [[10.8, -21.6], [8.4, -17.8], [-2, -15.9], [-12, -15.5], [-19.4, -16.9], [-24.2, -19.4], [-18, -21.3], [-6, -22.6], [4, -23]];
      let fi = T.form(G([[-8, -20], [-26, -21], [-26, -16], [-8, -16]]), "#5a5048");
      /* Spiegel: Armschwingen blau-violett schillernd, vorn und hinten schwarz-weiß gesäumt */
      fi += zug("M-1.6 -18.7L-14.2 -19", "#fbfbf6", 0.55, 0.95) + zug("M-1.6 -18.2L-14.2 -18.5", "#0a0a0a", 0.3, 0.9);
      K = sammler();
      for (let i = 0; i < (F ? 7 : 3); i++) {
        const x = -2.4 - i * (F ? 1.6 : 3.6);
        langfeder(T, [[x + 2, -18.2], [x, -16.8], [x - 1.8, -15.8]], F ? 2.3 : 4.2, F ? 2 : 3.8, T.lg("spiegel", [[0, "#2e3c9a"], [0.4, "#4a64dc"], [0.7, "#7048c0"], [1, "#1a2260"]], 0, 0, 1, 1), { rund: true, schaft: "#141a40", schaftOp: 0.45 }, K);
      }
      fi += K.aus("#0a0a20", 0.07, 0.5);
      fi += zug("M-4.2 -15.5L-16.4 -15.8", "#0a0a0a", 0.3, 0.9) + zug("M-4.2 -15L-16.6 -15.3", "#fbfbf6", 0.5, 0.95);
      /* Handschwingen (graubraun) über dem Schwanz */
      K = sammler();
      for (let i = 0; i < (F ? 4 : 2); i++) langfeder(T, [[-10 - i, -19.4 + i * 0.3], [-17 - i * 0.6, -19.2 + i * 0.2], [-24.2 + i * 0.6, -19.4 + i * 0.2]], 1.9, 1.3, "#6a6058", { rund: true, schaft: "#c8c0b4", schaftOp: 0.4, kante: "#9a9088", kanteOp: 0.5 }, K);
      fi += K.aus("#2a241e", 0.07, 0.5);
      /* Schirmfedern (Tertiären): lang, grau-braun mit kastanienbraunem Außensaum */
      for (let i = 0; i < (F ? 4 : 2); i++) {
        const x = -3 - i * 2.2;
        fi += langfeder(T, [[x + 3, -21.4 + i * 0.25], [x - 2, -20.3 + i * 0.25], [x - 7, -19.4 + i * 0.3]], 2.4, 1.8, T.lg("tert", [[0, "#9a8c7a"], [0.55, "#7a6a58"], [0.8, "#6a4a36"], [1, "#4a3020"]], 0, 0, 0, 1),
          { rund: true, schaft: "#e0d6c8", schaftOp: 0.4, rand: "#2a2018", ra: 0.35 });
      }
      /* Schulterfedern: groß, länglich, graubraun mit feiner Wellung, liegen über dem Flügel */
      const schulter = [[11.2, -22.2], [8.8, -18.6], [2, -18.2], [-4, -19.4], [-7.6, -21.4], [-4, -23.4], [4, -23.8]];
      fi += T.form(G(schulter), "#a09484");
      for (let i = 0; i < (F ? 9 : 4); i++) {
        const t = i / (F ? 8 : 3), x = 10 - t * 15, y = -22.6 + t * 1.2 + (i % 2) * 1.6;
        fi += langfeder(T, [[x + 1.6, y - 0.4], [x - 1.6, y + 0.4], [x - 4.2, y + 1.6]], 2.8, 2.4, T.lg("schul", [[0, "#b0a494"], [0.6, "#9a8e7e"], [1, "#7a6e60"]], 0, 0, 0, 1),
          { rund: true, schaft: "#e8e0d4", schaftOp: 0.35, kante: "#d8d0c4", kanteOp: 0.4, rand: "#3a3028", ra: 0.35 });
      }
      if (F) fi += struktur(T, schulter, "scS", 90, "#3a3028", 0.45, 3, 0.25);
      s += teil(T, flug, "#7a6e62", fi, { randA: 0.35 });
      let k = "";
      /* Hals und Kopf: flaschengrün, metallisch schillernd (violett-blau am Hals), weißer Halsring (hinten offen) */
      const kopf = [[11.4, -21.6], [12.8, -25.8], [15.2, -28.8], [17.6, -31.6], [20, -32.6], [22.2, -32.2], [23.4, -30.6], [23.2, -28.4], [21.6, -27.4], [20.2, -25], [19.4, -21.2], [17.2, -19.2]];
      const gruen = T.lg("kopf", [[0, "#3a9a5e"], [0.25, "#1a7442"], [0.55, "#0c4a2c"], [0.8, "#1c2c5e"], [1, "#0a1a14"]], 0.3, 0, 0.6, 1);
      k += teil(T, kopf, gruen,
        struktur(T, kopf, "kopf", 150, "#021a0c", 0.22, 3, 0.8) +
        `<ellipse cx="19.4" cy="-30.8" rx="3.2" ry="1.4" fill="${T.rg("glanz", [[0, "#b0f4c0", 0.55], [1, "#b0f4c0", 0]])}" transform="rotate(-14 19.4 -30.8)"/>` +
        `<ellipse cx="18" cy="-26.4" rx="3.2" ry="2.4" fill="${T.rg("viol", [[0, "#5a4ab8", 0.45], [1, "#5a4ab8", 0]])}"/>` +
        `<path d="M11.9 -22.4Q15.2 -21 19.3 -21.8Q19.4 -21.4 19.4 -21.2Q15.2 -20.3 11.7 -21.8Z" fill="#fbfaf4"/>` +
        `<path d="M13 -21.9Q11.8 -22.3 11.4 -22.6" fill="none" stroke="#fbfaf4" stroke-width=".3" stroke-opacity=".5"/>`, { randA: 0.35 });
      /* Schnabel gelb mit schwarzem Nagel, Nasenloch, Lamellenkante */
      k += teil(T, [[22.8, -30.6], [24.4, -29.8], [27.4, -28.6], [28.6, -27.7, 1], [28, -27], [25, -27], [23, -27.4]], T.lg("schn", [[0, "#f0dc6a"], [0.55, "#d8c040"], [1, "#9a8a2a"]]),
        F ? zug("M23.2 -30.2Q25.8 -29.5 28 -28.1", "#fff8c0", 0.18, 0.55) : "", { rw: 0.1, randA: 0.45 });
      k += `<path d="M27.7 -28.4Q28.8 -28 28.5 -27.1L27.5 -27Z" fill="#1d1a12"/>`;
      k += zug("M23.2 -27.8Q25.8 -27.6 27.8 -27.5", "#5a4c1a", 0.16, 0.8) + `<ellipse cx="24.7" cy="-29.2" rx=".5" ry=".2" fill="#3a3214" transform="rotate(20 24.7 -29.2)"/>`;
      if (F) k += zug("M23.5 -27.45l.3.3M24.3 -27.4l.3.3M25.1 -27.35l.3.3M25.9 -27.3l.3.3M26.7 -27.3l.3.3", "#7a6a2a", 0.06, 0.6);
      k += T.augeReal(20.9, -30.2, 0.44, { iris: "#3a1e0a", iris2: "#1a0c04", pupille: "rund", offen: 1.05, lid: "#04120a" });
      s += `<g transform="translate(15 -21) scale(.86) translate(-15 21)">${k}</g>`;
      return { svg: s, box: [-30.9, -31, 26.7, 0] };
    } },
];
