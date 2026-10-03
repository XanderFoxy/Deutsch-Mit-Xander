#!/usr/bin/env node
/* =====================================================================
   HANNOVER (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (aus Fachwissen, die Websuche war in dieser Sitzung
   aufgebraucht — Unsicheres ist mit „(unsicher)“ markiert):
   - MOTIV: Das Neue Rathaus über dem Maschteich ist das Postkartenbild
     Hannovers (stärker als die Herrenhäuser Gärten, die 5 km entfernt
     liegen). STANDORT: das Südufer des Maschteichs im Maschpark, Blick
     genau nach NORDEN auf die Gartenseite (Südfront) des Rathauses, die
     sich im Wasser spiegelt. Links (Westen) und rechts (Osten) die alten
     Bäume des Maschparks; der Maschsee liegt hinter uns (Süden).
   - NEUES RATHAUS (1901–1913, Hermann Eggert, ab 1909 Gustav Halmhuber;
     am 20. Juni 1913 von Kaiser Wilhelm II. eingeweiht): ein „Rathaus-
     schloss“ des Historismus aus hellem Sandstein mit grünen Kupfer-
     dächern, gegründet auf 6026 Buchenholzpfählen. Die Südseite ist
     symmetrisch: Eckpavillons mit hohen Walmdächern und Dachreitern,
     lange Flügel mit drei Fenstergeschossen, in der Mitte ein vortretender
     Mittelbau mit Bogenhalle, Balkon und Ziergiebel (Einzelheiten der
     Fassade, die Terrasse und die Treppe zum Wasser aus dem Gedächtnis,
     unsicher). Länge rund 120 m (unsicher ±10 %).
   - KUPPEL: 97,73 m hoch, über der Mittelhalle (etwa 45 m hinter der
     Südfront): hoher Tambour mit Bogenfenstern, vier Ecktürmchen, die
     steile grüne Kupferkuppel mit Rippen und runden Dachfenstern, oben die
     Laterne mit der AUSSICHTSPLATTFORM und der Spitze. Im Inneren fährt
     der BOGENAUFZUG (weltweit einzigartig) schräg, bis 17° geneigt, der
     Kuppelwölbung nach oben — von außen nicht zu sehen (steht im Tipp).
   - MASCHTEICH und MASCHPARK: der Teich liegt südlich vor dem Rathaus,
     ringsum alte Buchen, Linden und Kastanien; Enten und Schwäne.
   - TYPISCHES: der LEIBNIZ-BUTTERKEKS (Bahlsen, Hannover, seit 1891,
     52 Zähne), die LÜTTJE LAGE (ein Glas dunkles Bier und ein Korn,
     gleichzeitig aus einer Hand getrunken — gehört zum Schützenfest, dem
     größten der Welt), eine POSTKARTE mit den NANAS von Niki de Saint
     Phalle am Leibnizufer (1974; die Figuren selbst stehen an der Leine,
     von hier nicht zu sehen). Messe und Üstra-Stadtbahn stehen in Tipps.
   Licht: Anfang Oktober, Nachmittag, die Sonne steht im Südwesten (links
   hinter uns): die Südfront hell, rechte Kanten im Schatten, das Laub gelb
   und orange.
   Maßstab: Kamera 1,6 m über dem Weg (Weg 0,8 m über dem Wasser), Blick
   nach Norden, Brennweite 280, Horizont y = 150. Südfront 150 m entfernt
   (1,87 Einheiten je Meter), Kuppel 195 m (1,44 je Meter), vorn in 6 m
   47 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const BR = 320, HO = 240;
const S = neueSzene({ id: "hannover", titel: "Hannover", emoji: "🌳", thema: "Deutschland", kuerzel: "han", fassung: 854, breite: BR, hoehe: HO });
const rnd = zufall(1913);
const r = B.r;
const t2 = (n) => (+n).toFixed(2);
{ const lg = S.lg, rg = S.rg, da = {};
  S.lg = (n, ...a) => da["l" + n] || (da["l" + n] = lg(n, ...a));
  S.rg = (n, ...a) => da["r" + n] || (da["r" + n] = rg(n, ...a)); }

/* ---------- Kamera (Meter: x Ost, y Nord, z Höhe über dem Weg) ---------- */
const CY = -150, AUGE = 1.6, HOR = 150, FOK = 280, WASSER = -0.8;
const tief = (y) => y - CY;
const pr = (x, y, z) => [160 + FOK * x / tief(y), HOR - FOK * (z - AUGE) / tief(y)];
const mass = (y) => FOK / tief(y);
const P = (p) => `${r(p[0])} ${r(p[1])}`;
const poly = (pts) => "M" + pts.map((p) => P(pr(p[0], p[1], p[2]))).join(" L") + " Z";
const pfad = (d, f, extra = "") => d ? `<path d="${d}" fill="${f}"${extra}/>` : "";
/* senkrechte Ebene y = Y (Fassade): Punkte (x, z) */
const fe = (Y, pts) => "M" + pts.map(([x, z]) => P(pr(x, Y, z))).join(" L") + " Z";
const fr = (Y, x0, z0, x1, z1) => fe(Y, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]);
const bogen = (xm, w, z0, zK, n = 8) => { const p = [[xm - w / 2, z0]]; for (let i = 0; i <= n; i++) { const a = Math.PI * (1 - i / n); p.push([xm + Math.cos(a) * w / 2, zK + Math.sin(a) * w / 2]); } p.push([xm + w / 2, z0]); return p; };
/* Spiegelachse für die Front (150 m): y + y' = 2 · (HOR + FOK · (AUGE − WASSER) / 150) */
const SPIEGEL = 2 * (HOR + FOK * (AUGE - WASSER) / 150);

S.def(`<filter id="bw_weich" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" color-interpolation-filters="sRGB" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" color-interpolation-filters="sRGB" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation=".7 .35"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" color-interpolation-filters="sRGB" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);

const STEIN = S.lg("stein", [[0, "#f2ead8"], [1, "#ddd2bb"]]);           // heller Sandstein in der Sonne
const STEIN_D = S.lg("steind", [[0, "#c2b69c"], [1, "#ab9f86"]]);         // Schattenseiten
const KUPFER = S.lg("kupfer", [[0, "#5e9c86"], [0.5, "#74ae97"], [1, "#5a917c"]], 0, 0, 1, 0);
const KUPFER_D = S.lg("kupferd", [[0, "#4a7f6d"], [1, "#3f6e5e"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#a7bccd"], [0.45, "#4a5a68"], [1, "#2e3842"]]);
const GOLD = S.lg("gold", [[0, "#fff2b0"], [0.45, "#e2b850"], [1, "#9a7322"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Wolken, Stadt hinter dem Park
   ===================================================================== */
S.hinten(`<rect width="${BR}" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#4a80c0"], [0.55, "#8db6dc"], [0.9, "#d3e2ec"], [1, "#e9ede8"]])}"/>`);
S.hinten(`<rect width="${BR}" height="${HOR + 6}" fill="${S.lg("sonnenseite", [[0, "#fff1cc", 0.3], [0.4, "#fff1cc", 0], [1, "#fff1cc", 0]], 0, 0, 1, 0)}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 22, 1], [262, 14, 0.9], [118, 60, 0.6], [292, 70, 0.7], [20, 96, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4.4], [-11, 1.5, 10, 3.2], [11, 1, 12, 3.6], [-3, -3.2, 9, 4.2], [5, -2.6, 7, 3.6]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(17 * s)}" ry="${r(2 * s)}" fill="#dfe6ee"/></g>`;
  }
  S.hinten(w);
}

