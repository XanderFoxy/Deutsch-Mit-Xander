/* =========================================================
   DAS WALKIE-TALKIE — RUECKFRAGEN AN DEN BETREIBER
   ---------------------------------------------------------
   XANDER (23.09.2026): „dass ich praktisch immer wieder ein
   Pop-up bekomme, in dem Moment, wenn du etwas brauchst … nach
   Beendigung einiger Aufgaben, dass du wissen willst, ob das
   jetzt für mich passt … ich sag dann entweder ja oder nein, und
   wenn du dann noch mal fragst, was nicht stimmt, dass du
   Auswahl-Antworten hast … und ich einfach das anklicke …
   vielleicht auch multiple Sachen."

   SO LAEUFT ES
   1. Claude legt eine Frage in der Tabelle betreiber_rueckfragen
      an (thema, frage, art, optionen).
   2. Diese Datei schaut alle 20 Sekunden nach offenen Fragen —
      und nur, wenn hier der BETREIBER sitzt. Alle anderen sehen
      nichts, und die Datenbank gibt ihnen auch nichts heraus
      (Zeilenschutz: nur profiles.is_owner darf lesen).
   3. Die Karte erscheint unten links (rechts sitzt die Werkstatt).
        ja_nein   „Passt" oder „Nein" — bei „Nein" klappen die
                  Moeglichkeiten auf, was nicht stimmt, zum
                  Mehrfach-Ankreuzen, dazu ein freies Feld.
        auswahl   genau eine Moeglichkeit
        mehrfach  beliebig viele
   4. „Senden" schreibt die Antwort zurueck; Claude liest sie dort.

   Die Karte stoert nicht: sie liegt ueber nichts Wichtigem, man
   kann sie einklappen, und waehrend des Livestreams laesst sie
   sich mit „Spaeter" wegschieben (sie kommt beim naechsten
   Nachsehen wieder).
   ========================================================= */
