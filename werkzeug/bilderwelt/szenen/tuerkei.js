#!/usr/bin/env node
/* =====================================================================
   TÜRKEI — ISTANBUL (FASSUNG 852) — Bilderwelt neu: Sultanahmet
   ---------------------------------------------------------------------
   RECHERCHE (istanbul.com „Arasta Bazaar“, Grand Sirkeci „All About the
   Arasta Bazaar“, Saveur „A Pomegranate Cart in Turkey“, Turkeys for
   Life „Simit“, Bauaufnahmen der Sultan-Ahmed-Moschee):
   - STANDORT: Altstadt Sultanahmet, am Eingang des Arasta-Basars
     südöstlich der Blauen Moschee. Der Basar wurde mit der Moschee gebaut
     (seine Mieten bezahlten sie): eine lange Reihe Läden unter steinernen
     Bögen — Teppiche und Kelims, Iznik-Keramik, Mosaiklampen, Nazar-
     Amulette, Kupferkannen. Über dem Dach steht die Moschee.
   - BLAUE MOSCHEE (Sultan-Ahmed-Moschee, 1616): außen grauer Stein und
     bleigraue Kuppeln; die Hauptkuppel (23,5 m, 43 m hoch) auf einem
     Fensterkranz mit vier achteckigen Ecktürmchen, darunter vier
     Halbkuppeln und kleinere Kuppeln in Kaskade. SECHS Minarette: vier an
     den Ecken des Gebetsbaus mit je drei Balkonen (Şerefe), zwei an den
     fernen Ecken des Hofes mit je zwei; spitze Bleihauben, goldene
     Mondsichel-Spitzen.
   - Am Ende der Straße der Blick hinunter aufs Wasser: die Mündung des
     Bosporus, gegenüber das asiatische Ufer (Üsküdar) mit dem
     Leanderturm (Kız Kulesi) auf seiner Insel, ein weißer Stadtdampfer.
   - VORNE: eine Döner-Bude mit Holzerker (Cumba) darüber, der Spieß dreht
     sich vor dem Grill; der rote Simit-Wagen mit Glaskasten voller
     Sesamringe; ein Aufsteller eines Reisebüros mit Heißluftballons aus
     Kappadokien (die Ballonfahrten dort werden in Istanbul überall
     verkauft); der Saftstand mit Granatäpfeln und Handpresse; vor dem
     Teppichladen ein niedriger Tisch mit Hocker: Tee im Tulpenglas auf
     rotem Untersetzer mit Würfelzucker, Baklava mit Pistazien; eine
     Straßenkatze. Die türkische Flagge weht über dem Basar.
   Maßstab: Augenhöhe y = 118, Auge 1,6 m. Bodenpunkt in d Metern:
   y = 118 + 1,6·300/d, Einheiten je Meter = 300/d. Basarfront d = 25
   (12 je Meter, 4 m hoch), Moschee ≈ 1,36 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "tuerkei", titel: "Türkei — Istanbul", emoji: "🇹🇷", thema: "Länder", kuerzel: "b25c", fassung: 852 });
/* Verläufe nur einmal anlegen, auch wenn sie in Schleifen gebraucht werden */
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* Wortmarke: Teile, die in Bildkoordinaten gezeichnet sind, bekommen ihren Ankerpunkt in die Mitte */
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1616);
const r = B.r;
const HOR = 118, F = 300, AUGE = 1.6;
const yAt = (d, h = 0) => HOR + (AUGE - h) * F / d;
const uAt = (d) => F / d;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<pattern id="${S.id("pflaster")}" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#5b5752"/><rect x=".2" y=".2" width="2.6" height="1.2" rx=".4" fill="#79736b"/><rect x="3.2" y=".2" width="2.6" height="1.2" rx=".4" fill="#6f6962"/><rect x="1.7" y="1.7" width="2.6" height="1.2" rx=".4" fill="#837c73"/><rect x="-1.3" y="1.7" width="2.6" height="1.2" rx=".4" fill="#6a645d"/><rect x="4.7" y="1.7" width="2.6" height="1.2" rx=".4" fill="#6a645d"/></pattern>`);
const STEIN = S.lg("stein", [[0, "#d9d2c3"], [1, "#b9b09d"]]);
const STEIN_V = S.lg("steinv", [[0, "#b5ab97"], [0.35, "#e3dccd"], [0.75, "#cfc6b4"], [1, "#a69c88"]], 0, 0, 1, 0);
const BLEI = S.lg("blei", [[0, "#aab4bf"], [0.45, "#8793a0"], [1, "#5f6b78"]], 0, 0, 1, 0);
const BLEI_K = S.rg("bleik", [[0, "#c6cfd8"], [0.55, "#8f9ba8"], [1, "#5b6774"]], 0.38, 0.3, 0.8);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8760f"]], 0, 0, 1, 1);
const ROT = S.lg("rot", [[0, "#e3242b"], [1, "#b3121a"]]);
const HOLZ = S.lg("holz", [[0, "#8a5a32"], [1, "#5e3b1e"]]);
const MESSING = S.lg("messing", [[0, "#f4dc8a"], [0.5, "#c9a046"], [1, "#8a6a22"]], 0, 0, 1, 1);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.35], [0.5, "#e8f4f7", 0.08], [1, "#ffffff", 0.2]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Abendhimmel, Pflasterstraße
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 20}" fill="${S.lg("himmel", [[0, "#5d8fc9"], [0.55, "#a9c7e4"], [0.85, "#f2dcc0"], [1, "#f6c99a"]])}"/>`);
S.hinten(`<circle cx="290" cy="96" r="70" fill="${S.rg("sonne", [[0, "#fff1cf", 0.6], [1, "#fff1cf", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[44, 22, 0.9], [210, 14, 1], [270, 48, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".85">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4], [-10, 1.5, 10, 3.4], [11, 1, 12, 3.8], [-3, -3, 9, 4]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff8ee"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
{
  const Y0 = yAt(25);
  let f = `<rect x="0" y="${r(Y0)}" width="320" height="${r(200 - Y0)}" fill="url(#${S.id("pflaster")})"/>`;
  for (let i = -10; i <= 10; i++) f += `<path d="M${r(160 + i * 16)} ${r(Y0)} L${r(160 + i * 64)} 200" stroke="#4a4642" stroke-width=".3" opacity=".45"/>`;
  for (const d of [20, 15, 12, 10, 8.5, 7.2, 6.2]) f += `<line x1="0" y1="${r(yAt(d))}" x2="320" y2="${r(yAt(d))}" stroke="#4a4642" stroke-width=".35" opacity=".5"/>`;
  f += `<rect x="0" y="${r(Y0)}" width="320" height="${r(200 - Y0)}" fill="${S.lg("strassenlicht", [[0, "#f6c99a", 0.35], [0.4, "#000", 0.05], [1, "#000", 0.18]])}"/>`;
  f += `<rect x="0" y="${r(Y0 - 0.6)}" width="320" height="1.4" fill="#9a9184"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE MOSCHEE: Blaue Moschee mit sechs Minaretten
   ===================================================================== */
{
  const u = 1.36;   /* Einheiten je Meter */
  let k = "";
  const minarett = (x, s, balkone, top) => {
    /* fluteter Schaft, Balkone mit Brüstung, spitze Bleihaube, goldene Spitze */
    const H = 64 * u * s, b = 1.5 * s;
    let g = `<rect x="${r(x - b)}" y="${r(-H)}" width="${r(2 * b)}" height="${r(H)}" fill="${STEIN_V}"/>`;
    for (const dx of [-0.5, 0, 0.5]) g += `<line x1="${r(x + dx * b)}" y1="${r(-H)}" x2="${r(x + dx * b)}" y2="${r(-H * 0.15)}" stroke="#a69c88" stroke-width=".12"/>`;
    for (let i = 0; i < balkone; i++) {
      const y = -H * (0.52 + i * 0.15);
      g += `<path d="M${r(x - b - 0.9 * s)} ${r(y)} L${r(x + b + 0.9 * s)} ${r(y)} L${r(x + b)} ${r(y + 1.6 * s)} L${r(x - b)} ${r(y + 1.6 * s)} Z" fill="#cfc6b4"/>`;
      g += `<rect x="${r(x - b - 0.9 * s)}" y="${r(y - 1.2 * s)}" width="${r(2 * b + 1.8 * s)}" height="${r(1.2 * s)}" fill="#e6dfd1" stroke="#a69c88" stroke-width=".12"/>`;
    }
    const kh = H * 0.17;
    g += `<path d="M${r(x - b - 0.2)} ${r(-H)} L${r(x)} ${r(-H - kh)} L${r(x + b + 0.2)} ${r(-H)} Z" fill="${BLEI}"/>`;
    g += `<line x1="${x}" y1="${r(-H - kh)}" x2="${x}" y2="${r(-H - kh - 3 * s)}" stroke="${GOLD}" stroke-width="${r(0.4 * s)}"/>`;
    g += `<path d="M${r(x - 0.7 * s)} ${r(-H - kh - 3.4 * s)} a${r(0.8 * s)} ${r(0.8 * s)} 0 1 0 ${r(1.2 * s)} ${r(-0.9 * s)}" stroke="${GOLD}" stroke-width="${r(0.3 * s)}" fill="none"/>`;
    return g;
  };
  const kuppel = (cx, by, rr, h) => `<path d="M${r(cx - rr)} ${r(by)} Q${r(cx - rr)} ${r(by - h * 1.25)} ${r(cx)} ${r(by - h * 1.3)} Q${r(cx + rr)} ${r(by - h * 1.25)} ${r(cx + rr)} ${r(by)} Z" fill="${BLEI_K}"/>`;
  const alem = (cx, y, s = 1) => `<line x1="${cx}" y1="${r(y)}" x2="${cx}" y2="${r(y - 2.4 * s)}" stroke="${GOLD}" stroke-width="${r(0.35 * s)}"/><circle cx="${cx}" cy="${r(y - 0.8 * s)}" r="${r(0.4 * s)}" fill="${GOLD}"/>`;
  /* ferne Hof-Minarette (zwei Balkone), dann mittlere, dann nahe */
  k += minarett(-14, 0.8, 2) + minarett(54, 0.8, 2);
  k += minarett(-30, 0.92, 3) + minarett(40, 0.92, 3);
  /* Baukörper (oberer Teil; der Fuß liegt hinter dem Basar) */
  k += `<rect x="-40" y="-26" width="80" height="26" fill="${STEIN}"/>`;
  for (let i = 0; i < 10; i++) k += `<path d="M${-37 + i * 7.6} -8 L${-37 + i * 7.6} -14 Q${-35.4 + i * 7.6} -16.4 ${-33.8 + i * 7.6} -14 L${-33.8 + i * 7.6} -8 Z" fill="#4c5a68"/>`;
  /* Kaskade: Eckkuppeln, Halbkuppeln, Hauptkuppel */
  for (const cx of [-30, 30]) k += `<rect x="${cx - 6}" y="-31" width="12" height="5" fill="${STEIN_V}"/>` + kuppel(cx, -31, 6, 5) + alem(cx, -37.4, 0.8);
  for (const cx of [-14, 14]) k += `<rect x="${cx - 6}" y="-33" width="12" height="7" fill="${STEIN}"/>` + kuppel(cx, -33, 5.6, 4.4) + alem(cx, -38.6, 0.7);
  k += `<path d="M-24 -30 Q-24 -46 0 -48 Q24 -46 24 -30 Z" fill="${BLEI_K}"/>`;
  k += `<path d="M-20 -30 Q-20 -38 -14 -40" stroke="#6f7b88" stroke-width=".3" fill="none"/><path d="M20 -30 Q20 -38 14 -40" stroke="#6f7b88" stroke-width=".3" fill="none"/>`;
  /* Fensterkranz der Hauptkuppel mit vier Ecktürmchen */
  k += `<rect x="-17" y="-55" width="34" height="7" fill="${STEIN_V}"/>`;
  for (let i = 0; i < 12; i++) k += `<path d="M${r(-15.6 + i * 2.7)} -49.4 L${r(-15.6 + i * 2.7)} -52.4 Q${r(-14.9 + i * 2.7)} -53.6 ${r(-14.2 + i * 2.7)} -52.4 L${r(-14.2 + i * 2.7)} -49.4 Z" fill="#3e4b58"/>`;
  for (const cx of [-19, 19]) k += `<rect x="${cx - 2}" y="-56" width="4" height="8" fill="${STEIN_V}"/>` + kuppel(cx, -56, 2.2, 2.2) + alem(cx, -59, 0.5);
  k += kuppel(0, -55, 16, 13) + alem(0, -72, 1.2);
  k += `<path d="M-10 -60 Q-6 -67 2 -68.6" stroke="#fff" stroke-width=".9" opacity=".35" fill="none"/>`;
  /* nahe Minarette (drei Balkone) — davor */
  k += minarett(-38, 1, 3) + minarett(46, 1, 3);
  /* Dunst */
  k += `<rect x="-42" y="-26" width="96" height="26" fill="${S.lg("dunst", [[0, "#f2dcc0", 0], [1, "#f2dcc0", 0.35]])}"/>`;
  S.teil({ id: "moschee", de: "die Moschee", syl: "Mo-SCHEE", it: "la moschea", itSyl: "mo-SCHE-a", en: "mosque", x: 122, y: 112, kunst: k,
    tipp: "Die Blaue Moschee hat sechs Minarette. Innen ist sie mit über 20 000 blauen Fliesen geschmückt." });
}

