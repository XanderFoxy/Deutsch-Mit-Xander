/* =====================================================================
   AUTO-SCHAU NACHLADEN — FASSUNG 812
   ---------------------------------------------------------------------
   Die Auto-Schau (autoschau.js, 40 KB) steckt nicht mehr in der
   gebündelten leicht.min.js: der kleine Rahmen im Spiel soll unter
   300 KB laden (Funk 207: „leicht und stabil"). Diese Vertretung steht
   in der Bündelung an ihrer Stelle; sie holt autoschau.min.js, sobald
   eine Karte eines Autos aufgeht oder ein Finger ein Auto berührt, und
   öffnet dann die echte Schau. Mit ?quelle=1 lädt autoschau.js direkt,
   dann tut diese Datei nichts.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST || ST.autoschau || !window.LEICHT_AUTOSCHAU) return;
  const ARTEN = { viper: 1, batmobil: 1 };
  let laden = null, warte = null, versuch = 0;
  const AS = (ST.autoschau = { offen: false, angefragt: [], vertretung: true });
  AS.vorladen = function () {
    return laden || (laden = new Promise((ja, nein) => {
      const s = document.createElement("script");
      /* MODUL-UMBAU M5: das Stück kommt aus dem Vite-Bau (bau/…) und ist ein Modul – klassisch geladen fehlte ihm "use strict".
         Ein Modul, dessen Abruf gescheitert ist, merkt sich der Browser für die ganze Seite (Modul-Tabelle): dieselbe
         Adresse noch einmal scheitert sofort, ohne Netz – nach einem Aussetzer im Mobilnetz bliebe die Auto-Schau bis zum
         Neuladen aus. Darum hat jeder weitere Versuch eine eigene Adresse (?wieder=n, sw.js reicht sie ans Netz durch);
         der erste kommt wie bisher ohne Abfrage aus dem Speicher. */
      s.type = "module"; s.src = window.LEICHT_AUTOSCHAU + (versuch ? "?wieder=" + versuch : ""); s.async = true;
      versuch++;
      s.onload = () => (ST.autoschau !== AS ? ja() : nein());
      s.onerror = () => { laden = null; nein(); };
      document.head.appendChild(s);
    }));
  };
  AS.oeffnen = function (id, opt) {
    if (!ARTEN[id] || !(ST.autos && ST.autos.ARTEN && ST.autos.ARTEN[id])) return false;
    warte = { id: id, opt: opt || {} };
    AS.vorladen().then(() => {
      const w = warte; warte = null;
      if (w && !ST.autoschau.oeffnen(w.id, w.opt) && w.opt.sonst) w.opt.sonst();
    }, () => { const w = warte; warte = null; if (w && w.opt.sonst) w.opt.sonst(); });
    return true;
  };
  AS.schliessen = function () { warte = null; };
  AS.auffrischen = function () {};
  AS.stellen = function () {};
  AS.zustand = function () { return { offen: false, laedt: !!warte, angefragt: [] }; };
})();
