#!/usr/bin/env node
/* =====================================================================
   LÜBECK (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (Museum Holstentor „Digital Story“, Deutsche Stiftung
   Denkmalschutz „Holstentor“, structurae, Magazin Lübecker Bucht
   „Concordia domi foris pax“, visit-luebeck.com, Hansestadt Lübeck):
   - STANDORT: die Grünanlage am Holstentorplatz, etwa 95 m westlich vor
     der FELDSEITE des Holstentors (sie zeigt nach Westen, aus der Stadt
     hinaus), Blick nach Osten auf die Altstadtinsel. Nachmittag: die
     Sonne steht im Südwesten hinter uns rechts, die Feldseite liegt im
     warmen Licht; Schatten fallen nach links hinten.
   - HOLSTENTOR (1464–1478, Stadtbaumeister Hinrich Helmstede;
     Backsteingotik; UNESCO-Welterbe seit 1987): Südturm, Nordturm und
     Mittelbau, vier Geschosse (im Mittelbau fehlt das Erdgeschoss, dort
     liegt die Durchfahrt). Auf der Feldseite springen die beiden Türme
     halbrund vor, an der weitesten Stelle 3,5 m vor den Mittelbau. Die
     Türme tragen Kegeldächer aus Schiefer, der Mittelbau einen Giebel.
     Rund 20 m hohes Mauerwerk. Auf der Feldseite nur wenige kleine
     Fenster, dafür Schießscharten: in jedem Turm je drei Geschützkammern
     im Erdgeschoss, im 1. und im 2. Obergeschoss (im 2. OG stehen noch
     heute Kanonen). Mauerwerk aus roten und schwarz glasierten Ziegeln
     in wechselnden Lagen (im 19. Jh. großteils erneuert); um die Türme
     laufen zwei Terrakottabänder aus quadratischen Platten (55 cm
     Kantenlänge); Kalkstein für Gesimse und die Stürze der unteren
     Scharten, Granit für die Konsolen der oberen. Über der rundbogigen
     Durchfahrt die goldene Inschrift „CONCORDIA DOMI FORIS PAX“
     („Eintracht drinnen, draußen Frieden“, 1871). Der Südturm ist im
     weichen Boden abgesackt und neigt sich — das „schiefe Tor“.
   - DAHINTER, nach echten Richtungen (Peilung vom Standort): links die
     zwei Türme von ST. MARIEN (125 m, grüne Kupferhelme, ≈ 500 m),
     etwas rechts davon ST. PETRI (108 m, ≈ 410 m, mit Aussichtsplattform),
     beide über den Bäumen der Wallanlagen; rechts hinter dem Tor die
     SALZSPEICHER an der Obertrave (sechs Backsteinspeicher, 1579–1745,
     Treppen-, Voluten- und Barockgiebel, ≈ 210 m). Die Trave selbst
     liegt hinter den Speichern und ist von hier nicht zu sehen.
   - TYPISCH: Lübecker Marzipan (Niederegger, roter Karton/rote Tüte mit
     goldener Schrift), Möwen von der nahen Ostsee, viele Touristen und
     Reisegruppen, Fahrräder, die Farben der Stadt Weiß und Rot.
   UNSICHER (ohne Foto-Beleg, aus Fachwissen): die genaue Form des
   Feldseiten-Giebels über dem Mittelbau, die Zahl der sichtbaren Scharten
   je Geschoss, die Anordnung der dunklen Ziegellagen, die Neigung des
   Südturms (hier leicht übertrieben, 0,8°).
   Maßstab: Augenhöhe y = 178 (1,7 m), Brennweite 400 Einheiten. Am Boden
   gilt: Einheiten je Meter = (y − 178) / 1,7. Das Tor (95 m) hat 4,21
   Einheiten je Meter, Fuß bei y = 185,2.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "luebeck", titel: "Lübeck", emoji: "🧱", thema: "Deutschland", kuerzel: "lbk", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1478);
const r = B.r;
const W = 400, HH = 260, HOR = 178, F = 400, AUGE = 1.7;
const km = (y) => (y - HOR) / AUGE;
const proj = (lat, d) => [r(200 + lat * F / d), r(HOR + AUGE * F / d)];

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation=".8"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("laub")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".25"/></filter>`);
/* Streiflicht von rechts (Sonne im Südwesten): warme Lichtkante rechts, weicher Eigenschatten links */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("licht")}" x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx="-.22" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="rk"/><feFlood flood-color="#ffd9a0" flood-opacity=".9"/><feComposite in2="rk" operator="in" result="kante"/><feOffset in="SourceAlpha" dx=".7" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="lk"/><feGaussianBlur in="lk" stdDeviation=".25" result="lk2"/><feFlood flood-color="#1f1a24" flood-opacity=".3"/><feComposite in2="lk2" operator="in" result="eigen"/><feComposite in="eigen" in2="SourceAlpha" operator="in" result="eigen2"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="eigen2"/><feMergeNode in="kante"/></feMerge></filter>`);
const licht = (svg) => `<g filter="url(#${S.id("licht")})">${svg}</g>`;

