/* =====================================================================
   TIER-BIBLIOTHEK — FUSS-BIBLIOTHEK (FASSUNG 880 — W7)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „… Muskeln, Sehnen, Pupillen, Krallen … Licht und Schatten realistisch
   plastisch massiv“.

   FASSUNG 880 — Warum: Kritiken („Klauen ohne Spalt“, „Pantoffel-Hufe“, „Keks-Nägel“, „Krallenkämme“, „Pfoten als
   Klumpen“). Jede Funktion liefert den UMRISS des Fußes (für T.glied/T.silhouette, Reihenfolge: vorn oben → Spitze →
   Sohle nach hinten → hinten oben) und die Innenzeichnung (Zehenfugen, Ballen, Krallen, Kronrand, Glanz) getrennt:
   { pts, svg, boden: [x0, x1], spitze: [x, y] }.
   Gemeinsame Eingabe: fessel = [x, y] (Fessel-/Zehengrundgelenk), spitze = [x, y] (Bodenpunkt vorn aus dem Skelett),
   breite = [hinten, vorn] (halbe Gliedbreite an der Fessel), o = { farbe, kralle, ballen, licht, fein }.

   QUELLEN: Huf – Dorsalwand 50–55° zum Boden, parallel zur Fesselachse (UMN Extension „Horse conformation“,
   americanfarriers.com „Conformation form to function“); Klauen der Wiederkäuer – zwei Hauptklauen (III, IV) mit
   Zwischenklauenspalt, zwei Afterklauen (II, V) hinten an der Fessel (König/Liebich, Anatomie der Haussäugetiere);
   Hundepfote – vier tragende Zehen (II–V) mit Zehenballen, Mittelhand-/Mittelfußballen, Krallen nicht einziehbar,
   Karpalballen hinten an der Vorderfußwurzel; Katzenpfote – Krallen eingezogen (im Fell verborgen);
   Bärentatze – Sohlengänger, fünf Zehen, Vorderkrallen 5–10 cm, leicht gebogen; Elefant – Sohlenkissen,
   vorn 5, hinten 4 Nägel (afrik.), Zehen im Fuß verborgen; Vogel/Theropode – Zehen II–IV nach vorn,
   Zehenpolster und Hornschilder (Scutae), I (Hallux) hinten/innen hoch.
   ===================================================================== */
"use strict";
const F = require("./form880");
const { glatt, eckig, lerp, abst, norm, op2 } = F;
const Z = (v) => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, "$1.");

/* =====================================================================
   T.pfote(fessel, spitze, breite, o) — Zehengänger (Hund, Wolf, Fuchs, Katze)
   o: { krallen ("#1a140e" | null = eingezogen/Katze), ballen ("#151110"), licht ("#fff"), afterkralle: true (Vorderpfote
        innen, hinter dem Bein), lang (Faktor Pfotenlänge), op (Deckkraft bei fernen Pfoten), fern (nur Umriss + Krallen) }
   FASSUNG 881 — Prüfer 880, Punkt 9: die Pfote wirkte wie ein Pantoffel (eigene flache Fläche mit gerader Naht zum
   Lauf, Zehen kaum lesbar, fünf helle Striche wie Wimpern, Krallen als spitze schwarze Sicheln mit Glanz, helle
   Spitzen am Übergang). Jetzt:
   - Der Umriss beginnt vorn an der Fessel und endet hinten an der Fessel (der Strang endet einen Punkt früher, siehe
     form880 gliedGeo) – keine Schleife mehr; die Vorderkante läuft in einer leichten Mulde über die Zehen.
   - DREI sichtbare Zehenwülste (V hinten, IV oben, III vorn) mit zwei weichen Furchen; Zehenballen und
     Mittelhandballen nur als dunkler Saum am Boden.
   - Krallen kurz, dick, stumpf, nach vorn unten in den Boden, matt (kein Glanzlicht).
   - pfote.achse = Querschnitt Ballen → Zehen: T.silhouette/T.glied verlängern damit die Laufachse in die Pfote, Licht,
     Laufmuster, Unterhaar und Fell laufen ohne Naht über die Zehen (keine „Wimpern“-Striche mehr).
   ===================================================================== */
