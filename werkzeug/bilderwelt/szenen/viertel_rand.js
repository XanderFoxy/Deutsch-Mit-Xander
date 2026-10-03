#!/usr/bin/env node
/* =====================================================================
   AM STADTRAND (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   Jeder Ort hat „lupe“ und führt in seine Szene. Wörter und lupe-Verweise
   sind die der alten Szene (szenen/viertel_rand.js).

   RECHERCHE (eigene Kenntnis deutscher Mittelstädte; Begriffe nach
   Duden: ZOB = Zentraler Omnibusbahnhof, Klinikum, P+R):
   - BAHNHOF aus Backstein mit Uhr im Giebel, daneben der Bahnsteig mit
     Dach und ein roter Regionalzug (Doppelstockwagen).
   - ZOB/BUSBAHNHOF direkt am Bahnhof: Bussteige unter einem Dach, ein
     Stadtbus mit Zielanzeige, eine Abfahrtstafel.
   - U-BAHN-Eingang auf dem Gehweg: Treppe nach unten, Geländer, Mast mit
     dem weißen „U“ auf blauem Feld.
   - Am Rand stehen die großen Bauten: KLINIKUM mit Hubschrauberlandeplatz
     auf dem Dach, eigener Eingang NOTAUFNAHME mit Rettungswagen,
     PARKHAUS (offene Decks, großes „P“), HOTEL (Hochhaus, Sterne), die
     MENSA des Studentenwerks am Hochschul-Campus, die STADTHALLE mit
     Konzert-Banner.
   - Kleine Läden an der Straße: DÖNERBUDE mit Dönerspieß, TIERARZT-Praxis,
     SCHNELLRESTAURANT mit Drive-in und hohem Werbemast.
   - Dahinter: Felder, der FLUGHAFEN (Tower, startendes Flugzeug), ein
     FREIZEITPARK mit Achterbahn, auf dem Festplatz der JAHRMARKT mit
     Riesenrad — und darüber ein FEUERWERK (Silvester).
   - Zeit: blaue Stunde am Abend; Fenster und Laternen leuchten.
   Maßstab: Augenhöhe y = 80 (≈ 20 m, Blick vom Parkhausdach gegenüber).
   Vordere Reihe (Fuß y 222) ≈ 7 Einheiten je Meter, hintere Reihe
   (Fuß y 150) ≈ 3,5.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;

const S = neueSzene({ id: "viertel_rand", titel: "Am Stadtrand", emoji: "🚉", thema: "Stadt", kuerzel: "b29d", fassung: 852, breite: 400, hoehe: 300 });
const rnd = zufall(2944);
const r = B.r;

const WORT = {
  vr_bahnhof: ["der Bahnhof","BAHN-hof","la stazione","sta-ZIO-ne","railway station","bahnhof"],
  vr_flughafen: ["der Flughafen","FLUG-ha-fen","l'aeroporto","a-e-ro-POR-to","airport","flughafen"],
  vr_strasse: ["die Straße","STRA-ße","la strada","STRA-da","street","strasse"],
  vr_busbahnhof: ["der Busbahnhof","BUS-bahn-hof","la stazione dei pullman","sta-ZIO-ne","coach station","busbahnhof"],
  vr_ubahn: ["die U-Bahn-Station","U-Bahn-Sta-ti-on","la stazione della metro","sta-ZIO-ne","underground station","ubahn"],
  vr_parkhaus: ["das Parkhaus","PARK-haus","il parcheggio","par-CHEG-gio","multi-storey car park","parkhaus"],
  vr_hotel: ["das Hotel","Ho-TEL","l'albergo","al-BER-go","hotel","hotel"],
  vr_krankenhaus: ["das Krankenhaus","KRAN-ken-haus","l'ospedale","o-spe-DA-le","hospital","krankenhaus"],
  vr_notaufnahme: ["die Notaufnahme","NOT-auf-nah-me","il pronto soccorso","PRON-to soc-COR-so","emergency room","notaufnahme"],
  vr_tierarzt: ["der Tierarzt","TIER-arzt","il veterinario","ve-te-ri-NA-rio","vet","tierarzt"],
  vr_mensa: ["die Mensa","MEN-sa","la mensa","MEN-sa","canteen","mensa"],
  vr_imbiss: ["die Dönerbude","DÖ-ner-bu-de","la paninoteca","pa-ni-no-TE-ca","kebab shop","imbiss"],
  vr_schnellrestaurant: ["das Schnellrestaurant","SCHNELL-re-stau-rant","il fast food","FAST FOOD","fast-food restaurant","schnellrestaurant"],
  vr_freizeitpark: ["der Freizeitpark","FREI-zeit-park","il parco divertimenti","PAR-co di-ver-ti-MEN-ti","theme park","freizeitpark"],
  vr_jahrmarkt: ["der Jahrmarkt","JAHR-markt","la fiera","FIE-ra","funfair","jahrmarkt"],
  vr_konzert: ["das Konzert","Kon-ZERT","il concerto","con-CER-to","concert","konzert"],
  vr_silvester: ["Silvester","Sil-VES-ter","il Capodanno","ca-po-DAN-no","New Year's Eve","silvester"],
};

/* ---------- Zeichenhelfer (absolute Koordinaten) -------------------- */
const memo = {};
const LG = (n, st, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => memo[n] || (memo[n] = S.lg(n, st, x1, y1, x2, y2));
const RG = (n, st, cx = 0.5, cy = 0.5, rr = 0.5) => memo[n] || (memo[n] = S.rg(n, st, cx, cy, rr));
const re = (x, y, w, h, f, ex = "") => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${f}"${ex}/>`;
const pl = (pts, f, ex = "") => `<path d="M${pts.map((p) => r(p[0]) + " " + r(p[1])).join("L")}Z" fill="${f}"${ex}/>`;
const li = (x1, y1, x2, y2, c, w, ex = "") => `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${c}" stroke-width="${w}"${ex}/>`;
const ci = (x, y, rr, f, ex = "") => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"${ex}/>`;
const el = (x, y, rx, ry, f, ex = "") => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}"${ex}/>`;
const tx = (x, y, s, t, f, ex = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Arial,Helvetica,sans-serif"${ex}>${t}</text>`;
function teil(id, mx, my, kunst, extra = {}) {
  const w = WORT[id];
  const x = mx - 16, y = my + 16;
  S.teil(Object.assign({ id, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], lupe: w[5], x, y, steht: true,
    kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${kunst}</g>` }, extra));
}
const HELL = LG("licht", [[0, "#fff3c2"], [1, "#ffcf6e"]]);
const DUNKEL = "#33465e";
/* Fensterraster: manche Fenster leuchten */
function fensterRaster(x0, y0, sp, ze, w, h, dx, dy, quote = 0.6) {
  let s = "";
  for (let j = 0; j < ze; j++) for (let i = 0; i < sp; i++) s += re(x0 + i * dx, y0 + j * dy, w, h, rnd() < quote ? HELL : DUNKEL);
  return s;
}
const auto = (cx, fy, l, f, dir = 1) => {
  const h = l * 0.3, w = l / 2, P = (x, y) => `${r(cx + x * dir * w)} ${r(fy - y * h)}`;
  let s = `<path d="M${P(-1, 0.18)} L${P(-1, 0.55)} Q${P(-0.98, 0.62)} ${P(-0.8, 0.64)} L${P(-0.48, 0.66)} L${P(-0.26, 1)} L${P(0.42, 1)} L${P(0.68, 0.64)} L${P(0.96, 0.58)} Q${P(1, 0.5)} ${P(1, 0.35)} L${P(1, 0.18)} Z" fill="${f}"/>`;
  s += `<path d="M${P(-0.4, 0.66)} L${P(-0.22, 0.94)} L${P(0.06, 0.94)} L${P(0.06, 0.66)} Z M${P(0.12, 0.66)} L${P(0.12, 0.94)} L${P(0.38, 0.94)} L${P(0.58, 0.66)} Z" fill="#a9c1d6"/>`;
  for (const t of [-0.62, 0.62]) s += ci(cx + t * w, fy - h * 0.16, h * 0.24, "#16191c") + ci(cx + t * w, fy - h * 0.16, h * 0.12, "#8f979e");
  s += el(cx + dir * w * 0.98, fy - h * 0.44, l * 0.03, h * 0.08, "#fff7d6") + el(cx + dir * w * 1.05, fy - h * 0.44, l * 0.1, h * 0.25, "#fff4c4", ` opacity=".35" filter="url(#${S.id("glow")})"`);
  s += re(cx - dir * w - (dir > 0 ? 0 : l * 0.03), fy - h * 0.48, l * 0.03, h * 0.12, "#e63946");
  return s;
};

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glow")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);

/* =====================================================================
   KULISSE — Abendhimmel, Felder, Lichtkegel, Straßenflächen
   ===================================================================== */
S.hinten(re(0, 0, 400, 160, LG("himmel", [[0, "#17233f"], [0.45, "#34497a"], [0.8, "#b9788a"], [1, "#f2a46b"]])));
{
  let st = "";
  for (let i = 0; i < 60; i++) st += ci(rnd() * 400, rnd() * 45, 0.2 + rnd() * 0.35, "#fff", ` opacity="${r(0.4 + rnd() * 0.5)}"`);
  st += ci(42, 18, 5, "#f4f1e6") + ci(44.4, 16.6, 4.6, "#22305a");
  S.hinten(st);
}
/* Scheinwerfer der Stadthalle (Konzert) in den Himmel */
S.hinten(`<path d="M352 98 L320 0 L338 0 Z M372 98 L392 0 L410 0 Z" fill="#fff6d0" opacity=".14"/>`);
{
  let f = `<path d="M0 84 Q100 78 200 82 T400 80 V160 H0 Z" fill="${LG("feld", [[0, "#3e4f45"], [1, "#2c3a33"]])}"/>`;
  for (let i = 0; i < 12; i++) f += li(i * 36 - 20, 86, i * 40 - 60, 150, "#4b5c50", 0.6, ' opacity=".6"');
  /* Hochspannungsleitung */
  for (const x of [20, 96, 172, 248]) f += `<path d="M${x} 90 l-3 0 l2 -12 h2 l2 12 Z M${x - 4} 81 h8" stroke="#5a6470" stroke-width=".5" fill="none"/>`;
  f += `<path d="M16 81 Q58 85 92 81 Q134 85 168 81 Q210 85 244 81" stroke="#5a6470" stroke-width=".25" fill="none"/>`;
  S.hinten(f);
}
{
  /* Straße hinten, Gehweg vorne an der Ladenzeile */
  let g = re(0, 150, 400, 72, "#3a4250") + re(0, 150, 400, 2, "#596274");
  for (let x = 6; x < 400; x += 22) g += re(x, 163, 11, 0.8, "#c9c9c0", ' opacity=".7"');
  for (const [x, y, d] of [[30, 160, 1], [214, 168, -1], [380, 160, 1]]) g += re(x - 7, y - 3, 14, 3.4, "#20252c") + re(x - 4, y - 5, 8, 2.4, "#20252c") + el(x + d * 7, y - 1.6, 0.9, 0.6, d > 0 ? "#fff3c2" : "#ff4d4d") + el(x - d * 7, y - 1.6, 0.9, 0.6, d > 0 ? "#ff4d4d" : "#fff3c2");
  g += re(0, 222, 400, 14, LG("gehweg", [[0, "#8d8f96"], [1, "#777a82"]]));
  for (let x = -60; x <= 460; x += 12) g += li(x, 222, 200 + (x - 200) * 1.08, 236, "#696c74", 0.3);
  g += re(0, 235, 400, 2.4, "#a3a6ad");
  S.hinten(g);
}

/* =====================================================================
   HORIZONT UND HIMMEL: Flughafen, Freizeitpark, Jahrmarkt, Feuerwerk
   ===================================================================== */
{
  let k = "";
  /* Terminal und Tower am Horizont */
  k += re(110, 76, 44, 6, "#4b5a6e") + re(110, 76, 44, 1.6, "#6f8098");
  for (let i = 0; i < 10; i++) k += re(112 + i * 4.2, 78.4, 2.6, 1.6, HELL);
  k += re(140, 56, 3, 20, "#5a6a80") + pl([[136, 56], [147, 56], [145, 50], [138, 50]], "#3d4c60") + re(137.6, 51.4, 7.8, 3, "#9fe0ff", ' opacity=".8"') + li(141.5, 50, 141.5, 46, "#888", 0.4) + ci(141.5, 45.6, 0.7, "#e63946");
  /* startendes Flugzeug mit Lichtern */
  k += `<g transform="translate(90 36) rotate(-14)">`;
  k += el(0, 0, 14, 2.2, LG("rumpf", [[0, "#f4f6f8"], [1, "#b9c2ca"]])) + pl([[-3, 0], [5, 0], [-6, 9], [-10, 9]], "#c9d1d8") + pl([[-3, -1], [4, -1], [-5, -7], [-8, -7]], "#aeb8c1") + pl([[-11, -1], [-14, -1], [-15, -7], [-12.4, -7]], "#1f6fb2");
  k += li(-8, -0.6, 10, -0.6, "#7fa6c2", 0.6, ' stroke-dasharray=".6 .6"') + ci(-10, 9, 0.8, "#e63946") + ci(14, 0, 0.7, "#fff");
  k += `</g>`;
  k += ci(82, 46, 3, "#e63946", ` opacity=".3" filter="url(#${S.id("glow")})"`);
  k += re(112, 82.4, 40, 0.8, "#c8d7e6", ' opacity=".6"');
  teil("vr_flughafen", 82, 22, k, { tipp: "Vom Flughafen starten die Flugzeuge in alle Welt." });
}
{
  /* Achterbahn mit Looping und Freifallturm am Horizont rechts */
  let k = re(372, 34, 4, 62, "#5a4a7a") + re(369, 30, 10, 6, "#8f6bd6") + ci(374, 33, 2, "#ffd23f", ` filter="url(#${S.id("glow")})"`);
  k += `<path d="M292 98 L300 62 Q306 46 314 62 L322 90 Q330 98 340 84 Q352 60 360 84 L368 98" stroke="#e63946" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M316 80 a8 9 0 1 1 0.1 0" stroke="#e63946" stroke-width="1.2" fill="none"/>`;
  for (const [x, y] of [[300, 62], [306, 52], [314, 64], [322, 88], [340, 84], [352, 66], [360, 84]]) k += li(x, y, x, 100, "#8a95a6", 0.4);
  for (let i = 0; i < 18; i++) k += ci(296 + i * 4, 98 - Math.abs(Math.sin(i * 0.7)) * 30, 0.5, "#ffd23f", ' opacity=".8"');
  k += re(298, 92, 20, 5, "#2b1f4a") + tx(308, 95.8, 2.8, "FUNPARK", "#ffd23f", ' font-weight="bold"');
  teil("vr_freizeitpark", 332, 48, k, { tipp: "Im Freizeitpark fährt man Achterbahn und Wildwasserbahn." });
}
{
  /* Riesenrad auf dem Festplatz */
  const CX = 180, CY = 72, R = 27;
  let k = `<path d="M${CX - 16} 112 L${CX} ${CY} L${CX + 16} 112" stroke="#9aa3aa" stroke-width="1.6" fill="none"/>`;
  k += ci(CX, CY, R, "none", ' stroke="#d9dde0" stroke-width="1.2"') + ci(CX, CY, R - 3, "none", ' stroke="#b5bcc2" stroke-width=".5"');
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; k += li(CX, CY, CX + Math.cos(a) * R, CY + Math.sin(a) * R, "#b5bcc2", 0.35); }
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; k += ci(CX + Math.cos(a) * R, CY + Math.sin(a) * R, 0.8, ["#ffd23f", "#ff6b6b", "#7ce0ff"][i % 3], ` filter="url(#${S.id("glow")})"`); }
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2, x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R; k += re(x - 2.4, y + 0.6, 4.8, 4, ["#e63946", "#2a9d8f", "#ffd23f", "#4f8fd8"][i % 4]) + li(x, y, x, y + 0.8, "#666", 0.3); }
  k += ci(CX, CY, 2.4, "#d9dde0");
  teil("vr_jahrmarkt", CX - 34, 56, k, { tipp: "Auf dem Jahrmarkt (der Kirmes) gibt es ein Riesenrad, Karussells und Zuckerwatte." });
}
{
  /* Feuerwerk über dem Festplatz */
  const ster = (x, y, rr, c, n) => { let s = ci(x, y, rr * 0.9, c, ` opacity=".18" filter="url(#${S.id("glow")})"`); for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n; s += li(x + Math.cos(a) * rr * 0.25, y + Math.sin(a) * rr * 0.25, x + Math.cos(a) * rr, y + Math.sin(a) * rr, c, 0.6, ' stroke-linecap="round"') + ci(x + Math.cos(a) * rr * 1.1, y + Math.sin(a) * rr * 1.1, 0.6, "#fff"); } return s; };
  let k = ster(232, 22, 11, "#ff6b6b", 18) + ster(262, 14, 8, "#ffd23f", 14) + ster(212, 36, 6, "#7ce0ff", 12);
  k += `<path d="M236 70 Q234 50 232 34" stroke="#ffd9a0" stroke-width=".4" fill="none" opacity=".6" stroke-dasharray="1 1"/>`;
  teil("vr_silvester", 246, 32, k, { tipp: "Feuerwerk gibt es in Deutschland vor allem an Silvester um Mitternacht." });
}

