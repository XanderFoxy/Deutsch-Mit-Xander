#!/usr/bin/env node
/* =====================================================================
   DER ZOO (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   Diese Datei enthält oben den TIER-BAUKASTEN (realistische Tiere in
   Seitenansicht, echte Proportionen in Dezimetern), den auch zoo2,
   tiere_welt und meer benutzen: require("./zoo.js").tierBaukasten(S).
   Darunter wird die Szene „Der Zoo“ gebaut (nur wenn die Datei direkt
   gestartet wird).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = B;
const r = B.r;

/* =====================================================================
   TIER-BAUKASTEN
   Alle Tiere schauen nach rechts (dir = -1 spiegelt), stehen mit den
   Füßen auf y = 0 und sind in DEZIMETERN gezeichnet (1 = 10 cm). Der
   Aufruf bekommt m = Einheiten je Meter der Szene an dieser Tiefe:
   so stimmen die Größenverhältnisse von selbst (Giraffe 5 m, Elefant
   3,2 m Schulterhöhe, Nashorn 1,7 m, Zebra 1,3 m, Löwe 1,2 m …).
   ===================================================================== */
/* Das alte Zebra aus der alten Bilderwelt (szenen/zoo.js, eingefroren – Sonde 840) holen und für die neue Szene
   aufbereiten (siehe T.zebra). praefix: Szenen-Präfix für alle ids. Liefert SVG in alten Einheiten (≈ dm, Blick rechts,
   Hufe auf y = 0). */
let ALT_ZEBRA = null;
function altesZebra(praefix) {
  if (!ALT_ZEBRA) {
    const fs = require("fs");
    const datei = path.join(__dirname, "../../../szenen/zoo.js");
    const w = {}; new Function("window", fs.readFileSync(datei, "utf8"))(w);
    const t = ((w.DMA_SZENE && w.DMA_SZENE.zoo && w.DMA_SZENE.zoo.teile) || []).find((q) => q.id === "zebra");
    if (!t || !t.kunst) throw new Error("altesZebra: Teil „zebra“ fehlt in szenen/zoo.js");
    let k = t.kunst;
    /* Bodenschatten (Kulissen-Verlauf der alten Szene) und eigener Kontaktschatten heraus */
    k = k.replace(/<ellipse class="bw-bodenschatten"[^>]*\/>/g, "");
    k = k.replace(/<defs><radialGradient id="bs\d+">[\s\S]*?<\/defs><ellipse [^>]*fill="url\(#bs\d+\)"\/>/, "");
    /* Farbfilter (Sättigung 0,888, dann 0,924·c + 0,054) als feste Farben einrechnen */
    const filt = /<defs><filter id="(tf\d+)"[\s\S]*?<\/filter><\/defs>/.exec(k);
    if (filt) {
      k = k.replace(filt[0], "").replace(`<g filter="url(#${filt[1]})">`, "<g>");
      const s = 0.888, M = [[0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s], [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s], [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s]];
      k = k.replace(/#([0-9a-fA-F]{6})\b/g, (_, h) => {
        const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
        return "#" + M.map((z) => Math.round(Math.min(1, Math.max(0, 0.924 * (z[0] * c[0] + z[1] * c[1] + z[2] * c[2]) + 0.054)) * 255).toString(16).padStart(2, "0")).join("");
      });
    }
    /* Pfadzahlen auf 0,1 runden (nur Geometrie, keine Deckkraft/Verlaufsstopps) */
    const rund = (v) => v.replace(/-?\d*\.\d+/g, (x) => String(Math.round(+x * 10) / 10));
    k = k.replace(/ d="([^"]*)"/g, (_, d) => ` d="${rund(d)}"`).replace(/ (cx|cy|rx|ry)="(-?[\d.]+)"/g, (_, a, v) => ` ${a}="${rund(v)}"`);
    ALT_ZEBRA = k;
  }
  /* ids eindeutig machen */
  return ALT_ZEBRA.replace(/ id="([^"]+)"/g, ` id="${praefix}_$1"`).replace(/url\(#([^)]+)\)/g, `url(#${praefix}_$1)`).replace(/href="#([^"]+)"/g, `href="#${praefix}_$1"`);
}

