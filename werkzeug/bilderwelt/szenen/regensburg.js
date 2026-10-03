#!/usr/bin/env node
/* =====================================================================
   REGENSBURG (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (tourismus.regensburg.de „16 Highlights“, Stadt Regensburg
   „Steinerne Brücke – Ausstellungstafeln“, Bistum Regensburg
   „Domtürme – Geschichte“, wurstkuchl.de, Welterbe-Besucherzentrum
   Salzstadel, Personenschifffahrt Klinger):
   - STANDORT: Nordufer der Donau am Unteren Wöhrd, ein Stück unterhalb
     (östlich) der Steinernen Brücke, Blick nach SÜDWESTEN über die Donau
     auf die Altstadt; Sommerabend, die Sonne steht tief im Westnordwesten
     (rechts hinten) — Gegenlicht, warme Lichtkanten. Echte Reihenfolge
     von links nach rechts: die Altstadt am Donaumarkt, darüber der DOM
     (man sieht ihn von Nordosten: Chor links, die beiden Westtürme
     rechts, der Südturm halb hinter dem Nordturm), der SALZSTADEL mit
     der HISTORISCHEN WURSTKUCHL davor am Wasser, der BRÜCKTURM, dahinter
     der GOLDENE TURM (Geschlechterturm), und die STEINERNE BRÜCKE, die
     von dort nach rechts herüber zum Nordufer läuft.
   - STEINERNE BRÜCKE (1135–1146): rund 336 m lang, ursprünglich 16
     Rundbögen, gewaltige Pfeiler auf breiten Steininseln
     („Beschlächte“), zwischen denen die Donau als Strudel schießt; leicht
     gewölbter Buckel; heller, grünlich-grauer Sandstein; heute nur für
     Fußgänger und Radfahrer.
   - BRÜCKTURM (Ende 13. Jh.): einziger erhaltener der drei Brückentürme,
     Viereckturm mit Torbogen, Uhr aus dem 17. Jh., hohes Walmdach.
   - SALZSTADEL (1616–20): Salzlager mit riesigem, steilem Dach und vielen
     Gaubenreihen; heute Welterbe-Besucherzentrum.
   - HISTORISCHE WURSTKUCHL: kleines niedriges Haus am Ufer neben der
     Brücke, gilt als älteste Bratwurstküche der Welt; über
     Holzkohle gegrillte Bratwürstl — „sechs auf Kraut“ mit Sauerkraut und
     süßem Senf; Hochwassermarken an der Wand, Rauch aus dem Kamin.
   - DOM ST. PETER: gotisch, Westtürme 105 m hoch (1859–69 vollendet), mit
     durchbrochenen Maßwerkhelmen, Kreuzblumen; heller Kalk- und
     Grünsandstein; Dach mit Kupferpatina; berühmte mittelalterliche
     Glasfenster.
   - GESCHLECHTERTÜRME: Wohntürme reicher Patrizier nach italienischem
     Vorbild; der Goldene Turm (Wahlenstraße) ist 50 m hoch, neun Geschosse
     — der höchste nördlich der Alpen.
   - TYPISCH: Biergarten unter Kastanien am Ufer, Bratwürste mit Kraut und
     süßem Senf, Brezn und Bier; Ausflugsschiffe auf der Donau (z. B. zur
     Walhalla).
   Maßstab: Augenhöhe y = 114 (man steht im Biergarten am Ufer). Vorne:
   Einheiten je Meter = (y − 114) / 4.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "regensburg", titel: "Regensburg", emoji: "🌉", thema: "Deutschland", kuerzel: "rgb", fassung: 854 });
const rnd = zufall(1135);
const r = B.r;
const HOR = 114;
const km = (y) => (y - HOR) / 2.4;     /* Biergarten (Augenhöhe 2,4 m über dem Kies) */
const kw = (y) => (y - HOR) / 4;       /* auf der Donau (Wasser rund 4 m unter dem Auge) */
const W = 121;          /* Wasserlinie am Altstadtufer (Spiegelachse) */
const WU = 157;         /* Ufer vorne (Unterer Wöhrd) */
const spiegel = [];
const gruppe = (id, x, y, svg, achse = W) => { spiegel.push({ id, x, y, achse }); return `<g id="${S.id("sp_" + id)}">${svg}</g>`; };
const mische = (a, b, t) => "#" + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - t) + parseInt(b.slice(1 + i, 3 + i), 16) * t).toString(16).padStart(2, "0")).join("");

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>`);
S.def(`<filter id="${S.id("rauch")}" x="-100%" y="-50%" width="300%" height="200%"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-2%" y="-5%" width="104%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".014 .38" numOctaves="1" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".6 .25"/></filter>`);
/* Licht: Abendsonne von rechts (Westnordwest) */
const DOMSTEIN = S.lg("domstein", [[0, "#aaa898"], [0.55, "#cfcbbb"], [1, "#ece4cc"]], 0, 0, 1, 0);
const DOMSTEIN_D = S.lg("domsteind", [[0, "#8e8c80"], [1, "#b4b0a0"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#5e7a72"], [0.6, "#7c9a8e"], [1, "#a8bca8"]], 0, 0, 1, 0);
const BRUECKE = S.lg("brueckenstein", [[0, "#8e8c7c"], [0.5, "#a6a28e"], [1, "#c8bea0"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#8a3e2c"], [0.55, "#a64c34"], [1, "#c86a48"]], 0, 0, 1, 0);
const ZIEGEL_D = S.lg("ziegeld", [[0, "#6a2c20"], [1, "#94452f"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8770f"]], 0, 0, 1, 1);
const DUNKEL = "#2e2a2c";
const RAND = "#ffe2b0";      /* warme Lichtkante */

/* =====================================================================
   KULISSE — Sommerabend: Himmel, ferne Hügel, Ufer und Biergarten
   ===================================================================== */
S.hinten(`<rect width="320" height="${W + 4}" fill="${S.lg("himmel", [[0, "#3c74bc"], [0.45, "#8eb6dc"], [0.82, "#eedcbc"], [1, "#f6d6a6"]])}"/>`);
S.hinten(`<circle cx="360" cy="74" r="170" fill="${S.rg("sonne", [[0, "#fff0c8", 0.75], [0.4, "#ffe0a0", 0.3], [1, "#ffe0a0", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[34, 30, 1.1], [168, 18, 0.9], [244, 44, 1], [90, 62, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 6], [-11, 2.4, 10, 4.6], [11, 2, 11, 5], [-4, -4.4, 8, 5.4], [5, -3.6, 7, 5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fbf6ee"/>`;
    w += `<ellipse cx="${r(x + 13 * s)}" cy="${r(y + 0.6 * s)}" rx="${r(6 * s)}" ry="${r(3.6 * s)}" fill="#fff0d4" opacity=".55"/>`;
    w += `<ellipse cx="${r(x - 2 * s)}" cy="${r(y + 4.6 * s)}" rx="${r(17 * s)}" ry="${r(2 * s)}" fill="#c8cedc" opacity=".8"/></g>`;
  }
  S.hinten(w);
}
/* ferne Hügel im Süden, im Dunst */
S.hinten(`<path d="M0 108 Q40 101 90 104 T180 103 T260 100 T320 104 L320 ${W} L0 ${W} Z" fill="${S.lg("huegel", [[0, "#b8c0bc"], [1, "#cbcac0"]])}"/>`);
/* hinter der Brücke rechts: die Bäume auf dem Oberen Wöhrd (Jahninsel), im Dunst */
{
  let t = "";
  for (let i = 0; i < 60; i++) { const x = 236 + rnd() * 90, y = 100 + rnd() * 14, rr = 2.4 + rnd() * 3; t += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.2)}" ry="${r(rr)}" fill="${["#8aa08a", "#7a9482", "#9aae94"][i % 3]}"/>`; }
  t += `<rect x="232" y="112" width="88" height="${W - 112}" fill="#7a9482"/>`;
  S.hinten(`<g opacity=".85">${t}</g>`);
}
/* vorne: Uferböschung mit Gras und Steinen, dann der Kies des Biergartens */
{
  let f = `<path d="M0 ${WU} Q80 ${WU - 1.4} 160 ${WU - 0.6} T320 ${WU - 1} L320 200 L0 200 Z" fill="${S.lg("kies", [[0, "#c9b896"], [1, "#a8977a"]])}"/>`;
  f += `<path d="M0 ${WU} Q80 ${WU - 1.4} 160 ${WU - 0.6} T320 ${WU - 1} L320 ${WU + 4} Q160 ${WU + 5} 0 ${WU + 4.6} Z" fill="${S.lg("gras", [[0, "#7a9a4a"], [1, "#5a7a36"]])}"/>`;
  for (let i = 0; i < 220; i++) { const x = rnd() * 320, y = WU - 1 + rnd() * 6; f += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x + rnd() - 0.5)}" y2="${r(y - 1 - rnd() * 1.6)}" stroke="${rnd() < 0.5 ? "#9ab85c" : "#4e6e2e"}" stroke-width=".3"/>`; }
  for (let i = 0; i < 260; i++) f += `<circle cx="${r(rnd() * 320)}" cy="${r(WU + 5 + Math.pow(rnd(), 0.7) * 38)}" r="${r(0.15 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#e8dcc0" : "#8a7a5e"}" opacity=".6"/>`;
  /* Lichtflecken und Schatten unter der Kastanie */
  let fl = "";
  for (let i = 0; i < 26; i++) { const x = rnd() * 150, y = 166 + rnd() * 32; fl += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(4 + rnd() * 8)}" ry="${r(1 + rnd() * 1.8)}" fill="#3a3020" opacity="${r(0.08 + rnd() * 0.08)}"/>`; }
  f += `<g filter="url(#${S.id("rauch")})">${fl}</g>`;
  /* ein zweiter Biertisch weiter hinten, leer bis auf zwei Gläser */
  {
    const X0 = 104, y0 = 181, sk = km(y0), L = 1.1 * sk, h = 0.77 * sk;
    f += `<ellipse cx="${X0}" cy="${y0 + 0.4}" rx="${r(L + 3)}" ry="1.4" fill="#2a2010" opacity=".25"/>`;
    for (const sx of [-1, 1]) f += `<path d="M${r(X0 + sx * (L - 6))} ${y0} L${r(X0 + sx * (L - 2))} ${r(y0 - h + 1)} M${r(X0 + sx * (L - 2))} ${y0} L${r(X0 + sx * (L - 6))} ${r(y0 - h + 1)}" stroke="#4a4e52" stroke-width=".9"/>`;
    f += `<rect x="${r(X0 - L - 0.6)}" y="${r(y0 - 0.44 * sk)}" width="${r(2 * L + 1.2)}" height="1.6" fill="#a8743e"/>`;
    f += `<path d="M${r(X0 - L)} ${r(y0 - h)} L${r(X0 + L)} ${r(y0 - h)} L${r(X0 + L - 2)} ${r(y0 - h - 3.4)} L${r(X0 - L + 2)} ${r(y0 - h - 3.4)} Z" fill="#b8834c"/><rect x="${r(X0 - L)}" y="${r(y0 - h)}" width="${r(2 * L)}" height="1.3" fill="#8a5a30"/>`;
    for (const gx of [X0 - 12, X0 + 6]) f += `<path d="M${gx - 1.4} ${r(y0 - h - 1.2)} L${gx - 1.6} ${r(y0 - h - 6.2)} L${gx + 1.6} ${r(y0 - h - 6.2)} L${gx + 1.4} ${r(y0 - h - 1.2)} Z" fill="#e8b040" opacity=".9"/><path d="M${gx - 1.7} ${r(y0 - h - 6.2)} q1.7 -1.3 3.4 0 Z" fill="#fffaf0"/>`;
  }
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("kieslicht", [[0, "#3a2a10", 0.12], [0.6, "#000", 0], [1, "#ffd9a0", 0.18]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER DOM ST. PETER (Lupe: Turm, Kirchenfenster, Dach)
   ===================================================================== */
const DOM = { x: 100, y: 114 };
{
  let k = "";
  const fenster = (x, y0, y1, w) => `<path d="M${r(x - w / 2)} ${r(y0)} L${r(x - w / 2)} ${r(y1 + w * 0.6)} Q${r(x)} ${r(y1 - w * 0.3)} ${r(x + w / 2)} ${r(y1 + w * 0.6)} L${r(x + w / 2)} ${r(y0)} Z" fill="${S.lg("glasfenster", [[0, "#3c4a66"], [1, "#25304a"]])}"/><path d="M${r(x)} ${r(y0)} L${r(x)} ${r(y1 + 0.4)} M${r(x - w / 2)} ${r(y1 + w * 0.9)} Q${r(x)} ${r(y1 + w * 0.2)} ${r(x + w / 2)} ${r(y1 + w * 0.9)}" stroke="#9a9a8c" stroke-width=".22" fill="none"/>`;
  /* ein Turm: Viereck mit Strebepfeilern und Wimpergen, durchbrochener Helm */
  const turm = (cx, w, basis, oben, spitze, dunst) => {
    let g = "";
    const hw = w / 2, F = dunst ? DOMSTEIN_D : DOMSTEIN;
    g += `<rect x="${r(cx - hw)}" y="${oben}" width="${w}" height="${r(basis - oben)}" fill="${F}"/>`;
    for (const sx of [-1, 1]) {
      g += `<rect x="${r(cx + sx * hw - (sx > 0 ? 2.2 : 0))}" y="${oben}" width="2.2" height="${r(basis - oben)}" fill="${sx > 0 ? "#e8e0c8" : "#a4a294"}" opacity=".8"/>`;
      for (const y of [-26, -40]) g += `<path d="M${r(cx + sx * hw - (sx > 0 ? 2.4 : -0.2))} ${y} l1.1 -1.6 l1.1 1.6 Z" fill="#8e8c80"/>`;
    }
    if (!dunst) {
      g += fenster(cx, -18, -32, 3.6) + fenster(cx - 2.2, -35, -46, 1.6) + fenster(cx + 2.2, -35, -46, 1.6);
      g += `<path d="M${r(cx - 3.2)} ${r(oben + 9)} L${r(cx - 3.2)} ${r(oben + 3)} Q${r(cx)} ${r(oben)} ${r(cx + 3.2)} ${r(oben + 3)} L${r(cx + 3.2)} ${r(oben + 9)} Z" fill="#2e3448"/>`;
      for (const dx of [-1.1, 1.1]) g += `<line x1="${r(cx + dx)}" y1="${r(oben + 2)}" x2="${r(cx + dx)}" y2="${r(oben + 9)}" stroke="#a8a698" stroke-width=".3"/>`;
    } else g += fenster(cx, -26, -40, 2.4);
    /* Wimperg über der Glockenstube, Fialen an den Ecken */
    g += `<path d="M${r(cx - 3.8)} ${oben} L${cx} ${r(oben - 6)} L${r(cx + 3.8)} ${oben} Z" fill="${F}"/><path d="M${r(cx - 3.8)} ${oben} L${cx} ${r(oben - 6)} L${r(cx + 3.8)} ${oben}" stroke="#ece4cc" stroke-width=".3" fill="none"/>`;
    for (const sx of [-1, 1]) g += `<path d="M${r(cx + sx * hw - 1.1)} ${oben} L${r(cx + sx * hw)} ${r(oben - 7)} L${r(cx + sx * hw + 1.1)} ${oben} Z" fill="${F}"/>`;
    g += `<rect x="${r(cx - hw - 0.4)}" y="${r(oben - 0.8)}" width="${r(w + 0.8)}" height=".8" fill="#ece4cc"/>`;
    /* der durchbrochene Maßwerkhelm */
    const hb = w * 0.36, hy = oben - 1;
    g += `<path d="M${r(cx - hb)} ${r(hy)} L${cx} ${spitze} L${r(cx + hb)} ${r(hy)} Z" fill="${F}"/>`;
    g += `<path d="M${cx} ${spitze} L${r(cx + hb)} ${r(hy)} L${r(cx + hb * 0.25)} ${r(hy)} Z" fill="#fff4dc" opacity=".25"/>`;
    const L = hy - spitze;
    for (let i = 1; i < 9; i++) {
      const y = hy - i * L / 9.4, b = hb * (1 - i / 9.4);
      const n = Math.max(1, Math.round(b / 1.1));
      for (let j = 0; j < n; j++) { const x = cx - b + (j + 0.5) * 2 * b / n; g += `<path d="M${r(x - 0.35)} ${r(y + 0.6)} L${r(x - 0.35)} ${r(y - 0.2)} Q${r(x)} ${r(y - 0.8)} ${r(x + 0.35)} ${r(y - 0.2)} L${r(x + 0.35)} ${r(y + 0.6)} Z" fill="#3c4258" opacity="${dunst ? 0.55 : 0.75}"/>`; }
    }
    for (let i = 1; i < 10; i++) { const y = hy - i * L / 10.5, b = hb * (1 - i / 10.5); g += `<path d="M${r(cx - b)} ${r(y)} l-.7 -.4 M${r(cx + b)} ${r(y)} l.7 -.4" stroke="${dunst ? "#a6a496" : "#c8c4b2"}" stroke-width=".4"/>`; }
    for (const sx of [-1, 1]) g += `<path d="M${r(cx + sx * hb * 1.3 - 0.5)} ${r(hy)} L${r(cx + sx * hb * 1.3)} ${r(hy - 6)} L${r(cx + sx * hb * 1.3 + 0.5)} ${r(hy)} Z" fill="${F}"/>`;
    g += `<path d="M${cx} ${spitze} l-1 .8 l1 -3.2 l1 3.2 Z" fill="${F}"/><path d="M${cx} ${r(spitze - 2.4)} l0 -1.6 M${r(cx - 0.8)} ${r(spitze - 3.2)} l1.6 0" stroke="#8e8c80" stroke-width=".35"/>`;
    return g;
  };
  /* Südturm (hinten, halb verdeckt) */
  k += turm(10, 11.6, -14, -57, -100, true);
  /* Langhaus mit Strebebögen, Querhaus, Chor */
  k += `<rect x="-44" y="-36" width="56" height="22" fill="${DOMSTEIN}"/>`;
  for (let x = -40; x < 10; x += 7) k += fenster(x + 3.5, -16, -32, 2.8);
  for (let x = -42; x < 12; x += 7) k += `<rect x="${x - 0.9}" y="-40" width="1.8" height="26" fill="#bcb8a8"/><path d="M${x - 0.9} -40 l.9 -3.2 l.9 3.2 Z" fill="#bcb8a8"/><path d="M${x + 0.9} -38 Q${x + 3.2} -42 ${x + 5} -46" stroke="#b4b0a0" stroke-width=".9" fill="none"/>`;
  k += `<rect x="-42" y="-50" width="52" height="10" fill="${DOMSTEIN_D}"/>`;
  for (let x = -38; x < 8; x += 7) k += `<path d="M${x} -41 L${x} -46.4 Q${x + 1.3} -48.4 ${x + 2.6} -46.4 L${x + 2.6} -41 Z" fill="#2e3448"/>`;
  k += `<path d="M-44 -50 L-38 -62 L8 -62 L12 -50 Z" fill="${KUPFER}"/><path d="M-38 -62 L8 -62" stroke="#c8d8c8" stroke-width=".4"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${-44 + i * 1.1}" y1="${-50 - i * 2}" x2="${12 - i * 0.7}" y2="${-50 - i * 2}" stroke="#4e6a62" stroke-width=".15" opacity=".6"/>`;
  /* Querhaus-Giebel (Nordseite) */
  k += `<path d="M-26 -14 L-26 -52 L-19 -64 L-12 -52 L-12 -14 Z" fill="${DOMSTEIN}"/><path d="M-26 -52 L-19 -64 L-12 -52" stroke="#ece4cc" stroke-width=".35" fill="none"/>`;
  k += `<circle cx="-19" cy="-50" r="3" fill="#2e3448"/><circle cx="-19" cy="-50" r="3" fill="none" stroke="#b8b4a4" stroke-width=".35"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; k += `<line x1="-19" y1="-50" x2="${r(-19 + Math.cos(a) * 3)}" y2="${r(-50 + Math.sin(a) * 3)}" stroke="#b8b4a4" stroke-width=".22"/>`; }
  k += fenster(-19, -18, -40, 4.4);
  /* Chor mit Strebepfeilern und spitzem Dach */
  k += `<path d="M-52 -14 L-52 -44 L-44 -48 L-44 -14 Z" fill="${DOMSTEIN_D}"/>`;
  k += fenster(-48, -18, -38, 2.2);
  k += `<path d="M-53 -44 L-46 -60 L-38 -62 L-44 -48 Z" fill="${KUPFER}"/>`;
  /* Nordturm (vorne) */
  k += turm(22, 14, -14, -60, -102, false);
  /* Verwitterungsspuren */
  for (let i = 0; i < 14; i++) { const x = -44 + rnd() * 72, y = -48 + rnd() * 30; k += `<rect x="${r(x)}" y="${r(y)}" width=".5" height="${r(2 + rnd() * 5)}" fill="#6e6c62" opacity=".18"/>`; }
  S.teil({ id: "dom", de: "der Dom", syl: "DOM", it: "il duomo", itSyl: "DUO-mo", en: "cathedral",
    x: DOM.x, y: DOM.y, kunst: k, tipp: "Der Dom St. Peter ist gotisch. Seine zwei Türme sind 105 Meter hoch.",
    zoom: { x: 62, y: 6, w: 78, h: 94 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: DOM.x + 22, y: DOM.y - 60, kunst: flaeche(-6, -42, 12, 42),
        tipp: "Die Turmspitzen sind aus Stein und durchbrochen wie Spitze. Fertig wurden sie erst 1869." },
      { id: "kirchenfenster", de: "das Kirchenfenster", syl: "KIR-chen-fens-ter", it: "la vetrata", itSyl: "ve-TRA-ta", en: "church window", x: DOM.x - 19, y: DOM.y - 18, kunst: flaeche(-3.8, -36, 7.6, 36),
        tipp: "Die bunten Glasfenster im Dom sind zum Teil über 700 Jahre alt." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: DOM.x - 30, y: DOM.y - 50, kunst: flaeche(-10, -12, 20, 12),
        tipp: "Das Dach ist mit Kupfer gedeckt – darum ist es grün." },
    ] });
}

/* =====================================================================
   2 — DER GESCHLECHTERTURM (der Goldene Turm, hinter dem Brückturm)
   ===================================================================== */
{
  let k = `<rect x="-4.6" y="-52" width="9.2" height="52" fill="${S.lg("goldturm", [[0, "#c8ae86"], [0.6, "#e2c89c"], [1, "#f6e2b8"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 9; i++) { const y = -48 + i * 5.2; k += `<rect x="-2.6" y="${r(y)}" width="1.2" height="2" fill="${DUNKEL}"/><rect x="1.4" y="${r(y)}" width="1.2" height="2" fill="${DUNKEL}"/>`; }
  k += `<rect x="-5" y="-53.2" width="10" height="1.4" fill="#f4e6c8"/>`;
  k += `<path d="M-5.2 -53 L-1.2 -57 L1.2 -57 L5.2 -53 Z" fill="${ZIEGEL}"/>`;
  k += `<rect x="3.4" y="-52" width="1.2" height="52" fill="${RAND}" opacity=".5"/>`;
  S.teil({ id: "geschlechterturm", de: "der Geschlechterturm", syl: "ge-SCHLECH-ter-turm", it: "la torre gentilizia", itSyl: "TOR-re gen-ti-LI-zia", en: "patrician tower",
    x: 214, y: 112, kunst: k, tipp: "Reiche Kaufleute bauten im Mittelalter hohe Wohntürme wie in Italien. Der Goldene Turm ist 50 Meter hoch." });
}

/* =====================================================================
   3 — DIE ALTSTADT am Donaumarkt (und Dächer hinter der Brücke)
   ===================================================================== */
{
  let k = "";
  const PUTZ = ["#f0dcae", "#e8c890", "#f2e6cc", "#e6b8a0", "#d8c8a0", "#efd2b4", "#cfd6b8", "#f4ead6"];
  const DACH = ["#a84e36", "#94452f", "#b25a3e", "#8a3e2c"];
  const haus = (x, w, base, h, dach, t, giebel) => {
    const m = (c) => (t ? mische(c, "#d8d4c8", t) : c);
    const f = m(PUTZ[Math.floor(rnd() * PUTZ.length)]);
    let g = `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    const sp = Math.max(1, Math.floor(w / 3.2)), re = Math.max(1, Math.floor((h - 2) / 4));
    for (let j = 0; j < re; j++) for (let i = 0; i < sp; i++) g += `<rect x="${r(x + (w - sp * 3.2) / 2 + i * 3.2 + 0.9)}" y="${r(base - h + 1.6 + j * 4)}" width="1.3" height="2" fill="${rnd() < 0.08 ? "#ffe2a0" : m("#4a4448")}"/>`;
    g += `<rect x="${r(x + w - 0.8)}" y="${r(base - h)}" width=".8" height="${r(h)}" fill="${RAND}" opacity="${t ? 0.2 : 0.45}"/>`;
    if (giebel) {
      g += `<path d="M${r(x - 0.3)} ${r(base - h)} L${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.3)} ${r(base - h)} Z" fill="${f}"/><path d="M${r(x - 0.5)} ${r(base - h + 0.2)} L${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.5)} ${r(base - h + 0.2)}" stroke="${m("#8a3e2c")}" stroke-width=".9" fill="none"/>`;
      g += `<rect x="${r(x + w / 2 - 0.7)}" y="${r(base - h - dach * 0.5)}" width="1.4" height="1.8" fill="${m("#4a4448")}"/>`;
    } else {
      g += `<path d="M${r(x - 0.5)} ${r(base - h)} L${r(x + w * 0.2)} ${r(base - h - dach)} L${r(x + w * 0.8)} ${r(base - h - dach)} L${r(x + w + 0.5)} ${r(base - h)} Z" fill="${m(DACH[Math.floor(rnd() * DACH.length)])}"/>`;
      g += `<path d="M${r(x + w * 0.8)} ${r(base - h - dach)} L${r(x + w + 0.5)} ${r(base - h)}" stroke="${RAND}" stroke-width=".4" opacity=".7"/>`;
      if (w > 8) g += `<path d="M${r(x + w / 2 - 1.2)} ${r(base - h - dach * 0.3)} l0 -1.6 l1.2 -1.2 l1.2 1.2 l0 1.6 Z" fill="${f}"/>`;
    }
    return g;
  };
  /* hinter der Brücke: Dächer der westlichen Altstadt, im Dunst */
  for (let x = 194; x < 314;) { let w = 7 + rnd() * 6; if (x + w > 320) w = 320 - x; k += haus(x, w, 110, 6 + rnd() * 4, 5 + rnd() * 3, 0.32, rnd() < 0.5); x += w + 0.3; }
  /* zweite Reihe am Donaumarkt (unter dem Dom) */
  for (let x = 0; x < 150;) { const w = 8 + rnd() * 6; k += haus(x, w, 112, 8 + rnd() * 5, 6 + rnd() * 3, 0.22, rnd() < 0.5); x += w + 0.3; }
  /* vordere Reihe direkt an der Donau: sie spiegelt sich */
  let reihe = "";
  for (let x = -1; x < 140;) {
    let w = 9 + rnd() * 7;
    if (x + w > 141) w = 141 - x;
    reihe += haus(x, w, W - 1.2, 13 + rnd() * 6, 8 + rnd() * 4, 0, rnd() < 0.45);
    x += w + 0.3;
  }
  reihe += `<rect x="-1" y="${W - 1.4}" width="142" height="1.6" fill="#9a907e"/>`;
  k += gruppe("haeuser", 0, 0, reihe);
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: 0, y: 0, kunst: k, tipp: "Die Altstadt von Regensburg ist UNESCO-Welterbe – mit vielen bunten Häusern aus dem Mittelalter." });
}