/* =====================================================================
   2 — DER BOSPORUS (Blick hinunter aufs Wasser) und 3 — DAS BOOT
   ===================================================================== */
{
  const Y0 = yAt(25);
  let k = "";
  /* asiatisches Ufer mit Üsküdar im Dunst */
  k += `<path d="M0 -6 Q14 -12 30 -10 Q48 -14 64 -9 Q80 -12 96 -7 L96 0 L0 0 Z" fill="${S.lg("ufer", [[0, "#a7a3b4"], [1, "#8e8a9c"]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = 2 + rnd() * 92, h = 1.2 + rnd() * 2.6; k += `<rect x="${r(x)}" y="${r(-3 - h - rnd() * 3)}" width="${r(1.4 + rnd() * 2)}" height="${r(h)}" fill="${rnd() < 0.5 ? "#c7c1c9" : "#b3aebb"}" opacity=".85"/>`; }
  k += `<rect x="40" y="-17" width=".8" height="8" fill="#b3aebb"/><rect x="72" y="-15" width=".7" height="7" fill="#b3aebb"/>`;
  /* das Wasser */
  k += `<rect x="0" y="0" width="96" height="${r(Y0 - HOR)}" fill="${S.lg("wasser", [[0, "#5f86a8"], [0.5, "#4a7697"], [1, "#3a6585"]])}"/>`;
  for (let i = 0; i < 40; i++) { const y = 1 + rnd() * (Y0 - HOR - 2), w = 1.5 + rnd() * 5; k += `<rect x="${r(rnd() * 92)}" y="${r(y)}" width="${r(w)}" height=".25" fill="#f6d8b4" opacity="${r(0.25 + rnd() * 0.4)}"/>`; }
  /* Leanderturm auf seiner Insel */
  k += `<ellipse cx="22" cy="2.6" rx="4.6" ry=".9" fill="#7a7468"/><rect x="17.4" y="-1.4" width="9.2" height="4" fill="#ece6da"/><rect x="20.6" y="-6.8" width="2.8" height="5.4" fill="#f2ede3"/><path d="M20.2 -6.8 L22 -10 L23.8 -6.8 Z" fill="#7d8996"/><line x1="22" y1="-10" x2="22" y2="-11.4" stroke="${GOLD}" stroke-width=".25"/>`;
  k += `<rect x="0" y="0" width="96" height="${r(Y0 - HOR)}" fill="${S.lg("wasserlicht", [[0, "#ffe2b8", 0.25], [1, "#ffe2b8", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ anker: [256, 112], id: "bosporus", de: "der Bosporus", syl: "BOS-po-rus", it: "il Bosforo", itSyl: "BO-sfo-ro", en: "Bosphorus", x: 224, y: HOR, kunst: k,
    tipp: "Der Bosporus trennt Europa und Asien. Istanbul liegt auf beiden Seiten." });
}
{
  let k = `<ellipse cx="0" cy=".5" rx="14" ry="1.1" fill="#2c4f6c" opacity=".5"/>`;
  k += `<path d="M-13 -3.4 L12 -3.4 Q14 -3.2 13.6 -1.4 L12 .4 L-12 .4 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d6d2c8"]])}"/>`;
  k += `<rect x="-12.6" y="-1.6" width="25" height=".8" fill="#2b2b2b"/>`;
  k += `<rect x="-9" y="-6.6" width="17" height="3.2" fill="#fbfaf6"/><rect x="-6" y="-9" width="10" height="2.4" fill="#fbfaf6"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${r(-8.4 + i * 2)}" y="-5.8" width="1.2" height="1.2" fill="#3b4a58"/>`;
  k += `<rect x="-.6" y="-12.4" width="2" height="3.4" fill="#f3f1ea"/><rect x="-.6" y="-12.4" width="2" height="1" fill="#1d1d1d"/>`;
  k += `<path d="M14 -1 Q18 -.6 22 .4" stroke="#f3f4f2" stroke-width=".5" opacity=".7" fill="none"/>`;
  S.teil({ id: "boot", de: "das Boot", syl: "BOOT", it: "la barca", itSyl: "BAR-ca", en: "boat", x: 278, y: 127, kunst: k + flaeche(-14, -13, 28, 14),
    tipp: "Mit den Stadtdampfern („Vapur“) fährt man in Istanbul von Europa nach Asien." });
}

