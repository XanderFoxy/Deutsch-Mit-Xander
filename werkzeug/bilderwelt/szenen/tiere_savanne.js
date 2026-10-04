#!/usr/bin/env node
/* =====================================================================
   TIERE DER SAVANNE (FASSUNG 880) — Bilderwelt neu, Pilotszene der Brücke
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss
   der Tiere sein … kümmere Dich jetzt mal bitte intensiv um das alles“.
   Früher (03.10.): „perfekter Löwe … perfekter Wolf … wie in Jurassic Park
   … Licht und Schatten realistisch plastisch massiv“.

   FASSUNG 880 — die erste Szene, deren Tiere NICHT hier gezeichnet werden:
   jedes Tier kommt über tierTeil (werkzeug/bilderwelt/tiere/szene.js) bei
   jedem Bau frisch aus der Tier-Bibliothek (afrika.js, raubkatzen.js,
   hunde_baeren.js). Wird eine Art dort besser, genügt ein neuer Bau.

   RECHERCHE (Serengeti/Masai Mara: CUNY „One Serengeti – Landscape and
   Vegetation“, Key Biodiversity Areas „Serengeti National Park“, Wild
   Voyager „Flora of Serengeti“, amusingplanet „The Kopjes of Serengeti“;
   Nashörner: wandernundmehr.at, SafariFind „Black rhino Tanzania 2026“):
   - Weite, fast flache GRASEBENE, große Himmel; im Süden Kurzgras, im
     Norden und Westen (Masai Mara) Langgras. In der Trockenzeit (Juli–
     Oktober) ist das Gras goldgelb; das häufigste Gras, das Rote Hafergras
     (Themeda triandra), wird beim Trocknen rötlich.
   - Einzelne SCHIRMAKAZIEN (Vachellia tortilis): flache Schirmkrone in
     Lagen, dunkle Rinde, weiße Dornen; dazu Balanites-Büsche.
   - KOPJES: Granitfelsen, die wie Inseln aus dem Grasmeer ragen (rund
     gewaschene Blöcke, Risse, Flechten); Löwen nutzen sie als Ausguck und
     Schattenplatz.
   - TERMITENHÜGEL aus rötlicher Erde; Geparde stehen gern darauf und
     halten Ausschau.
   - LEOPARDEN ruhen tagsüber auf dicken Ästen (Akazien, Leberwurstbäume).
   - WASSERLÖCHER mit Schlammrand und Hufspuren; Flusspferde bleiben
     tagsüber im Wasser, Zebras und Gnus kommen zum Trinken.
   - Am Horizont im Südosten das Ngorongoro-Hochland: alte Vulkane, blau im
     Dunst. Der Kilimandscharo ist von der Serengeti aus NICHT zu sehen
     (rund 250 km entfernt, sichtbar z. B. von Amboseli) – darum hier nur
     die Berge des Hochlands.
   - Nashorn: Die Bibliothek zeichnet ein BREITMAULNASHORN. In der
     Serengeti leben (wenige) Spitzmaulnashörner; Breitmaulnashörner gibt
     es in Ostafrika nur in Schutzgebieten (Kenia, Uganda). Der Tipp nennt
     darum keinen Ort, nur die Art.
   - Raubtiere stehen getrennt von ihrer Beute: Löwe und Löwin auf dem
     Kopje links vorn, der Leopard im Baum rechts vorn, der Gepard auf dem
     Termitenhügel, die Hyäne vorn; die Beute (Zebras, Gnus, Gazellen,
     Giraffen) weit dahinter in der Ebene, das Nilpferd im Wasserloch.
   PERSPEKTIVE: Blick von einem Safariwagen (Augenhöhe 3,6 m), Horizont
   y = 62, Brennweite 230 Einheiten (Bildwinkel ≈ 70°):
     P(X, Z, h) → x = 160 + 230·X/Z, y = 62 + 230·(3,6 − h)/Z, epm = 230/Z
   (X seitlich, Z Abstand in Metern, h Höhe über dem Boden). So stimmt das
   Größenverhältnis jedes Tiers zu seinem Abstand (Elefant 3,4 m, Gazelle
   0,7 m Schulterhöhe).
   Licht: Sonne links oben (später Vormittag) – wie bei den Tieren der
   Bibliothek; Schatten von Bäumen und Felsen fallen nach rechts.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, zufall } = B;
const { tierTeil } = require("../tiere/szene.js");
const r = B.r;

const S = neueSzene({ id: "tiere_savanne", titel: "Tiere der Savanne", emoji: "🦒", thema: "Tiere", kuerzel: "tsv", fassung: 880 });
const rnd = zufall(880);

/* ---------- Perspektive ---------------------------------------------- */
const HOR = 62, AUGE = 3.6, F = 230;
const P = (X, Z, h = 0) => ({ x: 160 + F * X / Z, y: HOR + F * (AUGE - h) / Z, e: F / Z });
const E = (y) => (y - HOR) / AUGE;          // Einheiten je Meter am Boden in Bildhöhe y
const US = ' gradientUnits="userSpaceOnUse"';
/* Kreisverlauf in Bildkoordinaten (S.rg kennt nur Anteile der Form) */
const rgUS = (name, stops, cx, cy, rr) => {
  S.def(`<radialGradient id="${S.id(name)}" cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}"${US}>` + stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("") + "</radialGradient>");
  return `url(#${S.id(name)})`;
};

/* ---------- Farben ---------------------------------------------------- */
const HIMMEL = S.lg("himmel", [[0, "#3b7bc0"], [0.45, "#79acd8"], [0.84, "#c8d9de"], [1, "#e8e0c6"]]);
const BODEN = S.lg("boden", [[0, "#d6cba0"], [0.05, "#cfba84"], [0.28, "#c8a965"], [0.66, "#bb9450"], [1, "#a97c3d"]], 0, HOR, 0, 200, US);
const RINDE = S.lg("rinde", [[0, "#806b59"], [0.4, "#57473b"], [1, "#2c231d"]], 0, 0, 1, 0);
const GRANIT = S.lg("granit", [[0, "#ddcfbd"], [0.35, "#b4a593"], [0.75, "#8a7c6e"], [1, "#655a51"]], 0, 0, 1, 1);
const ERDE = S.lg("erde", [[0, "#cf9a6c"], [0.4, "#a96d44"], [1, "#6c3f25"]], 0, 0, 1, 0);
const WEICH = S.rg("weich", [[0, "#2a1d0e", 0.42], [0.6, "#2a1d0e", 0.18], [1, "#2a1d0e", 0]]);

