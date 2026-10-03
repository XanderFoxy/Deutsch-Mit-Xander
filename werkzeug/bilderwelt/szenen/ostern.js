#!/usr/bin/env node
/* =====================================================================
   OSTERN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Goethe-Institut „5 deutsche Ostertraditionen“, Travelbook
   „Osterbräuche in Deutschland“) — Ostersonntag im eigenen Garten:
   - Am Morgen ist die OSTEREIERSUCHE: Die Eltern („der Osterhase“)
     verstecken bunte Eier und Süßes im Gras, unter Büschen und im
     OSTERNEST; die Kinder sammeln alles im OSTERKORB.
   - Der OSTERSTRAUCH: ein Strauch im Garten, an dem ausgeblasene,
     bemalte Eier an Bändern hängen.
   - Das OSTERFRÜHSTÜCK auf der Terrasse: gefärbte, hart gekochte Eier,
     Eierbecher, HEFEZOPF, das OSTERLAMM (Rührkuchen in Lammform mit
     Puderzucker, Fähnchen und Glöckchen), der SCHOKOHASE in Goldfolie,
     Kaffee.
   - Im Beet blühen OSTERGLOCKEN (gelb), NARZISSEN (weiß) und TULPEN;
     die Forsythie leuchtet gelb, der Kirschbaum blüht.
   Maßstab: Terrasse vorne (y 190) ≈ 50 Einheiten je Meter, Rasenmitte
   (y 160) ≈ 38, Zaun (y 108) ≈ 18. Augenhöhe y ≈ 60.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "ostern", titel: "Ostern", emoji: "🐣", thema: "Feste", kuerzel: "os", fassung: 852 });
const rnd = zufall(4504);
const r = B.r;

/* Figuren schlanker: ganze Zentimeter (bei k ≈ 0,5 unter einem Bildpunkt) */
const h2 = (n) => String(Math.round(parseFloat(n)));
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };
const handPunkt = (m) => { const h = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0]; return [(h.x != null ? h.x : h[0]) * m.k, (h.y != null ? h.y : h[1]) * m.k]; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const RASEN = S.lg("rasen", [[0, "#6f9a3a"], [0.5, "#5f8d32"], [1, "#4e7e2a"]]);
const HOLZ = S.lg("holz", [[0, "#b98a56"], [1, "#8a5e34"]]);
const HOLZ_V = S.lg("holzv", [[0, "#8a5e34"], [0.5, "#b98a56"], [1, "#7e5430"]], 0, 0, 1, 0);
const GOLDFOLIE = S.lg("goldfolie", [[0, "#8a5f12"], [0.3, "#f6d77a"], [0.5, "#fff2c0"], [0.7, "#d9a832"], [1, "#7a5010"]], 0, 0, 1, 0);
const ZINK = S.lg("zink", [[0, "#8a939a"], [0.45, "#e2e6ea"], [1, "#7d868d"]], 0, 0, 1, 0);
const EIFARBEN = ["#e2405a", "#f2b632", "#3a8ad8", "#55b04a", "#a25ad0", "#f07a2a", "#2fb8b0", "#f5a3c0"];

/* ein bemaltes Ei: Grundfarbe, Muster (Streifen, Punkte, Zickzack), Glanz */
const ei = (x, y, rx, ry, f, muster, dreh = 0) => {
  let g = `<g transform="translate(${r(x)} ${r(y)}) rotate(${dreh})"><path d="M0 ${r(-ry)} C${r(rx * 0.95)} ${r(-ry)} ${r(rx)} ${r(ry * 0.55)} 0 ${r(ry)} C${r(-rx)} ${r(ry * 0.55)} ${r(-rx * 0.95)} ${r(-ry)} 0 ${r(-ry)} Z" fill="${f}"/>`;
  if (muster === 0) g += `<path d="M${r(-rx * 0.95)} 0 L${r(rx * 0.95)} 0" stroke="#fff" stroke-width="${r(ry * 0.22)}" opacity=".85"/>`;
  if (muster === 1) for (const [dx, dy] of [[-0.4, -0.3], [0.35, -0.1], [-0.1, 0.4], [0.3, 0.55], [0, -0.65]]) g += `<circle cx="${r(dx * rx)}" cy="${r(dy * ry)}" r="${r(rx * 0.16)}" fill="#fff" opacity=".9"/>`;
  if (muster === 2) g += `<path d="M${r(-rx * 0.9)} ${r(ry * 0.1)} l${r(rx * 0.3)} ${r(-ry * 0.25)} l${r(rx * 0.3)} ${r(ry * 0.25)} l${r(rx * 0.3)} ${r(-ry * 0.25)} l${r(rx * 0.3)} ${r(ry * 0.25)} l${r(rx * 0.3)} ${r(-ry * 0.25)}" stroke="#fff6c8" stroke-width="${r(ry * 0.12)}" fill="none"/>`;
  g += `<ellipse cx="${r(-rx * 0.35)}" cy="${r(-ry * 0.35)}" rx="${r(rx * 0.25)}" ry="${r(ry * 0.18)}" fill="#fff" opacity=".45"/></g>`;
  return g;
};
/* Grashalme (vor Dingen im Rasen) */
const halme = (x, y, w, n, h = 2.4) => {
  let g = "";
  for (let i = 0; i < n; i++) { const hx = x - w / 2 + rnd() * w; g += `<path d="M${r(hx)} ${r(y)} q${r(rnd() - 0.5)} ${r(-h * 0.6)} ${r(rnd() * 1.4 - 0.7)} ${r(-h * (0.6 + rnd() * 0.5))}" stroke="${rnd() < 0.5 ? "#4e7e2a" : "#7aa842"}" stroke-width=".5" fill="none" stroke-linecap="round"/>`; }
  return g;
};

