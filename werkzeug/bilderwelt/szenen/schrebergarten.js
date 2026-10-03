#!/usr/bin/env node
/* =====================================================================
   DER SCHREBERGARTEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Kleingartenordnung Köln 2023, Gartenordnungen Neuss,
   Würzburg, Plankstadt; Bundeskleingartengesetz):
   - Die PARZELLE (meist 250–400 m²) ist gepachtet. Die LAUBE darf höchstens
     24 m² groß sein, mit überdachtem Freisitz; Wohnen ist verboten.
   - Mindestens ein Drittel der Fläche dient dem Anbau von Obst und
     Gemüse: BEETE mit Salat, Kohlrabi, Möhren, Erdbeeren, Tomaten an
     Spiralstäben, Stangenbohnen; dazu ein OBSTBAUM.
   - Typisch: REGENTONNE am Fallrohr der Laube, KOMPOSTER in der Ecke,
     Rasen mit LIEGESTUHL und HOLLYWOODSCHAUKEL, KUGELGRILL auf der
     Terrasse, FAHNENMAST, GARTENZWERG.
   - Außen eine niedrige HECKE (Liguster), zum Nachbarn ein niedriger
     LATTENZAUN; die GARTENORDNUNG hängt im Schaukasten des Vereins.
   Maßstab: Augenhöhe y = 92, Brennweite 230 → Einheiten je Meter =
   230 / Entfernung. Laube (12,5 m) ≈ 18 je Meter, Beet vorne ≈ 52 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "schrebergarten", titel: "Der Schrebergarten", emoji: "🌻", thema: "Freizeit", kuerzel: "b13d", fassung: 852 });
const rnd = zufall(1864);
const r = B.r;

const VX = 160, VY = 92, F = 230, AUGE = 1.6;
const sk = (d) => F / d;
const PX = (xw, d) => VX + xw * F / d;
const PY = (h, d) => VY + (AUGE - h) * F / d;
const P = (xw, h, d) => `${r(PX(xw, d))} ${r(PY(h, d))}`;
const G = (X, Y, svg) => `<g transform="translate(${r(-X)} ${r(-Y)})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#b07a45"], [1, "#8a5a30"]], 0, 0, 1, 0);
const HOLZ_GRUEN = S.lg("holzgruen", [[0, "#4f7a5a"], [1, "#355a40"]], 0, 0, 1, 0);
const LAUB = S.rg("laub", [[0, "#8ab65e"], [0.6, "#5a8a3c"], [1, "#355f26"]], 0.4, 0.35, 0.7);
const ERDE = S.lg("erde", [[0, "#5e4028"], [1, "#7a5638"]]);
const KANNE = S.lg("kanne", [[0, "#2f7f8f"], [0.5, "#4fa8b8"], [1, "#215f6b"]], 0, 0, 1, 0);
const LIGUSTER = S.lg("liguster", [[0, "#5d8a40"], [1, "#355a26"]]);
S.def(`<pattern id="${S.id("gras")}" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#7aa64c"/><path d="M.5 3 l.3 -1.6 M1.6 3 l-.2 -1.3 M2.8 3 l.4 -1.8 M3.6 3 l-.2 -1.1" stroke="#5a8636" stroke-width=".35"/><path d="M1.1 3 l.2 -1 M3.2 3 l-.1 -1.2" stroke="#9cc866" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("blatt")}" width="5" height="4" patternUnits="userSpaceOnUse"><rect width="5" height="4" fill="#4a7a34"/><ellipse cx="1.2" cy="1" rx="1.3" ry=".8" fill="#6a9a48"/><ellipse cx="3.8" cy="2.6" rx="1.4" ry=".9" fill="#5a8a3c"/><ellipse cx="1.6" cy="3.4" rx="1" ry=".6" fill="#3a6428"/></pattern>`);

/* =====================================================================
   KULISSE — Himmel, Nachbargärten, Rasen, Terrasse, Trittplatten
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="120" fill="${S.lg("himmel", [[0, "#7fb2e0"], [0.7, "#cfe2f1"], [1, "#eef3f6"]])}"/>`);
S.hinten(`<ellipse cx="240" cy="16" rx="30" ry="6" fill="#fff" opacity=".8"/><ellipse cx="258" cy="12" rx="16" ry="5" fill="#fff" opacity=".85"/><ellipse cx="60" cy="30" rx="22" ry="4" fill="#fff" opacity=".6"/>`);
/* hinter der Hecke: Bäume und Lauben der Nachbargärten */
{
  let b = "";
  for (let i = 0; i < 18; i++) { const x = i * 19 + rnd() * 8, h = 18 + rnd() * 16; b += `<ellipse cx="${r(x)}" cy="${r(98 - h / 2)}" rx="${r(10 + rnd() * 6)}" ry="${r(h / 2 + 3)}" fill="${rnd() < 0.5 ? "#6f9a5a" : "#5d8a4c"}"/>`; }
  for (const [x, w, f] of [[30, 26, "#a5523a"], [205, 22, "#5a6a7a"], [275, 24, "#8a4a34"]]) b += `<rect x="${x}" y="88" width="${w}" height="12" fill="#e9dcc0"/><path d="M${x - 2} 88 L${x + w / 2} 80 L${x + w + 2} 88 Z" fill="${f}"/>`;
  S.hinten(b);
}
/* Rasen */
S.hinten(`<rect x="0" y="96" width="320" height="104" fill="url(#${S.id("gras")})"/><rect x="0" y="96" width="320" height="104" fill="${S.lg("rasenlicht", [[0, "#24381a", 0.25], [0.45, "#24381a", 0], [1, "#fff6d8", 0.1]])}"/>`);
/* Nachbargarten rechts hinter dem Zaun: etwas anderer Rasen, ein Beet */
S.hinten(`<path d="M${P(4.0, 0, 18)} L320 ${r(PY(0, 18))} L320 200 L${P(4.0, 0, 5.2)} Z" fill="#86ad55" opacity=".35"/>`);
/* Terrasse aus Gehwegplatten vor der Laube */
{
  let t = `<path d="M${P(-4.9, 0, 12.2)} L${P(0.6, 0, 12.2)} L${P(0.6, 0, 9.4)} L${P(-4.9, 0, 9.4)} Z" fill="#c9c0ae"/>`;
  for (let xw = -4.9; xw <= 0.61; xw += 0.5) t += `<line x1="${r(PX(xw, 12.2))}" y1="${r(PY(0, 12.2))}" x2="${r(PX(xw, 9.4))}" y2="${r(PY(0, 9.4))}" stroke="#a39a88" stroke-width=".3"/>`;
  for (let d = 9.9; d < 12.2; d += 0.5) t += `<line x1="${r(PX(-4.9, d))}" y1="${r(PY(0, d))}" x2="${r(PX(0.6, d))}" y2="${r(PY(0, d))}" stroke="#a39a88" stroke-width=".3"/>`;
  /* Trittplatten über den Rasen */
  for (const d of [8.6, 7.7, 6.9, 6.2]) t += `<path d="M${P(-0.15, 0, d + 0.2)} L${P(0.35, 0, d + 0.2)} L${P(0.35, 0, d - 0.2)} L${P(-0.15, 0, d - 0.2)} Z" fill="#bdb4a2"/>`;
  S.hinten(t);
}

