/* =========================================================
   LIVE-CHAT — acht runde Plätze, Bild und Schreiben
   ---------------------------------------------------------
   DER WUNSCH
   „Acht Plätze, nummeriert 1–4 oben und 1–4 darunter, nach
    Möglichkeit mit Video, so dass man die Gesichter sieht. Man
    kann eins anklicken und sieht es größer. Die kleinen Plätze
    rund, wie man das von Audioräumen kennt. Dazu ein Chat, wo
    man einfach schreiben kann. Und eine aufgeräumte Oberfläche,
    wo die Leute wissen, wo sie klicken — nicht wie ein
    technischer Software-Bastelladen."

   WARUM DAS HIER NEU GEBAUT IST UND NICHT DAS KLASSENZIMMER
   BENUTZT
   Das Klassenzimmer (klassenzimmer.js) hängt an einem Jitsi-
   Rahmen. Ein solcher Rahmen ist eine fremde Seite in der Seite:
   was darin gezeichnet wird, gehört nicht uns. Man kann ihn
   nicht in acht Kreise schneiden, die Kacheln nicht numerieren
   und keinen eigenen Chat daneben setzen — der Browser lässt
   niemanden über diese Grenze greifen, und das ist auch richtig
   so.
   Darum liegen die Bilder hier in EIGENEN <video>-Feldern. Erst
   dann sind sie rund, anklickbar und numerierbar.

   Das Klassenzimmer bleibt, wie es war. Es ist der Weg, der
   sicher durch jedes Netz kommt; dieser hier ist der schöne.

   WIE DIE VERBINDUNG ZUSTANDE KOMMT — in einfachen Worten
   Jeder spricht mit jedem direkt (WebRTC). Damit sich zwei
   Geräte finden, müssen sie einmal Zettel austauschen: „so
   erreichst du mich". Diesen Zettelaustausch übernimmt Supabase
   Realtime — ein Kanal, auf dem alle im Raum mithören.

   WICHTIG UND BEABSICHTIGT: Ton und Bild laufen NICHT über
   Supabase. Nur die Zettel. Die Gespräche gehen direkt von
   Gerät zu Gerät.

   WARUM ACHT UND NICHT ACHTZIG
   Bei „jeder mit jedem" hat jeder so viele Verbindungen, wie
   andere da sind. Bei 8 Leuten sind das 7 pro Person — das
   trägt ein normales Telefon. Bei 20 wäre es nicht mehr lustig.
   Acht Plätze sind also keine Zierde, sondern die Grenze des
   Verfahrens. Wer als Neunter kommt, bekommt das gesagt und
   kann trotzdem zuschauen und mitschreiben.

   OHNE SUPABASE
   Ist supabase-config.js nicht ausgefüllt oder das Netz weg,
   sagt die Oberfläche das in einem Satz und bietet das
   Klassenzimmer an. Sie zeigt KEINE leeren Kreise, die nie
   jemanden zeigen werden.
   ========================================================= */
