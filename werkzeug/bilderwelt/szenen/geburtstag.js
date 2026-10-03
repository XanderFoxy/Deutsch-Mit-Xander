#!/usr/bin/env node
/* =====================================================================
   DER GEBURTSTAG (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Ratgeber Kindergeburtstag, Brauchtum „Geburtstagskranz /
   Lebenslicht“, Deko-Händler): So feiert eine Familie in Deutschland den
   Kindergeburtstag im Wohn-Esszimmer:
   - Am gedeckten ESSTISCH (Tischdecke, Pappteller, Becher, Servietten,
     Kuchengabeln) steht die GEBURTSTAGSTORTE mit so vielen KERZEN, wie
     das Kind alt wird (hier 7); das Kind pustet sie aus und wünscht sich
     etwas. Auf dem Tisch LUFTSCHLANGEN und KONFETTI, Muffins.
   - An der Wand eine WIMPELKETTE / BUCHSTABEN-GIRLANDE („ALLES GUTE!“),
     LUFTBALLONS mit Helium schweben an der Decke oder sind festgebunden.
   - Der GEBURTSTAGSTISCH (Gabentisch) mit den GESCHENKEN, der
     GLÜCKWUNSCHKARTE und dem hölzernen GEBURTSTAGSKRANZ mit Zahl und
     Lebenslicht — ein typisch deutscher Brauch.
   - Das GEBURTSTAGSKIND trägt einen PARTYHUT; Oma sitzt mit am Tisch, der
     Vater bringt Kakao auf dem Tablett.
   PERSPEKTIVE: Fluchtpunkt (160 | 92), Augenhöhe 1,3 m, Brennweite 270.
   Rückwand 6 m (45 Einheiten je Meter), Tisch 4,0–4,9 m (≈ 60 je Meter).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "geburtstag", titel: "Der Geburtstag", emoji: "🎂", thema: "Feste", kuerzel: "b16e", fassung: 852 });
const rnd = zufall(707);
const r = B.r;

const F = 270, CAM = 1.3, HZ = 92, VX = 160;
const P = (X, Y, Z) => [r(VX + F * X / Z), r(HZ + F * (CAM - Y) / Z)];
const s = (Z) => F / Z;
const boden = (Z) => HZ + F * CAM / Z;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`;
function quader(X0, X1, Y0, Y1, Z0, Z1, farben, ox = 0, oy = 0) {
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let g = "";
  if (Y1 < CAM && farben.oben) g += poly([q(X0, Y1, Z0), q(X1, Y1, Z0), q(X1, Y1, Z1), q(X0, Y1, Z1)], farben.oben);
  if (X1 < 0 && farben.seite) g += poly([q(X1, Y0, Z0), q(X1, Y0, Z1), q(X1, Y1, Z1), q(X1, Y1, Z0)], farben.seite);
  if (X0 > 0 && farben.seite) g += poly([q(X0, Y0, Z0), q(X0, Y0, Z1), q(X0, Y1, Z1), q(X0, Y1, Z0)], farben.seite);
  g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y1, Z0), q(X0, Y1, Z0)], farben.vorne);
  return g;
}

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#c79a68"], [1, "#a77c4c"]]);
const HOLZ_D = S.lg("holzd", [[0, "#8f6640"], [1, "#6f4c2c"]]);
const BUNT = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#ff6f91"];
const ZW = 6, HR = 2.6;
const TI = { X0: -1.0, X1: 1.0, Z0: 4.0, Z1: 4.9, Y: 0.75 };

/* =====================================================================
   KULISSE — Tapete, Fenster mit Vorhängen, Decke, Parkett
   ===================================================================== */
{
  const wy0 = P(0, HR, ZW)[1], wy1 = boden(ZW);
  let k = `<rect width="320" height="${r(wy0)}" fill="${S.lg("decke", [[0, "#ece7de"], [1, "#f6f2ea"]])}"/>`;
  k += `<rect y="${r(wy0)}" width="320" height="${r(wy1 - wy0)}" fill="${S.lg("tapete", [[0, "#f6ead6"], [1, "#efdcc0"]])}"/>`;
  /* feine Streifentapete */
  for (let x = 4; x < 320; x += 9) k += `<rect x="${x}" y="${r(wy0)}" width="2.2" height="${r(wy1 - wy0)}" fill="#e9d6b6" opacity=".55"/>`;
  k += `<rect y="${r(wy0)}" width="320" height="${r(wy1 - wy0)}" fill="${S.rg("wandlicht", [[0, "#fff6e0", 0.55], [1, "#fff6e0", 0]], 0.5, 0.35, 0.65)}"/>`;
  k += `<rect y="${r(wy0 - 1)}" width="320" height="2" fill="#fbf8f2"/>`;
  /* Fenster mit Vorhängen links */
  const [fx0, fy0] = P(-3.0, 2.3, ZW), [fx1, fy1] = P(-1.85, 0.9, ZW);
  k += `<rect x="${r(fx0 - 2)}" y="${r(fy0 - 2)}" width="${r(fx1 - fx0 + 4)}" height="${r(fy1 - fy0 + 4)}" fill="#fbfaf6"/>`;
  k += `<rect x="${r(fx0)}" y="${r(fy0)}" width="${r(fx1 - fx0)}" height="${r(fy1 - fy0)}" fill="${S.lg("himmel", [[0, "#9cc6e6"], [1, "#d8ecf6"]])}"/>`;
  k += `<ellipse cx="${r(fx0 + 30)}" cy="${r(fy1 - 6)}" rx="16" ry="9" fill="#7fb36a"/><ellipse cx="${r(fx0 + 12)}" cy="${r(fy1 - 4)}" rx="12" ry="7" fill="#6aa257"/>`;
  k += `<rect x="${r((fx0 + fx1) / 2 - 0.8)}" y="${r(fy0)}" width="1.6" height="${r(fy1 - fy0)}" fill="#fbfaf6"/><rect x="${r(fx0)}" y="${r(fy0 + (fy1 - fy0) * 0.35)}" width="${r(fx1 - fx0)}" height="1.4" fill="#fbfaf6"/>`;
  k += `<path d="M${r(fx0 + 4)} ${r(fy0)} l7 0 l-12 ${r(fy1 - fy0)} l-6 0 Z" fill="#fff" opacity=".18"/>`;
  k += `<rect x="${r(fx0 - 5)}" y="${r(fy1 + 2)}" width="${r(fx1 - fx0 + 10)}" height="2" fill="#e8e2d6"/>`;
  for (const [x, d] of [[fx0 - 6, 1], [fx1 + 6, -1]]) {
    k += `<path d="M${r(x - 6)} ${r(fy0 - 6)} L${r(x + 6)} ${r(fy0 - 6)} Q${r(x + 6 + d * 2)} ${r(fy1 - 10)} ${r(x + 5)} ${r(wy1 - 10)} L${r(x - 5)} ${r(wy1 - 10)} Q${r(x - 6 - d * 2)} ${r(fy1 - 10)} ${r(x - 6)} ${r(fy0 - 6)} Z" fill="${S.lg("vorhang", [[0, "#d98b6a"], [0.5, "#e8a383"], [1, "#c97858"]], 0, 0, 1, 0)}"/>`;
    for (let i = -1; i <= 1; i++) k += `<path d="M${r(x + i * 3)} ${r(fy0 - 5)} L${r(x + i * 3.6)} ${r(wy1 - 11)}" stroke="#b86a4c" stroke-width=".4" opacity=".6"/>`;
  }
  k += `<rect x="${r(fx0 - 14)}" y="${r(fy0 - 8)}" width="${r(fx1 - fx0 + 28)}" height="1.6" rx=".8" fill="#8a6a46"/>`;
  /* Bild an der Wand (Familienfoto) */
  { const [x0, y0] = P(-0.6, 2.05, ZW), [x1, y1] = P(0.1, 1.55, ZW);
    k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="#6b4a2b"/><rect x="${r(x0 + 1.6)}" y="${r(y0 + 1.6)}" width="${r(x1 - x0 - 3.2)}" height="${r(y1 - y0 - 3.2)}" fill="#f4efe4"/>`;
    k += `<rect x="${r(x0 + 3.4)}" y="${r(y0 + 3.4)}" width="${r(x1 - x0 - 6.8)}" height="${r(y1 - y0 - 6.8)}" fill="#a9c7d8"/><circle cx="${r(x0 + 11)}" cy="${r(y1 - 9)}" r="2.6" fill="#e1b48d"/><circle cx="${r(x0 + 18)}" cy="${r(y1 - 9.6)}" r="2.8" fill="#d6a57a"/><circle cx="${r(x0 + 24)}" cy="${r(y1 - 8.4)}" r="2" fill="#ecc19a"/>`; }
  /* Parkett (Fischgrät angedeutet) */
  k += `<rect y="${r(wy1)}" width="320" height="${r(200 - wy1)}" fill="${S.lg("parkett", [[0, "#b98b58"], [1, "#a77a49"]])}"/>`;
  for (let Z = ZW; Z > 3.2; Z -= 0.25) { const y = boden(Z); k += `<rect y="${r(y)}" width="320" height=".3" fill="#8f673b" opacity=".6"/>`; }
  for (let X = -6; X <= 6; X += 0.5) for (let Z = 3.25; Z < ZW; Z += 0.5) { const a = P(X, 0, Z), b = P(X + 0.25, 0, Z + 0.25); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8f673b" stroke-width=".3" opacity=".45"/>`; }
  k += `<rect y="${r(wy1 - 2.4)}" width="320" height="2.4" fill="#fbf8f2" stroke="#ddd3c2" stroke-width=".2"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE GIRLANDE (Wimpelkette „ALLES GUTE!“)
   ===================================================================== */
{
  const X0 = -1.6, X1 = 2.6, Ya = 2.4, Ysag = 0.28;
  const [ax, ay] = P(X0, Ya, ZW - 0.02), [bx, by] = P(X1, Ya, ZW - 0.02);
  const ox = (ax + bx) / 2, oy = ay;
  const kurve = (t) => [ax + (bx - ax) * t - ox, ay + (by - ay) * t + Math.sin(Math.PI * t) * Ysag * s(ZW) - oy];
  let k = `<path d="M${r(ax - ox)} ${r(ay - oy)} Q0 ${r(2 * Ysag * s(ZW))} ${r(bx - ox)} ${r(by - oy)}" stroke="#7a6a58" stroke-width=".5" fill="none"/>`;
  const txt = "ALLES GUTE!";
  for (let i = 0; i < txt.length; i++) {
    const t = (i + 0.5) / txt.length, [x, y] = kurve(t);
    const w = 7.4, h = 10;
    k += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y)} L${r(x)} ${r(y + h)} Z" fill="${BUNT[i % BUNT.length]}"/>`;
    k += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x)} ${r(y + h)} L${r(x - w / 2 + 1.2)} ${r(y)} Z" fill="#fff" opacity=".2"/>`;
    if (txt[i] !== " ") k += `<text x="${r(x)}" y="${r(y + 4.6)}" font-size="4.2" text-anchor="middle" fill="#fff" font-family="Arial Rounded MT Bold,Arial" font-weight="bold">${txt[i]}</text>`;
  }
  /* Nägel an den Enden */
  k += `<circle cx="${r(ax - ox)}" cy="${r(ay - oy)}" r=".7" fill="#555"/><circle cx="${r(bx - ox)}" cy="${r(by - oy)}" r=".7" fill="#555"/>`;
  S.teil({ id: "girlande", de: "die Girlande", syl: "Gir-LAN-de", it: "la ghirlanda", itSyl: "ghir-LAN-da", en: "garland", x: ox, y: oy, kunst: k,
    tipp: "Die Girlande mit den bunten Wimpeln hängt quer über der Wand." });
}