function tierBaukasten(S) {
  const done = new Set();
  const einmal = (n, f) => { if (!done.has(n)) { done.add(n); f(); } };
  const rnd = zufall(4711);
  const f = (n) => r(n);
  /* Gruppe in Szeneneinheiten: Dezimeter → Einheiten (k = m / 10) */
  const gr = (m, dir, inner, extra = "") => `<g transform="scale(${(dir * m / 10).toFixed(4)} ${(m / 10).toFixed(4)})"${extra}>${inner}</g>`;
  /* Volumen: oben Licht, unten Schatten — über jede Körperform gelegt */
  const VOL = () => LG("tw_vol", [[0, "#fff", 0.2], [0.4, "#fff", 0], [0.62, "#000", 0], [1, "#000", 0.38]]);
  const VOLX = () => LG("tw_volx", [[0, "#000", 0.16], [0.35, "#000", 0], [0.75, "#fff", 0.06], [1, "#000", 0.12]], 0, 0, 1, 0);
  const koerper = (d, fuell, umriss = "#000", extra = "") => `<path d="${d}" fill="${fuell}"/><path d="${d}" fill="${VOL()}"/><path d="${d}" fill="${VOLX()}" stroke="${umriss}" stroke-opacity=".35" stroke-width=".12"${extra}/>`;
  const auge = (x, y, rr = 0.35, iris = "#1a0f08") => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr * 1.15)}" ry="${f(rr)}" fill="${iris}"/><circle cx="${f(x + rr * 0.35)}" cy="${f(y - rr * 0.35)}" r="${f(rr * 0.32)}" fill="#fff" opacity=".85"/>`;
  /* Verläufe nur einmal anlegen (sonst doppelte Einträge in <defs>) */
  const LG = (name, ...a) => { if (!done.has("lg" + name)) { done.add("lg" + name); return S.lg(name, ...a); } return `url(#${S.id(name)})`; };
  const RG = (name, ...a) => { if (!done.has("rg" + name)) { done.add("rg" + name); return S.rg(name, ...a); } return `url(#${S.id(name)})`; };
  /* Verlauf in Dezimeter-Koordinaten des Tieres: so gehen Rumpf und Beine nahtlos ineinander über */
  const U = (name, stops, y1, y2) => LG(name, stops, 0, y1, 0, y2, ' gradientUnits="userSpaceOnUse"');
  const VOLH = (h) => U("tw_volh" + Math.round(h), [[0, "#fff", 0.24], [0.3, "#fff", 0.04], [0.55, "#000", 0], [0.8, "#000", 0.18], [1, "#000", 0.26]], -h, 0);
  /* Gliedmaße aus Gelenken [x, y, Breite hinten, Breite vorn], von oben nach unten, weich verbunden */
  const glied = (p) => {
    const L = p.map((q) => [q[0] - q[2], q[1]]), R = p.map((q) => [q[0] + q[3], q[1]]).reverse();
    const zug = (a) => { let s = ""; for (let i = 1; i < a.length - 1; i++) { const mx = (a[i][0] + a[i + 1][0]) / 2, my = (a[i][1] + a[i + 1][1]) / 2; s += `Q${f(a[i][0])} ${f(a[i][1])} ${f(mx)} ${f(my)} `; } return s + `L${f(a[a.length - 1][0])} ${f(a[a.length - 1][1])} `; };
    return `M${f(L[0][0])} ${f(L[0][1])} ${zug(L)}L${f(R[0][0])} ${f(R[0][1])} ${zug(R)}Z`;
  };
  const versch = (p, dx) => p.map(([x, y, a, b]) => [x + dx, y, a, b]);
  /* Huf: dunkle Kappe unten am Bein */
  const huf = (p, farbe = "#2b2420", h = 0.55) => { const q = p[p.length - 1]; return `<path d="M${f(q[0] - q[2] * 0.82)} ${f(-h)} L${f(q[0] + q[3] * 0.8)} ${f(-h)} L${f(q[0] + q[3])} 0 L${f(q[0] - q[2])} 0 Z" fill="${farbe}"/>`; };
  /* Fläche zeichnen: Grundfarbe + Licht (nahtlos über alle Teile) */
  const fl = (dd, fuell, h, dunkel = 0) => `<path d="${dd}" fill="${fuell}"/><path d="${dd}" fill="${VOLH(h)}"/>` + (dunkel ? `<path d="${dd}" fill="#000" opacity="${dunkel}"/>` : "");
  const linie = (d, farbe = "#000", o = 0.25, w = 0.14) => `<path d="${d}" stroke="${farbe}" stroke-opacity="${o}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  /* Netz-Fleckenmuster (Giraffe): verzerrtes Gitter, Flecken = geschrumpfte Vierecke */
  const netzMuster = (name, c, N, farben, spalt, seed) => {
    const z = zufall(seed), jx = [], jy = [];
    for (let i = 0; i < N; i++) { jx.push([]); jy.push([]); for (let j = 0; j < N; j++) { jx[i].push((z() - 0.5) * c * 0.55); jy[i].push((z() - 0.5) * c * 0.55); } }
    const P = (i, j) => { const a = ((i % N) + N) % N, b = ((j % N) + N) % N; return [i * c + jx[a][b], j * c + jy[a][b]]; };
    let g = "";
    for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) {
      const q = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)];
      const mx = q.reduce((s, p) => s + p[0], 0) / 4, my = q.reduce((s, p) => s + p[1], 0) / 4;
      const pts = q.map(([x, y]) => [mx + (x - mx) * (1 - spalt), my + (y - my) * (1 - spalt)]);
      const fa = farben[(((i % farben.length) + farben.length) + ((j * 2) % farben.length)) % farben.length];
      g += `<path d="M${pts.map(([x, y]) => f(x) + " " + f(y)).join(" L")} Z" fill="${fa}" stroke="${fa}" stroke-width="${f(c * 0.12)}" stroke-linejoin="round"/>`;
    }
    S.def(`<pattern id="${S.id(name)}" patternUnits="userSpaceOnUse" width="${f(N * c)}" height="${f(N * c)}">${g}</pattern>`);
    return `url(#${S.id(name)})`;
  };
  /* Rosetten (Leopard) */
  const rosetten = (name, grund) => {
    const z = zufall(77), c = 1.15;
    let g = "";
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const x = i * c + (j % 2) * c / 2 + (z() - 0.5) * 0.25, y = j * c + (z() - 0.5) * 0.25, rr = 0.36 + z() * 0.1;
      g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr * 0.75)}" fill="${grund}"/>`;
      for (let a = 0; a < 5; a++) {
        const w = a * 1.257 + z() * 0.4;
        g += `<circle cx="${f(x + Math.cos(w) * rr)}" cy="${f(y + Math.sin(w) * rr)}" r="${f(0.13 + z() * 0.06)}" fill="#2a1a0c"/>`;
      }
    }
    S.def(`<pattern id="${S.id(name)}" patternUnits="userSpaceOnUse" width="${f(5 * c)}" height="${f(5 * c)}">${g}</pattern>`);
    return `url(#${S.id(name)})`;
  };

  const T = {};

  /* ---------------- GIRAFFE (Netzgiraffe), 5 m hoch ---------------- */
  T.giraffe = (m, dir = 1) => {
    einmal("gir", () => {
      netzMuster("tw_girnetz", 2.0, 4, ["#8a4a1e", "#7d4219", "#94521f", "#83461c"], 0.2, 31);
      S.def(`<clipPath id="${S.id("tw_girclip")}"><rect x="-30" y="-60" width="60" height="48.5"/></clipPath>`);
    });
    const NETZ = `url(#${S.id("tw_girnetz")})`, CREME = U("tw_gircreme", [[0, "#f3e4c4"], [1, "#dcc69c"]], -50, 0);
    const vn = [[5.2, -21, 2.2, 1.8], [5.2, -17.4, 1.4, 1.3], [5.5, -13, 0.75, 0.8], [5.6, -10.6, 0.78, 0.78], [5.6, -9, 0.5, 0.55], [5.7, -1.4, 0.6, 0.62], [5.85, -0.6, 0.5, 0.56], [5.95, 0, 0.72, 0.85]];
    const hn = [[-7.8, -23.5, 2.8, 2.2], [-7.6, -19.5, 2.7, 1.7], [-8.3, -14, 1.25, 0.95], [-8.5, -10.6, 1.05, 0.55], [-8.2, -8.4, 0.5, 0.55], [-7.9, -1.4, 0.6, 0.62], [-7.75, -0.6, 0.5, 0.56], [-7.6, 0, 0.72, 0.85]];
    const vf = versch(vn, -2.2), hf = versch(hn, -1.4);
    const leib = "M-10.5 -25.4 C-6 -27.6 0 -29.6 4 -31.6 C8 -36 11.4 -42 13.2 -46.6 Q13.7 -48.3 15.3 -48 L19.8 -45.4 Q20.9 -44.8 20.3 -43.9 Q19.4 -43.1 17.6 -43.6 Q15.6 -43.8 14.9 -44.4 C13.6 -40 10.6 -30 8.4 -23.4 Q7.6 -20 6.2 -18.6 C3 -17.3 -3 -17.1 -6.4 -18 Q-8.4 -18.6 -9.8 -17.6 C-11.6 -19 -11.9 -23.4 -10.5 -25.4 Z";
    const netz = (d) => `<path d="${d}" fill="${NETZ}" clip-path="url(#${S.id("tw_girclip")})"/>`;
    let k = "";
    for (const p of [vf, hf]) { const d = glied(p); k += `<path d="${d}" fill="${CREME}"/>` + netz(d) + `<path d="${d}" fill="#000" opacity=".3"/>` + huf(p); }
    k += `<path d="M-10.6 -24.6 Q-11.6 -20 -11.4 -14.2" stroke="#b9925a" stroke-width=".45" fill="none"/><path d="M-11.4 -15.2 q-.8 1.6 -.2 3.6 q.6 .4 .9 -.2 q.2 -2 -.2 -3.4 Z" fill="#1d140c"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${CREME}"/>` + netz(d);
    k += `<path d="M14.6 -47.2 Q15.4 -48 16.6 -47.4 L19.8 -45.4 Q20.9 -44.8 20.3 -43.9 Q19.4 -43.1 17.6 -43.6 Q15.6 -43.8 14.9 -44.4 Z" fill="#d9b98a"/>`;
    k += `<path d="M18.6 -45.4 Q20.2 -45.2 20.5 -44.2 Q19.6 -43.4 18.2 -43.7 Z" fill="#7a5a3d" opacity=".55"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(50)}"/>`;
    k += huf(vn) + huf(hn);
    /* Muskeln: Schulter, Oberschenkel, Bauchlinie */
    k += linie("M6.6 -27 Q4.4 -23 5.4 -19") + linie("M-6 -24.6 Q-4.6 -21 -6 -18.4") + linie("M-9.4 -13.4 l-.4 1.4", "#000", 0.3) + linie("M5.2 -11.4 l.5 .8", "#000", 0.25);
    /* Mähne, Ohr, Hörnchen (Ossikone), Auge, Nüster */
    k += `<path d="M4.4 -31.4 C8.2 -35.6 11.2 -41.4 13 -46.2 L13.5 -45.8 C11.8 -41 8.8 -35.2 5 -31 Z" fill="#6e3d18"/>`;
    k += `<path d="M14.6 -46.9 q-1.8 -.9 -2.6 -.2 q1 .9 2.6 .9 Z" fill="#cfa877" stroke="#7c5634" stroke-width=".1"/>`;
    k += `<path d="M14.9 -47.8 L14.6 -50.2 M16 -47.6 L15.9 -50" stroke="#a37a4c" stroke-width=".55" stroke-linecap="round"/><circle cx="14.6" cy="-50.3" r=".42" fill="#2a1a0e"/><circle cx="15.9" cy="-50.1" r=".42" fill="#2a1a0e"/>`;
    k += auge(16.9, -46.3, 0.42) + `<path d="M16.3 -46.9 q.6 -.4 1.3 0" stroke="#3a2412" stroke-width=".12" fill="none"/>`;
    k += `<ellipse cx="19.9" cy="-44.9" rx=".35" ry=".18" fill="#2a1a0e"/><path d="M18.8 -43.9 q.8 .2 1.4 -.1" stroke="#3a2412" stroke-width=".12" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- ZEBRA (Steppenzebra), Schulterhöhe 1,3 m ----------------
     XANDER (Funk 302), wörtlich: „bei dem Zebra sind die Streifen total unrealistisch da hatten wir die alte Version des
     Zebras da hatten wir das schon mal gelöst und die war viel besser wenn du das nicht authentisch hinbekommst dann nimm
     das alte Zebra wieder“.
     Darum zeichnet T.zebra wieder das ALTE Zebra der alten Bilderwelt (szenen/zoo.js, Stand 17.09.): senkrechte
     Rumpfstreifen, die nach unten spitz auslaufen, waagerechte Bänder über der Keule, Querstreifen an den Beinen,
     gestreifte Stehmähne, Halsstreifen quer zum Hals, dunkles Maul. Die Baukasten-Fassung (852) hatte gleich breite
     senkrechte Balken über den ganzen Rumpf und waagerechte Linien am Bauch („Strichcode“) – sie ist zurückgenommen.
     Die Zeichnung kommt unverändert aus der eingefrorenen alten Szene (Sonde 840 hält sie fest), nur: Bodenschatten
     heraus (die Szene legt ihren eigenen), der Farbfilter der alten Szene als feste Farben eingerechnet (kein Filter in
     der Szene), Pfadzahlen auf 0,1 gerundet (≈ 0,07 Szeneneinheiten, unsichtbar), ids mit Szenen-Präfix. Sie steht EINMAL
     in den defs, jedes Zebra ist ein <use>. Maßstab: alte Einheiten ≈ dm, × 0,92 → Widerrist ≈ 1,4 m wie vorher. */
  T.zebra = (m, dir = 1) => {
    einmal("zebalt", () => S.def(`<g id="${S.id("tw_zebalt")}" transform="translate(1.25 0) scale(.92)">${altesZebra(S.id("za"))}</g>`));
    return gr(m, dir, `<use href="#${S.id("tw_zebalt")}"/>`);
  };

  /* ---------------- ELEFANT (Afrikanischer), Schulterhöhe 3,2 m ---------------- */
  T.elefant = (m, dir = 1) => {
    const HAUT = U("tw_ele", [[0, "#a29c96"], [1, "#7c766f"]], -34, 0);
    const leib = "M-14 -28.5 C-9 -31.6 -2 -31.4 4 -31.6 Q8 -34.4 11.2 -33.8 C13.8 -33.2 15.2 -29 15.3 -24 C15.6 -17 16.6 -10 17.5 -4.2 Q17.9 -2.4 16.9 -2.2 Q16 -2.4 16.3 -3.4 C15.4 -8 14.2 -15 13 -20.4 Q12.2 -20.2 11.6 -21 C10.4 -19.8 9.6 -18.4 8.6 -16.4 C4 -13.4 -6 -12.8 -11 -14 C-15 -16 -15.9 -24 -14 -28.5 Z";
    const vn = [[7.2, -20, 3.0, 2.8], [7.2, -14, 2.6, 2.5], [7.3, -8, 2.2, 2.2], [7.3, -2.2, 2.15, 2.2], [7.4, 0, 2.4, 2.5]];
    const hn = [[-9.4, -23, 3.8, 3.2], [-9.6, -15, 3.1, 2.8], [-9.4, -8, 2.2, 2.3], [-9.3, -2.2, 2.2, 2.2], [-9.2, 0, 2.45, 2.5]];
    const vf = versch(vn, -3), hf = versch(hn, 2.6);
    let k = "";
    for (const p of [vf, hf]) k += fl(glied(p), HAUT, 34, 0.25);
    k += `<path d="M-14.3 -27 Q-15.8 -22 -15.4 -16" stroke="#7b746e" stroke-width=".45" fill="none"/><path d="M-15.6 -16.4 l-.3 1.6 l.8 0 l-.1 -1.6 Z" fill="#2a2623"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${HAUT}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(34)}"/>`;
    for (const x of [-9.2, 7.4]) k += `<path d="M${x - 2} -.6 q.5 -.6 1 0 M${x - .4} -.6 q.5 -.6 1 0 M${x + 1.2} -.6 q.5 -.6 1 0" stroke="#d8d2c6" stroke-width=".35" fill="none"/>`;
    for (let i = 0; i < 12; i++) { const t = i / 11, y = -22 + t * 18.5, x0 = 13.3 + t * 2.4; k += linie(`M${f(x0)} ${f(y)} q${f(0.9)} ${f(-0.3)} ${f(1.8)} ${f(0.1)}`, "#3a3531", 0.45); }
    for (const x of [-9.3, 7.3]) for (let i = 0; i < 5; i++) k += linie(`M${f(x - 2)} ${f(-3 - i * 2.2)} q2 .6 4 0`, "#3a3531", 0.3, 0.12);
    k += linie("M-11 -21 Q-9 -17 -10 -14") + linie("M-6 -27 Q-3.6 -23 -4.6 -14.6", "#000", 0.18) + linie("M-13.6 -20 Q-12 -18 -12.6 -15", "#000", 0.2);
    k += `<path d="M12.3 -21.4 Q14.4 -19.2 16.8 -18.4 Q14.6 -18 12 -20.2 Z" fill="${LG("tw_elfz", [[0, "#f6efdc"], [1, "#d8cba8"]])}" stroke="#a89b78" stroke-width=".1"/>`;
    const ohr = "M10.6 -32.6 C7 -35.6 1.2 -34.6 0.4 -29.2 C-0.2 -24 1.2 -19 3.8 -16.8 C5.8 -15.6 7.4 -17.4 7.9 -19.6 C8.8 -23 10.8 -27.6 10.6 -32.6 Z";
    k += `<path d="${ohr}" fill="${LG("tw_eleohr", [[0, "#aaa49e"], [1, "#878079"]], 0, 0, 1, 0)}"/><path d="${ohr}" fill="${VOLH(34)}" stroke="#5c5651" stroke-width=".15"/>`;
    k += `<path d="M9 -31.6 C6 -30 4 -27 4.4 -22 M7 -32.6 C4 -31 2.2 -28 2.6 -24 M9.6 -27 C7.6 -25 6.6 -22 6.4 -19" stroke="#6d6761" stroke-width=".14" fill="none" opacity=".7"/>`;
    k += `<path d="M10.4 -32.4 C8 -33.6 4 -33.6 2 -31.4" stroke="#c4beb7" stroke-width=".3" fill="none"/>`;
    k += auge(12.3, -27.2, 0.32) + `<path d="M11.7 -27.8 q.7 -.4 1.3 .1" stroke="#4d4743" stroke-width=".14" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- NASHORN (Breitmaulnashorn), Schulterhöhe 1,7 m ---------------- */
  T.nashorn = (m, dir = 1) => {
    const HAUT = U("tw_nas", [[0, "#aaa298"], [1, "#857c72"]], -18, 0);
    const leib = "M-15 -15.5 C-10 -17.2 -4 -17 0 -16.9 Q3 -19.2 5.6 -17.2 C8 -15.6 10 -13 12.2 -11 L13.8 -10.2 L18.6 -8 Q19.3 -7 18.7 -5.8 L15.8 -5.8 Q13 -6.2 12.6 -6.8 C10 -7.6 8.6 -7.6 7 -7.2 C3 -5 -8 -4.8 -12 -6.2 C-16 -8 -16.8 -13 -15 -15.5 Z";
    const vn = [[6, -9, 2.3, 2.0], [5.9, -5.4, 1.8, 1.7], [6.1, -1.6, 1.6, 1.7], [6.2, 0, 1.85, 2.0]];
    const hn = [[-10, -12, 2.8, 2.6], [-10.2, -7, 2.2, 1.8], [-10.6, -4, 1.7, 1.4], [-10.3, -1.4, 1.6, 1.6], [-10.2, 0, 1.85, 1.95]];
    const vf = versch(vn, -2.4), hf = versch(hn, 2.2);
    let k = "";
    for (const p of [vf, hf]) k += fl(glied(p), HAUT, 18, 0.25);
    k += `<path d="M-15.2 -15 Q-16.6 -12 -16.2 -9" stroke="#8a8177" stroke-width=".5" fill="none"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${HAUT}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(18)}"/>`;
    for (const x of [-10.2, 6.2]) k += `<path d="M${x - 1.6} -.5 q.4 -.5 .9 0 M${x - .4} -.5 q.4 -.5 .9 0 M${x + .8} -.5 q.4 -.5 .9 0" stroke="#5f574e" stroke-width=".3" fill="none"/>`;
    k += linie("M3 -16.6 Q1.6 -12 3.2 -8", "#2a241e", 0.35, 0.2) + linie("M-8.6 -16.6 Q-10.4 -12 -8.4 -7.2", "#2a241e", 0.35, 0.2) + linie("M7.6 -15.2 Q6.8 -12 7.8 -8", "#2a241e", 0.3, 0.18) + linie("M-6 -6 Q0 -5 4 -6.6", "#2a241e", 0.2);
    k += `<path d="M15.4 -9.4 Q16.4 -13.6 15.4 -16 Q17.8 -12.6 17.8 -8.8 Z" fill="${LG("tw_horn", [[0, "#8b8172"], [1, "#b1a796"]])}"/>`;
    k += `<path d="M13 -10.6 Q13.6 -12.6 13.2 -13.6 Q14.6 -12 14.4 -10.2 Z" fill="#9a907f"/>`;
    k += `<path d="M11.2 -11.6 Q10.4 -14 11 -14.8 Q11.8 -13.8 12 -11.4 Z" fill="#9b9289" stroke="#5f574e" stroke-width=".1"/>`;
    k += auge(13.6, -8.9, 0.26) + `<path d="M17.2 -6.7 q.8 .3 1.3 -.1" stroke="#4a433c" stroke-width=".15" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- FLUSSPFERD, Schulterhöhe 1,5 m (optional im Wasser) ---------------- */
  T.nilpferd = (m, dir = 1, wasser = null) => {
    const HAUT = U("tw_nil", [[0, "#8f7c7c"], [0.65, "#7b6a6c"], [1, "#a8827c"]], -16, 0);
    const leib = "M-15 -13 C-10 -15.6 0 -15.8 6 -15 Q9 -14.6 10.4 -15.2 Q10.8 -16.8 11.8 -16.2 Q12.2 -16.8 13.2 -16.4 C14.6 -15.6 16 -14 18.8 -12.8 Q20.6 -12 20.4 -9.6 Q20.3 -7.6 18.6 -7 L15 -7 Q12.2 -6.8 11 -7.6 C9.6 -6.6 9 -6.4 8 -6.2 C4 -4.4 -8 -4.4 -13 -5.6 C-16.6 -7 -17 -11 -15 -13 Z";
    const vn = [[6.4, -7, 2.2, 2.2], [6.4, -3, 1.8, 1.8], [6.5, 0, 2.0, 2.0]], hn = [[-9.6, -8, 2.8, 2.4], [-9.4, -3, 1.9, 1.8], [-9.3, 0, 2.0, 2.0]];
    let k = "";
    for (const p of [versch(vn, -2.2), versch(hn, 2)]) k += fl(glied(p), HAUT, 16, 0.25);
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${HAUT}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(16)}"/>`;
    k += `<path d="M20 -9.4 Q16.6 -9.2 12.6 -10.6" stroke="#4d3a3c" stroke-width=".22" fill="none"/>`;
    k += `<ellipse cx="14.6" cy="-9.4" rx="2.4" ry="1.6" fill="#c99a8e" opacity=".45"/>`;
    k += `<ellipse cx="19.2" cy="-12.6" rx=".45" ry=".22" fill="#3a2a2b"/><path d="M11 -15.8 q.2 -1.4 .9 -1 q-.1 .8 -.5 1.2 Z" fill="#6c5a5c"/>`;
    k += linie("M4.6 -12.6 Q3.8 -10 4.6 -7.4", "#000", 0.15) + linie("M-8.6 -12.6 Q-10 -10 -9.2 -6.4", "#000", 0.15) + auge(13, -15.3, 0.28);
    if (wasser) {
      /* im Wasser: nur Rücken, Kopf, Augen, Ohren und Nüstern schauen heraus */
      einmal("nilw" + wasser, () => S.def(`<clipPath id="${S.id("tw_nilw" + wasser)}"><rect x="-30" y="-30" width="60" height="${f(30 - wasser)}"/></clipPath>`));
      k = `<g clip-path="url(#${S.id("tw_nilw" + wasser)})">${k}</g>`;
      k += `<path d="M-17 ${-wasser} q9 -.5 18 0 t20 0" stroke="#e2eee8" stroke-width=".3" opacity=".8" fill="none"/><path d="M-19 ${-wasser + 0.6} q10 -.4 20 0 t21 0" stroke="#e2eee8" stroke-width=".2" opacity=".5" fill="none"/>`;
      k += `<ellipse cx="2" cy="${-wasser + 0.3}" rx="19" ry=".7" fill="#2f4a40" opacity=".25"/>`;
    }
    return gr(m, dir, k);
  };

  /* ---------------- GROSSKATZEN: Löwe, Löwin, Tiger, Leopard, Puma ---------------- */
  const KATZE = {
    loewe: { sx: 1, sy: 1.02, fell: ["#b88544", "#e8c896"], maehne: true, quaste: true, kopf: 0.8, auge: "#8a6420" },
    loewin: { sx: 0.94, sy: 0.92, fell: ["#bd8c4c", "#ecd5a6"], quaste: true, kopf: 0.76, auge: "#8a6420" },
    tiger: { sx: 1.1, sy: 0.92, fell: ["#cf6c1a", "#f0a457"], streifen: true, bauch: "#f6efe2", kopf: 0.8, auge: "#9a8a1e" },
    leopard: { sx: 0.72, sy: 0.64, fell: ["#c39a55", "#ecd49c"], rosette: true, bauch: "#f3e8d2", kopf: 0.82, auge: "#9a8a1e" },
    puma: { sx: 0.74, sy: 0.64, fell: ["#a47e55", "#dcc09a"], bauch: "#efe3d2", spitze: true, kopf: 0.72, auge: "#8a6a20" }
  };
  T.katze = (art, m, dir = 1, pose = "stehen") => {
    const K = KATZE[art], lieg = pose === "liegen";
    const FELL = U("tw_k_" + art, [[0, K.fell[0]], [0.55, K.fell[0]], [1, K.fell[1]]], -12, 0);
    const BAUCH = K.bauch || K.fell[1];
    const leib = lieg
      ? "M-9 -5.4 C-6 -6.8 -1 -7.2 3 -7.6 Q5.6 -8 6.8 -7.2 C7.6 -6.4 7.6 -5 7 -3.8 Q6.4 -2.8 5.6 -2.4 L5.4 0 L-7.6 0 C-10 -.6 -10.6 -4 -9 -5.4 Z"
      : "M-8.2 -10.2 C-5 -9.9 -1 -10.2 2.4 -11 Q4.6 -11.7 6 -11.2 C7.4 -10.6 7.9 -9.2 7.5 -7.8 Q6.8 -6 5 -5.3 C2.4 -4.8 .4 -5 -1.4 -5.6 C-3.4 -6.2 -5 -6.4 -6.6 -6.8 Q-8.6 -7.6 -9 -8.8 Q-9 -9.8 -8.2 -10.2 Z";
    const vn = [[3.8, -9.4, 2.1, 1.9], [3.2, -6.2, 1.7, 1.25], [3.7, -4.2, 1.0, 1.0], [3.9, -1.6, 0.78, 0.82], [4.2, -0.6, 0.8, 1.1], [4.4, 0, 0.9, 1.5]];
    const hn = [[-6.4, -9.4, 2.6, 2.2], [-6.0, -7.2, 2.5, 2.0], [-7.0, -4.8, 1.2, 0.85], [-7.5, -3.4, 0.95, 0.6], [-7.1, -1.4, 0.65, 0.66], [-6.8, -0.55, 0.7, 0.95], [-6.6, 0, 0.8, 1.35]];
    const teile = lieg
      ? ["M4.4 -2.6 C6 -2.4 8 -1.8 9.8 -1.3 Q10.9 -.8 10.4 0 L4.2 0 Z", "M-9.4 -2.8 C-9.6 -5.2 -7.6 -6.2 -5.6 -5.8 C-3.4 -5.2 -2.8 -2.6 -4 -1 L-1.4 -.8 Q-.8 -.3 -1.3 0 L-8 0 C-9 -.6 -9.4 -1.6 -9.4 -2.8 Z"]
      : [glied(hn), glied(vn)];
    let k = "";
    /* Schwanz */
    const sw = art === "tiger" ? 1.1 : 0.8;
    k += lieg ? `<path d="M-9.2 -1 C-11.6 -.6 -13.6 -.4 -14.6 -.9" stroke="${K.fell[0]}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`
      : `<path d="M-8.4 -9.8 C-10.6 -9 -11 -5 -10.6 -2.4 Q-10.4 -1.2 -9.6 -1.6" stroke="${K.fell[0]}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
    const ende = lieg ? [-14.6, -0.9] : [-9.7, -1.6];
    if (K.quaste) k += `<ellipse cx="${ende[0]}" cy="${ende[1]}" rx=".75" ry=".6" fill="#3a2614"/>`;
    if (K.spitze || art === "tiger") k += `<circle cx="${ende[0]}" cy="${ende[1]}" r="${sw / 2}" fill="#20150c"/>`;
    if (art === "tiger") k += lieg ? linie("M-11 -1.3 l0 1 M-12.4 -1.2 l0 1 M-13.6 -1.4 l0 1", "#1c120a", 1, 0.4) : linie("M-10.6 -7.4 l1 .3 M-11 -5.4 l1 .2 M-10.9 -3.4 l1 0", "#1c120a", 1, 0.4);
    if (art === "leopard") k += lieg ? linie("M-11 -1.3 l.2 .6 M-12.6 -1.1 l.2 .6", "#2a1a0c", 1, 0.3) : linie("M-10.6 -7 l.6 .2 M-11 -4.6 l.6 .2", "#2a1a0c", 1, 0.3);
    if (!lieg) for (const p of [versch(vn, -1.8), versch(hn, -1.4)]) k += `<path d="${glied(p)}" fill="${FELL}"/><path d="${glied(p)}" fill="#000" opacity=".3"/>`;
    for (const d of [...teile, leib]) k += `<path d="${d}" fill="${FELL}"/>`;
    k += lieg ? `<path d="M-7.6 -.9 Q0 -1.6 5.4 -1.2 L5.4 0 L-7.6 0 Z" fill="${BAUCH}" opacity=".75"/>`
      : `<path d="M-4.6 -6.4 Q0 -5.4 5 -6 Q6.6 -6.6 7.2 -7.6 Q6.8 -6 5 -5.3 C2.4 -4.8 .4 -5 -1.4 -5.6 C-3 -6.1 -4 -6.3 -4.6 -6.4 Z" fill="${BAUCH}" opacity=".85"/>`;
    const clipN = "tw_kcl" + (lieg ? "l" : "s");
    einmal(clipN, () => S.def(`<clipPath id="${S.id(clipN)}">${[...teile, leib].map((d) => `<path d="${d}"/>`).join("")}</clipPath>`));
    if (K.streifen) {
      einmal("tigst" + pose, () => {
        let st = "";
        const yb = lieg ? -8 : -11.6, yu = lieg ? -1 : -5.2;
        for (let i = 0; i < 14; i++) {
          const x = -9 + i * 1.15 + (i % 2) * 0.25, h = (yu - yb) * (0.5 + (i % 3) * 0.13);
          st += `<path d="M${f(x)} ${f(yb - 0.2)} Q${f(x + 0.7)} ${f(yb + h * 0.5)} ${f(x + 0.1)} ${f(yb + h)} Q${f(x - 0.1)} ${f(yb + h * 0.5)} ${f(x - 0.5)} ${f(yb - 0.2)} Z" fill="#1c120a"/>`;
        }
        if (!lieg) for (const [x, y0] of [[-6.6, -7], [3.6, -5.6]]) for (let j = 0; j < 3; j++) st += `<path d="M${f(x - 1.6)} ${f(y0 + j * 1.3)} q1.4 .5 2.8 0" stroke="#1c120a" stroke-width=".32" fill="none"/>`;
        else st += `<path d="M-8.6 -3.6 q2 -.6 3.4 .6 M-8.8 -2.4 q2 -.4 3.6 .6 M6 -1.8 l0 1.6 M7.4 -1.6 l0 1.4" stroke="#1c120a" stroke-width=".32" fill="none"/>`;
        S.def(`<g id="${S.id("tw_tst" + pose)}">${st}</g>`);
      });
      k += `<g clip-path="url(#${S.id(clipN)})"><use href="#${S.id("tw_tst" + pose)}"/></g>`;
    }
    if (K.rosette) {
      einmal("leoros", () => rosetten("tw_leoros", "#b58237"));
      k += `<g clip-path="url(#${S.id(clipN)})"><rect x="-12" y="-14" width="22" height="14" fill="url(#${S.id("tw_leoros")})"/></g>`;
    }
    for (const d of [...teile, leib]) k += `<path d="${d}" fill="${VOLH(12)}"/>`;
    if (!lieg) k += linie("M-5.2 -9.6 Q-3.8 -7.6 -5 -6.2", "#3a2412", 0.3) + linie("M3.6 -10.4 Q2.4 -8.4 3.2 -6.4", "#3a2412", 0.3) + linie("M2.2 -6.8 l.4 .8", "#3a2412", 0.25);
    else k += linie("M-6.6 -4.4 Q-5 -3.4 -5.4 -1.6", "#3a2412", 0.3);
    /* Kopf: Stirn, Nasenrücken, Nase, Schnurrhaarkissen, Kinn, Wange, Ohr */
    const [kx, ky] = lieg ? [6.2, -7.4] : [6.4, -9.6];
    let kopf = "";
    if (K.maehne) {
      const MA = LG("tw_maehne", [[0, "#8f5e2c"], [0.55, "#6b3f1d"], [1, "#4a2a12"]]);
      const md = "M2.4 -3.4 C.4 -5.6 -3.4 -5.2 -4.8 -2.4 C-5.8 0 -5.2 3.4 -4.2 5.8 C-2.4 6.8 .6 6.4 2.2 4.4 C3 3 3.4 1.8 3 1.2 Q1.8 1 1.2 0 Q1 -2 2.4 -3.4 Z";
      kopf += `<path d="${md}" fill="${MA}"/>`;
      for (let i = 0; i < 22; i++) { const a = -2.9 + i * 0.2, x0 = -1.2 + Math.cos(a) * 3.4, y0 = 0.6 + Math.sin(a) * 4.2; kopf += `<path d="M${f(x0)} ${f(y0)} q${f(Math.cos(a) * 0.8)} ${f(Math.sin(a) * 0.8 + 0.3)} ${f(Math.cos(a) * 1.3)} ${f(Math.sin(a) * 1.3 + 0.9)}" stroke="#3a210d" stroke-width=".2" fill="none" opacity=".6"/>`; }
      kopf += `<path d="M-1 -3.6 q-1.4 .6 -2.6 2.4 M0 4.8 q-1.6 .4 -3 -.4" stroke="#b07a3e" stroke-width=".25" fill="none" opacity=".6"/>`;
    }
    const HK = "M-1.2 -1.6 Q-.4 -3.2 1.4 -3.3 Q2.8 -3.2 3.4 -2.2 L4.5 -1.1 Q4.9 -.8 4.8 -.3 Q4.7 .2 4.3 .3 Q4.2 .9 3.6 1 Q3 1.5 2.4 1.3 Q1.4 1.2 .6 .8 Q-.6 .4 -1.2 -.4 Z";
    kopf += `<path d="M-.1 -2.8 Q-.5 -4.3 .6 -4.1 Q1.2 -3.7 1.1 -2.9 Z" fill="${K.fell[0]}" stroke="#2a1a0c" stroke-width=".14"/>`;
    if (art === "tiger") kopf += `<circle cx=".45" cy="-3.6" r=".22" fill="#fff"/>`;
    kopf += `<path d="${HK}" fill="${FELL}"/><path d="${HK}" fill="${VOLH(12)}"/>`;
    kopf += `<ellipse cx="3.9" cy=".15" rx=".8" ry=".55" fill="${BAUCH}"/><path d="M2 1.1 Q3 1.5 3.6 1 Q3 .7 2.2 .8 Z" fill="${BAUCH}"/>`;
    kopf += `<path d="M1.8 -2.2 Q2.6 -2.4 3.1 -1.9" stroke="${BAUCH}" stroke-width=".3" fill="none" opacity=".8"/>`;
    if (art === "tiger") kopf += linie("M1 -2.9 q.4 .8 .2 1.4 M2 -3.2 q.1 .6 -.1 1 M-.6 -1.2 q.8 .4 1.6 .2 M-.8 -.2 q.8 .3 1.6 .1 M.2 .6 q.6 -.1 1 .2", "#1c120a", 1, 0.22);
    if (art === "leopard") for (const [x, y] of [[.6, -2.6], [1.4, -2.9], [.2, -1.6], [1, -1.9], [-.4, -.6], [.4, .3]]) kopf += `<circle cx="${x}" cy="${y}" r=".16" fill="#2a1a0c"/>`;
    if (art === "puma") kopf += `<path d="M3.4 -.3 Q3.4 .6 3 .9" stroke="#3a2412" stroke-width=".18" fill="none" opacity=".6"/>`;
    kopf += `<path d="M4.42 -.98 L4.86 -.62 L4.76 -.22 L4.32 -.44 Z" fill="${art === "puma" || art === "loewin" ? "#b9806e" : "#3b2416"}"/>`;
    kopf += linie("M4.3 .3 Q3.8 .5 3.4 .4", "#2a1a0c", 0.8, 0.12);
    kopf += `<ellipse cx="2.6" cy="-1.7" rx=".36" ry=".24" fill="${K.auge}" stroke="#1c120a" stroke-width=".1"/><ellipse cx="2.68" cy="-1.7" rx=".1" ry=".17" fill="#111"/><circle cx="2.74" cy="-1.78" r=".05" fill="#fff"/>`;
    kopf += `<path d="M3.6 .2 l1.4 -.3 M3.6 .4 l1.5 .1 M3.6 .5 l1.3 .5" stroke="#f6f0e6" stroke-width=".05" opacity=".8"/>`;
    k += `<g transform="translate(${kx} ${ky}) scale(${K.kopf})">${kopf}</g>`;
    return gr(m, dir, `<g transform="scale(${K.sx} ${K.sy})">${k}</g>`);
  };

  /* ---------------- GORILLA (Silberrücken), auf den Knöcheln ---------------- */
  T.gorilla = (m, dir = 1) => {
    const leib = "M-6 -9.4 C-3 -11.2 1 -13.2 4 -13.6 Q5.6 -15 6.6 -14.4 Q8.2 -13.6 8.5 -12.4 Q8.9 -11.6 8.6 -11 Q9.1 -10.4 8.9 -9.8 Q8.6 -9.2 8 -9.3 Q7.4 -9 6.8 -9.4 C7.6 -7 7.9 -3 7.7 -.8 Q8.4 -.4 8.2 0 L6 0 Q5.8 -3.6 5.2 -6.6 C3 -5.6 -1 -5.2 -2.4 -5.6 C-2.6 -3.4 -2.6 -1.6 -2.2 -.6 Q-1.2 -.4 -1.2 0 L-4.6 0 Q-5.4 -1.6 -5.6 -3.4 C-6.4 -5 -6.8 -7.6 -6 -9.4 Z";
    let k = "";
    /* fernes Bein und Arm */
    k += `<path d="M5.2 -8 C5.6 -5 5.8 -2.6 5.6 -.6 Q6.2 -.3 6 0 L4.2 0 Q4.2 -3 3.8 -6.4 Z" fill="#141416"/>`;
    k += `<path d="M-4 -6 Q-4.6 -3 -4.2 -.6 Q-3.4 -.3 -3.6 0 L-6 0 Q-6.4 -2.4 -5.6 -5.6 Z" fill="#141416"/>`;
    k += `<path d="${leib}" fill="${LG("tw_gor", [[0, "#3a3a3d"], [1, "#1c1c1e"]])}"/>`;
    /* silberner Sattel auf dem Rücken */
    k += `<path d="M-5.6 -9.2 C-3 -11 1 -12.8 3.4 -13.2 Q2.6 -11 1.2 -10 C-1 -8.8 -3.6 -8.2 -5.8 -8.2 Z" fill="${LG("tw_gors", [[0, "#c9c8c4"], [1, "#8c8b88", 0.6]])}"/>`;
    k += `<path d="${leib}" fill="${VOL()}" stroke="#000" stroke-opacity=".4" stroke-width=".1"/>`;
    /* Haar-Strich */
    for (let i = 0; i < 18; i++) { const x = -5 + rnd() * 11, y = -12 + rnd() * 6; k += `<path d="M${f(x)} ${f(y)} l${f(-0.5)} ${f(0.4)}" stroke="#55555a" stroke-width=".12" opacity=".6"/>`; }
    /* Gesicht: schwarz glänzend, Brauenwulst, Nase */
    k += `<path d="M7.4 -12.6 Q8.4 -12.4 8.5 -11.8 Q8.8 -10.8 8.6 -10 Q8.2 -9.4 7.6 -9.6 Q7 -10.6 7.4 -12.6 Z" fill="#0d0d0e"/>`;
    k += `<path d="M7.2 -12.8 Q8 -12.9 8.6 -12.2" stroke="#3a3a3e" stroke-width=".3" fill="none"/>`;
    k += auge(7.9, -11.9, 0.16, "#3b2414");
    k += `<path d="M8.4 -11.2 q.4 .2 .3 .5" stroke="#555" stroke-width=".12" fill="none"/>`;
    k += `<path d="M5.2 -14.6 Q6.6 -15.2 7.6 -13.6" stroke="#4a3a34" stroke-width=".25" fill="none" opacity=".7"/>`;
    return gr(m * 0.82, dir, k);
  };

  /* ---------------- SCHIMPANSE (sitzend) ---------------- */
  T.schimpanse = (m, dir = 1) => {
    const FELL = LG("tw_schi", [[0, "#2d2722"], [1, "#171310"]]);
    let k = "";
    /* Rumpf sitzend, Beine angezogen */
    k += `<path d="M-2.4 -7.6 C-3.4 -5 -3.4 -2 -2.6 0 L2.6 0 C3 -1 2.8 -2 2 -2.4 C2.6 -4 2.4 -6.4 1.4 -7.8 C.4 -8.6 -1.6 -8.6 -2.4 -7.6 Z" fill="${FELL}"/>`;
    k += `<path d="M-1 -3.2 C1 -3.6 3 -3 3.6 -1.6 Q4 -.4 3.4 0 L-.6 0 Q-1.6 -1.6 -1 -3.2 Z" fill="${FELL}"/>`;
    k += `<path d="M3.2 -.9 Q4.2 -.8 4.2 0 L2.8 0 Z" fill="#5a4436"/>`;
    /* Arm auf dem Knie */
    k += `<path d="M.8 -7 Q2.6 -6.6 3.2 -4.2 Q3.4 -3 2.8 -2.6 Q2.4 -3.6 1.4 -4.8 Q.4 -5.6 .8 -7 Z" fill="#221d19"/>`;
    k += `<path d="M2.6 -2.9 q.8 0 .9 .6 q-.6 .4 -1.2 .1 Z" fill="#5a4436"/>`;
    k += `<path d="M-2.6 -7.8 C-3.4 -5 -3.4 -2 -2.6 0 L3.4 0 C4 -1 3.6 -4 1.4 -7.8 Z" fill="${VOL()}"/>`;
    /* Kopf mit großen Ohren und hellem Gesicht */
    k += `<path d="M-1.6 -8.4 Q-1.8 -10.4 -.2 -10.8 Q1.6 -11 2 -9.6 Q2.2 -8.4 1.4 -7.8 Q0 -7.4 -1.6 -8.4 Z" fill="#221c18"/>`;
    k += `<ellipse cx="-.9" cy="-9.4" rx=".7" ry=".85" fill="#9b7a64"/>`;
    k += `<path d="M.4 -10.2 Q1.8 -10.2 2.3 -9.2 Q2.6 -8.2 2 -7.7 Q1 -7.4 .4 -8 Q.1 -9.2 .4 -10.2 Z" fill="${LG("tw_schig", [[0, "#c9a189"], [1, "#a7826c"]])}"/>`;
    k += `<path d="M.6 -9.7 Q1.4 -10.1 2.1 -9.5" stroke="#5c4232" stroke-width=".16" fill="none"/>` + auge(1.4, -9.35, 0.13, "#3a2414");
    k += `<path d="M1.6 -8.2 q.4 .1 .6 -.1" stroke="#5c4232" stroke-width=".1" fill="none"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- PAVIAN (Mantelpavian, mit Schwanz, sitzend ~0,7 m) ---------------- */
  T.affe = (m, dir = 1) => {
    const FELL = U("tw_pav", [[0, "#9a9484"], [1, "#6f6a5c"]], -8, 0);
    let k = "";
    k += `<path d="M-2 -.8 C-3.6 -2.2 -4.8 -1.6 -5 0" stroke="#6f6a5c" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M1.6 -4.6 L2 -.2 L2.9 0 L2.7 -4.4 Z" fill="#4f4b42"/>`;
    k += `<path d="M-2.4 0 C-3 -2.4 -2.4 -4.8 -.8 -6 Q.4 -6.8 1.4 -6.2 C2 -5 2.2 -3 2 -1.6 Q1.6 -.2 .6 0 Z" fill="${FELL}"/>`;
    k += `<ellipse cx="-1.6" cy="-.5" rx="1" ry=".55" fill="#c9665e"/>`;
    k += `<path d="M-.4 -2.6 Q1.6 -3.4 2.6 -1.4 Q3 -.4 2.4 0 L.2 0 Q-.6 -1.2 -.4 -2.6 Z" fill="#857f6f"/>`;
    /* silberner Mantel über Schultern und Rücken */
    k += `<path d="M.4 -7.6 C-1.4 -7.6 -2.8 -5.6 -2.8 -3 Q-2.2 -2.4 -1.6 -3 Q-1.6 -1.8 -.8 -2.4 Q.4 -3.4 1.6 -3.6 C2.2 -4.6 2.2 -6.4 1.4 -7.2 Z" fill="${U("tw_pavm", [[0, "#d6d2c6"], [1, "#a39e8f"]], -8, -2)}"/>`;
    k += linie("M-.6 -6.8 Q-2 -5.2 -2.2 -3.4 M.2 -6.4 Q-1 -5 -1.2 -3 M1 -6.2 Q.4 -5 .2 -3.6", "#7a7566", 0.6, 0.12);
    k += `<path d="M1.6 -4.8 Q2.2 -2.4 2.2 -.4 L3.1 0 L3.2 -.4 L2.9 -.5 Q3 -2.6 2.6 -4.8 Z" fill="#8a8474"/>`;
    /* Kopf mit langer, rosafarbener Hundeschnauze */
    k += `<circle cx="1" cy="-6.6" r="1.05" fill="#a8a393"/>`;
    k += `<path d="M1.3 -7.3 Q2.4 -7.2 3.7 -6.5 Q4 -6.2 3.7 -5.8 L3.3 -5.5 Q2.4 -5.3 1.5 -5.6 Q1 -6.4 1.3 -7.3 Z" fill="${LG("tw_pavg", [[0, "#d8a89a"], [1, "#b47f72"]])}"/>`;
    k += `<path d="M3.6 -6.3 l.25 .3" stroke="#4a2a24" stroke-width=".14"/><path d="M1.9 -5.6 Q2.6 -5.7 3.3 -5.6" stroke="#7a4a40" stroke-width=".1" fill="none"/>`;
    k += auge(1.75, -6.85, 0.12, "#5a3a14") + linie("M1.4 -7.15 q.4 -.15 .8 .05", "#4a3a2a", 0.8, 0.12);
    return gr(m, dir, k);
  };

  /* ---------------- BRAUNBÄR, Schulterhöhe 1,1 m ---------------- */
  T.baer = (m, dir = 1) => {
    const FELL = U("tw_bae", [[0, "#7a5233"], [1, "#4f3220"]], -12, 0);
    const leib = "M-9.4 -8 C-7.4 -9.8 -3 -10 0 -10.4 Q2.6 -11.8 4.6 -11.1 C6 -10.6 6.8 -9.8 7.6 -9.6 Q8.4 -10.4 9 -9.8 L10.8 -8.6 Q11.3 -8.1 10.8 -7.7 L9.4 -7.4 Q8.4 -7 7.4 -6.8 C6.8 -6 6 -5.4 5 -5.2 C2 -4.4 -3 -4.4 -6.6 -4.8 C-8.8 -5.2 -10.2 -6.6 -9.4 -8 Z";
    const vn = [[4.2, -8, 1.7, 1.5], [4.0, -4.6, 1.35, 1.25], [4.1, -1.4, 1.15, 1.15], [4.3, 0, 1.25, 1.9]];
    const hn = [[-6.4, -7.4, 2.4, 2.0], [-6.3, -5, 1.9, 1.4], [-6.7, -2, 1.35, 1.1], [-6.4, 0, 1.45, 2.0]];
    let k = "";
    for (const p of [versch(vn, -1.6), versch(hn, -1.4)]) k += fl(glied(p), FELL, 12, 0.3);
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${FELL}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(12)}"/>`;
    for (let i = 0; i < 26; i++) { const x = -8 + rnd() * 15, y = -10 + rnd() * 5; k += `<path d="M${f(x)} ${f(y)} q-.3 .5 -.7 .6" stroke="#3a2414" stroke-width=".14" fill="none" opacity=".5"/>`; }
    k += linie("M1.6 -11 Q3.6 -12.2 5.2 -10.8", "#a87a52", 0.6, 0.35) + linie("M-4.8 -8.4 Q-3.6 -6.6 -4.6 -5", "#2a180c", 0.35) + linie("M3 -9 Q2 -7 2.6 -5.4", "#2a180c", 0.35);
    k += `<circle cx="6.9" cy="-10.5" r=".7" fill="#5e3e26"/><circle cx="6.9" cy="-10.5" r=".35" fill="#3a2414"/>`;
    k += `<path d="M8.8 -9.4 L10.8 -8.6 Q11.3 -8.1 10.8 -7.7 L9.4 -7.4 Z" fill="#8a6446"/><ellipse cx="10.8" cy="-8.3" rx=".38" ry=".3" fill="#1c120a"/>`;
    k += auge(8.4, -9.4, 0.17);
    for (const x of [4.3, -6.4]) k += `<path d="M${x + 0.7} -.2 l.3 .2 M${x + 1.2} -.25 l.3 .2 M${x + 1.7} -.3 l.3 .2" stroke="#d9cbb4" stroke-width=".14"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- KROKODIL (Nilkrokodil), 4 m lang, liegend ---------------- */
  T.krokodil = (m, dir = 1) => {
    const HAUT = U("tw_kro", [[0, "#58653a"], [0.55, "#4c5730"], [0.85, "#6d7444"], [1, "#b9b183"]], -5, 0);
    const leib = "M-22 -.3 C-16 -1.2 -10 -2.6 -5 -3.9 C-2 -4.7 3 -4.7 6 -4.1 Q7.4 -3.7 8.2 -3.4 Q9.4 -3.5 10 -4.1 Q10.6 -3.6 11 -3.3 L17 -2 Q18 -1.7 17.9 -1 Q17.8 -.5 17 -.5 L13 -.4 Q10 -.2 8 -.5 C4 -.1 -4 0 -8 -.2 L-22 0 Z";
    let k = schatten(-2, 0, 19, 0.7, 0.28);
    /* ferne Beine */
    k += `<path d="M3.6 -1.8 Q4.6 -1 4.4 -.2 L5.6 0 L6.2 -.3 L5.2 -.6 Q5.4 -1.6 4.6 -2.4 Z M-5.6 -2.2 Q-6.6 -1 -6 -.2 L-4.6 0 L-4.4 -.4 L-5.2 -.5 Q-5 -1.4 -4.6 -2.2 Z" fill="#3c4526"/>`;
    k += `<path d="${leib}" fill="${HAUT}"/><path d="${leib}" fill="${VOLH(5)}"/>`;
    /* Querbänder am Schwanz, Panzerplatten (Osteoderme) am Rücken */
    for (let i = 0; i < 7; i++) { const x = -20 + i * 2.4; k += `<path d="M${f(x)} ${f(-0.4 - (x + 22) * 0.14)} q.5 ${f(0.2 + (x + 22) * 0.06)} .2 ${f(0.4 + (x + 22) * 0.12)}" stroke="#2f381c" stroke-width=".55" fill="none" opacity=".6"/>`; }
    for (let i = 0; i < 24; i++) { const x = -20 + i * 1.1, y = x < -5 ? -0.5 - (x + 22) * 0.2 : -4.1 - Math.min(0, -x * 0.02); if (x > 7) break; k += `<path d="M${f(x)} ${f(y + 0.05)} l.3 -.55 l.3 .55 Z" fill="#323b1e"/>`; }
    for (let i = 0; i < 9; i++) for (let j = 0; j < 2; j++) k += `<rect x="${f(-4 + i * 1.15)}" y="${f(-3.9 + j * 0.85)}" width=".8" height=".55" rx=".2" fill="#3e4826" opacity=".55"/>`;
    /* nahe Beine, gespreizt mit Krallen */
    k += `<path d="M5 -2.6 Q6.4 -1.8 6.6 -.6 L8 0 L8.4 -.2 L8.6 0 L8.9 -.3 L7.6 -.8 Q7.4 -2 6.4 -2.9 Z" fill="#4a5530"/>`;
    k += `<path d="M-3.6 -2.8 Q-5.4 -2 -5 -.6 L-6.6 -.1 L-6.6 .1 L-4 0 Q-3.4 -.6 -3 -1.6 Z" fill="#4a5530"/>`;
    /* Kopf: Zahnreihe, Auge mit Wulst, Nasenloch */
    k += `<path d="M9 -2.4 Q13 -1.7 17.2 -1.3" stroke="#2a301a" stroke-width=".16" fill="none"/>`;
    for (let i = 0; i < 6; i++) k += `<path d="M${f(10.6 + i * 1.1)} ${f(-1.95 + i * 0.1)} l.2 .4 l.2 -.4" fill="#f2ecd6"/>`;
    k += auge(10.3, -3.85, 0.22, "#8a8a2a") + `<ellipse cx="17.2" cy="-2" rx=".3" ry=".18" fill="#2a2f1a"/>`;
    k += linie("M-4 -.3 Q2 -.6 7 -.5", "#d6cf9f", 0.6, 0.2);
    return gr(m, dir, k);
  };

  /* ---------------- FLAMINGO (Rosaflamingo), 1,3 m, auf einem Bein ---------------- */
  T.flamingo = (m, dir = 1, kopfUnten = false) => {
    const ROSA = LG("tw_fla", [[0, "#f6b5ae"], [1, "#e98c86"]]);
    let k = "";
    /* Standbein mit Fersengelenk (der „Knick“ ist die Ferse) */
    k += `<path d="M.2 -7.4 L.4 -4 L.3 0" stroke="#e07a78" stroke-width=".32" fill="none"/><circle cx=".4" cy="-4" r=".25" fill="#d86e6c"/>`;
    k += `<path d="M-.6 0 L1.2 0 L1.6 -.2" stroke="#d86e6c" stroke-width=".28" fill="none"/>`;
    /* angezogenes Bein */
    k += `<path d="M-.4 -7.4 L.6 -5.6 L-1.4 -6.4" stroke="#e07a78" stroke-width=".3" fill="none" stroke-linejoin="round"/>`;
    /* Körper */
    k += `<path d="M-3.4 -8.8 C-2.8 -10.4 1 -10.6 2.4 -9.6 C3 -9 2.6 -7.8 1.4 -7.4 C-.4 -7 -2.6 -7.4 -3.4 -8.8 Z" fill="${ROSA}"/>`;
    k += `<path d="M-3.4 -8.8 L-4.4 -8.4 L-3 -8 Z" fill="#1a1414"/><path d="M-2.6 -9.4 Q-1 -9 0 -8.2 Q-2 -8 -3.2 -8.6 Z" fill="#e0606a"/>`;
    k += `<path d="M-3.4 -8.8 C-2.8 -10.4 1 -10.6 2.4 -9.6 C3 -9 2.6 -7.8 1.4 -7.4 C-.4 -7 -2.6 -7.4 -3.4 -8.8 Z" fill="${VOL()}"/>`;
    /* S-Hals und Kopf mit geknicktem Schnabel */
    if (!kopfUnten) {
      k += `<path d="M1.8 -9.4 C3 -10.6 1 -11.6 1 -12.6 C1 -13.8 2.2 -14.2 2.8 -13.4" stroke="${ROSA}" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
      k += `<ellipse cx="2.7" cy="-13.5" rx=".55" ry=".45" fill="#f2a8a2"/>`;
      k += `<path d="M3 -13.8 L4 -13.4 Q4.3 -12.9 4 -12.4 L3.7 -12.6 Q3.6 -13 3 -13.1 Z" fill="#f3e9e2"/><path d="M4 -13.2 Q4.3 -12.8 4 -12.3 L3.7 -12.6 Z" fill="#1a1414"/>`;
      k += `<circle cx="2.8" cy="-13.6" r=".1" fill="#c9a400"/>`;
    } else {
      k += `<path d="M1.8 -9.4 C3.4 -9.6 3.8 -7 3.6 -4" stroke="${ROSA}" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
      k += `<ellipse cx="3.6" cy="-3.6" rx=".45" ry=".55" fill="#f2a8a2"/><path d="M3.3 -3.2 L3.4 -2.2 Q3.7 -2 4 -2.4 L3.9 -3.2 Z" fill="#1a1414"/>`;
    }
    return gr(m, dir, k);
  };

  /* ---------------- PELIKAN (Rosapelikan), steht ~1,1 m ---------------- */
  T.pelikan = (m, dir = 1) => {
    const W = LG("tw_pel", [[0, "#fdfbf8"], [1, "#e6dfd8"]]);
    let k = "";
    k += `<path d="M-.4 -3 L-.6 -.4 M1 -3 L1 -.4" stroke="#e8a253" stroke-width=".5"/><path d="M-1.6 0 L.4 0 L-.4 -.5 Z M0 0 L2 0 L1 -.5 Z" fill="#e8a253"/>`;
    k += `<path d="M-5.6 -6 C-4 -9 1 -9.6 2.8 -7.8 C3.6 -6.6 3 -3.6 1 -2.8 C-1.6 -2.2 -4.4 -3.4 -5.6 -6 Z" fill="${W}"/>`;
    k += `<path d="M-5.6 -6 C-4.2 -7.6 -1.6 -7.4 .4 -6.2 C-1.6 -5 -4 -5 -5.6 -6 Z" fill="#2a2420"/><path d="M-5.6 -6 L-6.6 -5.4 L-5.2 -5.2 Z" fill="#2a2420"/>`;
    k += `<path d="M-4.6 -6.6 Q-2 -7.4 .6 -6.4" stroke="#d9cfc6" stroke-width=".2" fill="none"/>`;
    k += `<path d="M-5.6 -6 C-4 -9 1 -9.6 2.8 -7.8 C3.6 -6.6 3 -3.6 1 -2.8 C-1.6 -2.2 -4.4 -3.4 -5.6 -6 Z" fill="${VOL()}"/>`;
    /* Hals und Kopf, langer Schnabel mit gelbem Kehlsack */
    k += `<path d="M2 -7.8 C3.4 -9 2.2 -10.4 2.4 -11.4 Q2.8 -12.4 3.8 -12" stroke="${W}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    k += `<ellipse cx="3.6" cy="-12" rx=".9" ry=".75" fill="#fbf6f0"/>`;
    k += `<path d="M4.2 -12.4 L9.4 -10.6 Q9.8 -10.3 9.3 -10.1 L4.4 -11.4 Z" fill="#c9b07a"/><path d="M9.2 -10.7 l.5 .3 l-.4 .3" fill="#e0582a"/>`;
    k += `<path d="M4.4 -11.4 L9.2 -10.1 Q7 -8.8 5 -9.6 Q4.2 -10.4 4.4 -11.4 Z" fill="${LG("tw_pels", [[0, "#f7d35a"], [1, "#e8a530"]])}"/>`;
    k += `<circle cx="3.9" cy="-12.2" r=".24" fill="#f2c9a8"/><circle cx="3.9" cy="-12.2" r=".1" fill="#2a1a0c"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- HUNDEARTIGE: Wolf (Schulter 0,8 m), Fuchs (0,4 m) ---------------- */
  T.hund = (art, m, dir = 1) => {
    const W = art === "wolf";
    const FELL = U("tw_h_" + art, W ? [[0, "#6a655d"], [0.45, "#8e8578"], [1, "#cfc6b6"]] : [[0, "#b0521a"], [0.6, "#cf6e28"], [1, "#e2a066"]], -10, 0);
    const leib = "M-7 -7.4 C-4 -8 0 -7.8 3 -8.4 Q4.6 -9.6 5.6 -9.8 Q6.4 -10.6 6.8 -9.8 L9 -8.6 L10 -8.1 Q10.2 -7.7 9.8 -7.6 L8.4 -7.5 Q7.4 -7.2 6.4 -7 C5.8 -5.8 5.4 -5 4.2 -4.6 C1 -4.2 -3 -4.2 -5.2 -4.6 C-7.4 -5 -8 -6.6 -7 -7.4 Z";
    const vn = [[3.4, -6.6, 1.1, 1.0], [3.1, -4.4, 0.8, 0.6], [3.3, -2.6, 0.42, 0.45], [3.4, -1, 0.36, 0.4], [3.6, -0.3, 0.4, 0.6], [3.7, 0, 0.45, 0.8]];
    const hn = [[-5.2, -6.8, 1.6, 1.4], [-5, -5, 1.5, 1.1], [-5.8, -3, 0.6, 0.45], [-6, -2.2, 0.45, 0.32], [-5.7, -0.8, 0.34, 0.36], [-5.5, 0, 0.45, 0.75]];
    let k = "";
    for (const p of [versch(vn, -1.2), versch(hn, -1)]) k += fl(glied(p), FELL, 10, 0.3) + (W ? "" : `<path d="${glied(p.slice(2))}" fill="#2a1a10"/>`);
    k += `<path d="M-6.8 -7 C-9 -6.6 -10.6 -4.6 -11.4 -2.4 Q-11 -1.6 -10.2 -2.4 C-9.2 -4 -8 -5.4 -6.6 -5.6 Z" fill="${FELL}"/><path d="M-6.8 -7 C-9 -6.6 -10.6 -4.6 -11.4 -2.4 Q-11 -1.6 -10.2 -2.4 C-9.2 -4 -8 -5.4 -6.6 -5.6 Z" fill="${VOLH(10)}"/>`;
    k += `<path d="M-11.4 -2.4 Q-11 -1.6 -10.2 -2.4 L-10.6 -3.2 Z" fill="${W ? "#2a2620" : "#fbf6ee"}"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${FELL}"/>`;
    if (!W) for (const p of [vn, hn]) k += `<path d="${glied(p.slice(2))}" fill="#2a1a10"/>`;
    for (const d of [glied(hn), glied(vn), leib]) k += `<path d="${d}" fill="${VOLH(10)}"/>`;
    k += `<path d="M6.4 -7 Q7.6 -7.2 8.4 -7.5 L9.8 -7.6 Q8 -6.6 6.6 -6.4 Z" fill="${W ? "#e6ddd0" : "#fbf6ee"}"/>`;
    if (!W) k += `<path d="M5 -6.6 Q6 -6.2 6.4 -7 Q6 -5.6 5.2 -5 Z" fill="#fbf6ee"/>`;
    k += `<path d="M5.6 -9.8 L5.8 -11.6 L6.8 -10 Z" fill="${W ? "#6a6359" : "#a4501a"}" stroke="#2a1a10" stroke-width=".12"/>`;
    k += `<ellipse cx="10" cy="-8" rx=".22" ry=".2" fill="#151010"/>` + auge(7.6, -9, 0.17, W ? "#9a7a1e" : "#7a4a10");
    k += linie("M-4 -7.2 Q-3 -5.8 -3.8 -4.8", "#2a1a10", 0.3) + linie("M2.6 -7.6 Q2 -6.2 2.6 -5", "#2a1a10", 0.3);
    if (W) for (let i = 0; i < 12; i++) { const x = -6 + rnd() * 10, y = -8 + rnd() * 3; k += `<path d="M${f(x)} ${f(y)} l-.4 .5" stroke="#4a463f" stroke-width=".12" opacity=".6"/>`; }
    return gr(m * (W ? 1 : 0.52), dir, k);
  };

  /* ---------------- STEINADLER, sitzend, ~0,85 m ---------------- */
  T.adler = (m, dir = 1) => {
    const F = LG("tw_adl", [[0, "#7a5230"], [1, "#3e2814"]]);
    const leib = "M.6 -8.6 Q1.6 -9.4 2.4 -8.8 Q2.8 -8.4 2.8 -7.9 L3.5 -8 Q3.9 -7.7 3.6 -7.2 L3.3 -7.4 L2.8 -7.4 Q2.9 -6.8 2.7 -6.4 C3 -5.4 2.8 -3.8 2 -2.6 C1.6 -1.8 1.4 -1.2 1.4 -.6 L.4 -.6 C0 -1.2 -1.2 -1 -1.8 -.2 L-2.8 1.6 L-3.4 1.2 L-2.2 -1.6 C-1.6 -4.6 -.6 -7.4 .6 -8.6 Z";
    let k = `<path d="${leib}" fill="${F}"/>`;
    k += `<path d="M.8 -7.2 C2 -6.6 2 -4 1 -2.4 L-2.6 1.1 Q-2.2 -2 -.8 -5.6 Z" fill="#33210f"/>`;
    k += linie("M.6 -5.6 L-1.6 .2 M1.2 -4.4 L-1.2 .6 M.2 -6.4 L-1.8 -.8", "#6e4a28", 0.8, 0.12);
    k += `<path d="M.5 -8.5 Q1.6 -9.3 2.4 -8.8 Q2.7 -8.2 2.4 -7.7 Q1.4 -7.4 .6 -8 Z" fill="#c38d3c"/>`;
    k += `<path d="M2.8 -7.9 L3.5 -8 Q3.9 -7.7 3.6 -7.2 L3.3 -7.4 L2.8 -7.4 Z" fill="#3a3a3a"/><path d="M2.6 -8 L3 -8 L3 -7.4 L2.6 -7.4 Z" fill="#f2c430"/>`;
    k += `<circle cx="2.2" cy="-8.1" r=".15" fill="#5a3a10"/><path d="M1.9 -8.35 q.3 -.15 .6 0" stroke="#2a1a0c" stroke-width=".1" fill="none"/>`;
    k += `<path d="M.5 -.6 L.4 0 M1.2 -.6 L1.3 0" stroke="#e8c540" stroke-width=".32"/><path d="M0 0 L1.8 0" stroke="#1a1a1a" stroke-width=".15"/>`;
    return gr(m, dir, k);
  };

  /* ---------------- MEERESTIERE: Hai, Delfin, Buckelwal, Fisch, Qualle, Möwe ---------------- */
  /* Meerestiere liegen waagrecht; Ursprung = Körpermitte */
  T.hai = (m, dir = 1) => {
    const O = LG("tw_hai", [[0, "#6f7f8c"], [0.5, "#8a98a3"], [0.56, "#eef0ee"], [1, "#d9dcd8"]]);
    const d = "M-24 -1.6 C-18 -3 -8 -6.4 4 -6 Q14 -5.4 21 -2.2 Q24.6 -.8 24.6 0 Q24.4 1.6 21 2.4 Q14 4.4 2 4 C-8 3.6 -18 1.6 -24 .6 Z";
    let k = `<path d="M-21 -1.8 L-27.6 -9.6 L-25 -1 L-28.4 6.4 L-21 .4 Z" fill="#76858f"/>`;
    k += `<path d="M-2 -5.8 L1.6 -14.6 L7 -5.8 Z" fill="#76858f"/>`;
    k += koerper(d, O);
    k += `<path d="M5 2.6 L-2 9 L.6 9.2 L9 3.4 Z" fill="#6b7b86"/>`;
    for (let i = 0; i < 5; i++) k += `<path d="M${f(12 - i * 1.2)} -1.6 q-.6 1.8 0 3.6" stroke="#55626b" stroke-width=".25" fill="none"/>`;
    k += auge(18.4, -1.4, 0.45, "#0b0d10") + `<path d="M17.6 2.2 Q20 3 22.6 1.8" stroke="#3d464d" stroke-width=".25" fill="none"/>`;
    return gr(m, dir, k);
  };
  T.delfin = (m, dir = 1, steigen = 0) => {
    const O = LG("tw_del", [[0, "#5f6f7c"], [0.5, "#8996a1"], [0.62, "#dfe4e6"], [1, "#eef0f0"]]);
    const d = "M-11 -.6 C-7 -2 -2 -4.2 4 -3.8 Q7.6 -3.2 8.6 -1.6 L11.6 -1 Q12.2 -.6 11.6 -.2 L8.6 .4 Q6 1.8 2 2 C-4 2 -8 .6 -11 .2 Z";
    let k = `<path d="M-10.6 -.4 L-13.6 -3.6 Q-13 -1 -12.4 0 Q-13 1.2 -13.4 3 L-10.6 .4 Z" fill="#65737f"/>`;
    k += `<path d="M-1 -3.8 Q0 -7.2 -2.4 -8 Q2.4 -6.4 2.8 -3.8 Z" fill="#65737f"/>`;
    k += koerper(d, O);
    k += `<path d="M2.6 1.4 Q2 3.6 .2 4.2 Q2.6 4 4.2 1.6 Z" fill="#6b7985"/>`;
    k += `<path d="M8.6 -1.2 Q10 -.4 11.4 -.6" stroke="#3d464d" stroke-width=".15" fill="none"/>` + auge(7.2, -1.1, 0.26, "#0b0d10");
    k += `<path d="M6.4 -3.4 Q7.6 -3.4 8.4 -2" stroke="#fff" stroke-width=".25" opacity=".45" fill="none"/>`;
    return gr(m, dir, `<g transform="rotate(${-steigen})">${k}</g>`);
  };
  T.wal = (m, dir = 1) => {
    const O = LG("tw_wal", [[0, "#2f3a46"], [0.55, "#3d4a57"], [0.7, "#6d7a86"], [1, "#a9b2b8"]]);
    const d = "M-60 -1 C-44 -6 -20 -14 10 -13 Q40 -12 58 -4 Q64 -1 63 2 Q60 6 48 7 C30 9 0 10 -26 6 C-40 4 -52 1.6 -60 1 Z";
    let k = `<path d="M-57 -.6 L-70 -9 Q-74 -10 -76 -8 L-72 -2 L-76 3 Q-74 6 -70 5 L-57 1 Z" fill="#2e3944"/>`;
    k += `<path d="M-74 -8.6 l2 1.4 l-1 1 Z M-75 4.8 l2 -1 l-1 -1.2 Z" fill="#c9cfd2" opacity=".7"/>`;
    k += `<path d="M-22 -9 Q-20 -12.6 -16 -12.4 Q-18 -10.4 -16 -9.4 Z" fill="#2e3944"/>`;
    k += koerper(d, O);
    /* Kehlfurchen */
    for (let i = 0; i < 7; i++) k += `<path d="M${f(58 - i * 0.6)} ${f(3 + i * 0.7)} Q30 ${f(7 + i * 0.45)} 6 ${f(8.4 + i * 0.1)}" stroke="#1f2730" stroke-width=".35" fill="none" opacity=".45"/>`;
    /* lange Brustflosse (Buckelwal), weiß gerandet, mit Höckern */
    k += `<path d="M30 4 C22 12 10 22 -2 26 Q-4 26 -3 24 C6 18 16 10 22 3 Z" fill="${LG("tw_walf", [[0, "#3a4652"], [1, "#d7dcde"]], 0, 0, 1, 1)}"/>`;
    for (let i = 0; i < 5; i++) k += `<circle cx="${f(24 - i * 5.2)}" cy="${f(6.4 + i * 3.8)}" r=".7" fill="#e8ecee" opacity=".7"/>`;
    /* Knubbel am Kopf */
    for (let i = 0; i < 8; i++) k += `<circle cx="${f(44 + i * 2.2)}" cy="${f(-9.6 + i * 0.95)}" r=".55" fill="#232c35"/>`;
    k += auge(46, 1.6, 0.6, "#0b0d10") + `<path d="M62 1.6 Q54 2.6 42 2.4" stroke="#1a2128" stroke-width=".4" fill="none"/>`;
    for (let i = 0; i < 6; i++) k += `<ellipse cx="${f(-10 + i * 9 + rnd() * 4)}" cy="${f(-6 + rnd() * 6)}" rx="${f(0.8 + rnd() * 1.2)}" ry=".4" fill="#c9cfd2" opacity=".25"/>`;
    return gr(m, dir, k);
  };
  T.fisch = (m, dir = 1, farbe = "hering") => {
    const O = farbe === "makrele"
      ? LG("tw_mak", [[0, "#1f4f63"], [0.45, "#3d8aa0"], [0.55, "#d8e6ea"], [1, "#f2f6f6"]])
      : LG("tw_her", [[0, "#3c5f78"], [0.4, "#7fa3b8"], [0.5, "#dbe6ec"], [1, "#f4f7f8"]]);
    const d = "M-1.5 -.15 C-1 -.5 .2 -.75 1.1 -.55 Q1.7 -.35 1.85 0 Q1.7 .35 1.1 .45 C.2 .6 -1 .4 -1.5 .15 Z";
    let k = `<path d="M-1.4 0 L-2.1 -.55 L-1.95 0 L-2.1 .55 Z" fill="#5b7a8e"/>`;
    k += `<path d="${d}" fill="${O}"/>`;
    if (farbe === "makrele") for (let i = 0; i < 5; i++) k += `<path d="M${f(-1 + i * 0.45)} -.48 q.15 .2 0 .36" stroke="#14303c" stroke-width=".08" fill="none"/>`;
    k += `<circle cx="1.25" cy="-.12" r=".12" fill="#0e1418"/><circle cx="1.28" cy="-.15" r=".04" fill="#fff"/>`;
    k += `<path d="M.8 -.35 Q.95 0 .8 .3" stroke="#56707e" stroke-width=".05" fill="none"/>`;
    return gr(m, dir, k);
  };
  T.qualle = (m, art = "ohren") => {
    const S1 = RG("tw_qu", [[0, "#f6e9ff", 0.85], [0.7, "#d9c6ef", 0.55], [1, "#bfa9e0", 0.35]], 0.5, 0.3, 0.7);
    let k = `<path d="M-3 0 Q-3 -3 0 -3.2 Q3 -3 3 0 Q2 -.4 1.5 .1 Q.8 -.3 0 .1 Q-.8 -.3 -1.5 .1 Q-2 -.4 -3 0 Z" fill="${S1}" stroke="#e8dcf5" stroke-width=".08"/>`;
    /* vier Ringe (Gonaden) der Ohrenqualle */
    for (const [x, y] of [[-1, -1.6], [1, -1.6], [-.4, -.9], [.6, -.9]]) k += `<circle cx="${x}" cy="${y}" r=".42" fill="none" stroke="#a46bbf" stroke-width=".18" opacity=".8"/>`;
    for (let i = 0; i < 4; i++) k += `<path d="M${f(-0.9 + i * 0.6)} 0 q${f(-0.4 + (i % 2) * 0.8)} 1.6 0 3.2 q.4 1 -.1 2" stroke="#e7d6f3" stroke-width=".22" fill="none" opacity=".75"/>`;
    for (let i = 0; i < 9; i++) k += `<path d="M${f(-2.8 + i * 0.7)} ${f(-0.1)} q${f(0.3)} 2.4 ${f(-0.2)} ${f(4 + (i % 3))}" stroke="#efe4f8" stroke-width=".06" fill="none" opacity=".6"/>`;
    return gr(m, 1, k);
  };
  T.moewe = (m, dir = 1, fluegel = 0) => {
    let k = "";
    /* Silbermöwe im Flug: graue Flügel, schwarze Spitzen mit weißen Flecken */
    const fl = (s) => `<path d="M-.6 -.2 Q${-2} ${f(-3 - fluegel)} ${-5.6} ${f(-3.6 - fluegel)} L${-6.6} ${f(-3.4 - fluegel)} Q-3 ${f(-1.2 - fluegel * 0.4)} -.2 .4 Z" fill="${s ? "#a8b3bb" : "#b9c3ca"}"/>` +
      `<path d="M-5.6 ${f(-3.6 - fluegel)} L-6.6 ${f(-3.4 - fluegel)} L-5.2 ${f(-2.8 - fluegel)} Z" fill="#1d1d1f"/>`;
    k += `<g transform="translate(1.4 0) scale(.85)">${fl(1)}</g>`;
    k += `<path d="M-3 .2 Q-1 -.8 2.2 -.4 Q3.2 -.2 3.4 .3 Q2.4 .9 .6 .9 Q-1.6 .9 -3 .2 Z" fill="#f8f9f9"/>`;
    k += `<path d="M-3 .2 L-3.9 0 L-3.8 .6 Z" fill="#f0f2f2"/>`;
    k += `<path d="M3.3 .1 L4.3 .3 Q4.4 .5 4.1 .6 L3.3 .6 Z" fill="#f2c62e"/><circle cx="4" cy=".5" r=".09" fill="#d33"/>`;
    k += `<circle cx="2.8" cy="-.05" r=".12" fill="#222"/>`;
    k += `<g transform="translate(.6 .3) scale(1 1)">${fl(0)}</g>`;
    return gr(m, dir, k);
  };
  return T;
}
module.exports = { tierBaukasten };
if (require.main !== module) return;

