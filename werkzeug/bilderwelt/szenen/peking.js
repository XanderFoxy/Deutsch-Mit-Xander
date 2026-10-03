#!/usr/bin/env node
/* =====================================================================
   PEKING UND DIE GROSSE MAUER (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (visitbeijing.com.cn „Tian'anmen Gate“, China Daily
   „Mutianyu Great Wall – Landscape features“, Beijing-Regierung
   „Mutianyu (AAAAA)“, ourchinastory „The lanterns at Tiananmen“,
   travelchinawith.me „Mutianyu“; UNSICHER = nicht durch Quellen belegt):
   - BLICK von der Terrasse eines Restaurants im 1. Stock (Augenhöhe 9 m)
     über die Chang'an-Straße genau nach NORDEN auf die Mittelachse der
     Stadt. Anfang Oktober (Nationalfeiertag, „goldene Woche“), Nachmittag;
     die Sonne steht hinter uns im Südwesten.
   - TIAN'ANMEN (Tor des Himmlischen Friedens, 1420, 1651 neu): 34,7 m
     hoch. Unten der rote Torbau, rund 120 × 40 m (4800 m²), auf einem
     Fuß aus weißem Marmor, rund 14 m hoch (UNSICHER: 13–15 m), mit FÜNF
     Torbögen — der mittlere ist der größte, früher nur für den Kaiser.
     Darüber das Porträt (6,4 × 5 m, hier leicht verkleinert) und links
     und rechts die beiden Spruchbänder (links „Es lebe die Volksrepublik
     China“, rechts „Es lebe die große Einheit der Völker der Welt“).
     Oben ein weißes Marmorgeländer. Darauf der Torturm: neun Joche breit,
     fünf tief (die kaiserlichen Zahlen), rote Säulen, Doppeldach im
     Xieshan-Stil (Walm unten, Giebel oben) mit kaiserlich GELBEN
     Glasurziegeln. Unter den Traufen blau-grün bemalte Konsolen (Dougong)
     und Balken mit Hexi-Malerei (goldgerahmte Felder mit Drachen). Am
     First zwei große Drachenköpfe (Chiwen), die den First „verschlucken“,
     auf den Graten vorn der Reiter auf dem Phönix, dahinter die Reihe der
     Dachtiere, am Ende das Chuishou-Tier. Zwischen den zehn Säulen der
     Galerie hängen ACHT rote Palastlaternen (seit 1. Oktober 1949), das
     Mitteljoch bleibt frei.
   - DAVOR: der Goldwasserfluss mit weißem Marmorgeländer und fünf
     Brücken vor den fünf Toren (das Wasser liegt tief und ist von hier
     kaum zu sehen), davor die Platzfläche mit dem Paar HUABIAO —
     Marmorsäulen mit sich hochwindendem Drachen, querliegendem
     Wolkenbrett, rundem Tauteller und sitzendem Fabeltier (Hou) obenauf —
     und dem Paar Steinlöwen (links die Löwin mit dem Jungen, rechts der
     Löwe mit dem Ball). An der Straße die weißen Huadeng-Laternen
     (Magnolienlaternen) und zum Feiertag rote Fahnen. Links und rechts
     die rote Mauer der Kaiserstadt mit gelber Ziegelkappe, dahinter alte
     Zypressen und Ginkgos (Zhongshan-Park links, Kulturpalast rechts).
   - DIE GROSSE MAUER (Ming-Zeit): auf den Kämmen der Yanshan-Berge im
     NORDEN, 7–8 m hoch, oben 4–5 m breit, grauer Granit und graue Ziegel,
     Zinnen; in Mutianyu stehen 22 Wachtürme auf 2,25 km, quadratische
     „Mini-Festungen“ mit Bogenfenstern; an steilen Stellen wird der
     Wehrgang zur Treppe. Im Oktober leuchten die Hänge rot und gelb.
     GESTAUCHT: Die Berge liegen 60–70 km nördlich (links Badaling im
     Nordwesten, rechts Mutianyu im Nordosten). Sie rücken — in der
     richtigen Himmelsrichtung und im Dunst — wie mit dem Teleobjektiv
     hinter die Stadt (wie der Fuji in der Japan-Szene).
   - VORNE (ebenfalls gestaucht, richtig nach Süden geordnet): Pekingente
     isst man in den alten Restaurants am Qianmen, gut 1 km südlich — hier
     liegt die Terrasse an der Straße: rote Säule, graues Ziegeldach mit
     bemalten Sparren, Holzgeländer mit Bubujin-Gitter, rote Laternen. Auf
     dem Tisch die glasierte, mahagonibraune Ente, ein Teller mit
     Hautscheiben, dünne Pfannkuchen im offenen Bambuskorb, süße
     Bohnensoße, Frühlingszwiebel und Gurke in Streifen, Teigtaschen
     (Jiaozi), Essstäbchen auf dem Bänkchen, Tee in blau-weißem Porzellan.
     Unten auf dem Gehweg wartet eine Fahrradrikscha (Hutong-Rikscha mit
     rotem Verdeck), daneben ein Chrysanthemenkübel zum Feiertag. Am
     Himmel ein Schwalbendrachen („Shayan“), die Schnur führt in den
     Zhongshan-Park.
   Maßstab: Augenhöhe 9 m über der Straße (Terrasse 7,4 m hoch),
   Horizont y = 104, Brennweite 331: Punkt in d Metern und h Metern Höhe:
   y = 104 + (9 − h)·331/d, x = 180 + s·331/d. Das Tor steht 132 m weit
   (2,5 Einheiten je Meter), die Rikscha 24,5 m, der Tisch 2–3 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "peking", titel: "Peking und die Große Mauer", emoji: "🐉", thema: "Länder", kuerzel: "pek", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1420);
const r = B.r;
const HOR = 104, E = 9, F = 331, CX = 180, BODEN = 7.4;      /* BODEN: Höhe der Terrasse */
const yAt = (d, h = 0) => HOR + (E - h) * F / d;
const uAt = (d) => F / d;
const xAt = (s, d) => CX + s * F / d;
const P0 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";
/* Vielecke am Bildrand abschneiden, damit kein Teil aus dem Bild ragt */
const kappe = (poly, innen, kreuz) => { const out = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]; if (innen(a)) { out.push(a); if (!innen(b)) out.push(kreuz(a, b)); } else if (innen(b)) out.push(kreuz(a, b)); }); return out; };
const P = (pts) => {
  let q = kappe(pts, (a) => a[0] >= 0, (a, b) => [0, a[1] + (b[1] - a[1]) * (0 - a[0]) / (b[0] - a[0])]);
  q = kappe(q, (a) => a[0] <= 400, (a, b) => [400, a[1] + (b[1] - a[1]) * (400 - a[0]) / (b[0] - a[0])]);
  q = kappe(q, (a) => a[1] <= 260, (a, b) => [a[0] + (b[0] - a[0]) * (260 - a[1]) / (b[1] - a[1]), 260]);
  return q.length ? P0(q) : "";
};
const linieK = (x1, y1, x2, y2) => { for (const g of [0, 400]) { if ((x1 - g) * (x2 - g) < 0) { const t = (g - x1) / (x2 - x1); if ((g === 0 && x1 < 0) || (g === 400 && x1 > 400)) { y1 = y1 + (y2 - y1) * t; x1 = g; } else { y2 = y1 + (y2 - y1) * t; x2 = g; } } } if (y2 > 260) { x2 = x1 + (x2 - x1) * (260 - y1) / (y2 - y1); y2 = 260; } return `x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}"`; };
/* Figuren in der Ferne vereinfachen (Ladezeit!) — siehe indien.js */
const vereinfache = (svg, stufe) => {
  const grenze = stufe >= 2 ? 1.2 : stufe > 1 ? 0.6 : 0.25;
  svg = svg.replace(/<(path|ellipse|line)\b[^>]*?\/>/g, (el) => { const sw = el.match(/stroke-width="([\d.]+)"/); return /fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze ? "" : el; });
  if (stufe > 1 && stufe < 2) svg = svg.split(/(transform="[^"]*")/).map((t, i) => i % 2 ? t : t.replace(/(-?\d+\.\d{2,})/g, (m) => String(Math.round(parseFloat(m) * 10) / 10))).join("");
  if (stufe >= 2) {
    const farbe = {};
    svg.replace(/<(linearGradient|radialGradient) id="([^"]+)"[^>]*>(.*?)<\/\1>/g, (_, t, id, inn) => { const st = [...inn.matchAll(/stop-color="([^"]+)"/g)].map((m) => m[1]); farbe[id] = st[Math.floor(st.length / 2)] || "#888"; return ""; });
    svg = svg.replace(/<defs>.*?<\/defs>/g, "").replace(/ clip-path="url\(#[^)]+\)"/g, "").replace(/url\(#([^)]+)\)/g, (_, id) => farbe[id] || "#888");
    /* Zahlen runden, aber nicht in transform="…" (sonst wird scale(0,05) zu scale(0)) */
    svg = svg.replace(/ (d|cx|cy|r|rx|ry|x|y|x1|y1|x2|y2|width|height)="([^"]*)"/g, (_, n, v) => ` ${n}="${v.replace(/-?\d+(?:\.\d+)?/g, (m) => String(Math.round(parseFloat(m) / 3) * 3))}"`).replace(/(-?\d+\.\d{2,})/g, (m, _, o, all) => m);
    /* winzig: Augen, Finger und andere kleine Teile entfallen */
    svg = svg.replace(/<ellipse[^>]*\/>/g, "").replace(/<path d="([^"]*)"[^>]*\/>/g, (el, d) => d.length < 40 ? "" : el);
  }
  return svg;
};
/* winzige Figur einmal als Vorlage anlegen und mehrfach (auch gespiegelt) verwenden */
const winzigDef = (name, spec, hoehe, kappenFarbe = "#d62a1e", hut = false) => {
  const m = B.mensch(spec, hoehe);
  /* Kappe bzw. Sonnenhut gehen beim Vereinfachen verloren: kräftig nachzeichnen */
  let kappe = spec.kleidung && spec.kleidung.kopf ? `<path d="M${r(-0.075 * hoehe)} ${r(-0.925 * hoehe)} Q0 ${r(-1.02 * hoehe)} ${r(0.075 * hoehe)} ${r(-0.925 * hoehe)} Z" fill="${kappenFarbe}"/>` : "";
  if (hut) kappe = `<ellipse cx="0" cy="${r(-0.93 * hoehe)}" rx="${r(0.13 * hoehe)}" ry="${r(0.025 * hoehe)}" fill="#e8d6a0"/><path d="M${r(-0.06 * hoehe)} ${r(-0.93 * hoehe)} Q0 ${r(-1.03 * hoehe)} ${r(0.06 * hoehe)} ${r(-0.93 * hoehe)} Z" fill="#e8d6a0"/><rect x="${r(-0.06 * hoehe)}" y="${r(-0.95 * hoehe)}" width="${r(0.12 * hoehe)}" height="${r(0.015 * hoehe)}" fill="#c0392b"/>`;
  S.def(`<g id="${S.id(name)}">${vereinfache(m.svg, 2)}${kappe}</g>`); return S.id(name);
};

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("weich2")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<filter id="${S.id("weich1")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".6"/></filter>`);
/* feiner Buschwald: kleine Tupfen in zwei Mustern */
for (const [name, w, h, n, versatz] of [["busch", 19, 13, 46, 0], ["busch2", 13, 11, 26, 5]]) {
  const zr = zufall(77 + w);
  let m = "";
  for (let i = 0; i < n; i++) {
    const x = zr() * w, y = zr() * h, s = 0.35 + zr() * 0.35, f = zr(), c = f < 0.55 ? ["#56664e", "#6c7a5c"] : f < 0.75 ? ["#8a5a42", "#a8724e"] : f < 0.9 ? ["#8f7e4a", "#ad9a5c"] : ["#5e6c52", "#7a8660"];
    for (const [dx, dy] of [[0, 0], [w, 0], [0, h], [w, h], [-w, 0], [0, -h], [-w, -h], [w, -h], [-w, h]]) {
      const X = x + dx, Y = y + dy; if (X < -2 || X > w + 2 || Y < -2 || Y > h + 2) continue;
      m += `<ellipse cx="${r(X)}" cy="${r(Y)}" rx="${r(1.2 * s)}" ry="${r(0.8 * s)}" fill="${c[0]}"/><ellipse cx="${r(X - 0.3 * s)}" cy="${r(Y - 0.25 * s)}" rx="${r(0.6 * s)}" ry="${r(0.4 * s)}" fill="${c[1]}"/>`;
    }
  }
  S.def(`<pattern id="${S.id(name)}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="translate(${versatz} ${versatz / 2})">${m}</pattern>`);
}
S.def(`<pattern id="${S.id("ziegel")}" width="1.6" height="4" patternUnits="userSpaceOnUse"><rect width="1.6" height="4" fill="#e7ad1f"/><rect x="1.05" width=".55" height="4" fill="#b57a0c"/><rect x=".2" width=".35" height="4" fill="#f7d36a" opacity=".8"/></pattern>`);
S.def(`<pattern id="${S.id("grauziegel")}" width="2.4" height="5" patternUnits="userSpaceOnUse"><rect width="2.4" height="5" fill="#6d7075"/><rect x="1.5" width=".9" height="5" fill="#4a4d52"/><rect x=".3" width=".5" height="5" fill="#8b8e93" opacity=".8"/></pattern>`);
const ROT = S.lg("rot", [[0, "#c2402e"], [1, "#a2301f"]]);
const ROT_S = S.lg("rots", [[0, "#b0261c"], [1, "#8c1c14"]], 0, 0, 1, 0);
const MARMOR = S.lg("marmor", [[0, "#f6f4ee"], [1, "#d7d3c8"]]);
const MARMOR_V = S.lg("marmorv", [[0, "#e9e6dd"], [0.35, "#f8f6f0"], [0.7, "#e2ded4"], [1, "#b9b4a6"]], 0, 0, 1, 0);
const GRUENBLAU = S.lg("dougong", [[0, "#2f8a7e"], [0.5, "#1f6d8a"], [1, "#2a5f7a"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.45, "#e9bd3c"], [1, "#9a6b0c"]], 0, 0, 1, 1);
const LACK = S.lg("lack", [[0, "#7a2a1c"], [1, "#4e1810"]]);

/* =====================================================================
   KULISSE — Herbsthimmel, ferne Berge
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 24}" fill="${S.lg("himmel", [[0, "#3a78c4"], [0.5, "#86b4e2"], [0.86, "#d3e2ea"], [1, "#e8e4d8"]])}"/>`);
S.hinten(`<circle cx="30" cy="150" r="160" fill="${S.rg("sonnenlicht", [[0, "#fff4d8", 0.35], [1, "#fff4d8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[214, 16, 1], [110, 12, 0.6], [168, 30, 0.45]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".8">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 4], [-11, 1.5, 11, 3.2], [12, 1, 12, 3.6], [-3, -3, 9, 3.8]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
S.hinten(`<path d="M0 78 Q40 66 80 74 Q120 62 160 70 Q200 60 240 68 Q290 58 330 66 Q370 60 400 64 L400 112 L0 112 Z" fill="${S.lg("fernberg", [[0, "#aebbcc"], [1, "#cdd6de"]])}"/>`);

/* =====================================================================
   1 — DER BERG und 2 — DIE GROSSE MAUER (Lupe: Wachturm, Zinne, Treppe)
   ===================================================================== */
