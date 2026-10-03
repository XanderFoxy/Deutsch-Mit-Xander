#!/usr/bin/env node
/* =====================================================================
   DAS GEWERBEGEBIET (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   Jedes Gebäude hat „lupe“ und führt in seine Szene. Wörter und
   lupe-Verweise sind die der alten Szene (szenen/viertel_gewerbe.js).

   RECHERCHE (statista „Verkaufsfläche eines typischen deutschen
   Baumarkts“, baumarktmanager „Neue Märkte national“, Rheinpfalz
   „Baumarkt soll öffnen“) — so sieht ein deutsches Gewerbegebiet aus:
   - Große flache HALLEN aus Trapezblech/Sandwichplatten an einer
     Erschließungsstraße, davor große PARKPLÄTZE mit Einkaufswagen-Boxen.
   - BAUMARKT (Verkaufsfläche oft 8 000–12 000 m²) mit Gartencenter
     hinter einem Zaun, Paletten mit Blumenerde vor der Tür.
   - FACHMARKTZENTRUM: eine lange Ladenzeile mit mehreren Fachmärkten
     nebeneinander, jeder mit eigenem Schild — hier Elektro/Technik,
     Küchenstudio, Büro &amp; Schule, Spielwaren, Musikhaus.
   - GETRÄNKEMARKT mit gestapelten Kästen und Leergut-Annahme; vorne
     liefert ein Getränkelaster (Planenaufbau) Kästen an.
   - AUTOHAUS mit Glas-Ausstellungsraum und Fahnen; KFZ-WERKSTATT mit
     Sektionaltoren und Hebebühne; SCHREINEREI (Werkstatt) mit Holzlager;
     FAHRRADLADEN mit Rädern vor der Tür.
   - TANKSTELLE: Dach über den Zapfsäulen, Shop, Preismast (Super E10,
     Super E5, Diesel).
   - WERTSTOFFHOF: offene Container für Holz, Metall, Papier/Pappe und
     Kunststoff, Altglas — hier landen die Materialien.
   Maßstab: Augenhöhe y = 70 (≈ 16 m, Blick von einem Parkdeck). Hintere
   Hallen (Fuß y 136) ≈ 4 Einheiten je Meter, vordere Reihe (Fuß y 236)
   ≈ 10, ganz vorne (y 290) ≈ 14.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;

const S = neueSzene({ id: "viertel_gewerbe", titel: "Das Gewerbegebiet", emoji: "🏭", thema: "Stadt", kuerzel: "b29b", fassung: 852, breite: 400, hoehe: 300 });
const rnd = zufall(2922);
const r = B.r;
const HOR = 70, VPX = 200;

const WORT = {
  vg_baumarkt: ["der Baumarkt","BAU-markt","il negozio di bricolage","ne-GO-zio di bri-co-LA-ge","DIY store","baumarkt"],
  vg_getraenkemarkt: ["der Getränkemarkt","Ge-TRÄN-ke-markt","il negozio di bevande","ne-GO-zio di be-VAN-de","drinks market","getraenkemarkt"],
  vg_getraenke: ["die Getränke","Ge-TRÄN-ke","le bevande","be-VAN-de","drinks","getraenke"],
  vg_tankstelle: ["die Tankstelle","TANK-stel-le","il distributore","di-stri-bu-TO-re","petrol station","tankstelle"],
  vg_autowerkstatt: ["die Autowerkstatt","AU-to-werk-statt","l'officina","of-fi-CI-na","garage","autowerkstatt"],
  vg_fahrradladen: ["der Fahrradladen","FAHR-rad-la-den","il negozio di biciclette","ne-GO-zio di bi-ci-CLET-te","bike shop","fahrradladen"],
  vg_werkstatt: ["die Werkstatt","WERK-statt","il laboratorio","la-bo-ra-TO-rio","workshop","werkstatt"],
  vg_fahrzeuge: ["die Fahrzeuge","FAHR-zeu-ge","i veicoli","ve-I-co-li","vehicles","fahrzeuge"],
  vg_technik: ["die Technik","TECH-nik","la tecnica","TEC-ni-ca","technology","technik"],
  vg_materialien: ["die Materialien","Ma-te-ri-A-li-en","i materiali","ma-te-RIA-li","materials","materialien"],
  vg_kuechengeraete: ["die Küchengeräte","KÜ-chen-ge-rä-te","gli elettrodomestici","e-let-tro-do-ME-sti-ci","appliances","kuechengeraete"],
  vg_schulsachen: ["die Schulsachen","SCHUL-sa-chen","il materiale scolastico","ma-te-RIA-le sco-LA-sti-co","school supplies","schulsachen"],
  vg_spielzeug: ["das Spielzeug","SPIEL-zeug","i giocattoli","gio-CAT-to-li","toys","spielzeug"],
  vg_instrumente: ["die Instrumente","In-stru-MEN-te","gli strumenti","stru-MEN-ti","instruments","instrumente"],
  /* neu dazu (ohne Lupe) */
  vg_windrad: ["das Windrad","WIND-rad","la pala eolica","PA-la e-O-li-ca","wind turbine"],
  vg_parkplatz: ["der Parkplatz","PARK-platz","il parcheggio","par-CHEG-gio","car park"],
  vg_einkaufswagen: ["der Einkaufswagen","EIN-kaufs-wa-gen","il carrello della spesa","car-REL-lo del-la SPE-sa","shopping trolley"],
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
  const o = { id, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], x, y, steht: true, kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${kunst}</g>` };
  if (w[5]) o.lupe = w[5];
  S.teil(Object.assign(o, extra));
}
/* Auto von der Seite (Fußpunkt Mitte, Länge l), Farbe f, nach links (dir −1) oder rechts */
function auto(cx, fy, l, f, dir = 1) {
  const h = l * 0.3, w = l / 2;
  const P = (x, y) => `${r(cx + x * dir * w)} ${r(fy - y * h)}`;
  let s = schatten(cx, fy, w * 1.05, l * 0.03 + 0.4, 0.35);
  s += `<path d="M${P(-1, 0.18)} L${P(-1, 0.55)} Q${P(-0.98, 0.62)} ${P(-0.8, 0.64)} L${P(-0.48, 0.66)} L${P(-0.26, 1)} L${P(0.42, 1)} L${P(0.68, 0.64)} L${P(0.96, 0.58)} Q${P(1, 0.5)} ${P(1, 0.35)} L${P(1, 0.18)} Z" fill="${f}"/>`;
  s += `<path d="M${P(-0.4, 0.66)} L${P(-0.22, 0.94)} L${P(0.06, 0.94)} L${P(0.06, 0.66)} Z M${P(0.12, 0.66)} L${P(0.12, 0.94)} L${P(0.38, 0.94)} L${P(0.58, 0.66)} Z" fill="${LG("autoglas", [[0, "#cfe3f0"], [1, "#5d7f99"]])}"/>`;
  s += `<path d="M${P(-1, 0.5)} L${P(1, 0.5)}" stroke="#fff" stroke-width="${r(l * 0.012)}" opacity=".35"/>`;
  for (const t of [-0.62, 0.62]) s += ci(cx + t * w, fy - h * 0.16, h * 0.24, "#1c1f22") + ci(cx + t * w, fy - h * 0.16, h * 0.12, "#a9b0b6");
  s += re(cx + dir * w * 0.94 - (dir > 0 ? l * 0.03 : 0), fy - h * 0.48, l * 0.03, h * 0.1, "#fff3c4");
  return s;
}
/* Trapezblech-Fassade */
function blech(x, y, w, h, f, schritt = 2) {
  let s = re(x, y, w, h, f);
  for (let i = x + schritt / 2; i < x + w; i += schritt) s += li(i, y, i, y + h, "#000", 0.25, ' opacity=".12"');
  return s;
}

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
const STAHL = LG("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS = LG("glas", [[0, "#c3dbea"], [0.55, "#86a9c2"], [1, "#5b7a92"]]);
const ASPHALT = LG("asphalt", [[0, "#7a7e82"], [1, "#5d6165"]]);

/* =====================================================================
   KULISSE — Himmel, Felder, Windräder, Parkplatz, Straßen
   ===================================================================== */
S.hinten(re(0, 0, 400, 140, LG("himmel", [[0, "#6b9ed3"], [0.7, "#b4d0e8"], [1, "#e6eff3"]])));
S.hinten(ci(60, 16, 60, RG("sonne", [[0, "#fff8dc", 0.6], [1, "#fff8dc", 0]])));
{
  let w = "";
  for (const [x, y, s] of [[110, 20, 0.9], [240, 14, 1.1], [350, 34, 0.8], [30, 44, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4, 7, 4.5]]) w += el(x + dx * s, y + dy * s, rx * s, ry * s, "#fff");
    w += `</g>`;
  }
  S.hinten(w);
}
/* Felder und Hügel bis zum Horizont, Autobahn mit Lärmschutzwand */
{
  let f = `<path d="M0 72 Q60 62 120 70 T260 66 T400 70 V140 H0 Z" fill="${LG("huegel", [[0, "#9db884"], [1, "#7f9f68"]])}"/>`;
  f += `<path d="M0 78 Q100 74 200 80 T400 78 V140 H0 Z" fill="#c9c08a" opacity=".55"/>`;
  for (let i = 0; i < 9; i++) f += li(i * 50 - 20, 84, i * 50 + 40, 100, "#a59c62", 0.4, ' opacity=".5"');
  f += re(0, 96, 400, 3, "#8e9599") + re(0, 94.4, 400, 1.6, "#6d8a73");
  /* ferne Industrie: Silo und Schornstein */
  f += re(372, 74, 6, 22, "#b7bec4") + re(380, 80, 8, 16, "#c5cbd0") + el(384, 80, 4, 1.2, "#d6dbdf") + re(362, 68, 2.4, 28, "#a7aeb4") + re(361.6, 70, 3.2, 1.4, "#c0392b");
  S.hinten(f);
}
/* Parkplatz vor der hinteren Reihe, Erschließungsstraße, Vorplätze vorne */
{
  let g = re(0, 99, 400, 37, LG("wiese", [[0, "#8aab6c"], [1, "#78985c"]]));
  g += re(0, 170, 400, 2, "#d9d5cc") + re(0, 172, 400, 16, LG("strasse", [[0, "#6a6e72"], [1, "#55595d"]]));
  for (let x = 6; x < 400; x += 20) g += re(x, 179.4, 10, 0.9, "#ecebe5");
  g += re(0, 188, 400, 2.2, "#d9d5cc") + re(0, 190.2, 400, 110, LG("hof", [[0, "#b9b5ad"], [1, "#a29e96"]]));
  for (let i = 0; i < 200; i++) g += ci(rnd() * 400, 192 + rnd() * 108, 0.2 + rnd() * 0.3, rnd() < 0.5 ? "#c9c5bd" : "#8f8b84", ' opacity=".5"');
  S.hinten(g);
}

