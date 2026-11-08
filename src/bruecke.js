/* =====================================================================
   MODUL-UMBAU M4 (MODULE-PLAN.md Abschnitt 3) — DIE BRÜCKE ZU app.js
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung".
   Die ersten Gruppen aus app.js sind echte Module (src/app/tutor.js,
   src/app/betonung.js). Vite baut diese Datei mit beiden zu EINEM Stück
   bau/bruecke-<hash>.js; index.html lädt es als <script type="module">
   VOR app.js in derselben „defer"-Reihe (feste Reihenfolge).
   Hier kommen die Eingänge unter ihrem alten Namen auf window – die dünnen
   Weiterleitungen in app.js (dmaModul) holen sie aber aus der eigenen
   Tabelle DMA_BRUECKE.fn – nie von window. Überschrieben wird nichts: steht
   ein Name schon auf window, bleibt er dort, steht laut in
   DMA_BRUECKE.konflikt, und app.js ruft trotzdem das eigene Modul, nie den
   fremden Wert (Sonde pruefe-887-modul-app.js, K).
   Kommt die Brücke erst NACH app.js (Rückweg über src/, falls bau/ nicht
   geladen werden konnte), holt app.js die inzwischen gemerkten Rufe nach.
   ===================================================================== */
import * as tutor from "./app/tutor.js";
import * as betonung from "./app/betonung.js";

if (!window.DMA_BRUECKE) {
  const namen = [], konflikt = [], fn = Object.create(null);
  [tutor, betonung].forEach((m) => {
    Object.keys(m).forEach((n) => {
      fn[n] = m[n];
      if (Object.prototype.hasOwnProperty.call(window, n)) { konflikt.push(n); return; }
      window[n] = m[n];
      namen.push(n);
    });
  });
  window.DMA_BRUECKE = { namen, konflikt, fn };
  if (konflikt.length) console.error("bruecke: schon auf window, NICHT überschrieben: " + konflikt.join(", "));
  if (window.DMA_APP && typeof window.DMA_APP.nachholen === "function") window.DMA_APP.nachholen();
}
