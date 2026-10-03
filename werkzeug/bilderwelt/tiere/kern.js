/* =====================================================================
   TIER-BIBLIOTHEK — KERN (FASSUNG 854)
   ---------------------------------------------------------------------
   XANDER (Auftrag vom 03.10., Antwort Funk 290): „ich möchte, dass die großen Tiere und die anderen
   Kleintiere noch mal richtig überarbeitet werden … die sollen ihren
   natürlichen Original entsprechen … einen perfekten Löwen … perfekte
   Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park".

   Jede Art liegt in werkzeug/bilderwelt/tiere/<gruppe>.js als Eintrag:
     { id, de, syl, it, itSyl, en,          // Wort wie in jeder Szene
       gruppe, lebensraum,                  // z. B. "Raubtiere", "Savanne"
       laenge, hoehe,                       // echte Maße in Metern (Umrissbox)
       zeichne(T) → { svg, box: [x0, y0, x1, y1] } }
   zeichne arbeitet in ZENTIMETERN: Blick nach rechts, Boden y = 0
   (box[3] = 0), Licht von links oben. T ist das Werkzeug unten.
   In eine Szene setzt man ein Tier mit setze(); auf ein Blatt mit blatt.js.
   ===================================================================== */
"use strict";
const r = (n) => Math.round(n * 10) / 10;
const r4 = (n) => Math.round(n * 10000) / 10000;