/* Stoffe: Lübecker Backstein (tiefrot), schwarz glasierte Lagen, Schiefer, Kupfer */
const ZIEGEL = S.lg("ziegel", [[0, "#561f16"], [0.25, "#7a301e"], [0.62, "#a6492b"], [0.8, "#b85a35"], [1, "#8e3c25"]], 0, 0, 1, 0);
const ZIEGEL_M = S.lg("ziegelm", [[0, "#6e2b1d"], [0.5, "#8f3d26"], [1, "#9c4429"]], 0, 0, 1, 0);
const GLASUR = S.lg("glasur", [[0, "#140f0e"], [0.3, "#2a1d19"], [0.62, "#4a3a33"], [0.78, "#6d5a4e"], [1, "#30231e"]], 0, 0, 1, 0);
const TERRA = S.lg("terra", [[0, "#1d1512"], [0.6, "#3d2b22"], [0.8, "#5a4232"], [1, "#2c201a"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#1e252d"], [0.35, "#2f3a46"], [0.65, "#4e5c6a"], [0.82, "#6b7986"], [1, "#3b4652"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#3f7563"], [0.6, "#79b39b"], [1, "#4f8a74"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#f0c64a"], [1, "#a8781a"]], 0, 0, 1, 1);
const KALK = "#e6dcc6";
const LANG = S.lg("lang", [[0, "#2b2420", 0.75], [1, "#2b2420", 0.2]], 0, 1, 0, 0);
/* Ziegelverband (Läufer, versetzt) als Muster in Tor-Einheiten */
S.def(`<pattern id="${S.id("verband")}" patternUnits="userSpaceOnUse" width="1.2" height=".76"><path d="M0 .38 H1.2 M0 .76 H1.2 M.6 0 V.38 M0 .38 V.76 M1.2 .38 V.76" stroke="#e7c3a3" stroke-width=".07" fill="none"/></pattern>`);

/* einzelne dunklere und hellere Ziegel (Brandfarben), unregelmäßig verteilt */
{
  const z = zufall(77);
  let p = "";
  for (let i = 0; i < 26; i++) { const row = Math.floor(z() * 10), col = Math.floor(z() * 6) + (row % 2 ? 0.5 : 0); p += `<rect x="${r(col * 1.2 + 0.05)}" y="${r(row * 0.38 + 0.05)}" width="1.1" height=".29" fill="${z() < 0.6 ? "#3a140d" : "#d27a52"}" opacity="${r(0.25 + z() * 0.3)}"/>`; }
  S.def(`<pattern id="${S.id("brand")}" patternUnits="userSpaceOnUse" width="7.2" height="3.8">${p}</pattern>`);
}
/* Schlagschatten der Dinge: die Sonne steht hinten rechts (SW), Höhe ≈ 32° —
   jeder Schatten fällt vom Betrachter weg nach links (Länge ≈ 1,6 × Höhe).
   Die Schatten liegen auf dem Boden (Rasen/Weg), nicht am Ding. */
const SCHATTEN = [];
const schlag = (lat, d, hoeheM, breiteM = 0.5, a = 0.42) => {
  const L = 1.6 * hoeheM, dl = -Math.sin(40 * Math.PI / 180) * L, dd = Math.cos(40 * Math.PI / 180) * L;
  const [x1, y1] = proj(lat - breiteM / 2, d), [x2, y2] = proj(lat + breiteM / 2, d);
  const [x3, y3] = proj(lat + dl + breiteM * 0.3, d + dd), [x4, y4] = proj(lat + dl - breiteM * 0.3, d + dd);
  SCHATTEN.push(`<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} L${x4} ${y4} Z" fill="#2b2a1e" opacity="${a}" filter="url(#${S.id("dunst")})"/>`);
};

/* Mensch aus dem Baukasten, ohne runden Bodenschatten, feine Linien weg, Pfade gerundet (Ladezeit) */
function figur(spec, hoehe, fein = 1) {
  const m = B.mensch(spec, hoehe);
  const kopfY = -0.83 * (m.z.hoehe || 170);
  let z = m.z.svg.replace(/(<g class="mensch">(?:<defs>.*?<\/defs>)?)<ellipse[^>]*\/>/s, "$1");
  z = z.replace(/<path [^>]*\/>/g, (t) => (/fill="none"/.test(t) && +((t.match(/stroke-width="([\d.]+)"/) || [])[1] || 9) < 0.4) ? "" : t);
  z = z.replace(/ d="([^"]*)"/g, (a, v) => {
    const zs = (v.match(/-?\d+\.?\d*/g) || []).map(Number), ys = zs.filter((_, i) => i % 2);
    const q = Math.min(...ys) < kopfY ? fein : 1;
    return ` d="${v.replace(/-?\d+\.\d+/g, (x) => String(Math.round(+x / q) * q))}"`;
  }).replace(/ (x1|y1|x2|y2)="(-?\d+\.\d+)"/g, (a, n, v) => ` ${n}="${Math.round(+v)}"`);
  return { svg: `<g transform="scale(${m.k.toFixed(4)})">${z}</g>`, k: m.k, z: m.z };
}
/* kleine Figur in der Ferne */
function passant(x, y, h, o = {}) {
  const { hemd = "#3d5a80", hose = "#2f3640", haar = "#4a3426", haut = "#e3b796", schritt = 0.1, rueck = true } = o;
  const X = (f) => r(x + f * h), Y = (f) => r(y - f * h);
  let g = `<path d="M${X(-0.05)} ${Y(0.5)} L${X(-0.06 - schritt)} ${Y(0.02)} L${X(-0.01 - schritt)} ${Y(0.02)} L${X(0)} ${Y(0.4)} L${X(0.01 + schritt)} ${Y(0.02)} L${X(0.06 + schritt)} ${Y(0.02)} L${X(0.05)} ${Y(0.5)} Z" fill="${hose}"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(0.09)} ${Y(0.48)} Q${X(0.12)} ${Y(0.6)} ${X(0.11)} ${Y(0.82)} Q${X(0)} ${Y(0.85)} ${X(-0.11)} ${Y(0.82)} Z" fill="${hemd}"/>`;
  g += `<path d="M${X(0.03)} ${Y(0.82)} Q${X(0.12)} ${Y(0.6)} ${X(0.09)} ${Y(0.48)} L${X(0.05)} ${Y(0.48)} Q${X(0.08)} ${Y(0.64)} ${X(0.03)} ${Y(0.82)} Z" fill="#ffd9a0" opacity=".3"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.8)} L${X(-0.14)} ${Y(0.53)} M${X(0.11)} ${Y(0.8)} L${X(0.14)} ${Y(0.53)}" stroke="${hemd}" stroke-width="${r(0.055 * h)}" stroke-linecap="round"/>`;
  g += `<rect x="${X(-0.025)}" y="${Y(0.88)}" width="${r(0.05 * h)}" height="${r(0.06 * h)}" fill="${haut}"/><ellipse cx="${X(0)}" cy="${Y(0.93)}" rx="${r(0.06 * h)}" ry="${r(0.07 * h)}" fill="${haut}"/>`;
  g += rueck ? `<ellipse cx="${X(0)}" cy="${Y(0.94)}" rx="${r(0.064 * h)}" ry="${r(0.072 * h)}" fill="${haar}"/>` : `<path d="M${X(-0.064)} ${Y(0.93)} Q${X(-0.06)} ${Y(1.01)} ${X(0)} ${Y(1.005)} Q${X(0.06)} ${Y(1.01)} ${X(0.064)} ${Y(0.93)} Q${X(0.03)} ${Y(0.975)} ${X(-0.064)} ${Y(0.93)} Z" fill="${haar}"/>`;
  return g;
}
function wolke(x, y, s, seed) {
  const z = zufall(seed);
  let w = `<g filter="url(#${S.id("wolke")})" opacity=".95">`;
  const n = 5 + Math.floor(z() * 5), puffs = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1) - 0.5; puffs.push([t * 34 * s * (0.8 + z() * 0.4), -(1 - Math.abs(t) * 1.6) * 7 * s * (0.6 + z() * 0.8), (5 + z() * 6) * s * (1 - Math.abs(t) * 0.8)]); }
  w += `<ellipse cx="${x}" cy="${r(y + 2 * s)}" rx="${r(20 * s)}" ry="${r(3 * s)}" fill="#dccfd0"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr)}" fill="#f4eee8"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx - rr * 0.2)}" cy="${r(y + dy - rr * 0.25)}" r="${r(rr * 0.7)}" fill="#fffaf2"/>`;
  w += `<ellipse cx="${x}" cy="${r(y + 2.4 * s)}" rx="${r(17 * s)}" ry="${r(1.8 * s)}" fill="#cfc0c4" opacity=".8"/></g>`;
  return w;
}
/* Laubbaum aus Blattbüscheln, Licht von rechts oben */
function baum(x, y, h, seed, dunkel = 0) {
  const z = zufall(seed);
  const kr = h * 0.36;
  let g = `<path d="M${r(x - h * 0.025)} ${y} L${r(x - h * 0.012)} ${r(y - h * 0.5)} L${r(x + h * 0.012)} ${r(y - h * 0.5)} L${r(x + h * 0.03)} ${y} Z" fill="#4a3a2c"/>`;
  const c = [];
  for (let i = 0; i < 26; i++) { const a = z() * Math.PI * 2, rr = Math.sqrt(z()) * kr; c.push([x + Math.cos(a) * rr * 1.1, y - h * 0.62 + Math.sin(a) * rr * 0.9, kr * (0.28 + z() * 0.2)]); }
  c.sort((a, b) => a[1] - b[1]);
  const t = ["#2f4a26", "#3c5c2c", "#4f7234"].map((f) => dunkel ? f : f);
  g += `<g filter="url(#${S.id("laub")})">`;
  for (const [a, b, rr] of c) g += `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}" fill="${t[0]}"/>`;
  for (const [a, b, rr] of c) g += `<circle cx="${r(a + rr * 0.22)}" cy="${r(b - rr * 0.2)}" r="${r(rr * 0.72)}" fill="${t[1]}"/>`;
  for (const [a, b, rr] of c) if (a > x - kr * 0.3) g += `<circle cx="${r(a + rr * 0.38)}" cy="${r(b - rr * 0.36)}" r="${r(rr * 0.4)}" fill="${dunkel ? "#5d7d3c" : "#86a24e"}" opacity=".85"/>`;
  g += `</g>`;
  return g;
}

/* =====================================================================
   KULISSE — Nachmittagshimmel, ferne Dächer im Dunst
   ===================================================================== */
S.hinten(`<rect width="${W}" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#5f8fc4"], [0.45, "#93b5da"], [0.8, "#d9dfe0"], [1, "#f1dec2"]])}"/>`);
S.hinten(`<circle cx="420" cy="150" r="160" fill="${S.rg("sonne", [[0, "#fff0c8", 0.6], [0.4, "#ffe2a8", 0.22], [1, "#ffe2a8", 0]])}"/>`);
S.hinten(wolke(78, 26, 1.05, 3) + wolke(300, 18, 0.8, 17) + wolke(366, 58, 0.55, 31) + wolke(176, 44, 0.45, 47));
{
  /* Altstadtdächer und Giebel weit hinter dem Tor, im Dunst (unter der Baumkante) */
  let c = "";
  let x = 0;
  while (x < W) {
    const w2 = 5 + rnd() * 7, h = 8 + rnd() * 7;
    c += `<path d="M${r(x)} ${HOR + 2} V${r(HOR - h)} L${r(x + w2 / 2)} ${r(HOR - h - w2 * 0.8)} L${r(x + w2)} ${r(HOR - h)} V${HOR + 2} Z" fill="${rnd() < 0.5 ? "#a87e6e" : "#9a7466"}"/>`;
    x += w2 + 0.4;
  }
  S.hinten(`<g opacity=".8">${c}</g><rect x="0" y="${HOR - 30}" width="${W}" height="34" fill="${S.lg("dunstband", [[0, "#e8dccc", 0], [1, "#e8dccc", 0.55]])}"/>`);
}

/* =====================================================================
   0 — DER WEG (Pflaster zur Durchfahrt) und DER RASEN (Grünanlage)
   Gezeichnet zuerst (ganz hinten); die Schlagschatten kommen am Ende dazu.
   ===================================================================== */
