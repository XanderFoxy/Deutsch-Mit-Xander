#!/usr/bin/env node
/* =====================================================================
   PEKING UND DIE GROSSE MAUER (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (visitbeijing.com.cn „Tian'anmen Gate“, China Daily
   „Mutianyu Great Wall – Landscape features“, Beijing-Regierung
   „Mutianyu (AAAAA)“, ourchinastory „The lanterns at Tiananmen“,
   travelchinawith.me „Mutianyu“):
   - STANDORT: Südseite der Chang'an-Straße am Nordrand des Platzes des
     Himmlischen Friedens, Anfang Oktober (Nationalfeiertag, „goldene
     Woche“), Nachmittag; die Sonne steht hinter uns im Südwesten. Blick
     genau nach NORDEN auf die Mittelachse der Stadt.
   - TIAN'ANMEN (Tor des Himmlischen Friedens, 1420, 1651 neu): 34,7 m
     hoch. Unten der rote Torbau (Stadttor-Sockel, rund 120 × 40 m,
     4800 m²) auf einem Fuß aus weißem Marmor, mit FÜNF Torbögen — der
     mittlere ist der größte, früher nur für den Kaiser. Darüber das
     Porträt und links/rechts die beiden Spruchbänder. Oben am Rand ein
     weißes Marmorgeländer. Darauf der Torturm: neun Joche breit, fünf
     tief (die kaiserlichen Zahlen), rote Säulen, Doppeldach im
     Xieshan-Stil (Walm unten, Giebel oben) mit kaiserlich GELBEN
     Glasurziegeln, blau-grün bemalte Dougong-Konsolen unter den Traufen,
     am First zwei Drachenköpfe (Chiwen), auf den Graten die Reihe der
     Dachfiguren. Zwischen den zehn Säulen der Galerie hängen ACHT große
     rote Palastlaternen (seit dem 1. Oktober 1949), das Mitteljoch bleibt
     frei.
   - DAVOR: der Goldwasserfluss mit seinen weißen Marmorbrücken (fünf
     vor den fünf Toren), davor das Paar HUABIAO — Marmorsäulen mit einem
     sich hochwindenden Drachen, Wolkenplatte und einem sitzenden Fabeltier
     (Hou) obenauf — und ein Paar Steinlöwen. Links und rechts läuft die
     rote Mauer der Kaiserstadt mit gelber Ziegelkappe weiter, dahinter
     alte Zypressen (Zhongshan-Park links, Kulturpalast rechts).
   - DIE GROSSE MAUER (Ming-Zeit): auf den Kämmen der Yanshan-Berge im
     NORDEN, 7–8 m hoch, oben 4–5 m breit, Granit unten, graue Ziegel
     oben, Zinnen; in Mutianyu stehen 22 Wachtürme auf 2,25 km, quadratische
     „Mini-Festungen“ mit zwei Geschossen und Bogenfenstern; an steilen
     Stellen wird der Wehrgang zur Treppe. Im Oktober leuchten die Hänge
     rot und gelb (Perückenstrauch, Ahorn).
     GESTAUCHT: Die Berge mit der Mauer liegen 60–70 km nördlich (links
     Badaling im Nordwesten, rechts Mutianyu im Nordosten). Hier rücken
     sie — in der richtigen Himmelsrichtung — wie mit dem Teleobjektiv
     hinter die Stadt (wie der Fuji in der Japan-Szene).
   - VORNE (ebenfalls gestaucht, richtig nach Süden geordnet): Pekingente
     isst man in den alten Restaurants am Qianmen, gut 1 km südlich —
     hier steht ihre Terrasse rechts am Platz: rote Säule, graues
     Ziegeldach mit bemalten Sparren, rote Laternen. Auf dem Tisch die
     glänzend braune Ente, dünne Pfannkuchen im Bambuskorb, süße
     Bohnensoße, Frühlingszwiebel und Gurke in Streifen, Teigtaschen
     (Jiaozi), Essstäbchen auf dem Bänkchen, Tee in blau-weißem
     Porzellan. Links auf dem Gehweg eine Fahrradrikscha (Hutong-
     Rikscha mit rotem Verdeck). Am Himmel ein Schwalbendrachen — die
     Pekinger Drachenform —, die Schnur führt in den Zhongshan-Park.
   Maßstab: Augenhöhe 3,1 m über der Straße (Terrasse 1,5 m hoch),
   Horizont y = 120, Brennweite 331: Punkt in d Metern und h Metern Höhe:
   y = 120 + (3,1 − h)·331/d, x = 180 + s·331/d. Das Tor steht 132 m weit
   (2,5 Einheiten je Meter), die Rikscha 14 m, der Tisch 3–4 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "peking", titel: "Peking und die Große Mauer", emoji: "🐉", thema: "Länder", kuerzel: "pek", fassung: 854, breite: 400, hoehe: 260 });
/* Verläufe nur einmal anlegen, auch wenn sie in Schleifen gebraucht werden */
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* Wortmarke: Teile, die in Bildkoordinaten gezeichnet sind, bekommen ihren Ankerpunkt */
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1420);
const r = B.r;
const HOR = 120, E = 3.1, F = 331, CX = 180;
const yAt = (d, h = 0) => HOR + (E - h) * F / d;
const uAt = (d) => F / d;
const xAt = (s, d) => CX + s * F / d;
const P = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";
/* Vieleck am Bildrand abschneiden (x ≤ 400, y ≤ 260), damit nichts aus dem Bild ragt */
const kappen = (pts, xm = 400, ym = 260) => {
  const schnitt = (poly, innen, kreuz) => { const out = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]; if (innen(a)) { out.push(a); if (!innen(b)) out.push(kreuz(a, b)); } else if (innen(b)) out.push(kreuz(a, b)); }); return out; };
  let q = schnitt(pts, (a) => a[0] <= xm, (a, b) => [xm, a[1] + (b[1] - a[1]) * (xm - a[0]) / (b[0] - a[0])]);
  q = schnitt(q, (a) => a[1] <= ym, (a, b) => [a[0] + (b[0] - a[0]) * (ym - a[1]) / (b[1] - a[1]), ym]);
  return P(q);
};
const linieKappen = (x1, y1, x2, y2, xm = 400) => { if (x2 > xm) { y2 = y1 + (y2 - y1) * (xm - x1) / (x2 - x1); x2 = xm; } return `x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}"`; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("weich2")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
/* Buschwald: zwei Muster mit unregelmäßig verteilten Büschen und verschiedener Kachelgröße — so wiederholt sich nichts sichtbar */
for (const [name, w, h, n, versatz] of [["busch", 31, 23, 34, 0], ["busch2", 23, 17, 20, 7]]) {
  const zr = zufall(77 + w);
  let m = "";
  for (let i = 0; i < n; i++) {
    const x = zr() * w, y = zr() * h, s = 0.7 + zr() * 0.7, f = zr(), c = f < 0.55 ? ["#4f6146", "#6a7a52"] : f < 0.75 ? ["#7e4a32", "#a0603a"] : f < 0.9 ? ["#8a7438", "#b0944a"] : ["#56664a", "#7a8a52"];
    for (const [dx, dy] of [[0, 0], [w, 0], [0, h], [w, h], [-w, 0], [0, -h], [-w, -h], [w, -h], [-w, h]]) {
      const X = x + dx, Y = y + dy; if (X < -2 || X > w + 2 || Y < -2 || Y > h + 2) continue;
      m += `<circle cx="${r(X + 0.4 * s)}" cy="${r(Y + 0.5 * s)}" r="${r(1.2 * s)}" fill="#2f3a30" opacity=".4"/><circle cx="${r(X)}" cy="${r(Y)}" r="${r(1.1 * s)}" fill="${c[0]}"/><circle cx="${r(X - 0.8 * s)}" cy="${r(Y + 0.3 * s)}" r="${r(0.8 * s)}" fill="${c[0]}"/><circle cx="${r(X - 0.3 * s)}" cy="${r(Y - 0.4 * s)}" r="${r(0.55 * s)}" fill="${c[1]}"/>`;
    }
  }
  S.def(`<pattern id="${S.id(name)}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="translate(${versatz} ${versatz / 2})">${m}</pattern>`);
}
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".5"/></filter>`);
/* gelbe Glasurziegel: Rinnen und Kappen im Wechsel */
S.def(`<pattern id="${S.id("ziegel")}" width="1.6" height="4" patternUnits="userSpaceOnUse"><rect width="1.6" height="4" fill="#e7ad1f"/><rect x="1.05" width=".55" height="4" fill="#b57a0c"/><rect x=".2" width=".35" height="4" fill="#f7d36a" opacity=".8"/></pattern>`);
S.def(`<pattern id="${S.id("grauziegel")}" width="2.4" height="5" patternUnits="userSpaceOnUse"><rect width="2.4" height="5" fill="#6d7075"/><rect x="1.5" width=".9" height="5" fill="#4a4d52"/><rect x=".3" width=".5" height="5" fill="#8b8e93" opacity=".8"/></pattern>`);
S.def(`<pattern id="${S.id("platten")}" width="14" height="7" patternUnits="userSpaceOnUse"><rect width="14" height="7" fill="#b9b4aa"/><path d="M0 .2 H14 M.2 0 V7 M7.2 0 V7" stroke="#9c978d" stroke-width=".35"/></pattern>`);
S.def(`<pattern id="${S.id("dielen")}" width="400" height="6" patternUnits="userSpaceOnUse"><rect width="400" height="6" fill="#8a5a34"/><rect width="400" height=".5" fill="#6a4226"/></pattern>`);
const ROT = S.lg("rot", [[0, "#c2402e"], [1, "#a2301f"]]);
const ROT_S = S.lg("rots", [[0, "#b0261c"], [1, "#8c1c14"]], 0, 0, 1, 0);
const GELB = S.lg("gelb", [[0, "#f6c443"], [0.6, "#e3a51d"], [1, "#b97d0e"]]);
const MARMOR = S.lg("marmor", [[0, "#f6f4ee"], [1, "#d7d3c8"]]);
const MARMOR_V = S.lg("marmorv", [[0, "#cfcabd"], [0.35, "#f6f4ee"], [0.7, "#e9e6dd"], [1, "#bdb8aa"]], 0, 0, 1, 0);
const GRUENBLAU = S.lg("dougong", [[0, "#2f8a7e"], [0.5, "#1f6d8a"], [1, "#2a5f7a"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.45, "#e9bd3c"], [1, "#9a6b0c"]], 0, 0, 1, 1);
const LACK = S.lg("lack", [[0, "#7a2a1c"], [1, "#4e1810"]]);

/* =====================================================================
   KULISSE — Herbsthimmel, ferne Berge, Straße, Gehweg
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.lg("himmel", [[0, "#2f6fbf"], [0.45, "#79acdf"], [0.85, "#cfe0ea"], [1, "#e9e6da"]])}"/>`);
S.hinten(`<circle cx="40" cy="140" r="150" fill="${S.rg("sonnenlicht", [[0, "#fff4d8", 0.35], [1, "#fff4d8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[210, 18, 1], [300, 34, 0.7], [150, 44, 0.5]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".8">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 4], [-11, 1.5, 11, 3.2], [12, 1, 12, 3.6], [-3, -3, 9, 3.8]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
/* fernste Kette der Yanshan-Berge im Dunst */
S.hinten(`<path d="M0 78 Q40 66 80 74 Q120 62 160 70 Q200 60 240 68 Q290 58 330 66 Q370 60 400 64 L400 122 L0 122 Z" fill="${S.lg("fernberg", [[0, "#a8b6c9"], [1, "#c9d3dc"]])}"/>`);

/* =====================================================================
   1 — DIE BERGE und 2 — DIE GROSSE MAUER (Lupe: Wachturm, Zinne, Treppe)
   ===================================================================== */
const KAMM_L = [[0, 70.5], [6, 66], [11, 63], [16, 64], [22, 55], [28, 49], [33, 44], [38, 38], [43, 34.5], [47, 34], [51, 36], [56, 41], [61, 47], [66, 50], [70, 54], [74, 56.5], [80, 59], [86, 63], [92, 66], [98, 70], [106, 76], [116, 82], [128, 90]];
const KAMM_R = [[248, 94], [258, 90], [266, 86], [272, 82], [278, 78.5], [285, 76], [292, 71], [299, 66], [306, 62.5], [312, 60], [318, 58.5], [324, 60], [330, 63], [337, 67], [343, 69], [349, 68], [356, 65.5], [363, 62], [370, 60.5], [377, 62], [384, 63.5], [392, 66], [400, 69]];
/* geglätteter Kamm als Punktfolge (quadratische Bögen durch die Mittelpunkte) */
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
    const x0 = pts[0][0], x1 = pts[pts.length - 1][0], umriss = `${linie(pts, 0.8)} L${x1} 122 L${x0} 122 Z`;
    k += `<path d="${umriss}" fill="${S.lg("berg", [[0, "#5f6f6a"], [0.45, "#6f7e72"], [1, "#9aa59b"]])}"/>`;
    /* Licht von links (Südwesten) */
    k += `<path d="${umriss}" fill="${S.lg("berglicht", [[0, "#fff3d6", 0.18], [0.5, "#fff3d6", 0], [1, "#1d2a3a", 0.12]], 0, 0, 1, 0)}"/>`;
    /* Buschwald als Muster, darüber weiche Herbstflecken (rot: Perückenstrauch, gold: Ahorn) */
    k += `<path d="${umriss}" fill="url(#${S.id("busch")})" opacity=".7"/><path d="${umriss}" fill="url(#${S.id("busch2")})" opacity=".55"/>`;
    for (let i = 0; i < 10; i++) {
      const x = x0 + 6 + rnd() * (x1 - x0 - 12), top = kammY(pts, x), y = top + 8 + rnd() * (110 - top - 8);
      k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(5 + rnd() * 7)}" ry="${r(2.5 + rnd() * 3)}" fill="${["#b0563a", "#c88a3a", "#a0482e", "#d0a040"][i % 4]}" opacity=".38" filter="url(#${S.id("weich2")})"/>`;
    }
    /* Grate und Rinnen: weiche Licht- und Schattenbahnen */
    for (let i = 6; i < pts.length - 6; i += 6) {
      const [x, y] = pts[i];
      k += `<path d="M${r(x)} ${r(y + 1.5)} Q${r(x - 4)} ${r(y + 16)} ${r(x - 12)} ${r(y + 40)}" stroke="#2f3d38" stroke-width="3" opacity=".22" fill="none" filter="url(#${S.id("weich2")})"/>`;
      k += `<path d="M${r(x + 2)} ${r(y + 1.5)} Q${r(x + 4)} ${r(y + 16)} ${r(x + 10)} ${r(y + 40)}" stroke="#f3ead2" stroke-width="2" opacity=".18" fill="none" filter="url(#${S.id("weich2")})"/>`;
    }
    /* Felsen am Kamm */
    for (let i = 0; i < 10; i++) {
      const x = x0 + 6 + rnd() * (x1 - x0 - 12), y = kammY(pts, x) + 5 + rnd() * 9, w = 1.2 + rnd() * 1.6;
      k += `<path d="M${r(x - w)} ${r(y + 0.8)} Q${r(x - w * 0.8)} ${r(y - w * 0.5)} ${r(x - w * 0.2)} ${r(y - w * 0.7)} Q${r(x + w * 0.6)} ${r(y - w * 0.6)} ${r(x + w)} ${r(y + 0.8)} Z" fill="#8f9086"/><path d="M${r(x - w * 0.8)} ${r(y + 0.2)} Q${r(x - w * 0.6)} ${r(y - w * 0.4)} ${r(x - w * 0.1)} ${r(y - w * 0.6)}" stroke="#c9c8bc" stroke-width=".3" fill="none"/>`;
    }
    k += `<path d="${umriss}" fill="${S.lg("bergdunst", [[0, "#dfe7ee", 0.08], [0.6, "#dfe7ee", 0.3], [1, "#e9e6da", 0.7]])}"/>`;
  }
  S.teil({ anker: [24, 96], id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 0, y: 0, kunst: k,
    tipp: "Im Norden von Peking liegen die Yanshan-Berge. Auf ihren Kämmen läuft die Große Mauer." });
}
const mauerUnter = [];
{
  let k = "";
  /* Mauerkörper: Seitenfläche aus Ziegeln, oben der Wehrgang, außen die Zinnen */
  const mauer = (pts) => {
    const unten = pts.map(([x, y]) => [x, y + 3]).reverse();
    let g = `<path d="${linie(pts, 0.4)} ${unten.map(([x, y]) => "L" + r(x) + " " + r(y)).join(" ")} Z" fill="${S.lg("mauerseite", [[0, "#b5a88c"], [1, "#857a64"]])}"/>`;
    /* Ziegelfugen */
    for (let i = 1; i < pts.length; i++) { const [xa, ya] = pts[i - 1], [xb, yb] = pts[i]; for (const dy of [1.3, 2.2]) g += `<path d="M${r(xa + (i % 2) * 0.4)} ${r(ya + dy)} L${r(xb)} ${r(yb + dy)}" stroke="#7d725e" stroke-width=".12" stroke-dasharray=".9 .3"/>`; }
    /* Wehrgang und innere Brüstung */
    g += `<path d="${linie(pts, 0.1)}" stroke="#ddd2b8" stroke-width=".8" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="${linie(pts, 0.65)}" stroke="#968a72" stroke-width=".35" fill="none"/>`;
    /* Zinnen auf der Außenseite mit Scharten */
    let lauf = 0;
    for (let i = 1; i < pts.length; i++) {
      const [xa, ya] = pts[i - 1], [xb, yb] = pts[i], l = Math.hypot(xb - xa, yb - ya);
      for (let t = (1.6 - lauf % 1.6) / l; t < 1; t += 1.6 / l) { const x = xa + (xb - xa) * t, y = ya + (yb - ya) * t; g += `<rect x="${r(x - 0.4)}" y="${r(y - 1.2)}" width=".8" height="1.3" fill="#c9bda2"/><rect x="${r(x - 0.4)}" y="${r(y - 1.2)}" width=".25" height="1.3" fill="#e6dcc4"/>`; }
      lauf += l;
    }
    return g;
  };
  k += mauer(KL) + mauer(KR);
  /* steile Treppe zwischen x 20 und 40: Stufenkanten quer über den Wehrgang */
  for (let x = 21; x < 40; x += 1.1) { const y = kammY(KL, x); k += `<line x1="${r(x - 0.5)}" y1="${r(y + 0.05)}" x2="${r(x + 0.4)}" y2="${r(y + 0.05)}" stroke="#6f6553" stroke-width=".2"/>`; }
  /* Wachtürme: quadratische „Mini-Festungen“, zwei Geschosse, Bogenfenster */
  const turm = (x, y, s = 1) => {
    const w = 6 * s, h = 6.4 * s, t = 1.8 * s;
    let g = `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2)} ${r(y - h)} L${r(x + w / 2)} ${r(y - h)} L${r(x + w / 2)} ${r(y)} Z" fill="${S.lg("turm", [[0, "#d6cbb2"], [1, "#b3a68b"]])}"/>`;
    g += `<path d="M${r(x + w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y - h)} L${r(x + w / 2 + t)} ${r(y - h - 0.8 * s)} L${r(x + w / 2 + t)} ${r(y - 0.8 * s)} Z" fill="#8a7f69"/>`;
    g += `<path d="M${r(x - w / 2)} ${r(y - h)} L${r(x - w / 2 + t)} ${r(y - h - 0.8 * s)} L${r(x + w / 2 + t)} ${r(y - h - 0.8 * s)} L${r(x + w / 2)} ${r(y - h)} Z" fill="#a39780"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${r(x - w / 2 + 0.15 + i * w / 5)}" y="${r(y - h - 1.1 * s)}" width="${r(w / 9)}" height="${r(1.1 * s)}" fill="#cfc3a8"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${r(x + w / 2 + 0.3 * s + i * 0.55 * s)}" y="${r(y - h - 1.6 * s - i * 0.1)}" width="${r(0.35 * s)}" height="${r(1 * s)}" fill="#9a8e77"/>`;
    /* Ziegelreihen, Gesims zwischen den Geschossen */
    for (let j = 1; j < 6; j++) g += `<line x1="${r(x - w / 2)}" y1="${r(y - j * h / 6)}" x2="${r(x + w / 2)}" y2="${r(y - j * h / 6)}" stroke="#9a8e77" stroke-width=".1"/>`;
    g += `<rect x="${r(x - w / 2 - 0.2 * s)}" y="${r(y - 3.4 * s)}" width="${r(w + 0.4 * s)}" height="${r(0.4 * s)}" fill="#a39780"/>`;
    for (let i = 0; i < 3; i++) {
      const fx = x - w / 2 + w * (0.2 + i * 0.3);
      for (const [yb, hh] of [[y - 0.9 * s, 1.9], [y - 4 * s, 1.5]]) g += `<path d="M${r(fx - 0.42 * s)} ${r(yb)} L${r(fx - 0.42 * s)} ${r(yb - hh * s)} Q${r(fx)} ${r(yb - (hh + 0.6) * s)} ${r(fx + 0.42 * s)} ${r(yb - hh * s)} L${r(fx + 0.42 * s)} ${r(yb)} Z" fill="#3b342b"/>`;
    }
    g += `<rect x="${r(x - w / 2)}" y="${r(y - h)}" width="${r(0.6 * s)}" height="${r(h)}" fill="#fff4dc" opacity=".35"/>`;
    return g;
  };
  const tuerme = [[10, KL, 0.75], [46, KL, 1.05], [73, KL, 0.8], [98, KL, 0.7], [278, KR, 0.6], [318, KR, 0.8], [356, KR, 0.7], [384, KR, 0.65]];
  for (const [x, pts, s] of tuerme) k += turm(x, kammY(pts, x) + 2.4, s);
  mauerUnter.push({ id: "wachturm", de: "der Wachturm", syl: "WACH-turm", it: "la torre di guardia", itSyl: "TOR-re di GUAR-dia", en: "watchtower", x: 46, y: r(kammY(KL, 46) + 2.4), kunst: flaeche(-3.6, -8.6, 9.6, 9.2),
    tipp: "Im Wachturm wohnten Soldaten. Bei Gefahr machten sie Rauch- und Feuerzeichen." });
  mauerUnter.push({ id: "zinne", de: "die Zinne", syl: "ZIN-ne", it: "il merlo", itSyl: "MER-lo", en: "battlement", x: 62, y: r(kammY(KL, 62) + 1.5), kunst: flaeche(-9, -6, 15, 7),
    tipp: "Hinter den Zinnen konnten sich die Soldaten schützen. Durch die Scharten schossen sie." });
  mauerUnter.push({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "stairs", x: 30, y: r(kammY(KL, 30) + 2), kunst: flaeche(-9, -9, 15, 11),
    tipp: "Wo der Berg sehr steil ist, wird die Mauer zur Treppe." });
  S.teil({ anker: [52, 46], id: "grosse_mauer", de: "die Große Mauer", syl: "GRO-ße MAU-er", it: "la Grande Muraglia", itSyl: "GRAN-de mu-RA-glia", en: "Great Wall", x: 0, y: 0, kunst: k,
    zoom: { x: 0, y: 24, w: 96, h: 64 }, unter: mauerUnter,
    tipp: "Die Große Mauer (auch Chinesische Mauer) ist mit allen Teilen über 20 000 km lang." });
}

