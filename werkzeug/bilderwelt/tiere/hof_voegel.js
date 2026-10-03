/* =====================================================================
   TIER-BIBLIOTHEK — HOFVÖGEL (FASSUNG 854)
   Hahn, Henne, Küken, Ente (Stockenten-Erpel), Gans (weiße Höckergans), Truthahn (Bronzepute, balzend)
   Zentimeter, Blick nach rechts, Boden y = 0, Licht von links oben (siehe ANLEITUNG.md).
   ===================================================================== */
"use strict";
const r = (n) => Math.round(n * 10) / 10;
const P = (x, y) => r(x) + " " + r(y);

/* Lanzettfeder (Halsbehang, Sattel): Ansatz x,y – Spitze tx,ty, Breite w, Biegung b */
function lanze(x, y, tx, ty, w, b = 0) {
  const dx = tx - x, dy = ty - y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  const mx = x + dx * 0.45 + nx * b, my = y + dy * 0.45 + ny * b;
  return `M${P(x + nx * w * 0.5, y + ny * w * 0.5)}Q${P(mx + nx * w * 0.75, my + ny * w * 0.75)} ${P(tx, ty)}Q${P(mx - nx * w * 0.75, my - ny * w * 0.75)} ${P(x - nx * w * 0.5, y - ny * w * 0.5)}Z`;
}
/* Band entlang einer Mittellinie (Sichelfedern, Schwungfedern): Breite w0 → w1, spitz am Ende */
function band(pts, w0, w1) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const e = pts[n - 1];
  return [...L.slice(0, -1), [e[0], e[1], 1], ...R.slice(0, -1).reverse()];
}
/* Federkanten als Schuppenbögen in Reihen: Feld x0..x1/y0..y1, Größe s, Spitzenrichtung (dx, dy) */
function schuppen(T, x0, y0, x1, y1, s, dx, dy, dicht = 0.78) {
  const l = Math.hypot(dx, dy); dx /= l; dy /= l;
  const nx = -dy, ny = dx; let d = "", j = 0;
  for (let y = y0; y <= y1; y += s * dicht, j++) {
    for (let x = x0 + (j % 2) * s * 0.5; x <= x1; x += s) {
      const cx = x + (T.rnd() - 0.5) * s * 0.25, cy = y + (T.rnd() - 0.5) * s * 0.2;
      d += `M${P(cx + nx * s * 0.5, cy + ny * s * 0.5)}q${P(dx * s * 0.75 - nx * s * 0.5, dy * s * 0.75 - ny * s * 0.5)} ${P(-nx * s, -ny * s)}`;
    }
  }
  return d;
}
const zug = (d, farbe, w, op = 1, extra = "") => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round"${extra}/>`;

/* Hühnerbein: Lauf mit Gürtelschuppen (vorn), 3 Zehen nach vorn, Hinterzehe, Krallen, ggf. Sporn */
function huhnBein(T, o) {
  const { hx, hy, ax, ay, w0, w1, farbe, schatten, sporn, k = 1, fern } = o;
  const dx = ax - hx, dy = ay - hy, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l; // n zeigt nach vorn (rechts)
  const lauf = [[hx - nx * w0 / 2, hy - ny * w0 / 2], [hx + nx * w0 / 2, hy + ny * w0 / 2], [ax + nx * w1 / 2 + 0.2 * k, ay + 0.3 * k], [ax - nx * w1 / 2 - 0.3 * k, ay + 0.4 * k]];
  const f = fern ? T.lg("beinF", [[0, schatten], [1, schatten]]) : T.lg("bein", [[0, farbe], [0.55, farbe], [1, schatten]], 1, 0, 0, 0);
  let s = "";
  /* Zehen: Hinterzehe, äußere (dunkler), mittlere */
  const zeh = (x1, y1, x2, y2, w) => {
    const ex = x2 - x1, ey = y2 - y1, el = Math.hypot(ex, ey), ux = ex / el, uy = ey / el, mx = -uy, my = ux;
    return `M${P(x1 - mx * w / 2, y1 - my * w / 2)}L${P(x2 - mx * w * 0.2, y2 - my * w * 0.2)}Q${P(x2 + ux * w * 0.9, y2 + uy * w * 0.9 - w * 0.2)} ${P(x2 + ux * w * 1.4, y2 + 0.05)}L${P(x2 + mx * w * 0.3, y2 + my * w * 0.3)}L${P(x1 + mx * w / 2, y1 + my * w / 2)}Z`;
  };
  const zy = -0.55 * k;
  s += `<path d="${zeh(ax + 0.2 * k, ay + 0.2 * k, ax - 3.4 * k, zy, 0.9 * k)}${zeh(ax, ay + 0.2 * k, ax + 6.2 * k, zy - 0.15 * k, 1.05 * k)}" fill="${schatten}"/>`;
  s += `<path d="${T.glatt(lauf)}" fill="${f}"/>`;
  s += `<path d="${zeh(ax + 0.4 * k, ay + 0.3 * k, ax + 8.4 * k, zy, 1.25 * k)}" fill="${fern ? schatten : farbe}"/>`;
  /* Krallen */
  s += zug(`M${P(ax - 3.4 * k, zy)}l${P(-0.9 * k, 0.4 * k)}M${P(ax + 8.4 * k, zy)}q${P(1 * k, 0)} ${P(1.4 * k, 0.5 * k)}M${P(ax + 6.2 * k, zy - 0.15 * k)}q${P(0.8 * k, 0)} ${P(1.2 * k, 0.5 * k)}`, "#5b4a33", 0.5 * k);
  /* Gürtelschuppen auf Lauf und Zehen */
  if (!fern) {
    let d = "";
    for (let i = 1; i < 9; i++) { const t = i / 9, x = hx + dx * t, y = hy + dy * t, w = (w0 + (w1 - w0) * t) / 2; d += `M${P(x + nx * w * 0.95, y + ny * w * 0.95)}q${P(-nx * w * 0.6, -ny * w * 0.6 + 0.35 * k)} ${P(-nx * w * 1.25, -ny * w * 1.25)}`; }
    for (let i = 1; i < 6; i++) { const x = ax + 0.4 * k + i * 1.35 * k; d += `M${P(x, zy - 0.55 * k)}l${P(0.15 * k, 1 * k)}`; }
    s += zug(d, "#6b4a1a", 0.22 * k, 0.55);
    s += zug(`M${P(hx + nx * w0 * 0.3, hy + ny * w0 * 0.3)}L${P(ax + nx * w1 * 0.25, ay - 0.5 * k)}`, "#fff", 0.35 * k, 0.3);
  }
  if (sporn) {
    const sx = hx + dx * 0.68 - nx * w0 * 0.4, sy = hy + dy * 0.68 - ny * w0 * 0.4;
    s += `<path d="M${P(sx + 0.3 * k, sy - 0.6 * k)}Q${P(sx - 1.6 * k, sy - 0.4 * k)} ${P(sx - 2.6 * k, sy - 1.6 * k)}Q${P(sx - 1.2 * k, sy + 0.6 * k)} ${P(sx + 0.3 * k, sy + 0.7 * k)}Z" fill="${fern ? schatten : "#cfae74"}"/>`;
  }
  return s;
}