/* =====================================================================
   4 — DER BASAR (Arasta-Basar) — Lupe: Lampe, Nazar-Auge, Teller, Kanne
   ===================================================================== */
const basarUnter = [];
{
  const Y = yAt(25), u = uAt(25);    /* 137,2; 12 je Meter */
  const H = 4 * u;
  let k = "";
  k += `<rect x="0" y="${-H}" width="226" height="${H}" fill="${STEIN}"/>`;
  for (let y = -H + 4; y < 0; y += 3.2) k += `<line x1="0" y1="${r(y)}" x2="226" y2="${r(y)}" stroke="#a69c88" stroke-width=".18" opacity=".6"/>`;
  k += `<rect x="-1" y="${-H - 2.6}" width="228" height="3" fill="#e9e2d4"/><rect x="-1" y="${-H + 0.4}" width="228" height="1" fill="#9f9583"/>`;
  /* kleine Bleikuppeln auf dem Dach */
  for (let x = 14; x < 226; x += 26) k += `<path d="M${x - 6} ${-H - 2.6} Q${x - 6} ${-H - 8} ${x} ${-H - 8.4} Q${x + 6} ${-H - 8} ${x + 6} ${-H - 2.6} Z" fill="${BLEI_K}"/>`;
  /* Ladenbögen mit warm beleuchtetem Inneren */
  const BOGEN = [];
  for (let i = 0; i < 8; i++) BOGEN.push(6 + i * 27.4);
  for (const x0 of BOGEN) {
    const w = 22, top = -H + 9;
    k += `<path d="M${x0 - 1.4} 0 L${x0 - 1.4} ${top + 5} Q${x0 + w / 2} ${top - 6} ${x0 + w + 1.4} ${top + 5} L${x0 + w + 1.4} 0 Z" fill="#c9bfab"/>`;
    k += `<path d="M${x0} 0 L${x0} ${top + 5} Q${x0 + w / 2} ${top - 4} ${x0 + w} ${top + 5} L${x0 + w} 0 Z" fill="${S.lg("laden", [[0, "#7a4a24"], [0.6, "#5a3418"], [1, "#3a2210"]])}"/>`;
    k += `<path d="M${x0} 0 L${x0} ${top + 5} Q${x0 + w / 2} ${top - 4} ${x0 + w} ${top + 5} L${x0 + w} 0 Z" fill="${S.rg("ladenlicht", [[0, "#ffcf7a", 0.55], [1, "#ffcf7a", 0]], 0.5, 0.3, 0.7)}"/>`;
    /* Regal mit Waren hinten */
    for (let j = 0; j < 3; j++) k += `<rect x="${r(x0 + 1.5)}" y="${r(-14 + j * 4.6)}" width="${w - 3}" height=".7" fill="#8a5a32"/>`;
    for (let j = 0; j < 9; j++) k += `<rect x="${r(x0 + 2 + rnd() * (w - 5))}" y="${r(-17 + Math.floor(rnd() * 3) * 4.6)}" width="${r(1.2 + rnd() * 1.6)}" height="2.6" rx=".5" fill="${["#c0392b", "#2e6da4", "#e2b33a", "#2f8a6a", "#e9e2d4", "#8e44ad"][Math.floor(rnd() * 6)]}"/>`;
  }
  /* Waren im ersten Bogen links (Lupe) */
  const a = BOGEN[2], b = BOGEN[3], c = BOGEN[5];
  /* DIE LAMPE: osmanische Mosaiklampen hängen im Bogen */
  let lampen = "";
  for (const [dx, dy, f] of [[5, -33, "#d94a3a"], [11, -30, "#2e8ac9"], [17, -33, "#e8b23a"], [8, -26, "#3aa36a"], [14, -26, "#9b4ac9"]]) {
    lampen += `<line x1="${a + dx}" y1="${-H + 6}" x2="${a + dx}" y2="${dy - 2.4}" stroke="#c9a046" stroke-width=".2"/>`;
    lampen += `<ellipse cx="${a + dx}" cy="${dy}" rx="2.1" ry="2.5" fill="${f}"/><ellipse cx="${a + dx}" cy="${dy}" rx="2.1" ry="2.5" fill="${S.rg("lampenglanz", [[0, "#fff6c8", 0.75], [1, "#fff6c8", 0]], 0.45, 0.4, 0.6)}"/>`;
    lampen += `<path d="M${a + dx - 2} ${dy - 0.4} h4 M${a + dx - 1.6} ${dy + 1.2} h3.2" stroke="#f3e2a4" stroke-width=".2"/><rect x="${a + dx - 0.6}" y="${dy - 3.2}" width="1.2" height=".8" fill="${MESSING}"/>`;
  }
  k += lampen;
  basarUnter.push({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: a + 11, y: Y - 22, kunst: flaeche(-9, -16, 18, 14),
    tipp: "Die bunten Mosaiklampen werden aus vielen kleinen Glasstücken gemacht." });
  /* DAS NAZAR-AUGE: Schnüre mit blauen Glasaugen */
  let naz = "";
  const auge = (x, y, s) => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.5 * s)}" fill="#1c3f9a"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(1.05 * s)}" fill="#f6f6f2"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(0.7 * s)}" fill="#5fb7e8"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(0.35 * s)}" fill="#111"/><circle cx="${r(x - 0.5 * s)}" cy="${r(y - 0.5 * s)}" r="${r(0.25 * s)}" fill="#fff" opacity=".8"/>`;
  for (const dx of [4, 10, 16]) {
    naz += `<line x1="${b + dx}" y1="${-H + 6}" x2="${b + dx}" y2="-10" stroke="#c9a046" stroke-width=".2"/>`;
    for (let i = 0; i < 4; i++) naz += auge(b + dx, -30 + i * 5, 0.8);
  }
  naz += auge(b + 10, -12.5, 1.4);
  k += naz;
  basarUnter.push({ id: "nazar", de: "das Nazar-Auge", syl: "NA-zar-Au-ge", it: "l'occhio di Allah", itSyl: "OC-chio di al-LAH", en: "nazar amulet", x: b + 10, y: Y - 9, kunst: flaeche(-9, -26, 18, 26),
    tipp: "Das blaue Nazar-Auge soll vor dem „bösen Blick“ schützen." });
  /* DER TELLER: Iznik-Teller und DIE KANNE: Kupferkannen */
  let tel = "";
  for (const [dx, dy, rr] of [[6, -28, 4], [16, -28, 4], [11, -19, 4.4]]) {
    tel += `<circle cx="${c + dx}" cy="${dy}" r="${rr}" fill="#f8f6f0" stroke="#1f4f9a" stroke-width=".5"/><circle cx="${c + dx}" cy="${dy}" r="${rr * 0.55}" fill="none" stroke="#2f9a9a" stroke-width=".4"/>`;
    for (let i = 0; i < 6; i++) { const w = i * Math.PI / 3; tel += `<ellipse cx="${r(c + dx + Math.cos(w) * rr * 0.75)}" cy="${r(dy + Math.sin(w) * rr * 0.75)}" rx=".7" ry=".4" fill="${i % 2 ? "#c0392b" : "#1f4f9a"}"/>`; }
    tel += `<path d="M${r(c + dx - 0.6)} ${r(dy + 0.6)} q.6 -1.6 1.2 0" fill="#c0392b"/>`;
  }
  k += tel;
  basarUnter.push({ id: "teller", de: "der Teller", syl: "TEL-ler", it: "il piatto", itSyl: "PIAT-to", en: "plate", x: c + 11, y: Y - 14, kunst: flaeche(-10, -19, 20, 19),
    tipp: "Iznik-Keramik: weiß mit blauen, türkisen und roten Tulpen." });
  let kan = "";
  for (const [dx, s] of [[5, 1], [12, 0.8], [18, 0.9]]) {
    const x = c + dx, y = -1.2;
    kan += `<path d="M${r(x - 2.2 * s)} ${y} Q${r(x - 3 * s)} ${r(y - 3 * s)} ${r(x - 1.1 * s)} ${r(y - 5 * s)} L${r(x - 1.1 * s)} ${r(y - 7 * s)} L${r(x + 1.1 * s)} ${r(y - 7 * s)} L${r(x + 1.1 * s)} ${r(y - 5 * s)} Q${r(x + 3 * s)} ${r(y - 3 * s)} ${r(x + 2.2 * s)} ${y} Z" fill="${S.lg("kupfer", [[0, "#e89a5a"], [0.5, "#b8622a"], [1, "#7a3a14"]], 0, 0, 1, 0)}"/>`;
    kan += `<path d="M${r(x + 1.6 * s)} ${r(y - 4.6 * s)} L${r(x + 3.6 * s)} ${r(y - 7 * s)}" stroke="#b8622a" stroke-width="${r(0.6 * s)}"/><path d="M${r(x - 2 * s)} ${r(y - 2 * s)} q-1.6 -1.6 0 -4" stroke="#7a3a14" stroke-width="${r(0.4 * s)}" fill="none"/>`;
  }
  k += kan;
  basarUnter.push({ id: "kanne", de: "die Kanne", syl: "KAN-ne", it: "la brocca", itSyl: "BROC-ca", en: "jug", x: c + 11, y: Y - 1, kunst: flaeche(-10, -8, 20, 8) });
  k += `<rect x="0" y="${-H - 3}" width="226" height="${H + 3}" fill="${S.lg("basarlicht", [[0, "#ffe2b8", 0.3], [1, "#ffe2b8", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ anker: [176, 96], id: "basar", de: "der Basar", syl: "Ba-SAR", it: "il bazar", itSyl: "ba-ZAR", en: "bazaar", x: 0, y: Y, kunst: k,
    zoom: { x: 52, y: Y - H - 4, w: 120, h: 80 }, unter: basarUnter,
    tipp: "Der Arasta-Basar gehört zur Blauen Moschee. Hier gibt es Teppiche, Keramik und Lampen." });
}

/* =====================================================================
   5 — DIE FLAGGE über dem Basar
   ===================================================================== */
{
  const W = 18, Hf = 12;
  let k = `<line x1="0" y1="0" x2="0" y2="-38" stroke="#d9d6cf" stroke-width=".7"/><circle cx="0" cy="-38.4" r=".7" fill="${GOLD}"/>`;
  let f = `<rect width="${W}" height="${Hf}" fill="#e30a17"/>`;
  /* Halbmond und Stern nach dem Flaggengesetz (vereinfacht) */
  f += `<circle cx="${r(Hf * 0.5)}" cy="${Hf / 2}" r="${r(Hf * 0.25)}" fill="#fff"/><circle cx="${r(Hf * 0.5625)}" cy="${Hf / 2}" r="${r(Hf * 0.2)}" fill="#e30a17"/>`;
  const sx = Hf * 0.5625 + Hf * 0.2 + Hf * 0.1, sr = Hf * 0.125;
  let st = "";
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5 + Math.PI / 2, rr = i % 2 ? sr * 0.38 : sr; st += `${i ? "L" : "M"}${r(sx + Math.cos(a - Math.PI / 2) * rr)} ${r(Hf / 2 + Math.sin(a - Math.PI / 2) * rr)} `; }
  f += `<path d="${st}Z" fill="#fff" transform="rotate(-90 ${r(sx)} ${Hf / 2})"/>`;
  f += `<path d="M5 0 Q7 6 5 12" stroke="#000" stroke-width="2" opacity=".1" fill="none"/><path d="M13 0 Q15 6 13 12" stroke="#fff" stroke-width="1.4" opacity=".14" fill="none"/>`;
  k += `<g transform="translate(.3 -37.8) skewY(5)">${f}</g>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 204, y: r(yAt(25) - 48 - 2.6), kunst: k + flaeche(-1.4, -39, 21, 15),
    tipp: "Die türkische Flagge: ein weißer Halbmond und ein Stern auf Rot." });
}

