#!/usr/bin/env node
/* =====================================================================
   TIERE AUS ALLER WELT (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   Ein Saal im NATURKUNDEMUSEUM: Lebensräume der Welt als DIORAMEN
   hinter Glas, Meerestiere als lebensgroße Modelle unter der Decke.

   RECHERCHE (Museum Koenig Bonn „Unser blauer Planet“ mit Savannen-
   Diorama, Senckenberg Frankfurt, Ozeaneum Stralsund „Riesen der Meere“
   mit Walmodellen unter der Decke, Naturkundemuseum Stuttgart
   Schloss Rosenstein):
   - Ein DIORAMA ist ein beleuchteter Glaskasten: hinten ein gemalter
     Horizont, davor echter Boden, Pflanzen und präparierte Tiere in
     ihrer natürlichen Haltung — an einem Ort, wo sie zusammen leben.
   - Typische Säle: AFRIKANISCHE SAVANNE mit Wasserloch (Elefant,
     Giraffe, Zebra, Nashorn, Löwe, Pavian, Flusspferd, Krokodil,
     Flamingo, Pelikan), REGENWALD (Tiger, Leopard, Schimpanse),
     WALD UND GEBIRGE der Nordhalbkugel (Bär, Wolf, Fuchs, Puma, Adler).
   - Wal, Hai und Delfin hängen als Modelle an Stahlseilen von der
     Decke; der Saal ist dunkel, die Dioramen leuchten.
   - Davor: Schilder mit dem Lebensraum, eine Bank, ein Pult mit der
     WELTKARTE (wo leben die Tiere?).
   Maßstab: Saalboden vorne ≈ 24 Einheiten je Meter (Kind 1,25 m);
   in den Dioramen je nach Tiefe 6–14 je Meter (Giraffe 5 m hinten,
   Löwe vorn). Die Tiere in den Dioramen sind Lupen-Teile.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const { tierBaukasten } = require("./zoo.js");
const r = B.r;

const S = neueSzene({ id: "tiere_welt", titel: "Tiere aus aller Welt", emoji: "🦁", thema: "Tiere", kuerzel: "b19d", fassung: 852 });
const rnd = zufall(1858);
const T = tierBaukasten(S);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const zahl = (x, st) => String(+(Math.round(+x / st) * st).toFixed(1)).replace(/^(-?)0\./, "$1.");
const schlank = (svg) => svg.replace(/ d="([^"]*)"/g, (a, d) => ` d="${d.replace(/-?\d*\.?\d+/g, (x) => zahl(x, 1)).replace(/\s*,\s*/g, " ").replace(/\s*([A-Za-z])\s*/g, "$1").replace(/ -/g, "-")}"`)
  .replace(/ (c[xy]|x[12]?|y[12]?|width|height)="(-?[\d.]+)"/g, (a, n, v) => ` ${n}="${zahl(v, 0.5)}"`)
  .replace(/ (r[xy]?)="(-?[\d.]+)"/g, (a, n, v) => ` ${n}="${zahl(v, 0.1)}"`);
const tr = (x, y, inner) => `<g transform="translate(${r(x)} ${r(y)})">${inner}</g>`;
/* FASSUNG 883 — XANDER (Funk 302): „schaue auch was du mit den anderen Tieren machst dass sie wirklich realistisch
   sind“. Wo die Tier-Bibliothek (werkzeug/bilderwelt/tiere, wie „Tiere der Savanne“) eine Art hat und sie HIER im
   Diorama klar besser aussieht, kommt das Tier aus der Bibliothek (tierKunst, Szenen-Modus ohne Filter, eigener
   Boden- und Kontaktschatten). Maßstab: genau M(y) des Dioramas an den Füßen (keine Vergrößerung wie früher beim
   Pavian/Schimpansen). Die Fangfläche in der Lupe (BOX) folgt dem echten Umriss der Art. */
