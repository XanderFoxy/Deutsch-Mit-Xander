#!/usr/bin/env node
/* =====================================================================
   LÜBECK (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (Museum Holstentor „Digital Story“, Deutsche Stiftung
   Denkmalschutz „Holstentor“, structurae, Magazin Lübecker Bucht
   „Concordia domi foris pax“, visit-luebeck.com, sh-kunst.de „Christian
   Daniel Rauch: Wachender Löwe und Schlafender Löwe“, kudaba.de „Liegende
   Löwen in Lübeck“, myheimat.de „Lübecker Löwe … im Hintergrund
   Marienkirche, Holstentor und Petrikirche“):
   - STANDORT: die Grünanlage am Holstentorplatz, rund 82 m westlich vor
     der FELDSEITE des Holstentors (sie zeigt nach Westen), Blick nach
     Osten. Nachmittag: die Sonne steht im Südwesten hinter uns rechts;
     warmes Licht, lange Schatten fallen nach links hinten.
   - DIE LÖWEN: zwei lebensgroße gusseiserne Löwen von 1823 (Christian
     Daniel Rauch zugeschrieben), einer schläft, der andere wacht und
     schaut zum schlafenden; seit 1949 an der westlichen Schmalseite der
     Grünanlage, dem Holstentor gegenüber — also hier vorn bei uns.
   - HOLSTENTOR (1464–1478, Hinrich Helmstede; Backsteingotik; UNESCO-
     Welterbe seit 1987): Südturm, Nordturm und Mittelbau, vier Geschosse.
     Auf der Feldseite springen die Türme halbrund vor (3,5 m vor den
     Mittelbau), Kegeldächer aus Schiefer, der Mittelbau trägt einen
     Giebel. Rund 20 m hohes Mauerwerk. Feldseite: kaum Fenster, dafür
     Geschützscharten — je Turm drei Geschützkammern im Erdgeschoss, im
     1. und im 2. OG (im 2. OG stehen noch Kanonen). Mauerwerk aus roten
     und schwarz glasierten Ziegeln in wechselnden Lagen (im 19. Jh.
     großteils erneuert); zwei Terrakottabänder aus quadratischen Platten
     (55 cm); Kalkstein für Gesimse und die Stürze der unteren Scharten,
     Granit für die Konsolen der oberen. Über der rundbogigen Durchfahrt
     „CONCORDIA DOMI FORIS PAX“ (1871). Der Südturm ist im weichen Boden
     abgesackt und neigt sich — das „schiefe Tor“.
   - DAHINTER nach echten Richtungen: links die zwei Türme von ST. MARIEN
     (125 m, schlanke achteckige Kupferhelme über einem Kranz aus vier
     Giebeln, ≈ 500 m), rechts davon ST. PETRI (108 m, ≈ 410 m, mit
     Aussichtsplattform und Aufzug), rechts hinter dem Tor die
     SALZSPEICHER an der Obertrave (Backsteinspeicher 1579–1745, Treppen-
     und Schweifgiebel, leicht schief). Die Trave selbst liegt dahinter.
   - TYPISCH: Lübecker Marzipan (rote Verpackung mit Gold), Möwen von der
     Ostsee, Reisegruppen, Fahrräder, die Stadtfarben Weiß und Rot.
   UNSICHER (ohne Foto-Beleg, aus Fachwissen): die Form des Feldseiten-
   Giebels, die genaue Lage der Scharten und dunklen Lagen, die Sockel der
   Löwen. Die NEIGUNG DES SÜDTURMS ist mit 1,8° bewusst übertrieben, damit
   man das „schiefe Tor“ erkennt.
   Maßstab: Augenhöhe y = 178 (1,7 m), Brennweite 400 Einheiten. Am Boden
   gilt: Einheiten je Meter = (y − 178) / 1,7. Das Tor (82 m) hat 4,88
   Einheiten je Meter, Fuß bei y = 186,3.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");
globalThis.window = globalThis;
require(path.join(__dirname, "../../../bilderwelt-neu/figuren/mensch.js"));
const POSEN = globalThis.DMA_MENSCH.POSEN;

const S = neueSzene({ id: "luebeck", titel: "Lübeck", emoji: "🧱", thema: "Deutschland", kuerzel: "lbk", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1478);
const r = B.r;
const W = 400, HH = 260, HOR = 178, F = 400, AUGE = 1.7;
const km = (y) => (y - HOR) / AUGE;
const proj = (lat, d, h = 0) => [r(200 + lat * F / d), r(HOR + (AUGE - h) * F / d)];
const pfad = (pts) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("weich")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation=".6"/></filter>`);
/* Streiflicht von rechts (Sonne im Südwesten): Lichtkante INNEN an der rechten Kontur, Eigenschatten links */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("licht")}" x="-5%" y="-5%" width="110%" height="110%"><feOffset in="SourceAlpha" dx="-.15" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="rk"/><feFlood flood-color="#ffd9a0" flood-opacity=".75"/><feComposite in2="rk" operator="in" result="kante"/><feOffset in="SourceAlpha" dx=".5" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="lk"/><feGaussianBlur in="lk" stdDeviation=".35" result="lk2"/><feFlood flood-color="#1f1a24" flood-opacity=".38"/><feComposite in2="lk2" operator="in" result="eigen"/><feComposite in="eigen" in2="SourceAlpha" operator="in" result="eigen2"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="eigen2"/><feMergeNode in="kante"/></feMerge></filter>`);
const licht = (svg) => `<g filter="url(#${S.id("licht")})">${svg}</g>`;

