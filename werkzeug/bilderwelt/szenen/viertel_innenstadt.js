#!/usr/bin/env node
/* =====================================================================
   DIE INNENSTADT (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort wie das echte Vorbild, jedes Ding
   einzeln antippbar, nichts blockiert.

   RECHERCHE (Werbeanlagensatzungen Altstadt Heidelberg, Fürth,
   Stuttgart; Fußgängerzonen Nürnberg, München, Münster Prinzipalmarkt):
   - Der Marktplatz / die Fußgängerzone ist von schmalen, hohen
     Bürgerhäusern umgeben: Fachwerk-Giebelhäuser, Gründerzeit-Fassaden
     aus Sandstein, Jugendstil, dazwischen Nachkriegsbauten mit großen
     Schaufenstern.
   - Läden nur im ERDGESCHOSS: Schaufenster, Ladentür, darüber ein
     Schriftzug in Einzelbuchstaben (Werbung nur unterhalb der
     Fensterbrüstung des 1. OG); quer zur Fassade NASENSCHILDER
     (Ausleger, etwa 0,8–1 m) mit Zunftzeichen: Brezel, Apotheken-A,
     Brille, Posthorn …; Markisen nur über den Schaufenstern.
   - Cafés, Eiscafés und Gasthäuser stellen Tische und Schirme vor die
     Tür; auf dem Platz: Marktbrunnen, Wochenmarkt mit Ständen,
     Zeitungskiosk, Laternen, Fahrradständer. Pflaster aus Granit.
   - Über den Dächern der Turm der Marktkirche.
   Perspektive: ein Fluchtpunkt (200|149), Augenhöhe 6 m (Blick vom
   ersten Stock), Rückfront 80 m entfernt: 3,5 Einheiten je Meter dort.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;
const r = B.r;

const S = neueSzene({ id: "viertel_innenstadt", titel: "Die Innenstadt", emoji: "🏬", thema: "Stadt", kuerzel: "vin", fassung: 852, breite: 400, hoehe: 260 });
const rnd = zufall(1903);
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
/* Marktkirche (Backstein-Gotik, grüner Helm) — weit hinten */
{
  const x = 262;
  let k = `<rect x="${x - 9}" y="30" width="18" height="80" fill="${S.lg("turm", [[0, "#b8775a"], [0.6, "#a5654b"], [1, "#8a523c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x - 9} 30 L${x} 4 L${x + 9} 30Z" fill="${S.lg("helm", [[0, "#9ad0bb"], [0.55, "#5f9c86"], [1, "#3f735f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x} 4v-3.6M${x - 1.6} 1.8h3.2" stroke="#c9a227" stroke-width=".7"/>`;
  k += `<path d="M${x - 4} 60v-10q4 -6 8 0v10z M${x - 4} 86v-12q4 -6 8 0v12z" fill="#3e3a3a"/><circle cx="${x}" cy="40" r="4.4" fill="#f4efe1" stroke="#6b4c2a" stroke-width=".6"/><path d="M${x} 40v-3.2M${x} 40h2.2" stroke="#222" stroke-width=".6"/>`;
  S.hinten(k);
}
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
  /* Ein Kreis aus dunklem Pflaster um den Brunnen */
  const m = P(0, 0, 40);
  p += `<ellipse cx="${r(m[0])}" cy="${r(m[1] - 0.6)}" rx="34" ry="6.4" fill="none" stroke="#8b8478" stroke-width="2.4" opacity=".55"/>`;
  /* Schatten der linken Häuser fällt leicht nach rechts auf den Platz */
  p += `<path d="${quad(P(-WX, 0, ZB), P(-WX + 6, 0, ZB), P(-WX + 6, 0, 30), P(-WX, 0, 30))}" fill="#3a3024" opacity=".08"/>`;
  S.hinten(p);
}

/* =====================================================================
   RÜCKFRONT: elf schmale Bürgerhäuser (frontal)
   ===================================================================== */
const K = F / ZB, GY = P(0, 0, ZB)[1];               // 3,53 Einheiten je Meter, Bodenlinie
const bx = (X) => 200 + K * X, by = (V) => GY - K * V;
const R = (X0, V0, X1, V1, f, extra = "") => `<rect x="${r(bx(X0))}" y="${r(by(V1))}" width="${r(K * (X1 - X0))}" height="${r(K * (V1 - V0))}" fill="${f}"${extra}/>`;

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

/* Ladenfront im Erdgeschoss (Schaufenster, Tür, Schriftzug) */
function laden(X0, X1, o) {
  const tuerL = o.tuer === "links";
  const tx0 = tuerL ? X0 + 0.5 : X1 - 1.7, tx1 = tx0 + 1.2;
  const sx0 = tuerL ? tx1 + 0.3 : X0 + 0.5, sx1 = tuerL ? X1 - 0.5 : tx0 - 0.3;
  let g = R(X0, 0, X1, 4.3, o.sockel || dunkel(o.wand, 0.9));
  /* Schriftzug-Band */
  g += R(X0 + 0.2, 3.25, X1 - 0.2, 4.15, o.band || "#2b2b2b");
  g += `<text x="${r(bx((X0 + X1) / 2))}" y="${r(by(3.42))}" font-size="${o.fs || 2.6}" text-anchor="middle" fill="${o.schrift || "#fff"}" font-family="${o.font || "Arial,sans-serif"}" font-weight="bold" letter-spacing=".15">${o.name}</text>`;
  /* Schaufenster mit Inhalt und Spiegelung */
  g += R(sx0 - 0.15, 0.45, sx1 + 0.15, 3.05, o.rahmen || "#3a3a3a");
  g += R(sx0, 0.6, sx1, 2.95, o.innen || GLASHELL);
  if (o.inhalt) g += o.inhalt(sx0, sx1);
  g += `<path d="M${r(bx(sx0 + 0.3))} ${r(by(0.6))}L${r(bx(sx0 + 1.4))} ${r(by(2.95))}H${r(bx(sx0 + 2))}L${r(bx(sx0 + 0.9))} ${r(by(0.6))}Z" fill="#fff" opacity=".22"/>`;
  /* Tür */
  g += R(tx0 - 0.12, 0, tx1 + 0.12, 2.75, o.rahmen || "#3a3a3a") + R(tx0, 0, tx1, 2.6, GLAS);
  g += `<path d="M${r(bx(tx0 + 0.25))} ${r(by(1.2))}h1.2" stroke="#d8d8d8" stroke-width=".5"/>`;
  /* Markise */
  if (o.markise) {
    const [a, b] = o.markise, y0 = by(3.15), y1 = by(2.35);
    let st = "";
    const n = Math.max(4, Math.round((sx1 - sx0 + 0.6) / 0.6));
    for (let i = 0; i < n; i++) { const xa = bx(sx0 - 0.3) + (K * (sx1 - sx0 + 0.6)) * i / n, xb = xa + K * (sx1 - sx0 + 0.6) / n; st += `<path d="M${r(xa)} ${r(y0)}H${r(xb)}L${r(xb + 0.4)} ${r(y1)}H${r(xa + 0.4)}Z" fill="${i % 2 ? b : a}"/>`; }
    g += st + `<path d="M${r(bx(sx0 - 0.3) + 0.4)} ${r(y1)}H${r(bx(sx1 + 0.3) + 0.4)}" stroke="${dunkel(a, 0.6)}" stroke-width=".5"/>`;
  }
  return g;
}