/* =====================================================================
   6 — DER TEPPICH vor dem Teppichladen
   ===================================================================== */
{
  const u = uAt(24);
  const W = 1.9 * u, H = 2.9 * u;
  S.def(`<pattern id="${S.id("knoten")}" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#9b1d24"/><circle cx="1" cy="1" r=".45" fill="#b02a30"/></pattern>`);
  let k = `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 1.4)}" width="${r(W + 2)}" height="1" fill="#6b4a2a"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="url(#${S.id("knoten")})"/>`;
  k += `<rect x="${r(-W / 2 + 1.2)}" y="${r(-H + 1.2)}" width="${r(W - 2.4)}" height="${r(H - 2.4)}" fill="none" stroke="#1f2f5a" stroke-width="2"/>`;
  k += `<rect x="${r(-W / 2 + 2.6)}" y="${r(-H + 2.6)}" width="${r(W - 5.2)}" height="${r(H - 5.2)}" fill="none" stroke="#e2b33a" stroke-width=".5"/>`;
  /* Medaillon und Eckmotive */
  k += `<path d="M0 ${r(-H / 2 - 10)} L7 ${r(-H / 2)} L0 ${r(-H / 2 + 10)} L-7 ${r(-H / 2)} Z" fill="#1f2f5a"/><path d="M0 ${r(-H / 2 - 6.6)} L4.4 ${r(-H / 2)} L0 ${r(-H / 2 + 6.6)} L-4.4 ${r(-H / 2)} Z" fill="#e9dcc0"/><circle cx="0" cy="${r(-H / 2)}" r="1.8" fill="#9b1d24"/>`;
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k += `<path d="M${r(sx * (W / 2 - 3.4))} ${r(-H / 2 + sy * (H / 2 - 3.4))} l${-sx * 4} 0 l${sx * 4} ${-sy * 4} Z" fill="#1f2f5a"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${r(-W / 2 + 1 + i * (W - 2) / 8)}" y1="0" x2="${r(-W / 2 + 1 + i * (W - 2) / 8)}" y2="1.6" stroke="#efe6d2" stroke-width=".3"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("teppichlicht", [[0, "#fff", 0.1], [1, "#000", 0.15]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "teppich", de: "der Teppich", syl: "TEP-pich", it: "il tappeto", itSyl: "tap-PE-to", en: "carpet", x: 166, y: r(yAt(24) - 1.6), kunst: k,
    tipp: "Ein handgeknüpfter Teppich hat oft über eine Million Knoten." });
}

/* =====================================================================
   7 — DER SAFTSTAND und DER GRANATAPFEL (rechts)
   ===================================================================== */
const SAFT = { x: 278, d: 8.2 };
{
  const u = uAt(SAFT.d), Y = yAt(SAFT.d);
  const H = 0.95 * u, W = 1.25 * u;
  let k = schatten(0, 0.4, W / 2 + 2, 2, 0.35);
  /* Wagen: Holzkasten mit Messingkante, zwei Speichenräder */
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H - 6)}" rx="1" fill="${S.lg("saftholz", [[0, "#2f7a4a"], [1, "#1d5232"]])}"/>`;
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 1.4)}" width="${r(W + 2)}" height="2" rx=".6" fill="${MESSING}"/>`;
  k += `<text x="0" y="${r(-H + 13)}" font-size="5.4" text-anchor="middle" fill="#f6e3a0" font-family="Georgia,serif" font-weight="bold" letter-spacing=".5">NAR SUYU</text>`;
  k += `<text x="0" y="${r(-H + 19)}" font-size="3" text-anchor="middle" fill="#f6e3a0" font-family="Arial,Helvetica,sans-serif">Granatapfelsaft · 40 ₺</text>`;
  for (const x of [-W / 2 + 7, W / 2 - 7]) {
    k += `<circle cx="${r(x)}" cy="-6" r="6" fill="none" stroke="#5a3a1e" stroke-width="1.1"/><circle cx="${r(x)}" cy="-6" r="1" fill="${MESSING}"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; k += `<line x1="${r(x)}" y1="-6" x2="${r(x + Math.cos(a) * 5.6)}" y2="${r(-6 + Math.sin(a) * 5.6)}" stroke="#5a3a1e" stroke-width=".4"/>`; }
  }
  /* Handpresse aus Stahl rechts, Gläser, Kanne mit Saft */
  const px = W / 2 - 8;
  k += `<rect x="${r(px - 3)}" y="${r(-H - 1.6)}" width="6" height="1.6" fill="#9aa3aa"/><rect x="${r(px - 0.8)}" y="${r(-H - 20)}" width="1.6" height="18.4" fill="${S.lg("presse", [[0, "#e8ecef"], [1, "#8a9399"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(px)} ${r(-H - 19)} L${r(px - 11)} ${r(-H - 15)}" stroke="#b5bcc2" stroke-width="1.2" stroke-linecap="round"/><path d="M${r(px - 3.2)} ${r(-H - 9)} Q${r(px)} ${r(-H - 12)} ${r(px + 3.2)} ${r(-H - 9)} Z" fill="#c9cfd4"/>`;
  k += `<path d="M${r(px - 2.4)} ${r(-H - 7)} L${r(px + 2.4)} ${r(-H - 7)} L${r(px + 1.6)} ${r(-H - 2)} L${r(px - 1.6)} ${r(-H - 2)} Z" fill="#c9cfd4"/>`;
  for (const dx of [20.6]) k += `<path d="M${r(dx - 1.6)} ${r(-H - 6.4)} L${r(dx + 1.6)} ${r(-H - 6.4)} L${r(dx + 1.3)} ${r(-H - 1.4)} L${r(dx - 1.3)} ${r(-H - 1.4)} Z" fill="#9a1030"/><path d="M${r(dx - 1.6)} ${r(-H - 6.4)} L${r(dx + 1.6)} ${r(-H - 6.4)} L${r(dx + 1.3)} ${r(-H - 1.4)} L${r(dx - 1.3)} ${r(-H - 1.4)} Z" fill="${GLAS}"/>`;
  S.teil({ id: "saftstand", de: "der Saftstand", syl: "SAFT-stand", it: "il chiosco dei succhi", itSyl: "CHIO-sco dei SUC-chi", en: "juice stand", x: SAFT.x, y: Y, steht: true, kunst: k,
    tipp: "Hier presst der Verkäufer frischen Granatapfelsaft mit der Hand." });
}
{
  const u = uAt(SAFT.d), H = 0.95 * u;
  let k = "";
  const pos = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6 - row * 2; i++) pos.push([-14 + row * 4.6 + i * 5.2, -row * 4]);
  for (const [x, y] of pos) {
    k += `<circle cx="${r(x)}" cy="${r(y - 2.6)}" r="2.7" fill="${S.rg("nar", [[0, "#f0505a"], [0.6, "#c41e33"], [1, "#7a0d1e"]], 0.38, 0.32, 0.8)}"/>`;
    k += `<path d="M${r(x - 0.7)} ${r(y - 5.2)} l.3 -.9 l.4 .6 l.4 -.6 l.3 .9 Z" fill="#8a1a24"/><ellipse cx="${r(x - 0.9)}" cy="${r(y - 3.6)}" rx=".8" ry=".45" fill="#fff" opacity=".35"/>`;
  }
  /* ein aufgeschnittener mit Kernen */
  k += `<ellipse cx="14" cy="-2.4" rx="3" ry="2.2" fill="#c41e33"/><ellipse cx="14" cy="-2.6" rx="2.3" ry="1.5" fill="#f4e2c8"/>`;
  for (let i = 0; i < 9; i++) k += `<circle cx="${r(12.6 + (i % 3) * 1.4)}" cy="${r(-3.4 + Math.floor(i / 3) * 0.8)}" r=".42" fill="#b3122a"/>`;
  S.teil({ oben: true, id: "granatapfel", de: "der Granatapfel", syl: "Gra-NAT-ap-fel", it: "il melograno", itSyl: "me-lo-GRA-no", en: "pomegranate", x: SAFT.x - 8, y: r(yAt(SAFT.d) - H - 0.6), steht: true, kunst: k + flaeche(-17, -14.4, 35, 14.6),
    tipp: "Der Granatapfel ist innen voller roter Kerne. Sein Saft ist süß-sauer." });
}