const WEG = (d) => [proj(-2.1, d), proj(2.1, d)];
const TORD = 82;
const WEGPFAD = (() => { const [a1, b1] = WEG(TORD), [a2, b2] = WEG(8.29); return `M${a1[0]} ${a1[1]} L${b1[0]} ${b1[1]} L${b2[0]} ${b2[1]} L${a2[0]} ${a2[1]} Z`; })();
S.def(`<clipPath id="${S.id("wegclip")}"><path d="${WEGPFAD}"/></clipPath>`);
S.def(`<clipPath id="${S.id("rasenclip")}"><path clip-rule="evenodd" d="M0 ${HOR} H${W} V${HH} H0 Z ${WEGPFAD}"/></clipPath>`);
let WEG_TEIL, RASEN_TEIL;
{
  let k = `<path d="${WEGPFAD}" fill="${S.lg("wegstein", [[0, "#a59a8b"], [1, "#bdb2a1"]])}"/>`;
  /* Reihen aus Granitpflaster in Fluchtperspektive */
  let i = 0;
  for (let d = TORD; d > 8.6; d /= 1.06, i++) {
    const [[x1, y1], [x2]] = WEG(d), [[x3, y3], [x4]] = WEG(d / 1.06), h = y3 - y1, s = km((y1 + y3) / 2);
    const st = Math.max(0.6, 0.14 * s), gap = Math.max(0.12, 0.025 * s);
    k += `<line x1="${x3}" y1="${r((y1 + y3) / 2)}" x2="${x4}" y2="${r((y1 + y3) / 2)}" stroke="${["#998d7d", "#aea291", "#a19584"][i % 3]}" stroke-width="${r(h * 0.82)}" stroke-dasharray="${r(st)} ${r(gap)}" stroke-dashoffset="${r((i * 7 % 10) / 10 * st)}" clip-path="url(#${S.id("wegclip")})"/>`;
  }
  k += `<path d="${WEGPFAD}" fill="${S.lg("weglicht", [[0, "#000", 0.08], [1, "#ffd9a0", 0.12]], 0, 0, 1, 0)}"/>`;
  WEG_TEIL = S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k });
}
{
  let k = `<g clip-path="url(#${S.id("rasenclip")})"><rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("rasen", [[0, "#7d9a4d"], [0.3, "#6b8f3e"], [1, "#4f7a2c"]])}"/>`;
  /* Mähstreifen und Halme (vorn größer) */
  /* Mähstreifen, die zum Tor laufen (Fluchtpunkt), hell und dunkel im Wechsel */
  for (let i = -16; i < 16; i++) {
    const kl = (v) => Math.max(0, Math.min(W, v));
    const [a1] = proj(i * 1.6, 80), [a2] = proj((i + 1) * 1.6, 80), [b1] = proj(i * 1.6, 8.29), [b2] = proj((i + 1) * 1.6, 8.29);
    if (b2 < 0 || b1 > W) continue;
    k += `<path d="M${kl(a1)} ${r(HOR + 8.3)} L${kl(a2)} ${r(HOR + 8.3)} L${kl(b2)} ${HH} L${kl(b1)} ${HH} Z" fill="${i % 2 ? "#c2d67a" : "#2f4a1a"}" opacity=".07"/>`;
  }
  k += `<ellipse cx="80" cy="${HOR + 16}" rx="70" ry="5" fill="#2f4a1a" opacity=".18" filter="url(#bw_weich)"/><ellipse cx="320" cy="${HOR + 12}" rx="60" ry="4" fill="#2f4a1a" opacity=".16" filter="url(#bw_weich)"/>`;
  let halme = "";
  for (let n = 0; n < 340; n++) {
    const y = HOR + 6 + Math.pow(rnd(), 0.7) * (HH - HOR - 6), x = rnd() * W, s = km(y) * 0.05;
    halme += `M${r(x)} ${r(y)} l${r((rnd() - 0.5) * s)} ${r(-s * (1 + rnd()))} `;
  }
  k += `<path d="${halme}" stroke="#3d6324" stroke-width=".35" opacity=".55" fill="none"/>`;
  /* Gänseblümchen im Rasen (vorn größer) */
  for (let n = 0; n < 70; n++) {
    const y = HOR + 20 + Math.pow(rnd(), 0.6) * (HH - HOR - 22), x = rnd() * W, s = km(y) * 0.025;
    if (Math.abs(x - 200) < (y - HOR) * 2.5) continue;
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(s)}" fill="#f8f6ee"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(s * 0.4)}" fill="#f0c64a"/>`;
  }
  k += `<rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("rasenlicht", [[0, "#2a3a1a", 0.25], [0.5, "#000", 0], [1, "#ffd9a0", 0.14]], 0, 0, 1, 0)}"/>`;
  /* Rasenkante aus Granit am Weg */
  const [[a1x, a1y], [b1x, b1y]] = WEG(TORD), [[a2x, a2y], [b2x, b2y]] = WEG(8.29);
  k += `<path d="M${a1x} ${a1y} L${a2x} ${a2y}" stroke="#d6cdbb" stroke-width="1.2"/><path d="M${b1x} ${b1y} L${b2x} ${b2y}" stroke="#e2d9c6" stroke-width="1.2"/></g>`;
  RASEN_TEIL = S.teil({ id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k,
    tipp: "Rund um das Holstentor liegt eine Grünanlage. Hier machen viele Leute eine Pause." });
}

/* =====================================================================
   1 — DIE MARIENKIRCHE (zwei Türme, 125 m, ≈ 500 m entfernt, links)
   ===================================================================== */
{
  const K = F / 500, fuss = r(HOR + AUGE * K);
  let k = "";
  const MAR = S.lg("mar", [[0, "#6a2f22"], [0.55, "#93452f"], [1, "#ad5a3c"]], 0, 0, 1, 0);
  /* Westbau zwischen den Türmen (Giebel des Mittelschiffs mit großem Fenster) */
  k += `<rect x="40" y="${r(fuss - 44 * K)}" width="12" height="${r(44 * K)}" fill="#7f3a28"/>`;
  k += `<path d="M40 ${r(fuss - 44 * K)} L46 ${r(fuss - 58 * K)} L52 ${r(fuss - 44 * K)} Z" fill="#8a4029"/>`;
  k += `<path d="M44.4 ${r(fuss - 20 * K)} V${r(fuss - 38 * K)} L46 ${r(fuss - 42 * K)} L47.6 ${r(fuss - 38 * K)} V${r(fuss - 20 * K)} Z" fill="#3a1d16"/>`;
  for (const cx of [34, 58]) {
    const w = 13.5 * K, mh = 74 * K, sp = 51 * K;
    const top = fuss - mh;
    k += `<rect x="${r(cx - w / 2)}" y="${r(top)}" width="${r(w)}" height="${r(mh)}" fill="${MAR}"/>`;
    /* Eckpfeiler (Lisenen) und Gesimse */
    k += `<rect x="${r(cx - w / 2)}" y="${r(top)}" width="1" height="${r(mh)}" fill="#5e2a1e"/><rect x="${r(cx + w / 2 - 1)}" y="${r(top)}" width="1" height="${r(mh)}" fill="#b8644a"/>`;
    for (let j = 0; j < 8; j++) k += `<rect x="${r(cx - w / 2)}" y="${r(top + j * 6.6 - 0.25)}" width="${r(w)}" height=".5" fill="#d0a684" opacity=".55"/>`;
    /* je Geschoss zwei hohe Spitzbogen-Blenden, oben die offenen Schallarkaden */
    for (let j = 0; j < 7; j++) {
      const y = top + 1.1 + j * 6.6;
      for (const dx of [-2.6, 0, 2.6]) {
        if (j > 1 && dx === 0) continue;
        k += `<path d="M${r(cx + dx - 0.75)} ${r(y + 4.9)} V${r(y + 1.3)} L${r(cx + dx)} ${r(y)} L${r(cx + dx + 0.75)} ${r(y + 1.3)} V${r(y + 4.9)} Z" fill="${j < 2 ? "#24130f" : "#5e2a1e"}"/>`;
      }
    }
    /* Uhr am oberen Geschoss */
    k += `<circle cx="${cx}" cy="${r(top + 15.8)}" r="1.5" fill="#1d2a24" stroke="#c9a640" stroke-width=".3"/>`;
    /* vier Giebel am Helmfuß, Ecktürmchen, der schlanke achteckige Kupferhelm */
    k += `<path d="M${r(cx - w / 2)} ${r(top)} L${r(cx - w / 4)} ${r(top - 3.4)} L${r(cx)} ${r(top)} L${r(cx + w / 4)} ${r(top - 3.4)} L${r(cx + w / 2)} ${r(top)} Z" fill="#8a3f2b"/>`;
    for (const ex of [-w / 2 + 0.4, w / 2 - 0.4]) k += `<path d="M${r(cx + ex - 0.5)} ${r(top)} L${r(cx + ex)} ${r(top - 4.6)} L${r(cx + ex + 0.5)} ${r(top)} Z" fill="${KUPFER}"/>`;
    k += `<path d="M${r(cx - w * 0.36)} ${r(top - 1)} L${r(cx - 0.25)} ${r(top - sp)} L${r(cx + 0.25)} ${r(top - sp)} L${r(cx + w * 0.36)} ${r(top - 1)} Z" fill="${KUPFER}"/>`;
    k += `<path d="M${r(cx + 0.1)} ${r(top - sp)} L${r(cx + w * 0.12)} ${r(top - 1)}" stroke="#a9d8c2" stroke-width=".35" opacity=".7"/>`;
    k += `<path d="M${r(cx - w * 0.36)} ${r(top - 1)} L${r(cx - w * 0.15)} ${r(top - 1)} L${r(cx - 0.1)} ${r(top - sp)} Z" fill="#2f5a4a" opacity=".45"/>`;
    k += `<path d="M${r(cx)} ${r(top - sp)} V${r(top - sp - 3.4)} M${r(cx - 0.9)} ${r(top - sp - 2.3)} H${r(cx + 0.9)}" stroke="#c9a640" stroke-width=".4"/><circle cx="${r(cx)}" cy="${r(top - sp - 0.6)}" r=".55" fill="${GOLD}"/>`;
  }
  k = `<g filter="url(#${S.id("dunst")})" opacity=".92">${k}</g>`;
  S.teil({ id: "marienkirche", de: "die Marienkirche", syl: "ma-RI-en-kir-che", it: "la chiesa di Santa Maria", itSyl: "CHIE-sa di SAN-ta ma-RI-a", en: "St Mary's Church",
    x: 0, y: 0, kunst: k, tipp: "Die Türme der Marienkirche sind 125 Meter hoch. Viele Kirchen an der Ostsee sind nach ihrem Vorbild gebaut." });
}