/* =====================================================================
   1 — DIE HECKE (Liguster, hinten)
   ===================================================================== */
{
  const d = 18, s = sk(d), Y = PY(0, d), H = 1.2 * s;
  let k = `<path d="M-160 0 L-160 ${r(-H + 2)}`;
  for (let x = -160; x < 160; x += 6) k += ` Q${x + 3} ${r(-H - 1.6)} ${x + 6} ${r(-H + 1)}`;
  k += ` L160 0 Z" fill="${LIGUSTER}"/>`;
  k += `<rect x="-160" y="${r(-H)}" width="320" height="${r(H)}" fill="url(#${S.id("blatt")})" opacity=".5"/>`;
  k += `<rect x="-160" y="${r(-H - 1.5)}" width="320" height="5" fill="${S.lg("heckelicht", [[0, "#d8eaa0", 0.4], [1, "#d8eaa0", 0]])}"/>`;
  S.teil({ id: "hecke", de: "die Hecke", syl: "HE-cke", it: "la siepe", itSyl: "SIE-pe", en: "hedge", x: VX, y: Y, kunst: k,
    tipp: "Die Hecke darf im Kleingarten nicht zu hoch sein — meist höchstens 1,25 Meter." });
}

/* =====================================================================
   2 — DER FAHNENMAST (links hinter der Laube)
   ===================================================================== */
{
  const d = 14.5, s = sk(d), X = PX(-6.1, d), Y = PY(0, d), H = 5.6 * s;
  let k = schatten(0, 0.3, 3, .8, .25) + `<rect x="-.6" y="${r(-H)}" width="1.2" height="${r(H)}" fill="${S.lg("mast", [[0, "#d9dee2"], [0.5, "#ffffff"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/><circle cx="0" cy="${r(-H - 0.8)}" r="1" fill="#c9a13f"/>`;
  /* Fahne Schwarz-Rot-Gold, leicht wehend */
  const fw = 1.5 * s, fh = 0.9 * s, y0 = -H + 1;
  const welle = (y) => `M.6 ${r(y)} Q${r(fw * 0.35)} ${r(y - 1.6)} ${r(fw * 0.6)} ${r(y)} T${r(fw)} ${r(y)}`;
  k += `<path d="${welle(y0)} L${r(fw)} ${r(y0 + fh / 3)} Q${r(fw * 0.6)} ${r(y0 + fh / 3 + 1.6)} .6 ${r(y0 + fh / 3)} Z" fill="#1d1d1d"/>`;
  k += `<path d="M.6 ${r(y0 + fh / 3)} Q${r(fw * 0.6)} ${r(y0 + fh / 3 + 1.6)} ${r(fw)} ${r(y0 + fh / 3)} L${r(fw)} ${r(y0 + 2 * fh / 3)} Q${r(fw * 0.6)} ${r(y0 + 2 * fh / 3 + 1.6)} .6 ${r(y0 + 2 * fh / 3)} Z" fill="#d0021b"/>`;
  k += `<path d="M.6 ${r(y0 + 2 * fh / 3)} Q${r(fw * 0.6)} ${r(y0 + 2 * fh / 3 + 1.6)} ${r(fw)} ${r(y0 + 2 * fh / 3)} L${r(fw)} ${r(y0 + fh)} Q${r(fw * 0.6)} ${r(y0 + fh + 1.6)} .6 ${r(y0 + fh)} Z" fill="#f2c400"/>`;
  S.teil({ id: "fahnenmast", de: "der Fahnenmast", syl: "FAH-nen-mast", it: "il pennone", itSyl: "pen-NO-ne", en: "flagpole", x: X, y: Y, kunst: k,
    tipp: "Am Fahnenmast weht die Fahne — oft auch die vom Fußballverein." });
}

/* =====================================================================
   3 — DIE LAUBE (Gartenhaus mit überdachtem Freisitz)
   ===================================================================== */