/* =====================================================================
   8 — DER IMBISS (Döner-Bude links, mit Holzerker) und 9 — DER DÖNER
   ===================================================================== */
const IMB = { d: 9 };
{
  const u = uAt(IMB.d), Y = yAt(IMB.d);     /* 33,3 je Meter, y 171,3 */
  let k = "";
  /* Obergeschoss: osmanischer Holzerker (Cumba) */
  k += `<rect x="-2" y="${r(-4 * u)}" width="66" height="${r(4 * u - 2.6 * u)}" fill="${S.lg("putz", [[0, "#e7c9a4"], [1, "#d3ae84"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M2 ${r(-2.6 * u)} L6 ${r(-2.6 * u - 6)} L58 ${r(-2.6 * u - 6)} L62 ${r(-2.6 * u)} Z" fill="#6b4226"/>`;
  k += `<rect x="6" y="${r(-4 * u + 4)}" width="52" height="${r(1.4 * u - 10)}" fill="${S.lg("erker", [[0, "#8a5a32"], [1, "#6b4226"]])}"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 9 + i * 12.4;
    k += `<rect x="${x}" y="${r(-4 * u + 8)}" width="9" height="${r(1.4 * u - 22)}" fill="${S.lg("erkerglas", [[0, "#f6d69a"], [1, "#b88a4a"]])}"/>`;
    k += `<line x1="${x + 4.5}" y1="${r(-4 * u + 8)}" x2="${x + 4.5}" y2="${r(-2.6 * u - 14)}" stroke="#6b4226" stroke-width=".7"/><rect x="${x}" y="${r(-2.6 * u - 12.4)}" width="9" height="4" fill="#5a3418"/>`;
  }
  k += `<rect x="4" y="${r(-4 * u)}" width="56" height="4" fill="#5a3418"/><path d="M2 ${r(-4 * u)} L62 ${r(-4 * u)} L58 ${r(-4 * u - 5)} L6 ${r(-4 * u - 5)} Z" fill="${S.lg("ziegel", [[0, "#b8562e"], [1, "#8a3a1e"]])}"/>`;
  /* Erdgeschoss: Ladenfront mit Schild und großem Fenster */
  k += `<rect x="-2" y="${r(-2.6 * u)}" width="66" height="${r(2.6 * u)}" fill="#e6ddcf"/>`;
  k += `<rect x="-2" y="${r(-2.6 * u)}" width="66" height="10" fill="${ROT}"/><text x="31" y="${r(-2.6 * u + 7.4)}" font-size="5.4" text-anchor="middle" fill="#fff6dc" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="bold" letter-spacing=".4">DÖNER · KEBAP</text>`;
  k += `<rect x="2" y="${r(-2.6 * u + 13)}" width="40" height="${r(2.6 * u - 30)}" fill="${S.lg("bude", [[0, "#5a3a22"], [1, "#2e1d10"]])}"/>`;
  /* Grillwand hinter dem Spieß: glühende Heizstäbe */
  k += `<rect x="14" y="${r(-21 - 0.8 * u - 4)}" width="16" height="${r(0.8 * u + 3)}" rx="1" fill="#3a2a22"/>`;
  for (let y = -21 - 0.8 * u - 2.6; y < -22; y += 3) k += `<rect x="15.4" y="${r(y)}" width="13.2" height="1.4" rx=".6" fill="${S.lg("glut", [[0, "#ffb347"], [1, "#e0541e"]])}"/>`;
  /* Preistafel über dem Grill */
  k += `<rect x="4" y="${r(-2.6 * u + 16)}" width="36" height="13" rx=".8" fill="#1d1a17" stroke="#c9a046" stroke-width=".4"/>`;
  [["Döner Dürüm", "180 ₺"], ["Döner Ekmek", "160 ₺"], ["Ayran", "30 ₺"]].forEach(([a, b], i) => { k += `<text x="6" y="${r(-2.6 * u + 20 + i * 3.6)}" font-size="2.4" fill="#f6e3a0" font-family="Arial,Helvetica,sans-serif">${a}</text><text x="38" y="${r(-2.6 * u + 20 + i * 3.6)}" font-size="2.4" text-anchor="end" fill="#f6e3a0" font-family="Arial,Helvetica,sans-serif">${b}</text>`; });
  /* Theke mit Glas */
  k += `<rect x="0" y="-19" width="44" height="19" fill="${S.lg("theke", [[0, "#d9d2c5"], [1, "#a9a092"]])}"/><rect x="0" y="-19.6" width="44" height="1.6" fill="#f2efe7"/>`;
  k += `<rect x="3" y="-17" width="38" height="8" fill="#e9f2f2" opacity=".55"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${5 + i * 9}" y="-14" width="7" height="4" rx=".6" fill="${["#c0392b", "#6aa84f", "#f1c232", "#e9e2d4"][i]}"/>`;
  /* Tür rechts */
  k += `<rect x="46" y="${r(-2.6 * u + 13)}" width="14" height="${r(2.6 * u - 13)}" fill="#3a2818"/><rect x="48" y="${r(-2.6 * u + 16)}" width="10" height="${r(2.6 * u - 30)}" fill="${S.lg("tuerglas", [[0, "#8aa3b5"], [1, "#4f6577"]])}"/>`;
  k += `<rect x="-2" y="-1.4" width="66" height="1.4" fill="#6d6559"/>`;
  k += `<rect x="62" y="${r(-4 * u)}" width="2" height="${r(4 * u)}" fill="#000" opacity=".15"/>`;
  S.teil({ anker: [31, yAt(IMB.d)], id: "imbiss", de: "der Imbiss", syl: "IM-biss", it: "la tavola calda", itSyl: "TA-vo-la CAL-da", en: "snack bar", x: 0, y: Y, steht: true, kunst: k });
}
{
  const u = uAt(IMB.d);
  const bot = -21, top = bot - 0.8 * u;
  let k = `<line x1="0" y1="${r(top - 3)}" x2="0" y2="${r(bot + 2)}" stroke="#c9cfd4" stroke-width=".8"/>`;
  k += `<path d="M-5.6 ${r(top)} L5.6 ${r(top)} L3 ${r(bot)} L-3 ${r(bot)} Z" fill="${S.lg("fleisch", [[0, "#6e3416"], [0.35, "#a8642e"], [0.6, "#8a4a20"], [1, "#4e220c"]], 0, 0, 1, 0)}"/>`;
  for (let y = top + 2; y < bot - 1; y += 2.2) k += `<path d="M${r(-5.4 + (y - top) * 0.1)} ${r(y)} Q0 ${r(y + 0.9)} ${r(5.4 - (y - top) * 0.1)} ${r(y)}" stroke="#c98a4a" stroke-width=".35" opacity=".7" fill="none"/>`;
  k += `<path d="M-5.6 ${r(top)} L-3 ${r(bot)}" stroke="#3a1a08" stroke-width=".6"/>`;
  k += `<rect x="-4" y="${r(top - 2)}" width="8" height="1.4" rx=".4" fill="#c9cfd4"/><rect x="-3" y="${r(bot)}" width="6" height="1.2" fill="#c9cfd4"/>`;
  k += `<path d="M2.6 ${r(top + 6)} L7.4 ${r(top + 4)} L7.8 ${r(top + 5)}" stroke="#d9dde0" stroke-width=".7" fill="none"/>`;
  S.teil({ anker: [22, 130], oben: true, id: "doener", de: "der Döner", syl: "DÖ-ner", it: "il kebab", itSyl: "ke-BAB", en: "kebab", x: 22, y: yAt(IMB.d), kunst: k + flaeche(-6.4, top - 3, 12.8, bot - top + 4.4),
    tipp: "Döner heißt „der Drehende“: Das Fleisch dreht sich am Spieß vor dem Grill." });
}

