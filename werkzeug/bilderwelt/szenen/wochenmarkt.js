#!/usr/bin/env node
/* =====================================================================
   DER WOCHENMARKT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Marktsatzungen deutscher Städte, „Die besten Wochenmärkte
   in Deutschland“, Berliner Wochenmärkte) — so sieht ein deutscher
   Wochenmarkt aus:
   - Er findet traditionell auf dem alten MARKTPLATZ vor dem RATHAUS
     statt, mit Kopfsteinpflaster, Fachwerkhäusern und dem Kirchturm.
   - Der OBST- UND GEMÜSESTAND: Gestell mit gestreifter Markise, ein
     schräger Tisch mit grünem Kunstrasen, darauf die Holzsteigen mit
     Äpfeln, Tomaten, Erdbeeren, Salat, Gurken, Paprika, Möhren; in jeder
     Steige ein kleines Kreideschild mit dem Preis. Am Rand die WAAGE
     (geeicht, mit Anzeige zur Kundschaft) und die Geldkassette.
     Papiertüten hängen am Pfosten. Leere Kisten stapeln sich daneben,
     Kartoffeln stehen in einer Kiste am Boden.
   - Der BLUMENSTAND unter einem Marktschirm: Zinkeimer auf einer
     Stufenbank mit Tulpen, Rosen, Sonnenblumen und fertigen Sträußen.
   - Der KÄSEWAGEN: ein Verkaufswagen mit hochgeklappter Seite, Käselaibe
     im Regal, Stücke in der gekühlten Theke.
   - Kundschaft mit Weidenkorb.
   Maßstab: Augenhöhe y ≈ 92; Stand vorne (Fuß y 168) ≈ 47 Einheiten
   je Meter, Kundin vorne ≈ 65 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "wochenmarkt", titel: "Der Wochenmarkt", emoji: "🥕", thema: "Einkaufen", kuerzel: "b02e", fassung: 852 });
const rnd = zufall(1525);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#d9b27a"], [1, "#b98c52"]]);
const HOLZ_D = S.lg("holzd", [[0, "#9b6b3a"], [1, "#6f4a24"]]);
const ZINK = S.lg("zink", [[0, "#9aa3aa"], [0.45, "#d9dee2"], [1, "#8a939a"]], 0, 0, 1, 0);
const APFEL = S.rg("apfel", [[0, "#ff6b5a"], [0.6, "#d62828"], [1, "#8f1414"]], 0.35, 0.3, 0.75);
const TOMATE = S.rg("tomate", [[0, "#ff8a6a"], [0.6, "#e5381f"], [1, "#a01c0c"]], 0.35, 0.3, 0.75);
const BIRNE = S.rg("birne", [[0, "#e9f08a"], [0.6, "#b9c43a"], [1, "#7d8a1c"]], 0.35, 0.3, 0.75);
const KARTOFFEL = S.rg("kart", [[0, "#e8cf9a"], [0.6, "#c9a865"], [1, "#94763e"]], 0.35, 0.3, 0.75);

/* =====================================================================
   KULISSE — Himmel, ferne Marktstände, Kopfsteinpflaster in Flucht
   ===================================================================== */