const LB = { d: 12.5, x0: -4.7, x1: -0.3 };
{
  const d = LB.d, s = sk(d), xa = PX(LB.x0, d), xb = PX(LB.x1, d), Y = PY(0, d), X = (xa + xb) / 2, W = xb - xa;
  const hw = 2.3 * s, hf = 3.5 * s;
  let k = schatten(0, 0.6, W / 2 + 4, 2, 0.3);
  /* Holzwand, senkrechte Bretter, grün gestrichen */
  k += `<rect x="${r(-W / 2)}" y="${r(-hw)}" width="${r(W)}" height="${r(hw)}" fill="${HOLZ_GRUEN}"/>`;
  for (let x = -W / 2 + 2.2; x < W / 2; x += 2.2) k += `<line x1="${r(x)}" y1="${r(-hw)}" x2="${r(x)}" y2="0" stroke="#284a32" stroke-width=".35" opacity=".7"/>`;
  /* Tür mit Fensterchen, Fenster mit Gardine und Blumenkasten */
  k += `<rect x="${r(-W * 0.06)}" y="${r(-1.95 * s)}" width="${r(0.85 * s)}" height="${r(1.95 * s)}" fill="#e9dcc0"/><rect x="${r(-W * 0.06 + 1)}" y="${r(-1.95 * s + 1)}" width="${r(0.85 * s - 2)}" height="${r(1.95 * s - 1)}" fill="#a8774a"/><rect x="${r(-W * 0.06 + 3)}" y="${r(-1.75 * s)}" width="${r(0.85 * s - 6)}" height="${r(0.6 * s)}" fill="#9cc3d8"/><circle cx="${r(-W * 0.06 + 0.85 * s - 3)}" cy="${r(-0.95 * s)}" r=".6" fill="#c9a13f"/>`;
  const fx = -W * 0.38, fy = -1.85 * s, fwid = 1.1 * s, fhoch = 0.9 * s;
  k += `<rect x="${r(fx - 1)}" y="${r(fy - 1)}" width="${r(fwid + 2)}" height="${r(fhoch + 2)}" fill="#f2ead8"/><rect x="${r(fx)}" y="${r(fy)}" width="${r(fwid)}" height="${r(fhoch)}" fill="${S.lg("scheibe", [[0, "#cfe3ee"], [1, "#7fa6bd"]])}"/>`;
  k += `<path d="M${r(fx)} ${r(fy)} Q${r(fx + fwid * 0.25)} ${r(fy + fhoch * 0.5)} ${r(fx + 2)} ${r(fy + fhoch)} L${r(fx)} ${r(fy + fhoch)} Z M${r(fx + fwid)} ${r(fy)} Q${r(fx + fwid * 0.75)} ${r(fy + fhoch * 0.5)} ${r(fx + fwid - 2)} ${r(fy + fhoch)} L${r(fx + fwid)} ${r(fy + fhoch)} Z" fill="#fbf6ea" opacity=".9"/>`;
  k += `<line x1="${r(fx + fwid / 2)}" y1="${r(fy)}" x2="${r(fx + fwid / 2)}" y2="${r(fy + fhoch)}" stroke="#f2ead8" stroke-width=".8"/>`;
  k += `<rect x="${r(fx - 1)}" y="${r(fy + fhoch + 1)}" width="${r(fwid + 2)}" height="3.2" fill="#8a5a30"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(fx + i * (fwid / 7))}" cy="${r(fy + fhoch + 0.4)}" r="1.3" fill="${i % 2 ? "#d0021b" : "#e8457a"}"/><circle cx="${r(fx + i * (fwid / 7) + 1)}" cy="${r(fy + fhoch + 1.4)}" r="1" fill="#4f8a3a"/>`;
  /* Satteldach mit Dachpappe, Ortgang weiß, Vordach über dem Freisitz */
  k += `<path d="M${r(-W / 2 - 4)} ${r(-hw + 1)} L0 ${r(-hf)} L${r(W / 2 + 4)} ${r(-hw + 1)} Z" fill="${S.lg("dach", [[0, "#6a6058"], [1, "#4a423b"]])}"/>`;
  k += `<path d="M${r(-W / 2 - 4)} ${r(-hw + 1)} L0 ${r(-hf)} L${r(W / 2 + 4)} ${r(-hw + 1)}" stroke="#f4efe4" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M${r(-W * 0.12)} ${r(-hw + 4)} L${r(-W * 0.12)} ${r(-hf + 6)} L${r(W * 0.12)} ${r(-hf + 6)} L${r(W * 0.12)} ${r(-hw + 4)} Z" fill="#284a32"/><rect x="${r(-W * 0.08)}" y="${r(-hf + 9)}" width="${r(W * 0.16)}" height="4" fill="#cfe3ee"/>`;
  /* Fallrohr links zur Regentonne */
  k += `<rect x="${r(-W / 2 - 3.4)}" y="${r(-hw + 1)}" width="${r(W + 6.8)}" height="1.4" rx=".6" fill="#9aa3aa"/><rect x="${r(-W / 2 - 3.4)}" y="${r(-hw + 1)}" width="1.4" height="${r(hw - 0.9 * s)}" fill="#9aa3aa"/>`;
  S.teil({ id: "sg_laube", de: "die Laube", syl: "LAU-be", it: "la casetta da giardino", itSyl: "ca-SET-ta", en: "garden shed", x: X, y: Y, steht: true, kunst: k,
    tipp: "Das Häuschen auf der Parzelle. Wohnen darf man darin nicht — nur den Tag verbringen." });
}

/* =====================================================================
   4 — DIE REGENTONNE (unter dem Fallrohr, links an der Laube)
   ===================================================================== */
{
  const d = LB.d - 0.4, s = sk(d), X = PX(LB.x0 - 0.35, d), Y = PY(0, d), H = 0.95 * s, W = 0.62 * s;
  let k = schatten(0, 0.4, W / 2 + 1.5, 1.1, 0.3);
  k += `<path d="M${r(-W / 2)} ${r(-H)} Q${r(-W / 2 - 1.2)} ${r(-H / 2)} ${r(-W / 2)} 0 L${r(W / 2)} 0 Q${r(W / 2 + 1.2)} ${r(-H / 2)} ${r(W / 2)} ${r(-H)} Z" fill="${S.lg("tonne", [[0, "#2c5a34"], [0.4, "#4f8a52"], [1, "#22462a"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.25, 0.75]) k += `<path d="M${r(-W / 2 - 0.6)} ${r(-H * t)} Q0 ${r(-H * t + 1.4)} ${r(W / 2 + 0.6)} ${r(-H * t)}" stroke="#1d3a22" stroke-width=".6" fill="none"/>`;
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(W / 2)}" ry="1.6" fill="#1d3a22"/><ellipse cx="0" cy="${r(-H + 0.3)}" rx="${r(W / 2 - 1)}" ry="1.1" fill="#4f6f7a"/>`;
  k += `<rect x="${r(W / 2 - 3)}" y="${r(-H * 0.18)}" width="2.4" height="1.2" fill="#c9a13f"/>`;
  S.teil({ id: "regentonne", de: "die Regentonne", syl: "RE-gen-ton-ne", it: "il bidone per l'acqua piovana", itSyl: "bi-DO-ne per l'AC-qua pio-VA-na", en: "rain barrel", x: X, y: Y, steht: true, kunst: k,
    tipp: "Das Regenwasser vom Dach ist gratis und gut für die Pflanzen." });
}

