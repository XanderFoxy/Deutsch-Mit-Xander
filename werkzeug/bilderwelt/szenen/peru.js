#!/usr/bin/env node
/* =====================================================================
   PERU – MACHU PICCHU (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (Lagepläne des Santuario Histórico, UNESCO-Beschreibung,
   Reiseführer zum „Circuito 1“, Beschreibungen der Casa del Guardián,
   Fotos des Postkartenblicks, Besucherregeln der SERNANP):
   - STANDORT: die obere Terrasse beim WÄCHTERHAUS (Casa del Guardián,
     Caretaker's Hut) im Südosten über der Ruinenstadt, rund 2 500 m hoch.
     Von hier stammt das Postkartenfoto. Der Blick geht nach
     NORDNORDWEST (nicht nach Süden): Die Stadt liegt auf dem Sattel
     zwischen dem Berg Machu Picchu (in unserem Rücken) und dem HUAYNA
     PICCHU (2 720 m, rund 290 m über der Stadt), der als steiler
     Zuckerhut dahinter aufragt. Vor seinem Fuß links der kleine,
     runde Huchuy Picchu.
   - Das Wächterhaus: kleines Haus aus groben Feldsteinen mit Lehmmörtel,
     drei Wände und eine offene Langseite, steiles Strohdach (Ichu-Gras,
     rekonstruiert), Giebel mit Steinringen zum Festbinden des Dachs,
     trapezförmige Nischen und Türen — typisch für die Inka: unten breiter
     als oben, das hält bei Erdbeben.
   - Die STADT (2 430 m, 15. Jh., unter Inka Pachacútec): links (Westen)
     der obere Sektor (Hanan) mit dem SONNENTEMPEL (Torreón: halbrunder
     Turm aus fugenlos geschliffenen Granitblöcken, zwei trapezförmige
     Fenster), dahinter der Hügel des Intihuatana (Stufenhügel mit dem
     „Sonnenstein“ oben); in der Mitte der lange, grüne HAUPTPLATZ;
     rechts (Osten) der untere Sektor (Hurin) mit dicht gereihten
     Wohnhäusern — die Dächer fehlen, die hohen GIEBEL stehen noch;
     einige Häuser haben wieder ein Strohdach. Ganz hinten der Heilige
     Felsen am Fuß des Huayna Picchu. Rund um die Stadt Hunderte
     TERRASSEN mit Stützmauern; auf ihnen bauten die Inka Mais und
     Kartoffeln an. Zwischen Landwirtschafts- und Stadtteil ein Graben.
   - Ringsum steile, grün bewaldete Berge (Nebelwald) und die tiefe
     Schlucht des URUBAMBA (rund 450 m tiefer), der die Stadt in einer
     großen Schleife umfließt. Rechts (Osten) jenseits des Flusses der
     Putucusi (rundlicher Berg mit Felswänden); auf unserer Seite
     schlängelt sich die Straße Hiram Bingham in SERPENTINEN zum Fluss
     hinab — dort fahren die grün-weißen Pendelbusse nach Aguas
     Calientes. Morgens hängen NEBELFETZEN in der Schlucht.
   - Tiere und Pflanzen: LAMAS weiden auf den Terrassen (eine kleine
     Herde lebt dort und „mäht“ das Gras), dazu Kolibris und über 400
     Orchideenarten; am Weg blüht die rosa-violette Orchidee „Wiñay
     Wayna“ (Quechua: „ewig jung“, Epidendrum secundum).
   - Menschen: Besucher kommen mit Führer und auf festen Rundwegen;
     Musikinstrumente spielen ist verboten. Viele tragen Andenkenkleidung
     aus Cusco: die CHULLO-Mütze (gestrickt, mit Ohrenklappen, Bommeln
     und Mustern) und den PONCHO aus Alpakawolle (in der Gegend von
     Cusco oft rot mit bunten Streifen). Das Mädchen hält eine
     PANFLÖTE (Siku/Zampoña) aus dem Markt von Aguas Calientes in der
     Hand — sie spielt hier nicht.
   KAMERA: Augenhöhe = Terrasse am Wächterhaus (0 m), Horizont y = 105,
   Brennweite 330: Punkt in d Metern Entfernung, h Metern Höhe (relativ
   zum Auge) und s Metern seitlich: x = 200 + 330·s/d, y = 105 − 330·h/d.
   Huayna-Picchu-Gipfel: d ≈ 1 000 m, h = +220 m → y ≈ 32. Hauptplatz:
   d ≈ 420 m, h ≈ −85 m → y ≈ 172. Die nahen Terrassen liegen 6–12 m
   unter uns (Lamas d ≈ 25 m, Besucher d ≈ 18 m, beide ≈ 30–40 Einheiten).
   LICHT: Morgen, etwa 9 Uhr im Oktober — die Sonne steht im Ostnordosten,
   rund 45° hoch, also RECHTS und etwas hinter uns. Ostseiten (rechts)
   hell und warm, Westseiten (links) kühl im Schatten; Schatten fallen
   nach links und etwas in die Tiefe. Der Putucusi liegt im Gegenlicht.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "peru", titel: "Peru – Machu Picchu", emoji: "🦙", thema: "Länder", kuerzel: "per", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
const rnd = zufall(1450);
const r = B.r;
const HOR = 105, F = 330, CX = 200;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const P = (pts, zu = true) => "M" + pts.map(([x, y]) => r(x) + " " + r(y)).join(" L") + (zu ? " Z" : "");
/* dasselbe relativ (kürzer, packt besser): Differenzen der gerundeten Punkte, also ohne Rundungsdrift */
const Pr = (pts, zu = true) => { let o = "", px = 0, py = 0; pts.forEach(([x, y], i) => { const X0 = r(x), Y0 = r(y); o += i ? `l${r(X0 - px)} ${r(Y0 - py)}` : `M${X0} ${Y0}`; px = X0; py = Y0; }); return (o + (zu ? "z" : "")).replace(/ -/g, "-"); };
/* glatte Kurve (Catmull-Rom) durch Punkte */
const glatt = (pts, zu = true, k = 1) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  const n = pts.length, q = (i) => pts[zu ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6 * k)} ${r(p1[1] + (p2[1] - p0[1]) / 6 * k)} ${r(p2[0] - (p3[0] - p1[0]) / 6 * k)} ${r(p2[1] - (p3[1] - p1[1]) / 6 * k)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
/* Linie zwischen zwei Punkten mit kleinen Zacken (Kamm, Felskante) */
const zacken = (a, b, n, amp, seed) => {
  const z = zufall(seed), o = [];
  for (let i = 0; i <= n; i++) { const t = i / n; o.push([a[0] + (b[0] - a[0]) * t + (i && i < n ? (z() - 0.5) * amp * 0.6 : 0), a[1] + (b[1] - a[1]) * t + (i && i < n ? (z() - 0.5) * amp : 0)]); }
  return o;
};
const lerp = (a, b, t) => a + (b - a) * t;
/* Pfade mit absoluten Befehlen an den Bildrand klemmen (0…400 × …260), damit kein Teil aus dem Bild ragt */
const kappeRand = (svg, x0 = -0.5, x1 = 400.5, y1 = 260.5) => svg.replace(/<path d="M(-?[\d.]+)[ ,](-?[\d.]+)[^"]*[a-df-z][^"]*"[^>]*\/>/g, (el, x, y) => (+x < -1 || +x > 401 || +y > 261 ? "" : el)).replace(/ d="([MLCQSZ\d\s.,-]+)"/g, (m0, d) => {
  let i = 0; return ` d="${d.replace(/-?\d*\.?\d+/g, (z) => { const v = +z, o = i++ % 2 ? Math.min(y1, v) : Math.max(x0, Math.min(x1, v)); return String(r(o)); })}"`;
});
/* Höhenlinie eines Profils (Punkte von links nach rechts) an der Stelle x */
const profilY = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; if (x >= x0 && x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1); } return x < pts[0][0] ? pts[0][1] : pts[pts.length - 1][1]; };

/* Figuren aus B.mensch schlank machen (Ladezeit!): Zahlen außerhalb von transform auf ganze Zentimeter der Figur
   runden (Kurven bleiben Kurven), winzige Teile (< min cm) und feine Linien weglassen, Verläufe auf 3 Stufen kürzen */
const vereinfache = (svg, grenze = 0.25, min = 2.8) => {
  svg = svg.replace(/<(path|ellipse|line|circle)\b[^>]*?\/>/g, (el) => {
    const sw = el.match(/stroke-width="([\d.]+)"/);
    if (/fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze) return "";
    const d = el.match(/ d="([^"]*)"/);
    if (d && !/[a-df-z]/.test(d[1])) { const v = (d[1].match(/-?\d*\.?\d+/g) || []).map(Number), xs = v.filter((_, i) => i % 2 === 0), ys = v.filter((_, i) => i % 2); if (xs.length > 1 && Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < min) return ""; }
    const rr = el.match(/ (?:r|rx)="([^"]*)"/); if (rr && !d && +rr[1] * 2 < min * 0.5) return "";
    return el;
  });
  svg = svg.replace(/(<(?:linear|radial)Gradient\b[^>]*>)((?:<stop[^>]*\/>)+)/g, (m, kopf, stops) => { const st = stops.match(/<stop[^>]*\/>/g); if (st.length <= 3) return m; return kopf + [st[0], st[Math.floor(st.length / 2)], st[st.length - 1]].join(""); });
  /* reine Linienzüge (nur M/L/Z): Douglas–Peucker mit 0,6 cm Toleranz — dichte Punktreihen werden kurz */
  const dp = (p, eps) => { if (p.length < 3) return p; const [a, b] = [p[0], p[p.length - 1]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1e-9; let mi = 0, md = 0; for (let j = 1; j < p.length - 1; j++) { const dd = Math.abs((p[j][0] - a[0]) * dy - (p[j][1] - a[1]) * dx) / l; if (dd > md) { md = dd; mi = j; } } return md > eps ? dp(p.slice(0, mi + 1), eps).slice(0, -1).concat(dp(p.slice(mi), eps)) : [a, b]; };
  /* Kurven (C/S/Q, absolut) in Punktfolgen wandeln: je Abschnitt Mitte und Ende — danach greift Douglas–Peucker */
  svg = svg.replace(/ d="([MLCSQZ\d\s.,-]+)"/g, (m0, d) => {
    if (!/[CSQ]/.test(d)) return m0;
    const tok = d.match(/[A-Z]|-?\d*\.?\d+/g) || []; let o = "", i = 0, cmd = "", cx = 0, cy = 0, px = 0, py = 0;
    const n = (k) => +tok[i + k];
    while (i < tok.length) {
      if (/[A-Z]/.test(tok[i])) { cmd = tok[i++]; if (cmd === "Z") { o += "Z"; continue; } }
      if (cmd === "M" || cmd === "L") { o += (cmd === "M" ? "M" : "L") + n(0) + " " + n(1); cx = n(0); cy = n(1); px = cx; py = cy; i += 2; if (cmd === "M") cmd = "L"; }
      else if (cmd === "C") { const mx = (cx + 3 * n(0) + 3 * n(2) + n(4)) / 8, my = (cy + 3 * n(1) + 3 * n(3) + n(5)) / 8; o += `L${mx} ${my}L${n(4)} ${n(5)}`; px = n(2); py = n(3); cx = n(4); cy = n(5); i += 6; }
      else if (cmd === "S") { const c1x = 2 * cx - px, c1y = 2 * cy - py, mx = (cx + 3 * c1x + 3 * n(0) + n(2)) / 8, my = (cy + 3 * c1y + 3 * n(1) + n(3)) / 8; o += `L${mx} ${my}L${n(2)} ${n(3)}`; px = n(0); py = n(1); cx = n(2); cy = n(3); i += 4; }
      else if (cmd === "Q") { const mx = (cx + 2 * n(0) + n(2)) / 4, my = (cy + 2 * n(1) + n(3)) / 4; o += `L${mx} ${my}L${n(2)} ${n(3)}`; cx = n(2); cy = n(3); i += 4; }
      else return m0;
    }
    return ` d="${o}"`;
  });
  svg = svg.replace(/ d="([MLZ\d\s.,-]+)"/g, (m0, d) => {
    const teile = d.split(/(?=M)/).map((seg) => { const zu = /Z/.test(seg), v = (seg.match(/-?\d*\.?\d+/g) || []).map(Number), p = []; for (let i = 0; i + 1 < v.length; i += 2) p.push([v[i], v[i + 1]]); let q; if (p.length > 3) { let mi = 0, md = -1; for (let j = 1; j < p.length; j++) { const dd = Math.hypot(p[j][0] - p[0][0], p[j][1] - p[0][1]); if (dd > md) { md = dd; mi = j; } } q = dp(p.slice(0, mi + 1), 0.9).slice(0, -1).concat(dp(p.slice(mi), 0.9)); } else q = p; return q.length ? "M" + q.map(([x, y]) => Math.round(x) + " " + Math.round(y)).join("L") + (zu ? "Z" : "") : ""; });
    return ` d="${teile.join("")}"`;
  });
  return svg.split(/(transform="[^"]*"|<path d="[^"]*[a-df-z][^"]*")/).map((t, i) => i % 2 ? t : t.replace(/ (d|cx|cy|r|rx|ry|x|y|x1|y1|x2|y2|width|height)="([^"]*)"/g, (m0, n, v) => ` ${n}="${v.replace(/-?\d+\.\d+/g, (z) => String(Math.round(parseFloat(z))))}"`)).join("");
};

/* ---------- Filter und Stoffe ---------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-60%" width="160%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-30%" y="-60%" width="160%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".8"/></filter>`);
/* Volumen: Lichtkante innen an der Sonnenseite (rechts oben), Eigenschatten innen links unten */
const volumen = (name, licht, schat, dx = 0.35, a1 = 0.75, a2 = 0.35) => {
  S.def(`<filter id="${S.id(name)}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="${-dx}" dy="${dx * 0.55}" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="kante"/><feFlood flood-color="${licht}" flood-opacity="${a1}"/><feComposite in2="kante" operator="in" result="l"/><feOffset in="SourceAlpha" dx="${dx * 1.6}" dy="${-dx}" result="w"/><feComposite in="SourceAlpha" in2="w" operator="out" result="kante2"/><feFlood flood-color="${schat}" flood-opacity="${a2}"/><feComposite in2="kante2" operator="in" result="s"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="l"/></feMerge></filter>`);
  return `url(#${S.id(name)})`;
};
const VOL_FIGUR = volumen("volfigur", "#ffd892", "#1d2a3a", 0.55, 0.85, 0.3);
const VOL_STEIN = volumen("volstein", "#fff4dc", "#2e2a24", 0.3, 0.8, 0.3);
const VOL_KLEIN = volumen("volklein", "#fff3d6", "#203040", 0.18, 0.75, 0.3);
const VOL_BERG = volumen("volberg", "#f6eab8", "#10241c", 0.9, 0.55, 0.25);
/* Waldkronen als unregelmäßige Kachel: jede Krone mit Lichtseite rechts oben und Schatten links unten */
const kronen = (w, h, n, seed, rmin, rmax) => {
  const z = zufall(seed); let a = "", b = "";
  for (let i = 0; i < n; i++) {
    const x = z() * w, y = z() * h, rr = rmin + z() * (rmax - rmin);
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
      const cx = x + dx, cy = y + dy; if (cx < -rr || cx > w + rr || cy < -rr || cy > h + rr) continue;
      a += `<circle cx="${r(cx - rr * 0.25)}" cy="${r(cy + rr * 0.3)}" r="${r(rr)}"/>`;
      b += `<circle cx="${r(cx + rr * 0.3)}" cy="${r(cy - rr * 0.3)}" r="${r(rr * 0.55)}"/>`;
    }
  }
  return `<g fill="#0e1f14" opacity=".16">${a}</g><g fill="#e8f0b0" opacity=".11">${b}</g>`;
};
/* Waldtextur wächst mit der Nähe: nah 1,0 — Osthang 0,8 — Huayna Picchu 0,6 — Putucusi 0,5 — Westkette 0,35 */
const waldMuster = (name, f, seed) => { S.def(`<pattern id="${S.id(name)}" width="${r(19 * f)}" height="${r(13 * f)}" patternUnits="userSpaceOnUse">${kronen(r(19 * f), r(13 * f), 24, seed, 0.8 * f, 1.5 * f)}</pattern>`); return `url(#${S.id(name)})`; };
const WALD1 = waldMuster("wald1", 1, 7), WALD08 = waldMuster("wald08", 0.8, 8), WALD06 = waldMuster("wald06", 0.6, 9), WALD05 = waldMuster("wald05", 0.5, 10), WALD035 = waldMuster("wald035", 0.35, 11);
S.def(`<pattern id="${S.id("gras")}" width="5" height="2.6" patternUnits="userSpaceOnUse"><path d="M.6 2.3l.2-.9M1.9 1.4l-.2-.8M3.2 2.4l.3-1M4.3 1.1l-.25-.8M2.6.6l.1-.5" stroke="#d6e98a" stroke-width=".22" opacity=".45"/><path d="M1.2 2.5l-.1-.7M3.8 2.2l.2-.6" stroke="#2f5420" stroke-width=".25" opacity=".35"/></pattern>`);
S.def(`<pattern id="${S.id("stroh")}" width="2" height="2.6" patternUnits="userSpaceOnUse"><rect width="2" height="2.6" fill="#b48e4e"/><path d="M.3 0 L.5 2.6 M1.1 0 L1.2 2.6 M1.7 0 L1.6 2.6" stroke="#d9b874" stroke-width=".28"/><path d="M.8 0 L.85 2.6" stroke="#7d5e2c" stroke-width=".22"/></pattern>`);
const WALD = WALD05, WALDF = WALD1, GRAS = `url(#${S.id("gras")})`, STROH = `url(#${S.id("stroh")})`;
const GRANIT_L = S.lg("granitl", [[0, "#e8d9bb"], [1, "#c9b99d"]]);         /* Ostflächen im Morgenlicht */
const GRANIT_S = S.lg("granits", [[0, "#8a8379"], [1, "#746d64"]]);         /* Westflächen im Schatten */
const GRANIT_F = S.lg("granitf", [[0, "#bab3a5"], [1, "#9d968a"]]);         /* Südflächen (zu uns), streifendes Licht */
const INNEN = "#3d3a34";
const RASEN = S.lg("rasen", [[0, "#9cc35a"], [1, "#78a646"]]);
const RASEN_D = S.lg("rasend", [[0, "#6f9a42"], [1, "#557f34"]]);

