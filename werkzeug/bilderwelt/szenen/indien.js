#!/usr/bin/env node
/* =====================================================================
   INDIEN – DER TAJ MAHAL (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Archnet „Taj Mahal Complex“, Bluffton Univ. „Taj Mahal
   complex“, Univ. Notre Dame „Great Gate – raking view“, PBS „The Story
   of India – Taj Mahal“, structurae; Maße aus mehreren Quellen, kleine
   Abweichungen sind dort üblich — UNSICHER markiert):
   - STANDORT: Agra, kurz nach Sonnenaufgang. Wir stehen auf der Terrasse
     des HAUPTTORS (Darwaza-i Rauza, roter Sandstein mit weißem Marmor,
     rund 30 m hoch, oben 2 × 11 Kuppelpavillons; um seine Bögen läuft die
     Inschrift „O Seele, die du in Frieden bist, kehre zurück zu deinem
     Herrn …“). Das Tor liegt in unserem Rücken — hier steht jeder
     Besucher zuerst: der berühmteste Blick, genau nach NORDEN.
   - DER GARTEN (Charbagh, rund 300 × 300 m): vier Viertel, getrennt von
     Wasserkanälen und erhöhten Wegen aus rotem Sandstein; an den Wegen
     tiefer liegende Beete (Studentenblumen, Rosen) mit niedrigen Hecken,
     dahinter Zypressen (Sinnbild der Ewigkeit), in den Vierteln Rasen und
     große Schattenbäume. In der Mitte das erhöhte Marmorbecken
     (al-Hawd al-Kawthar) mit Lotus-Düsen und der Marmorbank. Morgens
     sind die Springbrunnen im Kanal aus — im stillen Wasser spiegelt sich
     der Taj.
   - DAS MAUSOLEUM (1632–1653, Shah Jahan als Grabmal für Mumtaz Mahal):
     weißer Makrana-Marmor auf einem rund 6–7 m hohen, 95,5 m breiten
     Sockel (davor die rote Sandsteinterrasse). Der Bau ist 55 m breit,
     quadratisch mit abgeschrägten Ecken; jede Seite hat ein 33 m hohes
     Portal (Pishtaq) mit spitzem Bogen, rechts und links je zwei
     übereinanderliegende Bogennischen. Die ZWIEBELKUPPEL lädt weit über
     den Tambour aus (größte Breite etwa ein Drittel über ihrem Fuß) und
     zieht unten sichtbar wieder ein; oben eine Kappe aus umgekehrten
     Lotusblättern, darauf die Bekrönung (Kalasch-Vase, Kugeln, Halbmond),
     insgesamt rund 73 m. Um die Kuppel vier kleine Kuppelpavillons
     (Chattris). Um die Portale laufen Schriftbänder: SCHWARZE Buchstaben
     (schwarzer Marmor/Jaspis) eingelegt in WEISSEN Marmor, nach oben
     größer, damit sie von unten gleich groß wirken. In den Zwickeln
     Pietra-dura-Blumen aus Halbedelsteinen.
   - VIER MINARETTE an den Ecken des Sockels, je gut 40 m, durch zwei
     Balkone in drei Teile geteilt, oben ein offener Pavillon; schwarze
     Einlagelinien im weißen Marmor (vor allem senkrecht).
   - LINKS (Westen) die MOSCHEE, rechts (Osten) ihr Spiegelbild, das
     Gästehaus (Jawab, „Antwort“) — roter Sandstein, weiße Marmorbänder,
     weiße Kuppeln, achteckige Ecktürme mit offenen Pavillons. Von Süden
     sieht man ihre Schmalseite; die Kuppeln stehen hintereinander, der
     große Bogen liegt auf der Langseite zum Taj. (Leicht zur Mitte
     gerückt, damit beide ganz ins Bild passen.)
   - TYPISCHES: Im Gelände sind Essen und Fahrzeuge verboten — Indien
     sieht man an den Menschen und Tieren: Eine Besucherin im Sari (4–8 m
     Stoff, das Ende „Pallu“ über der linken Schulter) posiert mit dem
     Rücken zum Taj, ein Fotograf (in Agra ein eigener Beruf) macht ihr
     Bild. Der Pfau (Nationalvogel) lebt in den Gärten, dazu Palmenhörnchen
     und Halsbandsittiche.
   Maßstab: Augenhöhe 3,1 m über dem Garten (Torterrasse 1,5 m hoch),
   Horizont y = 133, Brennweite 570: Punkt in d Metern, h Metern Höhe und
   s Metern seitlich: y = 133 + (3,1 − h)·570/d, x = 200 + s·570/d.
   Der Taj steht 300–395 m weit (1,9–1,45 Einheiten je Meter).
   Licht: Morgensonne von rechts (Osten), Sonnenhöhe etwa 24°: Ostseiten
   rosé-golden, Westseiten kühl lila, lange Schatten nach links (Westen).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "indien", titel: "Indien – der Taj Mahal", emoji: "🕌", thema: "Länder", kuerzel: "ind", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1653);
const r = B.r;
const HOR = 133, E = 3.1, F = 570, CX = 200;
const yAt = (d, h = 0) => HOR + (E - h) * F / d;
const uAt = (d) => F / d;
const xAt = (s, d) => CX + s * F / d;
const P0 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";
/* Vielecke am Bildrand abschneiden (0 ≤ x ≤ 400, y ≤ 260), damit kein Teil aus dem Bild ragt */
const kappe = (poly, innen, kreuz) => { const out = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]; if (innen(a)) { out.push(a); if (!innen(b)) out.push(kreuz(a, b)); } else if (innen(b)) out.push(kreuz(a, b)); }); return out; };
const P = (pts) => {
  let q = kappe(pts, (a) => a[0] >= 0, (a, b) => [0, a[1] + (b[1] - a[1]) * (0 - a[0]) / (b[0] - a[0])]);
  q = kappe(q, (a) => a[0] <= 400, (a, b) => [400, a[1] + (b[1] - a[1]) * (400 - a[0]) / (b[0] - a[0])]);
  q = kappe(q, (a) => a[1] <= 260, (a, b) => [a[0] + (b[0] - a[0]) * (260 - a[1]) / (b[1] - a[1]), 260]);
  return q.length ? P0(q) : "";
};
/* langer, spitz zulaufender Schatten am Boden: von (s, d) nach Westen, etwas nach Norden (Sonne aus Ostsüdost, etwa 32°) */
const schattenLang = (s, d, hoehe, breite, form = "zypresse") => {
  const L = 1.6 * hoehe, oben = [], unten = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8, st = s - L * t, dt = d + 0.3 * L * t;
    const hw = breite / 2 * (form === "zypresse" ? Math.sin(Math.PI * Math.pow(1 - t, 0.85) * 0.5) : t < 0.78 ? 1 - 0.25 * t : 0.8 * (1 - t) / 0.22);
    oben.push([xAt(st, dt + hw), yAt(dt + hw)]); unten.push([xAt(st, Math.max(1, dt - hw)), yAt(Math.max(1, dt - hw))]);
  }
  return P([...oben, ...unten.reverse()]);
};
/* glatte Kurve (Catmull-Rom) durch Punkte */
const glatt = (pts, zu = true) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
/* Zwiebelprofil (Radius relativ zum Tambour, Höhe relativ zur Kuppelhöhe): größte Breite 1,3 × auf etwa 1/3 */
/* Fuß etwa 0,78 × der größten Breite (Einzug zum Tambour), Wendepunkt bei etwa 3/4: oben konkav in den Hals */
const ZWIEBEL = [[1.0, 0], [1.03, 0.03], [1.12, 0.08], [1.24, 0.16], [1.3, 0.25], [1.29, 0.34], [1.19, 0.46], [1.0, 0.56], [0.76, 0.64], [0.54, 0.7], [0.4, 0.745], [0.31, 0.79], [0.24, 0.84], [0.16, 0.9], [0.1, 0.95], [0.06, 0.985], [0, 1]];
/* Umriss einer Zwiebelkuppel: Mitte x, Fuß y, Tambour-Halbbreite rb, Höhe hh (alles in Einheiten) */
const zwiebel = (x, y, rb, hh) => {
  const links = ZWIEBEL.map(([q, t]) => [x - q * rb, y - t * hh]), rechts = ZWIEBEL.slice(0, -1).reverse().map(([q, t]) => [x + q * rb, y - t * hh]);
  return glatt([...links, ...rechts]);
};
/* Spiegelachse: Wasser 0,3 m unter den Wegen; für den Taj (u ≈ 1,78): y' = 2·133 + (2·3,1 + 0,6)·1,78 − y */
const SPIEGEL = r(2 * HOR + (2 * E + 0.6) * 1.78);
/* Figuren aus B.mensch für die Ferne vereinfachen (Ladezeit!): feine Linien entfallen;
   Stufe 2 (winzig) ersetzt Verläufe durch ihre mittlere Farbe und rundet auf ganze Zentimeter */
