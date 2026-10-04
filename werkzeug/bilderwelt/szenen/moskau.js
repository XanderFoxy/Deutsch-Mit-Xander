#!/usr/bin/env node
/* =====================================================================
   MOSKAU (FASSUNG 855) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.
   Politisch neutral: nur Architektur, Alltag und Kultur.

   RECHERCHE (Wikipedia „Red Square“, „Saint Basil's Cathedral“,
   „Spasskaya Tower“, „Kremlin Clock“, „GUM (department store)“,
   „Monument to Minin and Pozharsky“; Lonely Planet; MasterClass):
   - STANDORT: der ROTE PLATZ (330 m lang, 70 m breit, von Nordwest nach
     Südost). Der Betrachter steht am Nordende vor dem Historischen
     Museum und schaut nach Südosten: das Postkartenmotiv.
     Links (Nordosten) die lange Fassade des Kaufhauses GUM, rechts
     (Südwesten) die Kremlmauer mit dem Mausoleum und dem Senatsturm,
     dahinter die Blaufichten; am Ende rechts der SPASSKI-TURM, in der
     Mitte die BASILIUSKATHEDRALE, davor das Denkmal für Minin und
     Poscharski. Zwischen Kathedrale und Spasski-Turm sieht man weit
     hinten den runden Moskworezki-Turm (Beklemischew-Turm) an der Moskwa.
   - BASILIUSKATHEDRALE (1555–1561, 65 m): neun Kapellen auf einem
     gemeinsamen Sockel mit Galerien. In der Mitte ein hohes ZELTDACH
     mit kleiner goldener Kuppel, um es herum vier große und vier kleine
     achteckige Türme mit Kokoschniks (Kielbogen-Giebeln) und je einer
     ZWIEBELKUPPEL – jede anders: Spiralen, Zickzack, Rauten mit
     Spitzen, Rippen; Blau-Weiß über der Nordkapelle (Zyprian und
     Justina), Grün-Orange über der Dreifaltigkeitskapelle. Die bunten
     Farben gibt es erst seit dem 17. Jahrhundert. Roter Backstein mit
     weißem Steinschmuck. Links hinten der GLOCKENTURM mit grünem Zeltdach.
   - SPASSKI-TURM (71 m): unten zwei viereckige Geschosse mit weißem
     Steinschmuck und kleinen Ecktürmchen, darüber das Geschoss mit der
     Uhr (Zifferblatt 6,1 m, schwarz mit Gold, auf allen vier Seiten),
     zwei Achtecke mit Bogenöffnungen, das grüne Zeltdach und der rote
     STERN (seit 1935, 3,75 m Spannweite). Das Tor liegt auf der Seite
     zum Platz (hier fast verdeckt).
   - KREMLMAUER: roter Backstein, oben die Schwalbenschwanz-ZINNEN
     („M“-Form). Davor Blaufichten, das MAUSOLEUM (Stufenpyramide aus
     rotem Granit und schwarzem Labradorit, 12 m hoch) und dahinter der
     Senatsturm (34 m) mit grünem Zeltdach.
   - GUM (1890–1893, Pomeranzew/Schuchow): 242 m lange Fassade im
     neurussischen Stil aus hellem Marmor und Kalkstein, Sockel aus rotem
     finnischem Granit, drei Geschosse mit Bogenfenstern, kleine Türmchen
     mit grünen Dächern, in der Mitte ein hohes Portal.
   - DENKMAL für Minin und Poscharski (1818, Bronze auf Granit, 8,8 m):
     Minin steht und zeigt auf den Kreml, Fürst Poscharski sitzt mit
     Schild und Schwert.
   - TYPISCH: im Winter ein Markt auf dem Platz (Holzbuden): MATRJOSCHKA
     (Holzpuppen ineinander), TEE aus dem SAMOWAR im Teeglas mit
     Metallhalter, PELMENI mit Schmand, Tulaer LEBKUCHEN (Prjanik),
     Kringel (Baranki); die PELZMÜTZE mit Ohrenklappen (Uschanka), das
     bunte Kopftuch aus Pawlowski Possad; graue NEBELKRÄHEN.
   - LICHT (Runde 2 nachgerechnet): Ende Februar, etwa 14:30 Uhr; der Blick
     geht nach etwa 150°, die Sonne steht im Südsüdwesten (Azimut 210°,
     19° hoch), also 60° rechts VOR dem Betrachter. Was nach rechts/Westen
     schaut (GUM-Fassade, Westseiten der Kapellen), leuchtet warm; was zu
     uns schaut, liegt im Gegenlicht. Schatten fallen nach links zum
     Betrachter (2,9 × Höhe): der Schatten der 14 m hohen Kremlmauer
     bedeckt die rechte Hälfte des Platzes. Luftdunst über allem ab 150 m.
     Schnee auf Dächern, Simsen, Zinnen und Fichten; der Platz ist
     geräumt, nur am Rand liegen Haufen.
   - BRUSČATKA: der Platz ist mit kleinen dunklen Granitquadern gepflastert.
   Maßstab: Augenhöhe 1,7 m, Horizont y = 172, Brennweite F = 560
   (d = Entfernung, l = seitlich, Meter): x = 200 + F·l/d,
   y = 172 + F·(1,7 − h)/d. Kathedrale in 365 m (1,53 Einheiten je
   Meter), Spasski-Turm in 288 m, Mausoleum in 150 m, Marktstand in 21 m,
   Touristin in 16,5 m, Krähe in 11,5 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "moskau", titel: "Moskau", emoji: "🕌", thema: "Länder", kuerzel: "msk", fassung: 855, breite: 400, hoehe: 260 });
const rnd = zufall(1561);
const r = B.r;
const F = 560, HOR = 172, EYE = 1.7;
const X = (d, l) => 200 + F * l / d;
const Y = (d, h = 0) => HOR + F * (EYE - h) / d;
const P = (d, l, h = 0) => `${r(X(d, l))} ${r(Y(d, h))}`;
/* Vielecke und Linien werden auf das Bild (0…400 × 0…260) beschnitten — nichts ragt hinaus */
const BOX = [0, 0, 400, 260];
function klipp(pts) {
  let p = pts.map((q) => q.split(" ").map(Number));
  const kante = [[(q) => q[0] >= BOX[0], (a, b) => [BOX[0], a[1] + (b[1] - a[1]) * (BOX[0] - a[0]) / (b[0] - a[0])]],
    [(q) => q[0] <= BOX[2], (a, b) => [BOX[2], a[1] + (b[1] - a[1]) * (BOX[2] - a[0]) / (b[0] - a[0])]],
    [(q) => q[1] >= BOX[1], (a, b) => [a[0] + (b[0] - a[0]) * (BOX[1] - a[1]) / (b[1] - a[1]), BOX[1]]],
    [(q) => q[1] <= BOX[3], (a, b) => [a[0] + (b[0] - a[0]) * (BOX[3] - a[1]) / (b[1] - a[1]), BOX[3]]]];
  for (const [innen, schnitt] of kante) {
    const out = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      if (innen(a)) { out.push(a); if (!innen(b)) out.push(schnitt(a, b)); } else if (innen(b)) out.push(schnitt(a, b));
    }
    p = out; if (!p.length) break;
  }
  return p.map(([x, y]) => `${r(x)} ${r(y)}`);
}
const poly = (pts, fill, extra = "") => { const q = klipp(pts); return q.length > 2 ? `<path d="M${q.join(" L")}Z" fill="${fill}"${extra}/>` : ""; };
const strecke = (a, b) => {   /* Linie a→b auf das Bild beschnitten */
  let [x1, y1] = a.split(" ").map(Number), [x2, y2] = b.split(" ").map(Number), t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  for (const [p, q] of [[-dx, x1 - BOX[0]], [dx, BOX[2] - x1], [-dy, y1 - BOX[1]], [dy, BOX[3] - y1]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; }
  }
  return `M${r(x1 + t0 * dx)} ${r(y1 + t0 * dy)} L${r(x1 + t1 * dx)} ${r(y1 + t1 * dy)}`;
};
/* Figuren klein halten: Koordinaten ganzzahlig (in Figur-Zentimetern) */
const kompakt = (svg, Q = 1) => {
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};

/* Pfade klein schreiben (Ladezeit): absolute Koordinaten auf Q runden, dann relativ (m, l, c …)
   ausgeben. Figuren: Q = 1 cm; alle übrigen Pfade am Ende mit Q = 0,001 (ohne sichtbaren Unterschied). */
function relativ(d, Q) {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g); if (!tok) return d;
  const fmt = (v) => { v = Math.round(v / Q) * Q; v = Math.round(v * 1000) / 1000; return String(v === 0 ? 0 : v).replace(/^0\./, ".").replace(/^-0\./, "-."); };
  const join = (nums) => nums.map((s, i) => (i && s[0] !== "-" ? " " : "") + s).join("");
  let out = "", i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = "";
  const R = (v) => Math.round(v / Q) * Q;
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const up = cmd.toUpperCase(), rel = cmd !== up;
    const n = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 }[up];
    if (up === "Z") { out += "z"; cx = sx; cy = sy; continue; }
    const a = tok.slice(i, i + n).map(Number); i += n;
    let nums = [];
    if (up === "H") { const x = R(rel ? cx + a[0] : a[0]); nums = [fmt(x - cx)]; cx = x; }
    else if (up === "V") { const y = R(rel ? cy + a[0] : a[0]); nums = [fmt(y - cy)]; cy = y; }
    else if (up === "A") { const x = R(rel ? cx + a[5] : a[5]), y = R(rel ? cy + a[6] : a[6]); nums = [fmt(a[0]), fmt(a[1]), String(Math.round(a[2])), String(a[3]), String(a[4]), fmt(x - cx), fmt(y - cy)]; cx = x; cy = y; }
    else { const pts = []; for (let k = 0; k < n; k += 2) pts.push([R(rel ? cx + a[k] : a[k]), R(rel ? cy + a[k + 1] : a[k + 1])]);
      nums = pts.flatMap(([x, y]) => [fmt(x - cx), fmt(y - cy)]); [cx, cy] = pts[pts.length - 1]; }
    if (up === "M") { sx = cx; sy = cy; }
    out += (up === "M" ? "m" : cmd.toLowerCase()) + join(nums);
    if (up === "M") cmd = rel ? "l" : "L";
  }
  return out;
}
const kompakt2 = (svg, Q = 1) => svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${relativ(p, Q)}"`)
  .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => { const v = Math.round(+n / Q) * Q; return ` ${k}="${v === 0 ? 0 : Math.round(v * 100) / 100}"`; });

/* Figurteile, die ganz unterhalb von yCut liegen (z. B. hinter einer Theke), weglassen */
function abschneiden(svg, yCut) {
  const yMin = (d) => { const n = d.match(/-?\d*\.?\d+/g); let m = Infinity; if (!n) return m; for (let i = 1; i < n.length; i += 2) m = Math.min(m, +n[i]); return m; };
  return svg.replace(/<path [^>]*?d="([^"]+)"[^>]*\/>/g, (a, d) => (/[a-z]/.test(d.replace(/e-/g, "")) || yMin(d) < yCut ? a : ""))
    .replace(/<(ellipse|circle) [^>]*?cy="(-?[\d.]+)"[^>]*\/>/g, (a, t, cy) => (+cy < yCut + 8 ? a : ""));
}
/* Figuren: Kopf und Hände fein (0,2 cm), der Rest auf 1 cm — keine Pixeltreppen im Gesicht.
   Kreis- und Ellipsen-Koordinaten (Augen) bleiben unverändert. */
function kompaktFein(m, svg = m.svg, Qf = 0.5) {
  const z = m.z, kopfY = z.kopf.y + 13, haende = [z.handL, z.handR].filter(Boolean);
  const fein = (x, y) => y < kopfY || haende.some((h) => Math.abs(h.x - x) < 9 && Math.abs(h.y - y) < 9);
  return svg.replace(/ d="([^"]+)"/g, (a, p) => {
    const n = p.match(/-?\d*\.?\d+/g) || [];
    let f = false;
    for (let i = 0; i + 1 < n.length && !f; i += 2) f = fein(+n[i], +n[i + 1]);
    return ` d="${relativ(p, f ? Qf : 1)}"`;
  }).replace(/<(circle|ellipse) ([^>]*?)\/>/g, (a, t, at) => {
    const cx = +((at.match(/ cx="(-?[\d.]+)"/) || [])[1] || 0), cy = +((at.match(/ cy="(-?[\d.]+)"/) || [])[1] || 0);
    if (fein(cx, cy)) return a;
    return `<${t} ` + at.replace(/ (cx|cy)="(-?[\d.]+)"/g, (q, k, v) => ` ${k}="${Math.round(+v)}"`) + "/>";
  });
}
/* vor dem Schreiben: alle Pfade der Szene relativ schreiben */
function pfadeKlein(S) {
  const k = (s) => s.replace(/ d="([^"]+)"/g, (a, p) => ` d="${relativ(p, 0.001)}"`);
  for (const t of S.teile) { t.kunst = k(t.kunst); if (t.unter) for (const u of t.unter) u.kunst = k(u.kunst); }
  S.kulisse = S.kulisse.map(k); S.vorne = S.vorne.map(k); S.defs = S.defs.map(k);
}

/* Gegenlicht/Lichtkante für Figuren: Körper leicht abgedunkelt, eine warme Lichtkante INNEN an der
   sonnenzugewandten Seite (Form minus verschobene Form) */
S.def(`<filter id="${S.id("kante")}" x="-10%" y="-5%" width="120%" height="110%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values=".86 0 0 0 0 0 .86 0 0 0 0 0 .86 0 0 0 0 0 1 0" result="k"/><feOffset in="SourceAlpha" dx="-.7" dy="0" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="r"/><feFlood flood-color="#ffd9a0" flood-opacity=".45"/><feComposite in2="r" operator="in" result="l"/><feMerge><feMergeNode in="k"/><feMergeNode in="l"/></feMerge></filter>`);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weichs")}" x="-20%" y="-60%" width="140%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("luft")}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".84 0 0 0 .125 0 .84 0 0 .132 0 0 .84 0 .145 0 0 0 1 0"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-5%" y="-30%" width="110%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".5"/></filter>`);

/* Stoffe */
const ZIEGEL_L = S.lg("ziegl", [[0, "#c8644a"], [1, "#d97c5c"]], 0, 0, 1, 0);      /* zur Sonne */
const ZIEGEL_M = S.lg("ziegm", [[0, "#a9493a"], [1, "#b8563f"]], 0, 0, 1, 0);      /* von vorn, Streiflicht */
const ZIEGEL_S = S.lg("ziegs", [[0, "#6c3434"], [1, "#7b3b36"]], 0, 0, 1, 0);      /* Schattenseite */
const WEISS_L = "#f6efe2", WEISS_M = "#e6dccb", WEISS_S = "#b9b3b8";
const GRUEN_L = "#5d9b78", GRUEN_M = "#3f7a5c", GRUEN_S = "#2a5141";
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#e9bd4c"], [1, "#9a6a14"]], 0, 0, 1, 1);
const SCHNEE = "#f8fbff", SCHNEE_S = "#c9d6e8";
/* Rundung: Licht kommt von rechts (Sonne im Südwesten) */
const RUND = S.lg("rund", [[0, "#1e1430", 0.5], [0.35, "#1e1430", 0.12], [0.72, "#fff8e8", 0.18], [0.9, "#fff8e8", 0.05], [1, "#1e1430", 0.25]], 0, 0, 1, 0);
const ZWIEBEL_LICHT = S.rg("zwlicht", [[0, "#fffef6", 0.55], [0.3, "#fffef6", 0.08], [0.62, "#000", 0], [1, "#140a24", 0.5]], 0.68, 0.36, 0.72);

/* =====================================================================
   KULISSE — Winterhimmel, Wolken, ferne Stadt, Kremlbäume, Senat
   ===================================================================== */