/* =====================================================================
   HINTERE REIHE (Fuß y 150): Klinikum, Notaufnahme, Parkhaus, Hotel,
   Mensa, Stadthalle
   ===================================================================== */
{
  const X0 = 4, X1 = 112, T = 80;
  let k = re(X0, T, X1 - X0, 150 - T, LG("klinik", [[0, "#dfe4ea"], [1, "#b9c2cc"]], 0, 0, 1, 0));
  k += fensterRaster(X0 + 4, T + 12, 13, 8, 5, 3.4, 7.8, 6.6, 0.55);
  for (let j = 0; j < 9; j++) k += re(X0, T + 10 + j * 6.6, X1 - X0, 0.6, "#9aa6b2");
  k += re(X0 + 34, T - 1, 40, 2, "#c9cfd4") + el(X0 + 54, T - 3, 14, 2.6, "#4d5a68") + tx(X0 + 54, T - 2.2, 3.2, "H", "#fff", ' font-weight="bold"') + el(X0 + 54, T - 3, 11, 1.8, "none", ' stroke="#ffd23f" stroke-width=".4"');
  k += re(X0 + 18, T + 2, 72, 7, "#1f6fb2") + tx(X0 + 54, T + 7.4, 5, "KLINIKUM", "#fff", ' font-weight="bold" letter-spacing="1"');
  k += re(X0 + 40, 138, 28, 12, "#3d4f66") + re(X0 + 42, 140, 24, 10, HELL) + re(X0 + 36, 136, 36, 2.4, "#c9cfd4") + tx(X0 + 54, 135, 2.4, "Haupteingang", "#fff");
  teil("vr_krankenhaus", X0 + 14, 104, k, { tipp: "Im Krankenhaus (Klinikum) werden kranke Menschen behandelt und gepflegt." });
}
{
  const X0 = 114, X1 = 158, T = 122;
  let k = re(X0, T, X1 - X0, 150 - T, "#d2d9e0") + re(X0, T, X1 - X0, 2, "#9aa6b2") + fensterRaster(X0 + 3, T + 4, 5, 1, 6, 4, 8, 0, 0.8);
  k += re(X0 + 2, T + 10, X1 - X0 - 4, 7, "#d62828") + tx((X0 + X1) / 2, T + 15.4, 4.6, "NOTAUFNAHME", "#fff", ' font-weight="bold"');
  k += re(X0 + 2, T + 19, 20, 9, "#2d3a4a") + re(X0 + 3, T + 20, 18, 8, HELL);
  /* Rettungswagen mit Blaulicht vor der Einfahrt */
  k += re(X0 + 22, 136, 20, 12, "#fdfdfd") + re(X0 + 22, 140, 20, 2.4, "#e63946") + re(X0 + 36, 138, 6, 4, "#a9c1d6") + ci(X0 + 26, 148.6, 1.8, "#16191c") + ci(X0 + 38, 148.6, 1.8, "#16191c");
  k += re(X0 + 27, 134.8, 4, 1.4, "#2f7dff") + ci(X0 + 29, 135, 3, "#4f9cff", ` opacity=".45" filter="url(#${S.id("glow")})"`) + tx(X0 + 30, 145, 2, "112", "#e63946", ' font-weight="bold"');
  teil("vr_notaufnahme", 146, 117, k, { tipp: "In die Notaufnahme kommt man bei einem Unfall – auch mitten in der Nacht." });
}
{
  const X0 = 162, X1 = 212, T = 106;
  let k = re(X0, T, X1 - X0, 150 - T, "#6d7480");
  for (let j = 0; j < 4; j++) {
    const y = T + 2 + j * 11;
    k += re(X0, y, X1 - X0, 3, "#b9bec6") + re(X0 + 1, y + 3, X1 - X0 - 2, 8, "#2b313a");
    for (let i = 0; i < 4; i++) if (rnd() < 0.7) k += re(X0 + 3 + i * 11, y + 7, 8, 3.4, ["#c0392b", "#e9ecef", "#2a6fb4", "#7f8c8d", "#f2b632"][(i + j) % 5]) + re(X0 + 4.2 + i * 11, y + 7.6, 2, 1.2, "#a9c1d6");
    k += re(X0, y + 10, X1 - X0, 1, "#b9bec6");
  }
  k += re(X0 + 34, T - 14, 14, 14, "#1f6fb2") + tx(X0 + 41, T - 3, 12, "P", "#fff", ' font-weight="bold"') + re(X0 + 40.4, T, 1.2, 4, "#888");
  k += re(X0 + 2, T - 6, 26, 5, "#fff") + tx(X0 + 15, T - 2.4, 3, "P + R", "#1f6fb2", ' font-weight="bold"');
  teil("vr_parkhaus", X0 + 10, 132, k, { tipp: "Im Parkhaus parkt man auf mehreren Etagen. P + R heißt: parken und mit Bus oder Bahn weiterfahren." });
}
{
  const X0 = 216, X1 = 256, T = 56;
  let k = re(X0, T, X1 - X0, 150 - T, LG("hotel", [[0, "#3c4a63"], [1, "#2a354a"]], 0, 0, 1, 0)) + re(X0 - 1, T - 2, X1 - X0 + 2, 3, "#59677f");
  k += fensterRaster(X0 + 9, T + 6, 5, 12, 4, 4, 6, 6.4, 0.6);
  k += re(X0 + 2, T + 5, 5, 64, "#1a2233");
  "HOTEL".split("").forEach((c, i) => { k += tx(X0 + 4.5, T + 14 + i * 11, 7, c, "#ffd98a", ` font-weight="bold" filter="url(#${S.id("glow")})" opacity=".6"`) + tx(X0 + 4.5, T + 14 + i * 11, 7, c, "#fff3c2", ' font-weight="bold"'); });
  k += tx(X0 + 21, T - 4, 3.4, "★★★★", "#ffd23f");
  k += re(X0 + 12, 136, 22, 14, HELL) + re(X0 + 10, 133.6, 26, 2.6, "#8b1e3f") + re(X0 + 22, 136, 0.8, 14, "#8f6d3a");
  teil("vr_hotel", X0 + 24, 66, k, { tipp: "Im Hotel übernachtet man auf Reisen. Die Rezeption ist Tag und Nacht offen." });
}
{
  const X0 = 260, X1 = 318, T = 112;
  let k = re(X0, T, X1 - X0, 150 - T, LG("mensa", [[0, "#c9b79a"], [1, "#a8957a"]])) + re(X0 - 1, T - 2, X1 - X0 + 2, 3, "#7d6e58");
  k += re(X0 + 3, T + 14, X1 - X0 - 6, 22, "#3a3328") + re(X0 + 4, T + 15, X1 - X0 - 8, 21, HELL);
  /* drinnen: Tische und Essensausgabe */
  for (let i = 0; i < 4; i++) k += re(X0 + 7 + i * 12, T + 29, 8, 1.4, "#8a6a40") + re(X0 + 10.4 + i * 12, T + 30.4, 1, 5.6, "#6d5434");
  k += re(X0 + 4, T + 18, X1 - X0 - 8, 2, "#c9cfd4", ' opacity=".7"');
  for (let x = X0 + 4; x < X1 - 4; x += 10) k += li(x, T + 15, x, T + 36, "#3a3328", 0.6);
  k += re(X0 + 6, T + 4, 46, 7, "#c0392b") + tx(X0 + 29, T + 9.4, 4.8, "MENSA", "#fff", ' font-weight="bold" letter-spacing="1"') + tx(X0 + 29, T + 13.4, 1.8, "Studentenwerk · Hochschule", "#3a3328");
  teil("vr_mensa", 274, 134, k, { tipp: "In der Mensa essen die Studentinnen und Studenten zu Mittag." });
}
{
  const X0 = 322, X1 = 398, T = 98;
  let k = `<path d="M${X0} ${T + 8} Q${(X0 + X1) / 2} ${T - 6} ${X1} ${T + 8} V150 H${X0} Z" fill="${LG("halle", [[0, "#4b3f6b"], [1, "#2f2848"]])}"/>`;
  k += re(X0 + 4, T + 18, X1 - X0 - 8, 32, "#1d1830") + re(X0 + 5, T + 19, X1 - X0 - 10, 31, LG("hglas", [[0, "#ffcf6e"], [1, "#f08a4b"]]));
  for (let x = X0 + 5; x < X1 - 5; x += 8.2) k += li(x, T + 19, x, 150, "#2f2848", 0.6);
  k += re(X0 + 10, T + 8, 56, 8, "#fff") + tx(X0 + 38, T + 13.6, 4.2, "STADTHALLE", "#2f2848", ' font-weight="bold" letter-spacing=".6"');
  k += re(X0 + 14, T + 22, 48, 13, "#d62828") + tx(X0 + 38, T + 29, 5, "KONZERT", "#fff", ' font-weight="bold"') + tx(X0 + 38, T + 33.4, 2.4, "heute 20 Uhr · ausverkauft", "#ffe0e0");
  k += `<path d="M${X0 + 10} ${T + 25} l2 -3 v8 Z M${X1 - 10} ${T + 25} l-2 -3 v8 Z" fill="#fff"/>`;
  teil("vr_konzert", 332, 138, k, { tipp: "In der Stadthalle ist heute Abend ein Konzert." });
}

