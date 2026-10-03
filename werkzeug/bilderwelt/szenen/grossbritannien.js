#!/usr/bin/env node
/* =====================================================================
   GROSSBRITANNIEN (FASSUNG 852) — Bilderwelt neu: London, Westminster
   ---------------------------------------------------------------------
   RECHERCHE (UK Parliament „Elizabeth Tower“, Wikipedia „Big Ben“,
   Historic England „K6 Telephone Kiosk“, TfL „New Routemaster“):
   - STANDORT: Ecke Parliament Street / Great George Street am Parliament
     Square, Blick nach Osten über die Straße und den Platz. Links der
     Elizabeth Tower („Big Ben“), rechts davon zieht sich der Palace of
     Westminster (ein Königsschloss — heute sitzt dort das Parlament) nach
     Süden bis zum Victoria Tower. Weitwinkel, Abstände leicht gestaucht.
   - ELIZABETH TOWER: 96 m, Pugin 1859, Perpendicular-Gotik aus hellem
     Anston-Kalkstein; quadratischer Schaft (12 m) mit senkrechten
     Maßwerk-Feldern, darüber die Uhrstube mit vier Zifferblättern (7 m,
     Opalglas, schwarze römische Ziffern, vergoldete Umrahmung, seit der
     Restaurierung 2017–2022 wieder preußischblau und gold), darüber die
     Glockenstube mit Spitzbogen-Öffnungen, dann der steile gusseiserne
     Turmhelm mit Gauben, Ecktürmchen, der Ayrton-Laterne und Kreuzblume.
   - PALACE OF WESTMINSTER: lange Fassade mit Strebepfeilern und Fialen,
     Spitzbogenfenster in Reihen, das große bleigraue Dach der Westminster
     Hall, der achteckige Mittelturm mit Spitze, im Süden der Victoria
     Tower (98 m) mit Ecktürmchen und der Flagge, wenn das Parlament tagt.
   - Auf dem Platz: Rasen, die Churchill-Statue (Bronze, Mantel, Stock,
     Granitsockel), Straße mit LINKSVERKEHR: Busse und Taxis fahren links,
     auf die Fahrbahn ist „LOOK RIGHT“ gemalt, rote Doppellinien (Red Route).
   - BUS: New Routemaster (seit 2012): rot, zwei Treppen mit schräg
     umlaufenden Glasbändern, Linie 12 fährt hier über Whitehall zur
     Oxford Circus. TAXI: das schwarze London-Taxi mit hohem Dach, gelbem
     „TAXI“-Schild, hinten angeschlagenen Fondtüren.
   - VORNE auf dem Gehweg: die K6-Telefonzelle (Giles Gilbert Scott 1935,
     Gusseisen, rot, Kuppeldach mit Krone, weiße Schilder „TELEPHONE“,
     acht Reihen kleiner Scheiben), der rote Briefkasten (Pillar Box mit
     Monogramm), die schwarze Westminster-Laterne, das Pub „The Red Lion“
     (Parliament Street, viktorianische Holzfront, Goldbuchstaben,
     Blumenampeln), davor ein Tisch mit Fish and Chips und Tee mit Milch,
     ein Souvenirkiosk (Königsgarde-Figur, Plüschschaf, Teddy, Schneekugel,
     Tasse, Postkarten), Tauben, eine Touristin mit Regenschirm — und eine
     Regenwolke: Londoner Wetter.
   Maßstab: Augenhöhe y = 110 (Blick von der Ecke, Kamera ≈ 3,3 m).
   Bodenpunkt in d Metern: y = 110 + 800/d, Einheiten je Meter = 242/d.
   Gehweg vorne d 9–14 (y 199–167), Fahrbahn d 14–26, Big Ben d ≈ 230.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "grossbritannien", titel: "Großbritannien", emoji: "🇬🇧", thema: "Länder", kuerzel: "b25a", fassung: 852 });
/* Verläufe nur einmal anlegen, auch wenn sie in Schleifen gebraucht werden */
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* Wortmarke: Teile, die in Bildkoordinaten gezeichnet sind, bekommen ihren Ankerpunkt in die Mitte */
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1859);
const r = B.r;
const HOR = 110;
const yAt = (d) => HOR + 800 / d;
const uAt = (d) => 242 / d;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("nass")}" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="0.5 1.6"/></filter>`);
const STEIN = S.lg("stein", [[0, "#e6d9b6"], [0.5, "#d7c79f"], [1, "#bfae86"]]);
const STEIN_V = S.lg("steinv", [[0, "#b9a982"], [0.3, "#e9ddbd"], [0.7, "#d8c9a3"], [1, "#a89770"]], 0, 0, 1, 0);
const FERN = S.lg("fern", [[0, "#ddd3b8"], [1, "#c4b897"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.35, "#f1c74a"], [0.7, "#c8921e"], [1, "#8f6210"]], 0, 0, 1, 1);
const ROT = S.lg("rot", [[0, "#e0262b"], [0.5, "#c8161c"], [1, "#9c0e13"]]);
const ROT_V = S.lg("rotv", [[0, "#a10f14"], [0.3, "#d81d23"], [0.7, "#c5161b"], [1, "#8e0b10"]], 0, 0, 1, 0);
const SCHWARZ = S.lg("lack", [[0, "#3a3d42"], [0.45, "#141518"], [1, "#050506"]]);
const GLASD = S.lg("glasd", [[0, "#6f8798"], [0.5, "#2e3d4a"], [1, "#1c2630"]]);
const HELM = S.lg("helm", [[0, "#3c4a5a"], [0.5, "#26303c"], [1, "#161c24"]], 0, 0, 1, 0);
const PUBGRUEN = S.lg("pubgruen", [[0, "#24493a"], [1, "#122a20"]]);

