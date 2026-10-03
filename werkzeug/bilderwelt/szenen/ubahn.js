#!/usr/bin/env node
/* =====================================================================
   DIE U-BAHN-STATION (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort „identisch mit seinem Original“, alle
   Stationen logisch, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (U-Bahnhöfe in Berlin und München, z. B. Münchner Freiheit,
   BVG-Bahnhöfe mit Seitenbahnsteig):
   - Ein U-Bahnhof liegt unter der Erde: niedrige Decke mit Lichtbändern,
     geflieste Wände, Granit- oder Kunststeinboden.
   - Am Rand des BAHNSTEIGS die BAHNSTEIGKANTE (heller Kantenstein),
     dahinter die weiße SICHERHEITSLINIE mit Rillen für Blinde.
   - Im GLEIS zwei Schienen und die Stromschiene; der ZUG fährt mit
     Licht ein, vorn die Zielanzeige mit Linie und Ziel.
   - Über dem Bahnsteig hängt die ZUGZIELANZEIGE („U3 Nordpark 1 min“),
     eine Bahnhofsuhr und das blaue U-SCHILD mit dem Weg zum Ausgang.
   - An der Wand: Stationsname, LINIENPLAN (Netzplan) im Rahmen; auf dem
     Bahnsteig FAHRKARTENAUTOMAT und ENTWERTER (rotes Kästchen an einer
     Stange: Fahrkarte stempeln!), BANK, MÜLLEIMER, am Ende die ROLLTREPPE
     nach oben.
   Perspektive: Zentralperspektive den Bahnsteig entlang (Fluchtpunkt
   140|92, Augenhöhe 1,6 m, Brennweite 320). Der Bahnsteig liegt 1 m über
   den Schienen. Maßstab: Fahrgast in 6,3 m Abstand ≈ 51 Einheiten je
   Meter (1,66 m ≈ 84).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "ubahn", titel: "Die U-Bahn-Station", emoji: "🚇", thema: "Unterwegs", kuerzel: "b06c", fassung: 852 });
const rnd = zufall(8803);
const r = B.r;

/* ---------- Projektion (Zentralperspektive) und Zuschnitt ------------- */
const F = 320, AUGE = 1.6, VX = 140, VY = 92;
const P = (X, Z, H = 0) => [r(VX + X * F / Z), r(VY + (AUGE - H) * F / Z)];
const M = (Z) => F / Z;
const RX0 = -0.5, RX1 = 320.5, RY0 = -0.5, RY1 = 200.5;
function rahmen(pts) {
  const kanten = [[(p) => p[0] >= RX0, (a, b) => [RX0, a[1] + (b[1] - a[1]) * (RX0 - a[0]) / (b[0] - a[0])]],
    [(p) => p[0] <= RX1, (a, b) => [RX1, a[1] + (b[1] - a[1]) * (RX1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= RY0, (a, b) => [a[0] + (b[0] - a[0]) * (RY0 - a[1]) / (b[1] - a[1]), RY0]],
    [(p) => p[1] <= RY1, (a, b) => [a[0] + (b[0] - a[0]) * (RY1 - a[1]) / (b[1] - a[1]), RY1]]];
  let q = pts;
  for (const [drin, schnitt] of kanten) {
    const n = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length];
      if (drin(a)) { n.push(a); if (!drin(b)) n.push(schnitt(a, b)); } else if (drin(b)) n.push(schnitt(a, b));
    }
    q = n;
    if (!q.length) break;
  }
  return q.map((p) => [r(p[0]), r(p[1])]);
}
const poly = (pts, fill, extra = "") => { const q = rahmen(pts); return q.length < 3 ? "" : `<path d="M${q.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`; };
function linie(a, b, farbe, w, extra = "") {
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - RX0], [dx, RX1 - a[0]], [-dy, a[1] - RY0], [dy, RY1 - a[1]]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
  }
  if (t0 > t1) return "";
  return `<line x1="${r(a[0] + dx * t0)}" y1="${r(a[1] + dy * t0)}" x2="${r(a[0] + dx * t1)}" y2="${r(a[1] + dy * t1)}" stroke="${farbe}" stroke-width="${w}"${extra}/>`;
}
const fX = (X, Z0, Z1, H0, H1) => [P(X, Z0, H1), P(X, Z1, H1), P(X, Z1, H0), P(X, Z0, H0)];
const fZ = (Z, X0, X1, H0, H1) => [P(X0, Z, H1), P(X1, Z, H1), P(X1, Z, H0), P(X0, Z, H0)];
const boden = (X0, X1, Z0, Z1, H) => [P(X0, Z0, H), P(X1, Z0, H), P(X1, Z1, H), P(X0, Z1, H)];
const T = (x, y, s, txt, fill, anchor = "start", w = "normal", fam = "Arial,Helvetica,sans-serif") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${anchor}" fill="${fill}" font-family="${fam}" font-weight="${w}">${txt}</text>`;
const absolut = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
const kasten = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glow")}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const BLAU = "#1e5aa8";

/* Raummaße */
const KANTE = -2.2, WR = 4.2, WL = -5.8, HD = 3.8, SCH = -1.0, ZE = 60;   // Kante, Wände, Decke, Schienenhöhe, Bahnhofsende