function pfote(T, fessel, spitze, breite, o = {}) {
  const fein = T.fein !== false, [wa, wb] = breite, op = o.op || 1;
  const h = -fessel[1];                                    // Höhe des Zehengrundgelenks
  const L = (spitze[0] - fessel[0]) * (o.lang || 1) + wb * 0.5;
  const x0 = fessel[0] - wa * 1.05, xs = fessel[0] + L + wb * 0.15;     // Ballen hinten … Zehenspitze vorn
  const H = Math.max(h * 1.25, wb * 1.75);                   // Höhe der Zehenwülste (gewölbt, nicht flach)
  const P = (u, v) => [fessel[0] + (xs - fessel[0]) * u, -H * v];
  /* Zehenwülste [Mitte, Höhe]: V (hinten, außen), IV (höchster), III (vorn) */
  const Z = [[0.3, 0.86], [0.56, 0.97], [0.8, 0.84]];
  const pts = [[fessel[0] + wb * 0.97, fessel[1] - wb * 0.2]];
  pts.push(P(0.15, 0.84));                                   // flache Mulde zwischen Lauf und Zehen
  pts.push(P(Z[0][0], Z[0][1]), P(0.43, 0.76), P(Z[1][0], Z[1][1]), P(0.68, 0.76), P(Z[2][0], Z[2][1]));
  pts.push(P(0.93, 0.62), P(0.99, 0.34), [xs - (xs - fessel[0]) * 0.03, -H * 0.06]);
  pts.push([fessel[0] + (xs - fessel[0]) * 0.86, 0, 1], [x0 + wa * 0.5, 0, 1]);   // Sohle am Boden
  pts.push([x0 - wa * 0.04, -H * 0.3], [x0 + wa * 0.12, -H * 0.72], [fessel[0] - wa * 0.96, fessel[1] - wa * 0.15]);
  const achse = [[x0 + wa * 0.35, -H * 0.42], P(0.9, 0.45)];
  let s = "";
  const kr = o.krallen === undefined ? "#241d17" : o.krallen;
  /* Krallen: kurz, dick, stumpf – vorn unten an jeder Zehe aus dem Fell, schräg nach vorn unten bis zum Boden */
  /* Kralle als stumpfer, leicht gebogener Keil: Basis (Breite w0) im Fell an der Zehenfront, Achse 58° nach vorn unten,
     stumpfes Ende (Breite wt) am Boden */
  const kralle = (u, gr) => {
    /* Rücken der Kralle stark gewölbt (nach vorn oben), Unterseite fast gerade, Spitze rund abgestumpft */
    const Lk = H * 0.36 * gr, w0 = H * 0.2 * gr, wt = H * 0.085 * gr, a = 62 * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    const b = P(u, Lk * dy / H + 0.015), t = [b[0] + dx * Lk, b[1] + dy * Lk];
    const q = (p, k, w) => [p[0] + nx * w * k, p[1] + ny * w * k];
    const a1 = q(b, -0.5, w0), a2 = q(b, 0.5, w0), t1 = q(t, -0.5, wt), t2 = q(t, 0.5, wt);
    const m1 = [b[0] + dx * Lk * 0.42 - nx * (w0 * 0.5 + Lk * 0.2), b[1] + dy * Lk * 0.42 - ny * (w0 * 0.5 + Lk * 0.2)], m2 = [b[0] + dx * Lk * 0.5 + nx * (wt * 0.6), b[1] + dy * Lk * 0.5 + ny * (wt * 0.6)];
    return `M${Z2(a1[0])} ${Z2(a1[1])}Q${Z2(m1[0])} ${Z2(m1[1])} ${Z2(t1[0])} ${Z2(t1[1])}Q${Z2(t[0] + dx * wt * 0.9)} ${Z2(t[1] + dy * wt * 0.9)} ${Z2(t2[0])} ${Z2(t2[1])}Q${Z2(m2[0])} ${Z2(m2[1])} ${Z2(a2[0])} ${Z2(a2[1])}Z`;
  };
  if (kr) {
    s += `<path d="${kralle(0.93, 1) + kralle(0.71, 0.9) + (fein && !o.fern ? kralle(0.47, 0.72) : "")}" fill="${kr}" fill-opacity="${op2(op)}"/>`;
    /* matte Oberkante (Licht von links oben), kein Glanzpunkt */
    if (fein && !o.fern) s += `<path d="${kralle(0.93, 0.62) + kralle(0.71, 0.55)}" fill="${o.licht || "#fff"}" fill-opacity="${op2(0.07 * op)}" transform="translate(${Z2(-H * 0.03)} ${Z2(-H * 0.05)})"/>`;
  }
  /* Ballen: dunkler Saum am Boden unter den Zehen, hinten der Mittelhandballen etwas höher */
  const XL = xs - fessel[0], bal = o.ballen || "#16110e";
  const saum = `M${Z2(x0 + wa * 0.3)} ${Z2(-H * 0.02)}Q${Z2(x0 + wa * 0.12)} ${Z2(-H * 0.18)} ${Z2(x0 + wa * 0.8)} ${Z2(-H * 0.15)}` +
    `Q${Z2(fessel[0] + XL * 0.5)} ${Z2(-H * 0.06)} ${Z2(fessel[0] + XL * 0.86)} ${Z2(-H * 0.04)}L${Z2(fessel[0] + XL * 0.84)} 0L${Z2(x0 + wa * 0.45)} 0Z`;
  s += `<path d="${saum}" fill="${bal}" fill-opacity="${op2((fein ? 0.42 : 0.38) * op)}"/>`;
  if (!fein || o.fern) return { pts, svg: s, boden: [x0, xs], spitze: [xs, 0], achse };
  /* Zehenfurchen zwischen V/IV und IV/III: weiche dunkle Kerben vom Tal hinab bis knapp über den Boden */
  const furche = (u) => { const a = P(u, 0.74), b = P(u - 0.04, 0.14); return `M${Z2(a[0])} ${Z2(a[1])}Q${Z2(a[0] + XL * 0.015)} ${Z2((a[1] + b[1]) / 2)} ${Z2(b[0])} ${Z2(b[1])}`; };
  s += `<path d="${furche(0.43) + furche(0.68)}" stroke="#1a120a" stroke-width="${Z2(H * 0.06)}" fill="none" stroke-opacity="${op2(0.38 * op)}" stroke-linecap="round"/>`;
  s += `<path d="${furche(0.44) + furche(0.69)}" stroke="#1a120a" stroke-width="${Z2(H * 0.16)}" fill="none" stroke-opacity="${op2(0.08 * op)}"/>`;
  /* Licht auf den Wülsten (von links oben), weich */
  const lt = (u, v) => { const a = P(u - 0.08, v * 0.9), b = P(u + 0.04, v * 0.93); return `M${Z2(a[0])} ${Z2(a[1])}Q${Z2((a[0] + b[0]) / 2)} ${Z2(a[1] - H * 0.06)} ${Z2(b[0])} ${Z2(b[1])}`; };
  s += `<path d="${Z.map(([u, v]) => lt(u, v)).join("")}" stroke="${o.licht || "#fff"}" stroke-width="${Z2(H * 0.1)}" fill="none" stroke-opacity="${op2(0.1 * op)}" stroke-linecap="round"/>`;
  /* Afterkralle (Daumenkralle) innen am Vordermittelfuß – schaut hinten als kleiner, stumpfer Sporn knapp hervor */
  if (o.afterkralle) {
    const ax = fessel[0] - wa * 0.98, ay = fessel[1] - H * 0.7;
    s += `<path d="M${Z2(ax)} ${Z2(ay)}q${Z2(-H * 0.1)} ${Z2(H * 0.06)} ${Z2(-H * 0.08)} ${Z2(H * 0.2)}q${Z2(H * 0.06)} ${Z2(-H * 0.03)} ${Z2(H * 0.11)} ${Z2(-H * 0.12)}z" fill="${kr || "#16110c"}" fill-opacity="${op2(0.55 * op)}"/>`;
  }
  return { pts, svg: s, boden: [x0, xs], spitze: [xs, 0], achse };
}
const Z2 = (v) => Z(v);