/* =====================================================================
   KULISSE — Frühlingshimmel, Nachbarhaus, blühende Bäume, Rasen,
   Hauswand und Terrasse
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="110" fill="${S.lg("himmel", [[0, "#7db4e6"], [0.7, "#bcdcf3"], [1, "#e6f1f6"]])}"/>`);
S.hinten(`<circle cx="30" cy="10" r="60" fill="${S.rg("sonne", [[0, "#fffbe6", 0.85], [1, "#fffbe6", 0]])}"/>`);
S.hinten(`<ellipse cx="150" cy="18" rx="28" ry="5" fill="#fff" opacity=".8"/><ellipse cx="168" cy="14" rx="15" ry="4.4" fill="#fff" opacity=".9"/><ellipse cx="262" cy="28" rx="20" ry="4" fill="#fff" opacity=".7"/>`);
/* Nachbarhaus mit Ziegeldach (rechts hinten) */
S.hinten(`<rect x="214" y="48" width="96" height="40" fill="#efe4d0"/><path d="M206 50 L262 20 L318 50 Z" fill="${S.lg("ziegel", [[0, "#b8523a"], [1, "#8e3a26"]])}"/><path d="M206 50 L318 50" stroke="#6e2a1a" stroke-width="1"/>`
  + `<rect x="226" y="58" width="12" height="14" fill="#7aa0c0" stroke="#fff" stroke-width="1"/><rect x="284" y="58" width="12" height="14" fill="#7aa0c0" stroke="#fff" stroke-width="1"/><rect x="252" y="30" width="10" height="11" fill="#7aa0c0" stroke="#fff" stroke-width=".8"/>`);