/* =====================================================================
   2 — DER GEBURTSTAGSTISCH (Kommode) mit 3 — GESCHENKEN, 4 — KRANZ, 5 — KARTE
   ===================================================================== */
const KO = { X0: 2.05, X1: 3.25, Z0: 5.55, Z1: ZW, Y: 0.85 };
{
  const ox = P((KO.X0 + KO.X1) / 2, 0, KO.Z0)[0], oy = boden(KO.Z0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.5, 30, 1.6, 0.3);
  k += quader(KO.X0, KO.X1, 0.1, KO.Y, KO.Z0, KO.Z1, { vorne: S.lg("kommode", [[0, "#f4f1ea"], [1, "#ddd8cd"]]), oben: "#faf8f3", seite: "#cfc9bc" }, ox, oy);
  for (const Y of [0.6, 0.35]) { const a = q(KO.X0 + 0.03, Y, KO.Z0), b = q(KO.X1 - 0.03, Y, KO.Z0); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height=".5" fill="#bdb6a8"/><rect x="${r((a[0] + b[0]) / 2 - 4)}" y="${r(a[1] + 4)}" width="8" height="1.2" rx=".6" fill="#b48a52"/>`; }
  for (const X of [KO.X0 + 0.06, KO.X1 - 0.06]) { const a = q(X, 0.1, KO.Z0), b = q(X, 0, KO.Z0); k += `<rect x="${r(a[0] - 0.8)}" y="${a[1]}" width="1.6" height="${r(b[1] - a[1])}" fill="#6f4c2c"/>`; }
  /* Tischläufer */
  k += poly([q(KO.X0 + 0.1, KO.Y + 0.002, KO.Z0 + 0.05), q(KO.X1 - 0.1, KO.Y + 0.002, KO.Z0 + 0.05), q(KO.X1 - 0.1, KO.Y + 0.002, KO.Z1 - 0.05), q(KO.X0 + 0.1, KO.Y + 0.002, KO.Z1 - 0.05)], "#e9c2c8");
  S.teil({ id: "geburtstagstisch", de: "der Geburtstagstisch", syl: "Ge-BURTS-tags-tisch", it: "il tavolo dei regali", itSyl: "TA-vo-lo dei re-GA-li", en: "birthday table", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Auf dem Geburtstagstisch liegen die Geschenke bereit." });
}
{
  /* DAS GESCHENK — drei verpackte Päckchen mit Schleifen */
  const ox = P(2.95, 0, 5.75)[0], oy = P(0, KO.Y, 5.75)[1];
  let k = schatten(0, 0.2, 14, 1.2, 0.25);
  const paket = (X0, X1, Y0, Y1, Z0, Z1, f1, f2, band) => {
    let g = quader(X0, X1, Y0, Y1, Z0, Z1, { vorne: f1, oben: f2, seite: f2 }, ox, oy);
    const [a, b] = P((X0 + X1) / 2, Y1, Z0), [, c] = P(0, Y0, Z0);
    g += `<rect x="${r(a - ox - 0.8)}" y="${r(b - oy)}" width="1.6" height="${r(c - b)}" fill="${band}"/>`;
    const [d, e] = P((X0 + X1) / 2, Y1, (Z0 + Z1) / 2);
    g += `<path d="M${r(d - ox)} ${r(e - oy)} q-4 -4 -5 -1 q1 2 5 1 q4 -4 5 -1 q-1 2 -5 1" fill="${band}" stroke="${band}" stroke-width=".6"/>`;
    return g;
  };
  k += paket(2.62, 3.12, KO.Y, KO.Y + 0.28, 5.62, 5.92, S.lg("pap1", [[0, "#3a7bd5"], [1, "#2b5fa8"]]), "#5594e6", "#f1c40f");
  k += paket(2.7, 3.02, KO.Y + 0.28, KO.Y + 0.46, 5.68, 5.88, S.lg("pap2", [[0, "#e74c3c"], [1, "#c0392b"]]), "#f06a5a", "#fff");
  k += paket(3.12, 3.24, KO.Y, KO.Y + 0.18, 5.6, 5.8, S.lg("pap3", [[0, "#2ecc71"], [1, "#25a35a"]]), "#4fe08c", "#e84393");
  for (let i = 0; i < 18; i++) { const [x, y] = P(2.66 + rnd() * 0.42, KO.Y + 0.03 + rnd() * 0.22, 5.61); k += `<circle cx="${r(x - ox)}" cy="${r(y - oy)}" r=".55" fill="#fff" opacity=".55"/>`; }
  S.teil({ id: "geschenk_gb", de: "das Geschenk", syl: "Ge-SCHENK", it: "il regalo", itSyl: "re-GA-lo", en: "present", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Die Geschenke sind in buntes Papier verpackt – mit Schleife." });
}
{
  /* DER GEBURTSTAGSKRANZ: Holzring mit Steckkerzen, Zahl 7 und Lebenslicht */
  const [x, y] = P(2.3, KO.Y, 5.78);
  let k = schatten(0, 0.2, 9, 1, 0.25);
  k += `<ellipse cx="0" cy="-1" rx="8.4" ry="2.6" fill="#c9a06a"/><ellipse cx="0" cy="-1.8" rx="8.4" ry="2.6" fill="#e2bd86"/><ellipse cx="0" cy="-1.8" rx="5.2" ry="1.5" fill="#c9a06a"/>`;
  for (let i = 0; i < 7; i++) { const a = Math.PI * (0.1 + i * 0.8 / 6); const cx = -Math.cos(a) * 6.8, cy = -1.8 - Math.sin(a) * 1.9; k += `<rect x="${r(cx - 0.5)}" y="${r(cy - 4.2)}" width="1" height="4" fill="${BUNT[i]}"/><ellipse cx="${r(cx)}" cy="${r(cy - 5)}" rx=".5" ry="1" fill="#ffcf4a"/>`; }
  k += `<rect x="-1.2" y="-9.6" width="2.4" height="7.6" fill="#fffaf0" stroke="#e2d4b8" stroke-width=".2"/><ellipse cx="0" cy="-10.6" rx=".7" ry="1.4" fill="#ffb02e"/><ellipse cx="0" cy="-10.3" rx=".35" ry=".7" fill="#fff6c8"/>`;
  k += `<text x="5.6" y="-3.2" font-size="5.6" text-anchor="middle" fill="#e74c3c" font-family="Georgia,serif" font-weight="bold">7</text>`;
  S.teil({ oben: true, id: "geburtstagskranz", de: "der Geburtstagskranz", syl: "Ge-BURTS-tags-kranz", it: "la corona di compleanno", itSyl: "co-RO-na di com-ple-AN-no", en: "birthday ring", x, y, kunst: k + flaeche(-9, -12.5, 18, 13),
    tipp: "Der Geburtstagskranz aus Holz ist ein deutscher Brauch: Die große Kerze ist das Lebenslicht." });
}
{
  /* DIE GLÜCKWUNSCHKARTE (aufgestellt) */
  const [x, y] = P(2.48, KO.Y, 5.66);
  let k = `<path d="M-3.6 0 L-3 -8.6 L1 -8 L.4 0 Z" fill="#fdf6e8" stroke="#d9c9a8" stroke-width=".25"/><path d="M.4 0 L1 -8 L4.6 -8.6 L4 0 Z" fill="#f6c2d0" stroke="#d9a3b3" stroke-width=".25"/>`;
  k += `<text x="2.6" y="-4.6" font-size="2.2" text-anchor="middle" fill="#c0392b" font-family="Georgia,serif" font-weight="bold">7</text><circle cx="2.6" cy="-2" r=".8" fill="#f1c40f"/>`;
  S.teil({ oben: true, id: "glueckwunschkarte", de: "die Glückwunschkarte", syl: "GLÜCK-wunsch-kar-te", it: "il biglietto d'auguri", itSyl: "bi-GLIET-to d'au-GU-ri", en: "greetings card", x, y, kunst: k + flaeche(-4, -9.4, 9, 9.6) });
}

/* =====================================================================
   6 — DER LUFTBALLON an der Decke (Helium), 7 — DER LUFTBALLON am Geburtstagstisch
   ===================================================================== */
const ballon = (farbe, name, len) => {
  const G = S.rg(name, [[0, "#ffffff", 0.55], [0.25, farbe], [1, farbe]], 0.35, 0.3, 0.75);
  let g = `<ellipse cx="0" cy="-9" rx="7" ry="8.4" fill="${G}"/><path d="M-1.2 -.4 L1.2 -.4 L0 -1.4 Z" fill="${farbe}"/><ellipse cx="-2.6" cy="-12.6" rx="1.6" ry="2.6" fill="#fff" opacity=".45" transform="rotate(-25 -2.6 -12.6)"/>`;
  g += `<path d="M0 -.4 q-2 ${r(len * 0.25)} .6 ${r(len * 0.5)} q2.4 ${r(len * 0.25)} -.4 ${r(len * 0.5)}" stroke="#7a7a7a" stroke-width=".35" fill="none"/>`;
  return g;
};
{
  const Z = 5.4, [x, yd] = P(-1.35, HR, Z);
  const k = ballon("#e74c3c", "bal1", 40);
  /* Ballon liegt oben an der Decke an: Oberkante = Decke */
  S.teil({ id: "luftballon", de: "der Luftballon", syl: "LUFT-bal-lon", it: "il palloncino", itSyl: "pal-lon-CI-no", en: "balloon", x, y: yd + 17.4, kunst: k,
    tipp: "Mit Helium gefüllte Luftballons steigen bis an die Decke." });
}
{
  const Z = 5.7, [x, y] = P(2.15, 1.95, Z), [, yk] = P(0, KO.Y, 5.7);
  let k = `<path d="M0 -.4 Q-2 ${r((yk - y) * 0.5)} -1 ${r(yk - y - 0.5)}" stroke="#7a7a7a" stroke-width=".35" fill="none"/>`;
  k += `<ellipse cx="0" cy="-9" rx="7" ry="8.4" fill="${S.rg("bal2", [[0, "#ffffff", 0.55], [0.25, "#3498db"], [1, "#2f86c6"]], 0.35, 0.3, 0.75)}"/><path d="M-1.2 -.4 L1.2 -.4 L0 -1.4 Z" fill="#2f86c6"/><ellipse cx="-2.6" cy="-12.6" rx="1.6" ry="2.6" fill="#fff" opacity=".45" transform="rotate(-25 -2.6 -12.6)"/>`;
  k += `<g transform="translate(9 3)"><ellipse cx="0" cy="-9" rx="6.4" ry="7.8" fill="${S.rg("bal3", [[0, "#ffffff", 0.55], [0.25, "#f1c40f"], [1, "#e0b20c"]], 0.35, 0.3, 0.75)}"/><path d="M-1.1 -.4 L1.1 -.4 L0 -1.3 Z" fill="#e0b20c"/><path d="M0 -.4 Q1 ${r((yk - y - 3) * 0.5)} -10 ${r(yk - y - 3.5)}" stroke="#7a7a7a" stroke-width=".35" fill="none"/></g>`;
  S.teil({ id: "luftballon2", de: "der Luftballon", syl: "LUFT-bal-lon", it: "il palloncino", itSyl: "pal-lon-CI-no", en: "balloon", x, y, kunst: k + flaeche(-8, -18, 25, 20),
    tipp: "Die Ballons sind am Geburtstagstisch festgebunden." });
}

/* =====================================================================
   8 — DER VATER (bringt Kakao auf dem Tablett), 9 — DAS GEBURTSTAGSKIND,
   10 — DER PARTYHUT
   ===================================================================== */
{
  const Z = 5.0, x = P(1.5, 0, Z)[0];
  const m = B.mensch({ id: "gb_vater", geschlecht: "m", pose: "servieren", blick: -35, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "oliv", laecheln: true, bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "tablett" } } }, 1.8 * s(Z));
  S.teil({ id: "vater_gb", de: "der Vater", syl: "VA-ter", it: "il papà", itSyl: "pa-PÀ", en: "father", x, y: boden(Z), kunst: m.svg,
    tipp: "Der Vater bringt Kakao für alle." });
}
const KIND = {};
{
  const Z = 5.35, x = P(-0.02, 0, Z)[0];
  const m = B.mensch({ id: "gb_kind", geschlecht: "w", alter: "kind", pose: "stehen", blick: 0, frisur: "zopf", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "rosa" }, schuhe: { stueck: "halbschuh", farbe: "rot" } } }, 1.24 * s(Z));
  S.teil({ id: "geburtstagskind", de: "das Geburtstagskind", syl: "Ge-BURTS-tags-kind", it: "il festeggiato", itSyl: "fe-steg-GIA-to", en: "birthday child", x, y: boden(Z), kunst: m.svg,
    tipp: "Das Geburtstagskind wird heute sieben Jahre alt. Alles Gute!" });
  KIND.x = x; KIND.y = boden(Z); KIND.m = m;
}
{
  const m = KIND.m, sp = m.z.punkte.scheitel;
  const x = KIND.x + sp[0] * m.k, y = KIND.y + sp[1] * m.k + 1.2;
  let k = `<path d="M-4.4 0 L0 -12 L4.4 0 Q0 1.6 -4.4 0 Z" fill="${S.lg("hut", [[0, "#9b59b6"], [1, "#7d3c98"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-2.6 + (i % 3) * 2.4 + (i > 2 ? 1 : 0))}" cy="${r(-2.4 - Math.floor(i / 3) * 3.6)}" r=".7" fill="${BUNT[i]}"/>`;
  k += `<circle cx="0" cy="-12.4" r="1.6" fill="#f1c40f"/><path d="M-4.4 0 Q0 1.6 4.4 0" stroke="#f1c40f" stroke-width=".8" fill="none"/>`;
  S.teil({ oben: true, id: "partyhut", de: "der Partyhut", syl: "PAR-ty-hut", it: "il cappellino da festa", itSyl: "cap-pel-LI-no da FE-sta", en: "party hat", x, y, kunst: k + flaeche(-4.8, -14, 9.6, 15) });
}

