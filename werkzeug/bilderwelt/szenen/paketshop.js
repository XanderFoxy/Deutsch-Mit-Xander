#!/usr/bin/env node
/* =====================================================================
   DER PAKETSHOP (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Paketshops der Paketdienste in Kiosk, Schreibwaren- oder
   Getränkeladen; Fachberichte zu Handscannern und Etikettendruckern
   in über 17 000 Paketshops; Retoure per QR-Code):
   - Der Paketshop ist ein Laden mit eigener Ware (hier ein Kiosk mit
     Zeitschriften), an dessen THEKE Pakete angenommen und abgeholt
     werden.
   - Auf der Theke: PAKETWAAGE, HANDSCANNER in der Ladeschale, ein
     kleiner ETIKETTENDRUCKER (Retourenlabel aus dem QR-Code), die
     Ladenkasse, das Kartenlesegerät, Klebeband zum Zukleben.
   - Abholung: Man bringt die BENACHRICHTIGUNGSKARTE und den Ausweis;
     die Pakete liegen im PAKETREGAL, nach Buchstaben sortiert.
   - Abgegebene Pakete kommen in den ROLLWAGEN; der Fahrer des
     Paketdienstes holt ihn ab. Der Kunde bekommt einen Beleg mit der
     SENDUNGSNUMMER zur Sendungsverfolgung.
   BLICK: Fluchtpunkt rechts (x = 240): links die Seitenwand mit dem
   Paketregal in starker Flucht, die Theke schräg davor, rechts hinten
   die Eingangstür. Augenhöhe 2,0 m.
   Maßstab: Rückwand 38 Einheiten je Meter, Thekenfront 54 je Meter
   (Thekenhöhe 1,0 m), Mitarbeiterin 1,66 m, Kunde 1,80 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "paketshop", titel: "Der Paketshop", emoji: "📦", thema: "Unterwegs", kuerzel: "b01b", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

/* ---------- Kamera: Fluchtpunkt rechts, Rückwand bei z = 0 ----------- */
const HY = 50, E = 2.0, D = 5.5, S0 = 38, VX = 240;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#e4ebe4"], [1, "#cfdad1"]]);
const SEITE = S.lg("seite", [[0, "#c9d6cc"], [1, "#b7c6bb"]], 0, 0, 1, 0);
const DECKE = S.lg("decke", [[0, "#ecefeb"], [1, "#f7f8f5"]]);
const NAVY = "#1d3557", ORANGE = "#f08a24";
const NUSS = S.lg("nuss", [[0, "#6e4a2e"], [0.5, "#5a3b24"], [1, "#4a2f1c"]], 0, 0, 1, 0);
const KARTON = S.lg("karton", [[0, "#d4a66b"], [1, "#bb8c4d"]]);
const KARTON_S = "#a07039", KARTON_T = "#dfba84";
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const VERZINKT = "#a9b0b6";

/* =====================================================================
   KULISSE — Decke mit Strahlern, Rückwand, linke Seitenwand, Vinylboden
   ===================================================================== */
