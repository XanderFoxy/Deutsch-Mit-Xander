#!/usr/bin/env node
/* =====================================================================
   DER KINDERGARTEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Raumkonzepte deutscher Kitas, z. B. Ev. Kita Rauhe Hardt,
   Kita Grauelsbaum „Das Raumkonzept“; Betzold-Ratgeber Eingangsbereich):
   - Der GRUPPENRAUM ist in Spielecken gegliedert: die BAUECKE mit
     Straßenteppich, Bauklötzen, Holzeisenbahn und offenen Regalen voller
     beschrifteter SPIELZEUGKISTEN (Bildkarten statt Schrift), die
     PUPPENECKE mit Spielküche (Herd, Spüle, Töpfe) und Puppenwagen, der
     MALTISCH mit niedrigen Kinderstühlen (Sitzhöhe ≈ 30 cm), dazu eine
     Bücherwand mit Bilderbüchern, die mit dem Titelbild nach vorn stehen.
   - Der MORGENKREIS: Sitzkissen im Kreis auf einem runden Teppich, in der
     Mitte oft eine Klangschale; die Erzieherin sitzt mit den Kindern auf
     dem Boden.
   - Die GARDEROBE: jedes Kind hat einen festen Platz mit Haken, Ablage und
     Schuhrost; über dem Haken klebt sein ZEICHEN (Sonne, Fisch, Blume …),
     weil die Kinder noch nicht lesen. Dort hängen Matschhose und
     Rucksack, unten stehen Gummistiefel und Hausschuhe; Brotdose und
     Trinkflasche liegen auf der Ablage.
   - An den Wänden: Bilder der Kinder an der Pinnwand, ein Geburtstags-
     kalender (oft ein Geburtstagszug), große, niedrige Fenster mit Blick
     in den Garten, Heizkörper mit Holzverkleidung als Schutz.
   BLICK: frontal auf die Rückwand, Augenhöhe 1,5 m, Fluchtpunkt Mitte.
   Maßstab: Rückwand 38 Einheiten je Meter (Fuß bei y = 118), vorn bis
   ≈ 80 je Meter. Erzieherin 1,66 m, Kinder 1,12–1,16 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kindergarten", titel: "Der Kindergarten", emoji: "🧩", thema: "Bildung", kuerzel: "b10a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 61, E = 1.5, D = 5, S0 = 38, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
/* Rechteck in einer Ebene parallel zur Rückwand (Tiefe z) */
const rz = (X0, X1, H0, H1, z, fill, extra = "") => { const s = sk(z); return `<rect x="${r(VX + X0 * s)}" y="${r(HY + (E - H1) * s)}" width="${r((X1 - X0) * s)}" height="${r((H1 - H0) * s)}" fill="${fill}"${extra ? " " + extra : ""}/>`; };
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}
/* Ellipse auf dem Boden (Kreis mit Radius R um X, z) als Pfad */
const ring = (X, z, R, H = 0, n = 36) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return P(X + Math.cos(a) * R, H, z + Math.sin(a) * R); });
/* Vieleck am Bildrand (x = 0 … 320) abschneiden */
function clipX(pts) {
  let out = pts;
  for (const [g, innen] of [[0, (x) => x >= 0], [320, (x) => x <= 320]]) {
    const a = out; out = [];
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = a[(i + 1) % a.length], pi = innen(p[0]), qi = innen(q[0]);
      if (pi) out.push(p);
      if (pi !== qi) { const t = (g - p[0]) / (q[0] - p[0]); out.push([g, r(p[1] + t * (q[1] - p[1]))]); }
    }
  }
  return out;
}
const polyC = (pts, fill, extra = "") => { const c = clipX(pts); return c.length > 2 ? poly(c, fill, extra) : ""; };
/* Fläche im Bild relativ zum Anker eines Teils */
const fl = (ax, ay, x0, y0, x1, y1) => flaeche(x0 - ax, y0 - ay, x1 - x0, y1 - y0);

/* ---------- Haltungen ------------------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b10a_malen = Object.assign({}, MP.sitzen, { lende: 6, brust: 8, nacken: 14, kopf: 10,
  schulterL: { vor: 38, seit: 14 }, ellbogenL: 62, unterarmL: -70, handL: 0, fingerL: 0.45,
  schulterR: { vor: 42, seit: 10 }, ellbogenR: 66, unterarmR: -70, handR: -10, fingerR: 0.6 });
MP.b10a_bauen = Object.assign({}, MP.knien, { lende: 6, brust: 6, nacken: 8, kopf: 6,
  schulterR: { vor: 70, seit: 14 }, ellbogenR: 26, unterarmR: -40, handR: 4, fingerR: 0.5,
  schulterL: { vor: 22, seit: 10 }, ellbogenL: 40, unterarmL: -40, handL: 0, fingerL: 0.4 });

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const BIRKE = S.lg("birke", [[0, "#f1e1c0"], [1, "#dcc59a"]]);
const BIRKE_S = S.lg("birkes", [[0, "#cfb68a"], [1, "#e3cfa8"]], 0, 0, 1, 0);
const KANTE = "#c9ad7d";
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e6e8e6"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const tx = (x, y, s, t, f = "#333", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Arial,sans-serif"${extra}>${t}</text>`;

/* =====================================================================
   KULISSE — Decke mit Leuchten, warme Wand mit Farbsockel, Holzboden
   ===================================================================== */