/* blühender Kirschbaum und gelbe Forsythie hinter der Hecke */
{
  let g = `<path d="M70 92 L72 58 M72 66 L60 50 M72 62 L86 46" stroke="#5a3a26" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI * 2, d = rnd(); g += `<circle cx="${r(72 + Math.cos(a) * d * 28)}" cy="${r(46 + Math.sin(a) * d * 18)}" r="${r(2 + rnd() * 2.6)}" fill="${rnd() < 0.5 ? "#f8d4e0" : "#fbe8ee"}" opacity=".95"/>`; }
  for (let i = 0; i < 40; i++) { const x = 116 + rnd() * 44, y = 62 + rnd() * 26; g += `<path d="M${r(x)} ${r(y + 6)} l${r(rnd() * 4 - 2)} -6" stroke="#8a6a2a" stroke-width=".4"/><circle cx="${r(x + rnd() * 2 - 1)}" cy="${r(y)}" r="${r(1 + rnd())}" fill="${rnd() < 0.6 ? "#f6d02a" : "#ffe46a"}"/>`; }
  S.hinten(g);
}
/* Rasen mit Mähstreifen in Flucht */
{
  let g = `<rect x="0" y="104" width="320" height="96" fill="${RASEN}"/>`;
  for (let i = -8; i <= 8; i += 2) g += `<path d="M${160 + i * 22} 104 L${160 + (i + 1) * 22} 104 L${160 + (i + 1) * 64} 200 L${160 + i * 64} 200 Z" fill="#8ab84a" opacity=".16"/>`;
  S.def(`<pattern id="${S.id("gras")}" width="6" height="4" patternUnits="userSpaceOnUse"><path d="M1 4 l.3 -2 M3 4 l-.2 -2.4 M5 4 l.4 -1.8" stroke="#3f6e22" stroke-width=".35" opacity=".55"/></pattern>`);
  g += `<rect x="0" y="120" width="320" height="80" fill="url(#${S.id("gras")})"/>`;
  for (let i = 0; i < 70; i++) { const y = 112 + rnd() * 84, x = rnd() * 320, sk = 0.3 + (y - 104) / 96 * 0.6; if (x < 150 && y > 152) continue; g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(sk)}" fill="#fbfbf4"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(sk * 0.4)}" fill="#f2c82a"/>`; }
  g += `<rect x="0" y="104" width="320" height="96" fill="${S.lg("rasenlicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  /* Beet vorne rechts: dunkle Erde mit Rand */
  g += `<path d="M232 186 Q236 172 262 170 L320 168 L320 198 L236 198 Z" fill="${S.lg("erde", [[0, "#5a3a22"], [1, "#3e2614"]])}"/><path d="M232 186 Q236 172 262 170 L320 168" stroke="#9a8a7a" stroke-width="1.2" fill="none"/>`;
  /* Hauswand links mit Terrassentür (Ausschnitt) */
  g += `<rect x="0" y="0" width="22" height="200" fill="${S.lg("putz", [[0, "#efe8dc"], [1, "#d8cfbf"]], 0, 0, 1, 0)}"/><rect x="14" y="40" width="8" height="160" fill="#f7f4ee"/><rect x="16" y="44" width="6" height="150" fill="#9ab8cc" opacity=".8"/>`;
  /* Terrasse: Steinplatten in Flucht */
  g += `<path d="M22 156 L140 156 L156 200 L22 200 Z" fill="${S.lg("platten", [[0, "#c8bba6"], [1, "#b2a48c"]])}"/>`;
  for (const y of [164, 174, 186]) g += `<line x1="22" y1="${y}" x2="${r(140 + (y - 156) * 0.36)}" y2="${y}" stroke="#8e826e" stroke-width=".4"/>`;
  for (const x0 of [40, 64, 88, 112]) g += `<line x1="${x0}" y1="156" x2="${r(x0 + (x0 - 80) * 0.35)}" y2="200" stroke="#8e826e" stroke-width=".4"/>`;
  g += `<path d="M140 156 L156 200" stroke="#8e826e" stroke-width=".8"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DIE HECKE und 2 — DER ZAUN
   ===================================================================== */
{
  let k = `<path d="M-138 0 L-138 -26 Q-120 -34 -96 -29 Q-70 -36 -44 -30 Q-20 -36 6 -31 Q40 -37 70 -30 Q100 -36 130 -29 L160 -32 L160 0 Z" fill="${S.lg("hecke", [[0, "#3e6e2a"], [1, "#24481a"]])}"/>`;
  for (let i = 0; i < 110; i++) k += `<circle cx="${r(-136 + rnd() * 294)}" cy="${r(-28 + rnd() * 26)}" r="${r(1 + rnd() * 1.4)}" fill="${rnd() < 0.5 ? "#4f8a36" : "#2e5a22"}" opacity=".8"/>`;
  S.teil({ id: "hecke", de: "die Hecke", syl: "HE-cke", it: "la siepe", itSyl: "SIE-pe", en: "hedge", x: 160, y: 104, kunst: k });
}
{
  let k = `<rect x="-160" y="-12" width="320" height="1.6" fill="#e9e6de"/><rect x="-160" y="-5" width="320" height="1.6" fill="#e9e6de"/>`;
  for (let x = -158; x < 160; x += 5) k += `<path d="M${x} 0 L${x} -15 L${x + 1.4} -16.6 L${x + 2.8} -15 L${x + 2.8} 0 Z" fill="${S.lg("latte", [[0, "#ffffff"], [1, "#d9d4c8"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "zaun", de: "der Zaun", syl: "ZAUN", it: "lo steccato", itSyl: "stec-CA-to", en: "fence", x: 160, y: 108, kunst: k });
}

/* =====================================================================
   3 — DER OSTERHASE (ein Feldhase am Zaun – die Kinder glauben: der
       Osterhase war da)
   ===================================================================== */
{
  let k = schatten(0, 0, 7, .8, .3);
  const FELL = S.lg("fell", [[0, "#b08a5e"], [1, "#7a5a38"]]);
  k += `<path d="M-6 0 Q-8 -6 -3 -8.4 Q1 -10 4 -7 Q5.4 -4 4.4 0 Z" fill="${FELL}"/>`;
  k += `<ellipse cx="-6.4" cy="-4" rx="1.4" ry="1.3" fill="#f2ece2"/><path d="M2 0 Q5 -1 7 0 Z" fill="#7a5a38"/>`;
  k += `<ellipse cx="4.4" cy="-9.6" rx="2.6" ry="2.2" fill="${FELL}"/><circle cx="5.4" cy="-10" r=".55" fill="#2a1a0e"/><circle cx="5.6" cy="-10.2" r=".18" fill="#fff"/><circle cx="6.9" cy="-9.2" r=".3" fill="#3a2418"/>`;
  k += `<path d="M3.6 -11.2 Q2.6 -17 3.8 -18.6 Q4.8 -17 4.6 -11.4 Z" fill="${FELL}"/><path d="M3.8 -18.6 Q3.4 -17.6 3.6 -16.6 L4.3 -16.6 Q4.5 -17.8 3.8 -18.6 Z" fill="#2a1a0e"/>`;
  k += `<path d="M4.6 -11.4 Q5.4 -16.6 7 -17.8 Q7.4 -15.6 5.4 -11.2 Z" fill="#9a7650"/>`;
  k += halme(0, 0.4, 16, 12, 2.4);
  S.teil({ id: "osterhase", de: "der Osterhase", syl: "OS-ter-ha-se", it: "il coniglietto pasquale", itSyl: "co-ni-GLIET-to pas-qua-LE", en: "Easter bunny", x: 288, y: 132, kunst: k,
    tipp: "Der Osterhase versteckt die Eier – sagen die Eltern." });
}

/* =====================================================================
   4 — DER OSTERSTRAUCH mit bemalten, ausgeblasenen Eiern
   ===================================================================== */
{
  let k = schatten(0, 0.4, 16, 1.6, .3);
  /* Stamm und Äste (einfache Verzweigung) */
  const aeste = [];
  const ast = (x, y, a, l, d) => {
    const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#6a4a30" stroke-width="${r(0.35 + d * 0.45)}" stroke-linecap="round"/>`;
    aeste.push([x2, y2, d]);
    if (d > 0) { ast(x2, y2, a - 0.42 - rnd() * 0.2, l * 0.74, d - 1); ast(x2, y2, a + 0.38 + rnd() * 0.2, l * 0.72, d - 1); }
  };
  ast(0, 0, -Math.PI / 2, 15, 5);
  /* junges Laub */
  for (const [x, y] of aeste) for (let i = 0; i < 4; i++) k += `<ellipse cx="${r(x + rnd() * 5 - 2.5)}" cy="${r(y + rnd() * 5 - 2.5)}" rx="1.3" ry=".7" fill="${rnd() < 0.5 ? "#9acb52" : "#7ab040"}" transform="rotate(${Math.round(rnd() * 180)} ${r(x)} ${r(y)})"/>`;
  /* Eier an Bändern unter den Zweigspitzen */
  const enden = aeste.filter((a) => a[2] <= 1 && a[1] < -22);
  enden.forEach(([x, y], i) => {
    const f = EIFARBEN[i % EIFARBEN.length], l = 2 + (i % 3);
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + l)}" stroke="#d9c9a0" stroke-width=".2"/>` + ei(x, y + l + 2.4, 1.8, 2.4, f, i % 3);
    k += `<path d="M${r(x - 0.8)} ${r(y + 0.2)} q.8 .8 1.6 0" stroke="${EIFARBEN[(i + 3) % 8]}" stroke-width=".35" fill="none"/>`;
  });
  k += halme(0, 0.4, 14, 12, 2.6);
  S.teil({ id: "osterstrauch", de: "der Osterstrauch", syl: "OS-ter-strauch", it: "l'alberello pasquale", itSyl: "al-be-REL-lo pa-squa-LE", en: "Easter egg tree", x: 168, y: 126, kunst: k,
    tipp: "Die Eier am Osterstrauch sind ausgeblasen und bemalt." });
}
/* DAS OSTEREI: halb versteckt im Gras unter dem Strauch */
{
  let k = schatten(0, 0.2, 3, .6, .3) + ei(0, -2.6, 2.2, 2.9, "#e2405a", 2, 12);
  k += halme(0, 0.5, 7, 9, 2.6);
  S.teil({ oben: true, id: "osterei", de: "das Osterei", syl: "OS-ter-ei", it: "l'uovo di Pasqua", itSyl: "UO-vo di PAS-qua", en: "Easter egg", x: 192, y: 134, kunst: k,
    tipp: "Am Ostersonntag suchen die Kinder die versteckten Eier." });
}
/* DIE GIESSKANNE aus Zink auf dem Rasen */
{
  let k = schatten(0, 0.3, 8, 1, .3);
  k += `<path d="M-5 0 L-5.4 -10 L5.4 -10 L5 0 Z" fill="${ZINK}"/><ellipse cx="0" cy="-10" rx="5.4" ry="1" fill="#9aa3aa"/>`;
  k += `<path d="M-5.2 -8 Q-9 -10 -8 -4 Q-7.4 -2 -5.2 -3" stroke="#8a939a" stroke-width="1" fill="none"/>`;
  k += `<path d="M5 -3 L12 -12" stroke="#a9b1b8" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="12.4" cy="-12.4" rx="1.4" ry="1" fill="#bfc6cc" transform="rotate(-40 12.4 -12.4)"/>`;
  k += `<path d="M-3 -9 Q0 -14 3 -9" stroke="#8a939a" stroke-width=".9" fill="none"/><rect x="-5" y="-6" width="10" height="1" fill="#7d868d"/>`;
  S.teil({ id: "giesskanne", de: "die Gießkanne", syl: "GIESS-kan-ne", it: "l'annaffiatoio", itSyl: "an-naf-fia-TO-io", en: "watering can", x: 242, y: 150, kunst: k });
}