/* =====================================================================
   T.huf(fessel, spitze, breite, o) — Einhufer (Pferd, Esel, Zebra)
   Fessel (Fesselbein) vom Fesselgelenk zum Kronrand in der Achse fessel→spitze; Hufwand vorn parallel dazu
   (50–52° zum Boden), Trachten hinten kürzer und steiler, Kronrand mit Haarsaum, Ballen hinten.
   o: { horn ("#2a2420"), kronHaar (Farbe), hoehe (Hufhöhe vorn, cm), weiss (heller Huf) }
   ===================================================================== */
function huf(T, fessel, spitze, breite, o = {}) {
  const fein = T.fein !== false, [wa, wb] = breite;
  const ax = norm(spitze[0] - fessel[0], spitze[1] - fessel[1]);     // Fesselachse (nach vorn unten)
  const Lf = abst(fessel, spitze), hh = o.hoehe || Lf * 0.42;        // Hufhöhe vorn
  const wand = (o.wand || 52) * Math.PI / 180;
  const toe = [spitze[0], 0];
  const kronV = [toe[0] - Math.cos(wand) * hh / Math.sin(wand), -hh];   // Kronrand vorn
  const tr = hh * 0.5, hl = hh * 1.15;                                // Trachtenhöhe, Hufbodenlänge
  const heel = [toe[0] - hl - hh * 0.25, 0], kronH = [heel[0] + tr * 0.3, -tr];
  const pts = [[fessel[0] + wb * 0.9, fessel[1] + wb * 0.3], lerp([fessel[0] + wb, fessel[1]], kronV, 0.55), [kronV[0] + hh * 0.06, kronV[1] - hh * 0.04],
    kronV, [toe[0] + hh * 0.02, -hh * 0.06], [toe[0], 0, 1], [heel[0] + hh * 0.1, 0, 1], [heel[0] - hh * 0.06, -tr * 0.5],
    [kronH[0] - hh * 0.18, kronH[1] - hh * 0.1], [kronH[0] - hh * 0.1, kronH[1] - hh * 0.35], [fessel[0] - wa, fessel[1] + wa * 0.25]];
  const horn = o.horn || (o.weiss ? "#8a7a62" : "#2a2420");
  const hufD = eckig([kronV, [toe[0] + hh * 0.02, -hh * 0.06], [toe[0], 0], [heel[0] + hh * 0.1, 0], [heel[0] - hh * 0.04, -tr * 0.45], kronH, lerp(kronH, kronV, 0.5)]);
  let s = `<path d="${hufD}" fill="${horn}"/>`;
  if (fein) {
    /* Hornröhrchen (Längsstreifen parallel zur Wand), Glanz vorn, dunkler Boden, Kronrand mit Haar */
    let d = "";
    for (let i = 1; i < 6; i++) { const u = i / 6, a = lerp(kronV, kronH, u), b = lerp([toe[0], 0], [heel[0] + hh * 0.1, 0], u); d += eckig([lerp(a, b, 0.05), lerp(a, b, 0.95)], false); }
    s += `<path d="${d}" stroke="#000" stroke-opacity=".18" stroke-width="${Z(hh * 0.03)}" fill="none"/>`;
    s += `<path d="${eckig([lerp(kronV, [toe[0], 0], 0.1), lerp(kronV, [toe[0], 0], 0.85)], false)}" stroke="#fff" stroke-opacity=".28" stroke-width="${Z(hh * 0.08)}" stroke-linecap="round" fill="none" transform="translate(${Z(-hh * 0.08)} 0)"/>`;
    s += `<path d="${eckig([[toe[0] - hh * 0.05, -hh * 0.03], [heel[0] + hh * 0.12, -hh * 0.03]], false)}" stroke="#000" stroke-opacity=".45" stroke-width="${Z(hh * 0.07)}" fill="none"/>`;
  }
  /* Kronrand: Haarsaum fällt über den oberen Hufrand */
  let kd = "";
  const nH = fein ? 14 : 5;
  for (let i = 0; i < nH; i++) {
    const u = (i + 0.5) / nH, b = lerp(kronV, kronH, u), l = hh * (0.18 + T.rnd() * 0.12);
    kd += `M${Z(b[0] + l * 0.2)} ${Z(b[1] - l * 0.7)}l${Z(-l * 0.1)} ${Z(l)}`;
  }
  s += `<path d="${kd}" stroke="${o.kronHaar || "#3a2e24"}" stroke-width="${Z(hh * 0.07)}" stroke-linecap="round" fill="none" stroke-opacity=".8"/>`;
  return { pts, svg: s, boden: [heel[0], toe[0]], spitze: [toe[0], 0], kron: [kronV, kronH] };
}