/* =====================================================================
   10 — DER VERKAUFSWAGEN (Simit-Wagen) und 11 — DER SESAMRING
   ===================================================================== */
const WAG = { x: 92, d: 8 };
{
  const u = uAt(WAG.d), Y = yAt(WAG.d);   /* 37,5 je Meter */
  const H = 0.95 * u, W = 1.1 * u;
  let k = schatten(0, 0.4, W / 2 + 2, 2, 0.35);
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H - 7)}" rx="1.2" fill="${ROT}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="2" fill="#f3d27a"/><rect x="${r(-W / 2)}" y="-9" width="${r(W)}" height="1.4" fill="#8a0d14"/>`;
  k += `<text x="0" y="${r(-H + 12)}" font-size="6.6" text-anchor="middle" fill="#fff6dc" font-family="Georgia,serif" font-weight="bold" letter-spacing=".8">SİMİT</text>`;
  k += `<text x="0" y="${r(-H + 18)}" font-size="2.8" text-anchor="middle" fill="#fff6dc" font-family="Arial,Helvetica,sans-serif">taze · 15 ₺</text>`;
  for (const x of [-W / 2 + 6, W / 2 - 6]) k += `<circle cx="${r(x)}" cy="-5.4" r="5.4" fill="#1d1d1d"/><circle cx="${r(x)}" cy="-5.4" r="3" fill="#b9bfc4"/><circle cx="${r(x)}" cy="-5.4" r=".9" fill="#555"/>`;
  k += `<path d="M${r(W / 2)} ${r(-H + 6)} L${r(W / 2 + 8)} ${r(-H + 2)}" stroke="#2a2a2a" stroke-width="1" stroke-linecap="round"/>`;
  /* Glaskasten oben (die Sesamringe darin malt das eigene Teil) */
  k += `<rect x="${r(-W / 2 + 1)}" y="${r(-H - 0.55 * u)}" width="${r(W - 2)}" height="${r(0.55 * u)}" fill="#f2e6d0" opacity=".35"/>`;
  k += `<rect x="${r(-W / 2 + 1)}" y="${r(-H - 0.55 * u)}" width="${r(W - 2)}" height="${r(0.55 * u)}" fill="none" stroke="#c9a046" stroke-width=".8"/>`;
  k += `<path d="M${r(-W / 2)} ${r(-H - 0.55 * u)} L0 ${r(-H - 0.55 * u - 5)} L${r(W / 2)} ${r(-H - 0.55 * u)} Z" fill="${ROT}"/>`;
  S.davor(`<g transform="translate(${WAG.x} ${r(Y)})"><path d="M${r(-W / 2 + 3)} ${r(-H - 0.55 * u + 2)} L${r(-W / 2 + 10)} ${r(-H - 0.55 * u + 2)} L${r(-W / 2 + 3)} ${r(-H - 4)} Z" fill="#fff" opacity=".22"/><rect x="${r(-W / 2 + 1)}" y="${r(-H - 0.55 * u)}" width="${r(W - 2)}" height="${r(0.55 * u)}" fill="${GLAS}" opacity=".6"/></g>`);
  S.teil({ id: "wagen", de: "der Verkaufswagen", syl: "ver-KAUFS-wa-gen", it: "il carretto", itSyl: "car-RET-to", en: "street cart", x: WAG.x, y: Y, steht: true, kunst: k });
}
{
  const u = uAt(WAG.d), H = 0.95 * u, W = 1.1 * u;
  let k = "";
  const ring = (x, y, s) => {
    let g = `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(4.2 * s)}" ry="${r(2.2 * s)}" fill="${S.lg("simit", [[0, "#c9772e"], [1, "#8a4a18"]])}"/>`;
    g += `<ellipse cx="${r(x)}" cy="${r(y - 0.2 * s)}" rx="${r(1.8 * s)}" ry="${r(0.7 * s)}" fill="#3a2414"/>`;
    for (let i = 0; i < 8; i++) { const a = rnd() * Math.PI * 2; g += `<ellipse cx="${r(x + Math.cos(a) * 3 * s)}" cy="${r(y + Math.sin(a) * 1.5 * s)}" rx=".35" ry=".2" fill="#f6e2b0"/>`; }
    return g;
  };
  for (let row = 0; row < 4; row++) for (let i = 0; i < 4; i++) k += ring(-W / 2 + 7 + i * 9.6 + (row % 2) * 2, -H - 3 - row * 4.2, 1);
  S.teil({ anker: [92, 132], oben: true, id: "simit", de: "der Sesamring", syl: "SE-sam-ring", it: "la ciambella al sesamo", itSyl: "ciam-BEL-la al SE-sa-mo", en: "sesame ring", x: WAG.x, y: yAt(WAG.d), steht: true, kunst: k + flaeche(-W / 2 + 1, -H - 0.55 * u, W - 2, 0.55 * u),
    tipp: "Auf Türkisch heißt er „Simit“ – das Frühstück für unterwegs, außen knusprig mit Sesam." });
}