const { tierKunst } = require("../tiere/szene.js");
/* Je Tier vorher/nachher im echten Ausschnitt verglichen (Telefonbreite und dreifach groß), dazu ein Blindvergleich
   A/B. Aus der Bibliothek: Giraffe, Elefant, Nashorn, Löwe (steht jetzt), Krokodil, Bär (Braunbär). Elefant 3 Einheiten
   nach rechts und Nashorn 6 nach links, damit Nashorn- und Nilpferdkopf frei bleiben. Baukasten bleibt: Pavian (in
   echter Größe auf dem Termitenhügel zu klein, um klar besser zu sein), Schimpanse (sitzend besser zu erkennen),
   Nilpferd (im Wasserloch liest sich der Baukasten-Kopf besser; das längere Bibliotheks-Nilpferd verdeckte die
   Flamingos), Tiger, Leopard (siehe Zoo II), Zebra (das alte, Funk 302), Flamingo, Pelikan, Puma, Wolf, Fuchs, Adler. */
const AUS_BIB = new Set(["giraffe", "elefant", "nashorn", "loewe", "krokodil", "baer"]);
const BOX = {};
/* bt: Art an (x, y) zeichnen; die Fangfläche gilt relativ zum Lupen-Teil an (ax, ay) */
const bt = (teilId, art, x, y, epm, o = {}, ax = x, ay = y) => {
  const t = tierKunst(S, art, x, y, epm, o), [a, b, c, d] = t.box;
  BOX[teilId] = [r(a + x - ax), r(b + y - ay), r(c - a), r(d - b)];
  return tr(x, y, t.kunst);
};

/* =====================================================================
   KULISSE: dunkler Saal, Decke mit Strahlern, Steinboden
   ===================================================================== */
const WAND_U = 150;
S.hinten(`<rect width="320" height="200" fill="${S.lg("saal", [[0, "#1f252c"], [0.5, "#2c333b"], [1, "#363c43"]])}"/>`);
{
  let g = `<rect x="0" y="0" width="320" height="8" fill="#15191e"/>`;
  for (let x = 10; x < 320; x += 30) g += `<rect x="${x}" y="0" width="1" height="8" fill="#2a3038"/>`;
  for (const x of [40, 120, 200, 280]) g += `<rect x="${x - 3}" y="7" width="6" height="2.4" rx=".6" fill="#3a4048"/><ellipse cx="${x}" cy="9.4" rx="2" ry=".8" fill="#fff6dc"/>`;
  /* Steinboden mit Spiegelung */
  g += `<rect x="0" y="${WAND_U}" width="320" height="${200 - WAND_U}" fill="${S.lg("boden", [[0, "#4a4844"], [1, "#6a655d"]])}"/>`;
  for (let i = -8; i <= 8; i++) g += `<line x1="${160 + i * 22}" y1="${WAND_U}" x2="${160 + i * 48}" y2="200" stroke="#3a3834" stroke-width=".4" opacity=".7"/>`;
  for (const y of [WAND_U + 6, WAND_U + 14, WAND_U + 25, WAND_U + 40]) g += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#3a3834" stroke-width=".4" opacity=".7"/>`;
  for (const [x, w] of [[86, 150], [204, 62], [281, 66]]) g += `<rect x="${r(x - w / 2)}" y="${WAND_U + 1}" width="${w}" height="18" fill="${S.lg("spieg", [[0, "#ffe9b8", 0.18], [1, "#ffe9b8", 0]])}"/>`;
  g += `<rect x="0" y="${WAND_U - 2}" width="320" height="2.4" fill="#191c20"/>`;
  S.hinten(g);
}

/* Diorama-Rahmen (dunkles Holz, Lichtkante) und Schild */
const rahmen = (x0, y0, x1, y1, titel, unter) => {
  let g = `<rect x="${x0 - 3}" y="${y0 - 3}" width="${x1 - x0 + 6}" height="${y1 - y0 + 6}" rx="1" fill="${S.lg("rahmen", [[0, "#2a2420"], [1, "#16120f"]])}"/>`;
  g += `<rect x="${x0 - 3}" y="${y1 + 3}" width="${x1 - x0 + 6}" height="${WAND_U - y1 - 5}" fill="#1b1f24"/>`;
  g += `<rect x="${(x0 + x1) / 2 - 22}" y="${y1 + 6}" width="44" height="7" rx=".6" fill="#e9e3d2"/>`;
  g += `<text x="${(x0 + x1) / 2}" y="${y1 + 9.4}" font-size="2.8" text-anchor="middle" fill="#2a2a2a" font-family="Arial" font-weight="bold">${titel}</text>`;
  g += `<text x="${(x0 + x1) / 2}" y="${y1 + 12.2}" font-size="1.9" text-anchor="middle" fill="#555" font-family="Arial">${unter}</text>`;
  return g;
};
const glas = (x0, y0, x1, y1) => `<g pointer-events="none"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("glas", [[0, "#ffffff", 0.12], [0.45, "#ffffff", 0.02], [1, "#cfe6f0", 0.08]], 0, 0, 1, 1)}"/>` +
  `<path d="M${x0 + 8} ${y1} L${x0 + 26} ${y0} L${x0 + 32} ${y0} L${x0 + 14} ${y1} Z" fill="#fff" opacity=".07"/><path d="M${x1 - 30} ${y1} L${x1 - 18} ${y0} L${x1 - 15} ${y0} L${x1 - 27} ${y1} Z" fill="#fff" opacity=".06"/></g>`;