/* =====================================================================
   KULISSE — Himmel, Platz, Straße, Gehweg
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#7f9fbf"], [0.5, "#aebfd0"], [1, "#dfe3e6"]])}"/>`);
S.hinten(`<circle cx="60" cy="20" r="70" fill="${S.rg("licht", [[0, "#fff6dc", 0.45], [1, "#fff6dc", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s, f] of [[40, 30, 1, "#fff"], [150, 18, 0.9, "#f3f4f6"], [118, 48, 0.6, "#fff"], [190, 58, 0.7, "#e9ecef"]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4, 7, 4.5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="${f}"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2.2 * s)}" fill="#c9d0d8"/></g>`;
  }
  S.hinten(w);
}
/* ferne Dächer im Dunst hinter dem Palast (South Bank) */
{
  let c = "";
  let x = 100;
  while (x < 320) { const w = 8 + rnd() * 14, h = 3 + rnd() * 6; c += `<rect x="${r(x)}" y="${r(HOR + 2 - h)}" width="${r(w + 0.4)}" height="${r(h)}" fill="#b6bec6"/>`; x += w; }
  S.hinten(c);
}
/* Platz: Rasen mit Wegen, Randstein, ferner Gehweg */
{
  const Y0 = 114, Y1 = yAt(26);   /* Rasen bis zum fernen Bordstein */
  let f = `<rect x="0" y="${Y0}" width="320" height="${r(Y1 - Y0)}" fill="${S.lg("rasen", [[0, "#7f9a5e"], [1, "#5f8442"]])}"/>`;
  for (let i = 0; i < 90; i++) f += `<rect x="${r(rnd() * 320)}" y="${r(Y0 + rnd() * (Y1 - Y0))}" width="${r(1 + rnd() * 3)}" height=".3" fill="${rnd() < 0.5 ? "#8fae6b" : "#557a3a"}" opacity=".7"/>`;
  f += `<path d="M90 ${Y0 + 2} L60 ${r(Y1 - 3)} L74 ${r(Y1 - 3)} L96 ${Y0 + 2} Z" fill="#cfc6b2" opacity=".85"/>`;
  f += `<rect x="0" y="${r(Y0 - 0.6)}" width="320" height="1.2" fill="#8d8a80"/>`;
  f += `<rect x="0" y="${r(Y1 - 3.4)}" width="320" height="2.4" fill="${S.lg("fgehweg", [[0, "#c9c4ba"], [1, "#aba69c"]])}"/>`;
  f += `<rect x="0" y="${r(Y1 - 1.2)}" width="320" height="1.2" fill="#e2ddd2"/>`;
  S.hinten(f);
}
/* Fahrbahn: nasser Asphalt, Mittellinie, rote Doppellinien, „LOOK RIGHT“ */
{
  const Y0 = yAt(26), Y1 = yAt(14);
  let f = `<rect x="0" y="${r(Y0)}" width="320" height="${r(Y1 - Y0)}" fill="${S.lg("asphalt", [[0, "#5d6064"], [1, "#46494d"]])}"/>`;
  for (let i = 0; i < 140; i++) f += `<circle cx="${r(rnd() * 320)}" cy="${r(Y0 + rnd() * (Y1 - Y0))}" r="${r(0.15 + rnd() * 0.25)}" fill="${rnd() < 0.5 ? "#73777b" : "#383a3d"}" opacity=".6"/>`;
  /* Spiegelungen auf der nassen Fahrbahn (Bus und Himmel) */
  f += `<rect x="150" y="${r(Y0 + 1)}" width="150" height="9" fill="#b3161b" opacity=".18" filter="url(#${S.id("nass")})"/>`;
  f += `<rect x="0" y="${r(Y0)}" width="320" height="${r(Y1 - Y0)}" fill="${S.lg("glanz", [[0, "#cfd8e0", 0.18], [0.5, "#cfd8e0", 0.03], [1, "#cfd8e0", 0.12]])}"/>`;
  /* Mittellinie (gestrichelt) */
  const ym = yAt(20);
  for (let x = -4; x < 320; x += 14) f += `<rect x="${x}" y="${r(ym - 0.4)}" width="7" height=".8" fill="#e9e7e0" opacity=".85"/>`;
  /* Red Route: rote Doppellinien an beiden Bordsteinen */
  for (const [y, h] of [[Y0 + 0.9, 0.35], [Y0 + 1.6, 0.35], [Y1 - 2.4, 0.55], [Y1 - 1.3, 0.55]]) f += `<rect x="0" y="${r(y)}" width="320" height="${h}" fill="#b52a25" opacity=".9"/>`;
  /* Fußgängerüberweg: gestrichelte Querlinien und „LOOK RIGHT“ */
  for (let i = 0; i < 9; i++) { const t = i / 8, y = Y0 + 3 + t * (Y1 - Y0 - 6); f += `<rect x="${r(182 - t * 3)}" y="${r(y)}" width="${r(1 + t)}" height="${r(0.4 + t * 0.5)}" fill="#efede6"/><rect x="${r(214 + t * 6)}" y="${r(y)}" width="${r(1 + t)}" height="${r(0.4 + t * 0.5)}" fill="#efede6"/>`; }
  f += `<text x="199" y="${r(Y1 - 4)}" font-size="5.2" text-anchor="middle" fill="#f2f0ea" font-family="Arial,Helvetica,sans-serif" font-weight="bold" transform="translate(199 ${r(Y1 - 4)}) scale(1 .42) translate(-199 ${r(-(Y1 - 4))})" letter-spacing=".4">LOOK RIGHT  →</text>`;
  /* Bordstein vorne */
  f += `<rect x="0" y="${r(Y1)}" width="320" height="2" fill="${S.lg("bord", [[0, "#d8d4ca"], [1, "#9d998f"]])}"/>`;
  S.hinten(f);
}
/* Gehweg vorne: große graue Platten in Fluchtperspektive, nass */
{
  const Y0 = yAt(14) + 2;
  let f = `<rect x="0" y="${r(Y0)}" width="320" height="${r(200 - Y0)}" fill="${S.lg("platten", [[0, "#b7b3aa"], [1, "#9d998f"]])}"/>`;
  for (let i = -16; i <= 16; i++) f += `<line x1="${r(160 + i * 12)}" y1="${r(Y0)}" x2="${r(160 + i * 26)}" y2="200" stroke="#7e7a71" stroke-width=".35" opacity=".7"/>`;
  for (const d of [13, 12, 11, 10, 9.2]) f += `<line x1="0" y1="${r(yAt(d))}" x2="320" y2="${r(yAt(d))}" stroke="#7e7a71" stroke-width=".35" opacity=".65"/>`;
  for (let i = 0; i < 140; i++) f += `<circle cx="${r(rnd() * 320)}" cy="${r(Y0 + 2 + rnd() * (198 - Y0))}" r="${r(0.15 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#d4d0c8" : "#7a766d"}" opacity=".5"/>`;
  /* Pfützen mit Himmelsspiegelung */
  f += `<ellipse cx="200" cy="194" rx="22" ry="2.6" fill="#c7d2dc" opacity=".45"/><ellipse cx="96" cy="196" rx="12" ry="1.6" fill="#c7d2dc" opacity=".4"/>`;
  f += `<rect x="0" y="${r(Y0)}" width="320" height="${r(200 - Y0)}" fill="${S.lg("gehweglicht", [[0, "#fff", 0.1], [1, "#000", 0.06]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER REGEN: Schauerwolke rechts oben (Londoner Wetter)
   ===================================================================== */
{
  let k = "";
  k += `<g filter="url(#${S.id("wolke")})">`;
  for (const [dx, dy, rx, ry] of [[0, 0, 30, 9], [-22, 3, 16, 7], [24, 2, 18, 7.5], [-8, -7, 17, 8], [12, -8, 14, 7]]) k += `<ellipse cx="${dx}" cy="${dy}" rx="${rx}" ry="${ry}" fill="${S.lg("regenwolke", [[0, "#b7bec7"], [1, "#78818c"]])}"/>`;
  k += `</g><ellipse cx="0" cy="6" rx="34" ry="3.6" fill="#6b7480" opacity=".7" filter="url(#${S.id("wolke")})"/>`;
  for (let i = 0; i < 26; i++) { const x = -30 + rnd() * 60, y = 8 + rnd() * 6, l = 8 + rnd() * 10; k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x - l * 0.22)}" y2="${r(y + l)}" stroke="#8d98a6" stroke-width=".45" opacity="${r(0.45 + rnd() * 0.35)}" stroke-linecap="round"/>`; }
  k += flaeche(-36, -14, 72, 46);
  S.teil({ id: "regen", de: "der Regen", syl: "RE-gen", it: "la pioggia", itSyl: "PIOG-gia", en: "rain", x: 268, y: 20, kunst: k,
    tipp: "In London regnet es oft – aber meistens nur kurz." });
}

/* =====================================================================
   2 — DAS SCHLOSS: Palace of Westminster (hinter dem Platz)
   ===================================================================== */
{
  const X = 214, Y = 114.4;
  let k = "";
  const gotikFenster = (x, y, w, h) => `<path d="M${r(x)} ${r(y)} L${r(x)} ${r(y - h + w / 2)} Q${r(x + w / 2)} ${r(y - h - w * 0.3)} ${r(x + w)} ${r(y - h + w / 2)} L${r(x + w)} ${r(y)} Z" fill="${GLASD}"/>`;
  /* lange Westfassade */
  k += `<rect x="-110" y="-24" width="216" height="24" fill="${FERN}"/>`;
  k += `<rect x="-110" y="-24" width="216" height="24" fill="${S.lg("fassadelicht", [[0, "#fff", 0.12], [1, "#000", 0.1]])}"/>`;
  for (let x = -108; x < 104; x += 6) {
    k += `<rect x="${x}" y="-27" width="1.3" height="27" fill="#c2b590"/><path d="M${x} -27 L${r(x + 0.65)} -30.5 L${r(x + 1.3)} -27 Z" fill="#cfc3a0"/>`;
    k += gotikFenster(x + 2, -14, 2.2, 7) + gotikFenster(x + 2, -3, 2.2, 7);
  }
  k += `<rect x="-110" y="-24.6" width="216" height="1" fill="#efe6cc"/><rect x="-110" y="-12.6" width="216" height=".6" fill="#b8ab88"/>`;
  /* Westminster Hall: großes bleigraues Dach mit Laterne */
  k += `<path d="M-92 -24 L-84 -38 L-46 -38 L-38 -24 Z" fill="${S.lg("blei", [[0, "#8e98a2"], [1, "#5f6872"]])}"/>`;
  k += `<path d="M-84 -38 L-46 -38" stroke="#b9c1c8" stroke-width=".5"/>`;
  for (let x = -84; x < -46; x += 3) k += `<line x1="${x}" y1="-38" x2="${r(x - 2 - (x + 65) * 0.12)}" y2="-24" stroke="#56606a" stroke-width=".2" opacity=".6"/>`;
  k += `<rect x="-67.5" y="-44" width="5" height="6" fill="#7d8790"/><path d="M-68.5 -44 L-65 -48 L-61.5 -44 Z" fill="#6b747d"/><line x1="-65" y1="-48" x2="-65" y2="-50" stroke="#c8a23a" stroke-width=".4"/>`;
  /* Giebel von St Stephen's Porch mit großem Maßwerkfenster */
  k += `<path d="M-34 0 L-34 -32 L-25 -40 L-16 -32 L-16 0 Z" fill="${STEIN}"/>`;
  k += gotikFenster(-30.5, -10, 11, 18);
  for (let i = 1; i < 4; i++) k += `<line x1="${r(-30.5 + i * 2.75)}" y1="-10" x2="${r(-30.5 + i * 2.75)}" y2="-26" stroke="#cbbd96" stroke-width=".3"/>`;
  for (const x of [-35, -16]) k += `<rect x="${x}" y="-38" width="1.6" height="38" fill="#cbbe98"/><path d="M${x} -38 L${x + 0.8} -42 L${x + 1.6} -38 Z" fill="#d9ceac"/>`;
  /* achteckiger Mittelturm mit Spitze */
  k += `<rect x="-11" y="-46" width="14" height="22" fill="${STEIN_V}"/>`;
  for (const x of [-9, -5, -1]) k += gotikFenster(x, -30, 2.4, 12);
  k += `<path d="M-12 -46 L-4 -76 L4 -46 Z" fill="${S.lg("spitze", [[0, "#cdbf97"], [0.5, "#e2d6b4"], [1, "#a8996f"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 7; i++) k += `<path d="M${r(-11 + i * 1.1)} ${r(-49 - i * 3.8)} l-1 -.8 M${r(3 - i * 1.1)} ${r(-49 - i * 3.8)} l1 -.8" stroke="#bcae86" stroke-width=".35"/>`;
  for (const x of [-12, 2]) k += `<rect x="${x}" y="-50" width="2" height="5" fill="#d4c8a3"/><path d="M${x} -50 L${x + 1} -54 L${x + 2} -50 Z" fill="#d4c8a3"/>`;
  k += `<line x1="-4" y1="-76" x2="-4" y2="-78.5" stroke="#b08b33" stroke-width=".4"/>`;
  /* Victoria Tower im Süden (weiter weg, heller im Dunst) mit Flagge */
  {
    const vx = 76;
    k += `<rect x="${vx - 8}" y="-52" width="16" height="52" fill="${S.lg("vt", [[0, "#d9d0b6"], [0.5, "#e6dec6"], [1, "#c6bb9c"]], 0, 0, 1, 0)}"/>`;
    for (let y = -48; y < -6; y += 7) for (const dx of [-5, -1, 3]) k += gotikFenster(vx + dx, y + 5, 1.8, 4);
    k += `<path d="M${vx - 4} 0 L${vx - 4} -9 Q${vx} -14 ${vx + 4} -9 L${vx + 4} 0 Z" fill="#6f6a5c"/>`;
    for (const dx of [-8.6, 6.8]) k += `<rect x="${vx + dx}" y="-58" width="1.8" height="58" fill="#cdc2a2"/><path d="M${vx + dx - 0.3} -58 L${vx + dx + 0.9} -62 L${vx + dx + 2.1} -58 Z" fill="#c2b691"/>`;
    k += `<rect x="${vx - 8.6}" y="-54" width="17.2" height="2" fill="#e8dfc6"/>`;
    for (let i = 0; i < 7; i++) k += `<rect x="${r(vx - 7.6 + i * 2.4)}" y="-55.6" width="1.2" height="1.6" fill="#ded4b8"/>`;
    k += `<line x1="${vx}" y1="-54" x2="${vx}" y2="-66" stroke="#555" stroke-width=".35"/>`;
    k += `<g transform="translate(${vx + 0.2} -66)"><rect width="6" height="3.2" fill="#1f3f8a"/><path d="M0 0 L6 3.2 M6 0 L0 3.2" stroke="#fff" stroke-width=".8"/><path d="M0 0 L6 3.2 M6 0 L0 3.2" stroke="#c8102e" stroke-width=".3"/><path d="M3 0 V3.2 M0 1.6 H6" stroke="#fff" stroke-width="1.1"/><path d="M3 0 V3.2 M0 1.6 H6" stroke="#c8102e" stroke-width=".6"/></g>`;
  }
  /* Dunst über dem Fuß (hinter dem Platz) */
  k += `<rect x="-110" y="-6" width="216" height="6" fill="${S.lg("fussdunst", [[0, "#d7dde2", 0], [1, "#d7dde2", 0.55]])}"/>`;
  S.teil({ anker: [250, 96], id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "castle", x: X, y: Y, kunst: k,
    tipp: "Der Palace of Westminster ist ein Königsschloss. Heute tagt hier das britische Parlament." });
}