/* Stoffe: Lübecker Backstein (tiefrot), schwarz glasierte Lagen, Schiefer, Kupfer */
const ZIEGEL = S.lg("ziegel", [[0, "#4e1c14"], [0.25, "#73301e"], [0.6, "#a6492b"], [0.82, "#c4643a"], [1, "#8e3c25"]], 0, 0, 1, 0);
const ZIEGEL_M = S.lg("ziegelm", [[0, "#6e2b1d"], [0.5, "#8f3d26"], [1, "#a14a2c"]], 0, 0, 1, 0);
const GLASUR = S.lg("glasur", [[0, "#0e0b0a"], [0.3, "#1f1714"], [0.62, "#3a2e28"], [0.8, "#56483d"], [1, "#241a16"]], 0, 0, 1, 0);
const TERRA = S.lg("terra", [[0, "#1d1512"], [0.6, "#3d2b22"], [0.8, "#5a4232"], [1, "#2c201a"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#1a2028"], [0.35, "#2b3540"], [0.65, "#4a5866"], [0.84, "#6d7b88"], [1, "#3b4652"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#2f6050"], [0.6, "#6aa58d"], [1, "#3f7a64"]], 0, 0, 1, 0);
const KUPFER_P = S.lg("kupferp", [[0, "#4a7f84"], [0.6, "#9cc9c6"], [1, "#5f9497"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#f0c64a"], [1, "#a8781a"]], 0, 0, 1, 1);
const KALK = "#e6dcc6";
const EISEN = S.lg("eisen", [[0, "#232326"], [0.5, "#38383b"], [0.85, "#5f5c55"], [1, "#3a3a3c"]], 0, 0, 1, 1);
/* Ziegelverband (Läufer, versetzt) als Muster in Tor-Einheiten */
S.def(`<pattern id="${S.id("verband")}" patternUnits="userSpaceOnUse" width="1.2" height=".76"><path d="M0 .38 H1.2 M0 .76 H1.2 M.6 0 V.38 M0 .38 V.76 M1.2 .38 V.76" stroke="#e7c3a3" stroke-width=".07" fill="none"/></pattern>`);
S.def(`<pattern id="${S.id("glanz")}" patternUnits="userSpaceOnUse" width="3.6" height=".76"><path d="M0 .38 H3.6 M.6 0 V.38 M1.8 .38 V.76 M3 0 V.38" stroke="#8a7a6a" stroke-width=".08" fill="none"/><rect x="2.1" y=".08" width=".5" height=".1" fill="#e6efe8" opacity=".55"/><rect x=".2" y=".46" width=".4" height=".08" fill="#d9e6dc" opacity=".4"/></pattern>`);
S.def(`<pattern id="${S.id("schuppen")}" patternUnits="userSpaceOnUse" width="1.6" height="1.1"><path d="M0 1.1 A.8 .7 0 0 1 1.6 1.1 M-.8 .55 A.8 .7 0 0 1 .8 .55 M.8 .55 A.8 .7 0 0 1 2.4 .55" stroke="#11161b" stroke-width=".14" fill="none"/></pattern>`);
{
  /* einzelne dunklere, hellere und ausgebesserte Ziegel (Brandfarben), unregelmäßig verteilt */
  const z = zufall(77);
  let p = "";
  for (let i = 0; i < 30; i++) { const row = Math.floor(z() * 10), col = Math.floor(z() * 6) + (row % 2 ? 0.5 : 0); p += `<rect x="${r(col * 1.2 + 0.05)}" y="${r(row * 0.38 + 0.05)}" width="1.1" height=".29" fill="${z() < 0.55 ? "#3a140d" : "#d27a52"}" opacity="${r(0.25 + z() * 0.3)}"/>`; }
  S.def(`<pattern id="${S.id("brand")}" patternUnits="userSpaceOnUse" width="7.2" height="3.8">${p}</pattern>`);
}

/* Schlagschatten: Sonne hinten rechts (SW), Höhe ≈ 30° — lange Schatten vom Betrachter weg nach links.
   Sie liegen auf dem Boden (Rasen/Weg) und werden dort beschnitten. */
const SCHATTEN = [];
const SONNE = { az: 40 * Math.PI / 180, lang: 3.0 };
const schlag = (lat, d, hoeheM, breiteM = 0.5, a = 0.52) => {
  const L = SONNE.lang * hoeheM, dl = -Math.sin(SONNE.az) * L, dd = Math.cos(SONNE.az) * L;
  const p = [[lat - breiteM / 2, d], [lat + breiteM / 2, d], [lat + dl + breiteM * 0.25, d + dd], [lat + dl - breiteM * 0.25, d + dd]].map(([a1, b1]) => proj(a1, b1));
  SCHATTEN.push(`<path d="${pfad(p)}" fill="#2a2a20" opacity="${a}"/>`);
};

/* Pfade verdichten: absolut runden (Raster q), dann relativ schreiben — keine Drift, kürzere Zahlen */
function pfadKurz(d, q) {
  const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);
  if (!tok) return d;
  const N = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const rd = (v) => Math.round(v / q) * q;
  const fmt = (v) => { let s = (Math.round(v * 1000) / 1000).toString(); if (s.startsWith("0.")) s = s.slice(1); else if (s.startsWith("-0.")) s = "-" + s.slice(2); return s; };
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, out = "", cmd = null;
  /* aktuelle Position im gerundeten Raster */
  let rx = 0, ry = 0, rsx = 0, rsy = 0;
  const num = () => parseFloat(tok[i++]);
  const join = (arr) => { let s = ""; for (const v of arr) { const t = fmt(v); s += (s && !t.startsWith("-") ? " " : "") + t; } return s; };
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    else if (cmd === null) return d;
    const C = cmd.toUpperCase(), rel = cmd !== C;
    if (C === "Z") { out += "z"; cx = sx; cy = sy; rx = rsx; ry = rsy; if (i < tok.length && !/[a-zA-Z]/.test(tok[i])) return d; continue; }
    const n = N[C]; if (n === undefined) return d;
    const a = []; for (let k = 0; k < n; k++) { if (i >= tok.length || /[a-zA-Z]/.test(tok[i])) return d; a.push(num()); }
    let p;
    if (C === "H") { const x = rel ? cx + a[0] : a[0]; cx = x; const X = rd(x); out += "h" + fmt(X - rx); rx = X; }
    else if (C === "V") { const y = rel ? cy + a[0] : a[0]; cy = y; const Y = rd(y); out += "v" + fmt(Y - ry); ry = Y; }
    else if (C === "A") {
      const x = rel ? cx + a[5] : a[5], y = rel ? cy + a[6] : a[6]; cx = x; cy = y; const X = rd(x), Y = rd(y);
      out += "a" + join([rd(a[0]), rd(a[1]), Math.round(a[2])]) + " " + (a[3] ? 1 : 0) + " " + (a[4] ? 1 : 0) + " " + join([X - rx, Y - ry]); rx = X; ry = Y;
    } else {
      const pts = [];
      for (let k = 0; k < n; k += 2) { const x = rel ? cx + a[k] : a[k], y = rel ? cy + a[k + 1] : a[k + 1]; pts.push([x, y]); }
      const end = pts[pts.length - 1];
      const R = pts.map(([x, y]) => [rd(x) - rx, rd(y) - ry]);
      out += (C === "M" ? "m" : C.toLowerCase()) + join(R.flat());
      cx = end[0]; cy = end[1]; rx = rd(cx); ry = rd(cy);
      if (C === "M") { sx = cx; sy = cy; rsx = rx; rsy = ry; cmd = rel ? "l" : "L"; }
    }
  }
  /* das erste m ist relativ zu 0,0 — das ist dasselbe wie absolut */
  return out;
}
function verdichteSVG(svg, q) {
  return svg.replace(/ d="([^"]+)"/g, (m, d) => ` d="${pfadKurz(d, q)}"`);
}
/* Mensch aus dem Baukasten, ohne runden Bodenschatten und ohne feinste Linien; Pfade fein (0,4 cm) und relativ */
function figur(spec, hoehe, q = 0.8) {
  const m = B.mensch(spec, hoehe);
  let z = m.z.svg.replace(/(<g class="mensch">(?:<defs>.*?<\/defs>)?)<ellipse[^>]*\/>/s, "$1");
  z = z.replace(/<path [^>]*\/>/g, (t) => (/fill="none"/.test(t) && +((t.match(/stroke-width="([\d.]+)"/) || [])[1] || 9) < 0.4) ? "" : t);
  z = verdichteSVG(z, q);
  return { svg: `<g transform="scale(${m.k.toFixed(4)})">${z}</g>`, inner: z, k: m.k, z: m.z };
}
/* kleine Figur in der Ferne, Lichtseite rechts, Körperschatten links */
function passant(x, y, h, o = {}) {
  const { hemd = "#3d5a80", hose = "#2f3640", haar = "#4a3426", haut = "#e3b796", schritt = 0.1, rueck = true } = o;
  const X = (f) => r(x + f * h), Y = (f) => r(y - f * h);
  let g = `<path d="M${X(-0.05)} ${Y(0.5)} L${X(-0.06 - schritt)} ${Y(0.02)} L${X(-0.01 - schritt)} ${Y(0.02)} L${X(0)} ${Y(0.4)} L${X(0.01 + schritt)} ${Y(0.02)} L${X(0.06 + schritt)} ${Y(0.02)} L${X(0.05)} ${Y(0.5)} Z" fill="${hose}"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(0.09)} ${Y(0.48)} Q${X(0.12)} ${Y(0.6)} ${X(0.11)} ${Y(0.82)} Q${X(0)} ${Y(0.85)} ${X(-0.11)} ${Y(0.82)} Z" fill="${hemd}"/>`;
  g += `<path d="M${X(-0.02)} ${Y(0.83)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(-0.03)} ${Y(0.48)} Q${X(-0.06)} ${Y(0.64)} ${X(-0.02)} ${Y(0.83)} Z" fill="#1a1620" opacity=".3"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.8)} L${X(-0.14)} ${Y(0.53)} M${X(0.11)} ${Y(0.8)} L${X(0.14)} ${Y(0.53)}" stroke="${hemd}" stroke-width="${r(0.055 * h)}" stroke-linecap="round"/>`;
  g += `<rect x="${X(-0.025)}" y="${Y(0.88)}" width="${r(0.05 * h)}" height="${r(0.06 * h)}" fill="${haut}"/><ellipse cx="${X(0)}" cy="${Y(0.93)}" rx="${r(0.06 * h)}" ry="${r(0.07 * h)}" fill="${haut}"/>`;
  g += rueck ? `<ellipse cx="${X(0)}" cy="${Y(0.94)}" rx="${r(0.064 * h)}" ry="${r(0.072 * h)}" fill="${haar}"/>` : `<path d="M${X(-0.064)} ${Y(0.93)} Q${X(-0.06)} ${Y(1.01)} ${X(0)} ${Y(1.005)} Q${X(0.06)} ${Y(1.01)} ${X(0.064)} ${Y(0.93)} Q${X(0.03)} ${Y(0.975)} ${X(-0.064)} ${Y(0.93)} Z" fill="${haar}"/>`;
  return g;
}
/* Wolke: klare Kontur, drei Tonstufen — warme Unterseite, Licht rechts oben */
function wolke(x, y, w, h, seed) {
  const z = zufall(seed), c = [];
  const n = Math.max(4, Math.round(w / 5));
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, hh = h * (0.45 + 0.55 * Math.sin(Math.PI * t)) * (0.7 + z() * 0.5); c.push([x - w / 2 + t * w, y - hh * 0.55, hh * 0.55]); }
  for (let i = 0; i < n - 1; i++) c.push([x - w / 2 + (i + 1) / n * w, y - h * 0.18, h * 0.32]);
  const id = S.id("wk" + seed);
  S.def(`<g id="${id}">${c.map(([a, b, rr]) => `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}"/>`).join("")}<rect x="${r(x - w / 2)}" y="${r(y - h * 0.3)}" width="${r(w)}" height="${r(h * 0.3)}" rx="${r(h * 0.15)}"/></g>`);
  const lage = (dx, dy, f, fill) => `<use href="#${id}" fill="${fill}" transform="translate(${r(x + dx)} ${r(y + dy)}) scale(${f}) translate(${r(-x)} ${r(-y)})"/>`;
  return `<g filter="url(#${S.id("weich")})">${lage(0, 0, 1, "#e9cdb6")}${lage(0.8, -1.4, 0.94, "#f8efe6")}${lage(2.2, -2.8, 0.76, "#fffaf0")}</g>`;
}
/* Laubkrone ohne Weichzeichner: Kern-Ellipse und Randbüschel (gekerbter Rand), eine Form, viermal per <use>
   (Schatten, Mitte, Licht, Glanz, Licht von der Seite lx); dunkle Astlücken, in denen ein Ast verschwindet */
function krone(x, cy, rx, ry, seed, o) {
  const { n = 16, rb = 0.22, lappen = 4, farben, lx = 1, bluete = false, rinde = "#3e3226" } = o;
  const z = zufall(seed), R = Math.min(rx, ry);
  let c = `<ellipse cx="${r(x)}" cy="${r(cy)}" rx="${r(rx * 0.86)}" ry="${r(ry * 0.84)}"/>`;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (z() - 0.5) * 0.4, f = 0.8 + z() * 0.22; c += `<circle cx="${r(x + Math.cos(a) * rx * f)}" cy="${r(cy + Math.sin(a) * ry * f)}" r="${r(R * rb * (0.7 + z() * 0.6))}"/>`; }
  for (let i = 0; i < lappen; i++) { const a = -Math.PI * (0.1 + z() * 0.8), f = 0.7 + z() * 0.2; c += `<circle cx="${r(x + Math.cos(a) * rx * f)}" cy="${r(cy + Math.sin(a) * ry * f)}" r="${r(R * (0.28 + z() * 0.12))}"/>`; }
  const id = S.id("kr" + seed);
  S.def(`<g id="${id}">${c}</g>`);
  const lage = (dx, dy, f, fill) => `<use href="#${id}" fill="${fill}" transform="translate(${r(x + dx)} ${r(cy + dy)}) scale(${f}) translate(${r(-x)} ${r(-cy)})"/>`;
  let g = lage(0, 0, 1, farben[0]) + lage(lx * R * 0.06, -R * 0.07, 0.9, farben[1]) + lage(lx * R * 0.17, -R * 0.18, 0.68, farben[2]) + lage(lx * R * 0.28, -R * 0.3, 0.4, farben[3]);
  /* Astlücken auf der Schattenseite und unten, mit einem Ast darin */
  for (let i = 0; i < 3; i++) {
    /* Lücken nur unten und auf der Schattenseite, wo die Krone ohnehin dunkel ist */
    const a = Math.PI * (lx > 0 ? 0.45 + i * 0.22 + z() * 0.1 : 0.55 - i * 0.22 - z() * 0.1), gx = x + Math.cos(a) * rx * 0.68, gy = cy + Math.sin(a) * ry * 0.6, w = R * (0.07 + z() * 0.04);
    g += `<path d="M${r(gx - w)} ${r(gy)} q${r(w * 0.3)} ${r(-w * 0.8)} ${r(w * 1.1)} ${r(-w * 0.6)} q${r(w * 0.9)} ${r(w * 0.1)} ${r(w * 0.8)} ${r(w * 0.7)} q${r(-w * 0.5)} ${r(w * 0.7)} ${r(-w * 1.2)} ${r(w * 0.5)} q${r(-w * 0.7)} ${r(-w * 0.2)} ${r(-w * 0.7)} ${r(-w * 0.6)} Z" fill="${farben[4] || "#16240f"}"/>`;
    g += `<path d="M${r(gx - w * 0.7)} ${r(gy + w * 0.5)} Q${r(gx)} ${r(gy - w * 0.05)} ${r(gx + w * 0.7)} ${r(gy - w * 0.4)}" stroke="${rinde}" stroke-width="${r(Math.max(0.3, R * 0.035))}" fill="none"/>`;
  }
  /* Kastanie: helle Blütenkerzen auf der Lichtseite */
  if (bluete) for (let i = 0; i < 12; i++) { const a = -Math.PI * (0.05 + z() * 0.9), f = 0.3 + z() * 0.6, bx = r(x + Math.cos(a) * rx * f), by = r(cy + Math.sin(a) * ry * f), bh = r(R * 0.09); g += `<path d="M${r(bx - bh * 0.3)} ${by} Q${bx} ${r(by - bh * 1.4)} ${r(bx + bh * 0.3)} ${by} Z" fill="#f6f1e2"/>`; }
  return g;
}
/* Bäume: Linde (eiförmig, fein gekerbt) und Kastanie (breit, grobe Lappen, dunkler, mit Blütenkerzen); Licht von rechts */
function baum(x, y, h, seed, art = "linde") {
  const li = art === "linde", kr = h * (li ? 0.3 : 0.37), cy = y - h * (li ? 0.66 : 0.6);
  let g = `<path d="M${r(x)} ${r(y - h * 0.44)} L${r(x - kr * 0.4)} ${r(cy + kr * 0.2)} M${r(x)} ${r(y - h * 0.47)} L${r(x + kr * 0.35)} ${r(cy + kr * 0.15)}" stroke="#3e3226" stroke-width="${r(h * 0.014)}"/>`;
  g += `<path d="M${r(x - h * 0.03)} ${y} L${r(x - h * 0.014)} ${r(y - h * 0.48)} L${r(x + h * 0.014)} ${r(y - h * 0.48)} L${r(x + h * 0.03)} ${y} Z" fill="#3e3226"/><path d="M${r(x + h * 0.005)} ${y} L${r(x + h * 0.006)} ${r(y - h * 0.46)} L${r(x + h * 0.014)} ${r(y - h * 0.46)} L${r(x + h * 0.03)} ${y} Z" fill="#6a5a46"/>`;
  return g + (li ? krone(x, cy, kr * 0.88, kr * 1.08, seed, { n: 24, rb: 0.15, lappen: 3, farben: ["#2f4a26", "#4a6c32", "#7d9e48", "#a8c26a"], lx: 1 })
    : krone(x, cy, kr * 1.22, kr * 0.8, seed, { n: 10, rb: 0.36, lappen: 5, farben: ["#1f3319", "#33502a", "#557a36", "#7c9c52", "#101a0b"], lx: 1, bluete: true }));
}

/* =====================================================================
   KULISSE — Nachmittagshimmel (zum Horizont pfirsich-golden), Altstadt im Dunst
   ===================================================================== */
S.hinten(`<rect width="${W}" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#5b8cc4"], [0.45, "#93b4d6"], [0.75, "#dfd8cc"], [1, "#f4d3a6"]])}"/>`);
S.hinten(`<circle cx="430" cy="150" r="180" fill="${S.rg("sonne", [[0, "#fff0c8", 0.65], [0.4, "#ffe0a0", 0.25], [1, "#ffe0a0", 0]])}"/>`);
S.hinten(wolke(78, 28, 46, 14, 3) + wolke(300, 20, 40, 12, 17) + wolke(368, 60, 24, 7, 31) + wolke(178, 46, 18, 5, 47));
{
  /* Altstadtsilhouette im Dunst: Giebel, Treppengiebel, ein Dachreiter */
  let c = "";
  const z = zufall(5);
  let x = 0;
  while (x < W) {
    const w2 = 5 + z() * 6, h = 7 + z() * 6, art = z();
    if (art < 0.35) { let p = `M${r(x)} ${HOR + 2} V${r(HOR - h)} `; for (let s = 1; s <= 3; s++) p += `H${r(x + s * w2 / 8)} V${r(HOR - h - s * 1.4)} `; p += `H${r(x + w2 - 3 * w2 / 8)} `; for (let s = 2; s >= 0; s--) p += `V${r(HOR - h - s * 1.4)} H${r(x + w2 - s * w2 / 8)} `; c += `<path d="${p}V${HOR + 2} Z" fill="#b08a7a"/>`; }
    else c += `<path d="M${r(x)} ${HOR + 2} V${r(HOR - h)} L${r(x + w2 / 2)} ${r(HOR - h - w2 * 0.75)} L${r(x + w2)} ${r(HOR - h)} V${HOR + 2} Z" fill="${z() < 0.5 ? "#a68072" : "#9b786c"}"/>`;
    if (z() < 0.12) c += `<path d="M${r(x + w2 / 2 - 0.5)} ${r(HOR - h - w2 * 0.6)} V${r(HOR - h - w2 * 0.6 - 6)} L${r(x + w2 / 2)} ${r(HOR - h - w2 * 0.6 - 9)} L${r(x + w2 / 2 + 0.5)} ${r(HOR - h - w2 * 0.6 - 6)} Z" fill="#7a9a8a"/>`;
    x += w2 + 0.4;
  }
  S.hinten(`<g opacity=".72">${c}</g><rect x="0" y="${HOR - 30}" width="${W}" height="34" fill="${S.lg("dunstband", [[0, "#ecdcc6", 0], [1, "#ecdcc6", 0.5]])}"/>`);
}

/* =====================================================================
   0 — DER WEG (Pflaster zur Durchfahrt) und DER RASEN (Grünanlage)
   ===================================================================== */
const TORD = 82;
const WEG = (d) => [proj(-2.1, d), proj(2.1, d)];
const WEGPFAD = (() => { const [a1, b1] = WEG(TORD), [a2, b2] = WEG(8.29); return `M${a1[0]} ${a1[1]} L${b1[0]} ${b1[1]} L${b2[0]} ${b2[1]} L${a2[0]} ${a2[1]} Z`; })();
S.def(`<clipPath id="${S.id("wegclip")}"><path d="${WEGPFAD}"/></clipPath>`);
S.def(`<clipPath id="${S.id("rasenclip")}"><path clip-rule="evenodd" d="M0 ${HOR} H${W} V${HH} H0 Z ${WEGPFAD}"/></clipPath>`);
let WEG_TEIL, RASEN_TEIL;
{
  let k = `<path d="${WEGPFAD}" fill="${S.lg("wegstein", [[0, "#a59a8b"], [1, "#bdb2a1"]])}"/>`;
  let i = 0;
  for (let d = TORD; d > 8.6; d /= 1.06, i++) {
    const [[x1, y1]] = WEG(d), [[x3, y3], [x4]] = WEG(d / 1.06), h = y3 - y1, s = km((y1 + y3) / 2);
    const st = Math.max(0.6, 0.14 * s), gap = Math.max(0.12, 0.025 * s);
    k += `<line x1="${x3}" y1="${r((y1 + y3) / 2)}" x2="${x4}" y2="${r((y1 + y3) / 2)}" stroke="${["#998d7d", "#aea291", "#a19584"][i % 3]}" stroke-width="${r(h * 0.82)}" stroke-dasharray="${r(st)} ${r(gap)}" stroke-dashoffset="${r((i * 7 % 10) / 10 * st)}" clip-path="url(#${S.id("wegclip")})"/>`;
  }
  k += `<path d="${WEGPFAD}" fill="${S.lg("weglicht", [[0, "#000", 0.1], [1, "#ffd9a0", 0.16]], 0, 0, 1, 0)}"/>`;
  WEG_TEIL = S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k });
}
{
  let k = `<g clip-path="url(#${S.id("rasenclip")})"><rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("rasen", [[0, "#7d9a4d"], [0.3, "#6b8f3e"], [1, "#55802f"]])}"/>`;
  for (let i = -16; i < 16; i++) {
    const kl = (v) => Math.max(0, Math.min(W, v));
    const [a1] = proj(i * 1.6, 80), [a2] = proj((i + 1) * 1.6, 80), [b1] = proj(i * 1.6, 8.29), [b2] = proj((i + 1) * 1.6, 8.29);
    if (b2 < 0 || b1 > W) continue;
    k += `<path d="M${kl(a1)} ${r(HOR + 8.3)} L${kl(a2)} ${r(HOR + 8.3)} L${kl(b2)} ${HH} L${kl(b1)} ${HH} Z" fill="${i % 2 ? "#c2d67a" : "#2f4a1a"}" opacity=".07"/>`;
  }
  let halme = "";
  for (let n = 0; n < 340; n++) { const y = HOR + 6 + Math.pow(rnd(), 0.7) * (HH - HOR - 6), x = rnd() * W, s = km(y) * 0.05; halme += `M${r(x)} ${r(y)} l${r((rnd() - 0.5) * s)} ${r(-s * (1 + rnd()))} `; }
  k += `<path d="${halme}" stroke="#3d6324" stroke-width=".35" opacity=".55" fill="none"/>`;
  for (let n = 0; n < 70; n++) {
    const y = HOR + 20 + Math.pow(rnd(), 0.6) * (HH - HOR - 22), x = rnd() * W, s = km(y) * 0.025;
    if (Math.abs(x - 200) < (y - HOR) * 2.5) continue;
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(s)}" fill="#f8f6ee"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(s * 0.4)}" fill="#f0c64a"/>`;
  }
  /* Schatten einer Baumkrone außerhalb des Bildes rechts (Sonne von rechts) */
  k += `<g filter="url(#bw_weich)" opacity=".28"><ellipse cx="366" cy="236" rx="32" ry="9" fill="#1a2a10"/><ellipse cx="340" cy="250" rx="30" ry="9" fill="#1a2a10"/><ellipse cx="376" cy="252" rx="22" ry="8" fill="#1a2a10"/></g>`;
  k += `<rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("rasenlicht", [[0, "#2a3a1a", 0.22], [0.5, "#000", 0], [1, "#ffd9a0", 0.18]], 0, 0, 1, 0)}"/>`;
  const [[a1x, a1y], [b1x, b1y]] = WEG(TORD), [[a2x, a2y], [b2x, b2y]] = WEG(8.29);
  k += `<path d="M${a1x} ${a1y} L${a2x} ${a2y}" stroke="#d6cdbb" stroke-width="1.2"/><path d="M${b1x} ${b1y} L${b2x} ${b2y}" stroke="#e2d9c6" stroke-width="1.2"/></g>`;
  RASEN_TEIL = S.teil({ id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k,
    tipp: "Rund um das Holstentor liegt eine Grünanlage. Hier machen viele Leute eine Pause." });
}

/* =====================================================================
   1 — DIE MARIENKIRCHE (zwei Türme, 125 m, ≈ 500 m) — Luftperspektive:
       scharf, aber blasser (Gruppen-Deckkraft)
   ===================================================================== */
{
  const K = F / 500, fuss = r(HOR + AUGE * K);
  let k = "";
  const MAR = S.lg("mar", [[0, "#6a2f22"], [0.55, "#93452f"], [1, "#b05e40"]], 0, 0, 1, 0);
  /* Westbau zwischen den Türmen mit Backsteinfugen, großem Westfenster und Giebel */
  k += `<rect x="40" y="${r(fuss - 46 * K)}" width="12" height="${r(46 * K)}" fill="#86402b"/>`;
  k += `<path d="M40 ${r(fuss - 46 * K)} L46 ${r(fuss - 60 * K)} L52 ${r(fuss - 46 * K)} Z" fill="#8f452d"/>`;
  let fu = "";
  for (let y = fuss - 2; y > fuss - 46 * K; y -= 1.4) fu += `M40 ${r(y)} H52 `;
  k += `<path d="${fu}" stroke="#6a2a1c" stroke-width=".18"/>`;
  k += `<path d="M43.6 ${r(fuss - 18 * K)} V${r(fuss - 36 * K)} L46 ${r(fuss - 42 * K)} L48.4 ${r(fuss - 36 * K)} V${r(fuss - 18 * K)} Z" fill="#2c1a16"/><path d="M46 ${r(fuss - 18 * K)} V${r(fuss - 40 * K)} M43.6 ${r(fuss - 30 * K)} H48.4" stroke="#a87a62" stroke-width=".3"/>`;
  k += `<circle cx="46" cy="${r(fuss - 52 * K)}" r="1.6" fill="#2c1a16" stroke="#a87a62" stroke-width=".3"/><path d="M44.8 ${r(fuss - 30 * K)} V${r(fuss - 36 * K)} M47.2 ${r(fuss - 30 * K)} V${r(fuss - 36 * K)}" stroke="#a87a62" stroke-width=".25"/><circle cx="46" cy="${r(fuss - 38.5 * K)}" r=".9" fill="none" stroke="#a87a62" stroke-width=".25"/>`;
  for (const cx of [34, 58]) {
    const w = 13.5 * K, mh = 74 * K, sp = 51 * K, top = fuss - mh;
    k += `<rect x="${r(cx - w / 2)}" y="${r(top)}" width="${r(w)}" height="${r(mh)}" fill="${MAR}"/>`;
    let zf = "";
    for (let y = top + 1; y < fuss; y += 1.3) zf += `M${r(cx - w / 2)} ${r(y)} h${r(w)} `;
    k += `<path d="${zf}" stroke="#5a2418" stroke-width=".15" opacity=".7"/>`;
    k += `<rect x="${r(cx - w / 2)}" y="${r(top)}" width="1" height="${r(mh)}" fill="#5e2a1e"/><rect x="${r(cx + w / 2 - 1)}" y="${r(top)}" width="1" height="${r(mh)}" fill="#c06a4e"/>`;
    for (let j = 0; j < 8; j++) k += `<rect x="${r(cx - w / 2)}" y="${r(top + j * 6.6 - 0.25)}" width="${r(w)}" height=".5" fill="#d0a684" opacity=".6"/>`;
    for (let j = 0; j < 7; j++) {
      const y = top + 1.1 + j * 6.6;
      for (const dx of [-2.6, 0, 2.6]) { if (j > 1 && dx === 0) continue; k += `<path d="M${r(cx + dx - 0.75)} ${r(y + 4.9)} V${r(y + 1.3)} L${r(cx + dx)} ${r(y)} L${r(cx + dx + 0.75)} ${r(y + 1.3)} V${r(y + 4.9)} Z" fill="${j < 2 ? "#24130f" : "#5e2a1e"}"/>`; }
    }
    k += `<circle cx="${cx}" cy="${r(top + 15.8)}" r="1.5" fill="#1d2a24" stroke="#c9a640" stroke-width=".3"/>`;
    /* Kranz aus vier Giebeln am Helmfuß (zwei von vorn, zwei halb von der Seite), schlanker achteckiger Helm mit Graten */
    k += `<path d="M${r(cx - w / 2)} ${r(top)} L${r(cx - w / 4)} ${r(top - 5)} L${r(cx)} ${r(top)} L${r(cx + w / 4)} ${r(top - 5)} L${r(cx + w / 2)} ${r(top)} Z" fill="#9a4a30"/>`;
    k += `<path d="M${r(cx - w / 2)} ${r(top)} L${r(cx - w / 4)} ${r(top - 5)} M${r(cx)} ${r(top)} L${r(cx + w / 4)} ${r(top - 5)} L${r(cx + w / 2)} ${r(top)}" stroke="#d9a07a" stroke-width=".35" fill="none"/>`;
    k += `<path d="M${r(cx - w * 0.34)} ${r(top - 2.6)} L${r(cx - 0.25)} ${r(top - sp)} L${r(cx + 0.25)} ${r(top - sp)} L${r(cx + w * 0.34)} ${r(top - 2.6)} Z" fill="${KUPFER}"/>`;
    k += `<path d="M${r(cx - w * 0.12)} ${r(top - 2.6)} L${r(cx)} ${r(top - sp)} M${r(cx + w * 0.12)} ${r(top - 2.6)} L${r(cx)} ${r(top - sp)}" stroke="#2a5444" stroke-width=".25"/>`;
    k += `<path d="M${r(cx + w * 0.12)} ${r(top - 2.6)} L${r(cx + 0.1)} ${r(top - sp)} L${r(cx + w * 0.34)} ${r(top - 2.6)} Z" fill="#a9d8c2" opacity=".35"/>`;
    k += `<path d="M${r(cx)} ${r(top - sp)} V${r(top - sp - 3.4)} M${r(cx - 0.9)} ${r(top - sp - 2.3)} H${r(cx + 0.9)}" stroke="#c9a640" stroke-width=".4"/><circle cx="${r(cx)}" cy="${r(top - sp - 0.6)}" r=".55" fill="${GOLD}"/>`;
  }
  S.teil({ id: "marienkirche", de: "die Marienkirche", syl: "ma-RI-en-kir-che", it: "la chiesa di Santa Maria", itSyl: "CHIE-sa di SAN-ta ma-RI-a", en: "St Mary's Church",
    x: 0, y: 0, kunst: `<g opacity=".74">${k}</g>`, tipp: "Die Türme der Marienkirche sind 125 Meter hoch. Viele Kirchen an der Ostsee sind nach ihrem Vorbild gebaut." });
}

