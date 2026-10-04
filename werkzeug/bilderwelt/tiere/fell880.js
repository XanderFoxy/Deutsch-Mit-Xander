/* =====================================================================
   TIER-BIBLIOTHEK — FELL UND FEDERN (FASSUNG 880 — W5, W9)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „… jedes einzelne Haar … Fellstruktur … alles mit Licht und Schatten
   realistisch plastisch massiv“.

   FASSUNG 880 — Warum: Kritiken (Fell im Mittel 4,2): „gleich lange Striche gleichmäßig gestreut → Kratzer“,
   „Reiskörner ohne Wuchsrichtung“, „keine Strähnen, kein Konturfell“. Jetzt:
   - T.fluss(sil): Wuchsrichtungsfeld aus dem Skelett (Nase → Schädel → Nacken → Rücken → Schwanz; Flanke nach hinten
     unten; Beine nach unten; Wirbel an Brust/Schulter und Kniefalte).
   - T.fell(sil, o): Haare in STRÄHNEN (3–7, heller Kopf, dunkle Kerbe auf der Schattenseite), Länge je Zone, Farbe an
     T.licht gekoppelt (Lichthaare nur über dem Terminator, Unterwolle im Schatten), Konturfell (Haarspitzen über den
     Umriss), Anzahl nach Budget (fein ≤ 70 KB, Szene ≤ 25 KB je Art).
   - T.federn: Federfluren als überlappende Reihen (Licht oben, Schattenfuge unten), Schwungfedern gestaffelt.
   ===================================================================== */
"use strict";
const F = require("./form880");
const { lerp, abst, norm, inPoly, box, op2, LICHT } = F;
const RAD = Math.PI / 180;
const G = (v) => Math.round(v * 10);
/* Pfad in Zehntel-cm; Teilpfade beginnen relativ (m) zum vorigen Endpunkt – kleinere Zahlen, ~10 % weniger Bytes */
function relativ(d) {
  let out = "", cx = 0, cy = 0, erst = true;
  for (const teil of d.split("M")) {
    if (!teil) continue;
    const m = teil.match(/^(-?\d+) (-?\d+)(.*)$/);
    if (!m) { out += "M" + teil; continue; }
    const x = +m[1], y = +m[2], rest = m[3];
    out += erst ? `M${x} ${y}${rest}` : `m${x - cx} ${y - cy}${rest}`;
    erst = false;
    if (rest.endsWith("z")) { cx = x; cy = y; continue; }
    /* offener Strich: Endpunkt = Start + Summe der letzten relativen Q-Kurve (q c e: zählt nur e) */
    const q = rest.match(/q(-?\d+) (-?\d+) (-?\d+) (-?\d+)$/);
    if (q) { cx = x + +q[3]; cy = y + +q[4]; } else { cx = x; cy = y; }
  }
  return out;
}
const fein10 = (d, attr) => `<path transform="scale(.1)" d="${relativ(d).replace(/ -/g, "-")}" ${attr}/>`;

/* =====================================================================
   T.fluss(sil, o) → (x, y) ↦ Wuchsrichtung in Grad (0 = vorn/rechts, 90 = unten, 180 = hinten/links)
   o: { flanke (Grad Drehung nach unten am Bauch, 50), wirbel: [[x, y, r, art]] zusätzlich, beine (Grad Neigung, 4) }
   ===================================================================== */