/* =====================================================================
   5 — DER APFELBAUM (rechts hinten) und DIE HOLLYWOODSCHAUKEL
   ===================================================================== */
{
  const d = 12.8, s = sk(d), X = PX(2.9, d), Y = PY(0, d);
  let k = schatten(0, 0.4, 12, 2, 0.25);
  k += `<path d="M-1.8 0 Q-1.4 -12 -1 -26 L1.2 -26 Q1.6 -12 2.2 0 Z" fill="${S.lg("stamm", [[0, "#5a4632"], [0.5, "#7a6248"], [1, "#4a3828"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-.4 -24 Q-6 -32 -12 -34 M.6 -24 Q6 -34 12 -36" stroke="#5a4632" stroke-width="1.4" fill="none"/>`;
  for (let i = 0; i < 16; i++) { const a = rnd() * Math.PI * 2, rr = rnd() * 16; k += `<ellipse cx="${r(Math.cos(a) * rr * 1.3)}" cy="${r(-44 + Math.sin(a) * rr * 0.7)}" rx="${r(8 + rnd() * 5)}" ry="${r(7 + rnd() * 4)}" fill="${LAUB}"/>`; }
  for (let i = 0; i < 16; i++) { const x = -20 + rnd() * 40, y = -56 + rnd() * 24; k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.25" fill="${S.rg("apfel", [[0, "#ff8a6a"], [0.6, "#d62828"], [1, "#8f1414"]], 0.35, 0.3, 0.75)}"/>`; }
  S.teil({ id: "apfelbaum", de: "der Apfelbaum", syl: "AP-fel-baum", it: "il melo", itSyl: "ME-lo", en: "apple tree", x: X, y: Y, kunst: k,
    tipp: "Im Herbst wird geerntet: Äpfel für Kuchen, Mus und Saft." });
}
{
  const d = 9.6, s = sk(d), X = PX(1.55, d), Y = PY(0, d), W = 2.0 * s, H = 1.75 * s, SH = 0.5 * s;
  let k = schatten(0, 0.5, W / 2 + 3, 1.8, 0.28);
  /* Stahlgestell (weiß), A-Füße */
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * W / 2 - 3)} 0 L${r(sx * W / 2)} ${r(-H)} L${r(sx * W / 2 + 3)} 0" stroke="#e9ecee" stroke-width="1.1" fill="none"/>`;
  k += `<line x1="${r(-W / 2)}" y1="${r(-H)}" x2="${r(W / 2)}" y2="${r(-H)}" stroke="#e9ecee" stroke-width="1.1"/>`;
  /* Sonnendach gestreift */
  k += `<path d="M${r(-W / 2 - 3)} ${r(-H + 3)} L${r(-W / 2 + 1)} ${r(-H - 4)} L${r(W / 2 - 1)} ${r(-H - 4)} L${r(W / 2 + 3)} ${r(-H + 3)} Z" fill="#f6efe0"/>`;
  for (let i = 0; i < 8; i++) { const a = -W / 2 + 1 + i * (W - 2) / 8; k += `<path d="M${r(a)} ${r(-H - 4)} L${r(a + (W - 2) / 16)} ${r(-H - 4)} L${r(a * 1.06 + (W - 2) / 16 * 1.1)} ${r(-H + 3)} L${r(a * 1.06)} ${r(-H + 3)} Z" fill="#2f7f6a"/>`; }
  for (let i = 0; i < 10; i++) k += `<path d="M${r(-W / 2 - 3 + i * (W + 6) / 10)} ${r(-H + 3)} q${r((W + 6) / 20)} 2 ${r((W + 6) / 10)} 0" fill="#f6efe0" stroke="#2f7f6a" stroke-width=".3"/>`;
  /* Sitzbank an Ketten: Polster */
  for (const sx of [-1, 1]) k += `<line x1="${r(sx * (W / 2 - 4))}" y1="${r(-H)}" x2="${r(sx * (W / 2 - 4))}" y2="${r(-SH - 0.45 * s)}" stroke="#8a939a" stroke-width=".35"/>`;
  k += `<rect x="${r(-W / 2 + 3)}" y="${r(-SH - 0.55 * s)}" width="${r(W - 6)}" height="${r(0.5 * s)}" rx="1.4" fill="${S.lg("polster", [[0, "#3f9a82"], [1, "#2a6b5a"]])}"/>`;
  k += `<rect x="${r(-W / 2 + 3)}" y="${r(-SH - 0.08 * s)}" width="${r(W - 6)}" height="${r(0.14 * s)}" rx="1" fill="#2a6b5a"/>`;
  for (let i = 1; i < 4; i++) k += `<line x1="${r(-W / 2 + 3 + i * (W - 6) / 4)}" y1="${r(-SH - 0.5 * s)}" x2="${r(-W / 2 + 3 + i * (W - 6) / 4)}" y2="${r(-SH - 0.1 * s)}" stroke="#1f5244" stroke-width=".35"/>`;
  S.teil({ id: "hollywoodschaukel", de: "die Hollywoodschaukel", syl: "HOL-ly-wood-schau-kel", it: "il dondolo da giardino", itSyl: "DON-do-lo da giar-DI-no", en: "swing seat", x: X, y: Y, steht: true, kunst: k,
    tipp: "Auf der Hollywoodschaukel schaukelt man ganz gemütlich zu zweit." });
}

/* =====================================================================
   6 — DER KUGELGRILL (Terrasse) und DER LIEGESTUHL (Rasen)
   ===================================================================== */
{
  const d = 10.1, s = sk(d), X = PX(-0.4, d), Y = PY(0, d), H = 0.95 * s, R = 0.3 * s;
  let k = schatten(0, 0.4, R + 2, 1.2, 0.3);
  for (const sx of [-1, 0, 1]) k += `<line x1="${r(sx * R * 0.55)}" y1="${r(-H + R * 0.9)}" x2="${r(sx * R * 0.85)}" y2="0" stroke="#2b2f33" stroke-width=".8"/>`;
  k += `<path d="M${r(-R)} ${r(-H + R * 0.9)} A${r(R)} ${r(R * 0.95)} 0 0 0 ${r(R)} ${r(-H + R * 0.9)} Z" fill="${S.rg("kessel", [[0, "#4a4f55"], [1, "#16191c"]], 0.35, 0.3, 0.8)}"/>`;
  k += `<path d="M${r(-R)} ${r(-H + R * 0.9)} A${r(R)} ${r(R * 0.9)} 0 0 1 ${r(R)} ${r(-H + R * 0.9)} Z" fill="${S.rg("deckel", [[0, "#5a6067"], [1, "#1d2125"]], 0.35, 0.3, 0.8)}"/>`;
  k += `<rect x="-1.4" y="${r(-H - 0.05 * s)}" width="2.8" height="1.2" rx=".5" fill="#2b2f33"/><path d="M${r(-R * 0.6)} ${r(-H + R * 0.4)} Q${r(-R * 0.2)} ${r(-H + R * 0.1)} ${r(R * 0.1)} ${r(-H + R * 0.2)}" stroke="#fff" stroke-width=".5" opacity=".3" fill="none"/>`;
  k += `<path d="M${r(R * 0.2)} ${r(-H - 2)} q-1.4 -3 0 -6 q1.4 -3 0 -6" stroke="#d9d9d9" stroke-width=".6" fill="none" opacity=".5"/>`;
  S.teil({ id: "grill", de: "der Grill", syl: "GRILL", it: "il barbecue", itSyl: "bar-be-CUE", en: "barbecue grill", x: X, y: Y, steht: true, kunst: k,
    tipp: "Am Wochenende wird gegrillt: Würstchen, Steaks und Gemüse." });
}
{
  const d = 7.4, s = sk(d), X = PX(-1.75, d), Y = PY(0, d), L = 1.1 * s, Hs = 0.35 * s, Hl = 0.95 * s;
  let k = schatten(0, 0.4, L / 2 + 2, 1.4, 0.25);
  /* Holzgestell: hinten hoch (Lehne), vorn niedrig */
  k += `<path d="M${r(-L / 2)} 0 L${r(-L * 0.25)} ${r(-Hl)} M${r(-L * 0.3)} 0 L${r(-L * 0.12)} ${r(-Hs)} L${r(L / 2)} ${r(-Hs * 0.6)} M${r(L * 0.42)} 0 L${r(L / 2)} ${r(-Hs * 0.6)}" stroke="${HOLZ}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  /* Stoffbespannung gestreift (blau-weiß) */
  k += `<path d="M${r(-L * 0.25)} ${r(-Hl)} Q${r(-L * 0.2)} ${r(-Hs * 0.6)} ${r(-L * 0.05)} ${r(-Hs * 0.85)} Q${r(L * 0.2)} ${r(-Hs * 1.05)} ${r(L * 0.46)} ${r(-Hs * 0.8)} L${r(L * 0.44)} ${r(-Hs * 1.2)} Q${r(L * 0.2)} ${r(-Hs * 1.45)} ${r(-L * 0.04)} ${r(-Hs * 1.3)} Q${r(-L * 0.14)} ${r(-Hl * 0.8)} ${r(-L * 0.19)} ${r(-Hl - 1)} Z" fill="${S.lg("stoff", [[0, "#2a5ea8"], [0.2, "#2a5ea8"], [0.2, "#f6f2e6"], [0.4, "#f6f2e6"], [0.4, "#2a5ea8"], [0.6, "#2a5ea8"], [0.6, "#f6f2e6"], [0.8, "#f6f2e6"], [0.8, "#2a5ea8"]], 0, 0, 1, 1)}"/>`;
  S.teil({ id: "sg_liegestuhl", de: "der Liegestuhl", syl: "LIE-ge-stuhl", it: "la sdraio", itSyl: "SDRA-io", en: "deck chair", x: X, y: Y, steht: true, kunst: k,
    tipp: "Zum Ausruhen, wenn das Beet fertig ist." });
}