/* Inhalte der Schaufenster */
const regal = (fa) => (a, b) => { let g = ""; for (let V = 0.9; V < 2.8; V += 0.65) { g += R(a + 0.1, V, b - 0.1, V + 0.08, "#ddd"); for (let X = a + 0.2; X < b - 0.3; X += 0.36) g += R(X, V + 0.08, X + 0.26, V + 0.5, fa[Math.floor(rnd() * fa.length)]); } return g; };
const INHALT = {
  apotheke: regal(["#2e8b57", "#ffffff", "#d9534f", "#3a7bd5", "#f1c40f"]),
  baeckerei: (a, b) => { let g = R(a, 0.6, b, 1.6, "#7a5232"); for (let X = a + 0.4; X < b - 0.4; X += 0.9) g += `<ellipse cx="${r(bx(X))}" cy="${r(by(1.85))}" rx="1.4" ry=".9" fill="#c88a45"/>`; for (let X = a + 0.5; X < b - 0.4; X += 0.7) g += `<ellipse cx="${r(bx(X))}" cy="${r(by(2.55))}" rx="1" ry=".7" fill="#d9a35b"/>`; return g; },
  metzgerei: (a, b) => { let g = R(a, 0.6, b, 1.5, "#e9ecee"); for (let X = a + 0.3; X < b - 0.3; X += 0.55) g += R(X, 1.5, X + 0.45, 1.85, ["#b33a3a", "#d4706a", "#9c2f2f", "#e8b3a5"][Math.floor(rnd() * 4)]); for (let X = a + 0.5; X < b - 0.3; X += 0.8) g += `<path d="M${r(bx(X))} ${r(by(2.9))}v2.4" stroke="#888" stroke-width=".25"/><ellipse cx="${r(bx(X))}" cy="${r(by(2.15))}" rx=".6" ry="1.6" fill="#a33b2c"/>`; return g; },
  cafe: (a, b) => { let g = R(a, 0.6, b, 1.3, "#6b4630"); for (let X = a + 0.5; X < b - 0.3; X += 1.1) g += `<path d="M${r(bx(X) - 1.6)} ${r(by(1.3))}h3.2l-.3 -1.2h-2.6z" fill="#f3e3c3"/>`; return g; },
  eis: (a, b) => { let g = R(a, 0.6, b, 1.5, "#f0f2f3"); const f = ["#f7e7b0", "#e9a3b6", "#6b3e26", "#b8dc8c", "#f4f1ea", "#e3654f"]; for (let X = a + 0.3, i = 0; X < b - 0.3; X += 0.55, i++) g += `<ellipse cx="${r(bx(X + 0.22))}" cy="${r(by(1.55))}" rx="${r(K * 0.24)}" ry=".55" fill="${f[i % 6]}"/>`; return g; },
  restaurant: (a, b) => { let g = ""; for (let X = a + 0.6; X < b - 0.4; X += 1.4) g += `<ellipse cx="${r(bx(X))}" cy="${r(by(1.15))}" rx="2.2" ry=".55" fill="#f7f3ea"/><path d="M${r(bx(X))} ${r(by(1.1))}v2" stroke="#3a2a1a" stroke-width=".4"/><circle cx="${r(bx(X))}" cy="${r(by(2.6))}" r=".9" fill="#ffe7a6" opacity=".9"/>`; return g; },
  mode: (a, b) => { let g = ""; const f = ["#c0392b", "#2c3e50", "#e6b0aa", "#f4f1ea"]; for (let X = a + 0.6, i = 0; X < b - 0.4; X += 1.2, i++) g += `<circle cx="${r(bx(X))}" cy="${r(by(2.55))}" r=".75" fill="#e8e2da"/><path d="M${r(bx(X) - 1.4)} ${r(by(2.3))}h2.8l.5 4h-3.8z" fill="${f[i % 4]}"/><path d="M${r(bx(X))} ${r(by(1.1))}v-2" stroke="#999" stroke-width=".3"/>`; return g; },
  drogerie: regal(["#e84393", "#0984e3", "#fdcb6e", "#00b894", "#ffffff", "#6c5ce7"]),
  friseur: (a, b) => { let g = ""; for (let X = a + 0.6; X < b - 0.4; X += 1.4) g += R(X - 0.45, 1.6, X + 0.45, 2.8, "#cfe3ea") + R(X - 0.4, 0.6, X + 0.4, 1.2, "#2d2d2d"); return g; },
  gasthaus: (a, b) => { let g = ""; for (let X = a + 0.3; X < b - 0.3; X += 0.9) g += R(X, 0.6, X + 0.7, 2.95, "#f1e2c2") + R(X + 0.05, 1.7, X + 0.65, 2.9, "#c9a46a"); return g; },
  bank: (a, b) => R(a + 0.2, 0.8, a + 1.1, 2.2, "#d0d6db") + R(a + 0.35, 1.5, a + 0.95, 2.0, "#3a87c8") + R(a + 0.4, 1.0, a + 0.9, 1.2, "#333"),
};