const KAMM_L = [[0, 70.5], [6, 66], [11, 63], [16, 64], [22, 55], [28, 49], [33, 44], [38, 38], [43, 34.5], [47, 34], [51, 36], [56, 41], [61, 47], [66, 50], [70, 54], [74, 56.5], [80, 59], [86, 63], [92, 66], [98, 70], [106, 76], [116, 82], [128, 90]];
const KAMM_R = [[248, 94], [258, 90], [266, 86], [272, 82], [278, 78.5], [285, 76], [292, 71], [299, 66], [306, 62.5], [312, 60], [318, 58.5], [324, 60], [330, 63], [337, 67], [343, 69], [349, 68], [356, 65.5], [363, 62], [370, 60.5], [377, 62], [384, 63.5], [392, 66], [400, 69]];
const kurve = (pts) => {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = i === 1 ? pts[0] : [(pts[i - 2][0] + pts[i - 1][0]) / 2, (pts[i - 2][1] + pts[i - 1][1]) / 2], c = pts[i - 1], b = [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
    for (let t = 0.25; t <= 1.001; t += 0.25) out.push([(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]);
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const KL = kurve(KAMM_L), KR = kurve(KAMM_R);
const kammY = (pts, x) => { for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return pts[pts.length - 1][1]; };
const linie = (pts, dy = 0) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y + dy)).join(" ");
{
  let k = "";
  for (const pts of [KL, KR]) {
    const x0 = pts[0][0], x1 = pts[pts.length - 1][0], umriss = `${linie(pts, 0.8)} L${x1} 112 L${x0} 112 Z`;
    k += `<path d="${umriss}" fill="${S.lg("berg", [[0, "#6a7672"], [0.45, "#76827a"], [1, "#a0a9a4"]])}"/>`;
    k += `<g filter="url(#${S.id("weich1")})"><path d="${umriss}" fill="url(#${S.id("busch")})" opacity=".5"/><path d="${umriss}" fill="url(#${S.id("busch2")})" opacity=".35"/></g>`;
    for (let i = 0; i < 9; i++) {
      const x = x0 + 13 + rnd() * (x1 - x0 - 26), top = kammY(pts, x), y = top + 8 + rnd() * (104 - top - 8);
      k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(4 + rnd() * 5)}" ry="${r(2 + rnd() * 2.5)}" fill="${["#a8604a", "#b89050", "#9a5a44", "#c0a050"][i % 4]}" opacity=".3" filter="url(#${S.id("weich2")})"/>`;
    }
    /* Grate (hell, Licht von links) und Rinnen (dunkel) */
    for (let i = 3; i < pts.length - 3; i += 4) {
      const [x, y] = pts[i], neig = pts[i + 2][1] - pts[i - 2][1], sd = neig < -0.5 ? -1 : neig > 0.5 ? 1 : (i % 8 < 4 ? -1 : 1);
      const lang = 22 + (i * 7) % 16, ex = x + sd * lang * 0.42, ey = Math.min(104, y + lang);
      if (ex < 4 || ex > 396) continue;
      k += `<path d="M${r(x)} ${r(y + 1.4)} Q${r(x + sd * lang * 0.12)} ${r(y + lang * 0.5)} ${r(ex)} ${r(ey)}" stroke="#2f3d38" stroke-width="${r(1.4 + lang * 0.06)}" opacity=".2" fill="none" stroke-linecap="round" filter="url(#${S.id("weich1")})"/>`;
      k += `<path d="M${r(x - 1)} ${r(y + 1.4)} Q${r(x - 1 + sd * lang * 0.1)} ${r(y + lang * 0.45)} ${r(ex - 2)} ${r(ey - 3)}" stroke="#f3ead2" stroke-width="${r(0.8 + lang * 0.03)}" opacity=".18" fill="none" stroke-linecap="round" filter="url(#${S.id("weich1")})"/>`;
    }
    k += `<path d="${linie(pts, 2.4)}" stroke="#34433c" stroke-width="2.4" opacity=".18" fill="none" filter="url(#${S.id("weich1")})"/>`;
    /* Dunst: 60–70 km Luft dazwischen */
    k += `<path d="${umriss}" fill="${S.lg("bergdunst", [[0, "#c9d6e2", 0.3], [0.6, "#d6e0e8", 0.46], [1, "#e6e4dc", 0.78]])}"/>`;
  }
  S.teil({ anker: [16, 84], id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 0, y: 0, kunst: k,
    tipp: "Im Norden von Peking liegen die Yanshan-Berge. Auf ihren Kämmen läuft die Große Mauer." });
}
const mauerUnter = [];
{
  let k = "";
  /* Mauer aus grauem Granit und Ziegeln, Lichtseite warm; dünn, weil weit weg */
  const mauer = (pts) => {
    const unten = pts.map(([x, y]) => [x, y + 1.7]).reverse();
    let g = `<path d="${linie(pts, 0.25)} ${unten.map(([x, y]) => "L" + r(x) + " " + r(y)).join(" ")} Z" fill="${S.lg("mauerseite", [[0, "#8a8a7c"], [1, "#66655a"]])}"/>`;
    g += `<path d="${linie(pts, 0.1)}" stroke="#bdb7a0" stroke-width=".55" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="${linie(pts, -0.25)}" stroke="#9c9a8a" stroke-width=".7" stroke-dasharray=".44 .46" fill="none"/>`;
    return g;
  };
  k += mauer(KL) + mauer(KR);
  /* Trefferband: 8 Einheiten hoch entlang der Kämme (fast durchsichtig gemalt, damit es Tipps fängt) */
  for (const pts of [KL, KR]) { const o = pts.filter((_, i) => i % 3 === 0).concat([pts[pts.length - 1]]); k += `<path d="${linie(o, -4)} ${[...o].reverse().map(([x, y]) => "L" + r(x) + " " + r(y + 4)).join(" ")} Z" fill="rgba(255,255,255,0.001)"/>`; }
  /* steile Treppe zwischen x 22 und 40: Stufenkanten hell, Setzstufen dunkel */
  const treppe = (pts, x0, x1) => {
    /* Wehrgang als heller Streifen zwischen Brustwehr und Zinnen, darauf Stufen als Sägezahn */
    let a = `<path d="${linie(pts.filter(([x]) => x >= x0 && x <= x1), 0.15)}" stroke="#d6d0bc" stroke-width=".7" fill="none"/>`, d = "", t = "";
    for (let x = x0; x < x1 - 0.5; x += 0.55) {
      const y = kammY(pts, x) + 0.4, y2 = kammY(pts, x + 0.55) + 0.4, hoch = y2 < y;
      d += hoch ? `M${r(x)} ${r(y)}V${r(y2)}` : `M${r(x + 0.55)} ${r(y)}V${r(y2)}`;
      t += `M${r(x)} ${r(hoch ? y2 : y)}h.55`;
    }
    return a + `<path d="${t}" stroke="#f4efd8" stroke-width=".22"/><path d="${d}" stroke="#4a483e" stroke-width=".2"/>`;
  };
  k += treppe(KL, 22, 40) + treppe(KR, 290, 311);
  /* Wachtürme: klein (ferne Berge), zwei Geschosse, Bogenfenster, Zinnenkranz */
  const turm = (x, y, s) => {
    const w = 6 * s, h = 6 * s, t = 1.5 * s;
    let g = `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2)} ${r(y - h)} L${r(x + w / 2)} ${r(y - h)} L${r(x + w / 2)} ${r(y)} Z" fill="${S.lg("turm", [[0, "#b5b2a2"], [1, "#94917f"]])}"/>`;
    g += `<path d="M${r(x + w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y - h)} L${r(x + w / 2 + t)} ${r(y - h - 0.6 * s)} L${r(x + w / 2 + t)} ${r(y - 0.6 * s)} Z" fill="#6e6c60"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${r(x - w / 2 + 0.1 * s + i * w / 5)}" y="${r(y - h - 1 * s)}" width="${r(w / 8)}" height="${r(1 * s)}" fill="#a9a696"/>`;
    for (let i = 0; i < 3; i++) { const fx = x - w / 2 + w * (0.2 + i * 0.3); g += `<path d="M${r(fx - 0.45 * s)} ${r(y - 1.2 * s)} L${r(fx - 0.45 * s)} ${r(y - 3 * s)} Q${r(fx)} ${r(y - 3.7 * s)} ${r(fx + 0.45 * s)} ${r(y - 3 * s)} L${r(fx + 0.45 * s)} ${r(y - 1.2 * s)} Z" fill="#3b372e"/>`; }
    g += `<rect x="${r(x - w / 2)}" y="${r(y - 4.2 * s)}" width="${r(w)}" height="${r(0.4 * s)}" fill="#7e7c6e"/>`;
    return g;
  };
  const tuerme = [[3, KL], [12, KL], [24, KL], [34, KL], [46, KL], [57, KL], [68, KL], [80, KL], [92, KL], [104, KL], [262, KR], [276, KR], [290, KR], [304, KR], [318, KR], [331, KR], [345, KR], [358, KR], [371, KR], [385, KR], [397, KR]];
  for (const [x, pts] of tuerme) k += turm(x, kammY(pts, x) + 1.2, x === 46 ? 0.42 : 0.36);
  k += `<path d="${linie(KL, -0.2)} L128 112 L0 112 Z" fill="${S.lg("mauerdunst", [[0, "#d6e0e8", 0.2], [1, "#d6e0e8", 0.4]])}" pointer-events="none"/>`;
  mauerUnter.push({ id: "wachturm", de: "der Wachturm", syl: "WACH-turm", it: "la torre di guardia", itSyl: "TOR-re di GUAR-dia", en: "watchtower", x: 46, y: r(kammY(KL, 46) + 1.2), kunst: flaeche(-1.8, -3.6, 4, 3.8),
    tipp: "Im Wachturm wohnten Soldaten. Bei Gefahr machten sie Rauch- und Feuerzeichen." });
  mauerUnter.push({ id: "zinne", de: "die Zinne", syl: "ZIN-ne", it: "il merlo", itSyl: "MER-lo", en: "battlement", x: 62, y: r(kammY(KL, 62) + 0.8), kunst: flaeche(-4.4, -3, 7.4, 3.6),
    tipp: "Hinter den Zinnen konnten sich die Soldaten schützen. Durch die Scharten schossen sie." });
  mauerUnter.push({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "stairs", x: 31, y: r(kammY(KL, 31) + 0.6), kunst: flaeche(-7, -6.4, 11.4, 8),
    tipp: "Wo der Berg sehr steil ist, wird die Mauer zur Treppe." });
  S.teil({ anker: [284, r(kammY(KR, 284) + 0.6)], id: "grosse_mauer", de: "die Große Mauer", syl: "GRO-ße MAU-er", it: "la Grande Muraglia", itSyl: "GRAN-de mu-RA-glia", en: "Great Wall", x: 0, y: 0, kunst: k,
    zoom: { x: 18, y: 27, w: 54, h: 36 }, unter: mauerUnter,
    tipp: "Die Große Mauer (auch Chinesische Mauer) ist mit allen Teilen über 20 000 km lang." });
}

/* =====================================================================
   3 — DER DRACHEN (Pekinger Schwalbendrachen „Shayan“), Schnur in den Park
   ===================================================================== */
{
  /* die Schnur liegt vorn ohne Trefferwirkung (S.davor) und endet in den Bäumen hinter der Palastmauer */
  S.davor(`<path d="M100 23 Q76 55 54 77 Q40 89 24 92" stroke="#f4f1ea" stroke-width=".2" fill="none" opacity=".85" pointer-events="none"/>`);
  let k = "";
  /* Schwalbe: breite Flügel, langer Gabelschwanz, kräftige Muster in Schwarz, Rot, Blau */
  const fl = (s) => `<path d="M0 -1.6 Q${3 * s} -5.4 ${7.4 * s} -4.6 Q${8.2 * s} -2.6 ${6.6 * s} -.6 Q${3.6 * s} -.6 ${1 * s} 1.6 Z" fill="#f7f2e4" stroke="#141414" stroke-width=".3"/>
    <path d="M${1.2 * s} -2 Q${4 * s} -4.6 ${7 * s} -4" stroke="#141414" stroke-width=".7" fill="none"/><path d="M${1.6 * s} -.6 Q${4 * s} -2.6 ${6.4 * s} -1.6" stroke="#c0392b" stroke-width=".6" fill="none"/>
    <circle cx="${4.6 * s}" cy="-2.6" r=".75" fill="#1f5f9a"/><circle cx="${4.6 * s}" cy="-2.6" r=".32" fill="#f2c23a"/>`;
  k += fl(1) + fl(-1);
  k += `<path d="M-1 1.6 L-3.6 9.6 L-.5 4.6 L0 5.2 L.5 4.6 L3.6 9.6 L1 1.6 Z" fill="#f7f2e4" stroke="#141414" stroke-width=".3"/><path d="M-2.6 7.6 L-.8 3.4 M2.6 7.6 L.8 3.4" stroke="#c0392b" stroke-width=".45"/>`;
  k += `<ellipse cx="0" cy="-.6" rx="1.6" ry="2.6" fill="#f7f2e4" stroke="#141414" stroke-width=".3"/><circle cx="-.65" cy="-1.5" r=".55" fill="#fff" stroke="#141414" stroke-width=".25"/><circle cx=".65" cy="-1.5" r=".55" fill="#fff" stroke="#141414" stroke-width=".25"/><circle cx="-.65" cy="-1.5" r=".25" fill="#141414"/><circle cx=".65" cy="-1.5" r=".25" fill="#141414"/><path d="M-.9 .6 Q0 1.6 .9 .6" fill="#c0392b"/>`;
  S.teil({ oben: true, id: "drachen", de: "der Drachen", syl: "DRA-chen", it: "l'aquilone", itSyl: "a-qui-LO-ne", en: "kite", x: 100, y: 17, kunst: k + flaeche(-8.6, -6, 17.2, 16),
    tipp: "Der Schwalbendrachen ist der typische Drachen aus Peking. Im Herbst lässt man ihn im Park steigen." });
}

/* =====================================================================
   4 — DIE PALASTMAUER mit Bäumen dahinter
   ===================================================================== */
const TOR_D = 132, TU = uAt(TOR_D);          /* 2,51 je Meter */
const TOR_Y = yAt(TOR_D);                    /* 126,6 */
const ty = (h) => yAt(TOR_D, h);
{
  let k = "";
  const baum = (x, y, w, h, f1, f2) => {
    let g = `<path d="M${r(x - w)} ${r(y)} Q${r(x - w * 1.1)} ${r(y - h * 0.6)} ${r(x - w * 0.5)} ${r(y - h * 0.9)} Q${r(x)} ${r(y - h * 1.08)} ${r(x + w * 0.5)} ${r(y - h * 0.9)} Q${r(x + w * 1.1)} ${r(y - h * 0.6)} ${r(x + w)} ${r(y)} Z" fill="${f1}"/>`;
    for (let i = 0; i < 7; i++) g += `<ellipse cx="${r(x - w * 0.7 + rnd() * w * 1.4)}" cy="${r(y - h * (0.3 + rnd() * 0.6))}" rx="${r(w * 0.3)}" ry="${r(h * 0.12)}" fill="${f2}" opacity=".7"/>`;
    return g + `<path d="M${r(x - w * 0.8)} ${r(y - h * 0.5)} Q${r(x - w * 0.6)} ${r(y - h * 0.85)} ${r(x - w * 0.2)} ${r(y - h * 0.95)}" stroke="#fff3d0" stroke-width=".6" opacity=".25" fill="none"/>`;
  };
  for (const [x0, x1] of [[4, 32], [332, 392]]) {
    for (let x = x0; x < x1; x += 7 + rnd() * 4) {
      const art = rnd(), y = ty(7) + 1;
      if (art < 0.45) k += baum(x, y, 3.2, 24 + rnd() * 6, "#2f4a32", "#3d5c3c");
      else if (art < 0.75) k += baum(x, y, 7, 16 + rnd() * 5, "#4f6a3e", "#6a8448");
      else k += baum(x, y, 6, 15 + rnd() * 5, "#c99a2e", "#e6bf4a");
    }
  }
  const mauer = (x0, x1) => {
    let g = `<rect x="${x0}" y="${r(ty(7))}" width="${x1 - x0}" height="${r(TOR_Y - ty(7))}" fill="${ROT}"/>`;
    g += `<rect x="${x0}" y="${r(ty(7) - 2.4)}" width="${x1 - x0}" height="2.6" fill="url(#${S.id("ziegel")})"/><rect x="${x0}" y="${r(ty(7) - 2.8)}" width="${x1 - x0}" height=".7" fill="#c98e12"/><rect x="${x0}" y="${r(ty(7) + 0.1)}" width="${x1 - x0}" height=".9" fill="#5a1a10" opacity=".35"/>`;
    g += `<rect x="${x0}" y="${r(TOR_Y - 2)}" width="${x1 - x0}" height="2" fill="#d9d4c8"/>`;
    return g;
  };
  k += mauer(0, 32) + mauer(328, 400);
  S.teil({ anker: [12, 116], id: "palastmauer", de: "die Palastmauer", syl: "pa-LAST-mau-er", it: "il muro del palazzo", itSyl: "MU-ro del pa-LAZ-zo", en: "palace wall", x: 0, y: 0, kunst: k,
    tipp: "Die roten Mauern mit gelben Ziegeln umgaben einst die Kaiserstadt." });
}

/* =====================================================================
   5 — DAS TOR DES HIMMLISCHEN FRIEDENS (Lupe: Dachfigur, Dachziegel, Palastlaterne)
       6 — DER TORBOGEN (eigenes Teil: die fünf Durchgänge)
   ===================================================================== */
const torUnter = [];
const JOCH = 142 / 9;
const H = { pod: 14, gel: 15.2, stufe: 14.6, saeuleO: 19.8, balken: 20.6, trauf1: 21.4, wand2: 23.8, balken2: 25.6, kons2: 26.4, trauf2: 27.8, grat: 31, first: 33.4, chi: 34.7 };
const BOEGEN = [[0, 5.6, 6.8], [-40, 4.4, 6], [40, 4.4, 6], [-75, 3.6, 5.2], [75, 3.6, 5.2]];
const X = (m) => CX + m;
{
  let k = "";
  const yTop = ty(H.pod), yFuss = ty(1.2);
  k += `<path d="M${X(-151)} ${r(TOR_Y)} L${X(-148)} ${r(yTop)} L${X(148)} ${r(yTop)} L${X(151)} ${r(TOR_Y)} Z" fill="${ROT}"/>`;
  k += `<path d="M${X(-151)} ${r(TOR_Y)} L${X(-148)} ${r(yTop)} L${X(148)} ${r(yTop)} L${X(151)} ${r(TOR_Y)} Z" fill="${S.lg("podlicht", [[0, "#fff1d6", 0.18], [0.5, "#fff1d6", 0.04], [1, "#2a0a06", 0.14]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 40; i++) k += `<rect x="${r(X(-146 + rnd() * 292))}" y="${r(yTop + 2 + rnd() * (yFuss - yTop - 4))}" width="${r(1 + rnd() * 3)}" height=".5" fill="#8e2618" opacity=".25"/>`;
  k += `<rect x="${X(-152)}" y="${r(yFuss)}" width="304" height="${r(TOR_Y - yFuss)}" fill="${MARMOR}"/>`;
  k += `<rect x="${X(-152)}" y="${r(yFuss + 0.9)}" width="304" height=".5" fill="#b9b4a6"/><rect x="${X(-152)}" y="${r(TOR_Y - 0.6)}" width="304" height=".6" fill="#a9a497"/>`;
  /* Porträt in würdigem Abstand über dem Mitteltor (neutral, mit Glasreflex) */
  const pT = ty(13.8), pB = ty(8.0), pw = 4.55 * TU / 2;
  k += `<rect x="${r(X(0) - pw - 1.4)}" y="${r(pT - 1.4)}" width="${r(2 * pw + 2.8)}" height="${r(pB - pT + 2.8)}" fill="${S.lg("bildrahmen", [[0, "#f3d36a"], [0.5, "#c99a2e"], [1, "#8a6418"]], 0, 0, 1, 1)}"/><rect x="${r(X(0) - pw - 0.5)}" y="${r(pT - 0.5)}" width="${r(2 * pw + 1)}" height="${r(pB - pT + 1)}" fill="#6e5420"/><rect x="${r(X(0) - pw)}" y="${r(pT)}" width="${r(2 * pw)}" height="${r(pB - pT)}" fill="${S.lg("bildgrund", [[0, "#d8ddd4"], [1, "#b4beb4"]])}"/>`;
  k += `<path d="M${r(X(0) - pw + 0.5)} ${r(pB)} Q${r(X(0) - pw + 0.8)} ${r(pB - 5.4)} ${X(0)} ${r(pB - 6)} Q${r(X(0) + pw - 0.8)} ${r(pB - 5.4)} ${r(X(0) + pw - 0.5)} ${r(pB)} Z" fill="#5c6462"/><path d="M${X(0) - 1} ${r(pB - 5.8)} L${X(0)} ${r(pB - 3)} L${X(0) + 1} ${r(pB - 5.8)}" fill="#e8e6dc"/>`;
  k += `<ellipse cx="${X(0)}" cy="${r(pT + 5)}" rx="2.6" ry="3.2" fill="#dcbc98"/><path d="M${X(0) - 2.7} ${r(pT + 4.2)} Q${X(0) - 2.6} ${r(pT + 1.2)} ${X(0)} ${r(pT + 1.4)} Q${X(0) + 2.6} ${r(pT + 1.2)} ${X(0) + 2.7} ${r(pT + 4.2)} Q${X(0)} ${r(pT + 2.6)} ${X(0) - 2.7} ${r(pT + 4.2)} Z" fill="#2b2b2b"/>`;
  k += `<path d="M${r(X(0) - pw)} ${r(pT + 2)} L${r(X(0) - pw + 3)} ${r(pT)} L${r(X(0) - pw + 5)} ${r(pT)} L${r(X(0) - pw)} ${r(pT + 5)} Z" fill="#fff" opacity=".28"/>`;
  /* die zwei Spruchbänder */
  for (const [sd, txt] of [[-1, "中华人民共和国万岁"], [1, "世界人民大团结万岁"]]) {
    k += `<text x="${r(X(sd * 79))}" y="${r(ty(10.2))}" font-size="4.2" text-anchor="middle" fill="#fbf3dc" font-family="'Noto Sans CJK SC','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif" font-weight="bold" letter-spacing=".5">${txt}</text>`;
  }
  /* weißes Marmorgeländer oben am Torbau */
  const gT = ty(H.gel);
  k += `<rect x="${X(-148)}" y="${r(gT)}" width="296" height="${r(yTop - gT)}" fill="${MARMOR}"/>`;
  for (let m = -147; m <= 147; m += 3.4) k += `<rect x="${r(X(m) - 0.35)}" y="${r(gT - 0.7)}" width=".7" height="${r(yTop - gT + 0.7)}" fill="#c9c4b6"/><circle cx="${r(X(m))}" cy="${r(gT - 0.8)}" r=".4" fill="#ece9e1"/>`;
  k += `<rect x="${X(-148)}" y="${r(gT + 1.2)}" width="296" height=".35" fill="#bdb8aa"/>`;
  /* ---- Torturm ---- */
  const yStufe = ty(H.stufe), ySk = ty(H.saeuleO), yBal = ty(H.balken), yTrauf1 = ty(H.trauf1), yWand2 = ty(H.wand2), yBal2 = ty(H.balken2), yKons2 = ty(H.kons2), yTrauf2 = ty(H.trauf2), yGrat = ty(H.grat), yFirst = ty(H.first), yChi = ty(H.chi);
  k += `<rect x="${X(-80)}" y="${r(yStufe)}" width="160" height="${r(gT - yStufe + 0.3)}" fill="#ddd8cc"/>`;
  k += `<rect x="${X(-71)}" y="${r(ySk)}" width="142" height="${r(yStufe - ySk)}" fill="${S.lg("halle", [[0, "#4a1810"], [1, "#7a2a1a"]])}"/>`;
  for (let i = 0; i < 9; i++) {
    const x0 = X(-71 + i * JOCH) + 1.6, w = JOCH - 3.2;
    k += `<rect x="${r(x0)}" y="${r(ySk + 1)}" width="${r(w)}" height="${r(yStufe - ySk - 1.6)}" fill="#8f2a1a"/>`;
    for (let j = 1; j < 4; j++) k += `<line x1="${r(x0 + j * w / 4)}" y1="${r(ySk + 1)}" x2="${r(x0 + j * w / 4)}" y2="${r(yStufe - 0.6)}" stroke="#c99a4a" stroke-width=".22" opacity=".8"/>`;
    k += `<path d="M${r(x0)} ${r(ySk + 3)} H${r(x0 + w)} M${r(x0)} ${r(ySk + 5.4)} H${r(x0 + w)}" stroke="#c99a4a" stroke-width=".2" opacity=".7"/>`;
  }
  for (let i = 0; i <= 9; i++) { const x = X(-71 + i * JOCH); k += `<rect x="${r(x - 1)}" y="${r(ySk)}" width="2" height="${r(yStufe - ySk)}" fill="${ROT_S}"/><rect x="${r(x - 1)}" y="${r(ySk)}" width=".5" height="${r(yStufe - ySk)}" fill="#e2735a" opacity=".6"/>`; }
  /* Hexi-Balken: blau-grün mit goldgerahmten Feldern (Drachen), darüber das dichte Konsolenband */
  const hexi = (yo, yu, xl, xr) => {
    let g = `<rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height="${r(yu - yo)}" fill="${GRUENBLAU}"/><rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height=".3" fill="#e9bd3c"/><rect x="${r(xl)}" y="${r(yu - 0.3)}" width="${r(xr - xl)}" height=".3" fill="#e9bd3c"/>`;
    for (let i = 0; i < 9; i++) {
      const a = xl + (xr - xl) * i / 9 + 2, b = xl + (xr - xl) * (i + 1) / 9 - 2, m = (yo + yu) / 2, hh = (yu - yo) / 2 - 0.35;
      g += `<path d="M${r(a)} ${r(m)} L${r(a + 1.2)} ${r(m - hh)} L${r(b - 1.2)} ${r(m - hh)} L${r(b)} ${r(m)} L${r(b - 1.2)} ${r(m + hh)} L${r(a + 1.2)} ${r(m + hh)} Z" fill="#1d4f7a" stroke="#e9bd3c" stroke-width=".25"/>`;
      g += `<path d="M${r(a + 2)} ${r(m + 0.2)} q${r((b - a - 4) / 4)} -.8 ${r((b - a - 4) / 2)} 0 q${r((b - a - 4) / 4)} .8 ${r((b - a - 4) / 2)} 0" stroke="#e9bd3c" stroke-width=".3" fill="none"/>`;
    }
    return g;
  };
  const konsolen = (yo, yu, xl, xr) => {
    let g = `<rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height="${r(yu - yo)}" fill="#163f52"/>`;
    const h3 = (yu - yo) / 3;
    for (let ebene = 0; ebene < 3; ebene++) {
      const y = yu - (ebene + 1) * h3, w = 1.5 + ebene * 0.35;
      for (let x = xl + 1 + (ebene % 2) * 0.9; x < xr - 1; x += 1.8) g += `<rect x="${r(x - w / 2)}" y="${r(y + 0.15)}" width="${r(w)}" height="${r(h3 - 0.3)}" rx=".2" fill="${(Math.round(x / 1.8) + ebene) % 2 ? "#2f8a7e" : "#2a6aa0"}"/>`;
    }
    for (let x = xl + 1; x < xr - 1; x += 1.8) g += `<rect x="${r(x - 0.35)}" y="${r(yu - 0.6)}" width=".7" height=".6" fill="#e9bd3c"/>`;
    return g;
  };
  k += hexi(ySk - 0.2, yBal, X(-73), X(73)) + konsolen(yBal, yTrauf1 + 0.8, X(-74), X(74));
  /* Schatten der unteren Traufe auf der oberen Hallenhälfte (Sonne von Südwesten) */
  /* acht Palastlaternen (Mitteljoch frei) */
  const laterne = (x, y, s = 1) => `<line x1="${r(x)}" y1="${r(ySk)}" x2="${r(x)}" y2="${r(y - 3.6 * s)}" stroke="#3a2a1a" stroke-width=".25"/><rect x="${r(x - 1.6 * s)}" y="${r(y - 3.9 * s)}" width="${r(3.2 * s)}" height="${r(0.7 * s)}" fill="${GOLD}"/>
    <ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(3.1 * s)}" ry="${r(3.4 * s)}" fill="${S.rg("laterne", [[0, "#ff6a4a"], [0.55, "#e0251a"], [1, "#9a0f0a"]], 0.42, 0.38, 0.7)}"/>
    <path d="M${r(x - 1.6 * s)} ${r(y - 3.1 * s)} Q${r(x - 2.4 * s)} ${r(y)} ${r(x - 1.6 * s)} ${r(y + 3.1 * s)} M${r(x + 1.6 * s)} ${r(y - 3.1 * s)} Q${r(x + 2.4 * s)} ${r(y)} ${r(x + 1.6 * s)} ${r(y + 3.1 * s)}" stroke="#a8140c" stroke-width=".25" fill="none"/>
    <rect x="${r(x - 1.6 * s)}" y="${r(y + 3.2 * s)}" width="${r(3.2 * s)}" height="${r(0.7 * s)}" fill="${GOLD}"/><path d="M${r(x - 1.2 * s)} ${r(y + 3.9 * s)} L${r(x - 1.4 * s)} ${r(y + 6.2 * s)} L${r(x + 1.4 * s)} ${r(y + 6.2 * s)} L${r(x + 1.2 * s)} ${r(y + 3.9 * s)} Z" fill="#f2c23a"/>`;
  const latY = r((ySk + yStufe) / 2 - 1.4);
  for (let i = 0; i < 9; i++) if (i !== 4) { const lx = X(-71 + (i + 0.5) * JOCH); k += laterne(lx, latY, 0.9) + `<ellipse cx="${r(lx)}" cy="${r(latY - 0.6)}" rx="2.8" ry="2.6" fill="#1a0604" opacity=".3"/><ellipse cx="${r(lx + 0.4)}" cy="${r(latY + 2)}" rx="1.1" ry=".6" fill="#ffd0a0" opacity=".55"/>`; }
  /* Schatten der unteren Traufe: Keil, links tiefer als rechts (Nachmittagssonne aus Südwesten, etwa 30°) */
  { const hh = yStufe - ySk; k += `<path d="M${X(-71)} ${r(ySk)} L${X(71)} ${r(ySk)} L${X(71)} ${r(ySk + hh * 0.34)} L${X(-71)} ${r(ySk + hh * 0.62)} Z" fill="#12060a" opacity=".38"/>`; }
  /* Obergeschoss: Wand mit Fenstern, Hexi-Balken, Konsolen */
  k += `<rect x="${X(-71)}" y="${r(yBal2)}" width="142" height="${r(yWand2 - yBal2)}" fill="${S.lg("wand2", [[0, "#5a1a10"], [1, "#9a2a1a"]])}"/>`;
  for (let i = 0; i < 9; i++) { const x0 = X(-71 + i * JOCH) + 2.2; k += `<rect x="${r(x0)}" y="${r(yBal2 + 1)}" width="${r(JOCH - 4.4)}" height="${r(yWand2 - yBal2 - 1.4)}" fill="#a83020"/><path d="M${r(x0)} ${r(yBal2 + 2.4)} h${r(JOCH - 4.4)}" stroke="#c99a4a" stroke-width=".2"/>`; }
  k += hexi(yKons2, yBal2, X(-71), X(71)) + konsolen(yTrauf2 + 0.6, yKons2, X(-72), X(72));
  { const hh = yWand2 - yKons2; k += `<path d="M${X(-71)} ${r(yKons2)} L${X(71)} ${r(yKons2)} L${X(71)} ${r(yKons2 + hh * 0.45)} L${X(-71)} ${r(yKons2 + hh * 0.8)} Z" fill="#12060a" opacity=".4"/>`; }
  /* Dächer */
  const traufe = (yE, wE, hoch) => `M${X(-wE - 2)} ${r(yE - hoch)} Q${X(-wE + 6)} ${r(yE + 0.6)} ${X(-wE + 16)} ${r(yE)} L${X(wE - 16)} ${r(yE)} Q${X(wE - 6)} ${r(yE + 0.6)} ${X(wE + 2)} ${r(yE - hoch)}`;
  const dachKante = (yE, wE, hoch) => {
    let g = `<path d="${traufe(yE, wE, hoch)}" stroke="#a86c08" stroke-width=".9" fill="none"/>`;
    for (let m = -wE + 14; m <= wE - 14; m += 1.6) g += `<circle cx="${r(X(m))}" cy="${r(yE + 0.2)}" r=".42" fill="#f3c64a"/>`;
    return g + `<path d="M${X(-wE + 14)} ${r(yE + 1.1)} H${X(wE - 14)}" stroke="#1f6d8a" stroke-width=".7"/><path d="M${X(-wE + 14)} ${r(yE + 1.7)} H${X(wE - 14)}" stroke="#b0261c" stroke-width=".5"/>`;
  };
  const dU = `${traufe(yTrauf1, 87, 2.6)} L${X(71)} ${r(yWand2)} L${X(-71)} ${r(yWand2)} Z`;
  k += `<path d="${dU}" fill="url(#${S.id("ziegel")})"/><path d="${dU}" fill="${S.lg("dachlicht", [[0, "#fff6c8", 0.25], [0.5, "#fff6c8", 0], [1, "#5a3a00", 0.25]])}"/>` + dachKante(yTrauf1, 87, 2.6);
  const dO = `${traufe(yTrauf2, 89, 2.8)} L${X(62)} ${r(yGrat)} L${X(57)} ${r(yFirst)} L${X(-57)} ${r(yFirst)} L${X(-62)} ${r(yGrat)} Z`;
  k += `<path d="${dO}" fill="url(#${S.id("ziegel")})"/><path d="${dO}" fill="${S.lg("dachlicht", [])}"/>` + dachKante(yTrauf2, 89, 2.8);
  /* Grate mit Dachfiguren: vorn der Reiter auf dem Phönix, dahinter neun Tiere, am Ende das Chuishou-Tier */
  /* Figuren in Einheiten, Fuß bei (0,0), Blick nach außen (sd). Reihenfolge am Tian'anmen: Reiter auf dem Huhn,
     dann Drache, Phönix, Löwe, Himmelspferd, Seepferd, Suanni, Yayu, Xiezhi, Douniu (UNSICHER, ob alle neun), am Ende das Chuishou. */
  const fig = (x, y, sd, pts, farbe) => `<path d="M${pts.map(([a, b]) => `${r(x + a * sd)} ${r(y + b)}`).join(" L")} Z" fill="${farbe}" stroke="#7a5206" stroke-width=".12" stroke-linejoin="round"/>`;
  const auge = (x, y, sd, a, b) => `<circle cx="${r(x + a * sd)}" cy="${r(y + b)}" r=".09" fill="#3a2404"/>`;
  const FORMEN = {
    drache: [[-0.45, 0], [-0.4, -0.7], [-0.2, -1.1], [0.05, -1.2], [0.1, -1.5], [0.22, -1.22], [0.5, -1.12], [0.48, -0.96], [0.2, -0.9], [0.35, -0.5], [0.42, 0]],
    phoenix: [[-0.45, 0], [-0.5, -0.45], [-0.62, -1.35], [-0.3, -0.8], [-0.1, -0.85], [0.12, -1.18], [0.3, -1.12], [0.52, -1.02], [0.3, -0.95], [0.32, -0.5], [0.4, 0]],
    loewe: [[-0.45, 0], [-0.45, -0.6], [-0.25, -0.75], [-0.15, -1.1], [0.1, -1.28], [0.38, -1.15], [0.46, -0.88], [0.3, -0.72], [0.36, -0.4], [0.42, 0]],
    pferd: [[-0.42, 0], [-0.38, -0.75], [-0.2, -1.05], [0.05, -1.32], [0.18, -1.18], [0.55, -0.98], [0.52, -0.84], [0.18, -0.86], [0.32, -0.45], [0.38, 0]],
    fisch: [[-0.45, 0], [-0.62, -0.5], [-0.4, -0.55], [-0.2, -0.95], [0.15, -1.1], [0.48, -0.9], [0.3, -0.75], [0.36, -0.4], [0.42, 0]],
    horn: [[-0.45, 0], [-0.42, -0.72], [-0.1, -0.95], [0.2, -1.5], [0.18, -1.05], [0.46, -0.92], [0.44, -0.72], [0.3, -0.6], [0.38, 0]],
  };
  const FOLGE = ["drache", "phoenix", "loewe", "pferd", "pferd", "loewe", "fisch", "horn", "horn"];
  const tier = (x, y, sd, i) => fig(x, y, sd, FORMEN[FOLGE[i]], i % 2 ? "#e2aa24" : "#c99410") + auge(x, y, sd, 0.22, -1.0) + (FOLGE[i] === "loewe" ? `<circle cx="${r(x + 0.12 * sd)}" cy="${r(y - 1.0)}" r=".3" fill="none" stroke="#8a5a08" stroke-width=".12" stroke-dasharray=".12 .1"/>` : "");
  const reiter = (x, y, sd) => fig(x, y, sd, [[-0.6, 0], [-0.72, -0.5], [-0.35, -0.55], [0.2, -0.62], [0.42, -0.85], [0.6, -0.72], [0.45, -0.55], [0.4, 0]], "#c99410") +
    `<path d="M${r(x - 0.12 * sd)} ${r(y - 0.6)} L${r(x - 0.1 * sd)} ${r(y - 1.25)} L${r(x + 0.14 * sd)} ${r(y - 1.25)} L${r(x + 0.12 * sd)} ${r(y - 0.6)} Z" fill="#3a7a52"/><circle cx="${r(x + 0.02 * sd)}" cy="${r(y - 1.45)}" r=".2" fill="#e9bd3c"/>`;
  /* Chuishou am Gratende: Drachenkopf mit Hörnern und offenem Maul, nach außen */
  const chuishou = (x, y, sd) => fig(x, y, sd, [[-1.0, 0.2], [-0.95, -1.3], [-0.55, -2.1], [-0.2, -2.25], [0.0, -2.9], [0.2, -2.2], [0.45, -2.6], [0.55, -2.0], [1.2, -1.8], [1.45, -1.5], [0.8, -1.25], [1.35, -1.0], [1.3, -0.75], [0.6, -0.7], [0.8, 0.2]], "#c08a12") +
    `<path d="M${r(x + 0.8 * sd)} ${r(y - 1.25)} L${r(x + 1.35 * sd)} ${r(y - 1.02)} L${r(x + 0.65 * sd)} ${r(y - 0.85)} Z" fill="#4a1e04"/><circle cx="${r(x + 0.45 * sd)}" cy="${r(y - 1.72)}" r=".14" fill="#2a1602"/><path d="M${r(x - 0.7 * sd)} ${r(y - 1.6)} q${r(-0.2 * sd)} -.4 ${r(0.05 * sd)} -.75 M${r(x - 0.85 * sd)} ${r(y - 1.0)} q${r(-0.25 * sd)} -.3 0 -.6" stroke="#8a5a08" stroke-width=".18" fill="none"/>`;
  for (const sd of [-1, 1]) {
    for (const [ax, ay, bx, by, cx2, cy2] of [[88, yTrauf2 - 2.6, 62, yGrat, 57, yFirst], [86, yTrauf1 - 2.4, 72, yWand2 + 0.4, 72, yWand2 + 0.4]]) {
      k += `<path d="M${X(sd * ax)} ${r(ay)} L${X(sd * bx)} ${r(by)} L${X(sd * cx2)} ${r(cy2)}" stroke="#c88a10" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
      const p = (t) => [X(sd * (ax + (bx - ax) * t)), ay + (by - ay) * t];
      const gross = (fx, fy, inhalt) => `<g transform="translate(${r(fx)} ${r(fy)}) scale(1.6) translate(${r(-fx)} ${r(-fy)})">${inhalt}</g>`;
      let [fx, fy] = p(0.04); k += gross(fx, fy, reiter(fx, fy, -sd));
      for (let i = 0; i < 9; i++) { [fx, fy] = p(0.115 + i * 0.066); k += gross(fx, fy, tier(fx, fy, -sd, i)); }
      [fx, fy] = p(0.8); k += gross(fx, fy, chuishou(fx, fy, -sd));
    }
  }
  /* First mit großen Chiwen: Drachenkopf „verschluckt“ den First, Schwanz hochgerollt, Schwertgriff */
  k += `<rect x="${X(-55)}" y="${r(yFirst - 1.4)}" width="110" height="1.6" rx=".4" fill="#c88a10"/><rect x="${X(-55)}" y="${r(yFirst - 1.4)}" width="110" height=".5" fill="#f6d36a"/>`;
  for (const sd of [-1, 1]) {
    const x0 = X(sd * 55), y0 = yFirst;
    const pt = (dx, dy) => `${r(x0 + sd * dx)} ${r(y0 + dy)}`;
    /* Chiwen (UNSICHER in den Einzelheiten): Drachenkopf mit weit offenem Maul beißt in den First,
       darüber der Körper, der Fischschwanz rollt sich nach außen ein; hinten steckt der Schwertgriff. */
    const pfad = (pts) => "M" + pts.map(([a, b]) => pt(a * 1.15, b * 1.15)).join(" L") + " Z";
    k += `<path d="${pfad([[-2.4, -1.7], [-1.9, -3.2], [-0.6, -4.3], [0.9, -4.6], [1.0, -6.6], [1.5, -8.0], [2.6, -8.7], [3.8, -8.4], [4.6, -7.4], [4.5, -6.3], [3.9, -5.7], [4.7, -5.3], [3.6, -5.0], [3.2, -5.9], [3.6, -6.6], [3.3, -7.3], [2.6, -7.2], [2.3, -6.0], [2.5, -4.4], [3.2, -2.6], [3.4, 0.4], [-1.9, 0.4], [-2.3, -0.2], [-0.6, -0.4], [-0.6, -1.5]])}" fill="#c88a10" stroke="#6a4404" stroke-width=".25" stroke-linejoin="round"/>`;
    /* Maulhöhle, Zähne und der First, der im Maul verschwindet */
    k += `<path d="${pfad([[-2.4, -1.7], [-0.6, -1.5], [-0.6, -0.4], [-2.3, -0.2]])}" fill="#4a1e04"/>`;
    k += `<rect x="${r(Math.min(x0, x0 + sd * -2.9))}" y="${r(y0 - 1.4)}" width="${r(2.9)}" height="1.6" fill="#c88a10"/><rect x="${r(Math.min(x0, x0 + sd * -2.9))}" y="${r(y0 - 1.4)}" width="${r(2.9)}" height=".5" fill="#f6d36a"/>`;
    k += `<path d="M${pt(-2.2, -1.85)} L${pt(-1.9, -1.35)} L${pt(-1.6, -1.85)} M${pt(-1.3, -1.8)} L${pt(-1.05, -1.35)} L${pt(-0.8, -1.75)}" fill="#fff6dc"/>`;
    /* Glanz auf Kopf und Rücken, Schuppenbögen, Mähne, Auge mit Braue */
    k += `<path d="M${pt(-1.6, -3.4)} Q${pt(-0.2, -4.6)} ${pt(1.2, -4.4)}" stroke="#f6d36a" stroke-width=".35" fill="none"/><path d="M${pt(1.4, -7.6)} Q${pt(2.4, -8.6)} ${pt(3.8, -8.2)}" stroke="#f6d36a" stroke-width=".3" fill="none"/>`;
    for (const [a, b] of [[2.9, -1.2], [2.6, -2.4], [2.7, -3.6], [1.8, -2.0], [1.9, -3.1]]) k += `<path d="M${pt(a - 0.45, b)} Q${pt(a, b + 0.5)} ${pt(a + 0.45, b)}" stroke="#8a5a08" stroke-width=".2" fill="none"/>`;
    k += `<path d="M${pt(1.0, -4.5)} L${pt(1.9, -4.9)} L${pt(1.5, -4.0)} L${pt(2.4, -4.2)} L${pt(1.8, -3.3)}" fill="#a86c08"/>`;
    k += `<path d="M${pt(-0.55, -3.15)} Q${pt(0.05, -3.55)} ${pt(0.7, -3.25)} Q${pt(0.05, -2.95)} ${pt(-0.55, -3.15)} Z" fill="#fff0c0"/><circle cx="${r(x0 + sd * 0.1)}" cy="${r(y0 - 3.2)}" r=".2" fill="#2a1602"/><path d="M${pt(-0.8, -3.5)} L${pt(0.2, -3.95)} L${pt(1.0, -3.55)}" stroke="#5a3a04" stroke-width=".4" fill="none"/>`;
    /* Schuppenkamm auf dem Rücken und Spirale am Schwanzende */
    k += `<path d="M${pt(3.0, -2.2)} L${pt(3.6, -2.6)} L${pt(3.05, -3.0)} L${pt(3.55, -3.5)} L${pt(2.95, -3.8)} L${pt(3.3, -4.4)} L${pt(2.75, -4.6)}" fill="#a86c08" stroke="#6a4404" stroke-width=".15"/>`;
    k += `<path d="M${pt(4.2, -7.0)} Q${pt(4.9, -7.9)} ${pt(4.3, -8.6)} Q${pt(3.6, -9.0)} ${pt(3.3, -8.3)} Q${pt(3.2, -7.7)} ${pt(3.8, -7.6)}" stroke="#6a4404" stroke-width=".35" fill="none"/>`;
    /* Schwertgriff mit Parierstange, schräg im Rücken */
    k += `<path d="M${pt(2.2, -4.0)} L${pt(1.9, -7.9)}" stroke="#3a2a10" stroke-width=".85"/><path d="M${pt(1.2, -5.2)} L${pt(3.0, -5.35)}" stroke="#f6d36a" stroke-width=".6" stroke-linecap="round"/><circle cx="${r(x0 + sd * 1.9 * 1.15)}" cy="${r(y0 - 8.1 * 1.15)}" r=".3" fill="#e9bd3c"/>`;
  }
  S.teil({ anker: [132, 64], id: "tor", de: "das Tor des Himmlischen Friedens", syl: "TOR des HIMM-li-schen FRIE-dens", it: "la Porta della Pace Celeste", itSyl: "POR-ta del-la PA-ce ce-LE-ste", en: "Gate of Heavenly Peace", x: 0, y: 0, kunst: k,
    zoom: { x: 96, y: 30, w: 160, h: 102 }, unter: torUnter,
    tipp: "Auf Chinesisch heißt das Tor „Tian'anmen“. Es ist 35 Meter hoch und führt zur Verbotenen Stadt." });
  torUnter.push({ id: "dachfigur", de: "die Dachfigur", syl: "DACH-fi-gur", it: "la statuetta del tetto", itSyl: "sta-tu-ET-ta del TET-to", en: "roof figure", x: X(-82), y: r(yTrauf2 - 2),
    kunst: flaeche(-7, -6, 13, 6.6) + flaeche(-5, (yTrauf1 - 2.4) - (yTrauf2 - 2) - 5, 12, 6),
    tipp: "Auf dem Grat sitzen ein Reiter auf dem Phönix und neun Tiere. Je mehr Tiere, desto wichtiger das Gebäude." });
  /* „der Dachziegel“ entfällt (Runde 3) zugunsten von „der Fluss“ (höchstens 35 Wörter) */
  /* „die Palastlaterne“ entfällt (Runde 2): mit „die Laterne“ vorn sonst drei Laternen-Wörter und 36 statt höchstens 35 Wörter */
}
{
  /* DER TORBOGEN: alle fünf Durchgänge (eigenes Teil, liegt vor dem Torbau) */
  let k = "";
  const yFuss = ty(1.2);
  for (const [m, b, h] of BOEGEN) {
    const w = b * TU / 2, ys = ty(h - b / 2);
    k += `<path d="M${r(X(m) - w - 0.9)} ${r(yFuss)} L${r(X(m) - w - 0.9)} ${r(ys)} A${r(w + 0.9)} ${r(w + 0.9)} 0 0 1 ${r(X(m) + w + 0.9)} ${r(ys)} L${r(X(m) + w + 0.9)} ${r(yFuss)} Z" fill="#8c2316"/>`;
    k += `<path d="M${r(X(m) - w)} ${r(yFuss)} L${r(X(m) - w)} ${r(ys)} A${r(w)} ${r(w)} 0 0 1 ${r(X(m) + w)} ${r(ys)} L${r(X(m) + w)} ${r(yFuss)} Z" fill="${S.lg("tunnel", [[0, "#1d120c"], [1, "#3a241a"]])}"/>`;
    k += `<path d="M${r(X(m) - w * 0.42)} ${r(yFuss)} L${r(X(m) - w * 0.42)} ${r(ys + w * 0.35)} A${r(w * 0.42)} ${r(w * 0.42)} 0 0 1 ${r(X(m) + w * 0.42)} ${r(ys + w * 0.35)} L${r(X(m) + w * 0.42)} ${r(yFuss)} Z" fill="#d9c9a2" opacity=".55"/>`;
    for (const sd of [-1, 1]) {
      const xa = X(m) + sd * w, xb = X(m) + sd * w * 0.62;
      k += `<path d="M${r(xa)} ${r(yFuss)} L${r(xa)} ${r(ys)} L${r(xb)} ${r(ys + 1.4)} L${r(xb)} ${r(yFuss)} Z" fill="#9a2418"/>`;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) k += `<circle cx="${r(xa + (xb - xa) * (0.3 + j * 0.4))}" cy="${r(ys + 2 + i * (yFuss - ys - 3) / 4)}" r=".28" fill="#e8c35a"/>`;
    }
  }
  S.teil({ anker: [X(75), ty(3)], id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co del-la POR-ta", en: "archway", x: 0, y: 0, kunst: k,
    tipp: "Der Torbau hat fünf Torbögen. Durch den mittleren, größten durfte früher nur der Kaiser gehen." });
}

/* =====================================================================
   7 — DIE BRÜCKE (Goldwasserfluss mit Geländer und fünf Brücken)
   ===================================================================== */
const FLUSS = { nah: 112, fern: 124 };
/* Brücken: Mitte in Metern (m / TU), halbe Breite in Metern; die Lage auf dem Bild hängt von der Entfernung ab (Fluchtlinien) */
const BR = BOEGEN.map(([m]) => ({ s: m / TU, b: (m === 0 ? 10 : m === 40 || m === -40 ? 7.5 : 6.5) / 2, mitte: m === 0 }));
const brX = (br, d) => xAt(br.s, d), brW = (br, d) => br.b * uAt(d);
{
  /* DER FLUSS: Platzstreifen am Tor, fernes Ufergeländer, Wasser, nahes Geländer.
     Aus 9 m Höhe läge das Wasser fast ganz hinter dem nahen Geländer; das nahe Geländer ist darum
     durchbrochen gezeichnet (Handlauf, Pfosten, Sockel), damit man das grüne Wasser sieht. */
  const dn = FLUSS.nah, df = FLUSS.fern;
  let k = `<rect x="0" y="${r(yAt(TOR_D - 2))}" width="400" height="${r(yAt(df) - yAt(TOR_D - 2))}" fill="#cfc9bb"/>`;
  const luecken = (d) => { const out = []; let a = 0; for (const br of [...BR].sort((p, q) => p.s - q.s)) { out.push([a, brX(br, d) - brW(br, d)]); a = brX(br, d) + brW(br, d); } out.push([a, 400]); return out; };
  /* fernes Ufer: geschlossene Brüstung */
  for (const [a, b] of luecken(df)) {
    const yu = yAt(df), yo = yAt(df, 1.1), u = uAt(df);
    k += `<rect x="${r(a)}" y="${r(yo)}" width="${r(b - a)}" height="${r(yu - yo)}" fill="${MARMOR}"/><rect x="${r(a)}" y="${r(yo)}" width="${r(b - a)}" height=".4" fill="#fffdf6"/>`;
    for (let x = a + 0.9 * u; x < b - 0.3; x += 1.8 * u) k += `<rect x="${r(x - 0.3)}" y="${r(yo - 0.6)}" width=".6" height="${r(yu - yo + 0.6)}" fill="#e3e0d6"/><circle cx="${r(x)}" cy="${r(yo - 0.7)}" r=".38" fill="#f4f2ec"/>`;
  }
  /* Wasser: dunkelgrün, mit hellen Spiegelstreifen */
  const yW0 = yAt(df) - 0.5, yW1 = yAt(dn) - 0.6;
  k += `<rect x="0" y="${r(yW0)}" width="400" height="${r(yW1 - yW0)}" fill="${S.lg("goldwasser", [[0, "#1e3d33"], [1, "#2f5e4c"]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = rnd() * 392, yy = yW0 + 0.6 + rnd() * (yW1 - yW0 - 1); k += `<rect x="${r(x)}" y="${r(yy)}" width="${r(2 + rnd() * 5)}" height=".25" fill="#8fb8a4" opacity=".55"/>`; }
  /* nahes Ufer: Handlauf, Pfosten mit Knauf, Sockel — dazwischen sieht man das Wasser */
  for (const [a, b] of luecken(dn)) {
    const yu = yAt(dn), yo = yAt(dn, 1.1), u = uAt(dn);
    k += `<rect x="${r(a)}" y="${r(yu - 0.8)}" width="${r(b - a)}" height=".8" fill="#d9d5ca"/><rect x="${r(a)}" y="${r(yo)}" width="${r(b - a)}" height=".7" fill="${MARMOR}"/><rect x="${r(a)}" y="${r(yo)}" width="${r(b - a)}" height=".25" fill="#fffdf6"/>`;
    for (let x = a + 0.9 * u; x < b - 0.3; x += 1.8 * u) k += `<rect x="${r(x - 0.35)}" y="${r(yo - 0.6)}" width=".7" height="${r(yu - yo + 0.6)}" fill="#ebe8df"/><circle cx="${r(x)}" cy="${r(yo - 0.75)}" r=".45" fill="#f8f6f0"/>`;
  }
  S.teil({ anker: [52, r(yAt(df) + 1.2)], id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", x: 0, y: 0, kunst: k,
    tipp: "Vor dem Tor fließt der „Goldwasserfluss“. Er liegt tief zwischen Mauern aus Stein." });
}
{
  /* DIE BRÜCKE: fünf gewölbte Marmorbrücken. Aus 9 m Höhe sieht man die Fahrbahn bis zum Scheitel
     und die beiden Seitengeländer, die zum Scheitel hin ansteigen (Buckel). Die mittlere ist breiter und höher. */
  const dn = FLUSS.nah, df = FLUSS.fern, dm = 118;
  let k = "";
  for (const br of BR) {
    const hb = br.mitte ? 2.4 : 1.3;
    const xN = brX(br, dn), wn = brW(br, dn), xC = brX(br, dm), w = brW(br, dm), xF = brX(br, df), wf = brW(br, df);
    const yN = yAt(dn), yC = yAt(dm, hb), yF = yAt(df);
    /* Schatten des Bogens im Wasser, beidseits */
    for (const sd of [-1, 1]) k += `<path d="M${r(xN + sd * (wn + 1.4))} ${r(yN - 0.6)} L${r(xF + sd * (wf + 0.8))} ${r(yF - 0.4)} L${r(xF + sd * (wf - 1.2))} ${r(yF - 0.4)} L${r(xN + sd * (wn - 1.2))} ${r(yN - 0.6)} Z" fill="#0f2019" opacity=".55"/>`;
    /* hintere Hälfte der Seitengeländer (fällt zum fernen Ufer ab; die Fahrbahn verdeckt ihren Fuß) */
    for (const sd of [-1, 1]) {
      const a = [xC + sd * w, yAt(dm, hb + 1.1)], b = [xF + sd * wf, yAt(df, 1.1)], c = [xF + sd * wf, yF], e = [xC + sd * w, yC];
      k += `<path d="M${r(a[0])} ${r(a[1])} Q${r((a[0] + b[0]) / 2)} ${r(a[1] - 0.2)} ${r(b[0])} ${r(b[1])} L${r(c[0])} ${r(c[1])} L${r(e[0])} ${r(e[1])} Z" fill="#d8d3c6" stroke="#b9b3a4" stroke-width=".15"/>`;
      k += `<rect x="${r(b[0] - 0.3)}" y="${r(b[1] - 0.4)}" width=".6" height="${r(c[1] - b[1] + 0.4)}" fill="#ece9e1"/><circle cx="${r(b[0])}" cy="${r(b[1] - 0.5)}" r=".4" fill="#f4f2ec"/>`;
    }
    /* Fahrbahn bis zum Scheitel (die Mitte der Kaiserbrücke heller) */
    const fb = (t) => yN + (yC - yN) * (1 - (1 - t) * (1 - t));
    /* die Geländer laufen an den Enden nach außen aus (wie an den Goldwasserbrücken), so liest sich der Buckel auch frontal */
    const aus = br.mitte ? 5 : 2.4;
    const kante = (sd, t) => [xN + (xC - xN) * t + sd * (wn + aus * (1 - t) * (1 - t) + (w - wn) * t), fb(t)];
    const TS = [0, 0.25, 0.5, 0.75, 1];
    k += `<path d="M${TS.map((t) => kante(-1, t).map(r).join(" ")).join(" L")} L${[...TS].reverse().map((t) => kante(1, t).map(r).join(" ")).join(" L")} Z" fill="${S.lg("fahrbahn", [[0, "#c9c2b0"], [1, "#b3ab98"]])}"/>`;
    { const [x1, y1] = kante(-1, 0.86), [x2] = kante(1, 0.86); k += `<path d="M${r(x1)} ${r(y1 + 0.3)} Q${r((x1 + x2) / 2)} ${r(y1 - 0.9)} ${r(x2)} ${r(y1 + 0.3)}" stroke="#ece6d6" stroke-width=".7" fill="none"/>`; }
    if (br.mitte) k += `<path d="M${r(xN - wn * 0.22)} ${r(yN)} L${r(xC - w * 0.22)} ${r(yC)} L${r(xC + w * 0.22)} ${r(yC)} L${r(xN + wn * 0.22)} ${r(yN)} Z" fill="#ddd7c8"/>`;
    /* vordere Hälfte der Seitengeländer: steigt vom Ufer zum Scheitel, mit Pfosten und Knäufen */
    for (const sd of [-1, 1]) {
      const top = (t) => { const [x, y] = kante(sd, t); return [x, y - (yAt(dn) - yAt(dn, 1.1)) * (1 - t) - (yAt(dm, hb) - yAt(dm, hb + 1.1)) * t]; };
      const d = "M" + TS.map((t) => top(t).map(r).join(" ")).join(" L") + " L" + [...TS].reverse().map((t) => kante(sd, t).map(r).join(" ")).join(" L") + " Z";
      k += `<path d="${d}" fill="${sd < 0 ? "#f3f0e8" : "#e2ded3"}" stroke="#b9b3a4" stroke-width=".2"/>`;
      k += `<path d="M${TS.map((t) => top(t).map(r).join(" ")).join(" L")}" stroke="#fffdf6" stroke-width=".45" fill="none"/>`;
      for (const t of br.mitte ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.34, 0.67, 1]) { const [px, py] = top(t), [, qy] = kante(sd, t); k += `<rect x="${r(px - 0.35)}" y="${r(py - 0.5)}" width=".7" height="${r(qy - py + 0.5)}" fill="#f8f6f0" stroke="#c4bfb2" stroke-width=".12"/><circle cx="${r(px)}" cy="${r(py - 0.65)}" r=".5" fill="#fbfaf6" stroke="#c4bfb2" stroke-width=".12"/>`; }
    }
  }
  S.teil({ anker: [CX, r(yAt(118, 1.8) - 2)], id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Vor den fünf Torbögen führen fünf Brücken aus weißem Marmor über den Fluss. Die mittlere war für den Kaiser." });
}

/* =====================================================================
   8 — DIE STRASSE (mit Platz, Gehwegen und Verkehr), 9 — DER BUS
   ===================================================================== */
const D_STR = [28, 92];
const KANTE0 = (y) => 180 - 0.3125 * (y - HOR);
{ const yv = yAt(6, BODEN); S.def(`<clipPath id="${S.id("ohneterrasse")}"><path clip-rule="evenodd" d="M-10 -10 H410 V270 H-10 Z M${r(KANTE0(yv))} ${r(yv)} L400 ${r(yv)} L400 262 L${r(KANTE0(262))} 262 Z"/></clipPath>`); }
{
  let k = "";
  /* Platzfläche vor dem Fluss */
  k += `<rect x="0" y="${r(yAt(FLUSS.nah))}" width="400" height="${r(yAt(96) - yAt(FLUSS.nah))}" fill="${S.lg("platz", [[0, "#d4cdbf"], [1, "#c2bba9"]])}"/>`;
  for (let s = -60; s <= 60; s += 6) k += `<line ${linieK(xAt(s, FLUSS.nah), yAt(FLUSS.nah), xAt(s, 96), yAt(96))} stroke="#aaa392" stroke-width=".25"/>`;
  /* nördlicher Gehweg, Fahrbahn, Spuren */
  k += `<rect x="0" y="${r(yAt(96))}" width="400" height="${r(yAt(D_STR[1]) - yAt(96))}" fill="#bdb7ab"/>`;
  k += `<rect x="0" y="${r(yAt(D_STR[1]))}" width="400" height="${r(yAt(D_STR[0]) - yAt(D_STR[1]))}" fill="${S.lg("asphalt", [[0, "#8d8a86"], [1, "#5c5a57"]])}"/>`;
  for (const d of [86, 79, 72.5, 66, 49, 44, 39.5, 35.5]) { const y = yAt(d), u = uAt(d); for (let x = (d * 7) % 20 - 10; x < 400; x += 6 * u) { const x2 = Math.min(400, x + 2.6 * u); if (x2 > Math.max(0, x)) k += `<rect x="${r(Math.max(0, x))}" y="${r(y)}" width="${r(x2 - Math.max(0, x))}" height="${r(Math.max(0.25, 0.15 * u))}" fill="#f2f0ea" opacity=".85"/>`; } }
  for (const dd of [57.5, 56.8]) k += `<rect x="0" y="${r(yAt(dd))}" width="400" height=".5" fill="#e2b33a"/>`;
  /* Radweg auf unserer Seite, abgetrennt */
  k += `<rect x="0" y="${r(yAt(32))}" width="400" height="${r(yAt(28) - yAt(32))}" fill="#6a6660"/><rect x="0" y="${r(yAt(32))}" width="400" height=".7" fill="#f2f0ea"/>`;
  k += `<rect x="0" y="${r(yAt(D_STR[0]) - 0.4)}" width="400" height="1.6" fill="#d9d4c8"/>`;
  /* Autos (nicht antippbar: Kulisse auf der Straße) */
  const auto = (x, d, farbe, rechts) => {
    const u = uAt(d), y = yAt(d), l = 4.5 * u, h = 1.45 * u, sd = rechts ? 1 : -1;
    let g = `<ellipse cx="${r(x)}" cy="${r(y + 0.2)}" rx="${r(l * 0.55)}" ry="${r(0.4 * u)}" fill="#000" opacity=".25"/>`;
    g += `<path d="M${r(x - l / 2)} ${r(y - 0.25 * u)} L${r(x - l / 2)} ${r(y - 0.75 * u)} Q${r(x - l * 0.45)} ${r(y - 0.85 * u)} ${r(x - l * 0.3 * sd)} ${r(y - 0.85 * u)} L${r(x - l * 0.18 * sd)} ${r(y - h)} L${r(x + l * 0.22 * sd)} ${r(y - h)} L${r(x + l * 0.36 * sd)} ${r(y - 0.85 * u)} Q${r(x + l * 0.5)} ${r(y - 0.8 * u)} ${r(x + l / 2)} ${r(y - 0.5 * u)} L${r(x + l / 2)} ${r(y - 0.25 * u)} Z" fill="${farbe}"/>`;
    g += `<path d="M${r(x - l * 0.16 * sd)} ${r(y - h + 0.15 * u)} L${r(x + l * 0.2 * sd)} ${r(y - h + 0.15 * u)} L${r(x + l * 0.31 * sd)} ${r(y - 0.88 * u)} L${r(x - l * 0.27 * sd)} ${r(y - 0.88 * u)} Z" fill="#2a3440"/>`;
    for (const t of [-0.3, 0.3]) g += `<circle cx="${r(x + t * l)}" cy="${r(y - 0.3 * u)}" r="${r(0.33 * u)}" fill="#1a1a1a"/><circle cx="${r(x + t * l)}" cy="${r(y - 0.3 * u)}" r="${r(0.15 * u)}" fill="#9aa3aa"/>`;
    return g + `<path d="M${r(x - l / 2)} ${r(y - 0.6 * u)} H${r(x + l / 2)}" stroke="#fff" stroke-width="${r(0.06 * u)}" opacity=".35"/>`;
  };
  k += auto(18, 79, "#2a2c30", false) + auto(118, 72.5, "#c9ccd0", false) + auto(255, 66, "#7a1e1e", false) + auto(14, 44, "#e8e6e0", true) + auto(124, 49, "#f2c21a", true);
  S.teil({ anker: [36, 166], id: "strasse", de: "die Straße", syl: "STRA-ße", it: "la strada", itSyl: "STRA-da", en: "street", x: 0, y: 0, kunst: `<g clip-path="url(#${S.id("ohneterrasse")})">${k}</g>`,
    tipp: "Die Chang'an-Straße heißt „Straße des ewigen Friedens“. Sie hat zehn Spuren." });
}
{
  /* der Bus: rot-weißer Pekinger Stadtbus auf der hinteren Fahrbahn, fährt also nach Westen (links); man sieht seine linke Seite ohne Türen */
  const d = 57, u = uAt(d), x = 62, y = yAt(d), l = 12 * u, h = 3.1 * u;
  let k = `<ellipse cx="0" cy=".3" rx="${r(l * 0.52)}" ry="${r(0.5 * u)}" fill="#000" opacity=".25"/>`;
  k += `<path d="M${r(-l / 2)} ${r(-0.35 * u)} L${r(-l / 2)} ${r(-h + 0.3 * u)} Q${r(-l / 2)} ${r(-h)} ${r(-l / 2 + 0.4 * u)} ${r(-h)} L${r(l / 2 - 0.6 * u)} ${r(-h)} Q${r(l / 2)} ${r(-h)} ${r(l / 2)} ${r(-h + 0.6 * u)} L${r(l / 2)} ${r(-0.35 * u)} Z" fill="${S.lg("bus", [[0, "#f4f2ee"], [0.45, "#e9e6e0"], [0.46, "#c8281e"], [1, "#9a1a12"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${r(-l / 2 + 0.6 * u + i * 1.6 * u)}" y="${r(-h + 0.45 * u)}" width="${r(1.35 * u)}" height="${r(0.95 * u)}" rx=".3" fill="#2f3c48"/>`;
  k += `<rect x="${r(l / 2 - 0.45 * u)}" y="${r(-h + 0.4 * u)}" width="${r(0.4 * u)}" height="${r(1.6 * u)}" fill="#2f3c48"/>`;
  k = `<g transform="scale(-1 1)">${k}</g>` + `<text x="${r(-l / 2 + 1.2 * u)}" y="${r(-h + 0.35 * u)}" font-size="${r(0.5 * u)}" fill="#f2c21a" font-family="Arial">1</text>`;
  for (const t of [-0.32, 0.3]) k += `<circle cx="${r(t * l)}" cy="${r(-0.38 * u)}" r="${r(0.5 * u)}" fill="#1a1a1a"/><circle cx="${r(t * l)}" cy="${r(-0.38 * u)}" r="${r(0.22 * u)}" fill="#9aa3aa"/>`;
  S.teil({ id: "bus", de: "der Bus", syl: "BUS", it: "l'autobus", itSyl: "AU-to-bus", en: "bus", x, y, steht: true, kunst: k,
    tipp: "Die Buslinie 1 fährt die Chang'an-Straße entlang, direkt am Tor vorbei. Hier fährt sie nach Westen." });
}

/* =====================================================================
   10 — DIE MARMORSÄULE (Huabiao), 11 — DER LÖWE, Besucher auf dem Platz
   ===================================================================== */
{
  const d = 104;
  let k = "";
  for (const s of [-17, 17]) {
    const x = xAt(s, d), y0 = yAt(d), h = (m) => yAt(d, m);
    k += `<ellipse cx="${r(x + 3)}" cy="${r(y0 - 0.4)}" rx="6" ry="1" fill="#1b120a" opacity=".22" filter="url(#bw_weich)"/>`;
    k += `<rect x="${r(x - 3.6)}" y="${r(h(1.2))}" width="7.2" height="${r(y0 - h(1.2))}" fill="${MARMOR}"/><rect x="${r(x - 3.6)}" y="${r(h(1.2))}" width="7.2" height=".5" fill="#fffdf6"/>`;
    for (let i = 0; i < 6; i++) k += `<rect x="${r(x - 3.4 + i * 1.36)}" y="${r(h(1.2) - 1.1)}" width=".35" height="1.2" fill="#e9e6dd"/>`;
    k += `<rect x="${r(x - 3.6)}" y="${r(h(1.2) - 1.3)}" width="7.2" height=".35" fill="#e9e6dd"/>`;
    k += `<path d="M${r(x - 2.2)} ${r(h(1.2))} L${r(x - 1.8)} ${r(h(2.2))} L${r(x + 1.8)} ${r(h(2.2))} L${r(x + 2.2)} ${r(h(1.2))} Z" fill="#dcd8cc"/>`;
    k += `<rect x="${r(x - 1.25)}" y="${r(h(8.2))}" width="2.5" height="${r(h(2.2) - h(8.2))}" fill="${MARMOR_V}"/>`;
    /* der Drache windet sich um den Schaft: Schuppenband, Krallen, Kopf oben */
    for (let i = 0; i < 6; i++) { const yy = h(2.6 + i * 0.9); k += `<path d="M${r(x - 1.25)} ${r(yy + 0.9)} Q${r(x)} ${r(yy - 0.2)} ${r(x + 1.25)} ${r(yy - 0.5)}" stroke="#b9b4a6" stroke-width=".55" fill="none"/><path d="M${r(x - 1)} ${r(yy + 0.6)} Q${r(x)} ${r(yy - 0.4)} ${r(x + 1)} ${r(yy - 0.7)}" stroke="#f4f2ec" stroke-width=".25" fill="none"/>`; }
    k += `<path d="M${r(x - 0.9)} ${r(h(7.6))} q.9 -.9 1.8 -.2 l-.3 .6 Z" fill="#c9c4b6"/>`;
    /* Wolkenbrett symmetrisch quer durch die Säule */
    const yw = h(7.3);
    k += `<path d="M${r(x - 4.6)} ${r(yw)} Q${r(x - 4.2)} ${r(yw - 1.2)} ${r(x - 2.8)} ${r(yw - 0.8)} Q${r(x - 1.6)} ${r(yw - 1.6)} ${r(x)} ${r(yw - 0.9)} Q${r(x + 1.6)} ${r(yw - 1.6)} ${r(x + 2.8)} ${r(yw - 0.8)} Q${r(x + 4.2)} ${r(yw - 1.2)} ${r(x + 4.6)} ${r(yw)} Q${r(x + 3.4)} ${r(yw + 0.5)} ${r(x)} ${r(yw + 0.2)} Q${r(x - 3.4)} ${r(yw + 0.5)} ${r(x - 4.6)} ${r(yw)} Z" fill="#f2efe8" stroke="#bdb8aa" stroke-width=".22"/>`;
    /* runder Tauteller mit dem sitzenden Hou */
    k += `<rect x="${r(x - 1.4)}" y="${r(h(8.7))}" width="2.8" height="${r(h(8.2) - h(8.7))}" fill="#d7d3c8"/><ellipse cx="${r(x)}" cy="${r(h(8.75))}" rx="2.3" ry=".55" fill="#ece9e1" stroke="#bdb8aa" stroke-width=".15"/>`;
    k += `<path d="M${r(x - 1.1)} ${r(h(8.8))} L${r(x - 1.1)} ${r(h(9.3))} Q${r(x - 1.2)} ${r(h(9.9))} ${r(x - 0.3)} ${r(h(10))} Q${r(x + 0.5)} ${r(h(10.2))} ${r(x + 0.8)} ${r(h(9.7))} L${r(x + 1.1)} ${r(h(9.5))} L${r(x + 0.7)} ${r(h(9.3))} L${r(x + 1)} ${r(h(8.8))} Z" fill="#efece4" stroke="#bdb8aa" stroke-width=".15"/>`;
    k += `<rect x="${r(x - 1.25)}" y="${r(h(8.2))}" width=".45" height="${r(h(2.2) - h(8.2))}" fill="#fff" opacity=".45"/>`;
  }
  S.teil({ anker: [xAt(-17, d), yAt(d, 2.2)], id: "marmorsaeule", de: "die Marmorsäule", syl: "MAR-mor-säu-le", it: "la colonna di marmo", itSyl: "co-LON-na di MAR-mo", en: "marble column", x: 0, y: 0, kunst: k,
    tipp: "Diese Säulen heißen Huabiao. Um jede windet sich ein Drache aus Marmor, oben sitzt ein Fabeltier." });
}
{
  /* Steinlöwen (Shishi) auf Xumizuo-Sockeln: links (Westen) die Löwin mit dem Jungen, rechts (Osten) der Löwe mit dem Ball.
     Etwas größer als gemessen, damit Ball und Junges erkennbar sind (didaktisch). */
  const d = 107;
  let k = "";
  const STEIN = S.lg("loewe", [[0, "#d2ccbc"], [1, "#a39d8c"]], 0, 0, 1, 0);
  for (const [s, sp] of [[-10.5, 1], [10.5, -1]]) {
    const x = xAt(s, d), y0 = yAt(d), U = uAt(d) * 1.3;
    const P = (dx, dy) => `${r(x + dx * sp * U)} ${r(y0 - dy * U)}`;
    k += `<path d="M${P(-1.1, 0)} L${P(1.3, 0.05)} L${P(3.2, 0.6)} L${P(0.6, 0.4)} Z" fill="#1b120a" opacity=".22"/>`;
    /* Sockel: Fußplatte, eingezogene Taille, Deckplatte; Ostseite im Schatten */
    k += `<path d="M${P(-1.25, 0)} L${P(-1.25, 0.28)} L${P(-1.0, 0.36)} L${P(-1.0, 1.0)} L${P(-1.25, 1.08)} L${P(-1.25, 1.4)} L${P(1.25, 1.4)} L${P(1.25, 1.08)} L${P(1.0, 1.0)} L${P(1.0, 0.36)} L${P(1.25, 0.28)} L${P(1.25, 0)} Z" fill="${MARMOR}" stroke="#a9a497" stroke-width=".15"/>`;
    k += `<path d="M${P(-1.0, 0.36)} L${P(1.0, 0.36)} M${P(-1.0, 1.0)} L${P(1.0, 1.0)}" stroke="#a9a497" stroke-width=".3"/><path d="M${P(-0.75, 0.5)} L${P(0.75, 0.5)} L${P(0.75, 0.86)} L${P(-0.75, 0.86)} Z" fill="#e2ded3"/>`;
    /* Körper sitzend: Hinterteil, Brust nach vorn, Vorderbeine */
    k += `<path d="M${P(-0.95, 1.4)} Q${P(-1.05, 2.4)} ${P(-0.55, 2.75)} Q${P(-0.2, 3.0)} ${P(0.35, 2.85)} Q${P(0.85, 2.5)} ${P(0.8, 1.9)} L${P(0.75, 1.4)} Z" fill="${STEIN}" stroke="#7e786a" stroke-width=".15"/>`;
    k += `<path d="M${P(-0.1, 1.4)} L${P(-0.12, 2.3)} Q${P(0.1, 2.5)} ${P(0.3, 2.3)} L${P(0.28, 1.4)} Z M${P(0.38, 1.4)} L${P(0.38, 2.2)} Q${P(0.58, 2.4)} ${P(0.74, 2.15)} L${P(0.74, 1.4)} Z" fill="#c4bead" stroke="#7e786a" stroke-width=".15"/>`;
    k += `<path d="M${P(-0.16, 1.4)} Q${P(0.1, 1.55)} ${P(0.34, 1.4)} M${P(0.34, 1.4)} Q${P(0.58, 1.55)} ${P(0.8, 1.4)}" stroke="#7e786a" stroke-width=".25" fill="#bdb7a6"/>`;
    /* Kopf mit Lockenmähne, offenem Maul und Brauen, leicht zur Mitte gedreht */
    const kx = 0.2, ky = 3.35;
    for (let i = 0; i < 13; i++) { const a = -Math.PI * 0.05 + i * Math.PI * 1.1 / 12, rx = kx + Math.cos(a) * 0.62, ry = ky + Math.sin(a) * 0.55 - 0.05; k += `<circle cx="${r(x + rx * sp * U)}" cy="${r(y0 - ry * U)}" r="${r(0.17 * U)}" fill="#b3ad9c" stroke="#7e786a" stroke-width=".15"/>`; }
    for (let i = 0; i < 4; i++) k += `<circle cx="${r(x + (-0.45 + i * 0.13) * sp * U)}" cy="${r(y0 - (2.75 - i * 0.1) * U)}" r="${r(0.13 * U)}" fill="#aaa493" stroke="#7e786a" stroke-width=".12"/>`;
    k += `<ellipse cx="${r(x + kx * sp * U)}" cy="${r(y0 - (ky - 0.12) * U)}" rx="${r(0.48 * U)}" ry="${r(0.46 * U)}" fill="#cbc5b4" stroke="#7e786a" stroke-width=".15"/>`;
    k += `<path d="M${P(kx - 0.3, ky + 0.05)} Q${P(kx - 0.15, ky + 0.2)} ${P(kx - 0.03, ky + 0.05)} M${P(kx + 0.08, ky + 0.05)} Q${P(kx + 0.2, ky + 0.2)} ${P(kx + 0.34, ky + 0.05)}" stroke="#5e594c" stroke-width=".35" fill="none"/>`;
    k += `<circle cx="${r(x + (kx - 0.15) * sp * U)}" cy="${r(y0 - (ky - 0.04) * U)}" r=".38" fill="#4a463c"/><circle cx="${r(x + (kx + 0.2) * sp * U)}" cy="${r(y0 - (ky - 0.04) * U)}" r=".38" fill="#4a463c"/>`;
    k += `<ellipse cx="${r(x + (kx + 0.02) * sp * U)}" cy="${r(y0 - (ky - 0.22) * U)}" rx="${r(0.16 * U)}" ry="${r(0.1 * U)}" fill="#8e8878"/>`;
    k += `<path d="M${P(kx - 0.24, ky - 0.36)} Q${P(kx + 0.02, ky - 0.62)} ${P(kx + 0.28, ky - 0.36)} Q${P(kx + 0.02, ky - 0.44)} ${P(kx - 0.24, ky - 0.36)} Z" fill="#3a3328"/><path d="M${P(kx - 0.16, ky - 0.4)} L${P(kx + 0.2, ky - 0.4)}" stroke="#f2efe6" stroke-width=".25" stroke-dasharray=".25 .2"/>`;
    if (sp < 0) {
      /* Osten: der Löwe, rechte Pfote auf dem Ball mit Netzmuster */
      const bx = 0.95, by = 1.72, br = 0.34;
      k += `<circle cx="${r(x + bx * sp * U)}" cy="${r(y0 - by * U)}" r="${r(br * U)}" fill="#c9c3b2" stroke="#6e6a5e" stroke-width=".2"/>`;
      k += `<path d="M${P(bx - br, by)} Q${P(bx, by + 0.25)} ${P(bx + br, by)} M${P(bx - br * 0.8, by - 0.18)} Q${P(bx, by + 0.05)} ${P(bx + br * 0.8, by - 0.18)} M${P(bx, by + br)} Q${P(bx - 0.18, by)} ${P(bx, by - br)} M${P(bx, by + br)} Q${P(bx + 0.18, by)} ${P(bx, by - br)}" stroke="#6e6a5e" stroke-width=".18" fill="none"/>`;
      k += `<path d="M${P(0.5, 2.2)} Q${P(0.95, 2.3)} ${P(1.12, 2.0)} L${P(1.05, 1.88)} Q${P(0.8, 2.0)} ${P(0.55, 1.95)} Z" fill="#c4bead" stroke="#7e786a" stroke-width=".15"/>`;
    } else {
      /* Westen: die Löwin, linke Pfote auf dem Jungen, das auf dem Rücken liegt */
      k += `<path d="M${P(0.55, 1.4)} Q${P(0.6, 1.72)} ${P(0.95, 1.75)} Q${P(1.2, 1.7)} ${P(1.22, 1.4)} Z" fill="#c4bead" stroke="#7e786a" stroke-width=".15"/>`;
      k += `<circle cx="${r(x + 1.08 * sp * U)}" cy="${r(y0 - 1.86 * U)}" r="${r(0.2 * U)}" fill="#c9c3b2" stroke="#7e786a" stroke-width=".15"/><circle cx="${r(x + 1.03 * sp * U)}" cy="${r(y0 - 1.88 * U)}" r=".25" fill="#4a463c"/><circle cx="${r(x + 1.15 * sp * U)}" cy="${r(y0 - 1.88 * U)}" r=".25" fill="#4a463c"/>`;
      k += `<path d="M${P(0.66, 1.62)} l${r(-0.05 * sp * U)} ${r(-0.22 * U)} M${P(0.86, 1.68)} l0 ${r(-0.24 * U)}" stroke="#7e786a" stroke-width=".35" stroke-linecap="round"/>`;
      k += `<path d="M${P(0.42, 2.2)} Q${P(0.82, 2.24)} ${P(0.98, 2.04)} L${P(0.94, 1.94)} Q${P(0.7, 2.0)} ${P(0.46, 1.96)} Z" fill="#c4bead" stroke="#7e786a" stroke-width=".15"/>`;
    }
    /* Lichtkante links (Sonne von Südwesten) */
    k += `<path d="M${P(-0.92, 1.5)} Q${P(-1.0, 2.4)} ${P(-0.55, 2.7)}" stroke="#f2efe6" stroke-width=".4" fill="none" opacity=".8"/>`;
  }
  S.teil({ anker: [xAt(10.5, d), r(yAt(d) - 3.6 * uAt(d) * 1.3)], id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: 0, y: 0, kunst: k,
    tipp: "Steinlöwen bewachen das Tor: links die Löwin mit ihrem Jungen, rechts der Löwe mit dem Ball unter der Pfote." });
}
{
  /* Besucher auf dem Platz: eine Reisegruppe mit roten Kappen und Fähnchen (Kulisse) */
  const d = 100, u = uAt(d);
  let g = "";
  const HW = 1.62 * u, HM = 1.72 * u;
  const fw = winzigDef("tourw", { id: "pek_tw", geschlecht: "w", pose: "stehen", blick: 175, frisur: "zopf", haarfarbe: "schwarz", haut: "hell", kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "jeans" } } }, HW);
  const fm = winzigDef("tourm", { id: "pek_tm", geschlecht: "m", pose: "stehen", blick: 195, frisur: "kurz", haarfarbe: "schwarz", haut: "hell", kleidung: { oberteil: { stueck: "tshirt", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "schwarz" } } }, HM);
  const fh = winzigDef("tourh", { id: "pek_th", geschlecht: "w", pose: "stehen", blick: 160, frisur: "zopf", haarfarbe: "schwarz", haut: "hell", kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "rock", farbe: "blau" } } }, HW);
  /* Kopfbedeckung je Figur: Kappe in einer Farbe, Sonnenhut, Sonnenschirm oder ein Kind auf den Schultern */
  const oben = (x, y, q, H, art) => {
    const P2 = (a, b) => `${r(x + a * H * q)} ${r(y + b * H * q)}`;
    if (art === "hut") return `<path d="M${P2(-0.14, -0.93)} Q${P2(0, -0.98)} ${P2(0.14, -0.93)} Q${P2(0, -0.9)} ${P2(-0.14, -0.93)} Z M${P2(-0.06, -0.93)} Q${P2(0, -1.04)} ${P2(0.06, -0.93)} Z" fill="#e8d6a0"/>`;
    if (art === "schirm") return `<path d="M${P2(0.05, -0.6)} L${P2(0.05, -1.12)}" stroke="#333" stroke-width=".15"/><path d="M${P2(-0.25, -1.08)} Q${P2(0.05, -1.32)} ${P2(0.35, -1.08)} Z" fill="#e85a8a"/>`;
    if (art === "kind") return `<use href="#${fh}" transform="translate(${r(x)} ${r(y - 0.78 * H * q)}) scale(${r(q * 0.48 * 100) / 100})"/>`;
    return `<path d="M${P2(-0.075, -0.925)} Q${P2(0, -1.02)} ${P2(0.075, -0.925)} Z" fill="${art}"/>`;
  };
  const figur = (s, dd, id, sp, art) => { const q = uAt(dd) / u, x = xAt(s, dd), y = yAt(dd), H = id === fm ? HM : HW; return `<use href="#${id}" transform="translate(${r(x)} ${r(y)}) scale(${r(sp * q * 100) / 100} ${r(q * 100) / 100})"/>` + (art ? oben(x, y, q, H, art) : ""); };
  /* die Reisegruppe am Anker: alle mit roter Kappe */
  for (const [s, id, sp] of [[-27.6, fw, 1], [-26.2, fm, 1], [-24.8, fw, -1], [-23.4, fm, -1], [-22.2, fw, 1]]) g += figur(s, d, id, sp, "#d62a1e");
  /* andere Besucher in der Goldenen Woche: vorn ohne Trefferwirkung, verschieden gekleidet, mit Handy zum Foto */
  let leute = "";
  for (const [s, dd, id, sp, art] of [[-38, 101, fh, 1, "hut"], [-36.6, 100.4, fm, -1, "#f2c21a"], [-6.5, 101.5, fw, 1, "schirm"], [-5.2, 101, fm, 1, "kind"], [5.6, 101.2, fh, -1, "hut"], [6.9, 100.6, fm, -1, "#2a6ad0"], [25.2, 100.8, fm, 1, "#2a6ad0"], [26.6, 101.4, fw, -1, "#2a6ad0"], [27.9, 100.5, fh, 1, ""], [46.5, 101, fm, -1, ""], [47.8, 100.4, fh, 1, "schirm"], [58, 101.2, fw, -1, "#f2c21a"]]) {
    if (xAt(s, dd) < 8 || xAt(s, dd) > 392) continue;
    leute += figur(s, dd, id, sp, art);
  }
  for (const [s, dd] of [[-36.6, 100.4], [6.9, 100.6], [26.6, 101.4]]) leute += `<rect x="${r(xAt(s, dd) + 0.5)}" y="${r(yAt(dd, 1.95))}" width=".5" height=".75" fill="#20242a"/>`;
  leute += `<line x1="${r(xAt(25.9, 100.6))}" y1="${r(yAt(100.6, 0.85))}" x2="${r(xAt(25.9, 100.6))}" y2="${r(yAt(100.6, 2.6))}" stroke="#555" stroke-width=".2"/><path d="M${r(xAt(25.9, 100.6))} ${r(yAt(100.6, 2.6))} l1.8 .4 l-1.8 .4 Z" fill="#2a7ad0"/>`;
  S.davor(`<g pointer-events="none">${leute}</g>`);
  g += `<line x1="${r((xAt(-27.6, d) - 0.9))}" y1="${r(yAt(d, 0.85))}" x2="${r((xAt(-27.6, d) - 0.9))}" y2="${r(yAt(d, 2.6))}" stroke="#555" stroke-width=".2"/><path d="M${r((xAt(-27.6, d) - 0.9))} ${r(yAt(d, 2.6))} l2 .4 l-2 .4 Z" fill="#e8b81a"/>`;
  g += flaeche(xAt(-29.6, d), yAt(d, 2.6) - 0.6, 15, 8.4);
  S.teil({ anker: [xAt(-25.3, 100), yAt(100, 2.4)], id: "reisegruppe", de: "die Reisegruppe", syl: "REI-se-grup-pe", it: "il gruppo turistico", itSyl: "GRUP-po tu-RI-sti-co", en: "tour group", x: 0, y: 0, kunst: g,
    tipp: "Die Reisegruppe trägt rote Kappen. So verliert die Reiseleiterin mit dem Fähnchen niemanden." });
}