/* Licht von oben im Diorama */
const licht = (x0, y0, x1, y1) => `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("dlicht", [[0, "#fff4d6", 0.28], [0.3, "#fff4d6", 0], [1, "#000", 0.12]])}"/>`;
const tier = (id, de, syl, it, itSyl, en, x, y, box, tipp) => { const u = { id, de, syl, it, itSyl, en, x, y, kunst: flaeche(box[0], box[1], box[2], box[3]) }; if (tipp) u.tipp = tipp; return u; };

/* =====================================================================
   1 — DIE SAVANNE (Afrika) mit Wasserloch
   ===================================================================== */
const D1 = { x0: 6, y0: 62, x1: 166, y1: 140 };
{
  const { x0, y0, x1, y1 } = D1;
  let k = rahmen(x0, y0, x1, y1, "AFRIKA · Savanne", "Ostafrika, Trockenzeit");
  const k0 = k.length, cid = S.id("dclip" + x0);
  S.def(`<clipPath id="${cid}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`);
  /* gemalter Hintergrund: Himmel, Kilimandscharo, Akazien */
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("d1himmel", [[0, "#9cc4dc"], [0.55, "#f2dcae"], [1, "#e7c88e"]])}"/>`;
  k += `<path d="M${x0 + 40} 106 L${x0 + 66} 86 Q${x0 + 72} 82 ${x0 + 78} 86 L${x0 + 108} 106 Z" fill="#8b8aa0" opacity=".7"/><path d="M${x0 + 62} 89 L${x0 + 66} 86 Q${x0 + 72} 82 ${x0 + 78} 86 L${x0 + 82} 89 Q${x0 + 72} 88 ${x0 + 62} 89 Z" fill="#f4f4f6"/>`;
  k += `<path d="M${x0} 106 Q${x0 + 50} 102 ${x0 + 90} 105 T${x1} 104 L${x1} ${y1} L${x0} ${y1} Z" fill="${S.lg("d1boden", [[0, "#c9b071"], [0.4, "#c2a462"], [1, "#a58546"]])}"/>`;
  for (const [x, y, s] of [[x0 + 20, 104, 0.6], [x0 + 118, 103, 0.8], [x0 + 146, 105, 0.5]]) k += `<path d="M${x} ${y} v${-8 * s} M${x - 9 * s} ${y - 8 * s} Q${x} ${y - 12 * s} ${x + 9 * s} ${y - 8 * s} Z" stroke="#5b4630" stroke-width="${0.8 * s}" fill="#6f8a44"/>`;
  for (let i = 0; i < 60; i++) { const x = x0 + rnd() * (x1 - x0), y = 106 + rnd() * 34, h = 0.6 + (y - 104) * 0.05; k += `<path d="M${r(x)} ${r(y)} l${r(-0.4 * h)} ${r(-h)} M${r(x)} ${r(y)} l${r(0.3 * h)} ${r(-1.1 * h)}" stroke="#8f7a3a" stroke-width=".3"/>`; }
  /* Wasserloch vorne rechts, Termitenhügel */
  k += `<path d="M${x1 - 66} 136 Q${x1 - 62} 124 ${x1 - 36} 123 Q${x1 - 4} 123 ${x1} 128 L${x1} ${y1} L${x1 - 62} ${y1} Z" fill="${S.lg("d1wasser", [[0, "#7f9f9a"], [1, "#4f746e"]])}"/>`;
  k += `<path d="M${x1 - 66} 136 Q${x1 - 62} 124 ${x1 - 36} 123 Q${x1 - 4} 123 ${x1} 128" stroke="#8a6f44" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M${x0 + 124} 110 Q${x0 + 128} 94 ${x0 + 132} 92 Q${x0 + 136} 96 ${x0 + 138} 110 Z" fill="${S.lg("termite", [[0, "#c08a52"], [1, "#8a5a30"]])}"/>`;
  /* Tiere: hinten zuerst */
  const M1 = (y) => 6 + (y - 106) * 0.24;
  k += AUS_BIB.has("giraffe") ? bt("giraffe", "giraffe", x0 + 24, 112, M1(112), { dir: 1 }) : tr(x0 + 24, 112, schatten(0, 0, 7, 0.8, 0.25) + T.giraffe(M1(112)));
  k += tr(x0 + 100, 110, schatten(0, 0, 5, 0.6, 0.25) + T.zebra(M1(110), -1)) + tr(x0 + 110, 112, schatten(0, 0, 5, 0.6, 0.25) + T.zebra(M1(112), -1));
  k += tr(x0 + 131, 96, T.affe(M1(110) * 1.3, -1));
  k += AUS_BIB.has("elefant") ? bt("elefant", "elefant", x0 + 65, 118, M1(118), { dir: -1 }, x0 + 62) : tr(x0 + 62, 118, schatten(0, 0, 13, 1.2, 0.25) + T.elefant(M1(118), -1));
  k += tr(x1 - 14, 125.6, T.flamingo(M1(126))) + tr(x1 - 6, 126.4, T.flamingo(M1(126), -1, true));
  k += AUS_BIB.has("nashorn") ? bt("nashorn", "nashorn", x0 + 86, 128, M1(128), { dir: 1 }, x0 + 92) : tr(x0 + 92, 128, schatten(0, 0, 14, 1.2, 0.3) + T.nashorn(M1(128)));
  k += tr(x1 - 22, 133, T.nilpferd(M1(133), -1, 8.4));
  k += AUS_BIB.has("loewe") ? bt("loewe", "loewe", x0 + 32, 137, M1(137), { dir: 1 }) : tr(x0 + 32, 137, schatten(0, 0, 13, 1, 0.3) + T.katze("loewe", M1(137), 1, "liegen"));
  k += tr(x1 - 10, 138.6, T.pelikan(M1(138)));
  /* Krokodil: ein 3,6-m-Tier (0,8 × die 4,5 m der Bibliothek – ein ausgewachsenes Nilkrokodil, nicht das größte) */
  k += AUS_BIB.has("krokodil") ? bt("krokodil", "krokodil", x1 - 64, 139.6, M1(139) * 0.8, { dir: 1 }) : tr(x1 - 64, 139.6, T.krokodil(M1(139) * 0.8, 1));
  k = k.slice(0, k0) + `<g clip-path="url(#${cid})">` + k.slice(k0) + licht(x0, y0, x1, y1) + `</g>`;
  const u = [
    tier("giraffe", "die Giraffe", "Gi-RAF-fe", "la giraffa", "gi-RAF-fa", "giraffe", x0 + 24, 112, BOX.giraffe || [-8, -36, 22, 37], "Afrika. Mit fünf Metern das höchste Tier der Erde."),
    tier("zebra", "das Zebra", "ZE-bra", "la zebra", "ZE-bra", "zebra", x0 + 104, 112, [-9, -13, 22, 13]),
    tier("affe", "der Affe", "AF-fe", "la scimmia", "SCIM-mia", "monkey", x0 + 131, 96, [-4, -9, 9, 9], "Ein Pavian auf dem Termitenhügel — Affen haben einen Schwanz, Menschenaffen nicht."),
    tier("elefant", "der Elefant", "E-le-FANT", "l'elefante", "e-le-FAN-te", "elephant", x0 + 62, 118, BOX.elefant || [-15, -30, 32, 30], "Der Afrikanische Elefant ist das größte Landtier."),
    tier("flamingo", "der Flamingo", "Fla-MIN-go", "il fenicottero", "fe-ni-COT-te-ro", "flamingo", x1 - 10, 126, [-6, -13, 12, 13]),
    tier("nashorn", "das Nashorn", "NAS-horn", "il rinoceronte", "ri-no-ce-RON-te", "rhinoceros", x0 + 92, 128, BOX.nashorn || [-14, -14, 32, 14]),
    tier("nilpferd", "das Nilpferd", "NIL-pferd", "l'ippopotamo", "ip-po-PO-ta-mo", "hippopotamus", x1 - 22, 133, [-25, -21, 45, 11]),   // 883: Fangfläche auf das sichtbare Nilpferd über dem Wasser (vorher lag sie im Wasser darunter)
    tier("loewe", "der Löwe", "LÖ-we", "il leone", "le-O-ne", "lion", x0 + 32, 137, BOX.loewe || [-16, -12, 30, 12]),
    tier("pelikan", "der Pelikan", "PE-li-kan", "il pellicano", "pel-li-CA-no", "pelican", x1 - 10, 138.6, [-6, -12, 13, 12]),
    tier("krokodil", "das Krokodil", "Kro-ko-DIL", "il coccodrillo", "coc-co-DRIL-lo", "crocodile", x1 - 64, 139.6, BOX.krokodil || [-20, -5, 32, 5.6])
  ];
  S.teil({ id: "savanne", de: "die Savanne", syl: "sa-VAN-ne", it: "la savana", itSyl: "sa-VA-na", en: "savanna", x: 0, y: 0, kunst: k,
    zoom: { x: x0 - 2, y: y0 - 14, w: x1 - x0 + 4, h: 109 }, unter: u,
    tipp: "Die Savanne: weites Grasland mit wenigen Bäumen. Am Wasserloch treffen sich die Tiere." });
  S.davor(glas(x0, y0, x1, y1));
}

