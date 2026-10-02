/* =====================================================================
   GETREIDEFELDER — FASSUNG 835
   ---------------------------------------------------------------------
   XANDER (Funk 263): „im Spiel lass die Getreidefelder mehr wie
   Getreidefelder aussehen nicht nur wie einfache Vierecke".
   Eigene Datei (≈ 5 KB gepackt), damit der kleine Rahmen im Spiel nicht
   langsamer lädt (Funk 263: „die Seite schnell … Ladezeit"): in der
   Bündelung steht korn-laden.js, malt die Äcker bis dahin als einfache
   Fläche und holt korn.min.js, sobald die Stadt ihr erstes Bild hat.
   Mit ?quelle=1 lädt diese Datei direkt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST || ST.korn) return;
  const K = ST.kamera, SZ = ST.szene, D = ST.dorf, O = ST.oberflaeche;
  const L = () => ST.leicht;
  /* FASSUNG 835 — XANDER (Funk 263): „im Spiel lass die Getreidefelder mehr wie Getreidefelder aussehen nicht nur wie
     einfache Vierecke". Bis 834 war ein Acker eine flache Fläche mit Farbverlauf, Linien und (nah) kurzen Strichen. Jetzt
     wie ein Weizenacker aus der Luft:
     - Das Korn hat Höhe (reif knapp 1 m): vorn sieht man die Halmwand mit einem dunklen Saum am Fuß; nah dran stehen
       die Halme mit ihren Ähren einzeln da und wiegen sich im Wind.
     - Die Oberfläche ist eine Textur: Ähren als Körnung, Drillreihen, die Fahrgasse (die doppelte Traktorspur, an der man
       einen Acker von oben sofort erkennt), das Vorgewende an beiden Enden mit Querreihen und eigener Spur, hellere und
       dunklere Stellen je nach Boden, eine vom Wind niedergedrückte Lagerstelle.
     - Ringsum ein Feldrain mit hohem Gras, Mohn, Kornblumen und Kamille (im Herbst welker, im Winter Schnee).
     - Kornwellen: Böen laufen als helle Wellen über das Korn.
     - Nach der Ernte (das Spiel schickt den Anteil bis zur Reife mit) ein Stoppelfeld mit Strohschwaden und Rundballen,
       dann gesäte Reihen auf brauner Erde, grünes, gelbes und schließlich reifes Korn. Ohne Spielstand: reif.
     Flüssig bleibt es so: die Textur wird je Acker, Stufe und Zoomstufe einmal gebacken – die grobe sofort, die feine
     in kleinen Stücken zwischen den Bildern (nie mehr als ~6 ms am Stück). Je Bild sind es danach ein Bild auf die
     Fläche, vier Wandflächen, vier Wellenstreifen und nah dran ein paar hundert Striche. */
  const KORN = (() => {
    const M = Math.SQRT1_2;   // eine Einheit in u bzw. v sind 0,71 m
    const hash = (x, y, s) => {
      let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    const rausch = (x, y, s) => {
      const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
    /* am Tag: grund, hell (Ähren in der Sonne / Saat / Stroh), dunkel (zwischen den Reihen), spur (Fahrgasse), wand (Halme) */
    const FARBE = {
      reif:    { grund: [212, 178, 100], hell: [240, 218, 156], dunkel: [146, 112, 56], spur: [156, 126, 80], wand: [164, 128, 66] },
      gelb:    { grund: [196, 182, 98], hell: [228, 216, 144], dunkel: [124, 118, 58], spur: [138, 114, 74], wand: [130, 120, 60] },
      gruen:   { grund: [96, 138, 64], hell: [146, 184, 100], dunkel: [58, 92, 42], spur: [120, 98, 66], wand: [64, 100, 46] },
      saat:    { grund: [118, 88, 60], hell: [104, 152, 66], dunkel: [84, 60, 40], spur: [100, 76, 52], wand: [96, 72, 48] },
      stoppel: { grund: [212, 188, 128], hell: [240, 224, 170], dunkel: [148, 118, 78], spur: [160, 130, 90], wand: [176, 150, 98] },
      schnee:  { grund: [234, 238, 245], hell: [250, 251, 253], dunkel: [140, 126, 104], spur: [204, 212, 230], wand: [198, 206, 222] }
    };
    const HALME = { reif: 1, gelb: 1, gruen: 1 };
    /* Stufe aus dem Zeichen des Spiels: ["fertig" | "laeuft", Text, Ware, Anteil 0…1 bis zur Reife] */
    function stufe(zz, winter) {
      if (winter) return { art: "schnee", h: 0.1 };
      if (!zz || zz[0] === "fertig") return { art: "reif", h: 0.95 };
      const a = typeof zz[3] === "number" ? Math.max(0, Math.min(1, zz[3])) : 0.8;
      if (a < 0.2) return { art: "stoppel", h: 0.12 };
      if (a < 0.42) return { art: "saat", h: 0.05 };
      if (a < 0.72) return { art: "gruen", h: 0.3 + (a - 0.42) * 1.4 };
      return { art: "gelb", h: 0.72 + (a - 0.72) * 0.7 };
    }
    const ecke = (f) => Math.min(1.6, (f.u1 - f.u0) / 4, (f.v1 - f.v0) / 4);
    /* Umriss des Ackers in (u, v): Rechteck mit runden Ecken, gegen den Uhrzeigersinn wie (u0,v0) → (u1,v0) → (u1,v1) */
    function umriss(f) {
      const r = ecke(f), l = [];
      const bogen = (cu, cv, w0) => { for (let k = 0; k <= 3; k++) { const w = w0 + k * Math.PI / 6; l.push([cu + Math.cos(w) * r, cv + Math.sin(w) * r]); } };
      bogen(f.u0 + r, f.v0 + r, Math.PI); bogen(f.u1 - r, f.v0 + r, Math.PI * 1.5); bogen(f.u1 - r, f.v1 - r, 0); bogen(f.u0 + r, f.v1 - r, Math.PI / 2);
      return l;
    }
    /* Strohschwaden des Stoppelfelds (u in Metern), auch für die Rundballen */
    const schwaden = (um) => { const l = []; for (let x = 2.1; x < um - 1.2; x += 5.6) l.push(x); return l; };

    /* Die Oberfläche als Auftrag in Zeilen: schritt(ms) rechnet Zeilen, bis die Zeit um ist; fertig → true */
    function auftrag(f, art, d) {
      const bu = f.u1 - f.u0, bv = f.v1 - f.v0, W = Math.max(2, Math.round(bu * d)), H = Math.max(2, Math.round(bv * d));
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const x2 = c.getContext("2d"), bild = x2.createImageData(W, H), px = new Uint32Array(bild.data.buffer);
      const F = FARBE[art], s = f.nr * 7 + 3, um = bu * M, vm = bv * M, mpp = M / d;   // Meter je Pixel
      const gasse = um * (0.42 + hash(s, 1, 9) * 0.12), vg = 2.2;   // Fahrgasse (Mitte der Doppelspur), Vorgewende
      const lu = um * (0.2 + 0.6 * hash(s, 2, 9)), lv = vm * (0.25 + 0.5 * hash(s, 3, 9)), lru = 0.8 + 0.6 * hash(s, 4, 9), lrv = 1.2 + 0.8 * hash(s, 5, 9);
      /* Drillreihen: in Wirklichkeit 12,5 cm, aus der Ferne unsichtbar – wie in Aufbauspielen etwas breiter gemalt, damit man
         in jeder Zoomstufe sieht, dass es ein bestellter Acker ist (mindestens 2,6 Pixel von Reihe zu Reihe) */
      const rs = Math.max(0.25, 2.6 * mpp);
      const aehren = mpp <= 0.085 && HALME[art], sw = art === "stoppel" ? schwaden(um) : null;
      const rc = ecke(f) * M;   // abgerundete Ecken (wo der Mähdrescher wendet), in Metern
      let y = 0;
      const spur = (u, v) => {
        /* Abstand zur nächsten Radspur in Metern (Spurweite 1,8 m) – längs im Feld, quer im Vorgewende */
        let best = 9;
        if (v > 1.1 && v < vm - 1.1) best = Math.min(Math.abs(u - gasse + 0.9), Math.abs(u - gasse - 0.9));
        if (u > 0.5 && u < um - 0.5) for (const vc of [1.1, vm - 1.1]) best = Math.min(best, Math.abs(v - vc + 0.9), Math.abs(v - vc - 0.9));
        return best;
      };
      function schritt(ms) {
        const ende = performance.now() + ms;
        for (; y < H; y++) {
          if (ms !== Infinity && (y & 7) === 0 && performance.now() > ende) return false;
          const v = (y + 0.5) * mpp;
          for (let x = 0; x < W; x++) {
            const u = (x + 0.5) * mpp, i = y * W + x;
            let b = (rausch(u / 3.2, v / 3.2, s) - 0.5) * 0.16 + (rausch(u / 9, v / 9, s + 5) - 0.5) * 0.14 + (hash(x, y, s) - 0.5) * 0.12;
            let mc = null, ma = 0;
            const vor = v < vg || v > vm - vg, rk = vor ? v : u, ph = (rk / rs) % 1, rand = Math.min(u, um - u, v, vm - v), sp = spur(u, v);
            if (art === "schnee") {
              b *= 0.4;
              if ((u / 0.5) % 1 < 0.18) { mc = F.spur; ma = 0.55; }
              if (hash(x, y, s + 3) > 0.965) { mc = F.dunkel; ma = 0.6; }
              if (sp < 0.2) { mc = F.spur; ma = 0.4; }
            } else if (art === "saat") {
              b += (hash(x >> 1, y >> 1, s + 4) - 0.5) * 0.16;
              if (ph > 0.35 && ph < 0.65 && hash(x, y, s + 6) > 0.22) { mc = F.hell; ma = 0.75; } else b -= 0.04;
              if (sp < 0.22) { mc = F.spur; ma = 0.7; }
            } else if (art === "stoppel") {
              if (ph < 0.35) b -= 0.1;
              if (hash(x, y, s + 7) > 0.7) b += 0.08;
              for (let k = 0; k < sw.length; k++) {
                const du = Math.abs(u - sw[k] - Math.sin(v * 0.6 + k) * 0.25), br = 0.55 * (0.8 + 0.4 * rausch(v * 0.8, k, s + 8));
                if (du < br) { mc = F.hell; ma = 0.85 * Math.min(1, (br - du) / 0.15); b += (hash(x, y, s + 9) - 0.5) * 0.14; break; }
              }
              if (sp < 0.22 && !mc) { mc = F.spur; ma = 0.35; }
            } else {
              /* stehendes Korn (reif, gelb, grün) */
              let lager = false;
              if (art === "reif") {
                const du = u - lu, dv = v - lv, e = ((du + dv * 0.5) / lru) ** 2 + ((dv - du * 0.3) / lrv) ** 2 + (rausch(u * 1.4, v * 1.4, s + 9) - 0.5) * 1.3;
                if (e < 1) { lager = true; b += ((u * 0.8 + v * 0.6) / 0.18) % 1 < 0.5 ? 0.06 : 0.01; }
              }
              /* die Bahnen der Drillmaschine (3 m) wechseln ganz leicht hell und dunkel */
              b += Math.floor(rk / 3) % 2 ? 0.025 : -0.025;
              if (!lager) {
                if (ph < 0.32) b -= 0.11; else if (ph > 0.5 && ph < 0.72) b += 0.05;
                if (aehren) {
                  /* je Zelle eine Ähre (von oben ein längliches Korn), auf der Schattenseite dunkler */
                  const cu = Math.floor(u / 0.125), ov = hash(cu, 0, s) * 3, cv = Math.floor(v / 0.16 + ov);
                  const eu = u / 0.125 - cu - 0.5 - (hash(cu, cv, s) - 0.5) * 0.3, ev = v / 0.16 + ov - cv - 0.5;
                  const e = (eu / 0.32) ** 2 + (ev / 0.42) ** 2;
                  if (e < 1) { mc = F.hell; ma = (1 - e) * 0.7; } else if (ev > 0.2 && e < 1.9) b -= 0.12;
                } else if (hash(x, y, s + 1) > 0.6) { mc = F.hell; ma = 0.25; }
              }
              if (sp < 0.24) { mc = F.spur; ma = 0.85 * Math.sqrt(1 - sp / 0.24); }
              if (rand < 0.3) { b -= 0.08 * (1 - rand / 0.3); if (art !== "gruen" && !mc) { mc = [120, 140, 60]; ma = 0.15; } }
            }
            let r = F.grund[0] * (1 + b), g = F.grund[1] * (1 + b), bl = F.grund[2] * (1 + b);
            if (mc) { r += (mc[0] - r) * ma; g += (mc[1] - g) * ma; bl += (mc[2] - bl) * ma; }
            /* Rand: runde Ecken und leicht ausgefranste Kante (einzelne Halme stehen vor oder fehlen) */
            const cu = u < rc ? rc - u : u > um - rc ? u - um + rc : 0, cv = v < rc ? rc - v : v > vm - rc ? v - vm + rc : 0;
            const innen = cu && cv ? rc - Math.hypot(cu, cv) : rand, franse = 0.22 * rausch((u + v) / 0.22, 0.5, s + 12);
            const al = Math.max(0, Math.min(1, (innen - franse) / mpp + 0.5));
            if (al <= 0) { px[i] = 0; continue; }
            px[i] = ((al * 255) << 24) | (Math.max(0, Math.min(255, bl)) << 16) | (Math.max(0, Math.min(255, g)) << 8) | Math.max(0, Math.min(255, r));
          }
        }
        x2.putImageData(bild, 0, 0);
        return true;
      }
      return { c: c, d: d, schritt: schritt };
    }

    /* Der Feldrain (am Boden, um den Acker herum), nachts schon abgedunkelt: klein, darum gleich ganz */
    const RAIN = 1.3;   // Breite in u/v
    function rainBacken(f, jahr, dunkel, d) {
      const bu = f.u1 - f.u0, bv = f.v1 - f.v0, W = Math.round((bu + 2 * RAIN) * d), H = Math.round((bv + 2 * RAIN) * d);
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const x2 = c.getContext("2d"), bild = x2.createImageData(W, H), px = new Uint32Array(bild.data.buffer);
      const s = f.nr * 11 + 5, mpp = M / d, R = RAIN * M, um = bu * M, vm = bv * M;
      const gras = jahr === "winter" ? [232, 237, 244] : jahr === "herbst" ? [124, 122, 64] : [78, 124, 48];
      const blumen = jahr === "winter" ? 2 : jahr === "herbst" ? 0.975 : 0.9;
      const nacht = [16, 22, 44];
      for (let y = 0; y < H; y++) {
        const v = (y + 0.5) * mpp - R;
        for (let x = 0; x < W; x++) {
          const u = (x + 0.5) * mpp - R;
          const aus = Math.max(-u, u - um, -v, v - vm);
          if (aus <= -0.05) continue;   // unter dem Korn
          const grenze = R * (0.5 + 0.5 * rausch(u / 1.3 + v / 1.7, v / 1.3 - u / 2.1, s));
          if (aus > grenze) continue;
          const a = Math.min(1, (grenze - aus) / 0.2) * 0.95;
          let b = (hash(x, y, s) - 0.5) * 0.3 + (rausch(u / 0.6, v / 0.6, s + 1) - 0.5) * 0.2, col = gras;
          /* Blumen: je Zelle (0,2 m) höchstens eine, Mohn, Kornblume oder Kamille */
          const cu = Math.floor(u / 0.2), cv = Math.floor(v / 0.2), hb = hash(cu, cv, s + 2);
          if (hb > blumen) {
            const fu = (cu + 0.5 + (hash(cu, cv, s + 3) - 0.5) * 0.6) * 0.2, fv = (cv + 0.5 + (hash(cu, cv, s + 4) - 0.5) * 0.6) * 0.2;
            if (Math.hypot(u - fu, v - fv) < Math.max(0.07, mpp * 0.7)) { const w = hash(cu, cv, s + 5); col = w < 0.45 ? [214, 40, 32] : w < 0.75 ? [70, 112, 222] : [246, 244, 230]; b = 0; }
          }
          let r = col[0] * (1 + b), g = col[1] * (1 + b), bl = col[2] * (1 + b);
          r += (nacht[0] - r) * dunkel; g += (nacht[1] - g) * dunkel; bl += (nacht[2] - bl) * dunkel;
          px[y * W + x] = ((a * 255) << 24) | (Math.max(0, Math.min(255, bl)) << 16) | (Math.max(0, Math.min(255, g)) << 8) | Math.max(0, Math.min(255, r));
        }
      }
      x2.putImageData(bild, 0, 0);
      return c;
    }

    const lager = new Map();   // Schlüssel → Leinwand
    let warte = null;          // ein Auftrag, der in Stücken gebacken wird
    function weiter() {
      if (!warte) return;
      if (warte.a.schritt(6)) {
        lager.set(warte.k, warte.a.c);
        /* je Acker und Stufe bleiben die grobe Fassung und die neueste */
        for (const k of Array.from(lager.keys())) if (k.startsWith(warte.p) && k !== warte.k && !k.endsWith("|4")) lager.delete(k);
        warte = null; if (L()) L().unruhe = 2;
        return;
      }
      setTimeout(weiter, 16);
    }
    function oberflaeche(f, art, d) {
      const p = "k|" + f.nr + "|" + art + "|" + (f.u1 - f.u0) + "x" + (f.v1 - f.v0) + "|", k = p + d;
      const da = lager.get(k); if (da) return da;
      /* eine andere Stufe dieses Ackers ist vorbei: weg damit */
      for (const q of Array.from(lager.keys())) if (q.startsWith("k|" + f.nr + "|") && !q.startsWith(p)) lager.delete(q);
      let ersatz = null;
      for (const [q, c] of lager) if (q.startsWith(p)) ersatz = c;
      if (!ersatz) { const a = auftrag(f, art, Math.min(d, 4)); a.schritt(Infinity); ersatz = a.c; lager.set(p + Math.min(d, 4), ersatz); if (d <= 4) return ersatz; }
      if (!warte || warte.k !== k) { const neu = !warte; warte = { k: k, p: p, a: auftrag(f, art, d) }; if (neu) setTimeout(weiter, 30); }
      return ersatz;
    }
    function rain(f, jahr, dunkel, d) {
      const n = Math.round(dunkel * 10), k = "r|" + f.nr + "|" + jahr + "|" + n + "|" + d + "|" + (f.u1 - f.u0) + "x" + (f.v1 - f.v0);
      let c = lager.get(k);
      if (!c) {
        for (const q of Array.from(lager.keys())) if (q.startsWith("r|" + f.nr + "|")) lager.delete(q);
        c = rainBacken(f, jahr, n / 10, d); lager.set(k, c);
      }
      return c;
    }
    return { stufe: stufe, oberflaeche: oberflaeche, rain: rain, schwaden: schwaden, umriss: umriss, FARBE: FARBE, HALME: HALME, RAIN: RAIN, M: M, hash: hash, lager: lager };
  })();
  ST.korn = KORN;   // für Sonden
  /* ein Bild in (u, v)-Einheiten auf das schräge Viereck A (u0, v0) → B (u1, v0), C (u0, v1) legen */
  function aufViereck(g, c, A, B, C, bu, bv) {
    g.save();
    g.transform((B[0] - A[0]) / bu, (B[1] - A[1]) / bu, (C[0] - A[0]) / bv, (C[1] - A[1]) / bv, A[0], A[1]);
    g.drawImage(c, 0, 0, bu, bv);
    g.restore();
  }
  const kornRgb = (c, k, a) => "rgba(" + Math.round(Math.min(255, c[0] * k)) + "," + Math.round(Math.min(255, c[1] * k)) + "," + Math.round(Math.min(255, c[2] * k)) + "," + (a == null ? 1 : a) + ")";
  /* als KORN.maler, damit Sonden ihn auch im gebündelten (verkleinerten) Stand finden */
  KORN.maler = function (g, t, Z) {
    const felder = D.FELD_ORTE || []; if (!felder.length) return;
    KORN.ballen = 0;
    const z = O.zeichenJetzt || {}, winter = SZ.jahr === "winter", dunkel = Math.min(0.78, (Z && Z.nacht || 0) * 0.8);
    const P = (u, v, h) => ST.proj((u + v) / 2, (v - u) / 2, h), ks = ST.KZ * K.s;
    for (const f of felder) {
      if (f.u0 == null) continue;
      const st = KORN.stufe(z["feld" + f.nr], winter), F = KORN.FARBE[st.art], h = st.h, R = KORN.RAIN;
      const bu = f.u1 - f.u0, bv = f.v1 - f.v0;
      const ecken = [P(f.u0, f.v0, 0), P(f.u1, f.v0, 0), P(f.u1, f.v1, 0), P(f.u0, f.v1, 0)];
      const rr = (R + 1) * K.s + h * ks;
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const p of ecken) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
      if (x1 < -rr || y1 < -rr || x0 > K.W + rr || y0 > K.H + rr) continue;
      /* Pixel je u/v-Einheit auf dem Bild → Zoomstufe der Textur */
      const je = Math.max(Math.hypot(ecken[1][0] - ecken[0][0], ecken[1][1] - ecken[0][1]) / bu, Math.hypot(ecken[3][0] - ecken[0][0], ecken[3][1] - ecken[0][1]) / bv);
      const d = je <= 4 ? 4 : je <= 8 ? 8 : je <= 14 ? 14 : 22;
      /* 1. Feldrain am Boden */
      aufViereck(g, KORN.rain(f, SZ.jahr, dunkel, Math.min(d, 8)), P(f.u0 - R, f.v0 - R, 0), P(f.u1 + R, f.v0 - R, 0), P(f.u0 - R, f.v1 + R, 0), bu + 2 * R, bv + 2 * R);
      /* 2. Halmwand: die Abschnitte des runden Umrisses, deren Außenseite im Bild nach unten zeigt (zum Betrachter) */
      const um = KORN.umriss(f), U = um.map((q) => P(q[0], q[1], 0)), Ob = um.map((q) => P(q[0], q[1], h)), n = um.length;
      let fl = 0; for (let i = 0; i < n; i++) { const a = U[i], b = U[(i + 1) % n]; fl += a[0] * b[1] - b[0] * a[1]; }
      const vorn = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, ex = U[j][0] - U[i][0], ey = U[j][1] - U[i][1];
        if ((fl > 0 ? -ex : ex) > 0.001) vorn.push([i, j]);
      }
      const wand = new Path2D(), fuss = new Path2D();
      for (const [i, j] of vorn) {
        wand.moveTo(U[i][0], U[i][1]); wand.lineTo(U[j][0], U[j][1]); wand.lineTo(Ob[j][0], Ob[j][1]); wand.lineTo(Ob[i][0], Ob[i][1]); wand.closePath();
        fuss.moveTo(U[i][0], U[i][1]); fuss.lineTo(U[j][0], U[j][1]);
      }
      g.save();
      g.fillStyle = kornRgb(F.wand, 0.9); g.fill(wand);
      if (h > 0.2) {
        /* oben fängt die Wand Licht (Ähren), unten ist sie im Schatten der Halme */
        g.lineWidth = Math.max(1, h * ks * 0.8); g.strokeStyle = kornRgb(F.wand, 0.55, 0.5);
        g.save(); g.clip(wand); g.stroke(fuss); g.restore();
      }
      g.strokeStyle = "rgba(40,30,12,0.3)"; g.lineWidth = Math.max(1, 0.16 * K.s); g.stroke(fuss);
      g.restore();
      /* 3. die Oberfläche (Textur mit runden Ecken) */
      const oben = [P(f.u0, f.v0, h), P(f.u1, f.v0, h), P(f.u0, f.v1, h)];
      aufViereck(g, KORN.oberflaeche(f, st.art, d), oben[0], oben[1], oben[2], bu, bv);
      /* 4. Kornwellen: Böen als helle Streifen mit dunklem Tal dahinter, zwei Züge mit verschiedenem Tempo */
      if (KORN.HALME[st.art]) {
        g.save();
        g.transform((oben[1][0] - oben[0][0]) / bu, (oben[1][1] - oben[0][1]) / bu, (oben[2][0] - oben[0][0]) / bv, (oben[2][1] - oben[0][1]) / bv, oben[0][0], oben[0][1]);
        g.globalCompositeOperation = "source-atop";   // nur auf dem Korn, nicht daneben
        const w = 2.6, lauf = bv + 2 * w;
        for (const [tempo, st0, al] of [[2.4, 0, 0.16], [2.4, 0.5, 0.12], [1.5, 0.27, 0.1], [1.5, 0.77, 0.08]]) {
          const m = ((t * tempo + st0 * lauf) % lauf) - w;
          const gr = g.createLinearGradient(0, m - w, 0, m + w);
          gr.addColorStop(0, "rgba(255,246,206,0)"); gr.addColorStop(0.35, "rgba(255,246,206," + al + ")"); gr.addColorStop(0.55, "rgba(255,246,206,0)");
          gr.addColorStop(0.75, "rgba(60,40,0," + (al * 0.5) + ")"); gr.addColorStop(1, "rgba(60,40,0,0)");
          g.fillStyle = gr; g.fillRect(0, Math.max(0, m - w), bu, Math.min(bv, m + w) - Math.max(0, m - w));
        }
        g.restore();
      }
      /* 5. nah dran: einzelne Halme mit Ähren an der vorderen Kante, sie wiegen sich */
      if (KORN.HALME[st.art] && K.s > 6 * K.dpr && h > 0.25) {
        const schritt = 0.11 / KORN.M, wehen = 0.07 * h * ks;
        const halm = new Path2D(), aehre = new Path2D();
        let k = 0;
        for (const [i, j] of vorn) {
          const a = um[i], b = um[j], lang = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.round(lang / schritt));
          for (let q = 0; q < m; q++, k++) {
            const u = a[0] + (b[0] - a[0]) * q / m, v = a[1] + (b[1] - a[1]) * q / m, A = P(u, v, h * 0.2);
            if (A[0] < -20 || A[0] > K.W + 20 || A[1] < -20 || A[1] > K.H + 40) continue;
            const T = P(u, v, h * (0.9 + 0.18 * KORN.hash(k, 3, f.nr))), sw = Math.sin(t * 1.7 + (u + v) * 0.35 + k * 0.7) * wehen;
            halm.moveTo(A[0], A[1]); halm.lineTo(T[0] + sw, T[1]);
            aehre.moveTo(T[0] + sw, T[1]); aehre.lineTo(T[0] + sw * 1.4, T[1] - 0.1 * ks);
          }
        }
        g.save(); g.lineCap = "round";
        g.strokeStyle = kornRgb(F.wand, 0.8); g.lineWidth = Math.max(0.8, 0.02 * K.s); g.stroke(halm);
        g.strokeStyle = kornRgb(F.hell, 1); g.lineWidth = Math.max(1.2, 0.045 * K.s); g.stroke(aehre);
        g.restore();
      }
      /* 6. Rundballen auf dem Stoppelfeld */
      if (st.art === "stoppel" && K.s > 2.5 * K.dpr) {
        const sw = KORN.schwaden(bu * KORN.M), r = 0.75 * ks;
        for (let k = 0; k < Math.min(3, sw.length); k++) {
          const u = f.u0 + sw[k] / KORN.M, v = f.v0 + bv * (0.25 + 0.5 * KORN.hash(k, 7, f.nr));
          const E1 = P(u - 0.85, v, 0.75), E2 = P(u + 0.85, v, 0.75), S = P(u + 0.5, v + 0.5, 0), E = E1[1] > E2[1] ? E1 : E2;
          g.save();
          g.fillStyle = "rgba(30,26,10,0.28)"; g.beginPath(); g.ellipse(S[0], S[1], r * 1.4, r * 0.55, 0, 0, 7); g.fill();
          g.lineCap = "butt"; g.strokeStyle = kornRgb([200, 170, 98], 1); g.lineWidth = 2 * r;
          g.beginPath(); g.moveTo(E1[0], E1[1]); g.lineTo(E2[0], E2[1]); g.stroke();
          g.fillStyle = kornRgb([226, 200, 132], 1); g.beginPath(); g.arc(E[0], E[1], r, 0, 7); g.fill();
          g.strokeStyle = "rgba(120,92,40,0.6)"; g.lineWidth = Math.max(0.8, 0.06 * K.s);
          g.beginPath(); g.arc(E[0], E[1], r * 0.62, 0.4, 5.6); g.moveTo(E[0] + r * 0.28, E[1]); g.arc(E[0], E[1], r * 0.28, 0, 4.8); g.stroke();
          g.restore(); KORN.ballen++;
        }
      }
      /* 7. nachts dunkler wie der Boden – nur auf Wand und Korn (source-atop), der Rain ist schon dunkel gebacken */
      if (dunkel > 0.01) {
        const flaeche = new Path2D(wand);
        flaeche.moveTo(Ob[0][0], Ob[0][1]); for (let i = 1; i < n; i++) flaeche.lineTo(Ob[i][0], Ob[i][1]); flaeche.closePath();
        g.save(); g.globalCompositeOperation = "source-atop"; g.fillStyle = "rgba(16,22,44," + dunkel.toFixed(3) + ")"; g.fill(flaeche); g.restore();
      }
    }
  };
  SZ.bodenMaler.push(KORN.maler);
  if (L()) L().unruhe = 2;
})();