function fluss(T, sil, o = {}) {
  const sk = sil.sk, W = sil.W, achsen = sil.achsen;
  const flanke = o.flanke != null ? o.flanke : 50;
  const wirbel = (o.wirbel || []).slice();
  if (sk && o.standardWirbel !== false) {
    const bs = sk.beine.vn.extra.bugspitze, ks = sk.beine.hn.extra.kniescheibe;
    wirbel.push([bs[0] - W * 0.02, bs[1] + W * 0.03, W * 0.11, "brust"]);
    wirbel.push([ks[0] + W * 0.03, ks[1] - W * 0.08, W * 0.07, "knie"]);
  }
  const ang = (dx, dy) => Math.atan2(dy, dx) / RAD;
  const mischW = (a, b, t) => { let d = ((b - a + 540) % 360) - 180; return a + d * t; };
  return (x, y) => {
    let a = null;
    for (const ax of achsen) {
      const n = ax.A.length;
      for (let i = 0; i < n - 1 && a === null; i++) {
        const q = [ax.A[i], ax.A[i + 1], ax.B[i + 1], ax.B[i]];
        if (!inPoly(x, y, q)) continue;
        const A = lerp(ax.A[i], ax.A[i + 1], 0.5), B = lerp(ax.B[i], ax.B[i + 1], 0.5);
        const ux = B[0] - A[0], uy = B[1] - A[1], L2 = ux * ux + uy * uy || 1;
        const t = Math.max(0, Math.min(1, ((x - A[0]) * ux + (y - A[1]) * uy) / L2));
        const vor = [ax.A[i + 1][0] - ax.A[i][0] + ax.B[i + 1][0] - ax.B[i][0], ax.A[i + 1][1] - ax.A[i][1] + ax.B[i + 1][1] - ax.B[i][1]];
        if (ax.art === "glied") a = ang(vor[0], vor[1]) + (o.beine != null ? o.beine : 4);
        else if (ax.art === "schwanz") a = ang(vor[0], vor[1]);
        else {
          /* Rumpf/Kopf: Haar wächst nach HINTEN (gegen die Achse), zur Unterseite nach hinten unten gedreht */
          const zur = ang(-vor[0], -vor[1]), unten = ang(ux, uy);
          a = mischW(zur, unten, Math.min(0.75, (flanke / 90) * t * t * 1.6 + (ax.art === "kopf" ? 0.1 * t : 0)));
        }
      }
      if (a !== null) break;
    }
    if (a === null) a = 135;
    for (const [wx, wy, wr, art] of wirbel) {
      const d = Math.hypot(x - wx, y - wy);
      if (d > wr) continue;
      const k = 1 - d / wr, rad = ang(x - wx, y - wy);
      const ziel = art === "brust" ? mischW(rad, 100, 0.45) : art === "knie" ? mischW(rad, 200, 0.3) : rad;
      a = mischW(a, ziel, k * k * (3 - 2 * k));
    }
    return a;
  };
}