/* =====================================================================
   7 — DER GARTENZAUN zum Nachbarn (rechts, Lattenzaun in die Tiefe),
       DIE GARTENORDNUNG im Schaukasten, DER NACHBAR
   ===================================================================== */
const ZX = 4.0;
{
  const dv = 5.85, dh = 18, Y = PY(0, dv), X = PX(ZX, dv);
  let g = "";
  /* Querlatten */
  for (const h of [0.25, 0.75]) g += `<path d="M${P(ZX, h, dh)} L${P(ZX, h, dv)} L${P(ZX, h + 0.07, dv)} L${P(ZX, h + 0.07, dh)} Z" fill="#c9b08a"/>`;
  /* Latten mit Spitzen */
  for (let d = dh; d >= dv; d -= 0.16) {
    const s = sk(d), x = PX(ZX, d), w = 0.07 * s, top = PY(1.0, d), bot = PY(0, d);
    g += `<path d="M${r(x - w / 2)} ${r(bot)} L${r(x - w / 2)} ${r(top + w)} L${r(x)} ${r(top)} L${r(x + w / 2)} ${r(top + w)} L${r(x + w / 2)} ${r(bot)} Z" fill="${d % 0.32 < 0.16 ? "#efe6d2" : "#e3d8bf"}" stroke="#b9a582" stroke-width="${r(Math.min(0.3, 0.012 * s))}"/>`;
  }
  for (const d of [17, 13, 10, 8, 6.5]) { const s = sk(d); g += `<rect x="${r(PX(ZX, d) - 0.05 * s)}" y="${r(PY(1.1, d))}" width="${r(0.1 * s)}" height="${r(1.1 * s)}" fill="#8a6a42"/>`; }
  S.teil({ id: "sg_zaun", de: "der Gartenzaun", syl: "GAR-ten-zaun", it: "la staccionata", itSyl: "stac-cio-NA-ta", en: "garden fence", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Ein niedriger Lattenzaun — zum Abgrenzen, nicht zum Aussperren." });
}
{
  /* Schaukasten des Vereins am Hauptweg hinter dem Zaun */
  const d = 11.5, s = sk(d), X = PX(ZX + 0.6, d), Y = PY(0, d), H = 1.75 * s, W = 0.95 * s, h = 0.7 * s;
  let k = `<rect x="-.8" y="${r(-H + h)}" width="1.6" height="${r(H - h)}" fill="#6b4a2a"/>`;
  k += `<path d="M${r(-W / 2 - 1.5)} ${r(-H - 1)} L0 ${r(-H - 4)} L${r(W / 2 + 1.5)} ${r(-H - 1)} Z" fill="#5a3a20"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(h)}" fill="#7a5230"/><rect x="${r(-W / 2 + 1)}" y="${r(-H + 1)}" width="${r(W - 2)}" height="${r(h - 2)}" fill="#f6f2e6"/>`;
  k += `<text x="0" y="${r(-H + 3.4)}" font-size="2" text-anchor="middle" fill="#2c4a34" font-family="Arial" font-weight="bold">Gartenordnung</text>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(-W / 2 + 2)}" y="${r(-H + 4.6 + i * 1.6)}" width="${r(W - 4 - (i % 2) * 3)}" height=".5" fill="#8a8f96"/>`;
  k += `<rect x="${r(-W / 2 + 1)}" y="${r(-H + 1)}" width="${r(W - 2)}" height="${r(h - 2)}" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "sg_gartenordnung", de: "die Gartenordnung", syl: "GAR-ten-ord-nung", it: "il regolamento del giardino", itSyl: "re-go-la-MEN-to", en: "allotment rules", x: X, y: Y, kunst: k,
    tipp: "Sie hängt am Eingang und gilt für alle: Ruhezeiten, Hecken-höhe, was man anbauen muss." });
}
{
  const d = 8.2, s = sk(d), X = PX(ZX + 0.75, d), Y = PY(0, d);
  const m = B.mensch({ id: "b13d_nachbar", geschlecht: "m", pose: "winken", blick: -38, frisur: "glatze", haarfarbe: "grau", haut: "hell", bart: "voll",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, unterteil: { stueck: "shorts", farbe: "beige" }, jacke: { stueck: "weste", farbe: "gruen_d" }, schuhe: { stueck: "sandale", farbe: "braun" }, kopf: { stueck: "kappe", farbe: "gruen_d" } } }, 1.78 * s);
  S.teil({ id: "sg_nachbar", de: "der Nachbar", syl: "NACH-bar", it: "il vicino", itSyl: "vi-CI-no", en: "neighbour", x: X, y: Y, kunst: m.svg,
    tipp: "Über den Zaun hinweg redet man — das ist der halbe Sinn der Sache." });
}

/* =====================================================================
   8 — DER KOMPOSTER (links vorne in der Ecke, Holzlatten)
   ===================================================================== */
{
  const d = 6.0, s = sk(d), X = PX(-3.55, d), Y = PY(0, d), W = 0.95 * s, H = 0.8 * s, T = 0.18 * s;
  let k = schatten(0, 0.4, W / 2 + 2, 1.4, 0.3);
  /* Oberseite (Kompost sichtbar) */
  k += `<path d="M${r(-W / 2)} ${r(-H)} L${r(W / 2)} ${r(-H)} L${r(W / 2 - 3)} ${r(-H - T)} L${r(-W / 2 + 3)} ${r(-H - T)} Z" fill="${ERDE}"/>`;
  for (let i = 0; i < 12; i++) k += `<ellipse cx="${r(-W / 2 + 4 + rnd() * (W - 8))}" cy="${r(-H - rnd() * T * 0.8)}" rx="1.2" ry=".5" fill="${["#7a9a3a", "#c9a13f", "#e2d2a6", "#5a7a2a"][i % 4]}"/>`;
  /* Latten */
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-W / 2)}" y="${r(-H + i * H / 6)}" width="${r(W)}" height="${r(H / 6 - 0.8)}" fill="${S.lg("kompostholz", [[0, "#a8834e"], [1, "#7e5f34"]])}"/>`;
  for (const x of [-W / 2, W / 2 - 2.2]) k += `<rect x="${r(x)}" y="${r(-H - 1)}" width="2.2" height="${r(H + 1)}" fill="#6b4f2a"/>`;
  S.teil({ id: "sg_komposter", de: "der Komposter", syl: "Kom-POS-ter", it: "la compostiera", itSyl: "com-po-STIE-ra", en: "compost bin", x: X, y: Y, steht: true, kunst: k,
    tipp: "Grünabfall kommt hinein, nach einem Jahr kommt Erde heraus." });
  /* Korrektur: alt „il compostiera“ — compostiera ist feminin, richtig „la compostiera“. */
}