function zufall(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* Werkzeug für EINE Art in EINER Szene. S kommt aus neueSzene (lg, rg, def, id). */
function werkzeug(S, praefix, seed = 4711) {
  const T = { r, S };
  const schon = new Set();
  let nr = 0;
  const name = (n) => praefix + "_" + n;
  /* Verläufe je Art nur einmal anlegen */
  T.lg = (n, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, extra = "") => {
    const id = name(n);
    if (schon.has("l" + id)) return `url(#${S.id(id)})`;
    schon.add("l" + id); return S.lg(id, stops, x1, y1, x2, y2, extra);
  };
  T.rg = (n, stops, cx = 0.5, cy = 0.5, rr = 0.5, extra = "") => {
    const id = name(n);
    if (schon.has("r" + id)) return `url(#${S.id(id)})`;
    schon.add("r" + id); return S.rg(id, stops, cx, cy, rr, extra);
  };
  T.def = (svg) => S.def(svg);
  T.id = (n) => S.id(name(n));
  T.rnd = zufall(seed);
  /* glatte Linie durch Punkte (Catmull-Rom). [x, y, 1] = harte Ecke. sp: Spannung */
  T.glatt = (pts, zu = true, sp = 1) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
      d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
    }
    return d + (zu ? "Z" : "");
  };
  T.box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  /* Volumen: oben Licht, unten Schatten (über die Form gelegt) */
  T.VOL = () => T.lg("vol", [[0, "#fff", 0.22], [0.38, "#fff", 0], [0.68, "#000", 0.08], [1, "#000", 0.36]]);
  T.VOLX = () => T.lg("volx", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.16]], 0, 0, 1, 0);
  /* Körperteil: Füllung, darin (geklippt) Zeichnung/Fell, Volumen, feiner Rand.
     pts: Punkte (glatt) ODER fertiger Pfad-String d. o: { vol, volx, rand, randA, rw, innen } */
  T.koerper = (pts, fill, o = {}) => {
    const d = typeof pts === "string" ? pts : T.glatt(pts);
    const id = T.id("k" + nr++);
    T.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    let s = `<path d="${d}" fill="${fill}"/>`;
    const innen = (o.innen || "") + (o.vol !== false ? `<path d="${d}" fill="${T.VOL()}"/>` : "") + (o.volx ? `<path d="${d}" fill="${T.VOLX()}"/>` : "");
    if (innen) s += `<g clip-path="url(#${id})">${innen}</g>`;
    if (o.rand !== false) s += `<path d="${d}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.3}" stroke-width="${o.rw || 0.8}" stroke-linejoin="round"/>`;
    return s;
  };
  T.form = (pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : T.glatt(pts)}" fill="${fill}"${extra}/>`;
  T.linie = (pts, farbe, w, extra = "") => `<path d="${T.glatt(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* Fell/Federn: n kurze Striche in einem Feld, Richtung (dx, dy), alle in EINEM Pfad (klein!) */
  T.striche = (n, x0, y0, x1, y1, dx, dy, farbe, w, op = 0.5) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0), s = 0.6 + T.rnd() * 0.8;
      d += `M${r(x)} ${r(y)}l${r(dx * s)} ${r(dy * s)}`;
    }
    return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
  };
  /* Auge: Lid, Augapfel/Iris, Pupille (rund | schlitz | quer), Glanzlicht */
  T.auge = (x, y, rr, iris = "#3a2410", o = {}) => {
    const fl = o.flach || 1;
    let s = `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.22)}" ry="${r(rr * 1.02 * fl)}" fill="${o.lid || "#15100c"}"/>`;
    s += `<ellipse cx="${r(x + rr * 0.06)}" cy="${r(y)}" rx="${r(rr * 0.98)}" ry="${r(rr * 0.86 * fl)}" fill="${iris}"/>`;
    const p = o.pupille || "rund";
    if (p === "rund") s += `<circle cx="${r(x + rr * 0.1)}" cy="${r(y)}" r="${r(rr * 0.46 * fl)}" fill="#070504"/>`;
    if (p === "schlitz") s += `<ellipse cx="${r(x + rr * 0.1)}" cy="${r(y)}" rx="${r(rr * 0.17)}" ry="${r(rr * 0.78 * fl)}" fill="#070504"/>`;
    if (p === "quer") s += `<ellipse cx="${r(x + rr * 0.1)}" cy="${r(y)}" rx="${r(rr * 0.62)}" ry="${r(rr * 0.24 * fl)}" fill="#070504"/>`;
    s += `<circle cx="${r(x + rr * 0.38)}" cy="${r(y - rr * 0.34 * fl)}" r="${r(rr * 0.24)}" fill="#fff" opacity=".9"/>`;
    return s;
  };

  /* ---------------------------------------------------------------------
     FEINARBEIT — XANDER (03.10.): „fast fotorealistisch … ich will Augen sehen, Wimpern, jede Pore … Zähne, Krallen,
     Muskeln, Sehnen, Pupillen, Fellstruktur … alles mit Licht und Schatten realistisch plastisch“.
     T.fein: true = volle Feinheit (Blatt, Lexikon, Lupe); false = Szene (Haare/Poren sparsam, Formen gleich).
     --------------------------------------------------------------------- */
  T.fein = true;
  const r2 = (n) => Math.round(n * 100) / 100;   // Feinarbeit: 0,1 mm genau (auch für die Maus)
  const filterSchon = new Set();
  T.inPoly = (x, y, pts) => {
    let ja = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ja = !ja;
    }
    return ja;
  };
  /* Haare/Federstrahlen: n Strähnen in der Fläche pts (Punkte, nicht geglättet), Wuchsrichtung winkel in Grad
     (Zahl oder Funktion (x, y) → Grad; 0 = nach rechts, 90 = nach unten), Länge laenge (cm).
     o: { farben: [[farbe, anteil, breite, deckkraft], …], streuung (Grad), kruemmung (0–0,5) }.
     Je Farbe EIN Pfad – tausend Haare bleiben klein. Mit T.fein = false wird automatisch ein Viertel gezeichnet. */
  T.haare = (pts, n, winkel, laenge, o = {}) => {
    const [x0, y0, x1, y1] = T.box(pts);
    const farben = o.farben || [["#000", 1, laenge * 0.06, 0.35]];
    const summe = farben.reduce((s, f) => s + f[1], 0);
    const eimer = farben.map(() => "");
    const wf = typeof winkel === "function" ? winkel : () => winkel;
    const ziel = Math.round(n * (T.fein ? 1 : 0.25));
    let versuche = 0, gemacht = 0;
    while (gemacht < ziel && versuche < ziel * 10) {
      versuche++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, pts)) continue;
      const a = (wf(x, y) + (T.rnd() - 0.5) * (o.streuung != null ? o.streuung : 14)) * Math.PI / 180;
      const L = laenge * (0.55 + T.rnd() * 0.9);
      const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
      const kr = (o.kruemmung != null ? o.kruemmung : 0.15) * L * (T.rnd() - 0.5) * 2;
      const cx = (x + ex) / 2 - Math.sin(a) * kr, cy = (y + ey) / 2 + Math.cos(a) * kr;
      let u = T.rnd() * summe, i = 0;
      while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
      eimer[i] += `M${r2(x)} ${r2(y)}Q${r2(cx)} ${r2(cy)} ${r2(ex)} ${r2(ey)}`;
      gemacht++;
    }
    return eimer.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "").join("");
  };
  /* Rausch-Textur als Filter (Fellstruktur, Haut, Wolle): auf ein Rechteck gelegt und von einer Form geklippt.
     fx/fy: Frequenz je cm quer/längs (fx > fy = Striche in Längsrichtung), okt: Feinheit, farbe: Strichfarbe,
     staerke: Deckkraft-Verstärkung. Liefert die Filter-URL. */
  T.rauschen = (n, o = {}) => {
    const id = T.id("rs" + n);
    if (!filterSchon.has(id)) {
      filterSchon.add(id);
      const fx = o.fx != null ? o.fx : 0.6, fy = o.fy != null ? o.fy : 0.08, st = o.staerke != null ? o.staerke : 2.4;
      const c = o.farbe || "#000";
      const rgb = [1, 3, 5].map((i) => parseInt((c.length === 4 ? c.replace(/([0-9a-f])/gi, "$1$1") : c).slice(i, i + 2), 16) / 255);
      T.def(`<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">` +
        `<feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="${o.okt || 3}" seed="${o.seed || 7}"/>` +
        `<feColorMatrix values="0 0 0 0 ${r4(rgb[0])}  0 0 0 0 ${r4(rgb[1])}  0 0 0 0 ${r4(rgb[2])}  ${st} 0 0 0 ${r4(-st * (o.schwelle != null ? o.schwelle : 0.5))}"/></filter>`);
    }
    return `url(#${id})`;
  };
  /* Textur in eine Form legen: d = Pfad der Form, filterUrl aus T.rauschen, winkel = Wuchsrichtung (Grad), deckkraft */
  T.textur = (d, filterUrl, winkel = 0, deckkraft = 0.5, box = null) => {
    const cid = T.id("tx" + (nr++));
    T.def(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
    const b = box || [-400, -400, 400, 400];
    const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, R = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2 + 2;
    return `<g clip-path="url(#${cid})" opacity="${deckkraft}"><rect x="${r2(cx - R)}" y="${r2(cy - R)}" width="${r2(2 * R)}" height="${r2(2 * R)}" filter="${filterUrl}" transform="rotate(${r2(winkel)} ${r2(cx)} ${r2(cy)})"/></g>`;
  };
  /* Relief (Poren, Schuppen, Falten, Runzeln) als echtes Licht von links oben: auf eine Gruppe anwenden:
     `<g filter="${T.relief("haut", { f: 0.35, tiefe: 1.6 })}">…</g>`. f = Frequenz je cm, tiefe = Höhe, okt = Feinheit. */
  T.relief = (n, o = {}) => {
    const id = T.id("rf" + n);
    if (!filterSchon.has(id)) {
      filterSchon.add(id);
      T.def(`<filter id="${id}" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">` +
        `<feTurbulence type="${o.typ || "fractalNoise"}" baseFrequency="${o.f || 0.3}${o.f2 ? " " + o.f2 : ""}" numOctaves="${o.okt || 3}" seed="${o.seed || 3}" result="n"/>` +
        `<feDiffuseLighting in="n" surfaceScale="${o.tiefe || 1.5}" diffuseConstant="1" lighting-color="#fff" result="l"><feDistantLight azimuth="${o.azimut || 225}" elevation="${o.hoehe || 52}"/></feDiffuseLighting>` +
        `<feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1="${o.k1 || 1.28}" k2="0" k3="0" k4="0" result="m"/>` +
        `<feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`);
    }
    return `url(#${id})`;
  };
  /* Echtes Auge (Seitenansicht): Lidspalte, Augapfel, Iris mit Fasern und dunklem Rand, Pupille, Lidschatten,
     zwei Glanzlichter, feuchter Unterlidrand, Tränenkarunkel, Lidfalte, Wimpern.
     o: { iris, iris2 (Rand), pupille: "rund"|"schlitz"|"quer"|"oval", offen (0–1), winkel (Grad), weiss (Lederhaut
     sichtbar), lid (Lidrandfarbe), wimpern (Anzahl), wimpernFarbe, wimpernLaenge (× rr), haut (Farbe um das Auge) } */
  T.augeReal = (x, y, rr, o = {}) => {
    const id = T.id("au" + (nr++));
    const off = o.offen != null ? o.offen : 0.78;
    const iris = o.iris || "#b8862f", iris2 = o.iris2 || "#4a2c0c";
    const g = T.rg("iris_" + iris.slice(1) + iris2.slice(1), [[0, iris], [0.55, iris], [0.86, iris2], [1, "#1a0e05"]], 0.45, 0.45, 0.55);
    const W = rr * 1.35, Ho = rr * off, Hu = rr * off * 0.72;
    const spalt = `M${r2(-W)} 0 C${r2(-W * 0.5)} ${r2(-Ho * 1.15)} ${r2(W * 0.45)} ${r2(-Ho * 1.2)} ${r2(W)} ${r2(-Ho * 0.1)} C${r2(W * 0.5)} ${r2(Hu * 1.1)} ${r2(-W * 0.4)} ${r2(Hu * 1.15)} ${r2(-W)} 0 Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    let s = `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(o.winkel || 0)})">`;
    if (o.haut) s += `<ellipse cx="0" cy="${r2(-rr * 0.1)}" rx="${r2(W * 1.35)}" ry="${r2(rr * 1.25)}" fill="${o.haut}" opacity=".55"/>`;
    s += `<path d="${spalt}" fill="${o.weiss ? "#efe6d6" : "#120a05"}"/>`;
    s += `<g clip-path="url(#${id})">`;
    if (o.weiss) s += `<ellipse cx="0" cy="0" rx="${r2(W)}" ry="${r2(rr)}" fill="${T.rg("sklera", [[0, "#f6efe2"], [0.7, "#d9ccb6"], [1, "#a8957a"]], 0.4, 0.4, 0.6)}"/>`;
    s += `<circle cx="${r2(rr * 0.12)}" cy="0" r="${r2(rr * 0.92)}" fill="${g}"/>`;
    if (T.fein) {
      let fa = "";
      for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2, a2 = a + (T.rnd() - 0.5) * 0.2; fa += `M${r2(rr * 0.12 + Math.cos(a) * rr * 0.38)} ${r2(Math.sin(a) * rr * 0.38)}L${r2(rr * 0.12 + Math.cos(a2) * rr * 0.86)} ${r2(Math.sin(a2) * rr * 0.86)}`; }
      s += `<path d="${fa}" stroke="${iris2}" stroke-width="${r2(rr * 0.04) || 0.1}" stroke-opacity=".45" fill="none"/>`;
    }
    s += `<circle cx="${r2(rr * 0.12)}" cy="0" r="${r2(rr * 0.9)}" fill="none" stroke="#120804" stroke-width="${r2(rr * 0.09) || 0.1}" stroke-opacity=".7"/>`;
    const p = o.pupille || "rund";
    if (p === "rund") s += `<circle cx="${r2(rr * 0.14)}" cy="0" r="${r2(rr * 0.42)}" fill="#050302"/>`;
    if (p === "oval") s += `<ellipse cx="${r2(rr * 0.14)}" cy="0" rx="${r2(rr * 0.3)}" ry="${r2(rr * 0.5)}" fill="#050302"/>`;
    if (p === "schlitz") s += `<ellipse cx="${r2(rr * 0.14)}" cy="0" rx="${r2(rr * 0.12)}" ry="${r2(rr * 0.8)}" fill="#050302"/>`;
    if (p === "quer") s += `<rect x="${r2(rr * 0.14 - rr * 0.62)}" y="${r2(-rr * 0.2)}" width="${r2(rr * 1.24)}" height="${r2(rr * 0.4)}" rx="${r2(rr * 0.2)}" fill="#050302"/>`;
    /* Schatten des Oberlids auf dem Augapfel */
    s += `<rect x="${r2(-W)}" y="${r2(-rr * 1.2)}" width="${r2(2 * W)}" height="${r2(rr * 1.2)}" fill="${T.lg("lidschatten", [[0, "#000", 0.75], [0.55, "#000", 0.15], [1, "#000", 0]])}"/>`;
    s += `<ellipse cx="${r2(rr * 0.42)}" cy="${r2(-rr * 0.36)}" rx="${r2(rr * 0.24)}" ry="${r2(rr * 0.17)}" fill="#fff" opacity=".92"/>`;
    s += `<circle cx="${r2(-rr * 0.25)}" cy="${r2(rr * 0.3)}" r="${r2(rr * 0.09)}" fill="#fff" opacity=".5"/>`;
    s += `</g>`;
    /* Lidränder: oben kräftig, unten fein mit feuchtem Glanz; Tränenkarunkel vorn (Blick nach rechts → rechts = hinten,
       die Nase liegt in der Blickrichtung, also rechts) */
    s += `<path d="M${r2(-W)} 0 C${r2(-W * 0.5)} ${r2(-Ho * 1.15)} ${r2(W * 0.45)} ${r2(-Ho * 1.2)} ${r2(W)} ${r2(-Ho * 0.1)}" fill="none" stroke="${o.lid || "#1a0f08"}" stroke-width="${r2(rr * 0.2) || 0.1}" stroke-linecap="round"/>`;
    s += `<path d="M${r2(W)} ${r2(-Ho * 0.1)} C${r2(W * 0.5)} ${r2(Hu * 1.1)} ${r2(-W * 0.4)} ${r2(Hu * 1.15)} ${r2(-W)} 0" fill="none" stroke="${o.lid || "#1a0f08"}" stroke-width="${r2(rr * 0.1) || 0.1}"/>`;
    s += `<path d="M${r2(W * 0.7)} ${r2(Hu * 0.55)} C${r2(W * 0.2)} ${r2(Hu * 1.25)} ${r2(-W * 0.4)} ${r2(Hu * 1.25)} ${r2(-W * 0.8)} ${r2(Hu * 0.4)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${r2(rr * 0.05) || 0.1}"/>`;
    s += `<ellipse cx="${r2(W * 0.98)}" cy="${r2(-Ho * 0.05)}" rx="${r2(rr * 0.16)}" ry="${r2(rr * 0.12)}" fill="#b0605a" opacity=".8"/>`;
    s += `<path d="M${r2(-W * 1.05)} ${r2(-Ho * 0.35)} C${r2(-W * 0.4)} ${r2(-Ho * 1.85)} ${r2(W * 0.5)} ${r2(-Ho * 1.8)} ${r2(W * 1.1)} ${r2(-Ho * 0.7)}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="${r2(rr * 0.08) || 0.1}"/>`;
    const nw = o.wimpern || 0;
    if (nw && T.fein) {
      let d = "";
      const L = rr * (o.wimpernLaenge || 0.55);
      for (let i = 0; i < nw; i++) {
        const t = 0.15 + 0.75 * i / Math.max(1, nw - 1);
        const bx = -W + 2 * W * t, by = -Ho * 1.15 * Math.sin(Math.PI * Math.min(1, t * 1.05)) + Ho * 0.05;
        const a = -Math.PI / 2 - 0.9 + 1.5 * t;
        d += `M${r2(bx)} ${r2(by)}Q${r2(bx + Math.cos(a) * L * 0.5)} ${r2(by + Math.sin(a) * L * 0.7)} ${r2(bx + Math.cos(a) * L)} ${r2(by + Math.sin(a) * L * 0.8)}`;
      }
      s += `<path d="${d}" fill="none" stroke="${o.wimpernFarbe || "#140c06"}" stroke-width="${r2(rr * 0.05) || 0.1}" stroke-linecap="round"/>`;
    }
    return s + `</g>`;
  };
  /* Schnurrhaare/Tasthaare: n gebogene Haare ab (x, y), Richtung winkel (Grad), Fächer spreizung (Grad), Länge laenge */
  T.schnurrhaare = (x, y, n, laenge, winkel = 10, spreizung = 40, farbe = "#f4efe6", breite = null) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const a = (winkel - spreizung / 2 + spreizung * i / Math.max(1, n - 1) + (T.rnd() - 0.5) * 6) * Math.PI / 180;
      const L = laenge * (0.7 + T.rnd() * 0.5);
      const sx = x + (T.rnd() - 0.5) * laenge * 0.06, sy = y + (i - n / 2) * laenge * 0.025;
      d += `M${r2(sx)} ${r2(sy)}Q${r2(sx + Math.cos(a) * L * 0.55)} ${r2(sy + Math.sin(a) * L * 0.4)} ${r2(sx + Math.cos(a) * L)} ${r2(sy + Math.sin(a) * L + L * 0.12)}`;
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${breite || r2(laenge * 0.012) || 0.1}" stroke-opacity=".85" stroke-linecap="round"/>`;
  };
  return T;
}