/* =====================================================================
   2 — DER REGENWALD (Asien und Afrika)
   ===================================================================== */
const D2 = { x0: 174, y0: 62, x1: 240, y1: 140 };
{
  const { x0, y0, x1, y1 } = D2;
  let k = rahmen(x0, y0, x1, y1, "REGENWALD", "Asien und Afrika");
  const k0 = k.length, cid = S.id("dclip" + x0);
  S.def(`<clipPath id="${cid}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`);
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("d2grund", [[0, "#8fb38a"], [0.5, "#4f7a4a"], [1, "#2f4f30"]])}"/>`;
  for (let i = 0; i < 7; i++) { const x = x0 + 4 + i * 10 + rnd() * 4; k += `<rect x="${r(x)}" y="${y0}" width="${r(1.6 + rnd() * 2)}" height="${y1 - y0}" fill="#3e5a3a" opacity=".55"/>`; }
  for (let i = 0; i < 40; i++) { const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * 70; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(3 + rnd() * 5)}" ry="${r(1.6 + rnd() * 2)}" fill="${rnd() < 0.5 ? "#5f8a4a" : "#3f6a3a"}" opacity=".75" transform="rotate(${Math.round(rnd() * 60 - 30)} ${r(x)} ${r(y)})"/>`; }
  /* Lianen, Ast, Boden mit Farnen */
  k += `<path d="M${x0 + 10} ${y0} Q${x0 + 16} 90 ${x0 + 12} 120 M${x1 - 12} ${y0} Q${x1 - 20} 84 ${x1 - 14} 110" stroke="#5a4a2a" stroke-width=".8" fill="none"/>`;
  k += `<path d="M${x0} 104 Q${x0 + 30} 99 ${x1 - 10} 103" stroke="#5a4232" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${x0} 124 Q${x0 + 33} 118 ${x1} 123 L${x1} ${y1} L${x0} ${y1} Z" fill="${S.lg("d2boden", [[0, "#5a5a34"], [1, "#3a3a20"]])}"/>`;
  for (let i = 0; i < 10; i++) { const x = x0 + 4 + rnd() * (x1 - x0 - 8); k += `<path d="M${r(x)} ${y1} q-4 -6 -8 -7 M${r(x)} ${y1} q3 -7 7 -8 M${r(x)} ${y1} q0 -6 1 -10" stroke="#4f8a3a" stroke-width="1" fill="none"/>`; }
  k += `<path d="M${x0 + 2} 130 L${x0 + 22} 128" stroke="#5a4232" stroke-width="3.4" stroke-linecap="round"/>`;
  const M2 = (y) => 6 + (y - 100) * 0.2;
  k += tr(x0 + 30, 103, T.katze("leopard", M2(103) * 1.4, -1, "liegen"));
  k += tr(x0 + 13, 128.6, T.schimpanse(M2(128) * 1.25));
  k += tr(x0 + 40, 138, schatten(0, 0, 13, 1, 0.3) + T.katze("tiger", M2(138), -1));
  k = k.slice(0, k0) + `<g clip-path="url(#${cid})">` + k.slice(k0) + licht(x0, y0, x1, y1) + `</g>`;
  const u = [
    tier("leopard", "der Leopard", "Leo-PARD", "il leopardo", "leo-PAR-do", "leopard", x0 + 30, 103, [-14, -9, 26, 9], "Der Leopard lebt in Afrika und Asien und ruht gern auf einem Ast."),
    tier("schimpanse", "der Schimpanse", "Schim-PAN-se", "lo scimpanzé", "scim-pan-ZÉ", "chimpanzee", x0 + 12, 128.6, [-4, -12, 9, 12], "Afrika. Der Schimpanse ist unser nächster Verwandter."),
    tier("tiger", "der Tiger", "TI-ger", "la tigre", "TI-gre", "tiger", x0 + 40, 138, [-16, -12, 32, 12], "Asien. Die größte Katze der Welt.")
  ];
  S.teil({ id: "regenwald", de: "der Regenwald", syl: "RE-gen-wald", it: "la foresta pluviale", itSyl: "fo-RE-sta plu-VIA-le", en: "rainforest", x: 0, y: 0, kunst: k,
    zoom: { x: 152, y: 61, w: 110, h: 80 }, unter: u,
    tipp: "Im Regenwald ist es warm und nass — hier leben mehr Tierarten als irgendwo sonst." });
  S.davor(glas(x0, y0, x1, y1));
}