/* =====================================================================
   4 — DER SALZSTADEL (riesiges Dach mit Gaubenreihen)
   ===================================================================== */
const SZ = { x: 164, y: W - 1 };
{
  let k = `<rect x="-19" y="-15" width="33" height="15" fill="${S.lg("salzwand", [[0, "#d2c6a8"], [0.7, "#e8dcc0"], [1, "#f6e8c8"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-15, -8, -1, 6]) k += `<path d="M${x} 0 L${x} -3.6 Q${x + 1.6} -5.6 ${x + 3.2} -3.6 L${x + 3.2} 0 Z" fill="#4a4040"/>`;
  for (let i = 0; i < 9; i++) { k += `<rect x="${-17.4 + i * 3.6}" y="-9.6" width="1.3" height="2" fill="${DUNKEL}"/><rect x="${-17.4 + i * 3.6}" y="-13.6" width="1.3" height="2" fill="${DUNKEL}"/>`; }
  k += `<rect x="12.8" y="-15" width="1.2" height="15" fill="${RAND}" opacity=".6"/>`;
  k += `<path d="M-20 -15 L-13 -46 L7 -46 L15 -15 Z" fill="${ZIEGEL}"/>`;
  for (let i = 1; i < 14; i++) { const t = i / 14; k += `<line x1="${r(-20 + t * 7)}" y1="${r(-15 - t * 31)}" x2="${r(15 - t * 8)}" y2="${r(-15 - t * 31)}" stroke="#6a2c20" stroke-width=".12" opacity=".6"/>`; }
  k += `<path d="M7 -46 L15 -15" stroke="${RAND}" stroke-width=".6" opacity=".8"/>`;
  [[-19, 8, 3.8], [-26, 7, 3.6], [-33, 5, 3.6], [-40, 3, 3.6]].forEach(([y, n, d]) => {
    const x0 = -3 - (n - 1) * d / 2;
    for (let i = 0; i < n; i++) k += `<path d="M${r(x0 + i * d - 1)} ${y} l1 -1.8 l1 1.8 Z" fill="#7a3424"/><rect x="${r(x0 + i * d - 0.65)}" y="${y}" width="1.3" height="1" fill="#2e2420"/>`;
  });
  S.teil({ id: "salzstadel", de: "der Salzstadel", syl: "SALZ-sta-del", it: "il magazzino del sale", itSyl: "ma-gaz-ZI-no del SA-le", en: "salt warehouse",
    x: SZ.x, y: SZ.y, kunst: gruppe("salzstadel", SZ.x, SZ.y, k), tipp: "Im Salzstadel lagerte früher das Salz, das auf der Donau kam. Heute ist dort das Welterbe-Besucherzentrum." });
}

/* =====================================================================
   5 — DER BRÜCKTURM (Lupe: Uhr, Tor)
   ===================================================================== */
const BT = { x: 189, y: 112 };
{
  let k = `<rect x="-7" y="-42" width="14" height="44" fill="${S.lg("turmputz", [[0, "#cbbd9e"], [0.65, "#e6d8b8"], [1, "#f8e8c4"]], 0, 0, 1, 0)}"/>`;
  for (let y = -40; y < 0; y += 3.4) for (const sx of [-1, 1]) k += `<rect x="${sx < 0 ? -7 : 5}" y="${y}" width="2" height="1.7" fill="${sx < 0 ? "#b4a888" : "#fff0d0"}" opacity=".7"/>`;
  /* Torbogen zur Brücke (Nordseite) */
  k += `<path d="M-3.4 2 L-3.4 -5 Q0 -9.4 3.4 -5 L3.4 2 Z" fill="#2a2420"/><path d="M-3.4 -5 Q0 -9.4 3.4 -5" stroke="#f2e2c0" stroke-width=".5" fill="none"/>`;
  for (const [x, y] of [[-3, -16], [1.8, -16], [-0.6, -22]]) k += `<rect x="${x}" y="${y}" width="1.2" height="2.4" fill="${DUNKEL}"/>`;
  /* Uhr mit Zifferblatt und Wappenmalerei */
  k += `<circle cx="0" cy="-31" r="3.4" fill="#f4ecd8" stroke="#3a3430" stroke-width=".4"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 2.5)}" y1="${r(-31 - Math.cos(a) * 2.5)}" x2="${r(Math.sin(a) * 3)}" y2="${r(-31 - Math.cos(a) * 3)}" stroke="#2a2420" stroke-width=".3"/>`; }
  k += `<line x1="0" y1="-31" x2="${r(Math.sin(5.9) * 1.8)}" y2="${r(-31 - Math.cos(5.9) * 1.8)}" stroke="#1a1410" stroke-width=".5" stroke-linecap="round"/><line x1="0" y1="-31" x2="${r(Math.sin(2.1) * 2.6)}" y2="${r(-31 - Math.cos(2.1) * 2.6)}" stroke="#1a1410" stroke-width=".35" stroke-linecap="round"/>`;
  k += `<path d="M-1.6 -37.6 L1.6 -37.6 L1.6 -35.6 Q0 -34.4 -1.6 -35.6 Z" fill="#b8232a"/><path d="M-.9 -37.2 L.9 -35.8 M.9 -37.2 L-.9 -35.8" stroke="#f4f1ea" stroke-width=".35"/>`;
  /* hohes Walmdach mit Gauben */
  k += `<rect x="-7.4" y="-43.2" width="14.8" height="1.4" fill="#f2e2c0"/>`;
  k += `<path d="M-8 -42.6 L-2 -60 L2 -60 L8 -42.6 Z" fill="${ZIEGEL}"/><path d="M2 -60 L8 -42.6" stroke="${RAND}" stroke-width=".55" opacity=".85"/>`;
  for (let i = 1; i < 8; i++) { const t = i / 8; k += `<line x1="${r(-8 + t * 6)}" y1="${r(-42.6 - t * 17.4)}" x2="${r(8 - t * 6)}" y2="${r(-42.6 - t * 17.4)}" stroke="#6a2c20" stroke-width=".12" opacity=".6"/>`; }
  for (const x of [-3, 3]) k += `<path d="M${x - 1.1} -47 l1.1 -2 l1.1 2 Z" fill="#7a3424"/><rect x="${x - 0.7}" y="-47" width="1.4" height="1.1" fill="#2e2420"/>`;
  k += `<line x1="0" y1="-60" x2="0" y2="-63" stroke="${DUNKEL}" stroke-width=".35"/><circle cx="0" cy="-63.2" r=".55" fill="${GOLD}"/>`;
  k += `<rect x="5.6" y="-42" width="1.4" height="44" fill="${RAND}" opacity=".55"/>`;
  S.teil({ id: "brueckturm", de: "der Brückturm", syl: "BRÜCK-turm", it: "la torre del ponte", itSyl: "TOR-re del PON-te", en: "bridge tower",
    x: BT.x, y: BT.y, kunst: gruppe("brueckturm", BT.x, BT.y, k), tipp: "Am Brückturm musste man früher Zoll bezahlen. Heute ist darin ein Museum.",
    zoom: { x: BT.x - 22, y: BT.y - 68, w: 44, h: 76 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: BT.x, y: BT.y - 27, kunst: flaeche(-4.2, -8, 8.4, 8.4), tipp: "Die Turmuhr stammt aus dem 17. Jahrhundert." },
      { id: "tor", de: "das Tor", syl: "TOR", it: "la porta", itSyl: "POR-ta", en: "gate", x: BT.x, y: BT.y + 1, kunst: flaeche(-4, -10, 8, 10), tipp: "Durch das Tor geht man von der Brücke in die Altstadt." },
    ] });
}