window.LiveChat = (function () {
  "use strict";

  /* =========================================================
     DER HAUPTRAUM
     ---------------------------------------------------------
     GEWÜNSCHT: „Der Hauptraum soll für jeden direkt zugänglich
     sein. Wenn ich gerade im Klassenzimmer bin, sollen die Leute
     wissen, wo sie mich finden — dazu muss man jetzt nicht
     unbedingt den Schlüssel haben."

     Also ein FESTER Name. Wer auf „Klassenzimmer betreten" tippt,
     landet dort, ohne Link und ohne Verabredung.

     WAS DAS KOSTET, ehrlich gesagt: ein fester Name ist bekannt.
     Wer die Seite kennt, kann hinein. Das ist bei einem
     Klassenzimmer gewollt — es ist ein öffentlicher Raum, kein
     Gespräch unter vier Augen. Für alles andere gibt es weiterhin
     eigene Räume mit langem Zufallsnamen, die nur über den Link
     erreichbar sind.
     ========================================================= */
  var HAUPTRAUM = "klassenzimmer";

  var PLAETZE = 8;                    // 4 oben, 4 unten
  var CHAT_LAENGE = 300;              // Zeichen je Nachricht
  var CHAT_VERLAUF = 60;              // so viele Nachrichten bleiben sichtbar

  /* Die Vermittler.
     ---------------------------------------------------------
     STUN sagt einem Gerät nur, unter welcher Adresse es von
     aussen zu sehen ist. Kein Ton, kein Bild geht dort durch.

     GEMELDET: „Mit einem zweiten Gerät bei mir zu Hause ging es.
     Meine Freundin aus Ägypten hat nur einen schwarzen Bildschirm
     gesehen und nichts gehört."

     DAS IST DER KLASSISCHE FALL, und es lag NICHT an ihr. Zwei
     Geräte finden mit STUN allein nur dann zueinander, wenn
     wenigstens einer der beiden Anschlüsse von aussen erreichbar
     ist. Im selben WLAN ist er das immer — darum hat der Test mit
     dem Zweitgerät funktioniert. Über Mobilfunk und in vielen
     Ländern (Ägypten gehört dazu) sitzen beide hinter einem
     sogenannten symmetrischen NAT; dann klappt die direkte
     Verbindung nie, und zwar ohne jede Fehlermeldung. Es sieht
     genau so aus, wie sie es beschrieben hat: der Chat läuft, das
     Bild bleibt schwarz.

     Dagegen hilft nur ein TURN-Server: ein Rechner, der Ton und
     Bild WEITERLEITET, wenn der direkte Weg nicht zustande kommt.
     Hier stehen die frei nutzbaren von Open Relay. Wer einen
     eigenen hat, trägt ihn in supabase-config.js als
     window.DMA_TURN = [{ urls: "...", username: "...",
     credential: "..." }] ein; dann wird dieser genommen. */
  var VERMITTLER = (window.DMA_TURN && window.DMA_TURN.length ? window.DMA_TURN : [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:openrelay.metered.ca:80" },
    { urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject", credential: "openrelayproject" }
  ]);

  var zustand = {
    lage: "aus",        // aus | verbindet | drin | fehler | voll
    fehler: "",
    raum: "",
    ichId: "",
    ichName: "",
    tonAn: true,
    bildAn: true,
    eigenerStrom: null,
    ichBild: "",        // Profilbild oder GIF, wenn die Kamera aus ist
    kameraFehler: "",   // im Klartext, warum kein Bild/Ton da ist
    leute: {},          // id -> { id, name, strom, gesehen, tonAn, bildAn, bild }
    nachrichten: [],    // { id, von, name, text, zeit, eigen, bild }
    gross: null         // id des gross gezeigten Platzes, oder null
  };

  var kanal = null;
  var brueckeJe = {};   // id -> RTCPeerConnection
  var horcher = [];

  function melden() { horcher.forEach(function (f) { try { f(lage()); } catch (e) {} }); }
  function beiAenderung(f) {
    horcher.push(f);
    return function () { horcher = horcher.filter(function (g) { return g !== f; }); };
  }

  /* --- Was die Oberfläche wissen muss --- */
  function lage() {
    return {
      lage: zustand.lage,
      fehler: zustand.fehler,
      raum: zustand.raum,
      ichId: zustand.ichId,
      ichName: zustand.ichName,
      tonAn: zustand.tonAn,
      bildAn: zustand.bildAn,
      ichBild: zustand.ichBild,
      kameraFehler: zustand.kameraFehler,
      hatKamera: Boolean(zustand.eigenerStrom && zustand.eigenerStrom.getVideoTracks().length),
      hatBild: Boolean(zustand.eigenerStrom),
      gross: zustand.gross,
      plaetze: plaetzeBauen(),
      nachrichten: zustand.nachrichten.slice(),
      frei: PLAETZE - belegt(),
      moeglich: moeglich(),
      link: zustand.raum ? adresseMitRaum(zustand.raum) : ""
    };
  }

  function belegt() { return 1 + Object.keys(zustand.leute).length; }

  /* Acht Plätze, fest numeriert. Platz 1 ist immer man selbst —
     man sucht sich sonst bei jedem Dazukommen neu. Die anderen
     rücken in der Reihenfolge nach, in der sie gekommen sind,
     und behalten ihren Platz, solange sie da sind. */
  function plaetzeBauen() {
    var raus = [];
    raus.push({
      nummer: 1,
      id: zustand.ichId,
      name: zustand.ichName || "Du",
      ich: true,
      strom: zustand.eigenerStrom,
      tonAn: zustand.tonAn,
      bildAn: zustand.bildAn,
      bild: zustand.ichBild,
      leer: zustand.lage !== "drin"
    });
    var ids = Object.keys(zustand.leute).sort(function (a, b) {
      return (zustand.leute[a].seit || 0) - (zustand.leute[b].seit || 0);
    });
    for (var i = 0; i < PLAETZE - 1; i++) {
      var p = ids[i] ? zustand.leute[ids[i]] : null;
      raus.push(p ? {
        nummer: i + 2, id: p.id, name: p.name || "Gast", ich: false,
        strom: p.strom || null, tonAn: p.tonAn !== false, bildAn: p.bildAn === true,
        bild: p.bild || "", leer: false
      } : { nummer: i + 2, id: "", name: "", ich: false, strom: null, bild: "", leer: true });
    }
    return raus;
  }

  function moeglich() {
    return Boolean(window.supabase && window.SUPABASE_CONFIG &&
                   window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey &&
                   window.RTCPeerConnection);
  }

  /* --- Raumname ---
     Derselbe Gedanke wie im Klassenzimmer: wer den Namen kennt,
     kommt herein. Also lang und zufällig, nicht „deutschkurs". */
  function neuerRaumName() {
    var zeichen = "abcdefghijkmnopqrstuvwxyz23456789";
    var zufall = new Uint8Array(14);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(zufall);
    else for (var z = 0; z < 14; z++) zufall[z] = Math.floor(Math.random() * 256);
    var s = "";
    for (var i = 0; i < 14; i++) s += zeichen[zufall[i] % zeichen.length];
    return "raum-" + s;
  }
  function raumMerken(n) { try { localStorage.setItem("dma_livechat_raum", n); } catch (e) {} }

  /* --- Nach dem Neuladen zurück in den Raum ---
     GEWÜNSCHT: „Manchmal muss ich die Webseite aktualisieren, um
     irgendwas zurückzusetzen — bleibt man dann auch im
     Klassenzimmer?"

     Technisch: nein. Eine Direktverbindung überlebt das Neuladen
     nicht, sie muss neu aufgebaut werden — daran führt kein Weg
     vorbei, das ist so gebaut und bei jedem Dienst so.

     Was geht: es SOFORT und OHNE Nachfrage wieder aufzubauen.
     Beim Verlassen der Seite wird vermerkt, dass man drin war.
     Kommt die Seite innerhalb von zwei Minuten zurück, geht die
     App von selbst wieder hinein — die Kameraerlaubnis hat der
     Browser noch, es fragt also nichts. Nach zwei Minuten war es
     kein Neuladen mehr, sondern ein Weggehen; dann bleibt der
     Raum zu. */
  var RUECK_SCHLUESSEL = "dma_livechat_zurueck";
  var RUECK_FRIST_MS = 120000;
  function rueckkehrMerken() {
    try {
      sessionStorage.setItem(RUECK_SCHLUESSEL, JSON.stringify({
        raum: zustand.raum, name: zustand.ichName,
        mitBild: Boolean(zustand.eigenerStrom && zustand.eigenerStrom.getVideoTracks().length),
        zeit: Date.now()
      }));
    } catch (e) {}
  }
  function rueckkehrVergessen() {
    try { sessionStorage.removeItem(RUECK_SCHLUESSEL); } catch (e) {}
  }
  function rueckkehrOffen() {
    try {
      var r = JSON.parse(sessionStorage.getItem(RUECK_SCHLUESSEL) || "null");
      if (!r || !r.raum) return null;
      if (Date.now() - (r.zeit || 0) > RUECK_FRIST_MS) { rueckkehrVergessen(); return null; }
      return r;
    } catch (e) { return null; }
  }
  function gemerkterRaum() { try { return localStorage.getItem("dma_livechat_raum") || ""; } catch (e) { return ""; } }
  function raumAusAdresse() {
    var t = "";
    try {
      t = new URLSearchParams((location.hash || "").replace(/^#/, "")).get("raum") || "";
      if (!t) t = new URLSearchParams(location.search).get("raum") || "";
    } catch (e) {}
    return /^[a-z0-9-]{4,64}$/i.test(t) ? t : "";
  }
  function adresseMitRaum(n) {
    return location.origin + location.pathname + "#raum=" + n;
  }

  /* --- Die eigene Kennung bleibt, was sie war -------------------
     GEMELDET: „Wenn ich aktualisiere und noch mal in den Raum gehe,
     bin ich doppelt da. Wenn ich noch mal reingehe, dreimal."

     GENAU DAS war die Ursache: die Kennung wurde bei JEDEM
     Betreten neu gewürfelt. Nach dem Neuladen war man für die
     anderen also ein völlig neuer Mensch, und der alte blieb als
     Karteileiche im Raum stehen — beim dritten Mal standen drei
     davon da.

     Jetzt wird die Kennung einmal gewürfelt und behalten. Wer
     wiederkommt, nimmt denselben Platz wieder ein, statt einen
     neuen zu belegen. (Zusätzlich räumt der Pulsschlag weiter
     unten Karteileichen weg, falls doch einmal eine entsteht —
     zum Beispiel bei einem Absturz.) */
  var ICH_SCHLUESSEL = "dma_livechat_ich";
  function eigeneId() {
    try {
      var da = localStorage.getItem(ICH_SCHLUESSEL);
      if (da && /^[a-z0-9]{8,24}$/.test(da)) return da;
    } catch (e) {}
    var zeichen = "abcdefghijklmnopqrstuvwxyz0123456789";
    var s = "";
    for (var i = 0; i < 12; i++) s += zeichen[Math.floor(Math.random() * zeichen.length)];
    try { localStorage.setItem(ICH_SCHLUESSEL, s); } catch (e) {}
    return s;
  }

  /* --- Der Chatverlauf überlebt das Neuladen --------------------
     GEWÜNSCHT: „Wenn man aktualisiert, ist der Chat plötzlich weg.
     Solange man am Raum teilnimmt, soll er lesbar bleiben — und
     auch wenn man den Raum verlassen hat und wiederkommt, soll man
     nachlesen können, was geschrieben wurde."

     Der Verlauf liegt deshalb NUR auf dem eigenen Gerät (nichts
     davon geht an einen Server) und bleibt dort, bis man ihn selbst
     löscht. Je Raum ein eigener Eintrag. */
  function chatSchluessel(raum) { return "dma_livechat_chat_" + (raum || "-"); }
  function chatLaden(raum) {
    try {
      var l = JSON.parse(localStorage.getItem(chatSchluessel(raum)) || "[]");
      return Array.isArray(l) ? l.slice(-CHAT_VERLAUF) : [];
    } catch (e) { return []; }
  }
  /* Beim Sichern werden ALTE Bilder herausgenommen: der Platz im
     Gerät ist auf wenige Megabyte begrenzt, und sechzig Fotos zu je
     achtzig Kilobyte sprengen ihn. Die letzten sechs Bilder bleiben,
     ältere werden zu einem Vermerk — der Text bleibt vollständig. */
  var BILDER_BEHALTEN = 6;
  function chatSichern() {
    if (!zustand.raum) return;
    var liste = zustand.nachrichten.slice(-CHAT_VERLAUF);
    var bilderGesehen = 0;
    var sparsam = liste.slice().reverse().map(function (n) {
      if (!n.bildImChat) return n;
      bilderGesehen++;
      if (bilderGesehen <= BILDER_BEHALTEN) return n;
      var kopie = {};
      Object.keys(n).forEach(function (k) { kopie[k] = n[k]; });
      kopie.bildImChat = "";
      kopie.bildWeg = true;
      return kopie;
    }).reverse();
    try {
      localStorage.setItem(chatSchluessel(zustand.raum), JSON.stringify(sparsam));
    } catch (e) {
      /* Kein Platz mehr? Dann wenigstens den Text retten. */
      try {
        localStorage.setItem(chatSchluessel(zustand.raum), JSON.stringify(
          sparsam.map(function (n) {
            var k = {}; Object.keys(n).forEach(function (x) { k[x] = n[x]; });
            k.bildImChat = ""; if (n.bildImChat) k.bildWeg = true;
            return k;
          })));
      } catch (e2) {}
    }
  }
  function chatLeeren() {
    zustand.nachrichten = [];
    try { localStorage.removeItem(chatSchluessel(zustand.raum)); } catch (e) {}
    melden();
  }

  /* --- Das Profilbild -------------------------------------------
     GEWÜNSCHT: „Ich hab nicht gesehen, wo man ein Profilbild rein-
     laden kann. Eigentlich kann dort auch standardmäßig das
     Profilbild angezeigt werden — und es soll nicht sofort zum
     Video springen."

     Das Bild ist eine Adresse (das Profilbild aus dem Konto oder
     ein GIF-Link). Es wird mit jedem Gruss und jedem Pulsschlag
     mitgeschickt, damit auch die es sehen, die später dazukommen. */
  var BILD_SCHLUESSEL = "dma_livechat_bild";
  function bildLaden() {
    try { return localStorage.getItem(BILD_SCHLUESSEL) || ""; } catch (e) { return ""; }
  }
  function bildSetzen(adresse) {
    var a = String(adresse || "").trim().slice(0, 600);
    if (a && !/^(https?:|data:image\/)/i.test(a)) return false;
    zustand.ichBild = a;
    try {
      if (a) localStorage.setItem(BILD_SCHLUESSEL, a);
      else localStorage.removeItem(BILD_SCHLUESSEL);
    } catch (e) {}
    senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn, bild: a });
    melden();
    return true;
  }

  /* =========================================================
     KAMERA UND MIKROFON
     ---------------------------------------------------------
     Der Raum muss auch OHNE Kamera funktionieren. Wer nur
     zuhören und schreiben will, soll das dürfen — und wer keine
     Kamera hat, soll nicht vor der Tür stehen bleiben.
     ========================================================= */
  /* WARUM DIE FEHLER HIER IM KLARTEXT STEHEN
     GEMELDET: „Sie sieht bei mir einen schwarzen Bildschirm. Ich
     schätze, dass bei ihr die Abfrage gar nicht kommt, ob sie ihr
     Mikrofon einschaltet."

     Vorher hat diese Stelle jeden Fehler verschluckt und einfach
     `null` zurückgegeben — die Oberfläche zeigte dann einen leeren
     Kreis, und niemand konnte wissen, woran es lag. Jetzt steht
     der Grund als Satz da, samt dem, was zu tun ist.

     Ein Browser lässt sich ÜBRIGENS NICHT zwingen, die Abfrage zu
     zeigen. Sie kommt nur, wenn die Seite über https läuft, und
     sie kommt kein zweites Mal, wenn man einmal „Blockieren"
     gewählt hat — dann muss man es in den Einstellungen des
     Browsers zurücknehmen (Schloss-Symbol neben der Adresse).
     Das lässt sich nicht umgehen, aber man kann es erklären, und
     genau das steht jetzt dort. */
  function medienFehler(e) {
    var n = (e && (e.name || e.message)) || "";
    if (/NotAllowed|Permission/i.test(n)) {
      return "Kamera und Mikrofon sind für diese Seite blockiert. Tippe auf das "
           + "Schloss-Symbol links neben der Adresse und stelle Kamera und Mikrofon "
           + "auf „Zulassen“ — danach die Seite einmal neu laden. Ein zweites Mal "
           + "fragt der Browser von selbst nicht mehr.";
    }
    if (/NotFound|Devices/i.test(n)) {
      return "Der Browser findet kein Mikrofon und keine Kamera. Du kannst trotzdem "
           + "dabei sein: zuhören und schreiben geht auch ohne.";
    }
    if (/NotReadable|TrackStart/i.test(n)) {
      return "Kamera oder Mikrofon werden gerade von einem anderen Programm benutzt "
           + "(oft ein zweiter Tab oder eine Videoanruf-App). Schliess das andere "
           + "Fenster und versuche es noch einmal.";
    }
    if (/Overconstrained/i.test(n)) {
      return "Diese Kamera kann das angeforderte Format nicht. Versuch es ohne Bild.";
    }
    return "Kamera und Mikrofon liessen sich nicht öffnen (" + (n || "unbekannt") + ").";
  }

  function unsichererOrt() {
    return !(location.protocol === "https:" || location.hostname === "localhost"
             || location.hostname === "127.0.0.1");
  }

  function stromHolen(mitBild) {
    zustand.kameraFehler = "";
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      zustand.kameraFehler = unsichererOrt()
        ? "Diese Seite läuft nicht über https. Ohne https fragt der Browser gar nicht "
          + "erst nach Kamera und Mikrofon — das ist eine feste Regel des Browsers."
        : "Dieser Browser kann keine Kamera und kein Mikrofon freigeben.";
      return Promise.resolve(null);
    }
    var mitTon = {
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: mitBild ? { width: { ideal: 480 }, height: { ideal: 480 }, facingMode: "user" } : false
    };
    return navigator.mediaDevices.getUserMedia(mitTon).catch(function (e) {
      /* Kamera verweigert? Dann wenigstens der Ton — und den Grund merken. */
      if (!mitBild) { zustand.kameraFehler = medienFehler(e); return null; }
      return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function (nurTon) {
          zustand.kameraFehler = "Die Kamera ging nicht — der Ton läuft. " + medienFehler(e);
          return nurTon;
        })
        .catch(function (e2) { zustand.kameraFehler = medienFehler(e2); return null; });
    });
  }

  /* =========================================================
     DIE VERBINDUNG ZU EINEM ANDEREN
     ---------------------------------------------------------
     „hoeflich" entscheidet, wer anruft und wer abnimmt. Ohne
     diese Regel rufen beide gleichzeitig an, und beide Anrufe
     heben sich auf (das ist der berüchtigte „glare"). Die Regel
     ist stumpf und darum zuverlässig: wer die kleinere Kennung
     hat, ruft an.
     ========================================================= */
  function bruecke(anderId) {
    if (brueckeJe[anderId]) return brueckeJe[anderId];
    var pc = new RTCPeerConnection({ iceServers: VERMITTLER });
    brueckeJe[anderId] = pc;
    /* Der Platz muss existieren, BEVOR ein Bild eintrifft.
       Sonst kommt der Strom an und findet niemanden, dem er
       gehört — und der Kreis bleibt leer, obwohl die Verbindung
       steht. */
    personMerken(anderId);

    if (zustand.eigenerStrom) {
      zustand.eigenerStrom.getTracks().forEach(function (t) {
        try { pc.addTrack(t, zustand.eigenerStrom); } catch (e) {}
      });
    } else {
      /* Wer keine Kamera und kein Mikrofon hat (oder beides
         abgelehnt hat), muss trotzdem EMPFANGEN können. Ohne
         diese zwei Zeilen enthält das Angebot keine Spur für Ton
         und Bild — der andere schickt dann auch nichts, und der
         Zuhörer sitzt in einem stummen, schwarzen Raum und hält
         es für einen Fehler. */
      try {
        pc.addTransceiver("audio", { direction: "recvonly" });
        pc.addTransceiver("video", { direction: "recvonly" });
      } catch (e) {}
    }

    pc.onicecandidate = function (e) {
      if (e.candidate) senden({ art: "kerze", an: anderId, kerze: alsDaten(e.candidate) });
    };
    pc.ontrack = function (e) {
      var p = zustand.leute[anderId];
      if (!p) return;
      p.strom = e.streams && e.streams[0] ? e.streams[0] : null;
      melden();
    };
    pc.onconnectionstatechange = function () {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        brueckeAbbauen(anderId);
        melden();
      }
    };
    return pc;
  }

  var kerzenLager = {};
  function wartendeKerzenNachreichen(id) {
    var pc = brueckeJe[id], liste = kerzenLager[id];
    if (!pc || !liste) return;
    liste.forEach(function (k) {
      pc.addIceCandidate(new RTCIceCandidate(k)).catch(function () {});
    });
    delete kerzenLager[id];
  }

  function brueckeAbbauen(id) {
    var pc = brueckeJe[id];
    if (pc) { try { pc.close(); } catch (e) {} delete brueckeJe[id]; }
    delete kerzenLager[id];
  }

  /* --- Alles, was über die Leitung geht, muss EINFACHE Daten sein ---
     Und das ist kein Schönheitsfehler, sondern war hier ein echter
     Fehler: RTCSessionDescription und RTCIceCandidate sind
     Browser-Objekte. Je nachdem, wie der Bote sie verpackt, kommen
     sie als leeres Objekt an — oder gar nicht, weil das Verpacken
     mit einem Fehler abbricht, den niemand sieht.
     Das Ergebnis war genau das, was im Test zu sehen war: der Chat
     lief, aber es kam nie ein Bild an. Darum werden Angebot,
     Antwort und Kerzen vorher in reine Felder zerlegt. */
  function alsDaten(o) {
    if (!o) return null;
    if (o.toJSON) { try { return JSON.parse(JSON.stringify(o.toJSON())); } catch (e) {} }
    return {
      type: o.type, sdp: o.sdp,
      candidate: o.candidate, sdpMid: o.sdpMid,
      sdpMLineIndex: o.sdpMLineIndex, usernameFragment: o.usernameFragment
    };
  }

  function anrufen(anderId) {
    var pc = bruecke(anderId);
    return pc.createOffer().then(function (angebot) {
      return pc.setLocalDescription(angebot).then(function () {
        senden({ art: "angebot", an: anderId, name: zustand.ichName, beschreibung: alsDaten(pc.localDescription) });
      });
    }).catch(function () {});
  }

  function angebotAnnehmen(vonId, beschreibung) {
    var pc = bruecke(vonId);
    return pc.setRemoteDescription(new RTCSessionDescription(beschreibung))
      .then(function () { return pc.createAnswer(); })
      .then(function (antwort) {
        return pc.setLocalDescription(antwort).then(function () {
          senden({ art: "antwort", an: vonId, beschreibung: alsDaten(pc.localDescription) });
          wartendeKerzenNachreichen(vonId);
        });
      }).catch(function () {});
  }

  /* =========================================================
     DER KANAL — der Zettelaustausch
     ========================================================= */
  var sbKlient = null;
  function klient() {
    if (sbKlient) return sbKlient;
    if (!moeglich()) return null;
    /* Ein EIGENER Klient, absichtlich. Der Klient in backend.js
       trägt die Anmeldung des Nutzers; der hier braucht sie
       nicht und soll sie auch nicht anfassen. */
    sbKlient = window.supabase.createClient(
      window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey,
      { realtime: { params: { eventsPerSecond: 20 } } }
    );
    return sbKlient;
  }

  function senden(nutzlast) {
    if (!kanal) return;
    nutzlast.von = zustand.ichId;
    try { kanal.send({ type: "broadcast", event: "raum", payload: nutzlast }); } catch (e) {}
  }

  function empfangen(n) {
    if (!n || n.von === zustand.ichId) return;             // die eigene Post nicht lesen
    if (n.an && n.an !== zustand.ichId) return;            // nicht für uns

    /* Jedes Lebenszeichen zählt — auch eine Kerze oder ein Satz im
       Chat sagt: der ist noch da. */
    if (zustand.leute[n.von]) zustand.leute[n.von].gesehen = Date.now();

    if (n.art === "puls") {
      var neuDa = !zustand.leute[n.von];
      personMerken(n.von, n.name, n.bild);
      if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
      if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
      /* Steht noch keine Leitung zu ihm, wird sie jetzt aufgebaut —
         so findet man auch jemanden, dessen Gruss man verpasst hat. */
      if (neuDa || !brueckeJe[n.von]) {
        if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
        else senden({ art: "auch-da", an: n.von, name: zustand.ichName,
                      tonAn: zustand.tonAn, bildAn: zustand.bildAn, bild: zustand.ichBild });
      }
      melden();
      return;
    }

    if (n.art === "hallo") {
      /* Jemand ist gekommen. Zurückgrüssen, damit er uns auch
         kennt — der Gruss allein sagt ihm nur, dass wir da sind. */
      personMerken(n.von, n.name, n.bild);
      senden({ art: "auch-da", an: n.von, name: zustand.ichName, tonAn: zustand.tonAn,
               bildAn: zustand.bildAn, bild: zustand.ichBild });
      /* Wer die kleinere Kennung hat, ruft an. */
      if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
      melden();
      return;
    }
    if (n.art === "auch-da") {
      personMerken(n.von, n.name, n.bild);
      if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
      if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
      if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
      melden();
      return;
    }
    if (n.art === "tschuess") {
      brueckeAbbauen(n.von);
      delete zustand.leute[n.von];
      if (zustand.gross === n.von) zustand.gross = null;
      melden();
      return;
    }
    if (n.art === "angebot") { personMerken(n.von, n.name, n.bild); angebotAnnehmen(n.von, n.beschreibung); return; }
    if (n.art === "antwort") {
      var pc = brueckeJe[n.von];
      if (pc) {
        pc.setRemoteDescription(new RTCSessionDescription(n.beschreibung))
          .then(function () { wartendeKerzenNachreichen(n.von); })
          .catch(function () {});
      }
      return;
    }
    if (n.art === "kerze") {
      var pk = brueckeJe[n.von];
      /* Kerzen kommen oft VOR der Antwort an — der Browser wirft
         sie dann weg, weil er noch nicht weiss, wozu sie gehören.
         Darum werden sie zwischengelegt und nachgereicht, sobald
         die Gegenseite beschrieben ist. Ohne das kommt die
         Verbindung manchmal zustande und manchmal nicht, je
         nachdem, was zuerst da war. */
      if (!pk || !n.kerze) return;
      if (!pk.remoteDescription || !pk.remoteDescription.type) {
        (kerzenLager[n.von] = kerzenLager[n.von] || []).push(n.kerze);
        return;
      }
      pk.addIceCandidate(new RTCIceCandidate(n.kerze)).catch(function () {});
      return;
    }
    if (n.art === "stumm") {
      if (zustand.leute[n.von]) {
        if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
        if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
        if (typeof n.bild === "string") zustand.leute[n.von].bild = n.bild;
        melden();
      }
      return;
    }
    if (n.art === "text") {
      if (!n.text && !n.bildImChat) return;
      nachrichtAnhaengen({
        id: n.id || String(Date.now()) + n.von,
        von: n.von, name: n.name || "Gast",
        text: String(n.text || "").slice(0, CHAT_LAENGE),
        zeit: n.zeit || Date.now(), eigen: false, bild: n.bild || "",
        bildImChat: typeof n.bildImChat === "string" ? n.bildImChat.slice(0, 200000) : ""
      });
      melden();
      return;
    }
  }

  function personMerken(id, name, bild) {
    if (!zustand.leute[id]) {
      zustand.leute[id] = { id: id, name: name || "Gast", strom: null, seit: Date.now(),
                            gesehen: Date.now(), tonAn: true, bildAn: false, bild: bild || "" };
    } else {
      if (name) zustand.leute[id].name = name;
      if (bild) zustand.leute[id].bild = bild;
      zustand.leute[id].gesehen = Date.now();
    }
  }

  /* --- Der Pulsschlag räumt Karteileichen weg -------------------
     Ein Neuladen meldet sich nicht ab: „tschüss" kommt nur an,
     wenn der Browser noch dazu kommt, es zu schicken — beim harten
     Neuladen und wenn das Telefon zumacht, tut er das nicht.

     Darum sagt jeder alle sechs Sekunden kurz „ich bin noch da".
     Wer zwanzig Sekunden nichts gesagt hat, wird aus dem Raum
     genommen. Zusammen mit der gleichbleibenden Kennung ist damit
     ausgeschlossen, dass jemand doppelt dasteht. */
  var PULS_MS = 6000;
  var VERFALL_MS = 20000;
  var pulsUhr = null;
  function pulsStarten() {
    pulsStoppen();
    pulsUhr = setInterval(function () {
      if (zustand.lage !== "drin") return;
      senden({ art: "puls", name: zustand.ichName, tonAn: zustand.tonAn,
               bildAn: zustand.bildAn, bild: zustand.ichBild });
      var jetzt = Date.now(), weg = false;
      Object.keys(zustand.leute).forEach(function (id) {
        if (jetzt - (zustand.leute[id].gesehen || 0) > VERFALL_MS) {
          brueckeAbbauen(id);
          delete zustand.leute[id];
          if (zustand.gross === id) zustand.gross = null;
          weg = true;
        }
      });
      if (weg) melden();
    }, PULS_MS);
  }
  function pulsStoppen() { if (pulsUhr) { clearInterval(pulsUhr); pulsUhr = null; } }

  function nachrichtAnhaengen(n) {
    /* Dieselbe Nachricht kann zweimal ankommen (Neuladen, Puls).
       Sie hat eine Kennung — damit lässt sich das ausschliessen. */
    if (n.id && zustand.nachrichten.some(function (a) { return a.id === n.id; })) return;
    zustand.nachrichten.push(n);
    if (zustand.nachrichten.length > CHAT_VERLAUF) {
      zustand.nachrichten = zustand.nachrichten.slice(-CHAT_VERLAUF);
    }
    chatSichern();
  }

  /* =========================================================
     WER IST GERADE IM KLASSENZIMMER?
     ---------------------------------------------------------
     GEWÜNSCHT: „Es soll im Newsticker oben auch dastehen, wenn ich
     im Klassenzimmer bin. Und bei den Leuten, die gerade im
     Klassenzimmer sind, ein ganz kleines Symbol, das zum
     Klassenzimmer passt — damit man sieht, dass die gerade
     Unterricht haben."

     Dafür braucht es keine neue Tabelle und keine Änderung an der
     Datenbank. Supabase Realtime kann von sich aus sagen, WER auf
     einem Kanal sitzt („presence"). Alle auf der Seite hören
     diesen Kanal mit; wer im Raum ist, trägt sich dort ein. Geht
     der Tab zu, trägt der Server ihn von selbst wieder aus — auch
     beim Absturz.
     ========================================================= */
  var praesenzKanal = null;
  var praesenzDa = {};        // profilId -> { name }
  var praesenzHorcher = [];
  var praesenzIch = "";

  function praesenzMelden() {
    praesenzHorcher.forEach(function (f) { try { f(praesenzDa); } catch (e) {} });
  }
  function beiPraesenz(f) {
    praesenzHorcher.push(f);
    try { f(praesenzDa); } catch (e) {}
    return function () {
      praesenzHorcher = praesenzHorcher.filter(function (g) { return g !== f; });
    };
  }
  function praesenzLesen() {
    if (!praesenzKanal) return;
    var roh = {};
    try { roh = praesenzKanal.presenceState() || {}; } catch (e) { return; }
    var neu = {};
    Object.keys(roh).forEach(function (schluessel) {
      var eintraege = roh[schluessel] || [];
      var e = eintraege[eintraege.length - 1] || {};
      neu[schluessel] = { name: e.name || "", seit: e.seit || 0 };
    });
    praesenzDa = neu;
    praesenzMelden();
  }

  /* Wird beim Start der Seite EINMAL aufgerufen — auch von Leuten,
     die gar nicht in den Raum wollen. Zuhören kostet nichts. */
  function praesenzZuhoeren(profilId) {
    praesenzIch = profilId || "";
    if (praesenzKanal) return;
    if (!(window.supabase && window.SUPABASE_CONFIG
          && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey)) return;
    var k = klient();
    if (!k) return;
    praesenzKanal = k.channel("dma-klassenzimmer-da", {
      config: { presence: { key: praesenzIch || eigeneId() } }
    });
    praesenzKanal.on("presence", { event: "sync" }, praesenzLesen);
    praesenzKanal.on("presence", { event: "join" }, praesenzLesen);
    praesenzKanal.on("presence", { event: "leave" }, praesenzLesen);
    praesenzKanal.subscribe(function (st) { if (st === "SUBSCRIBED") praesenzLesen(); });
  }

  function praesenzSetzen(drin, name) {
    if (!praesenzKanal) return;
    try {
      if (drin) praesenzKanal.track({ name: name || "", seit: Date.now() });
      else praesenzKanal.untrack();
    } catch (e) {}
  }

  /* =========================================================
     BETRETEN UND VERLASSEN
     ========================================================= */
  function betreten(raumName, optionen) {
    var o = optionen || {};
    if (!moeglich()) {
      zustand.lage = "fehler";
      zustand.fehler = "Für den Live-Chat fehlt die Verbindung zur Datenbank (Supabase) oder der Browser kann kein WebRTC. Das Klassenzimmer funktioniert trotzdem.";
      melden();
      return Promise.resolve(lage());
    }
    if (zustand.lage === "drin" || zustand.lage === "verbindet") return Promise.resolve(lage());

    zustand.raum = String(raumName || "").trim() || gemerkterRaum() || neuerRaumName();
    raumMerken(zustand.raum);
    zustand.ichId = eigeneId();
    zustand.ichName = o.name || "Gast";
    zustand.lage = "verbindet";
    zustand.fehler = "";
    zustand.ichBild = o.bild || bildLaden();
    /* Der Verlauf aus diesem Raum wird MITGEBRACHT, nicht
       weggeworfen — man soll nachlesen können, was geschrieben
       wurde, auch nach dem Neuladen und nach dem Wiederkommen. */
    zustand.nachrichten = chatLaden(zustand.raum);
    melden();

    /* WICHTIG: die Kamera geht NICHT von selbst an.
       GEWÜNSCHT: „dass das nicht sofort zum Video springt — dass man
       sich entscheiden kann, ob man das Video anschalten will, nicht
       dass sofort das Video auf ist bei Leuten, die das vielleicht
       nicht wollen."
       Also standardmäßig nur Ton. Wer sein Bild zeigen will, tippt
       auf die Kamera; erst dann fragt der Browser danach. */
    return stromHolen(o.mitBild === true).then(function (strom) {
      zustand.eigenerStrom = strom;
      zustand.bildAn = Boolean(strom && strom.getVideoTracks().length);
      zustand.tonAn = Boolean(strom && strom.getAudioTracks().length);

      var k = klient();
      kanal = k.channel("dma-raum-" + zustand.raum, {
        config: { broadcast: { self: false } }
      });
      kanal.on("broadcast", { event: "raum" }, function (nachricht) {
        empfangen(nachricht && nachricht.payload);
      });

      return new Promise(function (fertig) {
        kanal.subscribe(function (stand) {
          if (stand === "SUBSCRIBED") {
            zustand.lage = "drin";
            senden({ art: "hallo", name: zustand.ichName, bild: zustand.ichBild,
                     tonAn: zustand.tonAn, bildAn: zustand.bildAn });
            pulsStarten();
            praesenzSetzen(true, zustand.ichName);
            melden();
            fertig(lage());
          } else if (stand === "CHANNEL_ERROR" || stand === "TIMED_OUT") {
            zustand.lage = "fehler";
            zustand.fehler = "Der Raum liess sich nicht öffnen. Netz prüfen und noch einmal versuchen.";
            melden();
            fertig(lage());
          }
        });
      });
    }).catch(function () {
      zustand.lage = "fehler";
      zustand.fehler = "Der Raum liess sich nicht öffnen. Netz prüfen und noch einmal versuchen.";
      melden();
      return lage();
    });
  }

  /* Die Seite geht weg (Neuladen, Tab zu, Telefon gesperrt).
     pagehide statt unload: unload wird auf dem Telefon oft gar
     nicht mehr ausgelöst. */
  window.addEventListener("pagehide", function () {
    if (zustand.lage === "drin") rueckkehrMerken();
  });

  function verlassen() {
    /* Ausdrücklich gegangen heisst: nicht zurückholen.
       Der Chatverlauf bleibt aber liegen — man soll nachlesen
       können, was geschrieben wurde, auch wenn man wiederkommt.
       Weg ist er erst, wenn man ihn selbst löscht. */
    rueckkehrVergessen();
    pulsStoppen();
    praesenzSetzen(false);
    if (kanal) {
      senden({ art: "tschuess" });
      try { kanal.unsubscribe(); } catch (e) {}
      kanal = null;
    }
    Object.keys(brueckeJe).forEach(brueckeAbbauen);
    if (zustand.eigenerStrom) {
      try { zustand.eigenerStrom.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    }
    zustand.eigenerStrom = null;
    zustand.leute = {};
    zustand.gross = null;
    zustand.lage = "aus";
    melden();
  }

  /* =========================================================
     BEDIENUNG
     ========================================================= */
  function tonUmschalten() {
    if (!zustand.eigenerStrom) return;
    zustand.tonAn = !zustand.tonAn;
    zustand.eigenerStrom.getAudioTracks().forEach(function (t) { t.enabled = zustand.tonAn; });
    senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn });
    melden();
  }
  /* Kamera an- und ausschalten.
     Hat man den Raum ohne Bild betreten, gibt es noch gar keine
     Videospur. Die lässt sich nicht einfach nachschieben: eine
     bestehende Direktverbindung müsste dafür neu ausgehandelt
     werden. Statt dieser heiklen Aushandlung werden die Leitungen
     kurz abgebaut und mit einem neuen Gruss wieder aufgebaut —
     das dauert eine Sekunde und geht IMMER. Der Chat läuft
     derweil weiter, er hängt nicht an diesen Leitungen. */
  function bildUmschalten() {
    if (zustand.eigenerStrom && zustand.eigenerStrom.getVideoTracks().length) {
      zustand.bildAn = !zustand.bildAn;
      zustand.eigenerStrom.getVideoTracks().forEach(function (t) { t.enabled = zustand.bildAn; });
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn, bild: zustand.ichBild });
      melden();
      return Promise.resolve(true);
    }
    return kameraDazuholen();
  }

  function kameraDazuholen() {
    if (zustand.lage !== "drin") return Promise.resolve(false);
    return stromHolen(true).then(function (strom) {
      if (!strom || !strom.getVideoTracks().length) { melden(); return false; }
      if (zustand.eigenerStrom) {
        try { zustand.eigenerStrom.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      }
      zustand.eigenerStrom = strom;
      zustand.bildAn = true;
      zustand.tonAn = Boolean(strom.getAudioTracks().length);
      Object.keys(brueckeJe).forEach(brueckeAbbauen);
      senden({ art: "hallo", name: zustand.ichName, bild: zustand.ichBild,
               tonAn: zustand.tonAn, bildAn: zustand.bildAn });
      melden();
      return true;
    });
  }
  function grossZeigen(id) { zustand.gross = id || null; melden(); }

  /* --- Bilder und GIFs im Chat ----------------------------------
     GEWÜNSCHT: „dass man Bilder im Chat senden kann, Fotos — oder
     das mit den GIFs."

     Ein Foto geht denselben Weg wie ein Satz: über den Kanal, an alle
     im Raum. Damit das gutgeht, wird es vorher im Gerät verkleinert —
     ein Kanalpaket darf nicht beliebig gross sein, und ein Foto vom
     Telefon hat schnell vier Megabyte. 640 Pixel lange Kante und
     JPEG-Qualität 0,6 ergeben in aller Regel 30 bis 80 Kilobyte.

     Ein GIF wird NICHT verkleinert — es wird als Adresse verschickt.
     Das ist der Grund, warum es sich überhaupt bewegt: als Standbild
     durch die Verkleinerung wäre es keins mehr. */
  var BILD_KANTE = 640;
  var BILD_HOECHST = 140000;      // Zeichen der Datenadresse

  function bildVerkleinern(datei) {
    return new Promise(function (fertig, scheitern) {
      if (!datei || !/^image\//.test(datei.type || "")) {
        scheitern(new Error("Das ist kein Bild.")); return;
      }
      /* Ein bewegtes GIF wuerde beim Verkleinern zum Standbild.
         Es geht deshalb nur als Adresse — siehe bildSetzen(). */
      if (/gif$/i.test(datei.type)) {
        scheitern(new Error("Bewegte GIFs bitte über den GIF-Knopf als Adresse schicken — "
                          + "beim Verkleinern würden sie zum Standbild.")); return;
      }
      var leser = new FileReader();
      leser.onerror = function () { scheitern(new Error("Die Datei liess sich nicht lesen.")); };
      leser.onload = function () {
        var bild = new Image();
        bild.onerror = function () { scheitern(new Error("Das Bild liess sich nicht öffnen.")); };
        bild.onload = function () {
          var k = Math.min(1, BILD_KANTE / Math.max(bild.width, bild.height));
          var b = Math.round(bild.width * k), h = Math.round(bild.height * k);
          var tafel = document.createElement("canvas");
          tafel.width = b; tafel.height = h;
          tafel.getContext("2d").drawImage(bild, 0, 0, b, h);
          var guete = 0.62, daten = tafel.toDataURL("image/jpeg", guete);
          while (daten.length > BILD_HOECHST && guete > 0.3) {
            guete -= 0.1;
            daten = tafel.toDataURL("image/jpeg", guete);
          }
          if (daten.length > BILD_HOECHST) {
            scheitern(new Error("Das Bild ist selbst verkleinert noch zu gross."));
            return;
          }
          fertig(daten);
        };
        bild.src = leser.result;
      };
      leser.readAsDataURL(datei);
    });
  }

  function bildSenden(quelle, text) {
    var n = {
      id: String(Date.now()) + zustand.ichId,
      von: zustand.ichId, name: zustand.ichName,
      text: String(text || "").slice(0, CHAT_LAENGE),
      bildImChat: String(quelle || ""),
      zeit: Date.now(), eigen: true, bild: zustand.ichBild
    };
    if (!n.bildImChat) return false;
    nachrichtAnhaengen(n);
    senden({ art: "text", id: n.id, name: n.name, text: n.text, zeit: n.zeit,
             bild: zustand.ichBild, bildImChat: n.bildImChat });
    melden();
    return true;
  }

  function fotoSenden(datei, text) {
    return bildVerkleinern(datei).then(function (daten) {
      return bildSenden(daten, text);
    });
  }

  function gifSenden(adresse, text) {
    var a = String(adresse || "").trim().slice(0, 600);
    if (!/^https?:\/\//i.test(a)) return false;
    return bildSenden(a, text);
  }

  function schreiben(text) {
    var t = String(text || "").trim().slice(0, CHAT_LAENGE);
    if (!t) return;
    var n = {
      id: String(Date.now()) + zustand.ichId,
      von: zustand.ichId, name: zustand.ichName,
      text: t, zeit: Date.now(), eigen: true, bild: zustand.ichBild
    };
    nachrichtAnhaengen(n);
    senden({ art: "text", id: n.id, name: n.name, text: n.text, zeit: n.zeit, bild: zustand.ichBild });
    melden();
  }

  return {
    HAUPTRAUM: HAUPTRAUM,
    rueckkehrOffen: rueckkehrOffen,
    rueckkehrVergessen: rueckkehrVergessen,
    PLAETZE: PLAETZE,
    CHAT_LAENGE: CHAT_LAENGE,
    betreten: betreten,
    verlassen: verlassen,
    tonUmschalten: tonUmschalten,
    bildUmschalten: bildUmschalten,
    grossZeigen: grossZeigen,
    schreiben: schreiben,
    bildSetzen: bildSetzen,
    fotoSenden: fotoSenden,
    gifSenden: gifSenden,
    eigenesBild: function () { return zustand.ichBild; },
    kameraDazuholen: kameraDazuholen,
    chatLeeren: chatLeeren,
    praesenzZuhoeren: praesenzZuhoeren,
    praesenzDa: function () { return praesenzDa; },
    beiPraesenz: beiPraesenz,
    chatLesen: function (raum) { return chatLaden(raum || zustand.raum || HAUPTRAUM); },
    lage: lage,
    beiAenderung: beiAenderung,
    moeglich: moeglich,
    neuerRaumName: neuerRaumName,
    gemerkterRaum: gemerkterRaum,
    raumAusAdresse: raumAusAdresse,
    adresseMitRaum: adresseMitRaum,
    istDrin: function () { return zustand.lage === "drin"; }
  };
})();