/* =====================================================================
   WINDRÄDER (ein Teil, ohne Lupe)
   ===================================================================== */
{
  let k = "";
  for (const [x, fy, h, a] of [[290, 84, 44, 12], [326, 80, 36, 52], [20, 80, 32, 80]]) {
    k += `<path d="M${x - 1} ${fy} L${x - 0.5} ${fy - h} L${x + 0.5} ${fy - h} L${x + 1} ${fy} Z" fill="${STAHL}"/>` + re(x - 1.6, fy - h - 1.2, 4.6, 2.4, "#e3e7ea");
    for (let i = 0; i < 3; i++) { const w = (a + i * 120) * Math.PI / 180; k += `<path d="M${x} ${fy - h} L${r(x + Math.cos(w - 0.08) * 3)} ${r(fy - h + Math.sin(w - 0.08) * 3)} L${r(x + Math.cos(w) * h * 0.55)} ${r(fy - h + Math.sin(w) * h * 0.55)} Z" fill="#f2f4f5" stroke="#c9cfd4" stroke-width=".2"/>`; }
    k += ci(x, fy - h, 1, "#dfe3e6");
  }
  teil("vg_windrad", 306, 50, k, { tipp: "Windräder machen aus Wind Strom." });
}

/* =====================================================================
   HINTERE REIHE (Fuß y 136): Baumarkt, Fachmarktzentrum, Getränkemarkt
   ===================================================================== */
{
  const X0 = 2, X1 = 150, T = 98;
  let k = pl([[X0, T], [X1, T], [X1 - 3, T - 3], [X0 + 3, T - 3]], "#9aa1a6");
  k += blech(X0, T, X1 - X0, 136 - T, LG("bmblech", [[0, "#d7dadc"], [1, "#b9bec1"]]));
  k += re(X0, T, X1 - X0, 10, LG("bmband", [[0, "#f28c28"], [1, "#d96f12"]]));
  k += tx(58, T + 8, 8.4, "BAUMARKT", "#fff", ' font-weight="bold" letter-spacing=".8"') + tx(122, T + 6.6, 3.2, "Haus · Garten · Werkzeug", "#fff");
  /* Eingang mit Glasschiebetür und Vordach */
  k += re(36, 116, 34, 20, "#4a5157") + re(37, 117, 32, 19, GLAS) + li(53, 117, 53, 136, "#4a5157", 0.6) + re(33, 113.4, 40, 2.8, "#d96f12");
  k += tx(53, 115.4, 2, "EINGANG", "#fff");
  /* Werbebanner und Lieferrampe */
  k += re(80, 113, 22, 12, "#fff") + tx(91, 118, 3, "Farben", "#d96f12", ' font-weight="bold"') + tx(91, 122, 2.4, "−20 %", "#c0262d", ' font-weight="bold"');
  k += re(6, 120, 22, 16, "#7a8288") + li(6, 124, 28, 124, "#5f676c", 0.4) + li(6, 128, 28, 128, "#5f676c", 0.4) + li(6, 132, 28, 132, "#5f676c", 0.4) + tx(17, 118.6, 2, "Baustoffe", "#5f676c");
  /* Gartencenter mit Zaun, Pflanzen und Erde-Paletten */
  k += re(106, 112, 44, 24, LG("gcglas", [[0, "#e4f0e6"], [1, "#b7d2bc"]])) + tx(128, 116, 2.8, "Gartencenter", "#2e7d32", ' font-weight="bold"');
  for (let i = 0; i < 7; i++) k += ci(110 + i * 6, 128 + (i % 2), 3 + (i % 3) * 0.6, ["#5d9c47", "#79b04f", "#4f8a3c"][i % 3]) + ci(110 + i * 6 + 1, 126.6, 0.8, ["#e63946", "#ffd23f", "#f06292"][i % 3]);
  for (let x = 106; x <= 150; x += 2) k += li(x, 124, x, 136, "#2e5e3a", 0.3);
  k += re(106, 124, 44, 0.6, "#2e5e3a");
  k += re(76, 130, 10, 6, "#8a6a40") + re(76, 128, 10, 2, "#c99a5a") + re(88, 130, 10, 6, "#3f6b3a") + tx(93, 134, 1.6, "Erde", "#fff");
  teil("vg_baumarkt", 18, 108, k, { tipp: "Im Baumarkt gibt es Werkzeug, Farbe, Holz und Pflanzen." });
}
/* Fachmarktzentrum: fünf Läden nebeneinander */
const FM = { x0: 154, w: 36, top: 104 };
S.hinten(re(FM.x0 - 1, FM.top - 4, FM.w * 5 + 2, 4, "#8c9398"));
function laden(i, name, farbe, schrift, inhalt) {
  const x = FM.x0 + i * FM.w, T = FM.top;
  let k = blech(x, T, FM.w, 136 - T, LG("fmblech", [[0, "#e5e6e4"], [1, "#c9ccc9"]]), 2.4);
  k += re(x + 1.5, T + 1.5, FM.w - 3, 8, farbe) + tx(x + FM.w / 2, T + 7.2, 4.2, schrift, "#fff", ' font-weight="bold"');
  k += re(x + 2, T + 12, FM.w - 4, 24, "#3f464b") + re(x + 3, T + 13, FM.w - 6, 23, LG("fmglas", [[0, "#e9f1f5"], [1, "#b9ccd8"]]));
  k += inhalt(x + 3, T + 13);
  k += pl([[x + 3, T + 30], [x + 13, T + 13], [x + 17, T + 13], [x + 3, T + 36]], "#fff", ' opacity=".15"');
  k += li(x, T, x, 136, "#9aa1a6", 0.5);
  return k;
}
{
  const inhalt = (x, y) => { let g = ""; for (const [dx, dy, w, h] of [[2, 3, 13, 8], [17, 4, 11, 7], [3, 13, 9, 6], [14, 14, 13, 7]]) g += re(x + dx, y + dy, w, h, "#1d2226") + re(x + dx + 0.6, y + dy + 0.6, w - 1.2, h - 1.2, LG("tv", [[0, "#4fb3e8"], [0.5, "#7b5fd6"], [1, "#e85f9c"]], 0, 0, 1, 1)); return g + re(x + 2, y + 21, 26, 2, "#9aa1a6"); };
  teil("vg_technik", FM.x0 + 9, 128, laden(0, "technik", "#c0262d", "TECHNIK", inhalt), { tipp: "Im Elektromarkt gibt es Fernseher, Handys und Computer." });
}
{
  const inhalt = (x, y) => re(x + 1, y + 6, 28, 3, "#fbfaf6") + re(x + 1, y + 13, 28, 9, "#fbfaf6") + re(x + 1, y + 12, 28, 1, "#6b5a48") + re(x + 9, y + 15, 9, 6, "#2b2f33") + re(x + 10, y + 16, 7, 4, "#45505a") + re(x + 21, y + 4, 7, 18, STAHL) + re(x + 10, y + 10.4, 6, 1.4, "#222") + li(x + 8, y + 13, x + 8, y + 22, "#ccc", 0.3) + li(x + 19, y + 13, x + 19, y + 22, "#ccc", 0.3);
  teil("vg_kuechengeraete", FM.x0 + FM.w + 9, 128, laden(1, "kueche", "#2a7f62", "KÜCHEN", inhalt), { tipp: "Im Küchenstudio stehen Herd, Kühlschrank und Spülmaschine zur Ansicht." });
}
{
  const inhalt = (x, y) => re(x + 3, y + 8, 8, 10, "#2a6fb4") + re(x + 4, y + 9, 6, 3, "#ffd23f") + `<path d="M${x + 4} ${y + 8} q3 -3 6 0" stroke="#1d4f82" stroke-width=".8" fill="none"/>` + re(x + 14, y + 12, 5, 7, "#e63946") + re(x + 19.6, y + 12, 5, 7, "#2a9d8f") + re(x + 25, y + 12, 4, 7, "#ffd23f") + li(x + 15, y + 6, x + 27, y + 2, "#f4a261", 1.4) + re(x + 1, y + 19, 28, 3, "#b98552");
  teil("vg_schulsachen", FM.x0 + 2 * FM.w + 9, 128, laden(2, "buero", "#2a6fb4", "BÜRO &amp; SCHULE", inhalt), { tipp: "Vor dem Schulanfang kauft man hier Schulranzen, Hefte und Stifte." });
}
{
  const inhalt = (x, y) => ci(x + 7, y + 12, 4, "#b07a45") + ci(x + 4.4, y + 8.6, 1.6, "#b07a45") + ci(x + 9.6, y + 8.6, 1.6, "#b07a45") + el(x + 7, y + 18, 4.4, 3.6, "#b07a45") + ci(x + 20, y + 16, 4, "#e63946") + `<path d="M${x + 16} ${y + 16} h8" stroke="#fff" stroke-width=".6"/>` + re(x + 14, y + 4, 4, 4, "#ffd23f") + re(x + 18.4, y + 4, 4, 4, "#2a9d8f") + re(x + 16.2, y + 0.4, 4, 4, "#e76f51") + re(x + 1, y + 21, 28, 2, "#9b5de5");
  teil("vg_spielzeug", FM.x0 + 3 * FM.w + 9, 128, laden(3, "spiel", "#f4a100", "SPIELWELT", inhalt), { tipp: "Im Spielwarenladen gibt es Teddys, Bälle und Bausteine." });
}
{
  const inhalt = (x, y) => `<path d="M${x + 6} ${y + 20} q-4 -1 -3 -5 q1 -3 3 -3 q-1 -3 2 -4 q3 1 2 4 q2 0 3 3 q1 4 -3 5 Z" fill="#c8742c"/>` + ci(x + 7.4, y + 15.4, 1.1, "#3b2412") + re(x + 7, y + 1, 1, 10, "#3b2412") + el(x + 21, y + 17, 6, 2, "#c0392b") + re(x + 15, y + 15, 12, 5, "#e74c3c") + el(x + 21, y + 15, 6, 2, "#f3f0ea") + ci(x + 25, y + 7, 3, "#d9a520") + li(x + 25, y + 4, x + 25, y + 10, "#8a6a10", 0.4) + re(x + 1, y + 21, 28, 2, "#3b2412");
  teil("vg_instrumente", FM.x0 + 4 * FM.w + 9, 128, laden(4, "musik", "#3b2a63", "MUSIKHAUS", inhalt), { tipp: "Im Musikhaus kann man Gitarren und Schlagzeuge ausprobieren." });
}
{
  const X0 = 338, X1 = 398, T = 106;
  let k = blech(X0, T, X1 - X0, 136 - T, LG("gmblech", [[0, "#dfe6ea"], [1, "#c1ccd2"]]));
  k += re(X0, T, X1 - X0, 9, LG("gmband", [[0, "#1f6fb2"], [1, "#16558a"]])) + tx((X0 + X1) / 2, T + 6.4, 4.6, "GETRÄNKEMARKT", "#fff", ' font-weight="bold"');
  k += re(X0 + 4, 120, 18, 16, "#4a5157") + re(X0 + 5, 121, 16, 15, GLAS);
  /* Kästen gestapelt (rot, grün, gelb, blau) und Leergut-Schild */
  const kisten = ["#c0392b", "#2e8b57", "#f2b632", "#2a6fb4", "#c0392b", "#2e8b57"];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) { const x = X0 + 26 + i * 6.2, y = 136 - (j + 1) * 4.2; if (j === 2 && i > 2) continue; k += re(x, y, 5.8, 4, kisten[(i + j) % 6]) + re(x + 0.6, y + 0.5, 4.6, 1, "#000", ' opacity=".25"'); for (let b = 0; b < 3; b++) k += re(x + 0.8 + b * 1.6, y - 1.2, 0.9, 1.4, "#3d6b3a"); }
  k += re(X0 + 44, 117, 13, 4.4, "#fff") + tx(X0 + 50.5, 120.2, 2.4, "Leergut", "#1f6fb2", ' font-weight="bold"');
  teil("vg_getraenkemarkt", X0 + 10, 112, k, { tipp: "Im Getränkemarkt kauft man Wasser und Saft in Kästen und bringt das Leergut zurück." });
}
/* Parkplatz mit Stellplätzen und parkenden Autos (ein Teil, ohne Lupe) */
{
  let k = re(0, 136, 400, 34, ASPHALT);
  for (let i = 0; i < 160; i++) k += ci(rnd() * 400, 137 + rnd() * 32, 0.15 + rnd() * 0.2, rnd() < 0.5 ? "#8c9094" : "#55595d", ' opacity=".6"');
  for (let x = 4; x < 400; x += 11) k += li(x, 152, VPX + (x - VPX) * 1.08, 168, "#f2f2ee", 0.45);
  k += re(0, 151.6, 400, 0.5, "#f2f2ee");
  for (const [x, f] of [[38, "#c0392b"], [71, "#e9ecef"], [104, "#2c3e50"], [170, "#2a6fb4"], [214, "#7f8c8d"], [247, "#f2f2ee"], [302, "#2e8b57"], [357, "#c0392b"], [379, "#34495e"]]) k += auto(x, 166, 20, f, x % 2 ? 1 : -1);
  k += pl([[124, 152], [148, 152], [149, 143], [123, 143]], "none", ' stroke="#2e7d32" stroke-width=".5"');
  teil("vg_parkplatz", 140, 158, k, { tipp: "Vor den großen Märkten ist ein großer Parkplatz." });
}
{
  /* Einkaufswagen-Box mit Wagen */
  let k = re(122, 141, 28, 1, "#2e7d32") + re(122, 141, 1, 10, "#2e7d32") + re(149, 141, 1, 10, "#2e7d32") + pl([[122, 140.4], [150, 140.4], [148, 138], [124, 138]], "#4caf50");
  for (let i = 0; i < 5; i++) { const x = 125 + i * 4.4; k += pl([[x, 143], [x + 6, 143], [x + 5, 148], [x + 1, 148]], "none", ' stroke="#c9cfd4" stroke-width=".5"') + li(x + 1, 148, x + 1, 150, "#9aa3aa", 0.4) + ci(x + 1, 150.4, 0.6, "#333") + ci(x + 5, 150.4, 0.6, "#333"); }
  teil("vg_einkaufswagen", 147, 135, k, { oben: true, tipp: "Für den Einkaufswagen braucht man oft eine Münze oder einen Chip." });
}