/* =====================================================================
   6 — DIE HISTORISCHE WURSTKUCHL (Lupe: Schornstein, Hochwassermarke)
   ===================================================================== */
const WK = { x: 151, y: W - 1 };
{
  let k = "";
  /* Freisitz links: Tische und Bänke am Ufer */
  for (const x of [-24, -18.5]) k += `<rect x="${x}" y="-2.4" width="4.6" height=".6" fill="#7a5230"/><line x1="${x + 0.6}" y1="-1.8" x2="${x + 0.6}" y2="0" stroke="#5a3a20" stroke-width=".35"/><line x1="${x + 4}" y1="-1.8" x2="${x + 4}" y2="0" stroke="#5a3a20" stroke-width=".35"/><rect x="${x}" y="-1.2" width="4.6" height=".4" fill="#6a4426"/>`;
  k += `<line x1="-21" y1="-2.4" x2="-21" y2="-7" stroke="#6a5a40" stroke-width=".3"/><path d="M-25 -6.4 Q-21 -8.6 -17 -6.4 Z" fill="#e8e0cc"/>`;
  /* das niedrige Haus: weiß gekalkt, grüne Fensterläden, Schild */
  k += `<rect x="-11" y="-8" width="20" height="8" fill="${S.lg("kuchlwand", [[0, "#ddd8cc"], [0.7, "#f2eee4"], [1, "#fffaf0"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-11" y="-1.6" width="20" height="1.6" fill="#b8b2a4"/>`;
  k += `<path d="M-7.4 0 L-7.4 -4.8 Q-6 -6 -4.6 -4.8 L-4.6 0 Z" fill="#3a2a20"/>`;
  for (const x of [-1.8, 3.4]) k += `<rect x="${x}" y="-5.6" width="2.4" height="2.6" fill="#3e4a50"/><rect x="${x - 1}" y="-5.6" width=".9" height="2.6" fill="#2f6a3e"/><rect x="${x + 2.5}" y="-5.6" width=".9" height="2.6" fill="#2f6a3e"/>`;
  k += `<text x="-1" y="-6.5" font-size="1.45" text-anchor="middle" fill="#1e1a18" font-family="'Old English Text MT','UnifrakturMaguntia',Georgia,serif" font-weight="bold">Historische Wurstkuchl</text>`;
  /* Hochwassermarken an der rechten Ecke */
  for (const [y, j] of [[-7, "1784"], [-5.4, "1845"], [-3.8, "1988"], [-2.6, "2013"]]) k += `<line x1="6.6" y1="${y}" x2="8.8" y2="${y}" stroke="#1e2a5a" stroke-width=".28"/><text x="7.7" y="${r(y - 0.25)}" font-size=".55" text-anchor="middle" fill="#1e2a5a" font-family="Arial">${j}</text>`;
  /* Satteldach, Kamin mit Rauch */
  k += `<path d="M-12 -8 L-8 -14 L6 -14 L10 -8 Z" fill="${ZIEGEL_D}"/><path d="M6 -14 L10 -8" stroke="${RAND}" stroke-width=".5" opacity=".8"/>`;
  for (let i = 1; i < 5; i++) { const t = i / 5; k += `<line x1="${r(-12 + t * 4)}" y1="${r(-8 - t * 6)}" x2="${r(10 - t * 4)}" y2="${r(-8 - t * 6)}" stroke="#5a2418" stroke-width=".12" opacity=".6"/>`; }
  k += `<rect x="2.4" y="-17.4" width="2.6" height="4.6" fill="${S.lg("kamin", [[0, "#9a7a64"], [1, "#d8b898"]], 0, 0, 1, 0)}"/><rect x="2.1" y="-17.8" width="3.2" height=".8" fill="#5a4a40"/>`;
  k += `<g filter="url(#${S.id("rauch")})" opacity=".6"><path d="M3.7 -18.6 q-1.6 -3 .6 -5.6 q2.4 -2.6 .4 -5.6 q-1.6 -2.4 1 -4.8" stroke="#f4f0ec" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  S.teil({ id: "wurstkuchl", de: "die Wurstkuchl", syl: "WURST-ku-chl", it: "la Wurstkuchl (la cucina delle salsicce)", itSyl: "WURST-ku-chl", en: "Sausage Kitchen",
    x: WK.x, y: WK.y, kunst: gruppe("wurstkuchl", WK.x, WK.y, k), tipp: "Die Historische Wurstkuchl gilt als älteste Bratwurstküche der Welt. „Kuchl“ heißt auf Bairisch Küche.",
    zoom: { x: WK.x - 26, y: WK.y - 34, w: 54, h: 36 },
    unter: [
      { id: "schornstein", de: "der Schornstein", syl: "SCHORN-stein", it: "il comignolo", itSyl: "co-MI-gno-lo", en: "chimney", x: WK.x + 3.7, y: WK.y - 12.8, kunst: flaeche(-2.4, -18, 4.8, 18),
        tipp: "Die Würste werden über Holzkohle gegrillt – darum raucht der Kamin." },
      { id: "hochwassermarke", de: "die Hochwassermarke", syl: "HOCH-was-ser-mar-ke", it: "il segno della piena", itSyl: "SE-gno del-la PIE-na", en: "flood mark", x: WK.x + 7.7, y: WK.y - 2, kunst: flaeche(-1.8, -6, 3.6, 6),
        tipp: "Die Striche zeigen, wie hoch die Donau bei Hochwasser stand." },
    ] });
}

/* =====================================================================
   7 + 8 — DIE DONAU (mit Spiegelungen) und DIE STEINERNE BRÜCKE
   ===================================================================== */
/* Die Brücke läuft vom Brückturm (s = 0) nach rechts vorne über den Bildrand. */
const U = (s) => 1.8 * s / (1 + 0.8 * s);          /* U(1) = 1: rechter Bildrand */
const BX = (s) => 192 + 129.5 * U(s);
const BK = (s) => 1.45 + 3.1 * U(s);                 /* Einheiten je Meter an der Brücke */
const DECK = (s) => HOR - (2.6 + 0.8 * Math.sin(Math.PI * s * 0.8)) * BK(s);
const WAS = (s) => HOR + 5.4 * BK(s);
const N = 6;
const bogen = [];
for (let j = 0; j < N; j++) bogen.push([(j + 0.2) / N, Math.min(1.02, (j + 0.8) / N)]);
const brueckenKoerper = (spiegeln) => {
  /* spiegeln: an der eigenen Wasserlinie gespiegelt (für das Spiegelbild) */
  const Y = (s, y) => (spiegeln ? 2 * WAS(s) - y : y);
  let g = "", ober = [], unter = [];
  for (let i = 0; i <= 40; i++) { const s = i / 40; ober.push(`${r(BX(s))} ${r(Y(s, DECK(s) - 1.05 * BK(s)))}`); unter.push(`${r(BX(s))} ${r(Y(s, WAS(s)))}`); }
  g += `<path d="M${ober.join(" L")} L${unter.slice().reverse().join(" L")} Z" fill="${spiegeln ? "#56584e" : BRUECKE}"/>`;
  bogen.forEach(([a, b]) => {
    const m = (a + b) / 2, xa = BX(a), xb = BX(b), xm = BX(m);
    const yk = DECK(m) + 3.4 * BK(m), ys = WAS(m) - 1.8 * BK(m);
    const kf = 0.5;
    g += `<path d="M${r(xa)} ${r(Y(a, WAS(a)))} L${r(xa)} ${r(Y(a, ys))} C${r(xa)} ${r(Y(m, ys - (ys - yk) * kf * 1.8))} ${r(xm - (xb - xa) * 0.28)} ${r(Y(m, yk))} ${r(xm)} ${r(Y(m, yk))} C${r(xm + (xb - xa) * 0.28)} ${r(Y(m, yk))} ${r(xb)} ${r(Y(m, ys - (ys - yk) * kf * 1.8))} ${r(xb)} ${r(Y(b, ys))} L${r(xb)} ${r(Y(b, WAS(b)))} Z" fill="${spiegeln ? "#3a4448" : `url(#${S.id("bogenlicht")})`}"/>`;
    if (!spiegeln) {
      g += `<path d="M${r(xa)} ${r(ys)} C${r(xa)} ${r(ys - (ys - yk) * kf * 1.8)} ${r(xm - (xb - xa) * 0.28)} ${r(yk)} ${r(xm)} ${r(yk)} C${r(xm + (xb - xa) * 0.28)} ${r(yk)} ${r(xb)} ${r(ys - (ys - yk) * kf * 1.8)} ${r(xb)} ${r(ys)}" stroke="#d8d0b4" stroke-width="${r(0.25 + 0.12 * BK(m))}" fill="none"/>`;
      for (let q = 1; q < 6; q++) { const t = q / 6, bx = xa + (xb - xa) * t, by = yk + (ys - yk) * Math.pow(Math.abs(t - 0.5) * 2, 2.2); g += `<line x1="${r(bx)}" y1="${r(by)}" x2="${r(bx + (bx - xm) * 0.06)}" y2="${r(by - 0.9 * BK(m))}" stroke="#7a786a" stroke-width=".18" opacity=".7"/>`; }
    }
  });
  if (!spiegeln) {
    /* Steinlagen, Brüstung mit Abdeckung und warmer Lichtkante */
    for (const t of [0.35, 0.6]) { let l = []; for (let i = 0; i <= 20; i++) { const s = i / 20; l.push(`${r(BX(s))} ${r(DECK(s) + t * BK(s))}`); } g += `<path d="M${l.join(" L")}" stroke="#7e7c6c" stroke-width=".2" fill="none" opacity=".6"/>`; }
    let k1 = []; for (let i = 0; i <= 40; i++) { const s = i / 40; k1.push(`${r(BX(s))} ${r(DECK(s) - 1.05 * BK(s))}`); }
    g += `<path d="M${k1.join(" L")}" stroke="${RAND}" stroke-width="${r(0.6)}" fill="none"/>`;
    let k2 = []; for (let i = 0; i <= 40; i++) { const s = i / 40; k2.push(`${r(BX(s))} ${r(DECK(s) + 0.1 * BK(s))}`); }
    g += `<path d="M${k2.join(" L")}" stroke="#6e6c5e" stroke-width=".3" fill="none" opacity=".6"/>`;
    for (let i = 1; i < 30; i++) { const s = i / 30; g += `<line x1="${r(BX(s))}" y1="${r(DECK(s) - 1.05 * BK(s))}" x2="${r(BX(s))}" y2="${r(DECK(s) + 0.1 * BK(s))}" stroke="#7e7c6c" stroke-width=".14" opacity=".45"/>`; }
  }
  /* Pfeilerinseln (Beschlächte) mit Strudeln */
  for (let j = 0; j < N; j++) {
    const p = (j + 1) / N; if (p >= 0.99) continue;
    const x = BX(p), y = WAS(p), b = 3.2 * BK(p), h = 0.8 * BK(p);
    if (!spiegeln) {
      g += `<path d="M${r(x - b)} ${r(y + 0.3)} Q${r(x - b * 0.6)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + b * 0.7)} ${r(y - h)} ${r(x + b * 1.15)} ${r(y + 0.3)} Z" fill="${S.lg("insel", [[0, "#c2b896"], [1, "#8a8470"]])}"/>`;
      g += `<path d="M${r(x - b * 0.7)} ${r(y - h * 0.6)} Q${r(x)} ${r(y - h * 1.1)} ${r(x + b * 0.8)} ${r(y - h * 0.5)}" stroke="#efe4c4" stroke-width=".35" fill="none" opacity=".8"/>`;
      for (let q = 0; q < 3; q++) g += `<path d="M${r(x - b * 0.9 + q * b * 0.55)} ${r(y + 0.8 + q * 0.6)} q${r(b * 0.4)} ${r(-0.5)} ${r(b * 0.8)} 0" stroke="#f6fbff" stroke-width="${r(0.25 + 0.04 * BK(p))}" fill="none" opacity=".7"/>`;
    }
  }
  return g;
};
S.def(`<linearGradient id="${S.id("bogenlicht")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3c38"/><stop offset=".55" stop-color="#5a6a6a"/><stop offset=".85" stop-color="#e8d8a8"/><stop offset="1" stop-color="#fff0c4"/></linearGradient>`);
{
  /* DIE DONAU */
  let k = `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="url(#${S.id("spiegelbild")})"/>`;
  k += `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("glanz", [[0, "#fff0c8", 0], [0.6, "#fff0c8", 0.05], [1, "#fff0c8", 0.3]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("tiefe", [[0, "#000", 0], [1, "#0e2a36", 0.3]])}"/>`;
  for (let i = 0; i < 170; i++) {
    const y = W + 1 + Math.pow(rnd(), 0.75) * (WU - W - 2), w = 1.2 + (y - W) * 0.3 * rnd() + 1;
    const x = rnd() * (318 - w);
    const hell = rnd() < (x > 180 ? 0.75 : 0.55);
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.4 ${r(w)} 0" stroke="${hell ? "#fff4dc" : "#2a4650"}" stroke-width="${r(0.15 + (y - W) * 0.012)}" fill="none" opacity="${r(0.25 + rnd() * 0.4)}"/>`;
  }
  /* Sonnenglitzern rechts (Abendsonne) */
  for (let i = 0; i < 40; i++) { const x = 220 + rnd() * 96, y = W + 18 + rnd() * 16; k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.8 + rnd() * 2)}" height=".35" fill="#fff6d8" opacity="${r(0.5 + rnd() * 0.5)}"/>`; }
  S.teil({ id: "donau", de: "die Donau", syl: "DO-nau", it: "il Danubio", itSyl: "da-NU-bio", en: "the Danube", x: 0, y: 0, kunst: k,
    tipp: "Die Donau fließt durch zehn Länder bis ins Schwarze Meer." });
}
{
  /* DIE STEINERNE BRÜCKE */
  const k = brueckenKoerper(false);
  const pj = 3, pp = (pj + 1) / N, bj = 4, bm = (bogen[bj][0] + bogen[bj][1]) / 2;
  S.teil({ id: "bruecke", de: "die Steinerne Brücke", syl: "STEI-ner-ne BRÜ-cke", it: "il Ponte di Pietra", itSyl: "PON-te di PIE-tra", en: "Stone Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Steinerne Brücke ist fast 900 Jahre alt (1135–1146). Sie ist über 300 Meter lang.",
    zoom: { x: 224, y: 84, w: 96, h: 64 },
    unter: [
      { id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: BX(bm), y: WAS(bm), kunst: flaeche(-(BX(bogen[bj][1]) - BX(bogen[bj][0])) / 2, -(WAS(bm) - DECK(bm) - 3.4 * BK(bm)), BX(bogen[bj][1]) - BX(bogen[bj][0]), WAS(bm) - DECK(bm) - 3.4 * BK(bm)),
        tipp: "Die Brücke hatte 16 runde Bögen aus Stein." },
      { id: "pfeiler", de: "der Pfeiler", syl: "PFEI-ler", it: "il pilone", itSyl: "pi-LO-ne", en: "pier", x: BX(pp), y: WAS(pp), kunst: flaeche(-3.6 * BK(pp), -(WAS(pp) - DECK(pp)) * 0.7, 7.6 * BK(pp), (WAS(pp) - DECK(pp)) * 0.7 + 1),
        tipp: "Die Pfeiler stehen auf breiten Steininseln. Dazwischen schießt die Donau als Strudel hindurch." },
    ] });
}

