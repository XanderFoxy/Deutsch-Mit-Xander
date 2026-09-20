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
  /* GEMELDET: „Man soll durch den ganzen Chatverlauf scrollen
     koennen … um das alte Raetsel zu lesen, wenn man den Chat
     verlassen oder aktualisiert hat."
     Sechzig Zeilen sind in einer Unterrichtsstunde nach zehn Minuten
     voll — danach faellt der Anfang weg, und genau dort steht die
     Aufgabe. Zweihundert reichen fuer eine ganze Stunde. Platz
     kostet das kaum: Bilder und Aufnahmen liegen laengst im Lager,
     im localStorage steht nur der Text. */
  /* GEMELDET: „Du sollst den Chat mit seinem kompletten Inhalt
     anzeigen, nicht nur 400 Zeilen."
     Also so viele, wie hineinpassen. Eine Zahl braucht es trotzdem,
     denn der localStorage eines Browsers ist endlich (wenige
     Megabyte) — und laeuft er ueber, wirft er, und dann waere der
     GANZE Verlauf weg. Deshalb steht hier eine sehr hohe Grenze und
     darunter (chatSichern) ein Netz: passt es nicht, wird nicht
     alles verworfen, sondern so lange gekuerzt, bis es passt. Lieber
     ein Teil als nichts. */
  /* SO ENDLOS WIE MOEGLICH.
     GEMELDET: „Mach wirklich 5000 Zeichen oder 6000 oder 7000, damit
     wir oben die Aufgabe endlich wieder lesen koennen. Mach es so
     endlos wie moeglich."
     Seit der Verlauf im Lager (IndexedDB) liegt statt im
     localStorage, ist Platz kein Argument mehr — dort sind es
     Hunderte von Megabyte statt weniger. Die Zahl steht deshalb auf
     zwanzigtausend. Sie ganz wegzulassen waere unehrlich: irgendwo
     muss eine Grenze stehen, sonst waechst die Datei, bis der
     Browser sie nicht mehr in einem Stueck lesen kann. Zwanzigtausend
     Zeilen sind viele Unterrichtsstunden. */
  var CHAT_VERLAUF = 20000;           // so viele legt das GERAET hoechstens ab
  /* GEWÜNSCHT: „Einer, der zum ersten Mal auf die Seite kommt, soll
     trotzdem den heutigen kompletten Tagesverlauf aus dem Chat sehen,
     ohne dass ihm irgendetwas fehlt."

     Sechzig Zeilen sind dafür zu wenig — ein lebhafter Tag hat mehr.
     Die beiden Zahlen trennen deshalb, was sie vorher vermischt
     haben: CHAT_VERLAUF ist, was im GERÄT abgelegt wird (der
     localStorage ist knapp, und diese Abschrift ist nur die Notlösung
     für „kein Netz"), CHAT_SICHT ist, was aus der gemeinsamen Tabelle
     geholt und angezeigt wird. */
  /* GEMELDET, mehrfach: „Ich kann immer noch nicht in die
     Vergangenheit nach oben scrollen. Mach viel mehr Zeilen,
     unendlich viele, damit der ganze Verlauf sichtbar wird."
     Also dieselbe Zahl wie fuer das Geraet: zwanzigtausend Zeilen
     kommen vom Server zurueck, nicht zweitausend. */
  var CHAT_SICHT = 20000;             // so viele kommen vom Server
  /* Wie viele Zeilen im Arbeitsspeicher stehen duerfen. Frueher war
     das dieselbe Zahl wie beim Server — und damit war der Verlauf
     genau dort gekappt, wo man hochscrollen wollte. */
  var CHAT_HALTEN = 20000;

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
  var NOTVERMITTLER = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:openrelay.metered.ca:80" },
    { urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject", credential: "openrelayproject" }
  ];
  var VERMITTLER = (window.DMA_TURN && window.DMA_TURN.length ? window.DMA_TURN : NOTVERMITTLER);

  /* =========================================================
     DAS EIGENE RELAIS — Cloudflare Realtime
     ---------------------------------------------------------
     GEWUENSCHT: „Bereite schon alles vor fuer den Livestream auf
     dem Medienserver. Ich soll nur noch den API-Schluessel
     eintragen muessen."

     Die oeffentlichen Gratis-Relais oben sind der Notnagel: sie
     sind ueberlastet, und wenn sie ausfallen, bleibt das Bild
     schwarz, ohne dass irgendwo etwas steht. Ist bei Supabase ein
     eigenes Relais hinterlegt, holt sich die Seite VOR dem
     Betreten kurzlebige Zugangsdaten dafuer (zwei Stunden) und
     benutzt sie.

     Der API-Token steht dabei NIRGENDS im Browser. Er liegt in
     der Datenbank, und die Edge-Function „klassenzimmer" gibt nur
     die kurzlebigen Daten heraus. Kommt nichts zurueck — kein
     Schluessel hinterlegt, kein Netz, Tagesgrenze erreicht —,
     laeuft alles weiter wie bisher mit den oeffentlichen. Das
     Klassenzimmer faellt nie aus, weil das Relais fehlt.
     ========================================================= */
  var RELAIS_WEG = "/functions/v1/klassenzimmer";
  var relaisStand = { geholt: 0, server: null, quelle: "oeffentlich", grund: "" };
  var relaisLaeuft = null;

  function relaisRufen(koerper) {
    if (!window.supabase || !window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url) {
      return Promise.resolve({ fehler: "keine-verbindung" });
    }
    return marke().then(function (m) {
      if (!m) return { fehler: "nicht-angemeldet" };
      var abbruch = new AbortController();
      var uhr = setTimeout(function () { abbruch.abort(); }, 8000);
      return fetch(window.SUPABASE_CONFIG.url.replace(/\/+$/, "") + RELAIS_WEG, {
        method: "POST",
        signal: abbruch.signal,
        headers: {
          "Authorization": "Bearer " + m,
          "apikey": window.SUPABASE_CONFIG.anonKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(koerper)
      }).then(function (a) {
        clearTimeout(uhr);
        return a.json().catch(function () { return { fehler: "kein-json" }; });
      }).catch(function () {
        clearTimeout(uhr);
        return { fehler: "nicht-erreichbar" };
      });
    });
  }

  /* DIE ANMELDEMARKE — UND WARUM GAESTE EINE BRAUCHEN.
     -----------------------------------------------------------
     GEMELDET: „Ich konnte Emmi hoeren, nur durch den Fokus-Modus,
     aber sie konnte mich nicht hoeren, wenn ich TURN aktiviert
     hatte."

     Hier lag es, und es ist eine stille Stelle: die Edge-Function,
     die die Relais-Zugangsdaten herausgibt, verlangt eine gueltige
     ANMELDUNG (sie ruft auth.getUser). Als Betreiber bist du
     angemeldet — Emmi kam ueber den Einladungslink als Gast und
     hatte gar keine Sitzung. Ihr Geraet bekam „nicht-angemeldet"
     zurueck und fiel auf die oeffentlichen Gratis-Relais zurueck.
     Die sind ueberlastet, und hinter dem symmetrischen NAT, das in
     Aegypten die Regel ist, kommt darueber nichts an. Es sieht
     dann genau so aus, wie sie es beschrieben hat.

     Also bekommt ein Gast jetzt eine ANONYME Sitzung: ein Konto
     ohne Namen, ohne E-Mail, nur damit die Leitung steht. Geht das
     nicht (die Funktion muss in Supabase unter Authentication →
     Sign In / Providers → „Anonymous sign-ins" eingeschaltet
     sein), bleibt der Grund nachlesbar und steht in /leitung —
     statt dass wieder jemand raten muss. */
  var gastVersuch = null;
  var gastGrund = "";
  function gastAnmelden(k) {
    if (gastVersuch) return gastVersuch;
    if (!k || !k.auth || !k.auth.signInAnonymously) {
      gastGrund = "diese Fassung der Supabase-Bibliothek kennt keine Gastsitzung";
      return Promise.resolve("");
    }
    gastVersuch = k.auth.signInAnonymously().then(function (a) {
      if (a && a.error) {
        gastGrund = String(a.error.message || a.error);
        return "";
      }
      gastGrund = "";
      return (a && a.data && a.data.session && a.data.session.access_token) || "";
    }).catch(function (e) {
      gastGrund = String((e && e.message) || e);
      return "";
    });
    return gastVersuch;
  }
  function gastBefund() { return gastGrund; }

  function marke() {
    try {
      var k = (konto() && Backend.zugang && Backend.zugang()) || null;
      if (!k && window.supabase && window.SUPABASE_CONFIG) {
        k = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
      }
      if (!k) return Promise.resolve("");
      return k.auth.getSession().then(function (a) {
        var t = (a && a.data && a.data.session && a.data.session.access_token) || "";
        if (t) return t;
        /* Keine Sitzung? Dann als Gast — sonst gibt es kein Relais. */
        return gastAnmelden(k);
      }).catch(function () { return ""; });
    } catch (e) { return Promise.resolve(""); }
  }

  /* Holt die Zugangsdaten — hoechstens einmal je anderthalb
     Stunden, denn sie gelten zwei. Wartet nie laenger als acht
     Sekunden; das Betreten darf daran nicht haengenbleiben. */
  /* DIE ZUGANGSDATEN UEBERLEBEN DAS NEULADEN.
     -----------------------------------------------------------------
     GEMELDET: „Dieses Konto hat heute schon 60-mal Zugangsdaten
     geholt … ich moechte in Zukunft die Leute immer hoeren."

     DA LAG DER EIGENTLICHE FEHLER, und er war meiner: die Daten lagen
     nur im Arbeitsspeicher. Jedes Neuladen der Seite hat neue geholt —
     beim Entwickeln und Ausprobieren also dutzende am Tag, und nach
     dem sechzigsten Mal sagte die Funktion 429 „tagesgrenze". Dann
     gab es kein Relais mehr, der Ton blieb aus und der Raum ging in
     den Fokus-Modus.

     Die Daten gelten ZWEI STUNDEN. Sie gehoeren also ins Geraet, nicht
     in den Arbeitsspeicher. Gespeichert wird nur, was ohnehin an jede
     Verbindung geht: ein kurzlebiger Benutzername und ein kurzlebiges
     Passwort fuers Relais. Der Cloudflare-Schluessel ist das NICHT —
     der verlaesst Supabase nie und steht nirgends in dieser Datei.

     Zehn Minuten vor Ablauf werden sie erneuert; so gibt es keine
     Luecke mitten im Gespraech. */
  var RELAIS_SCHLUESSEL = "dma_relais_v1";
  var RELAIS_GILT_MS = 2 * 60 * 60 * 1000;      /* GUELTIG_SEKUNDEN in der Funktion */
  var RELAIS_VORLAUF_MS = 10 * 60 * 1000;
  function relaisAusGeraet() {
    try {
      var roh = localStorage.getItem(RELAIS_SCHLUESSEL);
      if (!roh) return null;
      var d = JSON.parse(roh);
      if (!d || !d.server || !d.server.length || !d.geholt) return null;
      if (Date.now() - d.geholt > RELAIS_GILT_MS - RELAIS_VORLAUF_MS) return null;
      return d;
    } catch (e) { return null; }
  }
  function relaisInsGeraet(server) {
    try {
      localStorage.setItem(RELAIS_SCHLUESSEL,
        JSON.stringify({ server: server, geholt: Date.now() }));
    } catch (e) {}
  }
  function relaisHolen(neu) {
    if (window.DMA_TURN && window.DMA_TURN.length) {
      relaisStand.quelle = "eingetragen";
      return Promise.resolve(false);
    }
    /* Erst nachsehen, was noch gilt — das spart den Abruf. */
    if (!neu && !relaisStand.server) {
      var da = relaisAusGeraet();
      if (da) {
        relaisStand.server = da.server;
        relaisStand.geholt = da.geholt;
        relaisStand.quelle = "cloudflare";
        relaisStand.grund = "";
        relaisStand.ausGeraet = true;
        VERMITTLER = da.server.concat(NOTVERMITTLER);
        return Promise.resolve(true);
      }
    }
    var alter = Date.now() - relaisStand.geholt;
    if (!neu && relaisStand.server && alter < 90 * 60 * 1000) return Promise.resolve(true);
    if (relaisLaeuft) return relaisLaeuft;
    relaisLaeuft = relaisRufen({ aktion: "zugang" }).then(function (a) {
      relaisLaeuft = null;
      if (!a || a.fehler || !a.server || !a.server.length) {
        relaisStand.quelle = "oeffentlich";
        relaisStand.grund = (a && a.fehler) || "leer";
        VERMITTLER = NOTVERMITTLER;
        return false;
      }
      relaisStand.server = a.server;
      relaisStand.geholt = Date.now();
      relaisStand.quelle = "cloudflare";
      relaisStand.grund = "";
      relaisStand.ausGeraet = false;
      /* Und ins Geraet, damit das naechste Neuladen keinen neuen
         Abruf kostet. */
      relaisInsGeraet(a.server);
      /* Die eigenen Server ZUERST, die oeffentlichen als Reserve
         dahinter — faellt Cloudflare aus, ist trotzdem noch ein
         Weg da. */
      VERMITTLER = a.server.concat(NOTVERMITTLER);
      return true;
    }).catch(function () {
      relaisLaeuft = null;
      relaisStand.quelle = "oeffentlich";
      relaisStand.grund = "fehler";
      return false;
    });
    return relaisLaeuft;
  }
  /* =================================================================
     WARUM DIESES GERAET KEIN EIGENES RELAIS HAT — IM KLARTEXT
     -----------------------------------------------------------------
     GEFRAGT: „Bist du dir sicher, dass du die TURN-Sache jetzt
     beruecksichtigt hast? Sie war kein Gast, sie war ganz normal
     eingeloggt."

     Er hatte recht, und meine Gastvermutung war falsch. Nachgemessen
     in seinem eigenen Supabase, in den Protokollen der Edge-Function
     vom 18. September:

         200er : 278
         429er : 134      ← hier lag es
         503er :  28      (vor dem Eintragen der Schluessel)

     Und in der Tabelle turn_nutzung stehen 14 Ausgaben. Die Funktion
     rechnet je Ausgabe mit hoechstens 72 MB und hatte, solange
     „turn_budget_gb" nicht gesetzt war, ein Monatsbudget von 1 GB:

         14 × 72 MB = 1008 MB;  1008 + 72 = 1080 > 1024

     Ab der 15. Ausgabe hat die Funktion also JEDEM 429
     „budget-erschoepft" geantwortet — angemeldet oder nicht. Emmis
     Geraet hat gefragt, eine Absage bekommen und still auf die
     oeffentlichen Relais zurueckgeschaltet. Genau das, was sie
     beschrieben hat.

     Zwei Dinge daran waren falsch: die Bremse stand viel zu eng
     (jetzt 100 GB, eingetragen in betreiber_geheimnisse), und die
     Absage war STILL. Das Stille war das Schlimmere — deshalb steht
     der Grund ab hier im Klartext im Chat, auf dem Geraet, das ihn
     betrifft. */
  var RELAIS_GRUENDE = {
    "budget-erschoepft": "Das selbst gesetzte Monatsbudget fuers Relais ist aufgebraucht. "
      + "Es steht in betreiber_geheimnisse unter „turn_budget_gb\u201c.",
    "tagesgrenze": "Dieses Konto hat heute schon 60-mal Zugangsdaten geholt.",
    "kein-relais": "In Supabase ist noch kein Cloudflare-Schluessel hinterlegt.",
    "nicht-angemeldet": "Dieses Geraet hat keine gueltige Anmeldung — auch keine Gastsitzung.",
    "schluessel-falsch": "Cloudflare weist den hinterlegten Schluessel zurueck.",
    "nicht-erreichbar": "Die Funktion war nicht erreichbar (Netz oder Zeitueberschreitung).",
    "keine-verbindung": "Diese Seite hat gar keine Verbindung zu Supabase.",
    "kein-json": "Die Funktion hat etwas geantwortet, das kein JSON war.",
    "cloudflare-nicht-erreichbar": "Cloudflare war von Supabase aus nicht erreichbar.",
    "cloudflare-ohne-server": "Cloudflare hat geantwortet, aber keinen Server genannt.",
    "leer": "Die Antwort enthielt keine Server."
  };
  function relaisGrundKlartext() {
    if (relaisStand.quelle === "cloudflare") return "";
    var g = relaisStand.grund || "";
    return RELAIS_GRUENDE[g] || (g ? "Grund: " + g : "Grund unbekannt.");
  }
  /* Einmal je Betreten sagen, wenn es NICHT das eigene Relais ist.
     Nur auf diesem Geraet — es ist ein Befund, keine Nachricht. */
  function relaisMelden() {
    /* DIE AUTOMATISCHE REGEL.
       GEWUENSCHT: „Wir muessen ja sowieso die automatische Regel
       haben — wenn das aufgebraucht ist, dass es dann blockiert und
       wieder in den Fokus-Modus zurueckgeht, damit niemand das
       Kontingent ueberschreiten kann."

       Genau hier steht fest, dass es aufgebraucht ist: die Leitung
       antwortet mit „budget-erschoepft" oder „tagesgrenze". Von da an
       bleibt der Fokus-Modus an und laesst sich auch vom Betreiber
       nicht mehr herausschalten (siehe fokusSetzen). Das ist keine
       Strafe, sondern das Einzige, was in dem Augenblick noch
       funktioniert: ohne Relais traegt die Leitung nur noch einen
       Sprecher zugleich. */
    /* NACHGEBESSERT — und zwar, weil ich hier zwei sehr verschiedene
       Dinge in einen Topf geworfen hatte:

       „budget-erschoepft" ist die Bremse gegen die RECHNUNG. Sie
       gehoert dorthin, wo sie steht: dann gibt es kein Relais mehr,
       und der Fokus-Modus bleibt an, bis das Budget sich erneuert.

       „tagesgrenze" dagegen kostet NICHTS. Es ist nur ein Zaehler,
       wie oft ein Konto heute Zugangsdaten geholt hat — und der stand
       mit 60 viel zu eng (GEMELDET: „Dieses Konto hat heute schon
       60-mal Zugangsdaten geholt … kann man nicht 100.000-mal Request
       machen? Ich moechte in Zukunft die Leute immer hoeren."). Den
       Raum deswegen in den Fokus-Modus zu sperren war schlicht
       falsch. Ab jetzt sagt die Zeile nur, was los ist — geredet wird
       weiter. */
    if (relaisStand.grund === "budget-erschoepft") {
      if (!kontingentAus) {
        kontingentAus = true;
        zustand.fokus = true;
        systemZeile("\ud83c\udf9a\ufe0f Das Monatsbudget fuers Relais ist aufgebraucht — "
          + "ab jetzt gilt der Fokus-Modus: es spricht immer nur einer. "
          + "Geschrieben werden darf jederzeit.");
        melden();
      }
    }
    if (relaisStand.grund === "tagesgrenze") {
      systemZeile("\u2139\ufe0f Dieses Konto hat heute die eingestellte Zahl an "
        + "Relais-Abrufen erreicht. Das kostet nichts und sperrt niemanden aus \u2014 "
        + "gesprochen wird weiter, nur ohne eigenes Relais. "
        + "Die Grenze steht in betreiber_geheimnisse unter \u201eturn_tagesgrenze\u201c.");
    }
    if (relaisStand.quelle === "cloudflare") return;
    if (window.DMA_TURN && window.DMA_TURN.length) return;
    systemZeile("\u26a0\ufe0f Dieses Ger\u00e4t l\u00e4uft ohne eigenes Relais — "
      + "\u00fcber Netze hinweg (Deutschland \u2194 \u00c4gypten) kann der Ton "
      + "deshalb ausbleiben.\n   " + relaisGrundKlartext()
      + "\n   /leitung zeigt den ganzen Befund.");
  }

  function relaisLage() {
    return {
      quelle: relaisStand.quelle,
      grund: relaisStand.grund,
      anzahl: relaisStand.server ? relaisStand.server.length : 0,
      geholt: relaisStand.geholt,
      /* Kommen die Zugangsdaten aus dem Geraet? Dann hat dieser
         Besuch KEINEN Abruf gekostet — und genau das soll in
         /leitung stehen, damit man die Tagesgrenze versteht. */
      ausGeraet: Boolean(relaisStand.ausGeraet),
      giltNochMinuten: relaisStand.geholt
        ? Math.max(0, Math.round((RELAIS_GILT_MS - (Date.now() - relaisStand.geholt)) / 60000))
        : 0
    };
  }

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
    klassensprecher: false,  // vom Lehrer ernannt — fuehrt weiter, wenn er geht
    fokus: true,             // Regel des RAUMS: zuhoeren statt durcheinanderreden
    betreiber: false,   // Alex selbst — dann immer Haeuptling
    abgeschlossen: false,
    eingeladen: {},     // Kennung -> true, fuer den abgeschlossenen Raum
    geknebelt: {},      // Kennung -> true (darf nicht SCHREIBEN)
    stumm: {},          // Kennung -> true (darf nicht SPRECHEN, schreiben schon)
    gemeldet: {},       // Kennung -> Zeitpunkt der Meldung
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
      farbe: zustand.farbe, farbeName: zustand.farbeName,
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
        bild: p.bild || "", spricht: Boolean(p.spricht),
        /* HIER GING DIE WAHL VERLOREN.
           Weiter unten steht „sprechbild: p.sprechbild || 'ring'" —
           nur kam sie hier gar nicht erst mit. Diese Liste ist eine
           KOPIE der Person, Feld fuer Feld, und das eine Feld fehlte.
           Damit sah man bei allen anderen fuer immer den gruenen
           Standardring, ganz gleich, was sie gewaehlt hatten und wie
           oft ihr Geraet es schickte. Gemeldet als: „Ich sehe ihren
           Effekt nicht. Sie sieht ihn selber, aber ich seh ihn nicht." */
        sprechbild: p.sprechbild || ""
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
        tonAn: p.tonAn, bildAn: p.bildAn, bild: p.bild, spricht: p.spricht, leer: false,
        /* Welche Sprech-Animation DIESE Person fuer sich gewaehlt hat. */
        sprechbild: p.ich ? (zustand.sprechbild || "ring") : (p.sprechbild || "ring")
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
    /* Die drei gezeichneten Geschenke. Ohne Namen dahinter gilt es
       dem ganzen Raum — „schenkt allen einen Elefanten". Mit Namen
       setzt der Zweig in befehlAusfuehren den Satz selbst zusammen. */
    ggelefant:   " schenkt allen einen Elefanten  \ud83d\udc18",
    gghai:       " schenkt allen einen Hai  \ud83e\udd88",
    ggbaer:      " schenkt allen einen B\u00e4ren  \ud83d\udc3b",
    /* =========================================================
       DIE FILME SIND KEINE GESCHENKE
       ---------------------------------------------------------
       GEWUENSCHT: „Das soll nicht mehr ggtrex heissen. Das soll
       nicht mir eine geschenkorientiert sein, diese neuen Sachen …
       da soll nur der Befehl /trex sein und dann soll ein passender
       Spruch kommen: Xander Fox laesst seinen T-Rex los. Bei den
       anderen soll sich das auch nicht nach Geschenken anhoeren."

       Also heissen sie jetzt so, wie man sie tippt (/trex, /loewe,
       /lok, /zug …), und der Satz sagt, was passiert — niemand
       bekommt etwas ueberreicht. Die alten Namen bleiben als
       Abkuerzung bestehen (siehe KURZ), damit eine Zeile aus einer
       aelteren Fassung nicht ins Leere laeuft.
       ========================================================= */
    trex:        " l\u00e4sst den T-Rex los  \ud83e\udd96",
    loewe:       " l\u00e4sst den L\u00f6wen los  \ud83e\udd81",
    adler:       " l\u00e4sst den Adler steigen  \ud83e\udd85",
    /* Die Fahrzeuge. Gewuenscht: „baue das bitte mit ein in die
       Tiere und Fahrzeuge." */
    lok:         " l\u00e4sst die Dampflok heranrollen  \ud83d\ude82",
    zug:         " l\u00e4sst die Dampflok heranrollen  \ud83d\ude82",
    /* Weltraum und Tiefsee. Diese beiden gibt es nur als Film —
       und zwar als „dunkle" Sorte: wo das Bild schwarz ist, ist
       es durchsichtig, und der Chat scheint hindurch. */
    raumschiff:  " schickt das Raumschiff hinaus  \ud83d\ude80",
    uboot:       " l\u00e4sst das U-Boot abtauchen  \ud83d\udea2",
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
    ggelefant: { satz: "einen Elefanten",     emoji: "\ud83d\udc18" },
    gghai:     { satz: "einen Hai",           emoji: "\ud83e\udd88" },
    ggbaer:    { satz: "einen B\u00e4ren",        emoji: "\ud83d\udc3b" }
  };

  /* Die vier neuen Befehle, die es nur am Platz gibt. */
  var AM_PLATZ = {
    tritt:  { wirkung: "tritt",   satz: "tritt gegen das Profilbild von", emoji: "\u26bd" },
    wasser: { wirkung: "eimer",   satz: "kippt einen Eimer Wasser \u00fcber", emoji: "\ud83e\udea3" },
    wecker: { wirkung: "wecker",  satz: "stellt den Wecker neben", emoji: "\u23f0" },
    hammer: { wirkung: "hammer",  satz: "haut mit dem Hammer auf", emoji: "\ud83d\udd28" },
    /* GEWUENSCHT, Stueck fuer Stueck aus der Wunschliste:
       „Wir koennen uns auch Schneebaelle gegenseitig zuschiessen aufs
        Profilbild, so dass derjenige eingeseift wird mit Schnee."
       „Bei den Tritt- und Kick-Effekten kannst du noch einen Bumerang
        machen, der denjenigen am Kopf trifft und dann wieder zu mir
        zurueckkommt."
       „Mach mal noch Pfeil und Bogen, aber mit so einem Saugnapf-Pfeil
        — keiner, der wirklich wehtut."
       „Man koennte jemanden mit Schlagsahne einspruehen auf seinen
        Kopf, so dass da so eine Schlagsahne-Haube kommt."
       „Einen Strudel, dass man so mit seinem Profilbild ertrinkt …
        als wenn man in die andere Dimension gesaugt wird, und das
        bleibt zwei Sekunden so, dass man sieht, wie das weg ist."
       „Man koennte den anderen als Basstrommel verwenden und mit einem
        Riesentrommelstock so einen Gong machen."
       „Dann koenntest du noch einen Effekt machen, der so Stoerungen
        macht, dass das Bild so zerrissen wird wie beim Fernseher bei
        schlechtem Empfang."
       Alle sieben gehen denselben Weg wie die vier darueber: eine
       Zeile im Chat, eine Zeichnung am Platz, ein Geraeusch. */
    schnee:   { wirkung: "schneeball", satz: "wirft einen Schneeball auf", emoji: "\u2744\ufe0f" },
    bumerang: { wirkung: "bumerang",   satz: "wirft den Bumerang nach",    emoji: "\ud83e\ude83" },
    pfeil:    { wirkung: "saugpfeil",  satz: "schiesst einen Saugnapf-Pfeil auf", emoji: "\ud83c\udff9" },
    sahne:    { wirkung: "sahne",      satz: "spr\u00fcht Schlagsahne auf den Kopf von", emoji: "\ud83c\udf66" },
    trommel:  { wirkung: "trommel",    satz: "trommelt auf dem Kopf von",   emoji: "\ud83e\udd41" },
    /* GEMELDET: „die Störung ist kein Effekt um das Profilbild zu
       beeinflussen durch einen Klick sondern es ist ein Sprechbild-
       Effekt." Sie steht deshalb nicht mehr hier, sondern unten bei
       den SPRECHBILDERN. /stoerung gibt es als Befehl nicht mehr.

       Dafuer die drei, die gefehlt haben:
       „Mir ist übrigens grad noch eine eingefallen. Man kann ein Ei
        auf dem Kopf von jemand anderem zuschlagen. Ja das muss immer
        oben drüber dann passieren."
       „das mit dem losfahren und mit den Spielzügen hast du auch
        vergessen."
       Fahren und Huepfen bewegen den ABSENDER zum Genannten hin —
       der Satz sagt das auch so. */
    ei:       { wirkung: "ei",         satz: "schl\u00e4gt ein Ei auf dem Kopf auf von", emoji: "\ud83e\udd5a" },
    fahren:   { wirkung: "fahren",     satz: "f\u00e4hrt hin\u00fcber zu", emoji: "\ud83d\ude97" },
    /* GEWUENSCHT: „wenn ich mit jemandem gemeinsam fahren will, dann
       kriege ich sein Profilbild an und sage dann Fahrrad oder so und
       dann fahren wir einfach weg." */
    gemeinsam: { wirkung: "gemeinsam", satz: "f\u00e4hrt gemeinsam los mit", emoji: "\ud83d\udeb2" },
    /* GEWUENSCHT: „vielleicht kriegst du das hin, dass du das Profilbild
       in ein Flugzeug packst … und dann fliegt dieses Flugzeug auf den
       anderen Platz und setzt diese Person da ab." Dazu der Maulwurf
       („dann graebt man sich in die Erde rein und kommt an der anderen
       Stelle wieder raus") und das Tor („dass man in diesem Gate
       verschwindet und an einem anderen Platz wieder auftaucht"). */
    flug:     { wirkung: "flug",     satz: "fliegt hin\u00fcber zu", emoji: "\u2708\ufe0f" },
    maulwurf: { wirkung: "maulwurf", satz: "gr\u00e4bt sich hin\u00fcber zu", emoji: "\ud83e\udda1" },
    portal:   { wirkung: "portal",   satz: "geht durchs Tor zu", emoji: "\ud83c\udf00" },
    /* GEWUENSCHT: „eine Variante mit dem Flugzeug ... und eine
       Variante vielleicht noch mit einem Boot ... oder dass man einen
       Baustellenkran hat." Zwei weitere Reisen, gleiche Technik. */
    boot:     { wirkung: "boot",     satz: "schippert hin\u00fcber zu", emoji: "\u26f5" },
    kran:     { wirkung: "kran",     satz: "l\u00e4sst sich hin\u00fcberheben zu", emoji: "\ud83c\udfd7\ufe0f" },
    /* GEWUENSCHT: „die Feuerreanimation am Rand des Profil rahmen." */
    brennen:  { wirkung: "brennen",  satz: "setzt den Rahmen in Brand bei", emoji: "\ud83d\udd25" },
    huepfen:  { wirkung: "spielzug",   satz: "h\u00fcpft Platz f\u00fcr Platz zu", emoji: "\ud83c\udfb2" },
    /* GEWUENSCHT: „das Laufen von Nummer zu Nummer bis ans Ziel, wo
       man hin moechte … diese Springen-Animation wie auf dem
       Spielplatz." Er nennt es Laufen, also heisst es auch so;
       /huepfen bleibt als der alte Name bestehen, damit niemandem
       ein Befehl unter den Haenden wegbricht. */
    laufen:   { wirkung: "spielzug",   satz: "l\u00e4uft Feld f\u00fcr Feld zu", emoji: "\ud83d\udc63" },
    /* GEMELDET, nach dem Umbau zum Sprechbild: „du kannst diese
       Störung aber trotzdem in den klickbaren Effekten drin lassen …
       denn ich finde es trotzdem wichtig, den Empfang von jemand
       anderem zu stören." Also beides: hier der Wurf, unten das
       Sprechbild. */
    stoerung: { wirkung: "stoerung",   satz: "st\u00f6rt den Empfang von",  emoji: "\ud83d\udcfa" },
    /* GEMELDET: „Schau doch mal bitte in meinem Verlauf, von welchen
       Effekten ich dir gesprochen habe und berücksichtige alle diese
       Effekte und lasse keinen aus." Nachgelesen — das hier sind die,
       die noch offen waren, mit seinen eigenen Worten im Kopf:
       Katapult, Strohhalm, Auspeitschen, Bowling, Billard, Kopfhoerer,
       Fensterluke, DJ-Schallplatte, Ohrfeige, Basketball, Tennis und
       ein Zufallsmodus. */
    katapult:   { wirkung: "katapult",   satz: "schleudert mit dem Katapult", emoji: "\ud83e\ude83" },
    strohhalm:  { wirkung: "strohhalm",  satz: "saugt mit dem Strohhalm an", emoji: "\ud83e\udd64" },
    blubbern:   { wirkung: "blubbern",   satz: "pustet in den Strohhalm von", emoji: "\ud83e\uded7" },
    knuellen:   { wirkung: "knuell",     satz: "zerkn\u00fcllt wie ein Blatt Papier", emoji: "\ud83d\uddd2\ufe0f" },
    peitsche:   { wirkung: "peitsche",   satz: "peitscht aus", emoji: "\ud83e\udea2" },
    bowling:    { wirkung: "bowling",    satz: "r\u00e4umt mit der Bowlingkugel ab", emoji: "\ud83c\udfb3" },
    billard:    { wirkung: "billard",    satz: "st\u00f6sst mit dem Queue an", emoji: "\ud83c\udfb1" },
    /* GEWUENSCHT: „Dann moechte ich noch einen Effekt haben, der
       Schneekugel heisst: unten sind kleine Figuren, ein Baeumchen,
       ein Haeuschen … erst schuettelt man das Profilbild durch, dann
       fallen die Schneeflocken." */
    schneekugel:{ wirkung: "schneekugel", satz: "sch\u00fcttelt die Schneekugel von", emoji: "\ud83d\udd2e" },
    kopfhoerer: { wirkung: "kopfhoerer", satz: "setzt Kopfh\u00f6rer auf", emoji: "\ud83c\udfa7" },
    /* GEWUENSCHT: „Die Luke kannst du Fenster nennen." Der alte Name
       bleibt als Deckname stehen, damit eine Zeile aus einem alten
       Verlauf nicht ins Leere laeuft. */
    fenster:    { wirkung: "luke",       satz: "\u00f6ffnet das Fenster vor", emoji: "\ud83e\ude9f" },
    luke:       { wirkung: "luke",       satz: "\u00f6ffnet das Fenster vor", emoji: "\ud83e\ude9f" },
    rollo:      { wirkung: "rollo",      satz: "zieht das Rollo hoch bei", emoji: "\ud83c\udf9a\ufe0f" },
    lamellen:   { wirkung: "lamellen",   satz: "\u00f6ffnet die Jalousie bei", emoji: "\ud83e\udea7" },
    platte:     { wirkung: "platte",     satz: "legt eine Platte auf", emoji: "\ud83d\udcbf" },
    ohrfeige:   { wirkung: "ohrfeige",   satz: "gibt eine Ohrfeige", emoji: "\ud83e\udef3" },
    basketball: { wirkung: "basketball", satz: "dribbelt auf dem Kopf von", emoji: "\ud83c\udfc0" },
    tennis:     { wirkung: "tennis",     satz: "spielt einen Ball zu", emoji: "\ud83c\udfbe" },
    zufall:     { wirkung: "zufall",     satz: "l\u00e4sst den Zufall entscheiden bei", emoji: "\ud83c\udfb0" },
    /* RUNDE 18 — die sieben Neuen. Jeder Satz sagt, was wirklich
       passiert; die Wirkung traegt denselben Namen wie die Zeichnung
       in app.js. */
    licht:      { wirkung: "licht",      satz: "macht das Licht aus bei", emoji: "\ud83c\udf1a" },
    muenze:     { wirkung: "muenze",     satz: "dreht wie eine M\u00fcnze", emoji: "\ud83e\ude99" },
    wischer:    { wirkung: "wischer",    satz: "putzt mit dem Scheibenwischer", emoji: "\ud83e\uddfd" },
    zwille:     { wirkung: "zwille",     satz: "schiesst mit der Zwille auf", emoji: "\ud83e\ude83" },
    pusterohr:  { wirkung: "pusterohr",  satz: "trifft mit dem Pusterohr", emoji: "\ud83e\udd64" },
    gluehbirne: { wirkung: "gluehbirne", satz: "dreht wie eine Gl\u00fchbirne ein", emoji: "\ud83d\udca1" },
    entbloessung:{ wirkung: "entbloessung", satz: "zieht den BH herunter bei", emoji: "\ud83d\udc59" },
    /* RUNDE 19 — der Hut, die Zeitbombe, und zwei zum Gutsein. */
    hut:        { wirkung: "hut",        satz: "setzt einen Cowboyhut auf", emoji: "\ud83e\udd20" },
    bombe:      { wirkung: "bombe",      satz: "z\u00fcndet eine Zeitbombe bei", emoji: "\ud83d\udca3" },
    streicheln: { wirkung: "streicheln", satz: "streichelt", emoji: "\ud83e\udef6" },
    kuss:       { wirkung: "kuss",       satz: "gibt einen Kuss", emoji: "\ud83d\udc8b" },
    /* GEMELDET: „bei den Effekten, die man noch auswählen kann, dass
       man den anderen wie so ein Keks aufessen kann … dass man so Biss
       für Biss den so anbeißt, und auf ist." */
    aufessen:   { wirkung: "aufessen",   satz: "isst Biss f\u00fcr Biss auf", emoji: "\ud83c\udf6a" },
    /* GEMELDET: „jemand ist unter einem, und wenn man direkt
       übereinander ist, könnte man die Sanduhr so machen, dass ich
       unten in ihn rein fließe und er sich oben mit mir austauscht." */
    sanduhr:    { wirkung: "sanduhr",    satz: "l\u00e4uft wie durch eine Sanduhr und tauscht den Platz mit", emoji: "\u231b" }
  };
  /* Und die vier, die es fuer den ganzen Raum schon gibt — mit Namen
     dahinter werden sie klein und gelten nur dieser Person. */
  var AUCH_AM_PLATZ = {
    regen:    { wirkung: "regenwolke",  satz: "l\u00e4sst eine Regenwolke ziehen \u00fcber", emoji: "\ud83c\udf27\ufe0f" },
    gewitter: { wirkung: "donnerwolke", satz: "l\u00e4sst ein Gewitter los \u00fcber", emoji: "\u26c8\ufe0f" },
    geld:     { wirkung: "reichtum",    satz: "l\u00e4sst Geld regnen auf", emoji: "\ud83d\udcb8" },
    bonbon:   { wirkung: "zucker",      satz: "l\u00e4sst Bonbons regnen auf", emoji: "\ud83c\udf6c" },
    /* Den Strudel gibt es schon fuer den ganzen Raum. MIT Namen wird
       daraus der kleine: er zieht genau ein Profilbild ein. Dieselbe
       Regel wie bei Regen, Gewitter, Geld und Bonbons. */
    strudel:  { wirkung: "sog",         satz: "zieht einen Strudel auf unter", emoji: "\ud83c\udf00" },
    /* GEMELDET: „das Paintball hast du auch noch vergessen." Den
       grossen fuer den ganzen Raum gab es schon — mit einem Namen
       dahinter wird daraus EIN Treffer auf EIN Profilbild. */
    paintball: { wirkung: "paintfleck", satz: "trifft mit dem Paintball", emoji: "\ud83c\udfa8" },
    /* Kekse gab es fuer den Raum schon — mit Namen kruemeln sie auf
       genau ein Profilbild. */
    keks:      { wirkung: "krumel",     satz: "kr\u00fcmelt Kekse auf", emoji: "\ud83c\udf6a" },
    /* GEMELDET: „ich möchte aber jetzt ne Pac-Man Animation haben, dass
       mein Profilbild sich zu diesem Pac-Man verwandelt und ich den
       anderen auffressen kann, egal wo er sitzt … Und dann ist er
       praktisch von der Bühne runter … und er muss dann wieder klicken,
       um nach oben zu kommen."
       Den grossen Pac-Man fuer den Raum gab es schon. MIT einem Namen
       wird daraus die Jagd ueber die Sitzfelder. */
    pacman:    { wirkung: "pacjagd",    satz: "jagt als Pac-Man \u00fcber die Pl\u00e4tze und frisst", emoji: "\ud83d\udc7e" }
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

  /* Die Namensfarbe liegt getrennt — „/c faerbt immer alles
     gleichzeitig, mit /c name und /c schrift kann man es
     spezifischer machen." Leer heisst: der Name nimmt die
     Schriftfarbe, so wie es immer war. */
  var NAMENSFARB_SCHLUESSEL = "dma_livechat_namensfarbe";
  function namensfarbeMerken(f) {
    try {
      if (f) localStorage.setItem(NAMENSFARB_SCHLUESSEL, f);
      else localStorage.removeItem(NAMENSFARB_SCHLUESSEL);
    } catch (e) {}
  }
  function gemerkteNamensfarbe() {
    try { return localStorage.getItem(NAMENSFARB_SCHLUESSEL) || ""; } catch (e) { return ""; }
  }

  /* =========================================================
     WIE DEIN PLATZ AUSSIEHT, WENN DU SPRICHST
     ---------------------------------------------------------
     GEWUENSCHT: „Die Animation soll man sich auch einstellen
     koennen fuer das Sprechen, dass jeder das individualisieren
     kann. Ich weiss nicht, wo man das einstellt."

     Er hatte recht: es gab gar keine Einstellung, nur einen
     festen gruenen Ring. Jetzt gibt es fuenf, sie liegen im
     eigenen Geraet und fahren in der Anwesenheitsmeldung mit —
     so sehen die ANDEREN die Animation, die man sich selbst
     ausgesucht hat, und nicht jeder eine eigene.
     ========================================================= */
  /* =================================================================
     ELF SPRECHBILDER
     -----------------------------------------------------------------
     GEWUENSCHT: „Ich brauche noch mehr fantastische Profilbildrahmen,
     wenn man spricht. Diese Mikrofoneffekte — da brauche ich noch
     richtig individuelle Sachen, die wirklich nach Animation aussehen.
     Der Regenbogen muss viel bunter, dafuer klarer und farbiger werden,
     viel mehr ausstrahlen wie ein schoener Regenbogen. Das mit dem
     Magischen meine ich so: viele kleine Sterne oder Punkte funkeln in
     verschiedenen Staerken, die das Profilbild umgeben und wie ein
     optisches Glissando um das Profilbild herumtanzen … und dann
     vielleicht noch eins, wo Noten rauskommen. Wenn ich zum Beispiel
     Musik mag, koennte ich das einstellen, und dann sind um den
     Profilkreis herum Noten angezeigt — und noch mehr Effekte, die
     wirklich Spass machen."

     Sechs sind neu, und sie sind etwas anderes als die fuenf alten:
     die alten sind RAENDER (ein Ring, eine Farbe, ein Puls), die neuen
     sind TEILCHEN — echte kleine Dinge, die um den Kreis tanzen. Dafuer
     baut app.js beim Sprechen ein Feld mit ein paar Dutzend Elementen
     in den Kreis und raeumt es wieder weg, wenn die Person still ist.
     ================================================================= */
  var SPRECHBILDER = {
    ring:       "Grüner Ring — ruhig und deutlich",
    welle:      "Schallwellen — zwei Ringe laufen nach außen",
    puls:       "Herzschlag — der Kreis pocht",
    regenbogen: "Regenbogen — alle Farben auf einmal, hell und klar",
    funkeln:    "Funkeln — Lichter wandern um den Kreis, er glimmt warm",
    magie:      "Magie — viele Sternchen tanzen um dich herum",
    noten:      "Noten — Musik steigt aus dem Bild auf",
    herzen:     "Herzen — kleine Herzen steigen auf",
    feuer:      "Feuer — Flammen züngeln am Rand",
    strom:      "Strom — Blitze zucken um den Kreis",
    blasen:     "Blasen — Seifenblasen steigen auf",
    /* GEWUENSCHT: „Vielleicht kannst du noch was mit Eis machen, dass
       das Bild gefriert, wenn ich spreche" und „als Sprech-Effekt
       waere noch so Blumenblaetter, als wenn der Profilrahmen eine
       Blume waere und die blueht dann immer, wenn man spricht."
       Beide setzen an dem an, was er sich fuer ALLE wuenscht: „alles
       soll sich eher am Rahmen orientieren." */
    eis:        "Eis — der Rand friert zu, Kristalle wachsen herein",
    bluete:     "Blüte — der Rahmen geht auf wie eine Blume",
    /* GEMELDET: „die Störung ist kein Effekt um das Profilbild zu
       beeinflussen durch einen Klick sondern es ist ein Sprechbild-
       Effekt." Also hierher umgezogen: solange die Person spricht,
       zerreisst ihr Bild wie bei schlechtem Empfang. */
    stoerung:   "Störung — das Bild zerreißt wie bei schlechtem Empfang",
    /* GEMELDET: „und dann noch ein paar Halloweeneffekte und
       Weihnachtseffekte — so Blut, was über das Profil läuft, oder
       Spinnweben. Du musst gucken, ob das als Sprecheffekt passt oder
       ob man andere damit beeinflusst, was da besser geeignet ist."
       Nachgesehen: beides ist ein ZUSTAND, kein Wurf — es laeuft und
       haengt, solange jemand spricht. Also Sprechbilder. */
    blut:       "Blut — es läuft über das Bild, solange du sprichst",
    spinnweb:   "Spinnweben — der Rahmen wächst zu, eine Spinne seilt sich ab",
    aus:        "Nichts — kein Zeichen beim Sprechen"
  };
  var SPRECHBILD_SCHLUESSEL = "dma_livechat_sprechbild";
  /* GEWUENSCHT: „Das soll mit meinem Profil auch abspeichern … sodass
     man das auf einem anderen Gerät auch wiederfindet." Also nicht
     mehr nur ins Geraet, sondern in dieselbe Ablage wie alle anderen
     Klassenzimmer-Einstellungen (app.js, kzEinstellung). localStorage
     bleibt daneben stehen: es ist sofort da und traegt auch den, der
     gar nicht angemeldet ist. */
  function sprechbildMerken(x) {
    try {
      if (x && SPRECHBILDER[x]) localStorage.setItem(SPRECHBILD_SCHLUESSEL, x);
      else localStorage.removeItem(SPRECHBILD_SCHLUESSEL);
    } catch (e) {}
    try { if (window.DMA_EINST) window.DMA_EINST.setzen("sprechbild", x || ""); } catch (e) {}
  }
  function gemerktesSprechbild() {
    try {
      var ausProfil = window.DMA_EINST ? window.DMA_EINST.holen("sprechbild", "") : "";
      if (ausProfil && SPRECHBILDER[ausProfil]) return ausProfil;
    } catch (e) {}
    try {
      var x = localStorage.getItem(SPRECHBILD_SCHLUESSEL) || "";
      return SPRECHBILDER[x] ? x : "ring";
    } catch (e) { return "ring"; }
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
  /* =========================================================
     DAS BACKEND HEISST BACKEND — NICHT window.Backend
     ---------------------------------------------------------
     GEMELDET: „Zum Unterricht rufen darf nur der Betreiber …
     Emmi ist gerade nirgends zu finden und das Postfach steht
     hier nicht zur Verfuegung."

     Der Grund ist eine Kleinigkeit mit grosser Wirkung, und sie
     war meine: backend.js beginnt mit

         const Backend = (function () { … })();

     Ein „const" auf oberster Ebene erzeugt einen globalen NAMEN,
     aber KEINE Eigenschaft am Fenster. „Backend" gibt es also,
     „window.Backend" nicht — und jede Pruefung der Form
     „window.Backend && Backend.irgendwas" ist damit IMMER falsch.
     Genau deshalb fand /i niemanden und das Postfach galt als
     nicht verfuegbar, obwohl beides laengst da war.
     (Gemessen im Browser: typeof Backend = "object",
      typeof window.Backend = "undefined".)

     Ab jetzt fragt EINE Stelle, und die fragt richtig. */
  function konto() {
    try {
      return (typeof Backend !== "undefined" && Backend) ? Backend : null;
    } catch (e) { return null; }
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
      return (konto() && Backend.zugang && Backend.zugang()) || null;
    } catch (e) { return null; }
  }

  /* WIE MAN ZWANZIGTAUSEND ZEILEN HOLT, OHNE DAS TELEFON ZU FLUTEN
     -----------------------------------------------------------
     Eine Zeile kann ein BILD tragen — als Datenadresse, bis zu
     zweihunderttausend Zeichen. Zwanzigtausend solche Zeilen in einem
     Zug waeren Hunderte von Megabyte; auf dem Handy waere das keine
     Geschichte mehr, sondern ein Absturz.
     Also zwei Abfragen statt einer: erst der ganze Verlauf OHNE
     Bilder (Text ist winzig, da sind zwanzigtausend Zeilen nichts),
     dann die Bilder der letzten zweihundert Zeilen. Weiter zurueck
     liegende Bilder hat, wer dabei war, ohnehin im eigenen Lager —
     und wer nicht dabei war, liest den Text, um den es geht. */
  var BILDER_ZURUECK = 200;
  function serverLaden(raum) {
    var z = angemeldeterZugang();
    if (!z) return Promise.resolve([]);
    return z.from(TISCH)
      .select("id,raum,autor,name,text,art,farbe,farbe_name,bild,quelle_id,erstellt")
      .eq("raum", raum)
      /* Eine gefluesterte Zeile gehoert nicht in den offenen Verlauf —
         sie kommt gleich getrennt, und nur bei den beiden, die sie
         angeht. */
      .is("an_id", null)
      .order("erstellt", { ascending: false })
      .limit(CHAT_SICHT)
      .then(function (a) {
        if (!a || a.error || !a.data) return [];
        var zeilen = a.data.slice().reverse().map(function (r) {
          return {
            /* Die Kennung vom Absender gewinnt — siehe serverSichern. */
            id: r.quelle_id || ("s" + r.id),
            von: r.autor ? "k" + String(r.autor).replace(/[^a-z0-9]/gi, "").slice(0, 22).toLowerCase() : "",
            name: r.name || "Gast",
            text: r.text || "",
            bild: r.bild || "",
            bildImChat: "",
            farbe: r.farbe || "",
            farbeName: r.farbe_name || "",
            art: r.art || "text",
            zeit: new Date(r.erstellt).getTime(),
            eigen: false
          };
        });
        /* Und jetzt die Bilder — nur die der juengsten Zeilen. */
        return z.from(TISCH)
          /* quelle_id MUSS mitkommen: die Zeilen tragen jetzt die
             Kennung des Absenders, nicht die Nummer der Tabelle — ohne
             sie fände kein einziges Bild mehr seine Zeile. */
          .select("id,quelle_id,bild_im_chat")
          .eq("raum", raum)
          .neq("bild_im_chat", "")
          .order("erstellt", { ascending: false })
          .limit(BILDER_ZURUECK)
          .then(function (b) {
            if (b && !b.error && b.data) {
              var nach = {};
              b.data.forEach(function (r) { nach[r.quelle_id || ("s" + r.id)] = r.bild_im_chat || ""; });
              zeilen.forEach(function (n) { if (nach[n.id]) n.bildImChat = nach[n.id]; });
            }
            return zeilen;
          }, function () { return zeilen; })
          .then(function (mitBildern) {
            return fluesternLaden().then(function (geheim) {
              return mitBildern.concat(geheim);
            }, function () { return mitBildern; });
          });
      })
      .catch(function () { return []; });
  }

  /* =========================================================
     FLUESTERN FOLGT DER PERSON, NICHT DEM RAUM
     ---------------------------------------------------------
     GEWUENSCHT: „Wenn ich jemandem auf sein Fluestern antworte und
     derjenige ist im selben Moment dabei zu gehen und kann die
     Nachricht nicht mehr lesen — dann moechte ich, dass er sie
     spaeter trotzdem sieht. Und dass das Fluestern generell ueberall
     steht, was an dieser Person gemacht wurde: egal in welchem Raum
     sie ist, chronologisch, unabhaengig vom Raum."

     Ein Zuruf von Geraet zu Geraet kann das nicht — wer weg ist, ist
     weg. Also bekommt eine gefluesterte Zeile eine ANSCHRIFT in der
     Tabelle: an_id. Beim Betreten holt sich jeder, was an ihn
     gerichtet war und was er selbst gefluestert hat — aus ALLEN
     Raeumen. Damit steht es chronologisch zwischen den anderen
     Zeilen, in jedem Raum, auch Tage spaeter.

     Lesen darf das niemand sonst: die Regel in der Datenbank gibt
     eine Zeile mit Anschrift nur an den Absender und den Empfaenger
     heraus (siehe supabase/klassenzimmer-chat.sql). */
  var FLUESTER_ZURUECK = 400;
  function meineKontoId() {
    try {
      var nutzer = konto() && Backend.currentUser && Backend.currentUser();
      return (nutzer && nutzer.id) || "";
    } catch (e) { return ""; }
  }
  function fluesternLaden() {
    var z = angemeldeterZugang();
    var ich = meineKontoId();
    if (!z || !ich) return Promise.resolve([]);
    return z.from(TISCH)
      .select("id,raum,autor,name,text,farbe,farbe_name,bild,bild_im_chat,an_id,an_name,quelle_id,erstellt")
      .not("an_id", "is", null)
      .or("an_id.eq." + ich + ",autor.eq." + ich)
      .order("erstellt", { ascending: false })
      .limit(FLUESTER_ZURUECK)
      .then(function (a) {
        if (!a || a.error || !a.data) return [];
        return a.data.slice().reverse().map(function (r) {
          var eigen = r.autor === ich;
          return {
            /* Die Kennung des Zurufs gewinnt — dann ist es fuer alle
               dieselbe Zeile, ob sie nun live kam oder nachgereicht
               wurde. */
            id: r.quelle_id || ("s" + r.id),
            von: eigen ? zustand.ichId
                       : (r.autor ? "k" + String(r.autor).replace(/[^a-z0-9]/gi, "").slice(0, 22).toLowerCase() : ""),
            name: eigen ? zustand.ichName : (r.name || "Gast"),
            /* Beim Absender steht, an wen es ging — beim Empfaenger
               steht der Text allein, wie eh und je. */
            text: eigen ? ("an " + (r.an_name || "jemanden") + ": " + (r.text || ""))
                        : (r.text || ""),
            wen: eigen ? (r.an_name || "") : "",
            art: "fluester",
            bild: eigen ? zustand.ichBild : (r.bild || ""),
            /* GEWUENSCHT: „Mach es bitte ausserdem moeglich, dass wir
               uns Bilder fluestern koennen."
               Ein gefluestertes Bild liegt in derselben Spalte wie
               jedes andere Bild im Chat — es traegt nur zusaetzlich
               eine Anschrift (an_id). Deshalb kommt es hier einfach
               mit zurueck, und der Rest der Seite behandelt es wie
               jedes Bild. */
            bildImChat: r.bild_im_chat || "",
            farbe: r.farbe || "",
            farbeName: r.farbe_name || "",
            /* Aus welchem Raum es kam — aber nur, wenn es ein anderer
               war als der, in dem man gerade sitzt. */
            woher: r.raum && r.raum !== zustand.raum ? raumKlartext(r.raum) : "",
            zeit: new Date(r.erstellt).getTime(),
            eigen: eigen
          };
        });
      }, function () { return []; });
  }

  /* Eine gefluesterte Zeile in die Tabelle legen — das ist das
     Nachreichen fuer den, der gerade nicht da war. Ohne Konto auf
     einer der beiden Seiten geht es nicht; dann bleibt es beim Zuruf
     von Geraet zu Geraet. */
  function fluesternSichern(ziel, txt, kennung, bild) {
    var z = angemeldeterZugang();
    var ich = meineKontoId();
    var anKonto = ziel && (ziel.konto || kontoVon(ziel.id));
    if (!z || !ich || !anKonto) return;
    try {
      z.from(TISCH).insert({
        raum: zustand.raum,
        autor: ich,
        name: zustand.ichName || "Gast",
        bild: zustand.ichBild || "",
        text: String(txt || ""),
        /* Auch ein gefluestertes Bild wird nachgereicht — sonst waere
           es weg, sobald die andere Seite den Raum wechselt. */
        bild_im_chat: typeof bild === "string" ? bild.slice(0, 200000) : "",
        farbe: zustand.farbe || "",
        farbe_name: zustand.farbeName || "",
        art: "fluester",
        an_id: anKonto,
        an_name: ziel.name || "",
        /* DIESELBE KENNUNG WIE BEIM ZURUF. Ohne sie stuende die Zeile
           zweimal da: einmal sofort ueber die Leitung, einmal spaeter
           aus der Tabelle. Mit ihr erkennt verschmelzen() beide als
           dieselbe. */
        quelle_id: String(kennung || "")
      }).then(function (a) {
        if (a && a.error) sicherungFehlt(a.error);
      }, function (f) { sicherungFehlt(f); });
    } catch (e) { sicherungFehlt(e); }
  }

  function serverSichern(n) {
    var z = angemeldeterZugang();
    if (!z) return;
    var nutzer = null;
    try { nutzer = konto() && Backend.currentUser && Backend.currentUser(); } catch (e) {}
    if (!nutzer || !nutzer.id) return;          // ohne Anmeldung kein Eintrag
    try {
      z.from(TISCH).insert({
        raum: zustand.raum,
        autor: nutzer.id,
        name: n.name || "Gast",
        bild: n.bild || "",
        text: n.text || "",
        bild_im_chat: n.bildImChat || "",
        /* HIER LAG DER GANZE VERLUST DER VERGANGENHEIT.
           Diese Zeile hiess „farbeName" — eine Spalte, die es in der
           Tabelle nicht gibt. PostgREST weist eine Einfuegung mit
           einer unbekannten Spalte KOMPLETT zurueck, und der Fehler
           lief hier in ein leeres then(). Also wurde seit dem Tag,
           an dem diese Spalte dazukam, KEINE EINZIGE Zeile
           gespeichert: die Tabelle war leer, jeder sah nur seine
           eigene Abschrift, und „nach oben scrollen" endete nach
           wenigen Zeilen. Die Spalte heisst farbe_name — wie alle
           anderen auch. */
        farbe: n.farbe || zustand.farbe || "", farbe_name: n.farbeName || zustand.farbeName || "",
        art: n.art || "text",
        /* DIESELBE KENNUNG WIE UEBER DIE LEITUNG.
           Ohne sie muss verschmelzen() raten, ob die Zeile aus der
           Tabelle dieselbe ist wie die, die eben live hereinkam — und
           es raet ueber Name, Text und Zeit. Gehen die Uhren zweier
           Geraete ein paar Sekunden auseinander, steht dieselbe
           Nachricht zweimal da. Mit der Kennung kann das nicht mehr
           passieren. */
        quelle_id: String(n.id || "")
      }).then(function (a) {
        /* EIN FEHLER, DEN NIEMAND SIEHT, IST KEIN FEHLER — ER IST EIN
           DATENVERLUST. Genau daran ist der gemeinsame Verlauf
           gescheitert: die Einfuegung schlug fehl, und niemand hat es
           je erfahren. Ab jetzt steht es in der Konsole, und EINMAL
           je Sitzung auch im Chat — sonst merkt es wieder keiner. */
        if (a && a.error) sicherungFehlt(a.error);
      }, function (f) { sicherungFehlt(f); });
    } catch (e) { sicherungFehlt(e); }
  }
  var sicherungGemeldet = false;
  function sicherungFehlt(fehler) {
    try { console.warn("Klassenzimmer: Chatzeile nicht gespeichert —", fehler); } catch (e) {}
    if (sicherungGemeldet) return;
    sicherungGemeldet = true;
    try {
      systemZeile("\u26a0\ufe0f Diese Zeile konnte nicht im gemeinsamen Verlauf abgelegt werden \u2014 "
        + "sie steht nur auf deinem Ger\u00e4t. (" + ((fehler && (fehler.message || fehler.hint)) || "unbekannter Grund") + ")");
    } catch (e) {}
  }

  /* Zwei Listen zu einer: nach Zeit sortiert, ohne Doppelte.
     Dieselbe Nachricht kommt einmal über den Kanal (sofort) und
     einmal aus der Tabelle (beim nächsten Betreten). Erkannt wird
     sie an Absender, Zeit und Text — die Kennungen sind verschieden,
     weil die Tabelle ihre eigene vergibt. */
  /* =========================================================
     ALTE BEDIENUNGSHINWEISE AUS DEM VERLAUF NEHMEN
     ---------------------------------------------------------
     GEWUENSCHT: „Alles, was ich im Chat gesammelt habe mit ,Du bist
     hier Haeuptling', das koennte auch wieder raus."

     Er hat recht: das ist ein Hinweis zur Bedienung, kein Gespraech.
     Heute steht so etwas als kurze Einblendung da und landet gar
     nicht mehr im Verlauf — aber die alten Zeilen liegen noch in den
     Geraeten, und die nimmt man nur wieder los, wenn man sie beim
     Laden herauswirft. Genau das passiert hier, und weil der
     gesaeuberte Verlauf gleich darauf wieder gesichert wird, sind sie
     danach endgueltig weg.

     Es geht ausschliesslich um SYSTEMZEILEN, also um das, was das
     Programm selbst gesagt hat — kein Wort von einem Menschen wird
     angefasst. */
  var ALTER_MUELL = [
    /du bist (hier|jetzt) häuptling/i,
    /der raum war leer\s*[—-]\s*du bist hier häuptling/i
  ];
  function muellZeile(n) {
    if (!n) return false;
    if (n.art !== "system" && n.art !== "kommen") return false;
    if (n.von) return false;                       // von einem Menschen: nie
    var t = String(n.text || "");
    return ALTER_MUELL.some(function (r) { return r.test(t); });
  }
  function altenMuellFiltern(liste) {
    return (liste || []).filter(function (n) { return !muellZeile(n); });
  }

  function verschmelzen(a, b) {
    var alles = altenMuellFiltern((a || []).concat(b || []));
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
    /* DIE OBERGRENZE DARF KEINE AUFNAHME FRESSEN.
       GEMELDET: „Ich kann meine Sprachnachrichten nicht mehr sehen,
       das ist, wie als wenn die ausgeloescht sind."
       Eine Sprachnachricht steht NUR hier im Verlauf — sie wird
       bewusst nicht in die Tabelle geschrieben (sie ist fluechtig
       und gross). Faellt sie aus der Liste, ist sie endgueltig weg,
       waehrend eine Textzeile jederzeit wieder vom Server kommt.
       Deshalb: was wegen der Obergrenze herausfallen wuerde, aber
       eine Aufnahme traegt, bleibt trotzdem stehen. */
    if (raus.length <= CHAT_HALTEN) return raus;
    var behalten = raus.slice(-CHAT_HALTEN);
    var gerettet = raus.slice(0, raus.length - CHAT_HALTEN).filter(function (n) {
      return Boolean(n && (n.sprach || n.sprachImLager));
    });
    return gerettet.concat(behalten);
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
      return Array.isArray(l) ? altenMuellFiltern(l).slice(-CHAT_HALTEN) : [];
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
  /* Den vollstaendigen Verlauf aus dem Lager holen — dort liegt er
     ganz, waehrend im localStorage nur die letzten dreihundert
     Zeilen Platz haben. */
  /* Steht der volle Verlauf schon im Arbeitsspeicher? Vorher darf
     nichts ins Lager zurueckgeschrieben werden (siehe chatSichern). */
  var lagerGelesen = false;
  function chatAusLager(raum) {
    return lagerHolen(["chat:" + raum]).then(function (gefunden) {
      lagerGelesen = true;
      var roh = gefunden && gefunden["chat:" + raum];
      if (!roh) return [];
      try {
        var liste = JSON.parse(roh);
        return Array.isArray(liste) ? altenMuellFiltern(liste) : [];
      } catch (e) { return []; }
    }, function () { lagerGelesen = true; return []; });
  }

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
    /* DER GANZE VERLAUF GEHOERT INS LAGER, NICHT IN DEN localStorage.
       -------------------------------------------------------------
       GEMELDET: „Man kann immer noch nicht nach ganz oben scrollen",
       und: „bei einigen Sprachnachrichten steht nichts mehr da."

       Beides hat dieselbe Ursache. Der localStorage eines Browsers
       fasst wenige Megabyte, und in ihm liegt nicht nur der Chat.
       Passte der Verlauf nicht mehr hinein, wurde er halbiert — und
       damit fielen die aeltesten Zeilen weg, mitsamt dem Hinweis,
       WO die dazugehoerige Aufnahme liegt. Die Aufnahme selbst lag
       noch im Lager, aber niemand wusste mehr von ihr. Genau das
       sieht man als „da steht nichts mehr".

       Das Lager (IndexedDB) hat dagegen sehr viel Platz — dort
       liegen ohnehin schon die Bilder und die Aufnahmen. Also kommt
       der VOLLSTAENDIGE Verlauf jetzt auch dorthin. Der localStorage
       behaelt nur die letzten dreihundert Zeilen, damit beim Oeffnen
       sofort etwas dasteht; alles Aeltere kommt einen Wimpernschlag
       spaeter aus dem Lager nach. */
    /* HIER WURDE DER VERLAUF JUENGER GEMACHT, ALS ER WAR.
       -------------------------------------------------------------
       GEMELDET: „Der letzte Stand, den wir hatten, wurde schon wieder
       mit einem aelteren Stand ueberschrieben."

       Genau das ist hier passiert, und zwar zuverlaessig: beim
       Betreten steht zuerst nur, was in den localStorage gepasst hat
       (die letzten dreihundert Zeilen). Der VOLLSTAENDIGE Verlauf
       kommt einen Wimpernschlag spaeter aus dem Lager. Kam in diesem
       Wimpernschlag auch nur eine einzige Zeile herein, wurde
       gesichert — und die kurze Liste hat die lange im Lager
       ueberschrieben. Alles, was aelter war als diese dreihundert
       Zeilen, war damit endgueltig weg.

       Also: ins Lager wird erst geschrieben, wenn das Lager auch
       gelesen wurde. Bis dahin bleibt der localStorage der
       Zwischenspeicher — der ist klein, aber er zerstoert nichts. */
    if (lagerGelesen) {
      try { lagerLegen("chat:" + raum, raum, JSON.stringify(schlank)); } catch (e) {}
    }
    var versuch = schlank.slice(-300);
    for (var runde = 0; runde < 8; runde++) {
      try {
        localStorage.setItem(chatSchluessel(raum), JSON.stringify(versuch));
        return;
      } catch (e) {
        if (versuch.length <= 20) return;
        versuch = versuch.slice(-Math.ceil(versuch.length / 2));
      }
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
      var u = v.urls;
      if (Array.isArray(u)) return u.some(function (e) { return String(e).indexOf("turn") === 0; });
      return String(u || "").indexOf("turn") === 0;
    }).length;
    var woher = relaisStand.quelle === "cloudflare" ? " (eigenes Relais, Cloudflare)"
      : (window.DMA_TURN && window.DMA_TURN.length) ? " (eigene, fest eingetragen)"
      : " (oeffentliche)";
    zeilen.push("Relais eingetragen: " + relais + woher
      + (relaisStand.grund ? " — Grund: " + relaisStand.grund : ""));
    /* WOHER DIE ZUGANGSDATEN KOMMEN — und ob dieser Besuch einen
       Abruf gekostet hat. Genau daran haengt die Tagesgrenze:
       „Dieses Konto hat heute schon 60-mal Zugangsdaten geholt."
       Seit sie zwei Stunden im Geraet liegen, kostet ein Neuladen
       keinen Abruf mehr. */
    if (relaisStand.geholt) {
      var lage_ = relaisLage();
      zeilen.push("Zugangsdaten: " + (lage_.ausGeraet
        ? "aus dem Geraet — dieser Besuch hat KEINEN Abruf gekostet"
        : "frisch geholt")
        + ", gelten noch " + lage_.giltNochMinuten + " Minuten.");
    }
    /* WER SITZT AUF WELCHEM RELAIS? Das ist die Frage, an der es
       gehangen hat: einer hatte das eigene, die andere nur die
       oeffentlichen — und ueber ein symmetrisches NAT kommt darueber
       nichts an. Deshalb steht es jetzt fuer ALLE hier, nicht nur
       fuer einen selbst. */
    var fremd = Object.keys(praesenzDa).filter(function (id) {
      var p = praesenzDa[id] || {};
      return p.raum === zustand.raum;
    }).map(function (id) {
      var p = praesenzDa[id] || {};
      return "  " + (p.name || "jemand") + ": "
        + (p.relais === "cloudflare" ? "eigenes Relais ✔"
           : p.relais ? "nur die oeffentlichen ⚠" : "sagt nichts (alte Fassung)");
    });
    if (fremd.length) {
      zeilen.push("Wer sitzt auf welchem Relais:");
      zeilen.push(fremd.join("\n"));
    }
    if (relaisStand.quelle !== "cloudflare") {
      var g = gastBefund();
      zeilen.push("   " + relaisGrundKlartext());
      zeilen.push(g
        ? "⚠ Kein eigenes Relais auf DIESEM Geraet. Die Gastsitzung kam nicht zustande: " + g
          + "\n   → In Supabase unter Authentication → Sign In/Providers „Anonymous sign-ins“ einschalten."
        : "⚠ Kein eigenes Relais auf diesem Geraet — es laufen nur die oeffentlichen.");
    }
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
      /* =========================================================
         HIER ENTSTAND DAS DOPPELTE HOEREN
         ---------------------------------------------------------
         GEMELDET: „Dann wurde mir oft gemeldet, dass nach einiger
         Zeit die Leute sich irgendwie doppelt gehoert haben."

         NACHGESEHEN, und die Stelle ist genau diese: geprueft wurde
         nur, ob GENAU DIESE Spur (dieselbe id) schon im Strom liegt.
         Kommt aber nach einem Netzwechsel, einem restartIce oder
         einer neuen Aushandlung dieselbe Stimme als NEUE Spur
         herein — neue id, gleicher Mensch —, war die Antwort „die
         kenne ich noch nicht", und sie wurde ZUSAETZLICH angehaengt.
         Die alte Spur war oft noch nicht beendet (readyState
         „live"), also liefen beide, minimal versetzt. Das ist genau
         das Doppelhoeren, und es passt auch dazu, dass es „nach
         einiger Zeit" kommt: beim Betreten gibt es nur eine Spur,
         die zweite entsteht erst beim ersten Wackler der Leitung.

         Richtig ist: EIN Mensch hat EINE Tonspur und EINE Bildspur.
         Kommt eine neue herein, ersetzt sie die alte — die alte wird
         herausgenommen und angehalten. */
      try {
        p.strom.getTracks().forEach(function (t) {
          if (t.kind !== e.track.kind || t.id === e.track.id) return;
          try { p.strom.removeTrack(t); } catch (x) {}
          try { t.stop(); } catch (x) {}
        });
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
  /* =================================================================
     DIE LIEDER AUS DEM MUSIKORDNER
     -----------------------------------------------------------------
     GEWUENSCHT: „Vielleicht kannst du das noch machen, dass ich, wenn
     nichts los ist im Chat, fuer alle ein Lied abspielen kann aus der
     Playlist" — und „dass ich ein Lied aussuchen kann und den Leuten
     dann dieses Lied auf die Ohren setzen kann aus dem Musikordner."

     Es sind SEINE eigenen Stuecke; sie liegen als Dateien im Ordner
     „music". Die Liste steht hier, weil hier der Befehl gelesen wird;
     abgespielt wird in app.js (lcMusikSpielen). Der Dateiname geht
     ueber den Kanal, nicht der Ton — jedes Geraet holt sich die Datei
     selbst, sonst waere es ein Rundfunk und keine Webseite.

     Kommt eine neue Datei in den Ordner, gehoert sie hier dazu. */
  var LIEDER = [
    { datei: "Du.mp3", titel: "Du" },
    { datei: "Nah (2011).mp3", titel: "Nah (2011)" },
    { datei: "Nur Mit Mir (Demo 1)-3.mp3", titel: "Nur mit mir (Demo)" },
    { datei: "One Day In Rome - A Lovers Fairytale.mp3",
      titel: "One Day In Rome — A Lovers Fairytale" },
    { datei: "One Day In Rome - Ein Leben Lang.mp3",
      titel: "One Day In Rome — Ein Leben lang" },
    { datei: "promised-eden_mein-stiller-schmerz.mp3",
      titel: "Promised Eden — Mein stiller Schmerz" }
  ];
  /* Eine Nummer, ein Stueck vom Titel oder ein Stueck vom Dateinamen —
     alles drei findet dasselbe Lied. */
  function liedFinden(text) {
    var t = String(text || "").trim().toLowerCase();
    if (!t) return null;
    if (/^\d+$/.test(t)) return LIEDER[parseInt(t, 10) - 1] || null;
    for (var i = 0; i < LIEDER.length; i++) {
      var l = LIEDER[i];
      if (l.titel.toLowerCase().indexOf(t) >= 0) return l;
      if (l.datei.toLowerCase().indexOf(t) >= 0) return l;
    }
    return null;
  }
  function liederListe() {
    return LIEDER.map(function (l, i) {
      return "  /musik " + (i + 1) + "   " + l.titel;
    }).join("\n");
  }

  var tonJe = {};
  /* =========================================================
     MAN HOERT SICH NIE SELBER
     ---------------------------------------------------------
     GEWUENSCHT, woertlich: „Ich weiss ja nicht, wann die doppelte
     Stimme kommt … dass man sich selber hoert von seiner Stimme,
     dann kannst du das ja auch unterbinden … dass ich mich selber
     niemals hoeren kann. Vielleicht kannst du das in diesen
     Tonschalter mit einbauen."

     Die eigene Kennung ist fest (eigeneId speichert sie im Geraet
     oder leitet sie aus dem Konto ab). Ein zweites Fenster desselben
     Menschen traegt deshalb DIESELBE Kennung — genau das ist die
     „Chat-Leiche", die man als Echo seiner eigenen Stimme hoert.
     Hier wird sie nicht angeschlossen, egal auf welchem Weg sie
     hereinkommt, und ein Element, das schon an ihr haengt, wird
     abgeklemmt. Ein Rueckgabewert sagt dem Panik-Knopf, ob er etwas
     gefunden hat — sonst drueckt man und weiss nichts. */
  function tonSelbstSperren(id) {
    if (!id || !zustand || id !== zustand.ichId) return false;
    var a = tonJe[id];
    if (a) {
      try { a.pause(); } catch (e) {}
      try { a.srcObject = null; } catch (e) {}
      try { a.remove(); } catch (e) {}
      delete tonJe[id];
    }
    return true;
  }
  function tonAnschliessen(id, strom) {
    if (tonSelbstSperren(id)) return;
    if (!strom || typeof document === "undefined") return;
    /* Die Wache beginnt dort, wo es etwas zu bewachen gibt — beim
       ersten Ton. Sie beim Betreten zu starten genuegt nicht: wer
       den Raum ueber einen anderen Weg betritt (oder die Sonde, die
       den Zustand direkt setzt), haette sonst keine. Zweimal
       starten schadet nicht, tonWacheStarten steigt selbst aus. */
    tonWacheStarten();
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
  /* =================================================================
     DIE TONWACHE UND DER PANIK-KNOPF
     -----------------------------------------------------------------
     GEWUENSCHT, woertlich: „Entweder du fixt es fuer die Zukunft
     generell, dass so etwas nie wieder passieren kann, dass sich das
     in dem Moment, wo so etwas passieren will, von selbst loest —
     oder du gibst den Leuten eine Art Panic-Button, wo sie ihr Audio
     selber fixen koennen in dem Moment, wenn es anfaengt zu doppeln
     … so wie im Musikprogramm, wenn das MIDI sich ueberlagert, eine
     Art Panic-Button, wo sich das zuruecksetzt."

     Beides ist jetzt da, und beides macht dasselbe — nur einmal von
     allein und einmal auf Knopfdruck.

     WAS SCHIEFGEHEN KANN, und wogegen hier gewacht wird:
       1. Zwei Tonspuren fuer EINEN Menschen (die Hauptursache, siehe
          pc.ontrack). Die Wache behaelt die neueste und haelt die
          anderen an.
       2. Zwei <audio>-Elemente, die denselben Strom spielen — das
          kann passieren, wenn jemand den Raum verlaesst und unter
          neuer Kennung wiederkommt, waehrend das alte Element noch
          haengt. Die Wache raeumt Elemente weg, zu denen es keinen
          Menschen mehr gibt.
       3. Ein Element, das eine Spur spielt, die es im Strom gar nicht
          mehr gibt. Auch das wird abgeklemmt.

     Die Wache laeuft alle vier Sekunden und tut NICHTS, solange
     nichts zu tun ist — sie zaehlt nur. Erst wenn sie etwas findet,
     greift sie ein. So merkt man im Normalfall gar nicht, dass es
     sie gibt.
     ================================================================= */
  /* Welche Zeile eines Lesetextes gerade dran ist. Der Schluessel
     ist die Kennung der Chatzeile, in der der Text steht. */
  var leseStelle = {};

  var tonWacheTakt = 0;
  var tonWacheZaehler = { geheilt: 0, letzte: "" };

  /* Behaelt je Mensch genau EINE lebende Tonspur und EINE Bildspur.
     Gibt zurueck, wie viele Spuren angehalten werden mussten. */
  function tonSpurenAufraeumen() {
    var weg = 0;
    Object.keys(zustand.leute || {}).forEach(function (id) {
      var p = zustand.leute[id];
      if (!p || !p.strom || !p.strom.getTracks) return;
      if (id === zustand.ichId) { if (tonJe[id]) { tonSelbstSperren(id); weg++; } return; }
      ["audio", "video"].forEach(function (art) {
        var spuren = p.strom.getTracks().filter(function (t) { return t.kind === art; });
        /* Beendete Spuren sind ohnehin Ballast. */
        spuren.forEach(function (t) {
          if (t.readyState === "ended") {
            try { p.strom.removeTrack(t); } catch (e) {}
            weg++;
          }
        });
        spuren = p.strom.getTracks().filter(function (t) { return t.kind === art; });
        /* Bleiben mehrere, gewinnt die ZULETZT hinzugekommene — sie
           ist die aus der juengsten Aushandlung. */
        while (spuren.length > 1) {
          var alt = spuren.shift();
          try { p.strom.removeTrack(alt); } catch (e) {}
          try { alt.stop(); } catch (e) {}
          weg++;
        }
      });
    });
    return weg;
  }

  /* Raeumt Ton-Elemente weg, die zu niemandem mehr gehoeren, und
     haengt die uebrigen an den richtigen Strom. */
  function tonElementeAufraeumen() {
    var weg = 0;
    Object.keys(tonJe).forEach(function (id) {
      var a = tonJe[id];
      var p = zustand.leute[id];
      if (!a) { delete tonJe[id]; return; }
      /* Die eigene Stimme faellt hier genauso heraus wie ein Element,
         zu dem niemand mehr gehoert. */
      if (id === zustand.ichId) { tonSelbstSperren(id); weg++; return; }
      if (!p || !p.strom) {
        try { a.pause(); } catch (e) {}
        try { a.srcObject = null; } catch (e) {}
        try { a.remove(); } catch (e) {}
        delete tonJe[id];
        weg++;
        return;
      }
      if (a.srcObject !== p.strom) {
        try { a.srcObject = p.strom; } catch (e) {}
        tonAbspielenVersuchen(a);
        weg++;
      }
    });
    return weg;
  }

  /* DER PANIK-KNOPF. Er setzt den ganzen Tonweg zurueck, ohne die
     Verbindungen abzureissen: jedes Element wird abgeklemmt, die
     Stroeme werden auf eine Spur je Art zurueckgestutzt, der
     AudioContext geweckt, und dann wird alles neu angehaengt.
     Danach hoert man jeden genau einmal. */
  /* DER KNOPF MUSS AUCH WIRKLICH ETWAS TUN.
     -----------------------------------------------------------------
     GEMELDET: „dieser Tonknopf bringt nix. Er hat keine Funktion, wenn
     man das drueckt — die Doppelung auch nicht weg, das resettet sich
     auch nicht. Dann soll an der Stelle das so aktualisieren, dass man
     im Klassenzimmer bleibt, ohne dass man alles noch mal neu laden
     muss."

     Richtig: bis jetzt hat der Knopf nur die Tonelemente umgehaengt.
     Sass die Doppelung in der LEITUNG (zwei Spuren in einer
     Verbindung, eine haengende Bruecke), blieb sie. Jetzt reisst er
     jede Bruecke ab und baut sie neu auf — ohne den Raum zu
     verlassen, ohne Neuladen. Wer die kleinere Kennung hat, ruft an;
     die Wache tut den Rest innerhalb weniger Sekunden. */
  function verbindungenNeu() {
    var wieviele = 0;
    Object.keys(brueckeJe).forEach(function (id) {
      brueckeAbbauen(id);
      wieviele++;
    });
    /* Die Stroeme der anderen sind damit tot — weg damit, sonst
       zeigt der Platz ein eingefrorenes Bild. */
    Object.keys(zustand.leute || {}).forEach(function (id) {
      var p = zustand.leute[id];
      if (p) p.strom = null;
    });
    versuchJe = {};
    melden();
    /* Und sofort wieder anrufen, nicht erst beim naechsten Takt. */
    Object.keys(zustand.leute || {}).forEach(function (id) {
      if (id === zustand.ichId) return;
      if (zustand.ichId >= id) return;      /* die kleinere Kennung ruft an */
      try { anrufen(id); } catch (e) {}
    });
    return wieviele;
  }

  function tonNeuAufbauen() {
    /* ERST ZAEHLEN, DANN ABREISSEN.
       verbindungenNeu() nimmt allen ihren Strom weg — wer danach
       zaehlt, zaehlt Nullen. Deshalb wird hier zuerst nachgesehen,
       was da ist (und ob ein eigenes Echo dabei war), und erst dann
       neu aufgebaut. */
    var doppelt = tonSpurenAufraeumen();
    var selbst = 0, wieder = 0;
    Object.keys(zustand.leute || {}).forEach(function (id) {
      var p = zustand.leute[id];
      if (!p) return;
      if (id === zustand.ichId) {
        /* „Dass ich mich selber niemals hoeren kann" — auch nicht
           nach dem Zuruecksetzen. */
        if (p.strom || tonJe[id]) { tonSelbstSperren(id); selbst++; }
        return;
      }
      if (p.strom) wieder++;
    });
    var neuAufgebaut = verbindungenNeu();
    /* Alle Elemente wirklich leeren — nicht nur umhaengen. Ein
       Element, das noch einen alten Strom haelt, spielt sonst
       weiter, auch wenn niemand mehr hinsieht. */
    Object.keys(tonJe).forEach(function (id) {
      var a = tonJe[id];
      if (!a) return;
      try { a.pause(); } catch (e) {}
      try { a.srcObject = null; } catch (e) {}
    });
    /* Auch der Vorrat wird geleert — dort kann eine Sprachnachricht
       haengengeblieben sein. */
    tonVorrat.forEach(function (a) {
      try {
        if (a.dataset && a.dataset.belegt) { a.pause(); a.src = ""; delete a.dataset.belegt; }
      } catch (e) {}
    });
    try {
      if (tonKontext && tonKontext.state === "suspended" && tonKontext.resume) tonKontext.resume();
    } catch (e) {}
    /* Und was noch einen Strom hat, gleich wieder anschliessen —
       die frisch aufgebauten Leitungen melden sich von selbst. */
    Object.keys(zustand.leute || {}).forEach(function (id) {
      var p = zustand.leute[id];
      if (!p || !p.strom) return;
      if (id === zustand.ichId) { tonSelbstSperren(id); return; }
      tonAnschliessen(id, p.strom);
    });
    tonElementeAufraeumen();
    tonWacheZaehler.geheilt += doppelt;
    return { doppelt: doppelt, wieder: wieder, selbst: selbst,
             leitungen: neuAufgebaut };
  }

  function tonWacheStarten() {
    if (tonWacheTakt) return;
    tonWacheTakt = setInterval(function () {
      if (zustand.lage !== "drin") return;
      var doppelt = tonSpurenAufraeumen();
      var schief = tonElementeAufraeumen();
      if (doppelt || schief) {
        tonWacheZaehler.geheilt += doppelt + schief;
        tonWacheZaehler.letzte = new Date().toISOString();
        /* Es wird NICHT in den Chat geschrieben. Der Sinn der Wache
           ist, dass niemand etwas merkt; gemeldet wird es nur in der
           Konsole und in /befund, damit man es nachlesen kann. */
        try {
          console.info("[Klassenzimmer] Tonwache: " + doppelt + " doppelte Spur(en), "
            + schief + " Element(e) neu angehaengt.");
        } catch (e) {}
      }
    }, 4000);
  }
  function tonWacheStoppen() {
    if (tonWacheTakt) { clearInterval(tonWacheTakt); tonWacheTakt = 0; }
  }

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
  /* „ab" springt ueber den Vorlauf hinweg (siehe FREI_LUFT). Der
     Sprung geht erst, wenn der Browser weiss, wie lang die Aufnahme
     ist — deshalb wird auf loadedmetadata gewartet und nicht blind
     gesetzt. Blind gesetzt wird currentTime naemlich still verworfen,
     und dann hoert man doch wieder die Stille vorne. */
  function tonAusVorrat(quelle, beiEnde, ab, dauer) {
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
    var fertigSchon = false;
    var aufraeumen = function () {
      if (fertigSchon) return;
      fertigSchon = true;
      frei.onended = null; frei.onerror = null; frei.ontimeupdate = null;
      frei.dataset.belegt = "";
      try { frei.removeAttribute("src"); frei.load(); } catch (e) {}
      if (neu && frei.parentNode) frei.parentNode.removeChild(frei);
      if (typeof beiEnde === "function") beiEnde();
    };
    frei.onended = aufraeumen;
    frei.onerror = aufraeumen;
    var los = function () {
      if (ab > 0) {
        try {
          var ziel = Math.min(ab, Math.max(0, (frei.duration || 0) - 0.3));
          if (ziel > 0) frei.currentTime = ziel;
        } catch (e) {}
      }
      /* Hinten kappen: bei einer Wortmeldung stehen zwei Sekunden
         Pause am Ende, die niemand hoeren will. */
      if (dauer > 0) {
        var ende = (ab > 0 ? ab : 0) + dauer;
        frei.ontimeupdate = function () {
          if (frei.currentTime >= ende) { frei.ontimeupdate = null; try { frei.pause(); } catch (e) {} aufraeumen(); }
        };
      }
      tonAbspielenVersuchen(frei, aufraeumen);
    };
    if (ab > 0 && !(frei.readyState >= 1)) {
      frei.onloadedmetadata = function () { frei.onloadedmetadata = null; los(); };
      /* Kommt kein loadedmetadata (kaputte Aufnahme), trotzdem
         losspielen statt stumm dazustehen. */
      setTimeout(function () { if (frei.onloadedmetadata) { frei.onloadedmetadata = null; los(); } }, 900);
    } else { los(); }
    return true;
  }

  /* WENN DER BROWSER DEN TON NICHT DURCHLAESST.
     -----------------------------------------------------------
     GEFRAGT: „Bist du sicher, dass Emmy mich hoeren kann mit der
     Pseudovariante?" — Nein, war ich nicht, und beim Nachsehen fand
     sich genau hier der Grund.

     Ein Browser spielt Ton erst ab, wenn die Person die Seite
     einmal beruehrt hat. Wird play() abgelehnt, wurde die Aufnahme
     bisher in die Warteschlange gelegt und auf eine Beruehrung
     gewartet — so weit richtig. Nur: „aufraeumen" lief dabei NIE.
     Und aufraeumen ist es, was der Oberflaeche sagt „fertig, der
     naechste bitte".

     Die Folge war schlimmer als ein verpasster Satz:
       - die Warteschlange stand still, ALLE weiteren Wortmeldungen
         blieben liegen;
       - liveLaeuftGerade blieb auf dem blockierten Sprecher stehen,
         und damit sagte darfSprechen() dauerhaft „nein" — im
         Fokus-Modus konnte die Person also auch selbst nichts mehr
         aufnehmen.
     Beides ohne eine einzige Fehlermeldung.

     Jetzt gilt: gewartet wird weiter auf die Beruehrung, aber
     hoechstens acht Sekunden. Kommt bis dahin keine, wird die
     Aufnahme freigegeben und die Reihe laeuft weiter. Lieber ein
     Satz verpasst als ein Raum, in dem nichts mehr geht. */
  function tonAbspielenVersuchen(a, beiFehlstart) {
    var v;
    try { v = a.play(); } catch (e) { v = null; }
    if (v && v.catch) {
      v.catch(function () {
        if (tonWartet.indexOf(a) < 0) tonWartet.push(a);
        tonNachholenAnmelden();
        if (typeof beiFehlstart === "function") {
          var los = false;
          var merk = a.onplaying;
          a.onplaying = function () {
            los = true;
            a.onplaying = merk;
            if (typeof merk === "function") merk.apply(this, arguments);
          };
          setTimeout(function () {
            if (los) return;
            var i = tonWartet.indexOf(a);
            if (i >= 0) tonWartet.splice(i, 1);
            beiFehlstart();
          }, 8000);
        }
        if (!tonHinweisGezeigt) {
          tonHinweisGezeigt = true;
          systemZeile("\ud83d\udd07 Dein Browser l\u00e4sst den Ton noch nicht durch \u2014 tipp einmal irgendwo auf die Seite, "
            + "dann h\u00f6rst du die anderen. (Das passiert nur beim ersten Mal.)");
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

  var pruefSenderHaken = null;
  /* =========================================================
     WAS NICHT HINAUSGEHT, WARTET — STATT VERLORENZUGEHEN
     ---------------------------------------------------------
     GEMELDET: „Wenn Emmy die alte Aufgabe aus dem Verlauf noch mal
     loest, kommt sie nicht an, sie schickt nicht ab. Ich weiss nicht,
     woran das liegt."

     Eine Erklaerung dafuer stand hier, in einer einzigen Zeile:
         if (!kanal) return;
     Steht die Leitung gerade nicht — das Telefon war kurz im Schlaf,
     das Netz hat gewechselt, der Kanal wird gerade neu aufgebaut —,
     dann war die Zeile weg. Beim Absender stand sie im Chat (sie
     entsteht dort lokal), bei allen anderen kam sie nie an. Genau so
     sieht das aus: „sie schickt nicht ab."

     Jetzt wartet sie. Was den Chat betrifft (Text, Aufgaben,
     Ansagen), wird aufgehoben und geht hinaus, sobald der Raum wieder
     steht. Pulsschlaege und Anwesenheitsmeldungen nicht — die sind im
     naechsten Augenblick ohnehin ueberholt. */
  var wartendePakete = [];
  var WARTEND_MAX = 60;
  function wartetAufLeitung(nutzlast) {
    return nutzlast && nutzlast.art === "text";
  }
  function paketeNachschicken() {
    if (!kanal || !wartendePakete.length) return 0;
    var liste = wartendePakete.slice();
    wartendePakete = [];
    var raus = 0;
    liste.forEach(function (p) {
      try { kanal.send({ type: "broadcast", event: "raum", payload: p }); raus += 1; } catch (e) {}
    });
    if (raus) {
      systemZeile("\ud83d\udce4 " + (raus === 1 ? "Deine Zeile ist" : raus + " Zeilen sind")
        + " jetzt rausgegangen \u2014 die Verbindung war kurz weg.");
    }
    return raus;
  }
  function senden(nutzlast) {
    nutzlast.von = zustand.ichId;
    /* Zum Nachmessen: die Pakete abfangen, ohne dass ein Raum offen
       sein muss. Im Betrieb ist der Haken immer null. */
    if (pruefSenderHaken) { try { pruefSenderHaken(nutzlast); } catch (e) {} }
    if (!kanal) {
      if (wartetAufLeitung(nutzlast)) {
        wartendePakete.push(nutzlast);
        if (wartendePakete.length > WARTEND_MAX) wartendePakete.shift();
      }
      return;
    }
    try { kanal.send({ type: "broadcast", event: "raum", payload: nutzlast }); }
    catch (e) {
      if (wartetAufLeitung(nutzlast)) wartendePakete.push(nutzlast);
    }
  }

  function empfangen(n) {
    if (!n || n.von === zustand.ichId) return;             // die eigene Post nicht lesen
    if (n.an && n.an !== zustand.ichId) return;            // nicht für uns

    /* Jedes Lebenszeichen zählt — auch eine Kerze oder ein Satz im
       Chat sagt: der ist noch da. */
    if (zustand.leute[n.von]) zustand.leute[n.von].gesehen = Date.now();
    /* UND JEDES SAGT AUCH, WIE DIESER MENSCH BEIM SPRECHEN AUSSIEHT.
       Die Wahl faehrt in der Chatzeile, im Puls und in der Begruessung
       mit. Sie hier EINMAL zu lesen ist die einzige Fassung, die nicht
       wieder auseinanderlaeuft: jede Abzweigung weiter unten haette
       ihre eigene Zeile gebraucht, und genau eine davon (der Puls)
       war vergessen. Ein Paket, das nichts dazu sagt, aendert nichts. */
    if (zustand.leute[n.von] && typeof n.sprechbild === "string" && n.sprechbild) {
      zustand.leute[n.von].sprechbild = n.sprechbild;
    }
    /* Und jedes Paket sagt nebenbei, ob da eine Frau oder ein Mann
       sitzt — das Zeichen aus dem Profil reist mit. */
    geschlechtMerken(n.von, n.geschlecht);
    kontoMerken(n.von, n.konto);
    uhrVergleichen(n);

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
                      geschlecht: zustand.geschlecht || "", konto: kontoId || "",
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
               bildAn: zustand.bildAn, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
               /* Damit ein Ankoemmling nicht sechs Sekunden lang bei
                  allen den gruenen Standardring sieht. */
               sprechbild: zustand.sprechbild || "",
               geschlecht: zustand.geschlecht || "", konto: kontoId || "",
               haeuptling: zustand.haeuptling, thema: zustand.thema,
               fokus: zustand.fokus,
               seit: zustand.seit, buehne: zustand.buehne,
               raumHg: zustand.raumHg || "",
               abgeschlossen: zustand.abgeschlossen });
      /* Und die offene Aufgabe gleich hinterher — wer hereinkommt,
         soll nicht erst warten, bis die naechste gestellt wird. Ohne
         Loesung, siehe aufgabeVerkuenden(). */
      aufgabeVerkuenden(n.von);
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
      letzteStimmeNachreichen(n.von);
      /* Und die Tafel, falls eine steht: „jede Aufgabe soll auf
         beiden Seiten ueberall sichtbar sein" gilt hier genauso.
         Nachreichen tut nur der, der sie aufgemacht hat — sonst
         schicken acht Geraete denselben Stand (DMA_TAFEL_STAND gibt
         bei allen anderen null zurueck). */
      setTimeout(function () {
        try {
          var stand = window.DMA_TAFEL_STAND && window.DMA_TAFEL_STAND();
          if (stand) postSenden(n.von, { art: "tafel", tafel: stand });
        } catch (e) {}
      }, 900);
      /* Wer die kleinere Kennung hat, ruft an. */
      if (zustand.ichId < n.von && belegt() <= PLAETZE) anrufen(n.von);
      melden();
      return;
    }
    /* DAS WHITEBOARD.
       GEWUENSCHT: „Ich moechte ein Whiteboard implementieren … man
       kann in das Whiteboard Bilder einladen zum Lernen … und dann
       kann ich an jeder Stelle im Bild eine Markierung zeichnen …
       oder ein Pointer, dass die Markierung dort blinkt."
       Striche, Bilder, Zeiger und Blick gehen als eigene kleine
       Nachricht — sie gehoeren nicht in den Chatverlauf, sie sind
       kein Gespraech. Gezeichnet wird in app.js. */
    /* Schiffe versenken: die Zuege gehen an alle, die Verstecke NICHT
       (die gehen als persoenliche Post an den Schiedsrichter). */
    if (n.art === "spiel") {
      schiffeEmpfangen(n.spiel || {}, n.von);
      return;
    }
    if (n.art === "tafel") {
      try { if (window.DMA_TAFEL) window.DMA_TAFEL(n.tafel || {}, n.von, n.name || ""); } catch (e) {}
      return;
    }
    if (n.art === "auch-da") {
      var neuHier = !zustand.leute[n.von];
      personMerken(n.von, n.name, n.bild);
      if (neuHier) kommtUndGeht(n.name || "Jemand", true);
      if (typeof n.haeuptling === "boolean") zustand.leute[n.von].haeuptling = n.haeuptling;
      /* Die Regel des Raums kommt von dem, der ihn fuehrt. */
      if (n.haeuptling && typeof n.fokus === "boolean") zustand.fokus = n.fokus;
      if (typeof n.thema === "string" && n.thema) {
        zustand.thema = n.thema;
        themaMerken(zustand.raum, zustand.thema);
      }
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
    /* Jemand hat eine Aufgabe gestellt — sie gilt ab jetzt auch hier.
       Ohne Loesung (siehe aufgabeVerkuenden): der Notenknopf braucht
       sie nicht, und niemand soll spicken koennen. */
    if (n.art === "aufgabeAn") {
      var neuerZeitpunkt = n.zeit || Date.now();
      if (offeneAufgabe && (offeneAufgabe.zeit || 0) >= neuerZeitpunkt) return;
      offeneAufgabe = {
        typ: String(n.typ || "frei"),
        loesung: "",
        frage: String(n.frage || "").slice(0, 300),
        zeileId: String(n.zeileId || ""),
        /* „teile" ist die LOESUNG in der richtigen Reihenfolge und
           bleibt hier leer — wer die Aufgabe bekommt, soll sie ja
           nicht mitgeliefert kriegen. „teileGemischt" ist das, was
           man antippt. */
        teile: [],
        teileGemischt: Array.isArray(n.teile)
          ? n.teile.map(function (t) { return String(t).slice(0, 40); }).slice(0, 24)
          : [],
        wer: {}, zeit: neuerZeitpunkt,
        /* Weitergezaehlt wird nur dort, wo die Aufgabe gestellt
           wurde — siehe dranSetzen. */
        vonMir: false, dran: String(n.dran || "")
      };
      aufgabeMerken();
      melden();
      return;
    }
    /* Die Runde ist weitergerueckt. */
    if (n.art === "dran") {
      if (!offeneAufgabe) return;
      offeneAufgabe.dran = String(n.name || "");
      aufgabeMerken();
      melden();
      return;
    }
    if (n.art === "aufgabeAus") {
      if (!offeneAufgabe) return;
      offeneAufgabe = null;
      aufgabeMerken();
      melden();
      return;
    }
    if (n.art === "tschuess") {
      if (zustand.leute[n.von]) {
        kommtUndGeht(zustand.leute[n.von].name || "Jemand", false,
                     n.wohinName || (n.wohin ? raumKlartext(n.wohin) : ""));
      }
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
      /* =====================================================
         EINEN VERLAUF NIMMT NUR AN, WER GERADE HEREINKOMMT
         -----------------------------------------------------
         GEMELDET: „In dem Moment, wenn ein anderer reinkommt,
         wird der Chat auf den Zustand gesetzt, den der andere aus
         seinem persoenlichen Chat mit mir kennt. Mein Chat soll
         sich gar nicht resetten dadurch, dass er reinkommt. Wenn
         ich da unten zuletzt lese, dass ich mich selbst
         geschlagen habe, und dann kommt der neue Gast, soll der
         Chat nicht ploetzlich leer werden."

         Genau so war es gebaut, und der Fehler sass eine Ebene
         hoeher als er aussah. Wer hereinkommt, meldet sich mit
         „da"; alle anderen schicken ihm ihren Verlauf. Nur gilt
         das in BEIDE Richtungen: meldet sich jemand neu an —
         auch nach einem Verbindungsabriss oder wenn das Telefon
         aus der Tasche kommt —, schickt er seinerseits seinen
         Verlauf an den, der schon da sitzt. Und der nahm ihn an,
         solange er selbst noch keinen bekommen hatte (wer einen
         leeren Raum betritt, bekommt nie einen). Damit legte sich
         der alte Stand des Ankoemmlings ueber den laufenden Chat.

         Einen fremden Verlauf anzunehmen ist nur EINMAL richtig:
         wenn man selbst gerade hereingekommen ist und danach
         gefragt hat. Genau das steht hier — verlaufAngefragt gilt
         nur die ersten Sekunden nach dem Betreten eines Raumes.
         Wer laenger drin sitzt, nimmt nichts mehr an; sein Chat
         bleibt, wie er ist. Der Ankoemmling bekommt seinen
         Verlauf weiterhin, nur eben er allein. */
      if (verlaufBekommen || !verlaufAngefragt) return;
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
      themaMerken(zustand.raum, zustand.thema);
      melden();
      return;
    }
    if (n.art === "rang") {
      if (n.an === zustand.ichId) {
        if (typeof n.haeuptling === "boolean") zustand.haeuptling = Boolean(n.haeuptling);
        if (typeof n.klassensprecher === "boolean") {
          zustand.klassensprecher = Boolean(n.klassensprecher);
          if (zustand.klassensprecher) {
            hinweisZeigen("🎓 Du bist jetzt Klassensprecher:in. Wenn der Lehrer geht, führst du weiter.",
              "klassensprecher");
          }
        }
        melden();
      } else if (zustand.leute[n.an]) {
        if (typeof n.haeuptling === "boolean") zustand.leute[n.an].haeuptling = Boolean(n.haeuptling);
        if (typeof n.klassensprecher === "boolean") {
          Object.keys(zustand.leute).forEach(function (id) {
            if (zustand.leute[id]) zustand.leute[id].klassensprecher = false;
          });
          zustand.leute[n.an].klassensprecher = Boolean(n.klassensprecher);
        }
        melden();
      }
      return;
    }
    if (n.art === "lesezeile") {
      /* Die Stelle merken (auch fuer den, der die Tafel erst spaeter
         zeichnet) und sofort anzeigen. */
      if (n.leseId && Number(n.nr) >= 0) {
        leseStelle[String(n.leseId)] = Number(n.nr);
        try { if (window.DMA_LESEZEILE) window.DMA_LESEZEILE(String(n.leseId), Number(n.nr)); }
        catch (e) {}
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
        if (typeof n.farbeName === "string") zustand.leute[n.von].farbeName = n.farbeName;
        if (typeof n.sprechbild === "string") zustand.leute[n.von].sprechbild = n.sprechbild;
        personEintragen(n);
        melden();
      }
      return;
    }
    /* SICH MELDEN. Das ist ein Rundruf an alle — jeder im Raum soll
       sehen, wer sich gemeldet hat und in welcher Reihenfolge.
       HIER LAG EIN FEHLER: erst stand das beim Postempfang, also
       dort, wo nur Nachrichten an EINE Person ankommen. Gemessen:
       drei Meldungen rein, null in der Liste. */
    /* Die Regel des Raums — nur vom Haeuptling oder Lehrer. Wer
       sie schickt, ohne sie schalten zu duerfen, wird ignoriert:
       geglaubt wird nicht dem Paket, sondern dem Rang. */
    /* Jemand ruft seine Sprachnachricht zurueck. Nur die EIGENE —
       die Kennung traegt den Absender, ein fremdes Zurueckrufen
       gibt es nicht. */
    if (n.art === "zurueck") {
      if (!n.id) return;
      sprachZurueckrufen(String(n.id));
      return;
    }
    if (n.art === "fokus") {
      /* Nur vom Betreiber. Ein Haeuptling ist noch kein Betreiber —
         Haeuptling wird man schon, indem man einen Raum als Erster
         betritt. Das Paket sagt es selbst; ein fremdes Geraet, das
         hier schwindelt, wuerde eine Regel setzen, die Geld kostet. */
      var chef = Boolean(n.betreiber) && zustand.leute[n.von];
      if (!chef) return;
      if (zustand.fokus === Boolean(n.fokus)) return;
      zustand.fokus = Boolean(n.fokus);
      systemZeile(zustand.fokus
        ? "🎧 Fokus-Modus an — solange jemand spricht, nimmt niemand sonst auf. Schreiben geht jederzeit."
        : "🗣️ Fokus-Modus aus — jetzt darf durcheinandergeredet werden.");
      melden();
      return;
    }
    if (n.art === "hand") { zustand.gemeldet[n.von] = n.zeit || Date.now(); melden(); return; }
    if (n.art === "handweg") { delete zustand.gemeldet[n.von]; melden(); return; }

    /* Ein Stueck einer langen Aufnahme. Erst wenn alle da sind,
       wird daraus eine Nachricht — vorher passiert nichts. */
    if (n.art === "sprachfehlt") {
      /* Jemand vermisst Stuecke von MIR — die gehen noch einmal raus,
         einzeln und mit Luft dazwischen. */
      if (sprachAusgang[n.id] && Array.isArray(n.nr)) {
        n.nr.slice(0, 40).forEach(function (nr, k) {
          setTimeout(function () { sprachEinzelnSchicken(n.id, nr); }, k * PAKET_LUFT);
        });
      }
      return;
    }
    if (n.art === "hoert") {
      /* Jemand spielt gerade MEINE Wortmeldung ab — oder ist damit
         fertig. Daraus wird der Balken oben gespeist. */
      if (n.los) hoerenGerade[n.von] = { name: n.name || "Jemand", id: n.id, seit: Date.now() };
      else delete hoerenGerade[n.von];
      liveSagen();
      melden();
      return;
    }
    if (n.art === "sprachda") {
      /* Jemand hat meine Wortmeldung vollstaendig bekommen. */
      sprachAngekommen(n.id, n.name || "Jemand");
      return;
    }
    if (n.art === "sprachteil") {
      var ganz = sprachTeilEmpfangen(n);
      if (!ganz) return;
      /* Dem Absender sagen, dass es angekommen ist — er wartet
         darauf. „Sie fragt mich staendig, ob ich sie hoere." */
      try { senden({ art: "sprachda", an: n.von, id: n.id, name: zustand.ichName }); } catch (e) {}
      n = { art: "text", id: n.id, von: n.von, name: n.name, text: "",
            zeit: n.zeit, bild: n.bild, farbe: n.farbe, farbeName: n.farbeName, chatArt: n.chatArt,
            sprach: ganz, sprachSek: n.sprachSek, sprachAb: n.sprachAb,
            sprachDauer: n.sprachDauer, geschlecht: n.geschlecht || geschlechtVon(n.von) };
    }
    if (n.art === "text") {
      /* Eine Sprachnachricht hat weder Text noch Bild — ohne diese
         Ausnahme wuerde sie hier stillschweigend weggeworfen. */
      if (!n.text && !n.bildImChat && !n.sprach) return;
      if (n.sprach && n.id) {
        try { senden({ art: "sprachda", an: n.von, id: n.id, name: zustand.ichName }); } catch (e) {}
      }
      /* Nachgereicht beim Hereinkommen — sagen, warum das jetzt
         kommt. Ohne Erklaerung haelt man es fuer eine neue Ansage. */
      /* Nachgereicht beim Hereinkommen: sie wird abgespielt, schreibt
         aber nichts in den Chat. „Die spammt den Chat voll — das soll
         alles nicht ankommen." Der gruene Balken sagt, von wem sie
         ist; mehr braucht es nicht. */
      /* Die nachgereichte Wortmeldung wird abgespielt und sonst
         nichts — wer sie hoert, sieht am gruenen Balken, von wem sie
         ist. Kein Text, keine Blase. */
      /* EINE WORTMELDUNG AUS DEM PSEUDO-LIVESTREAM.
         -------------------------------------------------------
         GEWUENSCHT: „Dass es gar nicht in den Chat eintraegt,
         sondern nur hoerbar wird … sonst ist der Chat voll mit
         Nachrichten und dann liest man nicht mehr, was die Leute
         schreiben." Sie geht also in die Warteschlange und wird
         der Reihe nach abgespielt. In den Chat kommt sie nur,
         wenn der Mitschrieb eingeschaltet ist. */
      /* GEMELDET: „Man hoert nicht mehr, was im Klassenzimmer gesagt
         wird … waehrend ich ausserhalb des Klassenzimmers bin."

         Da lag es: eine Sprachnachricht aus dem Melden (Knopf halten)
         wurde NUR als Chatzeile zugestellt, und gespielt hat sie erst
         das Zeichnen dieser Zeile. Wer den Reiter nicht offen hatte,
         hatte auch keine Zeile — und hoerte nichts. Die Warteschlange
         dagegen laeuft immer, ganz ohne Oberflaeche.

         Deshalb geht jetzt JEDE Sprachnachricht denselben Weg:
         hintereinander, in der Reihenfolge des Eintreffens, egal ob
         gehalten oder freihaendig. */
      if (n.sprach && (n.chatArt === "live" || n.chatArt === "sprach")) {
        var w = {
          id: n.id || String(Date.now()) + n.von,
          von: n.von, name: n.name || "Gast",
          bild: n.bild || "", farbe: n.farbe || "", farbeName: n.farbeName || "",
          sprach: n.sprach, sprachSek: Number(n.sprachSek) || 0,
          sprachAb: Number(n.sprachAb) || 0,
          sprachDauer: Number(n.sprachDauer) || 0,
          zeit: n.zeit || Date.now(), art: "live"
        };
        liveEinreihen(w);
        liveSagen();
        /* Im Chat steht sie nur, wenn man sie sehen WILL.
           „Diese Sprachnachrichten sollten nicht alle angezeigt
           werden — nur wenn man etwas braucht, soll man sich das
           sichtbar machen koennen, um sich die entsprechende
           Nachricht herunterladen zu koennen." Die Zeile traegt
           dann den Abspiel- und den Herunterladen-Knopf. */
        /* IMMER in den Verlauf — aber unsichtbar.
           GEMELDET: „Wenn ich wieder ins Leere klicke, schliesst sich
           die Anzeige nicht wieder … und es soll unabhaengig von dem
           Mitschreib-Befehl passieren."

           Da lag der eigentliche Fehler: die Zeile wurde gar nicht
           erst angehaengt, solange der Befehl aus war. Ein Tipp ins
           Leere blendete also etwas ein, was es nicht gab — und man
           sah nichts, weder beim Auf- noch beim Zuklappen. Jetzt
           steht jede Wortmeldung im Verlauf, und ob man sie SIEHT,
           entscheidet allein das Ein- und Ausblenden (CSS). */
        nachrichtAnhaengen(w);
        melden();
        return;
      }
      /* Ist das die Antwort auf eine Aufgabe, die ICH gestellt habe?
         Geprueft wird nur auf einfachen Text — ein Bild oder ein
         Aufkleber ist keine Antwort. */
      var versuch_ = null;
      if ((n.chatArt || "text") === "text" && n.text) {
        try { versuch_ = aufgabeVersuch(n.von, n.text); } catch (e) {}
        try { aufgabeAntwort(n.von, n.name || "Gast", n.text); } catch (e) {}
      }
      nachrichtAnhaengen(zusatzUebernehmen({
        /* Nur eine Antwort auf eine gestellte Aufgabe darf benotet
           werden — siehe aufgabeVersuch(). */
        versuch: Boolean(n.aufgabeId) || Boolean(versuch_ && versuch_.versuch),
        richtig: Boolean(versuch_ && versuch_.richtig),
        /* Bei einer Aufgabe in eigenen Worten gibt es kein „falsch" —
           die Zeile soll deshalb auch nicht so aussehen. */
        aufgabeFrei: Boolean(versuch_ && versuch_.frei),
        /* HAT DIE ANTWORT SELBST GESAGT, ZU WELCHER AUFGABE SIE
           GEHOERT? Dann ist nichts mehr zu raten — die Kennung reist
           mit der Nachricht und gilt auch morgen noch. */
        aufgabeId: String(n.aufgabeId || ""),
        aufgabeKlasse: String(n.aufgabeKlasse || ""),
        aufgabeFrage: String(n.aufgabeFrage || "") || (versuch_ && versuch_.frage) || "",
        id: n.id || String(Date.now()) + n.von,
        von: n.von, name: n.name || "Gast",
        text: String(n.text || "").slice(0, CHAT_LAENGE),
        zeit: n.zeit || Date.now(), eigen: false, bild: n.bild || "",
        art: n.chatArt || "text",
        /* ALLE Zusatzfelder kommen aus EINER Liste (ZUSATZ_FELDER,
           siehe anAlle). Frueher stand hier je Feld eine Zeile, und
           die zuletzt dazugekommene fehlte jedes Mal: so ging das
           Aufdecken bei den anderen nie auf. */
        farbe: n.farbe || (zustand.leute[n.von] && zustand.leute[n.von].farbe) || "",
        farbeName: n.farbeName || (zustand.leute[n.von] && zustand.leute[n.von].farbeName) || "",
        bildImChat: typeof n.bildImChat === "string" ? n.bildImChat.slice(0, 200000) : "",
        /* Die Sprachnachricht faehrt mit und wird beim Zeichnen SOFORT
           abgespielt (app.js). Sie wird nirgends gesichert. */
        sprach: typeof n.sprach === "string" ? n.sprach : "",
        sprachSek: Number(n.sprachSek) || 0,
        sprachAb: Number(n.sprachAb) || 0,
        sprachDauer: Number(n.sprachDauer) || 0
      }, n));
      melden();
      return;
    }
  }

  /* „XanderFox betritt den Raum" / „… hat den Raum verlassen".
     So war es im IRC (JOIN und PART sehen alle im Raum) und so war es
     in jedem Webchat der Zeit. */
  /* Mit „wohin" steht da, wohin jemand gegangen ist — das ist etwas
     anderes als Weggehen, und im Unterricht ein Unterschied: wer in
     einen anderen Raum wechselt, ist ja noch da. */
  function kommtUndGeht(name, kommt, wohin) {
    var ziel = String(wohin || "").trim();
    nachrichtAnhaengen({
      id: "kg" + Date.now() + "-" + (laufendeNummer += 1),
      von: "", name: name, art: "kommen",
      text: name + (kommt
        ? " betritt den Raum."
        : (ziel ? " ist in den Raum \u201e" + ziel + "\u201c gegangen."
                : " hat den Raum verlassen.")),
      zeit: Date.now(), eigen: false, kommt: Boolean(kommt),
      gegangenNach: ziel
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
        /* Auch hier: ALLE Zusatzfelder aus EINER Liste. Fehlte eines,
           sah ein Nachzuegler die Aufgabe nicht — „jede Aufgabe soll
           auf beiden Seiten ueberall sichtbar sein". */
        return zusatzUebernehmen({
          id: n.id, von: n.von, name: n.name, text: n.text, art: n.art || "text",
          bild: n.bild || "", bildImChat: n.bildImChat || "", farbe: n.farbe || "",
          zeit: n.zeit
        }, n);
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
    /* Das Sprechbild wird hier gelesen und nur hier — personEintragen
       laeuft bei jedem Paket, das etwas ueber eine Person sagt (da,
       auch-da, puls, zustand). Stuende es an vier Stellen einzeln,
       waere eine davon frueher oder spaeter vergessen; genau so war
       es bisher, und der Puls war die vergessene. */
    if (typeof n.sprechbild === "string" && n.sprechbild) p.sprechbild = n.sprechbild;
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
               /* Damit die anderen wissen, ob sie „sie" oder „er"
                  schreiben muessen, wenn dieser Mensch spricht. */
               geschlecht: zustand.geschlecht || "",
               /* Und wem das Konto gehoert: nur damit ein Fluestern in
                  der Tabelle eine Anschrift bekommt (siehe unten). */
               konto: kontoId || "",
               /* GEMELDET: „Wenn jemand anders einen Effekt in seinem
                  Sprechbild einstellt — zum Beispiel bei Emmi aus
                  Aegypten —, ich sehe ihren Effekt nicht. Sie sieht
                  ihn selber, aber ich seh ihn nicht."

                  Genau daran lag es: das Sprechbild reiste nur in der
                  Chatzeile und in der einen Meldung beim Umstellen mit.
                  Wer spaeter hereinkam oder das eine Paket verpasste,
                  sah bei allen anderen fuer immer den gruenen Ring.
                  Jetzt faehrt es im Puls mit — alle sechs Sekunden,
                  von jedem, an alle. Damit stimmt es spaetestens nach
                  einem Atemzug ueberall. */
               sprechbild: zustand.sprechbild || "",
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
                   bildAn: zustand.bildAn, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
                   seit: zustand.seit, buehne: zustand.buehne,
                   geschlecht: zustand.geschlecht || "", konto: kontoId || "" });
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
    /* Zuerst die Uhr geradeziehen — sonst sortiert sich die Zeile
       gleich an der falschen Stelle ein (siehe zeitAufMeineUhr). */
    try { zeitAufMeineUhr(n); } catch (e) {}
    /* WANN IST SIE BEI MIR ANGEKOMMEN? Das ist meine eigene Uhr, und
       die kann keine fremde Einstellung verschieben. Die Oberfläche
       entscheidet daran, ob eine Zeile „gerade eben" ist und ihre
       Animation spielen darf — nicht mehr an der Uhrzeit des
       Absenders. Genau daran ist es gescheitert: Ging seine Uhr nach,
       sah jede seiner Nachrichten aus wie Vergangenheit, und
       Vergangenheit bleibt still. */
    if (!n.angekommen) n.angekommen = Date.now();
    /* Dieselbe Nachricht kann zweimal ankommen (Neuladen, Puls).
       Sie hat eine Kennung — damit lässt sich das ausschliessen. */
    if (n.id && zustand.nachrichten.some(function (a) { return a.id === n.id; })) return;
    zustand.nachrichten.push(n);
    /* HIER wurde der Verlauf gekappt — und zwar auf das SERVER-Fenster,
       nicht auf das, was der Speicher haelt. Jede neue Zeile schnitt
       damit hinten etwas ab. Es ist dieselbe Grenze wie ueberall
       sonst: CHAT_HALTEN. */
    if (zustand.nachrichten.length > CHAT_HALTEN) {
      zustand.nachrichten = zustand.nachrichten.slice(-CHAT_HALTEN);
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
                          zu: Boolean(e.zu), relais: e.relais || "",
                          seit: e.seit || 0 };
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
                                      /* Auf welchem Relais dieses Geraet sitzt.
                                         Damit sieht man in /leitung, ob BEIDE
                                         Seiten das eigene haben — daran hing
                                         der Ausfall. */
                                      relais: relaisStand.quelle || "",
                                      seit: Date.now() });
      else praesenzKanal.untrack();
    } catch (e) {}
  }

  /* =========================================================
     BETRETEN UND VERLASSEN
     ========================================================= */
  /* =================================================================
     DER GEMEINSAME VERLAUF WIRD NACHGEHOLT — NOTFALLS MEHRMALS
     -----------------------------------------------------------------
     GEMELDET, schon wieder: „Ich bin ins Klassenzimmer zurueck und hab
     wieder einen alten Stand geladen bekommen, der nicht der aktuelle
     Chat ist."

     Der Grund ist unscheinbar und steht in angemeldeterZugang(): Ohne
     fertige Anmeldung gibt es keinen Zugang zur Tabelle — dann liefert
     serverLaden() eine LEERE Liste, ganz ohne Fehler. Genau das
     passiert regelmaessig beim Betreten direkt nach dem Laden der
     Seite: der Anmeldeschluessel wird in dem Moment erst wiederhergestellt.
     Es blieb dann bei dem, was im Geraet lag — also beim alten Stand.
     Sichtbar war davon nichts; es sah einfach nach einem stillen
     Klassenzimmer aus.

     Deshalb wird jetzt nicht mehr EINMAL geholt, sondern:
       * beim Betreten,
       * und danach noch drei Mal in groesser werdenden Abstaenden,
         SOLANGE noch nichts vom Server gekommen ist,
       * ausserdem immer dann, wenn die Seite wieder in den Vordergrund
         kommt (dort holt man sich nach, was waehrenddessen geschrieben
         wurde) — hoechstens alle 20 Sekunden.

     Kommt am Ende gar nichts, wird das EINMAL gesagt statt verschwiegen.
     Ein leerer Verlauf, den man fuer vollstaendig haelt, ist schlimmer
     als eine ehrliche Meldung.
     ================================================================= */
  var verlaufVomServer = false;
  var verlaufHolenZuletzt = 0;
  var verlaufVersuche = 0;
  var verlaufGeklagt = false;
  var verlaufUhren = [];

  function verlaufUhrenStoppen() {
    verlaufUhren.forEach(function (u) { clearTimeout(u); });
    verlaufUhren = [];
  }

  function verlaufFrischHolen(ersterAnlauf) {
    if (zustand.lage !== "drin" && zustand.lage !== "verbindet") return Promise.resolve(false);
    var raum = zustand.raum;
    verlaufHolenZuletzt = Date.now();
    if (ersterAnlauf) {
      verlaufVomServer = false;
      verlaufVersuche = 0;
      verlaufUhrenStoppen();
      /* Nachfassen, falls die Anmeldung noch nicht stand. Die Uhren
         laufen nur weiter, solange nichts angekommen ist — siehe
         unten. */
      [2500, 8000, 20000].forEach(function (ms) {
        verlaufUhren.push(setTimeout(function () {
          if (verlaufVomServer) return;
          if (zustand.raum !== raum) return;
          verlaufFrischHolen(false);
        }, ms));
      });
    }
    verlaufVersuche += 1;
    return serverLaden(raum).then(function (vomServer) {
      if (zustand.raum !== raum) return false;
      if (!vomServer.length) {
        if (!ersterAnlauf && verlaufVersuche >= 4 && !verlaufVomServer && !verlaufGeklagt
            && angemeldeterZugang()) {
          verlaufGeklagt = true;
          systemZeile("\u26a0\ufe0f Der gemeinsame Verlauf liess sich nicht laden \u2014 "
            + "du siehst gerade nur, was auf diesem Ger\u00e4t liegt.");
        }
        return false;
      }
      verlaufVomServer = true;
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
      return true;
    }, function () { return false; });
  }

  /* Zurueck auf der Seite? Dann nachholen, was inzwischen geschrieben
     wurde. Das ist genau der Augenblick, in dem er den alten Stand
     gesehen hat: Klassenzimmer weg, Klassenzimmer wieder da. */
  try {
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState !== "visible") return;
        if (zustand.lage !== "drin") return;
        if (Date.now() - verlaufHolenZuletzt < 20000) return;
        verlaufFrischHolen(false);
      });
    }
  } catch (e) {}

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
    /* Eine Aufgabe, die hier schon lief, gilt weiter — auch nach dem
       Aktualisieren der Seite. Sonst waere keine Antwort mehr eine
       Antwort, und der Notenknopf bliebe weg. */
    aufgabeZurueckholen(zustand.raum);
    kontoId = String(o.konto || "");
    zustand.betreiber = Boolean(o.betreiber);
    zustand.ichId = eigeneId();
    zustand.ichName = o.name || "Gast";
    zustand.lage = "verbindet";
    zustand.fehler = "";
    zustand.ichBild = o.bild || bildLaden();
    /* Nur fuer den Klang eines Schreis: maennlich, weiblich, divers
       oder leer. Steht im Profil, reist mit der Nachricht mit. */
    zustand.geschlecht = o.geschlecht || zustand.geschlecht || "";
    zustand.farbe = o.farbe || zustand.farbe || gemerkteFarbe();
    zustand.farbeName = zustand.farbeName || gemerkteNamensfarbe();
    zustand.sprechbild = zustand.sprechbild || gemerktesSprechbild();
    zustand.schrift = gemerkteSchrift();
    zustand.buehne = o.buehne !== false;
    platzJe = {};                 // neuer Raum, neue Sitzordnung
    sitzTausch = {};              // und kein Tausch aus dem alten Raum
    zustand.seit = Date.now();
    zustand.spricht = false;
    zustand.thema = gemerktesThema(zustand.raum);
    /* Und die Fokus-Regel dazu — siehe gemerkterFokus(). Ein
       Haeuptling, der neu laedt, bringt damit die Regel zurueck,
       die er gesetzt hat, statt sie stillschweigend umzuwerfen. */
    zustand.fokus = gemerkterFokus(zustand.raum);
    zustand.haeuptling = false;
    zustand.klassensprecher = false;
    zustand.abgeschlossen = false;
    zustand.eingeladen = {};
    zustand.geknebelt = {};
    zustand.stumm = {};
    zustand.gemeldet = {};
    verlaufBekommen = false;
    /* Ab jetzt, und nur fuer kurze Zeit, darf ein fremder Verlauf
       herein — siehe empfangen(). Das Fenster ist grosszuegig
       bemessen (eine halbe Minute), damit auch ein langsames Netz
       noch durchkommt, aber es schliesst sich. */
    verlaufAngefragt = true;
    if (verlaufFensterUhr) clearTimeout(verlaufFensterUhr);
    verlaufFensterUhr = setTimeout(function () { verlaufAngefragt = false; }, 30000);
    liveKennungGehabt = {};        // neuer Raum, neues Gedaechtnis
    hoerenGerade = {};
    verlaufSchonGeschickt = {};
    /* Der Verlauf aus diesem Raum wird MITGEBRACHT, nicht
       weggeworfen — man soll nachlesen können, was geschrieben
       wurde, auch nach dem Neuladen und nach dem Wiederkommen. */
    /* Neuer Raum: das Lager dieses Raums ist noch nicht gelesen. */
    lagerGelesen = false;
    zustand.nachrichten = chatLaden(zustand.raum);
    /* =====================================================
       EIN VERLAUF FUER ALLE — UND ER WURDE NIE GELESEN
       -----------------------------------------------------
       GEMELDET: „Jetzt ist gerade jemand anderes in den Raum
       gekommen, und es hat ploetzlich den alten Stand aufgerufen …
       als wenn sich der Chat mit einer alten Version aktualisiert.
       In dem Moment, wo jemand anders reinkommt und er diesen
       Verlauf bei sich hat, weil es sein persoenlicher Chatverlauf
       war, ueberschreibt es meinen. Das soll fuer alle ein und
       derselbe Chatverlauf sein, damit so etwas nicht passieren
       kann."

       Er hat den Finger genau auf die Wunde gelegt. Es GIBT eine
       gemeinsame Tabelle (klassenzimmer_chat), und jede Zeile wird
       auch hineingeschrieben — serverSichern() laeuft seit jeher.
       Nur: serverLaden() stand fertig im Code und wurde von
       NIEMANDEM aufgerufen. Gelesen wurde also nie vom Server,
       sondern nur aus dem eigenen Geraet plus dem, was ein
       Ankoemmling gerade mitbrachte. Damit hatte jeder seinen
       eigenen Verlauf, und wer zuletzt hereinkam, brachte seinen
       Stand mit.

       Jetzt wird der gemeinsame Verlauf beim Betreten geholt. Er
       ist die Wahrheit ueber den Raum; das Geraet und der
       Ankoemmling steuern nur bei, was der Server nicht hat (zum
       Beispiel Zeilen von Gaesten ohne Anmeldung). Verloren geht
       dabei nichts — verschmelzen() nimmt beides auf. */
    /* HIER STAND DERSELBE AUFRUF ZWEIMAL — einmal von mir
       hinzugefuegt, einmal war er schon da (weiter unten). Doppelt
       geladen schadet nichts, ist aber doppelte Arbeit und doppelte
       Datenmenge. Der eine ist raus.
       Stattdessen: der VOLLSTAENDIGE Verlauf aus dem Lager. Er ist
       meist laenger als das, was im localStorage Platz hatte. */
    chatAusLager(zustand.raum).then(function (ausLager) {
      if (!ausLager || !ausLager.length) return;
      ausLager.forEach(function (z) { z.eigen = z.von === zustand.ichId; });
      zustand.nachrichten = verschmelzen(ausLager, zustand.nachrichten);
      /* Gleich wieder sichern: damit sind die alten Bedienungshinweise
         (siehe altenMuellFiltern) nicht nur ausgeblendet, sondern
         wirklich aus dem Geraet heraus. */
      chatSichern();
      melden();
      bilderNachreichen(zustand.nachrichten).then(function (etwas) {
        if (etwas) melden();
      });
    }, function () {});
    melden();
    /* Die Bilder liegen nicht im localStorage, sondern im Lager.
       Sie kommen gleich hinterher — ohne dass das Betreten wartet. */
    bilderNachreichen(zustand.nachrichten).then(function (etwas) {
      if (etwas) melden();
    });
    lagerAufraeumen();
    /* Den gemeinsamen Verlauf nachladen — er kommt gleich dazu, ohne
       dass das Betreten darauf warten muss. Und dann noch ein paar
       Mal, siehe verlaufFrischHolen(). */
    verlaufFrischHolen(true);

    /* WICHTIG: die Kamera geht NICHT von selbst an.
       GEWÜNSCHT: „dass das nicht sofort zum Video springt — dass man
       sich entscheiden kann, ob man das Video anschalten will, nicht
       dass sofort das Video auf ist bei Leuten, die das vielleicht
       nicht wollen."
       Also standardmäßig nur Ton. Wer sein Bild zeigen will, tippt
       auf die Kamera; erst dann fragt der Browser danach. */
    /* Hier wird auf das Relais gewartet — aber nur so lange, wie
       das Holen der Kamera ohnehin dauert. Sie laufen nebeneinander,
       also kostet es keine Sekunde extra. Erst danach wird die erste
       Bruecke gebaut, und die nimmt dann die richtigen Server. */
    return Promise.all([
      stromHolen(o.mitBild === true),
      relaisHolen(false)
    ]).then(function (beides) {
      var strom = beides[0];
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
            /* Die Tonwache laeuft, solange man im Raum ist — sie
               haelt das doppelte Hoeren auf, bevor es auffaellt. */
            tonWacheStarten();
            /* GEMELDET: „Zum Beispiel sehe ich die Sprechbild-Animation
               von den anderen nicht, wenn sie sprechen. Ich sehe immer
               nur meine eigenen, und die anderen sehen auch nur ihre
               eigenen — das ist nicht synchron."

               NACHGESEHEN: die Angabe faehrt im Puls mit, also alle
               sechs Sekunden. Solange faellt jeder Neue auf den
               gruenen Standardring zurueck — und sechs Sekunden sind
               genau die Zeitspanne, in der man hinschaut und sagt „da
               ist nichts". In der BEGRUESSUNG fehlte sie dagegen ganz.
               Jetzt faehrt sie schon dort mit, und zwar in beide
               Richtungen (auch in der Antwort weiter unten). Damit
               stimmt es vom ersten Herzschlag an. */
            senden({ art: "hallo", name: zustand.ichName, bild: zustand.ichBild,
                     tonAn: zustand.tonAn, bildAn: zustand.bildAn,
                     seit: zustand.seit, buehne: zustand.buehne,
                     sprechbild: zustand.sprechbild || "",
                     spricht: Boolean(zustand.spricht),
                     geschlecht: zustand.geschlecht || "", konto: kontoId || "" });
            /* Und alles, was waehrend der Funkstille geschrieben
               wurde, geht jetzt hinaus (siehe senden). */
            paketeNachschicken();
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
            if (binBetreiber() && !zustand.haeuptling) {
              zustand.haeuptling = true;
              hinweisZeigen("\ud83e\udd8a Du bist hier Häuptling — als Betreiber in jedem Raum. "
                + "/t Thema · /i einladen · /lock abschließen · /k rauswerfen", "haeuptling");
            }
            setTimeout(function () {
              if (zustand.lage !== "drin") return;
              if (zustand.haeuptling) return;
              if (zustand.raum === HAUPTRAUM) return;
              if (Object.keys(zustand.leute).length === 0) {
                zustand.haeuptling = true;
                hinweisZeigen("Der Raum war leer — du bist hier Häuptling. "
                  + "/t Thema · /i Nickname einladen · /lock abschließen · /k Nickname", "haeuptling");
              }
            }, 1600);
            praesenzZuhoeren(kontoId || zustand.ichId);
            praesenzSetzen(true, zustand.ichName);
            /* Und wenn das Relais gefehlt hat, steht es jetzt da —
               statt dass es wieder jemand aus dem Tonausfall
               erschliessen muss. */
            relaisMelden();
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
                       seit: zustand.seit, buehne: zustand.buehne,
                       geschlecht: zustand.geschlecht || "", konto: kontoId || "" });
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

  /* GEWUENSCHT: „Wenn man einen Raum verlaesst auf die Art, dass man
     einen anderen Raum erzeugt, dann soll im Chat stehen: ,Emmi ist in
     den Raum Langeweile gegangen' — nicht nur ,sie hat den Raum
     verlassen'. Nur wenn sie wirklich weggeht, soll das dastehen."

     Das Abschiedspaket sagt deshalb jetzt, WOHIN. Es weiss es auch:
     ein Raumwechsel ruft verlassen() und betritt gleich darauf den
     naechsten. Fehlt die Angabe, ist es ein echtes Weggehen — und
     dann bleibt es beim alten Satz. */
  function verlassen(wohin) {
    /* DER KLASSENSPRECHER MACHT WEITER.
       „Der Klassensprecher macht weiter mit den anderen, wenn ich den
       Raum verlasse." Also: bevor die Leitung zugeht, geht die
       Verantwortung hinaus. Danach ist es zu spaet — der Kanal ist
       weg und niemand hoert es mehr. */
    try {
      if ((zustand.haeuptling || binLehrer()) && zustand.lage === "drin") {
        var nachfolge = klassensprecherId();
        if (nachfolge) {
          senden({ art: "rang", an: nachfolge, haeuptling: true });
          anAlle("system", (zustand.leute[nachfolge] || {}).name
            + " führt jetzt weiter — " + zustand.ichName + " ist gegangen.");
        }
      }
    } catch (e) {}
    /* Ausdrücklich gegangen heisst: nicht zurückholen.
       Der Chatverlauf bleibt aber liegen — man soll nachlesen
       können, was geschrieben wurde, auch wenn man wiederkommt.
       Weg ist er erst, wenn man ihn selbst löscht. */
    rueckkehrVergessen();
    pulsStoppen();
    wacheStoppen();
    praesenzSetzen(false);
    /* Raus heisst raus: Mikrofon zu, Warteschlange leer. Sonst
       bleibt das Lampchen an und der naechste Raum spielt noch
       Wortmeldungen aus dem alten. */
    freisprechenBeenden();
    sprachSpurSchliessen();
    liveWarteschlange.length = 0;
    stummVon = {};
    zustand.gemeldet = {};
    /* Erst abmelden, DANN den Kanal schliessen — und zwar mit einem
       Atemzug dazwischen. Vorher wurde der Kanal sofort geschlossen,
       das „tschüss" ging dabei manchmal verloren, und man stand für
       die anderen weiter im alten Raum herum. Genau das war die
       gemeldete Karteileiche im Klassenzimmer.
       Das Paket geht dabei immer den gewoehnlichen Weg: senden()
       prueft selbst, ob eine Leitung steht. So laesst es sich auch
       nachmessen. */
    var zielRaum = String(wohin || "").trim();
    senden(zielRaum
      ? { art: "tschuess", wohin: zielRaum, wohinName: raumKlartext(zielRaum) }
      : { art: "tschuess" });
    if (kanal) {
      var alterKanal = kanal;
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
    /* GEWUENSCHT: „Der Verlauf soll in einem verlassenen Raum bleiben —
       dass man alle Nachrichten dort wieder sieht, wenn man in diesen
       Raum zurueckkehrt, nachdem man ihn komplett verlassen hat."
       Gesichert wird sonst nur, wenn eine Zeile dazukommt. Kommt die
       letzte Zeile kurz vor dem Hinausgehen, fehlte sie. Also noch
       einmal, bevor die Tuer zugeht. */
    try { chatSichern(); } catch (e) {}
    verlaufUhrenStoppen();
    zustand.leute = {};
    zustand.gross = null;
    zustand.grosse = [];
    zustand.lage = "aus";
    tonWacheStoppen();
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
  /* Beim Gedrueckthalten: fuenf Minuten. „Ich moechte auch ganze
     Geschichten vorlesen koennen, dass die Leute sich das runterladen
     koennen und das hoeren koennen, wie ich das vorlese, um das
     nachsprechen zu koennen." Zwanzig Sekunden waren dafuer nichts. */
  var SPRACH_LANG = 300;
  /* Beim Freisprechen bleibt es kurz — das sind einzelne Saetze im
     Gespraech, keine Vortraege. */
  var SPRACH_SEKUNDEN = 30;

  /* Ein Kanalpaket ist begrenzt. Frueher hiess das: laenger als 20
     Sekunden geht gar nicht. Jetzt wird eine lange Aufnahme in
     Stuecke geschnitten, einzeln verschickt und drueben wieder
     zusammengesetzt — dann ist die Laenge nur noch eine Frage der
     Geduld, nicht der Technik. */
  /* WARUM VON EMMY NICHTS ANKAM.
     -----------------------------------------------------------
     GEMELDET: „Emmy sagt, sie wuerde versuchen zu sprechen, es kommt
     aber nicht durch … von ihrer Seite kommt aber nichts. Geht das
     nur in Deutschland?"

     Nein — der Kanal ist derselbe fuer alle, egal wo jemand sitzt.
     Der Fehler steckt in der Groesse und im Tempo: eine Aufnahme
     wurde in Bloecke von 80 KB zerlegt und diese in EINER Schleife
     hintereinander weggeschickt, ohne Luft dazwischen. Auf einer
     schnellen Leitung faellt das nicht auf. Auf einer langsamen —
     Mobilfunk, weite Strecke — laeuft der Sendepuffer ueber und der
     Kanal wirft Pakete weg. Und ein einziges fehlendes Paket
     genuegt: sprachTeilEmpfangen() setzt nur zusammen, was
     VOLLSTAENDIG da ist. Fehlt eines, passiert gar nichts, ohne
     Fehlermeldung, auf beiden Seiten.

     Drei Sachen dagegen, alle hier unten:
       - kleinere Pakete (24 KB statt 80 KB),
       - Luft dazwischen (120 ms) statt einer Schleife,
       - und wer etwas vermisst, FRAGT danach (siehe
         sprachFehltMelden / art „sprachfehlt"). */
  var PAKET_BYTES = 24000;
  var PAKET_LUFT = 120;             // Millisekunden zwischen zwei Paketen
  var SPRACH_BYTES = 8000000;   // rund 5 Minuten bei 24 kbit/s
  var sprachRekorder = null;
  var sprachSpur = null;
  var sprachStuecke = [];
  var sprachStart = 0;
  var sprachEndeTakt = 0;
  var sprachWarm = 0;           // wann die Spur zuletzt gebraucht wurde
  var sprachWarmTakt = 0;

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

  /* DAS MIKROFON BLEIBT WARM.
     -----------------------------------------------------------
     GEMELDET: „Es ist immer etwas abgeschnitten."

     Beim allerersten Druecken fragt der Browser das Mikrofon an —
     das dauert je nach Geraet zwei bis fuenf Zehntelsekunden, und
     genau die fehlen dann vorne. Deshalb wird die Spur nach der
     Aufnahme NICHT mehr weggeworfen, sondern eine Minute
     offengehalten. Das zweite Druecken nimmt sofort auf.
     (Das Lampchen bleibt so lange an — deshalb nur eine Minute und
     nicht ewig.) */
  function spurHolen() {
    if (sprachSpur && sprachSpur.getTracks().some(function (t) { return t.readyState === "live"; })) {
      sprachWarm = Date.now();
      return Promise.resolve(sprachSpur);
    }
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (spur) {
      sprachSpur = spur;
      sprachWarm = Date.now();
      clearInterval(sprachWarmTakt);
      sprachWarmTakt = setInterval(function () {
        if (!sprachSpur || sprachRekorder || frei.an) return;
        if (Date.now() - sprachWarm < 60000) return;
        try { sprachSpur.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        sprachSpur = null;
        clearInterval(sprachWarmTakt);
        sprachWarmTakt = 0;
      }, 5000);
      return spur;
    });
  }

  /* DER EINSATZ-PING.
     „Der Signalton soll diese eine Sekunde vorher sein, damit man
     weiss, wann man sprechen kann." Ein kurzer, hoher Blip aus dem
     Tongenerator — keine Datei, also auch keine Ladezeit, die selbst
     wieder eine Verzoegerung waere. Er klingt AUS, waehrend schon
     aufgenommen wird; der Vorlauf faengt das ab. */
  function einsatzPing() {
    try {
      var K = window.AudioContext || window.webkitAudioContext;
      if (!K) return;
      if (!einsatzPing.kontext) einsatzPing.kontext = new K();
      var k = einsatzPing.kontext;
      if (k.state === "suspended" && k.resume) k.resume();
      var o = k.createOscillator(), g = k.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(1180, k.currentTime);
      g.gain.setValueAtTime(0.0001, k.currentTime);
      g.gain.exponentialRampToValueAtTime(0.16, k.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, k.currentTime + 0.13);
      o.connect(g); g.connect(k.destination);
      o.start(); o.stop(k.currentTime + 0.15);
    } catch (e) { /* ohne Ping geht es auch */ }
  }

  function sprachAufnahmeStarten() {
    if (sprachRekorder) return Promise.resolve(false);
    if (!sprachGehtDas()) {
      systemZeile("Dein Browser kann keine Sprachnachrichten aufnehmen — schreib es bitte.");
      return Promise.resolve(false);
    }
    /* FOKUS: wer gerade zuhoert, redet nicht dazwischen. */
    var frei_ = darfSprechen();
    if (!frei_.ja) {
      /* GEMELDET: „Emmy spricht gerade, hoer zu Ende zu, dann bist du
         dran — das musst du alles nicht schreiben." Der gruene Balken
         oben sagt bereits, wer spricht. Hier bleibt nur die eine
         Erklaerung, warum gerade nichts aufgenommen wird — und die
         auch nur beim allerersten Mal. */
      hinweisZeigen(frei_.wer
        ? "🎧 " + frei_.wer + " spricht gerade — dein Mikrofon wartet, "
          + bisFertig(frei_.geschlecht) + ". Schreiben geht jederzeit."
        : "🎧 Solange jemand spricht, wartet dein Mikrofon — dann bist du dran. "
          + "Schreiben geht jederzeit.", "wartet");
      return Promise.resolve(false);
    }
    einsatzPing();
    return spurHolen().then(function (spur) {
      /* Auch hier das eigene Feld je Aufnahme — aus demselben
         Grund wie oben in freiSegmentNeu. */
      var stuecke = [];
      sprachStuecke = stuecke;
      var art = sprachFormat();
      try {
        sprachRekorder = art ? new MediaRecorder(spur, { mimeType: art, audioBitsPerSecond: 24000 })
                             : new MediaRecorder(spur);
      } catch (e) {
        try { sprachRekorder = new MediaRecorder(spur); } catch (e2) { sprachRekorder = null; }
      }
      if (!sprachRekorder) { sprachAufraeumen(); return false; }
      sprachRekorder.ondataavailable = function (e) {
        if (e.data && e.data.size) stuecke.push(e.data);
      };
      sprachRekorder.start();
      sprachStart = Date.now();
      /* Harte Grenze: fuenf Minuten. Laenger wird auch die
         geduldigste Zuhoererin nicht — und die Aufnahme wird in
         Stuecken verschickt, passt also durch den Kanal. */
      clearTimeout(sprachEndeTakt);
      sprachEndeTakt = setTimeout(function () { sprachAufnahmeStoppen(); }, SPRACH_LANG * 1000);
      return true;
    }).catch(function () {
      systemZeile("Das Mikrofon ist nicht freigegeben — in den Browsereinstellungen erlauben, dann geht es.");
      return false;
    });
  }

  /* Nach der Aufnahme nur den Rekorder wegraeumen — die SPUR bleibt
     warm (siehe spurHolen), damit das naechste Druecken sofort
     aufnimmt und vorne nichts fehlt. */
  function sprachAufraeumen() {
    clearTimeout(sprachEndeTakt);
    sprachRekorder = null;
    sprachWarm = Date.now();
  }
  /* Und wenn wirklich Schluss ist (Raum verlassen), auch die Spur. */
  function sprachSpurSchliessen() {
    clearInterval(sprachWarmTakt); sprachWarmTakt = 0;
    if (sprachSpur) {
      try { sprachSpur.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    }
    sprachSpur = null;
  }

  /* Gibt zurueck, ob wirklich etwas verschickt wurde.
     „wie" traegt zwei Angaben: „ab" ist der Vorlauf in Sekunden
     (siehe FREI_LUFT), „live" heisst: das ist eine Wortmeldung im
     Pseudo-Livestream, keine Sprachnachricht. */
  function sprachAufnahmeStoppen(wie) {
    if (!sprachRekorder) return Promise.resolve(false);
    var o = wie || {};
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
            systemZeile("Die Aufnahme ist zu lang — höchstens fünf Minuten am Stück.");
            fertig(false); return;
          }
          fertig(sprachSenden(daten, sekunden, o));
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
    nimmtAuf: false, melden: null,
    segAb: 0,          // wann das laufende Rekorder-Stueck begonnen hat
    sprachAb: 0,       // wann darin das Sprechen angefangen hat
    sprachBis: 0,      // und wann es zuletzt noch eine Stimme war
    spektrum: null, verlauf: [], letztesUrteil: null
  };
  var FREI_ABSTAND = 0.012;     // wie weit ueber dem Grundpegel es „laut" ist
  /* GEWUENSCHT: „…nachdem man fertig ist, eine Pause gemacht hat und
     die Pause mindestens laenger als 2 Sekunden ist, dass es dann
     einfach geschickt wird." Genau zwei Sekunden. Kuerzere Pausen
     sind Atemholen mitten im Satz und duerfen nicht trennen. */
  var FREI_STILLE = 2000;
  var FREI_MINDEST = 350;       // kuerzere Schnipsel sind kein Satz

  /* ===========================================================
     IST DAS EINE STIMME ODER NUR GERAEUSCH?
     -----------------------------------------------------------
     GEWUENSCHT: „…dass wir praktisch unterscheiden, ob es einfach
     nur Stille ist, ob eine menschliche Stimme erkannt wird oder
     nicht … und dann kann es so gekappt werden, dass es ab dem
     Moment kurz bevor man angefangen hat zu sprechen genau sendet
     mit dem Inhalt von dem, was man gesagt hat."

     Ein reiner Lautstaerke-Schwellwert kann das nicht. Ein
     Ventilator, ein Kuehlschrank, ein vorbeifahrendes Auto, ein
     Tuerknall — alles ist „laut". Deshalb werden jetzt DREI
     Eigenschaften zusammen geprueft, und eine Stimme muss alle
     drei haben:

     1. LAUTSTAERKE ueber dem Grundpegel des Raums. Notwendig,
        aber alleine nichts wert.

     2. WO LIEGT DIE ENERGIE? Das Telefon uebertraegt seit hundert
        Jahren 300 bis 3400 Hz, und man versteht darin jedes Wort —
        weil genau dort die Formanten liegen, also das, was einen
        Vokal zu einem A oder einem I macht. Der Grundton einer
        Stimme liegt zwar tiefer (85–180 Hz), aber den braucht man
        nicht: das Ohr denkt ihn sich aus den Obertoenen dazu.

        HIER LAG EIN MESSFEHLER: erst stand 100 Hz als untere
        Grenze. Damit galt ein Ventilatorbrummen bei 120 Hz als
        „Sprachband" und wurde gesendet — gemessen mit einem
        erzeugten 120-Hz-Ton: Bandanteil 0,79, also durchgewinkt.
        Mit 300 Hz als Grenze faellt genau dieser Fall heraus,
        ebenso das Netzbrummen bei 50 und 100 Hz.

     3. IST DAS BREIT ODER EIN EINZELNER ZACKEN? Ein Brummen, ein
        Pfeifen, ein Klingelton — das ist EIN Ton, also ein
        einzelner schmaler Zacken im Spektrum. Sprache dagegen ist
        immer breit: Grundton, Obertoene und mehrere Formanten
        gleichzeitig. Gezaehlt wird deshalb, ueber wie viele
        Frequenzstellen sich die Energie im Sprachband verteilt.
        Das ist das Merkmal, das einen Sinuston sicher aussortiert,
        auch wenn er mitten im Sprachband liegt.

     4. BEWEGT SICH DAS? Sprache schwingt: Silben kommen vier- bis
        achtmal in der Sekunde, dazwischen wird es leiser. Ein
        Ventilator dagegen brummt gleichmaessig weiter. Ueber eine
        knappe Sekunde wird deshalb gemessen, wie stark der Pegel
        schwankt. Ein gleichbleibender Ton faellt hier durch —
        egal wie laut er ist.

     Was hier NICHT passiert: es wird nicht erkannt, WAS jemand
     sagt, und auch nicht, WER spricht. Das waere ein Sprachmodell;
     hier geht es nur um die Frage „Mensch oder Maschine".
     =========================================================== */
  /* Die Werte sind gemessen, nicht geraten — siehe den Messlauf in
     werkzeug/stimme-messen.js. Mit 0,50 fiel eine tiefe Maennerstimme
     durch, weil sie viel Energie unter 300 Hz hat; 0,25 laesst sie
     durch und haelt Brummen (Bandanteil nahe null) trotzdem drauss. */
  var STIMME_BAND_MIN = 0.25;   // so viel Energie muss im Sprachband liegen
  var STIMME_BREITE = 12;       // ueber so viele Frequenzstellen muss sie sich verteilen
  var STIMME_SCHWUNG = 0.22;    // so stark muss der Pegel schwanken
  var STIMME_FENSTER = 16;      // ueber so viele Messungen (rund 1 Sekunde)

  /* ===========================================================
     WARUM VORNE IMMER ETWAS FEHLTE — UND WAS JETZT ANDERS IST
     -----------------------------------------------------------
     GEMELDET: „Entweder eine Latenz oder die Sensibilitaet des
     Pegels zu hoch oder zu niedrig, so dass immer etwas
     abgeschnitten ist. Kriegen wir das hin, dass es nicht mehr
     abgeschnitten ist?"

     Es war keine Frage der Empfindlichkeit. Der Ablauf war:

         still  →  laut gemessen  →  120 ms warten (Tuerknall?)
                →  JETZT erst MediaRecorder bauen und starten
                →  aufnehmen

     Der Rekorder existierte also erst, als das Wort schon
     angefangen hatte. Alles davor war physikalisch nicht da.
     Man kann keinen Schwellwert so fein einstellen, dass er
     RUECKWIRKEND aufnimmt — man muss vorher schon laufen.

     Jetzt laeuft der Rekorder DURCHGEHEND, sobald das
     Freisprechen an ist. Solange es still ist, wird er im
     Sekundentakt weggeworfen und neu aufgesetzt (das kostet
     nichts, Stille ist bei Opus fast null Bytes). Faengt jemand
     an zu sprechen, laeuft der Rekorder also schon seit
     hoechstens einer Sekunde — der Anfang ist mit drin, samt
     erster Silbe und dem Atemholen davor.

     Verschickt wird dann nicht nur die Aufnahme, sondern auch
     der VORLAUF: wie viele Sekunden am Anfang noch Stille sind.
     Der Abspieler springt an diese Stelle (minus 250 ms Luft) —
     man hoert also sofort das Wort, nicht die Stille davor.

     Abgeschnitten werden kann damit nichts mehr. Wenn trotzdem
     etwas fehlt, liegt es am Mikrofon des Geraets, nicht hier.
     =========================================================== */
  var FREI_NEUSTART = 1000;     // in der Stille: so oft frisch aufsetzen
  var FREI_LUFT = 250;          // so viel Stille bleibt vor dem Wort stehen

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
      frei.quelle = quelle;          // zum Abklemmen beim Nachmessen
      frei.messer = frei.kontext.createAnalyser();
      frei.messer.fftSize = 2048;          // feiner, damit die Baender sauber trennen
      frei.messer.smoothingTimeConstant = 0.3;
      quelle.connect(frei.messer);
      frei.daten = new Uint8Array(frei.messer.fftSize);
      frei.spektrum = new Uint8Array(frei.messer.frequencyBinCount);
      frei.verlauf = [];                   // die letzten Pegel, fuer den Schwung
      frei.an = true;
      frei.grundpegel = 0; frei.proben = 0;
      frei.lautSeit = 0; frei.stillSeit = 0; frei.nimmtAuf = false;
      sprachSpur = spur;          // damit sprachAufnahmeStoppen sie findet
      freisagen("eicht");
      freiSegmentNeu();           // ab jetzt laeuft immer einer mit
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
    frei.an = false;             // vor dem Abbrechen, sonst setzt es neu auf
    if (sprachRekorder) sprachAbbrechen();
    try { if (frei.spur) frei.spur.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    try { if (frei.kontext && frei.kontext.close) frei.kontext.close(); } catch (e) {}
    frei.spur = null; frei.kontext = null; sprachSpur = null;
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

  /* Ein frisches Rekorder-Stueck aufsetzen. Wird in der Stille im
     Sekundentakt gemacht, damit beim Losreden immer schon einer
     laeuft — das ist der ganze Trick. */
  function freiSegmentNeu() {
    if (!frei.an || !frei.spur) return;
    /* HIER LAG DER FEHLER, UND ZWAR EIN BOESER.
       -------------------------------------------------------
       GEMELDET: „Das dauernde Sprechen funktioniert offenbar
       noch nicht so ganz. Es kommt nicht automatisch an."

       Der alte Rekorder wurde gestoppt, und gleich danach wurde
       „sprachStuecke" auf ein neues, leeres Feld gesetzt. Nur:
       ein MediaRecorder liefert seine Daten NACH dem Stoppen, in
       einem eigenen Anlauf. Sein Behandler zeigte aber nicht auf
       SEIN Feld, sondern auf die Variable — und die enthielt da
       laengst das Feld des NEUEN Stuecks.

       Folge: vor jedem gesprochenen Satz stand ein Brocken aus
       dem weggeworfenen Stueck davor. Eine Opus-Datei mit einem
       fremden Anfang ist keine gueltige Datei mehr; der Browser
       drueben spielt sie nicht ab. Es kam also wirklich nichts an,
       und zwar zuverlaessig.

       Jetzt bekommt jedes Stueck sein EIGENES Feld, fest in
       seinem Behandler verdrahtet. Selbst wenn der alte Rekorder
       noch etwas nachliefert, landet es in seinem eigenen Feld
       und stoert niemanden mehr. Zusaetzlich wird sein Behandler
       vorher abgehaengt. */
    var alt = sprachRekorder;
    if (alt) {
      alt.ondataavailable = null;
      alt.onstop = null;
      try { alt.stop(); } catch (e) {}
    }
    var stuecke = [];
    sprachStuecke = stuecke;
    var art = sprachFormat();
    try {
      sprachRekorder = art ? new MediaRecorder(frei.spur, { mimeType: art, audioBitsPerSecond: 24000 })
                           : new MediaRecorder(frei.spur);
    } catch (e) {
      try { sprachRekorder = new MediaRecorder(frei.spur); } catch (e2) { sprachRekorder = null; }
    }
    if (!sprachRekorder) return;
    sprachRekorder.ondataavailable = function (e) {
      if (e.data && e.data.size) stuecke.push(e.data);
    };
    try { sprachRekorder.start(); } catch (e) { sprachRekorder = null; return; }
    frei.segAb = Date.now();
    sprachStart = frei.segAb;
  }

  /* Wie viel der Energie liegt im Sprachband (100–3400 Hz)?
     Zurueck kommt ein Wert zwischen 0 und 1. */
  function freiSpektrumMessen() {
    if (!frei.messer || !frei.spektrum) return { anteil: 1, breite: 99 };
    frei.messer.getByteFrequencyData(frei.spektrum);
    var rate = (frei.kontext && frei.kontext.sampleRate) || 48000;
    var proTopf = rate / 2 / frei.spektrum.length;
    var gesamt = 0, drin = 0, spitze = 0;
    var vonI = Math.ceil(300 / proTopf), bisI = Math.floor(3400 / proTopf);
    var obenI = Math.floor(8000 / proTopf);
    for (var i = 1; i < frei.spektrum.length && i <= obenI; i++) {
      var e = frei.spektrum[i];
      gesamt += e;
      if (i >= vonI && i <= bisI) { drin += e; if (e > spitze) spitze = e; }
    }
    if (gesamt < 1) return { anteil: 0, breite: 0 };
    /* Ueber wie viele Stellen verteilt sich die Energie im Sprachband?
       Ein einzelner Sinuston kommt hier auf zwei, drei Stellen;
       Sprache auf viele Dutzend. */
    var breite = 0;
    if (spitze > 0) {
      for (var j = vonI; j <= bisI && j < frei.spektrum.length; j++) {
        if (frei.spektrum[j] >= spitze * 0.4) breite++;
      }
    }
    return { anteil: drin / gesamt, breite: breite };
  }

  /* Wie stark schwankt der Pegel ueber die letzte Sekunde?
     Sprache schwankt, ein Brummen nicht. */
  function freiSchwung() {
    var v = frei.verlauf;
    if (v.length < 6) return 1;           // noch zu wenig gemessen: nicht blockieren
    var max = 0, min = Infinity;
    for (var i = 0; i < v.length; i++) { if (v[i] > max) max = v[i]; if (v[i] < min) min = v[i]; }
    if (max <= 0) return 0;
    return (max - min) / max;
  }

  /* Die eigentliche Frage. „warum" sagt bei Bedarf, woran es lag —
     das steht in der Betreiber-Diagnose und hat beim Einstellen
     der Werte sehr geholfen. */
  function stimmeErkannt(pegel) {
    var laut = pegel > frei.grundpegel + FREI_ABSTAND;
    if (!laut) return { ja: false, warum: "zu leise", band: 0, breite: 0, schwung: 0 };
    var sp = freiSpektrumMessen();
    if (sp.anteil < STIMME_BAND_MIN) {
      return { ja: false, warum: "falsches Band", band: sp.anteil, breite: sp.breite, schwung: 0 };
    }
    if (sp.breite < STIMME_BREITE) {
      return { ja: false, warum: "einzelner Ton", band: sp.anteil, breite: sp.breite, schwung: 0 };
    }
    var schwung = freiSchwung();
    /* Der Schwung wird nur geprueft, solange NICHT aufgenommen wird.
       Waehrend eines Satzes haelt jemand auch mal einen Ton — das
       darf ihn nicht mitten im Wort abschneiden. */
    if (!frei.nimmtAuf && schwung < STIMME_SCHWUNG) {
      return { ja: false, warum: "gleichbleibend", band: sp.anteil, breite: sp.breite, schwung: schwung };
    }
    return { ja: true, warum: "", band: sp.anteil, breite: sp.breite, schwung: schwung };
  }

  function freiHorchen() {
    if (!frei.an) return;
    var pegel = freiPegel();
    var jetzt = Date.now();
    /* Den Pegelverlauf mitschreiben — daraus kommt der Schwung. */
    frei.verlauf.push(pegel);
    if (frei.verlauf.length > STIMME_FENSTER) frei.verlauf.shift();
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
    var urteil = stimmeErkannt(pegel);
    var laut = urteil.ja;
    frei.letztesUrteil = urteil;
    if (!frei.nimmtAuf) {
      if (laut) {
        /* Der ZEITPUNKT des ersten lauten Messwerts wird gemerkt,
           BEVOR die Pruefung laeuft — sonst faengt die Aufnahme erst
           nach der Pruefung an, und genau das war der Fehler. */
        if (!frei.lautSeit) frei.lautSeit = jetzt;
        /* Zwei Messungen lang laut — ein Tuerknall ist eine. Der
           Rekorder laeuft dabei laengst; hier wird nur entschieden,
           ob das Stueck behalten wird. */
        if (jetzt - frei.lautSeit >= 120) {
          freiAufnahmeAn(frei.lautSeit);
          frei.lautSeit = 0;
        }
      } else {
        frei.lautSeit = 0;
        /* Still — dann das laufende Stueck wegwerfen und frisch
           aufsetzen, damit es nie zu lang wird. */
        if (jetzt - frei.segAb >= FREI_NEUSTART) freiSegmentNeu();
      }
      return;
    }
    if (laut) { frei.stillSeit = 0; frei.sprachBis = jetzt; return; }
    if (!frei.stillSeit) frei.stillSeit = jetzt;
    if (jetzt - frei.stillSeit >= FREI_STILLE) freiAufnahmeAus();
  }

  /* HIER WIRD NICHTS MEHR GEBAUT. Der Rekorder laeuft schon; es wird
     nur entschieden, dass dieses Stueck behalten wird — und gemerkt,
     ab wann darin wirklich gesprochen wird. */
  function freiAufnahmeAn(abWann) {
    if (frei.nimmtAuf || !sprachRekorder) return;
    frei.nimmtAuf = true;
    frei.sprachAb = abWann || Date.now();
    frei.sprachBis = Date.now();
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
    var gesprochen = Date.now() - frei.sprachAb;
    if (gesprochen < FREI_MINDEST) {
      /* Zu kurz — wegwerfen und frisch aufsetzen. Das Mikrofon
         bleibt offen; ein Huesteln ist keine Nachricht. */
      freiSegmentNeu();
      freisagen("hoert");
      return;
    }
    /* Der VORLAUF: wie viel Stille steht vorne im Stueck? Genau so
       viel springt der Abspieler weiter — bis auf ein Viertel
       Sekunde Luft, damit das Wort nicht hart einsetzt. */
    var vorlauf = Math.max(0, (frei.sprachAb - frei.segAb - FREI_LUFT) / 1000);
    /* HINTEN GENAUSO KAPPEN WIE VORNE.
       „…dass es dann gekappt geschickt wird auf diesen Inhalt, der
       wirklich als menschliche Stimme erkannt wird."
       Zwei Sekunden Pause stehen am Ende jeder Aufnahme — die will
       niemand hoeren. Mitgeschickt wird deshalb auch, wie lange
       wirklich gesprochen wurde; der Abspieler haelt dort an.
       Ein Viertel Sekunde Luft bleibt, damit das letzte Wort nicht
       abgehackt klingt. */
    var dauer = Math.max(0.3, (frei.sprachBis - frei.sprachAb + FREI_LUFT + 250) / 1000);
    sprachAufnahmeStoppen({ ab: vorlauf, dauer: dauer, live: true }).then(function () {
      if (frei.an) { freiSegmentNeu(); freisagen("hoert"); }
    });
  }

  /* =========================================================
     VERSCHICKEN — in Stuecken, wenn es lang wird
     ---------------------------------------------------------
     GEWUENSCHT: „Die Sprachnachrichten sollen nicht nur auf 20
     Sekunden limitiert sein. Ich moechte auch ganze Geschichten
     vorlesen koennen."

     Ein Kanalpaket ist begrenzt — daran aendert sich nichts. Aber
     eine lange Aufnahme muss ja nicht in EIN Paket. Sie wird in
     Stuecke von 80 KB geschnitten, durchnummeriert verschickt und
     drueben wieder zusammengesetzt. Erst wenn das letzte Stueck da
     ist, entsteht die Nachricht.

     „live" heisst: das ist eine Wortmeldung im Pseudo-Livestream.
     Sie landet in der Warteschlange, wird der Reihe nach
     abgespielt und steht nur dann im Chat, wenn man das
     eingeschaltet hat.
     ========================================================= */
  function sprachSenden(daten, sekunden, wie) {
    if (!daten) return false;
    var o = wie || {};
    /* STUMMGESCHALTET — gar nicht erst hinausschicken.
       „Dass das nicht mehr gesendet wird fuer die anderen, so lange,
       bis er sich wieder benimmt." Die Aufnahme wird verworfen; man
       hoert sich auch selbst nicht, sonst merkt man es nicht. */
    if (binStumm()) {
      systemZeile("Deine Stimme ist stummgeschaltet — das war jetzt nicht zu hören. Schreib im Chat, wenn du wieder mitreden möchtest.");
      return false;
    }
    /* FOKUS, zweiter Riegel: beim Freisprechen laeuft die Aufnahme
       ja durch. Was waehrend einer fremden Wortmeldung entsteht,
       wird deshalb hier verworfen — sonst kaeme es gleich danach
       heraus und niemand wuesste, worauf es sich bezieht. */
    var fokus_ = darfSprechen();
    if (!fokus_.ja) {
      hinweisZeigen("🎧 " + fokus_.wer + " spricht gerade — das hier wurde nicht geschickt. "
        + "Sag es gleich noch einmal, " + wennFertig(fokus_.geschlecht) + ".", "fokus-wartet");
      return false;
    }
    var id = neueNachrichtId();
    var n = {
      id: id,
      von: zustand.ichId, name: zustand.ichName,
      text: "", art: o.live ? "live" : "sprach",
      sprach: daten, sprachSek: sekunden,
      sprachAb: o.ab || 0, sprachDauer: o.dauer || 0,
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName
    };
    /* Die eigene Wortmeldung haengt nur dann im Chat, wenn der
       Mitschrieb an ist — sonst steht der Chat voll und man liest
       nicht mehr, was die Leute schreiben. */
    /* Auch die eigene: sie steht im Verlauf und ist nur unsichtbar.
       Sonst koennte man die eigene Aufnahme nie nachhoeren oder
       zurueckrufen. */
    nachrichtAnhaengen(n);
    /* AUSDRUECKLICH KEIN serverSichern: die Aufnahme ist fluechtig. */

    /* =====================================================
       DIE QUITTUNG — man muss wissen, dass es raus ist
       -----------------------------------------------------
       GEMELDET: „Ich kann nicht mehr hoeren, was ich gesagt
       habe, und ich weiss auch nicht, ob es gesendet wird."

       Beides steht jetzt da: wie lang die Aufnahme war, wer
       sie hoeren kann — und ein Knopf zum Nachhoeren und
       Herunterladen. Ist ausser einem selbst niemand im Raum,
       laeuft sie sofort zurueck; dann ist das Nachhoeren die
       einzige Moeglichkeit, die Aufnahme ueberhaupt zu
       pruefen. Sind andere da, bleibt es beim Knopf — sich
       selbst ins Ohr zu reden, waehrend man spricht, ist
       nichts, was man will.
       ===================================================== */
    /* Wie viele hoeren mit? Gezaehlt wurde bisher nur ueber die
       Sitzplaetze — die stehen aber erst, wenn die Anwesenheit
       durchgelaufen ist. In der Zwischenzeit sah es aus, als waere
       man allein, und dann spielte sich die Aufnahme selbst vor,
       obwohl jemand da war. Deshalb zaehlt jetzt auch die Liste der
       Leute mit, und es gilt die groessere der beiden Zahlen. */
    var zuhoerer = 0;
    try {
      plaetzeBauen().forEach(function (p) { if (!p.leer && !p.ich) zuhoerer += 1; });
    } catch (e) {}
    try {
      var ausListe = Object.keys(zustand.leute || {}).filter(function (k) {
        return k && k !== zustand.ichId;
      }).length;
      if (ausListe > zuhoerer) zuhoerer = ausListe;
    } catch (e) {}
    var wielang = Math.max(1, Math.round(Number(sekunden) || 0));
    /* HIER STAND EINE ZWEITE ZEILE JE AUFNAHME.
       GEMELDET: „Ich moechte keine doppelten Nachrichten mehr haben."
       Eine Wortmeldung erzeugte zwei Eintraege: die Aufnahme selbst
       und darunter eine Quittung („Abgeschickt · 3 Sekunden · …").
       Zwei Zeilen fuer eine Sache sehen aus wie eine Dopplung, und
       genau so hat er es gelesen. Die Quittung ist raus; dass es raus
       ist, sagt jetzt der Sprecherbalken oben und die Bestaetigung
       der anderen, und beides verschwindet von selbst wieder.
       Die Zeile bleibt als Vorlage stehen, damit man sieht, was hier
       einmal stand — gebaut wird sie nicht mehr. */
    var quittungAus = true;
    if (!quittungAus) nachrichtAnhaengen({
      id: id + "-quittung",
      von: zustand.ichId, name: zustand.ichName, art: "quittung",
      /* GEMELDET: „Dieses Mikrofon-Symbol muss ja nicht mehr da sein.
         Es hat ueberhaupt keine Funktion, weil man ja schon sieht,
         dass eine Sprachnachricht da ist." Stimmt — die Tonspur
         daneben sagt es bereits. */
      text: "Abgeschickt · " + wielang + " Sekunden · "
          + (zuhoerer === 0
              ? "ausser dir ist gerade niemand im Raum — du hörst sie gleich selbst zur Kontrolle"
              : (zuhoerer === 1 ? "eine Person hört mit" : zuhoerer + " Personen hören mit")),
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
      sprach: daten, sprachSek: sekunden,
      sprachAb: n.sprachAb, sprachDauer: n.sprachDauer
    });
    if (zuhoerer === 0) {
      /* Auch die eigene Kontrolle geht durch liveEinreihen — sonst
         griffe die Doppelt-Erkennung genau hier nicht. */
      liveEinreihen({
        id: id + "-selbst", von: zustand.ichId, name: zustand.ichName,
        bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
        sprach: daten, sprachSek: sekunden,
        sprachAb: n.sprachAb, sprachDauer: n.sprachDauer,
        zeit: Date.now(), art: "live", selbst: true
      });
      liveSagen();
    }

    var kopf = { id: id, name: n.name, zeit: n.zeit, bild: zustand.ichBild,
                 farbe: zustand.farbe, farbeName: zustand.farbeName, chatArt: n.art,
                 sprachSek: sekunden, sprachAb: n.sprachAb,
                 sprachDauer: n.sprachDauer };
    if (daten.length <= PAKET_BYTES) {
      senden({ art: "text", text: "", sprach: daten,
               id: kopf.id, name: kopf.name, zeit: kopf.zeit, bild: kopf.bild,
               farbe: kopf.farbe, chatArt: kopf.chatArt,
               sprachSek: kopf.sprachSek, sprachAb: kopf.sprachAb,
               sprachDauer: kopf.sprachDauer });
    } else {
      var anzahl = Math.ceil(daten.length / PAKET_BYTES);
      var teile = [];
      for (var i = 0; i < anzahl; i++) {
        teile.push(daten.slice(i * PAKET_BYTES, (i + 1) * PAKET_BYTES));
      }
      /* Die Stuecke bleiben eine Weile liegen: wer eines vermisst,
         kann danach fragen, und dann muss es noch da sein. */
      sprachAusgang[id] = { teile: teile, kopf: kopf, anzahl: anzahl, wann: Date.now() };
      setTimeout(function () { delete sprachAusgang[id]; }, 120000);
      sprachTeilSchicken(id, 0);
    }
    sprachWartenAufQuittung(id, zuhoerer);
    /* Ab jetzt laeuft sie — der gruene Balken oben zeigt das an,
       ohne auf eine Rueckmeldung von drueben zu warten. */
    eigeneWortmeldungLaeuft(sekunden);
    melden();
    return true;
  }

  /* WER HOERT MIR GERADE ZU?
     -----------------------------------------------------------
     GEWUENSCHT: „Wenn sie danach noch mal gehoert wird, die
     Nachricht nach dem Abschicken — so war das ja bisher —, soll
     oben in der Chatleiste auch mein gruener Balken stehen. Das ist
     fuer mich wichtig, damit ich abschaetzen kann, wann die andere
     Seite die Nachricht zu Ende gehoert hat."

     Dafuer muss die andere Seite es sagen, und genau das tut sie
     jetzt: wer eine fremde Wortmeldung abspielt, meldet dem
     Absender „ich hoere" und danach „fertig". Beim Absender laeuft
     der Balken genau so lange weiter.
     Der Eintrag traegt einen Zeitpunkt: bricht die Verbindung mitten
     im Abspielen ab, raeumt sich das nach zwei Minuten von selbst
     weg — ein Balken, der ewig steht, waere schlimmer als keiner. */
  var hoerenGerade = {};
  function hoerenAufraeumen() {
    var jetzt = Date.now();
    Object.keys(hoerenGerade).forEach(function (id) {
      if (jetzt - (hoerenGerade[id].seit || 0) > 120000) delete hoerenGerade[id];
    });
  }
  /* MEINE WORTMELDUNG LAEUFT GERADE.
     GEMELDET: „Ich sehe diese Bubble nicht mehr, wenn ich spreche,
     dass es gruen ist."
     Der Balken haengt daran, dass jemand „ich hoere" meldet — und
     bis diese Meldung zurueckkommt, vergeht ein Moment; ist gerade
     niemand da, kommt sie nie. Deshalb faengt der Balken jetzt
     SOFORT nach dem Abschicken an und laeuft mindestens so lange,
     wie die Aufnahme dauert. Meldet drueben jemand, dass er noch
     hoert, laeuft er entsprechend weiter. */
  var eigeneLaeuftBis = 0;
  function eigeneWortmeldungLaeuft(sekunden) {
    eigeneLaeuftBis = Date.now() + Math.max(1, Number(sekunden) || 1) * 1000 + 1200;
    liveSagen();
    melden();
    setTimeout(function () { liveSagen(); melden(); },
               Math.max(1200, eigeneLaeuftBis - Date.now() + 120));
  }
  function hoertMirZu() {
    hoerenAufraeumen();
    var wer = Object.keys(hoerenGerade).map(function (id) { return hoerenGerade[id].name; });
    if (wer.length) return wer;
    if (Date.now() < eigeneLaeuftBis) return [zustand.ichName || "Du"];
    return null;
  }
  /* Ich spiele die Wortmeldung von jemandem ab — und sage es ihm. */
  function hoereJetzt(vonId, id, los) {
    if (!vonId || vonId === zustand.ichId) return;
    try {
      senden({ art: "hoert", an: vonId, id: String(id || ""),
               los: Boolean(los), name: zustand.ichName });
    } catch (e) {}
  }

  /* Die eigenen Stuecke, solange jemand nachfragen koennte. */
  var sprachAusgang = {};

  /* WER SPAETER KOMMT, SOLL WENIGSTENS DAS LETZTE HOEREN.
     -----------------------------------------------------------
     GEWUENSCHT: „Ich moechte, dass Emmy, wenn sie den Raum betritt,
     die letzte Nachricht, die ich gesprochen habe, noch mal hoert …
     falls sie nicht im Raum ist und erst reinkommt."

     Also schickt jeder dem Ankoemmling SEINE letzte eigene
     Wortmeldung — aber nur, wenn sie frisch ist. Was vor einer
     Viertelstunde gesagt wurde, hilft niemandem mehr beim
     Hereinkommen; es steht ohnehin im Chat zum Nachhoeren.
     Doppelt kommen kann dabei nichts: die Kennung bleibt dieselbe,
     und liveDoppelt() kennt sie (siehe dort). */
  var STIMME_NACHREICHEN_MS = 10 * 60 * 1000;
  function letzteStimmeNachreichen(anId) {
    if (!anId) return;
    var mein = null;
    for (var i = zustand.nachrichten.length - 1; i >= 0; i--) {
      var m = zustand.nachrichten[i];
      if (!m || !m.eigen || !m.sprach) continue;
      mein = m; break;
    }
    if (!mein) return;
    if (Date.now() - (mein.zeit || 0) > STIMME_NACHREICHEN_MS) return;
    var id = liveKern(mein.id);
    /* Kurz warten: der Ankoemmling baut gerade seine Oberflaeche auf,
       und der Verlauf ist ihm wichtiger als der Ton. */
    setTimeout(function () {
      var daten = mein.sprach;
      if (!daten) return;
      var kopf = { id: id, name: zustand.ichName, zeit: mein.zeit, bild: zustand.ichBild,
                   farbe: zustand.farbe, farbeName: zustand.farbeName, chatArt: "live",
                   sprachSek: mein.sprachSek, sprachAb: mein.sprachAb,
                   sprachDauer: mein.sprachDauer };
      if (daten.length <= PAKET_BYTES) {
        senden({ art: "text", text: "", sprach: daten, an: anId, nachhol: true,
                 id: kopf.id, name: kopf.name, zeit: kopf.zeit, bild: kopf.bild,
                 farbe: kopf.farbe, chatArt: kopf.chatArt,
                 sprachSek: kopf.sprachSek, sprachAb: kopf.sprachAb,
                 sprachDauer: kopf.sprachDauer });
        return;
      }
      var anzahl = Math.ceil(daten.length / PAKET_BYTES);
      var teile = [];
      for (var k = 0; k < anzahl; k++) {
        teile.push(daten.slice(k * PAKET_BYTES, (k + 1) * PAKET_BYTES));
      }
      sprachAusgang[id] = { teile: teile, kopf: kopf, anzahl: anzahl,
                            wann: Date.now(), an: anId, nachhol: true };
      setTimeout(function () { delete sprachAusgang[id]; }, 120000);
      sprachTeilSchicken(id, 0);
    }, 2200);
  }

  /* KAM ES AN? EINE EHRLICHE ANTWORT STATT EINER FRAGE.
     -----------------------------------------------------------
     GEMELDET: „Emmy fragt mich staendig, ob ich sie hoere."
     Sie musste fragen, weil ihr niemand etwas gesagt hat. Jetzt
     bestaetigt jeder Empfaenger eine vollstaendig angekommene
     Wortmeldung, und wer spricht, bekommt es zu sehen — und wenn
     nach fuenfzehn Sekunden niemand bestaetigt hat, obwohl jemand
     im Raum ist, steht das genauso da. */
  var sprachQuittung = {};
  function sprachWartenAufQuittung(id, zuhoerer) {
    if (!id || zuhoerer <= 0) return;
    sprachQuittung[id] = { wer: {}, wieviel: 0 };
    setTimeout(function () {
      var q = sprachQuittung[id];
      delete sprachQuittung[id];
      if (!q) return;
      if (q.wieviel > 0) return;
      hinweisZeigen("\u26a0\ufe0f Deine Wortmeldung ist bei niemandem angekommen \u2014 "
        + "sprich sie noch einmal ein.");
    }, 15000);
  }
  function sprachAngekommen(id, wer) {
    var q = sprachQuittung[id];
    if (!q || q.wer[wer]) return;
    q.wer[wer] = true;
    q.wieviel += 1;
    hinweisZeigen("\u2705 " + wer + " hat deine Wortmeldung bekommen.", "bekommen");
  }

  /* Ein Paket, dann Luft, dann das naechste. Eine Schleife waere
     schneller und genau deshalb falsch — siehe PAKET_BYTES. */
  function sprachTeilSchicken(id, nr) {
    var a = sprachAusgang[id];
    if (!a || nr >= a.anzahl) return;
    sprachEinzelnSchicken(id, nr);
    setTimeout(function () { sprachTeilSchicken(id, nr + 1); }, PAKET_LUFT);
  }

  function sprachEinzelnSchicken(id, nr) {
    var a = sprachAusgang[id];
    if (!a || !a.teile[nr]) return;
    var k = a.kopf;
    var paket = { art: "sprachteil", id: id, nr: nr, anzahl: a.anzahl,
                  teil: a.teile[nr],
                  name: k.name, zeit: k.zeit, bild: k.bild,
                  farbe: k.farbe, chatArt: k.chatArt,
                  sprachSek: k.sprachSek, sprachAb: k.sprachAb,
                  sprachDauer: k.sprachDauer,
                  /* Auch eine Wortmeldung sagt, wer da spricht — damit
                     die Wartemeldung drueben „sie" schreiben kann. */
                  geschlecht: zustand.geschlecht || "" };
    /* Nachgereichtes geht nur an DEN EINEN, der gerade gekommen ist —
       alle anderen haben es laengst gehoert. */
    if (a.an) { paket.an = a.an; paket.nachhol = true; }
    senden(paket);
  }

  /* =========================================================
     PLATZ WECHSELN UND TAUSCHEN — MIT EINEM TIPP
     ---------------------------------------------------------
     GEMELDET, und zwar zum zweiten Mal: „Man kann die Sitzplaetze
     durch Klicken auf die anderen Sitzplaetze immer noch nicht
     wechseln oder tauschen."

     Er hatte recht. Es gab den Befehl /tausch, aber keinen Weg
     mit dem Finger: ein Tipp auf einen freien Platz hat einen nur
     auf die Buehne gesetzt (irgendwohin), ein Tipp auf einen
     besetzten hat das Bild vergroessert. Beides hier, als zwei
     benannte Funktionen, damit die Oberflaeche und der Befehl
     denselben Weg nehmen und nicht auseinanderlaufen koennen.
     ========================================================= */
  /* =========================================================
     WER IST WAS IM RAUM — LEHRER, KLASSENSPRECHER, HAEUPTLING
     ---------------------------------------------------------
     GEWUENSCHT: „Im Klassenzimmer ist der Rang von mir als
     Betreiber automatisch Lehrer. Ich kann noch einen Rang
     Klassensprecher vergeben, und der Klassensprecher macht
     weiter mit den anderen, wenn ich den Raum verlasse. Wenn man
     in einen anderen Raum geht, ist man der Haeuptling — die
     Bezeichnung, die zu dem Raum dann passt. Zensuren gibt nur
     der Lehrer; daran sehe ich auch, ob ich ueberhaupt Lehrer
     bin. Aber ich bin immer automatisch Lehrer im Raum, weil ich
     der Einzige bin."

     Also drei Woerter fuer eine Sache, und jedes an seinem Platz:

       LEHRER          der Betreiber, aber NUR im Klassenzimmer
       KLASSENSPRECHER wen der Lehrer dazu macht — er fuehrt
                       weiter, wenn der Lehrer geht
       HAEUPTLING      ueberall sonst, wie bisher

     Es sind keine neuen Rechte, nur andere Namen fuer dieselben:
     wer Haeuptling ist, kann auch als Lehrer alles. Nur das
     Benoten haengt wirklich am Lehrer — sonst koennte in jedem
     selbstgemachten Raum jeder Zensuren verteilen, und die
     zaehlen ja in die Bewertung.
     ========================================================= */
  /* BIN ICH DER BETREIBER? Nicht „war ich es, als ich hereinkam" —
     GEMELDET: „Ich bin die ganze Zeit im Klassenzimmer, ich bin der
     Betreiber. Egal ob ich das Klassenzimmer verlasse und wieder
     hereinkomme, sollte ich immer den Rang haben, Lehrer zu sein.
     Aber ich bekomme immer: zum Unterricht rufen darf nur der
     Betreiber."

     Der Rang stand in einer Marke, die EINMAL beim Betreten gesetzt
     wurde (zustand.betreiber). War das Profil in dem Augenblick noch
     nicht geladen — und beim ersten Aufbau der Seite ist es das oft
     nicht —, blieb sie falsch und blieb es fuer die ganze Sitzung.

     Jetzt wird im Augenblick der Frage nachgesehen, beim Konto
     selbst. Die Marke bleibt als Reserve stehen, falls das Konto
     gerade nicht antwortet. */
  /* WARUM HIER KEIN „EINMAL LEHRER, IMMER LEHRER" STEHT
     -----------------------------------------------------------
     Ich hatte das kurz eingebaut (v318), um eine echte Lücke zu
     schliessen: Beim Betreten ist das Profil oft noch nicht geladen,
     und in diesem Moment ist man für einen Augenblick kein Betreiber.

     werkzeug/pruefe-betreiber.js hat es zu Recht rot gemacht: Wer sich
     abmeldet, bliebe damit Lehrer bis zum Neuladen. Der Rang gehört
     dem Konto, nicht einem Gedächtnis — genau deshalb gibt es diese
     Sonde.

     Die Lücke ist trotzdem zu: Nicht hier, sondern an der Stelle, an
     der sie wirklich weh tat. Eine Chatzeile merkt sich, wie sie
     aussah, und wird nur neu gebaut, wenn sich diese Marke ändert. In
     der Marke steht jetzt AUCH, ob ich Lehrer bin (app.js). Wird der
     Rang eine Sekunde später bekannt, ändert sich die Marke, und die
     Zeile bekommt ihren Notenknopf nachgereicht. */
  function binBetreiber() {
    var B = konto();
    try {
      if (B && B.isOwner && B.isOwner()) return true;
      if (B && B.canModerate && B.canModerate()) return true;
    } catch (e) {}
    return Boolean(zustand.betreiber);
  }
  /* DIE ZWEITE URSACHE, und sie war ebenso meine:
     GEMELDET: „Ich werde nicht mehr als Lehrer erkannt in meinem
     eigenen Klassenzimmer."

     Hier stand „und der Raum ist der HAUPTRAUM". In einem eigenen
     Raum — und das ist bei ihm der Normalfall — war der Betreiber
     damit kein Lehrer, sondern nur Haeuptling, und Zensuren und der
     Ruf zum Unterricht waren gesperrt.

     Seine Ansage war eindeutig: „Generell ich als Betreiber der
     Seite, egal ob ich das Klassenzimmer verlasse und wieder
     hereinkomme, sollte immer die Prioritaet und den Rang haben,
     der Lehrer zu sein." Also ueberall. Es ist seine Seite. */
  function binLehrer() {
    return binBetreiber();
  }
  function rangWort(grossAnfang) {
    var w = binLehrer() ? "Lehrer"
          : (zustand.klassensprecher && zustand.raum === HAUPTRAUM) ? "Klassensprecher"
          : "Häuptling";
    return grossAnfang ? w : w.toLowerCase();
  }
  /* Wer nach mir weitermacht, wenn ich gehe. */
  function klassensprecherId() {
    var raus = "";
    Object.keys(zustand.leute).forEach(function (id) {
      if (zustand.leute[id] && zustand.leute[id].klassensprecher) raus = id;
    });
    return raus;
  }

  /* EINE ZENSUR VERGEBEN — ein Weg fuer Befehl und Knopf.
     GEWUENSCHT: „Die Note moechte ich direkt an der Nachricht geben
     koennen, und mit der Note, die ich gebe, bekommen die anderen
     diese Punkte gutgeschrieben." Also liegt die ganze Arbeit hier,
     und sowohl /note als auch der kleine Knopf an der Zeile rufen
     dieselbe Stelle. Zwei Wege, die dasselbe tun sollen, laufen
     sonst irgendwann auseinander. */
  var NOTE_WORT = { 1: "sehr gut", 2: "gut", 3: "befriedigend",
                    4: "ausreichend", 5: "mangelhaft", 6: "ungenügend" };
  /* Eine Eins ist etwas wert und soll etwas bringen; eine Sechs nimmt
     nichts weg — Noten sind hier zum Anspornen da, nicht zum Strafen. */
  var NOTE_PUNKTE = { 1: 10, 2: 6, 3: 3, 4: 1, 5: 0, 6: 0 };

  function noteGeben(id, zahl, wofuer) {
    if (!binLehrer()) {
      systemZeile("Zensuren gibt nur der Lehrer — das ist der Betreiber im Klassenzimmer.");
      return { ok: false };
    }
    zahl = Math.round(Number(zahl));
    if (!(zahl >= 1 && zahl <= 6)) { systemZeile("Zensuren gehen von 1 bis 6."); return { ok: false }; }
    var wer = zustand.leute[id];
    if (!wer && id !== zustand.ichId) { systemZeile("Die Person ist nicht mehr hier."); return { ok: false }; }
    var name = wer ? wer.name : zustand.ichName;
    var gut = NOTE_PUNKTE[zahl];
    if (gut && id !== zustand.ichId) {
      postSenden(id, { art: "punkte", wieviel: gut, raum: zustand.raum,
                       grund: "Zensur " + zahl + (wofuer ? " in " + wofuer : "") + " im Klassenzimmer" });
    }
    /* =========================================================
       SIE MUSS ES WIRKLICH MITBEKOMMEN
       ---------------------------------------------------------
       GEWUENSCHT: „… und dass sie auf der anderen Seite diese Note
       auch wirklich kriegt, mit einer Meldung, dass sie die Note
       kriegt."

       Bisher hing das an den PUNKTEN: nur wer eine 1 bis 4 bekam,
       bekam ueberhaupt ein Paket geschickt — NOTE_PUNKTE ist bei
       einer 5 und einer 6 null, und dann ging gar nichts hinaus.
       Wer eine 5 bekam, erfuhr es also nur, wenn er zufaellig
       gerade in den Chat sah. Das ist genau verkehrt herum: eine
       schlechte Note muss man erst recht mitbekommen.

       Deshalb geht jetzt IMMER ein eigenes Paket an die Person —
       unabhaengig von Punkten, unabhaengig von der Zahl. Auf ihrer
       Seite wird daraus eine Meldung, die man nicht uebersieht
       (siehe „note-fuer-dich" in empfangen()).

       Und weil ein Zuruf verlorengehen kann, wenn die Gegenseite
       gerade neu laedt, steht die Note ZUSAETZLICH als Zeile im
       gemeinsamen Verlauf (anAlle unten) — die wird gespeichert und
       ist auch morgen noch da. */
    if (id !== zustand.ichId) {
      postSenden(id, { art: "note-fuer-dich", zahl: zahl, wofuer: wofuer || "",
                       wort: NOTE_WORT[zahl] || "", punkte: gut || 0,
                       raum: zustand.raum, raumName: raumKlartext(zustand.raum),
                       vonName: zustand.ichName });
    }
    /* „Dann steht oben im Newsticker, dass derjenige gerade eine Eins
       in Grammatik bekommen hat." */
    raumEreignis(name + " hat gerade eine " + zahl
      + (wofuer ? " in " + wofuer : "") + " bekommen");
    anAlle("note", "📋 " + name + " bekommt eine " + zahl
      + " (" + NOTE_WORT[zahl] + ")" + (wofuer ? " — " + wofuer : "")
      + (gut ? "  ·  +" + gut + " Punkte" : ""));
    return { ok: true, name: name, punkte: gut };
  }

  function platzNehmen(nummer) {
    if (zustand.lage !== "drin") return { ok: false, warum: "Dafür musst du erst im Raum sein." };
    var n = Number(nummer);
    if (!(n >= 1 && n <= PLAETZE)) return { ok: false, warum: "Diesen Platz gibt es nicht." };
    var jetzt = plaetzeBauen();
    var ziel = jetzt[n - 1];
    if (!ziel) return { ok: false, warum: "Diesen Platz gibt es nicht." };
    if (!ziel.leer) {
      if (ziel.id === zustand.ichId) return { ok: false, warum: "Da sitzt du schon." };
      return platzTauschenMit(ziel.id);
    }
    sitzTausch[zustand.ichId] = n - 1;
    senden({ art: "sitzplatz", ordnung: sitzTausch,
             text: zustand.ichName + " setzt sich auf Platz " + n + "." });
    melden();
    return { ok: true, text: "Du sitzt jetzt auf Platz " + n + "." };
  }

  function platzTauschenMit(id) {
    if (zustand.lage !== "drin") return { ok: false, warum: "Dafür musst du erst im Raum sein." };
    if (!id || id === zustand.ichId) return { ok: false, warum: "Mit dir selbst geht das nicht." };
    var jetzt = plaetzeBauen();
    var meiner = null, seiner = null;
    jetzt.forEach(function (pl) {
      if (pl.id === zustand.ichId) meiner = pl;
      if (pl.id === id) seiner = pl;
    });
    if (!seiner) return { ok: false, warum: "Die Person sitzt gerade auf keinem Platz." };
    if (!meiner) {
      /* Wer noch nicht sitzt, kann auch nicht tauschen — aber er
         kann sich daneben setzen. Das ist das, was gemeint ist,
         wenn jemand von unten auf einen Platz tippt. */
      return { ok: false, warum: "Geh erst auf die Bühne, dann könnt ihr tauschen." };
    }
    sitzTausch[zustand.ichId] = seiner.nummer - 1;
    sitzTausch[id] = meiner.nummer - 1;
    var satz = zustand.ichName + " und " + seiner.name + " haben die Plätze getauscht.";
    senden({ art: "sitzplatz", ordnung: sitzTausch, text: satz });
    melden();
    return { ok: true, text: satz };
  }

  /* =========================================================
     KLASSENZIMMER-AUFGABEN
     ---------------------------------------------------------
     GEWUENSCHT: „Einmal, dass man die Woerter verdrehen kann,
     zum Beispiel den ganzen Satz oder ein Wort, und die Leute
     sollen richtig schreiben, wie es richtig geschrieben wird.
     … Auch die Schreibweise eines Wortes, dass die Buchstaben
     total durcheinander sind im Wort — das Gehirn kann noch
     sehen, was es fuer ein Wort ist, aber die Leute muessen das
     Wort aus den Buchstaben richtig aufbauen. Und das gibt
     Punkte. … Und ich kann den Leuten als Lehrer Zensuren
     geben."

     WER PRUEFT, IST WICHTIG. Die Loesung wird NICHT mitgeschickt.
     Sie bleibt bei dem, der die Aufgabe gestellt hat; nur sein
     Geraet vergleicht die Antworten. Stuende sie im Rundruf,
     koennte jeder sie im Browser nachlesen — dann waere die
     Aufgabe keine.

     Die Aufgabe selbst faehrt als gewoehnlicher Text mit
     (Teile durch „ · " getrennt). Das ist Absicht: so kommt sie
     auch bei jemandem an, dessen Fassung die neuen Felder noch
     gar nicht kennt — er sieht dann eben eine Zeile statt
     Knoepfen, kann aber trotzdem mitmachen.
     ========================================================= */
  var AUFGABE_PUNKTE = { satz: 6, wort: 4 };
  var punkteVerlauf = [];     // { t, w } — der Stundendeckel
  var offeneAufgabe = null;   // { typ, loesung, teile, wer: {}, zeit }

  function mischen(liste) {
    var a = liste.slice();
    /* Fisher-Yates. Und: wenn am Ende zufaellig dasselbe
       herauskommt, noch einmal — eine „verdrehte" Aufgabe, die
       gar nicht verdreht ist, waere eine Enttaeuschung. */
    for (var d = 0; d < 6; d++) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var h = a[i]; a[i] = a[j]; a[j] = h;
      }
      if (a.join("\u0001") !== liste.join("\u0001")) break;
    }
    return a;
  }

  /* Vergleichen, ohne kleinlich zu sein: Gross- und Kleinschreibung
     zaehlt nicht, doppelte Leerzeichen auch nicht, und ein Punkt am
     Ende ist kein Fehler. Die Wortstellung dagegen schon — darum
     geht es ja. */
  function aufgabeGleich(a, b) {
    var f = function (x) {
      return String(x || "").toLowerCase().replace(/[.!?,;:]/g, "")
        .replace(/\s+/g, " ").trim();
    };
    return f(a) === f(b) && f(a) !== "";
  }

  function aufgabeStellen(typ, roh) {
    var text = String(roh || "").trim();
    if (!text) {
      return systemZeile(typ === "satz"
        ? "So geht es:  /satz Der Hund läuft über die Wiese"
        : "So geht es:  /wort Fahrrad");
    }
    var teile = typ === "satz" ? text.split(/\s+/) : Array.from(text.replace(/\s+/g, ""));
    if (teile.length < 2) {
      return systemZeile(typ === "satz"
        ? "Ein einzelnes Wort ist noch kein Satz — schreib ein paar Wörter mehr."
        : "Ein einzelner Buchstabe ist noch kein Wort.");
    }
    if (teile.length > 24) return systemZeile("Das ist zu lang — höchstens 24 Teile.");
    var gemischt = mischen(teile);
    /* Die gemischten Teile bleiben liegen — die Oberflaeche macht
       daraus die Kacheln zum Antippen (siehe offeneAufgabeInfo). Sie
       werden EINMAL gemischt und nicht bei jedem Zeichnen: sonst
       sortierte sich die Aufgabe bei jedem Auffrischen des Raums neu,
       und man faengt ewig von vorn an. */
    offeneAufgabe = { typ: typ, loesung: text, frage: "", teile: teile,
                      teileGemischt: gemischt, wer: {},
                      zeit: Date.now(), zeileId: "" };
    var zeile = anAlle("aufgabe", (typ === "satz"
        ? "🧩 Bring den Satz in Ordnung: "
        : "🔤 Bau das Wort richtig auf: ") + gemischt.join(" · "));
    /* Die KENNUNG der Aufgabenzeile ist der Schluessel zu allem, was
       danach kommt: Eine Antwort traegt sie mit sich, und damit weiss
       die Seite ohne jedes Raten, zu welcher Frage sie gehoert. */
    if (zeile && zeile.id) {
      offeneAufgabe.zeileId = zeile.id;
      zeile.aufgabeId = zeile.id;
    }
    aufgabeMerken();
    aufgabeVerkuenden();
    return true;
  }

  /* =========================================================
     DIE AUFGABEN AUS DEM WOERTERBUCH
     ---------------------------------------------------------
     GEFRAGT: „Bei Aufgabe gibt's immer noch keinen richtigen Sinn in
     der Aufgabe. Was ist deine Strategie fuer diese Aufgabe?" — und
     gewuenscht: „einige der Spiele, die fuer den Chat kompatibel
     sind, zum Beispiel Artikel raten … dass man im Chat sogar auf den
     Link im Woerterbuch zugreifen kann … Das Ganze soll dann
     natuerlich auch benotet werden koennen."

     Die Strategie steht ausfuehrlich in app.js bei DMA_WORTPROBE. Kurz:
     eine Aufgabe taugt nur, wenn sie aus dem eigenen Stoff kommt, sich
     selbst pruefen kann und danach eine Note bekommen kann. Genau das
     sind diese zwei — die Woerter kommen aus dem Woerterbuch, die
     Loesung steht dort auch, geprueft wird sofort.

     Das Woerterbuch liegt in app.js und wird erst geholt, wenn die
     erste solche Aufgabe gestellt wird. Ist es noch unterwegs, sagt
     die Zeile das und man versucht es gleich noch einmal. */
  function wortAufgabeStellen(art, roh) {
    var probe = null;
    var wp = (typeof window !== "undefined") ? window.DMA_WORTPROBE : null;
    if (!wp) {
      return systemZeile("Das W\u00f6rterbuch ist auf diesem Ger\u00e4t nicht geladen.");
    }
    try { probe = (art === "artikel") ? wp.artikel(roh) : wp.begriff(roh); } catch (e) { probe = null; }
    if (!probe) {
      /* Noch nicht da? Dann anstossen und Bescheid sagen — ein stilles
         Nichts waere das Schlimmste. */
      var laeuft = false;
      try { laeuft = Boolean(wp.nachladen && wp.nachladen()); } catch (e) {}
      if (!wp.bereit || !wp.bereit()) {
        return systemZeile("\ud83d\udcda Das W\u00f6rterbuch wird gerade geholt"
          + (laeuft ? "" : "") + " \u2014 gleich noch einmal  /" + art + "  tippen.");
      }
      return systemZeile("Dazu finde ich im W\u00f6rterbuch nichts"
        + (roh ? " zu \u201e" + String(roh).slice(0, 40) + "\u201c" : "") + ".");
    }
    if (art === "artikel") {
      offeneAufgabe = { typ: "artikel", loesung: probe.artikel,
                        frage: "Welcher Artikel geh\u00f6rt zu \u201e" + probe.nomen + "\u201c?",
                        teile: ["der", "die", "das"],
                        teileGemischt: ["der", "die", "das"],
                        wer: {}, zeit: Date.now(), zeileId: "" };
      /* Die Bedeutung steht dabei — dann ist es eine Uebung und kein
         Gluecksspiel, und wer das Wort nicht kennt, lernt es hier. */
      var zeileA = anAlle("aufgabe",
        "\ud83d\udd24 Welcher Artikel geh\u00f6rt zu \u201e" + probe.nomen + "\u201c?"
        + (probe.bedeutung ? "  (" + String(probe.bedeutung).slice(0, 90) + ")" : "")
        + ": der \u00b7 die \u00b7 das",
        { wortLink: probe.nomen });
      if (zeileA && zeileA.id) { offeneAufgabe.zeileId = zeileA.id; zeileA.aufgabeId = zeileA.id; }
      aufgabeMerken();
      aufgabeVerkuenden();
      return true;
    }
    offeneAufgabe = { typ: "begriff", loesung: probe.wort,
                      frage: probe.bedeutung, teile: [], teileGemischt: [],
                      wer: {}, zeit: Date.now(), zeileId: "" };
    var zeileB = anAlle("aufgabe",
      "\ud83d\udcd6 Welches Wort ist gemeint? " + probe.bedeutung
      + (probe.stufe ? "  (" + probe.stufe + ")" : ""),
      { wortLink: probe.wort });
    if (zeileB && zeileB.id) { offeneAufgabe.zeileId = zeileB.id; zeileB.aufgabeId = zeileB.id; }
    aufgabeMerken();
    aufgabeVerkuenden();
    return true;
  }

  /* =========================================================
     EINE AUFGABE IN EIGENEN WORTEN
     ---------------------------------------------------------
     GEWUENSCHT: „Ich moechte diese Benotung nicht global haben, nur
     an den Antworten von den Aufgaben. Die Stelle, wenn es wirklich
     als diese Antwort von dieser Aufgabe erkannt wird, soll rechts
     Note stehen."

     Der Notenknopf haengt an genau einer Auskunft: „diese Zeile ist
     eine Antwort auf eine Aufgabe". Die gab es bisher nur fuer die
     beiden Puzzles /satz und /wort. Im Unterricht wird aber meistens
     anders gefragt — „Schreib einen Satz mit weil". Dafuer ist das
     hier: die Aufgabe steht im Chat, und ab da gilt, was die anderen
     schreiben, als Antwort darauf. Es gibt keine Musterloesung, also
     urteilt das Programm auch nicht — das tut der Lehrer mit der
     Note.
     Ohne Text beendet /aufgabe die laufende Aufgabe wieder; sonst
     bliebe jedes spaetere Wort eine Antwort, und genau das war ja
     nicht gewuenscht.
     ========================================================= */
  /* =========================================================
     DIE SORTIERAUFGABE — KONTEXT UEBEN
     ---------------------------------------------------------
     GEWUENSCHT, woertlich: „Dann moechte ich eine Kontextaufgabe,
     wo ich vielleicht einen Text einbringe, der aus drei, vier
     Saetzen besteht, die in der Reihenfolge eine kleine Geschichte
     erzaehlen, und dann moechte ich, dass die Leute diese Saetze
     sortieren, damit die Geschichte von oben bis unten logisch Sinn
     macht vom Ablauf, damit man Kontext ein bisschen trainieren
     kann."

     So geht es:   /sortieren Erst stand er auf. | Dann ass er. |
                   Danach ging er zur Arbeit.
     Die Saetze werden GEMISCHT verschickt — aber die Loesung reist
     NICHT mit. Sie bleibt beim Geraet dessen, der die Aufgabe
     gestellt hat; sonst koennte jeder sie in der Konsole nachlesen.
     Geprueft wird deshalb dort: die Antwort kommt als Reihe von
     Nummern zurueck, und wer die Aufgabe gestellt hat, vergleicht
     und meldet Richtig oder Falsch an alle.

     Warum Nummern und nicht Text: die Saetze koennen lang sein, und
     eine Antwort wie „2 3 1" laesst sich auf dem Telefon in drei
     Tipps geben — genau dafuer sind die Knoepfe in der Oberflaeche.
     ========================================================= */
  function mischen(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* „kontexter" ist derselbe Mechanismus mit einem anderen Namen und
     einer anderen Ueberschrift.
     GEWUENSCHT, woertlich: „Diesen Kontext-Text brauche ich noch, dass
     die Leute eine Reihenfolge in einer Geschichte logisch
     zusammensetzen koennen. Den Kontextsortierer … KONTEXTER. Also
     koennte man das Ding nennen."
     Zwei getrennte Maschinen dafuer zu bauen waere Unsinn: gemischt,
     verteilt und geprueft wird genau gleich. */
  function sortierAufgabeStellen(roh, alsKontexter) {
    var text = String(roh || "").trim();
    if (!text && alsKontexter) {
      return systemZeile("\ud83e\udde9 KONTEXTER: eine Geschichte, Satz f\u00fcr Satz.\n"
        + "So geht es:  /kontexter Erst stand er auf. | Dann ass er. | Danach ging er los.\n"
        + "Bequemer: das Buchzeichen \ud83d\udcd6 \u2192 Text w\u00e4hlen \u2192 auf das \ud83e\udde9 daneben tippen. "
        + "Dann kommen die S\u00e4tze dieses Textes gemischt.");
    }
    if (!text) {
      return systemZeile("So geht es:  /sortieren Erst stand er auf. | "
        + "Dann ass er. | Danach ging er zur Arbeit."
        + "\nDie Saetze werden gemischt; wer sie in die richtige Reihenfolge "
        + "bringt, bekommt es sofort gesagt.");
    }
    var saetze = text.split("|").map(function (x) { return x.trim(); })
                     .filter(function (x) { return x.length > 0; });
    if (saetze.length < 2) {
      return systemZeile("Dafuer brauche ich mindestens zwei Saetze, getrennt "
        + "mit einem senkrechten Strich:  /sortieren Satz eins | Satz zwei");
    }
    if (saetze.length > 8) saetze = saetze.slice(0, 8);
    /* Gemischt wird EINMAL, hier — damit alle dieselbe Mischung
       sehen. Wuerde jedes Geraet selbst mischen, redeten alle von
       verschiedenen Nummern. */
    var reihenfolge = saetze.map(function (_, i) { return i; });
    var gemischt = mischen(reihenfolge);
    /* Die Loesung ist: an welcher Stelle der gemischten Liste steht
       der Satz, der urspruenglich an Stelle 0, 1, 2 … stand. */
    var loesung = saetze.map(function (_, richtig) {
      return gemischt.indexOf(richtig) + 1;
    }).join(" ");
    var ueberschrift = alsKontexter
      ? "KONTEXTER \u2014 bring die Geschichte in die richtige Reihenfolge."
      : "Bring die Saetze in die richtige Reihenfolge.";
    offeneAufgabe = { typ: "sortieren", loesung: loesung, frage: ueberschrift,
                      teile: gemischt.map(function (i) { return saetze[i]; }),
                      wer: {}, zeit: Date.now(), zeileId: "" };
    var zeile = anAlle("aufgabe", "\ud83e\udde9 " + (alsKontexter
        ? "KONTEXTER \u2014 bring die Geschichte in die richtige Reihenfolge."
        : "Bring die S\u00e4tze in die richtige Reihenfolge."),
      { sortieren: offeneAufgabe.teile });
    if (zeile && zeile.id) {
      offeneAufgabe.zeileId = zeile.id;
      zeile.aufgabeId = zeile.id;
    }
    aufgabeMerken();
    aufgabeVerkuenden();
    return true;
  }

  function aufgabeFreiStellen(roh) {
    var text = String(roh || "").trim();
    if (!text) {
      if (offeneAufgabe) {
        var war = offeneAufgabe.frage || offeneAufgabe.loesung || "";
        offeneAufgabe = null;
        aufgabeMerken();
        senden({ art: "aufgabeAus" });
        return systemZeile("✔️ Die Aufgabe ist beendet"
          + (war ? " („" + String(war).slice(0, 40) + "“)" : "")
          + " — ab jetzt ist wieder alles ganz gewoehnlicher Chat.");
      }
      return systemZeile("So geht es:  /aufgabe Schreib einen Satz mit „weil“"
        + "  — und  /aufgabe  ohne Text beendet sie wieder.");
    }
    offeneAufgabe = { typ: "frei", loesung: "", frage: text.slice(0, 300),
                      teile: [], wer: {}, zeit: Date.now(), zeileId: "" };
    var zeileF = anAlle("aufgabe", "📝 Aufgabe: " + text);
    if (zeileF && zeileF.id) {
      offeneAufgabe.zeileId = zeileF.id;
      zeileF.aufgabeId = zeileF.id;
    }
    aufgabeMerken();
    aufgabeVerkuenden();
    return true;
  }

  /* =========================================================
     DIE BETONUNGSUEBUNG
     ---------------------------------------------------------
     GEWUENSCHT: „Bau gleich noch eine Betonungsuebung ein: wenn
     ich ein Wort oder einen Satz schreibe, wird im Woerterbuch
     danach gescannt, ob es diese Woerter gibt, und wir koennen
     unsere Betonungsregel fuer die Woerter als Spiel benutzen —
     dass die Leute die anklicken koennen, die betont werden, und
     dass ich das auch benoten kann ganz normal."

     WAS HIER *NICHT* MITREIST: DIE LOESUNG.
     Verschickt wird nur der TEXT. Die Silben und die betonte
     Silbe schlaegt jedes Geraet in SEINEM Woerterbuch nach — es
     ist ueberall dasselbe, also kommt ueberall dasselbe heraus.
     Waere die Loesung im Paket, koennte man sie mit etwas
     Neugier einfach mitlesen. So steht sie nirgends in der
     Leitung.

     Benotet wird wie bei jeder anderen Aufgabe: die Antwort geht
     als ganz gewoehnliche Zeile hinaus und traegt die Kennung
     der Aufgabe mit sich — damit steht der Notenstift daneben,
     ohne dass hier irgendetwas Eigenes dafuer noetig waere.
     ========================================================= */
  /* =================================================================
     DAS GLUECKSRAD — EIN GESUCHTER SATZ
     -----------------------------------------------------------------
     GEWUENSCHT: „Dann noch als Variante fuer einen gesuchten Satz wie
     bei Glücksrad — dass ich einen Satz oder eine Redewendung
     schreibe und ein paar Buchstaben schon in den Feldern stehen,
     ohne den Chat irgendwie in seinem Designfluss zu beeintraechtigen.
     Vielleicht auch eine Auswahl an fertigen Redewendungen."

     Beides ist da: ein eigener Satz mit  /raten …  — oder ohne Text
     eine aus dieser Liste. Es sind gaengige deutsche Redewendungen,
     wie sie im Duden unter „Redewendung" stehen; nichts Erfundenes.
     ================================================================= */
  var REDEWENDUNGEN = [
    "Alle guten Dinge sind drei",
    "Aller Anfang ist schwer",
    "Übung macht den Meister",
    "Morgenstund hat Gold im Mund",
    "Wer zuletzt lacht, lacht am besten",
    "Der Apfel fällt nicht weit vom Stamm",
    "Viele Köche verderben den Brei",
    "Reden ist Silber, Schweigen ist Gold",
    "Ende gut, alles gut",
    "Wer A sagt, muss auch B sagen",
    "Kleider machen Leute",
    "Lügen haben kurze Beine",
    "Wer nicht wagt, der nicht gewinnt",
    "Ohne Fleiß kein Preis",
    "Es ist noch kein Meister vom Himmel gefallen",
    "Was du heute kannst besorgen, das verschiebe nicht auf morgen",
    "In der Kürze liegt die Würze",
    "Der frühe Vogel fängt den Wurm",
    "Man soll den Tag nicht vor dem Abend loben",
    "Einem geschenkten Gaul schaut man nicht ins Maul"
  ];

  /* =========================================================
     DAS RUNDENLAUFEN
     ---------------------------------------------------------
     GEWUENSCHT: „und da soll, wie gesagt, das Runden laufen."
     Die Runde ist die SITZREIHE — dieselbe Reihenfolge, die jeder
     auf seinem Bildschirm sieht (plaetzeBauen sortiert nach
     Ankunftszeit, auf jedem Geraet gleich). Wer die Aufgabe stellt,
     ist nicht dran; es beginnt der Naechste im Kreis, und nach jedem
     Versuch rueckt es weiter.

     Weitergezaehlt wird auf dem Geraet dessen, der die Aufgabe
     gestellt hat — und von dort als eigener Ruf an alle. Jedes Geraet
     fuer sich zaehlen zu lassen, ginge schief: die Nachrichten
     treffen nicht ueberall in derselben Reihenfolge ein. Dasselbe
     Muster wie bei der Lesezeile, und das traegt seit Runde 21. */
  /* =========================================================
     DIE REIHENFOLGE — WER IST WANN DRAN
     ---------------------------------------------------------
     GEFRAGT: „es soll ja der Reihe nach zaehlen, wer als
     naechstes dran ist. Und wenn jemand mit mir waehrend der Zeit
     Plaetze tauscht … entweder ist dann waehrend des Spiels die
     Regel, dass jeder auf seinem Platz ist … oder die Leute sind,
     wie sie nacheinander in den Raum gekommen sind, sowieso in der
     Reihenfolge gezaehlt."

     GEWAEHLT: die ANKUNFT im Raum. Grund: sie ist die einzige
     Ordnung, die sich nicht aendert, wenn zwei die Plaetze tauschen
     oder jemand „auf der Buehne hin und her tanzt" — und jedes
     Geraet kennt sie (jede Person traegt ihr „seit" mit sich).
     Gleiche Zeit? Dann entscheidet die Kennung, damit es nie
     unentschieden bleibt. Vorher war es die SITZREIHE: beim Tausch
     sprang die Reihenfolge mitten im Spiel. */
  function spielReihe() {
    var liste = [];
    if (zustand.lage === "drin") {
      liste.push({ id: zustand.ichId, name: zustand.ichName || "Du",
                   seit: zustand.seit || Date.now() });
    }
    Object.keys(zustand.leute).forEach(function (id) {
      var p = zustand.leute[id];
      if (!p || !p.id) return;
      liste.push({ id: p.id, name: p.name || "Gast", seit: p.seit || 0 });
    });
    liste.sort(function (a, b) {
      return (a.seit - b.seit) || (a.id < b.id ? -1 : (a.id > b.id ? 1 : 0));
    });
    return liste;
  }
  function rundeNamen() {
    try {
      return spielReihe().map(function (p) { return { id: p.id, name: p.name }; });
    } catch (e) { return []; }
  }
  function naechsterDran(nachId) {
    var reihe = rundeNamen();
    if (!reihe.length) return "";
    var i = reihe.findIndex(function (p) { return p.id === nachId; });
    return reihe[(i + 1) % reihe.length].name;
  }
  function dranSetzen(name) {
    if (!offeneAufgabe) return false;
    offeneAufgabe.dran = String(name || "");
    aufgabeMerken();
    senden({ art: "dran", zeileId: offeneAufgabe.zeileId || "", name: offeneAufgabe.dran });
    melden();
    return true;
  }

  /* =================================================================
     SCHIFFE VERSENKEN
     -----------------------------------------------------------------
     GEWUENSCHT, woertlich: „dann moechte ich noch ein Schiffe
     versenken spielen mit den Leuten … ihre Profilbilder sollen an
     verschiedenen Plaetzen sein und dann ist jeder nach der Reihe
     einmal dran und waehlt einen Platz aus, wo er denkt, dass eine
     Person sitzt, und das duerfen die anderen natuerlich nicht sehen,
     wo ich mich versteckt habe … der andere sieht in dem Moment beim
     Schiffe versenken die anderen Leute, seine Mitspieler, nicht mehr
     … Ich moechte, dass es auf allen Seiten wirklich sofort
     funktioniert."

     WIE DIE HEIMLICHKEIT WIRKLICH HAELT: Verstecke werden NICHT an
     alle geschickt. Sie gehen als persoenliche Post an genau EIN
     Geraet — das des Spielleiters (wer /versenken getippt hat). Er
     ist der Schiedsrichter: nur er weiss alles, nur er entscheidet
     Treffer oder daneben, und er sagt allen dasselbe Ergebnis. Damit
     sieht kein Mitspieler das Versteck eines anderen, auch nicht, wer
     ins eigene Geraet hineinschaut.

     Die Reihenfolge ist die Ankunft im Raum (spielReihe) — sie bleibt
     stehen, auch wenn mitten im Spiel jemand den Platz wechselt.
     ================================================================= */
  var schiffeSpiel = null;    /* nur beim Schiedsrichter: das ganze Wissen */
  var schiffeStand = null;    /* auf JEDEM Geraet: was gezeichnet wird */

  function schiffeZeichnen() {
    try { if (window.DMA_SCHIFFE) window.DMA_SCHIFFE(schiffeStand); } catch (e) {}
  }
  function schiffeAnAlle(d) { senden({ art: "spiel", spiel: d }); }
  function schiffeAnRichter(d) {
    if (!schiffeStand || !schiffeStand.richter) return false;
    if (schiffeStand.richter === zustand.ichId) { schiffeRichter(d, zustand.ichId, zustand.ichName); return true; }
    postSenden(schiffeStand.richter, { art: "spielpost", spiel: d });
    return true;
  }

  function schiffeStarten(roh) {
    var rest = String(roh || "").trim().toLowerCase();
    if (zustand.lage !== "drin") return systemZeile("Dafuer musst du erst im Raum sein.");
    if (/^(aus|stop|stopp|schluss|ende|fertig)$/.test(rest)) {
      schiffeSpiel = null;
      schiffeAnAlle({ t: "aus" });
      schiffeStand = null;
      schiffeZeichnen();
      return systemZeile("🚢 Schiffe versenken ist beendet.");
    }
    var reihe = spielReihe();
    if (reihe.length < 2) {
      return systemZeile("Schiffe versenken geht ab ZWEI Leuten im Raum — "
        + "gerade ist hier nur " + reihe.length + ".");
    }
    schiffeSpiel = {
      reihe: reihe.map(function (m) { return { id: m.id, name: m.name }; }),
      verstecke: {}, raus: {}, dran: 0
    };
    schiffeAnAlle({ t: "start", reihe: schiffeSpiel.reihe, plaetze: PLAETZE, richter: zustand.ichId });
    /* Der Schiedsrichter spielt mit — also baut auch sein Geraet das
       Brett auf, ueber denselben Weg wie bei allen anderen. */
    schiffeEmpfangen({ t: "start", reihe: schiffeSpiel.reihe, plaetze: PLAETZE,
                       richter: zustand.ichId }, zustand.ichId);
    anAlle("aktion", zustand.ichName + " startet Schiffe versenken — "
      + "jeder sucht sich ein Versteck  🚢");
    return true;
  }

  /* ---- DER SCHIEDSRICHTER ---- */
  function schiffeRichter(d, vonId, vonName) {
    if (!schiffeSpiel || !d) return;
    if (d.t === "versteck") {
      var nr = Number(d.nr) || 0;
      if (nr < 1 || nr > PLAETZE) return;
      /* Zwei duerfen nicht im selben Loch stecken. */
      var belegt = Object.keys(schiffeSpiel.verstecke).some(function (id) {
        return id !== vonId && schiffeSpiel.verstecke[id] === nr;
      });
      if (belegt) {
        if (vonId === zustand.ichId) systemZeile("Dort versteckt sich schon jemand — nimm ein anderes Feld.");
        else postSenden(vonId, { art: "spielpost", spiel: { t: "belegt", nr: nr } });
        return;
      }
      schiffeSpiel.verstecke[vonId] = nr;
      var fehlen = schiffeSpiel.reihe.filter(function (m) { return !schiffeSpiel.verstecke[m.id]; });
      schiffeAnAlle({ t: "wartet", fehlt: fehlen.length,
                      namen: fehlen.map(function (m) { return m.name; }).join(", ") });
      if (!fehlen.length) schiffeLos();
      return;
    }
    if (d.t === "schuss") {
      var dranM = schiffeSpiel.reihe[schiffeSpiel.dran % schiffeSpiel.reihe.length];
      if (!dranM || dranM.id !== vonId) return;          /* nicht dran — nichts passiert */
      schiffeSchuss(Number(d.nr) || 0, vonId, vonName || dranM.name);
    }
  }
  function schiffeLos() {
    if (!schiffeSpiel) return;
    schiffeSpiel.dran = 0;
    var m = schiffeSpiel.reihe[0];
    schiffeAnAlle({ t: "los", dran: m.id, dranName: m.name,
                    reihe: schiffeSpiel.reihe });
  }
  function schiffeWeiter() {
    var n = schiffeSpiel.reihe.length;
    for (var i = 1; i <= n; i++) {
      var m = schiffeSpiel.reihe[(schiffeSpiel.dran + i) % n];
      if (!schiffeSpiel.raus[m.id]) { schiffeSpiel.dran = (schiffeSpiel.dran + i) % n; return m; }
    }
    return null;
  }
  function schiffeSchuss(nr, vonId, vonName) {
    if (!schiffeSpiel || nr < 1 || nr > PLAETZE) return;
    var getroffenId = "", getroffenName = "";
    Object.keys(schiffeSpiel.verstecke).forEach(function (id) {
      if (id === vonId || schiffeSpiel.raus[id]) return;
      if (schiffeSpiel.verstecke[id] === nr) {
        getroffenId = id;
        var m = schiffeSpiel.reihe.find(function (x) { return x.id === id; });
        getroffenName = m ? m.name : "jemand";
      }
    });
    if (getroffenId) schiffeSpiel.raus[getroffenId] = true;
    var uebrig = schiffeSpiel.reihe.filter(function (m) { return !schiffeSpiel.raus[m.id]; });
    if (uebrig.length <= 1) {
      schiffeAnAlle({ t: "schuss", nr: nr, treffer: true, von: vonName, wen: getroffenName });
      schiffeAnAlle({ t: "ende", sieger: uebrig.length ? uebrig[0].name : vonName });
      schiffeSpiel = null;
      return;
    }
    var naechst = schiffeWeiter();
    schiffeAnAlle({ t: "schuss", nr: nr, treffer: Boolean(getroffenId), von: vonName,
                    wen: getroffenName, dran: naechst ? naechst.id : "",
                    dranName: naechst ? naechst.name : "" });
  }

  /* ---- AUF JEDEM GERAET ---- */
  function schiffeEmpfangen(d, vonId) {
    if (!d || !d.t) return;
    if (d.t === "start") {
      schiffeStand = { phase: "verstecken", richter: d.richter || vonId,
                       plaetze: Number(d.plaetze) || PLAETZE,
                       reihe: d.reihe || [], tafel: {}, meins: 0,
                       dran: "", dranName: "", raus: [], text: "",
                       ichBin: zustand.ichId };
      schiffeZeichnen();
      return;
    }
    if (!schiffeStand) return;
    if (d.t === "aus") { schiffeStand = null; schiffeZeichnen(); return; }
    if (d.t === "wartet") {
      schiffeStand.text = d.fehlt
        ? "Es fehlen noch " + d.fehlt + ": " + (d.namen || "")
        : "Alle sind versteckt.";
      schiffeZeichnen();
      return;
    }
    if (d.t === "los") {
      schiffeStand.phase = "schiessen";
      schiffeStand.reihe = d.reihe || schiffeStand.reihe;
      schiffeStand.dran = d.dran || "";
      schiffeStand.dranName = d.dranName || "";
      schiffeStand.text = "";
      schiffeZeichnen();
      return;
    }
    if (d.t === "schuss") {
      schiffeStand.tafel[d.nr] = d.treffer ? "treffer" : "daneben";
      schiffeStand.dran = d.dran || "";
      schiffeStand.dranName = d.dranName || "";
      if (d.treffer && d.wen) schiffeStand.raus.push(d.wen);
      schiffeStand.text = d.treffer
        ? (d.von + " trifft auf Platz " + d.nr + " — " + d.wen + " ist versenkt!")
        : (d.von + " schießt auf Platz " + d.nr + " — daneben.");
      /* Ist mein eigenes Versteck getroffen, steht es auch bei mir. */
      schiffeZeichnen();
      return;
    }
    if (d.t === "ende") {
      schiffeStand.phase = "aus";
      schiffeStand.text = "🏆 " + (d.sieger || "Niemand") + " gewinnt!";
      schiffeZeichnen();
      setTimeout(function () { schiffeStand = null; schiffeZeichnen(); }, 9000);
      return;
    }
    if (d.t === "belegt") {
      schiffeStand.text = "Dort versteckt sich schon jemand — nimm ein anderes Feld.";
      schiffeStand.meins = 0;
      schiffeZeichnen();
    }
  }

  /* Ein Tipp aufs Brett — dasselbe Feld bedeutet je nach Abschnitt
     etwas anderes: erst das eigene Versteck, dann der Schuss. */
  function schiffeWahl(nr) {
    nr = Number(nr) || 0;
    if (!schiffeStand || nr < 1) return false;
    if (schiffeStand.phase === "verstecken") {
      schiffeStand.meins = nr;
      schiffeStand.text = "Du versteckst dich auf Platz " + nr + ".";
      schiffeZeichnen();
      return schiffeAnRichter({ t: "versteck", nr: nr });
    }
    if (schiffeStand.phase === "schiessen") {
      if (schiffeStand.dran !== zustand.ichId) {
        schiffeStand.text = (schiffeStand.dranName || "Jemand anders") + " ist dran.";
        schiffeZeichnen();
        return false;
      }
      if (schiffeStand.tafel[nr]) {
        schiffeStand.text = "Auf Platz " + nr + " wurde schon geschossen.";
        schiffeZeichnen();
        return false;
      }
      return schiffeAnRichter({ t: "schuss", nr: nr });
    }
    return false;
  }

  function ratenStellen(roh) {
    var text = String(roh || "").trim();
    if (/^liste$/i.test(text)) {
      return systemZeile("🎡 Fertige Redewendungen — such dir eine aus:\n"
        + REDEWENDUNGEN.map(function (r, i) { return "  " + (i + 1) + ". " + r; }).join("\n")
        + "\nMit der Nummer starten:  /raten 7    Oder ohne alles:  /raten");
    }
    /* Nur eine Zahl? Dann ist die Nummer aus der Liste gemeint. */
    if (/^\d{1,2}$/.test(text)) {
      var nr = parseInt(text, 10);
      if (nr >= 1 && nr <= REDEWENDUNGEN.length) text = REDEWENDUNGEN[nr - 1];
      else return systemZeile("Die Liste hat " + REDEWENDUNGEN.length
        + " Redewendungen.  /raten liste  zeigt sie.");
    }
    if (!text) {
      if (offeneAufgabe && offeneAufgabe.typ === "raten") {
        var altLoesung = offeneAufgabe.loesung;
        offeneAufgabe = null;
        aufgabeMerken();
        senden({ art: "aufgabeAus" });
        return systemZeile("✔️ Das Aufdecken ist beendet. Gesucht war: „" + altLoesung + "\u201c");
      }
      /* Ohne Text: eine Redewendung aus der Liste, zufaellig. */
      text = REDEWENDUNGEN[Math.floor(Math.random() * REDEWENDUNGEN.length)];
    }
    if (text.length > 90) return systemZeile("Das ist zu lang — höchstens 90 Zeichen, sonst passt das Rad nicht in die Zeile.");
    var buchstaben = (text.match(/\p{L}/gu) || []).length;
    if (buchstaben < 4) return systemZeile("Das sind zu wenige Buchstaben zum Raten.");

    offeneAufgabe = { typ: "raten", loesung: text, frage: "Aufdecken", wer: {},
                      zeit: Date.now(), zeileId: "", vonMir: true,
                      dran: naechsterDran(zustand.ichId) };
    /* DIE LOESUNG FAEHRT HIER MIT — und das ist Absicht, kein
       Versehen. Anders als bei der Betonung kann kein Geraet den
       Satz nachschlagen: er ist frei erfunden. Wer einen Buchstaben
       antippt, muss aber sehen, WO er steht — dafuer braucht das
       Geraet den Satz. Er wird nur nie im Klartext gezeichnet.
       Wer ins Geraet hineinsieht, findet ihn; fuer ein Ratespiel
       im Unterricht ist das der richtige Preis. Im sichtbaren Text
       der Zeile steht er nicht. */
    var zeile = anAlle("aufgabe", "\ud83d\udd21 Aufdecken \u2014 welcher Satz ist das?",
      { raten: text, dran: offeneAufgabe.dran });
    if (zeile && zeile.id) {
      offeneAufgabe.zeileId = zeile.id;
      zeile.aufgabeId = zeile.id;
    }
    aufgabeMerken();
    aufgabeVerkuenden();
    return true;
  }

  function betonungStellen(roh) {
    var text = String(roh || "").trim();
    if (!text) {
      if (offeneAufgabe && offeneAufgabe.typ === "betonung") {
        offeneAufgabe = null;
        aufgabeMerken();
        senden({ art: "aufgabeAus" });
        return systemZeile("✔️ Die Betonungsübung ist beendet.");
      }
      return systemZeile("So geht es:  /betonung Fahrrad"
        + "\noder ein ganzer Satz:  /betonung Der Hund läuft über die Wiese"
        + "\nDie anderen tippen dann die betonte Silbe an. /betonung ohne Text beendet sie.");
    }
    if (text.length > 160) return systemZeile("Das ist zu lang — höchstens 160 Zeichen.");
    var woerter = text.split(/\s+/).filter(Boolean);
    if (woerter.length > 12) return systemZeile("Das sind zu viele Wörter — höchstens zwölf.");

    offeneAufgabe = { typ: "betonung", loesung: text, frage: text, teile: woerter,
                      wer: {}, zeit: Date.now(), zeileId: "" };
    var zeile = anAlle("aufgabe", "🔠 Wo liegt die Betonung?  " + text, { betonung: text });
    if (zeile && zeile.id) {
      offeneAufgabe.zeileId = zeile.id;
      zeile.aufgabeId = zeile.id;
    }
    aufgabeMerken();
    aufgabeVerkuenden();
    return true;
  }

  /* =================================================================
     EINE AUFGABE GEHOERT DEM RAUM, NICHT DEM GERAET
     -----------------------------------------------------------------
     GEMELDET, immer wieder: „Die Benotung wird immer noch nicht
     angezeigt." Hier ist die zweite Ursache, und sie ist so still wie
     die erste:

     Die offene Aufgabe lag NUR auf dem Geraet, das  /aufgabe
     getippt hat. An alle anderen ging bloss eine Chatzeile — schoen
     zu lesen, aber ohne jede Wirkung. Wer die Aufgabe auf dem Telefon
     stellt und spaeter am Rechner die Antworten durchsieht, hat dort
     GAR KEINE offene Aufgabe, und damit an keiner einzigen Zeile
     einen Notenknopf. Von aussen sieht das genauso aus wie ein
     kaputter Knopf.

     Jetzt reist sie mit: Wer eine Aufgabe stellt, sagt es allen im
     Raum; wer neu hereinkommt, bekommt sie nachgereicht.

     EINS WIRD DABEI ABSICHTLICH NICHT MITGESCHICKT: die Loesung.
     Bei einem Wort- oder Satzpuzzle stuende sie sonst auf jedem
     Geraet im Raum, und wer nachsieht, hat die Aufgabe geloest, ohne
     sie zu loesen. Auf den anderen Geraeten steht deshalb nur, DASS
     eine Aufgabe laeuft und wie sie heisst. Der Notenknopf braucht
     die Loesung nicht — er braucht nur zu wissen, dass eine Aufgabe
     offen ist. Das automatische „richtig!" bleibt auf dem Geraet, das
     die Aufgabe gestellt hat; das ist der ehrliche Preis dafuer, dass
     niemand spicken kann.
     ================================================================= */
  /* =================================================================
     WARUM HIER KEIN „ANTWORTEN"-KNOPF MEHR STEHT
     -----------------------------------------------------------------
     Es gab ihn kurz (v315), und er war falsch. GEMELDET: „Das ,Darauf
     antworten' soll dort nicht stehen. Es soll logisch sein in dem
     Moment, wo man das abschickt — das musst du in der Klasse regeln
     und nicht die Leute auf den Knopf drücken lassen."

     Er hat recht. Ein Kind, das eine Aufgabe löst, soll schreiben und
     abschicken — und nicht vorher noch etwas anklicken müssen, das es
     vergessen kann. Die Zuordnung gehört ins Programm, nicht in die
     Hand der Lernenden.

     Sie sitzt jetzt in schreiben(): Steht eine Aufgabe offen, trägt
     jede abgeschickte Nachricht ihre Kennung mit sich. Dort ist auch
     der ganze Grund dafür aufgeschrieben.
     ================================================================= */

  function aufgabeVerkuenden(anId) {
    if (!offeneAufgabe) return;
    var paket = {
      art: "aufgabeAn",
      typ: offeneAufgabe.typ,
      dran: offeneAufgabe.dran || "",
      frage: offeneAufgabe.frage || "",
      /* Die Kennung der Aufgabenzeile reist mit — daran erkennt jedes
         Geraet spaeter, welche Antwort zu welcher Frage gehoert. */
      zeileId: offeneAufgabe.zeileId || "",
      /* DIE TEILE MUESSEN MIT.
         GEMELDET: „Das wird aber bei anderen nicht angezeigt — die
         koennen irgendwie auf Loesung klicken, aber es wird bei denen
         nicht angezeigt, was das ist."

         Genau daran lag es: die Ansage trug nur Art und Frage. Die
         gemischten Woerter (beim Satzpuzzle) beziehungsweise
         Buchstaben (beim Wortpuzzle) blieben auf dem Geraet dessen
         liegen, der die Aufgabe gestellt hat. Alle anderen bekamen
         also eine Aufgabe ohne Teile — und damit nichts zum
         Antippen. Sie reisen jetzt mit, in derselben Mischung fuer
         alle: sonst haette jeder eine andere Reihenfolge vor sich. */
      teile: (offeneAufgabe.teileGemischt || []).slice(0, 24),
      zeit: offeneAufgabe.zeit || Date.now()
    };
    if (anId) paket.an = anId;
    senden(paket);
  }

  /* EINE AUFGABE UEBERLEBT DAS NEULADEN.
     -----------------------------------------------------------
     Sie lag nur im Arbeitsspeicher. Wer die Seite aktualisiert hat —
     und das passiert im Unterricht staendig —, hatte danach keine
     offene Aufgabe mehr; damit war keine Antwort mehr eine Antwort,
     und der Notenknopf blieb weg. Genau das war gemeldet. Jetzt liegt
     sie im Geraet, beim Raum, und kommt beim Betreten zurueck. */
  function aufgabeSchluessel(raum) { return "dma_lc_aufgabe_" + (raum || "-"); }
  /* =========================================================
     DIE REGEL: WOFUER WIRD EIGENTLICH BENOTET?
     ---------------------------------------------------------
     GEWUENSCHT: „Leg gleich auch einmal eine Klasse fest fuer
     diese Art von Spiel. Wenn ich einen Satz schreibe und die
     Woerter in dem Satz durcheinander sind, dann gib als
     Vorauswahl, wofuer ich die Note gebe. Ist das Satzbau oder
     ist das Grammatik? Wie nennt man das dann?"

     Es heisst SATZBAU. Fachlich genauer: Wortstellung, und die
     gehoert zur Syntax. „Grammatik" ist der Oberbegriff, unter
     den auch Faelle, Zeiten und Endungen fallen — wer nur die
     Reihenfolge der Woerter sortiert, uebt davon genau einen
     Teil. Deshalb ist Satzbau die richtige Antwort und nicht
     Grammatik: Grammatik waere nicht falsch, aber zu grob, und
     eine Note soll ja sagen, WORIN jemand gut war.

     Dieselbe Ueberlegung fuer das Wortpuzzle: Dort stehen die
     BUCHSTABEN eines Wortes durcheinander. Wer sie ordnet, uebt
     die Schreibung des Wortes — also Rechtschreibung.

     Diese Zuordnung ist eine REGEL und steht deshalb an einer
     Stelle, nicht verstreut in der Oberflaeche.
     ========================================================= */
  var NOTEN_KLASSEN = [
    { wert: "Satzbau",        was: "Wortstellung — welches Wort steht wo im Satz" },
    { wert: "Grammatik",      was: "Formen: Faelle, Zeiten, Endungen" },
    { wert: "Wortschatz",     was: "das richtige Wort kennen und benutzen" },
    { wert: "Rechtschreibung", was: "wie ein Wort geschrieben wird" },
    { wert: "Aussprache",     was: "wie es klingt" },
    { wert: "Verstehen",      was: "hat die Frage getroffen" }
  ];

  /* Welche Klasse schlaegt die Seite vor? Das haengt an der Art
     der Aufgabe — und nur daran, damit es nachvollziehbar
     bleibt. Bei einer Aufgabe in eigenen Worten schlaegt sie
     nichts vor: dort weiss nur der Lehrer, worum es ging. */
  var KLASSE_JE_AUFGABE = { satz: "Satzbau", wort: "Rechtschreibung",
                            betonung: "Aussprache", frei: "" };
  function aufgabeKlasse(typ) {
    return KLASSE_JE_AUFGABE[String(typ || "")] || "";
  }

  /* Eine Aufgabe bleibt drei Tage stehen. Zwoelf Stunden waren zu
     knapp: GEMELDET wurde genau dieser Fall — „wir haben die Frage
     vor einer Stunde gestellt, und sie scrollt immer wieder hoch
     und beantwortet die alte Frage". Wer am Abend eine Aufgabe
     stellt und am naechsten Nachmittag die Antworten durchsieht,
     soll sie noch benoten koennen. Beendet wird sie ohnehin von
     Hand, mit  /aufgabe  ohne Text. */
  var AUFGABE_FRIST = 3 * 24 * 60 * 60 * 1000;
  function aufgabeMerken() {
    try {
      if (offeneAufgabe) {
        localStorage.setItem(aufgabeSchluessel(zustand.raum), JSON.stringify(offeneAufgabe));
      } else {
        localStorage.removeItem(aufgabeSchluessel(zustand.raum));
      }
    } catch (e) {}
  }
  function aufgabeZurueckholen(raum) {
    offeneAufgabe = null;
    try {
      var roh = localStorage.getItem(aufgabeSchluessel(raum));
      if (!roh) return;
      var a = JSON.parse(roh);
      if (!a || !a.typ) return;
      if (Date.now() - (a.zeit || 0) > AUFGABE_FRIST) {
        try { localStorage.removeItem(aufgabeSchluessel(raum)); } catch (e2) {}
        return;
      }
      a.wer = a.wer || {};
      offeneAufgabe = a;
    } catch (e) { offeneAufgabe = null; }
  }

  /* Die Antworten. Nur der, der die Aufgabe gestellt hat, prueft —
     und er prueft jede Person nur einmal, damit nicht jemand die
     richtige Antwort abschreibt, die schon im Chat steht. */
  /* War das ueberhaupt eine Antwort auf eine Aufgabe?
     GEWUENSCHT: „Bei normalen Nachrichten soll dieses Zensieren
     nicht dabeistehen. Das ist nur, wenn Aufgaben geloest werden,
     die ich schicke." — Also muss man es unterscheiden koennen, und
     zwar an der Nachricht selbst. Diese Auskunft haengt der Zeile
     ihre Marke an: „versuch" (geantwortet) und „richtig".
     Gezaehlt wird als Versuch nur, wer noch nicht geloest hat — wer
     fertig ist, plaudert wieder ganz normal. */
  /* SIEHT DAS UEBERHAUPT NACH EINER ANTWORT AUS?
     -----------------------------------------------------------
     GEWUENSCHT: „Die Benotung soll bei der relevanten Antwort zu der
     geloesten Aufgabe stehen, die mit der Aufgabe verbunden ist —
     nicht bei jeder Zeile."

     Bisher galt: solange eine Aufgabe offen ist, ist JEDE Zeile eines
     anderen eine Antwort. Damit bekam auch „hallo" oder „einen
     Moment" den Notenknopf, und genau das war zu viel.

     Eine Antwort auf ein Puzzle besteht aus denselben Teilen wie die
     Loesung — nur in anderer Reihenfolge. Genau daran laesst es sich
     erkennen, ohne zu raten:
       * beim Satz: mindestens zwei Drittel der Woerter der Loesung
         kommen vor, und die Zeile ist nicht viel kuerzer;
       * beim Wort: es ist EIN Wort aus ungefaehr denselben
         Buchstaben.
     Wer die Loesung richtig hat, gilt ohnehin immer als Antwort. */
  function wortMenge(text) {
    return String(text || "").toLowerCase().replace(/[.!?,;:„“"'()]/g, " ")
      .split(/\s+/).filter(function (w) { return w; });
  }
  function siehtNachVersuchAus(text, aufgabe) {
    var loesung = String(aufgabe.loesung || "");
    if (!loesung) return false;
    /* Beim Artikel ist jede der drei Moeglichkeiten ein Versuch — das
       steht schon in aufgabeVersuch. Beim gesuchten Wort ist eine
       kurze Zeile (ein, zwei Woerter) ein Versuch; alles Laengere ist
       Geplauder und bekommt keinen Notenknopf. */
    if (aufgabe.typ === "artikel") return /^\s*(der|die|das)\b/i.test(String(text || ""));
    if (aufgabe.typ === "begriff") {
      var w = String(text || "").trim().split(/\s+/);
      return w.length > 0 && w.length <= 3 && w[0].length > 1;
    }
    if (aufgabe.typ === "wort") {
      var geschrieben = wortMenge(text);
      if (geschrieben.length !== 1) return false;
      var a = geschrieben[0].split("").sort().join("");
      var b = loesung.toLowerCase().replace(/\s+/g, "").split("").sort().join("");
      if (Math.abs(a.length - b.length) > 2) return false;
      /* Wie viele Buchstaben haben beide gemeinsam? */
      var rest = b.split(""), gleich = 0;
      a.split("").forEach(function (z) {
        var i = rest.indexOf(z);
        if (i >= 0) { rest.splice(i, 1); gleich += 1; }
      });
      return gleich >= Math.ceil(b.length * 0.7);
    }
    /* Satz */
    var soll = wortMenge(loesung);
    var ist = wortMenge(text);
    if (!soll.length || !ist.length) return false;
    if (ist.length < Math.ceil(soll.length * 0.6)) return false;
    var uebrig = ist.slice(), treffer = 0;
    soll.forEach(function (w) {
      var i = uebrig.indexOf(w);
      if (i >= 0) { uebrig.splice(i, 1); treffer += 1; }
    });
    return treffer >= Math.ceil(soll.length * 0.66);
  }

  function aufgabeVersuch(von, text) {
    if (!offeneAufgabe || !von) return null;
    /* Beim Aufdecken laeuft die Runde weiter, sobald jemand geraten
       hat — und zwar nur auf dem Geraet, das die Aufgabe gestellt
       hat. Von dort geht ein Ruf an alle. */
    var rundeWeiter = function () {
      if (offeneAufgabe && offeneAufgabe.typ === "raten" && offeneAufgabe.vonMir) {
        try { dranSetzen(naechsterDran(von)); } catch (e) {}
      }
    };
    /* Eine Aufgabe in eigenen Worten hat keine Musterloesung. Dort ist
       die ERSTE Zeile nach der Aufgabe die Antwort — danach plaudert
       die Person wieder ganz normal, und es steht nicht an jeder
       weiteren Zeile ein Notenknopf. */
    if (offeneAufgabe.typ === "frei") {
      if (offeneAufgabe.wer[von]) return null;
      offeneAufgabe.wer[von] = true;
      aufgabeMerken();
      return { versuch: true, richtig: false, frei: true,
               frage: offeneAufgabe.frage || "" };
    }
    /* Beim Artikel zaehlt das erste Wort: „das" ist richtig, „das
       Fahrrad" auch — beides ist dieselbe Antwort, und die zweite
       waere sogar die schoenere. */
    if (offeneAufgabe.typ === "raten") rundeWeiter();
    if (offeneAufgabe.typ === "artikel") {
      var erstes = String(text || "").trim().split(/\s+/)[0] || "";
      if (aufgabeGleich(erstes, offeneAufgabe.loesung)) {
        return { versuch: true, richtig: true, frage: offeneAufgabe.loesung };
      }
      /* Drei Moeglichkeiten, eine davon ist getippt worden: das ist
         immer ein Versuch, auch wenn er falsch ist. */
      if (/^(der|die|das)$/i.test(erstes)) {
        return { versuch: true, richtig: false, frage: offeneAufgabe.loesung };
      }
    }
    if (aufgabeGleich(text, offeneAufgabe.loesung)) {
      return { versuch: true, richtig: true, frage: offeneAufgabe.loesung };
    }
    /* Ein Satz, der mit der Aufgabe nichts zu tun hat, ist keine
       Antwort — auch nicht, solange die Aufgabe offen steht. */
    if (!siehtNachVersuchAus(text, offeneAufgabe)) return null;
    return { versuch: true, richtig: false, frage: offeneAufgabe.loesung };
  }

  /* GEHOERT DIESE ZEILE ZUR OFFENEN AUFGABE?
     -----------------------------------------------------------
     GEMELDET, zum wiederholten Mal: „Die Benotung steht immer noch
     nicht nach der Antwort, die mit einem Spiel zusammenhaengt. Da
     steht immer noch nicht der Knopf Note dabei."

     Ich hatte das bisher NUR im Augenblick des Eintreffens
     entschieden (siehe aufgabeVersuch) und das Ergebnis an die
     Nachricht geheftet. Das haelt aber nur, solange die Seite steht:
     nach einem Neuladen kommen die Zeilen aus dem Geraet und vom
     Server zurueck — und dort steht diese Marke nicht. Dann war jede
     Antwort wieder eine gewoehnliche Zeile, ohne Knopf. Genau das
     hat er gesehen.

     Deshalb laesst sich die Frage jetzt auch beim ZEICHNEN stellen:
     gehoert diese Zeile zu der Aufgabe, die gerade offen ist? Das ist
     eine reine Rechnung ohne Nebenwirkung — Zeitpunkt, Absender,
     Wortlaut. Bei einer Aufgabe in eigenen Worten geht das nicht
     (dort gibt es nichts zu vergleichen); da bleibt es bei der Marke
     vom Eintreffen. */
  /* IST DAS DIE ERSTE ZEILE, DIE DIESE PERSON NACH DER AUFGABE
     GESCHRIEBEN HAT?
     -----------------------------------------------------------
     Diese Frage laesst sich aus dem Verlauf beantworten, den die
     Seite ohnehin mitfuehrt — und zwar JEDERZEIT, auch nach einem
     Neuladen. Genau das ist der Unterschied zu einer Marke, die beim
     Eintreffen gesetzt wird: die ist nach dem naechsten Laden weg.

     Befehle zaehlen nicht (wer „/konfetti" schreibt, beantwortet
     nichts), und die Aufgabenzeile selbst zaehlt auch nicht. */
  function ersteZeileNachAufgabe(n) {
    var ab = (offeneAufgabe.zeit || 0) - 1000;
    var liste = zustand.nachrichten || [];
    var frueheste = null;
    for (var i = 0; i < liste.length; i++) {
      var m = liste[i];
      if (!m || m.von !== n.von) continue;
      if ((m.zeit || 0) < ab) continue;
      var a = m.art || "text";
      if (a !== "text" && a !== "aktion") continue;
      var t = String(m.text || "").trim();
      if (!t || t.charAt(0) === "/") continue;
      if (!frueheste || (m.zeit || 0) < (frueheste.zeit || 0)) frueheste = m;
    }
    /* Kennt der Verlauf die Zeile noch gar nicht (sie wird gerade erst
       gezeichnet), dann ist sie es. Lieber ein Notenknopf zu viel als
       einer zu wenig — er tut ja nichts von allein. */
    if (!frueheste) return true;
    if (String(frueheste.id || "") && String(frueheste.id) === String(n.id || "")) return true;
    return (frueheste.zeit || 0) === (n.zeit || 0)
        && String(frueheste.text || "") === String(n.text || "");
  }

  function aufgabeBezug(n) {
    if (!n || n.eigen || !n.von) return null;
    /* =========================================================
       HAT DIE ANTWORT SELBST GESAGT, WOZU SIE GEHOERT?
       ---------------------------------------------------------
       Dann ist die Frage beantwortet, und zwar endgueltig: keine
       Uhrzeit, keine Reihenfolge, keine Aehnlichkeit. Das gilt auch
       dann noch, wenn die Aufgabe laengst beendet ist — eine Antwort
       von gestern gehoert immer noch zu ihrer Frage, und benoten darf
       man sie auch noch.
       ========================================================= */
    if (n.aufgabeId) {
      return { versuch: true, richtig: false, sicher: true,
               klasse: n.aufgabeKlasse
                 || (offeneAufgabe && offeneAufgabe.zeileId === n.aufgabeId
                      ? aufgabeKlasse(offeneAufgabe.typ) : ""),
               frage: n.aufgabeFrage
                 || (offeneAufgabe && offeneAufgabe.zeileId === n.aufgabeId
                      ? (offeneAufgabe.frage || offeneAufgabe.loesung) : "") };
    }
    if (!offeneAufgabe) return null;
    if ((n.zeit || 0) < (offeneAufgabe.zeit || 0) - 1000) return null;
    var art = n.art || "text";
    if (art !== "text" && art !== "aktion") return null;
    /* EINE ANIMATION IST KEINE ANTWORT.
       GEMELDET: „Bei UFO und Spaceship steht ploetzlich Benotung
       dran, als ob ich mir selbst eine Note geben koennte. Das ist
       aber kein Spiel, das sind einfach nur diese Videos, die ich
       sende."
       Er hat recht, und die Ursache sass hier: Geschenke und Effekte
       reisen als „aktion" — genau wie eine Antwort in eigenen Worten,
       die jemand als Aktion formuliert. Also galt „Alex schickt allen
       ein U-Boot" als Loesungsversuch, sobald eine Aufgabe offen war.
       Eine Zeile, die eine WIRKUNG oder einen FILM traegt, ist nie
       eine Antwort — daran laesst es sich sicher unterscheiden. */
    if (n.wirkung || n.film) return null;
    var text = String(n.text || "").trim();
    if (!text || text.charAt(0) === "/") return null;

    /* =========================================================
       EINE AUFGABE IN EIGENEN WORTEN BEKOMMT JETZT AUCH EINEN
       NOTENKNOPF
       ---------------------------------------------------------
       GEMELDET, zum dritten Mal: „Ich kann, wenn sie eine Aufgabe
       loest, immer noch nicht diesen Note-Button sehen, um sie zu
       benoten. Das Ding muss erkennen, dass sie von der Aufgabe
       kommt mit ihrer Antwort."

       HIER stand der Grund, in einer einzigen Zeile:
           if (offeneAufgabe.typ === "frei") return null;
       Ausgerechnet die Aufgabe OHNE Musterloesung — also die, bei
       der nur der Lehrer urteilen kann — war vom Notenknopf
       ausgeschlossen. Sie bekam ihn nur im Augenblick des
       Eintreffens (aufgabeVersuch setzt dort eine Marke an die
       Nachricht); nach dem naechsten Neuladen kam die Zeile aus dem
       Geraet oder vom Server zurueck, ohne Marke, ohne Knopf.

       Jetzt wird auch das beim ZEICHNEN entschieden, aus dem
       Verlauf: die erste Zeile, die diese Person nach der Aufgabe
       geschrieben hat, ist ihre Antwort.
       ========================================================= */
    /* =========================================================
       EINE SPAETE ANTWORT IST AUCH EINE ANTWORT
       ---------------------------------------------------------
       GEMELDET, und diesmal mit dem entscheidenden Hinweis:
       „Wir haben die Frage vor einer Stunde gestellt, und sie
       scrollt immer wieder hoch und beantwortet diese alte Frage.
       Aber der Notenknopf steht immer noch nicht dabei. Schau
       mal, ob es bei veralteten Fragen auch noch geht oder ob es
       da irgendeine Zeit-Klasse gibt."

       Es gab sie, und sie war meine: ersteZeileNachAufgabe(). Ich
       hatte gesagt „die ERSTE Zeile nach der Aufgabe ist die
       Antwort" — das klang sauber und war in dem einen Fall
       falsch, der bei ihm staendig vorkommt. Emmi schreibt nach
       der Aufgabe noch etwas anderes („Moment", „bin gleich da"),
       und eine Stunde spaeter scrollt sie hoch und loest sie
       wirklich. Ihre echte Antwort war dann ihre fuenfte Zeile —
       und bekam nach meiner Regel keinen Knopf.

       Die Regel gilt deshalb nicht mehr. Solange eine Aufgabe
       OFFEN steht, ist jede Zeile einer anderen Person danach
       benotbar — egal wie spaet, egal die wievielte. Das ist
       weiterhin nicht „global": ohne offene Aufgabe gibt es
       keinen einzigen Knopf, Befehle zaehlen nicht, und die
       eigenen Zeilen auch nicht.

       „erste" bleibt nur noch als HINWEIS erhalten (spaet: true) —
       damit die Oberflaeche sagen kann, dass es eine nachgereichte
       Antwort ist. Entscheiden tut es nichts mehr.
       ========================================================= */
    var zuerst = ersteZeileNachAufgabe(n);

    /* NUR NOCH DAS SICHERE. Was die Nachricht selbst mitbringt, ist
       oben schon entschieden (aufgabeId). Hier bleibt das, was sich
       wirklich PRUEFEN laesst: ein Wort- oder Satzpuzzle hat eine
       Musterloesung, mit der sich vergleichen laesst.

       Bei einer Aufgabe in eigenen Worten gibt es nichts zu
       vergleichen — und darum wird hier auch nicht mehr geraten. Wer
       darauf antworten will, tippt die Aufgabenzeile an; dann weiss
       die Seite es, statt es zu vermuten. */
    if (offeneAufgabe.typ === "frei") return null;
    if (!offeneAufgabe.loesung) return null;

    if (aufgabeGleich(text, offeneAufgabe.loesung)) {
      return { versuch: true, richtig: true, spaet: !zuerst,
               klasse: aufgabeKlasse(offeneAufgabe.typ),
               frage: offeneAufgabe.loesung };
    }
    if (siehtNachVersuchAus(text, offeneAufgabe)) {
      return { versuch: true, richtig: false, spaet: !zuerst,
               klasse: aufgabeKlasse(offeneAufgabe.typ),
               frage: offeneAufgabe.loesung };
    }
    return null;
    /* Und selbst wenn die Antwort mit der Musterloesung nichts
       gemeinsam hat: Es war die erste Zeile nach der Aufgabe, also
       GEHOERT sie zur Frage — und genau darum ging es ihm („damit
       ich weiss, diese Antwort gehoert zu der Frage, die sie
       beantwortet hat"). Eine falsche Antwort ist eine Antwort und
       darf benotet werden.
       Angesagt wird sie deshalb nicht — das entscheidet weiterhin
       aufgabeAntwort, sonst hiesse es bei jedem „hallo“ „noch nicht
       richtig“. */
  }

  /* Welche Aufgabe steht gerade offen? Die Oberflaeche schreibt sie
     an den Notenknopf, damit beim Benoten sichtbar ist, ZU WELCHER
     FRAGE die Antwort gehoert. */
  function offeneAufgabeInfo() {
    if (!offeneAufgabe) return null;
    return {
      typ: offeneAufgabe.typ,
      frage: offeneAufgabe.frage || offeneAufgabe.loesung || "",
      klasse: aufgabeKlasse(offeneAufgabe.typ),
      zeit: offeneAufgabe.zeit || 0,
      /* DIE TEILE ZUM ANTIPPEN.
         GEMELDET: „Die Aufgabe hat keine Funktion. Man schreibt einen
         ganzen Satz, und der ganze Satz ist eingerahmt, und es hat
         ueberhaupt keine Funktion — man kann nur den Satz anklicken,
         und das ist quasi die Loesung. Was soll das fuer eine Aufgabe
         sein?"

         Voellig zu Recht: die Oberflaeche bekam bisher nur den Satz
         und hat ihn hingeschrieben. Die EINZELTEILE — beim Satzpuzzle
         die Woerter, beim Wortpuzzle die Buchstaben — blieben hier
         liegen. Jetzt reisen sie mit, gemischt, damit man sie
         antippen und in die richtige Reihenfolge bringen kann.

         Gemischt wird EINMAL beim Stellen der Aufgabe, nicht bei
         jedem Zeichnen: sonst sortierte sich die Aufgabe bei jedem
         Auffrischen des Raums neu, und man faengt ewig von vorn an. */
      teile: (offeneAufgabe.teileGemischt || []).slice()
    };
  }

  function aufgabeAntwort(von, name, text) {
    if (!offeneAufgabe || !von) return;
    /* Ohne Musterloesung gibt es nichts zu verkuenden — das Urteil
       faellt der Lehrer mit der Note. */
    if (offeneAufgabe.typ === "frei") return;
    /* NOCH EINMAL LOESEN DARF MAN.
       GEMELDET: „Wenn Emmy die alte Aufgabe aus dem Verlauf noch mal
       loest, kommt sie nicht an."
       Hier stand  if (offeneAufgabe.wer[von]) return;  — wer die
       Aufgabe einmal geloest hatte, dessen naechste Antwort wurde
       stillschweigend verschluckt: keine Zeile, kein Notenknopf,
       nichts. Gemeint war damit nur, dass es die Punkte nicht zweimal
       geben soll. Genau das bleibt — angesagt wird es trotzdem. */
    var schonGeloest = Boolean(offeneAufgabe.wer[von]);
    /* Nur eine ECHTE Antwort wird vermeldet. Frueher rief das Programm
       bei jeder Zeile „noch nicht richtig!" — auch bei „hallo". */
    if (!aufgabeGleich(text, offeneAufgabe.loesung) && !siehtNachVersuchAus(text, offeneAufgabe)) return;
    if (!aufgabeGleich(text, offeneAufgabe.loesung)) {
      /* GEWUENSCHT: „Wenn derjenige ein Wort loest oder einen Satz
         und das noch nicht richtig ist, soll das als Loesung kommen
         und nicht einfach nur als geschriebenes Wort."
         Die Loesung selbst wird dabei NICHT verraten — sonst waere
         die Aufgabe fuer alle anderen vorbei. */
      anAlle("system", "\u270b " + name + " hat geantwortet: \u201e" + String(text).slice(0, 60)
        + "\u201c \u2014 noch nicht richtig. Weiterprobieren!");
      return;
    }
    if (schonGeloest) {
      anAlle("system", "\u2705 " + name + " hat es noch einmal gel\u00f6st \u2014 richtig! "
        + "(Die Punkte daf\u00fcr gab es schon.)");
      return;
    }
    offeneAufgabe.wer[von] = true;
    aufgabeMerken();
    var punkte = AUFGABE_PUNKTE[offeneAufgabe.typ] || 4;
    var wievielte = Object.keys(offeneAufgabe.wer).length;
    anAlle("system", "✅ " + name + " hat es richtig: „" + offeneAufgabe.loesung + "“ — "
      + punkte + " Punkte" + (wievielte === 1 ? " und als Erste:r dran." : "."));
    /* Punkte bucht jeder auf SEINEM Geraet fuer SICH selbst — ein
       fremdes Konto kann von hier aus niemand anfassen, und das ist
       auch gut so. Die Nachricht sagt nur: das war richtig. */
    postSenden(von, { art: "punkte", wieviel: punkte, raum: zustand.raum,
                      grund: (offeneAufgabe.typ === "satz" ? "Satzpuzzle" : "Wortpuzzle")
                             + " im Klassenzimmer" });
  }

  /* =========================================================
     SICH MELDEN — wie frueher, als man die Hand heben musste
     ---------------------------------------------------------
     GEWUENSCHT: „Die Leute sollen sich melden, die was sagen
     wollen. Das gab ja frueher auch, dieses Handheben — heutzutage
     hebt man die Hand, wenn jemand hoch will, aber frueher war das,
     um zu sprechen. Und dann machen wir einfach nicht das
     Handheben, sondern das Melden."

     Zwei Wege, eine Warteschlange:

       MELDEN   — man haelt den Knopf, sagt seinen Satz, laesst los.
                  Das ist der Normalfall im Unterricht.

       DAUERND  — Haekchen an, dann ist das Mikrofon offen und
                  alles, was als Stimme erkannt wird, geht in
                  dieselbe Reihe. Fuer Gespraeche ohne Lehrer.

     In beiden Faellen gilt: der Naechste wird erst gehoert, wenn
     der Vorige zu Ende gesprochen hat. Niemand redet in jemanden
     hinein.

     UND WENN JEMAND STOERT
     „Dann hat der Moderator die Moeglichkeit, seine Sprachausgabe
     stumm zu schalten, dass das nicht mehr gesendet wird fuer die
     anderen — so lange, bis er sich wieder benimmt, und dann muss
     er im Chat schreiben, dass man mit ihm jetzt reden kann."

     Genau so: /stumm nimmt die STIMME, nicht die Tastatur. Wer
     stumm ist, kann weiter mitlesen und schreiben — und sich damit
     auch entschuldigen. Das ist der Unterschied zum Knebel, der
     das Schreiben nimmt.
     ========================================================= */
  var stummVon = {};          // wer hat MICH stummgeschaltet

  function binStumm() {
    return Object.keys(stummVon).some(function (k) { return stummVon[k]; });
  }
  /* Die Hand heben — eine Zeile im Chat, die jeder sieht, und ein
     Merker, damit der Lehrer die Reihenfolge kennt.
     (Nicht „melden" nennen: so heisst schon die Funktion, die der
     Oberflaeche sagt, dass sich etwas geaendert hat. Waere mir das
     nicht gleich aufgefallen, haette ich die halbe Anzeige
     ueberschrieben.) */
  function handHeben() {
    if (zustand.lage !== "drin") return false;
    senden({ art: "hand", zeit: Date.now(), name: zustand.ichName });
    zustand.gemeldet[zustand.ichId] = Date.now();
    anAlle("system", zustand.ichName + " meldet sich.");
    return true;
  }
  function handRunter() {
    delete zustand.gemeldet[zustand.ichId];
    senden({ art: "handweg" });
    return true;
  }
  /* Wer hat sich gemeldet, in der Reihenfolge der Meldungen? */
  function meldungen() {
    return Object.keys(zustand.gemeldet)
      .map(function (id) {
        var p = zustand.leute[id];
        return { id: id, name: (p && p.name) || (id === zustand.ichId ? zustand.ichName : "Jemand"),
                 seit: zustand.gemeldet[id] };
      })
      .sort(function (a, b) { return a.seit - b.seit; });
  }

  /* =========================================================
     DER PSEUDO-LIVESTREAM — einer nach dem anderen
     ---------------------------------------------------------
     GEWUENSCHT: „Wenn viele zur selben Zeit gleichzeitig was sagen,
     sollen die Nachrichten trotzdem nacheinander abgespielt werden
     und nicht gleichzeitig. Also in der Reihenfolge, wie sie
     ankommen … und so haben wir auch die Chance, dass niemand mehr
     in sich reinreden kann."

     Genau das ist das alte Prinzip mit dem Handheben, nur ohne
     Hand: wer zuerst fertig gesprochen hat, wird zuerst gehoert.
     Dass man den anderen eine halbe Minute spaeter hoert, faellt
     nicht auf — man sieht ja keine Lippen dazu.

     Die Warteschlange liegt HIER, das Abspielen macht app.js (dort
     liegt der freigeschaltete Tonvorrat, ohne den ein frisches
     Audio-Element nicht spielen darf).
     ========================================================= */
  var liveWarteschlange = [];
  var liveSichtbar = false;          // Mitschrieb im Chat
  var liveMelder = null;
  /* =========================================================
     DER FOKUS-MODUS
     ---------------------------------------------------------
     GEWUENSCHT: „Wenn gerade eine Nachricht laeuft, dann kann
     kein anderer etwas sagen. Erst wenn derjenige fertig ist,
     ist fuer die anderen wieder die Freigabe da, selber etwas
     aufzunehmen. Die muessen sich praktisch konzentrieren und
     das zu Ende anhoeren … damit der Fokus da bleibt."

     Also: solange eine Wortmeldung laeuft, nimmt niemand auf.
     Das ist kein Verbot von aussen, sondern eine Regel im
     eigenen Geraet — jeder haelt sie fuer sich ein, weil jeder
     dieselbe Warteschlange hat und dieselbe Stelle fragt.

     Geschrieben werden darf weiter. Wer etwas beitragen will,
     ohne zu warten, tippt es — nur die STIMME wartet, und
     genau darum geht es beim Zuhoeren.

     Der Modus ist abschaltbar: „den Livestream-Modus nehmen
     wir nur zum freien Quatschen."
     ========================================================= */
  /* WER DEN FOKUS SCHALTET, IST WICHTIG.
     -----------------------------------------------------------
     GEWUENSCHT: „Vielleicht einen Schalter fuer den Fokus-Modus,
     falls man gerade im normalen Livestream ist … dass ICH das
     administrativ umschalten kann. Niemand sonst — sonst
     koennten die anderen ja die Credits runtermachen."

     Er hat voellig recht, und es war ein echter Fehler: der
     Fokus-Modus lag im GERAET (localStorage). Jeder haette ihn
     fuer sich abschalten und drauflosreden koennen — die Regel
     war damit gar keine. Und teuer ist sie auch: der
     Fokus-Modus laeuft ueber Sprachnachrichten (Supabase, kostet
     nichts), der freie Livestream ueber das Relais (Cloudflare,
     zaehlt aufs Budget).

     Deshalb gehoert er jetzt dem RAUM, nicht dem Geraet: der
     Lehrer beziehungsweise Haeuptling schaltet, es geht als
     Rundruf an alle, und wer neu hereinkommt, bekommt den Stand
     mit der Begruessung. Lokal laesst sich nichts mehr
     aushebeln. */
  function fokusAn() {
    /* Voreinstellung: an. Zuhoeren kostet nichts, Durcheinander
       schon — und zwar in zweierlei Hinsicht. */
    return zustand.fokus !== false;
  }
  /* =========================================================
     DEN FOKUS SCHALTET NUR DER BETREIBER
     ---------------------------------------------------------
     GEMELDET: „Der Fokus-Schalter ist an, aber trotzdem sprechen
     wir frei. Emmi hat mir gerade gesagt, dass sie den
     Fokus-Schalter auch hat. Er ist nicht fuer die anderen. Der
     ist fuer mich, falls ich das Kontingent weiter nutzen
     moechte, aber nicht fuer andere. Das ist nur fuer mich zur
     Kontrolle — ist ja mein Geld."

     Vorher durfte jeder Haeuptling schalten, und Haeuptling wird
     man schon dadurch, dass man einen Raum als Erster betritt.
     Emmi hatte den Schalter also voellig zu Recht — nur sollte
     sie ihn gar nicht haben. Jetzt entscheidet allein
     binLehrer(): der Betreiber. Alle anderen sehen, dass es ihn
     gibt, koennen ihn aber nicht umlegen, und ein „fokus"-Paket
     von ihnen wird verworfen (siehe empfangen()).

     Die automatische Regel bleibt davon unberuehrt und ist die
     eigentliche Sicherung: ist das Kontingent aufgebraucht,
     geht der Raum von selbst in den Fokus-Modus zurueck und
     laesst sich auch vom Betreiber nicht mehr herausschalten. */
  function darfFokusSchalten() {
    return Boolean(binLehrer());
  }
  /* WANN DER FOKUS ERZWUNGEN IST.
     Der Raum hat ein Kontingent fuer die Gespraechsleitung (siehe
     RELAIS.md). Ist es aufgebraucht, meldet die Leitung das, und von
     da an bleibt der Fokus an — sonst redeten alle durcheinander in
     eine Leitung, die es gar nicht mehr gibt. Die Marke setzt der
     Teil, der die Leitung holt; hier wird sie nur gelesen. */
  var kontingentAus = false;
  function fokusErzwungen() { return Boolean(kontingentAus); }

  function fokusSetzen(an) {
    if (!darfFokusSchalten()) return fokusAn();
    /* Ist das Kontingent aufgebraucht, bleibt der Fokus an — auch
       fuer den Betreiber. Das ist die automatische Regel, und sie
       steht ueber dem Schalter: „Wenn das aufgebraucht ist, dass es
       dann blockiert und wieder in den Fokus-Modus zurueckgeht." */
    if (!an && fokusErzwungen()) {
      systemZeile("\ud83c\udf9a\ufe0f Das MONATSBUDGET fuers Relais ist aufgebraucht — "
        + "der Fokus-Modus bleibt an, bis es sich erneuert. "
        + "Geschrieben werden darf jederzeit.\n   "
        + "(Die Tagesgrenze ist etwas anderes und sperrt nichts.)");
      zustand.fokus = true;
      melden();
      return fokusAn();
    }
    zustand.fokus = Boolean(an);
    fokusMerken(zustand.raum, zustand.fokus);
    senden({ art: "fokus", fokus: zustand.fokus, betreiber: true });
    melden();
    return fokusAn();
  }
  /* Laeuft gerade eine fremde Wortmeldung? Das weiss die
     Oberflaeche (sie spielt ab) — sie sagt es hier an. */
  var liveLaeuftGerade = null;   // { von, name, bis } oder null
  var liveWacht = 0;
  /* WIE LANGE DARF EINE WORTMELDUNG DIE LEITUNG HALTEN?
     -----------------------------------------------------------
     GEMELDET: „Manchmal haengt sich die Sprachnachricht auf, also
     dieser gruene Balken, und er bleibt dann stehen. Ich muss jedes
     Mal die Seite aktualisieren, damit ich ueberhaupt wieder sprechen
     kann."

     Der Riegel loeste sich bisher erst nach FUENF MINUTEN — das ist
     fuer den Unterricht eine Ewigkeit. Und er war auch nicht noetig:
     wir wissen, wie lang die Aufnahme ist. Sie bekommt also genau
     ihre Laenge plus zehn Sekunden Luft (mindestens fuenfzehn
     Sekunden, hoechstens fuenf Minuten). Laeuft sie darueber hinaus,
     laeuft sie nicht mehr — sie haengt. Dann ist die Leitung frei. */
  function liveFristMs(wer) {
    var sek = Number(wer && (wer.sek || wer.sprachSek || wer.sprachDauer)) || 0;
    var ms = (sek + 10) * 1000;
    if (!(ms > 0)) ms = 25000;
    return Math.max(15000, Math.min(5 * 60 * 1000, ms));
  }
  function liveLaeuft(wer) {
    liveLaeuftGerade = wer || null;
    clearTimeout(liveWacht); liveWacht = 0;
    if (liveLaeuftGerade) {
      var frist = liveFristMs(liveLaeuftGerade);
      liveLaeuftGerade.bis = Date.now() + frist;
      liveWacht = setTimeout(function () {
        if (!liveLaeuftGerade) return;
        liveLaeuftGerade = null;
        melden();
      }, frist);
    }
    melden();
  }
  /* Ist die Leitung in Wahrheit frei? Das ist keine Vermutung: wenn
     die Frist der laufenden Wortmeldung abgelaufen ist, spielt nichts
     mehr — dann haengt nur noch die Anzeige. In dem Fall wird hier
     aufgeraeumt, still und sofort. Gibt true zurueck, wenn wirklich
     etwas haengengeblieben war. */
  function liveHaengtFest() {
    if (!liveLaeuftGerade) return false;
    if (Date.now() <= (liveLaeuftGerade.bis || 0) + 1500) return false;
    liveLaeuftGerade = null;
    clearTimeout(liveWacht); liveWacht = 0;
    melden();
    return true;
  }
  /* Die Leitung von Hand freigeben — fuer den Tipp auf den gruenen
     Balken. Gibt zurueck, ob etwas freizugeben war. */
  function liveFreigeben() {
    if (!liveLaeuftGerade) return false;
    liveLaeuftGerade = null;
    clearTimeout(liveWacht); liveWacht = 0;
    melden();
    return true;
  }
  /* Wie lange laeuft die aktuelle Wortmeldung noch? Fuer die Auskunft
     beim Antippen — „sie laeuft wirklich noch" oder „sie haengt". */
  function liveRest() {
    if (!liveLaeuftGerade) return 0;
    return Math.max(0, Math.round(((liveLaeuftGerade.bis || 0) - Date.now()) / 1000));
  }
  /* WER SPRICHT, IST NICHT IMMER EIN „ER"
     -----------------------------------------------------------
     GEWUENSCHT: „Wenn die Blase mich erinnert, dass ich noch warten
     soll, weil jemand spricht, dann soll sie korrekt erkennen, wenn
     Emmi spricht, dass es eine Frau ist. Sie hat ja in ihrem Profil
     dieses Geschlechtszeichen — das soll auch erkannt werden."

     Das Zeichen steht im Profil (maennlich / weiblich / divers) und
     reist seit jetzt in jedem Anwesenheitspaket mit. Hier wird daraus
     ein Fuerwort. Wer nichts angegeben hat, bekommt keine Erfindung,
     sondern eine Form, die ohne Fuerwort auskommt — „die Person".
     Lieber unbestimmt als falsch. */
  var geschlechter = {};     // Kennung -> „weiblich" | „maennlich" | „divers"
  /* Dieselbe Buchhaltung fuer die Kontokennung: sie ist die Anschrift
     fuer ein Fluestern, das der Tabelle anvertraut wird. Ohne Konto
     (Gast) geht das nicht — dann bleibt es beim Zuruf von Geraet zu
     Geraet, wie bisher. */
  /* =========================================================
     WIE WEIT GEHEN DIE UHREN AUSEINANDER?
     ---------------------------------------------------------
     Daran ist heute eine ganze Unterhaltung gescheitert: Emmy hat
     nichts mehr gehoert, weil das Alter einer Wortmeldung aus zwei
     verschiedenen Uhren gerechnet wurde. Das ist behoben — aber ein
     grosser Unterschied bleibt eine Auskunft wert, weil er auch die
     Reihenfolge im Verlauf durcheinanderbringt.

     Gemessen wird nebenbei: jedes Paket bringt die Uhrzeit seines
     Absenders mit. Der Unterschied zur eigenen Uhr wird geglaettet
     (zur Haelfte alt, zur Haelfte neu), damit ein langsames Netz
     nicht als falsche Uhr durchgeht. Die Laufzeit selbst ist dabei
     immer ein paar hundert Millisekunden — alles unter fuenf
     Sekunden gilt deshalb als „gleich". */
  var uhrVersatz = {};        // Kennung -> Millisekunden, die seine Uhr vorgeht
  function uhrVergleichen(n) {
    if (!n || !n.von || typeof n.zeit !== "number" || !n.zeit) return;
    var jetzt = Date.now();
    if (Math.abs(jetzt - n.zeit) > 12 * 3600 * 1000) return;   // Unsinn: verwerfen
    var neu = n.zeit - jetzt;
    var alt = uhrVersatz[n.von];
    uhrVersatz[n.von] = (typeof alt === "number") ? Math.round(alt * 0.5 + neu * 0.5) : neu;
  }
  /* =================================================================
     EINE FREMDE UHR DARF DEN VERLAUF NICHT DURCHEINANDERBRINGEN
     -----------------------------------------------------------------
     GEMELDET: „Die Uhr von Emmy geht 5 Sekunden nach. Das stört das
     Hören nicht mehr. Die Reihenfolge im Verlauf kann es aber
     verschieben."

     Genau so ist es, und es ist ein echter Fehler, kein Schönheitsfleck:
     Jede Zeile trägt die Uhrzeit DES ABSENDERS, und sortiert wird nach
     dieser Zahl. Geht ihre Uhr fünf Sekunden nach, rutscht ihre Antwort
     im Verlauf hinter meine Frage von vor drei Sekunden — die Antwort
     steht dann VOR der Frage. Bei zwei Minuten Unterschied (das gab es
     hier schon) wird daraus ein Durcheinander, in dem man nichts mehr
     nachvollziehen kann.

     Den Versatz kennt die Seite längst: uhrVergleichen() misst bei
     JEDEM Paket, wie weit die Uhr der Gegenseite von der eigenen
     abweicht, und glättet ihn über die Zeit. Benutzt wurde er bisher
     nur für die Anzeige im Befund.

     Jetzt wird er angewandt: Eine ankommende Zeile bekommt ihre Zeit
     auf MEINE Uhr umgerechnet. Damit stimmt die Reihenfolge, und auch
     die angezeigte Uhrzeit ist die, die ich auf meiner eigenen Uhr
     gesehen hätte — genau das erwartet man beim Nachlesen.

     Drei Vorsichtsmassnahmen:
       * Die Originalzeit bleibt als „zeitGesendet" erhalten. Nichts
         geht verloren, und man kann es später nachrechnen.
       * Korrigiert wird erst ab einer Sekunde. Darunter ist es
         Messrauschen, und daran herumzurechnen macht es nur unruhig.
       * Ueber zwoelf Stunden gilt der Versatz als Unsinn und bleibt
         unangetastet — das ist dann keine ungenaue Uhr mehr, sondern
         ein falsches Datum.
     ================================================================= */
  function zeitAufMeineUhr(n) {
    if (!n || n.eigen || !n.von || typeof n.zeit !== "number" || !n.zeit) return n;
    var versatz = uhrVersatz[n.von];
    if (typeof versatz !== "number") return n;
    if (Math.abs(versatz) < 1000) return n;
    if (Math.abs(versatz) > 12 * 3600 * 1000) return n;
    if (!n.zeitGesendet) n.zeitGesendet = n.zeit;
    n.zeit = n.zeit - versatz;
    n.uhrVersatz = versatz;
    return n;
  }

  function uhrenStand() {
    return Object.keys(uhrVersatz).map(function (id) {
      var p = zustand.leute[id];
      return { id: id, name: (p && p.name) || "jemand", versatz: uhrVersatz[id] };
    });
  }

  var kontenJe = {};
  function kontoMerken(id, k) {
    if (!id || typeof k !== "string" || !k) return;
    kontenJe[id] = k;
    if (zustand.leute[id]) zustand.leute[id].konto = k;
  }
  function kontoVon(id) {
    var p = id && zustand.leute[id];
    return (p && p.konto) || (id && kontenJe[id]) || "";
  }
  function geschlechtMerken(id, g) {
    if (!id || typeof g !== "string" || !g) return;
    geschlechter[id] = g;
    if (zustand.leute[id]) zustand.leute[id].geschlecht = g;
  }
  function geschlechtVon(id) {
    var p = id && zustand.leute[id];
    return (p && p.geschlecht) || (id && geschlechter[id]) || "";
  }
  function istFrau(g) { return /^(w|weiblich|frau|female|\u2640)/i.test(String(g || "")); }
  function istMann(g) { return /^(m|maennlich|m\u00e4nnlich|mann|male|\u2642)/i.test(String(g || "")); }
  /* „sie" / „er" / „die Person" — im Nominativ. */
  function fuerwort(g) { return istFrau(g) ? "sie" : istMann(g) ? "er" : "die Person"; }
  /* „bis sie fertig ist" / „bis er fertig ist" / „bis die Person fertig ist" */
  function bisFertig(g) { return "bis " + fuerwort(g) + " fertig ist"; }
  function wennFertig(g) { return "wenn " + fuerwort(g) + " fertig ist"; }

  /* Darf ich jetzt aufnehmen? Gibt einen Grund zurueck, keinen
     nackten Wahrheitswert — man soll lesen koennen, WARUM. */
  function darfSprechen() {
    if (!fokusAn()) return { ja: true };
    /* Bevor jemandem das Wort verweigert wird: haengt die Anzeige
       vielleicht nur? Dann ist die Leitung frei, und zwar sofort. */
    if (liveHaengtFest()) return { ja: true, warHaengen: true };
    if (!liveLaeuftGerade) return { ja: true };
    if (liveLaeuftGerade.von === zustand.ichId) return { ja: true };
    var g = geschlechtVon(liveLaeuftGerade.von) || liveLaeuftGerade.geschlecht || "";
    return { ja: false, wer: liveLaeuftGerade.name || "Jemand", geschlecht: g,
             fuerwort: fuerwort(g) };
  }

  /* Eine Sprachnachricht wieder einsammeln: aus der Warteschlange
     und aus dem Verlauf. Gibt zurueck, ob sie noch UNGEHOERT war —
     nur dann ist wirklich nichts passiert. */
  /* Mit „auchSenden" ruft es die Nachricht auch bei den anderen
     zurueck — das braucht der Knopf an der Zeile, der Befehl /weg
     schickt selbst. */
  /* EIN RUECKRUF DARF EIN IRRTUM SEIN.
     -----------------------------------------------------------
     GEWUENSCHT: „Das Rueckruf-Symbol soll man wieder rueckgaengig
     machen koennen … wenn es aber zu lange ignoriert wurde, dann
     kann es nicht mehr wiederhergestellt werden."

     Also ein Papierkorb mit Frist. Was zurueckgerufen wird, liegt
     anderthalb Minuten dort und laesst sich mit einem Tipp
     zurueckholen; danach ist es endgueltig weg. Die Frist ist kein
     Schikane, sondern Ehrlichkeit: die Stuecke der Aufnahme haelt
     der Ausgang zwei Minuten bereit (sprachAusgang), laenger koennte
     man sie gar nicht mehr verschicken. Was man nicht mehr halten
     kann, soll man auch nicht versprechen. */
  var RUECKHOL_MS = 90000;
  var sprachPapierkorb = {};

  function sprachZurueckrufen(id, auchSenden) {
    var wars = false;
    for (var i = liveWarteschlange.length - 1; i >= 0; i--) {
      var w = liveWarteschlange[i];
      if (w && String(w.id).indexOf(id) === 0) { liveWarteschlange.splice(i, 1); wars = true; }
    }
    /* Erst aufheben, dann wegnehmen — sonst gibt es nichts
       zurueckzuholen. Nur die eigenen: fremde Wortmeldungen
       wiederherzustellen waere nicht mein Recht. */
    var geholt = zustand.nachrichten.filter(function (n) {
      return n && n.id && String(n.id).indexOf(id) === 0;
    });
    var eigene = geholt.filter(function (n) { return n.eigen; });
    if (eigene.length) {
      sprachPapierkorb[id] = { zeilen: eigene, wann: Date.now() };
      setTimeout(function () { delete sprachPapierkorb[id]; melden(); }, RUECKHOL_MS);
    }
    zustand.nachrichten = zustand.nachrichten.filter(function (n) {
      return !(n && n.id && String(n.id).indexOf(id) === 0);
    });
    if (auchSenden) { try { senden({ art: "zurueck", id: String(id) }); } catch (e) {} }
    melden();
    return { ungehoert: wars, ruecknahmeBis: eigene.length ? Date.now() + RUECKHOL_MS : 0 };
  }

  /* Was liegt gerade im Papierkorb und wie lange noch? */
  function sprachRuecknahmen() {
    var jetzt = Date.now();
    return Object.keys(sprachPapierkorb).map(function (id) {
      var p = sprachPapierkorb[id];
      return { id: id, restMs: Math.max(0, RUECKHOL_MS - (jetzt - p.wann)),
               sekunden: (p.zeilen[0] && p.zeilen[0].sprachSek) || 0 };
    }).filter(function (x) { return x.restMs > 0; });
  }

  function sprachWiederherstellen(id) {
    var p = sprachPapierkorb[id];
    if (!p) return { ok: false, warum: "Die Frist ist abgelaufen — das lässt sich nicht mehr zurückholen." };
    delete sprachPapierkorb[id];
    p.zeilen.forEach(function (n) { nachrichtAnhaengen(n); });
    /* Und wieder hinaus zu den anderen. Liegen die Stuecke noch im
       Ausgang, gehen sie denselben Weg wie beim ersten Mal; sonst
       reicht ein einzelnes Paket, wenn die Aufnahme klein genug ist. */
    var mitTon = p.zeilen.filter(function (n) { return n.sprach; })[0];
    if (sprachAusgang[id]) {
      sprachTeilSchicken(id, 0);
    } else if (mitTon && mitTon.sprach && mitTon.sprach.length <= PAKET_BYTES) {
      senden({ art: "text", text: "", sprach: mitTon.sprach,
               id: id, name: mitTon.name, zeit: mitTon.zeit, bild: mitTon.bild,
               farbe: mitTon.farbe, chatArt: "live",
               sprachSek: mitTon.sprachSek, sprachAb: mitTon.sprachAb,
               sprachDauer: mitTon.sprachDauer });
    }
    melden();
    return { ok: true };
  }

  function liveMelden(f) { liveMelder = typeof f === "function" ? f : null; }
  /* Was im Raum passiert, darf auch oben im Laufband stehen. app.js
     meldet sich mit beiEreignis an; ohne Anmeldung passiert nichts. */
  function raumEreignis(text) {
    if (typeof zustand.ereignisRuf !== "function") return;
    try { zustand.ereignisRuf(String(text || "")); } catch (e) {}
  }
  function liveSagen() { if (liveMelder) { try { liveMelder(); } catch (e) {} } }
  /* Das naechste Stueck herausgeben — app.js ruft das ab, sobald das
     vorige zu Ende ist. */
  /* WARUM EMMY KLANG, ALS SPRAECHE SIE RUECKWAERTS.
     -----------------------------------------------------------
     GEMELDET: „Emmys Nachrichten sind kaum zu verstehen. Das klingt
     so, als wenn sie rueckwaerts spricht — kann das sein, dass da
     irgendwas falsch laeuft?"

     Ja. Beim Freisprechen wird die Rede in kurze Stuecke zerlegt und
     einzeln verschickt. Grosse Stuecke werden dabei nochmal in
     Pakete geteilt (siehe sprachTeilEmpfangen) und drueben wieder
     zusammengesetzt. Ein LANGES Stueck ist also erst dann fertig,
     wenn sein letztes Paket da ist — und in der Zwischenzeit kann
     ein kuerzeres, das SPAETER gesprochen wurde, laengst komplett
     sein.

     Die Reihe hat bisher stur hinten angehaengt: „in der
     Reihenfolge des Eintreffens". Damit kam der spaetere Satz
     zuerst und der fruehere danach. Bei zwei, drei Stuecken
     hintereinander klingt das genau so, wie er es beschreibt —
     wie rueckwaerts geredet.

     Jetzt wird EINSORTIERT statt angehaengt: ein neues Stueck
     rutscht vor alle noch wartenden Stuecke DERSELBEN Person, die
     spaeter gesprochen wurden. Andere Sprecher bleiben unberuehrt —
     zwischen zwei Personen gilt weiter, wer zuerst da war. */
  /* WAS SCHON GELAUFEN IST, LAEUFT NICHT NOCH EINMAL.
     -----------------------------------------------------------
     GEMELDET: „Manchmal kommt meine Sprachaufnahme doppelt, nachdem
     ich sie eingesprochen habe."
     Die Aufnahme kann auf zwei Wegen in die Reihe geraten: einmal
     lokal (damit man sich selbst hoert, wenn sonst niemand da ist)
     und einmal, wenn der Rekorder sein Stueck doppelt abliefert —
     ein MediaRecorder liefert nach dem Stoppen nach, und dabei kann
     dasselbe Stueck ein zweites Mal durchrutschen. Zwei verschiedene
     Kennungen, derselbe Ton.
     Erkannt wird sie deshalb nicht an der Kennung, sondern an dem,
     was sie IST: derselbe Absender, gleich lange Daten, fast
     dieselbe Zeit. Gemerkt wird das eine Viertelminute lang, damit
     ein Nachzuegler auch dann noch auffaellt, wenn die erste
     Ausfertigung laengst abgespielt wurde. */
  var liveSchonGehabt = [];
  var liveKennungGehabt = {};        // was je in der Reihe war, dauerhaft
  function liveFingerabdruck(w) {
    return String(w.von) + "|" + String((w.sprach || "").length) + "|"
         + Math.round((Number(w.sprachSek) || 0) * 10);
  }
  /* Die Kennung OHNE die Anhaengsel: dieselbe Aufnahme heisst einmal
     „…-selbst" (die eigene Kontrolle), einmal „…-quittung" und einmal
     schlicht so, wie der Absender sie genannt hat. Gemeint ist immer
     dieselbe. */
  function liveKern(id) {
    return String(id || "").replace(/-selbst$/, "").replace(/-quittung$/, "");
  }
  function liveDoppelt(w) {
    var jetzt = Date.now();
    /* ZWEI GEDAECHTNISSE, UND BEIDE BRAUCHT ES.
       GEMELDET: „Ich hoere ihre Sprachnachrichten ploetzlich doppelt
       … Ich soll das nur einmal hoeren."
       Der Fingerabdruck (Absender + Laenge + Dauer) faengt das, was
       zweimal aufgenommen wurde. Er reicht aber nicht, wenn dieselbe
       Aufnahme SPAETER noch einmal hereinkommt — etwa, weil Pakete
       nachgeliefert wurden oder weil sie jemandem beim Betreten
       nachgereicht wird. Dafuer gibt es die Kennung, und die wird
       fuer die ganze Sitzung gemerkt: was einmal in der Reihe war,
       kommt nie wieder hinein. */
    var kern = liveKern(w.id);
    if (kern && liveKennungGehabt[kern]) return true;
    liveSchonGehabt = liveSchonGehabt.filter(function (x) { return jetzt - x.wann < 15000; });
    var abdruck = liveFingerabdruck(w);
    var da = liveSchonGehabt.some(function (x) {
      return x.abdruck === abdruck && Math.abs((x.zeit || 0) - (w.zeit || 0)) < 4000;
    });
    if (da) return true;
    liveSchonGehabt.push({ abdruck: abdruck, zeit: w.zeit || jetzt, wann: jetzt });
    if (kern) liveKennungGehabt[kern] = true;
    return false;
  }

  /* EINE REIHE IST EIN GESPRAECH, KEIN BRIEFKASTEN.
     -----------------------------------------------------------
     GEMELDET, mit Screenshot: bei Emmy stand „Xander Fox spricht ·
     noch 20 in der Reihe".
       „Sie soll sich ja nicht alle 20 Nachrichten anhoeren … Sie
        sollen nicht dafuer bestraft werden, dass sie mich in der
        Vergangenheit noch nicht komplett gehoert haben, und auf
        alles warten muessen. Sie sollen nach der AKTUELLEN
        Nachricht sprechen koennen."

     Er hat vollkommen recht, und der Fehler war grundsaetzlich: die
     Reihe hat alles aufgehoben, was je hereinkam. Kam eine Person
     mit blockiertem Ton oder schlechter Leitung dazu, stapelte sich
     alles — und weil im Fokus-Modus niemand spricht, solange etwas
     laeuft, war sie damit auf unbestimmte Zeit stumm. Aus einer
     Ordnungsregel wurde eine Strafe.

     Zwei Grenzen, und beide folgen derselben Idee: Gesprochenes ist
     FLUECHTIG. Was vorbei ist, ist vorbei.
       - Was aelter als anderthalb Minuten ist, kommt gar nicht erst
         in die Reihe.
       - Mehr als drei wartende Stuecke gibt es nicht; kommt ein
         neues dazu, faellt das aelteste heraus.
     Verloren ist dabei NICHTS: jede Wortmeldung steht weiterhin im
     Chat und laesst sich dort antippen und anhoeren, wann immer man
     will. Genau so war es gewuenscht — „sie sollen nur hoeren, was
     sie hoeren moechten, und dann klicken sie das selbststaendig
     an." */
  /* GEMELDET: „Gerade stand da, ich muss auf drei weitere Nachrichten
     noch warten, obwohl ich alle gehoert habe. Das soll da gar nicht
     sein. Die letzte, die gesprochen wird, ist die aktuelle, und nach
     der kann jeder sprechen."
     Also EINS. Was gerade laeuft, laeuft zu Ende; was waehrenddessen
     hereinkommt, ersetzt das Wartende. Eine Reihe, in der man
     ansteht, gibt es nicht mehr — und deshalb auch keine Zahl, auf
     die man warten muesste. Alles Uebersprungene steht weiterhin im
     Chat und laesst sich dort anhoeren. */
  var LIVE_REIHE_MAX = 1;
  var LIVE_ALTER_MS = 90000;
  var liveUebersprungen = 0;
  var liveSagenUhr = 0;

  function liveEinreihen(w) {
    if (w && w.sprach && liveDoppelt(w)) return;
    /* FREMDE UHREN GEHEN FALSCH — UND DAS DARF NIEMANDEN STUMM
       SCHALTEN.
       -----------------------------------------------------------
       GEMELDET: „Emmy kann mich auf ihrer Seite nicht mehr hoeren."

       Hier stand:
           if (w.zeit && Date.now() - w.zeit > LIVE_ALTER_MS) return;
       Das Alter wurde also aus SEINER Uhr und IHRER Uhr gerechnet.
       Geht ein Telefon anderthalb Minuten vor oder nach — und das
       kommt vor, besonders wenn eines davon lange im Flugmodus war —,
       dann galt JEDE seiner Wortmeldungen bei ihr als „zu alt" und
       wurde weggeworfen. Stillschweigend, denn der Hinweis darauf ist
       auf seinen Wunsch abgeschaltet.

       Gemessen wird deshalb nur noch mit der EIGENEN Uhr: wann ist
       das Stueck HIER angekommen. Was gerade hereinkommt, ist nie zu
       alt. Alt werden kann es nur in der eigenen Reihe — und das
       faengt liveNaechste() ab. */
    if (w) w.hier = Date.now();
    var i = liveWarteschlange.length;
    while (i > 0) {
      var v = liveWarteschlange[i - 1];
      if (!v || v.von !== w.von) break;               // fremder Sprecher: hier ist Schluss
      if ((v.zeit || 0) <= (w.zeit || 0)) break;      // der davor ist aelter — passt
      i--;
    }
    liveWarteschlange.splice(i, 0, w);
    if (liveWarteschlange.length > LIVE_REIHE_MAX) {
      var weg = liveWarteschlange.length - LIVE_REIHE_MAX;
      liveWarteschlange.splice(0, weg);
      liveUebersprungenMelden(weg);
    }
  }

  /* Einmal sagen, nicht zwanzigmal — sonst steht der Chat voll mit
     Hinweisen darauf, dass etwas nicht im Chat steht. */
  function liveUebersprungenMelden(wieviel) {
    liveUebersprungen += wieviel;
    clearTimeout(liveSagenUhr);
    liveSagenUhr = setTimeout(function () {
      var n = liveUebersprungen;
      liveUebersprungen = 0;
      if (!n) return;
      /* GEMELDET: „Eine aeltere Wortmeldung uebersprungen — das soll
         mich nicht staendig ueberfluten." Also gar nichts mehr. Die
         Wortmeldungen SIND ja da: sie stehen im Chat und werden dort
         angetippt. Nichts wird geloescht, es wird nur nicht mehr
         darueber geredet. */
      if (n < 0) hinweisZeigen("");
    }, 1200);
  }

  function liveNaechste() {
    /* Was zu lange in der eigenen Reihe lag, ist Vergangenheit — das
       ist die einzige ehrliche Altersmessung, weil sie nur die eigene
       Uhr braucht. */
    while (liveWarteschlange.length) {
      var w = liveWarteschlange.shift();
      if (!w) continue;
      if (Date.now() - (w.hier || Date.now()) > LIVE_ALTER_MS) {
        liveUebersprungenMelden(1);
        continue;
      }
      return w;
    }
    return null;
  }
  function liveOffen() { return liveWarteschlange.length; }
  function liveMitschrieb(an) {
    if (an === undefined) return liveSichtbar;
    liveSichtbar = Boolean(an);
    return liveSichtbar;
  }

  /* Die Stuecke, die noch auf ihre Geschwister warten. */
  var sprachBausteine = {};
  function sprachTeilEmpfangen(p) {
    if (!p || !p.id || typeof p.nr !== "number") return null;
    var b = sprachBausteine[p.id];
    if (!b) {
      b = sprachBausteine[p.id] = { teile: [], anzahl: p.anzahl || 1, da: 0, seit: Date.now(),
                                    von: p.von || "", name: p.name || "", uhr: 0, gefragt: 0 };
      /* Was nach zwei Minuten noch unvollstaendig ist, wird nie
         mehr vollstaendig — wegwerfen, sonst waechst der Speicher. */
      setTimeout(function () { delete sprachBausteine[p.id]; }, 120000);
    }
    if (b.teile[p.nr] === undefined) { b.teile[p.nr] = p.teil; b.da++; }
    b.von = p.von || b.von;
    if (b.da < b.anzahl) {
      /* NACHFRAGEN STATT WARTEN.
         Fehlt nach zwei Sekunden Ruhe immer noch etwas, wird genau
         danach gefragt — mit den Nummern, die fehlen. Dreimal, dann
         ist es verloren, und das wird auch gesagt statt verschwiegen. */
      clearTimeout(b.uhr);
      b.uhr = setTimeout(function () { sprachFehltMelden(p.id); }, 2000);
      return null;
    }
    clearTimeout(b.uhr);
    var ganz = b.teile.join("");
    delete sprachBausteine[p.id];
    return ganz;
  }

  /* Welche Stuecke fehlen — und beim Absender danach fragen. */
  function sprachFehltMelden(id) {
    var b = sprachBausteine[id];
    if (!b || !b.von) return;
    b.gefragt = (b.gefragt || 0) + 1;
    if (b.gefragt > 3) {
      systemZeile("\ud83d\udd0a Von " + (b.name || "jemandem") + " ist eine Wortmeldung nur "
        + "teilweise angekommen — die Leitung hat Pakete verloren. "
        + "Bitte noch einmal sprechen.");
      delete sprachBausteine[id];
      return;
    }
    var fehlt = [];
    for (var i = 0; i < b.anzahl; i++) { if (b.teile[i] === undefined) fehlt.push(i); }
    if (!fehlt.length) return;
    senden({ art: "sprachfehlt", an: b.von, id: id, nr: fehlt });
    /* Noch einmal nachsehen, falls die Antwort auch verlorengeht. */
    clearTimeout(b.uhr);
    b.uhr = setTimeout(function () { sprachFehltMelden(id); }, 3000);
  }

  function bildSenden(quelle, text) {
    var n = {
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: String(text || "").slice(0, CHAT_LAENGE),
      bildImChat: String(quelle || ""),
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName
    };
    if (!n.bildImChat) return false;
    bildGemerkt(n.bildImChat);          // fuer „zuletzt benutzt" im Waehler
    nachrichtAnhaengen(n);
    serverSichern(n);
    senden({ art: "text", id: n.id, name: n.name, text: n.text, zeit: n.zeit,
             bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName, bildImChat: n.bildImChat });
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
    { gr: "reden", w: "me",      kurz: "",     nutzt: "/me was du tust",     was: "Aktion: „Emmy lacht laut“" },
    { gr: "reden", w: "me/",     kurz: "",     nutzt: "… /me/ …",            was: "Mitten im Satz: wird durch deinen Namen ersetzt" },
    { gr: "reden", w: "s",       kurz: "shout",nutzt: "/s Text",             was: "Schreien" },
    { gr: "reden", w: "w",       kurz: "msg",  nutzt: "/w Name Text",        was: "Flüstern" },
    { gr: "raum", w: "j",       kurz: "join", nutzt: "/j Raum",             was: "Raum" },
    { gr: "raum", w: "i",       kurz: "invite", nutzt: "/i Name",           was: "Einladen" },
    { gr: "raum", w: "f",       kurz: "follow", nutzt: "/f Name",           was: "Folgen" },
    { gr: "raum", w: "n",       kurz: "names",nutzt: "/n",                  was: "Wer ist hier" },
    { gr: "raum", w: "l",       kurz: "list", nutzt: "/l",                  was: "Liste der Räume" },
    { gr: "raum", w: "t",       kurz: "topic",nutzt: "/t Text",             was: "Thema" },
    { gr: "raum", w: "lock",    kurz: "",     nutzt: "/lock",               was: "Abschließen" },
    { gr: "raum", w: "unlock",  kurz: "",     nutzt: "/unlock",             was: "Aufschließen" },
    { gr: "chef", w: "op",      kurz: "admin",nutzt: "/op Name",            was: "Admin" },
    { gr: "chef", w: "deop",    kurz: "",     nutzt: "/deop Name",          was: "Admin weg" },
    { gr: "chef", w: "k",       kurz: "kick", nutzt: "/k Name",             was: "Kick" },
    { gr: "chef", w: "stumm",   kurz: "",     nutzt: "/stumm Name",         was: "Stumm" },
    { gr: "chef", w: "entstumm", kurz: "",    nutzt: "/entstumm Name",      was: "Stumm weg" },
    { gr: "chef", w: "knebel",  kurz: "",     nutzt: "/knebel Name",        was: "Knebel" },
    { gr: "chef", w: "entknebel", kurz: "",   nutzt: "/entknebel Name",     was: "Knebel weg" },
    { gr: "reden", w: "lach",    kurz: "lol",  nutzt: "/lach",               was: "Lachen — mit einem Gesicht aus Buchstaben" },
    { gr: "zeichen", w: "ascii",   kurz: "",     nutzt: "/ascii Was",        was: "Bild aus Buchstaben — /ascii zeigt alle" },
    { gr: "zeichen", w: "bild",    kurz: "emoji",nutzt: "/bild Was",         was: "Bild aus Emojis — /bild zeigt alle" },
    { gr: "reden", w: "herz",    kurz: "",     nutzt: "/herz Name",          was: "Ein Herz schicken" },
    { gr: "reden", w: "drueck",  kurz: "hug",  nutzt: "/drueck Name",        was: "Drücken" },
    { gr: "raum", w: "tausch",   kurz: "platz",  nutzt: "/tausch Name",     was: "Platz tauschen" },
    { gr: "raum", w: "heb",      kurz: "lasso",  nutzt: "/heb Name 3",      was: "Jemanden auf einen anderen Platz setzen — /heb Name zeigt, welche gehen" },
    { gr: "raum", w: "verbindung", kurz: "ton",  nutzt: "/verbindung",      was: "Warum hört man jemanden nicht?" },
    { gr: "reden", w: "leck",    kurz: "lecken", nutzt: "/leck Name",        was: "Abschlecken" },
    { gr: "reden", w: "box",     kurz: "boxen",  nutzt: "/box Name",         was: "Boxhandschuh" },
    { gr: "reden", w: "tritt",   kurz: "fussball", nutzt: "/tritt Name",     was: "Tritt gegen das Profilbild — es fliegt wie ein Ball und kommt zurück" },
    { gr: "reden", w: "wasser",  kurz: "eimer",  nutzt: "/wasser Name",      was: "Einen Eimer Wasser darüber kippen" },
    { gr: "reden", w: "wecker",  kurz: "wecken", nutzt: "/wecker Name",      was: "Wecker — das Profilbild scheppert" },
    { gr: "reden", w: "hammer",  kurz: "bonk",   nutzt: "/hammer Name",      was: "Hammer auf den Kopf" },
    { gr: "reden", w: "schnee",  kurz: "schneeball", nutzt: "/schnee Name",  was: "Schneeball — er klatscht ans Profilbild und es bleibt Schnee liegen" },
    { gr: "reden", w: "bumerang", kurz: "boomerang", nutzt: "/bumerang Name", was: "Bumerang — er trifft am Kopf und kommt zu dir zurueck" },
    { gr: "reden", w: "pfeil",   kurz: "bogen",  nutzt: "/pfeil Name",       was: "Saugnapf-Pfeil — er bleibt am Profilbild kleben" },
    { gr: "reden", w: "sahne",   kurz: "schlagsahne", nutzt: "/sahne Name",  was: "Schlagsahne-Haube auf den Kopf" },
    { gr: "reden", w: "trommel", kurz: "gong",   nutzt: "/trommel Name",     was: "Trommel — auf dem Kopf wird getrommelt" },
    { gr: "reden", w: "ei",       kurz: "ei",    nutzt: "/ei Name",          was: "Ei auf dem Kopf — es wird aufgeschlagen und laeuft herunter" },
    { gr: "reden", w: "stoerung", kurz: "tv",  nutzt: "/stoerung Name",    was: "Bildstoerung — schlechter Empfang, das Bild zerreisst" },
    { gr: "reden", w: "fahren",  kurz: "fahrt", nutzt: "/fahren Name",      was: "hinfahren \u2014 dein Bild rollt zum freien Platz daneben und bleibt dort" },
    { gr: "reden", w: "flug", kurz: "fliegen", nutzt: "/flug 5",
      was: "Flugzeug \u2014 dein Bild sitzt hinter dem Fenster und wird auf Platz 5 abgesetzt" },
    { gr: "reden", w: "maulwurf", kurz: "graben", nutzt: "/maulwurf 5",
      was: "Maulwurf \u2014 du gr\u00e4bst dich unter dem Raum hindurch und kommst auf Platz 5 wieder heraus" },
    { gr: "reden", w: "portal", kurz: "gate", nutzt: "/portal 5",
      was: "Tor \u2014 du verschwindest im Wirbel und tauchst auf Platz 5 wieder auf" },
    { gr: "reden", w: "boot", kurz: "segeln", nutzt: "/boot 5",
      was: "Boot \u2014 dein Bild schippert \u00fcbers Wasser zu Platz 5" },
    { gr: "reden", w: "kran", kurz: "baukran", nutzt: "/kran 5",
      was: "Baustellenkran \u2014 dein Bild wird hochgehoben und auf Platz 5 abgesetzt" },
    { gr: "reden", w: "gemeinsam", kurz: "zuzweit", nutzt: "/gemeinsam Name",
      was: "zu zweit losfahren \u2014 sein Bild h\u00e4ngt sich an deins und ihr rollt zusammen weg" },
    { gr: "reden", w: "laufen",  kurz: "",      nutzt: "/laufen 8",           was: "Feld f\u00fcr Feld zu Platz 8 laufen \u2014 geht auch mit /fahren 8" },
    { gr: "reden", w: "huepfen", kurz: "spielzug", nutzt: "/huepfen Name",     was: "Spielzug — dein Bild huepft Platz fuer Platz zu jemandem" },
    { gr: "reden", w: "katapult", kurz: "kata", nutzt: "/katapult Name",   was: "Katapult — der andere wird weggeschleudert" },
    { gr: "reden", w: "brennen", kurz: "flammen", nutzt: "/brennen Name",
      was: "Der Rahmen brennt \u2014 Flammen zuengeln am Rand des Profilbildes hoch" },
    { gr: "reden", w: "strohhalm", kurz: "halm", nutzt: "/strohhalm Name", was: "Strohhalm — der andere wird angesaugt" },
    { gr: "reden", w: "blubbern", kurz: "pusten", nutzt: "/blubbern Name", was: "Blubbern — in den Halm gepustet, das Bild blubbert" },
    { gr: "reden", w: "knuellen", kurz: "knuell", nutzt: "/knuellen Name", was: "Zerknüllen — das Bild knittert wie Papier und glaettet sich wieder" },
    { gr: "reden", w: "peitsche", kurz: "snap", nutzt: "/peitsche Name",   was: "Auspeitschen — es schnalzt, die Strieme bleibt kurz" },
    { gr: "reden", w: "bowling", kurz: "kegel", nutzt: "/bowling Name",    was: "Bowling — die Kugel raeumt ab" },
    { gr: "reden", w: "billard", kurz: "queue", nutzt: "/billard Name",    was: "Billard — angestossen und weggerollt" },
    { gr: "reden", w: "schneekugel", kurz: "glaskugel", nutzt: "/schneekugel Name",
      was: "Schneekugel — durchgeschüttelt, dann rieselt der Schnee über Häuschen und Tanne" },
    { gr: "reden", w: "kopfhoerer", kurz: "ohr", nutzt: "/kopfhoerer Name 3", was: "Kopfhoerer — aufgesetzt; mit Liednummer hoert der andere das Lied" },
    { gr: "reden", w: "musik", kurz: "lied", nutzt: "/musik 3", was: "Musik fuer alle aus dem Musikordner — /musik zeigt die Liste, /musik aus haelt an" },
    { gr: "schule", w: "versenken", kurz: "schiffe", nutzt: "/versenken",
      was: "Schiffe versenken \u2014 jeder versteckt sich auf einem Platz, dann wird der Reihe nach geraten; /versenken aus beendet es" },
    { gr: "schule", w: "tafel", kurz: "whiteboard", nutzt: "/tafel",
      was: "Whiteboard für alle — Bild hineinladen, malen, zeigen, heranholen; /tafel aus macht es zu" },
    { gr: "reden", w: "fenster", kurz: "luke", nutzt: "/fenster Name",
      was: "Fenster \u2014 das Profilbild geht auf wie ein Fensterfluegel" },
    { gr: "reden", w: "rollo", kurz: "jalousiehoch", nutzt: "/rollo Name",
      was: "Rollo \u2014 die Bahn rollt nach oben auf" },
    { gr: "reden", w: "lamellen", kurz: "jalousieauf", nutzt: "/lamellen Name",
      was: "Jalousie \u2014 die Lamellen kippen und fahren hoch" },
    { gr: "reden", w: "platte", kurz: "dj",    nutzt: "/platte Name",      was: "DJ-Schallplatte — das Bild dreht sich unter der Nadel" },
    { gr: "reden", w: "ohrfeige", kurz: "klatsch", nutzt: "/ohrfeige Name", was: "Ohrfeige — der Kopf fliegt zur Seite" },
    { gr: "reden", w: "basketball", kurz: "korb", nutzt: "/basketball Name", was: "Basketball — auf dem Kopf gedribbelt" },
    { gr: "reden", w: "tennis", kurz: "filz",  nutzt: "/tennis Name",      was: "Tennis — ein Ball wird zugespielt" },
    { gr: "reden", w: "zufall", kurz: "wuerfel", nutzt: "/zufall [Name]",  was: "ohne Namen: das Los sucht dir einen neuen Platz — mit Namen: irgendein Effekt" },
    { gr: "reden", w: "aufessen", kurz: "haps", nutzt: "/aufessen Name",  was: "den anderen Biss fuer Biss aufessen wie einen Keks" },
    { gr: "reden", w: "sanduhr", kurz: "glas",  nutzt: "/sanduhr Name",   was: "Sanduhr — ihr lauft durch und tauscht die Plaetze (nur direkt uebereinander)" },
    /* RUNDE 18, NACHGETRAGEN — und das war ein echter Fehler:
       GEMELDET: „Das Licht aus an einem Profilbild geht noch nicht,
       die Muenze geht noch nicht, der Wischer geht noch nicht … Da
       kommt bei den genannten Effekten immer die Eingabe in das
       Chat-Zeilen-Fenster und wartet auf irgendeinen Befehl."

       GEFUNDEN: ein Befehl braucht ZWEI Eintraege — die Wirkung in
       AM_PLATZ und eine Zeile HIER. befehlBekannt() liest nur diese
       Liste; was hier fehlt, gilt als Vertipper und geht gar nicht
       erst hinaus („die Zeile ist NICHT hinausgegangen"). Die sieben
       Neuen standen nur in AM_PLATZ. Deshalb stehen sie jetzt auch
       hier — und pruefe-effekttueren achtet ab sofort darauf. */
    { gr: "reden", w: "licht", kurz: "aus",     nutzt: "/licht Name",     was: "Licht aus \u2014 es flackert, summt und wird dunkel" },
    { gr: "reden", w: "muenze", kurz: "dreh",   nutzt: "/muenze Name",    was: "M\u00fcnze \u2014 das Bild kreiselt und faellt flach hin" },
    { gr: "reden", w: "wischer", kurz: "wisch", nutzt: "/wischer Name",   was: "Scheibenwischer \u2014 erst dreckig, dann sauber gewischt" },
    { gr: "reden", w: "zwille", kurz: "zwick",  nutzt: "/zwille Name",    was: "Zwille \u2014 mit dem Gummiband abgeschossen, das tut weh" },
    { gr: "reden", w: "pusterohr", kurz: "puste", nutzt: "/pusterohr Name", was: "Pusterohr \u2014 die Papierkugel klatscht an die Wange" },
    { gr: "reden", w: "gluehbirne", kurz: "birne", nutzt: "/gluehbirne Name", was: "Gl\u00fchbirne \u2014 eingedreht, bis es leuchtet" },
    { gr: "reden", w: "entbloessung", kurz: "ups", nutzt: "/entbloessung Name", was: "Ups! \u2014 geht nur bei dem, der direkt neben dir sitzt" },
    { gr: "reden", w: "hut", kurz: "cowboy",  nutzt: "/hut Name",       was: "Cowboyhut \u2014 er faellt von oben und sitzt schief" },
    { gr: "reden", w: "bombe", kurz: "zisch", nutzt: "/bombe Name",     was: "Zeitbombe \u2014 3, 2, 1 und weg, nur Asche bleibt" },
    { gr: "reden", w: "streicheln", kurz: "lieb", nutzt: "/streicheln Name", was: "Streicheln \u2014 sanft, mit Herzchen" },
    { gr: "reden", w: "kuss", kurz: "bussi",  nutzt: "/kuss Name",      was: "Kuss \u2014 der Abdruck bleibt kurz stehen" },
    { gr: "raum", w: "panik", kurz: "tonneu", nutzt: "/panik",          was: "Ton zur\u00fccksetzen, wenn du jemanden doppelt h\u00f6rst" },
    { gr: "reden", w: "lasso", kurz: "herzu", nutzt: "/lasso Name",
      was: "Jemanden mit dem Lasso zu dir heranziehen \u2014 auf den freien Platz neben dir" },
    { gr: "lernen", w: "lesen", kurz: "text",  nutzt: "/lesen",
      was: "Einen Lesetext in den Chat holen \u2014 Niveau w\u00e4hlbar, Zeile f\u00fcr Zeile" },
    { gr: "lernen", w: "sortieren", kurz: "reihenfolge", nutzt: "/sortieren Satz 1 | Satz 2 | Satz 3",
      was: "Kontext\u00fcbung \u2014 die S\u00e4tze werden gemischt, wer sie richtig ordnet, bekommt es gesagt" },
    { gr: "lernen", w: "kontexter", kurz: "kontext", nutzt: "/kontexter Satz | Satz | Satz",
      was: "KONTEXTER \u2014 eine Geschichte in die richtige Reihenfolge bringen; aus jedem Lesetext mit einem Tipp" },
    { gr: "lernen", w: "artikel", kurz: "derdiedas", nutzt: "/artikel",
      was: "Der, die oder das? Ein Wort aus dem W\u00f6rterbuch \u2014 drei Kacheln, sofort gepr\u00fcft" },
    { gr: "lernen", w: "begriff", kurz: "bedeutung", nutzt: "/begriff",
      was: "Die Bedeutung steht da, das Wort ist gesucht \u2014 auch aus dem W\u00f6rterbuch" },
    { gr: "hilfe", w: "probe",   kurz: "test",   nutzt: "/probe boxen",      was: "Eine Animation nur für dich zeigen" },
    { gr: "feier", w: "konfetti", kurz: "party", nutzt: "/konfetti",          was: "Konfetti — fliegt durch den ganzen Raum, bei allen" },
    { gr: "feier", w: "ballon",  kurz: "geburtstag", nutzt: "/ballon Name", was: "Luftballons zum Geburtstag" },
    { gr: "feier", w: "geschenk", kurz: "gift", nutzt: "/geschenk Name",    was: "Ein Geschenk überreichen" },
    { gr: "wetter", w: "schnee",  kurz: "",     nutzt: "/schnee",             was: "Es schneit im ganzen Raum" },
    { gr: "wetter", w: "regen",   kurz: "",     nutzt: "/regen",              was: "Es regnet im ganzen Raum" },
    { gr: "wetter", w: "feuerwerk", kurz: "",   nutzt: "/feuerwerk",          was: "Feuerwerk über dem ganzen Fenster" },
    { gr: "wetter", w: "gewitter", kurz: "sturm", nutzt: "/gewitter",          was: "Blitz, Donner und Sturm" },
    { gr: "welt", w: "erdbeben", kurz: "beben", nutzt: "/erdbeben",          was: "Der ganze Chat fängt an zu wackeln" },
    { gr: "welt", w: "vulkan",  kurz: "ausbruch", nutzt: "/vulkan",          was: "Ein Vulkan bricht aus — Lava, Funken und Asche" },
    { gr: "tiere", w: "schmetterling", kurz: "falter", nutzt: "/schmetterling", was: "Schmetterlinge flattern durch den Raum" },
    { gr: "tiere", w: "voegel",  kurz: "zugvoegel", nutzt: "/voegel",          was: "Ein Schwarm zieht in den Süden — in Keilformation" },
    { gr: "fahrzeuge", w: "schlitten", kurz: "santa", nutzt: "/schlitten",     was: "Film: der Weihnachtsmann rauscht mit dem Schlitten durchs Bild" },
    { gr: "fahrzeuge", w: "rennauto", kurz: "auto", nutzt: "/rennauto",        was: "Ein Rennwagen fährt durchs Bild" },
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
    { gr: "welt", w: "keks",      kurz: "cookie", nutzt: "/keks [Name]", was: "Ein Keks wird aufgegessen — mit Namen krümelt er auf ein Profilbild" },
    { gr: "welt", w: "seifenblasen", kurz: "blasen", nutzt: "/seifenblasen", was: "Seifenblasen steigen auf und zerplatzen" },
    { gr: "welt", w: "herbst",    kurz: "laub",   nutzt: "/herbst",    was: "Buntes Herbstlaub taumelt herunter" },
    { gr: "welt", w: "aquarium",  kurz: "fische", nutzt: "/aquarium",  was: "Fische ziehen durchs Bild, Luftblasen steigen auf" },
    { gr: "welt", w: "pinguine",  kurz: "pinguin", nutzt: "/pinguine", was: "Eine Reihe Pinguine watschelt durchs Bild" },
    { gr: "welt", w: "fratze",    kurz: "daemon", nutzt: "/fratze",    was: "Eine dämonische Fratze taucht aus dem Dunkel auf" },
    { gr: "welt", w: "blut",      kurz: "horror", nutzt: "/blut",      was: "Blut läuft von oben herunter" },
    { gr: "welt", w: "schloss",   kurz: "hollow", nutzt: "/schloss",   was: "Das Tor geht auf, dahinter ein Schloss — und ein eiskalter Wind" },
    { gr: "fahrzeuge", w: "kitt",  kurz: "rider",  nutzt: "/kitt",      was: "Der schwarze Wagen mit dem roten Lauflicht" },
    { gr: "tiere", w: "dino",     kurz: "rex",    nutzt: "/dino",      was: "Gezeichnet: ein Tyrannosaurus kommt näher und brüllt" },
    { gr: "welt", w: "jalousie",  kurz: "durchblick",  nutzt: "/jalousie",  was: "Die Jalousie kippt auf — dahinter eine andere Welt" },
    { gr: "welt", w: "handdurch", kurz: "zombie", nutzt: "/handdurch", was: "Eine Hand reisst von unten durch den Chat und greift nach dir" },
    { gr: "welt", w: "tore",      kurz: "riegel", nutzt: "/tore",      was: "Zwei Tore knallen zu und das Schloss legt sich vor" },
    { gr: "welt", w: "paintball", kurz: "klecks", nutzt: "/paintball [Name]", was: "Farbkugeln schlagen ein — mit Namen trifft es genau ein Profilbild" },
    { gr: "tiere", w: "enten",     kurz: "ente",   nutzt: "/enten",     was: "Die Entenmama watschelt mit ihren Küken durchs Bild" },
    { gr: "tiere", w: "katze",     kurz: "kaetzchen", nutzt: "/katze",  was: "Film: das Katzenbaby tappt an die Scheibe" },
    { gr: "fahrzeuge", w: "route66", kurz: "highway", nutzt: "/route66", was: "Ein Wagen kommt über die Route 66 auf dich zu" },
    { gr: "feier", w: "prunk",     kurz: "tiktok", nutzt: "/prunk",     was: "Ein grosses Geschenk geht auf — Strahlen, Funken und Münzregen" },
    { gr: "feier", w: "ggelefant", kurz: "elefant",nutzt: "/elefant Name", was: "Geschenk: ein Elefant steigt aus der Kiste" },
    { gr: "feier", w: "gghai",     kurz: "hai",    nutzt: "/hai Name",     was: "Geschenk: ein Hai steigt aus der Kiste" },
    { gr: "feier", w: "ggbaer",    kurz: "baer",   nutzt: "/baer Name",    was: "Geschenk: ein Bär steigt aus der Kiste" },
    /* =========================================================
       DIE FILME — TIERE UND FAHRZEUGE
       ---------------------------------------------------------
       GEMELDET: „Ich weiss nicht, ob die schon auftauchen, die
       Sachen — in Tiere und Fahrzeuge finde ich das naemlich
       nicht." Er hatte recht: sie standen alle unter „Feiern",
       weil sie als Geschenke angefangen haben. Jetzt stehen die
       Tiere bei den Tieren und die Fahrzeuge bei den Fahrzeugen,
       und keiner von ihnen verschenkt mehr etwas.
       ========================================================= */
    { gr: "tiere", w: "trex",      kurz: "dinosaurier", nutzt: "/trex",   was: "Film: der T-Rex bricht heran — der Boden bebt" },
    { gr: "tiere", w: "loewe",     kurz: "lion",   nutzt: "/loewe",       was: "Film: der Löwe kommt und brüllt" },
    { gr: "tiere", w: "adler",     kurz: "greif",  nutzt: "/adler",       was: "Film: der Adler zieht über den Chat" },
    { gr: "fahrzeuge", w: "lok",   kurz: "dampflok", nutzt: "/lok",       was: "Film: die Dampflok kommt heran, der Chat rattert" },
    { gr: "fahrzeuge", w: "raumschiff", kurz: "ufo", nutzt: "/raumschiff", was: "Film: das Raumschiff zieht am Ringplaneten vorbei (auch /ufo)" },
    { gr: "fahrzeuge", w: "uboot", kurz: "tiefsee", nutzt: "/uboot",      was: "Film: das U-Boot taucht ab, der Krake greift zu" },
    { gr: "feier", w: "kassette",  kurz: "tape",   nutzt: "/kassette",  was: "Achtziger: eine Musikkassette spult zurück, die Wickel drehen sich" },
    { gr: "feier", w: "pacman",    kurz: "pac",    nutzt: "/pacman [Name]", was: "Achtziger: Pac-Man frisst sich durch den Chat — mit Namen jagt er ueber die Plaetze und frisst denjenigen von der Buehne" },
    { gr: "welt",  w: "vhs",       kurz: "video",  nutzt: "/vhs",       was: "Achtziger: das Bild verreisst wie bei einem alten Videoband" },
    { gr: "feier", w: "disko",     kurz: "kugel",  nutzt: "/disko",     was: "Achtziger: die Spiegelkugel dreht sich und wirft Lichtflecken" },
    { gr: "fahrzeuge", w: "pirat",  kurz: "schiff", nutzt: "/pirat",     was: "Ein Piratenschiff mit Totenkopfflagge" },
    { gr: "welt", w: "strudel",    kurz: "sog",    nutzt: "/strudel",   was: "Der Chat wird in einen Strudel gezogen — mit Namen dahinter zieht er nur dieses eine Profilbild ein" },
    { gr: "welt", w: "schwamm",    kurz: "wischen", nutzt: "/schwamm",  was: "Ein Schwamm wischt den Chat wie eine Tafel" },
    { gr: "welt", w: "schuss",     kurz: "ballern", nutzt: "/schuss",   was: "Schusslöcher schlagen in den Chat, und es läuft herunter" },
    { gr: "wetter", w: "wolken",    kurz: "wolke",  nutzt: "/wolken",    was: "Wolken ziehen über den Raum" },
    { gr: "welt", w: "glasbruch", kurz: "sprung", nutzt: "/glasbruch", was: "Das Display zerspringt — mit echten Rissen" },
    { gr: "tiere", w: "spinnen",   kurz: "spinne", nutzt: "/spinnen",   was: "Spinnen krabbeln über den Chat" },
    { gr: "welt", w: "noten",     kurz: "melodie",nutzt: "/noten",     was: "Noten steigen auf und klingen dabei wirklich \u2014 /noten 3 spielt den Refrain von Lied 3" },
    { gr: "feier", w: "halloween", kurz: "",   nutzt: "/halloween",           was: "Fledermäuse, Geister und Kürbisse" },
    { gr: "feier", w: "weihnachten", kurz: "advent", nutzt: "/weihnachten",   was: "Schnee, Sterne und Geschenke" },
    { gr: "aussehen", w: "schrift", kurz: "font", nutzt: "/schrift 1-4",     was: "Schrift im Chat" },
    { gr: "aussehen", w: "hintergrund", kurz: "bg", nutzt: "/hintergrund",    was: "Eigenes Bild hinter den Chat (/hintergrund weg nimmt es)" },
    { gr: "reden", w: "c",       kurz: "farbe",nutzt: "/c Farbe",            was: "Farbe für Name und Schrift" },
    { gr: "reden", w: "cname",   kurz: "colorname", nutzt: "/c name Farbe", was: "Farbe nur für den Namen" },
    { gr: "schule", w: "rw",    kurz: "rueckwaerts", nutzt: "/rw Text",      was: "Satz rückwärts" },
    { gr: "schule", w: "satz",  kurz: "satzpuzzle",  nutzt: "/satz Satz",    was: "Wörter durcheinander — die anderen ordnen sie" },
    { gr: "schule", w: "wort",  kurz: "wortpuzzle",  nutzt: "/wort Wort",    was: "Buchstaben durcheinander" },
    { gr: "schule", w: "aufgabe", kurz: "frage",     nutzt: "/aufgabe <Text>", was: "Eine Aufgabe in eigenen Worten — was die anderen danach schreiben, gilt als Antwort und kann benotet werden (/aufgabe ohne Text beendet sie)" },
    { gr: "schule", w: "betonung", kurz: "beton", nutzt: "/betonung <Wort oder Satz>", was: "Betonungsübung: die anderen tippen an, welche Silbe betont wird — die Silben kommen aus dem Wörterbuch, die Antwort lässt sich benoten (/betonung ohne Text beendet sie)" },
    { gr: "schule", w: "raten", kurz: "aufdecken", nutzt: "/raten Satz",     was: "Aufdecken: ein Satz mit verdeckten Buchstaben (/raten allein nimmt eine Redewendung, /raten liste zeigt alle)" },
    { gr: "schule", w: "note",  kurz: "zensur",      nutzt: "/note Name 1-6", was: "Zensur (nur Lehrer)" },
    { gr: "schule", w: "klassensprecher", kurz: "sprecher", nutzt: "/klassensprecher Name", was: "Vertretung für den Lehrer" },
    { gr: "schule", w: "nachhoeren", kurz: "mitschrieb", nutzt: "/nachhören",  was: "Alles Gesprochene im Chat einblenden — zum Nachhören und Herunterladen" },
    { gr: "spass",  w: "film",  kurz: "",           nutzt: "/film Name",     was: "Film über den Chat legen — /film zeigt alle" },
    { gr: "hilfe",  w: "diagnose", kurz: "befund", nutzt: "/diagnose",        was: "Was ist von hier aus erreichbar: Konto, Datenbank, Postfach, dein Rang" },
    { gr: "schule", w: "unterricht", kurz: "glocke", nutzt: "/unterricht [<Text>]", was: "Nur der Betreiber: die Einladung zum Unterricht in jedes Postfach, mit Link hierher" },
    { gr: "schule", w: "weg",        kurz: "zurueck",    nutzt: "/weg",         was: "Deine letzte Sprachnachricht zurückrufen — sie verschwindet bei allen" },
    { gr: "schule", w: "fokus", kurz: "fokusmodus", nutzt: "/fokus",           was: "Zuhören statt durcheinanderreden: solange jemand spricht, nimmt niemand auf" },
    { gr: "aussehen", w: "sprechbild", kurz: "sprechen", nutzt: "/sprechbild Art", was: "Wie dein Platz beim Sprechen aussieht" },
    { gr: "reden", w: "cschrift",kurz: "colorfont", nutzt: "/c schrift Farbe", was: "Farbe nur für die Schrift" },
    { gr: "raum", w: "leave",   kurz: "part", nutzt: "/leave",              was: "Zurück ins Klassenzimmer" },
    { gr: "hilfe", w: "h",       kurz: "help", nutzt: "/h",                  was: "Diese Liste" }
  ];

  /* =========================================================
     JEDER BEFEHL BEKOMMT SEIN ZEICHEN
     ---------------------------------------------------------
     GEWUENSCHT: „Ich hatte auch am Anfang gesagt, dass die
     Animationen — wenn zum Beispiel die Pinguine sind, dass da
     ein kleines Symbol fuer Pinguine ist, dass man weiss, dass
     das visuell auch dargestellt ist. Oder eben #pinguin,
     einfach das Emoji auch moeglich machen, den Pinguin zu
     schicken, und der ist schon in der Auswahl voreingestellt
     zu sehen."

     Die Zeichen stehen HIER und nicht in jeder einzelnen Zeile
     der Tabelle darueber: so bleibt die Tabelle lesbar, und ein
     neuer Befehl bekommt sein Zeichen mit einem Wort statt mit
     einer Zeilenaenderung. Was kein eigenes Zeichen hat, bekommt
     das seiner Gruppe — ein Befehl ohne Zeichen saehe in der
     Auswahl aus, als fehle etwas.

     Und das Zeichen ist nicht nur Schmuck: man kann es TIPPEN.
     Wer 🐧 in den Chat schreibt, schickt die Pinguine; wer
     #pinguine schreibt, auch. Siehe befehlAusZeichen().
     ========================================================= */
  var GRUPPEN_ZEICHEN = { reden: "\ud83d\udcac", raum: "\ud83d\udeaa", chef: "\ud83d\udc51",
                          zeichen: "\u2328\ufe0f", feier: "\ud83c\udf89", wetter: "\u2614",
                          tiere: "\ud83e\udd8b", fahrzeuge: "\ud83d\ude82",
                          welt: "\ud83c\udf0b", aussehen: "\ud83c\udfa8",
                          hilfe: "\u2753", schule: "\ud83c\udf92", spass: "\ud83c\udfac" };
  var BEFEHL_ZEICHEN = {
    me: "\ud83e\uddcd", s: "\ud83d\udce3", w: "\ud83e\udd2b", j: "\ud83d\udeaa", i: "\u2709\ufe0f",
    f: "\ud83d\udc63", n: "\ud83d\udc65", l: "\ud83d\uddfa\ufe0f", t: "\ud83d\udcdd",
    lock: "\ud83d\udd12", unlock: "\ud83d\udd13", op: "\u2b50", deop: "\u2b55",
    k: "\ud83d\udc62", stumm: "\ud83d\udd07", entstumm: "\ud83d\udd0a",
    knebel: "\ud83e\udd10", entknebel: "\ud83d\ude42", lach: "\ud83d\ude02",
    ascii: "\ud83d\udd24", bild: "\ud83d\uddbc\ufe0f", herz: "\u2764\ufe0f",
    drueck: "\ud83e\udd17", tausch: "\ud83d\udd04", verbindung: "\ud83d\udd0c",
    leck: "\ud83d\ude1c", box: "\ud83e\udd4a", konfetti: "\ud83c\udf8a", ballon: "\ud83c\udf88",
    tritt: "\u26bd", wasser: "\ud83e\udea3", wecker: "\u23f0", hammer: "\ud83d\udd28",
    heb: "\ud83e\ude9d",
    geschenk: "\ud83c\udf81", schnee: "\u2744\ufe0f", regen: "\ud83c\udf27\ufe0f",
    feuerwerk: "\ud83c\udf86", gewitter: "\u26c8\ufe0f", erdbeben: "\ud83c\udf0d",
    vulkan: "\ud83c\udf0b", schmetterling: "\ud83e\udd8b", voegel: "\ud83d\udc26",
    schlitten: "\ud83c\udf85", rennauto: "\ud83c\udfce\ufe0f", bonbon: "\ud83c\udf6d",
    orkan: "\ud83c\udf2a\ufe0f", finsternis: "\ud83c\udf11", lagerfeuer: "\ud83d\udd25",
    sternschnuppe: "\ud83c\udf20", matrix: "\ud83d\udfe9", falten: "\ud83d\udcd0",
    armageddon: "\u2604\ufe0f", sintflut: "\ud83c\udf0a", aegypten: "\ud83d\udc2a",
    ostern: "\ud83d\udc07", augen: "\ud83d\udc40", geld: "\ud83d\udcb0", keks: "\ud83c\udf6a",
    seifenblasen: "\ud83e\udee7", herbst: "\ud83c\udf42", aquarium: "\ud83d\udc20",
    pinguine: "\ud83d\udc27", fratze: "\ud83d\udc79", blut: "\ud83e\ude78",
    schloss: "\ud83c\udff0", kitt: "\ud83d\ude97", dino: "\ud83e\udd96",
    jalousie: "\ud83e\ude9f", handdurch: "\ud83d\udd90\ufe0f", tore: "\u26bd",
    paintball: "\ud83c\udfaf", enten: "\ud83e\udd86", katze: "\ud83d\udc08",
    route66: "\ud83d\udee3\ufe0f", prunk: "\ud83d\udc8e", loewe: "\ud83e\udd81",
    trex: "\ud83e\udd95", ggelefant: "\ud83d\udc18", adler: "\ud83e\udd85",
    gghai: "\ud83e\udd88", ggbaer: "\ud83d\udc3b",
    lok: "\ud83d\ude82",
    raumschiff: "\ud83d\ude80", uboot: "\ud83d\udea2", kassette: "\ud83d\udcfc",
    pacman: "\ud83d\udc7e", disko: "\ud83e\udea9", pirat: "\ud83c\udff4\u200d\u2620\ufe0f",
    strudel: "\ud83c\udf00", schwamm: "\ud83e\uddfd", schuss: "\ud83d\udca5",
    wolken: "\u2601\ufe0f", glasbruch: "\ud83e\ude9e", spinnen: "\ud83d\udd77\ufe0f",
    noten: "\ud83c\udfb5", halloween: "\ud83c\udf83", weihnachten: "\ud83c\udf84",
    schrift: "\ud83d\udd24", hintergrund: "\ud83d\uddbc\ufe0f", c: "\ud83c\udfa8",
    cname: "\ud83c\udff7\ufe0f", cschrift: "\u270f\ufe0f", rw: "\u21a9\ufe0f",
    satz: "\ud83e\udde9", wort: "\ud83d\udd20", note: "\ud83d\udccb",
    raten: "\ud83c\udfa1",
    klassensprecher: "\ud83c\udf93", nachhoeren: "\ud83c\udfa7", weg: "\u21a9\ufe0f", unterricht: "\ud83d\udd14",
    diagnose: "\ud83d\udd0c",
    fokus: "\ud83c\udfa7",
    leave: "\ud83d\udc4b",
    h: "\u2753"
  };
  BEFEHLE.forEach(function (b) {
    b.sym = BEFEHL_ZEICHEN[b.w] || GRUPPEN_ZEICHEN[b.gr] || "\u2b50";
  });

  /* Welcher Befehl steckt hinter einem Zeichen oder hinter
     „#wort"? Gibt das Befehlswort zurueck oder "" — geraten wird
     nichts, es zaehlt nur, was wirklich in der Tabelle steht. */
  function befehlAusZeichen(text) {
    var t = String(text || "").trim();
    if (!t) return "";
    if (t.charAt(0) === "#") {
      var wort = t.slice(1).split(/\s+/)[0].toLowerCase();
      var da = BEFEHLE.filter(function (b) { return b.w === wort || b.kurz === wort; })[0];
      return da ? da.w : "";
    }
    /* Genau EIN Zeichen und sonst nichts — „🐧 schau mal" ist ein
       Satz mit einem Pinguin darin und kein Befehl. */
    var treffer = BEFEHLE.filter(function (b) { return b.sym && b.sym === t; })[0];
    return treffer ? treffer.w : "";
  }

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
                fische: "aquarium", fisch: "aquarium",
                meer: "aquarium", unterwasser: "aquarium",
                pinguin: "pinguine", antarktis: "pinguine",
                daemon: "fratze", teufel: "fratze", gruselig: "fratze",
                horror: "blut", blutig: "blut",
                hollow: "schloss", burg: "schloss", gruft: "schloss",
                rider: "kitt", knightrider: "kitt", pontiac: "kitt", firebird: "kitt",
                rex: "dino", saurier: "dino",
                durchblick: "jalousie", kippfenster: "jalousie",
                zombie: "handdurch", griff: "handdurch",
                riegel: "tore", abschliessen: "tore", zusperren: "tore",
                paint: "paintball", farbklecks: "paintball", klecks: "paintball",
                ton: "verbindung", audio: "verbindung", leitung: "verbindung",
                platz: "tausch", platzwechsel: "tausch",
                /* „lasso" ist jetzt ein eigener Befehl (zu mir heranziehen)
                   und darf deshalb NICHT mehr auf /heb zeigen —
                   pruefe-jeder-befehl wuerde das sonst zu Recht als
                   verdeckten Alias melden. */
                umsetzen: "heb", wagenheber: "heb", heben: "heb",
                ziehen: "heb", hieven: "heb",
                sitzen: "tausch", setz: "tausch",
                lecken: "leck", schlecken: "leck", ablecken: "leck",
                boxen: "box", schlag: "box", faust: "box",
                fussball: "tritt", ball: "tritt", kicken: "tritt", schuss2: "tritt",
                eimer: "wasser", wassereimer: "wasser", uebergiessen: "wasser",
                wecken: "wecker", aufwecken: "wecker", klingeln: "wecker",
                bonk: "hammer", klopfen: "hammer",
                ente: "enten", entchen: "enten", kueken: "enten", entenmama: "enten",
                kaetzchen: "katze", katzenbaby: "katze", kitten: "katze", miau: "katze",
                highway: "route66", route: "route66",
                strasse: "route66", trans: "route66", muscle: "route66",
                prunkgeschenk: "prunk",
                muenzen: "prunk", gold: "prunk",
                /* Die grossen Geschenke — man tippt das Tier, nicht
                   den inneren Namen. */
                loewin: "loewe", lion: "loewe", ggloewe: "loewe",
                /* „dino" bleibt beim alten Dino-Effekt — einen
                   bestehenden Befehl wegzunehmen waere schlimmer als
                   eine Abkuerzung weniger. */
                tyrannosaurus: "trex", dinosaurier: "trex", ggtrex: "trex",
                elefant: "ggelefant", elefantt: "ggelefant", ruessel: "ggelefant",
                greif: "adler", ggadler: "adler",
                hai: "gghai", haifisch: "gghai", weisshai: "gghai",
                baer: "ggbaer", baerchen: "ggbaer",
                lokomotive: "lok",
                eisenbahn: "lok", bahn: "lok", gglok: "lok",
                /* Es gibt nur noch EINE Lok (die bunte). Die alten
                   Namen zeigen alle auf sie, damit keine Zeile von
                   gestern ins Leere faellt. */
                zug: "lok", schnellzug: "lok", lok2: "lok", gglok2: "lok",
                dampfzug: "lok",
                /* GEWUENSCHT: „das Spaceship kannst du als UFO als
                   Code gelten lassen." */
                ufo: "raumschiff", spaceship: "raumschiff", rakete: "raumschiff",
                weltraum: "raumschiff", enterprise: "raumschiff",
                ggraumschiff: "raumschiff",
                krake: "uboot", kraken: "uboot",
                tiefsee: "uboot", nemo: "uboot", gguboot: "uboot",
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
                wischen: "schwamm", tafelwischen: "schwamm", putzen: "schwamm",
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
      /* WORAN MAN SIEHT, DASS EIN BEFEHL EINEN NAMEN BRAUCHT.
         -----------------------------------------------------------
         Hier stand  /<name>/  — gesucht wurde also die Schreibweise
         „/w <name> <text>". Genau die spitzen Klammern habe ich aber
         irgendwann aus der Hilfe genommen (Emmy hatte sie mitgetippt,
         weil sie wie Teil des Befehls aussahen). Seitdem traf dieser
         Ausdruck NIRGENDS mehr zu — und damit schlug die Tipphilfe
         keinen einzigen Namen mehr vor. Genau das war gemeldet:
         „Wenn ich /w schreibe, sollen mir die Namen vorgeschlagen
         werden."
         Jetzt wird gelesen, was wirklich dasteht: „/w Name Text". */
      var teile = String(b.nutzt || "").trim().split(/\s+/);
      var hinterDemBefehl = teile.slice(1);
      var willName = hinterDemBefehl.some(function (t) {
        return /^(name|nickname)$/i.test(t);
      }) || /<\s*(name|nickname)\s*>/i.test(b.nutzt || "");
      /* „/c name Farbe" meint die Namensfarbe, keinen Menschen. */
      if (b.w === "cname") willName = false;
      return { w: b.w, gr: b.gr || "welt", nutzt: b.nutzt, was: b.was, kurz: b.kurz,
               brauchtName: willName,
               brauchtText: hinterDemBefehl.length > (willName ? 1 : 0) };
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
  /* DER TITEL DARF DAS NEULADEN UEBERLEBEN.
     -----------------------------------------------------------
     GEMELDET: „Ich kann es nicht in den Livestream-Modus versetzen,
     weil der Titel immer rausgeht, wenn ich die Seite aktualisiere.
     Der Fokus-Modus soll immer dastehen und der Titel, den ich
     waehle, auch."
     Das Thema stand bisher nur im Arbeitsspeicher und kam sonst von
     den anderen im Raum herein. War niemand sonst da, war es nach
     dem Neuladen weg. Jetzt liegt es je Raum im Geraet — wer den
     Titel gesetzt hat, findet ihn wieder vor. */
  var THEMA_SCHLUESSEL = "dma_livechat_thema_";
  function themaMerken(raum, text) {
    try {
      if (text) localStorage.setItem(THEMA_SCHLUESSEL + raum, String(text).slice(0, 120));
      else localStorage.removeItem(THEMA_SCHLUESSEL + raum);
    } catch (e) {}
  }
  function gemerktesThema(raum) {
    try { return localStorage.getItem(THEMA_SCHLUESSEL + raum) || ""; } catch (e) { return ""; }
  }

  /* DIE FOKUS-REGEL UEBERLEBT JETZT DAS NEULADEN.
     -----------------------------------------------------------
     GEMELDET: „Ich hab es extra eingestellt, dass wir uns alle
     gleichzeitig hoeren koennen, und trotzdem geht es nicht."

     Die Regel gehoert dem Raum, und der Raum ist die Summe der
     Anwesenden — das ist richtig so. Nur hatte das eine Luecke,
     die genau den Haeuptling trifft: laedt ER die Seite neu,
     kommt er mit der Voreinstellung „Fokus an" zurueck, und weil
     die anderen die Regel VOM Haeuptling uebernehmen, schaltet
     sein Neuladen sie allen wieder ein. Von aussen sieht es aus,
     als haette das Umschalten nie gewirkt.

     Deshalb merkt sich das Geraet, das schalten DARF, seine
     Entscheidung — je Raum, wie beim Thema. Geschrieben wird der
     Merker nur in fokusSetzen(), und das darf ohnehin nur der
     Lehrer oder Haeuptling; auf einem anderen Geraet steht also
     nie etwas drin, das es aufdraengen koennte. */
  var FOKUS_SCHLUESSEL = "dma_livechat_fokus_";
  function fokusMerken(raum, an) {
    try { localStorage.setItem(FOKUS_SCHLUESSEL + raum, an ? "1" : "0"); } catch (e) {}
  }
  function gemerkterFokus(raum) {
    try {
      var v = localStorage.getItem(FOKUS_SCHLUESSEL + raum);
      return v === null ? undefined : v === "1";
    } catch (e) { return undefined; }
  }

  var NAME_AUF = "\u0001", NAME_ZU = "\u0002";
  /* GROSS SCHREIBEN — ABER NICHT DIE MARKEN.
     -----------------------------------------------------------
     GEMELDET: „Dann schreit sie etwas, und da steht ploetzlich in
     Klammern, als wenn es kodiert hier ankommt."

     Genau das war es. Ein Text kann Marken enthalten, die kein
     Mensch schreibt und kein Mensch lesen soll:
         [fox:gold]        ein Sammelfuchs
         \u0001Name\u0002    der von /me/ eingesetzte Eigenname
     Der Schrei hat bisher toUpperCase() ueber den GANZEN Text
     gelegt. Aus [fox:gold] wurde dabei [FOX:GOLD] — und der
     Zeichner sucht kleingeschrieben. Die Marke wurde also nicht
     mehr erkannt und stand als roher Text in der Zeile.

     Deshalb wird jetzt nur das grossgeschrieben, was auch
     jemand gelesen haben will: der Text ZWISCHEN den Marken. */
  var MARKEN = /(\[fox:[\w-]+\]|\u0001[^\u0002]*\u0002)/g;
  function grossOhneMarken(text) {
    return String(text).split(MARKEN).map(function (teil) {
      if (!teil) return teil;
      if (teil.charAt(0) === "\u0001") return teil;
      if (/^\[fox:[\w-]+\]$/.test(teil)) return teil;
      return teil.toUpperCase();
    }).join("");
  }
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

  /* =========================================================
     FLUESTERN — TEXT ODER BILD, IMMER DERSELBE WEG
     ---------------------------------------------------------
     GEWUENSCHT: „Mach es bitte ausserdem moeglich, dass wir uns
     Bilder fluestern koennen."

     Ein Bild zu fluestern ist dasselbe wie einen Satz zu fluestern —
     nur haengt eben ein Bild daran. Damit das nicht an zwei Stellen
     halb gebaut wird, geht beides durch diese eine Funktion:

       1. die eigene Zeile (nur ich sehe sie, mit „an Emmi:“ davor),
       2. die Tabelle (damit es ankommt, auch wenn die andere Seite
          gerade den Raum wechselt oder gar nicht da ist),
       3. der Zuruf von Geraet zu Geraet (damit es SOFORT da ist).

     Die Kennung ist bei allen dreien dieselbe — sonst stuende die
     Zeile beim Empfaenger doppelt, einmal live und einmal aus der
     Tabelle.
     ========================================================= */
  function fluesternSenden(ziel, txt, bild) {
    if (!ziel) return false;
    var text = String(txt || "");
    var daten = typeof bild === "string" ? bild : "";
    if (!text && !daten) return systemZeile("Da war nichts zu fluestern.");
    var beschriftung = "an " + ziel.name + ": " + (text || (daten ? "🖼️ Bild" : ""));
    var n = eigeneZeile("fluester", beschriftung, ziel.id);
    if (daten) {
      n.bildImChat = daten;
      bildGemerkt(daten);              // auch ein gefluestertes Bild kommt in „zuletzt benutzt“
    }
    fluesternSichern(ziel, text, n.id, daten);
    /* An WEN es ging, steht damit auch an der Zeile — die Oberflaeche
       bietet daran das Weiterfluestern an, ohne den Text zu zerlegen. */
    n.wen = ziel.name;
    postSenden(ziel.id, { art: "fluester", id: n.id, text: text,
                          bildImChat: daten,
                          raum: zustand.raum, zeit: n.zeit });
    melden();
    return true;
  }

  /* Ein Bild an EINE Person — von der Oberflaeche aus (Bildwaehler).
     Der Name kommt so herein, wie er im Raum steht. */
  function bildFluestern(name, quelle, text) {
    var ziel = personNachName(name) || praesenzNachName(name);
    if (!ziel) return systemZeile("„" + String(name) + "“ ist gerade nirgends zu finden.");
    var daten = String(quelle || "");
    if (!daten) return false;
    return fluesternSenden(ziel, String(text || ""), daten);
  }

  /* Ein Foto aus einer Datei — erst kleinrechnen, dann fluestern.
     Dieselbe Verkleinerung wie beim offenen Bild; ein Telefonfoto
     unbearbeitet durch den Kanal zu schicken, geht nicht gut. */
  function fotoFluestern(name, datei, text) {
    return bildVerkleinern(datei).then(function (daten) {
      return bildFluestern(name, daten, text);
    });
  }

  function eigeneZeile(art, text, an) {
    var n = {
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: text, art: art, zeit: Date.now(), eigen: true,
      bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName, an: an || ""
    };
    nachrichtAnhaengen(n);
    return n;
  }

  /* HINWEISE GEHOEREN NICHT IN DEN CHAT.
     -----------------------------------------------------------
     GEMELDET: „Die Wortmeldungen von ‚Emmy hat deine Wortmeldung
     bekommen' sollen sich aufloesen und weg sein, das soll nicht
     mehr im Chat stehen. Und auch ‚die letzte Wortmeldung von
     Emmy, damit du weisst, worum es gerade geht' — die sprengt den
     Chat, oder wie wir frueher gesagt haben: die spammt den Chat
     voll. Das soll alles nicht ankommen, ich soll das nicht alles
     lesen."

     Er hat recht: was nur den Augenblick betrifft, gehoert in eine
     Blase, die von selbst verschwindet — nicht in den Verlauf, den
     man spaeter durchliest. Der Chat ist das Gespraech; alles
     andere zieht vorbei. app.js meldet sich mit beiHinweis an. */
  var hinweisRuf = null;
  /* EINMAL REICHT.
     GEMELDET: „Es soll mich nicht staendig ueberfluten mit diesen
     Blasen-Benachrichtigungen. Das reicht, wenn ich das einmal
     gesehen habe. Ich kenne das Prinzip mittlerweile."
     Also bekommt jede Erklaerung einen Namen, und unter diesem Namen
     wird im Geraet vermerkt, dass sie gezeigt wurde. Danach
     schweigt sie — fuer immer, nicht nur fuer heute. Wirft der
     Speicher (privates Fenster), wird sie eben noch einmal gezeigt;
     das ist der harmlosere Fehler. */
  function hinweisSchonGesehen(marke) {
    if (!marke) return false;
    try {
      if (localStorage.getItem("dma_lc_hinweis_" + marke) === "1") return true;
      localStorage.setItem("dma_lc_hinweis_" + marke, "1");
      return false;
    } catch (e) { return false; }
  }
  function hinweisZeigen(text, marke) {
    if (typeof hinweisRuf !== "function") return;
    if (marke && hinweisSchonGesehen(marke)) return;
    try { hinweisRuf(String(text || "")); } catch (e) {}
  }

  /* EINE ZEILE, DIE SICH SELBST WIEDER AUFRAEUMT.
     GEWUENSCHT: „Wenn da steht, dass Emmy meine Wortmeldung bekommen
     hat und das wurde wirklich erfolgreich uebermittelt — kann die
     Nachricht wieder ausgeblendet werden, damit der Chat frei
     bleibt?"
     Ja. Eine Quittung ist eine Auskunft fuer den Augenblick, kein
     Gespraechsbeitrag. Sie steht ein paar Sekunden da und geht dann
     von selbst. */
  function fluechtigeZeile(text, wielang) {
    var n = eigeneZeile("system", text);
    var weg = String(n && n.id);
    setTimeout(function () {
      zustand.nachrichten = zustand.nachrichten.filter(function (m) {
        return !(m && String(m.id) === weg);
      });
      melden();
    }, wielang || 8000);
    return n;
  }

  /* Eine Zeile, die nur ich sehe (Antworten des Systems). */
  function systemZeile(text) {
    eigeneZeile("system", text);
    melden();
    return true;
  }

  /* =================================================================
     ALLE ZUSATZFELDER EINER ZEILE — AN EINER EINZIGEN STELLE
     -----------------------------------------------------------------
     GEMELDET, zuletzt woertlich: „ich glaube, die andere Seite sieht
     noch nicht alles. Schau nach, dass die Effekte auf beiden Seiten
     synchron sind. Die Aufgabe des Aufdeckens — jede Aufgabe soll auf
     beiden Seiten ueberall sichtbar sein."

     Er hat recht, und es ist IMMER derselbe Fehler gewesen: ein neues
     Feld wird beim Senden angehaengt und an EINER der beiden
     Empfangsstellen vergessen. So ist es „wen" ergangen, den
     gemischten Saetzen, dem Lied — und zuletzt dem Aufdecken.

     Damit ist jetzt Schluss. Es gibt EINE Liste, und alle drei Stellen
     lesen sie:
       1. anAlle  — die eigene Zeile,
       2. empfangen — die Zeile der anderen,
       3. das Verlaufspaket — fuer die, die spaeter dazukommen.
     Ein neues Feld wird hier eingetragen und ist damit ueberall da. */
  var ZUSATZ_FELDER = [
    "wirkung", "wen", "an", "film", "betonung", "raten", "dran",
    "sortieren", "leseZeilen", "leseTitel", "leseNiveau",
    "lied", "liedTitel", "liedAb", "wortLink", "los", "tempo"
  ];
  /* Listen werden begrenzt — eine Zeile aus einer fremden Fassung
     darf den Chat nicht sprengen. */
  var ZUSATZ_LISTEN = { sortieren: 8, leseZeilen: 40 };
  function zusatzUebernehmen(ziel, quelle) {
    if (!ziel || !quelle) return ziel;
    ZUSATZ_FELDER.forEach(function (f) {
      var w = quelle[f];
      if (w === undefined || w === null || w === "") return;
      if (ZUSATZ_LISTEN[f]) {
        if (Array.isArray(w)) ziel[f] = w.slice(0, ZUSATZ_LISTEN[f]);
        return;
      }
      ziel[f] = typeof w === "string" ? w : String(w);
    });
    return ziel;
  }

  function anAlle(art, text, zusatz) {
    var n = eigeneZeile(art, text);
    /* ALLE Zusatzfelder auf einmal — die Liste steht oben bei
       ZUSATZ_FELDER. Vorher stand hier fuer jedes Feld eine eigene
       Zeile, und genau eine davon wurde jedes Mal vergessen. */
    zusatzUebernehmen(n, zusatz);
    serverSichern({ id: n.id, name: n.name, bild: n.bild, text: text, art: art });
    var post = { art: "text", id: n.id, name: n.name, text: text, zeit: n.zeit,
                 bild: zustand.ichBild, chatArt: art, farbe: zustand.farbe, farbeName: zustand.farbeName,
                 sprechbild: zustand.sprechbild, geschlecht: zustand.geschlecht || "" };
    if (zusatz) Object.keys(zusatz).forEach(function (k) { post[k] = zusatz[k]; });
    senden(post);
    melden();
    /* Die Zeile selbst zurueckgeben, nicht nur „true": Wer eine
       Aufgabe stellt, braucht ihre Kennung (siehe aufgabeStellen).
       Ein Objekt ist ebenso wahr wie true — alle anderen Aufrufer
       merken davon nichts. */
    return n;
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
  /* Zum Nachmessen: die Pakete an EINE Person abfangen. Im Betrieb
     ist der Haken immer null. Ohne ihn liesse sich nicht pruefen, ob
     eine Note wirklich hinausgeht — und genau daran hing es. */
  var pruefPostHaken = null;
  function postSenden(anId, nutzlast) {
    if (pruefPostHaken) { try { pruefPostHaken(anId, nutzlast); } catch (e) {} }
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
    /* PUNKTE FUER EINE RICHTIGE ANTWORT ODER EINE GUTE ZENSUR.
       -------------------------------------------------------
       GEWUENSCHT: „Dass diese Klassenzimmer-Aufgaben, die wir da im
       Chat haben, auch wirklich in die Bewertung von den Leuten mit
       eingehen."

       Gebucht wird auf dem EIGENEN Geraet fuer das EIGENE Konto —
       ueber denselben Weg wie jede Spielrunde (punkteRuf zeigt auf
       saveResultAndCheck in app.js). Von aussen kann damit niemand
       ein fremdes Konto anfassen; es kommt nur die Mitteilung „das
       war richtig", und was daraus wird, entscheidet das Geraet des
       Empfaengers.

       Ein Deckel gehoert dazu: hoechstens 60 Punkte je Stunde aus
       dem Klassenzimmer. Sonst koennte jemand mit einem eigenen
       Raum den ganzen Tag „Aufgaben" an sich selbst stellen. */
    /* Eine Note fuer MICH. Sie kommt immer, auch bei einer 5 und
       einer 6 — siehe noteGeben(). */
    /* Der Tafelstand kommt als PERSOENLICHE Post — nur der Neue
       braucht ihn, nicht der ganze Raum noch einmal. */
    if (n.art === "tafel") {
      try { if (window.DMA_TAFEL) window.DMA_TAFEL(n.tafel || {}, n.von, n.vonName || ""); } catch (e) {}
      return;
    }
    /* Das Versteck und der Schuss — nur fuer den Schiedsrichter
       bestimmt. Sie stehen nirgendwo sonst, deshalb sieht auch
       niemand sonst, wo sich wer versteckt hat. */
    if (n.art === "spielpost") {
      if ((n.spiel || {}).t === "belegt") schiffeEmpfangen(n.spiel, n.von);
      else schiffeRichter(n.spiel || {}, n.von, n.vonName || "");
      return;
    }
    if (n.art === "note-fuer-dich") {
      var zahl = Math.round(Number(n.zahl) || 0);
      if (!(zahl >= 1 && zahl <= 6)) return;
      var wofuer = String(n.wofuer || "").slice(0, 40);
      var satz = "📋 Du hast eine " + zahl
        + (n.wort ? " (" + n.wort + ")" : "")
        + (wofuer ? " in " + wofuer : "")
        + " von " + (n.vonName || "deiner Lehrkraft") + " bekommen"
        + (n.punkte ? " — und " + n.punkte + " Punkte dazu." : ".");
      systemZeile(satz);
      /* Und einmal als Blase, die von selbst wieder verschwindet —
         damit sie es auch sieht, wenn sie gerade nicht in den Chat
         schaut. */
      if (typeof hinweisRuf === "function") { try { hinweisRuf(satz); } catch (e) {} }
      if (typeof zustand.notenRuf === "function") {
        try { zustand.notenRuf({ zahl: zahl, wofuer: wofuer, wort: n.wort || "",
                                 punkte: n.punkte || 0, von: n.vonName || "" }); } catch (e) {}
      }
      melden();
      return;
    }
    if (n.art === "punkte") {
      var wieviel = Math.max(0, Math.min(10, Math.round(Number(n.wieviel) || 0)));
      if (!wieviel) return;
      var jetzt = Date.now();
      punkteVerlauf = punkteVerlauf.filter(function (p) { return jetzt - p.t < 3600000; });
      var schon = punkteVerlauf.reduce(function (a, p) { return a + p.w; }, 0);
      if (schon + wieviel > 60) {
        systemZeile("Für diese Stunde ist die Punktegrenze aus dem Klassenzimmer erreicht — richtig war es trotzdem.");
        return;
      }
      punkteVerlauf.push({ t: jetzt, w: wieviel });
      if (typeof zustand.punkteRuf === "function") {
        try { zustand.punkteRuf(wieviel, String(n.grund || "Klassenzimmer")); } catch (e) {}
      }
      systemZeile("⭐ " + wieviel + " Punkte für dich — " + String(n.grund || "Klassenzimmer") + ".");
      return;
    }
    if (n.art === "fluester") {
      nachrichtAnhaengen({
        id: n.id || neueNachrichtId(), von: n.von, name: n.vonName || "Jemand",
        text: String(n.text || "").slice(0, CHAT_LAENGE), art: "fluester",
        /* Ein gefluestertes Bild kommt denselben Weg wie der Text —
           nur eben an eine einzige Person. */
        bildImChat: typeof n.bildImChat === "string" ? n.bildImChat.slice(0, 200000) : "",
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
    /* REDEVERBOT nimmt die Stimme, nicht die Tastatur — wer es hat,
       kann sich im Chat melden und entschuldigen.
       NICHT „stumm" nennen: so heisst im Rundruf schon die Meldung,
       ob jemand sein Mikrofon abgeschaltet hat. Zwei Dinge mit
       demselben Namen laufen irgendwann auseinander. */
    if (n.art === "redeverbot") {
      stummVon[n.von] = Boolean(n.an_);
      melden();
      systemZeile(n.an_
        ? "Deine Stimme ist gerade stummgeschaltet. Schreiben kannst du weiter — sag im Chat Bescheid, wenn du wieder mitreden möchtest."
        : "Du darfst wieder sprechen.");
      return;
    }
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
  var verlaufAngefragt = false;
  var verlaufFensterUhr = null;
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

  /* =========================================================
     WEN DIE ZEILE MEINT — UND WIE MAN IHN NENNT
     ---------------------------------------------------------
     GEMELDET: „Wenn es mich selbst betrifft und ich mache eine
     Animation, dann muss da stehen, dass er sich selbst ablegt,
     und nicht der Fox in Klammern du."

     Zwei Dinge liefen da zusammen. Der Name kam aus der
     Beschriftung unter dem Platz, und die heisst bei einem
     selbst „Name (du)" — das ist in app.js abgestellt. Und
     selbst mit sauberem Namen stand dann „Xander haut mit dem
     Hammer auf Xander", was niemand so sagt.

     Hier steht deshalb nur noch, WIE der Getroffene in der Zeile
     heisst: bei einem selbst „sich selbst", sonst sein Name. Was
     MITFAEHRT (wen), bleibt in jedem Fall der echte Name — die
     Animation muss den Platz ja finden. */
  function zielWort(wem) {
    if (!wem) return "";
    var ich = String(zustand.ichName || "").trim().toLowerCase();
    var da = String(wem.name || "").trim().toLowerCase();
    if (wem.ich === true || (ich && da === ich)) return "sich selbst";
    return wem.name;
  }

  function befehlAusfuehren(roh) {
    /* „/me/" ist KEIN Befehl, sondern der alte Trick: der eigene Name
       mitten im Satz. Ein Befehl ist es nur, wenn KEIN Schrägstrich
       folgt. Genau daran ist es bisher gescheitert — „/me/ denkt …"
       wurde als Aktion gelesen statt als ganz normale Zeile. */
    if (/^\/me\//i.test(roh.trim())) return false;
    /* ZIFFERN GEHOEREN ZUM BEFEHLSWORT.
       -----------------------------------------------------------
       GEMESSEN, nicht vermutet: alle 526 Schreibweisen (124 Befehle,
       ihre Kurzformen und 299 Aliase) einmal getippt und nachgesehen,
       was dabei herauskommt. Fuenf taten GAR NICHTS — /route66,
       /lok2, /gglok2, /meteor2 und /schuss2. Alle fuenf haben eine
       Ziffer im Wort, und genau die fehlte hier im Muster.

       Der Fehler war besonders still: befehlBekannt() kennt Ziffern
       ([a-zäöüß0-9]) und sagte „den gibt es" — die Sperre gegen
       erfundene Befehle liess die Zeile also durch. Hier fiel sie
       dann durchs Muster, befehlAusfuehren gab false zurueck, und
       niemand bekam etwas zu sehen: kein Effekt, keine Zeile, keine
       Fehlermeldung. Dass /highway, /route und /strasse gingen und
       nur /route66 nicht, hat es vollends verdeckt.

       Die beiden Muster kennen jetzt dieselben Zeichen. Gegenprobe
       in werkzeug/pruefe-jeder-befehl.js: jede der 526 Schreibweisen
       muss etwas tun. */
    var m = /^\/([a-zäöüß0-9?]+)\s+([\s\S]*)$|^\/([a-zäöüß0-9?]+)\s*$/i.exec(roh.trim());
    if (!m) return false;
    var wort = (m[1] || m[3] || "").toLowerCase(), rest = (m[2] || "").trim();

    /* SPITZE KLAMMERN SIND EINE ANLEITUNG, KEIN TEXT.
       -----------------------------------------------------------
       GEMELDET: „Ich weiss nicht, ob Emmy einen Fehler macht, aber
       sie schreibt immer diese komischen spitzen Klammern — oder
       versucht sie die Nachrichten zu schreiben, wie sie vorgegeben
       sind, mit dem Beispiel?"

       Genau so ist es, und der Fehler war meiner: in der Hilfe stand
       „/w <name> <text>". Wer das noch nie gesehen hat, liest die
       Klammern als Teil des Befehls und tippt sie mit. In der
       Befehlsliste stehen sie deshalb gar nicht mehr (dort heisst es
       jetzt „/w Name Text"), und wer sie trotzdem schreibt, soll
       nicht bestraft werden: eine Klammer, die ein Wort UMSCHLIESST,
       faellt hier einfach weg.

       Wichtig ist das „umschliesst": „<3" ist ein Herz und hat keine
       schliessende Klammer — daran wird nichts angefasst. */
    if (rest.indexOf("<") >= 0 && rest.indexOf(">") > rest.indexOf("<")) {
      rest = rest.replace(/<([^<>\s][^<>]*)>/g, "$1").trim();
    }

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

    /* ---- Der Panik-Knopf fuer den Ton ----
       „oder du gibst den Leuten eine Art Panic-Button, wo sie ihr
       Audio selber fixen koennen in dem Moment, wenn es anfaengt zu
       doppeln." Der Befehl tut dasselbe wie der Knopf im
       Klassenzimmer und meldet, was er gefunden hat. */
    /* Er heisst /panik und nicht /ton: „/ton" ist seit langem ein
       Kurzwort fuer /verbindung, und pruefe-jeder-befehl hat genau
       das gemeldet — „kein Alias wird von einem Befehl verdeckt".
       Ein neuer Befehl darf einem alten nicht die Bedeutung
       wegnehmen; wer /ton tippt, soll weiter den Verbindungsbefund
       bekommen. „Panik" ist ohnehin sein eigenes Wort dafuer. */
    if (art === "panik") {
      var erg = tonNeuAufbauen();
      return systemZeile("\ud83d\udd0a Ton neu aufgebaut."
        + (erg.doppelt ? " " + erg.doppelt + " doppelte Spur(en) angehalten." : "")
        + " " + erg.wieder + " Stimme(n) wieder angeschlossen."
        + (erg.doppelt ? "" : " Es war nichts doppelt \u2014 falls du trotzdem doppelt"
            + " hoerst, liegt es an einem zweiten offenen Fenster oder Geraet."));
    }

    /* ---- Reden ---- */
    if (art === "me") {
      if (!rest) return systemZeile("So geht es:  /me lacht laut");
      return anAlle("aktion", NAME_AUF + zustand.ichName + NAME_ZU + " " + textAufbereiten(rest));
    }
    if (art === "s") {
      if (!rest) return systemZeile("So geht es:  /s Hallo alle zusammen");
      return anAlle("ruf", grossOhneMarken(textAufbereiten(rest)));
    }
    if (art === "w") {
      var t = /^(\S+)\s+([\s\S]+)$/.exec(rest);
      if (!t) return systemZeile("So geht es:  /w Nickname Dein Text");
      var ziel = personNachName(t[1]) || praesenzNachName(t[1]);
      if (!ziel) return systemZeile("„" + t[1] + "“ ist gerade nirgends zu finden.");
      return fluesternSenden(ziel, textAufbereiten(t[2]), "");
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
    /* =====================================================
       EINLADEN — auch wen gerade gar nicht da ist
       -----------------------------------------------------
       GEMELDET: „Ich kann Emmi zum Beispiel immer noch nicht
       einladen. Da steht immer: Emmi ist gerade nirgends zu
       finden."

       Genau da lag die Luecke: /i suchte nur unter denen, die
       in diesem Augenblick offen im Raum oder in der
       Anwesenheitsliste standen. Wer die Seite nicht offen
       hatte, war „nirgends zu finden" — obwohl es ihn gibt.

       GEWUENSCHT: „Dann moechte ich sie mit der Einladung in
       ihrem Postfach erreichen, so dass sie aus ihrem Postfach
       heraus auf die Einladung klicken kann und direkt in das
       Klassenzimmer kommt … Wenn sie allerdings selbst
       irgendwo in einem Raum ist, soll sie das nicht als
       Postnachricht erreichen."

       Zwei Wege, in dieser Reihenfolge:
         1. erreichbar (im Raum oder anwesend) → ueber die
            Leitung, sofort, wie bisher
         2. sonst → eine Nachricht ins Postfach, mit Link
       Wer schon in irgendeinem Raum sitzt, bekommt KEINE
       Postnachricht: der wird ja schon erreicht.
       ===================================================== */
    if (art === "i") {
      if (!rest) { freundeZeigen(); return true; }
      var name_ = rest.trim();
      var wen = personNachName(name_) || praesenzNachName(name_);
      if (wen) {
        zustand.eingeladen[wen.id] = true;
        postSenden(wen.id, { art: "einladung", raum: zustand.raum, zeit: Date.now() });
        systemZeile("Eingeladen: " + wen.name + ". Eine Einladung ist keine Frage mit "
          + "Ja und Nein — sie macht den Raum für " + wen.name + " auf. Hereinkommen "
          + wen.name + " muss selbst.");
        /* UND TROTZDEM EIN BRIEF — wenn die Person nicht hier bei
           mir im Raum sitzt.
           GEMELDET: „Ich moechte Emmy einladen koennen, unabhaengig
           davon, ob sie online ist oder nicht", und: „Wir haben ja
           hier auch ein Problem wegen dem Knopf gehabt — die koennen
           ja nicht reinfinden."
           Der Ruf ueber die Leitung ist fluechtig: er blinkt einmal
           auf, und wer in dem Moment woanders hinsieht, hat ihn
           verpasst. Der Brief bleibt liegen, mit dem Knopf, der
           direkt hierher fuehrt. Beides zusammen kostet nichts und
           verliert niemanden. Wer hier im selben Raum sitzt,
           bekommt keinen Brief — der sieht mich ja. */
        if (!personNachName(name_)) einladungInsPostfach(name_, true);
        return true;
      }
      einladungInsPostfach(name_);
      return true;
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
      themaMerken(zustand.raum, zustand.thema);
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
      var z3 = personNachName(rest.trim().split(/\s+/)[0] || "");
      if (!z3) return systemZeile("„" + rest + "“ ist nicht hier.");
      postSenden(z3.id, { art: "rausschmiss", raum: zustand.raum });
      /* GEWUENSCHT: „Oben im Newsticker sollen auch solche Sachen
         stehen — wie ,Emmy wurde aus dem Klassenzimmer geworfen,
         weil sie den Unterricht stoert, und denkt jetzt ueber ihr
         Verhalten nach'." Der Grund kommt aus dem, was der Haeuptling
         dahinterschreibt: /k Emmy stoert den Unterricht. Steht nichts
         da, bleibt es bei der schlichten Meldung — erfunden wird
         hier kein Grund. */
      var grund3 = rest.trim().split(/\s+/).slice(1).join(" ").trim();
      raumEreignis(z3.name + " wurde aus " + raumKlartext(zustand.raum) + " geschickt"
        + (grund3 ? " — " + grund3 : "") + " und denkt jetzt über das Verhalten nach");
      return anAlle("system", z3.name + " wurde von " + zustand.ichName + " hinausgeschickt."
        + (grund3 ? " Grund: " + grund3 : ""));
    }
    if (art === "stumm" || art === "entstumm") {
      if (!zustand.haeuptling) return systemZeile("Stummschalten darf nur der Häuptling.");
      var z5 = personNachName(rest);
      if (!z5) return systemZeile("„" + rest + "“ ist nicht hier.");
      zustand.stumm[z5.id] = (art === "stumm");
      postSenden(z5.id, { art: "redeverbot", an_: art === "stumm", raum: zustand.raum });
      return anAlle("system", z5.name + (art === "stumm"
        ? " ist stummgeschaltet — schreiben geht weiter, sprechen nicht."
        : " darf wieder sprechen."));
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
    /* =========================================================
       /probe — ZEIGT DIE ANIMATIONEN SOFORT, NUR FUER MICH
       ---------------------------------------------------------
       GEMELDET: „Die Animationen werden noch nicht gezeigt."

       Ich kann sein Geraet nicht sehen, und im Pruefstand laufen sie.
       Deshalb dieser Befehl: Er spielt die Animation SOFORT und ohne
       Umweg ueber den Chat — keine Nachricht, kein Netz, kein Raum.

       Damit ist die Frage in einer Sekunde entschieden:
         * Es kommt etwas  → das Zeichnen ist in Ordnung, es hakt am
                             Weg dorthin (Nachricht, Name, Zeitpunkt).
         * Es kommt nichts → das Zeichnen selbst geht auf dem Geraet
                             nicht (Animationen abgeschaltet, alte
                             Fassung, Systemeinstellung „weniger
                             Bewegung").
       ========================================================= */
    if (art === "probe" || art === "test") {
      var was = (rest || "boxen").trim().toLowerCase();
      var ging = false;
      try { ging = Boolean(zustand.effektRuf && zustand.effektRuf(was, zustand.ichName)); } catch (e) {}
      return systemZeile(ging
        ? "🧪 „" + was + "“ läuft gerade auf DEINEM Schirm — nur für dich, niemand sonst sieht es. "
          + "Siehst du nichts, liegt es am Gerät (weniger Bewegung, alte Fassung), nicht am Chat."
        : "🧪 „" + was + "“ kenne ich nicht oder es gibt gerade keine Plätze. "
          + "Probier  /probe boxen  ,  /probe umarmen  oder  /probe lecken  — im Raum stehend.");
    }
    /* =========================================================
       /film — DIE ECHTE ANIMATION UEBER DEN CHAT LEGEN
       ---------------------------------------------------------
       GEWUENSCHT: „Wie bei TikTok, wo ploetzlich ein Loewe
       herumlaeuft … und ich moechte, dass die Leute sich solche
       Animationen verdienen koennen."

       Die Filme sind freigestellte Videos (siehe
       filme/LIESMICH.md). Verschickt wird nur der NAME — ein paar
       Zeichen. Jedes Geraet holt sich die Datei selbst, und zwar
       erst dann, wenn sie wirklich gebraucht wird. Ein Video
       durch den Chat zu schicken waere das Gegenteil: teuer,
       langsam, und bei jedem noch einmal.
       ========================================================= */
    if (art === "film") {
      var fname = String(rest || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      /* OHNE NAMEN: die vorhandenen Filme aufzaehlen. Raten, wie
         einer heisst, ist keine Bedienung. Die Liste schreibt
         werkzeug/film-freistellen.sh bei jedem Film neu mit. */
      if (!fname) {
        fetch("filme/liste.json", { cache: "no-cache" })
          .then(function (a) { return a.ok ? a.json() : null; })
          .then(function (l) {
            var n = l && l.filme ? l.filme.map(function (f) { return f.name; }) : [];
            systemZeile(n.length
              ? "\uD83C\uDFAC Diese Filme liegen bereit:  /film " + n.join("   /film ")
              : "\uD83C\uDFAC Es liegt noch kein Film in \u201efilme\u201c.");
          })
          .catch(function () {
            systemZeile("\uD83C\uDFAC Welchen Film? Zum Beispiel  /film loewe");
          });
        return true;
      }
      /* Erst auf dem eigenen Schirm zeigen, damit man sofort sieht,
         ob es den Film ueberhaupt gibt — und dann erst allen. */
      var lief = false;
      try {
        lief = Boolean(zustand.filmRuf && zustand.filmRuf(fname, function (grund) {
          /* Der Abspieler meldet sich spaeter — dann steht der Grund
             im Klartext im Chat, statt dass gar nichts passiert. */
          systemZeile("🎬 „" + fname + "“ kam nicht: " + (grund || "unbekannter Grund")
            + "\n(Fassung " + (window.DMA_VERSION || "?") + ")");
        }));
      } catch (e) {
        return systemZeile("🎬 Der Filmspieler fehlt in dieser Fassung. Lade die Seite neu.");
      }
      if (!lief) {
        return systemZeile("🎬 Der Filmspieler ist in dieser Fassung nicht angemeldet. "
          + "Lade die Seite neu — deine Fassung ist " + (window.DMA_VERSION || "?") + ".");
      }
      return anAlle("aktion", zustand.ichName + " zeigt „" + fname + "“",
                    { film: fname });
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
    /* Dieselbe Arbeit wie /tausch, nur von der Oberflaeche aus —
       siehe platzNehmen/platzTauschenMit weiter unten. */
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
    /* =========================================================
       DER WAGENHEBER UND DAS LASSO
       ---------------------------------------------------------
       GEWUENSCHT: „Mal so ein Wagenheber-Effekt, wenn jemand
       unten ist … also man kann den anderen irgendwie auf einen
       anderen Sitzplatz ziehen. Von unten nach oben waere es
       dann so ein Heber, von rechts nach links waere so ein
       Lasso, wo man den so zu sich zieht, dass er naeher
       ransitzt. Und das System soll dann erkennen, welche
       Plaetze hebelbar sind."

       DIE EINE REGEL, DIE ER GENANNT HAT:
       „Wenn ich auf Platz 1 bin, dann kann man den nicht vom
        Platz 5 zu Platz 1 heben, sondern nur aus der Position,
        wo man selber sich nicht befindet."
       Also: auf den EIGENEN Platz kann niemand gehoben werden.
       Alle anderen Plaetze gehen — ist dort jemand, tauschen
       die beiden, ist er frei, rueckt der Gehobene hinueber.

       Ohne Nummer sagt der Befehl, welche Plaetze in Frage
       kommen. Raten muss niemand.
       ========================================================= */
    /* =========================================================
       DAS LASSO ZIEHT ZU MIR — DIE ANGEL IRGENDWOHIN
       ---------------------------------------------------------
       GEMELDET: „Man soll in dem Moment jemanden zu sich ziehen
       koennen oder an den Platz ziehen koennen, wo man ihn
       hinziehen moechte. Ja, mit dem Angeln soll man ihn irgendwo
       hinziehen koennen, und mit dem Lasso soll man ihn eigentlich
       zu sich heranziehen, dass er neben einem sitzt oder am
       naechsten Platz, wo er hin kann."

       „/lasso" war bisher nur ein Kurzwort fuer „/heb" — und /heb
       will eine Platznummer. Es gab also gar kein Werkzeug, das
       von selbst zu MIR zieht. Jetzt gibt es eins: es sucht den
       freien Platz, der meinem am naechsten liegt, und setzt ihn
       dorthin. Ist keiner frei, sagt es das, statt jemanden
       wegzutauschen — einen Menschen zu verschieben, um einen
       anderen heranzuholen, hat niemand verlangt. */
    if (art === "lasso") {
      if (zustand.lage !== "drin") return systemZeile("Dafuer musst du erst im Raum sein.");
      var nameL = rest.trim();
      if (!nameL) return systemZeile("So geht es:  /lasso Nickname \u2014 "
        + "dann sitzt er gleich neben dir.");
      var wenL = personNachName(nameL) || praesenzNachName(nameL);
      if (!wenL) return systemZeile("Ich finde niemanden mit dem Namen \u201e" + nameL + "\u201c im Raum.");
      var plaetzeL = plaetzeBauen();
      var meinerL = null, seinerL = null;
      plaetzeL.forEach(function (pl) {
        if (pl.ich) meinerL = pl;
        if (pl.id === wenL.id) seinerL = pl;
      });
      if (!meinerL) return systemZeile("Du sitzt noch nicht oben \u2014 das Lasso braucht einen Standpunkt.");
      if (!seinerL) return systemZeile(wenL.name + " sitzt gerade auf keinem Platz.");
      var naeheL = function (n) {
        var r1 = Math.floor((n - 1) / 4), s1 = (n - 1) % 4;
        var r2 = Math.floor((meinerL.nummer - 1) / 4), s2 = (meinerL.nummer - 1) % 4;
        return Math.abs(r1 - r2) + Math.abs(s1 - s2);
      };
      var freiL = plaetzeL.filter(function (pl) { return pl.leer && pl.nummer !== meinerL.nummer; })
                          .sort(function (a, b) { return naeheL(a.nummer) - naeheL(b.nummer); })[0];
      if (!freiL) return systemZeile("Neben dir ist kein Platz frei \u2014 "
        + "das Lasso hat nichts, woran es ziehen koennte.");
      /* Und jetzt dasselbe wie /heb, nur mit dem selbst gefundenen
         Platz — die Zeile darunter erledigt das Umsetzen. */
      return befehlAusfuehren("/heb " + wenL.name + " " + freiL.nummer);
    }

    if (art === "heb") {
      if (zustand.lage !== "drin") return systemZeile("Dafuer musst du erst im Raum sein.");
      var teileH = rest.trim().split(/\s+/).filter(Boolean);
      var nummerH = 0;
      if (teileH.length && /^\d+$/.test(teileH[teileH.length - 1])) {
        nummerH = parseInt(teileH.pop(), 10);
      }
      var nameH = teileH.join(" ");
      var plaetzeH = plaetzeBauen();
      var meinerH = null, seinerH = null, zielH = null;
      plaetzeH.forEach(function (pl) { if (pl.ich) meinerH = pl; });
      if (!nameH) {
        return systemZeile("So geht es:  /heb Nickname 3\n"
          + "Damit setzt du jemanden auf einen anderen Platz. "
          + "/heb Nickname  allein zeigt, welche Plaetze frei sind.");
      }
      var wenH = personNachName(nameH);
      if (!wenH) return systemZeile("Ich finde niemanden mit dem Namen \u201e" + nameH + "\u201c im Raum.");
      plaetzeH.forEach(function (pl) { if (pl.id === wenH.id) seinerH = pl; });
      if (!seinerH) return systemZeile(wenH.name + " sitzt gerade auf keinem Platz.");

      /* WELCHE PLAETZE GEHEN? Alle ausser dem eigenen und dem, auf
         dem die Person schon sitzt. */
      var belegtH = {};
      plaetzeH.forEach(function (pl) { if (!pl.leer) belegtH[pl.nummer] = pl.name; });
      var moeglichH = [];
      for (var iH = 1; iH <= PLAETZE; iH++) {
        if (meinerH && iH === meinerH.nummer) continue;
        if (iH === seinerH.nummer) continue;
        moeglichH.push(iH);
      }
      if (!nummerH) {
        return systemZeile("\ud83e\ude9d " + wenH.name + " sitzt auf Platz " + seinerH.nummer + ".\n"
          + "Diese Plaetze gehen:  "
          + moeglichH.map(function (n) {
              return n + (belegtH[n] ? " (" + belegtH[n] + " \u2014 tauscht dann)" : " (frei)");
            }).join("   ")
          + "\nSo geht es:  /heb " + wenH.name + " " + (moeglichH[0] || 1));
      }
      if (moeglichH.indexOf(nummerH) < 0) {
        if (meinerH && nummerH === meinerH.nummer) {
          return systemZeile("Auf deinen eigenen Platz kannst du niemanden heben — "
            + "da sitzt du ja schon. Nimm einen anderen:  "
            + moeglichH.join("  "));
        }
        return systemZeile("Platz " + nummerH + " gibt es hier nicht. Moeglich sind:  "
          + moeglichH.join("  "));
      }

      /* Wer dort sitzt, bekommt den frei werdenden Platz. */
      var dortH = null;
      plaetzeH.forEach(function (pl) { if (pl.nummer === nummerH && !pl.leer) dortH = pl; });
      sitzTausch[wenH.id] = nummerH - 1;
      if (dortH) sitzTausch[dortH.id] = seinerH.nummer - 1;

      /* Von unten nach oben ist ein Heber, zur Seite ein Lasso —
         genau so, wie er es beschrieben hat. Die Reihe ergibt sich
         aus der Nummer: vier Plaetze je Reihe. */
      var reiheAlt = Math.ceil(seinerH.nummer / 4);
      var reiheNeu = Math.ceil(nummerH / 4);
      var wieH = reiheNeu < reiheAlt ? "heber" : "lasso";
      var satzH = zustand.ichName + (wieH === "heber"
        ? " hebt " + wenH.name + " auf Platz " + nummerH
        : " zieht " + wenH.name + " mit dem Lasso auf Platz " + nummerH)
        + (dortH ? " \u2014 " + dortH.name + " rutscht auf " + seinerH.nummer : "")
        + "  " + (wieH === "heber" ? "\ud83e\ude9d" : "\ud83e\udd20");
      senden({ art: "sitzplatz", ordnung: sitzTausch, text: satzH });
      melden();
      return anAlle("aktion", satzH, { wirkung: wieH, wen: wenH.name });
    }

    if (art === "herz") {
      var wem = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      /* GEWUENSCHT: „Man kann auch die Herzen direkt an die Person
         schicken, dass die Herzen auf das Profilbild von dem anderen
         angewendet werden." Mit Namen also AUF den Platz, ohne Namen
         wie bisher ueber die Zeile. */
      if (wem) {
        return anAlle("aktion", zustand.ichName + " schickt " + wem.name + " ein \u2665",
                      { wirkung: "zherz", wen: wem.name });
      }
      return anAlle("aktion", zustand.ichName + " schickt allen ein \u2665", { wirkung: "herz" });
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
    /* =========================================================
       WAS MAN MIT EINEM PROFILBILD ANSTELLEN KANN
       ---------------------------------------------------------
       GEWUENSCHT: „Alles, was man mit dem Profilbild anstellen
       kann, was lustig im Kontext ist" — ein Tritt wie beim
       Fussball, ein Wassereimer, ein Wecker, eine Regenwolke, ein
       Gewitter, Geldregen, Bonbons, ein Hammer.

       ZWEI WEGE, EIN ERGEBNIS:
       · Vier Befehle sind neu: /tritt /wasser /wecker /hammer.
       · Vier gab es schon fuer den ganzen Raum und bekommen mit
         einem NAMEN dahinter eine kleine Fassung, die nur dieser
         einen Person gilt: /regen Emmi, /gewitter Emmi,
         /geld Emmi, /bonbon Emmi. Ohne Namen bleibt alles, wie
         es war — niemand verliert einen Befehl.
       ========================================================= */
    /* GEMELDET: „dann könnte man noch das eigene Profilbild so hin und
       her fliegen lassen wie bei Lotto oder bei so einem Spiel, dass
       man da so zufällig durch die Plätze springen lässt, bis es
       irgendwann einen neuen Platz gefunden hat. Also Zufallsmodus
       praktisch."
       Das ist etwas anderes als „irgendein Effekt auf jemanden":
       OHNE Namen zieht das Los einen neuen Platz fuer mich selbst,
       MIT Namen bleibt es der Ueberraschungseffekt. */
    if (art === "zufall" && !rest) {
      return anAlle("aktion", zustand.ichName
        + " l\u00e4sst das Los einen neuen Platz suchen  \ud83c\udfb0",
        { wirkung: "lotto" });
    }
    /* EIN PLATZ IST KEIN MENSCH.
       Seit man im Anreise-Menue „Fahren" oder „Laufen" waehlen kann,
       steht hinter dem Befehl eine NUMMER, kein Nickname. Ohne diese
       Abzweigung stuende im Chat „faehrt hinueber zu 8" — als hiesse
       jemand 8. */
    /* Auch Flug, Maulwurf und Tor bekommen hinter dem Befehl eine
       NUMMER — sonst stuende im Chat „fliegt hinueber zu 5", als hiesse
       jemand 5. */
    if ((art === "flug" || art === "maulwurf" || art === "portal"
         || art === "boot" || art === "kran")
        && /^\s*\d+\s*$/.test(rest)) {
      var satzR = { flug: [" fliegt zu Platz ", "\u2708\ufe0f"],
                    maulwurf: [" gr\u00e4bt sich zu Platz ", "\ud83e\udda1"],
                    portal: [" geht durchs Tor zu Platz ", "\ud83c\udf00"],
                    boot: [" schippert zu Platz ", "\u26f5"],
                    kran: [" wird gehoben zu Platz ", "\ud83c\udfd7\ufe0f"] }[art];
      return anAlle("aktion", zustand.ichName + satzR[0] + rest.trim() + "  " + satzR[1],
                    { wirkung: art, wen: rest.trim() });
    }
    if ((art === "fahren" || art === "huepfen" || art === "laufen")
        && /^\s*\d+(\s*-\s*\d+)*(\s*[x\u00d7]\d)?\s*$/i.test(rest)) {
      /* EINE KETTE STATT EINER ZAHL.
         Seit man den Weg mit dem Finger malen kann („wie bei einer
         Handy-Code-Freischaltung das Muster definieren"), steht hinter
         dem Befehl nicht mehr nur das Ziel, sondern der ganze Weg:
         „/laufen 1-5-6-7-8". Die Kette faehrt unveraendert mit, damit
         JEDES Geraet denselben Umweg zeichnet und nicht seinen eigenen
         kuerzesten rechnet — sonst saehe der Absender etwas anderes
         als alle anderen. */
      /* AUFGEZOGEN WIE EIN SPIELZEUGAUTO.
         GEWUENSCHT: „vielleicht kannst du beim Fahren noch so ein
         Aufziehauto machen … je nachdem wie oft man das betaetigt,
         desto mehr Geschwindigkeit bekommt er … und dann faehrt er da
         in Rennauto-Manier dahin."
         Hinter dem Ziel steht dann ein „x3" — drei Umdrehungen. Es
         faehrt als „tempo" mit, damit ALLE dieselbe Geschwindigkeit
         sehen. */
      var tempoF = 1;
      rest = String(rest).replace(/\s*[x\u00d7](\d)\s*$/i, function (_, z) {
        tempoF = Math.max(1, Math.min(5, parseInt(z, 10) || 1));
        return "";
      });
      var kette = rest.replace(/\s+/g, "");
      var stationen = kette.split("-").map(function (x) { return parseInt(x, 10); });
      var platzNr = stationen[stationen.length - 1];
      var ueber = stationen.length > 2
        ? " \u00fcber " + stationen.slice(1, -1).join(", ") : "";
      return anAlle("aktion", zustand.ichName
        + (art === "fahren" ? " f\u00e4hrt zu Platz " : " l\u00e4uft zu Platz ")
        + platzNr + ueber + "  " + (art === "fahren" ? "\ud83d\ude97" : "\ud83d\udc63"),
        { wirkung: art === "fahren" ? "fahren" : "spielzug", wen: kette,
          tempo: String(tempoF) });
    }
    if (AM_PLATZ[art]) {
      var wemP = rest ? (personNachName(rest) || praesenzNachName(rest) || { name: rest }) : null;
      if (!wemP) return systemZeile("So geht es:  /" + art + " Nickname");
      var satzP = AM_PLATZ[art];
      /* DAS LOS FAEHRT MIT.
         „wenn mehr als zwei Leute teilnehmen, soll die eine Kugel, die
         man anstoesst, die anderen beeinflussen und einer von denen
         soll zufaellig in ein leerstehendes Loch fallen."
         Wuerfelte jedes Geraet selbst, faellt bei mir ein anderer als
         bei ihm. Also wird EINMAL gewuerfelt — hier, beim Absender —
         und die Zahl reist als „los" mit der Zeile. Jeder kuenftige
         Effekt mit Zufall kann sie ebenso benutzen. */
      return anAlle("aktion", zustand.ichName + " " + satzP.satz + " " + zielWort(wemP) + "  " + satzP.emoji,
                    { wirkung: satzP.wirkung, wen: wemP.name, los: Math.random().toFixed(4) });
    }
    /* Und die vier, die es fuer den Raum schon gibt: nur MIT Namen
       wird daraus die kleine Fassung am Platz. */
    if (AUCH_AM_PLATZ[art] && rest) {
      var wemQ = personNachName(rest) || praesenzNachName(rest) || { name: rest };
      var satzQ = AUCH_AM_PLATZ[art];
      return anAlle("aktion", zustand.ichName + " " + satzQ.satz + " " + zielWort(wemQ) + "  " + satzQ.emoji,
                    { wirkung: satzQ.wirkung, wen: wemQ.name, los: Math.random().toFixed(4) });
    }

    /* ---- NOTEN MIT EINEM MEINER LIEDER ----
       GEWUENSCHT: „in Zukunft soll man auch die Moeglichkeit haben,
       wenn man Noten spielt, dass man eins von meinen Liedern
       auswaehlen kann und dann kommt halt der Refrain von einem Lied."
       Wo der Refrain anfaengt, ist gemessen und steht in
       data-refrain.js (werkzeug/refrain-messen.js). */
    if (art === "noten" && String(rest || "").trim()) {
      var wahlN = String(rest).trim();
      var liedN = liedFinden(wahlN);
      if (!liedN) {
        return systemZeile("Das Lied liegt nicht im Musikordner:\n" + liederListe()
          + "\n  /noten        nur die Melodie"
          + "\n  /noten 3      der Refrain von Lied 3");
      }
      var abN = 0;
      try { abN = Number((window.DMA_REFRAIN || {})[liedN.datei]) || 0; } catch (e) { abN = 0; }
      return anAlle("aktion", zustand.ichName + " spielt den Refrain von \u201e"
        + liedN.titel + "\u201c  \ud83c\udfb5",
        { wirkung: "notenlied", lied: liedN.datei, liedTitel: liedN.titel,
          liedAb: String(abN) });
    }

    /* ---- SCHIFFE VERSENKEN ---- */
    if (art === "versenken" || art === "schiffe") return schiffeStarten(rest);

    /* ---- DAS WHITEBOARD ----
       GEWUENSCHT: „Ich moechte ein Whiteboard implementieren … dass
       die Plaetze, die oben sind, nach unten wandern und das
       Whiteboard nach oben."
       Der Befehl macht es bei ALLEN auf — eine Tafel, auf die nur
       einer schaut, ist keine. */
    if (art === "tafel" || art === "whiteboard") {
      var wunschT = (rest || "").trim().toLowerCase();
      var zuT = /^(aus|zu|weg|stop|stopp|schluss|fertig)$/.test(wunschT);
      return anAlle("aktion", zustand.ichName
        + (zuT ? " macht das Whiteboard zu  \ud83e\uddd1\u200d\ud83c\udfeb"
               : " macht das Whiteboard auf  \ud83e\uddd1\u200d\ud83c\udfeb"),
        { wirkung: zuT ? "tafelzu" : "tafelauf" });
    }

    /* ---- MUSIK FUER ALLE ----
       „Wenn nichts los ist im Chat, ein Lied fuer alle." Ohne Zusatz
       zeigt der Befehl die Liste — man soll nicht raten muessen, was
       im Ordner liegt. */
    if (art === "musik") {
      var wahlM = (rest || "").trim();
      if (!wahlM || /^(liste|was|\?)$/i.test(wahlM)) {
        return systemZeile("Musik f\u00fcr alle:\n" + liederListe()
          + "\n  /musik pause   h\u00e4lt an   \u00b7   /musik weiter   l\u00e4uft weiter"
          + "\n  /musik aus   macht Schluss"
          + "\n  /kopfh\u00f6rer Name 3   setzt Lied 3 nur EINEM auf die Ohren");
      }
      if (/^(aus|stop|stopp|halt|schluss)$/i.test(wahlM)) {
        return anAlle("aktion", zustand.ichName + " macht die Musik aus  \ud83d\udd07",
                      { wirkung: "musikaus" });
      }
      /* „Ich brauche fuer das Lied entweder eine Art kleine
         Transportleiste oder auch einen Pause-Befehl irgendwo."
         Die Leiste sitzt im Chat (app.js), der Befehl gilt fuer alle. */
      if (/^(pause|stopp?kurz|halt mal)$/i.test(wahlM)) {
        return anAlle("aktion", zustand.ichName + " h\u00e4lt die Musik an  \u23f8\ufe0f",
                      { wirkung: "musikpause" });
      }
      if (/^(weiter|play|los)$/i.test(wahlM)) {
        return anAlle("aktion", zustand.ichName + " l\u00e4sst die Musik weiterlaufen  \u25b6\ufe0f",
                      { wirkung: "musikweiter" });
      }
      var liedM = liedFinden(wahlM);
      if (!liedM) {
        /* Nicht „kenne ich nicht" sagen: genau diese Formel steht fuer
           einen UNBEKANNTEN BEFEHL, und pruefe-jeder-befehl liest sie
           auch so. Ein Lied, das nicht im Ordner liegt, ist etwas
           anderes. */
        return systemZeile("\u201e" + wahlM + "\u201c liegt nicht im Musikordner.\n" + liederListe());
      }
      return anAlle("aktion", zustand.ichName + " legt \u201e" + liedM.titel + "\u201c auf  \ud83c\udfb5",
                    { wirkung: "musik", lied: liedM.datei, liedTitel: liedM.titel });
    }
    /* ---- UND EINS AUF DIE OHREN ----
       /kopfhoerer Name          nur die Kopfhoerer
       /kopfhoerer Name 3        Kopfhoerer UND Lied 3 — gehoert wird es
                                 nur von dem, dem sie aufgesetzt werden.
       Diese Abzweigung muss VOR AM_PLATZ stehen: dort gilt der ganze
       Rest als Name, und „Bea 3" heisst niemand. */
    if (art === "kopfhoerer" && rest && /\s/.test(rest.trim())) {
      var stkK = rest.trim().split(/\s+/);
      var namK = stkK.shift();
      var liedK = liedFinden(stkK.join(" "));
      var wemK = personNachName(namK) || praesenzNachName(namK) || { name: namK };
      if (!liedK) {
        return systemZeile("\u201e" + stkK.join(" ") + "\u201c liegt nicht im Musikordner.\n"
          + liederListe());
      }
      return anAlle("aktion", zustand.ichName + " setzt " + zielWort(wemK)
                    + " Kopfh\u00f6rer auf \u2014 \u201e" + liedK.titel + "\u201c  \ud83c\udfa7",
                    { wirkung: "kopfhoerer", wen: wemK.name,
                      lied: liedK.datei, liedTitel: liedK.titel });
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

    /* ---- Farbe ----
       GEWUENSCHT: „Als weiteren Befehl kannst du /c name machen, dass
       man nur den Namen einfaerbt — und die Schriftfarbe, die man
       zuletzt eingestellt hat, ist dann die Schriftfarbe fuer die
       Schrift. /c generell faerbt immer alles gleichzeitig; mit
       /c name und /c schrift kann man das spezifischer machen."

       Drei Formen, eine Stelle:
         /c <farbe>            alles
         /c name <farbe>       nur der Name
         /c schrift <farbe>    nur der Text (das ist /c, nur deutlich)
       „/c name" ohne Farbe nimmt die Sonderfarbe wieder weg. */
    if (art === "c" || art === "cname" || art === "cschrift") {
      var erlaubt = ["rot", "blau", "gruen", "grün", "gelb", "lila", "tuerkis", "türkis",
                     "orange", "rosa", "weiss", "weiß", "bunt", ""];
      var teile = rest.trim().split(/\s+/);
      var wohin = "alles";
      /* /cname und /cschrift sind nur kurze Schreibweisen fuer
         /c name und /c schrift — ein Weg, nicht zwei. */
      if (art === "cname") wohin = "name";
      else if (art === "cschrift") wohin = "schrift";
      else
      if (/^(name|nick)$/i.test(teile[0] || "")) { wohin = "name"; teile.shift(); }
      else if (/^(schrift|text|font|front)$/i.test(teile[0] || "")) { wohin = "schrift"; teile.shift(); }
      var f = (teile.join(" ") || "").toLowerCase();
      if (erlaubt.indexOf(f) < 0) {
        return systemZeile("Farben: rot, blau, gruen, gelb, lila, tuerkis, orange, rosa, "
          + "weiss, bunt.\n"
          + "  /c <farbe>           Name und Schrift zusammen\n"
          + "  /c name <farbe>      nur der Name\n"
          + "  /c schrift <farbe>   nur die Schrift\n"
          + "Ohne Farbwort geht es wieder auf normal zurück.");
      }
      var sauber = f.replace("ü", "ue").replace("ß", "ss");
      if (wohin === "name") {
        zustand.farbeName = sauber;
        namensfarbeMerken(sauber);
      } else {
        zustand.farbe = sauber;
        farbeMerken(sauber);
        /* „/c <farbe>" faerbt ALLES — also faellt die Sonderfarbe
           des Namens weg, sonst bliebe sie unsichtbar bestehen und
           der naechste /c schiene wirkungslos. */
        if (wohin === "alles") { zustand.farbeName = ""; namensfarbeMerken(""); }
      }
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn,
               bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName, farbeName: zustand.farbeName });
      melden();
      if (wohin === "name") {
        return systemZeile(sauber ? "Dein Name steht jetzt in " + f + "." : "Dein Name hat wieder die Schriftfarbe.");
      }
      if (wohin === "schrift") {
        return systemZeile(sauber ? "Deine Schrift ist jetzt " + f + "." : "Wieder normale Schriftfarbe.");
      }
      return systemZeile(sauber ? "Du schreibst jetzt " + f + "." : "Wieder normale Farbe.");
    }

    /* ---- Rückwärts schreiben ----
       GEMELDET: „Die Schrift, die man schreibt, ist verkehrt herum.
       Das sieht zwar witzig aus … diesen Fehler kann man einfach so
       designmässig mit einbauen, dass man bewusst so schreiben
       kann." Also bitte — aber nur, wenn man es will. */
    if (art === "rw") {
      if (!rest.trim()) return systemZeile("So geht es:  /rw Heute lernen wir Deutsch");
      var rueck = Array.from(rest.trim()).reverse().join("");
      return anAlle("text", rueck);
    }

    /* ---- Die zwei Aufgaben ---- */
    if (art === "satz") return aufgabeStellen("satz", rest);
    if (art === "wort") return aufgabeStellen("wort", rest);
    if (art === "aufgabe" || art === "frage") return aufgabeFreiStellen(rest);
    if (art === "sortieren" || art === "reihenfolge") return sortierAufgabeStellen(rest, false);
    if (art === "kontexter" || art === "kontext") return sortierAufgabeStellen(rest, true);
    if (art === "artikel") return wortAufgabeStellen("artikel", rest);
    if (art === "begriff" || art === "bedeutung") return wortAufgabeStellen("begriff", rest);
    /* /lesen oeffnet den Waehler in der Oberflaeche — die Texte
       liegen dort (app.js), nicht hier. Ohne Oberflaeche (Sonde,
       Kopfrechner) sagt es wenigstens, was es tun wuerde. */
    if (art === "lesen" || art === "text") {
      var gingAuf = false;
      try { gingAuf = Boolean(window.DMA_LESEWAHL && window.DMA_LESEWAHL()); } catch (e) {}
      if (gingAuf) return true;
      return systemZeile("\ud83d\udcd6 Lesen: tippe auf das Buchzeichen in der "
        + "Befehlsleiste \u2014 dort waehlst du Niveau und Text.");
    }
    if (art === "betonung" || art === "beton") return betonungStellen(rest);
    if (art === "raten") return ratenStellen(rest);

    /* ---- Zensuren ----
       „Dass man die Antworten der Leute bewerten kann — die es
       richtig machen, dass die Zensuren kriegen dafür, von 1 bis 6,
       ja, also wie man das aus dem Unterricht gewöhnt ist." */
    /* ---- Klassensprecher ernennen ---- */
    if (art === "klassensprecher") {
      if (!binLehrer() && !zustand.haeuptling) {
        return systemZeile("Einen Klassensprecher bestimmt der " + rangWort(true) + ".");
      }
      if (!rest.trim()) {
        var jetztId = klassensprecherId();
        return systemZeile(jetztId
          ? "Klassensprecher ist gerade " + (zustand.leute[jetztId] || {}).name + ".\n"
            + "So wechselst du:  /klassensprecher Nickname"
          : "Noch niemand. So geht es:  /klassensprecher Nickname");
      }
      var zk = personNachName(rest.trim().split(/\s+/)[0] || "");
      if (!zk) return systemZeile("„" + rest + "“ ist nicht hier.");
      /* Immer nur einer — der vorige gibt ab. */
      Object.keys(zustand.leute).forEach(function (id) {
        if (zustand.leute[id]) zustand.leute[id].klassensprecher = (id === zk.id);
      });
      senden({ art: "rang", an: zk.id, klassensprecher: true });
      raumEreignis(zk.name + " ist jetzt Klassensprecher:in im Klassenzimmer");
      return anAlle("system", "🎓 " + zk.name + " ist jetzt Klassensprecher:in. "
        + "Wenn " + zustand.ichName + " geht, führt " + zk.name + " weiter.");
    }

    if (art === "note") {
      /* „Zensuren gibt nur der Lehrer, ja — daran sehe ich auch, ob
         ich ueberhaupt Lehrer bin." Genau deshalb steht hier die
         Begruendung und nicht nur ein Nein. */
      if (!binLehrer()) {
        return systemZeile("Zensuren gibt nur der Lehrer, und Lehrer ist der Betreiber "
          + "im Klassenzimmer. Hier bist du " + rangWort(true) + " — "
          + (zustand.raum !== HAUPTRAUM
              ? "im Klassenzimmer (nicht in einem eigenen Raum) kannst du benoten."
              : "Zensuren gibt nur der Betreiber."));
      }
      var nt = rest.trim().split(/\s+/);
      var wem = nt.shift() || "";
      var zahl = Number(nt.shift());
      var wofuer = nt.join(" ").trim();
      var zz = personNachName(wem);
      if (!zz) return systemZeile("„" + wem + "“ ist nicht hier.");
      if (!(zahl >= 1 && zahl <= 6)) {
        return systemZeile("So geht es:  /note " + zz.name + " 2 saubere Satzstellung\n"
          + "Zensuren gehen von 1 (sehr gut) bis 6 (ungenügend).");
      }
      return noteGeben(zz.id, zahl, wofuer).ok;
    }

    /* ---- „Der Unterricht beginnt" ----
       GEWUENSCHT: „Ich moechte den Leuten auch diese Rundmail
       geben, dass der Unterricht jetzt beginnt, dass jeder das in
       seinem Postfach hat … Es kann ja auch ein Chat-Befehl sein,
       das dann oben im Newsticker steht."

       Denselben Weg wie der Knopf in den Einstellungen, nur von
       hier aus — damit man nicht aus dem Raum gehen muss, um zum
       Unterricht zu rufen. Eine Rundmail geht an ALLE und laesst
       sich nicht zurueckholen: deshalb nur der Betreiber.

       KEINE Zeitsperre mehr. Hier standen dreissig Minuten, und die
       sind raus — ausdruecklich: „Das war keine Zeitschaltuhr haben.
       Das ist totaler Quatsch." Wenn die Leute den Knopf nicht
       finden, muss man sie noch einmal rufen duerfen. Wer rufen
       darf, entscheidet der Rang; WANN, entscheidet der Mensch. */
    if (art === "diagnose") return diagnose();
    if (art === "unterricht") {
      if (!binBetreiber()) {
        return systemZeile("Zum Unterricht rufen darf nur der Betreiber.");
      }
      var B_ = konto();
      if (!B_) return systemZeile("Das Konto ist nicht geladen. Lade die Seite einmal neu.");
      if (!B_.currentUser || !B_.currentUser()) {
        return systemZeile("Zum Rufen musst du angemeldet sein — /diagnose zeigt den Befund.");
      }
      if (!B_.sendBroadcastMessage) {
        return systemZeile("Die Rundmail fehlt in dieser Fassung. /diagnose zeigt, was da ist.");
      }
      var satzU = rest.trim()
        || "Ich bin jetzt im Klassenzimmer und mache Unterricht — komm dazu, ich freue mich auf dich!";
      systemZeile("Schicke die Einladung an alle …");
      B_.sendBroadcastMessage(satzU + "\n\n" + adresseMitRaum(zustand.raum)
        + "\n[RAUM:" + zustand.raum + "]").then(function () {
        try { localStorage.setItem("dma_unterricht_glocke", String(Date.now())); } catch (e) {}
        raumEreignis("Der Unterricht beginnt — " + zustand.ichName + " ist im Klassenzimmer");
        anAlle("system", "🔔 Der Unterricht beginnt. Die Einladung liegt in jedem Postfach.");
      }).catch(function (e) {
        systemZeile("Das ging nicht: " + ((e && e.message) || "unbekannter Fehler"));
      });
      return true;
    }

    /* ---- Die letzte Sprachnachricht zurueckrufen ----
       GEWUENSCHT: „Vielleicht auch die Moeglichkeit, dass man die
       Nachricht wieder zurueckrufen kann oder loeschen, falls man
       Quatsch erzaehlt hat."

       Ehrlich, was das kann und was nicht: hat jemand sie schon
       GEHOERT, ist sie gehoert — zurueckholen kann man nichts, was
       schon aus dem Lautsprecher kam. Was geht: sie aus der
       Warteschlange nehmen, bevor sie dran war, und sie ueberall
       aus dem Chat entfernen. Genau das steht auch in der Antwort,
       damit sich niemand in Sicherheit wiegt. */
    if (art === "weg") {
      var meine = null;
      for (var iw = zustand.nachrichten.length - 1; iw >= 0; iw--) {
        var nw = zustand.nachrichten[iw];
        if (nw && nw.eigen && (nw.sprach || nw.art === "quittung")) { meine = nw; break; }
      }
      if (!meine) return systemZeile("Du hast hier noch nichts gesprochen.");
      var idW = String(meine.id).replace(/-quittung$/, "").replace(/-selbst$/, "");
      var nochNichtGehoert = sprachZurueckrufen(idW, true).ungehoert;
      return systemZeile(nochNichtGehoert
        ? "↩️ Zurückgerufen — sie war noch nicht dran und ist jetzt weg."
        : "↩️ Aus dem Chat entfernt. Wer sie schon gehört hat, hat sie gehört — "
          + "das lässt sich nicht zurückholen.");
    }

    /* ---- Fokus-Modus an oder aus ----
       „Der Fokus-Modus … den Livestream-Modus nehmen wir nur zum
       freien Quatschen." Also zwei Betriebsarten, ein Schalter. */
    if (art === "fokus") {
      if (!darfFokusSchalten()) {
        return systemZeile("Den Fokus-Modus schaltet der " + rangWort(true) + " — "
          + "er gilt fuer den ganzen Raum, nicht nur fuer dich.");
      }
      var willAn = fokusAn();
      if (/^(an|ein|ja)$/i.test(rest.trim())) willAn = true;
      else if (/^(aus|nein|weg|frei)$/i.test(rest.trim())) willAn = false;
      else willAn = !fokusAn();
      fokusSetzen(willAn);
      melden();
      return systemZeile(willAn
        ? "🎧 Fokus-Modus an — solange jemand spricht, nimmt niemand sonst auf. "
          + "Geschrieben werden darf jederzeit."
        : "🗣️ Fokus-Modus aus — alle dürfen durcheinander reden (freies Quatschen).");
    }

    /* ---- Wie der eigene Platz beim Sprechen aussieht ---- */
    if (art === "sprechbild") {
      var wahl = rest.trim().toLowerCase();
      if (!SPRECHBILDER[wahl]) {
        return systemZeile("Deine Sprech-Animation — gerade: „"
          + SPRECHBILDER[zustand.sprechbild || "ring"] + "“.\n"
          + Object.keys(SPRECHBILDER).map(function (k) {
              return "  /sprechbild " + k + (k === (zustand.sprechbild || "ring") ? "  ← jetzt" : "")
                + "\n      " + SPRECHBILDER[k];
            }).join("\n"));
      }
      zustand.sprechbild = wahl;
      sprechbildMerken(wahl);
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn,
               bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
               sprechbild: zustand.sprechbild });
      melden();
      return systemZeile("Beim Sprechen zeigt dein Platz jetzt: " + SPRECHBILDER[wahl] + ".");
    }

    /* ---- Sprachnachrichten sichtbar machen ----
       Derselbe Schalter wie der lange Druck auf das Halte-Zeichen,
       nur zum Tippen. Der Schlüssel ist bewusst DERSELBE wie in
       app.js (dma_lc_mitschrieb) — zwei Gedächtnisse für einen
       Schalter laufen sonst auseinander. */
    if (art === "nachhoeren" || art === "mitschrieb") {
      var anJetzt = !liveSichtbar;
      if (/^(an|ein|ja)$/i.test(rest.trim())) anJetzt = true;
      if (/^(aus|nein|weg)$/i.test(rest.trim())) anJetzt = false;
      liveSichtbar = anJetzt;
      try { localStorage.setItem("dma_lc_mitschrieb", anJetzt ? "an" : "aus"); } catch (e) {}
      return systemZeile(anJetzt
        ? "📝 Sprachnachrichten stehen jetzt auch im Chat — zum Nachhören und Herunterladen."
        : "📝 Sprachnachrichten sind wieder unsichtbar — gehört werden sie trotzdem.");
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
             bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
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
    verlassen(neuerRaum);
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

  /* =========================================================
     DIE EINLADUNG INS POSTFACH
     ---------------------------------------------------------
     Sie geht ueber das KONTO (Backend), nicht ueber die
     Leitung — die gibt es fuer eine Person, die gerade nicht
     da ist, ja nicht. Und sie geht nur an Leute, die wirklich
     nicht erreichbar sind: wer schon in einem Raum sitzt,
     bekommt keine Post, sondern wird direkt gerufen.

     Der Link in der Nachricht traegt den Raum (#raum=…), damit
     ein Tipp im Postfach genau HIERHIN fuehrt und nicht auf
     die Startseite.
     ========================================================= */
  function einladungInsPostfach(name, still) {
    /* EINE ABSAGE MUSS SAGEN, WORAN ES LIEGT.
       GEMELDET: „Einladen kann ich immer noch nicht." Mit einem
       pauschalen „steht nicht zur Verfuegung" kann niemand etwas
       anfangen — ich auch nicht, wenn er es mir weitergibt. Also
       wird hier Stueck fuer Stueck geprueft und jedes Mal gesagt,
       WELCHES Stueck fehlt. */
    var B = konto();
    if (!B) {
      systemZeile("Das Konto ist auf dieser Seite gerade nicht geladen (backend.js fehlt). "
        + "Lade die Seite einmal neu.");
      return;
    }
    if (!B.currentUser || !B.currentUser()) {
      systemZeile("Zum Einladen per Postfach musst du angemeldet sein — "
        + "im Chat bist du nur mit einem Spitznamen unterwegs.");
      return;
    }
    if (!B.searchUsers) { systemZeile("Die Mitgliedersuche fehlt in dieser Fassung."); return; }
    if (!B.sendPrivateMessage) { systemZeile("Das Postfach fehlt in dieser Fassung."); return; }
    if (B.isConfigured && !B.isConfigured()) {
      systemZeile("Die Datenbank ist nicht eingerichtet — ohne sie gibt es kein Postfach. "
        + "Im Übungsbetrieb kannst du nur einladen, wer gerade da ist.");
      return;
    }
    if (!still) systemZeile("Suche „" + name + "“ …");
    B.searchUsers(name).then(function (treffer) {
      var liste = (treffer || []).filter(function (t) { return t && t.id && t.name; });
      if (!liste.length) {
        if (!still) {
          systemZeile("Es gibt niemanden mit dem Namen „" + name + "“. "
            + "Schreib den Namen so, wie er im Profil steht — Gross- und Kleinschreibung ist egal.");
        }
        return;
      }
      /* Mehrere Treffer: dann erst fragen. Eine Einladung an die
         falsche Person kann man nicht zurueckholen. */
      var genau = liste.filter(function (t) {
        return String(t.name).toLowerCase() === name.toLowerCase();
      });
      if (genau.length !== 1 && liste.length > 1) {
        systemZeile("Mehrere passen: " + liste.map(function (t) { return t.name; }).join(", ")
          + "\nSchreib den Namen genau aus:  /i " + liste[0].name);
        return;
      }
      var ziel = genau[0] || liste[0];
      /* HIER STAND EINE ABSAGE, UND SIE WAR FALSCH.
         Sie lautete: „ist gerade selbst in einem Raum — da braucht
         es keinen Brief", und dann passierte gar nichts. Genau das
         war der Riegel, der sich wie „ich kann das nicht abschicken"
         angefuehlt hat.

         Ausdruecklich gewuenscht: „Das Einladen von Leuten soll
         nicht gesperrt sein … ich moechte das selber entscheiden
         koennen", und frueher schon: „dass ich Emmy einladen kann,
         unabhaengig davon, ob sie online ist oder nicht."

         Also: der Brief geht IMMER. Dass jemand irgendwo sitzt, ist
         eine Auskunft, kein Grund, die Einladung zu verschlucken —
         wer in einem anderen Raum sitzt, sieht meinen Ruf ja gerade
         nicht. Die Auskunft wird trotzdem gesagt, damit man weiss,
         dass man auch einfach hingehen koennte. */
      var woAnders = "";
      Object.keys(praesenzDa).forEach(function (id) {
        var e = praesenzDa[id];
        if (e && e.raum && String(e.name || "").toLowerCase() === String(ziel.name).toLowerCase()) {
          woAnders = e.raum;
        }
      });
      var link = adresseMitRaum(zustand.raum);
      /* GEMELDET: „Im Briefkasten steht nur die Adresszeile … Wir
         hatten das frueher immer so, dass man das anklicken konnte
         ueber eine Schaltflaeche, so wie wir das vom Design hatten,
         auch wenn jemand Beta-Tester wurde."

         Das Postfach kennt diese Marke laengst: aus „[RAUM:name]"
         baut es einen richtigen Knopf („In den Raum gehen"), genau
         wie bei der Beta-Einladung. Ich hatte stattdessen die rohe
         Adresse hineingeschrieben — die muss man abtippen, und
         niemand tippt eine Adresse ab. Die Adresse bleibt trotzdem
         darunter stehen, fuer den Fall, dass jemand die Nachricht
         weiterleitet oder an einem anderen Geraet liest. */
      var text = "🔔 " + zustand.ichName + " lädt dich ins Klassenzimmer ein"
        + (zustand.raum !== HAUPTRAUM ? " — in „" + raumKlartext(zustand.raum) + "“" : "")
        + ".\n\nWenn du gerade keine Zeit hast, ist das auch in Ordnung — "
        + "die Einladung bleibt stehen.\n\n" + link
        + "\n[RAUM:" + zustand.raum + "]";
      return B.sendPrivateMessage(ziel.id, text, null).then(function () {
        if (woAnders && woAnders !== zustand.raum) {
          systemZeile("✉️ Die Einladung liegt in " + ziel.name + "s Postfach, mit Knopf hierher. "
            + "(" + ziel.name + " sitzt gerade in „" + raumKlartext(woAnders) + "“ — "
            + "mit  /f " + ziel.name + "  gehst du selbst hin.)");
        } else if (still) {
          systemZeile("✉️ Und zur Sicherheit liegt die Einladung auch in " + ziel.name + "s Postfach.");
        } else {
          systemZeile("✉️ " + ziel.name + " war nicht da — die Einladung liegt jetzt im Postfach, mit Link hierher.");
        }
      });
    }).catch(function (e) {
      systemZeile("Das ging nicht: " + ((e && e.message) || "unbekannter Fehler")
        + "\n(Wenn das bleibt: /diagnose zeigt, was hier erreichbar ist.)");
    });
  }

  /* Was ist von hier aus ueberhaupt erreichbar? Ein Befund statt
     eines Ratens — damit eine Absage nachpruefbar wird. */
  function diagnose() {
    var B = konto();
    var z = [];
    z.push("🔌 Befund");
    z.push("  Konto geladen      : " + (B ? "ja" : "NEIN — backend.js fehlt"));
    if (B) {
      var an = false;
      try { an = Boolean(B.currentUser && B.currentUser()); } catch (e) {}
      z.push("  angemeldet         : " + (an ? "ja" : "nein"));
      try {
        z.push("  Datenbank          : "
          + (B.isConfigured ? (B.isConfigured() ? "eingerichtet" : "NICHT eingerichtet") : "unbekannt"));
      } catch (e) {}
      z.push("  Mitgliedersuche    : " + (B.searchUsers ? "da" : "fehlt"));
      z.push("  Postfach           : " + (B.sendPrivateMessage ? "da" : "fehlt"));
      z.push("  Rundmail           : " + (B.sendBroadcastMessage ? "da" : "fehlt"));
      var ow = false;
      try { ow = Boolean(B.isOwner && B.isOwner()); } catch (e) {}
      z.push("  Betreiber          : " + (ow ? "ja" : "nein"));
    }
    /* =========================================================
       DIE FÜNF ZAHLEN, AN DENEN DER NOTENKNOPF HÄNGT
       ---------------------------------------------------------
       GEMELDET, zum sechsten Mal: „Die Benotung ist immer noch nicht
       da. Was ist denn da so schwer?"

       Ich habe sechsmal eine Ursache gefunden und behoben, und jedes
       Mal blieb es bei ihm trotzdem aus. Meine Messungen laufen alle
       im Prüfstand — dort stimmt jede einzelne. Was ich NICHT sehen
       kann, ist sein Gerät: ob er dort als Lehrer erkannt wird, ob
       eine Aufgabe offen steht, ob ihre Nachricht die Kennung
       mitbringt. Genau diese fünf Dinge stehen jetzt hier, damit wir
       es in EINER Runde wissen statt in sieben.

       Der Notenknopf erscheint genau dann, wenn alle fünf stimmen.
       Steht hier ein NEIN, ist es genau das eine. */
    var istLehrer = false;
    try { istLehrer = binLehrer(); } catch (e) {}
    z.push("  ── Notenknopf ──");
    z.push("  1. du bist Lehrer   : " + (istLehrer ? "ja" : "NEIN — dann kommt nie ein Notenknopf"));
    z.push("  2. Aufgabe offen    : " + (offeneAufgabe
      ? ("ja (" + offeneAufgabe.typ + ") „"
         + String(offeneAufgabe.frage || offeneAufgabe.loesung || "").slice(0, 34) + "“")
      : "NEIN"));
    if (!offeneAufgabe) {
      /* Das ist kein Fehler, sondern die Regel, um die er selbst
         gebeten hat: „Ich moechte diese Benotung nicht global haben,
         nur an den Antworten von den Aufgaben." Ohne Aufgabe gibt es
         also bewusst keinen Notenknopf. Nur: das steht nirgends, und
         dann sieht es aus wie ein Fehler. Jetzt steht es hier. */
      z.push("     → Ohne offene Aufgabe gibt es KEINEN Notenknopf — so war es gewünscht.");
      z.push("     → Stell eine:  /aufgabe Schreib drei Sätze über dein Wochenende");
      z.push("       oder  /satz Der Hund läuft über die Wiese  oder  /wort Fahrrad");
      z.push("       Danach zählt jede Antwort dazu, von allen, beliebig oft.");
    }
    /* Was liegt an den letzten fremden Zeilen wirklich an? */
    var fremde = (zustand.nachrichten || []).filter(function (n) {
      return n && n.von && !n.eigen && (n.art === "text" || n.art === "aktion");
    }).slice(-3);
    z.push("  3. letzte Antworten : " + (fremde.length ? "" : "keine fremden Zeilen da"));
    fremde.forEach(function (n) {
      var b = null;
      try { b = aufgabeBezug(n); } catch (e) {}
      z.push("     " + String(n.name || "?").slice(0, 10) + ": „"
        + String(n.text || "").slice(0, 22) + "“ → "
        + (n.aufgabeId ? "Kennung da" : "OHNE Kennung")
        + (b ? " · Knopf JA" : " · Knopf nein"));
    });
    z.push("  4. deine Fassung    : " + (window.DMA_VERSION || "?"));
    /* Und der Kandidat, der ALLE Animationen auf einmal erklärt. */
    var ruhig = false;
    try {
      ruhig = Boolean(window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {}
    z.push("  5. Bewegung reduz.  : " + (ruhig
      ? "AN — dein Gerät bittet um wenig Bewegung. Die Effekte laufen dann ruhig statt zu fliegen."
      : "aus — Animationen laufen voll"));
    /* =========================================================
       WARUM HOERT MICH DIE ANDERE SEITE NICHT?
       ---------------------------------------------------------
       GEMELDET: „Ich habe mit Emmi gesprochen, sie konnte mich
       niemals hoeren. Ich hab es extra eingestellt, dass wir uns
       alle gleichzeitig hoeren koennen … war bei ihr vielleicht
       noch die Fokus-Variante an, und sie muss das bei sich
       selbst einstellen?"

       Nein — und genau das soll hier stehen, damit niemand bei
       sich sucht, wo nichts einzustellen ist. Der Fokus-Modus ist
       eine Regel des RAUMS: der Lehrer beziehungsweise Haeuptling
       schaltet, alle anderen bekommen sie zugeschickt. Und sie
       verhindert nur das AUFNEHMEN, solange jemand spricht — nie
       das Hoeren. Hoert jemand gar nichts, liegt es an der
       Leitung, und dafuer gibt es /leitung. */
    z.push("  ── Stimme ──");
    var fok = false;
    try { fok = fokusAn(); } catch (e) {}
    z.push("  Fokus-Modus         : " + (fok
      ? "AN — nacheinander sprechen, als Sprachnachricht"
      : "aus — freies Durcheinander ueber die Leitung"));
    z.push("     → Regel des RAUMS. Nur " + rangWort(true)
      + " schaltet sie mit /fokus. Bei den anderen ist nichts einzustellen.");
    z.push("     → Sie verhindert nur das AUFNEHMEN, nie das Hoeren.");
    var gem;
    try { gem = gemerkterFokus(zustand.raum); } catch (e) {}
    z.push("  bleibt beim Neuladen: " + (typeof gem === "boolean"
      ? "ja (" + (gem ? "an" : "aus") + ")"
      : "noch nie geschaltet — es gilt die Voreinstellung"));
    z.push("     → Hoert dich jemand gar nicht, ist es die Leitung: /leitung");
    /* ── Filme ──
       GEMELDET: „Es ging beides nicht … erzaehl mir sowas nicht."
       Statt zu raten, steht hier ab jetzt schwarz auf weiss, was das
       Geraet ueber die Filme weiss: welche es findet, welchen Weg es
       nimmt (Chrome/Android oder die Safari-Fassung) und woran der
       letzte Versuch gescheitert ist. */
    z.push("  ── Filme ──");
    z.push("  Fassung            : " + (window.DMA_VERSION || "?"));
    var fspieler = window.DMA_FILM;
    z.push("  Abspieler geladen  : " + (fspieler ? "ja" : "noch nicht (kommt beim ersten /film)"));
    if (fspieler && fspieler.kannAlphaWebm) {
      z.push("  Weg auf diesem Geraet: " + (fspieler.kannAlphaWebm()
        ? "WebM mit Durchsichtigkeit (Chrome, Firefox, Android)"
        : "Bild + Maske nebeneinander (Safari, iPhone)"));
    }
    if (fspieler && fspieler.letzterTon) {
      z.push("  Ton beim letzten Mal: " + (fspieler.letzterTon() || "noch keiner gelaufen"));
    }
    var fgrund = "";
    try { fgrund = (window.DMA_FILM_GRUND && window.DMA_FILM_GRUND()) || ""; } catch (e) {}
    z.push("  letzter Versuch    : " + (fgrund ? fgrund : "ohne Beanstandung"));
    z.push("     → Welche es gibt, zeigt  /film  ohne Namen.");
    z.push("  ────────────────");
    z.push("  dein Rang hier     : " + rangWort(true));
    z.push("  Raum               : " + zustand.raum + (zustand.raum === HAUPTRAUM ? " (Hauptraum)" : ""));
    z.push("  Leute im Raum      : " + Object.keys(zustand.leute).length);
    z.push("  sonst gerade da    : " + Object.keys(praesenzDa).length);
    /* Die Leitung — genau das, wonach gefragt wurde: „Gibt es eine
       Moeglichkeit zu ueberpruefen, ob die Leitung frei ist?" */
    z.push("  Leitung            : " + (liveLaeuftGerade
      ? (liveLaeuftGerade.name || "jemand") + " spricht, noch " + liveRest() + " s"
      : "frei"));
    z.push("  in der Reihe       : " + liveWarteschlange.length);
    if (wartendePakete.length) {
      z.push("  wartet auf Netz    : " + wartendePakete.length + " Zeile(n)");
    }
    /* Und die Uhren. Ein grosser Unterschied erklaert mehr, als man
       denkt — er stand heute hinter „ich hoere dich nicht mehr". */
    var uhren = uhrenStand().filter(function (u) { return Math.abs(u.versatz) > 5000; });
    if (uhren.length) {
      uhren.forEach(function (u) {
        var sek = Math.round(Math.abs(u.versatz) / 1000);
        var wie = sek >= 120 ? Math.round(sek / 60) + " Minuten" : sek + " Sekunden";
        z.push("  Uhr von " + (u.name + "            ").slice(0, 11) + ": geht "
          + wie + (u.versatz > 0 ? " VOR" : " NACH"));
      });
      z.push("  (Das stoert das Hoeren nicht mehr — die Reihenfolge im");
      z.push("   Verlauf kann es aber verschieben.)");
    } else if (Object.keys(uhrVersatz).length) {
      z.push("  Uhren im Raum      : gehen gleich");
    }
    return systemZeile(z.join("\n"));
  }

  /* Wer alles mit einem Tipp eingeladen werden koennte: die
     Freunde. „Wenn ich /i mache, moechte ich meine Freunde
     angezeigt bekommen." Wer gerade in einem Raum ist, steht mit
     einem Punkt da — den lade ich direkt ein, nicht per Post. */
  function freundeZeigen() {
    var B = konto();
    var hier = {};
    Object.keys(praesenzDa).forEach(function (id) {
      var e = praesenzDa[id];
      if (e && e.raum) hier[String(e.name || "").toLowerCase()] = e.raum;
    });
    if (!B || !B.getFriends || !B.currentUser || !B.currentUser()) {
      systemZeile("So geht es:  /i Nickname\n"
        + "Wer gerade da ist, wird sofort gerufen; wer nicht da ist, bekommt die Einladung ins Postfach.");
      return;
    }
    B.getFriends().then(function (freunde) {
      var liste = (freunde || []).filter(function (f) { return f && f.name; });
      if (!liste.length) {
        systemZeile("Du hast noch niemanden in deiner Freundesliste. "
          + "Einladen geht trotzdem:  /i Nickname");
        return;
      }
      systemZeile("Deine Freunde — mit  /i Name  einladen:\n"
        + liste.map(function (f) {
            var wo = hier[String(f.name).toLowerCase()];
            return "  /i " + f.name + (wo ? "   \u25cf ist gerade da" : "   ✉️ bekommt Post");
          }).join("\n"));
    }).catch(function () {
      systemZeile("So geht es:  /i Nickname");
    });
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

  /* =========================================================
     EIN BEFEHL, DEN ES NICHT GIBT, IST KEINE NACHRICHT
     ---------------------------------------------------------
     GEMELDET: „Ich moechte, dass es Befehle, die es nicht gibt,
     nicht schickt — also zum Beispiel, wenn ich schreibe /hallo,
     dass das nicht gesendet wird."

     Vorher fiel jede Zeile mit Schraegstrich, die kein Befehl
     war, einfach durch und stand als gewoehnlicher Text im Raum.
     Ein Vertipper („/knofetti") ging damit an alle hinaus.

     Jetzt haelt sie hier an. Und zwar nur sie: geprueft wird, ob
     nach dem Schraegstrich SOFORT ein Buchstabe kommt — „/ 3 mal
     4" oder „3/4" sind ganz gewoehnlicher Text und bleiben es.
     Wer wirklich einen Schraegstrich voranstellen will, schreibt
     zwei: „//hallo" geht als „/hallo" hinaus. Und „/me/" ist der
     alte Namenstrick, kein Befehl — der muss durch.
     ========================================================= */
  /* Kennen wir das Wort ueberhaupt? Dieselben drei Quellen wie in
     befehlAusfuehren: Langform, Kurzform, Aliastabelle. Es steht
     hier getrennt, weil „bekannt" und „hat etwas getan" zwei
     verschiedene Fragen sind — ein bekannter Befehl, der nichts
     zurueckgibt, darf trotzdem nicht als Text hinausgehen. */
  function befehlBekannt(wort) {
    var w = String(wort || "").toLowerCase();
    if (!w) return false;
    var da = false;
    BEFEHLE.forEach(function (b) { if (b.w === w || (b.kurz && b.kurz === w)) da = true; });
    return da || Boolean(KURZ[w]);
  }

  function befehlFehlt(t) {
    var wort = (/^\/([a-zäöüß0-9]+)/i.exec(t) || [])[1] || "";
    var vor = befehlsVorschlaege(wort).slice(0, 4);
    systemZeile("„/" + wort + "“ kenne ich nicht — die Zeile ist NICHT hinausgegangen."
      + (vor.length
          ? "\nMeintest du:  " + vor.map(function (b) { return "/" + b.w; }).join("   ")
          : "")
      + "\n/h zeigt alle Befehle. Soll der Schrägstrich wirklich mit, schreib ihn doppelt:  //"
      + wort);
  }

  function schreiben(text) {
    var t = String(text || "").trim().slice(0, CHAT_LAENGE);
    if (!t) return;
    if (t.slice(0, 2) === "//") {
      t = t.slice(1);
    } else if (/^\/[a-zäöüß0-9]/i.test(t) && !/^\/me\//i.test(t)) {
      var wortT = (/^\/([a-zäöüß0-9]+)/i.exec(t) || [])[1] || "";
      if (!befehlBekannt(wortT)) { befehlFehlt(t); return; }
      befehlAusfuehren(t);
      return;
    }
    /* GEWUENSCHT: „#pinguin — einfach das Emoji auch moeglich machen,
       den Pinguin zu schicken." Also: ein Zeichen allein oder ein
       „#wort" ist derselbe Befehl wie der Schraegstrich. Es ist
       bewusst DERSELBE Weg (befehlAusfuehren) und keine zweite
       Maschinerie: sonst koennte das eine irgendwann etwas anderes
       tun als das andere. Ein Zeichen MITTEN im Satz bleibt ein
       Zeichen im Satz — siehe befehlAusZeichen(). */
    var ausZeichen = befehlAusZeichen(t);
    if (ausZeichen) {
      var restZ = t.charAt(0) === "#" ? t.slice(1).split(/\s+/).slice(1).join(" ") : "";
      if (befehlAusfuehren("/" + ausZeichen + (restZ ? " " + restZ : ""))) return;
    }
    if (geknebelt()) { systemZeile("Du bist gerade geknebelt und kannst nichts sagen."); return; }
    /* Steht „/me/" im Satz, ist es eine AKTION: der Name steht dann
       mitten in der Zeile und darf nicht zusätzlich davor stehen. */
    var alsAktion = hatEigennamen(t);
    t = textAufbereiten(t);
    var n = {
      id: neueNachrichtId(),
      von: zustand.ichId, name: zustand.ichName,
      text: t, art: alsAktion ? "aktion" : "text",
      zeit: Date.now(), eigen: true, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
      geschlecht: zustand.geschlecht || ""
    };
    /* =========================================================
       DIE REGEL SITZT IM ABSCHICKEN — NIEMAND MUSS EINEN KNOPF
       DRUECKEN
       ---------------------------------------------------------
       GEMELDET: „Das ,Darauf antworten' soll dort nicht stehen. Es
       soll logisch sein in dem Moment, wo man das abschickt — das
       musst du in der Klasse regeln und nicht die Leute auf den Knopf
       druecken lassen. Es soll auch so sein, dass mehrere Schueler auf
       eine Frage antworten koennen, und wenn die ersten noch nicht
       geantwortet haben, sollen die das immer machen koennen.
       Antworten tut man mit dem Abschick-Knopf."

       Genau so ist es jetzt: Steht eine Aufgabe offen, dann IST das,
       was ich abschicke, eine Antwort darauf — und die Nachricht sagt
       das selbst. Die Kennung der Aufgabe wird hier angehaengt, auf
       dem Geraet des Absenders, im Augenblick des Abschickens. Sie
       reist mit ueber die Leitung, liegt im Geraet und steht im
       Verlauf.

       Das ist der Unterschied zu allem, was ich vorher versucht habe:
       Die EMPFANGENDE Seite muss nichts mehr erraten — nicht an der
       Uhrzeit, nicht an der Reihenfolge, nicht an der Aehnlichkeit.
       Sie liest es ab.

       Und es gilt fuer jeden und beliebig oft: Zehn Schueler koennen
       dieselbe Frage beantworten, und wer sich eine Stunde spaeter
       doch noch traut, ist genauso dabei. Es gibt keine „erste
       Antwort", die die anderen aussperrt.

       Nur Befehle sind ausgenommen — die kommen hier gar nicht an
       (befehlAusfuehren weiter oben faengt sie ab). Wer „/konfetti"
       schreibt, beantwortet nichts.
       ========================================================= */
    if (offeneAufgabe) {
      n.aufgabeId = offeneAufgabe.zeileId || ("a" + (offeneAufgabe.zeit || 0));
      n.aufgabeFrage = offeneAufgabe.frage || offeneAufgabe.loesung || "";
      n.aufgabeKlasse = aufgabeKlasse(offeneAufgabe.typ);
      n.versuch = true;
    }
    nachrichtAnhaengen(n);
    serverSichern(n);
    senden({ art: "text", id: n.id, name: n.name, text: n.text, zeit: n.zeit,
             chatArt: n.art, bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
             sprechbild: zustand.sprechbild, geschlecht: zustand.geschlecht || "",
             aufgabeId: n.aufgabeId || "", aufgabeFrage: n.aufgabeFrage || "",
             aufgabeKlasse: n.aufgabeKlasse || "" });
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
    /* Fuer die Betreiber-Ansicht: wo kommt das Relais gerade her? */
    relaisLage: relaisLage,
    /* Die Server, die gerade wirklich benutzt werden — fuer den
       Test in den Einstellungen. */
    eisServer: function () { return VERMITTLER; },
    /* IST DAS EINE ZEILE, DIE ETWAS AUSLOEST?
       Die Oberflaeche muss das wissen, BEVOR sie abschickt: nach einem
       Befehl soll die Tastatur zugehen und der Chat an seinen Platz
       springen, damit man die Animation sieht. Nach einem gewoehnlichen
       Satz soll die Tastatur offen bleiben — sonst muesste man fuer
       jeden zweiten Satz neu hineintippen. */
    istBefehlszeile: function (text) {
      var t = String(text || "").trim();
      if (!t) return false;
      if (t.slice(0, 2) === "//") return false;
      if (/^\/me\//i.test(t)) return false;
      if (/^\/[a-zäöüß0-9]/i.test(t)) {
        var w = (/^\/([a-zäöüß0-9]+)/i.exec(t) || [])[1] || "";
        return befehlBekannt(w);
      }
      return Boolean(befehlAusZeichen(t));
    },
    relaisGrundKlartext: relaisGrundKlartext,
    relaisHolen: relaisHolen,
    relaisRufen: relaisRufen,
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
    /* Redet gerade jemand? Die Oberflaeche braucht das, um den Ton
       der Animationen leiser zu drehen, solange gesprochen wird —
       gewuenscht: „dann muss es ein Ducking geben von den Leuten, die
       sprechen, damit dieser Ton nicht dominiert." */
    redetJemand: function () {
      if (zustand.spricht) return true;
      var ja = false;
      Object.keys(zustand.leute || {}).forEach(function (id) {
        if (zustand.leute[id] && zustand.leute[id].spricht) ja = true;
      });
      return ja;
    },
    beiAenderung: beiAenderung,
    moeglich: moeglich,
    neuerRaumName: neuerRaumName,
    /* Welche Effekte per BEFEHL erreichbar sind. Nicht welche
       gezeichnet werden koennen — genau dieser Unterschied hat
       neunzehn Animationen monatelang unerreichbar gemacht.
       effektetuer.js haelt beide Listen gegeneinander. */
    /* DAS WHITEBOARD — Striche, Bilder, Zeiger, Blick.
       Sie gehen an alle im Raum, aber NICHT in den Chatverlauf: ein
       Strich ist kein Satz. */
    /* Schiffe versenken: ein Tipp aufs Brett. Was er bedeutet,
       entscheidet der Abschnitt des Spiels — siehe schiffeWahl. */
    /* WELCHE AUFGABE GERADE LAEUFT.
       GEMELDET: „die andere Person kann sogar eine falsche Antwort
       eintragen. Ich habe ‚Emmi ist cool' geschrieben und sie hat
       ‚das ist cool' abgeschickt aus der Aufgabe heraus, was
       eigentlich gar nicht moeglich sein sollte."
       GEFUNDEN: im Verlauf stehen ALLE frueheren Aufdeck-Tafeln, und
       jede war weiter bedienbar — mit ihrer alten Loesung. Damit die
       Tafel weiss, ob sie noch die aktuelle ist, sagt es ihr diese
       Auskunft. */
    aufgabeStand: function () {
      if (!offeneAufgabe) return { offen: false, zeileId: "", typ: "", dran: "" };
      return { offen: true, zeileId: offeneAufgabe.zeileId || "",
               typ: offeneAufgabe.typ || "", dran: offeneAufgabe.dran || "" };
    },
    schiffeWahl: function (nr) { return schiffeWahl(nr); },
    schiffeStand: function () { return schiffeStand; },
    tafelSenden: function (d) {
      if (!d || typeof d !== "object") return false;
      senden({ art: "tafel", tafel: d });
      return true;
    },
    /* Das Verkleinern liegt hier, weil hier auch die Bilder fuer den
       Chat verkleinert werden — zweimal dieselbe Rechnung waere
       zweimal dieselbe Wartung. */
    bildKlein: function (datei, kante, hoechst) { return bildVerkleinern(datei, kante, hoechst); },
    effektBefehle: function () {
      /* Genannt ist hier die WIRKUNG, nicht das Befehlswort: „/leck"
         loest die Wirkung „lecken" aus, „/drueck" die Wirkung
         „umarmen". Verglichen wird ja mit den Wirkungen in app.js. */
      var w = Object.keys(WETTER).concat(["konfetti", "ballon", "geschenk",
                                          "lecken", "boxen", "herz", "umarmen"]);
      /* Die Animationen, die einem PLATZ gelten. Ihr Befehlswort ist
         oft ein anderes als ihre Wirkung („/wasser" loest „eimer"
         aus, „/herz Name" loest „zherz" aus) — erreichbar sind sie
         trotzdem, und genau das prueft effektetuer.js. */
      Object.keys(AM_PLATZ).forEach(function (k) { w.push(AM_PLATZ[k].wirkung); });
      Object.keys(AUCH_AM_PLATZ).forEach(function (k) { w.push(AUCH_AM_PLATZ[k].wirkung); });
      /* Und die drei, deren Tuer nicht in einer der Tabellen steht:
         „zherz", „heber" und „lasso" haengen an /herz und /heb, und
         „lotto" an „/zufall OHNE Namen" — dieselbe Tuer wie „zufall",
         nur ohne Anhang. Eine Wirkung ohne Tuer ist toter Code, und
         genau das prueft pruefe-effekttueren; diese vier haben eine,
         sie steht nur nicht in einer Tabelle. */
      w.push("zherz", "heber", "lasso", "lotto");
      /* Und die Musik: „musik" haengt an /musik mit einem Lied, „musikaus"
         an /musik aus. Beide haben eine Tuer, sie steht nur in einer
         eigenen Abzweigung und nicht in einer Tabelle. */
      w.push("musik", "musikaus", "musikpause", "musikweiter");
      /* Und das Whiteboard: „tafelauf" haengt an /tafel, „tafelzu" an
         /tafel aus — auch das eine eigene Abzweigung, keine Tabelle. */
      w.push("tafelauf", "tafelzu");
      /* Und „notenlied": /noten MIT einem Liednamen. */
      w.push("notenlied");
      return w;
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
    /* NACHLESEN, WAS IM CHAT STEHT. Ohne das laesst sich eine
       Systemzeile („diese Filme liegen bereit") nicht pruefen: sie
       haengt an der Oberflaeche, und eine Sonde hat keine. Gibt nur
       Text zurueck, aendert nichts. */
    pruefZeilen: function (n) {
      return (zustand.nachrichten || []).slice(-(n || 20))
        .map(function (z) { return String(z.text || ""); });
    },
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
    /* Einen Puls von Hand ausloesen — damit sich nachmessen laesst,
       WAS er mitnimmt, ohne sechs Sekunden zu warten. */
    pruefPuls: function () {
      senden({ art: "puls", name: zustand.ichName, tonAn: zustand.tonAn,
               bildAn: zustand.bildAn, bild: zustand.ichBild,
               seit: zustand.seit, buehne: zustand.buehne, spricht: zustand.spricht,
               geschlecht: zustand.geschlecht || "", konto: kontoId || "",
               sprechbild: zustand.sprechbild || "", sitz: sitzTausch });
    },
    pruefEmpfangenPost: function (n) { return postEmpfangen(n); },
    pruefPostAbfangen: function (f) { pruefPostHaken = typeof f === "function" ? f : null; },
    pruefPostEmpfangen: function (n) { return postEmpfangen(n); },
    /* Sprachnachrichten — nach aussen, damit die Oberflaeche sie
       bedienen kann, und fuer die Pruefung. */
    sprachGehtDas: sprachGehtDas,
    sprachLaeuft: sprachLaeuft,
    sprachAufnahmeStarten: sprachAufnahmeStarten,
    sprachAufnahmeStoppen: sprachAufnahmeStoppen,
    sprachAbbrechen: sprachAbbrechen,
    pruefSprachSenden: function (daten, sek, wie) { return sprachSenden(daten, sek, wie); },
    /* Was wirklich auf den Kanal ginge — ohne Kanal. */
    pruefAbfangen: function (f) { pruefSenderHaken = typeof f === "function" ? f : null; },
    pruefWarteschlange: function () { return liveWarteschlange.map(function (w) { return w.id; }); },
    /* Nur zum Nachmessen: Stuecke einsortieren und ansehen, in
       welcher Reihenfolge sie herauskommen. Fasst die echte Reihe
       nicht an. */
    /* Nur zum Nachmessen: eine Wortmeldung in Stuecken empfangen,
       dabei eines verlieren, und sehen, ob danach gefragt wird und
       ob sie am Ende vollstaendig ist. Fasst nichts Echtes an. */
    beiHinweis: function (f) { hinweisRuf = typeof f === "function" ? f : null; },
    hoertMirZu: hoertMirZu,
    hoereJetzt: hoereJetzt,
    sprachRuecknahmen: sprachRuecknahmen,
    sprachWiederherstellen: sprachWiederherstellen,
    pruefSprachVerlust: function (anzahl, verliere) {
      var id = "pruef-" + Date.now();
      var gefragt = [];
      var merkSenden = senden;
      /* senden ist eine Funktion im Modul; hier wird sie nicht
         ersetzt, sondern die Nachfrage direkt beobachtet. */
      var ganz = null;
      for (var i = 0; i < anzahl; i++) {
        if (i === verliere) continue;
        ganz = sprachTeilEmpfangen({ id: id, nr: i, anzahl: anzahl,
                                     teil: "T" + i, von: "emmy", name: "Emmy" });
      }
      var b = sprachBausteine[id];
      var fehltJetzt = [];
      if (b) { for (var k = 0; k < b.anzahl; k++) { if (b.teile[k] === undefined) fehltJetzt.push(k); } }
      var vollstaendigVorher = Boolean(ganz);
      /* Jetzt kommt das fehlende Stueck nach — wie nach der Nachfrage. */
      ganz = sprachTeilEmpfangen({ id: id, nr: verliere, anzahl: anzahl,
                                   teil: "T" + verliere, von: "emmy", name: "Emmy" });
      return { vollstaendigVorher: vollstaendigVorher, fehlte: fehltJetzt,
               ergebnis: ganz, erwartet: Array.from({ length: anzahl },
                 function (x, j) { return "T" + j; }).join("") };
    },
    /* Nur zum Nachpruefen: eine Wortmeldung einreihen, die Reihe
       leeren und sie kuenstlich altern lassen — damit sich messen
       laesst, dass eine falsch gehende fremde Uhr niemanden mehr
       stummschaltet. */
    pruefLiveRein: function (w) { liveEinreihen(w); return liveWarteschlange.length; },
    pruefWarteschlangeLeeren: function () { liveWarteschlange.length = 0; },
    pruefNaechste: function () { return liveNaechste(); },
    /* Der gemessene Uhrenunterschied — fuer den Befund und fuer die
       Pruefung. */
    uhrenStand: uhrenStand,
    pruefUhrSetzen: function (id, ms) { uhrVersatz[id] = ms; return uhrVersatz[id]; },
    pruefZeitAufMeineUhr: function (n) { return zeitAufMeineUhr(n); },
    pruefAnhaengen: function (n) { nachrichtAnhaengen(n); return zustand.nachrichten.length; },
    pruefReiheAltern: function (ms) {
      liveWarteschlange.forEach(function (w) { w.hier = (w.hier || Date.now()) - (Number(ms) || 0); });
      return liveWarteschlange.length;
    },
    pruefEinreihen: function (liste) {
      var merk = liveWarteschlange.slice();
      liveWarteschlange.length = 0;
      (liste || []).forEach(function (x) { liveEinreihen(x); });
      var raus = liveWarteschlange.map(function (w) { return w.wort; });
      liveWarteschlange.length = 0;
      merk.forEach(function (w) { liveWarteschlange.push(w); });
      return raus;
    },
    sprachHoechstdauer: function () { return SPRACH_LANG; },
    freiHoechstdauer: function () { return SPRACH_SEKUNDEN; },
    /* Der Pseudo-Livestream */
    /* Melden und Stummschalten */
    handHeben: handHeben,
    handRunter: handRunter,
    meldungen: meldungen,
    binStumm: binStumm,
    liveNaechste: liveNaechste,
    liveOffen: liveOffen,
    liveMelden: liveMelden,
    sprachZurueckrufen: sprachZurueckrufen,
    liveLaeuft: liveLaeuft,
    liveFreigeben: liveFreigeben,
    /* Nur zum Nachpruefen: die Frist der laufenden Wortmeldung um so
       viele Millisekunden zurueckstellen — damit sich ein Haengen
       messen laesst, ohne es abzuwarten. Und den Fokus-Modus setzen,
       denn nur dort sperrt ueberhaupt etwas. */
    pruefLeitungAltern: function (ms) {
      if (liveLaeuftGerade) liveLaeuftGerade.bis -= (Number(ms) || 0);
      return liveLaeuftGerade ? liveLaeuftGerade.bis : 0;
    },
    pruefFokus: function (an) { zustand.fokus = Boolean(an); return zustand.fokus; },
    /* Nur zum Nachpruefen: was gerade auf die Leitung wartet, und das
       Nachschicken von Hand anstossen. */
    pruefWartend: function () { return wartendePakete.map(function (p) { return p.text || p.art; }); },
    pruefNachschicken: function () { return paketeNachschicken(); },
    liveHaengtFest: liveHaengtFest,
    liveRest: liveRest,
    darfSprechen: darfSprechen,
    /* Den Ton aus dem Lager nachholen. Die Oberflaeche ruft das, wenn
       sie eine Wortmeldung zeichnet, deren Aufnahme noch im Lager
       liegt — sonst stuende sie dort bis zur naechsten Nachricht als
       „wird geladen". */
    tonNachreichen: function () {
      return bilderNachreichen(zustand.nachrichten).then(function (etwas) {
        if (etwas) melden();
        return Boolean(etwas);
      }, function () { return false; });
    },
    /* Damit die Oberflaeche „sie" oder „er" schreiben kann. */
    geschlechtVon: geschlechtVon,
    fuerwort: function (id) { return fuerwort(geschlechtVon(id)); },
    fokusAn: fokusAn,
    fokusSetzen: fokusSetzen,
    darfFokusSchalten: darfFokusSchalten,
    liveMitschrieb: liveMitschrieb,
    einsatzPing: einsatzPing,
    freisprechenAn: freisprechenAn,
    freisprechenStarten: freisprechenStarten,
    freisprechenBeenden: freisprechenBeenden,
    freisprechenMelden: freisprechenMelden,
    tonAusVorrat: tonAusVorrat,
    /* Nur zum Nachmessen: laeuft wirklich immer einer mit? */
    freiInnen: function () {
      return { an: frei.an, rekorder: Boolean(sprachRekorder),
               lage: sprachRekorder ? sprachRekorder.state : "",
               segAlter: frei.segAb ? Date.now() - frei.segAb : -1,
               nimmtAuf: frei.nimmtAuf,
               neustart: FREI_NEUSTART, luft: FREI_LUFT };
    },
    freiAusloesen: function (abWann) { freiAufnahmeAn(abWann || Date.now()); },
    /* Nur zum Nachmessen: was sagt die Stimmerkennung gerade? */
    stimmeUrteil: function () {
      var p = freiPegel();
      var u = stimmeErkannt(p);
      return { pegel: p, grund: frei.grundpegel, ja: u.ja, warum: u.warum,
               band: u.band, breite: u.breite, schwung: u.schwung,
               bandMin: STIMME_BAND_MIN, breiteMin: STIMME_BREITE, schwungMin: STIMME_SCHWUNG };
    },
    freiStille: function () { return FREI_STILLE; },
    pruefVerlaufLeeren: function () { frei.verlauf = []; },
    /* Nur zum Nachmessen: eine andere Tonquelle an die laufende
       Messung haengen, damit man mit bekannten Signalen pruefen kann,
       ob die Stimmerkennung wirklich unterscheidet. */
    pruefQuelle: function (strom) {
      if (!frei.kontext || !frei.messer) return false;
      try {
        /* Die echte Mikrofonquelle ABKLEMMEN — sonst mischt sie sich
           dazu und die Messung sagt nichts aus. Genau daran ist der
           erste Messversuch gescheitert. */
        if (frei.quelle) { try { frei.quelle.disconnect(); } catch (e) {} }
        if (frei.pruefKnoten) { try { frei.pruefKnoten.disconnect(); } catch (e) {} }
        frei.pruefKnoten = frei.kontext.createMediaStreamSource(strom);
        frei.pruefKnoten.connect(frei.messer);
        frei.verlauf = [];
        return true;
      } catch (e) { return false; }
    },
    freiBeenden: function () { return freiAufnahmeAus(); },
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
    /* Punkte aus dem Klassenzimmer gehen durch dieselbe Tuer wie
       jede Spielrunde — app.js meldet sich hier an. */
    platzNehmen: platzNehmen,
    befehlAusZeichen: befehlAusZeichen,
    sprechbilder: function () { return Object.assign({}, SPRECHBILDER); },
    sprechbild: function () { return zustand.sprechbild || gemerktesSprechbild(); },
    sprechbildSetzen: function (x) {
      if (!SPRECHBILDER[x]) return false;
      zustand.sprechbild = x;
      sprechbildMerken(x);
      senden({ art: "stumm", tonAn: zustand.tonAn, bildAn: zustand.bildAn,
               bild: zustand.ichBild, farbe: zustand.farbe, farbeName: zustand.farbeName,
               sprechbild: x });
      melden();
      return true;
    },
    /* Das Profil ist beim Betreten nicht immer schon geladen —
       dann kann app.js die Angabe hier nachreichen. */
    geschlechtSetzen: function (x) {
      zustand.geschlecht = String(x || "");
      return zustand.geschlecht;
    },
    binLehrer: binLehrer,
    /* Ein Bild aus einer beliebigen Quelle — Adresse, Datenadresse
       oder Aufkleber-Marke. Die Oberflaeche braucht genau einen
       Ausgang fuer alle vier Wege des Bild-Waehlers. */
    bildSendenRoh: function (quelle, text) { return bildSenden(quelle, text); },
    bildFluestern: bildFluestern,
    fotoFluestern: fotoFluestern,
    fluesternSenden: fluesternSenden,
    binBetreiber: binBetreiber,
    /* Wer gerade irgendwo auf der Seite offen hat — mit Raum, wenn
       er in einem sitzt. Fuer die Namensvorschlaege. */
    praesenzListe: function () {
      return Object.keys(praesenzDa).map(function (id) {
        var e = praesenzDa[id] || {};
        return { id: id, name: e.name || "", raum: e.raum || "" };
      }).filter(function (e) { return e.name; });
    },
    rangWort: rangWort,
    noteGeben: noteGeben,
    platzTauschenMit: platzTauschenMit,
    beiPunkten: function (f) { zustand.punkteRuf = f; },
    /* Die Oberflaeche will es gross zeigen, wenn eine Note ankommt. */
    beiNote: function (f) { zustand.notenRuf = f; },
    /* Damit /probe die Animation direkt auslösen kann — die Bilder
       liegen in app.js, die Befehle hier. */
    beiEffekt: function (f) { zustand.effektRuf = f; },
    /* Der Film kommt bei allen an — die Seite holt sich die Datei
       selbst und spielt sie ab. */
    beiFilm: function (f) { zustand.filmRuf = f; },
    beiEreignis: function (f) { zustand.ereignisRuf = f; },
    /* Nur fuer die Pruefung: die offene Aufgabe von aussen sehen. */
    pruefAufgabe: function () {
      return offeneAufgabe ? { typ: offeneAufgabe.typ, loesung: offeneAufgabe.loesung,
                               richtige: Object.keys(offeneAufgabe.wer).length } : null;
    },
    /* Nur zum Nachpruefen: raeumt eine Liste so auf, wie es das
       Laden des Verlaufs tut. */
    pruefMuellFiltern: function (liste) { return altenMuellFiltern(liste); },
    /* Nur zum Nachpruefen: das Nachreichen des Fluesterns von aussen
       anstossen und ansehen, was dabei herauskommt. */
    /* WELCHE BEFEHLSWOERTER ES GIBT — und ob jedes davon auch
       WIRKLICH hinausgeht. Genau hier hat Runde 18 einen Fehler
       versteckt: die sieben neuen Effekte standen in AM_PLATZ, aber
       nicht in BEFEHLE, und befehlBekannt() liest nur BEFEHLE. Die
       Kachel schickte also eine Zeile, die als Vertipper abgewiesen
       wurde. Damit das nie wieder unbemerkt bleibt, kann die Sonde
       beides von aussen vergleichen. */
    /* Der Panik-Knopf von aussen — die Oberflaeche haengt ihn an
       einen Knopf im Klassenzimmer, /ton ruft dasselbe auf. */
    /* =========================================================
       LESEN IM CHAT
       ---------------------------------------------------------
       GEWUENSCHT: „dass man eine Auswahl hat im Chat, wo man
       auswaehlt, welchen Text in welchem Niveau man lesen moechte
       … und dass ich die Zeile highlighten kann, die sie lesen
       sollen in dem Moment, und sie das auf ihrer Seite auch
       sehen."

       Der Text kommt als eine einzige Chatzeile mit einer Liste
       von Saetzen darin. Welche Zeile gerade gelesen wird, ist
       KEINE Chatzeile — das waere nach zehn Saetzen ein voller
       Verlauf — sondern ein eigener kleiner Rundruf. Er wird
       ausserdem gemerkt, damit ein Spaeterkommender die Stelle
       sofort sieht. */
    leseTextSenden: function (t) {
      if (!t || !Array.isArray(t.zeilen) || !t.zeilen.length) return false;
      var zeilen = t.zeilen.slice(0, 40).map(function (x) { return String(x).slice(0, 300); });
      var zeile = anAlle("lesen", "\ud83d\udcd6 " + String(t.titel || "Lesetext"),
        { leseTitel: String(t.titel || "Lesetext").slice(0, 120),
          leseNiveau: String(t.niveau || "").slice(0, 4),
          leseZeilen: zeilen });
      if (zeile && zeile.id) leseStelle[zeile.id] = -1;
      return true;
    },
    leseZeileSetzen: function (leseId, nr) {
      var id = String(leseId || "");
      var n = Number(nr);
      if (!id || !(n >= 0)) return false;
      leseStelle[id] = n;
      senden({ art: "lesezeile", leseId: id, nr: n });
      try { if (window.DMA_LESEZEILE) window.DMA_LESEZEILE(id, n); } catch (e) {}
      return true;
    },
    leseZeile: function (leseId) {
      var v = leseStelle[String(leseId || "")];
      return typeof v === "number" ? v : -1;
    },
    tonNeuAufbauen: function () { tonWacheStarten(); return tonNeuAufbauen(); },
    /* Die Lieder — app.js braucht sie fuer die Kachel und fuer den
       Waehler, gelesen werden sie hier. */
    /* Wer ist gerade dran? Die Oberflaeche schreibt es an die Tafel. */
    werIstDran: function () { return (offeneAufgabe && offeneAufgabe.dran) || ""; },
    lieder: function () { return LIEDER.map(function (l) {
      return { datei: l.datei, titel: l.titel }; }); },
    tonWacheStand: function () { return { geheilt: tonWacheZaehler.geheilt,
                                          letzte: tonWacheZaehler.letzte,
                                          laeuft: Boolean(tonWacheTakt) }; },
    pruefEffektWoerter: function () {
      var w = [];
      Object.keys(AM_PLATZ).forEach(function (k) { w.push(k); });
      Object.keys(AUCH_AM_PLATZ).forEach(function (k) { if (w.indexOf(k) < 0) w.push(k); });
      return w;
    },
    pruefBefehlBekannt: function (wort) { return befehlBekannt(wort); },
    pruefFluesternLaden: function () { return fluesternLaden(); },
    pruefVerlaufFrisch: function (erster) { return verlaufFrischHolen(Boolean(erster)); },
    /* Nur zum Nachmessen: so tun, als sei man drin. Ohne das laeuft
       das Nachfassen gar nicht erst an — es soll ja nur im Raum
       arbeiten. */
    pruefLageSetzen: function (wie) { zustand.lage = String(wie || "drin"); return zustand.lage; },
    /* Nur zum Nachmessen: Betreiber sein. LiveChat.binLehrer von
       aussen zu ueberschreiben reicht NICHT — innerhalb des Moduls
       wird die eigene Funktion aufgerufen, nicht die exportierte.
       Genau daran ist eine Messung schon einmal vorbeigelaufen. */
    pruefBetreiber: function (ja) { zustand.betreiber = ja !== false; return zustand.betreiber; },
    /* Damit sich nachmessen laesst, was passiert, wenn die Leitung
       „aufgebraucht" meldet — ohne dass man erst ein Kontingent
       leerfahren muss. Setzt nur den Grund und meldet ihn. */
    pruefRelaisGrund: function (g) {
      relaisStand.grund = String(g || "");
      relaisStand.quelle = "stun";
      relaisMelden();
      return relaisStand.grund;
    },
    pruefHaeuptling: function (ja) { zustand.haeuptling = ja !== false; return zustand.haeuptling; },
    /* Nur zum Nachmessen: jemanden in den Raum setzen, damit /w und
       das Bild-Fluestern ein Ziel finden. */
    pruefPersonSetzen: function (id, name, konto) {
      personMerken(id, name, "");
      if (konto && zustand.leute[id]) zustand.leute[id].konto = konto;
      return Object.keys(zustand.leute);
    },
    pruefVerlaufStand: function () {
      return { vomServer: verlaufVomServer, versuche: verlaufVersuche,
               uhren: verlaufUhren.length, geklagt: verlaufGeklagt };
    },
    pruefFluesternSichern: function (ziel, txt, kennung) { return fluesternSichern(ziel, txt, kennung); },
    /* Nur zum Nachpruefen: den Verlauf eines Raums ablegen und wieder
       hervorholen — genau die Wege, die das Verlassen und das
       Wiederkommen gehen. */
    pruefRaum: function (name) { if (name) zustand.raum = String(name); return zustand.raum; },
    pruefVerlaufSetzen: function (liste) { zustand.nachrichten = (liste || []).slice(); chatSichern(); },
    /* Das Fenster, in dem ein fremder Verlauf angenommen wird, von
       Hand auf und zu — damit sich beide Faelle nachstellen lassen,
       ohne eine halbe Minute zu warten: der Ankoemmling und der, der
       schon eine Weile dasitzt. Fasst sonst nichts an. */
    pruefVerlaufFensterAuf: function () {
      verlaufBekommen = false;
      verlaufAngefragt = true;
      if (verlaufFensterUhr) clearTimeout(verlaufFensterUhr);
    },
    pruefVerlaufFensterZu: function () {
      verlaufAngefragt = false;
      if (verlaufFensterUhr) clearTimeout(verlaufFensterUhr);
    },
    pruefVerlaufAusSpeicher: function (raum) { return chatLaden(raum); },
    pruefVerlaufAusLager: function (raum) { return chatAusLager(raum); },
    /* Stellt den Augenblick direkt nach dem Betreten nach: das Lager
       dieses Raums ist noch nicht gelesen. Genau dort wurde der
       Verlauf frueher kurzgeschrieben. */
    pruefLagerVergessen: function () { lagerGelesen = false; },
    /* Den Verlauf vom Server holen und zwei Listen zusammenfuehren —
       damit sich nachmessen laesst, dass dieselbe Zeile nicht zweimal
       dasteht. */
    pruefServerLaden: function (raum) { return serverLaden(raum); },
    pruefVerschmelzen: function (a, b) { return verschmelzen(a, b); },
    pruefAufgabeStellen: aufgabeStellen,
    pruefAufgabeFrei: aufgabeFreiStellen,
    pruefAufgabeVersuch: aufgabeVersuch,
    /* Gehoert diese Zeile zur offenen Aufgabe? Die Oberflaeche fragt
       das beim Zeichnen — damit der Notenknopf auch nach einem
       Neuladen an der richtigen Zeile steht. */
    aufgabeBezug: aufgabeBezug,
    offeneAufgabeInfo: offeneAufgabeInfo,
    /* Die Klassen, fuer die man eine Note geben kann — die Regel
       steht in livechat.js, nicht in der Oberflaeche. */
    notenKlassen: function () { return NOTEN_KLASSEN.slice(); },
    aufgabeKlasse: aufgabeKlasse,
    /* Fuer die Pruefung, ob eine Aufgabe das Neuladen ueberlebt:
       merken, vergessen, zurueckholen — genau die Wege, die auch das
       Betreten geht. */
    pruefAufgabeMerken: function () { aufgabeMerken(); },
    pruefAufgabeVergessenImSpeicher: function () { offeneAufgabe = null; },
    pruefAufgabeZurueckholen: function (raum) { aufgabeZurueckholen(raum || zustand.raum); },
    pruefAufgabeAntwort: aufgabeAntwort,
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
