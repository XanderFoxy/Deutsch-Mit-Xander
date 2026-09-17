/* ZEICHNET DEN UMARMUNGS-AUFKLEBER NEU.
   GEMELDET: „Die Umarmung kannst du auch noch überarbeiten — die eine
   Figur ist viel grösser als die andere, hat so langen Hals, das sieht
   irgendwie ganz komisch aus."

   Nachgesehen, und er hat in beidem recht:
     * Beide Köpfe hatten zwar denselben Radius (16), aber der linke
       stand 2 Einheiten höher UND frei vor dem Hintergrund, während
       der rechte halb hinter dem Körper des linken lag. Frei stehend
       wirkt derselbe Kreis deutlich grösser — deshalb sah es aus wie
       zwei verschiedene Menschen.
     * Der Hals war ein Rechteck von 16 Einheiten Höhe bei einem Kopf
       von 32 Durchmesser — also ein halber Kopf Hals. Dazu ragte er
       oben neben dem Kopf heraus, weil der Körper erst 12 Einheiten
       tiefer anfing. Das ist der lange Hals.

   Jetzt: gleich grosse Köpfe auf fast gleicher Höhe, Hälse von 6
   Einheiten, die vollständig hinter den Schultern verschwinden,
   Schultern statt Glockenröcke, und Arme, die sich verjüngen und in
   einer Hand mit Fingern enden statt in einer Murmel. */
const fs = require("fs");
const r1 = (n) => Math.round(n * 10) / 10;

const KANTE = "rgba(60,40,20,.32)";

/* Ein Arm: breit an der Schulter, schmal am Handgelenk. Gezeichnet als
   gefüllte Silhouette entlang einer Kurve — ein Strich hätte überall
   dieselbe Dicke, und genau daran erkennt man Strichmännchen. */
function arm(von, nach, bogen, dickA, dickB, haut) {
  const [x1, y1] = von, [x2, y2] = nach;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bogen;
  /* Die Normale grob aus der Sehne — für einen Arm reicht das. */
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l, ny = dx / l;
  const a = dickA / 2, b = dickB / 2;
  const d = [
    `M${r1(x1 + nx * a)} ${r1(y1 + ny * a)}`,
    `Q${r1(mx + nx * ((a + b) / 2))} ${r1(my + ny * ((a + b) / 2))} ${r1(x2 + nx * b)} ${r1(y2 + ny * b)}`,
    `L${r1(x2 - nx * b)} ${r1(y2 - ny * b)}`,
    `Q${r1(mx - nx * ((a + b) / 2))} ${r1(my - ny * ((a + b) / 2))} ${r1(x1 - nx * a)} ${r1(y1 - ny * a)}`,
    "Z",
  ].join(" ");
  return `<path d="${d}" fill="${haut}" stroke="${KANTE}" stroke-width="1.8" stroke-linejoin="round"/>`;
}

/* Eine Hand am Ende des Arms: Handrücken plus drei sichtbare Finger
   und ein Daumen. Klein, aber mit Fingern — eine Murmel ist keine
   Hand, und genau das war die alte Lösung. */
function handChen(x, y, winkel, haut) {
  const f = (fx, fy, w, h, rot) =>
    `<rect x="${r1(fx)}" y="${r1(fy)}" width="${w}" height="${h}" rx="${r1(w / 2)}"
       fill="${haut}" stroke="${KANTE}" stroke-width="1.2"
       transform="rotate(${rot} ${r1(fx + w / 2)} ${r1(fy + h / 2)})"/>`;
  return `<g transform="rotate(${winkel} ${r1(x)} ${r1(y)})">
      <path d="M${r1(x - 6)} ${r1(y - 5)} Q${r1(x + 5)} ${r1(y - 7)} ${r1(x + 6)} ${r1(y)}
               Q${r1(x + 6)} ${r1(y + 6)} ${r1(x - 1)} ${r1(y + 6)}
               Q${r1(x - 7)} ${r1(y + 5)} ${r1(x - 6)} ${r1(y - 5)} Z"
        fill="${haut}" stroke="${KANTE}" stroke-width="1.6" stroke-linejoin="round"/>
      ${f(x - 5.5, y - 8.5, 4.2, 7, -12)}
      ${f(x - 1.2, y - 9.2, 4.4, 8, -3)}
      ${f(x + 3.0, y - 8.2, 4.0, 7, 6)}
      ${f(x - 8.5, y - 2.0, 4.0, 6, -66)}
    </g>`;
}

/* Ein Kopf: gleicher Radius für beide — der Unterschied entstand
   vorher nur durch die Lage. */