S.hinten(`<rect width="400" height="182" fill="${S.lg("himmel", [[0, "#5f8fc4"], [0.45, "#93b7da"], [0.8, "#d9e2e6"], [1, "#f1e3cf"]])}"/>`);
/* die tiefe Sonne steht rechts außerhalb des Bildes */
S.hinten(`<rect width="400" height="182" fill="${S.rg("sonne", [[0, "#fff1d2", 0.85], [0.35, "#ffe9c4", 0.35], [1, "#ffe9c4", 0]], 1.05, 0.62, 0.75)}"/>`);
{
  /* Winterliche Schichtwolken (Altocumulus-Bänder): flach und lang, oben kühl-weiß, die Unterseite
     von der Sonne (rechts vorn) warm angeleuchtet, unten scharf begrenzt */
  /* zwei breite, flache Schleier (weich) und darunter eine Reihe unregelmäßiger Altocumulus-Flocken mit
     ausgefranstem Oberrand, scharfer Unterkante und warm angeleuchteter Unterseite (Sonne rechts vorn) */
  const schleier = (x, y, w, h) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="#fbfcff" opacity=".55" filter="url(#${S.id("dunst")})"/>`;
  const FL = S.lg("flocke", [[0, "#ffffff"], [0.6, "#f1f0f4"], [1, "#f5cfb6"]]);
  const flocken = (x0, y0, n, seed, gr) => {
    const z = zufall(seed); let g = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + i * gr * 2.6 + (z() - 0.5) * gr, y = y0 + (z() - 0.5) * gr * 0.6 + i * 0.25, w = gr * (0.7 + z() * 0.8), h = w * (0.32 + z() * 0.2);
      let top = `M${r(x - w)} ${r(y)}`;
      const m = 4 + Math.floor(z() * 3);
      for (let j = 1; j <= m; j++) { const t = j / m, xx = x - w + 2 * w * t, hh = h * Math.sin(Math.PI * t) * (0.7 + z() * 0.6); top += ` Q${r(xx - w / m)} ${r(y - hh * 1.6)} ${r(xx)} ${r(y - (j === m ? 0 : hh * (0.5 + z() * 0.4)))}`; }
      g += `<path d="${top} Q${r(x)} ${r(y + h * 0.2)} ${r(x - w)} ${r(y)}Z" fill="${FL}"/>`;
    }
    return g;
  };
  S.hinten(schleier(110, 34, 120, 7) + schleier(150, 30, 60, 3) + schleier(320, 60, 90, 5) + schleier(350, 56, 40, 2.4) + `<g opacity=".7" filter="url(#${S.id("dunst")})">${flocken(40, 44, 6, 3, 4.6) + flocken(260, 68, 5, 9, 3.8)}</g>`);
  /* zarte Schleierwolken am Horizont */
  S.hinten(`<path d="M0 128 Q60 124 120 127 T240 125 T400 128 L400 132 Q300 130 200 132 T0 133 Z" fill="#fff" opacity=".35" filter="url(#${S.id("dunst")})"/>`);
}
{
  /* Ferne Stadt hinter der Kathedrale (Samoskworetschje jenseits der Moskwa), im Dunst */
  let g = "";
  const rz = zufall(77);
  for (let x = 120; x < 262; x += 3 + rz() * 4) {
    const w = 3 + rz() * 6, h = 4 + rz() * 7;
    g += `<rect x="${r(x)}" y="${r(175 - h)}" width="${r(w)}" height="${r(h)}" fill="${rz() < 0.5 ? "#a9b0c0" : "#b6bccb"}"/><rect x="${r(x)}" y="${r(175 - h)}" width="${r(w)}" height=".7" fill="#eef2f8"/>`;
  }
  /* ein ferner Kirchturm mit Goldkuppel und ein Hochhaus im Dunst */
  g += `<rect x="236" y="160" width="2.4" height="15" fill="#a3aabb"/><path d="M235.6 160 Q237.2 156.6 238.8 160 Z" fill="#d8bf7a"/><path d="M237.2 156.8 V155" stroke="#d8bf7a" stroke-width=".3"/>`;
  g += `<path d="M128 175 V158 h5 V152 h3 V146 h1 V152 h3 V158 h5 V175 Z" fill="#a7aebf" opacity=".85"/>`;
  S.hinten(`<g opacity=".9">${g}</g><rect x="0" y="146" width="400" height="30" fill="${S.lg("ferne", [[0, "#dfe6ef", 0], [1, "#e9eef4", 0.55]])}"/>`);
}
{
  /* Hinter der Kremlmauer: verschneite Baumkronen und der gelbe Senatspalast (rechts) */
  let g = "";
  const rz = zufall(5);
  for (let x = 262; x < 400; x += 4 + rz() * 4) {
    const y = 152 - (x - 262) * 0.12 - rz() * 5, rr = 2.5 + rz() * 3;
    g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="#8b8a9a"/><circle cx="${r(x + 0.6)}" cy="${r(y - rr * 0.5)}" r="${r(rr * 0.6)}" fill="#e9eef6"/>`;
  }
  S.hinten(g);
  /* Senatspalast (gelb, weiße Säulen, grünes Dach mit Schnee) — Teil liegt hinter der Mauer */
  /* Senatspalast und Nachbarbauten hinter der Mauer (gelb, weiße Fensterrahmen, grünes Dach mit Schnee) */
  const sy = (x) => 127 - (x - 284) * 0.03;
  let s = `<path d="M284 ${sy(284)} L400 ${r(sy(400))} L400 168 L284 168 Z" fill="${S.lg("senat", [[0, "#d9b46e"], [1, "#e7c27c"]], 0, 0, 1, 0)}"/>`;
  s += `<path d="M284 ${r(sy(284))} L400 ${r(sy(400))} L400 ${r(sy(400) - 3.5)} L286 ${r(sy(284) - 2.6)} Z" fill="#6f8f7e"/><path d="M285 ${r(sy(284) - 0.5)} L400 ${r(sy(400) - 0.5)}" stroke="${SCHNEE}" stroke-width="1.1"/>`;
  let fe = "";
  for (let x = 288; x < 398; x += 4.2) { const y0 = sy(x); fe += `M${r(x)} ${r(y0 + 2.5)}h1.3v3.2h-1.3Z M${r(x)} ${r(y0 + 8.5)}h1.3v3.2h-1.3Z`; }
  s += `<path d="${fe}" fill="#5a6476" stroke="#f4ead6" stroke-width=".25"/>`;
  S.hinten(s);
}
{
  /* Moskworezki-Turm (Beklemischew-Turm, 46 m, rund, an der Moskwa) und die Mauer dorthin */
  const d = 420, l = 45, s = F / d, x = X(d, l), y = Y(d);
  let g = `<path d="M${r(X(296, 40))} ${r(Y(296, 10))} L${r(X(d, l))} ${r(Y(d, 10))} L${r(X(d, l))} ${r(Y(d))} L${r(X(296, 40))} ${r(Y(296))} Z" fill="#8f5a52"/>`;
  g += `<g transform="translate(${r(x)} ${r(y)}) scale(${s.toFixed(4)})">`;
  g += `<rect x="-6" y="-24" width="12" height="24" fill="${S.lg("bek", [[0, "#7c4a46"], [0.7, "#b06f5e"], [1, "#8d5a50"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M-6.6 -24 h13.2 v-2 h-13.2 Z" fill="#c7a99c"/><path d="M-4.2 -26 h8.4 v-6 h-8.4 Z" fill="#a8695a"/>`;
  g += `<path d="M-4.6 -32 L0 -44 L4.6 -32 Z" fill="${S.lg("bekz", [[0, "#3c6550"], [0.7, "#6f9f84"], [1, "#4b7660"]], 0, 0, 1, 0)}"/><path d="M0 -44 V-46" stroke="#d9b45a" stroke-width=".5"/>`;
  g += `<path d="M-6.6 -24 h13.2 M-4.6 -32 h9.2" stroke="${SCHNEE}" stroke-width=".9"/></g>`;
  S.hinten(`<g opacity=".92">${g}</g>`);
}

/* =====================================================================
   1 — DER ROTE PLATZ (Pflaster, Schnee, Schatten der Mauer)
   ===================================================================== */
{
  let k = `<path d="M0 ${r(Y(104))} L${r(X(277, -38))} ${r(Y(277))} L${r(X(350, -20))} ${r(Y(350))} L${r(X(350, 30))} ${r(Y(350))} L${r(X(288.5, 38))} ${r(Y(288.5))} L${r(X(106, 38))} ${r(Y(106))} L400 ${r(Y(106))} L400 260 L0 260 Z" fill="${S.lg("pflaster", [[0, "#8a8d99"], [0.18, "#646876"], [1, "#454852"]])}"/>`;
  /* Brusčatka: kleine dunkle Granitquader in Reihen quer zum Platz. Nah als Steinreihen
     (Strich mit Lücken = Fugen), weiter hinten nur noch feine Reihenlinien. */
  let reihen = "";
  for (let d = 10.75, i = 0; d < 21; d += 0.2, i++) {
    const y0 = Y(d), y1 = Y(d + 0.2), w = 0.15 * F / d;
    reihen += `<path d="M0 ${r((y0 + y1) / 2 * 10) / 10}H400" stroke="${["#4f525e", "#575b68", "#4b4e59", "#5c606d"][i % 4]}" stroke-width="${r((y0 - y1) * 0.8 * 100) / 100}" stroke-dasharray="${r(w * 0.86 * 100) / 100} ${r(w * 0.14 * 100) / 100}" stroke-dashoffset="${r(rnd() * w * 100) / 100}"/>`;
  }
  k += `<g pointer-events="none">${reihen}</g>`;
  let q = "";
  for (let d = 21; d < 220; d *= 1.03) q += `M${r(Math.max(0, X(d, -38)))} ${r(Y(d))} L${r(Math.min(400, X(d, 38)))} ${r(Y(d))}`;
  k += `<path d="${q}" stroke="#2f313a" stroke-width=".14" opacity=".45"/>`;
  /* bläulicher Glanz der Granitköpfe zur Sonne (rechts vorn) */
  let gl = "";
  for (let i = 0; i < 180; i++) {
    const d = 10.8 + Math.pow(rnd(), 1.4) * 40, l = -8 + rnd() * 30, x = X(d, l), y = Y(d);
    if (x > 2 && x < 396 && y < 259) gl += `M${r(x)} ${r(y)} h${r(0.3 + 16 / d)}`;
  }
  k += `<path d="${gl}" stroke="#aeb8cc" stroke-width=".3" opacity=".45"/>`;
  k += `<path d="M190 ${HOR + 3} L400 ${HOR + 12} L400 260 L260 260 Z" fill="${S.lg("glanz", [[0, "#ffe2c0", 0], [1, "#ffe2c0", 0.14]], 0, 0, 1, 0)}" pointer-events="none"/>`;
  /* Schatten der Kremlmauer (14 m; Sonne 19° hoch, 60° rechts vorn → 35 m nach links, 20 m zum Betrachter) */
  k += poly([P(31.3, 38), P(288.5, 38), P(268.2, 3), P(11, 3)], "#1b2247", ` opacity=".3" pointer-events="none"`);
  let zz = "";
  for (let d = 106; d < 220; d += 3) zz += `M${P(d - 20.3, 3)} L${P(d - 20.2, 1.6)} L${P(d - 18.2, 1.6)} L${P(d - 18.2, 3)}Z`;
  k += `<path d="${zz}" fill="#1b2247" opacity=".3" pointer-events="none"/>`;
  /* Schatten des Mausoleums und der Fichten liegen im Mauerschatten; der Senatsturm wirft einen langen Streifen */
  k += poly([P(158, 34), P(166.5, 34), P(166.5 - 49, 34 - 85), P(158 - 49, 34 - 85)], "#1b2247", ` opacity=".22" pointer-events="none"`);
  /* Schnee: geräumte Haufen an der GUM-Seite, Reste im Pflaster */
  k += poly([P(100, -38), P(277, -38), P(277, -36), P(100, -36.2)], SCHNEE);
  k += poly([P(100, -36.2), P(277, -36), P(277, -35.5), P(100, -35.6)], SCHNEE_S, ` opacity=".7"`);
  const fleck = (d, l, w, t) => {
    const n = 12, s0 = Math.round(d * 7 + l * 13);
    const pt = (f) => { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = (0.7 + (((i + s0) * 7919) % 13) / 30) * f; p.push(P(d + Math.sin(a) * t * rr, l + Math.cos(a) * w * rr)); } return p; };
    return poly(pt(1), "#b9c6dc", ` filter="url(#${S.id("weichs")})"`) + poly(pt(0.8), SCHNEE, ` opacity=".92" filter="url(#${S.id("weichs")})"`) + poly(pt(0.45), "#ffffff", ` opacity=".7"`);
  };
  /* Schneereste: flache, unregelmäßige Streifen am Bordstein (GUM-Seite) und an der Mauer, kühle Schattenseite, körnige Kante */
  const rest = (d0, d1, l, b, seed) => {
    const z = zufall(seed), o = [], u = [];
    for (let d = d0; d <= d1; d += (d1 - d0) / 10) { o.push(P(d, l + b * (0.4 + z() * 0.6))); u.push(P(d, l - b * 0.15 * z())); }
    const pts = [...o, ...u.reverse()];
    let g = poly(pts, "#cdd8e8", ` opacity=".9"`) + poly(o.concat(u.slice().reverse().map((q) => q)).slice(0, o.length).concat(u.slice().reverse()), SCHNEE, ` opacity=".85"`);
    let k2 = "";
    for (let i = 0; i < 18; i++) { const d = d0 + z() * (d1 - d0), ll = l + b * z(), [x, y] = P(d, ll).split(" ").map(Number); if (x > 0 && x < 400 && y < 259) k2 += `M${r(x)} ${r(y)}h${r(0.2 + 10 / d)}`; }
    return g + `<path d="${k2}" stroke="#ffffff" stroke-width=".35" opacity=".8"/>`;
  };
  k += rest(40, 95, -36, 2, 7) + rest(60, 130, 33.5, 2.2, 9) + rest(24, 34, -31, 1.2, 13);
  /* Schatten der Bude (3,6 m hoch) */
  k += poly([P(21, -3.7), P(23.6, -3.7), P(23.6 - 5.2, -3.7 - 9), P(21 - 5.2, -3.7 - 9), P(21 - 5.2, -6.9 - 9)], "#1b2247", ` opacity=".3" pointer-events="none"`);
  var PLATZ = S.teil({ id: "roter_platz", de: "der Rote Platz", syl: "RO-te PLATZ", it: "la Piazza Rossa", itSyl: "PIAZ-za ROS-sa", en: "Red Square", x: 0, y: 0, kunst: k,
    tipp: "„Krasnaja“ heißt auf Altrussisch auch „schön“: Der Rote Platz ist also der schöne Platz." });
}

/* =====================================================================
   2 — DIE BASILIUSKATHEDRALE (in Metern, 1,53 Einheiten je Meter)
   ===================================================================== */