/* =====================================================================
   3 — DER BIG BEN: Elizabeth Tower (links)
   ===================================================================== */
{
  let k = "";
  const W = 6.3;
  /* Schaft mit Maßwerk-Feldern; rechts die schmale Seitenfläche im Schatten */
  k += `<path d="M${W} 0 L${W + 2} -1 L${W + 2} -59 L${W} -58 Z" fill="#a8996f"/>`;
  k += `<rect x="${-W}" y="-58" width="${2 * W}" height="58" fill="${STEIN_V}"/>`;
  for (let x = -W + 1.4; x < W; x += 1.6) k += `<line x1="${r(x)}" y1="-56" x2="${r(x)}" y2="-2" stroke="#b5a57c" stroke-width=".22"/>`;
  for (let y = -6; y > -57; y -= 6.4) {
    k += `<rect x="${-W}" y="${r(y)}" width="${2 * W}" height=".7" fill="#c7b88f"/>`;
    for (let x = -W + 1.4; x < W - 1; x += 1.6) k += `<path d="M${r(x)} ${r(y)} Q${r(x + 0.8)} ${r(y - 1.4)} ${r(x + 1.6)} ${r(y)}" stroke="#b5a57c" stroke-width=".2" fill="none"/>`;
  }
  for (const y of [-14, -27, -40, -51]) for (const x of [-2.6, 1]) k += `<rect x="${x}" y="${y}" width="1.6" height="3.4" rx=".8" fill="#4d5560"/>`;
  k += `<rect x="${-W - 0.6}" y="-3" width="${2 * W + 3.2}" height="3" fill="#bfae86"/>`;
  /* Uhrstube: etwas breiter, vergoldete Umrahmung, Zifferblatt */
  const UY = -65.5;
  k += `<path d="M${W + 0.8} -58 L${W + 2.8} -59 L${W + 2.8} -73 L${W + 0.8} -72 Z" fill="#9b8c64"/>`;
  k += `<rect x="${-W - 0.8}" y="-73" width="${2 * W + 1.6}" height="15" fill="${STEIN_V}"/>`;
  k += `<rect x="-6.2" y="-71.8" width="12.4" height="12.6" fill="${S.lg("preussisch", [[0, "#2a4f8f"], [1, "#16335f"]])}"/>`;
  k += `<rect x="-6.2" y="-71.8" width="12.4" height="12.6" fill="none" stroke="${GOLD}" stroke-width=".6"/>`;
  for (const [x, y] of [[-5, -70.6], [5, -70.6], [-5, -60.4], [5, -60.4]]) k += `<circle cx="${x}" cy="${y}" r=".7" fill="${GOLD}"/>`;
  k += `<circle cx="0" cy="${UY}" r="4.4" fill="${GOLD}"/>`;
  k += `<circle cx="0" cy="${UY}" r="3.8" fill="${S.rg("opal", [[0, "#fffef7"], [0.8, "#f3efe2"], [1, "#d9d2bc"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, x1 = Math.sin(a) * 3.5, y1 = UY - Math.cos(a) * 3.5, x2 = Math.sin(a) * 2.7, y2 = UY - Math.cos(a) * 2.7;
    k += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#1d1d1d" stroke-width="${i % 3 ? 0.28 : 0.45}"/>`;
  }
  k += `<circle cx="0" cy="${UY}" r="2.4" fill="none" stroke="#1d1d1d" stroke-width=".12"/>`;
  /* zehn nach vier */
  k += `<line x1="0" y1="${UY}" x2="${r(Math.sin(4.17 * Math.PI / 6) * 1.9)}" y2="${r(UY - Math.cos(4.17 * Math.PI / 6) * 1.9)}" stroke="#16335f" stroke-width=".55" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="${UY}" x2="${r(Math.sin(2 * Math.PI / 6) * 3.1)}" y2="${r(UY - Math.cos(2 * Math.PI / 6) * 3.1)}" stroke="#16335f" stroke-width=".35" stroke-linecap="round"/>`;
  k += `<circle cx="0" cy="${UY}" r=".35" fill="${GOLD}"/>`;
  k += `<rect x="-6.2" y="-59" width="12.4" height="1" fill="${GOLD}"/>`;
  /* Brüstung mit Fialen */
  k += `<rect x="${-W - 1.2}" y="-74.6" width="${2 * W + 2.4}" height="1.8" fill="#d8caa3"/>`;
  for (const x of [-W - 1.2, -2, 2, W]) k += `<rect x="${r(x)}" y="-77" width="1.2" height="3" fill="#cdbf98"/><path d="M${r(x)} -77 L${r(x + 0.6)} -79 L${r(x + 1.2)} -77 Z" fill="${GOLD}"/>`;
  /* Glockenstube: drei Spitzbogen-Öffnungen mit Lamellen */
  k += `<rect x="${-W + 0.4}" y="-84" width="${2 * W - 0.8}" height="9.4" fill="${STEIN_V}"/>`;
  k += `<path d="M${W - 0.4} -75 L${W + 1.4} -75.6 L${W + 1.4} -84.6 L${W - 0.4} -84 Z" fill="#9b8c64"/>`;
  for (const x of [-4.8, -1.2, 2.4]) {
    k += `<path d="M${x} -75.4 L${x} -81 Q${r(x + 1.2)} -83.2 ${r(x + 2.4)} -81 L${r(x + 2.4)} -75.4 Z" fill="#2b2f36"/>`;
    for (let y = -80; y < -75.6; y += 1) k += `<line x1="${x}" y1="${y}" x2="${r(x + 2.4)}" y2="${y}" stroke="${GOLD}" stroke-width=".22"/>`;
  }
  /* Turmhelm: steiles Gusseisen-Dach mit Gauben, Ecktürmchen, Laterne */
  k += `<rect x="${-W - 0.2}" y="-85.4" width="${2 * W + 0.4}" height="1.6" fill="${GOLD}"/>`;
  k += `<path d="M${-W} -85 L-2 -99 L2 -99 L${W} -85 Z" fill="${HELM}"/>`;
  k += `<path d="M${W} -85 L${W + 1.4} -85.6 L2.5 -99.2 L2 -99 Z" fill="#141a22"/>`;
  for (const x of [-3.6, 0, 3.6]) k += `<path d="M${r(x - 1)} -86 L${r(x - 1)} -88.4 L${x} -90 L${r(x + 1)} -88.4 L${r(x + 1)} -86 Z" fill="#3a4757" stroke="${GOLD}" stroke-width=".18"/><rect x="${r(x - 0.4)}" y="-88.6" width=".8" height="2" fill="#c9a640"/>`;
  for (let y = -91; y > -99; y -= 2) k += `<line x1="${r(-2 - (y + 99) * 0.3)}" y1="${y}" x2="${r(2 + (y + 99) * 0.3)}" y2="${y}" stroke="${GOLD}" stroke-width=".18" opacity=".8"/>`;
  for (const s of [-1, 1]) k += `<rect x="${r(s * (W + 0.3) - 0.6)}" y="-91" width="1.2" height="6" fill="#2c3644"/><path d="M${r(s * (W + 0.3) - 0.8)} -91 L${r(s * (W + 0.3))} -97 L${r(s * (W + 0.3) + 0.8)} -91 Z" fill="${GOLD}"/>`;
  k += `<rect x="-2.2" y="-103" width="4.4" height="4.2" fill="#2c3644" stroke="${GOLD}" stroke-width=".25"/>`;
  k += `<rect x="-1.4" y="-102.4" width="1" height="3" rx=".4" fill="#f6e3a0"/><rect x=".4" y="-102.4" width="1" height="3" rx=".4" fill="#f6e3a0"/>`;
  k += `<path d="M-2.4 -103 L0 -110.5 L2.4 -103 Z" fill="${HELM}"/><path d="M-1.2 -106.6 L1.2 -106.6" stroke="${GOLD}" stroke-width=".25"/><path d="M0 -110.5 L0 -113.4" stroke="${GOLD}" stroke-width=".5"/><circle cx="0" cy="-110.8" r=".5" fill="${GOLD}"/><path d="M-.8 -112.4 H.8" stroke="${GOLD}" stroke-width=".35"/>`;
  /* Lichtkante links */
  k += `<rect x="${-W}" y="-58" width=".8" height="58" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "bigben", de: "der Big Ben", syl: "BIG BEN", it: "il Big Ben", itSyl: "big BEN", en: "Big Ben", x: 95, y: 113.6, kunst: k,
    tipp: "Big Ben heißt eigentlich die große Glocke. Der Turm heißt Elizabeth Tower und ist 96 Meter hoch." });
}

/* =====================================================================
   4 — DIE STATUE: Winston Churchill auf dem Parliament Square
   ===================================================================== */
{
  let k = schatten(0, 0, 9, 1, 0.25);
  k += `<rect x="-7" y="-3" width="14" height="3" fill="#8e8b84"/>`;
  k += `<rect x="-5.6" y="-22" width="11.2" height="19" fill="${S.lg("granit", [[0, "#a7a49c"], [0.5, "#c4c1b9"], [1, "#8a877f"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-6.4" y="-24" width="12.8" height="2.2" fill="#b3b0a8"/>`;
  k += `<text x="0" y="-12" font-size="1.9" text-anchor="middle" fill="#3b3a36" font-family="Georgia,serif" letter-spacing=".3">CHURCHILL</text>`;
  /* Bronze: Mantel bis unter das Knie, Stock, gebeugt nach vorn */
  const BR = S.lg("bronze", [[0, "#5d6a5a"], [0.5, "#3f4a3e"], [1, "#2a3229"]], 0, 0, 1, 0);
  k += `<path d="M-3.6 -24 L-3 -30 L-3.8 -38 Q-3.4 -42 0 -42.6 Q3.6 -42 3.8 -38 L4.4 -30 L4 -24 Z" fill="${BR}"/>`;
  k += `<path d="M-2 -24 L-1.6 -28 M1.6 -24 L1.8 -28" stroke="#222a21" stroke-width=".9"/>`;
  k += `<ellipse cx=".4" cy="-44.6" rx="2" ry="2.3" fill="${BR}"/><path d="M-1.6 -43.6 Q.4 -42 2.4 -43.6" stroke="#2a3229" stroke-width=".5" fill="none"/>`;
  k += `<path d="M4 -34 L6 -24" stroke="#2a3229" stroke-width=".55"/><path d="M3.6 -36 Q5.2 -35 5.6 -33" stroke="${BR}" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M-3 -40 L-2.2 -30" stroke="#7d8a76" stroke-width=".35" opacity=".7"/>`;
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: 152, y: yAt(42), steht: true, kunst: k,
    tipp: "Die Statue zeigt Winston Churchill. Er schaut auf das Parlament." });
}