/* =====================================================================
   2 — DIE PETRIKIRCHE (ein breiterer Turm, 108 m, Aussichtsplattform)
   ===================================================================== */
{
  const K = F / 410, fuss = HOR + AUGE * K, cx = 98;
  const w = 15 * K, mh = 58 * K, sp = 46 * K, top = fuss - mh;
  let k = `<rect x="${r(cx - w / 2)}" y="${r(top)}" width="${r(w)}" height="${r(mh)}" fill="${S.lg("pet", [[0, "#6e3326"], [0.6, "#9c4a30"], [1, "#b46040"]], 0, 0, 1, 0)}"/>`;
  let zf = "";
  for (let y = top + 1; y < fuss; y += 1.3) zf += `M${r(cx - w / 2)} ${r(y)} h${r(w)} `;
  k += `<path d="${zf}" stroke="#5a2418" stroke-width=".15" opacity=".7"/>`;
  for (let j = 0; j < 5; j++) {
    const y = top + 3 + j * 7;
    for (const dx of [-4.2, -1.4, 1.4, 4.2]) k += `<path d="M${r(cx + dx - 0.65)} ${r(y + 4.6)} V${r(y + 1)} Q${r(cx + dx)} ${r(y - 0.2)} ${r(cx + dx + 0.65)} ${r(y + 1)} V${r(y + 4.6)} Z" fill="${j === 0 ? "#2c1712" : "#5a2a1f"}"/>`;
  }
  /* Aussichtsplattform: auskragende Galerie mit Geländer, oben stehen Leute */
  k += `<rect x="${r(cx - w / 2 - 1.2)}" y="${r(top - 1)}" width="${r(w + 2.4)}" height="1.2" fill="#e3d8c6"/><rect x="${r(cx - w / 2 - 1.2)}" y="${r(top + 0.2)}" width="${r(w + 2.4)}" height=".5" fill="#2a1a14" opacity=".5"/>`;
  k += `<path d="M${r(cx - w / 2 - 1.2)} ${r(top - 3.2)} H${r(cx + w / 2 + 1.2)}" stroke="#2a2a2a" stroke-width=".35"/>`;
  for (let x = cx - w / 2 - 1; x <= cx + w / 2 + 1; x += 1) k += `<path d="M${r(x)} ${r(top - 3.2)} V${r(top - 1)}" stroke="#2a2a2a" stroke-width=".15"/>`;
  for (const [dx, c] of [[-5.4, "#3d5a80"], [-4.4, "#b8473a"], [3.6, "#e8e4dc"], [4.6, "#2f5a35"]]) k += `<rect x="${r(cx + dx)}" y="${r(top - 3.6)}" width=".7" height="2" fill="${c}"/><circle cx="${r(cx + dx + 0.35)}" cy="${r(top - 4)}" r=".38" fill="#e3b796"/>`;
  /* Helm: hellerer, bläulicher Kupferton, setzt hinter der Galerie an, mit kleinen Gauben */
  k += `<path d="M${r(cx - w * 0.36)} ${r(top - 1)} L${r(cx - 0.3)} ${r(top - sp)} L${r(cx + 0.3)} ${r(top - sp)} L${r(cx + w * 0.36)} ${r(top - 1)} Z" fill="${KUPFER_P}"/>`;
  k += `<path d="M${r(cx + w * 0.1)} ${r(top - 1)} L${r(cx + 0.1)} ${r(top - sp)} L${r(cx + w * 0.36)} ${r(top - 1)} Z" fill="#d6f0ec" opacity=".3"/>`;
  for (const t of [0.25, 0.45]) k += `<path d="M${r(cx - 1)} ${r(top - sp * t)} l1 -1.6 l1 1.6 Z" fill="#3f6f72"/>`;
  k += `<path d="M${r(cx)} ${r(top - sp)} V${r(top - sp - 3)}" stroke="#c9a640" stroke-width=".35"/><circle cx="${r(cx)}" cy="${r(top - sp - 3.2)}" r=".5" fill="${GOLD}"/>`;
  S.teil({ id: "petrikirche", de: "die Petrikirche", syl: "PE-tri-kir-che", it: "la chiesa di San Pietro", itSyl: "CHIE-sa di san PIE-tro", en: "St Peter's Church",
    x: 0, y: 0, kunst: `<g opacity=".8">${k}</g>`, tipp: "Auf den Turm der Petrikirche fährt ein Aufzug. Von der Plattform sieht man die ganze Altstadt." });
}

/* =====================================================================
   3 — DIE SALZSPEICHER (rechts hinter dem Tor, ≈ 210 m) — Lupe: der Treppengiebel
   ===================================================================== */
const SPEICHER = { x0: 290, d: 210 };
{
  const K = F / SPEICHER.d, fuss = r(HOR + AUGE * K);
  let k = "";
  const haeuser = [
    { w: 10, h: 11.5, g: 10, art: "treppe", f: "#9c4a30", achsen: 3, lean: -1.4, stufen: 6, fw: 1.4, fh: 2.0, rh: 3.2, auf: "" },
    { w: 13, h: 12, g: 11, art: "schweif", f: "#a5553a", achsen: 4, lean: 1.2, stufen: 3, fw: 1.2, fh: 2.6, rh: 3.6, auf: "obelisk" },
    { w: 10.5, h: 10.5, g: 9.5, art: "treppe", f: "#8e4229", achsen: 2, lean: -1.0, stufen: 5, fw: 1.7, fh: 1.8, rh: 3.0, auf: "" },
    { w: 13.5, h: 12.5, g: 11.5, art: "schweif", f: "#ab5a3c", achsen: 5, lean: 1.5, stufen: 3, fw: 1.1, fh: 2.3, rh: 3.4, auf: "muschel" },
  ];
  let x = SPEICHER.x0;
  let TG = null;
  const dirK = (hs) => (hs.lean > 0 ? 1 : -1);
  haeuser.forEach((hs) => {
    const w = hs.w * K, h = hs.h * K, g = hs.g * K, top = fuss - h;
    let p = `M${r(x)} ${fuss} V${r(top)} `, ges = "";
    const n = hs.stufen;
    if (hs.art === "treppe") {
      for (let s = 0; s < n; s++) { const yy = top - (s + 1) * g / (n + 0.5); p += `L${r(x + s * w / 2 / n)} ${r(yy)} L${r(x + (s + 1) * w / 2 / n)} ${r(yy)} `; ges += `M${r(x + s * w / 2 / n - 0.3)} ${r(yy)} h${r(w / 2 / n + 0.3)} `; }
      p += `L${r(x + w / 2)} ${r(top - g)} `;
      for (let s = n - 1; s >= 0; s--) { const yy = top - (s + 1) * g / (n + 0.5); p += `L${r(x + w - (s + 1) * w / 2 / n)} ${r(yy)} L${r(x + w - s * w / 2 / n)} ${r(yy)} `; ges += `M${r(x + w - (s + 1) * w / 2 / n)} ${r(yy)} h${r(w / 2 / n + 0.3)} `; }
    } else {
      /* Schweifgiebel: drei Stufen; jede Stufe mit Kehle (Volute) an der Seite, Volutenrolle unten außen,
         waagerechte Gesimse; oben ein Aufsatz */
      const st = [[0, 0.36, 0.0, 0.16], [0.36, 0.7, 0.16, 0.3], [0.7, 1, 0.3, 0.42]];
      const rollen = [];
      for (const [a, b, e0, e1] of st) {
        const ya = top - a * g, yb = top - b * g, xa = x + e0 * w, xb = x + e1 * w;
        p += `L${r(xa)} ${r(ya)} L${r(xa + (xb - xa) * 0.25)} ${r(ya)} C${r(xb - (xb - xa) * 0.05)} ${r(ya - (ya - yb) * 0.1)} ${r(xb)} ${r(ya - (ya - yb) * 0.55)} ${r(xb)} ${r(yb)} `;
        ges += `M${r(x + e0 * w - 0.6)} ${r(ya)} H${r(x + w - e0 * w + 0.6)} `;
        rollen.push([xa + (xb - xa) * 0.3, ya - 0.9], [x + w - e0 * w - (xb - xa) * 0.3, ya - 0.9]);
      }
      p += `L${r(x + w * 0.58)} ${r(top - g)} `;
      for (const [a, b, e0, e1] of st.slice().reverse()) {
        const ya = top - a * g, yb = top - b * g, xa = x + w - e0 * w, xb = x + w - e1 * w;
        p += `L${r(xb)} ${r(yb)} C${r(xb)} ${r(ya - (ya - yb) * 0.55)} ${r(xb + (xa - xb) * 0.05)} ${r(ya - (ya - yb) * 0.1)} ${r(xa - (xa - xb) * 0.25)} ${r(ya)} L${r(xa)} ${r(ya)} `;
      }
      ges += `M${r(x + w * 0.4)} ${r(top - g)} H${r(x + w * 0.6)} `;
      for (const [rx, ry] of rollen) ges += `M${r(rx + 1)} ${r(ry)} a1 1 0 1 0 -1.4 .9 a.7 .7 0 1 0 .6 -1.2 a.4 .4 0 1 0 .1 .6 `;
    }
    p += `L${r(x + w)} ${r(top)} V${fuss} Z`;
    let t = `<path d="${p}" fill="${hs.f}"/>`;
    let zf = "";
    for (let y = fuss - 1.2; y > top + 0.5; y -= 1.2) zf += `M${r(x)} ${r(y)} h${r(w)} `;
    t += `<path d="${zf}" stroke="#5a2418" stroke-width=".12" opacity=".6"/>`;
    t += `<path d="${ges}" stroke="#e3cfae" stroke-width=".45" fill="none"/>`;
    if (hs.auf === "obelisk") t += `<path d="M${r(x + w / 2 - 0.9)} ${r(top - g)} L${r(x + w / 2)} ${r(top - g - 4)} L${r(x + w / 2 + 0.9)} ${r(top - g)} Z" fill="#c9b08a"/><circle cx="${r(x + w / 2)}" cy="${r(top - g - 4.3)}" r=".5" fill="#c9b08a"/>`;
    if (hs.auf === "muschel") t += `<path d="M${r(x + w / 2 - 2)} ${r(top - g)} A2 2 0 0 1 ${r(x + w / 2 + 2)} ${r(top - g)} Z" fill="#c9b08a"/><path d="M${r(x + w / 2)} ${r(top - g)} l-1.4 -1.4 M${r(x + w / 2)} ${r(top - g)} v-2 M${r(x + w / 2)} ${r(top - g)} l1.4 -1.4" stroke="#8a6a4a" stroke-width=".25"/>`;
    /* Licht von rechts auf der Giebelwand */
    t += `<path d="${p}" fill="${S.lg("spl", [[0, "#2a0f08", 0.28], [0.5, "#000", 0], [1, "#ffcf8f", 0.2]], 0, 0, 1, 0)}"/>`;
    /* Ladeluken (rotbraune Holzläden) in der Mittelachse, je Speicher eigene Achszahl, unten Tore */
    let oberst = fuss;
    for (let row = 0; row < 8; row++) {
      const yy = fuss - 4.6 - row * hs.rh;
      if (yy < top - g * 0.7) break;
      const im = yy < top, na = im ? 1 : hs.achsen;
      for (let j = 0; j < na; j++) {
        const xx = na === 1 ? x + w / 2 : x + w * ((j + 0.5) / na);
        if (Math.abs(xx - (x + w / 2)) < w / (na * 2) && na % 2 === 1 && !im) continue;
        t += `<rect x="${r(xx - hs.fw / 2)}" y="${r(yy - hs.fh)}" width="${hs.fw}" height="${hs.fh}" fill="#2a1d18"/><rect x="${r(xx - hs.fw / 2 - 0.2)}" y="${r(yy - hs.fh - 0.3)}" width="${r(hs.fw + 0.4)}" height=".35" fill="#e3cfae"/>`;
      }
      /* Ladeluke in der Mittelachse: breiter, dunkelrote Holzläden mit hellem Rahmen */
      if (!im || row % 2 === 0) { const lb = 2.2; t += `<rect x="${r(x + w / 2 - lb / 2 - 0.25)}" y="${r(yy - 2.65)}" width="${r(lb + 0.5)}" height="2.9" fill="#e3cfae"/><rect x="${r(x + w / 2 - lb / 2)}" y="${r(yy - 2.4)}" width="${lb}" height="2.4" fill="#6a1e14"/><path d="M${r(x + w / 2)} ${r(yy - 2.4)} V${yy}" stroke="#2a0e08" stroke-width=".3"/>`; oberst = yy - 2.65; }
    }
    /* Kranbalken über der obersten Luke */
    t += `<path d="M${r(x + w / 2)} ${r(oberst - 0.6)} h${r(dirK(hs) * 2.4)}" stroke="#3a2418" stroke-width=".8"/><path d="M${r(x + w / 2 + dirK(hs) * 2.2)} ${r(oberst - 0.6)} v1.6" stroke="#2a2a2a" stroke-width=".25"/>`;
    t += `<path d="M${r(x + w / 2 - 2)} ${fuss} V${r(fuss - 2.4)} A2 2 0 0 1 ${r(x + w / 2 + 2)} ${r(fuss - 2.4)} V${fuss} Z" fill="#e3cfae"/><path d="M${r(x + w / 2 - 1.6)} ${fuss} V${r(fuss - 2.4)} A1.6 1.6 0 0 1 ${r(x + w / 2 + 1.6)} ${r(fuss - 2.4)} V${fuss} Z" fill="#4a2a18"/><path d="M${r(x + w / 2)} ${r(fuss - 4)} V${fuss}" stroke="#2a160c" stroke-width=".3"/>`;
    for (const ax of [0.2, 0.5, 0.8]) t += `<path d="M${r(x + w * ax - 0.5)} ${r(top + 1)} h1" stroke="#2a2420" stroke-width=".3"/>`;
    k += `<g transform="rotate(${hs.lean} ${r(x + w / 2)} ${fuss})">${t}</g>`;
    if (hs.art === "treppe" && !TG) TG = { x: x + w / 2, y: top, w, g, lean: hs.lean };
    x += w + 0.3;
  });
  S.teil({ id: "salzspeicher", de: "der Salzspeicher", syl: "SALZ-spei-cher", it: "il magazzino del sale", itSyl: "ma-gaz-ZI-no del SA-le", en: "salt warehouse",
    x: 0, y: 0, kunst: `<g opacity=".88">${k}</g>`, tipp: "In den Salzspeichern lagerte früher Salz aus Lüneburg. Die Hanse verkaufte es bis nach Skandinavien.",
    zoom: { x: SPEICHER.x0 - 6, y: r(fuss - 54), w: 112, h: 75 },
    unter: [
      { id: "treppengiebel", de: "der Treppengiebel", syl: "TREP-pen-gie-bel", it: "il frontone a gradini", itSyl: "fron-TO-ne a gra-DI-ni", en: "stepped gable", x: r(TG.x), y: r(TG.y), kunst: flaeche(-TG.w / 2, -TG.g, TG.w, TG.g + 2, 0.5),
        tipp: "Viele alte Häuser in Lübeck haben einen Treppengiebel: Die Kante sieht aus wie eine Treppe." },
    ] });
}