/* =====================================================================
   VORDERE REIHE (Fuß y 236): Autohaus, Kfz-Werkstatt, Schreinerei,
   Fahrradladen; links die Tankstelle mit Shop
   ===================================================================== */
{
  const X0 = 122, X1 = 212, T = 186;
  let k = re(X0, T, X1 - X0, 50, "#e9ecee") + re(X0, T, X1 - X0, 9, "#1d2a35") + tx((X0 + X1) / 2, T + 6.6, 5.4, "AUTOHAUS KRÜGER", "#fff", ' font-weight="bold" letter-spacing=".4"');
  k += re(X0 + 3, T + 12, X1 - X0 - 6, 38, LG("ahglas", [[0, "#dfecf3"], [1, "#a9c3d3"]]));
  k += re(X0 + 3, T + 46, X1 - X0 - 6, 4, "#d6d9db");
  k += auto(X0 + 24, T + 47, 34, "#c0392b", 1) + auto(X0 + 64, T + 47, 34, "#e9ecef", -1);
  k += re(X0 + 36, T + 16, 18, 6, "#fff") + tx(X0 + 45, T + 20.2, 2.8, "Neuwagen", "#c0262d", ' font-weight="bold"');
  for (let x = X0 + 3; x <= X1 - 3; x += 14.3) k += re(x - 0.6, T + 12, 1.2, 38, "#5b6670");
  k += pl([[X0 + 3, T + 36], [X0 + 26, T + 12], [X0 + 34, T + 12], [X0 + 3, T + 46]], "#fff", ' opacity=".18"');
  /* Fahnenmasten */
  for (const [x, c] of [[X0 + 4, "#c0392b"], [X1 - 4, "#1d2a35"]]) k += re(x - 0.4, T - 26, 0.8, 76, "#c9cfd4") + `<path d="M${x + 0.4} ${T - 25} h7 v14 q-3.5 -2 -7 0 Z" fill="${c}"/>`;
  teil("vg_fahrzeuge", X0 + 14, 214, k, { tipp: "Im Autohaus stehen neue Fahrzeuge zum Kaufen." });
}
{
  const X0 = 216, X1 = 282, T = 190;
  let k = pl([[X0, T], [X1, T], [X1 - 2, T - 3], [X0 + 2, T - 3]], "#7d868d") + blech(X0, T, X1 - X0, 46, LG("kfzblech", [[0, "#9fb3c4"], [1, "#7c93a6"]]));
  k += re(X0 + 3, T + 2, X1 - X0 - 6, 7, "#fff") + tx((X0 + X1) / 2, T + 6.6, 4, "KFZ-WERKSTATT", "#1f3c5a", ' font-weight="bold"') + tx((X0 + X1) / 2, T + 8.6, 1.6, "Meisterbetrieb · Reifen · TÜV", "#555");
  /* linkes Tor zu (Sektionaltor), rechtes Tor offen mit Auto auf der Hebebühne */
  k += re(X0 + 4, T + 13, 26, 33, "#e3e7ea");
  for (let y = T + 16.6; y < T + 46; y += 3.6) k += li(X0 + 4, y, X0 + 30, y, "#aab3ba", 0.5);
  k += re(X0 + 34, T + 13, 28, 33, LG("halle", [[0, "#3a4045"], [1, "#565d63"]]));
  k += re(X0 + 37, T + 34, 1.4, 12, "#e0b400") + re(X0 + 57.6, T + 34, 1.4, 12, "#e0b400") + re(X0 + 36, T + 33, 24, 1.4, "#e0b400");
  k += auto(X0 + 48, T + 33, 22, "#2a6fb4", 1);
  k += re(X0 + 34, T + 12.4, 28, 1.4, "#aab3ba");
  /* Reifenstapel */
  for (let i = 0; i < 4; i++) k += el(X1 + 2, T + 44 - i * 2.6, 3.6, 1.3, "#1c1f22") + el(X1 + 2, T + 44 - i * 2.6, 1.6, 0.6, "#555");
  teil("vg_autowerkstatt", X0 + 14, 214, k, { tipp: "In der Autowerkstatt wird das Auto repariert und zum TÜV vorbereitet." });
}
{
  const X0 = 288, X1 = 340, T = 192;
  let k = pl([[X0 - 2, T], [X1 + 2, T], [X1 - 1, T - 3], [X0 + 1, T - 3]], "#6d4a2a");
  k += re(X0, T, X1 - X0, 44, LG("holzfass", [[0, "#c79a5e"], [1, "#a37a45"]]));
  for (let x = X0 + 2; x < X1; x += 3) k += li(x, T, x, T + 44, "#7a5530", 0.35, ' opacity=".6"');
  k += re(X0 + 3, T + 3, X1 - X0 - 6, 6.6, "#3b2a1a") + tx((X0 + X1) / 2, T + 7.8, 3.6, "SCHREINEREI", "#f2d39a", ' font-weight="bold"');
  /* offenes Tor: Werkbank, Säge, Bretter */
  k += re(X0 + 6, T + 14, 30, 30, LG("innen", [[0, "#5a4632"], [1, "#7d6448"]]));
  k += re(X0 + 9, T + 32, 22, 2, "#c99a5a") + re(X0 + 10, T + 34, 1.2, 10, "#8a6a40") + re(X0 + 28, T + 34, 1.2, 10, "#8a6a40");
  k += ci(X0 + 19, T + 30, 3.4, STAHL) + ci(X0 + 19, T + 30, 1, "#555");
  for (let i = 0; i < 6; i++) k += re(X0 + 8, T + 16 + i * 2, 26, 1.2, i % 2 ? "#d7b07a" : "#c59a62");
  /* Holzstapel draußen */
  for (let j = 0; j < 4; j++) k += re(X0 + 38, T + 42 - j * 2.4, 12, 2.2, j % 2 ? "#e0bb84" : "#cfa56c") + ci(X0 + 38.8, T + 43.1 - j * 2.4, 0.7, "#9e7443");
  teil("vg_werkstatt", X0 + 12, 214, k, { tipp: "In der Werkstatt baut der Schreiner Möbel aus Holz." });
}
{
  const X0 = 344, X1 = 398, T = 196;
  let k = re(X0, T, X1 - X0, 40, "#f3efe6") + re(X0, T, X1 - X0, 8, "#2e8b57") + tx((X0 + X1) / 2, T + 5.8, 4, "Fahrrad Becker", "#fff", ' font-weight="bold"');
  k += re(X0 + 3, T + 11, 30, 22, "#3b4248") + re(X0 + 4, T + 12, 28, 21, GLAS) + re(X0 + 36, T + 11, 14, 25, "#3b4248") + re(X0 + 37, T + 12, 12, 24, LG("ftuer", [[0, "#d4e8f2"], [1, "#8db3c9"]]));
  k += re(X0 + 37, T + 14, 12, 4, "#fff") + tx(X0 + 43, T + 16.8, 2.2, "Service", "#2e8b57", ' font-weight="bold"');
  /* Räder vor dem Laden */
  const rad = (x, y, c) => ci(x, y, 3.6, "none", ' stroke="#222" stroke-width=".7"') + ci(x + 10, y, 3.6, "none", ' stroke="#222" stroke-width=".7"') + `<path d="M${x} ${y} l4 -5 h5 l1 5 M${x + 4} ${y - 5} l-.8 -1.6 M${x + 9} ${y - 5} l.4 -2 h1.6 M${x + 4} ${y} l5 -5" stroke="${c}" stroke-width=".8" fill="none"/>`;
  k += rad(X0 + 2, 233, "#c0392b") + rad(X0 + 16, 233.6, "#2a6fb4") + rad(X0 + 30, 234, "#2b2b2b");
  k += re(X0 + 6, T + 16, 22, 1, "#666");
  teil("vg_fahrradladen", X0 + 12, 214, k, { tipp: "Im Fahrradladen kauft man Räder und lässt sie reparieren." });
}
{
  /* Tankstelle: Shop hinten, Dach über den Zapfsäulen, Preismast */
  let k = re(48, 204, 68, 32, "#eef0f1") + re(48, 204, 68, 6, "#2e7d32") + tx(82, 208.6, 3.6, "SHOP · BISTRO · 24 h", "#fff", ' font-weight="bold"');
  k += re(52, 213, 40, 20, GLAS) + re(96, 213, 16, 23, LG("ftuer", [[0, "#d4e8f2"], [1, "#8db3c9"]])) + re(56, 216, 10, 6, "#ffd23f") + tx(61, 220, 2, "Kaffee", "#7a4a00");
  /* Waschanlage-Schild */
  k += re(4, 214, 40, 22, "#cfd5da") + re(8, 218, 32, 18, "#2a3b4a") + tx(24, 216.8, 2.2, "Waschanlage", "#2e7d32", ' font-weight="bold"');
  for (let i = 0; i < 4; i++) k += re(12 + i * 7, 219, 2, 16, i % 2 ? "#e63946" : "#2a6fb4", ' opacity=".7"');
  /* Zapfsäulen-Inseln */
  const saeule = (x) => re(x - 7, 260, 14, 2.6, "#d0d4d6") + re(x - 4, 240, 8, 20, LG("zapf", [[0, "#ffffff"], [1, "#d4d8da"]], 0, 0, 1, 0)) + re(x - 4, 240, 8, 3.4, "#2e7d32") + re(x - 3, 245, 6, 4, "#1d2226") + tx(x, 248, 1.8, "88,40", "#7cff8a", ' font-family="monospace"') + re(x - 5.6, 251, 1.6, 6, "#333") + re(x + 4, 251, 1.6, 6, "#222") + `<path d="M${x + 5.6} 252 q3 3 1 8" stroke="#222" stroke-width=".5" fill="none"/>`;
  k += saeule(30) + saeule(78);
  k += auto(52, 262, 30, "#2a6fb4", 1);
  /* Dach mit Stützen */
  k += re(16, 206, 3, 56, STAHL) + re(98, 206, 3, 56, STAHL);
  k += pl([[4, 196], [114, 196], [110, 192], [8, 192]], "#dfe3e6") + re(4, 196, 110, 9, LG("dach", [[0, "#ffffff"], [1, "#dfe3e6"]])) + re(4, 199, 110, 3, "#2e7d32") + re(4, 204.6, 110, 1.2, "#fff6c9");
  k += tx(59, 201.8, 2.6, "TANKSTELLE", "#fff", ' font-weight="bold" letter-spacing="1"');
  /* Preismast */
  k += re(-1, 216, 3, 76, "#5f676c");
  k += re(0, 216, 20, 32, "#1d2a35") + re(1, 217, 18, 6, "#2e7d32") + tx(10, 221.4, 3, "TANKEN", "#fff", ' font-weight="bold"');
  for (const [i, n, p] of [[0, "Super E10", "1,72"], [1, "Super E5", "1,78"], [2, "Diesel", "1,64"]]) k += tx(6, 228 + i * 7, 2, n, "#fff") + `<text x="18" y="${r(229.6 + i * 7)}" font-size="3.6" text-anchor="end" fill="#ffd23f" font-family="monospace" font-weight="bold">${p}</text>`;
  teil("vg_tankstelle", 59, 214, k, { tipp: "An der Tankstelle tankt man Benzin oder Diesel und bezahlt im Shop." });
}