/* =====================================================================
   KULISSE: Himmel, Wolken, ferne Berge und Bäume, Ebene mit Gras
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 2}" fill="${HIMMEL}"/>`);
/* Sonne links oben außerhalb des Bildes: warmer Schein */
S.hinten(`<rect width="320" height="${HOR + 2}" fill="${S.rg("sonne", [[0, "#fff6dc", 0.6], [0.4, "#fff2d2", 0.16], [1, "#fff2d2", 0]], 0, 0, 0.75)}"/>`);
/* Haufenwolken: runde Ballen (links oben beschienen), flache graue Unterseite; zum Horizont kleiner und flacher */
let wnr = 0;
const wolke = (x, y, w, h) => {
  const z = zufall(100 + wnr), g = S.lg("wo" + wnr++, [[0, "#ffffff"], [0.5, "#f4f6f8"], [0.82, "#d5dce5"], [1, "#b9c4d2"]], 0, r(y - h * 1.6), 0, r(y), US);
  let s = "";
  const n = 4 + Math.round(w / h);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, rr = h * (0.42 + 0.5 * Math.sin(Math.PI * t)) * (0.8 + z() * 0.4);
    s += `<circle cx="${r(x + w * t)}" cy="${r(y - rr * 0.95)}" r="${r(rr)}"/>`;
  }
  s += `<rect x="${r(x + w * 0.04)}" y="${r(y - h * 0.5)}" width="${r(w * 0.92)}" height="${r(h * 0.5)}" rx="${r(h * 0.25)}"/>`;
  /* Glanz links oben auf den Ballen */
  return `<g fill="${g}">${s}</g><ellipse cx="${r(x + w * 0.3)}" cy="${r(y - h * 1.15)}" rx="${r(w * 0.18)}" ry="${r(h * 0.3)}" fill="#fff" opacity=".55"/>`;
};
S.hinten(wolke(112, 26, 62, 10) + wolke(198, 17, 48, 8) + wolke(262, 36, 40, 6) + wolke(20, 44, 38, 5) + wolke(150, 47, 34, 4) + wolke(232, 52, 30, 3.2) + wolke(66, 55, 22, 2.6));
/* ferner Höhenzug links (Gol-Berge), sehr blass */
S.hinten(`<path d="M0 ${HOR + 0.5} L0 56.4 C14 53.6 26 53 38 54.8 C52 52.6 64 53.4 78 55.6 C96 57.6 116 59.2 140 ${HOR + 0.5} Z" fill="#b9c2ca" opacity=".85"/>`);

/* DER BERG — das Ngorongoro-Hochland: breiter Vulkanstock mit flachen Kegeln, blau im Dunst (Teil, siehe unten) */
const BERG = (() => {
  const ruecken = `M118 ${HOR + 0.6} C140 59 158 55.4 176 52.4 C188 50.4 196 47.6 204 46.2 C210 45.2 214 45.6 219 45.2 C225 44.6 229 42 236 41.8 C244 41.6 250 44.2 258 46.6 C268 49.2 282 48.2 294 48.6 C304 49 312 50.4 320 51.6 L320 ${HOR + 0.6} Z`;
  let k = `<path d="${ruecken}" fill="${S.lg("berg", [[0, "#8a9cbc"], [0.55, "#a5b2c6"], [1, "#cacfd0"]], 0, 41, 0, HOR, US)}"/>`;
  /* Schattenseiten der Kegel (rechts, von der Sonne weg) als weiche Flächen, Täler als feine Linien */
  k += `<path d="M236 41.8 C244 41.6 250 44.2 258 46.6 C254 50 252 54 252 ${HOR - 1} C246 55 240 49 236 41.8 Z" fill="#6c7d9d" opacity=".32"/>`;
  k += `<path d="M204 46.2 C208 45.6 212 45.4 214 45.6 C214 50 216 55 220 ${HOR - 2} C212 56 207 51 204 46.2 Z" fill="#6c7d9d" opacity=".25"/>`;
  k += `<path d="M176 52.4 C186 51 192 49 200 47.2 C196 52 190 56 182 59 Z" fill="#d9dfe8" opacity=".35"/>`;
  k += `<path d="M226 47 q4 6 3 13 M266 50 q3 5 2 10 M292 50.6 q2 4 1 9" stroke="#7b8aa8" stroke-width=".35" fill="none" opacity=".45"/>`;
  k += `<path d="M118 ${HOR + 0.6} L320 ${HOR + 0.6} L320 ${HOR - 5} C270 ${HOR - 6.4} 200 ${HOR - 5.2} 118 ${HOR + 0.6} Z" fill="#dcdbcf" opacity=".6"/>`;
  return k;
})();

/* Schirmakazie: Stamm mit Gabel, Äste fächerförmig zur flachen Krone; die Krone aus Laubballen (eine
   gemeinsame Füllung, damit die Ballen ohne Naht ineinanderlaufen), Licht links oben, Unterseite dunkel.
   x, y Fuß des Stamms, e Einheiten je Meter, H Höhe (m), W Kronenbreite (m),
   o: { ast: Höhe (m) eines dicken, fast waagrechten Asts, astSeite: −1 links / 1 rechts, astLang (m), fern, seed } */