/* =====================================================================
   3 — DAS GEBIRGE (Wald und Berge: Nordamerika, Europa, Asien)
   ===================================================================== */
const D3 = { x0: 248, y0: 62, x1: 314, y1: 140 };
{
  const { x0, y0, x1, y1 } = D3;
  let k = rahmen(x0, y0, x1, y1, "WALD UND GEBIRGE", "Nordamerika und Europa");
  const k0 = k.length, cid = S.id("dclip" + x0);
  S.def(`<clipPath id="${cid}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`);
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("d3himmel", [[0, "#a9c6dc"], [1, "#e6eef0"]])}"/>`;
  k += `<path d="M${x0} 100 L${x0 + 18} 76 L${x0 + 30} 88 L${x0 + 44} 70 L${x1} 96 L${x1} 112 L${x0} 112 Z" fill="#8a96a6"/><path d="M${x0 + 14} 81 L${x0 + 18} 76 L${x0 + 22} 80 Z M${x0 + 40} 75 L${x0 + 44} 70 L${x0 + 49} 75 Z" fill="#f4f6f8"/>`;
  for (let i = 0; i < 12; i++) { const x = x0 + 2 + i * 5.6 + rnd() * 2, y = 112 + rnd() * 3, h = 10 + rnd() * 6; k += `<path d="M${r(x)} ${r(y - h)} L${r(x - h * 0.28)} ${r(y)} L${r(x + h * 0.28)} ${r(y)} Z" fill="${rnd() < 0.5 ? "#2f4a3a" : "#3a5a44"}"/>`; }
  k += `<path d="M${x0} 116 Q${x0 + 30} 112 ${x1} 117 L${x1} ${y1} L${x0} ${y1} Z" fill="${S.lg("d3boden", [[0, "#7a7a4a"], [1, "#5a5434"]])}"/>`;
  /* Felsen mit Adlerhorst-Spitze, Felsblock für den Puma */
  k += `<path d="M${x0} 112 L${x0 + 4} 96 L${x0 + 10} 90 L${x0 + 16} 94 L${x0 + 20} 112 Z" fill="${S.lg("d3fels", [[0, "#a49a8a"], [1, "#6e665a"]])}"/>`;
  k += `<path d="M${x1 - 26} 124 Q${x1 - 22} 112 ${x1 - 12} 111 Q${x1 - 2} 112 ${x1} 118 L${x1} 124 Z" fill="${S.lg("d3fels", [[0, "#a49a8a"], [1, "#6e665a"]])}"/>`;
  for (let i = 0; i < 30; i++) { const x = x0 + rnd() * (x1 - x0), y = 118 + rnd() * 22; k += `<path d="M${r(x)} ${r(y)} l-.4 -1.4 M${r(x)} ${r(y)} l.4 -1.5" stroke="#5a6a30" stroke-width=".3"/>`; }
  const M3 = (y) => 6 + (y - 100) * 0.22;
  k += tr(x0 + 10, 90.4, T.adler(M3(100) * 1.2));
  k += tr(x1 - 12, 112, T.katze("puma", M3(112), -1));
  k += tr(x0 + 40, 125, schatten(0, 0, 8, 0.8, 0.25) + T.hund("wolf", M3(125), -1));
  k += tr(x1 - 10, 134, schatten(0, 0, 5, 0.6, 0.25) + T.hund("fuchs", M3(134), -1));
  k += AUS_BIB.has("baer") ? bt("baer", "braunbaer", x0 + 16, 139, M3(139), { dir: 1 }) : tr(x0 + 16, 139, schatten(0, 0, 12, 1, 0.3) + T.baer(M3(139)));
  k = k.slice(0, k0) + `<g clip-path="url(#${cid})">` + k.slice(k0) + licht(x0, y0, x1, y1) + `</g>`;
  const u = [
    tier("adler", "der Adler", "AD-ler", "l'aquila", "A-qui-la", "eagle", x0 + 10, 90.4, [-4, -8, 8, 9], "Der Steinadler brütet hoch oben in den Felsen."),
    tier("puma", "der Puma", "PU-ma", "il puma", "PU-ma", "puma", x1 - 12, 112, [-10, -8, 19, 8], "Amerika. Der Puma lebt von Kanada bis Südamerika."),
    tier("wolf", "der Wolf", "WOLF", "il lupo", "LU-po", "wolf", x0 + 40, 125, [-11, -9, 21, 9], "Wölfe leben im Rudel — auch wieder in Deutschland."),
    tier("fuchs", "der Fuchs", "FUCHS", "la volpe", "VOL-pe", "fox", x1 - 10, 134, [-7, -6, 13, 6], "Der Rotfuchs lebt fast auf der ganzen Nordhalbkugel."),
    tier("baer", "der Bär", "BÄR", "l'orso", "OR-so", "bear", x0 + 16, 139, BOX.baer || [-14, -12, 28, 12], "Der Braunbär lebt in Nordamerika, Europa und Asien.")
  ];
  S.teil({ id: "gebirge", de: "das Gebirge", syl: "ge-BIR-ge", it: "la montagna", itSyl: "mon-TA-gna", en: "mountains", x: 0, y: 0, kunst: k,
    zoom: { x: 210, y: 61, w: 110, h: 80 }, unter: u,
    tipp: "Wald und Gebirge im Norden: kalte Winter, Nadelbäume, Felsen." });
  S.davor(glas(x0, y0, x1, y1));
}