/* =====================================================================
   11 — DER STUHL (links, seitlich) und 12 — DIE OMA darauf
   ===================================================================== */
const OMA = { Z: 4.45, X: -1.42 };
let OMA_M;
{
  OMA_M = B.mensch({ id: "gb_oma", geschlecht: "w", alter: "alt", pose: "sitzen", blick: 78, frisur: "locken", haarfarbe: "weiss", haut: "hell", laecheln: true, brille: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#c9d6e8" }, jacke: { stueck: "weste", farbe: "#7a4b6e" }, unterteil: { stueck: "rock_knie", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.6 * s(OMA.Z));
  const sitzH = -OMA_M.z.sitz.y / 100 * 1.6 / (OMA_M.z.hoehe / 100);   /* Sitzhöhe in Metern */
  OMA.sitz = sitzH;
  const Z = OMA.Z, ox = P(OMA.X, 0, Z)[0], oy = boden(Z);
  const X0 = OMA.X - 0.24, X1 = OMA.X + 0.2, Za = Z - 0.21, Zb = Z + 0.21;
  let k = schatten(0, 0.4, 10, 1.4, 0.3);
  for (const [X, ZZ] of [[X0 + 0.03, Zb - 0.03], [X1 - 0.03, Zb - 0.03]]) k += quader(X - 0.02, X + 0.02, 0, sitzH, ZZ - 0.02, ZZ + 0.02, { vorne: HOLZ_D, seite: "#5a3c22" }, ox, oy);
  k += quader(X0, X0 + 0.04, sitzH, sitzH + 0.5, Za, Zb, { vorne: HOLZ, seite: HOLZ_D }, ox, oy);
  for (const Y of [sitzH + 0.22, sitzH + 0.4]) k += quader(X0 - 0.003, X0 + 0.043, Y, Y + 0.07, Za + 0.02, Zb - 0.02, { vorne: HOLZ_D, seite: "#7a5430" }, ox, oy);
  k += quader(X0, X1, sitzH - 0.04, sitzH, Za, Zb, { vorne: HOLZ_D, oben: S.lg("polster", [[0, "#2e7d6b"], [1, "#24675a"]]), seite: "#5a3c22" }, ox, oy);
  for (const [X, ZZ] of [[X0 + 0.03, Za + 0.03], [X1 - 0.03, Za + 0.03]]) k += quader(X - 0.02, X + 0.02, 0, sitzH - 0.04, ZZ - 0.02, ZZ + 0.02, { vorne: HOLZ_D, seite: "#5a3c22" }, ox, oy);
  /* Ballon-Schnur am Stuhl? nein — Stuhl bleibt frei sichtbar */
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ox, y: oy, steht: true, kunst: k });
}
{
  const Z = OMA.Z, x = P(OMA.X + 0.02, 0, Z)[0];
  S.teil({ id: "oma_gb", de: "die Oma", syl: "O-ma", it: "la nonna", itSyl: "NON-na", en: "grandmother", x, y: boden(Z), kunst: OMA_M.svg,
    tipp: "Die Oma ist zum Geburtstag gekommen. Sie singt: „Zum Geburtstag viel Glück!“" });
}

