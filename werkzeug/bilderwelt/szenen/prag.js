#!/usr/bin/env node
/* =====================================================================
   PRAG (FASSUNG 855) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (Wikipedia „Charles Bridge“, „Old Town Bridge Tower“,
   „Lesser Town Bridge Tower“, „St. Vitus Cathedral“, „Prague Castle“,
   „Church of St. Nicholas (Malá Strana)“, „Petřín Lookout Tower“;
   prague.eu; praguecitytourism.cz):
   - STANDORT: am ALTSTÄDTER BRÜCKENTURM, Augenhöhe 3 m über der Fahrbahn
     (wie auf der Treppenstufe am Turmtor; Runde 2: tiefer, damit die
     Menschen vorn groß werden), Blick nach Westen über die KARLSBRÜCKE (1357–1402,
     516 m lang, 9,5 m breit, 16 Bögen aus Sandstein, 13 m über der
     Moldau). Die Brücke läuft leicht nach links (Westsüdwest) zur
     Kleinseite. Echte Richtungen von links nach rechts: der Petřín
     (Laurenziberg, 327 m) mit dem AUSSICHTSTURM (63,5 m, 1891, ein
     kleiner Eiffelturm, Südwesten), die Insel Kampa, am Brückenende die
     zwei KLEINSEITNER BRÜCKENTÜRME (links der niedrige romanische
     Judithturm, rechts der hohe gotische Turm von 1464, 43,5 m, mit
     Schieferdach und Ecktürmchen, dazwischen das Tor), dahinter die
     grüne Kuppel und der Glockenturm der NIKOLAUSKIRCHE (Barock, 79 m),
     rechts oben auf dem Hradschin die PRAGER BURG (lange helle
     Südfront) mit dem VEITSDOM (links die zwei schlanken Westtürme,
     82 m, in der Mitte der große Südturm, 96,5 m, mit grüner
     Renaissance-Haube und Galerie, rechts der Chor mit Strebebögen).
   - Auf der Brücke: 30 dunkle Barockstatuen (heute Kopien), 15 je Seite,
     auf Sockeln über den Pfeilern; die erste rechts ist die Madonna mit
     dem heiligen Bernhard, die erste links der heilige Ivo. Die
     Statue des HEILIGEN NEPOMUK (1683, Bronze, die älteste) steht rechts
     als achte; um seinen Kopf fünf goldene Sterne; die Bronzetafel
     darunter ist blank gerieben: Wer sie berührt, kommt wieder nach
     Prag. Gaslaternen auf der Brüstung, Kopfsteinpflaster,
     Straßenmusiker (Jazz, Akkordeon), Puppenspieler mit MARIONETTEN,
     Stände der Maler und Künstler.
   - Auf der Moldau: AUSFLUGSSCHIFFE mit Glasdach, TRETBOOTE (auch in
     Schwanenform), SCHWÄNE. Links das Altstädter Wehr.
   - TYPISCH: TRDELNÍK (Hohlgebäck vom Spieß, in Zimtzucker gerollt),
     Marionetten, BÖHMISCHES GLAS (geschliffene Vasen, Kristall),
     Knödel. Die Astronomische Uhr steht am Altstädter Ring – von hier
     aus nicht zu sehen (nur im Tipp).
   - LICHT: Sommermorgen, etwa 9 Uhr; die Sonne steht im Ostsüdosten
     hinter dem Betrachter (links hinten, 35° hoch). Alles, was zu uns
     und nach links (Süden) schaut, ist hell; Schatten fallen nach vorn
     und leicht nach rechts (Länge 1,4 × Höhe).
   Maßstab: Augenhöhe 3 m über der Brücke, Horizont y = 100, F = 440.
   Brückenkoordinaten s (entlang der Brücke) und q (quer, rechts +);
   der Blick ist 11° nach rechts gedreht: d = s·cos11° + q·sin11°,
   l = −s·sin11° + q·cos11°, x = 200 + F·l/d, y = 100 + F·(3 − h)/d.
   Burg in 1050 m, Nikolauskirche 744 m, Petřín 1340 m, Brückentürme
   510 m, Touristin in 10 m, Musiker in 11 m (1,75 m ≈ 73 Einheiten).
   STATUEN vorn nach dem echten Bestand: rechts die Madonna mit dem
   heiligen Bernhard (Madonna mit Kind auf Wolken, Bernhard kniet, Putto),
   dann Dominikus und Thomas von Aquin mit der Madonna; links der heilige
   Ivo (mit Birett und Buch, eine Witwe mit Kind zu seinen Füßen), dann
   Barbara, Margareta und Elisabeth.
   RUNDE 3: Treffer neu geschnitten — nur der nahe Teil der Brücke (bis 60 m) ist „die
   Karlsbrücke“, die fernen Statuen, Laternen und das ferne Pflaster sind Kulisse (die Moldau
   spart sie aus). Nahe Statuen als eigene Teile: „die Statue“ (Madonna mit Bernhard, Lupe auf
   Nepomuk) und „der Heilige“ (Ivo). Statuen als Barockgruppen (Gesichtsfläche, Schleier,
   Faltenbahnen, Hände mit Attribut, helle Verwitterungskanten), breite Statuenschatten,
   Laternen niedriger und hinter die Statuen versetzt, neue Kumuli, Petřín in Baumgruppen,
   Dunst vor Burg und Hügel, gewöhnliches Tretboot, Schwanenfamilie vorn, Judithturm aus Bruchstein.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "prag", titel: "Prag", emoji: "🌉", thema: "Länder", kuerzel: "prg", fassung: 855, breite: 400, hoehe: 260 });
const rnd = zufall(1357);
const r = B.r;
const F = 440, HOR = 100, E = 3, W = 11 * Math.PI / 180, CA = Math.cos(W), SA = Math.sin(W);
const Dd = (s, q) => s * CA + q * SA, Ll = (s, q) => -s * SA + q * CA;
const X = (s, q) => 200 + F * Ll(s, q) / Dd(s, q);
const Y = (s, q, h = 0) => HOR + F * (E - h) / Dd(s, q);
const P = (s, q, h = 0) => `${r(X(s, q))} ${r(Y(s, q, h))}`;
/* ferne Dinge nach Richtung (Grad gegen die Blickmitte) und Entfernung */
const XA = (a) => 200 + F * Math.tan(a * Math.PI / 180);
const YD = (d, h) => HOR + F * (E - h) / d;
const kompakt = (svg, Q = 1) => {
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};
/* Vielecke auf das Bild beschneiden — nichts ragt hinaus */
const BOX = [0, 0, 400, 260];
function klipp(pts) {
  let p = pts.map((q) => q.split(" ").map(Number));
  const kante = [[(q) => q[0] >= BOX[0], (a, b) => [BOX[0], a[1] + (b[1] - a[1]) * (BOX[0] - a[0]) / (b[0] - a[0])]],
    [(q) => q[0] <= BOX[2], (a, b) => [BOX[2], a[1] + (b[1] - a[1]) * (BOX[2] - a[0]) / (b[0] - a[0])]],
    [(q) => q[1] >= BOX[1], (a, b) => [a[0] + (b[0] - a[0]) * (BOX[1] - a[1]) / (b[1] - a[1]), BOX[1]]],
    [(q) => q[1] <= BOX[3], (a, b) => [a[0] + (b[0] - a[0]) * (BOX[3] - a[1]) / (b[1] - a[1]), BOX[3]]]];
  for (const [innen, schnitt] of kante) {
    const out = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      if (innen(a)) { out.push(a); if (!innen(b)) out.push(schnitt(a, b)); } else if (innen(b)) out.push(schnitt(a, b));
    }
    p = out; if (!p.length) break;
  }
  return p.map(([x, y]) => `${r(x)} ${r(y)}`);
}
const strecke = (a, b) => {   /* Linie a→b auf das Bild beschnitten */
  let [x1, y1] = a.split(" ").map(Number), [x2, y2] = b.split(" ").map(Number), t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  for (const [p, q] of [[-dx, x1 - BOX[0]], [dx, BOX[2] - x1], [-dy, y1 - BOX[1]], [dy, BOX[3] - y1]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; }
  }
  return `M${r(x1 + t0 * dx)} ${r(y1 + t0 * dy)} L${r(x1 + t1 * dx)} ${r(y1 + t1 * dy)}`;
};
const poly = (pts, fill, extra = "") => { const q = klipp(pts); return q.length > 2 ? `<path d="M${q.join(" L")}Z" fill="${fill}"${extra}/>` : ""; };

/* Pfade klein schreiben (Ladezeit): absolute Koordinaten auf Q runden, dann relativ (m, l, c …)
   ausgeben. Figuren: Q = 1 cm; alle übrigen Pfade am Ende mit Q = 0,001 (ohne sichtbaren Unterschied). */
function relativ(d, Q) {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g); if (!tok) return d;
  const fmt = (v) => { v = Math.round(v / Q) * Q; v = Math.round(v * 1000) / 1000; return String(v === 0 ? 0 : v).replace(/^0\./, ".").replace(/^-0\./, "-."); };
  const join = (nums) => nums.map((s, i) => (i && s[0] !== "-" ? " " : "") + s).join("");
  let out = "", i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = "";
  const R = (v) => Math.round(v / Q) * Q;
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const up = cmd.toUpperCase(), rel = cmd !== up;
    const n = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 }[up];
    if (up === "Z") { out += "z"; cx = sx; cy = sy; continue; }
    const a = tok.slice(i, i + n).map(Number); i += n;
    let nums = [];
    if (up === "H") { const x = R(rel ? cx + a[0] : a[0]); nums = [fmt(x - cx)]; cx = x; }
    else if (up === "V") { const y = R(rel ? cy + a[0] : a[0]); nums = [fmt(y - cy)]; cy = y; }
    else if (up === "A") { const x = R(rel ? cx + a[5] : a[5]), y = R(rel ? cy + a[6] : a[6]); nums = [fmt(a[0]), fmt(a[1]), String(Math.round(a[2])), String(a[3]), String(a[4]), fmt(x - cx), fmt(y - cy)]; cx = x; cy = y; }
    else { const pts = []; for (let k = 0; k < n; k += 2) pts.push([R(rel ? cx + a[k] : a[k]), R(rel ? cy + a[k + 1] : a[k + 1])]);
      nums = pts.flatMap(([x, y]) => [fmt(x - cx), fmt(y - cy)]); [cx, cy] = pts[pts.length - 1]; }
    if (up === "M") { sx = cx; sy = cy; }
    out += (up === "M" ? "m" : cmd.toLowerCase()) + join(nums);
    if (up === "M") cmd = rel ? "l" : "L";
  }
  return out;
}
const kompakt2 = (svg, Q = 1) => svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${relativ(p, Q)}"`)
  .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => { const v = Math.round(+n / Q) * Q; return ` ${k}="${v === 0 ? 0 : Math.round(v * 100) / 100}"`; });

/* Figuren: Kopf und Hände fein (0,2 cm), der Rest auf 1 cm — keine Pixeltreppen im Gesicht.
   Kreis- und Ellipsen-Koordinaten (Augen) bleiben unverändert. */
function kompaktFein(m, svg = m.svg, Qf = 0.4) {
  const z = m.z, kopfY = z.kopf.y + 13, haende = [z.handL, z.handR].filter(Boolean);
  const fein = (x, y) => y < kopfY || haende.some((h) => Math.abs(h.x - x) < 9 && Math.abs(h.y - y) < 9);
  return svg.replace(/ d="([^"]+)"/g, (a, p) => {
    const n = p.match(/-?\d*\.?\d+/g) || [];
    let f = false;
    for (let i = 0; i + 1 < n.length && !f; i += 2) f = fein(+n[i], +n[i + 1]);
    return ` d="${relativ(p, f ? Qf : 1)}"`;
  }).replace(/<(circle|ellipse) ([^>]*?)\/>/g, (a, t, at) => {
    const cx = +((at.match(/ cx="(-?[\d.]+)"/) || [])[1] || 0), cy = +((at.match(/ cy="(-?[\d.]+)"/) || [])[1] || 0);
    return a;
    return `<${t} ` + at.replace(/ (cx|cy)="(-?[\d.]+)"/g, (q, k, v) => ` ${k}="${Math.round(+v)}"`) + "/>";
  });
}
/* vor dem Schreiben: alle Pfade der Szene relativ schreiben */
function pfadeKlein(S) {
  const k = (s) => s.replace(/ d="([^"]+)"/g, (a, p) => ` d="${relativ(p, 0.001)}"`);
  for (const t of S.teile) { t.kunst = k(t.kunst); if (t.unter) for (const u of t.unter) u.kunst = k(u.kunst); }
  S.kulisse = S.kulisse.map(k); S.vorne = S.vorne.map(k); S.defs = S.defs.map(k);
}

/* Gegenlicht/Lichtkante für Figuren: Körper leicht abgedunkelt, eine warme Lichtkante INNEN an der
   sonnenzugewandten Seite (Form minus verschobene Form) */