/* =====================================================================
   MODELLE UNTER DER DECKE: Wal, Hai, Delfin (an Stahlseilen)
   ===================================================================== */
const seile = (pts, top = 0) => pts.map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${top}" stroke="#9aa3aa" stroke-width=".25"/>`).join("");
S.teil({ id: "wal", de: "der Wal", syl: "WAL", it: "la balena", itSyl: "ba-LE-na", en: "whale", x: 176, y: 30,
  kunst: seile([[-60, -10], [10, -13], [56, -7]], -30) + T.wal(11.4, -1),
  tipp: "Das Modell eines Buckelwals in echter Größe: vierzehn Meter. Wale sind Säugetiere." });
S.teil({ id: "hai", de: "der Hai", syl: "HAI", it: "lo squalo", itSyl: "SQUA-lo", en: "shark", x: 50, y: 46,
  kunst: seile([[-14, -4], [14, -4]], -46) + T.hai(7.4),
  tipp: "Ein Weißer Hai — ein Fisch mit Kiemen. Er lebt in allen Meeren." });
S.teil({ id: "delfin", de: "der Delfin", syl: "Del-FIN", it: "il delfino", itSyl: "del-FI-no", en: "dolphin", x: 290, y: 46,
  kunst: seile([[-6, -3], [6, -3.6]], -46) + T.delfin(8, -1, 8),
  tipp: "Der Delfin atmet Luft wie der Wal — er ist kein Fisch." });