/* =====================================================================
   9 — DAS SCHIFF (Ausflugsschiff, fährt donauabwärts zur Walhalla)
   ===================================================================== */
{
  const X = 58, Y = 131, s = kw(Y) / 4.25;      /* ≈ 4 Einheiten je Meter, Schiff ≈ 20 m */
  const p = (x, y) => `${r(x * s)} ${r(y * s)}`;
  let k = `<ellipse cx="0" cy="${r(0.6 * s)}" rx="${r(44 * s)}" ry="${r(1.6 * s)}" fill="#1e3640" opacity=".35"/>`;
  /* Rumpf: weiß, blaues Band, Bug links */
  k += `<path d="M${p(-42, -7)} L${p(38, -7)} L${p(39, -2)} Q${p(38, 0.4)} ${p(35, 0.4)} L${p(-34, 0.4)} Q${p(-40, 0)} ${p(-42, -7)} Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.55, "#eef0f0"], [0.56, "#1f4f8f"], [0.72, "#1f4f8f"], [0.73, "#f2f2ee"], [0.86, "#f2f2ee"], [0.87, "#1e1e1e"], [1, "#1e1e1e"]])}"/>`;
  k += `<text x="${r(-20 * s)}" y="${r(-4.2 * s)}" font-size="${r(2 * s)}" fill="#1f4f8f" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".3">REGENSBURG</text>`;
  /* Salondeck mit Fenstern */
  k += `<rect x="${r(-32 * s)}" y="${r(-13.4 * s)}" width="${r(64 * s)}" height="${r(6.6 * s)}" fill="#fbfbf8"/>`;
  for (let x = -30; x < 30; x += 4) k += `<rect x="${r(x * s)}" y="${r(-12.4 * s)}" width="${r(3 * s)}" height="${r(3.6 * s)}" rx=".3" fill="${S.lg("scheibe", [[0, "#9ab8c8"], [1, "#3a5a6e"]])}"/>`;
  k += `<rect x="${r(-33 * s)}" y="${r(-14.2 * s)}" width="${r(66 * s)}" height="${r(1 * s)}" fill="#1f4f8f"/>`;
  /* Sonnendeck mit Reling und Sonnensegel, Steuerhaus vorn */
  k += `<path d="M${p(-30, -14.2)} L${p(-30, -16.6)} L${p(30, -16.6)} L${p(30, -14.2)}" stroke="#9aa3aa" stroke-width=".3" fill="none"/>`;
  for (let x = -30; x <= 30; x += 2.4) k += `<line x1="${r(x * s)}" y1="${r(-14.2 * s)}" x2="${r(x * s)}" y2="${r(-16.6 * s)}" stroke="#9aa3aa" stroke-width=".18"/>`;
  k += `<path d="M${p(-6, -21.4)} L${p(28, -21.4)} L${p(29, -20)} L${p(-7, -20)} Z" fill="#f2efe6"/>`;
  for (const x of [-5, 11, 27]) k += `<line x1="${r(x * s)}" y1="${r(-20 * s)}" x2="${r(x * s)}" y2="${r(-14.2 * s)}" stroke="#c8ccd0" stroke-width=".3"/>`;
  k += `<rect x="${r(-28 * s)}" y="${r(-20.4 * s)}" width="${r(10 * s)}" height="${r(6.2 * s)}" rx=".4" fill="#fbfbf8"/><rect x="${r(-27 * s)}" y="${r(-19.6 * s)}" width="${r(8 * s)}" height="${r(2.4 * s)}" fill="#3a5a6e"/>`;
  k += `<rect x="${r(-23.6 * s)}" y="${r(-23.4 * s)}" width="${r(1.6 * s)}" height="${r(3 * s)}" fill="#1f4f8f"/>`;
  /* Flaggen: Bayern (Rauten) am Bug, Deutschland am Heck */
  k += `<line x1="${r(-40 * s)}" y1="${r(-7 * s)}" x2="${r(-40 * s)}" y2="${r(-14 * s)}" stroke="#8a8f94" stroke-width=".3"/>`;
  k += `<rect x="${r(-40 * s)}" y="${r(-14 * s)}" width="${r(4 * s)}" height="${r(2.6 * s)}" fill="#f4f6f8"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r((-40 + i) * s)} ${r(-14 * s)} l${r(0.5 * s)} ${r(0.65 * s)} l${r(0.5 * s)} ${r(-0.65 * s)} Z M${r((-39.5 + i) * s)} ${r(-12.7 * s)} l${r(0.5 * s)} ${r(0.65 * s)} l${r(0.5 * s)} ${r(-0.65 * s)} Z" fill="#2c7fd4"/>`;
  k += `<line x1="${r(36 * s)}" y1="${r(-7 * s)}" x2="${r(36 * s)}" y2="${r(-13.6 * s)}" stroke="#8a8f94" stroke-width=".3"/><rect x="${r(36 * s)}" y="${r(-13.6 * s)}" width="${r(4 * s)}" height="${r(0.9 * s)}" fill="#1a1a1a"/><rect x="${r(36 * s)}" y="${r(-12.7 * s)}" width="${r(4 * s)}" height="${r(0.9 * s)}" fill="#d8232a"/><rect x="${r(36 * s)}" y="${r(-11.8 * s)}" width="${r(4 * s)}" height="${r(0.9 * s)}" fill="#f2c230"/>`;
  /* Bugwelle und Kielwasser */
  k += `<path d="M${p(-43, 0.4)} q${r(-3 * s)} ${r(0.8 * s)} ${r(-7 * s)} ${r(0.4 * s)} M${p(38, 0.8)} q${r(6 * s)} ${r(1 * s)} ${r(12 * s)} ${r(0.3 * s)}" stroke="#f6fbff" stroke-width=".5" fill="none" opacity=".85"/>`;
  k += `<rect x="${r(30 * s)}" y="${r(-13.4 * s)}" width="${r(2 * s)}" height="${r(6.4 * s)}" fill="${RAND}" opacity=".5"/>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "la nave", itSyl: "NA-ve", en: "boat",
    x: X, y: Y, kunst: gruppe("schiff", X, Y, k, Y), tipp: "Mit dem Schiff fährt man von Regensburg die Donau hinunter zur Walhalla." });
}

/* =====================================================================
   10 — DIE ENTE auf der Donau
   ===================================================================== */
{
  const Y = 149, s = kw(Y) / 9;
  let k = `<ellipse cx="0" cy=".3" rx="${r(5 * s)}" ry="${r(0.7 * s)}" fill="#1e3640" opacity=".3"/>`;
  k += `<path d="M${r(-4.6 * s)} 0 Q${r(-5 * s)} ${r(-2.6 * s)} ${r(-1.6 * s)} ${r(-2.8 * s)} L${r(2 * s)} ${r(-2.4 * s)} Q${r(4 * s)} ${r(-1.6 * s)} ${r(3.6 * s)} 0 Z" fill="${S.lg("ente", [[0, "#a89a86"], [1, "#6a5a48"]])}"/>`;
  k += `<path d="M${r(-3 * s)} ${r(-1.2 * s)} Q${r(0)} ${r(-2.6 * s)} ${r(2.4 * s)} ${r(-1.2 * s)}" stroke="#e8e4dc" stroke-width="${r(0.25 * s)}" fill="none"/><path d="M${r(-4.4 * s)} ${r(-1.6 * s)} l${r(-1.2 * s)} ${r(-0.8 * s)}" stroke="#2a2a2a" stroke-width="${r(0.4 * s)}"/>`;
  k += `<path d="M${r(1.8 * s)} ${r(-2.4 * s)} Q${r(2 * s)} ${r(-4.6 * s)} ${r(3 * s)} ${r(-4.8 * s)}" stroke="#2f7a4a" stroke-width="${r(1.2 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="${r(3 * s)}" cy="${r(-5 * s)}" r="${r(1.1 * s)}" fill="#2a7a4a"/><path d="M${r(3.8 * s)} ${r(-5 * s)} l${r(1.6 * s)} ${r(0.3 * s)} l${r(-1.6 * s)} ${r(0.4 * s)} Z" fill="#e8b830"/><rect x="${r(1.7 * s)}" y="${r(-3.2 * s)}" width="${r(1.3 * s)}" height="${r(0.35 * s)}" fill="#f4f4f0"/>`;
  k += `<path d="M${r(-6 * s)} ${r(0.6 * s)} q${r(6 * s)} ${r(0.8 * s)} ${r(12 * s)} 0" stroke="#f6fbff" stroke-width=".3" fill="none" opacity=".7"/>`;
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 214, y: Y, kunst: k });
}