/* =====================================================================
   T.klaue(fessel, spitze, breite, o) — Paarhufer (Rind, Ziege, Schaf, Hirsch, Antilope, Schwein)
   Zwei Hauptklauen: die äußere (nah) vorn, die innere leicht versetzt dahinter und dunkler; dunkler V-Spalt
   zwischen den Spitzen bis zum Kronrand; Afterklauen als kleine Hornkappen hinten an der Fessel, halb im Haar.
   o: { horn, kronHaar, afterklauen (true), spitz (Hirsch/Antilope: schlanker, spitzer) }
   ===================================================================== */
function klaue(T, fessel, spitze, breite, o = {}) {
  const fein = T.fein !== false, [wa, wb] = breite;
  const Lf = abst(fessel, spitze), hh = o.hoehe || Lf * (o.spitz ? 0.48 : 0.42);
  const wand = (o.wand || (o.spitz ? 55 : 48)) * Math.PI / 180;
  const toe = [spitze[0], 0], kronV = [toe[0] - Math.cos(wand) * hh / Math.sin(wand), -hh];
  const hl = hh * (o.spitz ? 1.15 : 1.35), heel = [toe[0] - hl, 0], kronH = [heel[0] + hh * 0.1, -hh * 0.55];
  const pts = [[fessel[0] + wb * 0.9, fessel[1] + wb * 0.3], lerp([fessel[0] + wb, fessel[1]], kronV, 0.5), kronV,
    [toe[0] - hh * 0.04, -hh * 0.2], [toe[0], 0, 1], [heel[0] + hh * 0.15, 0, 1], [heel[0] - hh * 0.12, -hh * 0.3],
    [kronH[0] - hh * 0.2, kronH[1] - hh * 0.2], [fessel[0] - wa, fessel[1] + wa * 0.3]];
  const horn = o.horn || "#24201c";
  /* innere Klaue: versetzt (nach vorn-oben 12 %), dunkler, nur der vordere Teil schaut heraus */
  const v = hh * 0.12;
  const innen = eckig([[kronV[0] + v, kronV[1] - v * 0.3], [toe[0] + v * 1.1, -hh * 0.18], [toe[0] + v * 0.7, -v * 0.15], [toe[0] - hh * 0.3, -hh * 0.06], [kronV[0] + v * 0.2, kronV[1] + hh * 0.3]]);
  let s = `<path d="${innen}" fill="${F.mischFarbe(horn, "#000", 0.35)}"/>`;
  const aussen = eckig([kronV, [toe[0] - hh * 0.04, -hh * 0.2], [toe[0], 0], [heel[0] + hh * 0.15, 0], [heel[0] - hh * 0.08, -hh * 0.28], kronH]);
  s += `<path d="${aussen}" fill="${horn}"/>`;
  /* V-Spalt: dunkle Kerbe zwischen den Klauen von der Spitze hinauf Richtung Kronrand */
  s += `<path d="${eckig([[toe[0] + v * 0.3, -hh * 0.02], [lerp(kronV, [toe[0], 0], 0.35)[0] + v * 0.5, lerp(kronV, [toe[0], 0], 0.35)[1]], [toe[0] - hh * 0.06, -hh * 0.22]])}" fill="#050403" fill-opacity=".85"/>`;
  if (fein) {
    s += `<path d="${eckig([lerp(kronV, [toe[0], 0], 0.12), lerp(kronV, [toe[0], 0], 0.8)], false)}" stroke="#fff" stroke-opacity=".25" stroke-width="${Z(hh * 0.07)}" stroke-linecap="round" fill="none" transform="translate(${Z(-hh * 0.1)} 0)"/>`;
    let d = "";
    for (let i = 1; i < 4; i++) { const u = i / 4, a = lerp(kronV, kronH, u), b = lerp([toe[0], 0], [heel[0] + hh * 0.15, 0], u); d += eckig([lerp(a, b, 0.1), lerp(a, b, 0.9)], false); }
    s += `<path d="${d}" stroke="#000" stroke-opacity=".2" stroke-width="${Z(hh * 0.03)}" fill="none"/>`;
  }
  /* Kronrand-Haar */
  let kd = "";
  for (let i = 0; i < (fein ? 10 : 4); i++) { const u = (i + 0.5) / (fein ? 10 : 4), b = lerp(kronV, kronH, u), l = hh * (0.16 + T.rnd() * 0.1); kd += `M${Z(b[0] + l * 0.15)} ${Z(b[1] - l * 0.7)}l${Z(-l * 0.1)} ${Z(l * 0.95)}`; }
  s += `<path d="${kd}" stroke="${o.kronHaar || "#2e261e"}" stroke-width="${Z(hh * 0.07)}" stroke-linecap="round" fill="none" stroke-opacity=".75"/>`;
  /* Afterklauen: hinten an der Fessel, halb im Haar, Spitze nach unten hinten */
  if (o.afterklauen !== false) {
    const ap = [fessel[0] - wa * 0.85, fessel[1] + wa * 0.6], g = hh * 0.32;
    s += `<path d="M${Z(ap[0])} ${Z(ap[1])}q${Z(-g * 0.6)} ${Z(g * 0.2)} ${Z(-g * 0.55)} ${Z(g * 0.85)}q${Z(g * 0.45)} ${Z(-g * 0.05)} ${Z(g * 0.8)} ${Z(-g * 0.45)}z" fill="${F.mischFarbe(horn, "#000", 0.2)}"/>`;
  }
  return { pts, svg: s, boden: [heel[0], toe[0]], spitze: [toe[0], 0], kron: [kronV, kronH] };
}