const FERNE = 98;
S.hinten(`<rect x="0" y="0" width="320" height="${FERNE + 2}" fill="${S.lg("himmel", [[0, "#7fb2e0"], [0.75, "#cfe2f1"], [1, "#eef3f6"]])}"/>`);
S.hinten(`<ellipse cx="110" cy="12" rx="26" ry="5" fill="#fff" opacity=".75"/><ellipse cx="128" cy="9" rx="14" ry="4" fill="#fff" opacity=".85"/><ellipse cx="300" cy="40" rx="20" ry="4" fill="#fff" opacity=".6"/>`);
/* Pflaster: Bänder mit wachsender Steingröße (Flucht) */
S.def(`<pattern id="${S.id("pflaster")}" width="8" height="5" patternUnits="userSpaceOnUse"><rect width="8" height="5" fill="#6f6a62"/><rect x=".4" y=".4" width="3.4" height="2" rx=".8" fill="#9c958a"/><rect x="4.2" y=".4" width="3.4" height="2" rx=".8" fill="#a8a195"/><rect x="-1.6" y="2.9" width="3.4" height="1.8" rx=".8" fill="#a39c90"/><rect x="2.2" y="2.9" width="3.4" height="1.8" rx=".8" fill="#958e83"/><rect x="6" y="2.9" width="3.4" height="1.8" rx=".8" fill="#a39c90"/></pattern>`);
{
  let g = "";
  const baender = [[FERNE, 108, 0.35], [108, 122, 0.5], [122, 140, 0.68], [140, 164, 0.86], [164, 200, 1.1]];
  baender.forEach(([a, b, s], i) => {
    S.def(`<pattern id="${S.id("pfl" + i)}" href="#${S.id("pflaster")}" patternTransform="scale(${s})"/>`);
    g += `<rect x="0" y="${a}" width="320" height="${b - a}" fill="url(#${S.id("pfl" + i)})"/>`;
  });
  g += `<rect x="0" y="${FERNE}" width="320" height="${200 - FERNE}" fill="${S.lg("pflicht", [[0, "#fff", 0.25], [0.3, "#fff", 0.05], [1, "#000", 0.08]])}"/>`;
  /* Rinne aus größeren Steinen quer */
  g += `<path d="M0 150 Q160 146 320 150" stroke="#5c574f" stroke-width="1.6" fill="none" opacity=".5"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DAS RATHAUS (Treppengiebel, Uhr, Laubengang)
   ===================================================================== */
{
  const x0 = 26, x1 = 150, cx = (x0 + x1) / 2, top = 46;
  let k = `<g transform="translate(${-cx} ${-FERNE})">`;
  k += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${FERNE - top}" fill="${S.lg("sandstein", [[0, "#ead9b8"], [1, "#d3bd94"]])}"/>`;
  /* Treppengiebel */
  const gx0 = cx - 34, gx1 = cx + 34;
  let p = `M${gx0} ${top}`;
  for (let i = 0; i < 4; i++) p += ` L${gx0 + i * 8.5} ${top - 7 - i * 7} L${gx0 + (i + 1) * 8.5} ${top - 7 - i * 7}`;
  p += ` L${cx} ${top - 36}`;
  for (let i = 3; i >= 0; i--) p += ` L${gx1 - (i + 1) * 8.5} ${top - 7 - i * 7} L${gx1 - i * 8.5} ${top - 7 - i * 7}`;
  p += ` L${gx1} ${top} Z`;
  k += `<path d="${p}" fill="${S.lg("giebel", [[0, "#f0e2c4"], [1, "#e0cca6"]])}" stroke="#bfa57a" stroke-width=".4"/>`;
  k += `<path d="M${cx - 1} ${top - 36} L${cx - 1} ${top - 46} L${cx + 7} ${top - 43} L${cx} ${top - 40}" fill="#c1121f" stroke="#555" stroke-width=".4"/>`;
  /* Uhr im Giebel */
  k += `<circle cx="${cx}" cy="${top - 18}" r="6" fill="#1f3b63" stroke="#d4af37" stroke-width=".8"/><line x1="${cx}" y1="${top - 18}" x2="${cx}" y2="${top - 22.6}" stroke="#d4af37" stroke-width=".7"/><line x1="${cx}" y1="${top - 18}" x2="${cx + 3}" y2="${top - 17}" stroke="#d4af37" stroke-width=".9"/>`;
  k += `<rect x="${x0 - 2}" y="${top - 2}" width="${x1 - x0 + 4}" height="2.4" fill="#bfa57a"/>`;
  /* Fenster in zwei Reihen */
  for (let i = 0; i < 8; i++) for (const y of [top + 4, top + 20]) {
    const x = x0 + 6 + i * 14.6;
    k += `<path d="M${x} ${y + 11} L${x} ${y + 3} Q${x + 4} ${y - 1} ${x + 8} ${y + 3} L${x + 8} ${y + 11} Z" fill="#5f7d98" stroke="#fff6e0" stroke-width=".8"/><line x1="${x + 4}" y1="${y + 1}" x2="${x + 4}" y2="${y + 11}" stroke="#fff6e0" stroke-width=".4"/>`;
  }
  /* Laubengang mit Bögen unten */
  for (let i = 0; i < 6; i++) {
    const x = x0 + 4 + i * 20;
    k += `<path d="M${x} ${FERNE} L${x} ${top + 44} Q${x + 8} ${top + 35} ${x + 16} ${top + 44} L${x + 16} ${FERNE} Z" fill="#6b5a44"/>`;
  }
  k += `<text x="${cx}" y="${top + 37.6}" font-size="4" text-anchor="middle" fill="#7a5a2a" font-family="Georgia,serif" letter-spacing="1">RATHAUS</text>`;
  k += `<rect x="${x0}" y="${top - 46}" width="${x1 - x0}" height="${FERNE - top + 46}" fill="#fff" opacity="0"/>`;
  k += `</g>`;
  S.teil({ id: "wm_rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall", x: cx, y: FERNE, kunst: `<g opacity=".92">${k}</g>`,
    tipp: "Der Wochenmarkt ist oft auf dem Marktplatz vor dem Rathaus." });
}
{
  /* Fachwerkhaus zwischen Rathaus und Kirche (Kulisse) */
  const x0 = 150, x1 = 238;
  let h = `<rect x="${x0}" y="44" width="${x1 - x0}" height="${FERNE - 44}" fill="#f4ecdc"/><path d="M${x0 - 3} 44 L${(x0 + x1) / 2} 18 L${x1 + 3} 44 Z" fill="#8e3b2c"/>`;
  for (let x = x0; x <= x1; x += 11) h += `<rect x="${x - 0.8}" y="44" width="1.6" height="${FERNE - 44}" fill="#5a3a22"/>`;
  for (const y of [44, 62, 80]) h += `<rect x="${x0}" y="${y - 0.8}" width="${x1 - x0}" height="1.6" fill="#5a3a22"/>`;
  for (let x = x0; x < x1 - 5; x += 22) h += `<path d="M${x} 62 L${x + 11} 44 M${x + 11} 44 L${x + 22} 62" stroke="#5a3a22" stroke-width="1.2"/>`;
  for (let x = x0 + 3; x < x1 - 6; x += 11) for (const y of [48, 66]) h += `<rect x="${x}" y="${y}" width="5" height="9" fill="#6f8aa3" stroke="#fff" stroke-width=".5"/>`;
  S.hinten(`<g opacity=".9">${h}</g>`);
}
/* =====================================================================
   2 — DIE KIRCHE (Turm mit grüner Kupferspitze)
   ===================================================================== */
{
  const cx = 268;
  let k = `<g transform="translate(${-cx} ${-FERNE})">`;
  k += `<rect x="276" y="52" width="48" height="${FERNE - 52}" fill="${S.lg("kschiff", [[0, "#d8c7a6"], [1, "#c2ae88"]])}"/><path d="M272 52 L298 34 L324 52 Z" fill="#6f4a3a"/>`;
  for (const x of [284, 300, 314]) k += `<path d="M${x} 90 L${x} 64 Q${x + 3.5} 58 ${x + 7} 64 L${x + 7} 90 Z" fill="#5f7d98" stroke="#efe3c9" stroke-width=".7"/>`;
  k += `<rect x="252" y="40" width="32" height="${FERNE - 40}" fill="${S.lg("turm", [[0, "#e2d1ae"], [1, "#c9b48c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M250 40 L268 8 L286 40 Z" fill="${S.lg("kupfer", [[0, "#5fa58c"], [1, "#2f6e5a"]], 0, 0, 1, 0)}"/><path d="M268 8 L268 1 M265.4 3.6 L270.6 3.6" stroke="#d4af37" stroke-width=".8"/>`;
  k += `<rect x="250" y="38" width="36" height="3" fill="#bfa57a"/>`;
  k += `<circle cx="268" cy="50" r="5.4" fill="#1f3b63" stroke="#d4af37" stroke-width=".8"/><line x1="268" y1="50" x2="268" y2="45.8" stroke="#d4af37" stroke-width=".7"/><line x1="268" y1="50" x2="271" y2="51" stroke="#d4af37" stroke-width=".9"/>`;
  k += `<path d="M262 76 L262 64 Q268 58 274 64 L274 76 Z" fill="#3f4f5f"/><path d="M262 92 L262 82 Q268 76 274 82 L274 92 Z" fill="#5b4632"/>`;
  k += `</g>`;
  S.teil({ id: "wm_kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x: cx, y: FERNE, kunst: `<g opacity=".92">${k}</g>` });
}
/* ferne Marktstände (Kulisse) */
{
  let g = "";
  for (const [x, f] of [[160, "#c1121f"], [196, "#2b6cb0"], [232, "#e0a100"]]) {
    g += `<rect x="${x}" y="88" width="1" height="12" fill="#555"/><rect x="${x + 26}" y="88" width="1" height="12" fill="#555"/><path d="M${x - 2} 88 L${x + 29} 88 L${x + 27} 84 L${x} 84 Z" fill="${f}"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${x + i * 5}" y="84" width="2.4" height="4" fill="#fff" opacity=".8"/>`;
    g += `<rect x="${x}" y="96" width="27" height="4" fill="#7a5a32"/>`;
  }
  S.hinten(g);
}

/* =====================================================================
   3 — DER SONNENSCHIRM und DER BLUMENSTAND (links) — Lupe
   ===================================================================== */
{
  let k = `<rect x="-.8" y="-104" width="1.6" height="104" fill="#e9e6df"/><rect x="-.8" y="-104" width=".5" height="104" fill="#fff"/>`;
  k += `<path d="M-44 -86 Q-22 -110 0 -112 Q22 -110 44 -86 Q33 -90 22 -86 Q11 -90 0 -86 Q-11 -90 -22 -86 Q-33 -90 -44 -86 Z" fill="${S.lg("schirm", [[0, "#ffffff"], [1, "#e4e0d6"]])}" stroke="#c9c3b5" stroke-width=".4"/>`;
  for (const x of [-22, 0, 22]) k += `<path d="M0 -112 Q${x * 0.6} -100 ${x} -86" stroke="#d6d0c2" stroke-width=".4" fill="none"/>`;
  k += `<ellipse cx="0" cy="-1" rx="7" ry="1.8" fill="#4a4e52"/>`;
  S.teil({ id: "wm_schirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: 42, y: 170, kunst: k });
}
{
  const cx = 42, yb = 170;
  let k = schatten(0, .4, 40, 1.8, .3);
  /* Stufenbank aus Holz: drei Stufen */
  const stufen = [[-38, 38, -14], [-34, 34, -30], [-30, 30, -46]];
  for (const [a, b, y] of stufen) k += `<rect x="${a}" y="${y}" width="${b - a}" height="2.6" fill="${HOLZ}"/><rect x="${a}" y="${y + 2.6}" width="${b - a}" height="${-y - 2.6 + (y === -14 ? 0 : 16 - 14)}" fill="${HOLZ_D}" opacity="${y === -14 ? 1 : 0}"/>`;
  k += `<rect x="-38" y="-11.4" width="76" height="11.4" fill="${HOLZ_D}"/><rect x="-36" y="-30" width="2" height="16" fill="${HOLZ_D}"/><rect x="34" y="-30" width="2" height="16" fill="${HOLZ_D}"/><rect x="-32" y="-46" width="2" height="16" fill="${HOLZ_D}"/><rect x="30" y="-46" width="2" height="16" fill="${HOLZ_D}"/>`;
  const eimer = (x, y, w = 11, h = 9) => `<path d="M${x - w / 2} ${y - h} L${x + w / 2} ${y - h} L${x + w / 2 - 1.4} ${y} L${x - w / 2 + 1.4} ${y} Z" fill="${ZINK}"/><rect x="${x - w / 2 - 0.3}" y="${y - h - 0.6}" width="${w + 0.6}" height="1.2" rx=".5" fill="#c9cfd4"/>`;
  const stiele = (x, y, n, hoch) => { let g = ""; for (let i = 0; i < n; i++) g += `<line x1="${r(x - 3 + i * 6 / n)}" y1="${y}" x2="${r(x - 6 + i * 12 / n)}" y2="${r(y - hoch)}" stroke="#3f7d2c" stroke-width=".5"/>`; return g; };
  const unter = [];
  const blume = (art, x, y) => {
    let g = "";
    if (art === "tulpe") { g += stiele(x, y - 8, 7, 14); for (let i = 0; i < 9; i++) { const bx = x - 6 + (i % 5) * 3 + (i > 4 ? 1.5 : 0), by = y - 22 - (i > 4 ? 3 : 0) + rnd(); const f = ["#e63946", "#ffbe0b", "#ff70a6", "#e63946", "#f4a261"][i % 5]; g += `<path d="M${r(bx - 1.3)} ${r(by)} L${r(bx - 1.4)} ${r(by - 2.6)} L${r(bx - 0.5)} ${r(by - 1.8)} L${r(bx)} ${r(by - 3)} L${r(bx + 0.5)} ${r(by - 1.8)} L${r(bx + 1.4)} ${r(by - 2.6)} L${r(bx + 1.3)} ${r(by)} Q${r(bx)} ${r(by + 1)} ${r(bx - 1.3)} ${r(by)} Z" fill="${f}"/>`; } }
    else if (art === "rose") { g += stiele(x, y - 8, 7, 14); for (let i = 0; i < 9; i++) { const bx = x - 6 + (i % 5) * 3 + (i > 4 ? 1.5 : 0), by = y - 22.6 - (i > 4 ? 3 : 0) + rnd(); g += `<circle cx="${r(bx)}" cy="${r(by)}" r="1.6" fill="${i % 3 ? "#c1121f" : "#9d0208"}"/><path d="M${r(bx - 0.8)} ${r(by)} q.8 -.9 1.6 0" stroke="#6a040f" stroke-width=".3" fill="none"/>`; } }
    else if (art === "sonnenblume") { g += stiele(x, y - 8, 4, 18); for (let i = 0; i < 4; i++) { const bx = x - 5 + i * 3.4, by = y - 25 - (i % 2) * 2.4; g += `<circle cx="${r(bx)}" cy="${r(by)}" r="2.8" fill="#ffc300"/>`; for (let q = 0; q < 8; q++) { const a = q * Math.PI / 4; g += `<ellipse cx="${r(bx + Math.cos(a) * 2.4)}" cy="${r(by + Math.sin(a) * 2.4)}" rx="1.2" ry=".6" fill="#ffd60a" transform="rotate(${q * 45} ${r(bx + Math.cos(a) * 2.4)} ${r(by + Math.sin(a) * 2.4)})"/>`; } g += `<circle cx="${r(bx)}" cy="${r(by)}" r="1.4" fill="#6b3e11"/>`; } }
    else { /* Sträuße in Papier */ for (let i = 0; i < 3; i++) { const sx = x - 4 + i * 4; g += `<path d="M${sx - 1} ${y - 8} L${sx - 3.6} ${y - 20} L${sx + 3.6} ${y - 20} L${sx + 1} ${y - 8} Z" fill="${["#f1e3c8", "#d8ecd0", "#f6d6e0"][i]}" stroke="#bba98a" stroke-width=".2"/>`; for (let q = 0; q < 5; q++) g += `<circle cx="${r(sx - 2.4 + q * 1.2)}" cy="${r(y - 20.6 - (q % 2) * 1.4)}" r="1.2" fill="${["#ff70a6", "#ffffff", "#9b5de5", "#ffbe0b", "#e63946"][(q + i) % 5]}"/>`; } }
    return g;
  };
  const platz = [["wm_tulpe", "die Tulpe", "TUL-pe", "il tulipano", "tu-li-PA-no", "tulip", -14, -46, "tulpe", "Tulpen kommen oft aus den Niederlanden."],
    ["wm_rose", "die Rose", "RO-se", "la rosa", "RO-sa", "rose", 11, -46, "rose", null],
    ["wm_sonnenblume", "die Sonnenblume", "SON-nen-blu-me", "il girasole", "gi-ra-SO-le", "sunflower", -20, -30, "sonnenblume", null],
    ["wm_blumenstrauss", "der Blumenstrauß", "BLU-men-strauß", "il mazzo di fiori", "MAZ-zo di FIO-ri", "bunch of flowers", 8, -30, "strauss", "Ein Blumenstrauß ist ein schönes Geschenk."]];
  for (const [id, de, syl, it, itSyl, en, x, y, art, tipp] of platz) {
    k += blume(art, x, y) + eimer(x, y);
    unter.push({ id, de, syl, it, itSyl, en, tipp: tipp || undefined, x: cx + x, y: yb + y, kunst: flaeche(-12, -28, 24, 28.4) });
  }
  /* Preisschildchen an der Stufe */
  k += `<rect x="-6" y="-29" width="12" height="4" fill="#222"/><text x="0" y="-26.2" font-size="2.4" text-anchor="middle" fill="#fff" font-family="'Comic Sans MS',cursive">Bund 4,50</text>`;
  S.teil({ id: "wm_blumenstand", de: "der Blumenstand", syl: "BLU-men-stand", it: "la bancarella dei fiori", itSyl: "ban-ca-REL-la dei FIO-ri", en: "flower stall", x: cx, y: yb, steht: true, kunst: k,
    zoom: { x: cx - 42, y: yb - 78, w: 84, h: 66 }, unter });
}
{
  /* DER BLUMENEIMER — Zinkeimer mit bunten Sträußen vorne */
  let k = schatten(0, .4, 9, 1.4, .3);
  k += `<path d="M-8 -14 L8 -14 L6.4 0 L-6.4 0 Z" fill="${ZINK}"/><rect x="-8.6" y="-14.8" width="17.2" height="1.6" rx=".6" fill="#c9cfd4"/><path d="M-6 -10 L6 -10" stroke="#8a939a" stroke-width=".4"/>`;
  for (let i = 0; i < 4; i++) {
    const x = -6 + i * 4;
    k += `<line x1="${x}" y1="-14" x2="${x - 1 + i * 0.6}" y2="-30" stroke="#3f7d2c" stroke-width=".6"/>`;
    k += `<path d="M${x - 1} -16 L${x - 4} -30 L${x + 4} -30 L${x + 1} -16 Z" fill="${["#f1e3c8", "#f6d6e0", "#d8ecd0", "#fff3c4"][i]}" stroke="#bba98a" stroke-width=".2"/>`;
    for (let q = 0; q < 5; q++) k += `<circle cx="${r(x - 2.6 + q * 1.3)}" cy="${r(-31 - (q % 2) * 1.6)}" r="1.4" fill="${["#e63946", "#ffffff", "#9b5de5", "#ffbe0b", "#ff70a6"][(q + i) % 5]}"/>`;
  }
  S.teil({ id: "wm_blumeneimer", de: "der Blumeneimer", syl: "BLU-men-ei-mer", it: "il secchio dei fiori", itSyl: "SEC-chio dei FIO-ri", en: "flower bucket", x: 18, y: 194, steht: true, kunst: k });
}

/* =====================================================================
   4 — DER KÄSEWAGEN (rechts) — Lupe
   ===================================================================== */
{
  const x0 = 254, x1 = 320, base = 160, cx = 286;
  let k = `<g transform="translate(${-cx} ${-base})">`;
  k += `<ellipse cx="${(x0 + x1) / 2}" cy="${base + 0.5}" rx="32" ry="2" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
  k += `<rect x="${x0}" y="68" width="${x1 - x0}" height="${base - 8 - 68}" rx="2" fill="${S.lg("wagen", [[0, "#ffffff"], [1, "#e0ddd6"]])}"/>`;
  /* hochgeklappte Seitenwand als Dach */
  k += `<path d="M${x0 - 6} 62 L${x1} 58 L${x1} 66 L${x0 - 4} 70 Z" fill="${S.lg("klappe", [[0, "#f4d35e"], [1, "#d9a920"]])}"/><text x="${x0 + 30}" y="66.4" font-size="4.4" fill="#7a3b00" font-family="Georgia,serif" font-weight="bold" font-style="italic" transform="rotate(-3 ${x0 + 30} 66)">Käse vom Hof</text>`;
  /* Innenraum: Regal mit Käselaiben */
  k += `<rect x="${x0 + 3}" y="72" width="${x1 - x0 - 3}" height="44" fill="${S.lg("winnen", [[0, "#fff8e4"], [1, "#e9dcbc"]])}"/>`;
  const laib = (x, y, w, h) => `<path d="M${x - w / 2} ${y} L${x - w / 2} ${y - h} Q${x} ${y - h - 2} ${x + w / 2} ${y - h} L${x + w / 2} ${y} Q${x} ${y + 1.6} ${x - w / 2} ${y} Z" fill="${S.lg("rinde", [[0, "#f2c14e"], [1, "#d39b2a"]], 0, 0, 1, 0)}"/><ellipse cx="${x}" cy="${y - h}" rx="${w / 2}" ry="1" fill="#f8d77a"/>`;
  for (const y of [86, 100]) {
    for (let i = 0; i < 6; i++) k += laib(x0 + 10 + i * 11, y, 10, 5 + (i % 2));
    k += `<rect x="${x0 + 3}" y="${y}" width="${x1 - x0 - 3}" height="1.4" fill="#9b6b3a"/>`;
  }
  /* Kühltheke mit Glas */
  k += `<rect x="${x0}" y="116" width="${x1 - x0}" height="26" fill="${S.lg("ktheke", [[0, "#f6f6f4"], [1, "#d6d8d8"]])}"/>`;
  k += `<rect x="${x0 + 3}" y="117" width="${x1 - x0 - 3}" height="13" fill="#fdfaf2"/>`;
  /* Emmentaler-Keil mit Löchern, Camembert, Stücke */
  k += `<path d="M${x0 + 6} 129 L${x0 + 24} 129 L${x0 + 24} 121 Z" fill="#f7dc8a"/><path d="M${x0 + 6} 129 L${x0 + 24} 121 L${x0 + 26} 122 L${x0 + 8} 130 Z" fill="#e2b44a"/>`;
  for (const [dx, dy, rr] of [[14, 127, 1], [19, 125.6, .8], [21, 127.6, .6], [17, 128.2, .5]]) k += `<circle cx="${x0 + dx}" cy="${dy}" r="${rr}" fill="#d9b25a"/>`;
  for (let i = 0; i < 2; i++) k += `<ellipse cx="${x0 + 36 + i * 10}" cy="128" rx="4.4" ry="1.6" fill="#fbfaf4" stroke="#d9d4c4" stroke-width=".2"/><rect x="${x0 + 31.6 + i * 10}" y="125" width="8.8" height="3" fill="#fbfaf4"/><ellipse cx="${x0 + 36 + i * 10}" cy="125" rx="4.4" ry="1.6" fill="#fffef9" stroke="#e2ddcd" stroke-width=".2"/>`;
  k += `<path d="M${x0 + 54} 129 L${x0 + 66} 129 L${x0 + 66} 123 L${x0 + 54} 125 Z" fill="#f2c14e"/><path d="M${x0 + 54} 125 L${x0 + 66} 123 L${x0 + 66} 122 L${x0 + 54} 124 Z" fill="#c98a2a"/>`;
  k += `<rect x="${x0 + 3}" y="116" width="${x1 - x0 - 3}" height="14" fill="${S.lg("kglas", [[0, "#ffffff", 0.35], [1, "#dff0f7", 0.1]])}" stroke="#b9c7cc" stroke-width=".4"/>`;
  k += `<rect x="${x0}" y="130" width="${x1 - x0}" height="2" fill="#bfc4c6"/><text x="${x0 + 22}" y="139" font-size="4" fill="#7a3b00" font-family="Georgia,serif" font-weight="bold">Käse</text>`;
  /* Fahrgestell und Räder */
  k += `<rect x="${x0}" y="${base - 10}" width="${x1 - x0}" height="3" fill="#4a4e52"/>`;
  for (const x of [x0 + 14, x0 + 54]) k += `<circle cx="${x}" cy="${base - 4}" r="4.4" fill="#222"/><circle cx="${x}" cy="${base - 4}" r="2" fill="#9aa3aa"/>`;
  k += `</g>`;
  const unter = [
    { id: "wm_kaeselaib", de: "der Käselaib", syl: "KÄ-se-laib", it: "la forma di formaggio", itSyl: "FOR-ma di for-MAG-gio", en: "cheese wheel", x: cx, y: 100, kunst: flaeche(-31, -27, 62, 28), tipp: "Ein großer Käselaib reift viele Monate." },
    { id: "wm_emmentaler", de: "der Emmentaler", syl: "EM-men-ta-ler", it: "l'emmental", itSyl: "EM-men-tal", en: "Emmental cheese", x: x0 + 15, y: 130, kunst: flaeche(-11, -12, 22, 12.6), tipp: "Der Emmentaler hat große Löcher." },
    { id: "wm_camembert", de: "der Camembert", syl: "CA-mem-bert", it: "il camembert", itSyl: "CA-mem-bert", en: "camembert", x: x0 + 41, y: 130, kunst: flaeche(-10, -12, 20, 12.6) },
  ];
  S.teil({ id: "wm_kaesewagen", de: "der Käsewagen", syl: "KÄ-se-wa-gen", it: "il furgone del formaggio", itSyl: "fur-GO-ne del for-MAG-gio", en: "cheese van", x: cx, y: base, steht: true, kunst: k,
    zoom: { x: x0 - 10, y: 58, w: 76, h: 78 }, unter });
}

/* =====================================================================
   5 — DER HÄNDLER (hinter dem Gemüsestand)
   ===================================================================== */
{
  const m = B.mensch({ id: "wm_haendler", geschlecht: "m", pose: "stehen", blick: -30, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", bart: "voll", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#7a2e2e" }, schuerze: { stueck: "schuerze", farbe: "gruen_d" }, unterteil: { stueck: "arbeitshose" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "muetze", farbe: "#3b4a5a" } } }, 74);
  S.teil({ id: "wm_haendler", de: "der Händler", syl: "HÄND-ler", it: "il venditore", itSyl: "ven-di-TO-re", en: "market trader", x: 120, y: 160, kunst: m.svg,
    tipp: "Der Händler ruft: „Frische Erdbeeren aus der Region!“" });
}

/* =====================================================================
   6 — DER MARKTSTAND (Obst und Gemüse) — Lupe mit den Steigen
   ===================================================================== */
const ST = { x0: 92, x1: 240, fuss: 168, vorn: 136, hinten: 116 };
{
  const cx = (ST.x0 + ST.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-ST.fuss})">`;
  k += `<ellipse cx="${cx}" cy="${ST.fuss + 0.6}" rx="${(ST.x1 - ST.x0) / 2 + 4}" ry="2.2" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
  /* Pfosten */
  for (const x of [ST.x0, ST.x1]) k += `<rect x="${x - 1.2}" y="48" width="2.4" height="${ST.fuss - 48}" fill="${STAHL}"/>`;
  /* Markise gestreift mit Wellenkante */
  k += `<path d="M${ST.x0 - 8} 52 L${ST.x0 + 4} 36 L${ST.x1 - 4} 36 L${ST.x1 + 8} 52 Z" fill="#ffffff"/>`;
  for (let i = 0; i < 14; i++) {
    const a = ST.x0 - 8 + i * ((ST.x1 - ST.x0 + 16) / 14), b = a + (ST.x1 - ST.x0 + 16) / 28, ta = ST.x0 + 4 + i * ((ST.x1 - ST.x0 - 8) / 14), tb = ta + (ST.x1 - ST.x0 - 8) / 28;
    k += `<path d="M${r(a)} 52 L${r(ta)} 36 L${r(tb)} 36 L${r(b)} 52 Z" fill="#2d7d46"/>`;
  }
  let welle = `M${ST.x0 - 8} 52`;
  const n = 14, sw = (ST.x1 - ST.x0 + 16) / n;
  for (let i = 0; i < n; i++) welle += ` Q${r(ST.x0 - 8 + (i + 0.5) * sw)} 60 ${r(ST.x0 - 8 + (i + 1) * sw)} 52`;
  k += `<path d="${welle} Z" fill="#2d7d46"/><path d="${welle}" stroke="#1f5a32" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${ST.x0 - 8} 52 L${ST.x1 + 8} 52" stroke="#fff" stroke-width=".6" opacity=".6"/>`;
  k += `<rect x="${cx - 26}" y="40" width="52" height="8" rx="1" fill="#fff" opacity=".9"/><text x="${cx}" y="46" font-size="4.6" text-anchor="middle" fill="#2d7d46" font-family="Georgia,serif" font-weight="bold">Obst &amp; Gemüse Krause</text>`;
  /* Tisch: Kunstrasen, schräge Auslage, Schürze bis zum Boden */
  k += `<path d="M${ST.x0} ${ST.vorn} L${ST.x1} ${ST.vorn} L${ST.x1 - 4} ${ST.hinten} L${ST.x0 + 4} ${ST.hinten} Z" fill="${S.lg("rasen", [[0, "#5aa43f"], [1, "#3f8a2c"]])}"/>`;
  k += `<rect x="${ST.x0}" y="${ST.vorn}" width="${ST.x1 - ST.x0}" height="${ST.fuss - ST.vorn - 2}" fill="${S.lg("plane", [[0, "#3f8a2c"], [1, "#2e6e20"]])}"/>`;
  for (let x = ST.x0 + 1; x < ST.x1; x += 1.6) k += `<line x1="${r(x)}" y1="${ST.vorn}" x2="${r(x + 0.4)}" y2="${ST.vorn + 3}" stroke="#6fbf52" stroke-width=".4"/>`;
  k += `<path d="M${ST.x0} ${ST.vorn + 3} ${Array.from({ length: 30 }, (_, i) => `L${r(ST.x0 + (i + 0.5) * (ST.x1 - ST.x0) / 30)} ${ST.fuss - 1 - (i % 2) * 1.6}`).join(" ")} L${ST.x1} ${ST.fuss - 2}" stroke="#2a5f1c" stroke-width=".3" fill="none" opacity=".5"/>`;
  /* Ablage links für Waage und Kasse (flach) */
  k += `<rect x="${ST.x0 + 2}" y="${ST.vorn - 2}" width="28" height="2" fill="${HOLZ}"/>`;
  /* Die Steigen in zwei Reihen auf der Schräge */
  const unter = [];
  const sx0 = ST.x0 + 32, sx1 = ST.x1 - 4, sw2 = (sx1 - sx0) / 4;
  const steige = (x, y, w, h) => `<path d="M${r(x - w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y)} L${r(x + w / 2 - 0.6)} ${r(y - h)} L${r(x - w / 2 + 0.6)} ${r(y - h)} Z" fill="${HOLZ}" stroke="#8a6232" stroke-width=".25"/><rect x="${r(x - w / 2)}" y="${r(y - h * 0.5)}" width="${r(w)}" height=".5" fill="#8a6232" opacity=".6"/>`;
  const kreide = (x, y, t) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 3}" stroke="#8a6232" stroke-width=".35"/><rect x="${x - 4.4}" y="${y - 6.6}" width="8.8" height="4" rx=".4" fill="#1f1f1f" stroke="#8a6232" stroke-width=".3"/><text x="${x}" y="${y - 3.8}" font-size="2" text-anchor="middle" fill="#fff" font-family="'Comic Sans MS',cursive">${t}</text>`;
  const haufen = (x, y, w, art) => {
    let g = "";
    if (art === "apfel" || art === "tomate" || art === "birne") {
      const f = { apfel: APFEL, tomate: TOMATE, birne: BIRNE }[art];
      for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) {
        const px = x - w / 2 + 3 + i * (w - 6) / 5 + (j % 2) * 1.4, py = y - 1.6 - j * 2.2 - Math.sin(i / 5 * Math.PI) * 1.2;
        if (art === "birne") g += `<path d="M${r(px)} ${r(py - 3.2)} Q${r(px + 1.6)} ${r(py - 1.6)} ${r(px + 1.7)} ${r(py)} Q${r(px)} ${r(py + 1.2)} ${r(px - 1.7)} ${r(py)} Q${r(px - 1.6)} ${r(py - 1.6)} ${r(px)} ${r(py - 3.2)} Z" fill="${f}"/>`;
        else g += `<circle cx="${r(px)}" cy="${r(py)}" r="1.8" fill="${f}"/>`;
        if (art === "tomate") g += `<path d="M${r(px - 0.8)} ${r(py - 1.6)} l.8 .5 .8 -.5" stroke="#2d7d1f" stroke-width=".4" fill="none"/>`;
        if (art === "apfel") g += `<line x1="${r(px)}" y1="${r(py - 1.7)}" x2="${r(px + 0.3)}" y2="${r(py - 2.4)}" stroke="#5a3a1f" stroke-width=".3"/>`;
      }
    } else if (art === "erdbeere") {
      for (let i = 0; i < 4; i++) { const px = x - w / 2 + 4.4 + i * (w - 8.8) / 3; g += `<rect x="${r(px - 3.4)}" y="${y - 5}" width="6.8" height="5" fill="#2b6cb0" opacity=".85"/>`; for (let q = 0; q < 6; q++) g += `<path d="M${r(px - 2.6 + (q % 3) * 2.2)} ${r(y - 5.4 - Math.floor(q / 3) * 1.2)} q.9 2.4 1.8 0 Z" fill="#e01e37"/>`; g += `<path d="M${r(px - 2.4)} ${y - 6.4} h4.8" stroke="#2d7d1f" stroke-width=".6"/>`; }
    } else if (art === "salat") {
      for (let i = 0; i < 4; i++) { const px = x - w / 2 + 4.6 + i * (w - 9.2) / 3; g += `<circle cx="${r(px)}" cy="${y - 3.2}" r="3.6" fill="${S.rg("salat", [[0, "#d4f29a"], [0.6, "#8fcf4f"], [1, "#4f9a2a"]], 0.4, 0.4, 0.7)}"/><path d="M${r(px - 2.4)} ${y - 3.6} q1.2 -2 2.4 0 q1.2 -2 2.4 0" stroke="#4f9a2a" stroke-width=".35" fill="none"/>`; }
    } else if (art === "gurke") {
      for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) g += `<rect x="${r(x - w / 2 + 2 + i * (w / 2 - 1) + j * 0.8)}" y="${r(y - 2.4 - j * 1.8)}" width="${r(w / 2 - 3)}" height="2.2" rx="1.1" fill="${S.lg("gurke", [[0, "#5aa43f"], [1, "#2f6e20"]])}"/>`;
    } else if (art === "paprika") {
      for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) { const px = x - w / 2 + 3 + i * (w - 6) / 5, py = y - 2 - j * 2.6; g += `<path d="M${r(px - 1.8)} ${r(py - 1.6)} Q${r(px - 2)} ${r(py + 1.6)} ${r(px)} ${r(py + 1.4)} Q${r(px + 2)} ${r(py + 1.6)} ${r(px + 1.8)} ${r(py - 1.6)} Q${r(px)} ${r(py - 2.4)} ${r(px - 1.8)} ${r(py - 1.6)} Z" fill="${["#e5381f", "#ffbe0b", "#3f8a2c"][(i + j) % 3]}"/><rect x="${r(px - 0.3)}" y="${r(py - 2.8)}" width=".6" height="1.2" fill="#2d6e1f"/>`; }
    } else if (art === "karotte") {
      for (let i = 0; i < 7; i++) { const px = x - w / 2 + 3 + i * (w - 6) / 6; g += `<path d="M${r(px - 1.6)} ${y - 1} L${r(px + 4.6)} ${y - 4.4} L${r(px - 0.6)} ${y - 2.6} Z" fill="#f77f00"/><path d="M${r(px - 1.4)} ${y - 1.6} l-1.4 -2.6 M${r(px - 1)} ${y - 1.8} l-.6 -2.8" stroke="#3f8a2c" stroke-width=".6"/>`; }
    }
    return g;
  };
  const reihen = [
    [ST.hinten + 6, 9, [["wm_salat", "der Salat", "Sa-LAT", "l'insalata", "in-sa-LA-ta", "lettuce", "salat", "1,20"], ["wm_gurke", "die Gurke", "GUR-ke", "il cetriolo", "ce-tri-O-lo", "cucumber", "gurke", "0,79"], ["wm_paprika", "die Paprika", "PA-pri-ka", "il peperone", "pe-pe-RO-ne", "pepper", "paprika", "3,49"], ["wm_karotte", "die Karotte", "Ka-ROT-te", "la carota", "ca-RO-ta", "carrot", "karotte", "1,49"]]],
    [ST.vorn - 1, 10, [["wm_apfel", "der Apfel", "AP-fel", "la mela", "ME-la", "apple", "apfel", "2,99"], ["wm_tomate", "die Tomate", "To-MA-te", "il pomodoro", "po-mo-DO-ro", "tomato", "tomate", "3,20"], ["wm_erdbeere", "die Erdbeere", "ERD-bee-re", "la fragola", "FRA-go-la", "strawberry", "erdbeere", "4,50"], ["wm_birne", "die Birne", "BIR-ne", "la pera", "PE-ra", "pear", "birne", "2,79"]]],
  ];
  const tipps = { wm_erdbeere: "Erdbeeren aus Deutschland gibt es von Mai bis Juli.", wm_karotte: "In Norddeutschland sagt man oft „Möhre“, im Süden „Gelbe Rübe“.", wm_apfel: "Äpfel kommen oft aus dem Alten Land bei Hamburg oder vom Bodensee." };
  reihen.forEach(([y, h, liste], ri) => {
    liste.forEach(([id, de, syl, it, itSyl, en, art, preis], i) => {
      const x = sx0 + sw2 * (i + 0.5) + (ri ? 0 : 1), w = sw2 - (ri ? 2 : 4);
      k += steige(x, y, w, h) + haufen(x, y - 0.6, w - 2, art);
      if (id !== "wm_apfel") k += kreide(x + w / 2 - 6, y - 1, preis + " €");
      unter.push({ id, de, syl, it, itSyl, en, tipp: tipps[id], x, y, kunst: flaeche(-w / 2, -h - 4, w, h + 4.4) });
    });
  });
  k += `</g>`;
  S.teil({ id: "wm_marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: cx, y: ST.fuss, steht: true, kunst: k,
    zoom: { x: sx0 - 6, y: ST.hinten - 10, w: sx1 - sx0 + 12, h: ST.vorn - ST.hinten + 14 }, unter });
}

