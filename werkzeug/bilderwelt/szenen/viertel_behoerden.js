#!/usr/bin/env node
/* =====================================================================
   DAS BEHÖRDENVIERTEL (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort wie das echte Vorbild, jedes Ding
   einzeln antippbar, nichts blockiert.

   RECHERCHE (Rathausplätze und Verwaltungsviertel z. B. Hannover,
   Wiesbaden, Bonn; Bauformen der Gründerzeit und der Nachkriegszeit):
   - In der Mitte das RATHAUS (Neugotik/Historismus) mit hohem Mittelturm,
     Uhr, Arkaden im Erdgeschoss und Balkon mit drei Fahnen (Deutschland,
     Europa, Stadt).
   - Daneben Behörden in klar unterscheidbaren Bauten: das Amtsgericht
     als Sandsteinbau mit Säulen, Dreiecksgiebel und Freitreppe; das
     Standesamt oft in einem kleinen Barockbau mit Blumen am Portal;
     Bürgeramt und Ausländerbehörde in nüchternen Verwaltungsbauten mit
     Glas-Eingang und Schriftband; die Universität als Hauptgebäude mit
     Säulen, davor Fahrräder; die Grundschule als Backsteinbau mit Uhr.
   - Am Rand: Jobcenter (rotes Logo), Polizeiwache (blaues Schild,
     Streifenwagen), Kfz-Zulassungsstelle (mit Schilderdienst),
     Fahrschule (Fahrschulauto mit Dachschild), Stadtbibliothek und
     Bürohaus aus Glas, Sprachschule, Fitnessstudio.
   - Auf dem Platz: Bushaltestelle mit grünem H auf gelbem Grund,
     ein Wegweiser.
   Perspektive wie die Innenstadt: ein Fluchtpunkt (200|129), Augenhöhe
   6 m, Rückfront 80 m entfernt (3,5 Einheiten je Meter).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;
const r = B.r;

const S = neueSzene({ id: "viertel_behoerden", titel: "Das Behördenviertel", emoji: "🏛️", thema: "Stadt", kuerzel: "vbh", fassung: 852, breite: 400, hoehe: 260 });
const rnd = zufall(1919);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

/* ---------- Perspektive ---------------------------------------------- */
const F = 282.4, CAM = 6, HY = 129, ZB = 80, WX = 38.5;
const P = (X, V, Z) => [200 + F * X / Z, HY - F * (V - CAM) / Z];
const pt = (a) => `${r(a[0])} ${r(a[1])}`;
const quad = (a, b, c, d) => `M${pt(a)}L${pt(b)}L${pt(c)}L${pt(d)}Z`;
const hx = (c) => parseInt(c.slice(1), 16);
const dunkel = (c, f) => { const n = hx(c); const k = (v) => Math.max(0, Math.min(255, Math.round(v * f))); return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => k(v).toString(16).padStart(2, "0")).join(""); };
const GLAS = S.lg("glas", [[0, "#3c4c58"], [0.55, "#56707f"], [1, "#2c3a44"]]);
const GLASHELL = S.lg("glash", [[0, "#9fb8c4"], [1, "#5f7987"]]);
const SPIEGEL = S.lg("spiegel", [[0, "#fff", 0.38], [1, "#fff", 0]], 0, 0, 1, 1);
const PUTZLICHT = S.lg("putzl", [[0, "#fff", 0.16], [0.5, "#fff", 0], [1, "#000", 0.1]]);

function teil(t, kunst) { t.kunst = `<g transform="translate(${r(-t.x)} ${r(-t.y)})">${kunst}</g>`; S.teil(t); }
/* Lupenmarke der App sitzt bei (x+16 | y−16): Anker so, dass sie auf der Fassade sitzt */
const anker = (mx, my) => ({ x: mx - 16, y: my + 16 });

/* =====================================================================
   KULISSE: Himmel, Kirchturm hinter den Dächern, Pflaster
   ===================================================================== */
S.hinten(`<rect width="400" height="160" fill="${S.lg("himmel", [[0, "#78acd9"], [0.6, "#b9d6ec"], [1, "#e6eef2"]])}"/>`);
S.hinten(`<g fill="#fff" opacity=".8"><ellipse cx="70" cy="30" rx="26" ry="5"/><ellipse cx="88" cy="26" rx="14" ry="5"/><ellipse cx="320" cy="44" rx="30" ry="4.4"/><ellipse cx="338" cy="40" rx="13" ry="4"/></g>`);
/* Bäume des Stadtparks hinter den Dächern */
{ let k = ""; for (let i = 0; i < 18; i++) { const x = 10 + i * 22 + (i % 3) * 4, y = 112 - (i % 2) * 6; k += `<circle cx="${x}" cy="${y}" r="${12 + (i % 3) * 2}" fill="${i % 2 ? "#6f9a55" : "#5d8848"}"/>`; } S.hinten(k); }
/* Pflaster: Granit, Fugen zum Fluchtpunkt, Querfugen nach Tiefe */
{
  const gy = P(0, 0, ZB)[1];
  let p = `<rect y="${r(gy - 2)}" width="400" height="${r(262 - gy)}" fill="${S.lg("pflaster", [[0, "#b9b2a6"], [0.5, "#aaa396"], [1, "#9a9386"]])}"/>`;
  let l = "";
  for (let X = -36; X <= 36; X += 3) { const a = P(X, 0, ZB), b = P(X, 0, 10); l += `M${pt(a)}L${pt(b)}`; }
  for (let Z = ZB; Z > 10; Z -= Z * 0.075) { const a = P(-WX, 0, Z), b = P(WX, 0, Z); l += `M${r(Math.max(0, a[0]))} ${r(a[1])}H${r(Math.min(400, b[0]))}`; }
  p += `<path d="${l}" stroke="#7f786c" stroke-width=".35" opacity=".55"/>`;
  /* Rinne aus hellem Granit vor den Häusern */
  p += `<path d="M${pt(P(-WX + 1.2, 0, ZB - 1.2))}L${pt(P(WX - 1.2, 0, ZB - 1.2))}M${pt(P(-WX + 1.2, 0, ZB - 1.2))}L${pt(P(-WX + 1.2, 0, 30))}M${pt(P(WX - 1.2, 0, ZB - 1.2))}L${pt(P(WX - 1.2, 0, 30))}" stroke="#d6d0c4" stroke-width="1.2" fill="none"/>`;
  /* Schatten der linken Häuser fällt leicht nach rechts auf den Platz */
  p += `<path d="${quad(P(-WX, 0, ZB), P(-WX + 6, 0, ZB), P(-WX + 6, 0, 30), P(-WX, 0, 30))}" fill="#3a3024" opacity=".08"/>`;
  S.hinten(p);
}