/* =====================================================================
   12 — DIE STRASSENLATERNE (Huadeng) und 13 — DIE FAHNE an der Platzkante
   ===================================================================== */
{
  const d = 97;
  let k = "";
  for (const s of [-30, 30, -52, 52]) {
    const u = uAt(d), x = xAt(s, d), y = yAt(d), h = (m) => yAt(d, m);
    if (x < 6 || x > 394) continue;
    k += `<ellipse cx="${r(x + 2.4)}" cy="${r(y - 0.2)}" rx="3" ry=".5" fill="#000" opacity=".2"/>`;
    k += `<path d="M${r(x - 1.3)} ${r(y)} L${r(x - 0.9)} ${r(h(0.9))} L${r(x - 0.35)} ${r(h(1.6))} L${r(x - 0.3)} ${r(h(6.6))} L${r(x + 0.3)} ${r(h(6.6))} L${r(x + 0.35)} ${r(h(1.6))} L${r(x + 0.9)} ${r(h(0.9))} L${r(x + 1.3)} ${r(y)} Z" fill="${S.lg("lampenmast", [[0, "#c9c4b8"], [0.4, "#f6f3ec"], [1, "#a9a497"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${r(x - 0.5)}" y="${r(h(4))}" width="1" height=".6" fill="#c9a24a"/>`;
    /* Magnolienkrone: Arme mit Glaskugeln, eine Kugel oben */
    const yk = h(7.2);
    for (const [dx, dy] of [[-1.6, 0.3], [1.6, 0.3], [-0.9, -0.5], [0.9, -0.5], [-2.2, 1.2], [2.2, 1.2]]) {
      k += `<path d="M${r(x)} ${r(h(6.6))} Q${r(x + dx * 0.5 * u)} ${r(h(6.9))} ${r(x + dx * 0.55 * u)} ${r(yk + dy * u * 0.4)}" stroke="#c9a24a" stroke-width=".25" fill="none"/>`;
      k += `<circle cx="${r(x + dx * 0.55 * u)}" cy="${r(yk + dy * u * 0.4 - 0.9)}" r="1" fill="${S.rg("kugel", [[0, "#ffffff"], [0.7, "#f2f0e6"], [1, "#cfcbbf"]], 0.4, 0.35, 0.6)}"/>`;
    }
    k += `<circle cx="${r(x)}" cy="${r(h(8.6))}" r="1.2" fill="${S.rg("kugel", [])}"/><path d="M${r(x)} ${r(h(8.6) - 1.2)} v-1" stroke="#c9a24a" stroke-width=".3"/>`;
  }
  S.teil({ anker: [xAt(30, d), yAt(d, 4)], id: "strassenlaterne", de: "die Straßenlaterne", syl: "STRA-ßen-la-ter-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 0, y: 0, kunst: k,
    tipp: "Die weißen Laternen an der Chang'an-Straße heißen „Huadeng“. Sie sehen aus wie Magnolienblüten." });
}
{
  const d = 99;
  let k = "";
  for (const s of [-44, 44, -14, 14]) {
    const x = xAt(s, d), y = yAt(d), h = (m) => yAt(d, m), u = uAt(d);
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(h(7))}" stroke="#d9d6cf" stroke-width=".5"/><circle cx="${r(x)}" cy="${r(h(7.05))}" r=".4" fill="${GOLD}"/>`;
    const w = 1.9 * u, hf = 1.27 * u, fx = x + 0.2, fy = h(6.9);
    k += `<path d="M${r(fx)} ${r(fy)} Q${r(fx + w * 0.5)} ${r(fy + 0.6)} ${r(fx + w)} ${r(fy + 0.2)} L${r(fx + w)} ${r(fy + hf + 0.2)} Q${r(fx + w * 0.5)} ${r(fy + hf + 0.6)} ${r(fx)} ${r(fy + hf)} Z" fill="#de2910"/>`;
    k += `<path d="M${r(fx + w * 0.17)} ${r(fy + hf * 0.18)} l.42 1.2 l-1.1 -.75 h1.35 l-1.1 .75 Z" fill="#ffde00"/>`;
    for (const [dx, dy] of [[0.33, 0.1], [0.4, 0.2], [0.4, 0.33], [0.33, 0.43]]) k += `<circle cx="${r(fx + w * dx)}" cy="${r(fy + hf * dy + 0.2)}" r=".2" fill="#ffde00"/>`;
  }
  S.teil({ anker: [xAt(-44, d) + 3, yAt(d, 6.4)], id: "fahne", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 0, y: 0, kunst: k,
    tipp: "Die chinesische Fahne ist rot mit fünf gelben Sternen. Zum Nationalfeiertag am 1. Oktober hängen überall Fahnen." });
}