const WU = P(0, 0, 0)[1], WO = P(0, 2.8, 0)[1];
{
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#ebe6dc"], [1, "#f6f2ea"]])}"/>`;
  for (const X of [-2.6, 0, 2.6]) k += poly([P(X - 0.55, 2.8, 0.2), P(X + 0.55, 2.8, 0.2), P(X + 0.55, 2.8, 0.72), P(X - 0.55, 2.8, 0.72)], "#fffdf4", 'stroke="#d9d3c6" stroke-width=".4"');
  k += `<rect x="0" y="${WO}" width="320" height="${WU - WO}" fill="${S.lg("wand", [[0, "#f7efe0"], [1, "#efe3cc"]])}"/>`;
  k += `<rect x="0" y="${WO}" width="320" height="${WU - WO}" fill="${S.rg("wandlicht", [[0, "#fffaf0", 0.6], [1, "#fffaf0", 0]], 0.45, 0.3, 0.7)}"/>`;
  /* Farbsockel bis 1 m (abwischbar, pastellgrün) mit Zierleiste */
  const y1 = P(0, 1, 0)[1];
  k += `<rect x="0" y="${y1}" width="320" height="${r(WU - y1)}" fill="${S.lg("sockelfarbe", [[0, "#cfe3cf"], [1, "#bcd6bd"]])}"/><rect x="0" y="${r(y1 - 0.8)}" width="320" height="1.6" fill="#e8d6ae"/>`;
  k += `<rect x="0" y="${r(WU - 2.6)}" width="320" height="2.6" fill="#c9ad7d"/>`;
  /* Boden: Eichendielen in Flucht, versetzte Stöße */
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#c79b67"], [1, "#b98a55"]])}"/>`;
  for (let i = -30; i <= 30; i++) { const a = P(i * 0.18, 0, 0), b = P(i * 0.18, 0, 3.2); f += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9a7243" stroke-width=".3" opacity=".7"/>`; }
  for (let i = -30; i <= 30; i++) { const z = 0.3 + rnd() * 2.6; const a = P(i * 0.18, 0, z), b = P((i + 1) * 0.18, 0, z); f += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#94693b" stroke-width=".3" opacity=".6"/>`; }
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  S.hinten(k + f);
}

/* =====================================================================
   1 — DIE PINNWAND mit Kinderbildern (links oben)
   ===================================================================== */
{
  const [x0, y0] = P(-4.1, 1.95, 0), [x1, y1] = P(-2.15, 1.2, 0);
  let k = `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" rx=".8" fill="#b88d5a"/>`;
  k += `<rect x="${r(x0 + 1.2)}" y="${r(y0 + 1.2)}" width="${r(x1 - x0 - 2.4)}" height="${r(y1 - y0 - 2.4)}" fill="${S.lg("kork", [[0, "#d9b07a"], [1, "#c99d66"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(x0 + 2 + rnd() * (x1 - x0 - 4))}" cy="${r(y0 + 2 + rnd() * (y1 - y0 - 4))}" r=".25" fill="#a77d4a" opacity=".6"/>`;
  /* fünf Kinderbilder: Sonne + Haus, Familie, Regenbogen, Katze, Blumenwiese */
  const bilder = [[x0 + 4, y0 + 3, -3], [x0 + 21, y0 + 2.6, 2], [x0 + 38, y0 + 3.4, -2], [x0 + 55, y0 + 3, 3], [x0 + 12, y0 + 13.6, 2], [x0 + 30, y0 + 14, -3], [x0 + 47, y0 + 13.4, 1]];
  bilder.forEach(([bx, by, dr], i) => {
    let g = `<rect x="0" y="0" width="13" height="9.4" fill="#fffef9"/>`;
    if (i % 4 === 0) g += `<circle cx="10" cy="2.4" r="1.6" fill="#f6c434"/><path d="M2.5 8.5 V5 L5 3 L7.5 5 V8.5 Z" fill="#e0553f"/><rect x="0" y="8.4" width="13" height="1" fill="#6dbb52"/>`;
    else if (i % 4 === 1) for (let j = 0; j < 3; j++) g += `<circle cx="${3 + j * 3.4}" cy="${3.2 + (j === 2 ? 1.2 : 0)}" r="${j === 2 ? 0.9 : 1.1}" fill="none" stroke="#2b5fa8" stroke-width=".35"/><path d="M${3 + j * 3.4} ${4.3 + (j === 2 ? 1.2 : 0)} v2.6 m-1.2 -1.8 h2.4 m-2 3.6 l.8 -1.8 l.8 1.8" stroke="${["#d6402f", "#2b5fa8", "#3a9a4c"][j]}" stroke-width=".35" fill="none"/>`;
    else if (i % 4 === 2) ["#e0453a", "#f29a2e", "#f6d23a", "#57b05a", "#3c7fd0"].forEach((c, j) => { g += `<path d="M${1.5 + j * 0.6} 8.5 A${5 - j * 0.6} ${5 - j * 0.6} 0 0 1 ${11.5 - j * 0.6} 8.5" stroke="${c}" stroke-width=".55" fill="none"/>`; });
    else g += `<ellipse cx="6.5" cy="6" rx="3" ry="2.2" fill="#f0913a"/><circle cx="4" cy="3.6" r="1.6" fill="#f0913a"/><path d="M3 2.4 l.3 -1.2 l.6 1 M4.2 2.2 l.4 -1.1 l.4 1.1" fill="#f0913a" stroke="#f0913a" stroke-width=".3"/><path d="M9.4 6 q2 -1 1.6 -3" stroke="#f0913a" stroke-width=".6" fill="none"/>`;
    k += `<g transform="translate(${r(bx)} ${r(by)}) rotate(${dr})">${g}<circle cx="6.5" cy=".6" r=".55" fill="${["#d6402f", "#2b5fa8", "#f6c434", "#3a9a4c"][i % 4]}"/></g>`;
  });
  const [ax, ay] = P(-3.12, 1.2, 0);
  S.teil({ id: "kg_pinnwand", de: "die Pinnwand", syl: "PINN-wand", it: "la bacheca", itSyl: "ba-CHE-ca", en: "pinboard", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "An der Pinnwand hängen die Bilder, die die Kinder gemalt haben." });
}

/* =====================================================================
   2 — DIE UHR (über dem Fenster)
   ===================================================================== */
{
  let k = `<circle r="6" fill="#e04a3a"/><circle r="5.1" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#efeae0"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += tx(Math.sin(a) * 3.9, -Math.cos(a) * 3.9 + 0.6, 1.5, i || 12, "#333"); }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(9.25 * Math.PI / 6) * 2.4)}" y2="${r(-Math.cos(9.25 * Math.PI / 6) * 2.4)}" stroke="#222" stroke-width=".7" stroke-linecap="round"/><line x1="0" y1="0" x2="${r(Math.sin(3 * Math.PI / 6) * 3.4)}" y2="0" stroke="#222" stroke-width=".45" stroke-linecap="round"/><circle r=".5" fill="#e04a3a"/>`;
  k += `<path d="M-4 -3.6 A5 5 0 0 1 2 -4.8" stroke="#fff" stroke-width=".6" opacity=".7" fill="none"/>`;
  const [ax, ay] = P(-0.65, 2.56, 0);
  S.teil({ id: "kg_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: ax, y: ay, kunst: k,
    tipp: "Viertel nach neun: Gleich beginnt der Morgenkreis." });
}

/* =====================================================================
   3 — DER GEBURTSTAGSKALENDER (Geburtstagszug, über der Spielküche)
   ===================================================================== */
{
  const [x0, y0] = P(0.85, 1.92, 0), [, y1] = P(0.85, 1.5, 0);
  const h = y1 - y0;
  let k = `<path d="M${r(x0 - 2)} ${r(y1 + 0.6)} H${r(x0 + 50)}" stroke="#8a6a44" stroke-width=".8"/>`;
  /* Lok */
  const lx = x0;
  k += `<rect x="${r(lx)}" y="${r(y0 + h * 0.35)}" width="10" height="${r(h * 0.55)}" rx=".8" fill="#d6402f"/><rect x="${r(lx + 5.5)}" y="${r(y0 + h * 0.08)}" width="4.5" height="${r(h * 0.4)}" rx=".5" fill="#2b5fa8"/><rect x="${r(lx + 1)}" y="${r(y0 + h * 0.16)}" width="2" height="${r(h * 0.22)}" fill="#333"/>`;
  for (const dx of [2.5, 7.5]) k += `<circle cx="${r(lx + dx)}" cy="${r(y1)}" r="1.6" fill="#333"/><circle cx="${r(lx + dx)}" cy="${r(y1)}" r=".6" fill="#ccc"/>`;
  const farben = ["#f6c434", "#3a9a4c", "#2b5fa8", "#e0853a", "#a1559e", "#3bb3c3"];
  const monat = ["Jan Feb", "Mär Apr", "Mai Jun", "Jul Aug", "Sep Okt", "Nov Dez"];
  for (let i = 0; i < 6; i++) {
    const wx = lx + 11.5 + i * 7.6;
    k += `<rect x="${r(wx)}" y="${r(y0 + h * 0.22)}" width="6.8" height="${r(h * 0.68)}" rx=".6" fill="${farben[i]}"/>`;
    k += `<rect x="${r(wx + 0.5)}" y="${r(y0 + h * 0.3)}" width="5.8" height="2.2" fill="#fff" opacity=".9"/>` + tx(wx + 3.4, y0 + h * 0.3 + 1.7, 1.5, monat[i], "#333");
    for (let j = 0; j < 2; j++) k += `<circle cx="${r(wx + 2 + j * 2.8)}" cy="${r(y0 + h * 0.68)}" r="1" fill="${["#eec6a4", "#d7a179", "#f6dcc8", "#8d5a3b"][(i + j) % 4]}" stroke="#fff" stroke-width=".3"/>`;
    for (const dx of [1.6, 5.2]) k += `<circle cx="${r(wx + dx)}" cy="${r(y1)}" r="1.1" fill="#333"/>`;
  }
  const [ax, ay] = P(1.45, 1.5, 0);
  S.teil({ id: "kg_geburtstagskalender", de: "der Geburtstagskalender", syl: "ge-BURTS-tags-ka-len-der", it: "il calendario dei compleanni", itSyl: "ca-len-DA-rio dei com-ple-AN-ni", en: "birthday calendar", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Im Geburtstagszug hat jedes Kind ein Foto – im Wagen seines Geburtsmonats." });
}

/* =====================================================================
   4 — DAS FENSTER (groß und niedrig, Blick in den Garten)
   ===================================================================== */
const FE = { X0: -1.85, X1: 0.6, H0: 0.72, H1: 2.32 };
{
  const [x0, y0] = P(FE.X0, FE.H1, 0), [x1, y1] = P(FE.X1, FE.H0, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("himmel", [[0, "#9fcbea"], [0.6, "#d7ebf6"], [1, "#eef6ee"]])}"/>`;
  /* Garten: Bäume, Hecke, Wiese, ein Stück Zaun und das Spielhaus */
  k += `<path d="M${x0} ${r(y0 + h * 0.62)} Q${r(x0 + w * 0.3)} ${r(y0 + h * 0.55)} ${r(x0 + w * 0.55)} ${r(y0 + h * 0.6)} T${x1} ${r(y0 + h * 0.58)} V${y1} H${x0} Z" fill="#8fbf6e"/>`;
  for (const [cx, cy, rr, c] of [[0.12, 0.38, 0.16, "#5f9a48"], [0.28, 0.42, 0.12, "#6fae55"], [0.78, 0.34, 0.2, "#548f40"], [0.93, 0.45, 0.12, "#6aa651"]]) k += `<circle cx="${r(x0 + w * cx)}" cy="${r(y0 + h * cy)}" r="${r(w * rr * 0.6)}" fill="${c}"/><circle cx="${r(x0 + w * cx - w * rr * 0.2)}" cy="${r(y0 + h * cy - w * rr * 0.2)}" r="${r(w * rr * 0.3)}" fill="#fff" opacity=".12"/>`;
  k += `<rect x="${r(x0 + w * 0.775)}" y="${r(y0 + h * 0.48)}" width="2" height="${r(h * 0.16)}" fill="#6b4a2c"/>`;
  k += `<rect x="${x0}" y="${r(y0 + h * 0.66)}" width="${r(w)}" height="${r(h * 0.12)}" rx="2" fill="#4f8a3c"/>`;
  /* Spielhaus im Garten */
  const hx = x0 + w * 0.45, hy = y0 + h * 0.72;
  k += `<rect x="${r(hx)}" y="${r(hy - 8)}" width="11" height="8" fill="#f2c94c"/><path d="M${r(hx - 1.2)} ${r(hy - 8)} L${r(hx + 5.5)} ${r(hy - 13)} L${r(hx + 12.2)} ${r(hy - 8)} Z" fill="#d6402f"/><rect x="${r(hx + 4)}" y="${r(hy - 5)}" width="3" height="5" fill="#8a5a30"/>`;
  k += `<rect x="${x0}" y="${r(y0 + h * 0.8)}" width="${r(w)}" height="${r(h * 0.2)}" fill="#86b863"/>`;
  for (let i = 0; i < 16; i++) k += `<rect x="${r(x0 + 1 + i * (w / 16))}" y="${r(y0 + h * 0.74)}" width="1.1" height="${r(h * 0.12)}" fill="#e9e0cc"/>`;
  k += `<rect x="${x0}" y="${r(y0 + h * 0.77)}" width="${r(w)}" height=".8" fill="#e9e0cc"/>`;
  /* Rahmen: drei Flügel, weiß, Griffe mit Kindersicherung */
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="none" stroke="#f7f7f4" stroke-width="2.6"/>`;
  for (const t of [1 / 3, 2 / 3]) k += `<rect x="${r(x0 + w * t - 1.2)}" y="${y0}" width="2.4" height="${r(h)}" fill="#f2f2ee"/>`;
  for (const t of [1 / 3, 2 / 3]) k += `<rect x="${r(x0 + w * t - 3.2)}" y="${r(y0 + h * 0.5)}" width="1" height="3.2" rx=".4" fill="#c9cfd4"/><circle cx="${r(x0 + w * t - 2.7)}" cy="${r(y0 + h * 0.5 + 0.6)}" r=".55" fill="#9aa3aa"/>`;
  k += `<rect x="${r(x0 - 1.3)}" y="${r(y0 - 1.3)}" width="${r(w + 2.6)}" height="${r(h + 2.6)}" fill="none" stroke="#e1ddd3" stroke-width=".6"/>`;
  /* Spiegelungen */
  for (const t of [0.04, 0.37, 0.7]) k += `<path d="M${r(x0 + w * t)} ${r(y0 + h * 0.75)} L${r(x0 + w * (t + 0.1))} ${r(y0 + 2)} L${r(x0 + w * (t + 0.15))} ${r(y0 + 2)} L${r(x0 + w * (t + 0.05))} ${r(y0 + h * 0.75)} Z" fill="#fff" opacity=".16"/>`;
  /* Fensterbank mit Kresse im Eierkarton und einer Topfpflanze */
  k += kiste(FE.X0 - 0.05, FE.X1 + 0.05, FE.H0 - 0.04, FE.H0, 0, 0.2, { vorn: "#f4f2ec", deckel: "#ffffff" });
  {
    const [ex, ey] = P(-1.35, FE.H0, 0.1);
    k += `<rect x="${r(ex - 6)}" y="${r(ey - 2.4)}" width="12" height="2.4" rx=".6" fill="#d9cdb4"/>`;
    for (let i = 0; i < 6; i++) k += `<path d="M${r(ex - 5.4 + i * 2)} ${r(ey - 2.3)} q.3 -2 ${r(rnd() * 0.8 - 0.4)} -3.2 M${r(ex - 4.6 + i * 2)} ${r(ey - 2.3)} q.2 -1.6 .5 -2.6" stroke="#79b84f" stroke-width=".5" fill="none"/><circle cx="${r(ex - 5.4 + i * 2)}" cy="${r(ey - 5.4)}" r=".55" fill="#8cc95c"/>`;
    const [px, py] = P(0.25, FE.H0, 0.1);
    k += `<path d="M${r(px - 3)} ${r(py - 5)} L${r(px + 3)} ${r(py - 5)} L${r(px + 2.3)} ${py} L${r(px - 2.3)} ${py} Z" fill="#d0754a"/>`;
    for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.15 + i * 0.1); k += `<ellipse cx="${r(px + Math.cos(a) * 3.6)}" cy="${r(py - 6 + Math.sin(a) * 3.6)}" rx="2.2" ry=".9" fill="${i % 2 ? "#4c9a40" : "#5fae4f"}" transform="rotate(${r(a * 180 / Math.PI)} ${r(px + Math.cos(a) * 3.6)} ${r(py - 6 + Math.sin(a) * 3.6)})"/>`; }
  }
  const [ax, ay] = P((FE.X0 + FE.X1) / 2, FE.H0, 0);
  S.teil({ id: "kg_fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Kita-Fenster sind niedrig: So können auch kleine Kinder in den Garten schauen." });
}

/* =====================================================================
   5 — DER HEIZKÖRPER (mit Holzverkleidung unter dem Fenster)
   ===================================================================== */
{
  let k = kiste(-1.6, 0.35, 0.1, 0.6, 0, 0.12, { vorn: BIRKE, deckel: "#efe0bf", seite: BIRKE_S });
  const [x0, y0] = P(-1.6, 0.6, 0.12), [x1, y1] = P(0.35, 0.1, 0.12);
  for (let x = x0 + 2; x < x1 - 1; x += 2.2) k += `<rect x="${r(x)}" y="${r(y0 + 2)}" width="1.1" height="${r(y1 - y0 - 4)}" rx=".5" fill="#8f7a58" opacity=".75"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="1" fill="#fff" opacity=".4"/>`;
  const [ax, ay] = P(-0.62, 0.1, 0.12);
  S.teil({ id: "kg_heizkoerper", de: "der Heizkörper", syl: "HEIZ-kör-per", it: "il termosifone", itSyl: "ter-mo-si-FO-ne", en: "radiator", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Die Holzverkleidung schützt die Kinder: So verbrennt sich niemand am heißen Heizkörper." });
}

/* =====================================================================
   6 — DAS SPIELZEUGREGAL (Bauecke, links) — Lupe: Kiste, Bausteine
   ===================================================================== */
{
  const X0 = -3.86, X1 = -2.96, z1 = 0.4, Hh = 0.84;
  let k = kiste(X0, X1, 0, Hh, 0, z1, { vorn: BIRKE, deckel: "#f1e3c4", seite: BIRKE_S });
  const fw = (X1 - X0 - 0.06) / 2;
  const kisten = [["#d6402f", "bloecke"], ["#2b5fa8", "auto"], ["#3a9a4c", "zug"], ["#e0853a", "ball"]];
  const unter = [];
  for (let row = 0; row < 2; row++) for (let c = 0; c < 2; c++) {
    const a = X0 + 0.03 + c * fw, H0 = 0.05 + row * 0.4, H1 = H0 + 0.36;
    k += rz(a + 0.02, a + fw - 0.02, H0, H1, z1, "#7d5f3a");
    const [kf, sym] = kisten[(1 - row) * 2 + c];
    /* Kunststoffkiste, ein wenig herausgezogen */
    const b0 = a + 0.05, b1 = a + fw - 0.05, h0 = H0 + 0.01, h1 = H0 + 0.27;
    k += kiste(b0, b1, h0, h1, z1 - 0.2, z1 + 0.02, { vorn: kf, deckel: "#000" }).replace(/fill="#000"/, `fill="${kf}" opacity=".55"`);
    const [px, py] = P(b0, h1, z1 + 0.02), s = sk(z1 + 0.02), bw = (b1 - b0) * s;
    k += `<rect x="${r(px)}" y="${r(py)}" width="${r(bw)}" height="1.2" fill="#fff" opacity=".3"/><rect x="${r(px + bw * 0.5 - 1.8)}" y="${r(py + 2.2)}" width="3.6" height="1" rx=".5" fill="#000" opacity=".25"/>`;
    /* Bildkarte statt Schrift */
    const cx = px + bw / 2, cy = py + 6.4;
    k += `<rect x="${r(cx - 3.4)}" y="${r(cy - 2.4)}" width="6.8" height="4.8" rx=".5" fill="#fff"/>`;
    if (sym === "bloecke") k += `<rect x="${r(cx - 2.4)}" y="${r(cy)}" width="2" height="1.8" fill="#d6402f"/><rect x="${r(cx - 0.2)}" y="${r(cy)}" width="2" height="1.8" fill="#2b5fa8"/><rect x="${r(cx - 1.3)}" y="${r(cy - 1.8)}" width="2" height="1.8" fill="#f2c230"/>`;
    else if (sym === "auto") k += `<path d="M${r(cx - 2.6)} ${r(cy + 1)} h5.2 v-1.2 l-1 -.2 l-1 -1.4 h-2 l-1 1.4 h-.2 Z" fill="#d6402f"/><circle cx="${r(cx - 1.4)}" cy="${r(cy + 1.1)}" r=".6" fill="#333"/><circle cx="${r(cx + 1.4)}" cy="${r(cy + 1.1)}" r=".6" fill="#333"/>`;
    else if (sym === "tier") k += `<ellipse cx="${r(cx)}" cy="${r(cy + 0.4)}" rx="1.8" ry="1.3" fill="#a0703c"/><circle cx="${r(cx - 1.6)}" cy="${r(cy - 0.8)}" r=".9" fill="#a0703c"/>`;
    else if (sym === "zug") k += `<rect x="${r(cx - 2.6)}" y="${r(cy - 0.6)}" width="2.2" height="1.6" fill="#3a9a4c"/><rect x="${r(cx - 0.2)}" y="${r(cy - 0.6)}" width="2.2" height="1.6" fill="#2b5fa8"/><rect x="${r(cx + 2.2)}" y="${r(cy - 1.4)}" width="1" height="2.4" fill="#d6402f"/>`;
    else if (sym === "ball") k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="1.6" fill="#e0853a"/><path d="M${r(cx - 1.6)} ${r(cy)} h3.2" stroke="#fff" stroke-width=".3"/>`;
    else k += `<circle cx="${r(cx)}" cy="${r(cy - 0.9)}" r=".9" fill="#f1c7a5"/><path d="M${r(cx - 1.2)} ${r(cy + 1.8)} L${r(cx)} ${r(cy)} L${r(cx + 1.2)} ${r(cy + 1.8)} Z" fill="#a1559e"/>`;
    if (row === 1 && c === 0) unter.push({ id: "kg_spielzeugkiste", de: "die Spielzeugkiste", syl: "SPIEL-zeug-kis-te", it: "la cassetta dei giochi", itSyl: "cas-SET-ta dei GIO-chi", en: "toy box", x: cx, y: py + bw * 0.62 + 1, kunst: flaeche(-bw / 2, -bw * 0.62 - 1, bw, bw * 0.62 + 1),
      tipp: "Auf jeder Kiste klebt ein Bild. So weiß jedes Kind, was hineingehört." });
  }
  /* oben: ein Turm aus Steckbausteinen */
  let bs = "";
  const [bx, by] = P(-3.42, Hh, 0.2);
  const steine = [[0, 0, 7, "#d6402f"], [1.4, -2.6, 4.6, "#f2c230"], [-0.4, -5.2, 6.2, "#2b5fa8"], [2.6, -7.8, 3.4, "#3a9a4c"], [0.6, -7.8, 2, "#ffffff"]];
  for (const [dx, dy, w, c] of steine) {
    bs += `<rect x="${r(bx - 3.5 + dx)}" y="${r(by - 2.6 + dy)}" width="${w}" height="2.6" rx=".3" fill="${c}" stroke="#000" stroke-opacity=".15" stroke-width=".2"/>`;
    for (let s = 0; s < Math.floor(w / 1.7); s++) bs += `<rect x="${r(bx - 3.1 + dx + s * 1.7)}" y="${r(by - 3.2 + dy)}" width="1" height=".7" rx=".2" fill="${c}"/>`;
    bs += `<rect x="${r(bx - 3.5 + dx)}" y="${r(by - 2.6 + dy)}" width="${w}" height=".5" fill="#fff" opacity=".3"/>`;
  }
  k += bs;
  unter.push({ id: "kg_bausteine", de: "die Bausteine", syl: "BAU-stei-ne", it: "i mattoncini", itSyl: "mat-ton-CI-ni", en: "building bricks", x: bx, y: by, kunst: flaeche(-5, -12, 10, 12.5) });
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  const [zx0, zy0] = P(X0, 1.1, 0), [zx1] = P(X1, 0, z1);
  S.teil({ id: "kg_spielzeugregal", de: "das Spielzeugregal", syl: "SPIEL-zeug-re-gal", it: "lo scaffale dei giochi", itSyl: "scaf-FA-le dei GIO-chi", en: "toy shelf", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 0, y: r(zy0), w: r(zx1 + 4), h: r((zx1 + 4) / 1.5) },
    unter: unter.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "Nach dem Spielen räumen alle zusammen auf: Jedes Spielzeug kommt in seine Kiste." });
}

/* =====================================================================
   7 — DAS BÜCHERREGAL (Bücherwand, Titel nach vorn) — Lupe
   ===================================================================== */
{
  const X0 = -2.88, X1 = -2.02, z1 = 0.28, Hh = 1.12;
  let k = kiste(X0, X1, 0, Hh, 0, z1, { vorn: "#7a5a36", deckel: "#f1e3c4", seite: BIRKE_S });
  k += rz(X0, X1, 0, Hh, z1, BIRKE);
  k += rz(X0 + 0.04, X1 - 0.04, 0.06, Hh - 0.04, z1, S.lg("bwand", [[0, "#9b7a50"], [1, "#b8966a"]]));
  const covers = [["#f6c434", "sonne"], ["#3c7fd0", "wal"], ["#e0553f", "raupe"], ["#57b05a", "baum"], ["#a1559e", "mond"], ["#f29a2e", "fuchs"]];
  const unter = [];
  for (let row = 0; row < 3; row++) {
    const H0 = 0.1 + row * 0.34;
    for (let c = 0; c < 2; c++) {
      const [cf, sym] = covers[row * 2 + c];
      const a = X0 + 0.08 + c * 0.39, [px, py] = P(a, H0 + 0.27, z1), s = sk(z1), w = 0.32 * s, h = 0.27 * s;
      k += `<rect x="${r(px)}" y="${r(py)}" width="${r(w)}" height="${r(h)}" rx=".4" fill="${cf}"/><rect x="${r(px)}" y="${r(py)}" width="1" height="${r(h)}" fill="#000" opacity=".2"/>`;
      const cx = px + w / 2 + 0.5, cy = py + h * 0.6;
      if (sym === "sonne") k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="2.2" fill="#e0553f"/>`;
      else if (sym === "wal") k += `<path d="M${r(cx - 3)} ${r(cy)} q3 -3 6 0 l1.2 -1.2 v2.4 l-1.2 -1.2 q-3 2.4 -6 0 Z" fill="#cfe6f5"/>`;
      else if (sym === "raupe") for (let i = 0; i < 4; i++) k += `<circle cx="${r(cx - 3 + i * 1.8)}" cy="${r(cy + (i % 2 ? -0.4 : 0.4))}" r="1" fill="${i === 3 ? "#d6402f" : "#7cc04f"}"/>`;
      else if (sym === "baum") k += `<circle cx="${r(cx)}" cy="${r(cy - 0.8)}" r="2" fill="#2f7a3a"/><rect x="${r(cx - 0.4)}" y="${r(cy + 1)}" width=".8" height="1.6" fill="#6b4a2c"/>`;
      else if (sym === "mond") k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="2" fill="#f6e08a"/><circle cx="${r(cx + 0.9)}" cy="${r(cy - 0.6)}" r="1.8" fill="${cf}"/>`;
      else k += `<path d="M${r(cx - 2.4)} ${r(cy + 1.4)} L${r(cx)} ${r(cy - 2)} L${r(cx + 2.4)} ${r(cy + 1.4)} Z" fill="#fff4e6"/><path d="M${r(cx - 2.4)} ${r(cy - 2.2)} L${r(cx - 1.4)} ${r(cy - 0.4)} M${r(cx + 2.4)} ${r(cy - 2.2)} L${r(cx + 1.4)} ${r(cy - 0.4)}" stroke="#fff4e6" stroke-width=".8"/>`;
      k += `<rect x="${r(px + 1.6)}" y="${r(py + 1)}" width="${r(w - 3)}" height="1.1" rx=".3" fill="#fff" opacity=".85"/>`;
      if (row === 1 && c === 0) unter.push({ id: "kg_bilderbuch", de: "das Bilderbuch", syl: "BIL-der-buch", it: "il libro illustrato", itSyl: "LI-bro il-lu-STRA-to", en: "picture book", x: px + w / 2, y: py + h, kunst: flaeche(-w / 2, -h, w, h),
        tipp: "Bilderbücher stehen mit dem Titelbild nach vorn – so finden die Kinder sie ohne zu lesen." });
    }
    /* Leiste vor jedem Fach */
    k += rz(X0 + 0.04, X1 - 0.04, H0, H0 + 0.05, z1 + 0.01, "#d9bf8f");
  }
  /* oben: ein Kuscheltier (Hase) sitzt auf dem Regal */
  const [hx, hy] = P(-2.45, Hh, 0.14);
  let hs = `<ellipse cx="${hx}" cy="${r(hy - 3)}" rx="3.4" ry="3.2" fill="${S.rg("fell", [[0, "#f3ece2"], [1, "#cdbfae"]], 0.4, 0.35, 0.7)}"/>`;
  hs += `<circle cx="${hx}" cy="${r(hy - 7.6)}" r="2.6" fill="#efe6da"/><ellipse cx="${r(hx - 1.2)}" cy="${r(hy - 11.4)}" rx=".8" ry="2.6" fill="#efe6da" transform="rotate(-12 ${r(hx - 1.2)} ${r(hy - 11.4)})"/><ellipse cx="${r(hx + 1.2)}" cy="${r(hy - 11.4)}" rx=".8" ry="2.6" fill="#efe6da" transform="rotate(14 ${r(hx + 1.2)} ${r(hy - 11.4)})"/>`;
  hs += `<ellipse cx="${r(hx + 1.2)}" cy="${r(hy - 11.2)}" rx=".35" ry="1.7" fill="#f2b8c0" transform="rotate(14 ${r(hx + 1.2)} ${r(hy - 11.2)})"/><circle cx="${r(hx - 0.9)}" cy="${r(hy - 8)}" r=".35" fill="#222"/><circle cx="${r(hx + 0.9)}" cy="${r(hy - 8)}" r=".35" fill="#222"/><ellipse cx="${hx}" cy="${r(hy - 7)}" rx=".45" ry=".3" fill="#d98a96"/>`;
  hs += `<ellipse cx="${r(hx - 2)}" cy="${r(hy - 0.6)}" rx="1.4" ry=".9" fill="#e8dfd2"/><ellipse cx="${r(hx + 2)}" cy="${r(hy - 0.6)}" rx="1.4" ry=".9" fill="#e8dfd2"/><path d="M${r(hx - 2)} ${r(hy - 5.6)} h4" stroke="#d6402f" stroke-width=".7"/>`;
  k += hs;
  unter.push({ id: "kg_kuscheltier", de: "das Kuscheltier", syl: "KU-schel-tier", it: "il pupazzo di peluche", itSyl: "pu-PAZ-zo di pe-LU-che", en: "cuddly toy", x: hx, y: hy, kunst: flaeche(-4, -14, 8, 14.4) });
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  const [zx0, zy0] = P(X0, 1.5, 0);
  S.teil({ id: "kg_buecherregal", de: "das Bücherregal", syl: "BÜ-cher-re-gal", it: "la libreria", itSyl: "li-bre-RI-a", en: "bookshelf", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx0 - 4), y: r(zy0 - 2), w: 48, h: 32 }, unter });
}

/* =====================================================================
   8 — DIE SPIELKÜCHE (Puppenecke) mit Herd, Spüle und Topf
   ===================================================================== */
{
  const X0 = 0.85, X1 = 1.95, z1 = 0.38, Hh = 0.6;
  let k = rz(X0, X1, Hh, 1.08, 0, S.lg("kuechewand", [[0, "#f8d7d0"], [1, "#f1c0b6"]]), 'rx=".8"');
  /* Wandbord mit Tassen und Kelle */
  k += kiste(X0 + 0.08, X1 - 0.08, 0.86, 0.89, 0, 0.12, { vorn: "#d9bf8f", deckel: "#efe0bf" });
  for (let i = 0; i < 4; i++) { const [cx, cy] = P(X0 + 0.22 + i * 0.16, 0.89, 0.06); k += `<path d="M${r(cx - 1.6)} ${r(cy - 3)} h3.2 l-.3 3 h-2.6 Z" fill="${["#3c7fd0", "#f6c434", "#e0553f", "#57b05a"][i]}"/><path d="M${r(cx + 1.5)} ${r(cy - 2.4)} q1.2 .2 .8 1.3" stroke="${["#3c7fd0", "#f6c434", "#e0553f", "#57b05a"][i]}" stroke-width=".45" fill="none"/>`; }
  { const [cx, cy] = P(X1 - 0.18, 0.84, 0.01); k += `<path d="M${cx} ${r(cy - 5)} v4.4" stroke="#9aa3aa" stroke-width=".6"/><ellipse cx="${cx}" cy="${r(cy)}" rx="1.4" ry="1" fill="#9aa3aa"/>`; }
  /* Unterbau: Herd links, Spüle rechts */
  k += kiste(X0, X1, 0, Hh, 0.02, z1, { vorn: WEISS, deckel: S.lg("arbeitsplatte", [[0, "#e7d2a8"], [1, "#d6bc8c"]]), seite: "#d7d9d6" });
  k += rz(X0, X1, 0, 0.05, z1 + 0.005, "#c9ad7d");
  /* Backofentür mit Fenster */
  const [ox, oy] = P(X0 + 0.07, 0.48, z1), s = sk(z1);
  k += `<rect x="${ox}" y="${oy}" width="${r(0.46 * s)}" height="${r(0.36 * s)}" rx="1" fill="#f0efe9" stroke="#c9c9c2" stroke-width=".3"/><rect x="${r(ox + 2)}" y="${r(oy + 3.2)}" width="${r(0.46 * s - 4)}" height="${r(0.36 * s - 6)}" rx=".8" fill="${S.lg("ofenglas", [[0, "#3a3a3a"], [1, "#1f1f1f"]])}"/>`;
  k += `<rect x="${r(ox + 3)}" y="${r(oy + 1)}" width="${r(0.46 * s - 6)}" height="1" rx=".5" fill="#9aa3aa"/><ellipse cx="${r(ox + 9.5)}" cy="${r(oy + 10.6)}" rx="4" ry="1.2" fill="#c98b44"/><path d="M${r(ox + 3)} ${r(oy + 4)} l4 0 l-3 8 Z" fill="#fff" opacity=".1"/>`;
  /* Schranktür Spüle */
  const [dx, dy] = P(X0 + 0.6, 0.48, z1);
  k += `<rect x="${dx}" y="${dy}" width="${r(0.44 * s)}" height="${r(0.36 * s)}" rx="1" fill="#f6f5f0" stroke="#c9c9c2" stroke-width=".3"/><circle cx="${r(dx + 2.5)}" cy="${r(dy + 7)}" r=".8" fill="#e0553f"/>`;
  /* Drehknöpfe */
  for (let i = 0; i < 3; i++) { const [kx, ky] = P(X0 + 0.12 + i * 0.12, 0.54, z1); k += `<circle cx="${kx}" cy="${ky}" r="1.1" fill="${["#e0553f", "#f6c434", "#3c7fd0"][i]}"/><rect x="${r(kx - 0.2)}" y="${r(ky - 1)}" width=".4" height="1.1" fill="#fff" opacity=".8"/>`; }
  /* Kochplatten und Spülbecken auf der Platte */
  for (const [X, zz] of [[X0 + 0.17, 0.25], [X0 + 0.42, 0.25], [X0 + 0.17, 0.12]]) { const [cx, cy] = P(X, Hh, zz); k += `<ellipse cx="${cx}" cy="${cy}" rx="${r(0.08 * sk(zz))}" ry="${r(0.08 * sk(zz) * 0.22)}" fill="#2b2b2b"/>`; }
  { const [cx, cy] = P(X1 - 0.27, Hh, 0.2); k += `<ellipse cx="${cx}" cy="${cy}" rx="7" ry="1.9" fill="${STAHL}" stroke="#8a9399" stroke-width=".3"/><ellipse cx="${cx}" cy="${r(cy + 0.3)}" rx="5.6" ry="1.3" fill="#9aa3aa"/>`;
    const [tx0, ty0] = P(X1 - 0.27, Hh, 0.04); k += `<path d="M${tx0} ${ty0} v-4 q0 -1.4 1.4 -1.4 h1.6 v1.2" stroke="#c9cfd4" stroke-width="1" fill="none" stroke-linecap="round"/>`; }
  /* roter Topf mit Deckel auf der Herdplatte */
  { const [cx, cy] = P(X0 + 0.42, Hh, 0.25); k += `<path d="M${r(cx - 4.4)} ${r(cy - 5)} h8.8 v4 q-4.4 1.6 -8.8 0 Z" fill="${S.lg("topf", [[0, "#e46a52"], [1, "#b33b2a"]], 0, 0, 1, 0)}"/><ellipse cx="${cx}" cy="${r(cy - 5)}" rx="4.4" ry="1.1" fill="#d65340"/><ellipse cx="${cx}" cy="${r(cy - 5.6)}" rx=".9" ry=".5" fill="#333"/><path d="M${r(cx - 4.4)} ${r(cy - 4)} h-1.4 M${r(cx + 4.4)} ${r(cy - 4)} h1.4" stroke="#333" stroke-width=".7"/>`; }
  k = schatten(VX + (X0 + X1) / 2 * sk(z1), P(0, 0, z1)[1], 0.6 * sk(z1), 1.2, 0.25) + k;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "kg_spielkueche", de: "die Spielküche", syl: "SPIEL-kü-che", it: "la cucina giocattolo", itSyl: "cu-CI-na gio-CAT-to-lo", en: "play kitchen", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "In der Puppenecke kochen die Kinder wie Mama und Papa." });
}

/* =====================================================================
   9 — DIE GARDEROBE (vier Plätze mit Zeichen) — Lupe
   ===================================================================== */
{
  const X0 = 2.2, X1 = 3.86, z1 = 0.38, PL = 4, pw = (X1 - X0) / PL;
  let k = rz(X0, X1, 0, 1.55, 0, S.lg("garderueck", [[0, "#cfe6ef"], [1, "#b9d8e4"]]));
  const unter = [];
  const U = (o, x, y, a) => unter.push(Object.assign(o, { x: r(x), y: r(y), kunst: flaeche(a[0], a[1], a[2], a[3]) }));
  /* Ablage oben */
  k += kiste(X0, X1, 1.38, 1.42, 0, 0.3, { vorn: "#d9bf8f", deckel: "#efe0bf" });
  /* Trennwände */
  for (let i = 0; i <= PL; i++) { const X = X0 + i * pw; k += kiste(X - 0.012, X + 0.012, 0, 1.42, 0, z1, { seite: BIRKE_S, vorn: KANTE }); }
  /* Bank und Schuhrost */
  k += kiste(X0, X1, 0.29, 0.33, 0.02, z1, { vorn: "#d9bf8f", deckel: BIRKE });
  k += kiste(X0, X1, 0.06, 0.08, 0.02, z1 - 0.02, { deckel: "#b9a07a", vorn: "#a88f69" });
  { const [a] = P(X0, 0, 0.2), [b] = P(X1, 0, 0.2); for (let x = a + 1.5; x < b; x += 2) { k += `<line x1="${r(x)}" y1="${P(0, 0.08, 0.04)[1]}" x2="${r(x + (x - VX) * 0.12)}" y2="${P(0, 0.08, z1 - 0.02)[1]}" stroke="#8f7a58" stroke-width=".35"/>`; } }
  const symbole = ["sonne", "fisch", "blume", "kaefer"];
  for (let i = 0; i < PL; i++) {
    const Xm = X0 + (i + 0.5) * pw;
    /* Zeichen (Bildsymbol) */
    const [sx, sy] = P(Xm, 1.3, 0.005), s0 = sk(0);
    k += `<rect x="${r(sx - 3.6)}" y="${r(sy - 3.6)}" width="7.2" height="7.2" rx="1" fill="#fff" stroke="#e1d6bf" stroke-width=".3"/>`;
    const sym = symbole[i];
    if (sym === "sonne") { k += `<circle cx="${sx}" cy="${r(sy)}" r="1.6" fill="#f6c434"/>`; for (let a = 0; a < 8; a++) k += `<line x1="${r(sx + Math.cos(a * 0.785) * 2.1)}" y1="${r(sy + Math.sin(a * 0.785) * 2.1)}" x2="${r(sx + Math.cos(a * 0.785) * 2.9)}" y2="${r(sy + Math.sin(a * 0.785) * 2.9)}" stroke="#f6c434" stroke-width=".5"/>`; }
    else if (sym === "fisch") k += `<path d="M${r(sx - 2.6)} ${sy} q2 -2.2 4 0 l1.4 -1.2 v2.4 l-1.4 -1.2 q-2 2.2 -4 0 Z" fill="#3c7fd0"/><circle cx="${r(sx - 1.6)}" cy="${r(sy - 0.3)}" r=".3" fill="#fff"/>`;
    else if (sym === "blume") { for (let a = 0; a < 5; a++) k += `<circle cx="${r(sx + Math.cos(a * 1.257) * 1.3)}" cy="${r(sy - 0.6 + Math.sin(a * 1.257) * 1.3)}" r=".9" fill="#e86aa0"/>`; k += `<circle cx="${sx}" cy="${r(sy - 0.6)}" r=".7" fill="#f6c434"/><path d="M${sx} ${r(sy + 0.6)} v2.2" stroke="#3a9a4c" stroke-width=".4"/>`; }
    else k += `<ellipse cx="${sx}" cy="${r(sy + 0.3)}" rx="2" ry="2.3" fill="#d6402f"/><path d="M${sx} ${r(sy - 2)} v4.6" stroke="#222" stroke-width=".3"/><circle cx="${sx}" cy="${r(sy - 2)}" r=".9" fill="#222"/>${[[-0.9, -0.4], [0.9, -0.4], [-1, 1.2], [1, 1.2]].map(([a, b]) => `<circle cx="${r(sx + a)}" cy="${r(sy + b)}" r=".4" fill="#222"/>`).join("")}`;
    if (i === 1) U({ id: "kg_zeichen", de: "das Zeichen", syl: "ZEI-chen", it: "il simbolo", itSyl: "SIM-bo-lo", en: "symbol", tipp: "Jedes Kind hat sein eigenes Zeichen. So findet es seinen Platz, auch wenn es noch nicht lesen kann." }, sx, sy + 3.6, [-3.8, -7.4, 7.6, 7.6]);
    /* Doppelhaken */
    const [hx, hy] = P(Xm, 1.12, 0.005);
    k += `<rect x="${r(hx - 0.8)}" y="${r(hy - 1.6)}" width="1.6" height="2.4" rx=".4" fill="#9aa3aa"/><path d="M${hx} ${r(hy + 0.6)} q0 2.4 2 2 M${hx} ${r(hy + 0.6)} q0 2.4 -2 2" stroke="${STAHL}" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
    if (i === 3) U({ id: "kg_haken", de: "der Haken", syl: "HA-ken", it: "il gancio", itSyl: "GAN-cio", en: "hook", tipp: "Am Haken hängen Jacke und Matschhose." }, hx, hy + 3.4, [-3.2, -5.4, 6.4, 5.6]);
  }
  /* Platz 1: rote Jacke  */
  { const [hx, hy] = P(X0 + 0.5 * pw, 1.12, 0.03); k += `<path d="M${r(hx - 1)} ${r(hy + 1.6)} L${r(hx - 6)} ${r(hy + 4)} L${r(hx - 7)} ${r(hy + 18)} L${r(hx + 7)} ${r(hy + 18)} L${r(hx + 6)} ${r(hy + 4)} L${r(hx + 1)} ${r(hy + 1.6)} Z" fill="${S.lg("jacke1", [[0, "#e0553f"], [1, "#b73a28"]], 0, 0, 1, 0)}"/><path d="M${hx} ${r(hy + 2.4)} v15.4" stroke="#7d2416" stroke-width=".4"/><path d="M${r(hx - 3)} ${r(hy + 2.4)} q3 2.4 6 0" stroke="#b73a28" stroke-width="1.2" fill="none"/><rect x="${r(hx - 5)}" y="${r(hy + 12)}" width="3" height="2.4" fill="#b73a28"/><rect x="${r(hx + 2)}" y="${r(hy + 12)}" width="3" height="2.4" fill="#b73a28"/><path d="M${r(hx - 6.6)} ${r(hy + 16)} h13" stroke="#f6f0e0" stroke-width=".6" opacity=".7"/>`; }
  /* Platz 2: gelbe Matschhose an den Trägern */
  { const [hx, hy] = P(X0 + 1.5 * pw, 1.12, 0.03);
    k += `<path d="M${r(hx - 1)} ${r(hy + 2)} L${r(hx - 3.6)} ${r(hy + 8)} M${r(hx + 1)} ${r(hy + 2)} L${r(hx + 3.6)} ${r(hy + 8)}" stroke="#1f5fa8" stroke-width=".8"/>`;
    k += `<path d="M${r(hx - 5)} ${r(hy + 8)} L${r(hx + 5)} ${r(hy + 8)} L${r(hx + 5.6)} ${r(hy + 24)} L${r(hx + 1.2)} ${r(hy + 24)} L${hx} ${r(hy + 14)} L${r(hx - 1.2)} ${r(hy + 24)} L${r(hx - 5.6)} ${r(hy + 24)} Z" fill="${S.lg("matsch", [[0, "#f6d23a"], [1, "#d9ac18"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(hx - 5.4)} ${r(hy + 21)} h4.2 M${r(hx + 1.2)} ${r(hy + 21)} h4.2" stroke="#c4cfd6" stroke-width=".7" opacity=".9"/><path d="M${r(hx - 4.6)} ${r(hy + 18)} q1 1 2.6 .6" stroke="#8a6a3a" stroke-width=".9" opacity=".35" fill="none"/>`;
    U({ id: "kg_matschhose", de: "die Matschhose", syl: "MATSCH-ho-se", it: "la salopette impermeabile", itSyl: "sa-lo-PET-te im-per-me-A-bi-le", en: "waterproof trousers", tipp: "Mit der Matschhose dürfen die Kinder bei jedem Wetter draußen spielen." }, hx, hy + 24, [-6, -16, 12, 16.4]); }
  /* Platz 3: blauer Kinderrucksack */
  { const [hx, hy] = P(X0 + 2.5 * pw, 1.12, 0.04);
    k += `<path d="M${r(hx - 1.4)} ${r(hy + 2)} q1.4 -1.6 2.8 0" stroke="#1d4f8a" stroke-width=".8" fill="none"/>`;
    k += `<rect x="${r(hx - 5)}" y="${r(hy + 3)}" width="10" height="13" rx="3.2" fill="${S.lg("ruck", [[0, "#4a8fe0"], [1, "#2b62a8"]], 0, 0, 1, 0)}"/><rect x="${r(hx - 3.6)}" y="${r(hy + 9.4)}" width="7.2" height="5.4" rx="1.6" fill="#2b62a8" stroke="#1d4f8a" stroke-width=".3"/>`;
    k += `<circle cx="${r(hx - 1.4)}" cy="${r(hy + 6.4)}" r="1.4" fill="#f6c434"/><circle cx="${r(hx - 1.9)}" cy="${r(hy + 6.1)}" r=".25" fill="#222"/><circle cx="${r(hx - 0.9)}" cy="${r(hy + 6.1)}" r=".25" fill="#222"/><rect x="${r(hx - 4.4)}" y="${r(hy + 12)}" width="1.2" height="2" fill="#e8f0f8" opacity=".9"/>`;
    U({ id: "kg_rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zainetto", itSyl: "zai-NET-to", en: "backpack" }, hx, hy + 16, [-5.4, -14, 10.8, 14.4]); }
  /* Platz 4: grüne Regenjacke */
  { const [hx, hy] = P(X0 + 3.5 * pw, 1.12, 0.03); k += `<path d="M${r(hx - 1)} ${r(hy + 1.6)} L${r(hx - 6)} ${r(hy + 4)} L${r(hx - 6.6)} ${r(hy + 17)} L${r(hx + 6.6)} ${r(hy + 17)} L${r(hx + 6)} ${r(hy + 4)} L${r(hx + 1)} ${r(hy + 1.6)} Z" fill="${S.lg("jacke2", [[0, "#57b05a"], [1, "#3a8a3e"]], 0, 0, 1, 0)}"/><path d="M${hx} ${r(hy + 2.4)} v14.4" stroke="#245a28" stroke-width=".4"/><path d="M${r(hx - 3.2)} ${r(hy + 1)} q3.2 -2.6 6.4 0 l-.6 2 q-2.6 -1.4 -5.2 0 Z" fill="#3a8a3e"/>`; }
  /* Ablage: Brotdose und Trinkflasche */
  { const [bx, by] = P(X0 + 0.5 * pw, 1.42, 0.16);
    k += `<rect x="${r(bx - 4.4)}" y="${r(by - 3)}" width="8.8" height="3" rx=".8" fill="${S.lg("dose", [[0, "#7fd0c8"], [1, "#3fa79b"]])}"/><rect x="${r(bx - 4.6)}" y="${r(by - 3.8)}" width="9.2" height="1.2" rx=".5" fill="#2f8a80"/><rect x="${r(bx - 1)}" y="${r(by - 3.4)}" width="2" height="1.6" rx=".3" fill="#f6c434"/>`;
    U({ id: "kg_brotdose", de: "die Brotdose", syl: "BROT-do-se", it: "il portapranzo", itSyl: "por-ta-PRAN-zo", en: "lunch box", tipp: "In der Brotdose ist das Frühstück von zu Hause." }, bx, by, [-5, -4.4, 10, 4.6]); }
  { const [bx, by] = P(X0 + 1.5 * pw, 1.42, 0.16);
    k += `<rect x="${r(bx - 1.5)}" y="${r(by - 8)}" width="3" height="8" rx="1" fill="${S.lg("flasche", [[0, "#f07aa8"], [0.5, "#f9a8c6"], [1, "#d85a8c"]], 0, 0, 1, 0)}"/><rect x="${r(bx - 1)}" y="${r(by - 9.6)}" width="2" height="1.8" rx=".4" fill="#6a2a8a"/><rect x="${r(bx - 0.3)}" y="${r(by - 10.6)}" width=".6" height="1.2" fill="#6a2a8a"/><circle cx="${bx}" cy="${r(by - 4)}" r=".8" fill="#fff" opacity=".8"/>`;
    U({ id: "kg_trinkflasche", de: "die Trinkflasche", syl: "TRINK-fla-sche", it: "la borraccia", itSyl: "bor-RAC-cia", en: "water bottle" }, bx, by, [-2.2, -11, 4.4, 11.2]); }
  /* Unten: Gummistiefel (Platz 2) und Hausschuhe (Platz 4) */
  { const [bx, by] = P(X0 + 1.5 * pw, 0.08, 0.22);
    for (const d of [-2, 2.2]) k += `<path d="M${r(bx + d - 1.4)} ${r(by - 8)} h2.8 v6.4 q2 .2 2 1.6 h-4.8 Z" fill="${S.lg("gummi", [[0, "#e0553f"], [1, "#a8321f"]], 0, 0, 1, 0)}"/><rect x="${r(bx + d - 1.6)}" y="${r(by - 0.6)}" width="5.2" height=".7" fill="#333"/><circle cx="${r(bx + d)}" cy="${r(by - 6.6)}" r=".55" fill="#fff" opacity=".8"/>`;
    U({ id: "kg_gummistiefel", de: "die Gummistiefel", syl: "GUM-mi-stie-fel", it: "gli stivali di gomma", itSyl: "sti-VA-li di GOM-ma", en: "wellies" }, bx, by, [-4, -8.6, 9, 9]); }
  { const [bx, by] = P(X0 + 3.5 * pw, 0.08, 0.24);
    for (const d of [-2.4, 2]) k += `<path d="M${r(bx + d - 2)} ${by} q-.4 -2.6 1.6 -2.8 h1.6 q1.4 0 1.6 1.4 l.2 1.4 Z" fill="#7b5ea8"/><path d="M${r(bx + d - 0.6)} ${r(by - 2.6)} q1.2 -1 2.4 0" fill="#c9b3e6"/><circle cx="${r(bx + d)}" cy="${r(by - 1.6)}" r=".5" fill="#f6c434"/>`;
    U({ id: "kg_hausschuhe", de: "die Hausschuhe", syl: "HAUS-schu-he", it: "le pantofole", itSyl: "pan-TO-fo-le", en: "slippers", tipp: "Im Gruppenraum tragen die Kinder Hausschuhe." }, bx, by, [-5, -4, 10, 4.4]); }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  const [zx0, zy0] = P(X0, 1.62, 0);
  S.teil({ id: "kg_garderobe", de: "die Garderobe", syl: "Gar-de-RO-be", it: "lo spogliatoio", itSyl: "spo-glia-TO-io", en: "cloakroom", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx0 - 3), y: r(zy0 - 1), w: 84, h: 56 }, unter,
    tipp: "Jedes Kind hat in der Garderobe seinen eigenen Platz." });
}

/* =====================================================================
   10 — DER PUPPENWAGEN und 11 — DIE PUPPE
   ===================================================================== */
const PW = { X: 0.6, z: 0.5 };
{
  const { X, z } = PW, s = sk(z);
  const [cx, fy] = P(X, 0, z);
  const u = (m) => r(m * s);
  let k = schatten(cx, fy, u(0.3), 1.2, 0.28);
  /* Gestell und Räder */
  k += `<path d="M${r(cx - u(0.2))} ${r(fy - u(0.08))} L${r(cx - u(0.12))} ${r(fy - u(0.34))} L${r(cx + u(0.12))} ${r(fy - u(0.34))} L${r(cx + u(0.2))} ${r(fy - u(0.08))}" stroke="#9aa3aa" stroke-width=".7" fill="none"/>`;
  for (const [dx, a] of [[-0.18, 0.55], [0.18, 0.55], [-0.2, 1], [0.2, 1]]) k += `<circle cx="${r(cx + u(dx))}" cy="${r(fy - u(0.08))}" r="${u(0.075)}" fill="#3a3a3a" opacity="${a}"/><circle cx="${r(cx + u(dx))}" cy="${r(fy - u(0.08))}" r="${u(0.03)}" fill="#c9cfd4" opacity="${a}"/>`;
  /* Korb und Verdeck (flieder) */
  k += `<path d="M${r(cx - u(0.26))} ${r(fy - u(0.58))} L${r(cx + u(0.26))} ${r(fy - u(0.58))} Q${r(cx + u(0.25))} ${r(fy - u(0.34))} ${r(cx + u(0.12))} ${r(fy - u(0.33))} L${r(cx - u(0.14))} ${r(fy - u(0.33))} Q${r(cx - u(0.26))} ${r(fy - u(0.34))} ${r(cx - u(0.26))} ${r(fy - u(0.58))} Z" fill="${S.lg("korbpw", [[0, "#c9a7e0"], [1, "#9a72bd"]])}"/>`;
  k += `<path d="M${r(cx - u(0.27))} ${r(fy - u(0.58))} Q${r(cx - u(0.27))} ${r(fy - u(0.82))} ${r(cx - u(0.04))} ${r(fy - u(0.8))} L${r(cx - u(0.04))} ${r(fy - u(0.58))} Z" fill="${S.lg("verdeck", [[0, "#b48ad6"], [1, "#8a5fb0"]])}"/>`;
  for (const t of [0.35, 0.6, 0.85]) k += `<path d="M${r(cx - u(0.27) + u(0.23) * t)} ${r(fy - u(0.58))} L${r(cx - u(0.27) + u(0.23) * t * 0.6)} ${r(fy - u(0.58 + 0.22 * Math.sin(t * 1.6)))}" stroke="#7a4fa0" stroke-width=".35"/>`;
  k += `<path d="M${r(cx - u(0.25))} ${r(fy - u(0.5))} h${u(0.5)}" stroke="#fff" stroke-width=".6" opacity=".6"/>`;
  /* Schiebebügel */
  k += `<path d="M${r(cx + u(0.22))} ${r(fy - u(0.52))} L${r(cx + u(0.36))} ${r(fy - u(0.8))}" stroke="#9aa3aa" stroke-width=".8"/><path d="M${r(cx + u(0.33))} ${r(fy - u(0.8))} h${u(0.07)}" stroke="#333" stroke-width="1.6" stroke-linecap="round"/>`;
  S.teil({ id: "kg_puppenwagen", de: "der Puppenwagen", syl: "PUP-pen-wa-gen", it: "la carrozzina delle bambole", itSyl: "car-roz-ZI-na del-le BAM-bo-le", en: "doll's pram", x: cx, y: fy, steht: true, kunst: um(cx, fy, k) });
  /* Die Puppe liegt unter der Decke, der Kopf schaut heraus */
  const [px, py] = [cx + u(0.06), fy - u(0.58)];
  let p = `<path d="M${r(px - u(0.02))} ${r(py + 0.4)} Q${r(px + u(0.08))} ${r(py - 2.2)} ${r(px + u(0.19))} ${r(py + 0.4)} Z" fill="#f4b8c8"/>`;
  for (let i = 0; i < 3; i++) p += `<circle cx="${r(px + u(0.04) + i * 2.2)}" cy="${r(py - 0.4)}" r=".4" fill="#fff"/>`;
  p += `<circle cx="${r(px - u(0.05))}" cy="${r(py - 1.6)}" r="2.2" fill="${S.rg("puppengesicht", [[0, "#ffe2cf"], [1, "#efc0a2"]], 0.4, 0.35, 0.7)}"/><path d="M${r(px - u(0.05) - 2.2)} ${r(py - 2)} q2.2 -2.8 4.4 0 q-2.2 -1.2 -4.4 0 Z" fill="#c98b44"/><circle cx="${r(px - u(0.05) - 0.7)}" cy="${r(py - 1.5)}" r=".28" fill="#2b5fa8"/><circle cx="${r(px - u(0.05) + 0.7)}" cy="${r(py - 1.5)}" r=".28" fill="#2b5fa8"/><circle cx="${r(px - u(0.05) - 1.1)}" cy="${r(py - 0.9)}" r=".4" fill="#f2a0a0" opacity=".6"/>`;
  S.teil({ oben: true, id: "kg_puppe", de: "die Puppe", syl: "PUP-pe", it: "la bambola", itSyl: "BAM-bo-la", en: "doll", x: px, y: py, kunst: um(px, py, p + flaeche(px - u(0.05) - 3, py - 4.6, u(0.26) + 3, 5.6)),
    tipp: "Die Puppe schläft im Puppenwagen." });
}

/* =====================================================================
   12 — DER MORGENKREIS (runder Teppich) und DIE BAUECKE (Straßenteppich)
   ===================================================================== */
const MK = { X: -0.35, z: 2.0, R: 0.66 };
{
  const pts = ring(MK.X, MK.z, MK.R);
  let k = poly(pts, S.rg("teppichrund", [[0, "#7fb8d8"], [0.7, "#5f9cc2"], [1, "#4a86ad"]]));
  k += poly(ring(MK.X, MK.z, MK.R - 0.06), "none", 'stroke="#f2e6c8" stroke-width=".8"');
  k += poly(ring(MK.X, MK.z, MK.R * 0.42), "#f2e6c8", 'opacity=".35"');
  const [ax, ay] = P(MK.X, 0, MK.z + MK.R);
  S.teil({ id: "kg_stuhlkreis", de: "der Morgenkreis", syl: "MOR-gen-kreis", it: "il cerchio del mattino", itSyl: "CER-chio del mat-TI-no", en: "morning circle", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Im Morgenkreis sitzen alle zusammen: Man singt, erzählt und plant den Tag." });
}
const BE = { X0: -3.4, X1: -0.95, z0: 0.62, z1: 2.9 };
const bauUnter = [];
{
  const { X0, X1, z0, z1 } = BE;
  let k = polyC([P(X0, 0, z0), P(X1, 0, z0), P(X1, 0, z1), P(X0, 0, z1)], S.lg("strteppich", [[0, "#7dbb5c"], [1, "#6aa94b"]]));
  /* Straßen: eine Querstraße und eine Längsstraße mit Zebrastreifen */
  const strasse = (a, b, c, d) => polyC([a, b, c, d], "#6e7378");
  const zq = 1.35, Xl = -1.9;
  k += strasse(P(X0, 0, zq - 0.15), P(X1, 0, zq - 0.15), P(X1, 0, zq + 0.15), P(X0, 0, zq + 0.15));
  k += strasse(P(Xl - 0.15, 0, z0), P(Xl + 0.15, 0, z0), P(Xl + 0.15, 0, z1), P(Xl - 0.15, 0, z1));
  for (let X = X0 + 0.1; X < X1; X += 0.22) if (Math.abs(X - Xl) > 0.2) { const a = P(X, 0, zq), b = P(X + 0.1, 0, zq); if (a[0] >= 0) k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fff" stroke-width=".5"/>`; }
  for (let z = z0 + 0.1; z < z1; z += 0.2) if (Math.abs(z - zq) > 0.2) { const a = P(Xl, 0, z), b = P(Xl, 0, z + 0.09); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fff" stroke-width=".5"/>`; }
  for (let i = 0; i < 5; i++) k += polyC([P(Xl + 0.17, 0, zq - 0.13 + i * 0.06), P(Xl + 0.35, 0, zq - 0.13 + i * 0.06), P(Xl + 0.35, 0, zq - 0.1 + i * 0.06), P(Xl + 0.17, 0, zq - 0.1 + i * 0.06)], "#fff");
  /* gedruckte Häuser und Teich */
  for (const [X, z, c] of [[-2.9, 0.9, "#e0553f"], [-1.45, 0.85, "#f6c434"], [-1.3, 1.9, "#3c7fd0"]]) k += polyC([P(X - 0.16, 0, z - 0.12), P(X + 0.16, 0, z - 0.12), P(X + 0.16, 0, z + 0.12), P(X - 0.16, 0, z + 0.12)], c, 'opacity=".85"');
  k += polyC(ring(-2.75, 2.1, 0.22), "#5aa6d6");
  k += polyC([P(X0, 0, z0), P(X1, 0, z0), P(X1, 0, z1), P(X0, 0, z1)], "none", 'stroke="#4f8a3c" stroke-width=".8"');
  /* Der Turm aus Holzbauklötzen (rechts vom Jungen) */
  {
    const [tx0, ty0] = P(-1.25, 0, 1.75), s = sk(1.75);
    let t = schatten(tx0, ty0, 6, 1, 0.3);
    const kl = [[0, 0.07, 0.2, "#d6a066"], [0.01, 0.07, 0.14, "#d6402f"], [-0.01, 0.07, 0.14, "#2b5fa8"], [0.005, 0.07, 0.1, "#f2c230"], [0, 0.07, 0.07, "#3a9a4c"]];
    let h = 0;
    for (const [dx, hh, w, c] of kl) {
      t += `<rect x="${r(tx0 + (dx - w / 2) * s)}" y="${r(ty0 - (h + hh) * s)}" width="${r(w * s)}" height="${r(hh * s)}" fill="${c}"/><rect x="${r(tx0 + (dx - w / 2) * s)}" y="${r(ty0 - (h + hh) * s)}" width="${r(w * s)}" height=".8" fill="#fff" opacity=".35"/><rect x="${r(tx0 + (dx + w / 2) * s - 1)}" y="${r(ty0 - (h + hh) * s)}" width="1" height="${r(hh * s)}" fill="#000" opacity=".15"/>`;
      h += hh;
    }
    /* Dach: ein Dreieck */
    t += `<path d="M${r(tx0 - 0.06 * s)} ${r(ty0 - h * s)} L${r(tx0)} ${r(ty0 - (h + 0.07) * s)} L${r(tx0 + 0.06 * s)} ${r(ty0 - h * s)} Z" fill="#a1559e"/>`;
    /* verstreute Klötze */
    t += `<rect x="${r(tx0 + 7)}" y="${r(ty0 - 3)}" width="5" height="3" fill="#d6a066" transform="rotate(12 ${r(tx0 + 9)} ${r(ty0 - 1.5)})"/><rect x="${r(tx0 - 12)}" y="${r(ty0 + 1)}" width="4" height="3.4" fill="#f2c230"/>`;
    k += t;
    bauUnter.push({ id: "kg_bauklotz", de: "der Bauklotz", syl: "BAU-klotz", it: "il blocco di legno", itSyl: "BLOC-co di LE-gno", en: "wooden block", x: tx0, y: ty0 + 4, kunst: flaeche(-12, -(h + 0.07) * s - 4.5, 24, (h + 0.07) * s + 8),
      tipp: "Aus Bauklötzen bauen die Kinder Türme, Häuser und Brücken." });
  }
  /* Die Holzeisenbahn auf ihren Schienen (vorn) */
  {
    const zb = 2.62, s = sk(zb);
    const [a] = P(-1.97, 0, zb), [b, yb] = P(-1.0, 0, zb);
    let t = `<rect x="${a}" y="${r(yb - 1.4)}" width="${r(b - a)}" height="2.2" fill="#d9b480"/><rect x="${a}" y="${r(yb - 1)}" width="${r(b - a)}" height=".5" fill="#a8824e"/><rect x="${a}" y="${r(yb + 0.1)}" width="${r(b - a)}" height=".5" fill="#a8824e"/>`;
    const lx = P(-1.25, 0, zb)[0];
    /* Lok */
    t += `<rect x="${r(lx - 0.1 * s)}" y="${r(yb - 0.1 * s)}" width="${r(0.17 * s)}" height="${r(0.07 * s)}" rx=".8" fill="#d6402f"/><rect x="${r(lx - 0.02 * s)}" y="${r(yb - 0.15 * s)}" width="${r(0.08 * s)}" height="${r(0.07 * s)}" rx=".6" fill="#2b5fa8"/><rect x="${r(lx - 0.08 * s)}" y="${r(yb - 0.14 * s)}" width="${r(0.025 * s)}" height="${r(0.05 * s)}" fill="#333"/>`;
    for (let i = 0; i < 2; i++) { const wx = lx - (0.3 + i * 0.22) * s; t += `<rect x="${r(wx)}" y="${r(yb - 0.09 * s)}" width="${r(0.18 * s)}" height="${r(0.06 * s)}" rx=".6" fill="${["#3a9a4c", "#f2c230"][i]}"/><rect x="${r(wx + 0.18 * s)}" y="${r(yb - 0.06 * s)}" width="${r(0.04 * s)}" height="1" fill="#333"/>`; if (i === 1) t += `<rect x="${r(wx + 2)}" y="${r(yb - 0.14 * s)}" width="3.6" height="3.6" fill="#d6402f"/><rect x="${r(wx + 6)}" y="${r(yb - 0.13 * s)}" width="3" height="3" fill="#2b5fa8"/>`; }
    for (let i = 0; i < 7; i++) { const wx = lx - 0.62 * s + i * 0.12 * s + (i > 4 ? 0.02 * s : 0); t += `<circle cx="${r(wx + 2.4)}" cy="${r(yb - 0.02 * s)}" r="1.5" fill="#333"/><circle cx="${r(wx + 2.4)}" cy="${r(yb - 0.02 * s)}" r=".5" fill="#d9b480"/>`; }
    k += t;
    bauUnter.push({ id: "kg_holzeisenbahn", de: "die Holzeisenbahn", syl: "HOLZ-ei-sen-bahn", it: "il trenino di legno", itSyl: "tre-NI-no di LE-gno", en: "wooden train", x: lx, y: yb + 2, kunst: flaeche(-0.66 * s, -0.16 * s - 2, 0.82 * s, 0.16 * s + 4) });
  }
  const [ax, ay] = P(-2.2, 0, z1);
  S.teil({ id: "kg_bauecke", de: "die Bauecke", syl: "BAU-ecke", it: "l'angolo costruzioni", itSyl: "AN-go-lo co-stru-ZIO-ni", en: "building corner", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 0, y: 126, w: 105, h: 70 }, unter: bauUnter,
    tipp: "In der Bauecke spielen die Kinder auf dem Straßenteppich." });
}

/* =====================================================================
   13 — DIE SITZKISSEN im Kreis und 14 — DIE ERZIEHERIN (sitzt darauf)
   ===================================================================== */
{
  let k = "";
  const n = 7, Rk = MK.R - 0.12;
  const kis = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i / n * Math.PI * 2; return { X: MK.X + Math.cos(a) * Rk, z: MK.z + Math.sin(a) * Rk, i }; }).sort((a, b) => a.z - b.z);
  const farben = ["#e0553f", "#f6c434", "#57b05a", "#3c7fd0", "#a1559e", "#f29a2e", "#3bb3c3"];
  for (const c of kis) {
    const s = sk(c.z), [cx, cy] = P(c.X, 0, c.z), rx = 0.19 * s, ry = rx * 0.32, h = 0.07 * s;
    k += `<ellipse cx="${cx}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="#000" opacity=".18"/>`;
    k += `<path d="M${r(cx - rx)} ${r(cy - h)} A${r(rx)} ${r(ry)} 0 0 0 ${r(cx + rx)} ${r(cy - h)} L${r(cx + rx)} ${r(cy - 0.6)} A${r(rx)} ${r(ry)} 0 0 1 ${r(cx - rx)} ${r(cy - 0.6)} Z" fill="${farben[c.i]}"/>`;
    k += `<path d="M${r(cx - rx)} ${r(cy - h)} A${r(rx)} ${r(ry)} 0 0 0 ${r(cx + rx)} ${r(cy - h)} L${r(cx + rx)} ${r(cy - 0.6)} A${r(rx)} ${r(ry)} 0 0 1 ${r(cx - rx)} ${r(cy - 0.6)} Z" fill="#000" opacity=".18"/>`;
    k += `<ellipse cx="${cx}" cy="${r(cy - h)}" rx="${r(rx)}" ry="${r(ry)}" fill="${farben[c.i]}"/><ellipse cx="${r(cx - rx * 0.2)}" cy="${r(cy - h - ry * 0.2)}" rx="${r(rx * 0.5)}" ry="${r(ry * 0.4)}" fill="#fff" opacity=".25"/>`;
  }
  const [ax, ay] = P(MK.X, 0, MK.z + Rk);
  S.teil({ id: "kg_sitzkissen", de: "das Sitzkissen", syl: "SITZ-kis-sen", it: "il cuscino", itSyl: "cu-SCI-no", en: "floor cushion", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}
{
  const z = MK.z - MK.R + 0.12, X = MK.X;
  const [fx, fy] = P(X, 0.07, z + 0.02);
  const m = B.mensch({ id: "b10a_erz", geschlecht: "w", pose: "schneidersitz", blick: 8, frisur: "lang", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#5a8fb8" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "#e9e6de" } } }, 1.66 * sk(z));
  S.teil({ id: "kg_erzieherin", de: "die Erzieherin", syl: "Er-ZIE-he-rin", it: "l'educatrice", itSyl: "e-du-ca-TRI-ce", en: "nursery teacher", x: fx, y: fy, kunst: m.svg,
    tipp: "Die Erzieherin sagt: „Guten Morgen, ihr Lieben! Wer ist heute alles da?“" });
}
{
  /* DIE KLANGSCHALE in der Mitte des Kreises, auf einem kleinen Kissen */
  const [cx, cy] = P(MK.X, 0, MK.z + 0.05), s = sk(MK.z);
  let k = `<ellipse cx="0" cy="0" rx="${r(0.13 * s)}" ry="${r(0.04 * s)}" fill="#c84a68"/>`;
  k += `<path d="M${r(-0.1 * s)} ${r(-0.03 * s)} Q${r(-0.09 * s)} ${r(0.05 * s)} 0 ${r(0.05 * s)} Q${r(0.09 * s)} ${r(0.05 * s)} ${r(0.1 * s)} ${r(-0.03 * s)} Z" fill="${S.lg("messing", [[0, "#c79a3a"], [0.4, "#f2d68a"], [1, "#9a7024"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-0.03 * s)}" rx="${r(0.1 * s)}" ry="${r(0.025 * s)}" fill="#7a5a1c"/><ellipse cx="0" cy="${r(-0.026 * s)}" rx="${r(0.085 * s)}" ry="${r(0.018 * s)}" fill="#a37a2c"/>`;
  k += `<path d="M${r(0.11 * s)} ${r(-0.01 * s)} l${r(0.12 * s)} ${r(-0.03 * s)}" stroke="#6b4322" stroke-width="1" stroke-linecap="round"/><circle cx="${r(0.23 * s)}" cy="${r(-0.04 * s)}" r="1" fill="#3a2a1a"/>`;
  S.teil({ oben: true, id: "kg_klangschale", de: "die Klangschale", syl: "KLANG-scha-le", it: "la campana tibetana", itSyl: "cam-PA-na ti-be-TA-na", en: "singing bowl", x: cx, y: cy, kunst: k,
    tipp: "Wenn die Klangschale klingt, werden alle ganz leise." });
}

const MT = { X0: 0.62, X1: 1.72, z0: 1.62, z1: 2.16, H: 0.53 };
/* =====================================================================
   16 — DER MALTISCH (niedrig, Buche, bunte Kante) — Lupe
   ===================================================================== */
{
  const { X0, X1, z0, z1, H } = MT;
  let k = schatten(...P((X0 + X1) / 2, 0, (z0 + z1) / 2), 0.58 * sk(z1), 2, 0.28);
  for (const [X, z] of [[X0 + 0.06, z0 + 0.06], [X1 - 0.06, z0 + 0.06], [X0 + 0.06, z1 - 0.06], [X1 - 0.06, z1 - 0.06]]) { const a = P(X, 0, z), b = P(X, H - 0.03, z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${S.lg("bein", [[0, "#d8b47c"], [1, "#b88c55"]], 0, 0, 1, 0)}" stroke-width="${r(0.045 * sk(z))}" stroke-linecap="round"/>`; }
  k += kiste(X0, X1, H - 0.03, H, z0, z1, { vorn: "#3a9a4c", deckel: S.lg("tischplatte", [[0, "#ecd7ae"], [1, "#dcc08e"]]), seite: "#2f7f3e" });
  const unter = [];
  /* Malpapier mit einem Regenbogen-Bild */
  {
    const c = (X, z) => P(X, H + 0.003, z);
    k += poly([c(0.92, 1.66), c(1.28, 1.66), c(1.28, 1.92), c(0.92, 1.92)], "#fffef8", 'stroke="#ddd8c8" stroke-width=".2"');
    const [mx, my] = P(1.1, H, 1.82);
    ["#e0453a", "#f29a2e", "#f6d23a", "#57b05a", "#3c7fd0"].forEach((cc, j) => { k += `<path d="M${r(mx - 6 + j * 0.8)} ${r(my + 1)} Q${mx} ${r(my - 3.4 + j * 0.7)} ${r(mx + 6 - j * 0.8)} ${r(my + 1)}" stroke="${cc}" stroke-width=".6" fill="none"/>`; });
    k += poly([c(1.32, 1.7), c(1.6, 1.68), c(1.62, 1.9), c(1.34, 1.92)], "#fffef8", 'stroke="#ddd8c8" stroke-width=".2"');
    k += poly([c(1.36, 1.74), c(1.56, 1.73), c(1.57, 1.86), c(1.37, 1.87)], "#cfe6f5", 'opacity=".8"');
    const [ux, uy] = P(1.1, H, 1.92);
    unter.push({ id: "kg_malpapier", de: "das Malpapier", syl: "MAL-pa-pier", it: "la carta da disegno", itSyl: "CAR-ta da di-SE-gno", en: "drawing paper", x: ux, y: uy + 0.5, kunst: flaeche(-9, -5, 18, 5.6) });
  }
  /* Wachsmalstifte in einer offenen Schachtel */
  {
    const [bx, by] = P(0.78, H, 1.98);
    k += `<rect x="${r(bx - 5)}" y="${r(by - 2.6)}" width="10" height="2.6" fill="#f6c434"/><rect x="${r(bx - 5)}" y="${r(by - 3.4)}" width="10" height=".9" fill="#e0a514"/>`;
    ["#e0453a", "#f29a2e", "#f6d23a", "#57b05a", "#3c7fd0", "#a1559e", "#6b4a2c", "#222"].forEach((cc, j) => { k += `<rect x="${r(bx - 4.6 + j * 1.2)}" y="${r(by - 4.6)}" width="1" height="2" fill="${cc}"/><path d="M${r(bx - 4.6 + j * 1.2)} ${r(by - 4.6)} l.5 -.8 l.5 .8 Z" fill="${cc}"/>`; });
    k += `<text x="${bx}" y="${r(by - 0.6)}" font-size="1.4" text-anchor="middle" fill="#a8321f" font-family="Arial" font-weight="bold">WACHS</text>`;
    /* zwei liegen auf dem Tisch */
    const [lx, ly] = P(1.0, H, 2.02);
    k += `<rect x="${r(lx)}" y="${r(ly - 1)}" width="4" height="1" rx=".3" fill="#3c7fd0" transform="rotate(-14 ${lx} ${ly})"/><rect x="${r(lx + 4)}" y="${r(ly - 0.6)}" width="4" height="1" rx=".3" fill="#e0453a" transform="rotate(8 ${r(lx + 4)} ${ly})"/>`;
    unter.push({ id: "kg_wachsmalstifte", de: "die Wachsmalstifte", syl: "WACHS-mal-stif-te", it: "i pastelli a cera", itSyl: "pa-STEL-li a CE-ra", en: "wax crayons", x: bx, y: by + 0.4, kunst: flaeche(-5.6, -6.2, 11.2, 6.6),
      tipp: "Wachsmalstifte sind dick und brechen nicht so schnell – gut für kleine Hände." });
  }
  /* Kinderschere (abgerundete Spitze) */
  {
    const [sx, sy] = P(1.52, H, 2.06);
    k += `<g transform="rotate(-18 ${sx} ${sy})"><circle cx="${r(sx - 3)}" cy="${r(sy - 0.6)}" r="1.3" fill="none" stroke="#2b8fd0" stroke-width=".9"/><circle cx="${r(sx - 3)}" cy="${r(sy + 1.6)}" r="1.3" fill="none" stroke="#2b8fd0" stroke-width=".9"/><path d="M${r(sx - 1.8)} ${r(sy - 0.2)} L${r(sx + 3.6)} ${r(sy + 0.6)} M${r(sx - 1.8)} ${r(sy + 1.2)} L${r(sx + 3.6)} ${r(sy + 0.4)}" stroke="${STAHL}" stroke-width=".9" stroke-linecap="round"/></g>`;
    unter.push({ id: "kg_schere", de: "die Kinderschere", syl: "KIN-der-sche-re", it: "le forbici per bambini", itSyl: "FOR-bi-ci per bam-BI-ni", en: "children's scissors", x: sx, y: sy + 2.6, kunst: flaeche(-5, -5, 10, 5.4),
      tipp: "Die Kinderschere hat eine runde Spitze. So kann man sich nicht stechen." });
  }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  const [zx0, zy0] = P(X0, H, z0);
  S.teil({ id: "kg_maltisch", de: "der Maltisch", syl: "MAL-tisch", it: "il tavolo da disegno", itSyl: "TA-vo-lo da di-SE-gno", en: "craft table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx0 - 4), y: r(zy0 - 14), w: 84, h: 56 }, unter });
}

/* =====================================================================
   15 — DAS MÄDCHEN (sitzt am Maltisch und malt)
   ===================================================================== */
{
  const z = MT.z0 - 0.12, X = 1.18;
  const kd = B.mensch({ id: "b10a_maed", alter: "kind", geschlecht: "w", pose: "b10a_malen", blick: 6, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e86aa0" }, unterteil: { stueck: "hose", farbe: "#3d5f8c" }, schuhe: { stueck: "turnschuh", farbe: "#f2f2f0" } } }, 1.12 * sk(z));
  const [fx, fy] = P(X, 0, z);
  /* ihr Kinderstuhl (Lehne hinter ihr, Sitz ragt seitlich heraus) */
  let st = "";
  for (const [dx, dz] of [[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]]) { const a = P(X + dx, 0, z + dz), b = P(X + dx, 0.28, z + dz); st += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#c9a46a" stroke-width="1.1"/>`; }
  st += kiste(X - 0.17, X + 0.17, 0.26, 0.29, z - 0.16, z + 0.16, { vorn: "#b98c55", deckel: "#3c7fd0", seite: "#b98c55" });
  st += kiste(X - 0.16, X + 0.16, 0.42, 0.58, z - 0.16, z - 0.14, { vorn: "#3c7fd0" });
  S.teil({ id: "kg_kind1", de: "das Mädchen", syl: "MÄD-chen", it: "la bambina", itSyl: "bam-BI-na", en: "girl", x: fx, y: fy, kunst: um(fx, fy, st) + kd.svg,
    tipp: "Das Mädchen malt einen Regenbogen." });
}

/* =====================================================================
   17 — DER JUNGE (kniet in der Bauecke und baut)
   ===================================================================== */
{
  const z = 1.8, X = -1.75;
  const kd = B.mensch({ id: "b10a_jung", alter: "kind", geschlecht: "m", pose: "b10a_bauen", blick: 58, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#3c7fd0" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "#e0553f" } } }, 1.16 * sk(z));
  const [fx, fy] = P(X, 0, z);
  S.teil({ id: "kg_kind2", de: "der Junge", syl: "JUN-ge", it: "il bambino", itSyl: "bam-BI-no", en: "boy", x: fx, y: fy, kunst: kd.svg,
    tipp: "Der Junge baut einen hohen Turm." });
}

/* =====================================================================
   18 — DER KINDERSTUHL (vorn am Maltisch, frei)
   ===================================================================== */
{
  const X = 1.05, z = 2.42, s = sk(z);
  let k = schatten(...P(X, 0, z), 0.2 * s, 1.2, 0.26);
  for (const [dx, dz] of [[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]]) { const a = P(X + dx, 0, z + dz), b = P(X + dx, 0.29, z + dz); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${S.lg("stuhlbein", [[0, "#d8b47c"], [1, "#b88c55"]], 0, 0, 1, 0)}" stroke-width="${r(0.035 * sk(z + dz))}" stroke-linecap="round"/>`; }
  k += kiste(X - 0.17, X + 0.17, 0.27, 0.3, z - 0.16, z + 0.16, { vorn: "#c9985e", deckel: S.lg("sitzschale", [[0, "#f6d23a"], [1, "#e0b520"]]), seite: "#b98c55" });
  /* Lehne zum Betrachter (er sitzt mit dem Rücken zu uns) */
  for (const dx of [-0.15, 0.15]) { const a = P(X + dx, 0.3, z + 0.15), b = P(X + dx, 0.58, z + 0.15); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#c9985e" stroke-width="${r(0.035 * s)}" stroke-linecap="round"/>`; }
  k += kiste(X - 0.17, X + 0.17, 0.44, 0.59, z + 0.14, z + 0.16, { vorn: S.lg("lehne", [[0, "#f6d23a"], [1, "#d9ac18"]]) });
  { const [lx, ly] = P(X, 0.52, z + 0.16); k += `<rect x="${r(lx - 3)}" y="${r(ly - 1.4)}" width="6" height="2.8" rx="1.4" fill="#e0b520"/><circle cx="${lx}" cy="${ly}" r=".9" fill="#d6402f"/>`; }
  const [ax, ay] = P(X, 0, z + 0.16);
  S.teil({ id: "kg_kinderstuhl", de: "der Kinderstuhl", syl: "KIN-der-stuhl", it: "la seggiolina", itSyl: "seg-gio-LI-na", en: "child's chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Kita-Stühle sind klein: Die Sitzfläche ist nur etwa 30 Zentimeter hoch." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kindergarten.js"));
console.log(aus);