/* obere Fenster einer Fassade (Sprossen, Sims, Licht) */
function fenster(X0, X1, V0, V1, n, o = {}) {
  let g = "";
  const w = (X1 - X0), fw = o.fw || Math.min(1.2, w / n * 0.45), fh = o.fh || 1.7;
  for (let V = V0; V + fh < V1; V += o.st || 3.2) {
    for (let i = 0; i < n; i++) {
      const cx = X0 + w * (i + 0.5) / n;
      g += R(cx - fw / 2 - 0.12, V - 0.12, cx + fw / 2 + 0.12, V + fh + 0.12, o.rahmen || "#f4f1ea");
      g += R(cx - fw / 2, V, cx + fw / 2, V + fh, GLAS);
      g += `<path d="M${r(bx(cx))} ${r(by(V))}V${r(by(V + fh))}M${r(bx(cx - fw / 2))} ${r(by(V + fh * 0.62))}H${r(bx(cx + fw / 2))}" stroke="${o.rahmen || "#f4f1ea"}" stroke-width=".35"/>`;
      g += R(cx - fw / 2 - 0.25, V - 0.3, cx + fw / 2 + 0.25, V - 0.1, o.sims || "#d9d2c4");
      if (o.laden) g += R(cx - fw / 2 - 0.4, V, cx - fw / 2 - 0.1, V + fh, o.laden) + R(cx + fw / 2 + 0.1, V, cx + fw / 2 + 0.4, V + fh, o.laden);
      if (o.blume && (i + Math.round(V)) % 2 === 0) g += `<rect x="${r(bx(cx - fw / 2))}" y="${r(by(V) - 1.2)}" width="${r(K * fw)}" height="1.2" rx=".5" fill="#c0392b"/><circle cx="${r(bx(cx - fw / 4))}" cy="${r(by(V) - 1.4)}" r=".7" fill="#e74c3c"/><circle cx="${r(bx(cx + fw / 4))}" cy="${r(by(V) - 1.5)}" r=".7" fill="#5a9b3c"/>`;
    }
  }
  return g;
}
/* Fachwerk: Ständer, Riegel, Streben */
function fachwerk(X0, X1, V0, V1, st) {
  let d = "";
  for (let V = V0; V <= V1 + 0.01; V += st) d += `M${r(bx(X0))} ${r(by(V))}H${r(bx(X1))}`;
  const n = Math.max(2, Math.round((X1 - X0) / 1.6));
  for (let i = 0; i <= n; i++) { const X = X0 + (X1 - X0) * i / n; d += `M${r(bx(X))} ${r(by(V0))}V${r(by(V1))}`; }
  for (let V = V0; V + st <= V1 + 0.01; V += st) { d += `M${r(bx(X0))} ${r(by(V))}L${r(bx(X0 + 1.2))} ${r(by(V + st))}M${r(bx(X1))} ${r(by(V))}L${r(bx(X1 - 1.2))} ${r(by(V + st))}`; }
  return `<path d="${d}" stroke="#4a2f1d" stroke-width=".9" fill="none"/>`;
}
/* Dach: giebel (Giebel zum Platz), traufe (Satteldach längs), flach (Gesims), mansard */
function dach(X0, X1, V, art, farbe, wand) {
  const m = (X0 + X1) / 2, w = X1 - X0;
  if (art === "giebel") {
    const h = w * 0.85;
    let g = `<path d="M${r(bx(X0 - 0.2))} ${r(by(V))}L${r(bx(m))} ${r(by(V + h))}L${r(bx(X1 + 0.2))} ${r(by(V))}Z" fill="${wand}"/>`;
    g += `<path d="M${r(bx(X0 - 0.4))} ${r(by(V - 0.1))}L${r(bx(m))} ${r(by(V + h + 0.3))}L${r(bx(X1 + 0.4))} ${r(by(V - 0.1))}" stroke="${farbe}" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`;
    return { g, top: V + h };
  }
  if (art === "traufe") {
    const h = 4.2;
    return { g: `<path d="M${r(bx(X0 - 0.3))} ${r(by(V))}L${r(bx(X0 + 0.6))} ${r(by(V + h))}H${r(bx(X1 - 0.6))}L${r(bx(X1 + 0.3))} ${r(by(V))}Z" fill="${farbe}"/>` +
      `<path d="M${r(bx(X0))} ${r(by(V + h * 0.4))}H${r(bx(X1))}" stroke="#000" stroke-width=".4" opacity=".2"/>` +
      R(m - 0.6, V + h * 0.25, m + 0.6, V + h * 0.25 + 1.2, wand) + R(m - 0.45, V + h * 0.25, m + 0.45, V + h * 0.25 + 0.9, GLAS), top: V + h };
  }
  if (art === "mansard") {
    const h = 4.5;
    let g = `<path d="M${r(bx(X0 - 0.3))} ${r(by(V))}L${r(bx(X0 + 0.5))} ${r(by(V + h * 0.75))}L${r(bx(X0 + 1.6))} ${r(by(V + h))}H${r(bx(X1 - 1.6))}L${r(bx(X1 - 0.5))} ${r(by(V + h * 0.75))}L${r(bx(X1 + 0.3))} ${r(by(V))}Z" fill="${farbe}"/>`;
    for (const X of [X0 + w * 0.3, X1 - w * 0.3]) g += R(X - 0.55, V + 0.6, X + 0.55, V + 2.4, wand) + R(X - 0.4, V + 0.7, X + 0.4, V + 2.2, GLAS);
    return { g, top: V + h };
  }
  /* flach: kräftiges Gesims, Attika */
  return { g: R(X0 - 0.3, V, X1 + 0.3, V + 0.6, dunkel(wand, 0.82)) + R(X0, V + 0.6, X1, V + 1.4, wand), top: V + 1.4 };
}

/* =====================================================================
   RÜCKFRONT: sieben öffentliche Gebäude (frontal), Rathaus in der Mitte
   ===================================================================== */
const K = F / ZB, GY = P(0, 0, ZB)[1];
const bx = (X) => 200 + K * X, by = (V) => GY - K * V;
const R = (X0, V0, X1, V1, f, extra = "") => `<rect x="${r(bx(X0))}" y="${r(by(V1))}" width="${r(K * (X1 - X0))}" height="${r(K * (V1 - V0))}" fill="${f}"${extra}/>`;
const T = (X, V, txt, fs, f, extra = "") => `<text x="${r(bx(X))}" y="${r(by(V))}" font-size="${fs}" text-anchor="middle" fill="${f}" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".3"${extra}>${txt}</text>`;