/* =====================================================================
   5 — DER DOPPELDECKERBUS (New Routemaster, fährt links → nach rechts)
   ===================================================================== */
{
  let k = schatten(0, 0.2, 58, 2.2, 0.35);
  /* Karosserie */
  k += `<path d="M-58 -4 L-58 -40 Q-58 -46 -52 -46 L46 -46 Q56 -46 58.4 -38 L59.4 -26 Q60 -10 59 -4 Z" fill="${ROT}"/>`;
  k += `<rect x="-58" y="-8" width="117" height="4" fill="#8f0d12"/>`;
  k += `<rect x="-58" y="-28.4" width="117" height="1.2" fill="#e9474b" opacity=".6"/>`;
  /* Oberdeck-Fensterband */
  k += `<path d="M-52 -42.5 L48 -42.5 Q55 -42.5 57 -35 L57.4 -32 L-52 -32 Z" fill="${GLASD}"/>`;
  for (let x = -40; x < 46; x += 12.5) k += `<rect x="${x}" y="-42.5" width="1.2" height="10.5" fill="#2b0a0c"/>`;
  /* Unterdeck-Fensterband */
  k += `<path d="M-46 -25 L42 -25 L42 -14 L-46 -14 Z" fill="${GLASD}"/>`;
  for (let x = -32; x < 40; x += 12.5) k += `<rect x="${x}" y="-25" width="1.2" height="11" fill="#2b0a0c"/>`;
  /* schräge Glasbänder an den Treppen (vorne und hinten) */
  k += `<path d="M42 -25 L50 -32 L57.4 -32 L57.6 -26 L49 -14 L42 -14 Z" fill="${GLASD}"/>`;
  k += `<path d="M-46 -25 L-52 -32 L-56 -32 L-56 -18 L-51 -14 L-46 -14 Z" fill="${GLASD}"/>`;
  /* Frontscheibe mit Fahrer (rechts sitzt der Fahrer — Rechtslenker) */
  k += `<path d="M57.6 -26 L59.4 -26 Q60 -14 59.2 -8 L56 -8 Q57.8 -16 57.6 -26 Z" fill="#3a4d5c"/>`;
  /* Spiegelungen */
  k += `<path d="M-30 -42.5 L-24 -42.5 L-32 -32 L-38 -32 Z" fill="#fff" opacity=".22"/><path d="M10 -42.5 L13 -42.5 L5 -32 L2 -32 Z" fill="#fff" opacity=".16"/>`;
  k += `<path d="M-20 -25 L-16 -25 L-23 -14 L-27 -14 Z" fill="#fff" opacity=".18"/>`;
  /* Zielanzeige an der Seite */
  k += `<rect x="18" y="-30.8" width="22" height="3.6" rx=".4" fill="#111"/><text x="29" y="-28.1" font-size="2.6" text-anchor="middle" fill="#ffc21a" font-family="Arial,Helvetica,sans-serif" font-weight="bold">12  Oxford Circus</text>`;
  /* Radkästen und Räder */
  for (const x of [-36, 38]) {
    k += `<path d="M${x - 7} -4 L${x - 7} -6 Q${x} -13.5 ${x + 7} -6 L${x + 7} -4 Z" fill="#2a0709"/>`;
    k += `<circle cx="${x}" cy="-4.6" r="4.6" fill="#1a1a1b"/><circle cx="${x}" cy="-4.6" r="2.4" fill="${S.rg("felge", [[0, "#e4e6e8"], [1, "#8a9096"]])}"/><circle cx="${x}" cy="-4.6" r=".7" fill="#555"/>`;
  }
  /* Licht, Lüftungsgitter, Lichtkante */
  k += `<rect x="56.4" y="-7.6" width="3" height="1.6" rx=".4" fill="#fff3c4"/><rect x="-57.6" y="-12" width="1.2" height="3" fill="#ff5a3a"/>`;
  k += `<rect x="-12" y="-9.8" width="14" height="1.2" fill="#6d0a0e"/>`;
  k += `<rect x="-52" y="-45.6" width="96" height="1" fill="#fff" opacity=".28"/>`;
  S.teil({ id: "bus", de: "der Doppeldeckerbus", syl: "DOP-pel-de-cker-bus", it: "l'autobus a due piani", itSyl: "AU-to-bus a DUE PIA-ni", en: "double-decker bus", x: 236, y: yAt(23), steht: true, kunst: k,
    tipp: "In Großbritannien fährt man links. Der Fahrer sitzt rechts." });
}

/* =====================================================================
   6 — DAS TAXI (Black Cab, fährt auf der nahen Spur nach links)
   ===================================================================== */
{
  let k = schatten(0, 0.2, 32, 1.6, 0.4);
  k += `<path d="M-32 -4 L-32.6 -8.6 Q-32.4 -11.6 -27 -12.6 L-19 -13.6 L-12.8 -24.2 Q-12 -25.6 -10 -25.8 L22 -26 Q27 -26 29.6 -22 L32 -16 L32.6 -5 L31 -4 Z" fill="${SCHWARZ}"/>`;
  /* Fenster: vorne, Fondtür, hinten */
  k += `<path d="M-17.6 -14.4 L-12 -23.6 L-3 -23.6 L-3 -14.4 Z" fill="${GLASD}"/>`;
  k += `<path d="M-1.6 -23.6 L13 -23.6 L13 -14.4 L-1.6 -14.4 Z" fill="${GLASD}"/>`;
  k += `<path d="M14.6 -23.6 L22.4 -23.6 Q26.4 -23.4 28 -19 L29 -14.4 L14.6 -14.4 Z" fill="${GLASD}"/>`;
  k += `<path d="M-12 -23.6 L-9 -23.6 L-14 -14.4 L-16 -14.4 Z" fill="#fff" opacity=".22"/><path d="M4 -23.6 L6 -23.6 L2 -14.4 L0 -14.4 Z" fill="#fff" opacity=".18"/>`;
  /* Türfugen und Griffe (Fondtür hinten angeschlagen) */
  k += `<path d="M-3 -13 L-3 -4 M13.6 -24 L13.6 -4 M-19.6 -13.4 L-19.6 -6" stroke="#000" stroke-width=".35"/>`;
  k += `<rect x="-6" y="-12.4" width="2" height=".7" rx=".3" fill="#c9cdd1"/><rect x="0" y="-12.4" width="2" height=".7" rx=".3" fill="#c9cdd1"/>`;
  /* Kühlergrill, Stoßstange, Licht */
  k += `<rect x="-33" y="-7.4" width="5" height="3.4" rx=".8" fill="#c9cdd1"/><ellipse cx="-30.6" cy="-10.2" rx="1.6" ry="1.3" fill="#fff8dc"/>`;
  k += `<rect x="30.2" y="-12" width="1.6" height="3" fill="#c3282c"/>`;
  /* gelbes TAXI-Schild auf dem Dach */
  k += `<rect x="-11" y="-28.6" width="8" height="2.8" rx=".6" fill="${S.lg("taxischild", [[0, "#ffd84a"], [1, "#e69a12"]])}"/><text x="-7" y="-26.5" font-size="2.2" text-anchor="middle" fill="#1b1b1b" font-family="Arial,Helvetica,sans-serif" font-weight="bold">TAXI</text>`;
  /* Räder */
  for (const x of [-22, 21]) {
    k += `<path d="M${x - 6} -4 Q${x} -12.4 ${x + 6} -4 Z" fill="#050505"/>`;
    k += `<circle cx="${x}" cy="-4.4" r="4.4" fill="#151515"/><circle cx="${x}" cy="-4.4" r="2.2" fill="${S.rg("felge2", [[0, "#e4e6e8"], [1, "#7d838a"]])}"/>`;
  }
  /* Lack-Glanz */
  k += `<path d="M-30 -11.6 Q-24 -13 -19 -13.2" stroke="#fff" stroke-width=".5" opacity=".45" fill="none"/><path d="M-10 -25.2 L22 -25.4" stroke="#fff" stroke-width=".5" opacity=".35"/>`;
  k += `<rect x="-28" y="-9.4" width="56" height=".5" fill="#6b7178" opacity=".5"/>`;
  S.teil({ id: "taxi", de: "das Taxi", syl: "TA-xi", it: "il taxi", itSyl: "TA-xi", en: "taxi", x: 186, y: yAt(17), steht: true, kunst: k,
    tipp: "Das schwarze Londoner Taxi heißt „Black Cab“. Leuchtet das gelbe Schild, ist es frei." });
}

