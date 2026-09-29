/* =====================================================================
   BERGSTOLLEN — das Bergwerk als Felshügel mit Stolleneingang
   ---------------------------------------------------------------------
   FASSUNG 818 — XANDER (wörtlich): „unser Bergwerk ist keine schöne
   steinmine mehr wie sie vorher vom Logo … das ist nur so ein Gestell so
   ein Gerüst und das kann wieder den Liebreiz haben den es vorher hatte
   das Gerüst kann ja dabei stehen aber ich möchte dieses höhlenartige
   haben dass man instinktiv weiß da geht's in das Bergwerk hinein".

   VORBILD ist das Bergwerk im alten gemalten Dorf (spiel.js, Symbol
   „bergwerk" und dmGebaeude): ein runder, grau-brauner Felsbuckel mit
   grüner Kuppe, vorn ein dunkles Mundloch mit hölzernem Türstock, aus
   dem ein Gleis kommt, darauf eine Lore voll Erz (grau, Gold, Silber,
   Kupfer), daneben die Grubenlampe am Pfahl. Das Fördergerüst „kann
   dabei stehen": klein und aus Holz oben auf dem Hügel, über dem
   Schacht, mit Seilscheibe.

   WIE ES GEMALT WIRD (anders als die Häuser): Der Hügel ist ein
   Höhenfeld (Raster alle 8 cm) und wird Spalte für Spalte von vorn nach
   hinten „abgetastet" (wie ein Geländespiel der 90er): jede Bildzeile
   bekommt den Punkt des Hangs, den das Auge wirklich trifft – mit
   Normale, Licht der Stadt (ST.lichtFaktor), Sonnenschatten (auch der
   Wände des Einschnitts auf die Felswand), Höhlungen dunkler (AO) und
   einer Oberfläche aus Rauschen: Gesteinsbänke, Klüfte, Flechten, Gras
   oder Schnee je nach Neigung. Zweifach überabgetastet (keine
   Pixelkanten). Tiefe je Bildpunkt merkt sich das Bild; alles Gebaute
   (Türstock, Gleis, Lore, Lampe, Grubenholz, Gerüst, Fichten) wird
   danach als kleine Ebene gemalt und nur dort übernommen, wo es vor dem
   Hang liegt – so verschwindet das Mundloch, wenn man von hinten
   schaut, und die Wände des Einschnitts verdecken den Türstock von der
   Seite richtig.

   MASSE (Meter; Front = Süden = +y, x Osten, z oben; Grund 13 × 13)
     Hügel      Mitte (0,2 | −1,5), Halbachsen 6,3 × 5,3, Kuppe 7,2 m,
                links hinten eine Schulter (5,4 m)
     Mundloch   Mitte x = −0,3, Felswand y = 1,0; lichte Weite 2,1 m,
                Höhe 2,55 m; Türstock aus Rundholz, Kappe auf 2,95 m
     Einschnitt vom Mundloch nach vorn, 3,5 m breit, zum Rand 6 m
     Gleis      600 mm Spur, aus dem Stollen bis y = 6,0
     Halde      vorn rechts (4,0 | 3,6), Ø 4,2 m, 1,3 m hoch
     Gerüst     auf der Kuppe über dem Schacht (1,6 | −2,4), 4,6 m über
                dem Hang, Seilscheibe Ø 1,5 m
   NACHT: die Grubenlampe am Pfahl leuchtet (M.licht, warmer Schein auf
   Fels, Türstock und Lore), im Stollen glimmt tief drinnen ein Licht.
   AUFBAU (o.bau): erst wird der Einschnitt in den Hang gegraben (die
   Halde wächst mit dem Aushub), dann bricht das Mundloch auf, der
   Türstock wird gestellt, das Gleis gelegt, das Gerüst gezimmert; zum
   Schluss kommen Lore, Lampe und das Schild „Glück auf".
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
  const AUGE = ST.ZUM_AUGE, LICHT = ST.LICHT;
  const TAU = Math.PI * 2;
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const glatt = (a, b, x) => { const t = klemm((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const misch = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgbS = (c, a) => (a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (+a).toFixed(3) + ")");
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const R = ST.rausch, FBM = ST.fbm;

  /* ---------------- Maße ---------------- */
  const HUEGEL = { x: 0.2, y: -1.5, rx: 6.3, ry: 5.3, h: 7.2 };
  const SCHULTER = { x: -3.1, y: -3.3, rx: 3.5, ry: 3.1, h: 5.4 };
  const PX = -0.3, PY = 1.0;                          // Mundloch: Mitte (x), Felswand (y)
  const OEFF_B = 2.1, OEFF_H = 2.55;                  // lichte Weite und Höhe
  const HALDE = { x: 4.0, y: 3.6, r: 2.1, h: 1.3 };
  const GERUEST = { x: 1.6, y: -2.4 };
  const LAMPE = [PX - 1.62, PY + 0.72, 2.12];          // Glas der Grubenlampe
  const GLEIS_SPUR = 0.3, GLEIS_BIS = 6.0;
  const LORE_Y = PY + 2.25;
  const FICHTEN = [[-3.6, -4.9, 3.1, 11], [-1.9, -5.6, 2.6, 23], [4.0, -4.3, 2.9, 37], [-4.9, -2.2, 2.3, 41], [3.2, -5.3, 2.2, 53]];
  const RASTER = { x0: -7.4, y0: -7.6, d: 0.08, nx: 186, ny: 190 };

  /* Farben (wie im alten Bild: Fels #8a7c62 und #6b5e48, Kuppe #6a9c3c, Holz #8a5a2b/#6b4521, Lore #5b636c) */
  const FELS_H = [150, 136, 110], FELS = [132, 119, 94], FELS_D = [98, 88, 70], FELS_K = [116, 114, 108];
  const GRAS = [96, 138, 58], GRAS_D = [70, 104, 44], GRAS_H = [134, 158, 72], GRAS_HERBST = [156, 140, 70];
  const SCHNEE = [240, 244, 250], SCHOTTER = [112, 104, 94], SCHOTTER_H = [150, 142, 130];
  const HOLZ = [138, 90, 43], HOLZ_D = [98, 66, 34], HOLZ_ALT = [112, 92, 70];
  const EISEN = [91, 99, 108], ROST = [128, 78, 48];
  const ERZ = [[242, 194, 48], [223, 230, 238], [201, 106, 58], [120, 118, 116], [96, 94, 92]];

  /* ---------------- Bauzustand ---------------- */
  function zustand(bau) {
    const f = bau >= 1;
    return {
      fertig: f,
      kerb: f ? 1 : phase(bau, 0.03, 0.42),          // wie weit der Einschnitt in den Hang reicht
      loch: f ? 1 : phase(bau, 0.28, 0.5),           // Mundloch aufgebrochen
      rahmen: f ? 1 : phase(bau, 0.38, 0.6),         // Türstock: erst die Stempel, dann die Kappe
      gleis: f ? 1 : phase(bau, 0.55, 0.78),         // erst Schwellen, dann Schienen
      geruest: f ? 1 : phase(bau, 0.62, 0.92),       // Beine, Ringe, Seilscheibe
      halde: f ? 1 : 0.25 + 0.75 * phase(bau, 0.03, 0.5),
      zubehoer: bau >= 0.9                           // Lore, Lampe, Schild, Grubenholz
    };
  }

  /* ---------------- Das Höhenfeld ---------------- */
  function kuppel(x, y, H) {
    const dx = (x - H.x) / H.rx, dy = (y - H.y) / H.ry;
    const w = Math.atan2(dy, dx);
    /* Umriss etwas unregelmäßig (kein Ei) */
    const rr = Math.hypot(dx, dy) / (1 + 0.1 * (R(Math.cos(w) * 1.7 + 5, Math.sin(w) * 1.7 + 5, 811) - 0.5));
    if (rr >= 1) return 0;
    return H.h * Math.pow(1 - rr * rr, 0.85);
  }
  function hangRoh(x, y, Z) {
    let h = Math.max(kuppel(x, y, HUEGEL), kuppel(x, y, SCHULTER) * 0.98 + kuppel(x, y, HUEGEL) * 0.25);
    if (h <= 0) return 0;
    /* Felsbuckel und Bänke: großes Rauschen, dazu Gesteinsstufen (Absätze) */
    const rand = glatt(0, 1.2, h);
    h += ((FBM(x * 0.32 + 3, y * 0.32 + 7, 3, 821) - 0.5) * 1.6 + (1 - Math.abs(2 * FBM(x * 0.8 + 1, y * 0.8 + 2, 2, 823) - 1)) * 0.35 - 0.17) * rand;
    const st = 0.85, q = h / st, fl = Math.floor(q), fr = q - fl;
    h = h * 0.8 + (fl + glatt(0.62, 1, fr)) * st * 0.2;
    /* Der Einschnitt vor dem Mundloch: Sohle auf null, steile Wände, Felswand bei yFace */
    const yFace = PY + (1 - Z.kerb) * 4.2;
    if (Z.kerb > 0 && y > yFace - 0.02) {
      const halb = 1.75 + 1.3 * klemm((y - yFace) / 3.6, 0, 1) + (R(y * 1.3, 3, 829) - 0.5) * 0.25;
      const wand = Math.max(0, Math.abs(x - PX) - halb) * 3.4;
      /* die Felswand selbst: auf 25 cm fast senkrecht */
      const face = y < yFace + 0.22 ? (1 - (y - yFace) / 0.22) * 99 : 0;
      h = Math.min(h, Math.max(wand, face));
    }
    return Math.max(0, h);
  }
  function haldeRoh(x, y, Z) {
    const r = HALDE.r * (0.55 + 0.45 * Z.halde), d = Math.hypot(x - HALDE.x, (y - HALDE.y) * 1.1);
    if (d >= r) return 0;
    const k = 1 - d / r;
    return HALDE.h * (0.45 + 0.55 * Z.halde) * Math.pow(k, 0.9) * (0.85 + 0.3 * R(x * 2.2, y * 2.2, 831));
  }
  const RASTER_SPEICHER = new Map();
  function raster(Z) {
    const key = Z.kerb.toFixed(3) + "|" + Z.halde.toFixed(3);
    if (RASTER_SPEICHER.has(key)) return RASTER_SPEICHER.get(key);
    const { x0, y0, d, nx, ny } = RASTER, N = nx * ny;
    const H = new Float32Array(N), MAT = new Uint8Array(N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = x0 + i * d, y = y0 + j * d, k = j * nx + i;
      const a = hangRoh(x, y, Z), b = haldeRoh(x, y, Z);
      if (b > a) { H[k] = b; MAT[k] = b > 0.01 ? 2 : 0; } else { H[k] = a; MAT[k] = a > 0.01 ? 1 : 0; }
    }
    /* Normalen (zentrale Differenzen) und Höhlungen (Mittel über 1 m minus Höhe) */
    const NX = new Float32Array(N), NY = new Float32Array(N), NZ = new Float32Array(N), AO = new Float32Array(N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      const hl = H[j * nx + Math.max(0, i - 1)], hr = H[j * nx + Math.min(nx - 1, i + 1)], ho = H[Math.max(0, j - 1) * nx + i], hu = H[Math.min(ny - 1, j + 1) * nx + i];
      const n = norm([-(hr - hl) / (2 * d), -(hu - ho) / (2 * d), 1]);
      NX[k] = n[0]; NY[k] = n[1]; NZ[k] = n[2];
    }
    /* Kastenunschärfe (Radius 6 Zellen) zweimal */
    const tmp = new Float32Array(N), bl = new Float32Array(N), r = 6;
    for (let j = 0; j < ny; j++) { let s = 0; for (let i = -r; i <= r; i++) s += H[j * nx + klemm(i, 0, nx - 1)]; for (let i = 0; i < nx; i++) { tmp[j * nx + i] = s / (2 * r + 1); s += H[j * nx + Math.min(nx - 1, i + r + 1)] - H[j * nx + Math.max(0, i - r)]; } }
    for (let i = 0; i < nx; i++) { let s = 0; for (let j = -r; j <= r; j++) s += tmp[klemm(j, 0, ny - 1) * nx + i]; for (let j = 0; j < ny; j++) { bl[j * nx + i] = s / (2 * r + 1); s += tmp[Math.min(ny - 1, j + r + 1) * nx + i] - tmp[Math.max(0, j - r) * nx + i]; } }
    for (let k = 0; k < N; k++) AO[k] = klemm(1 - (bl[k] - H[k]) * 0.42, 0.55, 1.08);
    let hmax = 0; for (let k = 0; k < N; k++) if (H[k] > hmax) hmax = H[k];
    const G = { H: H, MAT: MAT, NX: NX, NY: NY, NZ: NZ, AO: AO, hmax: hmax };
    RASTER_SPEICHER.set(key, G);
    if (RASTER_SPEICHER.size > 8) RASTER_SPEICHER.delete(RASTER_SPEICHER.keys().next().value);
    return G;
  }
  /* bilinear im Raster; außerhalb 0 */
  function wert(A, x, y) {
    const { x0, y0, d, nx, ny } = RASTER;
    const u = (x - x0) / d, v = (y - y0) / d;
    if (u < 0 || v < 0 || u >= nx - 1 || v >= ny - 1) return 0;
    const i = u | 0, j = v | 0, fu = u - i, fv = v - j, k = j * nx + i;
    const a = A[k], b = A[k + 1], c = A[k + nx], e = A[k + nx + 1];
    return a + (b - a) * fu + (c - a) * fv + (a - b - c + e) * fu * fv;
  }
  function zelle(A, x, y) {
    const { x0, y0, d, nx, ny } = RASTER;
    const i = Math.round((x - x0) / d), j = Math.round((y - y0) / d);
    if (i < 0 || j < 0 || i >= nx || j >= ny) return 0;
    return A[j * nx + i];
  }
  ST.BERGSTOLLEN = { PX: PX, PY: PY, OEFF_B: OEFF_B, OEFF_H: OEFF_H, LAMPE: LAMPE, hoehe: (x, y) => wert(raster(zustand(1)).H, x, y) };

  /* ---------------- Licht (wie ST.lichtFaktor, mit Sonnenschatten und Grubenlampe) ---------------- */
  function lichtMit(nw, Z, jahr, sonne, out) {
    const k = Math.max(0, nw[0] * LICHT[0] + nw[1] * LICHT[1] + nw[2] * LICHT[2]) * sonne;
    const oben = 0.82 + 0.18 * Math.max(0, nw[2]);
    const seit = Math.max(0, 1 - Math.abs(nw[2]) - Math.max(0, nw[2]) * 0.5);
    const hl = Z.amb[1] + Z.sonne[1] * 0.6;
    const winter = jahr === "winter";
    const r0 = winter ? 0.2 : 0.08, r1 = winter ? 0.21 : 0.1, r2 = winter ? 0.23 : 0.06;
    out[0] = Math.min(1, Z.amb[0] * oben + Z.sonne[0] * k * 1.35 + r0 * seit * hl);
    out[1] = Math.min(1, Z.amb[1] * oben + Z.sonne[1] * k * 1.35 + r1 * seit * hl);
    out[2] = Math.min(1, Z.amb[2] * oben + Z.sonne[2] * k * 1.35 + r2 * seit * hl);
    return out;
  }
  /* warmes Licht der Grubenlampe (Modellkoordinaten), 0 bei Tag */
  function lampenLicht(p, n, nacht, an) {
    if (!(nacht > 0.05) || !an) return 0;
    const dx = LAMPE[0] - p[0], dy = LAMPE[1] - p[1], dz = LAMPE[2] - p[2], d = Math.hypot(dx, dy, dz) || 1;
    if (d > 8) return 0;
    const lam = n ? Math.max(0, (n[0] * dx + n[1] * dy + n[2] * dz) / d) * 0.8 + 0.2 : 1;
    return nacht * 1.25 * lam / (1 + (d / 1.9) * (d / 1.9));
  }
  const WARM = [1.0, 0.72, 0.42];

  /* =====================================================================
     DIE FIGUR: alles in einem Bild
     ===================================================================== */
  function figur(Z) {
    return function (g, s, F) {
      const gier = (F.gier || 0) * Math.PI / 180, c = Math.cos(gier), sn = Math.sin(gier);
      const G = raster(Z);
      const jahr = F.jahr === "winter" ? "winter" : "herbst";
      const nacht = F.nacht || 0;
      /* Licht im Modell (für Sonnenschatten): Welt → Modell = Drehung zurück */
      const LM = [LICHT[0] * c + LICHT[1] * sn, -LICHT[0] * sn + LICHT[1] * c, LICHT[2]];
      const dreh = (v) => [v[0] * c - v[1] * sn, v[0] * sn + v[1] * c, v[2]];
      if (F.schatten) { schattenMalen(g, s, c, sn, LM, G, Z); return; }

      /* ---- Arbeitsfläche (überabgetastet) ---- */
      const SS = s <= 30 ? 3 : 2, S = s * SS;
      const bildXY = (x, y, z) => { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX, (a + b) * KY - z * KZ]; };
      let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
      const nimm = (x, y, z) => { const p = bildXY(x, y, z); if (p[0] < bx0) bx0 = p[0]; if (p[0] > bx1) bx1 = p[0]; if (p[1] < by0) by0 = p[1]; if (p[1] > by1) by1 = p[1]; };
      const { x0, y0, d, nx, ny } = RASTER;
      for (let j = 0; j < ny; j += 3) for (let i = 0; i < nx; i += 3) { const h = G.H[j * nx + i]; if (h > 0.01 || (i % 12 === 0 && j % 12 === 0)) { nimm(x0 + i * d, y0 + j * d, h); nimm(x0 + i * d, y0 + j * d, 0); } }
      nimm(GERUEST.x, GERUEST.y, G.hmax + 5.6);
      for (const f of FICHTEN) nimm(f[0], f[1], wert(G.H, f[0], f[1]) + f[2] + 0.3);
      nimm(PX, GLEIS_BIS, 0); nimm(PX - 3.8, PY + 3.5, 1.2);
      const RANDM = 0.25;
      bx0 -= RANDM; by0 -= RANDM; bx1 += RANDM; by1 += RANDM;
      const W = Math.ceil((bx1 - bx0) * S), H = Math.ceil((by1 - by0) * S);
      const CX = -bx0 * S, CY = -by0 * S;                       // Fußpunkt in der Arbeitsfläche
      const bild = document.createElement("canvas"); bild.width = W; bild.height = H;
      const bg = bild.getContext("2d");
      const pix = bg.createImageData(W, H), P8 = pix.data;
      const TIEFE = new Float32Array(W * H).fill(-1e9);
      const proj = (x, y, z) => { const a = x * c - y * sn, b = x * sn + y * c; return [CX + (a - b) * KX * S, CY + (a + b) * KY * S - z * KZ * S]; };
      const tiefe = (x, y, z) => { const a = x * c - y * sn, b = x * sn + y * c; return (a + b) * AUGE[0] + z * AUGE[2]; };

      /* ---- 1) Der Hang: Spalte für Spalte von vorn nach hinten ---- */
      const ecken = [[x0, y0], [x0 + nx * d, y0], [x0, y0 + ny * d], [x0 + nx * d, y0 + ny * d]].map((p) => p[0] * c - p[1] * sn + p[0] * sn + p[1] * c);
      const vMin = Math.min(...ecken) - 0.5, vMax = Math.max(...ecken) + 0.5;
      const dv = 0.7 / (KY * S);
      const lf = [0, 0, 0], nw = [0, 0, 0];
      const winter = jahr === "winter";
      const lampeAn = Z.zubehoer;
      /* Sonnenschatten im Raster vorrechnen (für flache Stellen); steile rechnen je Bildpunkt */
      const LL = Math.hypot(LM[0], LM[1]) || 1, lx = LM[0] / LL, ly = LM[1] / LL, lz = LM[2] / LL;
      const schattenAn = (x, y, z) => {
        let hell = 1, dd = 0.12;
        for (let k = 0; k < 34; k++) {
          dd += 0.1 + dd * 0.12;
          const px = x + lx * dd, py = y + ly * dd, pz = z + lz * dd + 0.04;
          if (pz > G.hmax + 0.2) break;
          const h = wert(G.H, px, py);
          if (h > pz) { hell = Math.min(hell, klemm(1 - (h - pz) * 6 / (0.6 + dd * 0.4), 0, 1)); if (hell <= 0) return 0; }
        }
        return hell;
      };
      const SCH = new Float32Array(nx * ny);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const k = j * nx + i; if (G.MAT[k]) SCH[k] = schattenAn(x0 + i * d, y0 + j * d, G.H[k]); }
      const farbe = [0, 0, 0];
      /* Oberfläche: Fels (Bänke, Klüfte, Flechten), Gras/Schnee auf flachen Stellen, Schotter auf der Halde */
      const oberflaeche = (mat, x, y, z, n0, n1, n2) => {
        const steil = 1 - n2;
        if (mat === 2) {
          const k = R(x * 7.1, y * 7.1, 841), k2 = R(x * 2.3 + z, y * 2.3, 843);
          let f = misch(SCHOTTER, SCHOTTER_H, klemm(k * 0.9 + k2 * 0.3 - 0.2, 0, 1));
          const erz = R(x * 11, y * 11, 847);
          if (erz > 0.82) f = misch(f, ERZ[(Math.floor(x * 3) + Math.floor(y * 3) + 9) % 3], (erz - 0.82) * 3);
          if (winter) f = misch(f, SCHNEE, glatt(0.35, 0.6, n2 + (k2 - 0.5) * 0.5));
          farbe[0] = f[0]; farbe[1] = f[1]; farbe[2] = f[2]; return;
        }
        /* Texturkoordinaten: flach (x, y), steil längs der Wand (u, z) */
        const tl = Math.hypot(n0, n1) || 1, tx = -n1 / tl, ty = n0 / tl;
        const U = x * (1 - steil) + (x * tx + y * ty) * steil, V = y * (1 - steil) + z * 1.25 * steil;
        const gross = FBM(U * 0.55 + 11, V * 0.55 + 5, 3, 851);
        let f = misch(FELS_D, FELS_H, klemm(gross * 1.5 - 0.25, 0, 1));
        f = misch(f, FELS_K, klemm(R(U * 0.9, V * 0.9, 853) - 0.35, 0, 0.6));
        /* Gesteinsbänke: waagerechte Fugen in der Wand */
        const bank = Math.abs(((z * 1.35 + gross * 1.6) % 1 + 1) % 1 - 0.5);
        if (steil > 0.45 && bank > 0.455) f = misch(f, [70, 62, 50], (bank - 0.455) * 11 * glatt(0.45, 0.85, steil));
        /* Klüfte: dunkle, gezackte Risse */
        const kluft = Math.abs(R(U * 1.7 + 3, V * 0.6, 857) - 0.5);
        if (steil > 0.45 && kluft < 0.02) f = misch(f, [58, 50, 40], (1 - kluft / 0.02) * 0.6 * glatt(0.45, 0.8, steil));
        /* Flechten und Moos */
        const fl = R(U * 3.3, V * 3.3, 859);
        if (fl > 0.72) f = misch(f, winter ? [150, 156, 150] : [120, 128, 70], (fl - 0.72) * 2.2);
        /* feines Korn */
        const korn = (ST.hash2(Math.floor(U * 40), Math.floor(V * 40), 861) - 0.5) * 16;
        f[0] += korn; f[1] += korn; f[2] += korn;
        const noise = FBM(x * 0.6 + 17, y * 0.6 + 3, 2, 863) - 0.5;
        if (winter) {
          const sch = glatt(0.3, 0.52, n2 + noise * 0.8 + (R(x * 1.7, z * 1.4 + y, 873) - 0.5) * 0.35 + (z > 0.6 ? 0.05 : -0.05));
          if (sch > 0) { const k = R(x * 5, y * 5, 865); f = misch(f, misch(SCHNEE, [222, 228, 238], k * 0.5), sch); }
        } else {
          const gr = glatt(0.5, 0.7, n2 + noise * 0.45 + z * 0.012);
          if (gr > 0) {
            const k = R(x * 1.3 + 7, y * 1.3, 867), halm = ST.hash2(Math.floor(x * 30), Math.floor(y * 30), 869);
            let gc = misch(GRAS_D, GRAS_H, k);
            gc = misch(gc, GRAS_HERBST, glatt(0.55, 0.85, R(x * 0.7, y * 0.7, 871)) * 0.6);
            gc = misch(gc, halm > 0.5 ? GRAS_H : GRAS_D, 0.25);
            f = misch(f, gc, gr);
          }
        }
        farbe[0] = f[0]; farbe[1] = f[1]; farbe[2] = f[2];
      };
      const bodenLicht = (x, y, z, n0, n1, n2, sonne, ao) => {
        const n = dreh([n0, n1, n2]);
        nw[0] = n[0]; nw[1] = n[1]; nw[2] = n[2];
        lichtMit(nw, F.Z, jahr, sonne, lf);
        const w = lampenLicht([x, y, z], [n0, n1, n2], nacht, lampeAn);
        lf[0] = (lf[0] + WARM[0] * w) * ao; lf[1] = (lf[1] + WARM[1] * w) * ao; lf[2] = (lf[2] + WARM[2] * w) * ao;
      };
      for (let px = 0; px < W; px++) {
        const u = (px + 0.5 - CX) / (KX * S);
        let rTop = H, pv = 0, ph = 0, pY = 0, erst = true;
        for (let v = vMax; v >= vMin; v -= dv) {
          const a = (u + v) / 2, b = (v - u) / 2;
          const x = a * c + b * sn, y = -a * sn + b * c;
          const h = wert(G.H, x, y);
          const Y = CY + v * KY * S - h * KZ * S;
          if (erst) { pv = v; ph = h; pY = Y; erst = false; rTop = Math.min(rTop, Math.ceil(Y - 0.5)); continue; }
          const r0 = Math.ceil(Y - 0.5);
          if (r0 < rTop) {
            for (let r = Math.max(0, r0); r < rTop && r < H; r++) {
              const yc = r + 0.5, t = pY - Y > 1e-6 ? klemm((pY - yc) / (pY - Y), 0, 1) : 1;
              const vv = pv + (v - pv) * t, hh = ph + (h - ph) * t;
              if (hh < 0.012) continue;
              const aa = (u + vv) / 2, bb = (vv - u) / 2, xx = aa * c + bb * sn, yy = -aa * sn + bb * c;
              const mat = zelle(G.MAT, xx, yy) || zelle(G.MAT, x, y) || 1;
              const n0 = wert(G.NX, xx, yy), n1 = wert(G.NY, xx, yy), n2 = Math.max(0.02, wert(G.NZ, xx, yy));
              const nl = Math.hypot(n0, n1, n2);
              const m0 = n0 / nl, m1 = n1 / nl, m2 = n2 / nl;
              oberflaeche(mat, xx, yy, hh, m0, m1, m2);
              const sonne = m2 < 0.55 ? schattenAn(xx, yy, hh) : wert(SCH, xx, yy);
              bodenLicht(xx, yy, hh, m0, m1, m2, sonne, wert(G.AO, xx, yy) * (0.86 + 0.14 * glatt(0, 0.9, hh)));
              const o = (r * W + px) * 4;
              P8[o] = farbe[0] * lf[0]; P8[o + 1] = farbe[1] * lf[1]; P8[o + 2] = farbe[2] * lf[2]; P8[o + 3] = 255;
              TIEFE[r * W + px] = vv * AUGE[0] + hh * AUGE[2];
            }
            rTop = Math.max(0, r0);
          }
          pv = v; ph = h; pY = Y;
        }
      }

      /* ---- 2) Das Gebaute: kleine Bilder, nur wo sie vor dem Hang liegen ---- */
      const dinge = [];
      const K = { s: S, proj: proj, tiefe: tiefe, dreh: dreh, c: c, sn: sn, jahr: jahr, winter: winter, nacht: nacht, Z: F.Z, lampeAn: lampeAn, G: G };
      K.licht = (n, p) => {
        const nn = dreh(n);
        const l = ST.lichtFaktor(nn, F.Z, 0, jahr);
        const w = p ? lampenLicht(p, n, nacht, lampeAn) : 0;
        return [l[0] + WARM[0] * w, l[1] + WARM[1] * w, l[2] + WARM[2] * w];
      };
      K.sicht = (n) => { const m = dreh(n); return m[0] * AUGE[0] + m[1] * AUGE[1] + m[2] * AUGE[2]; };
      K.farbe = (f, l) => rgbS([Math.min(255, f[0] * l[0]), Math.min(255, f[1] * l[1]), Math.min(255, f[2] * l[2])]);
      gebautes(dinge, K, Z, F);
      dinge.sort((p, q) => p.d - q.d);
      const zw = document.createElement("canvas"); zw.width = W; zw.height = H;
      const zg = zw.getContext("2d");
      for (const e of dinge) {
        /* Rahmen im Bild */
        let ax = Infinity, ay = Infinity, ex = -Infinity, ey = -Infinity;
        for (const p of e.box) { const q = proj(p[0], p[1], p[2]); if (q[0] < ax) ax = q[0]; if (q[0] > ex) ex = q[0]; if (q[1] < ay) ay = q[1]; if (q[1] > ey) ey = q[1]; }
        const rr = (e.rand || 0.3) * S;
        ax = Math.max(0, Math.floor(ax - rr)); ay = Math.max(0, Math.floor(ay - rr)); ex = Math.min(W, Math.ceil(ex + rr)); ey = Math.min(H, Math.ceil(ey + rr));
        if (ex <= ax || ey <= ay) continue;
        zg.save(); zg.clearRect(ax, ay, ex - ax, ey - ay); zg.beginPath(); zg.rect(ax, ay, ex - ax, ey - ay); zg.clip();
        e.mal(zg, K);
        zg.restore();
        const D = zg.getImageData(ax, ay, ex - ax, ey - ay).data, bw = ex - ax;
        /* Tiefe je Bildpunkt: feste Tiefe oder aus der Ebene */
        let eb = null;
        if (e.ebene) {
          const Nw = dreh(e.ebene.n), Pw = dreh(e.ebene.p);
          const kk = KZ / KY, nenner = kk * (Nw[0] + Nw[1]) / 2 + Nw[2];
          if (Math.abs(nenner) > 0.05) eb = { Nw: Nw, D: Nw[0] * Pw[0] + Nw[1] * Pw[1] + Nw[2] * Pw[2], nenner: nenner, kk: kk };
        }
        const bias = e.bias == null ? 0.05 : e.bias;
        for (let yy = ay; yy < ey; yy++) for (let xx = ax; xx < ex; xx++) {
          const o = ((yy - ay) * bw + (xx - ax)) * 4, al = D[o + 3];
          if (!al) continue;
          const i = yy * W + xx;
          let dd = e.d;
          if (eb) {
            const U = (xx + 0.5 - CX) / (KX * S), V0 = (yy + 0.5 - CY) / (KY * S);
            const z = (eb.D - eb.Nw[0] * (U + V0) / 2 - eb.Nw[1] * (V0 - U) / 2) / eb.nenner;
            dd = (V0 + z * eb.kk) * AUGE[0] + z * AUGE[2];
          }
          if (TIEFE[i] > dd + bias) continue;
          const A = al / 255, q = i * 4, fa = P8[q + 3] / 255, oa = A + fa * (1 - A);
          if (oa <= 0) continue;
          P8[q] = (D[o] * A + P8[q] * fa * (1 - A)) / oa;
          P8[q + 1] = (D[o + 1] * A + P8[q + 1] * fa * (1 - A)) / oa;
          P8[q + 2] = (D[o + 2] * A + P8[q + 2] * fa * (1 - A)) / oa;
          P8[q + 3] = oa * 255;
          if (!e.flach && A > 0.5) TIEFE[i] = Math.max(TIEFE[i], dd);
        }
      }
      zw.width = 0;
      bg.putImageData(pix, 0, 0);
      /* ---- 3) Verkleinert in die Figur ---- */
      g.save();
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      if (SS === 2) g.drawImage(bild, 0, 0, W, H, bx0 * s, by0 * s, W / SS, H / SS);
      else {
        /* dreifach: erst halbieren, dann auf ein Drittel (sauberer als in einem Schritt) */
        const m = document.createElement("canvas"); m.width = Math.ceil(W / 1.5); m.height = Math.ceil(H / 1.5);
        const mg = m.getContext("2d"); mg.imageSmoothingQuality = "high"; mg.drawImage(bild, 0, 0, m.width, m.height);
        g.drawImage(m, 0, 0, m.width, m.height, bx0 * s, by0 * s, W / SS, H / SS);
        m.width = 0;
      }
      g.restore();
      bild.width = 0;
    };
  }

  /* =====================================================================
     SCHATTEN auf dem Boden (Hang, Gerüst, Fichten, Lampe, Lore)
     ===================================================================== */
  function schattenMalen(g, s, c, sn, LM, G, Z) {
    const m = g.getTransform();
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    const P = (x, y, z) => { const sx = x - LM[0] / LM[2] * z, sy = y - LM[1] / LM[2] * z; const a = sx * c - sy * sn, b = sx * sn + sy * c; return [(a - b) * KX * s, (a + b) * KY * s]; };
    const { x0, y0, d, nx, ny } = RASTER, st = 4;
    g.strokeStyle = "#000"; g.fillStyle = "#000"; g.lineCap = "round";
    g.lineWidth = Math.max(1, d * st * s * 1.25);
    g.beginPath();
    for (let j = 0; j < ny; j += st) for (let i = 0; i < nx; i += st) {
      const h = G.H[j * nx + i]; if (h < 0.05) continue;
      const x = x0 + i * d, y = y0 + j * d, a = P(x, y, 0), b = P(x, y, h);
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
    }
    g.stroke();
    /* Kontaktschatten: der Fuß des Hangs, weich */
    g.save(); g.filter = "blur(" + Math.max(1, s * 0.35).toFixed(1) + "px)"; g.globalAlpha = 0.6;
    g.beginPath();
    for (let j = 0; j < ny; j += st) for (let i = 0; i < nx; i += st) { const h = G.H[j * nx + i]; if (h < 0.05) continue; const a = P(x0 + i * d, y0 + j * d, 0); g.moveTo(a[0] + d * st * s, a[1]); g.arc(a[0], a[1], d * st * s * 1.6, 0, TAU); }
    g.fill(); g.restore();
    /* Gerüst, Fichten, Lampe, Lore als Striche */
    const strich = (p0, p1, b) => { const a = P(p0[0], p0[1], p0[2]), e = P(p1[0], p1[1], p1[2]); g.lineWidth = Math.max(0.6, b * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(e[0], e[1]); g.stroke(); };
    if (Z.geruest > 0) for (const t of geruestHoelzer(G, Z)) strich(t.a, t.b, t.r * 2);
    for (const f of FICHTEN) { const z0 = wert(G.H, f[0], f[1]); strich([f[0], f[1], z0], [f[0], f[1], z0 + f[2]], f[2] * 0.32); }
    if (Z.zubehoer) {
      strich([PX - 1.95, PY + 0.72, 0], [PX - 1.95, PY + 0.72, 2.6], 0.18);
      strich([PX, LORE_Y - 0.6, 0.6], [PX, LORE_Y + 0.6, 0.6], 1.0);
    }
    g.restore();
  }

  /* =====================================================================
     DAS GEBAUTE
     Jedes Ding: { d (Tiefe, größer = näher), box (Eckpunkte fürs Bild),
     mal(g, K), ebene? {p, n} (Tiefe je Bildpunkt), flach? (liegt auf dem
     Boden), bias? }
     ===================================================================== */
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
  /* Rundholz von p0 nach p1 (Radius r): Band mit Licht quer über die Rundung, Stirnflächen hell */
  function rundholz(g, K, p0, p1, r, f, o) {
    o = o || {};
    const A = K.proj(p0[0], p0[1], p0[2]), B = K.proj(p1[0], p1[1], p1[2]);
    const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1;
    const qx = -dy / l, qy = dx / l, w = r * K.s;
    /* Normale der Seite, die im Bild bei (qx, qy) liegt: grob aus der Achse und der Blickrichtung */
    const ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], al = Math.hypot(ax[0], ax[1], ax[2]) || 1;
    const t = [ax[0] / al, ax[1] / al, ax[2] / al];
    /* zwei Seitennormalen (senkrecht zur Achse), eine nach oben/außen */
    const hoch = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    const n1 = norm([hoch[0] - t[0] * (hoch[0] * t[0] + hoch[1] * t[1] + hoch[2] * t[2]), hoch[1] - t[1] * (hoch[0] * t[0] + hoch[1] * t[1] + hoch[2] * t[2]), hoch[2] - t[2] * (hoch[0] * t[0] + hoch[1] * t[1] + hoch[2] * t[2])]);
    const n2 = norm([t[1] * n1[2] - t[2] * n1[1], t[2] * n1[0] - t[0] * n1[2], t[0] * n1[1] - t[1] * n1[0]]);
    const m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2];
    /* welche Normale zeigt im Bild nach (qx, qy)? */
    const bildRicht = (n) => { const e = K.proj(m[0] + n[0], m[1] + n[1], m[2] + n[2]), mm = K.proj(m[0], m[1], m[2]); return (e[0] - mm[0]) * qx + (e[1] - mm[1]) * qy; };
    const k1 = bildRicht(n1), k2 = bildRicht(n2);
    const nq = Math.abs(k1) > Math.abs(k2) ? (k1 > 0 ? n1 : n1.map((v) => -v)) : (k2 > 0 ? n2 : n2.map((v) => -v));
    const auge = [K.dreh([1, 0, 0]), K.dreh([0, 1, 0]), K.dreh([0, 0, 1])];
    void auge;
    const nv = (k) => norm([nq[0] * k, nq[1] * k, nq[2] * k]);
    /* Blick-Normale: senkrecht zu Achse und nq, zum Auge */
    let nb = norm([t[1] * nq[2] - t[2] * nq[1], t[2] * nq[0] - t[0] * nq[2], t[0] * nq[1] - t[1] * nq[0]]);
    if (K.sicht(nb) < 0) nb = nb.map((v) => -v);
    const farbeBei = (k) => { const n = norm([nq[0] * k + nb[0] * Math.sqrt(Math.max(0, 1 - k * k)), nq[1] * k + nb[1] * Math.sqrt(Math.max(0, 1 - k * k)), nq[2] * k + nb[2] * Math.sqrt(Math.max(0, 1 - k * k))]); return K.farbe(f, K.licht(n, m)); };
    void nv;
    const gr = g.createLinearGradient(A[0] - qx * w, A[1] - qy * w, A[0] + qx * w, A[1] + qy * w);
    gr.addColorStop(0, farbeBei(-0.95)); gr.addColorStop(0.3, farbeBei(-0.45)); gr.addColorStop(0.55, farbeBei(0.1)); gr.addColorStop(0.8, farbeBei(0.6)); gr.addColorStop(1, farbeBei(0.95));
    g.fillStyle = gr;
    vieleck(g, [[A[0] + qx * w, A[1] + qy * w], [B[0] + qx * w, B[1] + qy * w], [B[0] - qx * w, B[1] - qy * w], [A[0] - qx * w, A[1] - qy * w]]);
    g.fill();
    /* Rinde: feine dunkle Längsstriche (nah) */
    if (w > 3 && !o.glatt) {
      g.save(); g.clip();
      g.strokeStyle = "rgba(40,26,14,0.35)"; g.lineWidth = Math.max(0.5, w * 0.08);
      for (let i = 0; i < 5; i++) { const k = -0.8 + i * 0.4 + (ST.hash2(i, Math.round(p0[0] * 10), 3) - 0.5) * 0.2; g.beginPath(); g.moveTo(A[0] + qx * w * k, A[1] + qy * w * k); g.lineTo(B[0] + qx * w * k, B[1] + qy * w * k); g.stroke(); }
      g.restore();
    }
    /* Schnee oben auf liegenden Hölzern */
    if (K.winter && Math.abs(t[2]) < 0.6 && !o.ohneSchnee) {
      const oben = qy < 0 ? 1 : -1;
      g.strokeStyle = "rgba(246,248,252,0.95)"; g.lineWidth = Math.max(0.8, w * 0.55); g.lineCap = "round";
      g.beginPath(); g.moveTo(A[0] + qx * w * 0.7 * oben, A[1] + qy * w * 0.7 * oben); g.lineTo(B[0] + qx * w * 0.7 * oben, B[1] + qy * w * 0.7 * oben); g.stroke();
    }
    /* Stirnfläche (Hirnholz) zeigt zum Auge? */
    for (const [p, sg] of [[p0, -1], [p1, 1]]) {
      if (!o.stirn) continue;
      const n = [t[0] * sg, t[1] * sg, t[2] * sg];
      if (K.sicht(n) <= 0.05) continue;
      const P = K.proj(p[0], p[1], p[2]);
      /* Ellipse in der Ebene senkrecht zur Achse */
      const e1 = K.proj(p[0] + n1[0] * r, p[1] + n1[1] * r, p[2] + n1[2] * r), e2 = K.proj(p[0] + n2[0] * r, p[1] + n2[1] * r, p[2] + n2[2] * r);
      g.save(); g.transform(e1[0] - P[0], e1[1] - P[1], e2[0] - P[0], e2[1] - P[1], P[0], P[1]);
      const l2 = K.licht(n, p);
      g.fillStyle = K.farbe([206, 170, 118], l2); g.beginPath(); g.arc(0, 0, 1, 0, TAU); g.fill();
      g.strokeStyle = K.farbe([150, 112, 70], l2); g.lineWidth = 0.08; g.beginPath(); g.arc(0, 0, 0.62, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 0.3, 0, TAU); g.stroke();
      g.strokeStyle = K.farbe([96, 64, 34], l2); g.lineWidth = 0.14; g.beginPath(); g.arc(0, 0, 0.95, 0, TAU); g.stroke();
      g.restore();
    }
  }
  /* ebenes Viereck im Raum mit Licht */
  function platte(g, K, pts, f, n, alpha) {
    if (K.sicht(n) < 0) n = n.map((v) => -v);
    const m = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length, a[2] + p[2] / pts.length], [0, 0, 0]);
    g.fillStyle = K.farbe(f, K.licht(n, m));
    if (alpha != null) g.globalAlpha = alpha;
    vieleck(g, pts.map((p) => K.proj(p[0], p[1], p[2]))); g.fill();
    g.strokeStyle = g.fillStyle; g.lineWidth = 0.6; g.stroke();
    g.globalAlpha = 1;
  }
  /* Quader: nur sichtbare Seiten */
  function klotz(g, K, x0, x1, y0, y1, z0, z1, f, fo) {
    const S = [
      [[[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0]],
      [[[x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]], [-1, 0, 0]],
      [[[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0]],
      [[[x1, y0, z0], [x0, y0, z0], [x0, y0, z1], [x1, y0, z1]], [0, -1, 0]],
      [[[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1]]
    ];
    for (const [pts, n] of S) if (K.sicht(n) > 0) platte(g, K, pts, (fo && n[2] > 0) ? fo : f, n);
  }

  /* Hölzer des Fördergerüsts (auch für den Schatten) */
  function geruestHoelzer(G, Z) {
    const z0 = wert(G.H, GERUEST.x, GERUEST.y) - 0.2, H4 = 3.7, W0 = 1.15, W1 = 0.55;
    const aus = [];
    const w = (z) => W0 + (W1 - W0) * klemm((z - z0) / H4, 0, 1);
    const B = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const g = Z.geruest;
    B.forEach((q, i) => { if (g > i * 0.08) aus.push({ a: [GERUEST.x + q[0] * W0, GERUEST.y + q[1] * W0, z0 - 0.1], b: [GERUEST.x + q[0] * W1, GERUEST.y + q[1] * W1, z0 + H4], r: 0.13, art: "bein" }); });
    const ring = (zr, k, art) => {
      const ww = w(zr);
      for (let i = 0; i < 4; i++) {
        const p = B[i], q = B[(i + 1) % 4];
        aus.push({ a: [GERUEST.x + p[0] * ww, GERUEST.y + p[1] * ww, zr], b: [GERUEST.x + q[0] * ww, GERUEST.y + q[1] * ww, zr], r: k, art: art });
      }
    };
    if (g > 0.4) ring(z0 + 1.85, 0.085, "riegel");
    if (g > 0.55) {
      /* Andreaskreuze im unteren Feld aller vier Seiten */
      const za = z0 + 0.15, zb = z0 + 1.85, wa = w(za), wb = w(zb);
      for (let i = 0; i < 4; i++) {
        const p = B[i], q = B[(i + 1) % 4];
        aus.push({ a: [GERUEST.x + p[0] * wa, GERUEST.y + p[1] * wa, za], b: [GERUEST.x + q[0] * wb, GERUEST.y + q[1] * wb, zb], r: 0.055, art: "strebe" });
        aus.push({ a: [GERUEST.x + q[0] * wa, GERUEST.y + q[1] * wa, za], b: [GERUEST.x + p[0] * wb, GERUEST.y + p[1] * wb, zb], r: 0.055, art: "strebe" });
      }
    }
    if (g > 0.7) ring(z0 + H4, 0.1, "kranz");
    return aus.map((t) => Object.assign(t, { z0: z0, H4: H4 }));
  }

  function gebautes(L, K, Z, F) {
    const G = K.G;
    /* ---- Zechenplatz: festgetretene Erde und Schotter vor dem Mundloch ---- */
    if (Z.kerb > 0.05) {
      const yF = PY + (1 - Z.kerb) * 4.2;
      const umriss = [];
      for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; const r = 1 + 0.12 * (R(i * 0.7, 2, 871) - 0.5); umriss.push([PX + Math.cos(a) * 2.6 * r, yF + 0.05 + Math.sin(a) * (GLEIS_BIS - yF + 0.4) * r]); }
      umriss.push([PX - 2.2, yF + 0.05]);
      L.push({ d: -1e6, flach: true, box: umriss.map((p) => [p[0], p[1], 0]), ebene: { p: [0, 0, 0.02], n: [0, 0, 1] }, bias: 0.3, mal(g, K) {
        const pts = umriss.map((p) => K.proj(p[0], p[1], 0.02));
        vieleck(g, pts);
        const l = K.licht([0, 0, 1], [PX, PY + 2, 0]);
        g.fillStyle = K.farbe(K.winter ? [214, 214, 216] : [120, 102, 80], l); g.fill();
        g.save(); g.clip();
        /* Kies und Erzbrocken, Karrenspuren */
        const n = Math.round(40 + 30 * Z.kerb);
        for (let i = 0; i < n; i++) {
          const x = PX + (ST.hash2(i, 1, 881) - 0.5) * 5, y = yF + ST.hash2(i, 2, 881) * (GLEIS_BIS - yF);
          const q = K.proj(x, y, 0.03), r = (0.05 + ST.hash2(i, 3, 881) * 0.09) * K.s;
          const f = ST.hash2(i, 4, 881) > 0.94 ? ERZ[i % 3] : misch(SCHOTTER, SCHOTTER_H, ST.hash2(i, 5, 881));
          g.fillStyle = K.farbe(f, l); g.beginPath(); g.ellipse(q[0], q[1], r, r * 0.55, 0, 0, TAU); g.fill();
        }
        if (K.winter) { g.fillStyle = "rgba(250,252,255,0.35)"; g.fillRect(-1e4, -1e4, 2e4, 2e4); }
        g.restore();
      } });
    }
    /* ---- Gleis: Schwellen und Schienen (flach) ---- */
    if (Z.gleis > 0) {
      const yA = PY + 0.05, yE = GLEIS_BIS, nS = Math.floor((yE - yA) / 0.5);
      L.push({ d: -9e5, flach: true, box: [[PX - 0.7, yA, 0], [PX + 0.7, yA, 0], [PX - 0.7, yE, 0.2], [PX + 0.7, yE, 0.2]], ebene: { p: [0, 0, 0.1], n: [0, 0, 1] }, bias: 0.25, mal(g, K) {
        const ls = K.licht([0, 0, 1], [PX, PY + 1.5, 0]);
        const bis = Math.round(nS * Math.min(1, Z.gleis * 2));
        for (let i = 0; i <= bis; i++) {
          const y = yE - i * 0.5 - 0.1;
          if (y < yA) break;
          const p = [[PX - 0.52, y - 0.09, 0.09], [PX + 0.52, y - 0.09, 0.09], [PX + 0.52, y + 0.09, 0.09], [PX - 0.52, y + 0.09, 0.09]].map((q) => K.proj(q[0], q[1], q[2]));
          vieleck(g, p); g.fillStyle = K.farbe(HOLZ_ALT, ls); g.fill();
          if (K.winter) { g.fillStyle = "rgba(246,248,252,0.7)"; g.fill(); }
        }
        if (Z.gleis > 0.5) {
          const bis2 = yE - (yE - yA) * klemm((Z.gleis - 0.5) * 2, 0, 1);
          for (const sx of [-GLEIS_SPUR, GLEIS_SPUR]) {
            const a = K.proj(PX + sx, bis2, 0.14), b = K.proj(PX + sx, yE, 0.14), a2 = K.proj(PX + sx, bis2, 0.1), b2 = K.proj(PX + sx, yE, 0.1);
            g.lineCap = "butt";
            g.strokeStyle = K.farbe([70, 62, 56], ls); g.lineWidth = Math.max(1, 0.07 * K.s); g.beginPath(); g.moveTo(a2[0], a2[1]); g.lineTo(b2[0], b2[1]); g.stroke();
            g.strokeStyle = K.farbe([196, 198, 204], ls); g.lineWidth = Math.max(0.8, 0.035 * K.s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
          }
          /* Prellbock am Ende */
          if (Z.gleis >= 1) {
            const pb = [[PX - 0.45, yE + 0.05, 0], [PX + 0.45, yE + 0.05, 0], [PX + 0.45, yE + 0.05, 0.55], [PX - 0.45, yE + 0.05, 0.55]];
            platte(g, K, pb, HOLZ_D, [0, 1, 0]);
          }
        }
      } });
    }
    /* ---- Mundloch: dunkler Stollen mit Türstöcken darin, Gleis ins Dunkel ---- */
    const yF = PY + (1 - Z.kerb) * 4.2;
    if (Z.loch > 0 && Z.kerb > 0.98) {
      const b = OEFF_B * (0.55 + 0.45 * Z.loch), h = OEFF_H * (0.5 + 0.5 * Z.loch);
      /* Rechteck mit gerundeten oberen Ecken (x, z) */
      const lochPts = [];
      const rund = 0.35;
      lochPts.push([PX - b / 2, 0]);
      for (let i = 0; i <= 6; i++) { const a = Math.PI - i / 6 * Math.PI / 2; lochPts.push([PX - b / 2 + rund + Math.cos(a) * rund, h - rund + Math.sin(a) * rund]); }
      for (let i = 0; i <= 6; i++) { const a = Math.PI / 2 - i / 6 * Math.PI / 2; lochPts.push([PX + b / 2 - rund + Math.cos(a) * rund, h - rund + Math.sin(a) * rund]); }
      lochPts.push([PX + b / 2, 0]);
      const lp3 = lochPts.map((p) => [p[0], yF + 0.24, p[1]]);
      L.push({ d: K.tiefe(PX, yF + 0.24, h / 2) + 0.02, box: lp3, ebene: { p: [PX, yF + 0.24, 0], n: [0, 1, 0] }, bias: 0.1, mal(g, K) {
        if (K.sicht([0, 1, 0]) <= 0.02) return;
        const pts = lp3.map((p) => K.proj(p[0], p[1], p[2]));
        vieleck(g, pts);
        g.fillStyle = "rgb(12,10,8)"; g.fill();
        g.save(); g.clip();
        /* Tiefe: Türstöcke im Stollen, je weiter hinten, desto dunkler */
        for (let k = 4; k >= 1; k--) {
          const yy = yF + 0.24 - k * 1.3, dunkel = Math.pow(0.52, k);
          const wand = K.farbe([60, 52, 42], [dunkel + (K.nacht > 0.3 ? 0.06 : 0), dunkel, dunkel]);
          /* Stollenwände (Fels) zwischen den Türstöcken */
          vieleck(g, [K.proj(PX - b / 2, yy + 1.3, 0), K.proj(PX - b / 2, yy, 0), K.proj(PX - b / 2, yy, h), K.proj(PX - b / 2, yy + 1.3, h)]); g.fillStyle = wand; g.fill();
          vieleck(g, [K.proj(PX + b / 2, yy + 1.3, 0), K.proj(PX + b / 2, yy, 0), K.proj(PX + b / 2, yy, h), K.proj(PX + b / 2, yy + 1.3, h)]); g.fillStyle = wand; g.fill();
          vieleck(g, [K.proj(PX - b / 2, yy + 1.3, h), K.proj(PX + b / 2, yy + 1.3, h), K.proj(PX + b / 2, yy, h), K.proj(PX - b / 2, yy, h)]); g.fillStyle = K.farbe([48, 42, 34], [dunkel * 0.8, dunkel * 0.8, dunkel * 0.8]); g.fill();
          vieleck(g, [K.proj(PX - b / 2, yy + 1.3, 0.01), K.proj(PX + b / 2, yy + 1.3, 0.01), K.proj(PX + b / 2, yy, 0.01), K.proj(PX - b / 2, yy, 0.01)]); g.fillStyle = K.farbe([46, 40, 32], [dunkel, dunkel, dunkel]); g.fill();
          if (Z.rahmen >= 1) {
            const holz = K.farbe(HOLZ_D, [dunkel * 1.3, dunkel * 1.2, dunkel * 1.1]);
            g.strokeStyle = holz; g.lineWidth = Math.max(1, 0.2 * K.s); g.lineCap = "butt";
            const a = K.proj(PX - b / 2 + 0.12, yy, 0), a2 = K.proj(PX - b / 2 + 0.2, yy, h - 0.1), e = K.proj(PX + b / 2 - 0.12, yy, 0), e2 = K.proj(PX + b / 2 - 0.2, yy, h - 0.1);
            g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a2[0], a2[1]); g.moveTo(e[0], e[1]); g.lineTo(e2[0], e2[1]); g.stroke();
            const k1 = K.proj(PX - b / 2, yy, h - 0.12), k2 = K.proj(PX + b / 2, yy, h - 0.12);
            g.beginPath(); g.moveTo(k1[0], k1[1]); g.lineTo(k2[0], k2[1]); g.stroke();
          }
          if (Z.gleis > 0.5) {
            g.strokeStyle = K.farbe([160, 162, 168], [dunkel * 1.2, dunkel * 1.2, dunkel * 1.3]); g.lineWidth = Math.max(0.6, 0.035 * K.s);
            for (const sx of [-GLEIS_SPUR, GLEIS_SPUR]) { const p = K.proj(PX + sx, yy, 0.14), q = K.proj(PX + sx, yy + 1.3, 0.14); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }
          }
        }
        /* Tief drinnen glimmt nachts ein Grubenlicht */
        if (K.nacht > 0.3 && Z.zubehoer) {
          const q = K.proj(PX + 0.2, yF - 5.4, 1.4), r = 0.9 * K.s;
          const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], r);
          gr.addColorStop(0, "rgba(255,196,120," + (0.55 * K.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,170,90,0)");
          g.fillStyle = gr; g.fillRect(q[0] - r, q[1] - r, 2 * r, 2 * r);
        }
        /* Rand: Laibung (die Felswand ist dick) */
        const gr = g.createLinearGradient(pts[0][0], pts[0][1], pts[pts.length - 1][0], pts[pts.length - 1][1]);
        gr.addColorStop(0, "rgba(0,0,0,0.55)"); gr.addColorStop(0.15, "rgba(0,0,0,0)"); gr.addColorStop(0.85, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.55)");
        g.fillStyle = gr; g.fillRect(-1e4, -1e4, 2e4, 2e4);
        g.restore();
      } });
    } else if (Z.kerb > 0.1 && Z.kerb <= 0.98) {
      /* noch im Graben: frische, dunkle Erde an der Wand */
      const b = 1.4 + Z.kerb, h = 0.8 + 1.6 * Z.kerb;
      const pts3 = [[PX - b / 2, yF + 0.03, 0], [PX + b / 2, yF + 0.03, 0], [PX + b / 2 - 0.2, yF + 0.03, h], [PX - b / 2 + 0.3, yF + 0.03, h * 0.9]];
      L.push({ d: K.tiefe(PX, yF, h / 2) + 0.02, box: pts3, ebene: { p: [PX, yF + 0.03, 0], n: [0, 1, 0] }, bias: 0.12, mal(g, K) {
        if (K.sicht([0, 1, 0]) <= 0.02) return;
        vieleck(g, pts3.map((p) => K.proj(p[0], p[1], p[2])));
        g.fillStyle = K.farbe([92, 74, 56], K.licht([0, 1, 0])); g.fill();
      } });
    }
    /* ---- Türstock: zwei Stempel und die Kappe, darüber der Verzug ---- */
    if (Z.rahmen > 0 && Z.kerb > 0.98) {
      const yR = yF + 0.42, hs = 2.85;
      for (const sx of [-1, 1]) {
        if (Z.rahmen < (sx < 0 ? 0.05 : 0.3)) continue;
        const p0 = [PX + sx * 1.22, yR, -0.05], p1 = [PX + sx * 1.08, yR, hs];
        L.push({ d: K.tiefe(p1[0], yR, hs / 2), box: [p0, p1], rand: 0.35, bias: 0.25, mal(g, K) { rundholz(g, K, p0, p1, 0.17, HOLZ, { stirn: true }); } });
      }
      if (Z.rahmen > 0.6) {
        const k0 = [PX - 1.65, yR + 0.02, hs + 0.14], k1 = [PX + 1.65, yR + 0.02, hs + 0.14];
        L.push({ d: K.tiefe(PX, yR + 0.02, hs) + 0.02, box: [k0, k1], rand: 0.4, bias: 0.3, mal(g, K) { rundholz(g, K, k0, k1, 0.2, HOLZ, { stirn: true }); } });
        /* Verzug: kurze Hölzer über der Kappe in den Fels */
        if (Z.rahmen > 0.85) for (let i = 0; i < 7; i++) {
          const x = PX - 1.35 + i * 0.45, v0 = [x, yR + 0.12, hs + 0.36], v1 = [x, yF - 0.3, hs + 0.46];
          L.push({ d: K.tiefe(x, yR, hs + 0.4) - 0.01, box: [v0, v1], rand: 0.3, bias: 0.35, mal(g, K) { rundholz(g, K, v0, v1, 0.09, HOLZ_ALT, { stirn: true, ohneSchnee: false }); } });
        }
      }
    }
    /* ---- Schild „Glück auf" mit Schlägel und Eisen über dem Mundloch ---- */
    if (Z.zubehoer && Z.kerb > 0.98) {
      const yS = yF + 0.3, z0 = 3.5, z1 = 4.05, xa = PX - 0.85, xb = PX + 0.85;
      const pts = [[xa, yS, z1], [xb, yS, z1], [xb, yS, z0], [xa, yS, z0]];
      L.push({ d: K.tiefe(PX, yS, z0) + 0.05, box: pts, ebene: { p: [PX, yS, z0], n: [0, 1, 0] }, bias: 0.25, mal(g, K) {
        if (K.sicht([0, 1, 0]) <= 0.05) return;
        const l = K.licht([0, 1, 0], [PX, yS, z0]);
        const A = K.proj(xa, yS, z1), B = K.proj(xb, yS, z1), C = K.proj(xa, yS, z0);
        const w = xb - xa, h = z1 - z0;
        g.save();
        g.transform((B[0] - A[0]) / w, (B[1] - A[1]) / w, (C[0] - A[0]) / h, (C[1] - A[1]) / h, A[0], A[1]);
        /* Brett mit Rand */
        g.fillStyle = K.farbe([118, 80, 44], l); g.fillRect(0, 0, w, h);
        g.fillStyle = K.farbe([150, 104, 58], l); g.fillRect(0.05, 0.05, w - 0.1, h - 0.1);
        g.strokeStyle = K.farbe([90, 58, 30], l); g.lineWidth = 0.012;
        for (let y = 0.14; y < h; y += 0.13) { g.beginPath(); g.moveTo(0.05, y); g.lineTo(w - 0.05, y); g.stroke(); }
        /* Schrift */
        g.fillStyle = K.farbe([30, 20, 12], l);
        g.font = "bold 0.25px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("GLÜCK AUF", w / 2 + 0.12, h / 2 + 0.02);
        /* Schlägel und Eisen (gekreuzt), links */
        g.strokeStyle = K.farbe([30, 20, 12], l); g.lineWidth = 0.035; g.lineCap = "round";
        g.save(); g.translate(0.2, h / 2);
        g.beginPath(); g.moveTo(-0.11, 0.13); g.lineTo(0.11, -0.13); g.moveTo(0.11, 0.13); g.lineTo(-0.11, -0.13); g.stroke();
        g.fillStyle = K.farbe([30, 20, 12], l); g.save(); g.translate(0.11, -0.13); g.rotate(-0.7); g.fillRect(-0.06, -0.03, 0.12, 0.06); g.restore();
        g.save(); g.translate(-0.11, -0.13); g.rotate(0.7); g.fillRect(-0.02, -0.04, 0.04, 0.1); g.restore();
        g.restore();
        if (K.winter) { g.fillStyle = "rgba(246,248,252,0.95)"; g.fillRect(-0.02, -0.04, w + 0.04, 0.06); }
        g.restore();
      } });
    }
    /* ---- Grubenlampe am Pfahl links vom Mundloch ---- */
    if (Z.zubehoer && Z.kerb > 0.98) {
      const pf0 = [PX - 1.95, PY + 0.72, -0.05], pf1 = [PX - 1.95, PY + 0.72, 2.62];
      L.push({ d: K.tiefe(pf0[0], pf0[1], 1.3), box: [pf0, pf1, [LAMPE[0], LAMPE[1], 2.6]], rand: 0.4, bias: 0.3, mal(g, K) {
        rundholz(g, K, pf0, pf1, 0.085, HOLZ_D, {});
        rundholz(g, K, [PX - 1.98, PY + 0.72, 2.5], [LAMPE[0] - 0.02, LAMPE[1], 2.5], 0.045, HOLZ_D, { glatt: true });
        /* Bügel und Lampe (Gehäuse, Glas, Dach) */
        const q = K.proj(LAMPE[0], LAMPE[1], 2.5), q2 = K.proj(LAMPE[0], LAMPE[1], LAMPE[2] + 0.2);
        g.strokeStyle = "rgb(40,36,34)"; g.lineWidth = Math.max(0.6, 0.025 * K.s); g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q2[0], q2[1]); g.stroke();
        const r = 0.11, z0 = LAMPE[2] - 0.17, z1 = LAMPE[2] + 0.17;
        klotz(g, K, LAMPE[0] - r, LAMPE[0] + r, LAMPE[1] - r, LAMPE[1] + r, z0, z1, [48, 44, 40]);
        const an = K.nacht > 0.05;
        for (const n of [[0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, -1, 0]]) {
          if (K.sicht(n) <= 0) continue;
          const t = [n[1], -n[0], 0], e = 0.075;
          const m = [LAMPE[0] + n[0] * (r + 0.005), LAMPE[1] + n[1] * (r + 0.005), LAMPE[2]];
          const pts = [[m[0] - t[0] * e, m[1] - t[1] * e, z0 + 0.05], [m[0] + t[0] * e, m[1] + t[1] * e, z0 + 0.05], [m[0] + t[0] * e, m[1] + t[1] * e, z1 - 0.06], [m[0] - t[0] * e, m[1] - t[1] * e, z1 - 0.06]];
          vieleck(g, pts.map((p) => K.proj(p[0], p[1], p[2])));
          g.fillStyle = an ? "rgb(255,226,150)" : K.farbe([190, 200, 196], K.licht(n)); g.fill();
        }
        /* Dach */
        const d0 = [[LAMPE[0] - r - 0.03, LAMPE[1] - r - 0.03, z1], [LAMPE[0] + r + 0.03, LAMPE[1] - r - 0.03, z1], [LAMPE[0] + r + 0.03, LAMPE[1] + r + 0.03, z1], [LAMPE[0] - r - 0.03, LAMPE[1] + r + 0.03, z1]];
        vieleck(g, d0.map((p) => K.proj(p[0], p[1], p[2]))); g.fillStyle = K.winter ? "rgb(240,244,250)" : K.farbe([40, 36, 34], K.licht([0, 0, 1])); g.fill();
        if (an) {
          const c0 = K.proj(LAMPE[0], LAMPE[1], LAMPE[2]), rr = 0.5 * K.s;
          const gr = g.createRadialGradient(c0[0], c0[1], 0, c0[0], c0[1], rr);
          gr.addColorStop(0, "rgba(255,236,180," + (0.8 * K.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,200,120,0)");
          g.fillStyle = gr; g.fillRect(c0[0] - rr, c0[1] - rr, 2 * rr, 2 * rr);
        }
      } });
    }
    /* ---- Lore (Hunt) voll Erz auf dem Gleis ---- */
    if (Z.zubehoer && Z.gleis >= 1) {
      const y = LORE_Y;
      L.push({ d: K.tiefe(PX, y, 0.7), box: [[PX - 0.6, y - 0.8, 0], [PX + 0.6, y + 0.8, 1.35]], rand: 0.3, bias: 0.3, mal(g, K) { lore(g, K, PX, y); } });
    }
    /* ---- Grubenholz links vor dem Hang ---- */
    if (Z.zubehoer) {
      const hx = PX - 3.25, hy = PY + 2.5, r = 0.16;
      const lagen = [[-0.34, 0, r], [0, 0, r], [0.34, 0, r], [-0.17, 0, 3 * r - 0.03], [0.17, 0, 3 * r - 0.03], [0, 0, 5 * r - 0.06]];
      for (const [dx, , z] of lagen) {
        const a = [hx - 1.1, hy + dx, z], b = [hx + 1.1, hy + dx, z];
        L.push({ d: K.tiefe(hx, hy + dx, z) + z * 0.1, box: [a, b], rand: 0.3, bias: 0.3, mal(g, K) { rundholz(g, K, a, b, r, HOLZ_ALT, { stirn: true }); } });
      }
    }
    /* ---- Fördergerüst auf der Kuppe (über dem Schacht) ---- */
    if (Z.geruest > 0) {
      const H = geruestHoelzer(G, Z);
      for (const t of H) {
        const m = [(t.a[0] + t.b[0]) / 2, (t.a[1] + t.b[1]) / 2, (t.a[2] + t.b[2]) / 2];
        L.push({ d: K.tiefe(m[0], m[1], m[2]), box: [t.a, t.b], rand: 0.3, bias: 0.3, mal(g, K) { rundholz(g, K, t.a, t.b, t.r, t.art === "bein" ? [118, 84, 52] : [132, 96, 60], { stirn: t.art !== "bein" }); } });
      }
      if (Z.geruest > 0.85) {
        const z0 = H[0].z0, zt = z0 + H[0].H4;
        /* Bühne oben, Seilscheibe darüber, Seil in den Schacht */
        L.push({ d: K.tiefe(GERUEST.x, GERUEST.y, zt + 0.8) + 0.2, box: [[GERUEST.x - 0.9, GERUEST.y - 0.9, zt], [GERUEST.x + 0.9, GERUEST.y + 0.9, zt + 1.7]], rand: 0.4, bias: 0.6, mal(g, K) {
          klotz(g, K, GERUEST.x - 0.6, GERUEST.x + 0.6, GERUEST.y - 0.6, GERUEST.y + 0.6, zt + 0.02, zt + 0.12, HOLZ, K.winter ? SCHNEE : null);
          /* Lagerböcke links und rechts der Scheibe */
          for (const sx of [-0.32, 0.32]) klotz(g, K, GERUEST.x + sx - 0.06, GERUEST.x + sx + 0.06, GERUEST.y - 0.06, GERUEST.y + 0.06, zt + 0.12, zt + 0.82, HOLZ_D);
          /* Seilscheibe: steht quer zum Betrachter (Ebene x–z), Achse längs y */
          const mZ = zt + 0.82, rS = 0.72;
          const vorn = K.sicht([0, 1, 0]) >= 0 ? 1 : -1;
          const ring = (rr, dy) => { const p = []; for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU; p.push(K.proj(GERUEST.x + Math.cos(a) * rr, GERUEST.y + dy, mZ + Math.sin(a) * rr)); } return p; };
          const l = K.licht([0, vorn, 0], [GERUEST.x, GERUEST.y, mZ]);
          g.strokeStyle = K.farbe([60, 60, 64], l); g.lineWidth = Math.max(1, 0.1 * K.s);
          vieleck(g, ring(rS, 0.04 * vorn)); g.stroke();
          g.strokeStyle = K.farbe([150, 44, 36], l); g.lineWidth = Math.max(0.8, 0.055 * K.s);
          vieleck(g, ring(rS - 0.09, 0.05 * vorn)); g.stroke();
          g.lineWidth = Math.max(0.6, 0.035 * K.s); g.beginPath();
          for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3; const p = K.proj(GERUEST.x, GERUEST.y + 0.05 * vorn, mZ), q = K.proj(GERUEST.x + Math.cos(a) * (rS - 0.1), GERUEST.y + 0.05 * vorn, mZ + Math.sin(a) * (rS - 0.1)); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); }
          g.stroke();
          const nb = K.proj(GERUEST.x, GERUEST.y + 0.06 * vorn, mZ); g.fillStyle = K.farbe([150, 44, 36], l); g.beginPath(); g.arc(nb[0], nb[1], Math.max(1, 0.1 * K.s), 0, TAU); g.fill();
          /* Seile: vom Scheibenrand senkrecht in den Schacht */
          g.strokeStyle = "rgba(40,38,36,0.9)"; g.lineWidth = Math.max(0.5, 0.025 * K.s); g.beginPath();
          for (const sx of [-rS, rS]) { const s0 = K.proj(GERUEST.x + sx, GERUEST.y, mZ), s1 = K.proj(GERUEST.x + sx * 0.5, GERUEST.y, z0 + 0.4); g.moveTo(s0[0], s0[1]); g.lineTo(s1[0], s1[1]); }
          g.stroke();
          /* Schnee auf der Scheibe oben */
          if (K.winter) { const p = K.proj(GERUEST.x, GERUEST.y, mZ + rS + 0.02); g.fillStyle = "rgba(246,248,252,0.95)"; g.beginPath(); g.ellipse(p[0], p[1], 0.18 * K.s, 0.05 * K.s, 0, 0, TAU); g.fill(); }
        } });
        /* Schachtkragen am Fuß (dunkel, mit Holzkranz) */
        L.push({ d: K.tiefe(GERUEST.x, GERUEST.y, z0) - 0.4, box: [[GERUEST.x - 0.8, GERUEST.y - 0.8, z0], [GERUEST.x + 0.8, GERUEST.y + 0.8, z0 + 0.5]], bias: 0.4, mal(g, K) {
          klotz(g, K, GERUEST.x - 0.62, GERUEST.x + 0.62, GERUEST.y - 0.62, GERUEST.y + 0.62, z0 + 0.1, z0 + 0.42, HOLZ_ALT);
          const pts = [[GERUEST.x - 0.45, GERUEST.y - 0.45, z0 + 0.43], [GERUEST.x + 0.45, GERUEST.y - 0.45, z0 + 0.43], [GERUEST.x + 0.45, GERUEST.y + 0.45, z0 + 0.43], [GERUEST.x - 0.45, GERUEST.y + 0.45, z0 + 0.43]];
          vieleck(g, pts.map((p) => K.proj(p[0], p[1], p[2]))); g.fillStyle = "rgb(14,12,10)"; g.fill();
        } });
      }
    }
    /* ---- Fichten auf dem Hang ---- */
    for (const [fx, fy, fh, saat] of FICHTEN) {
      const z0 = wert(G.H, fx, fy) - 0.1;
      L.push({ d: K.tiefe(fx, fy, z0 + 0.3), box: [[fx - fh * 0.3, fy - fh * 0.3, z0], [fx + fh * 0.3, fy + fh * 0.3, z0 + fh + 0.2]], rand: 0.4, bias: 0.25, mal(g, K) { fichte(g, K, fx, fy, z0, fh, saat); } });
    }
    /* ---- Erzbrocken auf der Halde (bunt wie im alten Bild) ---- */
    if (Z.zubehoer) {
      for (let i = 0; i < 9; i++) {
        const a = ST.hash2(i, 1, 891) * TAU, r = ST.hash2(i, 2, 891) * HALDE.r * 0.7;
        const x = HALDE.x + Math.cos(a) * r, y = HALDE.y + Math.sin(a) * r, z = wert(G.H, x, y);
        const f = ERZ[i % 3], rr = 0.1 + ST.hash2(i, 3, 891) * 0.07;
        L.push({ d: K.tiefe(x, y, z), box: [[x - 0.2, y - 0.2, z], [x + 0.2, y + 0.2, z + 0.3]], rand: 0.2, bias: 0.2, mal(g, K) {
          const q = K.proj(x, y, z + rr * 0.6), l = K.licht([0, 0, 1], [x, y, z]);
          g.fillStyle = K.farbe(f, l); g.beginPath(); g.ellipse(q[0], q[1], rr * K.s, rr * K.s * 0.75, 0, 0, TAU); g.fill();
          g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(q[0] - rr * K.s * 0.3, q[1] - rr * K.s * 0.3, rr * K.s * 0.35, rr * K.s * 0.25, 0, 0, TAU); g.fill();
          if (K.winter) { g.fillStyle = "rgba(246,248,252,0.9)"; g.beginPath(); g.ellipse(q[0], q[1] - rr * K.s * 0.4, rr * K.s * 0.8, rr * K.s * 0.35, 0, Math.PI, 0); g.fill(); }
        } });
      }
    }
    void F;
  }

  /* Lore: Kasten aus Eisenblech (nach oben weiter), vier Räder, Erz obenauf */
  function lore(g, K, x, y) {
    const zu = 0.36, zo = 1.02, bu = 0.4, bo = 0.52, lu = 0.62, lo = 0.74;
    /* Räder (hinter dem Kasten zuerst: die abgewandte Seite) */
    const rad = (sx, sy) => {
      const n = [sx, 0, 0], m = [x + sx * 0.33, y + sy * 0.42, 0.19];
      const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; pts.push(K.proj(m[0], m[1] + Math.cos(a) * 0.17, m[2] + Math.sin(a) * 0.17)); }
      vieleck(g, pts); g.fillStyle = K.farbe([54, 52, 50], K.licht(n, m)); g.fill();
      const c0 = K.proj(m[0], m[1], m[2]); g.fillStyle = K.farbe([150, 60, 40], K.licht(n, m)); g.beginPath(); g.arc(c0[0], c0[1], Math.max(0.8, 0.05 * K.s), 0, TAU); g.fill();
    };
    const nah = K.sicht([1, 0, 0]) >= 0 ? 1 : -1;
    for (const sy of [-1, 1]) rad(-nah, sy);
    /* Kasten: vier schräge Seiten */
    const E = (sx, sy, z) => { const b = z > 0.5 ? bo : bu, l = z > 0.5 ? lo : lu; return [x + sx * b, y + sy * l, z]; };
    const seiten = [
      { pts: [E(-1, 1, zu), E(1, 1, zu), E(1, 1, zo), E(-1, 1, zo)], n: norm([0, 1, 0.16]) },
      { pts: [E(1, -1, zu), E(-1, -1, zu), E(-1, -1, zo), E(1, -1, zo)], n: norm([0, -1, 0.16]) },
      { pts: [E(1, 1, zu), E(1, -1, zu), E(1, -1, zo), E(1, 1, zo)], n: norm([1, 0, 0.18]) },
      { pts: [E(-1, -1, zu), E(-1, 1, zu), E(-1, 1, zo), E(-1, -1, zo)], n: norm([-1, 0, 0.18]) }
    ];
    /* Erz (innen, über dem Rand sichtbar) zuerst: dann decken die vorderen Wände es richtig ab */
    const erzZ = zo + 0.02;
    const lumps = [];
    for (let i = 0; i < 16; i++) {
      const u = (ST.hash2(i, 1, 901) - 0.5) * 1.6 * bo, v = (ST.hash2(i, 2, 901) - 0.5) * 1.6 * lo;
      const hgt = 0.12 * (1 - (u * u) / (bo * bo) - (v * v) / (lo * lo) * 0.8);
      lumps.push([x + u, y + v, erzZ + Math.max(0, hgt), 0.07 + ST.hash2(i, 3, 901) * 0.06, i]);
    }
    const hinten = seiten.filter((f) => K.sicht(f.n) < 0), vorn = seiten.filter((f) => K.sicht(f.n) >= 0);
    for (const f of hinten) { const pts = f.pts.map((p) => K.proj(p[0], p[1], p[2])); vieleck(g, pts); const n = f.n.map((v) => -v); g.fillStyle = K.farbe([60, 56, 52], K.licht(n, [x, y, 0.7])); g.fill(); }
    /* Erzhaufen */
    const top = [E(-1, -1, zo), E(1, -1, zo), E(1, 1, zo), E(-1, 1, zo)].map((p) => K.proj(p[0], p[1], p[2]));
    vieleck(g, top); g.fillStyle = K.farbe([84, 80, 76], K.licht([0, 0, 1], [x, y, 1])); g.fill();
    lumps.sort((a, b) => K.tiefe(a[0], a[1], a[2]) - K.tiefe(b[0], b[1], b[2]));
    for (const [lx, ly, lz, lr, i] of lumps) {
      const q = K.proj(lx, ly, lz), f = i % 4 === 0 ? ERZ[0] : i % 5 === 1 ? ERZ[1] : i % 6 === 2 ? ERZ[2] : ERZ[3 + (i % 2)];
      const l = K.licht([0, 0, 1], [lx, ly, lz]);
      g.fillStyle = K.farbe(f, l); g.beginPath(); g.ellipse(q[0], q[1], lr * K.s, lr * K.s * 0.72, (i % 3) * 0.6, 0, TAU); g.fill();
      g.fillStyle = K.farbe(misch(f, [255, 255, 255], 0.45), l); g.beginPath(); g.ellipse(q[0] - lr * K.s * 0.3, q[1] - lr * K.s * 0.25, lr * K.s * 0.35, lr * K.s * 0.22, 0, 0, TAU); g.fill();
    }
    for (const f of vorn) {
      const pts = f.pts.map((p) => K.proj(p[0], p[1], p[2]));
      vieleck(g, pts);
      const l = K.licht(f.n, [x, y, 0.7]);
      g.fillStyle = K.farbe(EISEN, l); g.fill();
      /* Rost und Beulen */
      g.save(); g.clip();
      const gr = g.createLinearGradient(pts[0][0], pts[0][1], pts[3][0], pts[3][1]);
      gr.addColorStop(0, K.farbe(ROST, l)); gr.addColorStop(0.5, "rgba(0,0,0,0)"); g.globalAlpha = 0.55; g.fillStyle = gr; g.fillRect(-1e4, -1e4, 2e4, 2e4); g.globalAlpha = 1;
      g.restore();
      /* Eisenbänder oben und unten, Nieten */
      g.strokeStyle = K.farbe([60, 64, 70], l); g.lineWidth = Math.max(0.8, 0.045 * K.s);
      g.beginPath(); g.moveTo(pts[3][0], pts[3][1]); g.lineTo(pts[2][0], pts[2][1]); g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); g.stroke();
      if (K.s > 40) { g.fillStyle = K.farbe([170, 170, 170], l); for (let i = 1; i < 5; i++) { const t = i / 5, p = [pts[3][0] + (pts[2][0] - pts[3][0]) * t, pts[3][1] + (pts[2][1] - pts[3][1]) * t + 0.03 * K.s]; g.beginPath(); g.arc(p[0], p[1], 0.018 * K.s, 0, TAU); g.fill(); } }
    }
    for (const sy of [-1, 1]) rad(nah, sy);
    if (K.winter) { g.strokeStyle = "rgba(246,248,252,0.9)"; g.lineWidth = Math.max(0.8, 0.04 * K.s); vieleck(g, top); g.stroke(); }
  }

  /* Fichte: Stamm, fünf Etagen hängender Zweige, dunkelgrün; im Winter Schnee auf den Etagen */
  function fichte(g, K, x, y, z0, h, saat) {
    const fuss = K.proj(x, y, z0), spitze = K.proj(x, y, z0 + h);
    const H = fuss[1] - spitze[1], B = h * 0.36 * K.s;
    const lk = K.licht([-0.5, 0.2, 0.84], [x, y, z0 + h / 2]), ld = K.licht([0.6, -0.3, 0.7], [x, y, z0 + h / 2]);
    g.fillStyle = K.farbe([84, 60, 40], ld); g.fillRect(fuss[0] - B * 0.07, fuss[1] - H * 0.25, B * 0.14, H * 0.25);
    const N = 5;
    for (let i = 0; i < N; i++) {
      const t0 = 0.12 + i * 0.17, t1 = t0 + 0.34;
      const yb = fuss[1] - H * t0, yt = fuss[1] - H * Math.min(1, t1), bb = B * (1 - t0 * 0.85) * (0.95 + 0.1 * ST.hash2(i, saat, 5));
      const gr = g.createLinearGradient(fuss[0] - bb, 0, fuss[0] + bb, 0);
      const dunkel = [30, 62, 40], hellg = [58, 98, 58];
      gr.addColorStop(0, K.farbe(hellg, lk)); gr.addColorStop(0.5, K.farbe(misch(hellg, dunkel, 0.5), lk)); gr.addColorStop(1, K.farbe(dunkel, ld));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(fuss[0], yt);
      g.quadraticCurveTo(fuss[0] + bb * 0.45, yb - (yb - yt) * 0.35, fuss[0] + bb, yb + H * 0.02);
      g.quadraticCurveTo(fuss[0], yb - H * 0.05, fuss[0] - bb, yb + H * 0.02);
      g.quadraticCurveTo(fuss[0] - bb * 0.45, yb - (yb - yt) * 0.35, fuss[0], yt);
      g.fill();
      if (K.winter) {
        g.fillStyle = "rgba(246,248,252,0.92)";
        g.beginPath(); g.moveTo(fuss[0], yt + H * 0.01);
        g.quadraticCurveTo(fuss[0] + bb * 0.4, yb - (yb - yt) * 0.4, fuss[0] + bb * 0.85, yb - H * 0.005);
        g.quadraticCurveTo(fuss[0] + bb * 0.2, yb - (yb - yt) * 0.3, fuss[0] - bb * 0.3, yb - (yb - yt) * 0.28);
        g.quadraticCurveTo(fuss[0] - bb * 0.3, yb - (yb - yt) * 0.6, fuss[0], yt + H * 0.01);
        g.fill();
      }
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  const GRUND = [13, 13];
  ST.modell("bergstollen", {
    name: "Bergwerk (Stollen)", gruppe: "Häuser", grund: GRUND, hoehe: 12, bauzeit: 20 * 60,
    /* Die Baustelle stellt kein Hausgerüst um einen Berg */
    baustelle: { art: "mittel" },
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      M.teil("berg");
      M.figur({ x: 0, y: 0, z: 0, breite: 17.5, hoehe: 16.5, malen: figur(Z) });
      if (Z.zubehoer && Z.kerb > 0.98) {
        M.licht(LAMPE[0], LAMPE[1], LAMPE[2], 2.6, "255,196,120", 0.85);
        M.bodenlicht(PX - 0.6, PY + 1.6, 3.0, "255,190,110", 0.5);
      }
    }
  });
})();