S.def(`<filter id="${S.id("kante")}" x="-10%" y="-5%" width="120%" height="110%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" result="k"/><feOffset in="SourceAlpha" dx=".7" dy="0" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="r"/><feFlood flood-color="#ffe0b2" flood-opacity=".5"/><feComposite in2="r" operator="in" result="l"/><feMerge><feMergeNode in="k"/><feMergeNode in="l"/></feMerge></filter>`);
/* Luftperspektive: ferne Bauten heller, wärmer, weniger Kontrast (Morgendunst) */
S.def(`<filter id="${S.id("luft")}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".8 0 0 0 .19 0 .8 0 0 .182 0 0 .8 0 .165 0 0 0 1 0"/></filter>`);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-5%" y="-30%" width="110%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".8 .3"/></filter>`);

/* Stoffe */
const SOCKEL = S.lg("sockel", [[0, "#a39582"], [0.6, "#8a7d6b"], [1, "#6f6456"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#8fc7ad"], [0.5, "#5f9f83"], [1, "#3f7562"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#5a5f6a"], [1, "#3a3e47"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#e9bd4c"], [1, "#9a6a14"]], 0, 0, 1, 1);
const PUTZ = "#eadfca";

/* =====================================================================
   KULISSE — Morgenhimmel, Petřín, Hradschin-Hang, Kleinseite, Kampa
   ===================================================================== */
/* Morgenhimmel: oben kräftig blau, am Horizont warm und dunstig */
S.hinten(`<rect width="400" height="130" fill="${S.lg("himmel", [[0, "#4f86c6"], [0.45, "#8db6df"], [0.8, "#e2e6e4"], [1, "#f6e6cc"]])}"/>`);
S.hinten(`<rect width="400" height="130" fill="${S.rg("morgen", [[0, "#fff1d0", 0.7], [1, "#fff1d0", 0]], 0, 0.95, 0.6)}"/>`);
{
  /* flache Sommer-Kumuli: gelappter, unregelmäßiger Oberrand, flache Basis; die Sonne steht links hinten,
     die uns zugewandte Seite ist hell, jeder Lappen hat unten rechts einen leicht violetten Eigenschatten;
     dazu hohe, zarte Schleierwolken */
  const WK = S.lg("wk", [[0, "#fffaf1"], [0.5, "#ffffff"], [0.8, "#e9e8f2"], [1, "#c9c4da"]]);
  const kumulus = (x, y, w, h, seed) => {
    const z = zufall(seed), lap = [];
    for (let cx = x - w / 2 + h * 0.3; cx < x + w / 2 - h * 0.3;) {
      const t = (cx - x + w / 2) / w, rr = h * (0.28 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.2 + 0.05)) ** 0.7) * (0.75 + z() * 0.5);
      lap.push([cx + rr * 0.5, y - rr * 1.15 - h * 0.18 * Math.sin(Math.PI * t), rr]);
      cx += rr * (0.75 + z() * 0.45);
    }
    const id = S.id("wc" + seed);
    let d = `M${r(x - w / 2)} ${r(y)}`, sch = "", li = "";
    for (const [lx, ly, rr] of lap) {
      d += ` L${r(lx - rr * 0.9)} ${r(ly + rr * 0.45)} A${r(rr)} ${r(rr)} 0 0 1 ${r(lx + rr * 0.9)} ${r(ly + rr * 0.45)}`;
      sch += `M${r(lx - rr * 0.3)} ${r(ly + rr * 0.55)} a${r(rr * 0.8)} ${r(rr * 0.65)} 0 1 1 ${r(rr * 1.6)} 0 a${r(rr * 0.8)} ${r(rr * 0.65)} 0 1 1 ${r(-rr * 1.6)} 0Z`;
      li += `M${r(lx - rr * 0.85)} ${r(ly + rr * 0.1)} a${r(rr * 0.6)} ${r(rr * 0.55)} 0 1 1 ${r(rr * 1.2)} 0 a${r(rr * 0.6)} ${r(rr * 0.55)} 0 1 1 ${r(-rr * 1.2)} 0Z`;
    }
    d += ` L${r(x + w / 2)} ${r(y)} Q${r(x)} ${r(y + h * 0.12)} ${r(x - w / 2)} ${r(y)}Z`;
    S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    return `<path d="${d}" fill="${WK}"/><g clip-path="url(#${id})"><path d="${sch}" fill="#d6d2e4" opacity=".55"/><path d="${li}" fill="#fffdf8" opacity=".85"/><rect x="${r(x - w / 2)}" y="${r(y - h * 0.22)}" width="${r(w)}" height="${r(h * 0.4)}" fill="#c3bed6" opacity=".45"/></g>`;
  };
  const schleier = (d, b, o) => `<path d="${d}" stroke="#ffffff" stroke-width="${b}" stroke-linecap="round" fill="none" opacity="${o}" filter="url(#${S.id("dunst")})"/>`;
  S.hinten(schleier("M24 14 Q60 9 104 11 M70 18 Q110 13 150 16 M120 10 Q160 6 196 9 M40 21 q20 -3 44 -2", 0.9, 0.35) + schleier("M268 46 Q300 41 336 43 M310 50 Q350 45 396 48 M352 41 q20 -3 44 -1", 0.8, 0.3) +
    kumulus(118, 33, 64, 13, 4) + kumulus(262, 22, 40, 8, 12) + kumulus(382, 19, 26, 5.5, 27) + kumulus(172, 40, 14, 3.2, 41));
}
{
  /* Petřín: bewaldeter Hügel links, Kuppe bei x 13, fällt nach rechts zur Kleinseite */
  const kuppe = YD(1340, 128);
  const huegel = `M0 ${r(kuppe + 2)} C8 ${r(kuppe - 1)} 22 ${r(kuppe - 0.5)} 40 ${r(kuppe + 4)} C70 ${r(kuppe + 12)} 110 85 150 95 L170 101 L170 130 L0 130 Z`;
  let g = `<path d="${huegel}" fill="${S.lg("petrin", [[0, "#7f9a78"], [1, "#5d7a5a"]])}"/>`;
  /* Kammlinie genau aus den Bézierkurven des Hügels */
  const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; };
  const kamm = [];
  for (let t = 0; t <= 1.001; t += 0.02) kamm.push(bez([0, kuppe + 2], [8, kuppe - 1], [22, kuppe - 0.5], [40, kuppe + 4], t));
  for (let t = 0; t <= 1.001; t += 0.02) kamm.push(bez([40, kuppe + 4], [70, kuppe + 12], [110, 85], [150, 95], t));
  kamm.push([170, 101]);
  const rand = (x) => { for (let i = 1; i < kamm.length; i++) if (kamm[i][0] >= x) { const [a, b] = [kamm[i - 1], kamm[i]]; return a[1] + (b[1] - a[1]) * (x - a[0]) / Math.max(0.01, b[0] - a[0]); } return 101; };
  /* Baumgruppen statt Tapete: Gruppen von 3–7 Bäumen mit Wiesen dazwischen, nach oben (weiter weg) kleiner,
     jede Krone gelappt, oben links von der Sonne gestreift */
  let kd = "", kd2 = "", kh = "";
  const z = zufall(8);
  for (let n = 0; n < 28; n++) {
    const gx = 2 + z() * 166, t = Math.pow(z(), 0.8), gy = rand(gx) + 2 + t * 24, m = 3 + Math.floor(z() * 5), dunkel = z() < 0.5;
    for (let i = 0; i < m; i++) {
      const rr = (0.9 + t * 1.5) * (0.8 + z() * 0.4), x = gx + (z() - 0.5) * m * rr * 1.1, y = gy + (z() - 0.5) * rr * 1.2;
      if (y > 118 || y - rr < rand(x) + 0.4) continue;
      for (const [dx, dy, f] of [[-rr * 0.7, 0.3, 0.8], [rr * 0.6, 0.2, 0.75], [0, -rr * 0.35, 1]]) {
        const q = rr * f, c = `M${r(x + dx - q)} ${r(y + dy)} a${r(q)} ${r(q * 0.9)} 0 1 1 ${r(2 * q)} 0 a${r(q)} ${r(q * 0.9)} 0 1 1 ${r(-2 * q)} 0Z`;
        if (dunkel) kd2 += c; else kd += c;
      }
      kh += `M${r(x - rr * 0.95)} ${r(y - rr * 0.4)} a${r(rr * 0.6)} ${r(rr * 0.5)} 0 0 1 ${r(rr * 1.1)} ${r(-rr * 0.25)}Z`;
    }
  }
  g += `<path d="${kd2}" fill="#4f6e4a"/>`;
  g += `<path d="${kd}" fill="#5e7c56"/><path d="${kh}" fill="#9ab88a" opacity=".6"/>`;
  g += `<path d="${huegel}" fill="${S.lg("petdunst", [[0, "#e8ecef", 0.38], [1, "#f4e6cc", 0.42]])}"/>`;
  /* Kloster Strahov und Häuser am Hang (helle Fassaden, rote Dächer) */
  for (const [x, y, w] of [[96, 90, 6], [104, 92, 5], [118, 94, 7], [130, 96, 6], [141, 97, 6], [152, 99, 7]]) g += `<rect x="${x}" y="${y}" width="${w}" height="3" fill="#efe3c9"/><rect x="${x + w * 0.75}" y="${y}" width="${r(w * 0.25)}" height="3" fill="#b9aec4"/><path d="M${x - 0.3} ${y} L${x + w / 2} ${y - 1.6} L${x + w + 0.3} ${y}Z" fill="#b65a3c"/>`;
  S.hinten(g);
}
{
  /* Hradschin-Hang rechts: die Dächer der Kleinseite steigen zur Burg hinauf, dazwischen terrassierte Gärten
     mit weißen Mäuerchen und die Schlossstiege; Licht von links hinten: Fassaden warm, Nordseiten kühl-violett */
  let g = `<path d="M176 101 C210 95 240 89 262 87 L400 81 L400 130 L176 130 Z" fill="${S.lg("hang", [[0, "#7f9c6c"], [1, "#5d7a54"]])}"/>`;
  S.def(`<g id="${S.id("haus")}"><rect x="0" y="-3" width="4" height="3" fill="#f1e2c6"/><rect x="3" y="-3" width="1" height="3" fill="#b7aec8"/><path d="M-.3 -3 L.8 -4.8 L3.4 -4.8 L4.3 -3Z" fill="#b8573a"/><path d="M.8 -4.8 L3.4 -4.8 L3.8 -4.2 L1.2 -4.2Z" fill="#d07a58"/><path d="M.7 -2.3h.7v1h-.7Z M2 -2.3h.7v1h-.7Z" fill="#6a6f80"/></g>`);
  const zh = zufall(31);
  let hs = "";
  for (const [x0, x1, y0, dy] of [[184, 300, 99, -0.05], [200, 330, 95, -0.06], [226, 296, 91, -0.05]]) {
    for (let x = x0; x < x1; x += 4.2 + zh() * 2) { const y = y0 + (x - x0) * dy + zh() * 1.2, sk = (0.85 + zh() * 0.4).toFixed(2); hs += `<use href="#${S.id("haus")}" transform="translate(${r(x)} ${r(y)}) scale(${sk})"/>`; }
  }
  g += hs;
  /* Terrassengärten unter der Burg: grüne Stufen, helle Stützmauern in Stücken, Bäumchen */
  let ter = "", mau = "", msch = "", tb = "";
  const zt = zufall(77);
  for (const [x0, y0, dy] of [[298, 92.8, -0.045], [306, 96.4, -0.042], [318, 99.8, -0.038]]) {
    ter += `M${x0} ${y0} L398 ${r(y0 + (398 - x0) * dy)} V${r(y0 + (398 - x0) * dy + 1.3)} L${x0} ${r(y0 + 1.3)}Z`;
    mau += `M${x0} ${r(y0 + 1.3)} L398 ${r(y0 + (398 - x0) * dy + 1.3)}`; msch += `M${x0} ${r(y0 + 1.75)} L398 ${r(y0 + (398 - x0) * dy + 1.75)}`;
    for (let x = x0 + 1; x < 396; x += 2.5 + zt() * 5) { const yy = y0 + (x - x0) * dy; if (zt() < 0.6) tb += `M${r(x)} ${r(yy + 0.9)} a${r(0.7 + zt() * 0.5)} .9 0 1 1 1.6 0Z`; }
  }
  g += `<path d="${ter}" fill="#93b075" opacity=".85"/><path d="${mau}" stroke="#cdbf9f" stroke-width=".4" opacity=".8"/><path d="${msch}" stroke="#4f6a46" stroke-width=".35" opacity=".5"/><path d="${tb}" fill="#56794a"/>`;
  g += `<path d="M262 99 L296 92.4" stroke="#e6dcc8" stroke-width=".9"/><path d="M262 99 L296 92.4" stroke="#b9ad96" stroke-width=".3" stroke-dasharray=".5 .5"/>`;
  const z = zufall(19);
  let kr = "";
  for (let x = 300; x < 400; x += 3 + z() * 3) { const y = 90 + (x - 300) * -0.045 + z() * 7; kr += `M${r(x)} ${r(y)} a${r(1.3 + z())} ${r(1.1 + z())} 0 1 1 ${r(2.6 + z())} 0Z`; }
  g += `<path d="${kr}" fill="#64824f"/>`;
  S.hinten(g);
  /* Häuserzeilen der Kleinseite (rechts, am Ufer in ~430 m) und auf Kampa (links): 3–5 Stockwerke,
     helle Barockfassaden (zu uns warm beleuchtet, Nordseiten kühl), Ziegeldächer mit Gauben; davor Uferbäume */
  let d = "";
  const zd = zufall(23);
  const zeile = (x0, x1, yb, hmin, hmax) => {
    let g = "", fen = "", schatten = "", lichter = "";
    for (let x = x0; x < x1;) {
      const w = 5 + zd() * 8, h = hmin + zd() * (hmax - hmin), dach = 2.4 + zd() * 2.6;
      const fc = ["#f6e3c4", "#efd3ac", "#f8ead6", "#e6cda4", "#f2d4bf", "#ead9a8", "#f8dcc2"][Math.floor(zd() * 7)];
      g += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w + 0.2)}" height="${r(h)}" fill="${fc}"/>`;
      schatten += `M${r(x + w * 0.76)} ${r(yb - h)} h${r(w * 0.24 + 0.2)} v${r(h)} h${r(-w * 0.24 - 0.2)}Z`;
      g += `<path d="M${r(x - 0.2)} ${r(yb - h)} L${r(x + w * 0.2)} ${r(yb - h - dach)} L${r(x + w * 0.8)} ${r(yb - h - dach)} L${r(x + w + 0.4)} ${r(yb - h)}Z" fill="${zd() < 0.5 ? "#b8573a" : "#a24a35"}"/>`;
      lichter += `M${r(x + w * 0.2)} ${r(yb - h - dach)} L${r(x + w * 0.8)} ${r(yb - h - dach)} L${r(x + w * 0.86)} ${r(yb - h - dach * 0.7)} L${r(x + w * 0.26)} ${r(yb - h - dach * 0.7)}Z`;
      for (let fy = yb - h + 1.4; fy < yb - 2; fy += 2.6) for (let fx = x + 1; fx < x + w - 0.9; fx += 1.8) fen += `M${r(fx)} ${r(fy)}h.8v1.2h-.8Z`;
      if (zd() < 0.4) g += `<path d="M${r(x + w / 2 - 0.6)} ${r(yb - h - dach * 0.5)} h1.2 v-1 l-.6 -.6 l-.6 .6Z" fill="#eadfca"/>`;
      x += w;
    }
    return g + `<path d="${schatten}" fill="#7d77a0" opacity=".6"/><path d="${lichter}" fill="#e69a72" opacity=".55"/><path d="${fen}" fill="#5f6478" opacity=".8"/>`;
  };
  d += zeile(140, 400, 115.7, 10, 17) + zeile(0, 110, 118, 6, 11);
  /* Uferbäume (gelappt, Himmelslücken zwischen den Kronen) */
  for (let x = 2; x < 108; x += 5 + zd() * 6) { const y = 118.6 - zd(); d += `<path d="M${r(x)} ${r(y)} a2.6 2.9 0 1 1 5.2 0Z" fill="${zd() < 0.5 ? "#4f7a46" : "#5f8a50"}"/><path d="M${r(x + 0.6)} ${r(y - 2.4)} a1.2 1 0 0 1 2 0" stroke="#9ab88a" stroke-width=".5" fill="none"/>`; }
  for (let x = 266; x < 398; x += 7 + zd() * 9) { const y = 116.6 - zd(); d += `<path d="M${r(x)} ${r(y)} a2.4 2.7 0 1 1 4.8 0Z" fill="#557f4a"/>`; }
  S.hinten(d);
  /* Morgendunst: warm-golden am Fuß des Hradschin und über dem Fluss */
  S.hinten(`<rect x="0" y="84" width="400" height="38" fill="${S.lg("ferne", [[0, "#f3e6cc", 0], [0.6, "#f5e4c4", 0.32], [1, "#f1e6d4", 0.5]])}"/>`);
}

/* =====================================================================
   1 — DER AUSSICHTSTURM auf dem Petřín (63,5 m, Stahlgitter)
   ===================================================================== */
{
  const d = 1340, x = r(XA(-23)), yb = r(YD(d, 128)), s = F / d;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* achteckiger Gitterturm, unten breiter; Plattformen, Spitze */
  k += `<path d="M-6 0 L-1.6 -60 L1.6 -60 L6 0 Z" fill="none" stroke="#7a5a44" stroke-width="1.4"/>`;
  let gi = "";
  for (let i = 0; i < 9; i++) { const y0 = -i * 6.6, y1 = y0 - 6.6, w0 = 6 - i * 0.49, w1 = w0 - 0.49; gi += `M${r(-w0)} ${r(y0)} L${r(w1)} ${r(y1)} M${r(w0)} ${r(y0)} L${r(-w1)} ${r(y1)} M${r(-w1)} ${r(y1)} H${r(w1)}`; }
  k += `<path d="${gi}" stroke="#8a6650" stroke-width=".8"/>`;
  k += `<rect x="-3.6" y="-21" width="7.2" height="1.6" fill="#6e4f3c"/><rect x="-2.6" y="-55" width="5.2" height="1.6" fill="#6e4f3c"/>`;
  k += `<path d="M-1.6 -60 L0 -64 L1.6 -60 Z" fill="#6e4f3c"/><path d="M0 -64 V-67" stroke="#6e4f3c" stroke-width=".6"/></g>`;
  S.teil({ id: "aussichtsturm", de: "der Aussichtsturm", syl: "AUS-sichts-turm", it: "la torre panoramica", itSyl: "TOR-re pa-no-RA-mi-ca", en: "lookout tower", x, y: yb, steht: true, kunst: k + flaeche(-4, -29, 8, 29, 0.6),
    tipp: "Der Aussichtsturm auf dem Petřín sieht aus wie ein kleiner Eiffelturm." });
}

/* =====================================================================
   2 — DER VEITSDOM (hinter der Burg: Westtürme, Südturm, Chor)
   ===================================================================== */
{
  const d = 1050, s = F / d, x0 = r(XA(19)), yb = r(YD(d, 56));
  /* Koordinaten in Metern, Ursprung: Südturm am Boden (Burghof, 56 m über der Brücke).
     Licht von links vorn (Sonne im Ostsüdosten): linke und vordere Flächen hell, rechte Seiten im Schatten. */
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  const STEIN_L = "#d6ccb8", STEIN_M = "#b3a996", STEIN_S = "#857d70";
  /* Langhaus und Chor: Wand mit hohen Maßwerkfenstern, Strebepfeiler mit Fialen */
  k += `<path d="M-62 -4 L-62 -32 L60 -32 L60 -4 Z" fill="${S.lg("domwand", [[0, STEIN_L], [0.5, STEIN_M], [1, STEIN_S]], 0, 0, 1, 0)}"/>`;
  let ff = "", pf = "";
  for (let i = 0; i < 12; i++) { const x = -56 + i * 9.6; if (Math.abs(x) < 9) continue; ff += `M${r(x)} -9 v-15 q2.2 -4.4 4.4 0 v15 Z`; pf += `M${r(x - 2.2)} -4 v-30 l1 -4 l1 4 v30 Z`; }
  k += `<path d="${ff}" fill="#3f4658"/><path d="${ff}" fill="none" stroke="#e8e0cc" stroke-width=".5"/><path d="${pf}" fill="${STEIN_M}"/><path d="${pf.replace(/v30 Z/g, "")}" stroke="#efe8d8" stroke-width=".35" fill="none"/>`;
  /* Dach: steiles dunkelgrünes Kupfer mit feinen Längsrippen, oben im Licht heller */
  k += `<path d="M-64 -32 L-56 -58 L56 -58 L64 -32 Z" fill="${S.lg("domdach", [[0, "#5f8a78"], [0.5, "#3e5f53"], [1, "#2a3f38"]])}"/>`;
  let rp = "";
  for (let x = -62; x < 63; x += 2.6) rp += `M${r(x)} -32 L${r(x * 0.875)} -58`;
  k += `<path d="${rp}" stroke="#7fa898" stroke-width=".3" opacity=".55"/><path d="M-56 -58 H56" stroke="#9cc4b2" stroke-width=".8"/>`;
  /* Strebebögen mit Fialen am Chor (rechts) gegen den Himmel */
  let sb = "", fi = "";
  for (let i = 0; i < 6; i++) { const x = 18 + i * 7.2; sb += `M${r(x)} -4 V-36 M${r(x)} -26 Q${r(x + 2.5)} -34 ${r(x + 5.6)} -40`; fi += `M${r(x - 1.1)} -36 L${r(x)} -45 L${r(x + 1.1)} -36 Z`; }
  k += `<path d="${sb}" stroke="${STEIN_S}" stroke-width="1.5" fill="none"/><path d="${sb}" stroke="${STEIN_L}" stroke-width=".5" fill="none" transform="translate(-.4 0)"/><path d="${fi}" fill="${STEIN_M}"/>`;
  /* zwei Westtürme (82 m), heller Stein, durchbrochene Helme mit Krabben — links */
  for (const [x, f] of [[-60, STEIN_L], [-50, STEIN_M]]) {
    k += `<rect x="${x - 4}" y="-62" width="8" height="58" fill="${f}"/><rect x="${x + 2.5}" y="-62" width="1.5" height="58" fill="${STEIN_S}"/>`;
    k += `<path d="M${x - 3} -24 v-14 q3 -5 6 0 v14 Z M${x - 2.4} -46 v-10 q2.4 -4 4.8 0 v10 Z" fill="#3f4658" stroke="#efe8d8" stroke-width=".4"/>`;
    k += `<path d="M${x - 4.4} -62 L${x} -82 L${x + 4.4} -62 Z" fill="#8f8a7e"/><path d="M${x - 4.4} -62 L${x} -82 L${x - 1.2} -62 Z" fill="${STEIN_L}"/>`;
    let kr = "";
    for (let j = 1; j < 6; j++) { const t = j / 6; kr += `M${r(x - 4.4 * (1 - t))} ${r(-62 - 20 * t)} l-.9 -.4 M${r(x + 4.4 * (1 - t))} ${r(-62 - 20 * t)} l.9 -.4`; }
    k += `<path d="${kr}" stroke="#6f685e" stroke-width=".5"/><path d="M${x - 1.6} -66 L${x} -76 L${x + 1.6} -66 Z" fill="#3f4658" opacity=".6"/>`;
    for (const dx of [-4, 4]) k += `<path d="M${x + dx - 0.8} -62 L${x + dx} -68 L${x + dx + 0.8} -62 Z" fill="${f}"/>`;
  }
  /* Goldene Pforte (Mosaik des Jüngsten Gerichts) am Fuß des Südturms, rechts daneben */
  k += `<path d="M8 -4 V-16 Q12 -21 16 -16 V-4 Z" fill="#7a6a4a"/><path d="M8.6 -15.2 Q12 -19.6 15.4 -15.2 V-10 H8.6 Z" fill="${GOLD}"/><path d="M9.6 -13 h4.8 M10 -11.5 h4" stroke="#b07a20" stroke-width=".3"/>`;
  /* Südturm (96,5 m): gotischer Schaft mit Goldgitter im großen Fenster, zwei Zifferblätter, Renaissance-Galerie, grüne Haube, goldene Spitze */
  k += `<rect x="-7" y="-58" width="14" height="58" fill="${S.lg("sturm", [[0, STEIN_L], [0.55, STEIN_M], [1, STEIN_S]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-3.4 -16 v-24 q3.4 -7 6.8 0 v24 Z" fill="#3f4658"/><path d="M-3.4 -16 v-24 q3.4 -7 6.8 0 v24" stroke="#efe8d8" stroke-width=".6" fill="none"/>`;
  let gg = "";
  for (let y = -18; y > -40; y -= 2.6) gg += `M-3.2 ${y} h6.4`;
  for (let x = -2.2; x < 3; x += 1.5) gg += `M${x} -16.5 v-23`;
  k += `<path d="${gg}" stroke="#e9c35a" stroke-width=".45"/>`;
  for (const [cy, rr] of [[-46, 2.6], [-52.5, 2.2]]) k += `<circle cx="0" cy="${cy}" r="${rr}" fill="#1f2a3a" stroke="${GOLD}" stroke-width=".7"/><path d="M0 ${cy} v${-rr * 0.7} M0 ${cy} l${rr * 0.5} ${rr * 0.2}" stroke="#e9c35a" stroke-width=".4"/>`;
  k += `<rect x="-8" y="-60" width="16" height="2.6" fill="#ece4d2"/><path d="M-8 -62.5 h16 M-7 -60 v-2.5 M-4.6 -60 v-2.5 M-2.2 -60 v-2.5 M.2 -60 v-2.5 M2.6 -60 v-2.5 M5 -60 v-2.5 M7 -60 v-2.5" stroke="#ece4d2" stroke-width=".6"/>`;
  k += `<path d="M-7 -62.5 Q-7.5 -70 -3.5 -73 Q0 -76 3.5 -73 Q7.5 -70 7 -62.5 Z" fill="${KUPFER}"/><path d="M-6.5 -63 Q-6.6 -69 -3.4 -72" stroke="#bfe6d2" stroke-width=".7" fill="none"/>`;
  k += `<rect x="-2.6" y="-79" width="5.2" height="6" fill="${KUPFER}"/><path d="M-3.4 -79 Q0 -86 3.4 -79 Z" fill="${KUPFER}"/><path d="M-1.4 -86 Q0 -92 1.4 -86 Z" fill="${KUPFER}"/>`;
  k += `<path d="M-1.6 -77.6 v-3 h1.2 v3 Z M.4 -77.6 v-3 h1.2 v3 Z" fill="#2f4a42"/><path d="M0 -92 V-96.5" stroke="${GOLD}" stroke-width="1"/><circle cx="0" cy="-92.6" r=".9" fill="${GOLD}"/>`;
  k += `</g>`;
  S.teil({ id: "veitsdom", de: "der Veitsdom", syl: "VEITS-dom", it: "la Cattedrale di San Vito", itSyl: "cat-te-DRA-le di san VI-to", en: "St Vitus Cathedral", x: x0, y: yb, steht: true, kunst: k,
    zoom: { x: 314, y: 35, w: 72, h: 48 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: x0, y: yb, kunst: flaeche(-7 * s, -96 * s, 14 * s, 96 * s, 0.3),
        tipp: "Dieser Turm heißt Südturm. Er ist fast 100 Meter hoch und hat oben eine grüne Haube." },
      { id: "strebebogen", de: "der Strebebogen", syl: "STRE-be-bo-gen", it: "l'arco rampante", itSyl: "AR-co ram-PAN-te", en: "flying buttress", x: r(x0 + 39 * s), y: yb, kunst: flaeche(-22 * s, -38 * s, 44 * s, 34 * s, 0.3),
        tipp: "Strebebögen stützen die hohen Mauern einer gotischen Kirche von außen." },
    ],
    tipp: "Der Veitsdom ist die größte Kirche Tschechiens. Man hat fast 600 Jahre an ihm gebaut." });
}