/* =====================================================================
   DIE SZENE „DER ZOO“ folgt hier.
   ===================================================================== */
/* =====================================================================
   DER ZOO — Afrika-Panorama mit Raubkatzen und Menschenaffen
   ---------------------------------------------------------------------
   RECHERCHE (Zoo Leipzig Kiwara-Savanne, Tierpark Hagenbeck
   „Afrika-Panorama“, Zoo Frankfurt Katzendschungel/Menschenaffenhaus):
   - Moderne deutsche Zoos zeigen Huftiere als GEMISCHTE SAVANNE
     (Giraffen, Zebras, Nashörner, Antilopen), die Besucher schauen über
     einen versteckten WASSERGRABEN — kein Gitter im Blick. Davor oft ein
     FLAMINGOTEICH (Hagenbeck: Panorama-Prinzip, Teich vorne, Steppe
     dahinter). Flusspferde liegen tagsüber im Wasser, nur Rücken, Augen,
     Ohren und Nüstern schauen heraus.
   - RAUBKATZEN in Anlagen mit Kunstfelsen, Badebecken und hohem
     Stahlnetz-ZAUN mit nach innen geneigtem Überhang; Löwe und Tiger
     getrennt (Trennfelsen).
   - MENSCHENAFFEN hinter großen GLASSCHEIBEN (Zoo Frankfurt), dahinter
     Kletterstämme, Seile, Heu; das Affenhaus mit Glasdach.
   - Am Weg: INFOTAFEL am Gehege, WEGWEISER mit Pfeilen, LAGEPLAN,
     Bänke unter Bäumen, Mülleimer; eine TIERPFLEGERIN in grüner
     Arbeitskleidung mit Futtereimer (kommentierte Fütterung).
   Blick: leicht erhöht (Aussichtspunkt, Augenhöhe ≈ 6 m), Horizont
   y = 50. Maßstab je nach Tiefe: m(y) = 0,1655·(y − 50) Einheiten je
   Meter (vorne am Weg ≈ 24, an der Savanne ≈ 8–9).
   ===================================================================== */