let anr = 0;
const akazie = (x, y, e, H, W, o = {}) => {
  const z = zufall(o.seed || 7), id = anr++;
  const hk = H * e, wk = W * e, oben = y - hk, unten = y - hk * (o.unten || 0.74), dick = Math.max(0.45, e * 0.3);
  const cx = x + wk * 0.04;
  let g = "";
  if (!o.fern) g += `<ellipse cx="${r(cx + wk * 0.1)}" cy="${r(y + e * 0.2)}" rx="${r(wk * 0.44)}" ry="${r(Math.max(1, e * 0.8))}" fill="${WEICH}" opacity=".85"/>`;
  /* Stamm bis zur Gabel (leicht geneigt) */
  const gx = x + e * 0.15, gy = y - hk * 0.32;
  g += `<path d="M${r(x - dick * 0.55)} ${r(y)} C${r(x - dick * 0.4)} ${r(y - (y - gy) * 0.5)} ${r(gx - dick * 0.5)} ${r(gy + (y - gy) * 0.2)} ${r(gx - dick * 0.35)} ${r(gy)} L${r(gx + dick * 0.35)} ${r(gy)} C${r(gx + dick * 0.4)} ${r(gy + (y - gy) * 0.3)} ${r(x + dick * 0.5)} ${r(y - (y - gy) * 0.4)} ${r(x + dick * 0.65)} ${r(y)} Z" fill="${RINDE}"/>`;
  let st = "", li = "";
  const aeste = [[-0.44, 0.04, 0.6], [-0.2, -0.02, 0.5], [0.06, -0.05, 0.52], [0.3, 0.0, 0.5], [0.46, 0.05, 0.38]];
  for (const [ex, ey, w] of aeste) {
    const zx = cx + ex * wk, zy = unten + ey * hk;
    st += `M${r(gx)} ${r(gy)}C${r(gx + (zx - gx) * 0.1)} ${r(gy - (gy - zy) * 0.5)} ${r(gx + (zx - gx) * 0.6)} ${r(gy - (gy - zy) * 0.8)} ${r(zx)} ${r(zy)}`;
  }
  g += `<path d="${st}" stroke="${o.fern ? "#4e4136" : "#4d3e33"}" stroke-width="${r(dick * 0.5)}" fill="none" stroke-linecap="round"/>`;
  if (o.ast) {
    /* dicker, fast waagrechter Ast (Ruheplatz des Leoparden) */
    const sd = o.astSeite || 1, ay = y - o.ast * e, ax1 = x + sd * (o.astLang || 2.4) * e;
    const d = `M${r(x + sd * dick * 0.2)} ${r(ay + dick * 0.9)} C${r(x + sd * e * 0.6)} ${r(ay + dick * 0.1)} ${r(x + (ax1 - x) * 0.6)} ${r(ay - dick * 0.1)} ${r(ax1)} ${r(ay - dick * 0.7)}`;
    g += `<path d="${d}" stroke="${RINDE}" stroke-width="${r(dick * 0.62)}" fill="none" stroke-linecap="round"/>`;
    li += `<path d="${d}" transform="translate(0 ${r(-dick * 0.2)})" stroke="#b9a48c" stroke-opacity=".45" stroke-width="${r(dick * 0.14)}" fill="none" stroke-linecap="round"/>`;
    li += `<path d="M${r(ax1)} ${r(ay - dick * 0.7)} q${r(sd * e * 0.2)} ${r(-e * 0.05)} ${r(sd * e * 0.38)} ${r(-e * 0.22)}" stroke="#3c3028" stroke-width="${r(dick * 0.13)}" fill="none" stroke-linecap="round"/>`;
  }
  if (!o.fern) {
    /* Lichtkante links am Stamm, weiße Dornen an den Ästen */
    li += `<path d="M${r(x - dick * 0.32)} ${r(y - e * 0.1)} C${r(x - dick * 0.2)} ${r(y - (y - gy) * 0.5)} ${r(gx - dick * 0.3)} ${r(gy + (y - gy) * 0.25)} ${r(gx - dick * 0.2)} ${r(gy + e * 0.1)}" stroke="#b39d86" stroke-opacity=".5" stroke-width="${r(dick * 0.18)}" fill="none" stroke-linecap="round"/>`;
    let d = "";
    for (let i = 0; i < 34; i++) { const [ex, ey] = aeste[i % aeste.length], t = 0.25 + z() * 0.7; const px = gx + (cx + ex * wk - gx) * t, py = gy + (unten + ey * hk - gy) * t; d += `M${r(px)} ${r(py)}l${r((z() - 0.5) * e * 0.14)} ${r(-e * 0.09)}`; }
    li += `<path d="${d}" stroke="#f3eee4" stroke-width="${r(Math.max(0.12, e * 0.02))}" stroke-opacity=".85"/>`;
  }
  g += li;
  /* Krone: zwei flache Lagen aus Laubballen */
  const fuell = rgUS("kr" + id, [[0, "#a9aa62"], [0.35, "#7f8a44"], [0.7, "#56622d"], [1, "#36421d"]], cx - wk * 0.35, oben - hk * 0.05, wk * 0.95);
  let ball = "";
  const lage = (mx, my, w, h, n) => {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, px = mx - w / 2 + w * t + (z() - 0.5) * w / n * 0.6, prof = Math.sqrt(Math.max(0.05, 1 - Math.pow(2 * t - 1, 2)));
      const rr = h * (0.45 + 0.35 * prof) * (0.75 + z() * 0.5);
      ball += `<ellipse cx="${r(px)}" cy="${r(my - h * 0.3 * prof - (z() - 0.3) * h * 0.25)}" rx="${r(rr * 1.35)}" ry="${r(rr * 0.8)}"/>`;
    }
    ball += `<ellipse cx="${r(mx)}" cy="${r(my)}" rx="${r(w * 0.47)}" ry="${r(h * 0.42)}"/>`;
  };
  lage(cx, unten, wk, hk * 0.16, o.fern ? 9 : 22);
  lage(cx + wk * 0.05, unten - hk * 0.14, wk * 0.7, hk * 0.14, o.fern ? 7 : 16);
  g += `<g fill="${fuell}">${ball}</g>`;
  if (!o.fern) {
    /* Laubstruktur: kleine helle Büschel oben links (Sonne), dunkle Taschen unten rechts – kurze runde Tupfer */
    let hell = "", dunkel = "";
    for (let i = 0; i < 80; i++) {
      /* nur innerhalb der Kronenlagen (flache Ellipse um die untere Lage) */
      const u = z() * 2 - 1, v = z(), px = cx + u * wk * 0.44, py = unten - hk * (0.02 + v * 0.2 * Math.sqrt(1 - u * u)), L = e * (0.08 + z() * 0.16), a = (z() - 0.5) * 1.2;
      const st = `M${r(px)} ${r(py)}l${r(Math.cos(a) * L * 0.4)} ${r(Math.sin(a) * L * 0.4)}`;
      if (z() < 0.62 - (px - cx) / wk * 0.7 - (py - unten + hk * 0.15) / hk * 1.5) hell += st; else dunkel += st;
    }
    g += `<path d="${hell}" stroke="#c9cb86" stroke-opacity=".4" stroke-width="${r(e * 0.06)}" stroke-linecap="round"/>`;
    g += `<path d="${dunkel}" stroke="#2f3a17" stroke-opacity=".38" stroke-width="${r(e * 0.065)}" stroke-linecap="round"/>`;
    g += `<path d="M${r(cx - wk * 0.47)} ${r(unten + hk * 0.03)} C${r(cx - wk * 0.2)} ${r(unten + hk * 0.09)} ${r(cx + wk * 0.2)} ${r(unten + hk * 0.08)} ${r(cx + wk * 0.46)} ${r(unten + hk * 0.02)}" stroke="#26301a" stroke-opacity=".55" stroke-width="${r(e * 0.3)}" fill="none" stroke-linecap="round"/>`;
  }
  return g;
};