/* =====================================================================
   3 — DIE PRAGER BURG (lange helle Südfront über den Gärten)
   ===================================================================== */
{
  const d = 1050, s = F / d, x0 = r(XA(19)), yb = r(YD(d, 36));
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Südflügel (Theresianischer Umbau): lange helle Fassade, Mittelrisalit mit Giebel, zwei Geschossgesimse,
     regelmäßige Fensterachsen mit Schatten in den Laibungen, Dachgauben; Licht von links vorn */
  const fl = [[-170, -70, 22, 0], [-70, 60, 26, 1], [60, 112, 20, 2]];
  let fen = "", lai = "", gauben = "";
  for (const [a, b, h, i] of fl) {
    k += `<rect x="${a}" y="${-h}" width="${b - a}" height="${h}" fill="${["#f4ead6", "#faf3e6", "#efe4ce"][i]}"/>`;
    k += `<path d="M${a - 2} ${-h} L${a + 6} ${-h - 9} L${b - 6} ${-h - 9} L${b + 2} ${-h} Z" fill="${["#9a5240", "#6a8a7c", "#a05a44"][i]}"/><path d="M${a + 6} ${-h - 9} L${b - 6} ${-h - 9} L${b - 3} ${-h - 6} L${a + 3} ${-h - 6} Z" fill="#fff" opacity=".18"/>`;
    for (let x = a + 4; x < b - 3; x += 5.2) for (let y = -h + 4; y < -3; y += 6.4) { fen += `M${r(x)} ${r(y)}h2.2v3.4h-2.2Z`; lai += `M${r(x + 1.6)} ${r(y)}h.6v3.4h-.6Z`; }
    for (let x = a + 8; x < b - 8; x += 10.4) gauben += `M${r(x)} ${-h - 3} h2.4 v-2.2 l-1.2 -1.2 l-1.2 1.2 Z`;
    k += `<path d="M${a} ${r(-h * 0.5)} H${b}" stroke="#e2d4ba" stroke-width="1"/><path d="M${a} ${r(-h * 0.5 + 0.8)} H${b}" stroke="#b8aa92" stroke-width=".6" opacity=".6"/>`;
    k += `<rect x="${a}" y="${-h}" width="${b - a}" height="1.6" fill="#fffaf0"/><rect x="${a}" y="${-h + 1.6}" width="${b - a}" height="1" fill="#c9bba2" opacity=".6"/>`;
  }
  k += `<path d="${fen}" fill="#5c6274"/><path d="${lai}" fill="#2e3242" opacity=".6"/><path d="${gauben}" fill="#efe4ce"/>`;
  /* Mittelrisalit mit Dreiecksgiebel */
  k += `<rect x="-12" y="-28" width="24" height="28" fill="#fdf8ee"/><rect x="9" y="-28" width="3" height="28" fill="#d9ccb4"/><path d="M-13 -28 L0 -34 L13 -28 Z" fill="#fdf8ee" stroke="#c9bba2" stroke-width=".6"/>`;
  k += `<path d="M-8 -6 h4 v-10 h-4 Z M4 -6 h4 v-10 h-4 Z M-2 -6 h4 v-12 q-2 -3 -4 0 Z" fill="#5c6274"/>`;
  /* Gartenmauer mit Terrassen, Licht oben */
  k += `<rect x="-172" y="-1" width="286" height="8" fill="#d9ceb6"/><path d="M-172 -.6 H114" stroke="#fff8ea" stroke-width=".8"/><path d="M-172 7 L114 7" stroke="#a89c86" stroke-width="1.2"/>`;
  /* rechts: die Basilika St. Georg (zwei helle Türme, rote Fassade) */
  k += `<rect x="94" y="-26" width="16" height="6" fill="#c9644a"/><rect x="96" y="-44" width="5" height="22" fill="#f6efe0"/><rect x="104" y="-41" width="5" height="19" fill="#e2d6be"/><path d="M95.6 -44 L98.5 -50 L101.4 -44 Z M103.6 -41 L106.5 -47 L109.4 -41 Z" fill="#7d4a3a"/>`;
  k += `</g>`;
  S.teil({ id: "prager_burg", de: "die Prager Burg", syl: "PRA-ger BURG", it: "il Castello di Praga", itSyl: "ca-STEL-lo di PRA-ga", en: "Prague Castle", x: x0, y: yb, steht: true, kunst: k,
    tipp: "Die Prager Burg ist eine der größten Burganlagen der Welt." });
}

/* =====================================================================
   4 — DIE NIKOLAUSKIRCHE auf der Kleinseite (Kuppel und Glockenturm)
   ===================================================================== */
{
  const d = 744, s = F / d, x0 = r(XA(5)), yb = r(YD(d, -4));
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Kirchenschiff: warmer heller Putz mit weißen Doppelpilastern, Balustrade mit Figuren; Tambour mit ovalen
     Fenstern; große Kupferkuppel mit Rippen und Patina-Lichtern, hohe Laterne. Licht von links vorn. */
  k += `<path d="M-35 -31 L-29 -36.5 L7 -36.5 L11 -31 Z" fill="#7a9a88"/><rect x="-34" y="-30" width="44" height="30" fill="${S.lg("nikw", [[0, "#fbf0dc"], [0.7, "#f0dfc4"], [1, "#d8c4a6"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-34 -30 H10 V-28 H-34 Z" fill="#fffaf0"/><path d="M-31 -28 V-4 M-29.6 -28 V-4 M-21 -28 V-4 M-19.6 -28 V-4 M-11 -28 V-4 M-9.6 -28 V-4 M-1 -28 V-4 M.4 -28 V-4" stroke="#fffaf0" stroke-width=".9"/>`;
  k += `<path d="M-27 -10 V-22 Q-25 -25.5 -23 -22 V-10 Z M-17 -10 V-22 Q-15 -25.5 -13 -22 V-10 Z M-7 -10 V-22 Q-5 -25.5 -3 -22 V-10 Z" fill="#6c7288"/>`;
  /* Hauptgesims mit Schattenfuge, Attika mit Balustrade, Figuren darauf */
  let bal = "", fig = "";
  for (let x = -33.4; x < 9.6; x += 1.1) bal += `M${r(x)} -32.6 v1.6`;
  for (const x of [-31, -25, 1, 7]) fig += `M${x - 0.7} -33.2 v-2.8 q.7 -1.5 1.4 0 v2.8 Z M${x - 0.45} -37.2 a.45 .5 0 1 1 .9 0 a.45 .5 0 1 1 -.9 0Z`;
  k += `<path d="M-35 -30.6 H11 V-28.4 H-35Z M-34.4 -33.4 H10.4 V-32.6 H-34.4Z M-34 -31 H10 V-30.6 H-34Z" fill="#fffaf0"/><path d="M-35 -28.4 H11 V-27.8 H-35Z" fill="#b9a587" opacity=".7"/><path d="${bal}" stroke="#f1e6d0" stroke-width=".55"/><path d="${fig}" fill="#e6dcc8"/><path d="${fig.replace(/v-2.8 q.7 -1.5 1.4 0/g, "v-2.8 q.35 -.8 .5 -.4")}" fill="#b9a98e" opacity=".5"/>`;
  k += `<rect x="-24.5" y="-49" width="21" height="12" fill="${S.lg("tamb", [[0, "#fff8ea"], [0.6, "#efe0c6"], [1, "#cdb898"]], 0, 0, 1, 0)}"/>`;
  let tf = "";
  for (const x of [-21, -16.5, -12, -7.5]) tf += `M${x + 1} -43 m-1.1 0 a1.1 2 0 1 0 2.2 0 a1.1 2 0 1 0 -2.2 0`;
  k += `<path d="${tf}" fill="#5c6274" stroke="#fffaf0" stroke-width=".4"/><path d="M-24 -38 V-48.5 M-23 -38 V-48.5 M-5 -38 V-48.5 M-4 -38 V-48.5" stroke="#fffaf0" stroke-width=".6"/><rect x="-25.5" y="-50" width="23" height="1.8" fill="#fffaf0"/>`;
  k += `<path d="M-25 -50 Q-25 -67 -14 -69 Q-3 -67 -3 -50 Z" fill="${KUPFER}"/>`;
  k += `<path d="M-21 -50.5 Q-21 -64 -14 -68.5 M-17.5 -50.5 Q-17.5 -64 -14 -68.5 M-10.5 -50.5 Q-10.5 -64 -14 -68.5 M-7 -50.5 Q-7 -64 -14 -68.5" stroke="#3f7562" stroke-width=".5" fill="none"/><path d="M-23.5 -51 Q-23 -63 -16 -67.5" stroke="#c8ecd8" stroke-width=".9" fill="none" opacity=".8"/>`;
  k += `<rect x="-16.2" y="-76" width="4.4" height="7" fill="#f6ead4"/><rect x="-16.2" y="-76" width="1.2" height="7" fill="#fffaf0"/><path d="M-15 -73.5 v-1.6 q.5 -.8 1 0 v1.6 Z M-13.2 -73.5 v-1.6 q.5 -.8 1 0 v1.6 Z" fill="#5c6274"/>`;
  k += `<path d="M-17 -76 Q-14 -81 -11 -76 Z" fill="${KUPFER}"/><path d="M-14 -81 V-85 M-15.2 -83.6 h2.4" stroke="#d6a93a" stroke-width=".6"/><circle cx="-14" cy="-81.2" r=".6" fill="#d6a93a"/>`;
  /* geschwungener Westgiebel vor der Trommel, mit ovalem Fenster */
  k += `<path d="M-20 -33.4 Q-20.5 -38 -12 -39.6 Q-3.5 -38 -4 -33.4 Z" fill="#f6ead4"/><path d="M-20 -33.4 Q-20.5 -38 -12 -39.6 Q-3.5 -38 -4 -33.4" stroke="#fffaf0" stroke-width=".9" fill="none"/><ellipse cx="-12" cy="-36" rx="1.3" ry="1.8" fill="#6c7288" stroke="#fffaf0" stroke-width=".4"/><path d="M-12 -39.6 v-1.6" stroke="#d6a93a" stroke-width=".4"/>`;
  /* Glockenturm rechts (79 m): heller Schaft mit Pilastern, Galerie mit Balustrade, geschwungene Barockhaube */
  k += `<rect x="14" y="-58" width="10" height="58" fill="${S.lg("glt", [[0, "#fffaf0"], [0.6, "#efdfc2"], [1, "#cdb898"]], 0, 0, 1, 0)}"/><path d="M14.6 -58 V-4 M23.4 -58 V-4" stroke="#fffaf0" stroke-width=".7"/>`;
  k += `<path d="M16 -48 v-5.5 q3 -3.4 6 0 v5.5 Z M16.6 -34 v-5 q2.4 -2.4 4.8 0 v5 Z" fill="#5c6274"/><rect x="12.6" y="-59.4" width="12.8" height="1.8" fill="#fffaf0"/>`;
  k += `<rect x="21.6" y="-58" width="2.4" height="58" fill="#b9a587" opacity=".55"/><path d="M13.4 -42 h11.2 M13.4 -27 h11.2" stroke="#fffaf0" stroke-width="1.1"/><path d="M13.4 -41.2 h11.2 M13.4 -26.2 h11.2" stroke="#a8977c" stroke-width=".5"/>`;
  k += `<path d="M13 -61.6 h12 M13.4 -59.4 v-2.2 M15.4 -59.4 v-2.2 M17.4 -59.4 v-2.2 M19.4 -59.4 v-2.2 M21.4 -59.4 v-2.2 M23.4 -59.4 v-2.2 M24.6 -59.4 v-2.2" stroke="#fffaf0" stroke-width=".45"/>`;
  k += `<path d="M12.8 -61.6 C12.8 -64.2 15.4 -64.8 16.5 -67 C17.3 -68.8 17.5 -70.2 19 -70.8 C20.5 -70.2 20.7 -68.8 21.5 -67 C22.6 -64.8 25.2 -64.2 25.2 -61.6 Z" fill="${KUPFER}"/><path d="M13.6 -62 C13.8 -64 15.6 -64.8 16.6 -66.6" stroke="#c8ecd8" stroke-width=".6" fill="none"/>`;
  k += `<rect x="17.5" y="-74" width="3" height="3.4" fill="#f6ead4"/><path d="M18.2 -71.4 v-1.6 h.6 v1.6Z" fill="#5c6274"/><path d="M17 -74 Q16.8 -76 19 -77.6 Q21.2 -76 21 -74 Z" fill="${KUPFER}"/><path d="M19 -77.6 V-81" stroke="#d6a93a" stroke-width=".6"/><circle cx="19" cy="-78.4" r=".45" fill="#d6a93a"/>`;
  k += `</g>`;
  /* der untere Teil steht hinter den Häusern der Kleinseite: dort abschneiden */
  S.def(`<clipPath id="${S.id("nikclip")}"><rect x="-40" y="-60" width="80" height="${r(60 + (98.2 - yb))}"/></clipPath>`);
  k = `<g clip-path="url(#${S.id("nikclip")})">${k}</g>`;
  S.teil({ id: "nikolauskirche", de: "die Nikolauskirche", syl: "NI-ko-laus-kir-che", it: "la chiesa di San Nicola", itSyl: "CHIE-sa di san ni-CO-la", en: "St Nicholas Church", x: x0, y: yb, steht: true, kunst: k,
    zoom: { x: 204, y: 54, w: 60, h: 40 },
    unter: [{ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: r(x0 - 14 * s), y: r(yb - 58 * s), kunst: flaecheEllipse(0, 0, 12 * s, 11 * s),
      tipp: "Die grüne Kuppel ist aus Kupfer. Mit der Zeit ist das Kupfer grün geworden." }],
    tipp: "Die Nikolauskirche ist eine der schönsten Barockkirchen in Prag." });
}

/* =====================================================================
   5 — DIE MOLDAU (Wasser mit Himmelsspiegelung, Wellen, Wehr)
   ===================================================================== */
{
  let k = `<path d="M0 120.2 L110 117.7 L150 116.2 L400 114.7 L400 260 L0 260 Z" fill="${S.lg("wasser", [[0, "#a9bcc2"], [0.12, "#86a2aa"], [0.5, "#5f7d86"], [1, "#4a6670"]])}"/>`;
  /* Spiegelung der hellen Ufer und des Himmels (weich) */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".45"><path d="M150 116.2 L400 114.7 L400 122 L150 123 Z" fill="#efe0c4"/><path d="M0 120.2 L110 117.7 L110 124 L0 127 Z" fill="#9fb48e"/></g>`;
  /* Spiegelbild der Kleinseitner Häuser: senkrechte, weiche Farbstreifen unter dem Ufer */
  let sp = "";
  const zs = zufall(23);
  for (let x = 140; x < 400; x += 4 + zs() * 6) sp += `<rect x="${r(x)}" y="117" width="${r(3 + zs() * 4)}" height="${r(5 + zs() * 7)}" fill="${["#efd3ac", "#f2d4bf", "#b8573a", "#f8ead6", "#ead9a8"][Math.floor(zs() * 5)]}"/>`;
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".32">${sp}</g>`;
  /* Wellen: kurze helle (Himmel) und dunkle Striche, nach vorn größer; Sonnenglitzer links (zur Sonne hin) */
  let hell = "", dunkel = "", glitz = "";
  for (let i = 0; i < 210; i++) {
    const y = 118 + Math.pow(rnd(), 1.5) * 90, w = 0.8 + (y - 116) * 0.06 + rnd() * 1.5, x = rnd() * (399 - w);
    if (rnd() < 0.55) hell += `M${r(x)} ${r(y)}h${r(w)}`; else dunkel += `M${r(x)} ${r(y)}h${r(w)}`;
    if (x < 120 && rnd() < 0.3) glitz += `M${r(x)} ${r(y - 0.3)}h${r(w * 0.5)}`;
  }
  k += `<path d="${hell}" stroke="#dbe9f0" stroke-width=".35" opacity=".6"/><path d="${dunkel}" stroke="#36515b" stroke-width=".35" opacity=".45"/><path d="${glitz}" stroke="#fff6dc" stroke-width=".45" opacity=".9"/>`;
  /* Morgendunst über dem Wasser */
  k += `<rect x="0" y="114" width="400" height="22" fill="${S.lg("wdunst", [[0, "#f6ead2", 0.55], [1, "#f6ead2", 0]])}" pointer-events="none"/>`;
  /* das Altstädter Wehr: schäumende schräge Linie links */
  k += `<path d="M0 140 Q40 132 100 121.5 L103 122.3 Q44 135 0 146 Z" fill="${S.lg("wehr", [[0, "#ffffff", 0.6], [1, "#dfe9ee", 0.1]])}"/><path d="M0 140 Q40 132 100 121.5" stroke="#f4f8fa" stroke-width=".5" stroke-dasharray="1 .7" opacity=".9" fill="none"/>`;
  /* Kampa: Ufermauer links, Kleinseitner Ufermauer rechts */
  k += `<path d="M0 120.2 L110 117.7 L110 118.8 L0 121.4 Z" fill="#c4b79e"/><path d="M150 116.2 L400 114.7 L400 115.8 L150 117.4 Z" fill="#d3c7ae"/>`;
  S.teil({ id: "moldau", de: "die Moldau", syl: "MOL-dau", it: "la Moldava", itSyl: "mol-DA-va", en: "Vltava", x: 0, y: 0, kunst: k,
    tipp: "Die Moldau fließt mitten durch Prag. Der Komponist Smetana hat ein berühmtes Stück über sie geschrieben." });
}