/* Schwimmfuß (Ente, Gans): Lauf, drei Zehen mit Schwimmhaut leicht von oben, kleine Hinterzehe */
function schwimmBein(T, o) {
  const { hx, hy, ax, ay, w0, w1, farbe, schatten, k = 1, fern } = o;
  const dx = ax - hx, dy = ay - hy, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
  const f = fern ? schatten : T.lg("bein", [[0, farbe], [0.6, farbe], [1, schatten]], 1, 0, 0, 0);
  let s = `<path d="${T.glatt([[hx - nx * w0 / 2, hy - ny * w0 / 2], [hx + nx * w0 / 2, hy + ny * w0 / 2], [ax + nx * w1 / 2, ay], [ax - nx * w1 / 2, ay + 0.2 * k]])}" fill="${f}"/>`;
  /* Schwimmhaut: Fächer nach vorn, flach am Boden */
  const haut = [[ax - 0.8 * k, ay + 0.1 * k], [ax + 1 * k, ay - 0.3 * k], [ax + 7.2 * k, -1.1 * k, 1], [ax + 6 * k, -0.45 * k], [ax + 8.6 * k, -0.35 * k, 1], [ax + 6.6 * k, 0, 1], [ax + 1.5 * k, 0], [ax - 1.2 * k, -0.1 * k]];
  s += `<path d="${T.glatt(haut)}" fill="${fern ? schatten : T.lg("haut", [[0, farbe], [1, schatten]])}"/>`;
  if (!fern) s += zug(`M${P(ax + 0.6 * k, ay)}L${P(ax + 7.2 * k, -1.05 * k)}M${P(ax + 0.6 * k, ay + 0.3 * k)}L${P(ax + 8.5 * k, -0.35 * k)}M${P(ax + 0.6 * k, ay + 0.6 * k)}L${P(ax + 6.5 * k, -0.05 * k)}`, schatten, 0.35 * k, 0.7);
  s += `<path d="M${P(ax - 0.6 * k, ay + 0.2 * k)}l${P(-1.6 * k, 0.5 * k)}l${P(1.2 * k, 0.35 * k)}Z" fill="${schatten}"/>`;
  return s;
}

/* Schimmer für schwarze Federn mit grünem Glanz */
const gruenSchwarz = (T, n, x2 = 1, y2 = 1) => T.lg(n, [[0, "#0c1210"], [0.3, "#173a2c"], [0.45, "#2f6e50"], [0.55, "#143326"], [0.8, "#090c0b"], [1, "#050606"]], 0, 0, x2, y2);

