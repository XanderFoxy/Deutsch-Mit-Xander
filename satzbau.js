/* =====================================================================
   SATZBAU — der Fall- und Präpositions-Motor
   ---------------------------------------------------------------------
   Warum es dieses Modul gibt
   ---------------------------------------------------------------------
   Im Satzbaukasten stand bisher bei jedem Ort eine feste Zeichenkette:
   „am Meer“. Das ist richtig, solange jemand DORT ist — „ich bin am
   Meer“. Sobald aber ein Richtungsverb davorsteht, wird es falsch:
   „wir fahren am Meer“. Das war der Fehler, und er ließ sich mit noch
   mehr festen Zeichenketten nicht sauber lösen, weil jede Ergänzung
   dann in zwei, drei, vier Fassungen hätte dastehen müssen.

   Hier steht deshalb nicht mehr die fertige Wendung, sondern das nackte
   Wort mit seinen Eigenschaften: „Meer“, sächlich, gehört zur
   Präposition „an“. Welche Form daraus wird, entscheidet die ROLLE, die
   das Wort im Satz spielt:

       wo?     → an + Dativ    → am Meer      (ich bin am Meer)
       wohin?  → an + Akkusativ→ ans Meer     (wir fahren ans Meer)
       woher?  → von + Dativ   → vom Meer     (wir kommen vom Meer)

   Dasselbe gilt für Personen und Dinge: „mein Freund“ wird je nach
   Rolle zu „meinen Freund“ (Akkusativ) oder „meinem Freund“ (Dativ),
   und bei den schwachen Nomen kommt das -n dazu: „meinen Nachbarn“.

   Für das Italienische ist die Sache leichter — dort heißt es „al mare“,
   egal ob man dort ist oder hinfährt. Genau deshalb steht beides in
   EINEM Eintrag: Der italienische Satz bleibt gleich, und die deutsche
   Übersetzung bekommt trotzdem die richtige Form. Das ist der Punkt,
   an dem Italienischlernende sonst hängenbleiben.

   Gebaut wird ein Satz aus den Grundfragen:
       WER  macht  WAS  WO/WOHIN  WANN  WIE
   Man muss nicht alle beantworten. „Wer + Verb“ reicht für einen Satz,
   alles Weitere macht ihn genauer.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     1. DEUTSCHE FORMENLEHRE
     =================================================================== */

  // Bestimmter Artikel nach Fall und Geschlecht.
  const ARTIKEL_BESTIMMT = {
    nom: { m: "der", f: "die", n: "das", pl: "die" },
    akk: { m: "den", f: "die", n: "das", pl: "die" },
    dat: { m: "dem", f: "der", n: "dem", pl: "den" },
  };
  // Unbestimmter Artikel — im Plural gibt es keinen, dort steht nichts.
  const ARTIKEL_UNBESTIMMT = {
    nom: { m: "ein", f: "eine", n: "ein", pl: "" },
    akk: { m: "einen", f: "eine", n: "ein", pl: "" },
    dat: { m: "einem", f: "einer", n: "einem", pl: "" },
  };
  // Possessivbegleiter: derselbe Bauplan wie „ein“, nur mit Stamm davor.
  const POSSESSIV_ENDUNG = {
    nom: { m: "", f: "e", n: "", pl: "e" },
    akk: { m: "en", f: "e", n: "", pl: "e" },
    dat: { m: "em", f: "er", n: "em", pl: "en" },
  };
  // Verschmelzungen. Ohne sie klänge jeder Satz nach Lehrbuch:
  // „in dem Supermarkt“ sagt niemand, „im Supermarkt“ schon.
  const VERSCHMELZUNG = {
    "an dem": "am", "an das": "ans",
    "in dem": "im", "in das": "ins",
    "bei dem": "beim",
    "zu dem": "zum", "zu der": "zur",
    "von dem": "vom",
    "auf das": "aufs",
    "für das": "fürs",
    "um das": "ums",
    "durch das": "durchs",
    "über das": "übers",
    "unter das": "unters",
    "vor das": "vors",
    "hinter das": "hinters",
  };

  // Wechselpräpositionen: Dativ auf die Frage „wo?“, Akkusativ auf „wohin?“.
  // Das ist die eine Regel, an der „wir fahren am Meer“ gescheitert ist.
  const WECHSEL = ["an", "auf", "in", "hinter", "neben", "über", "unter", "vor", "zwischen"];
  // Präpositionen, die IMMER den Dativ nehmen — dort gibt es nichts zu wählen.
  const NUR_DATIV = ["aus", "bei", "mit", "nach", "seit", "von", "zu", "gegenüber"];
  // Präpositionen, die IMMER den Akkusativ nehmen.
  const NUR_AKKUSATIV = ["durch", "für", "gegen", "ohne", "um", "bis", "entlang"];

  function verschmelze(praep, artikel) {
    const paar = praep + " " + artikel;
    return VERSCHMELZUNG[paar] || paar;
  }

  // Baut die Nominalgruppe: Begleiter + (Adjektiv) + Nomen, im gewünschten Fall.
  // begleiter: "bestimmt" | "unbestimmt" | "ohne" | ein Possessivstamm wie "mein"
  function nominalgruppe(eintrag, fall, begleiter) {
    const genus = eintrag.plural ? "pl" : (eintrag.genus || "n");
    const nomen = beugeNomen(eintrag, fall, genus);
    const art = begleiter || eintrag.begleiter || "bestimmt";
    if (art === "ohne" || eintrag.eigenname) return nomen;
    if (art === "bestimmt") return ARTIKEL_BESTIMMT[fall][genus] + " " + nomen;
    if (art === "unbestimmt") {
      const a = ARTIKEL_UNBESTIMMT[fall][genus];
      return a ? a + " " + nomen : nomen;
    }
    // Possessiv: mein/dein/sein/ihr/unser/euer + Endung
    return art + POSSESSIV_ENDUNG[fall][genus] + " " + nomen;
  }

  // Schwache Nomen (n-Deklination) hängen außer im Nominativ Singular ein -n
  // oder -en an: der Nachbar → den Nachbarn, der Student → den Studenten.
  // Steht das im Datensatz nicht drin, bleibt das Wort unverändert.
  function beugeNomen(eintrag, fall, genus) {
    if (eintrag.plural || genus === "pl") {
      // Im Plural bekommt NUR der Dativ ein -n: die Berge, in die Berge,
      // aber in den Bergen. Vorher stand überall die Dativform, daraus
      // wurde „in die Bergen“.
      const grund = eintrag.nomen;
      if (fall !== "dat") return grund;
      if (/[ns]$/.test(grund)) return grund;
      return grund + "n";
    }
    const wort = eintrag.nomen;
    if (!eintrag.schwach || fall === "nom") return wort;
    if (/[aeiou]$/.test(wort)) return wort + "n";
    if (/(ent|ant|ist|at|ph|arch|nom|log)$/.test(wort)) return wort + "en";
    if (wort === "Herr") return "Herrn";
    return wort + "n";
  }

  /* ===================================================================
     2. ORTE — ein Eintrag, drei Rollen
     ===================================================================
     praep  : die Präposition, die zu diesem Ort gehört ("an", "in", "auf",
              "bei", "zu", "nach")
     genus  : m/f/n, oder plural: true
     begleiter: "bestimmt" (Standard), "ohne" (zu Hause), "eigenname" (Berlin)
     it     : die italienische Wendung — dort ändert sie sich nicht
     =================================================================== */
  const ORTE = [
    // Alltag & Zuhause
    { id: "zuhause", nomen: "Hause", genus: "n", praep: "zu", begleiter: "ohne", festWo: "zu Hause", festWohin: "nach Hause", festWoher: "von zu Hause", it: "a casa", itWoher: "da casa", kategorie: "alltag", level: "A1" },
    { id: "kueche", nomen: "Küche", genus: "f", praep: "in", it: "in cucina", itWoher: "dalla cucina", kategorie: "alltag", level: "A1" },
    { id: "garten", nomen: "Garten", genus: "m", praep: "in", it: "in giardino", itWoher: "dal giardino", kategorie: "alltag", level: "A1" },
    { id: "balkon", nomen: "Balkon", genus: "m", praep: "auf", it: "sul balcone", itWoher: "dal balcone", kategorie: "alltag", level: "A2" },
    { id: "bett", nomen: "Bett", genus: "n", praep: "in", it: "a letto", itWoher: "dal letto", kategorie: "alltag", level: "A1" },
    { id: "keller", nomen: "Keller", genus: "m", praep: "in", it: "in cantina", itWoher: "dalla cantina", kategorie: "alltag", level: "A2" },
    { id: "wohnzimmer", nomen: "Wohnzimmer", genus: "n", praep: "in", it: "in soggiorno", itWoher: "dal soggiorno", kategorie: "alltag", level: "A2" },
    // Einkaufen
    { id: "supermarkt", nomen: "Supermarkt", genus: "m", praep: "in", it: "al supermercato", itWoher: "dal supermercato", kategorie: "einkaufen", level: "A1" },
    { id: "markt", nomen: "Markt", genus: "m", praep: "auf", it: "al mercato", itWoher: "dal mercato", kategorie: "einkaufen", level: "A2" },
    { id: "baeckerei", nomen: "Bäckerei", genus: "f", praep: "in", it: "in panetteria", itWoher: "dalla panetteria", kategorie: "einkaufen", level: "A1" },
    { id: "apotheke", nomen: "Apotheke", genus: "f", praep: "in", it: "in farmacia", itWoher: "dalla farmacia", kategorie: "einkaufen", level: "A2" },
    { id: "kaufhaus", nomen: "Kaufhaus", genus: "n", praep: "in", it: "al centro commerciale", itWoher: "dal centro commerciale", kategorie: "einkaufen", level: "A2" },
    // Arbeit & Beruf
    { id: "buero", nomen: "Büro", genus: "n", praep: "in", it: "in ufficio", itWoher: "dall'ufficio", kategorie: "arbeit", level: "A1" },
    { id: "arbeit", nomen: "Arbeit", genus: "f", praep: "auf", festWohin: "zur Arbeit", it: "al lavoro", itWoher: "dal lavoro", kategorie: "arbeit", level: "A1" },
    { id: "besprechung", nomen: "Besprechung", genus: "f", praep: "in", it: "in riunione", itWoher: "dalla riunione", kategorie: "arbeit", level: "B1" },
    { id: "werkstatt", nomen: "Werkstatt", genus: "f", praep: "in", it: "in officina", itWoher: "dall'officina", kategorie: "arbeit", level: "B1" },
    { id: "baustelle", nomen: "Baustelle", genus: "f", praep: "auf", it: "in cantiere", itWoher: "dal cantiere", kategorie: "arbeit", level: "B1" },
    // Bildung
    { id: "schule", nomen: "Schule", genus: "f", praep: "in", it: "a scuola", itWoher: "da scuola", kategorie: "bildung", level: "A1" },
    { id: "uni", nomen: "Universität", genus: "f", praep: "an", it: "all'università", itWoher: "dall'università", kategorie: "bildung", level: "A2" },
    { id: "bibliothek", nomen: "Bibliothek", genus: "f", praep: "in", it: "in biblioteca", itWoher: "dalla biblioteca", kategorie: "bildung", level: "A2" },
    { id: "kurs", nomen: "Kurs", genus: "m", praep: "in", it: "al corso", itWoher: "dal corso", kategorie: "bildung", level: "A2" },
    // Freizeit
    { id: "meer", nomen: "Meer", genus: "n", praep: "an", it: "al mare", itWoher: "dal mare", kategorie: "freizeit", level: "A1" },
    { id: "berge", nomen: "Berge", genus: "m", plural: true, praep: "in", it: "in montagna", itWoher: "dalla montagna", kategorie: "freizeit", level: "A1" },
    { id: "see", nomen: "See", genus: "m", praep: "an", it: "al lago", itWoher: "dal lago", kategorie: "freizeit", level: "A2" },
    { id: "park", nomen: "Park", genus: "m", praep: "in", it: "al parco", itWoher: "dal parco", kategorie: "freizeit", level: "A1" },
    { id: "kino", nomen: "Kino", genus: "n", praep: "in", it: "al cinema", itWoher: "dal cinema", kategorie: "freizeit", level: "A1" },
    { id: "theater", nomen: "Theater", genus: "n", praep: "in", it: "a teatro", itWoher: "dal teatro", kategorie: "freizeit", level: "A2" },
    { id: "museum", nomen: "Museum", genus: "n", praep: "in", it: "al museo", itWoher: "dal museo", kategorie: "freizeit", level: "A2" },
    { id: "schwimmbad", nomen: "Schwimmbad", genus: "n", praep: "in", it: "in piscina", itWoher: "dalla piscina", kategorie: "freizeit", level: "A2" },
    { id: "stadion", nomen: "Stadion", genus: "n", praep: "in", it: "allo stadio", itWoher: "dallo stadio", kategorie: "freizeit", level: "B1" },
    { id: "konzert", nomen: "Konzert", genus: "n", praep: "auf", it: "al concerto", itWoher: "dal concerto", kategorie: "freizeit", level: "B1" },
    // Essen & Trinken
    { id: "restaurant", nomen: "Restaurant", genus: "n", praep: "in", it: "al ristorante", itWoher: "dal ristorante", kategorie: "essen", level: "A1" },
    { id: "cafe", nomen: "Café", genus: "n", praep: "in", it: "al bar", itWoher: "dal bar", kategorie: "essen", level: "A1" },
    { id: "kantine", nomen: "Kantine", genus: "f", praep: "in", it: "in mensa", itWoher: "dalla mensa", kategorie: "essen", level: "B1" },
    // Reisen & Verkehr
    { id: "bahnhof", nomen: "Bahnhof", genus: "m", praep: "an", festWohin: "zum Bahnhof", it: "alla stazione", itWoher: "dalla stazione", kategorie: "reisen", level: "A1" },
    { id: "flughafen", nomen: "Flughafen", genus: "m", praep: "an", festWohin: "zum Flughafen", it: "all'aeroporto", itWoher: "dall'aeroporto", kategorie: "reisen", level: "A2" },
    { id: "hotel", nomen: "Hotel", genus: "n", praep: "in", it: "in albergo", itWoher: "dall'albergo", kategorie: "reisen", level: "A2" },
    { id: "italien", nomen: "Italien", eigenname: true, genus: "n", praep: "in", festWohin: "nach Italien", it: "in Italia", itWoher: "dall'Italia", kategorie: "reisen", level: "A1" },
    { id: "berlin", nomen: "Berlin", eigenname: true, genus: "n", praep: "in", festWohin: "nach Berlin", it: "a Berlino", itWoher: "da Berlino", kategorie: "reisen", level: "A1" },
    { id: "rom", nomen: "Rom", eigenname: true, genus: "n", praep: "in", festWohin: "nach Rom", it: "a Roma", itWoher: "da Roma", kategorie: "reisen", level: "A1" },
    { id: "stadt", nomen: "Stadt", genus: "f", praep: "in", it: "in città", itWoher: "dalla città", kategorie: "reisen", level: "A1" },
    { id: "land", nomen: "Land", genus: "n", praep: "auf", festWo: "auf dem Land", festWohin: "aufs Land", it: "in campagna", itWoher: "dalla campagna", kategorie: "reisen", level: "A2" },
    // Gesundheit
    { id: "arzt", nomen: "Arzt", genus: "m", praep: "bei", festWohin: "zum Arzt", it: "dal medico", itWoher: "dal medico", kategorie: "gesundheit", level: "A1" },
    { id: "krankenhaus", nomen: "Krankenhaus", genus: "n", praep: "in", it: "in ospedale", itWoher: "dall'ospedale", kategorie: "gesundheit", level: "A2" },
    { id: "zahnarzt", nomen: "Zahnarzt", genus: "m", praep: "bei", festWohin: "zum Zahnarzt", it: "dal dentista", itWoher: "dal dentista", kategorie: "gesundheit", level: "A2" },
    // Verwaltung
    { id: "amt", nomen: "Amt", genus: "n", praep: "auf", it: "in comune", itWoher: "dal comune", kategorie: "verwaltung", level: "B1" },
    { id: "bank", nomen: "Bank", genus: "f", praep: "auf", it: "in banca", itWoher: "dalla banca", kategorie: "verwaltung", level: "A2" },
    { id: "post", nomen: "Post", genus: "f", praep: "auf", it: "alla posta", itWoher: "dalla posta", kategorie: "verwaltung", level: "A2" },
  ];

  /* Die Ortsform für eine Rolle. Das ist das Herzstück:
     dieselbe Zeile im Datensatz, drei verschiedene Ergebnisse. */
  function ortsform(ort, rolle) {
    if (rolle === "wo" && ort.festWo) return ort.festWo;
    if (rolle === "wohin" && ort.festWohin) return ort.festWohin;
    if (rolle === "woher" && ort.festWoher) return ort.festWoher;

    if (rolle === "woher") {
      // „aus“ bei Räumen, „von“ bei Personen und offenen Orten.
      const praep = ["bei", "auf", "an", "zu"].includes(ort.praep) ? "von" : "aus";
      if (ort.eigenname) return praep + " " + ort.nomen;
      const genus = ort.plural ? "pl" : ort.genus;
      return verschmelze(praep, ARTIKEL_BESTIMMT.dat[genus]) + " " + beugeNomen(ort, "dat", genus);
    }

    let praep = ort.praep;
    let fall = "dat";
    if (rolle === "wohin") {
      if (WECHSEL.includes(praep)) fall = "akk";           // an → ans, in → ins
      else if (praep === "bei") { praep = "zu"; fall = "dat"; }  // bei → zu
      else if (praep === "zu") fall = "dat";
    }
    if (ort.eigenname) return (rolle === "wohin" ? "nach" : praep) + " " + ort.nomen;
    if (ort.begleiter === "ohne") return praep + " " + ort.nomen;
    const genus = ort.plural ? "pl" : ort.genus;
    return verschmelze(praep, ARTIKEL_BESTIMMT[fall][genus]) + " " + beugeNomen(ort, fall, genus);
  }

  /* ===================================================================
     3. PERSONEN UND DINGE — das WER und das WAS
     =================================================================== */
  const SUBJEKTE = [
    { id: "1sg", de: "ich", it: "io", person: 1, zahl: "sg", possessiv: "mein" },
    { id: "2sg", de: "du", it: "tu", person: 2, zahl: "sg", possessiv: "dein" },
    { id: "3sgm", de: "er", it: "lui", person: 3, zahl: "sg", possessiv: "sein" },
    { id: "3sgf", de: "sie", it: "lei", person: 3, zahl: "sg", possessiv: "ihr" },
    { id: "1pl", de: "wir", it: "noi", person: 1, zahl: "pl", possessiv: "unser" },
    { id: "2pl", de: "ihr", it: "voi", person: 2, zahl: "pl", possessiv: "euer" },
    { id: "3pl", de: "sie", it: "loro", person: 3, zahl: "pl", possessiv: "ihr" },
  ];

  // Dinge und Personen, die als Objekt auftreten können. Kein Fall steht hier
  // fest — den bestimmt erst das Verb.
  const DINGE = [
    // Essen & Trinken
    { id: "brot", nomen: "Brot", genus: "n", it: "il pane", itUnbest: "del pane", kategorie: "essen", level: "A1", rollen: ["essen", "kaufen"] },
    { id: "apfel", nomen: "Apfel", genus: "m", it: "una mela", kategorie: "essen", level: "A1", rollen: ["essen", "kaufen"] },
    { id: "pizza", nomen: "Pizza", genus: "f", it: "la pizza", kategorie: "essen", level: "A1", rollen: ["essen", "kaufen"] },
    { id: "suppe", nomen: "Suppe", genus: "f", it: "la minestra", kategorie: "essen", level: "A1", rollen: ["essen", "kochen"] },
    { id: "kuchen", nomen: "Kuchen", genus: "m", it: "una torta", kategorie: "essen", level: "A1", rollen: ["essen", "kochen", "kaufen"] },
    { id: "nudeln", nomen: "Nudeln", genus: "f", plural: true, it: "la pasta", kategorie: "essen", level: "A1", rollen: ["essen", "kochen"] },
    { id: "kaffee", nomen: "Kaffee", genus: "m", it: "un caffè", kategorie: "essen", level: "A1", rollen: ["trinken", "kaufen"] },
    { id: "tee", nomen: "Tee", genus: "m", it: "un tè", kategorie: "essen", level: "A1", rollen: ["trinken", "kaufen"] },
    { id: "wasser", nomen: "Wasser", genus: "n", it: "dell'acqua", kategorie: "essen", level: "A1", rollen: ["trinken"] },
    { id: "wein", nomen: "Wein", genus: "m", it: "il vino", kategorie: "essen", level: "A2", rollen: ["trinken", "kaufen"] },
    // Haushalt & Alltag
    { id: "waesche", nomen: "Wäsche", genus: "f", it: "il bucato", kategorie: "alltag", level: "A2", rollen: ["machen", "waschen"] },
    { id: "geschirr", nomen: "Geschirr", genus: "n", it: "i piatti", kategorie: "alltag", level: "A2", rollen: ["machen", "waschen"] },
    { id: "einkauf", nomen: "Einkauf", genus: "m", it: "la spesa", kategorie: "einkaufen", level: "A2", rollen: ["machen"] },
    { id: "fruehstueck", nomen: "Frühstück", genus: "n", begleiter: "ohne", it: "colazione", kategorie: "alltag", level: "A1", rollen: ["machen"] },
    { id: "bett2", nomen: "Bett", genus: "n", it: "il letto", kategorie: "alltag", level: "A2", rollen: ["machen"] },
    // Lesen & Schreiben
    { id: "buch", nomen: "Buch", genus: "n", it: "un libro", kategorie: "bildung", level: "A1", rollen: ["lesen", "kaufen", "schreiben"] },
    { id: "zeitung", nomen: "Zeitung", genus: "f", it: "il giornale", kategorie: "bildung", level: "A1", rollen: ["lesen", "kaufen"] },
    { id: "brief", nomen: "Brief", genus: "m", it: "una lettera", kategorie: "arbeit", level: "A2", rollen: ["lesen", "schreiben"] },
    { id: "nachricht", nomen: "Nachricht", genus: "f", it: "un messaggio", kategorie: "arbeit", level: "A2", rollen: ["lesen", "schreiben"] },
    { id: "bericht", nomen: "Bericht", genus: "m", it: "una relazione", kategorie: "arbeit", level: "B1", rollen: ["lesen", "schreiben"] },
    { id: "mail", nomen: "E-Mail", genus: "f", it: "un'e-mail", kategorie: "arbeit", level: "A2", rollen: ["lesen", "schreiben"] },
    // Freizeit
    { id: "film", nomen: "Film", genus: "m", it: "un film", kategorie: "freizeit", level: "A1", rollen: ["sehen"] },
    { id: "musik", nomen: "Musik", genus: "f", begleiter: "ohne", it: "la musica", kategorie: "freizeit", level: "A1", rollen: ["hoeren", "machen"] },
    { id: "fussball", nomen: "Fußball", genus: "m", begleiter: "ohne", it: "a calcio", kategorie: "freizeit", level: "A1", rollen: ["spielen"] },
    { id: "klavier", nomen: "Klavier", genus: "n", it: "il pianoforte", kategorie: "freizeit", level: "A2", rollen: ["spielen"] },
    { id: "karten", nomen: "Karten", genus: "f", plural: true, begleiter: "ohne", it: "a carte", kategorie: "freizeit", level: "A2", rollen: ["spielen"] },
    { id: "foto", nomen: "Foto", genus: "n", it: "una foto", kategorie: "freizeit", level: "A2", rollen: ["machen", "sehen"] },
    // Sprache
    { id: "deutsch", nomen: "Deutsch", begleiter: "ohne", genus: "n", it: "il tedesco", kategorie: "bildung", level: "A1", rollen: ["sprechen", "lernen", "verstehen"] },
    { id: "italienisch", nomen: "Italienisch", begleiter: "ohne", genus: "n", it: "l'italiano", kategorie: "bildung", level: "A1", rollen: ["sprechen", "lernen", "verstehen"] },
    // Arbeit
    { id: "termin", nomen: "Termin", genus: "m", it: "un appuntamento", kategorie: "arbeit", level: "A2", rollen: ["machen", "haben"] },
    { id: "vertrag", nomen: "Vertrag", genus: "m", it: "il contratto", kategorie: "verwaltung", level: "B1", rollen: ["lesen", "schreiben"] },
    { id: "antrag", nomen: "Antrag", genus: "m", it: "la domanda", kategorie: "verwaltung", level: "B1", rollen: ["schreiben", "machen"] },
    { id: "zeit", nomen: "Zeit", genus: "f", begleiter: "ohne", it: "tempo", kategorie: "alltag", level: "A1", rollen: ["haben"] },
    { id: "hunger", nomen: "Hunger", genus: "m", begleiter: "ohne", it: "fame", kategorie: "essen", level: "A1", rollen: ["haben"] },
    { id: "durst", nomen: "Durst", genus: "m", begleiter: "ohne", it: "sete", kategorie: "essen", level: "A1", rollen: ["haben"] },
  ];

  // Menschen, über die man spricht — sie stehen im Akkusativ oder Dativ,
  // je nachdem, was das Verb verlangt.
  const PERSONEN = [
    { id: "freund", nomen: "Freund", genus: "m", it: "il mio amico", itMit: "con il mio amico", itAn: "al mio amico", kategorie: "familie", level: "A1" },
    { id: "freundin", nomen: "Freundin", genus: "f", it: "la mia amica", itMit: "con la mia amica", itAn: "alla mia amica", kategorie: "familie", level: "A1" },
    { id: "eltern", nomen: "Eltern", genus: "f", plural: true, it: "i miei genitori", itMit: "con i miei genitori", itAn: "ai miei genitori", kategorie: "familie", level: "A1" },
    { id: "bruder", nomen: "Bruder", genus: "m", it: "mio fratello", itMit: "con mio fratello", itAn: "a mio fratello", kategorie: "familie", level: "A1" },
    { id: "schwester", nomen: "Schwester", genus: "f", it: "mia sorella", itMit: "con mia sorella", itAn: "a mia sorella", kategorie: "familie", level: "A1" },
    { id: "kollege", nomen: "Kollege", genus: "m", schwach: true, it: "il mio collega", itMit: "con il mio collega", itAn: "al mio collega", kategorie: "arbeit", level: "A2" },
    { id: "nachbar", nomen: "Nachbar", genus: "m", schwach: true, it: "il mio vicino", itMit: "con il mio vicino", itAn: "al mio vicino", kategorie: "alltag", level: "A2" },
    { id: "chef", nomen: "Chef", genus: "m", it: "il mio capo", itMit: "con il mio capo", itAn: "al mio capo", kategorie: "arbeit", level: "A2" },
    { id: "lehrerin", nomen: "Lehrerin", genus: "f", it: "la mia insegnante", itMit: "con la mia insegnante", itAn: "alla mia insegnante", kategorie: "bildung", level: "A1" },
    { id: "kind", nomen: "Kind", genus: "n", it: "il bambino", itMit: "con il bambino", itAn: "al bambino", kategorie: "familie", level: "A1" },
  ];

  /* ===================================================================
     4. VERBEN — sie bestimmen, welche Rollen der Satz zulässt
     ===================================================================
     ortRolle : "wohin" bei Bewegungsverben, "wo" bei allen anderen
     objekt   : welcher Fall für das WAS  ("akk" | "dat" | null)
     personPraep: mit welcher Präposition eine PERSON angeschlossen wird
     =================================================================== */
  const VERBEN = [
    { id: "sein", inf: "sein", formen: ["bin", "bist", "ist", "sind", "seid", "sind"], hilfsverb: "sein", partizip: "gewesen",
      ortRolle: "wo", objekt: null, itInf: "essere", itFormen: ["sono", "sei", "è", "siamo", "siete", "sono"], itHilf: "essere", itFutStamm: "sar", itPart: "stat", kategorien: ["alltag", "arbeit", "freizeit", "reisen", "bildung", "gesundheit"] },
    { id: "gehen", inf: "gehen", formen: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"], hilfsverb: "sein", partizip: "gegangen",
      ortRolle: "wohin", objekt: null, itInf: "andare", itFormen: ["vado", "vai", "va", "andiamo", "andate", "vanno"], itHilf: "essere", itFutStamm: "andr", itPart: "andat", kategorien: ["alltag", "arbeit", "freizeit", "reisen", "bildung", "gesundheit", "einkaufen"] },
    { id: "fahren", inf: "fahren", formen: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], hilfsverb: "sein", partizip: "gefahren",
      ortRolle: "wohin", objekt: null, itInf: "andare", itFormen: ["vado", "vai", "va", "andiamo", "andate", "vanno"], itHilf: "essere", itFutStamm: "andr", itPart: "andat", kategorien: ["reisen", "arbeit", "freizeit"] },
    { id: "kommen", inf: "kommen", formen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], hilfsverb: "sein", partizip: "gekommen",
      ortRolle: "woher", objekt: null, itInf: "venire", itFormen: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], itHilf: "essere", itFutStamm: "verr", itPart: "venut", kategorien: ["reisen", "alltag", "arbeit"] },
    { id: "wohnen", inf: "wohnen", formen: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"], hilfsverb: "haben", partizip: "gewohnt",
      ortRolle: "wo", objekt: null, itInf: "abitare", itFormen: ["abito", "abiti", "abita", "abitiamo", "abitate", "abitano"], itHilf: "avere", itFutStamm: "abiter", itPart: "abitato", kategorien: ["alltag", "reisen"] },
    { id: "arbeiten", inf: "arbeiten", formen: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"], hilfsverb: "haben", partizip: "gearbeitet",
      ortRolle: "wo", objekt: null, itInf: "lavorare", itFormen: ["lavoro", "lavori", "lavora", "lavoriamo", "lavorate", "lavorano"], itHilf: "avere", itFutStamm: "lavorer", itPart: "lavorato", kategorien: ["arbeit"] },
    { id: "essen", inf: "essen", formen: ["esse", "isst", "isst", "essen", "esst", "essen"], hilfsverb: "haben", partizip: "gegessen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["essen"], itInf: "mangiare", itFormen: ["mangio", "mangi", "mangia", "mangiamo", "mangiate", "mangiano"], itHilf: "avere", itFutStamm: "manger", itPart: "mangiato", kategorien: ["essen", "alltag"] },
    { id: "trinken", inf: "trinken", formen: ["trinke", "trinkst", "trinkt", "trinken", "trinkt", "trinken"], hilfsverb: "haben", partizip: "getrunken",
      ortRolle: "wo", objekt: "akk", objektRollen: ["trinken"], itInf: "bere", itFormen: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"], itHilf: "avere", itFutStamm: "berr", itPart: "bevuto", kategorien: ["essen"] },
    { id: "kochen", inf: "kochen", formen: ["koche", "kochst", "kocht", "kochen", "kocht", "kochen"], hilfsverb: "haben", partizip: "gekocht",
      ortRolle: "wo", objekt: "akk", objektRollen: ["kochen"], itInf: "cucinare", itFormen: ["cucino", "cucini", "cucina", "cuciniamo", "cucinate", "cucinano"], itHilf: "avere", itFutStamm: "cuciner", itPart: "cucinato", kategorien: ["essen", "alltag"] },
    { id: "kaufen", inf: "kaufen", formen: ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"], hilfsverb: "haben", partizip: "gekauft",
      ortRolle: "wo", objekt: "akk", objektPflicht: true, objektRollen: ["kaufen"], itInf: "comprare", itFormen: ["compro", "compri", "compra", "compriamo", "comprate", "comprano"], itHilf: "avere", itFutStamm: "comprer", itPart: "comprato", kategorien: ["einkaufen"] },
    { id: "lesen", inf: "lesen", formen: ["lese", "liest", "liest", "lesen", "lest", "lesen"], hilfsverb: "haben", partizip: "gelesen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["lesen"], itInf: "leggere", itFormen: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"], itHilf: "avere", itFutStamm: "legger", itPart: "letto", kategorien: ["bildung", "freizeit", "arbeit"] },
    { id: "schreiben", inf: "schreiben", formen: ["schreibe", "schreibst", "schreibt", "schreiben", "schreibt", "schreiben"], hilfsverb: "haben", partizip: "geschrieben",
      ortRolle: "wo", objekt: "akk", objektRollen: ["schreiben"], personPraep: "an", personFall: "akk", itInf: "scrivere", itFormen: ["scrivo", "scrivi", "scrive", "scriviamo", "scrivete", "scrivono"], itHilf: "avere", itFutStamm: "scriver", itPart: "scritto", itPersonFeld: "itAn", kategorien: ["arbeit", "bildung", "verwaltung"] },
    { id: "sehen", inf: "sehen", formen: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"], hilfsverb: "haben", partizip: "gesehen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["sehen"], personFall: "akk", itInf: "vedere", itFormen: ["vedo", "vedi", "vede", "vediamo", "vedete", "vedono"], itHilf: "avere", itFutStamm: "vedr", itPart: "visto", kategorien: ["freizeit", "familie"] },
    { id: "hoeren", inf: "hören", formen: ["höre", "hörst", "hört", "hören", "hört", "hören"], hilfsverb: "haben", partizip: "gehört",
      ortRolle: "wo", objekt: "akk", objektRollen: ["hoeren"], personFall: "akk", itInf: "ascoltare", itFormen: ["ascolto", "ascolti", "ascolta", "ascoltiamo", "ascoltate", "ascoltano"], itHilf: "avere", itFutStamm: "ascolter", itPart: "ascoltato", kategorien: ["freizeit"] },
    { id: "spielen", inf: "spielen", formen: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"], hilfsverb: "haben", partizip: "gespielt",
      ortRolle: "wo", objekt: "akk", objektRollen: ["spielen"], itInf: "giocare", itFormen: ["gioco", "giochi", "gioca", "giochiamo", "giocate", "giocano"], itHilf: "avere", itFutStamm: "giocher", itPart: "giocato", kategorien: ["freizeit"] },
    { id: "lernen", inf: "lernen", formen: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"], hilfsverb: "haben", partizip: "gelernt",
      ortRolle: "wo", objekt: "akk", objektRollen: ["lernen"], itInf: "studiare", itFormen: ["studio", "studi", "studia", "studiamo", "studiate", "studiano"], itHilf: "avere", itFutStamm: "studier", itPart: "studiato", kategorien: ["bildung"] },
    { id: "sprechen", inf: "sprechen", formen: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"], hilfsverb: "haben", partizip: "gesprochen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["sprechen"], personPraep: "mit", personFall: "dat", itInf: "parlare", itFormen: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"], itHilf: "avere", itFutStamm: "parler", itPart: "parlato", itPersonFeld: "itMit", kategorien: ["bildung", "arbeit", "familie"] },
    { id: "verstehen", inf: "verstehen", formen: ["verstehe", "verstehst", "versteht", "verstehen", "versteht", "verstehen"], hilfsverb: "haben", partizip: "verstanden",
      ortRolle: "wo", objekt: "akk", objektRollen: ["verstehen"], personFall: "akk", itInf: "capire", itFormen: ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"], itHilf: "avere", itFutStamm: "capir", itPart: "capito", kategorien: ["bildung", "familie"] },
    { id: "treffen", inf: "treffen", formen: ["treffe", "triffst", "trifft", "treffen", "trefft", "treffen"], hilfsverb: "haben", partizip: "getroffen",
      ortRolle: "wo", objekt: null, personFall: "akk", itInf: "incontrare", itFormen: ["incontro", "incontri", "incontra", "incontriamo", "incontrate", "incontrano"], itHilf: "avere", itFutStamm: "incontrer", itPart: "incontrato", kategorien: ["familie", "freizeit", "arbeit"] },
    { id: "helfen", inf: "helfen", formen: ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"], hilfsverb: "haben", partizip: "geholfen",
      ortRolle: "wo", objekt: null, personFall: "dat", itInf: "aiutare", itFormen: ["aiuto", "aiuti", "aiuta", "aiutiamo", "aiutate", "aiutano"], itHilf: "avere", itFutStamm: "aiuter", itPart: "aiutato", itPersonFeld: "it", kategorien: ["familie", "arbeit", "alltag"] },
    { id: "warten", inf: "warten", formen: ["warte", "wartest", "wartet", "warten", "wartet", "warten"], hilfsverb: "haben", partizip: "gewartet",
      ortRolle: "wo", objekt: null, personPraep: "auf", personFall: "akk", itInf: "aspettare", itFormen: ["aspetto", "aspetti", "aspetta", "aspettiamo", "aspettate", "aspettano"], itHilf: "avere", itFutStamm: "aspetter", itPart: "aspettato", itPersonFeld: "it", kategorien: ["alltag", "reisen", "familie"] },
    { id: "machen", inf: "machen", formen: ["mache", "machst", "macht", "machen", "macht", "machen"], hilfsverb: "haben", partizip: "gemacht",
      ortRolle: "wo", objekt: "akk", objektPflicht: true, objektRollen: ["machen"], itInf: "fare", itFormen: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"], itHilf: "avere", itFutStamm: "far", itPart: "fatto", kategorien: ["alltag", "arbeit", "freizeit"] },
    { id: "haben", inf: "haben", formen: ["habe", "hast", "hat", "haben", "habt", "haben"], hilfsverb: "haben", partizip: "gehabt",
      ortRolle: null, objekt: "akk", objektPflicht: true, objektRollen: ["haben"], itInf: "avere", itFormen: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"], itHilf: "avere", itFutStamm: "avr", itPart: "avuto", kategorien: ["alltag", "arbeit"] },
    { id: "schlafen", inf: "schlafen", formen: ["schlafe", "schläfst", "schläft", "schlafen", "schlaft", "schlafen"], hilfsverb: "haben", partizip: "geschlafen",
      ortRolle: "wo", objekt: null, itInf: "dormire", itFormen: ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"], itHilf: "avere", itFutStamm: "dormir", itPart: "dormito", kategorien: ["alltag", "reisen"] },
  ];

  /* ===================================================================
     5. WANN und WIE
     =================================================================== */
  const ZEITEN = [
    { id: "keine", de: "", it: "" },
    { id: "heute", de: "heute", it: "oggi" },
    { id: "morgen", de: "morgen", it: "domani", nurZukunft: true },
    { id: "gestern", de: "gestern", it: "ieri", nurVergangenheit: true },
    { id: "jetzt", de: "jetzt", it: "adesso", nurGegenwart: true },
    { id: "frueh", de: "am Morgen", it: "la mattina" },
    { id: "abend", de: "am Abend", it: "la sera" },
    { id: "jedentag", de: "jeden Tag", it: "ogni giorno" },
    { id: "oft", de: "oft", it: "spesso" },
    { id: "immer", de: "immer", it: "sempre" },
    { id: "manchmal", de: "manchmal", it: "a volte" },
    { id: "montags", de: "montags", it: "il lunedì" },
    { id: "wochenende", de: "am Wochenende", it: "il fine settimana" },
    { id: "letztewoche", de: "letzte Woche", it: "la settimana scorsa", nurVergangenheit: true },
    { id: "naechstewoche", de: "nächste Woche", it: "la prossima settimana", nurZukunft: true },
  ];
  /* Art und Weise. Nicht jede Angabe passt zu jedem Verb: „mit dem Bus“ gehört
     zu einer Fahrt, nicht zu „einen Termin haben“, und „in Ruhe“ passt zu einer
     Tätigkeit, nicht zu „ich bin im Krankenhaus“. Deshalb tragen die Angaben,
     wozu sie gehören. */
  const ARTEN = [
    { id: "keine", de: "", it: "" },
    { id: "gern", de: "gern", it: "volentieri", nurTaetigkeit: true },
    { id: "schnell", de: "schnell", it: "in fretta", nurTaetigkeit: true },
    { id: "langsam", de: "langsam", it: "lentamente", nurTaetigkeit: true },
    { id: "zusammen", de: "zusammen", it: "insieme" },
    { id: "allein", de: "allein", it: "da solo", itAngleichen: true },
    { id: "ruhig", de: "in Ruhe", it: "con calma", nurTaetigkeit: true },
    { id: "gut", de: "gut", it: "bene", nurTaetigkeit: true },
    { id: "zufuss", de: "zu Fuß", it: "a piedi", nurBewegung: true },
    { id: "mitdemzug", de: "mit dem Zug", it: "in treno", nurBewegung: true },
    { id: "mitdembus", de: "mit dem Bus", it: "in autobus", nurBewegung: true },
    { id: "mitdemrad", de: "mit dem Fahrrad", it: "in bicicletta", nurBewegung: true },
  ];
  const ZUSTANDSVERBEN = ["sein", "haben", "wohnen"];
  function artenFuer(verb) {
    if (!verb) return ARTEN;
    const bewegung = verb.ortRolle === "wohin" || verb.ortRolle === "woher";
    const zustand = ZUSTANDSVERBEN.includes(verb.id);
    return ARTEN.filter((a) => {
      if (a.nurBewegung && !bewegung) return false;
      if (a.nurTaetigkeit && zustand) return false;
      return true;
    });
  }

  const KATEGORIEN = [
    { id: "alltag", name: "Haushalt & Alltag", icon: "🏠" },
    { id: "einkaufen", name: "Einkaufen", icon: "🛒" },
    { id: "arbeit", name: "Arbeit & Beruf", icon: "💼" },
    { id: "familie", name: "Familie & Freunde", icon: "👨‍👩‍👧" },
    { id: "freizeit", name: "Freizeit", icon: "⚽" },
    { id: "essen", name: "Essen & Trinken", icon: "🍽️" },
    { id: "reisen", name: "Reisen & Unterwegs", icon: "🧳" },
    { id: "bildung", name: "Schule & Lernen", icon: "🎓" },
    { id: "gesundheit", name: "Gesundheit", icon: "🩺" },
    { id: "verwaltung", name: "Amt & Papierkram", icon: "⚖️" },
  ];

  const NIVEAU_REIHE = ["A1", "A2", "B1", "B2", "C1", "C2"];
  function passtZumNiveau(eintrag, level) {
    if (!level || !eintrag.level) return true;
    return NIVEAU_REIHE.indexOf(eintrag.level) <= NIVEAU_REIHE.indexOf(level);
  }

  /* ===================================================================
     6. DER SATZBAU SELBST
     ===================================================================
     wahl = { subjekt, verb, objekt, person, ort, zeit, art,
              zeitform: "praesens"|"perfekt"|"futur",
              satzart: "aussage"|"frage"|"nebensatz" }
     Zurück kommt der Satz in beiden Sprachen, dazu die Teile einzeln,
     damit die Oberfläche sie einfärben kann.
     =================================================================== */
  const FORM_INDEX = { "1sg": 0, "2sg": 1, "3sgm": 2, "3sgf": 2, "1pl": 3, "2pl": 4, "3pl": 5 };

  function deutschesPartizip(verb) { return verb.partizip; }

  function itPartizip(verb, subjekt) {
    if (verb.itHilf === "avere") return verb.itPart;
    const s = verb.itPart;
    if (subjekt.id === "3sgm") return s + "o";
    if (subjekt.id === "3sgf") return s + "a";
    if (subjekt.zahl === "sg") return s + "o/" + s + "a";
    return s + "i/" + s + "e";
  }
  function itHilfsform(verb, subjekt) {
    const i = FORM_INDEX[subjekt.id];
    return (verb.itHilf === "essere" ? ["sono", "sei", "è", "siamo", "siete", "sono"] : ["ho", "hai", "ha", "abbiamo", "avete", "hanno"])[i];
  }
  // Einfaches Futur im Italienischen — regelmäßig gebildet, das reicht für
  // den Baukasten und ist für Lernende die nützlichste Form.
  const IT_FUTUR_ENDUNG = ["ò", "ai", "à", "emo", "ete", "anno"];
  /* Der Futurstamm steht bei jedem Verb ausdrücklich im Datensatz. Aus dem
     Infinitiv ableiten geht bei den regelmäßigen Verben, geht aber bei genau
     den häufigsten schief: vedere → vedrò (nicht „vederò“), bere → berrò,
     venire → verrò. Deshalb wird geraten hier gar nicht erst versucht. */
  function itFutur(verb, subjekt) {
    const i = FORM_INDEX[subjekt.id];
    let stamm = verb.itFutStamm;
    if (!stamm) {
      const inf = verb.itInf;
      if (/are$/.test(inf)) stamm = inf.replace(/are$/, "er");
      else if (/ere$/.test(inf)) stamm = inf.replace(/ere$/, "er");
      else stamm = inf.replace(/ire$/, "ir");
    }
    return stamm + IT_FUTUR_ENDUNG[i];
  }

  function bauSatz(wahl) {
    const subjekt = wahl.subjekt;
    const verb = wahl.verb;
    const i = FORM_INDEX[subjekt.id];
    const zeitform = wahl.zeitform || "praesens";
    const satzart = wahl.satzart || "aussage";

    /* ---- Mittelfeld: WANN, WIE, WEN/WAS, WO ----
       Deutsche Regel im Mittelfeld: Zeit vor Art vor Ort („Te-Ka-Mo-Lo“),
       das Objekt steht bei Nomen dahinter. Genau daran scheitern
       Lernende — deshalb baut das Modul es immer gleich richtig. */
    const deTeile = [];
    const itTeile = [];

    if (wahl.zeit && wahl.zeit.de) deTeile.push({ t: wahl.zeit.de, rolle: "wann" });
    if (wahl.art && wahl.art.de) deTeile.push({ t: wahl.art.de, rolle: "wie" });

    /* Verben wie „sehen“ oder „verstehen“ können ein Ding ODER eine Person
       als Objekt haben — nie beides nebeneinander. Sonst entstand
       „das Foto meinen Bruder sehen“. Steht beides zur Wahl, gewinnt die
       Person, weil sie die speziellere Angabe ist. */
    const nurEines = Boolean(verb.objekt) && Boolean(verb.personFall) && !verb.personPraep;
    const zeigeObjekt = wahl.objekt && !(nurEines && wahl.person);
    if (zeigeObjekt) {
      const fall = verb.objekt || "akk";
      deTeile.push({ t: nominalgruppe(wahl.objekt, fall, wahl.objekt.begleiter), rolle: "was" });
    }
    if (wahl.person) {
      const fall = verb.personFall || "akk";
      const kern = nominalgruppe(wahl.person, fall, subjekt.possessiv === "mein" ? "mein" : "mein");
      deTeile.push({ t: verb.personPraep ? verb.personPraep + " " + kern : kern, rolle: "wen" });
    }
    if (wahl.ort) {
      deTeile.push({ t: ortsform(wahl.ort, verb.ortRolle || "wo"), rolle: verb.ortRolle === "wohin" ? "wohin" : verb.ortRolle === "woher" ? "woher" : "wo" });
    }

    // Italienisch: Zeitangabe vorn oder hinten, Objekt direkt hinter dem Verb.
    // Im Italienischen stehen Zeitpunkt-Angaben vorn („Oggi vado …“),
    // Häufigkeitsangaben dagegen direkt hinter dem Verb („Aspetto sempre …“) —
    // am Satzende klingen sie nachgeschoben und falsch.
    const IT_ZEIT_VORNE = ["oggi", "domani", "ieri", "la mattina", "la sera", "il lunedì", "il fine settimana", "la settimana scorsa", "la prossima settimana"];
    const IT_BEIM_VERB = ["sempre", "spesso", "a volte", "adesso", "ogni giorno"];
    const itVorne = wahl.zeit && wahl.zeit.it && IT_ZEIT_VORNE.includes(wahl.zeit.it);
    const itBeimVerb = wahl.zeit && wahl.zeit.it && IT_BEIM_VERB.includes(wahl.zeit.it);
    if (zeigeObjekt) itTeile.push({ t: wahl.objekt.it, rolle: "was" });
    if (wahl.person) itTeile.push({ t: wahl.person[verb.itPersonFeld || "it"] || wahl.person.it, rolle: "wen" });
    if (wahl.ort) {
      // Im Italienischen ändert sich der Ort nur bei „woher“ — „al mare“ gilt
      // für „ich bin dort“ wie für „ich fahre hin“, aber wer von dort kommt,
      // kommt „dal mare“.
      const itOrt = verb.ortRolle === "woher" ? (wahl.ort.itWoher || wahl.ort.it) : wahl.ort.it;
      itTeile.push({ t: itOrt, rolle: verb.ortRolle === "woher" ? "woher" : "wo" });
    }

    if (wahl.zeit && wahl.zeit.it && !itVorne && !itBeimVerb) itTeile.push({ t: wahl.zeit.it, rolle: "wann" });

    // ---- Verbformen ----
    let deFinit, dePartizip = "", deInfinitiv = "";
    if (zeitform === "perfekt") {
      deFinit = (verb.hilfsverb === "sein" ? ["bin", "bist", "ist", "sind", "seid", "sind"] : ["habe", "hast", "hat", "haben", "habt", "haben"])[i];
      dePartizip = deutschesPartizip(verb);
    } else if (zeitform === "futur") {
      deFinit = ["werde", "wirst", "wird", "werden", "werdet", "werden"][i];
      deInfinitiv = verb.inf;
    } else {
      deFinit = verb.formen[i];
    }
    let itVerb;
    if (zeitform === "perfekt") itVerb = itHilfsform(verb, subjekt) + " " + itPartizip(verb, subjekt);
    else if (zeitform === "futur") itVerb = itFutur(verb, subjekt);
    else itVerb = verb.itFormen[i];

    // ---- Zusammensetzen: Deutsch ----
    const deSubjekt = subjekt.de;
    let de = [];
    let hinweis = "";
    if (satzart === "frage") {
      de = [{ t: deFinit, rolle: "verb" }, { t: deSubjekt, rolle: "wer" }, ...deTeile];
      hinweis = "In der Ja-Nein-Frage steht das gebeugte Verb ganz vorn.";
    } else if (satzart === "nebensatz") {
      de = [{ t: "weil", rolle: "konj" }, { t: deSubjekt, rolle: "wer" }, ...deTeile];
      hinweis = "Im Nebensatz mit „weil“ rutscht das gebeugte Verb ganz ans Ende.";
    } else {
      de = [{ t: deSubjekt, rolle: "wer" }, { t: deFinit, rolle: "verb" }, ...deTeile];
      hinweis = "In der Aussage steht das gebeugte Verb an zweiter Stelle.";
    }
    // Zweiter Verbteil ans Ende — im Nebensatz noch hinter das Partizip.
    if (satzart === "nebensatz") {
      if (dePartizip) de.push({ t: dePartizip, rolle: "verb" });
      if (deInfinitiv) de.push({ t: deInfinitiv, rolle: "verb" });
      de.push({ t: deFinit, rolle: "verb" });
      de = de.filter((x, idx) => !(idx === 1 && x.t === deFinit && x.rolle === "verb"));
      // Das finite Verb steht im Nebensatz nur einmal — ganz hinten.
      de = [{ t: "weil", rolle: "konj" }, { t: deSubjekt, rolle: "wer" }, ...deTeile];
      if (dePartizip) de.push({ t: dePartizip, rolle: "verb" });
      if (deInfinitiv) de.push({ t: deInfinitiv, rolle: "verb" });
      de.push({ t: deFinit, rolle: "verb" });
    } else {
      if (dePartizip) de.push({ t: dePartizip, rolle: "verb" });
      if (deInfinitiv) de.push({ t: deInfinitiv, rolle: "verb" });
    }

    // ---- Zusammensetzen: Italienisch ----
    const it = [];
    if (itVorne) it.push({ t: wahl.zeit.it, rolle: "wann" });
    if (wahl.pronomen) it.push({ t: subjekt.it, rolle: "wer" });
    it.push({ t: itVerb, rolle: "verb" });
    if (itBeimVerb) it.push({ t: wahl.zeit.it, rolle: "wann" });
    // „bene“, „volentieri“, „in fretta“ stehen im Italienischen beim Verb,
    // nicht am Satzende — „legge bene al mare“, nicht „legge al mare bene“.
    if (wahl.art && wahl.art.it) {
      // „da solo“ richtet sich nach der Person: da sola, da soli, da sole.
      let artIt = wahl.art.it;
      if (wahl.art.itAngleichen) {
        if (subjekt.id === "3sgf") artIt = "da sola";
        else if (subjekt.zahl === "pl") artIt = "da soli/e";
        else if (subjekt.id !== "3sgm") artIt = "da solo/a";
      }
      it.push({ t: artIt, rolle: "wie" });
    }
    itTeile.forEach((x) => it.push(x));

    const deText = de.map((x) => x.t).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    const itText = it.map((x) => x.t).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    const schluss = satzart === "frage" ? "?" : satzart === "nebensatz" ? " …" : ".";
    return {
      de: deText.charAt(0).toUpperCase() + deText.slice(1) + schluss,
      it: itText.charAt(0).toUpperCase() + itText.slice(1) + schluss,
      deTeile: de, itTeile: it, hinweis, zeitform, satzart,
    };
  }

  /* ===================================================================
     7. AUSWAHL-HILFEN für die Oberfläche
     =================================================================== */
  function verbenFuer(kategorie, level) {
    return VERBEN.filter((v) => (!kategorie || (v.kategorien || []).includes(kategorie)));
  }
  function orteFuer(kategorie, level) {
    return ORTE.filter((o) => (!kategorie || o.kategorie === kategorie) && passtZumNiveau(o, level));
  }
  function dingeFuer(verb, kategorie, level) {
    const rollen = verb && verb.objektRollen;
    return DINGE.filter((d) => {
      if (rollen && !(d.rollen || []).some((r) => rollen.includes(r))) return false;
      if (kategorie && d.kategorie !== kategorie) return false;
      return passtZumNiveau(d, level);
    });
  }
  function personenFuer(kategorie, level) {
    return PERSONEN.filter((p) => (!kategorie || p.kategorie === kategorie) && passtZumNiveau(p, level));
  }
  function zeitenFuer(zeitform) {
    return ZEITEN.filter((z) => {
      if (z.nurVergangenheit && zeitform !== "perfekt") return false;
      if (z.nurZukunft && zeitform === "perfekt") return false;
      if (z.nurGegenwart && zeitform !== "praesens") return false;
      return true;
    });
  }

  // Wie viele sinnvolle Sätze eine Kategorie hergibt — für die Anzeige
  // „so viele Beispiele stecken hier drin“.
  function anzahlBeispiele(kategorie, level) {
    let summe = 0;
    verbenFuer(kategorie, level).forEach((v) => {
      const orte = v.ortRolle ? orteFuer(kategorie, level).length + 1 : 1;
      const dinge = v.objekt ? dingeFuer(v, null, level).length + 1 : 1;
      const personen = v.personFall ? personenFuer(null, level).length + 1 : 1;
      summe += orte * dinge * personen;
    });
    return summe * zeitenFuer("praesens").length;
  }

  window.Satzbau = {
    ORTE, DINGE, PERSONEN, SUBJEKTE, VERBEN, ZEITEN, ARTEN, KATEGORIEN,
    bauSatz, ortsform, nominalgruppe, verschmelze,
    verbenFuer, orteFuer, dingeFuer, personenFuer, zeitenFuer, artenFuer, anzahlBeispiele,
    WECHSEL, NUR_DATIV, NUR_AKKUSATIV,
  };
})();