/* Portal: Sockelgeschoss, Freitreppe, Tür mit Rundbogen, Inschrift */
function portal(X0, X1, o) {
  const m = o.mitte != null ? o.mitte : (X0 + X1) / 2, tb = o.tb || 1.8;
  let g = R(X0, 0, X1, 4.4, o.sockel);
  for (let V = 0.9; V < 4.3; V += 0.9) g += `<path d="M${r(bx(X0))} ${r(by(V))}H${r(bx(X1))}" stroke="#000" stroke-width=".25" opacity=".18"/>`;
  /* Erdgeschossfenster links und rechts der Tür */
  for (let X = X0 + 1.2; X < X1 - 0.8; X += 2) if (Math.abs(X - m) > tb / 2 + 0.9) g += R(X - 0.45, 1.3, X + 0.45, 3.3, "#f4f1ea") + R(X - 0.35, 1.4, X + 0.35, 3.2, GLAS);
  /* Tür mit Rundbogen */
  g += `<path d="M${r(bx(m - tb / 2 - 0.25))} ${r(by(0.6))}V${r(by(2.9))}a${r(K * (tb / 2 + 0.25))} ${r(K * (tb / 2 + 0.25))} 0 0 1 ${r(K * (tb + 0.5))} 0V${r(by(0.6))}Z" fill="${dunkel(o.sockel, 0.8)}"/>`;
  g += `<path d="M${r(bx(m - tb / 2))} ${r(by(0.6))}V${r(by(2.9))}a${r(K * tb / 2)} ${r(K * tb / 2)} 0 0 1 ${r(K * tb)} 0V${r(by(0.6))}Z" fill="${o.tuer || "#5a3a22"}"/>`;
  g += `<path d="M${r(bx(m))} ${r(by(0.6))}V${r(by(2.9))}" stroke="#2b1a0e" stroke-width=".4"/>`;
  /* Freitreppe */
  for (let i = 0; i < 3; i++) g += R(m - tb / 2 - 0.9 + i * 0.25, i * 0.2, m + tb / 2 + 0.9 - i * 0.25, i * 0.2 + 0.2, i % 2 ? "#cfc7b6" : "#bdb4a2");
  /* Inschrift */
  if (o.name) g += T(m, 3.9, o.name, o.fs || 2.4, o.schrift || "#3a3226");
  return g;
}
/* Moderne Glasfront im Erdgeschoss mit Schriftband */
function glasfront(X0, X1, o) {
  let g = R(X0, 0, X1, 4.4, "#5e6b74") + R(X0 + 0.3, 0.1, X1 - 0.3, 3.1, GLASHELL);
  for (let X = X0 + 0.3; X < X1 - 0.3; X += 1.4) g += `<path d="M${r(bx(X))} ${r(by(0.1))}V${r(by(3.1))}" stroke="#3d464d" stroke-width=".5"/>`;
  g += R(X0 + 0.3, 0.1, X1 - 0.3, 3.1, SPIEGEL);
  const m = (X0 + X1) / 2;
  g += R(m - 1, 0, m + 1, 2.6, GLAS) + `<path d="M${r(bx(m))} ${r(by(0))}V${r(by(2.6))}" stroke="#aab" stroke-width=".4"/>`;
  g += R(X0 + 0.4, 3.25, X1 - 0.4, 4.2, o.band);
  g += `<text x="${r(bx(m))}" y="${r(by(3.45))}" font-size="${o.fs || 2.5}" text-anchor="middle" fill="${o.schrift || "#fff"}" font-family="Arial,sans-serif" font-weight="bold">${o.name}</text>`;
  return g;
}
const TIPP = "Antippen führt in diese Szene hinein.";
const extraTeile = [];   /* Fenster-Teile (Elternabend …) kommen nach ihrem Haus */
const RUECK = [
  { b: 10, H: 14, dach: "traufe", wand: "#b5654a", d: "#5f6468", fen: 4, art: "portal", sockel: "#9a8f80", name: "SCHULE", schrift: "#f4ead2",
    w: { id: "vb_schule", de: "die Schule", syl: "SCHU-le", it: "la scuola", itSyl: "SCUO-la", en: "school", lupe: "klassenzimmer" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; let g = `<circle cx="${r(bx(m))}" cy="${r(by(16.6))}" r="2.6" fill="#f4efe1" stroke="#3a3a3a" stroke-width=".5"/><path d="M${r(bx(m))} ${r(by(16.6))}v-1.8M${r(bx(m))} ${r(by(16.6))}h1.4" stroke="#222" stroke-width=".5"/>`;
      for (let V = 5; V < 14; V += 3.2) g += `<path d="M${r(bx(X0))} ${r(by(V - 0.3))}H${r(bx(X1))}" stroke="#e8d9c0" stroke-width=".6"/>`; return g; },
    fensterTeil: (X0, X1) => {
      /* DER ELTERNABEND — der beleuchtete Klassenraum im 1. Stock (Fenster links) */
      const a = X0 + 0.5, b = X0 + 4.8, V0 = 5.0, V1 = 7.3;
      let g = R(a - 0.2, V0 - 0.2, b + 0.2, V1 + 0.2, "#f4ead2") + R(a, V0, b, V1, S.lg("licht", [[0, "#fff1b8"], [1, "#f2c66b"]]));
      for (let i = 0; i < 5; i++) { const x = a + 0.5 + i * 0.85; g += `<circle cx="${r(bx(x))}" cy="${r(by(V0 + 0.95))}" r="1" fill="#5a4636"/><path d="M${r(bx(x) - 1.4)} ${r(by(V0))}q1.4 -3 2.8 0z" fill="${["#3d5a80", "#9c4a36", "#2e7d32", "#6c5ce7", "#555"][i]}"/>`; }
      g += R(b - 1.4, V0 + 1.2, b - 0.2, V1 - 0.2, "#2e4a3a");
      g += `<path d="M${r(bx((a + b) / 2))} ${r(by(V0))}V${r(by(V1))}M${r(bx(a))} ${r(by(V0 + 1.6))}H${r(bx(b))}" stroke="#f4ead2" stroke-width=".5"/>`;
      return { t: { id: "vb_elternabend", de: "der Elternabend", syl: "EL-tern-a-bend", it: "la riunione dei genitori", itSyl: "riu-NIO-ne dei ge-ni-TO-ri", en: "parents' evening", lupe: "elternabend", oben: true, tipp: "Im Klassenraum brennt Licht: Die Eltern sitzen beim Elternabend." }, g, mx: bx((a + b) / 2), my: by(V1) - 6 };
    } },
  { b: 11, H: 16, dach: "flach", wand: "#e3d3ad", d: "#a08a64", fen: 4, art: "portal", sockel: "#cdbb93", name: "AMTSGERICHT", fs: 2.3,
    w: { id: "vb_gericht", de: "das Gericht", syl: "Ge-RICHT", it: "il tribunale", itSyl: "tri-bu-NA-le", en: "court", lupe: "gericht" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; let g = ""; for (let i = 0; i < 4; i++) { const X = m - 3 + i * 2; g += R(X - 0.3, 4.4, X + 0.3, 12.6, "#f2e8d0") + R(X - 0.45, 12.4, X + 0.45, 12.9, "#d7c59c"); }
      g += `<path d="M${r(bx(m - 3.9))} ${r(by(12.9))}L${r(bx(m))} ${r(by(15.4))}L${r(bx(m + 3.9))} ${r(by(12.9))}Z" fill="#efe3c6" stroke="#bda97c" stroke-width=".5"/>`;
      g += `<path d="M${r(bx(m - 0.6))} ${r(by(13.4))}h${r(K * 1.2)}M${r(bx(m))} ${r(by(13.4))}v-4.6" stroke="#8a6d2f" stroke-width=".5"/><path d="M${r(bx(m - 0.6))} ${r(by(13.4))}l-.8 1.6h1.6zM${r(bx(m + 0.6))} ${r(by(13.4))}l-.8 1.6h1.6z" fill="#8a6d2f"/>`;
      return g; } },
  { b: 8, H: 13, dach: "mansard", wand: "#f1e0a8", d: "#5f6b72", fen: 3, art: "portal", sockel: "#e3cf96", name: "STANDESAMT", fs: 2, sims: "#fff",
    w: { id: "vb_standesamt", de: "das Standesamt", syl: "STAN-des-amt", it: "l'ufficio di stato civile", itSyl: "uf-FI-cio di STA-to ci-VI-le", en: "registry office", lupe: "standesamt" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; let g = ""; for (const X of [m - 1.9, m + 1.9]) g += `<path d="M${r(bx(X) - 1.6)} ${r(by(0))}l.4 -3h2.4l.4 3z" fill="#8a6a45"/><circle cx="${r(bx(X))}" cy="${r(by(0) - 4.4)}" r="2.2" fill="#3f7d3a"/><circle cx="${r(bx(X) - 0.8)}" cy="${r(by(0) - 5)}" r=".6" fill="#fff"/><circle cx="${r(bx(X) + 0.9)}" cy="${r(by(0) - 4)}" r=".6" fill="#f8c8d8"/>`;
      g += `<path d="M${r(bx(m - 1.4))} ${r(by(4.5))}q${r(K * 1.4)} 2 ${r(K * 2.8)} 0" stroke="#7fb069" stroke-width=".9" fill="none"/>`; return g; } },
  { b: 16, H: 16, dach: "traufe", wand: "#d8b48a", d: "#4f5b61", fen: 6, art: "rathaus", sockel: "#c39a6c", name: "RATHAUS",
    w: { id: "vb_rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall", lupe: "typisch_deutsch" },
    extra: (X0, X1) => {
      const m = (X0 + X1) / 2;
      /* Arkaden im Erdgeschoss */
      let g = R(X0, 0, X1, 4.4, "#c39a6c");
      for (let i = 0; i < 5; i++) { const X = X0 + 1.6 + i * 3.2; g += `<path d="M${r(bx(X - 1.1))} ${r(by(0))}V${r(by(2.6))}a${r(K * 1.1)} ${r(K * 1.1)} 0 0 1 ${r(K * 2.2)} 0V${r(by(0))}Z" fill="#4a3a2c"/>`; }
      g += T(m, 4.0, "RATHAUS", 2.6, "#3a2a1a");
      /* Mittelturm mit Uhr, Galerie und spitzem Helm */
      const t0 = m - 2.1, t1 = m + 2.1;
      g += R(t0, 4.4, t1, 27, S.lg("rturm", [[0, "#e2c39a"], [0.5, "#d8b48a"], [1, "#b8946a"]], 0, 0, 1, 0));
      for (let V = 6; V < 22; V += 3.2) g += R(m - 0.5, V, m + 0.5, V + 1.9, GLAS);
      g += `<circle cx="${r(bx(m))}" cy="${r(by(24))}" r="${r(K * 1.4)}" fill="#f6f1e2" stroke="#3a3a3a" stroke-width=".6"/>`;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<path d="M${r(bx(m) + Math.sin(a) * K * 1.15)} ${r(by(24) - Math.cos(a) * K * 1.15)}l${r(Math.sin(a) * 0.8)} ${r(-Math.cos(a) * 0.8)}" stroke="#333" stroke-width=".4"/>`; }
      g += `<path d="M${r(bx(m))} ${r(by(24))}l1.6 -2.4M${r(bx(m))} ${r(by(24))}l-2.6 -1.4" stroke="#111" stroke-width=".6"/>`;
      g += R(t0 - 0.4, 27, t1 + 0.4, 27.6, "#a88a62");
      g += `<path d="M${r(bx(t0 - 0.2))} ${r(by(27.6))}L${r(bx(m))} ${r(by(37))}L${r(bx(t1 + 0.2))} ${r(by(27.6))}Z" fill="${S.lg("rhelm", [[0, "#4f5b61"], [0.5, "#3c464b"], [1, "#2c3438"]], 0, 0, 1, 0)}"/>`;
      g += `<path d="M${r(bx(m))} ${r(by(37))}v-5" stroke="#c9a227" stroke-width=".6"/><circle cx="${r(bx(m))}" cy="${r(by(37) - 5)}" r=".8" fill="#c9a227"/>`;
      /* Balkon mit drei Fahnen (Deutschland, Europa, Stadt) */
      g += R(m - 3.4, 7.2, m + 3.4, 7.6, "#a88a62");
      [["#000", "#dd0000", "#ffce00"], ["#003399"], ["#c0392b", "#f4f1ea"]].forEach((fl, i) => {
        const X = m - 3 + i * 3, x = bx(X), y = by(7.6);
        g += `<path d="M${r(x)} ${r(y)}l3 -7" stroke="#555" stroke-width=".4"/>`;
        fl.forEach((c, j) => { g += `<path d="M${r(x + 3 - j * 0.0)} ${r(y - 7 + j * 1.3)}l4 1v${r(fl.length === 1 ? 3.9 : 1.3)}l-4 -1z" fill="${c}"/>`; });
        if (fl.length === 1) g += `<circle cx="${r(x + 5)}" cy="${r(y - 4.6)}" r=".9" fill="none" stroke="#ffcc00" stroke-width=".35" stroke-dasharray=".25 .3"/>`;
      });
      return g;
    } },
  { b: 10, H: 15, dach: "flach", wand: "#d9d6cf", d: "#a9aca8", fen: 0, art: "glas", band: "#1f5d8a", name: "Bürgeramt", band2: true,
    w: { id: "vb_buergeramt", de: "das Bürgeramt", syl: "BÜR-ger-amt", it: "l'anagrafe", itSyl: "a-NA-gra-fe", en: "citizens' office", lupe: "buergeramt" },
    extra: (X0, X1) => { let g = ""; for (let V = 5.6; V < 14.5; V += 3) g += R(X0 + 0.3, V, X1 - 0.3, V + 1.5, GLAS) + R(X0 + 0.3, V, X1 - 0.3, V + 1.5, SPIEGEL); return g; } },
  { b: 10, H: 16, dach: "flach", wand: "#e6ddd0", d: "#b9bbb6", fen: 4, art: "glas", band: "#2c3e50", name: "Ausländerbehörde", fs: 2.1,
    w: { id: "vb_auslaenderbehoerde", de: "die Ausländerbehörde", syl: "AUS-län-der-be-hör-de", it: "l'ufficio stranieri", itSyl: "uf-FI-cio stra-NIE-ri", en: "immigration office", lupe: "auslaenderbehoerde" } },
  { b: 12, H: 17, dach: "mansard", wand: "#e8dcc2", d: "#5f6b72", fen: 5, art: "portal", sockel: "#cfc0a0", name: "UNIVERSITÄT", fs: 2.4,
    w: { id: "vb_universitaet", de: "die Universität", syl: "U-ni-ver-si-TÄT", it: "l'università", itSyl: "u-ni-ver-si-TÀ", en: "university", lupe: "universitaet" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; let g = ""; for (let i = 0; i < 6; i++) { const X = X0 + 1.2 + i * (X1 - X0 - 2.4) / 5; g += R(X - 0.2, 4.4, X + 0.2, 16.4, "#f1e8d4"); }
      /* Fahrräder vor der Uni */
      for (let i = 0; i < 4; i++) { const x = bx(X0 + 1 + i * 0.9); g += `<circle cx="${r(x)}" cy="${r(by(0.35))}" r="1.2" fill="none" stroke="#222" stroke-width=".35"/><circle cx="${r(x + 2.2)}" cy="${r(by(0.35))}" r="1.2" fill="none" stroke="#222" stroke-width=".35"/><path d="M${r(x)} ${r(by(0.35))}l1 -1.6h1.4" stroke="${["#c0392b", "#2980b9", "#27ae60", "#555"][i]}" stroke-width=".45" fill="none"/>`; }
      return g; } },
];
{
  let X = -WX;
  for (const h of RUECK) {
    const X0 = X, X1 = X + h.b; X = X1;
    let g = R(X0, 0, X1, h.H, h.wand) + R(X0, 0, X1, h.H, PUTZLICHT);
    g += `<path d="M${r(bx(X0))} ${r(by(0))}V${r(by(h.H))}" stroke="#000" stroke-width=".3" opacity=".25"/>`;
    g += dach(X0, X1, h.H, h.dach, h.d, h.wand).g;
    if (h.fen) g += fenster(X0 + 0.3, X1 - 0.3, 5.2, h.H - 0.4, h.fen, { sims: h.sims });
    g += `<path d="M${r(bx(X0))} ${r(by(4.4))}H${r(bx(X1))}" stroke="${dunkel(h.wand, 0.78)}" stroke-width=".9"/>`;
    if (h.art === "portal") g += portal(X0, X1, { sockel: h.sockel, name: h.name, fs: h.fs, schrift: h.schrift });
    if (h.art === "glas") g += glasfront(X0, X1, { band: h.band, name: h.name, fs: h.fs });
    if (h.extra) g += h.extra(X0, X1);
    g += R(X0, -0.15, X1, 0.25, "#000", ' opacity=".18"');
    const mh = h.art === "rathaus" ? 12 : Math.min(h.H, 13) - 2.5;
    teil(Object.assign({}, h.w, anker(bx((X0 + X1) / 2 + (h.art === "rathaus" ? 4.5 : 0)), by(mh)), { tipp: TIPP }), g);
    if (h.fensterTeil) { const f = h.fensterTeil(X0, X1); teil(Object.assign(f.t, anker(f.mx, f.my)), f.g); }
  }
}