/* =====================================================================
   5 — DAS OSTERNEST im Gras mit dem KÜKEN
   ===================================================================== */
{
  let k = schatten(0, 0.3, 10, 1.4, .35);
  k += `<ellipse cx="0" cy="-2" rx="9" ry="3.4" fill="#8a6a3a"/>`;
  for (let i = 0; i < 40; i++) { const a = rnd() * Math.PI * 2; k += `<path d="M${r(Math.cos(a) * 8)} ${r(-2 + Math.sin(a) * 3)} q${r(rnd() * 4 - 2)} -1 ${r(rnd() * 5 - 2.5)} ${r(rnd() * 1.4 - 0.7)}" stroke="${rnd() < 0.5 ? "#c9a85a" : "#a8803e"}" stroke-width=".45" fill="none"/>`; }
  k += `<ellipse cx="0" cy="-3" rx="6.4" ry="2" fill="#7ab040"/>`;
  for (let i = 0; i < 18; i++) k += `<path d="M${r(-6 + rnd() * 12)} -2.6 l${r(rnd() - 0.5)} -1.6" stroke="#a6d45a" stroke-width=".35"/>`;
  k += ei(-3.4, -4.6, 1.8, 2.3, "#3a8ad8", 1, -14) + ei(0.4, -5, 1.8, 2.3, "#f2b632", 0, 4) + ei(3.8, -4.4, 1.7, 2.2, "#a25ad0", 2, 18);
  k += `<ellipse cx="-1.4" cy="-3" rx="1.1" ry=".8" fill="#5a2a14"/><ellipse cx="2" cy="-2.8" rx="1.1" ry=".8" fill="${GOLDFOLIE}"/>`;
  k += halme(0, 0.6, 22, 16, 2.8);
  S.teil({ id: "osternest", de: "das Osternest", syl: "OS-ter-nest", it: "il nido pasquale", itSyl: "NI-do pa-squa-LE", en: "Easter nest", x: 174, y: 166, kunst: k,
    tipp: "Im Osternest liegen bunte Eier und Süßigkeiten." });
}
{
  /* Küken: flauschige Deko-Figur am Nestrand */
  const FLAUM = S.rg("flaum", [[0, "#fff6a0"], [0.6, "#f6d83a"], [1, "#d8a81a"]], 0.4, 0.35, 0.8);
  let k = `<ellipse cx="0" cy="-2.4" rx="2.8" ry="2.4" fill="${FLAUM}"/><circle cx="1.6" cy="-5.4" r="1.8" fill="${FLAUM}"/>`;
  k += `<path d="M3.2 -5.6 L4.6 -5.1 L3.2 -4.6 Z" fill="#f08a1a"/><circle cx="2.1" cy="-5.9" r=".35" fill="#1a1a1a"/><path d="M-1.6 -2.6 q1.4 -1.4 2.6 0" stroke="#e8b81e" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-.4 -.2 l0 .6 M1 -.2 l0 .6" stroke="#f08a1a" stroke-width=".4"/>`;
  S.teil({ oben: true, id: "kueken", de: "das Küken", syl: "KÜ-ken", it: "il pulcino", itSyl: "pul-CI-no", en: "chick", x: 163, y: 165, kunst: k });
}

/* =====================================================================
   6 — DAS BEET: Tulpen, Osterglocken, Narzissen
   ===================================================================== */