/* =====================================================================
   12 — DAS SCHILD (Reisebüro-Aufsteller) und 13 — DER HEISSLUFTBALLON
   ===================================================================== */
const SCH = { x: 130, d: 7.4 };
{
  const u = uAt(SCH.d), Y = yAt(SCH.d);
  const H = 1.1 * u, W = 0.62 * u;
  let k = schatten(0, 0.4, W / 2 + 2, 1.6, 0.35);
  k += `<path d="M${r(-W / 2 - 1)} 0 L${r(-W / 2 + 2)} ${r(-H)} L${r(W / 2 - 2)} ${r(-H)} L${r(W / 2 + 1)} 0" stroke="#3a3a3a" stroke-width="1.2" fill="none"/>`;
  k += `<rect x="${r(-W / 2 + 1)}" y="${r(-H + 1)}" width="${r(W - 2)}" height="${r(H * 0.82)}" fill="#fbf8f0"/>`;
  k += `<rect x="${r(-W / 2 + 2.4)}" y="${r(-H + 9)}" width="${r(W - 4.8)}" height="${r(H * 0.4)}" fill="${S.lg("kappadokien", [[0, "#f6b26b"], [0.5, "#f9d9a9"], [1, "#e7c9a0"]])}"/>`;
  /* Feenkamine (Felsen) unten im Bild */
  const by = -H + 9 + H * 0.4;
  k += `<path d="M${r(-W / 2 + 2.4)} ${r(by)} L${r(-W / 2 + 2.4)} ${r(by - 5)} L-6 ${r(by - 9)} L-4 ${r(by - 4)} L1 ${r(by - 7)} L3 ${r(by - 3)} L${r(W / 2 - 2.4)} ${r(by - 6)} L${r(W / 2 - 2.4)} ${r(by)} Z" fill="#c99a6a"/>`;
  k += `<text x="0" y="${r(-H + 6.4)}" font-size="3.6" text-anchor="middle" fill="#a8241e" font-family="Georgia,serif" font-weight="bold">KAPADOKYA</text>`;
  k += `<text x="0" y="${r(by + 3.6)}" font-size="2.3" text-anchor="middle" fill="#2a2a2a" font-family="Arial,Helvetica,sans-serif">Ballonfahrt</text>`;
  k += `<text x="0" y="${r(by + 6.8)}" font-size="2.3" text-anchor="middle" fill="#2a2a2a" font-family="Arial,Helvetica,sans-serif">Tour 2 Tage</text>`;
  /* kleine ferne Ballone im Bild */
  for (const [x, y, f] of [[-6.6, -H + 13, "#3a7fc0"], [7, -H + 12, "#e2b33a"]]) k += `<ellipse cx="${x}" cy="${r(y)}" rx="1.6" ry="1.9" fill="${f}"/><rect x="${x - 0.5}" y="${r(y + 2.2)}" width="1" height=".8" fill="#6b4a2a"/>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: SCH.x, y: Y, steht: true, kunst: k,
    tipp: "Das Reisebüro wirbt für eine Ballonfahrt in Kappadokien, in der Mitte der Türkei." });
}
{
  const u = uAt(SCH.d), H = 1.1 * u;
  const cy = -H + 19.4;
  let k = `<path d="M-5.6 ${r(cy)} Q-6 ${r(cy - 9)} 0 ${r(cy - 9.4)} Q6 ${r(cy - 9)} 5.6 ${r(cy)} Q4 ${r(cy + 4)} 1.6 ${r(cy + 5.6)} L-1.6 ${r(cy + 5.6)} Q-4 ${r(cy + 4)} -5.6 ${r(cy)} Z" fill="${S.lg("ballon", [[0, "#d94a3a"], [0.2, "#d94a3a"], [0.2, "#f1c232"], [0.4, "#f1c232"], [0.4, "#3a7fc0"], [0.6, "#3a7fc0"], [0.6, "#f1c232"], [0.8, "#f1c232"], [0.8, "#d94a3a"], [1, "#d94a3a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-5.6 ${r(cy)} Q-6 ${r(cy - 9)} 0 ${r(cy - 9.4)} Q6 ${r(cy - 9)} 5.6 ${r(cy)} Q4 ${r(cy + 4)} 1.6 ${r(cy + 5.6)} L-1.6 ${r(cy + 5.6)} Q-4 ${r(cy + 4)} -5.6 ${r(cy)} Z" fill="${S.rg("ballonlicht", [[0, "#fff", 0.35], [1, "#000", 0.15]], 0.35, 0.3, 0.8)}"/>`;
  k += `<path d="M-1.4 ${r(cy + 5.6)} L-1.1 ${r(cy + 8)} M1.4 ${r(cy + 5.6)} L1.1 ${r(cy + 8)}" stroke="#4a3a2a" stroke-width=".25"/><rect x="-1.4" y="${r(cy + 8)}" width="2.8" height="1.8" rx=".3" fill="#8a5a32"/>`;
  S.teil({ anker: [130, 160], oben: true, id: "ballon", de: "der Heißluftballon", syl: "HEISS-luft-bal-lon", it: "la mongolfiera", itSyl: "mon-gol-FIE-ra", en: "hot-air balloon", x: SCH.x, y: yAt(SCH.d), kunst: k + flaeche(-6.4, cy - 10, 12.8, 20.4),
    tipp: "In Kappadokien steigen bei Sonnenaufgang oft über 100 Heißluftballons gleichzeitig auf." });
}

/* =====================================================================
   14 — DER HOCKER, 15 — DER TISCH, darauf 16 — DER TEE und 17 — DIE BAKLAVA
   ===================================================================== */
