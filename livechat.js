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
    farbe: "",          // eigene Schriftfarbe (/c)
    schrift: "1",       // die Schrift im Chat, nur auf diesem Geraet (/schrift)
    thema: "",          // Thema des Raums (/t)
    haeuptling: false,  // hat diesen Raum aufgemacht (Kilahu: Haeuptling)
    abgeschlossen: false,
    eingeladen: {},     // Kennung -> true, fuer den abgeschlossenen Raum
    geknebelt: {},      // Kennung -> true
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
      farbe: zustand.farbe,
      schrift: zustand.schrift,
      thema: zustand.thema,
      haeuptling: zustand.haeuptling,
      abgeschlossen: zustand.abgeschlossen,
      raumName: raumKlartext(zustand.raum),
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
  /* Aus „ecke-leseecke" wird wieder „Leseecke". Oben im Kopf soll der
     Name stehen, den man eingetippt hat — nicht der interne. */
  function raumKlartext(r) {
    var x = String(r || "");
    if (!x || x === HAUPTRAUM) return "Klassenzimmer";
    x = x.replace(/^ecke-/, "").replace(/-/g, " ");
    return x.charAt(0).toUpperCase() + x.slice(1);
  }
  function raumSchluessel(name) {
    var x = String(name || "").toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);
    return x ? "ecke-" + x : "";
  }

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

  /* --- Die eigene Schriftfarbe ---------------------------------
     GEMELDET: „Wenn man einen Raum verlaesst und aktualisiert, dann
     hat man wieder eine Standardfarbe, wenn man reinkommt. Ich will
     das so haben, dass er sich die letzte gewaehlte Farbe merkt."
     Die Farbe lag bisher nur in zustand.farbe — und der ist nach dem
     Neuladen leer. Also gehoert sie ins Geraet. */
  /* --- Die Schrift im Chat -------------------------------------
     GEWÜNSCHT: „Drei, vier Schriftarten, die man auswählen kann."
     Die Auswahl ist eine Lesehilfe und gilt nur auf diesem Gerät —
     wie eine Brille, nicht wie eine Nachricht. */
  var SCHRIFTEN = {
    "1": { was: "klassisch" },
    "2": { was: "Schreibmaschine" },
    "3": { was: "rund und weich" },
    "4": { was: "gross und ruhig" }
  };
  var SCHRIFT_SCHLUESSEL = "dma_livechat_schrift";
  function schriftMerken(x) {
    try {
      if (x) localStorage.setItem(SCHRIFT_SCHLUESSEL, x);
      else localStorage.removeItem(SCHRIFT_SCHLUESSEL);
    } catch (e) {}
  }
  function gemerkteSchrift() {
    try { return localStorage.getItem(SCHRIFT_SCHLUESSEL) || "1"; } catch (e) { return "1"; }
  }

  var FARB_SCHLUESSEL = "dma_livechat_farbe";
  function farbeMerken(f) {
    try {
      if (f) localStorage.setItem(FARB_SCHLUESSEL, f);
      else localStorage.removeItem(FARB_SCHLUESSEL);
    } catch (e) {}
  }
  function gemerkteFarbe() {
    try { return localStorage.getItem(FARB_SCHLUESSEL) || ""; } catch (e) { return ""; }
  }

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
  /* Wird beim Betreten gesetzt: die Kennung des ANGEMELDETEN KONTOS.
     GEWÜNSCHT: „auch wenn er sich vom Handy gleichzeitig im Laptop
     einloggt, soll er nicht doppelt da sein."
     Mit einer Kennung je Gerät ginge das nicht — zwei Geräte, zwei
     Kennungen, zwei Plätze. Mit der Kontokennung ist es dieselbe
     Person, egal auf welchem Gerät, und der zweite Platz entsteht gar
     nicht erst. Nur wer NICHT angemeldet ist, bekommt weiterhin eine
     Kennung je Gerät — etwas anderes gibt es dann nicht. */
  var kontoId = "";
  function eigeneId() {
    if (kontoId) return "k" + kontoId.replace(/[^a-z0-9]/gi, "").slice(0, 22).toLowerCase();
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
  /* --- DER GEMEINSAME VERLAUF ----------------------------------
     GEWÜNSCHT: „Jemand, der komplett neu reinkommt, hat keinen
     Kontext. Und wer sich vom Handy ausloggt und auf dem Laptop mit
     demselben Profil einloggt, sieht den Chat auch nicht. Der Chat
     soll immer sichtbar sein für jeden, der neu reinkommt, mit allen
     Bildern, und systemübergreifend."

     Bis hierher lag der Verlauf NUR im jeweiligen Gerät. Das konnte
     genau das nicht. Er liegt jetzt zusätzlich in einer Tabelle
     (siehe supabase/klassenzimmer-chat.sql) und wird beim Betreten
     von dort geholt — vollständig, mit Bildern, auf jedem Gerät.

     Das Gerät behält trotzdem eine Abschrift: wer nicht angemeldet
     ist oder gerade kein Netz hat, sieht dann wenigstens das, was er
     selbst schon gesehen hat. Beide Quellen werden über die Kennung
     zusammengeführt, doppelt kann also nichts erscheinen. */
  var TISCH = "klassenzimmer_chat";
  function angemeldeterZugang() {
    try {
      return (window.Backend && Backend.zugang && Backend.zugang()) || null;
    } catch (e) { return null; }
  }

  function serverLaden(raum) {
    var z = angemeldeterZugang();
    if (!z) return Promise.resolve([]);
    return z.from(TISCH)
      .select("id,raum,autor,name,bild,text,bild_im_chat,art,farbe,erstellt")
      .eq("raum", raum)
      .order("erstellt", { ascending: false })
      .limit(CHAT_VERLAUF)
      .then(function (a) {
        if (!a || a.error || !a.data) return [];
        return a.data.slice().reverse().map(function (r) {
          return {
            id: "s" + r.id,
            von: r.autor ? "k" + String(r.autor).replace(/[^a-z0-9]/gi, "").slice(0, 22).toLowerCase() : "",
            name: r.name || "Gast",
            text: r.text || "",
            bild: r.bild || "",
            bildImChat: r.bild_im_chat || "",
            farbe: r.farbe || "",
            art: r.art || "text",
            zeit: new Date(r.erstellt).getTime(),
            eigen: false
          };
        });
      })
      .catch(function () { return []; });
  }

  function serverSichern(n) {
    var z = angemeldeterZugang();
    if (!z) return;
    var nutzer = null;
    try { nutzer = window.Backend && Backend.currentUser && Backend.currentUser(); } catch (e) {}
    if (!nutzer || !nutzer.id) return;          // ohne Anmeldung kein Eintrag
    try {
      z.from(TISCH).insert({
        raum: zustand.raum,
        autor: nutzer.id,
        name: n.name || "Gast",
        bild: n.bild || "",
        text: n.text || "",
        bild_im_chat: n.bildImChat || "",
        farbe: n.farbe || zustand.farbe || "",
        art: n.art || "text"
      }).then(function () {}, function () {});
    } catch (e) {}
  }

  /* Zwei Listen zu einer: nach Zeit sortiert, ohne Doppelte.
     Dieselbe Nachricht kommt einmal über den Kanal (sofort) und
     einmal aus der Tabelle (beim nächsten Betreten). Erkannt wird
     sie an Absender, Zeit und Text — die Kennungen sind verschieden,
     weil die Tabelle ihre eigene vergibt. */
  function verschmelzen(a, b) {
    var alles = (a || []).concat(b || []);
    var raus = [];
    alles.sort(function (x, y) { return (x.zeit || 0) - (y.zeit || 0); });
    alles.forEach(function (n) {
      var doppelt = raus.some(function (m) {
        if (m.id && n.id && m.id === n.id) return true;
        return m.name === n.name && m.text === n.text
            && Math.abs((m.zeit || 0) - (n.zeit || 0)) < 4000
            && Boolean(m.bildImChat) === Boolean(n.bildImChat);
      });
      if (!doppelt) raus.push(n);
    });
    return raus.slice(-CHAT_VERLAUF);
  }

  /* =========================================================
     DAS BILDERLAGER
     ---------------------------------------------------------
     GEMELDET: „Wenn man sich Bilder aus seiner Galerie reinmachen
     will, dann kriegt man nur diese Vorschaugrafiken angezeigt,
     dass da ein Bild sein soll, aber nicht das Bild selber."

     WO DIE URSACHE LAG — und es waren zwei:

     1. Die gemeinsame Tabelle in der Datenbank gab es nicht. Das
        SQL lag zwar im Ordner supabase/, war aber nie ausgefuehrt.
        Also konnte kein Bild ueber Geraete hinweg ankommen.

     2. Im Geraet selbst lagen die Bilder im localStorage. Der ist
        auf wenige Megabyte begrenzt, und ein einziges Foto wiegt
        achtzig Kilobyte. Deshalb hat chatSichern() alles ausser den
        letzten sechs Bildern durch den Vermerk „Bild — nicht mehr
        gespeichert" ersetzt. GENAU DIESER VERMERK war die
        „Vorschaugrafik", die zu sehen war.

     Die Loesung ist nicht, den Vermerk huebscher zu machen, sondern
     ihn ueberfluessig. Bilder gehoeren nicht in den localStorage,
     sondern in die IndexedDB: dort liegen hunderte Megabyte bereit,
     und sie ueberlebt das Neuladen genauso. Im localStorage steht
     ab jetzt nur noch der Text, und am Bild ein Haken, dass eines
     dazugehoert. Beim Betreten des Raums werden die Bilder aus dem
     Lager nachgereicht.

     GEWUENSCHT ausserdem: „Das System kann sich das gerne merken,
     diese Bilder, damit man die nicht immer wieder neu raussuchen
     muss." — siehe letzteBilder() weiter unten. */
  var LAGER_NAME = "dma_klassenzimmer";
  var LAGER_FACH = "bilder";
  var lagerOffen = null;

  function lager() {
    if (lagerOffen) return lagerOffen;
    lagerOffen = new Promise(function (fertig) {
      var idb = null;
      try { idb = window.indexedDB; } catch (e) {}
      if (!idb) { fertig(null); return; }
      var a;
      try { a = idb.open(LAGER_NAME, 1); } catch (e) { fertig(null); return; }
      a.onupgradeneeded = function () {
        var db = a.result;
        if (!db.objectStoreNames.contains(LAGER_FACH)) {
          var f = db.createObjectStore(LAGER_FACH, { keyPath: "id" });
          f.createIndex("zeit", "zeit");
        }
      };
      a.onsuccess = function () { fertig(a.result); };
      a.onerror = function () { fertig(null); };
      a.onblocked = function () { fertig(null); };
    });
    return lagerOffen;
  }

  function lagerLegen(id, raum, daten) {
    if (!id || !daten) return Promise.resolve(false);
    return lager().then(function (db) {
      if (!db) return false;
      return new Promise(function (fertig) {
        try {
          var t = db.transaction(LAGER_FACH, "readwrite");
          t.objectStore(LAGER_FACH).put({ id: String(id), raum: raum || "",
                                          daten: String(daten), zeit: Date.now() });
          t.oncomplete = function () { fertig(true); };
          t.onerror = function () { fertig(false); };
          t.onabort = function () { fertig(false); };
        } catch (e) { fertig(false); }
      });
    });
  }

  /* Alles holen, was zu einer Liste von Kennungen im Lager liegt. */
  function lagerHolen(ids) {
    if (!ids || !ids.length) return Promise.resolve({});
    return lager().then(function (db) {
      if (!db) return {};
      return new Promise(function (fertig) {
        var raus = {};
        try {
          var t = db.transaction(LAGER_FACH, "readonly");
          var f = t.objectStore(LAGER_FACH);
          ids.forEach(function (id) {
            var a = f.get(String(id));
            a.onsuccess = function () { if (a.result && a.result.daten) raus[String(id)] = a.result.daten; };
          });
          t.oncomplete = function () { fertig(raus); };
          t.onerror = function () { fertig(raus); };
          t.onabort = function () { fertig(raus); };
        } catch (e) { fertig(raus); }
      });
    });
  }

  /* Das Lager darf nicht unbegrenzt wachsen. Was aelter ist als
     sechzig Tage, fliegt beim naechsten Betreten heraus. */
  var LAGER_FRIST_MS = 60 * 24 * 3600 * 1000;
  function lagerAufraeumen() {
    return lager().then(function (db) {
      if (!db) return;
      try {
        var t = db.transaction(LAGER_FACH, "readwrite");
        var i = t.objectStore(LAGER_FACH).index("zeit");
        var grenze = Date.now() - LAGER_FRIST_MS;
        var a = i.openCursor(IDBKeyRange.upperBound(grenze));
        a.onsuccess = function () {
          var c = a.result;
          if (!c) return;
          try { c.delete(); } catch (e) {}
          c.continue();
        };
      } catch (e) {}
    });
  }

  /* Die Bilder einer frisch geladenen Liste nachreichen. Liefert
     true, wenn wirklich etwas dazugekommen ist — dann lohnt ein
     neues Zeichnen. */
  function bilderNachreichen(liste) {
    var fehlen = (liste || []).filter(function (n) {
      return !n.bildImChat && (n.bildImLager || n.bildWeg);
    }).map(function (n) { return n.id; }).filter(function (x) { return x; });
    if (!fehlen.length) return Promise.resolve(false);
    return lagerHolen(fehlen).then(function (gefunden) {
      var etwas = false;
      liste.forEach(function (n) {
        var d = gefunden[String(n.id)];
        if (!d) return;
        n.bildImChat = d;
        n.bildWeg = false;
        etwas = true;
      });
      return etwas;
    });
  }

  /* --- Zuletzt benutzte Bilder ---------------------------------
     GEWUENSCHT: „Das System kann sich das gerne merken, diese
     Bilder, damit man die nicht immer wieder neu raussuchen muss."
     Gemerkt werden die letzten zwoelf — GIF-Adressen vollstaendig,
     Fotos als Datenadresse. Sie stehen im Bildwaehler ganz oben. */
  var LETZTE_SCHLUESSEL = "dma_livechat_letzte_bilder";
  var LETZTE_WIEVIEL = 12;
  function letzteBilder() {
    try {
      var l = JSON.parse(localStorage.getItem(LETZTE_SCHLUESSEL) || "[]");
      return Array.isArray(l) ? l.filter(function (x) { return typeof x === "string" && x; }) : [];
    } catch (e) { return []; }
  }
  function bildGemerkt(quelle) {
    var q = String(quelle || "");
    if (!q) return;
    var l = letzteBilder().filter(function (x) { return x !== q; });
    l.unshift(q);
    l = l.slice(0, LETZTE_WIEVIEL);
    try { localStorage.setItem(LETZTE_SCHLUESSEL, JSON.stringify(l)); }
    catch (e) {
      /* Kein Platz? Dann eben weniger merken, aber nicht gar nichts. */
      try { localStorage.setItem(LETZTE_SCHLUESSEL, JSON.stringify(l.slice(0, 4))); } catch (e2) {}
    }
  }
  function letzteBilderVergessen() {
    try { localStorage.removeItem(LETZTE_SCHLUESSEL); } catch (e) {}
  }

  function chatSchluessel(raum) { return "dma_livechat_chat_" + (raum || "-"); }
  function chatLaden(raum) {
    try {
      var l = JSON.parse(localStorage.getItem(chatSchluessel(raum)) || "[]");
      return Array.isArray(l) ? l.slice(-CHAT_VERLAUF) : [];
    } catch (e) { return []; }
  }
  /* Gesichert wird ZWEIGLEISIG: der Text in den localStorage, die
     Bilder ins Lager (IndexedDB). Im localStorage steht statt des
     Bildes nur noch der Haken bildImLager — beim naechsten Betreten
     holt bilderNachreichen() das Bild zurueck.

     Frueher stand hier ein Sparprogramm, das alles ausser den letzten
     sechs Bildern durch „Bild — nicht mehr gespeichert" ersetzt hat.
     Das war der gemeldete Fehler. Es gibt kein Sparprogramm mehr:
     das Lager hat Platz. */
  function chatSichern() {
    if (!zustand.raum) return;
    var liste = zustand.nachrichten.slice(-CHAT_VERLAUF);
    var raum = zustand.raum;
    var schlank = liste.map(function (n) {
      if (!n.bildImChat) return n;
      /* Ins Lager damit — und zwar jedes Mal, auch wenn es schon
         drinliegt: put() ueberschreibt, das kostet nichts. */
      lagerLegen(n.id, raum, n.bildImChat);
      var kopie = {};
      Object.keys(n).forEach(function (k) { kopie[k] = n[k]; });
      kopie.bildImChat = "";
      kopie.bildImLager = true;
      kopie.bildWeg = false;
      return kopie;
    });
    try {
      localStorage.setItem(chatSchluessel(raum), JSON.stringify(schlank));
    } catch (e) {
      /* Selbst ohne Bilder kein Platz mehr? Dann die Haelfte opfern,
         statt den ganzen Verlauf zu verlieren. */
      try {
        localStorage.setItem(chatSchluessel(raum),
          JSON.stringify(schlank.slice(-Math.ceil(CHAT_VERLAUF / 2))));
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
    var roh = String(adresse || "").trim();
    /* ACHTUNG, HIER LAG EIN FEHLER: hier stand slice(0, 600) für ALLES.
       Eine Netzadresse ist nie länger als das — eine Datenadresse
       dagegen IMMER. Ein Foto aus der Galerie wurde also brav
       verkleinert und dann nach 600 Zeichen abgeschnitten. Übrig blieb
       ein kaputtes Bild, und der Browser zeigte dafür sein
       Ersatzsymbol: „man kriegt nur diese Vorschaugrafiken angezeigt,
       dass da ein Bild sein soll, aber nicht das Bild selber."
       Datenadressen bekommen deshalb ihr eigenes, grosszügiges Mass. */
    var istDaten = /^data:image\//i.test(roh);
    var a = roh.slice(0, istDaten ? BILD_HOECHST : 600);
    if (a && !/^(https?:|data:image\/|emoji:)/i.test(a)) return false;
    zustand.ichBild = a;
    try {
      if (a) localStorage.setItem(BILD_SCHLUESSEL, a);
      else localStorage.removeItem(BILD_SCHLUESSEL);
    } catch (e) {}
    if (a && !/^emoji:/i.test(a)) bildGemerkt(a);   // „zuletzt benutzt"
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
  /* Je Leitung die beiden Spurplätze — einer für Ton, einer für Bild. */
  var spurenJe = {};

  function bruecke(anderId, alsAnrufer) {
    if (brueckeJe[anderId]) return brueckeJe[anderId];
    var pc = new RTCPeerConnection({ iceServers: VERMITTLER });
    brueckeJe[anderId] = pc;
    /* Der Platz muss existieren, BEVOR ein Bild eintrifft.
       Sonst kommt der Strom an und findet niemanden, dem er
       gehört — und der Kreis bleibt leer, obwohl die Verbindung
       steht. */
    personMerken(anderId);

    /* HIER LAG DER FEHLER, DER DIE GRUPPE ZERLEGT HAT.
       ---------------------------------------------------------
       GEMELDET: „Zwei andere im Raum hören sich gegenseitig, mich
       hören sie nicht und ich sie nicht. Und sehen tut niemand
       jemanden."

       Vorher wurden nur die Spuren angemeldet, die man GERADE hat.
       Seit die Kamera nicht mehr von selbst angeht, hat beim
       Betreten niemand eine Bildspur — also enthielt das Angebot
       gar keinen Platz für Bild. Und ein Platz, den es im Angebot
       nicht gibt, lässt sich nachträglich nicht befüllen: die
       Kamera einzuschalten blieb wirkungslos, bei allen, auf jedem
       Gerät. Genau deshalb sah niemand jemanden.

       Wer ganz ohne Mikrofon hereinkam, hatte auch keinen Tonplatz —
       und weil zwei Leute mit Mikrofon ihn untereinander sehr wohl
       hatten, hörten sich genau die beiden, und der Dritte war
       stumm. Auch das passt genau zur Beobachtung.

       Jetzt werden BEIDE Plätze immer angelegt, leer oder nicht.
       Kommt später eine Kamera dazu, wird die Spur in den
       vorhandenen Platz gelegt (replaceTrack) — ohne neue
       Aushandlung, ohne Abriss, und auf jedem Gerät gleich. */
    /* NUR DER ANRUFER legt die Plätze an.
       ---------------------------------------------------------
       Und das ist der zweite Fehler, der die Verbindung zwischen
       verschiedenen Geräten zerlegt hat: die annehmende Seite hat
       ihre Plätze AUCH angelegt, und zwar BEVOR sie das Angebot
       gelesen hat. Dann standen dort vier Plätze — zwei eigene und
       zwei aus dem Angebot —, die nicht zusammenpassten. Der
       Browser hat die Aushandlung dann abgebrochen oder eine
       Verbindung gebaut, in der die Spuren aneinander vorbeilaufen.
       Zwischen zwei gleichen Browsern fiel das nicht auf, zwischen
       Safari und Chrome sofort.

       Richtig ist: der Anrufer legt zwei Plätze an, der Angerufene
       übernimmt die Plätze aus dem Angebot und legt seine Spuren
       hinein (siehe spurenNachtragen unten). */
    if (alsAnrufer) plaetzeAnlegen(anderId, pc);

    pc.onicecandidate = function (e) {
      if (e.candidate) senden({ art: "kerze", an: anderId, kerze: alsDaten(e.candidate) });
    };
    /* Der Strom wird SELBST zusammengesetzt, Spur für Spur.
       Sich auf e.streams[0] zu verlassen geht schief, sobald die
       Gegenseite mit leeren Plätzen anfängt: dann gehört die Spur
       zu gar keinem Strom, und der Kreis bliebe leer. */
    pc.ontrack = function (e) {
      var p = zustand.leute[anderId];
      if (!p) return;
      if (!p.strom || !p.strom.addTrack) p.strom = new MediaStream();
      try {
        if (!p.strom.getTracks().some(function (t) { return t.id === e.track.id; })) {
          p.strom.addTrack(e.track);
        }
      } catch (x) {}
      e.track.onunmute = function () { melden(); };
      e.track.onended = function () { melden(); };
      melden();
    };
    pc.oniceconnectionstatechange = function () {
      /* „disconnected" ist oft nur ein Netzwechsel (WLAN auf Mobilfunk).
         Ein Neustart der Wegesuche holt die Leitung zurück, ohne alles
         abzureissen. */
      if (pc.iceConnectionState === "disconnected" && pc.restartIce) {
        try { pc.restartIce(); } catch (e) {}
      }
    };
    pc.onconnectionstatechange = function () {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        brueckeAbbauen(anderId);
        melden();
      }
    };
    return pc;
  }

  /* Zwei Plätze anlegen: einer für Ton, einer für Bild — auch wenn
     wir gerade nichts zu senden haben. Ein Platz, den es im Angebot
     nicht gibt, lässt sich später nicht mehr befüllen. */
  function plaetzeAnlegen(anderId, pc) {
    var strom = zustand.eigenerStrom;
    var tonSpur = (strom && strom.getAudioTracks()[0]) || null;
    var bildSpur = (strom && strom.getVideoTracks()[0]) || null;
    var stroeme = strom ? [strom] : [];
    try {
      spurenJe[anderId] = {
        ton: tonSpur ? pc.addTransceiver(tonSpur, { direction: "sendrecv", streams: stroeme })
                     : pc.addTransceiver("audio", { direction: "sendrecv" }),
        bild: bildSpur ? pc.addTransceiver(bildSpur, { direction: "sendrecv", streams: stroeme })
                       : pc.addTransceiver("video", { direction: "sendrecv" })
      };
    } catch (e) {
      spurenJe[anderId] = null;
      if (strom) strom.getTracks().forEach(function (t) {
        try { pc.addTrack(t, strom); } catch (x) {}
      });
    }
  }

  /* Die annehmende Seite: das Angebot hat die Plätze mitgebracht.
     Hier werden nur noch die eigenen Spuren hineingelegt und die
     Richtung auf „senden und empfangen" gestellt. */
  function spurenNachtragen(anderId, pc) {
    var strom = zustand.eigenerStrom;
    var tonSpur = (strom && strom.getAudioTracks()[0]) || null;
    var bildSpur = (strom && strom.getVideoTracks()[0]) || null;
    var satz = { ton: null, bild: null };
    try {
      pc.getTransceivers().forEach(function (tr) {
        var kind = (tr.receiver && tr.receiver.track && tr.receiver.track.kind)
                || (tr.sender && tr.sender.track && tr.sender.track.kind) || "";
        if (!kind && tr.mid !== null && tr.mid !== undefined) {
          /* Manche Browser sagen die Art erst nach dem Aushandeln.
             Dann hilft die Reihenfolge: erst Ton, dann Bild. */
          kind = satz.ton ? "video" : "audio";
        }
        if (kind === "audio" && !satz.ton) {
          satz.ton = tr;
          if (tonSpur) { try { tr.sender.replaceTrack(tonSpur); } catch (e) {} }
        } else if (kind === "video" && !satz.bild) {
          satz.bild = tr;
          if (bildSpur) { try { tr.sender.replaceTrack(bildSpur); } catch (e) {} }
        }
        try { tr.direction = "sendrecv"; } catch (e) {}
      });
    } catch (e) {}
    spurenJe[anderId] = satz;
  }

  /* Eine neue Spur in den vorhandenen Platz legen — für alle Leitungen.
     Das ist der ganze Trick, mit dem die Kamera später dazukommt. */
  function spurTauschen(art, spur) {
    Object.keys(brueckeJe).forEach(function (id) {
      var s = spurenJe[id];
      if (!s || !s[art] || !s[art].sender) return;
      try { s[art].sender.replaceTrack(spur || null); } catch (e) {}
    });
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
    delete spurenJe[id];
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
    var pc = bruecke(anderId, true);
    return pc.createOffer().then(function (angebot) {
      return pc.setLocalDescription(angebot).then(function () {
        senden({ art: "angebot", an: anderId, name: zustand.ichName, beschreibung: alsDaten(pc.localDescription) });
      });
    }).catch(function () {});
  }

  function angebotAnnehmen(vonId, beschreibung) {
    var pc = bruecke(vonId, false);
    return pc.setRemoteDescription(new RTCSessionDescription(beschreibung))
      .then(function () { spurenNachtragen(vonId, pc); return pc.createAnswer(); })
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
      /* Ein „hallo" von jemandem, den wir schon kennen, heisst: der
         hat gerade neu angefangen (Neuladen, Gerätewechsel). Seine
         alte Leitung ist damit tot — sie muss weg, sonst antwortet
         bruecke() gleich mit der Leiche, und die Verbindung kommt
         nie wieder zustande. Genau daran hing das „ich höre die
         beiden nicht". */
      if (brueckeJe[n.von]) brueckeAbbauen(n.von);
      /* Abgeschlossener Raum: wer nicht auf der Einladungsliste steht,
         kommt nicht herein. So steht es in RFC 2811 für +i — „new
         members are only accepted if they have been invited by a
         channel operator". Ohne Server muss der Häuptling das
         durchsetzen; er ist die einzige Stelle, die die Liste kennt. */
      if (zustand.haeuptling && zustand.abgeschlossen && !zustand.eingeladen[n.von]) {
        postSenden(n.von, { art: "abgewiesen", raum: zustand.raum });
        return;
      }
      /* Jemand ist gekommen. Zurückgrüssen, damit er uns auch
         kennt — der Gruss allein sagt ihm nur, dass wir da sind. */
      var warSchonDa = Boolean(zustand.leute[n.von]);
      personMerken(n.von, n.name, n.bild);
      if (!warSchonDa) kommtUndGeht(n.name || "Jemand", true);
      senden({ art: "auch-da", an: n.von, name: zustand.ichName, tonAn: zustand.tonAn,
               bildAn: zustand.bildAn, bild: zustand.ichBild, farbe: zustand.farbe,
               haeuptling: zustand.haeuptling, thema: zustand.thema,
               abgeschlossen: zustand.abgeschlossen });
      /* DEN VERLAUF NACHREICHEN.
         ---------------------------------------------------------
         GEMELDET: „Immer wenn ich das ausprobiere, sehen die Leute
         nichts weiter als das, was sie gerade neu schreiben."

         Die Tabelle allein reicht dafür nicht: sie braucht eine
         Anmeldung, und ein Gast hat keine. Also macht es der Raum
         selbst — so wie es ein Chatserver auch täte. Wer schon
         drin ist, schickt dem Neuen seinen Verlauf; der Neue führt
         ihn mit dem zusammen, was er selbst hat. Damit nicht alle
         gleichzeitig antworten, wartet jeder eine kurze,
         unterschiedlich lange Weile — wer die kleinste Kennung hat,
         ist zuerst dran, und die anderen sehen, dass es schon
         geschehen ist. */
      verlaufNachreichen(n.von);
      /* Wer die kleinere Kennung hat, ruft an. */
      if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
      melden();
      return;
    }
    if (n.art === "auch-da") {
      var neuHier = !zustand.leute[n.von];
      personMerken(n.von, n.name, n.bild);
      if (neuHier) kommtUndGeht(n.name || "Jemand", true);
      if (typeof n.haeuptling === "boolean") zustand.leute[n.von].haeuptling = n.haeuptling;
      if (typeof n.thema === "string" && n.thema) zustand.thema = n.thema;
      if (typeof n.abgeschlossen === "boolean") zustand.abgeschlossen = n.abgeschlossen;
      if (typeof n.farbe === "string") zustand.leute[n.von].farbe = n.farbe;
      if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
      if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
      if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
      melden();
      return;
    }
    if (n.art === "tschuess") {
      if (zustand.leute[n.von]) kommtUndGeht(zustand.leute[n.von].name || "Jemand", false);
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
    if (n.art === "umzug") {
      /* Jemand hat eine eigene Ecke aufgemacht. Merken, damit
         „/folge Name" weiss, wohin. */
      if (n.name && n.raum) {
        raeumeVonAnderen[String(n.name).toLowerCase()] = String(n.raum);
        nachrichtAnhaengen({
          id: "u" + n.raum + n.von,
          von: n.von, name: n.name, art: "system",
          text: n.name + " hat die Ecke „" + (n.wie || n.raum) + "“ aufgemacht — "
              + "mit  /folge " + n.name + "  kommst du mit.",
          zeit: Date.now(), eigen: false, bild: n.bild || ""
        });
        melden();
      }
      return;
    }
    if (n.art === "verlauf") {
      if (verlaufBekommen) return;          // einmal genügt
      verlaufBekommen = true;
      var dazu = (n.zeilen || []).map(function (z) {
        z.eigen = z.von === zustand.ichId;
        return z;
      });
      zustand.nachrichten = verschmelzen(dazu, zustand.nachrichten);
      chatSichern();
      melden();
      return;
    }
    if (n.art === "thema") {
      zustand.thema = String(n.thema || "").slice(0, 120);
      melden();
      return;
    }
    if (n.art === "rang") {
      if (n.an === zustand.ichId) {
        zustand.haeuptling = Boolean(n.haeuptling);
        melden();
      } else if (zustand.leute[n.an]) {
        zustand.leute[n.an].haeuptling = Boolean(n.haeuptling);
        melden();
      }
      return;
    }
    if (n.art === "stumm") {
      if (zustand.leute[n.von]) {
        if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
        if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
        if (typeof n.bild === "string") zustand.leute[n.von].bild = n.bild;
        if (typeof n.farbe === "string") zustand.leute[n.von].farbe = n.farbe;
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
        art: n.chatArt || "text",
        wirkung: n.wirkung || "",
        farbe: n.farbe || (zustand.leute[n.von] && zustand.leute[n.von].farbe) || "",
        bildImChat: typeof n.bildImChat === "string" ? n.bildImChat.slice(0, 200000) : ""
      });
      melden();
      return;
    }
  }

  /* „XanderFox betritt den Raum" / „… hat den Raum verlassen".
     So war es im IRC (JOIN und PART sehen alle im Raum) und so war es
     in jedem Webchat der Zeit. */
  function kommtUndGeht(name, kommt) {
    nachrichtAnhaengen({
      id: "kg" + Date.now() + "-" + (laufendeNummer += 1),
      von: "", name: name, art: "kommen",
      text: name + (kommt ? " betritt den Raum." : " hat den Raum verlassen."),
      zeit: Date.now(), eigen: false, kommt: Boolean(kommt)
    });
  }

  /* Den eigenen Verlauf an eine Person schicken. Bilder werden dabei
     weggelassen, wenn es zu viel würde — ein Kanalpaket ist begrenzt,
     und ein Verlauf mit zwanzig Fotos passt nicht hinein. Der TEXT
     kommt immer vollständig an. */
  var VERLAUF_PAKET = 140000;
  function verlaufNachreichen(anId) {
    if (!zustand.nachrichten.length) return;
    /* Wer die kleinste Kennung hat, schickt zuerst — die anderen
       sehen die Antwort und lassen es bleiben. */
    var vorsprung = 250 + Math.min(1400, zustand.ichId.charCodeAt(0) % 7 * 180);
    setTimeout(function () {
      if (verlaufSchonGeschickt[anId]) return;
      verlaufSchonGeschickt[anId] = true;
      var liste = zustand.nachrichten.filter(function (n) {
        return n.art !== "fluester" && n.art !== "system" && n.art !== "kommen";
      }).slice(-CHAT_VERLAUF);
      var paket = liste.map(function (n) {
        return { id: n.id, von: n.von, name: n.name, text: n.text, art: n.art || "text",
                 bild: n.bild || "", bildImChat: n.bildImChat || "", farbe: n.farbe || "",
                 wirkung: n.wirkung || "", zeit: n.zeit };
      });
      /* Zu gross? Dann die Bilder herausnehmen, aeltester zuerst. */
      while (JSON.stringify(paket).length > VERLAUF_PAKET) {
        var raus = paket.findIndex(function (n) { return n.bildImChat; });
        if (raus < 0) { paket = paket.slice(-20); break; }
        paket[raus].bildImChat = "";
        paket[raus].bildWeg = true;
      }
      senden({ art: "verlauf", an: anId, zeilen: paket });
    }, vorsprung);
  }
  var verlaufSchonGeschickt = {};

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
      neu[schluessel] = { name: e.name || "", raum: e.raum || "",
                          zu: Boolean(e.zu), seit: e.seit || 0 };
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

  /* Die Präsenz trägt den RAUM mit. Nur so kann „/f Nickname" dorthin
     führen, wo die Person GERADE ist — und nicht in einen leeren Raum,
     den sie vor zehn Minuten einmal aufgemacht hat. Genau das war
     gemeldet: „dann komme ich in ihren alten Raum und nicht in meinen,
     wo sie auf mich wartet." */
  function praesenzSetzen(drin, name) {
    if (!praesenzKanal) return;
    try {
      if (drin) praesenzKanal.track({ name: name || zustand.ichName || "",
                                      raum: zustand.raum || "",
                                      zu: Boolean(zustand.abgeschlossen),
                                      seit: Date.now() });
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
    kontoId = String(o.konto || "");
    zustand.ichId = eigeneId();
    zustand.ichName = o.name || "Gast";
    zustand.lage = "verbindet";
    zustand.fehler = "";
    zustand.ichBild = o.bild || bildLaden();
    zustand.farbe = o.farbe || zustand.farbe || gemerkteFarbe();
    zustand.schrift = gemerkteSchrift();
    zustand.thema = "";
    zustand.haeuptling = false;
    zustand.abgeschlossen = false;
    zustand.eingeladen = {};
    zustand.geknebelt = {};
    verlaufBekommen = false;
    verlaufSchonGeschickt = {};
    /* Der Verlauf aus diesem Raum wird MITGEBRACHT, nicht
       weggeworfen — man soll nachlesen können, was geschrieben
       wurde, auch nach dem Neuladen und nach dem Wiederkommen. */
    zustand.nachrichten = chatLaden(zustand.raum);
    melden();
    /* Die Bilder liegen nicht im localStorage, sondern im Lager.
       Sie kommen gleich hinterher — ohne dass das Betreten wartet. */
    bilderNachreichen(zustand.nachrichten).then(function (etwas) {
      if (etwas) melden();
    });
    lagerAufraeumen();
    /* Den gemeinsamen Verlauf nachladen — er kommt gleich dazu, ohne
       dass das Betreten darauf warten muss. */
    serverLaden(zustand.raum).then(function (vomServer) {
      if (!vomServer.length) return;
      vomServer.forEach(function (n) { n.eigen = n.von && n.von === zustand.ichId; });
      zustand.nachrichten = verschmelzen(vomServer, zustand.nachrichten);
      chatSichern();
      melden();
      /* Was vom Server kam, kann Bilder haben, die hier noch fehlen —
         und was hier lag, kann Bilder haben, die der Server nicht
         kennt. Beides zusammenfuehren, dann ist der Verlauf komplett. */
      bilderNachreichen(zustand.nachrichten).then(function (etwas) {
        if (etwas) melden();
      });
    });

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
            postKanalOeffnen();
            /* WER IST HÄUPTLING?
               Nach RFC 2811 „besitzen" die Operatoren den Kanal, und
               der Rang gilt nur, solange man drin ist: wer geht,
               verliert ihn; wer einen leeren Kanal betritt, bekommt
               ihn. Genau so ist es hier. Deshalb wird erst nach der
               Begrüssungsrunde entschieden — vorher weiss man ja
               nicht, ob schon jemand da ist. */
            setTimeout(function () {
              if (zustand.lage !== "drin") return;
              if (zustand.raum === HAUPTRAUM) return;
              if (Object.keys(zustand.leute).length === 0 && !zustand.haeuptling) {
                zustand.haeuptling = true;
                systemZeile("Der Raum war leer — du bist hier Häuptling. "
                  + "/t Thema · /i Nickname einladen · /lock abschließen · /k Nickname");
              }
            }, 1600);
            praesenzZuhoeren(kontoId || zustand.ichId);
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
      /* Erst abmelden, DANN den Kanal schliessen — und zwar mit einem
         Atemzug dazwischen. Vorher wurde der Kanal sofort geschlossen,
         das „tschüss" ging dabei manchmal verloren, und man stand für
         die anderen weiter im alten Raum herum. Genau das war die
         gemeldete Karteileiche im Klassenzimmer. */
      var alterKanal = kanal;
      senden({ art: "tschuess" });
      kanal = null;
      setTimeout(function () { try { alterKanal.unsubscribe(); } catch (e) {} }, 350);
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
    var spuren = zustand.eigenerStrom ? zustand.eigenerStrom.getAudioTracks() : [];
    if (!spuren.length) return mikrofonDazuholen();
    zustand.tonAn = !zustand.tonAn;
    spuren.forEach(function (t) { t.enabled = zustand.tonAn; });
    senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn, bild: zustand.ichBild });
    melden();
    return Promise.resolve(true);
  }

  /* Wer beim Betreten kein Mikrofon erlaubt hat, kann es hier
     nachholen — derselbe Weg wie bei der Kamera, ohne Abriss. */
  function mikrofonDazuholen() {
    if (zustand.lage !== "drin") return Promise.resolve(false);
    return navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    }).then(function (nurTon) {
      var spur = nurTon.getAudioTracks()[0];
      if (!spur) return false;
      if (!zustand.eigenerStrom || !zustand.eigenerStrom.addTrack) {
        zustand.eigenerStrom = new MediaStream();
      }
      zustand.eigenerStrom.getAudioTracks().forEach(function (t) {
        try { t.stop(); zustand.eigenerStrom.removeTrack(t); } catch (e) {}
      });
      zustand.eigenerStrom.addTrack(spur);
      zustand.tonAn = true;
      zustand.kameraFehler = "";
      spurTauschen("ton", spur);
      senden({ art: "stumm", tonAn: true, bildAn: zustand.bildAn, bild: zustand.ichBild });
      melden();
      return true;
    }).catch(function (e) {
      zustand.kameraFehler = medienFehler(e);
      melden();
      return false;
    });
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
    var spuren = zustand.eigenerStrom ? zustand.eigenerStrom.getVideoTracks() : [];
    if (spuren.length) {
      /* AUS heisst wirklich aus: die Spur wird abgegeben und die
         Kamera abgeschaltet (das Lämpchen geht aus). Nur „enabled =
         false" liesse die Kamera weiterlaufen, und der andere sähe
         ein schwarzes Bild statt des Profilbilds. */
      spuren.forEach(function (t) {
        try { t.stop(); zustand.eigenerStrom.removeTrack(t); } catch (e) {}
      });
      spurTauschen("bild", null);
      zustand.bildAn = false;
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: false, bild: zustand.ichBild });
      melden();
      return Promise.resolve(true);
    }
    return kameraDazuholen();
  }

  /* Die Kamera kommt dazu, OHNE die Leitungen abzureissen.
     Der Platz für Bild ist von Anfang an da (siehe bruecke()); hier
     wird nur die Spur hineingelegt. Das geht auf jedem Gerät gleich
     und dauert keine Sekunde — vorher wurde alles neu aufgebaut, und
     bei drei Leuten im Raum ging dabei regelmässig etwas verloren. */
  function kameraDazuholen() {
    if (zustand.lage !== "drin") return Promise.resolve(false);
    return navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 480 }, height: { ideal: 480 }, facingMode: "user" }
    }).then(function (nurBild) {
      var spur = nurBild.getVideoTracks()[0];
      if (!spur) return false;
      if (!zustand.eigenerStrom || !zustand.eigenerStrom.addTrack) {
        zustand.eigenerStrom = new MediaStream();
      }
      /* eine eventuell vorhandene alte Bildspur ablösen */
      zustand.eigenerStrom.getVideoTracks().forEach(function (t) {
        try { t.stop(); zustand.eigenerStrom.removeTrack(t); } catch (e) {}
      });
      zustand.eigenerStrom.addTrack(spur);
      zustand.bildAn = true;
      zustand.kameraFehler = "";
      spurTauschen("bild", spur);
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: true, bild: zustand.ichBild });
      melden();
      return true;
    }).catch(function (e) {
      zustand.kameraFehler = medienFehler(e);
      melden();
      return false;
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

  function bildVerkleinern(datei, kante) {
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
          var k = Math.min(1, (kante || BILD_KANTE) / Math.max(bild.width, bild.height));
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
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: String(text || "").slice(0, CHAT_LAENGE),
      bildImChat: String(quelle || ""),
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe
    };
    if (!n.bildImChat) return false;
    bildGemerkt(n.bildImChat);          // fuer „zuletzt benutzt" im Waehler
    nachrichtAnhaengen(n);
    serverSichern(n);
    senden({ art: "text", id: n.id, name: n.name, text: n.text, zeit: n.zeit,
             bild: zustand.ichBild, farbe: zustand.farbe, bildImChat: n.bildImChat });
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

  /* =========================================================
     DIE CHATBEFEHLE
     ---------------------------------------------------------
     GEWÜNSCHT: „Ich möchte solche Funktionen haben wie früher im
     Chat üblich waren. /me, dass man schreien kann, dass man eine
     einzelne Person anflüstern kann und das sehen nur die beiden.
     Und dass man aus dem Raum heraus einen eigenen Raum erzeugt
     und jemand anders dieser Person folgen kann — so wie früher
     bei Kieler Hut."

     Alles mit demselben Muster: ein Schrägstrich, ein Wort, der
     Rest ist Text. Was nicht erkannt wird, geht als ganz normale
     Nachricht raus — so verschwindet nichts, nur weil jemand
     einen Schrägstrich tippt.
     ========================================================= */
  /* -------------------------------------------------------------
     DIE BEFEHLE — so kurz wie damals
     -------------------------------------------------------------
     Das System heisst SLASH-BEFEHLE und kommt aus dem IRC (Internet
     Relay Chat, 1988; festgeschrieben in RFC 1459 und RFC 2812).
     Die deutschen Webchats der Neunziger und Zweitausender — Kilahu,
     Webkicks, spin.de, Knuddels, Chatterzone — haben diesen Satz
     uebernommen und um eigene Sachen ergaenzt.

     Belegt und hier uebernommen:
       /me   Aktion, kursiv, ohne Doppelpunkt hinter dem Namen
       /s    schreien: der Text wird in Grossbuchstaben ausgegeben
       /w    fluestern (auch /msg, /m) — nur der Empfaenger sieht es
       /j    einen Raum betreten oder anlegen (join)
       /i    jemanden einladen (invite). WICHTIG, und so war es im
             IRC auch: eine Einladung ist KEINE Anfrage mit Ja/Nein.
             Sie schaltet den Raum fuer die Person frei und schickt
             ihr eine Nachricht — hineingehen muss sie selbst.
       /k    rausschmeissen (kick), /op und /deop fuer die Rechte
       /n    wer ist hier (names), /l welche Raeume es gibt (list)
       /t    das Thema des Raums (topic)
       /h    die Hilfe
     Von Kilahu: jeder, der einen Raum aufmacht, ist dort HAEUPTLING
     und darf knebeln, rausschmeissen und den Raum abschliessen.

     Und: Zeichen wie &hearts; sind keine Befehle, sondern
     HTML-Entitaeten. In den alten Chats lief der Text durch den
     HTML-Aufbereiter, deshalb wurde daraus ein echtes Zeichen — ein
     Unicode-Herz, kein Emoji. Genau so ist es hier wieder.
     ------------------------------------------------------------- */
  /* =========================================================
     ASCII-KUNST
     ---------------------------------------------------------
     Bilder aus Buchstaben, wie sie in den Neunzigern durch jeden
     Chat gingen. Sie stehen hier als gewöhnlicher Text — beim
     Zeichnen kommen sie in eine Schreibmaschinenschrift, in der
     jedes Zeichen gleich breit ist. Ohne das zerfallen sie.
     ========================================================= */
  /* =========================================================
     ASCII-KUNST
     ---------------------------------------------------------
     GEWÜNSCHT: „/lach soll richtige ASCII-Kunst benutzen."

     Damals war das der ganze Zauber: der Chat konnte nur Buchstaben,
     also hat man Bilder AUS Buchstaben gebaut. Sie stehen hier
     zeilenweise, damit man beim Nachbessern sieht, was man tut; beim
     Zeichnen kommen sie in eine Schrift, in der jedes Zeichen gleich
     breit ist. Ohne die zerfaellt jedes dieser Bilder.
     ========================================================= */
  var ASCII = {
    lachen:
      ["   .-\"\"\"\"\"-.",
       "  /  ^   ^  \\",
       " |     v     |",
       " |  \\_____/  |",
       "  \\         /",
       "   '-.....-'",
       "    HA HA HA!   %NAME%"].join("\n"),
    herz:
      ["   ,d88b.d88b,",
       "   88888888888",
       "   `Y8888888Y'",
       "     `Y888Y'",
       "       `Y'      von %NAME%"].join("\n"),
    daumen:
      ["      _",
       "     | |",
       "     | |__",
       "     |    |",
       "  ___|    |",
       " |        |",
       " |        |   %NAME% findet das gut",
       " |________|"].join("\n"),
    blume:
      ["      .--.",
       "     ( () )",
       "      `--'",
       "        |",
       "       \\|/      f\u00fcr dich, von %NAME%",
       "        |"].join("\n"),
    kaffee:
      ["      ) )",
       "     ( (",
       "   .-------.",
       "   |       |]",
       "   \\       /     %NAME% kocht Kaffee",
       "    `-----'"].join("\n"),
    achtung:
      ["     /\\",
       "    /  \\",
       "   /  ! \\",
       "  /______\\    sagt %NAME%"].join("\n"),
    katze:
      ["  /\\_/\\",
       " ( o.o )",
       "  > ^ <      miau, sagt %NAME%"].join("\n"),
    fuchs:
      ["  |\\   /|",
       "  | \\_/ |",
       " ( o   o )",
       "  \\  ^  /     %NAME%",
       "   '''''"].join("\n"),
    traurig:
      ["   .-\"\"\"\"\"-.",
       "  /  .   .  \\",
       " |     v     |",
       " |   .---.   |",
       "  \\  \\___/  /    hmpf, sagt %NAME%",
       "   '-.....-'"].join("\n")
  };

  var BEFEHLE = [
    { w: "me",      kurz: "",     nutzt: "/me <was du tust>",   was: "Aktion: „Emmy lacht laut“ — kursiv, ohne Doppelpunkt" },
    { w: "me/",     kurz: "",     nutzt: "… /me/ …",            was: "Mitten im Satz: wird durch deinen Namen ersetzt" },
    { w: "s",       kurz: "shout",nutzt: "/s <text>",           was: "Schreien — GROSS, mit Wucht" },
    { w: "w",       kurz: "msg",  nutzt: "/w <name> <text>",    was: "Flüstern — nur ihr beide seht es, auch über Räume hinweg" },
    { w: "j",       kurz: "join", nutzt: "/j <raum>",           was: "Raum betreten — gibt es ihn nicht, machst du ihn auf" },
    { w: "i",       kurz: "invite", nutzt: "/i <name>",         was: "Einladen — die Person bekommt eine Zeile und kommt selbst" },
    { w: "f",       kurz: "follow", nutzt: "/f <name>",         was: "Folgen — dorthin, wo die Person GERADE ist" },
    { w: "n",       kurz: "names",nutzt: "/n",                  was: "Wer ist hier?" },
    { w: "l",       kurz: "list", nutzt: "/l",                  was: "Welche Räume sind gerade offen?" },
    { w: "t",       kurz: "topic",nutzt: "/t <text>",           was: "Thema des Raums setzen" },
    { w: "lock",    kurz: "",     nutzt: "/lock",               was: "Raum abschließen — nur Eingeladene kommen herein" },
    { w: "unlock",  kurz: "",     nutzt: "/unlock",             was: "Raum wieder öffnen" },
    { w: "op",      kurz: "",     nutzt: "/op <name>",          was: "Macht die Person zum Häuptling" },
    { w: "deop",    kurz: "",     nutzt: "/deop <name>",        was: "Nimmt die Häuptlingsrechte wieder" },
    { w: "k",       kurz: "kick", nutzt: "/k <name>",           was: "Rausschmeißen (nur Häuptling)" },
    { w: "knebel",  kurz: "",     nutzt: "/knebel <name>",      was: "Stummschalten (nur Häuptling)" },
    { w: "entknebel", kurz: "",   nutzt: "/entknebel <name>",   was: "Wieder sprechen lassen" },
    { w: "lach",    kurz: "lol",  nutzt: "/lach",               was: "Lachen — mit einem Gesicht aus Buchstaben" },
    { w: "ascii",   kurz: "",     nutzt: "/ascii <was>",        was: "Ein Bild aus Buchstaben: lachen, herz, daumen, blume, kaffee, achtung, katze, fuchs" },
    { w: "herz",    kurz: "",     nutzt: "/herz <name>",        was: "Ein Herz schicken (geht auch als &hearts; mitten im Text)" },
    { w: "drueck",  kurz: "hug",  nutzt: "/drueck <name>",      was: "Jemanden drücken" },
    { w: "konfetti", kurz: "party", nutzt: "/konfetti",          was: "Konfetti — fliegt durch den ganzen Raum, bei allen" },
    { w: "ballon",  kurz: "geburtstag", nutzt: "/ballon <name>", was: "Luftballons steigen auf — zum Geburtstag" },
    { w: "schrift", kurz: "font", nutzt: "/schrift <nummer>",    was: "Die Schrift im Chat: 1 klassisch, 2 Schreibmaschine, 3 rund, 4 gross" },
    { w: "c",       kurz: "color",nutzt: "/c <farbe>",          was: "Deine Schriftfarbe: rot, blau, gruen, gelb, lila, tuerkis, bunt" },
    { w: "leave",   kurz: "part", nutzt: "/leave",              was: "Zurück ins Klassenzimmer" },
    { w: "h",       kurz: "help", nutzt: "/h",                  was: "Diese Liste" }
  ];
  function befehlsliste() {
    return BEFEHLE.map(function (b) {
      return { nutzt: b.nutzt, was: b.was, kurz: b.kurz };
    });
  }

  /* --- HTML-Entitäten wie damals -------------------------------
     &hearts; wird ♥, nicht ❤️. Das ist der Unterschied, um den es
     geht: ein Schriftzeichen, kein Bild. */
  var ENTITAETEN = {
    hearts: "\u2665", heart: "\u2665", diams: "\u2666", clubs: "\u2663", spades: "\u2660",
    star: "\u2606", starf: "\u2605", sun: "\u263c", moon: "\u263d", phone: "\u260e",
    smile: "\u263a", frown: "\u2639", note: "\u266a", notes: "\u266b", flat: "\u266d",
    sharp: "\u266f", check: "\u2713", cross: "\u2717", larr: "\u2190", rarr: "\u2192",
    uarr: "\u2191", darr: "\u2193", harr: "\u2194", infin: "\u221e", ne: "\u2260",
    le: "\u2264", ge: "\u2265", plusmn: "\u00b1", times: "\u00d7", divide: "\u00f7",
    deg: "\u00b0", sect: "\u00a7", para: "\u00b6", dagger: "\u2020", Dagger: "\u2021",
    bull: "\u2022", hellip: "\u2026", trade: "\u2122", copy: "\u00a9", reg: "\u00ae",
    euro: "\u20ac", laquo: "\u00ab", raquo: "\u00bb", mdash: "\u2014", ndash: "\u2013",
    frac12: "\u00bd", frac14: "\u00bc", micro: "\u00b5", permil: "\u2030", lozf: "\u29eb",
    loz: "\u25ca", squf: "\u25aa", male: "\u2642", female: "\u2640", umbrella: "\u2602",
    snowman: "\u2603", coffee: "\u2615", scissors: "\u2702", pencil: "\u270e",
    hand: "\u261e", peace: "\u262e", yinyang: "\u262f", anchor: "\u2693",
    flag: "\u2691", crown: "\u265b", chess: "\u265e", dice: "\u2680"
  };
  function entitaetenSetzen(text) {
    return String(text).replace(/&([A-Za-z][A-Za-z0-9]{1,10});/g, function (ganz, name) {
      if (Object.prototype.hasOwnProperty.call(ENTITAETEN, name)) return ENTITAETEN[name];
      return ganz;
    });
  }

  /* --- Der alte Trick: /me/ mitten im Satz ----------------------
     „Wir haben den Namen von Emmy benutzt und dann geschrieben
      ‚denkt, dass /me/ cool ist‘ — die anderen dachten, sie hätte
      das selbst geschrieben."
     Dafür muss /me/ IM Text stehen bleiben dürfen und durch den
     eigenen Namen ersetzt werden. */
  /* --- „/me/" mitten im Satz ------------------------------------
     GEWÜNSCHT, wörtlich: „Das /me hat meinen Namen genommen und ihn
     einfach an eine Stelle meiner Wahl gerückt … also könnte man rein
     technisch gesehen schreiben: Emmy: /me/ ist cool … Dazu muss die
     Schrift aber auch ein bisschen dicker sein, dass sie ungefähr so
     dick ist wie der Name selber."

     Zwei Dinge gehören also dazu, und beide haben gefehlt:
       • die Zeile bekommt KEIN „Name:" davor — der Name steht ja
         schon mittendrin, sonst stünde er zweimal da;
       • der eingesetzte Name ist so kräftig gesetzt wie ein Nick.

     Markiert wird er mit zwei Steuerzeichen, die in keiner Tastatur
     vorkommen (U+0001 und U+0002). Sie tragen keine Auszeichnung mit
     sich — die Zeile wird beim Zeichnen weiterhin Stück für Stück
     über textContent gebaut, es kann also nichts Fremdes in die Seite
     gelangen. Sie sagen nur: hier steht ein Name. */
  var NAME_AUF = "\u0001", NAME_ZU = "\u0002";
  function eigennamenSetzen(text) {
    return String(text).replace(/\/me\//g, NAME_AUF + zustand.ichName + NAME_ZU);
  }
  /* Enthält eine Zeile den alten Trick? Dann ist sie eine Aktion und
     bekommt keinen Absender vorangestellt. */
  function hatEigennamen(text) {
    return /\/me\//.test(String(text || ""));
  }

  function textAufbereiten(text) {
    return entitaetenSetzen(eigennamenSetzen(text));
  }

  /* Wer heisst wie? Die Namen im Raum, damit /w Alex den richtigen
     findet — gross oder klein geschrieben, egal. */
  function personNachName(name) {
    var k = String(name || "").trim().toLowerCase();
    if (!k) return null;
    var ids = Object.keys(zustand.leute);
    for (var i = 0; i < ids.length; i++) {
      var p = zustand.leute[ids[i]];
      if (String(p.name || "").toLowerCase() === k) return p;
    }
    for (var j = 0; j < ids.length; j++) {
      var q = zustand.leute[ids[j]];
      if (String(q.name || "").toLowerCase().indexOf(k) === 0) return q;
    }
    return null;
  }

  /* Die Kennung MUSS eindeutig sein. Aus Zeit + eigener Kennung
     allein war sie das nicht: zwei Zeilen in derselben Millisekunde
     bekamen dieselbe, und die zweite wurde als Doppelte verworfen.
     Beim schnellen Tippen und bei Befehlen hintereinander verschwand
     dadurch stillschweigend Text. */
  var laufendeNummer = 0;
  function neueNachrichtId() {
    laufendeNummer += 1;
    return String(Date.now()) + "-" + laufendeNummer + "-" + zustand.ichId;
  }

  function eigeneZeile(art, text, an) {
    var n = {
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: text, art: art, zeit: Date.now(), eigen: true,
      bild: zustand.ichBild, farbe: zustand.farbe, an: an || ""
    };
    nachrichtAnhaengen(n);
    return n;
  }

  /* Eine Zeile, die nur ich sehe (Antworten des Systems). */
  function systemZeile(text) {
    eigeneZeile("system", text);
    melden();
    return true;
  }

  function anAlle(art, text, zusatz) {
    var n = eigeneZeile(art, text);
    if (zusatz && zusatz.wirkung) n.wirkung = zusatz.wirkung;
    serverSichern({ name: n.name, bild: n.bild, text: text, art: art });
    var post = { art: "text", id: n.id, name: n.name, text: text, zeit: n.zeit,
                 bild: zustand.ichBild, chatArt: art, farbe: zustand.farbe };
    if (zusatz) Object.keys(zusatz).forEach(function (k) { post[k] = zusatz[k]; });
    senden(post);
    melden();
    return true;
  }

  /* =========================================================
     DER FLÜSTERKANAL
     ---------------------------------------------------------
     Flüstern soll RAUMÜBERGREIFEND gehen: „Emmy ist mit jemand
     anderem in einem anderen Raum, und ich möchte ihr etwas
     zuflüstern."

     Der Raumkanal reicht dafür nicht — er endet am Raum. Jede
     Person hat deshalb einen EIGENEN Kanal, dessen Name ihre
     Kennung trägt. Wer flüstert, schickt auf den Kanal des
     Empfängers; niemand sonst hört dort mit. Dasselbe gilt für
     Einladungen, die ja auch in einen anderen Raum gehen.
     ========================================================= */
  var postKanal = null;
  function postKanalOeffnen() {
    if (postKanal || !zustand.ichId) return;
    var k = klient();
    if (!k) return;
    postKanal = k.channel("dma-post-" + zustand.ichId, { config: { broadcast: { self: false } } });
    postKanal.on("broadcast", { event: "post" }, function (m) { postEmpfangen(m && m.payload); });
    postKanal.subscribe(function () {});
  }
  function postSenden(anId, nutzlast) {
    var k = klient();
    if (!k || !anId) return;
    nutzlast.von = zustand.ichId;
    nutzlast.vonName = zustand.ichName;
    nutzlast.vonBild = zustand.ichBild;
    nutzlast.vonFarbe = zustand.farbe;
    var ziel = k.channel("dma-post-" + anId);
    ziel.subscribe(function (st) {
      if (st !== "SUBSCRIBED") return;
      try { ziel.send({ type: "broadcast", event: "post", payload: nutzlast }); } catch (e) {}
      setTimeout(function () { try { ziel.unsubscribe(); } catch (e) {} }, 800);
    });
  }
  function postEmpfangen(n) {
    if (!n) return;
    if (n.art === "fluester") {
      nachrichtAnhaengen({
        id: n.id || neueNachrichtId(), von: n.von, name: n.vonName || "Jemand",
        text: String(n.text || "").slice(0, CHAT_LAENGE), art: "fluester",
        bild: n.vonBild || "", farbe: n.vonFarbe || "",
        woher: n.raum && n.raum !== zustand.raum ? raumKlartext(n.raum) : "",
        zeit: n.zeit || Date.now(), eigen: false
      });
      melden();
      return;
    }
    if (n.art === "einladung") {
      einladungen[String(n.raum)] = true;
      nachrichtAnhaengen({
        id: n.id || neueNachrichtId(), von: n.von, name: n.vonName || "Jemand",
        art: "einladung", raum: n.raum,
        text: (n.vonName || "Jemand") + " lädt dich in „" + raumKlartext(n.raum) + "“ ein. "
            + "Tippe  /j " + raumKlartext(n.raum) + "  — oder tippe die Zeile an.",
        zeit: Date.now(), eigen: false, bild: n.vonBild || ""
      });
      melden();
      return;
    }
    if (n.art === "rausschmiss" && n.raum === zustand.raum) {
      systemZeile((n.vonName || "Der Häuptling") + " hat dich aus dem Raum geschickt.");
      var nm = zustand.ichName, bd = zustand.ichBild, kt = kontoId;
      verlassen();
      betreten(HAUPTRAUM, { name: nm, bild: bd, konto: kt, mitBild: false });
      return;
    }
    if (n.art === "knebel") { geknebeltVon[n.von] = Boolean(n.an_); melden(); return; }
    if (n.art === "abgewiesen" && n.raum === zustand.raum) {
      var nm2 = zustand.ichName, bd2 = zustand.ichBild, kt2 = kontoId, fb2 = zustand.farbe;
      verlassen();
      betreten(HAUPTRAUM, { name: nm2, bild: bd2, konto: kt2, farbe: fb2, mitBild: false })
        .then(function () {
          systemZeile("Der Raum „" + raumKlartext(n.raum) + "“ ist abgeschlossen \ud83d\udd12 — "
            + "dort kommt nur herein, wer eingeladen wurde. Bitte " + (n.vonName || "den Häuptling")
            + " um eine Einladung  (/i deinName).");
        });
      return;
    }
  }
  var verlaufBekommen = false;
  var einladungen = {};        // Raum -> true (wohin man eingeladen wurde)
  var geknebeltVon = {};

  /* =========================================================
     DIE BEFEHLE AUSFÜHREN
     ========================================================= */
  function befehlAusfuehren(roh) {
    /* „/me/" ist KEIN Befehl, sondern der alte Trick: der eigene Name
       mitten im Satz. Ein Befehl ist es nur, wenn KEIN Schrägstrich
       folgt. Genau daran ist es bisher gescheitert — „/me/ denkt …"
       wurde als Aktion gelesen statt als ganz normale Zeile. */
    if (/^\/me\//i.test(roh.trim())) return false;
    var m = /^\/([a-zäöüß?]+)\s+([\s\S]*)$|^\/([a-zäöüß?]+)\s*$/i.exec(roh.trim());
    if (!m) return false;
    var wort = (m[1] || m[3] || "").toLowerCase(), rest = (m[2] || "").trim();

    /* Kurzform oder Langform — beides gilt, wie damals auch. */
    var art = null;
    BEFEHLE.forEach(function (b) {
      if (b.w === wort || (b.kurz && b.kurz === wort)) art = b.w;
    });
    if (!art) {
      var gleich = { msg: "w", m: "w", query: "w", fluester: "w", whisper: "w",
                     shout: "s", schrei: "s", schreien: "s",
                     join: "j", raum: "j", room: "j",
                     invite: "i", einladen: "i",
                     follow: "f", folge: "f", folgen: "f",
                     names: "n", who: "n", wer: "n",
                     list: "l", raeume: "l",
                     topic: "t", thema: "t",
                     kick: "k", rausschmeissen: "k",
                     color: "c", farbe: "c",
                     party: "konfetti", konfetty: "konfetti", feier: "konfetti",
                     confetti: "konfetti",
                     geburtstag: "ballon", ballons: "ballon", luftballon: "ballon",
                     font: "schrift", schriftart: "schrift",
                     help: "h", hilfe: "h", "?": "h",
                     part: "leave", exit: "leave", quit: "leave" };
      art = gleich[wort] || null;
    }
    if (!art) return false;

    /* ---- Reden ---- */
    if (art === "me") {
      if (!rest) return systemZeile("So geht es:  /me lacht laut");
      return anAlle("aktion", NAME_AUF + zustand.ichName + NAME_ZU + " " + textAufbereiten(rest));
    }
    if (art === "s") {
      if (!rest) return systemZeile("So geht es:  /s Hallo alle zusammen");
      return anAlle("ruf", textAufbereiten(rest).toUpperCase());
    }
    if (art === "w") {
      var t = /^(\S+)\s+([\s\S]+)$/.exec(rest);
      if (!t) return systemZeile("So geht es:  /w Nickname Dein Text");
      var ziel = personNachName(t[1]) || praesenzNachName(t[1]);
      if (!ziel) return systemZeile("„" + t[1] + "“ ist gerade nirgends zu finden.");
      var txt = textAufbereiten(t[2]);
      var n = eigeneZeile("fluester", "an " + ziel.name + ": " + txt, ziel.id);
      postSenden(ziel.id, { art: "fluester", id: n.id, text: txt,
                            raum: zustand.raum, zeit: n.zeit });
      melden();
      return true;
    }

    /* ---- Räume ---- */
    if (art === "j") {
      if (!rest) return systemZeile("So geht es:  /j Leseecke");
      var neu = raumSchluessel(rest);
      if (!neu) return systemZeile("Der Name geht nicht. Nimm Buchstaben und Zahlen.");
      if (neu === zustand.raum) return systemZeile("Da bist du schon.");
      if (raumIstZu(neu) && !einladungen[neu]) {
        return systemZeile("„" + raumKlartext(neu) + "“ ist abgeschlossen \ud83d\udd12 — "
          + "dort kommt nur herein, wer eingeladen wurde.");
      }
      raumWechseln(neu);
      return true;
    }
    if (art === "leave") { raumWechseln(HAUPTRAUM); return true; }
    if (art === "i") {
      if (!rest) return systemZeile("So geht es:  /i Nickname");
      var wen = personNachName(rest) || praesenzNachName(rest);
      if (!wen) return systemZeile("„" + rest + "“ ist gerade nirgends zu finden.");
      zustand.eingeladen[wen.id] = true;
      postSenden(wen.id, { art: "einladung", raum: zustand.raum, zeit: Date.now() });
      return systemZeile("Eingeladen: " + wen.name + ". Eine Einladung ist keine Frage mit "
        + "Ja und Nein — sie macht den Raum für " + wen.name + " auf. Hereinkommen "
        + wen.name + " muss selbst.");
    }
    if (art === "f") {
      if (!rest) return systemZeile("So geht es:  /f Nickname");
      var p = praesenzNachName(rest);
      if (!p || !p.raum) return systemZeile("„" + rest + "“ ist gerade in keinem Raum.");
      if (p.raum === zustand.raum) return systemZeile(p.name + " ist hier bei dir.");
      if (raumIstZu(p.raum) && !einladungen[p.raum]) {
        return systemZeile(p.name + " ist in „" + raumKlartext(p.raum) + "“, und der Raum ist "
          + "abgeschlossen \ud83d\udd12. Bitte " + p.name + " um eine Einladung.");
      }
      raumWechseln(p.raum);
      return true;
    }
    if (art === "n") {
      var hier = [zustand.ichName + " (du)"].concat(Object.keys(zustand.leute).map(function (id) {
        return zustand.leute[id].name + (zustand.leute[id].haeuptling ? " ★" : "");
      }));
      return systemZeile("Hier im Raum „" + raumKlartext(zustand.raum) + "“: " + hier.join(", "));
    }
    if (art === "l") {
      var raeume = {};
      Object.keys(praesenzDa).forEach(function (id) {
        var e = praesenzDa[id];
        if (!e.raum) return;
        (raeume[e.raum] = raeume[e.raum] || []).push(e.name || "?");
      });
      var zeilen = Object.keys(raeume).map(function (r) {
        return "  " + raumKlartext(r) + " — " + raeume[r].join(", ");
      });
      return systemZeile(zeilen.length ? "Offene Räume:\n" + zeilen.join("\n")
                                       : "Gerade ist nur das Klassenzimmer offen.");
    }
    if (art === "t") {
      if (!zustand.haeuptling && zustand.raum !== HAUPTRAUM) {
        return systemZeile("Das Thema setzt der Häuptling des Raums.");
      }
      zustand.thema = textAufbereiten(rest).slice(0, 120);
      senden({ art: "thema", thema: zustand.thema });
      melden();
      return systemZeile(zustand.thema ? "Thema: " + zustand.thema : "Thema gelöscht.");
    }
    if (art === "lock" || art === "unlock") {
      if (!zustand.haeuptling) return systemZeile("Abschließen darf nur, wer den Raum aufgemacht hat.");
      if (zustand.abgeschlossen === (art === "lock")) {
        return systemZeile(zustand.abgeschlossen ? "Der Raum ist schon abgeschlossen."
                                                 : "Der Raum ist schon offen.");
      }
      zustand.abgeschlossen = (art === "lock");
      praesenzSetzen(true, zustand.ichName);
      melden();
      return anAlle("system", zustand.ichName + (zustand.abgeschlossen
        ? " schließt den Raum ab \ud83d\udd12"
        : " öffnet den Raum wieder"));
    }

    /* ---- Rechte, wie bei Kilahu ---- */
    if (art === "op" || art === "deop") {
      if (!zustand.haeuptling) return systemZeile("Das darf nur der Häuptling dieses Raums.");
      var z2 = personNachName(rest);
      if (!z2) return systemZeile("„" + rest + "“ ist nicht hier.");
      senden({ art: "rang", an: z2.id, haeuptling: art === "op" });
      z2.haeuptling = (art === "op");
      melden();
      return anAlle("system", z2.name + (art === "op"
        ? " ist jetzt Häuptling in diesem Raum."
        : " ist nicht mehr Häuptling."));
    }
    if (art === "k") {
      if (!zustand.haeuptling) return systemZeile("Rausschmeißen darf nur der Häuptling.");
      var z3 = personNachName(rest);
      if (!z3) return systemZeile("„" + rest + "“ ist nicht hier.");
      postSenden(z3.id, { art: "rausschmiss", raum: zustand.raum });
      return anAlle("system", z3.name + " wurde von " + zustand.ichName + " hinausgeschickt.");
    }
    if (art === "knebel" || art === "entknebel") {
      if (!zustand.haeuptling) return systemZeile("Knebeln darf nur der Häuptling.");
      var z4 = personNachName(rest);
      if (!z4) return systemZeile("„" + rest + "“ ist nicht hier.");
      zustand.geknebelt[z4.id] = (art === "knebel");
      postSenden(z4.id, { art: "knebel", an_: art === "knebel", raum: zustand.raum });
      return anAlle("system", z4.name + (art === "knebel"
        ? " ist geknebelt und kann gerade nichts sagen."
        : " darf wieder sprechen."));
    }

    /* ---- Gesten mit Bild ----
       GEWÜNSCHT: „/lach soll richtige ASCII-Kunst benutzen."

       Damals war das der ganze Zauber: der Chat konnte nur Buchstaben,
       also hat man Bilder AUS Buchstaben gebaut. Das geht nur in einer
       Schrift, in der jedes Zeichen gleich breit ist — sonst zerfällt
       das Bild. Diese Blöcke gehen deshalb als eigene Art „ascii"
       hinaus und werden drüben in Schreibmaschinenschrift gesetzt. */
    if (art === "lach") {
      return anAlle("ascii", ASCII.lachen.replace("%NAME%", zustand.ichName),
                    { wirkung: "lachen" });
    }
    if (art === "ascii") {
      var welches = rest.toLowerCase();
      if (!ASCII[welches]) {
        return systemZeile("Es gibt: " + Object.keys(ASCII).join(", ")
          + "   —   zum Beispiel  /ascii daumen");
      }
      return anAlle("ascii", ASCII[welches].replace("%NAME%", zustand.ichName));
    }
    if (art === "drueck") {
      var wen2 = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " drückt " + (wen2 ? wen2.name : "alle"),
                    { wirkung: "umarmen" });
    }
    if (art === "herz") {
      var wem = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " schickt "
        + (wem ? wem.name : "allen") + " ein \u2665", { wirkung: "herz" });
    }
    /* GEWÜNSCHT: „Einen Befehl für Konfetti, sodass da wirklich Konfetti
       durch den ganzen Raum fliegt. Zum Beispiel: Xander Fox schmeißt
       Konfetti. Aber der muss halt funktionieren, dass das so eine
       Animation auslöst, die wirklich sichtbar ist."

       Deshalb geht dieser Effekt als einziger NICHT über dem Chatfenster
       nieder, sondern über der ganzen Seite — siehe lcKonfetti() in
       app.js. Die Zeile selbst ist eine ganz normale Aktion, damit auch
       im Verlauf steht, wer geworfen hat. */
    if (art === "konfetti") {
      var anWen = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " schmeißt Konfetti"
        + (anWen ? " für " + anWen.name : ""), { wirkung: "konfetti" });
    }

    /* ---- Luftballons ----
       GEWÜNSCHT: „Luftballons zum Geburtstag." Sie steigen bei allen im
       Raum auf, nicht nur bei dem, der sie geschickt hat. */
    if (art === "ballon") {
      var fuerWen = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " l\u00e4sst Luftballons steigen"
        + (fuerWen ? " f\u00fcr " + fuerWen.name : "") + "  \ud83c\udf88",
        { wirkung: "ballon" });
    }

    /* ---- Die Schrift im Chat ----
       GEWÜNSCHT: „Drei, vier Schriftarten zum Auswählen." Sie gilt nur
       auf DIESEM Gerät — es ist eine Lesehilfe, keine Nachricht an die
       anderen. Deshalb geht nichts davon über den Kanal hinaus. */
    if (art === "schrift") {
      var welche = SCHRIFTEN[rest.toLowerCase()] ? rest.toLowerCase() : "";
      if (!welche) {
        return systemZeile("Schriften:\n"
          + Object.keys(SCHRIFTEN).map(function (k) {
              return "  /schrift " + k + "   " + SCHRIFTEN[k].was;
            }).join("\n"));
      }
      zustand.schrift = welche;
      schriftMerken(welche);
      melden();
      return systemZeile("Die Schrift steht jetzt auf „" + SCHRIFTEN[welche].was + "“.");
    }

    /* ---- Farbe ---- */
    if (art === "c") {
      var erlaubt = ["rot", "blau", "gruen", "grün", "gelb", "lila", "tuerkis", "türkis",
                     "orange", "rosa", "weiss", "weiß", "bunt", ""];
      var f = rest.toLowerCase();
      if (erlaubt.indexOf(f) < 0) {
        return systemZeile("Farben: rot, blau, gruen, gelb, lila, tuerkis, orange, rosa, "
          + "weiss, bunt — oder  /c  ohne Wort für die Standardfarbe.");
      }
      zustand.farbe = f.replace("ü", "ue").replace("ß", "ss");
      farbeMerken(zustand.farbe);          // ueberlebt das Neuladen
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn,
               bild: zustand.ichBild, farbe: zustand.farbe });
      melden();
      return systemZeile(zustand.farbe ? "Du schreibst jetzt " + rest + "." : "Wieder normale Farbe.");
    }

    /* ---- Hilfe ---- */
    if (art === "h") {
      return systemZeile("Das kannst du tippen:\n"
        + BEFEHLE.map(function (b) { return "  " + b.nutzt + "   " + b.was; }).join("\n"));
    }
    return false;
  }

  /* Den Raum wechseln — und dabei alles mitnehmen, was zu einem gehört. */
  function raumWechseln(neuerRaum) {
    var nm = zustand.ichName, bd = zustand.ichBild, kt = kontoId, fb = zustand.farbe;
    verlassen();
    return betreten(neuerRaum, { name: nm, bild: bd, konto: kt, farbe: fb, mitBild: false })
      .then(function () { melden(); });
  }

  /* Ist dieser Raum gerade abgeschlossen? Das sagt die Präsenz —
     jeder darin trägt es mit. */
  function raumIstZu(raum) {
    var ids = Object.keys(praesenzDa);
    for (var i = 0; i < ids.length; i++) {
      if (praesenzDa[ids[i]].raum === raum && praesenzDa[ids[i]].zu) return true;
    }
    return false;
  }
  function raeumeOffen() {
    var raeume = {};
    Object.keys(praesenzDa).forEach(function (id) {
      var e = praesenzDa[id];
      if (!e.raum) return;
      if (!raeume[e.raum]) raeume[e.raum] = { raum: e.raum, name: raumKlartext(e.raum),
                                              leute: [], zu: false };
      raeume[e.raum].leute.push(e.name || "?");
      if (e.zu) raeume[e.raum].zu = true;
    });
    return Object.keys(raeume).map(function (r) { return raeume[r]; })
      .sort(function (a, b) { return b.leute.length - a.leute.length; });
  }

  function praesenzNachName(name) {
    var k = String(name || "").trim().toLowerCase();
    var ids = Object.keys(praesenzDa);
    for (var i = 0; i < ids.length; i++) {
      var e = praesenzDa[ids[i]];
      if (String(e.name || "").toLowerCase() === k) return { id: ids[i], name: e.name, raum: e.raum };
    }
    for (var j = 0; j < ids.length; j++) {
      var f = praesenzDa[ids[j]];
      if (String(f.name || "").toLowerCase().indexOf(k) === 0) return { id: ids[j], name: f.name, raum: f.raum };
    }
    return null;
  }

  function geknebelt() {
    return Object.keys(geknebeltVon).some(function (k) { return geknebeltVon[k]; });
  }

  function schreiben(text) {
    var t = String(text || "").trim().slice(0, CHAT_LAENGE);
    if (!t) return;
    if (t.charAt(0) === "/" && befehlAusfuehren(t)) return;
    if (geknebelt()) { systemZeile("Du bist gerade geknebelt und kannst nichts sagen."); return; }
    /* Steht „/me/" im Satz, ist es eine AKTION: der Name steht dann
       mitten in der Zeile und darf nicht zusätzlich davor stehen. */
    var alsAktion = hatEigennamen(t);
    t = textAufbereiten(t);
    var n = {
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: t, art: alsAktion ? "aktion" : "text",
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe
    };
    nachrichtAnhaengen(n);
    serverSichern(n);
    senden({ art: "text", id: n.id, name: n.name, text: n.text, zeit: n.zeit,
             chatArt: n.art, bild: zustand.ichBild, farbe: zustand.farbe });
    melden();
  }

  /* =========================================================
     DAS ARCHIV — den Chat spaeter nachlesen
     ---------------------------------------------------------
     GEWUENSCHT: „Eine Moeglichkeit, den Chat zu speichern, waere auch
     noch schoen — dass man diese Erinnerung behaelt, oder dass sich das
     automatisch irgendwo sammelt, sodass man den Chat noch mal
     nachlesen kann."

     Gesammelt wird ohnehin schon: der Text im localStorage, die Bilder
     im Lager, und seit die Tabelle steht auch geraeteuebergreifend in
     der Datenbank. Was gefehlt hat, war der WEG DAHIN — ein Ort, an dem
     man das wieder aufschlagen kann, ohne im Raum zu sein. Genau das
     sind diese drei Funktionen. */
  function archivRaeume() {
    var raeume = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf("dma_livechat_chat_") !== 0) continue;
        var raum = k.slice("dma_livechat_chat_".length);
        var liste = [];
        try { liste = JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) {}
        if (!Array.isArray(liste) || !liste.length) continue;
        var letzte = liste[liste.length - 1] || {};
        raeume.push({
          raum: raum,
          name: raumKlartext(raum),
          wieviel: liste.length,
          zuletzt: letzte.zeit || 0,
          bilder: liste.filter(function (n) { return n.bildImChat || n.bildImLager; }).length
        });
      }
    } catch (e) {}
    return raeume.sort(function (a, b) { return (b.zuletzt || 0) - (a.zuletzt || 0); });
  }

  /* Den Verlauf eines Raums zum Nachlesen holen: erst das, was im
     Geraet liegt, dann die Bilder aus dem Lager dazu, und — wenn eine
     Verbindung da ist — der gemeinsame Verlauf aus der Datenbank
     obendrauf. Flüstereien bleiben draussen; die gehen niemanden
     etwas an, der spaeter nachliest. */
  function archivLaden(raum) {
    var r = raum || zustand.raum || HAUPTRAUM;
    var hier = chatLaden(r);
    return serverLaden(r).then(function (dort) {
      var alles = dort.length ? verschmelzen(dort, hier) : hier;
      return bilderNachreichen(alles).then(function () {
        return alles.filter(function (n) {
          return n.art !== "fluester" && n.art !== "system";
        });
      });
    });
  }

  /* Derselbe Verlauf als schlichter Text — zum Herunterladen und
     Aufheben, ohne dass irgendein Programm dafuer noetig waere. */
  function archivAlsText(raum, liste) {
    var kopf = "Klassenzimmer — " + raumKlartext(raum || "") + "\n"
             + "Nachgelesen am " + new Date().toLocaleString("de-DE") + "\n"
             + "----------------------------------------\n\n";
    var klar = function (x) {
      return String(x || "").split(NAME_AUF).join("").split(NAME_ZU).join("");
    };
    return kopf + (liste || []).map(function (n) {
      var uhr = new Date(n.zeit || 0).toLocaleString("de-DE",
        { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      var bild = (n.bildImChat || n.bildImLager) ? "  [Bild]" : "";
      if (n.art === "aktion") return "[" + uhr + "] * " + klar(n.text) + bild;
      if (n.art === "ruf")    return "[" + uhr + "] " + n.name + " ruft: " + klar(n.text) + bild;
      return "[" + uhr + "] " + (n.name || "?") + ": " + klar(n.text) + bild;
    }).join("\n") + "\n";
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
    bildVerkleinern: bildVerkleinern,
    gifSenden: gifSenden,
    eigenesBild: function () { return zustand.ichBild; },
    kameraDazuholen: kameraDazuholen,
    mikrofonDazuholen: mikrofonDazuholen,
    chatLeeren: chatLeeren,
    befehlsliste: befehlsliste,
    raumKlartext: raumKlartext,
    raumWechseln: raumWechseln,
    raeumeOffen: raeumeOffen,
    raumIstZu: raumIstZu,
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
    istDrin: function () { return zustand.lage === "drin"; },
    /* Farbe, zuletzt benutzte Bilder, Archiv */
    gemerkteFarbe: gemerkteFarbe,
    gemerkteSchrift: gemerkteSchrift,
    schriftSetzen: function (x) {
      if (!SCHRIFTEN[x]) return false;
      zustand.schrift = x; schriftMerken(x); melden(); return true;
    },
    schriften: function () {
      return Object.keys(SCHRIFTEN).map(function (k) {
        return { nummer: k, was: SCHRIFTEN[k].was };
      });
    },
    letzteBilder: letzteBilder,
    bildGemerkt: bildGemerkt,
    letzteBilderVergessen: letzteBilderVergessen,
    archivRaeume: archivRaeume,
    archivLaden: archivLaden,
    archivAlsText: archivAlsText
  };
})();