/* =====================================================================
   KULISSE — Morgenhimmel (Sonne rechts außerhalb des Bildes), ferne Kämme
   ===================================================================== */
S.hinten(`<rect width="400" height="200" fill="${S.lg("himmel", [[0, "#3569ae"], [0.45, "#6f9fd2"], [0.78, "#b3cde2"], [1, "#e9e9df"]])}"/>`);
S.hinten(`<rect width="400" height="200" fill="${S.lg("himmelseite", [[0, "#ffffff", 0], [0.75, "#fff3dc", 0], [1, "#fff3dc", 0.22]], 0, 0, 1, 0)}"/>`);
/* fernste Kämme (Cordillera Vilcabamba): gezackt, dunstig, Ostflanken mit feiner Lichtkante */
const KAMM_A = [];
{ const z = zufall(77); for (let x = -2; x <= 402; x += 5 + z() * 6) { const basis = 86 + 6 * Math.sin(x / 47) + 3 * Math.sin(x / 19 + 1); KAMM_A.push([x, basis + (z() - 0.5) * 4]); } }
S.hinten(`<path d="${P([...KAMM_A, [402, 140], [-2, 140]])}" fill="${S.lg("kammA", [[0, "#a5b8cb"], [1, "#c7d6e0"]])}"/>`);
{ let l = ""; for (let i = 0; i < KAMM_A.length - 1; i++) { const [x0, y0] = KAMM_A[i], [x1, y1] = KAMM_A[i + 1]; if (y1 > y0) l += `M${r(x0)} ${r(y0 + 0.5)} L${r(x1 - 0.3)} ${r(y1 + 0.3)}`; } S.hinten(`<path d="${l}" stroke="#eef2f4" stroke-width=".6" opacity=".7"/>`); }

/* =====================================================================
   1 — DIE WOLKE (flache, stilisierte Bänder wie in mexiko; Sonne rechts: Rand rechts warm)
   ===================================================================== */
const wolke = (name, cx, by, W0, H, seed) => {
  const z = zufall(seed), n = 5 + Math.floor(z() * 2), teile = [];
  let summe = 0; for (let i = 0; i < n; i++) { const w = 0.6 + z() * 0.8; teile.push(w); summe += w; }
  let d = `M${r(cx - W0 / 2)} ${r(by)}`, x = cx - W0 / 2;
  teile.forEach((w, i) => { const b = W0 * w / summe, t = (x + b / 2 - (cx - W0 / 2)) / W0, prof = 1 - Math.pow(2 * t - 1, 2) * 0.85, hh = H * prof * (0.8 + z() * 0.3); x += b; d += ` A${r(b / 2)} ${r(hh)} 0 0 1 ${r(x)} ${r(by - (i < n - 1 ? H * 0.22 * prof : 0))}`; });
  d += ` Q${r(cx)} ${r(by + H * 0.1)} ${r(cx - W0 / 2)} ${r(by)} Z`;
  const g = S.lg(name + "g", [[0, "#ffffff"], [0.6, "#eef3f8"], [1, "#b8c7d8"]], 0, r(by - H * 1.1), 0, r(by), ' gradientUnits="userSpaceOnUse"');
  return `<path d="${d}" fill="${g}"/><path d="M${r(cx - W0 * 0.45)} ${r(by + 0.3)} Q${r(cx)} ${r(by + H * 0.1 + 0.3)} ${r(cx + W0 * 0.46)} ${r(by + 0.2)}" stroke="#9fb0c4" stroke-width=".5" fill="none" opacity=".6"/>`;
};
{
  let k = wolke("w1", 60, 34, 68, 8, 3) + wolke("w2", 318, 24, 52, 6, 5);
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 60, y: 28, kunst: um(60, 28, k) });
}

/* Fels: Felsband entlang des Hangs (für Putucusi und kleine Platten) */
let FELS_N = 0;
const fels = (x, y, w, h, seed, hell = "#b3b2a4", dunkel = "#6f7671", gruen = "#4f7d48") => {
  const z = zufall(seed), pts = [], n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, rx = w / 2 * (0.75 + z() * 0.35), ry = h / 2 * (0.8 + z() * 0.3);
    pts.push([x + w / 2 + Math.cos(a) * rx + (Math.sin(a) > 0 ? -w * 0.08 : w * 0.08), y + h / 2 + Math.sin(a) * ry]);
  }
  const g = S.lg("fels" + (FELS_N++), [[0, dunkel], [0.55, dunkel], [0.62, hell], [1, hell]], 0, 0, 1, 0.25);
  let o = `<path d="${glatt(pts, true, 0.7)}" fill="${g}"/>`;
  let st = ""; for (let i = 0; i < 6; i++) { const cx = x + w * (0.12 + 0.15 * i + z() * 0.05); st += `M${r(cx)} ${r(y + h * 0.12)} l${r((z() - 0.5) * w * 0.05)} ${r(h * (0.55 + z() * 0.3))}`; }
  o += `<path d="${st}" stroke="#2f3532" stroke-width=".28" opacity=".5"/>`;
  for (let i = 0; i < 4; i++) { const t = z(); const px = x + w * (0.1 + t * 0.8), py = y + (i < 2 ? h * 0.05 : h * (0.85 + z() * 0.1)); o += `<ellipse cx="${r(px)}" cy="${r(py)}" rx="${r(w * (0.12 + z() * 0.08))}" ry="${r(h * 0.06 + 0.4)}" fill="${gruen}"/>`; }
  return o;
};
/* langes, schmales Granitband in Fall-Linie mit senkrechten Streifen (Huayna-Picchu-Wände) */
const wand = (pts, breite, hell, dunkel, seed) => {
  const z = zufall(seed), dicht = []; for (let i = 0; i < pts.length - 1; i++) for (let t = 0; t < 1; t += 0.34) dicht.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]); dicht.push(pts[pts.length - 1]);
  const n0 = dicht.length - 1, li = dicht.map(([x, y], i) => [x - breite * (0.25 + 0.3 * Math.sin(Math.PI * i / n0)) * (0.7 + z() * 0.6), y]), re = dicht.map(([x, y], i) => [x + breite * (0.25 + 0.3 * Math.sin(Math.PI * i / n0)) * (0.7 + z() * 0.6), y]).reverse();
  let o = `<path d="${glatt([...li, ...re], true, 0.7)}" fill="${S.lg("wand" + seed, [[0, dunkel], [0.6, dunkel], [1, hell]], 0, 0, 1, 0)}"/>`;
  let st = ""; for (let i = 0; i < 4; i++) { const t = (i + 0.5) / 4; st += `M${r(pts[0][0] - breite * 0.5 + breite * t)} ${r(pts[0][1] + 1)} L${r(pts[pts.length - 1][0] - breite * 0.5 + breite * t + (z() - 0.5))} ${r(pts[pts.length - 1][1] - 1)}`; }
  return o + `<path d="${st}" stroke="#3a403c" stroke-width=".25" opacity=".55"/>`;
};

/* =====================================================================
   2 — DER BERG: links die Westkette (gestaffelte Grate, Luftperspektive), rechts der Putucusi im Gegenlicht
       mit seiner großen Plattenwand, darunter der nahe Osthang zum Fluss
   ===================================================================== */
const KAMM_B = [[-2, 44], [14, 41], [30, 44], [46, 50], [62, 52], [80, 60], [98, 66], [114, 74], [128, 84], [140, 96], [150, 108], [158, 120], [164, 134], [168, 150]];
const PUTU = [[278, 150], [290, 126], [300, 110], [312, 98], [326, 88], [342, 82], [356, 80], [368, 82], [382, 88], [394, 92], [402, 94]];
{
  let k = "";
  /* drei gestaffelte Grate: hinten blaugrau und flau, vorn etwas satter */
  const grate = [
    [KAMM_B, ["#6a8c86", "#5c7f76", "#749690"], 1],
    [[[-2, 84], [22, 80], [46, 88], [70, 98], [92, 110], [112, 124], [130, 140], [146, 158], [156, 180]], ["#557a64", "#4a6f58", "#628470"], 2],
    [[[-2, 124], [24, 120], [48, 128], [72, 140], [92, 156], [106, 176], [112, 196]], ["#4a6e54", "#3f644a", "#56785c"], 3],
  ];
  for (const [kamm, [c0, c1, c2], sd] of grate) {
    const dk = P([...kamm, [kamm[kamm.length - 1][0] + 6, 262], [-2, 262]]);
    k += `<path d="${dk}" fill="${S.lg("grat" + sd, [[0, c0], [0.5, c1], [1, c2]])}"/><path d="${dk}" fill="${sd === 1 ? WALD035 : WALD05}" opacity="${sd === 1 ? 0.6 : 0.8}"/>`;
    /* Seitengrate schräg nach links unten: Lichtsaum rechts innen, Schattenrinne links */
    const z = zufall(sd * 13);
    for (let i = 0; i < 3; i++) {
      const x0 = 20 + i * 42 + z() * 16, y0 = profilY(kamm, x0) + 1;
      const pts = [[x0, y0]]; for (let j = 1; j <= 4; j++) pts.push([x0 - j * (7 + z() * 3), y0 + j * (9 + z() * 4)]);
      k += `<path d="${glatt(pts, false)}" stroke="#c8dcc4" stroke-width=".45" fill="none" opacity=".3"/>`;
      k += `<path d="${glatt(pts.map(([a, b]) => [a - 1.4, b + 0.6]), false)}" stroke="#203a30" stroke-width="1.2" fill="none" opacity="${0.22}"/>`;
    }
    /* Morgenlicht von rechts: warmer Saum auf den nach Osten gewandten (rechts abfallenden) Gratstücken */
    { let sa = ""; for (let i = 0; i < kamm.length - 1; i++) if (kamm[i + 1][1] > kamm[i][1]) sa += `M${r(kamm[i][0])} ${r(kamm[i][1] + 0.5)}L${r(kamm[i + 1][0])} ${r(kamm[i + 1][1] + 0.5)}`; k += `<path d="${sa}" stroke="#f4d89c" stroke-width="${sd === 1 ? 0.5 : 0.7}" fill="none" opacity="${sd === 1 ? 0.55 : 0.45}"/>`; }
    /* Luftperspektive: Dunst nach unten in die Schlucht */
    k += `<path d="${dk}" fill="${S.lg("gratdunst" + sd, [[0, "#d9e5ec", 0.2 - sd * 0.05], [0.6, "#dfe9ef", 0.15], [1, "#eef3f4", 0.35]])}"/>`;
  }
  /* Putucusi: Gegenlicht — dunkel, mit einer großen, nackten Plattenwand in der oberen Mitte */
  const putD = glatt([...PUTU, [402, 262], [300, 262], [284, 180]], true, 0.9);
  k += `<path d="${putD}" fill="${S.lg("putucusi", [[0, "#3c5e4f"], [0.6, "#355647"], [1, "#5c7d71"]])}"/>`;
  k += `<path d="${putD}" fill="${WALD05}"/>`;
  k += `<g opacity=".8">${wand([[340, 86], [337, 98], [334, 112], [333, 126]], 20, "#8e9893", "#5b6862", 31)}</g>`;
  k += wand([[362, 90], [364, 102], [366, 114]], 9, "#8d9792", "#56625c", 32) + wand([[318, 104], [316, 114]], 7, "#87918c", "#55615b", 33);
  k += `<path d="M300 110 Q330 84 356 80.4 Q380 82 402 94" stroke="#fbeec8" stroke-width=".7" fill="none" opacity=".7" transform="translate(0 .7)"/>`;
  k += `<path d="${putD}" fill="${S.lg("putudunst", [[0, "#dfe9ef", 0], [0.55, "#dfe9ef", 0.1], [1, "#dfe9ef", 0.6]])}"/>`;
  /* naher Osthang (unsere Seite) fällt von der Stadt nach rechts unten zum Fluss: kühler, dunstiger als der Vordergrund */
  const OST = [[312, 262], [314, 210], [322, 186], [334, 172], [350, 170], [372, 178], [392, 186], [402, 190], [402, 246], [330, 250]];
  k += `<path d="${glatt(OST, true, 0.6)}" fill="${S.lg("osthang", [[0, "#4d7454"], [1, "#2f5240"]])}"/><path d="${glatt(OST, true, 0.6)}" fill="${WALD08}" opacity=".85"/>`;
  k += `<path d="${glatt(OST, true, 0.6)}" fill="${S.lg("ostdunst", [[0, "#e3ecf0", 0.25], [1, "#e3ecf0", 0.05]])}"/>`;
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 352, y: 80, kunst: um(352, 80, kappeRand(k)),
    tipp: "Rechts gegenüber liegt der Berg Putucusi mit seinen glatten Felswänden. Dazwischen fließt tief unten der Urubamba." });
}

/* =====================================================================
   3 — DER FLUSS (Urubamba): rechts unten mit der Brücke Puente Ruinas, links unten im Talgrund
   ===================================================================== */
{
  /* reißender Bergfluss: graugrün bis lehmbraun, kurze Schaumflecken schräg zur Strömung, dunkle Ufer mit Blöcken */
  const ob = (x) => 249.5 - (x - 318) * 0.115 + Math.sin(x / 9) * 0.5, br = (x) => 9 + (x - 318) * 0.09;
  const oben = [], unten = [];
  for (let x = 316; x <= 404; x += 4) { oben.push([x, ob(x)]); unten.push([x, ob(x) + br(x)]); }
  const wasser = glatt([...oben, ...unten.slice().reverse()], true, 0.6);
  let k = `<path d="${glatt([...unten.map(([x, y]) => [x, y - 1]), [404, 263], [316, 263]], true, 0.6)}" fill="#2c4733"/><path d="${glatt([...unten.map(([x, y]) => [x, y - 1]), [404, 263], [316, 263]], true, 0.6)}" fill="${WALD1}" opacity=".7"/>`;
  k += `<path d="${wasser}" fill="${S.lg("fluss", [[0, "#8d8068"], [0.45, "#7f8a6e"], [1, "#6c7660"]], 0, 0, 0, 1)}"/>`;
  /* Strömungsbänder (etwas heller) und Schaumflecken */
  const zf = zufall(57);
  let fl = "", sch = "";
  for (let i = 0; i < 9; i++) { const x = 320 + zf() * 78, t = 0.2 + zf() * 0.6, y = ob(x) + br(x) * t, l = 6 + zf() * 10; fl += `M${r(x)} ${r(y)} l${r(l)} ${r(-l * 0.115)}`; }
  k += `<path d="${fl}" stroke="#9aa088" stroke-width=".9" opacity=".45" stroke-linecap="round"/>`;
  /* Schaum vor allem in den Stromschnellen (an den Blöcken und den Pfeilern): kurze, gebogene Flecken */
  for (let i = 0; i < 34; i++) {
    const nest = [334, 352, 376, 392][i % 4], x = nest + (zf() - 0.5) * 16, t = 0.12 + zf() * 0.76, y = ob(x) + br(x) * t, l = 0.6 + zf() * 1.9;
    sch += `M${r(x)} ${r(y)} q${r(l * 0.5)} ${r(-0.35)} ${r(l)} ${r(l * 0.34)}`;
  }
  k += `<path d="${sch}" stroke="#f3f1e6" stroke-width=".5" fill="none" opacity=".85" stroke-linecap="round"/>`;
  /* Ufer: dunkle Kante oben (ferne Seite) und unten (unsere Seite), Felsblöcke */
  k += `<path d="${glatt(oben, false)}" stroke="#3b3f2e" stroke-width="1.1" fill="none" opacity=".7"/><path d="${glatt(unten, false)}" stroke="#2f3f28" stroke-width="1.6" fill="none" opacity=".8"/>`;
  let bl = "", bh = "";
  for (let i = 0; i < 16; i++) { const x = 320 + zf() * 82, seite = i % 2, y = seite ? ob(x) + br(x) + 0.2 : ob(x) - 0.1, w = 1 + zf() * 1.4; bl += `M${r(x)} ${r(y + 0.5)} l${r(w * 0.2)} ${r(-w * 0.55)} l${r(w * 0.6)} ${r(-w * 0.1)} l${r(w * 0.3)} ${r(w * 0.6)} Z`; bh += `M${r(x + w * 0.2)} ${r(y - w * 0.05)} l${r(w * 0.6)} ${r(-w * 0.1)}`; }
  k += `<path d="${bl}" fill="#7d7a6c"/><path d="${bh}" stroke="#d8d2bf" stroke-width=".35" opacity=".8"/>`;
  /* Puente Ruinas: Fahrbahn schräg über den Fluss, zwei Pfeiler stehen im Wasser, Schaum an ihrem Fuß */
  const b0 = [370, ob(370) - 0.6], b1 = [378.5, ob(378.5) + br(378.5) + 0.6];
  const pf = (t) => [b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t];
  for (const t of [0.36, 0.68]) { const [x, y] = pf(t); k += `<path d="M${r(x - 0.5)} ${r(y)} h1 v2.2 h-1 Z" fill="#8a8474"/><path d="M${r(x - 1.4)} ${r(y + 2.3)} q1.4 .8 2.8 0" stroke="#f6f3ea" stroke-width=".45" fill="none"/>`; }
  k += `<path d="${P([[b0[0] - 0.8, b0[1]], [b0[0] + 1, b0[1]], [b1[0] + 1, b1[1]], [b1[0] - 0.8, b1[1]]])}" fill="#ddd6c4"/><path d="M${r(b0[0] + 1)} ${r(b0[1])} L${r(b1[0] + 1)} ${r(b1[1])}" stroke="#6f6a5c" stroke-width=".45"/>`;
  /* Hauch Nebel am linken Ende */
  k += `<g filter="url(#${S.id("dunst")})"><ellipse cx="324" cy="${r(ob(324) + 4)}" rx="9" ry="3.4" fill="#eef2f2" opacity=".75"/></g>`;
  k = `<g>${k}</g>`;
  /* links unten: Talgrund mit Flussschleife im Dunst */
  k += `<path d="M30 214 Q56 208 84 210 Q100 211 108 206 L110 212 Q98 217 82 216 Q56 215 32 220 Z" fill="${S.lg("fluss2", [[0, "#c8c6b4"], [1, "#9a9884"]])}" opacity=".9"/>`;
  k += `<path d="M42 214.4 q14 -2 30 -1" stroke="#fbf8ee" stroke-width=".4" fill="none" opacity=".8"/>`;
  S.teil({ id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", x: 362, y: 250, kunst: um(362, 250, k),
    tipp: "Der Urubamba fließt rund 450 Meter tiefer als die Stadt. Die Inka nannten ihn den heiligen Fluss." });
}

