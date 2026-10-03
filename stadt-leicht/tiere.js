/* =====================================================================
   LEICHTE STADT — TIERE IM DORF (Kühe, Schweine, Hühner)
   ---------------------------------------------------------------------
   XANDER: „Tiere im Dorf: Hühner, Kühe, Schweine – nachts nicht
   draußen". Realistische Nacht, tagsüber Leben im Dorf.

   WER WO: Steht im Spielstand ein Kuhstall (ein fertiges Haus spiel
   „kuhstall"), grasen daneben 3–4 Kühe (Holstein und Braunvieh) auf einer
   eingezäunten Weide (12 × 8 m) und 2–3 Schweine wühlen in einem kleinen
   Auslauf (8 × 4 m). Um den Hühnerstall laufen 5–7 Hühner frei herum,
   einer davon ist der Hahn. Wie viele, hängt von der Ausbaustufe ab. Im
   kleinen Rahmen (LB.nurKlein) und im Sparmodus (LB.spar) nur die Hälfte.

   WEIDE UND AUSLAUF: Die Lage wird zur Laufzeit gesucht – aus
   ST.dorf.PLAETZE/SZ.objekte (Ort und Drehung des Stalls, dorf.js bleibt
   unberührt): auf freier Wiese in Blickrichtung vor oder neben dem Stall,
   nie auf Wegen (B.wert(x, y, 0)), Wasser (B.wert(x, y, 1)), Feldern,
   Häusern, Bäumen oder der Bahn. Der Zaun sind gebackene Stakentenzaun-
   Stücke (d_zaun, 4 m), als eigene Dinge in SZ.objekte (art „gehege"),
   damit sie richtig zwischen die Häuser sortiert werden. Auf der Seite
   zum Stalltor fehlt ein Stück: dort ist das offene Gatter.

   VERHALTEN: jedes Tier steht, geht langsam zu einem freien Punkt im
   Gehege, grast / wühlt / pickt; es dreht sich weich, hält Abstand (jedes
   Tier ist eine Kapsel so lang wie sein Körper – die Grundrisse
   überlappen nie) und bleibt im Gehege (ein Gitter der erlaubten Stellen,
   für Kühe mit 1,35 m Abstand zum Zaun, damit der Kopf nicht hindurch
   ragt). Hühner laufen schneller, kürzer, picken oft; der Hahn steht
   lieber und schaut.

   DIE NACHT: Wird es dunkel (Nachtgrad SZ.zeitDaten().nacht > 0,3),
   gehen die Tiere nacheinander heim – Kühe und Schweine durch das Gatter
   zum Tor des Kuhstalls, die Hühner auf dem kürzesten freien Weg zum Tor
   ihres Auslaufs – und verschwinden dort. Ab 0,6 ist keines mehr
   draußen. Morgens (< 0,25) kommen sie nacheinander wieder heraus.

   ZEICHNEN: gebackene Laufblätter (stadt/modelle/kuh.js, schwein.js,
   huhn.js; werkzeug/stadt-backen.js, backplan.json „leute": l_tier_…),
   8 Richtungen × (Gehen, Grasen/Wühlen/Picken, Stehen), Tag und Dämmerung,
   im kleinen Rahmen die Zwergblätter _z. szene.js sortiert sie wie Leute
   und Boote zwischen die Dinge (sichtbar → malen).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder, B = ST.boden;
  const TI = (ST.tiere = { liste: [], gehege: [], t: 0, nacht: 0 });
  const TAU = Math.PI * 2;
  const wrap = (a) => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);
  /* Dämmerung: ab hier gehen sie heim, ab NACHT ist keines mehr draußen, unter RAUS kommen sie morgens heraus */
  const HEIM = 0.3, NACHT = 0.6, RAUS = 0.25;
  TI.HEIM = HEIM; TI.NACHT = NACHT;

  /* ---------------- Die Arten ----------------
     blatt: Bilder je Richtung [Gehen, Haltung, Stehen] wie in den Modellen; schritt: Meter je Gangzyklus;
     halb/r: Kapsel (halbe Länge der Mittellinie, Radius) für den Abstand; rand: Abstand der Mitte zum Zaun */
  const ARTEN = {
    kuh: { blaetter: ["l_tier_kuh0", "l_tier_kuh1"], blatt: [12, 6, 2], schritt: 1.21, tempo: [0.55, 0.8], halb: 0.8, r: 0.42, rand: 1.35, bx: 1.3, bh: 1.7,
      fps: 1.1, drehen: 0.8, haltung: [8, 25], stehen: [3, 9], pHaltung: 0.6, weit: [2.5, 7] },
    schwein: { blaetter: ["l_tier_schwein"], blatt: [8, 6, 2], schritt: 0.43, tempo: [0.4, 0.6], halb: 0.42, r: 0.27, rand: 0.8, bx: 0.8, bh: 0.9,
      fps: 2.5, drehen: 1.4, haltung: [5, 16], stehen: [2, 6], pHaltung: 0.65, weit: [1.2, 4] },
    huhn: { blaetter: ["l_tier_huhn"], blatt: [8, 6, 2], schritt: 0.2, tempo: [0.25, 0.42], halb: 0.08, r: 0.13, rand: 0.35, bx: 0.3, bh: 0.5,
      fps: 5, drehen: 4, haltung: [1, 4], stehen: [0.6, 2.5], pHaltung: 0.6, weit: [0.6, 3] },
    hahn: { blaetter: ["l_tier_hahn"], blatt: [8, 6, 2], schritt: 0.24, tempo: [0.28, 0.45], halb: 0.1, r: 0.16, rand: 0.4, bx: 0.35, bh: 0.65,
      fps: 5, drehen: 3.5, haltung: [1, 3], stehen: [2, 6], pHaltung: 0.35, weit: [0.8, 3.5] }
  };
  TI.ARTEN = ARTEN;

  function klein() { return !!(LB.spar || LB.nurKlein || (document.body && document.body.classList.contains("lk-mini-modus"))); }

  /* ---------------- Geometrie ---------------- */
  /* Stall-Ort: lokal (u nach rechts, v nach vorn = Blickrichtung) → Welt, gedreht wie SZ.ecken (dreh × 90°) */
  function lokal(o, u, v) { const a = (o.dreh || 0) * Math.PI / 2, c = Math.cos(a), s = Math.sin(a); return [o.x + u * c - v * s, o.y + u * s + v * c]; }
  function imViereck(p, q) {
    /* konvexes Viereck, Ecken der Reihe nach */
    let vz = 0;
    for (let i = 0; i < 4; i++) {
      const a = q[i], b = q[(i + 1) % 4], k = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      if (k !== 0) { const s = k > 0 ? 1 : -1; if (vz && s !== vz) return false; vz = s; }
    }
    return true;
  }
  /* Abstand zweier Strecken in der Ebene (für die Kapseln) */
  function punktStrecke(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy;
    const t = l ? klemm(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l, 0, 1) : 0;
    return Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dy * t);
  }
  function schneiden(a, b, c, d) {
    const k = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    return k(a, b, c) * k(a, b, d) < 0 && k(c, d, a) * k(c, d, b) < 0;
  }
  function streckenAbst(a, b, c, d) {
    if (schneiden(a, b, c, d)) return 0;
    return Math.min(punktStrecke(a, c, d), punktStrecke(b, c, d), punktStrecke(c, a, b), punktStrecke(d, a, b));
  }
  function kapsel(t, x, y, h) {
    const A = ARTEN[t.art], c = Math.cos(h == null ? t.h : h) * A.halb, s = Math.sin(h == null ? t.h : h) * A.halb;
    x = x == null ? t.x : x; y = y == null ? t.y : y;
    return [[x - c, y - s], [x + c, y + s]];
  }
  function abstand(t, u, x, y, h) { const a = kapsel(t, x, y, h), b = kapsel(u); return streckenAbst(a[0], a[1], b[0], b[1]) - ARTEN[t.art].r - ARTEN[u.art].r; }
  TI.abstand = abstand;

  /* ---------------- Was ist frei? ---------------- */
  let hind = [];
  function hindernisseSammeln(ohne) {
    hind = [];
    for (const o of SZ.objekte) {
      if (o.tiere || SZ.flach(o) || (ohne && ohne.indexOf(o) >= 0)) continue;
      const q = SZ.ecken(o, 0.35);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of q) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
      hind.push({ o: o, q: q, x0: x0, x1: x1, y0: y0, y1: y1 });
    }
  }
  function bahnNah(x, y) {
    const W = ST.dorf && ST.dorf.BAHN; if (!W) return false;
    for (let i = 0; i < W.length - 1; i++) if (punktStrecke([x, y], W[i], W[i + 1]) < 6) return true;
    return false;
  }
  /* Boden frei: kein Weg, kein Wasser, kein Feld, auf der Karte */
  function bodenFrei(x, y) {
    const G = B.GROESSE / 2 - 3;
    if (Math.abs(x) > G || Math.abs(y) > G) return false;
    /* FASSUNG 874 — XANDER (Funk 255): „Ich möchte dass man das Feld verschieben kann". Ein versetzter Acker liegt nicht
       mehr über seinen alten Ladeflecken: Weide und Hühnerhof meiden das ganze gemalte Feld (dorf.js D.feldIn, mit Rain) */
    return !(B.wert(x, y, 0) > 0.06) && !(B.wert(x, y, 1) > 0.02) && !(B.wert(x, y, 2) > 0.1) && !(ST.dorf && ST.dorf.feldIn && ST.dorf.feldIn(x, y, 1.5));
  }
  function dingFrei(x, y, ausser) {
    for (const h of hind) {
      if (h.o === ausser || x < h.x0 || x > h.x1 || y < h.y0 || y > h.y1) continue;
      if (imViereck([x, y], h.q)) return false;
    }
    return true;
  }
  function punktFrei(x, y, ausser) { return bodenFrei(x, y) && dingFrei(x, y, ausser) && !bahnNah(x, y); }

  /* ---------------- Gehege suchen ---------------- */
  /* Rechteck: Mitte m, Achsen u (Einheitsvektor) und v, halbe Maße hw (längs u), hd (längs v) */
  function rechteck(m, u, hw, hd) { const v = [-u[1], u[0]]; return { m: m, u: u, v: v, hw: hw, hd: hd }; }
  function inRechteck(R, x, y, rand) {
    const dx = x - R.m[0], dy = y - R.m[1], a = dx * R.u[0] + dy * R.u[1], b = dx * R.v[0] + dy * R.v[1];
    return Math.abs(a) <= R.hw - (rand || 0) && Math.abs(b) <= R.hd - (rand || 0);
  }
  function rPunkt(R, a, b) { return [R.m[0] + R.u[0] * a + R.v[0] * b, R.m[1] + R.u[1] * a + R.v[1] * b]; }
  /* Zaunstücke (je 4 m) rundum; das Stück, dessen Mitte dem Tor am nächsten ist, bleibt offen (Gatter) */
  function zaunPlan(R, tuer, stallDreh, quer) {
    const stuecke = [];
    for (const sd of [1, -1]) {
      for (let a = -R.hw + 2; a < R.hw; a += 4) stuecke.push({ p: rPunkt(R, a, sd * R.hd), n: [R.v[0] * sd, R.v[1] * sd], dreh: stallDreh + (quer ? 1 : 0) });
      for (let b = -R.hd + 2; b < R.hd; b += 4) stuecke.push({ p: rPunkt(R, sd * R.hw, b), n: [R.u[0] * sd, R.u[1] * sd], dreh: stallDreh + (quer ? 0 : 1) });
    }
    let tor = null, best = Infinity;
    for (const z of stuecke) {
      const d = Math.hypot(tuer[0] - z.p[0], tuer[1] - z.p[1]);
      /* nur Stücke, deren Außenseite zum Tor zeigt */
      if ((tuer[0] - z.p[0]) * z.n[0] + (tuer[1] - z.p[1]) * z.n[1] <= 0) continue;
      if (d < best) { best = d; tor = z; }
    }
    return { stuecke: stuecke.filter((z) => z !== tor), tor: tor, weg: best };
  }
  function streckeFrei(a, b, ausser, sperr) {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let t = 0; t <= d; t += 0.5) {
      const x = a[0] + (b[0] - a[0]) * t / d, y = a[1] + (b[1] - a[1]) * t / d;
      if (!(B.wert(x, y, 1) < 0.05) || !dingFrei(x, y, ausser)) return false;
      for (const S of sperr || []) if (inRechteck(S, x, y, 0.3)) return false;
    }
    return true;
  }
  /* Freikarte um den Stall (0,5 m Zellen) mit Summentabelle: ob ein achsparalleles Rechteck ganz frei ist, kostet
     dann nur vier Nachschläge. Die Gehege liegen achsparallel zur Welt – im Schrägbild wie alle Grundrisse eine Raute –,
     auch wenn der Stall schräg (45°) steht. */
  const FZ = 0.5;
  function freiKarte(stall, rad, sperr) {
    const n = Math.ceil(2 * rad / FZ), x0 = stall.x - rad, y0 = stall.y - rad;
    const sat = new Int32Array((n + 1) * (n + 1));
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5) * FZ, y = y0 + (j + 0.5) * FZ;
      let zu = !punktFrei(x, y);
      if (!zu) for (const S of sperr) if (inRechteck(S, x, y, -1.5)) { zu = true; break; }
      sat[(j + 1) * (n + 1) + i + 1] = (zu ? 1 : 0) + sat[j * (n + 1) + i + 1] + sat[(j + 1) * (n + 1) + i] - sat[j * (n + 1) + i];
    }
    /* sind im Rechteck [xa, xb] × [ya, yb] (Welt) Hindernisse? */
    const zelle = (v, v0) => klemm(Math.floor((v - v0) / FZ), 0, n);
    return (xa, xb, ya, yb) => {
      if (xa < x0 || ya < y0 || xb > x0 + n * FZ || yb > y0 + n * FZ) return true;
      const i0 = zelle(xa, x0), i1 = zelle(xb, x0) + 1, j0 = zelle(ya, y0), j1 = zelle(yb, y0) + 1;
      const I1 = Math.min(n, i1), J1 = Math.min(n, j1);
      return sat[J1 * (n + 1) + I1] - sat[j0 * (n + 1) + I1] - sat[J1 * (n + 1) + i0] + sat[j0 * (n + 1) + i0] > 0;
    };
  }
  function gehegeSuchen(stall, art, groessen, sperr) {
    const fd = (stall.fuss ? stall.fuss[1] : 9) / 2;
    const tuer = lokal(stall, 0, fd + 0.7);
    const vorn = [lokal(stall, 0, 1)[0] - stall.x, lokal(stall, 0, 1)[1] - stall.y];
    const zu = freiKarte(stall, 34, sperr);
    for (const [w, d] of groessen) {
      const kand = [];
      for (const [ex, ey] of [[w, d], [d, w]]) {
        for (let dx = -28; dx <= 28; dx += 1) for (let dy = -28; dy <= 28; dy += 1) {
          const m = [stall.x + dx, stall.y + dy];
          if (zu(m[0] - ex / 2 - 0.6, m[0] + ex / 2 + 0.6, m[1] - ey / 2 - 0.6, m[1] + ey / 2 + 0.6)) continue;
          /* nah am Tor, lieber vor als hinter dem Stall */
          const rel = [m[0] - stall.x, m[1] - stall.y], v = rel[0] * vorn[0] + rel[1] * vorn[1];
          const wert = Math.hypot(m[0] - tuer[0], m[1] - tuer[1]) + Math.max(0, fd - v) * 0.8;
          kand.push({ m: m, ex: ex, ey: ey, wert: wert });
        }
      }
      kand.sort((p, q) => p.wert - q.wert);
      for (const k of kand.slice(0, 80)) {
        const R = rechteck(k.m, [1, 0], k.ex / 2, k.ey / 2);
        const z = zaunPlan(R, tuer, 0, false);
        if (!z.tor) continue;
        const aussen = [z.tor.p[0] + z.tor.n[0] * 1.2, z.tor.p[1] + z.tor.n[1] * 1.2];
        if (!streckeFrei(aussen, tuer, stall, sperr.concat([R]))) continue;
        const A = ARTEN[art], tor = z.tor;
        return { art: art, stall: stall, R: R, tuer: tuer, zaun: z.stuecke,
          tor: { innen: [tor.p[0] - tor.n[0] * (A.rand + 0.3), tor.p[1] - tor.n[1] * (A.rand + 0.3)], aussen: aussen },
          frei: (x, y) => inRechteck(R, x, y, A.rand) };
      }
    }
    return null;
  }

  /* Hof der Hühner: freie Wiese rund um den Hühnerstall (bis 9,5 m von der Mitte), nur was mit dem Tor des Auslaufs
     zusammenhängt; als Gitter (0,25 m) für Wege heim (Breitensuche) */
  const ZELLE = 0.25;
  function hofSuchen(stall, sperr) {
    const fd = (stall.fuss ? stall.fuss[1] : 7) / 2;
    /* das Tor des Auslaufs im Modell (huehnerstall.js: TOR x 1,9…2,8 an der Südseite) */
    const tuer = lokal(stall, 2.35, fd + 0.5);
    const RAD = 9.5, n = Math.ceil(2 * RAD / ZELLE), x0 = stall.x - RAD, y0 = stall.y - RAD;
    const ok = new Uint8Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5) * ZELLE, y = y0 + (j + 0.5) * ZELLE;
      if (Math.hypot(x - stall.x, y - stall.y) > RAD) continue;
      if (!punktFrei(x, y)) continue;
      let sp = false; for (const S of sperr) if (inRechteck(S, x, y, -0.8)) { sp = true; break; }
      if (!sp) ok[j * n + i] = 1;
    }
    const zelle = (x, y) => { const i = Math.floor((x - x0) / ZELLE), j = Math.floor((y - y0) / ZELLE); return i < 0 || j < 0 || i >= n || j >= n ? -1 : j * n + i; };
    /* Startzelle am Tor (oder die nächste freie) */
    let st = zelle(tuer[0], tuer[1]);
    if (st < 0 || !ok[st]) {
      let b = -1, bd = Infinity;
      for (let k = 0; k < n * n; k++) if (ok[k]) { const d = Math.hypot(x0 + (k % n + 0.5) * ZELLE - tuer[0], y0 + (Math.floor(k / n) + 0.5) * ZELLE - tuer[1]); if (d < bd) { bd = d; b = k; } }
      if (b < 0 || bd > 3) return null;
      st = b;
    }
    /* zusammenhängend mit dem Tor: Breitensuche, dabei Vorgänger für den Heimweg merken */
    const nach = new Int32Array(n * n).fill(-2), schlange = [st];
    nach[st] = -1;
    for (let q = 0; q < schlange.length; q++) {
      const k = schlange[q], i = k % n, j = Math.floor(k / n);
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= n || b >= n) continue;
        const m = b * n + a; if (!ok[m] || nach[m] !== -2) continue;
        if (di && dj && (!ok[j * n + a] || !ok[b * n + i])) continue;
        nach[m] = k; schlange.push(m);
      }
    }
    if (schlange.length * ZELLE * ZELLE < 10) return null;
    const drin = new Uint8Array(n * n); for (const k of schlange) drin[k] = 1;
    const mitte = (k) => [x0 + (k % n + 0.5) * ZELLE, y0 + (Math.floor(k / n) + 0.5) * ZELLE];
    return { art: "huhn", stall: stall, hof: true, tuer: tuer, zaun: [], mitte: [stall.x, stall.y], RAD: RAD, zellen: schlange,
      frei: (x, y) => { const k = zelle(x, y); return k >= 0 && drin[k] === 1; },
      /* Weg von (x, y) zum Tor über das Gitter */
      heimweg: (x, y) => {
        let k = zelle(x, y); const w = [];
        if (k < 0 || !drin[k]) return [tuer];
        let schutz = 0;
        while (k >= 0 && schutz++ < 4000) { if (schutz % 3 === 1) w.push(mitte(k)); k = nach[k]; }
        w.push(mitte(st), tuer);
        return w;
      },
      zufall: (r) => mitte(schlange[Math.floor(r() * schlange.length)]) };
  }

  /* ---------------- Aufstellen ---------------- */
  let zaeune = [], zaunPlaene = [], sig = "";
  function staelle() {
    const aus = {};
    for (const o of SZ.objekte) if (o.art === "haus" && (o.spiel === "kuhstall" || o.spiel === "huehnerstall" || o.spiel === "schweinestall") && (o.stufenZahl || 0) > 0) aus[o.spiel] = o;
    return aus;
  }
  function signatur(S) {
    return ["kuhstall", "huehnerstall", "schweinestall"].map((k) => S[k] ? [k, S[k].x.toFixed(1), S[k].y.toFixed(1), S[k].dreh, S[k].stufenZahl].join(":") : "").join("|");
  }
  function zaunSetzen() {
    zaeune = [];
    for (const z of zaunPlaene) zaeune.push(SZ.neu({ art: "gehege", tiere: 1, bild: "d_zaun", x: z.p[0], y: z.p[1], dreh: z.dreh, fuss: [4, 0.3], hoehe: 1.2, deko: 1 }));
  }
  function zaunWeg() { for (const z of zaeune) if (SZ.objekte.indexOf(z) >= 0) SZ.weg(z); zaeune = []; }

  function tierNeu(art, g, i, rng, blatt) {
    const A = ARTEN[art];
    return { art: art, g: g, i: i, blatt: blatt, x: 0, y: 0, h: rng() * TAU, v: 0, tempo: A.tempo[0] + rng() * (A.tempo[1] - A.tempo[0]), rng: ST.zufall(7000 + i * 131 + art.length * 17),
      modus: "frei", tun: "stehen", uhr: rng() * A.stehen[1], ph: rng(), hph: rng() * 6, st: 0, stUhr: 1 + rng() * 2, ziel: null, weg: null, alpha: 1, verz: 0, voll: true };
  }
  function platzFinden(t, liste) {
    const g = t.g;
    for (let v = 0; v < 300; v++) {
      let p;
      if (g.hof) p = g.zufall(t.rng);
      else { const R = g.R; p = rPunkt(R, (t.rng() * 2 - 1) * R.hw, (t.rng() * 2 - 1) * R.hd); }
      if (!g.frei(p[0], p[1])) continue;
      const h = t.rng() * TAU;
      if (liste.some((u) => u !== t && u.g === g && abstand(t, u, p[0], p[1], h) < 0.15)) continue;
      t.x = p[0]; t.y = p[1]; t.h = h; return true;
    }
    return false;
  }
  function setzen() {
    const S = staelle();
    sig = signatur(S);
    zaunWeg();
    TI.liste = []; TI.gehege = []; zaunPlaene = [];
    hindernisseSammeln();
    const rng = ST.zufall(811);
    const sperr = [];
    if (S.kuhstall) {
      const stufe = S.kuhstall.stufenZahl || 1;
      const weide = gehegeSuchen(S.kuhstall, "kuh", [[12, 8], [8, 8]], sperr);
      if (weide) {
        sperr.push(weide.R); TI.gehege.push(weide); zaunPlaene.push(...weide.zaun);
        const n = 3 + (stufe >= 2 ? 1 : 0);
        for (let i = 0; i < n; i++) TI.liste.push(tierNeu("kuh", weide, i, rng, ARTEN.kuh.blaetter[i % 2]));
      }
      /* FASSUNG 833 — steht ein Schweinestall, wohnen die Schweine dort (unten), nicht mehr am Kuhstall */
      const auslauf = S.schweinestall ? null : gehegeSuchen(S.kuhstall, "schwein", [[8, 4]], sperr);
      if (auslauf) {
        sperr.push(auslauf.R); TI.gehege.push(auslauf); zaunPlaene.push(...auslauf.zaun);
        const n = 2 + (stufe >= 3 ? 1 : 0);
        for (let i = 0; i < n; i++) TI.liste.push(tierNeu("schwein", auslauf, i, rng, ARTEN.schwein.blaetter[0]));
      }
    }
    if (S.schweinestall) {
      const stufe = S.schweinestall.stufenZahl || 1;
      const auslauf = gehegeSuchen(S.schweinestall, "schwein", [[9, 5], [8, 4]], sperr);
      if (auslauf) {
        sperr.push(auslauf.R); TI.gehege.push(auslauf); zaunPlaene.push(...auslauf.zaun);
        const n = 3 + (stufe >= 2 ? 1 : 0);
        for (let i = 0; i < n; i++) TI.liste.push(tierNeu("schwein", auslauf, i, rng, ARTEN.schwein.blaetter[0]));
      }
    }
    if (S.huehnerstall) {
      /* der Zaun der Gehege ist jetzt ein Hindernis für die Hühner */
      const hof = hofSuchen(S.huehnerstall, sperr);
      if (hof) {
        TI.gehege.push(hof);
        const n = 4 + Math.min(3, S.huehnerstall.stufenZahl || 1);
        for (let i = 0; i < n; i++) TI.liste.push(tierNeu(i === 0 ? "hahn" : "huhn", hof, i, rng, ARTEN[i === 0 ? "hahn" : "huhn"].blaetter[0]));
      }
    }
    /* halbe Anzahl im kleinen Rahmen: je Gehege nur die ersten (der Hahn bleibt) */
    for (const g of TI.gehege) { const l = TI.liste.filter((t) => t.g === g); l.forEach((t, k) => { t.voll = k >= Math.ceil(l.length / 2); }); }
    zaunSetzen();
    for (const t of TI.liste) { if (!platzFinden(t, TI.liste)) t.weg = "raus"; }
    TI.liste = TI.liste.filter((t) => t.weg !== "raus");
    for (const t of TI.liste) { t.weg = null; if (TI.nacht > NACHT) { t.modus = "drin"; t.alpha = 0; } }
    TI.zaun = zaeune;
  }
  TI.setzen = setzen;
  /* Etwa jede Sekunde: Stall gebaut, abgerissen, gedreht? Zaun nach dem Neuaufbau (D.aufbauen) wieder dazu. */
  function pruefen() {
    const S = staelle(), s = signatur(S);
    if (s !== sig) { setzen(); return; }
    if (zaeune.length && zaeune.some((z) => SZ.objekte.indexOf(z) < 0)) { zaeune = zaeune.filter((z) => SZ.objekte.indexOf(z) >= 0); zaunWeg(); zaunSetzen(); TI.zaun = zaeune; }
  }

  /* ---------------- Bewegen ---------------- */
  function aktiv(t, kl) { return !kl || !t.voll; }
  function tunWaehlen(t) {
    const A = ARTEN[t.art];
    if (t.rng() < A.pHaltung) { t.tun = "haltung"; t.uhr = A.haltung[0] + t.rng() * (A.haltung[1] - A.haltung[0]); return; }
    /* ein freies Ziel suchen, zu dem der gerade Weg frei ist */
    for (let v = 0; v < 24; v++) {
      const w = t.rng() * TAU, d = A.weit[0] + t.rng() * (A.weit[1] - A.weit[0]);
      const z = [t.x + Math.cos(w) * d, t.y + Math.sin(w) * d];
      if (!t.g.frei(z[0], z[1])) continue;
      let ok = true;
      for (let s = 0.3; s < d; s += 0.3) if (!t.g.frei(t.x + Math.cos(w) * s, t.y + Math.sin(w) * s)) { ok = false; break; }
      if (!ok) continue;
      t.tun = "gehen"; t.ziel = z; t.uhr = 40; return;
    }
    t.tun = "stehen"; t.uhr = A.stehen[0] + t.rng() * (A.stehen[1] - A.stehen[0]);
  }
  /* ein Schritt: drehen, gehen – nur, wenn es frei bleibt (Gehege, Abstand zu allen) */
  function schritt(t, ziel, dt, liste, kl, frei, tempo) {
    const A = ARTEN[t.art];
    const dx = ziel[0] - t.x, dy = ziel[1] - t.y, d = Math.hypot(dx, dy);
    const soll = Math.atan2(dy, dx), diff = wrap(soll - t.h);
    const nh = t.h + klemm(diff, -A.drehen * dt, A.drehen * dt);
    const vSoll = tempo * Math.max(0, Math.cos(diff)) * Math.min(1, d / 0.6 + 0.3);
    t.v += (vSoll - t.v) * Math.min(1, dt * 2.5);
    const nx = t.x + Math.cos(nh) * t.v * dt, ny = t.y + Math.sin(nh) * t.v * dt;
    if (frei && !t.g.frei(nx, ny)) { t.v = 0; return -1; }
    for (const u of liste) {
      if (u === t || u.g !== t.g || u.modus === "drin" || !aktiv(u, kl)) continue;
      const neu = abstand(t, u, nx, ny, nh);
      if (neu < 0.12 && neu < abstand(t, u) - 1e-4) { t.v = 0; return -2; }
    }
    t.x = nx; t.y = ny; t.h = nh;
    t.ph = (t.ph + t.v * dt / A.schritt) % 1;
    return d;
  }
  function frei(t, dt, liste, kl) {
    const A = ARTEN[t.art];
    t.uhr -= dt;
    if (t.tun === "stehen") {
      t.v = 0; t.stUhr -= dt;
      if (t.stUhr <= 0) { t.st = 1 - t.st; t.stUhr = t.st ? 0.6 + t.rng() * 0.8 : 1.5 + t.rng() * 4; }
      if (t.uhr <= 0) tunWaehlen(t);
    } else if (t.tun === "haltung") {
      t.v = 0; t.hph += dt * A.fps;
      if (t.uhr <= 0) { if (t.rng() < 0.5) tunWaehlen(t); else { t.tun = "stehen"; t.uhr = A.stehen[0] + t.rng() * (A.stehen[1] - A.stehen[0]); } }
    } else {
      const d = schritt(t, t.ziel, dt, liste, kl, true, t.tempo);
      if (d === -1 || d === -2 || t.uhr <= 0) { t.tun = "stehen"; t.ziel = null; t.uhr = 0.8 + t.rng() * 2.5; }
      else if (d < 0.25) { t.ziel = null; if (t.rng() < 0.55) { t.tun = "haltung"; t.uhr = A.haltung[0] + t.rng() * (A.haltung[1] - A.haltung[0]); } else { t.tun = "stehen"; t.uhr = A.stehen[0] + t.rng() * (A.stehen[1] - A.stehen[0]); } }
    }
  }
  /* auf einem Weg (Punktliste) gehen – heim oder hinaus; am Ende true */
  function wegGehen(t, dt, tempo) {
    if (!t.weg || !t.weg.length) return true;
    const z = t.weg[0];
    const d = schritt(t, z, dt, [], false, false, tempo);
    if (d >= 0 && d < 0.35) t.weg.shift();
    return !t.weg.length;
  }
  function heimweg(t) {
    const g = t.g;
    if (g.hof) return g.heimweg(t.x, t.y);
    const w = [];
    if (g.frei(t.x, t.y) || inRechteck(g.R, t.x, t.y, 0)) w.push(g.tor.innen);
    w.push(g.tor.aussen, g.tuer);
    return w;
  }
  function rausweg(t) {
    const g = t.g;
    if (g.hof) { const p = g.zufall(t.rng); return g.heimweg(p[0], p[1]).reverse(); }
    return [g.tor.aussen, g.tor.innen];
  }

  let letzte = 0, pruefUhr = 0, zeitUhr = 0;
  TI.bewegen = function (jetzt) {
    const dt = Math.min(0.1, Math.max(0, (jetzt - (letzte || jetzt)) / 1000)); letzte = jetzt;
    TI.t += dt;
    if (!SZ.objekte.length) return;
    pruefUhr -= dt; zeitUhr -= dt;
    if (zeitUhr <= 0) { zeitUhr = 0.5; TI.nacht = SZ.zeitDaten().nacht; }
    if (pruefUhr <= 0 || !sig) { pruefUhr = 1; pruefen(); }
    const n = TI.nacht, kl = klein(), liste = TI.liste;
    for (const t of liste) {
      if (!aktiv(t, kl)) continue;
      if (n > NACHT) { t.modus = "drin"; t.alpha = 0; t.weg = null; t.v = 0; continue; }
      if (n > HEIM) {
        /* Dämmerung: nacheinander heim zum Stalltor */
        if (t.modus === "frei" || t.modus === "raus") {
          if (t.verz <= 0 && t.modus === "frei") t.verz = 2 + t.rng() * (t.art === "huhn" || t.art === "hahn" ? 30 : 60);
          t.verz -= dt;
          if (t.modus === "raus" || t.verz <= 0) { t.modus = "heim"; t.weg = heimweg(t); t.verz = 0; t.tun = "gehen"; }
          else frei(t, dt, liste, kl);
        }
        if (t.modus === "heim") {
          if (wegGehen(t, dt, t.tempo * 1.25)) { t.v = 0; t.alpha -= dt / 1.2; if (t.alpha <= 0) { t.alpha = 0; t.modus = "drin"; } }
        }
        continue;
      }
      /* Tag */
      if (t.modus === "drin" || t.modus === "heim") {
        if (n < RAUS || t.modus === "heim") {
          if (t.modus === "drin") {
            if (t.verz <= 0) t.verz = 1 + t.rng() * 40;
            t.verz -= dt;
            if (t.verz > 0) continue;
            t.x = t.g.tuer[0]; t.y = t.g.tuer[1];
          }
          t.modus = "raus"; t.weg = rausweg(t); t.tun = "gehen"; t.verz = 0;
        } else continue;
      }
      if (t.modus === "raus") {
        t.alpha = Math.min(1, t.alpha + dt / 1.2);
        if (wegGehen(t, dt, t.tempo)) {
          /* angekommen: erst wieder frei, wenn der Platz frei ist (sonst ein Stück weiter) */
          if (t.g.frei(t.x, t.y) && !liste.some((u) => u !== t && u.g === t.g && u.modus === "frei" && aktiv(u, kl) && abstand(t, u) < 0.12)) { t.modus = "frei"; t.tun = "stehen"; t.uhr = 1 + t.rng() * 3; t.alpha = 1; }
          else { const p = t.g.hof ? t.g.zufall(t.rng) : rPunkt(t.g.R, (t.rng() * 2 - 1) * (t.g.R.hw - ARTEN[t.art].rand), (t.rng() * 2 - 1) * (t.g.R.hd - ARTEN[t.art].rand)); t.weg = [p]; }
        }
        continue;
      }
      t.alpha = 1;
      frei(t, dt, liste, kl);
    }
  };

  /* ---------------- Zeichnen (für szene.js, wie leute.sichtbar) ---------------- */
  function blattWahl(basis) {
    /* im kleinen Rahmen das Zwergblatt, solange es scharf genug ist */
    const z = LB.vz[basis + "_z"], g = LB.vz[basis];
    if (z && (!g || (LB.nurKlein && K.s <= z.s * 1.35))) return { name: basis + "_z", meta: z };
    return g ? { name: basis, meta: g } : null;
  }
  function tierMalen(g, p) {
    const m = p.meta, k = K.s / m.s;
    if (p.alpha < 1) g.globalAlpha = p.alpha;
    g.drawImage(p.img, p.schritt * m.zw, p.reihe * m.zh, m.zw, m.zh, p.X - m.ax * k, p.Y - m.ay * k, m.zw * k, m.zh * k);
    g.globalAlpha = 1;
  }
  TI.sichtbar = function (Z) {
    const aus = [];
    TI.nacht = Z.nacht;
    TI.gezeigt = 0;
    if (!TI.liste.length || Z.nacht > NACHT) return aus;
    const jahr = SZ.jahr === "winter" ? "winter" : "herbst", zeit = Z.nacht > 0.35 && !LB.spar ? "abend" : "tag";
    const kl = klein(), rand = 80 * K.dpr;
    for (const t of TI.liste) {
      if (!aktiv(t, kl) || t.modus === "drin" || t.alpha <= 0.01) continue;
      const P = ST.proj(t.x, t.y, 0);
      if (P[0] < -rand || P[0] > K.W + rand || P[1] < -rand || P[1] > K.H + rand * 1.5) continue;
      const A = ARTEN[t.art];
      /* im kleinen Rahmen sind Hühner im Überblick kaum 3 Bildpunkte groß: erst beim Heranzoomen */
      if (LB.nurKlein && (t.art === "huhn" || t.art === "hahn") && K.s < 12 * K.dpr) continue;
      const b = blattWahl((kl ? A.blaetter[0] : t.blatt) + "_" + jahr + "_" + zeit); if (!b) continue;
      const img = LB.bild(b.name); if (!img) continue;
      /* Aufteilung des Blatts: [Gehen, Haltung, Stehen]; das Zwergblatt hat nur je ein Bild (meta.bl) */
      const bl = b.meta.bl || A.blatt, N = bl[0] + bl[1] + bl[2];
      let sp = t.tun === "gehen" || t.modus !== "frei" ? (t.v > 0.02 ? Math.floor(t.ph * bl[0]) % bl[0] : bl[0] + bl[1]) : t.tun === "haltung" ? bl[0] + (Math.floor(t.hph) % bl[1]) : bl[0] + bl[1] + Math.min(t.st, bl[2] - 1);
      if (b.meta.n !== N) sp = 0;
      const gier = Math.atan2(-Math.cos(t.h), Math.sin(t.h)) * 180 / Math.PI + K.dreh * 90;
      const r = ST.drehXY(t.x, t.y, K.dreh);
      aus.push({ X: P[0], Y: P[1], a: r[0], b: r[1], img: img, meta: b.meta, reihe: ((Math.round(gier / 45) % 8) + 8) % 8, schritt: sp,
        malen: tierMalen, bx: A.bx, bh: A.bh, alpha: t.alpha, tier: t });
    }
    TI.gezeigt = aus.length;
    return aus;
  };
})();