/* =====================================================================
   11 — DIE KASTANIE (Biergartenbaum, links)
   ===================================================================== */
{
  const X = 14, Y = 196;
  let k = schatten(2, 0.5, 12, 1.8, 0.35);
  /* Stamm mit Borke, Licht von rechts */
  k += `<path d="M-9 0 Q-6 -40 -5.4 -80 Q-5 -120 -6.4 -158 L5.6 -160 Q5.4 -120 6.6 -80 Q8 -40 11 0 Z" fill="${S.lg("stamm", [[0, "#3a2a20"], [0.6, "#5a4232"], [1, "#8a6a4e"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 30; i++) { const y = -4 - i * 5.2, x = -3.4 + rnd() * 6.4; k += `<path d="M${r(x)} ${r(y)} q${r(-0.4 + rnd() * 0.8)} ${r(-2)} ${r(-0.2 + rnd() * 0.4)} ${r(-4)}" stroke="#2a1e16" stroke-width=".4" fill="none" opacity=".6"/>`; }
  k += `<path d="M5.6 -160 Q6.6 -80 11 0" stroke="${RAND}" stroke-width=".8" fill="none" opacity=".55"/>`;
  k += `<path d="M-2 -140 Q10 -154 26 -166 M-4 -150 Q-8 -162 -10 -174" stroke="${S.lg("ast", [[0, "#3a2a20"], [1, "#6a5040"]], 0, 0, 1, 0)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  /* Krone: dunkle Masse, darüber handförmige Kastanienblätter, Gegenlicht am Rand */
  const blatt = (cx, cy, gr, dreh, ton) => {
    let g = "";
    const F = [["#24481f", "#2e5627", "#3c6a30"], ["#3a6a2c", "#4a7c34", "#5a8e3a"], ["#7aa846", "#94bc56", "#b0d06a"]][ton];
    for (let i = 0; i < 7; i++) {
      const a = (dreh + (i - 3) * 24) * Math.PI / 180, l = gr * (1 - Math.abs(i - 3) * 0.14);
      const ex = cx + Math.sin(a) * l, ey = cy - Math.cos(a) * l, nx = Math.cos(a) * l * 0.24, ny = Math.sin(a) * l * 0.24;
      g += `<path d="M${r(cx)} ${r(cy)} Q${r((cx + ex) / 2 + nx)} ${r((cy + ey) / 2 + ny)} ${r(ex)} ${r(ey)} Q${r((cx + ex) / 2 - nx)} ${r((cy + ey) / 2 - ny)} ${r(cx)} ${r(cy)} Z" fill="${F[i % 3]}"/>`;
    }
    return g;
  };
  const KY = -Y;   /* oberer Bildrand in Teil-Koordinaten */
  let masse = "";
  for (const [x, y, rx, ry] of [[10, 13, 22, 12], [30, 11, 20, 10], [47, 12, 13, 9], [0, 28, 12, 14], [18, 30, 16, 10], [36, 26, 12, 8], [54, 20, 8, 6]]) masse += `<ellipse cx="${x}" cy="${r(KY + y)}" rx="${rx}" ry="${ry}" fill="#24441e"/>`;
  k += masse;
  const buesch = [];
  for (let i = 0; i < 70; i++) {
    const x = -2 + rnd() * 64, y = 10 + rnd() * 34;
    const rand = Math.hypot((x - 22) / 40, (y - 16) / 24);
    if (rand > 1.08) continue;
    buesch.push([x, KY + y, 6 + rnd() * 4, -60 + rnd() * 160, rand > 0.75 && x > 18 ? 2 : rand > 0.55 ? 1 : 0]);
  }
  buesch.sort((a, b) => a[4] - b[4]);
  for (const [x, y, g, d, t] of buesch) k += blatt(x, y, g, d, t);
  /* stachelige grüne Kastanienfrüchte */
  for (const [x, y] of [[22, 30], [38, 24], [8, 36]]) { const yy = KY + y; k += `<circle cx="${x}" cy="${r(yy)}" r="1.9" fill="#94bc56"/>`; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; k += `<line x1="${r(x + Math.cos(a) * 1.7)}" y1="${r(yy + Math.sin(a) * 1.7)}" x2="${r(x + Math.cos(a) * 2.6)}" y2="${r(yy + Math.sin(a) * 2.6)}" stroke="#6a8a34" stroke-width=".25"/>`; } }
  S.teil({ id: "kastanie", de: "die Kastanie", syl: "kas-TA-nie", it: "il castagno", itSyl: "ca-STA-gno", en: "chestnut tree", x: X, y: Y, steht: true, kunst: k,
    tipp: "Im Biergarten spenden Kastanien Schatten. Ihre Wurzeln halten den Keller darunter kühl." });
}