/* =====================================================================
   7 — DIE LATERNE (schwarze Westminster-Laterne)
   ===================================================================== */
{
  const u = uAt(13);   /* ≈ 18,6 je Meter */
  let k = schatten(0, 0.2, 4, 0.8, 0.3);
  const EISEN = S.lg("eisen", [[0, "#1f2226"], [0.45, "#4a4f55"], [1, "#151719"]], 0, 0, 1, 0);
  k += `<path d="M-3 0 L-2.4 -6 L2.4 -6 L3 0 Z" fill="${EISEN}"/><rect x="-1.8" y="-9" width="3.6" height="3" rx=".8" fill="${EISEN}"/>`;
  k += `<path d="M-1.1 -9 L-.7 ${r(-u * 3.8)} L.7 ${r(-u * 3.8)} L1.1 -9 Z" fill="${EISEN}"/>`;
  for (const y of [-20, -40]) k += `<rect x="-1.4" y="${y}" width="2.8" height="1.2" rx=".4" fill="#3c4146"/>`;
  const LY = -u * 3.8;
  k += `<path d="M-2.6 ${r(LY)} L2.6 ${r(LY)} L1.6 ${r(LY + 2)} L-1.6 ${r(LY + 2)} Z" fill="${EISEN}"/>`;
  k += `<path d="M-4.6 ${r(LY - 1)} L-3.6 ${r(LY - 10)} L3.6 ${r(LY - 10)} L4.6 ${r(LY - 1)} Z" fill="${S.lg("lampenglas", [[0, "#fff8dc"], [1, "#f1dfa4"]])}" stroke="#1d1f22" stroke-width=".6"/>`;
  k += `<line x1="0" y1="${r(LY - 1)}" x2="0" y2="${r(LY - 10)}" stroke="#1d1f22" stroke-width=".4"/>`;
  k += `<path d="M-5.4 ${r(LY - 10)} L5.4 ${r(LY - 10)} L0 ${r(LY - 14)} Z" fill="${EISEN}"/><circle cx="0" cy="${r(LY - 14.6)}" r=".9" fill="#2a2d31"/>`;
  k += `<rect x="-5" y="${r(LY - 1.6)}" width="10" height="1" fill="#1d1f22"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "La-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 118, y: yAt(13), steht: true, kunst: k });
}

/* =====================================================================
   8 — DER BRIEFKASTEN (Pillar Box, Gusseisen, rot)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 8, 1.2, 0.35);
  k += `<rect x="-7.2" y="-3" width="14.4" height="3" rx=".6" fill="#1b1b1c"/>`;
  k += `<rect x="-6.4" y="-30" width="12.8" height="27" fill="${ROT_V}"/>`;
  k += `<rect x="-7.2" y="-31.6" width="14.4" height="2" rx=".8" fill="${ROT_V}"/>`;
  k += `<path d="M-6.6 -31.6 Q-6.4 -36.4 0 -36.8 Q6.4 -36.4 6.6 -31.6 Z" fill="${ROT_V}"/>`;
  k += `<path d="M-4 -34.8 Q0 -36.4 4 -34.8" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
  k += `<rect x="-4.4" y="-26.6" width="8.8" height="1.8" rx=".5" fill="#2b0406"/><rect x="-4.6" y="-27.6" width="9.2" height="1" rx=".4" fill="#a8090f"/>`;
  k += `<text x="0" y="-28.6" font-size="1.5" text-anchor="middle" fill="#f0d39a" font-family="Georgia,serif" letter-spacing=".2">ROYAL MAIL</text>`;
  k += `<rect x="-3.4" y="-21.4" width="6.8" height="5.2" rx=".3" fill="#f6f4ee"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="-2.6" y="${r(-20.4 + i * 1.1)}" width="${i % 2 ? 4 : 5.2}" height=".35" fill="#7a7a7a"/>`;
  k += `<text x="0" y="-9.6" font-size="3.4" text-anchor="middle" fill="${GOLD}" font-family="Georgia,serif" font-style="italic" font-weight="bold">E R</text>`;
  k += `<rect x="-5.6" y="-30" width="1.2" height="27" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "briefkasten", de: "der Briefkasten", syl: "BRIEF-ka-sten", it: "la cassetta postale", itSyl: "cas-SET-ta po-STA-le", en: "postbox", x: 106, y: yAt(11.5), steht: true, kunst: k,
    tipp: "Britische Briefkästen sind rund und rot. Die Buchstaben zeigen, unter welcher Königin oder welchem König er aufgestellt wurde." });
}

/* =====================================================================
   9 — DIE TELEFONZELLE (K6, Gusseisen, rot)
   ===================================================================== */
{
  let k = schatten(1, 0.3, 13, 1.4, 0.38);
  /* Sockel */
  k += `<rect x="-11.2" y="-2.2" width="23.6" height="2.2" fill="#8a1014"/>`;
  /* rechte Seitenfläche (perspektivisch) */
  k += `<path d="M10 -2.2 L12.6 -2.6 L12.6 -45 L10 -44 Z" fill="#8e0b10"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="10.6" y="${r(-38.6 + i * 4.1)}" width="1.4" height="3.2" fill="#3c4e5a" opacity=".85"/>`;
  /* Vorderseite: Eckpfosten, Tür mit 8 × 3 Scheiben */
  k += `<rect x="-10" y="-44" width="20" height="41.8" fill="${ROT_V}"/>`;
  k += `<rect x="-7.4" y="-39.4" width="14.8" height="34" fill="#8f0c11"/>`;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) {
    const x = -6.8 + j * 4.7, y = -38.8 + i * 4.15;
    k += `<rect x="${r(x)}" y="${r(y)}" width="4.3" height="3.6" fill="${S.lg("k6glas", [[0, "#9db4c2"], [1, "#4d6372"]])}"/>`;
  }
  k += `<path d="M-6.8 -38.8 L-2 -38.8 L-6.8 -20 Z" fill="#fff" opacity=".2"/>`;
  k += `<rect x="5.4" y="-22" width=".8" height="4" rx=".3" fill="#2a0204"/>`;
  /* Schild TELEPHONE und Kuppeldach mit Krone */
  k += `<rect x="-9" y="-44.2" width="18" height="3.2" fill="#f7f5ee" stroke="#8a1014" stroke-width=".3"/>`;
  k += `<text x="0" y="-41.8" font-size="2.3" text-anchor="middle" fill="#1d1d1d" font-family="Gill Sans,Arial,Helvetica,sans-serif" letter-spacing=".25">TELEPHONE</text>`;
  k += `<rect x="-10.6" y="-46" width="21.2" height="1.8" fill="${ROT_V}"/>`;
  k += `<path d="M-10.6 -46 Q-10 -52.6 0 -53.2 Q10 -52.6 10.6 -46 Z" fill="${ROT_V}"/>`;
  k += `<path d="M10.6 -46 L12.8 -46.6 Q12.2 -51.8 9 -52 Q10.2 -50 10.6 -46 Z" fill="#7d0a0e"/>`;
  /* Tudor-Krone (aufgesetzt, nicht durchbrochen) */
  k += `<g transform="translate(0 -49.2)"><path d="M-2 1.3 L-2.2 -.8 L-1.1 .2 L0 -1.4 L1.1 .2 L2.2 -.8 L2 1.3 Z" fill="#a40e13" stroke="#5e0508" stroke-width=".2"/><rect x="-2.1" y=".9" width="4.2" height=".7" fill="#7f0a0e"/><circle cx="0" cy="-1.7" r=".35" fill="#a40e13"/></g>`;
  k += `<path d="M-6 -51.4 Q0 -53 6 -51.4" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
  k += `<rect x="-10" y="-44" width="1.1" height="41.8" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "telefonzelle", de: "die Telefonzelle", syl: "Te-le-FON-zel-le", it: "la cabina telefonica", itSyl: "ca-BI-na te-le-FO-ni-ca", en: "phone box", x: 80, y: yAt(11), steht: true, kunst: k,
    tipp: "Die rote Telefonzelle gibt es seit 1936. Heute sind manche kleine Bibliotheken oder Defibrillator-Stationen." });
}

/* =====================================================================
   10 — DER KIOSK (Souvenirkiosk) — Lupe mit den Andenken
   ===================================================================== */
