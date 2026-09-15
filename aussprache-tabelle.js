/* =========================================================
   AUSSPRACHE-TABELLE — Ersatzschreibung für die Sprachausgabe
   ---------------------------------------------------------
   WOZU
   Eine Sprachmaschine liest Buchstaben. Bei deutschen Wörtern
   trifft sie fast immer richtig. Bei Fremdwörtern und bei ein
   paar deutschen Sonderfällen nicht:
       „Bonbon"     wird gern „Bon-bon" statt „Bong-bong"
       „Restaurant" bekommt oft ein gesprochenes „t" am Ende
       „Chance"     rutscht ins Englische
       „König"      endet auf „ig" statt auf „ich"

   ZWEI WEGE, EINE TABELLE
   1. HAUPTWEG — die Ersatzschreibung wird direkt in den Text
      geschrieben, den wir an die Sprachmaschine schicken.
      „das Bonbon" geht also als „das Bongbong" hinaus.
      Das braucht kein Wörterbuch beim Anbieter, wirkt sofort,
      und funktioniert bei JEDEM Anbieter gleich.
   2. ZUSÄTZLICH — dieselbe Tabelle kann bei ElevenLabs als
      „Pronunciation Dictionary" angelegt werden, in einem Rutsch
      (werkzeug/aussprache-woerterbuch.js). Von Hand muss dort
      niemand etwas abtippen.

   WAS ANGEZEIGT WIRD, ÄNDERT SICH NIE
   Die Ersatzschreibung geht NUR an die Sprachmaschine. Auf dem
   Bildschirm steht weiter „das Bonbon". Sonst würden Lernende
   falsche Schreibweisen lernen — das wäre schlimmer als eine
   schiefe Betonung.

   WIE MAN DIE TABELLE ERWEITERT
   Ein Wort dazu: eine Zeile in WORTREGELN, fertig.
       { ein: "Champignon", aus: "Schampinjong", gruppe: "nasal",
         grund: "französisches Lehnwort, Nasal am Ende" }
   Eine ganze Regelmässigkeit: eine Zeile in MUSTER. Jedes Muster
   kann einzeln abgeschaltet werden (gruppenSchalter), damit man
   nachmessen kann, ob es etwas verbessert oder verschlimmert.
   Nach jeder Änderung: node werkzeug/tabelle-pruefen.js

   Läuft in Node und im Browser. Keine Netzwerkzugriffe.
   ========================================================= */