/* =====================================================================
   VORNE — Getränkelaster, Wertstoffhof
   ===================================================================== */
{
  let k = schatten(186, 288, 58, 2.4, 0.35);
  /* Fahrerhaus links, Planenaufbau mit offener Seite: Kästen */
  k += `<path d="M128 284 v-22 q0 -4 3 -6 l5 -8 q1.6 -2 4 -2 h8 v38 Z" fill="${LG("lkw", [[0, "#ececec"], [1, "#c9cdd0"]])}"/>` + `<path d="M132 258 l5 -8 q1 -1.6 3 -1.6 h6 v9.6 Z" fill="${LG("lscheibe", [[0, "#cfe6f5"], [1, "#6f9ab8"]])}"/>` + re(128, 278, 20, 6, "#2c3439") + re(129, 270, 3, 3, "#ffe9a8");
  k += re(149, 238, 94, 44, "#2a6fb4") + re(149, 238, 94, 6, "#1f5591") + tx(196, 242.6, 3.4, "Getränke-Lieferdienst · frisch &amp; kalt", "#fff", ' font-weight="bold"');
  const farben = ["#c0392b", "#2e8b57", "#f2b632", "#2a6fb4", "#e67e22", "#2c3e50"];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 10; i++) {
    const x = 152 + i * 9, y = 279 - (j + 1) * 8.4;
    k += re(x, y, 8.6, 8, farben[(i * 3 + j) % 6]) + re(x + 0.8, y + 1, 7, 2.2, "#000", ' opacity=".22"');
    for (let b = 0; b < 4; b++) k += re(x + 0.9 + b * 1.9, y - 1.6, 1.1, 2, ["#5a8f4e", "#c96f1b", "#d9e4ea", "#3b2a1a"][(i + j) % 4]);
  }
  k += re(146, 280, 100, 4, "#2c3439");
  for (const x of [140, 205, 226]) k += ci(x, 286, 5.4, "#1c1f22") + ci(x, 286, 2.6, "#9aa3aa");
  teil("vg_getraenke", 170, 252, k, { tipp: "Der Lastwagen bringt Kästen mit Wasser, Saft, Limo und Bier." });
}
{
  const X0 = 252, X1 = 400;
  let k = pl([[X0, 246], [X1, 246], [X1, 300], [X0 - 4, 300]], LG("schotter", [[0, "#c2beb4"], [1, "#a9a49a"]]));
  /* Zaun und Schild */
  for (let x = X0; x <= X1; x += 2.2) k += li(x, 246, x, 253, "#6d7378", 0.3);
  k += re(X0, 246, X1 - X0, 0.6, "#6d7378") + re(X0, 252.4, X1 - X0, 0.6, "#6d7378");
  k += re(X0 + 2, 236, 1, 14, "#555") + re(X0 - 2, 236, 30, 8, "#fff") + re(X0 - 2, 236, 30, 8, "none", ' stroke="#2e7d32" stroke-width=".6"') + tx(X0 + 13, 239.8, 3, "Wertstoffhof", "#2e7d32", ' font-weight="bold"') + tx(X0 + 13, 242.6, 1.6, "Di–Sa 9–17 Uhr", "#333");
  /* vier offene Container mit Schild und Inhalt */
  const cont = (x, f, name, inhalt) => {
    let g = schatten(x + 16, 292, 18, 1.6, 0.35);
    g += pl([[x, 266], [x + 32, 266], [x + 30, 292], [x + 2, 292]], f) + pl([[x, 266], [x + 32, 266], [x + 30, 292], [x + 2, 292]], LG("cschatt", [[0, "#000", 0.2], [0.4, "#fff", 0.08], [1, "#000", 0.28]], 0, 0, 1, 0));
    g += pl([[x - 0.5, 266], [x + 32.5, 266], [x + 30, 260], [x + 2, 260]], "#2a2d30") + inhalt(x);
    g += re(x - 0.5, 265.4, 33, 1.4, f);
    for (let i = 1; i < 4; i++) g += li(x + i * 8, 267, x + i * 8 - (i - 2) * 0.5, 291, "#000", 0.4, ' opacity=".18"');
    g += re(x + 6, 272, 20, 7, "#fff") + tx(x + 16, 277.2, 3.4, name, "#222", ' font-weight="bold"');
    return g;
  };
  k += cont(262, "#2e7d32", "Holz", (x) => { let g = ""; for (let i = 0; i < 6; i++) g += `<path d="M${x + 3 + i * 4} 265 l6 -${3 + (i % 3)} l1 1.4 l-6 3 Z" fill="${i % 2 ? "#c9a06a" : "#a87d45"}"/>`; return g; });
  k += cont(297, "#c0392b", "Metall", (x) => ci(x + 8, 262, 3, "none", ' stroke="#9aa3aa" stroke-width="1"') + re(x + 14, 260.4, 12, 2, "#8c949a", ' transform="rotate(-12 ' + (x + 20) + ' 261)"') + re(x + 20, 261.6, 8, 3, "#b5bcc2"));
  k += cont(332, "#2a6fb4", "Papier", (x) => { let g = ""; for (let i = 0; i < 5; i++) g += re(x + 3 + i * 5.4, 260.4 - (i % 2), 6, 4.6, i % 2 ? "#c99a5a" : "#d8b07a", ' transform="rotate(' + (i * 9 - 18) + ' ' + (x + 6 + i * 5.4) + ' 262)"'); return g; });
  k += cont(367, "#f2b632", "Plastik", (x) => ci(x + 8, 262, 2.6, "#e63946") + re(x + 13, 259.6, 5, 4, "#4fb3e8") + ci(x + 22, 262, 2.4, "#fff") + re(x + 24, 260, 4, 3, "#2a9d8f"));
  teil("vg_materialien", 270, 252, k, { tipp: "Am Wertstoffhof trennt man Holz, Metall, Papier und Kunststoff." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_gewerbe.js"));
console.log(aus);