/* Die elf Häuser der Rückfront (von links nach rechts), Breiten in Metern */
const RUECK = [
  { b: 7.5, H: 16.5, dach: "mansard", wand: "#e3cfae", d: "#5f6b72", fen: 3, name: "Stadt-Apotheke", band: "#1d5c3a", schrift: "#f5f0e1", font: "Georgia,serif", innen: "#e9f1ee", inhalt: "apotheke", sims: "#cdb48c",
    w: { id: "vi_apotheke", de: "die Apotheke", syl: "A-po-THE-ke", it: "la farmacia", itSyl: "far-ma-CI-a", en: "pharmacy", lupe: "apotheke" },   // korrigiert: Betonung fehlte (alt „A-po-the-ke“)
    extra: (X0) => { const X = X0 + 1.2; return R(X - 0.1, 5.2, X + 1.9, 7.2, "#fff") + `<text x="${r(bx(X + 0.9))}" y="${r(by(5.45))}" font-size="6" text-anchor="middle" fill="#d0021b" font-family="'Old English Text MT','UnifrakturMaguntia',Georgia,serif" font-weight="bold">A</text>`; } },
  { b: 6.5, H: 12, dach: "giebel", wand: "#f3ead7", d: "#8e3b2a", fen: 3, fach: true, name: "Bäckerei", band: "#5b3417", schrift: "#f1d79a", font: "Georgia,serif", inhalt: "baeckerei", markise: ["#c8a46a", "#f3ead7"],
    w: { id: "vi_baeckerei", de: "die Bäckerei", syl: "Bä-cke-REI", it: "il panificio", itSyl: "pa-ni-FI-cio", en: "bakery", lupe: "baeckerei" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; return `<path d="M${r(bx(m))} ${r(by(5.2))}v-2" stroke="#3a2a1a" stroke-width=".5"/><path d="M${r(bx(m) - 2.6)} ${r(by(5.2) + 5.4)}c-2 -1 -1.6 -4.4 1 -4.2c1.6 .2 2.2 2 1.6 3.4m2.6 .8c2 -1 1.6 -4.4 -1 -4.2c-1.6 .2 -2.2 2 -1.6 3.4" stroke="#c9a227" stroke-width="1" fill="none" stroke-linecap="round"/>`; } },
  { b: 6.5, H: 14, dach: "giebel", wand: "#efe1b5", d: "#9c4a36", fen: 2, name: "Metzgerei", band: "#a61e22", inhalt: "metzgerei", rahmen: "#e5e5e5", sockel: "#f4f4f2", markise: ["#a61e22", "#f6f6f6"],
    w: { id: "vi_metzgerei", de: "die Metzgerei", syl: "METZ-ge-rei", it: "la macelleria", itSyl: "ma-cel-le-RI-a", en: "butcher's", lupe: "metzgerei" } },
  { b: 8, H: 17, dach: "flach", wand: "#cfe0cf", d: "#6b7f6b", fen: 3, name: "Café am Markt", terrasse: { n: 2, schirm: "#f1ead6", stuhl: "#2f4a3a" }, band: "#2f4a3a", schrift: "#f3e3c3", font: "Georgia,serif", inhalt: "cafe", innen: "#e6d3b3", markise: ["#2f4a3a", "#e9e2cf"], blume: true,
    w: { id: "vi_cafe", de: "das Café", syl: "Ca-FÉ", it: "il caffè", itSyl: "caf-FÈ", en: "café", lupe: "cafe" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; return `<path d="M${r(bx(X0 + 0.3))} ${r(by(17))}Q${r(bx(m))} ${r(by(20.5))} ${r(bx(X1 - 0.3))} ${r(by(17))}Z" fill="#cfe0cf" stroke="#9fb69f" stroke-width=".5"/><circle cx="${r(bx(m))}" cy="${r(by(18.2))}" r="1.6" fill="#f3efe4" stroke="#9fb69f" stroke-width=".4"/>`; } },
  { b: 9, H: 11, dach: "giebel", wand: "#f4ead2", d: "#7c3a2c", fen: 4, fach: true, name: "Gasthaus Zur Linde", band: "#3b2412", schrift: "#e9c77b", font: "Georgia,serif", fs: 2.3, inhalt: "gasthaus", innen: "#d9b98a", blume: true,
    w: { id: "vi_gerichte", de: "die deutsche Küche", syl: "DEUT-sche KÜ-che", it: "la cucina tedesca", itSyl: "cu-CI-na te-DE-sca", en: "German food", lupe: "gerichte" },
    extra: (X0, X1) => { const m = (X0 + X1) / 2; return `<text x="${r(bx(m))}" y="${r(by(15.2))}" font-size="2.4" text-anchor="middle" fill="#3b2412" font-family="Georgia,serif" font-style="italic">Deutsche Küche</text>`; } },
  { b: 7.5, H: 17.5, dach: "flach", wand: "#dcc7a0", d: "#a08a64", fen: 3, name: "Bank", band: "#1f3b63", font: "Georgia,serif", inhalt: "bank", innen: "#d8dee2", sims: "#c5ad82",
    w: { id: "vi_bank", de: "die Bank", syl: "BANK", it: "la banca", itSyl: "BAN-ca", en: "bank", lupe: "bank" },
    extra: (X0, X1) => { let g = ""; for (let i = 0; i < 4; i++) { const X = X0 + 0.6 + i * (X1 - X0 - 1.2) / 3; g += R(X - 0.25, 4.3, X + 0.25, 15.8, "#e9d9b8") + R(X - 0.4, 15.6, X + 0.4, 16.1, "#c9b28a"); } return g + R(X0, 4.3, X1, 4.8, "#c9b28a"); } },
  { b: 6, H: 15, dach: "traufe", wand: "#f2c6c0", d: "#8e3b2a", fen: 2, name: "Eiscafé", terrasse: { n: 1, schirm: "#2f8f9d", stuhl: "#c9ccd0" }, band: "#2f8f9d", inhalt: "eis", innen: "#e6f2f4", markise: ["#2f8f9d", "#f4f1ea"],
    w: { id: "vi_eisdiele", de: "die Eisdiele", syl: "EIS-die-le", it: "la gelateria", itSyl: "ge-la-te-RI-a", en: "ice-cream parlour", lupe: "eisdiele" },
    extra: (X0) => { const X = X0 + 0.6; return `<path d="M${r(bx(X))} ${r(by(5.6))}l1.3 4.2l1.3 -4.2z" fill="#d9a35b"/><circle cx="${r(bx(X) + 1.3)}" cy="${r(by(5.6) - 0.9)}" r="1.4" fill="#e9a3b6"/>`; } },
  { b: 6.5, H: 13.5, dach: "giebel", wand: "#d9b49a", d: "#6e3426", fen: 2, name: "Restaurant", band: "#5a1a22", schrift: "#f0e0c0", font: "Georgia,serif", inhalt: "restaurant", innen: "#4a2e24", laden: "#6e3426",
    w: { id: "vi_restaurant", de: "das Restaurant", syl: "Re-stau-RANT", it: "il ristorante", itSyl: "ri-sto-RAN-te", en: "restaurant", lupe: "restaurant" } },
  { b: 6.5, H: 16, dach: "flach", wand: "#e8e8e4", d: "#9a9a96", fen: 2, name: "MODE", band: "#111", inhalt: "mode", innen: "#f4f4f2", modern: true,
    w: { id: "vi_kleidung", de: "das Kleidergeschäft", syl: "KLEI-der-ge-schäft", it: "il negozio di abbigliamento", itSyl: "ne-GO-zio di ab-bi-glia-MEN-to", en: "clothes shop", lupe: "kleidung" } },
  { b: 6, H: 15.5, dach: "traufe", wand: "#f5f2ea", d: "#5f5f63", fen: 2, name: "Drogerie", band: "#0b6aa8", inhalt: "drogerie", innen: "#f6f6f6",
    w: { id: "vi_drogerie", de: "die Drogerie", syl: "Dro-ge-RIE", it: "la drogheria", itSyl: "dro-ghe-RI-a", en: "drugstore", lupe: "drogerie" } },
  { b: 7, H: 11.5, dach: "giebel", wand: "#f0e6d0", d: "#8e3b2a", fen: 3, fach: true, name: "Friseur", band: "#222", inhalt: "friseur", innen: "#e9eef0", blume: true, tuer: "links",
    w: { id: "vi_friseur", de: "der Friseur", syl: "Fri-SEUR", it: "il parrucchiere", itSyl: "par-ruc-CHIE-re", en: "hairdresser", lupe: "friseur" },
    extra: (X0, X1) => { const m = X1 - 1.6; return `<g transform="translate(${r(bx(m))} ${r(by(6.4))})" stroke="#2b2b2b" stroke-width=".6" fill="none"><circle cx="-1.4" cy="2.4" r="1"/><circle cx="1.4" cy="2.4" r="1"/><path d="M-.8 1.6L1.6 -3M.8 1.6L-1.6 -3"/></g>`; } },
];
{
  let X = -WX;
  for (const h of RUECK) {
    const X0 = X, X1 = X + h.b; X = X1;
    let g = "";
    /* Wand mit Licht */
    g += R(X0, 0, X1, h.H, h.wand) + R(X0, 0, X1, h.H, PUTZLICHT);
    /* Brandwand-Fuge */
    g += `<path d="M${r(bx(X0))} ${r(by(0))}V${r(by(h.H))}" stroke="#000" stroke-width=".3" opacity=".25"/>`;
    const dd = dach(X0, X1, h.H, h.dach, h.d, h.wand);
    g += dd.g;
    if (h.fach) g += fachwerk(X0 + 0.1, X1 - 0.1, 4.6, h.H, 3.2);
    if (h.modern) { g += R(X0 + 0.4, 4.8, X1 - 0.4, h.H - 0.5, "#3e4d57"); for (let V = 4.8; V < h.H - 0.5; V += 2.8) g += R(X0 + 0.4, V, X1 - 0.4, V + 0.5, "#e8e8e4"); g += R(X0 + 0.4, 4.8, X1 - 0.4, h.H - 0.5, SPIEGEL); }
    else g += fenster(X0 + 0.3, X1 - 0.3, 5.2, h.H - 0.4, h.fen, { sims: h.sims, laden: h.laden, blume: h.blume, rahmen: h.fach ? "#f4ead2" : undefined });
    if (h.dach === "giebel") g += fenster(X0 + 1.8, X1 - 1.8, h.H + 0.6, h.H + 2.8, 2, { fh: 1.4 });
    g += `<path d="M${r(bx(X0))} ${r(by(4.4))}H${r(bx(X1))}" stroke="${dunkel(h.wand, 0.78)}" stroke-width=".9"/>`;
    g += laden(X0, X1, { wand: h.wand, name: h.name, band: h.band, schrift: h.schrift, font: h.font, fs: h.fs, innen: h.innen, inhalt: INHALT[h.inhalt], rahmen: h.rahmen, sockel: h.sockel, markise: h.markise, tuer: h.tuer });
    if (h.extra) g += h.extra(X0, X1);
    /* Kontaktschatten am Fuß der Fassade */
    g += R(X0, -0.15, X1, 0.25, "#000", ' opacity=".18"');
    /* Außengastronomie: Tische, Stühle, Sonnenschirme vor der Tür */
    if (h.terrasse) for (let j = 0; j < h.terrasse.n; j++) {
      const Xc = X0 + (X1 - X0) * (j + 0.5) / h.terrasse.n, Z = ZB - 2.2, kk = F / Z, [tx, ty] = P(Xc, 0, Z);
      g += `<ellipse cx="${r(tx + 1)}" cy="${r(ty)}" rx="${r(0.9 * kk)}" ry=".6" fill="#000" opacity=".2"/>`;
      g += `<path d="M${r(tx - 0.8 * kk)} ${r(ty)}v${r(-0.45 * kk)}h${r(0.4 * kk)}v${r(-0.5 * kk)}M${r(tx + 0.8 * kk)} ${r(ty)}v${r(-0.45 * kk)}h${r(-0.4 * kk)}v${r(-0.5 * kk)}" stroke="${h.terrasse.stuhl}" stroke-width=".6" fill="none"/>`;
      g += `<rect x="${r(tx - 0.35 * kk)}" y="${r(ty - 0.75 * kk)}" width="${r(0.7 * kk)}" height=".6" fill="#ddd"/><path d="M${r(tx)} ${r(ty)}V${r(ty - 2.3 * kk)}" stroke="#777" stroke-width=".4"/>`;
      g += `<path d="M${r(tx - 1.1 * kk)} ${r(ty - 2.05 * kk)}Q${r(tx)} ${r(ty - 2.6 * kk)} ${r(tx + 1.1 * kk)} ${r(ty - 2.05 * kk)}Z" fill="${h.terrasse.schirm}"/>`;
    }
    const a = anker(bx((X0 + X1) / 2), by(Math.min(h.H, 12) - 3));
    const t = Object.assign({}, h.w, a, { tipp: "Antippen führt in diese Szene hinein." });
    teil(t, g);
  }
}

