#!/usr/bin/env node
/* =====================================================================
   DER ELTERNABEND (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Checklisten Elternabend des Landesinstituts Hamburg,
   Betzold „Elternabend planen“, Handout Elternvertretung der
   Elternstiftung Baden-Württemberg):
   - Der Elternabend findet abends im KLASSENZIMMER statt. Die Tische
     stehen als HUFEISEN (U-Form), damit alle die Tafel und einander
     sehen; auf den Tischen stehen NAMENSSCHILDER, oft Kaffee und Kekse.
   - Die TAFEL ist sauber bis auf die TAGESORDNUNG: Begrüßung,
     Informationen zur Klasse, anstehende Projekte (z. B. Klassenfahrt),
     WAHL DER ELTERNVERTRETER (offen per Handzeichen), Verschiedenes.
   - Die Klassenlehrerin leitet den Abend, eine ANWESENHEITSLISTE geht
     herum, ELTERNBRIEFE werden verteilt; der Elternvertreter wird
     gewählt.
   - Typisch im Raum: Stundenplan und Kalender an der Wand, die Uhr über
     der Tafel, große Fenster (jetzt dunkel), Deckenleuchten an.
   BLICK: von der offenen Seite des Hufeisens auf die Tafelwand,
   Augenhöhe 1,55 m. Links die Fensterwand, rechts die Tür.
   Maßstab: Tafelwand 34 Einheiten je Meter (Fuß bei y ≈ 125), vorn
   ≈ 65 je Meter. Tischhöhe 0,72 m, Sitzhöhe ≈ 0,45 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "elternabend", titel: "Der Elternabend", emoji: "🧑‍🏫", thema: "Schule", kuerzel: "b10b", fassung: 852 });
const rnd = zufall(1930);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 72, E = 1.55, D = 5.5, S0 = 34, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const rz = (X0, X1, H0, H1, z, fill, extra = "") => { const s = sk(z); return `<rect x="${r(VX + X0 * s)}" y="${r(HY + (E - H1) * s)}" width="${r((X1 - X0) * s)}" height="${r((H1 - H0) * s)}" fill="${fill}"${extra ? " " + extra : ""}/>`; };
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}
const linie = (a, b, farbe, w, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${farbe}" stroke-width="${w}"${extra}/>`;
/* Figuren schlanker: Koordinaten auf halbe Zentimeter runden (unsichtbar
   bei dieser Größe, spart ein Drittel der Datei – die Seite lädt schneller) */
const h2 = (n) => String(Math.round(parseFloat(n) * 2) / 2);
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };

/* ---------- Haltungen ------------------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
/* Handzeichen bei der Wahl: der rechte Arm geht hoch */
MP.b10b_melden = Object.assign({}, MP.sitzen, { schulterR: { vor: 160, seit: 14 }, ellbogenR: 18, unterarmR: 70, handR: 6, fingerR: 0.08 });

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const BUCHE = S.lg("buche", [[0, "#ecd2a4"], [1, "#d8b882"]]);
const ROHR = "#5d646b";
const KREIDE = "'Comic Sans MS','Segoe Print',cursive";
const RW = 3.5;                         /* Raumbreite: Wände bei X = ±3,5 m */
const ZW = D * (1 - S0 * RW / 160);     /* bis dahin sind die Seitenwände im Bild */

/* =====================================================================
   KULISSE — Decke, Tafelwand, Fensterwand (links), Türwand (rechts),
   Linoleum. Abends: Licht an, draußen dunkel.
   ===================================================================== */
{
  const H3 = 3.0;
  let k = `<rect x="0" y="0" width="320" height="200" fill="${S.lg("decke", [[0, "#e3e0d8"], [1, "#efede6"]])}"/>`;
  /* Boden */
  k += poly([P(-RW, 0, 0), P(RW, 0, 0), P(RW, 0, ZW), [320, 200], [0, 200], P(-RW, 0, ZW)], S.lg("boden", [[0, "#a9b4b6"], [1, "#93a0a3"]]));
  k += `<rect x="0" y="${P(0, 0, ZW)[1]}" width="320" height="${r(200 - P(0, 0, ZW)[1])}" fill="${S.lg("boden2", [[0, "#9aa6a9"], [1, "#8b989b"]])}"/>`;
  for (let i = -12; i <= 12; i++) k += linie(P(i * 0.5, 0, 0), P(i * 0.5, 0, 3.4), "#7f8b8e", ".3", ' opacity=".5"');
  for (const z of [0.5, 1, 1.5, 2, 2.5, 3]) k += linie(P(-6, 0, z), P(6, 0, z), "#7f8b8e", ".3", ' opacity=".45"');
  k += `<rect x="0" y="${P(0, 0, 0)[1]}" width="320" height="${r(200 - P(0, 0, 0)[1])}" fill="${S.lg("bodenlicht", [[0, "#000", 0.1], [0.4, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  /* Seitenwände */
  k += poly([P(-RW, 0, 0), P(-RW, H3, 0), P(-RW, H3, ZW), P(-RW, 0, ZW)], S.lg("lwand", [[0, "#ddd6c6"], [1, "#e9e3d6"]], 0, 0, 1, 0));
  k += poly([P(RW, 0, 0), P(RW, H3, 0), P(RW, H3, ZW), P(RW, 0, ZW)], S.lg("rwand", [[0, "#e9e3d6"], [1, "#ddd6c6"]], 0, 0, 1, 0));
  k += poly([P(-RW, 0, 0), P(-RW, 0.08, 0), P(-RW, 0.08, ZW), P(-RW, 0, ZW)], "#8b8f92") + poly([P(RW, 0, 0), P(RW, 0.08, 0), P(RW, 0.08, ZW), P(RW, 0, ZW)], "#8b8f92");
  /* Tafelwand */
  const [x0, y0] = P(-RW, H3, 0), [x1, y1] = P(RW, 0, 0);
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("wand", [[0, "#f3efe4"], [1, "#e8e1d1"]])}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.rg("wandlicht", [[0, "#fff8e8", 0.55], [1, "#fff8e8", 0]], 0.5, 0.2, 0.7)}"/>`;
  k += rz(-RW, RW, 0, 0.08, 0, "#8b8f92");
  /* Heizkörper unter den Fenstern (links) */
  k += poly([P(-RW + 0.02, 0.15, 0.2), P(-RW + 0.02, 0.75, 0.2), P(-RW + 0.02, 0.75, 1.25), P(-RW + 0.02, 0.15, 1.25)], "#e4e6e4");
  for (let z = 0.24; z < 1.24; z += 0.05) k += linie(P(-RW + 0.03, 0.18, z), P(-RW + 0.03, 0.72, z), "#b9bdbd", ".35");
  S.hinten(k);
}