/* ---------- Baumkronen als Wolken aus Laub (Herbstfarben) ---------- */
const LAUB = [["#c98a2e", "#e0b04a", "#a8662a"], ["#8a9a3a", "#b7b04a", "#6f7f30"], ["#b8542a", "#d8823a", "#8e3c22"], ["#6f8a3a", "#9aae4e", "#56702c"]];
const krone = (cx, cy, R, fam, n = 16) => {
  const F = LAUB[fam];
  let g = `<ellipse cx="${r(cx)}" cy="${r(cy + R * .1)}" rx="${r(R * 1.02)}" ry="${r(R * .92)}" fill="${F[2]}"/>`;
  for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * R * .78, rr = R * (.22 + rnd() * .2); g += `<circle cx="${r(cx + Math.cos(a) * d)}" cy="${r(cy + Math.sin(a) * d * .9)}" r="${r(rr)}" fill="${F[Math.floor(rnd() * 2)]}"/>`; }
  g += `<ellipse cx="${r(cx - R * .3)}" cy="${r(cy - R * .35)}" rx="${r(R * .45)}" ry="${r(R * .3)}" fill="#fff4c8" opacity=".22"/>`;
  return g;
};

/* =====================================================================
   1 — DER MASCHPARK (ferne Bäume links und rechts, Rasen am Nordufer)
   ===================================================================== */
{
  let k = "";
  /* ferne Stadt hinter dem Park (dunstig) */
  for (const [x0, x1, h] of [[-80, -66, 18], [66, 80, 20]]) k += `<g opacity=".55" filter="url(#${S.id("dunst")})">${pfad(fr(40, x0, 0, x1, h), "#c9c7c0")}${pfad(fe(40, [[x0, h], [x1, h], [x1 - 3, h + 3], [x0 + 3, h + 3]]), "#9aa3a0")}</g>`;
  /* Rasen und Weg am Nordufer vor dem Rathaus */
  k += `<rect x="0" y="${r(pr(0, -2, 0)[1])}" width="${BR}" height="${r(pr(0, -24, 0)[1] - pr(0, -2, 0)[1])}" fill="${S.lg("rasenfern", [[0, "#7f9a50"], [1, "#94a85e"]])}"/>`;
  /* Baumgruppen links (Westen) und rechts (Osten) des Rathauses, Stämme am Boden */
  const gruppe = (x, y, h, fam, n) => { const p = pr(x, y, 0), m = mass(y); let g = `<rect x="${r(p[0] - .35 * m)}" y="${r(p[1] - h * .45 * m)}" width="${r(.7 * m)}" height="${r(h * .45 * m)}" fill="#4a3a2c"/>`; g += krone(p[0], p[1] - h * .66 * m, h * .38 * m, fam, n); return g; };
  for (const [x, y, h, f] of [[-71, -8, 22, 1], [-65, -14, 20, 0], [-60, -19, 16, 3], [71, -10, 22, 0], [65, -15, 20, 2], [60, -19, 16, 1]]) k += gruppe(x, y, h, f, 18);
  S.teil({ id: "maschpark", de: "der Maschpark", syl: "MASCH-park", it: "il parco Masch", itSyl: "PAR-co MASCH", en: "Maschpark", x: 0, y: 0, kunst: k,
    tipp: "Der Maschpark ist der älteste Bürgerpark Hannovers. Hannover ist eine der grünsten Großstädte Deutschlands." });
}

/* =====================================================================
   2 — DIE KUPPEL (97,73 m) — Lupe: Aussichtsplattform, Turmspitze,
       Ecktürmchen
   ===================================================================== */
const KU = { y: 45, top: 97.7 };
const kuTeile = {};
{
  let k = "";
  const Y = KU.y - 14;     // Vorderseite des Tambours
  const X = (x) => pr(x, Y, 0)[0], Z = (z) => pr(0, Y, z)[1], m = mass(Y);
  /* vier Ecktürmchen auf dem Unterbau (zwei vorn sichtbar) */
  const tuerm = (xm) => {
    let g = pfad(fr(Y - 4, xm - 2.2, 30, xm + 2.2, 50), STEIN) + pfad(fr(Y - 4, xm + 1.2, 30, xm + 2.2, 50), STEIN_D);
    for (const z of [36, 43]) g += pfad(fe(Y - 4, bogen(xm, 1.4, z, z + 3.6, 6)), "#3b4048");
    g += pfad(fe(Y - 4, [[xm - 2.6, 50], [xm + 2.6, 50], [xm + 2.6, 51], [xm - 2.6, 51]]), "#cfc4ac");
    const c = pr(xm, Y - 4, 51); g += `<path d="M${r(c[0] - 2.4 * mass(Y - 4))} ${r(c[1])} Q${r(c[0] - 2.2 * mass(Y - 4))} ${r(c[1] - 3.4 * mass(Y - 4))} ${r(c[0])} ${r(c[1] - 4.6 * mass(Y - 4))} Q${r(c[0] + 2.2 * mass(Y - 4))} ${r(c[1] - 3.4 * mass(Y - 4))} ${r(c[0] + 2.4 * mass(Y - 4))} ${r(c[1])} Z" fill="${KUPFER}"/>`;
    g += `<path d="M${r(c[0])} ${r(c[1] - 4.6 * mass(Y - 4))} V${r(c[1] - 6.6 * mass(Y - 4))}" stroke="#3f6e5e" stroke-width=".4"/>`;
    return g;
  };
  k += tuerm(-17) + tuerm(17);
  /* Tambour: Säulenpaare und hohe Bogenfenster */
  k += pfad(fr(Y, -14, 30, 14, 56), S.lg("tambour", [[0, "#efe6d2"], [0.6, "#e2d7bf"], [1, "#b9ad93"]], 0, 0, 1, 0));
  for (const xm of [-9.6, -3.2, 3.2, 9.6]) {
    const w = 2.8 * (1 - Math.abs(xm) / 30);
    k += pfad(fe(Y, bogen(xm, w + .8, 39.6, 46.6, 6)), "#d9cdb2") + pfad(fe(Y, bogen(xm, w, 40, 46.6, 6)), GLAS);
  }
  for (const xm of [-12.8, -6.4, 0, 6.4, 12.8]) k += pfad(fr(Y, xm - .5, 38, xm + .5, 51), xm > 6 ? "#c7bba2" : "#f6efdf");
  k += pfad(fr(Y, -14.4, 51, 14.4, 53), "#e2d7bf") + pfad(fr(Y, -14.4, 53, 14.4, 53.6), "#b9ad93");
  /* Balustrade auf dem Tambour */
  k += pfad(fr(Y, -13.6, 53.6, 13.6, 55.6), "#ece3cf");
  { let d = ""; for (let x = -13; x <= 13; x += .9) d += `M${P(pr(x, Y, 53.8))} L${P(pr(x, Y, 55.2))} `; k += `<path d="${d}" stroke="#b9ad93" stroke-width=".3"/>`; }
  /* die Kuppel: steile Kupferschale mit Rippen und zwei Reihen runder Dachfenster */
  const prof = [[13.2, 56], [13.3, 60], [12.8, 65], [11.6, 70], [9.6, 75], [7, 79.6], [4.4, 83], [2.6, 85]];
  const kd = "M" + prof.map(([x, z]) => P(pr(-x, Y + 2, z))).join(" L") + " L" + prof.slice().reverse().map(([x, z]) => P(pr(x, Y + 2, z))).join(" L") + " Z";
  k += pfad(kd, S.lg("kuppel", [[0, "#7fbca4"], [0.45, "#6aa690"], [0.8, "#4f8a75"], [1, "#3e6f5f"]], 0, 0, 1, 0));
  /* Rippen: Bögen, die sich zur Mitte nach oben ziehen */
  for (const f of [-0.82, -0.55, -0.27, 0, 0.27, 0.55, 0.82]) {
    const pts = prof.map(([x, z]) => P(pr(x * f, Y + 2, z)));
    k += `<path d="M${pts.join(" L")}" stroke="${f > 0.5 ? "#3d6b5c" : "#a6d6c2"}" stroke-width="${Math.abs(f) > .7 ? .45 : .6}" fill="none"/>`;
  }
  for (const [z, n, xr] of [[62, 5, 12.4], [72, 3, 9]]) for (let i = 0; i < n; i++) {
    const f = (i - (n - 1) / 2) / ((n - 1) / 2) * .62, c = pr(f * xr, Y + 2, z), rr = (1 - Math.abs(f) * .5) * .9 * m;
    k += `<ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(rr * 1.1)}" ry="${r(rr * 1.4)}" fill="#e2d7bf"/><ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(rr * .7)}" ry="${r(rr)}" fill="#2e3842"/>`;
  }
  k += `<path d="M${P(pr(-12.6, Y + 2, 64))} Q${P(pr(-11, Y + 2, 74))} ${P(pr(-6, Y + 2, 80))}" stroke="#d6f0e2" stroke-width=".9" fill="none" opacity=".55"/>`;
  /* Laterne mit der Aussichtsplattform (Galerie mit Geländer), darüber Haube und Spitze */
  const L0 = 85;
  k += pfad(fr(Y + 2, -3.4, L0, 3.4, L0 + .8), "#d9cdb2");
  k += pfad(fr(Y + 2, -2.4, L0 + .8, 2.4, L0 + 5), "#ece3cf") + pfad(fr(Y + 2, 1.2, L0 + .8, 2.4, L0 + 5), "#c7bba2");
  for (const x of [-1.5, 0, 1.5]) k += pfad(fr(Y + 2, x - .4, L0 + 1.4, x + .4, L0 + 4.2), "#3b4048");
  { let d = ""; for (let x = -3.2; x <= 3.21; x += .55) d += `M${P(pr(x, Y + 2, L0 + .8))} L${P(pr(x, Y + 2, L0 + 1.9))} `; k += `<path d="${d} M${P(pr(-3.3, Y + 2, L0 + 1.9))} L${P(pr(3.3, Y + 2, L0 + 1.9))}" stroke="#2f3a36" stroke-width=".22"/>`; }
  /* Menschen auf der Plattform (Punkte) */
  for (const [x, c] of [[-2.8, "#c0392b"], [2.7, "#2f5f95"]]) { const p = pr(x, Y + 2, L0 + .8); k += `<rect x="${r(p[0] - .25)}" y="${r(p[1] - 1.9)}" width=".5" height="1.4" fill="${c}"/><circle cx="${r(p[0])}" cy="${r(p[1] - 2.1)}" r=".28" fill="#e2b48e"/>`; }
  const hb = pr(0, Y + 2, L0 + 5), hm = mass(Y + 2);
  k += `<path d="M${r(hb[0] - 2.8 * hm)} ${r(hb[1])} Q${r(hb[0] - 2.4 * hm)} ${r(hb[1] - 2.6 * hm)} ${r(hb[0])} ${r(hb[1] - 3.4 * hm)} Q${r(hb[0] + 2.4 * hm)} ${r(hb[1] - 2.6 * hm)} ${r(hb[0] + 2.8 * hm)} ${r(hb[1])} Z" fill="${KUPFER}"/>`;
  const sp = pr(0, Y + 2, KU.top);
  k += `<path d="M${r(hb[0] - .5 * hm)} ${r(hb[1] - 3.2 * hm)} L${r(sp[0])} ${r(sp[1])} L${r(hb[0] + .5 * hm)} ${r(hb[1] - 3.2 * hm)} Z" fill="#3f6e5e"/><circle cx="${r(hb[0])}" cy="${r(hb[1] - 4.4 * hm)}" r="${r(.7 * hm)}" fill="${GOLD}"/>`;
  kuTeile.platt = pr(0, Y + 2, L0 + 1.5); kuTeile.spitze = pr(0, Y + 2, 93); kuTeile.turm = pr(-17, Y - 4, 48);
  const zh = r(kuTeile.turm[1] - sp[1] + 14), zw = r(zh * 1.5), zx = sp[0];
  S.teil({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 0, y: 0, kunst: k,
    tipp: "Die Kuppel ist fast 100 Meter hoch. Innen fährt ein schräger Aufzug im Bogen nach oben — so einen gibt es nur hier.",
    zoom: { x: r(zx - zw / 2), y: r(sp[1] - 2), w: zw, h: zh },
    unter: [
      { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la terrazza panoramica", itSyl: "ter-RAZ-za pa-no-RA-mi-ca", en: "viewing platform", x: kuTeile.platt[0], y: kuTeile.platt[1], kunst: flaeche(-7, -6, 14, 8),
        tipp: "Von der Plattform oben auf der Kuppel sieht man bei klarem Wetter bis zum Harz." },
      { id: "turmspitze", de: "die Turmspitze", syl: "TURM-spit-ze", it: "la guglia", itSyl: "GU-glia", en: "spire", x: kuTeile.spitze[0], y: kuTeile.spitze[1], kunst: flaeche(-3, -8, 6, 9) },
      { id: "eckturm", de: "der Eckturm", syl: "ECK-turm", it: "la torretta", itSyl: "tor-RET-ta", en: "corner turret", x: kuTeile.turm[0], y: kuTeile.turm[1], kunst: flaeche(-4.4, -9, 8.8, 14),
        tipp: "Vier kleine Türme stehen an den Ecken um die große Kuppel." },
    ] });
}