const vereinfache = (svg, stufe) => {
  const grenze = stufe >= 2 ? 1.2 : stufe > 1 ? 0.5 : 0.25;
  svg = svg.replace(/<(path|ellipse|line)\b[^>]*?\/>/g, (el) => { const sw = el.match(/stroke-width="([\d.]+)"/); return /fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze ? "" : el; });
  /* Stufe 1,5: Zahlen auf eine Stelle runden, aber nie in transform="…" */
  if (stufe > 1 && stufe < 2) { const f = stufe >= 1.8 ? 2 : 10; svg = svg.split(/(transform="[^"]*")/).map((t, i) => i % 2 ? t : t.replace(/(-?\d+\.\d+)/g, (m) => String(Math.round(parseFloat(m) * f) / f))).join(""); }
  if (stufe >= 2) {
    const farbe = {};
    svg.replace(/<(linearGradient|radialGradient) id="([^"]+)"[^>]*>(.*?)<\/\1>/g, (_, t, id, inn) => { const st = [...inn.matchAll(/stop-color="([^"]+)"/g)].map((m) => m[1]); farbe[id] = st[Math.floor(st.length / 2)] || "#888"; return ""; });
    svg = svg.replace(/<defs>.*?<\/defs>/g, "").replace(/ clip-path="url\(#[^)]+\)"/g, "").replace(/url\(#([^)]+)\)/g, (_, id) => farbe[id] || "#888");
    const gitter = stufe >= 3 ? 4 : 1;
    svg = svg.replace(/ (d|cx|cy|r|rx|ry|x|y|x1|y1|x2|y2|width|height|stroke-width)="([^"]*)"/g, (_, n, v) => ` ${n}="${v.replace(/-?\d+(?:\.\d+)?/g, (m) => String(Math.round(parseFloat(m) / gitter) * gitter))}"`);
    if (stufe >= 3) svg = svg.replace(/<ellipse[^>]*\/>/g, "").replace(/<path d="([^"]*)"[^>]*\/>/g, (el, d) => d.length < 70 ? "" : el).replace(/ stroke-width="0"| stroke-linejoin="round"| stroke-linecap="round"/g, "");
  }
  return svg;
};

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weich2")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>`);
/* Blüten als wiederverwendbare Rosetten: Studentenblume (gefüllt), Rose */
{
  let tg = "", ro = "";
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; tg += `<circle cx="${r(Math.cos(a) * 0.62)}" cy="${r(Math.sin(a) * 0.5)}" r=".45" fill="#e8820e"/>`; }
  tg += `<circle cx="0" cy="-.05" r=".62" fill="#f8a822"/><circle cx="-.15" cy="-.2" r=".3" fill="#ffc94a"/>`;
  ro = `<circle r="1" fill="#a81c2c"/><path d="M-.6 -.1 Q0 -.8 .6 -.1 Q0 .3 -.6 -.1 Z M-.8 .3 Q0 1 .8 .3" fill="#d23646" stroke="#7a1020" stroke-width=".12"/><circle cx="-.1" cy="-.3" r=".25" fill="#f0606a"/>`;
  S.def(`<g id="${S.id("tagetes")}">${tg}</g><g id="${S.id("rose")}">${ro}</g>`);
}
S.def(`<filter id="${S.id("weich1")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation=".7"/></filter>`);
/* Morgenlicht: Westseite kühl lila, Front warmweiß, Ostseite rosé-gold */
const MARMOR = S.lg("marmor", [[0, "#e9e2ec"], [0.45, "#fbf5ef"], [1, "#ffeedd"]], 0, 0, 1, 0);
const WEST = "#cbc2d8", OST = "#ffdcc0";
const NISCHE = S.lg("nische", [[0, "#aba1b6"], [0.6, "#c7bdc6"], [1, "#e2d6d0"]]);
const SANDSTEIN = S.lg("sandstein", [[0, "#b8563a"], [1, "#94402a"]], 0, 0, 1, 0);
const KUPPEL = S.lg("kuppel", [[0, "#c9c0d8"], [0.35, "#ece5ea"], [0.62, "#fff7ee"], [0.85, "#ffe4cc"], [1, "#f7c9a8"]], 0, 0, 1, 0);
const ZYPRESSE = S.lg("zypresse", [[0, "#1c3424"], [0.55, "#2b4c31"], [1, "#4f7a46"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#f4e2a0"], [0.5, "#c9a24a"], [1, "#8a6a22"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Morgenhimmel
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.lg("himmel", [[0, "#7fa3cc"], [0.45, "#b3c8de"], [0.8, "#ecd9cc"], [1, "#f6d6bc"]])}"/>`);
S.hinten(`<ellipse cx="430" cy="${HOR - 4}" rx="210" ry="80" fill="${S.rg("morgenrot", [[0, "#ffcf9a", 0.8], [1, "#ffcf9a", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[90, 26, 1.2], [300, 16, 0.9], [360, 60, 0.7]]) {
    w += `<g filter="url(#${S.id("weich2")})" opacity=".6">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 22, 3], [-14, 1.6, 12, 2.4], [15, 1, 14, 2.6]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="${x > 250 ? "#ffe9d8" : "#fff4ea"}"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}

/* =====================================================================
   DER TAJ — als wiederverwendbare Gruppen (Bild und Spiegelbild)
   ===================================================================== */
const T = { dS: 300, dB: 320, dK: 347.75, h0: 7.0 };
const uB = uAt(T.dB), uK = uAt(T.dK);
const yB = (h) => yAt(T.dB, h), xB = (s) => xAt(s, T.dB);
const yK = (h) => yAt(T.dK, h), xK = (s) => xAt(s, T.dK);

/* ---------- Sockel (weißer Marmor) auf der roten Sandsteinterrasse, davor ferne Besucher ---------- */
let sockel = "";
{
  const d = T.dS, xl = xAt(-47.75, d), xr = xAt(47.75, d), yo = yAt(d, T.h0), yu = yAt(d, 1.2);
  sockel += `<rect x="0" y="${r(yAt(292, 1.2))}" width="400" height="${r(yAt(292, 0) - yAt(292, 1.2))}" fill="${SANDSTEIN}"/>`;
  for (let x = 2; x < 398; x += 6.4) sockel += `<rect x="${r(x)}" y="${r(yAt(292, 1.0))}" width="3.6" height="${r(yAt(292, 0.25) - yAt(292, 1.0))}" fill="#7a3220" opacity=".5"/>`;
  sockel += `<rect x="0" y="${r(yAt(292, 1.2) - 0.4)}" width="400" height=".6" fill="#f2e6dc"/>`;
  sockel += `<rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height="${r(yu - yo)}" fill="${MARMOR}"/>`;
  const n = 22, w = (xr - xl) / n;
  for (let i = 0; i < n; i++) {
    const a = xl + i * w + w * 0.18, b = xl + (i + 1) * w - w * 0.18, top = yo + 2.4;
    sockel += `<path d="M${r(a)} ${r(yu - 0.8)} L${r(a)} ${r(top + 2.2)} Q${r((a + b) / 2)} ${r(top)} ${r(b)} ${r(top + 2.2)} L${r(b)} ${r(yu - 0.8)} Z" fill="${NISCHE}"/>`;
  }
  sockel += `<rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height=".9" fill="#fffaf2"/><rect x="${r(xl)}" y="${r(yo + 1.5)}" width="${r(xr - xl)}" height=".25" fill="#8d8486"/>`;
  sockel += `<rect x="${r(CX - 4.6)}" y="${r(yo + 1.8)}" width="9.2" height="${r(yu - yo - 2.6)}" fill="#e9e1dc"/><path d="M${r(CX - 2.6)} ${r(yu - 0.8)} L${r(CX - 2.6)} ${r(yo + 5)} Q${CX} ${r(yo + 3)} ${r(CX + 2.6)} ${r(yo + 5)} L${r(CX + 2.6)} ${r(yu - 0.8)} Z" fill="#8a7f86"/>`;
  /* Ostkante des Sockels im Morgenlicht */
  sockel += `<rect x="${r(xr - 1.6)}" y="${r(yo)}" width="1.6" height="${r(yu - yo)}" fill="${OST}" opacity=".7"/>`;
}
S.def(`<g id="${S.id("sockelbild")}">${sockel}</g>`);
/* ferne Besucher: drei winzige Vorlagen (defs), mehrfach verwendet — auf der roten Terrasse vor dem Sockel und am Marmorbecken */
const BESUCHER_H = 30;
{
  const farben = [["gelb", "rock", "rot", "w"], ["weiss", "hose", "grau", "m"], ["rosa", "rock", "blau", "w"], ["hellblau", "hose", "jeans", "m"]];
  farben.forEach(([o, art, h, g], i) => {
    const m = B.mensch({ id: "ind_b" + i, geschlecht: g, pose: "stehen", blick: 170 + i * 25, frisur: g === "m" ? "kurz" : "zopf", haarfarbe: "schwarz", haut: "mittel",
      kleidung: { oberteil: { stueck: "tshirt", farbe: o }, unterteil: { stueck: art, farbe: h } } }, BESUCHER_H);
    S.def(`<g id="${S.id("bes" + i)}">${vereinfache(m.svg, 3)}</g>`);
  });
}
const besuch = (s, d, h0, i, sp = 1) => { const q = 1.65 * uAt(d) / BESUCHER_H; return `<use href="#${S.id("bes" + (i % 4))}" transform="translate(${r(xAt(s, d))} ${r(yAt(d, h0))}) scale(${r(sp * q * 1000) / 1000} ${r(q * 1000) / 1000})"/>`; };
let besucher = "";
for (const [s, i, sp] of [[-44, 0, 1], [-41.5, 1, -1], [-37, 2, 1], [-33.5, 3, 1], [-32.2, 0, -1], [-27, 1, 1], [25, 2, -1], [28.5, 0, 1], [29.8, 3, -1], [34, 1, 1], [39, 2, 1], [43.5, 3, -1]]) besucher += besuch(s, 294, 1.2, i, sp);

/* ---------- das Mausoleum: Fassade, Portal, Nischen, Pavillons, Kuppel ---------- */
let bau = "", kuppel = "", pavH = "", pavV = "";
const portal = { s: 10.5, bogen: 6.6, hBogen: 30.5, hKampfer: 19 };
const KUP = { hT: 46.2, hh: 19.4, rT: 8.6 };       /* Tambour-Oberkante, Kuppelhöhe, Tambour-Radius (m) */
{
  const h0 = T.h0, hP = 37;
  const f = (s) => xB(s);
  /* abgeschrägte Ecken: links Schatten (Südwest), rechts Morgenlicht (Südost) */
  for (const sd of [-1, 1]) {
    const xa = f(sd * 19.5), xb = xAt(sd * 27.5, 328), ya = yB(hP), yb = yAt(328, hP), ya0 = yB(h0), yb0 = yAt(328, h0);
    bau += `<path d="M${r(xa)} ${r(ya0)} L${r(xa)} ${r(ya)} L${r(xb)} ${r(yb)} L${r(xb)} ${r(yb0)} Z" fill="${sd > 0 ? OST : WEST}"/>`;
    for (const [hu, ho] of [[h0 + 1.2, h0 + 13.2], [h0 + 15, h0 + 26.6]]) {
      const m = (t, h) => [xa + (xb - xa) * t, yB(h) + (yAt(328, h) - yB(h)) * t];
      const [p1x, p1y] = m(0.18, hu), [p2x, p2y] = m(0.82, hu), [p3x, p3y] = m(0.82, ho - 3), [p4x, p4y] = m(0.18, ho - 3), [pkx, pky] = m(0.5, ho);
      bau += `<path d="M${r(p1x)} ${r(p1y)} L${r(p4x)} ${r(p4y)} Q${r(pkx)} ${r(pky - 0.6)} ${r(p3x)} ${r(p3y)} L${r(p2x)} ${r(p2y)} Z" fill="${sd > 0 ? "#e2c3b2" : "#a399b3"}"/>`;
      { const [f1x, f1y] = m(0.08, hu - 0.4), [f2x, f2y] = m(0.92, hu - 0.4), [f3x, f3y] = m(0.92, ho + 0.4), [f4x, f4y] = m(0.08, ho + 0.4), [z1x, z1y] = m(0.14, ho - 0.6), [z2x, z2y] = m(0.86, ho - 0.6);
        bau += `<path d="M${r(f1x)} ${r(f1y)} L${r(f2x)} ${r(f2y)} L${r(f3x)} ${r(f3y)} L${r(f4x)} ${r(f4y)} Z" fill="none" stroke="${sd > 0 ? "#d4b4a2" : "#988ea8"}" stroke-width=".35"/><circle cx="${r(z1x)}" cy="${r(z1y)}" r=".3" fill="#b04a4a"/><circle cx="${r(z2x)}" cy="${r(z2y)}" r=".3" fill="#3f7a4a"/>`; }
    }
    bau += `<line x1="${r(xb)}" y1="${r(yb)}" x2="${r(xb)}" y2="${r(yb0)}" stroke="${sd > 0 ? "#fff1e2" : "#b1a8c2"}" stroke-width=".5"/>`;
  }
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(hP))}" width="${r(f(19.5) - f(-19.5))}" height="${r(yB(h0) - yB(hP))}" fill="${MARMOR}"/>`;
  for (const sd of [-1, 1]) {
    const a = f(sd * 11.4), b = f(sd * 18.6), xa = Math.min(a, b), xbb = Math.max(a, b);
    for (const [hu, ho] of [[h0 + 1.2, h0 + 13.6], [h0 + 15.2, h0 + 27]]) {
      const yo = yB(ho), yu = yB(hu), m = (xa + xbb) / 2, w = (xbb - xa) / 2 - 1.6;
      bau += `<rect x="${r(xa + 0.5)}" y="${r(yo)}" width="${r(xbb - xa - 1)}" height="${r(yu - yo)}" fill="none" stroke="#b5aaa8" stroke-width=".35"/>`;
      bau += `<path d="M${r(m - w)} ${r(yu)} L${r(m - w)} ${r(yo + w * 1.1 + 1)} Q${r(m - w)} ${r(yo + 1.2)} ${r(m)} ${r(yo + 1)} Q${r(m + w)} ${r(yo + 1.2)} ${r(m + w)} ${r(yo + w * 1.1 + 1)} L${r(m + w)} ${r(yu)} Z" fill="${NISCHE}"/>`;
      bau += `<path d="M${r(m - w * 0.45)} ${r(yu)} L${r(m - w * 0.45)} ${r(yu - (yu - yo) * 0.42)} Q${r(m)} ${r(yu - (yu - yo) * 0.55)} ${r(m + w * 0.45)} ${r(yu - (yu - yo) * 0.42)} L${r(m + w * 0.45)} ${r(yu)} Z" fill="#8e8389" opacity=".75"/>`;
      for (const zx of [m - w + 0.6, m + w - 0.6]) bau += `<circle cx="${r(zx)}" cy="${r(yo + 1.2)}" r=".35" fill="#b04a4a"/><circle cx="${r(zx)}" cy="${r(yo + 1.9)}" r=".22" fill="#3f7a4a"/>`;
    }
  }
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(hP) - 0.2)}" width="${r(f(19.5) - f(-19.5))}" height="1.4" fill="#efe5dc"/>`;
  for (let s = -19; s <= 19; s += 1.25) bau += `<rect x="${r(f(s) - 0.3)}" y="${r(yB(hP) - 1.1)}" width=".6" height=".9" fill="#f6eee4"/>`;
  bau += `<line x1="${r(f(-19.5))}" y1="${r(yB(hP) + 0.6)}" x2="${r(f(19.5))}" y2="${r(yB(hP) + 0.6)}" stroke="#4a4244" stroke-width=".22" stroke-dasharray=".5 .35"/>`;
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(h0 + 1.4))}" width="${r(f(19.5) - f(-19.5))}" height="${r(yB(h0) - yB(h0 + 1.4))}" fill="#e7ded8"/>`;
  for (let s = -19; s <= 19; s += 1.6) bau += `<path d="M${r(f(s))} ${r(yB(h0 + 0.3))} q.3 -1 .6 0" stroke="#b9aeac" stroke-width=".2" fill="none"/>`;
  /* ---- das große Portal (Pishtaq) ---- */
  const xl = f(-portal.s), xr = f(portal.s), yT = yB(h0 + 33), yU = yB(h0), bw = portal.bogen * uB;
  bau += `<rect x="${r(xl)}" y="${r(yT)}" width="${r(xr - xl)}" height="${r(yU - yT)}" fill="${MARMOR}"/>`;
  bau += `<rect x="${r(xl)}" y="${r(yT)}" width="${r(xr - xl)}" height="${r(yU - yT)}" fill="none" stroke="#c8bdb6" stroke-width=".4"/>`;
  /* Schriftband: SCHWARZE Buchstaben auf WEISSEM Marmor, von feinen dunklen Linien gerahmt, oben größer */
  const sb = 1.5, ri = 1.0, rz = zufall(89);
  const bandL = xl + ri, bandR = xr - ri - sb, bandO = yT + ri;
  bau += `<path d="M${r(bandL)} ${r(yU)} L${r(bandL)} ${r(bandO)} L${r(bandR + sb)} ${r(bandO)} L${r(bandR + sb)} ${r(yU)} L${r(bandR)} ${r(yU)} L${r(bandR)} ${r(bandO + sb)} L${r(bandL + sb)} ${r(bandO + sb)} L${r(bandL + sb)} ${r(yU)} Z" fill="#fbf7f0" stroke="#3a3436" stroke-width=".16"/>`;
  const zeichen = (x, y, g, quer) => {
    const t = rz();
    if (t < 0.32) return quer ? `<path d="M${r(x)} ${r(y + 0.5 * g)} l${r(0.1 * g)} ${r(-0.95 * g)}" stroke="#1d1a1c" stroke-width="${r(0.13 * g)}"/>` : `<path d="M${r(x - 0.5 * g)} ${r(y)} l${r(0.95 * g)} ${r(-0.1 * g)}" stroke="#1d1a1c" stroke-width="${r(0.13 * g)}"/>`;
    if (t < 0.62) return `<path d="M${r(x - 0.4 * g)} ${r(y - 0.15 * g)} q${r(0.4 * g)} ${r(0.55 * g)} ${r(0.8 * g)} 0" stroke="#1d1a1c" stroke-width="${r(0.12 * g)}" fill="none"/>`;
    if (t < 0.85) return `<path d="M${r(x - 0.35 * g)} ${r(y + 0.3 * g)} q${r(0.25 * g)} ${r(-0.7 * g)} ${r(0.7 * g)} ${r(-0.35 * g)}" stroke="#1d1a1c" stroke-width="${r(0.11 * g)}" fill="none"/>`;
    return `<circle cx="${r(x)}" cy="${r(y - 0.3 * g)}" r="${r(0.1 * g)}" fill="#1d1a1c"/>`;
  };
  for (let y = bandO + sb + 0.6; y < yU - 0.5; y += 0.72) { const g = 0.95 + (yU - y) / (yU - yT) * 0.45; bau += zeichen(bandL + sb / 2, y, g, false) + zeichen(bandR + sb / 2, y, g, false); }
  for (let x = bandL + 1; x < bandR + sb - 0.6; x += 0.8) bau += zeichen(x, bandO + sb / 2, 1.4, true);
  /* der Spitzbogen: Nische mit Halbkuppel und Rippen, Rückwand mit Fenstergitter (Jali) und Tür */
  const yK0 = yB(h0 + portal.hKampfer), yApex = yB(h0 + portal.hBogen), bx0 = CX - bw, bx1 = CX + bw;
  const bogen = `M${r(bx0)} ${r(yU)} L${r(bx0)} ${r(yK0)} C${r(bx0)} ${r(yK0 - (yK0 - yApex) * 0.62)} ${r(CX - bw * 0.38)} ${r(yApex + (yK0 - yApex) * 0.2)} ${CX} ${r(yApex)} C${r(CX + bw * 0.38)} ${r(yApex + (yK0 - yApex) * 0.2)} ${r(bx1)} ${r(yK0 - (yK0 - yApex) * 0.62)} ${r(bx1)} ${r(yK0)} L${r(bx1)} ${r(yU)} Z`;
  bau += `<path d="${bogen}" fill="${S.lg("portalnische", [[0, "#a197ad"], [0.5, "#c5bac2"], [1, "#e6d4c8"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.35, 0.7]) bau += `<path d="M${r(CX - bw * t)} ${r(yK0)} Q${r(CX - bw * t * 0.6)} ${r(yApex + (yK0 - yApex) * 0.25)} ${CX} ${r(yApex + 1.2)} Q${r(CX + bw * t * 0.6)} ${r(yApex + (yK0 - yApex) * 0.25)} ${r(CX + bw * t)} ${r(yK0)}" stroke="#968b91" stroke-width=".25" fill="none"/>`;
  bau += `<path d="M${r(bx0)} ${r(yU)} L${r(bx0)} ${r(yK0)} L${r(CX - bw * 0.55)} ${r(yK0 + 2)} L${r(CX - bw * 0.55)} ${r(yU)} Z" fill="#988fa6"/><path d="M${r(bx1)} ${r(yU)} L${r(bx1)} ${r(yK0)} L${r(CX + bw * 0.55)} ${r(yK0 + 2)} L${r(CX + bw * 0.55)} ${r(yU)} Z" fill="#d8bcae"/>`;
  bau += `<path d="M${r(CX - bw * 0.55)} ${r(yK0 + 2)} L${r(CX + bw * 0.55)} ${r(yK0 + 2)}" stroke="#8e8389" stroke-width=".3"/>`;
  const yF0 = yB(h0 + 17), yF1 = yB(h0 + 11.5), fw = bw * 0.36;
  bau += `<path d="M${r(CX - fw)} ${r(yF1)} L${r(CX - fw)} ${r(yF0 + fw * 0.8)} Q${CX} ${r(yF0 - fw * 0.4)} ${r(CX + fw)} ${r(yF0 + fw * 0.8)} L${r(CX + fw)} ${r(yF1)} Z" fill="#7a7076"/>`;
  for (let i = 1; i < 4; i++) bau += `<line x1="${r(CX - fw + i * fw / 2)}" y1="${r(yF0 + 1)}" x2="${r(CX - fw + i * fw / 2)}" y2="${r(yF1)}" stroke="#d6ccc6" stroke-width=".16"/>`;
  for (let y = yF0 + 2; y < yF1; y += 1.2) bau += `<line x1="${r(CX - fw)}" y1="${r(y)}" x2="${r(CX + fw)}" y2="${r(y)}" stroke="#d6ccc6" stroke-width=".14"/>`;
  bau += `<path d="M${r(CX - bw * 0.42)} ${r(yU)} L${r(CX - bw * 0.42)} ${r(yB(h0 + 6.5))} Q${CX} ${r(yB(h0 + 9.6))} ${r(CX + bw * 0.42)} ${r(yB(h0 + 6.5))} L${r(CX + bw * 0.42)} ${r(yU)} Z" fill="#4e4549"/>`;
  bau += `<path d="${bogen}" fill="none" stroke="#f6efe6" stroke-width=".6"/>`;
  /* Pietra dura in den Zwickeln */
  for (const sd of [-1, 1]) {
    const zx = CX + sd * bw * 0.72, zy = yApex + 2.6;
    bau += `<path d="M${r(zx - sd * 3)} ${r(zy + 2)} q${r(sd * 1.6)} -2.6 ${r(sd * 3.6)} -2.2 q${r(sd * 1.4)} .4 ${r(sd * 2.4)} -1.6" stroke="#5d7a4a" stroke-width=".25" fill="none"/>`;
    for (const [dx, dy, c] of [[-2, 1.4, "#b33a3a"], [0, -0.4, "#c9a227"], [2, -1.2, "#b33a3a"], [-0.8, 0.6, "#3a6ea0"], [1.2, 0.2, "#4a7a3a"]]) bau += `<circle cx="${r(zx + sd * dx)}" cy="${r(zy + dy)}" r=".42" fill="${c}"/>`;
  }
  /* Fialen (Guldastas) neben dem Portal und an den Ecken */
  for (const s of [-portal.s, portal.s, -19.5, 19.5]) {
    const x = f(s), amPortal = Math.abs(s) === portal.s, yt = yB(amPortal ? h0 + 37 : hP + 3.4), yb = yB(amPortal ? h0 + 33 : hP);
    bau += `<rect x="${r(x - 0.5)}" y="${r(yt + 1.2)}" width="1" height="${r(yb - yt - 1.2)}" fill="${s > 0 ? "#ffeadb" : "#ece4ea"}"/><path d="M${r(x - 0.75)} ${r(yt + 1.4)} Q${r(x)} ${r(yt - 0.6)} ${r(x + 0.75)} ${r(yt + 1.4)} Z" fill="#efe6de"/><line x1="${r(x)}" y1="${r(yt - 0.6)}" x2="${r(x)}" y2="${r(yt - 1.8)}" stroke="${GOLD}" stroke-width=".25"/>`;
  }

  /* ---- Tambour, Zwiebelkuppel mit Lotuskappe und Kalasch-Bekrönung ---- */
  const yTam = yK(KUP.hT), rbU = KUP.rT * uK, hhU = KUP.hh * uK;
  kuppel += `<rect x="${r(CX - rbU)}" y="${r(yTam)}" width="${r(2 * rbU)}" height="${r(yK(34) - yTam)}" fill="${MARMOR}"/>`;
  /* Tambour: helle Trommel zwischen Portalkante und Kuppelfuß, Gesims oben und unten, flache Bogenfelder */
  kuppel += `<rect x="${r(CX - rbU)}" y="${r(yTam)}" width="${r(2 * rbU)}" height="${r(yK(41) - yTam)}" fill="${S.lg("tambour", [[0, "#d6cde0"], [0.5, "#f8f1ea"], [1, "#ffe2c8"]], 0, 0, 1, 0)}"/>`;
  for (let i = -3; i <= 3; i++) { const xx = CX + i * rbU * 0.27; kuppel += `<path d="M${r(xx - 1.1)} ${r(yK(41.3))} L${r(xx - 1.1)} ${r(yK(44.2))} Q${r(xx)} ${r(yK(45.2))} ${r(xx + 1.1)} ${r(yK(44.2))} L${r(xx + 1.1)} ${r(yK(41.3))} Z" fill="${i < 0 ? "#c9bfd2" : "#ecdcd2"}"/>`; }
  kuppel += `<rect x="${r(CX - rbU - 0.5)}" y="${r(yK(41.6))}" width="${r(2 * rbU + 1)}" height=".7" fill="#f3ebe4" stroke="#b9aeac" stroke-width=".15"/>`;
  kuppel += `<rect x="${r(CX - rbU - 0.8)}" y="${r(yTam - 0.4)}" width="${r(2 * rbU + 1.6)}" height="1.1" fill="#f3ebe4" stroke="#b9aeac" stroke-width=".2"/><rect x="${r(CX - rbU - 0.8)}" y="${r(yTam + 0.7)}" width="${r(2 * rbU + 1.6)}" height=".35" fill="#a99ca8" opacity=".6"/>`;
  const kp = zwiebel(CX, yTam - 0.4, rbU, hhU);
  kuppel += `<path d="${kp}" fill="${KUPPEL}"/>`;
  kuppel += `<path d="${kp}" fill="${S.rg("kuppelglanz", [[0, "#fff", 0.5], [1, "#fff", 0]], 0.66, 0.36, 0.42)}"/>`;
  kuppel += `<path d="${kp}" fill="none" stroke="#c9bfc6" stroke-width=".3"/>`;
  /* (keine Naht quer über die Kuppel – das Original hat keine) */
  /* Lotuskappe: Kranz aus umgekehrten Blättern, die sich an die Kuppel schmiegen (Spitzen nach unten) */
  const qAt = (t) => { for (let i = 1; i < ZWIEBEL.length; i++) if (t <= ZWIEBEL[i][1]) { const [q0, t0] = ZWIEBEL[i - 1], [q1, t1] = ZWIEBEL[i]; return q0 + (q1 - q0) * (t - t0) / (t1 - t0); } return 0; };
  const yRing = (t, th) => yTam - 0.4 - t * hhU + Math.cos(th) * qAt(t) * rbU * 0.12;
  const tO = 0.95, tU = 0.8;
  { const yS = yRing(tU, 0); kuppel += `<path d="M${r(CX - qAt(tU) * rbU * 0.96)} ${r(yRing(tU, 1.4) + 0.3)} Q${CX} ${r(yS + 1.1)} ${r(CX + qAt(tU) * rbU * 0.96)} ${r(yRing(tU, 1.4) + 0.3)}" stroke="#9e90a6" stroke-width=".55" fill="none" opacity=".45"/>`; }
  kuppel += `<path d="M${r(CX - qAt(tO) * rbU)} ${r(yRing(tO, 1.57))} Q${CX} ${r(yRing(tO, 0) + 0.8)} ${r(CX + qAt(tO) * rbU)} ${r(yRing(tO, 1.57))}" stroke="#d6cbd0" stroke-width=".5" fill="none"/>`;
  {
    /* geschlossenes Band umgekehrter Lotusblätter: glatte Oberkante, Blattspitzen unten, linke Seite im Schatten */
    const p = (t, th) => [CX + qAt(t) * rbU * Math.sin(th), yRing(t, th)];
    const TH = [-1.45, -1.1, -0.7, -0.35, 0, 0.35, 0.7, 1.1, 1.45];
    let d = "M" + TH.map((th) => p(tO, th).map(r).join(" ")).join(" L");
    for (let i = 3; i >= -3; i--) { const th = i * 0.44; d += " L" + p(tU + 0.07, th + 0.22).map(r).join(" ") + " Q" + p(tU + 0.01, th + 0.1).map(r).join(" ") + " " + p(tU, th).map(r).join(" ") + " Q" + p(tU + 0.01, th - 0.1).map(r).join(" ") + " " + p(tU + 0.07, th - 0.22).map(r).join(" "); }
    kuppel += `<path d="${d} Z" fill="${S.lg("lotus", [[0, "#cfc4d6"], [0.45, "#f6efe8"], [1, "#ffe6d2"]], 0, 0, 1, 0)}" stroke="#a89aa6" stroke-width=".3"/>`;
    for (let i = -3; i <= 3; i++) { const th = i * 0.44; const [ax, ay] = p(tO, th), [bx, by] = p(tU + 0.02, th), [cx2, cy2] = p(tO, th + 0.22), [dx2, dy2] = p(tU + 0.07, th + 0.22); kuppel += `<path d="M${r(ax)} ${r(ay)} L${r(bx)} ${r(by)}" stroke="#bfb0ba" stroke-width=".22"/><path d="M${r(cx2)} ${r(cy2)} L${r(dx2)} ${r(dy2)}" stroke="#9e90a6" stroke-width=".3"/>`; }
  }
  /* Bekrönung: Fuß, Kalasch-Vase, zwei Kugeln, Stab mit Halbmond */
  const fx = CX, yf = yTam - 0.4 - 0.985 * hhU;
  kuppel += `<path d="M${r(fx - 1.6)} ${r(yf)} L${r(fx + 1.6)} ${r(yf)} L${r(fx + 0.9)} ${r(yf - 1.2)} L${r(fx - 0.9)} ${r(yf - 1.2)} Z" fill="${GOLD}"/>`;
  kuppel += `<path d="M${r(fx - 0.6)} ${r(yf - 1.2)} Q${r(fx - 2.1)} ${r(yf - 2.6)} ${r(fx - 0.7)} ${r(yf - 4.2)} L${r(fx - 0.5)} ${r(yf - 4.8)} L${r(fx + 0.5)} ${r(yf - 4.8)} L${r(fx + 0.7)} ${r(yf - 4.2)} Q${r(fx + 2.1)} ${r(yf - 2.6)} ${r(fx + 0.6)} ${r(yf - 1.2)} Z" fill="${GOLD}"/>`;
  kuppel += `<rect x="${r(fx - 0.3)}" y="${r(yK(73.4))}" width=".6" height="${r(yf - 4.8 - yK(73.4))}" fill="${GOLD}"/>`;
  for (const [h, rr] of [[68.4, 0.95], [69.9, 1.05], [71.3, 0.6]]) kuppel += `<ellipse cx="${r(fx)}" cy="${r(yK(h))}" rx="${rr}" ry="${r(rr * 0.85)}" fill="${GOLD}"/>`;
  kuppel += `<path d="M${r(fx - 1.2)} ${r(yK(72.6))} a1.25 1.25 0 1 0 2.4 0" stroke="${GOLD}" stroke-width=".4" fill="none"/>`;

  /* ---- vier Kuppelpavillons (Chattris): offene Bögen auf acht Säulen, Zwiebelkuppel ---- */
  const chattri = (s, d, k = 1) => {
    const u = uAt(d), x = xAt(s, d), y = (h) => yAt(d, h), w = 3.4 * u * k;
    let g = `<rect x="${r(x - w - 0.4)}" y="${r(y(38.6))}" width="${r(2 * w + 0.8)}" height="${r(y(36.8) - y(38.6))}" fill="#efe7e0"/>`;
    for (let i = 0; i < 4; i++) {
      const a = x - w + i * (2 * w) / 3;
      g += `<rect x="${r(a - 0.35)}" y="${r(y(44.4))}" width=".7" height="${r(y(38.6) - y(44.4))}" fill="${a > x ? "#ffeadb" : "#ece4ea"}"/>`;
      if (i < 3) g += `<path d="M${r(a + 0.4)} ${r(y(38.6))} L${r(a + 0.4)} ${r(y(42.6))} Q${r(a + w / 3)} ${r(y(44))} ${r(a + 2 * w / 3 - 0.4)} ${r(y(42.6))} L${r(a + 2 * w / 3 - 0.4)} ${r(y(38.6))} Z" fill="#988da0"/>`;
    }
    g += `<rect x="${r(x - w - 0.8)}" y="${r(y(45.2))}" width="${r(2 * w + 1.6)}" height="${r(y(44.2) - y(45.2))}" fill="#f4ece4"/>`;
    g += `<path d="${zwiebel(x, y(45.2), w * 0.66, y(45.2) - y(52))}" fill="${KUPPEL}"/>`;
    g += `<line x1="${r(x)}" y1="${r(y(51.8))}" x2="${r(x)}" y2="${r(y(54))}" stroke="${GOLD}" stroke-width=".4"/><circle cx="${r(x)}" cy="${r(y(52.8))}" r=".45" fill="${GOLD}"/>`;
    return g;
  };
  pavH = chattri(-15.5, 364, 0.95) + chattri(15.5, 364, 0.95);
  pavV = chattri(-15.5, 331) + chattri(15.5, 331);
}
S.def(`<g id="${S.id("baubild")}">${pavH}${kuppel}${bau}${pavV}</g>`);