/* =====================================================================
   VORDERE REIHE (Fuß y 222): Bahnhof, Busbahnhof, Dönerbude,
   Tierarzt, Schnellrestaurant
   ===================================================================== */
{
  let k = "";
  /* Bahnsteig mit Dach und Regionalzug */
  k += re(70, 212, 54, 10, "#8d8f96") + re(70, 211, 54, 1.4, "#e9e2a0");
  k += re(72, 188, 52, 22, LG("zug", [[0, "#e03a3e"], [1, "#b42a2e"]])) + re(72, 188, 52, 2, "#f2f2f2") + re(72, 205, 52, 2, "#f2f2f2");
  for (let i = 0; i < 6; i++) k += re(75 + i * 8, 191, 6, 5, HELL) + re(75 + i * 8, 198, 6, 5, HELL);
  k += re(104, 199.6, 4, 9.4, "#3a3a3a") + tx(98, 209.6, 2.2, "RE 7", "#fff", ' font-weight="bold"');
  k += re(72, 180, 52, 3, "#5f6770") + re(74, 183, 1.6, 29, "#5f6770") + re(120, 183, 1.6, 29, "#5f6770");
  k += re(98, 184, 16, 4, "#1f3d7a") + tx(106, 186.8, 2.2, "Gleis 1", "#fff");
  /* Empfangsgebäude aus Backstein mit Uhr im Giebel */
  k += re(4, 176, 68, 46, LG("backstein", [[0, "#a4523b"], [1, "#7f3c2b"]])) + pl([[2, 176], [38, 160], [74, 176]], "#3d3f45");
  k += pl([[24, 176], [38, 162], [52, 176]], "#a4523b") + ci(38, 170, 4.4, "#f4f1e6") + ci(38, 170, 4.4, "none", ' stroke="#3d3f45" stroke-width=".6"') + li(38, 170, 38, 167, "#222", 0.5) + li(38, 170, 40.4, 170.6, "#222", 0.5);
  for (const x of [10, 24, 46, 60]) k += `<path d="M${x} 210 v-14 q3 -4 6 0 v14 Z" fill="${HELL}"/>` + `<path d="M${x} 196 q3 -4 6 0" stroke="#e8d6b0" stroke-width=".8" fill="none"/>`;
  k += `<path d="M32 222 v-16 q6 -6 12 0 v16 Z" fill="#3a2a20"/>` + `<path d="M33 222 v-15 q5 -5 10 0 v15 Z" fill="${HELL}"/>`;
  k += re(14, 178, 48, 6, "#1f3d7a") + tx(38, 182.6, 4.4, "Bahnhof", "#fff", ' font-weight="bold"');
  teil("vr_bahnhof", 14, 200, k, { tipp: "Am Bahnhof fahren die Züge ab. Der Regionalexpress steht an Gleis 1." });
}
{
  const X0 = 152, X1 = 252;
  let k = re(X0, 218, X1 - X0, 4, "#a3a6ad");
  /* Bussteig-Dach */
  k += re(X0 + 2, 190, X1 - X0 - 4, 3, "#c9cfd4") + pl([[X0 + 2, 190], [X1 - 2, 190], [X1 - 6, 186], [X0 + 6, 186]], "#9fb3c4", ' opacity=".8"');
  for (const x of [X0 + 6, X0 + 50, X1 - 8]) k += re(x, 193, 1.6, 25, "#7d868d");
  k += re(X0 + 20, 186, 34, 5.4, "#ffd23f") + tx(X0 + 37, 190.2, 3.4, "ZOB · Bussteig A", "#1d2733", ' font-weight="bold"');
  /* Stadtbus */
  k += schatten(X0 + 44, 221, 36, 1.4, 0.3) + re(X0 + 10, 197, 70, 21, LG("bus", [[0, "#f5f0e1"], [1, "#d9cfb0"]])) + re(X0 + 10, 197, 70, 2, "#c0392b");
  for (let i = 0; i < 7; i++) k += re(X0 + 18 + i * 8.6, 201, 7, 7, HELL);
  k += re(X0 + 11, 200, 6, 10, "#a9c1d6") + re(X0 + 12, 198.4, 14, 2.6, "#111") + tx(X0 + 19, 200.4, 1.9, "12 Bahnhof", "#ffb000", ' font-family="monospace"');
  k += re(X0 + 28, 208, 6, 10, "#5d6a76") + re(X0 + 58, 208, 6, 10, "#5d6a76") + ci(X0 + 22, 218.4, 3, "#16191c") + ci(X0 + 70, 218.4, 3, "#16191c") + ci(X0 + 22, 218.4, 1.4, "#888") + ci(X0 + 70, 218.4, 1.4, "#888");
  k += re(X0 + 9, 211, 1.6, 2, "#fff7d6");
  /* Abfahrtstafel */
  k += re(X0 + 84, 196, 12, 16, "#1d2733") + re(X0 + 89.4, 212, 1.2, 8, "#555");
  for (let i = 0; i < 4; i++) k += re(X0 + 85.4, 198.6 + i * 3.2, 9, 1.4, "#ffb000", ' opacity=".85"');
  teil("vr_busbahnhof", X0 + 16, 208, k, { tipp: "Am Busbahnhof (ZOB) fahren die Stadtbusse und Fernbusse ab." });
}
{
  const X0 = 256, X1 = 300;
  let k = re(X0, 194, X1 - X0, 28, "#e9e2d2") + re(X0 - 1, 188, X1 - X0 + 2, 8, "#d62828") + tx((X0 + X1) / 2, 194, 4.6, "DÖNER", "#fff", ' font-weight="bold" letter-spacing=".4"');
  k += `<path d="M${X0 - 1} 196 h${X1 - X0 + 2} v3 l-3 1.4 l-3 -1.4 l-3 1.4 l-3 -1.4 l-3 1.4 l-3 -1.4 l-3 1.4 l-3 -1.4 l-3 1.4 l-3 -1.4 l-3 1.4 l-3 -1.4 l-3 1.4 l-3 -1.4 l-3 1.4 Z" fill="#f2b632"/>`;
  k += re(X0 + 3, 202, 30, 14, HELL) + re(X0 + 2, 214, 32, 3, "#c9cfd4");
  /* Dönerspieß vor dem Grill */
  k += re(X0 + 8, 202.4, 6, 11, "#7a3f1e") + pl([[X0 + 8, 203], [X0 + 14, 203], [X0 + 13, 213], [X0 + 9, 213]], LG("doener", [[0, "#b8642c"], [1, "#8a4417"]], 0, 0, 1, 0)) + re(X0 + 10.6, 200.6, 0.8, 14, "#9aa3aa");
  k += re(X0 + 16, 204, 15, 8, "#2b2b2b") + tx(X0 + 23.5, 206.6, 1.6, "Döner 6,50", "#fff") + tx(X0 + 23.5, 208.8, 1.6, "Dürüm 7,00", "#fff") + tx(X0 + 23.5, 211, 1.6, "Falafel 5,50", "#fff");
  k += re(X0 + 36, 204, 6, 18, "#6d4a2a") + re(X0 + 37, 205, 4, 7, HELL);
  k += re(X0 + 2, 218, 8, 1, "#888") + re(X0 + 5.6, 218, 0.8, 4, "#888");
  teil("vr_imbiss", 292, 210, k, { tipp: "An der Dönerbude gibt es Döner, Dürüm und Falafel – auch spät am Abend." });
}
{
  const X0 = 302, X1 = 344;
  let k = re(X0, 198, X1 - X0, 24, "#e5edf0") + pl([[X0 - 2, 198], [X1 + 2, 198], [X1 - 2, 192], [X0 + 2, 192]], "#4f6b7a");
  k += re(X0 + 3, 199.6, 36, 6, "#2a9d8f") + tx(X0 + 21, 204, 3.2, "Tierarztpraxis", "#fff", ' font-weight="bold"');
  /* Pfote als Zeichen */
  const pf = (x, y, s) => el(x, y, 2.2 * s, 1.8 * s, "#2a9d8f") + ci(x - 2.2 * s, y - 2.4 * s, 0.8 * s, "#2a9d8f") + ci(x - 0.8 * s, y - 3.4 * s, 0.8 * s, "#2a9d8f") + ci(x + 0.8 * s, y - 3.4 * s, 0.8 * s, "#2a9d8f") + ci(x + 2.2 * s, y - 2.4 * s, 0.8 * s, "#2a9d8f");
  k += re(X0 + 3, 208, 16, 10, HELL) + pf(X0 + 11, 215, 1.1);
  k += re(X0 + 24, 208, 12, 14, "#4f6b7a") + re(X0 + 25, 209, 10, 13, HELL);
  k += re(X0 + 20, 212, 3, 2, "#fff");
  teil("vr_tierarzt", X0 + 30, 206, k, { tipp: "Beim Tierarzt werden kranke Hunde, Katzen und Kaninchen behandelt." });
}
{
  const X0 = 346, X1 = 398;
  let k = re(X0, 196, X1 - X0, 26, "#f1ede4") + re(X0, 192, X1 - X0, 5, "#c0392b") + re(X0 + 3, 200, 30, 14, HELL) + re(X0 + 36, 202, 12, 20, "#5a2a1f") + re(X0 + 37, 203, 10, 19, HELL);
  k += re(X0 + 3, 214, 30, 2, "#8a2a1f");
  /* hoher Werbemast mit rundem Schild */
  k += re(X0 + 38, 150, 2, 42, "#7d868d") + ci(X0 + 39, 152, 10, "#ffd23f") + ci(X0 + 39, 152, 8.6, "#c0392b") + tx(X0 + 39, 154, 4.6, "BURGER", "#ffd23f", ' font-weight="bold"');
  k += ci(X0 + 39, 152, 12, "#ffd23f", ` opacity=".25" filter="url(#${S.id("glow")})"`);
  /* Drive-in-Schild */
  k += re(X0 + 2, 188, 22, 4.4, "#ffd23f") + tx(X0 + 13, 191.4, 3, "DRIVE-IN ➜", "#c0392b", ' font-weight="bold"');
  teil("vr_schnellrestaurant", X0 + 12, 204, k, { tipp: "Im Schnellrestaurant bekommt man Burger und Pommes – am Drive-in sogar im Auto." });
}