/* =====================================================================
   2 — DIE PETRIKIRCHE (ein Turm, 108 m, ≈ 410 m)
   ===================================================================== */
{
  const K = F / 410, fuss = HOR + AUGE * K, cx = 96;
  const w = 12 * K, mh = 60 * K, sp = 48 * K, top = fuss - mh;
  let k = `<rect x="${r(cx - w / 2)}" y="${r(top)}" width="${r(w)}" height="${r(mh)}" fill="${S.lg("pet", [[0, "#6e3326"], [0.6, "#98482f"], [1, "#ae5a3d"]], 0, 0, 1, 0)}"/>`;
  for (let j = 0; j < 4; j++) {
    const y = top + 3 + j * 7;
    for (const dx of [-3, -1, 1, 3]) k += `<path d="M${r(cx + dx - 0.6)} ${r(y + 4.6)} V${r(y + 1)} Q${r(cx + dx)} ${r(y - 0.2)} ${r(cx + dx + 0.6)} ${r(y + 1)} V${r(y + 4.6)} Z" fill="${j === 0 ? "#2c1712" : "#5a2a1f"}"/>`;
  }
  /* Aussichtsplattform am Helmfuß: Geländer und kleine Leute */
  k += `<rect x="${r(cx - w / 2 - 0.6)}" y="${r(top - 0.8)}" width="${r(w + 1.2)}" height=".9" fill="#d9cfc0"/>`;
  k += `<path d="M${r(cx - w / 2 - 0.6)} ${r(top - 2.2)} H${r(cx + w / 2 + 0.6)}" stroke="#3a3a3a" stroke-width=".25"/>`;
  for (const dx of [-4.2, -1.6, 3.1]) k += `<rect x="${r(cx + dx)}" y="${r(top - 2.4)}" width=".6" height="1.6" fill="${dx < 0 ? "#3d5a80" : "#b8473a"}"/>`;
  /* Helm mit vier kleinen Giebeln, grünes Kupfer */
  k += `<path d="M${r(cx - w / 2)} ${r(top - 0.8)} L${r(cx - w / 4)} ${r(top - 4.6)} L${r(cx)} ${r(top - 0.8)} L${r(cx + w / 4)} ${r(top - 4.6)} L${r(cx + w / 2)} ${r(top - 0.8)} Z" fill="${KUPFER}"/>`;
  k += `<path d="M${r(cx - w * 0.4)} ${r(top - 2)} L${r(cx)} ${r(top - sp)} L${r(cx + w * 0.4)} ${r(top - 2)} Z" fill="${KUPFER}"/>`;
  k += `<path d="M${r(cx)} ${r(top - sp)} L${r(cx + w * 0.14)} ${r(top - 2)}" stroke="#a9d8c2" stroke-width=".3" opacity=".7"/>`;
  k += `<path d="M${r(cx)} ${r(top - sp)} V${r(top - sp - 3)}" stroke="#c9a640" stroke-width=".35"/><circle cx="${r(cx)}" cy="${r(top - sp - 3.2)}" r=".5" fill="${GOLD}"/>`;
  k = `<g filter="url(#${S.id("dunst")})" opacity=".95">${k}</g>`;
  S.teil({ id: "petrikirche", de: "die Petrikirche", syl: "PE-tri-kir-che", it: "la chiesa di San Pietro", itSyl: "CHIE-sa di san PIE-tro", en: "St Peter's Church",
    x: 0, y: 0, kunst: k, tipp: "Auf den Turm der Petrikirche fährt ein Aufzug. Von oben sieht man die ganze Altstadt." });
}

/* =====================================================================
   3 — DIE SALZSPEICHER (rechts hinter dem Tor, ≈ 210 m) — Lupe: der Giebel
   ===================================================================== */
const SPEICHER = { x0: 296, d: 210 };
{
  const K = F / SPEICHER.d, fuss = r(HOR + AUGE * K);
  let k = "";
  /* sechs Speicher von Norden nach Süden; wir sehen gut vier davon */
  const haeuser = [
    { w: 11, h: 11, g: 9, art: "treppe", f: "#9c4a30" },
    { w: 12, h: 12, g: 10, art: "volute", f: "#a5553a" },
    { w: 11, h: 11, g: 9.5, art: "treppe", f: "#8e4229" },
    { w: 13, h: 12.5, g: 10, art: "barock", f: "#ab5a3c" },
  ];
  let x = SPEICHER.x0;
  const giebel = [];
  haeuser.forEach((hs, i) => {
    const w = hs.w * K, h = hs.h * K, g = hs.g * K, top = fuss - h;
    const lean = i === 2 ? -0.6 : 0;
    let p = `<path d="M${r(x)} ${fuss} V${r(top)} `;
    if (hs.art === "treppe") {
      const n = 5;
      for (let s = 0; s < n; s++) p += `L${r(x + (s * w / 2) / n)} ${r(top - (s + 1) * g / n)} L${r(x + ((s + 1) * w / 2) / n)} ${r(top - (s + 1) * g / n)} `;
      p += `L${r(x + w / 2 + w / 2 / n)} ${r(top - g)} `;
      for (let s = n - 1; s >= 0; s--) p += `L${r(x + w - (s * w / 2) / n)} ${r(top - (s + 1) * g / n)} L${r(x + w - (s * w / 2) / n)} ${r(top - s * g / n)} `;
    } else if (hs.art === "volute") {
      p += `Q${r(x + w * 0.06)} ${r(top - g * 0.45)} ${r(x + w * 0.22)} ${r(top - g * 0.5)} Q${r(x + w * 0.3)} ${r(top - g * 0.95)} ${r(x + w * 0.42)} ${r(top - g)} L${r(x + w * 0.58)} ${r(top - g)} Q${r(x + w * 0.7)} ${r(top - g * 0.95)} ${r(x + w * 0.78)} ${r(top - g * 0.5)} Q${r(x + w * 0.94)} ${r(top - g * 0.45)} ${r(x + w)} ${r(top)} `;
    } else {
      p += `Q${r(x + w * 0.1)} ${r(top - g * 0.6)} ${r(x + w * 0.3)} ${r(top - g * 0.62)} Q${r(x + w * 0.36)} ${r(top - g * 1.08)} ${r(x + w / 2)} ${r(top - g * 1.08)} Q${r(x + w * 0.64)} ${r(top - g * 1.08)} ${r(x + w * 0.7)} ${r(top - g * 0.62)} Q${r(x + w * 0.9)} ${r(top - g * 0.6)} ${r(x + w)} ${r(top)} `;
    }
    p += `V${fuss} Z`;
    k += `<g transform="rotate(${lean} ${r(x + w / 2)} ${fuss})"><path d="${p.replace("<path d=\"", "")}" fill="${hs.f}"/>`;
    /* Licht von rechts auf der Giebelwand, Schatten links */
    k += `<path d="${p.replace("<path d=\"", "")}" fill="${S.lg("spl", [[0, "#2a0f08", 0.28], [0.5, "#000", 0], [1, "#ffcf8f", 0.18]], 0, 0, 1, 0)}"/>`;
    /* Ladeluken (Holz) und kleine Fenster in Reihen, mittig die Luken übereinander */
    for (let row = 0; row < 5; row++) {
      const yy = fuss - 2.6 - row * 4.2;
      if (yy < top - g + 3) break;
      const breite = yy < top ? w * (1 - (top - yy) / g) * 0.9 : w;
      const nf = yy < top ? 1 : 3;
      for (let j = 0; j < nf; j++) {
        const xx = nf === 1 ? x + w / 2 : x + w * (0.22 + j * 0.28);
        const luke = nf === 1 || j === 1;
        k += `<rect x="${r(xx - 0.8)}" y="${r(yy - 2.4)}" width="1.6" height="2.4" fill="${luke ? "#3a2a1c" : "#2a1d18"}"/>`;
        if (luke) k += `<rect x="${r(xx - 0.8)}" y="${r(yy - 2.4)}" width="1.6" height=".4" fill="#e9dcc5"/>`;
      }
      if (breite < 2) break;
    }
    /* Ankersplinte (eiserne Maueranker) */
    for (const ax of [0.2, 0.5, 0.8]) k += `<path d="M${r(x + w * ax - 0.5)} ${r(top + 1)} h1" stroke="#2a2420" stroke-width=".3"/>`;
    k += `</g>`;
    if (hs.art === "treppe" && !giebel.length) giebel.push({ x: x + w / 2, y: top, w, g });
    x += w + 0.3;
  });
  S.SPEICHER_G = giebel[0];
  k = `<g filter="url(#${S.id("dunst")})">${k}</g>`;
  const G0 = giebel[0];
  S.teil({ id: "salzspeicher", de: "der Salzspeicher", syl: "SALZ-spei-cher", it: "il magazzino del sale", itSyl: "ma-gaz-ZI-no del SA-le", en: "salt warehouse",
    x: 0, y: 0, kunst: k, tipp: "In den Salzspeichern lagerte früher Salz aus Lüneburg. Die Hanse verkaufte es bis nach Skandinavien.",
    zoom: { x: SPEICHER.x0 - 4, y: r(fuss - 52), w: 108, h: 72 },
    unter: [
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: r(G0.x), y: r(G0.y), kunst: flaeche(-G0.w / 2, -G0.g, G0.w, G0.g + 2, 0.5),
        tipp: "Viele alte Häuser in Lübeck haben einen Treppengiebel: Die Kante sieht aus wie eine Treppe." },
    ] });
}