/* =====================================================================
   3b — DIE SCHLUCHT (links: der tiefe Talgrund des Urubamba im Morgendunst)
   ===================================================================== */
{
  let k = `<path d="M0 150 Q40 150 70 160 Q96 172 108 196 L112 226 L0 226 Z" fill="${S.lg("schlucht", [[0, "#3e5c56", 0.1], [0.3, "#33504a", 0.75], [1, "#2c4844", 0.9]])}"/>`;
  k += `<path d="M0 150 Q40 150 70 160 Q96 172 108 196 L112 226 L0 226 Z" fill="${WALD05}" opacity=".6"/>`;
  /* Dunstsee im Talgrund: oben weich, liegt über dem Fluss nur dünn */
  k += `<g filter="url(#${S.id("dunst")})"><path d="M-2 196 Q30 190 60 194 Q90 198 112 192 L112 206 Q80 210 50 208 Q20 206 -2 210 Z" fill="#eef3f4" opacity=".75"/></g>`;
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 60, y: 204, kunst: um(60, 204, kappeRand(k)),
    tipp: "Die Schlucht ist ein tiefes, enges Tal. Unten fließt der Urubamba, darüber steigen morgens die Nebel auf." });
}

/* =====================================================================
   4 — DER HUAYNA PICCHU (mit dem kleinen Huchuy Picchu davor)
   ===================================================================== */
const HUAYNA = [[150, 138], [156, 128], [163, 117], [170, 105], [176, 93], [181, 84], [185, 78], [188, 70], [191, 58], [195, 47], [200, 39], [205, 34], [210, 31], [215, 30.4], [219, 32], [221, 37], [223, 45], [226, 54], [230, 61], [235, 64], [241, 62.4], [247, 64], [252, 69], [260, 77], [270, 87], [281, 98], [291, 111], [299, 126], [304, 142]];
{
  const d = glatt([...HUAYNA, [310, 160], [150, 160]], true, 0.85);
  let k = `<path d="${d}" fill="${S.lg("huayna", [[0, "#26453b"], [0.4, "#355c44"], [0.6, "#5a8c4c"], [1, "#7fae5a"]], 0, 0, 1, 0)}"/>`;
  /* Waldtextur: unten (nah, bei der Stadt) gröber, zum Gipfel hin (300 m weiter weg) feiner */
  S.def(`<linearGradient id="${S.id("hwm")}" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="104"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("hwunten")}" maskUnits="userSpaceOnUse" x="140" y="20" width="180" height="150"><rect x="140" y="20" width="180" height="150" fill="url(#${S.id("hwm")})"/></mask>`);
  k += `<path d="${d}" fill="${WALD035}"/><path d="${d}" fill="${WALD06}" mask="url(#${S.id("hwunten")})"/>`;
  /* Rinnen in Fall-Linie */
  let ri = "";
  for (const [x0, y0, x1, y1] of [[201, 44, 186, 112], [209, 38, 197, 118], [226, 60, 236, 116], [246, 68, 256, 118], [190, 62, 174, 110]]) ri += `M${x0} ${y0} Q${r((x0 + x1) / 2 + (x1 > x0 ? -2 : 2))} ${r((y0 + y1) / 2)} ${x1} ${y1}`;
  k += `<path d="${ri}" stroke="#1d3a2e" stroke-width="1.1" fill="none" opacity=".35" stroke-linecap="round"/>`;
  /* Granitwände: steile, lange Bänder an der Westflanke (im Schatten), eine im Licht an der Ostflanke */
  k += wand([[198, 40], [195, 52], [192, 64], [190, 76]], 4.6, "#8e958f", "#5c6560", 41) + wand([[205, 37], [203, 48], [201, 60], [200, 70]], 3.4, "#8e958f", "#5a635e", 42);
  k += wand([[187, 80], [184, 90], [181, 100]], 3.6, "#87908a", "#56605a", 43) + wand([[221, 40], [223, 50], [225, 58]], 3.2, "#c9c7b4", "#8f958c", 44);
  /* Inka-Terrassen am Gipfel: sie folgen der Kuppe (gebogen) und werden nach oben kürzer; auf zweien kleine Ruinen */
  let tm = "", tg = "";
  for (const [y, x0, x1] of [[32.6, 210.6, 217.4], [35.6, 207.8, 219.6], [38.8, 205, 220.8], [42.2, 202.2, 221.8], [45.8, 199.6, 222.8]]) {
    const bw = (x1 - x0) * 0.13, xm = (x0 + x1) / 2;
    tg += `M${x0} ${r(y - 0.6)}Q${r(xm)} ${r(y - 0.6 + bw * 2)} ${x1} ${r(y - 0.6)}L${x1} ${y}Q${r(xm)} ${r(y + bw * 2)} ${x0} ${y}Z`;
    tm += `M${x0} ${y}Q${r(xm)} ${r(y + bw * 2)} ${x1} ${y}L${x1} ${r(y + 0.9)}Q${r(xm)} ${r(y + 0.9 + bw * 2)} ${x0} ${r(y + 0.9)}Z`;
  }
  k += `<path d="${tm}" fill="#8a8577" opacity=".75"/><path d="${tg}" fill="#6a9a4c"/>`;
  /* kleine Ruinen: Wände mit Giebel, Lichtseite rechts */
  k += `<path d="M211.8 33 v-1.5 l1.3 -1 l1.3 1 v1.5 Z M216.4 39.6 v-1.4 l1.1 -.9 l1.1 .9 v1.4 Z" fill="#a49d8d"/><path d="M213.1 30.5 l1.3 1 v1.5 h-1.3 Z M217.5 37.3 l1.1 .9 v1.4 h-1.1 Z" fill="#d9d2c0"/>`;
  /* goldene Lichtkante am rechten Grat (Morgensonne) */
  k += `<path d="${glatt(HUAYNA.slice(13), false)}" stroke="${S.lg("gratgold", [[0, "#f6d98f"], [0.5, "#f3d58e", 0.6], [1, "#f3d58e", 0.1]], 0, 0, 0, 1)}" stroke-width=".8" fill="none" opacity=".8" transform="translate(-.45 .55)"/>`;
  /* Morgendunst über dem Fuß */
  k += `<path d="${d}" fill="${S.lg("huaynadunst", [[0, "#e3ecf0", 0], [0.6, "#e3ecf0", 0.06], [1, "#e3ecf0", 0.5]])}"/>`;
  /* Huchuy Picchu: deckend, dunkler und blaugrüner als der Stadtrasen, mit eigenem Wald und Felsfleck */
  const hu = glatt([[156, 160], [160, 146], [168, 137], [178, 132], [188, 133], [196, 138], [202, 147], [205, 160]], true, 0.9);
  k += `<path d="${hu}" fill="${S.lg("huchuy", [[0, "#2c4c3e"], [0.6, "#3d6448"], [1, "#557f52"]], 0, 0, 1, 0)}"/><path d="${hu}" fill="${WALD06}"/>`;
  k += `<path d="M184 137 l2.4 -.8 l1.6 1.8 l-.6 2.4 l-2.6 .2 Z" fill="#7d847d" opacity=".8"/>`;
  S.teil({ id: "huayna_picchu", de: "der Huayna Picchu", syl: "HUAY-na PIC-chu", it: "lo Huayna Picchu", itSyl: "HUAY-na PIC-chu", en: "Huayna Picchu", x: 214, y: 60, kunst: um(214, 60, `<g filter="${VOL_BERG}">${k}</g>`),
    tipp: "Huayna Picchu heißt „junger Berg“. Ganz oben bauten die Inka Terrassen und kleine Tempel – der Weg hinauf ist sehr steil." });
}

/* =====================================================================
   5 — DER NEBEL: liegende, zerfaserte Bänder in den Schluchten, einzelne Fetzen ziehen am Fuß des Huayna hoch
   ===================================================================== */
{
  const band = (x, y, w, h, a, seed) => {
    const z = zufall(seed), oben = [], unten = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8, dick = Math.sin(Math.PI * t) * h * (0.7 + z() * 0.5); oben.push([x + w * t, y - dick * 0.6]); unten.push([x + w * t, y + dick * 0.4]); }
    return `<path d="${glatt([...oben, ...unten.reverse()], true, 0.9)}" fill="#f4f7f8" opacity="${a}"/>`;
  };
  let k = `<g filter="url(#${S.id("dunst")})">`;
  k += band(-4, 128, 80, 5, 0.75, 1) + band(40, 140, 96, 4.5, 0.85, 2) + band(98, 126, 60, 3.6, 0.7, 3) + band(4, 160, 70, 4, 0.7, 4);
  k += band(272, 150, 70, 4, 0.75, 5) + band(300, 162, 102, 5, 0.85, 6) + band(250, 140, 40, 3, 0.6, 7);
  k += `</g>`;
  S.teil({ id: "nebel", de: "der Nebel", syl: "NE-bel", it: "la nebbia", itSyl: "NEB-bia", en: "mist", x: 80, y: 136, kunst: um(80, 136, kappeRand(k)),
    tipp: "Morgens steigt der Nebel aus der feuchten Schlucht. Gegen Mittag ist er meist verschwunden." });
}

/* =====================================================================
   6 — DIE SERPENTINE (Straße Hiram Bingham) — vom Stadteingang hinab zur Brücke; die Kehren werden nach unten enger
   ===================================================================== */
const SERP = [[334, 196], [357, 197.6], [343, 202], [363, 206.6], [353, 210], [360, 212.6], [345, 217.6], [367, 223], [349, 227.6], [373, 232], [352, 236], [377, 239.6], [369.4, 242.8]];
{
  let pfad = `M${SERP[0][0]} ${SERP[0][1]}`;
  for (let i = 1; i < SERP.length; i++) {
    const [x0, y0] = SERP[i - 1], [x1, y1] = SERP[i], dir = x1 < x0 ? -1 : 1, kr = Math.min(1.6 - i * 0.08, Math.abs(SERP[(i + 1) % SERP.length][1] - y1) * 0.45 + 0.4);
    pfad += ` L${r(x1 - dir * kr)} ${r(y1 - 0.3)} Q${r(x1 + dir * 0.4)} ${r(y1 + 0.1)} ${r(x1 - dir * 0.2)} ${r(y1 + kr)}`;
  }
  let k = `<path d="${pfad}" stroke="#2c3a28" stroke-width="1.1" fill="none" stroke-linejoin="round" opacity=".45" transform="translate(-.4 .5)"/>`;
  k += `<path d="${pfad}" stroke="${S.lg("strasse", [[0, "#b3a88e"], [1, "#988e76"]])}" stroke-width=".8" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="${pfad}" stroke="#e6dfcc" stroke-width=".22" fill="none" opacity=".5" transform="translate(.1 -.3)"/>`;
  /* der Hang wölbt sich vor zwei Kehren: Waldbuckel mit Morgenlicht an der Oberkante */
  for (const [cx, cy, w, h] of [[357, 215.4, 17, 4.6], [363, 233.4, 13, 3.6]]) {
    const bu = glatt([[cx - w / 2, cy + h * 0.3], [cx - w * 0.3, cy - h * 0.45], [cx + w * 0.05, cy - h * 0.6], [cx + w * 0.4, cy - h * 0.3], [cx + w / 2, cy + h * 0.35], [cx, cy + h * 0.6]], true, 0.8);
    k += `<g filter="url(#${S.id("weich")})"><path d="${bu}" fill="${cy > 225 ? "#3c5c4a" : "#45664f"}"/></g><path d="M${r(cx - w * 0.3)} ${r(cy - h * 0.45)} Q${r(cx + w * 0.05)} ${r(cy - h * 0.75)} ${r(cx + w * 0.4)} ${r(cy - h * 0.3)}" stroke="#b9cc94" stroke-width=".3" fill="none" opacity=".35"/>`;
  }
  S.teil({ id: "serpentine", de: "die Serpentine", syl: "ser-pen-TI-ne", it: "il tornante", itSyl: "tor-NAN-te", en: "hairpin bend", x: 356, y: 218, kunst: um(356, 218, k),
    tipp: "Die Straße Hiram Bingham windet sich in vielen engen Kehren vom Fluss hinauf. Busse bringen die Besucher nach oben." });
}

/* =====================================================================
   7 — DIE RUINENSTADT (mit Lupe: Sonnentempel, Hauptplatz, Haus, Tür)
   ---------------------------------------------------------------------
   Stadtboden ≈ 70 m unter uns: d(y) = 330·70 / (y − 105). Ein Haus wird
   als Kasten mit Giebeln gezeichnet; die Tiefe zeigt zum Fluchtpunkt.
   ===================================================================== */
const VP = [CX, HOR];
const dAusY = (y, tief = 70) => 330 * tief / Math.max(4, y - HOR);
const hinterPunkt = ([x, y], t, d) => { const f = d / (d + t * 1.7); return [VP[0] + (x - VP[0]) * f, VP[1] + (y - VP[1]) * f]; };
/* ein Haus: (x, y) = vorne links unten, b = Breite der Front, h = Wandhöhe (Einheiten), t = Tiefe (m), g = Giebelhöhe,
   giebel: "front" (Giebel vorn und hinten) oder "seite" (Giebel an den Seiten), dach: rekonstruiertes Strohdach */
const haus = (x, y, b, h, t, g, giebel = "front", dach = false, tueren = 1, schattenAn = true) => {
  const d = dAusY(y), m = 330 / d;
  const A = [x, y], Bp = [x + b, y], A2 = hinterPunkt(A, t, d), B2 = hinterPunkt(Bp, t, d);
  const up = (p, v) => [p[0], p[1] - v];
  const rechtsSicht = x + b / 2 < VP[0];
  let o = "";
  /* Schlagschatten nach links auf den Boden (Sonne rechts, etwa 45° hoch) */
  if (schattenAn) o += `<path d="${Pr([A, [A[0] - h * 0.9, A[1] - h * 0.12], [A2[0] - h * 0.9, A2[1] - h * 0.12], A2])}" fill="#2a3320" opacity=".28"/>`;
  if (giebel === "front" && g > 0) o += `<path d="${Pr([up(A2, h), [(A2[0] + B2[0]) / 2, A2[1] - h - g * 0.92], up(B2, h)])}" fill="#b8b0a0"/>`;
  /* Innenraum (über die Vorderwand hinweg): oben die helle Innenseite der Rückwand mit Nischen,
     darunter der Grasboden mit einer schmalen Schattenkante an der Wand — kein Dach */
  const vis = up(A, h)[1] - up(A2, h)[1], wv = Math.min(vis * 0.56, h * 0.9);
  o += `<path d="${Pr([up(A, h), up(Bp, h), up(B2, h), up(A2, h)])}" fill="#7f8a52"/>`;
  o += `<path d="${Pr([up(A2, h), up(B2, h), up(B2, h - wv), up(A2, h - wv)])}" fill="#d6cdb9"/><path d="${Pr([up(A2, h - wv), up(B2, h - wv), up(B2, h - wv * 1.22), up(A2, h - wv * 1.22)])}" fill="#4b5233" opacity=".6"/>`;
  const iw = B2[0] - A2[0];
  if (iw > 2.6 && wv > 0.7) { let ni = ""; const nn = iw > 5 ? 3 : 2; for (let i = 0; i < nn; i++) { const cx = A2[0] + iw * (i + 0.5) / nn, cy = A2[1] - h + wv * 0.55, nb = Math.min(0.7, iw * 0.07), nh = wv * 0.42; ni += `M${r(cx - nb)} ${r(cy + nh / 2)}l${r(nb * 0.3)} ${r(-nh)}h${r(nb * 1.4)}l${r(nb * 0.3)} ${r(nh)}Z`; } o += `<path d="${ni}" fill="#5c5446"/>`; }
  if (rechtsSicht) o += `<path d="${Pr([Bp, B2, up(B2, h), up(Bp, h)])}" fill="${GRANIT_L}"/>`;
  else o += `<path d="${Pr([A, A2, up(A2, h), up(A, h)])}" fill="${GRANIT_S}"/>`;
  o += `<path d="${Pr([A, Bp, up(Bp, h), up(A, h)])}" fill="${GRANIT_F}"/>`;
  const zh = zufall(Math.round(x * 13 + y * 7)), kaputt = zh() < 0.5;
  /* Giebel: ganz oder abgebrochen (stufig) */
  const giebelForm = (L0, R0, spitze) => kaputt ? [L0, [L0[0] + (spitze[0] - L0[0]) * 0.45, L0[1] + (spitze[1] - L0[1]) * 0.45], [L0[0] + (spitze[0] - L0[0]) * 0.55, L0[1] + (spitze[1] - L0[1]) * 0.6], [L0[0] + (spitze[0] - L0[0]) * 0.75, L0[1] + (spitze[1] - L0[1]) * 0.6], [L0[0] + (spitze[0] - L0[0]) * 0.75, L0[1] + (spitze[1] - L0[1]) * 0.8], [R0[0] + (spitze[0] - R0[0]) * 0.7, R0[1] + (spitze[1] - R0[1]) * 0.8], R0] : [L0, spitze, R0];
  if (giebel === "front" && g > 0) o += `<path d="${Pr(giebelForm(up(A, h - 0.05), up(Bp, h - 0.05), [x + b / 2, y - h - g]))}" fill="${GRANIT_F}"/>`;
  else {
    const S1 = rechtsSicht ? Bp : A, S2 = rechtsSicht ? B2 : A2;
    if (g > 0) o += `<path d="${Pr(giebelForm(up(S1, h - 0.05), up(S2, h - 0.05), [(S1[0] + S2[0]) / 2, (S1[1] + S2[1]) / 2 - h - g]))}" fill="${rechtsSicht ? GRANIT_L : GRANIT_S}"/>`;
    const S3 = rechtsSicht ? A : Bp, S4 = rechtsSicht ? A2 : B2;   /* Giebel der Gegenseite, nur die Spitze ragt über den Innenraum */
    if (g > 0) o += `<path d="${Pr([up(S3, h), [(S3[0] + S4[0]) / 2, (S3[1] + S4[1]) / 2 - h - g], up(S4, h)])}" fill="#b4ac9c"/>`;
  }
  o += `<path d="M${r(x)} ${r(y - h)} H${r(x + b)}" stroke="#ece4d2" stroke-width="${r(Math.max(0.2, 0.12 * m))}" opacity=".85"/>`;
  if (zh() < 0.5) o += `<path d="M${r(x + b * zh() * 0.4)} ${r(y - h - 0.12)} h${r(b * (0.2 + zh() * 0.3))}" stroke="#7e9a4a" stroke-width="${r(Math.max(0.25, 0.16 * m))}" stroke-linecap="round"/>`;
  if (b > 3) for (let i = 1; i < 4; i++) o += `<path d="M${r(x + 0.2)} ${r(y - h * i / 4)} H${r(x + b - 0.2)}" stroke="#7f786c" stroke-width=".1" opacity=".55"/>`;
  for (let i = 0; i < tueren; i++) {
    const cx = x + b * (i + 0.5) / tueren, tb = Math.min(b / tueren * 0.42, 0.95 * m), th = Math.min(h * 0.72, 1.9 * m);
    o += `<path d="M${r(cx - tb / 2)} ${r(y)} L${r(cx - tb * 0.34)} ${r(y - th)} L${r(cx + tb * 0.34)} ${r(y - th)} L${r(cx + tb / 2)} ${r(y)} Z" fill="#3a332b"/>`;
  }
  if (dach && giebel === "front") {
    const gF = [x + b / 2, y - h - g], gH = [(A2[0] + B2[0]) / 2, A2[1] - h - g * 0.92], ue = 0.35 * m;
    o += `<path d="${Pr([[x - ue, y - h + ue * 0.6], gF, gH, [A2[0] - ue, A2[1] - h + ue * 0.6]])}" fill="${S.lg("strohs", [[0, "#8a6a36"], [1, "#6f5228"]])}"/>`;
    o += `<path d="${Pr([[x + b + ue, y - h + ue * 0.6], gF, gH, [B2[0] + ue, B2[1] - h + ue * 0.6]])}" fill="${S.lg("strohl", [[0, "#dcb66c"], [1, "#b48e4e"]])}"/>`;
    o += `<path d="M${r(x - ue)} ${r(y - h + ue * 0.6)} L${r(gF[0])} ${r(gF[1])} L${r(x + b + ue)} ${r(y - h + ue * 0.6)}" stroke="#5e4520" stroke-width=".25" fill="none"/>`;
  }
  return o;
};
/* Terrassenhang: Bögen (je eine Punktliste, oben/hinten → unten/vorn). Zwischen zwei Bögen liegt eine Stufe.
   seite = -1: Hang fällt nach links (Mauern zeigen weg, ihr Schatten liegt als Streifen auf der unteren Stufe),
   seite = +1: Hang fällt nach rechts (die Mauern stehen im Morgenlicht und sind zu sehen) */
