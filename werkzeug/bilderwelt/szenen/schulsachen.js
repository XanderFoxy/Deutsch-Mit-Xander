#!/usr/bin/env node
/* =====================================================================
   SCHULSACHEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Materiallisten deutscher Grundschulen für Klasse 3/4,
   Händlerseiten zu Schulranzen und Klappmäppchen):
   - Der SCHULRANZEN ist kastenförmig, hat einen Deckel mit Magnet-
     verschluss, Reflektorstreifen und eine Vortasche; darin stecken
     Hefte (mit farbigen Umschlägen je Fach), Schnellhefter und Bücher.
   - Das FEDERMÄPPCHEN ist ein Klappmäppchen: in Gummischlaufen die
     BUNTSTIFTE, der FÜLLER (Schreiben lernt man mit dem Füller), der
     BLEISTIFT, ein KUGELSCHREIBER, dazu RADIERGUMMI und ANSPITZER.
   - Auf der Liste stehen außerdem: LINEAL (30 cm), GEODREIECK, ZIRKEL,
     SCHERE, KLEBSTOFF (Klebestift), TASCHENRECHNER, ein DECKFARBKASTEN
     (WASSERFARBEN) mit PINSELN und einem WASSERBECHER, ORDNER.
   - Der Platz dafür ist der SCHREIBTISCH des Kindes: Schreibtischlampe,
     Regal mit Ordnern, der Stundenplan an der Pinnwand.
   BLICK: von oben auf den Schreibtisch (Augenhöhe 1,72 m, 1,3 m vor der
   Wand) — so sieht ein Kind seinen Tisch, wenn es davor steht.
   Maßstab: Wand 80 Einheiten je Meter, Tischkante vorn 160 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "schulsachen", titel: "Schulsachen", emoji: "✏️", thema: "Schule", kuerzel: "b10c", fassung: 852 });
const rnd = zufall(3141);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 30, E = 1.72, D = 1.3, S0 = 80, VX = 160, HT = 0.72;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const rz = (X0, X1, H0, H1, z, fill, extra = "") => { const s = sk(z); return `<rect x="${r(VX + X0 * s)}" y="${r(HY + (E - H1) * s)}" width="${r((X1 - X0) * s)}" height="${r((H1 - H0) * s)}" fill="${fill}"${extra ? " " + extra : ""}/>`; };
/* Flach auf dem Tisch: Zeichnung in Zentimetern (x nach rechts, y zum
   Betrachter), lokal richtig verkürzt an der Stelle (X, z). */
