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
  var CHAT_VERLAUF = 60;              // so viele legt das GERAET ab
  /* GEWÜNSCHT: „Einer, der zum ersten Mal auf die Seite kommt, soll
     trotzdem den heutigen kompletten Tagesverlauf aus dem Chat sehen,
     ohne dass ihm irgendetwas fehlt."

     Sechzig Zeilen sind dafür zu wenig — ein lebhafter Tag hat mehr.
     Die beiden Zahlen trennen deshalb, was sie vorher vermischt
     haben: CHAT_VERLAUF ist, was im GERÄT abgelegt wird (der
     localStorage ist knapp, und diese Abschrift ist nur die Notlösung
     für „kein Netz"), CHAT_SICHT ist, was aus der gemeinsamen Tabelle
     geholt und angezeigt wird. */
  var CHAT_SICHT = 400;               // so viele kommen vom Server

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
    buehne: true,       // sitzt man auf einem Platz oder schaut man nur zu?
    seit: 0,            // wann man hereingekommen ist — bestimmt die Sitzordnung
    spricht: false,     // redet man gerade? (fuer den Ring ums Bild)
    thema: "",          // Thema des Raums (/t)
    /* Der Hintergrund gehört dem RAUM, nicht dem Geraet — gewuenscht:
       „wenn ich den Hintergrund einstelle, dass der fuer alle sichtbar
       ist." Entweder ein kurzes Wort wie „animiert:sterne" oder ein
       klein gerechnetes Bild. */
    raumHg: "",
    raumHgRuf: null,    // die Oberflaeche horcht hier, wenn er sich aendert
    haeuptling: false,  // hat diesen Raum aufgemacht (Kilahu: Haeuptling)
    betreiber: false,   // Alex selbst — dann immer Haeuptling
    abgeschlossen: false,
    eingeladen: {},     // Kennung -> true, fuer den abgeschlossenen Raum
    geknebelt: {},      // Kennung -> true
    kameraFehler: "",   // im Klartext, warum kein Bild/Ton da ist
    leute: {},          // id -> { id, name, strom, gesehen, tonAn, bildAn, bild }
    nachrichten: [],    // { id, von, name, text, zeit, eigen, bild }
    gross: null,        // id des ERSTEN gross gezeigten Platzes (alt)
    grosse: []          // alle gross gezeigten Kennungen, höchstens vier
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
      buehne: zustand.buehne,
      thema: zustand.thema,
      raumHg: zustand.raumHg,
      haeuptling: zustand.haeuptling,
      abgeschlossen: zustand.abgeschlossen,
      raumName: raumKlartext(zustand.raum),
      kameraFehler: zustand.kameraFehler,
      hatKamera: Boolean(zustand.eigenerStrom && zustand.eigenerStrom.getVideoTracks().length),
      hatBild: Boolean(zustand.eigenerStrom),
      gross: zustand.gross,
      grosse: zustand.grosse.slice(),
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
  /* GEWÜNSCHT: „Die Sitzplatzordnung soll nicht verändert werden. Wenn
     jemand Neues in den Raum kommt, soll der Betreiber immer noch auf
     Platz 1 sein — beziehungsweise derjenige, der den Raum überhaupt
     zuerst betreten hat."

     Bisher war Platz 1 immer DER EIGENE. Das heisst: auf jedem Gerät
     sass jemand anderes vorn, und jedes Mal, wenn jemand dazukam,
     verschob sich alles. Jetzt entscheidet allein, WANN jemand
     hereingekommen ist — dieselbe Zahl auf allen Geräten, also
     überall dieselbe Reihenfolge. Wer zuerst da war, sitzt auf
     Platz 1 und bleibt dort, bis er geht.

     Wer nur zuschaut (nicht auf der Bühne), belegt keinen Platz und
     kann trotzdem mitschreiben. */
  /* Wer sitzt auf welchem Platz? Einmal vergeben, bleibt es so,
     solange die Person im Raum ist — siehe unten. */
  var platzJe = {};
  /* =========================================================
     PLAETZE TAUSCHEN
     ---------------------------------------------------------
     GEWUENSCHT: „Ausserdem moechte ich, dass wir Plaetze wechseln
     koennen, spontan."

     Die Nummern werden sonst in jedem Geraet selbst ausgerechnet
     (nach Ankunftszeit) — das ergibt ueberall dieselbe Reihenfolge,
     aber es laesst sich nicht verschieben. Ein Tausch muss deshalb
     ALLEN gesagt werden, sonst sitzt derselbe Mensch auf jedem
     Bildschirm woanders.

     Darum diese zweite Tabelle: sie enthaelt nur, was ausdruecklich
     getauscht wurde, sie wird bei jedem Tausch an alle geschickt,
     und sie faehrt im Puls mit — damit auch der, der spaeter
     dazukommt, dieselbe Sitzordnung sieht. */
  var sitzTausch = {};

  function plaetzeBauen() {
    var wer = [];
    if (zustand.lage === "drin" && zustand.buehne) {
      wer.push({
        id: zustand.ichId, seit: zustand.seit || Date.now(),
        name: zustand.ichName || "Du", ich: true,
        strom: zustand.eigenerStrom, tonAn: zustand.tonAn, bildAn: zustand.bildAn,
        bild: zustand.ichBild, spricht: Boolean(zustand.spricht)
      });
    }
    Object.keys(zustand.leute).forEach(function (id) {
      var p = zustand.leute[id];
      if (p.buehne === false) return;          // schaut nur zu
      wer.push({
        id: p.id, seit: p.seit || 0, name: p.name || "Gast", ich: false,
        strom: p.strom || null, tonAn: p.tonAn !== false, bildAn: p.bildAn === true,
        bild: p.bild || "", spricht: Boolean(p.spricht)
      });
    });
    /* Nach Ankunftszeit, bei Gleichstand nach der Kennung — damit die
       Reihenfolge auf allen Geräten wirklich dieselbe ist. */
    wer.sort(function (a, b) {
      return (a.seit || 0) - (b.seit || 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });

    /* DIE FORMATION BLEIBT STEHEN.
       ---------------------------------------------------------
       GEMELDET: „Die Plätze oben, diese Kreise, wo man rein kann,
       sollen immer in der Formation bleiben, wie sie sind."

       Bisher wurden die Plätze bei jedem Zeichnen neu durchnummeriert.
       Ging einer von der Bühne, rückten alle dahinter auf — für die
       anderen sprang das ganze Bild. Jetzt bekommt jeder EINMAL seine
       Nummer und behält sie, solange er im Raum ist. Wer geht,
       hinterlässt eine Lücke; wer kommt, bekommt die niedrigste freie.
       So steht der, der zuerst da war, auf Platz 1 und bleibt dort —
       und niemand rutscht mehr herum, nur weil ein anderer aufsteht. */
    /* Ein abgesprochener Tausch schlaegt die eigene Rechnung. */
    wer.forEach(function (p) {
      if (sitzTausch[p.id] != null) platzJe[p.id] = sitzTausch[p.id];
    });
    var vergeben = {};
    wer.forEach(function (p) {
      if (platzJe[p.id] != null) vergeben[platzJe[p.id]] = p.id;
    });
    wer.forEach(function (p) {
      if (platzJe[p.id] != null) return;
      for (var n = 0; n < PLAETZE; n++) {
        if (vergeben[n] == null) { platzJe[p.id] = n; vergeben[n] = p.id; return; }
      }
    });
    /* Wer nicht mehr da ist, gibt seinen Platz wieder frei. */
    var nochDa = {};
    wer.forEach(function (p) { nochDa[p.id] = true; });
    Object.keys(platzJe).forEach(function (id) {
      if (!nochDa[id]) delete platzJe[id];
    });

    var raus = [];
    for (var i = 0; i < PLAETZE; i++) {
      var id = vergeben[i];
      var p = id ? wer.filter(function (x) { return x.id === id; })[0] : null;
      raus.push(p ? {
        nummer: i + 1, id: p.id, name: p.name, ich: p.ich, strom: p.strom,
        tonAn: p.tonAn, bildAn: p.bildAn, bild: p.bild, spricht: p.spricht, leer: false
      } : { nummer: i + 1, id: "", name: "", ich: false, strom: null,
            bild: "", spricht: false, leer: true });
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
    /* JEDES Wort gross — nicht nur das erste. Aus „emmys-raum" wurde
       vorher „Emmys raum", und ein Raumname ist ein Name: wenn er im
       Laufband oder in der Raumliste steht, soll er aussehen wie einer
       und nicht wie ein halber Satz. Zahlen und kurze Bindewörter
       bleiben klein, sonst liest sich „Raum Der Fuechse" falsch. */
    var KLEIN = { der: 1, die: 1, das: 1, und: 1, von: 1, im: 1, in: 1, am: 1, zu: 1, mit: 1 };
    return x.split(" ").map(function (w, i) {
      if (!w) return w;
      if (i > 0 && KLEIN[w]) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(" ");
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
  /* Was einer sagt, der das Wetter macht. GEWÜNSCHT: „Du kannst auch
     noch Gewitter machen als Animation, beziehungsweise Sturm oder
     Erdbeben, wo der ganze Chat dann zu wackeln anfängt … eine
     Animation für Halloween mit typischen Halloween-Elementen, eine
     Animation für Weihnachten mit typischen Weihnachtselementen." */
  var WETTER = {
    schnee:      " l\u00e4sst es schneien  \u2744\ufe0f",
    regen:       " l\u00e4sst es regnen  \u2614",
    feuerwerk:   " z\u00fcndet ein Feuerwerk  \ud83c\udf86",
    gewitter:    " holt ein Gewitter herein  \u26c8\ufe0f",
    erdbeben:    " bringt alles zum Wackeln  \ud83c\udf0b",
    vulkan:      " l\u00e4sst einen Vulkan ausbrechen  \ud83c\udf0b",
    /* GEWÜNSCHT: „Alles, was man da an Animationen noch machen kann,
       was witzig und unterhaltsam und abwechslungsreich ist." */
    schmetterling: " l\u00e4sst Schmetterlinge fliegen  \ud83e\udd8b",
    voegel:      " schickt die V\u00f6gel in den S\u00fcden  \ud83e\udebf",
    schlitten:   " h\u00f6rt Schlittenglocken  \ud83c\udf85",
    rennauto:    " gibt Gas  \ud83c\udfce\ufe0f",
    bonbon:      " l\u00e4sst Bonbons regnen  \ud83c\udf6c",
    orkan:       " l\u00e4sst einen Orkan los  \ud83c\udf2c\ufe0f",
    finsternis:  " macht das Licht aus  \ud83d\udd0c",
    lagerfeuer:  " macht ein Lagerfeuer  \ud83d\udd25",
    sternschnuppe: " zeigt auf eine Sternschnuppe  \ud83c\udf20",
    matrix:      " \u00f6ffnet die Matrix  \ud83d\udfe9",
    falten:      " faltet den Raum  \ud83d\udd2e",
    armageddon:  " l\u00e4utet den Weltuntergang ein  \u2604\ufe0f",
    sintflut:    " ruft die Sintflut herbei  \ud83c\udf0a",
    aegypten:    " reist nach \u00c4gypten  \ud83d\udc0e",
    ostern:      " versteckt Ostereier  \ud83d\udc23",
    augen:       " guckt ganz neugierig  \ud83d\udc40",
    halloween:   " macht es gruselig  \ud83c\udf83",
    weihnachten: " bringt Weihnachten mit  \ud83c\udf84",
    /* GEMELDET, mehrfach: „Die Keks-Animation fehlt noch. Die
       Cash-Animation fehlt noch." Und spaeter: „Das mit dem
       zerbrochenen Glas geht noch nicht." Und: „Die Animationen, die
       du neu gemacht hast, sind noch nicht aufrufbar."

       Er hatte jedes Mal recht, und ich habe jedes Mal das Falsche
       geprueft. Die Zeichnungen gab es alle — ich habe sie einzeln
       ausgeloest, gezaehlt und fotografiert, und sie liefen. Nur
       kommt ein Effekt ueberhaupt erst hierher, wenn sein Name in
       DIESER Tabelle steht: eine Zeile weiter unten fragt
       „if (WETTER[art])", und was hier fehlt, faellt durch und tut
       gar nichts.

       Neunzehn Stueck fehlten. Geld und Keks von Anfang an, Glasbruch
       auch, dazu alles, was seither dazugekommen ist. Die Tuer war
       zu, und ich habe immer nur nachgesehen, ob das Zimmer dahinter
       moebliert ist.

       Damit das nicht wieder passiert, prueft effektetuer.js jetzt
       BEIDE Listen gegeneinander: jeder Ganzseiten-Effekt muss auch
       aufrufbar sein. */
    geld:        " l\u00e4sst Geld regnen  \ud83d\udcb8",
    keks:        " isst einen Keks  \ud83c\udf6a",
    wolken:      " l\u00e4sst Wolken ziehen  \u2601\ufe0f",
    glasbruch:   " zerbricht den Bildschirm  \ud83d\udca5",
    spinnen:     " l\u00e4sst Spinnen krabbeln  \ud83d\udd77\ufe0f",
    noten:       " macht Musik  \ud83c\udfb5",
    seifenblasen:" pustet Seifenblasen  \ud83e\udee7",
    herbst:      " l\u00e4sst das Laub fallen  \ud83c\udf42",
    aquarium:    " taucht alles unter Wasser  \ud83d\udc1f",
    pinguine:    " schickt die Pinguine los  \ud83d\udc27",
    fratze:      " ruft etwas Boeses herbei  \ud83d\udc79",
    blut:        " l\u00e4sst Blut herunterlaufen  \ud83e\ude78",
    schloss:     " oeffnet das Tor zum Schloss  \ud83c\udff0",
    kitt:        " l\u00e4sst den schwarzen Wagen kommen  \ud83d\ude97",
    dino:        " weckt einen Tyrannosaurus  \ud83e\udd96",
    jalousie:    " zieht die Jalousie hoch  \ud83e\ude9f",
    handdurch:   " l\u00e4sst eine Hand durchbrechen  \ud83e\udec5",
    tore:        " schliesst die Tore  \ud83d\udd12",
    paintball:   " er\u00f6ffnet das Farbfeuer  \ud83c\udfaf",
    enten:       " f\u00fchrt die Entenfamilie spazieren  \ud83e\udd86",
    katze:       " l\u00e4sst ein Katzenbaby an die Scheibe  \ud83d\udc31",
    pirat:       " schickt das Piratenschiff los  \ud83c\udff4\u200d\u2620\ufe0f",
    strudel:     " zieht den Chat in den Strudel  \ud83c\udf00",
    schwamm:     " wischt den Chat mit dem Schwamm  \ud83e\uddfd",
    schuss:      " ballert L\u00f6cher in den Chat  \ud83d\udca5",
    route66:     " braust ueber die Route 66 heran  \ud83d\ude98",
    prunk:       " laesst ein grosses Geschenk aufgehen  \ud83c\udf81",
    /* Die grossen Geschenke. Ohne Namen dahinter gilt es dem ganzen
       Raum — „schenkt allen einen Loewen". Mit Namen setzt der Zweig
       in befehlAusfuehren den Satz selbst zusammen. */
    ggloewe:     " schenkt allen einen L\u00f6wen  \ud83e\udd81",
    ggtrex:      " schenkt allen einen Tyrannosaurus  \ud83e\udd96",
    ggelefant:   " schenkt allen einen Elefanten  \ud83d\udc18",
    ggadler:     " schenkt allen einen Adler  \ud83e\udd85",
    gghai:       " schenkt allen einen Hai  \ud83e\udd88",
    ggbaer:      " schenkt allen einen B\u00e4ren  \ud83d\udc3b",
    /* Die Achtziger. */
    kassette:    " spult die Kassette zur\u00fcck  \ud83d\udcfc",
    pacman:      " l\u00e4sst Pac-Man durch den Chat fressen  \ud83d\udc7e",
    vhs:         " legt ein altes Videoband ein  \ud83d\udcfa",
    disko:       " l\u00e4sst die Spiegelkugel an  \ud83e\udea9"
  };

  /* Welche Wirkung welches grosse Geschenk ist — und wie der Satz
     heisst, wenn es EINER Person gilt. Ohne diese Tabelle muesste der
     Satz an zwei Stellen stehen (hier und in WETTER), und eine von
     beiden waere frueher oder spaeter falsch. */
  var GROSSGESCHENK = {
    ggloewe:   { satz: "einen L\u00f6wen",        emoji: "\ud83e\udd81" },
    ggtrex:    { satz: "einen Tyrannosaurus", emoji: "\ud83e\udd96" },
    ggelefant: { satz: "einen Elefanten",     emoji: "\ud83d\udc18" },
    ggadler:   { satz: "einen Adler",         emoji: "\ud83e\udd85" },
    gghai:     { satz: "einen Hai",           emoji: "\ud83e\udd88" },
    ggbaer:    { satz: "einen B\u00e4ren",        emoji: "\ud83d\udc3b" }
  };

  var SCHRIFTEN = {
    "1": { was: "klassisch" },
    "2": { was: "Schreibmaschine" },
    "3": { was: "breit und klar" },
    "4": { was: "Zeitung" }
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
      .limit(CHAT_SICHT)
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
    /* HIER LAG EIN FEHLER, und er hat jede Bildnachricht verdoppelt.
       Die Prüfung verglich
           Boolean(m.bildImChat) === Boolean(n.bildImChat)
       also: „tragen beide gerade Bilddaten bei sich?" Das ist aber
       kein Merkmal der Nachricht, sondern eine Frage des Augenblicks.
       Die Kopie aus dem Gerät hat ihre Bilddaten nämlich NICHT bei
       sich — sie liegen im Lager, und bildImChat ist leer, bis
       bilderNachreichen() sie geholt hat. Die Kopie vom Server trägt
       sie dagegen mit. Damit galten dieselben zwei Zeilen als
       verschieden, und beide blieben stehen.

       Verglichen wird jetzt, OB die Nachricht überhaupt ein Bild hat
       — ganz gleich, wo es gerade liegt. */
    var hatBild = function (n) {
      return Boolean(n.bildImChat || n.bildImLager || n.bildWeg);
    };
    alles.forEach(function (n) {
      var zwilling = null;
      raus.some(function (m) {
        if (m.id && n.id && m.id === n.id) { zwilling = m; return true; }
        if (m.name === n.name && m.text === n.text
            && Math.abs((m.zeit || 0) - (n.zeit || 0)) < 4000
            && hatBild(m) === hatBild(n)) { zwilling = m; return true; }
        return false;
      });
      if (!zwilling) { raus.push(n); return; }
      /* Von zwei Ausfertigungen derselben Zeile gewinnt die, die das
         Bild wirklich dabei hat — sonst ginge es beim Verschmelzen
         verloren, je nachdem welche zufällig zuerst kam. */
      if (!zwilling.bildImChat && n.bildImChat) {
        zwilling.bildImChat = n.bildImChat;
        zwilling.bildWeg = false;
      }
      if (!zwilling.wirkung && n.wirkung) zwilling.wirkung = n.wirkung;
      if (!zwilling.farbe && n.farbe) zwilling.farbe = n.farbe;
    });
    return raus.slice(-CHAT_SICHT);
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
          /* Der eigene Hintergrund altert nicht — er bleibt, bis man
             ihn selbst wieder wegnimmt. */
          if (!c.value || c.value.id !== HINTERGRUND_ID) {
            try { c.delete(); } catch (e) {}
          }
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
    /* Und dasselbe fuer die Sprachnachrichten — sie liegen unter
       „sprach:<id>" im selben Lager. */
    var tonFehlt = (liste || []).filter(function (n) {
      return !n.sprach && n.sprachImLager;
    }).map(function (n) { return "sprach:" + n.id; });
    if (!fehlen.length && !tonFehlt.length) return Promise.resolve(false);
    return lagerHolen(fehlen.concat(tonFehlt)).then(function (gefunden) {
      var etwas = false;
      liste.forEach(function (n) {
        var d = gefunden[String(n.id)];
        if (d) { n.bildImChat = d; n.bildWeg = false; etwas = true; }
        var t = gefunden["sprach:" + n.id];
        if (t) { n.sprach = t; n.sprachWeg = false; etwas = true; }
        else if (n.sprachImLager && !n.sprach) { n.sprachWeg = true; }
      });
      return etwas;
    });
  }

  /* =========================================================
     DAS LAGER SELBST VERWALTEN
     ---------------------------------------------------------
     „Vielleicht kann man das auch selber verwalten." Genau: hier
     steht, wie viel Platz die Sprachnachrichten belegen, und hier
     lassen sie sich wegwerfen — ohne den uebrigen Verlauf und ohne
     die Bilder anzuruehren.
     ========================================================= */
  function sprachLagerStand() {
    return lager().then(function (db) {
      if (!db) return { anzahl: 0, bytes: 0 };
      return new Promise(function (fertig) {
        var anzahl = 0, bytes = 0;
        try {
          var t = db.transaction(LAGER_FACH, "readonly");
          var c = t.objectStore(LAGER_FACH).openCursor();
          c.onsuccess = function (e) {
            var z = e.target.result;
            if (!z) { fertig({ anzahl: anzahl, bytes: bytes }); return; }
            if (String(z.value && z.value.id).indexOf("sprach:") === 0) {
              anzahl++; bytes += String(z.value.daten || "").length;
            }
            z.continue();
          };
          t.onerror = function () { fertig({ anzahl: anzahl, bytes: bytes }); };
        } catch (e) { fertig({ anzahl: 0, bytes: 0 }); }
      });
    });
  }
  function sprachLagerLeeren(aelterAlsTagen) {
    var grenze = aelterAlsTagen ? Date.now() - aelterAlsTagen * 86400000 : Infinity;
    return lager().then(function (db) {
      if (!db) return 0;
      return new Promise(function (fertig) {
        var weg = 0;
        try {
          var t = db.transaction(LAGER_FACH, "readwrite");
          var laden = t.objectStore(LAGER_FACH);
          var c = laden.openCursor();
          c.onsuccess = function (e) {
            var z = e.target.result;
            if (!z) return;
            var v = z.value || {};
            if (String(v.id).indexOf("sprach:") === 0
                && (grenze === Infinity || (v.zeit || 0) < grenze)) {
              laden.delete(v.id); weg++;
            }
            z.continue();
          };
          t.oncomplete = function () { fertig(weg); };
          t.onerror = function () { fertig(weg); };
        } catch (e) { fertig(0); }
      });
    });
  }

  /* --- Das eigene Hintergrundbild ------------------------------
     GEMELDET: „Hintergründe lassen sich immer noch nicht einbinden.
     Ich bin dabei rausgeschmissen worden."

     Zwei Ursachen, beide hausgemacht:

     1. Das Verkleinern hatte EIN festes Höchstmass — 140 000 Zeichen,
        gedacht für ein Foto im Chat. Ein Hintergrund ist 720 Pixel
        breit und reisst das mühelos; also flog er mit „zu gross"
        heraus, bevor er überhaupt irgendwo ankam.

     2. Gespeichert werden sollte er im localStorage. Der fasst
        insgesamt wenige Megabyte — und teilt sie sich mit dem ganzen
        Chatverlauf. Ein halbes Megabyte Hintergrund hat ihn gesprengt;
        danach schlug jedes weitere Sichern fehl, der Verlauf ging
        verloren, und es sah aus, als wäre man hinausgeworfen worden.

     Der Hintergrund liegt deshalb jetzt dort, wo auch die Chatbilder
     liegen: im Lager (IndexedDB). Dort ist Platz, und der localStorage
     bleibt dem Text vorbehalten. */
  var HINTERGRUND_ID = "hintergrund-eigen";
  function hintergrundSichern(daten) {
    if (!daten) {
      return lager().then(function (db) {
        if (!db) return false;
        return new Promise(function (fertig) {
          try {
            var t = db.transaction(LAGER_FACH, "readwrite");
            t.objectStore(LAGER_FACH).delete(HINTERGRUND_ID);
            t.oncomplete = function () { fertig(true); };
            t.onerror = function () { fertig(false); };
          } catch (e) { fertig(false); }
        });
      });
    }
    return lagerLegen(HINTERGRUND_ID, "", daten);
  }
  function hintergrundHolen() {
    return lagerHolen([HINTERGRUND_ID]).then(function (g) {
      return g[HINTERGRUND_ID] || "";
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
      return Array.isArray(l) ? l.slice(-CHAT_SICHT) : [];
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
      /* SPRACHNACHRICHTEN BLEIBEN — aber nicht im localStorage.
         NACHGEBESSERT: „Sie sollen sich auch nicht unbedingt alleine
         loeschen. Sie koennen ja drin sein, nur sie koennen spaeter
         geloescht werden, wenn sie wirklich viel Platz wegnehmen."

         Also derselbe Weg wie beim Bild: der Ton geht ins Lager
         (IndexedDB, viel Platz), im Verlauf bleibt nur der Haken.
         Der localStorage fasst wenige Megabyte und teilt sie sich
         mit dem ganzen Verlauf — zwanzig Sekunden Ton sind 120 KB,
         ein Dutzend davon haette ihn gesprengt und frueher schon
         einmal den GANZEN Verlauf mitgerissen. */
      if (n.sprach) {
        lagerLegen("sprach:" + n.id, raum, n.sprach);
        var ohneTon = {};
        Object.keys(n).forEach(function (k) { ohneTon[k] = n[k]; });
        ohneTon.sprach = "";
        ohneTon.sprachImLager = true;
        ohneTon.sprachWeg = false;
        return ohneTon;
      }
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
    if (a && !/^(https?:|data:image\/|emoji:)/i.test(a) && !aufkleberPfad(a)) return false;
    zustand.ichBild = a;
    try {
      if (a) localStorage.setItem(BILD_SCHLUESSEL, a);
      else localStorage.removeItem(BILD_SCHLUESSEL);
    } catch (e) {}
    if (a && !/^emoji:/i.test(a) && !aufkleberPfad(a)) bildGemerkt(a);
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

  /* =========================================================
     DIE VERBINDUNGSWACHE — MESSEN STATT RATEN
     ---------------------------------------------------------
     GEMELDET, und zwar mit einer sehr genauen Beobachtung:
     „Man sieht, wenn jemand spricht — aber man hoert ihn nicht.
      Emmi hat mich ganz kurz am Anfang gehoert, danach nichts mehr.
      Bei iPhone-Leuten geht es sofort, bei Android nicht."

     Diese Beobachtung ist der Schluessel, und sie sagt etwas sehr
     Bestimmtes: die SPRECHANZEIGE laeuft ueber Supabase (sie wird im
     Puls mitgeschickt), der TON dagegen laeuft direkt von Geraet zu
     Geraet ueber WebRTC. Wer den anderen sprechen SIEHT, aber nicht
     HOERT, hat also eine funktionierende Vermittlung und eine
     kaputte Medienstrecke. Das ist kein Tonproblem im Browser,
     sondern ein Wegeproblem im Netz.

     Der Weg kommt zustande, wenn wenigstens einer der beiden
     Anschluesse von aussen erreichbar ist. Ueber Mobilfunk (und in
     vielen Laendern grundsaetzlich) ist das bei KEINEM der beiden so;
     dann braucht es ein Relais — einen TURN-Server, der die Pakete
     weiterreicht. Steht keines zur Verfuegung, passiert genau das,
     was er beschreibt: alles sieht gut aus, nur es kommt nichts an.

     Statt weiter zu raten, misst die Wache jetzt nach:
       * welcher Weg wurde gewaehlt (direkt, ueber STUN, ueber Relais)?
       * kommen ueberhaupt Tonpakete an (bytesReceived)?
     Bleibt es nach acht Sekunden bei null, steht es in klaren Worten
     im Chat — und /verbindung zeigt den ganzen Befund. */
  var wache = {};
  function wacheStarten(anderId, pc) {
    wacheBeenden(anderId);
    var w = { bytes: 0, letzte: 0, weg: "", gemeldet: false, neustart: false,
              seit: Date.now(), zustand: "" };
    wache[anderId] = w;
    w.uhr = setInterval(function () {
      if (!pc || pc.connectionState === "closed") { wacheBeenden(anderId); return; }
      w.zustand = pc.iceConnectionState || "";
      if (!pc.getStats) return;
      pc.getStats(null).then(function (berichte) {
        var bytes = 0, paare = {}, kandidaten = {};
        berichte.forEach(function (b) {
          if (b.type === "inbound-rtp" && b.kind === "audio") bytes += b.bytesReceived || 0;
          if (b.type === "candidate-pair" && (b.selected || b.state === "succeeded")) paare[b.id] = b;
          if (b.type === "local-candidate" || b.type === "remote-candidate") kandidaten[b.id] = b;
        });
        Object.keys(paare).forEach(function (id) {
          var p = paare[id];
          var l = kandidaten[p.localCandidateId], r = kandidaten[p.remoteCandidateId];
          if (l || r) {
            w.weg = ((l && l.candidateType) || "?") + " \u2194 " + ((r && r.candidateType) || "?");
          }
        });
        w.bytes = bytes;
        if (bytes > w.letzte) { w.letzte = bytes; w.tonDa = true; }
        /* Acht Sekunden ohne ein einziges Tonpaket: das ist kein
           Zufall mehr, das ist eine tote Strecke. */
        if (!w.tonDa && !w.gemeldet && Date.now() - w.seit > 8000) {
          w.gemeldet = true;
          var p2 = zustand.leute[anderId];
          var name = (p2 && p2.name) || "Jemand";
          systemZeile("\u26a0\ufe0f Von " + name + " kommt kein Ton an (Weg: "
            + (w.weg || "keiner gefunden") + ", Zustand: " + (w.zustand || "?")
            + "). Das ist eine Netzsperre zwischen euren Anschluessen \u2014 "
            + "dagegen hilft nur ein Relais. Tippe /verbindung fuer den Befund.");
        }
      }).catch(function () {});
    }, 2500);
  }
  function wacheBeenden(id) {
    var w = wache[id];
    if (w && w.uhr) clearInterval(w.uhr);
    delete wache[id];
  }
  function verbindungsBericht() {
    var zeilen = [];
    Object.keys(brueckeJe).forEach(function (id) {
      var p = zustand.leute[id], w = wache[id] || {};
      var pc = brueckeJe[id];
      zeilen.push(((p && p.name) || id.slice(0, 6))
        + ": " + (pc ? (pc.connectionState || "?") : "keine Leitung")
        + " / Weg " + (w.weg || "noch keiner")
        + " / Ton " + (w.tonDa ? "kommt an (" + Math.round((w.bytes || 0) / 1024) + " kB)" : "KEINER"));
    });
    if (!zeilen.length) zeilen.push("Es besteht gerade keine Leitung zu jemandem.");
    /* Und was ueberhaupt zur Verfuegung steht. */
    var relais = VERMITTLER.filter(function (v) {
      return String(v.urls || "").indexOf("turn") === 0;
    }).length;
    zeilen.push("Relais eingetragen: " + relais
      + (window.DMA_TURN && window.DMA_TURN.length ? " (eigene)" : " (oeffentliche)"));
    return zeilen.join("\n");
  }

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
      tonAnschliessen(anderId, p.strom);
      melden();
    };
    pc.oniceconnectionstatechange = function () {
      /* „disconnected" ist oft nur ein Netzwechsel (WLAN auf Mobilfunk).
         Ein Neustart der Wegesuche holt die Leitung zurück, ohne alles
         abzureissen. */
      if (pc.iceConnectionState === "disconnected" && pc.restartIce) {
        try { pc.restartIce(); } catch (e) {}
      }
      /* „failed" heisst: es gibt keinen Weg. Genau dann ist ein Relais
         noetig — einmal neu suchen, und wenn das auch nichts wird,
         sagt es die Wache weiter unten in klaren Worten. */
      if (pc.iceConnectionState === "failed") {
        var w = wache[anderId];
        if (w && !w.neustart && pc.restartIce) {
          w.neustart = true;
          try { pc.restartIce(); } catch (e) {}
        }
      }
    };
    wacheStarten(anderId, pc);
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

  /* =========================================================
     DER TON HÄNGT NICHT AM BILDSCHIRM
     ---------------------------------------------------------
     GEMELDET: „Achte auch darauf, wenn ich mit jemandem spreche und
     der Chat ist abgelegt, dass ich den anderen noch höre, er mich
     auch noch, sieht in der Kamera."

     Der Ton lief bisher über die <video>-Elemente im Klassenzimmer.
     Wer den Bereich verlässt und die Seite weiterblättert, bekommt
     diese Elemente aber nicht mehr neu gesetzt — und wer WÄHREND
     dieser Zeit dazukam, hatte nie eines. Dann steht die Leitung, und
     trotzdem hört man nichts.

     Deshalb hängt zu jeder Person zusätzlich ein <audio> DIREKT am
     Seitenkörper. Es ist unsichtbar, es hat nichts mit der Ansicht zu
     tun, und es lebt genau so lange wie die Leitung. Das Bild bleibt
     Sache der Oberfläche; der TON hört nie auf, nur weil man
     weiterblättert. */
  var tonJe = {};
  function tonAnschliessen(id, strom) {
    if (!strom || typeof document === "undefined") return;
    var a = tonJe[id];
    if (!a) {
      /* Erst aus dem freigeschalteten Vorrat nehmen — ein Element, das
         schon einmal gespielt hat, darf ohne Rueckfrage weiterspielen.
         Nur wenn der Vorrat leer ist, wird ein neues gebaut (und dann
         greift notfalls der Nachhol-Horcher). */
      a = tonVorrat.shift() || null;
      if (!a) {
        try {
          a = document.createElement("audio");
          a.autoplay = true;
          a.setAttribute("playsinline", "");
          a.style.display = "none";
          document.body.appendChild(a);
        } catch (e) { return; }
      }
      tonJe[id] = a;
    }
    if (a.srcObject !== strom) {
      a.srcObject = strom;
      tonAbspielenVersuchen(a);
    }
  }

  /* =========================================================
     WENN DER BROWSER DEN TON VERWEIGERT
     ---------------------------------------------------------
     GEMELDET, immer wieder: „Man hoert die anderen nicht" — und zwar
     auf iPhone und auf Android im Safari.

     Der Grund ist fast nie die Leitung, sondern die Autoplay-Sperre:
     a.play() gibt ein Versprechen zurueck, das ABGELEHNT wird, wenn
     der Browser gerade keine Berechtigung sieht, von sich aus Ton zu
     machen. Bisher wurde diese Ablehnung verschluckt — dann ist es
     einfach still, ohne Meldung, ohne Erklaerung. Genau das ist der
     schlimmste Fall: man sitzt da und weiss nicht, woran es liegt.

     Jetzt wird die Ablehnung gemerkt: das Element kommt auf einen
     Stapel, beim naechsten Antippen IRGENDWO auf der Seite wird es
     nachgeholt, und im Chat steht einmal eine Zeile, die sagt, was zu
     tun ist. Ein Tipp genuegt, weil danach eine echte Nutzergeste
     vorliegt — genau das verlangen die Browser. */
  var tonWartet = [];
  var tonHorcherDa = false;
  var tonHinweisGezeigt = false;

  /* =========================================================
     DEN TON IM VORAUS FREISCHALTEN — statt hinterher zu bitten
     ---------------------------------------------------------
     GEFRAGT: „Wie koennen wir das erzwingen, dass der Ton trotzdem
     durchkommt, ohne dass man tippen muss? Ich habe doch sowieso
     immer irgendwo hingetippt."

     Er hat recht, und der Einwand trifft genau den Punkt: ein
     Antippen IRGENDWO reicht den Browsern eben NICHT. Was zaehlt,
     ist, dass ein Ton-Element WAEHREND einer Beruehrung zu spielen
     beginnt. Danach gilt es als freigeschaltet und darf spaeter von
     sich aus weiterspielen — auch mit einem ganz anderen Inhalt.

     Deshalb wird jetzt beim Druck auf „hinein" — also in genau dem
     Augenblick, in dem die Beruehrung noch zaehlt — Folgendes getan:
       1. der AudioContext geweckt (Safari haelt ihn sonst angehalten);
       2. ein Vorrat von acht <audio> angelegt, die SOFORT anfangen,
          eine Stille abzuspielen. Sie sind damit freigeschaltet.
     Kommt spaeter eine echte Stimme, bekommt sie eines dieser
     Elemente — es spielt, ohne noch einmal zu fragen.

     Das ist derselbe Weg, den Clubhouse und HelloTalk gehen. Der
     Nachhol-Horcher von vorher bleibt trotzdem als letztes Netz. */
  var tonKontext = null;
  var tonVorrat = [];
  function tonFreischalten() {
    if (typeof document === "undefined") return false;
    var stille = null;
    try {
      var K = window.AudioContext || window.webkitAudioContext;
      if (K) {
        if (!tonKontext) tonKontext = new K();
        if (tonKontext.state === "suspended" && tonKontext.resume) tonKontext.resume();
        /* Ein Hauch von nichts abspielen: das weckt die Tonausgabe. */
        var q = tonKontext.createBufferSource();
        q.buffer = tonKontext.createBuffer(1, 1, 22050);
        q.connect(tonKontext.destination);
        if (q.start) q.start(0);
        /* Und eine echte, stille Spur fuer die Vorrats-Elemente. */
        if (tonKontext.createMediaStreamDestination) {
          stille = tonKontext.createMediaStreamDestination().stream;
        }
      }
    } catch (e) {}
    for (var i = tonVorrat.length; i < 8; i++) {
      try {
        var a = document.createElement("audio");
        a.autoplay = true;
        a.setAttribute("playsinline", "");
        a.style.display = "none";
        document.body.appendChild(a);
        if (stille) a.srcObject = stille;
        var v = a.play();
        if (v && v.catch) v.catch(function () {});
        a.dataset.frei = "1";
        tonVorrat.push(a);
      } catch (e) {}
    }
    return tonVorrat.length > 0;
  }
  /* =========================================================
     EINEN TON AUS DEM FREIGESCHALTETEN VORRAT SPIELEN
     ---------------------------------------------------------
     GEMELDET: „Die Sprachnachrichten sind nicht automatisch von
     alleine hoerbar … vielleicht kannst du eine Programmroutine
     machen, dass du das Audio abfaengst und genauso behandelst wie
     die Programmroutine von den Animationen."

     Der Gedanke trifft genau: ein FRISCH erzeugtes Ton-Element darf
     ohne Beruehrung nicht spielen — egal was drin ist. Ein Element
     aus dem Vorrat DARF es, weil es waehrend der Beruehrung beim
     Betreten schon einmal gespielt hat. Danach gilt es als
     freigeschaltet, auch mit einem ganz anderen Inhalt.

     Genau darum liegen acht Stueck bereit. Sie waren bisher nur fuer
     die Stimmen der anderen da; jetzt spielt auch die Sprachnachricht
     darueber — und faellt, wenn keines frei ist, auf ein neues
     Element zurueck (das dann eben um Erlaubnis bitten muss).
     ========================================================= */
  function tonAusVorrat(quelle, beiEnde) {
    if (typeof document === "undefined" || !quelle) return false;
    var frei = null;
    for (var i = 0; i < tonVorrat.length; i++) {
      var k = tonVorrat[i];
      if (!k.dataset.belegt) { frei = k; break; }
    }
    var neu = false;
    if (!frei) {
      try {
        frei = document.createElement("audio");
        frei.setAttribute("playsinline", "");
        frei.style.display = "none";
        document.body.appendChild(frei);
        neu = true;
      } catch (e) { return false; }
    }
    frei.dataset.belegt = "1";
    try { frei.srcObject = null; } catch (e) {}
    frei.src = quelle;
    frei.currentTime = 0;
    frei.volume = 1;
    var aufraeumen = function () {
      frei.onended = null; frei.onerror = null;
      frei.dataset.belegt = "";
      try { frei.removeAttribute("src"); frei.load(); } catch (e) {}
      if (neu && frei.parentNode) frei.parentNode.removeChild(frei);
      if (typeof beiEnde === "function") beiEnde();
    };
    frei.onended = aufraeumen;
    frei.onerror = aufraeumen;
    tonAbspielenVersuchen(frei);
    return true;
  }

  function tonAbspielenVersuchen(a) {
    var v;
    try { v = a.play(); } catch (e) { v = null; }
    if (v && v.catch) {
      v.catch(function () {
        if (tonWartet.indexOf(a) < 0) tonWartet.push(a);
        tonNachholenAnmelden();
        if (!tonHinweisGezeigt) {
          tonHinweisGezeigt = true;
          systemZeile("Dein Browser l\u00e4sst den Ton noch nicht durch \u2014 tipp einmal irgendwo auf die Seite, dann h\u00f6rst du die anderen.");
        }
      });
    }
  }
  function tonNachholenAnmelden() {
    if (tonHorcherDa || typeof document === "undefined") return;
    tonHorcherDa = true;
    var arten = ["pointerdown", "touchend", "keydown"];
    var nachholen = function () {
      arten.forEach(function (art) { document.removeEventListener(art, nachholen, true); });
      tonHorcherDa = false;
      var warten = tonWartet.splice(0);
      warten.forEach(function (a) {
        try { var v = a.play(); if (v && v.catch) v.catch(function () {}); } catch (e) {}
      });
    };
    arten.forEach(function (art) {
      document.addEventListener(art, nachholen, { capture: true, passive: true });
    });
  }
  function tonAbklemmen(id) {
    var a = tonJe[id];
    if (!a) return;
    delete tonJe[id];
    try {
      a.srcObject = null;
      /* Ein freigeschaltetes Element wegzuwerfen waere Verschwendung —
         freigeschaltet wird nur bei einer Beruehrung, und die hat man
         nicht noch einmal. Es geht zurueck in den Vorrat. */
      if (a.dataset && a.dataset.frei === "1" && tonVorrat.length < 8) tonVorrat.push(a);
      else a.remove();
    } catch (e) {}
  }
  function tonAlleAbklemmen() {
    Object.keys(tonJe).forEach(tonAbklemmen);
    tonWartet = [];
    tonHinweisGezeigt = false;
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
    wacheBeenden(id);
    tonAbklemmen(id);
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
      /* Die Sitzordnung der anderen uebernehmen, aber nur, was man
         nicht selbst schon weiss — sonst wuerde ein alter Puls einen
         frischen Tausch wieder umwerfen. */
      if (n.sitz && typeof n.sitz === "object") {
        var neuerSitz = false;
        Object.keys(n.sitz).forEach(function (id) {
          if (sitzTausch[id] == null && typeof n.sitz[id] === "number") {
            sitzTausch[id] = n.sitz[id];
            neuerSitz = true;
          }
        });
        if (neuerSitz) melden();
      }
      var neuDa = !zustand.leute[n.von];
      personMerken(n.von, n.name, n.bild);
      if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
      if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
      personEintragen(n);
      /* Steht noch keine Leitung zu ihm, wird sie jetzt aufgebaut —
         so findet man auch jemanden, dessen Gruss man verpasst hat. */
      if (neuDa || !brueckeJe[n.von]) {
        if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
        else senden({ art: "auch-da", an: n.von, name: zustand.ichName,
                      tonAn: zustand.tonAn, bildAn: zustand.bildAn, bild: zustand.ichBild,
                      seit: zustand.seit, buehne: zustand.buehne });
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
      personEintragen(n);
      if (!warSchonDa) kommtUndGeht(n.name || "Jemand", true);
      /* GEWÜNSCHT: „Wenn ich den Hintergrund einstelle, dass der für
         alle sichtbar ist."

         Der Hintergrund gehört damit zum RAUM, nicht zum Gerät — genau
         wie das Thema. Er fährt deshalb im Willkommensgruss mit: wer
         hereinkommt, sieht ihn sofort, ohne dass ihn jemand neu setzen
         muss. Es gibt keinen Server, der ihn aufheben könnte; die
         Leute im Raum SIND das Gedächtnis des Raums. Ist der Raum
         leer, fängt er wieder beim Standard an — das ist ehrlicher
         als ein Hintergrund, der jemandem gehört, der längst weg ist. */
      senden({ art: "auch-da", an: n.von, name: zustand.ichName, tonAn: zustand.tonAn,
               bildAn: zustand.bildAn, bild: zustand.ichBild, farbe: zustand.farbe,
               haeuptling: zustand.haeuptling, thema: zustand.thema,
               seit: zustand.seit, buehne: zustand.buehne,
               raumHg: zustand.raumHg || "",
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
      /* Den Hintergrund des Raums übernehmen — aber nur, wenn man noch
         keinen hat. Sonst überschreiben sich zwei Leute, die
         gleichzeitig hereinkommen, gegenseitig. */
      if (typeof n.raumHg === "string" && n.raumHg && !zustand.raumHg) {
        zustand.raumHg = n.raumHg;
        if (typeof zustand.raumHgRuf === "function") zustand.raumHgRuf(zustand.raumHg);
      }
      if (typeof n.abgeschlossen === "boolean") zustand.abgeschlossen = n.abgeschlossen;
      if (typeof n.farbe === "string") zustand.leute[n.von].farbe = n.farbe;
      if (typeof n.tonAn === "boolean") zustand.leute[n.von].tonAn = n.tonAn;
      if (typeof n.bildAn === "boolean") zustand.leute[n.von].bildAn = n.bildAn;
      personEintragen(n);
      if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
      melden();
      return;
    }
    if (n.art === "sitzplatz") {
      /* Zwei Leute haben die Plaetze getauscht. Alle uebernehmen
         dieselbe Zuordnung — sonst sitzt man auf jedem Bildschirm
         woanders. */
      if (n.ordnung && typeof n.ordnung === "object") {
        Object.keys(n.ordnung).forEach(function (id) {
          if (typeof n.ordnung[id] === "number") sitzTausch[id] = n.ordnung[id];
        });
      }
      if (n.text) systemZeile(n.text);
      melden();
      return;
    }
    if (n.art === "hintergrund") {
      /* Jemand hat den Hintergrund des Raums gewechselt. Alle sehen
         ihn, und im Chat steht, wer es war — ein Raum, der sich ohne
         Erklärung umfärbt, ist unheimlich. */
      zustand.raumHg = typeof n.hg === "string" ? n.hg : "";
      if (typeof zustand.raumHgRuf === "function") zustand.raumHgRuf(zustand.raumHg);
      systemZeile((n.name || "Jemand") + (zustand.raumHg
        ? " hat den Hintergrund gewechselt."
        : " hat den Hintergrund auf den Standard zurückgesetzt."));
      melden();
      return;
    }
    if (n.art === "tschuess") {
      if (zustand.leute[n.von]) kommtUndGeht(zustand.leute[n.von].name || "Jemand", false);
      brueckeAbbauen(n.von);
      delete zustand.leute[n.von];
      grossVergessen(n.von);
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
    if (n.art === "redet") {
      if (zustand.leute[n.von]) {
        zustand.leute[n.von].spricht = Boolean(n.spricht);
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
        personEintragen(n);
        melden();
      }
      return;
    }
    if (n.art === "text") {
      /* Eine Sprachnachricht hat weder Text noch Bild — ohne diese
         Ausnahme wuerde sie hier stillschweigend weggeworfen. */
      if (!n.text && !n.bildImChat && !n.sprach) return;
      nachrichtAnhaengen({
        id: n.id || String(Date.now()) + n.von,
        von: n.von, name: n.name || "Gast",
        text: String(n.text || "").slice(0, CHAT_LAENGE),
        zeit: n.zeit || Date.now(), eigen: false, bild: n.bild || "",
        art: n.chatArt || "text",
        wirkung: n.wirkung || "",
        /* WEN es trifft, muss mitkommen — sonst spielt die Umarmung
           beim Empfaenger auf allen Plaetzen statt auf dem richtigen. */
        wen: n.wen || "",
        an: n.an || "",
        farbe: n.farbe || (zustand.leute[n.von] && zustand.leute[n.von].farbe) || "",
        bildImChat: typeof n.bildImChat === "string" ? n.bildImChat.slice(0, 200000) : "",
        /* Die Sprachnachricht faehrt mit und wird beim Zeichnen SOFORT
           abgespielt (app.js). Sie wird nirgends gesichert. */
        sprach: typeof n.sprach === "string" ? n.sprach.slice(0, 200000) : "",
        sprachSek: Number(n.sprachSek) || 0
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
        /* „wen" MUSS mit. Es ist der Name dessen, den eine Wirkung
           trifft — ohne ihn steht beim Nachzuegler zwar „Bert drueckt
           Emmi" im Text, die Zeile selbst weiss aber nicht mehr, wen.
           Beim Umbenennen von „an" auf „wen" (weil „an" eine Kennung
           ist und jedes fremde Geraet die Nachricht deshalb wegwarf)
           war genau diese eine Stelle uebersehen worden. */
        return { id: n.id, von: n.von, name: n.name, text: n.text, art: n.art || "text",
                 bild: n.bild || "", bildImChat: n.bildImChat || "", farbe: n.farbe || "",
                 wirkung: n.wirkung || "", wen: n.wen || "", an: n.an || "", zeit: n.zeit };
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

  /* Was ein Anwesenheitspaket ueber jemanden sagt: wann er gekommen
     ist (bestimmt die Sitzordnung, ueberall gleich), ob er auf der
     Buehne sitzt oder nur zuschaut, und ob er gerade redet. */
  function personEintragen(n) {
    var p = zustand.leute[n.von];
    if (!p) return;
    if (typeof n.seit === "number" && n.seit > 0) p.seit = n.seit;
    if (typeof n.buehne === "boolean") p.buehne = n.buehne;
    if (typeof n.spricht === "boolean") p.spricht = n.spricht;
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
               bildAn: zustand.bildAn, bild: zustand.ichBild,
               seit: zustand.seit, buehne: zustand.buehne, spricht: zustand.spricht,
               /* Damit Spaeterkommende dieselbe Sitzordnung sehen. */
               sitz: sitzTausch });
      var jetzt = Date.now(), weg = false;
      Object.keys(zustand.leute).forEach(function (id) {
        if (jetzt - (zustand.leute[id].gesehen || 0) > VERFALL_MS) {
          brueckeAbbauen(id);
          delete zustand.leute[id];
          grossVergessen(id);
          weg = true;
        }
      });
      if (weg) melden();
    }, PULS_MS);
  }
  function pulsStoppen() { if (pulsUhr) { clearInterval(pulsUhr); pulsUhr = null; } }

  /* =========================================================
     DER WÄCHTER
     ---------------------------------------------------------
     GEMELDET: „Das mit dem Video und der Stimme geht zum Teil …
     Das soll aber stabiler laufen, dass das nicht mehr so eine
     Glückssache ist. Und ich glaube, Emmy aus Ägypten sieht uns
     immer noch nicht."

     Warum es eine Glückssache war: eine Direktverbindung wird EINMAL
     aufgebaut. Klappt das nicht — weil die erste Wegesuche in ein
     strenges Netz läuft, weil ein Angebot im falschen Moment ankommt,
     weil zwei Seiten gleichzeitig anrufen —, dann bleibt es dabei.
     Niemand versucht es noch einmal. Der Chat lief, die Leitung nicht,
     und man sass da und wartete.

     Der Wächter schaut deshalb alle vier Sekunden nach:

       1. Steht jemand in der Anwesenheit, ohne dass es überhaupt eine
          Leitung zu ihm gibt? Dann wird angerufen. (Das ist Emmys
          Fall: ihr „hallo" ist verlorengegangen, und danach hat es
          niemand mehr versucht.)
       2. Gibt es eine Leitung, die nach sechs Sekunden noch nicht
          steht? Dann erst die Wegesuche neu starten (billig, reisst
          nichts ab).
       3. Steht sie nach weiteren sechs Sekunden immer noch nicht?
          Dann wird die Leitung abgerissen und von vorn aufgebaut.

     Angerufen wird dabei immer nur von EINER Seite — von der mit der
     kleineren Kennung. Sonst rufen sich beide gleichzeitig an, und
     genau daran geht eine Aushandlung kaputt.

     Aufgegeben wird nach dem vierten Anlauf nicht; nur der Abstand
     wächst, damit ein Gerät, das wirklich nicht durchkommt (sehr
     strenge Firmen- oder Landesnetze), nicht ununterbrochen probiert.
     ========================================================= */
  var WACHE_MS = 4000;
  var GEDULD_MS = 6000;        // so lange darf eine Leitung brauchen
  var wacheUhr = null;
  var versuchJe = {};          // Kennung -> { seit, stufe, anlaeufe }
  var letzterLeitungsstand = "";

  function steht(pc) {
    return pc && (pc.connectionState === "connected"
               || pc.iceConnectionState === "connected"
               || pc.iceConnectionState === "completed");
  }

  function wacheStarten() {
    wacheStoppen();
    versuchJe = {};
    wacheUhr = setInterval(function () {
      if (zustand.lage !== "drin") return;
      var jetzt = Date.now();
      /* Hat sich am Stand der Leitungen etwas geaendert? Dann muss die
         Oberflaeche es erfahren — sie zeigt ihn an. */
      var stand = leitungen().map(function (v) {
        return v.id + ":" + (v.steht ? "1" : "0");
      }).join(",");
      if (stand !== letzterLeitungsstand) { letzterLeitungsstand = stand; melden(); }

      /* 1. Wer ist da, hat aber keine Leitung? */
      Object.keys(zustand.leute).forEach(function (id) {
        if (id === zustand.ichId) return;
        if (brueckeJe[id]) return;
        /* Nur die Seite mit der kleineren Kennung ruft an — sonst
           rufen beide gleichzeitig, und die Aushandlung zerbricht. */
        if (zustand.ichId >= id) return;
        var v = versuchJe[id] || (versuchJe[id] = { seit: 0, stufe: 0, anlaeufe: 0 });
        var wartezeit = Math.min(30000, GEDULD_MS * (1 + v.anlaeufe));
        if (jetzt - v.seit < wartezeit) return;
        v.seit = jetzt; v.stufe = 0; v.anlaeufe++;
        anrufen(id);
      });

      /* 2. und 3. Leitungen, die nicht zustande kommen. */
      Object.keys(brueckeJe).forEach(function (id) {
        var pc = brueckeJe[id];
        if (steht(pc)) { delete versuchJe[id]; return; }
        var v = versuchJe[id] || (versuchJe[id] = { seit: jetzt, stufe: 0, anlaeufe: 0 });
        if (!v.seit) v.seit = jetzt;
        if (jetzt - v.seit < GEDULD_MS) return;
        v.seit = jetzt;
        if (v.stufe === 0) {
          /* Erst das Billige: die Wegesuche neu starten. */
          v.stufe = 1;
          try { if (pc.restartIce) pc.restartIce(); } catch (e) {}
          if (zustand.ichId < id) anrufen(id);
          return;
        }
        /* Dann das Gründliche: abreissen und neu aufbauen. */
        v.stufe = 0;
        v.anlaeufe++;
        brueckeAbbauen(id);
        if (zustand.ichId < id) {
          setTimeout(function () {
            if (zustand.lage === "drin" && !brueckeJe[id]) anrufen(id);
          }, 400);
        } else {
          /* Die andere Seite ruft an — ihr sagen, dass sie es soll. */
          senden({ art: "hallo", name: zustand.ichName, tonAn: zustand.tonAn,
                   bildAn: zustand.bildAn, bild: zustand.ichBild, farbe: zustand.farbe,
                   seit: zustand.seit, buehne: zustand.buehne });
        }
      });
    }, WACHE_MS);
  }
  function wacheStoppen() {
    if (wacheUhr) { clearInterval(wacheUhr); wacheUhr = null; }
    versuchJe = {};
    letzterLeitungsstand = "";
  }

  /* Wie steht es gerade um die Leitungen? Das zeigt die Oberfläche an,
     damit man nicht rät, ob es an einem selbst liegt. */
  function leitungen() {
    var raus = [];
    Object.keys(zustand.leute).forEach(function (id) {
      if (id === zustand.ichId) return;
      var pc = brueckeJe[id];
      raus.push({
        id: id,
        name: zustand.leute[id].name || "",
        steht: steht(pc),
        lage: pc ? (pc.connectionState || pc.iceConnectionState || "?") : "keine",
        anlaeufe: (versuchJe[id] || {}).anlaeufe || 0
      });
    });
    return raus;
  }

  function nachrichtAnhaengen(n) {
    /* Dieselbe Nachricht kann zweimal ankommen (Neuladen, Puls).
       Sie hat eine Kennung — damit lässt sich das ausschliessen. */
    if (n.id && zustand.nachrichten.some(function (a) { return a.id === n.id; })) return;
    zustand.nachrichten.push(n);
    if (zustand.nachrichten.length > CHAT_SICHT) {
      zustand.nachrichten = zustand.nachrichten.slice(-CHAT_SICHT);
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
    zustand.betreiber = Boolean(o.betreiber);
    zustand.ichId = eigeneId();
    zustand.ichName = o.name || "Gast";
    zustand.lage = "verbindet";
    zustand.fehler = "";
    zustand.ichBild = o.bild || bildLaden();
    zustand.farbe = o.farbe || zustand.farbe || gemerkteFarbe();
    zustand.schrift = gemerkteSchrift();
    zustand.buehne = o.buehne !== false;
    platzJe = {};                 // neuer Raum, neue Sitzordnung
    sitzTausch = {};              // und kein Tausch aus dem alten Raum
    zustand.seit = Date.now();
    zustand.spricht = false;
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
      lautstaerkeVerfolgen(strom);        // wer redet, bekommt einen Ring

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
                     tonAn: zustand.tonAn, bildAn: zustand.bildAn,
                     seit: zustand.seit, buehne: zustand.buehne });
            pulsStarten();
            wacheStarten();          // die Leitungen im Auge behalten
            postKanalOeffnen();
            /* WER IST HÄUPTLING?
               Nach RFC 2811 „besitzen" die Operatoren den Kanal, und
               der Rang gilt nur, solange man drin ist: wer geht,
               verliert ihn; wer einen leeren Kanal betritt, bekommt
               ihn. Genau so ist es hier. Deshalb wird erst nach der
               Begrüssungsrunde entschieden — vorher weiss man ja
               nicht, ob schon jemand da ist. */
            /* GEMELDET: „Ich muss OP sein, wenn ich das Klassenzimmer
               betrete."
               Er hatte recht, und der Grund stand eine Zeile weiter
               oben: „if (zustand.raum === HAUPTRAUM) return" — im
               HAUPTKLASSENZIMMER wurde nie jemand Häuptling, auch der
               Betreiber nicht. Das war für einen offenen Raum gedacht,
               in dem nicht der Erste alle anderen rauswerfen können
               soll. Für den Betreiber gilt das nicht: es ist seine
               Seite.
               Deshalb jetzt zwei Wege zum Häuptling:
                 * Betreiber: immer und überall, sofort;
                 * alle anderen: wie bisher, wer einen leeren Raum
                   aufmacht — und im Hauptraum weiterhin niemand. */
            if (zustand.betreiber && !zustand.haeuptling) {
              zustand.haeuptling = true;
              systemZeile("\ud83e\udd8a Du bist hier Häuptling — als Betreiber in jedem Raum. "
                + "/t Thema · /i einladen · /lock abschließen · /k rauswerfen");
            }
            setTimeout(function () {
              if (zustand.lage !== "drin") return;
              if (zustand.haeuptling) return;
              if (zustand.raum === HAUPTRAUM) return;
              if (Object.keys(zustand.leute).length === 0) {
                zustand.haeuptling = true;
                systemZeile("Der Raum war leer — du bist hier Häuptling. "
                  + "/t Thema · /i Nickname einladen · /lock abschließen · /k Nickname");
              }
            }, 1600);
            praesenzZuhoeren(kontoId || zustand.ichId);
            praesenzSetzen(true, zustand.ichName);
            melden();
            /* GEWÜNSCHT: „Wichtig ist, dass in dem Moment, wo man
               reingeht, alles aktualisiert ist und synchronisiert mit
               den anderen."

               Der Gruss „hallo" geht genau einmal hinaus, und die
               anderen antworten mit „auch-da". Geht dieser eine Gruss
               verloren — und im Mobilfunk geht der erste Rundruf nach
               dem Verbinden erfahrungsgemäss am ehesten verloren —,
               sitzt man in einem Raum, in dem scheinbar niemand ist,
               während die anderen einen nicht sehen.

               Deshalb wird nachgefasst: sagt die Anwesenheit, dass
               noch jemand in diesem Raum ist, wir aber nach zwei
               Sekunden von niemandem gehört haben, geht der Gruss
               noch einmal. Das kostet einen Rundruf und erspart das
               „ich sehe die anderen nicht". */
            setTimeout(function () {
              if (zustand.lage !== "drin") return;
              if (Object.keys(zustand.leute).length) return;
              var andereDa = false;
              Object.keys(praesenzDa).forEach(function (k) {
                var e = praesenzDa[k];
                if (e && e.raum === zustand.raum && k !== praesenzIch) andereDa = true;
              });
              if (!andereDa) return;
              senden({ art: "hallo", name: zustand.ichName, bild: zustand.ichBild,
                       tonAn: zustand.tonAn, bildAn: zustand.bildAn,
                       seit: zustand.seit, buehne: zustand.buehne });
            }, 2200);
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
    wacheStoppen();
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
    tonAlleAbklemmen();
    lautstaerkeStoppen();
    if (zustand.eigenerStrom) {
      try { zustand.eigenerStrom.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    }
    zustand.eigenerStrom = null;
    zustand.leute = {};
    zustand.gross = null;
    zustand.grosse = [];
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
      lautstaerkeVerfolgen(zustand.eigenerStrom);
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
  /* =========================================================
     MEHRERE GROSS — GESTAPELT STATT EINZELN
     ---------------------------------------------------------
     GEWÜNSCHT: „Man soll sich rechts am Rand auch mehrere Videos
     übereinander stapeln koennen."

     Vorher war „gross" EINE Kennung: wer ein zweites Gesicht
     gross machte, verlor das erste. Jetzt ist es eine Liste,
     und ein zweiter Tipp auf dieselbe Person nimmt sie wieder
     heraus — dasselbe Antippen, das sie hereingeholt hat.

     Höchstens vier. Nicht aus Sparsamkeit: auf einem Telefon
     ist rechts Platz für vier Kacheln, und die fünfte würde
     entweder unten herausragen oder alle so klein machen, dass
     man niemanden mehr erkennt.

     zustand.gross bleibt als ERSTE Kennung erhalten, damit
     nichts bricht, was bisher danach gefragt hat. */
  var GROSS_HOECHSTENS = 4;
  function grossZeigen(id) {
    if (!id) { zustand.grosse = []; zustand.gross = null; melden(); return; }
    var i = zustand.grosse.indexOf(id);
    if (i >= 0) zustand.grosse.splice(i, 1);
    else {
      zustand.grosse.push(id);
      /* Die älteste weicht, nicht die neueste — wer gerade angetippt
         hat, will das Ergebnis sehen. */
      while (zustand.grosse.length > GROSS_HOECHSTENS) zustand.grosse.shift();
    }
    zustand.gross = zustand.grosse.length ? zustand.grosse[0] : null;
    melden();
  }
  function grossVergessen(id) {
    var i = zustand.grosse.indexOf(id);
    if (i >= 0) zustand.grosse.splice(i, 1);
    zustand.gross = zustand.grosse.length ? zustand.grosse[0] : null;
  }

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
  /* =========================================================
     DIE BEWEGTEN AUFKLEBER
     ---------------------------------------------------------
     GEMELDET: „Die GIPHY-Bilder gehen immer noch nicht auszusuchen.
     Man kann irgendwas reinschreiben, aber ich möchte, dass man
     anhand von Bildern irgendwas auswählt … es ist schon eine
     Auswahl da."

     Warum da nie etwas war: die Suche lief über den öffentlichen
     Beta-Schlüssel von GIPHY. Den gibt es seit Jahren nur noch dem
     Namen nach — er antwortet mit einem Fehler, und der Kasten blieb
     leer, egal was man eingetippt hat.

     Diese Auswahl gehört deshalb zum Haus. Es sind gezeichnete,
     bewegte Bilder (SVG mit Animation), sie liegen im Ordner
     sticker/, sie wiegen ein bis anderthalb Kilobyte und sie brauchen
     niemanden um Erlaubnis. Verschickt wird nur der NAME —
     „aufkleber:lachen" —, nicht das Bild; das Bild sucht sich die
     Gegenseite aus derselben Liste. Steht dort ein Name, den es nicht
     gibt, passiert nichts. Die GIPHY-Suche bleibt daneben bestehen
     für alle, die einen eigenen Schlüssel eintragen.
     ========================================================= */
  var AUFKLEBER = ["lachen", "zwinkern", "staunen", "traurig", "weinen",
                   "winken", "klatschen", "daumen", "herz", "denken", "idee",
                   "schlafen", "feuer", "stern", "pokal", "fuchs", "katze",
                   "kaffee", "party", "glocke", "musik", "schreiben", "warten",
                   "wachsen", "blume", "frage", "fertig", "regenbogen", "schnee",
                   /* NEU: „Aus der Wolke fallen Sterne — sollen das
                      eigentlich Regentropfen sein?" Der Schnee hat jetzt
                      richtige Kristalle, und der Regen ist ein eigener
                      Aufkleber mit richtigen Tropfen. */
                   "regen",
                   /* NEU: „Eine strahlende Sonne wuerde in die Emojis auch
                      noch passen oder eine Umarmung, was realistisch
                      aussieht." */
                   "sonne", "umarmung"];
  function aufkleberPfad(wert) {
    var m = /^aufkleber:([a-z]+)$/.exec(String(wert || ""));
    if (!m || AUFKLEBER.indexOf(m[1]) < 0) return "";
    return "sticker/" + m[1] + ".svg";
  }
  function aufkleberSenden(name, text) {
    var marke = "aufkleber:" + String(name || "").toLowerCase();
    if (!aufkleberPfad(marke)) return false;
    return bildSenden(marke, text);
  }

  var BILD_KANTE = 640;
  var BILD_HOECHST = 140000;      // Zeichen der Datenadresse

  /* =================================================================
     DIE EIGENE BILDERSAMMLUNG
     -----------------------------------------------------------------
     GEWUENSCHT: „Ich moechte, dass Leute Sachen zu ihrer eigenen
     Bibliothek hinzufuegen koennen. So transparente PNG-Files oder
     GIF-Files … genormt ist auf eine Groesse, so aehnlich wie die
     Fuechse."

     Zwei Dinge, die bildVerkleinern() NICHT kann und weshalb es hier
     eine eigene Funktion braucht:

       1. bildVerkleinern() gibt JPEG aus. JPEG kennt keine
          Durchsichtigkeit — ein transparentes PNG bekaeme dort einen
          schwarzen Klotz als Hintergrund. Hier wird PNG ausgegeben,
          die Durchsichtigkeit bleibt.
       2. Genormt heisst hier wirklich genormt: jedes Bild landet in
          einem Feld von 120 x 120, so gross wie die Aufkleber in
          sticker/ (die Fuechse). Es wird HINEINGEPASST, nicht
          beschnitten und nicht verzerrt, und mittig gesetzt — sonst
          haengen in der Sammlung lauter verschieden grosse Sachen
          nebeneinander.

     Ein bewegtes GIF kann man nicht ueber eine Leinwand schicken: es
     waere danach ein Standbild. Es geht deshalb unveraendert in die
     Sammlung, und die Norm macht der Rahmen beim Anzeigen. Dafuer ist
     es in der Groesse begrenzt — ein GIF von zwei Megabyte gehoert
     nicht in ein Profil, das auf jedem Handy geladen wird.
     ================================================================= */
  var BIB_KANTE = 120;            /* wie sticker/*.svg */
  var BIB_GIF_HOECHST = 320000;   /* Zeichen der Datenadresse, rund 240 KB */

  function bibliothekNormen(datei) {
    return new Promise(function (fertig, scheitern) {
      if (!datei || !/^image\//.test(datei.type || "")) {
        scheitern(new Error("Das ist kein Bild.")); return;
      }
      var leser = new FileReader();
      leser.onerror = function () { scheitern(new Error("Die Datei liess sich nicht lesen.")); };
      /* Der bewegte Weg: unveraendert uebernehmen, nur nicht zu gross. */
      if (/gif$/i.test(datei.type)) {
        leser.onload = function () {
          var d = String(leser.result || "");
          if (d.length > BIB_GIF_HOECHST) {
            scheitern(new Error("Das GIF ist zu gross (" + Math.round(d.length / 1400)
              + " KB). Bis etwa 230 KB geht es — sonst laedt es auf dem Handy zu lange."));
            return;
          }
          fertig(d);
        };
        leser.readAsDataURL(datei);
        return;
      }
      /* Der stehende Weg: auf 120 x 120 einpassen, Durchsichtigkeit behalten. */
      leser.onload = function () {
        var bild = new Image();
        bild.onerror = function () { scheitern(new Error("Das Bild liess sich nicht oeffnen.")); };
        bild.onload = function () {
          var tafel = document.createElement("canvas");
          tafel.width = BIB_KANTE; tafel.height = BIB_KANTE;
          var stift = tafel.getContext("2d");
          /* Kein Fuellen: was durchsichtig war, bleibt durchsichtig. */
          var k = Math.min(BIB_KANTE / bild.width, BIB_KANTE / bild.height);
          var b = Math.round(bild.width * k), h = Math.round(bild.height * k);
          stift.imageSmoothingQuality = "high";
          stift.drawImage(bild, Math.round((BIB_KANTE - b) / 2),
                                Math.round((BIB_KANTE - h) / 2), b, h);
          fertig(tafel.toDataURL("image/png"));
        };
        bild.src = String(leser.result || "");
      };
      leser.readAsDataURL(datei);
    });
  }

  function bildVerkleinern(datei, kante, hoechst) {
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
          var grenze = hoechst || BILD_HOECHST;
          var guete = 0.62, daten = tafel.toDataURL("image/jpeg", guete);
          while (daten.length > grenze && guete > 0.3) {
            guete -= 0.1;
            daten = tafel.toDataURL("image/jpeg", guete);
          }
          if (daten.length > grenze) {
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

  /* =========================================================
     SPRACHNACHRICHTEN — der Unterricht, wenn die Leitung nicht steht
     ---------------------------------------------------------
     GEWUENSCHT, und es ist eine gute Idee:
     „Sprachnachrichten, die einfach direkt abspielen wie die Sounds
      von den Animationen — also in dem Moment, wenn man sie schickt,
      werden sie hoerbar. Und wenn man sie sich spaeter noch mal
      anklickt, hoert man das als Einzelner nur noch privat. So
      koennen wir einen Pseudo-Livestream machen mit denen, die sich
      nicht mit mir verbinden koennen. So aehnlich wie man frueher
      diese Chats hatte, wo man die Hand gehoben hatte."

     Das ist kein Ersatz fuer eine echte Leitung, aber es ist der
     Unterschied zwischen „kann nicht mitmachen" und „kann
     mitmachen". Wer hinter einem Netz sitzt, durch das kein Tonpaket
     kommt, spricht eben zwoelf Sekunden auf Band — und die anderen
     hoeren es SOFORT, ohne zu tippen.

     DREI ENTSCHEIDUNGEN, und jede hat einen Grund:

     1. SOFORT HOERBAR, DANACH AUF TIPPEN.
        Beim Ankommen laeuft sie von selbst, wie ein Animationston.
        Spaeter antippen spielt sie nur noch fuer einen selbst ab —
        sonst platzt eine alte Nachricht mitten in den Unterricht.

     2. FLUECHTIG, NICHT GESPEICHERT.
        „Ob wir das temporaer machen oder ob uns das den Speicher
         zumailt. Ich glaub, das ist eher ne temporaere Geschichte."
        Genau so: die Aufnahme geht ueber den Kanal und liegt danach
        nur im Arbeitsspeicher der Anwesenden. Nichts davon geht in
        die Tabelle, nichts in den Zwischenspeicher des Geraets,
        nichts in den durchgereichten Verlauf. Wer spaeter kommt,
        sieht die Zeile — „🎤 Sprachnachricht (nicht mehr da)" — aber
        hoert sie nicht mehr. Das ist ehrlicher, als so zu tun, als
        waere sie noch da.

     3. KURZ UND KLEIN.
        Hoechstens 20 Sekunden und 120 KB. Ein Kanalpaket ist
        begrenzt; eine Minute Geschwaetz kaeme gar nicht an, und
        „nichts passiert" ist das Schlimmste von allem.
     ========================================================= */
  var SPRACH_SEKUNDEN = 20;
  var SPRACH_BYTES = 120000;
  var sprachRekorder = null;
  var sprachSpur = null;
  var sprachStuecke = [];
  var sprachStart = 0;
  var sprachEndeTakt = 0;

  function sprachGehtDas() {
    return typeof window !== "undefined" && typeof window.MediaRecorder === "function"
      && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }
  /* Welches Format nimmt dieser Browser? Safari kann kein Opus in
     WebM — dort wird es mp4/AAC. Wer nicht fragt, bekommt eine leere
     Datei und merkt es erst beim Abspielen. */
  function sprachFormat() {
    var kandidaten = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
    for (var i = 0; i < kandidaten.length; i++) {
      try { if (MediaRecorder.isTypeSupported(kandidaten[i])) return kandidaten[i]; }
      catch (e) {}
    }
    return "";
  }
  function sprachLaeuft() { return Boolean(sprachRekorder); }

  function sprachAufnahmeStarten() {
    if (sprachRekorder) return Promise.resolve(false);
    if (!sprachGehtDas()) {
      systemZeile("Dein Browser kann keine Sprachnachrichten aufnehmen — schreib es bitte.");
      return Promise.resolve(false);
    }
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (spur) {
      sprachSpur = spur;
      sprachStuecke = [];
      var art = sprachFormat();
      try {
        sprachRekorder = art ? new MediaRecorder(spur, { mimeType: art, audioBitsPerSecond: 24000 })
                             : new MediaRecorder(spur);
      } catch (e) {
        try { sprachRekorder = new MediaRecorder(spur); } catch (e2) { sprachRekorder = null; }
      }
      if (!sprachRekorder) { sprachAufraeumen(); return false; }
      sprachRekorder.ondataavailable = function (e) {
        if (e.data && e.data.size) sprachStuecke.push(e.data);
      };
      sprachRekorder.start();
      sprachStart = Date.now();
      /* Harte Grenze: nach 20 Sekunden ist Schluss, auch wenn niemand
         loslaesst. Sonst entsteht eine Aufnahme, die nicht durch den
         Kanal passt — und das merkt man erst hinterher. */
      clearTimeout(sprachEndeTakt);
      sprachEndeTakt = setTimeout(function () { sprachAufnahmeStoppen(); }, SPRACH_SEKUNDEN * 1000);
      return true;
    }).catch(function () {
      systemZeile("Das Mikrofon ist nicht freigegeben — in den Browsereinstellungen erlauben, dann geht es.");
      return false;
    });
  }

  function sprachAufraeumen() {
    clearTimeout(sprachEndeTakt);
    if (sprachSpur) {
      try { sprachSpur.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    }
    sprachSpur = null;
    sprachRekorder = null;
  }

  /* Gibt zurueck, ob wirklich etwas verschickt wurde. */
  function sprachAufnahmeStoppen() {
    if (!sprachRekorder) return Promise.resolve(false);
    var r = sprachRekorder;
    var sekunden = Math.max(1, Math.round((Date.now() - sprachStart) / 1000));
    return new Promise(function (fertig) {
      r.onstop = function () {
        var stuecke = sprachStuecke.slice();
        var art = r.mimeType || "audio/webm";
        sprachAufraeumen();
        if (!stuecke.length) { fertig(false); return; }
        var klumpen = new Blob(stuecke, { type: art });
        var leser = new FileReader();
        leser.onload = function () {
          var daten = String(leser.result || "");
          if (daten.length > SPRACH_BYTES) {
            systemZeile("Die Aufnahme ist zu lang geworden — nimm sie bitte kürzer auf (höchstens "
              + SPRACH_SEKUNDEN + " Sekunden).");
            fertig(false); return;
          }
          fertig(sprachSenden(daten, sekunden));
        };
        leser.onerror = function () { fertig(false); };
        leser.readAsDataURL(klumpen);
      };
      try { r.stop(); } catch (e) { sprachAufraeumen(); fertig(false); }
    });
  }

  function sprachAbbrechen() {
    if (!sprachRekorder) return false;
    var r = sprachRekorder;
    r.onstop = function () {};
    try { r.stop(); } catch (e) {}
    sprachAufraeumen();
    return true;
  }

  /* =========================================================
     FREISPRECHEN — das Mikrofon hoert zu und schickt von selbst
     ---------------------------------------------------------
     GEWUENSCHT: „Oder es ist staendig aktiv und hat einen Schwellwert,
     den es misst, und sobald die Person spricht, wird auch
     aufgenommen. Das wird sofort abgeschickt … so aehnlich wie ein
     Sync-Start am Keyboard: dass, sobald man etwas macht, wirklich
     erst dann aufgezeichnet wird und nur so lange, wie man spricht."

     Genau so ist es gebaut:
       * Das Mikrofon bleibt offen, aber es wird NICHTS aufgezeichnet,
         solange es still ist.
       * Die ersten acht Zehntelsekunden dienen dem Zuhoeren: daraus
         wird der Grundpegel des Raums gemessen. Ein fester Schwellwert
         waere falsch — in einer stillen Wohnung ist etwas anderes
         „laut" als neben einer Strasse.
       * Wird es lauter als der Grundpegel plus Abstand, laeuft die
         Aufnahme an. Wird es wieder still, wartet sie acht
         Zehntelsekunden (man macht beim Sprechen Pausen) und schickt
         dann.
       * Nach 20 Sekunden ist in jedem Fall Schluss.
       * Aufnahmen unter einer halben Sekunde werden weggeworfen —
         das ist ein Huesteln, keine Nachricht.
     ========================================================= */
  var frei = {
    an: false, spur: null, kontext: null, messer: null, daten: null,
    takt: 0, grundpegel: 0, proben: 0, lautSeit: 0, stillSeit: 0,
    nimmtAuf: false, melden: null
  };
  var FREI_ABSTAND = 0.018;     // wie weit ueber dem Grundpegel es „laut" ist
  var FREI_STILLE = 800;        // so lange Stille beendet eine Aufnahme
  var FREI_MINDEST = 500;       // kuerzere Schnipsel sind kein Satz

  function freisprechenAn() { return frei.an; }
  function freisprechenMelden(f) { frei.melden = typeof f === "function" ? f : null; }
  function freisagen(was) { if (frei.melden) { try { frei.melden(was); } catch (e) {} } }

  function freisprechenStarten() {
    if (frei.an) return Promise.resolve(true);
    if (!sprachGehtDas()) {
      systemZeile("Dein Browser kann keine Sprachnachrichten aufnehmen.");
      return Promise.resolve(false);
    }
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (spur) {
      var K = window.AudioContext || window.webkitAudioContext;
      if (!K) return false;
      frei.spur = spur;
      frei.kontext = new K();
      if (frei.kontext.state === "suspended" && frei.kontext.resume) frei.kontext.resume();
      var quelle = frei.kontext.createMediaStreamSource(spur);
      frei.messer = frei.kontext.createAnalyser();
      frei.messer.fftSize = 1024;
      quelle.connect(frei.messer);
      frei.daten = new Uint8Array(frei.messer.fftSize);
      frei.an = true;
      frei.grundpegel = 0; frei.proben = 0;
      frei.lautSeit = 0; frei.stillSeit = 0; frei.nimmtAuf = false;
      freisagen("eicht");
      frei.takt = setInterval(freiHorchen, 60);
      return true;
    }).catch(function () {
      systemZeile("Das Mikrofon ist nicht freigegeben — in den Browsereinstellungen erlauben, dann geht es.");
      return false;
    });
  }

  function freisprechenBeenden() {
    if (!frei.an) return false;
    clearInterval(frei.takt);
    if (frei.nimmtAuf) sprachAbbrechen();
    try { if (frei.spur) frei.spur.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    try { if (frei.kontext && frei.kontext.close) frei.kontext.close(); } catch (e) {}
    frei.an = false; frei.spur = null; frei.kontext = null;
    frei.messer = null; frei.nimmtAuf = false;
    freisagen("aus");
    return true;
  }

  /* Der Pegel: quadratischer Mittelwert der Auslenkung. Das ist die
     ehrliche Lautstaerke — ein einzelner Knacks reisst ihn nicht hoch,
     eine Stimme schon. */
  function freiPegel() {
    if (!frei.messer) return 0;
    if (frei.messer.getFloatTimeDomainData) {
      var f = new Float32Array(frei.messer.fftSize);
      frei.messer.getFloatTimeDomainData(f);
      var summe = 0;
      for (var i = 0; i < f.length; i++) summe += f[i] * f[i];
      return Math.sqrt(summe / f.length);
    }
    frei.messer.getByteTimeDomainData(frei.daten);
    var s2 = 0;
    for (var j = 0; j < frei.daten.length; j++) {
      var a = (frei.daten[j] - 128) / 128;
      s2 += a * a;
    }
    return Math.sqrt(s2 / frei.daten.length);
  }

  function freiHorchen() {
    if (!frei.an) return;
    var pegel = freiPegel();
    var jetzt = Date.now();
    /* Erst zuhoeren, dann urteilen: die ersten Proben sind der
       Grundpegel des Raums. */
    if (frei.proben < 13) {
      frei.proben++;
      frei.grundpegel = frei.grundpegel + (pegel - frei.grundpegel) / frei.proben;
      if (frei.proben === 13) freisagen("hoert");
      return;
    }
    /* In der Stille langsam nachfuehren — ein Ventilator, der
       angeht, soll nicht dauerhaft als Sprache gelten. */
    if (!frei.nimmtAuf && pegel < frei.grundpegel + FREI_ABSTAND) {
      frei.grundpegel = frei.grundpegel * 0.97 + pegel * 0.03;
    }
    var laut = pegel > frei.grundpegel + FREI_ABSTAND;
    if (!frei.nimmtAuf) {
      if (laut) {
        if (!frei.lautSeit) frei.lautSeit = jetzt;
        /* Zwei Messungen lang laut — ein Tuerknall ist eine. */
        if (jetzt - frei.lautSeit >= 120) {
          frei.lautSeit = 0;
          freiAufnahmeAn();
        }
      } else { frei.lautSeit = 0; }
      return;
    }
    if (laut) { frei.stillSeit = 0; return; }
    if (!frei.stillSeit) frei.stillSeit = jetzt;
    if (jetzt - frei.stillSeit >= FREI_STILLE) freiAufnahmeAus();
  }

  function freiAufnahmeAn() {
    if (frei.nimmtAuf || !frei.spur) return;
    sprachStuecke = [];
    var art = sprachFormat();
    try {
      sprachRekorder = art ? new MediaRecorder(frei.spur, { mimeType: art, audioBitsPerSecond: 24000 })
                           : new MediaRecorder(frei.spur);
    } catch (e) {
      try { sprachRekorder = new MediaRecorder(frei.spur); } catch (e2) { sprachRekorder = null; }
    }
    if (!sprachRekorder) return;
    sprachRekorder.ondataavailable = function (e) {
      if (e.data && e.data.size) sprachStuecke.push(e.data);
    };
    sprachRekorder.start();
    sprachStart = Date.now();
    frei.nimmtAuf = true;
    frei.stillSeit = 0;
    freisagen("nimmt");
    clearTimeout(sprachEndeTakt);
    sprachEndeTakt = setTimeout(function () { freiAufnahmeAus(); }, SPRACH_SEKUNDEN * 1000);
  }

  function freiAufnahmeAus() {
    if (!frei.nimmtAuf) return;
    frei.nimmtAuf = false;
    frei.stillSeit = 0;
    clearTimeout(sprachEndeTakt);
    var kurz = Date.now() - sprachStart < FREI_MINDEST;
    if (kurz) {
      /* Zu kurz — wegwerfen, aber das Mikrofon bleibt offen. */
      var r0 = sprachRekorder;
      if (r0) { r0.onstop = function () {}; try { r0.stop(); } catch (e) {} }
      sprachRekorder = null;
      freisagen("hoert");
      return;
    }
    /* WICHTIG: sprachAufnahmeStoppen raeumt normalerweise die Spur mit
       ab. Beim Freisprechen soll das Mikrofon offen BLEIBEN, sonst
       muesste man es fuer jeden Satz neu freigeben. Deshalb wird die
       Spur vorher beiseitegelegt und danach zurueckgegeben. */
    var merk = sprachSpur;
    sprachSpur = null;
    sprachAufnahmeStoppen().then(function () {
      sprachSpur = merk;
      if (frei.an) freisagen("hoert");
    });
  }

  function sprachSenden(daten, sekunden) {
    if (!daten) return false;
    var n = {
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: "", art: "sprach",
      sprach: daten, sprachSek: sekunden,
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe
    };
    nachrichtAnhaengen(n);
    /* AUSDRUECKLICH KEIN serverSichern: die Aufnahme ist fluechtig. */
    senden({ art: "text", id: n.id, name: n.name, text: "", zeit: n.zeit,
             bild: zustand.ichBild, farbe: zustand.farbe, chatArt: "sprach",
             sprach: daten, sprachSek: sekunden });
    melden();
    return true;
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
     BILDER AUS BUCHSTABEN UND AUS EMOJIS
     ---------------------------------------------------------
     GEWÜNSCHT: „Die ASCII-Codes können noch ein bisschen
     umfangreicher sein, nicht so einfach und billig. Der Fuchs kann
     zum Beispiel ein richtig schöner, realistischer Fuchs sein …
     und dann so etwas mit Emojis, wie bei einem ASCII-Code aus
     Emojis mit Sternen, Rakete, Planeten — so verschiedene
     Bilderthemen, die kleine Geschichten erzählen."

     Deshalb zweierlei:

       /ascii <name>   Bilder aus Buchstaben, wie sie damals durch
         die Chats gingen. Sie stehen nur richtig da, wenn jede
         Stelle gleich breit ist — beim Zeichnen kommen sie deshalb
         in Schreibmaschinenschrift.

       /bild <name>    Bilder aus Emojis: bunt, ohne feste Breite,
         und sie erzählen etwas. Ein Sternenhimmel mit Lagerfeuer,
         eine Rakete, die vor einem Planeten abhebt, ein
         Sonnenaufgang über dem Dorf. Als Abstand steht zwischen
         den Zeichen ein Geviertleerzeichen (U+3000) — genauso
         breit wie ein Emoji; mit einem gewöhnlichen Leerzeichen
         verrutscht jede Anordnung.

     Beide Sammlungen stehen in werkzeug/bau-chatbilder.py und
     werden von dort hierher geschrieben. Wer etwas ändern will,
     ändert es DORT und lässt das Werkzeug laufen.
     ========================================================= */

  var ASCII = {
    achtung:
      ["          /\\               ",
       "         /  \\              ",
       "        /    \\             ",
       "       /  /\\  \\            ",
       "      /   ||   \\           ",
       "     /    ||    \\          ",
       "    /     ||     \\         ",
       "   /      ()      \\        ",
       "  /________________\\       ",
       "                           ",
       "        \u2014 %NAME%         "].join("\n"),
    baum:
      ["         &&&&&&&&&         ",
       "       &&&&&&&&&&&&&       ",
       "     &&&&&&&&&&&&&&&&&     ",
       "    &&&&&&&&&&&&&&&&&&&    ",
       "     &&&&&&&&&&&&&&&&&     ",
       "       &&&&&&&&&&&&&       ",
       "          &&&&&&&          ",
       "            |||            ",
       "            |||            ",
       "           /|||\\           ",
       "    ______/_____\\______    ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    blume:
      ["        _(_)_              ",
       "    @@@@(_)@@@@            ",
       "   @@@@@(_)@@@@@           ",
       "    @@@@(_)@@@@            ",
       "        (_)                ",
       "         |                 ",
       "      \\  |                 ",
       "       \\ |   /             ",
       "        \\|  /              ",
       "         | /               ",
       "     ____|/____            ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    daumen:
      ["           ____            ",
       "          /    |           ",
       "         /  /| |           ",
       "        |  / | |           ",
       "        | |  | |           ",
       "   _____| |__| |_____      ",
       "  |                  |     ",
       "  |   das findet      |    ",
       "  |   %NAME% gut      |    ",
       "  |__________________|     "].join("\n"),
    fertig:
      ["       .-----------.       ",
       "     .'             '.     ",
       "    /                 \\    ",
       "   |              /    |   ",
       "   |             /     |   ",
       "   |   \\        /      |   ",
       "   |    \\      /       |   ",
       "    \\    \\    /       /    ",
       "     '.   \\  /      .'     ",
       "       '---\\/------'       ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    fuchs:
      ["    /\\     /\\    ",
       "   /  \\___/  \\   ",
       "  /  o     o  \\  ",
       " |      w      | ",
       "  \\    ___    /  ",
       "   \\  \\___/  /   ",
       "    \\_______/    ",
       "   /         \\   ",
       "  /  \\_____/  \\  ",
       " (_/         \\_) ",
       "   ~~~~~~~~~~~   ",
       "      \u2014 %NAME%   "].join("\n"),
    geschenk:
      ["       \\  |  /       ",
       "       .-----.       ",
       "   ---(  * *  )---   ",
       "       `--+--`       ",
       "   .-----------.     ",
       "   |     ||    |     ",
       "   |=====||====|     ",
       "   |     ||    |     ",
       "   |     ||    |     ",
       "   `-----------`     ",
       "      \u2014 %NAME%      "].join("\n"),
    haus:
      ["            /\\             ",
       "           /  \\            ",
       "          /    \\           ",
       "         /      \\          ",
       "        /________\\         ",
       "        | __  __ |         ",
       "        ||  ||  ||         ",
       "        ||__||__||         ",
       "        |   ____ |         ",
       "        |  | o  ||         ",
       "    ____|__|____||____     ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    herz:
      ["     ,d8888b.  ,d8888b.    ",
       "   ,88888888888888888888,  ",
       "  d8888888888888888888888b ",
       "  888888888888888888888888 ",
       "  `8888888888888888888888' ",
       "   `Y88888888888888888Y'   ",
       "     `Y888888888888Y'      ",
       "       `Y8888888Y'         ",
       "         `Y888Y'           ",
       "           `Y'             ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    hund:
      ["     ,--.        ,--.      ",
       "    /    \\______/    \\     ",
       "   |                  |    ",
       "   |    (o)    (o)    |    ",
       "   |        __        |    ",
       "    \\      (__)      /     ",
       "     \\    '----'    /      ",
       "      `.__________.'       ",
       "       /          \\        ",
       "      |   \\    /   |       ",
       "       \\   '--'   /        ",
       "        `--------'         ",
       "                           ",
       "        \u2014 %NAME%         "].join("\n"),
    kaffee:
      ["         )  (  )           ",
       "        (   )  (           ",
       "         )  (  )           ",
       "     .----------.          ",
       "     |          |___       ",
       "     |          |   \\      ",
       "     |  ~~~~~~  |    |     ",
       "     |          |   /      ",
       "     |          |__/       ",
       "      \\        /           ",
       "       `------'            ",
       "    ________________       ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    katze:
      ["       /\\_____/\\           ",
       "      /  o   o  \\          ",
       "     ( ==  ^  == )         ",
       "      )         (          ",
       "     (           )         ",
       "    ( (  )   (  ) )        ",
       "   (__(__)___(__)__)       ",
       "                           ",
       "        \u2014 %NAME%         "].join("\n"),
    lachen:
      ["        .-'''''''''-.       ",
       "      .'             '.     ",
       "     /   \\       /     \\    ",
       "    :     o     o       :   ",
       "    |          ^        |   ",
       "    :   \\             / :   ",
       "     \\   '.         .'  /   ",
       "      '.   '-.....-'  .'    ",
       "        '-...........-'     ",
       "                            ",
       "     H A   H A   H A !      ",
       "        \u2014 %NAME%          "].join("\n"),
    rakete:
      ["            /\\             ",
       "           /  \\            ",
       "          /    \\           ",
       "         |      |          ",
       "         |  ()  |          ",
       "         |      |          ",
       "        /|      |\\         ",
       "       / |      | \\        ",
       "      /__|______|__\\       ",
       "          \\    /           ",
       "           \\  /            ",
       "            \\/             ",
       "            **             ",
       "           ****            ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    schiff:
      ["                |             ",
       "               /|\\            ",
       "              / | \\           ",
       "             /  |  \\          ",
       "            /___|___\\         ",
       "                |             ",
       "   \\____________|___________/ ",
       "    \\                      /  ",
       "     \\____________________/   ",
       "  ~~~~~~~~~~~~~~~~~~~~~~~~~~  ",
       "   ~~~~~~~~~~~~~~~~~~~~~~~~   ",
       "                              ",
       "          \u2014 %NAME%           "].join("\n"),
    stern:
      ["             *             ",
       "            ***            ",
       "           *****           ",
       " ************************* ",
       "  ***********************  ",
       "    *******************    ",
       "      ***************      ",
       "       *************       ",
       "      ****     ****        ",
       "     ***         ***       ",
       "    **             **      ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n"),
    traurig:
      ["        .-'''''''''-.      ",
       "      .'             '.    ",
       "     /   .         .   \\   ",
       "    :   (')       (')   :  ",
       "    |          v         | ",
       "    :     .-------.      : ",
       "     \\   /         \\    /  ",
       "      '.             .'    ",
       "        '-.........-'      ",
       "                           ",
       "        \u2014 %NAME%         "].join("\n"),
    ueberraschung:
      ["     *   .   *       ",
       "   .   \\ | /   .     ",
       "      --( )--        ",
       "   *   / | \\   *     ",
       "      .-----.        ",
       "     /       \\       ",
       "    |  !!!!!  |      ",
       "     \\       /       ",
       "      `-----`        ",
       "      \u2014 %NAME%      "].join("\n"),
    winken:
      ["        _   _   _          ",
       "   _   | | | | | |         ",
       "  | |  | | | | | |  _      ",
       "  | |  | | | | | | | |     ",
       "  | |__| |_| |_| |_| |     ",
       "   \\                 |     ",
       "    \\                |     ",
       "     \\              /      ",
       "      |            |       ",
       "      |            |       ",
       "      |____________|       ",
       "                           ",
       "        \u2014 %NAME%          "].join("\n")
  };

  var EMOJIBILD = {
    fussball:
      ["\ud83e\udd45\u3000\u3000\u3000\u3000\u3000\u3000\ud83e\udd45",
       "\u3000\u3000\ud83c\udfc3\u3000\u26bd\u3000\u3000\u3000",
       "\ud83d\udfe9\ud83d\udfe9\ud83d\udfe9\ud83d\udfe9\ud83d\udfe9\ud83d\udfe9\ud83d\udfe9\ud83d\udfe9",
       "\u3000\ud83d\udce3\u3000\ud83d\udce3\u3000\ud83d\udce3\u3000\ud83d\udce3",
       "%NAME% schiesst ein Tor"].join("\n"),
    geburtstag:
      ["\ud83c\udf88\u3000\ud83c\udf89\u3000\ud83c\udf88\u3000\ud83c\udf89\u3000\ud83c\udf88",
       "\u3000\u2728\u3000\u3000\u3000\u3000\u2728\u3000",
       "\u3000\u3000\ud83d\udd6f\ufe0f\ud83d\udd6f\ufe0f\ud83d\udd6f\ufe0f\u3000\u3000",
       "\u3000\u3000\ud83c\udf82\ud83c\udf82\ud83c\udf82\u3000\u3000",
       "\ud83c\udf8a\u3000\ud83c\udf81\u3000\ud83e\udd73\u3000\ud83c\udf81\u3000\ud83c\udf8a",
       "Herzlichen Glueckwunsch von %NAME%"].join("\n"),
    geschenk:
      ["\u2728\u3000\ud83c\udf88\u3000\u2728\u3000\ud83c\udf88\u3000\u2728",
       "\u3000\u3000\ud83c\udf81\ud83c\udf81\ud83c\udf81\u3000\u3000",
       "\u3000\ud83c\udf80\u3000\ud83c\udf80\u3000\ud83c\udf80\u3000",
       "\ud83e\udd73\u3000\u3000\u2764\ufe0f\u3000\u3000\ud83e\udd70",
       "%NAME%"].join("\n"),
    gewitter:
      ["\u2601\ufe0f\u26c8\ufe0f\u2601\ufe0f\u3000\u26c8\ufe0f\u2601\ufe0f\u3000",
       "\u3000\u26a1\u3000\u3000\u26a1\u3000\u3000\u26a1",
       "\ud83c\udf27\ufe0f\ud83c\udf27\ufe0f\ud83c\udf27\ufe0f\ud83c\udf27\ufe0f\ud83c\udf27\ufe0f\ud83c\udf27\ufe0f",
       "\u2602\ufe0f\u3000\u3000\ud83c\udfe0\u3000\u3000\u2602\ufe0f",
       "%NAME% bleibt lieber drinnen"].join("\n"),
    halloween:
      ["\ud83c\udf19\u3000\ud83e\udd87\u3000\u3000\ud83e\udd87\u3000\ud83c\udf19",
       "\u3000\ud83d\udc7b\u3000\u3000\ud83d\udc7b\u3000\u3000",
       "\ud83c\udf83\u3000\ud83d\udd78\ufe0f\u3000\ud83d\udd77\ufe0f\u3000\ud83c\udf83",
       "\ud83e\udea6\ud83c\udf32\ud83e\udea6\ud83c\udfda\ufe0f\ud83e\udea6\ud83c\udf32\ud83e\udea6",
       "Buh! sagt %NAME%"].join("\n"),
    herz:
      ["\u3000\u2764\ufe0f\u2764\ufe0f\u3000\u3000\u2764\ufe0f\u2764\ufe0f\u3000",
       "\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f",
       "\u3000\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u3000",
       "\u3000\u3000\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f\u3000\u3000",
       "\u3000\u3000\u3000\u2764\ufe0f\u3000\u3000\u3000",
       "von %NAME%"].join("\n"),
    kaffeepause:
      ["\u3000\u2668\ufe0f\u3000\u2668\ufe0f\u3000\u2668\ufe0f\u3000",
       "\u3000\u2615\u3000\ud83e\udd50\u3000\u2615\u3000",
       "\u3000\ud83d\udcd6\u3000\u3000\u3000\ud83d\udcd6\u3000",
       "%NAME% macht Pause"].join("\n"),
    katze:
      ["\u3000\ud83d\udd3a\u3000\u3000\u3000\ud83d\udd3a\u3000",
       "\u3000\u3000\ud83d\udc31\u3000\u3000\u3000\u3000",
       "\u3000\ud83d\udc3e\u3000\u3000\ud83d\udc3e\u3000\u3000",
       "\u3000\u3000\ud83e\uddf6\u3000\u3000\u3000\u3000",
       "%NAME% hat eine Katze"].join("\n"),
    klassenzimmer:
      ["\ud83d\udcda\ud83d\udcd6\u270f\ufe0f\u3000\ud83e\uddd1\u200d\ud83c\udfeb\u3000\u270f\ufe0f\ud83d\udcd6\ud83d\udcda",
       "\u3000\u3000\u3000\u2b1b\u2b1b\u2b1b\u3000\u3000\u3000",
       "\ud83e\uddd1\u3000\ud83d\udc69\u3000\ud83d\udc68\u3000\ud83e\uddd2\u3000\ud83d\udc71",
       "\ud83e\ude91\ud83e\ude91\ud83e\ude91\ud83e\ude91\ud83e\ude91\ud83e\ude91\ud83e\ude91",
       "%NAME% ist im Unterricht"].join("\n"),
    meer:
      ["\u2600\ufe0f\u3000\u3000\u2601\ufe0f\u3000\u3000\ud83d\udd4a\ufe0f\u3000",
       "\u3000\u3000\u26f5\u3000\u3000\u3000\u3000\u3000",
       "\ud83c\udf0a\ud83c\udf0a\ud83c\udf0a\ud83c\udf0a\ud83c\udf0a\ud83c\udf0a\ud83c\udf0a\ud83c\udf0a",
       "\ud83d\udc1f\u3000\ud83d\udc20\u3000\u3000\ud83d\udc21\u3000\ud83d\udc1f",
       "\ud83c\udfd6\ufe0f\ud83c\udf34\ud83c\udfd6\ufe0f\u3000\ud83d\udc1a\u3000\ud83c\udfd6\ufe0f\ud83c\udf34",
       "%NAME% macht Urlaub"].join("\n"),
    musik:
      ["\ud83c\udfb5\u3000\ud83c\udfb6\u3000\u3000\ud83c\udfb5\u3000\ud83c\udfb6",
       "\u3000\ud83c\udfb8\u3000\ud83e\udd41\u3000\ud83c\udfb9\u3000",
       "\u3000\u3000\u3000\ud83e\uddd1\u200d\ud83c\udfa4\u3000\u3000\u3000",
       "\ud83d\udc4f\ud83d\udc4f\ud83d\udc4f\ud83d\udc4f\ud83d\udc4f\ud83d\udc4f\ud83d\udc4f",
       "%NAME% macht Musik"].join("\n"),
    rakete:
      ["\u3000\u3000\u3000\u3000\ud83e\ude90\u3000\u3000\u2b50",
       "\u3000\u2b50\u3000\u3000\u3000\u3000\ud83d\udef8\u3000",
       "\u3000\u3000\u3000\ud83d\ude80\u3000\u3000\u3000\u3000",
       "\u3000\u3000\ud83d\udd25\ud83d\udd25\u3000\u3000\u2728\u3000",
       "\u3000\u3000\u3000\ud83c\udf0d\u3000\u3000\u3000\u3000",
       "%NAME% hebt ab"].join("\n"),
    sonnenaufgang:
      ["\u3000\u3000\u3000\u3000\u2600\ufe0f\u3000\u3000\u3000",
       "\u3000\u3000\u2601\ufe0f\u3000\u3000\u3000\u2601\ufe0f\u3000",
       "\ud83d\udc26\u3000\u3000\u3000\u3000\u3000\u3000\ud83d\udc26",
       "\ud83c\udf32\ud83c\udf33\ud83c\udfe0\ud83c\udf33\ud83c\udf32\ud83c\udf33\ud83c\udf32\ud83c\udf33",
       "\ud83c\udf3f\ud83c\udf3c\ud83c\udf3f\ud83c\udf3c\ud83c\udf3f\ud83c\udf3c\ud83c\udf3f\ud83c\udf3c",
       "Guten Morgen von %NAME%"].join("\n"),
    sternenhimmel:
      ["\u2b50\ud83c\udf19\u2728\u3000\u3000\u2b50\u3000\u2728\ud83c\udf1f",
       "\u3000\u2728\u3000\u3000\ud83c\udf0c\u3000\u3000\u2b50\u3000",
       "\ud83c\udf1f\u3000\u2b50\u3000\u2728\u3000\ud83c\udf20\u3000\u3000",
       "\u3000\u3000\u2728\u3000\u3000\u2b50\u3000\u3000\u2728",
       "\ud83c\udf33\ud83c\udf32\ud83c\udfd5\ufe0f\ud83d\udd25\ud83c\udfd5\ufe0f\ud83c\udf32\ud83c\udf33\ud83c\udf32",
       "gute Nacht, sagt %NAME%"].join("\n"),
    wald:
      ["\u3000\u3000\u2600\ufe0f\u3000\u3000\u3000\u2601\ufe0f\u3000",
       "\ud83c\udf32\ud83c\udf33\ud83c\udf32\ud83c\udf33\ud83c\udf32\ud83c\udf33\ud83c\udf32\ud83c\udf33",
       "\ud83c\udf33\ud83e\udd8a\ud83c\udf33\u3000\ud83e\udd8c\u3000\ud83c\udf33\ud83c\udf32",
       "\ud83c\udf3f\ud83c\udf44\ud83c\udf3f\ud83c\udf3f\ud83c\udf44\ud83c\udf3f\ud83c\udf3f\ud83c\udf44",
       "%NAME% geht spazieren"].join("\n"),
    weihnachten:
      ["\u2b50\u3000\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2b50",
       "\u3000\u3000\u3000\ud83c\udf84\u3000\u3000\u3000",
       "\u3000\u3000\ud83c\udf81\ud83c\udf81\ud83c\udf81\u3000\u3000",
       "\ud83e\udd8c\ud83d\udef7\u3000\u3000\u3000\ud83c\udf85\ud83d\udd14",
       "Frohe Weihnachten von %NAME%"].join("\n"),
    winter:
      ["\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2744\ufe0f",
       "\u3000\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2744\ufe0f\u3000\u2744\ufe0f",
       "\ud83c\udf84\u3000\u26c4\u3000\u3000\ud83c\udfe0\u3000\ud83c\udf84",
       "\u2b1c\u2b1c\u2b1c\u2b1c\u2b1c\u2b1c\u2b1c\u2b1c",
       "%NAME% friert ein bisschen"].join("\n")
  };

  var BEFEHLE = [
    { gr: "reden", w: "me",      kurz: "",     nutzt: "/me <was du tust>",   was: "Aktion: „Emmy lacht laut“ — kursiv, ohne Doppelpunkt" },
    { gr: "reden", w: "me/",     kurz: "",     nutzt: "… /me/ …",            was: "Mitten im Satz: wird durch deinen Namen ersetzt" },
    { gr: "reden", w: "s",       kurz: "shout",nutzt: "/s <text>",           was: "Schreien — GROSS, mit Wucht" },
    { gr: "reden", w: "w",       kurz: "msg",  nutzt: "/w <name> <text>",    was: "Flüstern — nur ihr beide seht es, auch über Räume hinweg" },
    { gr: "raum", w: "j",       kurz: "join", nutzt: "/j <raum>",           was: "Raum betreten — gibt es ihn nicht, machst du ihn auf" },
    { gr: "raum", w: "i",       kurz: "invite", nutzt: "/i <name>",         was: "Einladen — die Person bekommt eine Zeile und kommt selbst" },
    { gr: "raum", w: "f",       kurz: "follow", nutzt: "/f <name>",         was: "Folgen — dorthin, wo die Person GERADE ist" },
    { gr: "raum", w: "n",       kurz: "names",nutzt: "/n",                  was: "Wer ist hier?" },
    { gr: "raum", w: "l",       kurz: "list", nutzt: "/l",                  was: "Welche Räume sind gerade offen?" },
    { gr: "raum", w: "t",       kurz: "topic",nutzt: "/t <text>",           was: "Thema des Raums setzen" },
    { gr: "raum", w: "lock",    kurz: "",     nutzt: "/lock",               was: "Raum abschließen — nur Eingeladene kommen herein" },
    { gr: "raum", w: "unlock",  kurz: "",     nutzt: "/unlock",             was: "Raum wieder öffnen" },
    { gr: "chef", w: "op",      kurz: "",     nutzt: "/op <name>",          was: "Macht die Person zum Häuptling" },
    { gr: "chef", w: "deop",    kurz: "",     nutzt: "/deop <name>",        was: "Nimmt die Häuptlingsrechte wieder" },
    { gr: "chef", w: "k",       kurz: "kick", nutzt: "/k <name>",           was: "Rausschmeißen (nur Häuptling)" },
    { gr: "chef", w: "knebel",  kurz: "",     nutzt: "/knebel <name>",      was: "Stummschalten (nur Häuptling)" },
    { gr: "chef", w: "entknebel", kurz: "",   nutzt: "/entknebel <name>",   was: "Wieder sprechen lassen" },
    { gr: "reden", w: "lach",    kurz: "lol",  nutzt: "/lach",               was: "Lachen — mit einem Gesicht aus Buchstaben" },
    { gr: "zeichen", w: "ascii",   kurz: "",     nutzt: "/ascii <was>",        was: "Ein Bild aus Buchstaben — /ascii ohne Wort zeigt alle" },
    { gr: "zeichen", w: "bild",    kurz: "emoji",nutzt: "/bild <was>",         was: "Ein buntes Bild aus Emojis — /bild ohne Wort zeigt alle" },
    { gr: "reden", w: "herz",    kurz: "",     nutzt: "/herz <name>",        was: "Ein Herz schicken (geht auch als &hearts; mitten im Text)" },
    { gr: "reden", w: "drueck",  kurz: "hug",  nutzt: "/drueck <name>",      was: "Jemanden drücken" },
    { gr: "raum", w: "tausch",   kurz: "platz",  nutzt: "/tausch <name>",    was: "Mit jemandem den Platz tauschen — ohne Namen rutscht man auf den nächsten freien" },
    { gr: "raum", w: "verbindung", kurz: "ton",  nutzt: "/verbindung",       was: "Warum hört man jemanden nicht? Zeigt den Weg und ob Tonpakete ankommen" },
    { gr: "reden", w: "leck",    kurz: "lecken", nutzt: "/leck <name>",      was: "Jemanden abschlecken — mit Zunge, Spur und Schütteln" },
    { gr: "reden", w: "box",     kurz: "boxen",  nutzt: "/box <name>",       was: "Jemandem einen Boxhandschuh verpassen" },
    { gr: "feier", w: "konfetti", kurz: "party", nutzt: "/konfetti",          was: "Konfetti — fliegt durch den ganzen Raum, bei allen" },
    { gr: "feier", w: "ballon",  kurz: "geburtstag", nutzt: "/ballon <name>", was: "Luftballons steigen auf — zum Geburtstag" },
    { gr: "feier", w: "geschenk", kurz: "gift", nutzt: "/geschenk <name>",     was: "Ein Geschenk überreichen — mit Schleife und Funkeln" },
    { gr: "wetter", w: "schnee",  kurz: "",     nutzt: "/schnee",             was: "Es schneit im ganzen Raum" },
    { gr: "wetter", w: "regen",   kurz: "",     nutzt: "/regen",              was: "Es regnet im ganzen Raum" },
    { gr: "wetter", w: "feuerwerk", kurz: "",   nutzt: "/feuerwerk",          was: "Feuerwerk über dem ganzen Fenster" },
    { gr: "wetter", w: "gewitter", kurz: "sturm", nutzt: "/gewitter",          was: "Blitz, Donner und Sturm" },
    { gr: "welt", w: "erdbeben", kurz: "beben", nutzt: "/erdbeben",          was: "Der ganze Chat fängt an zu wackeln" },
    { gr: "welt", w: "vulkan",  kurz: "ausbruch", nutzt: "/vulkan",          was: "Ein Vulkan bricht aus — Lava, Funken und Asche" },
    { gr: "tiere", w: "schmetterling", kurz: "falter", nutzt: "/schmetterling", was: "Schmetterlinge flattern durch den Raum" },
    { gr: "tiere", w: "voegel",  kurz: "zugvoegel", nutzt: "/voegel",          was: "Ein Schwarm zieht in den Süden — in Keilformation" },
    { gr: "feier", w: "schlitten", kurz: "santa", nutzt: "/schlitten",         was: "Der Weihnachtsmann rauscht mit dem Schlitten durchs Bild" },
    { gr: "tiere", w: "rennauto", kurz: "auto", nutzt: "/rennauto",            was: "Ein Rennwagen fährt durchs Bild — zum Abschied" },
    { gr: "feier", w: "bonbon",  kurz: "lolli", nutzt: "/bonbon",              was: "Es regnet Bonbons und Lollis" },
    { gr: "wetter", w: "orkan",   kurz: "wind", nutzt: "/orkan",                was: "Ein Orkan pustet die Buchstaben durcheinander" },
    { gr: "wetter", w: "finsternis", kurz: "stromausfall", nutzt: "/finsternis", was: "Das Licht geht aus — nur noch Taschenlampen" },
    { gr: "welt", w: "lagerfeuer", kurz: "feuer", nutzt: "/lagerfeuer",       was: "Ein Lagerfeuer mit Funken und Glühwürmchen" },
    { gr: "wetter", w: "sternschnuppe", kurz: "wunsch", nutzt: "/sternschnuppe", was: "Sternschnuppen ziehen über den Himmel" },
    { gr: "welt", w: "matrix",  kurz: "", nutzt: "/matrix",                   was: "Der grüne Code rieselt herunter" },
    { gr: "welt", w: "falten",  kurz: "spiegel", nutzt: "/falten",            was: "Der Raum faltet sich — mit Spiegelschrift" },
    { gr: "welt", w: "armageddon", kurz: "weltuntergang", nutzt: "/armageddon", was: "Meteoriten, Risse und roter Himmel" },
    { gr: "welt", w: "sintflut", kurz: "zorn", nutzt: "/sintflut",             was: "Gottes Zorn — Wassermassen steigen" },
    { gr: "welt", w: "aegypten", kurz: "wueste", nutzt: "/aegypten",           was: "Pyramiden, Sphinx und Sandsturm" },
    { gr: "feier", w: "ostern",  kurz: "osterhase", nutzt: "/ostern",           was: "Ostereier, Hase und Frühling" },
    { gr: "welt", w: "augen",   kurz: "gucken", nutzt: "/augen",               was: "Neugierige Augen schauen dir zu" },
    { gr: "welt", w: "geld",      kurz: "cash",   nutzt: "/geld",      was: "Cash Horizon — Geldscheine regnen herunter" },
    { gr: "welt", w: "keks",      kurz: "cookie", nutzt: "/keks",      was: "Ein Keks wird aufgegessen — mit Bissen und Krümeln" },
    { gr: "welt", w: "seifenblasen", kurz: "blasen", nutzt: "/seifenblasen", was: "Seifenblasen steigen auf und zerplatzen" },
    { gr: "welt", w: "herbst",    kurz: "laub",   nutzt: "/herbst",    was: "Buntes Herbstlaub taumelt herunter" },
    { gr: "welt", w: "aquarium",  kurz: "fische", nutzt: "/aquarium",  was: "Fische ziehen durchs Bild, Luftblasen steigen auf" },
    { gr: "welt", w: "pinguine",  kurz: "pinguin", nutzt: "/pinguine", was: "Eine Reihe Pinguine watschelt durchs Bild" },
    { gr: "welt", w: "fratze",    kurz: "daemon", nutzt: "/fratze",    was: "Eine dämonische Fratze taucht aus dem Dunkel auf" },
    { gr: "welt", w: "blut",      kurz: "horror", nutzt: "/blut",      was: "Blut läuft von oben herunter" },
    { gr: "welt", w: "schloss",   kurz: "hollow", nutzt: "/schloss",   was: "Das Tor geht auf, dahinter ein Schloss — und ein eiskalter Wind" },
    { gr: "welt", w: "kitt",      kurz: "rider",  nutzt: "/kitt",      was: "Der schwarze Wagen kommt frontal an, mit dem roten Lauflicht" },
    { gr: "welt", w: "dino",      kurz: "rex",    nutzt: "/dino",      was: "Ein Tyrannosaurus kommt näher und brüllt — der Boden bebt" },
    { gr: "welt", w: "jalousie",  kurz: "rollo",  nutzt: "/jalousie",  was: "Die Jalousie kippt auf — dahinter eine andere Welt" },
    { gr: "welt", w: "handdurch", kurz: "zombie", nutzt: "/handdurch", was: "Eine Hand reisst von unten durch den Chat und greift nach dir" },
    { gr: "welt", w: "tore",      kurz: "riegel", nutzt: "/tore",      was: "Zwei Tore knallen zu und das Schloss legt sich vor" },
    { gr: "welt", w: "paintball", kurz: "farbe",  nutzt: "/paintball", was: "Farbkugeln schlagen ein, spritzen und laufen herunter" },
    { gr: "tiere", w: "enten",     kurz: "ente",   nutzt: "/enten",     was: "Die Entenmama watschelt mit ihren Küken durchs Bild" },
    { gr: "tiere", w: "katze",     kurz: "kaetzchen", nutzt: "/katze",  was: "Ein Katzenbaby läuft zur Scheibe und tappt mit den Pfoten dagegen" },
    { gr: "welt", w: "route66",    kurz: "highway", nutzt: "/route66", was: "Ein Wagen kommt über die Route 66 auf dich zu — Wüste, Kakteen, Staub" },
    { gr: "feier", w: "prunk",     kurz: "gift",   nutzt: "/prunk",     was: "Ein grosses Geschenk geht auf — Strahlen, Funken und Münzregen" },
    { gr: "feier", w: "ggloewe",   kurz: "loewe",  nutzt: "/loewe <Name>",   was: "GROSSES GESCHENK: die Kiste springt auf, ein Löwe steigt heraus und wird riesig" },
    { gr: "feier", w: "ggtrex",    kurz: "trex",   nutzt: "/trex <Name>",    was: "GROSSES GESCHENK: ein Tyrannosaurus steigt aus der Kiste und brüllt" },
    { gr: "feier", w: "ggelefant", kurz: "elefant",nutzt: "/elefant <Name>", was: "GROSSES GESCHENK: ein Elefant steigt aus der Kiste" },
    { gr: "feier", w: "ggadler",   kurz: "adler",  nutzt: "/adler <Name>",   was: "GROSSES GESCHENK: ein Adler steigt aus der Kiste" },
    { gr: "feier", w: "gghai",     kurz: "hai",    nutzt: "/hai <Name>",     was: "GROSSES GESCHENK: ein Hai steigt aus der Kiste" },
    { gr: "feier", w: "ggbaer",    kurz: "baer",   nutzt: "/baer <Name>",    was: "GROSSES GESCHENK: ein Bär steigt aus der Kiste" },
    { gr: "feier", w: "kassette",  kurz: "tape",   nutzt: "/kassette",  was: "Achtziger: eine Musikkassette spult zurück, die Wickel drehen sich" },
    { gr: "feier", w: "pacman",    kurz: "pac",    nutzt: "/pacman",    was: "Achtziger: Pac-Man frisst sich durch den Chat, drei Gespenster hinterher" },
    { gr: "welt",  w: "vhs",       kurz: "video",  nutzt: "/vhs",       was: "Achtziger: das Bild verreisst wie bei einem alten Videoband" },
    { gr: "feier", w: "disko",     kurz: "kugel",  nutzt: "/disko",     was: "Achtziger: die Spiegelkugel dreht sich und wirft Lichtflecken" },
    { gr: "welt", w: "pirat",      kurz: "schiff", nutzt: "/pirat",     was: "Ein Piratenschiff segelt über die Wellen, mit Totenkopfflagge" },
    { gr: "welt", w: "strudel",    kurz: "sog",    nutzt: "/strudel",   was: "Der Chat wird in einen Strudel gezogen, die Schrift wird kleiner" },
    { gr: "welt", w: "schwamm",    kurz: "wischen", nutzt: "/schwamm",  was: "Ein Schwamm wischt den Chat wie eine Tafel" },
    { gr: "welt", w: "schuss",     kurz: "ballern", nutzt: "/schuss",   was: "Schusslöcher schlagen in den Chat, und es läuft herunter" },
    { gr: "wetter", w: "wolken",    kurz: "wolke",  nutzt: "/wolken",    was: "Wolken ziehen über den Raum" },
    { gr: "welt", w: "glasbruch", kurz: "sprung", nutzt: "/glasbruch", was: "Das Display zerspringt — mit echten Rissen" },
    { gr: "tiere", w: "spinnen",   kurz: "spinne", nutzt: "/spinnen",   was: "Spinnen krabbeln über den Chat" },
    { gr: "welt", w: "noten",     kurz: "melodie",nutzt: "/noten",     was: "Noten steigen auf und klingen dabei wirklich" },
    { gr: "feier", w: "halloween", kurz: "",   nutzt: "/halloween",           was: "Fledermäuse, Geister und Kürbisse" },
    { gr: "feier", w: "weihnachten", kurz: "advent", nutzt: "/weihnachten",   was: "Schnee, Sterne und Geschenke" },
    { gr: "aussehen", w: "schrift", kurz: "font", nutzt: "/schrift <nummer>",    was: "Die Schrift im Chat: 1 klassisch, 2 Schreibmaschine, 3 rund, 4 gross" },
    { gr: "aussehen", w: "hintergrund", kurz: "bg", nutzt: "/hintergrund",       was: "Ein eigenes Bild hinter den Chat legen (/hintergrund weg nimmt es wieder)" },
    { gr: "reden", w: "c",       kurz: "color",nutzt: "/c <farbe>",          was: "Deine Schriftfarbe: rot, blau, gruen, gelb, lila, tuerkis, bunt" },
    { gr: "raum", w: "leave",   kurz: "part", nutzt: "/leave",              was: "Zurück ins Klassenzimmer" },
    { gr: "hilfe", w: "h",       kurz: "help", nutzt: "/h",                  was: "Diese Liste" }
  ];
  /* DIE KURZWOERTER — eine Tabelle, zwei Benutzer.
     Sie stand frueher als „var gleich" mitten in der Befehlsauswertung
     und war damit nur dort zu sehen. Die Tipphilfe unter dem
     Eingabefeld braucht sie aber auch: wer „flock" tippt, soll
     /schnee vorgeschlagen bekommen. Also steht sie jetzt aussen. */
  var KURZ = { msg: "w", m: "w", query: "w", fluester: "w", whisper: "w",
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
                gift: "geschenk", praesent: "geschenk", ueberraschung: "geschenk",
                schneien: "schnee", flocken: "schnee",
                regnen: "regen", nieseln: "regen",
                raketen: "feuerwerk", silvester: "feuerwerk",
                sturm: "gewitter", blitz: "gewitter", donner: "gewitter",
                beben: "erdbeben", wackeln: "erdbeben",
                ausbruch: "vulkan", lava: "vulkan", eruption: "vulkan",
                falter: "schmetterling", schmetterlinge: "schmetterling",
                zugvoegel: "voegel", vogel: "voegel", schwarm: "voegel",
                santa: "schlitten", weihnachtsmann: "schlitten",
                rentier: "schlitten", schlittenfahrt: "schlitten",
                auto: "rennauto", rennen: "rennauto", gas: "rennauto",
                heimfahrt: "rennauto", tschuess: "rennauto",
                lolli: "bonbon", bonbons: "bonbon", suessigkeiten: "bonbon",
                wind: "orkan", sturmwind: "orkan", hurrikan: "orkan",
                stromausfall: "finsternis", dunkelheit: "finsternis",
                blackout: "finsternis", lichtaus: "finsternis",
                feuer: "lagerfeuer", gluehwuermchen: "lagerfeuer",
                wunsch: "sternschnuppe", sternschnuppen: "sternschnuppe",
                meteor: "sternschnuppe",
                code: "matrix", gruen: "matrix",
                spiegel: "falten", dimension: "falten", faltung: "falten",
                weltuntergang: "armageddon", meteor2: "armageddon",
                apokalypse: "armageddon", endzeit: "armageddon",
                zorn: "sintflut", flut: "sintflut", gotteszorn: "sintflut",
                ueberschwemmung: "sintflut", welle: "sintflut",
                wueste: "aegypten", pyramide: "aegypten", sphinx: "aegypten",
                sandsturm: "aegypten", aegypt: "aegypten",
                osterhase: "ostern", osterei: "ostern", ostereier: "ostern",
                gucken: "augen", neugierig: "augen", schauen: "augen",
                cash: "geld", money: "geld", scheine: "geld",
                reich: "geld", kohle: "geld", moneten: "geld",
                cookie: "keks", kekse: "keks", knabbern: "keks",
                blasen: "seifenblasen", seife: "seifenblasen",
                bubbles: "seifenblasen", blubber: "seifenblasen",
                laub: "herbst", blaetter: "herbst", herbstlaub: "herbst",
                fische: "aquarium", fisch: "aquarium", wasser: "aquarium",
                meer: "aquarium", unterwasser: "aquarium",
                pinguin: "pinguine", antarktis: "pinguine",
                daemon: "fratze", teufel: "fratze", gruselig: "fratze",
                horror: "blut", blutig: "blut",
                hollow: "schloss", burg: "schloss", gruft: "schloss",
                rider: "kitt", knightrider: "kitt", pontiac: "kitt", firebird: "kitt",
                rex: "dino", trex: "dino", saurier: "dino", tyrannosaurus: "dino",
                rollo: "jalousie", lamellen: "jalousie",
                zombie: "handdurch", griff: "handdurch",
                riegel: "tore", abschliessen: "tore", zusperren: "tore",
                paint: "paintball", farbklecks: "paintball", klecks: "paintball",
                ton: "verbindung", audio: "verbindung", leitung: "verbindung",
                stumm: "verbindung", diagnose: "verbindung",
                platz: "tausch", platzwechsel: "tausch", umsetzen: "tausch",
                sitzen: "tausch", setz: "tausch",
                lecken: "leck", schlecken: "leck", ablecken: "leck",
                boxen: "box", schlag: "box", faust: "box",
                ente: "enten", entchen: "enten", kueken: "enten", entenmama: "enten",
                kaetzchen: "katze", katzenbaby: "katze", kitten: "katze", miau: "katze",
                highway: "route66", route: "route66", wueste: "route66",
                strasse: "route66", trans: "route66", muscle: "route66",
                gift: "prunk", tiktok: "prunk", prunkgeschenk: "prunk",
                muenzen: "prunk", gold: "prunk",
                /* Die grossen Geschenke — man tippt das Tier, nicht
                   den inneren Namen. */
                loewe: "ggloewe", loewin: "ggloewe", lion: "ggloewe",
                /* „dino" bleibt beim alten Dino-Effekt — einen
                   bestehenden Befehl wegzunehmen waere schlimmer als
                   eine Abkuerzung weniger. */
                trex: "ggtrex", tyrannosaurus: "ggtrex",
                elefant: "ggelefant", elefantt: "ggelefant", ruessel: "ggelefant",
                adler: "ggadler", greif: "ggadler",
                hai: "gghai", haifisch: "gghai", weisshai: "gghai",
                /* Die Achtziger. */
                tape: "kassette", musikkassette: "kassette", spulen: "kassette",
                walkman: "kassette", mixtape: "kassette",
                pac: "pacman", pacmann: "pacman", arcade: "pacman",
                video: "vhs", videoband: "vhs", videorekorder: "vhs", tracking: "vhs",
                kugel: "disko", spiegelkugel: "disko", discokugel: "disko",
                disco: "disko", achtziger: "disko",
                baer: "ggbaer", baerchen: "ggbaer", grizzly: "ggbaer",
                schiff: "pirat", piraten: "pirat", segel: "pirat", totenkopf: "pirat",
                sog: "strudel", wirbel: "strudel", ertrinken: "strudel", wirbeln: "strudel",
                wischen: "schwamm", tafel: "schwamm", putzen: "schwamm",
                ballern: "schuss", schuesse: "schuss", schiessen: "schuss",
                schussloch: "schuss", knarre: "schuss",
                wolke: "wolken", bewoelkt: "wolken",
                sprung: "glasbruch", display: "glasbruch",
                kaputt: "glasbruch", riss: "glasbruch",
                spinne: "spinnen", krabbeln: "spinnen",
                melodie: "noten", klingen: "noten",
                kuerbis: "halloween", geist: "halloween",
                advent: "weihnachten", nikolaus: "weihnachten",
                weihnacht: "weihnachten",
                font: "schrift", schriftart: "schrift",
                bg: "hintergrund", tapete: "hintergrund",
                emoji: "bild", bilder: "bild", kunst: "bild",
                help: "h", hilfe: "h", "?": "h",
                part: "leave", exit: "leave", quit: "leave" };

  function befehlsliste() {
    return BEFEHLE.map(function (b) {
      /* w ist das Wort selbst — die Tipphilfe braucht es, um den
         Befehl einsetzen zu koennen, und „nutzt" allein reicht dafuer
         nicht (dort steht auch noch der Platzhalter <name>). */
      return { w: b.w, gr: b.gr || "welt", nutzt: b.nutzt, was: b.was, kurz: b.kurz,
               brauchtName: /<name>/.test(b.nutzt || ""),
               brauchtText: /<(text|was|nummer|farbe)>/.test(b.nutzt || "") };
    });
  }

  /* Welche Befehle fangen so an? Fuer die Vorschlagsliste unter dem
     Eingabefeld. Kurzformen zaehlen mit: wer „par" tippt, soll auch
     /konfetti finden, das unter „party" laeuft. */
  function befehlsVorschlaege(anfang) {
    var a = String(anfang || "").toLowerCase().replace(/^\//, "");
    var alle = befehlsliste();
    if (!a) return alle;
    var treffer = [];
    /* Erst die, die WIRKLICH so anfangen — sie sind die wahrscheinlichste
       Absicht und stehen deshalb oben. */
    alle.forEach(function (b) {
      if (b.w.indexOf(a) === 0) treffer.push(b);
    });
    alle.forEach(function (b) {
      if (treffer.indexOf(b) < 0 && b.kurz && b.kurz.indexOf(a) === 0) treffer.push(b);
    });
    /* Dann die Kurzwoerter aus der Aliastabelle — „schnee" findet so
       auch „flocken". */
    Object.keys(KURZ).forEach(function (k) {
      if (k.indexOf(a) !== 0) return;
      var ziel = KURZ[k];
      alle.forEach(function (b) {
        if (b.w === ziel && treffer.indexOf(b) < 0) treffer.push(b);
      });
    });
    return treffer;
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
    /* WEN es angeht, steht an der Zeile selbst — nicht nur im Rundruf.
       Sonst sähe der Absender die Umarmung nicht, die er gerade
       verschickt hat: seine eigene Zeile entsteht nämlich hier und
       nicht über den Empfang.

       DER FEHLER, DEN ER GEMELDET HAT — und er ist hässlich:
       „Auch die Animation, wo man jemanden umarmt: wenn ich sage
        /drück Emmy, passiert nix. Oder /box Emmy, passiert auch nix."

       Das Feld hiess frueher „an" — UND GENAU SO HEISST das Feld, mit
       dem eine Nachricht an EINE BESTIMMTE KENNUNG adressiert wird.
       In empfangen() steht seit jeher:
            if (n.an && n.an !== zustand.ichId) return;
       Eine Umarmung an „Emmy" trug also an = "Emmy" — und weil das
       keine Kennung ist, die zu irgendjemandem passt, hat JEDES andere
       Geraet die ganze Nachricht weggeworfen. Kein Text, keine
       Animation, nichts. Nur der Absender sah etwas, weil seine Zeile
       hier lokal entsteht.

       Das Zielfeld heisst deshalb jetzt „wen". Es ist ein NAME, keine
       Kennung, und es hat mit der Zustellung nichts zu tun. */
    if (zusatz && zusatz.wen) n.wen = zusatz.wen;
    if (zusatz && zusatz.an) n.an = zusatz.an;
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
  /* =========================================================
     DEINE HAEUFIGSTEN BEFEHLE
     ---------------------------------------------------------
     GEWUENSCHT: „Ich moechte auch, dass meine haeufigsten Befehle
     oder meine haeufigsten Animationen — dass ich mir Befehle als
     Favoriten dort abspeichern kann."

     Gezaehlt wird im Geraet, nicht auf dem Server: es geht niemanden
     an, wie oft jemand /konfetti tippt, und ohne Konto soll es auch
     gehen. Gespeichert wird nur das Befehlswort und eine Zahl.
     ========================================================= */
  var ZAEHLER_SCHLUESSEL = "dma_livechat_befehlszaehler";
  function zaehlerLesen() {
    try { return JSON.parse(localStorage.getItem(ZAEHLER_SCHLUESSEL) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function zaehlerMerken(wort) {
    if (!wort) return;
    try {
      var z = zaehlerLesen();
      z[wort] = (z[wort] || 0) + 1;
      localStorage.setItem(ZAEHLER_SCHLUESSEL, JSON.stringify(z));
    } catch (e) {}
  }
  /* Die haeufigsten zuerst, hoechstens so viele wie gewuenscht. Ein
     Befehl, den es nicht mehr gibt, faellt dabei heraus. */
  function haeufigsteBefehle(wieviele) {
    var z = zaehlerLesen();
    var bekannt = {};
    BEFEHLE.forEach(function (b) { bekannt[b.w] = b; });
    return Object.keys(z)
      .filter(function (w) { return bekannt[w] && z[w] > 0; })
      .sort(function (a, b) { return z[b] - z[a] || (a < b ? -1 : 1); })
      .slice(0, wieviele || 6)
      .map(function (w) {
        return { w: w, mal: z[w], nutzt: bekannt[w].nutzt, was: bekannt[w].was };
      });
  }
  function befehlZaehlerLeeren() {
    try { localStorage.removeItem(ZAEHLER_SCHLUESSEL); } catch (e) {}
  }

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
      var gleich = KURZ;
      art = gleich[wort] || null;
    }
    if (!art) return false;
    /* Ab hier steht fest, dass es wirklich ein Befehl ist — erst jetzt
       wird gezaehlt, damit Tippfehler die Favoriten nicht verstopfen. */
    zaehlerMerken(art);

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
      return anAlle("ascii", ASCII.lachen.split("%NAME%").join(zustand.ichName),
                    { wirkung: "lachen" });
    }
    if (art === "ascii") {
      var welches = rest.toLowerCase();
      if (!ASCII[welches]) {
        return systemZeile("Bilder aus Buchstaben:\n  "
          + Object.keys(ASCII).sort().join(", ")
          + "\n\nZum Beispiel:  /ascii fuchs");
      }
      return anAlle("ascii", ASCII[welches].split("%NAME%").join(zustand.ichName));
    }
    /* Bilder aus Emojis — bunt, und sie erzählen etwas. Sie gehen als
       eigene Art hinaus, weil sie KEINE Schreibmaschinenschrift
       brauchen: Emojis sind ohnehin alle gleich breit, und in einer
       Schreibmaschinenschrift sähen sie kleiner und blasser aus. */
    if (art === "bild") {
      var welches2 = rest.toLowerCase();
      if (!EMOJIBILD[welches2]) {
        return systemZeile("Bilder aus Emojis:\n  "
          + Object.keys(EMOJIBILD).sort().join(", ")
          + "\n\nZum Beispiel:  /bild sternenhimmel");
      }
      return anAlle("emojibild", EMOJIBILD[welches2].split("%NAME%").join(zustand.ichName));
    }
    /* GEWÜNSCHT: „/drückt alle …" und später: eine echte Umarmung,
       gezielt an eine Person.

       Der Name des Ziels fährt deshalb als „an" mit. Ohne ihn wüssten
       die anderen Geräte nur, DASS gedrückt wurde, aber nicht WEN —
       und könnten den richtigen Platz nicht in den Arm nehmen. */
    if (art === "drueck") {
      var wen2 = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " drückt " + (wen2 ? wen2.name : "alle"),
                    { wirkung: "umarmen", wen: wen2 ? wen2.name : "" });
    }
    /* GEWÜNSCHT: „eine Animation, wo jemand abgeleckt wird, so dass man
       nachher sagen kann: Alex leckt Amy ab" und „zwei Boxhandschuhe,
       dass ich denjenigen boxen kann, der nicht nett war".
       Beide gehen denselben Weg wie das Drücken: die Zeile sagt WER
       WEN, und die Wirkung trägt den Namen mit, damit sie auf allen
       Geräten am selben Platz spielt. */
    if (art === "leck") {
      var wen3 = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " leckt " + (wen3 ? wen3.name : "alle") + " ab",
                    { wirkung: "lecken", wen: wen3 ? wen3.name : "" });
    }
    if (art === "box") {
      var wen4 = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " boxt " + (wen4 ? wen4.name : "alle"),
                    { wirkung: "boxen", wen: wen4 ? wen4.name : "" });
    }
    /* GEWUENSCHT: „Ausserdem moechte ich, dass wir Plaetze wechseln
       koennen, spontan." /tausch <name> setzt einen selbst auf den
       Platz der genannten Person und sie auf den eigenen. Ohne Namen
       rueckt man einfach auf den naechsten freien Platz. */
    /* GEFRAGT: „Schau mal bitte, woran das liegen koennte." Damit das
       nicht mehr geraten werden muss, zeigt dieser Befehl den Befund:
       welcher Weg gefunden wurde und ob ueberhaupt Tonpakete ankommen. */
    if (art === "verbindung") {
      return systemZeile("\ud83d\udd0c Verbindungsbefund\n" + verbindungsBericht());
    }
    if (art === "tausch") {
      if (zustand.lage !== "drin") return systemZeile("Dafuer musst du erst im Raum sein.");
      var plaetzeJetzt = plaetzeBauen();
      var meiner = null;
      plaetzeJetzt.forEach(function (pl) { if (pl.id === zustand.ichId) meiner = pl; });
      if (!meiner) return systemZeile("Du sitzt gerade auf keinem Platz — geh erst auf die Buehne.");
      if (!rest) {
        /* Ohne Namen: auf den naechsten freien Platz rutschen. */
        var frei = null;
        plaetzeJetzt.forEach(function (pl) { if (frei === null && pl.leer) frei = pl.nummer - 1; });
        if (frei === null) return systemZeile("Es ist kein Platz frei.");
        sitzTausch[zustand.ichId] = frei;
        senden({ art: "sitzplatz", ordnung: sitzTausch,
                 text: zustand.ichName + " setzt sich auf Platz " + (frei + 1) + "." });
        systemZeile("Du sitzt jetzt auf Platz " + (frei + 1) + ".");
        melden();
        return;
      }
      var wenT = personNachName(rest);
      if (!wenT) return systemZeile("Ich finde niemanden mit dem Namen \u201e" + rest + "\u201c im Raum.");
      var seiner = null;
      plaetzeJetzt.forEach(function (pl) { if (pl.id === wenT.id) seiner = pl; });
      if (!seiner) return systemZeile(wenT.name + " sitzt gerade auf keinem Platz.");
      sitzTausch[zustand.ichId] = seiner.nummer - 1;
      sitzTausch[wenT.id] = meiner.nummer - 1;
      var satz = zustand.ichName + " und " + wenT.name + " haben die Plaetze getauscht.";
      senden({ art: "sitzplatz", ordnung: sitzTausch, text: satz });
      systemZeile(satz);
      melden();
      return;
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

    /* ---- Ein Geschenk überreichen ----
       GEWÜNSCHT: „Du kannst auch noch einen Code für ein Geschenk
       machen, oder Überraschung — Xander gibt Emmy ein Geschenk, also
       /gift Emmy oder so, und dann ist das mit einer schönen Animation
       wieder."

       NACHGEBESSERT: „Wenn man jemandem ein Geschenk gibt, soll kein
       ASCII-Code im Chat übrig bleiben, sondern das soll genauso sein
       wie bei den anderen: Xander schenkt Emmy etwas — je nachdem,
       welchen Namen man wählt."

       Also eine gewöhnliche Aktionszeile wie bei Konfetti und
       Luftballons. Der Kasten aus Buchstaben blieb im Verlauf stehen
       und verstopfte ihn; die Animation trägt den Auftritt allein.
       Über /ascii geschenk gibt es das Bild weiterhin, wer es will. */
    if (art === "geschenk") {
      var wemGe = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      return anAlle("aktion", zustand.ichName + " schenkt "
        + (wemGe ? wemGe.name : "allen") + " etwas  \ud83c\udf81",
        { wirkung: "geschenk" });
    }

    /* ---- Wetter im Raum ----
       GEWÜNSCHT: „Vielleicht kann man es auch schneien lassen oder ein
       Feuerwerk veranstalten im Chat, dass man dementsprechende
       Befehle hat, oder es regnet — Sachen, die man animiert über das
       ganze Zeitfenster zeigen kann. Nur für die Leute, die neu
       reinkommen, soll das nicht auslösen."

       Das Letzte ist schon geregelt: alles, was vor dem Betreten
       geschrieben wurde, gilt als Vergangenheit und bleibt still —
       antippen spielt es trotzdem ab, aber nur für einen selbst. */
    /* DIE GROSSEN GESCHENKE — „wie TikTok das macht".
       Sie sind Wetter-Effekte wie die anderen, bekommen aber eine
       eigene Abzweigung DAVOR: ein Geschenk gilt jemandem. Steht ein
       Name dahinter, muss er als „wen" mitfahren — sonst schwebt das
       Tier zwar ueber dem Chat, aber niemand weiss, fuer wen es ist.
       „an" waere hier falsch: das ist das Feld fuer eine Kennung, und
       jedes fremde Geraet wuerfe die Nachricht damit weg. */
    if (GROSSGESCHENK[art]) {
      var g = GROSSGESCHENK[art];
      var wemG = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      if (!wemG) return anAlle("aktion", zustand.ichName + WETTER[art], { wirkung: art });
      return anAlle("aktion", zustand.ichName + " schenkt " + wemG.name + " " + g.satz + "  " + g.emoji,
                    { wirkung: art, wen: wemG.name });
    }
    if (WETTER[art]) {
      return anAlle("aktion", zustand.ichName + WETTER[art], { wirkung: art });
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

    /* ---- Der eigene Chathintergrund ----
       Nur auf diesem Gerät — wie die Schrift eine Ansichtssache, keine
       Nachricht an die anderen. Die Oberfläche macht die Arbeit (sie
       hat den Dateiwähler), hier steht nur der Anstoss. */
    if (art === "hintergrund") {
      var weg = /^(weg|aus|raus|nichts|none)$/i.test(rest);
      if (typeof zustand.hintergrundRuf === "function") zustand.hintergrundRuf(weg);
      return systemZeile(weg
        ? "Der eigene Hintergrund ist weg — es treiben wieder die Gesichter aus dem Raum dahinter."
        : "Such ein Bild aus. Es bleibt nur auf diesem Gerät.");
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

  /* =========================================================
     AUF DIE BÜHNE UND WIEDER HERUNTER
     ---------------------------------------------------------
     GEWÜNSCHT: „Man soll einfach durch Klicken auf den freien Platz
     selbstständig auf die Bühne kommen können, und es soll auch eine
     Möglichkeit geben, wieder von der Bühne runterzugehen, wenn man
     lieber nur im Chat bleiben will."

     Wer nicht auf der Bühne ist, belegt keinen Platz und schickt
     weder Ton noch Bild — er liest und schreibt mit. Für die anderen
     ändert sich nur, dass ein Platz frei wird; die Reihenfolge der
     übrigen bleibt, weil sie an der Ankunftszeit hängt und nicht an
     der Platznummer.
     ========================================================= */
  function buehneSetzen(drauf) {
    var soll = Boolean(drauf);
    if (zustand.buehne === soll) return soll;
    zustand.buehne = soll;
    if (!soll) {
      /* Herunter: Ton und Bild aus, damit auch wirklich nichts mehr
         hinausgeht — nicht nur das Bildchen verschwindet. */
      spurTauschen("ton", null);
      spurTauschen("bild", null);
      if (zustand.eigenerStrom) {
        try {
          zustand.eigenerStrom.getTracks().forEach(function (t) { t.enabled = false; });
        } catch (e) {}
      }
      zustand.spricht = false;
    } else {
      /* Hinauf: man ist wieder da — mit der Ankunftszeit von JETZT,
         damit man sich hinten anstellt und niemandem den Platz
         wegnimmt, der die ganze Zeit oben sass. */
      zustand.seit = Date.now();
      if (zustand.eigenerStrom) {
        try {
          zustand.eigenerStrom.getTracks().forEach(function (t) {
            t.enabled = t.kind === "audio" ? zustand.tonAn : zustand.bildAn;
          });
        } catch (e) {}
        var ts = zustand.eigenerStrom.getAudioTracks()[0] || null;
        var vs = zustand.eigenerStrom.getVideoTracks()[0] || null;
        spurTauschen("ton", zustand.tonAn ? ts : null);
        spurTauschen("bild", zustand.bildAn ? vs : null);
      }
    }
    senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn,
             bild: zustand.ichBild, farbe: zustand.farbe,
             seit: zustand.seit, buehne: zustand.buehne });
    praesenzSetzen(true, zustand.ichName);
    melden();
    return zustand.buehne;
  }

  /* =========================================================
     WER REDET GERADE?
     ---------------------------------------------------------
     GEWÜNSCHT: „Wenn jemand spricht, dann soll eine Animation sein,
     die für die anderen erkennbar zeigt, dass derjenige gerade
     spricht — also um sein Profilbild herum."

     Gemessen wird das im Gerät, aus dem eigenen Mikrofon: ein
     Analysator liest zwanzigmal in der Sekunde die Lautstärke. Wird
     eine Schwelle überschritten, gilt man als sprechend; nach einer
     halben Sekunde Ruhe hört es wieder auf. Das Ergebnis — ein
     einziges Ja/Nein — geht mit dem Pulsschlag hinaus. So braucht
     niemand den fremden Ton zu analysieren, und es kostet fast
     nichts.
     ========================================================= */
  var hoerRaum = null, hoerKnoten = null, hoerUhr = null, stillSeit = 0;
  var LAUT_SCHWELLE = 0.028;
  var STILL_MS = 550;

  function lautstaerkeVerfolgen(strom) {
    lautstaerkeStoppen();
    if (!strom || !strom.getAudioTracks || !strom.getAudioTracks().length) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      hoerRaum = new AC();
      var quelle = hoerRaum.createMediaStreamSource(strom);
      hoerKnoten = hoerRaum.createAnalyser();
      hoerKnoten.fftSize = 512;
      hoerKnoten.smoothingTimeConstant = 0.6;
      quelle.connect(hoerKnoten);
      var werte = new Uint8Array(hoerKnoten.fftSize);
      hoerUhr = setInterval(function () {
        if (!hoerKnoten) return;
        hoerKnoten.getByteTimeDomainData(werte);
        var summe = 0;
        for (var i = 0; i < werte.length; i++) {
          var x = (werte[i] - 128) / 128;
          summe += x * x;
        }
        var laut = Math.sqrt(summe / werte.length);
        var redet = laut > LAUT_SCHWELLE && zustand.tonAn && zustand.buehne;
        if (redet) stillSeit = 0;
        else if (!stillSeit) stillSeit = Date.now();
        var neu = redet || (stillSeit && Date.now() - stillSeit < STILL_MS);
        neu = Boolean(neu);
        if (neu !== zustand.spricht) {
          zustand.spricht = neu;
          senden({ art: "redet", spricht: neu });
          melden();
        }
      }, 120);
    } catch (e) { lautstaerkeStoppen(); }
  }
  function lautstaerkeStoppen() {
    if (hoerUhr) { clearInterval(hoerUhr); hoerUhr = null; }
    hoerKnoten = null;
    if (hoerRaum) { try { hoerRaum.close(); } catch (e) {} hoerRaum = null; }
    stillSeit = 0;
    if (zustand.spricht) { zustand.spricht = false; senden({ art: "redet", spricht: false }); }
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
    buehneSetzen: buehneSetzen,
    aufDerBuehne: function () { return zustand.buehne; },
    schreiben: schreiben,
    bildSetzen: bildSetzen,
    fotoSenden: fotoSenden,
    aufkleber: function () { return AUFKLEBER.slice(); },
    aufkleberPfad: aufkleberPfad,
    aufkleberSenden: aufkleberSenden,
    bildVerkleinern: bildVerkleinern,
    bibliothekNormen: bibliothekNormen,
    gifSenden: gifSenden,
    eigenesBild: function () { return zustand.ichBild; },
    kameraDazuholen: kameraDazuholen,
    mikrofonDazuholen: mikrofonDazuholen,
    chatLeeren: chatLeeren,
    befehlsliste: befehlsliste,
    befehlsVorschlaege: befehlsVorschlaege,
    /* Fuer die Tipphilfe: welche Bilder gibt es zur Auswahl? */
    asciiNamen: function () { return Object.keys(ASCII).sort(); },
    emojibildNamen: function () { return Object.keys(EMOJIBILD).sort(); },
    aufkleberNamen: function () { return AUFKLEBER.slice().sort(); },
    raumKlartext: raumKlartext,
    raumWechseln: raumWechseln,
    raeumeOffen: raeumeOffen,
    raumIstZu: raumIstZu,
    praesenzZuhoeren: praesenzZuhoeren,
    praesenzDa: function () { return praesenzDa; },
    leitungen: leitungen,
    beiPraesenz: beiPraesenz,
    chatLesen: function (raum) { return chatLaden(raum || zustand.raum || HAUPTRAUM); },
    lage: lage,
    beiAenderung: beiAenderung,
    moeglich: moeglich,
    neuerRaumName: neuerRaumName,
    /* Welche Effekte per BEFEHL erreichbar sind. Nicht welche
       gezeichnet werden koennen — genau dieser Unterschied hat
       neunzehn Animationen monatelang unerreichbar gemacht.
       effektetuer.js haelt beide Listen gegeneinander. */
    effektBefehle: function () {
      /* Genannt ist hier die WIRKUNG, nicht das Befehlswort: „/leck"
         loest die Wirkung „lecken" aus, „/drueck" die Wirkung
         „umarmen". Verglichen wird ja mit den Wirkungen in app.js. */
      return Object.keys(WETTER).concat(["konfetti", "ballon", "geschenk",
                                         "lecken", "boxen", "herz", "umarmen"]);
    },
    /* Nur zum Nachpruefen: die Sitzordnung von aussen nachstellen und
       einen Tausch ausloesen, ohne dass ein echter Raum noetig ist. */
    pruefSitz: function (lage) {
      if (lage) {
        zustand.lage = lage.lage || zustand.lage;
        if (lage.ichId) zustand.ichId = lage.ichId;
        if (lage.ichName) zustand.ichName = lage.ichName;
        if (typeof lage.buehne === "boolean") zustand.buehne = lage.buehne;
        if (lage.leute) zustand.leute = lage.leute;
        if (lage.seit) zustand.seit = lage.seit;
        if (lage.zuruecksetzen) {
          platzJe = {}; sitzTausch = {};
          /* Auch die Zeilen leeren: sonst haelt der Doppel-Schutz eine
             Nachricht fuer schon dagewesen, nur weil sie in derselben
             Seite vorher schon einmal entstanden ist. */
          zustand.nachrichten = [];
        }
      }
      return { plaetze: plaetzeBauen(), tausch: sitzTausch };
    },
    pruefBefehl: function (text) { return befehlAusfuehren(text); },
    /* Mithoeren, WAS hinausgeht — der Weg, den ich beim letzten Mal
       nicht geprueft hatte. Genau dort lag der Fehler mit „/drueck". */
    /* Wird beim Druck auf „hinein" aufgerufen — also waehrend der
       Beruehrung, denn nur dann zaehlt es. */
    tonFreischalten: tonFreischalten,
    verbindungsBericht: verbindungsBericht,
    pruefTonVorrat: function () { return tonVorrat.length; },
    pruefPost: function (f) {
      kanal = { send: function (p) { try { f(p && p.payload); } catch (e) {} } };
    },
    /* Einen Tonanschluss nachstellen — damit sich pruefen laesst, was
       passiert, wenn der Browser das Abspielen verweigert. */
    pruefTon: function (id) {
      var k = typeof MediaStream === "function" ? new MediaStream() : {};
      return tonAnschliessen(id || "probe", k);
    },
    /* Die haeufigsten Befehle — fuer die Tipphilfe. */
    haeufigsteBefehle: haeufigsteBefehle,
    befehlZaehlerLeeren: befehlZaehlerLeeren,
    pruefEmpfangen: function (n) { return empfangen(n); },
    /* Sprachnachrichten — nach aussen, damit die Oberflaeche sie
       bedienen kann, und fuer die Pruefung. */
    sprachGehtDas: sprachGehtDas,
    sprachLaeuft: sprachLaeuft,
    sprachAufnahmeStarten: sprachAufnahmeStarten,
    sprachAufnahmeStoppen: sprachAufnahmeStoppen,
    sprachAbbrechen: sprachAbbrechen,
    pruefSprachSenden: function (daten, sek) { return sprachSenden(daten, sek); },
    sprachHoechstdauer: function () { return SPRACH_SEKUNDEN; },
    freisprechenAn: freisprechenAn,
    freisprechenStarten: freisprechenStarten,
    freisprechenBeenden: freisprechenBeenden,
    freisprechenMelden: freisprechenMelden,
    tonAusVorrat: tonAusVorrat,
    sprachLagerStand: sprachLagerStand,
    sprachLagerLeeren: sprachLagerLeeren,
    raumSchluessel: raumSchluessel,
    gemerkterRaum: gemerkterRaum,
    raumAusAdresse: raumAusAdresse,
    adresseMitRaum: adresseMitRaum,
    istDrin: function () { return zustand.lage === "drin"; },
    /* Farbe, zuletzt benutzte Bilder, Archiv */
    gemerkteFarbe: gemerkteFarbe,
    gemerkteSchrift: gemerkteSchrift,
    beiHintergrund: function (f) { zustand.hintergrundRuf = f; },
    /* DER HINTERGRUND DES RAUMS — für alle, nicht nur für mich.
       GEWÜNSCHT: „Wenn ich den Hintergrund einstelle, dass der für alle
       sichtbar ist."

       Geschickt wird entweder ein kurzes Wort („animiert:sterne") oder
       ein klein gerechnetes Bild. Gross gerechnete Bilder gehen NICHT:
       ein Rundruf hat eine Obergrenze, und ein Bild mit
       neunhunderttausend Zeichen kommt nirgends an — es würde
       stillschweigend verschwinden, und niemand wüsste warum. Deshalb
       wird hier ausdrücklich geprüft und ehrlich „nein" gesagt. */
    RAUM_HG_GRENZE: 150000,
    raumHintergrundSetzen: function (wert) {
      var w = String(wert || "");
      if (w.length > 150000) return { ok: false,
        warum: "Das Bild ist zu gross, um es an alle im Raum zu schicken." };
      zustand.raumHg = w;
      if (zustand.lage === "drin") {
        senden({ art: "hintergrund", hg: w, name: zustand.ichName });
        systemZeile(w ? "Du hast den Hintergrund für alle im Raum gewechselt."
                      : "Du hast den Hintergrund für alle auf den Standard zurückgesetzt.");
      }
      melden();
      return { ok: true };
    },
    raumHintergrund: function () { return zustand.raumHg || ""; },
    beiRaumHintergrund: function (f) { zustand.raumHgRuf = f; },
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
    hintergrundSichern: hintergrundSichern,
    hintergrundHolen: hintergrundHolen,
    archivRaeume: archivRaeume,
    archivLaden: archivLaden,
    archivAlsText: archivAlsText
  };
})();