/* =====================================================================
   4 — DIE BÄUME der Wallanlagen (links und rechts hinter dem Tor)
   ===================================================================== */
{
  let k = "";
  /* hinten links (zwischen den Kirchen und dem Tor) und rechts vor den Speichern */
  for (const [x, d, h, s] of [[24, 140, 15, 3], [52, 150, 15, 5], [88, 130, 17, 7], [120, 125, 14, 11], [278, 120, 14, 13], [382, 118, 11, 19]]) {
    const K = F / d, y = r(HOR + AUGE * K);
    k += baum(x, y, h * K, s);
  }
  /* Hecke am Rand der Grünanlage */
  k += `<path d="M0 ${HOR + 3} Q60 ${HOR - 2} 130 ${HOR + 2} L130 ${HOR + 6} L0 ${HOR + 7} Z" fill="#3c5a2a"/><path d="M262 ${HOR + 3} Q330 ${HOR - 1} 400 ${HOR + 1} L400 ${HOR + 6} L262 ${HOR + 6} Z" fill="#3c5a2a"/>`;
  k += `<path d="M0 ${HOR + 3} Q60 ${HOR - 2} 130 ${HOR + 2}" stroke="#6d8f45" stroke-width=".8" fill="none"/>`;
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   5 — DAS HOLSTENTOR (Feldseite) — Lupe: Turm, Kegeldach, Inschrift,
       Schießscharte, Fries, Backstein, Durchfahrt
   ===================================================================== */
const GD = 82, GK = F / GD, GX = 200, GY = r(HOR + AUGE * GK);
const M = (m) => r(m * GK);                       /* Meter → Einheiten am Tor */
const TURM = { R: 5.8, cx: 10.4, H: 20, kegel: 12.4, Rk: 6.45 };
const bogen = (h, R) => r((h - AUGE) * F * R / (GD * GD));   /* wie stark sich ein Ring in Höhe h nach oben wölbt */
let TOR_UNTER = [];
{
  let k = "";
  /* ---------- Mittelbau (liegt 3,5 m hinter den Turmfronten) ---------- */
  const mw = 4.7, mh = 19.2, gh = 7.6;
  let mb = `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(mh)}" fill="${ZIEGEL_M}"/>`;
  mb += `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(mh)}" fill="url(#${S.id("verband")})" opacity=".35"/>`;
  mb += `<rect x="${-M(mw)}" y="${-M(mh)}" width="${M(2 * mw)}" height="${M(mh)}" fill="url(#${S.id("brand")})"/>`;
  for (const h of [3.2, 10.4, 12.0, 17.2]) mb += `<rect x="${-M(mw)}" y="${-M(h + 0.45)}" width="${M(2 * mw)}" height="${M(0.45)}" fill="${GLASUR}"/>`;
  /* Giebel über dem Mittelbau: gestuft, mit Blendnischen */
  let gp = `M${-M(mw)} ${-M(mh)} `;
  const st = 4;
  for (let s = 0; s < st; s++) gp += `L${-M(mw - s * mw / st)} ${-M(mh + (s + 1) * gh / (st + 0.6))} L${-M(mw - (s + 1) * mw / st + 0.35)} ${-M(mh + (s + 1) * gh / (st + 0.6))} `;
  gp += `L0 ${-M(mh + gh)} `;
  for (let s = st - 1; s >= 0; s--) gp += `L${M(mw - (s + 1) * mw / st + 0.35)} ${-M(mh + (s + 1) * gh / (st + 0.6))} L${M(mw - s * mw / st)} ${-M(mh + (s + 1) * gh / (st + 0.6))} `;
  gp += `L${M(mw)} ${-M(mh)} Z`;
  mb += `<path d="${gp}" fill="${ZIEGEL_M}"/><path d="${gp}" fill="url(#${S.id("verband")})" opacity=".3"/>`;
  for (const [dx, hh] of [[-2.6, 3.4], [0, 5.6], [2.6, 3.4]]) mb += `<path d="M${M(dx - 0.55)} ${-M(mh + 0.6)} V${-M(mh + hh - 0.5)} L${M(dx)} ${-M(mh + hh)} L${M(dx + 0.55)} ${-M(mh + hh - 0.5)} V${-M(mh + 0.6)} Z" fill="#4a1d14"/>`;
  mb += `<path d="M0 ${-M(mh + gh)} V${-M(mh + gh + 1.6)}" stroke="#2a2420" stroke-width=".5"/><circle cx="0" cy="${-M(mh + gh + 1.7)}" r=".7" fill="${GOLD}"/>`;
  /* Fenster und Scharten des Mittelbaus */
  for (const dx of [-2.2, 2.2]) mb += `<rect x="${M(dx - 0.45)}" y="${-M(12.9)}" width="${M(0.9)}" height="${M(1.5)}" fill="#1c1310"/><rect x="${M(dx - 0.6)}" y="${-M(13.05)}" width="${M(1.2)}" height="${M(0.22)}" fill="${KALK}"/>`;
  for (const dx of [-2.8, 0, 2.8]) mb += `<rect x="${M(dx - 0.35)}" y="${-M(16.4)}" width="${M(0.7)}" height="${M(0.9)}" fill="#1c1310"/><rect x="${M(dx - 0.55)}" y="${-M(15.5)}" width="${M(1.1)}" height="${M(0.22)}" fill="#a9a59b"/>`;
  /* Inschriftband */
  mb += `<rect x="${-M(4.3)}" y="${-M(9.15)}" width="${M(8.6)}" height="${M(1.25)}" fill="#2a1a15"/><rect x="${-M(4.3)}" y="${-M(9.15)}" width="${M(8.6)}" height=".25" fill="#c9a640" opacity=".7"/><rect x="${-M(4.3)}" y="${-M(7.9) - 0.25}" width="${M(8.6)}" height=".25" fill="#c9a640" opacity=".7"/>`;
  mb += `<text x="0" y="${r(-M(8.2))}" font-size="2.3" text-anchor="middle" fill="${GOLD}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" textLength="${M(8.1)}" lengthAdjust="spacingAndGlyphs">CONCORDIA DOMI FORIS PAX</text>`;
  /* Durchfahrt: Rundbogen mit gestuftem Gewände, innen dunkel, hinten Licht der Stadtseite */
  const bw = 2.15, bh = 4.4;
  for (const [o, f] of [[0.6, "#7a3020"], [0.35, "#5e2419"], [0, "#120c0a"]]) mb += `<path d="M${-M(bw + o)} 0 V${-M(bh)} A${M(bw + o)} ${M(bw + o)} 0 0 1 ${M(bw + o)} ${-M(bh)} V0 Z" fill="${f}"/>`;
  mb += `<path d="M${-M(1.1)} 0 V${-M(bh - 0.6)} A${M(1.1)} ${M(1.1)} 0 0 1 ${M(1.1)} ${-M(bh - 0.6)} V0 Z" fill="${S.lg("stadtlicht", [[0, "#f3dcb0"], [1, "#b98a5c"]])}" opacity=".85"/>`;
  mb += `<path d="M${-M(0.5)} 0 L${-M(0.3)} ${-M(1.9)} L${M(0.3)} ${-M(1.9)} L${M(0.5)} 0 Z" fill="#4a3a30" opacity=".55"/>`;
  mb += `<path d="M${-M(bw + 0.6)} ${-M(bh)} A${M(bw + 0.6)} ${M(bw + 0.6)} 0 0 1 ${M(bw + 0.6)} ${-M(bh)}" stroke="${KALK}" stroke-width=".5" fill="none" opacity=".75"/>`;
  /* Schlagschatten des rechten (südlichen) Turms auf den Mittelbau */
  mb += `<path d="M${M(mw)} ${-M(mh + 2)} L${M(2.2)} ${-M(mh)} L${M(1.4)} 0 L${M(mw)} 0 Z" fill="#2a0f08" opacity=".32"/>`;
  k += mb;

  /* ---------- die beiden Rundtürme ---------- */
  const turm = (seite) => {
    const R = M(TURM.R), Hh = M(TURM.H), cx = seite * M(TURM.cx);
    let t = "";
    const ring = (h) => bogen(h, TURM.R);
    const band = (h0, h1, fill, op = 1) => `<path d="M${-R} ${-M(h1)} A${R} ${ring(h1)} 0 0 1 ${R} ${-M(h1)} V${-M(h0)} A${R} ${ring(h0)} 0 0 0 ${-R} ${-M(h0)} Z" fill="${fill}" opacity="${op}"/>`;
    /* Körper mit Ziegelverband, Granitsockel */
    t += `<path d="M${-R} 0 V${-Hh} A${R} ${ring(TURM.H)} 0 0 1 ${R} ${-Hh} V0 A${R} .4 0 0 1 ${-R} 0 Z" fill="${ZIEGEL}"/>`;
    t += `<path d="M${-R} 0 V${-Hh} A${R} ${ring(TURM.H)} 0 0 1 ${R} ${-Hh} V0 Z" fill="url(#${S.id("verband")})" opacity=".32"/>`;
    t += `<path d="M${-R} 0 V${-Hh} A${R} ${ring(TURM.H)} 0 0 1 ${R} ${-Hh} V0 Z" fill="url(#${S.id("brand")})"/>`;
    /* Wetterspuren: dunkle Fahnen unter den Scharten und am Fuß */
    t += `<path d="M${-R} 0 V${-M(3)} A${R} 1 0 0 1 ${R} ${-M(3)} V0 Z" fill="${S.lg("fuss", [[0, "#1a0805", 0], [1, "#1a0805", 0.35]])}"/>`;
    t += band(0, 1.1, S.lg("sockel", [[0, "#4b4740"], [0.7, "#8d877b"], [1, "#6a655c"]], 0, 0, 1, 0));
    /* Lagen aus schwarz glasierten Ziegeln */
    for (const h of [2.0, 3.6, 5.2, 9.0, 10.6, 12.2, 15.6, 17.2]) t += band(h, h + 0.42, GLASUR, 0.92);
    /* zwei Terrakottabänder aus quadratischen Platten (55 cm) mit Rosetten */
    for (const h of [6.6, 13.6]) {
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
    /* Schießscharten: drei je Geschoss (EG, 1. OG, 2. OG), oben kleine Fenster */
    const scharte = (a, h, w, hgt, sturz) => {
      const s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180);
      const x = R * s, y = -M(h) - ring(h) * c, ww = M(w) * c;
      let g = `<rect x="${r(x - ww / 2)}" y="${r(y - M(hgt))}" width="${r(ww)}" height="${M(hgt)}" rx=".2" fill="#120b09"/>`;
      if (sturz === "kalk") g += `<rect x="${r(x - ww / 2 - 0.5 * c)}" y="${r(y - M(hgt) - 0.9)}" width="${r(ww + c)}" height=".9" fill="${KALK}"/>`;
      if (sturz === "granit") g += `<rect x="${r(x - ww / 2 - 0.4 * c)}" y="${r(y)}" width="${r(ww + 0.8 * c)}" height=".8" fill="#a9a59b"/>`;
      return g;
    };
    for (const a of [-52, 0, 52]) {
      t += scharte(a, 2.6, 0.95, 1.1, "kalk");
      t += scharte(a, 8.0, 0.95, 1.05, "kalk");
      t += scharte(a, 14.9, 0.8, 0.7, "granit");
    }
    for (const a of [-34, 30]) t += scharte(a, 18.2, 0.55, 1.0, "");
    /* Traufgesims und Schattenkante unter dem Dach */
    t += band(TURM.H - 0.5, TURM.H, "#d9c9a8", 0.9);
    /* Rundung: Schatten links, Licht rechts (über allem) */
    t += `<path d="M${-R} 0 V${-Hh} A${R} ${ring(TURM.H)} 0 0 1 ${R} ${-Hh} V0 Z" fill="${S.lg("rund", [[0, "#1a0805", 0.55], [0.3, "#1a0805", 0.12], [0.62, "#fff", 0], [0.85, "#ffd49a", 0.16], [1, "#1a0805", 0.12]], 0, 0, 1, 0)}"/>`;
    /* Kegeldach aus Schiefer */
    const Rk = M(TURM.Rk), kh = M(TURM.kegel), rk = bogen(TURM.H, TURM.Rk);
    t += `<path d="M${-Rk} ${r(-Hh + 0.6)} A${Rk} ${rk} 0 0 1 ${Rk} ${r(-Hh + 0.6)} L0 ${r(-Hh - kh)} Z" fill="${SCHIEFER}"/>`;
    for (let j = 1; j < 9; j++) {
      const f = j / 9, w = Rk * (1 - f);
      t += `<path d="M${r(-w)} ${r(-Hh + 0.6 - kh * f)} A${r(w)} ${r(rk * (1 - f))} 0 0 1 ${r(w)} ${r(-Hh + 0.6 - kh * f)}" stroke="#1a2026" stroke-width=".25" fill="none" opacity=".6"/>`;
    }
    t += `<path d="M${r(Rk * 0.35)} ${r(-Hh + 0.6 - rk * 0.9)} L0 ${r(-Hh - kh)}" stroke="#9fb0bf" stroke-width=".6" opacity=".45"/>`;
    t += `<path d="M${-Rk} ${r(-Hh + 0.6)} A${Rk} ${rk} 0 0 1 ${Rk} ${r(-Hh + 0.6)}" stroke="#141a1f" stroke-width=".9" fill="none"/>`;
    /* Knauf und Wetterfahne */
    t += `<path d="M0 ${r(-Hh - kh)} V${r(-Hh - kh - 6)}" stroke="#2a2420" stroke-width=".45"/><circle cx="0" cy="${r(-Hh - kh - 1.4)}" r=".9" fill="${GOLD}"/>`;
    t += `<path d="M0 ${r(-Hh - kh - 5.6)} L${seite * 3} ${r(-Hh - kh - 5)} L${seite * 3} ${r(-Hh - kh - 3.8)} L0 ${r(-Hh - kh - 4.2)} Z" fill="${GOLD}"/>`;
    /* der Südturm (rechts) ist im weichen Boden abgesackt und neigt sich */
    return `<g transform="translate(${cx} 0)${seite > 0 ? " rotate(.8 0 0)" : ""}">${t}</g>`;
  };
  k += turm(-1) + turm(1);
  /* ein paar Leute vor der Durchfahrt (Maßstab) */
  k += passant(M(-1.2), 0, M(1.75), { hemd: "#c9b28a", rueck: true }) + passant(M(0.9), 0, M(1.68), { hemd: "#3d5a80", hose: "#4a4a52", rueck: true, schritt: 0.15 });
  const torSvg = `<g filter="url(#${S.id("licht")})">${k}</g>`;
  const TL = GX - M(TURM.cx), TR = GX + M(TURM.cx);
  TOR_UNTER = [
    { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: TL, y: GY, kunst: flaeche(-M(TURM.R), -M(TURM.H), M(2 * TURM.R), M(TURM.H), 1),
      tipp: "Das Holstentor hat zwei runde Türme. Auf der Feldseite stehen sie weit vor." },
    { id: "kegeldach", de: "das Kegeldach", syl: "KE-gel-dach", it: "il tetto conico", itSyl: "TET-to CO-ni-co", en: "conical roof", x: TR, y: GY - M(TURM.H), kunst: `<path class="bw-flaeche" d="M${-M(TURM.Rk)} 2 L0 ${-M(TURM.kegel) - 6} L${M(TURM.Rk)} 2 Z" fill="rgba(255,255,255,0.001)"/>`,
      tipp: "Die Dächer der Türme sehen aus wie spitze Kegel. Sie sind mit Schiefer gedeckt." },
    { id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: GX, y: GY - M(8.5), kunst: flaeche(-M(4.4), -M(0.9), M(8.8), M(1.8), 0.4),
      tipp: "„Concordia domi foris pax“ ist Latein. Es heißt: Drinnen Eintracht, draußen Frieden." },
    { id: "durchfahrt", de: "die Durchfahrt", syl: "DURCH-fahrt", it: "il passaggio", itSyl: "pas-SAG-gio", en: "gateway", x: GX, y: GY, kunst: flaeche(-M(2.6), -M(6.5), M(5.2), M(6.5), 1),
      tipp: "Durch das Tor kommt man über die Holstenbrücke in die Altstadt." },
    { id: "schiessscharte", de: "die Schießscharte", syl: "SCHIESS-schar-te", it: "la feritoia", itSyl: "fe-ri-TO-ia", en: "loophole", x: TL, y: GY - M(8), kunst: flaeche(-M(1), -M(1.7), M(2), M(2.3), 0.4),
      tipp: "Aus den Schießscharten konnten die Soldaten mit Kanonen schießen. Oben stehen heute noch alte Kanonen." },
    { id: "fries", de: "der Fries", syl: "FRIES", it: "il fregio", itSyl: "FRE-gio", en: "frieze", x: TL - M(3.4), y: GY - M(13.6), kunst: flaeche(-M(1.9), -M(1.2), M(3.8), M(1.6), 0.4),
      tipp: "Der Fries ist ein Band aus Platten aus gebranntem Ton. Er läuft rund um die Türme." },
    { id: "backstein", de: "der Backstein", syl: "BACK-stein", it: "il mattone", itSyl: "mat-TO-ne", en: "brick", x: TR + M(3.2), y: GY - M(4.3), kunst: flaeche(-M(1.5), -M(1.5), M(3), M(2.6), 0.4),
      tipp: "Das Tor ist aus rotem Backstein. Manche Steine sind schwarz glasiert. So sieht man es oft in Norddeutschland." },
  ];
  S.teil({ id: "holstentor", de: "das Holstentor", syl: "HOL-sten-tor", it: "la Porta di Holsten", itSyl: "POR-ta di HOL-sten", en: "Holsten Gate",
    x: GX, y: GY, kunst: torSvg, tipp: "Das Holstentor wurde 1478 fertig. Früher schützte es die reiche Hansestadt, heute ist darin ein Museum.",
    zoom: { x: 102, y: 22, w: 246, h: 164 }, unter: TOR_UNTER });
}

/* =====================================================================
   6 — DIE REISEGRUPPE vor dem Tor (mit Stadtführerin und Schirm)
   ===================================================================== */
{
  const d = 46, K = F / d, y = r(HOR + AUGE * K);
  let k = "";
  const leute = [[-4.2, "#b8473a", "#2f3640"], [-3.5, "#e8e4dc", "#3d5f8c"], [-2.7, "#2f5f95", "#2f3640"], [-2.0, "#d8ad3a", "#4a4a52"], [-1.2, "#3f7d5a", "#2f3640"], [-0.6, "#e6889f", "#3d5f8c"]];
  for (const [lat, hemd, hose] of leute) { const x = r(200 + lat * K); k += passant(x, y, r(1.72 * K), { hemd, hose, rueck: true, haar: lat < -3 ? "#c9a466" : "#4a3426" }); schlag(lat, d, 1.72, 0.5, 0.3); }
  /* die Stadtführerin (von vorn) mit rotem Schirm */
  const gx = r(200 - 5.4 * K);
  k += passant(gx, r(y - 0.6), r(1.68 * K), { hemd: "#7a2a40", hose: "#2f3640", rueck: false, haar: "#93704f" });
  k += `<path d="M${r(gx + 0.15 * 1.68 * K)} ${r(y - 0.6 - 0.5 * 1.68 * K)} V${r(y - 0.6 - 1.25 * 1.68 * K)}" stroke="#2a2a2a" stroke-width=".25"/><path d="M${r(gx + 0.15 * 1.68 * K - 3)} ${r(y - 0.6 - 1.22 * 1.68 * K)} Q${r(gx + 0.15 * 1.68 * K)} ${r(y - 0.6 - 1.42 * 1.68 * K)} ${r(gx + 0.15 * 1.68 * K + 3)} ${r(y - 0.6 - 1.22 * 1.68 * K)} Z" fill="#c8302a"/>`;
  schlag(-5.4, d - 0.1, 1.68, 0.5, 0.3);
  S.teil({ id: "reisegruppe", de: "die Reisegruppe", syl: "REI-se-grup-pe", it: "il gruppo di turisti", itSyl: "GRUP-po di tu-RI-sti", en: "tour group", x: 0, y: 0, kunst: k,
    tipp: "Die Stadtführerin hält einen roten Schirm hoch. So findet die Gruppe sie immer." });
}

/* =====================================================================
   7 — DER TOURIST (fotografiert das Tor) und 8 — DIE TOURISTIN
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
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: licht(m.svg) + ph,
    tipp: "Der Tourist macht ein Foto vom Holstentor. Das Tor war früher auf dem 50-Mark-Schein." });
}
{
  const d = 25, lat = 3.0, [x, y] = proj(lat, d), s = km(y);
  const m = figur({ id: "lbk_tourin", geschlecht: "w", pose: "zeigen", blick: 205, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e9dfcf" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#b0523c" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#2f5a35" } } }, 1.66 * s);
  schlag(lat, d, 1.66, 0.5);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: licht(m.svg),
    tipp: "Die Touristin zeigt auf die Inschrift über dem Tor." });
}

/* =====================================================================
   9 — DIE LATERNE mit der MÖWE, 10 — DAS FAHRRAD (lehnt daran)
   ===================================================================== */
const LAT = { lat: 4.6, d: 15.5 };
const [LX, LY] = proj(LAT.lat, LAT.d), LK = km(LY);
{
  const H = 4.0 * LK;
  let k = "";
  k += `<path d="M${r(-0.13 * LK)} 0 L${r(-0.09 * LK)} ${r(-0.5 * LK)} L${r(-0.05 * LK)} ${r(-H + 0.6 * LK)} L${r(0.05 * LK)} ${r(-H + 0.6 * LK)} L${r(0.09 * LK)} ${r(-0.5 * LK)} L${r(0.13 * LK)} 0 Z" fill="${S.lg("mast", [[0, "#11181a"], [0.6, "#3c4a4d"], [1, "#1c2426"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.11 * LK)}" y="${r(-0.62 * LK)}" width="${r(0.22 * LK)}" height="${r(0.1 * LK)}" fill="#3c4a4d"/>`;
  /* Laternenkopf: Sechseck-Laterne mit Glas, Dach und Spitze */
  const t = -H + 0.6 * LK, lw = 0.2 * LK;
  k += `<path d="M${r(-lw * 0.6)} ${r(t)} L${r(-lw)} ${r(t - 0.5 * LK)} L${r(lw)} ${r(t - 0.5 * LK)} L${r(lw * 0.6)} ${r(t)} Z" fill="${S.lg("glaslat", [[0, "#fff6d8"], [1, "#e8c98a"]])}" stroke="#1c2426" stroke-width=".5"/>`;
  k += `<path d="M0 ${r(t)} V${r(t - 0.5 * LK)}" stroke="#1c2426" stroke-width=".4"/>`;
  k += `<path d="M${r(-lw - 0.6)} ${r(t - 0.5 * LK)} L0 ${r(t - 0.72 * LK)} L${r(lw + 0.6)} ${r(t - 0.5 * LK)} Z" fill="#1c2426"/><circle cx="0" cy="${r(t - 0.76 * LK)}" r=".8" fill="#1c2426"/>`;
  schlag(LAT.lat, LAT.d, 4.0, 0.2, 0.35);
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: LX, y: LY, kunst: licht(k) });
  S.LAT_TOP = LY + t - 0.76 * LK;
}
{
  /* DAS FAHRRAD lehnt rechts an der Laterne (Hollandrad, rot) */
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
  /* Korb vorn mit einer roten Marzipan-Tüte */
  k += `<path d="M${r(x1 - 0.1 * s)} ${r(-1.02 * s)} L${r(x1 + 0.22 * s)} ${r(-1.02 * s)} L${r(x1 + 0.19 * s)} ${r(-0.84 * s)} L${r(x1 - 0.07 * s)} ${r(-0.84 * s)} Z" fill="#7a5a36" stroke="#4a361e" stroke-width=".2"/>`;
  k += `<path d="M${r(x1 - 0.06 * s)} ${r(-0.84 * s)} V${r(-0.3 * s)} M${r(x1 + 0.18 * s)} ${r(-0.84 * s)} L${r(x1)} ${r(-R)}" stroke="#2a2a2c" stroke-width=".3"/>`;
  k += `<rect x="${r(-0.04 * s)}" y="${r(-0.98 * s)}" width="${r(0.12 * s)}" height="${r(0.05 * s)}" fill="#2a2a2c" transform="rotate(-8 0 ${r(-0.98 * s)})"/>`;
  schlag(LAT.lat + 0.4, LAT.d + 0.2, 1.0, 1.2, 0.35);
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: r(LX + 0.06 * LK), y: r(LY + 0.4), kunst: licht(k) });
}
{
  /* DIE MÖWE (Silbermöwe) sitzt oben auf der Laterne; eine zweite fliegt am Himmel */
  const s = LK * 0.16;
  let k = `<path d="M${r(-1.6 * s)} ${r(-0.9 * s)} Q${r(-0.4 * s)} ${r(-1.6 * s)} ${r(1.2 * s)} ${r(-1.1 * s)} L${r(1.9 * s)} ${r(-1.0 * s)} L${r(1.2 * s)} ${r(-0.75 * s)} Q${r(0.2 * s)} ${r(-0.1 * s)} ${r(-1.0 * s)} ${r(-0.5 * s)} Z" fill="#f5f4ef"/>`;
  k += `<path d="M${r(-1.9 * s)} ${r(-0.75 * s)} Q${r(-0.6 * s)} ${r(-1.15 * s)} ${r(0.7 * s)} ${r(-0.92 * s)} L${r(0.4 * s)} ${r(-0.68 * s)} Q${r(-0.6 * s)} ${r(-0.6 * s)} ${r(-1.9 * s)} ${r(-0.75 * s)} Z" fill="#9aa3ab"/>`;
  k += `<path d="M${r(-2.1 * s)} ${r(-0.72 * s)} L${r(-1.6 * s)} ${r(-0.82 * s)} L${r(-1.4 * s)} ${r(-0.6 * s)} Z" fill="#1d1d1f"/>`;
  k += `<circle cx="${r(1.05 * s)}" cy="${r(-1.48 * s)}" r="${r(0.42 * s)}" fill="#f8f7f2"/><circle cx="${r(1.18 * s)}" cy="${r(-1.56 * s)}" r="${r(0.07 * s)}" fill="#1d1d1f"/>`;
  k += `<path d="M${r(1.4 * s)} ${r(-1.5 * s)} L${r(1.95 * s)} ${r(-1.42 * s)} L${r(1.4 * s)} ${r(-1.34 * s)} Z" fill="#e8b830"/><circle cx="${r(1.78 * s)}" cy="${r(-1.4 * s)}" r=".12" fill="#c8302a"/>`;
  k += `<path d="M${r(-0.1 * s)} ${r(-0.35 * s)} V0 M${r(0.4 * s)} ${r(-0.35 * s)} V0" stroke="#e6a77a" stroke-width=".3"/>`;
  /* fliegende Möwe über dem Tor (im selben Teil) */
  const fl = `<g transform="translate(${r(332 - LX)} ${r(70 - S.LAT_TOP)})"><path d="M-6 -1 Q-3 -3.4 0 0 Q3 -3.4 6 -1.6 Q3 -2 0 1 Q-3 -1.8 -6 -1 Z" fill="#f8f7f2"/><path d="M-6 -1 Q-5.2 -1.6 -4.6 -1.4 M6 -1.6 Q5.2 -2 4.6 -1.8" stroke="#2a2a2c" stroke-width=".5"/><ellipse cx="0" cy=".2" rx="1.1" ry=".55" fill="#f8f7f2"/><path d="M1 0 L1.8 .2 L1 .4 Z" fill="#e8b830"/></g>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: LX, y: r(S.LAT_TOP), kunst: licht(k) + fl,
    tipp: "Lübeck liegt nah an der Ostsee. Darum fliegen hier viele Möwen." });
}

/* =====================================================================
   11 — DAS BLUMENBEET in den Farben der Stadt (Weiß und Rot), rechts vorn
   ===================================================================== */
{
  const d0 = 10, d1 = 12.5, la = 3.4, lb = 4.95;
  const [p1x, p1y] = proj(la, d1), [p2x, p2y] = proj(lb, d1), [p3x, p3y] = proj(lb, d0), [p4x, p4y] = proj(la, d0);
  let k = `<path d="M${p1x} ${p1y} L${p2x} ${p2y} L${p3x} ${p3y} L${p4x} ${p4y} Z" fill="#5a3f2c"/>`;
  k += `<path d="M${p4x} ${p4y} L${p3x} ${p3y} L${p3x} ${r(p3y + 2)} L${p4x} ${r(p4y + 2)} Z" fill="#d6cdbb"/>`;
  const bl = [];
  for (let i = 0; i < 90; i++) { const t = rnd(), u = rnd(); const d = d1 - t * (d1 - d0), lat = la + 0.15 + u * (lb - la - 0.3); bl.push([lat, d]); }
  bl.sort((a, b) => b[1] - a[1]);
  for (const [lat, d] of bl) {
    const [x, y] = proj(lat, d), s = km(y) * 0.11;
    const weiss = Math.floor(lat * 1.4) % 2 === 0;
    k += `<circle cx="${x}" cy="${r(y - s * 0.8)}" r="${r(s * 0.9)}" fill="#3f6a2a"/><circle cx="${r(x + s * 0.2)}" cy="${r(y - s * 1.3)}" r="${r(s * 0.55)}" fill="${weiss ? "#f6f3ec" : "#c8282e"}"/><circle cx="${r(x + s * 0.32)}" cy="${r(y - s * 1.45)}" r="${r(s * 0.18)}" fill="${weiss ? "#fff" : "#e8545a"}"/>`;
  }
  S.teil({ id: "blumenbeet", de: "das Blumenbeet", syl: "BLU-men-beet", it: "l'aiuola", itSyl: "a-iu-O-la", en: "flower bed", x: 0, y: 0, kunst: k,
    tipp: "Die Blumen sind weiß und rot. Das sind die Farben von Lübeck." });
}