const TI = { x: 186, d: 6.6 };
{
  const d = 6.4, u = uAt(d), Y = yAt(d);
  const h = 0.36 * u;
  let k = schatten(0, 0.3, 8, 1.2, 0.3);
  for (const x of [-6, 6]) k += `<path d="M${x} 0 L${x * 0.8} ${r(-h)}" stroke="#5e3b1e" stroke-width="1.2"/>`;
  k += `<path d="M-6.6 ${r(-h)} L6.6 ${r(-h)} L6 ${r(-h + 2.4)} L-6 ${r(-h + 2.4)} Z" fill="${S.lg("kelim", [[0, "#b8322a"], [0.3, "#e2b33a"], [0.5, "#1f4f7a"], [0.7, "#b8322a"], [1, "#2f6a4a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-6.6" y="${r(-h - 1)}" width="13.2" height="1.2" rx=".6" fill="#8a5a32"/>`;
  k += `<path d="M-5 ${r(-h * 0.4)} L5 ${r(-h * 0.4)}" stroke="#5e3b1e" stroke-width=".7"/>`;
  S.teil({ id: "hocker", de: "der Hocker", syl: "HO-cker", it: "lo sgabello", itSyl: "sga-BEL-lo", en: "stool", x: 212, y: Y, steht: true, kunst: k });
}
{
  const u = uAt(TI.d), Y = yAt(TI.d);
  const h = 0.5 * u, w = 0.25 * u;
  let k = schatten(0, 0.3, w + 3, 1.4, 0.3);
  /* niedriger achteckiger Holztisch (Sehpa) mit Perlmutt-Einlage */
  k += `<path d="M${r(-w)} ${r(-h + 3)} L${r(-w + 2)} 0 M${r(w)} ${r(-h + 3)} L${r(w - 2)} 0 M-1 ${r(-h + 3)} L-1 0" stroke="#5e3b1e" stroke-width="1.4"/>`;
  k += `<path d="M${r(-w - 1)} ${r(-h)} L${r(w + 1)} ${r(-h)} L${r(w)} ${r(-h + 3.4)} L${r(-w)} ${r(-h + 3.4)} Z" fill="${HOLZ}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(-w + 2 + i * (2 * w - 4) / 5)} ${r(-h + 1.8)} l1 -.8 l1 .8 l-1 .8 Z" fill="#f4ecd8" opacity=".8"/>`;
  /* Messingtablett */
  k += `<ellipse cx="0" cy="${r(-h - 0.4)}" rx="${r(w - 1)}" ry="2.2" fill="${MESSING}"/><ellipse cx="0" cy="${r(-h - 0.6)}" rx="${r(w - 2.4)}" ry="1.5" fill="#e0bf6a"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "small table", x: TI.x, y: Y, steht: true, kunst: k,
    tipp: "Im Basar bietet der Händler dem Kunden oft einen Tee an." });
}
const TABLETT = yAt(TI.d) - 0.5 * uAt(TI.d) - 0.6;
{
  /* Tee im Tulpenglas auf rotem Untersetzer, Löffel, Würfelzucker */
  let k = `<ellipse cx="0" cy="0" rx="3.6" ry="1" fill="#c0262b"/><ellipse cx="0" cy="-.2" rx="2.8" ry=".7" fill="#e14a4a"/>`;
  k += `<path d="M-2 -8 Q-2.6 -6 -1.1 -4.2 Q-.4 -3 -1.4 -1.2 Q-1.6 -.4 0 -.4 Q1.6 -.4 1.4 -1.2 Q.4 -3 1.1 -4.2 Q2.6 -6 2 -8 Z" fill="${S.lg("cay", [[0, "#c8401c"], [0.6, "#8e1f0a"], [1, "#6a1405"]], 0, 0, 1, 0)}" opacity=".95"/>`;
  k += `<path d="M-2 -8 Q-2.6 -6 -1.1 -4.2 Q-.4 -3 -1.4 -1.2 Q-1.6 -.4 0 -.4 Q1.6 -.4 1.4 -1.2 Q.4 -3 1.1 -4.2 Q2.6 -6 2 -8" fill="none" stroke="#f2e8dc" stroke-width=".3" opacity=".9"/>`;
  k += `<ellipse cx="0" cy="-8" rx="2" ry=".45" fill="#b0451e" stroke="#f2e8dc" stroke-width=".2"/><path d="M-1.4 -7.4 Q-1.8 -5.6 -.8 -4.4" stroke="#fff" stroke-width=".4" opacity=".6" fill="none"/>`;
  k += `<line x1="1.4" y1="-9.6" x2="2.8" y2="-.6" stroke="#d9dde0" stroke-width=".35"/>`;
  k += `<rect x="3.6" y="-1.6" width="1.4" height="1.4" fill="#fbfbf8" stroke="#dcdcd6" stroke-width=".15"/><rect x="4.4" y="-2.8" width="1.3" height="1.3" fill="#fbfbf8" stroke="#dcdcd6" stroke-width=".15"/>`;
  S.teil({ oben: true, id: "tee", de: "der Tee", syl: "TEE", it: "il tè", itSyl: "TÈ", en: "tea", x: TI.x - 5, y: r(TABLETT + 0.6), steht: true, kunst: k + flaeche(-3.8, -10, 9.6, 11),
    tipp: "Türkischer Tee („Çay“) wird im kleinen Tulpenglas getrunken – ohne Milch, oft mit Zucker." });
}
{
  let k = `<ellipse cx="0" cy="0" rx="5" ry="1.3" fill="#f6f4ee"/><ellipse cx="0" cy="-.2" rx="4.2" ry=".9" fill="#e9e5dc"/>`;
  for (const [x, y] of [[-2.4, -.6], [0.2, -.8], [2.6, -.6], [-1.1, -2], [1.5, -2.1]]) {
    k += `<path d="M${r(x - 1.5)} ${r(y)} L${r(x)} ${r(y - 1)} L${r(x + 1.5)} ${r(y)} L${r(x)} ${r(y + 0.5)} Z" fill="${S.lg("baklava", [[0, "#e8b45a"], [1, "#b8792a"]])}"/>`;
    k += `<path d="M${r(x - 1.5)} ${r(y)} L${r(x)} ${r(y + 0.5)} L${r(x + 1.5)} ${r(y)} L${r(x + 1.5)} ${r(y + 0.9)} L${r(x)} ${r(y + 1.4)} L${r(x - 1.5)} ${r(y + 0.9)} Z" fill="#f2d8a0"/>`;
    k += `<path d="M${r(x - 1.4)} ${r(y + 0.45)} L${r(x)} ${r(y + 0.95)} L${r(x + 1.4)} ${r(y + 0.45)}" stroke="#c98a3a" stroke-width=".18" fill="none"/>`;
    k += `<ellipse cx="${r(x)}" cy="${r(y - 0.35)}" rx=".55" ry=".25" fill="#5fa03a"/>`;
  }
  S.teil({ oben: true, id: "baklava", de: "die Baklava", syl: "Bak-LA-va", it: "la baklava", itSyl: "ba-kla-VA", en: "baklava", x: TI.x + 4.4, y: r(TABLETT + 0.4), steht: true, kunst: k + flaeche(-5.2, -4, 10.4, 5.4),
    tipp: "Baklava: viele hauchdünne Teigschichten mit Pistazien und Sirup." });
}

/* =====================================================================
   18 — DIE KATZE (Straßenkatze, liegt auf dem Pflaster)
   ===================================================================== */
{
  const FELL = S.lg("katzenfell", [[0, "#f4f1ea"], [1, "#cfc8bb"]]);
  let k = `<ellipse cx="0" cy="-.2" rx="9" ry="1.1" fill="#000" opacity=".22"/>`;
  k += `<path d="M-7 -.4 Q-8 -5.6 -2 -6 L4 -6 Q8 -5.4 7.6 -.4 Z" fill="${FELL}"/>`;
  k += `<path d="M-2 -6 Q1 -7 4 -6 Q6 -5 6.4 -3.6 L1 -3.2 Z" fill="#6b5a4a"/><path d="M-6.6 -3 Q-5 -4.6 -3 -4.8 L-4 -1.4 Z" fill="#6b5a4a"/>`;
  k += `<path d="M7.6 -1 Q11 -1 11.4 -3.4" stroke="#6b5a4a" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="-7.6" cy="-4.4" r="2.8" fill="${FELL}"/><path d="M-9.8 -6 L-9.6 -8.6 L-8 -6.8 Z M-6.6 -6.8 L-5.4 -8.8 L-5 -6.2 Z" fill="${FELL}"/><path d="M-9.4 -7.6 l.3 1 M-5.8 -7.8 l-.3 1" stroke="#e8a3a3" stroke-width=".35"/>`;
  k += `<path d="M-9.2 -4.6 q.6 .4 1.2 0 M-7.2 -4.6 q.6 .4 1.2 0" stroke="#333" stroke-width=".35" fill="none"/><circle cx="-7.9" cy="-3.6" r=".3" fill="#d98a8a"/>`;
  k += `<path d="M-10.4 -3.4 h-2 M-10.4 -3 l-1.8 .5 M-5.4 -3.4 h2" stroke="#999" stroke-width=".15"/>`;
  k += `<path d="M-6 -.6 q1.4 -.8 2.8 0 M2 -.6 q1.4 -.8 2.8 0" stroke="#d6cfc2" stroke-width=".4" fill="none"/>`;
  S.teil({ id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: 244, y: yAt(6.3), steht: true, kunst: k,
    tipp: "Istanbul ist die Stadt der Katzen. Die Nachbarn stellen ihnen Futter und Wasser hin." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tuerkei.js"));
console.log(aus);