/* gleichmäßig gestreute Punkte (gezittertes Raster) im Vieleck */
function streu(T, pts, abstand, test) {
  const [x0, y0, x1, y1] = box(pts), out = [];
  for (let y = y0; y < y1; y += abstand) for (let x = x0; x < x1; x += abstand) {
    const px = x + T.rnd() * abstand, py = y + T.rnd() * abstand;
    if (inPoly(px, py, pts) && (!test || test(px, py))) out.push([px, py]);
  }
  /* Reihenfolge mischen (überlappende Strähnen sonst in Zeilen geordnet) */
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(T.rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
/* Spindel (Strähne) von r (Wurzel) über m (Biegung) zur Spitze e, größte halbe Breite ≈ w, Normale n.
   FASSUNG 881 — Prüfer 880, Punkt 13: die Strähnen waren gerade Balken mit stumpfem Ende (Wurzel volle Breite) und
   wirkten aus der Nähe wie Kratzer. Jetzt läuft die Strähne an BEIDEN Enden spitz aus (Breite → 0): zwei Bögen von
   der Wurzel zur Spitze, die Steuerpunkte zu beiden Seiten der gemeinsamen Biegung – ein schlankes, gebogenes Blatt. */
function spindel(r, m, e, w, n) {
  const c1 = [m[0] + n[0] * w * 2, m[1] + n[1] * w * 2], c2 = [m[0] - n[0] * w * 2, m[1] - n[1] * w * 2];
  const X = G(r[0]), Y = G(r[1]), EX = G(e[0]) - X, EY = G(e[1]) - Y;
  return `M${X} ${Y}q${G(c1[0]) - X} ${G(c1[1]) - Y} ${EX} ${EY}q${G(c2[0]) - G(e[0])} ${G(c2[1]) - G(e[1])} ${-EX} ${-EY}z`;
}

/* =====================================================================
   T.fell(sil, o)
   o: { fluss (Funktion, Standard T.fluss(sil)), hell (Funktion −1…+1 aus T.licht, Standard 0),
        zonen: [{ pts (Vieleck; Standard ganzer Umriss), laenge (cm), dichte (Büschel je 100 cm²), breite (halbe
                  Strähnenbreite, cm), straehnen: [min, max], hell: [farbe, deckkraft], dunkel: [farbe, deckkraft],
                  unterwolle: [farbe, deckkraft] (im Schatten), grannen: [farbe, deckkraft, anteil] (dunkle Spitzen),
                  streu (Grad), kruemmung }],
        kanten: [{ pts (Linie auf dem Umriss, im Uhrzeigersinn), laenge, abstand, farbe, op, breite, raus (0–1) }],
        aus: [Vielecke ohne Fell (Auge, Nase)], szene (Anteil bei T.fein = false, 0,16) }
   ===================================================================== */
function fell(T, sil, o = {}) {
  const fein = T.fein !== false, fl = o.fluss || fluss(T, sil), hellF = o.hell || (() => 0);
  const anteil = fein ? 1 : (o.szene != null ? o.szene : 0.1);
  const aus = o.aus || [];
  const imUmriss = (x, y) => inPoly(x, y, sil.pts) && !aus.some((p) => inPoly(x, y, p));
  /* Eimer je Farbe/Deckkraft/Art: wenige Pfade, auch bei tausend Haaren */
  const eimer = new Map();
  const leg = (art, farbe, op, w, d) => { const k = art + "|" + farbe + "|" + op2(op) + "|" + w; eimer.set(k, (eimer.get(k) || "") + d); };
  const stufe = (v) => Math.round(Math.max(0, Math.min(1, v)) * 5) / 5;   // Deckkraft in 6 Stufen
  const breiteStufe = (v) => Math.max(1, Math.round(v * 20)) / 20;         // Strichbreite in 0,05 cm
  /* dünnes Haar als Strich (Q-Kurve, relativ in 0,1 cm): billig; ab 0,15 cm halber Breite als spitze Spindel */
  const haar = (r, m, e) => { const X = G(r[0]), Y = G(r[1]); return `M${X} ${Y}q${G(m[0]) - X} ${G(m[1]) - Y} ${G(e[0]) - X} ${G(e[1]) - Y}`; };
  for (const z of (o.zonen || [])) {
    const pts = z.pts || sil.pts, L0 = z.laenge || 3, w0 = z.breite || L0 * 0.04;
    const strich = z.strich != null ? z.strich : w0 < 0.15;
    const dichte = (z.dichte || 8) * (fein ? 1 : (z.szene != null ? z.szene : anteil));
    if (dichte <= 0) continue;
    const abstand = Math.sqrt(100 / dichte);
    const wurzeln = streu(T, pts, abstand, imUmriss);
    const [mn, mx] = z.straehnen || [3, 5];
    for (const r of wurzeln) {
      const a0 = (fl(r[0], r[1]) + (T.rnd() - 0.5) * (z.streu != null ? z.streu : 14)) * RAD;
      const L = L0 * (0.65 + T.rnd() * 0.7);
      const p1 = [r[0] + Math.cos(a0) * L * 0.5, r[1] + Math.sin(a0) * L * 0.5];
      const a1 = (fl(p1[0], p1[1]) + (T.rnd() - 0.5) * 8) * RAD;
      const kr = (z.kruemmung != null ? z.kruemmung : 0.22) * (T.rnd() - 0.5) * 2;
      const e = [p1[0] + Math.cos(a1 + kr) * L * 0.5, p1[1] + Math.sin(a1 + kr) * L * 0.5];
      const [dx, dy] = norm(e[0] - r[0], e[1] - r[1]);
      let n = [-dy, dx];
      /* Lichtseite der Gruppe: zum Licht hin; die Kerbe liegt auf der Schattenseite */
      const zumLicht = n[0] * LICHT[0] + n[1] * LICHT[1] > 0 ? 1 : -1;
      n = [n[0] * zumLicht, n[1] * zumLicht];
      const v = hellF(r[0], r[1]);                           // −1 (Kernschatten) … +1 (Glanz)
      const m = fein ? mn + Math.floor(T.rnd() * (mx - mn + 1)) : Math.max(1, mn - 1);
      const w = w0 * (0.8 + T.rnd() * 0.4);
      const mid = p1;
      /* dunkle Kerbe: auf der Schattenseite der Gruppe, etwas länger (trennt die Büschel) */
      if (z.dunkel) {
        const off = w * (m * 0.6 + 0.8);
        const rk = [r[0] - n[0] * off + dx * L * 0.1, r[1] - n[1] * off + dy * L * 0.1], ek = [e[0] - n[0] * off * 0.4 + dx * L * 0.08, e[1] - n[1] * off * 0.4 + dy * L * 0.08];
        const mk = [mid[0] - n[0] * off * 0.8, mid[1] - n[1] * off * 0.8];
        const opK = z.dunkel[1] * (v < -0.2 ? 0.75 : 1);
        if (strich) leg("s", z.dunkel[0], stufe(opK), breiteStufe(w * 1.6), haar(rk, mk, ek));
        else leg("f", z.dunkel[0], stufe(opK), 0, spindel(rk, mk, ek, w * 0.7, n));
      }
      /* Büschel (FASSUNG 881): m Haare mit GEMEINSAMER Richtung und Biegung, Wurzeln dicht nebeneinander, die mittleren
         am längsten, leicht gefächert – statt einzelner gerader Balken (heller Kopf über dem Terminator, Unterwolle im
         Schatten) */
      const licht = v > -0.25;
      const farbe = licht ? z.hell : (z.unterwolle || z.dunkel);
      if (!farbe) continue;
      const op = licht ? farbe[1] * Math.max(0.3, Math.min(1.2, 0.6 + v * 0.65)) : farbe[1] * 0.8;
      let d = "";
      const bog = [mid[0] - (r[0] + e[0]) / 2, mid[1] - (r[1] + e[1]) / 2];
      for (let j = 0; j < m; j++) {
        const u = m > 1 ? (j / (m - 1) - 0.5) : 0, lf = 0.72 + 0.28 * (1 - Math.abs(u) * 2) + (T.rnd() - 0.5) * 0.12;
        const rr = [r[0] + n[0] * u * w * m * 0.9, r[1] + n[1] * u * w * m * 0.9];
        const ee = [rr[0] + (e[0] - r[0]) * lf + n[0] * u * w * m * 0.45, rr[1] + (e[1] - r[1]) * lf + n[1] * u * w * m * 0.45];
        const mm = [(rr[0] + ee[0]) / 2 + bog[0] * lf, (rr[1] + ee[1]) / 2 + bog[1] * lf];
        d += strich ? haar(rr, mm, ee) : spindel(rr, mm, ee, w * (Math.abs(u) < 0.2 ? 0.6 : 0.45), n);
      }
      if (strich) leg("s", farbe[0], stufe(op), breiteStufe(w * 1.2), d); else leg("f", farbe[0], stufe(op), 0, d);
      /* Grannen: dunkle Haarspitzen (z. B. Wolfssattel) – FASSUNG 881: gebogen wie der Büschel und spitz auslaufend
         (vorher gerade gleich breite Striche = dunkle „Kratzer“) */
      if (z.grannen && fein && T.rnd() < (z.grannen[2] || 0.5)) {
        const g0 = lerp(r, e, 0.45), g1 = [e[0] + dx * L * 0.08, e[1] + dy * L * 0.08], gm = [(g0[0] + g1[0]) / 2 + bog[0] * 0.5, (g0[1] + g1[1]) / 2 + bog[1] * 0.5];
        leg("f", z.grannen[0], stufe(z.grannen[1]), 0, spindel(g0, gm, g1, Math.max(0.05, w * 0.7), n));
      }
    }
  }
  /* Konturfell: Haarbüschel an Umrisskanten, Spitzen über den Umriss hinaus (dünn: Striche, breit: Spindeln) */
  for (const k of (o.kanten || [])) {
    const pl = k.pts, abstand = (k.abstand || 1.2) / (fein ? 1 : Math.max(0.25, anteil * 2.2)), L0 = k.laenge || 2.5;
    let gesamt = 0;
    for (let i = 1; i < pl.length; i++) gesamt += abst(pl[i - 1], pl[i]);
    const n = Math.max(1, Math.floor(gesamt / abstand));
    const bw = k.breite || L0 * 0.05, strich = k.strich != null ? k.strich : bw < 0.15;
    let d = "";
    let seg = 0, s0 = 0;
    for (let i = 0; i < n; i++) {
      const s = (i + 0.3 + T.rnd() * 0.4) * gesamt / n;
      while (seg < pl.length - 2 && s0 + abst(pl[seg], pl[seg + 1]) < s) { s0 += abst(pl[seg], pl[seg + 1]); seg++; }
      const a = pl[seg], b = pl[seg + 1], t = Math.min(1, Math.max(0, (s - s0) / (abst(a, b) || 1)));
      const p = lerp(a, b, t), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), aussen = [ty, -tx];
      const fa = fl(p[0] - aussen[0] * 0.5, p[1] - aussen[1] * 0.5) * RAD, fd = [Math.cos(fa), Math.sin(fa)];
      const raus = k.raus != null ? k.raus : 0.3;
      const m = fein ? 2 + Math.floor(T.rnd() * 3) : 2;
      for (let j = 0; j < m; j++) {
        const L = L0 * (0.5 + T.rnd() * 0.75);
        const dir = norm(fd[0] * (1 - raus) + aussen[0] * raus + (T.rnd() - 0.5) * 0.3, fd[1] * (1 - raus) + aussen[1] * raus + (T.rnd() - 0.5) * 0.3);
        const r0 = [p[0] - aussen[0] * L * 0.3 + tx * (T.rnd() - 0.5) * abstand * 0.6, p[1] - aussen[1] * L * 0.3 + ty * (T.rnd() - 0.5) * abstand * 0.6];
        const e = [r0[0] + dir[0] * L, r0[1] + dir[1] * L], mid = [r0[0] + dir[0] * L * 0.5 + fd[0] * L * 0.08, r0[1] + dir[1] * L * 0.5 + fd[1] * L * 0.08];
        d += strich ? haar(r0, mid, e) : spindel(r0, mid, e, bw * (0.7 + T.rnd() * 0.5), [-dir[1], dir[0]]);
      }
    }
    leg(strich ? "s" : "f", k.farbe || "#000", k.op != null ? k.op : 0.7, strich ? breiteStufe(bw * 1.4) : 0, d);
  }
  let s = "";
  for (const [k, d] of eimer) {
    if (!d) continue;
    const [art, farbe, op, w] = k.split("|");
    s += art === "s" ? fein10(d, `fill="none" stroke="${farbe}" stroke-width="${Math.round(Number(w) * 10 * 10) / 10}"${op !== "1" ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round"`)
      : fein10(d, `fill="${farbe}"${op !== "1" ? ` fill-opacity="${op}"` : ""}`);
  }
  return s;
}

/* =====================================================================
   T.unterhaar(zonen) — dichtes kurzes Haar als KACHELMUSTER (nur Großbild; Szene: "")
   Strähnen (T.fell) allein lassen den glatten Verlauf dazwischen sehen („Pinselstriche auf Airbrush“). Darunter liegt
   jetzt ein feines, dichtes Haarkleid: je Zone zwei überlagerte Kacheln verschiedener Größe (Seitenverhältnis 1 : 1,34),
   damit sich keine Wiederholung zeigt; Striche über den Kachelrand werden umlaufend fortgesetzt (keine Kachelnaht).
   Die Kachel wird per patternTransform in die Wuchsrichtung gedreht – gleiche Kacheln werden zwischen Zonen geteilt.
   zonen: [{ pts (Vieleck), winkel (Wuchsrichtung in Grad, 180 = nach hinten, 90 = nach unten), kachel (cm, 5,5),
             dichte (Haare je cm², 1,1), laenge (cm, 1,6), streu (Grad, 34), hell: [farbe, op], dunkel: [farbe, op],
             einfach: true (nur EINE Kachel, für kleine Zonen) }]
   ===================================================================== */
function unterhaar(T, zonen) {
  if (T.fein === false) return "";
  T._uhCache = T._uhCache || new Map();
  const R = (v) => Math.round(v * 10);
  const kachel = (S, n, L0, streu, dreh, hell, dunkel) => {
    const key = [S, n, L0, streu, dreh, hell.join(), dunkel.join()].join("|");
    if (T._uhCache.has(key)) return T._uhCache.get(key);
    let dh = "", dd = "";
    for (let i = 0; i < n; i++) {
      const x = T.rnd() * S, y = T.rnd() * S, a = (180 + (T.rnd() - 0.5) * streu) * RAD, l = L0 * (0.55 + T.rnd()), k = (T.rnd() - 0.5) * 0.4 * L0;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        const x0 = x + ox, y0 = y + oy, x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l;
        if (Math.max(x0, x1) < 0 || Math.min(x0, x1) > S || Math.max(y0, y1) < 0 || Math.min(y0, y1) > S) continue;
        const mx = (x0 + x1) / 2 - Math.sin(a) * k, my = (y0 + y1) / 2 + Math.cos(a) * k;
        const d = `M${R(x0)} ${R(y0)}q${R(mx) - R(x0)} ${R(my) - R(y0)} ${R(x1) - R(x0)} ${R(y1) - R(y0)}`;
        if (i % 2) dh += d; else dd += d;
      }
    }
    const id = T.id("uh" + (T._uh = (T._uh || 0) + 1));
    T.def(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${S}" height="${S}"${dreh ? ` patternTransform="rotate(${dreh})"` : ""}>` +
      `<g transform="scale(.1)" fill="none" stroke-linecap="round" stroke-width=".7"><path d="${dh.replace(/ -/g, "-")}" stroke="${hell[0]}" stroke-opacity="${op2(hell[1])}"/>` +
      `<path d="${dd.replace(/ -/g, "-")}" stroke="${dunkel[0]}" stroke-opacity="${op2(dunkel[1])}"/></g></pattern>`);
    T._uhCache.set(key, `url(#${id})`);
    return `url(#${id})`;
  };
  let s = "";
  for (const z of zonen) {
    const S = z.kachel || 5.5, di = z.dichte || 1.1, L0 = z.laenge || 1.6, streu = z.streu != null ? z.streu : 34;
    const dreh = Math.round((z.winkel != null ? z.winkel : 180) - 180), hell = z.hell || ["#f4ecdc", 0.2], dunkel = z.dunkel || ["#14100c", 0.18];
    const b = box(z.pts), re = `x="${Math.floor(b[0])}" y="${Math.floor(b[1])}" width="${Math.ceil(b[2] - b[0]) + 1}" height="${Math.ceil(b[3] - b[1]) + 1}"`;
    const cid = T.id("uhc" + (T._uhc = (T._uhc || 0) + 1));
    T.def(`<clipPath id="${cid}"><path d="${F.eckig(z.pts)}"/></clipPath>`);
    s += `<g clip-path="url(#${cid})"><rect ${re} fill="${kachel(S, Math.round(di * S * S), L0, streu, dreh, hell, dunkel)}"/>` +
      (z.einfach ? "" : `<rect ${re} fill="${kachel(Math.round(S * 13.4) / 10, Math.round(di * S * S * 1.8), L0, streu, dreh, hell, dunkel)}"/>`) + `</g>`;
  }
  return s;
}