const hang = (boegen, seite, breite = 1.2) => {
  let o = "";
  for (let i = 0; i < boegen.length - 1; i++) {
    const a = boegen[i], bb = boegen[i + 1];
    o += `<path d="${glatt([...a, ...bb.slice().reverse()], true, 0.5)}" fill="${i % 2 ? "#86ad50" : "#91b958"}"/>`;
    if (seite < 0) {
      const sch = a.map(([x, y]) => [x - breite, y]);
      o += `<path d="${glatt([...a, ...sch.slice().reverse()], true, 0.5)}" fill="#3f5a2c" opacity=".55"/>`;
      o += `<path d="${glatt(a, false)}" stroke="#e8e0c8" stroke-width=".45" fill="none"/>`;
    } else {
      const w = a.map(([x, y]) => [x + breite * 0.9, y + breite * 0.5]);
      o += `<path d="${glatt([...a, ...w.slice().reverse()], true, 0.5)}" fill="${S.lg("mauerlicht", [[0, "#efe7d4"], [1, "#cdc4ae"]], 0, 0, 1, 0)}"/>`;
      o += `<path d="${glatt(w, false)}" stroke="#55603a" stroke-width=".4" fill="none" opacity=".6"/>`;
    }
  }
  return o;
};
/* Häuserzeile: aneinander gebaute Häuser (gemeinsame Wände), Giebel meist an den Seiten — das typische Zackenbild */
const zeile = (x0, x1, y, hm, seed, dachAnteil = 0.06, versatz = 0, dreh = 0) => {
  const z = zufall(seed), m = 330 / dAusY(y); let o = "", x = x0 + versatz * m;
  const teile = [];
  while (x < x1 - 2) {
    if (z() < 0.2) { x += (2 + z() * 4) * m; continue; }          /* Gasse / Hof (Kancha) */
    const lang = z() < 0.7, b = Math.min(x1 - x, (lang ? 11 : 6) * (0.7 + z() * 0.6) * m);
    if (b < 2.5 * m) break;
    teile.push([x, b, lang]);
    x += b + (z() < 0.4 ? 0.3 * m : 0);
  }
  /* Stützmauer der Terrasse, auf der die Zeile steht (helle Krone, Schatten darunter) */
  o += `<path d="M${r(x0 - 1.5)} ${r(y + 0.5)} L${r(x1 + 1.5)} ${r(y + 0.5)} L${r(x1 + 1.5)} ${r(y + 0.5 + 1.3 * m)} L${r(x0 - 1.5)} ${r(y + 0.5 + 1.3 * m)} Z" fill="${S.lg("zeilmauer", [[0, "#b9b1a2"], [1, "#857e72"]])}"/><path d="M${r(x0 - 1.5)} ${r(y + 0.5 + 1.3 * m)} L${r(x1 + 1.5)} ${r(y + 0.5 + 1.3 * m)}" stroke="#3d4a2c" stroke-width="${r(0.5 * m)}" opacity=".35"/>`;
  /* von der Mitte nach außen zeichnen: die äußeren verdecken die inneren richtig (Fluchtpunkt in der Mitte) */
  teile.sort((p, q) => Math.abs(q[0] + q[1] / 2 - VP[0]) - Math.abs(p[0] + p[1] / 2 - VP[0]));
  teile.reverse();
  const xm = (x0 + x1) / 2, bw = Math.max(1, x1 - x0);
  for (const [xx, b, lang] of teile.reverse()) { const yy = y + Math.pow((xx + b / 2 - xm) / bw * 2, 2) * 1.8 + (z() - 0.5) * 0.5, dr = z() < dreh ? (z() < 0.5 ? -1 : 1) * (2.5 + z() * 1.5) : 0; if (dr) o += `<g transform="rotate(${dr} ${xx + b / 2} ${yy})">`; o += haus(xx, yy, b, (3.3 + z() * 1.1) * m * hm, lang ? 7 + z() * 2 : 10 + z() * 3, (z() < 0.2 ? 0 : (3 + z() * 1) * m), lang ? "seite" : "front", z() < dachAnteil, lang ? (z() < 0.5 ? 2 : 0) : 1); if (dr) o += "</g>"; }
  return o;
};
const STADT = {};
{
  let k = "";
  const zl = zufall(77);
  /* --- Bergrücken unter der Stadt: schmaler Grat, die Flanken links und rechts fallen in Terrassenstufen ab --- */
  /* Stufenrand: die Kante folgt einer gekrümmten Höhenlinie; die Stufen werden nach unten (näher) höher;
     jede zweite Stützmauer steht als heller Streifen im Licht */
  const WAND = [];
  const stufig = (pts, schritt, seed) => {
    const z = zufall(seed), dicht = []; for (let i = 0; i < pts.length - 1; i++) for (let t = 0; t < 1; t += 0.1) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)], t2 = t * t, t3 = t2 * t; dicht.push([0, 1].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3))); }
    dicht.push(pts[pts.length - 1]);
    const o = [dicht[0]]; let rest = 0, n = 0;
    for (let i = 1; i < dicht.length; i++) {
      const [x0, y0] = o[o.length - 1], [x1, y1] = dicht[i], s0 = schritt * (0.55 + (Math.max(y0, y1) - 140) / 50) * (0.85 + z() * 0.3);
      if (Math.abs(y1 - y0) < s0 && i < dicht.length - 1) continue;
      const ecke = (y1 > y0) === (x1 < x0) ? [x0, y1] : [x1, y0];
      o.push(ecke, [x1, y1]);
      const senk = ecke[0] === x0 ? [[x0, y0], ecke] : [ecke, [x1, y1]];
      if (n++ % 2 === 0) WAND.push(senk);
    }
    return o;
  };
  const links = stufig([[88, 214], [94, 186], [106, 162], [126, 146]], 4, 1), rechts = stufig([[268, 142], [294, 149], [316, 160], [332, 178], [342, 205]], 4, 2);
  const ruecken = [[84, 262], ...links, [160, 141], [196, 143], [236, 141], ...rechts, [348, 262]];
  k += `<path d="${P(ruecken)}" fill="${S.lg("ruecken", [[0, "#2c4a30"], [0.12, "#3c5f37"], [0.3, "#6f9548"], [0.5, "#7ea052"], [0.75, "#6f9a48"], [0.9, "#4f7c3c"], [1, "#3c6534"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${P(ruecken)}" fill="${WALD1}" opacity=".6"/>`;
  k += `<path d="${P(links, false)} M${P(rechts, false).slice(1)}" stroke="#b5ad9b" stroke-width=".5" fill="none" opacity=".8"/>`;
  k += `<path d="${WAND.map(([[x0, y0], [x1, y1]]) => { const dx = x0 < 200 ? 1.1 : -1.1; return `M${r(x0)} ${r(y0)}L${r(x1)} ${r(y1)}L${r(x1 + dx)} ${r(y1 + 0.3)}L${r(x0 + dx)} ${r(y0 + 0.3)}Z`; }).join("")}" fill="#e2d9c4"/>`;
  /* Sektorflächen: Gras zwischen den Ruinen */
  k += `<path d="${glatt([[108, 168], [120, 152], [150, 147], [180, 150], [194, 160], [196, 200], [150, 206], [108, 204], [102, 186]], true, 0.6)}" fill="${S.lg("westflaeche", [[0, "#93a466"], [1, "#82995a"]])}"/>`;
  k += `<path d="${glatt([[236, 150], [262, 146], [288, 150], [300, 162], [306, 190], [300, 206], [246, 204], [240, 176]], true, 0.6)}" fill="${S.lg("ostflaeche", [[0, "#8fa364"], [1, "#7e9858"]])}"/>`;
  /* Westhang und Osthang: Terrassen */
  const westB = [];
  for (let i = 0; i < 7; i++) westB.push([[134 - i * 3.6, 147 + i * 1.4], [120 - i * 3.8, 165 + i * 2.2], [112 - i * 3.2, 188 + i * 2.2], [108 - i * 2.2, 210 + i * 1.2]]);
  k += hang(westB, -1, 1.3);
  const ostB = [];
  for (let i = 0; i < 6; i++) ostB.push([[282 + i * 4.4, 149 + i * 2.1], [300 + i * 3.8, 165 + i * 2.6], [312 + i * 2.8, 188 + i * 2.2], [316 + i * 2, 210 + i * 1.2]]);
  k += hang(ostB, 1, 1.5);
  /* --- Heiliger Felsen: aufrechte, flache Platte, ihr Umriss ahmt den Berg dahinter nach; daneben die Wayranas --- */
  k += `<path d="M199.6 146.6 L199.8 144.6 L201.6 143.6 L203.4 142.2 L205.2 141.8 L206.6 142.6 L208.4 142 L210.4 143 L212.6 144.4 L213.4 146.6 Z" fill="${S.lg("hfels", [[0, "#6f685e"], [0.5, "#a9a090"], [1, "#cfc6b4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M201.6 143.6 L203.4 142.2 L205.2 141.8 L206.6 142.6 L208.4 142 L210.4 143" stroke="#e6ddca" stroke-width=".3" fill="none"/><path d="M199 146.6 H214" stroke="#5a544a" stroke-width=".6"/><path d="M204 143 l.4 3.2 M209 143 l-.3 3.4" stroke="#6d665c" stroke-width=".18"/>`;
  k += haus(190, 147, 5, 1.9, 6, 1.6, "front", true, 1) + haus(219, 147, 5, 1.9, 6, 1.6, "front", true, 1);
  /* --- der HAUPTPLATZ: liegt tiefer als beide Sektoren, drei Rasenebenen mit grauen Stützmauer-Stirnen --- */
  const platz = [[190, 195], [244, 197], [229, 151], [206, 151]];
  k += `<path d="${P(platz)}" fill="${S.lg("platz", [[0, "#84a856"], [1, "#6c9343"]])}"/>`;
  for (let i = 0; i < 6; i++) { const t0 = i / 6, t1 = t0 + 1 / 12; const q = (t, u) => [platz[0][0] + (platz[1][0] - platz[0][0]) * t + ((platz[3][0] + (platz[2][0] - platz[3][0]) * t) - (platz[0][0] + (platz[1][0] - platz[0][0]) * t)) * u, platz[0][1] + (platz[1][1] - platz[0][1]) * t + ((platz[3][1] + (platz[2][1] - platz[3][1]) * t) - (platz[0][1] + (platz[1][1] - platz[0][1]) * t)) * u]; k += `<path d="${P([q(t0, 0), q(t1, 0), q(t1, 1), q(t0, 1)])}" fill="#a6c76a" opacity=".18"/>`; }
  for (const [ya, yb, xa, xb, hh] of [[178, 179.4, 192.8, 238.4, 1.5], [164, 165, 197.4, 234, 1.2], [156, 156.6, 201.2, 231.4, 0.9]]) k += `<path d="M${xa} ${ya} L${xb} ${yb} L${xb} ${yb + hh} L${xa} ${ya + hh} Z" fill="${S.lg("platzmauer", [[0, "#b3ab9b"], [1, "#857e72"]])}"/><path d="M${xa} ${ya} L${xb} ${yb}" stroke="#e6dfcd" stroke-width=".35"/><path d="M${xa} ${ya + hh} L${xb} ${yb + hh}" stroke="#3a4a28" stroke-width=".5" opacity=".35"/>`;
  /* Ränder: der Platz liegt tiefer — links und rechts eine Böschungsmauer im Schatten bzw. Licht */
  k += `<path d="M190 195 L206 151 L207.6 151 L192.4 195 Z" fill="#8a8377" opacity=".85"/><path d="M244 197 L229 151 L227.4 151 L241.6 197 Z" fill="#cfc7b6" opacity=".9"/>`;
  k += `<path d="${P(platz)}" fill="${GRAS}"/>`;
  /* --- OSTSEKTOR: fünf Terrassenstufen; auf jeder Stufe Häusergruppen (Kanchas) um Höfe, Gassen und Treppen --- */
  let ost = "";
  const stufenY = [156, 164, 173, 183, 194];
  stufenY.forEach((y, i) => {
    const x0 = 240 + (y - 150) * 0.33, x1 = 284 + (y - 150) * 0.62, m = 330 / dAusY(y);
    /* Stützmauer-Stirn der Stufe: dunklere Kante */
    ost += `<path d="M${r(x0 - 2)} ${r(y + 1.4)} L${r(x1 + 2)} ${r(y + 1.4)} L${r(x1 + 2)} ${r(y + 1.4 + 1.6 * m)} L${r(x0 - 2)} ${r(y + 1.4 + 1.6 * m)} Z" fill="${S.lg("ostmauer", [[0, "#a59d8e"], [1, "#6f685e"]])}"/><path d="M${r(x0 - 2)} ${r(y + 1.4)} H${r(x1 + 2)}" stroke="#ddd5c2" stroke-width=".3"/>`;
    /* jede zweite Zeile um eine halbe Hauslänge versetzt, einzelne Häuser leicht gedreht */
    ost += zeile(x0, x1, y - 0.6, 1, 100 + i, 0.06, i % 2 ? 5.5 : 0, 0.18);
    if (i === 1 || i === 3) {
      /* Kancha: Hof mit gemeinsamer Umfassungsmauer zwischen der hinteren und der vorderen Zeile */
      const xa = x0 + (i === 1 ? 4 : 14) * m, xb = xa + 30 * m, yf = y + 4.4, hw = 1.2 * m;
      const ha = hinterPunkt([xa, yf], 9, dAusY(yf)), hb = hinterPunkt([xb, yf], 9, dAusY(yf));
      ost += `<path d="${Pr([[xa, yf], [xb, yf], [xb, yf - hw], [xa, yf - hw]])}" fill="${GRANIT_F}"/><path d="${Pr([[xb, yf], hb, [hb[0], hb[1] - hw], [xb, yf - hw]])}" fill="${GRANIT_L}"/><path d="${Pr([[xa, yf], ha, [ha[0], ha[1] - hw], [xa, yf - hw]])}" fill="${GRANIT_S}"/><path d="M${r(ha[0])} ${r(ha[1] - hw)}L${r(xa)} ${r(yf - hw)}H${r(xb)}L${r(hb[0])} ${r(hb[1] - hw)}" stroke="#ece4d2" stroke-width=".25" fill="none"/>`;
    }
    if (i < 4) ost += zeile(x0 + 2, x1 - 2, y + 4.2, 0.9, 120 + i, 0.06, i % 2 ? 0 : 5.5, 0.18);
  });
  /* zwei Treppen und eine Gasse als helle Diagonalen durch die Stufen */
  for (const [xa, ya, xb, yb, w] of [[262, 152, 268, 200, 1.6], [286, 158, 296, 200, 1.4]]) {
    ost += `<path d="M${xa} ${ya} L${xa + w} ${ya} L${xb + w * 1.4} ${yb} L${xb} ${yb} Z" fill="#cfc7b4"/>`;
    let st = ""; for (let t = 0.04; t < 1; t += 0.06) st += `M${r(xa + (xb - xa) * t)} ${r(ya + (yb - ya) * t)} h${r(w * (1 + 0.4 * t))}`;
    ost += `<path d="${st}" stroke="#8a8274" stroke-width=".15"/>`;
  }
  /* Gruppe der drei Tore (hinten rechts, mit Strohdächern) */
  ost = haus(247, 150, 4.6, 2.2, 6, 1.8, "front", true, 1) + haus(256, 150.6, 4.6, 2.2, 6, 1.8, "front", true, 1) + haus(265, 151.2, 4.6, 2.2, 6, 1.8, "front", true, 1) + ost;
  /* --- WESTSEKTOR --- */
  let west = "";
  /* Intihuatana: unregelmäßiger Felshügel mit vier schiefen, verschieden breiten Terrassen; oben eine kleine
     Plattform mit dem kantigen Granitblock und seinem kurzen Zapfen */
  {
    /* Felshügel, nach links ansteigend: links eine steile Granitflanke, rechts lang und flach auslaufend */
    const huegel = [[132, 161], [134.6, 153], [138.6, 145.6], [142.6, 140], [146, 137.6], [150.4, 137.6], [155, 139.2], [161, 142.2], [168, 146.4], [175.6, 151.4], [182.6, 156.4], [188, 161]];
    west += `<path d="${glatt(huegel, true, 0.7)}" fill="${S.lg("intifels", [[0, "#56634a"], [0.3, "#6e7f50"], [1, "#93a46c"]], 0, 0, 1, 0)}"/>`;
    /* nackte Granitbuckel an der steilen linken Flanke */
    let gw = "", gl = "";
    for (const [fx, fy, w, h] of [[133.6, 159.4, 6.4, 3.4], [137.2, 151.4, 5, 2.6], [140.8, 144.8, 3.8, 2]]) {
      gw += Pr([[fx, fy], [fx + w * 0.1, fy - h * 0.6], [fx + w * 0.42, fy - h], [fx + w * 0.8, fy - h * 0.8], [fx + w, fy - h * 0.2], [fx + w * 0.7, fy + 0.4]]);
      gl += Pr([[fx + w * 0.42, fy - h], [fx + w * 0.8, fy - h * 0.8], [fx + w, fy - h * 0.2], [fx + w * 0.62, fy - h * 0.35]]);
    }
    west += `<path d="${gw}" fill="#6f7166"/><path d="${gl}" fill="#a3a092"/>`;
    /* drei Terrassen, verschieden tief und lang, sie laufen nicht herum: rechts brechen sie an Felsen ab */
    const terr = [[140.6, 177.6, 155.4, 0.4, 1.5, 3.8, 2.4], [145.6, 166.4, 148.6, 0.9, 1.2, 2, 0.5], [148.4, 157.4, 142.2, 0.5, 1, 2.4, 1.2]];
    let tritt = "", mauer = "", krone = "", fels = "", fl = "";
    for (const [xa, xb, y, dy, hh, tief, bow] of terr) {
      const yb = y + dy, c1 = [xa + (xb - xa) * 0.25, y + bow], c2 = [xa + (xb - xa) * 0.7, yb + bow * 0.8];
      const kurve = (o) => `C${r(c1[0])} ${r(c1[1] + o)} ${r(c2[0])} ${r(c2[1] + o)} ${xb} ${r(yb + o)}`;
      tritt += `M${xa} ${r(y)} ${kurve(0)} L${r(xb - 1.6)} ${r(yb - tief)} C${r(c2[0])} ${r(c2[1] - tief)} ${r(c1[0] + 0.6)} ${r(c1[1] - tief)} ${r(xa + 1.4)} ${r(y - tief - 0.4)} Z`;
      mauer += `M${xa} ${r(y)} ${kurve(0)} L${xb} ${r(yb + hh)} C${r(c2[0])} ${r(c2[1] + hh)} ${r(c1[0])} ${r(c1[1] + hh)} ${xa} ${r(y + hh)} Z`;
      krone += `M${xa} ${r(y)} ${kurve(0)}`;
    }
    /* Granitfelsen, an denen die Terrassen rechts enden */
    for (const [fx, fy, w, h] of [[176.4, 157.6, 6, 2.6], [165.4, 150.4, 4.8, 2.2], [156.4, 143.8, 3.6, 1.7]]) {
      fels += Pr([[fx - 0.4, fy + 0.3], [fx - 0.5, fy - h * 0.5], [fx + w * 0.2, fy - h], [fx + w * 0.62, fy - h * 0.96], [fx + w, fy - h * 0.4], [fx + w * 0.92, fy + 0.2], [fx + w * 0.45, fy + 0.6]]);
      fl += Pr([[fx + w * 0.62, fy - h * 0.96], [fx + w, fy - h * 0.4], [fx + w * 0.92, fy + 0.2], [fx + w * 0.58, fy - 0.2], [fx + w * 0.5, fy - h * 0.6]]);
    }
    west += `<path d="${tritt}" fill="#8fae5c"/><path d="${mauer}" fill="${S.lg("intimauer", [[0, "#7a7366"], [0.55, "#aea594"], [1, "#d3cab6"]], 0, 0, 1, 0)}"/><path d="${krone}" stroke="#ebe3cf" stroke-width=".3" fill="none"/>`;
    west += `<path d="${fels}" fill="#707066"/><path d="${fl}" fill="#aca697"/>`;
    /* schräge Treppe von rechts unten bis auf die Plattform */
    west += `<path d="M174.6 161.2 L176.2 160.8 L152.8 140.6 L151.6 140.8 Z" fill="#d8d0bc"/>`;
    let tr = ""; for (let t = 0.04; t < 1; t += 0.06) tr += `M${r(174.6 + (151.6 - 174.6) * t)} ${r(161.2 + (140.8 - 161.2) * t)} h${r(1.6 - 0.4 * t)}`;
    west += `<path d="${tr}" stroke="#8a8274" stroke-width=".14"/>`;
    /* kleine Plattform oben, darauf der kantige Granitblock mit kurzem, senkrechtem Zapfen (Höhe ≈ Breite) */
    const bx = -7.2;
    west += `<path d="M${r(149.6 + bx)} 139.8 Q${r(152 + bx)} 138 ${r(156 + bx)} 137.8 Q${r(159.6 + bx)} 138 ${r(161 + bx)} 139.4 Q${r(156 + bx)} 140.6 ${r(149.6 + bx)} 139.8 Z" fill="#a0ad7a"/><path d="M${r(149.6 + bx)} 139.8 Q${r(156 + bx)} 140.6 ${r(161 + bx)} 139.4 L${r(161 + bx)} 140 Q${r(156 + bx)} 141.3 ${r(149.6 + bx)} 140.4 Z" fill="#9c9484"/>`;
    west += `<g transform="translate(${bx} 0)"><path d="M152.8 139.4 L153.2 137.9 L157.6 137.6 L158.4 139.1 Z" fill="#a39b8c"/><path d="M157.6 137.6 L158.4 139.1 L157.2 139.3 L156.6 137.7 Z" fill="#d2cbbb"/><path d="M153.2 137.9 L157.6 137.6" stroke="#e2dbcb" stroke-width=".2"/>`;
    west += `<path d="M154.4 137.85 L154.5 136.2 L155.9 136.1 L156 137.75 Z" fill="#9a9384"/><path d="M155.9 136.1 L156.5 136.35 L156.6 137.7 L156 137.75 Z" fill="#d8d1c1"/><path d="M154.5 136.2 L155.9 136.1 L156.5 136.35 L155 136.45 Z" fill="#e6dfcf"/>`;
    west += `<path d="M152.8 139.4 L150.6 139.6 L151 138.6 L153.2 137.9 Z" fill="#3f4a2e" opacity=".35"/></g>`;
  }
  /* Steinbruch: Feld aus hellen, rohen Granitblöcken zwischen Westsektor und Platz */
  for (let i = 0; i < 26; i++) { const x = 182 + zl() * 12, y = 158 + zl() * 14, w = 0.8 + zl() * 1.4; west += `<path d="M${r(x)} ${r(y)} l${r(w * 0.3)} ${r(-w * 0.6)} l${r(w * 0.8)} ${r(-w * 0.1)} l${r(w * 0.4)} ${r(w * 0.6)} Z" fill="${zl() < 0.5 ? "#ddd5c3" : "#aea594"}"/>`; }
  /* Heiliger Platz: Haupttempel und der TEMPEL DER DREI FENSTER (Rückwand mit drei großen Trapezfenstern, zu uns offen) */
  west += haus(164, 171, 9, 3.4, 8, 0, "seite", false, 0);
  {
    const x = 175, y = 168, b = 10, h = 4.2;
    west += `<path d="M${x} ${y} h${b} v${-h} h${-b} Z" fill="${GRANIT_F}"/><path d="M${x} ${y - h} h${b}" stroke="#ece4d2" stroke-width=".3"/>`;
    /* Öffnungen, kein Glas: dahinter blasser Himmel und Bergkette, unten das Grün der Hänge; dunkle Laibung links und oben */
    const blick = S.lg("dreifenster", [[0, "#c3cdd3"], [0.45, "#a9b8bc"], [0.55, "#6f8f62"], [1, "#5d7d52"]], 0, 0, 0, 1);
    let lb = "", fe = "";
    for (let i = 0; i < 3; i++) { const cx = x + 1.8 + i * 3.2; lb += `M${r(cx - 1.1)} ${r(y - 0.8)}L${r(cx - 0.75)} ${r(y - h + 0.7)}L${r(cx + 0.75)} ${r(y - h + 0.7)}L${r(cx + 1.1)} ${r(y - 0.8)}Z`; fe += `M${r(cx - 0.62)} ${r(y - 0.8)}L${r(cx - 0.4)} ${r(y - h + 1.2)}L${r(cx + 0.75)} ${r(y - h + 1.2)}L${r(cx + 1.1)} ${r(y - 0.8)}Z`; }
    west += `<path d="${lb}" fill="#3e372e"/><path d="${fe}" fill="${blick}"/>`;
    west += `<path d="M${x} ${y} h${b}" stroke="#4a4238" stroke-width=".4"/>`;
    STADT.fenster = { x: x + b / 2, y: y - h / 2 };
  }
  /* Wohnhäuser im Westsektor (Zeilen von hinten nach vorn) */
  for (const [x0, x1, y, sd] of [[118, 150, 163, 201], [114, 162, 174, 202], [110, 150, 185, 203], [168, 188, 184, 204], [104, 140, 196, 205], [168, 184, 198, 206]]) west += zeile(x0, x1, y, 1, sd, 0);
  /* das Haus mit dem Strohdach (wieder aufgebaut) — das Lern-Haus */
  west += haus(132, 168.4, 6, 3, 9, 2.6, "front", true, 1);
  STADT.haus = { x: 135, y: 164.5 };
  /* der SONNENTEMPEL (Torreón): halbrunde, oben offene Mauer aus fugenlosen Blöcken auf einem Granitfelsen,
     darunter die dunkle Öffnung der Königsgruft; daneben eine Wand mit Trapezfenster */
  const T = { x: 154, y: 199 };
  let st = `<path d="M${T.x - 8.4} ${T.y} Q${T.x - 9} ${T.y - 4} ${T.x - 5} ${T.y - 7} Q${T.x - 1} ${T.y - 8.6} ${T.x + 4} ${T.y - 7.6} Q${T.x + 8} ${T.y - 6} ${T.x + 9} ${T.y} Z" fill="${S.lg("torreonfels", [[0, "#6f685e"], [0.6, "#a39a8a"], [1, "#c9bfac"]], 0, 0, 1, 0)}"/>`;
  st += `<path d="M${T.x - 3} ${T.y} L${T.x - 2.2} ${T.y - 3.4} Q${T.x} ${T.y - 4.4} ${T.x + 2} ${T.y - 3.2} L${T.x + 2.6} ${T.y} Z" fill="#2a2520"/>`;
  st += `<path d="M${T.x - 4.4} ${T.y - 2.6} l1.4 -.6 M${T.x + 4.4} ${T.y - 2.2} l-1.2 -1" stroke="#4a443c" stroke-width=".3"/>`;
  /* halbrunde Mauer, nach hinten rechts offen: vorn links die gewölbte Außenseite, hinten links sieht man
     die Innenseite im Morgenlicht, innen liegt der Granitfelsen frei */
  {
    const cx = T.x + 0.4, y0 = T.y - 6.6, rx = 6, ry = 2, hw = 6.2;
    const pt = (g, l) => [cx + rx * Math.cos(g * Math.PI / 180), y0 + ry * Math.sin(g * Math.PI / 180) - l];
    const bogen = (g0, g1, l) => { const o = []; for (let g = g0; g0 < g1 ? g <= g1 + 0.1 : g >= g1 - 0.1; g += g0 < g1 ? 15 : -15) o.push(pt(g, l)); return o; };
    st += `<ellipse cx="${r(cx)}" cy="${r(y0)}" rx="${rx}" ry="${ry}" fill="#a89f8e"/><path d="M${r(cx - 2)} ${r(y0 - 0.6)} l2.4 .8 M${r(cx + 1.4)} ${r(y0 + 0.4)} l1.6 -.6" stroke="#7d7568" stroke-width=".2"/>`;
    st += `<path d="${P([...bogen(180, 255, hw), ...bogen(255, 180, 0)])}" fill="${S.lg("torinnen", [[0, "#cfc6b3"], [1, "#efe7d5"]], 0, 0, 1, 0)}"/>`;
    st += `<path d="${P([...bogen(30, 180, hw), ...bogen(180, 30, 0)])}" fill="${S.lg("torreon", [[0, "#a39a8a"], [0.45, "#ddd5c4"], [0.8, "#f0e8d6"], [1, "#d6ccb8"]], 0, 0, 1, 0)}"/>`;
    let fu = ""; for (let l = 0.9; l < hw; l += 0.9) fu += P(bogen(30, 180, l), false);
    st += `<path d="${fu}" stroke="#aaa18f" stroke-width=".1" fill="none"/>`;
    /* zwei Trapezfenster in der Rundung */
    let fe = ""; for (const g of [72, 122]) { const [fx, fy] = pt(g, 2.6); fe += `M${r(fx - 0.55)} ${r(fy + 0.9)}l.16 -1.9h.78l.16 1.9Z`; }
    st += `<path d="${fe}" fill="#3a332b"/>`;
    /* Mauerkrone und das helle Mauerende vorn rechts */
    st += `<path d="${P(bogen(30, 255, hw), false)}" stroke="#fbf4e2" stroke-width=".45" fill="none"/>`;
    const e0 = pt(30, 0), e1 = pt(30, hw);
    st += `<path d="${P([e0, e1, [e1[0] - 0.5, e1[1] - 0.3], [e0[0] - 0.5, e0[1] - 0.3]])}" fill="#f6efdf"/>`;
  }
  /* rechteckige Wand mit Trapezfenster daneben */
  st += `<path d="M${T.x + 7.4} ${T.y - 5.4} h6 v-5.4 h-6 Z" fill="${GRANIT_F}"/><path d="M${T.x + 9.6} ${T.y - 6.8} l.3 -2.4 h1.4 l.3 2.4 Z" fill="#3a332b"/><path d="M${T.x + 7.4} ${T.y - 10.8} h6" stroke="#ece4d2" stroke-width=".3"/>`;
  st += haus(T.x + 13, T.y - 0.6, 7.4, 3.6, 6, 2.6, "front", false, 1) + haus(T.x - 16, T.y + 1.4, 7.4, 3.8, 6, 2.8, "seite", false, 1);
  STADT.sonne = { x: T.x + 0.4, y: T.y - 9 };
  /* Treppe zwischen Westsektor und Platz: nicht schnurgerade, mit Absatz */
  west += `<path d="M186 199 L192 175 L193.6 174 L198 153 L200.4 153 L196 174.6 L194.2 175.6 L190 199 Z" fill="#cfc6b2"/>`;
  for (let i = 0; i < 18; i++) { const t = i / 18, x = t < 0.5 ? 186 + 12 * t : 193.6 + (t - 0.5) * 8.8, y = 199 - 46 * t; west += `<path d="M${r(x)} ${r(y)} h${r(4 - 1.6 * t)}" stroke="#8f8576" stroke-width=".16"/>`; }
  /* Graben und Mauer vorn (trennt Stadt und Landwirtschaft) */
  const graben = `<path d="M100 214 Q150 206 200 206.6 Q260 207.4 330 214 L330 216.4 Q260 210 200 209.2 Q150 208.6 100 216.6 Z" fill="#3f4d30" opacity=".55"/>`;
  k += west + ost + st + graben;
  STADT.k = k;
}
/* Lupen-Teile der Stadt: Zeichnung malt die Stadt mit, hier nur Fangflächen */
{
  const zoom = { x: 112, y: 138, w: 120, h: 78 };
  const unter = [];
  unter.push({ id: "sonnentempel", de: "der Sonnentempel", syl: "SON-nen-tem-pel", it: "il Tempio del Sole", itSyl: "TEM-pio del SO-le", en: "Temple of the Sun",
    x: STADT.sonne.x, y: STADT.sonne.y, kunst: flaeche(-7, -5, 15, 15),
    tipp: "Der Sonnentempel ist halbrund. Die Steine liegen so dicht, dass nicht einmal eine Messerklinge dazwischenpasst – ganz ohne Mörtel." });
  unter.push({ id: "hauptplatz", de: "der Hauptplatz", syl: "HAUPT-platz", it: "la piazza principale", itSyl: "PIAZ-za prin-ci-PA-le", en: "main square",
    x: 214, y: 172, kunst: `<path d="M-25 20 L26 22 L14 -19 L-8 -19 Z" class="bw-flaeche" fill="rgba(255,255,255,0.001)"/>`,
    tipp: "Der große, grüne Platz teilt die Stadt in zwei Hälften: links die Tempel, rechts die Wohnhäuser." });
  unter.push({ id: "sonnenstein", de: "der Sonnenstein", syl: "SON-nen-stein", it: "l'Intihuatana", itSyl: "in-ti-hua-TA-na", en: "Intihuatana stone",
    x: 148.4, y: 138.4, kunst: flaeche(-4, -4, 8, 6),
    tipp: "Oben auf dem Hügel steht der Intihuatana, der „Ort, an dem die Sonne angebunden wird“." });
  unter.push({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house",
    x: STADT.haus.x, y: STADT.haus.y, kunst: flaeche(-4.6, -4.6, 9.2, 8),
    tipp: "Die Dächer waren aus Stroh. Bei diesem Haus hat man das Strohdach wieder aufgebaut – so sahen früher alle Häuser aus." });
  S.teil({ id: "ruinenstadt", de: "die Ruinenstadt", syl: "ru-I-nen-stadt", it: "la città in rovina", itSyl: "cit-TÀ in ro-VI-na", en: "ruined city", x: 275, y: 175,
    kunst: um(275, 175, kappeRand(STADT.k)), zoom, unter,
    tipp: "Machu Picchu heißt „alter Berg“. Die Inka bauten die Stadt vor über 500 Jahren auf 2 430 Metern Höhe." });
}

