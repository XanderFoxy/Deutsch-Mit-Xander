/* =========================================================
   DIE WERKSTATT-BLASE
   ---------------------------------------------------------
   Ein Zeichen unten rechts, das genau EINES sagt: an der Seite
   wird gerade gebaut, und zwar daran.

   DIE DREI REGELN, DIE HIER DURCHGESETZT WERDEN

   1. NUR OFFENES. Es gibt keine Liste der fertigen Dinge mehr.
      „Alle Sachen, die erledigt sind, sind irrelevant."

   2. TAG UND UHRZEIT. Zu jeder Baustelle steht, seit wann sie
      offen ist — auf die Minute. Ein Datum allein sagt nicht,
      ob hier seit einer Stunde oder seit einer Woche gearbeitet
      wird, und genau das war die Frage.
      Ist es HEUTE, steht nur die Uhrzeit da („seit 00:20"). Wer
      heute liest, braucht das Datum nicht.

   3. NICHTS OFFEN, KEIN ZEICHEN. Ist die Liste leer, wird der
      Knopf nicht erzeugt und die Blase ganz entfernt. Kein
      leerer Kasten, kein „zurzeit nichts".

   Kein Netz, keine Datenbank: alles steht in data-werkstatt.js
   und wird mit der Seite ausgeliefert.
   ========================================================= */
window.Werkstatt = (function () {
  "use strict";

  var offen = false;
  var blase = null;

  function daten() { return window.DMA_WERKSTATT || { inArbeit: [] }; }

  function istBetreiber() {
    try { return Boolean(window.Backend && Backend.isOwner && Backend.isOwner()); }
    catch (e) { return false; }
  }

  /* Welche Zeilen darf dieser Mensch sehen? */
  function baustellen() {
    var d = daten();
    if (d.nurBetreiber && !istBetreiber()) return [];
    return (d.inArbeit || []).filter(function (e) {
      return e && e.text && (!e.nurBetreiber || istBetreiber());
    });
  }

  /* „seit 00:20" wenn heute, sonst „seit 17.09. um 23:40".
     Ein Zeitpunkt ohne Tag wäre am nächsten Morgen irreführend;
     ein Tag ohne Uhrzeit sagt nicht, wie frisch es ist. */
  function seitText(wert) {
    var p = Date.parse(wert || "");
    if (!isFinite(p)) return "";
    var d = new Date(p), jetzt = new Date();
    var zwei = function (n) { return ("0" + n).slice(-2); };
    var uhr = zwei(d.getHours()) + ":" + zwei(d.getMinutes());
    var heute = d.getFullYear() === jetzt.getFullYear()
             && d.getMonth() === jetzt.getMonth()
             && d.getDate() === jetzt.getDate();
    if (heute) return "seit " + uhr + " Uhr";
    return "seit " + zwei(d.getDate()) + "." + zwei(d.getMonth() + 1) + ". um " + uhr + " Uhr";
  }

  /* Die jüngste Baustelle — sie steht klein am Knopf, damit man
     ohne Aufklappen sieht, wie frisch gearbeitet wird. */
  function juengste(liste) {
    var best = 0;
    liste.forEach(function (e) {
      var p = Date.parse(e.seit || "");
      if (isFinite(p) && p > best) best = p;
    });
    return best;
  }

  function text(t) {
    return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function html(liste) {
    return '' +
      '<button type="button" class="wk-knopf" id="wkKnopf" aria-expanded="' + (offen ? "true" : "false") +
        '" aria-controls="wkTafel">' +
        '<span class="wk-bau" aria-hidden="true">🛠️</span>' +
        '<span class="wk-knopf-text">Wird gerade gebaut' +
          '<small>' + liste.length + (liste.length === 1 ? " Baustelle" : " Baustellen") + '</small>' +
        '</span>' +
      '</button>' +
      '<div class="wk-tafel' + (offen ? " wk-offen" : "") + '" id="wkTafel" role="dialog" aria-label="Wird gerade gebaut">' +
        '<div class="wk-kopf">' +
          '<strong>🛠️ Wird gerade gebaut</strong>' +
          '<button type="button" class="wk-zu" id="wkZu" aria-label="Schließen">✕</button>' +
        '</div>' +
        '<ul class="wk-liste wk-liste-bau">' +
          liste.slice().sort(function (a, b) {
            return (Date.parse(b.seit || "") || 0) - (Date.parse(a.seit || "") || 0);
          }).map(function (e) {
            return '<li>' +
              (e.nurBetreiber ? '<span class="wk-nurdu">nur du</span> ' : "") +
              text(e.text) +
              (e.seit ? '<span class="wk-seit">' + seitText(e.seit) + '</span>' : "") +
            '</li>';
          }).join("") +
        '</ul>' +
        '<p class="wk-fuss">Sobald nichts mehr offen ist, verschwindet dieses Zeichen von selbst.</p>' +
      '</div>';
  }

  function zeichnen() {
    var liste = baustellen();

    /* Nichts offen? Dann gibt es das Zeichen nicht — nicht
       versteckt, sondern weg. */
    if (!liste.length) {
      if (blase) { blase.remove(); blase = null; }
      offen = false;
      return;
    }
    if (!blase) {
      blase = document.createElement("div");
      blase.className = "wk-blase";
      document.body.appendChild(blase);
    }
    blase.innerHTML = html(liste);
    blase.dataset.juengste = String(juengste(liste));
    document.getElementById("wkKnopf").addEventListener("click", function () {
      offen = !offen;
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
    /* Meldet sich jemand als Betreiber an, können Zeilen
       dazukommen oder die ganze Blase erscheinen. */
    document.addEventListener("dma-anmeldung", zeichnen);
  }

  return { start: start, zeichnen: zeichnen, baustellen: baustellen };
})();
window.Werkstatt.start();