const S = neueSzene({ id: "zoo", titel: "Der Zoo", emoji: "🐘", thema: "Natur", kuerzel: "b19a", fassung: 852 });
const rnd = zufall(1907);
const T = tierBaukasten(S);
const HOR = 50, M = (y) => 0.1655 * (y - HOR);
/* FASSUNG 883 — XANDER (Funk 302): „schaue auch was du mit den anderen Tieren machst dass sie wirklich realistisch
   sind“. Wo die Tier-Bibliothek (werkzeug/bilderwelt/tiere, Werkzeug 880, wie „Tiere der Savanne“) eine Art hat und
   sie HIER in der Szene klar besser aussieht, kommt das Tier aus der Bibliothek (tierKunst: gleiche Zeichnung wie
   tierTeil, Szenen-Modus ohne Filter, eigener Boden- und Kontaktschatten). Maßstab: epm = M(y) Einheiten je Meter
   an der Stelle der Hufe/Pfoten – dieselbe Perspektive wie beim Baukasten. Wort, Tipp und Ort jedes Teils bleiben. */
const { tierKunst } = require("../tiere/szene.js");
/* Je Tier vorher/nachher im echten Szenenausschnitt verglichen (Telefonbreite 1170 px und dreifach groß), dazu ein
   zweiter Blick als Blindvergleich A/B. Ergebnis:
   - aus der Bibliothek: Gorilla (vorher ein schwarzer Klotz, kaum zu erkennen), Elefant.
   - ebenfalls klar besser, aber NICHT eingeschaltet, weil die Szene sonst über 70 KB gepackt käme (Ladezeit hat
     Vorrang): Nashorn (+3,0 KB), Giraffe (+3,7 KB), Löwe (+4,2 KB, steht dann auf dem Felsen). Alle drei sind fertig
     verdrahtet – Name hier eintragen, sobald Platz ist (z. B. wenn die sechs Menschen der Szene leichter werden:
     sie sind die Hälfte der Datei).
   - Baukasten bleibt: Nilpferd (im Wasser liest sich der Baukasten-Kopf besser), Tiger (Bibliotheks-Kopf wirkt fremd,
     Streifen nur oben), Schimpanse (in der Größe ist der sitzende Baukasten-Schimpanse besser zu erkennen), Zebra (das
     alte, Funk 302), Flamingo (keine Art in der Bibliothek). */