/* =====================================================================
   T.sohle(fessel, spitze, breite, o) — Sohlengänger: o.art = "baer" (fünf Zehen, lange gebogene Krallen vorn)
   oder "elefant" (rundes Sohlenkissen, Nägel am Vorderrand, Fuß als Säulenende).
   ===================================================================== */
function sohle(T, fessel, spitze, breite, o = {}) {
  const fein = T.fein !== false, [wa, wb] = breite;
  if (o.art === "elefant") {
    const r = Math.max(wa, wb), xm = fessel[0] + (spitze[0] - fessel[0]) * 0.3, h = -fessel[1];
    const pts = [[fessel[0] + wb, fessel[1]], [xm + r * 1.08, -h * 0.55], [xm + r * 1.12, -r * 0.12], [xm + r * 1.05, 0, 1], [xm - r * 1.0, 0, 1], [xm - r * 1.06, -r * 0.15], [fessel[0] - wa, fessel[1]]];
    let s = "";
    const n = o.naegel || 4, nag = "#d8ccb4";
    let d = "";
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, x = xm + r * (0.15 + 0.85 * u), y = -r * (0.08 + 0.05 * Math.sin(u * 3)), g = r * 0.22 * (1 - Math.abs(u - 0.6) * 0.5);
      d += `M${Z(x - g)} ${Z(y)}q${Z(g * 0.1)} ${Z(-g * 0.9)} ${Z(g)} ${Z(-g * 0.95)}q${Z(g * 0.9)} 0 ${Z(g)} ${Z(g * 0.95)}z`;
    }
    s += `<path d="${d}" fill="${nag}" stroke="#6a5e4c" stroke-width="${Z(r * 0.02)}" stroke-opacity=".6"/>`;
    s += `<path d="${eckig([[xm - r * 0.95, -r * 0.04], [xm + r * 1.0, -r * 0.04]], false)}" stroke="#000" stroke-opacity=".35" stroke-width="${Z(r * 0.06)}" fill="none"/>`;
    return { pts, svg: s, boden: [xm - r, xm + r], spitze: [xm + r, 0] };
  }
  /* Bär: Sohle flach am Boden von der Ferse bis zu den Zehen, Zehenwölbungen, Krallen vorn (lang, gebogen, hell-hornfarben) */
  const L = spitze[0] - fessel[0], H = Math.max(wb * 1.3, -fessel[1] * 0.9 + wb * 0.6);
  const P = (u, v) => [fessel[0] - wa * 0.6 + (L + wa * 0.6 + wb * 0.3) * u, -H * v];
  const pts = [[fessel[0] + wb, fessel[1]], P(0.55, 1.0), P(0.7, 0.92), P(0.82, 0.86), P(0.93, 0.72), P(1.0, 0.5), P(1.02, 0.2), [P(1.0, 0)[0], 0, 1], [P(0.02, 0)[0], 0, 1], P(-0.03, 0.35), [fessel[0] - wa, fessel[1] + wa * 0.3]];
  let s = "";
  const kr = o.kralle || "#cdbb9a", lang = o.krallenLang || (o.vorn ? 1.6 : 0.8);
  let d = "";
  const n = fein ? 5 : 3;
  for (let i = 0; i < n; i++) {
    const u = 0.78 + 0.22 * i / Math.max(1, n - 1), b = P(u, 0.62 - 0.12 * i / n), l = H * 0.55 * lang * (1 - 0.12 * Math.abs(i - 2)), w0 = H * 0.12;
    d += `M${Z(b[0])} ${Z(b[1] - w0)}q${Z(l * 0.75)} ${Z(-w0 * 0.2)} ${Z(l)} ${Z(Math.min(-b[1] + w0 * 0.3, l * 0.7))}q${Z(-l * 0.45)} ${Z(-l * 0.32)} ${Z(-l)} ${Z(-Math.min(-b[1] + w0 * 0.3, l * 0.7) + w0 * 1.6)}z`;
  }
  s += `<path d="${d}" fill="${kr}" stroke="#3a2e22" stroke-opacity=".5" stroke-width="${Z(H * 0.02)}"/>`;
  if (fein) {
    let fu = "";
    for (let i = 1; i < 4; i++) { const a = P(0.62 + i * 0.09, 0.9 - i * 0.06), b = P(0.6 + i * 0.09, 0.15); fu += `M${Z(a[0])} ${Z(a[1])}Q${Z(a[0] - H * 0.05)} ${Z((a[1] + b[1]) / 2)} ${Z(b[0])} ${Z(b[1])}`; }
    s += `<path d="${fu}" stroke="#120c08" stroke-opacity=".45" stroke-width="${Z(H * 0.05)}" fill="none" stroke-linecap="round"/>`;
    s += `<path d="${eckig([P(0.02, 0.04), P(0.98, 0.04)], false)}" stroke="#0e0a08" stroke-opacity=".6" stroke-width="${Z(H * 0.08)}" fill="none"/>`;
  }
  return { pts, svg: s, boden: [P(0, 0)[0], P(1, 0)[0]], spitze: [P(1, 0)[0], 0] };
}