/* =====================================================================
   8 — DIE TERRASSE (Landwirtschaftsbereich zwischen uns und der Stadt)
   ---------------------------------------------------------------------
   Wir schauen von oben auf die Stufen: die Stützmauern zeigen von uns weg
   (zur Stadt). Man sieht die Laufflächen, die helle Mauerkrone und dahinter
   den Schatten der Mauer auf der nächsttieferen Stufe. Je näher, desto
   größer: zwei große Stufen vorn (Besucher, Lamas), dann immer schmalere.
   ===================================================================== */
const TERR = [];
{
  let k = "";
  /* Kanten von hinten (bei der Stadt) nach vorn; jede Kante biegt sich links in die Schlucht hinab */
  const kanten = [209, 211.2, 213.6, 216.6, 220.6, 226, 236.6, 262];
  const kante = (y, i) => [[60 + i * 1.5, y + 9 + i * 1.2], [92, y + 2.4 + i * 0.3], [140, y + 0.3], [200, y - 0.6], [262, y], [310, y + 1.8 + i * 0.3], [340 - i * 0.6, y + 6 + i * 0.6]];
  for (let i = 0; i < kanten.length - 1; i++) {
    const hinten = kante(kanten[i], i), vorn = kante(kanten[i + 1], i + 1), tief = kanten[i + 1] - kanten[i];
    k += `<path d="${glatt([...hinten, ...vorn.slice().reverse()], true, 0.6)}" fill="${S.lg("lauf" + (i % 2), [[0, i % 2 ? "#86b04f" : "#91ba57"], [1, i % 2 ? "#7aa447" : "#86ae4f"]])}"/>`;
    if (tief > 4) k += `<path d="${glatt([...hinten, ...vorn.slice().reverse()], true, 0.6)}" fill="${GRAS}"/>`;
    /* Schatten der höheren Mauer (vorn) auf dieser Stufe: Streifen am vorderen Rand? Nein — die Mauer fällt zur Stadt hin
       ab: ihr Schatten liegt am HINTEREN Rand der Stufe davor; hier: dunkler Streifen direkt hinter der Kante */
    const sch = hinten.map(([x, y]) => [x, y + Math.min(2.6, tief * 0.22)]);
    if (i > 0) k += `<path d="${glatt([...hinten, ...sch.slice().reverse()], true, 0.6)}" fill="#33502a" opacity=".45"/>`;
    TERR.push({ hinten, vorn });
  }
  /* Mauerkronen: einzelne Decksteine — manche fehlen oder sind verrutscht; Grasbüschel an den Kanten;
     auf der vorletzten Stufe eine Unterbrechung (Abgang) links der Treppe */
  for (let i = 1; i < kanten.length - 1; i++) {
    const kk = kante(kanten[i], i), d = 0.5 + i * 0.32, zf = zufall(300 + i);
    k += `<path d="${glatt([...kk.map(([x, y]) => [x, y + d * 0.2]), ...kk.map(([x, y]) => [x, y + d * 1.1]).reverse()], true, 0.6)}" fill="#7f7768" opacity=".75"/>`;
    let steine = [], gras = "";
    for (let x = 64 + zf() * 3; x < 338; ) {
      const w = d * (2.2 + zf() * 1.8), y = profilY(kk, x + w / 2), dy = zf() < 0.12 ? d * 0.25 : 0;
      const luecke = zf() < 0.08 || (i === kanten.length - 3 && x > 168 && x < 184);
      if (!luecke) { const c = Math.floor(zf() * 4); steine[c] = (steine[c] || "") + `M${r(x + 0.15)} ${r(y - d * 0.2 + dy)}L${r(x + w - 0.15)} ${r(y - d * 0.25 + dy)}L${r(x + w - 0.2)} ${r(y + d * 0.85 + dy)}L${r(x + 0.2)} ${r(y + d * 0.9 + dy)}Z`; }
      if (zf() < 0.35) { const gx = x + zf() * w; gras += `M${r(gx)} ${r(y - d * 0.1)} l${r(-0.3 - zf() * 0.4)} ${r(-0.8 - i * 0.25)} M${r(gx + 0.4)} ${r(y - d * 0.1)} l${r(0.1)} ${r(-1 - i * 0.3)} M${r(gx + 0.8)} ${r(y - d * 0.1)} l${r(0.4 + zf() * 0.3)} ${r(-0.7 - i * 0.2)}`; }
      x += w + 0.15;
    }
    k += steine.map((d0, c) => d0 ? `<path d="${d0}" fill="${["#efe6d2", "#e2d8c3", "#f4ecda", "#d8ceb8"][c]}"/>` : "").join("") + `<path d="${gras}" stroke="#5f8a36" stroke-width="${r(0.18 + i * 0.04)}" stroke-linecap="round"/>`;
  }
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 100, y: 236, kunst: um(100, 236, kappeRand(k)),
    tipp: "Auf den Terrassen bauten die Inka Mais und Kartoffeln an. Die Mauern halten die Erde fest, auch bei starkem Regen." });
}