/* ferne Schirmakazien auf dem Horizont */
{
  let g = "";
  for (const [x, s] of [[8, 1], [22, 0.7], [58, 0.9], [96, 0.6], [104, 0.8], [146, 0.7], [174, 1.1], [300, 1], [312, 0.7]]) {
    const y = HOR + 0.8, h = 3.4 * s, w = 4.4 * s;
    g += `<path d="M${r(x)} ${r(y)} v${r(-h)}" stroke="#5b5a48" stroke-width="${r(0.35 * s)}"/><path d="M${r(x - w)} ${r(y - h + 0.3)} q${r(w * 0.3)} ${r(-1.6 * s)} ${r(w)} ${r(-1.5 * s)} q${r(w * 0.7)} ${r(0.1 * s)} ${r(w)} ${r(1.5 * s)} z" fill="#66724c"/>`;
  }
  S.hinten(`<g opacity=".7">${g}</g>`);
}
/* die Ebene */
S.hinten(`<rect y="${HOR}" width="320" height="${200 - HOR}" fill="${BODEN}"/>`);
S.hinten(`<rect y="${HOR}" width="320" height="7" fill="${S.lg("dunst", [[0, "#e8e2ca", 0.85], [1, "#e8e2ca", 0]])}"/>`);
/* Wolkenschatten auf der Ebene (weiche dunkle Flecken, flach in der Perspektive) und grünere Senke ums Wasserloch */
{
  const ws = S.rg("wschatten", [[0, "#5e4c22", 0.34], [0.6, "#5e4c22", 0.14], [1, "#5e4c22", 0]]);
  let g = "";
  for (const [x, y, rx, ry] of [[60, 69, 70, 2.4], [250, 74, 80, 3.4], [130, 86, 90, 5.5], [20, 104, 70, 8], [300, 112, 60, 9]]) g += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${ws}"/>`;
  g += `<ellipse cx="206" cy="128" rx="86" ry="16" fill="${S.rg("feucht", [[0, "#8d8a4a", 0.42], [0.7, "#8d8a4a", 0.16], [1, "#8d8a4a", 0]])}"/>`;
  S.hinten(g);
}
/* Gras: Büschel aus Halmen, Größe nach Tiefe (Halme 0,3–0,7 m); je Farbe und Tiefenband EIN Pfad */
const halme = {};
const buschel = (x, y, s, band, n0 = 3) => {
  const n = n0 + Math.floor(rnd() * 3);
  for (let i = 0; i < n; i++) {
    const f = rnd() < 0.4 ? "d" : rnd() < 0.6 ? "h" : "r";
    const h = s * (0.55 + rnd() * 0.7), dx = (rnd() - 0.5) * s * 0.9, bx = x + (rnd() - 0.5) * s * 0.4;
    halme[band + f] = (halme[band + f] || "") + `M${r(bx)} ${r(y)}q${r(dx * 0.15)} ${r(-h * 0.6)} ${r(dx)} ${r(-h)}`;
  }
};
const FARBE = { d: ["#7a5c2a", 0.55], h: ["#ecd59c", 0.6], r: ["#a65f38", 0.45] };
const grasPfade = (band, breite) => ["d", "h", "r"].map((f) => halme[band + f] ? `<path d="${halme[band + f]}" stroke="${FARBE[f][0]}" stroke-opacity="${FARBE[f][1]}" stroke-width="${breite}" fill="none" stroke-linecap="round"/>` : "").join("");
{
  /* fern: feine waagrechte Striche, dazu dunkle Büsche (Balanites); mittel und nah: Büschel */
  let d = "", d2 = "";
  for (let i = 0; i < 120; i++) { const y = HOR + 1.5 + Math.pow(rnd(), 1.5) * 30, x = rnd() * 320, w = 0.8 + E(y) * 0.4; const st = `M${r(x)} ${r(y)}h${r(w)}`; if (i % 2) d += st; else d2 += st; }
  S.hinten(`<path d="${d}" stroke="#9a834c" stroke-width=".28" stroke-opacity=".55"/><path d="${d2}" stroke="#e6d6a2" stroke-width=".28" stroke-opacity=".5"/>`);
  let b = "";
  for (const [X, Z] of [[-14, 52], [-9, 60], [6, 70], [16, 48], [21, 58], [-22, 40], [12, 36], [-16, 30]]) {
    const p = P(X, Z), w = 2.4 * p.e, h = 1.1 * p.e;
    if (p.x < -10 || p.x > 330) continue;
    b += `<ellipse cx="${r(p.x + w * 0.2)}" cy="${r(p.y + 0.2)}" rx="${r(w * 0.7)}" ry="${r(h * 0.15)}" fill="#6b5a2c" opacity=".35"/><path d="M${r(p.x - w / 2)} ${r(p.y)} q${r(w * 0.02)} ${r(-h * 0.8)} ${r(w * 0.22)} ${r(-h * 0.85)} q${r(w * 0.1)} ${r(-h * 0.2)} ${r(w * 0.3)} ${r(-h * 0.15)} q${r(w * 0.25)} ${r(-h * 0.05)} ${r(w * 0.3)} ${r(h * 0.25)} q${r(w * 0.16)} ${r(h * 0.2)} ${r(w * 0.18)} ${r(h * 0.75)} z" fill="#4f5a2c"/><path d="M${r(p.x - w * 0.36)} ${r(p.y - h * 0.5)} q${r(w * 0.12)} ${r(-h * 0.45)} ${r(w * 0.36)} ${r(-h * 0.48)}" stroke="#94a35a" stroke-width="${r(Math.max(0.2, h * 0.14))}" fill="none" opacity=".6"/>`;
  }
  S.hinten(b);
  for (let i = 0; i < 115; i++) { const y = 80 + rnd() * 44; buschel(rnd() * 320, y, E(y) * 0.36, "m"); }
  for (let i = 0; i < 72; i++) { const y = 124 + Math.pow(rnd(), 0.8) * 76; buschel(rnd() * 320, y, E(y) * 0.38, "n", 4); }
  S.hinten(grasPfade("m", 0.22) + grasPfade("n", 0.4));
}

/* =====================================================================
   Helfer für die Dinge
   ===================================================================== */
