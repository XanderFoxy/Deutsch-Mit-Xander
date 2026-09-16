/* =========================================================
   KLASSENZIMMER — Jitsi als Leiste, die offen bleibt
   ---------------------------------------------------------
   DER WUNSCH
   „Ein Livestream, wo wir zusammen reden können auf der Webseite
    … dass wir parallel auf der Webseite gucken können und
    trotzdem im Livestream bleiben. Der Livestream ist dann
    praktisch unser Klassenzimmer."

   DIE EINE HARTE BEDINGUNG, AN DER ALLES HÄNGT
   Beim Blättern in der App darf die Verbindung NICHT abreissen.
   Ein <iframe> verliert seinen Inhalt, sobald er
     * neu erzeugt,
     * aus dem DOM genommen (auch nur verschoben!),
     * oder mit display:none unsichtbar gemacht wird —
   das Letzte reisst die Verbindung nicht ab, aber Jitsi stellt
   das Bild ab. Darum:

     Der Rahmen wird EINMAL erzeugt, hängt direkt unter <body>
     (NICHT in einer Ansicht), und wird nie wieder angefasst.
     Beim Ansichtswechsel ändert sich ausschliesslich eine
     CSS-Klasse auf der umgebenden Leiste. appendChild() wird
     nach dem Aufbau nie mehr aufgerufen — jedes Verschieben
     eines iframes im DOM lädt ihn neu.

   WAS ES KOSTET — ehrlich
   meet.jit.si kostet nichts, braucht kein Konto, und die
   Bedienung läuft über die freie „Jitsi Meet External API".
   Dafür ist der Raum öffentlich erreichbar, wer den Namen kennt,
   kommt hinein — darum wird ein langer Zufallsname erzeugt und
   nicht „deutschkurs". Ein eigener Server (JVB auf einem kleinen
   Mietrechner) kostet ab etwa 10 € im Monat und wäre dann unter
   eigener Adresse, mit eigenem Passwortschutz. Das ist ein
   späterer Schritt, kein anderer Aufbau: nur EINE Zeile
   (HAUSHERR) muss sich dafür ändern.
   ========================================================= */