module.exports = [
  /* ------------------------------------------------------------------ HAHN */
  { id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "rooster",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.64, hoehe: 0.59,
    /* RECHERCHE: Bankiva-/Goldhalsfarbe (wie Italiener, rebhuhnfarbig) – Haushahn ca. 60–65 cm von Schnabel bis
       Sichelspitze, 55–60 cm hoch bis Kammspitze. Gefiederzonen: Halsbehang (Hackles) lang, schmal, spitz, goldorange;
       Sattelbehang (Saddle) lang, spitz, rotorange über dem Schwanzansatz; Flügelbug dunkelrot, Flügelbinde
       (große Decken) schwarz-grün glänzend, Flügeldreieck (Armschwingen außen) braun-bay; Brust, Bauch, Schenkel
       schwarz; Steuerfedern schwarz, darüber die großen Sicheln (gebogene Schwanzdecken) mit grünem Metallglanz.
       Einfacher Kamm mit 5 Zacken, zwei Kehllappen, rote Ohrscheibe, orangerote Iris, hornfarbener gebogener
       Oberschnabel. Lauf (Tarsometatarsus) gelb, vorn mit Gürtelschuppen (Scutellae), Sporn hinten-innen am Lauf,
       vier Zehen: drei nach vorn, die Hinterzehe (Hallux) nach hinten. Quellen: extension.org „External anatomy of
       chickens", mypetchicken.com „hackles, sickles, saddles". */
    zeichne(T) {
      let s = "";
      const gold = T.lg("gold", [[0, "#f6c860"], [0.5, "#e59a34"], [1, "#b8541c"]]);
      const sattel = T.lg("sattel", [[0, "#e88a32"], [0.6, "#c0471a"], [1, "#8e2a12"]]);
      /* fernes Bein */
      s += huhnBein(T, { hx: -6, hy: -14, ax: -4.8, ay: -1.6, w0: 2.3, w1: 1.7, farbe: "#c8952e", schatten: "#9a6e22", fern: true, sporn: true });
      /* Sicheln hinten (fern) und Steuerfedern */
      const sichelF = T.lg("sichelF", [[0, "#0a0e0c"], [0.5, "#16302a"], [1, "#060707"]], 0, 0, 1, 1);
      s += T.form(band([[-15, -39], [-20, -53], [-27, -56.5], [-32.5, -51], [-35, -41], [-34.5, -31]], 3, 0.6), sichelF);
      s += T.koerper([[-14, -36], [-18, -46], [-22, -52.5], [-26, -51.5], [-27.5, -45], [-25, -36], [-19, -29]], "#0d1110",
        { innen: zug("M-16 -38L-23.5 -51M-17 -37L-26.5 -47M-18 -35L-27 -41", "#3d5a4c", 0.35, 0.6), rand: false });
      /* Sichel vorn (die große) + kleine Sicheln */
      const sichel = gruenSchwarz(T, "sichel");
      s += T.koerper(band([[-14.5, -40], [-19, -52], [-25.5, -58], [-32, -56], [-36.5, -48], [-38, -38], [-37, -29]], 3.4, 0.6), sichel,
        { vol: false, innen: zug("M-15 -41Q-19 -53 -25 -57Q-33 -57 -36.5 -46", "#8fd0aa", 0.3, 0.45), randA: 0.5 });
      s += T.koerper(band([[-16, -36.5], [-23.5, -45], [-30, -43.5], [-33, -35], [-33, -25.5]], 2.8, 0.5), sichel, { vol: false, randA: 0.5 });
      s += T.koerper(band([[-16.5, -34], [-23, -38.5], [-28.5, -34], [-29.5, -22.5]], 2.6, 0.5), sichel, { vol: false, randA: 0.5 });
      s += T.koerper(band([[-17, -31.5], [-22, -33], [-25.5, -27], [-25.5, -19.5]], 2.3, 0.5), sichel, { vol: false, randA: 0.5 });
      /* Rumpf: Brust und Bauch schwarz mit Grünglanz, Federkanten */
      s += T.koerper([[15.5, -33], [14, -26], [9.5, -20], [2, -17.2], [-7, -17.4], [-14, -21], [-18.5, -27], [-19, -33], [-15, -38], [-6, -39.5], [5, -39], [12.5, -37]],
        gruenSchwarz(T, "rumpf", 0.6, 1),
        { innen: zug(schuppen(T, 2, -33, 15, -19, 2.2, -0.4, 1), "#4b7e66", 0.3, 0.45) + T.striche(26, -16, -24, 0, -18, -1.4, 0.8, "#2f4a3e", 0.4, 0.5) });
      /* Schenkel („Hosen") */
      s += T.koerper([[-6, -22], [6, -22], [4.5, -15.5], [1.6, -12.8], [-2.4, -13.6], [-5.6, -17]], "#101413",
        { innen: T.striche(18, -5, -21, 4, -14, -0.3, 1.6, "#4a6a5a", 0.35, 0.6), randA: 0.2 });
      /* nahes Bein mit Sporn */
      s += huhnBein(T, { hx: 0.8, hy: -14, ax: 3, ay: -1.8, w0: 2.4, w1: 1.8, farbe: "#ecbd48", schatten: "#a77420", sporn: true });
      /* Flügel: Bug dunkelrot, Binde grün-schwarz, Dreieck bay, Handschwingen schwarz */
      const fl = [[9.5, -35.5], [8.5, -29], [3.5, -25.2], [-6, -23.4], [-14.5, -23.8], [-17.5, -26], [-12, -29.5], [-4, -33.5], [3, -36.5]];
      let fi = T.form([[-4, -27.5], [-18, -27], [-18, -22], [-4, -22]], "#0e1110");
      fi += T.form([[10, -37], [9.6, -31], [3, -30], [-6, -31], [-9, -34], [-2, -38]], T.lg("bug", [[0, "#8e2814"], [1, "#5a150c"]]));
      fi += zug(schuppen(T, -6, -36, 9, -31.5, 1.6, -1, 0.6), "#c2502a", 0.28, 0.6);
      fi += T.form([[9.6, -31.5], [8, -28.4], [2, -27.6], [-7, -28.4], [-11, -29.8], [-6, -31.2], [2, -30.6]], gruenSchwarz(T, "binde", 1, 0.3));
      fi += zug("M8.5 -29.2L-8 -29.6", "#7fc49c", 0.3, 0.5);
      fi += zug("M6 -27.6L0 -25.3M3 -27.7L-3.5 -24.8M0 -27.8L-7 -24.3M-3 -28L-10.5 -24.2M-6 -28.2L-13.5 -24.5", "#5e2c12", 0.35, 0.8);
      fi += zug("M-8 -28.3L-17 -25.5M-10 -28L-17.5 -26.6", "#7a7a72", 0.3, 0.5);
      s += T.koerper(fl, "#a65a24", { innen: fi, randA: 0.35 });
      /* Sattelbehang über dem Schwanzansatz */
      const sat = ["", ""];
      for (let i = 0; i < 16; i++) {
        const t = i / 15, x = 1 - t * 15, y = -38.6 - Math.sin(t * Math.PI) * 0.8;
        const tx = -13 - t * 7 + T.rnd() * 1.5, ty = -26.5 - t * 3 + T.rnd() * 1.5;
        sat[i % 2] += lanze(x, y, tx, ty, 2.1, -0.6 - t);
      }
      s += `<path d="${sat[0]}" fill="${sattel}"/><path d="${sat[1]}" fill="${T.lg("sattel2", [[0, "#f0a548"], [1, "#a8361a"]])}" stroke="#5a1a0c" stroke-width=".15" stroke-opacity=".5"/>`;
      /* Halsbehang: Grundform, dann lange spitze Federn bis über die Schultern */
      s += T.form([[12, -51], [17, -52.5], [20.5, -48], [19.8, -43], [17.5, -37.5], [15.8, -31], [8, -30.5], [0, -34.5], [-3, -36], [4, -40], [9, -45]], "#c2671f");
      const h = ["", ""];
      for (let i = 0; i < 26; i++) {
        const t = i / 25;
        const bx = 12.5 + t * 7 - Math.sin(t * Math.PI) * 1.5, by = -50.5 + t * 7.5;
        const tx = -3.5 + t * 19.8 + (T.rnd() - 0.5) * 1.2, ty = -35.2 + t * 4.6 + (T.rnd() - 0.5) * 1.2 + Math.sin(t * 3.1) * 1.6;
        h[i % 2] += lanze(bx, by, tx, ty, 2.4 - t * 0.6, -0.8 + t * 1.2);
      }
      s += `<path d="${h[0]}" fill="${T.lg("hals1", [[0, "#e5952e"], [1, "#a8461a"]])}"/>`;
      s += `<path d="${h[1]}" fill="${gold}" stroke="#7a3410" stroke-width=".12" stroke-opacity=".6"/>`;
      s += zug("M13.6 -49Q9 -44 0 -37M15 -48Q11 -41 6 -34M17 -46Q15 -39 11 -32.5", "#ffe39a", 0.4, 0.45);
      /* Kopf: Federn, rote nackte Gesichtshaut, Ohrscheibe, Auge, Schnabel, Kamm, Kehllappen */
      s += T.koerper([[12.5, -49.5], [14.2, -52.4], [18, -52.8], [21.4, -50.8], [21.6, -47.6], [19.6, -45.2], [16, -45.6], [13, -46.8]], gold, { rand: false });
      const rot = T.lg("rot", [[0, "#e8343a"], [0.6, "#c2161f"], [1, "#8c0d14"]]);
      s += T.koerper([[17, -50.6], [20.8, -50.8], [21.8, -47.4], [20, -45], [17, -45.6], [16.4, -48.4]], rot, { rand: false, vol: false });
      s += `<ellipse cx="16.9" cy="-46.4" rx=".9" ry="1.15" fill="#d3434a"/><ellipse cx="16.7" cy="-46.7" rx=".4" ry=".5" fill="#fff" opacity=".35"/>`;
      /* Kehllappen */
      s += T.koerper([[20.4, -47.2], [22.2, -46.6], [22.4, -44], [21.6, -41.4], [20, -40.6], [18.7, -42], [18.9, -45]], rot, { randA: 0.25, rw: 0.3 });
      /* Kamm: einfacher Kamm mit 5 Zacken */
      s += T.koerper([[21.6, -50.4, 1], [21.8, -52.6], [21.4, -55.6, 1], [20.2, -53.9], [19.2, -57.6, 1], [18, -54.6], [16.7, -58.6, 1], [15.5, -54.9], [14.3, -58.3, 1], [13.2, -54.7], [11.8, -57.2, 1], [11.2, -54.4], [9.6, -55.4, 1], [11, -52.5], [13.5, -51.8], [17.5, -52.3]],
        T.lg("kamm", [[0, "#f04048"], [0.5, "#d01c26"], [1, "#9a1018"]], 0, 0, 0.3, 1), { randA: 0.3, rw: 0.3, innen: zug("M12.5 -53.6Q16 -53.2 20.4 -52.4", "#ff9a9a", 0.4, 0.35) });
      /* Schnabel: Oberschnabel gebogen, Unterschnabel, Nasenloch */
      s += T.koerper([[21.2, -50.6], [23, -50.2], [24.8, -48.8], [25.6, -46.6, 1], [24.3, -47.6], [21.6, -48]], T.lg("schn", [[0, "#f0cf7a"], [1, "#b8892e"]]), { rw: 0.3, randA: 0.45 });
      s += T.form([[21.6, -47.9], [24.2, -47.5], [24.8, -47], [21.8, -46.6]], "#c99a44");
      s += zug("M22.1 -49.5l.8 .2", "#3a2a14", 0.3);
      s += T.auge(19.4, -49.2, 0.72, "#e07a1c", { lid: "#7a1a14" });
      return { svg: s, box: [-38.6, -58.6, 25.6, 0] };
    } },

  /* ------------------------------------------------------------------ HENNE */
  { id: "henne", de: "die Henne", syl: "HEN-ne", it: "la gallina", itSyl: "gal-LI-na", en: "hen",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.42, hoehe: 0.41,
    /* RECHERCHE: braunes Legehuhn (ISA Brown / Lohmann Brown, aus Rhode Island Red × Rhode Island White) – rötlich
       kastanienbraun, Halsbehang goldbraun mit runderen Federn als beim Hahn, Steuerfedern dunkel, oft einzelne
       weiße Federn im Schwanz und unter dem Behang; kleiner Einfachkamm (meist 4–5 Zacken), kleine Kehllappen,
       rote Ohrscheibe; Lauf gelb, ohne Sporn. Ca. 40 cm lang, 38–42 cm hoch. Federn rund mit hellerem Saum. */
    zeichne(T) {
      let s = "";
      const braun = T.lg("braun", [[0, "#c17436"], [0.5, "#9a4a1e"], [1, "#6a2d12"]]);
      s += huhnBein(T, { hx: -5, hy: -10, ax: -4.2, ay: -1.2, w0: 1.7, w1: 1.3, farbe: "#c8952e", schatten: "#987026", fern: true, k: 0.75 });
      /* Schwanz: kurz, aufrecht, gefächert, dunkel mit weißen Einzelfedern */
      s += T.koerper([[-14, -29.5], [-16.4, -36.5], [-19, -39.6], [-21.8, -38.2], [-21.8, -32], [-19.8, -25], [-16, -22]], T.lg("schw", [[0, "#2c1a10"], [1, "#4a2a16"]]),
        { innen: zug("M-15 -28L-19 -38.6M-16 -27L-21 -36.5M-17 -26L-21.4 -33", "#7a5236", 0.35, 0.8) + zug("M-15.6 -29Q-18 -34 -20.2 -38.8", "#f2ece0", 0.8, 0.85), randA: 0.25 });
      /* Rumpf */
      s += T.koerper([[12, -25.5], [11.2, -19], [6.5, -14.2], [-1.5, -12.4], [-9.5, -13.6], [-15.5, -17.5], [-19, -24], [-18.6, -30], [-13, -32.4], [-3, -31.6], [6, -30.2], [10.8, -28.4]],
        braun, { innen: zug(schuppen(T, -17, -31, 12, -13, 2, -0.6, 1), "#e0a46a", 0.35, 0.55) + zug(schuppen(T, -16, -30, 12, -13, 2, -0.6, 1), "#4a1c0a", 0.25, 0.35) });
      s += T.koerper([[-4.5, -17], [4.6, -17], [3.4, -11.6], [0.4, -9.4], [-2.6, -10.2], [-4.6, -13]], T.lg("hose", [[0, "#8a3e1a"], [1, "#5a2610"]]),
        { innen: T.striche(16, -4, -16, 3.5, -10.5, -0.2, 1.3, "#c78a54", 0.3, 0.6), randA: 0.2 });
      s += huhnBein(T, { hx: 0.4, hy: -10, ax: 2.2, ay: -1.3, w0: 1.8, w1: 1.35, farbe: "#ecbe4a", schatten: "#a9781f", k: 0.75 });
      /* Flügel mit Deckfedern, Armschwingen, Handschwingen */
      let fi = T.form([[-3, -21], [-16, -21.5], [-16, -16], [-3, -16]], "#5a2a12");
      fi += zug(schuppen(T, -8, -27.5, 7, -22.5, 1.8, -1, 0.5), "#e3a86c", 0.35, 0.7);
      fi += zug("M4 -21.6L-3 -18.2M1 -21.8L-6.5 -17.6M-2 -22L-10 -17.4M-5 -22.2L-13 -17.6M-8 -22.4L-15 -18.4", "#4a1e0c", 0.4, 0.7);
      fi += zug("M5.5 -22L-1.5 -18.8M2.5 -22.2L-4.8 -18.3M-0.5 -22.4L-8.4 -18M-3.5 -22.6L-11.6 -18.1M-6.5 -22.8L-14 -18.7", "#e3a86c", 0.3, 0.5);
      s += T.koerper([[7.6, -27], [6.4, -21], [0.6, -17.6], [-8, -16.8], [-14.6, -18.6], [-11.5, -22.4], [-3, -26.4], [3.5, -28.4]], T.lg("fl", [[0, "#a85a26"], [1, "#7a3414"]]), { innen: fi, randA: 0.3 });
      /* Halsbehang goldbraun, rundere Federn */
      s += T.form([[10, -38], [14.5, -38.8], [16.6, -35], [15.6, -30], [13.4, -25.5], [7, -24.6], [0, -28.5], [3.5, -31.5], [7.5, -34.5]], "#b8682a");
      const h = ["", ""];
      for (let i = 0; i < 18; i++) {
        const t = i / 17, bx = 10.4 + t * 5.5 - Math.sin(t * Math.PI) * 1.2, by = -37.6 + t * 6;
        const tx = 0.4 + t * 13.8 + (T.rnd() - 0.5), ty = -28.8 + t * 3.8 + (T.rnd() - 0.5) + Math.sin(t * 3.1) * 1.2;
        h[i % 2] += lanze(bx, by, tx, ty, 3 - t * 0.6, -0.5 + t);
      }
      s += `<path d="${h[0]}" fill="${T.lg("h1", [[0, "#c98436"], [1, "#8a4218"]])}"/>`;
      s += `<path d="${h[1]}" fill="${T.lg("h2", [[0, "#e8ad5a"], [1, "#ad5a22"]])}" stroke="#5a2a10" stroke-width=".12" stroke-opacity=".6"/>`;
      /* Kopf */
      s += T.koerper([[11, -37], [12.5, -39.8], [15.8, -40.2], [18.6, -38.4], [18.6, -35.5], [16.6, -33.6], [13.6, -34], [11.4, -35]], T.lg("kopf", [[0, "#d69248"], [1, "#9a5422"]]), { rand: false });
      const rot = T.lg("rot", [[0, "#e23a3e"], [0.6, "#c01a22"], [1, "#8c1016"]]);
      s += T.koerper([[14.6, -38.4], [17.9, -38.6], [18.8, -35.6], [17.2, -33.8], [14.8, -34.2], [14.1, -36.4]], rot, { rand: false, vol: false });
      s += `<ellipse cx="14.4" cy="-35" rx=".65" ry=".85" fill="#cf3a40"/>`;
      s += T.koerper([[17.8, -35.6], [19, -35.2], [18.9, -33.2], [17.9, -32.4], [17, -33.4]], rot, { randA: 0.25, rw: 0.25 });
      s += T.koerper([[18.6, -38.4, 1], [18.8, -39.8], [18.2, -41.2, 1], [17.2, -40.4], [16.4, -42.2, 1], [15.4, -40.9], [14.4, -42, 1], [13.6, -40.6], [12.4, -41.2, 1], [12.6, -39.8], [15, -39.6]],
        T.lg("kamm", [[0, "#ee3c44"], [1, "#a01219"]]), { randA: 0.3, rw: 0.25 });
      s += T.koerper([[18.4, -38.6], [19.8, -38.2], [21.1, -36.9], [21.6, -35.2, 1], [20.5, -35.8], [18.6, -36]], T.lg("schn", [[0, "#ecc878"], [1, "#b48a3a"]]), { rw: 0.25, randA: 0.45 });
      s += T.form([[18.8, -35.9], [20.5, -35.7], [20.9, -35.2], [19, -34.9]], "#c49a50");
      s += zug("M19 -37.7l.6 .15", "#3a2a14", 0.25);
      s += T.auge(16.2, -37.1, 0.6, "#d8801e", { lid: "#7a1a14" });
      return { svg: s, box: [-22, -42.2, 21.6, 0] };
    } },

  /* ------------------------------------------------------------------ KÜKEN */
  { id: "kueken", de: "das Küken", syl: "KÜ-ken", it: "il pulcino", itSyl: "pul-CI-no", en: "chick",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.11, hoehe: 0.096,
    /* RECHERCHE: Eintagsküken ca. 40 g, 8–10 cm lang, ca. 9 cm hoch; gelbes Daunenkleid (Dunen, keine Konturfedern),
       Kopf groß im Verhältnis zum Körper, Flügel nur Stummel, kurzer Schnabel mit hellem Eizahn-Rest, dunkle
       Augen, Beine rosa-gelb, kurz, vier Zehen. */
    zeichne(T) {
      let s = "";
      const bein = (hx, ax, fern) => {
        const f = fern ? "#c79a52" : "#e8b770";
        let d = `<path d="M${P(hx - 0.3, -2.4)}L${P(hx + 0.3, -2.4)}L${P(ax + 0.25, -0.5)}L${P(ax - 0.25, -0.5)}Z" fill="${f}"/>`;
        d += zug(`M${P(ax, -0.45)}L${P(ax + 1.5, -0.15)}M${P(ax, -0.45)}L${P(ax + 1.1, -0.3)}M${P(ax, -0.45)}L${P(ax - 0.75, -0.15)}`, f, 0.36);
        return d;
      };
      s += bein(-1.4, -1.1, true);
      const daune = T.rg("daune", [[0, "#fff1a8"], [0.55, "#ffd85a"], [1, "#d9a12e"]], 0.4, 0.3, 0.8);
      /* Körper und Kopf als eine weiche Daunenform */
      const umriss = [[-5.2, -4.6], [-4.6, -6.6], [-2.6, -7.6], [-0.4, -7.9], [1.2, -8.9], [3, -9.6], [4.8, -9.1], [5.6, -7.6], [5.2, -6.1], [4, -5], [3.4, -3.6], [2, -2.3], [-0.4, -1.7], [-3, -2], [-4.6, -3.1]];
      let fl = "";
      for (let i = 0; i < umriss.length; i++) {
        const a = umriss[i], b = umriss[(i + 1) % umriss.length];
        for (let j = 0; j < 3; j++) { const t = j / 3, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; fl += `M${P(x, y)}l${P((x + 0.3) * 0.08 + (T.rnd() - 0.5) * 0.3, (y + 5.5) * 0.08 + (T.rnd() - 0.5) * 0.3)}`; }
      }
      s += zug(fl, "#f3c84a", 0.45, 0.9);
      s += T.koerper(umriss, daune, { innen: T.striche(70, -5, -9, 5, -2, -0.5, 0.25, "#c9952a", 0.12, 0.5) + T.striche(40, -4, -9, 4, -4, -0.4, 0.2, "#fff6c8", 0.12, 0.7), rand: "#b07a1a", randA: 0.25, rw: 0.15 });
      /* Flügelstummel */
      s += T.koerper([[0.6, -6], [-0.6, -4.4], [-2.6, -3.6], [-4, -4.1], [-2.8, -5.6], [-0.8, -6.4]], T.lg("fl", [[0, "#ffe27a"], [1, "#e0aa36"]]), { randA: 0.18, rw: 0.12 });
      s += bein(0.7, 1.1, false);
      /* Schnabel, Auge */
      s += T.form([[5.3, -8], [6.4, -7.5, 1], [5.3, -7, 1]], "#e2a65a") + zug("M5.4 -7.5l.9 0", "#9a6a30", 0.08);
      s += `<circle cx="5.5" cy="-7.9" r=".12" fill="#fff" opacity=".8"/>`;
      s += T.auge(3.8, -7.9, 0.48, "#1c120a", { lid: "#3a2a14" });
      return { svg: s, box: [-5.4, -9.6, 6.4, 0] };
    } },

  /* ------------------------------------------------------------------ ENTE */
  { id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.58, hoehe: 0.33,
    /* RECHERCHE: Stockente (Anas platyrhynchos), Erpel im Prachtkleid – 50–65 cm lang. Kopf und Hals flaschengrün
       metallisch glänzend (je nach Licht violett-blau), schmaler weißer Halsring, Brust kastanien-purpurbraun, Flanken
       und Bauch hellgrau fein gewellt, Rücken graubraun, Bürzel und Unterschwanzdecken schwarz, Schwanz weißlich
       mit zwei schwarzen, nach oben eingerollten Mittelfedern („Erpellocke"), Flügelspiegel blau-violett mit
       schwarzer und weißer Einfassung; Schnabel gelb mit schwarzem Nagel; Beine und Schwimmfüße orange, Auge dunkel. */
    zeichne(T) {
      let s = "";
      s += schwimmBein(T, { hx: -4, hy: -6.5, ax: -3.4, ay: -1.6, w0: 1.6, w1: 1.1, farbe: "#e88a2c", schatten: "#b25e1a", fern: true, k: 0.8 });
      /* Schwanz weißlich + Erpellocke */
      s += T.koerper([[-20, -17.5], [-27.5, -18.6], [-29.4, -17.2, 1], [-27.2, -15.8], [-20, -13.5]], T.lg("schw", [[0, "#f2f0ea"], [1, "#b8b6ae"]]),
        { innen: zug("M-22 -17L-28.5 -17.3M-22 -15.6L-27.5 -16.4", "#8a8a84", 0.25, 0.7), randA: 0.25 });
      s += zug("M-20.5 -19.5Q-21.5 -23.6 -19.2 -24Q-17.6 -24.1 -18.2 -22.6M-21.4 -19.2Q-23.2 -22.4 -21.4 -23.3Q-20.4 -23.6 -20.6 -22.6", "#121514", 0.7);
      /* Rumpf: graue Flanken mit feiner Wellung, Brust kastanienbraun, schwarzes Heck */
      let ri = T.striche(50, -14, -16, 6, -8, 1.4, 0.08, "#6e706c", 0.18, 0.55);
      ri += T.form([[5.5, -25], [19, -25], [19, -6], [9.5, -6], [11, -10], [10.6, -15], [8.5, -19.5]], T.lg("brust", [[0, "#7a4430"], [0.5, "#6a3326"], [1, "#4a2420"]], 0, 0, 0.4, 1));
      ri += zug(schuppen(T, 9, -21, 17, -9, 1.4, -0.5, 1), "#a87058", 0.25, 0.5);
      ri += T.form([[-17, -24], [-30, -24], [-30, -6], [-18.5, -8], [-17.4, -13], [-18.2, -18]], "#121514");
      s += T.koerper([[17, -19.5], [15.4, -12.6], [9.5, -8], [0, -6.4], [-10, -6.8], [-17.5, -9.6], [-22.5, -13.4], [-23.6, -18.6], [-19, -21.8], [-8, -22.8], [4, -22.6], [12, -21.8]],
        T.lg("flanke", [[0, "#d9d8d2"], [1, "#a9a8a2"]]), { innen: ri, randA: 0.25 });
      s += schwimmBein(T, { hx: 1, hy: -6.8, ax: 1.6, ay: -1.6, w0: 1.7, w1: 1.15, farbe: "#f0922e", schatten: "#b55f18", k: 0.8 });
      /* Flügel (zusammengelegt): graubraun, Spiegel blau-violett mit schwarz-weißem Rand, Handschwingen dunkel */
      let fi = T.form([[-10, -19.6], [-24, -20], [-24, -15], [-10, -15]], "#4a4038");
      fi += T.form([[-3, -17.6], [-12, -17.8], [-14.8, -15.6], [-5, -15.2]], T.lg("spiegel", [[0, "#3c52c8"], [0.5, "#5a3ea8"], [1, "#22307a"]], 0, 0, 1, 1));
      fi += zug("M-3 -18.1L-12.4 -18.3M-5 -14.7L-15.2 -15.1", "#fff", 0.45, 0.95) + zug("M-3 -17.6L-12 -17.8", "#111", 0.25, 0.8);
      fi += zug(schuppen(T, -8, -21.4, 9, -18.2, 1.5, -1, 0.35), "#e2d8c8", 0.25, 0.55);
      fi += zug("M-12.5 -19L-22 -19.2M-13 -17.6L-23 -18.2", "#7a6e62", 0.25, 0.7);
      s += T.koerper([[10, -20.5], [7.5, -17.2], [-2, -15.2], [-12, -14.8], [-19, -16.4], [-23.4, -18.8], [-18, -20.6], [-6, -21.8], [4, -22.2]], T.lg("fl", [[0, "#9a8c7c"], [1, "#6e6054"]]), { innen: fi, randA: 0.3 });
      /* Hals und Kopf: flaschengrün mit Glanz, weißer Halsring */
      const gruen = T.lg("kopf", [[0, "#2e8a54"], [0.3, "#156a3c"], [0.65, "#0b3a26"], [0.85, "#1f2a5e"], [1, "#0a1e18"]], 0.2, 0, 0.6, 1);
      s += T.koerper([[10.5, -21.4], [12, -26.6], [15.2, -29.8], [18.2, -32.4], [21.4, -32.8], [23.6, -31], [23.4, -28.2], [21.6, -27.2], [20.2, -24.4], [19.4, -20.6], [16.6, -18.6]],
        gruen, { innen: zug("M17.6 -31.6Q20.4 -32.6 22.4 -31.2", "#7fe0a8", 0.5, 0.55) + zug("M11.2 -22.6Q15 -21.4 19.6 -21.6", "#fff", 1, 0.95), randA: 0.35 });
      /* Schnabel gelb mit schwarzem Nagel */
      s += T.koerper([[23, -30.6], [25, -29.6], [27.8, -28.4], [28.7, -27.6, 1], [28, -27], [25.2, -27], [23, -27.4]], T.lg("schn", [[0, "#ead25a"], [1, "#a8962e"]]), { rw: 0.3, randA: 0.45 });
      s += `<path d="M27.9 -28.4Q28.9 -28 28.6 -27.2L27.8 -27.1Z" fill="#1d1a12"/>`;
      s += zug("M23.4 -27.9Q26 -27.7 28 -27.6", "#5a4c1a", 0.22, 0.8) + zug("M24.4 -29.2l.9 .35", "#3a3214", 0.3);
      s += T.auge(21.2, -30.2, 0.5, "#2a1608", { lid: "#0a160f" });
      return { svg: s, box: [-29.4, -32.8, 28.7, 0] };
    } },
];