const bodenSchatten = (cx, cy, rx, ry, a = 1) => `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${WEICH}" opacity="${a}"/>`;
/* Grasbüschel vor den Füßen eines Tiers (vom Fußpunkt des Teils aus): [x, y, e, breite in m] */
const fussGras = (punkte) => {
  let d = "", d2 = "";
  for (const [x, y, e, b = 1.6] of punkte) {
    for (let i = 0; i < 4 + Math.round(b * 2); i++) {
      const s = e * (0.14 + rnd() * 0.18), bx = x + (rnd() - 0.5) * e * b, dx = (rnd() - 0.5) * s * 0.9;
      const p = `M${r(bx)} ${r(y + e * 0.03)}q${r(dx * 0.2)} ${r(-s * 0.6)} ${r(dx)} ${r(-s)}`;
      if (i % 2) d += p; else d2 += p;
    }
  }
  const w = r(Math.max(0.18, punkte[0][2] * 0.012));
  return `<path d="${d}" stroke="#7a5c2a" stroke-opacity=".7" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d2}" stroke="#e6cd92" stroke-opacity=".8" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
};
/* Granitblock (Kopje): gerundeter Laib (Superellipse), links oben hell; Schalenrisse, Flechten, Kernschatten rechts unten */
const block = (x, y, w, h, seed, flach = 3) => {
  const z = zufall(seed);
  let d = "";
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (1 - i / n), c = Math.cos(a), s = Math.sin(a);
    const px = x + Math.sign(c) * Math.pow(Math.abs(c), 2 / flach) * w / 2 * (1 + (z() - 0.5) * 0.04);
    const py = y - Math.pow(s, 2 / flach) * h * (1 + (z() - 0.5) * 0.05);
    d += (i ? " L" : "M") + r(px) + " " + r(py);
  }
  d += " Z";
  let g = `<path d="${d}" fill="${GRANIT}"/>`;
  g += `<path d="M${r(x + w * 0.5)} ${r(y)} C${r(x + w * 0.5)} ${r(y - h * 0.7)} ${r(x + w * 0.3)} ${r(y - h * 0.98)} ${r(x + w * 0.05)} ${r(y - h)} C${r(x + w * 0.3)} ${r(y - h * 0.7)} ${r(x + w * 0.32)} ${r(y - h * 0.3)} ${r(x + w * 0.22)} ${r(y)} Z" fill="#3a3029" opacity=".22"/>`;
  g += `<path d="M${r(x - w * 0.42)} ${r(y - h * 0.62)} C${r(x - w * 0.3)} ${r(y - h * 0.92)} ${r(x - w * 0.1)} ${r(y - h * 0.99)} ${r(x + w * 0.14)} ${r(y - h * 0.97)}" stroke="#f2e9da" stroke-width="${r(h * 0.05)}" stroke-opacity=".6" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M${r(x - w * 0.3)} ${r(y - h * 0.45)} C${r(x - w * 0.1)} ${r(y - h * 0.62)} ${r(x + w * 0.15)} ${r(y - h * 0.6)} ${r(x + w * 0.36)} ${r(y - h * 0.4)} M${r(x + w * 0.08)} ${r(y - h * 0.58)} q${r(w * 0.04)} ${r(h * 0.3)} ${r(-w * 0.02)} ${r(h * 0.56)}" stroke="#4a3f36" stroke-width="${r(h * 0.025)}" fill="none" opacity=".55"/>`;
  let fl = "", fl2 = "";
  for (let i = 0; i < 9; i++) { const st = `M${r(x - w * 0.35 + z() * w * 0.6)} ${r(y - h * (0.25 + z() * 0.6))}h${r(w * 0.01 + z() * w * 0.025)}`; if (i % 2) fl += st; else fl2 += st; }
  g += `<path d="${fl}" stroke="#c9a24a" stroke-width="${r(h * 0.05)}" stroke-opacity=".45" stroke-linecap="round"/><path d="${fl2}" stroke="#a9ad86" stroke-width="${r(h * 0.04)}" stroke-opacity=".5" stroke-linecap="round"/>`;
  return g;
};

/* =====================================================================
   DIE TEILE — hinten zuerst
   ===================================================================== */
S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 0, y: 0, kunst: BERG,
  tipp: "Die Berge am Horizont sind alte Vulkane. In Ostafrika gibt es viele davon – auch der Kilimandscharo ist ein Vulkan." });

/* Ort nach Bildspalte x und Abstand Z (Meter), h Höhe über dem Boden – bequemer zum Komponieren */
const Q = (x, Z, h = 0) => P((x - 160) * Z / F, Z, h);
/* geschlossene glatte Kurve durch Punkte (Catmull-Rom → Bézier) */
const rund = (pts) => {
  const n = pts.length, Pn = (i) => pts[(i + n) % n];
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = Pn(i - 1), p1 = Pn(i), p2 = Pn(i + 1), p3 = Pn(i + 2);
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + "Z";
};

/* ferne Schirmakazie (Kulisse) links hinter den Giraffen */
{
  const p = Q(104, 42);
  S.hinten(akazie(p.x, p.y, p.e, 6.2, 8.6, { fern: true, seed: 3 }));
}