/* =====================================================================
   14 — DER GEHWEG unten, 15 — DIE CHRYSANTHEME, 16 — DIE RIKSCHA, 17 — DER FAHRER
   ===================================================================== */
const KANTE = (y) => 180 - 0.3125 * (y - HOR);     /* Terrassenkante (s = −0,5 m) auf Bodenhöhe */
{
  const y1 = yAt(D_STR[0]) + 1.2;
  let f = `<path d="M0 ${r(y1)} L${r(KANTE(y1))} ${r(y1)} L${r(KANTE(260))} 260 L0 260 Z" fill="${S.lg("gehweg", [[0, "#c4beb2"], [1, "#aaa498"]])}"/>`;
  for (const d of [26, 24, 22.3, 20.8]) { const y = yAt(d); f += `<line x1="0" y1="${r(y)}" x2="${r(KANTE(y) + 1)}" y2="${r(y)}" stroke="#8f897d" stroke-width="${r(0.25 + 4 / d)}" opacity=".55"/>`; }
  for (let s = -26; s <= 0; s += 1.2) f += `<line ${linieK(xAt(s, D_STR[0]), y1, xAt(s, 19), 260)} stroke="#8f897d" stroke-width=".3" opacity=".45"/>`;
  S.hinten(f);
}
{
  const d = 21, u = uAt(d), Y = yAt(d);
  const W = 1.1 * u, Hh = 0.5 * u;
  let k = `<ellipse cx="${r(W * 0.25)}" cy="-.6" rx="${r(W / 2 + 3)}" ry="1.6" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
  k += `<path d="M${r(-W / 2)} 0 L${r(-W / 2 - 1)} ${r(-Hh)} L${r(W / 2 + 1)} ${r(-Hh)} L${r(W / 2)} 0 Z" fill="${S.lg("kuebel", [[0, "#e3ded2"], [0.5, "#c4beb0"], [1, "#9c968a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-W / 2 - 1.6)}" y="${r(-Hh - 1.8)}" width="${r(W + 3.2)}" height="2.2" rx=".6" fill="#e3ded2"/>`;
  for (const [n, a, b] of [["chg", "#f6c21e", "#d99a0c"], ["chr", "#d8302a", "#a01a14"]]) {
    let bl = `<circle r="1.7" fill="${b}"/>`;
    for (let i = 0; i < 12; i++) { const w = i * Math.PI / 6; bl += `<ellipse cx="${r(Math.cos(w) * 1.05)}" cy="${r(Math.sin(w) * 1.05)}" rx=".75" ry=".32" fill="${a}" transform="rotate(${Math.round(w * 180 / Math.PI)} ${r(Math.cos(w) * 1.05)} ${r(Math.sin(w) * 1.05)})"/>`; }
    S.def(`<g id="${S.id(n)}">${bl}<circle r=".55" fill="${b}"/><circle r=".28" fill="#7a4a08"/></g>`);
  }
  k += `<path d="M${r(-W / 2 - 0.8)} ${r(-Hh - 1.4)} Q${r(-W / 2)} ${r(-Hh - 10)} 0 ${r(-Hh - 12)} Q${r(W / 2)} ${r(-Hh - 10)} ${r(W / 2 + 0.8)} ${r(-Hh - 1.4)} Z" fill="#3f6a32"/>`;
  for (let i = 0; i < 70; i++) {
    const t = rnd() * 2 - 1, x = t * (W / 2 - 1), y = -Hh - 2 - Math.sqrt(rnd()) * (9.6 * (1 - t * t) + 0.4), sc = 0.7 + rnd() * 0.3;
    k += `<use href="#${S.id(rnd() < 0.62 ? "chg" : "chr")}" transform="translate(${r(x)} ${r(y)}) scale(${r(sc * 100) / 100} ${r(sc * 88) / 100})"/>`;
  }
  S.teil({ id: "chrysantheme", de: "die Chrysantheme", syl: "chry-san-THE-me", it: "il crisantemo", itSyl: "cri-SAN-te-mo", en: "chrysanthemum", x: 14, y: Y, steht: true, kunst: k,
    tipp: "Zum Nationalfeiertag am 1. Oktober stehen in ganz Peking Chrysanthemen. In China sind sie die Blumen des Herbstes." });
}
const RI = { d: 30, x: 84 };            /* auf dem abgetrennten Radweg */
{
  const u = uAt(RI.d), Y = yAt(RI.d);
  const m = (v) => r(v * u);
  let k = `<ellipse cx="${m(0.4)}" cy="${m(0.05)}" rx="${m(1.7)}" ry="${m(0.16)}" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
  const rad = (cx, cy, rr) => {
    let g = `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#1d1d1d" stroke-width="${r(0.05 * u)}"/><circle cx="${cx}" cy="${cy}" r="${r(rr - 0.04 * u)}" fill="none" stroke="#9aa3aa" stroke-width=".2"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<line x1="${cx}" y1="${cy}" x2="${r(cx + Math.cos(a) * (rr - 0.04 * u))}" y2="${r(cy + Math.sin(a) * (rr - 0.04 * u))}" stroke="#c9cfd4" stroke-width=".12"/>`; }
    return g + `<circle cx="${cx}" cy="${cy}" r="${r(0.03 * u)}" fill="#6b7178"/>`;
  };
  const RR = m(0.33);
  /* Fahrer (eigenes Teil) bestimmt Sattel, Lenker und Pedale */
  const pose = { kipp: 16, lende: -4, brust: 4, nacken: -6, kopf: -12, schulterL: { vor: 52, seit: 10 }, ellbogenL: 26, unterarmL: 20, handL: 8, fingerL: 0.75, schulterR: { vor: 50, seit: 12 }, ellbogenR: 28, unterarmR: 20, handR: 8, fingerR: 0.75,
    huefteL: { vor: 96, seit: 4, dreh: -4 }, knieL: 104, fussL: 10, huefteR: { vor: 50, seit: 6, dreh: -4 }, knieR: 38, fussR: -8 };
  const f = B.mensch({ id: "pek_fahrer", geschlecht: "m", pose, blick: -90, frisur: "kurz", haarfarbe: "schwarz", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, jacke: { stueck: "weste", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.72 * u);
  const SA = [-0.5 * u, -0.95 * u];                                   /* Sattel (Sitzpunkt) */
  const ox = SA[0] - f.z.sitz.x * f.k, oy = SA[1] - f.z.sitz.y * f.k;  /* Versatz der Figur */
  const hand = [ox + (f.z.handL.x + f.z.handR.x) / 2 * f.k, oy + (f.z.handL.y + f.z.handR.y) / 2 * f.k];
  const fussO = [ox + f.z.punkte.fussL[0] * f.k, oy + f.z.punkte.fussL[1] * f.k], fussU = [ox + f.z.punkte.fussR[0] * f.k, oy + f.z.punkte.fussR[1] * f.k];
  const TL = [(fussO[0] + fussU[0]) / 2, (fussO[1] + fussU[1]) / 2];  /* Tretlager zwischen den Pedalen */
  const FR = [hand[0] - 0.35 * u, -RR];                              /* Vorderrad unter dem Lenker */
  const HK = [hand[0] + 0.05 * u, hand[1] + 0.2 * u];                /* Steuerkopf */
  const P2 = ([x, y]) => `${r(x)} ${r(y)}`;
  k += rad(m(0.66), r(-RR - 0.05 * u), RR);
  k += `<path d="M${P2(TL)} L${m(0.66)} ${r(-RR)}" stroke="#4a4d52" stroke-width=".35" fill="none"/>`;
  k += `<path d="M${P2([FR[0], -RR])} L${P2(HK)} M${P2(HK)} L${P2(SA)} M${P2(HK)} L${P2(TL)} M${P2(SA)} L${P2(TL)} M${P2(TL)} L${m(0.04)} ${m(-0.36)}" stroke="#2a2d33" stroke-width="${r(0.04 * u)}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  k += `<path d="M${P2(HK)} L${r(hand[0])} ${r(hand[1])}" stroke="#2a2d33" stroke-width="${r(0.035 * u)}"/><path d="M${r(hand[0] - 0.08 * u)} ${r(hand[1])} h${r(0.16 * u)}" stroke="#1d1d1d" stroke-width="${r(0.06 * u)}" stroke-linecap="round"/>`;
  k += `<path d="M${r(SA[0] - 0.13 * u)} ${r(SA[1] + 0.02 * u)} q${r(0.13 * u)} ${r(-0.06 * u)} ${r(0.27 * u)} 0 q0 ${r(0.05 * u)} ${r(-0.27 * u)} ${r(0.04 * u)} Z" fill="#1d1d1d"/>`;
  k += `<circle cx="${r(TL[0])}" cy="${r(TL[1])}" r="${r(0.11 * u)}" fill="none" stroke="#5a5e64" stroke-width=".35"/><path d="M${P2(fussO)} L${P2(fussU)}" stroke="#2a2d33" stroke-width=".45"/>`;
  k += rad(r(FR[0]), r(-RR), RR);
  /* Wagenkasten: roter Lack mit Goldleiste, Sitzbank */
  k += `<path d="M${m(0.02)} ${m(-0.34)} L${m(0.02)} ${m(-0.86)} Q${m(0.06)} ${m(-0.96)} ${m(0.2)} ${m(-0.96)} L${m(0.96)} ${m(-0.96)} L${m(1.06)} ${m(-0.4)} L${m(0.86)} ${m(-0.34)} Z" fill="${S.lg("rikscha", [[0, "#d23a2a"], [1, "#8c1a12"]])}"/>`;
  k += `<path d="M${m(0.06)} ${m(-0.9)} L${m(0.94)} ${m(-0.9)}" stroke="#e8c35a" stroke-width=".5"/><path d="M${m(0.12)} ${m(-0.5)} L${m(0.9)} ${m(-0.5)}" stroke="#e8c35a" stroke-width=".35"/>`;
  k += `<rect x="${m(0.12)}" y="${m(-1.08)}" width="${m(0.78)}" height="${m(0.14)}" rx=".8" fill="#2a2a2a"/>`;
  k += `<path d="M${m(0.86)} ${m(-0.96)} L${m(0.98)} ${m(-1.5)} L${m(0.8)} ${m(-1.52)} L${m(0.74)} ${m(-1.08)} Z" fill="#7a1a10"/>`;
  /* Verdeck mit zwei vorderen Streben zur Sitzbank, Fransen direkt an der Vorderkante */
  k += `<path d="M${m(0.16)} ${m(-1.66)} L${m(0.14)} ${m(-1.06)} M${m(0.3)} ${m(-1.8)} L${m(0.24)} ${m(-1.06)}" stroke="#4a1208" stroke-width="${r(0.025 * u)}"/>`;
  k += `<path d="M${m(1.0)} ${m(-1.0)} Q${m(1.1)} ${m(-1.86)} ${m(0.62)} ${m(-1.96)} Q${m(0.2)} ${m(-1.98)} ${m(0.1)} ${m(-1.72)} L${m(0.16)} ${m(-1.62)} Q${m(0.32)} ${m(-1.8)} ${m(0.6)} ${m(-1.78)} Q${m(0.94)} ${m(-1.7)} ${m(0.9)} ${m(-1.0)} Z" fill="${S.lg("verdeck", [[0, "#c8301f"], [1, "#7a1208"]])}"/>`;
  for (const t of [0.3, 0.55, 0.8]) k += `<path d="M${m(0.1 + t * 0.9)} ${m(-1.96 + t * 0.1)} L${m(0.08 + t * 0.85)} ${m(-1.1)}" stroke="#5a0e06" stroke-width=".25" opacity=".6"/>`;
  for (let i = 0; i < 8; i++) { const t = i / 7, x = 0.1 + t * 0.2, y = -1.72 + t * 0.06 - Math.sin(t * Math.PI) * 0.08; k += `<line x1="${m(x)}" y1="${m(y)}" x2="${m(x)}" y2="${m(y + 0.09)}" stroke="#f2c23a" stroke-width=".35"/>`; }
  k += rad(m(0.7), r(-RR), RR);
  k += `<line x1="${m(1.02)}" y1="${m(-1.4)}" x2="${m(1.08)}" y2="${m(-2.2)}" stroke="#555" stroke-width=".25"/><rect x="${m(1.08)}" y="${m(-2.2)}" width="${m(0.22)}" height="${m(0.15)}" fill="#de2910"/><circle cx="${r(m(1.08) + 0.04 * u)}" cy="${r(m(-2.2) + 0.05 * u)}" r=".3" fill="#ffde00"/>`;
  S.teil({ anker: [r(RI.x + 0.75 * u), r(Y - 0.45 * u)], id: "rikscha", de: "die Rikscha", syl: "RIK-scha", it: "il risciò", itSyl: "ri-SCIÒ", en: "rickshaw", x: RI.x, y: Y, steht: true, kunst: k,
    tipp: "Mit der Fahrradrikscha fahren Besucher durch die alten Gassen von Peking, die Hutongs." });
  S.teil({ anker: [r(RI.x + SA[0] + 0.05 * u), r(Y - 1.35 * u)], id: "fahrer", de: "der Rikschafahrer", syl: "RIK-scha-fah-rer", it: "il conducente del risciò", itSyl: "con-du-CEN-te del ri-SCIÒ", en: "rickshaw driver", x: RI.x, y: Y, kunst: `<g transform="translate(${r(ox)} ${r(oy)})">${vereinfache(f.svg, 1.5)}</g>`,
    tipp: "Er tritt in die Pedale. Gleich holt er Gäste ab und fährt mit ihnen durch die Hutongs." });
}

/* =====================================================================
   18 — DAS GELÄNDER (Terrasse im 1. Stock), Dielenboden, 19 — DIE SÄULE,
   20 — DAS DACH, 21 — DIE LATERNE
   ===================================================================== */
const DV = 6;                                   /* vordere Terrassenkante */
const yBoden = (d) => yAt(d, BODEN);
{
  /* Dielenboden (Kulisse) */
  const yv = yBoden(DV), boden = P([[KANTE(yv), yv], [400, yv], [400, 260], [KANTE(260), 260]]);
  let f = `<path d="${boden}" fill="${S.lg("dielen", [[0, "#7a4a28"], [1, "#a06a3c"]])}"/>`;
  for (let i = 1; i <= 30; i++) { const s = -0.5 + i * 0.22; if (xAt(s, DV) < 400) f += `<line ${linieK(xAt(s, DV), yv, CX + s * (260 - HOR) / 1.6, 260)} stroke="#5e3a1e" stroke-width="${r(0.3 + i * 0.012)}" opacity=".5"/>`; }
  for (const d of [5.2, 4.4, 3.8]) { const y = yBoden(d); for (let s = -0.5 + (d % 1) * 0.5; xAt(s + 0.22, d) < 400; s += 0.88) f += `<line x1="${r(xAt(s, d))}" y1="${r(y)}" x2="${r(xAt(s + 0.22, d))}" y2="${r(y)}" stroke="#4a2a14" stroke-width=".35" opacity=".6"/>`; }
  f += `<path d="${boden}" fill="${S.lg("dielenlicht", [[0, "#ffe2a8", 0.2], [0.6, "#ffe2a8", 0], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}
{
  /* rot lackiertes Holzgeländer mit Bubujin-Gitter (gestufte Rechtecke): vorn (d = 6) und links entlang der Kante */
  let k = "";
  const yO = (d) => yAt(d, BODEN + 1.0), yU = (d) => yBoden(d);
  /* Gitterfeld zwischen zwei Pfosten (Ecken a oben/unten, b oben/unten) — Linien im Einheitsquadrat */
  const BUBU = [[0.05, 0.2, 0.62, 0.2], [0.38, 0.8, 0.95, 0.8], [0.62, 0.2, 0.62, 0.55], [0.38, 0.45, 0.38, 0.8], [0.38, 0.45, 0.62, 0.45], [0.62, 0.55, 0.95, 0.55], [0.05, 0.45, 0.38, 0.45], [0.2, 0.2, 0.2, 0.45], [0.8, 0.55, 0.8, 0.8], [0.05, 0.08, 0.95, 0.08], [0.05, 0.92, 0.95, 0.92], [0.05, 0.08, 0.05, 0.92], [0.95, 0.08, 0.95, 0.92]];
  const feld = (xa, ya0, ya1, xb, yb0, yb1, sw) => {
    const pt = (tx, ty2) => { const y0 = ya0 + (yb0 - ya0) * tx, y1 = ya1 + (yb1 - ya1) * tx; return [xa + (xb - xa) * tx, y0 + (y1 - y0) * ty2]; };
    let d = "";
    for (const [x1, y1, x2, y2] of BUBU) { const [p1x, p1y] = pt(x1, y1), [p2x, p2y] = pt(x2, y2); d += `M${r(p1x)} ${r(p1y)} L${r(p2x)} ${r(p2y)}`; }
    return `<path d="${d}" stroke="#a8281a" stroke-width="${r(sw)}" fill="none" stroke-linecap="square"/>`;
  };
  const pfosten = (x, d, dick = 0.08) => { const u = uAt(d), w = dick * u; return `<rect x="${r(x - w / 2)}" y="${r(yO(d) - 0.06 * u)}" width="${r(w)}" height="${r(Math.min(260, yU(d)) - yO(d) + 0.06 * u)}" fill="${ROT_S}"/><rect x="${r(x - w / 2 - 0.015 * u)}" y="${r(yO(d) - 0.1 * u)}" width="${r(w + 0.03 * u)}" height="${r(0.045 * u)}" fill="#b0261c"/>`; };
  /* linke Kante: zwei Felder (d 6 → 4,5 → 3,4) */
  const ds = [DV, 5.2, 4.5, 3.9, 3.4];
  for (let i = 0; i < ds.length - 1; i++) {
    const a = ds[i], b = ds[i + 1];
    k += feld(xAt(-0.5, a) - 0.4, yO(a) + 0.12 * uAt(a), yU(a) - 0.1 * uAt(a), xAt(-0.5, b) + 0.4, yO(b) + 0.12 * uAt(b), yU(b) - 0.1 * uAt(b), 0.03 * uAt((a + b) / 2));
  }
  const rail = (d1, d2, h1, h2, dick) => P([[xAt(-0.5, d1), yAt(d1, h1)], [xAt(-0.5, d2), yAt(d2, h2)], [xAt(-0.5, d2), yAt(d2, h2) + dick * uAt(d2)], [xAt(-0.5, d1), yAt(d1, h1) + dick * uAt(d1)]]);
  k += `<path d="${rail(DV, 3.2, BODEN + 1, BODEN + 1, 0.06)}" fill="${ROT_S}"/><path d="${rail(DV, 3.2, BODEN + 0.08, BODEN + 0.08, 0.08)}" fill="#7a1a10"/>`;
  for (const d of ds) k += pfosten(xAt(-0.5, d), d, 0.06);
  /* Handlauf über den Pfostenköpfen, fällt nach hinten ab */
  k += `<path d="${P([[xAt(-0.5, DV) + 1.2, yO(DV) - 0.14 * uAt(DV)], [xAt(-0.5, 3.4) + 1.2, yO(3.4) - 0.14 * uAt(3.4)], [xAt(-0.5, 3.4) - 1.2, yO(3.4) - 0.04 * uAt(3.4)], [xAt(-0.5, DV) - 1.2, yO(DV) - 0.04 * uAt(DV)]])}" fill="${ROT_S}"/><path d="M${r(xAt(-0.5, DV))} ${r(yO(DV) - 0.13 * uAt(DV))} L${r(xAt(-0.5, 3.4))} ${r(yO(3.4) - 0.13 * uAt(3.4))}" stroke="#e2735a" stroke-width=".8" opacity=".7"/>`;
  /* vorne über die ganze Breite */
  const u = uAt(DV), x0 = xAt(-0.5, DV);
  for (let s2 = -0.5; xAt(s2, DV) < 399; s2 += 0.9) { const xa = xAt(s2, DV), xb = Math.min(400, xAt(s2 + 0.9, DV)); if (xb - xa > 6) k += feld(xa + 0.05 * u, yO(DV) + 0.12 * u, yU(DV) - 0.1 * u, xb - 0.05 * u, yO(DV) + 0.12 * u, yU(DV) - 0.1 * u, 0.022 * u); }
  k += `<rect x="${r(x0)}" y="${r(yU(DV) - 0.08 * u)}" width="${r(400 - x0)}" height="${r(0.08 * u)}" fill="#7a1a10"/>`;
  for (let s2 = -0.5; xAt(s2, DV) < 399; s2 += 0.9) k += pfosten(xAt(s2, DV), DV);
  k += `<rect x="${r(x0)}" y="${r(yO(DV))}" width="${r(400 - x0)}" height="${r(0.06 * u)}" fill="${ROT_S}"/><rect x="${r(x0)}" y="${r(yO(DV))}" width="${r(400 - x0)}" height="${r(0.018 * u)}" fill="#e2735a" opacity=".7"/>`;
  S.teil({ anker: [262, 150], id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k,
    tipp: "Das Holzgeländer ist rot lackiert. Sein Gitter heißt „Bubujin“ – „Schritt für Schritt zu Glück und Reichtum“." });
}
{
  /* Säule rechts vorn, mit Steinsockel */
  const d = DV, x = 392;
  let k = `<rect x="${r(x - 8)}" y="22" width="16" height="${r(yBoden(d) - 22)}" fill="${S.lg("saeule", [[0, "#7a160e"], [0.3, "#c43a26"], [0.55, "#a8281a"], [1, "#5a0e08"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(x - 8.4)}" y="22" width="16.8" height="3" fill="#e8c35a" opacity=".85"/>`;
  k += `<path d="M${r(x - 10)} ${r(yBoden(d))} L${r(x - 9)} ${r(yBoden(d) - 4)} L${r(x + 8)} ${r(yBoden(d) - 4)} L${r(x + 8)} ${r(yBoden(d))} Z" fill="#8a8a82"/>`;
  S.teil({ anker: [388, 120], id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: 0, y: 0, kunst: k,
    tipp: "Die Säulen tragen das Dach. Rot bedeutet in China Glück." });
}
{
  /* Dach: Balken nur an der Säule, mit geschnitzter Konsole (Queti); die Traufe kragt auf Konsolen aus */
  /* Die Traufe kragt etwa 1,5 m über die Säule aus (übliche Ausladung), getragen von Sparren und Konsolen am Balken */
  let k = `<path d="M296 1.6 Q302 7.6 312 7.4 L400 7.4 L400 0 L296 0 Z" fill="url(#${S.id("grauziegel")})"/>`;
  k += `<path d="M296 1.6 Q302 7.6 312 7.4 L400 7.4" stroke="#3e4146" stroke-width="1.2" fill="none"/>`;
  for (let xx = 312; xx < 399; xx += 2.4) k += `<circle cx="${xx}" cy="7.4" r="1" fill="#55585e"/>`;
  k += `<path d="M293 .4 Q296 3 300 2.4" stroke="#3e4146" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  for (let xx = 306; xx < 397; xx += 4) k += `<rect x="${xx}" y="7.6" width="3" height="4.2" fill="#1f5f8a"/><circle cx="${xx + 1.5}" cy="9.4" r=".9" fill="#f6f2e6"/>`;
  k += `<rect x="304" y="11.8" width="96" height="2.2" fill="#2a5f7a"/>`;
  /* Konsolen unter der Traufe (blau-grün mit Gold) */
  for (const xx of [330]) k += `<path d="M${xx - 4} 14 L${xx + 4} 14 L${xx + 3} 16.2 L${xx + 1.6} 16.2 L${xx + 1.6} 18.6 L${xx - 1.6} 18.6 L${xx - 1.6} 16.2 L${xx - 3} 16.2 Z" fill="#1f6d8a" stroke="#e8c35a" stroke-width=".3"/>`;
  /* Balken (Su-Malerei) zwischen Konsole und Säule */
  k += `<rect x="352" y="14" width="48" height="8" fill="${GRUENBLAU}"/><rect x="352" y="14" width="48" height="1" fill="#e8c35a"/><rect x="352" y="20.8" width="48" height="1.2" fill="#b0261c"/>`;
  k += `<ellipse cx="372" cy="18" rx="9" ry="2.8" fill="#f3ead6"/><path d="M366 18 q3 -2 6 0 q3 2 6 0" stroke="#3a6e8a" stroke-width=".5" fill="none"/><circle cx="372" cy="18" r="1.1" fill="#c0392b"/>`;
  k += `<path d="M352 22 L384 22 L384 25 Q370 25 362 30 Q356 28 352 22 Z" fill="#a8281a" stroke="#e8c35a" stroke-width=".4"/><path d="M358 25 q6 1 10 -1 m-4 3 q4 -1 8 -2" stroke="#e8c35a" stroke-width=".35" fill="none"/>`;
  k += `<rect x="304" y="14" width="96" height="1.2" fill="#000" opacity=".15"/>`;
  S.teil({ anker: [344, 5], id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: 0, y: 0, kunst: k,
    tipp: "Unter dem grauen Ziegeldach sind die Sparren blau und weiß bemalt." });
}
{
  let k = "";
  for (const [x, s, yH] of [[316, 1, 14], [350, 0.92, 22]]) {
    const y = 40;
    k += `<line x1="${x}" y1="${yH}" x2="${x}" y2="${r(y - 13 * s)}" stroke="#2a1a10" stroke-width=".5"/><path d="M${x - 1.2} ${yH + 0.4} q1.2 -1.6 2.4 0" stroke="#2a1a10" stroke-width=".5" fill="none"/>`;
    k += `<rect x="${r(x - 6 * s)}" y="${r(y - 14 * s)}" width="${r(12 * s)}" height="${r(2.4 * s)}" rx=".6" fill="${LACK}"/><rect x="${r(x - 6 * s)}" y="${r(y + 11.6 * s)}" width="${r(12 * s)}" height="${r(2.4 * s)}" rx=".6" fill="${LACK}"/>`;
    k += `<ellipse cx="${x}" cy="${y}" rx="${r(11 * s)}" ry="${r(12.2 * s)}" fill="${S.rg("laterne2", [[0, "#e8704a"], [0.5, "#c82418"], [1, "#7e0e08"]], 0.4, 0.38, 0.7)}"/>`;
    for (const fx of [-0.75, -0.42, 0, 0.42, 0.75]) k += `<path d="M${r(x + fx * 6 * s)} ${r(y - 11.8 * s)} Q${r(x + fx * 13 * s)} ${y} ${r(x + fx * 6 * s)} ${r(y + 11.8 * s)}" stroke="#a8140c" stroke-width=".45" fill="none"/>`;
    k += `<text x="${x}" y="${r(y + 3 * s)}" font-size="${r(8 * s)}" text-anchor="middle" fill="#f6d36a" font-family="serif" font-weight="bold">福</text>`;
    k += `<path d="M${r(x - 3 * s)} ${r(y + 14 * s)} L${r(x - 3.6 * s)} ${r(y + 24 * s)} L${r(x + 3.6 * s)} ${r(y + 24 * s)} L${r(x + 3 * s)} ${r(y + 14 * s)} Z" fill="#f2c23a"/>`;
    for (let i = 0; i < 6; i++) k += `<line x1="${r(x - 3 * s + i * 1.2 * s)}" y1="${r(y + 16 * s)}" x2="${r(x - 3.4 * s + i * 1.36 * s)}" y2="${r(y + 24 * s)}" stroke="#c99a1a" stroke-width=".25"/>`;
    k += `<ellipse cx="${r(x - 4 * s)}" cy="${r(y - 5 * s)}" rx="${r(2.6 * s)}" ry="${r(4 * s)}" fill="#fff" opacity=".18"/>`;
  }
  S.teil({ oben: true, id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "lantern", x: 0, y: 0, anker: [316, 40], kunst: k,
    tipp: "Rote Laternen bringen Glück. Das Zeichen 福 heißt „Glück“." });
}

