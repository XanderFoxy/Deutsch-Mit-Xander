#!/usr/bin/env node
/* =====================================================================
   DAS MUSEUM (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Museumsbau des 19. Jh.: der „Lichthof“ als zentrale Halle mit
   Glasdach, z. B. LWL-Museum Münster, Museum für Naturkunde Berlin,
   Abguss-Sammlung; Ausstellungsgestaltung und Barrierefreiheit DHM):
   - Viele deutsche Museen haben in der Mitte einen LICHTHOF: eine hohe
     Halle mit GLASDACH, ringsum eine GALERIE mit GELÄNDER im Obergeschoss.
     Von dort gehen die Säle ab — jeder mit einem Namensschild über dem
     Durchgang (Rittersaal, Saurierhalle, Antikensammlung, Barocksaal …).
     Durch die Öffnungen sieht man die Glanzstücke der Säle: Ritterrüstung,
     Saurierskelett, römische Büste, Barockgemälde in „Petersburger
     Hängung“, ein Stück der Berliner Mauer, die Namenswand des Gedenkraums.
   - Im Lichthof selbst: Skulptur auf einem SOCKEL mit Objektschild, davor
     eine ABSPERRKORDEL an Messingpfosten mit „Bitte nicht berühren“;
     eine HAUBENVITRINE (Glashaube auf Podest) mit Kleinfunden, jedes
     Stück mit Nummer; ein GEMÄLDE mit Schild; eine INFOTAFEL (Raumtext)
     mit Lageplan; STRAHLER an der Stromschiene; ÜBERWACHUNGSKAMERA.
   - Die AUFSICHT trägt dunkle Kleidung und steht am Rand des Saals; die
     Besucherin sitzt auf der lederbezogenen BANK und hört den AUDIOGUIDE
     mit Kopfhörern; die EINTRITTSKARTE liegt neben ihr.
   Maßstab: Augenhöhe y = 97, Brennweite 260 → Einheiten je Meter =
   (y_Boden − 97) / 1,6. Rückwand (20 m entfernt) ≈ 13 je Meter,
   Vordergrund (y 178) ≈ 51 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "museum", titel: "Das Museum", emoji: "🏛️", thema: "Freizeit", kuerzel: "b13a", fassung: 852 });
const rnd = zufall(1871);
const r = B.r;

const HOR = 97, F = 260;
const proM = (y) => (y - HOR) / 1.6;              /* Einheiten je Meter am Boden y */
const bodenY = (d) => HOR + 1.6 * F / d;          /* Bodenlinie in d Metern */
const WAND_U = 118;                               /* Fuß der Rückwand (d = 20 m) */
const DECKE_O = 62, DECKE_U = 68;                 /* Galerieboden (Gesims) */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("marmor")}" x="-10%" y="-10%" width="120%" height="120%"><feColorMatrix type="matrix" values=".33 .45 .16 0 .2  .33 .45 .16 0 .19  .33 .45 .16 0 .17  0 0 0 1 0"/></filter>`);
const WAND = S.lg("wand", [[0, "#f4f1ea"], [0.6, "#ebe6dc"], [1, "#ddd6c8"]]);
const WAND_O = S.lg("wando", [[0, "#efe9dd"], [1, "#e3dccd"]]);
const STEIN = S.lg("stein", [[0, "#cfc6b4"], [1, "#b9ae98"]]);
const MESSING = S.lg("messing", [[0, "#f3dc8c"], [0.45, "#c9a13f"], [0.6, "#a8822a"], [1, "#e6c66a"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#f7e39a"], [0.4, "#d4a93c"], [0.7, "#a8791e"], [1, "#e8c45c"]], 0, 0, 1, 1);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const KNOCHEN = S.lg("knochen", [[0, "#efe3c6"], [1, "#c7b48c"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.34], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.2]], 0, 0, 1, 1);
const SAMT = S.lg("samt", [[0, "#b3202c"], [0.5, "#8a1420"], [1, "#5e0c15"]]);

/* =====================================================================
   KULISSE — Lichthof: Glasdach, Obergeschoss, Gesims, Erdgeschoss, Boden
   ===================================================================== */
/* Obergeschoss-Wand (hinter der Galerie) */
S.hinten(`<rect x="0" y="0" width="320" height="${DECKE_O}" fill="${WAND_O}"/>`);
/* Licht von oben (Glasdach) */
S.hinten(`<rect x="0" y="0" width="320" height="120" fill="${S.lg("oblicht", [[0, "#fffdf4", 0.55], [0.5, "#fffdf4", 0.1], [1, "#fffdf4", 0]])}"/>`);
/* Pilaster im Obergeschoss zwischen den Sälen */
for (const x of [14, 111, 209, 306]) S.hinten(`<rect x="${x - 5}" y="14" width="10" height="${DECKE_O - 14}" fill="#e7e0d1"/><rect x="${x - 5}" y="14" width="1.2" height="${DECKE_O - 14}" fill="#fff" opacity=".6"/><rect x="${x + 3.8}" y="14" width="1.2" height="${DECKE_O - 14}" fill="#c9bfab" opacity=".7"/><rect x="${x - 6.5}" y="14" width="13" height="3" fill="#d9d0bf"/>`);
/* Gesims = Galerieboden (Kante) mit Profil */
S.hinten(`<rect x="0" y="${DECKE_O}" width="320" height="${DECKE_U - DECKE_O}" fill="${S.lg("gesims", [[0, "#f6f2ea"], [0.5, "#e2dacb"], [1, "#c9bfac"]])}"/><rect x="0" y="${DECKE_U - 0.8}" width="320" height="1.2" fill="#a99e88" opacity=".7"/>`);
/* Erdgeschoss-Wand */
S.hinten(`<rect x="0" y="${DECKE_U}" width="320" height="${WAND_U - DECKE_U}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="${DECKE_U}" width="320" height="10" fill="${S.lg("gesimsschatten", [[0, "#6b5d45", 0.22], [1, "#6b5d45", 0]])}"/>`);
{
  let p = "";
  for (let i = 0; i < 160; i++) { const x = rnd() * 320, y = DECKE_U + rnd() * (WAND_U - DECKE_U); p += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.25 + rnd() * 0.4)}" fill="${rnd() < 0.5 ? "#d8cfbd" : "#fffaf0"}" opacity=".45"/>`; }
  for (const x of [6, 82, 238, 314]) p += `<rect x="${x - 3.5}" y="${DECKE_U}" width="7" height="${WAND_U - DECKE_U}" fill="#e9e3d6"/><rect x="${x + 2.6}" y="${DECKE_U}" width=".9" height="${WAND_U - DECKE_U}" fill="#c7bda9" opacity=".7"/>`;
  S.hinten(p);
}
/* Sockelleiste */
S.hinten(`<rect x="0" y="${WAND_U - 2.6}" width="320" height="2.6" fill="#8d8270"/><rect x="0" y="${WAND_U - 2.6}" width="320" height=".5" fill="#b3a891"/>`);
/* Steinboden (Solnhofener Platten) in Flucht */
{
  let f = `<rect x="0" y="${WAND_U}" width="320" height="${200 - WAND_U}" fill="${S.lg("boden", [[0, "#d6ccb8"], [1, "#bfb39b"]])}"/>`;
  for (let X = -16; X <= 16; X += 1.2) {
    const xa = 160 + X * F / 20, xb = 160 + X * F / 3.8;
    f += `<line x1="${r(xa)}" y1="${WAND_U}" x2="${r(xb)}" y2="200" stroke="#9d907a" stroke-width=".3" opacity=".7"/>`;
  }
  for (let d = 18.8; d > 3.9; d -= 1.2) { const y = bodenY(d); if (y < 200) f += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#9d907a" stroke-width="${r(0.2 + 2 / d)}" opacity=".6"/>`; }
  /* Plattenfarben leicht unterschiedlich */
  for (let i = 0; i < 60; i++) {
    const d = 4.2 + rnd() * 15, X = -14 + rnd() * 28, s = F / d, y = bodenY(d);
    f += `<ellipse cx="${r(160 + X * s)}" cy="${r(y)}" rx="${r(s * 0.5)}" ry="${r(s * 0.12)}" fill="${rnd() < 0.5 ? "#e4dbc9" : "#b3a68e"}" opacity=".25"/>`;
  }
  /* Glanz des Oberlichts auf dem Boden */
  f += `<ellipse cx="160" cy="150" rx="140" ry="22" fill="#fffef6" opacity=".22" filter="url(#bw_weich)"/>`;
  f += `<rect x="0" y="${WAND_U}" width="320" height="${200 - WAND_U}" fill="${S.lg("bodenlicht", [[0, "#3a2e1c", 0.16], [0.35, "#3a2e1c", 0], [1, "#fff", 0.05]])}"/>`;
  S.hinten(f);
}

/* Hilfen für die Säle hinter den Durchgängen */
let clipNr = 0;
const clip = (svgForm) => { const id = S.id("c" + (++clipNr)); S.def(`<clipPath id="${id}">${svgForm}</clipPath>`); return `url(#${id})`; };
const schildTafel = (y, text, w) => `<rect x="${r(-w / 2)}" y="${y}" width="${w}" height="5.4" rx=".5" fill="#2c3440"/><rect x="${r(-w / 2 + 0.5)}" y="${y + 0.5}" width="${w - 1}" height="4.4" rx=".3" fill="none" stroke="#c9a13f" stroke-width=".25"/><text x="0" y="${r(y + 3.8)}" font-size="3.1" text-anchor="middle" fill="#f3ead2" font-family="Georgia,'Times New Roman',serif" letter-spacing=".25">${text}</text>`;

/* =====================================================================
   1 — DAS GLASDACH (Oberlicht des Lichthofs)
   ===================================================================== */
{
  let k = `<path d="M-160 -14 L160 -14 L160 0 L-160 0 Z" fill="${S.lg("himmel", [[0, "#cfe3f2"], [1, "#eef5f9"]])}"/>`;
  /* Stahlsprossen in Flucht nach oben, Querträger */
  for (let i = -7; i <= 7; i++) k += `<line x1="${i * 20}" y1="0" x2="${r(Math.max(-160, Math.min(160, i * 42)))}" y2="${Math.abs(i * 42) > 160 ? r(-14 * (160 - Math.abs(i * 20)) / (Math.abs(i * 42) - Math.abs(i * 20))) : -14}" stroke="#5d6770" stroke-width=".7"/>`;
  for (const y of [-4.5, -10]) k += `<line x1="-160" y1="${y}" x2="160" y2="${y}" stroke="#5d6770" stroke-width=".6"/>`;
  k += `<ellipse cx="-60" cy="-9" rx="24" ry="2.4" fill="#fff" opacity=".7"/><ellipse cx="80" cy="-6" rx="18" ry="1.8" fill="#fff" opacity=".6"/>`;
  k += `<rect x="-160" y="-1.6" width="320" height="2.2" fill="#9aa3aa"/><rect x="-160" y="-1.6" width="320" height=".6" fill="#e1e5e8"/>`;
  S.teil({ id: "glasdach", de: "das Glasdach", syl: "GLAS-dach", it: "il tetto di vetro", itSyl: "TET-to di VE-tro", en: "glass roof", x: 160, y: 14, kunst: k,
    tipp: "Durch das Glasdach fällt Tageslicht in den Lichthof." });
}

/* =====================================================================
   2 — DIE SÄLE IM OBERGESCHOSS (Lupe in die Detail-Szenen)
   Durchgang 2,4 m × 2,8 m → 31 × 36 Einheiten, Boden bei y = 62.
   ===================================================================== */
const OG = (inhalt, wand, decke) => {
  const c = clip(`<rect x="-15.5" y="-36" width="31" height="36"/>`);
  let k = `<g clip-path="${c}"><rect x="-16" y="-37" width="32" height="38" fill="${wand}"/>`;
  /* Decke des Saals (man schaut von unten hinein) */
  k += `<path d="M-16 -37 L16 -37 L16 -27 L-16 -27 Z" fill="${decke}"/><line x1="-16" y1="-27" x2="16" y2="-27" stroke="#000" stroke-width=".4" opacity=".25"/>`;
  k += inhalt + `<rect x="-16" y="-37" width="32" height="38" fill="${S.lg("saaltiefe", [[0, "#000", 0.12], [1, "#000", 0]], 0, 0, 1, 0)}"/></g>`;
  /* Laibung und Rahmen */
  k += `<rect x="-17.5" y="-38" width="35" height="38" fill="none" stroke="#d8cfbd" stroke-width="3"/><rect x="-16" y="-36.5" width="32" height="36.5" fill="none" stroke="#b5aa94" stroke-width=".6"/>`;
  return k;
};
{
  /* BAROCKSAAL: rote Damastwand, Gemälde in Petersburger Hängung, Lüster */
  let g = `<rect x="-16" y="-27" width="32" height="28" fill="${S.lg("damast", [[0, "#8e2230"], [1, "#6a1622"]])}"/>`;
  for (let i = 0; i < 18; i++) g += `<path d="M${r(-15 + (i % 6) * 6)} ${r(-24 + Math.floor(i / 6) * 8)} q1.5 -2 3 0 q-1.5 2 -3 0" fill="#a83444" opacity=".5"/>`;
  const bild = (x, y, w, h, motiv) => `<rect x="${x - 0.9}" y="${y - 0.9}" width="${w + 1.8}" height="${h + 1.8}" rx=".3" fill="${GOLD}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${motiv}"/>`;
  g += bild(-11, -25, 12, 15, S.lg("portraet", [[0, "#3b2a1c"], [1, "#1e140c"]]));
  g += `<ellipse cx="-5" cy="-19" rx="2.6" ry="3.2" fill="#e2b998"/><path d="M-9.6 -10 Q-5 -16 -0.4 -10 Z" fill="#6b1f2a"/><path d="M-8 -21 q3 -5 6 0 q1 -1 1.4 2 q-4 -4 -8.4 0 Z" fill="#d9d3c4"/>`;
  g += bild(4, -24, 9, 7, S.lg("landsch", [[0, "#8fb3c9"], [0.6, "#c9b98a"], [1, "#5d6a3a"]]));
  g += bild(4, -14, 9, 6.5, S.lg("stilleben", [[0, "#2a2016"], [1, "#4a3a22"]])) + `<circle cx="7" cy="-10" r="1.2" fill="#c33"/><circle cx="9.4" cy="-9.6" r="1.1" fill="#e9b13a"/>`;
  /* Kristalllüster von der Decke */
  g += `<line x1="0" y1="-36" x2="0" y2="-31" stroke="#c9a13f" stroke-width=".4"/><path d="M-4 -31 Q0 -28.5 4 -31" stroke="${MESSING}" stroke-width=".7" fill="none"/>`;
  for (const x of [-4, -1.4, 1.4, 4]) g += `<circle cx="${x}" cy="-31.6" r=".5" fill="#fff6c8"/>`;
  let k = OG(g, "#7a1c28", "#efe4c6") + schildTafel(-44, "Barocksaal", 24);
  S.teil({ id: "mu_saal_barock", de: "der Barocksaal", syl: "Ba-ROCK-saal", it: "la sala barocca", itSyl: "SA-la ba-ROC-ca", en: "baroque hall", x: 62, y: DECKE_O, kunst: k, lupe: "barock",
    tipp: "Im Barocksaal hängen die Bilder dicht an dicht, bis unter die Decke." });
}
{
  /* OST UND WEST: weißer Raum, ein Stück der Berliner Mauer mit Graffiti */
  let g = `<rect x="-16" y="-27" width="32" height="28" fill="#f2f1ee"/>`;
  g += `<path d="M-10 2 L-10 -26 Q-10 -29 -7 -29 L7 -29 Q10 -29 10 -26 L10 2 Z" fill="${S.lg("beton", [[0, "#c9c6bf"], [1, "#9d9a92"]], 0, 0, 1, 0)}"/>`;
  g += `<line x1="0" y1="-29" x2="0" y2="2" stroke="#86837b" stroke-width=".4"/>`;
  g += `<path d="M-9 -12 q3 -5 7 -1 q2 3 5 -2 q2 -3 6 1" stroke="#e2342b" stroke-width="1.5" fill="none"/><path d="M-8 -6 q4 3 8 -1 q4 -3 8 1" stroke="#2f7fd6" stroke-width="1.3" fill="none"/>`;
  g += `<path d="M-6 -21 l2 4 l2 -4 l2 4" stroke="#f1c232" stroke-width="1" fill="none"/><circle cx="5" cy="-20" r="2.2" fill="none" stroke="#3aa35b" stroke-width=".9"/>`;
  g += `<text x="0" y="-1.5" font-size="2.6" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">1961–1989</text>`;
  let k = OG(g, "#f2f1ee", "#ffffff") + schildTafel(-44, "Ost und West", 26);
  S.teil({ id: "mu_saal_ostwest", de: "der Saal: Ost und West", syl: "OST und WEST", it: "la sala Est e Ovest", itSyl: "SA-la Est e O-vest", en: "east and west hall", x: 160, y: DECKE_O, kunst: k, lupe: "ost_west",
    tipp: "Hier steht ein echtes Stück der Berliner Mauer." });
}
{
  /* GEDENKRAUM: dunkle Steinwand mit eingemeißelten Namen */
  let g = `<rect x="-16" y="-27" width="32" height="28" fill="${S.lg("gedenk", [[0, "#4a4b4f"], [1, "#2f3034"]])}"/>`;
  g += `<text x="0" y="-22" font-size="2.6" text-anchor="middle" fill="#d8d2c0" font-family="Georgia,serif" letter-spacing=".5">WIR GEDENKEN</text>`;
  for (let row = 0; row < 7; row++) for (let c = 0; c < 4; c++) g += `<rect x="${r(-13 + c * 7 + rnd())}" y="${r(-18 + row * 2.6)}" width="${r(3.4 + rnd() * 2)}" height=".55" fill="#a9a597" opacity=".7"/>`;
  g += `<rect x="-16" y="-27" width="32" height="28" fill="${S.rg("gedenklicht", [[0, "#ffe9b0", 0.25], [1, "#ffe9b0", 0]], 0.5, 0.25, 0.6)}"/>`;
  let k = OG(g, "#38393d", "#55565a") + schildTafel(-44, "Gedenkraum", 24);
  S.teil({ id: "mu_saal_gedenken", de: "der Gedenkraum", syl: "Ge-DENK-raum", it: "la sala della memoria", itSyl: "SA-la della me-MO-ria", en: "memorial room", x: 258, y: DECKE_O, kunst: k, lupe: "gedenken",
    tipp: "Im Gedenkraum ist man still. Die Namen erinnern an die Opfer." });
}

/* =====================================================================
   3 — DAS GELÄNDER der Galerie (vor den Sälen im Obergeschoss)
   ===================================================================== */
{
  let k = `<rect x="-160" y="-12" width="320" height="1.6" rx=".6" fill="${S.lg("handlauf", [[0, "#7a5230"], [1, "#4f3219"]])}"/><rect x="-160" y="-12" width="320" height=".45" fill="#b88a5a"/>`;
  k += `<rect x="-160" y="-2.2" width="320" height="2.2" fill="#d9d0bf"/>`;
  for (let x = -158; x <= 158; x += 3.4) k += `<path d="M${r(x - 0.7)} -2.2 L${r(x - 0.7)} -9.6 Q${r(x)} -10.8 ${r(x + 0.7)} -9.6 L${r(x + 0.7)} -2.2 Z" fill="${STAHL}"/>`;
  for (const x of [-146, -49, 49, 146]) k += `<rect x="${x - 1.6}" y="-11" width="3.2" height="11" fill="#d1c7b4"/><rect x="${x - 1.9}" y="-12.6" width="3.8" height="1.8" rx=".5" fill="#c3b8a2"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 160, y: DECKE_O, kunst: k,
    tipp: "Oben führt eine Galerie um den Lichthof. Das Geländer schützt vor dem Sturz." });
}

/* =====================================================================
   4 — DER STRAHLER (Stromschiene unter dem Gesims) und DIE KAMERA
   ===================================================================== */
{
  let k = `<rect x="-40" y="0" width="72" height="1.4" fill="#2b2f33"/>`;
  for (const [x, a] of [[-34, 26], [-16, 10], [6, -14], [24, -22]]) {
    k += `<rect x="${x - 0.5}" y="1.2" width="1" height="2" fill="#2b2f33"/>`;
    k += `<g transform="translate(${x} 3.6) rotate(${a})"><rect x="-1.6" y="-1" width="3.2" height="4.6" rx="1" fill="${S.lg("spot", [[0, "#3a3f45"], [1, "#16191c"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="3.6" rx="1.5" ry=".6" fill="#fff8d8"/></g>`;
  }
  S.teil({ oben: true, id: "strahler", de: "der Strahler", syl: "STRAH-ler", it: "il faretto", itSyl: "fa-RET-to", en: "spotlight", x: 92, y: DECKE_U, kunst: k + flaeche(-40, -1, 72, 8),
    tipp: "Strahler beleuchten jedes Bild — ohne es zu erwärmen." });
}
{
  let k = `<rect x="-.6" y="0" width="1.2" height="2.4" fill="#d6d8da"/><rect x="-4.2" y="2.2" width="7.4" height="3.6" rx="1.2" fill="${S.lg("kam", [[0, "#fafafa"], [1, "#c3c7ca"]])}" transform="rotate(14 0 4)"/>`;
  k += `<circle cx="-3.6" cy="5.4" r="1.1" fill="#1d2329"/><circle cx="-3.9" cy="5.1" r=".35" fill="#7fb6e6"/><circle cx="2" cy="3.4" r=".35" fill="#e33"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Überwachungskamera", syl: "Ü-ber-WA-chungs-ka-me-ra", it: "la telecamera di sorveglianza", itSyl: "te-le-CA-me-ra di sor-ve-GLIAN-za", en: "security camera", x: 313, y: DECKE_U, kunst: k + flaeche(-6, -0.5, 11, 8) });
}

/* =====================================================================
   5 — DIE SÄLE IM ERDGESCHOSS (Lupe in die Detail-Szenen)
   Boden der Säle liegt tiefer im Bild (sie sind weiter weg).
   ===================================================================== */
const EG = (bx, w, h, inhalt, wand, boden, rund) => {
  const form = rund ? `<path d="M${-w / 2} 0 L${-w / 2} ${-h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-h + w / 2} L${w / 2} 0 Z"/>` : `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}"/>`;
  const c = clip(form);
  const dF = 26, fy = bodenY(dF) - WAND_U;           /* Bodenlinie der Saalwand (lokal) */
  let k = `<g clip-path="${c}"><rect x="${-w / 2 - 1}" y="${-h - 1}" width="${w + 2}" height="${h + 2}" fill="${wand}"/>`;
  /* Boden des Saals in Flucht (zum gemeinsamen Fluchtpunkt) */
  k += `<path d="M${-w / 2 - 1} 0 L${-w / 2 - 1} ${r(fy)} L${w / 2 + 1} ${r(fy)} L${w / 2 + 1} 0 Z" fill="${boden}"/>`;
  const vx = 160 - bx;
  for (let i = -2; i <= 2; i++) { const x0 = i * w / 5; k += `<line x1="${r(x0)}" y1="0" x2="${r(x0 + (vx - x0) * (fy / (HOR - WAND_U)))}" y2="${r(fy)}" stroke="#000" stroke-width=".25" opacity=".2"/>`; }
  k += `<rect x="${-w / 2 - 1}" y="${r(fy - 1.2)}" width="${w + 2}" height="1.2" fill="#000" opacity=".25"/>`;
  k += inhalt + `<rect x="${-w / 2 - 1}" y="${-h - 1}" width="${w + 2}" height="${h + 2}" fill="${S.lg("egtiefe", [[0, "#000", 0.14], [0.5, "#000", 0], [1, "#000", 0.1]], 0, 0, 1, 0)}"/></g>`;
  /* Steinrahmen */
  const rahmen = rund ? `<path d="M${-w / 2} 0 L${-w / 2} ${-h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-h + w / 2} L${w / 2} 0" fill="none" stroke="${STEIN}" stroke-width="3.4"/>` : `<path d="M${-w / 2} 0 L${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2} 0" fill="none" stroke="${STEIN}" stroke-width="3.4"/>`;
  return k + rahmen;
};
{
  /* RITTERSAAL: Sandsteinwand, Banner, Rüstung auf Podest, gekreuzte Schwerter */
  const fy = bodenY(26) - WAND_U, s = F / 26;
  let g = "";
  for (let y = -40; y < fy; y += 3.2) for (let x = -20 + ((y / 3.2) % 2 ? 2.5 : 0); x < 20; x += 5) g += `<rect x="${r(x)}" y="${r(y)}" width="4.8" height="3" fill="#b9805a" opacity=".35" stroke="#7f5233" stroke-width=".15"/>`;
  g += `<path d="M-14 -38 L-8 -38 L-8 -22 L-11 -25 L-14 -22 Z" fill="#1f4b8f"/><path d="M8 -38 L14 -38 L14 -22 L11 -25 L8 -22 Z" fill="#a51d24"/><path d="M-12 -33 l1 -2 l1 2 l-1 2 Z M10 -33 l1 -2 l1 2 l-1 2 Z" fill="#e8c45c"/>`;
  /* Rüstung (1,8 m) auf Podest */
  const by = fy, h = 1.8 * s;
  g += `<rect x="-5" y="${r(by - 2.4)}" width="10" height="2.4" fill="#5a4636"/>`;
  const R = (y) => r(by - 2.4 - h + y * h);
  g += `<path d="M-2 ${R(0.13)} Q-2.4 ${R(0)} 0 ${R(0)} Q2.4 ${R(0)} 2 ${R(0.13)} Z" fill="${STAHL}"/><rect x="-1.8" y="${R(0.06)}" width="3.6" height=".5" fill="#2b2f33"/>`;
  g += `<path d="M-4.2 ${R(0.15)} L4.2 ${R(0.15)} L3.4 ${R(0.5)} L-3.4 ${R(0.5)} Z" fill="${STAHL}"/><path d="M0 ${R(0.17)} L0 ${R(0.48)}" stroke="#8a939a" stroke-width=".4"/>`;
  g += `<path d="M-4.6 ${R(0.16)} L-5.4 ${R(0.5)} L-4.4 ${R(0.5)} L-3.6 ${R(0.2)} Z M4.6 ${R(0.16)} L5.4 ${R(0.5)} L4.4 ${R(0.5)} L3.6 ${R(0.2)} Z" fill="#aeb6bd"/>`;
  g += `<path d="M-3.4 ${R(0.5)} L3.4 ${R(0.5)} L3 ${R(0.58)} L-3 ${R(0.58)} Z" fill="#9aa3aa"/>`;
  g += `<path d="M-2.8 ${R(0.58)} L-0.4 ${R(0.58)} L-0.8 ${R(1)} L-2.6 ${R(1)} Z M0.4 ${R(0.58)} L2.8 ${R(0.58)} L2.6 ${R(1)} L0.8 ${R(1)} Z" fill="${STAHL}"/>`;
  g += `<line x1="6.2" y1="${R(0.22)}" x2="6.2" y2="${R(1)}" stroke="#d6dadd" stroke-width=".6"/><rect x="5" y="${R(0.48)}" width="2.4" height=".5" fill="#8a6a2a"/>`;
  let k = EG(52, 34, 42, g, "#c99a76", "#6d5440");
  k += schildTafel(-49, "Rittersaal", 24);
  S.teil({ id: "mu_saal_mittelalter", de: "der Rittersaal", syl: "RIT-ter-saal", it: "la sala dei cavalieri", itSyl: "SA-la dei ca-va-LIE-ri", en: "medieval hall", x: 52, y: WAND_U, kunst: k, lupe: "mittelalter",
    tipp: "Im Rittersaal steht eine Ritterrüstung aus dem Mittelalter." });
}
{
  /* SAURIERHALLE: hohe Rundbogen-Öffnung, Tyrannosaurus-Skelett */
  const fy = bodenY(30) - WAND_U, s = 5.6;      /* Skelett steht weit hinten in der Halle */
  let g = `<rect x="-30" y="-52" width="60" height="${r(52 + fy)}" fill="${S.lg("saurwand", [[0, "#5d7486"], [1, "#3f5262"]])}"/>`;
  /* Sockel des Skeletts */
  g += `<rect x="-30" y="${r(fy - 2)}" width="60" height="2.6" fill="#2c3a45"/>`;
  /* Skelett im Profil nach links, Hüfte rechts außerhalb */
  const sx = (m) => r(-22 + m * s), sy = (m) => r(fy - 2 - m * s);
  /* Wirbelsäule */
  let ws = `M${sx(1.2)} ${sy(3.2)} Q${sx(3)} ${sy(4.3)} ${sx(5.4)} ${sy(4.2)} Q${sx(7)} ${sy(4.1)} ${sx(9)} ${sy(3.6)}`;
  g += `<path d="${ws}" stroke="${KNOCHEN}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 16; i++) { const m = 1.6 + i * 0.48; const y = 4.25 - Math.abs(m - 5.2) * 0.12; g += `<line x1="${sx(m)}" y1="${sy(y)}" x2="${sx(m)}" y2="${sy(y + 0.55)}" stroke="#d9caa5" stroke-width=".55"/>`; }
  /* Rippen */
  for (let i = 0; i < 9; i++) { const m = 3.6 + i * 0.5; const l = 1.6 - Math.abs(i - 3) * 0.12; g += `<path d="M${sx(m)} ${sy(4.1)} q${r(-0.4 * s)} ${r(l * 0.4 * s)} ${r(-0.1 * s)} ${r(l * s)}" stroke="${KNOCHEN}" stroke-width=".7" fill="none"/>`; }
  /* Hals und Schädel */
  g += `<path d="M${sx(3.6)} ${sy(4.1)} Q${sx(2.6)} ${sy(4.6)} ${sx(1.8)} ${sy(4.3)}" stroke="${KNOCHEN}" stroke-width="1.3" fill="none"/>`;
  g += `<path d="M${sx(2.2)} ${sy(4.9)} L${sx(0.9)} ${sy(5.1)} Q${sx(-0.4)} ${sy(4.9)} ${sx(-0.5)} ${sy(4.4)} L${sx(-0.4)} ${sy(4.0)} L${sx(1.2)} ${sy(3.7)} L${sx(2.2)} ${sy(3.9)} Z" fill="${KNOCHEN}" stroke="#a8936a" stroke-width=".3"/>`;
  g += `<path d="M${sx(-0.3)} ${sy(3.95)} L${sx(1.3)} ${sy(3.55)} L${sx(1.6)} ${sy(3.3)} L${sx(-0.2)} ${sy(3.6)} Z" fill="#e3d4ad" stroke="#a8936a" stroke-width=".3"/>`;
  g += `<ellipse cx="${sx(1.45)}" cy="${sy(4.55)}" rx="1.4" ry="1" fill="#3f5262"/><ellipse cx="${sx(0.5)}" cy="${sy(4.6)}" rx=".9" ry=".6" fill="#3f5262"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M${sx(-0.2 + i * 0.25)} ${sy(4.0)} l.2 1" stroke="#fffaf0" stroke-width=".35"/>`;
  /* kleine Arme */
  g += `<path d="M${sx(4.0)} ${sy(3.2)} l-1.4 2.4 l-1 .4" stroke="${KNOCHEN}" stroke-width=".6" fill="none"/>`;
  /* Beine (Becken bei m = 7) */
  g += `<path d="M${sx(6.4)} ${sy(4.0)} Q${sx(7.4)} ${sy(4.6)} ${sx(8.2)} ${sy(3.9)} L${sx(7.6)} ${sy(3.3)} Z" fill="${KNOCHEN}"/>`;
  g += `<path d="M${sx(7.2)} ${sy(3.6)} L${sx(6.2)} ${sy(2.0)} L${sx(7.0)} ${sy(0.6)} L${sx(6.3)} ${sy(0)}" stroke="${KNOCHEN}" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`;
  g += `<path d="M${sx(7.8)} ${sy(3.6)} L${sx(7.4)} ${sy(1.9)} L${sx(8.3)} ${sy(0.6)} L${sx(7.7)} ${sy(0)}" stroke="#cdbb92" stroke-width="1.3" fill="none" stroke-linejoin="round"/>`;
  g += `<path d="M${sx(5.6)} ${sy(0)} l2 0 M${sx(7)} ${sy(0)} l2 0" stroke="${KNOCHEN}" stroke-width=".8"/>`;
  /* Stützstangen */
  for (const m of [3, 6]) g += `<line x1="${sx(m)}" y1="${sy(0)}" x2="${sx(m)}" y2="${sy(3.6)}" stroke="#20282f" stroke-width=".35"/>`;
  g += `<rect x="-30" y="-52" width="60" height="30" fill="${S.rg("saurlicht", [[0, "#ffffff", 0.18], [1, "#ffffff", 0]], 0.5, 0.2, 0.6)}"/>`;
  let k = EG(160, 58, 50, g, "#4f6575", "#3a4651", true);
  k += `<rect x="-14" y="-54.6" width="28" height="5.6" rx=".5" fill="#2c3440"/><text x="0" y="-50.5" font-size="3.3" text-anchor="middle" fill="#f3ead2" font-family="Georgia,serif" letter-spacing=".3">Saurierhalle</text>`;
  /* Korrektur: alt „der Saurierhalle“ — die Halle ist feminin, richtig „die Saurierhalle“. */
  S.teil({ id: "mu_saal_dinos", de: "die Saurierhalle", syl: "SAU-ri-er-hal-le", it: "la sala dei dinosauri", itSyl: "SA-la dei di-no-SAU-ri", en: "dinosaur hall", x: 160, y: WAND_U, kunst: k, lupe: "dinosaurier",
    tipp: "Das Skelett des Tyrannosaurus ist so lang wie ein Bus." });
}
{
  /* ANTIKENSAMMLUNG: pompejanisch rote Wand, römische Büste auf Säule, Amphore */
  const fy = bodenY(26) - WAND_U, s = F / 26;
  let g = `<rect x="-20" y="-44" width="40" height="${r(44 + fy)}" fill="${S.lg("pompeji", [[0, "#a43a28"], [1, "#7e2a1c"]])}"/>`;
  g += `<rect x="-20" y="${r(fy - 7)}" width="40" height="7" fill="#2b211c"/><rect x="-20" y="-30" width="40" height=".8" fill="#e0b25a" opacity=".7"/>`;
  /* Säule 1,1 m, Büste 0,7 m */
  const c0 = fy - 1.1 * s;
  g += `<rect x="-2.6" y="${r(c0)}" width="5.2" height="${r(1.1 * s)}" fill="${S.lg("saule", [[0, "#d9d4c8"], [0.5, "#fbf9f3"], [1, "#bdb6a6"]], 0, 0, 1, 0)}"/><rect x="-3.4" y="${r(c0 - 0.8)}" width="6.8" height="1" fill="#efeadf"/>`;
  g += `<path d="M-3.6 ${r(c0 - 0.8)} Q-3.8 ${r(c0 - 3.2)} -1.2 ${r(c0 - 3.6)} L-1 ${r(c0 - 4.8)} L1 ${r(c0 - 4.8)} L1.2 ${r(c0 - 3.6)} Q3.8 ${r(c0 - 3.2)} 3.6 ${r(c0 - 0.8)} Z" fill="#ece7dc"/>`;
  g += `<ellipse cx="0" cy="${r(c0 - 6.6)}" rx="2" ry="2.5" fill="#f3efe6"/><path d="M-2 ${r(c0 - 7.4)} q2 -2.4 4 0" stroke="#d6cfbf" stroke-width=".9" fill="none"/><path d="M-.4 ${r(c0 - 6.6)} l.4 1 l-.5 0" stroke="#c9c0ae" stroke-width=".25" fill="none"/>`;
  /* Amphore rechts */
  g += `<path d="M10 ${r(fy)} q-3 -3 -2.4 -6 q.6 -2 2.4 -2.4 l0 -1.4 l1.2 0 l0 1.4 q1.8 .4 2.4 2.4 q.6 3 -2.4 6 Z" fill="${S.lg("ton", [[0, "#d18a52"], [1, "#9b5a2c"]], 0, 0, 1, 0)}"/><path d="M8.6 ${r(fy - 7.4)} q-1 1 .2 2 M13 ${r(fy - 7.4)} q1 1 -.2 2" stroke="#9b5a2c" stroke-width=".5" fill="none"/>`;
  let k = EG(282, 34, 42, g, "#9a3524", "#6d5a48");
  k += schildTafel(-49, "Antikensammlung", 30);
  S.teil({ id: "mu_saal_rom", de: "die Antikensammlung", syl: "An-TI-ken-samm-lung", it: "la collezione antica", itSyl: "col-le-ZIO-ne an-TI-ca", en: "antiquities", x: 282, y: WAND_U, kunst: k, lupe: "rom_detail",
    tipp: "Hier stehen Büsten und Krüge aus dem alten Rom." });
}

/* =====================================================================
   6 — DAS GEMÄLDE (Romantik, Goldrahmen, Objektschild) und DIE INFOTAFEL
   ===================================================================== */
{
  const w = 29, h = 22;
  let k = `<rect x="${-w / 2 - 2}" y="${-h - 2}" width="${w + 4}" height="${h + 4}" rx=".6" fill="${GOLD}"/><rect x="${-w / 2 - 0.6}" y="${-h - 0.6}" width="${w + 1.2}" height="${h + 1.2}" fill="#7a5a1e"/>`;
  k += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${S.lg("bildhimmel", [[0, "#7f9fb8"], [0.5, "#e7d6b6"], [1, "#d7c3a0"]])}"/>`;
  k += `<path d="M${-w / 2} -9 L-9 -15 L-4 -11 L2 -17 L8 -12 L${w / 2} -14 L${w / 2} -6 L${-w / 2} -6 Z" fill="#8b98a6" opacity=".85"/>`;
  k += `<path d="M${-w / 2} -8 Q-4 -10 ${w / 2} -7.5 L${w / 2} -5 L${-w / 2} -5 Z" fill="#f4f1ea" opacity=".85"/>`;
  k += `<path d="M${-w / 2} 0 L${-w / 2} -4 Q-6 -6.5 2 -5.4 L5 -4.6 L5 0 Z" fill="#3d3326"/>`;
  k += `<path d="M1.4 -5.2 L1.6 -9.4 Q2.2 -10.6 2.8 -9.4 L3 -5.2 Z" fill="#22201e"/><circle cx="2.2" cy="-10.4" r=".75" fill="#3a2a1c"/>`;
  k += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${S.lg("firnis", [[0, "#fff4c8", 0.18], [1, "#000", 0.06]], 0, 0, 1, 1)}"/>`;
  /* Objektschild rechts unten neben dem Rahmen */
  k += `<rect x="${w / 2 + 3}" y="-3" width="5" height="3.4" fill="#fbfaf6" stroke="#cfc8b8" stroke-width=".15"/><rect x="${w / 2 + 3.6}" y="-2.3" width="3.6" height=".35" fill="#555"/><rect x="${w / 2 + 3.6}" y="-1.4" width="2.6" height=".25" fill="#999"/><rect x="${w / 2 + 3.6}" y="-.7" width="3" height=".25" fill="#999"/>`;
  S.teil({ id: "gemaelde", de: "das Gemälde", syl: "ge-MÄL-de", it: "il dipinto", itSyl: "di-PIN-to", en: "painting", x: 103, y: 101, kunst: k,
    tipp: "Neben jedem Gemälde hängt ein kleines Schild: Maler, Titel und Jahr." });
}
{
  let k = `<rect x="-8" y="-20" width="16" height="20" rx=".4" fill="#2c3440"/><rect x="-7" y="-19" width="14" height="18" fill="#f6f3ec"/>`;
  k += `<text x="0" y="-15.6" font-size="2.2" text-anchor="middle" fill="#2c3440" font-family="Georgia,serif" font-weight="bold">LICHTHOF</text>`;
  for (let i = 0; i < 5; i++) k += `<rect x="-5.6" y="${-13.8 + i * 1.3}" width="${11.2 - (i === 4 ? 4 : 0)}" height=".45" fill="#8a8f96"/>`;
  /* kleiner Lageplan */
  k += `<rect x="-5.6" y="-6.8" width="11.2" height="5" fill="none" stroke="#2c3440" stroke-width=".3"/><rect x="-2" y="-5.6" width="4" height="2.6" fill="#c9a13f"/><rect x="-5.2" y="-6.4" width="2.6" height="1.6" fill="#b9805a"/><rect x="2.6" y="-6.4" width="2.6" height="1.6" fill="#a43a28"/><circle cx="0" cy="-4.3" r=".5" fill="#d33"/>`;
  S.teil({ id: "infotafel", de: "die Infotafel", syl: "IN-fo-ta-fel", it: "il pannello informativo", itSyl: "pan-NEL-lo in-for-ma-TI-vo", en: "information panel", x: 212, y: 104, kunst: k,
    tipp: "Die Infotafel erklärt den Saal. Der rote Punkt zeigt: „Sie sind hier“." });
}

/* =====================================================================
   7 — DIE VITRINE (Haubenvitrine) mit Kleinfunden — Lupe
   Vorderkante bei y = 158 (38 je Meter): Podest 0,8 m, Glashaube 0,5 m.
   ===================================================================== */
const VIT = { x: 90, y: 158, w: 56 };
{
  const s = proM(VIT.y), W = VIT.w, hp = 0.8 * s, hg = 0.5 * s;
  let k = schatten(0, 0.5, W / 2 + 3, 2.2, 0.32);
  /* Podest (weiß lackiert, Sockelfuge) */
  k += `<rect x="${-W / 2}" y="${r(-hp)}" width="${W}" height="${r(hp)}" fill="${S.lg("podest", [[0, "#fbfaf7"], [0.7, "#ebe8e1"], [1, "#d3cec3"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-W / 2 + 1}" y="-2" width="${W - 2}" height="2" fill="#a29b8c"/><rect x="${-W / 2}" y="${r(-hp)}" width="${W}" height="1.2" fill="#fff"/>`;
  k += `<text x="${W / 2 - 4}" y="${r(-hp + 6)}" font-size="2.2" text-anchor="end" fill="#8a8578" font-family="Arial">Funde · Kat. 12–16</text>`;
  /* Innenraum der Haube: Boden mit Stoff, Hintergrund */
  const top = -hp - hg;
  k += `<rect x="${-W / 2 + 0.6}" y="${r(top)}" width="${W - 1.2}" height="${r(hg)}" fill="${S.lg("vitinnen", [[0, "#e9e4d6"], [1, "#cfc6b0"]])}"/>`;
  k += `<path d="M${-W / 2 + 0.6} ${r(-hp)} L${W / 2 - 0.6} ${r(-hp)} L${W / 2 - 3} ${r(-hp - 3.2)} L${-W / 2 + 3} ${r(-hp - 3.2)} Z" fill="${S.lg("stoff", [[0, "#2f4057"], [1, "#22324a"]])}"/>`;
  const bo = -hp - 1.4;   /* Standfläche der Funde */
  const unter = [];
  const stueck = (id, de, syl, it, itSyl, en, x, svg, tipp, nr) => {
    k += svg + `<rect x="${r(x - 1.4)}" y="${r(bo + 0.3)}" width="2.8" height="1.2" fill="#fbfaf6"/><text x="${r(x)}" y="${r(bo + 1.25)}" font-size="1.1" text-anchor="middle" fill="#333" font-family="Arial">${nr}</text>`;
    unter.push({ id, de, syl, it, itSyl, en, tipp, x: VIT.x + x, y: VIT.y + bo + 1.5, kunst: flaeche(-5, -12.5, 10, 13) });
  };
  /* Öllampe (Ton) */
  stueck("oellampe", "die Öllampe", "ÖL-lam-pe", "la lucerna", "lu-CER-na", "oil lamp", -21,
    `<path d="M-24.4 ${r(bo)} q-.6 -2.4 2.4 -2.6 l3.6 -.2 q1.6 .4 .6 1.6 l-1.6 .4 q-1 1 -5 .8 Z" fill="${S.lg("lampe", [[0, "#cf8f5a"], [1, "#94562c"]])}" /><ellipse cx="-21.6" cy="${r(bo - 2.6)}" rx="1.2" ry=".4" fill="#6e3d1d"/><path d="M-19 ${r(bo - 2.4)} q.6 -1.4 1.4 -.6" stroke="#ffb347" stroke-width=".5" fill="none" opacity=".0"/>`,
    "Mit Öllampen machten die Römer Licht.", "12");
  /* Vase (Krug, griechisch: schwarzfigurig) */
  stueck("vase", "die Vase", "VA-se", "il vaso", "VA-so", "vase", -10,
    `<path d="M-11.6 ${r(bo)} L-8.4 ${r(bo)} Q-7.4 ${r(bo - 3)} -8 ${r(bo - 5.6)} Q-8.8 ${r(bo - 7.4)} -9 ${r(bo - 8.6)} L-11 ${r(bo - 8.6)} Q-11.2 ${r(bo - 7.4)} -12 ${r(bo - 5.6)} Q-12.6 ${r(bo - 3)} -11.6 ${r(bo)} Z" fill="${S.lg("vase", [[0, "#e08a4c"], [1, "#a35322"]], 0, 0, 1, 0)}"/><rect x="-11.6" y="${r(bo - 5.2)}" width="3.2" height="1.8" fill="#1e1712"/><path d="M-11.2 ${r(bo - 8.6)} l2.4 0" stroke="#1e1712" stroke-width=".5"/>`,
    "Griechische Vase, über 2500 Jahre alt.", "13");
  /* Münzen auf kleinem Pult */
  stueck("muenze", "die Münze", "MÜN-ze", "la moneta", "mo-NE-ta", "coin", 1,
    `<path d="M-3 ${r(bo)} L5 ${r(bo)} L4.4 ${r(bo - 2.2)} L-2.4 ${r(bo - 2.2)} Z" fill="#33445c"/>` + [[-1.2, 0], [1.2, 0], [3.4, 0]].map(([dx]) => `<ellipse cx="${dx + 0.2}" cy="${r(bo - 1.3)}" rx=".95" ry=".7" fill="${S.rg("gm", [[0, "#ffe9a0"], [1, "#b88a1e"]])}" stroke="#8a6512" stroke-width=".15"/>`).join(""),
    "Mit dieser Münze hat man vor 2000 Jahren bezahlt.", "14");
  /* Ring auf Kissen */
  stueck("ring", "der Ring", "RING", "l'anello", "a-NEL-lo", "ring", 11,
    `<ellipse cx="11" cy="${r(bo - 0.7)}" rx="2.4" ry=".9" fill="#41536b"/><ellipse cx="11" cy="${r(bo - 2.2)}" rx="1.3" ry="1.4" fill="none" stroke="${GOLD}" stroke-width=".55"/><circle cx="11" cy="${r(bo - 3.6)}" r=".55" fill="#2a7d5a"/>`,
    null, "15");
  /* Halskette auf Büstenform */
  stueck("halskette", "die Halskette", "HALS-ket-te", "la collana", "col-LA-na", "necklace", 21,
    `<path d="M18.6 ${r(bo)} L23.4 ${r(bo)} L22.6 ${r(bo - 4.6)} Q21 ${r(bo - 6.2)} 19.4 ${r(bo - 4.6)} Z" fill="#33445c"/><path d="M19.4 ${r(bo - 4.4)} Q21 ${r(bo - 1.6)} 22.6 ${r(bo - 4.4)}" stroke="${GOLD}" stroke-width=".45" fill="none"/>` + [0.2, 0.4, 0.6, 0.8].map((t) => `<circle cx="${r(19.4 + t * 3.2)}" cy="${r(bo - 4.4 + Math.sin(t * Math.PI) * 2.6)}" r=".38" fill="#b3261e"/>`).join(""),
    "Schmuck aus Gold und Granat.", "16");
  /* Glashaube: Kanten aus Edelstahl */
  k += `<rect x="${-W / 2}" y="${r(top)}" width="${W}" height="${r(hg)}" fill="none" stroke="${STAHL}" stroke-width=".9"/>`;
  k += `<path d="M${-W / 2} ${r(top)} L${-W / 2 + 3} ${r(top - 2.6)} L${W / 2 - 3} ${r(top - 2.6)} L${W / 2} ${r(top)} Z" fill="#e8f3f6" opacity=".35" stroke="#c7d4d9" stroke-width=".5"/>`;
  S.teil({ id: "mu_vitrine_mu", de: "die Vitrine", syl: "Vi-TRI-ne", it: "la vetrina", itSyl: "ve-TRI-na", en: "display case", x: VIT.x, y: VIT.y, steht: true, kunst: k,
    zoom: { x: VIT.x - W / 2 - 4, y: VIT.y - hp - hg - 6, w: W + 8, h: 40 }, unter,
    tipp: "In der Vitrine liegen kleine, wertvolle Funde unter Glas." });
  S.davor(`<g pointer-events="none"><path d="M${VIT.x - W / 2 + 4} ${r(VIT.y - hp)} L${VIT.x - W / 2 + 10} ${r(VIT.y + top)} L${VIT.x - W / 2 + 14} ${r(VIT.y + top)} L${VIT.x - W / 2 + 8} ${r(VIT.y - hp)} Z" fill="#fff" opacity=".22"/><path d="M${VIT.x + 12} ${r(VIT.y - hp)} L${VIT.x + 16} ${r(VIT.y + top)} L${VIT.x + 18} ${r(VIT.y + top)} L${VIT.x + 14} ${r(VIT.y - hp)} Z" fill="#fff" opacity=".16"/><rect x="${VIT.x - W / 2}" y="${r(VIT.y + top)}" width="${W}" height="${r(hg)}" fill="${GLAS}"/></g>`);
}

/* =====================================================================
   8 — DER SOCKEL und DIE SKULPTUR (Marmor, rechts)
   ===================================================================== */
const SK = { x: 256, y: 168 };
{
  const s = proM(SK.y), w = 0.55 * s, h = 1.0 * s;
  let k = schatten(0, 0.5, w / 2 + 4, 2, 0.32);
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("sockel", [[0, "#f3f0e9"], [0.6, "#e2ddd2"], [1, "#bdb5a5"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2 - 1.2)}" y="${r(-h - 1.8)}" width="${r(w + 2.4)}" height="2" rx=".4" fill="#ebe6db"/><rect x="${r(-w / 2 - 1)}" y="-2.4" width="${r(w + 2)}" height="2.4" fill="#cbc3b3"/>`;
  /* Objektschild am Sockel */
  k += `<rect x="-5" y="${r(-h + 9)}" width="10" height="5" fill="#fbfaf6" stroke="#bdb5a5" stroke-width=".2"/><text x="0" y="${r(-h + 11.2)}" font-size="1.5" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">Flora</text><text x="0" y="${r(-h + 13)}" font-size="1.1" text-anchor="middle" fill="#666" font-family="Arial">Marmor, um 1800</text>`;
  S.teil({ id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "plinth", x: SK.x, y: SK.y, steht: true, kunst: k });
}
{
  const s = proM(SK.y);
  const m = B.mensch({ id: "b13a_statue", geschlecht: "w", pose: "kontrapost", blick: 22, frisur: "dutt", haarfarbe: "hellblond", haut: "sehrhell", ohneSchatten: true,
    kleidung: { kleid: { stueck: "abendkleid", farbe: "weiss" }, schuhe: { stueck: "sandale", farbe: "weiss" } } }, 1.45 * s);
  let k = `<g filter="url(#${S.id("marmor")})">${m.svg}</g>`;
  S.teil({ id: "skulptur", de: "die Skulptur", syl: "skulp-TUR", it: "la scultura", itSyl: "scul-TU-ra", en: "sculpture", x: SK.x, y: SK.y - 1.0 * s - 1.8, kunst: k,
    tipp: "Die Skulptur ist aus Marmor gehauen." });
}

/* =====================================================================
   9 — DIE AUFSICHT (links, dunkle Kleidung)
   ===================================================================== */
{
  const y = 180, s = proM(y);
  const m = B.mensch({ id: "b13a_aufsicht", geschlecht: "m", pose: "stehen", blick: 32, frisur: "kurz", haarfarbe: "grau", haut: "hell", alter: "alt",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "schwarz" }, unterteil: { stueck: "anzughose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.76 * s);
  /* Namensschild am Revers */
  const k = m.svg + `<rect x="${r(-4.2)}" y="${r(-1.32 * s)}" width="4.4" height="1.6" rx=".2" fill="#f3ead2" stroke="#9a8a5a" stroke-width=".15" transform="translate(${r(s * 0.12)} 0)"/>`;
  S.teil({ id: "mu_aufsicht", de: "die Aufsicht", syl: "AUF-sicht", it: "il custode", itSyl: "cu-STO-de", en: "attendant", x: 22, y, kunst: k,
    tipp: "Die Aufsicht passt auf, dass niemand die Kunst berührt." });
}

/* =====================================================================
   10 — DIE BANK mit der BESUCHERIN, dem AUDIOGUIDE und der EINTRITTSKARTE
   ===================================================================== */
const BANK = { x: 160, y: 182 };
const bs = proM(BANK.y);
const sitzM = B.mensch({ id: "b13a_besucherin", geschlecht: "w", pose: "sitzen", blick: -18, frisur: "locken", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
  kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.66 * bs);
const SITZH = -sitzM.z.sitz.y * sitzM.k;     /* Sitzhöhe in Einheiten */
{
  const W = 1.9 * bs, T = 0.4 * bs * 0.35;
  let k = schatten(0, 0.6, W / 2 + 2, 2.4, 0.34);
  /* Stahlkufen */
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (W / 2 - 4))} 0 L${r(sx * (W / 2 - 4))} ${r(-SITZH + 4)}" stroke="#2b2f33" stroke-width="1.6"/><path d="M${r(sx * (W / 2 - 7))} 0 L${r(sx * (W / 2 - 1))} 0" stroke="#2b2f33" stroke-width="1.4" stroke-linecap="round"/>`;
  /* Sitzpolster (schwarzes Leder, abgesteppt) */
  k += `<path d="M${r(-W / 2 + 1.5)} ${r(-SITZH - T)} L${r(W / 2 - 1.5)} ${r(-SITZH - T)} L${r(W / 2)} ${r(-SITZH)} L${r(-W / 2)} ${r(-SITZH)} Z" fill="${S.lg("leder", [[0, "#56504a"], [1, "#2f2b28"]])}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-SITZH)}" width="${r(W)}" height="4.2" rx="1.2" fill="${S.lg("lederfront", [[0, "#3a3531"], [1, "#1b1917"]])}"/>`;
  for (let i = 1; i < 6; i++) k += `<circle cx="${r(-W / 2 + i * W / 6)}" cy="${r(-SITZH - T / 2)}" r=".35" fill="#1b1917"/>`;
  k += `<path d="M${r(-W / 2 + 2)} ${r(-SITZH - T + 0.4)} L${r(W / 2 - 2)} ${r(-SITZH - T + 0.4)}" stroke="#8a827a" stroke-width=".4" opacity=".7"/>`;
  S.teil({ id: "mu_bank_mu", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: BANK.x, y: BANK.y, steht: true, kunst: k,
    tipp: "Auf der Bank kann man sitzen und die Kunst in Ruhe ansehen." });
}
const BES = { x: BANK.x + 0.42 * bs, y: BANK.y - 3 };
{
  S.teil({ id: "mu_besucherin", de: "die Besucherin", syl: "Be-SU-che-rin", it: "la visitatrice", itSyl: "vi-si-ta-TRI-ce", en: "visitor", x: BES.x, y: BES.y, kunst: sitzM.svg,
    tipp: "Die Besucherin hört über den Audioguide, was das Bild erzählt." });
}
{
  /* Audioguide: Gerät in der Hand, Kopfhörer auf dem Kopf (beides gehört zusammen) */
  const k0 = sitzM.k, z = sitzM.z;
  const hand = [z.handL, z.handR].sort((a, b) => b.x - a.x)[0];
  const hx = hand.x * k0, hy = hand.y * k0, kx = z.kopf.x * k0, ky = z.kopf.y * k0, kr = 11 * k0;
  let k = `<g transform="translate(${r(hx)} ${r(hy)}) rotate(-12)"><rect x="-1.6" y="-5.4" width="3.2" height="6.4" rx=".7" fill="#22272c"/><rect x="-1.1" y="-4.8" width="2.2" height="2.4" rx=".2" fill="#7fc3e6"/><text x="0" y="-3.1" font-size="1.2" text-anchor="middle" fill="#0b3b52" font-family="Arial">27</text>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-0.6 + (i % 2) * 1.2)}" cy="${r(-1.5 + Math.floor(i / 2) * 0.8)}" r=".3" fill="#9aa3aa"/>`;
  k += `</g>`;
  k += `<path d="M${r(kx - kr * 0.95)} ${r(ky + 0.6)} Q${r(kx - kr * 0.9)} ${r(ky - kr * 1.25)} ${r(kx)} ${r(ky - kr * 1.25)} Q${r(kx + kr * 0.9)} ${r(ky - kr * 1.25)} ${r(kx + kr * 0.95)} ${r(ky + 0.6)}" stroke="#1d2125" stroke-width="1" fill="none"/>`;
  k += `<ellipse cx="${r(kx - kr * 0.95)}" cy="${r(ky + 1)}" rx="1.4" ry="2.1" fill="#2b2f33"/><ellipse cx="${r(kx + kr * 0.95)}" cy="${r(ky + 1)}" rx="1.4" ry="2.1" fill="#2b2f33"/>`;
  k += `<path d="M${r(kx - kr * 0.95)} ${r(ky + 3)} Q${r(kx - 2)} ${r(hy - 6)} ${r(hx)} ${r(hy - 5.6)}" stroke="#1d2125" stroke-width=".3" fill="none"/>`;
  S.teil({ oben: true, id: "mu_audioguide", de: "der Audioguide", syl: "AU-dio-guide", it: "l'audioguida", itSyl: "au-dio-GUI-da", en: "audio guide", x: BES.x, y: BES.y, kunst: k,
    tipp: "Man tippt die Nummer vom Schild ein und hört die Erklärung." });
}
{
  /* Eintrittskarte liegt links auf der Bank */
  let k = `<path d="M-4.4 0 L3.6 -0.2 L4.6 -2 L-3.4 -1.8 Z" fill="#f6efe0" stroke="#b9a37a" stroke-width=".2"/><path d="M-3.8 -.5 L-2.9 -1.6" stroke="#c0392b" stroke-width=".6"/><path d="M-1.6 -.7 L2.6 -.8 M-1.3 -1.3 L3 -1.4" stroke="#8a7a5a" stroke-width=".22"/><path d="M1.2 -.3 L1.9 -1.9" stroke="#b9a37a" stroke-width=".18" stroke-dasharray=".3 .3"/>`;
  S.teil({ oben: true, id: "mu_eintrittskarte", de: "die Eintrittskarte", syl: "EIN-tritts-kar-te", it: "il biglietto d'ingresso", itSyl: "bi-GLIET-to d'in-GRES-so", en: "admission ticket", x: BANK.x - 0.5 * bs, y: BANK.y - SITZH - 1, kunst: k + flaeche(-5, -3, 10, 3.4),
    tipp: "Die Eintrittskarte zeigt man an der Kasse und bei der Aufsicht." });
}

/* =====================================================================
   11 — DIE ABSPERRKORDEL (Messingpfosten, roter Samt) und DAS SCHILD
   ===================================================================== */
const KORD = { y: 186, x0: 230, x1: 290 };
{
  const s = proM(KORD.y), h = 0.95 * s, cx = (KORD.x0 + KORD.x1) / 2;
  let k = "";
  for (const x of [KORD.x0 - cx, KORD.x1 - cx]) {
    k += schatten(x, 0.4, 5, 1.2, 0.3);
    k += `<ellipse cx="${x}" cy="-.8" rx="4.6" ry="1.4" fill="${MESSING}"/><rect x="${x - 0.9}" y="${r(-h)}" width="1.8" height="${r(h)}" fill="${MESSING}"/>`;
    k += `<circle cx="${x}" cy="${r(-h - 1.2)}" r="1.8" fill="${S.rg("knauf", [[0, "#fff2b8"], [0.6, "#c9a13f"], [1, "#7d5e17"]], 0.35, 0.3, 0.7)}"/>`;
  }
  const a = KORD.x0 - cx + 1.4, b = KORD.x1 - cx - 1.4;
  k += `<path d="M${a} ${r(-h + 2)} Q0 ${r(-h + 16)} ${b} ${r(-h + 2)}" stroke="${SAMT}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${a} ${r(-h + 1.4)} Q0 ${r(-h + 15.2)} ${b} ${r(-h + 1.4)}" stroke="#d94a55" stroke-width=".5" fill="none" opacity=".7"/>`;
  S.teil({ id: "absperrkordel", de: "die Absperrkordel", syl: "AB-sperr-kor-del", it: "il cordone", itSyl: "cor-DO-ne", en: "barrier rope", x: cx, y: KORD.y, steht: true, kunst: k,
    tipp: "Bis hierher und nicht weiter: Die Kordel hält Abstand zur Kunst." });
}
{
  /* Schild hängt mitten an der Kordel */
  const s = proM(KORD.y), h = 0.95 * s;
  let k = `<path d="M-2 -7.6 L0 -9.6 L2 -7.6" stroke="#8a6512" stroke-width=".35" fill="none"/>`;
  k += `<rect x="-8" y="-7.8" width="16" height="7.8" rx=".8" fill="#f8f6f0" stroke="#8a6512" stroke-width=".5"/>`;
  k += `<circle cx="-4.8" cy="-3.9" r="2.4" fill="none" stroke="#c0392b" stroke-width=".55"/><path d="M-6.4 -2.3 L-3.2 -5.5" stroke="#c0392b" stroke-width=".55"/><path d="M-5.4 -4.6 l0 1.6 l1.2 0 l0 -2" stroke="#333" stroke-width=".35" fill="none"/>`;
  k += `<text x="2.6" y="-4.6" font-size="1.8" text-anchor="middle" fill="#2c3440" font-family="Arial" font-weight="bold">Bitte nicht</text><text x="2.6" y="-2.2" font-size="1.8" text-anchor="middle" fill="#2c3440" font-family="Arial" font-weight="bold">berühren</text>`;
  S.teil({ oben: true, id: "mu_schild_mu", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: (KORD.x0 + KORD.x1) / 2, y: r(KORD.y - h + 18), kunst: k,
    tipp: "Auf dem Schild steht: „Bitte nicht berühren“." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/museum.js"));
console.log(aus);