/* =====================================================================
   W9 — T.federn
   T.federn.flur(pts, o): Federflur im Vieleck pts als überlappende Reihen (Dachziegel): jede Feder mit runder Spitze
     in Wuchsrichtung, Lichtkante oben, Schattenfuge unter der nächsten Reihe.
     o: { richtung (Grad) | fluss (Funktion), groesse (cm), farbe, licht, schatten, op, kante (dunkle Spitze) }
   T.federn.schwinge(basis, o): Schwungfedern gestaffelt (Hand- und Armschwingen), jede mit Schaft, Lichtkante,
     Schattenfuge, die äußeren länger. o: { richtung (Grad), n, laenge, breite, abstand, spreiz (Grad), farbe, licht,
     schatten, schaft }
   ===================================================================== */
function federFlur(T, pts, o = {}) {
  const fein = T.fein !== false, g = o.groesse || 2, fl = o.fluss || (() => (o.richtung != null ? o.richtung : 180));
  const [x0, y0, x1, y1] = box(pts);
  let dF = "", dL = "", dS = "";
  const reihe = g * 0.55, spalte = g * 0.75;
  /* von hinten nach vorn zeichnen, damit vordere Reihen (zum Kopf) unter den hinteren liegen: Federn wachsen nach hinten */
  const liste = [];
  for (let y = y0 - g; y < y1 + g; y += reihe) {
    const versatz = (Math.round((y - y0) / reihe) % 2) * spalte * 0.5;
    for (let x = x0 - g + versatz; x < x1 + g; x += spalte) {
      const px = x + (T.rnd() - 0.5) * g * 0.15, py = y + (T.rnd() - 0.5) * g * 0.12;
      if (inPoly(px, py, pts)) liste.push([px, py]);
    }
  }
  const ri = fl(0, 0);
  liste.sort((p, q) => (p[0] * Math.cos(ri * RAD) + p[1] * Math.sin(ri * RAD)) - (q[0] * Math.cos(ri * RAD) + q[1] * Math.sin(ri * RAD)));
  for (const [px, py] of liste) {
    if (!fein && T.rnd() < 0.5) continue;
    const a = fl(px, py) * RAD, u = [Math.cos(a), Math.sin(a)], n = [-u[1], u[0]], h = g * (0.85 + T.rnd() * 0.3), b = g * 0.42;
    const P = (s, t) => [px + u[0] * s + n[0] * t, py + u[1] * s + n[1] * t];
    const f = [P(-h * 0.2, -b), P(h * 0.45, -b * 0.95), P(h * 0.75, -b * 0.55), P(h * 0.82, 0), P(h * 0.75, b * 0.55), P(h * 0.45, b * 0.95), P(-h * 0.2, b)];
    dF += F.eckig(f);
    /* Licht auf der oberen Fahne, Schatten an der Spitze (Fuge zur nächsten Reihe) */
    const oben = n[1] < 0 ? -1 : 1;
    if (fein) dL += F.eckig([P(h * 0.05, -b * 0.7 * oben), P(h * 0.6, -b * 0.65 * oben)], false);
    dS += F.eckig([P(h * 0.7, -b * 0.5), P(h * 0.83, 0), P(h * 0.7, b * 0.5)], false);
  }
  const op = o.op != null ? o.op : 1;
  return `<path d="${dF}" fill="${o.farbe || "#7a6a58"}" fill-opacity="${op2(op)}"/>` +
    (dL ? `<path d="${dL}" fill="none" stroke="${o.licht || "#fff"}" stroke-opacity="${op2(0.35 * op)}" stroke-width="${Math.round(g * 0.08 * 100) / 100}" stroke-linecap="round"/>` : "") +
    `<path d="${dS}" fill="none" stroke="${o.schatten || "#000"}" stroke-opacity="${op2(0.45 * op)}" stroke-width="${Math.round(g * 0.09 * 100) / 100}" stroke-linejoin="round"/>`;
}
function schwinge(T, basis, o = {}) {
  const fein = T.fein !== false, n = o.n || 10, L0 = o.laenge || 30, B0 = o.breite || 3.2, sp = o.spreiz != null ? o.spreiz : 30;
  let dF = "", dL = "", dS = "", dSchaft = "";
  for (let i = n - 1; i >= 0; i--) {
    const t = i / Math.max(1, n - 1);
    const a = ((o.richtung != null ? o.richtung : 170) - sp * (t - 0.5)) * RAD, u = [Math.cos(a), Math.sin(a)], nn = [-u[1], u[0]];
    const L = L0 * (0.7 + 0.3 * t * (o.aussenLaenger === false ? 0 : 1)), B = B0 * (0.85 + 0.15 * (1 - t));
    const s0 = [basis[0] + (o.abstand != null ? o.abstand : B0 * 0.8) * i * Math.cos(a + Math.PI / 2) * 0.6, basis[1] + (o.abstand != null ? o.abstand : B0 * 0.8) * i * Math.sin(a + Math.PI / 2) * 0.6];
    const P = (s, q) => [s0[0] + u[0] * s + nn[0] * q, s0[1] + u[1] * s + nn[1] * q];
    const fed = [P(0, -B * 0.35), P(L * 0.55, -B * 0.5), P(L * 0.92, -B * 0.32), P(L, 0), P(L * 0.9, B * 0.42), P(L * 0.5, B * 0.55), P(0, B * 0.35)];
    dF += F.eckig(fed);
    dSchaft += F.eckig([P(0, 0), P(L * 0.96, -B * 0.05)], false);
    if (fein) dL += F.eckig([P(L * 0.05, -B * 0.3), P(L * 0.8, -B * 0.32)], false);
    dS += F.eckig([P(L * 0.1, B * 0.48), P(L * 0.85, B * 0.38)], false);
  }
  return `<path d="${dF}" fill="${o.farbe || "#5a4a3a"}"/>` +
    `<path d="${dS}" fill="none" stroke="${o.schatten || "#000"}" stroke-opacity=".45" stroke-width="${Math.round(B0 * 0.16 * 100) / 100}" stroke-linecap="round"/>` +
    (dL ? `<path d="${dL}" fill="none" stroke="${o.licht || "#fff"}" stroke-opacity=".3" stroke-width="${Math.round(B0 * 0.12 * 100) / 100}" stroke-linecap="round"/>` : "") +
    (fein ? `<path d="${dSchaft}" fill="none" stroke="${o.schaft || "#e8e0d0"}" stroke-opacity=".55" stroke-width="${Math.round(B0 * 0.05 * 100) / 100}"/>` : "");
}

function installiere(T) {
  T.fluss = (sil, o) => fluss(T, sil, o);
  T.fell = (sil, o) => fell(T, sil, o);
  T.unterhaar = (zonen) => unterhaar(T, zonen);
  T.federn = { flur: (pts, o) => federFlur(T, pts, o), schwinge: (basis, o) => schwinge(T, basis, o) };
  return T;
}
module.exports = { installiere, fluss, fell, unterhaar, federFlur, schwinge, spindel };