const KB = { d: 365, l: -10 };
const KX = r(X(KB.d, KB.l)), KY = r(Y(KB.d)), KS = F / KB.d;
const KG = (svg) => `<g transform="translate(${KX} ${KY}) scale(${KS.toFixed(4)})" filter="url(#${S.id("luft")})">${svg}</g>`;
const KP = (u, h) => ({ x: r(KX + u * KS), y: r(KY - h * KS) });
let zwId = 0;
/* Zwiebelkuppel: Fuß bei (cx, -y0), Breite w, Höhe h; Muster je Kuppel anders */
function zwiebel(cx, y0, w, h, art, f1, f2) {
  const p = (a, b) => `${r(cx + a * w)} ${r(-y0 - b * h)}`;
  const kurve = (t) => [[-0.3 * t, 0], [-0.62 * t, 0.1], [-0.6 * t, 0.5], [-0.2 * t, 0.76], [-0.08 * t, 0.85], [-0.02 * t, 0.9], [0, 1]];
  const d = `M${p(-0.3, 0)} C${p(-0.62, 0.1)} ${p(-0.6, 0.5)} ${p(-0.2, 0.76)} C${p(-0.08, 0.85)} ${p(-0.02, 0.9)} ${p(0, 1)} C${p(0.02, 0.9)} ${p(0.08, 0.85)} ${p(0.2, 0.76)} C${p(0.6, 0.5)} ${p(0.62, 0.1)} ${p(0.3, 0)} Z`;
  const id = S.id("zw" + (zwId++));
  S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
  let g = `<path d="${d}" fill="${f1}"/><g clip-path="url(#${id})">`;
  if (art === "spirale") {
    let s = "";
    for (let i = -7; i <= 7; i++) { const x = cx + i * w * 0.16; s += `M${r(x - w * 0.5)} ${r(-y0 + 0.5)} Q${r(x + w * 0.1)} ${r(-y0 - h * 0.45)} ${r(x + w * 0.45)} ${r(-y0 - h * 1.05)}`; }
    g += `<path d="${s}" stroke="${f2}" stroke-width="${r(w * 0.075)}" fill="none"/>`;
  } else if (art === "zickzack") {
    let s = "";
    for (let j = 0; j < 7; j++) {
      const y = -y0 - h * (0.08 + j * 0.13); s += `M${r(cx - w * 0.7)} ${r(y)}`;
      for (let i = 0; i < 10; i++) s += ` L${r(cx - w * 0.7 + (i + 0.5) * w * 0.14)} ${r(y - (i % 2 ? 0 : h * 0.06))}`;
    }
    g += `<path d="${s}" stroke="${f2}" stroke-width="${r(h * 0.045)}" fill="none" stroke-linejoin="miter"/>`;
  } else if (art === "rippen") {
    const ts = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
    for (let i = 0; i < ts.length - 1; i += 2) {
      const a = kurve(ts[i]), b = kurve(ts[i + 1]).reverse();
      const pa = a.map(([u, v]) => p(u, v)), pb = b.map(([u, v]) => p(u, v));
      g += `<path d="M${pa[0]} C${pa[1]} ${pa[2]} ${pa[3]} C${pa[4]} ${pa[5]} ${pa[6]} L${pb[0]} C${pb[1]} ${pb[2]} ${pb[3]} C${pb[4]} ${pb[5]} ${pb[6]} Z" fill="${f2}"/>`;
    }
  } else if (art === "rauten") {
    /* Rauten mit Spitzen (wie ein Tannenzapfen): helle obere Hälfte, dunkle untere */
    let s1 = "", s2 = "";
    const sw = w * 0.16, sh = h * 0.13;
    for (let j = 0; j < 9; j++) for (let i = -5; i <= 5; i++) {
      const x = cx + i * sw + (j % 2 ? sw / 2 : 0), y = -y0 - j * sh * 0.82;
      s1 += `M${r(x - sw / 2)} ${r(y)} L${r(x)} ${r(y - sh / 2)} L${r(x + sw / 2)} ${r(y)}Z`;
      s2 += `M${r(x - sw / 2)} ${r(y)} L${r(x + sw / 2)} ${r(y)} L${r(x)} ${r(y + sh / 2)}Z`;
    }
    g += `<path d="${s2}" fill="${f2}"/><path d="${s1}" fill="#fff" opacity=".22"/>`;
    for (let j = 0; j < 9; j += 2) g += `<circle cx="${r(cx + w * 0.1)}" cy="${r(-y0 - j * sh * 0.82 - sh * 0.1)}" r="${r(w * 0.035)}" fill="#ffe9a0"/>`;
  } else if (art === "winkel") {
    let s = "";
    for (let j = 0; j < 8; j++) { const y = -y0 - h * (0.02 + j * 0.12); s += `M${r(cx - w * 0.7)} ${r(y - h * 0.12)} L${cx} ${r(y)} L${r(cx + w * 0.7)} ${r(y - h * 0.12)}`; }
    g += `<path d="${s}" stroke="${f2}" stroke-width="${r(h * 0.05)}" fill="none"/>`;
  }
  g += `</g><path d="${d}" fill="${ZWIEBEL_LICHT}"/>`;
  /* Glanzlicht rechts oben (Sonne) und Hals mit Goldring */
  g += `<path d="M${p(0.12, 0.66)} Q${p(0.38, 0.5)} ${p(0.36, 0.22)}" stroke="#fffdf2" stroke-width="${r(w * 0.05)}" opacity=".55" fill="none" stroke-linecap="round"/>`;
  g += `<rect x="${r(cx - w * 0.31)}" y="${r(-y0 - 0.1)}" width="${r(w * 0.62)}" height="${r(Math.max(0.5, h * 0.06))}" fill="${GOLD}"/>`;
  return g;
}
/* orthodoxes Kreuz (drei Querbalken, der untere schräg) in Gold */
function kreuz(cx, y0, s) {
  return `<path d="M${cx} ${r(-y0)} V${r(-y0 - 3.2 * s)} M${r(cx - 0.45 * s)} ${r(-y0 - 2.75 * s)} H${r(cx + 0.45 * s)} M${r(cx - 0.9 * s)} ${r(-y0 - 2.1 * s)} H${r(cx + 0.9 * s)} M${r(cx - 0.6 * s)} ${r(-y0 - 0.8 * s)} L${r(cx + 0.6 * s)} ${r(-y0 - 1.25 * s)}" stroke="#d9a93a" stroke-width="${r(0.28 * s * 10) / 10}" stroke-linecap="round"/>` +
    `<path d="M${r(cx + 0.12 * s)} ${r(-y0 - 0.3)} V${r(-y0 - 3 * s)}" stroke="#fff0b8" stroke-width="${r(0.1 * s * 10) / 10}"/>`;
}
/* Achteckiger Turm: drei sichtbare Seiten (links Schatten, Mitte Streiflicht, rechts Sonne) */
function achteck(cx, w, y0, y1, fl = ZIEGEL_S, fm = ZIEGEL_M, fr = ZIEGEL_L) {
  const a = w * 0.207, b = w / 2;
  return `<path d="M${r(cx - b)} ${-y0} L${r(cx - a)} ${-y0} L${r(cx - a)} ${-y1} L${r(cx - b)} ${-y1} Z" fill="${fl}"/>` +
    `<rect x="${r(cx - a)}" y="${-y1}" width="${r(2 * a)}" height="${r(y1 - y0)}" fill="${fm}"/>` +
    `<path d="M${r(cx + a)} ${-y0} L${r(cx + b)} ${-y0} L${r(cx + b)} ${-y1} L${r(cx + a)} ${-y1} Z" fill="${fr}"/>`;
}
const KOKL = S.lg("kokl", [[0, "#1e1430", 0.35], [0.5, "#000", 0], [1, "#fff6e0", 0.2]], 0, 0, 1, 0);
/* Kokoschniks: Reihe von Kielbögen (spitz zulaufende Giebel) */
function kokoschniks(cx, w, y, h, n, fill = ZIEGEL_M) {
  let s = "", o = "";
  for (let i = 0; i < n; i++) {
    const a = cx - w / 2 + i * w / n, b = a + w / n, m = (a + b) / 2, ww = b - a;
    s += `M${r(a)} ${-y} C${r(a)} ${r(-y - h * 0.55)} ${r(m - ww * 0.12)} ${r(-y - h * 0.5)} ${r(m)} ${r(-y - h)} C${r(m + ww * 0.12)} ${r(-y - h * 0.5)} ${r(b)} ${r(-y - h * 0.55)} ${r(b)} ${-y}Z`;
    const ia = a + ww * 0.18, ib = b - ww * 0.18;
    o += `M${r(ia)} ${r(-y)} C${r(ia)} ${r(-y - h * 0.45)} ${r(m - ww * 0.08)} ${r(-y - h * 0.42)} ${r(m)} ${r(-y - h * 0.78)} C${r(m + ww * 0.08)} ${r(-y - h * 0.42)} ${r(ib)} ${r(-y - h * 0.45)} ${r(ib)} ${r(-y)}`;
  }
  return `<path d="${s}" fill="${fill}" stroke="${WEISS_M}" stroke-width=".35"/><path d="${o}" fill="#e9dccb" opacity=".55"/>` +
    `<path d="${s}" fill="${KOKL}"/>`;
}
/* Trommel (Tambour) unter der Kuppel: Zylinder mit Blendbögen */
function trommel(cx, w, y0, y1, n = 5) {
  let g = `<rect x="${r(cx - w / 2)}" y="${-y1}" width="${r(w)}" height="${r(y1 - y0)}" fill="${ZIEGEL_M}"/><rect x="${r(cx - w / 2)}" y="${-y1}" width="${r(w)}" height="${r(y1 - y0)}" fill="${RUND}"/>`;
  let a = "";
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = cx + Math.sin((t - 0.5) * Math.PI) * w / 2 * 0.9, bw = w / n * 0.45 * Math.cos((t - 0.5) * Math.PI);
    a += `M${r(x - bw / 2)} ${r(-y0 - 0.5)} V${r(-y1 + (y1 - y0) * 0.35)} Q${r(x)} ${r(-y1 + 0.3)} ${r(x + bw / 2)} ${r(-y1 + (y1 - y0) * 0.35)} V${r(-y0 - 0.5)}`;
  }
  g += `<path d="${a}" stroke="${WEISS_L}" stroke-width=".32" fill="#5f2c2a" fill-opacity=".45"/>`;
  /* weiße Halbsäulen zwischen den Bögen und ein Zackenfries unter dem Gesims */
  let hs = "", zf = `M${r(cx - w / 2)} ${r(-y1 + 0.9)}`;
  for (let i = 0; i <= n; i++) { const t = i / n, x = cx + Math.sin((t - 0.5) * Math.PI) * w / 2 * 0.92; hs += `M${r(x)} ${r(-y0 - 0.3)} V${r(-y1 + 1.2)}`; }
  for (let i = 1; i <= 2 * n; i++) zf += ` L${r(cx - w / 2 + i * w / (2 * n))} ${r(-y1 + (i % 2 ? 0.35 : 0.9))}`;
  g += `<path d="${hs}" stroke="${WEISS_M}" stroke-width=".28"/><path d="${zf}" stroke="${WEISS_L}" stroke-width=".22" fill="none"/>`;
  g += `<rect x="${r(cx - w / 2 - 0.3)}" y="${r(-y1 - 0.5)}" width="${r(w + 0.6)}" height=".6" fill="${WEISS_L}"/><rect x="${r(cx - w / 2 - 0.3)}" y="${r(-y1 - 0.5)}" width="${r(w + 0.6)}" height=".25" fill="${SCHNEE}"/>`;
  return g;
}
/* Eine Kapelle mit Turm, Kokoschniks, Trommel und Kuppel */
function kapelle(c) {
  const { u, w, top, art, f1, f2 } = c;
  const body1 = top * 0.46, koko = body1 + top * 0.075, tr = koko + top * 0.15, kh = top * 0.23;
  let g = achteck(u, w, 10, body1);
  /* weiße Pilaster an den Kanten, ein Gesims, schmale Fenster */
  const a = w * 0.207;
  g += `<path d="M${r(u - a)} -10 V${r(-body1)} M${r(u + a)} -10 V${r(-body1)}" stroke="${WEISS_M}" stroke-width=".45"/>`;
  g += `<rect x="${r(u - w / 2)}" y="${r(-body1 * 0.72)}" width="${w}" height=".55" fill="${WEISS_M}"/>`;
  g += `<path d="M${r(u - 0.45)} ${r(-body1 * 0.66)} v-2.2 q.45 -.7 .9 0 v2.2 Z" fill="#2c1a22" stroke="${WEISS_L}" stroke-width=".25"/>`;
  g += kokoschniks(u, w, body1, top * 0.085, 3);
  g += achteck(u, w * 0.78, body1 + top * 0.02, koko);
  g += kokoschniks(u, w * 0.78, koko, top * 0.07, 3);
  g += kokoschniks(u, w * 0.62, koko + top * 0.035, top * 0.05, 4, ZIEGEL_L);
  g += trommel(u, w * 0.56, koko + top * 0.07, tr, 6);
  g += zwiebel(u, tr, w * 0.92, kh, art, f1, f2);
  g += kreuz(u, tr + kh, top > 40 ? 1 : 0.8);
  /* Schnee auf den Gesimsen */
  g += `<path d="M${r(u - w / 2)} ${r(-body1)} h${w} M${r(u - w * 0.39)} ${r(-koko)} h${r(w * 0.78)}" stroke="${SCHNEE}" stroke-width=".45" opacity=".9"/>`;
  return g;
}
const unterKathedrale = [];
{
  let k = "";
  /* Glockenturm (links hinten): viereckig, offene Bögen, grünes Zeltdach */
  {
    const u = -31;
    k += `<rect x="${u - 4}" y="-15" width="8" height="15" fill="${ZIEGEL_M}"/><rect x="${u - 4}" y="-15" width="2" height="15" fill="${ZIEGEL_S}"/>`;
    k += achteck(u, 8, 15, 23, ZIEGEL_S, ZIEGEL_M, ZIEGEL_L);
    for (const dx of [-1.7, 0, 1.7]) k += `<path d="M${r(u + dx - 0.6)} -16 v-4.6 q.6 -1.2 1.2 0 v4.6 Z" fill="#2b1820"/><path d="M${r(u + dx - 0.35)} -19.6 q.35 -.5 .7 0 v.7 h-.7 Z" fill="#c69c46"/>`;
    k += `<rect x="${u - 4.3}" y="-23.6" width="8.6" height=".8" fill="${WEISS_L}"/><rect x="${u - 4.3}" y="-23.9" width="8.6" height=".35" fill="${SCHNEE}"/>`;
    k += `<path d="M${u - 3.8} -23.6 L${u - 0.2} -33 L${u - 1.6} -23.6 Z" fill="${GRUEN_S}"/><path d="M${u - 1.6} -23.6 L${u - 0.2} -33 L${u + 0.2} -33 L${u + 1.6} -23.6 Z" fill="${GRUEN_M}"/><path d="M${u + 1.6} -23.6 L${u + 0.2} -33 L${u + 3.8} -23.6 Z" fill="${GRUEN_L}"/>`;
    k += `<path d="M${u - 1.6} -23.6 L${u - 0.2} -33 M${u + 1.6} -23.6 L${u + 0.2} -33" stroke="#9cc7ad" stroke-width=".18"/>`;
    k += `<path d="M${u - 1.6} -27 l.6 -1.6 l.6 1.6 Z M${u + 0.4} -29 l.5 -1.3 l.5 1.3 Z" fill="${WEISS_L}"/>`;
    k += zwiebel(u, 33, 1.8, 2.2, "glatt", GOLD, GOLD) + kreuz(u, 35.2, 0.6);
    unterKathedrale.push({ id: "glockenturm", de: "der Glockenturm", syl: "GLO-cken-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower",
      x: KP(u, 0).x, y: KP(u, 0).y, kunst: flaeche(-5 * KS, -36 * KS, 10 * KS, 36 * KS, 0.6) });
  }
  /* Sockel und Galerien (0–11 m): weißer Steinsockel, Backstein mit Bogenfenstern, Schneedach.
     Die Galerie knickt an der Nordwestecke: links die Nordseite (Streiflicht), rechts die Westseite (Sonne). */
  k += `<path d="M-27 0 V-4 H28 V0 Z" fill="${WEISS_M}"/><path d="M4 0 V-4 H28 V0 Z" fill="${WEISS_L}"/><path d="M-27 -4 H28 V-3.4 H-27 Z" fill="#fffaf0"/>`;
  k += `<path d="M-27 -4 V-10.5 H4 V-4 Z" fill="${ZIEGEL_M}"/><path d="M4 -4 V-10.5 H28 V-4 Z" fill="${ZIEGEL_L}"/><path d="M-27 -4 V-10.5 H-22 V-4 Z" fill="${ZIEGEL_S}"/>`;
  k += `<path d="M4 0 V-10.5" stroke="#fff3df" stroke-width=".5"/>`;
  let bg = "";
  for (let u = -25.5; u < 26; u += 3.3) if (Math.abs(u - 4) > 1.2) bg += `M${r(u)} -4.6 V-8 Q${r(u + 0.9)} -9.4 ${r(u + 1.8)} -8 V-4.6 Z`;
  k += `<path d="${bg}" fill="#3a2a3a" stroke="${WEISS_L}" stroke-width=".35"/>`;
  k += `<path d="${bg}" fill="${S.lg("glasgal", [[0, "#9fb4d6", 0.35], [1, "#fff", 0]])}"/>`;
  let fs = "";
  for (let u = -25, i = 0; u < 27; u += 4.2, i++) fs += `M${r(u)} -1.1 v-1.5 q.5 -.6 1 0 v1.5 Z`;
  k += `<path d="${fs}" fill="#4a3a40"/>`;
  k += `<path d="M-28 -10.5 L-26 -12 L27 -12 L29 -10.5 Z" fill="${SCHNEE}"/><path d="M-28 -10.5 L29 -10.5 L29 -10 L-28 -10 Z" fill="${SCHNEE_S}"/>`;
  /* Kapellen von hinten nach vorn */
  k += kapelle({ u: 8, w: 9, top: 43, art: "rippen", f1: "#e0b13a", f2: "#3f7f4f" });          /* Süd (Nikolaus) */
  k += kapelle({ u: -21, w: 9.5, top: 42, art: "spirale", f1: "#3e8a57", f2: "#e7863a" });     /* Ost (Dreifaltigkeit): Grün-Orange */
  k += kapelle({ u: 18.5, w: 6.4, top: 34, art: "zickzack", f1: "#c9403a", f2: "#3f8a55" });  /* Südwest */
  /* Mittlerer Turm mit dem ZELTDACH (65 m) */
  {
    let z = achteck(0, 13, 10, 28);
    z += `<rect x="-6.5" y="-21" width="13" height=".6" fill="${WEISS_M}"/>`;
    for (const dx of [-1.2, 1.2]) z += `<path d="M${dx - 0.4} -15 v-3 q.4 -.8 .8 0 v3 Z" fill="#2c1a22" stroke="${WEISS_L}" stroke-width=".25"/>`;
    z += kokoschniks(0, 13, 28, 3.2, 4) + kokoschniks(0, 11.4, 30.6, 2.8, 4, ZIEGEL_L);
    z += achteck(0, 10.5, 31.5, 38.5, "#d9d0c4", "#f1e8da", "#fbf6ee");
    /* weiße Säulchen und Bögen am Tambour */
    let sb = "";
    for (const x of [-4.8, -2.2, 0, 2.2, 4.8]) sb += `M${x} -32 V-37.6`;
    z += `<path d="${sb}" stroke="#c9a96e" stroke-width=".35"/>`;
    z += kokoschniks(0, 10.5, 38.5, 2.2, 6, "#f1e8da") + kokoschniks(0, 8.6, 39.4, 1.6, 6, "#fbf6ee");
    /* Zeltdach: drei sichtbare Flächen, weiß-orange Rautenmuster, Sternchen */
    const zt = 59, zb = 40.4, bw = 5.2, tw = 0.9;
    const L = `M${-bw} ${-zb} L${-tw} ${-zt} L${-tw * 0.4} ${-zt} L${-bw * 0.42} ${-zb} Z`;
    const M = `M${-bw * 0.42} ${-zb} L${-tw * 0.4} ${-zt} L${tw * 0.4} ${-zt} L${bw * 0.42} ${-zb} Z`;
    const R = `M${bw * 0.42} ${-zb} L${tw * 0.4} ${-zt} L${tw} ${-zt} L${bw} ${-zb} Z`;
    z += `<path d="${L}" fill="#d8c5ad"/><path d="${M}" fill="#efe1cc"/><path d="${R}" fill="#fbf3e6"/>`;
    S.def(`<clipPath id="${S.id("zelt")}"><path d="M${-bw} ${-zb} L${-tw} ${-zt} L${tw} ${-zt} L${bw} ${-zb} Z"/></clipPath>`);
    /* Rautennetz (rot-braune Fugen) und in jeder Raute ein kleiner Stern (grün/gold) */
    let rt = "", st = "";
    for (let j = 0; j < 12; j++) {
      const y = -zb - j * 1.55, w = bw * (1 - (j * 1.55) / (zt - zb)), n = Math.max(2, Math.round(w / 0.75));
      for (let i = 0; i <= n; i++) { const x = -w + i * 2 * w / n, x2 = -w * 0.92 + (i + 0.5) * 2 * w * 0.92 / n; rt += `M${r(x)} ${r(y)} L${r(x2)} ${r(y - 1.55)}`; if (i < n) rt += `M${r(x + 2 * w / n)} ${r(y)} L${r(x2)} ${r(y - 1.55)}`; if (i < n) st += `<circle cx="${r(x2)}" cy="${r(y - 0.6)}" r=".2" fill="${(i + j) % 2 ? "#3f7f4f" : "#d9a93a"}"/>`; }
    }
    z += `<g clip-path="url(#${S.id("zelt")})"><path d="${rt}" stroke="#b9653a" stroke-width=".16" opacity=".8"/>${st}</g>`;
    z += `<path d="M${-bw * 0.42} ${-zb} L${-tw * 0.4} ${-zt} M${bw * 0.42} ${-zb} L${tw * 0.4} ${-zt}" stroke="#c9b18c" stroke-width=".3"/>`;
    /* kleine „Hörfenster“ im Zelt */
    z += `<path d="M-2.4 -45 l.7 -1.6 l.7 1.6 Z M1.2 -49 l.6 -1.4 l.6 1.4 Z" fill="#d29a3a" stroke="#fff" stroke-width=".15"/>`;
    z += `<rect x="-1.6" y="-61.6" width="3.2" height="3" fill="${S.lg("ztr", [[0, "#c9b18c"], [1, "#fff7e8"]], 0, 0, 1, 0)}"/><path d="M-1.1 -58.9 v-2 q.3 -.5 .6 0 v2 Z M.5 -58.9 v-2 q.3 -.5 .6 0 v2 Z" fill="#8a6a4a"/><rect x="-1.9" y="-61.9" width="3.8" height=".5" fill="#fff7e8"/>`;
    z += zwiebel(0, 61.9, 3.6, 3.2, "glatt", GOLD, GOLD) + kreuz(0, 65.1, 0.7);
    k += z;
    unterKathedrale.push({ id: "zeltdach", de: "das Zeltdach", syl: "ZELT-dach", it: "il tetto a tenda", itSyl: "TET-to a TEN-da", en: "tent roof",
      x: KP(0, 0).x, y: KP(0, 0).y, kunst: flaeche(-4 * KS, -66 * KS, 8 * KS, 19 * KS, 0.6),
      tipp: "Mit dem Zeltdach ist die Kirche 65 Meter hoch." });
  }
  k += kapelle({ u: -16, w: 6.4, top: 34, art: "winkel", f1: "#f4efe4", f2: "#c23b34" });        /* Nordost: Rot-Weiß */
  k += kapelle({ u: 21, w: 10, top: 46, art: "spirale", f1: "#3f8a4f", f2: "#f0c43c" });          /* West (Einzug in Jerusalem): größte */
  k += kapelle({ u: -7, w: 9.6, top: 44, art: "zickzack", f1: "#f4f6f8", f2: "#2f61a8" });      /* Nord (Zyprian und Justina): Blau-Weiß */
  k += kapelle({ u: 9, w: 6.6, top: 35, art: "rauten", f1: "#2f7a4f", f2: "#1d5236" });          /* Nordwest: grüne Rauten mit Spitzen */
  unterKathedrale.push({ id: "zwiebelkuppel", de: "die Zwiebelkuppel", syl: "ZWIE-bel-kup-pel", it: "la cupola a cipolla", itSyl: "CU-po-la a ci-POL-la", en: "onion dome",
    x: KP(-7, 0).x, y: KP(-7, 0).y, kunst: flaeche(-5 * KS, -44 * KS, 10 * KS, 12 * KS, 0.6),
    tipp: "Jede Kuppel hat eine andere Farbe und ein anderes Muster." });
  /* Vorbau mit Treppe (Nordseite) und kleinem Zeltdach */
  k += `<path d="M-14 -0.1 V-9 H-8 V-0.1 Z" fill="${ZIEGEL_M}"/><path d="M-14 -0.1 V-9 H-12.8 V-0.1 Z" fill="${ZIEGEL_S}"/><path d="M-12.4 -0.2 V-5.4 Q-11 -7.2 -9.6 -5.4 V-0.2 Z" fill="#33202a" stroke="${WEISS_L}" stroke-width=".35"/>`;
  k += `<path d="M-14.4 -9 L-11 -15 L-7.6 -9 Z" fill="${GRUEN_M}"/><path d="M-11 -15 L-7.6 -9 L-9.8 -9 Z" fill="${GRUEN_L}"/><path d="M-14.4 -9 L-11 -15" stroke="${SCHNEE}" stroke-width=".45"/>`;
  k += zwiebel(-11, 15, 1.5, 1.7, "glatt", GOLD, GOLD);
  /* überdachte Freitreppe hinauf zur Galerie */
  k += `<path d="M-19 0 L-14 -6 L-14 0 Z" fill="${ZIEGEL_S}"/><path d="M-19 0 L-14 -6" stroke="${WEISS_L}" stroke-width=".4"/><path d="M-18 -1.2 h1 M-17 -2.4 h1 M-16 -3.6 h1 M-15 -4.8 h1" stroke="${SCHNEE}" stroke-width=".35"/>`;
  /* Luftperspektive: zarter blauer Dunst über allem */
  S.teil({ id: "basiliuskathedrale", de: "die Basiliuskathedrale", syl: "BA-si-li-us-ka-the-dra-le", it: "la Cattedrale di San Basilio", itSyl: "cat-te-DRA-le di san ba-SI-lio", en: "St Basil's Cathedral",
    x: 0, y: 0, kunst: KG(k), zoom: { x: 108, y: 76, w: 153, h: 102 }, unter: unterKathedrale,
    tipp: "Die Basiliuskathedrale besteht aus neun Kirchen auf einem gemeinsamen Sockel. Sie ist fast 500 Jahre alt." });
}