/* =====================================================================
   3 — DAS NEUE RATHAUS (Südfront zum Maschteich) — Lupe: Portal,
       Balkon, Fenster, Pavillon
   ===================================================================== */
const rhTeile = {};
let FASSADE = "";      // die Front noch einmal für das Spiegelbild im Teich
{
  let dach = "", f = "";
  const Wy = 0, My = -4, Py = -3;           // Flügel, Mittelbau, Eckpavillons
  const fenster = (Y, xm, z0, z1, w = 1.5, rund = false) => {
    let g = pfad(fr(Y, xm - w / 2 - .25, z0 - .3, xm + w / 2 + .25, z1 + .25), "#e7dcc4");
    g += rund ? pfad(fe(Y, bogen(xm, w, z0, z1 - w / 2, 6)), GLAS) : pfad(fr(Y, xm - w / 2, z0, xm + w / 2, z1), GLAS);
    g += `<path d="M${P(pr(xm, Y, z0))} L${P(pr(xm, Y, z1 - (rund ? w / 2 : 0)))} M${P(pr(xm - w / 2, Y, z0 + (z1 - z0) * .62))} L${P(pr(xm + w / 2, Y, z0 + (z1 - z0) * .62))}" stroke="#e8dec8" stroke-width=".22"/>`;
    return g;
  };
  /* ---- Dächer (hinten) ---- */
  /* Flügel: Kupferdach mit Gauben */
  for (const sg of [-1, 1]) {
    const a = 16 * sg, b = 47 * sg;
    dach += pfad(poly([[a, Wy, 22], [b, Wy, 22], [b, 9, 31], [a, 9, 31]]), KUPFER);
    for (let x = 20; x < 45; x += 4.4) { const xm = x * sg; dach += pfad(fe(4, [[xm - .8, 25], [xm + .8, 25], [xm + .8, 26.6], [xm, 27.6], [xm - .8, 26.6]]), "#e2d7bf") + pfad(fr(4, xm - .45, 25.2, xm + .45, 26.4), "#2e3842"); }
  }
  /* Mittelbau: hohes Dach */
  dach += pfad(poly([[-16, My, 26], [16, My, 26], [12, 6, 34], [-12, 6, 34]]), KUPFER_D);
  /* Eckpavillons: hohe Walmdächer mit Dachreiter */
  for (const sg of [-1, 1]) {
    const a = 47 * sg, b = 59 * sg, m = 53 * sg;
    dach += pfad(poly([[a, Py, 25], [b, Py, 25], [m + 2 * sg, 6, 37], [m - 2 * sg, 6, 37]]), S.lg("pavdach", [[0, "#6aa690"], [1, "#4f8a75"]], 0, 0, 1, 0));
    const c = pr(m, 4, 37), mm = mass(4);
    dach += `<rect x="${r(c[0] - 1.2 * mm)}" y="${r(c[1] - 3.2 * mm)}" width="${r(2.4 * mm)}" height="${r(3.2 * mm)}" fill="#e2d7bf"/><rect x="${r(c[0] - .5 * mm)}" y="${r(c[1] - 2.6 * mm)}" width="${r(1 * mm)}" height="${r(1.8 * mm)}" fill="#2e3842"/>`;
    dach += `<path d="M${r(c[0] - 1.6 * mm)} ${r(c[1] - 3.2 * mm)} Q${r(c[0])} ${r(c[1] - 6.4 * mm)} ${r(c[0] + 1.6 * mm)} ${r(c[1] - 3.2 * mm)} Z" fill="${KUPFER}"/><path d="M${r(c[0])} ${r(c[1] - 5.6 * mm)} V${r(c[1] - 7.6 * mm)}" stroke="#3f6e5e" stroke-width=".35"/>`;
    for (const z of [28, 32]) dach += pfad(fe(Py + (z - 25) * .75, [[m - .8, z], [m + .8, z], [m + .8, z + 1.4], [m, z + 2.2], [m - .8, z + 1.4]]), "#e2d7bf");
  }
  /* ---- Flügel: drei Fenstergeschosse und Mezzanin ---- */
  for (const sg of [-1, 1]) {
    const a = 16 * sg, b = 47 * sg;
    f += pfad(fr(Wy, Math.min(a, b), 0, Math.max(a, b), 22), STEIN);
    f += pfad(fr(Wy, Math.min(a, b), 0, Math.max(a, b), 3.4), "#d5c9af");
    for (const z of [7.4, 13.2, 18.4]) f += pfad(fr(Wy, Math.min(a, b), z, Math.max(a, b), z + .5), "#d9cdb2");
    f += pfad(fr(Wy, Math.min(a, b) - .2, 21.4, Math.max(a, b) + .2, 22.4), "#e9e0cb");
    for (let i = 0; i < 7; i++) {
      const xm = (18.4 + i * 4.2) * sg;
      f += fenster(Wy, xm, 1, 3) + fenster(Wy, xm, 8.6, 12.4, 1.6, true) + fenster(Wy, xm, 14.2, 17.4) + fenster(Wy, xm, 19.2, 20.8, 1.2);
      f += pfad(fr(Wy, xm - 1.05, 12.7, xm + 1.05, 13.1), "#cdbf9f");
    }
    for (let i = 0; i < 8; i++) { const xm = (16.3 + i * 4.2) * sg; f += pfad(fr(Wy, xm - .3, 3.4, xm + .3, 21.4), "#e9e0cb"); }
  }
  /* ---- Eckpavillons ---- */
  for (const sg of [-1, 1]) {
    const a = 47 * sg, b = 59 * sg, x0 = Math.min(a, b), x1 = Math.max(a, b);
    /* Seitenwand zur Mitte hin (schmal sichtbar) */
    f += pfad(poly([[a, Py, 0], [a, Wy, 0], [a, Wy, 25], [a, Py, 25]]), sg < 0 ? STEIN_D : "#e8dfca");
    f += pfad(fr(Py, x0, 0, x1, 25), STEIN) + pfad(fr(Py, x0, 0, x1, 3.6), "#d5c9af");
    for (const z of [7.4, 13.2, 18.4]) f += pfad(fr(Py, x0, z, x1, z + .5), "#d9cdb2");
    f += pfad(fr(Py, x0 - .3, 24.2, x1 + .3, 25.4), "#e9e0cb");
    for (const xm of [49.6, 53, 56.4].map((x) => x * sg)) f += fenster(Py, xm, 1, 3.2) + fenster(Py, xm, 8.6, 12.4, 1.7, true) + fenster(Py, xm, 14.2, 17.4) + fenster(Py, xm, 19.4, 22.6, 1.3, true);
    for (const x of [x0 + .5, x1 - .5]) f += pfad(fr(Py, x - .55, 0, x + .55, 24.2), "#ebe3cf");
    /* Wappen der Stadt am Pavillon (Kleeblatt, unsicher) */
    const c = pr(53 * sg, Py, 23.2), mm = mass(Py);
    f += `<g transform="translate(${t2(c[0])} ${t2(c[1])}) scale(${(mm / 10).toFixed(4)})"><circle r="6" fill="#fff" stroke="#c9b48a" stroke-width=".6"/><circle cx="-1.8" cy="-.8" r="1.9" fill="#4f8a46"/><circle cx="1.8" cy="-.8" r="1.9" fill="#4f8a46"/><circle cx="0" cy="-2.9" r="1.9" fill="#4f8a46"/><path d="M0 0 L0 3.6" stroke="#4f8a46" stroke-width=".7"/></g>`;
  }
  /* ---- Mittelbau: Bogenhalle (Portal), Balkon, hohe Fenster, Ziergiebel ---- */
  {
    f += pfad(poly([[-16, My, 0], [-16, Wy, 0], [-16, Wy, 26], [-16, My, 26]]), "#e8dfca");
    f += pfad(fr(My, -16, 0, 16, 26), STEIN);
    for (const x of [-16, -8.2, 8.2, 16]) f += pfad(fr(My, x - .7, 0, x + .7, 25), S.lg("lisene", [[0, "#d9cdb2"], [0.5, "#f8f1e2"], [1, "#d1c4a8"]], 0, 0, 1, 0));
    /* Bogenhalle mit drei Bögen */
    for (const xm of [-4.6, 0, 4.6]) f += pfad(fe(My, bogen(xm, 3.4, 0, 4, 8)), S.lg("halle", [[0, "#3a3430"], [1, "#5a4e44"]]));
    f += pfad(fe(My, bogen(0, 1.6, 0, 1.8, 6)), "#2a201a");
    for (const xm of [-12, 12]) f += fenster(My, xm, 1, 4.4, 1.8, true);
    /* Balkon über der Halle */
    f += pfad(fr(My - .9, -7.6, 6.4, 7.6, 7), "#e2d7bf");
    { let d = ""; for (let x = -7.2; x <= 7.21; x += .55) d += `M${P(pr(x, My - .9, 7))} L${P(pr(x, My - .9, 8.1))} `; f += `<path d="${d}" stroke="#d2c6aa" stroke-width=".32"/>`; }
    f += pfad(fr(My - .9, -7.8, 8.1, 7.8, 8.5), "#e9e0cb");
    rhTeile.balkon = pr(0, My, 7.6);
    /* hohe Saalfenster im Hauptgeschoss, darüber kleinere */
    for (const xm of [-12, -4.6, 0, 4.6, 12]) f += fenster(My, xm, 9, 15, xm === 0 ? 2.2 : 1.8, true) + fenster(My, xm, 17, 20.6, 1.5);
    f += pfad(fr(My, -16.4, 25, 16.4, 26.2), "#e9e0cb");
    /* Ziergiebel mit Voluten, Figuren und Uhr (unsicher) */
    const G = [[-10, 26.2], [10, 26.2], [10, 28.6], [8.6, 28.6], [7.6, 30.8], [6, 30.8], [6, 33.4], [4.2, 33.4], [3.2, 35.4], [1.4, 35.4], [0, 37.4], [-1.4, 35.4], [-3.2, 35.4], [-4.2, 33.4], [-6, 33.4], [-6, 30.8], [-7.6, 30.8], [-8.6, 28.6], [-10, 28.6]];
    f += pfad(fe(My, G), STEIN);
    for (const [x, z] of [[-10, 28.6], [10, 28.6], [-6, 33.4], [6, 33.4], [-1.4, 35.4], [1.4, 35.4]]) f += pfad(fe(My, [[x - .3, z], [x + .3, z], [x, z + 2]]), "#cfc4ac");
    f += pfad(fe(My, [[-.25, 37.4], [.25, 37.4], [0, 39.4]]), "#cfc4ac");
    const u = pr(0, My, 31.4), um = mass(My);
    f += `<circle cx="${r(u[0])}" cy="${r(u[1])}" r="${r(1.6 * um)}" fill="#cfc4ac"/><circle cx="${r(u[0])}" cy="${r(u[1])}" r="${r(1.3 * um)}" fill="#2f3a46"/><path d="M${r(u[0])} ${r(u[1])} l${r(.7 * um)} ${r(-.6 * um)} M${r(u[0])} ${r(u[1])} l0 ${r(1 * um)}" stroke="${"#e2b850"}" stroke-width=".35"/>`;
    for (const xm of [-7.2, 7.2]) f += fenster(My, xm, 27.2, 29.6, 1.3, true);
    rhTeile.portal = pr(0, My, 2.4); rhTeile.fenster = pr(4.6, My, 12);
  }
  /* ---- Terrasse mit Balustrade und Treppe zum Wasser (unsicher) ---- */
  {
    const TY = -14;
    f += pfad(poly([[-62, TY, 0], [62, TY, 0], [62, TY, 1.6], [-62, TY, 1.6]]), "#d5c9af");
    f += pfad(poly([[-62, TY, 1.6], [62, TY, 1.6], [62, TY + 10, 1.6], [-62, TY + 10, 1.6]]), "#cfc4ac");
    let d = ""; for (let x = -61.5; x <= 61.5; x += .9) { if (Math.abs(x) < 6) continue; d += `M${P(pr(x, TY, 1.6))} L${P(pr(x, TY, 2.5))} `; }
    f += `<path d="${d}" stroke="#e9e0cb" stroke-width=".35"/>`;
    for (const sg of [-1, 1]) f += pfad(fe(TY, [[6 * sg, 2.5], [62 * sg, 2.5], [62 * sg, 2.8], [6 * sg, 2.8]]), "#efe7d4");
    for (let i = 0; i < 4; i++) f += pfad(fr(TY - .5 - i * .5, -6, 1.6 - i * .4, 6, 1.2 - i * .4), i % 2 ? "#d5c9af" : "#e2d7bf");
    rhTeile.terrasse = pr(-30, TY, 2);
  }
  /* Licht: Sonne von links (Südwesten) */
  f += pfad(fr(Wy, -47, 0, 47, 22), S.lg("rhlicht", [[0, "#fff6dc", 0.12], [0.5, "#fff6dc", 0], [1, "#3b3020", 0.08]], 0, 0, 1, 0));
  FASSADE = f;
  const zx0 = pr(-17, 0, 0)[0], zw = pr(17, 0, 0)[0] - zx0 + 30, zh = zw * 2 / 3;
  S.teil({ id: "rathaus", de: "das Neue Rathaus", syl: "NEU-e RAT-haus", it: "il Nuovo Municipio", itSyl: "NUO-vo mu-ni-CI-pio", en: "New Town Hall", x: 0, y: 0, kunst: dach + f,
    tipp: "Das Neue Rathaus wurde 1913 eröffnet. Es steht auf 6026 Pfählen aus Buchenholz.",
    zoom: { x: r(zx0 - 15), y: r(pr(0, -4, 0)[1] - zh + 4), w: r(zw), h: r(zh) },
    unter: [
      { id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: rhTeile.portal[0], y: rhTeile.portal[1], kunst: flaeche(-10, -6, 20, 8),
        tipp: "Durch die Bogenhalle geht man vom Maschpark ins Rathaus." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: rhTeile.balkon[0], y: rhTeile.balkon[1], kunst: flaeche(-15, -3, 30, 4) },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: rhTeile.fenster[0], y: rhTeile.fenster[1], kunst: flaeche(-2.4, -7, 4.8, 11) },
    ] });
}