/* ---------- auf dem Stand ---------- */
{
  /* DAS PREISSCHILD — großes Kreideschild in den Äpfeln */
  const x = 142, y = ST.vorn - 1;
  let k = `<rect x="-.4" y="-6" width=".8" height="6" fill="#8a6232"/><rect x="-8" y="-15" width="16" height="10" rx=".8" fill="#1f1f1f" stroke="#a87d48" stroke-width=".8"/>`;
  k += `<text x="0" y="-11" font-size="2.6" text-anchor="middle" fill="#fff" font-family="'Comic Sans MS',cursive">Äpfel Elstar</text><text x="0" y="-6.8" font-size="3.4" text-anchor="middle" fill="#ffd166" font-family="'Comic Sans MS',cursive">1 kg 2,99 €</text>`;
  S.teil({ oben: true, id: "wm_preisschild", de: "das Preisschild", syl: "PREIS-schild", it: "il cartellino del prezzo", itSyl: "car-tel-LI-no del PREZ-zo", en: "price tag", x, y, kunst: k });
}
{
  /* DIE WAAGE — geeichte Marktwaage mit Anzeige */
  let k = schatten(0, .2, 7, .7, .3);
  k += `<path d="M-7 0 L7 0 L6.4 -3 L-6.4 -3 Z" fill="#f2f2ee"/><path d="M-6 -3 L6 -3 L5.6 -4.4 L-5.6 -4.4 Z" fill="${STAHL}"/>`;
  k += `<rect x="-.8" y="-12" width="1.6" height="8" fill="#9aa3aa"/><rect x="-6" y="-17" width="12" height="6" rx=".8" fill="#2b2f33"/><rect x="-5.2" y="-16.2" width="10.4" height="4.4" rx=".4" fill="#10161a"/><text x="0" y="-13" font-size="2.6" text-anchor="middle" fill="#7cff8a" font-family="monospace">1,02</text>`;
  k += `<ellipse cx="0" cy="-5.6" rx="5" ry="1.4" fill="#f2f2ee" stroke="#c9c9c2" stroke-width=".2"/>`;
  for (const [dx, dy] of [[-2, -6.4], [0.4, -6.8], [2.4, -6.2], [-0.8, -8]]) k += `<circle cx="${dx}" cy="${dy}" r="1.5" fill="${APFEL}"/>`;
  S.teil({ oben: true, id: "wm_waage", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: 105, y: ST.vorn - 2, steht: true, kunst: k,
    tipp: "Obst und Gemüse wird auf dem Markt nach Gewicht verkauft." });
}
{
  /* DIE KASSE — Geldkassette */
  let k = schatten(0, .2, 5, .6, .3);
  k += `<path d="M-5 0 L5 0 L5 -4 L-5 -4 Z" fill="${S.lg("kass", [[0, "#5b6b7d"], [1, "#3b4652"]])}"/><path d="M-5 -4 L5 -4 L6.4 -8.4 L-3.6 -8.4 Z" fill="#6b7b8d"/>`;
  k += `<path d="M-4 -4.4 L4 -4.4 L5 -7.6 L-3 -7.6 Z" fill="#2b333b"/><ellipse cx="-1" cy="-5.6" rx="1.3" ry=".5" fill="#c9a227"/><ellipse cx="1.6" cy="-6" rx="1.1" ry=".45" fill="#c7c9cc"/><rect x="-2.4" y="-7.4" width="4" height="1.2" fill="#8fbf8f"/>`;
  k += `<rect x="-1" y="-2.6" width="2" height="1.2" rx=".3" fill="#c9cfd4"/>`;
  S.teil({ oben: true, id: "wm_geldkasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "cash box", x: 117, y: ST.vorn - 2, steht: true, kunst: k });
}
{
  /* DIE PAPIERTÜTE — Bündel am Haken am Pfosten */
  let k = `<path d="M0 0 q1.4 0 1.4 1.6" stroke="#555" stroke-width=".5" fill="none"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-3 + i * 0.6} ${1.6 + i * 0.3} L${4 + i * 0.6} ${1.6 + i * 0.3} L${3.4 + i * 0.6} ${13 + i * 0.3} L${-2.4 + i * 0.6} ${13 + i * 0.3} Z" fill="${i % 2 ? "#cfa06a" : "#ddb27c"}" stroke="#a87c48" stroke-width=".2"/>`;
  k += `<line x1="-2" y1="2.4" x2="5.6" y2="2.4" stroke="#555" stroke-width=".4"/>`;
  S.teil({ oben: true, id: "wm_papiertuete", de: "die Papiertüte", syl: "Pa-PIER-tü-te", it: "il sacchetto di carta", itSyl: "sac-CHET-to di CAR-ta", en: "paper bag", x: 236, y: 80, kunst: k,
    tipp: "Auf dem Markt bekommt man Obst in Papiertüten statt in Plastik." });
}
{
  /* DIE KISTE — leere Holzsteigen, gestapelt hinter dem Stand */
  let k = schatten(0, .4, 12, 1.2, .3);
  for (let i = 0; i < 4; i++) {
    const y = -i * 6.2, dx = (i % 2) * 1.2;
    k += `<rect x="${-10 + dx}" y="${y - 6}" width="20" height="6" fill="${HOLZ}" stroke="#8a6232" stroke-width=".3"/><rect x="${-10 + dx}" y="${y - 3.4}" width="20" height=".8" fill="#8a6232" opacity=".5"/><rect x="${-10 + dx}" y="${y - 6}" width="1.4" height="6" fill="#8a6232"/><rect x="${8.6 + dx}" y="${y - 6}" width="1.4" height="6" fill="#8a6232"/>`;
  }
  S.teil({ id: "wm_kiste", de: "die Kiste", syl: "KIS-te", it: "la cassetta", itSyl: "cas-SET-ta", en: "crate", x: 252, y: 170, steht: true, kunst: k });
}
{
  /* DIE GEMÜSEKISTE — Kiste mit Kartoffeln am Boden vor dem Stand */
  let k = schatten(0, .4, 15, 1.4, .3);
  k += `<path d="M-14 0 L14 0 L14 -10 L-14 -10 Z" fill="${HOLZ}" stroke="#8a6232" stroke-width=".3"/><rect x="-14" y="-6" width="28" height="1" fill="#8a6232" opacity=".55"/><rect x="-14" y="-10" width="2" height="10" fill="#8a6232"/><rect x="12" y="-10" width="2" height="10" fill="#8a6232"/>`;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 8; i++) k += `<ellipse cx="${r(-11.4 + i * 3.3 + (j % 2) * 1.4)}" cy="${r(-10.6 - j * 1.8 - Math.sin(i / 7 * Math.PI) * 1.4)}" rx="1.9" ry="1.4" fill="${KARTOFFEL}"/>`;
  k += `<rect x="-6" y="-24" width="12" height="7" rx=".6" fill="#1f1f1f" stroke="#a87d48" stroke-width=".5"/><line x1="0" y1="-17" x2="0" y2="-12" stroke="#8a6232" stroke-width=".4"/><text x="0" y="-21.4" font-size="2" text-anchor="middle" fill="#fff" font-family="'Comic Sans MS',cursive">Kartoffeln</text><text x="0" y="-18.4" font-size="2.2" text-anchor="middle" fill="#ffd166" font-family="'Comic Sans MS',cursive">5 kg 4,90</text>`;
  S.teil({ id: "wm_gemuesekiste", de: "die Gemüsekiste", syl: "Ge-MÜ-se-kis-te", it: "la cassetta di verdura", itSyl: "cas-SET-ta di ver-DU-ra", en: "vegetable crate", x: 196, y: 186, steht: true, kunst: k });
}

/* =====================================================================
   7 — DIE KUNDIN mit dem EINKAUFSKORB
   ===================================================================== */
{
  const m = B.mensch({ id: "wm_kundin", geschlecht: "w", pose: "stehen", blick: 55, frisur: "pony", haarfarbe: "rot", haut: "sehrhell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, jacke: { stueck: "jacke", farbe: "#6a7f4f" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 106);
  S.teil({ id: "wm_kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 84, y: 196, kunst: m.svg,
    tipp: "Die Kundin fragt: „Was kosten die Erdbeeren?“" });
  /* Korb an der Hand, die zum Betrachter hin unten hängt */
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => b.y - a.y)[0];
  const hx = hand.x * m.k, hy = hand.y * m.k;
  let k = `<path d="M-7 -1 Q0 -11 7 -1" stroke="#8a5c22" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M-9 0 L9 0 L7.4 11 Q0 12.6 -7.4 11 Z" fill="${S.lg("weide", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${-8 + i * 3.2}" y1="0" x2="${-6.6 + i * 2.6}" y2="11" stroke="#8a5c22" stroke-width=".4"/>`;
  for (const y of [3.6, 7.2]) k += `<line x1="-8.6" y1="${y}" x2="8.6" y2="${y}" stroke="#8a5c22" stroke-width=".4"/>`;
  k += `<rect x="-9.4" y="-.8" width="18.8" height="1.8" rx=".8" fill="#c99550"/>`;
  k += `<circle cx="-4" cy="-1.8" r="2" fill="${APFEL}"/><path d="M0 -1 L2.6 -6 L5 -1 Z" fill="#3f8a2c"/><rect x="-1.6" y="-3" width="4" height="2.4" fill="#2b6cb0"/>`;
  S.teil({ oben: true, id: "wm_einkaufskorb", de: "der Einkaufskorb", syl: "EIN-kaufs-korb", it: "il cesto della spesa", itSyl: "CE-sto del-la SPE-sa", en: "shopping basket", x: 84 + hx, y: 196 + hy + 3, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wochenmarkt.js"));
console.log(aus);