(function (wurzel) {
  "use strict";

  /* ---------------------------------------------------------
     GRUPPEN — jede einzeln schaltbar.

     ALLE STEHEN AUF „AUS". Das ist kein Versehen, sondern das
     Ergebnis einer Messung — hoerprobe/MESSUNG.md hat sie im
     Einzelnen:

     Zehn Einträge wurden zweimal gesprochen, einmal roh und einmal
     mit Ersatzschreibung, und BEIDE Aufnahmen danach von einer
     Spracherkennung zurück in Text geschrieben. Die Erkennung sieht
     den Eingabetext nicht — was sie schreibt, sagt also, wie die
     Aufnahme klingt.

       roh:    „das Bonbon"    → zurückgehört: „das Bonbon"    ✓
       Ersatz: „das Bongbong"  → zurückgehört: „das Bongbong"  ✗

     Bei allen zehn Wörtern war die ROHE Schreibung schon richtig.
     Die Ersatzschreibung hat sieben davon verschlechtert und keines
     verbessert. Das Modell (eleven_multilingual_v2) liest deutsche
     Rechtschreibung richtig; es braucht keine Hilfe. Nebenbei kostet
     die Ersatzschreibung über den ganzen Bestand 7 025 Zeichen
     extra — bei 2 Mio. Obergrenze kein Kleingeld.

     WANN MAN EINE GRUPPE EINSCHALTET
     Wenn die eigene geklonte Stimme ein Wort hörbar falsch liest.
     Dann NICHT die ganze Gruppe anschalten, sondern nur dieses Wort:
         AusspracheTabelle.wortAnschalten("Bonbon");
     Und danach noch einmal nachmessen. Nie nach Gefühl schalten —
     die Messung hat gezeigt, dass das Gefühl hier falsch lag.
     --------------------------------------------------------- */
  var GRUPPEN = {
    nasal:        { an: false, titel: "Nasale in Fremdwörtern (Bonbon, Balkon, Restaurant)" },
    anlautZ:      { an: false, titel: "Z am Wortanfang ist immer „ts“" },
    chHart:       { an: false, titel: "Ch- wie „k“ (Chor, Charakter, Christ)" },
    chSch:        { an: false, titel: "Ch- wie „sch“ (Chance, Chef, Chirurg)" },
    endungIg:     { an: false, titel: "-ig am Wortende ist „-ich“" },
    vLaut:        { an: false, titel: "V in deutschen Wörtern ist „f“, in Fremdwörtern „w“" },
    sStimmhaft:   { an: false, titel: "S zwischen Vokalen ist stimmhaft (Vase, Rose)" },
    lehnwort:     { an: false, titel: "Sonstige Lehnwörter (Garage, Journal, Genie)" },
    betonung:     { an: false, titel: "Betonung bei zusammengesetzten Wörtern nach vorn" }
  };

  /* Einzelne Wörter, die trotz ausgeschalteter Gruppe umgeschrieben
     werden — die Liste für hörbar schiefe Fälle der eigenen Stimme.
     Sie ist absichtlich leer: hier gehört nur hinein, was GEMESSEN
     falsch klang, nicht was falsch klingen könnte. */
  var EINZELN_AN = Object.create(null);
  function wortAnschalten(wort) { EINZELN_AN[String(wort).toLowerCase()] = 1; }
  function wortAbschalten(wort) { delete EINZELN_AN[String(wort).toLowerCase()]; }
  function einzelnAngeschaltet() { return Object.keys(EINZELN_AN); }

  /* ---------------------------------------------------------
     WORTREGELN — ganze Wörter, das ist der sichere Teil.
     Ein Eintrag gilt für das Wort mit allen Endungen, die in
     ENDUNGEN stehen (Bonbon → Bonbons, Chance → Chancen).

     „aus" ist eine deutsche Ersatzschreibung, keine Lautschrift:
     sie muss von einer deutschen Stimme gelesen werden können.
     Darum „Bongbong" und nicht „bɔŋˈbɔŋ".
     --------------------------------------------------------- */
  var WORTREGELN = [
    /* --- Nasale: französische Lehnwörter auf -on / -ant / -ance --- */
    { ein: "Bonbon",      aus: "Bongbong",     gruppe: "nasal", grund: "Nasal in beiden Silben" },
    { ein: "Balkon",      aus: "Balkong",      gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Salon",       aus: "Salong",       gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Beton",       aus: "Betong",       gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Karton",      aus: "Kartong",      gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Waggon",      aus: "Wagong",       gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Pardon",      aus: "Pardong",      gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Restaurant",  aus: "Restorong",    gruppe: "nasal", grund: "Nasal am Ende, das „t“ bleibt stumm" },
    { ein: "Croissant",   aus: "Kroassong",    gruppe: "nasal", grund: "Nasal am Ende, das „t“ bleibt stumm" },
    { ein: "Restaurants", aus: "Restorongs",   gruppe: "nasal", grund: "Mehrzahl" },
    { ein: "Chance",      aus: "Schangse",     gruppe: "nasal", grund: "Sch- am Anfang, Nasal in der Mitte" },
    { ein: "Chancen",     aus: "Schangsen",    gruppe: "nasal", grund: "Mehrzahl" },
    { ein: "Nuance",      aus: "Nüangse",      gruppe: "nasal", grund: "Nasal in der Mitte" },
    { ein: "Champignon",  aus: "Schampinjong", gruppe: "nasal", grund: "Sch- am Anfang, Nasal am Ende" },
    { ein: "Parfum",      aus: "Parföng",      gruppe: "nasal", grund: "Nasal am Ende" },
    { ein: "Teint",       aus: "Täng",         gruppe: "nasal", grund: "Nasal am Ende" },

    /* --- Ch- wie „k“ --- */
    { ein: "Chor",        aus: "Kor",          gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Chöre",       aus: "Köre",         gruppe: "chHart", grund: "Mehrzahl" },
    { ein: "Chaos",       aus: "Kaos",         gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "chaotisch",   aus: "kaotisch",     gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Charakter",   aus: "Karakter",     gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Christ",      aus: "Krist",        gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Christus",    aus: "Kristus",      gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Weihnachtschor", aus: "Weihnachtskor", gruppe: "chHart", grund: "zusammengesetzt mit Chor" },
    { ein: "Chronik",     aus: "Kronik",       gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "chronisch",   aus: "kronisch",     gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Cholesterin", aus: "Kolesterin",   gruppe: "chHart", grund: "griechisches Ch ist „k“" },
    { ein: "Orchester",   aus: "Orkester",     gruppe: "chHart", grund: "Ch in der Mitte ist „k“" },

    /* --- Ch- wie „sch“ --- */
    { ein: "Chef",        aus: "Schef",        gruppe: "chSch", grund: "französisches Ch ist „sch“" },
    { ein: "Chefin",      aus: "Schefin",      gruppe: "chSch", grund: "französisches Ch ist „sch“" },
    { ein: "Chauffeur",   aus: "Schoför",      gruppe: "chSch", grund: "französisches Lehnwort" },
    { ein: "Chirurg",     aus: "Schirurg",     gruppe: "chSch", grund: "Ch vor i ist hier „sch“" },
    { ein: "Chirurgie",   aus: "Schirurgie",   gruppe: "chSch", grund: "Ch vor i ist hier „sch“" },
    { ein: "Broschüre",   aus: "Broschüre",    gruppe: "chSch", grund: "schon richtig geschrieben, nur zur Sicherheit gelistet" },

    /* --- Sonstige Lehnwörter: -age, -eur, -ie --- */
    { ein: "Garage",      aus: "Garasche",     gruppe: "lehnwort", grund: "-age ist „-asche“" },
    { ein: "Garagen",     aus: "Garaschen",    gruppe: "lehnwort", grund: "Mehrzahl" },
    { ein: "Etage",       aus: "Etasche",      gruppe: "lehnwort", grund: "-age ist „-asche“" },
    { ein: "Etagen",      aus: "Etaschen",     gruppe: "lehnwort", grund: "Mehrzahl" },
    { ein: "Blamage",     aus: "Blamasche",    gruppe: "lehnwort", grund: "-age ist „-asche“" },
    { ein: "Massage",     aus: "Massasche",    gruppe: "lehnwort", grund: "-age ist „-asche“" },
    { ein: "Orange",      aus: "Oransche",     gruppe: "lehnwort", grund: "-ge ist „-sche“" },
    { ein: "Orangen",     aus: "Oranschen",    gruppe: "lehnwort", grund: "Mehrzahl" },
    { ein: "Journal",     aus: "Schurnal",     gruppe: "lehnwort", grund: "J ist hier „sch“" },
    { ein: "Journalist",  aus: "Schurnalist",  gruppe: "lehnwort", grund: "J ist hier „sch“" },
    { ein: "Journalistin", aus: "Schurnalistin", gruppe: "lehnwort", grund: "J ist hier „sch“" },
    { ein: "Jalousie",    aus: "Schalusie",    gruppe: "lehnwort", grund: "J ist hier „sch“" },
    { ein: "Genie",       aus: "Scheni",       gruppe: "lehnwort", grund: "G ist hier „sch“" },
    { ein: "genial",      aus: "schenial",     gruppe: "lehnwort", grund: "G ist hier „sch“" },
    { ein: "Ingenieur",   aus: "Inschenjör",   gruppe: "lehnwort", grund: "G ist „sch“, -eur ist „-ör“" },
    { ein: "Ingenieurin", aus: "Inschenjörin", gruppe: "lehnwort", grund: "G ist „sch“, -eur ist „-ör“" },
    { ein: "Friseur",     aus: "Frisör",       gruppe: "lehnwort", grund: "-eur ist „-ör“ (so auch zulässig geschrieben)" },
    { ein: "Friseurin",   aus: "Frisörin",     gruppe: "lehnwort", grund: "-eur ist „-ör“" },
    { ein: "Regisseur",   aus: "Reschissör",   gruppe: "lehnwort", grund: "G ist „sch“, -eur ist „-ör“" },
    { ein: "Portemonnaie", aus: "Portmonee",   gruppe: "lehnwort", grund: "französische Schreibung" },
    { ein: "Niveau",      aus: "Niwoh",        gruppe: "lehnwort", grund: "-eau ist „-o“, V ist „w“" },
    { ein: "Büro",        aus: "Büroh",        gruppe: "lehnwort", grund: "langes o am Ende" },

    /* --- V in Fremdwörtern: gesprochen „w“ --- */
    { ein: "Vase",        aus: "Wase",         gruppe: "vLaut", grund: "V ist hier „w“, S ist stimmhaft" },
    { ein: "Vasen",       aus: "Wasen",        gruppe: "vLaut", grund: "Mehrzahl" },
    { ein: "Villa",       aus: "Willa",        gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Vitamin",     aus: "Witamin",      gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Violine",     aus: "Wioline",      gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Vulkan",      aus: "Wulkan",       gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Klavier",     aus: "Klawier",      gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "November",    aus: "Nowember",     gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Provinz",     aus: "Prowints",     gruppe: "vLaut", grund: "V ist „w“, Z ist „ts“" },
    { ein: "Universität", aus: "Uniwersität",  gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Vegetarier",  aus: "Wegetarier",   gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Video",       aus: "Wideo",        gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Visum",       aus: "Wisum",        gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Vokabel",     aus: "Wokabel",      gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Vokal",       aus: "Wokal",        gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Variante",    aus: "Wariante",     gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Veranda",     aus: "Weranda",      gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Vers",        aus: "Wers",         gruppe: "vLaut", grund: "V ist hier „w“" },
    { ein: "Interview",   aus: "Interwjuh",    gruppe: "vLaut", grund: "englisches Lehnwort" },

    /* --- S stimmhaft zwischen Vokalen: die Stimme trifft das
           meist von selbst. Gelistet sind nur Wörter, bei denen
           ein stimmloses S den Sinn verschiebt oder auffällt. --- */
    { ein: "Rose",        aus: "Rohse",        gruppe: "sStimmhaft", grund: "langes o, stimmhaftes S" },
    { ein: "Rosen",       aus: "Rohsen",       gruppe: "sStimmhaft", grund: "Mehrzahl" },
    { ein: "Dose",        aus: "Dohse",        gruppe: "sStimmhaft", grund: "langes o, stimmhaftes S" },
    { ein: "Hose",        aus: "Hohse",        gruppe: "sStimmhaft", grund: "langes o, stimmhaftes S" },
    { ein: "Nase",        aus: "Nahse",        gruppe: "sStimmhaft", grund: "langes a, stimmhaftes S" },
    { ein: "Wiese",       aus: "Wiese",        gruppe: "sStimmhaft", grund: "schon richtig, nur gelistet" },

    /* --- Wörter, bei denen die Betonung gern verrutscht --- */
    { ein: "Kaffee",      aus: "Kaffee",       gruppe: "betonung", grund: "Betonung vorn (KA-ffee), im Süden hinten" },
    { ein: "Tunnel",      aus: "Tunnel",       gruppe: "betonung", grund: "Betonung vorn" },
    { ein: "August",      aus: "Au-gust",      gruppe: "betonung", grund: "Monat: Betonung hinten; Vorname: vorn" }
  ];

  /* ---------------------------------------------------------
     MUSTER — Regelmässigkeiten, die für viele Wörter gelten.
     Sie greifen NACH den Wortregeln und nur dort, wo die
     Wortregeln nichts gefunden haben.

     Absichtlich eng geschnitten. Ein zu weites Muster richtet
     mehr Schaden an als es nützt: „-ig → -ich“ darf nicht in
     „Igel“ oder „wigwam“ greifen, und „Z → Ts“ nicht in „Quiz“.
     --------------------------------------------------------- */
  var MUSTER = [
    {
      name: "endungIg",
      gruppe: "endungIg",
      /* -ig NUR am Wortende oder vor einer Endung, die den Laut
         nicht verändert (-ig, -igs, -ige? NEIN: „ige“ macht das
         g wieder zum g — „günstige“ ist „günstige“, nicht
         „günstiche“). Darum nur Wortende und -igs. */
      suchen: /([a-zäöüß]{2,})ig(s?)\b/g,
      ersetzen: function (ganz, stamm, s) { return stamm + "ich" + s; },
      grund: "-ig am Wortende wird „-ich“ gesprochen (König → Könich)",
      /* Wörter, in denen -ig KEIN Suffix ist, sondern zum Stamm gehört:
         dort bleibt das g ein g. Als TEIL-Ausnahme, damit auch
         „Kriegsende“ und „Ziegenkäse“ geschützt sind. */
      teilAusnahmen: ["zieg", "flieg", "lieg", "krieg", "sieg", "stieg",
                      "feig", "geig", "steig", "zeig", "neig", "beug",
                      "igel", "iglu", "tiger", "rieg", "wieg", "bieg"]
    },
    {
      name: "anlautZ",
      gruppe: "anlautZ",
      /* Z am Wortanfang — auch am Anfang eines Wortteils in
         zusammengesetzten Wörtern greift das nicht zuverlässig,
         darum bleibt es beim echten Wortanfang. */
      suchen: /\b([Zz])(?=[aeiouäöüyr])/g,
      ersetzen: function (ganz, z) { return z === "Z" ? "Ts" : "ts"; },
      grund: "Z ist im Deutschen immer „ts“, nie „s“ (Zitrone → Tsitrone)",
      /* Die häufigsten Z-Wörter sind ausgenommen, und zwar aus einem
         nüchternen Grund: sie kommen in den Beispielsätzen tausendfach
         vor, jede Ersetzung kostet ein Zeichen extra — und eine deutsche
         Stimme spricht „zu“, „zwei“, „zwischen“ ohnehin richtig.
         Die Regel soll dort wirken, wo sie etwas ausrichtet: bei
         Wörtern, die auch ein Mensch falsch lesen könnte. */
      ausnahmen: ["zu", "zum", "zur", "zwei", "zweite", "zweiten", "zwar", "zwischen",
                  "zehn", "zeit", "zeigen", "zeigt", "zeige", "ziehen", "zieht",
                  "ziemlich", "zusammen", "zurück", "zuerst", "zuletzt", "zufrieden",
                  "zwölf", "zwanzig", "zimmer", "zug", "züge", "zahl", "zahlen"]
    },
    {
      name: "zInnen",
      gruppe: "anlautZ",
      /* Z im Wortinneren nach einem Konsonanten (Zahnarzt, Herz,
         Pflanze) — die Stimme trifft es meist, aber bei -rz- und
         -lz- am Wortende rutscht es gern ins „s“. */
      suchen: /([rlnm])z\b/g,
      ersetzen: function (ganz, k) { return k + "ts"; },
      grund: "-rz/-lz am Wortende ist „-rts/-lts“ (Herz → Herts)",
      ausnahmen: []
    },
    {
      name: "chVorEI",
      gruppe: "chHart",
      /* Ch am Wortanfang vor a, o, u, l, r ist „k“:
         Charakter, Chlor, Christ, Chrom. Vor e und i ist es
         im Standarddeutschen der weiche ich-Laut (Chemie) —
         DEN kann man nicht ersetzen, „ch“ IST seine Schreibung.
         Darum greift dieses Muster nur vor a/o/u/l/r. */
      suchen: /\b([Cc])h(?=[aoulr])/g,
      ersetzen: function (ganz, c) { return c === "C" ? "K" : "k"; },
      grund: "Ch- vor a/o/u/l/r ist „k“ (Chlor → Klor)",
      teilAusnahmen: ["chance", "charme", "chauffeur", "chalet", "chauss"]
    }
  ];

  /* ---------------------------------------------------------
     Endungen, die eine Wortregel mitnimmt.
     „Chance" deckt so auch „Chancen"; „Garage" auch „Garagen".
     Länger zuerst, damit -nen nicht als -n gelesen wird.
     --------------------------------------------------------- */
  var ENDUNGEN = ["nen", "en", "es", "er", "em", "ns", "n", "s", "e", ""];

  /* Grossschreibung des Originals auf die Ersatzschreibung übertragen. */
  function wieGeschrieben(original, ersatz) {
    if (!original) return ersatz;
    var ersterGross = original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase();
    if (ersterGross) return ersatz.charAt(0).toUpperCase() + ersatz.slice(1);
    return ersatz.charAt(0).toLowerCase() + ersatz.slice(1);
  }

  /* Ein Wort in einer Wortregel suchen — mit Endung.
     Gibt { aus, regel, endung } zurück oder null. */
  var wortIndex = null;
  function indexBauen() {
    if (wortIndex) return wortIndex;
    wortIndex = Object.create(null);
    for (var i = 0; i < WORTREGELN.length; i++) {
      var r = WORTREGELN[i];
      wortIndex[r.ein.toLowerCase()] = r;
    }
    return wortIndex;
  }

  function wortRegelFinden(wort) {
    var idx = indexBauen();
    var klein = wort.toLowerCase();
    // 1. genau so
    if (idx[klein]) return { regel: idx[klein], endung: "" };
    // 2. mit abgetrennter Endung
    for (var i = 0; i < ENDUNGEN.length; i++) {
      var e = ENDUNGEN[i];
      if (!e) continue;
      if (klein.length > e.length + 2 && klein.slice(-e.length) === e) {
        var stamm = klein.slice(0, -e.length);
        if (idx[stamm]) return { regel: idx[stamm], endung: wort.slice(wort.length - e.length) };
        // „Chance“ + „n“: der Stamm endet selbst auf e
        if (idx[stamm + "e"]) return { regel: idx[stamm + "e"], endung: wort.slice(wort.length - e.length) };
      }
    }
    return null;
  }

  /* ---------------------------------------------------------
     umschreiben(text, optionen) — der Hauptweg.
     Gibt zurück:
       { text, geaendert, aenderungen: [ {von, zu, gruppe, grund} ] }
     optionen:
       gruppen  — Objekt wie GRUPPEN, um einzelne abzuschalten
     --------------------------------------------------------- */
  function umschreiben(text, optionen) {
    var o = optionen || {};
    var gruppen = o.gruppen || GRUPPEN;
    var an = function (g) { return !gruppen[g] || gruppen[g].an !== false; };
    var aenderungen = [];
    var roh = String(text == null ? "" : text);
    if (!roh) return { text: "", geaendert: false, aenderungen: [] };

    /* Schritt 1 — Wortregeln. Wort für Wort, damit die Regel nur
       auf ganze Wörter greift und nicht mitten in einem anderen. */
    var ergebnis = roh.replace(/[A-Za-zÄÖÜäöüß]+/g, function (wort) {
      var t = wortRegelFinden(wort);
      if (!t) return wort;
      /* Ein einzeln angeschaltetes Wort greift auch dann, wenn seine
         Gruppe aus ist — das ist der ganze Zweck der Einzelliste. */
      if (!an(t.regel.gruppe) && !EINZELN_AN[t.regel.ein.toLowerCase()]) return wort;
      var neu = wieGeschrieben(wort, t.regel.aus) + t.endung;
      if (neu === wort) return wort;   // bewusst gleich gelistet
      aenderungen.push({ von: wort, zu: neu, gruppe: t.regel.gruppe, grund: t.regel.grund });
      return neu;
    });

    /* Schritt 2 — Muster. Nur auf Wörtern, die Schritt 1 nicht
       schon angefasst hat: sonst käme „Wase“ (aus „Vase“) noch
       einmal unter die Räder. */
    var schonGeaendert = Object.create(null);
    aenderungen.forEach(function (a) { schonGeaendert[a.zu] = 1; });

    for (var m = 0; m < MUSTER.length; m++) {
      var mu = MUSTER[m];
      if (!an(mu.gruppe)) continue;
      /* Zwei Arten von Ausnahme, und der Unterschied ist wichtig:
         ausnahmen     — das GANZE Wort ist ausgenommen („zu“, „Igel“).
         teilAusnahmen — ein Wortteil schützt auch Zusammensetzungen
                         („Ziege“ schützt „Ziegenkäse“).
         Früher wurde jede Ausnahme als Wortteil geprüft. Das ging
         schief: „zahl“ hätte „bezahlen“ und „erzählen“ mitgeschützt,
         „zeit“ die halbe Wortliste. Darum jetzt getrennt. */
      var ausnahmen = Object.create(null);
      (mu.ausnahmen || []).forEach(function (w) { ausnahmen[w.toLowerCase()] = 1; });
      var teile = (mu.teilAusnahmen || []).map(function (w) { return w.toLowerCase(); });
      ergebnis = ergebnis.replace(/[A-Za-zÄÖÜäöüß]+/g, (function (mu2, ausn, teil) {
        return function (wort) {
          if (schonGeaendert[wort]) return wort;
          var klein = wort.toLowerCase();
          if (ausn[klein]) return wort;
          for (var k = 0; k < teil.length; k++) {
            if (klein.indexOf(teil[k]) >= 0) return wort;
          }
          mu2.suchen.lastIndex = 0;
          var neu = wort.replace(mu2.suchen, mu2.ersetzen);
          if (neu === wort) return wort;
          aenderungen.push({ von: wort, zu: neu, gruppe: mu2.gruppe, grund: mu2.grund });
          schonGeaendert[neu] = 1;
          return neu;
        };
      })(mu, ausnahmen, teile));
    }

    return { text: ergebnis, geaendert: ergebnis !== roh, aenderungen: aenderungen };
  }

  /* ---------------------------------------------------------
     Zeichenbilanz — WICHTIG fürs Geld.
     Die Ersatzschreibung ändert die Zeichenzahl, und ElevenLabs
     rechnet nach Zeichen. „Chor“→„Kor“ spart eins,
     „Bonbon“→„Bongbong“ kostet zwei. Vor dem Erzeugen muss man
     wissen, wie die Bilanz für den GANZEN Bestand aussieht.
     --------------------------------------------------------- */
  function zeichenBilanz(texte, optionen) {
    var vorher = 0, nachher = 0, betroffen = 0;
    for (var i = 0; i < texte.length; i++) {
      var t = String(texte[i] || "");
      var u = umschreiben(t, optionen);
      vorher += t.length;
      nachher += u.text.length;
      if (u.geaendert) betroffen++;
    }
    return { vorher: vorher, nachher: nachher, delta: nachher - vorher, betroffen: betroffen, stuecke: texte.length };
  }

  /* ---------------------------------------------------------
     Für das ElevenLabs-Aussprachewörterbuch: dieselbe Tabelle
     als Liste von Alias-Regeln. Der Nutzer tippt dort nichts ab.
     --------------------------------------------------------- */
  function alsWoerterbuchRegeln(optionen) {
    var o = optionen || {};
    var gruppen = o.gruppen || GRUPPEN;
    var raus = [];
    for (var i = 0; i < WORTREGELN.length; i++) {
      var r = WORTREGELN[i];
      if (gruppen[r.gruppe] && gruppen[r.gruppe].an === false) continue;
      if (r.ein === r.aus) continue;      // bewusst gleich: nichts anzulegen
      raus.push({ string_to_replace: r.ein, type: "alias", alias: r.aus });
    }
    return raus;
  }

  /* ---------------------------------------------------------
     Betonung aus dem Feld „syl" ablesen.
     Die App schreibt die betonte Silbe GROSS: „PLATZ-deck-chen".
     Das ist genau die Angabe, die eine Sprachmaschine nicht
     selbst hat. Sie lässt sich nicht als Ersatzschreibung
     ausdrücken (eine Stimme liest keine Grossbuchstaben als
     Betonung), darum wird sie hier nur AUSGELESEN — für die
     Anzeige und für die Laut-Bewertung, nicht für den Text.
     --------------------------------------------------------- */
  function betonteSilbe(syl) {
    if (!syl) return -1;
    var teile = String(syl).split("-");
    for (var i = 0; i < teile.length; i++) {
      var t = teile[i].replace(/[^A-Za-zÄÖÜäöüß]/g, "");
      if (!t) continue;
      // Mindestens zwei Grossbuchstaben, oder das ganze Teil gross
      var gross = t.replace(/[^A-ZÄÖÜ]/g, "").length;
      if (gross >= 2 && gross >= t.length - 1) return i;
    }
    return -1;
  }

  var API = {
    GRUPPEN: GRUPPEN,
    WORTREGELN: WORTREGELN,
    MUSTER: MUSTER,
    umschreiben: umschreiben,
    wortAnschalten: wortAnschalten,
    wortAbschalten: wortAbschalten,
    einzelnAngeschaltet: einzelnAngeschaltet,
    /* Zum Nachmessen: alle Gruppen an, ohne die Vorgabe zu ändern. */
    alleGruppenAn: function () {
      var g = {};
      Object.keys(GRUPPEN).forEach(function (k) { g[k] = { an: true, titel: GRUPPEN[k].titel }; });
      return g;
    },
    zeichenBilanz: zeichenBilanz,
    alsWoerterbuchRegeln: alsWoerterbuchRegeln,
    betonteSilbe: betonteSilbe
  };

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (wurzel) wurzel.AusspracheTabelle = API;
})(typeof window !== "undefined" ? window : null);