/* =====================================================================
   12 — DER TISCH im Biergarten (Lupe: Bratwurst, Sauerkraut, Senf,
        Brezel, Bier), 13 — DIE BANK, 14 — DIE KELLNERIN
   ===================================================================== */
const TI = { x: 200, y: 197 };
const TS = km(TI.y);                       /* ≈ 34,6 Einheiten je Meter */
const PL = TI.y - 0.77 * TS;               /* Tischplatte vorne (0,77 m) */
const Q = TS / 34.6 * 0.72;                /* Maßstab der Dinge auf dem Tisch */
{
  const L = 1.25 * TS, T = 6;              /* halbe Länge (Tisch 2,5 m); Tiefe der Platte im Bild */
  let k = schatten(0, 0.6, L + 4, 2.4, 0.35);
  const HOLZ = S.lg("tischholz", [[0, "#9a6a3c"], [0.5, "#b8834c"], [1, "#d8a46a"]], 0, 0, 1, 0);
  /* Klappbeine */
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (L - 10))} 0 L${r(sx * (L - 3))} ${r(PL - TI.y + 1.5)} M${r(sx * (L - 3))} 0 L${r(sx * (L - 10))} ${r(PL - TI.y + 1.5)}" stroke="#4a4e52" stroke-width="1.3"/>`;
  /* Platte: Oberseite in Flucht, Vorderkante */
  k += `<path d="M${r(-L)} ${r(PL - TI.y)} L${r(L)} ${r(PL - TI.y)} L${r(L - 3)} ${r(PL - TI.y - T)} L${r(-L + 3)} ${r(PL - TI.y - T)} Z" fill="${HOLZ}"/>`;
  for (const t of [0.33, 0.66]) k += `<line x1="${r(-L + 3 * t)}" y1="${r(PL - TI.y - T * t)}" x2="${r(L - 3 * t)}" y2="${r(PL - TI.y - T * t)}" stroke="#7a4e2a" stroke-width=".25" opacity=".6"/>`;
  k += `<rect x="${r(-L)}" y="${r(PL - TI.y)}" width="${r(2 * L)}" height="2" fill="#8a5a30"/>`;
  k += `<path d="M${r(-L + 3)} ${r(PL - TI.y - T)} L${r(L - 3)} ${r(PL - TI.y - T)}" stroke="${RAND}" stroke-width=".5" opacity=".7"/>`;
  const ding = (x, y, svg) => `<g transform="translate(${r(x)} ${r(y)}) scale(${r(Q * 100) / 100})">${svg}</g>`;
  /* SECHS AUF KRAUT: Teller mit Sauerkraut und sechs Bratwürstl */
  const tx = -22, ty = PL - TI.y - 2.4;
  let t = `<ellipse cx="0" cy="0" rx="8" ry="2" fill="#f6f4ee"/><ellipse cx="0" cy="-.2" rx="6.6" ry="1.5" fill="#e8e6dc"/>`;
  t += `<path d="M-6 0 Q-5 -2.6 0 -2.8 Q5 -2.6 6 0 Q0 1 -6 0 Z" fill="#e8dc9a"/>`;
  for (let i = 0; i < 26; i++) { const x = -5.4 + rnd() * 10.8, y = -0.2 - rnd() * 2.2; t += `<path d="M${r(x)} ${r(y)} q.6 -.4 1.2 .1" stroke="${rnd() < 0.5 ? "#c8b868" : "#f4eab8"}" stroke-width=".22" fill="none"/>`; }
  for (let i = 0; i < 6; i++) { const x = -4.2 + (i % 3) * 3.4 + (i > 2 ? 1.2 : 0), y = -2.2 - (i > 2 ? 1 : 0); t += `<rect x="${r(x - 1.5)}" y="${r(y - 0.55)}" width="3" height="1.1" rx=".55" fill="${S.lg("wurst", [[0, "#d08a48"], [0.5, "#a85a24"], [1, "#6a3412"]])}" transform="rotate(${-8 + i * 4} ${r(x)} ${r(y)})"/>`; }
  k += ding(tx, ty, t);
  /* SENF im Steinguttopf mit Holzlöffel */
  const sx0 = -8, sy0 = PL - TI.y - 2;
  k += ding(sx0, sy0, `<path d="M-1.8 0 L-1.6 -3.6 L1.6 -3.6 L1.8 0 Z" fill="${S.lg("topf", [[0, "#b8a888"], [0.5, "#efe6d2"], [1, "#c8b898"]], 0, 0, 1, 0)}"/><rect x="-1.7" y="-2.6" width="3.4" height=".7" fill="#2f4f8f"/><ellipse cx="0" cy="-3.6" rx="1.6" ry=".45" fill="#8a5a1e"/><line x1=".4" y1="-3.6" x2="1.6" y2="-6.2" stroke="#c89a5a" stroke-width=".45" stroke-linecap="round"/>`);
  /* BREZEL auf dem Brettl */
  const bx = 3, by = PL - TI.y - 2.6;
  const bp = (dx, dy) => `${r(dx)} ${r(-2.4 + dy)}`;
  const bre = `M${bp(-3.4, 1.6)} C${bp(-5, 0)} ${bp(-3.6, -2.6)} ${bp(-0.8, -2.4)} C${bp(1.6, -2.2)} ${bp(2.2, 0)} ${bp(0.8, 1.2)} M${bp(3.4, 1.6)} C${bp(5, 0)} ${bp(3.6, -2.6)} ${bp(0.8, -2.4)} C${bp(-1.6, -2.2)} ${bp(-2.2, 0)} ${bp(-0.8, 1.2)}`;
  let br = `<path d="M-4.4 .6 L4.4 .6 L4 -.4 L-4 -.4 Z" fill="#c89a62"/><path d="${bre}" stroke="${S.lg("lauge", [[0, "#b8642a"], [1, "#6a3010"]])}" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="${bre}" stroke="#d88a4a" stroke-width=".3" fill="none" opacity=".6" transform="translate(-.15 -.25)"/>`;
  for (let i = 0; i < 8; i++) br += `<circle cx="${r(-3 + rnd() * 6)}" cy="${r(-4.4 + rnd() * 3)}" r=".18" fill="#fffaf0"/>`;
  k += ding(bx, by, br);
  /* BIER: zwei Halbe mit Schaum */
  const glas = () => {
    let g = `<path d="M-1.9 0 L-2.1 -8 L2.1 -8 L1.9 0 Z" fill="${S.lg("bier", [[0, "#c88a1e"], [0.5, "#f2be44"], [1, "#d8961e"]], 0, 0, 1, 0)}" opacity=".95"/>`;
    g += `<path d="M-2.2 -8 Q-2.4 -10 -.8 -10.2 Q0 -11 1 -10.2 Q2.4 -10 2.2 -8 Z" fill="#fffaf0"/>`;
    g += `<path d="M2.1 -6.4 q2 .2 1.8 2.4 q-.2 2 -1.9 2" stroke="#e8ecec" stroke-width=".55" fill="none" opacity=".85"/>`;
    g += `<line x1="-1.3" y1="-7.4" x2="-1.1" y2="-.8" stroke="#fff" stroke-width=".35" opacity=".55"/>`;
    for (let i = 0; i < 5; i++) g += `<circle cx="${r(-1.4 + rnd() * 2.8)}" cy="${r(-1 - rnd() * 6)}" r=".12" fill="#fff6d0"/>`;
    return g;
  };
  const gy = PL - TI.y - 1.6;
  k += ding(14, gy, glas()) + ding(20, gy - 0.6, glas());
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TI.x, y: TI.y, steht: true, kunst: k,
    tipp: "Im Biergarten sitzt man an langen Holztischen unter Kastanien.",
    zoom: { x: TI.x - 36, y: PL - 16, w: 66, h: 44 },
    unter: [
      { id: "bratwurst", de: "die Bratwurst", syl: "BRAT-wurst", it: "la salsiccia", itSyl: "sal-SIC-cia", en: "sausage", x: TI.x + tx, y: PL - 2.4 - 1.2 * Q, kunst: flaeche(-5.4 * Q, -2.8 * Q, 10.8 * Q, 2.8 * Q),
        tipp: "In Regensburg isst man „sechs auf Kraut“: sechs kleine Bratwürste auf Sauerkraut." },
      { id: "sauerkraut", de: "das Sauerkraut", syl: "SAU-er-kraut", it: "i crauti", itSyl: "CRAU-ti", en: "sauerkraut", x: TI.x + tx, y: PL - 2.4 + 2 * Q, kunst: flaeche(-7.8 * Q, -3.2 * Q, 15.6 * Q, 3.2 * Q),
        tipp: "Sauerkraut ist gehobelter, vergorener Weißkohl." },
      { id: "senf", de: "der Senf", syl: "SENF", it: "la senape", itSyl: "SE-na-pe", en: "mustard", x: TI.x + sx0, y: PL - 2, kunst: flaeche(-2.2 * Q, -6.6 * Q, 4.4 * Q, 6.8 * Q),
        tipp: "Zur Regensburger Bratwurst gehört süßer Senf." },
      { id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: TI.x + bx, y: PL - 2.6 + 0.6 * Q, kunst: flaeche(-4.6 * Q, -6 * Q, 9.2 * Q, 6 * Q),
        tipp: "In Bayern sagt man „die Brezn“." },
      { id: "bier", de: "das Bier", syl: "BIER", it: "la birra", itSyl: "BIR-ra", en: "beer", x: TI.x + 17, y: PL - 1.6, kunst: flaeche(-3 - 2.4 * Q, -11.6 * Q, 6 + 4.8 * Q, 11.8 * Q),
        tipp: "Ein großes Glas mit einem halben Liter heißt in Bayern „eine Halbe“." },
    ] });
}
{
  const Y = 200, s = km(Y);
  const L = 1.25 * TS;
  let k = "";
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (L - 8))} 0 L${r(sx * (L - 3))} ${r(-0.45 * s)} M${r(sx * (L - 3))} 0 L${r(sx * (L - 8))} ${r(-0.45 * s)}" stroke="#4a4e52" stroke-width="1.3"/>`;
  k += `<rect x="${r(-L - 1)}" y="${r(-0.47 * s - 2.4)}" width="${r(2 * L + 2)}" height="2.6" rx=".5" fill="${S.lg("bankholz", [[0, "#9a6a3c"], [0.6, "#c08a50"], [1, "#e0aa6e"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-L - 1)}" y="${r(-0.47 * s + 0.2)}" width="${r(2 * L + 2)}" height="1.2" fill="#7a4e2a"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panca", itSyl: "PAN-ca", en: "bench", x: TI.x, y: Y - 0.6, steht: true, kunst: k });
}
{
  const Y = 186;
  const m = B.mensch({ id: "rgb_kell", geschlecht: "w", pose: "servieren", blick: -20, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, kleid: { stueck: "sommerkleid", farbe: "gruen_d" }, schuerze: { stueck: "schuerze", farbe: "rosa" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "tablett" } } }, 1.68 * km(Y));
  S.teil({ id: "kellnerin", de: "die Kellnerin", syl: "KELL-ne-rin", it: "la cameriera", itSyl: "ca-me-RIE-ra", en: "waitress", x: 292, y: Y, kunst: schatten(0, 0.5, 9, 1.6, 0.3) + m.svg,
    tipp: "Die Kellnerin fragt: „Was darf’s sein – eine Halbe und sechs auf Kraut?“" });
}

/* Das Spiegelbild in der Donau (als Muster: die Fläche der Donau bleibt genau das Wasser) */
{
  let sp = "";
  for (const s of spiegel) sp += `<use href="#${S.id("sp_" + s.id)}" transform="translate(${r(s.x)} ${r(2 * s.achse - s.y)}) scale(1 -1)"/>`;
  sp += brueckenKoerper(true);
  S.def(`<pattern id="${S.id("spiegelbild")}" patternUnits="userSpaceOnUse" x="0" y="${W}" width="320" height="${WU - W}"><g transform="translate(0 ${-W})"><rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("wasser", [[0, "#c8c4a8"], [0.25, "#8aa4a8"], [0.6, "#5a7c84"], [1, "#3c5a64"]])}"/><g opacity=".66" filter="url(#${S.id("spiegel")})">${sp}</g></g></pattern>`);
}

/* Abendlicht von rechts, leichter Rand */
S.davor(`<rect width="320" height="200" fill="${S.lg("abendlicht", [[0, "#1a2a40", 0.06], [0.55, "#ffd08a", 0], [1, "#ffd08a", 0.16]], 0, 0, 1, 0)}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#0a0c14", 0.22]], 0.5, 0.48, 0.78)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/regensburg.js"));
console.log(aus);