/* =====================================================================
   SEITENFRONTEN (Fluchtperspektive): links und rechts je vier Häuser
   ===================================================================== */
/* Tiefen so gewählt, dass jede Fassade gleich breit im Bild erscheint */
const xBild = [64, 48, 32, 16, 0];
const zSeite = xBild.map((x) => F * WX / (200 - x));
function seitenhaus(seite, i, h) {
  const z0 = zSeite[i], z1 = zSeite[i + 1], X = seite * WX;
  const Q = (u, v, x = X) => P(x, v, z0 + (z1 - z0) * u);            // u: 0 hinten … 1 vorne
  const flaeche = (u0, v0, u1, v1, f, extra = "") => `<path d="${quad(Q(u0, v0), Q(u1, v0), Q(u1, v1), Q(u0, v1))}" fill="${f}"${extra}/>`;
  let g = "";
  g += flaeche(0, 0, 1, h.H, h.wand);
  if (seite > 0) g += flaeche(0, 0, 1, h.H, "#1d2633", ' opacity=".14"');          // rechte Seite liegt im Schatten
  /* Dach: Traufe zum Platz, Dachfläche steigt nach außen */
  g += `<path d="${quad(Q(0, h.H), Q(1, h.H), Q(1, h.H + 3.4, X + seite * 0.8), Q(0, h.H + 3.4, X + seite * 0.8))}" fill="${h.d}"/>`;
  g += `<path d="M${pt(Q(0, h.H))}L${pt(Q(1, h.H))}" stroke="${dunkel(h.wand, 0.7)}" stroke-width=".7"/>`;
  g += `<path d="M${pt(Q(0, 0))}L${pt(Q(0, h.H))}" stroke="#000" stroke-width=".35" opacity=".3"/>`;
  /* Fenster der Obergeschosse */
  const n = h.fen || 2;
  for (let V = 5.2; V + 1.7 < h.H - 0.3; V += 3.2) for (let j = 0; j < n; j++) {
    const u = (j + 0.5) / n, du = 0.32 / n;
    g += flaeche(u - du - 0.02, V - 0.12, u + du + 0.02, V + 1.82, "#f4f1ea") + flaeche(u - du, V, u + du, V + 1.7, GLAS);
  }
  /* Erdgeschoss: Sockel, Schaufenster, Tür, Schriftband */
  g += flaeche(0, 0, 1, 4.3, h.sockel || dunkel(h.wand, 0.9));
  g += flaeche(0.06, 0.5, 0.66, 3.0, h.innen || GLASHELL) + flaeche(0.06, 0.5, 0.66, 3.0, SPIEGEL);
  if (h.inhalt) g += h.inhalt(Q, flaeche);
  g += flaeche(0.72, 0, 0.92, 2.7, "#3a3a3a") + flaeche(0.74, 0, 0.9, 2.55, GLAS);
  g += flaeche(0.03, 3.2, 0.97, 4.1, h.band);
  /* Schriftzug auf dem Band: affin auf die Fassade gelegt */
  { const ua = seite < 0 ? 0.92 : 0.08, ub = 1 - ua, a = Q(ua, 4.0), b = Q(ub, 4.0), c = Q(ua, 3.3), L = 40, Hh = 6;
    const m = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, (c[0] - a[0]) / Hh, (c[1] - a[1]) / Hh, a[0], a[1]].map((v) => Math.round(v * 1000) / 1000);
    g += `<text transform="matrix(${m.join(" ")})" x="20" y="5" font-size="5.2" text-anchor="middle" fill="${h.schrift || "#fff"}" font-family="Arial,sans-serif" font-weight="bold">${h.name}</text>`; }
  /* Markise */
  if (h.markise) g += `<path d="${quad(Q(0.04, 3.15), Q(0.68, 3.15), Q(0.68, 2.45, X - seite * 1.2), Q(0.04, 2.45, X - seite * 1.2))}" fill="${h.markise}"/>`;
  /* Nasenschild (Ausleger) quer zur Wand — zeigt frontal zum Betrachter */
  { const zc = z0 + (z1 - z0) * 0.5, a = P(X - seite * 0.25, 6.6, zc), b = P(X - seite * 1.55, 5.3, zc);
    const xl = Math.min(a[0], b[0]), w = Math.abs(b[0] - a[0]), hh = b[1] - a[1];
    const arm = P(X, 6.75, zc), armE = P(X - seite * 1.6, 6.75, zc);
    g += `<path d="M${pt(arm)}L${pt(armE)}" stroke="#2b2b2b" stroke-width=".5"/>`;
    g += `<rect x="${r(xl)}" y="${r(a[1])}" width="${r(w)}" height="${r(hh)}" rx=".6" fill="${h.nase || "#fff"}" stroke="#2b2b2b" stroke-width=".35"/>`;
    g += `<g transform="translate(${r(xl + w / 2)} ${r(a[1] + hh / 2)}) scale(${r(w / 10)})">${h.symbol}</g>`; }
  /* Waren vor der Tür (Gemüsekisten, Werbeaufsteller) */
  if (h.vorne) g += h.vorne(Q, z0, z1);
  const m = Q(0.5, 9);
  teil(Object.assign({}, h.w, anker(m[0], m[1]), { tipp: "Antippen führt in diese Szene hinein." }), g);
}
const SYM = {
  post: `<rect x="-5" y="-5" width="10" height="10" rx="1" fill="#f5c400"/><path d="M-3.4 .4c0 -2.4 2 -3.4 4 -2.6c1.6 .7 1.8 2.6 .6 3.4M-3.4 .4h5.6l1.6 1.4" stroke="#111" stroke-width=".9" fill="none"/>`,
  paket: `<path d="M-3.6 -1.6l3.6 -1.8l3.6 1.8v4l-3.6 1.8l-3.6 -1.8z" fill="#c9965a" stroke="#6b4a2a" stroke-width=".4"/><path d="M-3.6 -1.6l3.6 1.8l3.6 -1.8M0 .2v4" stroke="#6b4a2a" stroke-width=".4" fill="none"/>`,
  handy: `<rect x="-2" y="-4" width="4" height="8" rx=".8" fill="#222"/><rect x="-1.6" y="-3.2" width="3.2" height="5.8" fill="#4fa3e0"/>`,
  brille: `<g stroke="#111" stroke-width=".8" fill="#cfe7f2"><circle cx="-2.3" cy="0" r="1.9"/><circle cx="2.3" cy="0" r="1.9"/></g><path d="M-.5 -.3q.5 -.6 1 0" stroke="#111" stroke-width=".6" fill="none"/>`,
  wagen: `<path d="M-4 -2.4h1.4l1.2 4h4.4l1 -3h-6" stroke="#fff" stroke-width=".9" fill="none"/><circle cx="-.8" cy="2.6" r=".7" fill="#fff"/><circle cx="2.2" cy="2.6" r=".7" fill="#fff"/>`,
  sofa: `<path d="M-4 1.6v-2.4q0 -.8 .8 -.8h6.4q.8 0 .8 .8v2.4z" fill="#d9a066"/><rect x="-4.4" y="-.4" width="1.2" height="2.6" rx=".4" fill="#b97c45"/><rect x="3.2" y="-.4" width="1.2" height="2.6" rx=".4" fill="#b97c45"/><path d="M-3.6 2.2v.8M3.6 2.2v.8" stroke="#5a3a1f" stroke-width=".5"/>`,
  lolli: `<circle cx="0" cy="-1.4" r="2.6" fill="#e84393"/><path d="M-1.6 -1.4a1.6 1.6 0 1 1 1.6 1.6" stroke="#fff" stroke-width=".6" fill="none"/><path d="M0 1.2v3.4" stroke="#ddd" stroke-width=".7"/>`,
  apfel: `<circle cx="-.9" cy=".6" r="2.4" fill="#d63031"/><circle cx="1" cy=".6" r="2.4" fill="#e74c3c"/><path d="M0 -1.6q.4 -1.4 1.4 -1.8" stroke="#5a3a1f" stroke-width=".5" fill="none"/><ellipse cx="1.6" cy="-2.6" rx="1" ry=".5" fill="#4caf50"/>`,
};
/* Inhalte der Seiten-Schaufenster */
const seitInhalt = (farben, reihen = 3) => (Q, fl) => { let g = ""; for (let i = 0; i < reihen; i++) for (let j = 0; j < 5; j++) g += fl(0.09 + j * 0.11, 0.8 + i * 0.7, 0.17 + j * 0.11, 1.25 + i * 0.7, farben[(i + j) % farben.length]); return g; };
/* links (hinten → vorne) */
[
  { H: 17, wand: "#efe4cc", d: "#6b6f73", fen: 3, name: "Post", band: "#f5c400", schrift: "#111", symbol: SYM.post, nase: "#f5c400", inhalt: seitInhalt(["#f5c400", "#c9965a", "#fff"]),
    w: { id: "vi_post", de: "die Post", syl: "POST", it: "la posta", itSyl: "PO-sta", en: "post office", lupe: "postamt" } },
  { H: 15, wand: "#dfe3e6", d: "#8e3b2a", fen: 2, name: "Paketshop", band: "#c0392b", symbol: SYM.paket, inhalt: seitInhalt(["#c9965a", "#b07d48"]),
    w: { id: "vi_paketshop", de: "der Paketshop", syl: "Pa-KET-shop", it: "il punto pacchi", itSyl: "PUN-to PAC-chi", en: "parcel shop", lupe: "paketshop" } },
  { H: 16, wand: "#f1e9dc", d: "#5f5f63", fen: 2, name: "Handy", band: "#6c2bd9", symbol: SYM.handy, inhalt: seitInhalt(["#222", "#4fa3e0", "#ddd"]),
    w: { id: "vi_handyladen", de: "der Handyladen", syl: "HAN-dy-la-den", it: "il negozio di telefonia", itSyl: "ne-GO-zio di te-le-fo-NI-a", en: "phone shop", lupe: "handyladen" } },   // korrigiert: itSyl war unvollständig (alt „ne-GO-zio“)
  { H: 14, wand: "#e9d6b9", d: "#8e3b2a", fen: 2, name: "Optik", band: "#1f3b63", symbol: SYM.brille, inhalt: seitInhalt(["#111", "#8a6a45", "#c0392b"], 2),
    w: { id: "vi_optiker", de: "der Optiker", syl: "OP-ti-ker", it: "l'ottico", itSyl: "OT-ti-co", en: "optician", lupe: "optiker" } },
].forEach((h, i) => seitenhaus(-1, i, h));
/* rechts (hinten → vorne) */
[
  { H: 12, wand: "#e6e6e2", d: "#8a8f93", fen: 3, name: "Supermarkt", band: "#c0392b", symbol: SYM.wagen, nase: "#c0392b", innen: "#f4f4f0", inhalt: seitInhalt(["#e74c3c", "#f1c40f", "#27ae60", "#3498db"]),
    w: { id: "vi_supermarkt", de: "der Supermarkt", syl: "SU-per-markt", it: "il supermercato", itSyl: "su-per-mer-CA-to", en: "supermarket", lupe: "supermarkt" } },
  { H: 16, wand: "#d8c8b0", d: "#6e3426", fen: 2, name: "Möbel", band: "#7a4f2a", symbol: SYM.sofa, inhalt: seitInhalt(["#d9a066", "#8a6a45", "#f4efe6"], 2),
    w: { id: "vi_moebelhaus", de: "das Möbelhaus", syl: "MÖ-bel-haus", it: "il negozio di mobili", itSyl: "ne-GO-zio di MO-bi-li", en: "furniture store", lupe: "moebelhaus" } },
  { H: 15, wand: "#f3d9e4", d: "#8e3b2a", fen: 2, name: "Süßes", band: "#e84393", symbol: SYM.lolli, markise: "#f8b6d0", inhalt: seitInhalt(["#e84393", "#fdcb6e", "#00b894", "#74b9ff"]),
    w: { id: "vi_suessigkeiten", de: "der Süßwarenladen", syl: "SÜSS-wa-ren-la-den", it: "il negozio di dolci", itSyl: "ne-GO-zio di DOL-ci", en: "sweet shop", lupe: "suessigkeiten" } },
  { H: 13, wand: "#efe6cf", d: "#9c4a36", fen: 2, name: "Obst · Gemüse", band: "#2e7d32", symbol: SYM.apfel, markise: "#2e7d32", inhalt: seitInhalt(["#e74c3c", "#f39c12", "#27ae60"]),
    w: { id: "vi_obstgemuese", de: "der Obst- und Gemüseladen", syl: "OBST- und Ge-MÜ-se-la-den", it: "il fruttivendolo", itSyl: "frut-ti-VEN-do-lo", en: "greengrocer", lupe: "obstgemuese" },
    vorne: (Q) => { let g = ""; const farbe = ["#e74c3c", "#f39c12", "#27ae60", "#8e44ad"]; for (let j = 0; j < 4; j++) { const u = 0.1 + j * 0.15, a = P(WX - 0.3, 0, 0), _ = a; const p0 = Q(u, 0, WX - 0.4), p1 = Q(u + 0.12, 0, WX - 0.4), p2 = Q(u + 0.12, 0.9, WX - 0.4), p3 = Q(u, 0.9, WX - 0.4); g += `<path d="${quad(p0, p1, p2, p3)}" fill="#b5835a"/><path d="M${pt(p3)}L${pt(p2)}" stroke="${farbe[j]}" stroke-width="2.2"/>`; } return g; } },
].forEach((h, i) => seitenhaus(1, i, h));