/* DAS WASSERLOCH — unregelmäßiges Ufer, nasser Schlamm (vorn breiter, hinten schmal), Hufspuren; das Wasser spiegelt den Himmel */
const WL = { cx: 206, cy: 128, rx: 57, ry: 9 };
const WASSER_STOPS = [[0, "#b2c6c6"], [0.3, "#90a59f"], [0.7, "#7b8b77"], [1, "#6c765f"]];
const TEICH = (() => {
  const { cx, cy, rx, ry } = WL, z = zufall(31);
  const wasser = [], n = 14;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, j = 1 + (z() - 0.5) * 0.16 + (i === 3 ? 0.12 : 0) + (i === 10 ? -0.1 : 0); wasser.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]); }
  const rand = (kx, kOben, kUnten) => wasser.map(([x, y]) => [cx + (x - cx) * kx, cy + (y - cy) * (y < cy ? kOben : kUnten)]);
  return { aussen: rund(rand(1.09, 1.18, 1.75)), schlamm: rund(rand(1.04, 1.08, 1.4)), wasser: rund(wasser) };
})();
{
  const { cx, cy, rx, ry } = WL, z = zufall(32);
  const wg = S.lg("wasser", WASSER_STOPS, 0, cy - ry, 0, cy + ry, US);
  const schlamm = S.lg("schlamm", [[0, "#5e4a2f"], [0.6, "#6f5737"], [1, "#8a6f47"]], 0, cy - ry, 0, cy + ry * 1.6, US);
  let k = `<path d="${TEICH.aussen}" fill="#a2875a" opacity=".55"/><path d="${TEICH.schlamm}" fill="${schlamm}"/><path d="${TEICH.wasser}" fill="${wg}"/>`;
  /* Spiegelung des fernen Ufers (dunkel), heller Himmelsstreif, Wellenlinien */
  k += `<path d="M${r(cx - rx * 0.8)} ${r(cy - ry * 0.62)} Q${r(cx)} ${r(cy - ry * 1.08)} ${r(cx + rx * 0.82)} ${r(cy - ry * 0.6)} Q${r(cx)} ${r(cy - ry * 0.74)} ${r(cx - rx * 0.8)} ${r(cy - ry * 0.62)} Z" fill="#6b6644" opacity=".35"/>`;
  k += `<path d="M${r(cx - rx * 0.6)} ${r(cy + ry * 0.1)} Q${r(cx)} ${r(cy - ry * 0.05)} ${r(cx + rx * 0.62)} ${r(cy + ry * 0.12)}" stroke="#e2eef0" stroke-width="1.1" stroke-opacity=".28" fill="none"/>`;
  let d = "";
  for (let i = 0; i < 12; i++) { const yy = cy - ry * 0.45 + z() * ry * 1.2, half = Math.sqrt(Math.max(0, 1 - Math.pow((yy - cy) / ry, 2))) * rx * 0.8, xx = cx - half + z() * half * 1.6; d += `M${r(xx)} ${r(yy)}h${r(3 + z() * 7)}`; }
  k += `<path d="${d}" stroke="#eef6f6" stroke-width=".3" stroke-opacity=".6"/>`;
  /* Hufspuren im Schlamm */
  let h = "";
  for (let i = 0; i < 34; i++) { const a = z() * Math.PI * 2, rr = 1.06 + z() * 0.12, sy = Math.sin(a) > 0 ? 1.35 : 1.05; h += `M${r(cx + Math.cos(a) * rx * rr)} ${r(cy + Math.sin(a) * ry * rr * sy)}h.7`; }
  k += `<path d="${h}" stroke="#3e2f1b" stroke-width=".45" stroke-opacity=".55" stroke-linecap="round"/>`;
  /* Gras am Ufer */
  k += fussGras([[cx - rx * 1.0, cy + ry * 0.3, E(cy), 1.4], [cx - rx * 0.4, cy + ry * 1.5, E(cy + ry * 1.5), 2], [cx + rx * 0.5, cy + ry * 1.45, E(cy + ry * 1.4), 2], [cx + rx * 1.02, cy + ry * 0.2, E(cy), 1.2], [cx - rx * 0.5, cy - ry * 1.1, E(cy - ry), 2], [cx + rx * 0.35, cy - ry * 1.12, E(cy - ry), 2]]);
  S.teil({ id: "wasserloch", de: "das Wasserloch", syl: "WAS-ser-loch", it: "la pozza d'acqua", itSyl: "POZ-za d'AC-qua", en: "waterhole", x: 0, y: 0, kunst: k,
    tipp: "In der Trockenzeit ist das Wasserloch für viele Tiere die einzige Wasserstelle. Auch Raubtiere warten hier." });
}