/* =====================================================================
   3 — DAS DENKMAL für Minin und Poscharski (vor der Kathedrale)
   ===================================================================== */
{
  const d = 328, l = -13, s = F / d;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Granitsockel mit Bronzerelief, Schneekante */
  k += `<path d="M-2.6 0 V-4.4 H2.6 V0 Z" fill="${S.lg("sockel", [[0, "#9a969e"], [0.6, "#c4c0c6"], [1, "#e2dee0"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.9" y="-.5" width="5.8" height=".5" fill="#8a868c"/><rect x="-2.75" y="-4.65" width="5.5" height=".4" fill="#b9b5ba"/><rect x="-2.75" y="-4.85" width="5.5" height=".22" fill="${SCHNEE}"/>`;
  k += `<rect x="-1.9" y="-3.4" width="3.8" height="1.8" fill="#4e4030"/><path d="M-1.6 -1.8 l.4 -1.2 l.3 1.2 M-.6 -1.8 l.3 -1.3 l.3 1.3 M.5 -1.8 l.4 -1.1 l.3 1.1" stroke="#7b8a66" stroke-width=".18"/>`;
  /* Bronze: Poscharski sitzt (links), Minin steht und zeigt nach rechts zum Kreml */
  /* Bronze (braun mit grünlicher Patina in den Lichtern): links sitzt Poscharski mit Schild, Minin steht und zeigt mit dem rechten Arm zum Kreml */
  const BR = S.lg("bronze", [[0, "#2a2018"], [0.55, "#5a4630"], [0.85, "#7f8a5e"], [1, "#a3b07a"]], 0, 0, 1, 0);
  k += `<path d="M-2.2 -4.7 Q-2.3 -6.4 -1.5 -6.9 L-.5 -6.7 Q-.2 -5.6 -.4 -4.7 Z" fill="${BR}"/>`;
  k += `<ellipse cx="-2.25" cy="-5.8" rx=".6" ry=".9" fill="#3d3022" stroke="#9aa572" stroke-width=".14"/>`;
  k += `<circle cx="-1.05" cy="-7.25" r=".4" fill="${BR}"/><path d="M-1.55 -6.9 L-.55 -6.9 L-.75 -5.3 L-1.65 -5.3 Z" fill="${BR}"/>`;
  k += `<path d="M.05 -4.7 L.35 -7.6 Q.6 -8.35 1.1 -8.25 L1.55 -7.6 L1.7 -4.7 Z" fill="${BR}"/><circle cx=".95" cy="-8.65" r=".42" fill="${BR}"/>`;
  /* Minins Arm: schlank, leicht angewinkelt, mit Hand und ausgestrecktem Zeigefinger; Poscharski mit Helm und Schild */
  k += `<path d="M1.3 -7.8 Q2 -8.05 2.6 -8.5" stroke="#4e3c28" stroke-width=".28" stroke-linecap="round" fill="none"/><path d="M1.35 -7.9 Q2 -8.15 2.55 -8.6" stroke="#a3b07a" stroke-width=".08" fill="none"/><path d="M2.55 -8.55 l.35 -.2" stroke="#4e3c28" stroke-width=".12" stroke-linecap="round"/>`;
  k += `<path d="M.3 -7.4 Q-.1 -6.9 -.35 -6.4" stroke="#4e3c28" stroke-width=".26" stroke-linecap="round" fill="none"/>`;
  k += `<path d="M-1.45 -7.45 Q-1.05 -7.95 -.65 -7.45 Z" fill="#3d3022"/><path d="M-1.05 -7.95 V-8.2" stroke="#3d3022" stroke-width=".1"/><path d="M-2.25 -6.6 v1.6" stroke="#9aa572" stroke-width=".08"/>`;
  k += `<path d="M1.6 -7.6 L1.7 -4.8" stroke="#b9c48a" stroke-width=".2" opacity=".8"/></g>`;
  S.teil({ oben: true, id: "denkmal", de: "das Denkmal", syl: "DENK-mal", it: "il monumento", itSyl: "mo-nu-MEN-to", en: "monument", x: r(X(d, l)), y: r(Y(d)), steht: true, kunst: k + flaeche(-6, -17, 12, 17.5, 0.6),
    tipp: "Das Denkmal zeigt Minin und Poscharski. Es ist über 200 Jahre alt." });
}

/* =====================================================================
   4 — DER SPASSKI-TURM mit Uhr und Stern (in Metern, 1,94 je Meter)
   ===================================================================== */
{
  const d = 288.5, s = F / d, ox = r(X(d, 40)), oy = r(Y(d));
  const SP = (u, h) => ({ x: r(ox + u * s), y: r(oy - h * s) });
  let k = "";
  /* Stockwerk 1 (0–28 m): Vorderseite im Streiflicht, schmale Seite zum Platz im Schatten */
  k += `<path d="M-7.6 0 V-28 H-6.5 V0 Z" fill="${ZIEGEL_S}"/><rect x="-6.5" y="-28" width="13" height="28" fill="${ZIEGEL_M}"/>`;
  k += `<rect x="-6.5" y="-28" width="13" height="28" fill="${S.lg("spw", [[0, "#000", 0.08], [0.7, "#fff1d8", 0.05], [1, "#fff1d8", 0.18]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-7.6" y="-1.4" width="14.1" height="1.4" fill="${WEISS_M}"/><rect x="-7.6" y="-9.4" width="14.1" height=".5" fill="${WEISS_M}"/>`;
  /* weiße Blendnischen und der Bogenfries */
  for (const u of [-3.4, 3.4]) k += `<path d="M${u - 1.1} -12 V-18.5 Q${u} -20.2 ${u + 1.1} -18.5 V-12 Z" fill="#8f3d33" stroke="${WEISS_L}" stroke-width=".35"/>`;
  let fr = "";
  for (let u = -6.2; u < 6.4; u += 1.05) fr += `M${r(u)} -24.4 v-1.4 q.5 -.8 1 0 v1.4`;
  k += `<path d="${fr}" stroke="${WEISS_L}" stroke-width=".28" fill="none"/>`;
  k += `<rect x="-7.8" y="-28" width="14.6" height="1.2" fill="${WEISS_L}"/><rect x="-7.8" y="-28.3" width="14.6" height=".35" fill="${SCHNEE}"/>`;
  /* weiße Zierbrüstung mit Spitzen und die Ecktürmchen (bis 34 m) mit goldenen Fähnchen */
  let zb = "";
  for (let u = -5; u <= 5; u += 1.25) zb += `M${r(u - 0.3)} -28 L${r(u)} -30.2 L${r(u + 0.3)} -28 Z`;
  k += `<path d="${zb}" fill="${WEISS_L}"/>`;
  for (const u of [-6.3, 6.3]) {
    k += `<rect x="${u - 0.9}" y="-32.5" width="1.8" height="4.5" fill="${u < 0 ? WEISS_M : WEISS_L}"/><path d="M${u - 1} -32.5 L${u} -35.4 L${u + 1} -32.5 Z" fill="${WEISS_L}"/>`;
    k += `<path d="M${u} -35.4 V-36.4" stroke="#d6a93a" stroke-width=".25"/><path d="M${u} -36.4 l.8 .3 l-.8 .3" fill="#e2b84a"/>`;
  }
  /* Uhrgeschoss (28–41 m) */
  k += `<path d="M-5.7 -28 V-41 H-5 V-28 Z" fill="${ZIEGEL_S}"/><rect x="-5" y="-41" width="10" height="13" fill="${ZIEGEL_M}"/>`;
  k += `<path d="M-5 -28 V-41 M5 -28 V-41" stroke="${WEISS_L}" stroke-width=".7"/>`;
  {
    /* Zifferblatt 6,1 m: schwarz, goldener Ring, goldene Stundenstriche; 14:20 Uhr */
    const cy = -34.5, R = 3.05;
    let u = `<circle cx="0" cy="${cy}" r="${R + 0.35}" fill="${GOLD}"/><circle cx="0" cy="${cy}" r="${R}" fill="#14161c"/>`;
    let st = "";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, r1 = R * 0.8, r2 = R * (i % 3 ? 0.92 : 0.95); st += `M${r(Math.sin(a) * r1 * 100) / 100} ${r((cy - Math.cos(a) * r1) * 100) / 100} L${r(Math.sin(a) * r2 * 100) / 100} ${r((cy - Math.cos(a) * r2) * 100) / 100}`; }
    u += `<path d="${st}" stroke="#e9c35a" stroke-width=".38"/>`;
    u += `<circle cx="0" cy="${cy}" r="${R * 0.62}" fill="none" stroke="#c9a24a" stroke-width=".12"/>`;
    const hA = (2 + 20 / 60) * Math.PI / 6, mA = 20 / 60 * Math.PI * 2;
    u += `<path d="M0 ${cy} L${r(Math.sin(hA) * 1.6 * 100) / 100} ${r((cy - Math.cos(hA) * 1.6) * 100) / 100} M0 ${cy} L${r(Math.sin(mA) * 2.4 * 100) / 100} ${r((cy - Math.cos(mA) * 2.4) * 100) / 100}" stroke="#f2cf68" stroke-width=".32" stroke-linecap="round"/>`;
    u += `<circle cx="0" cy="${cy}" r=".3" fill="#f2cf68"/><path d="M-2.2 -36.6 A3 3 0 0 1 1.4 -37.3" stroke="#fff" stroke-width=".25" opacity=".35" fill="none"/>`;
    k += u;
  }
  k += `<rect x="-5.6" y="-42.5" width="11.2" height="1.5" fill="${WEISS_L}"/><rect x="-5.6" y="-42.8" width="11.2" height=".4" fill="${SCHNEE}"/>`;
  for (const u of [-5.1, 5.1]) k += `<path d="M${u - 0.5} -42.5 V-44.2 L${u} -45.8 L${u + 0.5} -44.2 V-42.5 Z" fill="${WEISS_L}"/><circle cx="${u}" cy="-46" r=".25" fill="#e2b84a"/>`;
  /* Erstes Achteck (42,5–51 m) mit Bogenöffnungen und weißen Säulchen */
  k += achteck(0, 8, 42.5, 51, ZIEGEL_S, ZIEGEL_M, ZIEGEL_L);
  k += `<path d="M-1.2 -43.5 V-48.6 Q0 -50.2 1.2 -48.6 V-43.5 Z M-3.75 -43.5 V-48.4 Q-3.1 -49.6 -2.5 -48.4 V-43.5 Z M2.5 -43.5 V-48.4 Q3.1 -49.6 3.75 -48.4 V-43.5 Z" fill="#2a1a22"/>`;
  k += `<path d="M-1.66 -42.5 V-51 M1.66 -42.5 V-51 M-4 -42.5 V-51 M4 -42.5 V-51" stroke="${WEISS_L}" stroke-width=".45"/>`;
  /* weiße Bogenrahmen über den Öffnungen, Glocken im Dunkel, Zierspitzen am Achteck */
  k += `<path d="M-1.45 -48.3 Q0 -50.6 1.45 -48.3 M-3.85 -48.2 Q-3.1 -49.9 -2.4 -48.2 M2.4 -48.2 Q3.1 -49.9 3.85 -48.2" stroke="${WEISS_L}" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-.7 -45.6 Q0 -47.2 .7 -45.6 Z" fill="#b08a3a"/><rect x="-1.66" y="-43.6" width="3.32" height=".35" fill="${WEISS_M}"/>`;
  for (const u of [-4, -1.66, 1.66, 4]) k += `<path d="M${u - 0.35} -51 L${u} -52.8 L${u + 0.35} -51 Z" fill="${WEISS_L}"/>`;
  k += `<rect x="-4.3" y="-51.6" width="8.6" height=".7" fill="${WEISS_L}"/><rect x="-4.3" y="-51.8" width="8.6" height=".3" fill="${SCHNEE}"/>`;
  /* Zweites Achteck (51,6–55 m) */
  k += achteck(0, 6.4, 51.6, 55, "#c9c0b8", WEISS_M, WEISS_L);
  k += `<path d="M-1.33 -52 V-54.6 M1.33 -52 V-54.6 M-.3 -52.2 v-1.8 q.3 -.5 .6 0 v1.8 Z" stroke="#8f3d33" stroke-width=".3" fill="#5a2a2a"/>`;
  /* Zeltdach, grün, mit hellen Gratlinien und Hörfenstern */
  k += `<path d="M-3.1 -55 L-.25 -66.6 L0 -66.6 L-1.3 -55 Z" fill="${GRUEN_S}"/><path d="M-1.3 -55 L0 -66.6 L1.3 -55 Z" fill="${GRUEN_M}"/><path d="M1.3 -55 L0 -66.6 L.25 -66.6 L3.1 -55 Z" fill="${GRUEN_L}"/>`;
  k += `<path d="M-1.3 -55 L0 -66.6 L1.3 -55" stroke="#8fc1a3" stroke-width=".18" fill="none"/>`;
  let ra = "";
  for (let j = 1; j < 6; j++) { const y = -55 - j * 2, w = 3.1 * (1 - j * 2 / 11.6); ra += `M${r(-w)} ${y} H${r(w)}`; }
  k += `<path d="${ra}" stroke="#1d3f31" stroke-width=".12" opacity=".6"/>`;
  k += `<path d="M-.6 -59 l.6 -1.4 l.6 1.4 Z" fill="${WEISS_L}"/>`;
  k += `<path d="M0 -66.6 V-67.8" stroke="#d6a93a" stroke-width=".3"/><circle cx="0" cy="-67.6" r=".4" fill="${GOLD}"/>`;
  /* der rote Stern (3,75 m): fünf Strahlen, jede Hälfte anders beleuchtet, Goldrand */
  {
    const cy = -70, R = 1.9, ri = 0.78;
    let licht = "", dunkel = "", rand = "";
    for (let i = 0; i < 5; i++) {
      const a = i * 2 * Math.PI / 5, aL = a - Math.PI / 5, aR = a + Math.PI / 5;
      const tip = [Math.sin(a) * R, cy - Math.cos(a) * R], L = [Math.sin(aL) * ri, cy - Math.cos(aL) * ri], Rr = [Math.sin(aR) * ri, cy - Math.cos(aR) * ri];
      const f = (q) => `${r(q[0] * 100) / 100} ${r(q[1] * 100) / 100}`;
      licht += `M0 ${cy} L${f(tip)} L${f(Rr)}Z`;
      dunkel += `M0 ${cy} L${f(L)} L${f(tip)}Z`;
      rand += `${i ? "L" : "M"}${f(tip)} L${f(Rr)} `;
    }
    k += `<path d="${dunkel}" fill="#8e1018"/><path d="${licht}" fill="#e2333a"/><path d="${rand}Z" fill="none" stroke="#e6bd4a" stroke-width=".22" stroke-linejoin="miter"/>`;
    k += `<circle cx=".5" cy="${cy - 0.6}" r=".35" fill="#fff" opacity=".5"/>`;
  }
  const P0 = SP(0, 0);
  S.teil({ id: "spasski_turm", de: "der Spasski-Turm", syl: "SPAS-ski-turm", it: "la Torre del Salvatore", itSyl: "TOR-re del sal-va-TO-re", en: "Spasskaya Tower",
    x: ox, y: oy, steht: true, kunst: `<g transform="scale(${s.toFixed(4)})" filter="url(#${S.id("luft")})">${k}</g>`,
    zoom: { x: 214, y: 34, w: 127, h: 85 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: P0.x, y: r(oy - 34.5 * s),
        kunst: flaecheEllipse(0, 0, 3.6 * s, 3.6 * s), tipp: "Die Uhr am Spasski-Turm zeigt die Moskauer Zeit. Ihr Zifferblatt ist sechs Meter groß." },
      { id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x: P0.x, y: r(oy - 70 * s),
        kunst: flaecheEllipse(0, 0, 2.3 * s, 2.3 * s), tipp: "Der Stern ist aus rotem Glas. Nachts leuchtet er." },
    ],
    tipp: "Der Spasski-Turm ist 71 Meter hoch. Er ist der berühmteste Turm des Kremls." });
}

