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
  let laden = null, warte = null;
  const AS = (ST.autoschau = { offen: false, angefragt: [], vertretung: true });
  AS.vorladen = function () {
    return laden || (laden = new Promise((ja, nein) => {
      const s = document.createElement("script");
      s.src = window.LEICHT_AUTOSCHAU; s.async = true;
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