/* =====================================================================
   6 — AUF DER MOLDAU: Ausflugsschiff, Tretboot, Schwan
   ===================================================================== */
{
  /* Ausflugsschiff mit Glasdach, von der Seite (fährt flussabwärts nach rechts) */
  const s0 = 150, qa = 46, qb = 76;
  const A = (q, h) => P(s0, q, -13 + h);
  let k = "";
  /* Spiegelung */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".22"><path d="M${A(qa, 0)} L${A(qb, 0)} L${A(qb - 1, -1.8)} L${A(qa + 1, -1.8)}Z" fill="#f4f4f0"/><path d="M${A(qa, -0.9)} L${A(qb, -0.9)} L${A(qb - 1, -1.3)} L${A(qa + 1, -1.3)}Z" fill="#1f4e8c"/></g>`;
  /* Rumpf weiß mit blauem Streifen, Bug rechts spitz */
  k += `<path d="M${A(qa, 0.2)} L${A(qb - 3, 0.2)} L${A(qb + 1, 2.2)} L${A(qa - 0.5, 2.2)}Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d7dde2"]])}"/>`;
  k += `<path d="M${A(qa - 0.3, 1.4)} L${A(qb, 1.4)} L${A(qb + 0.5, 1.8)} L${A(qa - 0.4, 1.8)}Z" fill="#1f4e8c"/>`;
  /* Aufbau mit Glasdach und Fensterreihe, Fahrgäste */
  k += `<path d="M${A(qa + 1.5, 2.2)} L${A(qb - 5, 2.2)} L${A(qb - 5, 4.4)} L${A(qa + 1.5, 4.4)}Z" fill="#eef1f3"/>`;
  k += `<path d="M${A(qa + 2, 2.7)} L${A(qb - 5.5, 2.7)} L${A(qb - 5.5, 4)} L${A(qa + 2, 4)}Z" fill="${S.lg("glasbg", [[0, "#9fc4dc"], [1, "#4a6f88"]])}"/>`;
  let fg = "";
  for (let q = qa + 3; q < qb - 6; q += 1.6) fg += `M${A(q, 2.7)} L${A(q, 4)}`;
  k += `<path d="${fg}" stroke="#eef1f3" stroke-width=".35"/>`;
  for (let q = qa + 3.2; q < qb - 6; q += 2.3) { const [x, y] = A(q, 3.2).split(" ").map(Number); k += `<circle cx="${r(x)}" cy="${r(y)}" r=".55" fill="${["#d8a986", "#8a5a3a", "#e6c09a"][Math.floor(rnd() * 3)]}"/>`; }
  k += `<path d="M${A(qa + 1.2, 4.4)} L${A(qb - 4.6, 4.4)} L${A(qb - 5.2, 5.1)} L${A(qa + 1.8, 5.1)}Z" fill="#cfe2ee" opacity=".9"/>`;
  k += `<path d="M${A(qb - 4, 2.2)} L${A(qb - 2, 2.2)} L${A(qb - 2, 4.6)} L${A(qb - 4, 4.6)}Z" fill="#f6f6f2"/><path d="M${A(qb - 3.6, 3.4)} L${A(qb - 2.4, 3.4)} L${A(qb - 2.4, 4.2)} L${A(qb - 3.6, 4.2)}Z" fill="#3b5266"/>`;
  k += `<path d="M${A(qa + 0.6, 4.4)} L${A(qa + 0.6, 6.6)}" stroke="#c0392b" stroke-width=".4"/><path d="M${A(qa + 0.6, 6.6)} L${A(qa - 1.2, 6.2)} L${A(qa + 0.6, 5.8)}Z" fill="#fff"/><path d="M${A(qa + 0.6, 6.2)} L${A(qa - 1.2, 6.2)} L${A(qa + 0.6, 5.8)}Z" fill="#11457e"/>`;
  /* offenes Oberdeck hinten mit Geländer und Fahrgästen */
  k += `<path d="M${A(qa + 1.5, 5.1)} L${A(qa + 9, 5.1)} M${A(qa + 1.5, 5.9)} L${A(qa + 9, 5.9)}" stroke="#f4f4f0" stroke-width=".35"/>`;
  for (const [q, c] of [[qa + 3, "#c0392b"], [qa + 4.6, "#f2c230"], [qa + 6.8, "#2f5f95"], [qa + 8, "#e8e4dc"]]) { const [x, y] = A(q, 5.1).split(" ").map(Number); k += `<rect x="${r(x - 0.5)}" y="${r(y - 2.2)}" width="1" height="2" rx=".3" fill="${c}"/><circle cx="${r(x)}" cy="${r(y - 2.6)}" r=".5" fill="#d8a986"/>`; }
  /* Bugwelle und Kielwasser */
  k += `<path d="M${A(qb - 9, -0.15)} Q${A(qb - 5, -0.45)} ${A(qb - 2.6, 0.3)}" stroke="#fff" stroke-width=".8" fill="none" opacity=".85"/><path d="M${A(qa - 0.5, 0)} L${A(qa - 22, -0.8)} M${A(qa - 0.5, 0.2)} L${A(qa - 18, 1)} M${A(qa - 2, 0.1)} L${A(qa - 26, 0.1)}" stroke="#e8f2f6" stroke-width=".5" opacity=".7"/>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "sightseeing boat", x: 0, y: 0, kunst: k,
    tipp: "Mit dem Ausflugsschiff fährt man unter der Karlsbrücke hindurch." });
}
{
  /* gewöhnliches Tretboot (gelber Rumpf, weißes Sonnendach), weit rechts draußen – nicht neben den Schwänen */
  const s0 = 118, q0 = 74, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0, -13));
  let k = `<g transform="scale(${sc.toFixed(4)})"><ellipse cx="0" cy=".14" rx="2" ry=".22" fill="#2f4a55" opacity=".3"/>`;
  k += `<path d="M-1.5 0 L-1.68 -.52 H1.58 L1.42 0 Q0 .13 -1.5 0Z" fill="${S.lg("tret", [[0, "#ffd94a"], [1, "#d29d12"]])}"/><path d="M-1.68 -.52 H1.58 V-.43 H-1.68Z" fill="#fff4b8"/><path d="M-1.5 -.2 H1.45" stroke="#b8860b" stroke-width=".05"/>`;
  k += `<path d="M-.6 -.5 v-.46 q.18 -.06 .36 0 v.46Z" fill="#2f6fb3"/><circle cx="-.42" cy="-1.1" r=".14" fill="#d8a986"/><path d="M-.56 -1.16 q.14 -.16 .3 0Z" fill="#c0392b"/>`;
  k += `<path d="M.08 -.5 v-.43 q.17 -.06 .34 0 v.43Z" fill="#e8e4dc"/><circle cx=".25" cy="-1.06" r=".13" fill="#e0b48c"/><path d="M.12 -1.1 q.13 -.14 .27 0 v.12 h-.27Z" fill="#6b4a32"/>`;
  k += `<path d="M-1.25 -.5 V-1.5 M1.05 -.5 V-1.5" stroke="#e6e6e2" stroke-width=".07"/><path d="M-1.5 -1.48 H1.3 L1.08 -1.66 H-1.28Z" fill="#f6f6f2"/><path d="M-1.5 -1.48 H1.3 V-1.42 H-1.5Z" fill="#c4c4be"/>`;
  k += `<path d="M-2.4 .12 q1 .2 2 0 q1 -.2 2.5 0" stroke="#e8f2f6" stroke-width=".07" fill="none"/></g>`;
  S.teil({ oben: true, id: "tretboot", de: "das Tretboot", syl: "TRET-boot", it: "il pedalò", itSyl: "pe-da-LÒ", en: "pedal boat", x, y, steht: true, kunst: k,
    tipp: "Auf der Moldau kann man ein Tretboot ausleihen. Man tritt in die Pedale wie beim Fahrrad." });
}
{
  /* Schwan auf dem Wasser */
  /* Schwanenfamilie: zwei weiße Altvögel und drei graubraune Junge, in einer Reihe */
  const SW = S.lg("schwan", [[0, "#ffffff"], [1, "#d9dfe4"]]);
  const schwan = (s0, q0, gross, farbe, dreh = 1) => {
    const sc = F / Dd(s0, q0) * gross, x = X(s0, q0), y = Y(s0, q0, -13);
    let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${(sc * dreh).toFixed(4)} ${sc.toFixed(4)})">`;
    g += `<ellipse cx="0" cy=".05" rx=".75" ry=".1" fill="#2f4a55" opacity=".3"/><path d="M-.9 .06 q.45 .12 .9 0 q.45 -.12 .9 0" stroke="#e8f2f6" stroke-width=".05" fill="none"/>`;
    g += `<path d="M-.6 0 Q-.75 -.32 -.45 -.38 Q-.1 -.45 .25 -.3 Q.4 -.22 .4 0 Z" fill="${farbe}"/>`;
    if (gross > 0.8) g += `<path d="M-.55 -.32 Q-.75 -.52 -.48 -.56 Q-.28 -.44 -.18 -.38 Z" fill="#fff"/><path d="M-.45 -.36 Q-.2 -.42 .1 -.32" stroke="#c9d2da" stroke-width=".03" fill="none"/>`;
    g += `<path d="M.25 -.28 Q.42 -.5 .34 -.75 Q.3 -.92 .44 -.94 Q.56 -.93 .58 -.86 L.7 -.82 L.57 -.79 Q.5 -.8 .48 -.74 Q.56 -.5 .4 -.24 Z" fill="${farbe}"/>`;
    g += `<path d="M.58 -.86 L.71 -.82 L.57 -.78 Z" fill="${gross > 0.8 ? "#e36a2a" : "#4a4a4a"}"/><circle cx=".5" cy="-.88" r=".025" fill="#1d1d22"/></g>`;
    return g;
  };
  /* Runde 3: nach vorn an den rechten Brückenpfeiler geholt und größer (Altvögel ≈ 9 Einheiten lang) */
  let k = schwan(78, 43, 1.45, SW) + schwan(80.2, 45.6, 0.75, "#8f8a80") + schwan(81.9, 47.3, 0.75, "#9a9488") + schwan(83.6, 49, 0.75, "#8f8a80") + schwan(87, 52, 1.45, SW, -1);
  const xa = X(78, 43), xb = X(87, 52), yy = Y(82, 47, -13);
  S.teil({ oben: true, id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: 0, y: 0, steht: true, kunst: k + flaeche(Math.min(xa, xb) - 5, yy - 8, Math.abs(xb - xa) + 10, 10, 0.6),
    tipp: "An der Karlsbrücke schwimmen viele Schwäne. Die Jungen sind graubraun, erst später werden sie weiß." });
}

/* =====================================================================
   7 — DIE KLEINSEITNER BRÜCKENTÜRME (links Judithturm, rechts der hohe Turm)
   ===================================================================== */
{
  const s0 = 512, s = F / Dd(s0, 0), x0 = r(X(s0, 0)), yb = r(Y(s0, 0));
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Judithturm (romanisch, ~ 21 m): grauer Bruchstein, dunkles Zeltdach, kleine Fenster; links */
  k += `<rect x="-13.5" y="-21" width="8.5" height="21" fill="${S.lg("judith", [[0, "#b3ac9f"], [0.7, "#9a9286"], [1, "#7f786d"]], 0, 0, 1, 0)}"/>`;
  let bs = "";
  const zb = zufall(5);
  for (let y = -20; y < -0.5; y += 1.3) for (let x = -13.2 + zb() * 0.8; x < -5.6; x += 1.2 + zb() * 1.2) bs += `M${r(x)} ${r(y + zb() * 0.3)}h${r(0.5 + zb() * 0.8)}`;
  k += `<path d="${bs}" stroke="#6f685e" stroke-width=".28" opacity=".6"/><rect x="-13.5" y="-21" width="1.4" height="21" fill="#d9d2c4" opacity=".45"/>`;
  k += `<path d="M-13.9 -21 L-9.25 -28.5 L-4.6 -21 Z" fill="#3f3d42"/><path d="M-13.9 -21 L-9.25 -28.5 L-10.6 -21 Z" fill="#5a5860"/><path d="M-9.25 -28.5 V-29.8" stroke="#6f6a5e" stroke-width=".35"/>`;
  k += `<path d="M-10.6 -12 v-2.2 q.6 -.9 1.2 0 v2.2 Z M-8.4 -16.5 v-1.6 q.5 -.7 1 0 v1.6 Z M-11.6 -17 v-1.4 q.4 -.6 .8 0 v1.4 Z" fill="#2f3038"/>`;
  /* Torbogen mit Zinnen zwischen den Türmen */
  k += `<rect x="-5" y="-15" width="10" height="15" fill="#8d8478"/><path d="M-3 0 V-7 Q0 -11 3 0 Z" fill="#2c2a2e"/><path d="M-3 0 V-7 Q0 -10.6 3 -7 V0" fill="#2c2a2e"/>`;
  let zi = "";
  for (let x = -5; x < 5; x += 2) zi += `M${x} -15 v-1.4 h1.2 v1.4Z`;
  k += `<path d="${zi}" fill="#8d8478"/>`;
  /* der hohe gotische Turm (43,5 m) rechts: dunkler Stein, Blendmaßwerk, steiles Schieferdach mit Ecktürmchen */
  k += `<rect x="5" y="-29" width="10.5" height="29" fill="${S.lg("mturm", [[0, "#9a9285"], [1, "#6f685f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M5.4 -24 h9.7 M5.4 -12 h9.7" stroke="#b3a996" stroke-width=".5"/>`;
  k += `<path d="M7 -8 v-6 q3.5 -4 7 0 v6 M7 -18 v-4 q3.5 -3 7 0 v4" stroke="#c9c0b0" stroke-width=".5" fill="none"/>`;
  k += `<rect x="4.4" y="-30.4" width="11.7" height="1.6" fill="#a59c8c"/>`;
  k += `<path d="M5 -30.4 L10.25 -43.5 L15.5 -30.4 Z" fill="${SCHIEFER}"/><path d="M5 -30.4 L10.25 -43.5 L8.4 -30.4 Z" fill="#6c717c"/><path d="M10.25 -43.5 V-45.2" stroke="#d6a93a" stroke-width=".5"/>`;
  for (const x of [5, 15.5]) k += `<rect x="${x - 0.8}" y="-32.6" width="1.6" height="2.4" fill="#8f877b"/><path d="M${x - 1} -32.6 L${x} -36.4 L${x + 1} -32.6 Z" fill="#4a4e58"/>`;
  k += `<path d="M9.4 -34.5 l.85 -2.4 l.85 2.4 Z" fill="#7d838e"/>`;
  k += `</g>`;
  S.teil({ id: "brueckenturm", de: "der Brückenturm", syl: "BRÜ-cken-turm", it: "la torre del ponte", itSyl: "TOR-re del PON-te", en: "bridge tower", x: x0, y: yb, steht: true, kunst: k + flaeche(-14 * s, -44 * s, 31 * s, 44 * s, 0.6),
    zoom: { x: 84, y: 65, w: 64, h: 43 },
    unter: [{ id: "tor", de: "das Tor", syl: "TOR", it: "la porta", itSyl: "POR-ta", en: "gate", x: x0, y: yb, kunst: flaeche(-3.4 * s, -12 * s, 6.8 * s, 12 * s, 0.3),
      tipp: "Durch das Tor zwischen den beiden Türmen kommt man in die Kleinseite." }],
    tipp: "An beiden Enden der Karlsbrücke steht ein Brückenturm. Davor, auf der Brücke, steht der heilige Nepomuk mit fünf goldenen Sternen." });
  var TURM_TEIL = S.teile[S.teile.length - 1];
}

/* =====================================================================
   8 — DIE KARLSBRÜCKE (Fahrbahn mit Pflaster, Brüstungen aus Sandstein)
   Runde 3 (Antippbarkeit): Nur der nahe Teil bis 60 m ist das Teil „die Karlsbrücke“.
   Der ferne Teil mit den fernen Statuen und Laternen gehört zur Kulisse – so meldet
   weder der Himmel noch die Häuserzeile am Ufer ein falsches Wort.
   ===================================================================== */