/* =====================================================================
   9 — DIE PARZELLE (die Rasenfläche des eigenen Gartens) und DAS BEET (Lupe)
   ===================================================================== */
{
  const dv = 4.0, dh = 17.6, Y = PY(0, 7), X = VX;
  const dz = ZX * F / 160;
  let g = `<path d="M0 ${r(PY(0, dh))} L${P(ZX - 0.05, 0, dh)} L320 ${r(PY(0, dz))} L320 200 L0 200 Z" fill="#7aa64c" opacity=".001"/>`;
  /* Parzellennummer auf einem Stein am Rand */
  const d = 7.9, s = sk(d), x = PX(-0.55, d), y = PY(0, d);
  g += schatten(x, y + 0.3, 0.22 * s, 1, 0.3) + `<path d="M${r(x - 0.2 * s)} ${r(y)} Q${r(x - 0.22 * s)} ${r(y - 0.2 * s)} ${r(x)} ${r(y - 0.22 * s)} Q${r(x + 0.22 * s)} ${r(y - 0.2 * s)} ${r(x + 0.2 * s)} ${r(y)} Z" fill="${S.lg("stein", [[0, "#d8d2c4"], [1, "#a8a094"]])}"/><text x="${r(x)}" y="${r(y - 0.06 * s)}" font-size="${r(0.11 * s)}" text-anchor="middle" fill="#2c4a34" font-family="Georgia" font-weight="bold">17</text>`;
  S.teil({ id: "sg_parzelle", de: "die Parzelle", syl: "Par-ZEL-le", it: "il lotto", itSyl: "LOT-to", en: "allotment plot", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Ein einzelner Garten im Verein. Man pachtet ihn, man kauft ihn nicht. Diese hat die Nummer 17." });
}
const BEET = { dv: 4.15, dm: 4.95, dh: 5.85, xa: -2.35, xb: 1.15 };
{
  const { dv, dm, dh, xa, xb } = BEET, X = PX((xa + xb) / 2, dv), Y = PY(0, dv);
  /* Erde mit Holzeinfassung */
  let g = `<path d="M${P(xa, 0.12, dh)} L${P(xb, 0.12, dh)} L${P(xb, 0.12, dv)} L${P(xa, 0.12, dv)} Z" fill="${ERDE}"/>`;
  g += `<path d="M${P(xa, 0, dv)} L${P(xb, 0, dv)} L${P(xb, 0.15, dv)} L${P(xa, 0.15, dv)} Z" fill="${HOLZ}"/><path d="M${P(xb, 0, dv)} L${P(xb, 0, dh)} L${P(xb, 0.15, dh)} L${P(xb, 0.15, dv)} Z" fill="#8a5a30"/>`;
  for (let i = 0; i < 30; i++) { const t = rnd(), d = dv + 0.1 + rnd() * (dh - dv - 0.2); g += `<path d="M${r(PX(xa + 0.1 + t * (xb - xa - 0.2), d) - 1.2)} ${r(PY(0.12, d))} h2.4" stroke="#4a3220" stroke-width=".4" opacity=".6"/>`; }
  const spalten = [xa + 0.05, xa + (xb - xa) / 3, xa + 2 * (xb - xa) / 3, xb - 0.05];
  const unter = [];
  const feld = (si, vorne, id, de, syl, it, itSyl, en, tipp, mal) => {
    const a = spalten[si], b = spalten[si + 1], d0 = vorne ? dv + 0.1 : dm + 0.05, d1 = vorne ? dm - 0.05 : dh - 0.1;
    for (let d = d1; d >= d0 - 0.001; d -= (d1 - d0) / 2) for (let j = 0; j < 3; j++) { const xw = a + (b - a) * (j + 0.5) / 3; g += mal(PX(xw, d), PY(0.12, d), sk(d)); }
    const dmid = (d0 + d1) / 2, ux = PX((a + b) / 2, d0), uy = PY(0.12, d0), w = PX(b, d0) - PX(a, d0);
    const hoch = 12;
    unter.push({ id, de, syl, it, itSyl, en, tipp, x: ux, y: uy, kunst: flaeche(-w / 2 + 0.5, -(uy - PY(0.12, d1)) - hoch * 0.4, w - 1, uy - PY(0.12, d1) + hoch * 0.4 + 1) });
  };
  /* vordere Reihe: Erdbeeren, Salat, Kohlrabi */
  feld(0, true, "erdbeere", "die Erdbeere", "ERD-bee-re", "la fragola", "FRA-go-la", "strawberry", "Erdbeeren reifen im Juni. Stroh darunter hält sie sauber.",
    (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 0.04 * s)}" rx="${r(0.16 * s)}" ry="${r(0.07 * s)}" fill="#3f7a2e"/><path d="M${r(x - 0.08 * s)} ${r(y - 0.03 * s)} q.6 1.8 1.2 0 Z M${r(x + 0.06 * s)} ${r(y - 0.02 * s)} q.6 1.8 1.2 0 Z" fill="#e0262e"/><ellipse cx="${r(x)}" cy="${r(y + 0.01 * s)}" rx="${r(0.18 * s)}" ry="${r(0.03 * s)}" fill="#e3c97a" opacity=".6"/>`);
  feld(1, true, "salat", "der Salat", "sa-LAT", "la lattuga", "lat-TU-ga", "lettuce", "Salat wächst schnell — nach sechs Wochen kann man ernten.",
    (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 0.07 * s)}" rx="${r(0.15 * s)}" ry="${r(0.1 * s)}" fill="${S.rg("salat", [[0, "#d8f08a"], [0.6, "#8ac44a"], [1, "#4f8a2a"]], 0.5, 0.4, 0.7)}"/><path d="M${r(x - 0.1 * s)} ${r(y - 0.08 * s)} q${r(0.1 * s)} ${r(-0.08 * s)} ${r(0.2 * s)} 0" stroke="#4f8a2a" stroke-width=".3" fill="none"/>`);
  feld(2, true, "kohlrabi", "der Kohlrabi", "kohl-RA-bi", "il cavolo rapa", "CA-vo-lo RA-pa", "kohlrabi", "Kohlrabi ist eine Knolle — sie wächst über der Erde.",
    (x, y, s) => `<circle cx="${r(x)}" cy="${r(y - 0.07 * s)}" r="${r(0.07 * s)}" fill="${S.rg("kohlrabi", [[0, "#e6f2c8"], [1, "#a8c878"]], 0.4, 0.35, 0.7)}"/>` + [-0.7, 0, 0.7].map((a) => `<path d="M${r(x)} ${r(y - 0.12 * s)} q${r(Math.sin(a) * 0.08 * s)} ${r(-0.12 * s)} ${r(Math.sin(a) * 0.16 * s)} ${r(-0.18 * s)}" stroke="#5a8a3c" stroke-width=".4" fill="none"/><ellipse cx="${r(x + Math.sin(a) * 0.16 * s)}" cy="${r(y - 0.31 * s)}" rx="${r(0.05 * s)}" ry="${r(0.03 * s)}" fill="#6a9a48"/>`).join(""));
  /* hintere Reihe: Möhren, Tomaten an Spiralstäben, Stangenbohnen */
  feld(0, false, "moehre", "die Möhre", "MÖH-re", "la carota", "ca-RO-ta", "carrot", "Die Möhre wächst in der Erde. Oben sieht man nur das Grün.",
    (x, y, s) => `<path d="M${r(x - 0.03 * s)} ${r(y)} l${r(0.03 * s)} ${r(0.03 * s)} l${r(0.03 * s)} ${r(-0.03 * s)} Z" fill="#ef7d1a"/>` + [-1, -0.4, 0.3, 0.9].map((a) => `<path d="M${r(x)} ${r(y)} q${r(a * 0.05 * s)} ${r(-0.1 * s)} ${r(a * 0.09 * s)} ${r(-0.2 * s)}" stroke="#5aa03a" stroke-width=".35" fill="none"/>`).join(""));
  feld(1, false, "radieschen", "das Radieschen", "Ra-DIES-chen", "il ravanello", "ra-va-NEL-lo", "radish", "Radieschen sind nach vier Wochen reif — schneller geht kein Gemüse.",
    (x, y, s) => [-0.08, 0.08].map((dx) => `<circle cx="${r(x + dx * s)}" cy="${r(y - 0.02 * s)}" r="${r(0.035 * s)}" fill="#d8264a"/><path d="M${r(x + dx * s)} ${r(y - 0.05 * s)} q${r(-0.05 * s)} ${r(-0.08 * s)} ${r(-0.07 * s)} ${r(-0.14 * s)} M${r(x + dx * s)} ${r(y - 0.05 * s)} q${r(0.05 * s)} ${r(-0.08 * s)} ${r(0.07 * s)} ${r(-0.13 * s)}" stroke="#4f8a3a" stroke-width="${r(0.025 * s)}" fill="none"/>`).join(""));
  feld(2, false, "zwiebel", "die Zwiebel", "ZWIE-bel", "la cipolla", "ci-POL-la", "onion", "Wenn das Grün umknickt, ist die Zwiebel reif.",
    (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 0.03 * s)}" rx="${r(0.05 * s)}" ry="${r(0.04 * s)}" fill="${S.rg("zwiebel", [[0, "#f2d49a"], [1, "#b8803a"]], 0.4, 0.35, 0.7)}"/>` + [-0.5, 0, 0.5].map((a) => `<path d="M${r(x)} ${r(y - 0.06 * s)} l${r(Math.sin(a) * 0.06 * s)} ${r(-0.26 * s)}" stroke="#5aa03a" stroke-width="${r(0.018 * s)}"/>`).join(""));
  const zx = PX(xa, dh) - 4, zy = PY(0.5, dh) - 4;
  S.teil({ id: "sg_beet", de: "das Beet", syl: "BEET", it: "l'aiuola", itSyl: "a-IUO-la", en: "bed", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    zoom: { x: r(zx), y: r(zy), w: r(PX(xb, dv) - zx + 4), h: r((PX(xb, dv) - zx + 4) / 1.5) }, unter,
    tipp: "In der Gartenordnung steht, wie viel Beet sein muss: ein Drittel der Fläche für Obst und Gemüse." });
}

/* =====================================================================
   10 — DER GARTENZWERG, DIE PÄCHTERIN mit der GIESSKANNE
   ===================================================================== */
{
  const d = 4.45, s = sk(d), X = PX(1.75, d), Y = PY(0, d), h = 0.32 * s;
  let k = schatten(0, 0.3, 0.12 * s, 0.8, 0.3);
  k += `<path d="M${r(-0.1 * s)} 0 L${r(0.1 * s)} 0 L${r(0.09 * s)} ${r(-0.12 * s)} L${r(-0.09 * s)} ${r(-0.12 * s)} Z" fill="#3a5a8a"/>`;
  k += `<path d="M${r(-0.1 * s)} ${r(-0.11 * s)} Q${r(-0.12 * s)} ${r(-0.22 * s)} 0 ${r(-0.23 * s)} Q${r(0.12 * s)} ${r(-0.22 * s)} ${r(0.1 * s)} ${r(-0.11 * s)} Z" fill="#2f7f3a"/>`;
  k += `<path d="M${r(-0.06 * s)} ${r(-0.2 * s)} Q0 ${r(-0.12 * s)} ${r(0.06 * s)} ${r(-0.2 * s)} L0 ${r(-0.14 * s)} Z" fill="#f4f1ea"/>`;
  k += `<circle cx="0" cy="${r(-0.235 * s)}" r="${r(0.045 * s)}" fill="#f0c8a8"/><circle cx="${r(0.012 * s)}" cy="${r(-0.225 * s)}" r=".45" fill="#e8907a"/>`;
  k += `<path d="M${r(-0.055 * s)} ${r(-0.25 * s)} Q${r(-0.02 * s)} ${r(-0.4 * s)} ${r(0.05 * s)} ${r(-h)} Q${r(0.03 * s)} ${r(-0.33 * s)} ${r(0.055 * s)} ${r(-0.25 * s)} Z" fill="#d0021b"/>`;
  k += `<rect x="${r(-0.11 * s)}" y="${r(-0.13 * s)}" width="${r(0.22 * s)}" height="${r(0.02 * s)}" fill="#3a2a1a"/>`;
  S.teil({ id: "sg_zwerg", de: "der Gartenzwerg", syl: "GAR-ten-zwerg", it: "il nano da giardino", itSyl: "NA-no", en: "garden gnome", x: X, y: Y, kunst: k,
    tipp: "Kein Garten ohne mindestens einen." });
}
const PAE = { d: 5.5, xw: 1.75 };
const paechterin = B.mensch({ id: "b13d_paechterin", geschlecht: "w", pose: "halten", blick: -52, frisur: "zopf", haarfarbe: "rot", haut: "hell", laecheln: true,
  kleidung: { oberteil: { stueck: "bluse", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "gummistiefel", farbe: "gruen_d" }, kopf: { stueck: "hut", farbe: "beige" } } }, 1.67 * sk(PAE.d));
{
  const X = PX(PAE.xw, PAE.d), Y = PY(0, PAE.d);
  S.teil({ id: "sg_paechterin", de: "die Pächterin", syl: "PÄCH-te-rin", it: "l'affittuaria", itSyl: "af-fit-tu-A-ria", en: "tenant", x: X, y: Y, kunst: paechterin.svg,
    tipp: "Ihr gehört der Garten nicht — sie hat ihn gepachtet und zahlt Pacht." });
}
{
  /* Gießkanne in ihrer vorderen Hand, gießt die Bohnen */
  const X = PX(PAE.xw, PAE.d), Y = PY(0, PAE.d), z = paechterin.z, k0 = paechterin.k;
  const hand = [z.handL, z.handR].sort((a, b) => a.x - b.x)[0];
  const hx = hand.x * k0, hy = hand.y * k0, s = sk(PAE.d);
  let k = `<g transform="translate(${r(hx)} ${r(hy + 1)}) rotate(-18)">`;
  k += `<path d="M${r(-0.13 * s)} ${r(0.2 * s)} L${r(0.13 * s)} ${r(0.2 * s)} L${r(0.11 * s)} 0 L${r(-0.11 * s)} 0 Z" fill="${KANNE}"/>`;
  k += `<path d="M${r(-0.08 * s)} 0 Q0 ${r(-0.1 * s)} ${r(0.08 * s)} 0" stroke="#215f6b" stroke-width=".9" fill="none"/>`;
  k += `<path d="M${r(-0.12 * s)} ${r(0.15 * s)} L${r(-0.36 * s)} ${r(-0.02 * s)}" stroke="#2f7f8f" stroke-width="1.2"/><ellipse cx="${r(-0.37 * s)}" cy="${r(-0.03 * s)}" rx="1.2" ry=".8" fill="#215f6b" transform="rotate(-35 ${r(-0.37 * s)} ${r(-0.03 * s)})"/></g>`;
  /* Wasserstrahl von der Tülle in die Zwiebelreihe */
  const w = -18 * Math.PI / 180, tx = -0.37 * s, ty = -0.03 * s;
  const sx = hx + tx * Math.cos(w) - ty * Math.sin(w), sy = hy + 1 + tx * Math.sin(w) + ty * Math.cos(w);
  const zx = PX(0.85, BEET.dh - 0.25) - X, zy = PY(0.15, BEET.dh - 0.25) - Y;
  k += `<path d="M${r(sx)} ${r(sy)} Q${r(sx - 3)} ${r(sy + 1)} ${r(zx)} ${r(zy)}" stroke="#cfe8f6" stroke-width=".9" fill="none" opacity=".8" stroke-dasharray="1.6 .7"/>`;
  k += `<ellipse cx="${r(zx)}" cy="${r(zy)}" rx="2.4" ry=".7" fill="#cfe8f6" opacity=".5"/>`;
  S.teil({ oben: true, id: "sg_giesskanne", de: "die Gießkanne", syl: "GIESS-kan-ne", it: "l'annaffiatoio", itSyl: "an-naf-fia-TO-io", en: "watering can", x: X, y: Y, kunst: k,
    tipp: "Abends gießen, nicht mittags — sonst verdunstet alles." });
}

/* =====================================================================
   11 — DIE SONNENBLUMEN (links hinter dem Komposter)
   ===================================================================== */
{
  const d = 7.5, s = sk(d), X = PX(-4.55, d), Y = PY(0, d);
  let k = "";
  for (const [dx, h, a] of [[-0.25, 1.75, -6], [0.05, 2.0, 3], [0.32, 1.6, 9]]) {
    const x = dx * s, top = -h * s;
    k += `<path d="M${r(x)} 0 Q${r(x + 1)} ${r(top / 2)} ${r(x + Math.sin(a * Math.PI / 180) * 4)} ${r(top)}" stroke="#4f8a2a" stroke-width="1.1" fill="none"/>`;
    for (const t of [0.3, 0.5, 0.7]) k += `<path d="M${r(x)} ${r(top * t)} q${r((t * 10 % 2 ? 1 : -1) * 5)} -2 ${r((t * 10 % 2 ? 1 : -1) * 7)} 1 q-3 2 ${r((t * 10 % 2 ? -1 : 1) * 7)} -1" fill="#5a9a3a"/>`;
    const cx = x + Math.sin(a * Math.PI / 180) * 4, cy = top;
    for (let i = 0; i < 14; i++) { const w = i / 14 * Math.PI * 2; k += `<ellipse cx="${r(cx + Math.cos(w) * 4.2)}" cy="${r(cy + Math.sin(w) * 4.2)}" rx="2.2" ry=".9" fill="#f6c21a" transform="rotate(${r(w * 180 / Math.PI)} ${r(cx + Math.cos(w) * 4.2)} ${r(cy + Math.sin(w) * 4.2)})"/>`; }
    k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="3" fill="${S.rg("kern", [[0, "#6a4a1a"], [1, "#3a2410"]])}"/>`;
  }
  S.teil({ id: "sonnenblume", de: "die Sonnenblume", syl: "SON-nen-blu-me", it: "il girasole", itSyl: "gi-ra-SO-le", en: "sunflower", x: X, y: Y, kunst: k,
    tipp: "Sonnenblumen werden über zwei Meter hoch und drehen sich zur Sonne." });
}

/* Die Parzelle (Rasenfläche) liegt ganz hinten in der Zeichenfolge, direkt nach der Hecke */
const vor = (id, vorId) => { const i = S.teile.findIndex((t) => t.id === id); const [t] = S.teile.splice(i, 1); S.teile.splice(S.teile.findIndex((u) => u.id === vorId), 0, t); };
vor("sg_parzelle", "fahnenmast");
vor("sg_nachbar", "sg_zaun");
vor("sonnenblume", "sg_komposter");

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/schrebergarten.js"));
console.log(aus);
