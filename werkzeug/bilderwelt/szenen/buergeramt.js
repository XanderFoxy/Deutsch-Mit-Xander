#!/usr/bin/env node
/* =====================================================================
   DAS BÜRGERAMT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Bürgerbüros Münster, Stuttgart, Bad Soden, Taucha;
   Selbstbedienungsterminal der Bundesdruckerei; Berliner Bürgerämter):
   - Am Eingang zieht man am WARTEMARKENAUTOMATEN eine Nummer (oder
     checkt mit der Terminbestätigung ein) und setzt sich auf die
     WARTESTÜHLE. Eine AUFRUFANZEIGE an der Decke zeigt Nummer und Platz.
   - Seit 1. Mai 2025 nur noch digitale Passbilder: Im Bürgeramt steht
     ein Selbstbedienungsterminal (PASSFOTO-AUTOMAT), das Foto,
     Fingerabdrücke und Unterschrift aufnimmt (Gebühr 6 €).
   - Am SACHBEARBEITERPLATZ: Schreibtisch mit Glasscheibe, Bildschirm,
     Fingerabdruckscanner (für den Personalausweis), Stempel, Formulare,
     Bescheinigungen (z. B. Meldebescheinigung), Aktenordner im Regal.
   - Meist nur mit Termin („Termin online buchen“).
   BLICK: Über Eck (zwei Fluchtpunkte außerhalb des Bildes), erhöhte
   Kamera (2,3 m): links die Wand mit Passfoto-Automat, Wartemarken-
   automat und Fenstern, rechts die Wand mit dem Sachbearbeiterplatz,
   in der Mitte die Aufrufanzeige über den Wartestühlen.
   Maßstab: Ecke 33 Einheiten je Meter, Schreibtisch ≈ 45 je Meter
   (Tischhöhe 0,75 m), Sitzhöhe 0,42 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "buergeramt", titel: "Das Bürgeramt", emoji: "🏛️", thema: "Behörden", kuerzel: "b01e", fassung: 852 });
const rnd = zufall(1871);
const r = B.r;

/* ---------- Kamera über Eck: Ecke bei (0,0), Kamera bei (8.5, 8.5) ---- */
const CXw = 8.5, CZw = 8.5, E = 2.3, F = 400, VX = 150, HY = 40, W2 = Math.SQRT1_2;
const tief = (X, Z) => -((X - CXw) + (Z - CZw)) * W2;
const P = (X, H, Z) => { const dx = X - CXw, dz = Z - CZw, cx = (dx - dz) * W2, cz = -(dx + dz) * W2; return [r(VX + F * cx / cz), r(HY + F * (E - H) / cz)]; };
const mass = (X, Z) => F / tief(X, Z);             // Einheiten je Meter an dieser Stelle
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
/* Quader: sichtbar sind die Seiten +X und +Z (zur Kamera) und der Deckel */
function kiste(X0, X1, H0, H1, Z0, Z1, f) {
  let g = "";
  if (f.x) g += poly([P(X1, H0, Z1), P(X1, H0, Z0), P(X1, H1, Z0), P(X1, H1, Z1)], f.x);
  if (f.z) g += poly([P(X0, H0, Z1), P(X1, H0, Z1), P(X1, H1, Z1), P(X0, H1, Z1)], f.z);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, Z1), P(X1, H1, Z1), P(X1, H1, Z0), P(X0, H1, Z0)], f.deckel);
  return g;
}
/* Ebene Fläche mit eigenem Inhalt (affin angenähert): o = oben links,
   a = oben rechts, u = unten links (Weltpunkte), w × h lokale Einheiten */