/* =====================================================================
   4 — DER MASCHTEICH (Wasser mit dem Spiegelbild des Rathauses)
   ===================================================================== */
const NAH = -138;           // Uferkante vorn (12 m vor uns)
{
  const fern = pr(0, -20, WASSER)[1], nah = pr(0, NAH, 0)[1];
  S.def(`<clipPath id="${S.id("teich")}"><rect x="0" y="${r(fern)}" width="${BR}" height="${r(nah - fern)}"/></clipPath>`);
  let k = `<rect x="0" y="${r(fern)}" width="${BR}" height="${r(nah - fern + .5)}" fill="${S.lg("wasser", [[0, "#8fa9ba"], [0.5, "#6f8d9e"], [1, "#4f6e7e"]])}"/>`;
  /* Spiegelbild: Front, Bäume, Himmel — weich, dunkler, von Wellen zerlegt */
  k += `<g clip-path="url(#${S.id("teich")})"><g opacity=".55" filter="url(#${S.id("spiegel")})"><g transform="translate(0 ${SPIEGEL.toFixed(3)}) scale(1 -1)">${FASSADE}</g></g></g>`;
  k += `<rect x="0" y="${r(fern)}" width="${BR}" height="${r(nah - fern)}" fill="${S.lg("wasserluft", [[0, "#9ab4c4", 0.15], [1, "#2c4452", 0.35]])}"/>`;
  for (let i = 0; i < 140; i++) {
    const y = fern + Math.pow(rnd(), 1.4) * (nah - fern), x = rnd() * BR, w = 1 + (y - fern) * .12 * (.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} h${r(w)}" stroke="${rnd() < .6 ? "#e6f0f2" : "#2c4452"}" stroke-width="${r(.15 + (y - fern) * .008)}" opacity="${r(.25 + rnd() * .35)}"/>`;
  }
  /* Kante am Nordufer */
  k += `<rect x="0" y="${r(fern - .6)}" width="${BR}" height=".8" fill="#c9bfa8"/>`;
  S.teil({ id: "maschteich", de: "der Maschteich", syl: "MASCH-teich", it: "lo stagno Masch", itSyl: "STA-gno MASCH", en: "Masch pond", x: 0, y: 0, kunst: k,
    tipp: "Im Maschteich spiegelt sich das Rathaus. Gleich dahinter liegt der große Maschsee." });
}

