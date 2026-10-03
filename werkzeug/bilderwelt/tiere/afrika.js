/* =====================================================================
   TIER-BIBLIOTHEK — AFRIKA / SAVANNE (FASSUNG 854)
   Elefant, Giraffe, Zebra, Nashorn, Nilpferd, Gazelle, Gnu.
   Maße in Zentimetern, Blick nach rechts, Boden y = 0, Licht von links oben.
   ===================================================================== */
"use strict";

/* ---------- gemeinsame Helfer (nur für diese Datei) ---------- */
function mach(T, dez, RW) {
  const m = Math.pow(10, dez);
  const f = (n) => String(Math.round(n * m) / m);
  /* glatte Kurve wie T.glatt, aber mit eigener Rundung (große Tiere: ganze cm) */
  const G = (pts, zu = true, sp = 1) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
      d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + (zu ? "Z" : "");
  };
  let nr = 0;
  const H = { f, G };
  /* Körperteil: Pfad EINMAL in defs, dann Füllung / Innenzeichnung / Licht / Rand per <use> */
  H.teil = (pts, fill, o = {}) => {
    const d = typeof pts === "string" ? pts : G(pts, true, o.sp || 1);
    const id = T.id("t" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    const u = (a) => `<use href="#${id}" ${a}/>`;
    let s = u(`fill="${fill}"`);
    const ov = o.ov === undefined ? [T.lg("vol", [[0, "#fff", 0.2], [0.4, "#fff", 0], [0.7, "#000", 0.06], [1, "#000", 0.3]])] : o.ov;
    const innen = (o.innen || "") + ov.map((g) => u(`fill="${g}"`)).join("") + (o.oben || "");
    if (innen) s += `<g clip-path="url(#${id}c)">${innen}</g>`;
    if (o.rand !== false) s += u(`fill="none" stroke="${o.rand || "#1a140e"}" stroke-opacity="${o.randA != null ? o.randA : 0.35}" stroke-width="${o.rw || RW}" stroke-linejoin="round"`);
    return s;
  };
  /* mehrere offene Linien in EINEM Pfad */
  H.L = (zuege, farbe, w, op = 1, extra = "") =>
    `<path d="${zuege.map((p) => G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* weicher Licht-/Schattenfleck */
  H.fl = (x, y, rx, ry, rot, hell, op = 1) => {
    const g = hell ? T.rg("hl", [[0, "#fff", 0.32], [1, "#fff", 0]]) : T.rg("dk", [[0, "#000", 0.34], [1, "#000", 0]]);
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ""} fill="${g}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  };
  /* Kette (Bein, Rüssel, Schwanz): J = [x, y, vorne, hinten, ecke] → Umriss; Seiten L/R */
  H.kette = (J) => {
    const n = J.length, Lp = [], Rp = [];
    for (let i = 0; i < n; i++) {
      const a = J[Math.max(0, i - 1)], b = J[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const p = J[i], e = p[4] || 0;
      Lp.push([p[0] + dy * p[2], p[1] - dx * p[2], e & 1]);
      Rp.push([p[0] - dy * p[3], p[1] + dx * p[3], e & 2]);
    }
    return { L: Lp, R: Rp, pts: Lp.concat(Rp.slice().reverse()) };
  };
  H.bein = (J, fill, o = {}) => H.teil(H.kette(J).pts, fill, Object.assign({ ov: [T.lg("bx", [[0, "#fff", 0.12], [0.45, "#fff", 0], [1, "#000", 0.28]], 0, 0, 1, 0)] }, o));
  /* Huf: x = Kronrand-Mitte, h = Höhe, lv/lh = halbe Breite vorn/hinten */
  H.huf = (x, h, lv, lh, farbe, spalt) => {
    const p = [[x - lh * 0.9, -h, 1], [x + lv * 0.75, -h * 1.02, 1], [x + lv + h * 0.55, -0.4], [x + lv + h * 0.5, 0, 1], [x - lh * 1.05, 0, 1], [x - lh * 1.1, -h * 0.45]];
    let s = H.teil(p, farbe, { ov: [T.lg("hufl", [[0, "#fff", 0.18], [1, "#fff", 0]], 0, 0, 1, 0)], rw: RW * 0.8, randA: 0.5 });
    if (spalt) s += H.L([[[x + lv * 0.45, -h * 0.98], [x + lv * 0.6 + h * 0.3, -h * 0.1]]], "#000", RW * 0.6, 0.45);
    return s;
  };
  /* Bodenkontakt */
  H.kontakt = (xs, rx, ry) => xs.map((x) => `<ellipse cx="${f(x)}" cy="0" rx="${f(rx)}" ry="${f(ry)}" fill="#000" opacity=".22"/>`).join("");
  /* zufällige Runzeln (Elefant, Nashorn): n kurze Knicklinien in einem Feld */
  H.runzeln = (n, x0, y0, x1, y1, len, farbe, w, op) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      const a = (T.rnd() - 0.5) * 1.2, l = len * (0.5 + T.rnd());
      d += `M${f(x)} ${f(y)}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}l${f(Math.cos(a + 0.9) * l * 0.6)} ${f(Math.sin(a + 0.9) * l * 0.6)}`;
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  /* Hautfalte: dunkle Kerbe + Lichtkante darunter/rechts (Licht von links oben) */
  H.falte = (zuege, w, op, farbe = "#1d150f") => H.L(zuege, farbe, w, op) +
    (T.fein ? H.L(zuege.map((z) => z.map((p) => [p[0] + w * 0.7, p[1] + w * 0.9])), "#fff", w * 0.6, op * 0.45) : "");
  /* Punkt quer über eine Kette an Stelle t (0 … Anzahl-1): [linker Rand, rechter Rand] */
  H.an = (k, t) => {
    const i = Math.max(0, Math.min(k.L.length - 2, Math.floor(t))), u = t - i;
    const m = (A) => [A[i][0] + (A[i + 1][0] - A[i][0]) * u, A[i][1] + (A[i + 1][1] - A[i][1]) * u];
    return [m(k.L), m(k.R)];
  };
  /* Querfalten über eine Kette (Rüssel, Beine): von t0 bis t1, Abstand dt, Anteil der Breite a0–a1, Durchhang */
  H.querfalten = (k, t0, t1, dt, a0, a1, bauch) => {
    const z = [];
    for (let t = t0; t < t1; t += dt * (0.7 + T.rnd() * 0.6)) {
      const [p, q] = H.an(k, t), s0 = a0 + T.rnd() * 0.15, s1 = a1 - T.rnd() * 0.25;
      const P = (s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s + Math.sin(Math.PI * s) * bauch * (0.6 + T.rnd() * 0.8)];
      z.push([P(s0), P((s0 + s1) / 2), P(s1)]);
    }
    return z;
  };
  /* Punkt in Vieleck */
  H.drin = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  return H;
}

/* =====================================================================
   ELEFANT
   ===================================================================== */
/* RECHERCHE Elefant (Afrikanischer Steppenelefant, Loxodonta africana):
   Bulle Schulterhöhe ~3,2 m (Kuh ~2,6 m), Kopf-Rumpf 6–7,5 m inkl. Rüssel. Höchster Punkt ist die Schulter,
   der Rücken ist deutlich eingesenkt (konkav), Kruppe fällt ab. Ohren riesig (bis 2 × 1,5 m), Umriss wie die
   Landkarte Afrikas, oben am Kopf breit, unten in einen Zipfel auslaufend; sie bedecken Hals und Schulter.
   Rüssel geringelt, an der Spitze ZWEI Finger (Asiat: einer). Stoßzähne bei Bulle und Kuh. Säulenbeine:
   Ellbogen auf Bauchhöhe, Vorderfußwurzel („Knie“) tief, Hinterknie tief an der Vorderseite, Fuß rund mit
   Nägeln (vorn 4–5, hinten 3–4). Haut graubraun, faltig/rissig, Schwanz mit Haarquaste. */
function elefant(T) {
  const H = mach(T, 0, 2.6), { teil, L, fl, kette, falte, querfalten } = H, F = T.fein;
  const haut = T.lg("haut", [[0, "#aaa297"], [0.45, "#8f877c"], [1, "#6c645a"]]);
  const fern = T.lg("fern", [[0, "#6c655c"], [1, "#4f4840"]]);
  const nah = T.lg("nah", [[0, "#837b70"], [0.75, "#8b8276"], [1, "#74695c"]]);
  const vol = T.lg("evol", [[0, "#fff", 0.22], [0.32, "#fff", 0], [0.68, "#000", 0.1], [0.9, "#000", 0.3], [1, "#000", 0.16]]);
  const bx = T.lg("ebx", [[0, "#fff", 0.16], [0.35, "#fff", 0], [0.78, "#000", 0.16], [1, "#000", 0.34]], 0, 0, 1, 0);
  const R = "#20170f";
  const relief = (inh) => F ? `<g filter="${T.relief("haut", { f: 0.2, tiefe: 1.1, okt: 3, typ: "turbulence", seed: 5 })}">${inh}</g>` : inh;
  let s = H.kontakt([311, 242, 65, 124], 40, 6);
  let k = "";                                            /* alles mit Hautrelief */
  /* Schwanz mit Haarquaste */
  k += teil(kette([[20, -272, 3.4, 3.4], [10, -240, 2.8, 2.8], [5, -200, 2.4, 2.4], [3, -160, 2.2, 2.2]]).pts, "#6f685f", { rw: 1.4, ov: [bx] }) +
    teil([[0, -166], [6, -164], [7, -150], [4, -134], [-1, -128], [-4, -142]], "#211a14", { ov: [], rw: 0.8, innen: L([[[2, -160], [0, -140], [-2, -130]], [[5, -158], [4, -140], [2, -132]]], "#5a5047", 0.6, 0.7) });
  /* Beine: Säulen, Handwurzel tief, Hinterknie vorn auf Bauchhöhe */
  const NF = [[300, -235, 42, 40], [304, -160, 36, 33], [307, -98, 30, 28], [308, -74, 31.5, 29.5], [309, -44, 29, 28], [311, -14, 33, 31], [312, 0, 35, 32, 3]];
  const FF = [[262, -230, 40, 38], [256, -160, 34, 31], [250, -98, 28, 27], [249, -74, 29.5, 28.5], [246, -44, 27, 27], [243, -14, 31, 29], [242, 0, 33, 30, 3]];
  const NH = [[88, -215, 52, 50], [94, -150, 40, 38], [84, -96, 31, 33], [75, -60, 28, 30], [69, -28, 29, 28], [66, -10, 31, 30], [65, 0, 33, 31, 3]];
  const FH = [[112, -210, 48, 46], [118, -150, 38, 36], [121, -96, 30, 31], [122, -60, 28, 29], [123, -28, 28, 27], [124, -10, 30, 29], [125, 0, 32, 30, 3]];
  const naegel = (x, w, n) => [0.9, 0.55, 0.18].slice(0, n).map((q) => `<path d="M${H.f(x + w * q - 7)} -1Q${H.f(x + w * q - 6)} -11 ${H.f(x + w * q)} -11 ${H.f(x + w * q + 6)} -11 ${H.f(x + w * q + 7)} -1Z" fill="#c9bfae" stroke="#3d342a" stroke-width="1" stroke-opacity=".55"/>`).join("");
  const bein = (J, fill, fern2) => {
    const kk = kette(J), n = J.length - 1;
    const sohle = `<path d="M${H.f(kk.L[n][0])} -5L${H.f(kk.R[n][0])} -5" stroke="#3a3027" stroke-width="7" stroke-opacity=".35"/>`;
    return teil(kk.pts, fill, {
      ov: [bx], oben: sohle +
        falte(querfalten(kk, 1.6, 4.6, 0.32, 0.05, 0.95, 3), 1.8, fern2 ? 0.3 : 0.42) + falte(querfalten(kk, 2.6, 3.4, 0.12, 0.15, 0.85, 4), 2.2, 0.45) +
        (F ? H.runzeln(26, kk.R[1][0], J[1][1], kk.L[4][0], J[5][1], 6, R, 1, 0.22) : ""),
    }) + naegel(kk.R[n][0], kk.L[n][0] - kk.R[n][0], fern2 ? 2 : 3);
  };
  k += bein(FF, fern, 1) + bein(FH, fern, 1) + bein(NF, nah) + bein(NH, nah);
  /* Rumpf mit Schulter- und Schenkelansatz */
  const rumpf = [[18, -272], [40, -298], [82, -306], [150, -292], [205, -302], [248, -322], [300, -320], [345, -300], [352, -250], [346, -200],
    [340, -160], [337, -128], [314, -118], [286, -122], [268, -148], [232, -140], [182, -132], [148, -136], [140, -150], [136, -118], [100, -112], [52, -118],
    [24, -150], [8, -200], [6, -245]];
  k += teil(rumpf, haut, {
    ov: [vol],
    innen: fl(250, -268, 80, 52, 0, true) + fl(78, -265, 62, 42, 0, true) + fl(205, -205, 34, 80, 0, false, 0.9) + fl(140, -190, 30, 60, 10, false, 0.7) +
      fl(330, -205, 40, 70, 0, false) + fl(300, -150, 60, 28, 0, false, 0.8) + fl(60, -150, 50, 26, 0, false, 0.6) +
      falte([[[212, -298], [204, -250], [206, -195], [216, -150]], [[226, -300], [220, -260], [222, -210]], [[132, -284], [126, -230], [130, -175], [140, -152]],
        [[44, -282], [64, -236], [96, -205], [128, -158]], [[24, -250], [40, -200], [60, -160]], [[300, -175], [284, -146], [266, -150]], [[180, -140], [210, -146], [236, -142]]], 2.4, 0.38) +
      (F ? H.runzeln(160, 18, -300, 340, -130, 8, R, 1.1, 0.24) : H.runzeln(40, 18, -300, 340, -130, 8, R, 1.1, 0.2)),
  });
  /* Kopf */
  const kopf = [[300, -322], [330, -338], [364, -336], [394, -318], [415, -290], [429, -256], [437, -228], [432, -204], [418, -190], [408, -182], [402, -170],
    [392, -168], [380, -175], [358, -186], [334, -206], [314, -252]];
  k += teil(kopf, haut, {
    ov: [vol],
    innen: fl(388, -308, 34, 22, 0, true) + fl(372, -284, 14, 10, 0, false) + fl(392, -232, 22, 30, 0, false, 0.5) +
      falte([[[378, -272], [390, -276], [402, -270]], [[374, -264], [372, -252], [380, -244]], [[376, -242], [392, -240], [404, -246]], [[398, -306], [414, -280], [420, -262]],
        [[404, -310], [420, -290]], [[408, -226], [418, -212], [420, -200]], [[384, -206], [398, -196], [404, -186]]], 1.6, 0.42) +
      (F ? H.runzeln(40, 365, -330, 430, -190, 5, R, 0.9, 0.22) : ""),
  });
  /* Unterlippe hinter dem Rüssel */
  k += teil([[386, -182], [404, -186], [414, -178], [408, -166], [396, -164], [386, -170]], "#6e5d55", { rw: 1.2 });
  s += relief(k);
  k = "";
  const zahn = (dx, dy, q, fill) => {
    const z = kette([[404 + dx, -190 + dy, 7.5 * q, 7.5 * q], [426 + dx, -170 + dy, 7 * q, 7 * q], [452 + dx, -158 + dy, 5.8 * q, 5.8 * q], [472 + dx, -160 + dy, 4.3 * q, 4.3 * q], [485 + dx, -170 + dy, 2.4 * q, 2.4 * q], [490 + dx, -180 + dy, 0.5, 0.5]]);
    return teil(z.pts, fill, { rw: 1.2, randA: 0.55, ov: [T.lg("zvol", [[0, "#fff", 0.35], [0.4, "#fff", 0], [1, "#000", 0.3]])],
      innen: F ? L([[[412 + dx, -184 + dy], [440 + dx, -166 + dy], [470 + dx, -162 + dy]], [[420 + dx, -176 + dy], [450 + dx, -160 + dy]]], "#8a7650", 0.7, 0.4) : "" });
  };
  const elfen = T.lg("elfen", [[0, "#a58d62"], [0.25, "#e2d5b6"], [1, "#f6f0e2"]], 0, 0, 1, 0);
  s += zahn(-12, -6, 0.86, T.lg("elfen2", [[0, "#7e6c4c"], [1, "#c9bb9a"]], 0, 0, 1, 0));
  /* Rüssel: geringelt, an der Spitze zwei Finger */
  const rk = kette([[420, -240, 26, 30], [428, -200, 21, 22], [433, -150, 16.5, 17], [434, -100, 13, 13.5], [434, -55, 10.5, 11], [438, -22, 8.5, 9], [447, -8, 7, 7, 3]]);
  k += teil(rk.pts, haut, {
    ov: [T.lg("rbx", [[0, "#fff", 0.2], [0.4, "#fff", 0], [1, "#000", 0.32]], 0, 0, 1, 0)],
    innen: falte(querfalten(rk, 0.25, 5.7, 0.13, 0.03, 0.97, 2.2), 1.3, 0.5) + fl(426, -190, 12, 40, 0, true, 0.6),
  });
  k += teil([[442, -15], [452, -13], [457, -7], [452, -1], [447, -4], [443, -1], [436, -4]], "#7d756b", { ov: [], rw: 1.2 });
  s += relief(k);
  /* Lippenwulst um den Zahnansatz, naher Stoßzahn */
  s += zahn(0, 0, 1, elfen);
  s += `<ellipse cx="406" cy="-188" rx="10" ry="8" fill="#8a8277" stroke="${R}" stroke-opacity=".4" stroke-width="1.2"/>` + L([[[399, -192], [406, -196], [413, -193]]], R, 1, 0.4);
  /* Auge mit langen Wimpern */
  s += T.augeReal(390, -258, 2.3, { iris: "#7d4c20", iris2: "#2e1709", offen: 0.55, wimpern: 10, wimpernLaenge: 1.7, lid: "#271c14", haut: "#4f483f", winkel: 6 });
  /* Ohr (Afrika-Umriss), oberer Rand umgeschlagen */
  const ohr = [[352, -330], [312, -346], [268, -346], [236, -326], [226, -292], [230, -256], [242, -222], [258, -194], [278, -168], [296, -148], [308, -146], [316, -162],
    [332, -180], [350, -200], [362, -236], [364, -280], [360, -312]];
  let o = teil(ohr, T.lg("ohr", [[0, "#a0988d"], [0.55, "#8a8277"], [1, "#6a635a"]], 0, 0, 1, 0.4), {
    ov: [vol],
    innen: fl(345, -250, 22, 70, 0, false, 0.9) + fl(275, -300, 46, 30, 0, true) +
      falte([[[300, -300], [282, -268], [276, -228], [284, -188]], [[322, -290], [306, -250], [302, -205]], [[268, -268], [254, -232]], [[340, -290], [338, -240], [330, -200]],
        [[356, -300], [356, -240], [346, -206]], [[250, -300], [240, -270]]], 1.8, 0.34) +
      (F ? H.runzeln(60, 236, -330, 345, -165, 6, R, 1, 0.24) : ""),
    oben: teil([[352, -330], [312, -346], [268, -346], [236, -326], [240, -318], [270, -334], [312, -334], [350, -320]], "#a59d92", { ov: [], rw: 1.2 }) +
      L([[[350, -318], [312, -331], [270, -332], [242, -316]]], "#000", 3, 0.2),
  });
  s += relief(o);
  return { svg: s, box: [-1, -346, 490, 0] };
}

/* =====================================================================
   GIRAFFE
   ===================================================================== */
/* RECHERCHE Giraffe (Giraffa, Massai-Giraffe als Vorbild):
   Bulle bis 5,5 m hoch (Schulter ~3,3 m), Kuh ~4,5 m. Hals mit nur SIEBEN stark verlängerten Wirbeln (~2 m),
   Vorderbeine länger als Hinterbeine → Rücken fällt vom Widerrist zur Kruppe deutlich ab. Kurzer Rumpf, Brust tief.
   Kopf ~60 cm, zwei mit Fell überzogene Ossikone mit schwarzem Haarbüschel (Kuh) bzw. kahl (Bulle), Stirnbuckel.
   Kurze braune Stehmähne vom Hinterhaupt bis Widerrist. Flecken: unregelmäßig gezackte, kastanienbraune Platten
   auf cremefarbenem Netz, an Beinen kleiner, unten fast weiß. Große dunkle Augen mit langen Wimpern, seitlich.
   Paarhufer mit großen gespaltenen Hufen (~30 cm), Schwanz lang mit schwarzer Quaste. */
function giraffe(T) {
  const H = mach(T, 0, 2.2), { teil, L, fl, kette, drin } = H;
  const creme = T.lg("creme", [[0, "#efe1c2"], [1, "#e1cfa8"]]);
  const fern = T.lg("fern", [[0, "#c9b48c"], [1, "#a8916a"]]);
  const fleckF = T.lg("fleck", [[0, "#6a3613"], [0.6, "#8a4b1f"], [1, "#a8662f"]]);
  const fleckFern = "#6a3e1f";
  /* Fleckenmuster: gezackte Platten auf Gitter, Größe nach Körperstelle */
  const flecken = (poly, x0, y0, x1, y1, groesse, farbe, bis = 0) => {
    let d = "";
    for (let y = y0, zl = 0; y < y1; zl++) {
      const g = groesse(y);
      for (let x = x0 + (zl % 2) * g / 2; x < x1; x += g) {
        const px = x + (T.rnd() - 0.5) * g * 0.3, py = y + (T.rnd() - 0.5) * g * 0.3;
        if (!drin(poly, px, py) || py > bis) continue;
        const n = 7, rr = g * 0.4;
        let lx = 0, ly = 0;
        for (let k = 0; k <= n; k++) {
          const a = (k / n) * Math.PI * 2 + T.rnd() * 0.4, q = rr * (k % 2 ? 0.78 : 1) * (0.8 + T.rnd() * 0.35);
          const X = Math.round(px + Math.cos(a) * q * 1.1), Y = Math.round(py + Math.sin(a) * q);
          d += k ? `l${X - lx} ${Y - ly}` : `M${X} ${Y}`; lx = X; ly = Y;
        }
        d += "z";
      }
      y += g * 0.86;
    }
    return `<path d="${d}" fill="${farbe}" stroke="${farbe}" stroke-width="1.5" stroke-linejoin="round"/>`;
  };
  let s = H.kontakt([248, 205, 66, 98], 14, 3);
  /* Schwanz mit Quaste */
  s += teil(kette([[16, -282, 2.5, 2.5], [8, -240, 2, 2], [2, -190, 1.6, 1.6], [-1, -150, 1.5, 1.5]]).pts, "#b89a6e", { rw: 1 });
  s += teil([[-3, -158], [2, -152], [3, -130], [-1, -112], [-6, -126]], "#1e1712", { ov: [], rw: 0.8 });
  /* Beine: Vorderbein und Hinterbein als Ketten (Kronrand bei y = -13) */
  const vorder = (x) => [[x + 4, -235, 17, 17], [x + 1, -175, 11, 10], [x, -115, 7.5, 7.5], [x, -104, 8, 8], [x, -90, 6, 6], [x + 1, -40, 5, 5], [x + 2, -30, 6.5, 6.5], [x + 6, -13, 6, 6]];
  const hinter = (x) => [[x + 20, -225, 24, 24], [x + 10, -170, 13, 14], [x, -118, 7, 10, 2], [x + 1, -104, 6.5, 6.5], [x + 4, -40, 5, 5], [x + 5, -30, 6.5, 6.5], [x + 9, -13, 6, 6]];
  const bein = (J, fill, fl2, unten) => {
    const k = kette(J);
    return teil(k.pts, fill, { innen: fl2 ? flecken(k.pts, J[0][0] - 25, J[0][1], J[0][0] + 25, unten, () => 12, fl2, unten) : "", ov: [T.lg("bx", [[0, "#fff", 0.12], [0.45, "#fff", 0], [1, "#000", 0.25]], 0, 0, 1, 0)] }) +
      H.huf(J[J.length - 1][0], 13, 6, 6, "#2b231d", true);
  };
  s += bein(vorder(205), fern, fleckFern, -120) + bein(hinter(88), fern, fleckFern, -125);
  s += bein(vorder(244), creme, fleckF, -118) + bein(hinter(56), creme, fleckF, -122);
  /* Rumpf + Hals in einem Umriss */
  const rumpf = [[16, -284], [40, -298], [110, -314], [180, -334], [212, -352], [262, -405], [318, -463], [358, -500], [372, -510],
    [392, -472], [374, -455], [338, -415], [302, -360], [282, -310], [272, -262], [262, -228], [250, -205], [232, -200], [214, -206], [180, -202], [130, -204], [100, -212],
    [92, -192], [70, -186], [40, -194], [16, -228], [8, -262]];
  s += teil(rumpf, creme, {
    innen: flecken(rumpf, 0, -505, 400, -170, (y) => (y < -430 ? 15 : y < -340 ? 19 : 25), fleckF) +
      fl(240, -300, 55, 45, -20, true) + fl(60, -270, 45, 30, 0, true) + fl(150, -215, 70, 25, 0, false) + fl(250, -215, 25, 20, 0, false),
  });
  /* Mähne */
  s += teil([[372, -512], [350, -500], [300, -450], [250, -398], [205, -350], [196, -341], [212, -347], [258, -394], [306, -444], [356, -493], [375, -506]], "#7a4a24",
    { ov: [], innen: H.L([[[365, -506], [360, -514]], [[350, -497], [344, -505]], [[330, -478], [324, -486]], [[310, -457], [304, -465]], [[290, -436], [284, -444]], [[270, -415], [264, -423]], [[250, -394], [244, -401]], [[230, -372], [224, -379]]], "#3e2410", 2, 0.6), rw: 1 });
  /* Kopf */
  const kopf = [[362, -506], [376, -522], [396, -526], [416, -518], [430, -505], [440, -494], [446, -486], [447, -478], [442, -472], [434, -470], [424, -468], [410, -466], [396, -468], [382, -474], [366, -486]];
  s += teil(kopf, creme, {
    innen: flecken(kopf, 360, -525, 400, -470, () => 9, fleckF) + fl(420, -490, 14, 10, 20, false, 0.5) + fl(395, -512, 18, 9, 0, true) +
      `<path d="M438 -493C446 -490 449 -481 446 -474 442 -470 432 -471 428 -476Z" fill="#6d4a2f" opacity=".55"/>` +
      L([[[436, -486], [441, -487]], [[446, -475], [436, -474], [426, -475]]], "#2a1a0e", 1.2, 0.7),
  });
  s += T.auge(408, -502, 2.4, "#2a160a", { flach: 0.85 });
  s += L([[[404, -505], [408, -507.5], [412, -506]], [[406, -506], [404, -510]], [[408, -507], [407, -511]], [[410, -507], [411, -510]]], "#140c06", 0.6, 0.9);
  /* Ossikone mit Haarbüschel, Ohr */
  const oss = (x, fill) => teil([[x - 5, -518], [x - 4, -532], [x - 6, -540], [x + 1, -545], [x + 6, -538], [x + 4, -530], [x + 6, -518]], fill, { rw: 1 }) +
    teil([[x - 6, -539], [x - 3, -547], [x + 3, -548], [x + 7, -541], [x + 2, -536]], "#1c140e", { ov: [], rw: 0.6 });
  s += oss(380, "#b99a70") + oss(390, "#d8c49d");
  s += teil([[378, -514], [366, -520], [352, -526], [350, -522], [362, -512], [376, -508]], "#d8c49d", { innen: `<path d="M354 -523L366 -517 374 -512" stroke="#7a5a3a" stroke-width="2" fill="none" opacity=".6"/>`, rw: 0.8 });
  return { svg: s, box: [-6, -548, 448, 0] };
}

/* =====================================================================
   ZEBRA
   ===================================================================== */
/* RECHERCHE Zebra (Steppenzebra, Equus quagga):
   Schulterhöhe 1,1–1,4 m, Kopf-Rumpf 2,2–2,5 m, Schwanz ~50 cm, 230–320 kg. Gedrungener als ein Pferd, kurze
   Beine, großer Kopf, große runde Ohren, kurze STEHMÄHNE (gestreift). Streifen breit, am Rumpf senkrecht bis zum
   Bauch (dort Bauchstreifen), an der Kruppe waagerecht/schräg nach hinten gebogen, auf den Beinen quer und
   nach unten schmaler; im Süden hellbraune SCHATTENSTREIFEN zwischen den schwarzen am Hinterteil. Maul schwarz
   (Flotzmaul). Einhufer mit festem Huf. Schwanz mit schwarzer Quaste. */
function zebra(T) {
  const H = mach(T, 1, 0.9), { teil, L, fl, kette, G } = H;
  const weiss = T.lg("weiss", [[0, "#f7f4ec"], [1, "#e6e0d3"]]);
  const SW = "#191512";
  const band = (pts, w0, w1, w2) => {           /* spitz zulaufender Streifen entlang einer Mittellinie */
    const n = pts.length, J = pts.map((p, i) => { const t = i / (n - 1), w = t < 0.5 ? w0 + (w1 - w0) * t * 2 : w1 + (w2 - w1) * (t - 0.5) * 2; return [p[0], p[1], w, w]; });
    return G(kette(J).pts);
  };
  let s = H.kontakt([180, 165, 37, 50], 7, 1.5);
  /* Schwanz */
  s += teil(kette([[10, -118, 2.4, 2.4], [4, -100, 1.8, 1.8], [1, -80, 1.4, 1.4]]).pts, "#e9e3d6", { innen: L([[[0, -112], [16, -110]], [[0, -102], [12, -100]], [[0, -92], [10, -91]]], SW, 2.4), rw: 0.5 });
  s += teil([[-1, -84], [3, -83], [5, -66], [1, -56], [-4, -66]], SW, { ov: [], rw: 0.4 });
  /* Beine (Kronrand bei y = -7) */
  const vorder = (x) => [[x + 2, -92, 11, 11], [x, -60, 7.5, 6.5], [x, -46, 5.6, 5.6], [x, -40, 4.6, 4.6], [x, -20, 4.2, 4.2], [x + 1, -15, 5, 5], [x + 3, -7, 4.2, 3.8]];
  const hinter = (x) => [[x + 14, -88, 15, 15], [x + 8, -62, 8, 9], [x, -44, 4.8, 7.5, 2], [x + 1, -36, 4.6, 4.6], [x + 3, -19, 4.2, 4.2], [x + 4, -14, 5, 5], [x + 6, -7, 4.2, 3.8]];
  const quer = (x, y0, y1, dy) => { const z = []; for (let y = y0; y < y1; y += dy) z.push([[x - 20, y + 2], [x + 20, y - 1.5]]); return z; };
  const bein = (J, fill, dunkel) => teil(kette(J).pts, fill, {
    innen: L(quer(J[0][0], -84, -26, 6.2), SW, 2.8, dunkel ? 0.85 : 1) + L(quer(J[0][0], -24, -14, 4.5), SW, 1.6, 0.8),
    ov: [T.lg("bx", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
  }) + H.huf(J[J.length - 1][0], 7, 4.2, 3.8, "#2a2622", false);
  s += bein(vorder(162), T.lg("fern", [[0, "#cfc9bd"], [1, "#bdb6a8"]]), 1) + bein(hinter(46), T.lg("fern", []), 1);
  s += bein(vorder(179), weiss) + bein(hinter(30), weiss);
  /* Rumpf mit Hals und Stehmähne */
  const rumpf = [[10, -118], [34, -128], [70, -123], [110, -121], [148, -131], [160, -138], [168, -146], [175, -154], [183, -162], [191, -170], [200, -177], [208, -183], [216, -186],
    [224, -168], [218, -152], [206, -128], [198, -104], [192, -86], [190, -72], [176, -64], [160, -70], [130, -66], [90, -67], [64, -70], [60, -58], [40, -54], [20, -62], [5, -88], [5, -108]];
  /* Streifen */
  let st = "";
  /* Hals: quer zur Halsachse, von der Mähne zur Kehle */
  const D = (t) => [150 + 70 * t, -134 - 54 * t], F = (t) => [192 + 32 * t, -80 - 82 * t];
  [0.05, 0.19, 0.33, 0.47, 0.6, 0.73, 0.85, 0.95].forEach((t, i) => {
    const a = D(t), b = F(t - 0.03);
    st += band([[a[0] - 1, a[1] - 14], [a[0] + (b[0] - a[0]) * 0.5 - 2, a[1] + (b[1] - a[1]) * 0.5], [b[0] + 3, b[1] + 3]], 3.4 - i * 0.12, 3.8 - i * 0.2, 1.8);
  });
  /* Schulter: biegen unten nach vorn aufs Bein */
  st += band([[146, -136], [150, -110], [160, -88], [176, -78]], 3.6, 4, 1.5) + band([[134, -128], [138, -102], [146, -82], [160, -70]], 3.6, 4.4, 1.5);
  /* Rumpf: senkrecht bis zum Bauch */
  [120, 106, 92, 78].forEach((x, i) => { st += band([[x, -126], [x + 2, -100], [x + 7, -70], [x + 10, -62]], 3.6, 4.4 - i * 0.2, 0.8); });
  /* Kruppe: Bögen um den Oberschenkel, nach hinten waagerecht */
  const C = [56, -66];
  let schatten = [];
  [20, 30, 40, 50, 61].forEach((rr, i) => {
    const pts = []; for (let a = -78; a >= -192; a -= 19) pts.push([C[0] + Math.cos(a * Math.PI / 180) * rr * 1.08, C[1] + Math.sin(a * Math.PI / 180) * rr]);
    st += band(pts, 1.2, 3.6 + i * 0.15, 2.6);
    const p2 = []; for (let a = -88; a >= -185; a -= 24) p2.push([C[0] + Math.cos(a * Math.PI / 180) * (rr + 5) * 1.08, C[1] + Math.sin(a * Math.PI / 180) * (rr + 5)]);
    schatten.push(p2);
  });
  /* Rückenstreifen und Bauchlinie */
  const ruecken = L([[[8, -118], [34, -127], [70, -122], [110, -120], [148, -130]]], SW, 3.6) + L([[[64, -67], [100, -65], [140, -64], [176, -64]]], SW, 4);
  s += teil(rumpf, weiss, {
    innen: `<path d="${st}" fill="${SW}"/>` + L(schatten, "#8a7560", 1.8, 0.55) + ruecken +
      fl(150, -110, 22, 18, 0, true) + fl(40, -110, 22, 14, 0, true) + fl(110, -78, 40, 12, 0, false),
  });
  /* Mähnenhaare (Stehmähne, Spitzen dunkel) */
  s += L([[[150, -133], [160, -141]], [[160, -138], [168, -147]], [[168, -146], [175, -155]], [[175, -154], [183, -163]], [[183, -162], [191, -171]], [[191, -170], [200, -178]], [[200, -177], [208, -184]], [[208, -183], [216, -187]]], SW, 1, 0.5);
  /* Kopf */
  const kopf = [[208, -180], [218, -184], [228, -180], [238, -170], [250, -150], [258, -134], [264, -122], [266, -114], [262, -108], [254, -106], [246, -110], [238, -120], [228, -136], [218, -150], [210, -164]];
  const kz = L([[[220, -182], [232, -168], [246, -148]], [[216, -178], [226, -162], [240, -140], [252, -124]], [[226, -176], [236, -166]], [[214, -170], [222, -154], [234, -134]],
    [[212, -162], [224, -146], [236, -126]], [[216, -150], [230, -134]], [[236, -176], [244, -160]]], SW, 1.9);
  s += teil(kopf, weiss, {
    innen: kz + `<path d="M248 -132C256 -128 266 -122 267 -114 266 -106 256 -104 248 -110 242 -116 242 -128 248 -132Z" fill="#2a2420"/>` + fl(232, -172, 10, 7, 0, true) + fl(246, -126, 8, 14, 30, false, 0.6) +
      L([[[257, -122], [262, -124]], [[263, -109], [255, -110]]], "#000", 0.8, 0.8),
  });
  s += T.auge(232, -164, 1.6, "#2a1a0e", { flach: 0.8 });
  /* Ohren: groß, rund, aufrecht */
  const ohr = (dx, fill) => teil([[210 + dx, -180], [206 + dx, -194], [208 + dx, -205], [214 + dx, -207], [219 + dx, -198], [218 + dx, -184]], fill,
    { innen: L([[[212 + dx, -203], [214 + dx, -190]]], SW, 2.5, 0.8) + `<path d="M206 -201L214 -208 219 -200" transform="translate(${dx} 0)" fill="none" stroke="${SW}" stroke-width="2.6"/>`, rw: 0.6 });
  s += ohr(-5, "#d9d3c6") + ohr(0, "#f4f0e6");
  return { svg: s, box: [-4, -208, 267, 0] };
}

/* =====================================================================
   NASHORN
   ===================================================================== */
/* RECHERCHE Nashorn (Breitmaulnashorn, Ceratotherium simum):
   Größtes Nashorn: Kopf-Rumpf 3,4–4 m, Schwanz ~70 cm, Schulterhöhe 1,6–1,86 m, bis 2,3 t. Langer, tief getragener
   Kopf (Grasfresser), breites, gerades „eckiges“ Maul, ausgeprägter NACKENBUCKEL (Muskel/Bänder für den schweren
   Kopf), zwei Hörner hintereinander, vorderes deutlich länger (~60 cm). Kleine Augen tief hinter dem hinteren Horn,
   lange röhrenförmige Ohren mit Haarsaum. Haut grau, dicke Falten hinter Schulter und vor dem Oberschenkel, kurze
   Säulenbeine mit drei Zehen (Nägel). */
function nashorn(T) {
  const H = mach(T, 0, 1.6), { teil, L, fl, kette } = H;
  const haut = T.lg("haut", [[0, "#a29d93"], [0.55, "#878177"], [1, "#686259"]]);
  const fern = T.lg("fern", [[0, "#6d685f"], [1, "#565048"]]);
  const R = "#2a241d";
  let s = H.kontakt([270, 235, 60, 92], 24, 4);
  s += teil(kette([[10, -150, 3.5, 3.5], [3, -125, 3, 3], [0, -98, 2.5, 2.5]]).pts, "#7a746b", { rw: 1 }) + teil([[-3, -104], [3, -102], [3, -88], [-1, -82], [-5, -90]], "#2d2721", { ov: [], rw: 0.8 });
  const vorder = (x) => [[x - 3, -100, 27, 27], [x, -58, 21, 19], [x + 1, -36, 17, 16], [x + 2, -12, 19, 18], [x + 3, 0, 22, 19, 3]];
  const hinter = (x) => [[x + 8, -100, 32, 32], [x + 4, -58, 20, 22], [x, -36, 16, 17], [x + 1, -12, 18, 17], [x + 2, 0, 21, 18, 3]];
  const zehen = (x, w) => [0.92, 0.45].map((k) => `<path d="M${H.f(x + w * k - 6)} 0Q${H.f(x + w * k)} -11 ${H.f(x + w * k + 6)} 0Z" fill="#b3aa98" stroke="#3b342c" stroke-width=".8" stroke-opacity=".6"/>`).join("");
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.1], [0.5, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
    innen: L([[[J[1][0] - 18, J[1][1] + 2], [J[1][0], J[1][1] + 6], [J[1][0] + 18, J[1][1] + 1]], [[J[2][0] - 14, J[2][1] + 4], [J[2][0] + 14, J[2][1] + 2]]], R, 1.6, 0.35) }) + zehen(J[4][0] - J[4][3], J[4][2] + J[4][3]);
  s += bein(vorder(238), fern) + bein(hinter(92), fern);
  s += bein(vorder(268), haut) + bein(hinter(58), haut);
  const rumpf = [[8, -150], [40, -168], [100, -164], [160, -160], [215, -168], [255, -178], [288, -190], [312, -186], [330, -170], [338, -142], [330, -112], [318, -92],
    [300, -82], [292, -66], [268, -56], [246, -60], [236, -72], [205, -58], [140, -54], [110, -60], [100, -54], [76, -48], [40, -54], [18, -75], [4, -105], [3, -130]];
  s += teil(rumpf, haut, {
    innen: fl(260, -150, 50, 30, 0, true) + fl(60, -140, 50, 25, 0, true) + fl(130, -75, 70, 18, 0, false) + fl(228, -110, 18, 50, 10, false, 0.8) +
      L([[[232, -170], [222, -135], [226, -100], [238, -72]], [[110, -162], [104, -120], [110, -64]], [[300, -186], [304, -150], [312, -110], [306, -86]], [[316, -180], [322, -140], [326, -110]],
        [[40, -160], [80, -120], [104, -64]], [[262, -92], [276, -84], [292, -80]]], R, 2, 0.35) + H.runzeln(40, 20, -165, 320, -70, 6, R, 1, 0.25),
  });
  /* Kopf, tief getragen */
  const kopf = [[316, -186], [334, -178], [350, -160], [372, -132], [394, -104], [414, -84], [426, -64], [430, -44], [428, -32], [414, -28], [398, -32], [384, -38], [362, -52], [338, -74], [318, -100], [308, -140]];
  s += teil(kopf, haut, {
    innen: fl(350, -150, 22, 14, 40, true) + fl(380, -70, 30, 22, 30, false, 0.8) +
      L([[[426, -46], [412, -48], [398, -44]], [[404, -66], [410, -62]], [[340, -150], [348, -120], [362, -96]], [[330, -130], [340, -96], [356, -70]]], R, 1.6, 0.45),
  });
  s += T.auge(360, -116, 2.4, "#3a2412", { flach: 0.7, lid: "#2b241c" });
  /* Hörner */
  s += teil([[372, -126], [366, -144], [362, -158], [368, -154], [378, -140], [386, -122]], T.lg("horn", [[0, "#5d5246"], [1, "#9b8d77"]], 1, 0, 0, 1), { rw: 1 });
  s += teil([[392, -104], [398, -132], [404, -160], [406, -176], [412, -162], [418, -126], [422, -96], [412, -88]], T.lg("horn", []), { rw: 1, innen: fl(400, -130, 4, 20, -10, true) });
  /* Ohren: röhrenförmig mit Haarsaum */
  const ohr = (x, fill) => teil([[x, -170], [x - 6, -188], [x - 4, -204], [x + 4, -196], [x + 12, -180], [x + 10, -168]], fill, { rw: 1.2, innen: L([[[x - 3, -201], [x - 7, -205]], [[x + 1, -199], [x - 1, -205]]], R, 0.8, 0.6) });
  s += ohr(316, "#77716a") + ohr(328, "#8d877d");
  return { svg: s, box: [-5, -205, 430, 0] };
}

/* =====================================================================
   NILPFERD
   ===================================================================== */
/* RECHERCHE Nilpferd (Flusspferd, Hippopotamus amphibius; Duden: das Nilpferd):
   Kopf-Rumpf 3–4,3 m (Schwanz 35–56 cm), Schulterhöhe ~1,5 m, bis 3 t. Tonnenförmiger Rumpf, sehr kurze Beine
   (Bauch knapp über dem Boden), vier Zehen mit Nägeln. Riesiger Kopf mit breiter, kastenförmiger Schnauze;
   Augen, Ohren und Nasenlöcher liegen auf einer Ebene oben auf dem Kopf (Augen auf Höckern, kleine Ohren).
   Haut nackt, oben schiefer-/purpurgraubraun, unten rosa; rosa Stellen um Augen, Ohren, Wangen. Kurzer Schwanz. */
function nilpferd(T) {
  const H = mach(T, 0, 1.5), { teil, L, fl, kette } = H;
  const haut = T.lg("haut", [[0, "#776669"], [0.5, "#86706e"], [0.85, "#a9827a"], [1, "#b98e84"]]);
  const fern = T.lg("fern", [[0, "#5d4e51"], [1, "#6f5a57"]]);
  const R = "#2b1e1c";
  let s = H.kontakt([270, 240, 62, 92], 24, 4);
  s += teil(kette([[8, -118, 4, 4], [2, -100, 3, 3], [-1, -86, 2, 2]]).pts, "#6e5e5f", { rw: 1 }) + teil([[-4, -92], [2, -90], [2, -78], [-2, -74], [-6, -80]], "#2e2424", { ov: [], rw: 0.6 });
  const vorder = (x) => [[x - 2, -80, 26, 26], [x, -44, 21, 20], [x + 1, -14, 21, 20], [x + 2, 0, 23, 21, 3]];
  const hinter = (x) => [[x + 6, -80, 28, 28], [x + 2, -44, 21, 21], [x, -14, 20, 19], [x + 1, 0, 22, 20, 3]];
  const zehen = (x, w) => [0.92, 0.6, 0.28].map((k) => `<path d="M${H.f(x + w * k - 5)} 0Q${H.f(x + w * k)} -9 ${H.f(x + w * k + 5)} 0Z" fill="#c9b2a2" stroke="#3b2a26" stroke-width=".8" stroke-opacity=".6"/>`).join("");
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.08], [0.5, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
    innen: L([[[J[1][0] - 16, J[1][1] + 6], [J[1][0] + 16, J[1][1] + 4]]], R, 1.5, 0.3) }) + zehen(J[3][0] - J[3][3], J[3][2] + J[3][3]);
  s += bein(vorder(240), fern) + bein(hinter(92), fern);
  s += bein(vorder(270), haut) + bein(hinter(58), haut);
  const rumpf = [[8, -118], [40, -140], [110, -146], [190, -146], [260, -150], [300, -150], [330, -144], [340, -120], [330, -84], [312, -60], [296, -50], [276, -44], [250, -46],
    [210, -34], [150, -32], [112, -38], [94, -34], [76, -30], [40, -36], [14, -62], [3, -92]];
  s += teil(rumpf, haut, {
    innen: fl(250, -130, 70, 22, 0, true) + fl(70, -120, 50, 20, 0, true) + fl(150, -60, 80, 18, 0, false, 0.6) +
      L([[[300, -146], [306, -110], [300, -70]], [[316, -140], [322, -110], [318, -76]], [[262, -84], [282, -74], [300, -70]]], R, 1.8, 0.3) +
      L([[[60, -138], [180, -142], [280, -144]]], "#fff", 3, 0.18),
  });
  /* Kopf: Kasten-Schnauze, Augen/Ohren/Nüstern oben */
  const kopf = [[300, -150], [330, -156], [352, -160], [366, -168], [380, -164], [390, -146], [414, -136], [432, -134], [444, -136], [452, -126], [456, -104], [454, -80],
    [446, -64], [432, -52], [414, -44], [392, -44], [368, -50], [344, -60], [322, -72], [306, -96], [298, -126]];
  s += teil(kopf, haut, {
    innen: `<path d="M342 -96C370 -88 400 -76 446 -66 452 -58 440 -48 420 -44 390 -42 360 -52 338 -70Z" fill="#c49184" opacity=".7"/>` +
      fl(370, -152, 14, 10, 0, false, 0.7) + `<ellipse cx="370" cy="-152" rx="12" ry="8" fill="#c08e86" opacity=".55"/>` + fl(420, -120, 28, 12, 0, true) + fl(380, -100, 30, 20, 0, false, 0.5) +
      L([[[350, -88], [396, -76], [450, -70]], [[342, -110], [346, -96]], [[436, -128], [444, -126]]], R, 1.8, 0.5) + L([[[428, -132], [434, -128], [442, -130]]], "#1a1010", 2.5, 0.8),
  });
  s += T.auge(372, -156, 2.6, "#3b2414", { flach: 0.7, lid: "#4a2f2a" });
  /* Ohren klein */
  s += teil([[338, -158], [334, -170], [338, -178], [344, -172], [346, -160]], "#8a6a66", { rw: 0.9, innen: `<ellipse cx="340" cy="-169" rx="2.5" ry="5" fill="#c38c86"/>` });
  return { svg: s, box: [-6, -178, 456, 0] };
}

/* =====================================================================
   GAZELLE
   ===================================================================== */
/* RECHERCHE Gazelle (Thomson-Gazelle, Eudorcas thomsonii):
   Kopf-Rumpf 80–120 cm, Schwanz 15–27 cm (schwarz, ständig wedelnd), Schulterhöhe 55–82 cm, 15–30 kg.
   Fell sandbraun bis rötlich, darunter hellbraunes Band, dann der breite SCHWARZE FLANKENSTREIF vom Ellbogen
   bis vor den Oberschenkel, Bauch weiß. Weißer Spiegel am Hinterteil, schwarz gerandet. Gesicht: weißer
   Augenring, schwarzer Streif vom Augenwinkel zur Nase, rotbrauner Streif darüber, dunkler Nasenfleck.
   Hörner (Bock 25–43 cm) stark geringelt, leicht leierförmig nach hinten, Spitzen nach vorn. Schlanke Läufe. */
function gazelle(T) {
  const H = mach(T, 1, 0.45), { teil, L, fl, kette } = H;
  const fell = T.lg("fell", [[0, "#c69058"], [1, "#b37a44"]]);
  const fern = T.lg("fern", [[0, "#9a6d42"], [1, "#7e5a38"]]);
  let s = H.kontakt([84, 76, 13, 18], 3, 0.7);
  const vorder = (x) => [[x + 1, -50, 4.8, 4.8], [x, -36, 2.8, 2.6], [x, -25, 2, 2], [x, -21, 1.6, 1.6], [x, -8, 1.3, 1.3], [x + 0.3, -6, 1.7, 1.7], [x + 1.5, -2.6, 1.4, 1.3]];
  const hinter = (x) => [[x + 7, -50, 7, 7], [x + 4, -36, 3, 3.4], [x, -23, 1.6, 2.6, 2], [x + 0.5, -18, 1.4, 1.4], [x + 1.5, -8, 1.3, 1.3], [x + 1.8, -6, 1.7, 1.7], [x + 3, -2.6, 1.4, 1.3]];
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.15], [0.45, "#fff", 0], [1, "#000", 0.28]], 0, 0, 1, 0)] }) + H.huf(J[J.length - 1][0], 2.6, 1.6, 1.4, "#1f1813", true);
  /* Schwanz schwarz */
  s += teil([[6, -66], [8, -63], [5, -54], [3, -50], [2, -56], [3, -63]], "#1c1612", { ov: [], rw: 0.3 });
  s += bein(vorder(76), fern) + bein(hinter(17), fern);
  s += bein(vorder(84), fell) + bein(hinter(10), fell);
  const rumpf = [[6, -66], [20, -72], [45, -69], [72, -70], [80, -73], [88, -80], [96, -90], [104, -100], [110, -103], [114, -92], [106, -78], [98, -64], [94, -54], [90, -46],
    [80, -42], [72, -45], [55, -42], [35, -43], [24, -46], [22, -40], [10, -42], [3, -52]];
  s += teil(rumpf, fell, {
    innen: `<path d="M20 -44C35 -50 60 -50 78 -50 88 -48 92 -44 92 -40L20 -36Z" fill="#f4efe6"/>` +
      `<path d="M24 -48C40 -55 62 -55 80 -52 88 -50 88 -47 80 -47 62 -48 40 -47 24 -44Z" fill="#1b1511"/>` +
      `<path d="M26 -52C42 -58 64 -58 82 -55L80 -52C62 -55 42 -55 26 -50Z" fill="#dcbf91" opacity=".8"/>` +
      `<path d="M2 -66C8 -62 12 -55 13 -45L-2 -45Z" fill="#f4efe6"/>` + L([[[7, -64], [11, -56], [12, -46]]], "#1b1511", 1.2, 0.85) +
      `<path d="M94 -62C99 -70 104 -82 110 -92L118 -88 104 -60Z" fill="#f1e7d6" opacity=".55"/>` +
      fl(78, -62, 10, 8, 0, true) + fl(18, -62, 10, 7, 0, true) + T.striche(40, 10, -70, 90, -55, 3, 1.2, "#7a4e26", 0.35, 0.4),
  });
  /* Kopf */
  const kopf = [[104, -100], [110, -106], [118, -108], [126, -103], [132, -97], [137, -92], [139, -88], [137, -85], [132, -84], [126, -85], [118, -88], [110, -92], [104, -95]];
  s += teil(kopf, fell, {
    innen: `<path d="M118 -97L136 -90 138 -86 130 -87 116 -94Z" fill="#1d1612" opacity=".9"/>` + `<path d="M114 -101L134 -93 136 -91 118 -98Z" fill="#f2ebe0" opacity=".9"/>` +
      `<ellipse cx="135" cy="-93" rx="3" ry="2.2" fill="#2a1d14" opacity=".8"/>` + `<path d="M110 -92C116 -88 124 -86 134 -85L132 -83 118 -86Z" fill="#f4efe6"/>` + fl(116, -104, 6, 3, 0, true),
  });
  s += `<ellipse cx="119" cy="-99.5" rx="2.1" ry="1.7" fill="#f4efe6"/>` + T.auge(119, -99.5, 1.25, "#24150b", { flach: 0.85 });
  /* Hörner, geringelt */
  const horn = (dx, fill) => {
    const J = [[112 + dx, -106, 1.6, 1.6], [110.5 + dx, -116, 1.5, 1.5], [108 + dx, -126, 1.2, 1.2], [107 + dx, -134, 0.9, 0.9], [108.5 + dx, -140, 0.35, 0.35]];
    const k = kette(J), ringe = [];
    for (let i = 0; i < 3; i++) for (let t = 0.15; t < 1; t += 0.3) ringe.push([[k.L[i][0] + (k.L[i + 1][0] - k.L[i][0]) * t, k.L[i][1] + (k.L[i + 1][1] - k.L[i][1]) * t], [k.R[i][0] + (k.R[i + 1][0] - k.R[i][0]) * t, k.R[i][1] + (k.R[i + 1][1] - k.R[i][1]) * t]]);
    return teil(k.pts, fill, { rw: 0.3, ov: [], innen: L(ringe, "#000", 0.5, 0.5) });
  };
  s += horn(-2, "#2a221b") + horn(0, "#3b3027");
  /* Ohr */
  s += teil([[106, -104], [100, -110], [96, -116], [100, -116], [108, -110], [110, -106]], "#b98654", { rw: 0.3, innen: `<path d="M99 -114L106 -108" stroke="#f1e2c8" stroke-width="1.2"/>` });
  return { svg: s, box: [-2, -142, 139.6, 0] };
}

/* =====================================================================
   GNU
   ===================================================================== */
/* RECHERCHE Gnu (Streifengnu, Connochaetes taurinus):
   Bulle Schulterhöhe ~1,5 m (Kuh 1,35 m), Kopf-Rumpf 2–2,4 m, Schwanz 60–100 cm, 180–250 kg. Vorne schwer, Rücken
   fällt vom Widerrist-Buckel zur Kruppe ab. Großer Kopf mit breiter Schnauze und Ramsnase, Gesicht schwarz.
   Hörner bei beiden Geschlechtern: erst seitlich, dann nach unten, dann nach oben-innen gebogen. Schwarze Stehmähne,
   hängender Bart (beim Streifengnu dunkel, beim Weißbartgnu weiß), langer schwarzer Pferdeschwanz. Fell
   schiefergrau mit bläulichem Schimmer, an Hals und Schulter dunkle senkrechte Querbänder. */
function gnu(T) {
  const H = mach(T, 1, 0.8), { teil, L, fl, kette } = H;
  const fell = T.lg("fell", [[0, "#857c76"], [0.6, "#6a625d"], [1, "#4e4743"]]);
  const fern = T.lg("fern", [[0, "#4f4844"], [1, "#3c3532"]]);
  const SW = "#1a1513";
  let s = H.kontakt([138, 128, 22, 32], 5, 1.2);
  /* Schwanz: langes schwarzes Haar */
  s += teil([[8, -124], [4, -116], [0, -96], [-4, -74], [-6, -56], [-1, -52], [2, -66], [4, -90], [8, -112], [12, -122]], SW, { ov: [], rw: 0.5, innen: L([[[3, -110], [-2, -80], [-4, -60]], [[6, -110], [2, -80], [0, -60]]], "#4a403a", 0.6, 0.6) });
  const vorder = (x) => [[x + 2, -80, 10, 10], [x, -52, 6.5, 6], [x, -40, 4.8, 4.8], [x, -34, 3.8, 3.8], [x, -14, 3.3, 3.3], [x + 0.5, -10, 4.2, 4.2], [x + 2.5, -5, 3.5, 3.1]];
  const hinter = (x) => [[x + 12, -82, 14, 14], [x + 7, -60, 6.5, 8], [x, -40, 3.6, 6, 2], [x + 1, -32, 3.4, 3.4], [x + 3, -13, 3.3, 3.3], [x + 3.5, -9, 4.2, 4.2], [x + 5.5, -5, 3.5, 3.1]];
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)] }) + H.huf(J[J.length - 1][0], 5, 3.5, 3.1, "#1d1714", true);
  s += bein(vorder(125), fern) + bein(hinter(30), fern);
  s += bein(vorder(136), fell) + bein(hinter(18), fell);
  const rumpf = [[8, -124], [26, -130], [60, -134], [95, -142], [122, -151], [140, -150], [158, -146], [172, -140], [176, -120], [168, -104], [160, -88], [156, -76], [148, -66],
    [132, -62], [126, -70], [100, -68], [62, -72], [44, -74], [42, -62], [24, -60], [10, -68], [2, -90], [3, -112]];
  const baender = []; for (let x = 92; x < 172; x += 6.5) baender.push([[x + 6, -150], [x + 2, -120], [x - 2, -88]]);
  s += teil(rumpf, fell, {
    innen: L(baender, "#2b2421", 2.6, 0.45) + fl(120, -120, 30, 22, 0, true) + fl(40, -112, 26, 16, 0, true) + fl(90, -78, 40, 12, 0, false) +
      T.striche(50, 10, -128, 130, -76, 2, 3, "#3a3330", 0.4, 0.35),
  });
  /* Stehmähne schwarz */
  s += teil([[88, -142], [100, -152], [116, -160], [134, -162], [152, -158], [166, -152], [176, -150], [174, -142], [160, -146], [140, -150], [120, -150], [100, -144]], SW,
    { ov: [], rw: 0.4, innen: L([[[100, -150], [102, -145]], [[112, -157], [114, -150]], [[124, -160], [125, -152]], [[136, -161], [137, -152]], [[148, -158], [149, -151]], [[160, -154], [161, -148]]], "#4b423c", 0.8, 0.8) });
  /* Bart */
  s += teil([[170, -112], [162, -104], [158, -94], [154, -82], [160, -78], [166, -86], [172, -96], [180, -104]], SW, { ov: [], rw: 0.4, innen: L([[[168, -106], [160, -88], [158, -80]], [[172, -104], [166, -90], [162, -82]]], "#4b423c", 0.6, 0.7) });
  /* Kopf (Ramsnase, schwarzes Gesicht) */
  const kopf = [[164, -140], [174, -148], [184, -148], [192, -140], [200, -128], [208, -114], [214, -102], [218, -93], [218, -86], [213, -82], [205, -82], [196, -88], [186, -98], [176, -110], [166, -124]];
  s += teil(kopf, T.lg("kopf", [[0, "#3a332f"], [1, "#1e1916"]], 0, 0, 1, 1), {
    innen: fl(178, -136, 9, 6, 0, true) + fl(204, -100, 10, 6, 50, true, 0.5) + L([[[214, -94], [210, -91]], [[217, -86], [206, -85]]], "#000", 0.9, 0.8),
  });
  s += T.auge(182, -128, 1.5, "#2a170b", { flach: 0.85, lid: "#0e0a08" });
  /* Hörner: seitlich, abwärts, dann aufwärts nach innen */
  const horn = (dx, dy, fill) => teil(kette([[176 + dx, -146 + dy, 3.2, 3.2], [186 + dx, -150 + dy, 2.8, 2.8], [194 + dx, -146 + dy, 2.3, 2.3], [198 + dx, -154 + dy, 1.7, 1.7], [194 + dx, -164 + dy, 1, 1], [189 + dx, -168 + dy, 0.3, 0.3]]).pts, fill, { rw: 0.4 });
  s += horn(-6, -2, "#2a2420") + horn(0, 0, T.lg("horn", [[0, "#3a332d"], [1, "#6a5f55"]], 0, 0, 1, 0));
  /* Ohr */
  s += teil([[172, -146], [164, -152], [158, -154], [160, -148], [168, -142]], "#4a423d", { rw: 0.4 });
  return { svg: s, box: [-6, -170, 218, 0] };
}

module.exports = [
  { id: "elefant", de: "der Elefant", syl: "e-le-FANT", it: "l'elefante", itSyl: "e-le-FAN-te", en: "elephant",
    gruppe: "Rüsseltiere", lebensraum: "Savanne", laenge: 4.93, hoehe: 3.38, zeichne: elefant },
  { id: "giraffe", de: "die Giraffe", syl: "gi-RAF-fe", it: "la giraffa", itSyl: "gi-RAF-fa", en: "giraffe",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.54, hoehe: 5.48, zeichne: giraffe },
  { id: "zebra", de: "das Zebra", syl: "ZE-bra", it: "la zebra", itSyl: "ZE-bra", en: "zebra",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 2.71, hoehe: 2.08, zeichne: zebra },
  { id: "nashorn", de: "das Nashorn", syl: "NAS-horn", it: "il rinoceronte", itSyl: "ri-no-ce-RON-te", en: "rhinoceros",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.35, hoehe: 2.05, zeichne: nashorn },
  { id: "nilpferd", de: "das Nilpferd", syl: "NIL-pferd", it: "l'ippopotamo", itSyl: "ip-po-PO-ta-mo", en: "hippopotamus",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.62, hoehe: 1.78, zeichne: nilpferd },
  { id: "gazelle", de: "die Gazelle", syl: "ga-ZEL-le", it: "la gazzella", itSyl: "gaz-ZEL-la", en: "gazelle",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 1.42, hoehe: 1.42, zeichne: gazelle },
  { id: "gnu", de: "das Gnu", syl: "GNU", it: "lo gnu", itSyl: "GNU", en: "wildebeest",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 2.24, hoehe: 1.7, zeichne: gnu },
];