/* =====================================================================
   KULISSE — Decke mit Lichtbändern, geflieste Wände, Gleisbett, Ende
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="#2a2d30"/>`;
  /* Decke */
  k += poly([P(WL, 3, HD), P(WR, 3, HD), P(WR, ZE, HD), P(WL, ZE, HD)], S.lg("decke", [[0, "#cfd2cf"], [1, "#9ea39f"]]));
  for (let Z = 4; Z < ZE; Z += 1.5) k += linie(P(WL, Z, HD), P(WR, Z, HD), "#8e938f", r(Math.min(0.6, 4 / Z)));
  /* Lichtbänder (Leuchtstoff) über Bahnsteig und Gleis */
  for (const X of [-3.6, 0.2, 2.6]) k += poly([P(X - 0.12, 3, HD - 0.02), P(X + 0.12, 3, HD - 0.02), P(X + 0.12, ZE, HD - 0.02), P(X - 0.12, ZE, HD - 0.02)], "#fffdf2");
  /* rechte Wand: Fliesen hell, Band in Grün mit Stationsnamen-Feldern */
  k += poly(fX(WR, 3, ZE, 0, HD), S.lg("wandr", [[0, "#efe8cf"], [1, "#d9d1b6"]]));
  k += poly(fX(WR, 3, ZE, 2.1, 2.75), "#2f6b4f");
  k += poly(fX(WR, 3, ZE, 0, 0.18), "#5b5f5a");
  for (let H = 0.3; H < HD; H += 0.3) k += linie(P(WR, 3, H), P(WR, ZE, H), "#cbc3a6", ".25");
  for (let Z = 3; Z < ZE; Z += (Z < 14 ? 0.3 : 0.6)) k += linie(P(WR, Z, 0.18), P(WR, Z, HD), "#cbc3a6", r(Math.min(0.3, 2.4 / Z)));
  /* linke Tunnelwand hinter dem Gleis */
  k += poly(fX(WL, 3, ZE, SCH, HD), S.lg("wandl", [[0, "#d7d0b6"], [1, "#b9b298"]]));
  k += poly(fX(WL, 3, ZE, 2.1, 2.75), "#2f6b4f");
  for (let Z = 18; Z < ZE; Z += 4) { const a = P(WL, Z, 2.2), b = P(WL, Z + 2.6, 2.65); k += poly([a, [b[0], a[1]], b, [a[0], b[1]]], "#f2efe4", ` opacity=".85"`); }
  /* Gleisbett: Betonsohle */
  k += poly([P(WL, 3, SCH), P(KANTE, 3, SCH), P(KANTE, ZE, SCH), P(WL, ZE, SCH)], S.lg("sohle", [[0, "#3d3a36"], [1, "#55514b"]]));
  /* Ende des Bahnhofs: Tunnelmund links, Wand mit Treppe rechts */
  k += poly(fZ(ZE, WL, WR, SCH, HD), "#c9c2a7");
  k += poly(fZ(ZE, WL + 0.4, KANTE - 0.2, SCH, 2.6), "#0d0f11");
  k += poly(fZ(ZE, 0.5, 3.4, 0, 2.6), "#7b7663");
  S.hinten(k);
}

/* =====================================================================
   1 — DER BAHNSTEIG (Granitplatten) — liegt unter allem
   ===================================================================== */
{
  let k = poly([P(KANTE, 3.2, 0), P(WR, 3.2, 0), P(WR, ZE, 0), P(KANTE, ZE, 0)], S.lg("bahnsteig", [[0, "#7f7d78"], [1, "#a9a69f"]]));
  for (let X = KANTE + 0.6; X < WR; X += 0.6) k += linie(P(X, 4.6), P(X, ZE), "#6c6a65", ".3");
  for (let Z = 5; Z < ZE; Z += 0.6) k += linie(P(KANTE, Z), P(WR, Z), "#6c6a65", r(Math.min(0.35, 3 / Z)));
  for (let i = 0; i < 160; i++) { const X = KANTE + 0.3 + rnd() * 6, Z = 5 + rnd() * 20, p = P(X, Z); if (p[0] > 318 || p[1] > 199) continue; k += `<circle cx="${p[0]}" cy="${p[1]}" r="${r(0.2 + rnd() * 0.25)}" fill="${rnd() < 0.5 ? "#9a978f" : "#6a6863"}" opacity=".6"/>`; }
  /* Spiegelung der Lichtbänder */
  for (const X of [0.2, 2.6]) k += poly([P(X - 0.25, 4.8), P(X + 0.25, 4.8), P(X + 0.25, ZE), P(X - 0.25, ZE)], "#fff", ` opacity=".08"`);
  const p = P(1.0, 5.4);
  S.teil({ id: "ub_bahnsteig", de: "der Bahnsteig", syl: "BAHN-steig", it: "la banchina", itSyl: "ban-CHI-na", en: "platform", x: p[0], y: p[1], kunst: absolut(p[0], p[1], k),
    tipp: "Hinter der weißen Linie warten, bis der Zug steht." });
}