const kioskUnter = [];
{
  const X = 279, Y = yAt(11);
  let k = schatten(0, 0.3, 40, 1.8, 0.35);
  const GR = S.lg("kioskgruen", [[0, "#2f6a4e"], [1, "#1c4532"]]);
  /* Korpus, Theke, Innenraum */
  k += `<rect x="-38" y="-24" width="76" height="24" fill="${GR}"/>`;
  for (let x = -35; x < 37; x += 6) k += `<rect x="${x}" y="-21" width="4.6" height="18" rx=".5" fill="none" stroke="#173a2a" stroke-width=".5"/>`;
  k += `<rect x="-38" y="-52" width="76" height="28" fill="${S.lg("kioskinnen", [[0, "#efe4cc"], [1, "#d6c6a4"]])}"/>`;
  for (const x of [-38, 35]) k += `<rect x="${x}" y="-54" width="3" height="54" fill="${GR}"/>`;
  k += `<rect x="-39" y="-25.6" width="78" height="2.4" fill="#e3dccb"/><rect x="-39" y="-23.2" width="78" height=".6" fill="#8a8274"/>`;
  k += `<rect x="-35" y="-38.4" width="70" height="1.4" fill="#9a7a52"/>`;
  /* Dach mit Schild */
  k += `<path d="M-42 -54 L42 -54 L39 -61 L-39 -61 Z" fill="${S.lg("kioskdach", [[0, "#24543e"], [1, "#163627"]])}"/>`;
  k += `<rect x="-26" y="-60.4" width="52" height="5.6" rx=".6" fill="#14281e"/><text x="0" y="-56.2" font-size="3.6" text-anchor="middle" fill="#f0d27a" font-family="Georgia,serif" font-weight="bold" letter-spacing=".5">SOUVENIRS · LONDON</text>`;
  /* Andenken */
  const st = (x, y) => [x, y];
  const SH = -38.4, TH = -25.6;
  /* Königsgarde-Figur: rote Jacke, schwarze Hose, Bärenfellmütze, Gewehr */
  const garde = (x, y) => {
    let g = `<rect x="${x - 2.2}" y="${y - 0.8}" width="4.4" height=".8" fill="#6b4a2e"/>`;
    g += `<rect x="${x - 1.3}" y="${y - 5}" width="1.1" height="4.2" fill="#15161a"/><rect x="${x + 0.2}" y="${y - 5}" width="1.1" height="4.2" fill="#15161a"/>`;
    g += `<rect x="${x - 1.9}" y="${y - 9.6}" width="3.8" height="4.8" rx=".5" fill="#c8161c"/><rect x="${x - 1.9}" y="${y - 6}" width="3.8" height=".6" fill="#f2f0ea"/>`;
    for (let i = 0; i < 4; i++) g += `<circle cx="${x}" cy="${r(y - 9 + i * 1)}" r=".2" fill="#f0d27a"/>`;
    g += `<circle cx="${x}" cy="${y - 10.5}" r="1" fill="#efc9a4"/>`;
    g += `<path d="M${x - 1.5} ${y - 10.2} L${x - 1.6} ${y - 14} Q${x} ${y - 15.4} ${x + 1.6} ${y - 14} L${x + 1.5} ${y - 10.2} Z" fill="#111"/>`;
    g += `<rect x="${x + 2}" y="${y - 12.4}" width=".5" height="7" fill="#5b4632"/>`;
    return g;
  };
  /* Plüschschaf */
  const schaf = (x, y) => {
    let g = `<ellipse cx="${x}" cy="${y - 3.4}" rx="4.6" ry="3.2" fill="#f4f1ea"/>`;
    for (let i = 0; i < 9; i++) g += `<circle cx="${r(x - 3.6 + (i % 5) * 1.8)}" cy="${r(y - 5 + Math.floor(i / 5) * 2.4)}" r="1.1" fill="#fbf9f3" stroke="#ddd6c6" stroke-width=".15"/>`;
    g += `<ellipse cx="${x - 4.6}" cy="${y - 4.6}" rx="1.6" ry="1.9" fill="#2b2522"/><circle cx="${x - 5.1}" cy="${y - 5}" r=".25" fill="#fff"/>`;
    g += `<rect x="${x - 3}" y="${y - 1}" width=".9" height="1" fill="#2b2522"/><rect x="${x + 2}" y="${y - 1}" width=".9" height="1" fill="#2b2522"/>`;
    return g;
  };
  /* Teddy mit Union-Jack-Pulli */
  const teddy = (x, y) => {
    let g = `<ellipse cx="${x}" cy="${y - 2.6}" rx="3" ry="2.6" fill="#b07a45"/>`;
    g += `<rect x="${x - 2.4}" y="${y - 6.6}" width="4.8" height="4" rx="1" fill="#1f3f8a"/><path d="M${x - 2.4} ${y - 6.6} L${x + 2.4} ${y - 2.6} M${x + 2.4} ${y - 6.6} L${x - 2.4} ${y - 2.6}" stroke="#fff" stroke-width=".5"/><path d="M${x} ${y - 6.6} V${y - 2.6} M${x - 2.4} ${y - 4.6} H${x + 2.4}" stroke="#c8102e" stroke-width=".7"/>`;
    g += `<circle cx="${x}" cy="${y - 8.6}" r="2.3" fill="#b07a45"/><circle cx="${x - 1.8}" cy="${y - 10.4}" r=".8" fill="#9a6435"/><circle cx="${x + 1.8}" cy="${y - 10.4}" r=".8" fill="#9a6435"/>`;
    g += `<ellipse cx="${x}" cy="${y - 7.9}" rx=".9" ry=".6" fill="#e3c39c"/><circle cx="${x - 0.8}" cy="${y - 9.1}" r=".25" fill="#111"/><circle cx="${x + 0.8}" cy="${y - 9.1}" r=".25" fill="#111"/>`;
    return g;
  };
  /* Schneekugel mit Big Ben */
  const kugel = (x, y) => {
    let g = `<path d="M${x - 2.6} ${y} L${x - 2} ${y - 1.8} L${x + 2} ${y - 1.8} L${x + 2.6} ${y} Z" fill="#3a2a1c"/>`;
    g += `<circle cx="${x}" cy="${y - 4.6}" r="3.2" fill="#dcecf4" opacity=".75" stroke="#b9cdd6" stroke-width=".2"/>`;
    g += `<rect x="${x - 0.5}" y="${y - 6.8}" width="1" height="4.4" fill="#cdbf98"/><path d="M${x - 0.5} ${y - 6.8} L${x} ${y - 8} L${x + 0.5} ${y - 6.8} Z" fill="#2c3644"/><circle cx="${x}" cy="${y - 5.8}" r=".3" fill="#fff"/>`;
    for (let i = 0; i < 6; i++) g += `<circle cx="${r(x - 2 + rnd() * 4)}" cy="${r(y - 7 + rnd() * 4)}" r=".18" fill="#fff"/>`;
    g += `<path d="M${x - 2} ${y - 6.4} Q${x - 1} ${y - 7.6} ${x} ${y - 7.8}" stroke="#fff" stroke-width=".35" opacity=".7" fill="none"/>`;
    return g;
  };
  /* Tasse mit Union Jack */
  const tasse = (x, y) => {
    let g = `<path d="M${x - 2.4} ${y - 5.2} L${x + 2.4} ${y - 5.2} L${x + 2.2} ${y} L${x - 2.2} ${y} Z" fill="#f7f6f1"/>`;
    g += `<path d="M${x + 2.3} ${y - 4.2} q1.8 .2 1.6 1.6 q-.2 1.2 -1.7 1" stroke="#eceae3" stroke-width=".6" fill="none"/>`;
    g += `<rect x="${x - 1.6}" y="${y - 4}" width="3.2" height="2" fill="#1f3f8a"/><path d="M${x - 1.6} ${y - 4} L${x + 1.6} ${y - 2} M${x + 1.6} ${y - 4} L${x - 1.6} ${y - 2}" stroke="#fff" stroke-width=".35"/><path d="M${x} ${y - 4} V${y - 2} M${x - 1.6} ${y - 3} H${x + 1.6}" stroke="#c8102e" stroke-width=".45"/>`;
    return g;
  };
  /* Postkarten im Ständer */
  const karten = (x, y) => {
    let g = `<rect x="${x - 0.3}" y="${y - 14}" width=".6" height="14" fill="#7c858c"/><rect x="${x - 3}" y="${y - 0.6}" width="6" height=".6" fill="#7c858c"/>`;
    const bilder = [["#7fa7d1", "#c8161c"], ["#d9c79c", "#2c3644"], ["#9cc0e0", "#1f3f8a"], ["#c8161c", "#f2f0ea"]];
    bilder.forEach(([a, b], i) => {
      const cx = x + (i % 2 ? 2.4 : -2.4), cy = y - 12.6 + Math.floor(i / 2) * 5;
      g += `<rect x="${r(cx - 2.2)}" y="${r(cy)}" width="4.4" height="3.2" fill="${a}" stroke="#fff" stroke-width=".25"/><rect x="${r(cx - 0.5)}" y="${r(cy + 0.4)}" width="1" height="2.4" fill="${b}"/>`;
    });
    return g;
  };
  const dinge = [
    ["garde", garde, -26, SH, "die Königsgarde", "KÖ-nigs-gar-de", "la guardia reale", "GUAR-dia re-A-le", "king's guard", "Die echte Königsgarde steht vor dem Buckingham-Palast: rote Jacke, hohe schwarze Bärenfellmütze."],
    ["schaf", schaf, -12, SH, "das Schaf", "SCHAF", "la pecora", "PE-co-ra", "sheep", "In Großbritannien leben mehr als 30 Millionen Schafe."],
    ["teddy", teddy, 2, SH, "der Teddybär", "TED-dy-bär", "l'orsacchiotto", "or-sac-CHIOT-to", "teddy bear", null],
    ["schneekugel", kugel, -24, TH, "die Schneekugel", "SCHNEE-ku-gel", "la palla di neve", "PAL-la di NE-ve", "snow globe", null],
    ["tasse", tasse, -10, TH, "die Tasse", "TAS-se", "la tazza", "TAZ-za", "mug", null],
    ["postkarte", karten, 22, TH, "die Postkarte", "POST-kar-te", "la cartolina", "car-to-LI-na", "postcard", "Eine Postkarte nach Hause – mit Big Ben vorne drauf."],
  ];
  /* kleine Reihen anderer Andenken (Hintergrund im Regal) */
  for (let i = 0; i < 6; i++) k += `<rect x="${12 + i * 3.6}" y="${SH - 4}" width="2.6" height="4" rx=".3" fill="${["#c8161c", "#1f3f8a", "#f2f0ea"][i % 3]}"/>`;
  k += `<path d="M14 -48 L32 -48" stroke="#9a7a52" stroke-width=".4"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${15 + i * 3.6} -48 l-1.2 4 h2.4 Z" fill="${["#c8161c", "#1f3f8a", "#2f6a4e", "#c8161c", "#e2b33a"][i]}"/>`;
  for (const [id, f, dx, dy, de, syl, it, itSyl, en, tipp] of dinge) {
    k += f(dx, dy);
    const o = { id, de, syl, it, itSyl, en, x: X + dx, y: Y + dy, kunst: flaeche(-5.4, -14.6, 10.8, 15) };
    if (id === "postkarte") o.kunst = flaeche(-6, -14.6, 12, 15);
    if (tipp) o.tipp = tipp;
    kioskUnter.push(o);
  }
  k += `<rect x="-35" y="-52" width="70" height="2.4" fill="${S.lg("kioskschatten", [[0, "#000", 0.25], [1, "#000", 0]])}"/>`;
  S.teil({ id: "kiosk", de: "der Kiosk", syl: "KI-osk", it: "il chiosco", itSyl: "CHIO-sco", en: "kiosk", x: X, y: Y, steht: true, kunst: k,
    zoom: { x: X - 40, y: Y - 62, w: 80, h: 54 }, unter: kioskUnter,
    tipp: "Am Kiosk gibt es Andenken: kleine Busse, Teddys, Tassen und Postkarten." });
}