const BR = 4.75, BRH = 1.1, BRD = 0.6, QI = BR - BRD, NAHE = 60;   /* halbe Breite, Brüstungshöhe, -dicke */
const STATUEN = [];   /* [s, Seite(-1/+1)] — über den Pfeilern, alle ~31 m */
for (let i = 0; i < 15; i++) { STATUEN.push([34 + i * 31, 1]); STATUEN.push([30 + i * 31.4, -1]); }
/* Laternen auf der Brüstung, je etwa 10 m hinter einer Statue (nie hinter einem Statuenkopf) */
const LATERNEN = [[20, -1], [40, -1], [46, 1]];
for (let i = 1; i < 15; i++) { if (30 + i * 31.4 + 10 < 500) LATERNEN.push([30 + i * 31.4 + 10, -1]); if (34 + i * 31 + 12 < 500 && i !== 6) LATERNEN.push([34 + i * 31 + 12, 1]); }   /* vor Nepomuk keine Laterne: die Tafel bleibt frei */
/* Sonne links hinten (Ostsüdost, 35° hoch): Schatten fallen nach vorn und 27° nach rechts, Länge 1,43 × Höhe */
const SDS = 0.89 * 1.43, SDQ = 0.45 * 1.43;
const BRUECKE_SCHATTEN = [];
const PFL = S.lg("pflaster", [[0, "#cbbba3"], [0.07, "#b9a88f"], [0.3, "#a5967f"], [1, "#857868"]], 0, 102, 0, 260, ' gradientUnits="userSpaceOnUse"');
const SAND_L = S.lg("sandl", [[0, "#b9ab94"], [0.2, "#a59782"], [1, "#8c7e6b"]], 0, 102, 0, 260, ' gradientUnits="userSpaceOnUse"');
const SAND_S = S.lg("sands", [[0, "#857b6f"], [0.2, "#5e564f"], [1, "#4a443f"]], 0, 102, 0, 260, ' gradientUnits="userSpaceOnUse"');
/* Schatten einer Statue (Sockel 2,6 m, Figur bis 5,6 m) auf der Fahrbahn: breites Band schräg nach vorn rechts */
const statuenSchatten = (s) => {
  /* Runde 4: Sockelblock (2,3 m lang, Innenseite bündig mit der Brüstung, 2,6 m hoch) und Figurenkeil (bis 5,6 m);
     beide in einer Gruppe, damit die Überdeckung nicht doppelt dunkel wird */
  const sk = (ds, h) => P(s + ds + h * SDS, -QI + h * SDQ), fg = (ds, h) => P(s + ds + h * SDS, -BR - 0.2 + h * SDQ);
  return `<g opacity=".42">${poly([sk(-1.15, 0), sk(1.15, 0), sk(1.15, 2.6), sk(-1.15, 2.6)], "#2b2a3a")}${poly([fg(-0.7, 2.6), fg(0.7, 2.6), fg(0.55, 4.5), fg(0.3, 5.6), fg(-0.3, 5.6), fg(-0.55, 4.5)], "#2b2a3a")}</g>`;
};
const laternenSchatten = (s) => strecke(P(s + BRH * SDS, -QI + 0.4), P(s + 4.3 * SDS, -BR + 0.3 + 4.3 * SDQ));
function bruecke(S0, S1) {
  const nah = S0 < 10;
  let k = poly([P(S0, -QI, 0), P(S1, -QI, 0), P(S1, QI, 0), P(S0, QI, 0)], PFL);
  if (nah) {
    /* Kopfsteinpflaster vorn: Reihen kleiner Granitsteine (Strich mit Lücken = Fugen) */
    let reihen = "";
    for (let s = 5, i = 0; s < 24; s += 0.24, i++) {
      const a = P(s + 0.1, -QI).split(" ").map(Number), b = P(s + 0.1, QI).split(" ").map(Number), dd = Dd(s, 0), w = 0.16 * F / dd;
      const hh = Math.abs(Y(s, 0) - Y(s + 0.24, 0)) * 0.78;
      const seg = strecke(`${a[0]} ${a[1]}`, `${b[0]} ${b[1]}`);
      if (seg) reihen += `<path d="${seg}" stroke="${["#9c8d78", "#a99a84", "#958671", "#b0a18a"][i % 4]}" stroke-width="${Math.round(hh * 20) / 20}" stroke-dasharray="${Math.round(w * 8.4) / 10} ${Math.max(0.1, Math.round(w * 1.6) / 10)}" stroke-dashoffset="${Math.round(rnd() * w * 10) / 10}"/>`;
    }
    k += `<g pointer-events="none">${reihen}</g>`;
  }
  /* Längs- und Querfugen in der Flucht */
  const a = Math.max(S0, 24), b = Math.min(S1, 160);
  if (a < b) {
    let fu = "", qu = "";
    for (let q = -QI + 0.35; q < QI; q += 0.35) fu += strecke(P(a, q), P(b, q));
    for (let s = 24; s < 160; s += s < 40 ? 0.4 : s < 80 ? 0.8 : 1.6) if (s >= S0 && s <= S1) qu += strecke(P(s, -QI), P(s, QI));
    k += `<path d="${fu}" stroke="#6d6253" stroke-width=".16" opacity=".4"/><path d="${qu}" stroke="#6d6253" stroke-width=".14" opacity=".35"/>`;
  }
  if (nah) {
    /* Lichtkuppen auf den Steinen, nur vorn */
    let st = "";
    for (let i = 0; i < 200; i++) { const s = 5 + Math.pow(rnd(), 1.6) * 20, q = -QI + rnd() * 2 * QI; const [x, y] = P(s, q).split(" ").map(Number); if (y < 259 && x > 1 && x < 398) st += `M${r(x)} ${r(y)}h${r(0.3 + 12 / s)}`; }
    k += `<path d="${st}" stroke="#eadfcb" stroke-width=".45" opacity=".55"/>`;
  }
  /* Brüstungen: drei Quaderlagen mit versetzten Stoßfugen, darüber die Abdeckplatte (Stirnkante steht vor,
     dunkle Schattenfuge darunter, Oberseite hell); links Schattenseite, rechts Sonnenseite */
  const bruestung = (q0, innen, seite) => {
    const L = seite > 0, qv = innen - seite * 0.05, HP = BRH - 0.16;
    let g = poly([P(S0, innen, 0), P(S1, innen, 0), P(S1, innen, HP), P(S0, innen, HP)], L ? SAND_L : SAND_S);
    let f = strecke(P(S0, innen, 0.32), P(S1, innen, 0.32)) + strecke(P(S0, innen, 0.64), P(S1, innen, 0.64));
    for (let c = 0; c < 3; c++) {
      const h0 = c * 0.32, h1 = Math.min(HP, h0 + 0.32), L0 = 1.3;
      for (let s = S0 + (c % 2 ? L0 / 2 : 0.2); s < Math.min(S1, nah ? 60 : 120); s += s < 40 ? L0 : 1.8) if (nah || c === 1) f += strecke(P(s, innen, h0), P(s, innen, c === 1 && !nah ? HP : h1));
    }
    g += `<path d="${f}" stroke="${L ? "#6d6253" : "#3e3833"}" stroke-width=".22" opacity=".5"/>`;
    /* Fleckung des Sandsteins (nur nah) */
    if (nah) {
      let fl = "";
      for (let s = S0 + 2; s < 40; s += 1.5 + rnd() * 2.5) { const h = 0.1 + rnd() * 0.5, l = 0.5 + rnd() * 1.2, d = 0.15 + rnd() * 0.25; const qd = klipp([P(s, innen, h), P(s + l, innen, h + d * 0.4), P(s + l * 0.8, innen, h + d), P(s - 0.2, innen, h + d * 0.7)]); if (qd.length > 2) fl += `M${qd.join(" L")}Z`; }
      g += `<path d="${fl}" fill="${L ? "#7a6d5c" : "#2e2924"}" opacity=".16"/>`;
    }
    g += poly([P(S0, innen, HP), P(S1, innen, HP), P(S1, innen, HP + 0.03), P(S0, innen, HP + 0.03)], "#2e2924", ` opacity=".55"`);
    g += poly([P(S0, qv, HP + 0.02), P(S1, qv, HP + 0.02), P(S1, qv, BRH), P(S0, qv, BRH)], L ? "#c8baa2" : "#837a6d");
    g += poly([P(S0, qv, BRH), P(S1, qv, BRH), P(S1, q0, BRH), P(S0, q0, BRH)], L ? "#ddd0b8" : "#b2a794");
    g += `<path d="${strecke(P(S0, qv, BRH), P(S1, qv, BRH))}" stroke="${L ? "#f6ead2" : "#d6cab4"}" stroke-width=".5"/>`;
    return g;
  };
  k += bruestung(-BR, -QI, -1) + bruestung(BR, QI, 1);
  /* Schatten der linken Brüstung als schmaler Streifen auf dem Pflaster */
  k += poly([P(S0, -QI), P(S1, -QI), P(S1 + BRH * SDS, -QI + BRH * SDQ), P(S0 + BRH * SDS, -QI + BRH * SDQ)], "#2b2a3a", ` opacity=".28"`);
  /* Schatten der linken Statuen und Laternen */
  let sch = "", ls = "";
  for (const [s, sei] of STATUEN) if (sei < 0 && s >= S0 - 6 && s < Math.min(S1, 300)) sch += statuenSchatten(s);
  for (const [s, sei] of LATERNEN) if (sei < 0 && s >= S0 - 4 && s < Math.min(S1, 300)) ls += laternenSchatten(s);
  k += `<g pointer-events="none">${sch}<path d="${ls}" stroke="#2b2a3a" stroke-width="${nah ? 0.5 : 0.35}" opacity=".35"/></g>`;
  return k;
}

/* =====================================================================
   9 — STATUEN-WERKSTATT: Barockfiguren in Metern (Ursprung am Fuß, y nach oben negativ).
   Geschwärzter Sandstein mit hellgrauen verwitterten Kanten (Nase, Schultern, Faltenkämme);
   Licht von links hinten: linke Kanten hell, rechte Seiten dunkel.
   ===================================================================== */