/* =====================================================================
   5 — DER SCHWAN und 6 — DIE ENTE auf dem Wasser
   ===================================================================== */
{
  const Y = -96, p = pr(-14, Y, WASSER), m = mass(Y) / 100;    // Zentimeter
  let g = `<ellipse cx="0" cy="2" rx="62" ry="6" fill="#2c4452" opacity=".35"/><path d="M-50 -4 Q-56 -26 -30 -30 Q10 -34 40 -20 Q56 -14 52 -2 Q20 6 -40 2 Z" fill="#fbfbf8"/>`;
  g += `<path d="M-30 -26 Q-6 -40 30 -24 Q4 -24 -20 -14 Z" fill="#e9e9e4"/><path d="M38 -18 Q46 -40 40 -62 Q36 -78 46 -84 Q56 -86 58 -78 L66 -72 L56 -74 Q50 -72 50 -62 Q54 -40 48 -16 Z" fill="#fbfbf8"/>`;
  g += `<path d="M58 -78 L68 -72 L58 -74 Z" fill="#e0752a"/><circle cx="52" cy="-79" r="1.6" fill="#1d1d1d"/>`;
  S.teil({ oben: true, id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: p[0], y: p[1], kunst: `<g transform="scale(${m.toFixed(4)})">${g}</g>` + flaeche(-2.4, -3, 5.4, 3.6, .5) });
}
{
  const ente = (x, Y, sp) => { const p = pr(x, Y, WASSER), m = mass(Y) / 100; return `<g transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${(sp * m).toFixed(4)} ${m.toFixed(4)})"><ellipse cx="0" cy="1" rx="24" ry="3" fill="#2c4452" opacity=".35"/><path d="M-20 -2 Q-22 -14 -6 -14 L10 -12 Q16 -22 24 -20 Q30 -18 28 -12 L34 -10 L27 -8 Q22 -6 20 -2 Q0 4 -20 -2 Z" fill="#7a6248"/><path d="M14 -14 Q18 -21 24 -20 Q29 -18 27 -11 Q22 -9 16 -10 Z" fill="#2f6b3a"/><path d="M14 -9 L20 -9" stroke="#fff" stroke-width="1.2"/><path d="M-8 -10 Q2 -13 10 -9" stroke="#3a5a8a" stroke-width="2.2"/><path d="M27 -12 L34 -10 L27 -9 Z" fill="#e8b82a"/><circle cx="23" cy="-16" r="1" fill="#111"/></g>`; };
  const a = pr(-6, -122, WASSER);
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 0, y: 0, kunst: ente(-6, -122, 1) + ente(-3.2, -118, -1) + flaeche(a[0] - 2.6, a[1] - 3.4, 13, 4.4, .5),
    tipp: "Im Herbst schwimmen viele Stockenten auf dem Maschteich. Das Männchen hat einen grünen Kopf." });
}

/* =====================================================================
   7 — DER WEG am Südufer (Kies) und 8 — DER RASEN davor
   ===================================================================== */