/* =====================================================================
   11 — DAS PUB „The Red Lion“ (links, viktorianische Holzfront)
   ===================================================================== */
{
  const Y = yAt(12);   /* ≈ 176,7; 20 Einheiten je Meter */
  let k = "";
  /* Obergeschosse: Portland-Stein mit Schiebefenstern */
  k += `<rect x="-28" y="${-Y}" width="60" height="${r(Y - 80)}" fill="${S.lg("pubstein", [[0, "#d7cfbd"], [1, "#c3baa6"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-160, -122]) for (const x of [-25, -4]) {
    k += `<rect x="${x}" y="${y}" width="16" height="28" fill="#f2efe7"/><rect x="${x + 1.4}" y="${y + 1.4}" width="13.2" height="25.2" fill="${GLASD}"/>`;
    k += `<rect x="${x + 1.4}" y="${y + 13.4}" width="13.2" height="1.2" fill="#f2efe7"/><line x1="${x + 8}" y1="${y + 1.4}" x2="${x + 8}" y2="${y + 26.6}" stroke="#f2efe7" stroke-width=".7"/>`;
    k += `<path d="M${x + 2} ${y + 2} L${x + 6} ${y + 2} L${x + 2} ${y + 10} Z" fill="#fff" opacity=".18"/>`;
    k += `<rect x="${x - 1}" y="${y + 28}" width="18" height="1.8" fill="#e8e2d4"/>`;
  }
  k += `<rect x="-28" y="-85" width="60" height="5" fill="#bdb39e"/>`;
  /* Erdgeschoss: dunkelgrüne Holzfront mit Goldschrift */
  k += `<rect x="-28" y="-80" width="60" height="80" fill="${PUBGRUEN}"/>`;
  k += `<rect x="-28" y="-80" width="60" height="13" fill="#0f1d17"/>`;
  k += `<rect x="-27" y="-79" width="58" height="11" fill="none" stroke="${GOLD}" stroke-width=".5"/>`;
  k += `<text x="2" y="-70.6" font-size="5.8" text-anchor="middle" fill="${GOLD}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".8">THE RED LION</text>`;
  for (const x of [-28, -10, 14, 30])  k += `<rect x="${x}" y="-67" width="2.4" height="67" fill="#163428"/><rect x="${x + 0.4}" y="-67" width=".6" height="67" fill="#3b6b56" opacity=".6"/>`;
  /* Fenster mit geätztem Glas und kleinen Oberlichtern */
  for (const [x0, x1] of [[-26, -10], [-7.6, 14]]) {
    k += `<rect x="${x0}" y="-64" width="${r(x1 - x0)}" height="8" fill="#1c2a25"/>`;
    for (let x = x0 + 0.6; x < x1 - 2; x += 3.6) k += `<rect x="${r(x)}" y="-63.2" width="3" height="6.4" fill="${S.lg("oberlicht", [[0, "#e9c77a"], [1, "#b88a3a"]])}" opacity=".85"/>`;
    k += `<rect x="${x0}" y="-55" width="${r(x1 - x0)}" height="34" fill="${S.lg("pubfenster", [[0, "#5e5a3a"], [0.5, "#3b3a2a"], [1, "#2b2a20"]])}"/>`;
    k += `<rect x="${x0}" y="-55" width="${r(x1 - x0)}" height="34" fill="${S.rg("pubwarm", [[0, "#ffcf7a", 0.45], [1, "#ffcf7a", 0]])}"/>`;
    k += `<rect x="${x0 + 1}" y="-35" width="${r(x1 - x0 - 2)}" height="13" fill="#e9e4d4" opacity=".28"/>`;
    k += `<path d="M${x0 + 2} -54 L${x0 + 8} -54 L${x0 + 2} -40 Z" fill="#fff" opacity=".15"/>`;
    k += `<rect x="${x0}" y="-21" width="${r(x1 - x0)}" height="21" fill="#173a2c"/><rect x="${x0 + 2}" y="-18" width="${r(x1 - x0 - 4)}" height="15" rx="1" fill="none" stroke="#2f5c48" stroke-width=".6"/>`;
  }
  /* Tür */
  k += `<rect x="16.4" y="-60" width="13.6" height="60" fill="#0f2219"/><rect x="18" y="-56" width="10.4" height="22" fill="${S.lg("tuerglas", [[0, "#6a5a36"], [1, "#3a301d"]])}"/>`;
  k += `<rect x="18" y="-30" width="10.4" height="26" rx=".8" fill="none" stroke="#2f5c48" stroke-width=".6"/><circle cx="27" cy="-31" r=".8" fill="${GOLD}"/>`;
  /* Blumenampeln */
  for (const x of [-22, 8]) {
    k += `<path d="M${x} -80 L${x} -86" stroke="#111" stroke-width=".4"/><path d="M${x - 5} -80 Q${x} -73 ${x + 5} -80 Z" fill="#2f3a2a"/>`;
    for (let i = 0; i < 18; i++) { const a = rnd() * Math.PI, rr = 3 + rnd() * 4; k += `<circle cx="${r(x + Math.cos(a) * rr)}" cy="${r(-80 + Math.sin(a) * rr * 0.9 - 1)}" r="${r(0.8 + rnd() * 0.6)}" fill="${["#d6336c", "#f2f0ea", "#7a3fb0", "#e85d2a", "#4f8a46", "#4f8a46"][i % 6]}"/>`; }
  }
  /* Laterne an der Wand */
  k += `<path d="M28 -66 L34 -66" stroke="#111" stroke-width=".6"/><path d="M31 -66 L29.4 -64 L29.8 -59 L32.2 -59 L32.6 -64 Z" fill="#f6dc8a" stroke="#111" stroke-width=".4"/>`;
  k += `<rect x="-28" y="-1.6" width="60" height="1.6" fill="#0b1510"/>`;
  S.teil({ anker: [28, 104], id: "pub", de: "das Pub", syl: "PUB", it: "il pub", itSyl: "PUB", en: "pub", x: 28, y: Y, steht: true, kunst: k,
    tipp: "Im Pub trinkt man Tee, Bier oder Limonade und isst Fish and Chips." });
}