/* =====================================================================
   9 — DAS WÄCHTERHAUS (Casa del Guardián) unten links, mit Lupe
   ===================================================================== */
{
  /* wir stehen auf der Terrasse darüber und sehen schräg von oben auf die Giebelseite (zu uns) und die lange
     Seitenwand rechts (Nordost, im Morgenlicht); das Haus ist 8 m lang, 5 m breit, die Wände 2,4 m hoch. */
  const X = -4, Y = 258, W = 52, H = 25, GI = 28, f = 0.22;
  const hin = (p) => [p[0] + (VP[0] - p[0]) * f, p[1] + (VP[1] - p[1]) * f];
  const up = (p, v) => [p[0], p[1] - v];
  const A = [X, Y], Bq = [X + W, Y], A2 = hin(A), B2 = hin(Bq);
  const G = [X + W / 2, Y - H - GI], G2 = hin(G);
  let k = "";
  /* Schlagschatten nach links auf die Terrasse */
  k += `<path d="${P([A, [A[0] - 20, A[1] - 4], [A2[0] - 20, A2[1] - 4], A2])}" fill="#22361a" opacity=".3"/>`;
  /* linke Dachfläche (im Schatten), rechte Seitenwand, rechte Dachfläche (im Licht), Giebelwand vorn */
  const ue = 3.4;
  const Ae = [A[0] - ue, A[1] - H + ue * 0.6], A2e = [A2[0] - ue, A2[1] - H + ue * 0.6], Be = [Bq[0] + ue, Bq[1] - H + ue * 0.6], B2e = [B2[0] + ue, B2[1] - H + ue * 0.6];
  k += `<path d="${P([Ae, [G[0] - 1, G[1] - 1.4], [G2[0] - 1, G2[1] - 1.4], A2e])}" fill="${S.lg("dachs", [[0, "#8e6c36"], [1, "#6c5026"]])}"/>`;
  k += `<path d="${P([Bq, B2, up(B2, H), up(Bq, H)])}" fill="${S.lg("wseite", [[0, "#e9dfca"], [1, "#d2c6ad"]], 0, 0, 1, 0)}"/>`;
  /* Feldsteine der Seitenwand: dieselben unregelmäßigen Vielecke, perspektivisch auf die Wand gelegt */
  const zs = zufall(91);
  const wq = (t, v) => { const bx = Bq[0] + (B2[0] - Bq[0]) * t, by = Bq[1] + (B2[1] - Bq[1]) * t, hh = H * (1 - f * t); return [bx, by - hh * v]; };
  let st = "";
  {
    /* dasselbe Bruchsteinmauerwerk wie vorn (drei Steingrößen, breite Lehmfugen), in Wandkoordinaten erzeugt
       (u: 0…83 = 8 m, v: 0…H) und auf die verkürzte Seitenwand gelegt; heller, weil die Morgensonne darauf fällt */
    const fs = ["#cbbfa8", "#d6c9ae", "#c0b49e", "#ddd0b6", "#c6baa5", "#d1c4aa"], seiteD = [], LU = 83;
    let v0 = 0.4;
    while (v0 < H) {
      const hh = [2.6, 3.8, 5.2][Math.floor(zs() * 3)];
      for (let u = -1 + zs() * 2; u < LU; ) {
        const w = hh * (0.9 + zs() * 0.9), j = () => (zs() - 0.5) * 0.9;
        const pts = [[u + 0.5 + j(), v0 + 0.5], [u + w * 0.5 + j(), v0 + 0.4], [u + w - 0.5 + j(), v0 + 0.6], [u + w - 0.4 + j(), v0 + hh * 0.55], [u + w - 0.6 + j(), v0 + hh - 0.5], [u + w * 0.45 + j(), v0 + hh - 0.4], [u + 0.5 + j(), v0 + hh - 0.6], [u + 0.3 + j(), v0 + hh * 0.45]]
          .map(([uu, vv]) => wq(Math.max(0, Math.min(1, uu / LU)), Math.max(0, Math.min(1, vv / H))));
        const c = Math.floor(zs() * fs.length); seiteD[c] = (seiteD[c] || "") + Pr(pts);
        u += w + 0.9 + zs() * 0.6;
      }
      v0 += hh + 0.9;
    }
    st = seiteD.map((d0, c) => d0 ? `<path d="${d0}" fill="${fs[c]}"/>` : "").join("");
  }
  k += `<path d="${P([Bq, B2, up(B2, H), up(Bq, H)])}" fill="#857560"/>${st}`;
  st = "";
  k += `<path d="${P([Be, [G[0] + 0.6, G[1] - 1.6], [G2[0] + 0.6, G2[1] - 1.6], B2e])}" fill="${S.lg("dachl", [[0, "#e9c985"], [0.55, "#cfa865"], [1, "#a8823f"]], 0, 0, 1, 0.3)}"/>`;
  k += `<path d="${P([Be, [G[0] + 0.6, G[1] - 1.6], [G2[0] + 0.6, G2[1] - 1.6], B2e])}" fill="${STROH}" opacity=".5"/>`;
  /* Bindeschnüre quer über die Dachfläche und Halme an der Traufe */
  for (let i = 1; i < 6; i++) { const t = i / 6; k += `<path d="M${r(G[0] + (G2[0] - G[0]) * t + 0.6)} ${r(G[1] + (G2[1] - G[1]) * t - 1.6)} L${r(Be[0] + (B2e[0] - Be[0]) * t)} ${r(Be[1] + (B2e[1] - Be[1]) * t)}" stroke="#7d6232" stroke-width=".4" opacity=".6"/>`; }
  let halme = "";
  for (let t = 0; t <= 1.001; t += 0.022) { const p0 = [Be[0] + (B2e[0] - Be[0]) * t, Be[1] + (B2e[1] - Be[1]) * t], l = (2.6 + zs() * 1.6) * (1 - t * 0.4); halme += `M${r(p0[0] - 0.4)} ${r(p0[1] - 1.2)} l${r(0.5 + zs() * 0.6)} ${r(l)}`; }
  k += `<path d="M${r(Be[0])} ${r(Be[1] - 1.4)} L${r(B2e[0])} ${r(B2e[1] - 1.2)} L${r(B2e[0] + 0.6)} ${r(B2e[1] + 0.8)} L${r(Be[0] + 0.8)} ${r(Be[1] + 1.4)} Z" fill="#9a7840"/><path d="${halme}" stroke="#7a5a2a" stroke-width=".5"/><path d="${halme.replace(/M([\d.-]+) /g, (m0, v) => "M" + r(+v + 0.35) + " ")}" stroke="#d6b26c" stroke-width=".35" opacity=".8"/>`;
  /* Giebelwand (Südost, zu uns): grobe Feldsteine mit Lehm, streifendes Morgenlicht */
  const giebel = [A, Bq, up(Bq, H), G, up(A, H)];
  /* Inka-Feldstein: unregelmäßige Vielecke in drei Größen, breite Fugen aus dunklem Lehmmörtel */
  S.def(`<clipPath id="${S.id("giebelclip")}"><path d="${P(giebel)}"/></clipPath>`);
  k += `<path d="${P(giebel)}" fill="#7a6a55"/>`;
  const steinFarben = ["#a89c88", "#b6a991", "#998d7a", "#c0b29a", "#9f9482", "#aea089"];
  let steine = "", steinD = [], lichtD = "";
  {
    let y0 = Y;
    while (y0 > G[1] - 2) {
      const hh = [2.6, 3.8, 5.2][Math.floor(zs() * 3)];
      for (let x = X - 2 + zs() * 2; x < X + W + 2; ) {
        const w = hh * (0.9 + zs() * 0.9), j = () => (zs() - 0.5) * 0.9;
        const pts = [[x + 0.5 + j(), y0 - 0.5], [x + w * 0.5 + j(), y0 - 0.4 + j() * 0.4], [x + w - 0.5 + j(), y0 - 0.6], [x + w - 0.4 + j(), y0 - hh * 0.55], [x + w - 0.6 + j(), y0 - hh + 0.5], [x + w * 0.45 + j(), y0 - hh + 0.4 + j() * 0.4], [x + 0.5 + j(), y0 - hh + 0.6], [x + 0.3 + j(), y0 - hh * 0.45]];
        const c = Math.floor(zs() * steinFarben.length); steinD[c] = (steinD[c] || "") + Pr(pts);
        lichtD += `M${r(pts[6][0])} ${r(pts[6][1] + 0.3)}L${r(pts[5][0])} ${r(pts[5][1] + 0.3)}L${r(pts[4][0])} ${r(pts[4][1] + 0.3)}`;
        x += w + 0.9 + zs() * 0.6;
      }
      y0 -= hh + 0.9;
    }
    steine = steinD.map((d0, c) => d0 ? `<path d="${d0}" fill="${steinFarben[c]}"/>` : "").join("") + `<path d="${lichtD}" stroke="#ddd2bc" stroke-width=".35" fill="none" opacity=".8"/>`;
  }
  k += `<g clip-path="url(#${S.id("giebelclip")})">${steine}<path d="${P(giebel)}" fill="${S.lg("wfrontlicht", [[0, "#000", 0.12], [0.6, "#000", 0], [1, "#fff4dc", 0.15]], 0, 0, 1, 0)}"/></g>`;
  /* Lichtkante rechts innen, Mauerkrone */
  k += `<path d="M${r(Bq[0] - 0.4)} ${r(Bq[1])} L${r(Bq[0] - 0.4)} ${r(Bq[1] - H)}" stroke="#f3ead6" stroke-width=".8"/>`;
  /* trapezförmige Tür und Fenster im Giebel */
  const trapez = (cx, b, h, y0) => `M${r(cx - b / 2)} ${r(y0)} L${r(cx - b * 0.33)} ${r(y0 - h)} L${r(cx + b * 0.33)} ${r(y0 - h)} L${r(cx + b / 2)} ${r(y0)} Z`;
  k += `<path d="${trapez(X + W / 2, 13, 20, Y)}" fill="#2a241e"/><path d="${trapez(X + W / 2, 13, 20, Y)}" fill="none" stroke="#efe5cf" stroke-width=".6" opacity=".7"/>`;
  k += `<path d="M${r(X + W / 2 - 4.6)} ${r(Y - 20.4)} h9.2 v1.8 h-9.2 Z" fill="#b5a88f"/>`;
  k += `<path d="${trapez(X + W / 2, 5.4, 6.6, Y - H - 7)}" fill="#2a241e"/>`;
  /* Steinzapfen (zum Festbinden des Daches): stecken IN der Giebelwand, gut 2 Einheiten innerhalb der Kante,
     in drei Reihen, mit kleinem Schatten nach links unten */
  {
    const len = Math.hypot(W / 2, GI), nx = GI / len * 2.4, ny = (W / 2) / len * 2.4;
    let za = "", zs2 = "", zl = "";
    for (const t of [0.3, 0.56, 0.82]) for (const sd of [-1, 1]) {
      const px = G[0] + sd * (W / 2) * t - sd * nx, py = G[1] + GI * t + ny;
      zs2 += `<ellipse cx="${r(px - 0.7)}" cy="${r(py + 0.7)}" rx="1.1" ry=".8"/>`;
      za += `<ellipse cx="${r(px)}" cy="${r(py)}" rx="1.05" ry=".85"/>`;
      zl += `M${r(px - 0.2)} ${r(py - 0.7)} a1 .8 0 0 1 1 .6`;
    }
    k += `<g fill="#2e261e" opacity=".45">${zs2}</g><g fill="#b4a68d" stroke="#5f5444" stroke-width=".3">${za}</g><path d="${zl}" stroke="#efe4cc" stroke-width=".35" fill="none"/>`;
  }
  /* Dachkante vorn (Halme stehen über) */
  k += `<path d="M${r(Ae[0])} ${r(Ae[1])} L${r(G[0])} ${r(G[1] - 2)} L${r(Be[0])} ${r(Be[1])}" stroke="#9d7b40" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(Ae[0])} ${r(Ae[1] - 0.8)} L${r(G[0])} ${r(G[1] - 2.8)} L${r(Be[0])} ${r(Be[1] - 0.8)}" stroke="#ecd39a" stroke-width=".55" fill="none"/>`;
  const unter = [
    { id: "strohdach", de: "das Strohdach", syl: "STROH-dach", it: "il tetto di paglia", itSyl: "TET-to di PA-glia", en: "thatched roof", x: G[0] + 14, y: G[1] + 14, kunst: `<path d="${P([[Be[0] - G[0] - 14, Be[1] - G[1] - 14], [-14, -16], [G2[0] - G[0] - 14, G2[1] - G[1] - 16], [B2e[0] - G[0] - 14, B2e[1] - G[1] - 14]])}" class="bw-flaeche" fill="rgba(255,255,255,0.001)"/>`,
      tipp: "Das Dach ist aus Ichu, einem harten Gras der Anden. Es wird mit Seilen an Steinringen festgebunden." },
    { id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: X + W / 2, y: Y - 10, kunst: flaeche(-7, -11, 14, 21),
      tipp: "Inka-Türen sind unten breiter als oben. So halten sie auch bei einem Erdbeben." },
  ];
  S.teil({ id: "waechterhaus", de: "das Wächterhaus", syl: "WÄCH-ter-haus", it: "la casa del guardiano", itSyl: "CA-sa del guar-DIA-no", en: "guardhouse", x: X + W / 2, y: Y - 26, kunst: um(X + W / 2, Y - 26, kappeRand(k)),
    zoom: { x: -2, y: 176, w: 96, h: 64 }, unter,
    tipp: "Von hier oben bewachten die Inka die Wege in die Stadt. Hier entsteht das berühmte Foto von Machu Picchu." });
}