const WEGRAND = -140.6;      // Grenze Weg / Rasen (9,4 m vor uns)
{
  const kante = pr(0, NAH, 0)[1], rand = pr(0, WEGRAND, 0)[1];
  let k = `<rect x="0" y="${r(kante)}" width="${BR}" height="${r(rand - kante + .5)}" fill="${S.lg("weg", [[0, "#cdbd9c"], [1, "#bba684"]])}"/>`;
  k += `<rect x="0" y="${r(kante - .6)}" width="${BR}" height="1.2" fill="#e8e0cc"/><rect x="0" y="${r(kante + .6)}" width="${BR}" height=".5" fill="#8f8674" opacity=".5"/>`;
  for (let i = 0; i < 70; i++) k += `<circle cx="${r(rnd() * BR)}" cy="${r(kante + 1 + rnd() * (rand - kante - 1))}" r="${r(.15 + rnd() * .35)}" fill="${rnd() < .5 ? "#8f7c5e" : "#efe4cc"}" opacity=".7"/>`;
  S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Auf dem Weg um den Maschteich gehen die Leute spazieren und joggen." });
}
{
  const rand = pr(0, WEGRAND, 0)[1];
  S.def(`<pattern id="${S.id("gras")}" width="3" height="1.6" patternUnits="userSpaceOnUse"><rect width="3" height="1.6" fill="#6f8f3e"/>${Array.from({ length: 9 }, () => { const x = r(rnd() * 3), y = r(rnd() * 1.6); return `<path d="M${x} ${y} l${r(rnd() * .4 - .2)} -.7" stroke="${rnd() < .5 ? "#93b04e" : "#56742c"}" stroke-width=".25"/>`; }).join("")}</pattern>`);
  let k = `<rect x="0" y="${r(rand)}" width="${BR}" height="${r(HO - rand)}" fill="url(#${S.id("gras")})"/>`;
  k += `<rect x="0" y="${r(rand)}" width="${BR}" height="${r(HO - rand)}" fill="${S.lg("rasenlicht", [[0, "#000", 0.08], [1, "#fff2b0", 0.1]])}"/>`;
  k += `<path d="M0 ${r(rand)} H${BR}" stroke="#56742c" stroke-width=".8"/>`;
  S.teil({ id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k });
}
{
  /* DAS LAUB: Herbstblätter auf dem Weg */
  let k = "";
  for (let i = 0; i < 46; i++) {
    const x = 110 + rnd() * 210, y = 190 + rnd() * 48, s = .6 + (y - 186) * .05, rot = Math.round(rnd() * 360), f = ["#d9a53a", "#c7702c", "#e0b84a", "#b8542a", "#a8862e"][Math.floor(rnd() * 5)];
    k += `<path d="M${r(x)} ${r(y)} q${r(1.2 * s)} ${r(-1.2 * s)} ${r(2.4 * s)} 0 q${r(-1.2 * s)} ${r(1.2 * s)} ${r(-2.4 * s)} 0 Z" fill="${f}" transform="rotate(${rot} ${r(x + s)} ${r(y)})"/>`;
  }
  S.teil({ oben: true, id: "laub", de: "das Laub", syl: "LAUB", it: "le foglie", itSyl: "FO-glie", en: "fallen leaves", x: 0, y: 0, kunst: k + flaeche(240, 222, 60, 14),
    tipp: "Im Oktober färbt sich das Laub gelb, orange und rot." });
}

/* =====================================================================
   8 — DER KASTANIENBAUM (rechts vorn) und 9 — DIE KASTANIE am Boden
   ===================================================================== */
{
  const Y = -141, p = pr(4.6, Y, 0), m = mass(Y);
  let k = `<path d="M${r(p[0] - .45 * m)} ${r(p[1])} C${r(p[0] - .3 * m)} ${r(p[1] - 3 * m)} ${r(p[0] - .35 * m)} ${r(p[1] - 5 * m)} ${r(p[0] - .1 * m)} 4 L${r(p[0] + .5 * m)} 4 C${r(p[0] + .45 * m)} ${r(p[1] - 5 * m)} ${r(p[0] + .4 * m)} ${r(p[1] - 3 * m)} ${r(p[0] + .55 * m)} ${r(p[1])} Z" fill="${S.lg("stamm", [[0, "#6a5444"], [0.5, "#4a3a2e"], [1, "#2e241c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(p[0] - .1 * m)} ${r(p[1] - 1 * m)} V4 M${r(p[0] + .2 * m)} ${r(p[1] - 2 * m)} V40" stroke="#2a1f17" stroke-width=".5" opacity=".6"/>`;
  /* Äste und Krone oben rechts aus dem Bild: handförmige Kastanienblätter in Herbstfarben */
  k += `<path d="M${r(p[0])} 60 Q${r(p[0] - 30)} 40 ${r(p[0] - 52)} 30 M${r(p[0] + 4)} 40 Q${r(p[0] - 10)} 22 ${r(p[0] - 30)} 12" stroke="#3a2c22" stroke-width="2.4" fill="none"/>`;
  const blatt = (x, y, s, rot, f) => { let g = `<g transform="translate(${t2(x)} ${t2(y)}) rotate(${rot}) scale(${s.toFixed(3)})">`; for (const [a, l] of [[-70, 6], [-36, 8.5], [0, 10], [36, 8.5], [70, 6]]) g += `<path d="M0 0 C${r(-1.2)} ${r(-l * .3)} ${r(-2.4)} ${r(-l * .75)} 0 ${-l} C${r(2.4)} ${r(-l * .75)} ${r(1.2)} ${r(-l * .3)} 0 0 Z" fill="${f}" transform="rotate(${a})"/><path d="M0 0 L0 ${r(-l * .85)}" stroke="#7a5a2a" stroke-width=".2" transform="rotate(${a})"/>`; return g + `</g>`; };
  let kr = "";
  for (const [cx, cy, rx, ry, f] of [[p[0] - 22, 22, 42, 22, "#a8762e"], [p[0] - 50, 42, 22, 15, "#b8862e"], [p[0] - 2, 48, 16, 20, "#8e6a2a"], [p[0] - 26, 34, 26, 15, "#c08a32"]]) { kr += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${rx}" ry="${ry}" fill="${f}"/>`; for (let i = 0; i < 9; i++) kr += `<circle cx="${r(cx - rx * .8 + rnd() * rx * 1.6)}" cy="${r(cy - ry * .6 + rnd() * ry * 1.2)}" r="${r(ry * (.25 + rnd() * .2))}" fill="${["#c99a3a", "#9a7a2c", "#d8a840", "#7f6a2a"][Math.floor(rnd() * 4)]}"/>`; }
  for (let i = 0; i < 80; i++) { const x = p[0] - 70 + rnd() * 78, y = 6 + rnd() * 70; if ((x - p[0] + 20) ** 2 / 4000 + (y - 20) ** 2 / 2600 > 1) continue; kr += blatt(x, y, .55 + rnd() * .45, Math.round(rnd() * 360), ["#d9a53a", "#c98a2e", "#b8762e", "#9aa03a", "#e0b84a", "#c7702c"][Math.floor(rnd() * 6)]); }
  k += kr;
  S.teil({ id: "kastanienbaum", de: "der Kastanienbaum", syl: "kas-TA-ni-en-baum", it: "l'ippocastano", itSyl: "ip-po-ca-STA-no", en: "horse chestnut tree", x: 0, y: 0, kunst: k,
    tipp: "Kastanienbäume haben Blätter wie eine Hand mit fünf Fingern." });
  /* Kastanien am Boden: braun glänzend, eine noch in der stacheligen Schale */
  const kast = (x, Y2, s) => { const q = pr(x, Y2, 0), mm = mass(Y2) * s / 100; return `<g transform="translate(${t2(q[0])} ${t2(q[1])}) scale(${mm.toFixed(4)})"><ellipse cx="0" cy="-1" rx="2.6" ry="2.2" fill="${S.rg("kastanie", [[0, "#a65a2a"], [0.6, "#6e3414"], [1, "#4a220c"]], 0.35, 0.3, 0.8)}"/><ellipse cx="0" cy=".2" rx="1.8" ry=".7" fill="#d8c09a"/><ellipse cx="-.8" cy="-2" rx=".7" ry=".35" fill="#fff" opacity=".45"/></g>`; };
  const q0 = pr(1.8, -144.2, 0);
  let kk = kast(1.8, -144.2, 1) + kast(2.2, -143.8, 1) + kast(1.4, -143.5, 1);
  { const q = pr(2.5, -144.4, 0), mm = mass(-144.4) / 100; kk += `<g transform="translate(${t2(q[0])} ${t2(q[1])}) scale(${mm.toFixed(4)})"><circle cx="0" cy="-2.4" r="3" fill="#8a9a3a"/>`; for (let a = 0; a < 12; a++) { const w = a * Math.PI / 6; kk += `<path d="M${r(Math.cos(w) * 2.8)} ${r(-2.4 + Math.sin(w) * 2.8)} l${r(Math.cos(w) * 1.2)} ${r(Math.sin(w) * 1.2)}" stroke="#6f7f30" stroke-width=".3"/>`; } kk += `<ellipse cx=".8" cy="-2.6" rx="1.6" ry="1.4" fill="#7a3a16"/></g>`; }
  S.teil({ oben: true, id: "kastanie", de: "die Kastanie", syl: "kas-TA-ni-e", it: "la castagna d'India", itSyl: "ca-STA-gna DIN-dia", en: "conkers", x: 0, y: 0, kunst: kk + flaeche(q0[0] - 6, q0[1] - 5, 22, 7),
    tipp: "Im Herbst sammeln Kinder Kastanien und basteln daraus Tiere." });
}

/* =====================================================================
   10 — DIE BANK mit 11 — DER SPAZIERGÄNGERIN (von hinten, schaut zum Rathaus)
   ===================================================================== */
const BANK = { x: 1.9, y: -139.4 };
const kleineFigur = (svg) => {
  const farbe = {};
  svg = svg.replace(/<(linear|radial)Gradient id="([^"]+)"[^>]*>(.*?)<\/\1Gradient>/g, (q, a, id, inn) => { const st = [...inn.matchAll(/offset="([\d.]+)" stop-color="(#[0-9a-fA-F]+)"/g)]; let best = st[0]; for (const x of st) if (Math.abs(+x[1] - .45) < Math.abs(+best[1] - .45)) best = x; farbe[id] = best ? best[2] : "#888"; return ""; });
  svg = svg.replace(/url\(#([^)]+)\)/g, (q, id) => farbe[id] || q).replace(/<defs><\/defs>/g, "");
  return svg.replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 10) / 10))}"`);
};
{
  const m = mass(BANK.y), p = pr(BANK.x, BANK.y, 0);
  const f = B.mensch({ id: "han_spaz", geschlecht: "w", pose: "sitzen", blick: 184, frisur: "dutt", haarfarbe: "grau", haut: "hell", alter: "alt",
    kleidung: { oberteil: { stueck: "pullover", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "grau" }, jacke: { stueck: "mantel", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.64 * m);
  const sitz = f.z.sitz ? f.z.sitz.y * f.k : -.45 * m;
  S.def(`<clipPath id="${S.id("sitz")}"><rect x="-60" y="-200" width="120" height="${r(200 + sitz + 1)}"/></clipPath>`);
  S.teil({ id: "spaziergaengerin", de: "die Spaziergängerin", syl: "SPA-zier-gän-ge-rin", it: "la passeggiatrice", itSyl: "pas-seg-gia-TRI-ce", en: "walker", x: p[0] + .5 * m, y: p[1], kunst: `<g clip-path="url(#${S.id("sitz")})">${kleineFigur(f.svg)}</g>`,
    tipp: "Sie macht eine Pause und schaut über den Teich zum Rathaus." });
}
{
  const m = mass(BANK.y), p = pr(BANK.x, BANK.y, 0), W = 1.9 * m;
  const HOLZ = S.lg("bankholz", [[0, "#8a5a30"], [1, "#5e3a1c"]]);
  let k = schatten(0, .3, W / 2 + 2, 1.6, .3);
  for (const sg of [-1, 1]) k += `<path d="M${r(sg * (W / 2 - 4))} 0 L${r(sg * (W / 2 - 4))} ${r(-.45 * m)} L${r(sg * (W / 2 - 3))} ${r(-.92 * m)} L${r(sg * (W / 2 - 5))} ${r(-.92 * m)} L${r(sg * (W / 2 - 5))} ${r(-.45 * m)} L${r(sg * (W / 2 - 7))} 0 Z" fill="#2c2a28"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-.47 * m)}" width="${r(W)}" height="1.4" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + .4)}" y="${r(-.92 * m + i * 3.3)}" width="${r(W - .8)}" height="2.2" rx=".5" fill="${HOLZ}"/><rect x="${r(-W / 2 + .4)}" y="${r(-.92 * m + i * 3.3)}" width="${r(W - .8)}" height=".6" fill="#b0804c" opacity=".6"/>`;
  /* Schild an der Lehne */
  k += `<rect x="${r(W / 2 - 14)}" y="${r(-.92 * m + 7.2)}" width="7" height="1.6" rx=".3" fill="#c9b48a"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: p[0], y: p[1], steht: true, kunst: k });
}

/* =====================================================================
   12 — DIE DECKE auf dem Rasen (links vorn) — Lupe: Butterkeks,
        Lüttje Lage, Postkarte
   ===================================================================== */
{
  const Y0 = -144.95, Y1 = -143.5, X0 = -2.7, X1 = -.5;
  const a = pr(X0, Y0, 0), b = pr(X1, Y0, 0), c = pr(X1 + .1, Y1, 0), d = pr(X0 + .2, Y1, 0);
  let k = `<path d="M${P(a)} L${P(b)} L${P(c)} L${P(d)} Z" fill="#f4efe6"/>`;
  const L = (u, v) => [a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v + (c[0] - b[0] - d[0] + a[0]) * u * v, a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v + (c[1] - b[1] - d[1] + a[1]) * u * v];
  for (let i = 0; i < 10; i += 2) k += `<path d="M${P(L(i / 10, 0))} L${P(L((i + 1) / 10, 0))} L${P(L((i + 1) / 10, 1))} L${P(L(i / 10, 1))} Z" fill="#c8323a" opacity=".55"/>`;
  for (let j = 0; j < 6; j += 2) k += `<path d="M${P(L(0, j / 6))} L${P(L(1, j / 6))} L${P(L(1, (j + 1) / 6))} L${P(L(0, (j + 1) / 6))} Z" fill="#c8323a" opacity=".55"/>`;
  k += `<path d="M${P(a)} L${P(b)}" stroke="#9a2a2e" stroke-width=".8"/>`;
  const auf = (x, y) => pr(x, y, 0);
  /* DER BUTTERKEKS: Packung und Kekse mit 52 Zähnen und der Prägung */
  const K = auf(-2.25, -144.25), km = mass(-143.95) / 100;
  const keks = (cx, cy, rot) => {
    let z = "", L = 6.5, Bk = 5.4, n1 = 14, n2 = 12;
    const pts = [];
    for (let i = 0; i < n1; i++) pts.push([-L / 2 + (i + .5) * L / n1, -Bk / 2]);
    for (let i = 0; i < n2; i++) pts.push([L / 2, -Bk / 2 + (i + .5) * Bk / n2]);
    for (let i = n1 - 1; i >= 0; i--) pts.push([-L / 2 + (i + .5) * L / n1, Bk / 2]);
    for (let i = n2 - 1; i >= 0; i--) pts.push([-L / 2, -Bk / 2 + (i + .5) * Bk / n2]);
    z += `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(1 .45)"><rect x="${-L / 2}" y="${-Bk / 2}" width="${L}" height="${Bk}" fill="#e6b764"/>`;
    for (const [x, y] of pts) z += `<circle cx="${r(x * 100) / 100}" cy="${r(y * 100) / 100}" r=".26" fill="#e6b764"/>`;
    z += `<rect x="${-L / 2 + .35}" y="${-Bk / 2 + .35}" width="${L - .7}" height="${Bk - .7}" fill="#efc77a"/><text x="0" y=".5" font-size="1.3" text-anchor="middle" fill="#b8843a" font-family="Arial" font-weight="bold">LEIBNIZ</text>`;
    for (const [x, y] of [[-2.2, -1.6], [0, -1.6], [2.2, -1.6], [-2.2, 1.7], [0, 1.7], [2.2, 1.7]]) z += `<circle cx="${x}" cy="${y}" r=".18" fill="#b8843a"/>`;
    return z + `</g>`;
  };
  let kg = `<path d="M-9 0 L1 0 L1 -2 L-9 -2 Z" fill="#d5b03a"/><path d="M-9 -2 L1 -2 L3 -3.2 L-7 -3.2 Z" fill="#f2cc4a"/><path d="M1 0 L3 -1.2 L3 -3.2 L1 -2 Z" fill="#b8902a"/><text x="-4" y="-.6" font-size="1.2" text-anchor="middle" fill="#7a1f1a" font-family="Arial" font-weight="bold">BUTTERKEKS</text>`;
  kg += keks(6, -.6, -8) + keks(11, .4, 12);
  k += `<g transform="translate(${t2(K[0])} ${t2(K[1])}) scale(${(km * 1.6).toFixed(4)})">${kg}</g>`;
  /* DIE LÜTTJE LAGE: ein Glas dunkles Bier und ein Korn auf dem Holzbrettchen */
  const L0 = auf(-1.62, -143.95), lm = mass(-143.75) / 100;
  let lg = `<path d="M-5 0 L5 0 L5.6 -.8 L-4.4 -.8 Z" fill="#a8743f"/>`;
  lg += `<path d="M-3.6 -.6 L-1 -.6 L-.8 -8 L-3.8 -8 Z" fill="#e8eef0" opacity=".5"/><path d="M-3.5 -.8 L-1.1 -.8 L-.9 -6.6 L-3.7 -6.6 Z" fill="#3a1e0e"/><path d="M-3.7 -6.6 L-.9 -6.6 L-.85 -7.4 L-3.75 -7.4 Z" fill="#e8d8b8"/>`;
  lg += `<path d="M1 -.6 L3.2 -.6 L3.4 -4.6 L.8 -4.6 Z" fill="#eef4f6" opacity=".6"/><path d="M1.1 -.8 L3.1 -.8 L3.25 -3.6 L.95 -3.6 Z" fill="#f4f8f8" opacity=".8"/><path d="M-3.4 -7.6 L-3 -1" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
  k += `<g transform="translate(${t2(L0[0])} ${t2(L0[1])}) scale(${lm.toFixed(4)})">${lg}</g>`;
  /* DIE POSTKARTE mit den Nanas am Leineufer */
  const PK = auf(-2.0, -144.6), pm = mass(-144.15) / 100;
  let pg = `<g transform="rotate(-6) scale(1 .5)"><rect x="-7.4" y="-5" width="14.8" height="10" fill="#fff" stroke="#c9c6be" stroke-width=".2"/><rect x="-6.8" y="-4.4" width="13.6" height="8.8" fill="#9cc6e4"/><rect x="-6.8" y="1.6" width="13.6" height="2.8" fill="#7f9a50"/>`;
  for (const [x, f1, f2] of [[-4, "#e8443a", "#2f6fd0"], [0, "#f2c230", "#e8443a"], [4, "#2fa86a", "#f2c230"]]) pg += `<ellipse cx="${x}" cy="0" rx="1.6" ry="2.2" fill="${f1}"/><circle cx="${x}" cy="-2.8" r=".8" fill="#4a2a1a"/><path d="M${x - 1.4} -1.4 L${x - 2.4} -3 M${x + 1.4} -1.4 L${x + 2.6} -2.6" stroke="${f2}" stroke-width=".7"/><path d="M${x - .8} 1.8 L${x - 1.2} 3.4 M${x + .8} 1.8 L${x + 1.4} 3.4" stroke="${f2}" stroke-width=".7"/>`;
  pg += `<text x="0" y="-3.2" font-size="1.4" text-anchor="middle" fill="#fff" font-family="Georgia" font-weight="bold">Hannover</text></g>`;
  k += `<g transform="translate(${t2(PK[0])} ${t2(PK[1])}) scale(${pm.toFixed(4)})">${pg}</g>`;
  const zw = r(b[0] - a[0] + 30), zh = r(zw * 2 / 3);
  S.teil({ oben: true, id: "decke", de: "die Decke", syl: "DE-cke", it: "la coperta", itSyl: "co-PER-ta", en: "picnic blanket", x: 0, y: 0, kunst: k,
    tipp: "Bei schönem Wetter machen viele ein Picknick im Maschpark.",
    zoom: { x: r(Math.max(0, K[0] - 12)), y: HO - 38, w: 57, h: 38 },
    unter: [
      { id: "butterkeks", de: "der Butterkeks", syl: "BUT-ter-keks", it: "il biscotto al burro", itSyl: "bi-SCOT-to al BUR-ro", en: "butter biscuit", x: K[0] + 6 * km, y: K[1] - 1.5 * km, kunst: flaeche(-16 * km, -7 * km, 46 * km, 10 * km, .3),
        tipp: "Der Leibniz-Keks kommt aus Hannover und hat genau 52 Zähne." },
      { id: "luettje_lage", de: "die Lüttje Lage", syl: "LÜTT-je LA-ge", it: "la Lüttje Lage (birra e grappa)", itSyl: "LÜTT-je LA-ge", en: "Lüttje Lage (beer and schnapps)", x: L0[0], y: L0[1], kunst: flaeche(-5.5 * lm, -8.5 * lm, 11.5 * lm, 9.5 * lm, .3),
        tipp: "Bier und Korn trinkt man gleichzeitig aus zwei Gläsern in einer Hand — am besten beim Schützenfest, dem größten der Welt." },
      { id: "postkarte", de: "die Postkarte", syl: "POST-kar-te", it: "la cartolina", itSyl: "car-to-LI-na", en: "postcard", x: PK[0], y: PK[1], kunst: flaeche(-7.6 * pm, -3 * pm, 15.2 * pm, 6 * pm, .3),
        tipp: "Auf der Karte: die bunten Nanas von Niki de Saint Phalle. Sie stehen am Leineufer." },
    ] });
}

/* =====================================================================
   13 — DIE LATERNE am Weg (links): klassische Parkleuchte, 3,8 m
   ===================================================================== */
{
  const Y = -138.9, p = pr(-5.2, Y, 0), m = mass(Y) / 100;     // Zentimeter
  let g = `<ellipse cx="0" cy="2" rx="30" ry="6" fill="#1b140c" opacity=".3" filter="url(#bw_weich)"/>`;
  g += `<path d="M-14 0 L14 0 L10 -30 L6 -40 L-6 -40 L-10 -30 Z" fill="#26302c"/><rect x="-4.5" y="-300" width="9" height="262" fill="${S.lg("mast", [[0, "#1e2724"], [0.5, "#3c4a44"], [1, "#1e2724"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-120, -240]) g += `<rect x="-6.5" y="${y}" width="13" height="5" fill="#26302c"/>`;
  g += `<path d="M-9 -300 L9 -300 L5 -312 L-5 -312 Z" fill="#26302c"/>`;
  g += `<path d="M-14 -312 L14 -312 L20 -350 L-20 -350 Z" fill="${S.lg("leuchte", [[0, "#fffbe8"], [1, "#e9dcb4"]])}" stroke="#26302c" stroke-width="2"/><path d="M0 -312 V-350" stroke="#26302c" stroke-width="1.4"/>`;
  g += `<path d="M-26 -350 L26 -350 L0 -372 Z" fill="#26302c"/><circle cx="0" cy="-378" r="5" fill="#26302c"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: p[0], y: p[1], steht: true, kunst: `<g transform="scale(${m.toFixed(4)})">${g}</g>` });
}

/* Licht über allem: warme Nachmittagssonne von links, Vignette (fängt keinen Tipp ab) */
S.davor(`<rect width="${BR}" height="${HO}" fill="${S.rg("sonne", [[0, "#fff1c8", 0.2], [0.5, "#fff1c8", 0.05], [1, "#fff1c8", 0]], 0, 0.2, 0.9)}"/><rect width="${BR}" height="${HO}" fill="${S.rg("vignette", [[0, "#000", 0], [0.74, "#000", 0], [1, "#1a1008", 0.2]], 0.5, 0.5, 0.75)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/hannover.js"));
console.log(aus);
