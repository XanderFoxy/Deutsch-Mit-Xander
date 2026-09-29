/* =====================================================================
   LEICHTE STADT — KERN (Kamera, Abbildung, Licht, Tageszeiten)
   ---------------------------------------------------------------------
   XANDER: „ob du auf der Basis von diesem Konzept das Ganze in einem
   kleineren Maßstab schlanke und Systemressourcen sparend machen kannst
   … in einem separaten Ordner … dass die Leute eine Möglichkeit haben zu
   upgraden auf diese Baukasten-Stadt."

   Die leichte Stadt rechnet keine Modelle mehr: jedes Gebäude liegt als
   fertig gemaltes Bild vor (werkzeug/stadt-backen.js malt es aus den
   großen Modellen von Winterhausen). Hier steht nur, was zum Anordnen
   und Zeigen nötig ist – dieselbe Abbildung wie in Winterhausen, damit
   Boden (stadt/boden.js) und Bilder genau aufeinander passen.

   Welt in Metern: x nach Osten, y nach Süden, z nach oben.
   Kamera orthografisch 2:1, drehbar (FASSUNG 820: in 45°-Schritten, während der Geste stufenlos).
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  const KX = Math.SQRT1_2, KY = Math.SQRT1_2 * 0.5, KZ = Math.sqrt(3) / 2;
  ST.KX = KX; ST.KY = KY; ST.KZ = KZ;
  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  /* Licht im Kameraraum – wie in Winterhausen (die Bilder sind so gemalt) */
  ST.LICHT = norm([-0.42, 0.74, 0.66]);
  /* FASSUNG 826 — XANDER: „Jetzt muss das nur noch schön Spielraum geben nach unten hin, weil ich will noch den Kölner Dom
     rein bauen". Die Bodenkarte (Wege, Wasser) reicht 56 statt 40 m über das Dorf hinaus (±128 m), damit auch der Weg
     zum Dom unten auf dem Bauland gemalt wird (stadt/boden.js liest ST.bodenRand). */
  ST.bodenRand = 56;

  ST.zufall = function (seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  /* FASSUNG 825 — die Uhr der Stadt: deutsche Ortszeit (Europe/Berlin), für Tag/Nacht, Laternen, Fenster und die
     Rathausuhr. XANDER: „dass sie nicht die ganze Nacht beleuchtet sind, um Strom zu sparen beziehungsweise es ist ja
     nicht jeder immer nachts noch wach". ?uhr=21:00 (auch 1:30, 05:30:10 oder 18.2) stellt die Uhr zum Prüfen auf diese
     Zeit – sie läuft von dort weiter; ST.uhrStellen("14:59:55") tut dasselbe für die Sonden.
     ST.uhr() → { sek (seit Mitternacht), h, m, s, stunde (Kommazahl) }. */
  const BERLIN = (function () { try { return new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit" }); } catch (e) { return null; } })();
  let uhrAbstand = null, uhrAbstandBis = 0, uhrVersatz = 0;
  function berlinSek(ms) {
    /* Abstand Berlin–UTC einmal je Minute bestimmen (formatToParts ist teuer), dann nur noch rechnen */
    if (uhrAbstand == null || ms > uhrAbstandBis || ms < uhrAbstandBis - 120000) {
      let s = null;
      if (BERLIN) try { const t = BERLIN.formatToParts(new Date(ms)), w = {}; for (const p of t) w[p.type] = +p.value; s = (w.hour % 24) * 3600 + w.minute * 60 + w.second; } catch (e) { s = null; }
      if (s == null) { const d = new Date(ms); s = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); }
      const utc = Math.floor(ms / 1000) % 86400;
      uhrAbstand = ((s - utc) % 86400 + 86400) % 86400; uhrAbstandBis = ms + 60000;
    }
    return ((ms / 1000 + uhrAbstand) % 86400 + 86400) % 86400;
  }
  function uhrLesen(t) {
    if (t == null || t === "") return null;
    const s = String(t).trim(), m = s.match(/^(\d{1,2})[:.h](\d{2})(?:[:.](\d{2}))?$/);
    if (m && s.indexOf(":") >= 0) return ((+m[1]) % 24) * 3600 + (+m[2]) * 60 + (+(m[3] || 0));
    const z = parseFloat(s);
    return isFinite(z) ? ((z % 24 + 24) % 24) * 3600 : null;
  }
  ST.uhrStellen = function (t) { const ziel = uhrLesen(t); uhrVersatz = ziel == null ? 0 : ziel - berlinSek(Date.now()); };
  ST.uhr = function () {
    const sek = ((berlinSek(Date.now()) + uhrVersatz) % 86400 + 86400) % 86400;
    const h = Math.floor(sek / 3600), m = Math.floor(sek / 60) % 60, s = Math.floor(sek) % 60;
    return { sek: sek, h: h, m: m, s: s, stunde: sek / 3600 };
  };
  ST.uhrFest = false;
  try { const u = new URLSearchParams(location.search).get("uhr"); if (u != null && uhrLesen(u) != null) { ST.uhrStellen(u); ST.uhrFest = true; } } catch (e) {}

  ST.hash2 = function (x, y, s) {
    let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };

  /* Tageszeiten – dieselben Werte wie Winterhausen (Boden-Shader) */
  ST.ZEITEN = {
    tag:   { name: "Tag",       amb: [0.64, 0.68, 0.78], sonne: [0.40, 0.36, 0.28], nacht: 0,    schatten: 0.34 },
    abend: { name: "Dämmerung", amb: [0.38, 0.47, 0.62], sonne: [0.30, 0.22, 0.15], nacht: 0.75, schatten: 0.26 },
    nacht: { name: "Nacht",     amb: [0.20, 0.24, 0.40], sonne: [0.06, 0.07, 0.12], nacht: 1,    schatten: 0.18 }
  };

  const kam = (ST.kamera = { x: 0, y: 0, s: 20, dreh: 0, W: 800, H: 600, dpr: 1, min: 4, max: 60 });
  /* FASSUNG 820 — XANDER (Walkie 309): „Zwei-Finger-Drehen mit Einrasten in 8 Winkeln", vorher Funk 207: „stufenlos
     drehen … wie Google Maps". Die Kameradrehung kam.dreh zählt weiter in Vierteldrehungen, darf aber jetzt jeden Wert
     haben: 0,5 = 45°, während der Geste auch Zwischenwerte (stadt-leicht/drehen.js rastet danach auf 45°-Schritte ein).
     ST.drehMod bringt jeden Wert auf 0 ≤ d < 4 (echter Modulo, auch für negative Werte – statt „& 3", das Nachkommastellen
     abschneidet). drehXY rechnet ganze Vierteldrehungen weiter exakt (gleiche Zahlen wie vorher), sonst mit cos/sin. */
  const drehMod = (d) => { d = (+d || 0) % 4; if (d < 0) d += 4; return d >= 4 ? 0 : d + 0; };   // (+0: nie −0)
  ST.drehMod = drehMod;
  function drehXY(x, y, d) {
    d = drehMod(d);
    if (d === Math.floor(d)) switch (d) { case 1: return [-y, x]; case 2: return [-x, -y]; case 3: return [y, -x]; default: return [x, y]; }
    const w = d * Math.PI / 2, c = Math.cos(w), s = Math.sin(w);
    return [x * c - y * s, x * s + y * c];
  }
  ST.drehXY = drehXY;
  /* Welt → Bild (Gerätepixel) */
  ST.proj = function (x, y, z) {
    const r = drehXY(x - kam.x, y - kam.y, kam.dreh);
    return [kam.W / 2 + (r[0] - r[1]) * KX * kam.s, kam.H / 2 + (r[0] + r[1]) * KY * kam.s - (z || 0) * KZ * kam.s];
  };
  /* Bild → Boden (z = 0) */
  ST.aufBoden = function (px, py) {
    const u = (px - kam.W / 2) / (KX * kam.s), v = (py - kam.H / 2) / (KY * kam.s);
    const a = (u + v) / 2, b = (v - u) / 2;
    const w = drehXY(a, b, -kam.dreh);   // FASSUNG 820 — zurückdrehen um genau den Kamerawinkel (auch schräg)
    return [w[0] + kam.x, w[1] + kam.y];
  };
  /* Tiefe im Kameraraum (größer = weiter vorn) */
  ST.tiefe = function (x, y) { const r = drehXY(x, y, kam.dreh); return r[0] + r[1]; };
})();