/* =====================================================================
   5 — DIE KREMLMAUER mit Schwalbenschwanz-Zinnen und dem Senatsturm
   ===================================================================== */
{
  const L = 38, D0 = 106.5, D1 = 288.5;
  let k = "";
  /* Mauerkörper mit Zinnenkrone als ein Umriss */
  let u = `M${P(D0, L, 0)} L${P(D0, L, 12)}`;
  const zinnen = [];
  for (let d = D0 + 0.4; d + 2.1 < D1; d += 3) zinnen.push(d);
  for (const d of zinnen) u += ` L${P(d, L, 12)} L${P(d, L, 14)} L${P(d + 1.05, L, 13.25)} L${P(d + 2.1, L, 14)} L${P(d + 2.1, L, 12)}`;
  u += ` L${P(D1, L, 12)} L${P(D1, L, 0)} Z`;
  k += `<path d="${u}" fill="${S.lg("mauer", [[0, "#8a5149"], [0.5, "#7a3d36"], [1, "#6a302c"]], 270, 0, 400, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
  /* Himmelslicht oben, Fugen in Flucht */
  let fu = "";
  for (const h of [1.5, 3, 4.5, 6, 7.5, 9, 10.5]) fu += `M${P(D0, L, h)} L${P(D1, L, h)}`;
  k += `<path d="${fu}" stroke="#5a2724" stroke-width=".22" opacity=".55"/>`;
  k += `<path d="M${P(D0, L, 11.6)} L${P(D1, L, 11.6)}" stroke="#a7675b" stroke-width=".5" opacity=".7"/>`;
  /* Schießscharten in den Zinnen und Schnee auf den Hörnern */
  let sl = "", sn = "";
  for (const d of zinnen) {
    sl += `M${P(d + 0.95, L, 12.3)} L${P(d + 0.95, L, 13)} L${P(d + 1.15, L, 13)} L${P(d + 1.15, L, 12.3)}Z`;
    sn += `M${P(d, L, 14)} L${P(d + 1.05, L, 13.25)} L${P(d + 2.1, L, 14)}`;
  }
  k += `<path d="${sl}" fill="#3a1c1e"/><path d="${sn}" stroke="${SCHNEE}" stroke-width=".55" fill="none" stroke-linejoin="round"/>`;
  /* Senatsturm (34 m) mitten über dem Mausoleum */
  {
    const d = 158, s = F / d, ox = r(X(d, 38.25)), oy = r(Y(d));
    /* liegt im Schatten (Seite zum Platz, Gegenlicht): gedämpftes Rot, etwas Luftdunst */
    let t = `<path d="M-6 0 V-19 H-4.25 V0 Z" fill="#5e3030"/><rect x="-4.25" y="-19" width="8.5" height="19" fill="#7e3d36"/>`;
    t += `<rect x="-4.25" y="-19" width="8.5" height="19" fill="${S.lg("sen", [[0, "#000", 0.12], [0.85, "#fff1d8", 0.04], [1, "#ffd9a8", 0.28]], 0, 0, 1, 0)}"/>`;
    /* weißer Bogenfries, Blendfenster, Ecklisenen */
    let bf = "";
    for (let u = -4; u < 4.2; u += 1.05) bf += `M${r(u)} -16.6 v-.9 q.5 -.7 1 0 v.9`;
    t += `<path d="${bf}" stroke="#c4b2a6" stroke-width=".25" fill="none"/><path d="M-4.25 -15.6 h8.5 M-4.25 -18.4 h8.5" stroke="#c4b2a6" stroke-width=".35"/>`;
    t += `<path d="M-.75 -8 v-3.4 q.75 -1.1 1.5 0 v3.4 Z M-.5 -3 v-2.2 q.5 -.7 1 0 v2.2 Z" fill="#2e1618" stroke="#c4b2a6" stroke-width=".25"/>`;
    /* Zinnenkranz oben, das Zeltdach steht eingerückt dahinter: steil und schmal, mit Gauben */
    t += `<path d="M-3.2 -19 L-.2 -33.5 L.2 -33.5 L3.2 -19 Z" fill="#2f5545"/><path d="M-3.2 -19 L-.2 -33.5 L-.9 -19 Z" fill="#244236"/><path d="M.9 -19 L.2 -33.5 L3.2 -19 Z" fill="#3d6a56"/>`;
    t += `<path d="M-.9 -19 L-.2 -33.5 M.9 -19 L.2 -33.5" stroke="#7fae94" stroke-width=".18"/>`;
    t += `<path d="M-.6 -24 l.6 -1.7 l.6 1.7 Z M-.4 -28.5 l.4 -1.2 l.4 1.2 Z" fill="#c9bfb4"/><path d="M-3.2 -19 L-.2 -33.5" stroke="${SCHNEE}" stroke-width=".25" opacity=".8"/>`;
    let zt = "";
    for (let i = 0; i < 4; i++) { const a = -4.25 + i * 2.2; zt += `M${r(a)} -19 V-21.4 L${r(a + 0.55)} -20.7 L${r(a + 1.1)} -21.4 V-19 Z`; }
    t += `<path d="${zt}" fill="#7e3d36"/><path d="M-6 -19 V-21.4 L-5.4 -20.7 L-4.8 -21.4 V-19 Z" fill="#5e3030"/>`;
    t += `<path d="${zt.replace(/V-19 Z/g, "")}" stroke="${SCHNEE}" stroke-width=".35" fill="none"/>`;
    t += `<path d="M0 -33.5 V-35.6" stroke="#d6a93a" stroke-width=".22"/><circle cx="0" cy="-34.3" r=".3" fill="${GOLD}"/>`;
    /* liegt hinter der Mauerlinie und hinter dem Mausoleum: als Kulisse, damit die Trefferfläche der Mauer
       nicht in den Himmel reicht; Luftdunst über den Farbfilter */
    S.hinten(`<g transform="translate(${ox} ${oy}) scale(${s.toFixed(4)})" filter="url(#${S.id("luft")})">${t}</g>`);
  }
  /* Zarenturm-Ansatz: die Mauer läuft am Spasski-Turm vorbei nach hinten (Kulisse) */
  const zz = zinnen.filter((d) => d < 150);
  const zi = zz[Math.floor(zz.length * 0.45)];
  S.teil({ id: "kremlmauer", de: "die Kremlmauer", syl: "KREML-mau-er", it: "le mura del Cremlino", itSyl: "MU-ra del crem-LI-no", en: "Kremlin wall",
    x: 0, y: 0, kunst: k, zoom: { x: 318, y: 104, w: 82, h: 55 },
    unter: [{ id: "zinne", de: "die Zinne", syl: "ZIN-ne", it: "il merlo", itSyl: "MER-lo", en: "battlement", x: r(X(zi + 1.05, L)), y: r(Y(zi + 1.05, 13)),
      kunst: flaeche(-3.4, -3.4, 6.8, 6.4, 0.6), tipp: "Die Zinnen der Kremlmauer sehen aus wie ein Schwalbenschwanz." }],
    tipp: "Die Mauer des Kremls ist über zwei Kilometer lang und hat 20 Türme." });
}

/* =====================================================================
   6 — DIE FICHTEN (Blaufichten vor der Mauer, verschneit)
   ===================================================================== */
{
  let k = "";
  const FI = S.lg("fichte", [[0, "#1d3a3c"], [0.6, "#2f5a58"], [1, "#4f7e78"]], 0, 0, 1, 0), FS = S.lg("fs", [[0, "#9fb0cc", 0.6], [0.5, "#fff", 0], [1, "#fff", 0]], 0, 0, 1, 0);
  const baum = (d, h, seed) => {
    const z = zufall(seed);
    let g = `<g>`;
    g += `<rect x="-.18" y="-.9" width=".36" height=".9" fill="#3a2a24"/>`;
    /* gelappter Kegel: Astlagen, die unteren breiter, Himmelslücken dazwischen */
    let ast = "", schnee = "";
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, y0 = -0.6 - t0 * (h - 0.6), y1 = y0 - (h - 0.6) / n * 1.5;
      const w = (1 - t0) * h * 0.24 + 0.25, j = (z() - 0.5) * 0.3;
      ast += `M${r(-w + j)} ${r(y0)} Q${r(-w * 0.55)} ${r(y0 - 0.5)} ${r(-w * 0.2)} ${r(y1 + 0.3)} L0 ${r(y1)} L${r(w * 0.2)} ${r(y1 + 0.3)} Q${r(w * 0.55)} ${r(y0 - 0.5)} ${r(w + j)} ${r(y0)} Q${r(w * 0.5)} ${r(y0 - 0.25)} ${r(w * 0.3)} ${r(y0 + 0.15)} Q0 ${r(y0 - 0.2)} ${r(-w * 0.3)} ${r(y0 + 0.15)} Q${r(-w * 0.5)} ${r(y0 - 0.25)} ${r(-w + j)} ${r(y0)}Z`;
      schnee += `M${r(-w * 0.15)} ${r(y1 + 0.45)} Q${r(w * 0.4)} ${r(y0 - 0.7)} ${r(w * 0.95 + j)} ${r(y0 - 0.1)} Q${r(w * 0.5)} ${r(y0 - 0.35)} ${r(w * 0.1)} ${r(y0 - 0.1)} Q${r(-w * 0.4)} ${r(y0 - 0.5)} ${r(-w * 0.8)} ${r(y0 - 0.05)} Q${r(-w * 0.45)} ${r(y0 - 0.8)} ${r(-w * 0.15)} ${r(y1 + 0.45)}Z`;
    }
    g += `<path d="${ast}" fill="${FI}"/>`;
    g += `<path d="${schnee}" fill="${SCHNEE}" opacity=".92"/>`;
    g += `<path d="${schnee}" fill="${FS}"/>`;
    g += `<path d="M0 ${r(-h)} V${r(-h - 0.5)}" stroke="#2f5a58" stroke-width=".18"/></g>`;
    return g;
  };
  /* drei Baumformen als Symbole (Höhe 10 m), mit <use> in verschiedenen Größen und Neigungen gesetzt */
  for (let v = 0; v < 3; v++) S.def(`<g id="${S.id("fi" + v)}">${baum(0, 10, 40 + v * 7)}</g>`);
  const reihe = [[105.5, 8.4, 0], [112, 11.4, 1], [119, 9.2, 2], [126, 12, 0], [133, 8.8, 1], [140, 11, 2], [147, 9.6, 0]];
  for (let i = reihe.length - 1; i >= 0; i--) {
    const [d, h, v] = reihe[i], s = F / d * h / 10, x = X(d, 34.6), y = Y(d), b = 0.85 + ((i * 37) % 10) / 25;
    k += `<use href="#${S.id("fi" + v)}" transform="translate(${r(x)} ${r(y)}) scale(${(s * b).toFixed(4)} ${s.toFixed(4)}) rotate(${((i % 3) - 1) * 1.5})"/>`;
  }
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: 0, y: 0, kunst: k,
    tipp: "Vor der Kremlmauer stehen Blaufichten. Sie sind auch im Winter grün." });
}

/* =====================================================================
   7 — DAS MAUSOLEUM (Stufenpyramide aus rotem Granit und Labradorit)
   ===================================================================== */
{
  const D0 = 150, D1 = 174, L0 = 23, L1 = 36.5;
  const GR = S.lg("granit", [[0, "#7a3a33"], [1, "#8e4a3f"]], 0, 0, 1, 0), GRS = "#4e2a28", LAB = S.lg("labr", [[0, "#2a2a33"], [0.5, "#3b3e4c"], [1, "#24242b"]], 0, 0, 1, 0);
  const stufen = [[0, 0.8, -0.3, "#5c5a60", "#47454b"], [0.8, 3.6, 0, GR, GRS], [3.6, 4.9, 0.3, LAB, "#1b1b21"], [4.9, 6.2, 1.1, GR, GRS], [6.2, 7.3, 1.4, LAB, "#1b1b21"], [7.3, 8.6, 2.1, GR, GRS], [8.6, 11, 3.2, "#1f1d24", "#17161b"], [11, 12, 2.9, GR, GRS]];
  let k = "";
  for (const [h0, h1, i, fv, fs] of stufen) {
    /* Seite zum Platz (Schatten) und Stirnseite zum Betrachter (Streiflicht) */
    k += poly([P(D0 + i, L0 + i, h0), P(D1 - i, L0 + i, h0), P(D1 - i, L0 + i, h1), P(D0 + i, L0 + i, h1)], fs);
    k += poly([P(D0 + i, L0 + i, h0), P(D0 + i, L1 - i, h0), P(D0 + i, L1 - i, h1), P(D0 + i, L0 + i, h1)], fv);
    /* polierte Kanten: Lichtkante oben, dunkle Unterkante */
    k += `<path d="M${P(D0 + i, L0 + i, h1 - 0.05)} L${P(D0 + i, L1 - i, h1 - 0.05)}" stroke="#e8b8a8" stroke-width=".35" opacity=".45"/><path d="M${P(D0 + i, L0 + i, h0 + 0.05)} L${P(D0 + i, L1 - i, h0 + 0.05)}" stroke="#000" stroke-width=".4" opacity=".35"/>`;
  }
  /* Fugen der Granitblöcke auf der Stirnseite */
  let fg = "";
  for (const l of [27.5, 32]) fg += `M${P(D0, l, 0.8)} L${P(D0, l, 3.6)}`;
  k += `<path d="${fg}" stroke="#5a2a26" stroke-width=".2" opacity=".5"/>`;
  /* der dunkle Eingang auf der Platzseite (Streiflicht) */
  k += poly([P(160, L0, 0.8), P(164, L0, 0.8), P(164, L0, 3.4), P(160, L0, 3.4)], "#111015");
  /* Pfeiler im Portikus oben und Schneekanten auf den Stufen */
  let pf = "";
  for (let j = 0; j < 5; j++) { const l = 23 + 3.4 + j * 1.75; pf += poly([P(D0 + 3.3, l, 8.6), P(D0 + 3.3, l + 0.7, 8.6), P(D0 + 3.3, l + 0.7, 11), P(D0 + 3.3, l, 11)], "#a8705e") + poly([P(D0 + 3.3, l, 8.6), P(D0 + 3.3, l + 0.22, 8.6), P(D0 + 3.3, l + 0.22, 11), P(D0 + 3.3, l, 11)], "#d09a84"); }
  k += pf;
  let sn = "";
  for (const [h, i] of [[4, 0], [6.4, 1.1], [8.6, 2.2], [12, 3]]) sn += `M${P(D1 - i, L0 + i, h)} L${P(D0 + i, L0 + i, h)} L${P(D0 + i, L1 - i, h)}`;
  k += `<path d="${sn}" stroke="${SCHNEE}" stroke-width=".7" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${P(D0, L1, 4)} L${P(D0, L0, 4)}" stroke="#b55a4c" stroke-width=".3" opacity=".6"/>`;
  S.teil({ id: "mausoleum", de: "das Mausoleum", syl: "mau-so-LE-um", it: "il mausoleo", itSyl: "mau-so-LE-o", en: "mausoleum", x: 0, y: 0, kunst: k,
    tipp: "Das Mausoleum ist aus rotem und schwarzem Stein gebaut, wie eine Treppe." });
}

/* =====================================================================
   8 — DAS KAUFHAUS GUM (242 m, links, in der Sonne)
   ===================================================================== */
{
  const L = -38, D0 = 106.5, D1 = 277, H = 20.5;
  let k = "";
  /* Dach (verschneit) hinter dem Gesims */
  k += poly([P(D0, L, H), P(D1, L, H), P(D1, L - 6, 23.6), P(D0, L - 6, 23.6)], SCHNEE);
  k += poly([P(D0, L - 3, 22), P(D1, L - 3, 22), P(D1, L - 6, 23.6), P(D0, L - 6, 23.6)], SCHNEE_S, ` opacity=".6"`);
  /* Fassade: heller Kalkstein und Marmor, warm in der Sonne (schaut nach Westsüdwest); Sockel aus rotem finnischem Granit */
  k += poly([P(D0, L, 0), P(D1, L, 0), P(D1, L, H), P(D0, L, H)], S.lg("gum", [[0, "#f8e2ba"], [0.5, "#f1d4a6"], [1, "#dcc8aa"]], 0, 0, 140, 0, ' gradientUnits="userSpaceOnUse"'));
  k += poly([P(D0, L, 0), P(D1, L, 0), P(D1, L, 1.5), P(D0, L, 1.5)], "#7a3330") + poly([P(D0, L, 1.35), P(D1, L, 1.35), P(D1, L, 1.55), P(D0, L, 1.55)], "#b5655a");
  /* Gesimse mit Schlagschatten darunter, Schnee obenauf */
  for (const [h, w] of [[7, 0.55], [12.6, 0.5], [18, 0.45], [H, 0.95]]) {
    k += poly([P(D0, L, h - w - 0.6), P(D1, L, h - w - 0.6), P(D1, L, h - w), P(D0, L, h - w)], "#9c7a52", ` opacity=".7"`);
    k += poly([P(D0, L, h - w), P(D1, L, h - w), P(D1, L, h), P(D0, L, h)], "#fff7e6");
    k += `<path d="M${P(D0, L, h + 0.08)} L${P(D1, L, h + 0.08)}" stroke="${SCHNEE}" stroke-width=".5"/>`;
  }
  /* Fensterachsen: Rundbogenfenster mit weißen Steinrahmen (Naličniki), oben gepaarte Fenster, Ornamentfelder */
  let fen = "", glanz = "", pil = "", rahmen = "", sims = "", orn = "";
  const bogen = (d0, d1, h0, h1) => { const m = (d0 + d1) / 2, rr = (d1 - d0) / 2, c = 0.552 * rr;
    return `M${P(d0, L, h0)} L${P(d0, L, h1)} C${P(d0, L, h1 + c)} ${P(m - c, L, h1 + rr)} ${P(m, L, h1 + rr)} C${P(m + c, L, h1 + rr)} ${P(d1, L, h1 + c)} ${P(d1, L, h1)} L${P(d1, L, h0)}Z`; };
  for (let d = D0 + 0.1; d < D1 - 2; d += 4.4) {
    if (d > 146 && d < 166) continue;   /* Mittelportal */
    pil += `M${P(d, L, 1.5)} L${P(d, L, H - 0.95)}`;
    fen += bogen(d + 0.8, d + 3.6, 1.7, 5);
    rahmen += bogen(d + 0.6, d + 3.8, 1.6, 5);
    if (d < 215) {
      fen += bogen(d + 1.1, d + 3.3, 8.2, 10.1) + bogen(d + 1.1, d + 3.3, 13.5, 15.6);
      rahmen += bogen(d + 0.9, d + 3.5, 8.05, 10.1) + bogen(d + 0.95, d + 3.45, 13.35, 15.6);
      sims += `M${P(d + 0.8, L, 8.05)} L${P(d + 3.6, L, 8.05)} M${P(d + 1, L, 13.4)} L${P(d + 3.4, L, 13.4)}`;

    } else fen += bogen(d + 1, d + 3.4, 8.2, 10.3) + bogen(d + 1.1, d + 3.3, 13.5, 15.6);
    if (d < 150) glanz += `M${P(d + 0.9, L, 1.8)} L${P(d + 2, L, 1.8)} L${P(d + 1.2, L, 4.6)} L${P(d + 0.9, L, 4.6)}Z`;
  }
  k += `<path d="${pil}" stroke="#fffaf0" stroke-width=".7" opacity=".85"/>`;
  k += `<path d="${rahmen}" fill="#fffaf0"/>`;
  k += `<path d="${fen}" fill="${S.lg("gumfen", [[0, "#3b4660"], [0.6, "#56657e"], [1, "#2e3446"]])}"/>`;
  k += `<path d="${glanz}" fill="#c9d8ee" opacity=".4"/><path d="${orn}" fill="#c9a26a"/><path d="${sims}" stroke="${SCHNEE}" stroke-width=".9"/>`;
  /* warmes Licht in den Schaufenstern */
  let wl = "";
  for (let d = D0 + 0.1; d < 200; d += 4.4) if (!(d > 146 && d < 166)) wl += `M${P(d + 1.2, L, 1.8)} L${P(d + 3.2, L, 1.8)} L${P(d + 3.2, L, 2.7)} L${P(d + 1.2, L, 2.7)}Z`;
  k += `<path d="${wl}" fill="#ffd27a" opacity=".55"/>`;
  /* Mittelportal (d 147–165): großes Rundbogenportal, darüber ein hohes Rundbogenfenster und der geschwungene Giebel */
  {
    const a = 147, b = 165, m = 156;
    const gieb = `M${P(a, L, H)} L${P(a, L, 24.5)} C${P(a, L, 28.5)} ${P(m - 3, L, 28)} ${P(m, L, 31)} C${P(m + 3, L, 28)} ${P(b, L, 28.5)} ${P(b, L, 24.5)} L${P(b, L, H)}Z`;
    k += poly([P(a, L, 0), P(b, L, 0), P(b, L, H), P(a, L, H)], "#f6dfb4");
    k += `<path d="${gieb}" fill="#f4dcb0"/><path d="${gieb}" fill="none" stroke="#fffaf0" stroke-width=".7"/>`;
    k += `<path d="M${P(a, L, 24.5)} C${P(a, L, 28.5)} ${P(m - 3, L, 28)} ${P(m, L, 31)} C${P(m + 3, L, 28)} ${P(b, L, 28.5)} ${P(b, L, 24.5)}" stroke="${SCHNEE}" stroke-width="1" fill="none"/>`;
    k += `<path d="M${P(m, L, 31)} L${P(m, L, 33.5)}" stroke="#d6a93a" stroke-width=".5"/>`;
    k += `<path d="${bogen(a + 4.6, b - 4.6, 0.2, 6)}" fill="#2b3245"/><path d="${bogen(a + 4, b - 4, 0.2, 6)}" fill="none" stroke="#fffaf0" stroke-width=".8"/>`;
    k += `<path d="${bogen(a + 4, b - 4, 12, 20)}" fill="${S.lg("gumgr", [[0, "#9fb6d2"], [0.5, "#5f7392"], [1, "#2e3446"]])}"/><path d="${bogen(a + 3.5, b - 3.5, 11.8, 20)}" fill="none" stroke="#fffaf0" stroke-width=".6"/>`;
    k += `<path d="M${P(m, L, 12)} L${P(m, L, 25)} M${P(m - 2.5, L, 12)} L${P(m - 2.5, L, 23.4)} M${P(m + 2.5, L, 12)} L${P(m + 2.5, L, 23.4)} M${P(a + 4, L, 16)} L${P(b - 4, L, 16)}" stroke="#e8dcc6" stroke-width=".35"/>`;
    /* Schild ГУМ über dem Portal */
    const sx = X(m, L), sy = Y(m, 9.6);
    k += `<text x="${r(sx)}" y="${r(sy)}" font-size="${r(2.2 * F / m)}" text-anchor="middle" fill="#8a2a24" font-family="Georgia,'Times New Roman',serif" font-weight="bold" transform="skewY(-14) translate(0 ${r(sx * Math.tan(14 * Math.PI / 180))})">ГУМ</text>`;
  }
  /* Türmchen auf dem Dach: kleine Laternen mit grünen Zeltdächern und Goldspitzen */
  const turm = (d, hoch) => {
    const s = F / d, x = X(d, L), y = Y(d, H);
    /* kurzes Türmchen: Kasten mit Bogenfenster, Kranz aus drei Kielbögen, Zeltdach, kleiner Goldknauf */
    const t0 = hoch ? 5.2 : 3.6, t1 = t0 + (hoch ? 5.5 : 4.2), w = hoch ? 1.6 : 1.3;
    let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${s.toFixed(4)})"><rect x="${-w}" y="${-t0}" width="${2 * w}" height="${t0}" fill="#f4dcb0"/><rect x="${-w}" y="${-t0}" width="${r(w * 0.45)}" height="${t0}" fill="#d9c09a"/>`;
    g += `<path d="M-.4 -.6 v${r(-t0 * 0.45)} q.4 -.6 .8 0 v${r(t0 * 0.45)} Z" fill="#3b4660"/>`;
    let kb = "";
    for (let i = 0; i < 3; i++) { const a = -w + i * 2 * w / 3, b = a + 2 * w / 3, m = (a + b) / 2; kb += `M${r(a)} ${-t0} Q${r(a)} ${r(-t0 - 0.6)} ${r(m)} ${r(-t0 - 1.1)} Q${r(b)} ${r(-t0 - 0.6)} ${r(b)} ${-t0}`; }
    g += `<path d="${kb}Z" fill="#fff4dc" stroke="#d9c09a" stroke-width=".15"/><path d="M${-w} ${-t0} h${2 * w}" stroke="${SCHNEE}" stroke-width=".4"/>`;
    g += `<path d="M${r(-w * 0.9)} ${r(-t0 - 0.9)} L0 ${-t1} L${r(w * 0.9)} ${r(-t0 - 0.9)} Z" fill="${GRUEN_L}"/><path d="M${r(-w * 0.9)} ${r(-t0 - 0.9)} L0 ${-t1} L${r(-w * 0.2)} ${r(-t0 - 0.9)} Z" fill="${GRUEN_M}"/><circle cx="0" cy="${r(-t1 - 0.3)}" r=".32" fill="#e2b84a"/></g>`;
    return g;
  };
  /* Türmchen über dem Dach als Vordergrund-Schicht ohne eigene Trefferfläche (sonst meldet der Himmel „das Kaufhaus“) */
  let tg = "";
  for (const [d, hoch] of [[276, true], [237, false], [197, false], [168, true], [144, true], [117, false]]) tg += turm(d, hoch);
  S.davor(`<g pointer-events="none">${tg}</g>`);
  S.teil({ id: "kaufhaus", de: "das Kaufhaus", syl: "KAUF-haus", it: "il grande magazzino", itSyl: "GRAN-de ma-gaz-ZI-no", en: "department store",
    x: 0, y: 0, kunst: k, zoom: { x: 0, y: 104, w: 105, h: 70 },
    unter: [{ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window",
      x: r(X(100, L)), y: r(Y(100, 1.5)), kunst: flaeche(-7, -20, 14, 20, 0.6) }],
    tipp: "Das GUM ist ein großes Kaufhaus mit Glasdach. Es ist über 130 Jahre alt." });
}