/* =====================================================================
   1 — DIE LAMPEN (LED-Deckenleuchten, eingeschaltet)
   ===================================================================== */
{
  let k = "";
  for (const [Xa, Xb] of [[-1.7, -1.0], [1.0, 1.7]]) for (const [za, zb] of [[0.25, 0.95], [1.3, 1.62]]) {
    k += poly([P(Xa, 3, za), P(Xb, 3, za), P(Xb, 3, zb), P(Xa, 3, zb)], "#fffef4", 'stroke="#cfcbc0" stroke-width=".5"');
  }
  k += poly([P(-1.7, 3, 0.25), P(-1.0, 3, 0.25), P(-1.0, 3, 0.95), P(-1.7, 3, 0.95)], S.rg("lglow", [[0, "#ffffff"], [1, "#fff6d8"]]));
  const [ax, ay] = P(-1.35, 3, 0.95);
  S.teil({ id: "ea_lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: ax, y: ay, kunst: um(ax, ay, k) });
}

/* =====================================================================
   2 — DIE UHR (über der Tafel) — Viertel vor acht
   ===================================================================== */
{
  let k = `<circle r="5.6" fill="#2f3337"/><circle r="4.9" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#ece8de"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += linie([r(Math.sin(a) * 4.3), r(-Math.cos(a) * 4.3)], [r(Math.sin(a) * (i % 3 ? 3.8 : 3.4)), r(-Math.cos(a) * (i % 3 ? 3.8 : 3.4))], "#222", i % 3 ? ".3" : ".6"); }
  k += linie([0, 0], [r(Math.sin(7.75 * Math.PI / 6) * 2.4), r(-Math.cos(7.75 * Math.PI / 6) * 2.4)], "#111", ".8", ' stroke-linecap="round"');
  k += linie([0, 0], [r(Math.sin(9 * Math.PI / 6) * 3.6), r(-Math.cos(9 * Math.PI / 6) * 3.6)], "#111", ".5", ' stroke-linecap="round"');
  k += linie([0, 0], [r(Math.sin(4 * Math.PI / 6) * 3.8), r(-Math.cos(4 * Math.PI / 6) * 3.8)], "#c62d22", ".25") + `<circle r=".45" fill="#c62d22"/>`;
  const [ax, ay] = P(0.4, 2.52, 0);
  S.teil({ id: "ea_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: ax, y: ay, kunst: k,
    tipp: "Es ist Viertel vor acht. Der Elternabend hat um halb acht angefangen." });
}

/* =====================================================================
   3 — DER WANDKALENDER (links der Tafel)
   ===================================================================== */
{
  const [x0, y0] = P(-2.85, 1.98, 0), [x1, y1] = P(-1.95, 1.3, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="#fff" stroke="#cfc8b8" stroke-width=".3"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h * 0.4)}" fill="${S.lg("kalbild", [[0, "#8fc1e3"], [1, "#e9c46a"]])}"/>`;
  k += `<path d="M${x0} ${r(y0 + h * 0.4)} L${r(x0 + w * 0.3)} ${r(y0 + h * 0.18)} L${r(x0 + w * 0.5)} ${r(y0 + h * 0.3)} L${r(x0 + w * 0.75)} ${r(y0 + h * 0.12)} L${x1} ${r(y0 + h * 0.4)} Z" fill="#6f9a5a"/>`;
  k += `<text x="${r(x0 + w / 2)}" y="${r(y0 + h * 0.48)}" font-size="2" text-anchor="middle" fill="#2a2a2a" font-family="Arial" font-weight="bold">SEPTEMBER 2026</text>`;
  for (let i = 0; i < 30; i++) { const c = (i + 1) % 7, row = Math.floor((i + 1) / 7), cx = x0 + 1.4 + c * (w - 2.8) / 6.4, cy = y0 + h * 0.58 + row * h * 0.085;
    k += `<text x="${r(cx)}" y="${r(cy)}" font-size="1.5" text-anchor="middle" fill="${c === 6 ? "#c62d22" : "#444"}" font-family="Arial">${i + 1}</text>`;
    if (i === 23) k += `<circle cx="${r(cx)}" cy="${r(cy - 0.5)}" r="1.4" fill="none" stroke="#c62d22" stroke-width=".35"/>`; }
  k += `<rect x="${r(x0 + w / 2 - 1)}" y="${r(y0 - 1)}" width="2" height="1.4" rx=".3" fill="#888"/>`;
  const [ax, ay] = P(-2.4, 1.3, 0);
  S.teil({ id: "ea_wandkalender", de: "der Wandkalender", syl: "WAND-ka-len-der", it: "il calendario da parete", itSyl: "ca-len-DA-rio da pa-RE-te", en: "wall calendar", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Am 24. September ist Elternabend – der Tag ist im Kalender rot eingekreist." });
}

/* =====================================================================
   4 — DIE TAFEL (Klapptafel, grün) mit 5 — TAGESORDNUNG, 6 — KREIDE,
   7 — SCHWAMM
   ===================================================================== */
const TA = { Xm0: -0.85, Xm1: 1.65, wing: 0.75, H0: 0.9, H1: 2.12 };
{
  const { Xm0, Xm1, wing, H0, H1 } = TA;
  const gruen = S.lg("tafelgruen", [[0, "#3f5d4c"], [1, "#2f4a3b"]]);
  let k = "";
  /* Aufhängung (Schienen) */
  k += rz(Xm0 - wing - 0.05, Xm1 + wing + 0.05, H1 + 0.05, H1 + 0.09, 0, "#9aa1a6");
  for (const [a, b] of [[Xm0 - wing, Xm0], [Xm0, Xm1], [Xm1, Xm1 + wing]]) {
    const zz = a === Xm0 ? 0.04 : 0.06;
    k += rz(a, b, H0, H1, zz, "#c9cfd3") + rz(a + 0.03, b - 0.03, H0 + 0.03, H1 - 0.03, zz, gruen);
    k += rz(a + 0.03, b - 0.03, H0 + 0.03, H1 - 0.03, zz, S.lg("wisch", [[0, "#fff", 0.06], [0.5, "#fff", 0.02], [1, "#fff", 0.07]], 0, 0, 1, 0));
  }
  /* Lineatur auf dem linken Flügel */
  for (let H = H0 + 0.12; H < H1 - 0.05; H += 0.1) k += linie(P(Xm0 - wing + 0.05, H, 0.06), P(Xm0 - 0.05, H, 0.06), "#6f8b78", ".25");
  /* rechter Flügel: „Herzlich willkommen!“ mit Blume */
  const [wx, wy] = P(Xm1 + wing / 2, 1.85, 0.06);
  k += `<text x="${wx}" y="${wy}" font-size="3.4" text-anchor="middle" fill="#f4f1e8" font-family="${KREIDE}">Herzlich</text><text x="${wx}" y="${r(wy + 4.4)}" font-size="3.4" text-anchor="middle" fill="#f4f1e8" font-family="${KREIDE}">willkommen!</text>`;
  for (let a = 0; a < 6; a++) k += `<ellipse cx="${r(wx + Math.cos(a * 1.05) * 2)}" cy="${r(wy + 13 + Math.sin(a * 1.05) * 2)}" rx="1.2" ry=".7" fill="none" stroke="#f6c9d6" stroke-width=".35" transform="rotate(${a * 60} ${r(wx + Math.cos(a * 1.05) * 2)} ${r(wy + 13 + Math.sin(a * 1.05) * 2)})"/>`;
  k += `<circle cx="${wx}" cy="${r(wy + 13)}" r=".9" fill="none" stroke="#f6e08a" stroke-width=".4"/><path d="M${wx} ${r(wy + 14)} q.6 4 -.4 7" stroke="#a9d39a" stroke-width=".4" fill="none"/>`;
  /* Ablage für Kreide */
  k += kiste(Xm0 - wing, Xm1 + wing, H0 - 0.04, H0, 0, 0.1, { vorn: "#aab1b6", deckel: "#c9cfd3" });
  const [ax, ay] = P((Xm0 + Xm1) / 2, H0 - 0.04, 0.1);
  S.teil({ id: "ea_tafel", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "blackboard", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Die Klapptafel hat zwei Flügel, die man zuklappen kann." });
}
{
  const { Xm0, Xm1, H1 } = TA;
  const [x0, y0] = P(Xm0 + 0.1, H1 - 0.12, 0.04), [x1] = P(Xm1 - 0.1, 0, 0.04);
  const t = (y, s, txt, extra = "") => `<text x="${r(x0 + 1)}" y="${r(y)}" font-size="${s}" fill="#f4f1e8" font-family="${KREIDE}"${extra}>${txt}</text>`;
  let k = `<text x="${r((x0 + x1) / 2)}" y="${r(y0 + 2)}" font-size="4.2" text-anchor="middle" fill="#fbf3c2" font-family="${KREIDE}">Elternabend Klasse 3b</text>`;
  k += `<path d="M${r(x0 + 12)} ${r(y0 + 3.4)} q${r((x1 - x0) / 2 - 12)} -1 ${r(x1 - x0 - 24)} 0" stroke="#fbf3c2" stroke-width=".35" fill="none"/>`;
  k += `<text x="${r(x0 + 1)}" y="${r(y0 + 8.6)}" font-size="3" fill="#cfe6f5" font-family="${KREIDE}">Tagesordnung:</text>`;
  const pkt = ["1. Begrüßung", "2. Neues aus der Klasse", "3. Klassenfahrt im Mai", "4. Wahl der Elternvertreter", "5. Verschiedenes"];
  pkt.forEach((p, i) => { k += t(y0 + 13.4 + i * 4.6, 3.1, p); });
  /* Haken hinter den erledigten Punkten, Pfeil bei Punkt 4 */
  for (let i = 0; i < 3; i++) k += `<path d="M${r(x1 - 6)} ${r(y0 + 12.4 + i * 4.6)} l1 1 l2 -2.4" stroke="#a9e09a" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${r(x1 - 2)} ${r(y0 + 26.2)} h-4 m1.6 -1.4 l-1.6 1.4 l1.6 1.4" stroke="#f6c9d6" stroke-width=".45" fill="none"/>`;
  k += flaeche(x0, y0 - 3, x1 - x0, 34);
  const [ax, ay] = P((Xm0 + Xm1) / 2, 0.95, 0.04);
  S.teil({ oben: true, id: "ea_tagesordnung", de: "die Tagesordnung", syl: "TA-ges-ord-nung", it: "l'ordine del giorno", itSyl: "OR-di-ne del GIOR-no", en: "agenda", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Die Tagesordnung zeigt, worüber man heute spricht. Jetzt kommt Punkt 4: die Wahl." });
}
{
  const [cx, cy] = P(0.15, TA.H0, 0.06);
  let k = `<rect x="-3" y="-1.1" width="6" height="1.1" rx=".5" fill="#fbfbf6"/><rect x="-3" y="-1.1" width="1.2" height="1.1" rx=".4" fill="#ece9de"/><rect x="2.4" y="-1.1" width="4" height="1.1" rx=".5" fill="#f4c542"/><rect x="-6.4" y="-1" width="2.6" height="1" rx=".4" fill="#9ccbe8"/>`;
  S.teil({ oben: true, id: "ea_kreide", de: "die Kreide", syl: "KREI-de", it: "il gesso", itSyl: "GES-so", en: "chalk", x: cx, y: cy, kunst: k + flaeche(-7, -3.2, 14, 3.6) });
  const [sx, sy] = P(1.3, TA.H0, 0.06);
  let s = `<rect x="-3.6" y="-2.4" width="7.2" height="2.4" rx=".8" fill="#e8c34a"/><rect x="-3.6" y="-1" width="7.2" height="1" rx=".4" fill="#3f6a4c"/>`;
  for (let i = 0; i < 9; i++) s += `<circle cx="${r(-3 + rnd() * 6)}" cy="${r(-2 + rnd() * 1)}" r=".25" fill="#c49a2a"/>`;
  S.teil({ oben: true, id: "ea_schwamm", de: "der Schwamm", syl: "SCHWAMM", it: "la spugna", itSyl: "SPU-gna", en: "sponge", x: sx, y: sy, kunst: s + flaeche(-4, -3.4, 8, 3.8),
    tipp: "Mit dem nassen Schwamm wischt man die Tafel sauber." });
}

/* =====================================================================
   8 — DER STUNDENPLAN (rechts der Tafel)
   ===================================================================== */
{
  const [x0, y0] = P(2.55, 2.08, 0), [x1, y1] = P(3.3, 1.45, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" rx=".6" fill="#fffdf6" stroke="#c9c2b0" stroke-width=".3"/>`;
  k += `<text x="${r(x0 + w / 2)}" y="${r(y0 + 2.6)}" font-size="2" text-anchor="middle" fill="#2a2a2a" font-family="Arial" font-weight="bold">Stundenplan 3b</text>`;
  const tage = ["Mo", "Di", "Mi", "Do", "Fr"], fach = ["#f29a8e", "#9cc8ef", "#b8e0a2", "#f6d77a", "#d2b4e6", "#f7c08a"];
  const cw = (w - 4) / 5, ch = (h - 6) / 6;
  tage.forEach((t, i) => { k += `<text x="${r(x0 + 3 + i * cw + cw / 2)}" y="${r(y0 + 4.8)}" font-size="1.4" text-anchor="middle" fill="#444" font-family="Arial">${t}</text>`; });
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) k += `<rect x="${r(x0 + 3 + i * cw + 0.2)}" y="${r(y0 + 5.6 + j * ch + 0.2)}" width="${r(cw - 0.4)}" height="${r(ch - 0.4)}" fill="${fach[(i * 2 + j * 3) % 6]}"/>`;
  for (let j = 0; j < 5; j++) k += `<text x="${r(x0 + 1.6)}" y="${r(y0 + 5.6 + j * ch + ch * 0.7)}" font-size="1.3" text-anchor="middle" fill="#666" font-family="Arial">${j + 1}</text>`;
  const [ax, ay] = P(2.92, 1.45, 0);
  S.teil({ id: "ea_stundenplan_ea", de: "der Stundenplan", syl: "STUN-den-plan", it: "l'orario scolastico", itSyl: "o-RA-rio sco-LA-sti-co", en: "school timetable", x: ax, y: ay, kunst: um(ax, ay, k) });
}

/* =====================================================================
   9 — DAS FENSTER (linke Wand, draußen ist es dunkel)
   ===================================================================== */
{
  const X = -RW + 0.01, H0 = 0.95, H1 = 2.55;
  let k = "";
  const fenster = (za, zb) => {
    let g = poly([P(X, H0, za), P(X, H1, za), P(X, H1, zb), P(X, H0, zb)], "#e9ecec");
    const m = 0.05;
    g += poly([P(X, H0 + m, za + m), P(X, H1 - m, za + m), P(X, H1 - m, zb - m), P(X, H0 + m, zb - m)], S.lg("nacht", [[0, "#0f1d33"], [0.7, "#1d3150"], [1, "#2c3f57"]]));
    /* Straßenlaterne und Lichter gegenüber */
    const [lx, ly] = P(X, 1.6, za + (zb - za) * 0.4);
    g += `<circle cx="${lx}" cy="${ly}" r="2.4" fill="#ffd98a" opacity=".25"/><circle cx="${lx}" cy="${ly}" r=".8" fill="#ffe7b0"/>`;
    for (let i = 0; i < 4; i++) { const [wx, wy] = P(X, 1.15 + (i % 2) * 0.22, za + 0.12 + i * (zb - za - 0.24) / 4); g += `<rect x="${wx}" y="${wy}" width="1.6" height="1.6" fill="#f2c96a" opacity=".55"/>`; }
    /* Spiegelung der Deckenleuchte */
    g += poly([P(X, H1 - 0.2, za + 0.15), P(X, H1 - 0.2, za + 0.35), P(X, H0 + 0.25, za + 0.3), P(X, H0 + 0.25, za + 0.1)], "#fff", 'opacity=".09"');
    g += linie(P(X, (H0 + H1) / 2, za), P(X, (H0 + H1) / 2, zb), "#e9ecec", "1.2");
    return g;
  };
  k += fenster(0.12, 0.66) + fenster(0.74, 1.28);
  /* Fensterbank */
  k += poly([P(-RW, H0, 0.08), P(-RW + 0.22, H0, 0.08), P(-RW + 0.22, H0, 1.32), P(-RW, H0, 1.32)], "#f6f5f0");
  k += poly([P(-RW + 0.22, H0, 0.08), P(-RW + 0.22, H0 - 0.03, 0.08), P(-RW + 0.22, H0 - 0.03, 1.32), P(-RW + 0.22, H0, 1.32)], "#d9d9d2");
  const [ax, ay] = P(X, H0, 1.32);
  S.teil({ id: "ea_fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Draußen ist es schon dunkel: Elternabend ist am Abend." });
}

/* =====================================================================
   10 — DIE TÜR (rechte Wand) mit Klassenschild
   ===================================================================== */
{
  const X = RW - 0.01, za = 0.22, zb = 1.18, Ht = 2.05;
  let k = poly([P(X, 0, za - 0.06), P(X, Ht + 0.06, za - 0.06), P(X, Ht + 0.06, zb + 0.06), P(X, 0, zb + 0.06)], "#6c757c");
  k += poly([P(X, 0, za), P(X, Ht, za), P(X, Ht, zb), P(X, 0, zb)], S.lg("tuerholz", [[0, "#d7b98b"], [1, "#c4a171"]], 0, 0, 1, 0));
  k += poly([P(X, 1.4, za + 0.25), P(X, 1.85, za + 0.25), P(X, 1.85, zb - 0.25), P(X, 1.4, zb - 0.25)], "#d8e3e6", 'opacity=".9"');
  const [hx, hy] = P(X, 1.02, zb - 0.1);
  k += `<rect x="${r(hx - 2.6)}" y="${r(hy - 0.5)}" width="2.8" height="1" rx=".5" fill="#c9cfd4" stroke="#7d868c" stroke-width=".2"/><rect x="${r(hx - 0.3)}" y="${r(hy - 1.6)}" width=".9" height="4" rx=".3" fill="#aab1b6"/>`;
  /* Klassenschild neben der Tür */
  const sa = P(X, 2.42, za + 0.25), sb = P(X, 2.17, zb - 0.25);
  k += poly([sa, P(X, 2.42, zb - 0.25), sb, P(X, 2.17, za + 0.25)], "#fff", 'stroke="#2b5fa8" stroke-width=".4"');
  k += `<text x="${r((sa[0] + sb[0]) / 2)}" y="${r((sa[1] + sb[1]) / 2 + 1.4)}" font-size="3.6" text-anchor="middle" fill="#2b5fa8" font-family="Arial" font-weight="bold">3b</text>`;
  const [ax, ay] = P(X, 0, zb);
  S.teil({ id: "ea_tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: ax, y: ay, kunst: um(ax, ay, k) });
}

/* =====================================================================
   11 — DIE KLASSENLEHRERIN (vorn an der Tafel, zeigt auf Punkt 4)
   ===================================================================== */
{
  const z = 0.32, X = -1.12;
  const m = figur({ id: "b10b_lehr", geschlecht: "w", pose: "zeigen", blick: 52, frisur: "dutt", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f3efe6" }, jacke: { stueck: "jacke", farbe: "#2f5f73" }, unterteil: { stueck: "hose", farbe: "#3a3a42" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.68 * sk(z));
  const [fx, fy] = P(X, 0, z);
  S.teil({ id: "ea_lehrerin", de: "die Klassenlehrerin", syl: "KLAS-sen-leh-re-rin", it: "la maestra", itSyl: "ma-E-stra", en: "class teacher", x: fx, y: fy, kunst: schatten(0, 0, 9, 1.2, 0.25) + m.svg,
    tipp: "Die Klassenlehrerin sagt: „Wer möchte Elternvertreter werden?“" });
}

/* ---------- Stühle und sitzende Eltern -------------------------------- */
/* Schulstuhl: Stahlrohr, Sitz und Lehne aus Buche. seite = -1: Lehne links
   (Eltern links schauen nach rechts), +1: Lehne rechts. */
function schulstuhl(X, z, Hs, seite) {
  let k = "";
  const dx = 0.2, dz = 0.19;
  for (const [a, b] of [[-dx, -dz], [dx, -dz], [-dx, dz], [dx, dz]]) k += linie(P(X + a, 0, z + b), P(X + a, Hs - 0.02, z + b), ROHR, r(0.025 * sk(z + b)), ' stroke-linecap="round"');
  k += kiste(X - dx - 0.02, X + dx + 0.02, Hs - 0.025, Hs, z - dz - 0.02, z + dz + 0.02, { vorn: "#b98c55", deckel: BUCHE, seite: "#a97c48" });
  const Xl = X + seite * (dx + 0.01);
  for (const b of [-dz + 0.04, dz - 0.04]) k += linie(P(Xl, Hs, z + b), P(Xl, Hs + 0.42, z + b), ROHR, r(0.022 * sk(z + b)), ' stroke-linecap="round"');
  k += poly([P(Xl, Hs + 0.22, z - dz), P(Xl, Hs + 0.42, z - dz), P(Xl, Hs + 0.42, z + dz), P(Xl, Hs + 0.22, z + dz)], S.lg("lehne" + (seite > 0 ? "r" : "l"), [[0, "#e2c08c"], [1, "#c99e66"]]));
  return k;
}
function sitzend(X, z, seite, spec, groesse) {
  const m = figur(spec, groesse * sk(z));
  const Hs = -m.z.sitz.y * m.k / sk(z);
  const [fx, fy] = P(X, 0, z);
  const st = schulstuhl(X + m.z.sitz.x * m.k / sk(z) - seite * 0.04, z, Hs, seite);
  return { kunst: um(fx, fy, schatten(fx, fy, 0.3 * sk(z), 1.4, 0.25) + st) + m.svg, x: fx, y: fy };
}

/* =====================================================================
   12 — DER VATER (links, meldet sich) und 13 — DER ELTERNVERTRETER
   ===================================================================== */
{
  const p = sitzend(-2.25, 1.85, -1, { id: "b10b_vater", geschlecht: "m", pose: "b10b_melden", blick: 78, frisur: "kurz", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#9cb7d4" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.8);
  S.teil({ id: "ea_vater", de: "der Vater", syl: "VA-ter", it: "il padre", itSyl: "PA-dre", en: "father", x: p.x, y: p.y, kunst: p.kunst,
    tipp: "Der Vater meldet sich: Er will den Elternvertreter wählen." });
}
{
  const p = sitzend(-2.08, 2.55, -1, { id: "b10b_ev", geschlecht: "m", pose: "sitzen", blick: 72, frisur: "glatze", haarfarbe: "grau", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#7a2f3a" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.78);
  S.teil({ id: "ea_elternvertreter", de: "der Elternvertreter", syl: "EL-tern-ver-tre-ter", it: "il rappresentante dei genitori", itSyl: "rap-pre-sen-TAN-te dei ge-ni-TO-ri", en: "parents' representative", x: p.x, y: p.y, kunst: p.kunst,
    tipp: "Der Elternvertreter spricht für alle Eltern der Klasse mit der Schule." });
}

/* ---------- Tischreihe des Hufeisens (Schülertische) ------------------- */
function tischreihe(X0, X1, z0, z1, name) {
  const Ht = 0.72;
  let k = schatten(...P((X0 + X1) / 2, 0, (z0 + z1) / 2), (X1 - X0) * sk(z1) * 0.6, 3, 0.22);
  const teil = (za, zb) => {
    let g = "";
    for (const [X, z] of [[X0 + 0.05, za + 0.05], [X1 - 0.05, za + 0.05], [X0 + 0.05, zb - 0.05], [X1 - 0.05, zb - 0.05]]) g += linie(P(X, 0, z), P(X, Ht - 0.03, z), ROHR, r(0.03 * sk(z)), ' stroke-linecap="round"');
    /* Fach unter der Platte */
    g += kiste(X0 + 0.06, X1 - 0.06, Ht - 0.16, Ht - 0.13, za + 0.08, zb - 0.08, { deckel: "#8b9196", seite: "#6f767b", vorn: "#6f767b" });
    g += kiste(X0, X1, Ht - 0.035, Ht, za, zb, { vorn: "#7a6248", deckel: BUCHE, seite: "#8a6f50" });
    g += linie(P(X0 > 0 ? X0 : X1, Ht, za), P(X0 > 0 ? X0 : X1, Ht, zb), "#fff", ".4", ' opacity=".5"');
    return g;
  };
  const zm = (z0 + z1) / 2;
  /* hinten zuerst */
  k += teil(z0, zm) + teil(zm, z1);
  return k;
}
const LT = { X0: -1.88, X1: -1.24, z0: 1.4, z1: 3.02 };
const RT = { X0: 1.24, X1: 1.88, z0: 1.4, z1: 3.02 };
const auf = (X, z) => P(X, 0.72, z);
/* Trefferfläche genau über einem flach liegenden Blatt (Eckpunkte pts) */
const flBlatt = (pts, ax, ay) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys); return flaeche(x0 - ax - 0.6, y0 - ay - 0.6, Math.max(...xs) - x0 + 1.2, Math.max(...ys) - y0 + 1.2); };

/* =====================================================================
   14 — DER SCHULTISCH (linker Arm) — Lupe: Liste, Stift, Schild, Brief
   ===================================================================== */
{
  const { X0, X1, z0, z1 } = LT;
  let k = tischreihe(X0, X1, z0, z1);
  const unter = [];
  /* Namensschild (Aufsteller) vor dem Vater */
  {
    const [nx, ny] = auf(-1.6, 1.88), s = sk(1.88);
    k += `<path d="M${r(nx - 0.1 * s)} ${ny} L${r(nx - 0.09 * s)} ${r(ny - 0.07 * s)} L${r(nx + 0.11 * s)} ${r(ny - 0.07 * s)} L${r(nx + 0.12 * s)} ${ny} Z" fill="#fffef8" stroke="#c9c2b0" stroke-width=".2"/>`;
    k += `<text x="${r(nx + 0.01 * s)}" y="${r(ny - 0.025 * s)}" font-size="2" text-anchor="middle" fill="#1e3f7a" font-family="Arial" font-weight="bold">Hr. Becker</text>`;
    unter.push({ id: "ea_namensschild", de: "das Namensschild", syl: "NA-mens-schild", it: "il cartellino del nome", itSyl: "car-tel-LI-no del NO-me", en: "name card", x: nx, y: ny + 0.4, kunst: flaeche(-0.13 * s, -0.09 * s, 0.26 * s, 0.09 * s + 0.6),
      tipp: "Auf dem Namensschild steht, wer hier sitzt. So kennen sich alle." });
  }
  /* Elternbrief vor dem Vater */
  {
    const pts = [auf(-1.78, 1.98), auf(-1.5, 1.98), auf(-1.5, 2.36), auf(-1.78, 2.36)];
    k += poly(pts, "#fffef8", 'stroke="#d4cebd" stroke-width=".2"');
    const [bx, by] = auf(-1.64, 2.1);
    for (let i = 0; i < 6; i++) k += `<rect x="${r(bx - 4.6 + i * 0.4)}" y="${r(by + i * 1.6)}" width="${r(7 - (i % 3) * 1.4)}" height=".35" fill="#8a8a8a"/>`;
    k += `<rect x="${r(bx - 4.2)}" y="${r(by - 1.6)}" width="4" height=".6" fill="#2b5fa8"/>`;
    const [cx, cy] = auf(-1.64, 2.36);
    unter.push({ id: "ea_elternbrief", de: "der Elternbrief", syl: "EL-tern-brief", it: "la lettera ai genitori", itSyl: "LET-te-ra ai ge-ni-TO-ri", en: "letter to parents", x: cx, y: cy + 0.6, kunst: flBlatt(pts, cx, cy + 0.6),
      tipp: "Im Elternbrief stehen die Termine: Klassenfahrt, Ausflüge, Ferien." });
  }
  /* Anwesenheitsliste mit Kugelschreiber vor dem Elternvertreter */
  {
    const pts = [auf(-1.8, 2.5), auf(-1.48, 2.48), auf(-1.46, 2.92), auf(-1.8, 2.94)];
    k += poly(pts, "#fdfdf8", 'stroke="#d4cebd" stroke-width=".2"');
    const [bx, by] = auf(-1.64, 2.56);
    k += `<text x="${r(bx)}" y="${r(by + 0.8)}" font-size="1.8" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">Anwesenheit 3b</text>`;
    for (let i = 0; i < 8; i++) { const yy = by + 2.4 + i * 2.1, xx = bx - 6 - i * 0.25; k += `<rect x="${r(xx)}" y="${r(yy)}" width="${r(5 + (i % 3))}" height=".45" fill="#777"/><path d="M${r(xx + 8.5)} ${r(yy + 0.3)} q1 -1.4 2 0 q.8 -1 1.6 0" stroke="#1e3f7a" stroke-width=".35" fill="none" opacity="${i < 5 ? 1 : 0}"/>`; }
    const [cx, cy] = auf(-1.62, 2.94);
    unter.push({ id: "ea_anwesenheitsliste", de: "die Anwesenheitsliste", syl: "AN-we-sen-heits-lis-te", it: "la lista delle presenze", itSyl: "LI-sta del-le pre-SEN-ze", en: "attendance list", x: cx, y: cy + 0.4, kunst: flBlatt(pts, cx, cy + 0.4),
      tipp: "Auf der Anwesenheitsliste unterschreibt jeder, der da ist." });
    const [kx, ky] = auf(-1.42, 2.8);
    k += `<g transform="rotate(-62 ${kx} ${ky})"><rect x="${r(kx - 5)}" y="${r(ky - 0.55)}" width="10" height="1.1" rx=".5" fill="#2b5fa8"/><path d="M${r(kx + 5)} ${r(ky - 0.55)} l1.6 .55 l-1.6 .55 Z" fill="#c9cfd4"/><rect x="${r(kx - 5)}" y="${r(ky - 0.9)}" width="3" height=".35" fill="#c9cfd4"/></g>`;
    unter.push({ id: "ea_kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna a sfera", itSyl: "PEN-na a SFE-ra", en: "ballpoint pen", x: kx, y: ky + 5, kunst: flaeche(-3.4, -10, 6.8, 10.6) });
  }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "ea_schultisch", de: "der Schultisch", syl: "SCHUL-tisch", it: "il banco", itSyl: "BAN-co", en: "school desk", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 30, y: 100, w: 78, h: 52 }, unter,
    tipp: "Die Tische stehen heute als Hufeisen – so sehen sich alle Eltern." });
}

/* =====================================================================
   15 — DER STUHL (frei, rechts) und 16 — DIE MUTTER
   ===================================================================== */
{
  const X = 2.1, z = 2.45;
  let k = schatten(...P(X, 0, z), 0.28 * sk(z), 1.3, 0.25) + schulstuhl(X, z, 0.45, 1);
  const [ax, ay] = P(X, 0, z + 0.2);
  S.teil({ id: "ea_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Dieser Stuhl ist noch frei." });
}
{
  const p = sitzend(2.25, 1.85, 1, { id: "b10b_mutter", geschlecht: "w", pose: "sitzen", blick: -74, frisur: "locken", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e1a83a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.66);
  S.teil({ id: "ea_mutter", de: "die Mutter", syl: "MUT-ter", it: "la madre", itSyl: "MA-dre", en: "mother", x: p.x, y: p.y, kunst: p.kunst,
    tipp: "Die Mutter fragt: „Wann ist die Klassenfahrt genau?“" });
}

/* =====================================================================
   17 — DER TISCH (rechter Arm) — Lupe: Kaffee und Kekse
   ===================================================================== */
{
  const { X0, X1, z0, z1 } = RT;
  let k = tischreihe(X0, X1, z0, z1);
  const unter = [];
  /* Thermoskanne */
  {
    const [cx, cy] = auf(1.62, 1.55), s = sk(1.55);
    const w = 0.12 * s, h = 0.3 * s;
    k += `<ellipse cx="${cx}" cy="${cy}" rx="${r(w / 2 + 0.6)}" ry=".9" fill="#000" opacity=".2"/>`;
    k += `<rect x="${r(cx - w / 2)}" y="${r(cy - h * 0.8)}" width="${r(w)}" height="${r(h * 0.8)}" rx="1" fill="${S.lg("kanne", [[0, "#3b3f45"], [0.35, "#6e757d"], [0.6, "#2c3035"], [1, "#1f2226"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(cx - w / 2)} ${r(cy - h * 0.8)} Q${cx} ${r(cy - h * 1.02)} ${r(cx + w / 2)} ${r(cy - h * 0.8)} Z" fill="#c9cfd4"/><rect x="${r(cx - 1.2)}" y="${r(cy - h * 1.02)}" width="2.4" height="1.2" rx=".5" fill="#c62d22"/>`;
    k += `<path d="M${r(cx - w / 2)} ${r(cy - h * 0.6)} q-2.6 .4 -2.4 3.6 q.2 2 2.4 2.2" stroke="#2c3035" stroke-width="1" fill="none"/>`;
    k += `<rect x="${r(cx - w / 2 + 0.6)}" y="${r(cy - h * 0.75)}" width=".7" height="${r(h * 0.65)}" fill="#fff" opacity=".35"/>`;
    unter.push({ id: "ea_thermoskanne", de: "die Thermoskanne", syl: "THER-mos-kan-ne", it: "il thermos", itSyl: "TER-mos", en: "vacuum flask", x: cx, y: cy + 0.6, kunst: flaeche(-w / 2 - 3, -h - 0.6, w + 4, h + 1.4),
      tipp: "In der Thermoskanne bleibt der Kaffee lange heiß." });
  }
  /* Kaffeetassen mit Untertasse */
  {
    const tasse = (X, z, f) => {
      const [cx, cy] = auf(X, z), s = sk(z) / 47;
      let g = `<ellipse cx="${cx}" cy="${cy}" rx="${r(3.2 * s)}" ry="${r(0.9 * s)}" fill="#f2f0ea" stroke="#cfcac0" stroke-width=".2"/>`;
      g += `<path d="M${r(cx - 2 * s)} ${r(cy - 3.4 * s)} h${r(4 * s)} l-.4 ${r(3 * s)} q${r(-1.6 * s)} .8 ${r(-3.2 * s)} 0 Z" fill="${f}"/><ellipse cx="${cx}" cy="${r(cy - 3.4 * s)}" rx="${r(2 * s)}" ry="${r(0.6 * s)}" fill="#5a3618"/>`;
      g += `<path d="M${r(cx + 1.9 * s)} ${r(cy - 2.8 * s)} q${r(1.4 * s)} .2 ${r(1 * s)} ${r(1.4 * s)} q-.3 .7 ${r(-1.2 * s)} .5" stroke="${f}" stroke-width=".6" fill="none"/>`;
      return g;
    };
    k += tasse(1.42, 1.72, "#ffffff") + tasse(1.44, 2.05, "#c84a3a");
    const [cx, cy] = auf(1.44, 2.05);
    unter.push({ id: "ea_kaffeetasse", de: "die Kaffeetasse", syl: "KAF-fee-tas-se", it: "la tazza da caffè", itSyl: "TAZ-za da caf-FÈ", en: "coffee cup", x: cx, y: cy + 1, kunst: flaeche(-4.4, -6, 9, 7) });
  }
  /* Teller mit Keksen */
  {
    const [cx, cy] = auf(1.6, 1.86), s = sk(1.86);
    k += `<ellipse cx="${cx}" cy="${cy}" rx="${r(0.13 * s)}" ry="${r(0.035 * s)}" fill="#f6f4ee" stroke="#cfcac0" stroke-width=".25"/>`;
    for (const [dx, dy, c] of [[-3, -0.6, "#d9a35a"], [0, -1, "#8a5a2c"], [3, -0.6, "#e0b46a"], [-1.6, -1.6, "#e8c27a"], [1.6, -1.8, "#d9a35a"], [0, -2.6, "#f0d08a"]]) {
      k += `<ellipse cx="${r(cx + dx)}" cy="${r(cy + dy)}" rx="2" ry=".9" fill="${c}" stroke="#a8722f" stroke-width=".2"/>`;
      if (c === "#8a5a2c") k += `<circle cx="${r(cx + dx - 0.5)}" cy="${r(cy + dy - 0.1)}" r=".3" fill="#f6ead0"/>`;
    }
    unter.push({ id: "ea_kekse", de: "die Kekse", syl: "KEK-se", it: "i biscotti", itSyl: "bi-SCOT-ti", en: "biscuits", x: cx, y: cy + 1.2, kunst: flaeche(-6.6, -4.8, 13.2, 6) });
  }
  /* Namensschild der Mutter (gehört zur Zeichnung) */
  {
    const [nx, ny] = auf(1.58, 2.3), s = sk(2.3);
    k += `<path d="M${r(nx - 0.12 * s)} ${ny} L${r(nx - 0.11 * s)} ${r(ny - 0.07 * s)} L${r(nx + 0.09 * s)} ${r(ny - 0.07 * s)} L${r(nx + 0.1 * s)} ${ny} Z" fill="#fffef8" stroke="#c9c2b0" stroke-width=".2"/>`;
    k += `<text x="${r(nx - 0.01 * s)}" y="${r(ny - 0.025 * s)}" font-size="2" text-anchor="middle" fill="#a8321f" font-family="Arial" font-weight="bold">Fr. Nowak</text>`;
  }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "ea_tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 200, y: 96, w: 72, h: 48 }, unter,
    tipp: "Auf dem Tisch stehen Kaffee und Kekse für die Eltern." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/elternabend.js"));
console.log(aus);