/* =====================================================================
   T.vogelfuss(fessel, spitze, breite, o) und T.theropodenfuss(…)
   Zehen II–IV nach vorn (III am längsten, in der Mitte), Zehenpolster unten, Hornschilder oben, Krallen;
   Vogel: Hallux (I) nach hinten am Boden; Theropode: I klein, hoch innen hinten (ohne Bodenkontakt).
   o: { haut ("#c8a060"), schild ("#000"), kralle ("#2a2018"), zehen (3) }
   ===================================================================== */
function zehenFuss(T, fessel, spitze, breite, o = {}, theropode = false) {
  const fein = T.fein !== false, [wa, wb] = breite;
  const L = (spitze[0] - fessel[0]) * 1.25, h = -fessel[1], dicke = Math.max(wb, wa) * (theropode ? 1.1 : 0.9);
  /* Mittlere Zehe (III) als Umriss im Silhouettenfluss; II und IV werden als eigene Formen davor/dahinter gezeichnet */
  const tip = [fessel[0] + L, 0];
  const pts = [[fessel[0] + wb, fessel[1]], [fessel[0] + wb + L * 0.15, -Math.max(h * 0.45, dicke * 0.9)], [fessel[0] + L * 0.55, -dicke * 0.75], [fessel[0] + L * 0.85, -dicke * 0.55],
    [tip[0], -dicke * 0.3], [tip[0], 0, 1], [fessel[0] - wa * 0.4, 0, 1], [fessel[0] - wa * 1.1, -dicke * 0.5], [fessel[0] - wa, fessel[1] + wa * 0.3]];
  const haut = o.haut || "#9a8466", kr = o.kralle || "#231a12";
  let s = "";
  /* Zehe IV (fern, kürzer, dunkler) und II (nah, etwas kürzer, leicht nach unten versetzt) */
  const zehe = (dx, len, dy, farbe) => eckig([[fessel[0] + wb * 0.5, fessel[1] * 0.4 + dy], [fessel[0] + len * 0.5, -dicke * 0.7 + dy], [fessel[0] + len, -dicke * 0.35 + dy], [fessel[0] + len, dy], [fessel[0] + dx, dy]]);
  s += `<path d="${zehe(0, L * 0.82, 0, haut)}" fill="${F.mischFarbe(haut, "#000", 0.3)}"/>`;
  /* Krallen an II, III, IV (gebogen, mit Glanz) */
  const kralle = (x, y, g) => `M${Z(x)} ${Z(y - g * 0.5)}q${Z(g * 0.9)} ${Z(-g * 0.1)} ${Z(g * 1.3)} ${Z(g * 0.9 + (theropode ? g * 0.1 : 0))}q${Z(-g * 0.5)} ${Z(-g * 0.45)} ${Z(-g * 1.25)} ${Z(-g * 0.35)}z`;
  const g = dicke * (theropode ? 0.9 : 0.6);
  s += `<path d="${kralle(tip[0] - g * 0.2, -dicke * 0.2, g) + kralle(fessel[0] + L * 0.82 - g * 0.2, -dicke * 0.2, g * 0.85)}" fill="${kr}"/>`;
  if (fein) {
    /* Schilder (Scutae) auf den Zehen, Polsterfugen unten */
    let d = "";
    const nS = theropode ? 4 : 5;
    for (let i = 1; i < nS; i++) { const u = i / nS, x = fessel[0] + L * u * 0.95; d += `M${Z(x)} ${Z(-dicke * (0.78 - 0.4 * u))}q${Z(dicke * 0.08)} ${Z(dicke * 0.25)} 0 ${Z(dicke * 0.5)}`; }
    s += `<path d="${d}" stroke="${o.schild || "#000"}" stroke-opacity=".3" stroke-width="${Z(dicke * 0.05)}" fill="none"/>`;
    s += `<path d="${eckig([[fessel[0], -dicke * 0.04], [tip[0] - g * 0.4, -dicke * 0.04]], false)}" stroke="#000" stroke-opacity=".35" stroke-width="${Z(dicke * 0.1)}" fill="none"/>`;
  }
  /* Hallux / Afterzehe */
  if (theropode) {
    const ap = [fessel[0] - wa * 0.6, fessel[1] - h * 0.25];
    s += `<path d="M${Z(ap[0])} ${Z(ap[1])}q${Z(-g * 0.4)} ${Z(g * 0.3)} ${Z(-g * 0.2)} ${Z(g * 1.1)}q${Z(g * 0.35)} ${Z(-g * 0.3)} ${Z(g * 0.55)} ${Z(-g * 0.7)}z" fill="${kr}"/>`;
  } else {
    const hx = fessel[0] - wa * 0.9;
    s += `<path d="${eckig([[fessel[0] - wa * 0.2, -dicke * 0.6], [hx - L * 0.35, -dicke * 0.3], [hx - L * 0.38, 0], [fessel[0] - wa * 0.2, 0]])}" fill="${haut}"/>` +
      `<path d="${kralle(hx - L * 0.32, -dicke * 0.1, -g * 0.6)}" fill="${kr}"/>`;
  }
  return { pts, svg: s, boden: [fessel[0] - wa, tip[0]], spitze: tip };
}