/* =====================================================================
   9 — DER MARKTSTAND (Holzbude mit Schnitzwerk; 21 m vor dem Betrachter)
   ===================================================================== */
const STAND = { d: 21, l0: -6.9, l1: -3.7, theke: 1.05 };
{
  const { d, l0, l1, theke } = STAND, d1 = d + 2.4;
  let k = "";
  /* Rückwand und Regal (innen, im Schatten) */
  k += poly([P(d1, l0, 0.9), P(d1, l1, 0.9), P(d1, l1, 2.55), P(d1, l0, 2.55)], "#5a3424");
  k += poly([P(d1, l0, 1.9), P(d1, l1, 1.9), P(d1, l1, 1.98), P(d1, l0, 1.98)], "#8a5a38");
  /* im Regal: eine Reihe Matrjoschkas und Kringel (Baranki) an Schnüren */
  let rg = "";
  for (let i = 0; i < 7; i++) {
    const l = l0 + 0.3 + i * 0.42, x = X(d1, l), y = Y(d1, 1.98), s = F / d1, h = (0.15 + (i % 3) * 0.03) * s, w = h * 0.55;
    const c = ["#c8302c", "#2f5fa0", "#e0a23a", "#2f7a4f"][i % 4];
    rg += `<path d="M${r(x - w / 2)} ${r(y)} Q${r(x - w * 0.62)} ${r(y - h * 0.5)} ${r(x - w * 0.3)} ${r(y - h * 0.68)} Q${r(x)} ${r(y - h * 1.05)} ${r(x + w * 0.3)} ${r(y - h * 0.68)} Q${r(x + w * 0.62)} ${r(y - h * 0.5)} ${r(x + w / 2)} ${r(y)}Z" fill="${c}"/><circle cx="${r(x)}" cy="${r(y - h * 0.7)}" r="${r(w * 0.22)}" fill="#f2d6be"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const l = l0 + 0.6 + i * 1.1, x = X(d1, l), y0 = Y(d1, 2.5), s = F / d1;
    rg += `<path d="M${r(x)} ${r(y0)} V${r(y0 + 0.5 * s)}" stroke="#d9c9a8" stroke-width=".25"/>`;
    for (let j = 0; j < 4; j++) rg += `<circle cx="${r(x)}" cy="${r(y0 + (0.12 + j * 0.11) * s)}" r="${r(0.05 * s)}" fill="none" stroke="#c98a3e" stroke-width="${r(0.025 * s * 10) / 10}"/>`;
  }
  k += rg;
  /* rechte Seitenwand (zur Sonne) und die Front mit Theke */
  k += poly([P(d, l1, 0), P(d1, l1, 0), P(d1, l1, 2.7), P(d, l1, 2.7)], "#b97a46");
  let br = "";
  for (let h = 0.2; h < 2.7; h += 0.24) br += `M${P(d, l1, h)} L${P(d1, l1, h)}`;
  k += `<path d="${br}" stroke="#8a5530" stroke-width=".3" opacity=".7"/>`;
  k += poly([P(d, l0, 0), P(d, l1, 0), P(d, l1, theke), P(d, l0, theke)], "#8e5634");
  let vb = "";
  for (let l = l0 + 0.2; l < l1; l += 0.22) vb += `M${P(d, l, 0.05)} L${P(d, l, theke - 0.1)}`;
  k += `<path d="${vb}" stroke="#6e3f22" stroke-width=".35" opacity=".6"/>`;
  /* bemalte Zierleiste an der Theke (rot mit Blumen wie Chochloma) */
  k += poly([P(d, l0, 0.62), P(d, l1, 0.62), P(d, l1, 0.88), P(d, l0, 0.88)], "#b3241f");
  let bl = "";
  for (let l = l0 + 0.25; l < l1; l += 0.45) bl += `<circle cx="${r(X(d, l))}" cy="${r(Y(d, 0.75))}" r="1.4" fill="#e8b33a"/><circle cx="${r(X(d, l + 0.22))}" cy="${r(Y(d, 0.75))}" r=".7" fill="#1d1a16"/>`;
  k += bl;
  /* Thekenplatte */
  k += poly([P(d - 0.25, l0 - 0.1, theke), P(d - 0.25, l1 + 0.1, theke), P(d + 0.5, l1 + 0.1, theke + 0.05), P(d + 0.5, l0 - 0.1, theke + 0.05)], "#c99561");
  k += poly([P(d - 0.25, l0 - 0.1, theke - 0.06), P(d - 0.25, l1 + 0.1, theke - 0.06), P(d - 0.25, l1 + 0.1, theke), P(d - 0.25, l0 - 0.1, theke)], "#7a4826");
  /* Pfosten und Dach mit geschnitztem Giebelbrett, Schnee auf dem Dach */
  for (const l of [l0, l1]) k += poly([P(d, l, theke), P(d, l + (l === l0 ? 0.14 : -0.14), theke), P(d, l + (l === l0 ? 0.14 : -0.14), 2.7), P(d, l, 2.7)], "#7a4826");
  const m = (l0 + l1) / 2;
  k += poly([P(d - 0.3, l0 - 0.35, 2.6), P(d - 0.3, m, 3.55), P(d - 0.3, l1 + 0.35, 2.6), P(d - 0.3, l1 + 0.15, 2.5), P(d - 0.3, m, 3.32), P(d - 0.3, l0 - 0.15, 2.5)], "#b3241f");
  k += poly([P(d - 0.3, l0 - 0.15, 2.5), P(d - 0.3, m, 3.32), P(d - 0.3, l1 + 0.15, 2.5)], "#f0e2c4");
  k += poly([P(d - 0.3, m, 3.55), P(d1 + 0.3, m, 3.55), P(d1 + 0.3, l1 + 0.35, 2.6), P(d - 0.3, l1 + 0.35, 2.6)], "#c9b49a");
  k += poly([P(d - 0.3, m, 3.62), P(d1 + 0.3, m, 3.62), P(d1 + 0.3, l1 + 0.4, 2.62), P(d - 0.3, l1 + 0.4, 2.62)], SCHNEE);
  k += `<path d="M${P(d - 0.3, l0 - 0.4, 2.62)} L${P(d - 0.3, m, 3.62)} L${P(d - 0.3, l1 + 0.4, 2.62)}" stroke="${SCHNEE}" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  /* geschnitzte Zacken am Giebel */
  let za = "";
  for (let i = 1; i < 12; i++) { const t = i / 12, l = l0 + (l1 - l0) * t, h = 2.5 + (1 - Math.abs(t - 0.5) * 2) * 0.82; za += `M${P(d - 0.3, l - 0.06, h)} L${P(d - 0.3, l, h - 0.12)} L${P(d - 0.3, l + 0.06, h)}`; }

  /* Schild „ЧАЙ“ (Tee) und Lichterkette */
  const sx = X(d - 0.3, m), sy = Y(d - 0.3, 2.85);
  k += `<rect x="${r(sx - 11)}" y="${r(sy - 4.6)}" width="22" height="7" rx="1" fill="#f6ead0" stroke="#7a4826" stroke-width=".5"/><text x="${r(sx)}" y="${r(sy + 1)}" font-size="5.6" text-anchor="middle" fill="#b3241f" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".5">ЧАЙ</text>`;
  let lk = "";
  for (let i = 0; i <= 10; i++) { const t = i / 10, l = l0 + (l1 - l0) * t, h = 2.45 - Math.sin(Math.PI * t) * 0.12; lk += `<circle cx="${r(X(d - 0.32, l))}" cy="${r(Y(d - 0.32, h))}" r=".8" fill="#ffe08a"/>`; }
  k += `<path d="M${P(d - 0.32, l0, 2.45)} Q${P(d - 0.32, m, 2.2)} ${P(d - 0.32, l1, 2.45)}" stroke="#3a2a20" stroke-width=".25" fill="none"/>` + lk;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: 0, y: 0, kunst: k,
    tipp: "Im Winter gibt es auf dem Roten Platz einen Markt mit Holzbuden. „ЧАЙ“ spricht man „tschai“ – es heißt Tee." });
}

/* Schatten: Sonne im Südsüdwesten (Azimut 210°, 19° hoch), 60° rechts VOR dem Betrachter.
   Schatten fallen nach links zum Betrachter: je Meter Höhe 1,45 m näher und 2,5 m nach links. */
const SCH = { dd: -1.45, dl: -2.51 };
const schlag = (d, l, h, b, a = 0.56) => {
  /* am Fuß scharf und dunkel, zur Spitze hin heller und weicher */
  const fuss = [P(d + 0.12, l + b), P(d - 0.12, l - b)], mitte = [P(d + SCH.dd * h * 0.55 - 0.08, l + SCH.dl * h * 0.55 - b * 0.7), P(d + SCH.dd * h * 0.55 + 0.08, l + SCH.dl * h * 0.55 + b * 0.7)];
  const spitze = [P(d + SCH.dd * h - 0.06, l + SCH.dl * h - b * 0.4), P(d + SCH.dd * h + 0.06, l + SCH.dl * h + b * 0.4)];
  return poly([fuss[0], fuss[1], mitte[0], mitte[1]], "#141a3a", ` opacity="${a}" pointer-events="none"`) + poly([mitte[1], mitte[0], spitze[0], spitze[1]], "#141a3a", ` opacity="${r(a * 0.7 * 100) / 100}" filter="url(#${S.id("weichs")})" pointer-events="none"`);
};
const BODEN_SCHATTEN = [];   /* werden in den Roten Platz gezeichnet (Bodenfläche) */

/* =====================================================================
   10 — DIE VERKÄUFERIN (auf einem Podest hinter der Theke, Pawlowo-Possader Tuch)
   ===================================================================== */
{
  const d = 22.2, l = -5.3, x = r(X(d, l)), y = r(Y(d, 0.35));
  const m = B.mensch({ id: "msk_verk", geschlecht: "w", blick: 30, neigung: 3, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true, pose: "stehen",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e9e1cf" }, jacke: { stueck: "weste", farbe: "#6a2a2a" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel" } } }, r(1.64 * F / d));
  const theke = Y(STAND.d, STAND.theke) - y;
  const clip = S.id("verkclip");
  S.def(`<clipPath id="${clip}"><rect x="-40" y="-80" width="80" height="${r(80 + theke)}"/></clipPath>`);
  /* Pawlowo-Possader Kopftuch (selbst gezeichnet, Figur-Zentimeter): schwarzer Grund mit großen roten Rosen,
     umrahmt das Gesicht (Aussparung), unter dem Kinn geknotet, Zipfel fallen auf die Schultern */
  const kx = m.z.kopf.x, ky = m.z.kopf.y, fx = kx + 1.8;
  const TUCH = `M${r(kx - 11)} ${r(ky + 14)} Q${r(kx - 14)} ${r(ky - 4)} ${r(kx - 9)} ${r(ky - 13)} Q${r(kx)} ${r(ky - 20)} ${r(kx + 9)} ${r(ky - 13)} Q${r(kx + 14)} ${r(ky - 4)} ${r(kx + 11.5)} ${r(ky + 14)} L${r(kx + 18)} ${r(ky + 26)} L${r(kx + 3)} ${r(ky + 20)} L${r(kx - 16)} ${r(ky + 27)} Z`;
  const GESICHT = `M${r(fx - 6.6)} ${r(ky + 1)} a6.6 9.4 0 1 0 13.2 0 a6.6 9.4 0 1 0 -13.2 0Z`;
  S.def(`<clipPath id="${S.id("tuchclip")}"><path d="${TUCH} ${GESICHT}" clip-rule="evenodd"/></clipPath>`);
  let tuch = `<path d="${TUCH} ${GESICHT}" fill="#1f1b1e" fill-rule="evenodd"/>`;
  let rosen = "";
  for (const [dx, dy, rr] of [[-8, -8, 3.4], [6, -12, 3], [-10, 6, 2.8], [10, 4, 2.6], [-6, 20, 3.2], [9, 20, 2.8], [0, -16, 2]]) {
    rosen += `<path d="M${r(kx + dx - rr * 1.6)} ${r(ky + dy + rr * 0.3)} q${r(rr * 0.6)} ${r(-rr * 0.9)} ${r(rr * 0.9)} 0 M${r(kx + dx + rr * 0.8)} ${r(ky + dy - rr * 0.9)} q${r(rr * 0.9)} ${r(-rr * 0.2)} ${r(rr * 0.9)} ${r(rr * 0.6)}" stroke="#2f7a3e" stroke-width="${r(rr * 0.5)}" fill="none" stroke-linecap="round"/>`;
    rosen += `<circle cx="${r(kx + dx)}" cy="${r(ky + dy)}" r="${rr}" fill="#c4232c"/><circle cx="${r(kx + dx - rr * 0.2)}" cy="${r(ky + dy - rr * 0.2)}" r="${r(rr * 0.55)}" fill="#e8454a"/><path d="M${r(kx + dx - rr * 0.4)} ${r(ky + dy)} q${r(rr * 0.4)} ${r(-rr * 0.5)} ${r(rr * 0.7)} 0" stroke="#8a1018" stroke-width=".5" fill="none"/>`;
  }
  tuch += `<g clip-path="url(#${S.id("tuchclip")})"><path d="${GESICHT}" fill="none"/>${rosen}</g><path d="${GESICHT}" fill="none" stroke="#1f1b1e" stroke-width="1.2"/>`;
  tuch += `<path d="M${r(kx - 1)} ${r(ky + 13)} q2 2.5 4 0 q-2 -1.5 -4 0Z" fill="#c4232c"/><path d="M${r(kx - 16)} ${r(ky + 27)} L${r(kx + 3)} ${r(ky + 20)} L${r(kx + 18)} ${r(ky + 26)}" stroke="#c4232c" stroke-width="1.1" stroke-dasharray="1 .8" fill="none"/>`;
  /* das Podest hinter der Theke sieht man nicht; die Figur steht 35 cm höher */
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la venditrice", itSyl: "ven-di-TRI-ce", en: "saleswoman", x, y,
    kunst: `<g clip-path="url(#${clip})"><g transform="scale(${m.k.toFixed(4)})" filter="url(#${S.id("kante")})">${kompaktFein(m, abschneiden(m.svg, theke / m.k + 4)).replace(/^<g transform="scale\([^)]*\)">/, "<g>")}${tuch}</g></g>`,
    zoom: { x: x - 21, y: y - 52, w: 42, h: 28 },
    unter: [{ id: "kopftuch", de: "das Kopftuch", syl: "KOPF-tuch", it: "il foulard", itSyl: "fu-LAR", en: "headscarf", x: r(x + kx * m.k), y: r(y + ky * m.k),
      kunst: flaecheEllipse(0, 0, 5, 6), tipp: "Schwarze Tücher mit großen roten Rosen kommen aus der Stadt Pawlowski Possad." }] });
}

/* =====================================================================
   11 — DER KUNDE mit Uschanka (Pelzmütze mit Ohrenklappen) und Teeglas vor der Brust
   ===================================================================== */