/* ---------- die vier Minarette ---------- */
let minarette = "";
{
  const minarett = (s, d, hinten) => {
    const u = uAt(d), x = xAt(s, d), y = (h) => yAt(d, h);
    const rB = 3.1 * u, rT = 2.3 * u, h0 = T.h0;
    const rad = (h) => rB + (rT - rB) * (h - h0) / 33;
    let g = "";
    const yBasis = hinten ? Math.min(y(h0), yAt(T.dS, h0)) : y(h0);
    for (const [ha, hb] of [[h0, 18], [18.9, 29], [29.9, 40]]) {
      const ya = ha === h0 ? yBasis : y(ha), yb = y(hb);
      g += `<path d="M${r(x - rad(ha))} ${r(ya)} L${r(x - rad(hb))} ${r(yb)} L${r(x + rad(hb))} ${r(yb)} L${r(x + rad(ha))} ${r(ya)} Z" fill="${S.lg("minarett", [[0, "#bdb4cc"], [0.4, "#ebe4e8"], [0.75, "#fff3e6"], [1, "#ffd6b8"]], 0, 0, 1, 0)}"/>`;
      /* schwarze Einlagelinien: senkrecht */
      for (const t of [-0.62, -0.2, 0.22, 0.64]) g += `<line x1="${r(x + t * rad(ha))}" y1="${r(ya)}" x2="${r(x + t * rad(hb))}" y2="${r(yb)}" stroke="#2e2a2c" stroke-width="${r(0.12 * u)}" opacity=".88"/>`;
      /* Ostkante im Licht */
      g += `<line x1="${r(x + rad(ha) - 0.3)}" y1="${r(ya)}" x2="${r(x + rad(hb) - 0.3)}" y2="${r(yb)}" stroke="#ffe8d4" stroke-width=".5"/>`;
    }
    for (const h of [18, 29, 40]) {
      const rr = rad(h) + 1.0 * u;
      /* Band unter dem Balkon, Konsolen, Brüstung */
      g += `<rect x="${r(x - rad(h - 2))}" y="${r(y(h - 2))}" width="${r(2 * rad(h - 2))}" height="${r(y(h - 2.7) - y(h - 2))}" fill="#3a3436" opacity=".7"/>`;
      g += `<path d="M${r(x - rad(h))} ${r(y(h - 1.4))} L${r(x - rr)} ${r(y(h))} L${r(x + rr)} ${r(y(h))} L${r(x + rad(h))} ${r(y(h - 1.4))} Z" fill="#d8cfd4"/>`;
      g += `<rect x="${r(x - rr)}" y="${r(y(h + 1.1))}" width="${r(2 * rr)}" height="${r(y(h) - y(h + 1.1))}" fill="#f4ede6"/>`;
      for (let i = 1; i < 6; i++) g += `<line x1="${r(x - rr + i * rr / 3)}" y1="${r(y(h + 1.1))}" x2="${r(x - rr + i * rr / 3)}" y2="${r(y(h))}" stroke="#a89ea8" stroke-width=".18"/>`;
    }
    const pr = rT * 1.05;
    g += `<rect x="${r(x - pr)}" y="${r(y(44.2))}" width="${r(2 * pr)}" height="${r(y(41.1) - y(44.2))}" fill="#9e94a8"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(x - pr + i * (2 * pr - 0.6) / 3)}" y="${r(y(44.2))}" width=".6" height="${r(y(41.1) - y(44.2))}" fill="#f6efe8"/>`;
    g += `<rect x="${r(x - pr - 0.5)}" y="${r(y(44.8))}" width="${r(2 * pr + 1)}" height="${r(y(44.2) - y(44.8))}" fill="#f4ece4"/>`;
    g += `<path d="${zwiebel(x, y(44.8), pr * 0.72, y(44.8) - y(49.2))}" fill="${KUPPEL}"/>`;
    g += `<line x1="${r(x)}" y1="${r(y(49))}" x2="${r(x)}" y2="${r(y(50.8))}" stroke="${GOLD}" stroke-width=".35"/>`;
    return g;
  };
  minarette += minarett(-44.5, 391, true) + minarett(44.5, 391, true) + minarett(-44.5, 302.5) + minarett(44.5, 302.5);
}
S.def(`<g id="${S.id("minarettbild")}">${minarette}</g>`);