/* =====================================================================
   T.hand(sk, wo, o) — Hand des Zweibeiners am freien Arm (FASSUNG 881 — Prüfer 880, Punkt 5: beim Theropoden wurde der
   Arm mit T.fuss als Bein bis zum Boden gezogen). Theropode: zwei (o.finger) kurze Finger mit gebogenen Krallen, nach
   innen/unten gehalten (keine „Hasenhände“); Vogel: keine Hand (Flügel – T.federn.schwinge). Liefert { pts: [], svg }.
   ===================================================================== */
function hand(T, sk, wo, o = {}) {
  if (sk.bauplan === "vogel") return { pts: [], svg: "", boden: null, spitze: null };
  const b = sk.beine[wo], p = b.p, W = sk.W, n = o.finger || 2, kr = o.kralle || "#2a2018", haut = o.haut || null;
  const a = p.handwurzel, e = p.fessel, [dx, dy] = norm(e[0] - a[0], e[1] - a[1]), L = Math.max(W * 0.05, abst(a, e) * 1.6);
  let s = "", kd = "";
  for (let i = 0; i < n; i++) {
    const ang = Math.atan2(dy, dx) + (i - (n - 1) / 2) * 0.35 + 0.25, l = L * (1 - 0.15 * i);
    const t = [e[0] + Math.cos(ang) * l, e[1] + Math.sin(ang) * l], m = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2];
    if (haut) s += `<path d="${glatt([e, m, t], false)}" stroke="${haut}" stroke-width="${Z(W * 0.016)}" stroke-linecap="round" fill="none"/>`;
    const g = W * 0.022;
    kd += `M${Z(t[0])} ${Z(t[1] - g * 0.4)}q${Z(g * 0.9)} ${Z(g * 0.1)} ${Z(g * 0.7)} ${Z(g * 1.3)}q${Z(-g * 0.5)} ${Z(-g * 0.6)} ${Z(-g * 0.9)} ${Z(-g * 0.7)}z`;
  }
  return { pts: [], svg: s + `<path d="${kd}" fill="${kr}"/>`, boden: null, spitze: null, hand: true };
}
/* =====================================================================
   T.flosse(fessel, spitze, breite, o) — Robbenflosse (FASSUNG 881 — vorher fiel gang „flosse“ STILL auf T.pfote zurück).
   Fächer von der Fessel zur Spitze: hinten (Standard) zwei längere Außenzehen mit Kerbe in der Mitte; vorn (o.vorn)
   Paddel mit fünf kleinen Krallen an den Zehenspitzen. Reihenfolge der pts wie bei den anderen Füßen (B-Seite → A-Seite).
   ===================================================================== */