const AUS_BIB = new Set(["elefant", "gorilla"]);
const bib = (id, x, y, epm, o = {}) => tierKunst(S, id, x, y, epm, o).kunst;
/* Menschen: Pfaddaten auf 0,5 cm gerundet — unsichtbar, spart ein Drittel der Ladezeit */
const zahl = (x, st) => String(+(Math.round(+x / st) * st).toFixed(1)).replace(/^(-?)0\./, "$1.");
const schlank = (svg) => svg.replace(/ d="([^"]*)"/g, (a, d) => ` d="${d.replace(/-?\d*\.?\d+/g, (x) => zahl(x, 1)).replace(/\s*,\s*/g, " ").replace(/\s*([A-Za-z])\s*/g, "$1").replace(/ -/g, "-")}"`)
  .replace(/ (c[xy]|x[12]?|y[12]?|width|height)="(-?[\d.]+)"/g, (a, n, v) => ` ${n}="${zahl(v, 0.5)}"`)
  .replace(/ (r[xy]?)="(-?[\d.]+)"/g, (a, n, v) => ` ${n}="${zahl(v, 0.1)}"`);
const mensch = (spec, groesse, y) => schlank(B.mensch(spec, groesse * M(y)).svg);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

/* =====================================================================
   KULISSE: Himmel, Baumkulisse, Affenhaus, Savanne, Gehegeböden
   ===================================================================== */