/* =====================================================================
   12 — DIE FLAGGE (Union Jack am Pub)
   ===================================================================== */
{
  let k = `<line x1="0" y1="0" x2="8" y2="-15" stroke="#e9e6dd" stroke-width=".9"/><circle cx="8.2" cy="-15.2" r=".9" fill="${GOLD}"/>`;
  /* Union Jack, richtig gezeichnet: das rote Andreaskreuz ist versetzt
     (an der Mastseite liegt Weiß oben, an der freien Seite Rot oben) */
  S.def(`<clipPath id="${S.id("ujclip")}"><rect width="24" height="12"/></clipPath>`);
  let uj = `<rect width="24" height="12" fill="#1f3f8a"/><g clip-path="url(#${S.id("ujclip")})">`;
  uj += `<path d="M0 0 L24 12 M24 0 L0 12" stroke="#fff" stroke-width="2.4"/>`;
  for (const [x, y, dy] of [[0, 0, 0.55], [0, 12, 0.55], [24, 0, -0.55], [24, 12, -0.55]]) uj += `<path d="M${x} ${r(y + dy)} L12 ${r(6 + dy)}" stroke="#c8102e" stroke-width=".8"/>`;
  uj += `<path d="M12 0 V12 M0 6 H24" stroke="#fff" stroke-width="4"/><path d="M12 0 V12 M0 6 H24" stroke="#c8102e" stroke-width="2.4"/></g>`;
  k += `<g transform="translate(7.6 -14.6) rotate(6) scale(.82)">${uj}`;
  k += `<path d="M5 0 Q8 6 6 12" stroke="#000" stroke-width="2" opacity=".1" fill="none"/><path d="M17 0 Q20 6 18 12" stroke="#fff" stroke-width="1.6" opacity=".14" fill="none"/></g>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 52, y: 60, kunst: k + flaeche(6, -17, 22, 16),
    tipp: "Die britische Flagge heißt Union Jack: Sie vereint die Kreuze von England, Schottland und Irland." });
}

/* =====================================================================
   13 — DER TISCH und DER STUHL vor dem Pub, darauf FISH AND CHIPS und TEE
   ===================================================================== */
const TISCH_Y = yAt(10.4), TU = uAt(10.4);   /* ≈ 186,9; 23,3 je Meter */
const PLATTE = TISCH_Y - 0.75 * TU;
{
  const EISEN = S.lg("tischeisen", [[0, "#1d2023"], [0.5, "#41464c"], [1, "#16181a"]], 0, 0, 1, 0);
  let k = schatten(0, 0.3, 10, 1.2, 0.3);
  k += `<path d="M-6 0 L0 -2 L6 0" stroke="#1d2023" stroke-width="1" fill="none"/><rect x="-.7" y="${r(-0.75 * TU + 1)}" width="1.4" height="${r(0.75 * TU - 2)}" fill="${EISEN}"/>`;
  k += `<ellipse cx="0" cy="${r(-0.75 * TU + 0.6)}" rx="9.6" ry="1.8" fill="#16181a"/><ellipse cx="0" cy="${r(-0.75 * TU)}" rx="9.6" ry="1.6" fill="${S.lg("tischplatte", [[0, "#5a5f65"], [1, "#2d3135"]])}"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 30, y: TISCH_Y, steht: true, kunst: k });
}
{
  const y = yAt(10.0), u = uAt(10.0);
  let k = schatten(0, 0.3, 6, 1, 0.3);
  const EI = "#26292d";
  k += `<path d="M-4 0 L-3.4 ${r(-0.45 * u)} M4 0 L3.4 ${r(-0.45 * u)} M-2.8 0 L-3 ${r(-0.45 * u)} M2.8 0 L3 ${r(-0.45 * u)}" stroke="${EI}" stroke-width=".8"/>`;
  k += `<path d="M-4.4 ${r(-0.45 * u)} L4.4 ${r(-0.45 * u)} L4 ${r(-0.45 * u + 1.4)} L-4 ${r(-0.45 * u + 1.4)} Z" fill="#3a3f45"/>`;
  k += `<path d="M-3.8 ${r(-0.45 * u)} L-3.6 ${r(-0.9 * u)} L3.6 ${r(-0.9 * u)} L3.8 ${r(-0.45 * u)}" stroke="${EI}" stroke-width=".9" fill="none"/>`;
  for (let i = 1; i < 4; i++) k += `<line x1="-3.6" y1="${r(-0.45 * u - i * 2.6)}" x2="3.6" y2="${r(-0.45 * u - i * 2.6)}" stroke="${EI}" stroke-width=".6"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 11, y, steht: true, kunst: k });
}
{
  /* Fish and Chips: Bierteig-Fisch, dicke Pommes, Zitrone, Erbsenpüree, im Papierkorb */
  let k = `<path d="M-6.4 0 L6.4 0 L7.6 -2.8 L-7.6 -2.8 Z" fill="#e9e2cf"/><path d="M-7.6 -2.8 L7.6 -2.8" stroke="#c9bfa6" stroke-width=".3"/>`;
  k += `<path d="M-6 -2.6 Q-5 -6.6 2 -6 Q5.8 -5.4 6.4 -3 Z" fill="${S.lg("teig", [[0, "#f1c46a"], [1, "#c98a2e"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-4 + i * 1.8)}" cy="${r(-4.6 + (i % 2) * 0.6)}" r=".5" fill="#e3ad52"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${r(-6.4 + i * 1.2)}" y="${r(-4.2 - (i % 3) * 0.6)}" width=".9" height="3.4" rx=".3" fill="#f4d47a" transform="rotate(${-20 + i * 6} ${r(-6 + i * 1.2)} -3)"/>`;
  k += `<path d="M4.2 -3.4 Q5.6 -6 7 -3.4 Z" fill="#f4e04c"/><ellipse cx="3" cy="-3" rx="1.6" ry=".8" fill="#7ab648"/>`;
  S.teil({ oben: true, id: "fishandchips", de: "Fisch mit Pommes", syl: "FISCH mit POM-mes", it: "pesce e patatine", itSyl: "PE-sce e pa-ta-TI-ne", en: "fish and chips", x: 26, y: r(PLATTE + 0.2), steht: true, kunst: k + flaeche(-8, -7.4, 16, 7.8),
    tipp: "Fish and Chips: Fisch im Bierteig mit dicken Pommes – dazu Salz und Essig." });
}
{
  let k = `<ellipse cx="0" cy="-.2" rx="3.4" ry=".8" fill="#ece9e2"/>`;
  k += `<path d="M-2.2 -5 L2.2 -5 L2 -.4 Q0 .3 -2 -.4 Z" fill="${S.lg("teetasse", [[0, "#ffffff"], [0.7, "#efece5"], [1, "#d1ccc2"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-5" rx="2.2" ry=".55" fill="#b0855a"/>`;
  k += `<path d="M2.1 -4.2 q1.7 .2 1.4 1.5 q-.3 1 -1.6 .7" stroke="#e8e5de" stroke-width=".6" fill="none"/>`;
  k += `<path d="M-.4 -6.2 q-.8 -1.2 0 -2.2 q.8 -1 0 -2" stroke="#fff" stroke-width=".4" opacity=".6" fill="none"/>`;
  S.teil({ oben: true, id: "tee", de: "der Tee mit Milch", syl: "TEE mit MILCH", it: "il tè con latte", itSyl: "TÈ con LAT-te", en: "tea with milk", x: 36.4, y: r(PLATTE + 0.4), steht: true, kunst: k + flaeche(-3.6, -8.6, 7.6, 9),
    tipp: "Die Briten trinken ihren schwarzen Tee meistens mit einem Schuss Milch." });
}

/* =====================================================================
   14 — DIE TAUBE (auf dem Gehweg)
   ===================================================================== */
{
  const taube = (x, s, sp) => {
    let g = `<ellipse cx="${x}" cy="-.2" rx="${r(2.4 * s)}" ry=".4" fill="#000" opacity=".2"/>`;
    g += `<path d="M${x - 2.6 * s * sp} ${r(-2 * s)} Q${x} ${r(-4.4 * s)} ${x + 2.2 * s * sp} ${r(-2.6 * s)} Q${x + 1 * s * sp} ${r(-0.6 * s)} ${x - 1.6 * s * sp} ${r(-1 * s)} Z" fill="${S.lg("taube", [[0, "#9aa3ad"], [1, "#6c7580"]])}"/>`;
    g += `<path d="M${x - 2.4 * s * sp} ${r(-1.9 * s)} L${x - 3.8 * s * sp} ${r(-1.5 * s)} L${x - 2.2 * s * sp} ${r(-1.2 * s)} Z" fill="#4c535c"/>`;
    g += `<circle cx="${x + 2.2 * s * sp}" cy="${r(-3.4 * s)}" r="${r(0.9 * s)}" fill="#6f7884"/><path d="M${x + 1.6 * s * sp} ${r(-2.8 * s)} Q${x + 2.2 * s * sp} ${r(-2 * s)} ${x + 1.2 * s * sp} ${r(-1.8 * s)}" stroke="#5f9a7a" stroke-width="${r(0.5 * s)}" fill="none"/>`;
    g += `<path d="M${x + 3 * s * sp} ${r(-3.4 * s)} l${r(0.7 * s * sp)} .2" stroke="#e0a07a" stroke-width=".3"/><circle cx="${x + 2.4 * s * sp}" cy="${r(-3.6 * s)}" r=".18" fill="#d9531e"/>`;
    g += `<path d="M${x} ${r(-1 * s)} l0 ${r(1 * s)} M${x + 0.6 * s * sp} ${r(-1 * s)} l0 ${r(1 * s)}" stroke="#d27a6a" stroke-width=".3"/>`;
    return g;
  };
  const k = taube(-3, 1.1, 1) + taube(5, 1, -1);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 216, y: 190, steht: true, kunst: k + flaeche(-8, -6, 17, 6.6) });
}

/* =====================================================================
   15 — DIE TOURISTIN und 16 — DER REGENSCHIRM
   ===================================================================== */
{
  const H = 1.66 * uAt(9.8);
  const m = B.mensch({ id: "b25a_tour", geschlecht: "w", pose: "halten", blick: 24, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "beige" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, H);
  const X = 148, Y = yAt(9.8);
  S.teil({ id: "touristin", de: "die Touristin", syl: "Tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: X, y: Y, kunst: m.svg,
    tipp: "Die Touristin fotografiert Big Ben – trotz Regen." });
  const hand = m.z.handL.y < m.z.handR.y ? m.z.handL : m.z.handR;
  const hx = hand.x * m.k, hy = hand.y * m.k;
  let k = `<line x1="${r(hx)}" y1="${r(hy + 1.6)}" x2="${r(hx + 1.2)}" y2="${r(-H - 4)}" stroke="#2a2a2a" stroke-width=".55"/>`;
  k += `<path d="M${r(hx)} ${r(hy + 1.6)} q0 1.6 -1.2 1.4" stroke="#5a3a22" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  const cx = hx + 1.2, cy = -H - 4;
  k += `<path d="M${r(cx - 14)} ${r(cy + 4)} Q${r(cx - 12)} ${r(cy - 6)} ${r(cx)} ${r(cy - 7.4)} Q${r(cx + 12)} ${r(cy - 6)} ${r(cx + 14)} ${r(cy + 4)} Q${r(cx + 10.5)} ${r(cy + 2.2)} ${r(cx + 7)} ${r(cy + 4)} Q${r(cx + 3.5)} ${r(cy + 2.2)} ${r(cx)} ${r(cy + 4)} Q${r(cx - 3.5)} ${r(cy + 2.2)} ${r(cx - 7)} ${r(cy + 4)} Q${r(cx - 10.5)} ${r(cy + 2.2)} ${r(cx - 14)} ${r(cy + 4)} Z" fill="${S.lg("schirm", [[0, "#2a3f6e"], [1, "#16244a"]])}"/>`;
  for (const t of [-7, 0, 7]) k += `<path d="M${r(cx)} ${r(cy - 7.4)} Q${r(cx + t * 0.7)} ${r(cy - 3)} ${r(cx + t)} ${r(cy + 4)}" stroke="#0e1834" stroke-width=".35" fill="none"/>`;
  k += `<path d="M${r(cx - 10)} ${r(cy - 2)} Q${r(cx - 6)} ${r(cy - 6.4)} ${r(cx)} ${r(cy - 7)}" stroke="#fff" stroke-width=".7" opacity=".25" fill="none"/>`;
  k += `<line x1="${r(cx)}" y1="${r(cy - 7.4)}" x2="${r(cx)}" y2="${r(cy - 9)}" stroke="#2a2a2a" stroke-width=".6"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${r(cx - 12 + i * 6)}" cy="${r(cy + 4.6 + (i % 2) * 1.2)}" r=".35" fill="#cfe0ee" opacity=".8"/>`;
  S.teil({ anker: [149, 146], oben: true, id: "regenschirm", de: "der Regenschirm", syl: "RE-gen-schirm", it: "l'ombrello", itSyl: "om-BREL-lo", en: "umbrella", x: X, y: Y, kunst: k,
    tipp: "In London hat man immer einen Regenschirm dabei." });
}

/* Nieselregen vor allem (fängt keinen Tipp ab) */
{
  let v = "";
  for (let i = 0; i < 70; i++) { const x = rnd() * 330, y = rnd() * 200, l = 3 + rnd() * 4; v += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x - l * 0.22)}" y2="${r(y + l)}" stroke="#e6edf3" stroke-width=".25" opacity="${r(0.25 + rnd() * 0.25)}"/>`; }
  S.davor(v);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/grossbritannien.js"));
console.log(aus);