function flosse(T, fessel, spitze, breite, o = {}) {
  const fein = T.fein !== false, [wa, wb] = breite, [dx, dy] = norm(spitze[0] - fessel[0], spitze[1] - fessel[1]), nx = -dy, ny = dx;
  const L = abst(fessel, spitze) * (o.lang || 1), Bw = Math.max(wa, wb) * (o.vorn ? 1.25 : 1.7);
  const P = (u, v) => [fessel[0] + dx * L * u + nx * Bw * v, fessel[1] + dy * L * u + ny * Bw * v];
  const pts = o.vorn ? [P(0.05, -0.75), P(0.55, -1.0), P(0.95, -0.75), P(1.02, 0), P(0.92, 0.7), P(0.5, 0.95), P(0.05, 0.75)]
    : [P(0.05, -0.7), P(0.6, -1.0), P(1.0, -1.05), P(0.86, -0.35), P(0.8, 0), P(0.86, 0.35), P(1.0, 1.05), P(0.6, 1.0), P(0.05, 0.7)];
  let s = "";
  const haut = o.haut || "#3a342e";
  if (fein) {
    /* Zehenstrahlen durch die Schwimmhaut */
    let d = "";
    for (let i = 0; i < 5; i++) { const v = -0.8 + i * 0.4, a = P(0.15, v * 0.6), e = P(o.vorn ? 0.95 : (Math.abs(v) > 0.5 ? 0.97 : 0.84), v * 0.95); d += `M${Z(a[0])} ${Z(a[1])}L${Z(e[0])} ${Z(e[1])}`; }
    s += `<path d="${d}" stroke="${haut}" stroke-opacity=".35" stroke-width="${Z(Bw * 0.06)}" fill="none" stroke-linecap="round"/>`;
  }
  if (o.vorn) {
    let k = "";
    for (let i = 0; i < 5; i++) { const v = -0.6 + i * 0.3, c = P(0.98 - Math.abs(v) * 0.08, v * 0.85), g = Bw * 0.09; k += `M${Z(c[0])} ${Z(c[1])}l${Z(dx * g * 2)} ${Z(dy * g * 2)}l${Z(nx * g)} ${Z(ny * g)}z`; }
    s += `<path d="${k}" fill="#1a140e" fill-opacity=".8"/>`;
  }
  return { pts, svg: s, boden: null, spitze: P(1, 0), achse: [P(0.55, -0.85), P(0.55, 0.85)] };
}

function installiere(T) {
  T.pfote = (fessel, spitze, breite, o) => pfote(T, fessel, spitze, breite, o);
  T.huf = (fessel, spitze, breite, o) => huf(T, fessel, spitze, breite, o);
  T.klaue = (fessel, spitze, breite, o) => klaue(T, fessel, spitze, breite, o);
  T.sohle = (fessel, spitze, breite, o) => sohle(T, fessel, spitze, breite, o);
  T.vogelfuss = (fessel, spitze, breite, o) => zehenFuss(T, fessel, spitze, breite, o, false);
  T.theropodenfuss = (fessel, spitze, breite, o) => zehenFuss(T, fessel, spitze, breite, o, true);
  T.hand = (sk, wo, o) => hand(T, sk, wo, o);
  T.flosse = (fessel, spitze, breite, o) => flosse(T, fessel, spitze, breite, o);
  /* Fuß passend zum Bein des Skeletts: T.fuss(sk, "vn", o) wählt nach Gangart.
     FASSUNG 881: kein stiller Rückfall auf die Pfote mehr – „flosse“ → T.flosse, Zweibeiner vorn → T.hand, Menschenaffe
     → Sohle mit Nägeln statt Bärenkrallen; unbekannte Gangart → Fehler. */
  T.fuss = (sk, wo, o = {}) => {
    const b = sk.beine[wo], br = (b.breiten && b.breiten.fessel) || [0.03, 0.03], W = sk.W, vorn = wo[0] === "v";
    if (sk.gang === "zwei" && vorn && !o.art) return T.hand(sk, wo, o);
    const args = [b.p.fessel, b.p.spitze, [br[0] * W, br[1] * W], o];
    const tab = { zehen: "pfote", spitze: (sk.bauplan === "pferd" ? "huf" : "klaue"), sohle: "sohle", saeule: "sohle", zwei: (sk.bauplan === "vogel" ? "vogelfuss" : "theropodenfuss"), flosse: "flosse" };
    const art = o.art || tab[sk.gang];
    if (!art || !T[art]) throw new Error("T.fuss: keine Fußvorlage für Gangart „" + sk.gang + "“ (bekannt: " + Object.keys(tab).join(", ") + ")");
    if (sk.gang === "saeule") args[3] = Object.assign({ art: "elefant" }, o);
    if (sk.gang === "flosse") args[3] = Object.assign({ vorn }, o);
    if (sk.bauplan === "primat") args[3] = Object.assign({ kralle: "#4a4038", krallenLang: 0.22, vorn }, o);
    return T[art](...args);
  };
  return T;
}

module.exports = { installiere, pfote, huf, klaue, sohle, zehenFuss, hand, flosse };