let KUNDE_HAND = null;
{
  const d = 19, l = -2.45, x = r(X(d, l)), y = r(Y(d));
  BODEN_SCHATTEN.push(schlag(d, l, 1.8, 0.28));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 4, kopf: -4, schulterL: { vor: 4, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.4,
    schulterR: { vor: 22, seit: 6, dreh: 30 }, ellbogenR: 112, unterarmR: 40, handR: 0, fingerR: 0.72,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -6 }, knieR: 6, fussR: 2 };
  const m = B.mensch({ id: "msk_kunde", geschlecht: "m", blick: -50, neigung: 3, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true, pose,
    kleidung: { jacke: { stueck: "jacke", farbe: "#2e3a4c" }, unterteil: { stueck: "hose", farbe: "#3a3a40" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "schal", farbe: "#c8402c" } } }, r(1.8 * F / d));
  /* Uschanka (Figur-Zentimeter): runde Fellkrone, vorn hochgeklappter Schirm, seitlich herabhängende Ohrenklappen */
  const hx = m.z.kopf.x, hy = m.z.kopf.y - 2.5;
  const FELL = S.lg("fell", [[0, "#2e2018"], [0.55, "#5e412c"], [1, "#8a6444"]], 0, 0, 1, 0);
  let hut = `<path d="M${r(hx - 12.5)} ${r(hy - 3)} L${r(hx - 13)} ${r(hy + 9)} Q${r(hx - 10.5)} ${r(hy + 11)} ${r(hx - 8.5)} ${r(hy + 8)} L${r(hx - 8.5)} ${r(hy - 3)} Z" fill="#4a3424"/>`;
  hut += `<path d="M${r(hx + 8.5)} ${r(hy - 3)} L${r(hx + 8.5)} ${r(hy + 7)} Q${r(hx + 10.5)} ${r(hy + 10)} ${r(hx + 12.6)} ${r(hy + 8)} L${r(hx + 12.4)} ${r(hy - 3)} Z" fill="#6a4a32"/>`;
  hut += `<path d="M${r(hx - 12)} ${r(hy - 6)} Q${r(hx - 12)} ${r(hy - 21)} ${r(hx)} ${r(hy - 21.5)} Q${r(hx + 12)} ${r(hy - 21)} ${r(hx + 12)} ${r(hy - 6)} Z" fill="${FELL}"/>`;
  hut += `<path d="M${r(hx - 12.8)} ${r(hy - 4)} Q${r(hx)} ${r(hy - 8)} ${r(hx + 12.8)} ${r(hy - 4)} L${r(hx + 12.4)} ${r(hy - 10.5)} Q${r(hx)} ${r(hy - 14.5)} ${r(hx - 12.4)} ${r(hy - 10.5)} Z" fill="#7a5638"/>`;
  hut += `<path d="M${r(hx - 11)} ${r(hy - 10)} Q${r(hx)} ${r(hy - 13.6)} ${r(hx + 11)} ${r(hy - 10)}" stroke="#a78058" stroke-width="1" fill="none" opacity=".7"/>`;
  hut += `<path d="M${r(hx - 8)} ${r(hy - 17)} Q${r(hx + 2)} ${r(hy - 21)} ${r(hx + 10)} ${r(hy - 13)}" stroke="#b08a60" stroke-width="1.4" opacity=".55" fill="none"/>`;
  KUNDE_HAND = { x: x + m.z.handR.x * m.k, y: y + m.z.handR.y * m.k };
  const hutP = { x: r(x + hx * m.k), y: r(y + (hy - 9) * m.k) };
  S.teil({ id: "kunde", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x, y,
    kunst: `<g transform="scale(${m.k.toFixed(4)})" filter="url(#${S.id("kante")})">${kompaktFein(m).replace(/^<g transform="scale\([^)]*\)">/, "<g>")}${hut}</g>`,
    zoom: { x: x - 21, y: y - 56, w: 42, h: 28 },
    unter: [{ id: "pelzmuetze", de: "die Pelzmütze", syl: "PELZ-müt-ze", it: "il colbacco", itSyl: "col-BAC-co", en: "fur hat", x: hutP.x, y: hutP.y,
      kunst: flaecheEllipse(0, 0, 4.8, 4.4), tipp: "Die Pelzmütze heißt auf Russisch „Uschanka“. Die Klappen wärmen die Ohren." }] });
}

/* =====================================================================
   12 — AUF DEM VORDEREN THEKENBRETT: Samowar, Pelmeni, Matrjoschka, Lebkuchen
   (groß genug zum Antippen, mindestens 17 Einheiten auseinander, nicht vor der Verkäuferin)
   ===================================================================== */
const TD = STAND.d - 0.15, TS = F / TD, TY = r(Y(TD, STAND.theke + 0.03));
const TX = (x) => ({ l: (x - 200) * TD / F, x });
{
  const x = 26, MS = S.lg("messing", [[0, "#6b4a18"], [0.35, "#c9963c"], [0.6, "#ffe6a0"], [0.75, "#d9a446"], [1, "#7a5418"]], 0, 0, 1, 0);
  /* Samowar als Urne: schmaler Fuß auf vier Füßchen, bauchiger Körper, zwei geschwungene Henkel, Hahn mit Tropfschale,
     oben Krone mit Schornstein und aufgesetzter bemalter Teekanne (das Erkennungszeichen) */
  let k = `<g transform="scale(${(TS * 1.6).toFixed(4)})">`;
  k += `<path d="M-.1 0 l.02 -.03 h.16 l.02 .03 M-.07 -.03 l.02 -.05 h.1 l.02 .05 Z" fill="#7a5418" stroke="#7a5418" stroke-width=".012"/>`;
  k += `<path d="M-.04 -.08 Q-.17 -.1 -.17 -.22 Q-.17 -.32 -.08 -.36 L.08 -.36 Q.17 -.32 .17 -.22 Q.17 -.1 .04 -.08 Z" fill="${MS}"/>`;
  k += `<path d="M-.15 -.2 Q0 -.17 .15 -.2 M-.12 -.31 Q0 -.29 .12 -.31" stroke="#8a6020" stroke-width=".007" fill="none"/>`;
  k += `<path d="M-.17 -.28 q-.07 .0 -.07 .05 q0 .05 .05 .06 M.17 -.28 q.07 0 .07 .05 q0 .05 -.05 .06" stroke="#4a3418" stroke-width=".016" fill="none"/>`;
  k += `<path d="M.02 -.13 h.08 v.02 h-.03 v.03" stroke="#a37428" stroke-width=".014" fill="none"/><ellipse cx=".07" cy="-.06" rx=".035" ry=".008" fill="#a37428"/>`;
  k += `<path d="M-.07 -.36 L-.05 -.4 H.05 L.07 -.36 Z" fill="#7a5418"/><rect x="-.015" y="-.47" width=".03" height=".07" fill="#6b4a18"/>`;
  k += `<path d="M-.07 -.41 Q-.09 -.48 -.04 -.5 Q0 -.52 .04 -.5 Q.09 -.48 .07 -.41 Z" fill="#f4f1ea"/><path d="M.07 -.45 q.04 0 .05 -.03" stroke="#f4f1ea" stroke-width=".012" fill="none"/><path d="M-.07 -.45 q-.03 .02 -.03 .04" stroke="#f4f1ea" stroke-width=".01" fill="none"/>`;
  k += `<path d="M-.04 -.47 q.04 -.02 .08 0" stroke="#2f5fa0" stroke-width=".012" fill="none"/><circle cx="0" cy="-.445" r=".012" fill="#c8302c"/><path d="M-.02 -.51 h.04 l-.01 -.015 h-.02 Z" fill="#f4f1ea"/>`;
  k += `<path d="M.09 -.34 Q.15 -.24 .12 -.12" stroke="#fffbe8" stroke-width=".02" opacity=".75" fill="none"/>`;
  k += `<path d="M0 -.53 q-.03 -.05 0 -.1 q.03 -.05 0 -.1" stroke="#fff" stroke-width=".01" opacity=".6" fill="none"/></g>`;
  S.teil({ oben: true, id: "samowar", de: "der Samowar", syl: "sa-mo-WAR", it: "il samovar", itSyl: "sa-mo-VAR", en: "samovar", x, y: TY, steht: true, kunst: k + flaeche(-7, -18, 14, 18.5, 0.6),
    tipp: "Im Samowar wird Wasser für den Tee heiß gemacht." });
}
{
  /* Pelmeni: Teller mit Teigtaschen und einem Klecks Schmand */
  const x = 42.5;
  let k = `<g transform="scale(${(TS * 1.9).toFixed(4)})">`;
  k += `<ellipse cx="0" cy="-.012" rx=".13" ry=".03" fill="#f4f2ec" stroke="#2f5fa0" stroke-width=".008"/><ellipse cx="0" cy="-.018" rx=".09" ry=".018" fill="#e6e3dc"/>`;
  for (const [dx, dy] of [[-0.06, -0.03], [0, -0.034], [0.06, -0.028], [-0.03, -0.05], [0.035, -0.052], [0, -0.068]]) k += `<path d="M${dx - 0.032} ${dy} q.032 -.03 .064 0 q-.032 .014 -.064 0Z" fill="#f7ecd4" stroke="#c9b48a" stroke-width=".005"/>`;
  k += `<ellipse cx=".01" cy="-.076" rx=".026" ry=".013" fill="#fffdf6"/><path d="M-.05 -.062 l.006 -.012 M.05 -.06 l.008 -.01" stroke="#5a8a3a" stroke-width=".008"/>`;
  k += `<path d="M.03 -.09 q-.01 -.03 0 -.06 q.01 -.03 0 -.06" stroke="#fff" stroke-width=".006" opacity=".6" fill="none"/></g>`;
  S.teil({ oben: true, id: "pelmeni", de: "die Pelmeni", syl: "pel-ME-ni", it: "i pelmeni", itSyl: "pel-ME-ni", en: "pelmeni", x, y: TY, steht: true, kunst: k + flaeche(-7.5, -12, 15, 12.5, 0.6),
    tipp: "Pelmeni (das Wort steht in der Mehrzahl) sind kleine Teigtaschen mit Fleisch. Man isst sie mit Schmand." });
}
{
  /* Matrjoschka: große Puppe, daneben zwei kleinere — rechts von der Verkäuferin */
  const x = 81;
  let k = `<g transform="scale(${(TS * 1.7).toFixed(4)})">`;
  const q = (v) => Math.round(v * 1000) / 1000;
  const puppe = (dx, h, rock) => {
    const w = h * 0.52;
    let g = `<path d="M${q(dx - w / 2)} 0 Q${q(dx - w * 0.62)} ${q(-h * 0.5)} ${q(dx - w * 0.3)} ${q(-h * 0.7)} Q${dx} ${q(-h * 1.08)} ${q(dx + w * 0.3)} ${q(-h * 0.7)} Q${q(dx + w * 0.62)} ${q(-h * 0.5)} ${q(dx + w / 2)} 0 Z" fill="${rock}"/>`;
    g += `<ellipse cx="${dx}" cy="${q(-h * 0.72)}" rx="${q(w * 0.25)}" ry="${q(h * 0.15)}" fill="#f5dcc6"/>`;
    g += `<path d="M${q(dx - w * 0.22)} ${q(-h * 0.8)} Q${dx} ${q(-h * 0.92)} ${q(dx + w * 0.22)} ${q(-h * 0.8)}" stroke="#4a2a1a" stroke-width="${q(h * 0.04)}" fill="none"/>`;
    g += `<ellipse cx="${dx}" cy="${q(-h * 0.36)}" rx="${q(w * 0.3)}" ry="${q(h * 0.2)}" fill="#f8f0de"/>`;
    g += `<circle cx="${dx}" cy="${q(-h * 0.38)}" r="${q(h * 0.08)}" fill="#d9302c"/><circle cx="${q(dx - w * 0.12)}" cy="${q(-h * 0.3)}" r="${q(h * 0.05)}" fill="#e9b23a"/><circle cx="${q(dx + w * 0.12)}" cy="${q(-h * 0.3)}" r="${q(h * 0.05)}" fill="#2f7a3e"/>`;
    g += `<circle cx="${q(dx - w * 0.08)}" cy="${q(-h * 0.7)}" r="${q(h * 0.02)}" fill="#c84a4a"/><circle cx="${q(dx + w * 0.08)}" cy="${q(-h * 0.7)}" r="${q(h * 0.02)}" fill="#c84a4a"/>`;
    g += `<path d="M${q(dx + w * 0.1)} ${q(-h * 0.95)} Q${q(dx + w * 0.42)} ${q(-h * 0.7)} ${q(dx + w * 0.4)} ${q(-h * 0.2)}" stroke="#fff" stroke-width="${q(h * 0.035)}" opacity=".45" fill="none"/>`;
    return g;
  };
  k += puppe(0.15, 0.1, "#2f5fa0") + puppe(0.08, 0.15, "#e0a23a") + puppe(-0.04, 0.24, "#c8302c") + `</g>`;
  S.teil({ oben: true, id: "matrjoschka", de: "die Matrjoschka", syl: "ma-TRJOSCH-ka", it: "la matrioska", itSyl: "ma-tri-O-ska", en: "nesting doll", x, y: TY, steht: true, kunst: k + flaeche(-6.5, -13, 14, 13.5, 0.6),
    tipp: "In einer Matrjoschka steckt eine kleinere Puppe, darin noch eine." });
}
{
  /* Tulaer Lebkuchen (Prjanik): großer flacher Rechteck-Lebkuchen mit Zuckerschrift, angelehnt */
  const x = 97;
  let k = `<g transform="scale(${(TS * 1.8).toFixed(4)})">`;
  k += `<path d="M-.09 0 L-.07 -.17 L.08 -.16 L.09 0 Z" fill="${S.lg("prjanik", [[0, "#8a4e20"], [0.5, "#b8763a"], [1, "#8a4e20"]], 0, 0, 1, 0)}"/><path d="M-.07 -.17 L.08 -.16 L.085 -.14 L-.068 -.152 Z" fill="#c98a4a"/>`;
  k += `<path d="M-.06 -.012 L-.05 -.15 L.07 -.142 L.076 -.012 Z" fill="none" stroke="#f6e8cc" stroke-width=".007" stroke-dasharray=".012 .008"/>`;
  k += `<path d="M-.03 -.04 Q.01 -.12 .05 -.04 M-.025 -.09 h.06 M.01 -.135 v.03" stroke="#f6e8cc" stroke-width=".009" fill="none"/>`;
  k += `<circle cx=".012" cy="-.07" r=".016" fill="none" stroke="#f6e8cc" stroke-width=".007"/></g>`;
  S.teil({ oben: true, id: "lebkuchen", de: "der Lebkuchen", syl: "LEB-ku-chen", it: "il pan di zenzero", itSyl: "PAN di ZEN-ze-ro", en: "gingerbread", x, y: TY, steht: true, kunst: k + flaeche(-6, -12, 12, 12.5, 0.6),
    tipp: "Der russische Lebkuchen heißt Prjanik. Er kommt oft aus der Stadt Tula." });
}
{
  /* Teeglas im silbernen Halter (Podstakannik), vor der Brust des Kunden */
  const x = r(KUNDE_HAND.x), y = r(KUNDE_HAND.y + 2.2), s = F / 19 * 1.25;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M-.036 -.13 L-.033 -.06 H.033 L.036 -.13 Z" fill="#8a3412" opacity=".9"/><path d="M-.036 -.13 H.036 L.035 -.12 H-.035 Z" fill="#e9eef2" opacity=".85"/><path d="M-.028 -.125 L-.026 -.07" stroke="#fff" stroke-width=".006" opacity=".6"/>`;
  k += `<path d="M-.034 -.075 L-.03 0 H.03 L.034 -.075 Z" fill="${S.lg("silber", [[0, "#7c8088"], [0.4, "#e8ebef"], [1, "#8a8e96"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-.03 -.05 l.01 .015 l.01 -.015 l.01 .015 l.01 -.015 l.01 .015 l.01 -.015" stroke="#5a5e66" stroke-width=".004" fill="none"/><path d="M-.034 -.004 H.034" stroke="#5a5e66" stroke-width=".006"/>`;
  k += `<path d="M.034 -.07 q.03 0 .03 .028 q0 .028 -.032 .028" stroke="#9a9ea6" stroke-width=".009" fill="none"/>`;
  k += `<path d="M0 -.14 q-.012 -.03 0 -.06 q.012 -.03 0 -.06" stroke="#fff" stroke-width=".007" opacity=".7" fill="none"/></g>`;
  S.teil({ oben: true, id: "teeglas", de: "das Teeglas", syl: "TEE-glas", it: "il bicchiere da tè", itSyl: "bic-CHIE-re da TÈ", en: "tea glass", x, y, steht: true, kunst: k + flaeche(-6, -12, 12, 12.5, 0.5),
    tipp: "In Russland trinkt man Tee oft aus einem Glas mit Metallhalter." });
}

