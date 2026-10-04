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
   o: { zehen (3 sichtbare Wölbungen), krallen ("#1a140e" | null = eingezogen/Katze), ballen ("#151110"),
        licht ("#fff"), fell (Farbe der Fellbüschel über den Zehen), afterkralle: true (Vorderpfote innen, hinter dem Bein),
        lang (Faktor Pfotenlänge), op (Deckkraft bei fernen Pfoten) }
   ===================================================================== */
function pfote(T, fessel, spitze, breite, o = {}) {
  const fein = T.fein !== false, [wa, wb] = breite, op = o.op || 1;
  const h = -fessel[1];                                    // Höhe des Zehengrundgelenks
  const L = (spitze[0] - fessel[0]) * (o.lang || 1) + wb * 0.5;
  const x0 = fessel[0] - wa * 1.05, xs = fessel[0] + L + wb * 0.15;     // Ballen hinten … Zehenspitze vorn
  const H = Math.max(h * 1.15, wb * 1.6);                    // Pfotenhöhe an den Zehen
  /* Seitenansicht (Hund/Wolf): zwei Zehenknöchel sichtbar – vorn Zehe IV (davor verdeckt III), dahinter, etwas tiefer,
     die äußere Zehe V; die Zehen sind gewölbt (Knöchel oben, Spitze fällt zum Boden), die Ballen liegen UNTER der Pfote
     (man sieht nur einen dunklen Saum am Boden), die Krallen kommen vorn aus dem Fell und stoßen schräg in den Boden. */
  const k = [[0.34, 0.9], [0.7, 0.98]];                    // [Anteil der Länge ab Fessel, Höhe des Knöchels]
  const P = (u, v) => [fessel[0] + (xs - fessel[0]) * u, -H * v];
  const pts = [[fessel[0] + wb, fessel[1] - wb * 0.3]];
  pts.push(P(k[0][0] - 0.1, k[0][1] * 0.98), P(k[0][0] + 0.02, k[0][1]), P(k[0][0] + 0.15, k[0][1] - 0.16));   // Zehe V
  pts.push(P(k[1][0] - 0.08, k[1][1] * 0.97), P(k[1][0] + 0.04, k[1][1] * 0.94), P(0.96, 0.62), P(1.02, 0.3));    // Zehe IV
  pts.push([xs - (xs - fessel[0]) * 0.03, -H * 0.04]);       // Zehenballen vorn, knapp über dem Boden gerundet
  pts.push([x0 + wa * 0.4, 0, 1]);                           // Mittelhandballen hinten am Boden
  pts.push([x0 - wa * 0.02, -H * 0.36], [x0 + wa * 0.18, -H * 0.84], [fessel[0] - wa, fessel[1] + wa * 0.1]);
  let s = "";
  const kr = o.krallen === undefined ? "#16110c" : o.krallen;
  /* Krallen: kurz, dick, stumpf – aus dem Fell vorn an der Zehe, schräg nach vorn unten bis in den Boden */
  const kralle = (u, gr) => {
    const [bx, by] = P(u, 0.36), Lk = H * 0.42 * gr, w0 = H * 0.13 * gr;
    return `M${Z(bx - w0 * 0.2)} ${Z(by - w0)}q${Z(Lk * 0.55)} ${Z(w0 * 0.1)} ${Z(Lk * 0.8)} ${Z(-by + H * 0.01 + w0)}l${Z(-w0 * 0.9)} ${Z(-H * 0.01)}q${Z(-Lk * 0.08)} ${Z(-Lk * 0.35)} ${Z(-Lk * 0.55)} ${Z(by + w0 * 0.2 - H * 0.0)}z`;
  };
  if (kr) {
    s += `<path d="${kralle(0.97, 1) + kralle(k[0][0] + 0.17, 0.8)}" fill="${kr}" fill-opacity="${op2(op)}"/>`;
    if (fein && !o.fern) s += `<path d="M${Z(P(0.97, 0.36)[0] + H * 0.04)} ${Z(P(0.97, 0.36)[1] - H * 0.06)}q${Z(H * 0.16)} ${Z(H * 0.01)} ${Z(H * 0.24)} ${Z(H * 0.2)}" stroke="${o.licht || "#fff"}" stroke-width="${Z(H * 0.035)}" fill="none" stroke-opacity="${op2(0.4 * op)}" stroke-linecap="round"/>`;
  }
  /* Sohlensaum: die Ballen tragen – ein flacher dunkler Saum am Boden (keine Einzel-„Kissen“ nebeneinander) */
  const XL = xs - fessel[0], bal = o.ballen || "#16110e";
  const saum = `M${Z(x0 + wa * 0.35)} 0Q${Z(x0 + wa * 0.3)} ${Z(-H * 0.12)} ${Z(fessel[0])} ${Z(-H * 0.1)}Q${Z(fessel[0] + XL * 0.55)} ${Z(-H * 0.07)} ${Z(fessel[0] + XL * 0.97)} ${Z(-H * 0.05)}L${Z(fessel[0] + XL * 0.97)} 0z`;
  s += `<path d="${saum}" fill="${bal}" fill-opacity="${op2((fein ? 0.55 : 0.45) * op)}"/>`;
  if (!fein || o.fern) return { pts, svg: s, boden: [x0, xs], spitze: [xs, 0] };
  /* Zehenfuge zwischen V und IV: weiche dunkle Kerbe von oben bis knapp über den Boden */
  const fa = P(k[0][0] + 0.17, k[0][1] - 0.2), fb = P(k[0][0] + 0.13, 0.14);
  s += `<path d="M${Z(fa[0])} ${Z(fa[1])}Q${Z(fa[0] - XL * 0.05)} ${Z((fa[1] + fb[1]) / 2)} ${Z(fb[0])} ${Z(fb[1])}" stroke="#1a120a" stroke-width="${Z(H * 0.08)}" fill="none" stroke-opacity="${op2(0.42 * op)}" stroke-linecap="round"/>`;
  /* Licht auf den Knöcheln (von links oben) und Schatten unter der Zehenwölbung */
  const lt = (u, v) => { const a = P(u - 0.1, v * 0.9), b = P(u + 0.05, v * 0.94); return `M${Z(a[0])} ${Z(a[1])}Q${Z((a[0] + b[0]) / 2)} ${Z(a[1] - H * 0.09)} ${Z(b[0])} ${Z(b[1])}`; };
  s += `<path d="${lt(k[0][0], k[0][1]) + lt(k[1][0], k[1][1])}" stroke="${o.licht || "#fff"}" stroke-width="${Z(H * 0.1)}" fill="none" stroke-opacity="${op2(0.2 * op)}" stroke-linecap="round"/>`;
  s += `<path d="M${Z(P(0.05, 0.2)[0])} ${Z(-H * 0.2)}Q${Z(P(0.5, 0.3)[0])} ${Z(-H * 0.3)} ${Z(P(0.95, 0.22)[0])} ${Z(-H * 0.2)}" stroke="#1a120a" stroke-width="${Z(H * 0.16)}" fill="none" stroke-opacity="${op2(0.16 * op)}" stroke-linecap="round"/>`;
  /* Fellbüschel über den Zehen: Haare fallen über die Zehenwurzeln (Farbe des Laufs, wenig Kontrast) */
  if (o.fell) {
    let d = "";
    for (let i = 0; i < 8; i++) {
      const u = 0.08 + i * 0.11, b = P(u, (u < 0.52 ? k[0][1] : k[1][1]) * 0.96 + 0.04), l = H * (0.28 + T.rnd() * 0.22);
      d += `M${Z(b[0] - l * 0.45)} ${Z(b[1] - l * 0.45)}q${Z(l * 0.3)} ${Z(l * 0.2)} ${Z(l * 0.6)} ${Z(l * 0.7)}`;
    }
    s += `<path d="${d}" stroke="${o.fell}" stroke-width="${Z(H * 0.045)}" fill="none" stroke-opacity="${op2(0.45 * op)}" stroke-linecap="round"/>`;
  }
  /* Afterkralle (Daumenkralle) innen am Vordermittelfuß – schaut hinten als kleiner Sporn knapp hervor */
  if (o.afterkralle) {
    const ax = fessel[0] - wa * 0.98, ay = fessel[1] - H * 0.75;
    s += `<path d="M${Z(ax)} ${Z(ay)}q${Z(-H * 0.12)} ${Z(H * 0.06)} ${Z(-H * 0.1)} ${Z(H * 0.26)}q${Z(H * 0.06)} ${Z(-H * 0.06)} ${Z(H * 0.13)} ${Z(-H * 0.15)}z" fill="${kr || "#16110c"}" fill-opacity="${op2(0.6 * op)}"/>`;
  }
  return { pts, svg: s, boden: [x0, xs], spitze: [xs, 0] };
}

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