/* =====================================================================
   SEITENFRONTEN (Fluchtperspektive): links und rechts je vier Häuser
   ===================================================================== */
const xBild = [64, 48, 32, 16, 0];
const zSeite = xBild.map((x) => F * WX / (200 - x));
function seitenhaus(seite, i, h) {
  const z0 = zSeite[i], z1 = zSeite[i + 1], X = seite * WX;
  const Q = (u, v, x = X) => P(x, v, z0 + (z1 - z0) * u);            // u: 0 hinten … 1 vorne
  const flaeche = (u0, v0, u1, v1, f, extra = "") => `<path d="${quad(Q(u0, v0), Q(u1, v0), Q(u1, v1), Q(u0, v1))}" fill="${f}"${extra}/>`;
  let g = flaeche(0, 0, 1, h.H, h.wand);
  if (seite > 0) g += flaeche(0, 0, 1, h.H, "#1d2633", ' opacity=".14"');
  g += `<path d="${quad(Q(0, h.H), Q(1, h.H), Q(1, h.H + 3.4, X + seite * 0.8), Q(0, h.H + 3.4, X + seite * 0.8))}" fill="${h.d}"/>`;
  g += `<path d="M${pt(Q(0, h.H))}L${pt(Q(1, h.H))}" stroke="${dunkel(h.wand, 0.7)}" stroke-width=".7"/>`;
  g += `<path d="M${pt(Q(0, 0))}L${pt(Q(0, h.H))}" stroke="#000" stroke-width=".35" opacity=".3"/>`;
  if (h.glas) { for (let V = 4.6; V < h.H - 0.6; V += 3) g += flaeche(0.03, V, 0.97, V + 2.2, GLAS) + flaeche(0.03, V, 0.97, V + 2.2, SPIEGEL); }
  else { const n = h.fen || 2;
    for (let V = 5.2; V + 1.7 < h.H - 0.3; V += 3.2) for (let j = 0; j < n; j++) { const u = (j + 0.5) / n, du = 0.32 / n; g += flaeche(u - du - 0.02, V - 0.12, u + du + 0.02, V + 1.82, "#f4f1ea") + flaeche(u - du, V, u + du, V + 1.7, GLAS); } }
  g += flaeche(0, 0, 1, 4.3, h.sockel || dunkel(h.wand, 0.9));
  g += flaeche(0.06, 0.5, 0.66, 3.0, h.innen || GLASHELL) + flaeche(0.06, 0.5, 0.66, 3.0, SPIEGEL);
  if (h.inhalt) g += h.inhalt(Q, flaeche);
  g += flaeche(0.72, 0, 0.92, 2.7, "#3a3a3a") + flaeche(0.74, 0, 0.9, 2.55, GLAS);
  g += flaeche(0.03, 3.2, 0.97, 4.1, h.band);
  { const ua = seite < 0 ? 0.92 : 0.08, ub = 1 - ua, a = Q(ua, 4.0), b = Q(ub, 4.0), c = Q(ua, 3.3), L = 40, Hh = 6;
    const m = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, (c[0] - a[0]) / Hh, (c[1] - a[1]) / Hh, a[0], a[1]].map((v) => Math.round(v * 1000) / 1000);
    g += `<text transform="matrix(${m.join(" ")})" x="20" y="5" font-size="${h.fs || 5.2}" text-anchor="middle" fill="${h.schrift || "#fff"}" font-family="Arial,sans-serif" font-weight="bold">${h.name}</text>`; }
  { const zc = z0 + (z1 - z0) * 0.5, a = P(X - seite * 0.25, 6.6, zc), b = P(X - seite * 1.55, 5.3, zc);
    const xl = Math.min(a[0], b[0]), w = Math.abs(b[0] - a[0]), hh = b[1] - a[1];
    g += `<path d="M${pt(P(X, 6.75, zc))}L${pt(P(X - seite * 1.6, 6.75, zc))}" stroke="#2b2b2b" stroke-width=".5"/>`;
    g += `<rect x="${r(xl)}" y="${r(a[1])}" width="${r(w)}" height="${r(hh)}" rx=".6" fill="${h.nase || "#fff"}" stroke="#2b2b2b" stroke-width=".35"/>`;
    g += `<g transform="translate(${r(xl + w / 2)} ${r(a[1] + hh / 2)}) scale(${r(w / 10)})">${h.symbol}</g>`; }
  if (h.vorne) g += h.vorne(Q, z0, z1);
  const m = Q(0.5, 9);
  teil(Object.assign({}, h.w, anker(m[0], m[1]), { tipp: TIPP }), g);
  if (h.fensterTeil) { const f = h.fensterTeil(Q, flaeche); teil(Object.assign(f.t, anker(f.mx, f.my)), f.g); }
}
const SYM = {
  job: `<rect x="-5" y="-5" width="10" height="10" rx="1" fill="#c0392b"/><path d="M-3 -1h6v4h-6zM-1.2 -1v-1.2h2.4v1.2" stroke="#fff" stroke-width=".7" fill="none"/>`,
  polizei: `<rect x="-5" y="-5" width="10" height="10" rx="1" fill="#1f4e8c"/><path d="M0 -3.6l1 2.2l2.4 .2l-1.8 1.6l.6 2.4l-2.2 -1.3l-2.2 1.3l.6 -2.4l-1.8 -1.6l2.4 -.2z" fill="#f2f2f2"/>`,
  schild: `<rect x="-4.6" y="-1.8" width="9.2" height="3.6" rx=".5" fill="#fff" stroke="#111" stroke-width=".4"/><rect x="-4.6" y="-1.8" width="1.4" height="3.6" fill="#003399"/><text x=".7" y="1" font-size="2.2" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">B·AB 12</text>`,
  fahr: `<circle r="3.6" fill="none" stroke="#222" stroke-width=".9"/><circle r=".9" fill="#222"/><path d="M-3.4 0h2.5M.9 0h2.5M0 .9v2.6" stroke="#222" stroke-width=".8"/>`,
  buch: `<path d="M0 -2.4q-2 -1 -4 -.6v5.4q2 -.4 4 .6q2 -1 4 -.6v-5.4q-2 -.4 -4 .6z" fill="#fff" stroke="#34495e" stroke-width=".5"/><path d="M0 -2.4v5.4" stroke="#34495e" stroke-width=".4"/>`,
  koffer: `<rect x="-3.8" y="-1.8" width="7.6" height="5" rx=".6" fill="#6b4a2a"/><path d="M-1.2 -1.8v-1.2h2.4v1.2" stroke="#6b4a2a" stroke-width=".7" fill="none"/>`,
  sprache: `<path d="M-4 -3h8v4.6h-4.4l-2 1.8v-1.8h-1.6z" fill="#8e44ad"/><text x="0" y=".6" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">ABC</text>`,
  hantel: `<path d="M-2.4 0h4.8" stroke="#222" stroke-width=".9"/><rect x="-4" y="-2" width="1.4" height="4" rx=".3" fill="#222"/><rect x="2.6" y="-2" width="1.4" height="4" rx=".3" fill="#222"/>`,
};
const seitInhalt = (farben, reihen = 3) => (Q, fl) => { let g = ""; for (let i = 0; i < reihen; i++) for (let j = 0; j < 5; j++) g += fl(0.09 + j * 0.11, 0.8 + i * 0.7, 0.17 + j * 0.11, 1.25 + i * 0.7, farben[(i + j) % farben.length]); return g; };
/* Auto vor einer Seitenfassade (frontal gesehen: es steht quer zur Blickrichtung? nein — längs der Häuser) */
const autoSeite = (Q, seite, farbe, dach) => {
  const p = (u, v, d) => Q(u, v, seite * (WX - d));
  let g = `<path d="${quad(p(0.1, 0, 1.6), p(0.95, 0, 1.6), p(0.95, 0.9, 1.6), p(0.1, 0.9, 1.6))}" fill="${farbe}"/>`;
  g += `<path d="${quad(p(0.3, 0.9, 1.6), p(0.8, 0.9, 1.6), p(0.75, 1.45, 1.6), p(0.35, 1.45, 1.6))}" fill="#2c3a44"/>`;
  g += `<path d="${quad(p(0.1, 0.9, 1.6), p(0.95, 0.9, 1.6), p(0.95, 0.9, 3.4), p(0.1, 0.9, 3.4))}" fill="${dunkel(farbe, 0.85)}"/>`;
  if (dach) g += dach(p);
  for (const u of [0.25, 0.8]) { const c = p(u, 0.33, 1.55); g += `<ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(Math.abs(p(u + 0.06, 0, 1.55)[0] - p(u, 0, 1.55)[0]) + 0.6)}" ry="1.3" fill="#1b1b1b"/>`; }
  return g;
};
[
  { H: 15, wand: "#e9ecee", d: "#8a8f93", fen: 3, name: "Jobcenter", band: "#c0392b", symbol: SYM.job, glas: false, inhalt: seitInhalt(["#ddd", "#c0392b"], 2),
    w: { id: "vb_jobcenter", de: "das Jobcenter", syl: "JOB-cen-ter", it: "il centro per l'impiego", itSyl: "CEN-tro per l'im-PIE-go", en: "job centre", lupe: "jobcenter" } },
  { H: 14, wand: "#efe6d2", d: "#6b6f73", fen: 2, name: "POLIZEI", band: "#1f4e8c", symbol: SYM.polizei, nase: "#1f4e8c",
    w: { id: "vb_polizei", de: "die Polizeiwache", syl: "Po-li-ZEI-wa-che", it: "il commissariato", itSyl: "com-mis-sa-RIA-to", en: "police station", lupe: "polizeiwache" },
    vorne: (Q) => autoSeite(Q, -1, "#f4f4f4", (p) => `<path d="${quad(p(0.1, 0.4, 1.58), p(0.95, 0.4, 1.58), p(0.95, 0.62, 1.58), p(0.1, 0.62, 1.58))}" fill="#1f4e8c"/><path d="${quad(p(0.5, 1.45, 2.4), p(0.6, 1.45, 2.4), p(0.6, 1.65, 2.4), p(0.5, 1.65, 2.4))}" fill="#3a8fe0"/>`) },
  { H: 13, wand: "#dfe3e6", d: "#5f5f63", fen: 2, name: "Kfz-Zulassung", fs: 4.4, band: "#2c3e50", symbol: SYM.schild,
    w: { id: "vb_zulassung", de: "die Zulassungsstelle", syl: "ZU-las-sungs-stel-le", it: "la motorizzazione", itSyl: "mo-to-riz-za-ZIO-ne", en: "vehicle office", lupe: "zulassungsstelle" },
    inhalt: (Q, fl) => { let g = ""; for (let i = 0; i < 3; i++) g += fl(0.12 + i * 0.17, 1.6, 0.26 + i * 0.17, 2.0, "#fff") + fl(0.12 + i * 0.17, 1.6, 0.14 + i * 0.17, 2.0, "#003399"); return g; } },
  { H: 12, wand: "#f3ead8", d: "#8e3b2a", fen: 2, name: "Fahrschule", band: "#e67e22", symbol: SYM.fahr,
    w: { id: "vb_fahrschule", de: "die Fahrschule", syl: "FAHR-schu-le", it: "la scuola guida", itSyl: "SCUO-la GUI-da", en: "driving school", lupe: "fahrschule" },
    vorne: (Q) => autoSeite(Q, -1, "#2e86c1", (p) => `<path d="${quad(p(0.48, 1.45, 2.4), p(0.68, 1.45, 2.4), p(0.68, 1.85, 2.4), p(0.48, 1.85, 2.4))}" fill="#fff" stroke="#1d4f91" stroke-width=".3"/>`) },
].forEach((h, i) => seitenhaus(-1, i, h));
[
  { H: 14, wand: "#cfd8dc", d: "#9aa3a8", name: "Stadtbibliothek", fs: 4.2, band: "#34495e", symbol: SYM.buch, glas: true, inhalt: seitInhalt(["#c0392b", "#2980b9", "#f1c40f", "#27ae60", "#8e44ad"]),
    w: { id: "vb_bibliothek", de: "die Bibliothek", syl: "Bi-blio-THEK", it: "la biblioteca", itSyl: "bi-blio-TE-ca", en: "library", lupe: "bibliothek" } },
  { H: 19, wand: "#b7c6cf", d: "#8a979e", name: "Büro", band: "#455a64", symbol: SYM.koffer, glas: true,
    w: { id: "vb_buero", de: "das Büro", syl: "Bü-RO", it: "l'ufficio", itSyl: "uf-FI-cio", en: "office", lupe: "buero" },
    fensterTeil: (Q, fl) => {
      /* DAS BEWERBUNGSGESPRÄCH — Besprechungsraum im 2. Stock: zwei Personen am Tisch */
      let g = fl(0.1, 7.7, 0.9, 9.8, "#fdf6e3") + fl(0.12, 7.75, 0.88, 7.95, "#7a5a3a");
      const kopf = (u, f) => { const c = Q(u, 8.75), d = Q(u, 8.0); return `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="1.1" fill="#5a4636"/><path d="M${r(d[0] - 1.6)} ${r(d[1])}q1.6 -3.4 3.2 0z" fill="${f}"/>`; };
      g += kopf(0.3, "#2c3e50") + kopf(0.7, "#7f8c8d") + fl(0.42, 8.2, 0.58, 8.5, "#fff");
      g += `<path d="M${pt(Q(0.5, 7.7))}L${pt(Q(0.5, 9.8))}" stroke="#90a4ae" stroke-width=".6"/>`;
      const m = Q(0.5, 10.4);
      return { t: { id: "vb_bewerbung", de: "das Bewerbungsgespräch", syl: "Be-WER-bungs-ge-spräch", it: "il colloquio di lavoro", itSyl: "col-LO-quio di la-VO-ro", en: "job interview", lupe: "bewerbungsgespraech", oben: true, tipp: "Im Besprechungsraum läuft gerade ein Bewerbungsgespräch." }, g, mx: m[0], my: m[1] - 4 };
    } },
  { H: 15, wand: "#efe2c8", d: "#8e3b2a", fen: 2, name: "Sprachschule", fs: 4.6, band: "#8e44ad", symbol: SYM.sprache, inhalt: seitInhalt(["#8e44ad", "#fff", "#f1c40f"], 2),
    w: { id: "vb_sprachschule", de: "die Sprachschule", syl: "SPRACH-schu-le", it: "la scuola di lingue", itSyl: "SCUO-la di LIN-gue", en: "language school", lupe: "sprachschule" },
    fensterTeil: (Q, fl) => {
      /* DER KURSRAUM — im 1. Stock: Tafel, Lehrerin, Kursteilnehmer */
      let g = fl(0.08, 5.0, 0.92, 7.4, "#fff3c4") + fl(0.14, 6.0, 0.5, 7.1, "#2f4f3f");
      const tafel = Q(0.32, 6.65); g += `<path d="M${r(tafel[0] - 2)} ${r(tafel[1])}h3M${r(tafel[0] - 2)} ${r(tafel[1] + 1.4)}h2" stroke="#fff" stroke-width=".4"/>`;
      for (const [u, f] of [[0.58, "#c0392b"], [0.7, "#2980b9"], [0.82, "#27ae60"]]) { const c = Q(u, 5.95), d = Q(u, 5.0); g += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="1" fill="#5a4636"/><path d="M${r(d[0] - 1.5)} ${r(d[1])}q1.5 -3.2 3 0z" fill="${f}"/>`; }
      g += `<path d="M${pt(Q(0.08, 6.2))}L${pt(Q(0.92, 6.2))}" stroke="#f4f1ea" stroke-width=".35" opacity=".6"/>`;
      const m = Q(0.5, 7.4);
      return { t: { id: "vb_kursraum", de: "der Kursraum", syl: "KURS-raum", it: "l'aula del corso", itSyl: "AU-la del COR-so", en: "course room", lupe: "kursraum", oben: true, tipp: "Im Kursraum der Sprachschule lernen Erwachsene Deutsch." }, g, mx: m[0], my: m[1] - 2 };
    } },
  { H: 13, wand: "#e3e3e0", d: "#5f5f63", fen: 2, name: "FITNESS", band: "#111", schrift: "#ffd400", symbol: SYM.hantel, nase: "#ffd400",
    w: { id: "vb_fitnessstudio", de: "das Fitnessstudio", syl: "FIT-ness-stu-dio", it: "la palestra", itSyl: "pa-LE-stra", en: "gym", lupe: "fitnessstudio" },
    inhalt: (Q, fl) => { let g = ""; for (let i = 0; i < 3; i++) g += fl(0.12 + i * 0.17, 0.6, 0.24 + i * 0.17, 0.9, "#333") + fl(0.22 + i * 0.17, 0.9, 0.24 + i * 0.17, 2.0, "#555"); return g; } },
].forEach((h, i) => seitenhaus(1, i, h));

/* =====================================================================
   AUF DEM PLATZ: Fahnen, Wegweiser DACH, Haltestelle, Student
   ===================================================================== */
const kZ = (Z) => F / Z;
{
  /* DIE BUSHALTESTELLE — Wartehäuschen mit grün-gelbem H-Schild (rechts) */
  const Z = 24, X = 9, k = kZ(Z), [cx, gy] = P(X, 0, Z), w = 3.4 * k, h = 2.5 * k;
  let g = schatten(cx + 3, gy, w * 0.6, 2.4, 0.3);
  g += `<rect x="${r(cx - w / 2)}" y="${r(gy - h)}" width="${r(w)}" height="${r(h)}" fill="#cfe3ea" opacity=".45" stroke="#6f7c84" stroke-width=".8"/>`;
  g += `<rect x="${r(cx - w / 2 - 1)}" y="${r(gy - h - 2)}" width="${r(w + 2)}" height="2.4" rx=".5" fill="#4e5b63"/>`;
  g += `<rect x="${r(cx + w * 0.12)}" y="${r(gy - h * 0.85)}" width="${r(w * 0.32)}" height="${r(h * 0.55)}" fill="#f4f1ea" stroke="#6f7c84" stroke-width=".4"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M${r(cx + w * 0.15)} ${r(gy - h * 0.8 + i * 2)}h${r(w * 0.24)}" stroke="#999" stroke-width=".4"/>`;
  g += `<rect x="${r(cx - w * 0.42)}" y="${r(gy - 0.45 * k)}" width="${r(w * 0.45)}" height="1.4" fill="#8a6a45"/>`;
  /* H-Schild am Mast */
  const sx = cx - w / 2 - 4;
  g += `<path d="M${r(sx)} ${r(gy)}V${r(gy - 3 * k)}" stroke="#6f7c84" stroke-width="1"/><circle cx="${r(sx)}" cy="${r(gy - 3 * k)}" r="3.8" fill="#ffd400" stroke="#2e7d32" stroke-width="1.1"/><text x="${r(sx)}" y="${r(gy - 3 * k + 2)}" font-size="5.4" text-anchor="middle" fill="#2e7d32" font-family="Arial" font-weight="bold">H</text>`;
  teil({ id: "haltestelle", de: "die Haltestelle", syl: "HAL-te-stel-le", it: "la fermata", itSyl: "fer-MA-ta", en: "bus stop", x: cx, y: gy, tipp: "Das grüne H auf gelbem Grund bedeutet: Hier hält der Bus." }, g);
}
{
  /* DER WEGWEISER DACH — Wegweiser-Säule mit den drei Ländern (links) */
  const Z = 22, X = -6.5, k = kZ(Z), [cx, gy] = P(X, 0, Z);
  let g = schatten(cx + 2, gy, 6, 1.2, 0.3);
  g += `<rect x="${r(cx - 0.9)}" y="${r(gy - 3.3 * k)}" width="1.8" height="${r(3.3 * k)}" fill="${S.lg("mast", [[0, "#5d6a72"], [0.5, "#3c464d"], [1, "#2a3237"]], 0, 0, 1, 0)}"/>`;
  const schilder = [["Deutschland", 1, ["#000", "#dd0000", "#ffce00"]], ["Österreich", -1, ["#ed2939", "#fff", "#ed2939"]], ["Schweiz", 1, ["#d52b1e"]]];
  schilder.forEach(([t, sg, fl], i) => {
    const y = gy - 3.1 * k + i * 6.2, L = 23;
    g += `<path d="${sg > 0 ? `M${r(cx)} ${r(y)}h${L}l2.6 2.4l-2.6 2.4h${-L}z` : `M${r(cx)} ${r(y)}h${-L}l-2.6 2.4l2.6 2.4h${L}z`}" fill="#fbfbf6" stroke="#2a3237" stroke-width=".45"/>`;
    const fx = sg > 0 ? cx + 1.2 : cx - 6.2;
    if (fl.length === 3) fl.forEach((c, j) => { g += `<rect x="${r(fx)}" y="${r(y + 0.9 + j * 1)}" width="5" height="1" fill="${c}"/>`; });
    else g += `<rect x="${r(fx + 0.8)}" y="${r(y + 0.8)}" width="3.2" height="3.2" fill="${fl[0]}"/><path d="M${r(fx + 2.4)} ${r(y + 1.4)}v2M${r(fx + 1.4)} ${r(y + 2.4)}h2" stroke="#fff" stroke-width=".7"/>`;
    g += `<text x="${r(sg > 0 ? cx + 7.4 : cx - 7.4)}" y="${r(y + 3.4)}" font-size="2.9" text-anchor="${sg > 0 ? "start" : "end"}" fill="#2a3237" font-family="Arial" font-weight="bold">${t}</text>`;
  });
  teil({ id: "vb_wegweiser", de: "der Wegweiser DACH", syl: "WEG-wei-ser", it: "la guida DACH", itSyl: "GUI-da DACH", en: "guide DE-AT-CH", ...anker(cx, gy - 1.6 * k), lupe: "wegweiser_dach", tipp: TIPP }, g);
}
{
  /* DER STUDENT — mit Rucksack auf dem Weg zur Universität */
  const Z = 15, X = 2.2, k = kZ(Z), [cx, gy] = P(X, 0, Z);
  const m = B.mensch({ id: "vb_stud", geschlecht: "m", pose: "kontrapost", blick: 40, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "rot" } } }, 1.78 * k);
  teil({ id: "student", de: "der Student", syl: "Stu-DENT", it: "lo studente", itSyl: "stu-DEN-te", en: "student", x: cx, y: gy,
    tipp: "Der Student geht zur Vorlesung in die Universität." }, schatten(cx + 4, gy - 0.4, 9, 1.6, 0.3) + `<g transform="translate(${r(cx)} ${r(gy)})">${m.svg}</g>`);
}

S.davor(`<rect width="400" height="260" fill="${S.rg("sonne", [[0, "#fff4d6", 0.18], [1, "#fff4d6", 0]], 0.15, 0.1, 0.8)}"/>`);

console.log(S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_behoerden.js")));