/* =====================================================================
   13 — DER TISCH (gedeckt) — Lupe: Teller, Becher, Gabel, Serviette,
        Muffin, Luftschlange
   ===================================================================== */
const tischUnter = [];
{
  const ox = P(0, 0, TI.Z0)[0], oy = boden(TI.Z0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.5, 72, 2.6, 0.3);
  /* Tischdecke (weiß mit Punkten), hängt vorn 25 cm herunter */
  const TD = S.lg("tischdecke", [[0, "#ffffff"], [1, "#eef0f2"]]);
  k += poly([q(TI.X0 - 0.05, TI.Y, TI.Z0 - 0.05), q(TI.X1 + 0.05, TI.Y, TI.Z0 - 0.05), q(TI.X1 + 0.05, TI.Y, TI.Z1 + 0.05), q(TI.X0 - 0.05, TI.Y, TI.Z1 + 0.05)], TD);
  /* Beine unter der Decke */
  for (const X of [TI.X0 + 0.06, TI.X1 - 0.06]) { const a = q(X, TI.Y - 0.27, TI.Z0 + 0.06), b = q(X, 0, TI.Z0 + 0.06); k += `<rect x="${r(a[0] - 1.4)}" y="${a[1]}" width="2.8" height="${r(b[1] - a[1])}" fill="${HOLZ_D}"/>`; }
  for (const X of [TI.X0 + 0.06, TI.X1 - 0.06]) { const a = q(X, TI.Y - 0.27, TI.Z1 - 0.06), b = q(X, 0, TI.Z1 - 0.06); k += `<rect x="${r(a[0] - 1.1)}" y="${a[1]}" width="2.2" height="${r(b[1] - a[1])}" fill="${HOLZ_D}"/>`; }
  { const a = q(TI.X0 - 0.05, TI.Y, TI.Z0 - 0.05), b = q(TI.X1 + 0.05, TI.Y - 0.27, TI.Z0 - 0.05);
    k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${a[1]} L${b[0]} ${b[1]} Q${r(b[0] * 0.5)} ${r(b[1] + 1.4)} 0 ${b[1]} Q${r(a[0] * 0.5)} ${r(b[1] + 1.4)} ${a[0]} ${b[1]} Z" fill="${S.lg("deckefront", [[0, "#f6f7f8"], [1, "#dfe3e6"]])}"/>`;
    for (let i = 0; i < 40; i++) k += `<circle cx="${r(a[0] + 2 + rnd() * (b[0] - a[0] - 4))}" cy="${r(a[1] + 2 + rnd() * (b[1] - a[1] - 3))}" r=".7" fill="${BUNT[i % BUNT.length]}" opacity=".75"/>`;
    for (let i = 1; i < 8; i++) k += `<path d="M${r(a[0] + i * (b[0] - a[0]) / 8)} ${r(a[1] + 1)} l0 ${r(b[1] - a[1] - 1)}" stroke="#d3d8dc" stroke-width=".4"/>`;
  }
  /* Konfetti auf der Tischdecke */
  for (let i = 0; i < 60; i++) { const [x, y] = q(TI.X0 + rnd() * (TI.X1 - TI.X0), TI.Y + 0.001, TI.Z0 + rnd() * (TI.Z1 - TI.Z0)); k += `<rect x="${x}" y="${y}" width=".9" height=".5" fill="${BUNT[i % BUNT.length]}" transform="rotate(${Math.round(rnd() * 90)} ${x} ${y})"/>`; }
  /* Gedecke: Pappteller, Becher, Serviette, Gabel */
  const gedeck = (X, Z, i, mitUnter) => {
    const [x, y] = q(X, TI.Y + 0.003, Z), w = 0.11 * s(Z), h = 0.11 * s(Z) * 0.16;
    let g = `<ellipse cx="${x}" cy="${y}" rx="${r(w)}" ry="${r(h + 0.8)}" fill="${BUNT[i]}"/><ellipse cx="${x}" cy="${y}" rx="${r(w * 0.7)}" ry="${r(h * 0.7 + 0.5)}" fill="#fff" opacity=".85"/>`;
    const [sx, sy] = q(X - 0.17, TI.Y + 0.003, Z);
    g += `<path d="M${r(sx - 3)} ${r(sy + 0.6)} L${r(sx + 3)} ${r(sy + 0.6)} L${r(sx + 2.4)} ${r(sy - 1)} L${r(sx - 2.4)} ${r(sy - 1)} Z" fill="#fff36a"/><path d="M${r(sx - 0.4)} ${r(sy + 0.4)} L${r(sx + 0.4)} ${r(sy - 0.8)}" stroke="#a9b2b8" stroke-width=".6"/>`;
    const [bx, by] = q(X + 0.16, TI.Y, Z - 0.05);
    g += `<path d="M${r(bx - 2.4)} ${r(by - 6)} L${r(bx + 2.4)} ${r(by - 6)} L${r(bx + 1.9)} ${r(by)} L${r(bx - 1.9)} ${r(by)} Z" fill="${BUNT[(i + 3) % 7]}"/><ellipse cx="${bx}" cy="${r(by - 6)}" rx="2.4" ry=".6" fill="#7a4a2a"/><path d="M${r(bx + 0.6)} ${r(by - 7)} L${r(bx + 2.6)} ${r(by - 11)}" stroke="#ff6f91" stroke-width=".7"/>`;
    if (mitUnter) {
      tischUnter.push({ id: "teller", de: "der Teller", syl: "TEL-ler", it: "il piatto", itSyl: "PIAT-to", en: "plate", x: ox + x, y: oy + y + h + 1, kunst: flaeche(-w, -2 * h - 2, 2 * w, 2 * h + 2), tipp: "Beim Kindergeburtstag gibt es oft bunte Pappteller." });
      tischUnter.push({ id: "becher", de: "der Becher", syl: "BE-cher", it: "il bicchiere", itSyl: "bic-CHIE-re", en: "cup", x: ox + bx, y: oy + by + 0.4, kunst: flaeche(-3, -11.4, 6, 11.8) });
      tischUnter.push({ id: "serviette", de: "die Serviette", syl: "Ser-vi-ET-te", it: "il tovagliolo", itSyl: "to-va-GLIO-lo", en: "napkin", x: ox + sx, y: oy + sy + 1, kunst: flaeche(-3.6, -2.6, 7.2, 3.2) });
    }
    return g;
  };
  k += gedeck(-0.62, 4.35, 0, false);
  k += gedeck(0.5, 4.35, 2, true);
  k += gedeck(-0.05, 4.75, 4, false);
  /* Muffins auf einem Teller vorn links */
  { const [x, y] = q(-0.62, TI.Y + 0.003, 4.08);
    k += `<ellipse cx="${x}" cy="${y}" rx="9" ry="1.6" fill="#f4f6f8" stroke="#d6dbe0" stroke-width=".3"/>`;
    for (const [dx, f] of [[-4.6, "#ff9ec4"], [0, "#8fd3f4"], [4.6, "#ffe066"]]) k += `<path d="M${r(x + dx - 2.4)} ${r(y - 0.4)} L${r(x + dx - 2)} ${r(y - 3.4)} L${r(x + dx + 2)} ${r(y - 3.4)} L${r(x + dx + 2.4)} ${r(y - 0.4)} Z" fill="#c98b4a"/><ellipse cx="${r(x + dx)}" cy="${r(y - 4)}" rx="2.6" ry="1.8" fill="${f}"/><circle cx="${r(x + dx + 0.6)}" cy="${r(y - 5.2)}" r=".6" fill="#e74c3c"/>`;
    tischUnter.push({ id: "muffin", de: "der Muffin", syl: "MUF-fin", it: "il muffin", itSyl: "MUF-fin", en: "muffin", x: ox + x, y: oy + y + 1.6, kunst: flaeche(-8.6, -7.4, 17.2, 8.2) }); }
  /* Kuchengabel beim rechten Gedeck */
  { const [x, y] = q(0.5, TI.Y + 0.003, 4.15);
    k += `<path d="M${r(x - 4)} ${r(y)} L${r(x + 2)} ${r(y - 0.4)}" stroke="#b5bcc2" stroke-width=".7" stroke-linecap="round"/><path d="M${r(x + 2)} ${r(y - 0.9)} l2.4 -.2 M${r(x + 2)} ${r(y - 0.4)} l2.4 -.1 M${r(x + 2)} ${r(y + 0.1)} l2.4 0" stroke="#b5bcc2" stroke-width=".4"/>`;
    tischUnter.push({ id: "gabel", de: "die Gabel", syl: "GA-bel", it: "la forchetta", itSyl: "for-CHET-ta", en: "fork", x: ox + x, y: oy + y + 1, kunst: flaeche(-4.4, -2.4, 9.4, 3.2) }); }
  /* Luftschlangen: bunte Spiralen über den Tisch und vorn herunter */
  { const [x0, y0] = q(0.15, TI.Y + 0.003, 4.12), [x1, y1] = q(0.95, TI.Y + 0.003, 4.05);
    let d = `M${x0} ${y0}`; for (let i = 1; i <= 14; i++) { const t = i / 14; d += ` Q${r(x0 + (x1 - x0) * (t - 0.035))} ${r(y0 + (y1 - y0) * t - 2.4)} ${r(x0 + (x1 - x0) * t)} ${r(y0 + (y1 - y0) * t)}`; }
    d += ` Q${r(x1 + 2)} ${r(y1 + 4)} ${r(x1 - 1)} ${r(y1 + 8)} Q${r(x1 + 3)} ${r(y1 + 11)} ${r(x1)} ${r(y1 + 14)}`;
    k += `<path d="${d}" stroke="#2ecc71" stroke-width=".9" fill="none"/>`;
    const [x2, y2] = q(-0.95, TI.Y + 0.003, 4.6), [x3, y3] = q(-0.35, TI.Y + 0.003, 4.5);
    let e = `M${x2} ${y2}`; for (let i = 1; i <= 10; i++) { const t = i / 10; e += ` Q${r(x2 + (x3 - x2) * (t - 0.05))} ${r(y2 + (y3 - y2) * t - 2)} ${r(x2 + (x3 - x2) * t)} ${r(y2 + (y3 - y2) * t)}`; }
    k += `<path d="${e}" stroke="#ff6f91" stroke-width=".9" fill="none"/>`;
    tischUnter.push({ id: "luftschlange", de: "die Luftschlange", syl: "LUFT-schlan-ge", it: "la stella filante", itSyl: "STEL-la fi-LAN-te", en: "paper streamer", x: ox + (x0 + x1) / 2, y: oy + y1 + 14, kunst: flaeche(-(x1 - x0) / 2 - 1, -17, x1 - x0 + 3, 17.4) }); }
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: ox, y: oy, steht: true, kunst: k,
    zoom: { x: r(ox - 66), y: r(oy - 74), w: 132, h: 88 }, unter: tischUnter,
    tipp: "Der Tisch ist festlich gedeckt: bunte Teller, Becher und Servietten." });
}