/* =====================================================================
   3 — DER DRACHEN (Pekinger Schwalbendrachen) am Himmel
   ===================================================================== */
{
  let k = `<path d="M3 9 Q-20 30 -60 72 Q-80 88 -104 84" stroke="#f4f1ea" stroke-width=".25" fill="none" opacity=".85"/>`;
  /* Schwalbe: breite Flügel, Gabelschwanz, bemalter Körper */
  const fl = (s) => `<path d="M0 -2 Q${8 * s} -9 ${15 * s} -6 Q${13 * s} -2 ${12 * s} 1 Q${7 * s} 0 ${2 * s} 3 Z" fill="#fbf6ea" stroke="#1d1d1d" stroke-width=".35"/>
    <path d="M${3 * s} -3 Q${8 * s} -7 ${13 * s} -5.4" stroke="#c0392b" stroke-width=".9" fill="none"/><path d="M${4 * s} -.4 Q${8 * s} -3 ${11.4 * s} -1.6" stroke="#1f5f9a" stroke-width=".6" fill="none"/>
    <circle cx="${9 * s}" cy="-3.4" r="1.1" fill="#e2b33a"/>`;
  k += fl(1) + fl(-1);
  k += `<path d="M-2 2 L-4.6 11 L-1 6.4 L0 7.6 L1 6.4 L4.6 11 L2 2 Z" fill="#fbf6ea" stroke="#1d1d1d" stroke-width=".35"/><path d="M-3 9 L-1 5 M3 9 L1 5" stroke="#c0392b" stroke-width=".5"/>`;
  k += `<ellipse cx="0" cy="-1.2" rx="2.6" ry="4" fill="#fbf6ea" stroke="#1d1d1d" stroke-width=".35"/><path d="M-2.2 -3 Q0 -5.6 2.2 -3 Q0 -4 -2.2 -3 Z" fill="#1d1d1d"/><circle cx="-1.1" cy="-1.6" r=".7" fill="#1d1d1d"/><circle cx="1.1" cy="-1.6" r=".7" fill="#1d1d1d"/><circle cx="-1.1" cy="-1.6" r=".22" fill="#fff"/><circle cx="1.1" cy="-1.6" r=".22" fill="#fff"/><path d="M-1.6 .8 L0 2.2 L1.6 .8" stroke="#c0392b" stroke-width=".5" fill="none"/><path d="M0 -4.6 v-1.4" stroke="#1d1d1d" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "drachen", de: "der Drachen", syl: "DRA-chen", it: "l'aquilone", itSyl: "a-qui-LO-ne", en: "kite", x: 132, y: 24, kunst: `<g transform="scale(.85)">${k}</g>` + flaeche(-14, -8.6, 27, 19),
    tipp: "Der Schwalbendrachen ist der typische Drachen aus Peking. Im Herbst fliegen viele im Park." });
}

/* =====================================================================
   4 — DIE PALASTMAUER (rote Mauer der Kaiserstadt) mit Bäumen dahinter
   ===================================================================== */
const TOR_D = 132, TU = uAt(TOR_D);          /* 2,51 je Meter */
const TOR_Y = yAt(TOR_D);                    /* 127,8 */
const ty = (h) => yAt(TOR_D, h);
{
  let k = "";
  /* alte Zypressen (dunkel, säulenförmig), Schnurbäume und goldene Ginkgos hinter der Mauer */
  const baum = (x, y, w, h, f1, f2) => {
    let g = `<path d="M${r(x - w)} ${r(y)} Q${r(x - w * 1.1)} ${r(y - h * 0.6)} ${r(x - w * 0.5)} ${r(y - h * 0.9)} Q${r(x)} ${r(y - h * 1.08)} ${r(x + w * 0.5)} ${r(y - h * 0.9)} Q${r(x + w * 1.1)} ${r(y - h * 0.6)} ${r(x + w)} ${r(y)} Z" fill="${f1}"/>`;
    for (let i = 0; i < 7; i++) g += `<ellipse cx="${r(x - w * 0.7 + rnd() * w * 1.4)}" cy="${r(y - h * (0.3 + rnd() * 0.6))}" rx="${r(w * 0.3)}" ry="${r(h * 0.12)}" fill="${f2}" opacity=".7"/>`;
    return g + `<path d="M${r(x - w * 0.8)} ${r(y - h * 0.5)} Q${r(x - w * 0.6)} ${r(y - h * 0.85)} ${r(x - w * 0.2)} ${r(y - h * 0.95)}" stroke="#fff3d0" stroke-width=".6" opacity=".25" fill="none"/>`;
  };
  for (const [x0, x1] of [[4, 32], [332, 392]]) {
    for (let x = x0; x < x1; x += 7 + rnd() * 4) {
      const art = rnd(), y = ty(7) + 1;
      if (art < 0.45) k += baum(x, y, 3.2, 26 + rnd() * 6, "#2f4a32", "#3d5c3c");          /* Zypresse */
      else if (art < 0.75) k += baum(x, y, 7, 17 + rnd() * 5, "#4f6a3e", "#6a8448");         /* Schnurbaum */
      else k += baum(x, y, 6, 16 + rnd() * 5, "#c99a2e", "#e6bf4a");                          /* Ginkgo im Herbst */
    }
  }
  const mauer = (x0, x1) => {
    let g = `<rect x="${x0}" y="${r(ty(7))}" width="${x1 - x0}" height="${r(TOR_Y - ty(7))}" fill="${ROT}"/>`;
    g += `<rect x="${x0}" y="${r(ty(7) - 2.4)}" width="${x1 - x0}" height="2.6" fill="url(#${S.id("ziegel")})"/><rect x="${x0}" y="${r(ty(7) - 2.8)}" width="${x1 - x0}" height=".7" fill="#c98e12"/><rect x="${x0}" y="${r(ty(7) + 0.1)}" width="${x1 - x0}" height=".9" fill="#5a1a10" opacity=".35"/>`;
    g += `<rect x="${x0}" y="${r(TOR_Y - 2)}" width="${x1 - x0}" height="2" fill="#d9d4c8"/>`;
    return g;
  };
  k += mauer(-2, 32) + mauer(328, 402);
  S.teil({ anker: [16, 118], id: "palastmauer", de: "die Palastmauer", syl: "pa-LAST-mau-er", it: "il muro del palazzo", itSyl: "MU-ro del pa-LAZ-zo", en: "palace wall", x: 0, y: 0, kunst: k,
    tipp: "Die roten Mauern mit gelben Ziegeln umgaben einst die Kaiserstadt." });
}

/* =====================================================================
   5 — DAS TOR DES HIMMLISCHEN FRIEDENS (Tian'anmen)
       Lupe: Dachfigur, Dachziegel, Palastlaterne, Säule, Geländer
   ===================================================================== */
const torUnter = [];
const BAU = { podL: -150, podR: 150, hPod: 13, sauleL: -71, sauleR: 71, joch: 142 / 9 };
{
  const X = (m) => CX + m;     /* m: Einheiten vom Mittelpunkt */
  let k = "";
  /* ---- Torbau (roter Sockel) mit leichter Böschung ---- */
  const yTop = ty(BAU.hPod), yFuss = ty(1.2);
  k += `<path d="M${X(-151)} ${r(TOR_Y)} L${X(-148)} ${r(yTop)} L${X(148)} ${r(yTop)} L${X(151)} ${r(TOR_Y)} Z" fill="${ROT}"/>`;
  k += `<path d="M${X(-151)} ${r(TOR_Y)} L${X(-148)} ${r(yTop)} L${X(148)} ${r(yTop)} L${X(151)} ${r(TOR_Y)} Z" fill="${S.lg("podlicht", [[0, "#fff1d6", 0.16], [0.5, "#fff1d6", 0.04], [1, "#2a0a06", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Putzflecken */
  for (let i = 0; i < 40; i++) k += `<rect x="${r(X(-146 + rnd() * 292))}" y="${r(yTop + 2 + rnd() * (yFuss - yTop - 4))}" width="${r(1 + rnd() * 3)}" height=".5" fill="#8e2618" opacity=".25"/>`;
  /* weißer Marmorfuß (Xumizuo) mit Profilen */
  k += `<rect x="${X(-152)}" y="${r(yFuss)}" width="304" height="${r(TOR_Y - yFuss)}" fill="${MARMOR}"/>`;
  k += `<rect x="${X(-152)}" y="${r(yFuss + 0.9)}" width="304" height=".5" fill="#b9b4a6"/><rect x="${X(-152)}" y="${r(TOR_Y - 0.6)}" width="304" height=".6" fill="#a9a497"/>`;
  /* fünf Torbögen: Mitte groß, dann kleiner */
  const boegen = [[0, 5.6, 8.2], [-40, 4.4, 7], [40, 4.4, 7], [-75, 3.6, 6], [75, 3.6, 6]];
  for (const [m, b, h] of boegen) {
    const w = b * TU / 2, yb = ty(h), ys = ty(h - b / 2);
    k += `<path d="M${r(X(m) - w - 0.9)} ${r(yFuss)} L${r(X(m) - w - 0.9)} ${r(ys)} A${r(w + 0.9)} ${r(w + 0.9)} 0 0 1 ${r(X(m) + w + 0.9)} ${r(ys)} L${r(X(m) + w + 0.9)} ${r(yFuss)} Z" fill="#8c2316"/>`;
    k += `<path d="M${r(X(m) - w)} ${r(yFuss)} L${r(X(m) - w)} ${r(ys)} A${r(w)} ${r(w)} 0 0 1 ${r(X(m) + w)} ${r(ys)} L${r(X(m) + w)} ${r(yFuss)} Z" fill="${S.lg("tunnel", [[0, "#1d120c"], [1, "#3a241a"]])}"/>`;
    /* Licht am anderen Ende des Durchgangs (Nordseite) */
    k += `<path d="M${r(X(m) - w * 0.42)} ${r(yFuss)} L${r(X(m) - w * 0.42)} ${r(ys + w * 0.35)} A${r(w * 0.42)} ${r(w * 0.42)} 0 0 1 ${r(X(m) + w * 0.42)} ${r(ys + w * 0.35)} L${r(X(m) + w * 0.42)} ${r(yFuss)} Z" fill="#d9c9a2" opacity=".55"/>`;
    /* offene rote Torflügel mit goldenen Nägeln */
    for (const sd of [-1, 1]) {
      const xa = X(m) + sd * w, xb = X(m) + sd * w * 0.62;
      k += `<path d="M${r(xa)} ${r(yFuss)} L${r(xa)} ${r(ys)} L${r(xb)} ${r(ys + 1.4)} L${r(xb)} ${r(yFuss)} Z" fill="#9a2418"/>`;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) k += `<circle cx="${r(xa + (xb - xa) * (0.3 + j * 0.4))}" cy="${r(ys + 2 + i * (yFuss - ys - 3) / 4)}" r=".28" fill="#e8c35a"/>`;
    }
  }
  /* Porträt über dem Mitteltor (nur angedeutet) und die zwei Spruchbänder */
  const pT = ty(12.4), pB = ty(7.9), pw = 3.8 * TU / 2;
  k += `<rect x="${r(X(0) - pw - 0.6)}" y="${r(pT - 0.6)}" width="${r(2 * pw + 1.2)}" height="${r(pB - pT + 1.2)}" fill="#6b5a2a"/><rect x="${r(X(0) - pw)}" y="${r(pT)}" width="${r(2 * pw)}" height="${r(pB - pT)}" fill="${S.lg("bildgrund", [[0, "#cfd6cf"], [1, "#a9b4ab"]])}"/>`;
  k += `<path d="M${r(X(0) - pw + 0.6)} ${r(pB)} Q${r(X(0) - pw + 1)} ${r(pB - 3.6)} ${X(0)} ${r(pB - 4)} Q${r(X(0) + pw - 1)} ${r(pB - 3.6)} ${r(X(0) + pw - 0.6)} ${r(pB)} Z" fill="#59605f"/><ellipse cx="${X(0)}" cy="${r(pT + 3.6)}" rx="1.9" ry="2.4" fill="#d9b48f"/><path d="M${X(0) - 2} ${r(pT + 2.6)} Q${X(0)} ${r(pT + 0.4)} ${X(0) + 2} ${r(pT + 2.6)}" fill="#2b2b2b"/>`;
  for (const [sd, txt] of [[-1, "中华人民共和国万岁"], [1, "世界人民大团结万岁"]]) {
    k += `<text x="${r(X(sd * 79))}" y="${r(ty(9.9))}" font-size="4.2" text-anchor="middle" fill="#fbf3dc" font-family="'Noto Sans CJK SC','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif" font-weight="bold" letter-spacing=".5">${txt}</text>`;
  }
  /* weißes Marmorgeländer oben am Torbau */
  const gT = ty(BAU.hPod + 1.2);
  k += `<rect x="${X(-148)}" y="${r(gT)}" width="296" height="${r(yTop - gT)}" fill="${MARMOR}"/>`;
  for (let m = -147; m <= 147; m += 3.4) k += `<rect x="${r(X(m) - 0.35)}" y="${r(gT - 0.7)}" width=".7" height="${r(yTop - gT + 0.7)}" fill="#c9c4b6"/><circle cx="${r(X(m))}" cy="${r(gT - 0.8)}" r=".4" fill="#ece9e1"/>`;
  k += `<rect x="${X(-148)}" y="${r(gT + 1.2)}" width="296" height=".35" fill="#bdb8aa"/>`;
  /* ---- Torturm: Säulenhalle, Laternen, Doppeldach ---- */
  const yStufe = ty(13.6), ySk = ty(19.8), yTrauf1 = ty(20.4), yWand2 = ty(24), yTrauf2 = ty(27), yGrat = ty(30.6), yFirst = ty(33.5), yChi = ty(34.7);
  /* Stylobat */
  k += `<rect x="${X(-80)}" y="${r(yStufe)}" width="160" height="${r(gT - yStufe + 0.3)}" fill="#ddd8cc"/>`;
  /* Rückwand mit Gittertüren im Schatten */
  k += `<rect x="${X(-71)}" y="${r(ySk)}" width="142" height="${r(yStufe - ySk)}" fill="${S.lg("halle", [[0, "#4a1810"], [1, "#7a2a1a"]])}"/>`;
  for (let i = 0; i < 9; i++) {
    const x0 = X(-71 + i * BAU.joch) + 1.6, w = BAU.joch - 3.2;
    k += `<rect x="${r(x0)}" y="${r(ySk + 3.8)}" width="${r(w)}" height="${r(yStufe - ySk - 4.4)}" fill="#8f2a1a"/>`;
    for (let j = 1; j < 4; j++) k += `<line x1="${r(x0 + j * w / 4)}" y1="${r(ySk + 3.8)}" x2="${r(x0 + j * w / 4)}" y2="${r(yStufe - 0.6)}" stroke="#c99a4a" stroke-width=".22" opacity=".8"/>`;
    k += `<path d="M${r(x0)} ${r(ySk + 6)} H${r(x0 + w)} M${r(x0)} ${r(ySk + 8.6)} H${r(x0 + w)}" stroke="#c99a4a" stroke-width=".2" opacity=".7"/>`;
  }
  /* zehn rote Säulen */
  for (let i = 0; i <= 9; i++) {
    const x = X(-71 + i * BAU.joch);
    k += `<rect x="${r(x - 1)}" y="${r(ySk)}" width="2" height="${r(yStufe - ySk)}" fill="${ROT_S}"/><rect x="${r(x - 1)}" y="${r(ySk)}" width=".5" height="${r(yStufe - ySk)}" fill="#e2735a" opacity=".6"/>`;
  }
  /* Architrav mit Bemalung, darüber die blau-grünen Konsolen (Dougong) */
  k += `<rect x="${X(-73)}" y="${r(ySk - 1.6)}" width="146" height="1.8" fill="${GRUENBLAU}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(X(-71 + i * BAU.joch) + 4)} ${r(ySk - 0.7)} h${r(BAU.joch - 8)}" stroke="#f2d27a" stroke-width=".35"/>`;
  for (let m = -74; m <= 74; m += 2.3) k += `<rect x="${r(X(m) - 0.7)}" y="${r(yTrauf1 + 0.2)}" width="1.4" height="${r(ySk - 1.6 - yTrauf1 - 0.2)}" fill="${m % 4.6 < 2.3 ? "#2f8a7e" : "#1f5f8a"}"/>`;
  /* acht Palastlaternen (Mitteljoch frei) */
  const laterne = (x, y, s = 1) => `<line x1="${r(x)}" y1="${r(ySk)}" x2="${r(x)}" y2="${r(y - 3.6 * s)}" stroke="#3a2a1a" stroke-width=".25"/><rect x="${r(x - 1.6 * s)}" y="${r(y - 3.9 * s)}" width="${r(3.2 * s)}" height="${r(0.7 * s)}" fill="${GOLD}"/>
    <ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(3.1 * s)}" ry="${r(3.4 * s)}" fill="${S.rg("laterne", [[0, "#ff6a4a"], [0.55, "#e0251a"], [1, "#9a0f0a"]], 0.42, 0.38, 0.7)}"/>
    <path d="M${r(x - 1.6 * s)} ${r(y - 3.1 * s)} Q${r(x - 2.4 * s)} ${r(y)} ${r(x - 1.6 * s)} ${r(y + 3.1 * s)} M${r(x + 1.6 * s)} ${r(y - 3.1 * s)} Q${r(x + 2.4 * s)} ${r(y)} ${r(x + 1.6 * s)} ${r(y + 3.1 * s)}" stroke="#a8140c" stroke-width=".25" fill="none"/>
    <rect x="${r(x - 1.6 * s)}" y="${r(y + 3.2 * s)}" width="${r(3.2 * s)}" height="${r(0.7 * s)}" fill="${GOLD}"/><path d="M${r(x - 1.2 * s)} ${r(y + 3.9 * s)} L${r(x - 1.4 * s)} ${r(y + 6.4 * s)} L${r(x + 1.4 * s)} ${r(y + 6.4 * s)} L${r(x + 1.2 * s)} ${r(y + 3.9 * s)} Z" fill="#f2c23a"/>`;
  const latY = r((ySk + yStufe) / 2 - 2);
  for (let i = 0; i < 9; i++) if (i !== 4) k += laterne(X(-71 + (i + 0.5) * BAU.joch), latY, 0.95);
  /* untere Traufe (Walm) mit hochgezogenen Ecken */
  const dach = (yE, yO, wE, wO, hoch) => {
    const d = `M${X(-wE - 2)} ${r(yE - hoch)} Q${X(-wE + 6)} ${r(yE + 0.6)} ${X(-wE + 16)} ${r(yE)} L${X(wE - 16)} ${r(yE)} Q${X(wE - 6)} ${r(yE + 0.6)} ${X(wE + 2)} ${r(yE - hoch)} L${X(wO)} ${r(yO)} L${X(-wO)} ${r(yO)} Z`;
    let g = `<path d="${d}" fill="url(#${S.id("ziegel")})"/><path d="${d}" fill="${S.lg("dachlicht", [[0, "#fff6c8", 0.25], [0.5, "#fff6c8", 0], [1, "#5a3a00", 0.25]])}"/>`;
    /* Traufkante: runde Ziegelenden, darunter rot-grün bemalte Sparren */
    g += `<path d="M${X(-wE - 2)} ${r(yE - hoch)} Q${X(-wE + 6)} ${r(yE + 0.6)} ${X(-wE + 16)} ${r(yE)} L${X(wE - 16)} ${r(yE)} Q${X(wE - 6)} ${r(yE + 0.6)} ${X(wE + 2)} ${r(yE - hoch)}" stroke="#a86c08" stroke-width=".9" fill="none"/>`;
    for (let m = -wE + 14; m <= wE - 14; m += 1.6) g += `<circle cx="${r(X(m))}" cy="${r(yE + 0.2)}" r=".42" fill="#f3c64a"/>`;
    g += `<path d="M${X(-wE + 14)} ${r(yE + 1.1)} H${X(wE - 14)}" stroke="#1f6d8a" stroke-width=".7"/><path d="M${X(-wE + 14)} ${r(yE + 1.7)} H${X(wE - 14)}" stroke="#b0261c" stroke-width=".5"/>`;
    return g;
  };
  /* Obergeschoss: rote Wand, Fenster, Konsolen */
  k += `<rect x="${X(-71)}" y="${r(yTrauf2)}" width="142" height="${r(yWand2 - yTrauf2)}" fill="${S.lg("wand2", [[0, "#5a1a10"], [1, "#9a2a1a"]])}"/>`;
  for (let i = 0; i < 9; i++) { const x0 = X(-71 + i * BAU.joch) + 2.2; k += `<rect x="${r(x0)}" y="${r(yTrauf2 + 3)}" width="${r(BAU.joch - 4.4)}" height="${r(yWand2 - yTrauf2 - 3.4)}" fill="#a83020"/><path d="M${r(x0)} ${r(yTrauf2 + 4.6)} h${r(BAU.joch - 4.4)}" stroke="#c99a4a" stroke-width=".2"/>`; }
  for (let m = -72; m <= 72; m += 2.3) k += `<rect x="${r(X(m) - 0.7)}" y="${r(yTrauf2 + 0.2)}" width="1.4" height="2.6" fill="${m % 4.6 < 2.3 ? "#2f8a7e" : "#1f5f8a"}"/>`;
  k += dach(yTrauf1, yWand2, 87, 71, 2.6);
  /* oberes Dach: Walmteil, dann Giebelteil bis zum First */
  const dO = `M${X(-89)} ${r(yTrauf2 - 2.8)} Q${X(-81)} ${r(yTrauf2 + 0.6)} ${X(-71)} ${r(yTrauf2)} L${X(71)} ${r(yTrauf2)} Q${X(81)} ${r(yTrauf2 + 0.6)} ${X(89)} ${r(yTrauf2 - 2.8)} L${X(62)} ${r(yGrat)} L${X(57)} ${r(yFirst)} L${X(-57)} ${r(yFirst)} L${X(-62)} ${r(yGrat)} Z`;
  k += `<path d="${dO}" fill="url(#${S.id("ziegel")})"/><path d="${dO}" fill="${S.lg("dachlicht", [])}"/>`;
  k += `<path d="M${X(-89)} ${r(yTrauf2 - 2.8)} Q${X(-81)} ${r(yTrauf2 + 0.6)} ${X(-71)} ${r(yTrauf2)} L${X(71)} ${r(yTrauf2)} Q${X(81)} ${r(yTrauf2 + 0.6)} ${X(89)} ${r(yTrauf2 - 2.8)}" stroke="#a86c08" stroke-width=".9" fill="none"/>`;
  for (let m = -70; m <= 70; m += 1.6) k += `<circle cx="${r(X(m))}" cy="${r(yTrauf2 + 0.2)}" r=".42" fill="#f3c64a"/>`;
  /* Grate (Walm) und Giebelkanten */
  for (const sd of [-1, 1]) {
    k += `<path d="M${X(sd * 88)} ${r(yTrauf2 - 2.6)} L${X(sd * 62)} ${r(yGrat)} L${X(sd * 57)} ${r(yFirst)}" stroke="#c88a10" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M${X(sd * 86)} ${r(yTrauf1 - 2.4)} L${X(sd * 72)} ${r(yWand2 + 0.4)}" stroke="#c88a10" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    /* Dachfiguren: der Reiter auf dem Phönix vorn, dahinter die Tiere */
    for (const [ax, ay, bx, by] of [[88, yTrauf2 - 2.6, 62, yGrat], [86, yTrauf1 - 2.4, 72, yWand2 + 0.4]]) {
      for (let i = 0; i < 9; i++) {
        const t = 0.06 + i * 0.075, fx = X(sd * (ax + (bx - ax) * t)), fy = ay + (by - ay) * t;
        k += i === 0 ? `<path d="M${r(fx - 0.5)} ${r(fy - 0.4)} q.5 -1.8 1 0 Z" fill="#3a6e4a"/><circle cx="${r(fx)}" cy="${r(fy - 1.6)}" r=".3" fill="#e8c35a"/>`
          : `<path d="M${r(fx - 0.45)} ${r(fy - 0.3)} q.1 -1.2 .45 -1.1 q.4 .1 .45 1.1 Z" fill="${i % 2 ? "#d9a21e" : "#b98510"}"/>`;
      }
    }
  }
  /* First mit Drachenköpfen (Chiwen) */
  k += `<rect x="${X(-57)}" y="${r(yFirst - 1.4)}" width="114" height="1.6" rx=".4" fill="#c88a10"/><rect x="${X(-57)}" y="${r(yFirst - 1.4)}" width="114" height=".5" fill="#f6d36a"/>`;
  for (const sd of [-1, 1]) k += `<path d="M${X(sd * 57)} ${r(yFirst)} L${X(sd * 57)} ${r(yChi + 0.4)} Q${X(sd * 57.8)} ${r(yChi - 1.4)} ${X(sd * 59.4)} ${r(yChi - 0.6)} Q${X(sd * 60.2)} ${r(yChi + 0.8)} ${X(sd * 59.2)} ${r(yChi + 1.2)} Q${X(sd * 60.6)} ${r(yFirst - 0.6)} ${X(sd * 58.8)} ${r(yFirst)} Z" fill="#c88a10" stroke="#8a5a06" stroke-width=".25"/>`;
  /* Schatten unter den Traufen */
  k += `<rect x="${X(-71)}" y="${r(yTrauf1 + 2)}" width="142" height="2.4" fill="#000" opacity=".18"/>`;
  S.teil({ anker: [180, 62], id: "tor", de: "das Tor des Himmlischen Friedens", syl: "TOR des HIMM-li-schen FRIE-dens", it: "la Porta della Pace Celeste", itSyl: "POR-ta del-la PA-ce ce-LE-ste", en: "Gate of Heavenly Peace", x: 0, y: 0, kunst: k,
    zoom: { x: 92, y: 38, w: 96, h: 64 }, unter: torUnter,
    tipp: "Auf Chinesisch heißt das Tor „Tian'anmen“. Es ist 35 Meter hoch und führt zur Verbotenen Stadt." });
  /* Lupe */
  torUnter.push({ id: "dachfigur", de: "die Dachfigur", syl: "DACH-fi-gur", it: "la statuetta del tetto", itSyl: "sta-tu-ET-ta del TET-to", en: "roof figure", x: X(-82), y: r(yTrauf2 - 2), kunst: flaeche(-5, -7, 12, 8),
    tipp: "Auf dem Grat sitzen kleine Tiere hinter einem Reiter. Je mehr Tiere, desto wichtiger das Gebäude." });
  torUnter.push({ id: "dachziegel", de: "der Dachziegel", syl: "DACH-zie-gel", it: "la tegola", itSyl: "TE-go-la", en: "roof tile", x: X(-30), y: r(yTrauf2 - 1), kunst: flaeche(-16, -14, 32, 13),
    tipp: "Gelb glasierte Ziegel durfte nur der Kaiser benutzen." });
  torUnter.push({ id: "palastlaterne", de: "die Palastlaterne", syl: "pa-LAST-la-ter-ne", it: "la lanterna di palazzo", itSyl: "lan-TER-na di pa-LAZ-zo", en: "palace lantern", x: X(-71 + 2.5 * BAU.joch), y: latY + 6.5, kunst: flaeche(-4, -11, 8, 12.5),
    tipp: "Acht große rote Laternen hängen am Tor — seit 1949." });
}
/* DER TORBOGEN — der große Mitteldurchgang (eigenes Teil, liegt im Torbau) */
{
  const w = 5.6 * TU / 2, ys = ty(8.2 - 2.8), yF = ty(1.2);
  S.teil({ oben: true, id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co del-la POR-ta", en: "archway", x: CX, y: r(yF), kunst: flaeche(-w, -(yF - ys) - w, 2 * w, yF - ys + w),
    tipp: "Durch das mittlere, größte Tor durfte früher nur der Kaiser gehen." });
}