const flach = (X, z, svg, dreh = 0, h = 0) => {
  const [cx, cy] = P(X, HT + h, z), s = sk(z) / 100, f = (E - HT - h) / (D - z);
  return `<g transform="matrix(${s.toFixed(4)} 0 0 ${(s * f).toFixed(4)} ${cx} ${cy})"><g transform="rotate(${dreh})">${svg}</g></g>`;
};
/* Rechteck flach auf dem Tisch, Ecken exakt projiziert */
const blatt = (X0, X1, z0, z1, h = 0) => [P(X0, HT + h, z0), P(X1, HT + h, z0), P(X1, HT + h, z1), P(X0, HT + h, z1)];
const box = (pts, ax, ay, rand = 0.8) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys); return flaeche(x0 - ax - rand, y0 - ay - rand, Math.max(...xs) - x0 + 2 * rand, Math.max(...ys) - y0 + 2 * rand); };

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#a9b1b8"], [1, "#e1e5e8"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Kinderzimmerwand mit Fenster, ABC-Poster, Pinnwand; Boden
   ===================================================================== */
{
  const yW = P(0, 0, 0)[1];
  let k = `<rect x="0" y="0" width="320" height="${yW}" fill="${S.lg("wand", [[0, "#e7f0f2"], [1, "#d6e4e8"]])}"/>`;
  k += `<rect x="0" y="0" width="320" height="${yW}" fill="${S.rg("licht", [[0, "#fffbea", 0.55], [1, "#fffbea", 0]], 0.2, 0.25, 0.7)}"/>`;
  /* Boden (Eichenparkett) unten links und rechts neben dem Tisch */
  k += `<rect x="0" y="${yW}" width="320" height="${r(200 - yW)}" fill="${S.lg("boden", [[0, "#c19566"], [1, "#a97c4e"]])}"/>`;
  for (let i = -30; i <= 30; i++) { const a = P(i * 0.12, 0, 0), b = P(i * 0.12, 0, 0.3); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8d6539" stroke-width=".35" opacity=".6"/>`; }
  k += `<rect x="0" y="${r(yW - 2.4)}" width="320" height="2.4" fill="#f4f4f0"/>`;
  /* Fenster links: Tageslicht, Baum vor dem Haus */
  const [fx0, fy0] = P(-1.95, 2.25, 0), [fx1, fy1] = P(-1.1, 0.95, 0);
  k += `<rect x="${fx0}" y="${fy0}" width="${r(fx1 - fx0)}" height="${r(fy1 - fy0)}" fill="${S.lg("himmel", [[0, "#8ec5ea"], [1, "#dff0f8"]])}"/>`;
  k += `<circle cx="${r(fx0 + 20)}" cy="${r(fy0 + 40)}" r="22" fill="#6aa651"/><circle cx="${r(fx0 + 40)}" cy="${r(fy0 + 52)}" r="16" fill="#5c9645"/><circle cx="${r(fx0 + 12)}" cy="${r(fy0 + 30)}" r="8" fill="#fff" opacity=".12"/>`;
  k += `<rect x="${fx0}" y="${r(fy1 - 18)}" width="${r(fx1 - fx0)}" height="18" fill="#c9a98a"/><rect x="${fx0}" y="${r(fy1 - 18)}" width="${r(fx1 - fx0)}" height="1.4" fill="#a9876a"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(fx0 + 4 + i * 16)}" y="${r(fy1 - 14)}" width="8" height="8" fill="#e9f1f4"/>`;
  k += `<rect x="${fx0}" y="${fy0}" width="${r(fx1 - fx0)}" height="${r(fy1 - fy0)}" fill="none" stroke="#fafafa" stroke-width="3.6"/><rect x="${r((fx0 + fx1) / 2 - 1.4)}" y="${fy0}" width="2.8" height="${r(fy1 - fy0)}" fill="#fafafa"/>`;
  k += `<rect x="${r(fx0 - 3)}" y="${fy1}" width="${r(fx1 - fx0 + 6)}" height="3" fill="#f2f2ee"/>`;
  k += `<path d="M${r(fx0 + 6)} ${r(fy1 - 4)} L${r(fx0 + 22)} ${r(fy0 + 4)} L${r(fx0 + 30)} ${r(fy0 + 4)} L${r(fx0 + 14)} ${r(fy1 - 4)} Z" fill="#fff" opacity=".18"/>`;
  /* ABC-Poster rechts (Anlauttabelle) */
  const [ax0, ay0] = P(1.25, 1.95, 0), [ax1, ay1] = P(1.95, 1.05, 0);
  k += `<rect x="${ax0}" y="${ay0}" width="${r(ax1 - ax0)}" height="${r(ay1 - ay0)}" fill="#fffdf5" stroke="#d8cfb8" stroke-width=".4"/>`;
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const cw = (ax1 - ax0 - 4) / 5, ch = (ay1 - ay0 - 4) / 6;
  for (let i = 0; i < 26; i++) { const c = i % 5, rr = Math.floor(i / 5); if (rr > 5) break; k += `<rect x="${r(ax0 + 2 + c * cw + 0.3)}" y="${r(ay0 + 2 + rr * ch + 0.3)}" width="${r(cw - 0.6)}" height="${r(ch - 0.6)}" rx=".6" fill="${["#fbe3dc", "#e2eefb", "#e6f5df", "#fdf3d2"][(c + rr) % 4]}"/><text x="${r(ax0 + 2 + c * cw + cw / 2)}" y="${r(ay0 + 2 + rr * ch + ch * 0.68)}" font-size="${r(ch * 0.55)}" text-anchor="middle" fill="${["#c0392b", "#2b5fa8", "#2f8a3e", "#b7791f"][(c + rr) % 4]}" font-family="Arial" font-weight="bold">${abc[i]}${abc[i].toLowerCase()}</text>`; }
  /* Pinnwand (Kork) in der Mitte rechts, darauf hängt der Stundenplan */
  const [px0, py0] = P(0.42, 1.62, 0), [px1, py1] = P(1.12, 1.08, 0);
  k += `<rect x="${px0}" y="${py0}" width="${r(px1 - px0)}" height="${r(py1 - py0)}" rx="1" fill="#a87e4c"/><rect x="${r(px0 + 1.5)}" y="${r(py0 + 1.5)}" width="${r(px1 - px0 - 3)}" height="${r(py1 - py0 - 3)}" fill="${S.lg("kork", [[0, "#d8ad78"], [1, "#c99d66"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(px0 + 2 + rnd() * (px1 - px0 - 4))}" cy="${r(py0 + 2 + rnd() * (py1 - py0 - 4))}" r=".3" fill="#9e7444" opacity=".6"/>`;
  /* ein Foto und ein Zettel an der Pinnwand */
  k += `<g transform="rotate(-6 ${r(px1 - 12)} ${r(py0 + 10)})"><rect x="${r(px1 - 18)}" y="${r(py0 + 4)}" width="13" height="10" fill="#fff"/><rect x="${r(px1 - 17)}" y="${r(py0 + 5)}" width="11" height="7.4" fill="${S.lg("foto", [[0, "#9fd1ef"], [0.6, "#9fd1ef"], [0.61, "#e9d38a"], [1, "#e9d38a"]])}"/><circle cx="${r(px1 - 9)}" cy="${r(py0 + 8)}" r="1.6" fill="#f6c434"/></g>`;
  k += `<rect x="${r(px1 - 17)}" y="${r(py0 + 20)}" width="11" height="9" fill="#fff59a" transform="rotate(4 ${r(px1 - 12)} ${r(py0 + 24)})"/><text x="${r(px1 - 11.5)}" y="${r(py0 + 25)}" font-size="2" text-anchor="middle" fill="#333" font-family="'Comic Sans MS',cursive">Sport!</text>`;
  /* Regalbrett über dem Tisch (Kulisse), die Dinge darauf sind Teile */
  const [rx0, ry0] = P(-0.98, 1.3, 0.24), [rx1] = P(0.32, 1.3, 0.24);
  const [qx0, qy0] = P(-0.98, 1.3, 0), [qx1] = P(0.32, 1.3, 0);
  k += poly([[qx0, qy0], [qx1, qy0], [rx1, ry0], [rx0, ry0]], "#fafaf6");
  k += `<rect x="${rx0}" y="${ry0}" width="${r(rx1 - rx0)}" height="${r(0.025 * sk(0.24))}" fill="#e2e2dc"/>`;
  k += `<rect x="${r(rx0 + 6)}" y="${r(ry0 + 2)}" width="3" height="5" fill="#cfcfc8"/><rect x="${r(rx1 - 9)}" y="${r(ry0 + 2)}" width="3" height="5" fill="#cfcfc8"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE ORDNER, Bücher und ein Globus auf dem Regal
   ===================================================================== */
const RB = P(0, 1.3, 0.12)[1];
{
  let k = "";
  const z = 0.13, s = sk(z);
  const ordner = [["#c0392b", "Mathe"], ["#2b5fa8", "Deutsch"], ["#2f8a3e", "Sachunterricht"]];
  ordner.forEach(([f, t], i) => {
    const X = -0.94 + i * 0.085;
    const [x0, y0] = P(X, 1.62, z);
    k += `<rect x="${x0}" y="${y0}" width="${r(0.078 * s)}" height="${r(0.32 * s)}" rx=".5" fill="${f}"/><rect x="${x0}" y="${y0}" width="1.2" height="${r(0.32 * s)}" fill="#000" opacity=".18"/>`;
    k += `<rect x="${r(x0 + 1.4)}" y="${r(y0 + 3)}" width="${r(0.078 * s - 2.8)}" height="${r(0.15 * s)}" fill="#fbfaf4"/>`;
    k += `<text transform="translate(${r(x0 + 0.039 * s + 0.6)} ${r(y0 + 3 + 0.075 * s)}) rotate(-90)" font-size="2.4" text-anchor="middle" fill="#222" font-family="Arial">${t}</text>`;
    k += `<circle cx="${r(x0 + 0.039 * s)}" cy="${r(y0 + 0.26 * s)}" r="2" fill="#fff" stroke="#000" stroke-opacity=".3" stroke-width=".3"/>`;
  });
  const [bx, by] = P(-0.94, 1.3, z);
  S.teil({ id: "ordner", de: "der Ordner", syl: "ORD-ner", it: "il raccoglitore", itSyl: "rac-co-gli-TO-re", en: "folder", x: bx, y: by, kunst: um(bx, by, k),
    tipp: "Für jedes Fach gibt es einen eigenen Ordner." });
}
{
  /* DIE BÜCHER und der Globus (Regal, ein Wort: das Regal) */
  let k = "";
  const z = 0.13, s = sk(z);
  const buecher = ["#e0853a", "#8e5aa8", "#f2c230", "#3bb3c3", "#d6402f", "#5a7d3a"];
  let X = -0.62;
  buecher.forEach((f, i) => {
    const w = 0.035 + (i % 3) * 0.01, h = 0.2 + ((i * 7) % 5) * 0.02;
    const [x0, y0] = P(X, 1.3 + h, z);
    k += `<rect x="${x0}" y="${y0}" width="${r(w * s)}" height="${r(h * s)}" fill="${f}"/><rect x="${x0}" y="${r(y0 + 3)}" width="${r(w * s)}" height="1" fill="#fff" opacity=".55"/><rect x="${x0}" y="${r(y0 + h * s - 4)}" width="${r(w * s)}" height=".8" fill="#000" opacity=".2"/>`;
    X += w + 0.004;
  });
  /* schräg angelehntes Buch */
  const [x0, y0] = P(X + 0.01, 1.3, z);
  k += `<rect x="${x0}" y="${r(y0 - 0.24 * s)}" width="${r(0.04 * s)}" height="${r(0.24 * s)}" fill="#2b5fa8" transform="rotate(-18 ${x0} ${y0})"/>`;
  /* Globus */
  const [gx, gy] = P(0.12, 1.3, z);
  k += `<ellipse cx="${gx}" cy="${r(gy - 0.5)}" rx="${r(0.06 * s)}" ry="1.4" fill="#4a4a4a"/><path d="M${gx} ${r(gy - 1)} v-3" stroke="#4a4a4a" stroke-width="1.2"/>`;
  k += `<circle cx="${gx}" cy="${r(gy - 0.17 * s)}" r="${r(0.12 * s)}" fill="${S.rg("globus", [[0, "#7fc3ea"], [1, "#2a6fa8"]], 0.38, 0.35, 0.7)}"/>`;
  k += `<path d="M${r(gx - 6)} ${r(gy - 0.2 * s)} q4 -5 8 -2 q-1 4 3 6 q-4 3 -7 0 q-2 -1 -4 -4 Z" fill="#7dbb5c"/><path d="M${r(gx + 2)} ${r(gy - 0.1 * s)} q3 1 2 5 q-3 0 -3 -5 Z" fill="#7dbb5c"/>`;
  k += `<path d="M${r(gx - 0.13 * s)} ${r(gy - 0.17 * s)} A${r(0.13 * s)} ${r(0.13 * s)} 0 0 1 ${r(gx + 0.1 * s)} ${r(gy - 0.27 * s)}" stroke="#c9a227" stroke-width="1" fill="none"/>`;
  const [ax, ay] = P(-0.3, 1.3, z);
  S.teil({ id: "ss_regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: ax, y: ay, kunst: um(ax, ay, k) });
}

/* =====================================================================
   2 — DER STUNDENPLAN (an der Pinnwand)
   ===================================================================== */
{
  const [x0, y0] = P(0.48, 1.56, 0), [x1, y1] = P(0.88, 1.14, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="#fffef8" stroke="#d8d0bc" stroke-width=".3"/>`;
  k += `<text x="${r(x0 + w / 2)}" y="${r(y0 + 3.4)}" font-size="2.4" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">Mein Stundenplan</text>`;
  const tage = ["Mo", "Di", "Mi", "Do", "Fr"], f = { D: "#f29a8e", M: "#9cc8ef", S: "#b8e0a2", K: "#f6d77a", Mu: "#d2b4e6", E: "#f7c08a" };
  const plan = [["D", "M", "S", "E", "M"], ["D", "D", "M", "Mu", "K"], ["M", "S", "D", "M", "D"], ["S", "K", "E", "D", "S"], ["Mu", "K", "", "S", ""]];
  const cw = (w - 6) / 5, ch = (h - 8) / 5;
  tage.forEach((t, i) => { k += `<text x="${r(x0 + 4.4 + i * cw + cw / 2)}" y="${r(y0 + 6.6)}" font-size="1.8" text-anchor="middle" fill="#444" font-family="Arial">${t}</text>`; });
  for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) { const c = plan[j][i]; if (!c) continue; k += `<rect x="${r(x0 + 4.4 + i * cw + 0.25)}" y="${r(y0 + 7.4 + j * ch + 0.25)}" width="${r(cw - 0.5)}" height="${r(ch - 0.5)}" fill="${f[c]}"/><text x="${r(x0 + 4.4 + i * cw + cw / 2)}" y="${r(y0 + 7.4 + j * ch + ch * 0.68)}" font-size="1.7" text-anchor="middle" fill="#333" font-family="Arial">${c}</text>`; }
  for (let j = 0; j < 5; j++) k += `<text x="${r(x0 + 2.2)}" y="${r(y0 + 7.4 + j * ch + ch * 0.68)}" font-size="1.6" text-anchor="middle" fill="#777" font-family="Arial">${j + 1}</text>`;
  k += `<circle cx="${r(x0 + w / 2)}" cy="${r(y0 + 0.6)}" r=".9" fill="#d6402f"/>`;
  const [ax, ay] = P(0.68, 1.14, 0);
  S.teil({ id: "ss_stundenplan", de: "der Stundenplan", syl: "STUN-den-plan", it: "l'orario scolastico", itSyl: "o-RA-rio sco-LA-sti-co", en: "school timetable", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Am Abend packt man den Ranzen nach dem Stundenplan." });
}

/* =====================================================================
   3 — DER SCHREIBTISCH (Kinderschreibtisch, Birke, weiße Kante)
   ===================================================================== */
const TI = { X0: -0.72, X1: 0.72, z0: 0, z1: 0.66 };
{
  const { X0, X1, z0, z1 } = TI;
  let k = "";
  /* vordere Beine (weißes Metall), Rest liegt unter der Platte */
  for (const X of [X0 + 0.03, X1 - 0.03]) { const a = P(X, HT - 0.03, z1 - 0.03), b = [P(X, 0, z1 - 0.03)[0], 199.5]; k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e8e8e4" stroke-width="${r(0.04 * sk(z1))}"/>`; }
  k += poly(blatt(X0, X1, z0, z1), S.lg("platte", [[0, "#efe1c4"], [1, "#e3cfa6"]]));
  /* Holzmaserung */
  for (let i = 0; i < 16; i++) { const z = z0 + 0.02 + rnd() * (z1 - 0.04); const a = P(X0 + 0.02, HT, z), b = P(X1 - 0.02, HT, z + (rnd() - 0.5) * 0.02); k += `<path d="M${a[0]} ${a[1]} Q${r((a[0] + b[0]) / 2)} ${r((a[1] + b[1]) / 2 + (rnd() - 0.5) * 2)} ${b[0]} ${b[1]}" stroke="#c9ad7d" stroke-width=".3" fill="none" opacity=".45"/>`; }
  /* Kante und Schublade vorn */
  k += poly([P(X0, HT, z1), P(X1, HT, z1), P(X1, HT - 0.025, z1), P(X0, HT - 0.025, z1)], "#f6f6f2");
  k += poly([P(X0 + 0.02, HT - 0.025, z1 - 0.01), P(X1 - 0.02, HT - 0.025, z1 - 0.01), P(X1 - 0.02, HT - 0.1, z1 - 0.01), P(X0 + 0.02, HT - 0.1, z1 - 0.01)], "#ece9e0");
  { const [gx, gy] = P(0, HT - 0.06, z1 - 0.01); k += `<rect x="${r(gx - 14)}" y="${r(gy - 1)}" width="28" height="2" rx="1" fill="#b8bec3"/>`; }
  /* Licht der Lampe auf der Platte */
  k += poly(blatt(X0, X1, z0, z1), S.rg("lampenlicht", [[0, "#fff6d6", 0.45], [1, "#fff6d6", 0]], 0.62, 0.3, 0.6));
  const [ax, ay] = P(0, HT - 0.1, z1);
  S.teil({ id: "ss_schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Am Schreibtisch macht man die Hausaufgaben." });
}

/* =====================================================================
   4 — DIE SCHREIBTISCHLAMPE (hinten rechts)
   ===================================================================== */
{
  const [bx, by] = P(0.55, HT, 0.1), s = sk(0.1);
  let k = schatten(bx, by, 0.08 * s, 1.4, 0.3);
  k += `<ellipse cx="${bx}" cy="${by}" rx="${r(0.075 * s)}" ry="${r(0.022 * s)}" fill="#2f3a44"/><ellipse cx="${bx}" cy="${r(by - 0.8)}" rx="${r(0.07 * s)}" ry="${r(0.018 * s)}" fill="#4b5966"/>`;
  const j1 = P(0.58, HT + 0.32, 0.06), j2 = P(0.38, HT + 0.5, 0.1), kopf = P(0.28, HT + 0.42, 0.14);
  k += `<path d="M${bx} ${r(by - 1)} L${j1[0]} ${j1[1]} L${j2[0]} ${j2[1]}" stroke="#4b5966" stroke-width="1.6" fill="none" stroke-linejoin="round"/>`;
  k += `<circle cx="${j1[0]}" cy="${j1[1]}" r="1.4" fill="#2f3a44"/><circle cx="${j2[0]}" cy="${j2[1]}" r="1.4" fill="#2f3a44"/>`;
  k += `<path d="M${j2[0]} ${j2[1]} L${r(kopf[0] + 6)} ${r(kopf[1] - 4)}" stroke="#4b5966" stroke-width="1.4"/>`;
  k += `<path d="M${r(kopf[0] + 9)} ${r(kopf[1] - 6)} L${r(kopf[0] - 9)} ${r(kopf[1] + 2)} L${r(kopf[0] - 3)} ${r(kopf[1] + 7)} L${r(kopf[0] + 12)} ${r(kopf[1] - 1)} Z" fill="${S.lg("schirm", [[0, "#5a6b7a"], [1, "#2f3a44"]])}"/>`;
  k += `<path d="M${r(kopf[0] - 9)} ${r(kopf[1] + 2)} L${r(kopf[0] - 3)} ${r(kopf[1] + 7)}" stroke="#fff6d0" stroke-width="1.6" stroke-linecap="round"/>`;
  const [ax, ay] = [bx, by];
  S.teil({ id: "ss_lampe", de: "die Schreibtischlampe", syl: "SCHREIB-tisch-lam-pe", it: "la lampada da scrivania", itSyl: "LAM-pa-da da scri-va-NI-a", en: "desk lamp", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}

/* =====================================================================
   5 — DER SCHULRANZEN (offen, hinten links)
   ===================================================================== */
{
  const X0 = -0.67, X1 = -0.35, z = 0.2, s = sk(z);
  const [x0, yb] = P(X0, HT, z), [x1] = P(X1, HT, z);
  const w = x1 - x0, h = 0.36 * s, cx = (x0 + x1) / 2;
  let k = schatten(cx, yb, w * 0.55, 1.6, 0.32);
  /* Deckel aufgeklappt nach hinten (gegen die Wand gelehnt) */
  k += `<path d="M${r(x0 + 2)} ${r(yb - h + 4)} L${r(x0 + 4)} ${r(yb - h - 0.2 * s)} Q${cx} ${r(yb - h - 0.23 * s)} ${r(x1 - 4)} ${r(yb - h - 0.2 * s)} L${r(x1 - 2)} ${r(yb - h + 4)} Z" fill="${S.lg("deckel", [[0, "#2a8f9a"], [1, "#1f6f7a"]])}"/>`;
  k += `<path d="M${r(x0 + 6)} ${r(yb - h - 0.15 * s)} Q${cx} ${r(yb - h - 0.17 * s)} ${r(x1 - 6)} ${r(yb - h - 0.15 * s)}" stroke="#e8f04a" stroke-width="1.2" fill="none"/>`;
  /* Inhalt: Hefte und Schnellhefter stehen heraus */
  const hefte = ["#d6402f", "#2b5fa8", "#f2c230", "#2f8a3e", "#8e5aa8"];
  hefte.forEach((f, i) => { k += `<rect x="${r(x0 + 3 + i * (w - 8) / 5)}" y="${r(yb - h - 3 - (i % 2) * 1.6)}" width="${r((w - 8) / 5 + 1)}" height="10" rx=".5" fill="${f}" stroke="#000" stroke-opacity=".15" stroke-width=".2"/>`; });
  /* Korpus */
  k += `<path d="M${x0} ${yb} L${x0} ${r(yb - h + 4)} Q${x0} ${r(yb - h)} ${r(x0 + 4)} ${r(yb - h)} L${r(x1 - 4)} ${r(yb - h)} Q${x1} ${r(yb - h)} ${x1} ${r(yb - h + 4)} L${x1} ${yb} Z" fill="${S.lg("ranzen", [[0, "#36b0bc"], [0.5, "#2a98a4"], [1, "#1f7a85"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${x0}" y="${r(yb - h)}" width="${r(w)}" height="2.2" rx="1" fill="#1d6670"/>`;
  /* Vortasche mit Motiv und Reflektoren */
  k += `<rect x="${r(x0 + 3)}" y="${r(yb - h * 0.55)}" width="${r(w - 6)}" height="${r(h * 0.5)}" rx="3" fill="${S.lg("vortasche", [[0, "#ee6aa0"], [1, "#c94a80"]])}"/>`;
  k += `<path d="M${r(x0 + 5)} ${r(yb - h * 0.5)} h${r(w - 10)}" stroke="#333" stroke-width=".5" stroke-dasharray=".8 .5"/>`;
  for (const [dx, dy, rr] of [[0.3, 0.35, 2.4], [0.55, 0.22, 1.5], [0.72, 0.38, 1.9]]) { const sx = x0 + w * dx, sy = yb - h * dy; k += `<path d="M${r(sx)} ${r(sy - rr)} l${r(rr * 0.3)} ${r(rr * 0.7)} l${r(rr * 0.75)} 0 l${r(-rr * 0.6)} ${r(rr * 0.45)} l${r(rr * 0.25)} ${r(rr * 0.75)} l${r(-rr * 0.7)} ${r(-rr * 0.45)} l${r(-rr * 0.7)} ${r(rr * 0.45)} l${r(rr * 0.25)} ${r(-rr * 0.75)} l${r(-rr * 0.6)} ${r(-rr * 0.45)} l${r(rr * 0.75)} 0 Z" fill="#fff59a"/>`; }
  k += `<rect x="${r(x0 + 1)}" y="${r(yb - h * 0.75)}" width="${r(w - 2)}" height="1.6" fill="#e8f04a"/><rect x="${r(x0 + 1)}" y="${r(yb - h * 0.75)}" width="${r(w - 2)}" height=".5" fill="#fff" opacity=".7"/>`;
  k += `<rect x="${r(x0 + 1)}" y="${r(yb - 3.6)}" width="${r(w - 2)}" height="2.2" rx="1" fill="#1d6670"/>`;
  /* Seitentasche mit Trinkflasche */
  k += `<rect x="${r(x1 - 1)}" y="${r(yb - h * 0.5)}" width="3" height="${r(h * 0.45)}" rx="1" fill="#1f7a85"/><rect x="${r(x1 - 0.4)}" y="${r(yb - h * 0.72)}" width="2.2" height="${r(h * 0.3)}" rx=".8" fill="#9fd36b"/>`;
  k += `<path d="M${r(x0 + 1.5)} ${r(yb - h + 6)} L${r(x0 + 1.5)} ${r(yb - 6)}" stroke="#fff" stroke-width="1" opacity=".25"/>`;
  S.teil({ id: "ranzen", de: "der Schulranzen", syl: "SCHUL-ran-zen", it: "la cartella", itSyl: "car-TEL-la", en: "school bag", x: cx, y: yb, steht: true, kunst: um(cx, yb, k),
    tipp: "Die gelben Streifen leuchten im Dunkeln, wenn Licht darauf fällt. So sehen Autofahrer das Kind." });
}

/* =====================================================================
   6 — DAS FEDERMÄPPCHEN (Klappmäppchen, aufgeklappt) — Lupe
   ===================================================================== */
{
  const Xc = -0.02, zc = 0.16, s = sk(zc), f = (E - HT) / (D - zc);
  const map = (u, v) => P(Xc + u / 100, HT + 0.006, zc + v / 100);       /* u, v in cm */
  let k = "";
  /* Stoff: drei Klappen, dunkelblau mit Punkten */
  const klappe = (u0, u1, farbe) => poly([map(u0, -10), map(u1, -10), map(u1, 10), map(u0, 10)], farbe, 'stroke="#1b2a4a" stroke-width=".4"');
  k += poly([map(-22, -9), map(22, -9), map(22, 11), map(-22, 11)], "#000", 'opacity=".2"');
  k += klappe(-21.5, -7.5, S.lg("stoff1", [[0, "#2c4a86"], [1, "#223a6b"]])) + klappe(-7.2, 7.2, S.lg("stoff2", [[0, "#30519a"], [1, "#26407a"]])) + klappe(7.5, 21.5, S.lg("stoff1b", [[0, "#2c4a86"], [1, "#223a6b"]]));
  for (let i = 0; i < 26; i++) { const u = -21 + rnd() * 42, v = -9.5 + rnd() * 19; if (Math.abs(Math.abs(u) - 7.3) < 0.8) continue; const p = map(u, v); k += `<circle cx="${p[0]}" cy="${p[1]}" r=".35" fill="#fff" opacity=".35"/>`; }
  /* Gummischlaufen */
  const schlaufe = (u0, u1, v) => poly([map(u0, v - 0.6), map(u1, v - 0.6), map(u1, v + 0.6), map(u0, v + 0.6)], "#e9e3d4", 'opacity=".9"');
  /* Stift entlang v (zum Betrachter), in cm: Mitte u, von v0 bis v1, Breite b */
  const stift = (u, v0, v1, b, farbe, spitze) => {
    let g = poly([map(u - b / 2, v0 + 1.5), map(u + b / 2, v0 + 1.5), map(u + b / 2, v1), map(u - b / 2, v1)], farbe);
    g += poly([map(u - b / 2, v0 + 1.5), map(u, v0), map(u + b / 2, v0 + 1.5)], spitze || "#e8c89a");
    g += `<line x1="${map(u - b / 4, v0 + 2)[0]}" y1="${map(u, v0 + 2)[1]}" x2="${map(u - b / 4, v1)[0]}" y2="${map(u, v1)[1]}" stroke="#fff" stroke-width=".25" opacity=".45"/>`;
    return g;
  };
  const unter = [];
  const U = (o, pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); const x0 = Math.min(...xs) - 0.5, x1 = Math.max(...xs) + 0.5, y0 = Math.min(...ys) - 0.5, y1 = Math.max(...ys) + 0.5; unter.push(Object.assign(o, { x: r((x0 + x1) / 2), y: r(y1), kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0) })); };
  /* links: zwölf Buntstifte */
  const bunt = ["#d6402f", "#f29a2e", "#f6d23a", "#9ccc3a", "#2f8a3e", "#3bb3c3", "#2b5fa8", "#1b2a6b", "#8e5aa8", "#e86aa0", "#8a5a2c", "#222"];
  bunt.forEach((c, i) => { k += stift(-20.2 + i * 1.12, -8.6 + (i % 2) * 0.8, 8.6, 0.85, c); });
  k += schlaufe(-21, -8, -2) + schlaufe(-21, -8, 5);
  U({ id: "buntstift", de: "der Buntstift", syl: "BUNT-stift", it: "il pastello", itSyl: "pa-STEL-lo", en: "coloured pencil", tipp: "Zwölf Buntstifte – jede Farbe hat ihre eigene Schlaufe." }, [map(-21, -9), map(-8, 9)]);
  /* Mitte: Füller, Bleistift, Kugelschreiber */
  k += stift(-4.4, -8.2, 6.6, 1.4, S.lg("fueller", [[0, "#1f5fa8"], [1, "#3b82d0"]], 0, 0, 1, 0), "#c9cfd4");
  { const p = map(-4.4, -8.6); k += `<path d="M${p[0]} ${r(p[1] - 0.4)} l.4 1.4 l-.8 0 Z" fill="#c9a227"/>`; const c0 = map(-5.1, 6.6), c1 = map(-3.7, 9.6); k += `<rect x="${c0[0]}" y="${c0[1]}" width="${r(c1[0] - c0[0])}" height="${r(c1[1] - c0[1])}" rx=".5" fill="#163f73"/><rect x="${r(c0[0] + 0.3)}" y="${r(c0[1] + 0.4)}" width=".35" height="${r(c1[1] - c0[1] - 1)}" fill="#c9cfd4"/>`; }
  U({ id: "fueller", de: "der Füller", syl: "FÜL-ler", it: "la penna stilografica", itSyl: "sti-lo-GRA-fi-ca", en: "fountain pen", tipp: "In der Grundschule schreiben viele Kinder mit dem Füller. Die Tinte ist blau." }, [map(-5.4, -9), map(-3.4, 9.6)]);
  k += stift(0, -8.6, 8.4, 1.0, "#f2c230", "#e8c89a");
  { const p = map(0, -8.6), q = map(0, -7.9); k += `<path d="M${r(p[0] - 0.2)} ${r(p[1] + 0.2)} L${p[0]} ${p[1]} L${r(p[0] + 0.2)} ${r(p[1] + 0.2)}" stroke="#333" stroke-width=".3"/>`; const e0 = map(-0.5, 7.6), e1 = map(0.5, 8.6); k += `<rect x="${e0[0]}" y="${e0[1]}" width="${r(e1[0] - e0[0])}" height="${r(e1[1] - e0[1])}" fill="#e86a8a"/>`; for (let i = 0; i < 4; i++) { const a = map(-0.5, -6 + i * 3), b = map(0.5, -6 + i * 3); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#222" stroke-width=".25"/>`; } }
  U({ id: "bleistift", de: "der Bleistift", syl: "BLEI-stift", it: "la matita", itSyl: "ma-TI-ta", en: "pencil" }, [map(-1, -9), map(1, 8.8)]);
  k += stift(4.4, -8.2, 8.2, 1.1, "#e9e6de", "#9aa3aa");
  { const c0 = map(3.9, -2), c1 = map(4.9, 8.2); k += `<rect x="${c0[0]}" y="${c0[1]}" width="${r(c1[0] - c0[0])}" height="${r(c1[1] - c0[1])}" fill="#d6402f"/>`; const cl = map(5, 5); k += `<rect x="${cl[0]}" y="${cl[1]}" width=".5" height="5" fill="#9aa3aa"/>`; }
  U({ id: "kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna", itSyl: "PEN-na", en: "ballpoint pen" }, [map(3.4, -9), map(5.6, 8.6)]);
  k += schlaufe(-7, 7, -1) + schlaufe(-7, 7, 6);
  /* rechts: Radiergummi und Anspitzer */
  {
    const r0 = map(9.5, -7), r1 = map(15.5, -3.6);
    k += `<rect x="${r0[0]}" y="${r0[1]}" width="${r(r1[0] - r0[0])}" height="${r(r1[1] - r0[1])}" rx=".8" fill="#f6f3ea" stroke="#d8d2c2" stroke-width=".3"/><rect x="${r0[0]}" y="${r0[1]}" width="${r((r1[0] - r0[0]) * 0.55)}" height="${r(r1[1] - r0[1])}" rx=".8" fill="#3b82d0"/><text x="${r(r0[0] + (r1[0] - r0[0]) * 0.27)}" y="${r((r0[1] + r1[1]) / 2 + 0.6)}" font-size="1.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">RADIER</text>`;
    U({ id: "radiergummi", de: "der Radiergummi", syl: "Ra-DIER-gum-mi", it: "la gomma", itSyl: "GOM-ma", en: "eraser", tipp: "Mit dem Radiergummi kann man Bleistift wegradieren – Füller aber nicht." }, [r0, r1]);
    const a0 = map(10.5, 0.5), a1 = map(14.5, 4.5);
    k += `<rect x="${a0[0]}" y="${a0[1]}" width="${r(a1[0] - a0[0])}" height="${r(a1[1] - a0[1])}" rx="1" fill="${S.lg("spitzer", [[0, "#f05a5a"], [1, "#b8302f"]])}"/><circle cx="${r((a0[0] + a1[0]) / 2)}" cy="${r((a0[1] + a1[1]) / 2)}" r="1.1" fill="#4a1414"/><rect x="${r(a0[0] + 0.6)}" y="${r(a0[1] + 0.5)}" width="${r(a1[0] - a0[0] - 1.2)}" height=".8" fill="${STAHL}"/>`;
    U({ id: "anspitzer", de: "der Anspitzer", syl: "AN-spit-zer", it: "il temperamatite", itSyl: "tem-pe-ra-ma-TI-te", en: "sharpener" }, [a0, a1]);
    /* Namensschildchen in der Klappe */
    const n0 = map(9, 6), n1 = map(20.5, 9.2);
    k += `<rect x="${n0[0]}" y="${n0[1]}" width="${r(n1[0] - n0[0])}" height="${r(n1[1] - n0[1])}" rx=".4" fill="#fffef6"/><text x="${r((n0[0] + n1[0]) / 2)}" y="${r((n0[1] + n1[1]) / 2 + 0.7)}" font-size="1.9" text-anchor="middle" fill="#1f5fa8" font-family="'Comic Sans MS',cursive">Lena 3b</text>`;
  }
  /* Reißverschluss am Rand */
  k += `<path d="M${map(-21.5, -10)[0]} ${map(-21.5, -10)[1]} L${map(21.5, -10)[0]} ${map(21.5, -10)[1]}" stroke="#9aa3aa" stroke-width=".6" stroke-dasharray=".5 .4"/>`;
  const [ax, ay] = map(0, 11);
  const z0 = map(-24, -12), z1 = map(24, 12);
  S.teil({ id: "federmaeppchen", de: "das Federmäppchen", syl: "FE-der-mäpp-chen", it: "l'astuccio", itSyl: "a-STUC-cio", en: "pencil case", x: ax, y: ay, kunst: um(ax, ay, k),
    zoom: { x: r(z0[0]), y: r(z0[1] - 2), w: r(z1[0] - z0[0]), h: r((z1[0] - z0[0]) / 1.5) },
    unter: unter.map((u) => Object.assign(u, { x: u.x, y: u.y })),
    tipp: "Im Federmäppchen hat jeder Stift seinen festen Platz." });
}

/* =====================================================================
   7 — DAS SCHULBUCH (links, Lesebuch) — Lupe öffnet das Buch
   ===================================================================== */
{
  const X = -0.54, z = 0.42, dr = -8;
  let g = `<rect x="-10.2" y="-13.6" width="20.4" height="27.6" rx=".6" fill="#000" opacity=".22" transform="translate(.8 1)"/>`;
  g += `<rect x="-10.5" y="-14" width="21" height="28" rx=".8" fill="${S.lg("buchdeckel", [[0, "#f29a2e"], [1, "#e07a1f"]])}"/>`;
  g += `<rect x="-10.5" y="-14" width="2.2" height="28" fill="#c8641a"/>`;
  g += `<rect x="-6.5" y="-11" width="15" height="5.4" rx=".6" fill="#fff8e8"/><text x="1" y="-7.2" font-size="3.4" text-anchor="middle" fill="#c8641a" font-family="Arial" font-weight="bold">Lesebuch</text>`;
  g += `<circle cx="1" cy="3" r="5.6" fill="#ffe08a"/><path d="M-3.5 6.2 q4.5 -7 9 0 Z" fill="#6aa651"/><circle cx="-0.6" cy="1.6" r="1.6" fill="#8a5a2c"/><circle cx="2.6" cy="1.6" r="1.4" fill="#d6402f"/>`;
  g += `<text x="1" y="12" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">3</text>`;
  /* Buchschnitt (Seitenkante) vorn */
  g += `<rect x="-10.3" y="14" width="20.6" height="1.6" fill="#f3efe4"/><rect x="-10.3" y="15.4" width="20.6" height=".5" fill="#e07a1f"/>`;
  const [ax, ay] = P(X, HT, z + 0.16);
  const k = flach(X, z, g, dr, 0.012);
  S.teil({ id: "schulbuch", de: "das Schulbuch", syl: "SCHUL-buch", it: "il libro di scuola", itSyl: "LI-bro di SCUO-la", en: "textbook", x: ax, y: ay, kunst: um(ax, ay, k), lupe: "buch_detail" });
}

/* =====================================================================
   8 — DAS HEFT (aufgeschlagen, kariert, Mathe) und 9 — DAS GEODREIECK
   ===================================================================== */
{
  const X = -0.17, z = 0.43, dr = 3;
  let g = `<rect x="-14.6" y="-10" width="29.6" height="21" fill="#000" opacity=".18" transform="translate(.6 .8)"/>`;
  g += `<rect x="-14.8" y="-10.5" width="29.6" height="21" rx=".3" fill="#2b5fa8"/>`;
  g += `<rect x="-14.4" y="-10.3" width="14.3" height="20.6" fill="#fdfdfa"/><rect x=".1" y="-10.3" width="14.3" height="20.6" fill="#fbfbf7"/>`;
  /* Kästchen */
  let kar = "";
  for (let x = -14; x < 14.2; x += 0.5) kar += `<line x1="${r(x)}" y1="-10" x2="${r(x)}" y2="10" stroke="#9cc0e0" stroke-width=".05"/>`;
  for (let y = -10; y < 10.2; y += 0.5) kar += `<line x1="-14.2" y1="${r(y)}" x2="14.2" y2="${r(y)}" stroke="#9cc0e0" stroke-width=".05"/>`;
  g += kar;
  g += `<rect x="-0.4" y="-10.3" width=".8" height="20.6" fill="#000" opacity=".12"/>`;
  /* Rechnungen links, eine gezeichnete Figur rechts */
  const sums = ["24 + 18 = 42", "56 − 27 = 29", "7 · 8 = 56", "63 : 9 = 7", "125 + 75 = 200"];
  sums.forEach((t, i) => { g += `<text x="-12.5" y="${r(-7 + i * 3.2)}" font-size="1.9" fill="#1f3f8a" font-family="'Comic Sans MS',cursive">${t}</text>`; });
  g += `<text x="2" y="-7.2" font-size="1.9" fill="#1f3f8a" font-family="'Comic Sans MS',cursive">Kreis, r = 3 cm</text>`;
  g += `<circle cx="7" cy="1.4" r="5" fill="none" stroke="#555" stroke-width=".15"/><circle cx="7" cy="1.4" r=".2" fill="#555"/><line x1="7" y1="1.4" x2="12" y2="1.4" stroke="#d6402f" stroke-width=".15"/>`;
  g += `<path d="M-12 8.4 l.6 .6 l1.2 -1.4" stroke="#2f8a3e" stroke-width=".3" fill="none"/><text x="-10" y="9" font-size="1.4" fill="#2f8a3e" font-family="'Comic Sans MS',cursive">Super!</text>`;
  const k = flach(X, z, g, dr, 0.003);
  const [ax, ay] = P(X, HT, z + 0.11);
  S.teil({ id: "heft", de: "das Heft", syl: "HEFT", it: "il quaderno", itSyl: "qua-DER-no", en: "exercise book", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Ein Heft mit Kästchen ist für Mathe, eines mit Linien für Deutsch." });
}
{
  const X = -0.06, z = 0.6, dr = -6;
  let g = `<path d="M-8 0 L8 0 L0 -8 Z" fill="#dff1f6" opacity=".7" stroke="#7ab6c8" stroke-width=".15"/>`;
  for (let i = -7; i <= 7; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="${i % 5 ? -0.5 : -0.9}" stroke="#2a5a6a" stroke-width=".08"/>`;
  g += `<path d="M-4.5 -0.6 A4.5 4.5 0 0 1 4.5 -0.6" stroke="#2a5a6a" stroke-width=".07" fill="none"/>`;
  g += `<path d="M-3 0 L0 -3 L3 0" stroke="#2a5a6a" stroke-width=".07" fill="none"/><path d="M-6 -1.2 L-1.2 -6" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
  g += `<text x="0" y="-1.6" font-size=".9" text-anchor="middle" fill="#2a5a6a" font-family="Arial">GEO</text>`;
  const k = flach(X, z, g, dr, 0.002);
  const [ax, ay] = P(X, HT, z + 0.01);
  const e = [P(X - 0.085, HT, z - 0.09), P(X + 0.085, HT, z + 0.01)];
  S.teil({ oben: true, id: "ss_geodreieck", de: "das Geodreieck", syl: "GE-o-drei-eck", it: "la squadra goniometro", itSyl: "SQUA-dra go-NIO-me-tro", en: "set square", x: ax, y: ay, kunst: um(ax, ay, k) + box(e, ax, ay, 0.4),
    tipp: "Mit dem Geodreieck misst man Winkel und zeichnet gerade Linien." });
}

/* =====================================================================
   10 — DIE WASSERFARBEN (Deckfarbkasten), 11 — DER PINSEL,
   12 — DER WASSERBECHER
   ===================================================================== */
{
  const X = 0.24, z = 0.33;
  /* Kasten 26 × 9 cm, Deckel aufgeklappt dahinter (als Mischpalette) */
  let g = `<rect x="-13" y="-9.6" width="26" height="9.2" rx=".6" fill="#f4f4f2" stroke="#b8bcc0" stroke-width=".2"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="${-11.5 + i * 8.2}" y="-8.6" width="6.6" height="7.2" rx="1.2" fill="#ecebe6" stroke="#cfd2d4" stroke-width=".15"/>`;
  for (const [cx, cy, c] of [[-8, -5, "#d6402f"], [-7, -3.4, "#f29a2e"], [0.8, -5.4, "#2b5fa8"], [-0.4, -3, "#57b05a"], [8, -4.4, "#8e5aa8"]]) g += `<ellipse cx="${cx}" cy="${cy}" rx="1.3" ry=".8" fill="${c}" opacity=".7"/>`;
  g += `<rect x="-13.4" y="0" width="26.8" height="10" rx=".8" fill="#1f5fa8"/><rect x="-12.8" y=".5" width="25.6" height="9" rx=".5" fill="#f4f4f2"/>`;
  const farben = ["#f6e04a", "#f6b42e", "#e8582a", "#c91f2a", "#c8327a", "#6a3c9a", "#2c3f9e", "#2f8bd0", "#1f8a4a", "#7ab83a", "#8a5a2c", "#222"];
  farben.forEach((c, i) => { const x = -11.8 + (i % 6) * 4.1, y = 1.2 + Math.floor(i / 6) * 3.9; g += `<rect x="${r(x)}" y="${r(y)}" width="3.4" height="3.2" rx=".4" fill="${c}"/><ellipse cx="${r(x + 1.7)}" cy="${r(y + 1.6)}" rx="1.1" ry=".9" fill="#fff" opacity=".15"/>`; });
  g += `<rect x="-13.4" y="0" width="26.8" height=".5" fill="#163f73"/>`;
  const k = flach(X, z, g, 0, 0.004);
  const [ax, ay] = P(X, HT, z + 0.1);
  S.teil({ id: "wasserfarben", de: "die Wasserfarben", syl: "WAS-ser-far-ben", it: "gli acquerelli", itSyl: "ac-que-REL-li", en: "watercolours", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Im Deckfarbkasten sind zwölf Farben. Den Deckel nimmt man zum Mischen." });
}
{
  /* Wasserbecher (Faltbecher aus Kunststoff), hinten rechts neben dem Kasten */
  const [cx, cy] = P(0.46, HT, 0.25), s = sk(0.25);
  const w = 0.07 * s, h = 0.09 * s;
  let k = schatten(cx, cy, w * 0.7, 1.2, 0.28);
  k += `<path d="M${r(cx - w / 2)} ${r(cy - h)} L${r(cx + w / 2)} ${r(cy - h)} L${r(cx + w * 0.4)} ${cy} L${r(cx - w * 0.4)} ${cy} Z" fill="#e9f6fb" opacity=".75" stroke="#9cc6d6" stroke-width=".3"/>`;
  k += `<path d="M${r(cx - w * 0.47)} ${r(cy - h * 0.62)} L${r(cx + w * 0.47)} ${r(cy - h * 0.62)} L${r(cx + w * 0.4)} ${cy} L${r(cx - w * 0.4)} ${cy} Z" fill="#8fb4c8" opacity=".55"/>`;
  k += `<ellipse cx="${cx}" cy="${r(cy - h * 0.62)}" rx="${r(w * 0.47)}" ry="${r(w * 0.16)}" fill="#a9c6d4" opacity=".8"/><ellipse cx="${cx}" cy="${r(cy - h)}" rx="${r(w / 2)}" ry="${r(w * 0.17)}" fill="none" stroke="#9cc6d6" stroke-width=".4"/>`;
  for (let i = 1; i < 4; i++) k += `<line x1="${r(cx - w * (0.5 - i * 0.015))}" y1="${r(cy - h * (1 - i * 0.25))}" x2="${r(cx + w * (0.5 - i * 0.015))}" y2="${r(cy - h * (1 - i * 0.25))}" stroke="#9cc6d6" stroke-width=".25"/>`;
  k += `<path d="M${r(cx - w * 0.38)} ${r(cy - h * 0.9)} L${r(cx - w * 0.32)} ${r(cy - 1)}" stroke="#fff" stroke-width=".7" opacity=".8"/>`;
  S.teil({ oben: true, id: "ss_wasserbecher", de: "der Wasserbecher", syl: "WAS-ser-be-cher", it: "il bicchiere per l'acqua", itSyl: "bic-CHIE-re per L'AC-qua", en: "water pot", x: cx, y: cy, kunst: um(cx, cy, k),
    tipp: "Im Wasserbecher wäscht man den Pinsel aus." });
}
{
  const X = 0.2, z = 0.47, dr = -12;
  let g = `<rect x="-9" y="-.45" width="12" height=".9" rx=".45" fill="${S.lg("stiel", [[0, "#e2563a"], [1, "#b33b22"]], 0, 0, 0, 1)}"/><rect x="3" y="-.55" width="2.2" height="1.1" fill="#c9cfd4"/><path d="M5.2 -.55 Q7.6 -.6 8.6 0 Q7.6 .6 5.2 .55 Z" fill="#3a2a1a"/><path d="M7 -.3 Q8 0 8.6 0" stroke="#2b5fa8" stroke-width=".3"/>`;
  const k = flach(X, z, g, dr, 0.006);
  const [ax, ay] = P(X, HT, z + 0.02);
  const e = [P(X - 0.09, HT, z - 0.03), P(X + 0.09, HT, z + 0.03)];
  S.teil({ oben: true, id: "pinsel", de: "der Pinsel", syl: "PIN-sel", it: "il pennello", itSyl: "pen-NEL-lo", en: "brush", x: ax, y: ay, kunst: um(ax, ay, k) + box(e, ax, ay, 0.3) });
}

/* =====================================================================
   13 — DER TASCHENRECHNER, 14 — DER ZIRKEL (vorn rechts)
   ===================================================================== */
{
  const X = 0.44, z = 0.52, dr = -10;
  let g = `<rect x="-4.2" y="-7.6" width="8.4" height="15.2" rx="1" fill="#000" opacity=".25" transform="translate(.5 .7)"/><rect x="-4.2" y="-7.6" width="8.4" height="15.2" rx="1" fill="${S.lg("rechner", [[0, "#3a3f45"], [1, "#24282c"]])}"/>`;
  g += `<rect x="-3.4" y="-6.8" width="6.8" height="3" rx=".4" fill="#b9c9b0"/><text x="3" y="-4.4" font-size="2" text-anchor="end" fill="#2a3326" font-family="monospace">42</text>`;
  g += `<rect x="-3.4" y="-3.3" width="6.8" height=".9" rx=".3" fill="#5a6168"/>`;
  for (let i = 0; i < 20; i++) { const c = i % 4, rr = Math.floor(i / 4); g += `<rect x="${r(-3.4 + c * 1.75)}" y="${r(-2 + rr * 1.85)}" width="1.4" height="1.4" rx=".3" fill="${c === 3 ? "#e0853a" : rr === 0 ? "#8a9298" : "#e9e9e6"}"/>`; }
  const k = flach(X, z, g, dr, 0.012);
  const [ax, ay] = P(X, HT, z + 0.08);
  S.teil({ oben: true, id: "taschenrechner", de: "der Taschenrechner", syl: "TA-schen-rech-ner", it: "la calcolatrice", itSyl: "cal-co-la-TRI-ce", en: "calculator", x: ax, y: ay, kunst: um(ax, ay, k) });
}
{
  const X = 0.6, z = 0.5, dr = 20;
  let g = `<circle cx="0" cy="-6.6" r="1" fill="#c9cfd4" stroke="#7d868c" stroke-width=".2"/><rect x="-.3" y="-8.4" width=".6" height="1.6" fill="#7d868c"/>`;
  g += `<path d="M-.4 -6 L-3.2 5.4 L-2.6 5.6 L.2 -5.8 Z" fill="${STAHL}" stroke="#7d868c" stroke-width=".1"/><path d="M.4 -6 L3.4 5 L2.8 5.2 L-.2 -5.8 Z" fill="${STAHL}" stroke="#7d868c" stroke-width=".1"/>`;
  g += `<path d="M-3.2 5.4 L-3.1 6.6" stroke="#555" stroke-width=".25"/><rect x="2.6" y="4.8" width=".9" height="2.2" rx=".2" fill="#e8c34a" transform="rotate(-20 3 5)"/><path d="M3.2 7 L3.3 7.6" stroke="#333" stroke-width=".3"/>`;
  g += `<path d="M-1.8 0 L1.9 -0.2" stroke="#7d868c" stroke-width=".2"/><circle cx="0" cy="-.1" r=".5" fill="#c9cfd4"/>`;
  const k = flach(X, z, g, dr, 0.006);
  const [ax, ay] = P(X, HT, z + 0.08);
  const e = [P(X - 0.06, HT, z - 0.08), P(X + 0.06, HT, z + 0.08)];
  S.teil({ oben: true, id: "zirkel", de: "der Zirkel", syl: "ZIR-kel", it: "il compasso", itSyl: "com-PAS-so", en: "compass", x: ax, y: ay, kunst: um(ax, ay, k) + box(e, ax, ay, 0.4),
    tipp: "Mit dem Zirkel zeichnet man einen Kreis." });
}

/* =====================================================================
   15 — DAS LINEAL, 16 — DIE SCHERE, 17 — DER KLEBSTOFF (vorn links)
   ===================================================================== */
{
  const X = -0.33, z = 0.62, dr = 2;
  let g = `<rect x="-16" y="-1.8" width="32" height="3.6" rx=".3" fill="#dff1f6" opacity=".75" stroke="#7ab6c8" stroke-width=".15"/>`;
  for (let i = 0; i <= 30; i++) g += `<line x1="${-15 + i}" y1="-1.8" x2="${-15 + i}" y2="${i % 5 ? -1.1 : -0.6}" stroke="#1f3f5a" stroke-width=".1"/>`;
  for (let i = 0; i <= 30; i += 5) g += `<text x="${-15 + i}" y=".6" font-size=".9" text-anchor="middle" fill="#1f3f5a" font-family="Arial">${i}</text>`;
  g += `<rect x="-16" y="1" width="32" height=".5" fill="#fff" opacity=".6"/>`;
  const k = flach(X, z, g, dr, 0.002);
  const [ax, ay] = P(X, HT, z + 0.02);
  const e = [P(X - 0.16, HT, z - 0.025), P(X + 0.16, HT, z + 0.025)];
  S.teil({ oben: true, id: "lineal", de: "das Lineal", syl: "Li-ne-AL", it: "la riga", itSyl: "RI-ga", en: "ruler", x: ax, y: ay, kunst: um(ax, ay, k) + box(e, ax, ay, 0.4),
    tipp: "Das Lineal ist 30 Zentimeter lang." });
}
{
  const X = -0.6, z = 0.6, dr = 35;
  let g = `<path d="M-1 -.5 L9 -.9 Q9.6 -.4 9 0 L-1 .6 Z" fill="${STAHL}" stroke="#7d868c" stroke-width=".1"/><path d="M-1 .5 L8.6 1.5 Q9.2 1.2 8.8 .7 L-1 -.4 Z" fill="#c9cfd4" stroke="#7d868c" stroke-width=".1"/>`;
  g += `<ellipse cx="-3.6" cy="-1.6" rx="2.6" ry="1.8" fill="none" stroke="#2f8a3e" stroke-width="1.1"/><ellipse cx="-3.6" cy="1.8" rx="2.6" ry="1.8" fill="none" stroke="#2f8a3e" stroke-width="1.1"/>`;
  g += `<circle cx="-.6" cy="0" r=".45" fill="#7d868c"/>`;
  const k = flach(X, z, g, dr, 0.006);
  const [ax, ay] = P(X, HT, z + 0.04);
  const e = [P(X - 0.07, HT, z - 0.06), P(X + 0.06, HT, z + 0.06)];
  S.teil({ oben: true, id: "schere", de: "die Schere", syl: "SCHE-re", it: "le forbici", itSyl: "FOR-bi-ci", en: "scissors", x: ax, y: ay, kunst: um(ax, ay, k) + box(e, ax, ay, 0.3),
    tipp: "Die Kinderschere hat eine runde Spitze." });
}
{
  /* Klebestift, stehend */
  const [cx, cy] = P(0.08, HT, 0.52), s = sk(0.52);
  const w = 0.028 * s, h = 0.1 * s;
  let k = schatten(cx, cy, w * 0.8, 1, 0.3);
  k += `<rect x="${r(cx - w / 2)}" y="${r(cy - h * 0.72)}" width="${r(w)}" height="${r(h * 0.72)}" rx="1" fill="${S.lg("kleber", [[0, "#f2f2ee"], [0.4, "#ffffff"], [1, "#cfcfc8"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(cx - w / 2)}" y="${r(cy - h * 0.55)}" width="${r(w)}" height="${r(h * 0.3)}" fill="#e0453a"/><text x="${cx}" y="${r(cy - h * 0.36)}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">KLEBE</text>`;
  k += `<rect x="${r(cx - w / 2 - 0.3)}" y="${r(cy - h)}" width="${r(w + 0.6)}" height="${r(h * 0.3)}" rx="1.2" fill="#e0453a"/><ellipse cx="${cx}" cy="${r(cy - h)}" rx="${r(w / 2 + 0.3)}" ry="${r(w * 0.2)}" fill="#f05a4a"/>`;
  k += `<rect x="${r(cx - w / 2 + 0.6)}" y="${r(cy - h * 0.9)}" width=".7" height="${r(h * 0.85)}" fill="#fff" opacity=".45"/>`;
  S.teil({ oben: true, id: "klebstoff", de: "der Klebstoff", syl: "KLEB-stoff", it: "la colla", itSyl: "COL-la", en: "glue", x: cx, y: cy, kunst: um(cx, cy, k),
    tipp: "Dieser Klebstoff ist ein Klebestift: Er klebt Papier und macht keine Flecken." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/schulsachen.js"));
console.log(aus);