function installiere(T) {
  T.pfote = (fessel, spitze, breite, o) => pfote(T, fessel, spitze, breite, o);
  T.huf = (fessel, spitze, breite, o) => huf(T, fessel, spitze, breite, o);
  T.klaue = (fessel, spitze, breite, o) => klaue(T, fessel, spitze, breite, o);
  T.sohle = (fessel, spitze, breite, o) => sohle(T, fessel, spitze, breite, o);
  T.vogelfuss = (fessel, spitze, breite, o) => zehenFuss(T, fessel, spitze, breite, o, false);
  T.theropodenfuss = (fessel, spitze, breite, o) => zehenFuss(T, fessel, spitze, breite, o, true);
  /* Fuß passend zum Bein des Skeletts: T.fuss(sk, "vn", o) wählt nach Gangart */
  T.fuss = (sk, wo, o = {}) => {
    const b = sk.beine[wo], br = (b.breiten && b.breiten.fessel) || [0.03, 0.03], W = sk.W;
    const args = [b.p.fessel, b.p.spitze, [br[0] * W, br[1] * W], o];
    const art = o.art || ({ zehen: "pfote", spitze: (sk.bauplan === "pferd" ? "huf" : "klaue"), sohle: "sohle", saeule: "sohle", zwei: (sk.bauplan === "vogel" ? "vogelfuss" : "theropodenfuss") })[sk.gang] || "pfote";
    if (sk.gang === "saeule") args[3] = Object.assign({ art: "elefant" }, o);
    return T[art](...args);
  };
  return T;
}

module.exports = { installiere, pfote, huf, klaue, sohle, zehenFuss };