window.Klassenzimmer = (function () {
  "use strict";

  var HAUSHERR = "meet.jit.si";       // eigener Server später: hier eintragen
  var SKRIPT = "https://" + HAUSHERR + "/external_api.js";

  var rahmenHalter = null;   // die Leiste (div), bleibt für immer
  var api = null;            // JitsiMeetExternalAPI
  var raum = "";
  var zustand = "aus";       // aus | laedt | drin | fehler
  var fehlerText = "";
  var tonAn = true, bildAn = true;
  var gross = false;
  var teilnehmer = [];
  var horcher = [];

  function melden() {
    horcher.forEach(function (f) { try { f(lage()); } catch (e) {} });
  }
  function beiAenderung(f) { horcher.push(f); return function () { horcher = horcher.filter(function (g) { return g !== f; }); }; }

  function lage() {
    return {
      zustand: zustand, raum: raum, fehler: fehlerText,
      tonAn: tonAn, bildAn: bildAn, gross: gross,
      teilnehmer: teilnehmer.slice(),
      hausherr: HAUSHERR,
      link: raum ? "https://" + HAUSHERR + "/" + raum : ""
    };
  }

  /* --- Raumname ---
     Lang und zufällig, weil ein Raum auf meet.jit.si für jeden
     offen ist, der den Namen kennt. Der Betreiber teilt den Link,
     und nur wer ihn hat, kommt herein. Der Name bleibt im Gerät
     gespeichert, damit „Raum öffnen" zweimal denselben Raum
     trifft und nicht zwei Klassenzimmer aufmacht. */
  var RAUM_SCHLUESSEL = "dma_klassenzimmer_raum";
  function raumMerken(name) {
    try { localStorage.setItem(RAUM_SCHLUESSEL, name); } catch (e) {}
  }
  function gemerkterRaum() {
    try { return localStorage.getItem(RAUM_SCHLUESSEL) || ""; } catch (e) { return ""; }
  }
  function neuerRaumName() {
    var zeichen = "abcdefghijkmnopqrstuvwxyz23456789";
    var s = "";
    var zufall = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(zufall);
    else for (var z = 0; z < 16; z++) zufall[z] = Math.floor(Math.random() * 256);
    for (var i = 0; i < 16; i++) s += zeichen[zufall[i] % zeichen.length];
    return "dma-" + s;
  }

  /* --- Das Skript von Jitsi holen ---
     Nur EINMAL, und mit ehrlichem Fehler: hinter einem Firmennetz
     oder einem strengen Inhaltsfilter ist meet.jit.si gesperrt.
     Dann steht das auch so da, statt dass ein leerer Kasten
     hängt. */
  var skriptLaeuft = null;
  function skriptLaden() {
    if (window.JitsiMeetExternalAPI) return Promise.resolve(true);
    if (skriptLaeuft) return skriptLaeuft;
    skriptLaeuft = new Promise(function (loesen, ablehnen) {
      var s = document.createElement("script");
      s.src = SKRIPT;
      s.async = true;
      var uhr = setTimeout(function () { ablehnen(new Error("zeit-abgelaufen")); }, 15000);
      s.onload = function () { clearTimeout(uhr); loesen(true); };
      s.onerror = function () { clearTimeout(uhr); ablehnen(new Error("nicht-erreichbar")); };
      document.head.appendChild(s);
    });
    return skriptLaeuft;
  }

  /* --- Die Leiste bauen. EINMAL. ---
     Wichtig: direkt an <body>, nicht in eine Ansicht. Ansichten
     werden beim Blättern geleert (innerHTML = …) — der Rahmen
     wäre sofort weg. */
  function leisteBauen() {
    if (rahmenHalter) return rahmenHalter;
    var leiste = document.createElement("div");
    leiste.id = "klassenzimmerLeiste";
    leiste.className = "kz-leiste kz-aus";
    leiste.setAttribute("aria-label", "Klassenzimmer");
    leiste.innerHTML =
      '<div class="kz-kopf">' +
        '<button type="button" class="kz-knopf kz-groesse" data-kz="groesse" title="Gross / klein" aria-label="Gross oder klein"><span aria-hidden="true">⤢</span></button>' +
        '<span class="kz-titel">🎓 Klassenzimmer</span>' +
        '<span class="kz-zahl" data-kz-zahl>–</span>' +
        '<button type="button" class="kz-knopf" data-kz="ton" title="Mikrofon an/aus" aria-label="Mikrofon an oder aus"><span aria-hidden="true">🎤</span></button>' +
        '<button type="button" class="kz-knopf" data-kz="bild" title="Kamera an/aus" aria-label="Kamera an oder aus"><span aria-hidden="true">📷</span></button>' +
        '<button type="button" class="kz-knopf kz-weg" data-kz="verlassen" title="Raum verlassen" aria-label="Raum verlassen"><span aria-hidden="true">✕</span></button>' +
      '</div>' +
      '<div class="kz-buehne" id="kzBuehne"></div>' +
      '<div class="kz-fuss" data-kz-fuss></div>';
    document.body.appendChild(leiste);
    rahmenHalter = leiste;

    leiste.addEventListener("click", function (e) {
      var k = e.target.closest ? e.target.closest("[data-kz]") : null;
      if (!k) return;
      var was = k.dataset.kz;
      if (was === "ton") tonUmschalten();
      else if (was === "bild") bildUmschalten();
      else if (was === "verlassen") verlassen();
      else if (was === "groesse") groesseUmschalten();
    });
    return leiste;
  }

  function buehne() {
    leisteBauen();
    return document.getElementById("kzBuehne");
  }

  function anzeigeAuffrischen() {
    if (!rahmenHalter) return;
    rahmenHalter.classList.toggle("kz-aus", zustand === "aus");
    rahmenHalter.classList.toggle("kz-laedt", zustand === "laedt");
    rahmenHalter.classList.toggle("kz-drin", zustand === "drin");
    rahmenHalter.classList.toggle("kz-fehler", zustand === "fehler");
    rahmenHalter.classList.toggle("kz-gross", gross);
    rahmenHalter.classList.toggle("kz-ton-aus", !tonAn);
    rahmenHalter.classList.toggle("kz-bild-aus", !bildAn);
    var zahl = rahmenHalter.querySelector("[data-kz-zahl]");
    if (zahl) zahl.textContent = zustand === "drin" ? String(teilnehmer.length || 1) : "–";
    var fuss = rahmenHalter.querySelector("[data-kz-fuss]");
    if (fuss) {
      if (zustand === "fehler") fuss.textContent = fehlerText;
      else if (zustand === "laedt") fuss.textContent = "Verbindet mit " + HAUSHERR + " …";
      else if (zustand === "drin") {
        fuss.textContent = teilnehmer.length > 1
          ? teilnehmer.map(function (t) { return t.name || "Gast"; }).join(", ")
          : "Du bist allein im Raum — teile den Link.";
      } else fuss.textContent = "";
    }
  }

  /* --- Beitreten ---
     Erzeugt den Rahmen EINMAL. Ein zweiter Aufruf mit demselben
     Raum tut nichts: sonst wäre genau der Fehler eingebaut, den
     die ganze Datei verhindern soll. */
  function beitreten(raumName, optionen) {
    var o = optionen || {};
    var name = String(raumName || "").trim() || gemerkterRaum() || neuerRaumName();
    if (api && raum === name && zustand !== "fehler") {
      // Schon drin. Nur einblenden, NICHT neu bauen.
      anzeigen();
      return Promise.resolve(lage());
    }
    if (api) abbauen();
    raum = name;
    raumMerken(raum);
    zustand = "laedt";
    fehlerText = "";
    leisteBauen();
    anzeigen();
    anzeigeAuffrischen();
    melden();

    return skriptLaden().then(function () {
      var ziel = buehne();
      api = new window.JitsiMeetExternalAPI(HAUSHERR, {
        roomName: raum,
        parentNode: ziel,
        width: "100%",
        height: "100%",
        userInfo: { displayName: o.name || "Gast" },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,       // sonst hängt man vor der Tür
          disableDeepLinking: true,        // auf dem Telefon nicht in die App springen
          toolbarButtons: [],              // wir bedienen über unsere eigene Leiste
          disableInviteFunctions: true,
          hideConferenceSubject: true,
          hideConferenceTimer: false,
          notifications: []
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
          DISABLE_VIDEO_BACKGROUND: true,
          TILE_VIEW_MAX_COLUMNS: 2
        }
      });

      api.addEventListener("videoConferenceJoined", function () {
        zustand = "drin";
        teilnehmerAuffrischen();
        anzeigeAuffrischen();
        melden();
      });
      api.addEventListener("videoConferenceLeft", function () {
        zustand = "aus";
        abbauen();
        anzeigeAuffrischen();
        melden();
      });
      api.addEventListener("participantJoined", teilnehmerAuffrischen);
      api.addEventListener("participantLeft", teilnehmerAuffrischen);
      api.addEventListener("audioMuteStatusChanged", function (e) {
        tonAn = !(e && e.muted); anzeigeAuffrischen(); melden();
      });
      api.addEventListener("videoMuteStatusChanged", function (e) {
        bildAn = !(e && e.muted); anzeigeAuffrischen(); melden();
      });
      /* Wenn Jitsi selbst scheitert (Raum gesperrt, Verbindung
         weg), soll nicht ein schwarzer Kasten stehen bleiben. */
      api.addEventListener("errorOccurred", function (e) {
        var art = e && e.error && e.error.name ? e.error.name : "";
        if (/conference\.(destroyed|failed)|connection\.(failed|droppedError)/.test(art)) {
          zustand = "fehler";
          fehlerText = "Die Verbindung zum Klassenzimmer ist abgerissen. Tippe auf „Raum betreten“, um es noch einmal zu versuchen.";
          anzeigeAuffrischen();
          melden();
        }
      });
      return lage();
    }).catch(function (e) {
      zustand = "fehler";
      fehlerText = e && e.message === "nicht-erreichbar"
        ? "„" + HAUSHERR + "“ ist von diesem Netz aus nicht erreichbar. In manchen Firmen- und Schulnetzen ist der Dienst gesperrt; über Mobilfunk klappt es meistens."
        : "Das Klassenzimmer lässt sich gerade nicht öffnen. Netz prüfen und noch einmal versuchen.";
      anzeigeAuffrischen();
      melden();
      return lage();
    });
  }

  function teilnehmerAuffrischen() {
    if (!api) { teilnehmer = []; return; }
    try {
      var liste = api.getParticipantsInfo ? api.getParticipantsInfo() : [];
      teilnehmer = (liste || []).map(function (t) {
        return { id: t.participantId || t.id || "", name: t.displayName || t.formattedDisplayName || "Gast" };
      });
    } catch (e) { teilnehmer = []; }
    anzeigeAuffrischen();
    melden();
  }

  function abbauen() {
    if (api) { try { api.dispose(); } catch (e) {} api = null; }
    var b = document.getElementById("kzBuehne");
    if (b) b.innerHTML = "";
    teilnehmer = [];
  }

  function verlassen() {
    if (api) { try { api.executeCommand("hangup"); } catch (e) {} }
    abbauen();
    zustand = "aus";
    gross = false;
    verstecken();
    anzeigeAuffrischen();
    melden();
  }

  function tonUmschalten() {
    if (!api) return;
    try { api.executeCommand("toggleAudio"); } catch (e) {}
  }
  function bildUmschalten() {
    if (!api) return;
    try { api.executeCommand("toggleVideo"); } catch (e) {}
  }
  function groesseUmschalten() {
    gross = !gross;
    anzeigeAuffrischen();
    melden();
  }

  /* --- Ein- und ausblenden ---
     NUR Klassen. Kein display:none auf dem Rahmen (Jitsi stellt
     dann das Bild ab), sondern die Leiste wird aus dem Bild
     geschoben und bleibt dabei gerendert. */
  function anzeigen() {
    leisteBauen();
    rahmenHalter.classList.remove("kz-versteckt");
    document.body.classList.add("hat-klassenzimmer");
  }
  function verstecken() {
    if (!rahmenHalter) return;
    rahmenHalter.classList.add("kz-versteckt");
    document.body.classList.remove("hat-klassenzimmer");
  }

  function istDrin() { return zustand === "drin" || zustand === "laedt"; }

  /* Aus einem geteilten Link den Raumnamen lesen:
     …/index.html#klasse=dma-xxxxx  oder  ?klasse=dma-xxxxx */
  function raumAusAdresse() {
    var t = "";
    try {
      var h = (location.hash || "").replace(/^#/, "");
      var s = new URLSearchParams(h);
      t = s.get("klasse") || "";
      if (!t) t = new URLSearchParams(location.search).get("klasse") || "";
    } catch (e) {}
    return /^[a-z0-9-]{4,64}$/i.test(t) ? t : "";
  }

  return {
    HAUSHERR: HAUSHERR,
    beitreten: beitreten,
    verlassen: verlassen,
    tonUmschalten: tonUmschalten,
    bildUmschalten: bildUmschalten,
    groesseUmschalten: groesseUmschalten,
    anzeigen: anzeigen,
    verstecken: verstecken,
    istDrin: istDrin,
    lage: lage,
    beiAenderung: beiAenderung,
    neuerRaumName: neuerRaumName,
    gemerkterRaum: gemerkterRaum,
    raumAusAdresse: raumAusAdresse,
    leisteBauen: leisteBauen
  };
})();