/* Alle Arten aller Gruppen laden (ohne Doppel). */
function alleArten() {
  const fs = require("fs"), path = require("path");
  const dir = __dirname, arten = [], ids = new Set();
  for (const f of fs.readdirSync(dir).sort()) {
    if (!/\.js$/.test(f) || /^(kern|blatt|alt-blatt|zz_.*)\.js$/.test(f)) continue;
    /* eine halbfertige Gruppe (Helfer arbeiten parallel) darf die anderen nicht aufhalten */
    let liste;
    try { delete require.cache[require.resolve(path.join(dir, f))]; liste = require(path.join(dir, f)); }
    catch (e) { console.error("übersprungen: " + f + " – " + String(e.message).split("\n")[0]); continue; }
    for (const a of (Array.isArray(liste) ? liste : [])) {
      if (ids.has(a.id)) throw new Error("Art doppelt: " + a.id + " (" + f + ")");
      ids.add(a.id); arten.push(Object.assign({ datei: f }, a));
    }
  }
  return arten;
}

/* Eine Art in eine Szene setzen.
   x, y: Fußpunkt (Mitte unten) in Szeneneinheiten; epm: Szeneneinheiten je Meter an dieser Stelle;
   o: { dir: 1 | -1, schatten: true, seed }.  Liefert { svg, box } (box in Szeneneinheiten, relativ zu x/y). */
