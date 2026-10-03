#!/usr/bin/env node
/* =====================================================================
   DAS BUCH (FASSUNG 852) — Bilderwelt neu, Detail-Szene
   (geöffnet über die Lupe aus „kinderzimmer“ und „schulsachen“)
   ---------------------------------------------------------------------
   RECHERCHE (Buchgestaltung/Typografie: Aufbau einer Buchseite):
   - Ein gebundenes Buch hat Buchdeckel (Pappe, mit Leinen bezogen) und
     den Buchrücken; auf dem Rücken stehen Autor und Titel (in
     Deutschland von unten nach oben lesbar).
   - Auf dem vorderen Deckel stehen Titel und Autor.
   - Innen: Seiten mit Satzspiegel; ein neues Kapitel beginnt oft auf
     einer rechten Seite mit Kapitelüberschrift und großem
     Anfangsbuchstaben (Initiale); Text im Blocksatz, Absätze mit
     Einzug; Seitenzahl unten außen; links ein Kolumnentitel;
     Abbildungen mit Bildunterschrift; ein Leseband als Lesezeichen.
   Szene: Schreibtisch von schräg oben. Vorn ein aufgeschlagenes Buch
   (S. 24/25, Kapitel 3), rechts ein zweites, geschlossenes Buch, davor
   eine Lesebrille. Alle Titel und Namen sind ausgedacht.
   Maßstab ≈ 4,8 Einheiten je Zentimeter (Seite ≈ 22 × 31 cm).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "buch_detail", titel: "Das Buch", emoji: "📖", thema: "Bildung", kuerzel: "b27f", fassung: 852 });
const rnd = zufall(2706);
const r = B.r;
const A = (cx, cy, svg) => `<g transform="translate(${-cx} ${-cy})">${svg}</g>`;
/* Trefferfläche, die wirklich gemalt ist (fast durchsichtig): für Textblöcke */
const kasten = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fffdf6" fill-opacity=".02"/>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w2")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>`);
const PAPIER_L = S.lg("papierl", [[0, "#f3ecdb"], [0.12, "#fbf6ea"], [0.8, "#f8f2e3"], [0.94, "#e6dcc6"], [1, "#c9bc9f"]], 0, 0, 1, 0);
const PAPIER_R = S.lg("papierr", [[0, "#c9bc9f"], [0.06, "#e6dcc6"], [0.2, "#f8f2e3"], [0.88, "#fbf6ea"], [1, "#f3ecdb"]], 0, 0, 1, 0);
const LEINEN = S.lg("leinen", [[0, "#8a2a36"], [1, "#5e1822"]]);
const SERIF = "Georgia,'Times New Roman',serif";

/* =====================================================================
   0 — DER SCHREIBTISCH (Nussbaum) mit warmem Lampenlicht
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="200" fill="${S.lg("nuss", [[0, "#5a3a24"], [0.5, "#6e4a2e"], [1, "#4e3220"]])}"/>`;
  for (let i = 0; i < 70; i++) {
    const y = rnd() * 200, x = rnd() * 220, w = Math.min(40 + rnd() * 100, 320 - x);
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r((rnd() - 0.5) * 3)} ${r(w)} 0" stroke="${rnd() < 0.5 ? "#3e2616" : "#8a6040"}" stroke-width="${r(0.3 + rnd() * 0.5)}" opacity=".4" fill="none"/>`;
  }
  k += `<rect x="0" y="0" width="320" height="200" fill="${S.rg("lampe", [[0, "#ffe3a8", 0.28], [1, "#ffe3a8", 0]], 0.35, 0.3, 0.7)}"/>`;
  S.teil({ id: "schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: 300, y: 196, kunst: A(300, 196, k) });
}

/* =====================================================================
   1 — DER BUCHDECKEL: Leinendeckel des offenen Buches und Vorderdeckel
       des geschlossenen Buches rechts
   ===================================================================== */
const ZU = { x: 252, y: 34, w: 60, h: 92, rot: -7 };          /* geschlossenes Buch */
const ZU_T = `rotate(${ZU.rot} ${ZU.x + ZU.w / 2} ${ZU.y + ZU.h / 2})`;
{
  let k = schatten(130, 192, 112, 6, 0.45);
  k += `<path d="M17 27 C50 23 100 22 128 30 C156 22 206 23 239 27 L241 189 C206 187 156 187 128 193 C100 187 50 187 15 189 Z" fill="${LEINEN}"/>`;
  k += `<path d="M17 27 C50 23 100 22 128 30 C156 22 206 23 239 27" stroke="#b04a56" stroke-width=".6" fill="none"/>`;
  /* geschlossenes Buch: Schatten, Vorderdeckel mit Rahmen und Bild */
  k += `<g transform="${ZU_T}">`;
  k += schatten(ZU.x + ZU.w / 2 - 2, ZU.y + ZU.h + 6, ZU.w * 0.62, 5, 0.5);
  k += `<rect x="${ZU.x}" y="${ZU.y + ZU.h - 1}" width="${ZU.w}" height="5.6" fill="#2a3a5a"/>`;
  k += `<rect x="${ZU.x}" y="${ZU.y}" width="${ZU.w}" height="${ZU.h}" rx="1.4" fill="${S.lg("blau", [[0, "#3b5a8a"], [1, "#24395e"]], 0, 0, 1, 1)}"/>`;
  k += `<rect x="${ZU.x + 3}" y="${ZU.y + 3}" width="${ZU.w - 6}" height="${ZU.h - 6}" rx=".8" fill="none" stroke="#d9b762" stroke-width=".5"/>`;
  /* Bild auf dem Deckel: Insel im Nebel */
  const bx = ZU.x + 10, by = ZU.y + 36;
  k += `<rect x="${bx}" y="${by}" width="40" height="28" fill="${S.lg("nebel", [[0, "#c9d6e2"], [1, "#7f97b2"]])}"/>`;
  k += `<path d="M${bx} ${by + 20} Q${bx + 10} ${by + 6} ${bx + 20} ${by + 12} Q${bx + 28} ${by + 4} ${bx + 40} ${by + 18} L${bx + 40} ${by + 28} L${bx} ${by + 28} Z" fill="#3e5a50"/>`;
  k += `<rect x="${bx}" y="${by + 21}" width="40" height="7" fill="#5f7f9a"/><rect x="${bx}" y="${by + 16}" width="40" height="6" fill="#fff" opacity=".3"/>`;
  k += `<rect x="${bx}" y="${by}" width="40" height="28" fill="none" stroke="#d9b762" stroke-width=".5"/>`;
  k += `<path d="M${ZU.x + 2} ${ZU.y + 6} L${ZU.x + 18} ${ZU.y + 2} L${ZU.x + 4} ${ZU.y + 40} Z" fill="#fff" opacity=".06"/>`;
  k += `</g>`;
  S.teil({ id: "buchdeckel", de: "der Buchdeckel", syl: "BUCH-de-ckel", it: "la copertina", itSyl: "co-per-TI-na", en: "book cover", x: 282, y: 80, kunst: A(282, 80, k),
    tipp: "Der Buchdeckel ist aus fester Pappe und schützt die Seiten." });
}

/* =====================================================================
   2 — DIE SEITE (offenes Buch, S. 24/25) mit dem übrigen Text
   ===================================================================== */
const LINKS = `M22 31 C50 27 100 26 126 34 L128 188 C100 182 50 181 20 184 Z`;
const RECHTS = `M234 31 C206 27 156 26 130 34 L128 188 C156 182 206 181 236 184 Z`;
const zeile = (x, y, txt, w, extra = "") => `<text x="${x}" y="${y}" font-size="3.3" fill="#2c2620" font-family="${SERIF}"${w ? ` textLength="${w}" lengthAdjust="spacing"` : ""}${extra}>${txt}</text>`;
const BL = (i) => r(79.4 + i * 4.8);       /* Grundlinien rechts */
{
  let k = "";
  /* Buchblock: Seitenkanten unten */
  k += `<path d="M20 184 C50 181 100 182 128 188 L128 191.4 C100 185.4 50 184.6 17 187.4 Z" fill="#efe6d0"/><path d="M236 184 C206 181 156 182 128 188 L128 191.4 C156 185.4 206 184.6 239 187.4 Z" fill="#efe6d0"/>`;
  for (let i = 1; i < 4; i++) k += `<path d="M${20 - i * 0.8} ${184 + i * 0.85} C50 ${181 + i * 0.85} 100 ${182 + i * 0.85} 128 ${188 + i * 0.85} C156 ${182 + i * 0.85} 206 ${181 + i * 0.85} ${236 + i * 0.8} ${184 + i * 0.85}" stroke="#cfc3a6" stroke-width=".25" fill="none"/>`;
  k += `<path d="${LINKS}" fill="${PAPIER_L}"/><path d="${RECHTS}" fill="${PAPIER_R}"/>`;
  k += `<path d="M126 34 L128 188 L130 34" stroke="#a8987a" stroke-width=".5" fill="none"/>`;
  /* Kolumnentitel links */
  k += `<text x="75" y="40" font-size="2.8" text-anchor="middle" fill="#6a5e4e" font-family="${SERIF}" font-style="italic">Der Sommer am See</text>`;
  k += `<line x1="34" y1="42" x2="116" y2="42" stroke="#b8ab92" stroke-width=".25"/>`;
  /* Bildunterschrift */
  k += `<text x="76" y="143" font-size="2.9" text-anchor="middle" fill="#4a4036" font-family="${SERIF}" font-style="italic">Abb. 3: Der Steg am Morgen</text>`;
  /* Text auf der linken Seite unter dem Bild */
  ["Am Abend war der See ganz still. Nur die", "Grillen zirpten im hohen Gras, und weit", "draußen sprang ein Fisch aus dem Wasser."].forEach((t, i) => { k += zeile(33, 152 + i * 4.8, t, i < 2 ? 85 : 0); });
  /* rechte Seite: zweiter und dritter Absatz (die markierte Zeile malt „die Zeile“) */
  const rest = [
    [6, 144, "Am anderen Ufer lag ein weißes Segelboot.", 82],
    [7, 140, "Ein Mann winkte herüber, und Mia winkte", 86],
    [8, 140, "zurück. „Komm doch mit!“, rief er. Mia", 86],
    [10, 140, "den Steg zurück und holte ihre Schuhe.", 0],
    [11, 144, "Das Boot hieß „Möwe“ und war schon alt.", 82],
    [12, 140, "Die Segel waren geflickt, aber sie hielten.", 86],
    [13, 140, "Der Mann hieß Herr Jansen. Er wohnte seit", 86],
    [14, 140, "vierzig Jahren am See und kannte jede Bucht,", 86],
    [15, 140, "jede Insel und jeden Vogel am Ufer.", 0],
    [16, 144, "„Weißt du, wie man ein Segel setzt?“,", 82],
    [17, 140, "fragte er. Mia schüttelte den Kopf. „Dann", 86],
    [18, 140, "lernst du es heute“, sagte er und lachte.", 0],
  ];
  for (const [i, x, t, w] of rest) k += zeile(x, BL(i), t, w);
  /* leichte Wölbung der Seiten: Licht oben, Schatten zur Mitte */
  k += `<path d="M24 34 C50 30 90 29.6 110 32" stroke="#fff" stroke-width="2" opacity=".5" fill="none" filter="url(#bw_weich)"/>`;
  S.teil({ id: "seite", de: "die Seite", syl: "SEI-te", it: "la pagina", itSyl: "PA-gi-na", en: "page", x: 190, y: 150, kunst: A(190, 150, k) });
}
{
  /* DAS BILD: Aquarell vom Steg am See */
  const x = 34, y = 47, w = 84, h = 86;
  let k = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${S.lg("himmel", [[0, "#f3d9a8"], [0.45, "#cfe0e8"], [1, "#a9c7d6"]])}"/>`;
  k += `<circle cx="${x + 62}" cy="${y + 22}" r="7" fill="#fff4c8" opacity=".9"/>`;
  k += `<path d="M${x} ${y + 44} Q${x + 16} ${y + 32} ${x + 30} ${y + 40} Q${x + 48} ${y + 28} ${x + 64} ${y + 38} Q${x + 76} ${y + 33} ${x + w} ${y + 40} L${x + w} ${y + 48} L${x} ${y + 48} Z" fill="#6f8f6a" opacity=".85"/>`;
  k += `<rect x="${x}" y="${y + 47}" width="${w}" height="${h - 47}" fill="${S.lg("see", [[0, "#8fb4c6"], [1, "#4f7f98"]])}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(x + 4 + rnd() * 70)} ${r(y + 52 + rnd() * 30)} h${r(6 + rnd() * 10)}" stroke="#d9ecf3" stroke-width=".5" opacity=".7"/>`;
  /* Steg in Fluchtperspektive */
  k += `<path d="M${x + 30} ${y + 52} L${x + 38} ${y + 52} L${x + 58} ${y + h} L${x + 14} ${y + h} Z" fill="#a8774a"/>`;
  for (let i = 0; i < 8; i++) { const t = i / 8, yy = y + 52 + t * t * (h - 52); k += `<line x1="${r(x + 30 - t * 16)}" y1="${r(yy)}" x2="${r(x + 38 + t * 20)}" y2="${r(yy)}" stroke="#6e4a2a" stroke-width="${r(0.3 + t * 0.5)}"/>`; }
  for (const px of [[x + 16, y + 80], [x + 56, y + 80], [x + 26, y + 60], [x + 41, y + 60]]) k += `<rect x="${px[0] - 0.7}" y="${px[1]}" width="1.4" height="5" fill="#5a3a20"/>`;
  /* Segelboot */
  k += `<path d="M${x + 62} ${y + 50} L${x + 74} ${y + 50} L${x + 72} ${y + 52.6} L${x + 64} ${y + 52.6} Z" fill="#fff"/><path d="M${x + 68} ${y + 49.6} L${x + 68} ${y + 34} L${x + 75} ${y + 49} Z" fill="#fffdf6"/><path d="M${x + 67} ${y + 36} L${x + 62.6} ${y + 49} L${x + 67} ${y + 49} Z" fill="#f1ece0"/>`;
  k += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${S.rg("papierkorn", [[0, "#fff", 0], [1, "#fff6e0", 0.35]])}"/>`;
  k += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#8a7a60" stroke-width=".4"/>`;
  S.teil({ id: "bild", de: "das Bild", syl: "BILD", it: "l'immagine", itSyl: "im-MA-gi-ne", en: "picture", x: x + w / 2, y: y + h / 2, kunst: A(x + w / 2, y + h / 2, k),
    tipp: "Unter dem Bild steht die Bildunterschrift." });
}
{
  const k = kasten(26, 172, 10, 7) + `<text x="31" y="177.4" font-size="3.4" text-anchor="middle" fill="#3a3028" font-family="${SERIF}">24</text>`
    + kasten(220, 172, 10, 7) + `<text x="225" y="177.4" font-size="3.4" text-anchor="middle" fill="#3a3028" font-family="${SERIF}">25</text>`;
  S.teil({ id: "seitenzahl", de: "die Seitenzahl", syl: "SEI-ten-zahl", it: "il numero di pagina", itSyl: "NU-me-ro di PA-gi-na", en: "page number", x: 225, y: 175, kunst: A(225, 175, k),
    tipp: "Die Seitenzahl steht meist unten außen. Rechts stehen die ungeraden Zahlen." });
}
{
  let k = kasten(146, 43, 74, 26);
  k += `<text x="183" y="50" font-size="3" text-anchor="middle" fill="#8a2a36" font-family="${SERIF}" letter-spacing="1.2">KAPITEL 3</text>`;
  k += `<text x="183" y="61" font-size="7" text-anchor="middle" fill="#2c2620" font-family="${SERIF}" font-style="italic">Am See</text>`;
  k += `<path d="M168 65.6 H180 M186 65.6 H198" stroke="#8a2a36" stroke-width=".35"/><path d="M183 63.8 l1.6 1.8 -1.6 1.8 -1.6 -1.8 Z" fill="#8a2a36"/>`;
  S.teil({ id: "kapitel", de: "das Kapitel", syl: "ka-PI-tel", it: "il capitolo", itSyl: "ca-PI-to-lo", en: "chapter", x: 183, y: 56, kunst: A(183, 56, k),
    tipp: "Ein neues Kapitel beginnt oft auf einer neuen Seite." });
}
{
  let k = kasten(139, 74.4, 89, 30.6);
  const p1 = [[0, 154.4, "s war der heißeste Tag des Sommers.", 71.6], [1, 154.4, "Mia lief barfuß über die warmen Bretter", 71.6], [2, 154.4, "des Stegs bis ganz nach vorn. Dort setzte", 71.6],
    [3, 140, "sie sich hin und ließ die Füße ins Wasser hängen.", 86], [4, 140, "Das Wasser war klar und kühl. Kleine Fische", 86], [5, 140, "schwammen zwischen den Steinen hin und her.", 0]];
  for (const [i, x, t, w] of p1) k += zeile(x, BL(i), t, w);
  S.teil({ id: "absatz", de: "der Absatz", syl: "AB-satz", it: "il paragrafo", itSyl: "pa-RA-gra-fo", en: "paragraph", x: 183, y: 90, kunst: A(183, 90, k),
    tipp: "Ein neuer Absatz beginnt in einer neuen Zeile, oft etwas eingerückt." });
}
{
  let k = kasten(139.6, 75.6, 13.6, 14.6);
  k += `<text x="140" y="${BL(2)}" font-size="15.4" fill="#8a2a36" font-family="${SERIF}" font-weight="bold">E</text>`;
  S.teil({ id: "buchstabe", de: "der Buchstabe", syl: "BUCH-sta-be", it: "la lettera", itSyl: "LET-te-ra", en: "letter", x: 146, y: 83, kunst: A(146, 83, k),
    tipp: "Der große Anfangsbuchstabe heißt Initiale." });
}
{
  let k = `<path d="M139 ${BL(9) - 3.4} q22 -.6 44 0 t44.6 .2 l.2 4.4 q-22 .5 -44.6 0 t-44.2 .1 Z" fill="#f7e15a" opacity=".6"/>`;
  k += zeile(140, BL(9), "überlegte nicht lange. Sie sprang auf, lief", 86);
  S.teil({ id: "zeile", de: "die Zeile", syl: "ZEI-le", it: "la riga", itSyl: "RI-ga", en: "line", x: 183, y: BL(9) - 1, kunst: A(183, BL(9) - 1, k),
    tipp: "Diese Zeile hat jemand mit dem Textmarker gelb markiert." });
}
{
  /* DAS LESEZEICHEN: rotes Leseband, liegt in der Mitte und hängt unten heraus */
  const k = `<path d="M130.4 33 C130.8 80 130.6 140 131.6 187 C132 192 136 194.6 140 196 C146 198 150 196.4 152 199.6 L148 201 C146 199 141 199.4 137.6 198 C132.6 196 129.6 192 129.2 187 C128.4 140 128.6 80 128.6 33 Z" fill="${S.lg("band", [[0, "#b3202c"], [0.5, "#e04a54"], [1, "#9a1a24"]], 0, 0, 1, 0)}"/>`
    + `<path d="M129.6 36 L130 186" stroke="#ff9aa0" stroke-width=".35" opacity=".7"/>`;
  S.teil({ id: "lesezeichen", de: "das Lesezeichen", syl: "LE-se-zei-chen", it: "il segnalibro", itSyl: "se-gna-LI-bro", en: "bookmark", x: 131, y: 120, kunst: A(131, 120, k),
    tipp: "Mit dem Lesezeichen findet man die Seite wieder." });
}

/* =====================================================================
   3 — DAS GESCHLOSSENE BUCH: Buchrücken, Titel, Autor
   ===================================================================== */
{
  let k = `<g transform="${ZU_T}">`;
  k += `<path d="M${ZU.x - 6} ${ZU.y + 2} Q${ZU.x - 7} ${ZU.y + ZU.h / 2} ${ZU.x - 6} ${ZU.y + ZU.h + 2} L${ZU.x + 0.6} ${ZU.y + ZU.h + 4.6} L${ZU.x + 0.6} ${ZU.y} Z" fill="${S.lg("ruecken", [[0, "#182842"], [0.5, "#2f4a74"], [1, "#22385c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${ZU.x - 6} ${ZU.y + 8} L${ZU.x + 0.4} ${ZU.y + 7.4} M${ZU.x - 6.3} ${ZU.y + ZU.h - 6} L${ZU.x + 0.4} ${ZU.y + ZU.h - 5.4}" stroke="#d9b762" stroke-width=".4"/>`;
  k += `<text transform="translate(${ZU.x - 1.8} ${ZU.y + ZU.h - 10}) rotate(-90)" font-size="3" fill="#e9cf8a" font-family="${SERIF}" letter-spacing=".3">Brandt · Die Insel im Nebel</text>`;
  k += `</g>`;
  S.teil({ id: "buchruecken", de: "der Buchrücken", syl: "BUCH-rü-cken", it: "il dorso del libro", itSyl: "DOR-so del LI-bro", en: "spine", x: 248, y: 82, kunst: A(248, 82, k),
    tipp: "Im Regal sieht man vom Buch nur den Buchrücken." });
}
{
  let k = `<g transform="${ZU_T}">` + kasten(ZU.x + 5, ZU.y + 8, ZU.w - 10, 22);
  k += `<text x="${ZU.x + ZU.w / 2}" y="${ZU.y + 17}" font-size="6.6" text-anchor="middle" fill="#f2dc9a" font-family="${SERIF}" font-weight="bold">Die Insel</text>`;
  k += `<text x="${ZU.x + ZU.w / 2}" y="${ZU.y + 26}" font-size="6.6" text-anchor="middle" fill="#f2dc9a" font-family="${SERIF}" font-weight="bold">im Nebel</text></g>`;
  S.teil({ id: "titel", de: "der Titel", syl: "TI-tel", it: "il titolo", itSyl: "TI-to-lo", en: "title", x: 283, y: 52, kunst: A(283, 52, k) });
}
{
  let k = `<g transform="${ZU_T}">` + kasten(ZU.x + 8, ZU.y + 68, ZU.w - 16, 12);
  k += `<text x="${ZU.x + ZU.w / 2}" y="${ZU.y + 74}" font-size="2.6" text-anchor="middle" fill="#d9c79a" font-family="${SERIF}" letter-spacing=".6">ROMAN</text>`;
  k += `<text x="${ZU.x + ZU.w / 2}" y="${ZU.y + 79.4}" font-size="4.2" text-anchor="middle" fill="#ffffff" font-family="${SERIF}" font-style="italic">Jonas Brandt</text></g>`;
  S.teil({ id: "autor", de: "der Autor", syl: "AU-tor", it: "l'autore", itSyl: "au-TO-re", en: "author", x: 287, y: 111, kunst: A(287, 111, k),
    tipp: "Der Autor hat das Buch geschrieben." });
}

/* =====================================================================
   4 — DIE BRILLE (Lesebrille, zusammengeklappt)
   ===================================================================== */
{
  const cx = 280, cy = 166;
  let k = schatten(cx + 2, cy + 10, 30, 4, 0.45);
  const RAHMEN = S.lg("schildpatt", [[0, "#5a3218"], [0.5, "#8a5428"], [1, "#3e220e"]], 0, 0, 1, 1);
  /* Bügel, eingeklappt hinter den Gläsern */
  k += `<path d="M${cx - 26} ${cy - 4} L${cx + 22} ${cy - 1.6}" stroke="#4a2a14" stroke-width="1.4" stroke-linecap="round"/><path d="M${cx - 24} ${cy - 0.6} L${cx + 24} ${cy + 1.6}" stroke="#4a2a14" stroke-width="1.4" stroke-linecap="round"/>`;
  for (const dx of [-14, 14]) {
    k += `<ellipse cx="${cx + dx}" cy="${cy}" rx="12" ry="8.4" fill="${S.lg("glas" + (dx > 0 ? "r" : "l"), [[0, "#ffffff", 0.35], [0.5, "#dbe8ee", 0.12], [1, "#ffffff", 0.3]], 0, 0, 1, 1)}" stroke="${RAHMEN}" stroke-width="2"/>`;
    k += `<path d="M${cx + dx - 7} ${cy - 4} Q${cx + dx - 3} ${cy - 6.4} ${cx + dx + 2} ${cy - 5.6}" stroke="#fff" stroke-width=".9" opacity=".75" fill="none"/>`;
  }
  k += `<path d="M${cx - 2.6} ${cy - 3} Q${cx} ${cy - 6} ${cx + 2.6} ${cy - 3}" stroke="${RAHMEN}" stroke-width="1.8" fill="none"/>`;
  S.teil({ id: "brille", de: "die Brille", syl: "BRIL-le", it: "gli occhiali", itSyl: "oc-CHIA-li", en: "glasses", x: cx, y: cy, kunst: A(cx, cy, k) });
}

/* Lampenlicht von links oben (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="200" fill="${S.lg("licht", [[0, "#fff4dc", 0.08], [0.6, "#fff4dc", 0], [1, "#120a04", 0.12]], 0, 0, 1, 0.5)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/buch_detail.js"));
console.log(aus);