const stiel = (x, y, h, kr) => `<path d="M${r(x)} ${y} q${r(kr)} ${r(-h * 0.5)} ${r(kr * 0.6)} ${r(-h)}" stroke="#4e8a2e" stroke-width=".7" fill="none"/>`;
const blatt = (x, y, h, s) => `<path d="M${r(x)} ${y} q${r(s * 3)} ${r(-h * 0.5)} ${r(s * 1.4)} ${r(-h)} q${r(-s * 0.4)} ${r(h * 0.5)} ${r(-s * 1.4)} ${r(h)} Z" fill="#5f9a3a"/>`;
{
  let k = "";
  for (const [dx, h, f] of [[-6, 16, "#d4202e"], [-2, 19, "#e8303a"], [2.4, 17, "#d4202e"], [6.4, 15, "#f0506a"], [-4, 13, "#e8303a"]]) {
    k += blatt(dx - 1, 0, h * 0.6, -1) + stiel(dx, 0, h, 0.6);
    const x = dx + 0.36, y = -h;
    k += `<path d="M${r(x - 2)} ${r(y)} Q${r(x - 2.2)} ${r(y - 4)} ${r(x - 1)} ${r(y - 4.4)} L${r(x)} ${r(y - 3)} L${r(x + 1)} ${r(y - 4.4)} Q${r(x + 2.2)} ${r(y - 4)} ${r(x + 2)} ${r(y)} Q${r(x)} ${r(y + 1.2)} ${r(x - 2)} ${r(y)} Z" fill="${f}"/><path d="M${r(x - 1.2)} ${r(y - 3.4)} q.4 2 .2 3" stroke="#fff" stroke-width=".3" opacity=".4" fill="none"/>`;
  }
  S.teil({ id: "tulpe", de: "die Tulpe", syl: "TUL-pe", it: "il tulipano", itSyl: "tu-LI-pa-no", en: "tulip", x: 250, y: 186, kunst: k });
}
{
  let k = "";
  const glocke = (x, y, s) => {
    let g = "";
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g += `<ellipse cx="${r(x + Math.cos(a) * 1.8 * s)}" cy="${r(y + Math.sin(a) * 1.5 * s)}" rx="${r(1.4 * s)}" ry="${r(0.9 * s)}" fill="#f8de3a" transform="rotate(${Math.round(a * 57)} ${r(x + Math.cos(a) * 1.8 * s)} ${r(y + Math.sin(a) * 1.5 * s)})"/>`; }
    g += `<path d="M${r(x - 1.1 * s)} ${r(y - 0.4 * s)} L${r(x + 2.8 * s)} ${r(y - 1.2 * s)} L${r(x + 3.2 * s)} ${r(y + 1.4 * s)} L${r(x - 0.9 * s)} ${r(y + 0.8 * s)} Z" fill="#f2a81a"/><ellipse cx="${r(x + 3 * s)}" cy="${r(y + 0.1 * s)}" rx="${r(0.6 * s)}" ry="${r(1.4 * s)}" fill="#e8901a"/>`;
    return g;
  };
  for (const [dx, h] of [[-6, 17], [-2, 21], [2.6, 18], [6.6, 15], [0, 14]]) { k += blatt(dx - 1.2, 0, h * 0.75, -1) + blatt(dx + 1, 0, h * 0.7, 1) + stiel(dx, 0, h, 0.8) + glocke(dx + 0.5, -h - 1.4, 1); }
  S.teil({ id: "osterglocke", de: "die Osterglocke", syl: "OS-ter-glo-cke", it: "il narciso", itSyl: "nar-CI-so", en: "daffodil", x: 278, y: 184, kunst: k,
    tipp: "Die Osterglocke ist eine gelbe Narzisse. Sie blüht um Ostern." });
}
{
  let k = "";
  const narz = (x, y, s) => {
    let g = "";
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; g += `<ellipse cx="${r(x + Math.cos(a) * 1.9 * s)}" cy="${r(y + Math.sin(a) * 1.7 * s)}" rx="${r(1.5 * s)}" ry="${r(1 * s)}" fill="#fbfbf6" stroke="#dcdcd0" stroke-width=".15" transform="rotate(${Math.round(a * 57)} ${r(x + Math.cos(a) * 1.9 * s)} ${r(y + Math.sin(a) * 1.7 * s)})"/>`; }
    return g + `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.9 * s)}" fill="#f6d83a"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(0.9 * s)}" fill="none" stroke="#d8402a" stroke-width="${r(0.35 * s)}"/>`;
  };
  for (const [dx, h] of [[-5.4, 15], [-1.4, 19], [3, 17], [6.4, 13]]) { k += blatt(dx - 1, 0, h * 0.7, -1) + stiel(dx, 0, h, 0.6) + narz(dx + 0.4, -h - 1.2, 1); }
  S.teil({ id: "narzisse", de: "die Narzisse", syl: "Nar-ZIS-se", it: "il narciso", itSyl: "nar-CI-so", en: "narcissus", x: 304, y: 182, kunst: k,
    tipp: "Die weiße Dichternarzisse hat in der Mitte einen roten Rand." });
}