/* =====================================================================
   10 — DAS LAMA und DAS FOHLEN (weiden auf den Terrassen)
   ===================================================================== */
/* Lama von der Seite (Maße in Metern, nach rechts schauend): Widerrist 1,1 m, Kopf 1,75 m, dichte Wolle,
   kräftiger Hals, Bananenohren, Zehen mit Polstern. Fußpunkt (0|0), H = Höhe bis zu den Ohrspitzen. */
const lama = (H, dir, fell, fleck, seed, jung = false) => {
  const u = H / 1.86, z = zufall(seed);
  const Q = (pts) => pts.map(([a, b]) => [a * u * dir, -b * u]);
  const X = (v) => r(v * u * dir), Y = (v) => r(-v * u);
  let o = "";
  /* Schatten am Boden: lang nach links, etwas in die Tiefe */
  o += `<path d="${glatt(Q([[-0.5, 0.02], [0.55, 0.02], [0.4 - (dir > 0 ? 1.6 : 0.6), 0.14], [-0.7 - (dir > 0 ? 1.3 : 0.2), 0.12]]), true, 0.8)}" fill="#22361a" opacity=".3"/>`;
  const bein = (x, knick, c, dicke = 0.17) => `<path d="${glatt(Q([[x - dicke / 2, 0.8], [x - dicke * 0.36, 0.42], [x - 0.045 + knick, 0.1], [x - 0.07 + knick, 0], [x + 0.08 + knick, 0], [x + 0.05 + knick, 0.1], [x + dicke * 0.3, 0.42], [x + dicke / 2, 0.8]]), true, 0.5)}" fill="${c}"/>`;
  const dunkel = jung ? "#6d4c30" : "#b3a389";
  o += bein(-0.36, 0.03, dunkel) + bein(0.46, -0.02, dunkel);
  /* Körper: dicke Wolle, unten Fransen */
  const kp = [[-0.72, 1.0], [-0.68, 1.14], [-0.52, 1.22], [-0.2, 1.2], [0.1, 1.19], [0.38, 1.21], [0.6, 1.16], [0.72, 1.0], [0.7, 0.8], [0.56, 0.64], [0.2, 0.6], [-0.15, 0.61], [-0.48, 0.65], [-0.68, 0.8]];
  o += `<path d="${glatt(Q(kp), true, 0.9)}" fill="${fell}"/>`;
  if (fleck) o += `<path d="${glatt(Q([[-0.12, 1.19], [0.3, 1.21], [0.58, 1.12], [0.5, 0.86], [0.12, 0.8], [-0.1, 0.95]]), true, 0.9)}" fill="${fleck}"/>`;
  let wo = "";
  for (let i = 0; i < 12; i++) { const x = -0.64 + i * 0.11; wo += `M${X(x)} ${Y(0.66 - (i % 2) * 0.04)} q${r(0.03 * u * dir)} ${r(0.07 * u)} ${r(0.08 * u * dir)} ${r(0.01 * u)}`; }
  o += `<path d="${wo}" stroke="${fell}" stroke-width="${r(0.05 * u)}" fill="none" stroke-linecap="round"/>`;
  let lo = "";
  for (let i = 0; i < 7; i++) { const x = -0.5 + i * 0.16, y = 0.9 + (i % 3) * 0.08; lo += `M${X(x)} ${Y(y)} q${r(0.05 * u * dir)} ${r(-0.05 * u)} ${r(0.1 * u * dir)} 0`; }
  o += `<path d="${lo}" stroke="#7a6a58" stroke-width="${r(0.02 * u)}" fill="none" opacity=".4"/>`;
  o += bein(-0.5, -0.04, fell, 0.19) + bein(0.34, 0.04, fell, 0.19);
  o += `<path d="M${X(-0.58)} ${Y(0.02)} h${X(0.15)} M${X(0.34)} ${Y(0.02)} h${X(0.15)}" stroke="#3d3026" stroke-width="${r(0.05 * u)}"/>`;
  o += `<path d="${glatt(Q([[-0.66, 1.12], [-0.8, 1.12], [-0.86, 0.98], [-0.74, 0.96], [-0.68, 1.02]]), true, 0.8)}" fill="${fell}"/>`;
  /* kräftiger Hals mit Wolle vorn, Kopf mit langer Schnauze */
  const kh = jung ? 1.44 : 1.56;
  o += `<path d="${glatt(Q([[0.3, 1.04], [0.42, 1.32], [0.5, kh], [0.74, kh + 0.02], [0.74, 1.3], [0.74, 1.0]]), true, 0.8)}" fill="${fell}"/>`;
  let hw = "";
  for (let i = 0; i < 5; i++) { const y = 1.08 + i * 0.09; hw += `M${X(0.74)} ${Y(y)} q${X(0.04)} ${Y(0.03)} 0 ${Y(0.06) - Y(0)}`; }
  o += `<path d="${hw}" stroke="${fell}" stroke-width="${r(0.04 * u)}" fill="none"/>`;
  o += `<path d="${glatt(Q([[0.48, kh + 0.04], [0.56, kh + 0.17], [0.72, kh + 0.19], [0.88, kh + 0.12], [0.98, kh + 0.03], [0.96, kh - 0.05], [0.8, kh - 0.08], [0.6, kh - 0.06]]), true, 0.8)}" fill="${fell}"/>`;
  for (const [ox, kr] of [[0.56, -0.05], [0.66, 0.02]]) o += `<path d="${glatt(Q([[ox, kh + 0.15], [ox - 0.04 + kr, kh + 0.28], [ox + kr, kh + 0.37], [ox + 0.07, kh + 0.28], [ox + 0.07, kh + 0.15]]), true, 0.8)}" fill="${fell}"/>`;
  o += `<circle cx="${X(0.76)}" cy="${Y(kh + 0.08)}" r="${r(0.032 * u)}" fill="#1d1712"/><circle cx="${X(0.77)}" cy="${Y(kh + 0.09)}" r="${r(0.01 * u)}" fill="#fff"/>`;
  o += `<path d="M${X(0.95)} ${Y(kh + 0.03)} l${X(0.02)} ${Y(-0.03)} M${X(0.9)} ${Y(kh - 0.04)} q${X(0.04)} ${Y(-0.02)} ${X(0.08)} ${Y(0.01)}" stroke="#4a3a2e" stroke-width="${r(0.02 * u)}" fill="none"/>`;
  return o;
};
/* Lamafohlen (Cria): im Verhältnis lange Beine, kleiner runder Körper mit krauser Wolle, kurzer dicker Hals, runder Kopf */
const fohlenBild = (H, dir, fell, fleck) => {
  const u = H / 1.8, X = (v) => r(v * u * dir), Y = (v) => r(-v * u);
  const Q = (pts) => pts.map(([a, b]) => [a * u * dir, -b * u]);
  let o = `<path d="${glatt(Q([[-0.4, 0.02], [0.45, 0.02], [0.2 - (dir > 0 ? 1.4 : 0.5), 0.12], [-0.5 - (dir > 0 ? 1.1 : 0.2), 0.1]]), true, 0.8)}" fill="#22361a" opacity=".3"/>`;
  const bein = (x, c) => `<path d="${glatt(Q([[x - 0.06, 1.0], [x - 0.045, 0.5], [x - 0.04, 0.06], [x - 0.06, 0], [x + 0.07, 0], [x + 0.05, 0.06], [x + 0.045, 0.5], [x + 0.06, 1.0]]), true, 0.5)}" fill="${c}"/>`;
  o += bein(-0.28, "#7a5634") + bein(0.3, "#7a5634");
  o += `<ellipse cx="0" cy="${Y(1.16)}" rx="${r(0.52 * u)}" ry="${r(0.27 * u)}" fill="${fell}"/>`;
  let kraus = ""; for (let i = 0; i < 11; i++) { const a = Math.PI * (1.05 + i * 0.09), x = Math.cos(a) * 0.5, y = 1.16 - Math.sin(a) * 0.26; kraus += `<circle cx="${X(x)}" cy="${Y(y)}" r="${r(0.075 * u)}"/>`; }
  o += `<g fill="${fell}">${kraus}</g>`;
  if (fleck) o += `<ellipse cx="${X(-0.05)}" cy="${Y(1.22)}" rx="${r(0.24 * u)}" ry="${r(0.13 * u)}" fill="${fleck}" opacity=".9"/>`;
  let lo = ""; for (let i = 0; i < 9; i++) lo += `M${X(-0.38 + i * 0.09)} ${Y(1.08 + (i % 3) * 0.06)} q${r(0.03 * u * dir)} ${r(-0.04 * u)} ${r(0.06 * u * dir)} 0`;
  o += `<path d="${lo}" stroke="#5a3e26" stroke-width="${r(0.022 * u)}" fill="none" opacity=".45"/>`;
  o += bein(-0.38, fell) + bein(0.22, fell);
  o += `<path d="M${X(-0.44)} ${Y(0.02)} h${X(0.12)} M${X(0.16)} ${Y(0.02)} h${X(0.12)}" stroke="#3d3026" stroke-width="${r(0.05 * u)}"/>`;
  o += `<path d="${glatt(Q([[0.3, 1.2], [0.36, 1.42], [0.44, 1.56], [0.62, 1.56], [0.6, 1.36], [0.56, 1.14]]), true, 0.8)}" fill="${fell}"/>`;
  o += `<circle cx="${X(0.56)}" cy="${Y(1.62)}" r="${r(0.16 * u)}" fill="${fell}"/><ellipse cx="${X(0.7)}" cy="${Y(1.58)}" rx="${r(0.09 * u)}" ry="${r(0.07 * u)}" fill="${fell}"/>`;
  for (const [ox, kr] of [[0.5, -0.04], [0.58, 0.03]]) o += `<path d="${glatt(Q([[ox, 1.72], [ox - 0.03 + kr, 1.84], [ox + kr, 1.9], [ox + 0.05, 1.84], [ox + 0.05, 1.72]]), true, 0.8)}" fill="${fell}"/>`;
  o += `<circle cx="${X(0.6)}" cy="${Y(1.65)}" r="${r(0.035 * u)}" fill="#1d1712"/><circle cx="${X(0.61)}" cy="${Y(1.66)}" r="${r(0.012 * u)}" fill="#fff"/><path d="M${X(0.76)} ${Y(1.57)} l${X(0.02)} ${Y(-0.02)}" stroke="#3a2e26" stroke-width="${r(0.02 * u)}"/>`;
  return o;
};
{
  /* Mutter auf der zweiten großen Stufe, das Fohlen daneben */
  const t = TERR[TERR.length - 2], x = 168, y = profilY(t.vorn, 168) - 3;
  const k = `<g filter="${VOL_FIGUR}">${lama(29, 1, S.lg("lamafell", [[0, "#f7f2e8"], [1, "#d9cfbb"]], 0, 0, 1, 0), "#9b6a3c", 5)}</g>`;
  S.teil({ id: "lama", de: "das Lama", syl: "LA-ma", it: "il lama", itSyl: "LA-ma", en: "llama", x, y, steht: true, kunst: k,
    tipp: "Lamas tragen Lasten und geben Wolle. Hier halten sie das Gras auf den Terrassen kurz." });
  const x2 = 202, y2 = profilY(t.vorn, 202) - 4.5;
  const k2 = `<g filter="${VOL_FIGUR}">${fohlenBild(17, -1, S.lg("fohlenfell", [[0, "#c39668"], [1, "#94693f"]], 0, 0, 1, 0), "#f2ebdc")}</g>`;
  S.teil({ id: "fohlen", de: "das Fohlen", syl: "FOH-len", it: "il piccolo di lama", itSyl: "PIC-co-lo di LA-ma", en: "baby llama", x: x2, y: y2, steht: true, kunst: k2,
    tipp: "Ein junges Lama heißt Fohlen – wie bei Pferden. Es trinkt etwa sechs Monate lang Milch bei seiner Mutter." });
}

/* =====================================================================
   11 — DIE TREPPE (Inka-Treppe durch die Terrassen hinab zur Stadt)
   ===================================================================== */
{
  let k = "";
  /* zwei Läufe mit einem Absatz: der Abstieg folgt den Terrassen und knickt auf halber Höhe nach rechts */
  const lauf = (unten, oben, cu, co, bu, bo) => {
    const xl = (y) => cu - bu / 2 + ((co - bo / 2) - (cu - bu / 2)) * (unten - y) / (unten - oben), xr = (y) => cu + bu / 2 + ((co + bo / 2) - (cu + bu / 2)) * (unten - y) / (unten - oben);
    let o = `<path d="M${r(xl(unten) - 3)} ${unten} L${r(xl(oben) - 1)} ${oben} L${r(xl(oben))} ${oben} L${r(xl(unten))} ${unten} Z" fill="#9b9283"/>`;
    o += `<path d="M${r(xr(unten))} ${unten} L${r(xr(oben))} ${oben} L${r(xr(oben) + 1.1)} ${oben} L${r(xr(unten) + 3.4)} ${unten} Z" fill="#e6dcc6"/>`;
    o += `<path d="M${r(xl(unten))} ${unten} L${r(xl(oben))} ${oben} L${r(xr(oben))} ${oben} L${r(xr(unten))} ${unten} Z" fill="${S.lg("treppe", [[0, "#ddd4c1"], [1, "#c4baa5"]])}"/>`;
    let y = unten;
    while (y > oben + 0.8) {
      const h = 0.8 + (y - 211) * 0.075;
      o += `<path d="M${r(xl(y))} ${r(y - h)} L${r(xr(y))} ${r(y - h)}" stroke="#fbf5e6" stroke-width="${r(0.2 + h * 0.12)}"/>`;
      o += `<path d="M${r(xl(y - h))} ${r(y - h - h * 0.28)} L${r(xr(y - h))} ${r(y - h - h * 0.28)}" stroke="#6f6658" stroke-width="${r(h * 0.3)}" opacity=".55"/>`;
      y -= h;
    }
    return { o, xl, xr };
  };
  const L1 = lauf(262, 238, 228, 230, 22, 15), L2 = lauf(233, 211, 238, 240, 12, 7);
  k += L1.o;
  /* Absatz (Podest) */
  k += `<path d="M${r(L1.xl(238) - 1)} 238 L${r(L2.xr(233) + 1)} 238 L${r(L2.xr(233) + 0.4)} 233 L${r(L1.xl(238) - 0.4)} 233 Z" fill="${S.lg("podest", [[0, "#e8dfcc"], [1, "#cfc5b0"]])}"/><path d="M${r(L1.xl(238) - 1)} 238 H${r(L2.xr(233) + 1)}" stroke="#fbf5e6" stroke-width=".5"/>`;
  k += L2.o;
  const unten = 262, oben = 211, xl = (y) => (y > 236 ? L1.xl(y) : L2.xl(y)), xr = (y) => (y > 236 ? L1.xr(y) : L2.xr(y));
  /* einzelne Steinfugen */
  const zt = zufall(57); let f = "";
  for (let i = 0; i < 26; i++) { const yy = oben + 2 + zt() * (unten - oben - 4), x = xl(yy) + zt() * (xr(yy) - xl(yy)); f += `M${r(x)} ${r(yy)} l0 ${r(0.6 + (yy - oben) * 0.03)}`; }
  k += `<path d="${f}" stroke="#8f8676" stroke-width=".25"/>`;
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scala", itSyl: "SCA-la", en: "stairs", x: 230, y: 240, kunst: um(230, 240, k),
    tipp: "In Machu Picchu gibt es über 100 Treppen aus Stein. Manche Stufen sind aus einem einzigen Felsblock gehauen." });
}

/* =====================================================================
   12 — DER BUS auf der Serpentine
   ===================================================================== */
{
  let k = `<path d="M-6.4 .6 L6.2 -.6 L6.2 .4 L-6.4 1.6 Z" fill="#2a2c20" opacity=".35"/>`;
  k += `<path d="M-6 -3.4 L5.6 -3.8 Q6.4 -3.8 6.4 -3 L6.4 .1 L-6 .6 Z" fill="${S.lg("bus", [[0, "#ffffff"], [1, "#d9dcd8"]])}"/>`;
  k += `<path d="M-6 -1.3 L6.4 -1.7 L6.4 -1 L-6 -.6 Z" fill="#2f8a4a"/>`;
  k += `<path d="M-5.6 -3 L6 -3.36 L6 -2 L-5.6 -1.66 Z" fill="#1f2c36"/>`;
  for (let i = 1; i < 5; i++) k += `<path d="M${r(-5.6 + i * 2.3)} -3.1 v1.4" stroke="#c9d3d8" stroke-width=".25"/>`;
  k += `<path d="M5 -3.3 h1.2 v1.6 h-1.2 Z" fill="#6b8696"/><circle cx="-3.6" cy=".5" r=".75" fill="#1d1d1d"/><circle cx="3.8" cy=".2" r=".75" fill="#1d1d1d"/>`;
  k += `<path d="M-6 -3.4 L5.6 -3.8" stroke="#fff" stroke-width=".35"/>`;
  /* Staubfahne hinter dem Bus und ein Sonnenglanz auf der Frontscheibe: so sticht er aus dem Wald heraus */
  k = `<g filter="url(#${S.id("weich")})"><path d="M-6 -.6 Q-11 -2.4 -17 -1.4 Q-11 .8 -6 .8 Z" fill="#efe4c8" opacity=".75"/></g>` + k;
  k += `<g filter="url(#${S.id("weich")})"><circle cx="5.8" cy="-2.8" r="1.6" fill="#fffbe8"/></g><path d="M5.8 -5 v4.4 M3.6 -2.8 h4.4" stroke="#fffdf0" stroke-width=".35" opacity=".9"/>`;
  S.teil({ oben: true, id: "bus", de: "der Bus", syl: "BUS", it: "l'autobus", itSyl: "AU-to-bus", en: "bus", x: 349, y: 196.4, kunst: `<g transform="rotate(4) scale(.38)">${k}</g>`,
    tipp: "Die Busse fahren in etwa 25 Minuten vom Ort Aguas Calientes zur Ruinenstadt hinauf." });
}