/* =====================================================================
   4 — DIE BÄUME der Wallanlagen (Linden und Kastanien) und vorn rechts ein Zweig
   ===================================================================== */
{
  let k = "";
  for (const [x, d, h, s, art] of [[24, 140, 15, 3, "linde"], [56, 150, 14, 5, "kastanie"], [88, 130, 17, 7, "linde"], [120, 125, 14, 11, "kastanie"], [278, 120, 14, 13, "linde"], [384, 118, 11, 19, "kastanie"]]) {
    const K = F / d, y = r(HOR + AUGE * K);
    k += baum(x, y, h * K, s, art);
  }
  k += `<path d="M0 ${HOR + 3} Q60 ${HOR - 2} 130 ${HOR + 2} L130 ${HOR + 6} L0 ${HOR + 7} Z" fill="#3c5a2a"/><path d="M262 ${HOR + 3} Q330 ${HOR - 1} 400 ${HOR + 1} L400 ${HOR + 6} L262 ${HOR + 6} Z" fill="#3c5a2a"/>`;
  k += `<path d="M0 ${HOR + 3} Q60 ${HOR - 2} 130 ${HOR + 2}" stroke="#6d8f45" stroke-width=".8" fill="none"/>`;
  /* Zweig eines nahen Baumes ragt oben rechts ins Bild (Rahmen) */
  let z2 = `<path d="M400 2 Q384 8 366 6 M388 6 Q380 14 372 18" stroke="#2e241a" stroke-width="1.2" fill="none"/>`;
  const zz = zufall(91);
  for (let i = 0; i < 26; i++) { const t = zz(), xx = 400 - t * 36, yy = 4 + t * 6 + (zz() - 0.5) * 14; if (yy < 1) continue; z2 += `<ellipse cx="${r(xx)}" cy="${r(yy)}" rx="${r(2.4 + zz() * 1.4)}" ry="1.3" fill="${zz() < 0.5 ? "#2f4a22" : "#4a6c32"}" transform="rotate(${r(-30 + zz() * 60)} ${r(xx)} ${r(yy)})"/>`; }
  S.davor(z2);
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   5 — DAS HOLSTENTOR (Feldseite) — Lupe: Turm (Südturm, schief),
       Kegeldach, Inschrift, Durchfahrt, Schießscharte, Kanone, Fries, Backstein
   ===================================================================== */
const GD = TORD, GK = F / GD, GX = 200, GY = r(HOR + AUGE * GK);
const M = (m) => r(m * GK);
const TURM = { R: 5.8, cx: 10.4, H: 20, kegel: 12.4, Rk: 6.45 };
const NEIG = 1.8;                                /* Grad, bewusst übertrieben */
const bogen = (h, R) => r((h - AUGE) * F * R / (GD * GD));
/* Punkt auf dem geneigten Südturm (lokal x, Höhe h in m) → Bild */
const sued = (xm, hm) => { const a = NEIG * Math.PI / 180, x = M(xm) + M(TURM.R), y = -M(hm); return { x: r(GX + M(TURM.cx) - M(TURM.R) + x * Math.cos(a) - y * Math.sin(a)), y: r(GY + x * Math.sin(a) + y * Math.cos(a)) }; };
let TOR_UNTER = [];
const SCHARTE = { nord: [[-50, 2.4], [6, 2.7], [56, 2.5], [-46, 8.1], [8, 7.9], [58, 8.2], [-54, 14.9], [2, 15.0], [50, 14.8]], sued: [[-58, 2.6], [-4, 2.4], [48, 2.7], [-52, 8.0], [-2, 8.2], [52, 7.9], [-48, 14.8], [4, 15.0], [54, 14.9]] };
{
  let k = "";
  /* ---------- Mittelbau (liegt 3,5 m hinter den Turmfronten) ---------- */
  const mw = 4.7, mh = 19.2, gh = 7.6;
  let mb = `<rect x="${-M(mw + 1.6)}" y="${-M(mh)}" width="${M(2 * mw + 3.2)}" height="${M(mh)}" fill="#5e2419"/>`;
  mb += `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(mh)}" fill="${ZIEGEL_M}"/>`;
  mb += `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(mh)}" fill="url(#${S.id("verband")})" opacity=".35"/>`;
  mb += `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(mh)}" fill="url(#${S.id("brand")})"/>`;
  for (const [h, d] of [[3.2, 0.42], [10.4, 0.36], [11.9, 0.48], [17.2, 0.4]]) mb += `<rect x="${-M(mw)}" y="${-M(h + d)}" width="${M(2 * mw)}" height="${M(d)}" fill="${GLASUR}"/><rect x="${-M(mw)}" y="${-M(h + d)}" width="${M(2 * mw)}" height="${M(d)}" fill="url(#${S.id("glanz")})"/>`;
  /* Giebel: feine Stufen mit hellen Abdeckungen, Spitzbogen-Blenden mit hellem Putzgrund, kleine Fialen */
  const st = 6;
  const sy = (s) => mh + (s + 1) * gh / (st + 0.5);
  let gp = `M${-M(mw)} ${-M(mh)} `, cap = "";
  for (let s = 0; s < st; s++) { gp += `L${-M(mw - s * mw / st)} ${-M(sy(s))} L${-M(mw - (s + 1) * mw / st)} ${-M(sy(s))} `; cap += `M${r(-M(mw - s * mw / st) - 0.3)} ${-M(sy(s))} H${-M(mw - (s + 1) * mw / st)} `; }
  gp += `L0 ${-M(mh + gh)} `;
  for (let s = st - 1; s >= 0; s--) { gp += `L${M(mw - (s + 1) * mw / st)} ${-M(sy(s))} L${M(mw - s * mw / st)} ${-M(sy(s))} `; cap += `M${M(mw - (s + 1) * mw / st)} ${-M(sy(s))} H${r(M(mw - s * mw / st) + 0.3)} `; }
  gp += `L${M(mw)} ${-M(mh)} Z`;
  mb += `<path d="${gp}" fill="${ZIEGEL_M}"/><path d="${gp}" fill="url(#${S.id("verband")})" opacity=".3"/>`;
  mb += `<path d="${cap}" stroke="#d9c9a8" stroke-width=".7" fill="none"/>`;
  for (const [dx, hh] of [[-3.0, 2.6], [-1.5, 4.0], [0, 5.4], [1.5, 4.0], [3.0, 2.6]]) mb += `<path d="M${M(dx - 0.42)} ${-M(mh + 0.5)} V${-M(mh + hh - 0.45)} L${M(dx)} ${-M(mh + hh)} L${M(dx + 0.42)} ${-M(mh + hh - 0.45)} V${-M(mh + 0.5)} Z" fill="#e8dcc4" stroke="#5a2418" stroke-width=".35"/>`;
  for (const s of [1, 3]) for (const sg of [-1, 1]) { const xx = sg * M(mw - (s + 1) * mw / st), yy = -M(sy(s)); mb += `<path d="M${r(xx - 0.5)} ${yy} L${xx} ${r(yy - 3)} L${r(xx + 0.5)} ${yy} Z" fill="#7a3020"/>`; }
  mb += `<path d="M0 ${-M(mh + gh)} V${-M(mh + gh + 1.6)}" stroke="#2a2420" stroke-width=".5"/><circle cx="0" cy="${-M(mh + gh + 1.7)}" r=".7" fill="${GOLD}"/>`;
  /* Scharten des Mittelbaus (schmal, Kalksteinsturz) */
  for (const dx of [-2.2, 2.2]) mb += `<rect x="${M(dx - 0.22)}" y="${-M(13.6)}" width="${M(0.44)}" height="${M(1.6)}" fill="#160d0a"/><rect x="${M(dx - 0.55)}" y="${-M(13.85)}" width="${M(1.1)}" height="${M(0.28)}" fill="${KALK}"/><rect x="${M(dx - 0.55)}" y="${r(-M(13.57))}" width="${M(1.1)}" height=".4" fill="#2a1410" opacity=".5"/>`;
  for (const dx of [-2.8, 0, 2.8]) mb += `<rect x="${M(dx - 0.18)}" y="${-M(16.6)}" width="${M(0.36)}" height="${M(1.1)}" fill="#160d0a"/>`;
  /* Ausblühungen unter dem Inschriftband */
  mb += `<rect x="${-M(4.3)}" y="${-M(7.9)}" width="${M(8.6)}" height="${M(1.4)}" fill="${S.lg("bluete", [[0, "#efe6d6", 0.35], [1, "#efe6d6", 0]])}"/>`;
  mb += `<rect x="${-M(4.3)}" y="${-M(9.15)}" width="${M(8.6)}" height="${M(1.25)}" fill="#2a1a15"/><rect x="${-M(4.3)}" y="${-M(9.15)}" width="${M(8.6)}" height=".25" fill="#c9a640" opacity=".7"/><rect x="${-M(4.3)}" y="${-M(7.9) - 0.25}" width="${M(8.6)}" height=".25" fill="#c9a640" opacity=".7"/>`;
  mb += `<text x="0" y="${r(-M(8.2))}" font-size="2.3" text-anchor="middle" fill="${GOLD}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" textLength="${M(8.1)}" lengthAdjust="spacingAndGlyphs">CONCORDIA DOMI FORIS PAX</text>`;
  /* Durchfahrt: Rundbogen, zweifach gestuftes Gewände aus Formziegeln, innen dunkel, hinten die Stadt im Licht */
  const bw = 2.15, bh = 4.4;
  for (const [o, f] of [[0.75, "#8a3a26"], [0.4, "#5e2419"], [0, "#120c0a"]]) mb += `<path d="M${-M(bw + o)} 0 V${-M(bh)} A${M(bw + o)} ${M(bw + o)} 0 0 1 ${M(bw + o)} ${-M(bh)} V0 Z" fill="${f}"/>`;
  for (let a = 185; a < 360; a += 10) { const ra = a * Math.PI / 180; mb += `<path d="M${r(Math.cos(ra) * M(bw + 0.4))} ${r(-M(bh) + Math.sin(ra) * M(bw + 0.4))} L${r(Math.cos(ra) * M(bw + 0.75))} ${r(-M(bh) + Math.sin(ra) * M(bw + 0.75))}" stroke="#4a1a12" stroke-width=".25"/>`; }
  mb += `<path d="M${-M(1.1)} 0 V${-M(bh - 0.6)} A${M(1.1)} ${M(1.1)} 0 0 1 ${M(1.1)} ${-M(bh - 0.6)} V0 Z" fill="${S.lg("stadtlicht", [[0, "#f3dcb0"], [1, "#b98a5c"]])}" opacity=".85"/>`;
  mb += `<path d="M${-M(0.5)} 0 L${-M(0.3)} ${-M(1.9)} L${M(0.3)} ${-M(1.9)} L${M(0.5)} 0 Z" fill="#4a3a30" opacity=".55"/>`;
  mb += `<path d="M${-M(bw + 0.75)} ${-M(bh)} A${M(bw + 0.75)} ${M(bw + 0.75)} 0 0 1 ${M(bw + 0.75)} ${-M(bh)}" stroke="${KALK}" stroke-width=".5" fill="none" opacity=".75"/>`;
  /* Schlagschatten des Südturms auf den Mittelbau (nur auf der Wand) */
  mb += `<path d="M${M(mw)} ${-M(mh)} L${M(2.4)} ${-M(mh)} L${M(1.4)} 0 L${M(mw)} 0 Z" fill="#2a0f08" opacity=".3"/>`;
  /* Grauschleier unter der Traufe */
  mb += `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(2)}" fill="${S.lg("traufe", [[0, "#2a2a2a", 0.3], [1, "#2a2a2a", 0]])}"/>`;
  k += mb;

  /* ---------- die beiden Rundtürme ---------- */
  const turm = (seite) => {
    const R = M(TURM.R), Hh = M(TURM.H), cx = seite * M(TURM.cx);
    let t = "";
    const ring = (h) => bogen(h, TURM.R);
    const band = (h0, h1, fill, op = 1) => `<path d="M${-R} ${-M(h1)} A${R} ${ring(h1)} 0 0 1 ${R} ${-M(h1)} V${-M(h0)} A${R} ${ring(h0)} 0 0 0 ${-R} ${-M(h0)} Z" fill="${fill}" opacity="${op}"/>`;
    const koerper = `M${-R} 0 V${-Hh} A${R} ${ring(TURM.H)} 0 0 1 ${R} ${-Hh} V0 Z`;
    t += `<path d="${koerper}" fill="${ZIEGEL}"/>`;
    t += `<path d="${koerper}" fill="url(#${S.id("verband")})" opacity=".32"/>`;
    t += `<path d="${koerper}" fill="url(#${S.id("brand")})"/>`;
    /* Ausbesserungen in hellerem Rot (19. Jh.) */
    const z = zufall(seite > 0 ? 3 : 8);
    for (let i = 0; i < 5; i++) { const xx = (z() - 0.5) * 1.5 * R, hh = 2 + z() * 15; t += `<rect x="${r(xx)}" y="${-M(hh + 1.2)}" width="${M(0.9 + z() * 1.2)}" height="${M(0.8 + z())}" fill="#d0704a" opacity=".35"/>`; }
    /* Feuchtigkeit am Fuß */
    t += `<path d="M${-R} 0 V${-M(3)} A${R} 1 0 0 1 ${R} ${-M(3)} V0 Z" fill="${S.lg("fuss", [[0, "#1a0805", 0], [1, "#1a0805", 0.45]])}"/>`;
    t += band(0, 1.1, S.lg("sockel", [[0, "#4b4740"], [0.7, "#8d877b"], [1, "#6a655c"]], 0, 0, 1, 0));
    /* Lagen aus schwarz glasierten Ziegeln: Fugen, Glanz, unterschiedliche Rhythmen (Doppelbänder unter dem Fries) */
    const lagen = seite < 0 ? [[2.0, 0.4], [3.5, 0.36], [5.6, 0.42], [6.15, 0.3], [9.2, 0.46], [11.0, 0.38], [12.6, 0.36], [13.15, 0.3], [16.3, 0.44], [18.1, 0.38]]
      : [[2.2, 0.42], [3.8, 0.38], [5.5, 0.4], [6.1, 0.32], [9.0, 0.42], [10.9, 0.4], [12.5, 0.38], [13.1, 0.3], [16.5, 0.4], [18.0, 0.44]];
    for (const [h, d] of lagen) t += band(h, h + d, GLASUR, 0.94) + band(h, h + d, `url(#${S.id("glanz")})`);
    /* zwei Terrakottabänder mit Rosettenplatten, darunter Kalkausblühungen */
    for (const h of [6.6, 13.6]) {
      t += band(h - 1.2, h - 0.12, S.lg("ausbl", [[0, "#efe6d6", 0], [1, "#efe6d6", 0.22]]));
      t += band(h, h + 0.62, TERRA);
      t += band(h - 0.12, h, "#d9c9a8", 0.8) + band(h + 0.62, h + 0.74, "#d9c9a8", 0.8);
      for (let a = -84; a <= 84; a += 5.6) {
        const s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180);
        const x = r(R * s), y = r(-M(h + 0.31) - ring(h + 0.31) * c), w = r(M(0.55) * c);
        if (w < 0.4) continue;
        t += `<rect x="${r(x - w * 0.46)}" y="${r(y - 1.35)}" width="${r(w * 0.92)}" height="2.7" fill="#4a3428" stroke="#1a110d" stroke-width=".15"/>`;
        t += `<circle cx="${x}" cy="${y}" r="${r(Math.min(0.85, w * 0.3))}" fill="none" stroke="#a5835e" stroke-width=".25" opacity="${r(0.4 + 0.5 * (s + 1) / 2)}"/><circle cx="${x}" cy="${y}" r=".25" fill="#a5835e" opacity="${r(0.4 + 0.5 * (s + 1) / 2)}"/>`;
      }
    }
    /* Geschützscharten: tiefe, nach innen enger werdende Nische (linke Laibung im Licht), kleine Öffnung,
       darüber ein Kalksteinsturz mit Schatten; oben Granitkonsolen; im 2. OG eine Kanonenmündung */
    const scharte = (a, h, w, hgt, art, kanone, sturz) => {
      const s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180);
      const x = R * s, y = -M(h) - ring(h) * c, ww = M(w) * c, hh = M(hgt), iw = ww * 0.3, ih = hh * 0.45;
      /* Nische: breiter als hoch, Laibung läuft nach innen enger zu (linke Laibung im Licht) */
      let g = `<path d="M${r(x - ww / 2)} ${r(y)} V${r(y - hh)} H${r(x + ww / 2)} V${r(y)} Z" fill="#3a1610"/>`;
      g += `<path d="M${r(x - ww / 2)} ${r(y)} V${r(y - hh)} L${r(x - iw / 2)} ${r(y - hh / 2 - ih / 2)} V${r(y - hh / 2 + ih / 2)} Z" fill="#b8643e"/>`;
      g += `<path d="M${r(x + ww / 2)} ${r(y)} V${r(y - hh)} L${r(x + iw / 2)} ${r(y - hh / 2 - ih / 2)} V${r(y - hh / 2 + ih / 2)} Z" fill="#1a0a07"/>`;
      g += `<path d="M${r(x - ww / 2)} ${r(y - hh)} H${r(x + ww / 2)} L${r(x + iw / 2)} ${r(y - hh / 2 - ih / 2)} H${r(x - iw / 2)} Z" fill="#240d08"/>`;
      g += `<rect x="${r(x - iw / 2)}" y="${r(y - hh / 2 - ih / 2)}" width="${r(iw)}" height="${r(ih)}" fill="#0a0605"/>`;
      if (kanone) g += `<circle cx="${r(x)}" cy="${r(y - hh / 2)}" r="${r(Math.min(iw, ih) * 0.48)}" fill="#2e2e30"/><circle cx="${r(x)}" cy="${r(y - hh / 2)}" r="${r(Math.min(iw, ih) * 0.25)}" fill="#050505"/>`;
      if (art === "bogen") {
        /* Stichbogen aus Formziegeln über der Kammer */
        const rb = ww * 0.75, yc = y - hh + rb * 0.75;
        g += `<path d="M${r(x - ww / 2 - 0.5)} ${r(y - hh)} A${r(rb + 0.6)} ${r(rb + 0.6)} 0 0 1 ${r(x + ww / 2 + 0.5)} ${r(y - hh)} L${r(x + ww / 2)} ${r(y - hh)} A${r(rb)} ${r(rb)} 0 0 0 ${r(x - ww / 2)} ${r(y - hh)} Z" fill="#7a2c1c"/>`;
        for (let i = 1; i < 6; i++) { const t2 = -Math.PI / 2 + (i / 6 - 0.5) * 1.15; g += `<path d="M${r(x + Math.cos(t2) * rb)} ${r(yc + Math.sin(t2) * rb)} L${r(x + Math.cos(t2) * (rb + 0.6))} ${r(yc + Math.sin(t2) * (rb + 0.6))}" stroke="#3a120a" stroke-width=".2"/>`; }
      }
      if (sturz) g += `<rect x="${r(x - ww / 2 - 0.6 * c)}" y="${r(y - hh - 1.0)}" width="${r(ww + 1.2 * c)}" height="1" fill="${S.lg("kalk", [[0, "#e6dcc6"], [1, "#b9ae96"]])}"/><rect x="${r(x - ww / 2)}" y="${r(y - hh)}" width="${r(ww)}" height=".45" fill="#1a0a07" opacity=".6"/>`;
      if (art === "granit") g += `<rect x="${r(x - ww / 2 - 0.5 * c)}" y="${r(y)}" width="${r(ww + c)}" height=".8" fill="#8f8b82"/><rect x="${r(x - ww / 2 - 0.5 * c)}" y="${r(y + 0.8)}" width="${r(ww + c)}" height=".3" fill="#1a0a07" opacity=".5"/>`;
      return g;
    };
    const liste = seite < 0 ? SCHARTE.nord : SCHARTE.sued;
    liste.forEach(([a, h], i) => {
      const og2 = h > 14;
      t += og2 ? scharte(a, h, 0.95, 0.8, "granit", Math.abs(a) < 10, false) : scharte(a, h, 1.45, 0.85, i === 1 || i === 5 ? "" : "bogen", false, i === 1 || i === 5);
    });
    /* oberstes Geschoss: schmale hochkant Lichtschlitze ohne Sturz */
    for (const a of seite < 0 ? [-36, 28] : [-30, 34]) { const s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180), x = R * s, y = -M(17.6) - ring(17.6) * c; t += `<rect x="${r(x - M(0.14) * c)}" y="${r(y - M(1.3))}" width="${r(M(0.28) * c)}" height="${M(1.3)}" fill="#0a0605"/>`; }
    t += band(TURM.H - 0.5, TURM.H, "#d9c9a8", 0.9);
    t += band(TURM.H - 2.2, TURM.H - 0.5, S.lg("grau", [[0, "#2a2a2a", 0.32], [1, "#2a2a2a", 0]]));
    /* Rundung: Schatten links, warmes Licht rechts */
    t += `<path d="${koerper}" fill="${S.lg("rund", [[0, "#140c24", 0.6], [0.3, "#1a1020", 0.16], [0.6, "#fff", 0], [0.85, "#ffc480", 0.3], [1, "#1a0805", 0.08]], 0, 0, 1, 0)}"/>`;
    /* Kegeldach aus Schiefer mit Schuppenreihen und einer kleinen Gaube */
    const Rk = M(TURM.Rk), kh = M(TURM.kegel), rk = bogen(TURM.H, TURM.Rk);
    const kegel = `M${-Rk} ${r(-Hh + 0.6)} A${Rk} ${rk} 0 0 1 ${Rk} ${r(-Hh + 0.6)} L0 ${r(-Hh - kh)} Z`;
    t += `<path d="${kegel}" fill="${SCHIEFER}"/><path d="${kegel}" fill="url(#${S.id("schuppen")})" opacity=".45"/>`;
    for (let j = 1; j < 9; j++) { const f = j / 9, w = Rk * (1 - f); t += `<path d="M${r(-w)} ${r(-Hh + 0.6 - kh * f)} A${r(w)} ${r(rk * (1 - f))} 0 0 1 ${r(w)} ${r(-Hh + 0.6 - kh * f)}" stroke="#141a1f" stroke-width=".22" fill="none" opacity=".5"/>`; }
    t += `<path d="M${r(Rk * 0.3)} ${r(-Hh + 0.6 - rk * 0.9)} L0 ${r(-Hh - kh)} L${r(Rk * 0.55)} ${r(-Hh + 0.6 - rk * 0.6)} Z" fill="#9fb0bf" opacity=".22"/>`;
    const gx = seite * Rk * 0.22, gy = -Hh - kh * 0.35;
    t += `<path d="M${r(gx - 1.2)} ${r(gy + 1.2)} L${r(gx)} ${r(gy - 0.8)} L${r(gx + 1.2)} ${r(gy + 1.2)} Z" fill="#3a4652"/><rect x="${r(gx - 0.4)}" y="${r(gy)}" width=".8" height="1" fill="#0a0c0e"/>`;
    t += `<path d="M${-Rk} ${r(-Hh + 0.6)} A${Rk} ${rk} 0 0 1 ${Rk} ${r(-Hh + 0.6)}" stroke="#141a1f" stroke-width=".9" fill="none"/>`;
    t += `<path d="M0 ${r(-Hh - kh)} V${r(-Hh - kh - 6)}" stroke="#2a2420" stroke-width=".45"/><circle cx="0" cy="${r(-Hh - kh - 1.4)}" r=".9" fill="${GOLD}"/>`;
    t += `<path d="M0 ${r(-Hh - kh - 5.6)} L${seite * 3} ${r(-Hh - kh - 5)} L${seite * 3} ${r(-Hh - kh - 3.8)} L0 ${r(-Hh - kh - 4.2)} Z" fill="${GOLD}"/>`;
    return `<g transform="translate(${cx} 0)${seite > 0 ? ` rotate(${NEIG} ${-R} 0)` : ""}">${t}</g>`;
  };
  k += turm(-1) + turm(1);
  k += passant(M(-1.2), 0, M(1.75), { hemd: "#c9b28a" }) + passant(M(0.9), 0, M(1.68), { hemd: "#3d5a80", hose: "#4a4a52", schritt: 0.15 });
  S.MOEWE_KNAUF = true;
  /* der abgesackte Südturm schneidet am Fuß in den Boden ein: Rasen deckt die gesunkene Kante */
  const fa = sued(-TURM.R, 0), fb = sued(TURM.R + 0.4, 0);
  const boden = `<path d="M${r(fa.x - GX)} 0 L${r(fb.x - GX)} ${r(fb.y - GY)} L${r(fb.x - GX + 1)} 1.6 L${r(fa.x - GX)} 1.6 Z" fill="#6d8a3f"/><path d="M${r(fa.x - GX)} 0 L${r(fb.x - GX)} ${r(fb.y - GY)}" stroke="#4f6a2c" stroke-width=".4"/>`;
  const torSvg = `<g filter="url(#${S.id("licht")})">${k}</g>` + boden + "%%KNAUFMOEWE%%";
  const TL = GX - M(TURM.cx), TR = GX + M(TURM.cx);
  /* Unterteile auf dem geneigten Südturm folgen der Neigung */
  const sTurm = [sued(-TURM.R, 0), sued(-TURM.R, TURM.H), sued(TURM.R, TURM.H), sued(TURM.R, 0)];
  const sK = sued(0, TURM.H), sKs = sued(0, TURM.H + TURM.kegel + 1.2);
  const sBack = sued(3.2, 4.3);
  const nScharte = { x: r(TL + M(TURM.R) * Math.sin(6 * Math.PI / 180)), y: r(GY - M(2.7)) };
  const kanone = { x: r(TL + M(TURM.R) * Math.sin(2 * Math.PI / 180)), y: r(GY - M(15.0) - bogen(15, TURM.R)) };
  const rel = (pts, o) => `M${pts.map((p) => `${r(p.x - o.x)} ${r(p.y - o.y)}`).join(" L")} Z`;
  const sMitte = sued(0, TURM.H / 2);
  TOR_UNTER = [
    { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: sMitte.x, y: sMitte.y, kunst: `<path class="bw-flaeche" d="${rel(sTurm, sMitte)}" fill="rgba(255,255,255,0.001)"/>`,
      tipp: "Der Südturm ist schief: Der Boden unter ihm ist weich, darum ist er abgesackt." },
    { id: "kegeldach", de: "das Kegeldach", syl: "KE-gel-dach", it: "il tetto conico", itSyl: "TET-to CO-ni-co", en: "conical roof", x: sK.x, y: sK.y, kunst: `<path class="bw-flaeche" d="M${-M(TURM.Rk)} 2 L${r(sKs.x - sK.x)} ${r(sKs.y - sK.y)} L${M(TURM.Rk)} 2 Z" fill="rgba(255,255,255,0.001)"/>`,
      tipp: "Die Dächer der Türme sehen aus wie spitze Kegel. Sie sind mit Schiefer gedeckt." },
    { id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: GX, y: GY - M(8.5), kunst: flaeche(-M(4.4), -M(0.9), M(8.8), M(1.8), 0.4),
      tipp: "„Concordia domi foris pax“ ist Latein. Es heißt: Drinnen Eintracht, draußen Frieden." },
    { id: "durchfahrt", de: "die Durchfahrt", syl: "DURCH-fahrt", it: "il passaggio", itSyl: "pas-SAG-gio", en: "gateway", x: GX, y: GY, kunst: flaeche(-M(2.7), -M(6.6), M(5.4), M(6.6), 1),
      tipp: "Durch das Tor kommt man über die Holstenbrücke in die Altstadt." },
    { id: "schiessscharte", de: "die Schießscharte", syl: "SCHIESS-schar-te", it: "la feritoia", itSyl: "fe-ri-TO-ia", en: "loophole", x: nScharte.x, y: nScharte.y, kunst: flaeche(-M(0.9), -M(1.6), M(1.8), M(1.8), 0.4),
      tipp: "Aus den Schießscharten konnten die Soldaten mit Kanonen schießen." },
    { id: "kanone", de: "die Kanone", syl: "ka-NO-ne", it: "il cannone", itSyl: "can-NO-ne", en: "cannon", x: kanone.x, y: kanone.y, kunst: flaeche(-M(0.7), -M(1.0), M(1.4), M(1.2), 0.4),
      tipp: "Im zweiten Obergeschoss stehen heute noch alte Kanonen. Man sieht ihre Mündung in der Scharte." },
    { id: "fries", de: "der Fries", syl: "FRIES", it: "il fregio", itSyl: "FRE-gio", en: "frieze", x: TL - M(3.4), y: GY - M(13.6), kunst: flaeche(-M(1.9), -M(1.2), M(3.8), M(1.6), 0.4),
      tipp: "Der Fries ist ein Band aus Tonplatten. Es läuft rund um die Türme." },
    { id: "backstein", de: "der Backstein", syl: "BACK-stein", it: "il mattone", itSyl: "mat-TO-ne", en: "brick", x: sBack.x, y: sBack.y, kunst: flaeche(-M(1.4), -M(1.4), M(2.8), M(2.4), 0.4),
      tipp: "Das Tor ist aus rotem Backstein. Manche Steine sind schwarz glasiert und glänzen." },
  ];
  /* Schatten des Tores fällt links nach hinten auf den Rasen */
  {
    const L = SONNE.lang * 30, dl = -Math.sin(SONNE.az) * L, dd = Math.cos(SONNE.az) * L;
    const torSchatten = pfad([proj(-16.2, GD), proj(-6, GD), proj(-6 + dl * 0.4, GD + dd * 0.4), proj(-16.2 + dl * 0.7, GD + dd * 0.7)]);
    SCHATTEN.unshift(`<path d="${torSchatten}" fill="#1e2a12" opacity=".4"/>`);
    S.TORSCHATTEN = torSchatten;
  }
  S.teil({ id: "holstentor", de: "das Holstentor", syl: "HOL-sten-tor", it: "la Porta di Holsten", itSyl: "POR-ta di HOL-sten", en: "Holsten Gate",
    x: GX, y: GY, kunst: torSvg.replace("%%KNAUFMOEWE%%", (() => { const kn = sued(0, TURM.H + TURM.kegel + 1.4), q = GK * 0.12; return `<g transform="translate(${r(kn.x - GX + 0.6)} ${r(kn.y - GY - 1)}) scale(-1 1)"><path d="M${r(-1.6 * q)} ${r(-0.9 * q)} Q${r(-0.4 * q)} ${r(-1.6 * q)} ${r(1.2 * q)} ${r(-1.1 * q)} L${r(1.9 * q)} ${r(-1 * q)} L${r(1.2 * q)} ${r(-0.75 * q)} Q${r(0.2 * q)} ${r(-0.1 * q)} ${r(-1 * q)} ${r(-0.5 * q)} Z" fill="#f5f4ef"/><path d="M${r(-1.9 * q)} ${r(-0.75 * q)} Q${r(-0.6 * q)} ${r(-1.15 * q)} ${r(0.7 * q)} ${r(-0.92 * q)} L${r(0.4 * q)} ${r(-0.68 * q)} Z" fill="#9aa3ab"/><circle cx="${r(1.05 * q)}" cy="${r(-1.48 * q)}" r="${r(0.42 * q)}" fill="#f8f7f2"/><path d="M${r(1.4 * q)} ${r(-1.5 * q)} L${r(1.95 * q)} ${r(-1.42 * q)} L${r(1.4 * q)} ${r(-1.34 * q)} Z" fill="#e8b830"/></g>`; })()), tipp: "Das Holstentor wurde 1478 fertig. Früher schützte es die reiche Hansestadt, heute ist darin ein Museum.",
    zoom: { x: 102, y: 22, w: 246, h: 164 }, unter: TOR_UNTER });
  S.SUED_KNAUF = sued(0, TURM.H + TURM.kegel + 1.4);
}