/* =====================================================================
   1 — DIE MOSCHEE (links, Westen) und 2 — DAS GÄSTEHAUS (rechts, Osten)
   ===================================================================== */
const rotbau = (sx) => {
  /* Schmalseite nach Süden: Sandsteinfront mit Marmorbändern und Nischenfeldern, Zinnenbrüstung,
     achteckige Ecktürme mit offenem Pavillon, dahinter die weißen Kuppeln hintereinander */
  const d = 335, u = uAt(d), x = xAt(sx * 96, d), y = (h) => yAt(d, h), licht = sx > 0 ? 0.9 : 0.3;
  let g = "";
  for (const [dh, rr, hh, dd] of [[21, 7.2, 32, 22], [19.5, 4.8, 27.5, 4]]) {
    const ud = uAt(d + dd), yy = yAt(d + dd, dh), w = rr * ud, yt = yAt(d + dd, dh - 2.6);
    g += `<rect x="${r(x - w * 0.86)}" y="${r(yy)}" width="${r(w * 1.72)}" height="${r(yt - yy)}" fill="#efe6dd"/><rect x="${r(x - w * 0.86)}" y="${r(yy)}" width="${r(w * 1.72)}" height=".4" fill="#c9bdb4"/>`;
    g += `<path d="${zwiebel(x, yy, w * 0.78, yy - yAt(d + dd, hh))}" fill="${KUPPEL}"/>`;
    g += `<line x1="${r(x)}" y1="${r(yAt(d + dd, hh))}" x2="${r(x)}" y2="${r(yAt(d + dd, hh) - 2.4)}" stroke="${GOLD}" stroke-width=".4"/><circle cx="${r(x)}" cy="${r(yAt(d + dd, hh) - 1.2)}" r=".4" fill="${GOLD}"/>`;
  }
  const w0 = 12 * u, yTop = y(17.6), yFuss = y(1.2);
  /* Langseite zum Garten (Moschee: Ostfassade im Morgenlicht; Gästehaus: Westfassade im Schatten), läuft zum Fluchtpunkt */
  {
    const si = sx * 96 - sx * 12, dA = d, dB = d + 56, ps = (dd, h) => [xAt(si, dd), yAt(dd, h)];
    const hell = sx < 0, F1 = hell ? "#c86a48" : "#7e3422", F2 = hell ? "#a85236" : "#5e2416";
    const flaeche4 = (d0, d1, h0, h1) => P([ps(d0, h1), ps(d1, h1), ps(d1, h0), ps(d0, h0)]);
    g += `<path d="${flaeche4(dA, dB, 1.2, 17.6)}" fill="${F1}"/>`;
    for (const h of [9.6, 17.6]) g += `<path d="M${ps(dA, h).map(r).join(" ")} L${ps(dB, h).map(r).join(" ")}" stroke="#f2e6dc" stroke-width=".5"/>`;
    for (let dd = dA + 1; dd < dB - 1; dd += 1.2) { const [a, b] = ps(dd, 17.6); g += `<path d="M${r(a)} ${r(b)} l0 -.8 l${r(sx * -0.25)} -.3 l0 1.1 Z" fill="${F2}"/>`; }
    /* Nischenfelder und in der Mitte der große Iwan-Bogen */
    for (const [d0, d1] of [[dA + 3, dA + 12], [dA + 13, dA + 21], [dB - 21, dB - 13], [dB - 12, dB - 3]]) for (const [h0, h1] of [[2.2, 8.6], [10.4, 16.4]]) g += `<path d="${flaeche4(d0 + 1, d1 - 1, h0, h1 - 1)}" fill="${F2}"/>`;
    const dm = (dA + dB) / 2, [ix0, iy0] = ps(dm - 6, 1.2), [ix1] = ps(dm + 6, 1.2), [, iyK] = ps(dm, 12), [ixm, iyA] = ps(dm, 16.2);
    g += `<path d="M${r(ix0)} ${r(iy0)} L${r(ix0)} ${r(iyK)} Q${r(ix0)} ${r(iyA + 1)} ${r(ixm)} ${r(iyA)} Q${r(ix1)} ${r(iyA + 1)} ${r(ix1)} ${r(iyK)} L${r(ix1)} ${r(iy0)} Z" fill="#4a1c12" stroke="#f2e6dc" stroke-width=".35"/>`;
    g += `<path d="${flaeche4(dA, dB, 1.2, 17.6)}" fill="${S.lg("fluchtlicht", [[0, "#000", 0], [1, "#000", 0.25]], 0, 0, 1, 0)}"/>`;
  }
  g += `<rect x="${r(x - w0)}" y="${r(yTop)}" width="${r(2 * w0)}" height="${r(yFuss - yTop)}" fill="${SANDSTEIN}"/>`;
  /* Zinnenbrüstung (Kanguras) */
  for (let xx = x - w0 + 0.6; xx < x + w0 - 0.4; xx += 1.6) g += `<path d="M${r(xx)} ${r(yTop)} L${r(xx)} ${r(yTop - 0.9)} Q${r(xx + 0.5)} ${r(yTop - 1.6)} ${r(xx + 1)} ${r(yTop - 0.9)} L${r(xx + 1)} ${r(yTop)} Z" fill="#a84a30"/>`;
  /* weiße Marmorbänder und zwei Reihen Nischenfelder */
  g += `<rect x="${r(x - w0)}" y="${r(yTop)}" width="${r(2 * w0)}" height=".6" fill="#f2e6dc"/><rect x="${r(x - w0)}" y="${r(y(9.6))}" width="${r(2 * w0)}" height=".5" fill="#f2e6dc"/>`;
  for (const [hu, ho] of [[2, 8.8], [10.4, 16.6]]) for (let i = 0; i < 3; i++) {
    const a = x - w0 + 1.6 + i * (2 * w0 - 3.2) / 3, b = a + (2 * w0 - 3.2) / 3 - 1.2, m = (a + b) / 2, yo = y(ho), yu = y(hu);
    g += `<rect x="${r(a)}" y="${r(yo)}" width="${r(b - a)}" height="${r(yu - yo)}" fill="none" stroke="#f2e6dc" stroke-width=".35"/>`;
    g += `<path d="M${r(a + 1)} ${r(yu)} L${r(a + 1)} ${r(yo + 2.6)} Q${r(m)} ${r(yo + 0.6)} ${r(b - 1)} ${r(yo + 2.6)} L${r(b - 1)} ${r(yu)} Z" fill="#7a2e1c"/>`;
  }
  g += `<rect x="${r(x - w0)}" y="${r(yTop)}" width="${r(2 * w0)}" height="${r(yFuss - yTop)}" fill="${S.lg("rotlicht", [[0, "#2a1020", 0.12], [0.5, "#000", 0], [1, "#ffcf9a", 0.16]], 0, 0, 1, 0)}"/>`;
  /* achteckige Ecktürme mit offenem Pavillon */
  for (const t of [-1, 1]) {
    const tx = x + t * w0, tw = 2.4 * u, yt = y(21.5);
    g += `<rect x="${r(tx - tw)}" y="${r(yt)}" width="${r(tw * 0.55)}" height="${r(yFuss - yt)}" fill="#8a3a24"/><rect x="${r(tx - tw * 0.45)}" y="${r(yt)}" width="${r(tw * 0.9)}" height="${r(yFuss - yt)}" fill="#b04e32"/><rect x="${r(tx + tw * 0.45)}" y="${r(yt)}" width="${r(tw * 0.55)}" height="${r(yFuss - yt)}" fill="${licht > 0.5 ? "#d8805a" : "#c46644"}"/>`;
    for (const h of [6, 12, 17.6]) g += `<line x1="${r(tx - tw)}" y1="${r(y(h))}" x2="${r(tx + tw)}" y2="${r(y(h))}" stroke="#f2e6dc" stroke-width=".45"/>`;
    g += `<rect x="${r(tx - tw - 0.4)}" y="${r(yt - 0.8)}" width="${r(2 * tw + 0.8)}" height=".9" fill="#efe6dd"/>`;
    /* offener Pavillon: Säulen mit dunklen Bögen */
    const yp0 = y(21.5), yp1 = y(25);
    g += `<rect x="${r(tx - tw * 0.9)}" y="${r(yp1)}" width="${r(tw * 1.8)}" height="${r(yp0 - yp1)}" fill="#5a2a1e"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(tx - tw * 0.9 + i * tw * 0.56)}" y="${r(yp1)}" width=".55" height="${r(yp0 - yp1)}" fill="#f4ece4"/>`;
    for (let i = 0; i < 3; i++) g += `<path d="M${r(tx - tw * 0.9 + i * tw * 0.56 + 0.55)} ${r(yp1 + 1)} Q${r(tx - tw * 0.9 + i * tw * 0.56 + tw * 0.28 + 0.27)} ${r(yp1 - 0.2)} ${r(tx - tw * 0.9 + (i + 1) * tw * 0.56)} ${r(yp1 + 1)} L${r(tx - tw * 0.9 + (i + 1) * tw * 0.56)} ${r(yp1)} L${r(tx - tw * 0.9 + i * tw * 0.56 + 0.55)} ${r(yp1)} Z" fill="#f4ece4"/>`;
    g += `<rect x="${r(tx - tw - 0.2)}" y="${r(y(25.6))}" width="${r(2 * tw + 0.4)}" height="${r(y(25) - y(25.6))}" fill="#f4ece4"/>`;
    g += `<path d="${zwiebel(tx, y(25.6), tw * 0.72, y(25.6) - y(29.4))}" fill="${KUPPEL}"/><line x1="${r(tx)}" y1="${r(y(29.3))}" x2="${r(tx)}" y2="${r(y(30.6))}" stroke="${GOLD}" stroke-width=".35"/>`;
  }
  return g;
};
S.teil({ anker: [48, 108], id: "moschee", de: "die Moschee", syl: "Mo-SCHEE", it: "la moschea", itSyl: "mo-SCHE-a", en: "mosque", x: 0, y: 0, kunst: rotbau(-1),
  tipp: "Links vom Taj steht eine Moschee aus rotem Sandstein. Ihre Gebetswand zeigt nach Westen, nach Mekka." });
S.teil({ anker: [375, 108], id: "gaestehaus", de: "das Gästehaus", syl: "GÄS-te-haus", it: "la foresteria", itSyl: "fo-re-ste-RI-a", en: "guest house", x: 0, y: 0, kunst: rotbau(1),
  tipp: "Das Gästehaus heißt „Jawab“, die Antwort: Es ist das Spiegelbild der Moschee." });