/* =====================================================================
   13 — DIE MUTTER zieht DEN SCHLITTEN mit dem Kind (Vordergrund)
   ===================================================================== */
{
  /* Holzschlitten (1 m) mit Kind im Schneeanzug, die Mutter geht nach rechts und zieht an der Schnur */
  const sd = 12.6, sl = -2.1, sx = r(X(sd, sl)), sy = r(Y(sd)), ss = F / sd;
  BODEN_SCHATTEN.push(schlag(sd, sl, 0.75, 0.5, 0.3));
  let k = `<g transform="scale(${ss.toFixed(4)})">`;
  /* Kufen, Holme, Lattensitz */
  k += `<path d="M-.55 0 H.42 Q.62 0 .62 -.16" stroke="#7a5030" stroke-width=".05" fill="none" stroke-linecap="round"/><path d="M-.5 0 v-.2 M-.15 0 v-.2 M.2 0 v-.2" stroke="#8a5e38" stroke-width=".05"/>`;
  k += `<path d="M-.56 -.2 H.42 L.44 -.27 H-.56 Z" fill="${S.lg("schlholz", [[0, "#c58a52"], [1, "#9a6438"]])}"/><path d="M-.3 -.27 v.07 M0 -.27 v.07 M.25 -.27 v.07" stroke="#7a5030" stroke-width=".015"/>`;
  k += `</g>`;
  /* Kleinkind im blauen Schneeanzug, rote Bommelmütze, Schal, Fäustlinge — sitzt, Beine nach vorn */
  k += `<g transform="scale(${ss.toFixed(4)})">`;
  const SA = S.lg("anzug", [[0, "#5aa0d6"], [0.55, "#2f7fb3"], [1, "#1f5a85"]], 0, 0, 1, 0);
  /* Beine in der Schneehose nach vorn, Knie leicht hoch, Stiefel an der Schlittenspitze */
  k += `<path d="M-.3 -.27 Q-.32 -.4 -.18 -.43 Q.02 -.46 .14 -.42 Q.22 -.38 .3 -.36 L.32 -.28 Q.1 -.3 -.05 -.27 Z" fill="${SA}"/>`;
  k += `<path d="M.04 -.44 Q.12 -.42 .2 -.38" stroke="#7fbfe9" stroke-width=".02" fill="none"/>`;
  k += `<path d="M.27 -.39 Q.37 -.41 .4 -.33 Q.41 -.27 .3 -.27 Z" fill="#3a2a24"/><path d="M.3 -.38 q.05 -.01 .08 .02" stroke="#6a5444" stroke-width=".012" fill="none"/>`;
  /* Oberkörper aufrecht, gepolstert */
  k += `<path d="M-.36 -.28 Q-.42 -.55 -.32 -.72 Q-.2 -.8 -.06 -.75 Q.04 -.62 .02 -.42 Q-.1 -.3 -.36 -.28 Z" fill="${SA}"/>`;
  k += `<path d="M-.31 -.7 Q-.2 -.75 -.08 -.72" stroke="#7fbfe9" stroke-width=".03" fill="none"/><path d="M-.18 -.7 V-.4" stroke="#1f5a85" stroke-width=".015"/>`;
  /* Arm nach unten, Fäustling hält den Seitenholm */
  k += `<path d="M-.08 -.66 Q-.02 -.5 0 -.34" stroke="#2f7fb3" stroke-width=".085" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-.3" rx=".05" ry=".04" fill="#c8302c"/>`;
  /* Schal */
  k += `<path d="M-.32 -.73 Q-.2 -.8 -.05 -.76 L-.06 -.69 Q-.18 -.73 -.31 -.67 Z" fill="#f2f0ea"/><path d="M-.1 -.71 L-.06 -.56 L-.01 -.6 Z" fill="#f2f0ea"/>`;
  /* Kopf im Dreiviertelprofil nach rechts: Wange, zwei Augen, Nase, lachender Mund */
  k += `<ellipse cx="-.13" cy="-.88" rx=".13" ry=".135" fill="#f3d2b8"/><ellipse cx="-.1" cy="-.875" rx=".1" ry=".11" fill="#f6dcc6"/>`;
  k += `<circle cx="-.03" cy="-.84" r=".032" fill="#f19a9a" opacity=".75"/><circle cx="-.08" cy="-.9" r=".016" fill="#2a1d14"/><circle cx="-.02" cy="-.9" r=".014" fill="#2a1d14"/>`;
  k += `<path d="M-.07 -.93 q.02 -.012 .04 0 M-.02 -.93 q.015 -.01 .03 0" stroke="#6a4a30" stroke-width=".008" fill="none"/><path d="M.005 -.88 q.02 .015 .0 .03" stroke="#d29a80" stroke-width=".01" fill="none"/>`;
  k += `<path d="M-.07 -.83 q.03 .025 .06 0" stroke="#a0524a" stroke-width=".012" fill="none"/>`;
  /* Bommelmütze mit Umschlag */
  k += `<path d="M-.28 -.9 Q-.29 -1.06 -.14 -1.07 Q.0 -1.06 .0 -.92 Z" fill="#c8302c"/><path d="M-.29 -.93 Q-.14 -.96 .01 -.92 v.045 Q-.14 -.92 -.29 -.885 Z" fill="#f2f0ea"/><circle cx="-.15" cy="-1.1" r=".055" fill="#f2f0ea"/>`;
  k += `<path d="M-.56 -.2 H.42" stroke="#e8c48c" stroke-width=".012"/></g>`;
  /* die Schnur zur Hand der Mutter */
  const md = 12, ml = 0.25, mx = r(X(md, ml)), my = r(Y(md)), ms = F / md;
  BODEN_SCHATTEN.push(schlag(md, ml, 1.68, 0.26));
  const pose = Object.assign({}, { kipp: 4, lende: 2, brust: 0, nacken: 4, kopf: -6,
    schulterL: { vor: -28, seit: 14, dreh: 0 }, ellbogenL: 12, unterarmL: 10, handL: 0, fingerL: 0.75,
    schulterR: { vor: 18, seit: 8, dreh: 0 }, ellbogenR: 20, unterarmR: 10, handR: 6, fingerR: 0.4,
    huefteL: { vor: 18, seit: 3, dreh: 0 }, knieL: 10, fussL: 2, huefteR: { vor: -14, seit: 3, dreh: 0 }, knieR: 18, fussR: 6 });
  const mu = B.mensch({ id: "msk_mutter", geschlecht: "w", blick: 70, neigung: 5, frisur: "lang", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true, pose,
    kleidung: { jacke: { stueck: "mantel", farbe: "#6b4a7a" }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "muetze", farbe: "#8a1f2a" }, zubehoer: { stueck: "schal", farbe: "#e9c35a" } } }, r(1.7 * ms));
  const hand = { x: mx + mu.z.handL.x * mu.k, y: my + mu.z.handL.y * mu.k };
  k += `<path d="M${r(0.6 * ss)} ${r(-0.12 * ss)} Q${r((hand.x - sx) * 0.5 + 0.3 * ss)} ${r((hand.y - sy) * 0.4 + 2)} ${r(hand.x - sx)} ${r(hand.y - sy)}" stroke="#d9cfb8" stroke-width=".35" fill="none"/>`;
  S.teil({ id: "schlitten", de: "der Schlitten", syl: "SCHLIT-ten", it: "la slitta", itSyl: "SLIT-ta", en: "sledge", x: sx, y: sy, kunst: k + flaeche(-0.6 * ss, -1 * ss, 1.25 * ss, 1.05 * ss, 0.8),
    tipp: "Im Winter ziehen Eltern kleine Kinder auf dem Schlitten durch die Stadt." });
  S.teil({ id: "mutter", de: "die Mutter", syl: "MUT-ter", it: "la madre", itSyl: "MA-dre", en: "mother", x: mx, y: my, kunst: `<g filter="url(#${S.id("kante")})">${kompaktFein(mu)}</g>`,
    tipp: "Im russischen Winter tragen Kinder dicke Schneeanzüge." });
}

/* =====================================================================
   14 — DIE TOURISTIN mit der Spiegelreflexkamera (fotografiert die Kathedrale)
   ===================================================================== */
{
  const d = 13.2, l = 1.55, x = r(X(d, l)), y = r(Y(d));
  BODEN_SCHATTEN.push(schlag(d, l, 1.66, 0.26));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 2, kopf: 0, schulterL: { vor: 70, seit: 0, dreh: -30 }, ellbogenL: 120, unterarmL: 40, handL: 0, fingerL: 0.6,
    schulterR: { vor: 70, seit: 0, dreh: -30 }, ellbogenR: 120, unterarmR: 40, handR: 0, fingerR: 0.6, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0 };
  const m = B.mensch({ id: "msk_tour", geschlecht: "w", blick: -140, neigung: 3, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", pose,
    kleidung: { jacke: { stueck: "jacke", farbe: "#c0473a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "muetze", farbe: "#efe8dc" }, zubehoer: { stueck: "schal", farbe: "#2f5f95" } } }, r(1.66 * F / d));
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: `<g filter="url(#${S.id("kante")})">${kompaktFein(m, m.svg, 1)}</g>`,
    tipp: "Viele Touristen fotografieren die bunten Kuppeln." });
  const hx = x + (m.z.handL.x + m.z.handR.x) / 2 * m.k, hy = y + (m.z.handL.y + m.z.handR.y) / 2 * m.k;
  let k = `<rect x="-3.4" y="-2.2" width="6.8" height="4.4" rx=".8" fill="#22252b"/><path d="M-1.6 -2.2 l.5 -1.1 h2.2 l.5 1.1 Z" fill="#2c3036"/><rect x="-3.4" y="-2.2" width="6.8" height=".8" rx=".4" fill="#4a4f58"/>`;
  k += `<circle cx=".3" cy=".3" r="1.8" fill="#3a3f48"/><circle cx=".3" cy=".3" r="1.15" fill="#14202c"/><circle cx=".7" cy="-.1" r=".35" fill="#9fc0ff"/><rect x="-3" y="-1.2" width="1.1" height="2.8" rx=".3" fill="#33373e"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la macchina fotografica", itSyl: "MAC-chi-na fo-to-GRA-fi-ca", en: "camera", x: r(hx), y: r(hy), kunst: k + flaeche(-6, -4.2, 9, 7, 0.6), tipp: "Mit der Kamera macht man Fotos." });
}

/* =====================================================================
   15 — DIE KRÄHEN (Nebelkrähen) streiten um einen heruntergefallenen Kringel
   ===================================================================== */
{
  /* Nebelkrähe (Meter, 46 cm lang): kräftiger aschgrauer Rumpf, schwarzer Kopf mit schwarzem Kehllatz bis zur Brust,
     schwarze Flügel und Schwanz, dicker langer Schnabel, kräftige schwarze Beine. Licht von rechts vorn. */
  const KR = S.lg("kraehe", [[0, "#5f626a"], [0.6, "#80838b"], [1, "#9a9da4"]], 0, 0, 1, 0);
  const kraehe = (d, l, sp, pick) => {
    const x = X(d, l), y = Y(d), s = F / d;
    BODEN_SCHATTEN.push(schlag(d, l, 0.32, 0.14, 0.5));
    let k = `<g transform="translate(${r(x)} ${r(y)}) scale(${(s * sp).toFixed(4)} ${s.toFixed(4)})">`;
    k += `<path d="M-.03 -.12 L-.05 0 M.05 -.12 L.04 0" stroke="#17171b" stroke-width=".025"/><path d="M-.1 0 h.1 M-.01 0 h.1" stroke="#17171b" stroke-width=".018"/>`;
    k += `<path d="M-.3 -.2 L-.13 -.17 Q-.06 -.08 .07 -.11 Q.15 -.14 .16 -.24 Q.13 -.3 .02 -.3 Q-.1 -.3 -.16 -.24 Z" fill="${KR}"/>`;
    k += `<path d="M-.31 -.22 L-.12 -.18 L-.02 -.24 Q-.12 -.28 -.2 -.26 Z" fill="#17171b"/><path d="M-.14 -.26 Q-.02 -.31 .1 -.28 Q.04 -.2 -.08 -.18 Z" fill="#202024"/>`;
    k += `<path d="M.08 -.27 Q.14 -.22 .17 -.17 Q.2 -.24 .19 -.3 Z" fill="#17171b"/>`;
    const ky = pick ? -0.2 : -0.31, kxx = pick ? 0.2 : 0.17;
    k += `<circle cx="${kxx}" cy="${ky}" r=".055" fill="#17171b"/><path d="M${r((kxx + 0.04) * 100) / 100} ${r((ky - 0.02) * 100) / 100} L${r((kxx + 0.15) * 100) / 100} ${r((ky + (pick ? 0.06 : 0.01)) * 100) / 100} L${r((kxx + 0.04) * 100) / 100} ${r((ky + 0.025) * 100) / 100} Z" fill="#17171b"/>`;
    k += `<circle cx="${r((kxx + 0.015) * 1000) / 1000}" cy="${r((ky - 0.012) * 1000) / 1000}" r=".008" fill="#8a7a6a"/><path d="M.0 -.29 Q.08 -.29 .14 -.25" stroke="#c9ccd3" stroke-width=".012" fill="none" opacity=".6"/></g>`;
    return k;
  };
  const d0 = 11.5, l0 = -0.75, x0 = r(X(d0, l0)), y0 = r(Y(d0));
  let k = kraehe(11.4, -1.05, 1, true) + kraehe(11.7, -0.45, -1, false);
  /* Kringel (Baranka) auf dem Pflaster */
  const bx = X(11.5, -0.78), by = Y(11.5), bs = F / 11.5;
  k += `<ellipse cx="${r(bx)}" cy="${r(by - 0.3)}" rx="${r(0.07 * bs)}" ry="${r(0.03 * bs)}" fill="none" stroke="#c98a3e" stroke-width="${r(0.03 * bs)}"/><ellipse cx="${r(bx - 0.4)}" cy="${r(by - 0.5)}" rx="${r(0.04 * bs)}" ry=".3" fill="#f2c27a" opacity=".6"/>`;
  S.teil({ oben: true, id: "kraehe", de: "die Krähe", syl: "KRÄ-he", it: "la cornacchia", itSyl: "cor-NAC-chia", en: "crow", x: 0, y: 0, steht: true, kunst: k + flaeche(x0 - 13, y0 - 12, 26, 13, 0.6),
    tipp: "In Moskau leben viele graue Nebelkrähen. Hier streiten zwei um einen Kringel." });
}

/* =====================================================================
   16 — DER SCHNEEHAUFEN rechts vorn (geräumt, Schaufelspuren) — Kulisse am Boden
   ===================================================================== */
{
  /* weicher Hügel in Bildkoordinaten (rechts unten), Sonne rechts vorn: rechte Seite hell, links kühl blau */
  const cx = 364, cy = 254;
  let g = `<path d="M${cx - 34} ${cy + 4} Q${cx - 30} ${cy - 6} ${cx - 18} ${cy - 9} Q${cx - 10} ${cy - 17} ${cx} ${cy - 15} Q${cx + 9} ${cy - 21} ${cx + 18} ${cy - 15} Q${cx + 28} ${cy - 13} ${cx + 32} ${cy - 4} L${cx + 34} ${cy + 8} L${cx - 36} ${cy + 8} Z" fill="${S.lg("haufen", [[0, "#8297bb"], [0.4, "#c9d6ea"], [0.72, "#ffffff"], [1, "#fff3e2"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${cx - 16} ${cy - 8} Q${cx - 6} ${cy - 12} ${cx + 4} ${cy - 10} M${cx - 12} ${cy - 3} Q${cx} ${cy - 7} ${cx + 12} ${cy - 5} M${cx + 6} ${cy - 16} Q${cx + 14} ${cy - 15} ${cx + 22} ${cy - 10}" stroke="#a9b9d4" stroke-width=".7" fill="none" opacity=".75"/>`;
  g += `<path d="M${cx - 34} ${cy + 4} Q${cx - 20} ${cy + 1} ${cx} ${cy + 2} Q${cx + 20} ${cy + 1} ${cx + 34} ${cy + 6}" stroke="#8a9ab8" stroke-width="1.6" fill="none" opacity=".5"/>`;
  g += `<path d="M${cx + 2} ${cy - 15.5} Q${cx + 10} ${cy - 20} ${cx + 17} ${cy - 15.5}" stroke="#fff" stroke-width="1" fill="none"/>`;
  BODEN_SCHATTEN.push(g);
}
/* =====================================================================
   DAVOR — Leben auf dem Platz: Spaziergänger in der Ferne (keine Tippfläche)
   ===================================================================== */
{
  S.def(`<g id="${S.id("mn")}"><path d="M-.13 0 V-.82 h.12 V0 Z M.02 0 V-.82 h.12 V0 Z" fill="#2c2b33"/><path d="M-.24 -.78 L-.22 -1.45 Q0 -1.55 .22 -1.45 L.24 -.78 Z" fill="currentColor"/><path d="M-.24 -.78 L-.22 -1.45 L-.12 -1.48 L-.14 -.78 Z" fill="#000" opacity=".25"/><circle cy="-1.6" r=".12" fill="#d8b096"/><path d="M-.14 -1.64 Q0 -1.82 .14 -1.64 Z" fill="#3a2a22"/></g>`);
  S.def(`<g id="${S.id("fr")}"><path d="M-.11 0 V-.6 h.1 V0 Z M.02 0 V-.6 h.1 V0 Z" fill="#2c2b33"/><path d="M-.27 -.6 L-.2 -1.42 Q0 -1.52 .2 -1.42 L.27 -.6 Z" fill="currentColor"/><path d="M-.27 -.6 L-.2 -1.42 L-.1 -1.45 L-.15 -.6 Z" fill="#000" opacity=".25"/><circle cy="-1.57" r=".12" fill="#d8b096"/><path d="M-.15 -1.6 Q0 -1.8 .15 -1.6 Z" fill="currentColor"/></g>`);
  S.def(`<g id="${S.id("ki")}"><path d="M-.08 0 V-.45 h.07 V0 Z M.01 0 V-.45 h.07 V0 Z" fill="#2c2b33"/><path d="M-.16 -.42 L-.13 -.88 Q0 -.95 .13 -.88 L.16 -.42 Z" fill="currentColor"/><circle cy="-1" r=".11" fill="#e2b89c"/><path d="M-.12 -1.03 Q0 -1.2 .12 -1.03 Z" fill="#c8302c"/></g>`);
  S.def(`<g id="${S.id("tu")}"><path d="M-.12 0 h.24 l-.02 -.3 h-.2 Z" fill="#c9302c"/><path d="M-.06 -.3 q.06 -.12 .12 0" stroke="#7a1a1a" stroke-width=".02" fill="none"/><text x="0" y="-.08" font-size=".12" text-anchor="middle" fill="#fff" font-family="Georgia">ГУМ</text></g>`);
  const FARBEN = ["#2f3640", "#7a2a2a", "#3b4f6b", "#5a4a3a", "#c0473a", "#2d4a3c", "#d9cfc0", "#6b5b7a", "#1f2a3a", "#b8862e"];
  const leute = [];
  /* Gruppen: am GUM entlang, in der Mitte des Platzes, am Denkmal; Lücken dazwischen */
  for (const [d, l, n, sp] of [[205, -30, 4, 2], [240, -26, 3, 2], [262, -31, 3, 2], [120, -8, 3, 2.5], [150, -14, 4, 3], [180, 2, 3, 2], [215, -4, 5, 4], [255, 8, 4, 3], [300, -6, 6, 5], [318, -20, 4, 3], [95, 6, 2, 1.5], [70, -2, 2, 1.5], [62, 12, 2, 1.2], [140, 14, 3, 2]]) {
    for (let i = 0; i < n; i++) leute.push([d + (rnd() - 0.5) * sp * 3, l + (rnd() - 0.5) * sp * 2]);
  }
  leute.sort((a, b) => b[0] - a[0]);
  let g = "";
  for (const [d, l] of leute) {
    const x = X(d, l), y = Y(d), s = F / d;
    if (x < 118 || (x > 300 && d < 200) || x > 268) continue;
    const c = FARBEN[Math.floor(rnd() * FARBEN.length)], typ = rnd() < 0.5 ? "fr" : "mn";
    g += `<path d="M${r(x)} ${r(y)} l${r(-1.7 * s)} ${r(0.1 * s)} v${r(0.12 * s)} Z" fill="#1b2247" opacity=".25"/>`;
    const sk = (s * (0.95 + rnd() * 0.1)).toFixed(3), z = rnd();
    g += `<use href="#${S.id(typ)}" transform="translate(${r(x)} ${r(y)}) scale(${sk})" color="${c}"/>`;
    /* ein Kind an der Hand, eine Einkaufstüte vom GUM */
    if (z < 0.16) g += `<use href="#${S.id("ki")}" transform="translate(${r(x + 0.45 * s)} ${r(y)}) scale(${sk})" color="${FARBEN[(Math.floor(z * 60)) % FARBEN.length]}"/>`;
    else if (z < 0.3) g += `<use href="#${S.id("tu")}" transform="translate(${r(x + 0.3 * s)} ${r(y - 0.55 * s)}) scale(${sk})"/>`;
  }
  S.davor(`<g pointer-events="none">${g}</g>`);
}

PLATZ.kunst += `<g pointer-events="none">${BODEN_SCHATTEN.join("")}</g>`;
pfadeKlein(S);
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/moskau.js"));
console.log(aus);