/* =====================================================================
   22 — DER TISCH und das Essen (Sonne von hinten links: Schatten nach rechts hinten)
   ===================================================================== */
const TI = { s0: 0.32, s1: 1.62, d0: 2.02, d1: 2.95, h: BODEN + 0.75 };
const tp = (s, d, h = TI.h) => [xAt(s, d), yAt(d, h)];
const sk = (d) => uAt(d) / 100;
const SCH = [2.6, -0.9];                   /* Schattenversatz (Einheiten je Maßstab 1) nach rechts hinten */
{
  const [a, b, c, e] = [tp(TI.s0, TI.d1), tp(TI.s1, TI.d1), tp(TI.s1, TI.d0), tp(TI.s0, TI.d0)];
  let k = `<path d="${P([[a[0] + 12, yBoden(TI.d1) - 3], [b[0] + 26, yBoden(TI.d1) - 3], [c[0] + 50, 262], [e[0] + 18, 262]])}" fill="#1b120a" opacity=".2" filter="url(#bw_weich)"/>`;
  k += `<path d="M${r(a[0] + 3)} ${r(a[1] + 6)} L${r(a[0] + 3)} 260 M${r(b[0] - 3)} ${r(b[1] + 6)} L${r(b[0] - 3)} 260" stroke="#3a1008" stroke-width="4"/>`;
  const platte = P([a, b, c, e]);
  k += `<path d="${platte}" fill="${S.lg("tischplatte", [[0, "#5e1e10"], [1, "#8e3418"]])}"/>`;
  k += `<path d="${platte}" fill="${S.lg("tischglanz", [[0, "#fff", 0], [0.4, "#ffe8c8", 0.14], [0.55, "#fff", 0]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}" stroke="#c0703a" stroke-width=".7"/><path d="M${r(a[0])} ${r(a[1])} L${r(e[0])} ${r(e[1])}" stroke="#4a160a" stroke-width="1.2"/>`;
  for (let i = 0; i < 8; i++) { const t = (i + 0.5) / 8; k += `<line ${linieK(a[0] + (b[0] - a[0]) * t, a[1], e[0] + (c[0] - e[0]) * t, e[1])} stroke="#4e180a" stroke-width=".3" opacity=".35"/>`; }
  S.teil({ anker: [262, 252], id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 0, y: 0, kunst: k,
    tipp: "Der Tisch ist aus dunklem, rot lackiertem Holz. Darauf steht ein Festessen aus Peking." });
}
const g = (x, y, s, inhalt) => `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s * 100) / 100})">${inhalt}</g>`;
const schattenAuf = (x, y, rx, ry, q, a = 0.28) => schatten(x + SCH[0] * q, y + SCH[1] * q, rx, ry, a);
const enteUnter = [];
{
  /* die Pekingente: glasiert, mahagonibraun, flacher Rücken, Keulen sichtbar, Kopf klein und hängend (ohne Auge) */
  const dE = 2.62, [px, py] = tp(0.72, dE), q = sk(dE);
  const D = S.lg("ente", [[0, "#c8742e"], [0.4, "#9a4a1a"], [1, "#4e1e08"]], 0, 0, 0, 1);
  let ente = `<ellipse cx="0" cy="0" rx="22" ry="4.2" fill="#f4f1ea"/><ellipse cx="0" cy="-.3" rx="19.4" ry="3.2" fill="#e8e3d6"/><path d="M-18 0 A20 3.6 0 0 0 18 0" stroke="#2a5aa0" stroke-width=".6" fill="none"/>`;
  ente += `<path d="M-14 -.6 Q-15.8 -6.6 -9 -9.4 Q1 -11.6 10 -9.8 Q16.4 -8.2 16.4 -4.2 Q16.2 -.8 12 -.3 Z" fill="${D}"/>`;
  /* flacher Rücken als hellere Fläche (3/4-Ansicht von oben), Brust vorn gewölbt */
  ente += `<path d="M-10.6 -7.6 Q0 -10.8 11 -8.8 Q14.6 -7.6 14 -6 Q4 -7.6 -9.6 -6.2 Z" fill="#c87a3a" opacity=".55"/>`;
  ente += `<path d="M-13.6 -1.4 Q-14.4 -5.2 -10.2 -6.2 Q-8.4 -3.6 -9.2 -.8 Z" fill="#b8642a" opacity=".6"/>`;
  /* angelegter Flügel als flache Wölbung, angelegte Keule unten hinten (ohne Knochen), kleiner Bürzel */
  ente += `<path d="M-5.6 -3.4 Q1 -8.2 10.4 -6.2 Q5 -3.6 -5.6 -3.4 Z" fill="#7a3410" opacity=".5"/><path d="M-5 -3.6 Q1 -7.4 9.6 -6" stroke="#e6a868" stroke-width=".35" fill="none" opacity=".7"/>`;
  ente += `<path d="M6.6 -.6 Q6.8 -4 10.6 -4.2 Q13.8 -3.8 13.2 -1.4 Q12.6 -.4 10 -.3 Z" fill="${S.lg("keule", [[0, "#b8642a"], [1, "#5e260a"]])}" stroke="#4a1a06" stroke-width=".2"/><path d="M7.6 -2.6 Q10 -4 12.4 -3" stroke="#e6a868" stroke-width=".3" fill="none" opacity=".7"/>`;
  ente += `<path d="M15.8 -5.6 Q17.4 -5.2 17 -3.8 Q16.4 -4.4 15.8 -4.2 Z" fill="#6a2a0c"/>`;
  /* Glanzlichter längs über die knusprige Haut */
  ente += `<path d="M-11 -7.6 Q-1 -11 10 -9.2" stroke="#ffd9a0" stroke-width="1" fill="none" opacity=".7"/><path d="M-9 -6 Q0 -8.8 8 -7.4" stroke="#ffe6c0" stroke-width=".5" fill="none" opacity=".55"/>`;
  /* kleiner hängender Hals mit Kopf, am Plattenrand liegend */
  ente += `<path d="M-13.4 -2.6 Q-16.4 -4 -17.6 -2.6 Q-18.2 -1.6 -17.8 -.6" stroke="#7a3410" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M-13.8 -3.4 Q-16.2 -4.4 -17.4 -3.4" stroke="#d08a48" stroke-width=".45" fill="none" opacity=".8"/>`;
  /* Kopf rund mit flachem Entenschnabel, auf dem Tellerrand liegend */
  ente += `<path d="M-16.2 -.4 Q-16.2 -2.4 -18.2 -2.4 Q-20.2 -2.4 -20.2 -.6 Q-20.2 .6 -18.6 .7 Q-16.2 .8 -16.2 -.4 Z" fill="#6e2c0c"/><path d="M-19.8 -.1 Q-21.6 -.5 -23.2 .1 Q-23.8 .5 -23.2 .9 Q-21.6 1.3 -19.6 .7 Z" fill="#4a1e08"/><path d="M-19.8 .35 L-23.4 .5" stroke="#2a1004" stroke-width=".18"/><path d="M-19.6 -1.9 Q-18.4 -2.6 -17 -1.8" stroke="#c07a3a" stroke-width=".35" fill="none"/>`;
  let k = schattenAuf(px, py, 24 * q, 3 * q, q) + g(px, py, q, ente);
  /* Teller mit Hautscheiben im Fächer: Haut oben, heller Fettrand */
  const dT = 2.22, [tx, ty2] = tp(1.17, dT), qt = sk(dT);
  let teller = `<ellipse cx="0" cy="0" rx="12" ry="2.9" fill="#f4f1ea"/><ellipse cx="0" cy="-.2" rx="10" ry="2.1" fill="#e8e3d6"/><path d="M-11 .2 A12 2.6 0 0 0 11 .2" stroke="#2a5aa0" stroke-width=".5" fill="none"/>`;
  const scheibe = (x, y, w) => `<g transform="translate(${x} ${y}) rotate(${w})"><path d="M-3.2 0 Q-3.2 -1.4 0 -1.4 Q3.2 -1.4 3.2 0 Q3.2 .4 0 .4 Q-3.2 .4 -3.2 0 Z" fill="#b07a5a"/><path d="M-3.2 -.45 Q-3.2 -1.4 0 -1.4 Q3.2 -1.4 3.2 -.45 Q0 -.8 -3.2 -.45 Z" fill="#f6ead2"/><path d="M-3.2 -.7 Q-3.2 -1.4 0 -1.4 Q3.2 -1.4 3.2 -.7 Q0 -1.0 -3.2 -.7 Z" fill="#8a3a12"/><path d="M-2.2 -1.15 Q0 -1.32 2.2 -1.15" stroke="#e6a868" stroke-width=".25" fill="none"/></g>`;
  for (let i = 0; i < 7; i++) teller += scheibe(r(-5.4 + i * 1.25), r(-0.2 - Math.abs(i - 3) * 0.1), -14 + i * 4.5);
  teller += scheibe(5.6, 1.1, 12) + scheibe(-7.4, 1.0, -10);
  k += schattenAuf(tx, ty2, 13 * qt, 2 * qt, qt, 0.2) + g(tx, ty2, qt, teller);
  /* offener Bambuskorb mit flachem Stapel dünner, viertelgefalteter Pfannkuchen; Deckel lehnt daneben */
  const dB = 2.2, [bx, by] = tp(0.42, dB), qb = sk(dB);
  let korb = `<g transform="rotate(16 6 -6)"><ellipse cx="6" cy="-6.4" rx="8.6" ry="5" fill="${S.lg("bambus", [[0, "#d9b46a"], [1, "#a8823e"]], 0, 0, 1, 0)}"/><ellipse cx="6" cy="-6.4" rx="7.4" ry="4.1" fill="#c9a258"/><path d="M-0.4 -6.4 H12.4 M6 -10.3 V-2.5 M1.4 -9 L10.6 -3.8 M1.4 -3.8 L10.6 -9" stroke="#a8823e" stroke-width=".25"/><ellipse cx="6" cy="-6.4" rx="1.4" ry=".8" fill="#a8823e"/></g>`;
  korb += `<ellipse cx="0" cy="0" rx="8.6" ry="2.1" fill="#a07a3a"/><rect x="-8.6" y="-4.2" width="17.2" height="4.2" fill="${S.lg("bambus", [])}"/><path d="M-8.6 -2.1 h17.2" stroke="#8a6a2a" stroke-width=".35"/><ellipse cx="0" cy="-4.2" rx="8.6" ry="2.1" fill="#7a5a26"/>`;
  for (let i = 0; i < 5; i++) korb += `<ellipse cx="${r(-0.3 + (i % 2) * 0.5)}" cy="${r(-4.5 - i * 0.32)}" rx="6.6" ry="1.6" fill="${i % 2 ? "#f8efd8" : "#fdf6e4"}" stroke="#d9c8a2" stroke-width=".22"/>`;
  korb += `<path d="M-2.6 -6.1 Q-2.4 -7.6 1.2 -7.7 Q5 -7.6 5.6 -6.4 L1.8 -6.0 Z" fill="#fbf3e0" stroke="#d9c8a2" stroke-width=".22"/><path d="M-1.6 -6.3 Q1.4 -7.1 4.4 -6.4" stroke="#e8d8b4" stroke-width=".2" fill="none"/>`;
  k += schattenAuf(bx, by, 10 * qb, 1.6 * qb, qb, 0.22) + g(bx, by, qb, korb);
  enteUnter.push({ id: "pfannkuchen", de: "der Pfannkuchen", syl: "PFANN-ku-chen", it: "la crêpe", itSyl: "CREP", en: "pancake", x: bx, y: by, kunst: flaeche(-9 * qb, -7.4 * qb, 18 * qb, 9.4 * qb),
    tipp: "Die Pfannkuchen sind dünn wie Papier. Man rollt darin die Ente mit Soße, Gurke und Frühlingszwiebel." });
  /* Soße im Schälchen; Teller mit zwei getrennten Häufchen: Frühlingszwiebel (weiß, grüne Spitzen) und Gurke (hellgrün, dunkle Schale) */
  const dS = 2.12, [sx, sy] = tp(0.62, dS), qs = sk(dS);
  let schale = `<ellipse cx="0" cy="0" rx="4" ry="1.4" fill="#f4f1ea" stroke="#2a5aa0" stroke-width=".3"/><ellipse cx="0" cy="-.2" rx="3.1" ry=".95" fill="#3a1a0a"/><ellipse cx="-.7" cy="-.45" rx="1" ry=".3" fill="#8a5a3a"/>`;
  k += schattenAuf(sx, sy, 4.4 * qs, 1 * qs, qs, 0.2) + g(sx, sy, qs, schale);
  const dG = 2.1, [gx, gy] = tp(0.85, dG), qg = sk(dG);
  let gem = `<ellipse cx="0" cy="0" rx="10" ry="2.4" fill="#f4f1ea"/><ellipse cx="0" cy="-.2" rx="8.4" ry="1.7" fill="#e8e3d6"/>`;
  for (let i = 0; i < 7; i++) { const x = -7.6 + i * 0.6; gem += `<path d="M${r(x)} -.4 q.3 -1.6 1.4 -2.6" stroke="#f6f6ee" stroke-width=".55" fill="none" stroke-linecap="round"/><path d="M${r(x + 1)} -2.8 q.4 -.4 .9 -.3" stroke="#7cbc3a" stroke-width=".55" fill="none" stroke-linecap="round"/>`; }
  for (let i = 0; i < 6; i++) { const x = 3.2 + i * 0.75; gem += `<rect x="${r(x)}" y="-3.4" width=".75" height="3.1" rx=".15" fill="#cfe8a8" transform="rotate(${-12 + i * 3} ${r(x)} 0)"/><rect x="${r(x + 0.5)}" y="-3.4" width=".25" height="3.1" fill="#2f6a26" transform="rotate(${-12 + i * 3} ${r(x)} 0)"/>`; }
  k += schattenAuf(gx, gy, 10.6 * qg, 1.6 * qg, qg, 0.2) + g(gx, gy, qg, gem);
  enteUnter.push({ id: "sosse", de: "die Soße", syl: "SO-ße", it: "la salsa", itSyl: "SAL-sa", en: "sauce", x: sx, y: sy, kunst: flaeche(-4.4 * qs, -1.8 * qs, 8.8 * qs, 3.4 * qs),
    tipp: "Die dunkle, süße Bohnensoße gehört zur Pekingente." });
  enteUnter.push({ id: "fruehlingszwiebel", de: "die Frühlingszwiebel", syl: "FRÜH-lings-zwie-bel", it: "il cipollotto", itSyl: "ci-pol-LOT-to", en: "spring onion", x: gx - 5.6 * qg, y: gy - 2.4 * qg, kunst: flaeche(-2.8 * qg, -1.2 * qg, 6 * qg, 4 * qg),
    tipp: "Die Frühlingszwiebel wird in feine Streifen geschnitten." });
  enteUnter.push({ id: "gurke", de: "die Gurke", syl: "GUR-ke", it: "il cetriolo", itSyl: "ce-tri-O-lo", en: "cucumber", x: gx + 5.4 * qg, y: gy + 1.8 * qg, kunst: flaeche(-2.6 * qg, -5.6 * qg, 6 * qg, 4.2 * qg),
    tipp: "Die Gurke wird in dünne Stifte geschnitten. Sie macht die Pekingente frisch." });
  S.teil({ oben: true, id: "pekingente", de: "die Pekingente", syl: "PE-king-en-te", it: "l'anatra alla pechinese", itSyl: "A-na-tra al-la pe-chi-NE-se", en: "Peking duck", x: 0, y: 0, anker: [r(px), r(py - 6 * q)], kunst: k + flaeche(px - 23 * q, py - 11.4 * q, 41 * q, 15 * q),
    zoom: { x: 216, y: 188, w: 108, h: 72 }, unter: enteUnter,
    tipp: "Die Ente wird im Ofen über Obstholz gebraten. Ihre Haut wird ganz knusprig und glänzt." });
}
{
  /* DIE TEIGTASCHE — Jiaozi: flach liegende Halbmonde mit gefältelter Naht */
  const d = 2.55, [x, y] = tp(1.22, d), q = sk(d);
  let k = `<ellipse cx="0" cy="0" rx="13" ry="3" fill="#f4f1ea"/><ellipse cx="0" cy="-.2" rx="11" ry="2.2" fill="#e8e3d6"/><path d="M-11 .2 A12 2.6 0 0 0 11 .2" stroke="#2a5aa0" stroke-width=".5" fill="none"/>`;
  for (const [dx, dy, sp] of [[-6.4, -0.3, 1], [-1.8, 0.1, -1], [2.8, -0.3, 1], [7, -0.1, -1], [-4.2, -1.8, -1], [0.6, -1.9, 1], [5, -1.7, -1]]) {
    k += `<path d="M${r(dx - 3)} ${r(dy)} Q${r(dx - 2.6)} ${r(dy - 2.2)} ${r(dx)} ${r(dy - 2.5)} Q${r(dx + 2.6)} ${r(dy - 2.2)} ${r(dx + 3)} ${r(dy)} Q${r(dx)} ${r(dy + 0.9)} ${r(dx - 3)} ${r(dy)} Z" fill="${S.lg("jiaozi", [[0, "#fbf6e8"], [1, "#d8caa6"]])}" transform="rotate(${sp * 8} ${r(dx)} ${r(dy)})"/>`;
    { let f = ""; for (let t = 0.12; t < 0.9; t += 0.13) { const a = t < 0.5 ? t * 2 : (t - 0.5) * 2; const [p0, p1, p2] = t < 0.5 ? [[dx - 3, dy], [dx - 2.6, dy - 2.2], [dx, dy - 2.5]] : [[dx, dy - 2.5], [dx + 2.6, dy - 2.2], [dx + 3, dy]]; const qx = (1 - a) * (1 - a) * p0[0] + 2 * (1 - a) * a * p1[0] + a * a * p2[0], qy = (1 - a) * (1 - a) * p0[1] + 2 * (1 - a) * a * p1[1] + a * a * p2[1]; f += `M${r(qx - 0.25)} ${r(qy + 0.15)} Q${r(qx)} ${r(qy + 0.6)} ${r(qx + 0.25)} ${r(qy + 0.15)} `; }
      k += `<path d="${f}" stroke="#bfae84" stroke-width=".22" fill="none" transform="rotate(${sp * 8} ${r(dx)} ${r(dy)})"/>`; }
  }
  S.teil({ oben: true, id: "teigtasche", de: "die Teigtasche", syl: "TEIG-ta-sche", it: "il raviolo cinese", itSyl: "ra-VIO-lo ci-NE-se", en: "dumpling", x, y, steht: true,
    kunst: schatten(SCH[0] * q, SCH[1] * q, 14 * q, 2 * q, 0.22) + `<g transform="scale(${r(q * 100) / 100})">${k}</g>` + flaeche(-13 * q, -5 * q, 26 * q, 8 * q),
    tipp: "Teigtaschen heißen auf Chinesisch „Jiaozi“. Zum Neujahrsfest macht sie die ganze Familie." });
}
{
  const d = 2.44, [x, y] = tp(1.45, d), q = sk(d);
  let k = `<rect x="-12" y="-1.6" width="3" height="1.6" rx=".5" fill="#f4f1ea" stroke="#2a5aa0" stroke-width=".25"/>`;
  k += `<path d="M-15 -1.2 L16 1.2 L16 2.1 L-15 -.9 Z" fill="#b0261c"/><path d="M-14 -2.4 L17 -.5 L17 .4 L-14 -2.1 Z" fill="#c43a26"/>`;
  k += `<path d="M10 1.25 L16 1.65 M11 -.15 L17 -.05" stroke="#e8c35a" stroke-width=".8"/>`;
  S.teil({ oben: true, id: "essstaebchen", de: "das Essstäbchen", syl: "ESS-stäb-chen", it: "la bacchetta", itSyl: "bac-CHET-ta", en: "chopstick", x, y, steht: true,
    kunst: `<g transform="scale(${r(q * 100) / 100})">${k}</g>` + flaeche(-15.5 * q, -4.4 * q, 33 * q, 7 * q),
    tipp: "Man isst mit zwei Stäbchen. Man steckt sie nie senkrecht in den Reis." });
}
{
  const d = 2.85, [x, y] = tp(1.32, d), q = sk(d);
  let k = `<ellipse cx="${SCH[0]}" cy="${SCH[1]}" rx="6.4" ry="1.4" fill="#000" opacity=".2"/>`;
  k += `<path d="M-5.6 -1 Q-6.6 -6 -3.6 -8 L3.6 -8 Q6.6 -6 5.6 -1 Q0 .6 -5.6 -1 Z" fill="${S.lg("porzellan", [[0, "#ffffff"], [0.6, "#eef0f4"], [1, "#c9ced8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-4.6 -4.6 Q0 -2.8 4.6 -4.6" stroke="#2a5aa0" stroke-width=".6" fill="none"/><circle cx="0" cy="-5.6" r="1.1" fill="none" stroke="#2a5aa0" stroke-width=".4"/>`;
  k += `<path d="M5.4 -4 Q8.6 -5 9.4 -8.4" stroke="#e6e8ee" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-5.6 -6.4 Q-8.6 -5.4 -6 -2.4" stroke="#dfe2ea" stroke-width=".8" fill="none"/>`;
  k += `<ellipse cx="0" cy="-8" rx="3.6" ry=".8" fill="#e6e8ee"/><circle cx="0" cy="-9" r=".9" fill="#2a5aa0"/>`;
  k += `<path d="M-4 -7 Q-4.8 -4 -3.6 -1.6" stroke="#fff" stroke-width=".7" opacity=".8" fill="none"/>`;
  k += `<g transform="translate(-14 2.4)"><ellipse cx="${SCH[0] * 0.6}" cy="${SCH[1] * 0.6 + 0.2}" rx="3.4" ry=".8" fill="#000" opacity=".18"/><path d="M-3 -3.6 L3 -3.6 Q2.8 -.4 0 0 Q-2.8 -.4 -3 -3.6 Z" fill="${S.lg("porzellan", [])}"/><ellipse cx="0" cy="-3.6" rx="3" ry=".8" fill="#c99a3a"/><ellipse cx="0" cy="-3.6" rx="2.4" ry=".55" fill="#e0b85a"/><path d="M-2.4 -2.2 Q0 -1.2 2.4 -2.2" stroke="#2a5aa0" stroke-width=".4" fill="none"/></g>`;
  S.teil({ oben: true, id: "teekanne", de: "die Teekanne", syl: "TEE-kan-ne", it: "la teiera", itSyl: "te-IE-ra", en: "teapot", x, y, steht: true, kunst: `<g transform="scale(${r(q * 100) / 100})">${k}</g>`,
    tipp: "Zur Ente trinkt man grünen Tee oder Jasmintee aus kleinen Tassen." });
}

/* VORNE: warmes Nachmittagslicht (fängt keinen Tipp ab) */
S.davor(`<rect x="0" y="0" width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffe6b8", 0.1], [0.4, "#ffe6b8", 0], [1, "#000", 0.06]], 0, 0, 1, 1)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/peking.js"));
console.log(aus);