/* =====================================================================
   7 — DIE MUTTER (Terrasse) und 8 — DER GARTENTISCH mit dem Osterfrühstück
   ===================================================================== */
{
  const m = figur({ id: "os_mutter", geschlecht: "w", pose: "halten", blick: 40, frisur: "dutt", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f4e6b0" }, jacke: { stueck: "weste", farbe: "#6f9a5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 86);
  const [hx, hy] = handPunkt(m);
  const tasse = `<g transform="translate(${r(hx + 0.6)} ${r(hy - 1)})"><path d="M-2 -3.6 L2 -3.6 L1.6 0 L-1.6 0 Z" fill="#fbfbf8"/><path d="M2 -3 q1.4 .2 1.1 1.4 q-.3 .9 -1.4 .6" stroke="#e8e6e0" stroke-width=".5" fill="none"/><ellipse cx="0" cy="-3.6" rx="2" ry=".5" fill="#6b4630"/></g>`;
  S.teil({ id: "mutter", de: "die Mutter", syl: "MUT-ter", it: "la mamma", itSyl: "MAM-ma", en: "mother", x: 34, y: 192, kunst: schatten(0, 0, 12, 1.6, .3) + m.svg + tasse,
    tipp: "Sie trinkt Kaffee und schaut bei der Eiersuche zu." });
}
{
  const TB = { yh: 136, yv: 147, xh0: 50, xh1: 104, xv0: 42, xv1: 112, fuss: 184 };
  const cx = (TB.xv0 + TB.xv1) / 2;
  const L = (x, y) => `${r(x - cx)} ${r(y - TB.fuss)}`;
  let k = schatten(0, 0.5, 38, 2, .35);
  /* Beine (Holz) */
  for (const x of [TB.xv0 + 3, TB.xv1 - 6]) k += `<rect x="${r(x - cx)}" y="${TB.yv + 6 - TB.fuss}" width="3" height="${TB.fuss - TB.yv - 6}" fill="${HOLZ_V}"/>`;
  for (const x of [TB.xh0 + 4, TB.xh1 - 6]) k += `<rect x="${r(x - cx)}" y="${TB.yh - TB.fuss}" width="2.2" height="${TB.fuss - 8 - TB.yh}" fill="#6a4628"/>`;
  /* Tischdecke: weiß mit grünem Karo-Rand, fällt vorne über */
  S.def(`<pattern id="${S.id("karo")}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#fbfaf4"/><rect width="1.5" height="3" fill="#a8d48a" opacity=".55"/><rect width="3" height="1.5" fill="#a8d48a" opacity=".55"/></pattern>`);
  k += `<path d="M${L(TB.xh0, TB.yh)} L${L(TB.xh1, TB.yh)} L${L(TB.xv1, TB.yv)} L${L(TB.xv0, TB.yv)} Z" fill="url(#${S.id("karo")})"/>`;
  k += `<path d="M${L(TB.xv0, TB.yv)} L${L(TB.xv1, TB.yv)} L${L(TB.xv1 + 1, TB.yv + 7)} Q${L(cx, TB.yv + 8.4)} ${L(TB.xv0 - 1, TB.yv + 7)} Z" fill="url(#${S.id("karo")})"/><path d="M${L(TB.xv0, TB.yv)} L${L(TB.xv1, TB.yv)} L${L(TB.xv1 + 1, TB.yv + 7)} Q${L(cx, TB.yv + 8.4)} ${L(TB.xv0 - 1, TB.yv + 7)} Z" fill="#000" opacity=".08"/>`;
  const unter = [];
  const auf = (x, y) => [x - cx, y - TB.fuss];
  const U = (t, x, y, fx, fy, fw, fh) => unter.push(Object.assign(t, { x, y, kunst: flaeche(fx, fy, fw, fh) }));
  /* DIE KAFFEEKANNE (hinten links) */
  {
    const [x, y] = auf(54, 139);
    k += `<path d="M${x - 3.4} ${y} L${x - 3.8} ${y - 9} Q${x} ${y - 11} ${x + 3.8} ${y - 9} L${x + 3.4} ${y} Z" fill="${S.lg("kanne", [[0, "#d9e8f4"], [0.45, "#ffffff"], [1, "#b8cad8"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x + 3.6} ${y - 7.4} q2.6 .6 2 3.4 q-.6 2 -2.2 1.6" stroke="#c8d8e4" stroke-width=".9" fill="none"/><path d="M${x - 3.6} ${y - 7} L${x - 6.4} ${y - 9.6} L${x - 5.6} ${y - 10}" stroke="#d9e8f4" stroke-width="1.1" fill="none"/>`;
    k += `<ellipse cx="${x}" cy="${y - 10}" rx="2" ry=".6" fill="#e8f0f6"/><circle cx="${x}" cy="${y - 10.8}" r=".7" fill="#4a7ab0"/><path d="M${x - 2.6} ${y - 4} q2.6 1 5.2 0" stroke="#4a7ab0" stroke-width=".5" fill="none"/>`;
    U({ id: "kaffeekanne", de: "die Kaffeekanne", syl: "KAF-fee-kan-ne", it: "la caffettiera", itSyl: "caf-fet-TIE-ra", en: "coffee pot" }, 54, 139, -6.6, -12, 11, 12.4);
  }
  /* DAS OSTERLAMM: Rührkuchen in Lammform, Puderzucker, Band mit Glöckchen, Fähnchen */
  {
    const [x, y] = auf(70, 141);
    k += `<ellipse cx="${x}" cy="${y}" rx="7.4" ry="1.8" fill="#f7f4ee" stroke="#d6cfc0" stroke-width=".25"/>`;
    k += `<path d="M${x - 5.6} ${y - 0.6} Q${x - 6.4} ${y - 6.6} ${x - 1} ${y - 7} Q${x + 3} ${y - 7.6} ${x + 4} ${y - 5} L${x + 4} ${y - 0.6} Z" fill="${S.lg("teig", [[0, "#f3e2b6"], [1, "#c99a52"]])}"/>`;
    k += `<ellipse cx="${x + 4.6}" cy="${y - 7}" rx="2.4" ry="2.1" fill="#ecd29a"/><path d="M${x + 3.2} ${y - 8.6} q-1.4 -.4 -1.6 1.2" fill="#d8b46a"/><circle cx="${x + 5.6}" cy="${y - 7.4}" r=".3" fill="#4a2a14"/>`;
    for (let i = 0; i < 22; i++) k += `<circle cx="${r(x - 5 + rnd() * 10)}" cy="${r(y - 7 + rnd() * 3)}" r=".3" fill="#fff"/>`;
    k += `<path d="M${x + 2.6} ${y - 5.4} Q${x + 3.8} ${y - 4.4} ${x + 5.4} ${y - 5.2}" stroke="#d4202e" stroke-width=".6" fill="none"/><circle cx="${x + 4}" cy="${y - 4.2}" r=".6" fill="${GOLDFOLIE}"/>`;
    k += `<line x1="${x - 2}" y1="${y - 6.4}" x2="${x - 2}" y2="${y - 13}" stroke="#d8c8a0" stroke-width=".25"/><path d="M${x - 2} ${y - 13} L${x + 1.6} ${y - 12} L${x - 2} ${y - 11} Z" fill="#f6d02a"/><path d="M${x - 2} ${y - 12.4} L${x} ${y - 12} L${x - 2} ${y - 11.6} Z" fill="#fff"/>`;
    U({ id: "osterlamm", de: "das Osterlamm", syl: "OS-ter-lamm", it: "l'agnello pasquale", itSyl: "a-GNEL-lo pa-squa-LE", en: "Easter lamb cake",
      tipp: "Ein Kuchen in Form eines Lamms, mit Puderzucker und Fähnchen." }, 70, 141, -7, -13.4, 14, 14.4);
  }
  /* DER SCHOKOHASE in Goldfolie mit rotem Band und Glöckchen */
  {
    const [x, y] = auf(98, 140);
    k += `<path d="M${x - 2.8} ${y} Q${x - 3.4} ${y - 4} ${x - 1.8} ${y - 6} Q${x - 2.8} ${y - 8} ${x - 1.4} ${y - 9} L${x - 1.8} ${y - 13} Q${x - 1} ${y - 14} ${x - 0.4} ${y - 12.4} L${x - 0.2} ${y - 9.2} L${x + 0.6} ${y - 13.2} Q${x + 1.6} ${y - 13.6} ${x + 1.4} ${y - 12} L${x + 0.8} ${y - 8.6} Q${x + 2.6} ${y - 7.6} ${x + 1.8} ${y - 5.6} Q${x + 3.4} ${y - 3.6} ${x + 2.8} ${y} Z" fill="${GOLDFOLIE}"/>`;
    k += `<path d="M${x - 2} ${y - 6.4} Q${x} ${y - 5.2} ${x + 2} ${y - 6.4}" stroke="#c4202a" stroke-width=".7" fill="none"/><circle cx="${x}" cy="${y - 5.4}" r=".6" fill="#f6d77a" stroke="#8a5f12" stroke-width=".15"/><circle cx="${x - 0.6}" cy="${y - 7.6}" r=".25" fill="#5a3a10"/>`;
    U({ id: "schokohase", de: "der Schokohase", syl: "SCHO-ko-ha-se", it: "il coniglietto di cioccolato", itSyl: "co-ni-GLIET-to di cioc-co-LA-to", en: "chocolate bunny" }, 98, 140, -3.6, -14.2, 7.2, 14.6);
  }
  /* DER HEFEZOPF auf dem Brett, mit Hagelzucker */
  {
    const [x, y] = auf(86, 144.6);
    k += `<path d="M${x - 9} ${y} L${x + 8} ${y} L${x + 9.4} ${y - 1.2} L${x - 7.6} ${y - 1.2} Z" fill="#c9a26a"/><rect x="${x - 9}" y="${y}" width="17" height=".8" fill="#9a7444"/>`;
    for (let i = 0; i < 5; i++) {
      const bx = x - 6.6 + i * 3.1;
      k += `<ellipse cx="${r(bx)}" cy="${y - 3.6}" rx="2.2" ry="2.2" fill="${S.rg("zopf", [[0, "#f2c56a"], [0.7, "#c9862e"], [1, "#9a5a1a"]], 0.4, 0.35, 0.8)}" transform="rotate(${i % 2 ? 30 : -30} ${r(bx)} ${y - 3.6})"/>`;
      k += `<circle cx="${r(bx - 0.4)}" cy="${y - 4.6}" r=".3" fill="#fff"/><circle cx="${r(bx + 0.6)}" cy="${y - 4}" r=".25" fill="#fff"/>`;
    }
    U({ id: "hefezopf", de: "der Hefezopf", syl: "HE-fe-zopf", it: "la treccia dolce", itSyl: "TREC-cia DOL-ce", en: "braided sweet bread",
      tipp: "Zum Osterfrühstück gibt es oft einen süßen Hefezopf." }, 86, 144.6, -9, -6.6, 18, 7.6);
  }
  /* DAS BUNTE EI: Schale mit gefärbten Eiern (vorne links) */
  {
    const [x, y] = auf(58, 149);
    k += `<path d="M${x - 6} ${y - 3} Q${x - 5.4} ${y + 0.6} ${x} ${y + 0.6} Q${x + 5.4} ${y + 0.6} ${x + 6} ${y - 3} Z" fill="${S.lg("schale", [[0, "#f4ecd8"], [1, "#c8b890"]])}"/>`;
    k += ei(x - 3, y - 3.6, 1.6, 2, "#3a8ad8", 3) + ei(x + 0.4, y - 4, 1.6, 2, "#e2405a", 3, 10) + ei(x + 3.4, y - 3.4, 1.5, 1.9, "#55b04a", 3, -12) + ei(x - 1.2, y - 2.6, 1.5, 1.9, "#f2b632", 3, 20);
    k += `<ellipse cx="${x}" cy="${y - 3}" rx="6" ry="1.2" fill="none" stroke="#e8dcc0" stroke-width=".4"/>`;
    U({ id: "ei_blau", de: "das bunte Ei", syl: "BUN-te EI", it: "l'uovo colorato", itSyl: "UO-vo co-lo-RA-to", en: "painted egg",
      tipp: "Hart gekochte Eier färbt man mit Eierfarbe." }, 58, 149, -6.4, -6.4, 12.8, 7.2);
  }
  /* DER EIERBECHER mit Ei und Mützchen */
  {
    const [x, y] = auf(76, 150.2);
    k += `<ellipse cx="${x}" cy="${y}" rx="2.2" ry=".6" fill="#f2f0ea"/><path d="M${x - 0.8} ${y} L${x - 0.6} ${y - 1.6} L${x + 0.6} ${y - 1.6} L${x + 0.8} ${y} Z" fill="#f2b632"/><path d="M${x - 2} ${y - 1.6} Q${x - 2} ${y - 3.8} ${x} ${y - 3.8} Q${x + 2} ${y - 3.8} ${x + 2} ${y - 1.6} Z" fill="#f2b632"/>`;
    k += `<path d="M${x - 1.7} ${y - 3.6} Q${x - 1.6} ${y - 7} ${x} ${y - 7.2} Q${x + 1.6} ${y - 7} ${x + 1.7} ${y - 3.6} Z" fill="#f6efe0"/><path d="M${x - 1.6} ${y - 5.2} L${x - 1} ${y - 5.8} L${x - 0.4} ${y - 5.2} L${x + 0.2} ${y - 5.8} L${x + 0.8} ${y - 5.2} L${x + 1.6} ${y - 5.8} L${x + 1.6} ${y - 6.8} Q${x} ${y - 9.2} ${x - 1.6} ${y - 6.8} Z" fill="#d4202e"/><circle cx="${x}" cy="${y - 8.6}" r=".6" fill="#fff"/>`;
    U({ id: "eierbecher", de: "der Eierbecher", syl: "EI-er-be-cher", it: "il portauovo", itSyl: "por-ta-UO-vo", en: "egg cup" }, 76, 150.2, -3, -9.8, 6, 10.4);
  }
  S.teil({ id: "gartentisch", de: "der Gartentisch", syl: "GAR-ten-tisch", it: "il tavolo da giardino", itSyl: "TA-vo-lo da giar-DI-no", en: "garden table", x: cx, y: TB.fuss, steht: true, kunst: k,
    zoom: { x: 38, y: 116, w: 78, h: 52 }, unter,
    tipp: "Auf der Terrasse gibt es das Osterfrühstück." });
}
/* DER GARTENSTUHL (Holz, Klappstuhl), rechts am Tisch */
{
  let k = schatten(0, 0.3, 9, 1, .3);
  k += `<path d="M-6 0 L2 -22 M6 0 L-2 -22" stroke="#8a5e34" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<path d="M-8 -20 L7 -20 L8 -17 L-7 -17 Z" fill="${HOLZ}"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${-7.4 + i * 0.3}" y1="${-17.8 - i * 0.6}" x2="${7.6 - i * 0.3}" y2="${-17.8 - i * 0.6}" stroke="#7a5230" stroke-width=".3"/>`;
  k += `<path d="M3 -20 L8 -40 M8.8 -20 L13 -38" stroke="#8a5e34" stroke-width="1.5" stroke-linecap="round"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(5.2 + i * 0.3)} ${-37 + i * 4} L${r(12.6 + i * 0.1)} ${-35.6 + i * 4}" stroke="${HOLZ}" stroke-width="2.4"/>`;
  S.teil({ id: "gartenstuhl", de: "der Gartenstuhl", syl: "GAR-ten-stuhl", it: "la sedia da giardino", itSyl: "SE-dia da giar-DI-no", en: "garden chair", x: 124, y: 186, steht: true, kunst: k });
}

/* =====================================================================
   9 — DAS KIND sucht Eier, daneben 10 — DER OSTERKORB
   ===================================================================== */
{
  const m = figur({ id: "os_kind", geschlecht: "w", alter: "kind", pose: "hocken", blick: -55, frisur: "zopf", haarfarbe: "braun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#f2b632" }, jacke: { stueck: "jacke", farbe: "#3a8ad8" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "gummistiefel", farbe: "#d4202e" } } }, 64);
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: 198, y: 178, kunst: schatten(0, 0, 10, 1.4, .3) + m.svg,
    tipp: "Es hat das Osternest gefunden!" });
}
{
  let k = schatten(0, 0.3, 9, 1.2, .3);
  const KORB = S.lg("korb", [[0, "#d3a35b"], [1, "#8a5c22"]]);
  k += `<path d="M-7 -7 Q0 -21 7 -7" stroke="#a8783a" stroke-width="1.4" fill="none"/><path d="M-7 -7 Q0 -21 7 -7" stroke="#d3a35b" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-7.6 -7 L7.6 -7 L6 0 L-6 0 Z" fill="${KORB}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${-7 + i * 2.8}" y1="-7" x2="${-5.6 + i * 2.3}" y2="0" stroke="#7a4e1c" stroke-width=".35"/>`;
  for (const y of [-4.6, -2.2]) k += `<line x1="-7" y1="${y}" x2="7" y2="${y}" stroke="#7a4e1c" stroke-width=".3"/>`;
  for (let i = 0; i < 14; i++) k += `<path d="M${r(-6.4 + rnd() * 12.8)} -7 l${r(rnd() * 1.6 - 0.8)} -1.6" stroke="#8ccf4a" stroke-width=".4"/>`;
  k += ei(-3.6, -8.4, 1.6, 2, "#e2405a", 1, -16) + ei(0, -9, 1.6, 2, "#3a8ad8", 2) + ei(3.6, -8.2, 1.6, 2, "#f2b632", 0, 16);
  k += halme(0, 0.4, 16, 12, 2);
  S.teil({ id: "osterkorb", de: "der Osterkorb", syl: "OS-ter-korb", it: "il cestino di Pasqua", itSyl: "ce-STI-no di PAS-qua", en: "Easter basket", x: 222, y: 184, kunst: k,
    tipp: "Im Korb sammelt das Kind die gefundenen Eier." });
}