const L = -4.63;                                   // linke Wand (X in m)
const WU = P(0, 0, 0)[1], WO = P(0, 2.8, 0)[1];     // 126 / 19.6
const [lx0, ly0] = P(L, 2.8, 0), [, ly1] = P(L, 0, 0);
{
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${DECKE}"/>`;
  /* Stromschiene mit Strahlern, in die Tiefe laufend */
  for (const X of [-2.2, 0.6]) {
    const a = P(X, 2.8, 0), b = P(X, 2.8, 1.6);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a3d42" stroke-width=".9"/>`;
    for (const z of [0.3, 0.9, 1.4]) { const [sx, sy] = P(X, 2.8, z); k += `<path d="M${sx} ${sy} l-1.4 3.4 h2.8 Z" fill="#2d3035"/><ellipse cx="${sx}" cy="${r(sy + 3.4)}" rx="1.4" ry=".5" fill="#fff6d8"/>`; }
  }
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("boden", [[0, "#b7a58d"], [1, "#a48f74"]])}"/>`;
  /* Vinyldielen in Holzoptik, in Flucht zum Fluchtpunkt, versetzte Stöße */
  for (let i = -24; i <= 12; i++) {
    const X = i * 0.2, a = P(X, 0, 0), b = P(X, 0, 2.75);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8a765c" stroke-width=".3"/>`;
    for (let j = 0; j < 3; j++) { const z = ((i * 0.37 + j * 0.9) % 2.7 + 2.7) % 2.7, c = P(X, 0, z), d = P(X + 0.2, 0, z); k += `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}" stroke="#8a765c" stroke-width=".3"/>`; }
  }
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("bodenlicht", [[0, "#000", 0.15], [0.5, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  /* Rückwand mit Akzentstreifen und Sockelleiste */
  k += `<rect x="${lx0}" y="${WO}" width="${r(320 - lx0)}" height="${r(WU - WO)}" fill="${WAND}"/>`;
  k += `<rect x="${lx0}" y="${WO}" width="${r(320 - lx0)}" height="${r(WU - WO)}" fill="${S.rg("wandlicht", [[0, "#fffbea", 0.5], [1, "#fffbea", 0]], 0.45, 0.15, 0.6)}"/>`;
  k += `<rect x="${lx0}" y="${r(WU - 2.2)}" width="${r(320 - lx0)}" height="2.2" fill="#6f7c73"/>`;
  /* linke Seitenwand (Flucht) */
  const [ex, ey0] = [0, P(L, 2.8, 1.468)[1]], ey1 = P(L, 0, 1.468)[1];
  k += poly([[lx0, ly0], [lx0, ly1], [ex, ey1], [ex, ey0]], SEITE);
  const s1 = P(L, 0.1, 0), s2 = P(L, 0.1, 1.47);
  k += poly([[lx0, ly1], [s2[0], ey1], [s2[0], s2[1]], [lx0, s1[1]]], "#6f7c73");
  /* Lagertür (geschlossen) links hinten in der Rückwand */
  const [t0x, t0y] = P(-3.95, 2.05, 0), [t1x, t1y] = P(-3.05, 0, 0);
  k += `<rect x="${t0x}" y="${t0y}" width="${r(t1x - t0x)}" height="${r(t1y - t0y)}" fill="${S.lg("lagertuer", [[0, "#9aa8a0"], [1, "#84928a"]], 0, 0, 1, 0)}" stroke="#6f7c73" stroke-width=".8"/>`;
  k += `<rect x="${r(t1x - 6)}" y="${r(t0y + 38)}" width="4" height="1.2" rx=".5" fill="#ddd"/><rect x="${r(t0x + 6)}" y="${r(t0y + 12)}" width="${r(t1x - t0x - 12)}" height="6" fill="#fff"/><text x="${r((t0x + t1x) / 2)}" y="${r(t0y + 16.2)}" font-size="2.6" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">Lager · Privat</text>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE EINGANGSTÜR (rechts hinten) mit Blick auf die Straße
   ===================================================================== */
{
  const [x0, y0] = P(1.18, 2.15, 0), [x1, y1] = P(2.12, 0, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="#59616a"/>`;
  k += `<rect x="2" y="2" width="${r(w - 4)}" height="${r(h - 4)}" fill="${S.lg("draussen", [[0, "#b9d3e6"], [0.45, "#d9cdb2"], [0.55, "#8d8f90"], [1, "#b8b2a6"]])}"/>`;
  k += `<rect x="4" y="10" width="${r(w - 8)}" height="22" fill="#cdb89a"/><rect x="7" y="14" width="7" height="8" fill="#7d8e9c"/><rect x="${r(w - 14)}" y="14" width="7" height="8" fill="#7d8e9c"/>`;
  k += `<rect x="2" y="2" width="${r(w - 4)}" height="${r(h - 4)}" fill="${S.lg("tuerglas", [[0, "#fff", 0.3], [0.5, "#fff", 0.05], [1, "#fff", 0.2]], 0, 0, 1, 1)}"/>`;
  k += `<rect x="${r(w / 2 - 12)}" y="34" width="24" height="12" rx="1" fill="${NAVY}"/><text x="${r(w / 2)}" y="39.6" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">PaketShop</text><text x="${r(w / 2)}" y="43.6" font-size="1.7" text-anchor="middle" fill="${ORANGE}" font-family="Arial">Annahme · Abholung</text>`;
  k += `<rect x="3" y="${r(h / 2)}" width="1.4" height="9" rx=".6" fill="${STAHL}"/>`;
  k += `<path d="M6 ${r(h - 4)} L18 2 L24 2 L12 ${r(h - 4)} Z" fill="#fff" opacity=".1"/>`;
  S.teil({ id: "ps_tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: x0 + w / 2, y: y1, steht: true, kunst: um(w / 2, h, k) });
}

/* =====================================================================
   2 — DAS SCHILD „PaketShop“ über der Theke
   ===================================================================== */
{
  let k = `<rect x="-52" y="-9" width="104" height="18" rx="2" fill="${S.lg("schild", [[0, "#24426b"], [1, "#16294a"]])}"/>`;
  k += `<rect x="-52" y="6.4" width="104" height="2.6" fill="${ORANGE}"/>`;
  /* Piktogramm: Paket mit Pfeil */
  k += `<path d="M-45 -4.4 L-39 -6.8 L-33 -4.4 L-33 2.6 L-39 5 L-45 2.6 Z" fill="${KARTON_T}"/><path d="M-45 -4.4 L-39 -2 L-33 -4.4 M-39 -2 L-39 5" stroke="#8a6232" stroke-width=".5" fill="none"/>`;
  k += `<text x="6" y="2.6" font-size="10" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold">PaketShop</text>`;
  k += `<text x="0" y="8.6" font-size="2.1" text-anchor="middle" fill="#fff" font-family="Arial" letter-spacing=".4">ANNAHME · ABHOLUNG · RETOUREN</text>`;
  S.teil({ id: "ps_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 186, y: 34, kunst: k });
}

/* =====================================================================
   3 — DAS PAKETREGAL an der linken Wand (Lupe: Fach, Päckchen,
       Versandbeutel, Karton)
   ===================================================================== */
const RG = { Xw: L, Xf: L + 0.5, z0: 0.15, z1: 1.45, H: 2.0 };
{
  const { Xw, Xf, z0, z1, H } = RG;
  const [ax, ay] = P(Xf, 0, (z0 + z1) / 2);
  let k = "";
  const boeden = [0.1, 0.55, 1.0, 1.45, 1.9];
  /* Rückwand des Regals: Lochblech an der Wand (dunkler) */
  k += poly([P(Xw, 0, z0), P(Xw, 0, z1), P(Xw, H, z1), P(Xw, H, z0)], "#8e9aa3");
  /* Pakete (hinten zuerst): [zA, zB, tiefe, höhe, art] je Fach */
  const art = (t) => t === "b" ? { vorn: "#e9ecef", deckel: "#f6f7f8", seite: "#cfd5da" } : t === "g" ? { vorn: "#c8ced3", deckel: "#dde1e4", seite: "#a9b1b8" } : { vorn: KARTON, deckel: KARTON_T, seite: KARTON_S };
  const fuellung = [
    /* Boden 0.10 — große Kartons */
    [0.1, [[0.2, 0.62, 0.42, 0.38, "k"], [0.66, 1.0, 0.46, 0.3, "k"], [1.04, 1.42, 0.4, 0.34, "k"]]],
    /* 0.55 — mittlere Kartons */
    [0.55, [[0.2, 0.48, 0.36, 0.28, "k"], [0.5, 0.82, 0.4, 0.34, "k"], [0.86, 1.1, 0.3, 0.22, "k"], [1.12, 1.42, 0.36, 0.3, "k"]]],
    /* 1.00 — Päckchen */
    [1.0, [[0.2, 0.38, 0.3, 0.14, "k"], [0.2, 0.36, 0.3, 0.12, "k", 0.14], [0.42, 0.62, 0.34, 0.2, "k"], [0.66, 0.8, 0.26, 0.12, "k"], [0.84, 1.08, 0.3, 0.22, "k"], [1.12, 1.28, 0.28, 0.16, "k"], [1.3, 1.42, 0.24, 0.1, "k"]]],
    /* 1.45 — Versandbeutel (weich, grau/weiß) */
    [1.45, [[0.2, 0.46, 0.34, 0.2, "b"], [0.48, 0.72, 0.38, 0.26, "g"], [0.76, 1.02, 0.34, 0.18, "b"], [1.04, 1.24, 0.36, 0.24, "g"], [1.26, 1.42, 0.3, 0.16, "b"]]],
  ];
  for (const [hb, liste] of fuellung) {
    for (const [za, zb, t, h, a, auf] of liste) {
      const h0 = hb + 0.02 + (auf || 0);
      const X0 = Xw + 0.04, X1 = Math.min(Xf - 0.02, X0 + t);
      const f = art(a);
      if (a === "k") k += kiste(X0, X1, h0, h0 + h, za, zb, f);
      else {
        /* weicher Beutel: abgerundete Seite */
        const q = [P(X1, h0, zb), P(X1, h0, za), P(X1, h0 + h, za + 0.03), P(X1, h0 + h * 0.85, zb - 0.02)];
        k += kiste(X0, X1, h0, h0 + h * 0.85, za, zb, { deckel: f.deckel, vorn: f.vorn });
        k += `<path d="M${q[0].join(" ")} L${q[1].join(" ")} Q${r(q[1][0] + 0.4)} ${r((q[1][1] + q[2][1]) / 2)} ${q[2].join(" ")} Q${r((q[2][0] + q[3][0]) / 2)} ${r(q[2][1] - 1.2)} ${q[3].join(" ")} Z" fill="${f.seite === "#cfd5da" ? "#eef0f2" : "#c2c9cf"}" stroke="#9aa3ab" stroke-width=".25"/>`;
      }
      /* Etikett auf der Raumseite */
      if (zb - za > 0.15 && h > 0.12) {
        const m = (za + zb) / 2, e = [P(X1, h0 + h * 0.62, m - 0.07), P(X1, h0 + h * 0.62, m + 0.07), P(X1, h0 + h * 0.3, m + 0.07), P(X1, h0 + h * 0.3, m - 0.07)];
        k += poly(e, "#fff", 'stroke="#ccc" stroke-width=".15"');
        const c = P(X1, h0 + h * 0.5, m - 0.04), d = P(X1, h0 + h * 0.5, m + 0.05);
        k += `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}" stroke="#222" stroke-width=".5" stroke-dasharray=".3 .2"/>`;
      }
    }
  }
  /* Rahmen: Böden (Kante), Pfosten vorn — verzinktes Stahlregal */
  for (const hb of boeden) {
    k += kiste(Xw, Xf, hb - 0.03, hb, z0, z1, { seite: "#c3c9ce", deckel: "#d6dbdf" });
    const a = P(Xf, hb - 0.03, z0), b = P(Xf, hb - 0.03, z1);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7f878e" stroke-width=".5"/>`;
  }
  for (const z of [z0, (z0 + z1) / 2, z1]) {
    k += kiste(Xf - 0.04, Xf, 0, H, z - 0.02, z, { seite: VERZINKT, vorn: "#c2c8cd" });
    k += kiste(Xw, Xw + 0.04, 0, H, z - 0.02, z, { vorn: "#9aa2a8" });
  }
  /* Fachschilder mit Buchstaben (nach Nachnamen sortiert) */
  const buchst = [["A–E", "F–K"], ["L–P", "Q–Z"], ["A–K", "L–Z"], ["Retoure", "Fahrer"]];
  const schildQ = [];
  [0.55, 1.0, 1.45, 1.9].forEach((hb, i) => {
    [[z0 + 0.12, z0 + 0.42], [(z0 + z1) / 2 + 0.12, (z0 + z1) / 2 + 0.42]].forEach(([a, b], j) => {
      const q = [P(Xf, hb - 0.035, a), P(Xf, hb - 0.035, b), P(Xf, hb - 0.11, b), P(Xf, hb - 0.11, a)];
      if (hb === 1.9) { q[2] = P(Xf, hb + 0.06, b); q[3] = P(Xf, hb + 0.06, a); q[0] = P(Xf, hb - 0.01, a); q[1] = P(Xf, hb - 0.01, b); }
      k += poly(q, j === 1 && i === 3 ? ORANGE : "#fff", 'stroke="#555" stroke-width=".2"');
      const mx = (q[0][0] + q[1][0]) / 2, my = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
      k += `<text x="${r(mx)}" y="${r(my + 0.8)}" font-size="2.2" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold" transform="skewY(${r(Math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]) * 180 / Math.PI)})" transform-origin="${r(mx)} ${r(my)}">${buchst[i][j]}</text>`;
      if (i === 1 && j === 1) schildQ.push(q);
    });
  });
  const fl = (pts) => { const [x0, y0, x1, y1] = box(pts); return flaeche(x0 - ax, y0 - ay, x1 - x0, y1 - y0); };
  const unter = [
    { id: "ps_fach", de: "das Fach", syl: "FACH", it: "lo scomparto", itSyl: "scom-PAR-to", en: "compartment", kunst: fl(schildQ[0]),
      tipp: "Die Pakete liegen in Fächern – nach dem Anfangsbuchstaben des Nachnamens." },
    { id: "ps_versandbeutel", de: "der Versandbeutel", syl: "ver-SAND-beu-tel", it: "la busta di plastica", itSyl: "BU-sta di PLA-sti-ca", en: "mailing bag",
      kunst: fl([P(Xf, 1.48, z0 + 0.05), P(Xf, 1.48, z1 - 0.05), P(Xf, 1.75, z1 - 0.05), P(Xf, 1.75, z0 + 0.05)]),
      tipp: "Kleidung verschickt man oft in einem weichen Versandbeutel." },
    { id: "ps_paeckchen", de: "das Päckchen", syl: "PÄCK-chen", it: "il pacchetto", itSyl: "pac-CHET-to", en: "small parcel",
      kunst: fl([P(Xf, 1.03, z0 + 0.05), P(Xf, 1.03, z1 - 0.05), P(Xf, 1.3, z1 - 0.05), P(Xf, 1.3, z0 + 0.05)]),
      tipp: "Ein Päckchen ist kleiner und leichter als ein Paket." },
    { id: "ps_karton", de: "der Karton", syl: "kar-TON", it: "lo scatolone", itSyl: "sca-to-LO-ne", en: "cardboard box",
      kunst: fl([P(Xf, 0.13, z0 + 0.05), P(Xf, 0.13, z1 - 0.05), P(Xf, 0.47, z1 - 0.05), P(Xf, 0.47, z0 + 0.05)]) },
  ].map((u) => Object.assign(u, { x: ax, y: ay }));
  S.teil({ id: "ps_regal_ps", de: "das Paketregal", syl: "pa-KET-re-gal", it: "lo scaffale dei pacchi", itSyl: "scaf-FA-le dei PAC-chi", en: "parcel shelf", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 0, y: 46, w: 90, h: 60 }, unter,
    tipp: "Im Paketregal warten die Pakete, bis sie abgeholt werden." });
}

/* =====================================================================
   4 — DIE ZEITSCHRIFTEN an der Rückwand (der Laden ist ein Kiosk)
   ===================================================================== */
{
  const X0 = -2.75, X1 = -0.55, H0 = 1.12, H1 = 1.98;
  const [x0, y0] = P(X0, H1, 0), [x1, y1] = P(X1, H0, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="#4a3a2c"/>`;
  const reihen = 3, sp = 7;
  const farben = ["#c8102e", "#2f6db5", "#f2a900", "#3d9a5b", "#7b4fa3", "#e06a2c", "#1d1d1d", "#d94f6b", "#4aa3a8"];
  for (let rr = 0; rr < reihen; rr++) {
    const yb = (rr + 1) * h / reihen - 1;
    k += `<rect x="0" y="${r(yb)}" width="${r(w)}" height="1.4" fill="#2e241a"/>`;
    for (let i = 0; i < sp; i++) {
      const xx = 1.6 + i * (w - 3) / sp, ww = (w - 3) / sp - 1.2, hh = h / reihen - 3.2;
      const c = farben[(i * 3 + rr * 5) % farben.length];
      k += `<rect x="${r(xx)}" y="${r(yb - hh)}" width="${r(ww)}" height="${r(hh)}" fill="${c}"/>`;
      k += `<rect x="${r(xx + 0.6)}" y="${r(yb - hh + 0.8)}" width="${r(ww - 1.2)}" height="1.6" fill="#fff" opacity=".85"/>`;
      k += `<circle cx="${r(xx + ww / 2)}" cy="${r(yb - hh / 2 + 1)}" r="${r(ww * 0.28)}" fill="#fff" opacity=".35"/>`;
      k += `<rect x="${r(xx + 0.8)}" y="${r(yb - 3)}" width="${r(ww * 0.6)}" height=".6" fill="#fff" opacity=".7"/>`;
    }
  }
  k += `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="none" stroke="#2e241a" stroke-width="1"/>`;
  S.teil({ id: "ps_zeitschrift", de: "die Zeitschrift", syl: "ZEIT-schrift", it: "la rivista", itSyl: "ri-VI-sta", en: "magazine", x: x0 + w / 2, y: y1, kunst: um(w / 2, h, k),
    tipp: "Viele Paketshops sind auch Kiosk: Dort gibt es Zeitschriften und Zeitungen." });
}

/* =====================================================================
   5 — DER ROLLWAGEN (rechts) mit abgegebenen Paketen für den Fahrer
   ===================================================================== */
{
  const X0 = 0.62, X1 = 1.38, z0 = 0.32, z1 = 0.92, H = 1.55;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(0, 0, 22, 1.8, 0.3);
  k = um(-ax, -ay, k);
  /* Boden und Rollen */
  k += kiste(X0, X1, 0.1, 0.16, z0, z1, { vorn: "#7d858c", deckel: "#9aa2a8", seite: "#6d757c" });
  for (const [X, z] of [[X0 + 0.05, z1 - 0.03], [X1 - 0.05, z1 - 0.03], [X0 + 0.05, z0 + 0.05]]) { const [cx, cy] = P(X, 0.05, z); k += `<circle cx="${cx}" cy="${cy}" r="2" fill="#222"/><circle cx="${cx}" cy="${cy}" r=".7" fill="#777"/>`; }
  /* Pakete */
  const pk = [[0.68, 1.02, 0.16, 0.5, 0.36, 0.86, "k"], [1.04, 1.34, 0.16, 0.42, 0.38, 0.86, "k"], [0.7, 1.0, 0.5, 0.78, 0.4, 0.84, "w"], [1.02, 1.32, 0.42, 0.62, 0.4, 0.82, "k"], [0.74, 1.12, 0.78, 1.0, 0.42, 0.84, "k"], [1.06, 1.3, 0.62, 0.82, 0.42, 0.8, "w"], [0.82, 1.08, 1.0, 1.16, 0.44, 0.8, "k"]];
  pk.forEach(([a, b, h0, h1, za, zb, t]) => {
    k += kiste(a, b, h0, h1, za, zb, t === "w" ? { vorn: "#eceae4", deckel: "#f7f6f2", seite: "#d5d2ca" } : { vorn: KARTON, deckel: KARTON_T, seite: KARTON_S });
    const q = P(a + 0.04, h1 - 0.04, zb);
    k += `<rect x="${q[0]}" y="${q[1]}" width="5.4" height="3.6" fill="#fff"/><rect x="${r(q[0] + 0.5)}" y="${r(q[1] + 1.8)}" width="4.4" height="1.2" fill="#222" opacity=".8"/><rect x="${r(q[0] + 0.5)}" y="${r(q[1] + 0.5)}" width="2.4" height=".8" fill="${ORANGE}"/>`;
  });
  /* Gitter: Rückseite, rechte Seite, Vorderseite */
  const gitter = (pts, n, m) => {
    let g = "";
    const [a, b, c, d] = pts;            // a unten links, b unten rechts, c oben rechts, d oben links
    for (let i = 0; i <= n; i++) { const t = i / n, p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], q = [d[0] + (c[0] - d[0]) * t, d[1] + (c[1] - d[1]) * t]; g += `<line x1="${r(p[0])}" y1="${r(p[1])}" x2="${r(q[0])}" y2="${r(q[1])}" stroke="${VERZINKT}" stroke-width="${i % n ? 0.35 : 0.9}"/>`; }
    for (let j = 0; j <= m; j++) { const t = j / m, p = [a[0] + (d[0] - a[0]) * t, a[1] + (d[1] - a[1]) * t], q = [b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t]; g += `<line x1="${r(p[0])}" y1="${r(p[1])}" x2="${r(q[0])}" y2="${r(q[1])}" stroke="${VERZINKT}" stroke-width="${j % m ? 0.35 : 0.9}"/>`; }
    return g;
  };
  k = gitter([P(X0, 0.16, z0), P(X1, 0.16, z0), P(X1, H, z0), P(X0, H, z0)], 8, 6) + k;
  k += gitter([P(X0, 0.16, z1), P(X0, 0.16, z0), P(X0, H, z0), P(X0, H, z1)], 5, 6);
  k += gitter([P(X0, 0.16, z1), P(X1, 0.16, z1), P(X1, H, z1), P(X0, H, z1)], 8, 6);
  const [tx, ty] = P(X0 + 0.08, 1.38, z1);
  k += `<rect x="${tx}" y="${ty}" width="15" height="5" fill="${NAVY}"/><text x="${r(tx + 7.5)}" y="${r(ty + 3.5)}" font-size="2.3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">ABHOLUNG</text>`;
  S.teil({ id: "ps_rollwagen", de: "der Rollwagen", syl: "ROLL-wa-gen", it: "il carrello", itSyl: "car-REL-lo", en: "roll cage", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Im Rollwagen sammeln sich die abgegebenen Pakete. Der Fahrer holt sie ab." });
}

/* =====================================================================
   6 — DIE MITARBEITERIN (hinter der Theke)
   ===================================================================== */
{
  const [mx, my] = P(-1.05, 0, 0.62);
  const m = B.mensch({ id: "b01b_mitarb", geschlecht: "w", pose: "stehen", blick: 22, frisur: "zopf", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f5f6f" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.66 * sk(0.62));
  S.teil({ id: "ps_mitarbeiterin", de: "die Mitarbeiterin", syl: "MIT-ar-bei-te-rin", it: "l'addetta", itSyl: "ad-DET-ta", en: "shop assistant", x: mx, y: my, kunst: m.svg,
    tipp: "Die Mitarbeiterin scannt das Paket und gibt dem Kunden einen Beleg." });
}

/* =====================================================================
   7 — DIE THEKE (Holzfront, helle Platte)
   ===================================================================== */
const TK = { X0: -3.0, X1: 0.3, zh: 1.0, zv: 1.6, H: 1.0 };
{
  const { X0, X1, zh, zv, H } = TK;
  const [ax, ay] = P((X0 + X1) / 2, 0, zv);
  let k = poly([P(X0 - 0.05, 0, zv + 0.12), P(X1 + 0.05, 0, zv + 0.12), P(X1, 0, zv), P(X0, 0, zv)], "#1b120a", 'opacity=".2" filter="url(#bw_weich)"');
  k += kiste(X0, X1, 0, H - 0.04, zh, zv, { vorn: NUSS });
  /* Lamellen und Sockel */
  for (let X = X0 + 0.12; X < X1 - 0.05; X += 0.12) { const a = P(X, 0.1, zv), b = P(X, H - 0.06, zv); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a2516" stroke-width=".45"/>`; }
  k += kiste(X0, X1, 0, 0.1, zh, zv, { vorn: "#2b2f33" });
  k += kiste(X0 - 0.03, X1 + 0.03, H - 0.04, H, zh - 0.03, zv + 0.03, { vorn: "#e9e7e1", deckel: S.lg("platte", [[0, "#d6d3cc"], [1, "#f1efea"]]) });
  /* Aufkleber auf der Front */
  const [s0x, s0y] = P(-2.6, 0.78, zv), [s1x, s1y] = P(-1.6, 0.52, zv);
  k += `<rect x="${s0x}" y="${s0y}" width="${r(s1x - s0x)}" height="${r(s1y - s0y)}" rx="1.2" fill="${NAVY}"/>`;
  k += `<text x="${r((s0x + s1x) / 2)}" y="${r(s0y + 6.4)}" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">PaketShop</text>`;
  k += `<text x="${r((s0x + s1x) / 2)}" y="${r(s0y + 10.6)}" font-size="2.2" text-anchor="middle" fill="${ORANGE}" font-family="Arial">Hier Pakete abgeben</text>`;
  S.teil({ id: "ps_theke_ps", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}

/* =====================================================================
   8 — AUF DER THEKE (von links): Waage mit Paket und Adressaufkleber,
       Etikettendrucker, Beleg mit Sendungsnummer, Scanner, Klebeband,
       Kartenlesegerät, Kasse
   ===================================================================== */
const HT = TK.H;
{
  const A = -2.88, Bx = -2.34, za = 1.12, zb = 1.52;
  const [wx, wy] = P((A + Bx) / 2, HT, zb);
  let k = kiste(A, Bx, HT, HT + 0.035, za, zb, { vorn: "#3a3d42", deckel: STAHL });
  const [dx, dy] = P(A + 0.06, HT + 0.035, zb);
  k += `<rect x="${dx}" y="${r(dy - 0.2)}" width="10.4" height="2.4" rx=".4" fill="#0f1d14"/><text x="${r(dx + 9.8)}" y="${r(dy + 1.6)}" font-size="1.9" text-anchor="end" fill="#7cff8a" font-family="monospace">4,26 kg</text>`;
  S.teil({ oben: true, id: "ps_waage_ps", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: wx, y: wy, steht: true, kunst: um(wx, wy, k) + flaeche(dx - wx - 0.5, dy - wy - 0.8, 11.6, 3.8),
    tipp: "Die Waage zeigt, wie schwer das Paket ist." });
}
const PK = { A: -2.82, Bx: -2.42, za: 1.16, zb: 1.44, h0: HT + 0.035, h1: HT + 0.33 };
{
  const { A, Bx, za, zb, h0, h1 } = PK;
  const [px, py] = P((A + Bx) / 2, h0, zb);
  let k = kiste(A, Bx, h0, h1, za, zb, { vorn: KARTON, deckel: KARTON_T, seite: KARTON_S });
  const t0 = P(A, h1, (za + zb) / 2), t1 = P(Bx, h1, (za + zb) / 2);
  k += `<line x1="${t0[0]}" y1="${t0[1]}" x2="${t1[0]}" y2="${t1[1]}" stroke="#a7834f" stroke-width="1.3" opacity=".75"/>`;
  const v0 = P(A + 0.2, h0, zb), v1 = P(A + 0.2, h1, zb);
  k += `<line x1="${v0[0]}" y1="${v0[1]}" x2="${v1[0]}" y2="${v1[1]}" stroke="#a7834f" stroke-width="1.3" opacity=".6"/>`;
  S.teil({ oben: true, id: "ps_paket", de: "das Paket", syl: "pa-KET", it: "il pacco", itSyl: "PAC-co", en: "parcel", x: px, y: py, steht: true, kunst: um(px, py, k),
    tipp: "Ein Paket darf bei den meisten Paketdiensten bis zu 31,5 kg wiegen." });
}
{
  /* Adressaufkleber auf der Paketvorderseite */
  const { A, zb, h0, h1 } = PK;
  const [x0, y0] = P(A + 0.03, h1 - 0.04, zb), [x1, y1] = P(A + 0.19, h0 + 0.1, zb);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="#fff" stroke="#d6d3cc" stroke-width=".2"/>`;
  k += `<rect x=".6" y=".6" width="${r(w * 0.45)}" height=".7" fill="${ORANGE}"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x=".6" y="${r(2 + i * 1.1)}" width="${r(w * (0.85 - i * 0.12))}" height=".35" fill="#333"/>`;
  for (let i = 0; i < 11; i++) k += `<rect x="${r(0.6 + i * (w - 1.2) / 11)}" y="${r(h - 2.6)}" width="${i % 3 ? 0.25 : 0.45}" height="2" fill="#111"/>`;
  S.teil({ oben: true, id: "ps_adressaufkleber", de: "der Adressaufkleber", syl: "a-DRESS-auf-kle-ber", it: "l'etichetta", itSyl: "e-ti-CHET-ta", en: "address label", x: x0, y: y1, steht: true, kunst: um(0, h, k),
    tipp: "Auf dem Adressaufkleber stehen Empfänger, Absender und ein Strichcode." });
}
{
  /* Etikettendrucker (hinten, Personalseite) */
  const [ex, ey] = P(-2.02, HT, 1.12);
  let k = schatten(0, 0, 5, .7, .25);
  k += `<path d="M-5 0 L5 0 L5 -6 Q5 -8 3 -8 L-3 -8 Q-5 -8 -5 -6 Z" fill="${S.lg("drucker", [[0, "#4a4e54"], [1, "#2a2d31"]])}"/>`;
  k += `<rect x="-5" y="-4.2" width="10" height=".8" fill="#1b1d20"/><circle cx="3.4" cy="-6.2" r=".6" fill="#3ca35a"/>`;
  k += `<path d="M-3.4 -4 L3.4 -4 L3.2 1.8 L-3.6 2 Z" fill="#fff" stroke="#ccc" stroke-width=".2"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-2.8 + i * 0.6)}" y="-2.4" width="${i % 3 ? 0.25 : 0.4}" height="2.4" fill="#222"/>`;
  S.teil({ oben: true, id: "ps_etikettendrucker", de: "der Etikettendrucker", syl: "e-ti-KET-ten-dru-cker", it: "la stampante di etichette", itSyl: "stam-PAN-te di e-ti-CHET-te", en: "label printer", x: ex, y: ey, steht: true, kunst: k,
    tipp: "Für eine Retoure zeigt man den QR-Code auf dem Handy. Der Drucker druckt dann das Etikett." });
}
{
  /* Beleg mit der Sendungsnummer (gerollt) */
  const [bx, by] = P(-1.9, HT, 1.5);
  let k = `<path d="M-6 0 L5 0 L5.4 -1.2 L-5.6 -1.4 Z" fill="#fbfbf8" stroke="#d6d6d0" stroke-width=".15"/>`;
  k += `<path d="M-6.4 -1.4 Q-5 -7 -.4 -7.4 L5.2 -7.2 Q6.6 -4 5.4 -1.2 Z" fill="#f6f6f2" stroke="#d6d6d0" stroke-width=".2"/>`;
  k += `<text x="-.4" y="-5.2" font-size="1.2" text-anchor="middle" fill="#333" font-family="Arial">Sendungsnummer</text><text x="-.2" y="-3.4" font-size="1.45" text-anchor="middle" fill="#111" font-family="monospace" font-weight="bold">4825 9104 3367</text>`;
  for (let i = 0; i < 14; i++) k += `<rect x="${r(-4.2 + i * 0.6)}" y="-2.6" width="${i % 3 ? 0.2 : 0.35}" height="1" fill="#222"/>`;
  S.teil({ oben: true, id: "ps_sendungsnummer", de: "die Sendungsnummer", syl: "SEN-dungs-num-mer", it: "il numero di spedizione", itSyl: "NU-me-ro di spe-di-ZIO-ne", en: "tracking number", x: bx, y: by, steht: true, kunst: k + flaeche(-6.8, -8, 13, 8.6),
    tipp: "Mit der Sendungsnummer kann man sein Paket im Internet verfolgen." });
}
{
  /* Handscanner in der Ladeschale */
  const [sx, sy] = P(-1.58, HT, 1.3);
  let k = schatten(0, 0, 4.4, .7, .3);
  k += `<path d="M-4 0 L4 0 L3.4 -2.6 L-3.4 -2.6 Z" fill="#2a2d31"/>`;
  k += `<path d="M-2.2 -2.4 L2.2 -2.4 L2.6 -12.6 Q2.6 -14 1.2 -14 L-1.2 -14 Q-2.6 -14 -2.6 -12.6 Z" fill="${S.lg("scanner", [[0, "#ffb347"], [1, "#e07b1e"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.8" y="-13.2" width="3.6" height="4" rx=".4" fill="#14232e"/><rect x="-1.4" y="-12.8" width="2.8" height="3.2" fill="#5ab7e0"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-1.5 + (i % 3) * 1.1)}" y="${r(-8 + Math.floor(i / 3) * 1.2)}" width=".8" height=".7" rx=".2" fill="#333"/>`;
  k += `<rect x="-1.4" y="-14.6" width="2.8" height=".7" fill="#d23b30"/>`;
  S.teil({ oben: true, id: "ps_scanner", de: "der Scanner", syl: "SCAN-ner", it: "lo scanner", itSyl: "SCAN-ner", en: "scanner", x: sx, y: sy, steht: true, kunst: k,
    tipp: "Mit dem Scanner liest die Mitarbeiterin den Strichcode auf dem Paket." });
}
{
  /* Klebeband im Tischabroller */
  const [kx, ky] = P(-1.32, HT, 1.52);
  let k = schatten(0, 0, 6, .7, .3);
  k += `<path d="M-6 0 L5 0 L6.4 -2.6 L5 -3.4 L-5 -3.4 Z" fill="#2a2d31"/>`;
  k += `<circle cx="-.6" cy="-5.6" r="4.4" fill="${S.rg("band", [[0, "#7a5a33"], [0.45, "#c79a56"], [1, "#e0bd80"]])}"/><circle cx="-.6" cy="-5.6" r="2.4" fill="#e7e1d4"/><circle cx="-.6" cy="-5.6" r="1.2" fill="#555"/>`;
  k += `<path d="M3.6 -4.6 L6.4 -2.6" stroke="#c79a56" stroke-width=".8"/>`;
  S.teil({ oben: true, id: "ps_klebeband", de: "das Klebeband", syl: "KLE-be-band", it: "il nastro adesivo", itSyl: "NA-stro a-de-SI-vo", en: "packing tape", x: kx, y: ky, steht: true, kunst: k });
}
{
  /* Kartenlesegerät */
  const [kx, ky] = P(-0.72, HT, 1.48);
  let k = schatten(0, 0, 3.4, .6, .3);
  k += `<path d="M-3 0 L3 0 L3.4 -11 Q3.4 -12 2.4 -12 L-2.4 -12 Q-3.4 -12 -3.4 -11 Z" fill="#2a2e33"/>`;
  k += `<rect x="-2.5" y="-11.2" width="5" height="3.4" rx=".3" fill="#9cd3e8"/><text x="0" y="-9" font-size="1.3" text-anchor="middle" fill="#0b3b52" font-family="Arial">2,40 €</text>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-2.2 + (i % 3) * 1.6)}" y="${r(-6.8 + Math.floor(i / 3) * 1.4)}" width="1.1" height=".9" rx=".2" fill="${i === 9 ? "#d23b30" : i === 11 ? "#3ca35a" : "#596068"}"/>`;
  S.teil({ oben: true, id: "ps_kartenlesegeraet", de: "das Kartenlesegerät", syl: "KAR-ten-le-se-ge-rät", it: "il lettore di carte", itSyl: "let-TO-re di CAR-te", en: "card reader", x: kx, y: ky, steht: true, kunst: k });
}
{
  /* Ladenkasse mit Kundendisplay */
  const [kx, ky] = P(-0.42, HT, 1.12);
  let k = schatten(0, 0, 10, 1, .3);
  k += `<rect x="-9" y="-4" width="18" height="4" rx=".6" fill="#2b2f33"/><rect x="-7" y="-3.2" width="14" height="1.2" fill="#3c4146"/>`;
  k += `<rect x="-1" y="-7" width="2" height="3" fill="#3a3f44"/>`;
  k += `<path d="M-9 -18 L9 -18 L9.6 -7 L-9.6 -7 Z" fill="#1d2125"/><path d="M-8 -17 L8 -17 L8.6 -8 L-8.6 -8 Z" fill="${S.lg("kassebild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  k += `<rect x="-7" y="-15.6" width="6.4" height="3" rx=".4" fill="${ORANGE}"/><rect x=".4" y="-15.6" width="6.4" height="3" rx=".4" fill="#4aa3a8"/><rect x="-7" y="-12" width="13.8" height="2.6" rx=".4" fill="#3d9a5b"/>`;
  k += `<rect x="5" y="-22.4" width="8" height="4" rx=".4" fill="#111"/><text x="9" y="-19.6" font-size="2" text-anchor="middle" fill="#7cff8a" font-family="monospace">2,40</text>`;
  S.teil({ oben: true, id: "ps_kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "cash register", x: kx, y: ky, steht: true, kunst: k });
}

/* =====================================================================
   9 — DER KUNDE (vorne rechts) mit der Benachrichtigungskarte
   ===================================================================== */
{
  const z = 2.08, [kx, ky] = P(0.08, 0, z);
  const m = B.mensch({ id: "b01b_kunde", geschlecht: "m", pose: "halten", blick: 205, frisur: "kurz", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "#6b7f4a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#2f3035" } } }, 1.8 * sk(z));
  S.teil({ id: "ps_kunde_ps", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: kx, y: ky, kunst: m.svg,
    tipp: "Der Kunde sagt: „Ich möchte ein Paket abholen.“" });
  /* Die Benachrichtigungskarte liegt vor ihm auf der Theke, er schiebt sie hinüber */
  const [bx, by] = P(-0.2, HT, 1.62);
  let k = `<path d="M-7 0 L5.6 0 L7.4 -4.2 L-5.2 -4.2 Z" fill="${S.lg("karte", [[0, "#ffd34d"], [1, "#f2b705"]])}" stroke="#b88a00" stroke-width=".2"/>`;
  k += `<path d="M-4.6 -3.4 h6 M-5 -2.4 h5 M-5.4 -1.4 h7" stroke="#5a4500" stroke-width=".3"/><rect x="3" y="-3.6" width="2.6" height="2.4" fill="#fff" opacity=".8"/>`;
  S.teil({ oben: true, id: "ps_benachrichtigung", de: "die Benachrichtigungskarte", syl: "be-NACH-rich-ti-gungs-kar-te", it: "l'avviso di giacenza", itSyl: "av-VI-so di gia-CEN-za", en: "delivery note", x: bx, y: by, steht: true, kunst: k + flaeche(-7.4, -5.4, 15.2, 6),
    tipp: "Die Karte war im Briefkasten: Das Paket liegt im Paketshop zur Abholung bereit." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/paketshop.js"));
console.log(aus);
