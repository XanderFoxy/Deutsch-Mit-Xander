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

  /* GEMELDET: „Die Werkstatt wird mir nicht mehr angezeigt. Ich kann
     nicht nachvollziehen, was du wann hochlädst."

     HIER LAG ES, und es waren zwei Dinge:

     1. Gezeichnet wurde genau EINMAL, beim Laden der Seite. In dem
        Augenblick ist das Konto aber noch gar nicht geladen —
        Backend.isOwner() sagt dann „nein", und die Blase wird nicht
        erzeugt. Danach kam nichts mehr: der Horcher hing an einem
        Ereignis namens „dma-anmeldung", das nirgends in der Seite
        ausgelöst wird. Es hat also nie wieder nachgesehen.
     2. Es gab keinen Weg, sie von Hand hervorzuholen. Wenn die
        Erkennung schiefging, war sie schlicht weg.

     Beides ist jetzt behoben: es wird nachgeschaut, bis das Konto da
     ist (siehe start()), und ein Schalter holt sie im Zweifel hervor. */
  var SCHALTER = "dma_werkstatt_zeigen";
  function handSchalter() {
    /* ?werkstatt=1 in der Adresse schaltet sie dauerhaft ein,
       ?werkstatt=0 wieder aus. Danach steht es im Gerät. */
    try {
      var such = new URLSearchParams(window.location.search);
      if (such.has("werkstatt")) {
        var an = such.get("werkstatt") !== "0";
        if (an) localStorage.setItem(SCHALTER, "1");
        else localStorage.removeItem(SCHALTER);
        return an;
      }
      return localStorage.getItem(SCHALTER) === "1";
    } catch (e) { return false; }
  }
  /* HIER LAG DER EIGENTLICHE FEHLER, und er war die ganze Zeit da.

     GEMELDET: „Ich sehe den Werkzeugkasten nicht mehr. Du bist doch
     gerade am Updaten, da muss doch wenigstens Schritt für Schritt für
     mich als Betreiber die Übersicht sein."

     Gefragt wurde nach window.Backend. In backend.js steht aber

         const Backend = (function () { … })();

     und ein const auf oberster Ebene eines gewöhnlichen Skripts ist
     KEINE Eigenschaft von window — es ist eine Skriptvariable. Der
     blosse Name Backend ist von anderen Skripten aus erreichbar,
     window.Backend dagegen ist IMMER undefined. Die Prüfung konnte
     also gar nichts anderes als „nein" ergeben, und die Blase blieb
     unsichtbar, ganz gleich wer angemeldet war.

     Deshalb wird jetzt der blosse Name benutzt. Das try ist nötig:
     werkstatt.js kann laufen, bevor backend.js sein const überhaupt
     angelegt hat — dann wirft schon das typeof, und das fängt es ab. */
  function istBetreiber() {
    if (handSchalter()) return true;
    try {
      /* eslint-disable-next-line no-undef */
      return typeof Backend !== "undefined" && Boolean(Backend.isOwner && Backend.isOwner());
    } catch (e) { return false; }
  }

  /* GEWÜNSCHT: „Solange wie temporär gerade Updates gemacht werden.
     Wenn eine Weile keine Updates mehr gemacht werden, verschwindet es
     auch wieder."

     Das soll nicht daran hängen, dass ich daran denke, die Liste zu
     leeren — woran ich denken muss, vergesse ich. Es hängt an der
     Uhrzeit: ist der jüngste Eintrag älter als das hier, ist die
     Baustelle kalt und das Zeichen verschwindet von selbst.
     Zwanzig Stunden, damit eine Nacht dazwischenpasst. */
  var FRISCH_STUNDEN = 20;
  function nochFrisch(liste) {
    if (!liste.length) return false;
    var j = juengste(liste);
    return j > 0 && (Date.now() - j) < FRISCH_STUNDEN * 3600 * 1000;
  }

  /* Welche Zeilen darf dieser Mensch sehen? */
  function baustellen() {
    var d = daten();
    if (d.nurBetreiber && !istBetreiber()) return [];
    return (d.inArbeit || []).filter(function (e) {
      return e && e.text && (!e.nurBetreiber || istBetreiber());
    });
  }
  /* GEWÜNSCHT: „Du sollst mir in der Werkstatt zeigen, an was du
     gerade arbeitest, und dass du einzelne Sachen schon hochlädst —
     dass ich sehe, welche Sachen gerade fertig sind, Schritt für
     Schritt, damit ich es direkt überprüfen kann."

     Deshalb gibt es jetzt ZWEI Listen. Oben, was gerade läuft; darunter
     mit einem Haken, was seit dem letzten Hochladen fertig geworden
     ist — mit Uhrzeit, damit man weiss, was man sich ansehen kann. */
  function fertiges() {
    var d = daten();
    if (d.nurBetreiber && !istBetreiber()) return [];
    return (d.fertig || []).filter(function (e) {
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

  function zeilen(liste, klasse) {
    return liste.slice().sort(function (a, b) {
      return (Date.parse(b.seit || "") || 0) - (Date.parse(a.seit || "") || 0);
    }).map(function (e) {
      return '<li class="' + klasse + '">' +
        (e.nurBetreiber ? '<span class="wk-nurdu">nur du</span> ' : "") +
        text(e.text) +
        (e.seit ? '<span class="wk-seit">' + seitText(e.seit) + '</span>' : "") +
      '</li>';
    }).join("");
  }

  function html(liste, fertig) {
    var stand = daten().stand || "";
    return '' +
      '<button type="button" class="wk-knopf" id="wkKnopf" aria-expanded="' + (offen ? "true" : "false") +
        '" aria-controls="wkTafel">' +
        '<span class="wk-bau" aria-hidden="true">🛠️</span>' +
        '<span class="wk-knopf-text">Wird gerade gebaut' +
          '<small>' + liste.length + " offen"
            + (fertig.length ? " · " + fertig.length + " fertig" : "") + '</small>' +
        '</span>' +
      '</button>' +
      '<div class="wk-tafel' + (offen ? " wk-offen" : "") + '" id="wkTafel" role="dialog" aria-label="Wird gerade gebaut">' +
        '<div class="wk-kopf">' +
          '<strong>🛠️ Wird gerade gebaut</strong>' +
          '<button type="button" class="wk-zu" id="wkZu" aria-label="Schließen">✕</button>' +
        '</div>' +
        (stand ? '<p class="wk-stand">' + text(stand) + '</p>' : "") +
        (liste.length
          ? '<p class="wk-abschnitt">Gerade in Arbeit</p>'
            + '<ul class="wk-liste wk-liste-bau">' + zeilen(liste, "wk-offen-zeile") + '</ul>'
          : '<p class="wk-abschnitt">Gerade nichts offen</p>') +
        (fertig.length
          ? '<p class="wk-abschnitt wk-abschnitt-fertig">Fertig und schon oben — kannst du ansehen</p>'
            + '<ul class="wk-liste wk-liste-fertig">' + zeilen(fertig, "wk-fertig-zeile") + '</ul>'
          : "") +
        '<p class="wk-fuss">Sobald nichts mehr offen ist, verschwindet dieses Zeichen von selbst.</p>' +
      '</div>';
  }

  function zeichnen() {
    var liste = baustellen();
    var fertig = fertiges();

    /* Nichts offen UND nichts frisch fertig? Dann gibt es das Zeichen
       nicht — nicht versteckt, sondern weg. */
    /* Nichts offen UND nichts frisch fertig — oder alles zusammen schon
       kalt? Dann gibt es das Zeichen nicht: nicht versteckt, sondern
       weg. Genau so gewünscht. */
    if ((!liste.length && !fertig.length) || !nochFrisch(liste.concat(fertig))) {
      if (blase) { blase.remove(); blase = null; }
      offen = false;
      return;
    }
    if (!blase) {
      blase = document.createElement("div");
      blase.className = "wk-blase";
      document.body.appendChild(blase);
    }
    blase.innerHTML = html(liste, fertig);
    blase.dataset.juengste = String(juengste(liste.concat(fertig)));
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
    /* NACHSCHAUEN, BIS DAS KONTO DA IST.
       Das Konto wird über das Netz geladen und ist beim ersten
       Zeichnen fast nie schon bekannt. Deshalb wird in den ersten
       dreissig Sekunden mehrfach nachgesehen — und aufgehört, sobald
       die Blase steht. Ein Zeitgeber, der ewig weiterläuft, wäre
       Verschwendung; einer, der nur einmal schaut, war der Fehler. */
    var versuche = 0;
    var uhr = setInterval(function () {
      versuche++;
      if (blase || versuche > 90) { clearInterval(uhr); return; }
      zeichnen();
    }, 2000);
    /* Und bei jedem Klick noch einmal — wer sich gerade erst anmeldet,
       klickt dabei ohnehin. Das kostet nichts und fängt den Fall ab,
       dass die Anmeldung länger dauert als drei Minuten. */
    document.addEventListener("click", function () {
      if (!blase) zeichnen();
    }, true);
    /* Und auf alles horchen, was eine Anmeldung bedeuten kann. */
    ["dma-anmeldung", "dma-profil", "dma-login"].forEach(function (e) {
      document.addEventListener(e, zeichnen);
    });
    window.addEventListener("focus", zeichnen);
  }

  return { start: start, zeichnen: zeichnen, baustellen: baustellen, fertiges: fertiges };
})();
window.Werkstatt.start();