/* =====================================================================
   6 — DIE BRÜCKE (Goldwasserbrücken), 7 — DIE MARMORSÄULE (Huabiao),
   8 — DER LÖWE
   ===================================================================== */
{
  const d = 118, u = uAt(d), yD = yAt(d, 0.4);
  let k = "";
  /* Flussbett: Ufermauer mit weißem Geländer über die ganze Breite */
  k += `<rect x="-2" y="${r(yAt(d, 0.9))}" width="404" height="${r(yAt(d - 6, 0) - yAt(d, 0.9))}" fill="${S.lg("ufer", [[0, "#cfc9bb"], [1, "#a9a393"]])}"/>`;
  k += `<rect x="-2" y="${r(yAt(d - 6, 0.9))}" width="404" height=".7" fill="#ece9e1"/>`;
  for (let x = 0; x < 402; x += 2.6) k += `<rect x="${r(x)}" y="${r(yAt(d - 6, 0.9) - 0.4)}" width=".5" height="1.6" fill="#e3e0d6"/>`;
  /* fünf Brücken: flache Buckel mit Brüstung */
  for (const [m, b] of [[0, 14], [-40, 9], [40, 9], [-75, 8], [75, 8]]) {
    const w = b * u / 2, x = CX + m * TU / u * (u / TU), cx = CX + m * (u / TU);
    k += `<path d="M${r(cx - w - 1.4)} ${r(yD + 1.2)} Q${r(cx)} ${r(yD - 2.6)} ${r(cx + w + 1.4)} ${r(yD + 1.2)} L${r(cx + w + 1.4)} ${r(yD + 2.6)} Q${r(cx)} ${r(yD - 0.8)} ${r(cx - w - 1.4)} ${r(yD + 2.6)} Z" fill="${MARMOR}"/>`;
    k += `<path d="M${r(cx - w - 1.4)} ${r(yD + 1.2)} Q${r(cx)} ${r(yD - 2.6)} ${r(cx + w + 1.4)} ${r(yD + 1.2)}" stroke="#fffdf6" stroke-width=".5" fill="none"/>`;
    for (let i = 0; i <= 6; i++) { const t = i / 6, px = cx - w - 1.4 + t * (2 * w + 2.8), py = yD + 1.2 - Math.sin(t * Math.PI) * 1.9; k += `<rect x="${r(px - 0.3)}" y="${r(py - 1.1)}" width=".6" height="1.2" fill="#e9e6dd"/>`; }
    void x;
  }
  S.teil({ anker: [CX, 125], id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Vor dem Tor führen weiße Marmorbrücken über den „Goldwasserfluss“." });
}
{
  /* zwei Huabiao: Sockel mit Gitter, Schaft mit Drachen, Wolkenplatte, Tier obenauf */
  const d = 106, u = uAt(d);
  let k = "";
  for (const s of [-17, 17]) {
    const x = xAt(s, d), y0 = yAt(d), h = (m) => yAt(d, m);
    k += schatten(x + 2, y0, 6, 0.9, 0.25);
    k += `<rect x="${r(x - 3.4)}" y="${r(h(1.2))}" width="6.8" height="${r(y0 - h(1.2))}" fill="${MARMOR}"/><rect x="${r(x - 3.4)}" y="${r(h(1.2))}" width="6.8" height=".5" fill="#fffdf6"/>`;
    for (let i = 0; i < 6; i++) k += `<rect x="${r(x - 3.2 + i * 1.3)}" y="${r(h(1.2) - 1.1)}" width=".35" height="1.2" fill="#e9e6dd"/>`;
    k += `<rect x="${r(x - 3.4)}" y="${r(h(1.2) - 1.3)}" width="6.8" height=".35" fill="#e9e6dd"/>`;
    k += `<path d="M${r(x - 2.2)} ${r(h(1.2))} L${r(x - 1.8)} ${r(h(2.2))} L${r(x + 1.8)} ${r(h(2.2))} L${r(x + 2.2)} ${r(h(1.2))} Z" fill="#dcd8cc"/>`;
    k += `<rect x="${r(x - 1.25)}" y="${r(h(8.2))}" width="2.5" height="${r(h(2.2) - h(8.2))}" fill="${MARMOR_V}"/>`;
    /* der Drache windet sich um den Schaft */
    for (let i = 0; i < 7; i++) { const yy = h(2.6 + i * 0.8); k += `<path d="M${r(x - 1.25)} ${r(yy + 0.8)} Q${r(x)} ${r(yy - 0.3)} ${r(x + 1.25)} ${r(yy - 0.6)}" stroke="#b9b4a6" stroke-width=".35" fill="none"/>`; }
    k += `<circle cx="${r(x + 0.6)}" cy="${r(h(7.6))}" r=".5" fill="#c9c4b6"/>`;
    /* Wolkenplatte schräg durch den Schaft */
    k += `<path d="M${r(x - 4.2)} ${r(h(7.2))} Q${r(x - 3)} ${r(h(7.9))} ${r(x)} ${r(h(7.4))} Q${r(x + 3)} ${r(h(7.0))} ${r(x + 4.2)} ${r(h(7.6))} L${r(x + 3.8)} ${r(h(7.1))} Q${r(x)} ${r(h(6.8))} ${r(x - 3.8)} ${r(h(6.7))} Z" fill="#efece4" stroke="#bdb8aa" stroke-width=".2"/>`;
    /* Tauteller und das sitzende Tier (Hou) */
    k += `<ellipse cx="${r(x)}" cy="${r(h(8.4))}" rx="2.2" ry=".55" fill="#e3e0d6"/><rect x="${r(x - 1.6)}" y="${r(h(8.9))}" width="3.2" height="${r(h(8.4) - h(8.9))}" fill="#d7d3c8"/>`;
    k += `<path d="M${r(x - 1.1)} ${r(h(8.9))} Q${r(x - 1.3)} ${r(h(9.5))} ${r(x - 0.4)} ${r(h(9.6))} Q${r(x + 0.6)} ${r(h(9.9))} ${r(x + 0.9)} ${r(h(9.4))} L${r(x + 1)} ${r(h(8.9))} Z" fill="#efece4"/>`;
    k += `<rect x="${r(x - 1.25)}" y="${r(h(8.2))}" width=".45" height="${r(h(2.2) - h(8.2))}" fill="#fff" opacity=".45"/>`;
  }
  S.teil({ anker: [xAt(-17, d), yAt(d, 5)], id: "marmorsaeule", de: "die Marmorsäule", syl: "MAR-mor-säu-le", it: "la colonna di marmo", itSyl: "co-LON-na di MAR-mo", en: "marble column", x: 0, y: 0, kunst: k,
    tipp: "Diese Säulen heißen Huabiao. Um jede windet sich ein Drache aus Marmor." });
}
{
  const d = 110;
  let k = "";
  for (const [s, sp] of [[-11, 1], [11, -1]]) {
    const x = xAt(s, d), y0 = yAt(d), h = (m) => yAt(d, m);
    k += `<path d="M${r(x - 3)} ${r(y0)} L${r(x - 3)} ${r(h(0.5))} L${r(x - 2.5)} ${r(h(0.6))} L${r(x - 2.5)} ${r(h(1.3))} L${r(x - 3)} ${r(h(1.45))} L${r(x + 3)} ${r(h(1.45))} L${r(x + 2.5)} ${r(h(1.3))} L${r(x + 2.5)} ${r(h(0.6))} L${r(x + 3)} ${r(h(0.5))} L${r(x + 3)} ${r(y0)} Z" fill="${MARMOR}"/>`;
    /* sitzender Löwe mit Lockenmähne, Pfote auf Ball bzw. Jungem */
    k += `<path d="M${r(x - 1.8 * sp)} ${r(h(1.45))} L${r(x - 1.9 * sp)} ${r(h(2.4))} Q${r(x - 1.6 * sp)} ${r(h(3.3))} ${r(x - 0.2 * sp)} ${r(h(3.5))} Q${r(x + 1.6 * sp)} ${r(h(3.6))} ${r(x + 1.6 * sp)} ${r(h(2.7))} L${r(x + 1.4 * sp)} ${r(h(1.45))} Z" fill="#b8b2a2"/>`;
    for (let i = 0; i < 6; i++) k += `<circle cx="${r(x + (-0.8 + (i % 3) * 0.8) * sp)}" cy="${r(h(3.2 - Math.floor(i / 3) * 0.45))}" r=".38" fill="#a49d8c"/>`;
    k += `<circle cx="${r(x + 1.2 * sp)}" cy="${r(h(1.7))}" r=".55" fill="#a49d8c"/>`;
  }
  S.teil({ anker: [xAt(-11, d), yAt(d, 2.4)], id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: 0, y: 0, kunst: k,
    tipp: "Steinlöwen bewachen das Tor: links die Löwin mit dem Jungen, rechts der Löwe mit dem Ball." });
}

/* =====================================================================
   9 — DIE STRASSE (Chang'an-Straße) und der Gehweg
   ===================================================================== */
{
  const y0 = yAt(104), y1 = yAt(20);
  let k = `<rect x="-2" y="${r(y0)}" width="404" height="${r(y1 - y0)}" fill="${S.lg("asphalt", [[0, "#8a8783"], [1, "#5d5b58"]])}"/>`;
  /* Gehweg auf der Nordseite */
  k += `<rect x="-2" y="${r(yAt(110))}" width="404" height="${r(y0 - yAt(110))}" fill="#bdb7ab"/>`;
  /* Fahrspuren: weiße Striche, in der Mitte die gelbe Doppellinie */
  for (const d of [92, 78, 66, 48, 40, 33, 27]) { const y = yAt(d), u = uAt(d); for (let x = -4 + (d % 3) * 3; x < 404; x += 6 * u) k += `<rect x="${r(x)}" y="${r(y)}" width="${r(2.6 * u)}" height="${r(Math.max(0.25, 0.15 * u))}" fill="#f2f0ea" opacity=".85"/>`; }
  for (const dd of [56, 55]) k += `<rect x="-2" y="${r(yAt(dd))}" width="404" height=".45" fill="#e2b33a"/>`;
  /* Bordstein auf unserer Seite */
  k += `<rect x="-2" y="${r(y1 - 0.4)}" width="404" height="1.6" fill="#d9d4c8"/>`;
  S.hinten(k);
}
/* Gehweg (Kulisse): Granitplatten in Fluchtperspektive, links der Terrassenkante */
const KANTE = (y) => 180 - 0.3125 * (y - HOR);     /* Terrassenkante s = −0,5 m auf Dielenhöhe */
{
  const y1 = yAt(20) + 1.2;
  let f = `<path d="M-2 ${r(y1)} L${r(KANTE(y1))} ${r(y1)} L${r(KANTE(262))} 262 L-2 262 Z" fill="${S.lg("gehweg", [[0, "#c4beb2"], [1, "#a9a397"]])}"/>`;
  for (const d of [17, 14.5, 12.5, 10.8, 9.4, 8.2, 7.2, 6.4]) { const y = yAt(d); f += `<line x1="-2" y1="${r(y)}" x2="${r(KANTE(y) + 1)}" y2="${r(y)}" stroke="#8f897d" stroke-width="${r(0.25 + 3 / d)}" opacity=".6"/>`; }
  for (let s = -12; s <= 0; s += 1) { const xa = xAt(s, 20), xb = xAt(s, 6); f += `<line x1="${r(xa)}" y1="${r(y1)}" x2="${r(xb)}" y2="${r(yAt(6))}" stroke="#8f897d" stroke-width=".35" opacity=".5"/>`; }
  for (let i = 0; i < 50; i++) { const y = y1 + 2 + rnd() * (262 - y1); f += `<circle cx="${r(rnd() * KANTE(y))}" cy="${r(y)}" r="${r(0.2 + (y - HOR) * 0.004)}" fill="#7d776b" opacity=".35"/>`; }
  S.hinten(f);
}

/* =====================================================================
   9b — DIE CHRYSANTHEME: Blumenkübel zum Nationalfeiertag (vorne links)
   ===================================================================== */
{
  const d = 8, u = uAt(d), Y = yAt(d);    /* 41 je Meter */
  const W = 1.1 * u, H = 0.5 * u;
  let k = schatten(4, 0.5, W / 2 + 6, 2.4, 0.3);
  k += `<path d="M${r(-W / 2)} 0 L${r(-W / 2 - 1.2)} ${r(-H)} L${r(W / 2 + 1.2)} ${r(-H)} L${r(W / 2)} 0 Z" fill="${S.lg("kuebel", [[0, "#d9d4c8"], [0.5, "#c4beb0"], [1, "#9c968a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-W / 2 - 2)}" y="${r(-H - 2)}" width="${r(W + 4)}" height="2.6" rx=".6" fill="#e3ded2"/>`;
  k += `<path d="M${r(-W / 2 + 4)} ${r(-H + 6)} h${r(W - 8)} M${r(-W / 2 + 4)} ${r(-H + 12)} h${r(W - 8)}" stroke="#a9a397" stroke-width=".4"/>`;
  /* Blütenhügel: gelbe und rote Chrysanthemen mit Blättern */
  k += `<path d="M${r(-W / 2 - 1)} ${r(-H - 1.6)} Q${r(-W / 2)} ${r(-H - 13)} 0 ${r(-H - 15)} Q${r(W / 2)} ${r(-H - 13)} ${r(W / 2 + 1)} ${r(-H - 1.6)} Z" fill="#3f6a32"/>`;
  /* Chrysanthemen als Rosetten (eine Blüte, oft wiederverwendet) */
  for (const [n, a, b] of [["chg", "#f6c21e", "#d99a0c"], ["chr", "#d8302a", "#a01a14"]]) {
    let bl = `<circle r="1.7" fill="${b}"/>`;
    for (let i = 0; i < 12; i++) { const w = i * Math.PI / 6; bl += `<ellipse cx="${r(Math.cos(w) * 1.05)}" cy="${r(Math.sin(w) * 1.05)}" rx=".75" ry=".32" fill="${a}" transform="rotate(${Math.round(w * 180 / Math.PI)} ${r(Math.cos(w) * 1.05)} ${r(Math.sin(w) * 1.05)})"/>`; }
    bl += `<circle r=".55" fill="${b}"/><circle r=".28" fill="#7a4a08"/>`;
    S.def(`<g id="${S.id(n)}">${bl}</g>`);
  }
  for (let i = 0; i < 95; i++) {
    const t = rnd() * 2 - 1, x = t * (W / 2 - 1.2), y = -H - 2.2 - Math.sqrt(rnd()) * (12.4 * (1 - t * t) + 0.4), sc = 0.8 + rnd() * 0.35;
    k += `<use href="#${S.id(rnd() < 0.62 ? "chg" : "chr")}" transform="translate(${r(x)} ${r(y)}) scale(${r(sc * 100) / 100} ${r(sc * 88) / 100})"/>`;
  }
  S.teil({ id: "chrysantheme", de: "die Chrysantheme", syl: "chry-san-THE-me", it: "il crisantemo", itSyl: "cri-SAN-te-mo", en: "chrysanthemum", x: 20, y: Y, steht: true, kunst: k,
    tipp: "Zum Nationalfeiertag am 1. Oktober schmücken Peking Tausende Chrysanthemen – in China eine Blume des Herbstes." });
}

/* =====================================================================
   10 — DIE RIKSCHA und 11 — DER RIKSCHAFAHRER (auf dem Gehweg links)
   ===================================================================== */
const RI = { d: 10.5, x: 100 };
{
  const u = uAt(RI.d), Y = yAt(RI.d);   /* 23,6 je Meter */
  const m = (v) => r(v * u);
  let k = `<ellipse cx="8" cy=".5" rx="44" ry="3" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
  const rad = (cx, cy, rr) => {
    let g = `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#1d1d1d" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="${r(rr - 0.9)}" fill="none" stroke="#9aa3aa" stroke-width=".35"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<line x1="${cx}" y1="${cy}" x2="${r(cx + Math.cos(a) * (rr - 0.8))}" y2="${r(cy + Math.sin(a) * (rr - 0.8))}" stroke="#c9cfd4" stroke-width=".18"/>`; }
    return g + `<circle cx="${cx}" cy="${cy}" r=".8" fill="#6b7178"/>`;
  };
  const RR = m(0.33);
  k += rad(m(0.66), r(-RR - 1.2), RR);
  /* Fahrrad vorn: Gabel, Lenker (nach hinten geschwungen), Rahmen, Tretlager, Kette */
  const FR = [-1.45, -0.33], HK = [-1.36, -1.02], GR = [-0.8, -1.3], SA = [-0.46, -0.9], TL = [-0.98, -0.4];
  const M = ([x, y]) => `${m(x)} ${m(y)}`;
  k += `<path d="M${M(TL)} L${m(0.66)} ${r(-RR)}" stroke="#4a4d52" stroke-width=".45" fill="none"/>`;
  k += `<path d="M${M(FR)} L${M(HK)} M${M(HK)} L${M(SA)} M${M(HK)} L${M(TL)} M${M(SA)} L${M(TL)} M${M(TL)} L${m(0.04)} ${m(-0.36)}" stroke="#2a2d33" stroke-width=".95" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  k += `<path d="M${M(HK)} Q${m(-1.32)} ${m(-1.28)} ${M(GR)}" stroke="#2a2d33" stroke-width=".8" fill="none"/><path d="M${m(-0.86)} ${m(-1.3)} h${m(0.12)}" stroke="#1d1d1d" stroke-width="1.5" stroke-linecap="round"/>`;
  k += `<path d="M${m(-0.58)} ${m(-0.95)} q${m(0.12)} ${m(-0.05)} ${m(0.26)} 0 q0 ${m(0.06)} ${m(-0.26)} ${m(0.04)} Z" fill="#1d1d1d"/>`;
  k += `<circle cx="${m(TL[0])}" cy="${m(TL[1])}" r="${m(0.12)}" fill="none" stroke="#5a5e64" stroke-width=".5"/><path d="M${M(TL)} L${m(-0.98)} ${m(-0.57)}" stroke="#2a2d33" stroke-width=".6"/><rect x="${r(m(-0.98) - 1.6)}" y="${r(m(-0.57) - 0.5)}" width="3.2" height="1" fill="#1d1d1d"/>`;
  k += rad(m(FR[0]), r(-RR), RR);
  /* Wagenkasten: roter Lack mit Goldleiste, Sitzbank */
  k += `<path d="M${m(0.02)} ${m(-0.34)} L${m(0.02)} ${m(-0.86)} Q${m(0.06)} ${m(-0.96)} ${m(0.2)} ${m(-0.96)} L${m(0.96)} ${m(-0.96)} L${m(1.06)} ${m(-0.4)} L${m(0.86)} ${m(-0.34)} Z" fill="${S.lg("rikscha", [[0, "#d23a2a"], [1, "#8c1a12"]])}"/>`;
  k += `<path d="M${m(0.06)} ${m(-0.9)} L${m(0.94)} ${m(-0.9)}" stroke="#e8c35a" stroke-width=".6"/><path d="M${m(0.12)} ${m(-0.5)} L${m(0.9)} ${m(-0.5)}" stroke="#e8c35a" stroke-width=".4"/>`;
  k += `<path d="M${m(0.3)} ${m(-0.8)} q2 -1.6 4 0 q2 1.6 4 0" stroke="#e8c35a" stroke-width=".35" fill="none"/>`;
  k += `<rect x="${m(0.12)}" y="${m(-1.08)}" width="${m(0.78)}" height="${m(0.14)}" rx="1" fill="#2a2a2a"/>`;
  k += `<path d="M${m(0.86)} ${m(-0.96)} L${m(0.98)} ${m(-1.5)} L${m(0.8)} ${m(-1.52)} L${m(0.74)} ${m(-1.08)} Z" fill="#7a1a10"/>`;
  k += `<path d="M${m(1.0)} ${m(-1.0)} Q${m(1.1)} ${m(-1.86)} ${m(0.62)} ${m(-1.96)} Q${m(0.2)} ${m(-1.98)} ${m(0.1)} ${m(-1.72)} L${m(0.16)} ${m(-1.62)} Q${m(0.32)} ${m(-1.8)} ${m(0.6)} ${m(-1.78)} Q${m(0.94)} ${m(-1.7)} ${m(0.9)} ${m(-1.0)} Z" fill="${S.lg("verdeck", [[0, "#c8301f"], [1, "#7a1208"]])}"/>`;
  for (const t of [0.3, 0.55, 0.8]) k += `<path d="M${m(0.1 + t * 0.9)} ${m(-1.96 + t * 0.1)} L${m(0.08 + t * 0.85)} ${m(-1.1)}" stroke="#5a0e06" stroke-width=".3" opacity=".6"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${r(m(0.14) + i * 1.2)}" y1="${m(-1.66)}" x2="${r(m(0.14) + i * 1.2)}" y2="${r(m(-1.66) + 1.6)}" stroke="#f2c23a" stroke-width=".45"/>`;
  k += rad(m(0.7), r(-RR), RR);
  k += `<line x1="${m(1.02)}" y1="${m(-1.4)}" x2="${m(1.08)}" y2="${m(-2.3)}" stroke="#555" stroke-width=".3"/><rect x="${m(1.08)}" y="${m(-2.3)}" width="4" height="2.6" fill="#de2910"/><circle cx="${r(m(1.08) + 1)}" cy="${r(m(-2.3) + 0.9)}" r=".45" fill="#ffde00"/>`;
  S.teil({ id: "rikscha", de: "die Rikscha", syl: "RIK-scha", it: "il risciò", itSyl: "ri-SCIÒ", en: "rickshaw", x: RI.x, y: Y, steht: true, kunst: k,
    tipp: "Mit der Fahrradrikscha fahren Besucher durch die alten Gassen, die Hutongs." });
}
{
  const u = uAt(RI.d), Y = yAt(RI.d);
  const fahrer = B.mensch({ id: "pek_fahrer", geschlecht: "m", pose: "lesen", blick: -90, frisur: "kurz", haarfarbe: "schwarz", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, jacke: { stueck: "weste", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.72 * u);
  const sx = -0.44 * u - fahrer.z.sitz.x * fahrer.k, sy = -0.97 * u - fahrer.z.sitz.y * fahrer.k;
  S.teil({ id: "fahrer", de: "der Rikschafahrer", syl: "RIK-scha-fah-rer", it: "il conducente del risciò", itSyl: "con-du-CEN-te del ri-SCIÒ", en: "rickshaw driver", x: RI.x, y: Y, kunst: `<g transform="translate(${r(sx)} ${r(sy)})">${fahrer.svg}</g>`,
    tipp: "Der Fahrer tritt in die Pedale und zieht den Wagen mit zwei Gästen." });
}

/* =====================================================================
   12 — DIE TERRASSE des Restaurants (rechts): Dielen, Steinkante, Geländer
   ===================================================================== */
{
  const yv = yAt(9, 1.5), boden = kappen([[KANTE(yv), yv], [400, yv], [400, 260], [KANTE(260), 260]]);
  let k = `<path d="${boden}" fill="${S.lg("dielen", [[0, "#7a4a28"], [1, "#a06a3c"]])}"/>`;
  for (let i = 1; i <= 26; i++) { const s = -0.5 + i * 0.24; if (xAt(s, 9) < 400) k += `<line ${linieKappen(xAt(s, 9), yv, CX + s * (260 - HOR) / 1.6, 260)} stroke="#5e3a1e" stroke-width="${r(0.3 + i * 0.012)}" opacity=".55"/>`; }
  for (const d of [7.6, 6.1, 4.9]) { const y = yAt(d, 1.5); for (let s = -0.5 + (d % 1) * 0.5; xAt(s + 0.24, d) < 400; s += 0.96) k += `<line x1="${r(xAt(s, d))}" y1="${r(y)}" x2="${r(xAt(s + 0.24, d))}" y2="${r(y)}" stroke="#4a2a14" stroke-width=".35" opacity=".6"/>`; }
  /* Lichtfleck der Nachmittagssonne */
  k += `<path d="${boden}" fill="${S.lg("dielenlicht", [[0, "#ffe2a8", 0.18], [0.6, "#ffe2a8", 0], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Steinkante (Granit) entlang der Terrasse */
  const kp = (s, y) => 180 + s * (y - HOR) / 1.6;
  k += `<path d="M${r(kp(-0.5, yv))} ${r(yv)} L${r(kp(-0.22, yv))} ${r(yv)} L${r(kp(-0.22, 260))} 260 L${r(kp(-0.5, 260))} 260 Z" fill="${S.lg("granit", [[0, "#d6d0c4"], [1, "#b3ad9f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(kp(-0.5, yv))} ${r(yv)} L${r(kp(-0.5, 260))} 260" stroke="#f2eee4" stroke-width=".8"/><path d="M${r(kp(-0.22, yv))} ${r(yv)} L${r(kp(-0.22, 260))} 260" stroke="#7a5a3a" stroke-width=".5"/>`;
  /* vorderes Geländer (d = 9, 0,85 m hoch): rote Pfosten, Handlauf, Rautengitter */
  const d = 9, yO = yAt(d, 2.35), yU = yv, x0 = xAt(-0.5, d), w = 0.9 * uAt(d);
  k += `<rect x="${r(x0)}" y="${r(yU - 2.6)}" width="${r(402 - x0)}" height="1.2" fill="${ROT_S}"/>`;
  for (let s = -0.5; xAt(s, d) < 404; s += 0.9) {
    const x = xAt(s, d);
    for (let j = 0; j < 3; j++) { const a = x + 1.2 + j * (w - 2.4) / 3, b = a + (w - 2.4) / 3; if (b > 400) break; const ym = (yO + yU - 2.6) / 2, hh = (yU - 2.6 - yO) / 2 - 1; k += `<path d="M${r(a)} ${r(ym)} L${r((a + b) / 2)} ${r(ym - hh)} L${r(b)} ${r(ym)} L${r((a + b) / 2)} ${r(ym + hh)} Z" fill="none" stroke="#9a2418" stroke-width=".7"/>`; }
    k += `<rect x="${r(x - 1.2)}" y="${r(yO - 1.4)}" width="2.4" height="${r(yU - yO + 1.4)}" fill="${ROT_S}"/><rect x="${r(x - 1.5)}" y="${r(yO - 2.2)}" width="3" height="1" fill="#e8c35a"/>`;
  }
  k += `<rect x="${r(x0)}" y="${r(yO)}" width="${r(400 - x0)}" height="1.8" fill="${ROT_S}"/><rect x="${r(x0)}" y="${r(yO)}" width="${r(400 - x0)}" height=".55" fill="#e2735a" opacity=".7"/>`;
  S.teil({ anker: [250, 196], id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k,
    tipp: "Von der Terrasse des Restaurants sieht man auf das Tor des Himmlischen Friedens." });
}
{
  /* Säule rechts und das Dach mit Ziegeln, bemalten Sparren und Balken */
  const d = 8.6, x = xAt(5.6, d);
  let k = `<rect x="${r(Math.min(x, 393) - 7)}" y="16" width="14" height="${r(yAt(d, 1.5) - 16)}" fill="${S.lg("saeule", [[0, "#7a160e"], [0.3, "#c43a26"], [0.55, "#a8281a"], [1, "#5a0e08"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(Math.min(x, 393) - 8)}" y="${r(yAt(d, 1.5) - 3)}" width="15" height="3" fill="#5a5a55"/>`;
  k += `<rect x="262" y="12" width="138" height="10" fill="${GRUENBLAU}"/><rect x="262" y="12" width="138" height="1.2" fill="#e8c35a"/><rect x="262" y="20.6" width="138" height="1.4" fill="#b0261c"/>`;
  for (const cx of [300, 352]) k += `<ellipse cx="${cx}" cy="16.8" rx="14" ry="3.6" fill="#f3ead6"/><path d="M${cx - 9} 16.8 q4.5 -2.8 9 0 q4.5 2.8 9 0" stroke="#3a6e8a" stroke-width=".6" fill="none"/><circle cx="${cx}" cy="16.8" r="1.4" fill="#c0392b"/>`;
  for (let xx = 266; xx < 396; xx += 6) k += `<path d="M${xx} 13.6 l2 1.6 l-2 1.6" stroke="#f2d27a" stroke-width=".4" fill="none"/>`;
  for (let xx = 258; xx < 397; xx += 4) k += `<rect x="${xx}" y="7.4" width="3" height="4.6" fill="#1f5f8a"/><circle cx="${xx + 1.5}" cy="9.4" r=".9" fill="#f6f2e6"/>`;
  k += `<path d="M250 2 Q256 7.6 266 7.4 L400 7.4 L400 0 L250 0 Z" fill="url(#${S.id("grauziegel")})"/>`;
  k += `<path d="M250 2 Q256 7.6 266 7.4 L400 7.4" stroke="#3e4146" stroke-width="1.2" fill="none"/>`;
  for (let xx = 266; xx < 399; xx += 2.4) k += `<circle cx="${xx}" cy="7.4" r="1" fill="#55585e"/>`;
  k += `<path d="M247 .6 Q250 3 254 2.4" stroke="#3e4146" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="262" y="22" width="138" height="3" fill="#000" opacity=".12"/>`;
  S.teil({ anker: [330, 14], id: "restaurant", de: "das Restaurant", syl: "res-tau-RANT", it: "il ristorante", itSyl: "ri-sto-RAN-te", en: "restaurant", x: 0, y: 0, kunst: k,
    tipp: "Pekingente gibt es in Peking seit über 600 Jahren — am bekanntesten am Qianmen." });
}
{
  let k = "";
  for (const [x, s] of [[300, 1], [354, 0.92]]) {
    const y = 40;
    k += `<line x1="${x}" y1="22" x2="${x}" y2="${r(y - 13 * s)}" stroke="#2a1a10" stroke-width=".5"/>`;
    k += `<rect x="${r(x - 6 * s)}" y="${r(y - 14 * s)}" width="${r(12 * s)}" height="${r(2.4 * s)}" rx=".6" fill="${LACK}"/><rect x="${r(x - 6 * s)}" y="${r(y + 11.6 * s)}" width="${r(12 * s)}" height="${r(2.4 * s)}" rx=".6" fill="${LACK}"/>`;
    k += `<ellipse cx="${x}" cy="${y}" rx="${r(11 * s)}" ry="${r(12.2 * s)}" fill="${S.rg("laterne2", [[0, "#ff8a5a"], [0.5, "#e2301e"], [1, "#9a120a"]], 0.4, 0.38, 0.7)}"/>`;
    for (const f of [-0.75, -0.42, 0, 0.42, 0.75]) k += `<path d="M${r(x + f * 6 * s)} ${r(y - 11.8 * s)} Q${r(x + f * 13 * s)} ${y} ${r(x + f * 6 * s)} ${r(y + 11.8 * s)}" stroke="#a8140c" stroke-width=".45" fill="none"/>`;
    k += `<text x="${x}" y="${r(y + 3 * s)}" font-size="${r(8 * s)}" text-anchor="middle" fill="#f6d36a" font-family="serif" font-weight="bold">福</text>`;
    k += `<path d="M${r(x - 3 * s)} ${r(y + 14 * s)} L${r(x - 3.6 * s)} ${r(y + 24 * s)} L${r(x + 3.6 * s)} ${r(y + 24 * s)} L${r(x + 3 * s)} ${r(y + 14 * s)} Z" fill="#f2c23a"/>`;
    for (let i = 0; i < 6; i++) k += `<line x1="${r(x - 3 * s + i * 1.2 * s)}" y1="${r(y + 16 * s)}" x2="${r(x - 3.4 * s + i * 1.36 * s)}" y2="${r(y + 24 * s)}" stroke="#c99a1a" stroke-width=".25"/>`;
    k += `<ellipse cx="${r(x - 4 * s)}" cy="${r(y - 5 * s)}" rx="${r(2.6 * s)}" ry="${r(4 * s)}" fill="#fff" opacity=".18"/>`;
  }
  S.teil({ oben: true, id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "lantern", x: 0, y: 0, anker: [300, 40], kunst: k,
    tipp: "Rote Laternen bringen Glück. Das Zeichen 福 heißt „Glück“." });
}

/* ---------- der Tisch (Baxian-Tisch aus rotbraunem Lack), ganz nah ---------- */
const TI = { s0: 0.32, s1: 1.62, d0: 2.02, d1: 2.95, h: 2.25 };
const tp = (s, d, h = TI.h) => [xAt(s, d), yAt(d, h)];
const sk = (d) => uAt(d) / 100;        /* Zeichenmaßstab der Dinge auf dem Tisch */
{
  const [a, b, c, e] = [tp(TI.s0, TI.d1), tp(TI.s1, TI.d1), tp(TI.s1, TI.d0), tp(TI.s0, TI.d0)];
  /* Schatten des Tisches auf den Dielen */
  let k = `<path d="${kappen([[a[0] + 10, yAt(TI.d1, 1.5) - 2], [b[0] + 30, yAt(TI.d1, 1.5) - 2], [c[0] + 60, 262], [e[0] + 20, 262]])}" fill="#1b120a" opacity=".22" filter="url(#bw_weich)"/>`;
  k += `<path d="M${r(a[0] + 3)} ${r(a[1] + 6)} L${r(a[0] + 3)} 260 M${r(b[0] - 3)} ${r(b[1] + 6)} L${r(b[0] - 3)} 260" stroke="#3a1008" stroke-width="4"/>`;
  const platte = kappen([a, b, c, e]);
  k += `<path d="${platte}" fill="${S.lg("tischplatte", [[0, "#5e1e10"], [1, "#8e3418"]])}"/>`;
  k += `<path d="${platte}" fill="${S.lg("tischglanz", [[0, "#fff", 0], [0.4, "#ffe8c8", 0.14], [0.55, "#fff", 0]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}" stroke="#c0703a" stroke-width=".7"/><path d="M${r(a[0])} ${r(a[1])} L${r(e[0])} ${r(e[1])}" stroke="#4a160a" stroke-width="1.2"/>`;
  /* Holzmaserung */
  for (let i = 0; i < 8; i++) { const t = (i + 0.5) / 8; k += `<line ${linieKappen(a[0] + (b[0] - a[0]) * t, a[1], e[0] + (c[0] - e[0]) * t, e[1])} stroke="#4e180a" stroke-width=".3" opacity=".35"/>`; }
  S.teil({ anker: [250, 254], id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 0, y: 0, kunst: k });
}
/* ---------- die Pekingente mit Lupe: Pfannkuchen, Soße, Frühlingszwiebel, Gurke ---------- */
const enteUnter = [];
{
  const dE = 2.6, [px, py] = tp(0.78, dE), q = sk(dE);
  const g = (x, y, s, inhalt) => `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s * 100) / 100})">${inhalt}</g>`;
  let ente = `<ellipse cx="0" cy="0" rx="22" ry="4.2" fill="#f4f1ea"/><ellipse cx="0" cy="-.3" rx="19.4" ry="3.2" fill="#e8e3d6"/><path d="M-18 0 A20 3.6 0 0 0 18 0" stroke="#2a5aa0" stroke-width=".6" fill="none"/>`;
  const D = S.lg("ente", [[0, "#d98a3a"], [0.45, "#a8501c"], [1, "#5e260a"]], 0, 0, 0, 1);
  ente += `<path d="M-15 -1 Q-16 -10 -4 -12.4 Q8 -13 13 -6 Q14 -1 9 0 Z" fill="${D}"/>`;
  ente += `<path d="M10 -5 Q17 -9 19 -4 Q18 -1 13 -1.6 Z" fill="${D}"/>`;
  /* Hals und Kopf (die Ente wird im Ganzen gezeigt, bevor der Koch sie aufschneidet) */
  ente += `<path d="M-13 -4 Q-18 -6.4 -20 -3.6 Q-21 -2 -21.6 -1.6" stroke="${D}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  ente += `<path d="M-21 -3.4 Q-24.6 -4 -25.4 -1.8 Q-24.6 -.2 -21.6 -.4 Q-20.2 -1.4 -21 -3.4 Z" fill="#8a3a12"/><path d="M-25 -2.2 L-28 -1.4 L-25 -.8" fill="#5a2a10"/><circle cx="-23.2" cy="-2.4" r=".3" fill="#2a1408"/>`;
  ente += `<path d="M-9 -10 Q-1 -12.6 8 -9.4" stroke="#ffd9a0" stroke-width="1.2" fill="none" opacity=".75"/><ellipse cx="-4" cy="-9.6" rx="3" ry="1" fill="#fff" opacity=".45"/>`;
  for (let i = 0; i < 4; i++) ente += `<path d="M${-10 + i * 5} 1.6 q2.4 -2 4.6 -.4 l-.6 1 Z" fill="#c76a26" stroke="#f3e2c8" stroke-width=".35"/>`;
  let k = schatten(px + 4, py + 1, 26 * q, 2.4 * q, 0.3) + g(px, py, q, ente);
  /* Bambuskorb mit Pfannkuchen */
  const dB = 2.2, [bx, by] = tp(0.44, dB), qb = sk(dB);
  let korb = `<ellipse cx="0" cy="0" rx="9" ry="2.2" fill="#a07a3a"/><rect x="-9" y="-6" width="18" height="6" fill="${S.lg("bambus", [[0, "#d9b46a"], [1, "#a8823e"]], 0, 0, 1, 0)}"/>`;
  korb += `<path d="M-9 -3 h18" stroke="#8a6a2a" stroke-width=".4"/><ellipse cx="0" cy="-6" rx="9" ry="2.2" fill="#e9d4a4"/>`;
  for (let i = 0; i < 3; i++) korb += `<path d="M${r(-7 + i * 1.2)} ${r(-6.6 - i * 0.8)} Q0 ${r(-9.2 - i * 0.8)} ${r(7 - i * 1.2)} ${r(-6.6 - i * 0.8)} Q0 ${r(-5.4 - i * 0.8)} ${r(-7 + i * 1.2)} ${r(-6.6 - i * 0.8)} Z" fill="#fbf3dc" stroke="#e3d3ae" stroke-width=".25"/>`;
  k += schatten(bx + 3, by + 0.5, 11 * qb, 1.6 * qb, 0.25) + g(bx, by, qb, korb);
  enteUnter.push({ id: "pfannkuchen", de: "der Pfannkuchen", syl: "PFANN-ku-chen", it: "la crêpe", itSyl: "CREP", en: "pancake", x: bx, y: by, kunst: flaeche(-9.5 * qb, -10 * qb, 19 * qb, 12 * qb),
    tipp: "In den dünnen Pfannkuchen rollt man die Ente mit Soße, Gurke und Frühlingszwiebel." });
  /* Teller mit Soße, Frühlingszwiebel und Gurke */
  const dS = 2.2, [sx, sy] = tp(0.8, dS), qs = sk(dS);
  let teller = `<ellipse cx="0" cy="0" rx="12" ry="2.8" fill="#f4f1ea"/><ellipse cx="0" cy="-.2" rx="10" ry="2" fill="#e8e3d6"/>`;
  teller += `<ellipse cx="-6" cy="-1.2" rx="3.4" ry="1.4" fill="#f4f1ea" stroke="#2a5aa0" stroke-width=".3"/><ellipse cx="-6" cy="-1.4" rx="2.6" ry=".9" fill="#3a1a0a"/><ellipse cx="-6.6" cy="-1.7" rx=".9" ry=".3" fill="#8a5a3a"/>`;
  for (let i = 0; i < 6; i++) teller += `<path d="M${r(-1 + i * 0.7)} -.6 l${r(2.6 + (i % 2))} -2.4" stroke="${i % 2 ? "#f2f2e8" : "#8cc04a"}" stroke-width=".5" stroke-linecap="round"/>`;
  for (let i = 0; i < 5; i++) teller += `<rect x="${r(4 + i * 0.9)}" y="-3.2" width=".7" height="3" rx=".2" fill="${i % 2 ? "#5a9a3a" : "#c9e3a0"}" transform="rotate(${-20 + i * 4} ${r(4 + i * 0.9)} 0)"/>`;
  k += schatten(sx + 3, sy + 0.5, 13 * qs, 1.8 * qs, 0.22) + g(sx, sy, qs, teller);
  enteUnter.push({ id: "sosse", de: "die Soße", syl: "SO-ße", it: "la salsa", itSyl: "SAL-sa", en: "sauce", x: sx - 6 * qs, y: sy, kunst: flaeche(-4 * qs, -3.4 * qs, 8 * qs, 4.6 * qs),
    tipp: "Die dunkle, süße Bohnensoße gehört zur Pekingente." });
  enteUnter.push({ id: "fruehlingszwiebel", de: "die Frühlingszwiebel", syl: "FRÜH-lings-zwie-bel", it: "il cipollotto", itSyl: "ci-pol-LOT-to", en: "spring onion", x: sx + 1 * qs, y: sy, kunst: flaeche(-2 * qs, -4 * qs, 4.8 * qs, 4.6 * qs) });
  enteUnter.push({ id: "gurke", de: "die Gurke", syl: "GUR-ke", it: "il cetriolo", itSyl: "ce-tri-O-lo", en: "cucumber", x: sx + 6 * qs, y: sy, kunst: flaeche(-2.6 * qs, -4.4 * qs, 5.6 * qs, 4.8 * qs) });
  S.teil({ oben: true, id: "pekingente", de: "die Pekingente", syl: "PE-king-en-te", it: "l'anatra alla pechinese", itSyl: "A-na-tra al-la pe-chi-NE-se", en: "Peking duck", x: 0, y: 0, anker: [r(px), r(py - 6 * q)], kunst: k + flaeche(px - 22 * q, py - 13.6 * q, 42 * q, 18 * q),
    zoom: { x: 226, y: 194, w: 99, h: 66 }, unter: enteUnter,
    tipp: "Die Ente wird im Ofen über Obstholz gebraten. Ihre Haut wird ganz knusprig und glänzt." });
}
{
  /* DIE TEIGTASCHE — Teller mit Jiaozi */
  const d = 2.55, [x, y] = tp(1.2, d), q = sk(d);
  let k = `<ellipse cx="0" cy="0" rx="13" ry="3" fill="#f4f1ea"/><ellipse cx="0" cy="-.2" rx="11" ry="2.2" fill="#e8e3d6"/><path d="M-11 .2 A12 2.6 0 0 0 11 .2" stroke="#2a5aa0" stroke-width=".5" fill="none"/>`;
  for (const [dx, dy] of [[-6, -0.6], [-1.6, -0.2], [3, -0.6], [7, -0.4], [-4, -2.2], [0.6, -2.4], [5, -2.2]]) {
    k += `<path d="M${r(dx - 2.6)} ${r(dy)} Q${r(dx - 2.2)} ${r(dy - 3.4)} ${r(dx)} ${r(dy - 3.6)} Q${r(dx + 2.2)} ${r(dy - 3.4)} ${r(dx + 2.6)} ${r(dy)} Q${r(dx)} ${r(dy + 0.9)} ${r(dx - 2.6)} ${r(dy)} Z" fill="${S.lg("jiaozi", [[0, "#fbf6e8"], [1, "#dccfae"]])}"/>`;
    k += `<path d="M${r(dx - 1.6)} ${r(dy - 2.8)} l.5 .6 l.5 -.6 l.5 .6 l.5 -.6 l.5 .6" stroke="#c9b88e" stroke-width=".25" fill="none"/>`;
  }
  S.teil({ oben: true, id: "teigtasche", de: "die Teigtasche", syl: "TEIG-ta-sche", it: "il raviolo cinese", itSyl: "ra-VIO-lo ci-NE-se", en: "dumpling", x, y, steht: true,
    kunst: schatten(3, .6, 15 * q, 2 * q, .22) + `<g transform="scale(${r(q * 100) / 100})">${k}</g>` + flaeche(-13 * q, -6.4 * q, 26 * q, 9.4 * q),
    tipp: "Teigtaschen heißen auf Chinesisch „Jiaozi“. Zum Neujahrsfest macht sie die ganze Familie." });
}
{
  /* DAS ESSSTÄBCHEN — zwei rote Stäbchen auf dem Bänkchen */
  const d = 2.25, [x, y] = tp(1.18, d), q = sk(d);
  let k = `<rect x="-12" y="-1.6" width="3" height="1.6" rx=".5" fill="#f4f1ea" stroke="#2a5aa0" stroke-width=".25"/>`;
  k += `<path d="M-15 -1.4 L16 1.4 L16 2 L-15 -.6 Z" fill="#b0261c"/><path d="M-14 -2.6 L17 -.4 L17 .2 L-14 -1.8 Z" fill="#c43a26"/>`;
  k += `<path d="M-15 -1.4 L-8 -.8 M-14 -2.6 L-7 -2.1" stroke="#e8c35a" stroke-width=".6"/>`;
  S.teil({ oben: true, id: "essstaebchen", de: "das Essstäbchen", syl: "ESS-stäb-chen", it: "la bacchetta", itSyl: "bac-CHET-ta", en: "chopstick", x, y, steht: true,
    kunst: `<g transform="scale(${r(q * 100) / 100})">${k}</g>` + flaeche(-15.5 * q, -4.4 * q, 33 * q, 7 * q),
    tipp: "Man isst mit zwei Stäbchen. Man steckt sie nie senkrecht in den Reis." });
}
{
  /* DIE TEEKANNE mit Teeschale — blau-weißes Porzellan */
  const d = 2.85, [x, y] = tp(1.24, d), q = sk(d);
  let k = `<ellipse cx="0" cy="0" rx="6.4" ry="1.4" fill="#000" opacity=".2"/>`;
  k += `<path d="M-5.6 -1 Q-6.6 -6 -3.6 -8 L3.6 -8 Q6.6 -6 5.6 -1 Q0 .6 -5.6 -1 Z" fill="${S.lg("porzellan", [[0, "#ffffff"], [0.6, "#eef0f4"], [1, "#c9ced8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-4.6 -4.6 Q0 -2.8 4.6 -4.6" stroke="#2a5aa0" stroke-width=".6" fill="none"/><circle cx="0" cy="-5.6" r="1.1" fill="none" stroke="#2a5aa0" stroke-width=".4"/>`;
  k += `<path d="M5.4 -4 Q8.6 -5 9.4 -8.4" stroke="#e6e8ee" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-5.6 -6.4 Q-8.6 -5.4 -6 -2.4" stroke="#dfe2ea" stroke-width=".8" fill="none"/>`;
  k += `<ellipse cx="0" cy="-8" rx="3.6" ry=".8" fill="#e6e8ee"/><circle cx="0" cy="-9" r=".9" fill="#2a5aa0"/>`;
  k += `<path d="M-4 -7 Q-4.8 -4 -3.6 -1.6" stroke="#fff" stroke-width=".7" opacity=".8" fill="none"/>`;
  /* Teeschale daneben (links, etwas weiter vorn) */
  k += `<g transform="translate(-14 2.4)"><ellipse cx="0" cy=".2" rx="3.4" ry=".8" fill="#000" opacity=".18"/><path d="M-3 -3.6 L3 -3.6 Q2.8 -.4 0 0 Q-2.8 -.4 -3 -3.6 Z" fill="${S.lg("porzellan", [])}"/><ellipse cx="0" cy="-3.6" rx="3" ry=".8" fill="#c99a3a"/><ellipse cx="0" cy="-3.6" rx="2.4" ry=".55" fill="#e0b85a"/><path d="M-2.4 -2.2 Q0 -1.2 2.4 -2.2" stroke="#2a5aa0" stroke-width=".4" fill="none"/></g>`;
  S.teil({ oben: true, id: "teekanne", de: "die Teekanne", syl: "TEE-kan-ne", it: "la teiera", itSyl: "te-IE-ra", en: "teapot", x, y, steht: true, kunst: `<g transform="scale(${r(q * 100) / 100})">${k}</g>`,
    tipp: "Zur Ente trinkt man grünen Tee oder Jasmintee." });
}

/* =====================================================================
   VORNE: warmes Nachmittagslicht (fängt keinen Tipp ab)
   ===================================================================== */
S.davor(`<rect x="0" y="0" width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffe6b8", 0.1], [0.4, "#ffe6b8", 0], [1, "#000", 0.06]], 0, 0, 1, 1)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/peking.js"));
console.log(aus);