/* DER SCHMETTERLING: Zitronenfalter über dem Beet (der erste Falter im Frühling) */
{
  const F = S.lg("falter", [[0, "#fff59a"], [1, "#e8d23a"]]);
  let k = `<path d="M0 0 Q-5 -6 -6.4 -2.6 Q-6.6 .6 0 0 Z" fill="${F}"/><path d="M0 0 Q4.4 -5.4 5.8 -2.4 Q6 .6 0 0 Z" fill="${F}" opacity=".85"/>`;
  k += `<path d="M0 0 Q-4 3.6 -2.6 4.4 Q-.6 4 0 0 Z M0 0 Q3.4 3.4 2.4 4.2 Q.6 3.8 0 0 Z" fill="#f2de4a"/><circle cx="-3.6" cy="-2.2" r=".4" fill="#e8801a"/><circle cx="3.2" cy="-2" r=".35" fill="#e8801a"/>`;
  k += `<path d="M-.3 -1 L.3 2.6" stroke="#5a4a1a" stroke-width=".6" stroke-linecap="round"/><path d="M0 -1 q-.8 -2 -1.8 -2.8 M0 -1 q.6 -2 1.6 -2.8" stroke="#5a4a1a" stroke-width=".2" fill="none"/>`;
  S.teil({ oben: true, id: "schmetterling", de: "der Schmetterling", syl: "SCHMET-ter-ling", it: "la farfalla", itSyl: "far-FAL-la", en: "butterfly", x: 262, y: 142, kunst: k,
    tipp: "Der Zitronenfalter ist im Frühling einer der ersten Schmetterlinge." });
}

/* Morgenlicht von links (fängt keinen Tipp) */
S.davor(`<g pointer-events="none"><rect width="320" height="200" fill="${S.lg("morgen", [[0, "#fff6d8", 0.16], [0.5, "#fff6d8", 0], [1, "#1a2a10", 0.08]], 0, 0, 1, 0.6)}"/></g>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/ostern.js"));
console.log(aus);
