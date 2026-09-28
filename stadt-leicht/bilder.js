/* =====================================================================
   LEICHTE STADT — BILDER (fertig gemalte Gebäude laden und wählen)
   ---------------------------------------------------------------------
   XANDER: „dass man das weit aufziehen kann. Das ist schön aussieht und
   nicht pixelig und gut fürs Auge die Details zu erkennen sind sowie bei
   dem Spiel Simpsons Tapped Out."

   Jedes Gebäude gibt es in zwei Größen (verzeichnis.json):
     _k  klein  (≈ 18 Bildpunkte je Meter) – Übersicht, lädt schnell
     _g  groß   (≈ 56 Bildpunkte je Meter) – ganz nah, gestochen scharf
     _m  Baustellen (≈ 26 Bildpunkte je Meter)
   Beim Aufziehen wechselt die Stadt unsichtbar vom kleinen zum großen
   Bild; solange das große noch lädt, bleibt das kleine (gestreckt) stehen.
   Geladen wird nur, was im Bild ist – höchstens 6 Bilder gleichzeitig,
   das Nächstliegende zuerst.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const LB = (ST.bilder = {});
  const PFAD = "stadt-leicht/bilder/";
  LB.vz = {};
  const cache = new Map();          // Name → { img, fertig, fehler }
  const warte = [];                 // Namen, die geladen werden sollen
  let laufend = 0;
  const GLEICHZEITIG = 6;
  LB.version = "";

  LB.laden = function (v) {
    LB.version = v || "";
    return fetch(PFAD + "verzeichnis.json" + (v ? "?v=" + v : "")).then((r) => r.json()).then((j) => { LB.vz = j; return j; });
  };

  function weiter() {
    while (laufend < GLEICHZEITIG && warte.length) {
      const name = warte.shift();
      const e = cache.get(name);
      if (!e || e.fertig || e.laedt) continue;
      e.laedt = true; laufend++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        const fertig = () => { e.img = img; e.fertig = true; e.laedt = false; laufend--; LB.neu = true; weiter(); };
        if (img.decode) img.decode().then(fertig, fertig); else fertig();
      };
      img.onerror = () => { e.fehler = true; e.laedt = false; laufend--; weiter(); };
      img.src = PFAD + name + ".webp" + (LB.version ? "?v=" + LB.version : "");
    }
  }
  /* Bild holen (lädt es, wenn nötig); gibt das Bild zurück, sobald es da ist */
  LB.bild = function (name, dringend) {
    let e = cache.get(name);
    if (!e) { e = { img: null, fertig: false }; cache.set(name, e); }
    if (e.fertig) { e.zuletzt = LB.takt; return e.img; }
    if (!e.laedt && !e.fehler && warte.indexOf(name) < 0) { if (dringend) warte.unshift(name); else warte.push(name); weiter(); }
    return null;
  };
  LB.takt = 0;
  /* Große Bilder, die lange nicht gebraucht wurden, wieder freigeben
     (Speicher auf dem Telefon) */
  LB.aufraeumen = function () {
    let n = 0;
    for (const [k, e] of cache) if (e.fertig && /_g$/.test(k) && LB.takt - (e.zuletzt || 0) > 900) { cache.delete(k); n++; }
    return n;
  };

  /* Welche Größe? stufe = Maßstab des Objekts (Gebäudestufe 0,82…1,02) */
  LB.wahl = function (basis, s, stufe) {
    const k = LB.vz[basis + "_k"], g = LB.vz[basis + "_g"], m = LB.vz[basis + "_m"];
    if (m) return { name: basis + "_m", meta: m };
    if (!k && !g) return null;
    const bedarf = s * (stufe || 1);
    /* ab dem 1,3-fachen der kleinen Auflösung lohnt das große Bild */
    if (g && (!k || bedarf > k.s * 1.3)) {
      if (LB.bild(basis + "_g")) return { name: basis + "_g", meta: g };
      /* das große lädt noch: das kleine gestreckt zeigen */
      if (k && LB.bild(basis + "_k", true)) return { name: basis + "_k", meta: k };
      return null;
    }
    if (LB.bild(basis + "_k")) return { name: basis + "_k", meta: k };
    return null;
  };
  LB.fertig = function (name) { const e = cache.get(name); return !!(e && e.fertig); };
  LB.offen = function () { return warte.length + laufend; };
})();
