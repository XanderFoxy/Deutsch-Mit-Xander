/* =========================================================
   DIE WERKSTATT-BLASE
   ---------------------------------------------------------
   Eine kleine Blase unten rechts: „Neu auf der Seite" — mit
   einem Punkt, solange etwas Ungelesenes da ist. Angetippt
   klappt sie auf und zeigt, was neu ist und was gerade gebaut
   wird.

   DREI ENTSCHEIDUNGEN, UND WARUM SIE SO SIND

   1. SIE GEHT VON SELBST WIEDER.
      Jede fertige Meldung trägt ein Datum und verschwindet nach
      DMA_WERKSTATT.tage Tagen. Ein Hinweis, der bleibt, wird zur
      Tapete — man sieht ihn nach drei Tagen nicht mehr, und dann
      sieht man auch den nächsten nicht mehr.

   2. SIE MERKT SICH, WAS GELESEN WURDE.
      Der rote Punkt verschwindet, sobald die Blase einmal offen
      war, und kommt erst bei einer NEUEN Meldung zurück. Gemerkt
      wird das Datum der neuesten gelesenen Zeile — nicht die
      Zeile selbst, sonst zeigte eine geänderte Formulierung
      dieselbe Meldung noch einmal als neu.

   3. SIE STEHT NICHT IM WEG.
      Zugeklappt ist sie ein Knopf. Sie liegt unten rechts, also
      dort, wo der Daumen ist und wo nichts Wichtiges steht. Ist
      das Klassenzimmer offen, rückt sie darüber.

   Kein Netz nötig, keine Datenbank: die Meldungen stehen in
   data-werkstatt.js und werden mit der Seite ausgeliefert.
   ========================================================= */
window.Werkstatt = (function () {
  "use strict";

  var SCHLUESSEL = "dma_werkstatt_gelesen";
  var offen = false;
  var blase = null;

  function daten() { return window.DMA_WERKSTATT || { tage: 14, inArbeit: [], fertig: [] }; }

  function tage() {
    var t = Number(daten().tage);
    return isFinite(t) && t > 0 ? t : 14;
  }

  /* Nur was jung genug ist. Ein Datum, das nicht gelesen werden
     kann, gilt als heute — lieber einmal zu viel zeigen als eine
     Meldung stillschweigend verschlucken. */
  function frisch(eintrag) {
    var d = Date.parse(eintrag.datum || "");
    if (!isFinite(d)) return true;
    return (Date.now() - d) / 86400000 <= tage();
  }

  function istBetreiber() {
    try { return Boolean(window.Backend && Backend.isOwner && Backend.isOwner()); }
    catch (e) { return false; }
  }

  function sichtbar(liste) {
    return (liste || []).filter(function (e) {
      return !e.nurBetreiber || istBetreiber();
    });
  }

  function neuigkeiten() { return sichtbar(daten().fertig).filter(frisch); }
  function baustellen() { return sichtbar(daten().inArbeit); }

  function neuestesDatum() {
    var n = neuigkeiten();
    var best = "";
    n.forEach(function (e) { if ((e.datum || "") > best) best = e.datum || ""; });
    return best;
  }
  function gelesenBis() {
    try { return localStorage.getItem(SCHLUESSEL) || ""; } catch (e) { return ""; }
  }
  function alsGelesen() {
    try { localStorage.setItem(SCHLUESSEL, neuestesDatum()); } catch (e) {}
  }
  function hatUngelesenes() {
    var d = neuestesDatum();
    return Boolean(d) && d > gelesenBis();
  }

  function html() {
    var neu = neuigkeiten();
    var bau = baustellen();
    if (!neu.length && !bau.length) return "";
    var punkt = hatUngelesenes() ? '<span class="wk-punkt" aria-hidden="true"></span>' : "";
    return '' +
      '<button type="button" class="wk-knopf" id="wkKnopf" aria-expanded="' + (offen ? "true" : "false") +
        '" aria-controls="wkTafel">' +
        '<span aria-hidden="true">🛠️</span><span class="wk-knopf-text">Neu auf der Seite</span>' + punkt +
      '</button>' +
      '<div class="wk-tafel' + (offen ? " wk-offen" : "") + '" id="wkTafel" role="dialog" aria-label="Neu auf der Seite">' +
        '<div class="wk-kopf">' +
          '<strong>🛠️ Werkstatt</strong>' +
          '<button type="button" class="wk-zu" id="wkZu" aria-label="Schließen">✕</button>' +
        '</div>' +
        (bau.length
          ? '<p class="wk-abschnitt">Gerade in Arbeit</p><ul class="wk-liste wk-liste-bau">' +
            bau.map(function (e) {
              return '<li>' + (e.nurBetreiber ? '<span class="wk-nurdu">nur du</span> ' : "") + text(e.text) + '</li>';
            }).join("") + '</ul>'
          : "") +
        (neu.length
          ? '<p class="wk-abschnitt">Neu' + (neu.length ? " — die letzten " + tage() + " Tage" : "") + '</p><ul class="wk-liste">' +
            neu.slice().sort(function (a, b) { return (b.datum || "").localeCompare(a.datum || ""); })
               .map(function (e) {
                 return '<li><span class="wk-datum">' + datumKurz(e.datum) + '</span> ' + text(e.text) + '</li>';
               }).join("") + '</ul>'
          : "") +
        '<p class="wk-fuss">Diese Hinweise verschwinden von selbst wieder.</p>' +
      '</div>';
  }

  /* Fremder Text? Nein — die Datei liegt im Repo. Aber die Regel
     gilt trotzdem: was nicht als Auszeichnung gemeint ist, wird
     auch keine. */
  function text(t) {
    return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function datumKurz(d) {
    var p = Date.parse(d || "");
    if (!isFinite(p)) return "";
    var x = new Date(p);
    return ("0" + x.getDate()).slice(-2) + "." + ("0" + (x.getMonth() + 1)).slice(-2) + ".";
  }

  function zeichnen() {
    if (!blase) {
      blase = document.createElement("div");
      blase.className = "wk-blase";
      document.body.appendChild(blase);
    }
    var inhalt = html();
    blase.innerHTML = inhalt;
    blase.style.display = inhalt ? "" : "none";
    if (!inhalt) return;
    document.getElementById("wkKnopf").addEventListener("click", function () {
      offen = !offen;
      if (offen) alsGelesen();
      zeichnen();
    });
    document.getElementById("wkZu")?.addEventListener("click", function () {
      offen = false; zeichnen();
    });
  }

  function start() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", zeichnen);
    } else {
      zeichnen();
    }
    /* Meldet sich jemand als Betreiber an, können neue Zeilen
       dazukommen — dann neu zeichnen. */
    document.addEventListener("dma-anmeldung", zeichnen);
  }

  return { start: start, zeichnen: zeichnen, hatUngelesenes: hatUngelesenes };
})();
window.Werkstatt.start();