/* =====================================================================
   VORNE: die Straße mit Zebrastreifen und Ampel; der U-Bahn-Eingang
   ===================================================================== */
{
  let k = re(0, 237.4, 400, 49, LG("asphalt", [[0, "#40444c"], [1, "#2e3238"]]));
  for (let i = 0; i < 200; i++) k += ci(rnd() * 400, 238 + rnd() * 48, 0.2 + rnd() * 0.25, rnd() < 0.5 ? "#5a5f68" : "#25282d", ' opacity=".6"');
  for (let x = 4; x < 400; x += 24) if (x < 112 || x > 170) k += re(x, 261, 12, 1, "#e9e7df");
  /* Zebrastreifen zum U-Bahn-Eingang */
  for (let i = 0; i < 7; i++) k += pl([[118 + i * 7, 238], [123 + i * 7, 238], [124 + i * 7.6, 286], [118 + i * 7.6, 286]], "#eeeeea");
  k += re(0, 286, 400, 2.4, "#a3a6ad") + re(0, 288.4, 400, 11.6, LG("gehweg2", [[0, "#8d8f96"], [1, "#777a82"]]));
  /* Autos mit Licht */
  k += auto(52, 258, 30, "#2a6fb4", 1) + auto(322, 281, 34, "#c0392b", -1);
  /* Ampel vorne am Gehweg */
  k += re(112, 252, 1.6, 40, "#2b2f33") + re(108.6, 250, 8.6, 18, "#1d2226") + ci(112.9, 254, 2.2, "#3a1010") + ci(112.9, 259, 2.2, "#3a3410") + ci(112.9, 264, 2.2, "#3ad16b") + ci(112.9, 264, 4, "#3ad16b", ` opacity=".35" filter="url(#${S.id("glow")})"`);
  teil("vr_strasse", 200, 268, k, { tipp: "Über die Straße geht man am Zebrastreifen oder bei Grün an der Ampel." });
}
{
  /* U-Bahn-Eingang: Treppe, Geländer, U-Mast */
  let k = pl([[124, 224], [150, 224], [152, 236], [122, 236]], "#2b2f36");
  for (let i = 0; i < 6; i++) k += li(124 - i * 0.3, 225.6 + i * 1.8, 150 + i * 0.3, 225.6 + i * 1.8, "#8d8f96", 0.6);
  k += li(123, 218, 121, 236, "#c9cfd4", 0.8) + li(151, 218, 153, 236, "#c9cfd4", 0.8) + li(123, 218, 151, 218, "#c9cfd4", 0.8) + li(123, 221, 151, 221, "#c9cfd4", 0.5);
  k += re(158, 186, 1.8, 50, "#5f6770") + re(152, 180, 14, 14, "#1f4fa0") + re(152, 180, 14, 14, "none", ' stroke="#fff" stroke-width=".6"') + tx(159, 191.6, 11, "U", "#fff", ' font-weight="bold"');
  k += re(152, 180, 14, 14, "#4f8fff", ` opacity=".25" filter="url(#${S.id("glow")})"`);
  teil("vr_ubahn", 136, 202, k, { tipp: "Die Treppe führt hinunter zur U-Bahn. Das blaue Schild mit dem „U“ zeigt den Eingang." });
}

/* =====================================================================
   VORNE (fängt keinen Tipp): Laternen mit Lichtschein
   ===================================================================== */
{
  let v = "";
  for (const x of [96, 248, 342]) {
    v += re(x - 0.7, 196, 1.4, 40, "#2b3138") + `<path d="M${x} 197 q0 -3 4 -3.4 h2" stroke="#2b3138" stroke-width=".9" fill="none"/>` + pl([[x + 4, 192.6], [x + 10, 192.6], [x + 9, 195], [x + 5, 195]], "#2b3138");
    v += el(x + 7, 196, 4, 1.4, "#fff3c2") + el(x + 7, 199, 9, 6, "#ffe9a0", ` opacity=".22" filter="url(#${S.id("glow")})"`);
  }
  S.davor(v);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_rand.js"));
console.log(aus);