const SF = S.lg("stf", [[0, "#7d756a"], [0.28, "#575149"], [0.7, "#36322d"], [1, "#221f1c"]], 0, 0, 1, 0);
const SF2 = S.lg("stf2", [[0, "#6c655b"], [0.5, "#433e38"], [1, "#272421"]], 0, 0, 1, 0);
const HAUT = S.rg("sthaut", [[0, "#b4aa9b"], [0.55, "#746b61"], [1, "#3a3631"]], 0.3, 0.35, 0.8);
const STW = "#aaa093", STD = "#191715";
const q2 = (v) => Math.round(v * 100) / 100;
const pt = (x, y) => `${q2(x)} ${q2(y)}`;
/* Kopf mit Gesichtsfläche: Lichthälfte links, Schattenhälfte rechts, Nasenkante; Kopfbedeckung */
function kopf(kx, ky, s, art = "", blick = 0) {
  let g = "";
  if (art === "schleier" || art === "kapuze") g += `<path d="M${pt(kx - s * 1.05, ky + s * (art === "kapuze" ? 1.4 : 2))} C${pt(kx - s * 1.4, ky + s * 0.2)} ${pt(kx - s * 1.1, ky - s * 1.35)} ${pt(kx, ky - s * 1.35)} C${pt(kx + s * 1.1, ky - s * 1.35)} ${pt(kx + s * 1.45, ky + s * 0.2)} ${pt(kx + s * 1.15, ky + s * (art === "kapuze" ? 1.5 : 2.1))}Z" fill="${SF2}"/>`;
  g += `<ellipse cx="${q2(kx)}" cy="${q2(ky)}" rx="${q2(s * 0.78)}" ry="${q2(s)}" fill="${HAUT}"/>`;
  const nx = kx + blick * s * 0.3;
  g += `<path d="M${pt(nx, ky - s)} A${q2(s * 0.78)} ${q2(s)} 0 0 1 ${pt(nx, ky + s)} Q${pt(nx + s * 0.28, ky)} ${pt(nx, ky - s)}Z" fill="${STD}" opacity=".42"/>`;
  g += `<ellipse cx="${q2(nx - s * 0.3)}" cy="${q2(ky - s * 0.15)}" rx="${q2(s * 0.2)}" ry="${q2(s * 0.12)}" fill="${STD}" opacity=".5"/><ellipse cx="${q2(nx + s * 0.3)}" cy="${q2(ky - s * 0.15)}" rx="${q2(s * 0.18)}" ry="${q2(s * 0.12)}" fill="${STD}" opacity=".6"/><path d="M${pt(nx - s * 0.5, ky - s * 0.32)} q${q2(s * 0.2)} ${q2(-s * 0.1)} ${q2(s * 0.42)} 0" stroke="${STW}" stroke-width="${q2(s * 0.08)}" fill="none" opacity=".7"/><path d="M${pt(nx - s * 0.18, ky + s * 0.45)} h${q2(s * 0.34)}" stroke="${STD}" stroke-width="${q2(s * 0.07)}" opacity=".55"/>`;
  g += `<path d="M${pt(nx + s * 0.04, ky - s * 0.2)} l${q2(s * 0.16)} ${q2(s * 0.45)} l${q2(-s * 0.16)} ${q2(s * 0.06)}" stroke="${STW}" stroke-width="${q2(s * 0.1)}" fill="none" opacity=".8"/>`;
  if (art === "schleier" || art === "kapuze") g += `<path d="M${pt(kx - s * 0.82, ky - s * 0.2)} Q${pt(kx, ky - s * 1.5)} ${pt(kx + s * 0.82, ky - s * 0.2)} Q${pt(kx, ky - s * 0.85)} ${pt(kx - s * 0.82, ky - s * 0.2)}Z" fill="${SF2}"/><path d="M${pt(kx - s * 1.1, ky + s)} Q${pt(kx - s * 1.2, ky - s * 0.6)} ${pt(kx - s * 0.2, ky - s * 1.3)}" stroke="${STW}" stroke-width="${q2(s * 0.12)}" fill="none" opacity=".6"/>`;
  else if (art === "birett") g += `<path d="M${pt(kx - s * 0.86, ky - s * 0.5)} L${pt(kx - s * 0.8, ky - s * 1.42)} L${pt(kx + s * 0.8, ky - s * 1.42)} L${pt(kx + s * 0.86, ky - s * 0.5)} Q${pt(kx, ky - s * 0.72)} ${pt(kx - s * 0.86, ky - s * 0.5)}Z" fill="#2c2824"/><path d="M${pt(kx - s * 0.32, ky - s * 1.42)} v${q2(-s * 0.45)} M${pt(kx + s * 0.3, ky - s * 1.42)} v${q2(-s * 0.4)}" stroke="#3a3530" stroke-width="${q2(s * 0.22)}"/><circle cx="${q2(kx)}" cy="${q2(ky - s * 1.62)}" r="${q2(s * 0.22)}" fill="#2c2824"/><path d="M${pt(kx - s * 0.84, ky - s * 0.55)} L${pt(kx - s * 0.79, ky - s * 1.4)} H${q2(kx)}" stroke="${STW}" stroke-width="${q2(s * 0.1)}" fill="none" opacity=".7"/>`;
  else if (art === "krone") g += `<path d="M${pt(kx - s * 0.75, ky - s * 0.62)} l${q2(s * 0.08)} ${q2(-s * 0.62)} l${q2(s * 0.3)} ${q2(s * 0.3)} l${q2(s * 0.35)} ${q2(-s * 0.45)} l${q2(s * 0.35)} ${q2(s * 0.45)} l${q2(s * 0.3)} ${q2(-s * 0.3)} l${q2(s * 0.08)} ${q2(s * 0.62)} Q${pt(kx, ky - s * 0.82)} ${pt(kx - s * 0.75, ky - s * 0.62)}Z" fill="#4a4339"/>`;
  else if (art === "tonsur") g += `<path d="M${pt(kx - s * 0.8, ky - s * 0.1)} Q${pt(kx - s * 0.85, ky - s * 0.8)} ${pt(kx - s * 0.3, ky - s * 0.92)} L${pt(kx - s * 0.2, ky - s * 0.7)} Q${pt(kx - s * 0.6, ky - s * 0.5)} ${pt(kx - s * 0.6, ky - s * 0.05)}Z" fill="${SF2}"/>`;
  else g += `<path d="M${pt(kx - s * 0.8, ky - s * 0.05)} A${q2(s * 0.8)} ${q2(s)} 0 0 1 ${pt(kx + s * 0.8, ky - s * 0.05)} Q${pt(kx + s * 0.2, ky - s * 0.65)} ${pt(kx - s * 0.8, ky - s * 0.05)}Z" fill="${SF2}"/>`;
  return g;
}
/* Arm als Ärmel (am Handgelenk weit, barock) mit heller Oberkante, Hand als helle Form */
function arm(ax, ay, bx, by, w) {
  /* Ärmel als Stoff: an der Schulter schmal, zum Handgelenk weit, dunkle Öffnung, zwei Falten nach unten;
     die Hand als helle Form mit abgesetztem Daumen */
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const P2 = (t, o) => pt(ax + dx * t + nx * o, ay + dy * t + ny * o);
  let g = `<path d="M${P2(0, -w * 0.5)} Q${P2(0.5, -w * 0.7)} ${P2(0.92, -w * 0.85)} L${P2(1.02, w * 0.85)} Q${P2(0.5, w * 0.75)} ${P2(0, w * 0.5)}Z" fill="${SF2}"/>`;
  g += `<path d="M${P2(0.25, -w * 0.15)} Q${P2(0.6, 0)} ${P2(0.9, w * 0.35)} M${P2(0.4, w * 0.45)} Q${P2(0.7, w * 0.5)} ${P2(0.98, w * 0.75)}" stroke="${STD}" stroke-width="${q2(w * 0.14)}" fill="none" opacity=".6"/>`;
  g += `<path d="M${P2(0.05, -w * 0.5)} Q${P2(0.5, -w * 0.72)} ${P2(0.9, -w * 0.84)}" stroke="${STW}" stroke-width="${q2(w * 0.14)}" fill="none" opacity=".6"/>`;
  g += `<ellipse cx="${q2(bx + ux * w * 0.02)}" cy="${q2(by + uy * w * 0.02)}" rx="${q2(w * 0.32)}" ry="${q2(w * 0.8)}" transform="rotate(${q2(Math.atan2(uy, ux) * 180 / Math.PI + 90)} ${q2(bx)} ${q2(by)})" fill="#1c1a17"/>`;
  const hx = bx + ux * w * 0.55, hy = by + uy * w * 0.55;
  g += `<ellipse cx="${q2(hx)}" cy="${q2(hy)}" rx="${q2(w * 0.36)}" ry="${q2(w * 0.5)}" fill="${HAUT}"/><ellipse cx="${q2(hx - nx * w * 0.35 - ux * w * 0.1)}" cy="${q2(hy - ny * w * 0.35 - uy * w * 0.1)}" rx="${q2(w * 0.13)}" ry="${q2(w * 0.24)}" fill="${HAUT}"/>`;
  return g;
}
/* stehende Gestalt im langen Gewand: Mitte cx, Höhe H, Neigung n (Kopf versetzt), Arme [Schulter→Hand] in H */
function gestalt(cx, H, n, arme = [], opt = {}) {
  const pp = (x, y) => [cx + x * H + (y < -0.45 ? n * H * (-y - 0.45) * 2 : 0), y * H];
  const p = (x, y) => pt(...pp(x, y));
  const [kx, ky] = pp(0, -0.925), ks = H * 0.07;
  let g = "";
  if (opt.heil) g += `<circle cx="${q2(kx)}" cy="${q2(ky - ks * 0.2)}" r="${q2(ks * 1.75)}" fill="none" stroke="#b49a50" stroke-width="${q2(H * 0.014)}"/>`;
  g += `<path d="M${p(-0.135, -0.845)} C${p(-0.2, -0.68)} ${p(-0.19, -0.34)} ${p(-0.2, 0)} Q${p(-0.1, 0.035)} ${p(-0.02, 0.005)} Q${p(0.09, 0.04)} ${p(0.195, 0)} C${p(0.2, -0.34)} ${p(0.21, -0.68)} ${p(0.135, -0.845)} Q${p(0, -0.885)} ${p(-0.135, -0.845)}Z" fill="${SF}"/>`;
  /* Mantel: diagonale Bahn von der linken Schulter zur rechten Hüfte */
  if (opt.mantel) g += `<path d="M${p(-0.12, -0.82)} C${p(-0.02, -0.62)} ${p(0.1, -0.5)} ${p(0.205, -0.42)} L${p(0.2, -0.2)} C${p(0.04, -0.3)} ${p(-0.1, -0.48)} ${p(-0.195, -0.58)}Z" fill="${SF2}"/><path d="M${p(-0.1, -0.8)} C${p(0, -0.62)} ${p(0.12, -0.51)} ${p(0.22, -0.43)}" stroke="${STW}" stroke-width="${q2(H * 0.012)}" fill="none" opacity=".6"/>`;
  /* Schulterkragen (Mozzetta) */
  if (opt.kragen) g += `<path d="M${p(-0.13, -0.84)} Q${p(-0.2, -0.75)} ${p(-0.19, -0.66)} Q${p(0, -0.6)} ${p(0.19, -0.66)} Q${p(0.2, -0.75)} ${p(0.13, -0.84)}Z" fill="${SF2}"/><path d="M${p(-0.18, -0.67)} Q${p(0, -0.61)} ${p(0.18, -0.67)}" stroke="${STW}" stroke-width="${q2(H * 0.01)}" fill="none" opacity=".6"/>`;
  /* vier bis sechs schräg fallende Faltenbahnen: dunkle Täler, helle Kämme */
  let fd = "", fl = "";
  for (const [a, b, c, d, e, f] of [[-0.14, -0.52, -0.09, -0.26, -0.13, 0], [-0.05, -0.46, 0.0, -0.22, -0.04, 0.01], [0.06, -0.42, 0.1, -0.2, 0.07, 0.025], [0.14, -0.34, 0.17, -0.15, 0.15, 0], [-0.08, -0.78, 0, -0.68, 0.08, -0.6]]) {
    fd += `M${p(a, b)} Q${p(c, d)} ${p(e, f)}`; fl += `M${p(a - 0.028, b)} Q${p(c - 0.028, d)} ${p(e - 0.028, f)}`;
  }
  g += `<path d="${fd}" stroke="${STD}" stroke-width="${q2(H * 0.02)}" fill="none" opacity=".7"/><path d="${fl}" stroke="${STW}" stroke-width="${q2(H * 0.011)}" fill="none" opacity=".55"/>`;
  g += `<path d="M${p(-0.125, -0.835)} C${p(-0.188, -0.68)} ${p(-0.178, -0.34)} ${p(-0.188, -0.01)}" stroke="${STW}" stroke-width="${q2(H * 0.014)}" fill="none" opacity=".6"/>`;
  for (const [sx, sy, hx, hy] of arme) g += arm(...pp(sx, sy), ...pp(hx, hy), H * 0.072);
  return g + kopf(kx, ky, ks, opt.kopf, opt.blick || 0);
}
/* kniende Gestalt im Profil, Blick nach dir (+1 rechts): Knie vorn, Rücken hinten, Hände erhoben */
function kniend(cx, H, dir, opt = {}) {
  const pp = (x, y) => [cx + x * H * dir, y * H], p = (x, y) => pt(...pp(x, y));
  let g = `<path d="M${p(-0.28, 0)} L${p(0.26, 0)} Q${p(0.31, -0.12)} ${p(0.2, -0.2)} Q${p(0.06, -0.22)} ${p(0.04, -0.3)} Q${p(0.11, -0.45)} ${p(0.08, -0.58)} Q${p(0, -0.66)} ${p(-0.09, -0.6)} Q${p(-0.15, -0.4)} ${p(-0.18, -0.25)} Q${p(-0.31, -0.15)} ${p(-0.28, 0)}Z" fill="${SF}"/>`;
  g += `<path d="M${p(-0.2, -0.05)} Q${p(-0.04, -0.15)} ${p(0.2, -0.11)} M${p(-0.06, -0.55)} Q${p(-0.11, -0.4)} ${p(-0.06, -0.26)} M${p(0.02, -0.5)} Q${p(0, -0.38)} ${p(0.04, -0.3)}" stroke="${STD}" stroke-width="${q2(H * 0.022)}" fill="none" opacity=".7"/>`;
  g += `<path d="M${p(dir > 0 ? -0.27 : 0.25, -0.02)} Q${p(dir > 0 ? -0.29 : 0.3, -0.13)} ${p(dir > 0 ? -0.17 : 0.19, -0.24)}" stroke="${STW}" stroke-width="${q2(H * 0.014)}" fill="none" opacity=".6"/>`;
  const [kx, ky] = pp(0.05, opt.hoch ? -0.74 : -0.72);
  g += arm(...pp(0.03, -0.58), ...pp(0.16, opt.hoch ? -0.72 : -0.68), H * 0.075);
  return g + kopf(kx, ky, H * 0.075, opt.kopf, dir * (opt.hoch ? 1.2 : 0.8));
}
/* Engelskopf mit zwei Flügeln in der Wolke (barockes Motiv) */
const engel = (cx, cy, s) => [-1, 1].map((d) => `<path d="M${pt(cx + d * s * 0.6, cy + s * 0.2)} q${q2(d * s * 1.4)} ${q2(-s * 0.2)} ${q2(d * s * 2.3)} ${q2(-s * 1.6)} q${q2(-d * s * 0.5)} ${q2(s * 1.4)} ${q2(-d * s * 2.2)} ${q2(s * 1.9)}Z" fill="#59534a"/><path d="M${pt(cx + d * s * 0.7, cy - s * 0.1)} q${q2(d * s * 1.2)} ${q2(-s * 0.3)} ${q2(d * s * 2)} ${q2(-s * 1.3)}" stroke="${STW}" stroke-width="${q2(s * 0.15)}" fill="none" opacity=".6"/>`).join("") + kopf(cx, cy, s, "", 0.4);
/* Wolkenbank (gewellter Sockel der Madonna) */
const WBK = S.lg("wbk", [[0, "#6a6359"], [0.6, "#4d4740"], [1, "#35302b"]]);
function wolkenbank(x0, x1, h, hr, n = 5) {
  const pk = [];
  for (let i = 0; i <= n; i++) { const t = i / n; pk.push([x0 + (x1 - x0) * t, -(h + (hr - h) * t) * (i % 2 ? 1.1 : 0.9)]); }
  let d = `M${pt(x0, 0)} L${pt(...pk[0])}`, li = "", du = "";
  for (let i = 1; i <= n; i++) {
    const [xa, ya] = pk[i - 1], [xb, yb] = pk[i], c = Math.hypot(xb - xa, yb - ya), rr = c * 0.62;
    const mx = (xa + xb) / 2 + (yb - ya) * 0.253, my = (ya + yb) / 2 - (xb - xa) * 0.253;
    d += ` A${q2(rr)} ${q2(rr)} 0 0 1 ${pt(xb, yb)}`;
    li += `M${pt(xa, ya)} A${q2(rr)} ${q2(rr)} 0 0 1 ${pt(mx, my)}`;
    if (i < n) du += `M${pt(xb, yb)} q${q2(-c * 0.12)} ${q2(c * 0.25)} ${q2(c * 0.02)} ${q2(c * 0.5)}`;
  }
  const [xe, ye] = pk[n], re = Math.abs(ye) * 0.55;
  d += ` A${q2(re)} ${q2(re)} 0 0 1 ${pt(x1 + re * 0.3, -0.05)} L${pt(x1, 0)}Z`;
  li += `M${pt(xe, ye)} A${q2(re)} ${q2(re)} 0 0 1 ${pt(xe + re * 0.7, ye + re * 0.3)}`;
  return `<path d="${d}" fill="${WBK}"/><path d="${du}" stroke="${STD}" stroke-width="${q2((x1 - x0) / n * 0.07)}" fill="none" opacity=".6"/><path d="${li}" stroke="${STW}" stroke-width="${q2((x1 - x0) / n * 0.07)}" fill="none" opacity=".75"/>`;
}
/* Sockel: Plinthe, Schaft mit Inschrifttafel, Gesims; Sonnenseite links */
const SOCKEL_D = (nah, hoch = 2.35) => {
  const H = -hoch;
  let g = `<path d="M-1.15 0 V-.35 H1.15 V0 Z M-1.05 -.35 V${H} H1.05 V-.35 Z" fill="${SOCKEL}"/>`;
  g += `<path d="M-1.05 -.35 V${H} H-.75 V-.35 Z" fill="#d2c3a9" opacity=".5"/><path d="M.7 -.35 V${H} H1.05 V-.35 Z" fill="#3e3833" opacity=".45"/>`;
  g += `<path d="M-1.3 ${H} H1.3 L1.2 ${q2(H - 0.25)} H-1.2 Z" fill="#c4b59c"/><path d="M-1.3 ${H} H1.3 V${q2(H + 0.08)} H-1.3 Z" fill="#5e564f"/><path d="M-1.2 ${q2(H - 0.25)} H1.2" stroke="#e6dac4" stroke-width=".05"/>`;
  if (nah) g += `<path d="M-.55 -1.85 Q-.6 -1.35 -.55 -.85 H.55 Q.6 -1.35 .55 -1.85 Z" fill="#6f6556" stroke="#e0d2b8" stroke-width=".04"/><path d="M-.38 -1.55 h.76 M-.42 -1.35 h.84 M-.36 -1.15 h.72" stroke="#3e3833" stroke-width=".04"/><path d="M-.2 -2.1 q.2 -.15 .4 0 q-.2 .1 -.4 0Z" fill="#8a7e6c"/>`;
  else g += `<rect x="-.5" y="-1.8" width="1" height=".9" fill="#6f6556"/>`;
  return g;
};
/* die echten Gruppen am Altstädter Ende */
const GRUPPEN = {
  /* rechts 1: Madonna mit dem heiligen Bernhard — Madonna mit Kind sitzt auf der Wolkenbank, Bernhard kniet
     davor und schaut zu ihr hinauf, ein Putto hält das Kreuz (Leidenswerkzeuge) */
  bernhard: () => {
    let g = `<path d="M1.0 -.4 L1.13 -2.1 M.9 -1.72 L1.34 -1.68" stroke="#2c2824" stroke-width=".08"/><path d="M.98 -.4 L1.11 -2.1 M.9 -1.74 L1.3 -1.71" stroke="${STW}" stroke-width=".02" opacity=".6"/>`;
    g += wolkenbank(-0.45, 1.0, 0.35, 0.95, 4) + `<g transform="translate(.1 0)">${wolkenbank(-0.3, 0.9, 0.22, 0.42, 4)}</g>` + engel(0.78, -0.42, 0.11);
    /* Madonna sitzt auf der Wolke: Mantel über dem Rücken, Oberkörper, Schoß mit dem Kind, Beine nach links */
    g += `<circle cx=".5" cy="-2.16" r=".24" fill="none" stroke="#b49a50" stroke-width=".035"/>`;
    g += `<path d="M.6 -2.04 C.92 -1.78 .98 -1.3 .92 -.86 Q.8 -1.02 .74 -1.28 Q.7 -1.64 .54 -1.96Z" fill="${SF2}"/>`;
    g += `<path d="M.35 -1.12 C.31 -1.5 .32 -1.78 .37 -1.98 L.66 -2.02 C.75 -1.74 .79 -1.4 .83 -.98Z" fill="${SF}"/>`;
    g += `<path d="M.85 -.9 C.55 -1.2 .22 -1.24 .02 -1.16 Q-.1 -1.08 -.12 -.86 Q-.14 -.66 -.26 -.54 Q.08 -.42 .36 -.55 Q.62 -.67 .85 -.9Z" fill="${SF}"/>`;
    g += `<path d="M.66 -1.06 Q.4 -1.06 .05 -1.0 M.52 -.92 Q.22 -.86 -.02 -.68 M.32 -.68 Q.12 -.6 -.14 -.56 M.5 -1.84 Q.45 -1.5 .5 -1.2" stroke="${STD}" stroke-width=".04" fill="none" opacity=".7"/>`;
    g += `<path d="M.83 -.94 C.52 -1.22 .2 -1.26 .0 -1.18 Q-.1 -1.08 -.12 -.86 M.35 -1.16 C.31 -1.46 .32 -1.74 .37 -1.94" stroke="${STW}" stroke-width=".028" fill="none" opacity=".7"/>`;
    g += `<ellipse cx=".22" cy="-1.36" rx=".12" ry=".16" fill="${SF}"/>` + kopf(0.19, -1.58, 0.075, "", -0.6) + arm(0.14, -1.44, 0.02, -1.58, 0.055);
    g += arm(0.53, -1.84, 0.27, -1.24, 0.1) + kopf(0.5, -2.12, 0.12, "schleier", -1);
    /* Bernhard kniet links davor, das Gesicht zur Madonna erhoben, die Hände betend */
    return g + kniend(-0.8, 1.85, 1, { kopf: "tonsur", hoch: true });
  },
  /* links 1: der heilige Ivo — Birett auf dem Kopf, offenes Buch in der Linken; zu seinen Füßen eine kniende
     Witwe, daneben ihr Kind */
  ivo: () => {
    let g = gestalt(0.2, 3.0, 0.02, [[-0.12, -0.78, -0.26, -0.5], [0.12, -0.78, 0.17, -0.62]], { kopf: "birett", kragen: true, blick: 0.6 });
    /* offenes Buch: zwei Seiten im flachen V, Schnitt und Zeilen */
    g += `<path d="M.42 -1.98 L.7 -1.9 L.7 -1.62 L.42 -1.72Z M.7 -1.9 L.98 -2.0 L.98 -1.72 L.7 -1.62Z" fill="#8f877a"/><path d="M.42 -1.72 L.7 -1.62 L.98 -1.72 L.98 -1.67 L.7 -1.57 L.42 -1.67Z" fill="#2c2824"/>`;
    g += `<path d="M.47 -1.9 L.65 -1.85 M.47 -1.83 L.65 -1.78 M.75 -1.85 L.93 -1.91 M.75 -1.78 L.93 -1.84" stroke="#3a3530" stroke-width=".02"/><path d="M.42 -1.98 L.7 -1.9" stroke="#d6ccbc" stroke-width=".025"/>`;
    g += kniend(-0.62, 2.0, 1, { kopf: "schleier" });
    g += gestalt(-1.08, 1.0, 0, [[0.12, -0.76, 0.24, -0.62]], {});
    return g;
  },
  /* rechts 2: Dominikus und Thomas von Aquin (Kapuzen), darüber die Madonna auf einer Wolke */
  dominikus: () => gestalt(-0.5, 2.4, 0.02, [[0.11, -0.72, 0.22, -0.84]], { heil: true, kopf: "kapuze", mantel: true }) + gestalt(0.55, 2.3, -0.02, [[-0.11, -0.72, -0.24, -0.6]], { heil: true, kopf: "kapuze", mantel: true }) +
    `<g transform="translate(0 -2.15)">${wolkenbank(-0.5, 0.55, 0.25, 0.4)}</g>` + `<g transform="translate(0 -2.4)">` + gestalt(0.05, 1.3, 0, [[0.1, -0.7, 0.26, -0.82]], { kopf: "schleier", heil: true }) + `</g>`,
  /* links 2: die heiligen Barbara (Krone, Turm), Margareta und Elisabeth */
  barbara: () => gestalt(-0.72, 2.5, 0.02, [[0.11, -0.7, 0.2, -0.56]], { kopf: "schleier" }) + gestalt(0.82, 2.45, -0.02, [[-0.11, -0.7, -0.22, -0.56]], { kopf: "krone", mantel: true }) +
    gestalt(0.05, 2.8, 0, [[0.12, -0.74, 0.26, -0.8]], { kopf: "krone", mantel: true }) + `<path d="M.66 -2.1 h.3 v-.55 h-.3Z M.68 -2.65 l.13 -.2 l.13 .2Z" fill="#2c2824"/><path d="M.66 -2.1 v-.55" stroke="${STW}" stroke-width=".03"/>`,
};
/* einfache Typen für die übrigen Statuen (fern): als <use> wiederverwendet */
const TYPEN = [
  () => gestalt(0, 3, 0.02, [[0.12, -0.74, 0.24, -1.02]], { heil: true, mantel: true }) + `<path d="M.75 -2.9 V-1.6 M.6 -2.6 H.9" stroke="#2a2724" stroke-width=".08"/>`,
  () => gestalt(0, 3, -0.02, [[-0.12, -0.74, -0.2, -0.6]], { kopf: "krone" }) + `<path d="M-.62 -.2 V-3.3" stroke="#2a2724" stroke-width=".07"/>`,
  () => gestalt(0, 3, 0.02, [[0.12, -0.74, 0.18, -0.6]], { kopf: "schleier", heil: true, mantel: true }),
  () => gestalt(0, 3, 0, [[-0.12, -0.75, -0.3, -1.02], [0.12, -0.75, 0.3, -1.02]], { heil: true, kopf: "kapuze" }),
  () => kniend(-0.45, 1.8, 1, { kopf: "schleier" }) + gestalt(0.4, 2.8, 0, [[-0.1, -0.72, -0.22, -0.6]], { heil: true, mantel: true }),
];
TYPEN.forEach((f, i) => S.def(`<g id="${S.id("st" + i)}">${SOCKEL_D(false)}<g transform="translate(0 -2.6)">${f()}</g></g>`));
const NEPO = { s: 34 + 7 * 31, sei: 1 };
const NAH = { "34,1": "bernhard", "30,-1": "ivo", "65,1": "dominikus", "61.4,-1": "barbara" };
const statueSvg = (s, sei, i) => {
  const q = sei * (BR + 0.2), sc = F / Dd(s, q), x = X(s, q), y = Y(s, q, 0);
  if (s === NEPO.s && sei === NEPO.sei) {
    /* der heilige Nepomuk (Bronze, barhäuptig, Chorhemd): Kruzifix an der Brust, Palmzweig, fünf goldene Sterne;
       am Sockel zwei Bronzereliefs, das linke (von hier sichtbar) blank gerieben (hellgold mit Glanz) */
    let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${sc.toFixed(4)})">`;
    g += `<path d="M-1.15 0 V-.35 H1.15 V0 Z M-1.05 -.35 V-3.35 H1.05 V-.35 Z" fill="${SOCKEL}"/><path d="M-1.3 -3.35 H1.3 L1.2 -3.6 H-1.2 Z" fill="#c4b59c"/>`;
    g += `<rect x=".1" y="-2.9" width=".85" height=".85" fill="#3f3a2a" stroke="#2a2618" stroke-width=".08"/><rect x="-.95" y="-2.9" width=".85" height=".85" fill="#2a2618"/><rect x="-.88" y="-2.83" width=".71" height=".71" fill="${GOLD}"/><path d="M-.83 -2.2 L-.25 -2.78" stroke="#fffbe6" stroke-width=".07" opacity=".85"/>`;
    g += `<g transform="translate(0 -3.6) scale(1.15)"><path d="M-.5 0 Q-.6 -1.5 -.4 -2.4 Q-.25 -2.75 0 -2.8 Q.25 -2.75 .4 -2.4 Q.6 -1.5 .5 0 Z" fill="#2c2f2a"/>`;
    g += `<path d="M-.42 -2.4 Q-.25 -2.75 0 -2.8 Q.25 -2.75 .42 -2.4 L.36 -1.7 L-.36 -1.7 Z" fill="#e8e2d0"/><path d="M-.2 -2.2 V-1.8 M.1 -2.3 V-1.75" stroke="#b9b2a0" stroke-width=".04"/>`;
    g += `<circle cx="0" cy="-3.05" r=".24" fill="#3a3a32"/><path d="M.02 -2.65 V-1.75 M-.18 -2.4 H.22" stroke="#d8b34a" stroke-width=".09"/><path d="M-.3 -1.8 Q-.6 -2.3 -.5 -2.9" stroke="#3a4a2a" stroke-width=".07" fill="none"/>`;
    for (let j = 0; j < 5; j++) { const a = (-60 + j * 30) * Math.PI / 180, cx = q2(Math.sin(a) * 0.58), cy = q2(-3.1 - Math.cos(a) * 0.58); g += `<circle cx="${cx}" cy="${cy}" r=".24" fill="#fff3b0" opacity=".35"/><path d="M${cx} ${q2(cy - 0.13)} l.04 .09 .09 .01 -.07 .06 .02 .09 -.08 -.05 -.08 .05 .02 -.09 -.07 -.06 .09 -.01Z" fill="#ffe25a"/>`; }
    g += `</g></g>`;
    /* kleine Gruppe Touristen davor, eine Hand an der Tafel */
    for (const [ds, dq, c] of [[-2.2, -1.2, "#c0392b"], [-2.8, -0.4, "#2f5f95"], [-1.6, -0.6, "#e8e4dc"], [-3.4, -1.4, "#f2c230"]]) {
      const tx = X(s + ds, q + dq), ty = Y(s + ds, q + dq), ts = F / Dd(s + ds, q + dq);
      g += `<g transform="translate(${r(tx)} ${r(ty)}) scale(${ts.toFixed(3)})"><path d="M-.12 0 V-.8 h.1 V0 Z M.02 0 V-.8 h.1 V0 Z" fill="#33353d"/><rect x="-.22" y="-1.5" width=".44" height=".75" rx=".12" fill="${c}"/><circle cy="-1.65" r=".13" fill="#d8a986"/></g>`;
    }
    g += `<path d="M${r(X(s - 1.6, q - 0.6))} ${r(Y(s - 1.6, q - 0.6, 1.25))} L${r(X(s - 1.3, q - 0.5))} ${r(Y(s - 1.3, q - 0.5, 1.3))}" stroke="#d8a986" stroke-width=".3"/>`;
    return g;
  }
  if (NAH[`${s},${sei}`]) return `<g transform="translate(${r(x)} ${r(y)}) scale(${sc.toFixed(4)})">${SOCKEL_D(true)}<g transform="translate(0 -2.6)">${GRUPPEN[NAH[`${s},${sei}`]]()}</g></g>`;
  const art = sei === NEPO.sei && s === NEPO.s - 31 ? 4 : i % 5;
  return `<use href="#${S.id("st" + art)}" transform="translate(${r(x)} ${r(y)}) scale(${sc.toFixed(4)})"/>`;
};
/* Gaslaterne auf der Brüstung: Sockel, schlanker Mast mit Ring, Laternenkopf aus Glas, Dach mit Spitze (3,25 m) */
S.def(`<g id="${S.id("latu")}"><path d="M-.2 0 h.4 v-.35 h-.4Z" fill="#33363c"/><path d="M-.09 -.35 L-.08 -1.05 h.16 L.09 -.35Z" fill="#26282c"/><path d="M-.07 -.4 L-.065 -1.05" stroke="#8a8c92" stroke-width=".025"/></g>`);
S.def(`<g id="${S.id("lato")}"><path d="M-.08 -1.0 L-.06 -2.1 h.12 L.08 -1.0Z" fill="#26282c"/><path d="M-.13 -1.0 h.26 v-.1 h-.26Z M-.2 -2.1 h.4 l-.06 -.14 h-.28Z" fill="#33363c"/>` +
  `<path d="M-.16 -2.24 L-.26 -2.86 H.26 L.16 -2.24Z" fill="#efe6c8"/><path d="M.02 -2.24 L.04 -2.86 H.26 L.16 -2.24Z" fill="#b9b4a0"/><path d="M-.16 -2.24 L-.26 -2.86 M0 -2.24 V-2.86 M.16 -2.24 L.26 -2.86 M-.2 -2.5 H.2" stroke="#26282c" stroke-width=".035"/>` +
  `<path d="M-.33 -2.86 H.33 L0 -3.12Z" fill="#26282c"/><path d="M0 -3.12 V-3.26" stroke="#26282c" stroke-width=".05"/><path d="M-.065 -1.1 L-.05 -2.05" stroke="#8a8c92" stroke-width=".025"/></g>`);