/* =====================================================================
   14 — DIE GEBURTSTAGSTORTE mit 15 — DEN KERZEN (sieben)
   ===================================================================== */
const TORTE = { X: -0.05, Z: 4.25 };
{
  const [x, y] = P(TORTE.X, TI.Y, TORTE.Z), k0 = s(TORTE.Z);
  const R = 0.15 * k0, h = 0.11 * k0, e = R * 0.2;
  let k = schatten(0, 0.4, R + 4, 1.6, 0.3);
  /* Tortenplatte, Biskuit mit Sahne, Erdbeeren, bunte Streusel, Schrift */
  k += `<ellipse cx="0" cy="0" rx="${r(R + 3)}" ry="${r(e + 1.2)}" fill="#e9edf0" stroke="#c9d0d6" stroke-width=".3"/>`;
  k += `<path d="M${r(-R)} -.6 L${r(-R)} ${r(-h)} A${r(R)} ${r(e)} 0 0 1 ${r(R)} ${r(-h)} L${r(R)} -.6 A${r(R)} ${r(e)} 0 0 1 ${r(-R)} -.6 Z" fill="${S.lg("torte", [[0, "#ffe3ec"], [0.5, "#ffc9da"], [1, "#f2a6be"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-h)}" rx="${r(R)}" ry="${r(e)}" fill="#fff4f7"/>`;
  for (let i = 0; i < 14; i++) { const a = Math.PI * (i / 13); k += `<circle cx="${r(-Math.cos(a) * R * 0.98)}" cy="${r(-h + Math.sin(a) * e * 0.9)}" r="1.1" fill="#fffafc"/>`; }
  for (let i = 0; i < 30; i++) k += `<rect x="${r((rnd() * 2 - 1) * R * 0.9)}" y="${r(-h * 0.7 + rnd() * h * 0.55)}" width=".8" height=".35" fill="${BUNT[i % 7]}"/>`;
  for (let i = 0; i < 7; i++) { const a = Math.PI * (0.08 + i * 0.84 / 6); k += `<path d="M${r(-Math.cos(a) * R * 0.9)} ${r(-h - 0.4 + Math.sin(a) * e * 0.6)} q1.1 -1.4 2.2 0 q-1.1 1.6 -2.2 0 Z" fill="#d62f45"/>`; }
  k += `<text x="0" y="${r(-h * 0.4)}" font-size="2.8" text-anchor="middle" fill="#c2185b" font-family="'Brush Script MT','Segoe Script',cursive">Lena 7</text>`;
  S.teil({ oben: true, id: "torte_gb", de: "die Geburtstagstorte", syl: "Ge-BURTS-tags-tor-te", it: "la torta di compleanno", itSyl: "TOR-ta di com-ple-AN-no", en: "birthday cake", x, y, kunst: k,
    tipp: "Auf der Torte stehen sieben Kerzen – eine für jedes Jahr." });
  /* DIE KERZE(N): sieben bunte Kerzen mit Flammen (eigenes Teil oberhalb der Torte) */
  let kz = "";
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.1 + i * 0.8 / 6), cx = -Math.cos(a) * R * 0.6, cy = -h - 0.2 - Math.sin(a) * e * 0.5;
    kz += `<rect x="${r(cx - 0.6)}" y="${r(cy - 6)}" width="1.2" height="6" fill="${BUNT[i]}"/><path d="M${r(cx - 0.6)} ${r(cy - 4)} l1.2 -1 M${r(cx - 0.6)} ${r(cy - 2)} l1.2 -1" stroke="#fff" stroke-width=".35"/>`;
    kz += `<ellipse cx="${r(cx)}" cy="${r(cy - 7.4)}" rx=".9" ry="1.7" fill="#ffb02e"/><ellipse cx="${r(cx)}" cy="${r(cy - 7)}" rx=".45" ry=".9" fill="#fff6c8"/><circle cx="${r(cx)}" cy="${r(cy - 7.4)}" r="3" fill="#ffd36b" opacity=".18"/>`;
  }
  S.teil({ oben: true, id: "kerze_gb", de: "die Kerze", syl: "KER-ze", it: "la candelina", itSyl: "can-de-LI-na", en: "candle", x, y, kunst: kz + flaeche(-R * 0.75, -h - 10.4, R * 1.5, 6.4),
    tipp: "Das Geburtstagskind pustet die Kerzen aus und wünscht sich etwas." });
}