/* =====================================================================
   3 — DER BAUM (Schattenbäume in den Gartenvierteln, echte Größe)
   ===================================================================== */
{
  let k = "";
  const krone = (x, y, w, h) => {
    /* Stamm mit Astansatz */
    let g = `<path d="M${r(x - w * 0.06)} ${r(y)} L${r(x - w * 0.04)} ${r(y - h * 0.36)} L${r(x - w * 0.3)} ${r(y - h * 0.58)} M${r(x + w * 0.04)} ${r(y - h * 0.4)} L${r(x + w * 0.28)} ${r(y - h * 0.66)} M${r(x + w * 0.06)} ${r(y)} L${r(x + w * 0.04)} ${r(y - h * 0.36)}" stroke="#3a2e22" stroke-width="${r(w * 0.09)}" fill="none" stroke-linecap="round"/>`;
    /* gelappter Umriss mit gezacktem Rand: Bögen zwischen unregelmäßigen Punkten */
    const cx = x, cy = y - h * 0.64, RX = w * 0.95, RY = h * 0.38, N = 13, rr = [];
    for (let j = 0; j < N; j++) rr.push(0.82 + rnd() * 0.22);
    const lappen = (dx, dy, f) => { let d = ""; for (let j = 0; j <= N; j++) { const a = j / N * Math.PI * 2, q = rr[j % N] * f, px = cx + dx + Math.cos(a) * RX * q, py = cy + dy + Math.sin(a) * RY * q; if (!j) { d = `M${r(px)} ${r(py)}`; continue; } const am = (j - 0.5) / N * Math.PI * 2, qm = (rr[j % N] + rr[(j - 1) % N]) / 2 * f * 1.22; d += ` Q${r(cx + dx + Math.cos(am) * RX * qm)} ${r(cy + dy + Math.sin(am) * RY * qm)} ${r(px)} ${r(py)}`; } return d + " Z"; };
    g += `<path d="${lappen(0, 0, 1)}" fill="#22392a"/><path d="${lappen(w * 0.1, -h * 0.04, 0.78)}" fill="#36583a"/>`;
    /* Lichtsicheln auf der Ostseite (rechts oben) */
    for (const a of [-1.2, -0.6, -0.05]) { const bx = cx + Math.cos(a) * RX * 0.62, by = cy + Math.sin(a) * RY * 0.62, br = RX * 0.26; g += `<path d="M${r(bx - br * 0.2)} ${r(by - br * 0.75)} A${r(br)} ${r(br * 0.8)} 0 0 1 ${r(bx + br * 0.75)} ${r(by + br * 0.35)} A${r(br * 0.8)} ${r(br * 0.6)} 0 0 0 ${r(bx - br * 0.2)} ${r(by - br * 0.75)} Z" fill="#7a9a58"/>`; }
    /* Lücken im Laub: dunkle Einschnitte statt heller Punkte */
    for (const [a, q] of [[-2.3, 0.6], [2.5, 0.55]]) g += `<ellipse cx="${r(cx + Math.cos(a) * RX * q)}" cy="${r(cy + Math.sin(a) * RY * q)}" rx="${r(RX * 0.12)}" ry="${r(RY * 0.08)}" fill="#152618"/>`;
    return g;
  };
  /* Bäume liegen außerhalb des Taj-Bereichs (|x − 200| > 98) oder bleiben unter dem Sockel */
  const liste = [];
  for (const sd of [-1, 1]) for (const [s, d, hh] of [[60, 255, 14], [44, 230, 13], [70, 200, 15], [38, 180, 12], [56, 150, 14], [30, 128, 11], [44, 112, 13], [26, 92, 10], [34, 76, 12], [24, 62, 9], [40, 58, 13], [38.5, 200, 9.5], [47, 245, 11], [42, 222, 8]]) liste.push([sd * s, d, hh]);
  liste.sort((a, b) => b[1] - a[1]);
  for (const [s, d, hh] of liste) {
    const u = uAt(d), x = xAt(s, d), w = hh * 0.36 * u;
    if (x + w < 0 || x - w > 400) continue;
    if (Math.abs(x - 200) - w < 98) continue;
    const top = yAt(d) - hh * u;
    if (top < 126 && ((x + w > 8 && x - w < 66) || (x + w > 334 && x - w < 392))) continue;   /* Moschee und Gästehaus frei lassen */
    k += krone(Math.max(w * 1.08, Math.min(400 - w * 1.08, x)), yAt(d), w, hh * u);
  }
  /* große Schattenbäume in den vorderen Gartenvierteln (Mango, Neem), Stamm sichtbar, langer Schatten nach Westen */
  for (const sd of [-1, 1]) for (const [s, d, hh] of [[18.5, 92, 6.2], [26, 128, 7.5], [16.5, 60, 3.9]]) {
    const u = uAt(d), x = xAt(sd * s, d), w = hh * 0.42 * u;
    k += `<path d="${schattenLang(sd * s, d, hh, hh * 0.7)}" fill="#1d3320" opacity=".28" pointer-events="none"/>`;
    k += krone(x, yAt(d), w, hh * u);
  }
  S.baumBild = k;
}

/* =====================================================================
   4 — DER SOCKEL, 5 — DER TAJ MAHAL (Lupe), 6 — DAS MINARETT
   ===================================================================== */
S.teil({ anker: [206, 134], id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il basamento", itSyl: "ba-sa-MEN-to", en: "plinth", x: 0, y: 0, kunst: `<use href="#${S.id("sockelbild")}"/>` + besucher,
  tipp: "Der Taj steht auf einem fast 7 Meter hohen Sockel aus weißem Marmor. Die Menschen davor sind winzig." });
const tajUnter = [];
{
  const h0 = T.h0, yTam = yK(KUP.hT), rbU = KUP.rT * uK, hhU = KUP.hh * uK;
  tajUnter.push({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: CX, y: r(yTam), kunst: flaeche(-1.3 * rbU, -hhU * 0.8, 2.6 * rbU, hhU * 0.8),
    /* UNSICHER (ohne Websuche): äußere Kuppel rund 35 m hoch ohne Tambour */
    tipp: "Die Zwiebelkuppel ist rund 35 Meter hoch – so hoch wie ein Haus mit 12 Stockwerken." });
  tajUnter.push({ id: "spitze", de: "die Spitze", syl: "SPIT-ze", it: "il pinnacolo", itSyl: "pin-NA-co-lo", en: "finial", x: CX, y: r(yTam - hhU * 0.8), kunst: flaeche(-3, -(yTam - hhU * 0.8 - yK(73.8)), 6, yTam - hhU * 0.8 - yK(73.8)),
    tipp: "Oben sitzen Lotusblätter, darauf eine Vase und ein Halbmond. Früher war die Spitze aus Gold." });
  tajUnter.push({ id: "pavillon", de: "der Pavillon", syl: "PA-vil-lon", it: "il padiglione", itSyl: "pa-di-GLIO-ne", en: "pavilion", x: r(xAt(-15.5, 331)), y: r(yAt(331, 37)), kunst: flaeche(-7, -(yAt(331, 37) - yAt(331, 54)), 14, yAt(331, 37) - yAt(331, 54)),
    tipp: "Vier kleine Kuppelpavillons stehen um die große Kuppel. Auf Hindi heißen sie „Chattri“ (Schirm)." });
  const yK0 = yB(h0 + portal.hKampfer), yApex = yB(h0 + portal.hBogen), bw = portal.bogen * uB;
  tajUnter.push({ id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: CX, y: r(yK0), kunst: flaeche(-bw, -(yK0 - yApex), 2 * bw, yK0 - yApex + 3),
    tipp: "Das große Tor heißt „Pishtaq“. Es ist 33 Meter hoch – so hoch wie ein Haus mit 11 Stockwerken." });
  /* Inschrift: Rahmen aus drei Streifen um das ganze Band */
  const xl = xB(-portal.s), xr = xB(portal.s), yT = yB(h0 + 33), yU = yB(h0), ib = 3;
  tajUnter.push({ id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: r(xl), y: r(yT + 30), kunst: flaeche(0, -30, ib, yU - yT - 4) + flaeche(xr - xl - ib, -30, ib, yU - yT - 4) + flaeche(0, -30, xr - xl, ib),
    tipp: "Die Buchstaben sind aus schwarzem Marmor. Oben sind sie größer – von unten wirken alle gleich groß." });
  tajUnter.push({ id: "einlegearbeit", de: "die Einlegearbeit", syl: "EIN-le-ge-ar-beit", it: "l'intarsio", itSyl: "in-TAR-sio", en: "inlay", x: r(CX + bw * 0.72), y: r(yApex + 4.4), kunst: flaeche(-3.6, -4.2, 7.2, 5.4),
    tipp: "Die Blumen sind aus Halbedelsteinen wie Jaspis und Lapislazuli. Man hat sie in den Marmor eingelegt." });
  S.teil({ anker: [163, 104], id: "taj_mahal", de: "der Taj Mahal", syl: "taj ma-HAL", it: "il Taj Mahal", itSyl: "taj ma-HAL", en: "Taj Mahal", x: 0, y: 0, kunst: `<use href="#${S.id("baubild")}"/>`,
    zoom: { x: 140, y: 14, w: 120, h: 80 }, unter: tajUnter,
    tipp: "Der Großmogul Shah Jahan ließ den Taj Mahal (deutsch auch „Tadsch Mahal“) als Grabmal für seine verstorbene Frau Mumtaz Mahal bauen – über 20 Jahre lang." });
}
S.teil({ anker: [xAt(-44.5, 302.5), yAt(302.5, 30)], id: "minarett", de: "das Minarett", syl: "mi-na-RETT", it: "il minareto", itSyl: "mi-na-RE-to", en: "minaret", x: 0, y: 0, kunst: `<use href="#${S.id("minarettbild")}"/>`,
  tipp: "Die vier Minarette neigen sich ein wenig nach außen. Bei einem Erdbeben würden sie nicht auf den Taj fallen." });

/* =====================================================================
   7 — DER RASEN, 8 — DER WEG, 9 — DIE BLUME (Beete mit Hecke),
   10 — DAS WASSERBECKEN, 11 — DIE SPIEGELUNG, 12 — DER SPRINGBRUNNEN,
   13 — DIE ZYPRESSE
   ===================================================================== */