S.hinten(`<rect width="320" height="60" fill="${S.lg("himmel", [[0, "#8fbfe6"], [0.7, "#cfe3ef"], [1, "#e8eee6"]])}"/>`);
for (const [x, y, w] of [[60, 14, 30], [190, 9, 40], [270, 20, 24]]) S.hinten(`<g fill="#fff" opacity=".75"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="4"/><ellipse cx="${x - w * 0.3}" cy="${y - 3}" rx="${w * 0.4}" ry="4"/><ellipse cx="${x + w * 0.25}" cy="${y - 2.5}" rx="${w * 0.35}" ry="3.4"/></g>`);
/* ferne Bäume des Zooparks */
{
  let g = "", p = "M0 58 L0 44";
  for (let x = 0; x <= 320; x += 9) p += ` Q${x + 4.5} ${r(30 + rnd() * 10)} ${x + 9} ${r(40 + rnd() * 6)}`;
  g += `<path d="${p} L320 58 Z" fill="${S.lg("fernbaum", [[0, "#6f9160"], [1, "#4f6e45"]])}"/>`;
  for (let i = 0; i < 24; i++) g += `<circle cx="${r(rnd() * 320)}" cy="${r(38 + rnd() * 12)}" r="${r(2 + rnd() * 3)}" fill="#86a674" opacity=".35"/>`;
  S.hinten(g);
}
/* Giraffenhaus mit Reetdach (Lodge-Stil) hinten links */
S.hinten(`<rect x="8" y="49" width="30" height="10" fill="#b48d5c"/><rect x="18" y="51" width="8" height="8" fill="#5a3d22"/><path d="M4 50 L23 38 L42 50 Z" fill="${S.lg("reet", [[0, "#c8a565"], [1, "#94733c"]])}"/>` +
  `<path d="M8 49 L23 39.5 M15 49.6 L23 40 M30 49.6 L23 40 M38 49 L23 39.5" stroke="#7d6032" stroke-width=".3" opacity=".6"/>`);
/* Savanne: trockenes Gras, Erde, Kopje-Felsen, Schirmakazie */
{
  let g = `<rect x="0" y="54" width="320" height="64" fill="${S.lg("savanne", [[0, "#cdbb7f"], [0.5, "#bfae6c"], [1, "#a99a58"]])}"/>`;
  g += `<path d="M0 54 Q80 52 160 55 T320 54 L320 58 L0 58 Z" fill="#b9a666" opacity=".6"/>`;
  for (const [x, y, w] of [[40, 80, 26], [120, 96, 30], [200, 88, 22], [90, 66, 18]]) g += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.12}" fill="#9c7c4c" opacity=".35"/>`;
  for (let i = 0; i < 90; i++) {
    const y = 56 + rnd() * 58, x = rnd() * 320, h = 0.6 + (y - 50) * 0.03;
    g += `<path d="M${r(x)} ${r(y)} l${r(-0.4 * h)} ${r(-h)} M${r(x)} ${r(y)} l${r(0.3 * h)} ${r(-h * 1.1)}" stroke="${rnd() < 0.5 ? "#8f8248" : "#d8c98f"}" stroke-width=".3"/>`;
  }
  /* Kopje: gerundete Granitblöcke */
  g += `<path d="M138 79 Q140 68 150 66 Q158 63 164 68 Q172 66 176 72 Q180 76 178 80 Z" fill="${S.lg("granit", [[0, "#b9ab99"], [1, "#857867"]])}"/>`;
  g += `<path d="M150 66 Q154 72 152 79 M164 68 Q166 74 165 80" stroke="#6f6354" stroke-width=".4" fill="none" opacity=".6"/><path d="M142 72 Q147 67 154 67" stroke="#e2d8ca" stroke-width=".6" fill="none" opacity=".6"/>`;
  /* Schirmakazie */
  g += `<path d="M206 76 Q207 66 204 58 M205 64 Q210 60 214 57 M205 62 Q200 59 197 57" stroke="#5b4630" stroke-width="1" fill="none"/>`;
  g += `<path d="M188 57 Q190 51 205 50 Q222 50 226 56 Q214 59 205 58 Q194 59 188 57 Z" fill="${S.lg("akazie", [[0, "#7f9a4c"], [1, "#56702f"]])}"/>`;
  g += `<ellipse cx="206" cy="77" rx="7" ry="1" fill="#6b5a35" opacity=".4"/>`;
  S.hinten(g);
}
/* Affenhaus hinten rechts: Halle mit Glasdach, Bambus als Grenze */
{
  let g = `<rect x="242" y="66" width="78" height="48" fill="${S.lg("affhaus", [[0, "#c9b79a"], [1, "#a8937a"]])}"/>`;
  g += `<path d="M238 66 L281 52 L324 66 Z" fill="${S.lg("glasdach", [[0, "#cfe3ec"], [1, "#8fb3c4"]])}"/>`;
  for (let i = 0; i < 9; i++) g += `<path d="M${r(281 - 43 + i * 10.75)} 66 L281 52" stroke="#6e8794" stroke-width=".35"/>`;
  g += `<rect x="242" y="66" width="78" height="2" fill="#6e5a44"/>`;
  for (let i = 0; i < 6; i++) g += `<rect x="${248 + i * 12}" y="72" width="8" height="14" fill="#7d96a2"/><rect x="${248 + i * 12}" y="72" width="8" height="2" fill="#a9c2cc"/>`;
  g += `<text x="281" y="94" font-size="4.2" text-anchor="middle" fill="#4b3a28" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".5">MENSCHENAFFEN</text>`;
  /* Bambus */
  for (let i = 0; i < 14; i++) { const x = 234 + i * 1.1 + rnd(); g += `<path d="M${r(x)} 116 Q${r(x + rnd() * 2 - 1)} 90 ${r(x + rnd() * 4 - 2)} ${r(66 + rnd() * 8)}" stroke="${rnd() < 0.5 ? "#6f8f3a" : "#86a54a"}" stroke-width=".7" fill="none"/>`; }
  for (let i = 0; i < 40; i++) { const x = 230 + rnd() * 18, y = 66 + rnd() * 44; g += `<path d="M${r(x)} ${r(y)} l${r(3 + rnd() * 2)} ${r(1 + rnd())}" stroke="#5f8a34" stroke-width="1" stroke-linecap="round"/>`; }
  S.hinten(g);
}
/* Raubkatzen-Anlage (links): Kunstfelsen hinten, Sandboden, Trennfelsen, Badebecken */
{
  let g = `<path d="M0 98 Q20 92 40 96 Q60 90 80 96 Q90 98 96 104 L96 154 L0 154 Z" fill="${S.lg("katzboden", [[0, "#c2a97c"], [1, "#a68c62"]])}"/>`;
  g += `<path d="M0 100 Q10 88 26 92 Q40 86 52 94 Q66 86 82 94 Q94 96 98 108 L98 116 Q60 112 0 116 Z" fill="${S.lg("kunstfels", [[0, "#b49a7c"], [1, "#8c7458"]])}"/>`;
  g += `<path d="M10 96 Q14 104 12 114 M40 92 Q44 102 42 113 M66 92 Q70 102 68 112" stroke="#6e5a44" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Trennfelsen zwischen Löwe und Tiger */
  g += `<path d="M44 152 L46 116 Q48 108 52 112 L54 152 Z" fill="${S.lg("trennfels", [[0, "#ad957a", 1], [1, "#7f6a53"]], 0, 0, 1, 0)}"/>`;
  /* Badebecken der Tiger */
  g += `<ellipse cx="76" cy="136" rx="16" ry="3.4" fill="${S.lg("katzwasser", [[0, "#5d8a8c"], [1, "#3f6b70"]])}"/><path d="M62 136 Q76 133 90 136" stroke="#cfe2e0" stroke-width=".4" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 30; i++) { const x = rnd() * 96, y = 118 + rnd() * 34; g += `<path d="M${r(x)} ${r(y)} l-.4 -1.4 M${r(x)} ${r(y)} l.4 -1.5" stroke="#8a7a46" stroke-width=".3" opacity=".7"/>`; }
  S.hinten(g);
}
/* Menschenaffen-Freianlage (rechts hinter der Glasscheibe) */
{
  let g = `<rect x="240" y="112" width="80" height="40" fill="${S.lg("affboden", [[0, "#9aa264"], [1, "#7f8a4e"]])}"/>`;
  for (let i = 0; i < 40; i++) { const x = 240 + rnd() * 80, y = 114 + rnd() * 36; g += `<path d="M${r(x)} ${r(y)} l${r(1 + rnd() * 2)} ${r(-0.4)}" stroke="#d4bf72" stroke-width=".35" opacity=".8"/>`; }
  /* Kletterstämme und Seile */
  g += `<path d="M252 150 L254 96 M290 150 L288 100 M314 150 L313 98" stroke="#6a4e34" stroke-width="2.4" stroke-linecap="round"/>`;
  g += `<path d="M254 104 L288 108 M288 112 L313 106" stroke="#7a5a3c" stroke-width="1.4"/><path d="M262 105 Q268 116 276 107 M296 110 Q300 122 306 108" stroke="#c9b08a" stroke-width=".6" fill="none"/>`;
  g += `<rect x="250" y="130" width="24" height="3" rx="1" fill="#7a5a3c"/><path d="M252 133 L252 150 M272 133 L272 150" stroke="#6a4e34" stroke-width="1.6"/>`;
  S.hinten(g);
}