function tafel(o, a, u, w, h, svg) {
  const p0 = P(...o), p1 = P(...a), p3 = P(...u);
  const m = [(p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, (p3[0] - p0[0]) / h, (p3[1] - p0[1]) / h, p0[0], p0[1]].map((v) => Math.round(v * 1000) / 1000);
  return `<g transform="matrix(${m.join(" ")})">${svg}</g>`;
}
/* auf der linken Wand (X = x): von Z1 (vorn, links im Bild) nach Z0 */
const tafelL = (x, Z0, Z1, H0, H1, w, h, svg) => tafel([x, H1, Z1], [x, H1, Z0], [x, H0, Z1], w, h, svg);
/* auf der rechten Wand (Z = z): von X0 nach X1 */
const tafelR = (z, X0, X1, H0, H1, w, h, svg) => tafel([X0, H1, z], [X1, H1, z], [X0, H0, z], w, h, svg);

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const BLAU = "#1f5fa8", BLAU_D = "#174a85";
const WAND_L = S.lg("wandl", [[0, "#f3f1ec"], [1, "#e4e0d7"]], 0, 0, 1, 0);
const WAND_R = S.lg("wandr", [[0, "#faf9f6"], [1, "#efece6"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e6e6e2"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const EICHE = S.lg("eiche", [[0, "#d8b98a"], [1, "#c4a070"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.32], [0.5, "#e8f4f7", 0.08], [1, "#ffffff", 0.2]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Decke, zwei Wände über Eck, Terrazzoboden mit Fugen
   ===================================================================== */
const HR = 3.4, ZL = 5.2, XR = 5.6;            // Raumhöhe, sichtbare Wandlängen
{
  let k = `<rect x="0" y="0" width="320" height="200" fill="${S.lg("decke", [[0, "#ecebe7"], [1, "#f6f5f2"]])}"/>`;
  /* Boden */
  k += poly([P(0, 0, 0), P(XR + 2, 0, 0), P(XR + 2, 0, 8), P(0, 0, ZL + 3)], S.lg("boden", [[0, "#cbc5bb"], [1, "#b9b2a6"]]));
  for (let i = 0; i < 260; i++) { const X = rnd() * 7, Z = rnd() * 7, p = P(X, 0, Z); if (p[1] > 120 && p[1] < 200 && p[0] > 0 && p[0] < 320) k += `<circle cx="${p[0]}" cy="${p[1]}" r="${r(0.25 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#e9e4da" : "#8f877b"}" opacity=".6"/>`; }
  for (let i = 1; i <= 7; i++) { const a = P(i, 0, 0), b = P(i, 0, 7); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#a39b8f" stroke-width=".35"/>`; const c = P(0, 0, i), d = P(7, 0, i); k += `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}" stroke="#a39b8f" stroke-width=".35"/>`; }
  /* Wände */
  k += poly([P(0, HR, 0), P(0, HR, ZL), P(0, 0, ZL), P(0, 0, 0)], WAND_L);
  k += poly([P(0, HR, 0), P(XR, HR, 0), P(XR, 0, 0), P(0, 0, 0)], WAND_R);
  k += poly([P(0, 0.1, 0), P(0, 0.1, ZL), P(0, 0, ZL), P(0, 0, 0)], "#8d8579") + poly([P(0, 0.1, 0), P(XR, 0.1, 0), P(XR, 0, 0), P(0, 0, 0)], "#8d8579");
  /* blaues Band als Leitfarbe */
  k += poly([P(0, 2.45, 0), P(0, 2.45, ZL), P(0, 2.35, ZL), P(0, 2.35, 0)], BLAU) + poly([P(0, 2.45, 0), P(XR, 2.45, 0), P(XR, 2.35, 0), P(0, 2.35, 0)], BLAU);
  /* Downlights */
  for (const [X, Z] of [[1.5, 1.5], [3.5, 1.5], [1.5, 3.5], [3.5, 3.5], [5.5, 1.5], [1.5, 5.5]]) { const p = P(X, HR, Z); if (p[1] > 0) k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="3.2" ry="1" fill="#fffbe8" stroke="#d9d6cc" stroke-width=".3"/>`; }
  S.hinten(k);
}

/* =====================================================================
   LINKE WAND: Fenster, Uhr, Passfoto-Automat, Wartemarkenautomat
   ===================================================================== */
{
  /* Fensterband mit Blick auf die Stadt (Ebene X = 0) */
  const Z0 = 2.4, Z1 = 4.75, H0 = 1.15, H1 = 2.25;
  const w = 100, h = 40;
  let k = `<rect x="0" y="0" width="${w}" height="${h}" fill="${S.lg("himmel", [[0, "#9cc4e2"], [1, "#d8e8f1"]])}"/>`;
  k += `<path d="M0 26 L8 26 L8 14 L16 14 L16 20 L26 20 L26 10 L34 10 L34 22 L46 22 L46 16 L58 16 L58 24 L70 24 L70 12 L80 12 L80 20 L100 20 L100 40 L0 40 Z" fill="#b9b0a2"/>`;
  for (let i = 0; i < 18; i++) k += `<rect x="${r(2 + i * 5.4)}" y="${r(24 + (i % 3) * 4)}" width="2" height="2.4" fill="#e9eef2" opacity=".8"/>`;
  k += `<path d="M0 34 Q30 28 60 33 T100 32 L100 40 L0 40 Z" fill="#6f9a5a"/>`;
  for (const x of [33.3, 66.6]) k += `<rect x="${r(x - 0.8)}" y="0" width="1.6" height="${h}" fill="#e9e9e6"/>`;
  k += `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#e9e9e6" stroke-width="2"/><rect x="0" y="0" width="${w}" height="${h}" fill="${GLAS}"/>`;
  const svg = tafelL(0, Z0, Z1, H0, H1, w, h, k);
  const [ax, ay] = P(0, H0, (Z0 + Z1) / 2);
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: ax, y: ay, kunst: um(ax, ay, svg) });
}
{
  const [ux, uy] = P(0, 2.82, 3.3);
  let k = `<g transform="skewY(-14)"><ellipse rx="5.2" ry="6" fill="#2b2b2b"/><ellipse rx="4.6" ry="5.4" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#ececE8"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 3.6)}" y1="${r(-Math.cos(a) * 4.2)}" x2="${r(Math.sin(a) * 4.2)}" y2="${r(-Math.cos(a) * 4.9)}" stroke="#222" stroke-width="${i % 3 ? 0.25 : 0.5}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(9.4 * Math.PI / 6) * 2.4)}" y2="${r(-Math.cos(9.4 * Math.PI / 6) * 2.8)}" stroke="#111" stroke-width=".6"/><line x1="0" y1="0" x2="${r(Math.sin(5 * Math.PI / 6) * 3.4)}" y2="${r(-Math.cos(5 * Math.PI / 6) * 4)}" stroke="#111" stroke-width=".4"/><circle r=".4" fill="#c8102e"/></g>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: ux, y: uy, kunst: k });
}
{
  /* DER PASSFOTO-AUTOMAT — Selbstbedienungsterminal mit Kamera */
  const X0 = 0, X1 = 0.55, Z0 = 0.55, Z1 = 1.25;
  const [ax, ay] = P(X1, 0, Z1);
  let k = um(-ax, -ay, schatten(-6, 0, 14, 1.6, 0.28));
  k += kiste(X0, X1, 0, 1.95, Z0, Z1, { x: S.lg("pf", [[0, "#f4f5f6"], [1, "#d5d9dc"]], 0, 0, 1, 0), z: "#c4c9cd", deckel: "#e9ebed" });
  /* Front (Ebene X = X1): Schriftband, Kamera, Bildschirm, Ablage, Fingerabdruck */
  let f = `<rect x="0" y="0" width="40" height="8" fill="${BLAU}"/><text x="20" y="5.6" font-size="4.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Passfoto</text>`;
  f += `<rect x="13" y="12" width="14" height="9" rx="1.4" fill="#2a2d31"/><circle cx="20" cy="16.5" r="3" fill="#111"/><circle cx="20" cy="16.5" r="1.8" fill="#2b4f7a"/><circle cx="19.2" cy="15.8" r=".6" fill="#fff" opacity=".8"/>`;
  f += `<rect x="5" y="24" width="30" height="5" rx=".6" fill="#fff8dc"/><rect x="7" y="25.2" width="26" height="2.6" fill="#ffe9a8"/>`;
  f += `<rect x="6" y="32" width="28" height="20" rx="1" fill="#1d2125"/><rect x="7.4" y="33.4" width="25.2" height="17.2" fill="${S.lg("pfbild", [[0, "#dbe8f2"], [1, "#b9d0e2"]])}"/>`;
  f += `<ellipse cx="20" cy="40.4" rx="3.6" ry="4.4" fill="#d6b49a"/><path d="M13 50.6 Q20 44 27 50.6 Z" fill="#4a5a70"/><path d="M16.4 38.4 Q20 33.6 23.6 38.4 Q22 35.6 20 35.8 Q18 35.6 16.4 38.4 Z" fill="#5a3d28"/>`;
  f += `<rect x="9.4" y="35" width="21.2" height="13.6" fill="none" stroke="#3ca35a" stroke-width=".5" stroke-dasharray="1.4 .8"/>`;
  f += `<rect x="4" y="56" width="32" height="5" rx="1" fill="#9aa2a8"/><rect x="24" y="56.8" width="8" height="3.4" rx=".6" fill="#2a2d31"/><circle cx="28" cy="58.5" r="1" fill="#4aa8d8"/>`;
  f += `<rect x="8" y="57" width="12" height="2.4" rx=".4" fill="#c8ced3"/>`;
  f += `<text x="20" y="68" font-size="2.4" text-anchor="middle" fill="#555" font-family="Arial">Foto · Fingerabdruck</text><text x="20" y="71.4" font-size="2.4" text-anchor="middle" fill="#555" font-family="Arial">Unterschrift · 6,00 €</text>`;
  k += tafelL(X1, Z0 + 0.04, Z1 - 0.04, 0.15, 1.9, 40, 90, f);
  S.teil({ id: "passfotoautomat", de: "der Passfoto-Automat", syl: "PASS-fo-to-au-to-mat", it: "la macchina per foto tessera", itSyl: "MAC-chi-na per FO-to tes-SE-ra", en: "passport photo machine", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Seit Mai 2025 macht man das Passfoto digital – oft direkt hier im Bürgeramt." });
}
{
  /* DER WARTEMARKENAUTOMAT — blaue Stele mit Touchscreen und Ticketdrucker */
  const X0 = 0.05, X1 = 0.42, Z0 = 1.55, Z1 = 1.95;
  const [ax, ay] = P(X1, 0, Z1);
  let k = um(-ax, -ay, schatten(-4, 0, 10, 1.4, 0.28));
  k += kiste(X0, X1, 0, 1.55, Z0, Z1, { x: S.lg("wm", [[0, "#2a72c0"], [1, BLAU_D]], 0, 0, 1, 0), z: "#164a85", deckel: "#3b82cf" });
  let f = `<rect x="2" y="3" width="26" height="4" fill="none"/><text x="15" y="6.6" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Wartemarke</text>`;
  f += `<rect x="3" y="10" width="24" height="18" rx="1" fill="#0d1a26"/><rect x="4.2" y="11.2" width="21.6" height="15.6" fill="#f2f6fa"/>`;
  f += `<rect x="5.6" y="13" width="18.8" height="3.4" rx=".6" fill="${BLAU}"/><text x="15" y="15.5" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial">Ausweis / Pass</text>`;
  f += `<rect x="5.6" y="17.6" width="18.8" height="3.4" rx=".6" fill="${BLAU}"/><text x="15" y="20.1" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial">Anmeldung</text>`;
  f += `<rect x="5.6" y="22.2" width="18.8" height="3.4" rx=".6" fill="#3ca35a"/><text x="15" y="24.7" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial">Ich habe einen Termin</text>`;
  f += `<rect x="9" y="33" width="12" height="2" rx=".6" fill="#0d1a26"/><path d="M11 35 L19 35 L18.6 41 L11.4 41 Z" fill="#fffdf0"/><text x="15" y="39.4" font-size="2.2" text-anchor="middle" fill="#111" font-family="monospace" font-weight="bold">117</text>`;
  k += tafelL(X1, Z0 + 0.03, Z1 - 0.03, 0.75, 1.5, 30, 46, f);
  S.teil({ id: "wartemarkenautomat", de: "der Wartemarkenautomat", syl: "WAR-te-mar-ken-au-to-mat", it: "il distributore di numeri", itSyl: "di-stri-bu-TO-re di NU-me-ri", en: "ticket machine", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Am Automaten wählt man sein Anliegen und bekommt eine Wartemarke." });
}

/* =====================================================================
   RECHTE WAND: Schild, Aktenregal, Plakat „Termin“
   ===================================================================== */
{
  let f = `<rect x="0" y="0" width="80" height="14" rx="1" fill="${BLAU}"/><rect x="3" y="3" width="8" height="8" rx="1" fill="#fff"/><path d="M5 9.4 L5 6 L7 4.4 L9 6 L9 9.4 Z" fill="${BLAU}"/>`;
  f += `<text x="44" y="7" font-size="5.6" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold">Bürgeramt</text><text x="44" y="11.4" font-size="2.4" text-anchor="middle" fill="#d6e4f4" font-family="Arial">Pass · Ausweis · Anmeldung</text>`;
  const svg = tafelR(0, 1.0, 3.6, 2.6, 3.05, 80, 14, f);
  const [ax, ay] = P(2.3, 2.6, 0);
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: ax, y: ay, kunst: um(ax, ay, svg) });
}
{
  /* DER AKTENORDNER — Regal an der rechten Wand, hinter dem Platz */
  const X0 = 0.35, X1 = 1.55, Z0 = 0.02, Z1 = 0.38;
  const [ax, ay] = P(X1, 0, Z1);
  let k = kiste(X0, X1, 0, 1.9, Z0, Z1, { x: "#d2d5d8", z: "#e6e8ea", deckel: "#f2f3f4" });
  k += poly([P(X0 + 0.03, 0.05, Z1), P(X1 - 0.03, 0.05, Z1), P(X1 - 0.03, 1.86, Z1), P(X0 + 0.03, 1.86, Z1)], "#7d858c");
  const farben = [BLAU, "#c8102e", "#3d9a5b", "#f2a900", "#555", "#7b4fa3"];
  for (const hb of [0.06, 0.5, 0.94, 1.38]) {
    k += kiste(X0 + 0.03, X1 - 0.03, hb - 0.02, hb, Z0, Z1, { z: "#dfe2e5", deckel: "#eef0f2" });
    let X = X0 + 0.05, i = Math.round(hb * 7);
    while (X < X1 - 0.1) {
      if (i % 8 === 5) { X += 0.07; i++; continue; }
      const b = 0.075, hh = 0.33;
      k += poly([P(X, hb, Z1 - 0.03), P(X + b, hb, Z1 - 0.03), P(X + b, hb + hh, Z1 - 0.03), P(X, hb + hh, Z1 - 0.03)], farben[i % farben.length], 'stroke="#222" stroke-width=".15"');
      const c = P(X + b / 2, hb + 0.1, Z1 - 0.03), e = P(X + 0.012, hb + 0.27, Z1 - 0.03);
      k += `<circle cx="${c[0]}" cy="${c[1]}" r=".7" fill="#fff" opacity=".85"/><rect x="${e[0]}" y="${e[1]}" width="${r(b * mass(X, Z1) * 0.65)}" height="2.2" fill="#fff" opacity=".85"/>`;
      X += b + 0.006; i++;
    }
  }
  S.teil({ id: "bam_aktenordner", de: "der Aktenordner", syl: "AK-ten-ord-ner", it: "il raccoglitore", itSyl: "rac-co-gli-TO-re", en: "ring binder", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}
{
  /* DER TERMIN — Plakat „Termin online buchen“ */
  let f = `<rect x="0" y="0" width="30" height="40" fill="#fff" stroke="#c9c5bb" stroke-width=".4"/><rect x="0" y="0" width="30" height="9" fill="${BLAU}"/>`;
  f += `<text x="15" y="6" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Termin?</text>`;
  f += `<rect x="6" y="12" width="18" height="15" rx="1" fill="#fff" stroke="#555" stroke-width=".5"/><rect x="6" y="12" width="18" height="4" fill="#c8102e"/><rect x="9" y="10.6" width="1.2" height="3" fill="#555"/><rect x="19.8" y="10.6" width="1.2" height="3" fill="#555"/>`;
  for (let i = 0; i < 9; i++) f += `<rect x="${r(7.6 + (i % 3) * 5.4)}" y="${r(17.6 + Math.floor(i / 3) * 3)}" width="3.6" height="2" fill="${i === 4 ? "#3ca35a" : "#ddd"}"/>`;
  f += `<text x="15" y="32" font-size="2.8" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">online buchen</text><text x="15" y="36" font-size="2.2" text-anchor="middle" fill="#555" font-family="Arial">oder am Automaten</text>`;
  const svg = tafelR(0.01, 4.15, 4.85, 1.15, 2.05, 30, 40, f);
  const [ax, ay] = P(4.5, 1.15, 0);
  S.teil({ id: "bam_termin", de: "der Termin", syl: "ter-MIN", it: "l'appuntamento", itSyl: "ap-pun-ta-MEN-to", en: "appointment", x: ax, y: ay, kunst: um(ax, ay, svg),
    tipp: "Für das Bürgeramt bucht man meistens vorher einen Termin." });
}

/* =====================================================================
   DIE SACHBEARBEITERIN (sitzt hinter dem Platz) mit Bürostuhl
   ===================================================================== */
const TI = { X0: 2.0, X1: 3.75, Z0: 0.95, Z1: 1.75, H: 0.75 };
{
  const X = 2.95, Z = 0.55;
  const [ax, ay] = P(X, 0, Z);
  let st = kiste(X - 0.24, X + 0.24, 0.5, 1.15, Z - 0.3, Z - 0.25, { z: "#2d3035", x: "#24272b", deckel: "#3d4147" });
  const m = B.mensch({ id: "b01e_sach", geschlecht: "w", pose: "sitzen", blick: -45, frisur: "locken", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f1ead8" }, jacke: { stueck: "jacke", farbe: "#8a3b4a" }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.68 * mass(X, Z));
  S.teil({ id: "bam_sachbearbeiterin", de: "die Sachbearbeiterin", syl: "SACH-be-ar-bei-te-rin", it: "l'impiegata", itSyl: "im-pie-GA-ta", en: "clerk", x: ax, y: ay, kunst: um(ax, ay, st) + m.svg,
    tipp: "Die Sachbearbeiterin sagt: „Ihre Wartenummer, bitte. Und Ihren Ausweis.“" });
}

/* =====================================================================
   DER SCHALTER — Sachbearbeiterplatz mit Glasscheibe (Lupe)
   ===================================================================== */
{
  const { X0, X1, Z0, Z1, H } = TI;
  const [ax, ay] = P((X0 + X1) / 2, 0, Z1);
  let k = poly([P(X0, 0, Z1 + 0.12), P(X1 + 0.12, 0, Z1 + 0.12), P(X1 + 0.12, 0, Z0), P(X1, 0, Z0), P(X1, 0, Z1), P(X0, 0, Z1)], "#1b120a", 'opacity=".18" filter="url(#bw_weich)"');
  /* Korpus: Front zum Kunden (Z1) weiß, Seite (X1) weiß, Platte Eiche */
  k += kiste(X0, X1, 0, H - 0.03, Z0, Z1, { x: "#d9dad7", z: S.lg("front", [[0, "#ffffff"], [1, "#e4e5e2"]]) });
  k += kiste(X0 - 0.02, X1 + 0.02, H - 0.03, H, Z0 - 0.02, Z1 + 0.02, { x: "#b99a6c", z: "#c9a978", deckel: EICHE });
  /* blaue Platznummer auf der Front */
  let fz = `<rect x="0" y="0" width="16" height="10" rx="1" fill="${BLAU}"/><text x="8" y="4" font-size="2.2" text-anchor="middle" fill="#d6e4f4" font-family="Arial">PLATZ</text><text x="8" y="8.8" font-size="5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">2</text>`;
  k += tafelR(Z1 + 0.001, 2.25, 2.65, 0.35, 0.6, 16, 10, fz);
  /* Glasscheibe (Rahmen; Glas selbst in „vorne“) mit Sprechschlitz */
  const GZ = 1.35, GH = 1.38;
  for (const X of [X0 + 0.15, X1 - 0.15]) { const a = P(X, H, GZ), b = P(X, GH, GZ); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9aa2a8" stroke-width=".9"/>`; }
  const t0 = P(X0 + 0.15, GH, GZ), t1 = P(X1 - 0.15, GH, GZ);
  k += `<line x1="${t0[0]}" y1="${t0[1]}" x2="${t1[0]}" y2="${t1[1]}" stroke="#9aa2a8" stroke-width="1"/>`;
  /* Dinge auf dem Tisch (Kundenseite vor dem Glas, Personalseite dahinter) */
  const blatt = (X, Z, w, t, dreh, h = H + 0.004) => { const c = Math.cos(dreh), s = Math.sin(dreh); return [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([a, b]) => P(X + a * c - b * s, h, Z + a * s + b * c)); };
  const U = [];
  /* Stempel und Stempelkissen (Personalseite) */
  k += kiste(2.18, 2.34, H, H + 0.02, 1.08, 1.2, { x: "#1d1f22", z: "#2a2d31", deckel: "#3a3f8a" });
  k += kiste(2.42, 2.48, H, H + 0.03, 1.12, 1.18, { x: "#333", z: "#444", deckel: "#555" });
  const sg = P(2.45, H + 0.03, 1.15), so = P(2.45, H + 0.13, 1.15);
  k += `<line x1="${sg[0]}" y1="${sg[1]}" x2="${so[0]}" y2="${so[1]}" stroke="#7a4a22" stroke-width="1.4" stroke-linecap="round"/><circle cx="${so[0]}" cy="${so[1]}" r="1.1" fill="#8a5a2e"/>`;
  U.push(["bam_stempel", [P(2.16, H, 1.2), P(2.5, H + 0.14, 1.08)], "der Stempel", "STEM-pel", "il timbro", "TIM-bro", "stamp", "Mit dem Stempel wird ein Dokument amtlich."]);
  /* Bescheinigung (Personalseite, mit Siegel) */
  const besch = blatt(3.35, 1.12, 0.21, 0.28, 0.25);
  k += poly(besch, "#fbfbf8", 'stroke="#cfccc4" stroke-width=".2"');
  const bs = P(3.38, H + 0.006, 1.2);
  k += `<circle cx="${bs[0]}" cy="${bs[1]}" r="1.1" fill="none" stroke="#2a4fa0" stroke-width=".35"/><rect x="${r(bs[0] - 4)}" y="${r(bs[1] - 4)}" width="5" height=".7" fill="${BLAU}"/>`;
  U.push(["bam_bescheinigung", besch, "die Bescheinigung", "be-SCHEI-ni-gung", "il certificato", "cer-ti-FI-ca-to", "certificate", "Nach der Anmeldung bekommt man eine Meldebescheinigung."]);
  /* Kundenseite: Formular mit Kugelschreiber, Personalausweis, Wartenummer */
  const form = blatt(2.45, 1.58, 0.21, 0.29, -0.2);
  k += poly(form, "#fbfbf8", 'stroke="#cfccc4" stroke-width=".2"');
  for (let i = 0; i < 5; i++) { const a = P(2.36 + i * 0.01, H + 0.007, 1.48 + i * 0.045), b = P(2.52 + i * 0.01, H + 0.007, 1.45 + i * 0.045); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${i ? "#9aa" : BLAU}" stroke-width="${i ? 0.25 : 0.5}"/>`; }
  U.push(["bam_formular", form, "das Formular", "for-mu-LAR", "il modulo", "MO-du-lo", "form", "Für die Anmeldung füllt man das Formular „Anmeldung bei der Meldebehörde“ aus."]);
  const k0 = P(2.6, H + 0.015, 1.5), k1 = P(2.82, H + 0.015, 1.62);
  k += `<line x1="${k0[0]}" y1="${k0[1]}" x2="${k1[0]}" y2="${k1[1]}" stroke="#1f3f8a" stroke-width="1" stroke-linecap="round"/>`;
  U.push(["bam_kugelschreiber", [[Math.min(k0[0], k1[0]) - 1, Math.min(k0[1], k1[1]) - 1.6], [Math.max(k0[0], k1[0]) + 1, Math.max(k0[1], k1[1]) + 1.6]], "der Kugelschreiber", "KU-gel-schrei-ber", "la penna a sfera", "PEN-na a SFE-ra", "ballpoint pen", null]);
  const ausw = blatt(3.05, 1.62, 0.12, 0.08, 0.15);
  k += poly(ausw, S.lg("ausweis", [[0, "#dbe9f3"], [1, "#b9d0de"]]), 'stroke="#8aa3b3" stroke-width=".2"');
  const ap = P(3.01, H + 0.006, 1.63);
  k += `<rect x="${r(ap[0] - 0.8)}" y="${r(ap[1] - 1.2)}" width="1.6" height="1.4" fill="#a88b74"/><rect x="${r(ap[0] + 1.2)}" y="${r(ap[1] - 0.8)}" width="3" height=".4" fill="#6a8aa0"/>`;
  U.push(["bam_personalausweis", ausw, "der Personalausweis", "per-so-NAL-aus-weis", "la carta d'identità", "CAR-ta d'i-den-ti-TÀ", "identity card", "Der Personalausweis ist zehn Jahre gültig (unter 24 Jahren: sechs)."]);
  const tick = blatt(3.45, 1.6, 0.07, 0.1, -0.3);
  k += poly(tick, "#fffdf0", 'stroke="#c9c09a" stroke-width=".2"');
  const tp = P(3.45, H + 0.006, 1.6);
  k += `<text x="${tp[0]}" y="${r(tp[1] + 0.5)}" font-size="1.4" text-anchor="middle" fill="#111" font-family="monospace" font-weight="bold">117</text>`;
  U.push(["bam_wartenummer", tick, "die Wartenummer", "WAR-te-num-mer", "il numero d'attesa", "NU-me-ro d'at-TE-sa", "queue number", "Die Wartenummer steht auf der Wartemarke aus dem Automaten."]);
  const gl = [P(X0 + 0.25, GH - 0.05, GZ), P(X1 - 0.25, H + 0.22, GZ)];
  U.push(["bam_glasscheibe", gl, "die Glasscheibe", "GLAS-schei-be", "il vetro divisorio", "VE-tro di-vi-SO-rio", "glass screen", "Die Glasscheibe trennt Kunde und Sachbearbeiterin – unten ist ein Schlitz für Papiere."]);
  const unter = U.map(([id, q, de, syl, it, itSyl, en, tipp]) => {
    const [x0, y0, x1, y1] = bbox(q), w = Math.max(x1 - x0, 4.6), h = Math.max(y1 - y0, 3.6);
    const o = { id, de, syl, it, itSyl, en, x: ax, y: ay, kunst: flaeche((x0 + x1) / 2 - w / 2 - ax, (y0 + y1) / 2 - h / 2 - ay, w, h) };
    if (tipp) o.tipp = tipp;
    return o;
  });
  S.teil({ id: "bam_schalter", de: "der Schalter", syl: "SCHAL-ter", it: "lo sportello", itSyl: "spor-TEL-lo", en: "counter", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 160, y: 72, w: 84, h: 56 }, unter,
    tipp: "Am Schalter (Platz 2) beantragt man Ausweis und Pass oder meldet die Wohnung an." });
}
{
  /* DER BILDSCHIRM — zur Sachbearbeiterin gedreht (Rückseite zu uns) */
  const [mx, my] = P(2.75, TI.H, 1.08);
  let k = schatten(0, 0, 6, .8, .25) + `<rect x="-3" y="-1" width="6" height="1" rx=".4" fill="#3a3d42"/><rect x="-.8" y="-5" width="1.6" height="4" fill="#4a4e54"/>`;
  k += `<path d="M-9 -17 L6 -18.6 L7.4 -6.4 L-8 -5 Z" fill="${S.lg("monitor", [[0, "#3b3f45"], [1, "#24272b"]])}"/><path d="M6 -18.6 L7.6 -18.2 L9 -6.6 L7.4 -6.4 Z" fill="#1d1f22"/>`;
  S.teil({ oben: true, id: "bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: mx, y: my, steht: true, kunst: k });
}
{
  /* DER FINGERABDRUCKSCANNER — für den neuen Personalausweis */
  const [fx, fy] = P(3.3, TI.H, 1.5);
  let k = schatten(0, 0, 4, .6, .3);
  k += `<path d="M-4.4 0 L4 0 L4.6 -2.6 L-3.8 -2.6 Z" fill="#2a2d31"/><path d="M-3.8 -2.6 L4.6 -2.6 L4 -4 L-3.2 -4 Z" fill="#3a3f45"/>`;
  k += `<path d="M-1.6 -3.9 L2.2 -3.9 L2 -2.9 L-1.8 -2.9 Z" fill="#62c3e8"/><circle cx="3.2" cy="-1.3" r=".45" fill="#3ca35a"/>`;
  S.teil({ oben: true, id: "fingerabdruckscanner", de: "der Fingerabdruckscanner", syl: "FIN-ger-ab-druck-scan-ner", it: "lo scanner per impronte digitali", itSyl: "SCAN-ner per im-PRON-te di-gi-TA-li", en: "fingerprint scanner", x: fx, y: fy, steht: true, kunst: k + flaeche(-4.8, -5.2, 10, 5.6),
    tipp: "Für den Personalausweis werden zwei Fingerabdrücke gespeichert." });
}

/* =====================================================================
   DIE AUFRUFANZEIGE (hängt von der Decke über dem Wartebereich)
   ===================================================================== */
{
  const Z = 3.15, X0 = 1.55, X1 = 3.35, H0 = 2.42, H1 = 2.95;
  const [ax, ay] = P((X0 + X1) / 2, H0, Z);
  let k = "";
  for (const X of [X0 + 0.25, X1 - 0.25]) { const a = P(X, H1, Z); let b = P(X, HR, Z); if (b[1] < 0.5) b = [r(a[0] + (b[0] - a[0]) * (a[1] - 0.5) / (a[1] - b[1])), 0.5]; k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8a9097" stroke-width=".6"/>`; }
  k += kiste(X0, X1, H0, H1, Z - 0.08, Z, { x: "#1d2125", z: "#24282d" });
  let f = `<rect x="0" y="0" width="90" height="26" fill="#0b1118"/><rect x="0" y="0" width="90" height="6" fill="${BLAU}"/>`;
  f += `<text x="4" y="4.4" font-size="3.4" fill="#fff" font-family="Arial" font-weight="bold">Nummer</text><text x="86" y="4.4" font-size="3.4" text-anchor="end" fill="#fff" font-family="Arial" font-weight="bold">Platz</text>`;
  [["117", "2", "#ffd54a"], ["114", "5", "#e9f2f5"], ["112", "1", "#e9f2f5"]].forEach(([n, p, c], i) => {
    f += `<text x="4" y="${12 + i * 6.4}" font-size="5.2" fill="${c}" font-family="monospace" font-weight="bold">${n}</text><text x="70" y="${12 + i * 6.4}" font-size="4.2" fill="#7c8a96" font-family="Arial">→</text><text x="86" y="${12 + i * 6.4}" font-size="5.2" text-anchor="end" fill="${c}" font-family="monospace" font-weight="bold">${p}</text>`;
  });
  k += tafelR(Z + 0.002, X0 + 0.04, X1 - 0.04, H0 + 0.03, H1 - 0.03, 90, 26, f);
  S.teil({ id: "bam_anzeige", de: "die Nummernanzeige", syl: "NUM-mern-an-zei-ge", it: "il display dei numeri", itSyl: "di-SPLAY dei NU-me-ri", en: "number display", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Wenn die eigene Nummer erscheint, geht man zum angezeigten Platz." });
}

/* =====================================================================
   DER STUHL und DER ANTRAGSTELLER (vor dem Platz, Rücken zu uns)
   ===================================================================== */
const AS = { X: 2.75, Z: 2.2 };
{
  const { X, Z } = AS;
  const [ax, ay] = P(X, 0, Z);
  let k = um(-ax, -ay, schatten(0, 0, 11, 1.4, 0.28));
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) { const a = P(X + dx, 0, Z + dz), b = P(X + dx, 0.42, Z + dz); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a3f45" stroke-width="1.1"/>`; }
  k += kiste(X - 0.23, X + 0.23, 0.39, 0.43, Z - 0.23, Z + 0.23, { x: "#2c3035", z: "#2c3035", deckel: S.lg("sitz", [[0, "#3b6fb0"], [1, "#2a5a96"]]) });
  k += kiste(X - 0.22, X + 0.22, 0.45, 0.92, Z + 0.2, Z + 0.25, { x: "#1f4f8a", z: S.lg("lehne", [[0, "#3b6fb0"], [1, "#24508a"]]), deckel: "#4a80c2" });
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}
{
  const { X, Z } = AS;
  const [ax, ay] = P(X, 0, Z - 0.02);
  const m = B.mensch({ id: "b01e_antrag", geschlecht: "m", pose: "sitzen", blick: 140, frisur: "glatze", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#6b4a2e" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.76 * mass(X, Z));
  S.teil({ id: "bam_antragsteller", de: "der Antragsteller", syl: "AN-trag-stel-ler", it: "il richiedente", itSyl: "ri-chie-DEN-te", en: "applicant", x: ax, y: ay, kunst: m.svg,
    tipp: "Der Antragsteller sagt: „Ich möchte einen neuen Personalausweis beantragen.“" });
}

/* =====================================================================
   DIE WARTESTÜHLE (Reihe mit blauen Polstern, Blick zu den Plätzen)
   ===================================================================== */
{
  const Z = 3.55, X0 = 0.95, X1 = 2.85, n = 4, d = (X1 - X0) / n;
  const [ax, ay] = P((X0 + X1) / 2, 0, Z + 0.25);
  let k = um(-ax, -ay, schatten(0, 0, 30, 1.8, 0.25));
  k += kiste(X0, X1, 0.33, 0.37, Z - 0.2, Z + 0.15, { x: "#3a3f45", z: "#2c3035", deckel: "#4a4f55" });
  for (const X of [X0 + 0.1, X1 - 0.12]) k += kiste(X, X + 0.05, 0, 0.33, Z - 0.05, Z, { x: "#2c3035", z: "#3a3f45" });
  for (let i = 0; i < n; i++) {
    const xa = X0 + i * d + 0.03, xb = xa + d - 0.06;
    k += kiste(xa, xb, 0.37, 0.45, Z - 0.22, Z + 0.2, { x: "#24508a", z: "#1f4f8a", deckel: S.lg("polster", [[0, "#4a80c2"], [1, "#2f6aaf"]]) });
    k += kiste(xa + 0.01, xb - 0.01, 0.45, 0.9, Z + 0.18, Z + 0.25, { x: "#1f4f8a", z: S.lg("rlehne", [[0, "#3b6fb0"], [1, "#24508a"]]), deckel: "#4a80c2" });
  }
  S.teil({ id: "bam_wartestuhl", de: "der Wartestuhl", syl: "WAR-te-stuhl", it: "la sedia d'attesa", itSyl: "SE-dia d'at-TE-sa", en: "waiting chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Auf den Wartestühlen wartet man, bis die Nummer aufgerufen wird." });
}

/* =====================================================================
   VORNE: Glas der Scheibe am Platz
   ===================================================================== */
{
  const { X0, X1, H } = TI, GZ = 1.35, GH = 1.38;
  const q = [P(X0 + 0.15, GH, GZ), P(X1 - 0.15, GH, GZ), P(X1 - 0.15, H + 0.08, GZ), P(X0 + 0.15, H + 0.08, GZ)];
  let v = poly(q, GLAS);
  const s0 = P(X0 + 0.35, GH - 0.02, GZ), s1 = P(X0 + 0.55, GH - 0.02, GZ), s2 = P(X0 + 0.45, H + 0.12, GZ), s3 = P(X0 + 0.25, H + 0.12, GZ);
  v += poly([s0, s1, s2, s3], "#fff", 'opacity=".14"');
  S.davor(`<g pointer-events="none">${v}</g>`);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/buergeramt.js"));
console.log(aus);