const KANAL = 2.0, WEG = [2.35, 6.4], BEET = [6.4, 8.0], ZY = 8.6;
const D_NAH = 14, D_FERN = 291, D_BECKEN = [139, 163], D_UNTEN = E * F / (260 - HOR);
const band = (s0, s1, d0, d1) => P([[xAt(s0, d1), yAt(d1)], [xAt(s1, d1), yAt(d1)], [xAt(s1, d0), yAt(d0)], [xAt(s0, d0), yAt(d0)]]);
/* Schatten der Sonne aus Osten: lange Bänder nach links (Westen), Länge 2,2 × Höhe */
const schattenWest = (s, d, hoehe, breite) => { const u = uAt(d), y = yAt(d); return P([[xAt(s + breite / 2, d), y - 0.25 * u * breite], [xAt(s - 2.2 * hoehe, d), y - 0.1 * u], [xAt(s - 2.2 * hoehe, d), y + 0.25 * u], [xAt(s + breite / 2, d), y + 0.3 * u * breite]]); };
{
  let k = "";
  for (const sd of [-1, 1]) {
    const pts = [[xAt(sd * 8.2, D_FERN), yAt(D_FERN)], [sd < 0 ? 0 : 400, yAt(D_FERN)], [sd < 0 ? 0 : 400, 260], [xAt(sd * 8.2, D_UNTEN), 260]];
    k += `<path d="${P(pts)}" fill="${S.lg("rasen", [[0, "#8aa06a"], [0.35, "#6a8d4c"], [1, "#4f7a3a"]])}"/>`;
    for (const d of [270, 230, 195, 165, 140, 118, 100, 85, 72, 61, 52, 44, 37, 31, 26, 22, 19, 16]) k += `<path d="M${r(Math.max(0, Math.min(400, xAt(sd * 8.2, d))))} ${r(yAt(d))} L${sd < 0 ? 0 : 400} ${r(yAt(d))}" stroke="${d % 2 ? "#7aa05a" : "#5a8040"}" stroke-width="${r(Math.min(2.4, 26 / d))}" opacity=".3"/>`;
  }
  k += `<rect x="0" y="${r(yAt(151))}" width="400" height="${r(yAt(149) - yAt(151))}" fill="#9fb6c6"/>`;
  S.teil({ anker: [390, 170], id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k,
    tipp: "Der Rasen wird jeden Tag gegossen – im heißen Agra bleibt er so grün." });
}
{
  /* Wege aus rotem Sandstein mit hellen Fugen, weiße Marmorkante zum Kanal */
  let k = "";
  for (const sd of [-1, 1]) {
    const [a, b] = sd < 0 ? [-WEG[1], -WEG[0]] : [WEG[0], WEG[1]];
    k += `<path d="${band(a, b, D_UNTEN, D_FERN)}" fill="${S.lg("weg", [[0, "#c9866a"], [0.5, "#b36a4c"], [1, "#a0583c"]])}"/>`;
    for (const s of [a + 1, a + 2, a + 3]) { let x2 = xAt(s, D_UNTEN), y2 = 260; const x1 = xAt(s, D_FERN), y1 = yAt(D_FERN); for (const gr of [0, 400]) if ((x2 - gr) * (x1 - gr) < 0) { y2 = y1 + (y2 - y1) * (gr - x1) / (x2 - x1); x2 = gr; } k += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#d9ae96" stroke-width=".22" opacity=".55"/>`; }
    for (let d = D_UNTEN; d < 290; d *= 1.09) k += `<line x1="${r(Math.max(0, xAt(a, d)))}" y1="${r(yAt(d))}" x2="${r(Math.min(400, xAt(b, d)))}" y2="${r(yAt(d))}" stroke="#d9ae96" stroke-width="${r(Math.min(0.45, 6 / d))}" opacity=".5"/>`;
    const kante = sd < 0 ? -KANAL - 0.35 : KANAL;
    k += `<path d="${band(kante, kante + 0.35, D_UNTEN, D_FERN)}" fill="#f0e8e0"/>`;
  }
  /* Wege der Gartenviertel (Charbagh): Längswege und Querwege aus Sandstein, etwas erhöht */
  for (const sd of [-1, 1]) {
    const [a, b] = sd < 0 ? [-48, -44] : [44, 48];
    k += `<path d="${band(a, b, D_UNTEN, D_FERN)}" fill="#a8664a"/><path d="${band(a - 0.25, a, D_UNTEN, D_FERN)}" fill="#e6c7b4"/><path d="${band(b, b + 0.25, D_UNTEN, D_FERN)}" fill="#e6c7b4"/>`;
    for (const [d0, d1] of [[66, 74], [222, 228]]) k += `<path d="${P([[xAt(sd * 8.3, d1), yAt(d1, 0.2)], [sd < 0 ? 0 : 400, yAt(d1, 0.2)], [sd < 0 ? 0 : 400, yAt(d0, 0.2)], [xAt(sd * 8.3, d0), yAt(d0, 0.2)]])}" fill="#b0694a"/><path d="M${r(xAt(sd * 8.3, d0))} ${r(yAt(d0, 0.2))} L${sd < 0 ? 0 : 400} ${r(yAt(d0, 0.2))}" stroke="#e6c7b4" stroke-width=".45"/><path d="M${r(xAt(sd * 8.3, d1))} ${r(yAt(d1, 0.2))} L${sd < 0 ? 0 : 400} ${r(yAt(d1, 0.2))}" stroke="#2f5a2e" stroke-width=".6"/>`;
  }
  S.teil({ anker: [154, 226], id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Die Wege liegen höher als die Beete – so sah man über die Blumen wie über einen Teppich." });
}
{
  /* abgesenkte Beete an den Wegen: Sandsteinkante, Studentenblumen und Rosen, dahinter eine niedrige Hecke */
  let k = "";
  for (const sd of [-1, 1]) {
    const [a, b] = sd < 0 ? [-BEET[1], -BEET[0]] : [BEET[0], BEET[1]];
    k += `<path d="${band(a, b, D_UNTEN, D_FERN)}" fill="#5a4630"/>`;
    /* sichtbare Stufe: helle Sandsteinkante am Weg, darunter ein dunkler Erdstreifen im tieferen Beet */
    const kante = sd < 0 ? -BEET[0] - 0.2 : BEET[0];
    k += `<path d="${band(kante, kante + 0.2, D_UNTEN, D_FERN)}" fill="#e8b89a"/>`;
    k += `<path d="${band(sd < 0 ? kante - 0.16 : kante + 0.2, sd < 0 ? kante : kante + 0.36, D_UNTEN, D_FERN)}" fill="#2a1e12" opacity=".75"/>`;
    /* Blüten: nah groß, fern als Farbband */
    k += `<path d="${band(a + 0.15, b - 0.45, 120, D_FERN)}" fill="#d98a2a" opacity=".85"/>`;
    for (let d = D_UNTEN; d < 120; d *= 1.045) {
      const u = uAt(d), n = 3;
      for (let i = 0; i < n; i++) {
        const s = a + 0.25 + (b - a - 0.7) * (i + 0.5) / n + (rnd() - 0.5) * 0.3, x = xAt(s, d), y = yAt(d, 0.25);
        if (x < -2 || x > 402) continue;
        const rr = Math.max(0.35, 0.13 * u), art = rnd();
        if (x - rr * 1.6 < 0 || x + rr * 1.6 > 400) continue;
        if (rr < 1) { const c = art < 0.5 ? "#f29a1c" : art < 0.72 ? "#ffd23a" : art < 0.9 ? "#c8283a" : "#f08ab0"; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${c}"/>`; continue; }
        if (rr > 1.4) k += `<path d="M${r(x)} ${r(y + rr * 0.5)} l${r(-rr * 0.9)} ${r(rr * 1.1)} M${r(x)} ${r(y + rr * 0.5)} l${r(rr * 0.9)} ${r(rr * 1.1)}" stroke="#3f6a2a" stroke-width="${r(rr * 0.3)}"/><ellipse cx="${r(x - rr * 0.9)}" cy="${r(y + rr * 1.2)}" rx="${r(rr * 0.5)}" ry="${r(rr * 0.22)}" fill="#4a7a32"/>`;
        k += `<use href="#${S.id(art < 0.72 ? "tagetes" : "rose")}" transform="translate(${r(x)} ${r(y)}) scale(${r(rr * (art < 0.72 ? 1 : 0.9))})"${art >= 0.5 && art < 0.72 ? ` style="filter:hue-rotate(18deg) brightness(1.15)"` : ""}/>`;
      }
    }
    /* niedrige Hecke (Buchs), 0,6 m */
    const ha = sd < 0 ? -BEET[1] : BEET[1] - 0.35, hb = ha + 0.35;
    k += `<path d="${P([[xAt(ha, D_FERN), yAt(D_FERN, 0.6)], [xAt(hb, D_FERN), yAt(D_FERN, 0.6)], [xAt(hb, D_UNTEN), yAt(D_UNTEN, 0.6)], [xAt(ha, D_UNTEN), yAt(D_UNTEN, 0.6)]])}" fill="#2f5a2e"/>`;
    k += `<path d="${P([[xAt(ha, D_FERN), yAt(D_FERN, 0.6)], [xAt(ha, D_FERN), yAt(D_FERN)], [xAt(ha, D_UNTEN), yAt(D_UNTEN)], [xAt(ha, D_UNTEN), yAt(D_UNTEN, 0.6)]])}" fill="${sd < 0 ? "#3d6a36" : "#24462a"}"/>`;
  }
  /* abgesenkte Beete in den Vierteln (Parterres) mit Sandsteinrand und Blütenreihen */
  for (const sd of [-1, 1]) for (const [s0, s1, d0, d1] of [[14, 38, 92, 118], [14, 38, 172, 212], [52, 76, 172, 212]]) {
    const a = sd * s0, b = sd * s1;
    /* weiche Farbbänder mit unregelmäßigen Tupfen, grüne Heckenkante, mit der Entfernung blasser */
    const fern = Math.min(1, (d0 - 80) / 140);
    k += `<path d="${P([[xAt(a, d1), yAt(d1)], [xAt(b, d1), yAt(d1)], [xAt(b, d0), yAt(d0)], [xAt(a, d0), yAt(d0)]])}" fill="#56703a" stroke="#2f5a2e" stroke-width=".7"/>`;
    for (let d = d0 + 3; d < d1 - 1; d += (d1 - d0) / 4) {
      const c = ["#e8901e", "#f2b42a", "#e07a1a", "#c8283a"][Math.floor(rnd() * 4)], w = Math.max(0.6, 0.55 * uAt(d)), dash = [0.3, 0.7, 0.5, 0.2, 0.9, 0.4].map((v) => r(v * uAt(d) * (0.8 + rnd() * 0.4))).join(" ");
      k += `<path d="M${r(Math.max(0, Math.min(400, xAt(a + sd * 1.2, d))))} ${r(yAt(d, 0.2))} L${r(Math.max(0, Math.min(400, xAt(b - sd * 1.2, d))))} ${r(yAt(d, 0.2))}" stroke="${c}" stroke-width="${r(w)}" stroke-dasharray="${dash}" stroke-linecap="round" opacity="${r(0.85 - fern * 0.35)}"/>`;
    }
  }
  S.teil({ anker: [63, 191], id: "blume", de: "die Blume", syl: "BLU-me", it: "il fiore", itSyl: "FIO-re", en: "flower", x: 0, y: 0, kunst: k,
    tipp: "In den Beeten blühen Studentenblumen und Rosen. Hinter ihnen wächst eine niedrige Hecke." });
}
/* der Baum nach Rasen, Weg und Beeten: die Bäume stehen davor */
S.teil({ anker: [16, 104], id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: S.baumBild + `<path d="M0 ${HOR - 18} H112 V${HOR + 8} H0 Z M288 ${HOR - 18} H400 V${HOR + 8} H288 Z" fill="${S.lg("gartendunst", [[0, "#f4e4d4", 0], [0.6, "#f4e4d4", 0.4], [1, "#f4e4d4", 0.15]])}" pointer-events="none"/>`,
  tipp: "Früher wuchsen in den vier Gartenvierteln Obstbäume und Blumen. Heute sind dort vor allem Rasen und große Schattenbäume." });
/* Wasserfläche als Schnittmaske für das Spiegelbild */
const WASSER = [band(-KANAL, KANAL, D_NAH, D_BECKEN[0]), band(-KANAL, KANAL, D_BECKEN[1], D_FERN)].join(" ");
S.def(`<clipPath id="${S.id("wasser")}"><path d="${WASSER}"/></clipPath>`);
{
  /* offenes Wasser: Himmel gespiegelt, etwas dunkler und grünlich */
  let k = `<path d="${WASSER}" fill="${S.lg("wasserhimmel", [[0, "#d9cbbc"], [0.25, "#9fb0b4"], [1, "#5f8088"]])}"/>`;
  for (let d = 18; d < 138; d *= 1.18) k += `<ellipse cx="${CX}" cy="${r(yAt(d, -0.3))}" rx="${r(Math.max(0.3, 0.12 * uAt(d)))}" ry="${r(Math.max(0.15, 0.04 * uAt(d)))}" fill="#6a5a3a" opacity=".7"/>`;
  S.teil({ anker: [176, 243], id: "wasserbecken", de: "das Wasserbecken", syl: "WAS-ser-be-cken", it: "la vasca", itSyl: "VA-sca", en: "pool", x: 0, y: 0, kunst: k,
    tipp: "Das lange Wasserbecken teilt den Garten. Morgens sind seine Düsen aus – so ist das Wasser ganz still." });
}
{
  /* das Spiegelbild: nur die gespiegelten Bauten sind „die Spiegelung“, dunkler, grünlich, mit feinen Wellen */
  let k = `<g clip-path="url(#${S.id("wasser")})"><g transform="translate(0 ${SPIEGEL}) scale(1 -1)" opacity=".62"><use href="#${S.id("sockelbild")}"/><use href="#${S.id("minarettbild")}"/><use href="#${S.id("baubild")}"/></g>`;
  k += `<g pointer-events="none"><rect x="0" y="135" width="400" height="125" fill="${S.lg("spiegeltiefe", [[0, "#6f8f8a", 0.18], [1, "#2f4f52", 0.22]])}"/>`;
  for (let d = 16; d < 130; d *= 1.1) { const y = yAt(d, -0.3), w = KANAL * uAt(d); k += `<line x1="${r(CX - w * 0.95)}" y1="${r(y)}" x2="${r(CX - w * 0.25)}" y2="${r(y)}" stroke="#eef4f4" stroke-width="${r(Math.min(0.45, 6 / d))}" opacity=".3"/><line x1="${r(CX + w * 0.05)}" y1="${r(y + 0.7)}" x2="${r(CX + w * 0.8)}" y2="${r(y + 0.7)}" stroke="#eef4f4" stroke-width="${r(Math.min(0.4, 5 / d))}" opacity=".22"/>`; }
  k += `</g></g>`;
  S.teil({ anker: [200, 200], id: "spiegelung", de: "die Spiegelung", syl: "SPIE-ge-lung", it: "il riflesso", itSyl: "ri-FLES-so", en: "reflection", x: 0, y: 0, kunst: k,
    tipp: "Im stillen Wasser sieht man den Taj Mahal noch einmal – auf dem Kopf." });
}
/* das erhöhte Marmorbecken in der Mitte: Lotus-Düsen sprudeln nur niedrig */
const BECKEN_OBEN = P([[xAt(-12, D_BECKEN[1]), yAt(D_BECKEN[1], 1.2)], [xAt(12, D_BECKEN[1]), yAt(D_BECKEN[1], 1.2)], [xAt(12, D_BECKEN[0]), yAt(D_BECKEN[0], 1.2)], [xAt(12, D_BECKEN[0]), yAt(D_BECKEN[0])], [xAt(-12, D_BECKEN[0]), yAt(D_BECKEN[0])], [xAt(-12, D_BECKEN[0]), yAt(D_BECKEN[0], 1.2)]]);
{
  const [d0, d1] = D_BECKEN, sB = 12;
  let k = `<path d="${P([[xAt(-sB, d0), yAt(d0, 1.2)], [xAt(sB, d0), yAt(d0, 1.2)], [xAt(sB, d0), yAt(d0)], [xAt(-sB, d0), yAt(d0)]])}" fill="${MARMOR}"/>`;
  k += `<path d="${P([[xAt(-sB, d1), yAt(d1, 1.2)], [xAt(sB, d1), yAt(d1, 1.2)], [xAt(sB, d0), yAt(d0, 1.2)], [xAt(-sB, d0), yAt(d0, 1.2)]])}" fill="#e9e1da"/>`;
  k += `<path d="${P([[xAt(-sB, d0), yAt(d0, 1.2)], [xAt(sB, d0), yAt(d0, 1.2)], [xAt(sB, d0), yAt(d0, 1.05)], [xAt(-sB, d0), yAt(d0, 1.05)]])}" fill="#fffaf2"/><path d="${P([[xAt(-sB, d0), yAt(d0, 1.0)], [xAt(sB, d0), yAt(d0, 1.0)], [xAt(sB, d0), yAt(d0, 0.9)], [xAt(-sB, d0), yAt(d0, 0.9)]])}" fill="#a99ea6"/>`;
  k += `<path d="${P([[xAt(-9.5, d0 + 2), yAt(d0 + 2, 1.15)], [xAt(9.5, d0 + 2), yAt(d0 + 2, 1.15)], [xAt(9.5, d1 - 2), yAt(d1 - 2, 1.15)], [xAt(-9.5, d1 - 2), yAt(d1 - 2, 1.15)]])}" fill="${S.lg("beckenwasser", [[0, "#2f5a62"], [1, "#4a7a80"]])}"/>`;
  k += `<path d="M${r(xAt(-9.5, d0 + 2))} ${r(yAt(d0 + 2, 1.15))} L${r(xAt(9.5, d0 + 2))} ${r(yAt(d0 + 2, 1.15))}" stroke="#d9e8ea" stroke-width=".25" opacity=".7"/>`;
  for (const s of [-10, -6, -2, 2, 6, 10]) k += `<rect x="${r(xAt(s, d0) - 0.3)}" y="${r(yAt(d0, 1.2))}" width=".6" height="${r(yAt(d0) - yAt(d0, 1.2))}" fill="#d9cfc8"/>`;
  /* Marmorbank (die „Diana-Bank“) vorn */
  { const db = d0 - 1.5, yS = yAt(db, 1.65), yU = yAt(db, 0); k += `<rect x="${r(xAt(-2.6, db))}" y="${r(yS)}" width="${r(5.2 * uAt(db))}" height=".7" fill="#fffaf2" stroke="#a99ea6" stroke-width=".15"/><rect x="${r(xAt(-2.2, db))}" y="${r(yS + 0.7)}" width="${r(0.5 * uAt(db))}" height="${r(yU - yS - 0.7)}" fill="#d8cfd2"/><rect x="${r(xAt(1.7, db))}" y="${r(yS + 0.7)}" width="${r(0.5 * uAt(db))}" height="${r(yU - yS - 0.7)}" fill="#efe2d8"/><path d="M${r(xAt(-2.6, db))} ${r(yU + 0.2)} L${r(xAt(-6, db + 3))} ${r(yU + 0.1)}" stroke="#1d3320" stroke-width=".5" opacity=".3"/>`; }
  /* fünf Lotusdüsen: kleine Sprudel mit Sprühkrone, weit unter der Türhöhe */
  for (const [s, dd] of [[0, 151], [-3, 147], [3, 147], [-3, 155], [3, 155]]) {
    const x = xAt(s, dd), y0 = yAt(dd, 1.1), y1 = yAt(dd, 1.65);
    k += `<path d="M${r(x - 0.5)} ${r(y0)} Q${r(x)} ${r(y1 - 0.4)} ${r(x + 0.5)} ${r(y0)}" fill="#f4f8fa" opacity=".85"/>`;
    for (const dx of [-0.8, 0, 0.8]) k += `<circle cx="${r(x + dx)}" cy="${r(y1 + 0.2)}" r=".22" fill="#fff" opacity=".8"/>`;
  }
  k += `<path d="${P([[xAt(sB, d0), yAt(d0, 1.2)], [xAt(sB, d1), yAt(d1, 1.2)], [xAt(sB, d1), yAt(d1)], [xAt(sB, d0), yAt(d0)]])}" fill="${OST}" opacity=".6"/>`;
  S.teil({ anker: [178, 146], id: "springbrunnen", de: "der Springbrunnen", syl: "SPRING-brun-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 0, y: 0, kunst: k,
    tipp: "In der Mitte des Gartens liegt ein erhöhtes Marmorbecken. Hier sprudeln Düsen in Form von Lotusblüten." });
}
{
  /* Zypressen: zwei Reihen hinter den Hecken; Schatten lang nach links. Ferne Zypressen hinter dem Becken werden an seiner Kante abgeschnitten. */
  let nah = "", fern = "", sch = "";
  const zyp = (x, y, w, h) => {
    const lean = w * 0.25 * (rnd() - 0.5);
    let l = `M${r(x - w * 0.55)} ${r(y)}`, rr = "";
    for (let i = 1; i <= 8; i++) { const t = i / 8, bx = Math.sin(Math.PI * Math.pow(1 - t, 0.85) * 0.5) * w * (0.9 + 0.12 * Math.sin(i * 2.3)); l += ` L${r(x - bx + lean * t)} ${r(y - h * t)}`; }
    for (let i = 8; i >= 0; i--) { const t = i / 8, bx = Math.sin(Math.PI * Math.pow(1 - t, 0.85) * 0.5) * w * (0.92 + 0.1 * Math.cos(i * 1.7)); rr += ` L${r(x + bx + lean * t)} ${r(y - h * t + (i === 8 ? h * 0.02 * rnd() : 0))}`; }
    let g = `<path d="${l}${rr} Z" fill="${ZYPRESSE}"/>`;
    if (h > 25) for (let i = 0; i < 6; i++) { const t = 0.12 + i * 0.13, bx = x + w * (0.3 - rnd() * 0.6); g += `<path d="M${r(bx)} ${r(y - h * t)} q${r(w * 0.12)} ${r(-h * 0.06)} ${r(w * 0.02)} ${r(-h * 0.12)}" stroke="#14281a" stroke-width="${r(w * 0.12)}" fill="none" opacity=".4" stroke-linecap="round"/>`; }
    return g + `<path d="M${r(x + w * 0.35)} ${r(y - h * 0.1)} Q${r(x + w * 0.72)} ${r(y - h * 0.45)} ${r(x + w * 0.12)} ${r(y - h * 0.9)}" stroke="#c9d88a" stroke-width="${r(Math.max(0.2, w * 0.22))}" fill="none" opacity=".35"/>`;
  };
  const tiefen = [];
  for (let d = 38; d < 286; d *= 1.16) if (d < D_BECKEN[0] - 5 || d > D_BECKEN[1] + 5) tiefen.push(d);
  for (const d of tiefen.reverse()) {
    for (const sd of [-1, 1]) {
      /* kleine Unterschiede in Höhe und Neigung (±5 %) */
      const hz = (d < 90 ? 6.4 : 5.6) * (0.95 + rnd() * 0.1), u = uAt(d), y = yAt(d), w = 0.62 * u * (0.95 + rnd() * 0.1), h = hz * u;
      const x = xAt(sd * ZY, d);
      sch += `<path d="${schattenLang(sd * ZY + 0.3, d, hz, 3.0)}" fill="#1d3320"/>`;
      if (d > D_BECKEN[1]) fern += zyp(x, y, w, h); else nah += zyp(x, y, w, h);
    }
  }
  /* Maske: alles außer dem Marmorbecken (gerade Regel: evenodd) */
  S.def(`<clipPath id="${S.id("ohnebecken")}"><path clip-rule="evenodd" d="M-10 -10 H410 V270 H-10 Z ${BECKEN_OBEN}"/></clipPath>`);
  const k = `<g opacity=".34" pointer-events="none">${sch}</g><g clip-path="url(#${S.id("ohnebecken")})">${fern}</g>${nah}`;
  S.teil({ anker: [xAt(-ZY, 44), yAt(44, 3.6)], id: "zypresse", de: "die Zypresse", syl: "zy-PRES-se", it: "il cipresso", itSyl: "ci-PRES-so", en: "cypress", x: 0, y: 0, kunst: k,
    tipp: "Zypressen bleiben immer grün. In persischen Gärten stehen sie für das ewige Leben." });
}

/* =====================================================================
   14 — DER PFAU (links auf dem Rasen)
   ===================================================================== */
{
  const d = 30, u = uAt(d), x = xAt(-8.95, d), y = yAt(d);
  const m = (v) => r(v * u);
  /* Schatten: liegt an den Füßen an und zieht lang nach links (Westen) */
  let k = `<path d="${schattenLang(-8.95 + 0.15, d, 1.2, 0.45, "figur")}" fill="#1d3320" opacity=".34" transform="translate(${r(-x)} ${r(-y)})"/>`;
  k += `<ellipse cx="${m(-0.7)}" cy="${m(0.01)}" rx="${m(0.95)}" ry="${m(0.05)}" fill="#1d3320" opacity=".3"/>`;
  /* Schleppe: einzelne lange Federn, nach hinten aufgefächert und schmaler */
  const sl = `M${m(0.0)} ${m(-0.42)} Q${m(-0.6)} ${m(-0.56)} ${m(-1.5)} ${m(-0.2)} Q${m(-1.72)} ${m(-0.1)} ${m(-1.58)} ${m(-0.01)} Q${m(-0.8)} ${m(-0.02)} ${m(0.02)} ${m(-0.22)} Z`;
  k += `<path d="${sl}" fill="${S.lg("schleppe", [[0, "#4a6a26"], [0.5, "#2a5a3c"], [1, "#1f4630"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 16; i++) { const t = i / 15, ex = -1.45 - 0.12 * Math.sin(i * 1.7), ey = -0.42 + 0.4 * t; k += `<path d="M${m(-0.02)} ${m(-0.42 + t * 0.2)} Q${m(-0.7)} ${m(-0.5 + t * 0.42)} ${m(ex)} ${m(Math.min(-0.02, ey + (0.2 - t * 0.1)))}" stroke="${i % 2 ? "#7aa040" : "#5a8a3a"}" stroke-width=".22" fill="none" opacity=".85"/>`; }
  /* drei versetzte Reihen Augenfedern mit Bronzering */
  for (const [row, n, t0] of [[0.22, 6, 0.12], [0.52, 6, 0.2], [0.8, 5, 0.3]]) for (let i = 0; i < n; i++) {
    const t = t0 + i * (0.86 - t0) / (n - 1), ex = -0.08 - t * 1.4, ey = -0.44 + t * 0.3 + row * 0.24 * (1 - t * 0.5), sc = 1.15 - t * 0.5;
    k += `<ellipse cx="${m(ex)}" cy="${m(ey)}" rx="${m(0.066 * sc)}" ry="${m(0.05 * sc)}" fill="#b08a2a"/><ellipse cx="${m(ex)}" cy="${m(ey)}" rx="${m(0.048 * sc)}" ry="${m(0.036 * sc)}" fill="#2f8a5a"/><ellipse cx="${m(ex + 0.006)}" cy="${m(ey)}" rx="${m(0.026 * sc)}" ry="${m(0.022 * sc)}" fill="#1a2f7a"/>`;
  }
  /* Beine: Fersengelenk nach hinten, Füße mit Zehen, stehen auf dem Boden */
  for (const dx of [0, 0.1]) k += `<path d="M${m(0.14 + dx)} ${m(-0.3)} L${m(0.07 + dx)} ${m(-0.16)} L${m(0.12 + dx)} ${m(0)} M${m(0.12 + dx)} ${m(0)} l${m(0.07)} ${m(0.005)} M${m(0.12 + dx)} ${m(0)} l${m(0.05)} ${m(0.025)} M${m(0.12 + dx)} ${m(0)} l${m(-0.05)} ${m(0.005)}" stroke="#8a7a68" stroke-width=".4" fill="none" stroke-linecap="round"/>`;
  /* Körper: kräftige blaue Brust, grün-bronzener geschuppter Rücken, braune Schwungfedern */
  k += `<path d="M${m(-0.14)} ${m(-0.42)} Q${m(-0.1)} ${m(-0.62)} ${m(0.14)} ${m(-0.62)} Q${m(0.4)} ${m(-0.58)} ${m(0.38)} ${m(-0.4)} Q${m(0.3)} ${m(-0.26)} ${m(0.12)} ${m(-0.27)} Q${m(-0.06)} ${m(-0.28)} ${m(-0.14)} ${m(-0.42)} Z" fill="${S.lg("pfau", [[0, "#1a3f9a"], [1, "#2a6ac0"]])}"/>`;
  k += `<path d="M${m(-0.13)} ${m(-0.45)} Q${m(-0.05)} ${m(-0.6)} ${m(0.12)} ${m(-0.58)} Q${m(0.04)} ${m(-0.48)} ${m(-0.13)} ${m(-0.45)} Z" fill="#5a7a3a"/>`;
  for (const [a, b] of [[-0.08, -0.5], [-0.01, -0.53], [0.06, -0.55], [-0.04, -0.47], [0.03, -0.5]]) k += `<path d="M${m(a - 0.03)} ${m(b)} q${m(0.03)} ${m(0.03)} ${m(0.06)} 0" stroke="#c8a24a" stroke-width=".18" fill="none"/>`;
  k += `<path d="M${m(-0.1)} ${m(-0.42)} Q${m(0.06)} ${m(-0.48)} ${m(0.14)} ${m(-0.37)} Q${m(0.02)} ${m(-0.33)} ${m(-0.12)} ${m(-0.37)} Z" fill="#9a6a3a"/><path d="M${m(-0.06)} ${m(-0.4)} l${m(0.14)} ${m(0.02)}" stroke="#6a4420" stroke-width=".25"/>`;
  k += `<path d="M${m(0.3)} ${m(-0.52)} Q${m(0.38)} ${m(-0.45)} ${m(0.34)} ${m(-0.34)}" stroke="#6aa0e0" stroke-width=".3" fill="none" opacity=".7"/>`;
  /* S-Hals, Kopf mit weißem Augenstreif, Federkrone als Fächer */
  k += `<path d="M${m(0.26)} ${m(-0.54)} Q${m(0.36)} ${m(-0.68)} ${m(0.28)} ${m(-0.8)} Q${m(0.22)} ${m(-0.92)} ${m(0.3)} ${m(-1.0)}" stroke="#1f5ab8" stroke-width="${m(0.1)}" stroke-linecap="round" fill="none"/>`;
  k += `<ellipse cx="${m(0.32)}" cy="${m(-1.02)}" rx="${m(0.06)}" ry="${m(0.05)}" fill="#1f5ab8"/><path d="M${m(0.31)} ${m(-1.03)} l${m(0.05)} 0" stroke="#fff" stroke-width=".3"/><path d="M${m(0.37)} ${m(-1.02)} l${m(0.06)} ${m(0.015)}" stroke="#bfae8a" stroke-width=".35"/>`;
  for (let i = -2; i <= 2; i++) k += `<line x1="${m(0.31)}" y1="${m(-1.06)}" x2="${m(0.31 + i * 0.03)}" y2="${m(-1.2)}" stroke="#1f5ab8" stroke-width=".15"/><circle cx="${m(0.31 + i * 0.03)}" cy="${m(-1.21)}" r=".28" fill="#2f7ac0"/>`;
  S.teil({ id: "pfau", de: "der Pfau", syl: "PFAU", it: "il pavone", itSyl: "pa-VO-ne", en: "peacock", x, y, steht: true, kunst: `<g transform="translate(${r(x)} ${r(y)})">${k}</g>`.replace(`<g transform="translate(${r(x)} ${r(y)})">`, "<g>") + flaeche(-1.7 * u, -1.25 * u, 2.2 * u, 1.3 * u),
    tipp: "Der Pfau ist der Nationalvogel Indiens. Das Männchen hat die lange, bunte Schleppe." });
}

/* =====================================================================
   15 — DER SARI (Besucherin posiert), 16 — DER FOTOGRAF, 17 — DIE KAMERA
   ===================================================================== */
{
  /* Besucherin im Sari: steht mit dem Rücken zum Taj und schaut zum Fotografen (rechts vorn) */
  const d = 27, u = uAt(d), x = xAt(3.6, d), y = yAt(d);
  const m = B.mensch({ id: "ind_sari", geschlecht: "w", pose: "kontrapost", blick: 42, frisur: "zopf", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "rock", farbe: "orange" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 1.6 * u);
  const p = (n) => { const q = m.z.punkte[n]; return [q[0] * m.k, q[1] * m.k]; };
  const [sLx, sLy] = p("schulterL"), [hLx, hLy] = p("huefteL"), [hRx, hRy] = p("huefteR"), [kLx] = p("knoechelL"), [kRx] = p("knoechelR"), [tLx, tLy] = p("tailleL"), [tRx, tRy] = p("tailleR"), [bx, by] = p("brust");
  const rx0 = Math.min(hLx, hRx) - 0.7, rx1 = Math.max(hLx, hRx) + 0.7, ry0 = Math.min(tLy, tRy) - 0.2, fl = Math.min(kLx, kRx) - 1.6, fr = Math.max(kLx, kRx) + 1.6;
  let sari = `<path d="${schattenLang(3.6 + 0.1, d, 1.6, 0.42, "figur")}" fill="#2a1a10" opacity=".32" transform="translate(${r(-x)} ${r(-y)})"/>`;
  sari += `<ellipse cx="0" cy=".2" rx="${r(0.35 * u)}" ry="${r(0.06 * u)}" fill="#2a1a10" opacity=".35"/>`;
  /* eng gewickelter Rock bis zu den Knöcheln, vorn Falten, unten Goldborte */
  sari += `<path d="M${r(rx0)} ${r(ry0)} L${r(rx1)} ${r(ry0)} Q${r(rx1 + 0.4)} ${r((ry0 - 1) / 2)} ${r(fr)} -1.1 Q${r((fl + fr) / 2)} -.4 ${r(fl)} -1.1 Q${r(rx0 - 0.4)} ${r((ry0 - 1) / 2)} ${r(rx0)} ${r(ry0)} Z" fill="${S.lg("sari", [[0, "#b8341a"], [0.55, "#de5420"], [1, "#a82a14"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) { const t = 0.38 + i * 0.06; sari += `<line x1="${r(rx0 + (rx1 - rx0) * t)}" y1="${r(ry0 + (0 - ry0) * 0.45)}" x2="${r(fl + (fr - fl) * (t - 0.03))}" y2="-1.2" stroke="#8a2210" stroke-width=".3" opacity=".7"/>`; }
  sari += `<path d="M${r(fl)} -1.1 Q${r((fl + fr) / 2)} -.4 ${r(fr)} -1.1" stroke="#f0c64a" stroke-width=".8" fill="none"/>`;
  /* Pallu: von der rechten Taille quer über die Brust zur linken Schulter, dahinter hängend */
  sari += `<path d="M${r(tRx - 0.4)} ${r(tRy + 0.6)} Q${r(bx)} ${r(by + 0.4)} ${r(sLx - 1.2)} ${r(sLy - 0.4)} L${r(sLx + 0.9)} ${r(sLy + 0.3)} L${r(sLx + 1.6)} ${r(sLy + 5.5)} L${r(sLx + 0.5)} ${r(sLy + 5.2)} Q${r(bx + 1.6)} ${r(by + 3.2)} ${r(tRx + 1.4)} ${r(tRy + 2.2)} Z" fill="${S.lg("pallu", [[0, "#c8301e"], [1, "#e85a26"]], 0, 0, 1, 0)}"/>`;
  sari += `<path d="M${r(tRx + 1.4)} ${r(tRy + 2.2)} Q${r(bx + 1.6)} ${r(by + 3.2)} ${r(sLx + 0.5)} ${r(sLy + 5.2)}" stroke="#f0c64a" stroke-width=".55" fill="none"/>`;
  for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.2; sari += `<circle cx="${r(tRx + (sLx - tRx) * t)}" cy="${r(tRy + (sLy - tRy) * t + 0.9)}" r=".22" fill="#f6d36a"/>`; }
  /* Zopf über die linke Schulter nach vorn, mit weißen Jasminblüten (Gajra) */
  const [nkx, nky] = p("nacken"), [ohx, ohy] = p("ohr");
  const zopf = [[ohx - 0.2, ohy + 0.4], [sLx - 0.3, sLy - 0.2], [sLx + 0.2, sLy + 1.8], [sLx + 0.1, sLy + 4.2]];
  let zp = `<path d="M${zopf.map(([a, b]) => r(a) + " " + r(b)).join(" L")}" stroke="#1a1210" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let i = 1; i < 6; i++) { const t = i / 6, [a, b] = [zopf[1][0] + (zopf[3][0] - zopf[1][0]) * t, zopf[1][1] + (zopf[3][1] - zopf[1][1]) * t]; zp += `<path d="M${r(a - 0.45)} ${r(b - 0.2)} l.9 .4" stroke="#3a2a22" stroke-width=".22"/>`; }
  for (let i = 0; i < 5; i++) zp += `<circle cx="${r(ohx - 0.6 + i * 0.35)}" cy="${r(ohy + 0.2 + i * 0.25)}" r=".32" fill="#fbf8ee"/>`;
  S.teil({ id: "sari", de: "der Sari", syl: "SA-ri", it: "il sari", itSyl: "SA-ri", en: "sari", x, y, kunst: vereinfache(m.svg, 1.8) + sari + zp,
    tipp: "Der Sari ist ein 4 bis 8 Meter langes Tuch. Das schön verzierte Ende, der „Pallu“, liegt über der Schulter." });
}
const FOTO = { d: 18.5, s: 5.2 };
let KAMERA = null;
{
  /* Fotograf: hält die Kamera vor das Auge und zielt auf die Besucherin mit dem Taj im Hintergrund */
  const d = FOTO.d, u = uAt(d), x = xAt(FOTO.s, d), y = yAt(d);
  const pose = { lende: 1, brust: -2, nacken: 4, kopf: 0, schulterL: { vor: 58, seit: 22 }, ellbogenL: 118, unterarmL: 60, handL: 10, fingerL: 0.6, schulterR: { vor: 56, seit: 24 }, ellbogenR: 120, unterarmR: 60, handR: 10, fingerR: 0.6,
    huefteL: { vor: 10, seit: 4, dreh: -6 }, knieL: 8, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -6 }, knieR: 2, fussR: 0 };
  const m = B.mensch({ id: "ind_foto", geschlecht: "m", pose, blick: -125, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.7 * u);
  const hx = (m.z.handL.x + m.z.handR.x) / 2 * m.k, hy = (m.z.handL.y + m.z.handR.y) / 2 * m.k;
  const [nx, ny] = [m.z.punkte.nacken[0] * m.k, m.z.punkte.nacken[1] * m.k];
  let k = `<path d="${schattenLang(FOTO.s + 0.1, d, 1.7, 0.5, "figur")}" fill="#2a1a10" opacity=".32" transform="translate(${r(-x)} ${r(-y)})"/>`;
  k += `<ellipse cx="0" cy=".3" rx="${r(0.4 * u)}" ry="${r(0.07 * u)}" fill="#2a1a10" opacity=".35"/>`;
  /* Kameragurt als Schlaufe um den Nacken */
  k += vereinfache(m.svg, 1.8) + `<path d="M${r(hx + 1.6)} ${r(hy + 0.6)} Q${r(nx + 2.4)} ${r(ny + 5)} ${r(nx + 0.6)} ${r(ny + 0.2)} M${r(hx - 1.4)} ${r(hy + 0.8)} Q${r(nx - 1.6)} ${r(ny + 4.6)} ${r(nx - 0.6)} ${r(ny + 0.4)}" stroke="#1d1d1f" stroke-width=".45" fill="none"/>`;
  KAMERA = { x: x + hx - 1.8, y: y + hy - 0.6 };
  S.teil({ id: "fotograf", de: "der Fotograf", syl: "fo-to-GRAF", it: "il fotografo", itSyl: "fo-TO-gra-fo", en: "photographer", x, y, kunst: k,
    tipp: "Am Taj arbeiten viele Fotografen. Sie machen von den Besuchern ein Bild mit dem Taj im Hintergrund." });
}
{
  /* die Kamera (Spiegelreflex) vor seinem Gesicht, Objektiv zur Besucherin */
  let k = `<rect x="-3" y="-2" width="6" height="4" rx=".7" fill="#1e1e20"/><rect x="-2.4" y="-2.9" width="2.2" height="1" rx=".3" fill="#2a2a2c"/><circle cx="-3.2" cy=".1" r="1.9" fill="#2b2b2e" stroke="#5a5a5e" stroke-width=".3"/><circle cx="-3.6" cy=".1" r="1" fill="#3a5a7a"/><circle cx="-3.9" cy="-.2" r=".35" fill="#cfe4f4" opacity=".8"/><rect x="1.2" y="-1.4" width="1.4" height="1" fill="#c0392b"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la macchina fotografica", itSyl: "MAC-chi-na fo-to-GRA-fi-ca", en: "camera", x: r(KAMERA.x), y: r(KAMERA.y), anker: [r(KAMERA.x - 7), r(KAMERA.y + 1)], kunst: k + flaeche(-26, -3.2, 26, 5.6),
    tipp: "Mit der Kamera macht er ein Foto. Für ein Bild bezahlt man ihm ein paar Rupien." });
}

/* =====================================================================
   18 — DIE TERRASSE (vorne), 19 — DAS PALMENHÖRNCHEN, 20 — DER PAPAGEI
   ===================================================================== */
{
  const yK = yAt(8, 1.5);
  let k = `<rect x="0" y="${r(yK)}" width="400" height="${r(260 - yK)}" fill="${S.lg("torterrasse", [[0, "#b25a3a"], [1, "#8a3e26"]])}"/>`;
  k += `<rect x="0" y="${r(yK)}" width="400" height="1.6" fill="#f3ebe2"/><rect x="0" y="${r(yK + 1.6)}" width="400" height=".6" fill="#5a2a18" opacity=".6"/>`;
  for (let i = -12; i <= 12; i++) {
    const x = CX + i * 15, y = yK + 7;
    k += `<path d="M${r(x - 6)} ${r(y)} L${r(x)} ${r(y - 2)} L${r(x + 6)} ${r(y)} L${r(x)} ${r(y + 2)} Z" fill="none" stroke="#ead8c8" stroke-width=".45" opacity=".8"/><path d="M${r(x - 2.6)} ${r(y)} L${r(x)} ${r(y - 0.9)} L${r(x + 2.6)} ${r(y)} L${r(x)} ${r(y + 0.9)} Z" fill="#ead8c8" opacity=".7"/>`;
  }
  k += `<rect x="0" y="${r(yK + 11)}" width="400" height=".8" fill="#f3ebe2" opacity=".8"/>`;
  k += `<rect x="0" y="${r(yK)}" width="400" height="${r(260 - yK)}" fill="${S.lg("terrassenlicht", [[0, "#000", 0.25], [0.5, "#000", 0], [1, "#ffd9a0", 0.15]], 0, 0, 1, 0)}"/>`;
  S.teil({ anker: [300, 254], id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k,
    tipp: "Wir stehen auf der Terrasse vor dem großen Tor aus rotem Sandstein. Durch seinen Bogen sieht man den Taj zum ersten Mal." });
}
{
  let k = `<path d="M5 .2 L-16 -.4 L-16 .8 L5 .9 Z" fill="#2a1408" opacity=".25"/><ellipse cx="0" cy=".2" rx="6" ry=".9" fill="#2a1408" opacity=".3"/>`;
  k += `<path d="M-6 -2 Q-12 -6 -11 -12 Q-10 -15 -7 -14 Q-9 -10 -6 -6 Z" fill="#7a6a5a"/><path d="M-7.6 -13.4 Q-10 -10 -7 -6" stroke="#b9a890" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-6 0 Q-7 -5 -2 -6.4 Q3 -7 5 -4 Q6 -1 4 0 Z" fill="${S.lg("hoernchen", [[0, "#9a8670"], [1, "#6a5848"]])}"/>`;
  k += `<path d="M-5 -3.8 Q0 -6.6 4 -4.4 M-5.2 -2.6 Q0 -5.4 4.4 -3.2 M-5 -1.4 Q0 -4.2 4.6 -2" stroke="#efe4cf" stroke-width=".45" fill="none"/>`;
  k += `<ellipse cx="5.6" cy="-4.4" rx="2.2" ry="1.7" fill="#8a7660"/><circle cx="6.4" cy="-4.8" r=".45" fill="#1a1008"/><path d="M5 -6 l.4 -1.2 l.6 1" fill="#8a7660"/><circle cx="7.7" cy="-4.2" r=".35" fill="#3a2a20"/>`;
  k += `<path d="M3 0 l.6 -1.8 M4.6 0 l.2 -1.6" stroke="#5a4838" stroke-width=".6"/>`;
  S.teil({ oben: true, id: "palmenhoernchen", de: "das Palmenhörnchen", syl: "PAL-men-hörn-chen", it: "lo scoiattolo delle palme", itSyl: "sco-IAT-to-lo DEL-le PAL-me", en: "palm squirrel", x: 62, y: 251, steht: true, kunst: k,
    tipp: "Das Palmenhörnchen hat drei helle Streifen. Eine Legende sagt: Der Gott Rama hat es gestreichelt – davon hat es die Streifen." });
}
{
  let k = "";
  for (const [x, y, s] of [[0, 0, 1], [16, 7, 0.8]]) {
    k += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 Q-1 -2 4 -1 Q7 -.6 8 .4 Q5 1.6 -1 1.4 Q-6 1.4 -12 3 Z" fill="#4cae3a"/><path d="M-2 -.4 Q1 -6 6 -7 Q3 -3 2 0 Z" fill="#3a9a2e"/><path d="M-2 .8 Q0 5 4 6.4 Q2 3 2 .8 Z" fill="#2f8a26"/>`;
    k += `<circle cx="6.6" cy="-.4" r="1.4" fill="#5cbe46"/><path d="M7.6 0 q1.4 .2 1.2 1.4 q-.8 -.2 -1.4 -.6 Z" fill="#c8321e"/><path d="M5.6 .6 q.8 .8 2 .4" stroke="#1a1a1a" stroke-width=".3" fill="none"/><circle cx="7" cy="-.8" r=".25" fill="#111"/></g>`;
  }
  S.teil({ oben: true, id: "papagei", de: "der Papagei", syl: "pa-pa-GEI", it: "il pappagallo", itSyl: "pap-pa-GAL-lo", en: "parrot", x: 64, y: 44, kunst: `<g transform="scale(.7)">${k}</g>` + flaeche(-10, -6.4, 27, 14),
    tipp: "Grüne Halsbandsittiche – eine Papageienart – fliegen laut kreischend in Scharen über den Garten." });
}

/* VORNE: Besucher am Marmorbecken (Maßstab, nicht antippbar) */
S.davor(`<g pointer-events="none">${[[-14, 147, 0, 1], [-15.4, 152, 2, -1], [13.8, 146, 1, 1], [15.2, 151, 3, -1], [-17.5, 160, 1, 1], [17.2, 158, 0, -1]].map(([s, d, i, sp]) => besuch(s, d, 0, i, sp)).join("")}</g>`);
/* VORNE: Morgenlicht (fängt keinen Tipp ab) */
S.davor(`<rect x="0" y="0" width="400" height="260" fill="${S.lg("morgenlicht", [[0, "#3a2a60", 0.05], [0.55, "#fff", 0], [1, "#ffcf9a", 0.12]], 0, 0, 1, 0)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/indien.js"));
console.log(aus);