/* =====================================================================
   2 — DAS GLEIS (Schienen, Schwellen, Stromschiene)
   ===================================================================== */
{
  let k = "";
  for (let Z = 4; Z < ZE; Z += 0.65) k += poly([P(-4.7, Z, SCH + 0.02), P(-2.7, Z, SCH + 0.02), P(-2.7, Z + 0.25, SCH + 0.02), P(-4.7, Z + 0.25, SCH + 0.02)], "#5d554b");
  for (const X of [-4.42, -2.98]) {
    k += poly([P(X - 0.04, 3.5, SCH + 0.16), P(X + 0.04, 3.5, SCH + 0.16), P(X + 0.04, ZE, SCH + 0.16), P(X - 0.04, ZE, SCH + 0.16)], "#d9dde0");
    k += poly([P(X + 0.04, 3.5, SCH + 0.16), P(X + 0.04, ZE, SCH + 0.16), P(X + 0.04, ZE, SCH + 0.02), P(X + 0.04, 3.5, SCH + 0.02)], "#5a4a3e");
  }
  /* Stromschiene an der Tunnelseite mit gelber Schutzabdeckung */
  k += poly([P(-5.25, 3.5, SCH + 0.32), P(-5.05, 3.5, SCH + 0.32), P(-5.05, ZE, SCH + 0.32), P(-5.25, ZE, SCH + 0.32)], "#e3b22a");
  /* Bahnsteigkante von der Gleisseite (Wand bis zur Sohle) */
  k += poly(fX(KANTE, 3.2, ZE, SCH, 0), S.lg("kantewand", [[0, "#4a4741"], [1, "#2c2a27"]]));
  const p = P(-3.7, 8.5, SCH);
  S.teil({ id: "ub_gleis", de: "das Gleis", syl: "GLEIS", it: "il binario", itSyl: "bi-NA-rio", en: "track", x: p[0], y: p[1], kunst: absolut(p[0], p[1], k),
    tipp: "Ins Gleis darf man nie steigen: Die Stromschiene steht unter Strom." });
}

/* =====================================================================
   3 — DIE U-BAHN (fährt mit Licht ein) — Lupe: Tür, Scheinwerfer
   ===================================================================== */