/* =====================================================================
   12 — DIE BANK, 13 — DIE FRAU (sitzt), 14 — DIE TÜTE (Marzipan),
   15 — DAS KIND mit 16 — DEM MARZIPAN
   ===================================================================== */
const BANK = { d: 12.2, lat0: -6.2, lat1: -4.3 };
const [BX0, BY] = proj(BANK.lat0, BANK.d), [BX1] = proj(BANK.lat1, BANK.d), BK = km(BY), BXM = r((BX0 + BX1) / 2);
{
  const w = BX1 - BX0, s = BK;
  let k = "";
  const HOLZ = S.lg("bankholz", [[0, "#a86a3c"], [1, "#7a4a26"]]);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (w / 2 - 0.12 * s))} 0 L${r(sx * (w / 2 - 0.12 * s))} ${r(-0.45 * s)} L${r(sx * (w / 2 - 0.08 * s))} ${r(-0.88 * s)} L${r(sx * (w / 2 - 0.15 * s))} ${r(-0.88 * s)} L${r(sx * (w / 2 - 0.2 * s))} ${r(-0.45 * s)} L${r(sx * (w / 2 - 0.26 * s))} 0 Z" fill="#23282b"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-w / 2)}" y="${r(-0.46 * s - i * 0.035 * s)}" width="${r(w)}" height="${r(0.03 * s)}" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-w / 2 + 0.03 * s)}" y="${r(-0.86 * s + i * 0.09 * s)}" width="${r(w - 0.06 * s)}" height="${r(0.065 * s)}" rx=".4" fill="${HOLZ}"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-0.46 * s)}" width="${r(w)}" height=".5" fill="#e3b78a" opacity=".6"/>`;
  schlag(BANK.lat0 + 1, BANK.d + 0.3, 0.9, 1.9, 0.38);
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: BXM, y: BY, steht: true, kunst: licht(k) });
}
{
  /* DIE FRAU sitzt links auf der Bank (die rechte Banhälfte bleibt frei) */
  const m = figur({ id: "lbk_frau", geschlecht: "w", pose: "sitzen", blick: 24, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f3efe6" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f5f95" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.66 * BK);
  const sitzY = m.z.sitz.y * m.k;
  const x = r(BXM - 0.35 * BK);
  S.teil({ id: "frau", de: "die Frau", syl: "FRAU", it: "la donna", itSyl: "DON-na", en: "woman", x, y: BY, kunst: licht(`<g transform="translate(0 ${r(-0.46 * BK - sitzY)})">${m.svg}</g>`),
    tipp: "Die Frau macht eine Pause auf der Bank. Sie hat Marzipan gekauft." });
}
{
  /* DIE TÜTE (rote Marzipan-Tüte mit goldener Schrift) steht rechts auf der Bank */
  const s = BK;
  let k = `<path d="M${r(-0.13 * s)} 0 L${r(0.13 * s)} 0 L${r(0.12 * s)} ${r(-0.3 * s)} L${r(-0.12 * s)} ${r(-0.3 * s)} Z" fill="${S.lg("tuete", [[0, "#9e1a20"], [0.6, "#c8282e"], [1, "#a01c22"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-0.12 * s)} ${r(-0.3 * s)} L${r(0.12 * s)} ${r(-0.3 * s)} L${r(0.1 * s)} ${r(-0.33 * s)} L${r(-0.1 * s)} ${r(-0.33 * s)} Z" fill="#7a1418"/>`;
  k += `<path d="M${r(-0.06 * s)} ${r(-0.3 * s)} Q0 ${r(-0.44 * s)} ${r(0.06 * s)} ${r(-0.3 * s)}" stroke="#c9a640" stroke-width=".5" fill="none"/>`;
  k += `<text x="0" y="${r(-0.16 * s)}" font-size="${r(0.045 * s)}" text-anchor="middle" fill="#f0c64a" font-family="Georgia,serif" font-style="italic" font-weight="bold">Marzipan</text>`;
  k += `<text x="0" y="${r(-0.105 * s)}" font-size="${r(0.03 * s)}" text-anchor="middle" fill="#f0c64a" font-family="Georgia,serif">LÜBECK</text>`;
  k += `<rect x="${r(-0.13 * s)}" y="${r(-0.3 * s)}" width="${r(0.06 * s)}" height="${r(0.3 * s)}" fill="#000" opacity=".15"/>`;
  S.teil({ oben: true, id: "tuete", de: "die Tüte", syl: "TÜ-te", it: "il sacchetto", itSyl: "sac-CHET-to", en: "bag", x: r(BXM + 0.55 * BK), y: r(BY - 0.46 * BK), steht: true, kunst: licht(k) });
}
const KIND = { lat: -2.9, d: 13.4 };
const [KX, KY] = proj(KIND.lat, KIND.d), KK = km(KY);
let MARZ = null;
{
  const m = figur({ id: "lbk_kind", alter: "kind", geschlecht: "w", pose: "halten", blick: -40, frisur: "zopf", haarfarbe: "hellblond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#f2c230" }, unterteil: { stueck: "rock_knie", farbe: "#2f5f95" }, schuhe: { stueck: "turnschuh" } } }, 1.25 * KK);
  const hd = [m.z.handL, m.z.handR].sort((a, b) => a.x - b.x);
  MARZ = { x: r(KX + (hd[0].x + hd[1].x) / 2 * m.k), y: r(KY + Math.min(hd[0].y, hd[1].y) * m.k) };
  schlag(KIND.lat, KIND.d, 1.25, 0.4);
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "la bambina", itSyl: "bam-BI-na", en: "child", x: KX, y: KY, kunst: licht(m.svg),
    tipp: "Das Kind zeigt seiner Mutter das Marzipan." });
}
{
  /* DAS MARZIPAN: ein Marzipanbrot in Schokolade, angebrochen, in den Händen des Kindes */
  const s = KK * 1.35;
  let k = `<rect x="${r(-0.08 * s)}" y="${r(-0.05 * s)}" width="${r(0.16 * s)}" height="${r(0.05 * s)}" rx="${r(0.02 * s)}" fill="${S.lg("schoko", [[0, "#5a3420"], [1, "#2e180c"]])}"/>`;
  k += `<rect x="${r(0.04 * s)}" y="${r(-0.05 * s)}" width="${r(0.045 * s)}" height="${r(0.05 * s)}" fill="#f1dcae"/>`;
  k += `<path d="M${r(-0.08 * s)} ${r(-0.03 * s)} h${r(0.1 * s)}" stroke="#7a4a2a" stroke-width=".25"/>`;
  k += `<rect x="${r(-0.09 * s)}" y="${r(-0.052 * s)}" width="${r(0.06 * s)}" height="${r(0.056 * s)}" fill="#c8282e"/><rect x="${r(-0.09 * s)}" y="${r(-0.03 * s)}" width="${r(0.06 * s)}" height=".3" fill="#f0c64a"/>`;
  S.teil({ oben: true, id: "marzipan", de: "das Marzipan", syl: "mar-zi-PAN", it: "il marzapane", itSyl: "mar-za-PA-ne", en: "marzipan", x: MARZ.x, y: r(MARZ.y + 0.3), kunst: k,
    tipp: "Lübecker Marzipan ist berühmt. Man macht es aus Mandeln und Zucker." });
}

/* Schlagschatten auf Rasen und Weg (geklippt, damit nichts über die Ränder wächst) */
const SCH = SCHATTEN.join("");
RASEN_TEIL.kunst += `<g clip-path="url(#${S.id("rasenclip")})">${SCH}</g>`;
WEG_TEIL.kunst += `<g clip-path="url(#${S.id("wegclip")})">${SCH}</g>`;

/* warmes Nachmittagslicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="${W}" height="${HH}" fill="${S.rg("abend", [[0, "#ffd9a0", 0.12], [0.6, "#ffd9a0", 0], [1, "#000", 0.08]], 0.95, 0.55, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/luebeck.js"));
console.log(aus);