/* =====================================================================
   6 — DIE REISEGRUPPE vor dem Tor: lockerer Haufen um die Führerin
   ===================================================================== */
{
  let k = "";
  const z = zufall(61);
  const leute = [];
  for (let i = 0; i < 9; i++) leute.push([-4.6 + z() * 3.8, 44 + z() * 6, ["#b8473a", "#e8e4dc", "#2f5f95", "#d8ad3a", "#3f7d5a", "#e6889f", "#5a4a7a", "#c9b28a", "#2f3640"][i], 1.6 + z() * 0.25, z() < 0.25]);
  leute.push([-2.2, 45.5, "#f2c230", 1.2, false]);
  leute.sort((a, b) => b[1] - a[1]);
  for (const [lat, d, hemd, hm, handy] of leute) {
    const [x, y] = proj(lat, d), h = r(hm * F / d);
    k += passant(x, y, h, { hemd, rueck: true, schritt: 0.03, haar: z() < 0.3 ? "#c9a466" : "#4a3426" });
    if (handy) k += `<rect x="${r(x + 0.05 * h)}" y="${r(y - 1.15 * h)}" width="${r(0.09 * h)}" height="${r(0.13 * h)}" fill="#1d1f22"/><path d="M${r(x + 0.12 * h)} ${r(y - 0.8 * h)} L${r(x + 0.1 * h)} ${r(y - 1.05 * h)}" stroke="#e3b796" stroke-width="${r(0.04 * h)}"/>`;
    schlag(lat, d, hm, 0.5, 0.3);
  }
  /* die Stadtführerin (von vorn) hält den roten Schirm hoch über die Köpfe */
  const [gx, gy] = proj(-5.6, 46.5), gh = r(1.68 * F / 46.5);
  k += passant(gx, gy, gh, { hemd: "#7a2a40", hose: "#2f3640", rueck: false, haar: "#93704f" });
  k += `<path d="M${r(gx + 0.13 * gh)} ${r(gy - 0.78 * gh)} L${r(gx + 0.16 * gh)} ${r(gy - 1.5 * gh)}" stroke="#2a2a2a" stroke-width=".3"/><path d="M${r(gx + 0.11 * gh)} ${r(gy - 0.8 * gh)} L${r(gx + 0.13 * gh)} ${r(gy - 1.05 * gh)}" stroke="#7a2a40" stroke-width="${r(0.055 * gh)}" stroke-linecap="round"/>`;
  k += `<path d="M${r(gx + 0.16 * gh - 3.4)} ${r(gy - 1.45 * gh)} Q${r(gx + 0.16 * gh)} ${r(gy - 1.72 * gh)} ${r(gx + 0.16 * gh + 3.4)} ${r(gy - 1.45 * gh)} Z" fill="#c8302a"/><path d="M${r(gx + 0.16 * gh)} ${r(gy - 1.66 * gh)} V${r(gy - 1.75 * gh)}" stroke="#2a2a2a" stroke-width=".3"/>`;
  schlag(-5.6, 46.5, 1.68, 0.5, 0.3);
  S.teil({ id: "reisegruppe", de: "die Reisegruppe", syl: "REI-se-grup-pe", it: "il gruppo di turisti", itSyl: "GRUP-po di tu-RI-sti", en: "tour group", x: 0, y: 0, kunst: k,
    tipp: "Die Stadtführerin hält einen roten Schirm hoch. So findet die Gruppe sie immer." });
}