/* =====================================================================
   IM SAAL: Weltkarte am Pult, Bank, Kind
   ===================================================================== */
{
  /* DIE WELTKARTE auf einem schrägen Pult — wo leben die Tiere? */
  let k = schatten(0, 0, 20, 1.6, 0.4);
  k += `<path d="M-2 0 L-2 -16 L2 -16 L2 0 Z" fill="#2a2f35"/><rect x="-10" y="-1" width="20" height="1.4" rx=".5" fill="#2a2f35"/>`;
  k += `<path d="M-22 -16 L22 -16 L19 -30 L-19 -30 Z" fill="#20252a"/><path d="M-20.6 -16.8 L20.6 -16.8 L17.8 -29.2 L-17.8 -29.2 Z" fill="${S.lg("karte", [[0, "#7fb0cf"], [1, "#5f94b8"]])}"/>`;
  /* Kontinente (vereinfacht, schräg gesehen) */
  const kont = [
    ["M-15 -27 Q-11 -29 -7 -27.6 Q-8 -25 -10 -24 Q-12 -22.4 -11 -21.4 Q-13 -22 -14 -24 Z", "#c9b06a"],   /* Nordamerika */
    ["M-10 -21 Q-8 -21 -7.6 -19.4 Q-8 -17.6 -9.6 -17.2 Q-10.4 -19 -10 -21 Z", "#a9c46a"],               /* Südamerika */
    ["M-2 -27.6 Q1 -28.6 3 -27.4 Q2 -26 0 -25.8 Q-2 -26 -2 -27.6 Z", "#b9c88a"],                         /* Europa */
    ["M-1.6 -25 Q2 -25.4 3.4 -23.6 Q3 -20 1 -17.8 Q-.6 -19.6 -1.2 -21.4 Q-2.4 -23 -1.6 -25 Z", "#d9b45a"], /* Afrika */
    ["M3.4 -28 Q10 -29.6 15 -27.6 Q14 -25 11 -24 Q8 -23 6 -24.4 Q4 -25.4 3.4 -28 Z", "#c9c27a"],          /* Asien */
    ["M10.6 -20.4 Q13.6 -21 14.6 -19.4 Q13 -18 11 -18.4 Z", "#d9a45a"]                                  /* Australien */
  ];
  for (const [d, c] of kont) k += `<path d="${d}" fill="${c}"/>`;
  /* kleine Tierbilder auf der Karte */
  for (const [x, y, c] of [[-12, -25, "#7a5a3a"], [1, -21.6, "#d4741f"], [9, -26, "#c08a3a"], [-9, -19.6, "#2f2a26"], [12.6, -19.6, "#b07a4a"]]) k += `<circle cx="${x}" cy="${y}" r=".7" fill="${c}" stroke="#fff" stroke-width=".2"/>`;
  k += `<text x="0" y="-30.6" font-size="1.9" text-anchor="middle" fill="#e9e3d2" font-family="Arial" font-weight="bold">WO LEBEN DIE TIERE?</text>`;
  S.teil({ id: "weltkarte", de: "die Weltkarte", syl: "WELT-kar-te", it: "la mappa del mondo", itSyl: "MAP-pa del MON-do", en: "world map", x: 56, y: 186, kunst: k,
    tipp: "Auf der Weltkarte sieht man, auf welchem Kontinent jedes Tier lebt." });
}
{
  /* DIE BANK — Museumsbank aus Holz */
  let k = schatten(0, 0, 24, 1.6, 0.4);
  k += `<path d="M-22 -11 L22 -11 L22 -8.6 L-22 -8.6 Z" fill="${S.lg("bank", [[0, "#a77444"], [1, "#6e4a28"]])}"/>`;
  k += `<path d="M-22 -8.6 L22 -8.6 L21 -7.6 L-21 -7.6 Z" fill="#4a3018"/>`;
  for (const x of [-18, 16]) k += `<rect x="${x}" y="-8" width="2.4" height="8" fill="#2a2f35"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: 238, y: 184, kunst: k });
}
S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: 150, y: 194,
  kunst: schatten(0, 0, 6, 1, 0.4) + schlank(B.mensch({ id: "b19d_kind", alter: "kind", geschlecht: "m", pose: "zeigen", blick: -140, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#3c7a9a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#d9a441" } } }, 30).svg),
  tipp: "Das Kind zeigt auf die Savanne: „Schau mal, ein Elefant!“" });

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tiere_welt.js"));
console.log(aus);