function setze(S, art, x, y, epm, o = {}) {
  const T = werkzeug(S, (o.praefix || art.id), o.seed || 4711);
  if (o.fein === false) T.fein = false;      // in Szenen: Formen gleich, Haare/Poren sparsamer
  const z = art.zeichne(T);
  const [x0, y0, x1, y1] = z.box;
  const k = epm / 100;                       // Zentimeter → Szeneneinheiten
  const dir = o.dir === -1 ? -1 : 1;
  const mx = (x0 + x1) / 2;
  let svg = "";
  if (o.schatten !== false && !art.fliegt && !art.schwimmt) {
    const L = (x1 - x0) * k / 2;
    svg += `<ellipse cx="0" cy="${r(0.3 * k * 10)}" rx="${r(L * 0.92)}" ry="${r(Math.max(0.6, L * 0.11))}" fill="#000" opacity=".22"/>`;
  }
  svg += `<g transform="scale(${r4(dir * k)} ${r4(k)}) translate(${r(-mx)} 0)">${z.svg}</g>`;
  const box = [(dir === 1 ? x0 - mx : -(x1 - mx)) * k, y0 * k, (dir === 1 ? x1 - mx : -(x0 - mx)) * k, y1 * k];
  return { svg: `<g transform="translate(${r(x)} ${r(y)})">${svg}</g>`, box, roh: svg };
}

module.exports = { werkzeug, alleArten, setze, zufall, r };