/* =====================================================================
   SAVANNE: Giraffe, Elefant, Nashorn, Zebras
   ===================================================================== */
S.teil({ id: "giraffe", de: "die Giraffe", syl: "Gi-RAF-fe", it: "la giraffa", itSyl: "gi-RAF-fa", en: "giraffe", x: 52, y: 98,
  kunst: AUS_BIB.has("giraffe") ? bib("giraffe", 52, 98, M(98), { dir: 1 }) : schatten(1, 0, 10, 1.2, 0.25) + T.giraffe(M(98)),
  tipp: "Fünf Meter hoch — das höchste Tier der Erde. Ihr Hals hat genauso viele Wirbel wie deiner: sieben." });
S.teil({ id: "zebra", de: "das Zebra", syl: "ZE-bra", it: "la zebra", itSyl: "ZE-bra", en: "zebra", x: 104, y: 95,
  /* Funk 302: altes Zebra (Kopf höher und länger) – die zwei stehen Rücken an Rücken, damit sich die Köpfe nicht überdecken */
  kunst: `<g transform="translate(-11 -3)">${schatten(0, 0, 8, 0.9, 0.2)}${T.zebra(M(92), -1)}</g>` + schatten(0, 0, 8, 1, 0.25) + T.zebra(M(95)),
  tipp: "Ein Zebra ist weiß mit schwarzen Streifen — und jedes Muster gibt es nur einmal." });
S.teil({ id: "elefant", de: "der Elefant", syl: "E-le-fant", it: "l'elefante", itSyl: "e-le-FAN-te", en: "elephant", x: 158, y: 101,
  kunst: AUS_BIB.has("elefant") ? bib("elefant", 158, 101, M(101), { dir: -1 }) : schatten(0, 0, 16, 1.6, 0.28) + T.elefant(M(101), -1),
  tipp: "Der Rüssel ist Nase und Hand zugleich." });
S.teil({ id: "nashorn", de: "das Nashorn", syl: "NAS-horn", it: "il rinoceronte", itSyl: "ri-no-ce-RON-te", en: "rhinoceros", x: 208, y: 107,
  kunst: AUS_BIB.has("nashorn") ? bib("nashorn", 208, 107, M(107), { dir: -1 }) : schatten(0, 0, 15, 1.4, 0.28) + T.nashorn(M(107), -1),
  tipp: "Zwei Hörner — das vordere ist größer. Es steht dem Elefanten knapp bis an den Bauch." });

/* =====================================================================
   DER GRABEN (Wassergraben vor der Savanne) mit dem Flusspferd
   ===================================================================== */
{
  const x0 = 96, x1 = 240, y0 = 110, y1 = 124;
  let k = `<path d="M${x0} ${y0} Q168 ${y0 - 2} ${x1} ${y0} L${x1} ${y0 + 3} L${x0} ${y0 + 3} Z" fill="#8f8a52"/>`;
  k += `<rect x="${x0}" y="${y0 + 2.5}" width="${x1 - x0}" height="${y1 - y0 - 6}" fill="${S.lg("graben", [[0, "#4f6f5e"], [1, "#6b8a74"]])}"/>`;
  for (let i = 0; i < 14; i++) { const x = x0 + 6 + rnd() * (x1 - x0 - 12), y = y0 + 4 + rnd() * 6; k += `<path d="M${r(x)} ${r(y)} h${r(4 + rnd() * 8)}" stroke="#cfe0d4" stroke-width=".35" opacity=".55"/>`; }
  /* Spiegelung des Nashorns/Elefanten angedeutet, Schilf am Rand */
  for (let i = 0; i < 26; i++) { const x = x0 + rnd() * (x1 - x0); k += `<path d="M${r(x)} ${y0 + 3.4} q${r(rnd() - 0.5)} -2.6 ${r(rnd() * 1.4 - 0.7)} -4" stroke="#6f7f3c" stroke-width=".4" fill="none"/>`; }
  /* Natursteinmauer auf der Besucherseite */
  k += `<rect x="${x0}" y="${y1 - 3.6}" width="${x1 - x0}" height="4.6" fill="${S.lg("mauer", [[0, "#b1a593"], [1, "#8a7e6c"]])}"/>`;
  for (let x = x0; x < x1; x += 6) k += `<path d="M${x + (Math.round(x / 6) % 2) * 3} ${y1 - 3.6} v2.3 M${x + 3 - (Math.round(x / 6) % 2) * 3} ${y1 - 1.3} v2.3" stroke="#6e6455" stroke-width=".3"/>`;
  k += `<path d="M${x0} ${y1 - 1.3} H${x1}" stroke="#6e6455" stroke-width=".3"/><rect x="${x0}" y="${y1 - 3.8}" width="${x1 - x0}" height=".8" fill="#cfc4b2"/>`;
  S.teil({ id: "graben", de: "der Graben", syl: "GRA-ben", it: "il fossato", itSyl: "fos-SA-to", en: "moat", x: 0, y: 0, kunst: k,
    tipp: "Ein Graben statt eines Zauns: das Tier kommt nicht herüber, und man sieht es ohne Gitter davor." });
}
S.teil({ id: "nilpferd", de: "das Nilpferd", syl: "NIL-pferd", it: "l'ippopotamo", itSyl: "ip-po-PO-ta-mo", en: "hippopotamus", x: 124, y: 126,
  kunst: T.nilpferd(M(126), -1, 8.2),
  tipp: "Kein Horn, dafür ein riesiges Maul." });

/* =====================================================================
   DER TEICH mit den Flamingos (vor dem Graben)
   ===================================================================== */
{
  let k = `<path d="M94 122 L240 122 L240 152 L94 152 Z" fill="${S.lg("ufer", [[0, "#8fa35c"], [1, "#748a45"]])}"/>`;
  k += `<path d="M104 140 Q102 129 124 128 Q170 125 214 128 Q236 130 234 141 Q232 150 200 150.5 Q150 152 122 150 Q104 149 104 140 Z" fill="${S.lg("teich", [[0, "#6e9fae"], [0.6, "#4f8395"], [1, "#3f6f80"]])}"/>`;
  k += `<path d="M104 140 Q102 129 124 128 Q170 125 214 128 Q236 130 234 141" stroke="#d9cfb8" stroke-width="1" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 10; i++) { const x = 112 + rnd() * 110, y = 131 + rnd() * 16; k += `<path d="M${r(x)} ${r(y)} h${r(5 + rnd() * 8)}" stroke="#e6f1f3" stroke-width=".35" opacity=".6"/>`; }
  for (const [x, y] of [[106, 146], [230, 145], [120, 149], [216, 150]]) k += `<path d="M${x} ${y} q-1 -4 -.4 -7 M${x + 1} ${y} q.6 -4 1.6 -6 M${x - 1} ${y} q-1.4 -3 -2.4 -4" stroke="#5f7a32" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "teich", de: "der Teich", syl: "TEICH", it: "lo stagno", itSyl: "STA-gno", en: "pond", x: 0, y: 0, kunst: k });
}
{
  let k = "";
  for (const [dx, y, dir, unten] of [[-20, 137, 1, false], [-6, 140, -1, true], [8, 136, 1, false], [18, 144, -1, false]]) {
    k += `<g transform="translate(${dx} ${y - 146})"><ellipse cx="0" cy=".2" rx="2.6" ry=".6" fill="#2d5566" opacity=".35"/>${T.flamingo(M(y), dir, unten)}</g>`;
  }
  S.teil({ id: "flamingo", de: "der Flamingo", syl: "Fla-MIN-go", it: "il fenicottero", itSyl: "fe-ni-COT-te-ro", en: "flamingo", x: 146, y: 146, kunst: k,
    tipp: "Er steht auf EINEM Bein — und sein Knick in der Mitte des Beines ist nicht das Knie, sondern die Ferse." });
}

/* =====================================================================
   RAUBKATZEN: Löwe auf dem Felsen, Tiger am Becken
   ===================================================================== */
{
  let k = `<path d="M-22 18 Q-24 6 -16 2 Q-6 -2 6 1 Q16 3 18 12 L20 18 Z" fill="${S.lg("loefels", [[0, "#c2a98a"], [1, "#8d7559"]])}"/>`;
  k += `<path d="M-14 3 Q-10 10 -12 18 M4 1.6 Q8 9 6 18" stroke="#6e5a44" stroke-width=".5" fill="none" opacity=".6"/><path d="M-18 4 Q-8 -.6 4 .8" stroke="#e3d6c4" stroke-width=".7" fill="none" opacity=".5"/>`;
  /* Bibliotheks-Löwe steht (die Bibliothek hat keinen liegenden): Pfoten auf der flachen Kuppe des Felsens */
  k += AUS_BIB.has("loewe") ? `<g transform="translate(-5 .5)">${bib("loewe", 0, 0, M(140), { dir: 1 })}</g>` : `<g transform="translate(-2 1.6)">${T.katze("loewe", M(140), 1, "liegen")}</g>`;
  S.teil({ id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: 24, y: 122, kunst: k,
    tipp: "Nur das Männchen hat eine Mähne." });
}
S.teil({ id: "tiger", de: "der Tiger", syl: "TI-ger", it: "la tigre", itSyl: "TI-gre", en: "tiger", x: 74, y: 147,
  kunst: schatten(0, 0, 14, 1.2, 0.25) + T.katze("tiger", M(147), -1),
  tipp: "Die größte Katze der Welt — und jede hat ihr eigenes Streifenmuster." });
/* Der Zaun: Stahlnetz mit Überhang; das Netz lässt Tipps zu den Katzen durch */
{
  const y = 154, h = 3.4 * M(y), top = y - h;
  let k = `<rect x="0" y="${r(top)}" width="96" height="${r(h)}" fill="url(#${S.id("netz")})" pointer-events="none"/>`;
  S.def(`<pattern id="${S.id("netz")}" patternUnits="userSpaceOnUse" width="2.4" height="2.4"><path d="M0 0 L2.4 2.4 M2.4 0 L0 2.4" stroke="#3d4448" stroke-width=".16" opacity=".55"/></pattern>`);
  for (const x of [1.5, 48, 95]) {
    k += `<rect x="${x - 0.9}" y="${r(top)}" width="1.8" height="${r(h)}" fill="${S.lg("pfosten", [[0, "#5d666c"], [0.5, "#8d969b"], [1, "#4a5156"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x} ${r(top)} l5 -5" stroke="#5d666c" stroke-width=".9"/>`;
    k += `<rect x="${x - 1.6}" y="${y - 1}" width="3.2" height="1.6" fill="#8a8a84"/>`;
  }
  k += `<path d="M0 ${r(top)} H96 M5 ${r(top - 5)} H101 M0 ${y - 1} H96" stroke="#5d666c" stroke-width=".9"/>`;
  k += `<path d="M0 ${r(top)} L96 ${r(top)} L101 ${r(top - 5)} L5 ${r(top - 5)} Z" fill="url(#${S.id("netz")})" pointer-events="none"/>`;
  S.teil({ id: "zaun", de: "der Zaun", syl: "ZAUN", it: "la recinzione", itSyl: "re-cin-ZIO-ne", en: "fence", x: 0, y: 0, kunst: k,
    tipp: "Durch das Gitter sieht man die Tiere — hinüber kommt keines." });
}

/* =====================================================================
   MENSCHENAFFEN hinter der Glasscheibe: Gorilla, Schimpanse
   ===================================================================== */
S.teil({ id: "gorilla", de: "der Gorilla", syl: "Go-RIL-la", it: "il gorilla", itSyl: "go-RIL-la", en: "gorilla", x: 290, y: 147,
  /* Bibliothek: 5 Einheiten weiter rechts, sonst steht das Gesicht genau hinter dem Fensterpfosten (x ≈ 280) */
  kunst: AUS_BIB.has("gorilla") ? `<g transform="translate(5 0)">${bib("gorilla", 0, 0, M(147), { dir: -1 })}</g>` : schatten(0, 0, 11, 1, 0.3) + T.gorilla(M(147), -1),
  tipp: "Der Silberrücken ist das alte Männchen: nur er hat den grauen Sattel auf dem Rücken." });
S.teil({ id: "schimpanse", de: "der Schimpanse", syl: "Schim-PAN-se", it: "lo scimpanzé", itSyl: "scim-pan-ZÉ", en: "chimpanzee", x: 262, y: 130,
  kunst: T.schimpanse(M(142), -1),
  tipp: "Kleiner und schlanker als der Gorilla, mit großen abstehenden Ohren." });
/* Rahmen der Glasscheiben (Kulisse) und Spiegelung (davor) */
S.hinten(``);
{
  const y = 152, top = y - 3 * M(y);
  S.davor(`<g pointer-events="none"><rect x="240" y="${r(top)}" width="80" height="${r(y - top)}" fill="${S.lg("affglas", [[0, "#e8f4f8", 0.22], [0.5, "#ffffff", 0.06], [1, "#d6eaf0", 0.18]], 0, 0, 1, 1)}"/>` +
    `<path d="M246 ${r(y - 2)} L262 ${r(top + 2)} L270 ${r(top + 2)} L254 ${r(y - 2)} Z" fill="#fff" opacity=".14"/><path d="M290 ${r(y - 2)} L302 ${r(top + 2)} L306 ${r(top + 2)} L294 ${r(y - 2)} Z" fill="#fff" opacity=".12"/>` +
    `<rect x="239" y="${r(top)}" width="1.6" height="${r(y - top)}" fill="#59636a"/><rect x="279.2" y="${r(top)}" width="1.4" height="${r(y - top)}" fill="#59636a"/><rect x="238" y="${r(top - 1.4)}" width="82" height="1.6" fill="#59636a"/><rect x="238" y="${y - 2}" width="82" height="2.4" fill="#6b655b"/></g>`);
}