/* =====================================================================
   7 — DER TOURIST (fotografiert das Tor) und 8 — DIE TOURISTIN (zeigt auf die Inschrift)
   ===================================================================== */
{
  const d = 26, lat = 1.7, [x, y] = proj(lat, d), s = km(y);
  const handy = { lende: 1, brust: -2, nacken: -4, kopf: -8, schulterL: { vor: 92, seit: -6, dreh: 0 }, ellbogenL: 60, unterarmL: 0, handL: 20, fingerL: 0.5,
    schulterR: { vor: 96, seit: 12, dreh: 0 }, ellbogenR: 52, unterarmR: 0, handR: 24, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 };
  const m = figur({ id: "lbk_tour", geschlecht: "m", pose: handy, blick: 184, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f4a6a" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "kappe", farbe: "#b8473a" } } }, 1.8 * s);
  const hs = [m.z.handL, m.z.handR].sort((a, b) => a.y - b.y)[0], hx = hs.x * m.k, hy = hs.y * m.k;
  const ph = `<g transform="translate(${r(hx)} ${r(hy - 1.4)})"><rect x="-1.3" y="-2.2" width="2.6" height="1.7" rx=".3" fill="#1d1f22"/><rect x="-1.1" y="-2" width="2.2" height="1.3" fill="#7fa6cf"/><path d="M-.9 -.8 L-.4 -1.7 L.1 -.8 Z M.1 -.8 L.6 -1.7 L1 -.8 Z" fill="#8a3f2b"/></g>`;
  schlag(lat, d, 1.8, 0.5);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: m.svg + ph,
    tipp: "Der Tourist macht ein Foto vom Holstentor. Das Tor war früher auf dem 50-Mark-Schein." });
}
{
  const d = 25, lat = 3.0, [x, y] = proj(lat, d), s = km(y);
  const zeig = Object.assign({}, POSEN.zeigen, { schulterR: { vor: 135, seit: 32, dreh: 0 }, ellbogenR: 4, nacken: -10, kopf: -14 });
  const m = figur({ id: "lbk_tourin", geschlecht: "w", pose: zeig, blick: 200, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e9dfcf" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#b0523c" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#2f5a35" } } }, 1.66 * s);
  schlag(lat, d, 1.66, 0.5);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: m.svg,
    tipp: "Die Touristin zeigt auf den schiefen Turm. Er hat sich geneigt, weil der Boden weich ist." });
}

/* =====================================================================
   9 — DAS BLUMENBEET in den Farben der Stadt (Weiß und Rot), rechts
   ===================================================================== */
{
  const d0 = 10.4, d1 = 11.8, la = 3.0, lb = 4.85;
  const P = [proj(la, d1), proj(lb, d1), proj(lb, d0), proj(la, d0)];
  let k = `<path d="${pfad(P)}" fill="#4f3826"/>`;
  /* Einfassung aus hellem Stein folgt allen vier Kanten */
  k += `<path d="${pfad(P)}" fill="none" stroke="#e2d9c6" stroke-width=".9"/><path d="M${P[3].join(" ")} L${P[2].join(" ")}" stroke="#bfb5a2" stroke-width="1.3" transform="translate(0 .7)"/>`;
  const bl = [];
  for (let i = 0; i < 60; i++) { const t = rnd(), u = rnd(); bl.push([la + 0.15 + u * (lb - la - 0.3), d1 - 0.1 - t * (d1 - d0 - 0.2)]); }
  bl.sort((a, b) => b[1] - a[1]);
  for (const [lat, d] of bl) {
    const [x, y] = proj(lat, d), s = km(y) * 0.075;
    const weiss = Math.floor((lat - la) * 1.2) % 2 === 0;
    k += `<ellipse cx="${x}" cy="${r(y - s * 0.5)}" rx="${r(s * 1.1)}" ry="${r(s * 0.6)}" fill="#355e22"/><ellipse cx="${r(x - s * 0.3)}" cy="${r(y - s * 0.7)}" rx="${r(s * 0.6)}" ry="${r(s * 0.3)}" fill="#5a8a3a"/>`;
    const c = weiss ? "#f8f5ee" : "#cc2a30", c2 = weiss ? "#e6e0d2" : "#9e1a20";
    for (let p = 0; p < 5; p++) { const a = p / 5 * Math.PI * 2; k += `<circle cx="${r(x + Math.cos(a) * s * 0.3)}" cy="${r(y - s * 1.2 + Math.sin(a) * s * 0.2)}" r="${r(s * 0.24)}" fill="${p < 3 ? c : c2}"/>`; }
    k += `<circle cx="${x}" cy="${r(y - s * 1.2)}" r="${r(s * 0.12)}" fill="#f0c64a"/>`;
  }
  S.teil({ id: "blumenbeet", de: "das Blumenbeet", syl: "BLU-men-beet", it: "l'aiuola", itSyl: "a-iu-O-la", en: "flower bed", x: 0, y: 0, kunst: k,
    tipp: "Die Blumen sind weiß und rot. Das sind die Farben von Lübeck." });
}

/* =====================================================================
   10 — DIE LATERNE mit der MÖWE, 11 — DAS FAHRRAD (lehnt daran)
   ===================================================================== */
const LAT = { lat: 5.4, d: 30 };
const [LX, LY] = proj(LAT.lat, LAT.d), LK = km(LY);
{
  const H = 4.0 * LK;
  let k = `<path d="M${r(-0.13 * LK)} 0 L${r(-0.09 * LK)} ${r(-0.5 * LK)} L${r(-0.05 * LK)} ${r(-H + 0.6 * LK)} L${r(0.05 * LK)} ${r(-H + 0.6 * LK)} L${r(0.09 * LK)} ${r(-0.5 * LK)} L${r(0.13 * LK)} 0 Z" fill="${S.lg("mast", [[0, "#11181a"], [0.6, "#3c4a4d"], [1, "#1c2426"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.11 * LK)}" y="${r(-0.62 * LK)}" width="${r(0.22 * LK)}" height="${r(0.1 * LK)}" fill="#3c4a4d"/>`;
  const t = -H + 0.6 * LK, lw = 0.2 * LK;
  k += `<path d="M${r(-lw * 0.6)} ${r(t)} L${r(-lw)} ${r(t - 0.5 * LK)} L${r(lw)} ${r(t - 0.5 * LK)} L${r(lw * 0.6)} ${r(t)} Z" fill="${S.lg("glaslat", [[0, "#fff6d8"], [1, "#e8c98a"]])}" stroke="#1c2426" stroke-width=".5"/>`;
  k += `<path d="M0 ${r(t)} V${r(t - 0.5 * LK)}" stroke="#1c2426" stroke-width=".4"/>`;
  k += `<path d="M${r(-lw - 0.6)} ${r(t - 0.5 * LK)} L0 ${r(t - 0.72 * LK)} L${r(lw + 0.6)} ${r(t - 0.5 * LK)} Z" fill="#1c2426"/><circle cx="0" cy="${r(t - 0.76 * LK)}" r=".8" fill="#1c2426"/>`;
  schlag(LAT.lat, LAT.d, 4.0, 0.2, 0.35);
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: LX, y: LY, kunst: licht(k) });
  S.LAT_TOP = LY + t - 0.76 * LK;
}
{
  const s = LK, R = 0.34 * s, x0 = -0.15 * s, x1 = 0.92 * s;
  let k = "";
  for (const cx of [x0, x1]) {
    k += `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R)}" fill="none" stroke="#1c1c1e" stroke-width="${r(0.05 * s)}"/>`;
    k += `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R * 0.9)}" fill="none" stroke="#b9bec2" stroke-width=".25" stroke-dasharray=".4 1.1"/>`;
    k += `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(0.04 * s)}" fill="#9aa0a6"/>`;
  }
  const rot = "#b23a32", sat = [0.32 * s, -0.95 * s], tret = [0.36 * s, -R], lenk = [0.82 * s, -1.02 * s];
  k += `<path d="M${r(x0)} ${r(-R)} L${r(tret[0])} ${r(tret[1])} L${r(sat[0])} ${r(sat[1])} Z M${r(tret[0])} ${r(tret[1])} L${r(lenk[0] - 0.06 * s)} ${r(-0.78 * s)} L${r(sat[0] + 0.04 * s)} ${r(-0.82 * s)} M${r(lenk[0] - 0.06 * s)} ${r(-0.78 * s)} L${r(x1)} ${r(-R)}" stroke="${rot}" stroke-width="${r(0.045 * s)}" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(lenk[0] - 0.06 * s)} ${r(-0.78 * s)} L${r(lenk[0])} ${r(lenk[1])} Q${r(lenk[0] - 0.14 * s)} ${r(lenk[1] - 0.06 * s)} ${r(lenk[0] - 0.22 * s)} ${r(lenk[1] + 0.02 * s)}" stroke="#2a2a2c" stroke-width="${r(0.035 * s)}" fill="none"/>`;
  k += `<path d="M${r(sat[0] - 0.1 * s)} ${r(sat[1] - 0.03 * s)} L${r(sat[0] + 0.1 * s)} ${r(sat[1] - 0.03 * s)}" stroke="#2a1d16" stroke-width="${r(0.05 * s)}" stroke-linecap="round"/>`;
  k += `<path d="M${r(x1 - 0.1 * s)} ${r(-1.02 * s)} L${r(x1 + 0.22 * s)} ${r(-1.02 * s)} L${r(x1 + 0.19 * s)} ${r(-0.84 * s)} L${r(x1 - 0.07 * s)} ${r(-0.84 * s)} Z" fill="#7a5a36" stroke="#4a361e" stroke-width=".2"/>`;
  k += `<path d="M${r(x1 - 0.06 * s)} ${r(-0.84 * s)} V${r(-0.3 * s)} M${r(x1 + 0.18 * s)} ${r(-0.84 * s)} L${r(x1)} ${r(-R)}" stroke="#2a2a2c" stroke-width=".3"/>`;
  schlag(LAT.lat + 0.4, LAT.d + 0.2, 1.0, 1.2, 0.35);
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: r(LX + 0.06 * LK), y: r(LY + 0.4), kunst: licht(k) });
}
{
  /* DIE MÖWE sitzt auf der Laterne; eine zweite auf dem Knauf des Südturms, eine dritte fliegt */
  const moewe = (s, flip = 1) => {
    let k = `<g transform="scale(${flip} 1)"><path d="M${r(-1.6 * s)} ${r(-0.9 * s)} Q${r(-0.4 * s)} ${r(-1.6 * s)} ${r(1.2 * s)} ${r(-1.1 * s)} L${r(1.9 * s)} ${r(-1.0 * s)} L${r(1.2 * s)} ${r(-0.75 * s)} Q${r(0.2 * s)} ${r(-0.1 * s)} ${r(-1.0 * s)} ${r(-0.5 * s)} Z" fill="#f5f4ef"/>`;
    k += `<path d="M${r(-1.9 * s)} ${r(-0.75 * s)} Q${r(-0.6 * s)} ${r(-1.15 * s)} ${r(0.7 * s)} ${r(-0.92 * s)} L${r(0.4 * s)} ${r(-0.68 * s)} Q${r(-0.6 * s)} ${r(-0.6 * s)} ${r(-1.9 * s)} ${r(-0.75 * s)} Z" fill="#9aa3ab"/>`;
    k += `<path d="M${r(-2.1 * s)} ${r(-0.72 * s)} L${r(-1.6 * s)} ${r(-0.82 * s)} L${r(-1.4 * s)} ${r(-0.6 * s)} Z" fill="#1d1d1f"/>`;
    k += `<circle cx="${r(1.05 * s)}" cy="${r(-1.48 * s)}" r="${r(0.42 * s)}" fill="#f8f7f2"/><circle cx="${r(1.18 * s)}" cy="${r(-1.56 * s)}" r="${r(0.07 * s)}" fill="#1d1d1f"/>`;
    k += `<path d="M${r(1.4 * s)} ${r(-1.5 * s)} L${r(1.95 * s)} ${r(-1.42 * s)} L${r(1.4 * s)} ${r(-1.34 * s)} Z" fill="#e8b830"/>`;
    k += `<path d="M${r(-0.1 * s)} ${r(-0.35 * s)} V0 M${r(0.4 * s)} ${r(-0.35 * s)} V0" stroke="#e6a77a" stroke-width="${r(Math.max(0.15, 0.08 * s))}"/></g>`;
    return k;
  };
  const s = LK * 0.16;
  const kn = S.SUED_KNAUF;
  S.hinten(`<g transform="translate(332 70)"><path d="M-6 -1 Q-3 -3.4 0 0 Q3 -3.4 6 -1.6 Q3 -2 0 1 Q-3 -1.8 -6 -1 Z" fill="#f8f7f2"/><path d="M-6 -1 Q-5.2 -1.6 -4.6 -1.4 M6 -1.6 Q5.2 -2 4.6 -1.8" stroke="#2a2a2c" stroke-width=".5"/><ellipse cx="0" cy=".2" rx="1.1" ry=".55" fill="#f8f7f2"/><path d="M1 0 L1.8 .2 L1 .4 Z" fill="#e8b830"/></g>`);
  let extra = "";
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: LX, y: r(S.LAT_TOP), kunst: licht(moewe(s)) + extra,
    tipp: "Lübeck liegt nah an der Ostsee. Darum fliegen hier viele Möwen." });
}

/* =====================================================================
   12 — DIE BANK, 13 — DIE FRAU, 14 — DIE TÜTE, 15 — DAS KIND, 16 — DAS MARZIPAN
   (weiter hinten links, damit der Löwe vorn Platz hat)
   ===================================================================== */