/* =====================================================================
   16 — DAS KONFETTI (auf dem Boden vor dem Tisch)
   ===================================================================== */
{
  const Z = 3.6, ox = P(0.1, 0, Z)[0], oy = boden(Z);
  let k = "";
  for (let i = 0; i < 90; i++) {
    const X = -1.1 + rnd() * 2.6, ZZ = Z - 0.25 + rnd() * 0.5, [x, y] = P(X, 0, ZZ);
    k += `<rect x="${r(x - ox)}" y="${r(y - oy)}" width="1.6" height=".8" fill="${BUNT[i % BUNT.length]}" transform="rotate(${Math.round(rnd() * 180)} ${r(x - ox)} ${r(y - oy)})"/>`;
  }
  for (let i = 0; i < 18; i++) { const [x, y] = P(-0.8 + rnd() * 2.1, 0, Z - 0.2 + rnd() * 0.4); k += `<circle cx="${r(x - ox)}" cy="${r(y - oy)}" r="1" fill="${BUNT[(i + 2) % 7]}"/>`; }
  /* eine Luftschlange auf dem Boden */
  { const [a, b] = P(-0.9, 0, Z + 0.1), [c, d] = P(-0.2, 0, Z - 0.1); k += `<path d="M${r(a - ox)} ${r(b - oy)} q3 -3 6 0 q3 3 6 0 q3 -3 6 0 q3 3 6 0 q3 -3 6 0" stroke="#f1c40f" stroke-width="1" fill="none"/>`; }
  const [l] = P(-1.15, 0, Z), [rr] = P(1.55, 0, Z), [, yt] = P(0, 0, Z + 0.3), [, yb] = P(0, 0, Z - 0.3);
  S.teil({ id: "konfetti", de: "das Konfetti", syl: "Kon-FET-ti", it: "i coriandoli", itSyl: "co-ri-AN-do-li", en: "confetti", x: ox, y: oy, kunst: k + flaeche(l - ox, yt - oy, rr - l, yb - yt),
    tipp: "Konfetti sind kleine bunte Papierschnipsel." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/geburtstag.js"));
console.log(aus);