window.Rueckfrage = (function () {
  "use strict";

  var TAKT = 20000;
  var karte = null;
  var offen = [];
  var spaeter = {};
  var laeuft = false;

  function istBetreiber() {
    try {
      return typeof Backend !== "undefined" && Boolean(Backend.isOwner && Backend.isOwner());
    } catch (e) { return false; }
  }
  function zugang() {
    try { return Backend.zugang ? Backend.zugang() : null; } catch (e) { return null; }
  }

  function holen() {
    if (!istBetreiber()) { weg(); return; }
    var sb = zugang();
    if (!sb || laeuft) return;
    laeuft = true;
    sb.from("betreiber_rueckfragen")
      .select("id, thema, frage, art, optionen")
      .is("beantwortet", null)
      .order("id", { ascending: true })
      .limit(10)
      .then(function (r) {
        laeuft = false;
        if (r.error || !r.data) return;
        offen = r.data.filter(function (f) { return !spaeter[f.id]; });
        zeigen();
      }, function () { laeuft = false; });
  }

  function weg() {
    if (karte) { karte.remove(); karte = null; }
  }

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text != null) e.textContent = text;
    return e;
  }

  function zeigen() {
    if (!offen.length) { weg(); return; }
    var f = offen[0];
    /* Dieselbe Frage steht schon da? Dann nicht neu bauen — sonst
       waeren angekreuzte Haekchen nach 20 Sekunden wieder weg. */
    if (karte && Number(karte.dataset.id) === f.id) {
      var zahl = karte.querySelector(".rf-zahl");
      if (zahl) zahl.textContent = offen.length > 1 ? "1 / " + offen.length : "";
      return;
    }
    weg();
    karte = el("div", "rf-karte");
    karte.dataset.id = f.id;
    karte.setAttribute("role", "dialog");
    karte.setAttribute("aria-label", "Rückfrage von Claude");

    var kopf = el("div", "rf-kopf");
    kopf.appendChild(el("span", "rf-marke", "📻 Rückfrage"));
    if (f.thema) kopf.appendChild(el("span", "rf-thema", f.thema));
    kopf.appendChild(el("span", "rf-zahl", offen.length > 1 ? "1 / " + offen.length : ""));
    karte.appendChild(kopf);
    karte.appendChild(el("p", "rf-frage", f.frage));

    var optionen = Array.isArray(f.optionen) ? f.optionen : [];
    var liste = el("div", "rf-liste");
    var mehrfach = f.art !== "auswahl";
    optionen.forEach(function (o, i) {
      var z = el("label", "rf-option");
      var h = document.createElement("input");
      h.type = mehrfach ? "checkbox" : "radio";
      h.name = "rf-" + f.id;
      h.value = String(o);
      z.appendChild(h);
      z.appendChild(el("span", null, String(o)));
      liste.appendChild(z);
    });
    var notiz = document.createElement("textarea");
    notiz.className = "rf-notiz";
    notiz.rows = 2;
    notiz.placeholder = "Was genau? (freiwillig)";

    var knoepfe = el("div", "rf-knoepfe");
    var senden = function (ja) {
      var gewaehlt = [].slice.call(liste.querySelectorAll("input:checked"))
        .map(function (x) { return x.value; });
      var antwort = { ja: ja, gewaehlt: gewaehlt };
      var sb = zugang();
      if (!sb) return;
      knoepfe.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
      sb.from("betreiber_rueckfragen")
        .update({ antwort: antwort, notiz: notiz.value.trim() || null,
                  beantwortet: new Date().toISOString() })
        .eq("id", f.id)
        .then(function (r) {
          if (r.error) {
            knoepfe.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
            return;
          }
          offen.shift();
          weg();
          zeigen();
        });
    };

    if (f.art === "ja_nein") {
      /* Bei „Passt" gibt es nichts mehr zu fragen. Erst bei „Nein"
         klappen die Moeglichkeiten auf — so bleibt die Karte klein,
         solange alles stimmt. */
      liste.hidden = true;
      notiz.hidden = true;
      var ja = el("button", "rf-ja", "✅ Passt");
      var nein = el("button", "rf-nein", "❌ Nein");
      var abschicken = el("button", "rf-senden", "Senden");
      abschicken.hidden = true;
      ja.type = nein.type = abschicken.type = "button";
      ja.addEventListener("click", function () { senden(true); });
      nein.addEventListener("click", function () {
        liste.hidden = !optionen.length;
        notiz.hidden = false;
        ja.hidden = true;
        nein.hidden = true;
        abschicken.hidden = false;
        notiz.placeholder = optionen.length
          ? "Noch etwas? (freiwillig)" : "Was stimmt nicht?";
      });
      abschicken.addEventListener("click", function () { senden(false); });
      knoepfe.appendChild(ja);
      knoepfe.appendChild(nein);
      knoepfe.appendChild(abschicken);
    } else {
      var ab = el("button", "rf-senden", "Senden");
      ab.type = "button";
      ab.addEventListener("click", function () { senden(null); });
      knoepfe.appendChild(ab);
    }
    var nachher = el("button", "rf-spaeter", "Später");
    nachher.type = "button";
    nachher.addEventListener("click", function () {
      /* Nur fuer diese Sitzung beiseitegelegt — beim naechsten
         Laden der Seite ist die Frage wieder da. */
      spaeter[f.id] = 1;
      offen.shift();
      weg();
      zeigen();
    });
    knoepfe.appendChild(nachher);

    karte.appendChild(liste);
    karte.appendChild(notiz);
    karte.appendChild(knoepfe);
    /* Ein Klick in die Karte darf nicht durchgreifen — auch nicht
       auf einen Platz dahinter. Genau das war seine Beschwerde bei
       den anderen Panels. */
    ["pointerdown", "click", "touchstart"].forEach(function (t) {
      karte.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
    });
    document.body.appendChild(karte);
  }

  function start() {
    holen();
    setInterval(holen, TAKT);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) holen();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 1500); });
  } else {
    setTimeout(start, 1500);
  }

  return { holen: holen, stand: function () { return offen.slice(); } };
})();