S.def(`<g id="${S.id("lat")}"><use href="#${S.id("latu")}"/><use href="#${S.id("lato")}"/></g>`);
const laterneSvg = (s, sei, teil = "lat") => { const q = sei * (BR - BRD / 2), sc = F / Dd(s, q); return `<use href="#${S.id(teil)}" transform="translate(${r(X(s, q))} ${r(Y(s, q, BRH))}) scale(${sc.toFixed(4)})"/>`; };

/* ferner Teil der Brücke mit Statuen und Laternen: Kulisse (von hinten nach vorn gezeichnet).
   Die Statuen und Laternen vor den Kleinseitner Brückentürmen stanzen die Türme aus (Maske), damit
   die Türme – ein Teil, also über der Kulisse gezeichnet – sie nicht verdecken. */
const TURM_DINGE = [];
{
  let k = bruecke(NAHE - 2, 505);
  const dinge = [];
  STATUEN.forEach(([s, sei], i) => { if (!(s < NAHE - 20)) dinge.push([s, statueSvg(s, sei, i)]); });
  for (const [s, sei] of LATERNEN) if (s > NAHE) dinge.push([s, laterneSvg(s, sei)]);
  dinge.sort((a, b) => b[0] - a[0]);
  /* die fernen Dinge vor den Türmen als eine benannte Gruppe: die Turmmaske verweist darauf (keine Kopie) */
  k += `<g id="${S.id("turmdinge")}">${dinge.filter((d) => d[0] >= 110).map((d) => d[1]).join("")}</g>` + dinge.filter((d) => d[0] < 110).map((d) => d[1]).join("");
  S.hinten(k);
}
/* Wasser darf den fernen Teil der Brücke und die Sockel der zweiten Statuen nicht übermalen: Aussparungen */
const AUSSPARUNG = [];
{
  const rahmen = "M0 0H400V260H0Z";
  const sil = `M${[P(NAHE - 2, -BR, BRH), P(510, -BR, BRH), P(510, BR, BRH), P(NAHE - 2, BR, BRH), P(NAHE - 2, QI, 0), P(NAHE - 2, -QI, 0)].join(" L")}Z`;
  const kasten = (sa, sb, sei) => { const q = sei * (BR + 0.2), xa = X(sa, q), xb = X(sb, q), ca = 1.25 * F / Dd(sa, q), cb = 1.25 * F / Dd(sb, q); return `M${r(Math.min(xa - ca, xb - cb))} 100H${r(Math.max(xa + ca, xb + cb))}V${r(Y(sa, q, 0) + 0.4)}H${r(Math.min(xa - ca, xb - cb))}Z`; };
  [sil, kasten(30 + 31.4, 30 + 2 * 31.4, -1), kasten(34 + 31, 34 + 2 * 31, 1)].forEach((d, i) => {
    S.def(`<clipPath id="${S.id("aus" + i)}"><path d="${rahmen}${d}" clip-rule="evenodd"/></clipPath>`);
    AUSSPARUNG.push(S.id("aus" + i));
  });
}
const ausgespart = (svg) => AUSSPARUNG.reduce((g, id) => `<g clip-path="url(#${id})">${g}</g>`, svg);

/* =====================================================================
   10 — DIE NAHE KARLSBRÜCKE, DIE STATUE (Madonna mit Bernhard; Lupe: der heilige Nepomuk),
        DER HEILIGE (Ivo), DIE LATERNE
   ===================================================================== */
var BRUECKE = S.teil({ id: "karlsbruecke", de: "die Karlsbrücke", syl: "KARLS-brü-cke", it: "il Ponte Carlo", itSyl: "PON-te CAR-lo", en: "Charles Bridge", x: 0, y: 0, kunst: bruecke(4, NAHE),
  zoom: { x: 276, y: 170, w: 105, h: 70 },
  unter: [{ id: "bruestung", de: "die Brüstung", syl: "BRÜS-tung", it: "il parapetto", itSyl: "pa-ra-PET-to", en: "parapet", x: r(X(8.5, BR - 0.3)), y: r(Y(8.5, BR - 0.3, BRH)),
    kunst: flaeche(-14, -4, 28, 18, 0.6), tipp: "Die Brüstung ist aus Sandstein. Sie schützt die Menschen vor dem Fall in die Moldau." }],
  tipp: "Die Karlsbrücke ist über 650 Jahre alt und 516 Meter lang. Hinter uns, in der Altstadt, steht die berühmte Astronomische Uhr." });
S.teil({ id: "heiliger", de: "der Heilige", syl: "HEI-li-ge", it: "il santo", itSyl: "SAN-to", en: "saint", x: 0, y: 0, kunst: `<g filter="url(#${S.id("kante")})">${statueSvg(30, -1, 1)}</g>`,
  tipp: "Das ist der heilige Ivo mit seinem Buch. Er hat armen Menschen vor Gericht geholfen." });
{
  const nx = r(X(NEPO.s, BR + 0.2)), ny = r(Y(NEPO.s, BR + 0.2)), ns = F / Dd(NEPO.s, BR + 0.2);
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: 0, y: 0, kunst: `<g filter="url(#${S.id("kante")})">${statueSvg(34, 1, 0)}</g>`,
    tipp: "Auf der Karlsbrücke stehen 30 Statuen. Diese zeigt Maria mit dem Kind auf einer Wolke." });
  /* Runde 4: Nepomuk und sein Sternenkranz sind Lupen-Teile des Brückenturms — dessen Lupe zeigt ihn mittig */
  TURM_TEIL.unter.push(
    { id: "nepomuk", de: "der heilige Nepomuk", syl: "der HEI-li-ge NE-po-muk", it: "san Giovanni Nepomuceno", itSyl: "san gio-VAN-ni ne-po-mu-CE-no", en: "St John of Nepomuk", x: nx, y: ny,
      kunst: flaeche(-1.2 * ns, -6.8 * ns, 2.4 * ns, 6.8 * ns, 0.3), tipp: "Wer die blanke Bronzetafel am Nepomuk berührt, kommt wieder nach Prag – so sagt man." },
    { id: "heiligenschein", de: "der Heiligenschein", syl: "HEI-li-gen-schein", it: "l'aureola", itSyl: "au-RE-o-la", en: "halo", x: nx, y: r(ny - 7.4 * ns),
      kunst: flaecheEllipse(0, 0, 0.9 * ns, 0.7 * ns), tipp: "Um den Kopf des Nepomuk leuchten fünf goldene Sterne." });
}
S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 0, y: 0, kunst: laterneSvg(20, -1, "lato"),
  tipp: "Am Abend zündet ein Laternenanzünder einige Gaslaternen auf der Brücke noch von Hand an." });
S.davor(laterneSvg(20, -1, "latu") + laterneSvg(40, -1) + laterneSvg(46, 1));

/* =====================================================================
   11 — DER STAND eines Künstlers (Böhmisches Glas, Bilder)
   ===================================================================== */
const schatten = (s, q, h, b, a = 0.3) => poly([P(s - 0.12, q - b), P(s + 0.12, q + b), P(s + h * SDS, q + h * SDQ + b * 0.6), P(s + h * SDS - 0.15, q + h * SDQ - b * 0.6)], "#2b2a3a", ` opacity="${a}" filter="url(#bw_weich)"`);
{
  const s0 = 21, q0 = -3.1, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  BRUECKE_SCHATTEN.push(poly([P(s0 - 0.4, q0 - 0.9), P(s0 + 0.4, q0 + 0.9), P(s0 + 0.4 + 1.9 * SDS, q0 + 0.9 + 1.9 * SDQ), P(s0 - 0.4 + 1.9 * SDS, q0 - 0.9 + 1.9 * SDQ)], "#2b2a3a", ` opacity=".28" filter="url(#bw_weich)"`));
  let k = `<g transform="scale(${sc.toFixed(4)})">`;
  /* Bilder mit Prag-Motiven an der Staffelei hinter dem Tisch (Beine hinter den Vasen) */
  k += `<path d="M-.92 -1.02 L-.66 -1.9 M.92 -1.02 L.6 -1.9" stroke="#5a4632" stroke-width=".05"/>`;
  k += `<rect x="-.62" y="-1.86" width=".56" height=".42" fill="#efe6d6" stroke="#6b4a32" stroke-width=".03"/><path d="M-.58 -1.48 L-.46 -1.66 L-.38 -1.58 L-.3 -1.72 L-.2 -1.6 L-.1 -1.48 Z" fill="#7a9ab8"/>`;
  k += `<rect x="0" y="-1.86" width=".56" height=".42" fill="#f3e8d3" stroke="#6b4a32" stroke-width=".03"/><path d="M.05 -1.5 Q.28 -1.62 .5 -1.5 L.5 -1.48 L.05 -1.48 Z" fill="#9a8b76"/><circle cx=".38" cy="-1.74" r=".05" fill="#e8b23a"/>`;
  k += `<path d="M-.8 0 L-.75 -.95 M.8 0 L.75 -.95 M-.7 .25 L-.66 -.85 M.7 .25 L.66 -.85" stroke="#4a3a2a" stroke-width=".06"/>`;
  k += `<path d="M-.95 -.95 H.95 V-1.02 H-.95 Z" fill="#6b4a32"/><path d="M-.9 -.95 L.9 -.95 L.82 -.62 L-.82 -.62Z" fill="#7a2338"/><path d="M-.9 -.95 L-.82 -.62" stroke="#a84a5c" stroke-width=".03"/>`;
  /* Böhmisches Überfangglas: farbige Außenschicht, eingeschliffene helle Oliven (Fenster) und eine Rautenborte
     am Hals, zwei weiße Glanzpunkte, durchscheinender Rand; daneben klarer Kristall */
  const q3 = (v) => Math.round(v * 1000) / 1000;
  const vase = (cx, h, c, hell) => {
    const y0 = -1.02, ym = y0 - h * 0.42;
    let g = `<path d="M${q3(cx - 0.07)} ${y0} Q${q3(cx - 0.13)} ${q3(y0 - h * 0.45)} ${q3(cx - 0.04)} ${q3(y0 - h * 0.8)} L${q3(cx - 0.06)} ${q3(y0 - h)} H${q3(cx + 0.06)} L${q3(cx + 0.04)} ${q3(y0 - h * 0.8)} Q${q3(cx + 0.13)} ${q3(y0 - h * 0.45)} ${q3(cx + 0.07)} ${y0} Z" fill="${c}"/>`;
    g += `<ellipse cx="${q3(cx)}" cy="${q3(ym)}" rx=".022" ry="${q3(h * 0.17)}" fill="${hell}"/><ellipse cx="${q3(cx - 0.062)}" cy="${q3(ym)}" rx=".01" ry="${q3(h * 0.14)}" fill="${hell}" opacity=".8"/><ellipse cx="${q3(cx + 0.062)}" cy="${q3(ym)}" rx=".01" ry="${q3(h * 0.14)}" fill="${hell}" opacity=".6"/>`;
    g += `<path d="M${q3(cx - 0.045)} ${q3(y0 - h * 0.74)} l.015 -.02 .015 .02 .015 -.02 .015 .02 .015 -.02 .015 .02" stroke="${hell}" stroke-width=".008" fill="none"/>`;
    g += `<path d="M${q3(cx - 0.06)} ${q3(y0 - h)} H${q3(cx + 0.06)}" stroke="${hell}" stroke-width=".012" opacity=".8"/><path d="M${q3(cx - 0.085)} ${q3(y0 - h * 0.2)} Q${q3(cx - 0.11)} ${q3(y0 - h * 0.45)} ${q3(cx - 0.05)} ${q3(y0 - h * 0.7)}" stroke="#fff" stroke-width=".014" fill="none" opacity=".75"/><circle cx="${q3(cx + 0.045)}" cy="${q3(y0 - h * 0.3)}" r=".011" fill="#fff"/>`;
    return g;
  };
    const pokal = (cx, h, c, hell) => {
    const y0 = -1.02;
    return `<path d="M${q3(cx - 0.06)} ${y0} H${q3(cx + 0.06)} L${q3(cx + 0.012)} ${q3(y0 - h * 0.45)} L${q3(cx + 0.075)} ${q3(y0 - h * 0.6)} Q${q3(cx + 0.09)} ${q3(y0 - h)} ${q3(cx + 0.085)} ${q3(y0 - h)} H${q3(cx - 0.085)} Q${q3(cx - 0.09)} ${q3(y0 - h)} ${q3(cx - 0.075)} ${q3(y0 - h * 0.6)} L${q3(cx - 0.012)} ${q3(y0 - h * 0.45)} Z" fill="${c}"/>` +
      `<path d="M${q3(cx - 0.06)} ${q3(y0 - h * 0.8)} l.03 .04 .03 -.04 .03 .04 .03 -.04" stroke="${hell}" stroke-width=".012" fill="none"/><ellipse cx="${q3(cx)}" cy="${q3(y0 - h * 0.72)}" rx=".016" ry="${q3(h * 0.08)}" fill="${hell}"/><path d="M${q3(cx - 0.07)} ${q3(y0 - h * 0.62)} Q${q3(cx - 0.085)} ${q3(y0 - h * 0.85)} ${q3(cx - 0.07)} ${q3(y0 - h * 0.97)}" stroke="#fff" stroke-width=".012" fill="none" opacity=".8"/><path d="M${q3(cx - 0.085)} ${q3(y0 - h)} H${q3(cx + 0.085)}" stroke="${hell}" stroke-width=".01"/>`;
  };
  k += vase(-0.62, 0.34, "#a8102c", "#f7c9cf") + pokal(-0.38, 0.28, "#1f4fa8", "#cfe0f8") + vase(-0.15, 0.3, "#d4ecf2", "#ffffff") + pokal(0.08, 0.24, "#2e8a5a", "#cdf2dc");
  k += `<path d="M.3 -1.02 h.16 l-.03 -.12 h-.1 Z M.52 -1.02 h.16 l-.03 -.12 h-.1 Z" fill="#d9eef4" stroke="#fff" stroke-width=".01"/><path d="M.33 -1.1 l.05 .04 .05 -.04 M.55 -1.1 l.05 .04 .05 -.04" stroke="#fff" stroke-width=".008" fill="none"/>`;
  /* Schmuck: Granatketten (böhmischer Granat) auf dunklem Samt */
  k += `<rect x=".72" y="-1.05" width=".2" height=".1" fill="#2a1d24"/><path d="M.74 -1.03 q.08 .07 .16 0 M.75 -1.0 q.07 .05 .14 0" stroke="#b01c30" stroke-width=".014" fill="none" stroke-dasharray=".01 .006"/>`;
  k += `</g>`;
  S.teil({ id: "stand", de: "der Stand", syl: "STAND", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "stall", x, y, steht: true, kunst: k,
    zoom: { x: r(x - 24), y: r(y - 44), w: 48, h: 32 },
    unter: [{ id: "vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: r(x - 0.4 * sc), y: r(y - 1.02 * sc),
      kunst: flaeche(-0.4 * sc, -0.38 * sc, 0.8 * sc, 0.4 * sc, 0.4), tipp: "Böhmisches Glas ist berühmt: Es wird von Hand geschliffen." }],
    tipp: "Auf der Brücke verkaufen Künstler Bilder, Schmuck und Glas." });
}