const BANK = { d: 24, lat0: -11.2, lat1: -9.2 };
const [BX0, BY] = proj(BANK.lat0, BANK.d), [BX1] = proj(BANK.lat1, BANK.d), BK = km(BY), BXM = r((BX0 + BX1) / 2);
{
  const w = BX1 - BX0, s = BK;
  let k = "";
  const HOLZ = S.lg("bankholz", [[0, "#a86a3c"], [1, "#7a4a26"]]);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (w / 2 - 0.12 * s))} 0 L${r(sx * (w / 2 - 0.12 * s))} ${r(-0.45 * s)} L${r(sx * (w / 2 - 0.08 * s))} ${r(-0.88 * s)} L${r(sx * (w / 2 - 0.15 * s))} ${r(-0.88 * s)} L${r(sx * (w / 2 - 0.2 * s))} ${r(-0.45 * s)} L${r(sx * (w / 2 - 0.26 * s))} 0 Z" fill="#23282b"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-w / 2)}" y="${r(-0.46 * s - i * 0.035 * s)}" width="${r(w)}" height="${r(0.03 * s)}" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-w / 2 + 0.03 * s)}" y="${r(-0.86 * s + i * 0.09 * s)}" width="${r(w - 0.06 * s)}" height="${r(0.065 * s)}" rx=".4" fill="${HOLZ}"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-0.46 * s)}" width="${r(w)}" height=".5" fill="#e3b78a" opacity=".6"/>`;
  schlag((BANK.lat0 + BANK.lat1) / 2, BANK.d + 0.3, 0.9, 2.0, 0.4);
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: BXM, y: BY, steht: true, kunst: licht(k) });
}
{
  /* DIE FRAU sitzt links auf der Bank, die Hände auf den Knien, und schaut zum Kind (rechts) */
  const sitz = Object.assign({}, POSEN.sitzen, { schulterL: { vor: 24, seit: 8 }, ellbogenL: 62, unterarmL: -60, handL: 4, schulterR: { vor: 58, seit: 22 }, ellbogenR: 22, unterarmR: -20, handR: 8, fingerR: 0.3, kopf: 2 });
  const m = figur({ id: "lbk_frau", geschlecht: "w", pose: sitz, blick: 62, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f3efe6" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f5f95" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.66 * BK);
  const sitzY = m.z.sitz.y * m.k;
  S.teil({ id: "frau", de: "die Frau", syl: "FRAU", it: "la donna", itSyl: "DON-na", en: "woman", x: r(BXM - 0.4 * BK), y: BY, kunst: `<g transform="translate(0 ${r(-0.46 * BK - sitzY)})">${m.svg}</g>`,
    tipp: "Die Mutter macht eine Pause auf der Bank. Sie hat Marzipan gekauft." });
}
{
  const s = BK * 1.25;
  let k = `<path d="M${r(-0.13 * s)} 0 L${r(0.13 * s)} 0 L${r(0.12 * s)} ${r(-0.3 * s)} L${r(-0.12 * s)} ${r(-0.3 * s)} Z" fill="${S.lg("tuete", [[0, "#9e1a20"], [0.6, "#c8282e"], [1, "#a01c22"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-0.12 * s)} ${r(-0.3 * s)} L${r(0.12 * s)} ${r(-0.3 * s)} L${r(0.1 * s)} ${r(-0.33 * s)} L${r(-0.1 * s)} ${r(-0.33 * s)} Z" fill="#7a1418"/>`;
  k += `<path d="M${r(-0.06 * s)} ${r(-0.3 * s)} Q0 ${r(-0.44 * s)} ${r(0.06 * s)} ${r(-0.3 * s)}" stroke="#c9a640" stroke-width=".5" fill="none"/>`;
  k += `<text x="0" y="${r(-0.16 * s)}" font-size="${r(0.045 * s)}" text-anchor="middle" fill="#f0c64a" font-family="Georgia,serif" font-style="italic" font-weight="bold">Marzipan</text>`;
  k += `<text x="0" y="${r(-0.105 * s)}" font-size="${r(0.03 * s)}" text-anchor="middle" fill="#f0c64a" font-family="Georgia,serif">LÜBECK</text>`;
  k += `<rect x="${r(-0.13 * s)}" y="${r(-0.3 * s)}" width="${r(0.06 * s)}" height="${r(0.3 * s)}" fill="#000" opacity=".15"/>`;
  S.teil({ id: "tuete", de: "die Tüte", syl: "TÜ-te", it: "il sacchetto", itSyl: "sac-CHET-to", en: "bag", x: r(BXM + 0.55 * BK), y: r(BY - 0.46 * BK), steht: true, kunst: licht(k) });
}
const KIND = { lat: -7.6, d: 20 };
const [KX, KY] = proj(KIND.lat, KIND.d), KK = km(KY);
let MARZ = null;
{
  /* DAS KIND (etwa sechs Jahre, 1,15 m), Kleid und Rucksack, dreht sich zur Mutter und hält das Marzipan hoch */
  const halt = Object.assign({}, POSEN.halten, { schulterL: { vor: 40, seit: 10 }, ellbogenL: 70, schulterR: { vor: 40, seit: 11 }, ellbogenR: 72, kopf: -6 });
  const m = figur({ id: "lbk_kind", alter: "kind", geschlecht: "w", pose: halt, blick: -75, frisur: "zopf", haarfarbe: "hellblond", haut: "hell", laecheln: true,
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#f2c230" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#e6889f" } } }, 1.15 * KK);
  const hd = [m.z.handL, m.z.handR];
  MARZ = { x: r(KX + (hd[0].x + hd[1].x) / 2 * m.k), y: r(KY + Math.min(hd[0].y, hd[1].y) * m.k) };
  schlag(KIND.lat, KIND.d, 1.15, 0.4);
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "la bambina", itSyl: "bam-BI-na", en: "child", x: KX, y: KY, kunst: m.svg,
    tipp: "Das Kind zeigt seiner Mutter das Marzipan." });
}
{
  /* DAS MARZIPAN: Marzipanbrot in roter Hülle mit goldenem Band, angebrochen */
  const s = KK * 2;
  let k = `<rect x="${r(-0.09 * s)}" y="${r(-0.09 * s)}" width="${r(0.18 * s)}" height="${r(0.09 * s)}" rx="${r(0.015 * s)}" fill="${S.lg("hulle", [[0, "#d63036"], [1, "#8e161c"]])}"/><rect x="${r(-0.09 * s)}" y="${r(-0.09 * s)}" width="${r(0.18 * s)}" height="${r(0.02 * s)}" fill="#ff7a7a" opacity=".5"/>`;
  k += `<rect x="${r(-0.03 * s)}" y="${r(-0.09 * s)}" width="${r(0.05 * s)}" height="${r(0.09 * s)}" fill="${GOLD}"/>`;
  k += `<rect x="${r(0.09 * s)}" y="${r(-0.046 * s)}" width="${r(0.035 * s)}" height="${r(0.042 * s)}" fill="#5a3420"/><rect x="${r(0.1 * s)}" y="${r(-0.04 * s)}" width="${r(0.022 * s)}" height="${r(0.03 * s)}" fill="#f1dcae"/>`;
  k += `<path d="M${r(-0.08 * s)} ${r(-0.045 * s)} h${r(0.15 * s)}" stroke="#ff8a8a" stroke-width=".3" opacity=".6"/>`;
  S.teil({ id: "marzipan", de: "das Marzipan", syl: "mar-zi-PAN", it: "il marzapane", itSyl: "mar-za-PA-ne", en: "marzipan", x: MARZ.x, y: r(MARZ.y + 0.3), kunst: k,
    tipp: "Lübecker Marzipan ist berühmt. Man macht es aus Mandeln und Zucker." });
}

/* =====================================================================
   17 — DIE LÖWEN (gusseisern, 1823): links der wachende, rechts der schlafende
   ===================================================================== */
let REITER = null;
function loewe(L, wach, dir) {
  /* Liegender Löwe aus Gusseisen (Rauch, 1823) in Seitenansicht, Blick nach rechts bei dir = 1.
     Licht von rechts oben: warme Spitzlichter auf Rücken, Locken, Braue und Pranken. */
  const P = (x, y) => `${r(dir * x * L)} ${r(-y * L)}`;
  const D = "#1d1d20", MI = "#2c2c2f", HL = "#8a867c", SP = "#c8b48c";
  const z = zufall(wach ? 5 : 9);
  /* eine Locke (hängend, Wurzel bei 0,0), hell und dunkel, einmal definiert und per <use> gesetzt */
  if (!loewe.lk) {
    /* S-förmige Zottel: breite Wurzel, Spitze rollt sich zur Seite ein */
    const w = 0.05 * L, l = 0.085 * L;
    const lp = `M${r(-w / 2)} 0 C${r(-w * 0.8)} ${r(l * 0.45)} ${r(-w * 0.1)} ${r(l * 0.7)} ${r(-w * 0.15)} ${r(l)} C${r(w * 0.3)} ${r(l * 0.92)} ${r(w * 0.25)} ${r(l * 0.62)} ${r(w * 0.55)} ${r(l * 0.4)} C${r(w * 0.7)} ${r(l * 0.25)} ${r(w * 0.55)} ${r(l * 0.08)} ${r(w / 2)} 0 Z`;
    const hp = `M${r(w * 0.45)} ${r(l * 0.12)} C${r(w * 0.55)} ${r(l * 0.3)} ${r(w * 0.3)} ${r(l * 0.5)} ${r(w * 0.2)} ${r(l * 0.62)}`;
    const kp = `M${r(-w * 0.3)} ${r(l * 0.15)} C${r(-w * 0.45)} ${r(l * 0.45)} ${r(-w * 0.05)} ${r(l * 0.65)} ${r(-w * 0.1)} ${r(l * 0.85)}`;
    S.def(`<g id="${S.id("lkh")}"><path d="${lp}" fill="#35342f" stroke="#141416" stroke-width="${r(0.005 * L)}"/><path d="${kp}" stroke="#18181a" stroke-width="${r(0.005 * L)}" fill="none"/><path d="${hp}" stroke="#7a756a" stroke-width="${r(0.007 * L)}" fill="none"/></g>`);
    S.def(`<g id="${S.id("lkd")}"><path d="${lp}" fill="#242427" stroke="#0e0e10" stroke-width="${r(0.005 * L)}"/><path d="${kp}" stroke="#101012" stroke-width="${r(0.005 * L)}" fill="none"/></g>`);
    S.def(`<g id="${S.id("lks")}"><path d="${lp}" fill="#3a3934" stroke="#141416" stroke-width="${r(0.005 * L)}"/><path d="${hp}" stroke="${SP}" stroke-width="${r(0.008 * L)}" fill="none"/></g>`);
    loewe.lk = true;
  }
  const locke = (x, y, grad, sc, hell) => { const v = hell ? (z() < 0.25 ? "lks" : "lkh") : "lkd", sx = z() < 0.5 ? -sc : sc; return `<use href="#${S.id(v)}" transform="translate(${P(x, y)}) rotate(${Math.round(grad)}) scale(${sx.toFixed(2)} ${sc.toFixed(2)})"/>`; };
  let g = "";
  /* Schwanz mit Quaste, um die Hinterpranke gelegt */
  g += `<path d="M${P(-0.47, 0.1)} C${P(-0.62, 0.05)} ${P(-0.52, 0)} ${P(-0.3, 0.012)} S${P(-0.12, 0.02)} ${P(-0.06, 0.03)}" stroke="${MI}" stroke-width="${r(0.026 * L)}" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M${P(-0.09, 0.03)} c${r(dir * 0.03 * L)} ${r(-0.03 * L)} ${r(dir * 0.07 * L)} ${r(-0.01 * L)} c${r(-dir * 0.02 * L)} ${r(0.025 * L)} ${r(-dir * 0.06 * L)} ${r(0.02 * L)} Z" fill="${D}"/>`;
  /* Rumpf: Kruppe, Senke vor der Kruppe, Widerrist unter der Mähne, Bauch */
  g += `<path d="M${P(-0.5, 0.02)} C${P(-0.53, 0.18)} ${P(-0.45, 0.3)} ${P(-0.34, 0.31)} C${P(-0.24, 0.32)} ${P(-0.16, 0.27)} ${P(-0.08, 0.27)} C${P(0, 0.27)} ${P(0.06, 0.31)} ${P(0.12, 0.34)} L${P(0.24, 0.3)} L${P(0.26, 0.06)} L${P(0.1, 0.02)} Z" fill="${EISEN}"/>`;
  g += `<path d="M${P(-0.45, 0.27)} C${P(-0.38, 0.32)} ${P(-0.27, 0.32)} ${P(-0.18, 0.285)} C${P(-0.12, 0.265)} ${P(-0.04, 0.27)} ${P(0.04, 0.31)}" stroke="${SP}" stroke-width="${r(0.01 * L)}" fill="none" opacity=".8"/>`;
  /* Schulterblatt als Lichtkante, Rippenbogen als weiche Schattenlinie */
  g += `<path d="M${P(-0.02, 0.29)} C${P(0.03, 0.24)} ${P(0.04, 0.17)} ${P(0.02, 0.11)}" stroke="${HL}" stroke-width="${r(0.01 * L)}" fill="none"/>`;
  g += `<path d="M${P(-0.14, 0.24)} C${P(-0.1, 0.16)} ${P(-0.08, 0.1)} ${P(-0.04, 0.05)}" stroke="#141416" stroke-width="${r(0.008 * L)}" fill="none" opacity=".5"/>`;
  /* Hinterkeule als Muskel (oben Licht, vorn eine Falte), Hinterpranke mit Zehen im Umriss */
  g += `<path d="M${P(-0.46, 0.05)} C${P(-0.5, 0.17)} ${P(-0.42, 0.27)} ${P(-0.31, 0.265)} C${P(-0.21, 0.26)} ${P(-0.14, 0.19)} ${P(-0.15, 0.11)} C${P(-0.16, 0.05)} ${P(-0.24, 0.03)} ${P(-0.3, 0.03)} Z" fill="${MI}"/>`;
  g += `<path d="M${P(-0.44, 0.2)} C${P(-0.4, 0.26)} ${P(-0.3, 0.27)} ${P(-0.22, 0.23)}" stroke="${SP}" stroke-width="${r(0.009 * L)}" fill="none" opacity=".75"/><path d="M${P(-0.2, 0.2)} C${P(-0.17, 0.15)} ${P(-0.17, 0.1)} ${P(-0.2, 0.06)}" stroke="#121214" stroke-width="${r(0.007 * L)}" fill="none" opacity=".6"/>`;
  const pranke = (x0, x1, y0, h, fill, licht) => {
    /* breite, runde Pranke: Unterarm, Handgelenk, vier Zehenwülste im Umriss */
    const tw = (x1 - x0) * 0.2;
    let p = `M${P(x0, y0)} L${P(x1 - tw * 0.6, y0)} Q${P(x1 + tw * 0.15, y0)} ${P(x1, y0 + h * 0.45)}`;
    for (let i = 0; i < 4; i++) { const xa = x1 - i * tw * 0.95, xb = xa - tw * 0.95; p += ` Q${P(xa + tw * 0.05, y0 + h * (0.95 + (i % 2) * 0.08))} ${P((xa + xb) / 2, y0 + h * (0.9 + (i % 2) * 0.1))} Q${P(xb + tw * 0.1, y0 + h * 0.98)} ${P(xb, y0 + h * 0.82)}`; }
    p += ` L${P(x0 + tw * 0.4, y0 + h * 0.85)}`;
    let o = `<path d="${p} Z" fill="${fill}"/>`;
    for (let i = 1; i < 4; i++) { const xv = x1 - i * tw * 0.95 + tw * 0.05; o += `<path d="M${P(xv, y0 + h * 0.85)} l${r(-dir * 0.004 * L)} ${r(0.035 * L)}" stroke="#0e0e10" stroke-width="${r(0.006 * L)}"/>`; }
    if (licht) o += `<path d="M${P(x1 - tw * 3.4, y0 + h * 0.97)} Q${P(x1 - tw * 1.6, y0 + h * 1.08)} ${P(x1 - tw * 0.1, y0 + h * 0.8)}" stroke="${SP}" stroke-width="${r(0.008 * L)}" fill="none"/>`;
    return o;
  };
  g += pranke(-0.32, -0.04, 0, 0.055, MI, true);
  /* Vorderbeine: hinteres dunkler; vorderes mit Ellbogen, Handgelenk und Lichtkante */
  const bein = (dy, fill, licht, x1 = 0.6, nurPfote = false) => {
    let o = nurPfote ? `<path d="M${P(0.22, dy)} L${P(0.42, dy)} L${P(0.42, 0.065 + dy)} L${P(0.28, 0.068 + dy)} Q${P(0.22, 0.07 + dy)} ${P(0.22, dy)} Z" fill="${fill}"/>` : `<path d="M${P(0.08, 0.25 + dy)} C${P(0.09, 0.15 + dy)} ${P(0.09, 0.07 + dy)} ${P(0.13, 0.03 + dy)} Q${P(0.15, dy)} ${P(0.21, dy)} L${P(0.42, dy)} L${P(0.42, 0.065 + dy)} L${P(0.28, 0.068 + dy)} C${P(0.23, 0.085 + dy)} ${P(0.2, 0.16 + dy)} ${P(0.19, 0.25 + dy)} Z" fill="${fill}"/>`;
    o += pranke(0.4, x1, dy, 0.075, fill, licht);
    if (licht) o += `<path d="M${P(0.28, 0.07 + dy)} L${P(0.42, 0.068 + dy)}" stroke="${SP}" stroke-width="${r(0.008 * L)}"/>` + (nurPfote ? "" : `<path d="M${P(0.13, 0.03 + dy)} q${r(dir * 0.004 * L)} ${r(-0.02 * L)} ${r(dir * 0.03 * L)} ${r(-0.025 * L)}" stroke="${HL}" stroke-width="${r(0.007 * L)}" fill="none"/>`);
    return o;
  };
  g += bein(0.035, D, false, 0.57);
  if (wach) g += bein(0, EISEN, true);
  /* Mähne: Lockenkranz um den Kopf, Zotteln fallen schräg über Schulter und Brust bis auf das Vorderbein */
  const poly = wach ? [[0.24, 0.66], [0.15, 0.58], [0.09, 0.46], [0.06, 0.34], [0.08, 0.25], [0.15, 0.2], [0.23, 0.16], [0.31, 0.135], [0.37, 0.17], [0.4, 0.28], [0.38, 0.45], [0.36, 0.62], [0.31, 0.67]]
    : [[0.2, 0.43], [0.1, 0.39], [0.02, 0.3], [0.0, 0.19], [0.06, 0.12], [0.16, 0.09], [0.25, 0.1], [0.28, 0.2], [0.27, 0.32], [0.25, 0.41]];
  const mx = wach ? 0.2 : 0.16, my = wach ? 0.36 : 0.26;
  const innen = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  let m = "";
  /* Randlocken zeigen nach außen und unten: so wird der Umriss zottig */
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length], n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / 0.04));
    for (let j = 0; j < n; j++) {
      const t = (j + z() * 0.5) / n, x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      let vx = (x - mx), vy = (y - my) - 0.9; const vl = Math.hypot(vx, vy); vx /= vl; vy /= vl;
      const grad = Math.atan2(-dir * vx, -vy) * 180 / Math.PI;
      m += locke(x, y, grad, 0.85 + z() * 0.4, y > my && z() < 0.7);
    }
  }
  m += `<path d="M${poly.map(([x, y]) => P(x, y)).join(" L")} Z" fill="${D}"/>`;
  /* innere Reihen von unten nach oben: die oberen Locken liegen über den unteren */
  for (let y = poly.reduce((a, q) => Math.min(a, q[1]), 9) + 0.05; y < 0.66; y += 0.05) {
    for (let x = 0.02 + z() * 0.03; x < 0.42; x += 0.05) {
      const yy = y + (z() - 0.5) * 0.015;
      if (!innen(x, yy)) continue;
      m += locke(x, yy, 18 * dir + (z() - 0.5) * 20, 0.9 + z() * 0.3, yy > my - 0.06 || (x > mx && z() < 0.6));
    }
  }
  g += m;
  /* Kopf: lange, breite Schnauze, schwerer Unterkiefer, Braue mit Licht, Auge im Schatten, Kinnlocken */
  const kopf = (ox, oy, rot) => {
    const Q = (x, y) => { const c = Math.cos(rot), sn = Math.sin(rot); const ks = wach ? 1.15 : 1.02; x *= ks; y *= ks; return P(x * c - y * sn + ox, x * sn + y * c + oy); };
    let h = `<path d="M${Q(-0.1, 0.06)} C${Q(-0.08, 0.12)} ${Q(-0.02, 0.135)} ${Q(0.04, 0.125)} C${Q(0.08, 0.12)} ${Q(0.1, 0.1)} ${Q(0.115, 0.075)} C${Q(0.15, 0.06)} ${Q(0.19, 0.04)} ${Q(0.205, 0.02)} Q${Q(0.218, 0)} ${Q(0.207, -0.025)} C${Q(0.2, -0.04)} ${Q(0.19, -0.05)} ${Q(0.182, -0.05)} C${Q(0.188, -0.07)} ${Q(0.172, -0.1)} ${Q(0.14, -0.106)} C${Q(0.09, -0.116)} ${Q(0.03, -0.11)} ${Q(0, -0.09)} C${Q(-0.04, -0.07)} ${Q(-0.08, -0.02)} ${Q(-0.1, 0.06)} Z" fill="${EISEN}"/>`;
    /* Lichtfläche auf Stirn und Nasenrücken (Licht von rechts oben) */
    h += `<path d="M${Q(-0.02, 0.115)} C${Q(0.04, 0.125)} ${Q(0.09, 0.105)} ${Q(0.12, 0.075)} C${Q(0.16, 0.058)} ${Q(0.19, 0.038)} ${Q(0.2, 0.02)} C${Q(0.16, 0.02)} ${Q(0.11, 0.035)} ${Q(0.07, 0.06)} C${Q(0.04, 0.08)} ${Q(0.01, 0.09)} ${Q(-0.02, 0.115)} Z" fill="#6e6a60" opacity=".45"/>`;
    /* Schatten unter der Braue, Braue mit Spitzlicht, Wangenmuskel */
    h += `<path d="M${Q(0.02, 0.075)} C${Q(0.06, 0.088)} ${Q(0.1, 0.082)} ${Q(0.12, 0.068)} L${Q(0.11, 0.045)} C${Q(0.08, 0.055)} ${Q(0.05, 0.055)} ${Q(0.02, 0.05)} Z" fill="#111113"/>`;
    h += `<path d="M${Q(0.0, 0.08)} C${Q(0.05, 0.1)} ${Q(0.1, 0.092)} ${Q(0.125, 0.07)}" stroke="${SP}" stroke-width="${r(0.009 * L)}" fill="none"/>`;
    h += `<path d="M${Q(0.03, 0.03)} C${Q(0.07, 0.01)} ${Q(0.1, -0.02)} ${Q(0.11, -0.05)}" stroke="#121214" stroke-width="${r(0.007 * L)}" fill="none" opacity=".7"/>`;
    h += wach ? `<path d="M${Q(0.055, 0.052)} Q${Q(0.075, 0.064)} ${Q(0.095, 0.052)} Q${Q(0.075, 0.044)} ${Q(0.055, 0.052)} Z" fill="#3a3a3c"/><circle cx="${Q(0.083, 0.054).split(" ")[0]}" cy="${Q(0.083, 0.054).split(" ")[1]}" r="${r(0.004 * L)}" fill="${SP}"/>`
      : `<path d="M${Q(0.05, 0.048)} Q${Q(0.075, 0.04)} ${Q(0.1, 0.05)}" stroke="#0e0e10" stroke-width="${r(0.007 * L)}" fill="none"/>`;
    /* Nasenrücken als Lichtkante, breite Nase, Schnurrhaarpolster, geschlossenes Maul, schwerer Unterkiefer */
    h += `<path d="M${Q(0.12, 0.072)} C${Q(0.15, 0.058)} ${Q(0.18, 0.042)} ${Q(0.2, 0.022)}" stroke="${SP}" stroke-width="${r(0.011 * L)}" fill="none" stroke-linecap="round"/>`;
    h += `<path d="M${Q(0.188, 0.012)} L${Q(0.214, -0.004)} Q${Q(0.216, -0.022)} ${Q(0.205, -0.03)} L${Q(0.18, -0.022)} Z" fill="#0e0e10"/>`;
    h += `<path d="M${Q(0.185, -0.04)} C${Q(0.16, -0.04)} ${Q(0.12, -0.045)} ${Q(0.09, -0.058)}" stroke="#0e0e10" stroke-width="${r(0.008 * L)}" fill="none"/><path d="M${Q(0.19, -0.035)} C${Q(0.17, -0.015)} ${Q(0.14, -0.012)} ${Q(0.12, -0.025)}" stroke="${HL}" stroke-width="${r(0.006 * L)}" fill="none"/>`;
    h += `<path d="M${Q(0.17, -0.07)} C${Q(0.13, -0.09)} ${Q(0.06, -0.095)} ${Q(0.02, -0.08)}" stroke="#121214" stroke-width="${r(0.007 * L)}" fill="none" opacity=".6"/>`;
    /* Kinnbart: drei kurze, eingerollte Locken unter dem Kinn */
    h += `<path d="M${Q(0.15, -0.1)} Q${Q(0.155, -0.13)} ${Q(0.13, -0.128)} Q${Q(0.12, -0.14)} ${Q(0.1, -0.128)} Q${Q(0.085, -0.138)} ${Q(0.07, -0.122)} Q${Q(0.055, -0.125)} ${Q(0.05, -0.105)} Z" fill="${MI}" stroke="#0e0e10" stroke-width="${r(0.005 * L)}"/><path d="M${Q(0.13, -0.112)} q${r(dir * -0.004 * L)} ${r(0.012 * L)} ${r(dir * -0.012 * L)} ${r(0.014 * L)} M${Q(0.098, -0.112)} q${r(dir * -0.004 * L)} ${r(0.012 * L)} ${r(dir * -0.012 * L)} ${r(0.012 * L)}" stroke="#0e0e10" stroke-width="${r(0.004 * L)}" fill="none"/>`;
    /* Lockenkranz: einige Locken liegen über dem Hinterkopf und rahmen das Gesicht */
    for (let i = 0; i < 7; i++) { const a = Math.PI * (0.64 + i * 0.13), [cx, cy] = Q(Math.cos(a) * 0.115 - 0.01, Math.sin(a) * 0.12 + 0.01).split(" ").map(Number); h += `<use href="#${S.id(i % 3 ? "lkd" : "lkh")}" transform="translate(${cx} ${cy}) rotate(${Math.round(Math.atan2(-dir * Math.cos(a), 1.3 - Math.sin(a)) * 180 / Math.PI)}) scale(.8)"/>`; }
    return h;
  };
  g += wach ? kopf(0.35, 0.45, 0.05) : kopf(0.37, 0.19, -0.14);
  /* der schlafende Löwe legt den Kopf auf die gekreuzten Pranken: die vordere liegt über dem Unterkiefer */
  if (!wach) g += `<g transform="translate(${r(dir * 0.05 * L)} ${r(-0.022 * L)})">${bein(0, EISEN, true, 0.58, true)}</g>`;
  return g;
}
/* Sockel aus Sandstein in Perspektive: Vorderseite mit Quaderfugen, Flecken und bestoßenen Kanten,
   profiliertes Deckgesims, die Oberseite (wir sehen von oben drauf) und die Seitenfläche zur Bildmitte */