/* =====================================================================
   13 — DIE TOURISTEN (Familie auf der vorderen Terrasse), mit Lupe:
        die Mütze (Chullo), der Poncho, die Panflöte
   ===================================================================== */
{
  const dunkel = (svg) => vereinfache(svg, 0.2);
  const schattenFigur = (x, y, h) => `<path d="M${r(x - 2.6)} ${r(y + 0.6)} L${r(x + 2.4)} ${r(y + 0.4)} L${r(x - h * 0.95)} ${r(y - h * 0.12)} L${r(x - h * 1.05)} ${r(y - h * 0.06)} Z" fill="${S.lg("figschatten", [[0, "#1d3014", 0], [0.15, "#1d3014", 0.18], [1, "#1d3014", 0.38]], 0, 0, 1, 0)}"/>`;
  const fig = (spec, hoehe) => B.mensch(Object.assign({ ohneSchatten: true, laecheln: true }, spec), hoehe);
  const pk = (m, n) => [m.z.punkte[n][0] * m.k, m.z.punkte[n][1] * m.k];
  let k = "", sch = "";
  /* Vater: schaut zur Stadt (Rücken zu uns), trägt den roten Poncho aus Alpakawolle */
  const V = { x: 302, y: 254 };
  const mv = fig({ id: "per_vater", geschlecht: "m", alter: "erwachsen", pose: "stehen", blick: 158, frisur: "kurz", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#3f4a5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 42);
  {
    const [slx, sly] = pk(mv, "schulterL"), [srx, sry] = pk(mv, "schulterR"), [hx, hy] = pk(mv, "hals"), [hlx, hly] = pk(mv, "huefteL"), [hrx] = pk(mv, "huefteR");
    const xa = Math.min(slx, srx) - 2.2, xb = Math.max(slx, srx) + 2.2, yS = Math.min(sly, sry), yu = hly + 3.4, xm = (xa + xb) / 2;
    let po = `<path d="M${r(hx - 1.6)} ${r(hy - 0.4)} Q${r(xa + 0.6)} ${r(yS - 0.6)} ${r(xa - 0.6)} ${r(yS + 2.4)} L${r(xa - 2.2)} ${r(yu)} Q${r(xm)} ${r(yu + 1.6)} ${r(xb + 2.2)} ${r(yu)} L${r(xb + 0.6)} ${r(yS + 2.4)} Q${r(xb - 0.6)} ${r(yS - 0.6)} ${r(hx + 1.6)} ${r(hy - 0.4)} Z" fill="${S.lg("poncho", [[0, "#8e1c22"], [0.55, "#b8282f"], [1, "#d8453c"]], 0, 0, 1, 0)}"/>`;
    /* Streifenbänder (gelb, grün, schwarz) und Fransen am Saum */
    for (const [dy, c, w] of [[-3.2, "#f2c230", 0.45], [-2.5, "#1f6b3a", 0.4], [-1.9, "#f2c230", 0.3], [-6.6, "#1d1d22", 0.3]]) po += `<path d="M${r(xa - 2 + 0.2)} ${r(yu + dy)} Q${r(xm)} ${r(yu + dy + 1.6)} ${r(xb + 2 - 0.2)} ${r(yu + dy)}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
    for (let x = xa - 1.8; x < xb + 1.8; x += 0.7) po += `<path d="M${r(x)} ${r(yu + 1.2 - Math.pow((x - xm) / (xb - xa + 4), 2) * 6)} l0 1.2" stroke="#9c2128" stroke-width=".25"/>`;
    po += `<path d="M${r(xb + 0.2)} ${r(yS + 2.6)} L${r(xb + 1.6)} ${r(yu - 0.4)}" stroke="#f07a5a" stroke-width=".6" opacity=".7"/>`;
    k += `<g transform="translate(${V.x} ${V.y})"><g filter="${VOL_FIGUR}">${dunkel(mv.svg)}</g>${po}</g>`;
    sch += schattenFigur(V.x, V.y, 42);
    STADT.poncho = { x: V.x + xm, y: V.y + (yS + yu) / 2 };
  }
  /* Mutter: fotografiert die Stadt (Rücken zu uns), mit Rucksack und Sonnenhut */
  const M = { x: 328, y: 251 };
  const poseFoto = { lende: 1, brust: -2, nacken: 4, kopf: 0, schulterL: { vor: 58, seit: 22 }, ellbogenL: 118, unterarmL: 60, handL: 10, fingerL: 0.6, schulterR: { vor: 56, seit: 24 }, ellbogenR: 120, unterarmR: 60, handR: 10, fingerR: 0.6,
    huefteL: { vor: 10, seit: 4, dreh: -6 }, knieL: 8, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -6 }, knieR: 2, fussR: 0 };
  const mm = fig({ id: "per_mutter", geschlecht: "w", alter: "erwachsen", pose: poseFoto, blick: 172, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e9e4d6" }, unterteil: { stueck: "hose", farbe: "#6a6f52" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "hut", farbe: "#e8dcc0" } } }, 39);
  {
    const [slx, sly] = pk(mm, "schulterL"), [srx, sry] = pk(mm, "schulterR"), [, ty] = pk(mm, "tailleL"), xa = Math.min(slx, srx) + 0.6, xb = Math.max(slx, srx) - 0.6, y0 = Math.min(sly, sry) + 1.2;
    STADT.rucksack = `<path d="M${r(xa)} ${r(y0)} Q${r((xa + xb) / 2)} ${r(y0 - 1.4)} ${r(xb)} ${r(y0)} L${r(xb + 0.4)} ${r(ty - 0.6)} Q${r((xa + xb) / 2)} ${r(ty + 0.8)} ${r(xa - 0.4)} ${r(ty - 0.6)} Z" fill="${S.lg("rucksack", [[0, "#24566e"], [0.6, "#2f6f8f"], [1, "#4a8aa8"]], 0, 0, 1, 0)}"/><path d="M${r(xa + 0.8)} ${r((y0 + ty) / 2 + 1)} h${r(xb - xa - 1.6)} v${r(ty - y0 - 3)} h${r(-(xb - xa - 1.6))} Z" fill="#285f7a"/><path d="M${r(xa + 0.3)} ${r(y0 + 0.2)} Q${r(xa - 0.6)} ${r(y0 - 1.4)} ${r(xa + 0.6)} ${r(y0 - 2.2)} M${r(xb - 0.3)} ${r(y0 + 0.2)} Q${r(xb + 0.6)} ${r(y0 - 1.4)} ${r(xb - 0.6)} ${r(y0 - 2.2)}" stroke="#1d3e50" stroke-width=".5" fill="none"/><path d="M${r((xa + xb) / 2 - 1)} ${r(y0 - 0.9)} q1 -.8 2 0" stroke="#1d3e50" stroke-width=".35" fill="none"/>`;
  }
  k = `<g transform="translate(${M.x} ${M.y})"><g filter="${VOL_FIGUR}">${dunkel(mm.svg)}${STADT.rucksack}</g></g>` + k;
  sch += schattenFigur(M.x, M.y, 39);
  /* Mädchen: schaut zu uns, trägt den Chullo und hält eine Panflöte */
  const Mä = { x: 278, y: 257 };
  const poseHalt = { lende: 1, brust: -1, nacken: 4, kopf: -4, schulterL: { vor: 4, seit: 8 }, ellbogenL: 12, unterarmL: 0, handL: 0, fingerL: 0.4, schulterR: { vor: 18, seit: 22 }, ellbogenR: 64, unterarmR: 60, handR: 6, fingerR: 0.7,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 3, dreh: -6 }, knieR: 2, fussR: 0 };
  const mk = fig({ id: "per_kind", geschlecht: "w", alter: "kind", pose: poseHalt, blick: -22, frisur: "zopf", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e0802e" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 31);
  let chullo = "", floete = "";
  {
    const [sx, sy] = pk(mk, "scheitel"), [stx, sty] = pk(mk, "stirn"), [ox, oy] = pk(mk, "ohr"), [hkx, hky] = pk(mk, "hinterkopf"), [kx, ky] = pk(mk, "kinn");
    const cx = (stx + hkx) / 2, br = Math.abs(stx - hkx) / 2 + 1.1, yT = sy - 0.5, yB = sty + 0.4;
    const fl = (side) => { const ex = cx + side * (br - 0.2); return `<path d="M${r(ex - side * 0.9)} ${r(yB - 0.2)} L${r(ex + side * 0.15)} ${r(yB - 0.1)} L${r(ex + side * 0.1)} ${r(ky - 0.2)} Q${r(ex - side * 0.4)} ${r(ky + 0.5)} ${r(ex - side * 0.9)} ${r(ky - 0.4)} Z" fill="#b8262e"/><path d="M${r(ex - side * 0.4)} ${r(ky + 0.2)} l${r(side * 0.1)} 3.2" stroke="#f2c230" stroke-width=".35"/><circle cx="${r(ex - side * 0.3)}" cy="${r(ky + 3.6)}" r=".55" fill="#2f6fb0"/>`; };
    chullo += fl(-1) + fl(1);
    chullo += `<path d="M${r(cx - br)} ${r(yB)} Q${r(cx - br)} ${r(yT - 1.2)} ${r(cx)} ${r(yT - 1.4)} Q${r(cx + br)} ${r(yT - 1.2)} ${r(cx + br)} ${r(yB)} Z" fill="${S.lg("chullo", [[0, "#c22d33"], [1, "#e05040"]], 0, 0, 1, 0)}"/>`;
    /* Muster: weißes Zickzackband, blaues und gelbes Band */
    let zz = `M${r(cx - br + 0.3)} ${r(yB - 1.6)}`;
    for (let x = cx - br + 0.3, i = 0; x < cx + br - 0.3; x += 0.55, i++) zz += ` L${r(x + 0.55)} ${r(yB - 1.6 + (i % 2 ? 0 : -0.6))}`;
    chullo += `<path d="${zz}" stroke="#fbf6ea" stroke-width=".32" fill="none"/>`;
    chullo += `<path d="M${r(cx - br + 0.1)} ${r(yB - 0.4)} H${r(cx + br - 0.1)}" stroke="#2f6fb0" stroke-width=".55"/><path d="M${r(cx - br + 0.5)} ${r(yB - 2.8)} Q${r(cx)} ${r(yB - 3.4)} ${r(cx + br - 0.5)} ${r(yB - 2.8)}" stroke="#f2c230" stroke-width=".4" fill="none"/>`;
    chullo += `<circle cx="${r(cx + 0.2)}" cy="${r(yT - 2.1)}" r="1.05" fill="#f2c230"/><circle cx="${r(cx + 0.5)}" cy="${r(yT - 2.4)}" r=".45" fill="#fff4b8"/>`;
    STADT.muetze = { x: Mä.x + cx, y: Mä.y + (yT + yB) / 2 };
    /* Panflöte (Siku): sieben Rohre, nach rechts kürzer, mit Schnur gebunden — vor der Brust */
    const hx = mk.z.handR.x * mk.k, hy = mk.z.handR.y * mk.k;
    const fx = hx - 2.3, fy = hy - 1.6;
    for (let i = 0; i < 7; i++) floete += `<rect x="${r(fx + i * 0.68)}" y="${r(fy)}" width=".6" height="${r(5.2 - i * 0.5)}" rx=".28" fill="${i % 2 ? "#d9b56c" : "#e8c98a"}" stroke="#8a6a34" stroke-width=".12"/>`;
    floete += `<path d="M${r(fx - 0.1)} ${r(fy + 1.6)} H${r(fx + 4.8)}" stroke="#c22d33" stroke-width=".45"/>`;
    STADT.floete = { x: Mä.x + fx + 2.3, y: Mä.y + fy + 2.2 };
  }
  k += `<g transform="translate(${Mä.x} ${Mä.y})"><g filter="${VOL_FIGUR}">${dunkel(mk.svg)}</g>${chullo}${floete}</g>`;
  sch += schattenFigur(Mä.x, Mä.y, 31);
  const unter = [
    { id: "muetze", de: "die Mütze", syl: "MÜT-ze", it: "il berretto", itSyl: "ber-RET-to", en: "hat", x: STADT.muetze.x, y: STADT.muetze.y, kunst: flaeche(-3, -3.5, 6, 7),
      tipp: "Die Mütze aus den Anden heißt Chullo. Sie hat Ohrenklappen und hält in der Höhe schön warm." },
    { id: "poncho", de: "der Poncho", syl: "PON-cho", it: "il poncho", itSyl: "PON-cho", en: "poncho", x: STADT.poncho.x, y: STADT.poncho.y, kunst: flaeche(-7, -8, 14, 16),
      tipp: "Der Poncho ist ein großes Tuch mit einem Loch für den Kopf. Er ist oft aus warmer Alpakawolle." },
    { id: "panfloete", de: "die Panflöte", syl: "PAN-flö-te", it: "il flauto di Pan", itSyl: "FLAU-to di PAN", en: "pan flute", x: STADT.floete.x, y: STADT.floete.y, kunst: flaeche(-3.2, -3, 6.4, 6),
      tipp: "Die Panflöte heißt in den Anden Siku. Jedes Rohr hat einen anderen Ton." },
  ];
  S.teil({ id: "familie", de: "die Familie", syl: "fa-MI-lie", it: "la famiglia", itSyl: "fa-MI-glia", en: "family", x: 304, y: 236,
    kunst: um(304, 236, `<g pointer-events="none">${sch}</g>` + k), zoom: { x: 258, y: 206, w: 84, h: 56 }, unter,
    tipp: "Eine Familie besucht Machu Picchu. Jeden Tag kommen Tausende Menschen – man darf nur mit Eintrittskarte und auf festen Wegen hinein." });
}

/* =====================================================================
   14 — DIE ORCHIDEE (Wiñay Wayna) und DER KOLIBRI am Rand der Treppe
   ===================================================================== */
{
  let k = "";
  const stiele = [[0, 0, -1.6, -13], [1.2, 0, 2.2, -10.5], [-1, 0, -4, -8.6]];
  for (const [x0, y0, x1, y1] of stiele) k += `<path d="M${x0} ${y0} Q${r((x0 + x1) / 2 + 1)} ${r((y0 + y1) / 2)} ${x1} ${y1}" stroke="#4f7a32" stroke-width=".45" fill="none"/>`;
  k += `<path d="M-1 0 Q-5 -2 -7 -1.2 Q-4 -.4 -1 .4 Z M1 0 Q5 -2.6 7.4 -1.6 Q4.4 -.2 1 .4 Z" fill="#3f6e2c"/>`;
  for (const [, , x1, y1] of stiele) {
    const z = zufall(Math.round(x1 * 10 + 200));
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2, rr = i ? 1.3 : 0, cx = x1 + Math.cos(a) * rr * (0.8 + z() * 0.3), cy = y1 + Math.sin(a) * rr * 0.8;
      k += `<g transform="translate(${r(cx)} ${r(cy)})"><path d="M0 -.75 L.22 -.2 L.75 -.1 L.3 .25 L.45 .75 L0 .45 L-.45 .75 L-.3 .25 L-.75 -.1 L-.22 -.2 Z" fill="${i % 3 ? "#d6408f" : "#b8327a"}"/><circle r=".22" fill="#f6d34a"/></g>`;
    }
  }
  S.teil({ oben: true, id: "orchidee", de: "die Orchidee", syl: "or-chi-DE-e", it: "l'orchidea", itSyl: "or-chi-DE-a", en: "orchid", x: 208, y: 247, kunst: k,
    tipp: "Diese Orchidee heißt Wiñay Wayna – „ewig jung“. In Machu Picchu wachsen über 400 Orchideenarten." });
  /* Kolibri: schwirrt vor den Blüten, Flügel verwischt */
  let ko = `<path d="M-2.2 .2 Q-1 -1.2 1 -.8 Q2.2 -.6 2.6 .2 Q1.6 1.1 -.4 1 Q-1.6 .9 -2.2 .2 Z" fill="${S.lg("kolibri", [[0, "#1f8a5a"], [1, "#3fc08a"]], 0, 0, 1, 0)}"/>`;
  ko += `<path d="M-2.1 .4 L-4.2 1.4 L-3.8 .3 Z" fill="#1b5f3e"/><path d="M1.6 -.2 Q2.6 .4 2.4 1 Q1.6 .9 1.2 .3 Z" fill="#d8344a"/>`;
  ko += `<circle cx="1.9" cy="-.25" r=".25" fill="#111"/><path d="M2.6 0 L5.4 .6" stroke="#2a2a2a" stroke-width=".3"/>`;
  ko += `<path d="M-.4 -.6 Q-1.6 -4.2 .6 -4.6 Q.8 -2.4 .4 -.6 Z" fill="#9fd8c0" opacity=".55"/><path d="M-.2 -.6 Q.4 -3.4 2.2 -3.2 Q1.2 -1.6 .5 -.5 Z" fill="#c8f0de" opacity=".45"/>`;
  S.teil({ oben: true, id: "kolibri", de: "der Kolibri", syl: "KO-li-bri", it: "il colibrì", itSyl: "co-li-BRÌ", en: "hummingbird", x: 234, y: 226, kunst: ko,
    tipp: "Der Kolibri schlägt bis zu 50-mal in der Sekunde mit den Flügeln. So kann er in der Luft stehen bleiben." });
}




const silben = (t) => { if (!t) return t; const st = t.split(/([- ])/); const gross = (x) => x.length && x === x.toUpperCase() && x !== x.toLowerCase(); const lang = st.some((x) => gross(x) && x.length > 1); return st.map((x) => (/^[- ]$/.test(x) ? x : (gross(x) && (x.length > 1 || !lang || /[À-ÖÙ-Ý]/.test(x)) ? x : x.toLowerCase()))).join(""); };
for (const t of S.teile) for (const u of [t, ...(t.unter || [])]) { u.syl = silben(u.syl); u.itSyl = silben(u.itSyl); }
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/peru.js"));
console.log(aus);