/* =====================================================================
   AUF DEM PLATZ: Brunnen, Laterne, Kiosk, Wochenmarkt, Fahrrad, Passantin
   ===================================================================== */
const kZ = (Z) => F / Z;
{
  /* DER BRUNNEN — Marktbrunnen: achteckiges Becken, Säule mit Figur */
  const Z = 40, [cx, gy] = P(0, 0, Z), k = kZ(Z);
  let g = schatten(cx + 3, gy, 16, 2.4, 0.3);
  g += `<path d="M${r(cx - 2.2 * k)} ${r(gy)}v${r(-0.8 * k)}h${r(4.4 * k)}v${r(0.8 * k)}z" fill="${S.lg("becken", [[0, "#cfc6b4"], [1, "#a69c88"]], 0, 0, 1, 0)}"/>`;
  g += `<ellipse cx="${r(cx)}" cy="${r(gy - 0.8 * k)}" rx="${r(2.2 * k)}" ry="${r(0.45 * k)}" fill="#e2dccf"/><ellipse cx="${r(cx)}" cy="${r(gy - 0.8 * k)}" rx="${r(1.95 * k)}" ry="${r(0.35 * k)}" fill="#6fa4c0"/>`;
  g += `<rect x="${r(cx - 0.22 * k)}" y="${r(gy - 3.4 * k)}" width="${r(0.44 * k)}" height="${r(2.6 * k)}" fill="${S.lg("saeule", [[0, "#e4dccb"], [1, "#a99d86"]], 0, 0, 1, 0)}"/>`;
  g += `<ellipse cx="${r(cx)}" cy="${r(gy - 2.4 * k)}" rx="${r(0.9 * k)}" ry="${r(0.22 * k)}" fill="#d6cdb9"/>`;
  g += `<path d="M${r(cx - 0.6 * k)} ${r(gy - 2.35 * k)}q${r(-0.6 * k)} ${r(0.4 * k)} ${r(-0.9 * k)} ${r(1.4 * k)}M${r(cx + 0.6 * k)} ${r(gy - 2.35 * k)}q${r(0.6 * k)} ${r(0.4 * k)} ${r(0.9 * k)} ${r(1.4 * k)}" stroke="#d6ecf5" stroke-width=".7" fill="none" opacity=".9"/>`;
  /* Figur (Bronze, grün patiniert) */
  g += `<path d="M${r(cx - 0.25 * k)} ${r(gy - 3.4 * k)}l${r(0.05 * k)} ${r(-1.2 * k)}q${r(0.2 * k)} ${r(-0.35 * k)} ${r(0.4 * k)} 0l${r(0.05 * k)} ${r(1.2 * k)}z" fill="#4f7a6a"/><circle cx="${r(cx)}" cy="${r(gy - 4.75 * k)}" r="${r(0.18 * k)}" fill="#4f7a6a"/>`;
  teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: cx, y: gy, tipp: "Der Marktbrunnen steht seit Jahrhunderten mitten auf dem Platz." }, g);
}
{
  /* DER KIOSK — Zeitungskiosk (Pavillon) links auf dem Platz */
  const Z = 24, X = -9.5, k = kZ(Z), [cx, gy] = P(X, 0, Z);
  const w = 3.6 * k, h = 2.7 * k;
  let g = schatten(cx + 4, gy, w * 0.6, 2.6, 0.32);
  g += `<rect x="${r(cx - w / 2)}" y="${r(gy - h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("kioskwand", [[0, "#2f5d47"], [1, "#24483a"]])}"/>`;
  /* Verkaufsfenster mit Zeitungen und Zeitschriften */
  g += `<rect x="${r(cx - w * 0.42)}" y="${r(gy - h * 0.82)}" width="${r(w * 0.84)}" height="${r(h * 0.42)}" fill="#e9e3d2"/>`;
  const f = ["#c0392b", "#f1c40f", "#2980b9", "#fff", "#8e44ad", "#16a085", "#e67e22"];
  for (let i = 0; i < 12; i++) g += `<rect x="${r(cx - w * 0.4 + i * w * 0.067)}" y="${r(gy - h * 0.8 + (i % 2) * 2)}" width="${r(w * 0.058)}" height="${r(h * 0.16)}" fill="${f[i % 7]}"/>`;
  g += `<rect x="${r(cx - w * 0.42)}" y="${r(gy - h * 0.82)}" width="${r(w * 0.84)}" height="${r(h * 0.42)}" fill="${SPIEGEL}"/>`;
  g += `<rect x="${r(cx - w * 0.44)}" y="${r(gy - h * 0.4)}" width="${r(w * 0.88)}" height="1.6" fill="#7a8c84"/>`;
  /* Zeitungsständer vorne, Dach mit Überstand und Schild */
  for (let i = 0; i < 3; i++) g += `<rect x="${r(cx - w * 0.36 + i * w * 0.26)}" y="${r(gy - h * 0.33)}" width="${r(w * 0.2)}" height="${r(h * 0.3)}" fill="#f4f1ea" stroke="#9aa" stroke-width=".3"/><path d="M${r(cx - w * 0.34 + i * w * 0.26)} ${r(gy - h * 0.26)}h${r(w * 0.16)}M${r(cx - w * 0.34 + i * w * 0.26)} ${r(gy - h * 0.2)}h${r(w * 0.12)}" stroke="#555" stroke-width=".35"/>`;
  g += `<path d="M${r(cx - w / 2 - 3)} ${r(gy - h)}L${r(cx - w / 2 + 1)} ${r(gy - h - 4)}H${r(cx + w / 2 - 1)}L${r(cx + w / 2 + 3)} ${r(gy - h)}Z" fill="#1d3d2f"/>`;
  g += `<rect x="${r(cx - w * 0.3)}" y="${r(gy - h - 3.6)}" width="${r(w * 0.6)}" height="3.2" rx=".4" fill="#f5c400"/><text x="${r(cx)}" y="${r(gy - h - 1.2)}" font-size="2.6" text-anchor="middle" fill="#1d3d2f" font-family="Arial" font-weight="bold">KIOSK</text>`;
  teil({ id: "vi_kiosk", de: "der Kiosk", syl: "KI-osk", it: "il chiosco", itSyl: "CHIO-sco", en: "kiosk", ...anker(cx, gy - h * 0.6), lupe: "kiosk", tipp: "Antippen führt in diese Szene hinein." }, g);
}
{
  /* DIE STRASSENLATERNE — historische Laterne auf dem Platz */
  const Z = 21, X = -3, k = kZ(Z), [cx, gy] = P(X, 0, Z);
  let g = schatten(cx + 1.5, gy, 3, 0.8, 0.3);
  g += `<rect x="${r(cx - 0.6)}" y="${r(gy - 4.2 * k)}" width="1.2" height="${r(4.2 * k)}" fill="#26302c"/><rect x="${r(cx - 1.4)}" y="${r(gy - 0.6 * k)}" width="2.8" height="${r(0.6 * k)}" rx=".5" fill="#26302c"/>`;
  g += `<path d="M${r(cx - 2.4)} ${r(gy - 4.2 * k)}h4.8l1 -5h-6.8z" fill="#fff6d6" stroke="#26302c" stroke-width=".6"/><path d="M${r(cx - 3.8)} ${r(gy - 4.2 * k - 5)}h7.6l-3.8 -2.6z" fill="#26302c"/>`;
  teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: cx, y: gy, oben: true }, g);
}
{
  /* DER WOCHENMARKT — zwei Marktstände mit Markisen (rechts auf dem Platz) */
  const Z = 18, k = kZ(Z);
  let g = "";
  const stand = (X0, b, a, c, ware) => {
    const [x0, gy] = P(X0, 0, Z), x1 = P(X0 + b, 0, Z)[0], tisch = 0.9 * k, dachH = 2.4 * k;
    let s = schatten((x0 + x1) / 2 + 3, gy, (x1 - x0) / 2, 2.6, 0.3);
    s += `<path d="M${r(x0 + 1)} ${r(gy)}v${r(-dachH)}M${r(x1 - 1)} ${r(gy)}v${r(-dachH)}" stroke="#ddd" stroke-width="1"/>`;
    s += `<rect x="${r(x0)}" y="${r(gy - tisch)}" width="${r(x1 - x0)}" height="${r(tisch)}" fill="#7b5a3a"/><rect x="${r(x0)}" y="${r(gy - tisch)}" width="${r(x1 - x0)}" height="2" fill="#a07a50"/>`;
    /* Kisten mit Ware, leicht schräg zur Kundschaft */
    const n = ware.length, kw = (x1 - x0 - 2) / n;
    ware.forEach((wf, j) => {
      const kx = x0 + 1 + j * kw;
      s += `<path d="M${r(kx + 0.4)} ${r(gy - tisch)}l1 -5h${r(kw - 2.8)}l1 5z" fill="#c49a6c"/>`;
      for (let q = 0; q < 6; q++) s += `<circle cx="${r(kx + 2 + (q % 3) * (kw - 4) / 2)}" cy="${r(gy - tisch - 3.6 - Math.floor(q / 3) * 1.6)}" r="1.4" fill="${wf}"/>`;
      s += `<rect x="${r(kx + kw / 2 - 2)}" y="${r(gy - tisch + 1.2)}" width="4" height="2.2" fill="#111"/><text x="${r(kx + kw / 2)}" y="${r(gy - tisch + 2.9)}" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial">${(1.2 + j * 0.7).toFixed(2).replace(".", ",")}</text>`;
    });
    /* Markise, gestreift */
    const m = 6; for (let j = 0; j < m; j++) { const xa = x0 - 1 + (x1 - x0 + 2) * j / m, xb = x0 - 1 + (x1 - x0 + 2) * (j + 1) / m; s += `<path d="M${r(xa)} ${r(gy - dachH)}L${r(xa + 1)} ${r(gy - dachH - 6)}H${r(xb + 1)}L${r(xb)} ${r(gy - dachH)}Z" fill="${j % 2 ? c : a}"/>`; }
    s += `<path d="M${r(x0 - 1)} ${r(gy - dachH)}H${r(x1 + 1)}" stroke="${dunkel(a, 0.6)}" stroke-width=".6"/>`;
    return s;
  };
  g += stand(3.4, 3.4, "#2e7d32", "#f4f1ea", ["#e74c3c", "#f39c12", "#7cb342", "#c0392b"]);
  g += stand(7.4, 3.4, "#c0392b", "#f4f1ea", ["#f1c40f", "#8e44ad", "#27ae60", "#e67e22"]);
  const [mx, my] = P(7, 2.2, Z);
  teil({ id: "vi_wochenmarkt", de: "der Wochenmarkt", syl: "WO-chen-markt", it: "il mercato settimanale", itSyl: "mer-CA-to set-ti-ma-NA-le", en: "weekly market", ...anker(mx, my), lupe: "wochenmarkt", tipp: "Antippen führt in diese Szene hinein." }, g);
}
{
  /* DAS FAHRRAD — am Fahrradständer vor dem Kiosk */
  const Z = 16, X = -7.4, k = kZ(Z), [cx, gy] = P(X, 0, Z);
  const rr = 0.34 * k;
  let g = schatten(cx, gy, 1.1 * k, 1, 0.3);
  g += `<g stroke="#1f1f1f" stroke-width=".8" fill="none"><circle cx="${r(cx - 0.55 * k)}" cy="${r(gy - rr)}" r="${r(rr)}"/><circle cx="${r(cx + 0.55 * k)}" cy="${r(gy - rr)}" r="${r(rr)}"/></g>`;
  g += `<path d="M${r(cx - 0.55 * k)} ${r(gy - rr)}L${r(cx - 0.1 * k)} ${r(gy - 0.75 * k)}H${r(cx + 0.38 * k)}L${r(cx + 0.55 * k)} ${r(gy - rr)}M${r(cx - 0.1 * k)} ${r(gy - 0.75 * k)}L${r(cx)} ${r(gy - rr)}L${r(cx + 0.38 * k)} ${r(gy - 0.75 * k)}M${r(cx + 0.4 * k)} ${r(gy - 0.75 * k)}l${r(0.06 * k)} ${r(-0.22 * k)}h${r(0.12 * k)}" stroke="#2e86c1" stroke-width="1" fill="none"/>`;
  g += `<path d="M${r(cx - 0.2 * k)} ${r(gy - 0.82 * k)}h${r(0.24 * k)}" stroke="#222" stroke-width="1.4" stroke-linecap="round"/>`;
  g += `<path d="M${r(cx - 0.9 * k)} ${r(gy)}v${r(-0.5 * k)}q0 -2 2 -2h${r(1.8 * k - 4)}q2 0 2 2v${r(0.5 * k)}" stroke="#9aa3aa" stroke-width=".9" fill="none"/>`;
  teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: cx, y: gy }, g);
}
{
  /* DIE PASSANTIN — mit Einkaufstasche, geht über den Platz */
  const Z = 13.5, X = 1.4, k = kZ(Z), [cx, gy] = P(X, 0, Z);
  const m = B.mensch({ id: "vin_pass", geschlecht: "w", pose: "kontrapost", blick: 60, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "senf" }, jacke: { stueck: "jacke", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68 * k);
  teil({ id: "passantin", de: "die Passantin", syl: "Pas-SAN-tin", it: "la passante", itSyl: "pas-SAN-te", en: "passer-by", x: cx, y: gy, kunst: "",
    tipp: "Die Passantin geht einkaufen: erst zum Bäcker, dann auf den Markt." }, schatten(4, -0.4, 9, 1.6, 0.3).replace(/cx="4"/, `cx="${r(cx + 4)}"`).replace(/cy="-0.4"/, `cy="${r(gy - 0.4)}"`) + `<g transform="translate(${r(cx)} ${r(gy)})">${m.svg}</g>`);
}

/* Licht über allem: Sonne von links oben, warmer Dunst */
S.davor(`<rect width="400" height="260" fill="${S.rg("sonne", [[0, "#fff4d6", 0.18], [1, "#fff4d6", 0]], 0.15, 0.1, 0.8)}"/>`);

console.log(S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_innenstadt.js")));