/* ---------- ganz hinten: Gnus, Giraffen, Gazellen ----------------------- */
{
  /* vier Gnus – jedes Tier einer Herde kostet beim Zeichnen so viel wie ein einzelnes (Zeichenzeit hat Vorrang) */
  const a = Q(112, 44), b = Q(125, 47), c = Q(99, 43), d = Q(88, 46);
  tierTeil(S, "gnu", a.x, a.y, a.e, { dir: 1,
    herde: [{ x: b.x, y: b.y, epm: b.e, dir: 1 }, { x: c.x, y: c.y, epm: c.e, dir: -1, groesse: 0.95 }, { x: d.x, y: d.y, epm: d.e, dir: 1, groesse: 0.93 }],
    tipp: "Jedes Jahr wandern weit über eine Million Gnus durch die Serengeti und die Masai Mara – immer dem frischen Gras nach." });
}
{
  const a = Q(146, 38), b = Q(164, 35);
  tierTeil(S, "giraffe", a.x, a.y, a.e, { dir: 1, herde: [{ x: b.x, y: b.y, epm: b.e, dir: -1, groesse: 0.9 }],
    tipp: "Die Giraffe ist das höchste Tier der Welt. Ihr langer Hals hat nur sieben Wirbel – genau wie unser Hals." });
}
{
  const a = Q(246, 21), b = Q(254, 22.2), c = Q(239, 22.8);
  tierTeil(S, "gazelle", a.x, a.y, a.e, { dir: -1, herde: [{ x: b.x, y: b.y, epm: b.e, dir: -1 }, { x: c.x, y: c.y, epm: c.e, dir: 1, groesse: 0.95 }],
    tipp: "Die Thomson-Gazelle erkennt man am schwarzen Streifen an der Seite. Ihr kurzer Schwanz wedelt fast immer." });
}
/* ---------- Mitte hinten: Nashorn, Zebras, Elefant ---------------------- */
{
  const a = Q(104, 22);
  tierTeil(S, "nashorn", a.x, a.y, a.e, { dir: 1, davor: fussGras([[0, 0, a.e, 3]]),
    tipp: "Das Breitmaulnashorn frisst Gras. Mit seinen breiten Lippen rupft es das Gras wie ein Rasenmäher." });
}
{
  const a = Q(291, 21.5), b = Q(305, 22.8), c = Q(278, 23.5);
  tierTeil(S, "zebra", a.x, a.y, a.e, { dir: -1, herde: [{ x: b.x, y: b.y, epm: b.e, dir: -1 }, { x: c.x, y: c.y, epm: c.e, dir: 1, groesse: 0.95 }],
    davor: fussGras([[0, 0, a.e, 2], [b.x - a.x, b.y - a.y, b.e, 2], [c.x - a.x, c.y - a.y, c.e, 2]]),
    tipp: "Jedes Zebra hat sein eigenes Streifenmuster – wie ein Fingerabdruck." });
}
{
  const a = Q(204, 19.5);
  tierTeil(S, "elefant", a.x, a.y, a.e, { dir: 1, davor: fussGras([[0, 0, a.e, 4]]),
    tipp: "Der Afrikanische Elefant ist das größte Landtier der Welt. Mit dem Rüssel trinkt, riecht und greift er." });
}
/* ---------- Mitte: Termitenhügel mit Gepard, Nilpferd im Wasserloch ------ */
const TH = Q(128, 11.4), TH_OBEN = 1.08;
{
  /* DER TERMITENHÜGEL — breite Kuppe aus rötlicher Erde mit flacher Schulter (Ausguck), hinten ein Schlot;
     Regenrinnen, Luftlöcher, Gras am Fuß */
  const { x, y, e } = TH, h = TH_OBEN * e, w = 2.5 * e;
  let k = bodenSchatten(w * 0.18, e * 0.08, w * 0.62, e * 0.2, 0.85);
  /* Umriss: Hauptkuppe mit flacher Schulter (dort steht der Gepard), links ein älterer Buckel, unregelmäßig */
  const um = [[-0.5, 0], [-0.47, -0.3], [-0.43, -0.62], [-0.38, -0.92], [-0.32, -1.14], [-0.25, -1.2], [-0.19, -1.08], [-0.13, -0.99], [0, -1.01], [0.13, -0.99], [0.21, -0.95], [0.3, -0.8], [0.37, -0.62], [0.42, -0.42], [0.47, -0.2], [0.5, 0], [0.2, 0.03], [-0.2, 0.03]].map(([u, v]) => [u * w, v * h]);
  k += `<path d="${rund(um)}" fill="${ERDE}"/>`;
  k += `<path d="M${r(-w * 0.45)} ${r(-h * 0.15)} C${r(-w * 0.42)} ${r(-h * 0.5)} ${r(-w * 0.38)} ${r(-h * 0.85)} ${r(-w * 0.3)} ${r(-h * 1.12)}" stroke="#ecc79c" stroke-width="${r(e * 0.07)}" stroke-opacity=".55" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${r(-w * 0.17)} ${r(-h * 1.0)} C${r(-w * 0.1)} ${r(-h * 1.0)} ${r(0)} ${r(-h * 1.03)} ${r(w * 0.12)} ${r(-h * 1.0)}" stroke="#ecc79c" stroke-width="${r(e * 0.05)}" stroke-opacity=".45" fill="none" stroke-linecap="round"/>`;
  /* Regenrinnen, Kernschatten rechts, Luftlöcher, Erdkrümel */
  k += `<path d="M${r(-w * 0.05)} ${r(-h * 0.95)} q${r(-w * 0.03)} ${r(h * 0.45)} ${r(-w * 0.1)} ${r(h * 0.9)} M${r(w * 0.14)} ${r(-h * 0.9)} q${r(w * 0.02)} ${r(h * 0.4)} ${r(w * 0.08)} ${r(h * 0.85)} M${r(-w * 0.27)} ${r(-h * 1.05)} q${r(-w * 0.04)} ${r(h * 0.5)} ${r(-w * 0.1)} ${r(h * 1.0)}" stroke="#5e341c" stroke-width="${r(e * 0.035)}" stroke-opacity=".45" fill="none"/>`;
  k += `<path d="M${r(w * 0.28)} ${r(-h * 0.82)} C${r(w * 0.42)} ${r(-h * 0.5)} ${r(w * 0.47)} ${r(-h * 0.25)} ${r(w * 0.5)} 0 L${r(w * 0.34)} 0 C${r(w * 0.36)} ${r(-h * 0.3)} ${r(w * 0.34)} ${r(-h * 0.58)} ${r(w * 0.28)} ${r(-h * 0.82)} Z" fill="#43230f" opacity=".25"/>`;
  k += `<ellipse cx="${r(-w * 0.3)}" cy="${r(-h * 0.5)}" rx="${r(e * 0.06)}" ry="${r(e * 0.045)}" fill="#3a2010"/><ellipse cx="${r(w * 0.22)}" cy="${r(-h * 0.35)}" rx="${r(e * 0.05)}" ry="${r(e * 0.04)}" fill="#3a2010"/>`;
  { const zz = zufall(41); let kr = ""; for (let i = 0; i < 24; i++) { const u = -0.45 + zz() * 0.9, v = 0.1 + zz() * 0.75; kr += `M${r(u * w)} ${r(-v * h * (1 - Math.abs(u) * 0.9))}h${r(e * 0.05)}`; } k += `<path d="${kr}" stroke="#4e2a15" stroke-width="${r(e * 0.05)}" stroke-opacity=".3" stroke-linecap="round"/>`; }
  k += fussGras([[-w * 0.36, 0, e, 1.2], [w * 0.05, e * 0.04, e, 1.4], [w * 0.4, 0, e, 1.2], [-w * 0.42, -h * 0.35, e * 0.8, 0.4], [w * 0.4, -h * 0.4, e * 0.8, 0.4]]);
  S.teil({ id: "termitenhuegel", de: "der Termitenhügel", syl: "ter-MI-ten-hü-gel", it: "il termitaio", itSyl: "ter-mi-TA-io", en: "termite mound", x, y, kunst: k,
    tipp: "Termiten bauen ihren Hügel aus Erde und Speichel. Geparde stehen gern darauf und halten Ausschau." });
}
{
  const p = Q(TH.x + 2, 11.4, TH_OBEN - 0.03);
  /* oben: klein und auf einem größeren Ding (ANLEITUNG) – der Tipp zwischen die Beine trifft trotzdem den Gepard */
  tierTeil(S, "gepard", p.x, p.y, p.e, { dir: 1, oben: true,
    tipp: "Der Gepard ist das schnellste Landtier: Er läuft über 90 Kilometer pro Stunde – aber nur kurz." });
}
{
  /* Nilpferd im Wasserloch: Fußpunkt 0,62 m unter dem Wasserspiegel; das Wasser vor Bauch und Beinen
     ist auf die Form des Wasserlochs geschnitten und leicht durchscheinend (trübes Wasser) */
  const w = Q(212, 12.6), tief = 0.62 * w.e, hx = w.x, hy = w.y + tief;
  const g = S.lg("wasser2", WASSER_STOPS, 0, r(WL.cy - WL.ry - hy), 0, r(WL.cy + WL.ry - hy), US);
  const cid = S.id("teichclip");
  S.def(`<clipPath id="${cid}"><path d="${TEICH.wasser}" transform="translate(${r(-hx)} ${r(-hy)})"/></clipPath>`);
  const L = 2.45 * w.e;
  let dv = `<g clip-path="url(#${cid})"><rect x="${r(-L)}" y="${r(-tief)}" width="${r(2 * L)}" height="${r(tief + 14)}" fill="${g}" fill-opacity=".93"/>`;
  dv += `<path d="M${r(-L * 0.62)} ${r(-tief + 0.1)} C${r(-L * 0.4)} ${r(-tief - 0.9)} ${r(L * 0.3)} ${r(-tief - 0.9)} ${r(L * 0.6)} ${r(-tief + 0.1)}" stroke="#f4f9f9" stroke-opacity=".75" stroke-width=".45" fill="none"/>`;
  dv += `<path d="M${r(-L * 0.75)} ${r(-tief + 1.4)}h${r(L * 0.35)}M${r(-L * 0.1)} ${r(-tief + 2.4)}h${r(L * 0.45)}M${r(L * 0.35)} ${r(-tief + 1.2)}h${r(L * 0.3)}" stroke="#e8f2f2" stroke-opacity=".5" stroke-width=".35"/></g>`;
  tierTeil(S, "nilpferd", hx, hy, w.e, { dir: -1, schatten: false, davor: dv,
    tipp: "Am Tag bleibt das Nilpferd im Wasser, damit seine empfindliche Haut nicht austrocknet. Nachts frisst es an Land Gras." });
}
/* ---------- vorne links: der Kopje mit Löwe und Löwin ------------------- */
const KO = Q(60, 9.4);
const KOPJE_OBEN = 1.45;      // Höhe der Liegefläche oben (m)
{
  const { x, y, e } = KO;
  let k = bodenSchatten(e * 1.2, e * 0.12, e * 2.6, e * 0.32, 0.95);
  k += block(-e * 1.5, e * 0.02, e * 1.6, e * 0.9, 9, 2.6);
  k += block(e * 0.1, 0, e * 3.0, e * KOPJE_OBEN, 2, 3.4);
  k += block(e * 1.85, e * 0.12, e * 1.3, e * 0.6, 5, 2.4);
  k += block(-e * 0.8, e * 0.1, e * 1.0, e * 0.42, 13, 2.2);
  k += fussGras([[-e * 1.8, e * 0.1, e, 1.0], [-e * 0.4, e * 0.1, e, 1.2], [e * 1.4, e * 0.14, e, 1.2]]);
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x, y, kunst: k,
    tipp: "In der Serengeti heißen diese Granitfelsen Kopjes. Löwen liegen dort gern im Schatten und schauen über das Land." });
}
{
  const p = Q(KO.x + 2, 9.4, KOPJE_OBEN - 0.02);
  tierTeil(S, "loewe", p.x, p.y, p.e, { dir: 1,
    tipp: "Nur der männliche Löwe hat eine Mähne. Löwen leben in Gruppen, man nennt sie Rudel." });
}
{
  const p = Q(44, 7.3);
  tierTeil(S, "loewin", p.x, p.y, p.e, { dir: 1, davor: fussGras([[0, 0, p.e, 1.8]]),
    tipp: "Meistens jagen die Löwinnen – oft gemeinsam und in der Dämmerung." });
}
/* ---------- rechts vorn: die Akazie, hoch im Baum der Leopard ------------ */
const AK = Q(262, 11);
const AST = 3.3;             // der Ast liegt knapp unter Augenhöhe: der Leopard steht vor Horizont und Bergen, frei von den Tieren der Ebene
{
  const { x, y, e } = AK;
  S.teil({ id: "akazie", de: "die Akazie", syl: "a-KA-zie", it: "l'acacia", itSyl: "a-CA-cia", en: "acacia", x: 0, y: 0,
    kunst: akazie(x, y, e, 6.0, 4.3, { ast: AST, astSeite: -1, astLang: 2.2, unten: 0.8, seed: 11 }),
    tipp: "Die Schirmakazie hat lange, weiße Dornen. Giraffen fressen ihre Blätter trotzdem – mit ihrer langen Zunge." });
}
{
  const p = Q(AK.x - 1.4 * AK.e, 11, AST + 0.12);
  /* oben: klein und im Baum (ANLEITUNG) – sonst fängt der Berg dahinter den Tipp zwischen seinen Beinen */
  tierTeil(S, "leopard", p.x, p.y, p.e, { dir: -1, oben: true,
    tipp: "Der Leopard ist sehr stark: Er trägt seine Beute auf einen Baum. Dort können Löwen und Hyänen sie nicht stehlen." });
}
/* ---------- ganz vorne: die Hyäne und das Gras -------------------------- */
{
  const p = Q(206, 6.9);
  tierTeil(S, "hyaene", p.x, p.y, p.e, { dir: -1, davor: fussGras([[0, 0, p.e, 1.6]]),
    tipp: "Die Tüpfelhyäne jagt das meiste Futter selbst. Ihr Ruf klingt wie ein Lachen." });
}
{
  /* DAS GRAS — ein Horst Rotes Hafergras vorne: feine, gebogene Halme; an den Spitzen kleine rötliche Ährchen
     (Themeda: nickende Ährchenbüschel), unten dunkler, oben sonnig */
  const x = 122, y = 199.5, e = E(199.5), z = zufall(77);
  let d1 = "", d2 = "", d3 = "", ae = "";
  for (let i = 0; i < 56; i++) {
    const bx = x + (z() - 0.5) * e * 0.8, h = e * (0.4 + z() * 0.6), dx = (z() - 0.5) * e * 0.8;
    const p = `M${r(bx)} ${r(y)}Q${r(bx + dx * 0.08)} ${r(y - h * 0.65)} ${r(bx + dx)} ${r(y - h)}`;
    if (i % 3 === 0) d1 += p; else if (i % 3 === 1) d2 += p; else d3 += p;
    if (i % 2 === 0) { const ex = bx + dx, ey = y - h; for (let j = 0; j < 3; j++) ae += `M${r(ex + (dx > 0 ? 1 : -1) * e * 0.012 * j)} ${r(ey + e * 0.03 * j)}h.01`; }
  }
  const k = bodenSchatten(x + e * 0.2, y, e * 0.6, e * 0.07, 0.7) +
    `<path d="${d1}" stroke="#86622e" stroke-width="${r(e * 0.012)}" fill="none" stroke-linecap="round"/>` +
    `<path d="${d3}" stroke="#bb7a4c" stroke-width="${r(e * 0.011)}" fill="none" stroke-linecap="round"/>` +
    `<path d="${d2}" stroke="#e2c784" stroke-width="${r(e * 0.011)}" fill="none" stroke-linecap="round"/>` +
    `<path d="${ae}" stroke="#a8714a" stroke-opacity=".8" stroke-width="${r(e * 0.018)}" stroke-linecap="round"/>`;
  S.teil({ id: "gras", de: "das Gras", syl: "GRAS", it: "l'erba", itSyl: "ER-ba", en: "grass", x: 0, y: 0, kunst: k,
    tipp: "Nach dem Regen wächst das Gras sehr schnell. Dann kommen die großen Herden. In der Trockenzeit wird es gelb." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tiere_savanne.js"));
console.log(aus);