/* =====================================================================
   DER WEG (Pflaster in Fluchtperspektive)
   ===================================================================== */
{
  let k = `<path d="M0 152 L320 152 L320 200 L0 200 Z" fill="${S.lg("weg", [[0, "#c9c1b3"], [1, "#b3aa9b"]])}"/>`;
  for (let i = -13; i <= 13; i++) {
    /* Fuge von der Wegkante nach vorn, am Bildrand abgeschnitten */
    const xa = 160 + i * 12, xb = 160 + i * 18, t = xb < 0 ? (0 - xa) / (xb - xa) : xb > 320 ? (320 - xa) / (xb - xa) : 1;
    k += `<line x1="${r(xa)}" y1="152" x2="${r(xa + (xb - xa) * t)}" y2="${r(152 + 48 * t)}" stroke="#968c7d" stroke-width=".25" opacity=".6"/>`;
  }
  for (const y of [155, 158.6, 162.8, 167.6, 173, 179, 185.6, 192.8]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#968c7d" stroke-width=".25" opacity=".6"/>`;
  k += `<rect x="0" y="151.6" width="320" height="1.6" fill="#8d8579"/><rect x="0" y="151.6" width="320" height=".5" fill="#e4ddd0"/>`;
  k += `<rect x="0" y="152" width="320" height="48" fill="${S.lg("weglicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   DER BAUM (Linde rechts am Weg)
   ===================================================================== */
{
  let k = schatten(0, 0, 10, 1.6, 0.3);
  k += `<path d="M-3 0 Q-2.4 -40 -2 -80 L2 -80 Q2.6 -40 4 0 Z" fill="${S.lg("stamm", [[0, "#5b4634"], [0.5, "#7a6048"], [1, "#4a382a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.6 -70 Q-10 -80 -16 -88 M1.6 -74 Q10 -84 14 -96 M0 -78 L0 -104" stroke="#5b4634" stroke-width="1.8" fill="none"/>`;
  for (let i = 0; i < 12; i++) k += `<path d="M${r(-2 + rnd() * 4)} ${r(-4 - rnd() * 50)} q.4 -2 0 -4" stroke="#3a2c20" stroke-width=".3" fill="none"/>`;
  const krone = [[-20, -104, 16], [-6, -116, 16], [-2, -96, 8], [-10, -92, 12], [-28, -94, 10], [-18, -122, 13]];
  for (const [x, y, rr] of krone) k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${S.rg("krone", [[0, "#7fa65a"], [0.7, "#5a8240"], [1, "#466a32"]], 0.4, 0.35, 0.7)}"/>`;
  for (let i = 0; i < 45; i++) { const [x, y, rr] = krone[i % krone.length], a = rnd() * 6.28, d = rnd() * rr; k += `<circle cx="${r(x + Math.cos(a) * d)}" cy="${r(y + Math.sin(a) * d)}" r="${r(1 + rnd() * 1.6)}" fill="${rnd() < 0.5 ? "#9cc072" : "#3e5f2c"}" opacity=".5"/>`; }
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 310, y: 168, kunst: k });
}

/* =====================================================================
   AM WEG: Infotafel, Wegweiser, Lageplan, Bank, Mülleimer, Eimer
   ===================================================================== */
{
  /* DAS SCHILD — Infotafel am Raubkatzengehege (schräges Pult) */
  const s = M(158) / 10;
  let k = schatten(0, 0, 9, 0.8, 0.3) + `<g transform="scale(${r(s * 10) / 10})">`;
  k += `<rect x="-.4" y="-8" width=".8" height="8" fill="#3d4246"/>`;
  k += `<path d="M-5 -8.6 L5 -8.6 L5.6 -12.6 L-5.6 -12.6 Z" fill="#2f5d3a"/><path d="M-4.6 -9 L4.6 -9 L5.1 -12.2 L-5.1 -12.2 Z" fill="#f4efe0"/>`;
  k += `<text x="-4.6" y="-11" font-size="1" fill="#2f5d3a" font-family="Arial" font-weight="bold">LÖWE</text><text x="-4.6" y="-10.1" font-size=".5" fill="#333" font-family="Arial">Panthera leo · Afrika</text>`;
  k += `<text x=".4" y="-11" font-size="1" fill="#2f5d3a" font-family="Arial" font-weight="bold">TIGER</text><text x=".4" y="-10.1" font-size=".5" fill="#333" font-family="Arial">Panthera tigris · Asien</text>`;
  k += `<rect x="-4.4" y="-9.8" width="3.6" height=".5" fill="#c9a55a"/><rect x=".5" y="-9.8" width="3.6" height=".5" fill="#d4741f"/>`;
  k += `</g>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: 34, y: 158, kunst: k,
    tipp: "An jedem Gehege steht, welches Tier darin wohnt." });
}
{
  /* DER WEGWEISER — Pfosten mit Pfeilschildern */
  const s = M(160) / 10;
  let k = schatten(0, 0, 3, 0.6, 0.3) + `<g transform="scale(${r(s * 100) / 100})">`;
  k += `<rect x="-.35" y="-26" width=".7" height="26" fill="${S.lg("wwpf", [[0, "#5b4634"], [1, "#7a6048"]], 0, 0, 1, 0)}"/>`;
  const pfeil = (y, rechts, txt, f) => rechts
    ? `<path d="M-.2 ${y} L7.4 ${y} L8.6 ${y + 0.85} L7.4 ${y + 1.7} L-.2 ${y + 1.7} Z" fill="${f}"/><text x="3.6" y="${y + 1.25}" font-size="1" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${txt}</text>`
    : `<path d="M.2 ${y} L-7.4 ${y} L-8.6 ${y + 0.85} L-7.4 ${y + 1.7} L.2 ${y + 1.7} Z" fill="${f}"/><text x="-3.6" y="${y + 1.25}" font-size="1" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${txt}</text>`;
  k += pfeil(-26, true, "Afrika-Savanne", "#8a5a2a") + pfeil(-24, false, "Raubkatzen", "#b0542a") + pfeil(-22, true, "Menschenaffen", "#3f6b3a") + pfeil(-20, false, "Ausgang", "#3c5a7a");
  k += `</g>`;
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost", x: 186, y: 160, kunst: k,
    tipp: "Die Pfeile zeigen, wo es zu welchem Tier geht." });
}
{
  /* DIE TIERPFLEGERIN mit Futtereimer — kommentierte Fütterung an der Affenanlage */
  S.teil({ id: "tierpflegerin", de: "die Tierpflegerin", syl: "TIER-pfle-ge-rin", it: "la guardiana dello zoo", itSyl: "guar-DIA-na", en: "zookeeper", x: 230, y: 164,
    kunst: schatten(0, 0, 5, 0.8, 0.3) + mensch({ id: "b19a_pfl", geschlecht: "w", pose: "zeigen", blick: -40, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
      kleidung: { oberteil: { stueck: "hemd", farbe: "#4f6b3a" }, unterteil: { stueck: "arbeitshose", farbe: "#3f5530" }, schuhe: { stueck: "gummistiefel", farbe: "schwarz" } } }, 1.68, 164),
    tipp: "Sie füttert die Tiere und macht die Gehege sauber." });
  let k = schatten(0, 0, 3, 0.5, 0.3);
  k += `<path d="M-2.6 -5 L2.6 -5 L2.1 0 L-2.1 0 Z" fill="${S.lg("eimer", [[0, "#9aa3a8"], [0.5, "#dfe4e6"], [1, "#8a9399"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-5" rx="2.6" ry=".6" fill="#6b7378"/>`;
  k += `<ellipse cx="-.6" cy="-5.2" rx="1" ry=".5" fill="#d9a441"/><ellipse cx=".9" cy="-5.3" rx=".9" ry=".45" fill="#9c3b2a"/><ellipse cx=".1" cy="-5.6" rx=".8" ry=".4" fill="#6f9a3a"/>`;
  k += `<path d="M-2.6 -5 Q0 -9 2.6 -5" stroke="#5d666c" stroke-width=".3" fill="none"/>`;
  S.teil({ oben: true, id: "eimer", de: "der Eimer", syl: "EI-mer", it: "il secchio", itSyl: "SEC-chio", en: "bucket", x: 241, y: 166, kunst: k });
}
{
  /* DER LAGEPLAN — Tafel mit dem Zooplan */
  const s = M(197) / 10;
  let k = schatten(0, 0, 16, 1, 0.3) + `<g transform="scale(${r(s * 100) / 100})">`;
  k += `<rect x="-7" y="-20" width=".8" height="20" fill="#3d4246"/><rect x="6.2" y="-20" width=".8" height="20" fill="#3d4246"/>`;
  k += `<rect x="-7.6" y="-20.6" width="15.2" height="11.6" rx=".4" fill="#2f5d3a"/><rect x="-7" y="-19.4" width="14" height="10" fill="#e8e2c8"/>`;
  k += `<text x="0" y="-19.8" font-size=".75" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">LAGEPLAN</text>`;
  k += `<path d="M-6 -18 Q-2 -17 0 -14.6 Q2 -12 6 -12.4 M-4 -10 Q-2 -13 0 -14.6 M0 -14.6 Q3 -16.6 5.6 -18" stroke="#c9b48c" stroke-width=".55" fill="none"/>`;
  for (const [x, y, c] of [[-4, -17, "#b8a050"], [3, -17.4, "#6f9a3a"], [-4.6, -12, "#b0542a"], [4, -11, "#3c7aa0"], [0, -15.6, "#d07070"]]) k += `<rect x="${x - 1.2}" y="${y - 0.8}" width="2.4" height="1.6" rx=".3" fill="${c}" opacity=".8"/>`;
  k += `<circle cx="-1.6" cy="-11" r=".45" fill="#d22"/><text x="-1" y="-10.7" font-size=".6" fill="#d22" font-family="Arial" font-weight="bold">Sie sind hier</text>`;
  k += `</g>`;
  S.teil({ id: "lageplan", de: "der Lageplan", syl: "LA-ge-plan", it: "la piantina", itSyl: "pian-TI-na", en: "zoo map", x: 300, y: 197, kunst: k,
    tipp: "Hier steht, wo welches Tier wohnt." });
}
{
  /* DIE BANK unter dem Baum */
  const s = M(188) / 10;
  let k = schatten(0, 0.2, 18, 1.2, 0.3) + `<g transform="scale(${r(s * 100) / 100})">`;
  for (const x of [-7, 6]) k += `<path d="M${x} 0 L${x + 0.4} -4.4 L${x + 1} -4.4 L${x + 1} 0 Z" fill="#3d4246"/><path d="M${x + 0.6} -4.4 L${x + 0.2} -8.2" stroke="#3d4246" stroke-width=".5"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="-8" y="${-4.6 - i * 0.55}" width="16" height=".45" rx=".2" fill="${i ? "#8a5f36" : "#9c6c3e"}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="-8.2" y="${-8.6 + i * 1}" width="16.2" height=".75" rx=".2" fill="${S.lg("banklatte", [[0, "#a77444"], [1, "#7c522c"]])}"/>`;
  k += `</g>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: 264, y: 188, kunst: k });
}
{
  /* DER MÜLLEIMER */
  const s = M(193) / 10;
  let k = schatten(0, 0.2, 5, 0.8, 0.3) + `<g transform="scale(${r(s * 100) / 100})">`;
  k += `<rect x="-.25" y="-8.6" width=".5" height="8.6" fill="#3d4246"/>`;
  k += `<path d="M-2.4 -8.4 L2.4 -8.4 L2.1 -2.6 L-2.1 -2.6 Z" fill="${S.lg("muell", [[0, "#2f6b45"], [0.5, "#4a8d60"], [1, "#2a5c3c"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.6" y="-8.8" width="5.2" height=".6" rx=".2" fill="#2a5c3c"/><rect x="-1.4" y="-7.6" width="2.8" height="1.4" rx=".2" fill="#e8efe8"/><path d="M-.6 -7.3 v.8 M.2 -7.3 v.8 M-1 -7.4 h1.6" stroke="#2a5c3c" stroke-width=".15"/>`;
  k += `</g>`;
  S.teil({ id: "muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "waste bin", x: 236, y: 193, kunst: k });
}

/* =====================================================================
   BESUCHER am Weg
   ===================================================================== */
S.teil({ id: "besucherin", de: "die Besucherin", syl: "Be-SU-che-rin", it: "la visitatrice", itSyl: "vi-si-ta-TRI-ce", en: "visitor", x: 14, y: 172,
  kunst: schatten(0, 0, 5, 0.8, 0.3) + mensch({ id: "b19a_bes", geschlecht: "w", pose: "stehen", blick: 150, frisur: "lang", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#c0503a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#3c5a7a" } } }, 1.68, 172),
  tipp: "Sie geht den Weg entlang und schaut in die Gehege." });
S.teil({ id: "junge", de: "der Junge", syl: "JUN-ge", it: "il ragazzo", itSyl: "ra-GAZ-zo", en: "boy", x: 52, y: 176,
  kunst: schatten(0, 0, 4, 0.7, 0.3) + mensch({ id: "b19a_jun", alter: "kind", geschlecht: "m", pose: "zeigen", blick: -120, frisur: "kurz", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e2b23a" }, unterteil: { stueck: "shorts", farbe: "#3c5a7a" }, schuhe: { stueck: "turnschuh" } } }, 1.32, 176) });
S.teil({ id: "besucher", de: "der Besucher", syl: "Be-SU-cher", it: "il visitatore", itSyl: "vi-si-ta-TO-re", en: "visitor", x: 206, y: 178,
  kunst: schatten(0, 0, 5, 0.8, 0.3) + mensch({ id: "b19a_bmann", geschlecht: "m", pose: "stehen", blick: 120, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#6a8fb0" }, unterteil: { stueck: "hose", farbe: "#c9b48c" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, kopf: { stueck: "kappe", farbe: "#2f3a4a" } } }, 1.8, 178) });
S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: 98, y: 190,
  kunst: schatten(0, 0, 4, 0.7, 0.3) + mensch({ id: "b19a_kind", alter: "kind", geschlecht: "w", pose: "winken", blick: 140, frisur: "zopf", haarfarbe: "rot", haut: "sehrhell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#d9607a" }, unterteil: { stueck: "rock", farbe: "#3c5a7a" }, schuhe: { stueck: "sandale" } } }, 1.2, 190) });
S.teil({ id: "mutter", de: "die Mutter", syl: "MUT-ter", it: "la madre", itSyl: "MA-dre", en: "mother", x: 122, y: 192,
  kunst: schatten(0, 0, 5, 0.8, 0.3) + mensch({ id: "b19a_mut", geschlecht: "w", pose: "halten", blick: 70, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f0ead8" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.66, 192) });
{
  /* DER KINDERWAGEN — vor der Mutter, sie schiebt ihn */
  const s = M(194) / 10;
  let k = schatten(0, 0.2, 12, 1, 0.3) + `<g transform="scale(${r(s * 100) / 100})">`;
  k += `<path d="M-3.4 -1.2 L-1 -4 L2.6 -4 L3.6 -1.2" stroke="#3d4246" stroke-width=".25" fill="none"/>`;
  for (const x of [-3.4, 3.6]) k += `<circle cx="${x}" cy="-1.2" r="1.2" fill="#1d2023"/><circle cx="${x}" cy="-1.2" r=".5" fill="#9aa3a8"/>`;
  k += `<path d="M-4.4 -4.2 Q-4.6 -8 -1 -8 L3.6 -8 Q4.6 -8 4.4 -6.6 Q4 -4 2.6 -3.8 L-3.2 -3.8 Q-4.4 -3.9 -4.4 -4.2 Z" fill="${S.lg("kiwa", [[0, "#5b7f99"], [1, "#3c5a70"]])}"/>`;
  k += `<path d="M-4.4 -6 Q-5 -11 0 -11.2 Q-.6 -9 -.4 -8 L-4.2 -8 Z" fill="#46667e"/><path d="M-4 -9.6 Q-2.6 -10.6 -.6 -10.6" stroke="#7d9cb2" stroke-width=".25" fill="none"/>`;
  k += `<path d="M4 -7.8 L-6.6 -11.2" stroke="#3d4246" stroke-width=".35"/><rect x="-7.4" y="-11.8" width="1.6" height=".7" rx=".3" fill="#1d2023" transform="rotate(-18 -6.6 -11.4)"/>`;
  k += `</g>`;
  S.teil({ id: "kinderwagen", de: "der Kinderwagen", syl: "KIN-der-wa-gen", it: "la carrozzina", itSyl: "car-roz-ZI-na", en: "pram", x: 148, y: 194, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/zoo.js"));
console.log(aus);