/* =====================================================================
   12 — DIE TAUBEN auf dem Pflaster
   ===================================================================== */
{
  let k = "";
  const taube = (s, q, dreh) => {
    const sc = F / Dd(s, q), x = X(s, q), y = Y(s, q);
    return `<g transform="translate(${r(x)} ${r(y)}) scale(${(sc * dreh).toFixed(4)} ${sc.toFixed(4)})"><ellipse cx="0" cy=".01" rx=".14" ry=".02" fill="#2b2a3a" opacity=".3"/>` +
      `<path d="M-.15 -.08 Q-.12 -.17 0 -.17 Q.1 -.17 .12 -.12 Q.12 -.05 .05 -.04 L-.12 -.05 L-.2 -.06 Z" fill="#8f939e"/><path d="M-.08 -.13 Q.02 -.16 .07 -.1 Q0 -.07 -.08 -.08Z" fill="#6f737e"/>` +
      `<circle cx=".11" cy="-.18" r=".045" fill="#7a7e8a"/><path d="M.1 -.15 q.03 .02 .04 .04" stroke="#6a9a7a" stroke-width=".02"/><path d="M.15 -.185 l.04 .01 l-.04 .01Z" fill="#c8a080"/>` +
      `<path d="M-.01 -.04 v.04 M.03 -.04 v.04" stroke="#c46a5a" stroke-width=".015"/></g>`;
  };
  k += taube(12.4, 1.6, 1) + taube(13.1, 2.4, -1) + taube(12.0, 2.3, 1);
  const tx = X(12.5, 2.1), ty = Y(12.5, 2.1);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: k + flaeche(tx - 9, ty - 7, 18, 9, 0.6) });
}

/* =====================================================================
   13 — DER MUSIKER mit Akkordeon und Hut für die Münzen
   ===================================================================== */
let MUS = null;
{
  const s0 = 11, q0 = -0.8, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  BRUECKE_SCHATTEN.push(schatten(s0, q0, 1.76, 0.25));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 4, kopf: 6, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0,
    schulterL: { vor: 30, seit: 28, dreh: 30 }, ellbogenL: 85, unterarmL: 20, handL: 0, fingerL: 0.6, schulterR: { vor: 30, seit: 28, dreh: 30 }, ellbogenR: 85, unterarmR: 20, handR: 0, fingerR: 0.6 };
  const m = B.mensch({ id: "prg_mus", geschlecht: "m", blick: 30, neigung: 16, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true, pose,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "#2c2a30" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "hut", farbe: "#2a2a2e" } } }, r(1.76 * sc));
  MUS = { x, y, m, sc };
  S.teil({ id: "musiker", de: "der Musiker", syl: "MU-si-ker", it: "il musicista", itSyl: "mu-si-CI-sta", en: "musician", x, y, kunst: `<g filter="url(#${S.id("kante")})">${kompaktFein(m, m.svg, 0.7)}</g>`,
    tipp: "Auf der Karlsbrücke spielen jeden Tag Straßenmusiker." });
}
{
  /* Akkordeon zwischen den Händen: rote Gehäuse, Balg in Falten, Tastatur links */
  const { x, y, m } = MUS;
  const hL = { x: x + m.z.handL.x * m.k, y: y + m.z.handL.y * m.k }, hR = { x: x + m.z.handR.x * m.k, y: y + m.z.handR.y * m.k };
  const cx = (hL.x + hR.x) / 2, cy = (hL.y + hR.y) / 2 + 1.2, w = Math.abs(hL.x - hR.x) * 0.92, h = w * 0.62;
  /* Diskantseite mit Tastatur (rechte Hand des Spielers = im Bild links), gefalteter Balg, Bassseite mit Knöpfen */
  const q3 = (v) => Math.round(v * 100) / 100, bw = w * 0.56, x0 = -w / 2 + w * 0.22;
  let k = `<rect x="${q3(-w / 2)}" y="${q3(-h / 2)}" width="${q3(w * 0.22)}" height="${q3(h)}" rx=".4" fill="#b3241f"/><rect x="${q3(w / 2 - w * 0.22)}" y="${q3(-h / 2)}" width="${q3(w * 0.22)}" height="${q3(h)}" rx=".4" fill="#9e1f1b"/>`;
  let hell = "", dunkel = "", zo = "", zu = "";
  for (let i = 0; i < 8; i++) {
    const a = x0 + i * bw / 8, b = a + bw / 16;
    hell += `M${q3(a)} ${q3(-h / 2 + 0.2)}h${q3(bw / 16)}v${q3(h - 0.4)}h${q3(-bw / 16)}Z`; dunkel += `M${q3(b)} ${q3(-h / 2 + 0.2)}h${q3(bw / 16)}v${q3(h - 0.4)}h${q3(-bw / 16)}Z`;
    zo += `${i ? "L" : "M"}${q3(a)} ${q3(-h / 2 + 0.2)}L${q3(b)} ${q3(-h / 2 + 0.6)}`; zu += `${i ? "L" : "M"}${q3(a)} ${q3(h / 2 - 0.2)}L${q3(b)} ${q3(h / 2 - 0.6)}`;
  }
  k += `<path d="${hell}" fill="#3c3c46"/><path d="${dunkel}" fill="#1c1c22"/><path d="${zo}L${q3(x0 + bw)} ${q3(-h / 2 + 0.2)}${zu}L${q3(x0 + bw)} ${q3(h / 2 - 0.2)}" stroke="#d8d8de" stroke-width=".22" fill="none"/>`;
  k += `<rect x="${q3(-w / 2 + 0.25)}" y="${q3(-h / 2 + 0.4)}" width="${q3(w * 0.12)}" height="${q3(h - 0.8)}" fill="#f4f1ea"/>`;
  let ta = "";
  for (let y = -h / 2 + 0.9; y < h / 2 - 0.6; y += 0.75) ta += `M${q3(-w / 2 + 0.25 + w * 0.05)} ${q3(y)}h${q3(w * 0.07)}`;
  k += `<path d="${ta}" stroke="#1d1d22" stroke-width=".32"/>`;
  let kn = "";
  for (let i = 0; i < 9; i++) kn += `<circle cx="${q3(w / 2 - w * 0.16 + (i % 3) * w * 0.045)}" cy="${q3(-h / 2 + 0.9 + Math.floor(i / 3) * 0.75)}" r=".2" fill="#f0ece2"/>`;
  k += kn + `<rect x="${q3(-w / 2)}" y="${q3(-h / 2)}" width="${q3(w)}" height=".35" fill="#fff" opacity=".25"/>`;
  S.teil({ oben: true, id: "akkordeon", de: "das Akkordeon", syl: "ak-KOR-de-on", it: "la fisarmonica", itSyl: "fi-sar-MO-ni-ca", en: "accordion", x: r(cx), y: r(cy), kunst: k });
}
{
  /* Hut mit Münzen vor dem Musiker */
  const s0 = 10.1, q0 = 0.2, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  let k = `<g transform="scale(${sc.toFixed(4)})"><ellipse cx="0" cy="-.03" rx=".22" ry=".07" fill="#2a2a2e"/><path d="M-.13 -.05 Q-.13 -.17 0 -.17 Q.13 -.17 .13 -.05 Z" fill="#33333a"/>`;
  k += `<ellipse cx="0" cy="-.09" rx=".1" ry=".03" fill="#5a3a2a"/><circle cx="-.03" cy="-.095" r=".018" fill="#e9c35a"/><circle cx=".03" cy="-.09" r=".016" fill="#c9c9cf"/><circle cx=".005" cy="-.1" r=".015" fill="#e9c35a"/></g>`;
  S.teil({ oben: true, id: "hut", de: "der Hut", syl: "HUT", it: "il cappello", itSyl: "cap-PEL-lo", en: "hat", x, y, steht: true, kunst: k + flaeche(-7, -6, 14, 6.6, 0.6),
    tipp: "Wer die Musik mag, wirft eine Münze in den Hut." });
}

/* =====================================================================
   14 — DER PUPPENSPIELER mit der Marionette
   ===================================================================== */
let PUP = null;
{
  const s0 = 14.5, q0 = 1.0, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  BRUECKE_SCHATTEN.push(schatten(s0, q0, 1.78, 0.25) + schatten(14.0, 0.35, 0.55, 0.1, 0.25));
  const pose = { kipp: 0, lende: 1, brust: 2, nacken: 12, kopf: 14, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0,
    schulterL: { vor: 55, seit: 10, dreh: 0 }, ellbogenL: 40, unterarmL: 20, handL: 0, fingerL: 0.7, schulterR: { vor: 55, seit: 10, dreh: 0 }, ellbogenR: 40, unterarmR: 20, handR: 0, fingerR: 0.7 };
  const m = B.mensch({ id: "prg_pup", geschlecht: "m", blick: -28, neigung: 16, frisur: "locken", haarfarbe: "dunkelbraun", haut: "hell", pose,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f5f95" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "#d9a43a" } } }, r(1.78 * sc));
  PUP = { x, y, m, sc };
  S.teil({ id: "puppenspieler", de: "der Puppenspieler", syl: "PUP-pen-spie-ler", it: "il burattinaio", itSyl: "bu-rat-ti-NA-io", en: "puppeteer", x, y, kunst: `<g filter="url(#${S.id("kante")})">${kompaktFein(m, m.svg, 0.8)}</g>`,
    tipp: "Der Puppenspieler steht hinter der Puppe und hält das Holzkreuz mit den Fäden." });
}
{
  /* Marionette: Spielkreuz in den Händen, Fäden, kleine Figur (Teufelchen? nein: ein Musikant mit Hut) tanzt auf dem Pflaster */
  const { x, y, m, sc } = PUP;
  const hL = { x: x + m.z.handL.x * m.k, y: y + m.z.handL.y * m.k }, hR = { x: x + m.z.handR.x * m.k, y: y + m.z.handR.y * m.k };
  const kx = (hL.x + hR.x) / 2, ky = (hL.y + hR.y) / 2;
  /* Fußpunkt der Puppe: 0,5 m vor dem Spieler (links von ihm im Bild) */
  const fx = X(14.0, 0.35), fy = Y(14.0, 0.35), ps = F / Dd(14.0, 0.35);
  const ph = 0.55 * ps;   /* 55 cm groß */
  let k = `<path d="M${r(kx - 1.6)} ${r(ky)} L${r(kx + 1.6)} ${r(ky)} M${r(kx)} ${r(ky - 0.8)} V${r(ky + 0.8)}" stroke="#7a5432" stroke-width=".45" stroke-linecap="round"/>`;
  const kopfY = fy - ph * 0.88, handY = fy - ph * 0.55;
  k += `<path d="M${r(kx)} ${r(ky)} L${r(fx)} ${r(kopfY)} M${r(kx - 1.6)} ${r(ky)} L${r(fx - ph * 0.2)} ${r(handY)} M${r(kx + 1.6)} ${r(ky)} L${r(fx + ph * 0.22)} ${r(handY - ph * 0.1)} M${r(kx - 0.6)} ${r(ky + 0.4)} L${r(fx - ph * 0.07)} ${r(fy - ph * 0.03)} M${r(kx + 0.6)} ${r(ky + 0.4)} L${r(fx + ph * 0.1)} ${r(fy - ph * 0.08)}" stroke="#e8e4da" stroke-width=".12" opacity=".8"/>`;
  /* Figur: Hut, Gesicht, rote Jacke, schwarze Hose, Holzschuhe */
  const g = (a, b) => `${r(fx + a * ph)} ${r(fy + b * ph)}`;
  k += `<path d="M${g(-0.12, -0.6)} L${g(0.12, -0.6)} L${g(0.14, -0.3)} L${g(-0.14, -0.3)}Z" fill="#c0392b"/>`;
  k += `<path d="M${g(-0.1, -0.3)} L${g(-0.07, -0.03)} M${g(0.08, -0.3)} L${g(0.1, -0.08)}" stroke="#2a2a30" stroke-width="${r(0.07 * ph)}" stroke-linecap="round"/>`;
  k += `<path d="M${g(-0.12, -0.56)} L${g(-0.2, -0.55)} M${g(0.12, -0.56)} L${g(0.22, -0.65)}" stroke="#c0392b" stroke-width="${r(0.06 * ph)}" stroke-linecap="round"/>`;
  k += `<circle cx="${r(fx)}" cy="${r(fy - ph * 0.7)}" r="${r(ph * 0.1)}" fill="#e8c4a0"/><circle cx="${r(fx + ph * 0.03)}" cy="${r(fy - ph * 0.69)}" r="${r(ph * 0.02)}" fill="#c0392b"/>`;
  k += `<path d="M${g(-0.14, -0.76)} L${g(0.14, -0.76)} L${g(0.09, -0.8)} L${g(0.07, -0.9)} L${g(-0.07, -0.9)} L${g(-0.09, -0.8)}Z" fill="#2a2a30"/>`;
  k += `<ellipse cx="${r(fx - ph * 0.07)}" cy="${r(fy)}" rx="${r(ph * 0.06)}" ry="${r(ph * 0.03)}" fill="#7a5432"/><ellipse cx="${r(fx + ph * 0.1)}" cy="${r(fy - ph * 0.05)}" rx="${r(ph * 0.06)}" ry="${r(ph * 0.03)}" fill="#7a5432"/>`;
  S.teil({ oben: true, id: "marionette", de: "die Marionette", syl: "ma-ri-o-NET-te", it: "la marionetta", itSyl: "ma-rio-NET-ta", en: "marionette", x: 0, y: 0, kunst: k + flaeche(fx - 7, fy - ph - 1, 14, ph + 2, 0.6),
    tipp: "Eine Marionette ist eine Puppe an Fäden." });
}

/* =====================================================================
   15 — DIE TOURISTIN mit dem Trdelník
   ===================================================================== */
{
  const s0 = 9.6, q0 = 3.0, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  BRUECKE_SCHATTEN.push(schatten(s0, q0, 1.66, 0.24));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 2, kopf: 0, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0,
    schulterR: { vor: 20, seit: 10, dreh: 20 }, ellbogenR: 120, unterarmR: 40, handR: 0, fingerR: 0.7, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.4 };
  const m = B.mensch({ id: "prg_tour", geschlecht: "w", blick: 34, neigung: 18, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true, pose,
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#e9a03a" }, schuhe: { stueck: "turnschuh" } } }, r(1.66 * sc));
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: `<g filter="url(#${S.id("kante")})">${kompaktFein(m, m.svg, 0.8)}</g>`,
    tipp: "Am frühen Morgen ist die Karlsbrücke noch fast leer." });
  /* Trdelník: Hohlgebäck (Rolle), goldbraun mit Zimtzucker, oben Eis */
  const hx = x + m.z.handR.x * m.k, hy = y + m.z.handR.y * m.k;
  const ts = sc / 20;
  let k = `<g transform="scale(${ts.toFixed(4)})"><path d="M-1 0 L-1.3 -4.6 Q0 -5.1 1.3 -4.6 L1 0 Z" fill="${S.lg("trdl", [[0, "#9a5a22"], [0.5, "#d8964a"], [1, "#a8642a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.05 -.8 L1.05 -1.4 M-1.12 -1.9 L1.12 -2.5 M-1.2 -3 L1.2 -3.6 M-1.26 -4.1 L1.2 -4.6" stroke="#7a3e12" stroke-width=".28"/>`;
  let zu = "";
  for (let i = 0; i < 14; i++) zu += `<circle cx="${r((rnd() - 0.5) * 2)}" cy="${r(-rnd() * 4.4)}" r=".14" fill="#f6e2b8"/>`;
  k += zu + `<ellipse cx="0" cy="-4.78" rx="1.3" ry=".42" fill="#c98a42"/><ellipse cx="0" cy="-4.74" rx=".86" ry=".26" fill="#5a2e10"/><path d="M-1.25 -4.7 Q0 -4.3 1.25 -4.7" stroke="#e8b56a" stroke-width=".18" fill="none"/></g>`;
  S.teil({ oben: true, id: "trdelnik", de: "der Trdelník", syl: "TR-del-ník", it: "il trdelník", itSyl: "TR-del-nik", en: "chimney cake", x: r(hx), y: r(hy + 2.2 * ts), kunst: k + flaeche(-5, -6.5 * ts - 2, 10, 6.5 * ts + 3, 0.6),
    tipp: "Der Trdelník ist ein süßes Gebäck vom Spieß, mit Zimt und Zucker. Viele Touristen essen ihn in Prag." });
}

BRUECKE.kunst += `<g pointer-events="none">${BRUECKE_SCHATTEN.join("")}</g>`;
{ const md = S.teile.find((t) => t.id === "moldau"); md.kunst = ausgespart(md.kunst); }
{
  const t = S.teile.find((t) => t.id === "brueckenturm");
  S.def(`<filter id="${S.id("schwarz")}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter>`);
  S.def(`<mask id="${S.id("turmmaske")}" maskUnits="userSpaceOnUse" x="-150" y="-100" width="300" height="200"><rect x="-150" y="-100" width="300" height="200" fill="#fff"/><g transform="translate(${-t.x} ${-t.y})" filter="url(#${S.id("schwarz")})"><use href="#${S.id("turmdinge")}"/></g></mask>`);
  t.kunst = `<g mask="url(#${S.id("turmmaske")})">${t.kunst}</g>`;
}
for (const t of S.teile) if (["aussichtsturm", "veitsdom", "prager_burg", "nikolauskirche", "brueckenturm"].includes(t.id)) t.kunst = `<g filter="url(#${S.id("luft")})">${t.kunst}</g>`;
pfadeKlein(S);
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/prag.js"));
console.log(aus);