function sockelP(lat, d, breite, tiefe, hoehe) {
  const [ox, oy] = proj(lat, d);
  const Q = (la, dd, h) => { const [xx, yy] = proj(la, dd, h); return [r(xx - ox), r(yy - oy)]; };
  const l0 = lat - breite / 2, l1 = lat + breite / 2, d0 = d, d1 = d + tiefe, innen = lat < 0 ? l1 : l0, aus = lat < 0 ? 0.06 : -0.06;
  const zz = zufall(Math.round(lat * 10) + 50);
  /* drei Lagen verschieden hoch, Läuferverband (Stoßfugen nie übereinander) */
  const lagen = [0.1, 0.36, 0.56, hoehe - 0.12];
  let g = "";
  /* Seitenfläche zur Mitte (rechts im Licht, links im Schatten), Fugen laufen ums Eck weiter */
  g += `<path d="${pfad([Q(innen, d0, 0), Q(innen, d1, 0), Q(innen, d1, hoehe), Q(innen, d0, hoehe)])}" fill="${lat < 0 ? "#d6caac" : "#8f8670"}"/>`;
  let sf = "";
  for (const h of lagen.slice(1, 3)) sf += `M${Q(innen, d0, h).join(" ")} L${Q(innen, d1, h).join(" ")} `;
  sf += `M${Q(innen, d0 + tiefe * 0.55, lagen[0]).join(" ")} L${Q(innen, d0 + tiefe * 0.55, lagen[1]).join(" ")} M${Q(innen, d0 + tiefe * 0.3, lagen[1]).join(" ")} L${Q(innen, d0 + tiefe * 0.3, lagen[2]).join(" ")} M${Q(innen, d0 + tiefe * 0.7, lagen[2]).join(" ")} L${Q(innen, d0 + tiefe * 0.7, lagen[3]).join(" ")}`;
  g += `<path d="${sf}" stroke="#7a705c" stroke-width=".35" fill="none"/>`;
  /* Vorderseite */
  const vf = [Q(l0, d0, 0), Q(l1, d0, 0), Q(l1, d0, hoehe), Q(l0, d0, hoehe)];
  g += `<path d="${pfad(vf)}" fill="${S.lg("sockelst", [[0, "#a49880"], [0.6, "#c9bd9f"], [1, "#ddd1b4"]], 0, 0, 1, 0)}"/>`;
  const [ax, ay] = vf[0], [bx] = vf[1], [, cy] = vf[2], Hh = (h) => r(ay + (cy - ay) * h / hoehe), Xb = (t) => r(ax + (bx - ax) * t);
  let fu = "";
  for (const h of lagen.slice(1, 3)) fu += `M${ax} ${Hh(h)} H${bx} `;
  const stoss = [[0.28, 0.71], [0.12, 0.5, 0.88], [0.36, 0.78]];
  stoss.forEach((ts, i) => { for (const t of ts) fu += `M${Xb(t + (zz() - 0.5) * 0.04)} ${Hh(lagen[i])} V${Hh(lagen[i + 1])} `; });
  g += `<path d="${fu}" stroke="#857a62" stroke-width=".4" fill="none"/><path d="${fu.replace(/M([\d.]+) /g, (m0, xv) => `M${r(+xv + 0.35)} `)}" stroke="#efe6cf" stroke-width=".2" fill="none" opacity=".5"/>`;
  /* Tonwerte: Spritzwasser und grüner Moosschleier am Fuß, einzelne Steine etwas heller oder dunkler */
  g += `<path d="${pfad([Q(l0, d0, 0.1), Q(l1, d0, 0.1), Q(l1, d0, 0.3), Q(l0, d0, 0.3)])}" fill="${S.lg("spritz", [[0, "#5d6a3e", 0], [1, "#5d6a3e", 0.35]], 0, 0, 0, 1)}"/>`;
  for (let i = 0; i < 3; i++) { const t0 = zz() * 0.7, li = Math.floor(zz() * 3); g += `<rect x="${Xb(t0)}" y="${Hh(lagen[li + 1])}" width="${r((bx - ax) * (0.12 + zz() * 0.15))}" height="${r(Hh(lagen[li]) - Hh(lagen[li + 1]))}" fill="${zz() < 0.5 ? "#7a705e" : "#f2e9d4"}" opacity=".16"/>`; }
  /* bestoßene Kanten an drei Ecken */
  g += `<path d="M${ax} ${r(cy + 2)} l1.6 -1.4 l.4 2.4 Z M${r(bx - 0.2)} ${r(ay - 3)} l-1.4 1 l1.3 1.2 Z M${Xb(0.5)} ${r(cy + 0.1)} l1.5 .9 l1.1 -.9 Z" fill="#8a7e66"/>`;
  /* Deckgesims ums Eck (vorn und an der Seite) und Oberseite */
  const tp = [Q(l0 - 0.06, d0 - 0.06, hoehe), Q(l1 + 0.06, d0 - 0.06, hoehe), Q(l1 + 0.06, d1 + 0.06, hoehe), Q(l0 - 0.06, d1 + 0.06, hoehe)];
  g += `<path d="${pfad([Q(innen + aus, d0 - 0.06, hoehe - 0.12), Q(innen + aus, d1 + 0.06, hoehe - 0.12), Q(innen + aus, d1 + 0.06, hoehe), Q(innen + aus, d0 - 0.06, hoehe)])}" fill="${lat < 0 ? "#efe6cf" : "#a39a84"}"/>`;
  g += `<path d="${pfad([Q(l0 - 0.06, d0 - 0.06, hoehe - 0.12), Q(l1 + 0.06, d0 - 0.06, hoehe - 0.12), tp[1], tp[0]])}" fill="#e6dcc2"/>`;
  const ea = lat < 0 ? l1 + 0.06 : l0 - 0.06, eb = lat < 0 ? l0 - 0.06 : l1 + 0.06;
  g += `<path d="M${Q(innen + aus, d1 + 0.06, hoehe - 0.12).join(" ")} L${Q(ea, d0 - 0.06, hoehe - 0.12).join(" ")} L${Q(eb, d0 - 0.06, hoehe - 0.12).join(" ")}" stroke="#6e6452" stroke-width=".5" fill="none"/>`;
  g += `<path d="${pfad(tp)}" fill="#d6cbb0"/>`;
  /* Fußplatte, ebenfalls ums Eck */
  g += `<path d="${pfad([Q(innen + aus * 0.8, d0 - 0.05, 0), Q(innen + aus * 0.8, d1 + 0.05, 0), Q(innen + aus * 0.8, d1 + 0.05, 0.1), Q(innen + aus * 0.8, d0 - 0.05, 0.1)])}" fill="${lat < 0 ? "#b5aa90" : "#827a66"}"/>`;
  g += `<path d="${pfad([Q(l0 - 0.05, d0 - 0.05, 0), Q(l1 + 0.05, d0 - 0.05, 0), Q(l1 + 0.05, d0 - 0.05, 0.1), Q(l0 - 0.05, d0 - 0.05, 0.1)])}" fill="#9a8f78"/>`;
  return { svg: g, oben: r(Q(lat, d0 + tiefe * 0.4, hoehe)[1]) };
}
{
  const d = 13.6, lat = -3.4, [x, y] = proj(lat, d), s = km(y), L = 2.0 * s;
  const so = sockelP(lat, d, 2.5, 1.1, 0.8);
  /* ein Kind sitzt rittlings auf dem Rücken des wachen Löwen: die Beine hängen über die Flanke, die Hände in der Mähne */
  const reit = Object.assign({}, POSEN.sitzen, { lende: 4, brust: 8, nacken: 2, kopf: -8,
    huefteL: { vor: 48, seit: 4, dreh: 0 }, knieL: 50, fussL: 10, huefteR: { vor: 46, seit: 4, dreh: 0 }, knieR: 48, fussR: 10,
    schulterL: { vor: 62, seit: 10 }, ellbogenL: 34, unterarmL: -20, handL: 0, fingerL: 0.6, schulterR: { vor: 70, seit: 12 }, ellbogenR: 30, unterarmR: -20, handR: 0, fingerR: 0.6 });
  const kd = figur({ id: "lbk_reiter", alter: "kind", geschlecht: "m", pose: reit, blick: 72, frisur: "kurz", haarfarbe: "braun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2f8fbf" }, unterteil: { stueck: "shorts", farbe: "#3d5f8c" }, schuhe: { stueck: "turnschuh" } } }, 1.05 * s);
  const gs = kd.z.punkte.gesaess, sitzX = gs[0] * kd.k, sitzY = gs[1] * kd.k;
  const sx = r(-0.07 * L - sitzX), sy = r(so.oben - 0.285 * L - sitzY);
  REITER = { x: x + sx + sitzX, y: y + sy + sitzY, hand: [kd.z.handL, kd.z.handR].map((h2) => [r(x + sx + h2.x * kd.k), r(y + sy + h2.y * kd.k)]), L, ox: x, oy: y + so.oben };
  const k = so.svg + `<g transform="translate(0 ${so.oben})">${loewe(L, true, 1)}</g>` + `<g transform="translate(${sx} ${sy})">${kd.svg}</g>`;
  schlag(lat, d, 1.95, 2.5, 0.5);
  if (process.env.DBG) console.error("REITER", JSON.stringify(REITER));
  S.teil({ id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x, y, steht: true, kunst: k,
    tipp: "Vor dem Holstentor liegen zwei Löwen aus Eisen. Einer wacht, der andere schläft. Kinder setzen sich gern auf sie." });
}
{
  const d = 13.6, lat = 4.6, [x, y] = proj(lat, d), s = km(y), L = 2.0 * s;
  const so = sockelP(lat, d, 2.5, 1.1, 0.8);
  const k = so.svg + `<g transform="translate(0 ${so.oben})">${loewe(L, false, -1)}</g>`;
  schlag(lat, d, 1.6, 2.5, 0.5);
  S.teil({ id: "loewe2", de: "der schlafende Löwe", syl: "SCHLA-fen-de LÖ-we", it: "il leone che dorme", itSyl: "le-O-ne che DOR-me", en: "sleeping lion", x, y, steht: true, kunst: k,
    tipp: "Dieser Löwe schläft. Der andere Löwe passt auf ihn auf." });
}

/* Schlagschatten auf Rasen und Weg (geklippt, damit nichts über die Ränder wächst) */
const SCH = `<g filter="url(#${S.id("schw")})">${SCHATTEN.join("")}</g>`;
RASEN_TEIL.kunst += `<g clip-path="url(#${S.id("rasenclip")})">${SCH}</g>`;
WEG_TEIL.kunst += `<g clip-path="url(#${S.id("wegclip")})">${SCH}</g>`;

/* warmes Nachmittagslicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="${W}" height="${HH}" fill="${S.rg("abend", [[0, "#ffd9a0", 0.16], [0.6, "#ffd9a0", 0], [1, "#000", 0.08]], 0.95, 0.55, 1.1)}" pointer-events="none"/>`);

/* Schlagschatten des Tores auch über Hecke und Baumfüße (nur unten, Kronen bleiben hell) */
{
  const bt = S.teile.find((t) => t.id === "baum");
  S.def(`<clipPath id="${S.id("fussclip")}"><rect x="0" y="${HOR - 6}" width="${W}" height="20"/></clipPath>`);
  bt.kunst += `<g clip-path="url(#${S.id("fussclip")})"><path d="${S.TORSCHATTEN}" fill="#1e2a12" opacity=".4" filter="url(#${S.id("schw")})"/></g>`;
}

/* Ladezeit: alle Pfade relativ und auf 0,1 gerundet */
for (const t of S.teile) { t.kunst = verdichteSVG(t.kunst, 0.1); for (const u of t.unter || []) u.kunst = verdichteSVG(u.kunst, 0.1); }
S.kulisse = S.kulisse.map((x) => verdichteSVG(x, 0.1)); S.defs = S.defs.map((x) => verdichteSVG(x, 0.1)); S.vorne = S.vorne.map((x) => verdichteSVG(x, 0.1));
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/luebeck.js"));
console.log(aus);