const ZUG = { X0: -5.02, X1: -2.38, Z0: 13, H0: SCH + 0.15, H1: 2.45 };
{
  const { X0, X1, Z0, H0, H1 } = ZUG;
  const GELB = S.lg("zuggelb", [[0, "#ffd64a"], [0.6, "#f2c018"], [1, "#d39f0c"]]);
  let k = "";
  /* Seite zum Bahnsteig */
  k += poly(fX(X1, Z0, ZE, H0, H1 - 0.15), GELB);
  k += poly([P(X1, Z0, H1 - 0.15), P(X1, ZE, H1 - 0.15), P(X1 - 0.3, ZE, H1), P(X1 - 0.3, Z0 + 0.1, H1)], "#f7e6a0");
  k += poly(fX(X1, Z0 + 0.4, ZE, 1.0, 2.05), S.lg("zugfenster", [[0, "#2c3a44"], [1, "#465a68"]]));
  /* Türen paarweise; zwischen den Türen Fenster */
  const tueren = [];
  for (let Z = 15.2; Z < ZE - 2; Z += 4.6) tueren.push(Z);
  tueren.forEach((Z) => {
    k += poly(fX(X1 - 0.01, Z, Z + 1.3, 0.05, 2.15), "#c99a10");
    k += poly(fX(X1 - 0.02, Z + 0.06, Z + 0.62, 0.1, 2.1), "#e9b81a");
    k += poly(fX(X1 - 0.02, Z + 0.68, Z + 1.24, 0.1, 2.1), "#e9b81a");
    k += poly(fX(X1 - 0.03, Z + 0.14, Z + 0.56, 1.0, 1.95), "#33444f");
    k += poly(fX(X1 - 0.03, Z + 0.74, Z + 1.16, 1.0, 1.95), "#33444f");
  });
  for (let Z = Z0 + 1.6; Z < ZE; Z += 2.3) k += linie(P(X1, Z, 1.0), P(X1, Z, 2.05), "#d9a810", r(Math.min(0.8, 9 / Z)));
  k += poly(fX(X1, Z0, ZE, H0, H0 + 0.25), "#3a3a36");
  /* Stirnseite (Front) */
  k += poly(fZ(Z0, X0, X1, H0, H1 - 0.1), S.lg("front", [[0, "#ffe27a"], [1, "#e9b616"]], 0, 0, 1, 0));
  k += poly([P(X0, Z0, H1 - 0.1), P(X1, Z0, H1 - 0.1), P(X1 - 0.2, Z0 + 0.15, H1), P(X0 + 0.2, Z0 + 0.15, H1)], "#f7e6a0");
  k += poly(fZ(Z0, X0 + 0.18, X1 - 0.18, 0.78, 2.12), "#1d1f22");
  k += poly(fZ(Z0, X0 + 0.1, X1 - 0.1, 0.62, 0.7), "#8a6a08");
  k += poly(fZ(Z0, X0 + 0.25, X1 - 0.25, 0.85, 2.05), S.lg("scheibe", [[0, "#5d7486"], [0.5, "#26343e"], [1, "#3b4f5e"]]));
  k += poly([P(X0 + 0.4, Z0, 1.95), P(X0 + 0.9, Z0, 1.95), P(X0 + 0.55, Z0, 0.95), P(X0 + 0.35, Z0, 0.95)], "#fff", ` opacity=".16"`);
  /* Zielanzeige oben in der Scheibe */
  k += poly(fZ(Z0, X0 + 0.45, X1 - 0.45, 1.72, 1.98), "#0c0d0e");
  { const a = P(X0 + 0.5, Z0, 1.77), b = P(X1 - 0.5, Z0, 1.77), s = r(0.2 * M(Z0));
    k += `<rect x="${r(a[0])}" y="${r(a[1] - s * 0.95)}" width="${r(s * 1.6)}" height="${r(s * 0.95)}" fill="#ffb21e"/>` + T(a[0] + s * 0.8, a[1] - s * 0.15, s * 0.8, "U3", "#111", "middle", "bold") + T(b[0], b[1] - s * 0.15, s * 0.85, "Nordpark", "#ffb21e", "end", "bold", "monospace"); }
  /* Scheinwerfer (an) mit Lichthof */
  const sw = [P(X0 + 0.42, Z0, 0.55), P(X1 - 0.42, Z0, 0.55)];
  for (const X of [X0 + 0.22, X1 - 0.22]) { const q = P(X, Z0, 0.32); k += `<rect x="${r(q[0] - 1.6)}" y="${r(q[1] - 0.9)}" width="3.2" height="1.8" rx=".6" fill="#b3261e"/>`; }
  sw.forEach((p) => { k += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff6c8" opacity=".55" filter="url(#${S.id("glow")})"/><circle cx="${p[0]}" cy="${p[1]}" r="1.6" fill="#fffbe6"/>`; });
  k += poly(fZ(Z0, X0 + 0.1, X1 - 0.1, H0, H0 + 0.25), "#2f2f2c");
  { const c = P((X0 + X1) / 2, Z0, H0 + 0.12); k += `<rect x="${r(c[0] - 4)}" y="${r(c[1] - 1.2)}" width="8" height="2.4" rx=".6" fill="#555"/>`; }
  { const c = P((X0 + X1) / 2, Z0, 0.4); k += T(c[0], c[1], r(0.16 * M(Z0)), "1048", "#5a4508", "middle", "bold"); }
  /* Lupe */
  const t = tueren[0];
  const u = (id, de, syl, it, itSyl, en, b, tipp) => { const cx = r((b[0] + b[2]) / 2); return { id, de, syl, it, itSyl, en, tipp, x: cx, y: r(b[3]), kunst: flaeche(b[0] - cx, b[1] - b[3], b[2] - b[0], b[3] - b[1]) }; };
  const swk = kasten(sw);
  const unter = [
    u("ub_tuer", "die Tür", "TÜR", "la porta", "POR-ta", "door", kasten(fX(X1, t, t + 1.3, 0.05, 2.15)), "Sie geht nicht von selbst auf — man drückt den Knopf."),
    u("ub_scheinwerfer", "der Scheinwerfer", "SCHEIN-wer-fer", "il faro", "FA-ro", "headlight", [swk[0] - 3, swk[1] - 3, swk[2] + 3, swk[3] + 3], "Mit Licht fährt der Zug in den Bahnhof ein."),
  ];
  const f = P((X0 + X1) / 2, Z0, SCH);
  S.teil({ id: "ub_zug", de: "die U-Bahn", syl: "U-Bahn", it: "la metropolitana", itSyl: "me-tro-po-li-TA-na", en: "underground train", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    zoom: { x: 6, y: 60, w: 96, h: 64 }, unter,
    tipp: "Alle paar Minuten kommt die nächste. Einen Fahrplan braucht man dafür nicht." });
}

/* =====================================================================
   4 — DIE BAHNSTEIGKANTE und 5 — DIE SICHERHEITSLINIE
   ===================================================================== */
{
  let k = poly([P(KANTE, 3.2, 0), P(KANTE + 0.3, 3.2, 0), P(KANTE + 0.3, ZE, 0), P(KANTE, ZE, 0)], S.lg("kante", [[0, "#d9d4c4"], [1, "#efe9d8"]], 0, 0, 1, 0));
  k += poly([P(KANTE, 3.2, 0), P(KANTE, ZE, 0), P(KANTE, ZE, -0.05), P(KANTE, 3.2, -0.05)], "#8f8a7c");
  const p = P(KANTE + 0.15, 7.5);
  S.teil({ id: "ub_bahnsteigkante", de: "die Bahnsteigkante", syl: "BAHN-steig-kan-te", it: "il bordo della banchina", itSyl: "BOR-do", en: "platform edge", x: p[0], y: p[1], kunst: absolut(p[0], p[1], k),
    tipp: "„Bitte zurücktreten.“ Genau davor warnt die Durchsage." });
}
{
  let k = poly([P(-1.62, 3.2, 0), P(-1.3, 3.2, 0), P(-1.3, ZE, 0), P(-1.62, ZE, 0)], "#f4f4ef");
  for (let Z = 4.8; Z < 30; Z += 0.22) k += linie(P(-1.62, Z), P(-1.3, Z), "#c9c9c2", r(Math.min(0.35, 2.5 / Z)));
  const p = P(-1.46, 7.2);
  S.teil({ id: "ub_sicherheitslinie", de: "die Sicherheitslinie", syl: "SI-cher-heits-li-ni-e", it: "la linea di sicurezza", itSyl: "LI-ne-a di si-cu-REZ-za", en: "safety line", x: p[0], y: p[1], kunst: absolut(p[0], p[1], k),
    tipp: "Die weiße Linie hat Rillen: So spüren auch Blinde, wo der Bahnsteig endet." });
}

/* =====================================================================
   6 — DER STRECKENPLAN und der Stationsname an der Wand
   ===================================================================== */
{
  const Z0 = 7.9, Z1 = 9.9, H0 = 0.85, H1 = 2.0;
  let k = poly(fX(WR - 0.02, Z0 - 0.08, Z1 + 0.08, H0 - 0.08, H1 + 0.08), "#3b4148");
  k += poly(fX(WR - 0.03, Z0, Z1, H0, H1), "#fbfbf7");
  /* Linien als farbige Bänder auf der Fläche (perspektivisch) */
  const L = (h0, h1, z0, z1, f) => poly([P(WR - 0.04, Z0 + z0 * (Z1 - Z0), H0 + h0 * (H1 - H0)), P(WR - 0.04, Z0 + z1 * (Z1 - Z0), H0 + h1 * (H1 - H0)), P(WR - 0.04, Z0 + z1 * (Z1 - Z0), H0 + h1 * (H1 - H0) - 0.05), P(WR - 0.04, Z0 + z0 * (Z1 - Z0), H0 + h0 * (H1 - H0) - 0.05)], f);
  k += L(0.8, 0.2, 0.05, 0.95, "#e3a21a") + L(0.5, 0.5, 0.05, 0.95, "#2f6fb3") + L(0.2, 0.85, 0.08, 0.92, "#c4271f") + L(0.65, 0.3, 0.2, 0.8, "#3ca35a") + L(0.9, 0.9, 0.3, 0.7, "#7a4fa0");
  for (const [zz, hh] of [[0.5, 0.5], [0.3, 0.68], [0.7, 0.33], [0.62, 0.55]]) { const c = P(WR - 0.05, Z0 + zz * (Z1 - Z0), H0 + hh * (H1 - H0)); k += `<circle cx="${c[0]}" cy="${c[1]}" r="1.1" fill="#fff" stroke="#222" stroke-width=".4"/>`; }
  { const a = P(WR - 0.05, Z0 + 0.05, H1 - 0.04), b = P(WR - 0.05, Z1 - 0.05, H1 - 0.04); k += poly([a, b, P(WR - 0.05, Z1 - 0.05, H1 - 0.16), P(WR - 0.05, Z0 + 0.05, H1 - 0.16)], BLAU); }
  const b = kasten(fX(WR, Z0, Z1, H0, H1)), cx = r((b[0] + b[2]) / 2);
  S.teil({ id: "ub_streckenplan", de: "der Streckenplan", syl: "STRE-cken-plan", it: "la mappa della rete", itSyl: "MAP-pa", en: "network map", x: cx, y: r(b[3]), kunst: absolut(cx, r(b[3]), k),
    tipp: "Welche Linie fährt wohin, und wo muss man umsteigen." });
}
{
  /* Stationsname auf dem grünen Band (Kulisse, kein eigenes Wort) */
  const a = P(WR - 0.02, 16, 2.62), b = P(WR - 0.02, 11, 2.62), c = P(WR - 0.02, 11, 2.23), d = P(WR - 0.02, 16, 2.23);
  let k = poly([a, b, c, d], "#f7f5ec");
  const L = 40, h = (c[1] - b[1]) / 6;
  k += `<text transform="matrix(${r((b[0] - a[0]) / L * 100) / 100} ${r((b[1] - a[1]) / L * 100) / 100} 0 ${r(h * 100) / 100} ${a[0]} ${r((a[1] + d[1]) / 2 + (d[1] - a[1]) * 0.3)})" font-size="6" textLength="${L}" lengthAdjust="spacingAndGlyphs" fill="#1d1d1b" font-family="Arial" font-weight="bold">Lindenplatz</text>`;
  S.hinten(k);
}

/* =====================================================================
   7 — DIE ROLLTREPPE (fährt am Ende nach oben)
   ===================================================================== */
{
  const X0 = 1.75, X1 = 3.1, Za = 21, Zb = 30, Hb = HD + 0.2;
  let k = "";
  /* Deckenöffnung, Licht von oben */
  k += poly([P(X0 - 0.2, Zb - 3, HD), P(X1 + 0.2, Zb - 3, HD), P(X1 + 0.2, Zb + 0.5, HD), P(X0 - 0.2, Zb + 0.5, HD)], "#f3eedc");
  /* Stufen: von unten gesehen Setzstufen mit Kanten */
  const n = 22;
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n;
    const Z = Za + 1.2 + (Zb - Za - 1.2) * t0, H = (Hb) * t0, Zn = Za + 1.2 + (Zb - Za - 1.2) * t1, Hn = Hb * t1;
    k += poly([P(X0 + 0.15, Z, H), P(X1 - 0.15, Z, H), P(X1 - 0.15, Z, Hn), P(X0 + 0.15, Z, Hn)], i % 2 ? "#5b6066" : "#6b7076");
    k += linie(P(X0 + 0.15, Z, Hn), P(X1 - 0.15, Z, Hn), "#e3b22a", ".35");
  }
  /* untere flache Einlaufzone mit Kammplatte */
  k += poly(boden(X0 + 0.15, X1 - 0.15, Za, Za + 1.2, 0.02), "#8d939a");
  k += linie(P(X0 + 0.15, Za + 0.1, 0.03), P(X1 - 0.15, Za + 0.1, 0.03), "#e3b22a", ".8");
  /* Balustraden: Glasseiten, schwarzer Handlauf */
  for (const X of [X0, X1]) {
    const pts = [P(X, Za - 0.2, 0.95), P(X, Za + 1.2, 1.0), P(X, Zb, Hb + 0.95), P(X, Zb, Hb), P(X, Za + 1.2, 0), P(X, Za - 0.2, 0)];
    k += poly(pts, "#d6e6ef", ` opacity=".45" stroke="#9aa3aa" stroke-width=".4"`);
    k += `<path d="M${P(X, Za - 0.2, 1.0).join(" ")} Q${P(X, Za - 0.5, 0.9).join(" ")} ${P(X, Za - 0.2, 0.8).join(" ")} M${P(X, Za - 0.2, 1.0).join(" ")} L${P(X, Za + 1.2, 1.05).join(" ")} L${P(X, Zb, Hb + 1.0).join(" ")}" stroke="#1d1f22" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    k += poly([P(X, Za - 0.2, 0.15), P(X, Za + 1.2, 0.15), P(X, Zb, Hb + 0.15), P(X, Zb, Hb), P(X, Za + 1.2, 0), P(X, Za - 0.2, 0)], "#9aa3aa");
  }
  const f = P((X0 + X1) / 2, Za - 0.2);
  S.teil({ id: "ub_rolltreppe", de: "die Rolltreppe", syl: "ROLL-trep-pe", it: "la scala mobile", itSyl: "SCA-la MO-bi-le", en: "escalator", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "Rechts stehen, links gehen — daran hält man sich in Deutschland." });
}

/* =====================================================================
   8 — DIE BANK mit 9 — DEM MÜLLEIMER (an der Wand, hinten)
   ===================================================================== */
{
  const Za = 12.0, Zb = 16.4, X0 = WR - 0.5, X1 = WR - 0.05;
  let k = "";
  k += poly(boden(X0, X1, Za, Zb, 0.45), S.lg("bank", [[0, "#c3542c"], [1, "#8e3a1c"]]));
  k += poly(fX(X0, Za, Zb, 0.38, 0.45), "#6d2a12");
  k += poly(fX(X1 - 0.05, Za, Zb, 0.55, 0.95), "#b04a26");
  for (const Z of [Za + 0.15, Zb - 0.15]) k += poly(fZ(Z, X0 + 0.1, X0 + 0.16, 0, 0.4), "#3b4148");
  for (let i = 0; i < 12; i++) { const Z = Za + 0.15 + i * 0.35; k += linie(P(X0, Z, 0.45), P(X1, Z, 0.45), "#7a2f15", ".25"); }
  const f = P((X0 + X1) / 2, Za);
  k = poly(boden(X0, X1 + 0.05, Za, Zb, 0.005), "#000", ` opacity=".18"`) + k;
  S.teil({ id: "ub_bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k) });
}
{
  const X = WR - 0.25, Z = 10.4, p = P(X, Z), m = M(Z);
  let k = schatten(0, 0, 0.3 * m, 0.07 * m, 0.3);
  k += `<rect x="${r(-0.03 * m)}" y="${r(-0.3 * m)}" width="${r(0.06 * m)}" height="${r(0.3 * m)}" fill="#5b6670"/>`;
  k += `<path d="M${r(-0.2 * m)} ${r(-0.95 * m)} L${r(0.2 * m)} ${r(-0.95 * m)} L${r(0.18 * m)} ${r(-0.28 * m)} L${r(-0.18 * m)} ${r(-0.28 * m)} Z" fill="${S.lg("muell", [[0, "#ffb21e"], [1, "#d98a0a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.22 * m)}" y="${r(-1.0 * m)}" width="${r(0.44 * m)}" height="${r(0.08 * m)}" rx=".6" fill="#3b4148"/><rect x="${r(-0.1 * m)}" y="${r(-0.86 * m)}" width="${r(0.2 * m)}" height="${r(0.06 * m)}" fill="#3b2a08"/>`;
  S.teil({ id: "ub_muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "bin", x: p[0], y: p[1], steht: true, kunst: k + flaeche(-0.24 * m, -1.02 * m, 0.48 * m, 1.02 * m) });
}

/* =====================================================================
   10 — DIE ANZEIGE, 11 — DIE UHR, 12 — DAS SCHILD (hängen von der Decke)
   ===================================================================== */
{
  const Z = 14.5, X0 = 1.45, X1 = 3.65, H0 = 2.62, H1 = 3.08;
  let k = "";
  for (const X of [X0 + 0.25, X1 - 0.25]) k += linie(P(X, Z, H1), P(X, Z, HD), "#3b4148", ".5");
  k += poly(fZ(Z, X0, X1, H0, H1), "#f4f4ef", ` stroke="#9aa3aa" stroke-width=".3"`);
  const a = P(X0, Z, H1), b = P(X1, Z, H0), h = b[1] - a[1];
  k += `<rect x="${r(a[0] + 1)}" y="${r(a[1] + 1)}" width="${r(h - 2)}" height="${r(h - 2)}" rx=".8" fill="${BLAU}"/>` + T(a[0] + h / 2, a[1] + h * 0.8, r(h * 0.8), "U", "#fff", "middle", "bold");
  k += T(a[0] + h + 1.4, a[1] + h * 0.45, r(h * 0.36), "Ausgang", "#1d1d1b", "start", "bold") + T(a[0] + h + 1.4, a[1] + h * 0.85, r(h * 0.3), "Lindenplatz", "#555");
  k += `<path d="M${r(b[0] - 4)} ${r(a[1] + h * 0.75)} v-${r(h * 0.5)} m-2 2 l2 -2 l2 2" stroke="#2f8a4a" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  const m = P((X0 + X1) / 2, Z, H0);
  S.teil({ id: "ub_schild", de: "das U-Bahn-Schild", syl: "U-Bahn-SCHILD", it: "il cartello della metro", itSyl: "car-TEL-lo del-la ME-tro", en: "underground sign", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Das weiße U auf blauem Grund heißt: Hier fährt die U-Bahn." });
}

{
  const Z = 11, X0 = -0.85, X1 = 1.05, H0 = 2.55, H1 = 3.05;
  let k = "";
  for (const X of [X0 + 0.2, X1 - 0.2]) k += linie(P(X, Z, H1), P(X, Z, HD), "#3b4148", ".6");
  k += poly(fZ(Z, X0 - 0.04, X1 + 0.04, H0 - 0.04, H1 + 0.04), "#2b3036");
  k += poly(fZ(Z, X0, X1, H0, H1), "#08090b");
  const a = P(X0, Z, H1), b = P(X1, Z, H0), w = b[0] - a[0], h = b[1] - a[1];
  const zl = [["U3", "Nordpark", "1 min"], ["U3", "Südring", "6 min"]];
  zl.forEach(([l, z, t], i) => {
    const y = a[1] + h * (0.38 + i * 0.45);
    k += `<rect x="${r(a[0] + 1)}" y="${r(y - 3.2)}" width="5.4" height="3.8" rx=".4" fill="#ffb21e"/>` + T(a[0] + 3.7, y - 0.3, 3, l, "#111", "middle", "bold");
    k += T(a[0] + 8, y, 3.6, z, "#ffb21e", "start", "bold", "monospace") + T(b[0] - 1, y, 3.6, t, "#ffb21e", "end", "bold", "monospace");
  });
  const m = P((X0 + X1) / 2, Z, H0);
  S.teil({ id: "ub_anzeige", de: "die Anzeige", syl: "AN-zei-ge", it: "il display", itSyl: "di-SPLAY", en: "display", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Sie zeigt, wohin der nächste Zug fährt und in wie vielen Minuten." });
}
{
  const Z = 9.2, X = -1.6, H = 3.02, c = P(X, Z, H), m = M(Z), R = 0.3 * m;
  let k = linie([0, r(P(X, Z, HD)[1] - c[1])], [0, r(-R)], "#3b4148", ".7");
  k += `<circle r="${r(R + 1)}" fill="#2b3036"/><circle r="${r(R)}" fill="#fbfbf8"/>`;
  for (let i = 0; i < 12; i++) { const w = i * Math.PI / 6, l = i % 3 ? 0.13 : 0.22; k += `<line x1="${r(Math.sin(w) * R * 0.88)}" y1="${r(-Math.cos(w) * R * 0.88)}" x2="${r(Math.sin(w) * R * (0.88 - l))}" y2="${r(-Math.cos(w) * R * (0.88 - l))}" stroke="#111" stroke-width="${i % 3 ? 0.5 : 0.9}"/>`; }
  const hw = (8 + 14 / 60) * Math.PI / 6, mw = 14 * Math.PI / 30;
  k += `<line x2="${r(Math.sin(hw) * R * 0.5)}" y2="${r(-Math.cos(hw) * R * 0.5)}" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x2="${r(Math.sin(mw) * R * 0.75)}" y2="${r(-Math.cos(mw) * R * 0.75)}" stroke="#111" stroke-width=".8" stroke-linecap="round"/><circle r=".7" fill="#c4271f"/>`;
  S.teil({ id: "ub_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: c[0], y: c[1], kunst: k });
}
/* =====================================================================
   13 — DER FAHRKARTENAUTOMAT (frei stehend, zur Kamera)
   ===================================================================== */
{
  const Z = 11, X0 = 2.2, X1 = 2.95, m = M(Z), a = P(X0, Z, 1.85), b = P(X1, Z, 0);
  const w = b[0] - a[0], h = b[1] - a[1], x = a[0], y = a[1];
  let k = schatten(x + w / 2, b[1], w * 0.6, 1.1, 0.35);
  k += poly([[x + w, y], [x + w + 0.25 * m * 0.4, y + 1.6], [x + w + 0.25 * m * 0.4, b[1] - 1.2], [x + w, b[1]]], "#1c5a96");
  k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="1.2" fill="${S.lg("automat", [[0, "#2f74c0"], [1, "#1e5aa8"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(x + 1)}" y="${r(y + 1.2)}" width="${r(w - 2)}" height="${r(0.16 * m)}" rx=".5" fill="#fff"/>` + T(x + w / 2, y + 1.2 + 0.12 * m, r(0.1 * m), "Fahrkarten", BLAU, "middle", "bold");
  k += `<rect x="${r(x + w * 0.12)}" y="${r(y + 0.3 * m)}" width="${r(w * 0.76)}" height="${r(0.4 * m)}" rx=".6" fill="#111"/><rect x="${r(x + w * 0.16)}" y="${r(y + 0.33 * m)}" width="${r(w * 0.68)}" height="${r(0.34 * m)}" fill="${S.lg("bild", [[0, "#e9f2fb"], [1, "#b9d3ec"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(x + w * 0.2)}" y="${r(y + 0.36 * m + i * 0.075 * m)}" width="${r(w * 0.6)}" height="${r(0.05 * m)}" rx=".4" fill="${i === 0 ? "#ffb21e" : BLAU}" opacity=".85"/>`;
  k += `<rect x="${r(x + w * 0.14)}" y="${r(y + 0.8 * m)}" width="${r(w * 0.3)}" height="${r(0.18 * m)}" rx=".6" fill="#15315a"/><circle cx="${r(x + w * 0.29)}" cy="${r(y + 0.89 * m)}" r="${r(0.04 * m)}" fill="#c9a227"/>`;
  k += `<rect x="${r(x + w * 0.56)}" y="${r(y + 0.8 * m)}" width="${r(w * 0.3)}" height="${r(0.18 * m)}" rx=".6" fill="#15315a"/><rect x="${r(x + w * 0.62)}" y="${r(y + 0.88 * m)}" width="${r(w * 0.18)}" height="${r(0.025 * m)}" fill="#9aa3aa"/>`;
  k += `<rect x="${r(x + w * 0.2)}" y="${r(y + 1.15 * m)}" width="${r(w * 0.6)}" height="${r(0.16 * m)}" rx=".8" fill="#0d1e36"/>`;
  k += `<rect x="${r(x + 1)}" y="${r(y + 1)}" width="1.4" height="${r(h - 2)}" rx=".7" fill="#fff" opacity=".2"/>`;
  const cx = r(x + w / 2);
  S.teil({ id: "ub_automat", de: "der Fahrkartenautomat", syl: "FAHR-kar-ten-au-to-mat", it: "il distributore di biglietti", itSyl: "di-stri-bu-TO-re", en: "ticket machine", x: cx, y: b[1], steht: true, kunst: absolut(cx, b[1], k),
    tipp: "Er nimmt Münzen, Scheine und Karte. Für den Automaten braucht man die Nummer der Zone." });
}

/* =====================================================================
   14 — DIE SCHÜLERIN (vor dem Linienplan)
   ===================================================================== */
{
  const X = 2.72, Z = 8.6, p = P(X, Z);
  const m = B.mensch({ id: "ub_schuelerin", alter: "jugendlich", geschlecht: "w", pose: "stehen", blick: 62, frisur: "pony", haarfarbe: "rot", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "rosa" }, jacke: { stueck: "jacke", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#c4271f" } } }, 1.6 * M(Z));
  S.teil({ id: "ub_schuelerin", de: "die Schülerin", syl: "SCHÜ-le-rin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "pupil", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Mit dem Schülerticket fährt sie das ganze Jahr." });
}

/* =====================================================================
   15 — DER EINSTEIGENDE (wartet an der Linie, neben der Tür)
   ===================================================================== */
{
  const X = -1.0, Z = 11.6, p = P(X, Z);
  const m = B.mensch({ id: "ub_einsteiger", geschlecht: "m", pose: "stehen", blick: -55, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: "grau" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "tasche", farbe: "#2f3035" } } }, 1.82 * M(Z));
  S.teil({ id: "ub_einsteiger", de: "der Einsteigende", syl: "EIN-stei-gen-de", it: "chi sale", itSyl: "chi SA-le", en: "boarding passenger", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Erst aussteigen lassen, dann einsteigen." });
}

/* =====================================================================
   16 — DER ENTWERTER und 17 — DER FAHRGAST, der gerade stempelt
   ===================================================================== */
const ENT = { X: 0.98, Z: 6.0 };
{
  const m = M(ENT.Z), p = P(ENT.X, ENT.Z);
  let k = schatten(0, 0, 0.18 * m, 0.05 * m, 0.35);
  k += `<rect x="${r(-0.03 * m)}" y="${r(-1.05 * m)}" width="${r(0.06 * m)}" height="${r(1.05 * m)}" fill="${S.lg("stange", [[0, "#9aa3aa"], [0.5, "#eef1f3"], [1, "#7d868d"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.13 * m)}" y="${r(-1.42 * m)}" width="${r(0.26 * m)}" height="${r(0.4 * m)}" rx="1.2" fill="${S.lg("entw", [[0, "#e0403a"], [1, "#a8231d"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.1 * m)}" y="${r(-1.36 * m)}" width="${r(0.2 * m)}" height="${r(0.07 * m)}" rx=".4" fill="#fff"/>` + T(0, -1.31 * m, r(0.05 * m), "Entwerter", "#a8231d", "middle", "bold");
  k += `<rect x="${r(-0.07 * m)}" y="${r(-1.22 * m)}" width="${r(0.14 * m)}" height="${r(0.025 * m)}" fill="#1d1f22"/><path d="M0 ${r(-1.12 * m)} l${r(-0.04 * m)} ${r(-0.05 * m)} h${r(0.08 * m)} Z" fill="#ffd34d"/>`;
  k += `<circle cx="${r(0.07 * m)}" cy="${r(-1.08 * m)}" r="${r(0.015 * m)}" fill="#7ee08a"/>`;
  S.teil({ id: "ub_entwerter", de: "der Entwerter", syl: "Ent-WER-ter", it: "l'obliteratrice", itSyl: "o-bli-te-ra-TRI-ce", en: "ticket validator", x: p[0], y: p[1], steht: true, kunst: k + flaeche(-0.14 * m, -1.44 * m, 0.28 * m, 1.44 * m),
    tipp: "Ohne Stempel gilt die Fahrkarte nicht — auch wenn man sie bezahlt hat." });
}
{
  const X = 0.4, Z = 6.35, p = P(X, Z);
  const m = B.mensch({ id: "ub_fahrgast", geschlecht: "w", pose: "servieren", blick: 70, frisur: "dutt", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "bluse", farbe: "hellblau" }, jacke: { stueck: "mantel", farbe: "#6e3f5a" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "#7d5838" } } }, 1.66 * M(Z));
  /* kleine Fahrkarte in der erhobenen Hand, am Schlitz des Entwerters */
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0];
  let karte = "";
  if (hand) { const hx = (hand.x != null ? hand.x : hand[0]) * m.k, hy = (hand.y != null ? hand.y : hand[1]) * m.k; karte = `<rect x="${r(hx - 0.5)}" y="${r(hy - 3.6)}" width="4.2" height="2.6" rx=".3" fill="#f6f1df" stroke="#9a8f6a" stroke-width=".15" transform="rotate(-12 ${r(hx)} ${r(hy)})"/>`; }
  S.teil({ id: "ub_fahrgast", de: "der Fahrgast", syl: "FAHR-gast", it: "il passeggero", itSyl: "pas-SEG-ge-ro", en: "passenger", x: p[0], y: p[1], kunst: m.svg + karte,
    tipp: "Sie entwertet gerade ihre Fahrkarte." });
}

/* Glanz der Lichtbänder auf dem Zug (fängt keinen Tipp) */
S.davor(`<rect width="320" height="200" fill="${S.rg("vignette", [[0.6, "#000", 0], [1, "#000", 0.22]], 0.45, 0.45, 0.75)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/ubahn.js"));
console.log(aus);