function kopf(cx, cy, r, haut, neigung, haar) {
  return `<g transform="rotate(${neigung} ${cx} ${cy})">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${haut}" stroke="${KANTE}" stroke-width="2"/>
      ${haar}
      <circle cx="${r1(cx - r * 0.34)}" cy="${r1(cy - r * 0.1)}" r="1.9" fill="#4a3526"/>
      <circle cx="${r1(cx + r * 0.34)}" cy="${r1(cy - r * 0.1)}" r="1.9" fill="#4a3526"/>
      <path d="M${r1(cx - r * 0.32)} ${r1(cy + r * 0.36)} q${r1(r * 0.32)} ${r1(r * 0.27)} ${r1(r * 0.64)} 0"
        stroke="#4a3526" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      <ellipse cx="${r1(cx - r * 0.62)}" cy="${r1(cy + r * 0.3)}" rx="2.6" ry="1.7" fill="#e0546a" opacity=".3"/>
      <ellipse cx="${r1(cx + r * 0.62)}" cy="${r1(cy + r * 0.3)}" rx="2.6" ry="1.7" fill="#e0546a" opacity=".3"/>
    </g>`;
}

/* Ein Oberkörper MIT SCHULTERN. Vorher war es eine Glocke, aus der
   oben ein Hals herausschaute. */
function koerper(cx, farbe) {
  const s = 15, h = 22;   /* halbe Schulterbreite, halbe Hüftbreite */
  return `<path d="
      M${cx - s} 69
      Q${cx - s - 1} 62 ${cx - s + 5} 61
      L${cx + s - 5} 61
      Q${cx + s + 1} 62 ${cx + s} 69
      Q${cx + h} 90 ${cx + h} 114
      L${cx - h} 114
      Q${cx - h} 90 ${cx - s} 72 Z"
    fill="${farbe}" stroke="${KANTE}" stroke-width="2" stroke-linejoin="round"/>`;
}
/* Der Hals: kurz, und er wird von den Schultern verdeckt. Sechs
   Einheiten statt sechzehn. */
function hals(cx, haut) {
  return `<rect x="${cx - 4.5}" y="56" width="9" height="12" rx="3.5" fill="${haut}" stroke="${KANTE}" stroke-width="1.4"/>`;
}

const HAUT_L = "#f3b57b", HAUT_R = "#e8a768";
const HAAR_L = `<path d="M30 42 Q32 28 44 28 Q56 28 58 42 Q54 35 44 35 Q34 35 30 42 Z" fill="#6b4a2f" opacity=".9"/>`;
const HAAR_R = `<path d="M62 44 Q64 30 76 30 Q88 30 90 44 Q86 37 76 37 Q66 37 62 44 Z" fill="#3f342c" opacity=".85"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
<style>
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  .um { animation: druecken 2.6s ease-in-out infinite; transform-box: view-box; transform-origin: 50% 92%; }
  .hz { animation: hoch 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 50%; }
  @keyframes druecken { 0%,100%{transform:scale(1,1)} 44%{transform:scale(.965,1.025)} 64%{transform:scale(.99,1.008)} }
  @keyframes hoch { 0%,20%{opacity:0;transform:translateY(10px) scale(.6)} 50%{opacity:1;transform:translateY(-2px) scale(1.1)} 100%{opacity:0;transform:translateY(-16px) scale(.9)} }
</style>
<g class="um">
  <!-- hinten: die rechte Figur -->
  ${hals(76, HAUT_R)}
  ${koerper(76, "#6aa6ee")}
  ${kopf(76, 46, 14, HAUT_R, -7, HAAR_R)}
  <!-- ihr Arm geht HINTER der linken Figur um deren Rücken -->
  ${arm([64, 72], [28, 78], 5, 9.5, 7, HAUT_R)}
  <!-- vorn: die linke Figur -->
  ${hals(44, HAUT_L)}
  ${koerper(44, "#e0546a")}
  ${kopf(44, 44, 14, HAUT_L, 8, HAAR_L)}
  <!-- ihre Hand liegt auf der Schulter der rechten Figur -->
  ${handChen(26, 77, -16, HAUT_R)}
  <ellipse cx="57" cy="71" rx="7" ry="6.5" fill="#e0546a" stroke="${KANTE}" stroke-width="1.8"/>
  ${arm([58, 72], [92, 76], 5, 9.5, 7, HAUT_L)}
  ${handChen(94, 75, 12, HAUT_L)}
</g>
<g class="hz"><path d="M60 14 C50 6 44 14 48 21 C51 26 60 30 60 30 C60 30 69 26 72 21 C76 14 70 8 60 16 Z" fill="#e0546a"/></g>
</svg>`;
fs.writeFileSync(__dirname + "/../sticker/umarmung.svg", svg);
console.log("geschrieben:", svg.length, "Zeichen");
