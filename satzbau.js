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
      ortRolle: "wo", objekt: null, passtOrte: ["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","arzt","krankenhaus","zahnarzt","amt","bank","post"], passtDinge: [], passtPersonen: [], itInf: "essere", itFormen: ["sono", "sei", "è", "siamo", "siete", "sono"], itHilf: "essere", itFutStamm: "sar", itPart: "stat", kategorien: ["alltag", "arbeit", "freizeit", "reisen", "bildung", "gesundheit"] },
    { id: "gehen", inf: "gehen", formen: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"], hilfsverb: "sein", partizip: "gegangen",
      ortRolle: "wohin", objekt: null, passtOrte: ["zuhause","garten","bett","keller","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","arzt","krankenhaus","zahnarzt","amt","bank","post","stadt"], passtDinge: [], passtPersonen: [], itInf: "andare", itFormen: ["vado", "vai", "va", "andiamo", "andate", "vanno"], itHilf: "essere", itFutStamm: "andr", itPart: "andat", kategorien: ["alltag", "arbeit", "freizeit", "reisen", "bildung", "gesundheit", "einkaufen"] },
    { id: "fahren", inf: "fahren", formen: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], hilfsverb: "sein", partizip: "gefahren",
      ortRolle: "wohin", objekt: null, passtOrte: ["zuhause","supermarkt","markt","kaufhaus","arbeit","buero","baustelle","uni","meer","berge","see","stadion","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","krankenhaus"], passtDinge: [], passtPersonen: [], itInf: "andare", itFormen: ["vado", "vai", "va", "andiamo", "andate", "vanno"], itHilf: "essere", itFutStamm: "andr", itPart: "andat", kategorien: ["reisen", "arbeit", "freizeit"] },
    { id: "kommen", inf: "kommen", formen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], hilfsverb: "sein", partizip: "gekommen",
      ortRolle: "woher", objekt: null, passtOrte: ["zuhause","arbeit","buero","schule","uni","bibliothek","kurs","supermarkt","markt","baeckerei","meer","berge","kino","theater","restaurant","cafe","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","arzt","krankenhaus","amt","bank","post"], passtDinge: [], passtPersonen: [], itInf: "venire", itFormen: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], itHilf: "essere", itFutStamm: "verr", itPart: "venut", kategorien: ["reisen", "alltag", "arbeit"] },
    { id: "wohnen", inf: "wohnen", formen: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"], hilfsverb: "haben", partizip: "gewohnt",
      ortRolle: "wo", objekt: null, passtOrte: ["berlin","rom","italien","stadt","land","meer","berge"], passtDinge: [], passtPersonen: [], itInf: "abitare", itFormen: ["abito", "abiti", "abita", "abitiamo", "abitate", "abitano"], itHilf: "avere", itFutStamm: "abiter", itPart: "abitato", kategorien: ["alltag", "reisen"] },
    { id: "arbeiten", inf: "arbeiten", formen: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"], hilfsverb: "haben", partizip: "gearbeitet",
      ortRolle: "wo", objekt: null, passtOrte: ["zuhause","buero","werkstatt","baustelle","garten","kueche","bibliothek","schule","uni","krankenhaus","restaurant","cafe","supermarkt","baeckerei","apotheke","kaufhaus","amt","bank","post","hotel"], passtDinge: [], passtPersonen: [], itInf: "lavorare", itFormen: ["lavoro", "lavori", "lavora", "lavoriamo", "lavorate", "lavorano"], itHilf: "avere", itFutStamm: "lavorer", itPart: "lavorato", kategorien: ["arbeit"] },
    { id: "essen", inf: "essen", formen: ["esse", "isst", "isst", "essen", "esst", "essen"], hilfsverb: "haben", partizip: "gegessen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["essen"], passtOrte: ["zuhause","kueche","garten","balkon","restaurant","cafe","kantine","buero","park","meer","hotel"], passtDinge: ["brot","apfel","pizza","suppe","kuchen","nudeln"], passtPersonen: [], itInf: "mangiare", itFormen: ["mangio", "mangi", "mangia", "mangiamo", "mangiate", "mangiano"], itHilf: "avere", itFutStamm: "manger", itPart: "mangiato", kategorien: ["essen", "alltag"] },
    { id: "trinken", inf: "trinken", formen: ["trinke", "trinkst", "trinkt", "trinken", "trinkt", "trinken"], hilfsverb: "haben", partizip: "getrunken",
      ortRolle: "wo", objekt: "akk", objektRollen: ["trinken"], passtOrte: ["zuhause","kueche","garten","balkon","restaurant","cafe","kantine","buero","park","hotel"], passtDinge: ["kaffee","tee","wasser","wein"], passtPersonen: [], itInf: "bere", itFormen: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"], itHilf: "avere", itFutStamm: "berr", itPart: "bevuto", kategorien: ["essen"] },
    { id: "kochen", inf: "kochen", formen: ["koche", "kochst", "kocht", "kochen", "kocht", "kochen"], hilfsverb: "haben", partizip: "gekocht",
      ortRolle: "wo", objekt: "akk", objektPflicht: true, objektRollen: ["kochen"], passtOrte: ["zuhause","kueche","garten"], passtDinge: ["suppe","nudeln","kuchen","pizza"], passtPersonen: [], itInf: "cucinare", itFormen: ["cucino", "cucini", "cucina", "cuciniamo", "cucinate", "cucinano"], itHilf: "avere", itFutStamm: "cuciner", itPart: "cucinato", kategorien: ["essen", "alltag"] },
    { id: "kaufen", inf: "kaufen", formen: ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"], hilfsverb: "haben", partizip: "gekauft",
      ortRolle: "wo", objekt: "akk", objektPflicht: true, objektRollen: ["kaufen"], passtOrte: ["supermarkt","markt","baeckerei","apotheke","kaufhaus","stadt","italien"], passtDinge: ["brot","apfel","kuchen","kaffee","tee","wein","buch","zeitung"], passtPersonen: [], itInf: "comprare", itFormen: ["compro", "compri", "compra", "compriamo", "comprate", "comprano"], itHilf: "avere", itFutStamm: "comprer", itPart: "comprato", kategorien: ["einkaufen"] },
    { id: "lesen", inf: "lesen", formen: ["lese", "liest", "liest", "lesen", "lest", "lesen"], hilfsverb: "haben", partizip: "gelesen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["lesen"], passtOrte: ["zuhause","bett","garten","balkon","wohnzimmer","bibliothek","buero","cafe","park","meer","hotel","bahnhof"], passtDinge: ["buch","zeitung","brief","nachricht","bericht","mail","vertrag"], passtPersonen: [], itInf: "leggere", itFormen: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"], itHilf: "avere", itFutStamm: "legger", itPart: "letto", kategorien: ["bildung", "freizeit", "arbeit"] },
    { id: "schreiben", inf: "schreiben", formen: ["schreibe", "schreibst", "schreibt", "schreiben", "schreibt", "schreiben"], hilfsverb: "haben", partizip: "geschrieben",
      ortRolle: "wo", objekt: "akk", objektRollen: ["schreiben"], personPraep: "an", personFall: "akk", passtOrte: ["zuhause","buero","bibliothek","schule","uni","cafe","amt"], passtDinge: ["brief","nachricht","bericht","mail","antrag","buch"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","chef","lehrerin"], itInf: "scrivere", itFormen: ["scrivo", "scrivi", "scrive", "scriviamo", "scrivete", "scrivono"], itHilf: "avere", itFutStamm: "scriver", itPart: "scritto", itPersonFeld: "itAn", kategorien: ["arbeit", "bildung", "verwaltung"] },
    { id: "sehen", inf: "sehen", formen: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"], hilfsverb: "haben", partizip: "gesehen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["sehen"], personFall: "akk", passtOrte: ["zuhause","wohnzimmer","kino","theater","museum","stadion","park","stadt"], passtDinge: ["film","foto"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","kind"], itInf: "vedere", itFormen: ["vedo", "vedi", "vede", "vediamo", "vedete", "vedono"], itHilf: "avere", itFutStamm: "vedr", itPart: "visto", kategorien: ["freizeit", "familie"] },
    { id: "hoeren", inf: "hören", formen: ["höre", "hörst", "hört", "hören", "hört", "hören"], hilfsverb: "haben", partizip: "gehört",
      ortRolle: "wo", objekt: "akk", objektRollen: ["hoeren"], personFall: "akk", passtOrte: ["zuhause","wohnzimmer","garten","balkon","buero","park","konzert"], passtDinge: ["musik"], passtPersonen: ["freund","freundin","lehrerin","kind"], itInf: "ascoltare", itFormen: ["ascolto", "ascolti", "ascolta", "ascoltiamo", "ascoltate", "ascoltano"], itHilf: "avere", itFutStamm: "ascolter", itPart: "ascoltato", kategorien: ["freizeit"] },
    { id: "spielen", inf: "spielen", formen: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"], hilfsverb: "haben", partizip: "gespielt",
      ortRolle: "wo", objekt: "akk", objektRollen: ["spielen"], passtOrte: ["zuhause","wohnzimmer","garten","park","schule","stadion","schwimmbad"], passtDinge: ["fussball","klavier","karten","musik"], passtPersonen: [], itInf: "giocare", itFormen: ["gioco", "giochi", "gioca", "giochiamo", "giocate", "giocano"], itHilf: "avere", itFutStamm: "giocher", itPart: "giocato", kategorien: ["freizeit"] },
    { id: "lernen", inf: "lernen", formen: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"], hilfsverb: "haben", partizip: "gelernt",
      ortRolle: "wo", objekt: "akk", objektRollen: ["lernen"], passtOrte: ["zuhause","schule","uni","bibliothek","kurs","cafe","buero"], passtDinge: ["deutsch","italienisch"], passtPersonen: [], itInf: "studiare", itFormen: ["studio", "studi", "studia", "studiamo", "studiate", "studiano"], itHilf: "avere", itFutStamm: "studier", itPart: "studiato", kategorien: ["bildung"] },
    { id: "sprechen", inf: "sprechen", formen: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"], hilfsverb: "haben", partizip: "gesprochen",
      ortRolle: "wo", objekt: "akk", objektRollen: ["sprechen"], personPraep: "mit", personFall: "dat", passtOrte: ["zuhause","buero","besprechung","schule","uni","kurs","cafe","amt","bank"], passtDinge: ["deutsch","italienisch"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin"], itInf: "parlare", itFormen: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"], itHilf: "avere", itFutStamm: "parler", itPart: "parlato", itPersonFeld: "itMit", kategorien: ["bildung", "arbeit", "familie"] },
    { id: "verstehen", inf: "verstehen", formen: ["verstehe", "verstehst", "versteht", "verstehen", "versteht", "verstehen"], hilfsverb: "haben", partizip: "verstanden",
      ortRolle: "wo", objekt: "akk", objektRollen: ["verstehen"], personFall: "akk", passtOrte: ["schule","uni","kurs","besprechung"], passtDinge: ["deutsch","italienisch"], passtPersonen: ["freund","freundin","eltern","kollege","chef","lehrerin","kind"], itInf: "capire", itFormen: ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"], itHilf: "avere", itFutStamm: "capir", itPart: "capito", kategorien: ["bildung", "familie"] },
    { id: "treffen", inf: "treffen", formen: ["treffe", "triffst", "trifft", "treffen", "trefft", "treffen"], hilfsverb: "haben", partizip: "getroffen",
      ortRolle: "wo", objekt: null, personFall: "akk", passtOrte: ["zuhause","cafe","restaurant","park","stadt","bahnhof","kino","buero","bibliothek"], passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin"], itInf: "incontrare", itFormen: ["incontro", "incontri", "incontra", "incontriamo", "incontrate", "incontrano"], itHilf: "avere", itFutStamm: "incontrer", itPart: "incontrato", kategorien: ["familie", "freizeit", "arbeit"] },
    { id: "helfen", inf: "helfen", formen: ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"], hilfsverb: "haben", partizip: "geholfen",
      ortRolle: "wo", objekt: null, personFall: "dat", passtOrte: ["zuhause","kueche","garten","buero","schule","werkstatt"], passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","kind"], itInf: "aiutare", itFormen: ["aiuto", "aiuti", "aiuta", "aiutiamo", "aiutate", "aiutano"], itHilf: "avere", itFutStamm: "aiuter", itPart: "aiutato", itPersonFeld: "it", kategorien: ["familie", "arbeit", "alltag"] },
    { id: "warten", inf: "warten", formen: ["warte", "wartest", "wartet", "warten", "wartet", "warten"], hilfsverb: "haben", partizip: "gewartet",
      ortRolle: "wo", objekt: null, personPraep: "auf", personFall: "akk", passtOrte: ["zuhause","bahnhof","flughafen","buero","cafe","park","krankenhaus","amt","bank","post"], passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","kind"], itInf: "aspettare", itFormen: ["aspetto", "aspetti", "aspetta", "aspettiamo", "aspettate", "aspettano"], itHilf: "avere", itFutStamm: "aspetter", itPart: "aspettato", itPersonFeld: "it", kategorien: ["alltag", "reisen", "familie"] },
    { id: "machen", inf: "machen", formen: ["mache", "machst", "macht", "machen", "macht", "machen"], hilfsverb: "haben", partizip: "gemacht",
      ortRolle: "wo", objekt: "akk", objektPflicht: true, objektRollen: ["machen"], passtOrte: ["zuhause","kueche","garten","buero"], passtDinge: ["fruehstueck","waesche","geschirr","einkauf","bett2","termin","foto","musik","antrag"], passtPersonen: [], itInf: "fare", itFormen: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"], itHilf: "avere", itFutStamm: "far", itPart: "fatto", kategorien: ["alltag", "arbeit", "freizeit"] },
    { id: "haben", inf: "haben", formen: ["habe", "hast", "hat", "haben", "habt", "haben"], hilfsverb: "haben", partizip: "gehabt",
      ortRolle: null, objekt: "akk", objektPflicht: true, objektRollen: ["haben"], passtOrte: [], passtDinge: ["zeit","hunger","durst","termin"], passtPersonen: [], itInf: "avere", itFormen: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"], itHilf: "avere", itFutStamm: "avr", itPart: "avuto", kategorien: ["alltag", "arbeit"] },
    { id: "schlafen", inf: "schlafen", formen: ["schlafe", "schläfst", "schläft", "schlafen", "schlaft", "schlafen"], hilfsverb: "haben", partizip: "geschlafen",
      ortRolle: "wo", objekt: null, passtOrte: ["zuhause","bett","wohnzimmer","garten","hotel"], passtDinge: [], passtPersonen: [], itInf: "dormire", itFormen: ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"], itHilf: "avere", itFutStamm: "dormir", itPart: "dormito", kategorien: ["alltag", "reisen"] },
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
  /* Art und Weise. Auch hier steht ausdrücklich dabei, zu welchen Verben eine
     Angabe passt — „gut“ geht mit sprechen und schlafen, nicht mit gehen;
     „mit dem Bus“ gehört zu einer Fahrt, nicht zu „einen Termin haben“;
     „langsam“ passt zu einer Tätigkeit, nicht zu „im Bett schlafen“.
     Vorher entschied eine grobe Faustregel darüber, und dabei entstanden
     Sätze wie „Ich bin am Abend gut gegangen“. */
  const ARTEN = [
    { id: "keine", de: "", it: "" },
    { id: "gern", de: "gern", it: "volentieri",
      passtVerben: ["essen", "trinken", "kochen", "lesen", "schreiben", "sehen", "hoeren", "spielen", "lernen", "sprechen", "treffen", "helfen", "machen", "gehen", "fahren", "kommen", "arbeiten", "wohnen", "schlafen"] },
    { id: "schnell", de: "schnell", it: "in fretta",
      passtVerben: ["essen", "trinken", "kochen", "lesen", "schreiben", "spielen", "lernen", "sprechen", "machen", "gehen", "fahren", "kommen", "arbeiten", "kaufen", "verstehen"] },
    { id: "langsam", de: "langsam", it: "lentamente",
      passtVerben: ["essen", "trinken", "lesen", "schreiben", "sprechen", "gehen", "fahren", "kommen", "arbeiten", "lernen"] },
    { id: "zusammen", de: "zusammen", it: "insieme",
      passtVerben: ["essen", "trinken", "kochen", "spielen", "lernen", "sprechen", "gehen", "fahren", "kommen", "arbeiten", "sehen", "hoeren", "machen", "warten", "sein", "wohnen", "kaufen", "lesen"] },
    { id: "allein", de: "allein", it: "da solo", itAngleichen: true,
      passtVerben: ["essen", "trinken", "kochen", "spielen", "lernen", "gehen", "fahren", "kommen", "arbeiten", "sehen", "machen", "warten", "sein", "wohnen", "kaufen", "lesen", "schlafen", "schreiben"] },
    { id: "ruhig", de: "in Ruhe", it: "con calma",
      passtVerben: ["essen", "trinken", "lesen", "schreiben", "sprechen", "arbeiten", "lernen", "kochen", "machen"] },
    { id: "gut", de: "gut", it: "bene",
      passtVerben: ["sprechen", "lesen", "schreiben", "kochen", "spielen", "verstehen", "lernen", "schlafen", "arbeiten", "essen", "sehen", "hoeren", "helfen"] },
    { id: "zufuss", de: "zu Fuß", it: "a piedi", passtVerben: ["gehen", "kommen"] },
    { id: "mitdemzug", de: "mit dem Zug", it: "in treno", passtVerben: ["fahren", "kommen"] },
    { id: "mitdembus", de: "mit dem Bus", it: "in autobus", passtVerben: ["fahren", "kommen", "gehen"] },
    { id: "mitdemrad", de: "mit dem Fahrrad", it: "in bicicletta", passtVerben: ["fahren", "kommen"] },
  ];
  function artenFuer(verb) {
    if (!verb) return ARTEN;
    return ARTEN.filter((a) => !a.passtVerben || a.passtVerben.includes(verb.id));
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
  /* ---------------------------------------------------------------
     AUSWAHL — ausdrückliche Listen statt Themen-Kombination
     ---------------------------------------------------------------
     Bis hierher wurde über gemeinsame Themen verbunden: trug ein Ort
     dasselbe Thema wie ein Verb, galt die Verbindung als möglich.
     Daraus entstand „einen Termin im Garten haben“ — beides trug
     „alltag“, zusammen ergab es nichts. Jetzt steht bei jedem Verb,
     welche Orte, Dinge und Personen wirklich dazugehören. Was dort
     nicht steht, lässt sich gar nicht erst bauen.
     --------------------------------------------------------------- */
  function verbenFuer(kategorie, level) {
    return VERBEN.filter((v) => (!kategorie || (v.kategorien || []).includes(kategorie)));
  }
  function orteFuer(kategorie, level, verb) {
    return ORTE.filter((o) => {
      if (verb && verb.passtOrte && !verb.passtOrte.includes(o.id)) return false;
      if (kategorie && o.kategorie !== kategorie) return false;
      return passtZumNiveau(o, level);
    });
  }
  function dingeFuer(verb, kategorie, level) {
    return DINGE.filter((d) => {
      if (verb && verb.passtDinge && !verb.passtDinge.includes(d.id)) return false;
      if (verb && !verb.passtDinge && verb.objektRollen && !(d.rollen || []).some((r) => verb.objektRollen.includes(r))) return false;
      if (kategorie && d.kategorie !== kategorie) return false;
      return passtZumNiveau(d, level);
    });
  }
  function personenFuer(kategorie, level, verb) {
    return PERSONEN.filter((p) => {
      if (verb && verb.passtPersonen && !verb.passtPersonen.includes(p.id)) return false;
      if (kategorie && p.kategorie !== kategorie) return false;
      return passtZumNiveau(p, level);
    });
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
      const orte = v.ortRolle ? orteFuer(kategorie, level, v).length + 1 : 1;
      const dinge = v.objekt ? dingeFuer(v, null, level).length + 1 : 1;
      const personen = v.personFall ? personenFuer(null, level, v).length + 1 : 1;
      summe += orte * dinge * personen;
    });
    return summe * zeitenFuer("praesens").length;
  }

  /* ============================================================
     GEPRÜFTE BEISPIELSÄTZE
     ------------------------------------------------------------
     Diese Sätze sind einzeln geschrieben und durchgesehen, nicht
     aus Bausteinen zusammengesetzt. Je Bereich 102 Stück, gleich
     verteilt über die sechs Niveaus, gemischt aus Aussagen, Fragen
     und Sätzen mit Nebensatz — und jeder mit seiner italienischen
     Entsprechung. Aufbau je Eintrag:
         [ deutscher Satz, italienischer Satz, Niveau, Satzart ]
     ============================================================ */
  const BEISPIELE = {
    "alltag": [
      ["Ich mache jetzt das Bett.","Ora faccio il letto.","A1","aussage"],
      ["Er wäscht das Geschirr.","Lui lava i piatti.","A1","aussage"],
      ["Wir putzen heute die Küche.","Oggi puliamo la cucina.","A1","aussage"],
      ["Sie kocht das Mittagessen.","Lei cucina il pranzo.","A1","aussage"],
      ["Ich räume mein Zimmer auf.","Metto in ordine la mia stanza.","A1","aussage"],
      ["Der Müll steht vor der Tür.","La spazzatura è davanti alla porta.","A1","aussage"],
      ["Meine Mutter bügelt die Hemden.","Mia madre stira le camicie.","A1","aussage"],
      ["Ich trinke morgens Kaffee.","La mattina bevo il caffè.","A1","aussage"],
      ["Das Bad ist sehr klein.","Il bagno è molto piccolo.","A1","aussage"],
      ["Er staubsaugt das Wohnzimmer.","Lui passa l'aspirapolvere in soggiorno.","A1","aussage"],
      ["Ich hänge die Wäsche auf.","Stendo il bucato.","A1","aussage"],
      ["Wo ist die Küche?","Dov'è la cucina?","A1","frage"],
      ["Wer macht heute den Abwasch?","Chi lava i piatti oggi?","A1","frage"],
      ["Isst du zu Hause?","Mangi a casa?","A1","frage"],
      ["Ich bin müde, aber ich koche noch.","Sono stanco, ma cucino ancora.","A1","aussage"],
      ["Ich esse gern, wenn das Essen warm ist.","Mi piace mangiare quando il cibo è caldo.","A1","nebensatz"],
      ["Ich schlafe, weil ich müde bin.","Dormo perché sono stanco.","A1","nebensatz"],
      ["Ich habe gestern die ganze Wohnung geputzt.","Ieri ho pulito tutto l'appartamento.","A2","aussage"],
      ["Meine Waschmaschine ist kaputt gegangen.","La mia lavatrice si è rotta.","A2","aussage"],
      ["Wir haben am Wochenende die Fenster geputzt.","Nel fine settimana abbiamo pulito le finestre.","A2","aussage"],
      ["Nach der Arbeit koche ich meistens schnell etwas.","Dopo il lavoro di solito cucino qualcosa in fretta.","A2","aussage"],
      ["Ich habe die Spülmaschine ausgeräumt.","Ho svuotato la lavastoviglie.","A2","aussage"],
      ["Mein Bruder hilft mir beim Saubermachen.","Mio fratello mi aiuta a fare le pulizie.","A2","aussage"],
      ["Wir haben neue Vorhänge fürs Wohnzimmer gekauft.","Abbiamo comprato nuove tende per il soggiorno.","A2","aussage"],
      ["Ich habe vergessen, den Müll rauszubringen.","Ho dimenticato di portare fuori la spazzatura.","A2","aussage"],
      ["Am Morgen mache ich zuerst mein Bett.","La mattina rifaccio subito il letto.","A2","aussage"],
      ["Der Staubsauger macht komische Geräusche.","L'aspirapolvere fa un rumore strano.","A2","aussage"],
      ["Ich habe die Blumen auf dem Balkon gegossen.","Ho innaffiato i fiori sul balcone.","A2","aussage"],
      ["Hast du schon das Bad geputzt?","Hai già pulito il bagno?","A2","frage"],
      ["Wann bringst du den Müll raus?","Quando porti fuori la spazzatura?","A2","frage"],
      ["Kannst du mir beim Abwasch helfen?","Puoi aiutarmi a lavare i piatti?","A2","frage"],
      ["Ich mache das Fenster zu, weil es draußen kalt ist.","Chiudo la finestra perché fuori fa freddo.","A2","nebensatz"],
      ["Ich glaube, dass die Waschmaschine kaputt ist.","Credo che la lavatrice sia rotta.","A2","nebensatz"],
      ["Bevor ich koche, räume ich die Küche auf.","Prima di cucinare, metto in ordine la cucina.","A2","nebensatz"],
      ["Wenn ich Zeit habe, werde ich am Wochenende den Keller aufräumen.","Se avrò tempo, il fine settimana metterò in ordine la cantina.","B1","aussage"],
      ["Seit wir umgezogen sind, kochen wir viel öfter selbst.","Da quando ci siamo trasferiti, cuciniamo molto più spesso noi stessi.","B1","aussage"],
      ["Ich habe mir vorgenommen, jeden Abend die Küche aufzuräumen.","Mi sono ripromesso di riordinare la cucina ogni sera.","B1","aussage"],
      ["Nachdem der Handwerker die Heizung repariert hatte, war es endlich wieder warm.","Dopo che l'idraulico aveva riparato il riscaldamento, finalmente si tornò ad avere caldo.","B1","aussage"],
      ["Meine Nachbarin gießt meine Pflanzen, während ich im Urlaub bin.","La mia vicina innaffia le mie piante mentre sono in vacanza.","B1","aussage"],
      ["Ich werde diese Woche endlich den Schrank neu sortieren.","Questa settimana metterò finalmente in ordine l'armadio.","B1","aussage"],
      ["Obwohl ich müde war, habe ich noch schnell die Wäsche gewaschen.","Anche se ero stanco, ho comunque fatto in fretta il bucato.","B1","aussage"],
      ["Bis der Gast kommt, muss ich noch das ganze Haus aufräumen.","Prima che arrivi l'ospite, devo ancora riordinare tutta la casa.","B1","aussage"],
      ["Wir teilen uns die Hausarbeit schon seit Jahren gerecht auf.","Ci dividiamo equamente le faccende domestiche già da anni.","B1","aussage"],
      ["Sobald ich das Geschirr gespült habe, mache ich es mir auf dem Sofa gemütlich.","Non appena ho lavato i piatti, mi metto comodo sul divano.","B1","aussage"],
      ["Der Vermieter hat versprochen, die alten Rohre bald auszutauschen.","Il proprietario ha promesso di sostituire presto le vecchie tubature.","B1","aussage"],
      ["Warum dauert es bei dir immer so lange, die Wohnung aufzuräumen?","Perché ci metti sempre così tanto a mettere in ordine casa?","B1","frage"],
      ["Weißt du, wo ich den Ersatzschlüssel für die Wohnung finde?","Sai dove trovo la copia delle chiavi di casa?","B1","frage"],
      ["Hättest du Lust, mir beim Umräumen der Küche zu helfen?","Avresti voglia di aiutarmi a riorganizzare la cucina?","B1","frage"],
      ["Ich bleibe heute zu Hause, weil ich noch die Wäsche machen muss.","Oggi resto a casa perché devo ancora fare il bucato.","B1","nebensatz"],
      ["Sobald der Handwerker fertig ist, kann ich endlich wieder duschen.","Non appena l'idraulico avrà finito, potrò finalmente fare di nuovo la doccia.","B1","nebensatz"],
      ["Ich habe vergessen, wo ich den Staubsauger hingestellt habe.","Ho dimenticato dove ho messo l'aspirapolvere.","B1","nebensatz"],
      ["Die Wohnung wird nächste Woche komplett renoviert.","L'appartamento sarà completamente ristrutturato la prossima settimana.","B2","aussage"],
      ["An unserem Vorhaben, endlich den Dachboden zu entrümpeln, scheitern wir seit Jahren.","Il nostro proposito di sgomberare finalmente la soffitta fallisce ormai da anni.","B2","aussage"],
      ["Hätte ich mehr Zeit, würde ich mich um den verwilderten Garten kümmern.","Se avessi più tempo, mi occuperei del giardino incolto.","B2","aussage"],
      ["Die Nebenkosten für unsere Wohnung sind im letzten Jahr spürbar gestiegen.","Le spese condominiali del nostro appartamento sono aumentate sensibilmente lo scorso anno.","B2","aussage"],
      ["Bei uns wird die Hausarbeit — anders als früher — inzwischen gleichmäßig aufgeteilt.","Da noi le faccende domestiche vengono ormai divise equamente, diversamente da un tempo.","B2","aussage"],
      ["Die defekte Heizung wurde erst nach mehrfacher Reklamation ausgetauscht.","Il riscaldamento guasto è stato sostituito solo dopo diversi solleciti.","B2","aussage"],
      ["Es wäre höchste Zeit, dass wir uns von den alten Möbeln trennen.","Sarebbe ora di liberarci dei vecchi mobili.","B2","aussage"],
      ["Unser Haushalt läuft nur deshalb reibungslos, weil wir feste Aufgaben verteilt haben.","La nostra casa funziona senza intoppi solo perché abbiamo assegnato compiti fissi.","B2","aussage"],
      ["Die neue Spülmaschine verbraucht deutlich weniger Wasser als die alte.","La nuova lavastoviglie consuma decisamente meno acqua di quella vecchia.","B2","aussage"],
      ["Man sollte meinen, dass sich das Putzen mit den Jahren leichter anfühlt — bei mir ist das Gegenteil der Fall.","Si potrebbe pensare che pulire diventi più facile con gli anni — per me vale il contrario.","B2","aussage"],
      ["Falls der Handwerker doch noch absagt, müssen wir die Renovierung verschieben.","Nel caso in cui l'idraulico dovesse ancora disdire, dovremo rimandare la ristrutturazione.","B2","aussage"],
      ["Wie stellst du dir vor, dass wir den ganzen Umzug an einem Tag schaffen?","Come pensi che riusciremo a fare tutto il trasloco in un solo giorno?","B2","frage"],
      ["Wäre es nicht sinnvoller, die Reinigung gleich an eine Firma zu vergeben?","Non sarebbe più sensato affidare subito le pulizie a una ditta?","B2","frage"],
      ["Inwiefern hat sich euer Alltag verändert, seit ihr in die neue Wohnung gezogen seid?","In che misura è cambiata la vostra quotidianità da quando vi siete trasferiti nel nuovo appartamento?","B2","frage"],
      ["Obwohl die Wohnung frisch renoviert worden war, fühlte sie sich merkwürdig unpersönlich an.","Sebbene l'appartamento fosse stato appena ristrutturato, risultava stranamente impersonale.","B2","nebensatz"],
      ["Da die Waschmaschine repariert werden musste, stapelte sich die schmutzige Wäsche eine ganze Woche lang.","Poiché la lavatrice doveva essere riparata, i panni sporchi si sono accumulati per un'intera settimana.","B2","nebensatz"],
      ["Nachdem wir monatelang über eine neue Küche diskutiert hatten, entschieden wir uns schließlich für ein schlichtes Modell.","Dopo aver discusso per mesi di una nuova cucina, alla fine ci siamo decisi per un modello semplice.","B2","nebensatz"],
      ["Ein aufgeräumter Haushalt trägt maßgeblich zum eigenen Wohlbefinden bei.","Una casa ordinata contribuisce in modo significativo al proprio benessere.","C1","aussage"],
      ["Die stille Verteilung der Hausarbeit spiegelt oft ungeschriebene Rollenbilder innerhalb einer Familie wider.","La tacita ripartizione delle faccende domestiche riflette spesso ruoli non scritti all'interno di una famiglia.","C1","aussage"],
      ["Trotz aller Bemühungen um Ordnung gerät der Alltag im Homeoffice zunehmend aus dem Ruder.","Nonostante tutti gli sforzi per mantenere l'ordine, la quotidianità in smart working sfugge sempre più al controllo.","C1","aussage"],
      ["Die energetische Sanierung des Hauses hat sich, alles in allem, gelohnt.","Tutto sommato, la riqualificazione energetica della casa è valsa la pena.","C1","aussage"],
      ["Es liegt mir fern, die Hausarbeit als Belastung darzustellen — sie kann durchaus auch beruhigend wirken.","Non è mia intenzione presentare le faccende domestiche come un peso — possono anche avere un effetto rilassante.","C1","aussage"],
      ["Die anfängliche Skepsis gegenüber der neuen Waschmaschine wich schon bald einer regelrechten Begeisterung.","L'iniziale scetticismo verso la nuova lavatrice lasciò presto il posto a un vero e proprio entusiasmo.","C1","aussage"],
      ["Angesichts steigender Energiepreise überdenken viele Haushalte ihren Umgang mit Strom und Wasser.","Di fronte all'aumento dei prezzi dell'energia, molte famiglie ripensano il proprio uso di elettricità e acqua.","C1","aussage"],
      ["Der vermeintlich banale Vorgang des Aufräumens entpuppt sich bei näherem Hinsehen als eine Frage der Lebensordnung.","Il procedimento apparentemente banale del riordinare si rivela, a uno sguardo più attento, una questione di ordine esistenziale.","C1","aussage"],
      ["Man tut gut daran, Reparaturen im Haushalt nicht auf die lange Bank zu schieben.","Fa bene a non rimandare troppo a lungo le riparazioni domestiche.","C1","aussage"],
      ["Kaum ein Thema sorgt in Wohngemeinschaften so verlässlich für Reibung wie die Verteilung der Putzpflichten.","Difficilmente un altro tema genera altrettante frizioni negli appartamenti condivisi quanto la ripartizione dei compiti di pulizia.","C1","aussage"],
      ["Die Renovierung nahm — entgegen aller Erwartungen — kaum mehr Zeit in Anspruch als ursprünglich veranschlagt.","La ristrutturazione, contrariamente a ogni aspettativa, non ha richiesto molto più tempo del previsto.","C1","aussage"],
      ["Inwieweit lässt sich der häusliche Alltag überhaupt gerecht organisieren, ohne dass eine Seite sich benachteiligt fühlt?","Fino a che punto si può davvero organizzare in modo equo la vita domestica, senza che una parte si senta svantaggiata?","C1","frage"],
      ["Woran liegt es eigentlich, dass Ordnung halten manchen Menschen so viel leichter fällt als anderen?","Da cosa dipende in realtà il fatto che a certe persone riesca tanto più facile tenere in ordine rispetto ad altre?","C1","frage"],
      ["Ließe sich der Haushalt nicht effizienter organisieren, wenn wir klare Zuständigkeiten festlegten?","Non si potrebbe organizzare la casa in modo più efficiente se stabilissimo responsabilità chiare?","C1","frage"],
      ["Während viele den Frühjahrsputz als lästige Pflicht empfinden, betrachte ich ihn als willkommenen Neuanfang.","Mentre molti percepiscono le pulizie di primavera come un fastidioso dovere, io le considero un gradito nuovo inizio.","C1","nebensatz"],
      ["Da sich die Handwerkerkosten binnen weniger Jahre fast verdoppelt haben, verschieben viele Familien fällige Reparaturen.","Poiché i costi degli artigiani sono quasi raddoppiati nel giro di pochi anni, molte famiglie rimandano le riparazioni necessarie.","C1","nebensatz"],
      ["Wer glaubt, dass Ordnung allein eine Frage der Disziplin sei, unterschätzt oft die Rolle der äußeren Umstände.","Chi crede che l'ordine sia soltanto una questione di disciplina spesso sottovaluta il ruolo delle circostanze esterne.","C1","nebensatz"],
      ["Die vermeintliche Nebensächlichkeit häuslicher Routinen täuscht darüber hinweg, wie sehr sie unseren Tagesrhythmus prägen.","L'apparente marginalità delle routine domestiche fa dimenticare quanto in realtà plasmino il nostro ritmo quotidiano.","C2","aussage"],
      ["Zwischen dem Ideal des makellosen Zuhauses und der gelebten Wirklichkeit klafft bei den meisten Familien eine erhebliche Lücke.","Tra l'ideale della casa impeccabile e la realtà vissuta si apre, per la maggior parte delle famiglie, un divario considerevole.","C2","aussage"],
      ["So banal die Frage nach der Verteilung der Hausarbeit erscheinen mag, so viel verrät sie über das Machtgefüge einer Beziehung.","Per quanto banale possa sembrare la questione della ripartizione delle faccende domestiche, rivela moltissimo sugli equilibri di potere di una relazione.","C2","aussage"],
      ["Die Digitalisierung des Haushalts verspricht Entlastung, erzeugt jedoch nicht selten neue Formen unsichtbarer Mehrarbeit.","La digitalizzazione della casa promette di alleggerire il carico, ma non di rado genera nuove forme di lavoro invisibile.","C2","aussage"],
      ["Erst der Ausfall der Waschmaschine führte uns vor Augen, wie sehr wir uns an technischen Komfort gewöhnt hatten.","Solo il guasto della lavatrice ci ha mostrato quanto ci fossimo abituati alle comodità tecniche.","C2","aussage"],
      ["Ordnung im Haushalt zu halten, ist letztlich weniger eine Frage des Fleißes als vielmehr eine des Systems.","Mantenere l'ordine in casa è, in fondo, meno una questione di diligenza che di sistema.","C2","aussage"],
      ["Der Traum vom autarken Haushalt, der sich selbst versorgt und selbst instand hält, bleibt für die meisten von uns Utopie.","Il sogno della casa autosufficiente, capace di provvedere a sé stessa e mantenersi da sola, resta per la maggior parte di noi un'utopia.","C2","aussage"],
      ["Was als kurzer Frühjahrsputz gedacht war, entpuppte sich als wochenlanges Unterfangen mit ungeahnten Nebenwirkungen.","Quella che doveva essere una breve pulizia di primavera si è rivelata un'impresa di settimane, con effetti collaterali insospettati.","C2","aussage"],
      ["Die Rückkehr zum handwerklichen Reparieren statt zum Neukauf lässt sich durchaus als stille Kulturkritik lesen.","Il ritorno alla riparazione artigianale invece dell'acquisto di un nuovo prodotto può essere letto a tutti gli effetti come una silenziosa critica culturale.","C2","aussage"],
      ["Kein Wunder, dass ausgerechnet die unscheinbarsten Alltagsgegenstände am meisten über unsere Lebensform verraten.","Non stupisce che siano proprio gli oggetti quotidiani più insignificanti a rivelare di più sul nostro stile di vita.","C2","aussage"],
      ["Die vielbeschworene Rückbesinnung auf einfache Handarbeit im Haushalt entpuppt sich bei Licht besehen oft als Privileg derer, die es sich leisten können, Zeit dafür zu haben.","La tanto decantata riscoperta del lavoro manuale in casa si rivela, a un'analisi più attenta, spesso un privilegio di chi può permettersi di avere tempo per farlo.","C2","aussage"],
      ["Inwiefern lässt sich das Bedürfnis nach häuslicher Ordnung überhaupt von gesellschaftlichen Idealbildern trennen?","Fino a che punto il bisogno di ordine domestico può davvero essere separato dagli ideali imposti dalla società?","C2","frage"],
      ["Wäre es nicht an der Zeit, den Wert unbezahlter Hausarbeit endlich angemessen zu würdigen?","Non sarebbe ora di riconoscere finalmente in modo adeguato il valore del lavoro domestico non retribuito?","C2","frage"],
      ["Woran bemisst sich eigentlich, ob ein Zuhause als gemütlich oder als vernachlässigt wahrgenommen wird?","Da cosa dipende, in fondo, il fatto che una casa venga percepita come accogliente o come trascurata?","C2","frage"],
      ["So sehr man sich auch vornimmt, die Wohnung dauerhaft ordentlich zu halten, so schnell holt einen der Alltag wieder ein.","Per quanto ci si proponga di tenere la casa costantemente in ordine, altrettanto in fretta la quotidianità torna a riprendere il sopravvento.","C2","nebensatz"],
      ["Während die einen im minimalistischen Zuhause Freiheit erkennen, sehen andere darin bloß eine neue Form von Verzicht.","Mentre alcuni riconoscono nella casa minimalista una forma di libertà, altri vi vedono soltanto una nuova forma di rinuncia.","C2","nebensatz"],
      ["Obgleich die technischen Haushaltshilfen stetig ausgefeilter werden, scheint die gefühlte Arbeitsbelastung kaum abzunehmen.","Sebbene gli elettrodomestici diventino sempre più sofisticati, il carico di lavoro percepito sembra diminuire ben poco.","C2","nebensatz"]
    ],
    "einkaufen": [
      ["Ich kaufe Brot.","Compro il pane.","A1","aussage"],
      ["Der Apfel kostet einen Euro.","La mela costa un euro.","A1","aussage"],
      ["Wir brauchen Milch.","Ci serve il latte.","A1","aussage"],
      ["Sie bezahlt an der Kasse.","Lei paga alla cassa.","A1","aussage"],
      ["Der Markt ist heute geschlossen.","Il mercato oggi è chiuso.","A1","aussage"],
      ["Ich habe kein Kleingeld.","Non ho spiccioli.","A1","aussage"],
      ["Das Geschäft ist um die Ecke.","Il negozio è dietro l'angolo.","A1","aussage"],
      ["Ich nehme diese Tasche.","Prendo questa borsa.","A1","aussage"],
      ["Wir gehen zum Supermarkt.","Andiamo al supermercato.","A1","aussage"],
      ["Der Käse ist frisch.","Il formaggio è fresco.","A1","aussage"],
      ["Ich zahle mit Karte.","Pago con la carta.","A1","aussage"],
      ["Was kostet das?","Quanto costa?","A1","frage"],
      ["Haben Sie frisches Obst?","Avete frutta fresca?","A1","frage"],
      ["Wo ist die Kasse?","Dov'è la cassa?","A1","frage"],
      ["Ich kaufe Eier, weil ich einen Kuchen backe.","Compro le uova perché faccio una torta.","A1","nebensatz"],
      ["Ich brauche eine Tüte, weil ich viel gekauft habe.","Mi serve un sacchetto perché ho comprato tanto.","A1","nebensatz"],
      ["Ich gehe einkaufen, wenn der Kühlschrank leer ist.","Vado a fare la spesa quando il frigo è vuoto.","A1","nebensatz"],
      ["Ich habe gestern auf dem Wochenmarkt Gemüse gekauft.","Ieri ho comprato la verdura al mercato settimanale.","A2","aussage"],
      ["Die Preise sind in letzter Zeit stark gestiegen.","Ultimamente i prezzi sono aumentati molto.","A2","aussage"],
      ["Ich habe meine Einkaufsliste zu Hause vergessen.","Ho dimenticato la lista della spesa a casa.","A2","aussage"],
      ["Wir haben im Sonderangebot günstig Nudeln bekommen.","Abbiamo trovato la pasta in offerta a buon prezzo.","A2","aussage"],
      ["Ich habe das Hemd umgetauscht, weil es zu klein war.","Ho cambiato la camicia perché era troppo piccola.","A2","aussage"],
      ["Der Verkäufer hat mir sehr freundlich geholfen.","Il commesso mi ha aiutato in modo molto gentile.","A2","aussage"],
      ["Ich habe online neue Schuhe bestellt.","Ho ordinato online un paio di scarpe nuove.","A2","aussage"],
      ["An der Kasse war heute eine lange Schlange.","Oggi alla cassa c'era una fila lunga.","A2","aussage"],
      ["Ich habe den Kassenbon gleich weggeworfen.","Ho buttato subito lo scontrino.","A2","aussage"],
      ["Meine Schwester hat mir eine schöne Jacke geschenkt.","Mia sorella mi ha regalato una bella giacca.","A2","aussage"],
      ["Ich habe vergessen, den Rabattcode einzugeben.","Ho dimenticato di inserire il codice sconto.","A2","aussage"],
      ["Nimmst du Bargeld oder zahlst du mit Karte?","Prendi contanti o paghi con la carta?","A2","frage"],
      ["Wo hast du diese Schuhe gekauft?","Dove hai comprato queste scarpe?","A2","frage"],
      ["Kannst du mir sagen, ob es hier Rabatt gibt?","Puoi dirmi se qui c'è uno sconto?","A2","frage"],
      ["Ich kaufe das Kleid nicht, weil es mir zu teuer ist.","Non compro il vestito perché per me è troppo caro.","A2","nebensatz"],
      ["Ich glaube, dass der Laden schon geschlossen hat.","Credo che il negozio abbia già chiuso.","A2","nebensatz"],
      ["Bevor ich bezahle, prüfe ich immer den Kassenbon.","Prima di pagare controllo sempre lo scontrino.","A2","nebensatz"],
      ["Wenn das Angebot noch gilt, werde ich morgen gleich zwei Packungen kaufen.","Se l'offerta è ancora valida, domani ne comprerò subito due confezioni.","B1","aussage"],
      ["Seit der Laden um die Ecke geschlossen hat, kaufe ich fast alles online.","Da quando il negozio dietro l'angolo ha chiuso, compro quasi tutto online.","B1","aussage"],
      ["Ich habe mir vorgenommen, diesen Monat weniger Geld für Kleidung auszugeben.","Mi sono ripromesso di spendere meno soldi in vestiti questo mese.","B1","aussage"],
      ["Nachdem ich die Bewertungen gelesen hatte, habe ich mich für ein anderes Produkt entschieden.","Dopo aver letto le recensioni, mi sono deciso per un altro prodotto.","B1","aussage"],
      ["Meine Eltern kaufen lieber im kleinen Laden ein, während ich den Supermarkt praktischer finde.","I miei genitori preferiscono fare la spesa nel piccolo negozio, mentre io trovo più pratico il supermercato.","B1","aussage"],
      ["Ich werde die Jacke wahrscheinlich zurückbringen, weil die Farbe nicht passt.","Probabilmente riporterò indietro la giacca perché il colore non è adatto.","B1","aussage"],
      ["Obwohl das Geschäft teurer ist, kaufe ich dort gern, weil die Beratung so gut ist.","Anche se il negozio è più caro, mi piace fare acquisti lì perché la consulenza è molto buona.","B1","aussage"],
      ["Bis das neue Sofa geliefert wird, müssen wir noch drei Wochen warten.","Prima che venga consegnato il nuovo divano, dobbiamo ancora aspettare tre settimane.","B1","aussage"],
      ["Wir vergleichen die Preise schon seit einer Weile, bevor wir uns entscheiden.","Confrontiamo i prezzi già da un po' prima di decidere.","B1","aussage"],
      ["Sobald ich meinen Gehaltszettel bekomme, werde ich mir das neue Handy kaufen.","Non appena ricevo la busta paga, comprerò il nuovo telefono.","B1","aussage"],
      ["Der Kundendienst hat versprochen, den Artikel schnell umzutauschen.","Il servizio clienti ha promesso di cambiare rapidamente l'articolo.","B1","aussage"],
      ["Warum dauert die Lieferung diesmal so viel länger als sonst?","Perché la consegna questa volta ci mette molto più tempo del solito?","B1","frage"],
      ["Weißt du, ob man dieses Produkt auch im Laden umtauschen kann?","Sai se questo prodotto si può cambiare anche in negozio?","B1","frage"],
      ["Hättest du Lust, morgen mit mir zum Flohmarkt zu gehen?","Avresti voglia di venire con me domani al mercatino delle pulci?","B1","frage"],
      ["Ich kaufe im Bioladen ein, weil ich auf die Herkunft der Lebensmittel achte.","Faccio la spesa nel negozio biologico perché tengo alla provenienza degli alimenti.","B1","nebensatz"],
      ["Sobald der Ausverkauf beginnt, werde ich in aller Frühe da sein.","Non appena inizieranno i saldi, sarò lì di prima mattina.","B1","nebensatz"],
      ["Ich habe vergessen, wo ich die Quittung für die Reklamation hingelegt habe.","Ho dimenticato dove ho messo lo scontrino per il reclamo.","B1","nebensatz"],
      ["Der Artikel wurde innerhalb weniger Tage aus allen Filialen entfernt.","L'articolo è stato ritirato da tutti i negozi nel giro di pochi giorni.","B2","aussage"],
      ["An unserem Vorhaben, weniger impulsiv einzukaufen, scheitern wir immer wieder aufs Neue.","Il nostro proposito di fare acquisti meno impulsivi fallisce sempre di nuovo.","B2","aussage"],
      ["Hätte der Laden nicht so lange Öffnungszeiten, könnten wir kaum noch abends einkaufen.","Se il negozio non avesse orari di apertura così lunghi, potremmo a malapena fare la spesa la sera.","B2","aussage"],
      ["Die Lebensmittelpreise sind im vergangenen Jahr spürbar gestiegen.","I prezzi degli alimentari sono aumentati sensibilmente nell'ultimo anno.","B2","aussage"],
      ["Bei uns wird — anders als früher — inzwischen fast alles online bestellt.","Da noi, diversamente da un tempo, si ordina ormai quasi tutto online.","B2","aussage"],
      ["Der defekte Fernseher wurde erst nach mehrfacher Reklamation ausgetauscht.","Il televisore difettoso è stato sostituito solo dopo diversi reclami.","B2","aussage"],
      ["Es wäre höchste Zeit, dass Verpackungen im Handel deutlich reduziert werden.","Sarebbe ora che gli imballaggi nel commercio venissero notevolmente ridotti.","B2","aussage"],
      ["Unser Haushaltsbudget hält nur deshalb stand, weil wir feste Ausgabengrenzen eingeführt haben.","Il nostro bilancio familiare regge solo perché abbiamo introdotto limiti di spesa fissi.","B2","aussage"],
      ["Die neue Kassensoftware verarbeitet deutlich mehr Kunden pro Stunde als das alte System.","Il nuovo software di cassa gestisce decisamente più clienti all'ora rispetto al vecchio sistema.","B2","aussage"],
      ["Man sollte meinen, dass Onlineshopping Zeit spart — in meinem Fall ist eher das Gegenteil der Fall.","Si potrebbe pensare che gli acquisti online facciano risparmiare tempo — nel mio caso vale piuttosto il contrario.","B2","aussage"],
      ["Falls die Lieferung doch noch ausfällt, müssen wir kurzfristig ein Ersatzgeschenk besorgen.","Nel caso in cui la consegna dovesse comunque saltare, dovremo procurarci in fretta un regalo sostitutivo.","B2","aussage"],
      ["Hast du eigentlich schon eine Idee, welches Geschäft die frischesten Erdbeeren hat?","Hai già un'idea di quale negozio abbia le fragole più fresche?","B2","frage"],
      ["Wäre es nicht sinnvoller, größere Anschaffungen gleich in Raten zu zahlen?","Non sarebbe più sensato pagare subito a rate gli acquisti più grandi?","B2","frage"],
      ["Inwiefern hat sich euer Einkaufsverhalten verändert, seit ihr überwiegend online bestellt?","In che misura è cambiato il vostro modo di fare acquisti da quando ordinate prevalentemente online?","B2","frage"],
      ["Obwohl der Laden erst kürzlich renoviert worden war, wirkte das Sortiment merkwürdig unverändert.","Sebbene il negozio fosse stato ristrutturato di recente, l'assortimento appariva stranamente invariato.","B2","nebensatz"],
      ["Da die Lieferung sich verzögerte, mussten wir das Geschenk kurzfristig woanders besorgen.","Poiché la consegna ha subito un ritardo, abbiamo dovuto procurarci il regalo altrove all'ultimo momento.","B2","nebensatz"],
      ["Nachdem wir wochenlang über einen neuen Kühlschrank diskutiert hatten, entschieden wir uns schließlich für ein sparsames Modell.","Dopo aver discusso per settimane di un nuovo frigorifero, alla fine ci siamo decisi per un modello a basso consumo.","B2","nebensatz"],
      ["Bewusstes Einkaufen trägt maßgeblich zur eigenen Ausgabendisziplin bei.","Fare acquisti in modo consapevole contribuisce in modo significativo alla propria disciplina di spesa.","C1","aussage"],
      ["Die stille Verschiebung des Konsums ins Internet hat den stationären Handel in vielen Städten spürbar geschwächt.","Il silenzioso spostamento dei consumi verso internet ha indebolito sensibilmente il commercio fisico in molte città.","C1","aussage"],
      ["Trotz aller Sparvorsätze gerät das Haushaltsbudget an den Feiertagen zunehmend aus dem Ruder.","Nonostante ogni proposito di risparmio, il bilancio familiare sfugge sempre più al controllo durante le feste.","C1","aussage"],
      ["Der Umstieg auf regionale Anbieter hat sich, alles in allem, gelohnt.","Tutto sommato, il passaggio a fornitori locali è valso la pena.","C1","aussage"],
      ["Es liegt mir fern, Konsum grundsätzlich zu verteufeln — er kann durchaus auch Freude bereiten.","Non è mia intenzione demonizzare il consumo in generale — può senz'altro anche procurare gioia.","C1","aussage"],
      ["Die anfängliche Skepsis gegenüber Selbstbedienungskassen wich schon bald einer regelrechten Selbstverständlichkeit.","L'iniziale scetticismo verso le casse self-service lasciò presto il posto a una vera e propria normalità.","C1","aussage"],
      ["Angesichts steigender Preise überdenken viele Verbraucher ihren Umgang mit spontanen Anschaffungen.","Di fronte all'aumento dei prezzi, molti consumatori ripensano il proprio approccio agli acquisti impulsivi.","C1","aussage"],
      ["Der vermeintlich banale Vorgang des Preisvergleichs entpuppt sich bei näherem Hinsehen als kleine Wissenschaft für sich.","L'apparentemente banale confronto dei prezzi si rivela, a uno sguardo più attento, una piccola scienza a sé.","C1","aussage"],
      ["Man tut gut daran, größere Anschaffungen nicht überstürzt zu tätigen.","Fa bene a non effettuare in modo affrettato gli acquisti più importanti.","C1","aussage"],
      ["Die Rabattaktion nahm — entgegen aller Erwartungen — kaum mehr Kunden an, als ursprünglich veranschlagt worden war.","La promozione, contrariamente a ogni aspettativa, non ha attirato molti più clienti di quanto inizialmente previsto.","C1","aussage"],
      ["Kaum ein anderer Bereich zeigt so deutlich Reibung zwischen Bequemlichkeit und Nachhaltigkeit wie der Onlinehandel.","Difficilmente un altro settore mostra così chiaramente l'attrito tra comodità e sostenibilità come il commercio online.","C1","aussage"],
      ["Inwieweit lässt sich Konsum überhaupt gerecht gestalten, ohne dass ökologische Folgen ausgeblendet werden?","Fino a che punto il consumo può davvero essere reso equo, senza che le conseguenze ecologiche vengano ignorate?","C1","frage"],
      ["Woran liegt es eigentlich, dass Sparen manchen Menschen so viel leichter fällt als anderen?","Da cosa dipende in realtà il fatto che a certe persone riesca tanto più facile risparmiare rispetto ad altre?","C1","frage"],
      ["Ließe sich der Einkauf nicht effizienter organisieren, wenn wir eine feste Liste einführten?","Non si potrebbe organizzare la spesa in modo più efficiente se introducessimo una lista fissa?","C1","frage"],
      ["Während viele den Ausverkauf als Chance empfinden, betrachte ich ihn eher als Verlockung zu unnötigen Käufen.","Mentre molti percepiscono i saldi come un'occasione, io li considero piuttosto una tentazione verso acquisti superflui.","C1","nebensatz"],
      ["Da sich die Versandkosten binnen weniger Jahre fast verdoppelt haben, bestellen viele Kunden seltener, aber gezielter.","Poiché i costi di spedizione sono quasi raddoppiati nel giro di pochi anni, molti clienti ordinano più raramente, ma in modo più mirato.","C1","nebensatz"],
      ["Wer glaubt, dass günstige Preise allein ein Qualitätsmerkmal seien, unterschätzt oft die verborgenen Kosten der Produktion.","Chi crede che i prezzi bassi siano di per sé un indice di qualità spesso sottovaluta i costi nascosti della produzione.","C1","nebensatz"],
      ["Die vermeintliche Nebensächlichkeit alltäglicher Kaufentscheidungen täuscht darüber hinweg, wie sehr sie unser Konsumverhalten prägen.","L'apparente marginalità delle decisioni d'acquisto quotidiane fa dimenticare quanto in realtà plasmino il nostro comportamento di consumo.","C2","aussage"],
      ["Zwischen dem Ideal des bewussten Konsums und der gelebten Wirklichkeit klafft bei den meisten Haushalten eine erhebliche Lücke.","Tra l'ideale del consumo consapevole e la realtà vissuta si apre, per la maggior parte delle famiglie, un divario considerevole.","C2","aussage"],
      ["So banal die Frage nach dem günstigsten Anbieter erscheinen mag, so viel verrät sie über unsere Prioritäten im Alltag.","Per quanto banale possa sembrare la questione del fornitore più conveniente, rivela moltissimo sulle nostre priorità quotidiane.","C2","aussage"],
      ["Die Digitalisierung des Einkaufens verspricht Bequemlichkeit, erzeugt jedoch nicht selten neue Formen der Reizüberflutung.","La digitalizzazione dello shopping promette comodità, ma non di rado genera nuove forme di sovraccarico sensoriale.","C2","aussage"],
      ["Erst der plötzliche Preisanstieg führte uns vor Augen, wie sehr wir uns an günstige Produkte gewöhnt hatten.","Solo l'improvviso aumento dei prezzi ci ha mostrato quanto ci fossimo abituati ai prodotti economici.","C2","aussage"],
      ["Sparsam einzukaufen, ist letztlich weniger eine Frage des Verzichts als vielmehr eine des Systems.","Fare acquisti con parsimonia è, in fondo, meno una questione di rinuncia che di sistema.","C2","aussage"],
      ["Der Traum vom Laden, der alles vorrätig hat und nie überteuert ist, bleibt für die meisten von uns Utopie.","Il sogno del negozio che ha tutto disponibile e non è mai troppo caro resta per la maggior parte di noi un'utopia.","C2","aussage"],
      ["Was als kurzer Bummel durch die Innenstadt gedacht war, entpuppte sich als kostspieliger Nachmittag mit ungeahnten Folgen.","Quella che doveva essere una breve passeggiata in centro si è rivelata un pomeriggio costoso, con conseguenze insospettate.","C2","aussage"],
      ["Die Rückkehr zum Einkauf im kleinen Fachgeschäft statt im anonymen Großmarkt lässt sich durchaus als stille Kulturkritik lesen.","Il ritorno agli acquisti nel piccolo negozio specializzato invece dell'anonimo ipermercato può essere letto a tutti gli effetti come una silenziosa critica culturale.","C2","aussage"],
      ["Erst beim Blick in den eigenen Einkaufswagen wird einem klar, wie sehr Werbung die eigenen Vorlieben lenkt.","Solo dando un'occhiata al proprio carrello ci si rende conto di quanto la pubblicità influenzi davvero i nostri gusti.","C2","aussage"],
      ["Die vielbeschworene Rückbesinnung auf regionale Erzeugnisse entpuppt sich bei Licht besehen oft als Privileg derer, die es sich leisten können, mehr zu bezahlen.","La tanto decantata riscoperta dei prodotti locali si rivela, a un'analisi più attenta, spesso un privilegio di chi può permettersi di pagare di più.","C2","aussage"],
      ["Kann man beim Einkaufen überhaupt noch zwischen einem echten Bedürfnis und geschickt gewecktem Verlangen unterscheiden?","Quando si fa shopping, si riesce ancora davvero a distinguere tra un bisogno reale e un desiderio abilmente indotto?","C2","frage"],
      ["Müssten wir nicht viel öfter innehalten und uns fragen, ob wir einen Gegenstand wirklich brauchen, bevor wir ihn kaufen?","Non dovremmo fermarci molto più spesso a chiederci se ci serve davvero un oggetto prima di comprarlo?","C2","frage"],
      ["Ist uns beim Bezahlen an der Kasse überhaupt noch bewusst, wie viel wir eigentlich ausgeben?","Quando paghiamo alla cassa, ci rendiamo ancora conto di quanto stiamo davvero spendendo?","C2","frage"],
      ["Sobald die ersten Rabattschilder im Schaufenster auftauchen, gerät jeder gute Vorsatz zum Sparen ins Wanken.","Non appena compaiono i primi cartelli di sconto in vetrina, ogni buon proposito di risparmio comincia a vacillare.","C2","nebensatz"],
      ["Während die einen im minimalistischen Konsum Freiheit erkennen, sehen andere darin bloß eine neue Form von Verzicht.","Mentre alcuni riconoscono nel consumo minimalista una forma di libertà, altri vi vedono soltanto una nuova forma di rinuncia.","C2","nebensatz"],
      ["Obgleich die Vergleichsportale stetig ausgefeilter werden, scheint die gefühlte Unsicherheit beim Kauf kaum abzunehmen.","Sebbene i portali di comparazione diventino sempre più sofisticati, l'incertezza percepita al momento dell'acquisto sembra diminuire ben poco.","C2","nebensatz"]
    ],
    "arbeit": [
      ["Ich arbeite im Büro.","Lavoro in ufficio.","A1","aussage"],
      ["Er ist Lehrer.","Lui è insegnante.","A1","aussage"],
      ["Wir beginnen um acht Uhr.","Iniziamo alle otto.","A1","aussage"],
      ["Sie schreibt eine E-Mail.","Lei scrive un'e-mail.","A1","aussage"],
      ["Mein Chef ist sehr nett.","Il mio capo è molto gentile.","A1","aussage"],
      ["Ich habe heute frei.","Oggi ho il giorno libero.","A1","aussage"],
      ["Die Firma ist groß.","L'azienda è grande.","A1","aussage"],
      ["Ich mache eine Pause.","Faccio una pausa.","A1","aussage"],
      ["Wir haben ein Meeting.","Abbiamo una riunione.","A1","aussage"],
      ["Er arbeitet viel.","Lui lavora molto.","A1","aussage"],
      ["Ich fahre mit dem Bus zur Arbeit.","Vado al lavoro in autobus.","A1","aussage"],
      ["Wann beginnt die Arbeit?","Quando inizia il lavoro?","A1","frage"],
      ["Was ist dein Beruf?","Che lavoro fai?","A1","frage"],
      ["Hast du morgen frei?","Domani hai il giorno libero?","A1","frage"],
      ["Ich bin müde, weil ich lange gearbeitet habe.","Sono stanco perché ho lavorato a lungo.","A1","nebensatz"],
      ["Ich mag meine Arbeit, weil die Kollegen nett sind.","Mi piace il mio lavoro perché i colleghi sono simpatici.","A1","nebensatz"],
      ["Ich gehe früh ins Bett, wenn ich morgen arbeite.","Vado a letto presto quando il giorno dopo lavoro.","A1","nebensatz"],
      ["Ich habe gestern ein wichtiges Projekt abgeschlossen.","Ieri ho concluso un progetto importante.","A2","aussage"],
      ["Mein Kollege hat gekündigt und sucht jetzt eine neue Stelle.","Il mio collega si è licenziato e ora cerca un nuovo lavoro.","A2","aussage"],
      ["Wir haben letzte Woche einen neuen Kunden gewonnen.","La settimana scorsa abbiamo acquisito un nuovo cliente.","A2","aussage"],
      ["Nach der Arbeit gehe ich meistens direkt nach Hause.","Dopo il lavoro di solito vado direttamente a casa.","A2","aussage"],
      ["Ich habe mich auf eine neue Stelle beworben.","Mi sono candidato per un nuovo posto di lavoro.","A2","aussage"],
      ["Meine Chefin hat mir mehr Verantwortung gegeben.","La mia capa mi ha dato più responsabilità.","A2","aussage"],
      ["Wir haben ein neues Programm für die Buchhaltung bekommen.","Abbiamo ricevuto un nuovo programma per la contabilità.","A2","aussage"],
      ["Ich habe vergessen, den Bericht zu schicken.","Ho dimenticato di inviare il rapporto.","A2","aussage"],
      ["Am Freitag machen wir immer früher Feierabend.","Il venerdì finiamo sempre prima il lavoro.","A2","aussage"],
      ["Ich habe zwei Wochen Urlaub genommen.","Ho preso due settimane di ferie.","A2","aussage"],
      ["Die neue Kollegin hat sich schnell eingelebt.","La nuova collega si è ambientata in fretta.","A2","aussage"],
      ["Hast du das Meeting schon vorbereitet?","Hai già preparato la riunione?","A2","frage"],
      ["Wann hast du deine neue Stelle angefangen?","Quando hai iniziato il tuo nuovo lavoro?","A2","frage"],
      ["Kannst du mir bei der Präsentation helfen?","Puoi aiutarmi con la presentazione?","A2","frage"],
      ["Ich bleibe länger im Büro, weil das Projekt fertig werden muss.","Resto più a lungo in ufficio perché il progetto deve essere finito.","A2","nebensatz"],
      ["Ich glaube, dass die Besprechung heute ausfällt.","Credo che la riunione di oggi salti.","A2","nebensatz"],
      ["Bevor ich zur Arbeit fahre, lese ich kurz meine E-Mails.","Prima di andare al lavoro leggo velocemente le e-mail.","A2","nebensatz"],
      ["Wenn das Projekt gut läuft, werde ich nächstes Jahr befördert.","Se il progetto va bene, il prossimo anno sarò promosso.","B1","aussage"],
      ["Seit ich im Homeoffice arbeite, bin ich deutlich produktiver.","Da quando lavoro da casa, sono decisamente più produttivo.","B1","aussage"],
      ["Ich habe mir vorgenommen, jeden Tag pünktlich Feierabend zu machen.","Mi sono ripromesso di finire il lavoro puntualmente ogni giorno.","B1","aussage"],
      ["Nachdem der Chef die Ergebnisse gesehen hatte, war er sehr zufrieden.","Dopo aver visto i risultati, il capo era molto soddisfatto.","B1","aussage"],
      ["Meine Kollegin übernimmt die Präsentation, während ich mich um die Zahlen kümmere.","La mia collega si occupa della presentazione, mentre io mi occupo dei numeri.","B1","aussage"],
      ["Ich werde nächste Woche endlich das Bewerbungsgespräch haben.","La prossima settimana avrò finalmente il colloquio di lavoro.","B1","aussage"],
      ["Meine Kollegin hat mir heute Morgen bei der Präsentation geholfen.","La mia collega mi ha aiutato stamattina con la presentazione.","B1","aussage"],
      ["Bis das neue Projekt startet, müssen wir noch einige Verträge klären.","Prima che inizi il nuovo progetto, dobbiamo ancora chiarire alcuni contratti.","B1","aussage"],
      ["Wir bereiten uns schon seit Wochen auf die Firmenpräsentation vor.","Ci stiamo preparando alla presentazione aziendale già da settimane.","B1","aussage"],
      ["Sobald ich die Zusage bekommen habe, kündige ich meinen alten Job.","Non appena avrò ricevuto la conferma, mi licenzierò dal vecchio lavoro.","B1","aussage"],
      ["Der Personalchef hat versprochen, sich bis Freitag zu melden.","Il capo del personale ha promesso di farsi sentire entro venerdì.","B1","aussage"],
      ["Warum dauert die Entscheidung über die Beförderung so lange?","Perché la decisione sulla promozione ci mette così tanto tempo?","B1","frage"],
      ["Weißt du, ob wir dieses Jahr noch einen Bonus bekommen?","Sai se quest'anno riceveremo ancora un bonus?","B1","frage"],
      ["Hättest du Lust, das neue Projekt gemeinsam mit mir zu leiten?","Avresti voglia di dirigere insieme a me il nuovo progetto?","B1","frage"],
      ["Ich bleibe heute länger, weil ich die Präsentation noch fertigstellen muss.","Oggi resto più a lungo perché devo ancora finire la presentazione.","B1","nebensatz"],
      ["Sobald der Vertrag unterschrieben ist, kann das Projekt offiziell starten.","Non appena il contratto sarà firmato, il progetto potrà partire ufficialmente.","B1","nebensatz"],
      ["Der Kollege, der mir bei der Abrechnung helfen sollte, ist heute leider krank.","Il collega che avrebbe dovuto aiutarmi con la contabilità oggi purtroppo è malato.","B1","nebensatz"],
      ["Die Abteilung wird nächstes Quartal komplett umstrukturiert.","Il reparto sarà completamente ristrutturato nel prossimo trimestre.","B2","aussage"],
      ["An unserem Vorhaben, endlich papierlos zu arbeiten, scheitern wir seit Jahren.","Il nostro proposito di lavorare finalmente senza carta fallisce ormai da anni.","B2","aussage"],
      ["Hätte ich mehr Verhandlungsspielraum, würde ich um ein höheres Gehalt bitten.","Se avessi più margine di trattativa, chiederei uno stipendio più alto.","B2","aussage"],
      ["Die Überstunden in unserer Abteilung sind im letzten Jahr spürbar gestiegen.","Gli straordinari nel nostro reparto sono aumentati sensibilmente lo scorso anno.","B2","aussage"],
      ["Homeoffice ist bei uns längst zur Normalität geworden, nicht mehr zur Ausnahme.","Da noi il lavoro da casa è ormai diventato la normalità, non più l'eccezione.","B2","aussage"],
      ["Die veraltete Software wurde erst nach mehrfacher Beschwerde ausgetauscht.","Il software obsoleto è stato sostituito solo dopo diversi reclami.","B2","aussage"],
      ["Langsam müssten wir endlich über eine Umstrukturierung der Abteilung nachdenken.","Ormai dovremmo finalmente pensare a una ristrutturazione del reparto.","B2","aussage"],
      ["Unser Team funktioniert nur deshalb reibungslos, weil wir klare Zuständigkeiten verteilt haben.","Il nostro team funziona senza intoppi solo perché abbiamo assegnato responsabilità chiare.","B2","aussage"],
      ["Die neue Projektmanagement-Software spart deutlich mehr Zeit als das alte System.","Il nuovo software di gestione dei progetti fa risparmiare decisamente più tempo del vecchio sistema.","B2","aussage"],
      ["Man sollte meinen, dass sich Homeoffice mit den Jahren leichter anfühlt — bei mir ist eher das Gegenteil der Fall.","Si potrebbe pensare che lo smart working diventi più facile con gli anni — per me vale piuttosto il contrario.","B2","aussage"],
      ["Falls der Kunde doch noch absagt, müssen wir den ganzen Zeitplan verschieben.","Nel caso in cui il cliente dovesse comunque disdire, dovremo rinviare tutto il calendario.","B2","aussage"],
      ["Bis wann genau erwartet der Kunde die überarbeitete Version des Angebots?","Entro quando esattamente il cliente si aspetta la versione rivista dell'offerta?","B2","frage"],
      ["Wäre es nicht sinnvoller, die Schulung gleich an eine externe Firma zu vergeben?","Non sarebbe più sensato affidare subito la formazione a una ditta esterna?","B2","frage"],
      ["Inwiefern hat sich euer Arbeitsalltag verändert, seit ihr überwiegend remote arbeitet?","In che misura è cambiata la vostra routine lavorativa da quando lavorate prevalentemente da remoto?","B2","frage"],
      ["Obwohl die Abteilung frisch umstrukturiert worden war, fühlte sich die Zusammenarbeit merkwürdig unverändert an.","Sebbene il reparto fosse stato appena ristrutturato, la collaborazione risultava stranamente invariata.","B2","nebensatz"],
      ["Da das System ausgefallen war, stapelten sich die unbearbeiteten Anfragen eine ganze Woche lang.","Poiché il sistema era andato in tilt, le richieste inevase si sono accumulate per un'intera settimana.","B2","nebensatz"],
      ["Wir mussten den Liefertermin verschieben, weil zwei Mitarbeiter kurzfristig krank geworden waren.","Abbiamo dovuto rinviare la data di consegna perché due dipendenti si erano ammalati all'improvviso.","B2","nebensatz"],
      ["Ein wertschätzendes Arbeitsklima trägt maßgeblich zur Zufriedenheit der Belegschaft bei.","Un clima lavorativo di stima contribuisce in modo significativo alla soddisfazione del personale.","C1","aussage"],
      ["Die stille Umverteilung von Aufgaben spiegelt oft ungeschriebene Hierarchien innerhalb eines Teams wider.","La tacita redistribuzione dei compiti riflette spesso gerarchie non scritte all'interno di un team.","C1","aussage"],
      ["Trotz aller Bemühungen um Effizienz gerät der Arbeitsalltag im Großraumbüro zunehmend aus dem Ruder.","Nonostante tutti gli sforzi per essere efficienti, la giornata lavorativa nell'open space sfugge sempre più al controllo.","C1","aussage"],
      ["Die Digitalisierung der internen Abläufe hat sich, alles in allem, gelohnt.","Tutto sommato, la digitalizzazione dei processi interni è valsa la pena.","C1","aussage"],
      ["Es liegt mir fern, Überstunden grundsätzlich zu verurteilen — sie können in Ausnahmefällen durchaus nötig sein.","Non è mia intenzione condannare gli straordinari in linea di principio — in casi eccezionali possono senz'altro essere necessari.","C1","aussage"],
      ["Innerhalb weniger Monate hat sich der Umgangston in unserem Büro spürbar verändert.","Nel giro di pochi mesi il tono con cui ci parliamo in ufficio è cambiato sensibilmente.","C1","aussage"],
      ["Angesichts des Fachkräftemangels überdenken viele Unternehmen ihren Umgang mit flexiblen Arbeitszeiten.","Di fronte alla carenza di personale qualificato, molte aziende ripensano il proprio approccio agli orari flessibili.","C1","aussage"],
      ["Der vermeintlich banale Vorgang des Zeitmanagements entpuppt sich bei näherem Hinsehen als Frage der Unternehmenskultur.","Il processo apparentemente banale della gestione del tempo si rivela, a uno sguardo più attento, una questione di cultura aziendale.","C1","aussage"],
      ["Man tut gut daran, schwierige Personalgespräche nicht auf die lange Bank zu schieben.","Fa bene a non rimandare troppo a lungo i colloqui difficili con il personale.","C1","aussage"],
      ["Die Umstellung auf die neue Software nahm — entgegen aller Erwartungen — kaum mehr Zeit in Anspruch als ursprünglich veranschlagt.","Il passaggio al nuovo software, contrariamente a ogni aspettativa, non ha richiesto molto più tempo del previsto.","C1","aussage"],
      ["Kaum ein Thema sorgt in Teams so verlässlich für Reibung wie die Verteilung der Urlaubstage.","Difficilmente un altro tema genera altrettante frizioni nei team quanto la ripartizione dei giorni di ferie.","C1","aussage"],
      ["Inwieweit lässt sich der Arbeitsalltag überhaupt gerecht organisieren, ohne dass eine Seite sich benachteiligt fühlt?","Fino a che punto si può davvero organizzare in modo equo la giornata lavorativa, senza che una parte si senta svantaggiata?","C1","frage"],
      ["Woran liegt es eigentlich, dass Zeitmanagement manchen Menschen so viel leichter fällt als anderen?","Da cosa dipende in realtà il fatto che a certe persone riesca tanto più facile gestire il tempo rispetto ad altre?","C1","frage"],
      ["Ließe sich unser Team nicht effizienter organisieren, wenn wir klare Zuständigkeiten festlegten?","Non si potrebbe organizzare il nostro team in modo più efficiente se stabilissimo responsabilità chiare?","C1","frage"],
      ["Während viele den Feedbackprozess als lästige Pflicht empfinden, betrachte ich ihn als willkommene Chance zur Weiterentwicklung.","Mentre molti percepiscono il processo di feedback come un fastidioso dovere, io lo considero un'occasione gradita di crescita.","C1","nebensatz"],
      ["Da sich die Personalkosten binnen weniger Jahre fast verdoppelt haben, verschieben viele Firmen fällige Neueinstellungen.","Poiché i costi del personale sono quasi raddoppiati nel giro di pochi anni, molte aziende rimandano le assunzioni necessarie.","C1","nebensatz"],
      ["Wer glaubt, dass Erfolg allein eine Frage der Arbeitsstunden sei, unterschätzt oft die Rolle kluger Prioritäten.","Chi crede che il successo sia soltanto una questione di ore lavorate spesso sottovaluta il ruolo di priorità intelligenti.","C1","nebensatz"],
      ["Die vermeintliche Nebensächlichkeit kleiner Arbeitsroutinen täuscht darüber hinweg, wie sehr sie unseren Berufsalltag prägen.","L'apparente marginalità delle piccole routine lavorative fa dimenticare quanto in realtà plasmino la nostra vita professionale.","C2","aussage"],
      ["Zwischen dem Ideal der ausgeglichenen Work-Life-Balance und der gelebten Wirklichkeit klafft bei den meisten Berufstätigen eine erhebliche Lücke.","Tra l'ideale di un sano equilibrio tra vita e lavoro e la realtà vissuta si apre, per la maggior parte dei lavoratori, un divario considerevole.","C2","aussage"],
      ["Wer glaubt, Small Talk in der Kaffeeküche sei reine Zeitverschwendung, unterschätzt gewaltig, wie viele Entscheidungen dort tatsächlich fallen.","Chi crede che le chiacchiere davanti alla macchinetta del caffè siano pura perdita di tempo sottovaluta enormemente quante decisioni vengano prese proprio lì.","C2","aussage"],
      ["Die Digitalisierung der Arbeitswelt verspricht Flexibilität, erzeugt jedoch nicht selten neue Formen unsichtbarer Mehrarbeit.","La digitalizzazione del mondo del lavoro promette flessibilità, ma non di rado genera nuove forme di lavoro invisibile.","C2","aussage"],
      ["Erst der plötzliche Ausfall des Servers führte uns vor Augen, wie sehr wir uns an digitale Selbstverständlichkeiten gewöhnt hatten.","Solo l'improvviso guasto del server ci ha mostrato quanto ci fossimo abituati alle comodità digitali.","C2","aussage"],
      ["Produktiv zu arbeiten, ist letztlich weniger eine Frage des Fleißes als vielmehr eine des Systems.","Lavorare in modo produttivo è, in fondo, meno una questione di diligenza che di sistema.","C2","aussage"],
      ["Der Traum vom Beruf, der sich völlig mühelos mit dem Privatleben vereinbaren lässt, bleibt für die meisten von uns Utopie.","Il sogno di una professione perfettamente conciliabile con la vita privata resta per la maggior parte di noi un'utopia.","C2","aussage"],
      ["Was als kurzes Abstimmungsgespräch gedacht war, entpuppte sich als stundenlange Sitzung mit ungeahnten Nebenwirkungen.","Quella che doveva essere una breve riunione di allineamento si è rivelata una seduta di ore, con effetti collaterali insospettati.","C2","aussage"],
      ["Die Rückkehr zum persönlichen Gespräch statt zur E-Mail-Flut lässt sich durchaus als stille Kulturkritik lesen.","Il ritorno al colloquio personale invece del diluvio di e-mail può essere letto a tutti gli effetti come una silenziosa critica culturale.","C2","aussage"],
      ["Gerade die Entscheidungen, die niemand groß hinterfragt, prägen am Ende die Kultur eines Unternehmens am stärksten.","Sono proprio le decisioni che nessuno mette in discussione a plasmare, alla fine, la cultura di un'azienda più di ogni altra cosa.","C2","aussage"],
      ["Die vielbeschworene Rückbesinnung auf handwerkliche Berufe entpuppt sich bei Licht besehen oft als Reaktion auf die Entfremdung im Büroalltag.","La tanto decantata riscoperta dei mestieri artigianali si rivela, a un'analisi più attenta, spesso una reazione all'alienazione della vita d'ufficio.","C2","aussage"],
      ["Zählt am Ende wirklich nur das Ergebnis eines Projekts, oder sollte nicht auch der Einsatz im Team honoriert werden?","Alla fine conta davvero solo il risultato di un progetto, o non si dovrebbe apprezzare anche l'impegno del team?","C2","frage"],
      ["Warum eigentlich akzeptieren wir es fast widerspruchslos, dass Überstunden oft gar nicht vergütet werden?","Perché mai accettiamo quasi senza obiezioni che gli straordinari spesso non vengano nemmeno retribuiti?","C2","frage"],
      ["Woran bemisst sich eigentlich, ob eine Stelle als erfüllend oder als bloßer Broterwerb wahrgenommen wird?","Da cosa dipende, in fondo, il fatto che un lavoro venga percepito come appagante o come mero mezzo di sostentamento?","C2","frage"],
      ["Obwohl die Teamsitzung eigentlich nur eine halbe Stunde dauern sollte, diskutierten wir am Ende fast zwei Stunden über Kleinigkeiten.","Anche se la riunione di squadra sarebbe dovuta durare solo mezz'ora, alla fine abbiamo discusso quasi due ore su dettagli insignificanti.","C2","nebensatz"],
      ["Während die einen im ständigen Wandel der Arbeitswelt eine Chance erkennen, sehen andere darin bloß eine neue Form der Verunsicherung.","Mentre alcuni riconoscono nel continuo cambiamento del mondo del lavoro un'opportunità, altri vi vedono soltanto una nuova forma di insicurezza.","C2","nebensatz"],
      ["Obgleich die digitalen Arbeitsmittel stetig ausgefeilter werden, scheint die gefühlte Arbeitsbelastung kaum abzunehmen.","Sebbene gli strumenti digitali di lavoro diventino sempre più sofisticati, il carico di lavoro percepito sembra diminuire ben poco.","C2","nebensatz"]
    ],
    "familie": [
      ["Das ist mein Vater.","Questo è mio padre.","A1","aussage"],
      ["Meine Mutter heißt Anna.","Mia madre si chiama Anna.","A1","aussage"],
      ["Ich habe zwei Brüder.","Ho due fratelli.","A1","aussage"],
      ["Mein Bruder ist zehn Jahre alt.","Mio fratello ha dieci anni.","A1","aussage"],
      ["Meine Oma wohnt in Berlin.","Mia nonna abita a Berlino.","A1","aussage"],
      ["Wir besuchen heute die Großeltern.","Oggi andiamo a trovare i nonni.","A1","aussage"],
      ["Mein bester Freund heißt Tom.","Il mio migliore amico si chiama Tom.","A1","aussage"],
      ["Meine Schwester spielt gern Fußball.","A mia sorella piace giocare a calcio.","A1","aussage"],
      ["Ich rufe meine Mutter an.","Chiamo mia madre.","A1","aussage"],
      ["Die Familie isst zusammen.","La famiglia mangia insieme.","A1","aussage"],
      ["Mein Onkel wohnt in Italien.","Mio zio abita in Italia.","A1","aussage"],
      ["Wie heißt deine Schwester?","Come si chiama tua sorella?","A1","frage"],
      ["Hast du Geschwister?","Hai fratelli o sorelle?","A1","frage"],
      ["Wo wohnen deine Eltern?","Dove abitano i tuoi genitori?","A1","frage"],
      ["Ich mag meine Familie, weil sie lustig ist.","Mi piace la mia famiglia perché è divertente.","A1","nebensatz"],
      ["Ich rufe meinen Freund an, wenn ich Zeit habe.","Chiamo il mio amico quando ho tempo.","A1","nebensatz"],
      ["Meine Schwester ist klein, aber sehr stark.","Mia sorella è piccola, ma molto forte.","A1","aussage"],
      ["Am Wochenende habe ich meine Cousine besucht.","Nel weekend sono andato a trovare mia cugina.","A2","aussage"],
      ["Meine Eltern haben letztes Jahr geheiratet.","I miei genitori si sono sposati l'anno scorso.","A2","aussage"],
      ["Mein Vater hat mir das Fahrradfahren beigebracht.","Mio padre mi ha insegnato ad andare in bicicletta.","A2","aussage"],
      ["Wir haben mit den Großeltern Karten gespielt.","Abbiamo giocato a carte con i nonni.","A2","aussage"],
      ["Meine beste Freundin hat mir ein Geschenk gebracht.","La mia migliore amica mi ha portato un regalo.","A2","aussage"],
      ["Mein kleiner Bruder ärgert mich manchmal.","Il mio fratellino a volte mi dà fastidio.","A2","aussage"],
      ["Meine Tante hat gestern ein Baby bekommen.","Ieri mia zia ha avuto un bambino.","A2","aussage"],
      ["Wir treffen unsere Freunde jeden Freitag im Park.","Ogni venerdì incontriamo i nostri amici al parco.","A2","aussage"],
      ["Meine Großmutter erzählt oft Geschichten aus ihrer Jugend.","Mia nonna racconta spesso storie della sua gioventù.","A2","aussage"],
      ["Mein Vater hat lange auf der Arbeit telefoniert.","Mio padre ha parlato a lungo al telefono per lavoro.","A2","aussage"],
      ["Meine Schwester ist letzten Monat umgezogen.","Mia sorella si è trasferita il mese scorso.","A2","aussage"],
      ["Wann hast du deine Familie zuletzt gesehen?","Quando hai visto la tua famiglia l'ultima volta?","A2","frage"],
      ["Kommt deine Schwester auch zur Feier?","Viene anche tua sorella alla festa?","A2","frage"],
      ["Habt ihr euch schon lange nicht mehr gesehen?","È da tanto che non vi vedete?","A2","frage"],
      ["Ich freue mich, wenn meine Cousinen zu Besuch kommen.","Sono contento quando le mie cugine vengono a trovarmi.","A2","nebensatz"],
      ["Wir haben nicht gefeiert, weil meine Oma krank war.","Non abbiamo festeggiato perché mia nonna era malata.","A2","nebensatz"],
      ["Ich glaube, dass meine Eltern bald zu Besuch kommen.","Penso che i miei genitori vengano a trovarci presto.","A2","nebensatz"],
      ["Meine Schwester zieht nächsten Monat mit ihrem Freund zusammen.","Mia sorella andrà a convivere con il suo ragazzo il mese prossimo.","B1","aussage"],
      ["Obwohl meine Großeltern weit weg wohnen, telefonieren wir jede Woche.","Anche se i miei nonni vivono lontano, ci sentiamo al telefono ogni settimana.","B1","aussage"],
      ["Mein Onkel hat sich nach der Scheidung sehr verändert.","Mio zio è cambiato molto dopo il divorzio.","B1","aussage"],
      ["Meine Eltern werden im Sommer ihren dreißigsten Hochzeitstag feiern.","I miei genitori festeggeranno il trentesimo anniversario di matrimonio in estate.","B1","aussage"],
      ["Seitdem meine Nichte geboren wurde, besuchen wir meine Schwester öfter.","Da quando è nata mia nipote, andiamo più spesso a trovare mia sorella.","B1","aussage"],
      ["Mein Cousin hat sich mit seinem Bruder wegen des Erbes gestritten.","Mio cugino ha litigato con suo fratello per l'eredità.","B1","aussage"],
      ["Meine Mutter kümmert sich seit Jahren um meinen kranken Großvater.","Mia madre si occupa da anni di mio nonno malato.","B1","aussage"],
      ["Wir werden Weihnachten dieses Jahr bei meinen Schwiegereltern verbringen.","Quest'anno passeremo il Natale dai miei suoceri.","B1","aussage"],
      ["Meine Freundschaft mit ihr hat sich über die Jahre vertieft.","La mia amicizia con lei si è approfondita nel corso degli anni.","B1","aussage"],
      ["Mein Neffe hat gerade sein Studium abgeschlossen.","Mio nipote ha appena finito gli studi.","B1","aussage"],
      ["Meine Stiefmutter behandelt mich wie ihre eigene Tochter.","La mia matrigna mi tratta come sua figlia.","B1","aussage"],
      ["Warum hast du dich mit deinem besten Freund zerstritten?","Perché hai litigato con il tuo migliore amico?","B1","frage"],
      ["Glaubst du, dass Geschwister sich immer nahestehen?","Pensi che i fratelli si sentano sempre vicini tra loro?","B1","frage"],
      ["Wie lange kennst du deine Schwiegereltern schon?","Da quanto tempo conosci i tuoi suoceri?","B1","frage"],
      ["Ich rufe meine Eltern an, sobald ich am Flughafen angekommen bin.","Chiamo i miei genitori appena arrivo in aeroporto.","B1","nebensatz"],
      ["Weil meine Schwester im Ausland lebt, sehen wir uns nur zweimal im Jahr.","Poiché mia sorella vive all'estero, ci vediamo solo due volte all'anno.","B1","nebensatz"],
      ["Nachdem sich meine Eltern getrennt hatten, wohnte ich bei meiner Oma.","Dopo che i miei genitori si erano separati, ho vissuto da mia nonna.","B1","nebensatz"],
      ["Die Beziehung zu meinem Vater hat sich erst spät normalisiert.","Il rapporto con mio padre si è normalizzato solo tardi.","B2","aussage"],
      ["Familientreffen werden bei uns traditionell im Garten meiner Großmutter veranstaltet.","Da noi le riunioni di famiglia si tengono tradizionalmente nel giardino di mia nonna.","B2","aussage"],
      ["Meine Halbschwester wurde erst durch einen DNA-Test entdeckt.","Mia sorellastra è stata scoperta solo grazie a un test del DNA.","B2","aussage"],
      ["Ohne die Unterstützung meiner Verwandten hätten wir den Umzug nicht geschafft.","Senza il sostegno dei miei parenti non ce l'avremmo fatta con il trasloco.","B2","aussage"],
      ["Es wird in unserer Familie oft über Geld und Erbschaft gestritten.","Nella nostra famiglia si litiga spesso per soldi ed eredità.","B2","aussage"],
      ["Meine Schwiegermutter würde am liebsten jedes Wochenende bei uns sein.","A mia suocera piacerebbe stare da noi ogni fine settimana.","B2","aussage"],
      ["Der Kontakt zu meinem Bruder wurde nach dem Streit über Monate abgebrochen.","Il contatto con mio fratello è stato interrotto per mesi dopo il litigio.","B2","aussage"],
      ["Meine Nichte wird gerade von ihren Großeltern großgezogen.","Mia nipote viene attualmente cresciuta dai nonni.","B2","aussage"],
      ["Zwischen meinen Eltern herrschte lange ein angespanntes Verhältnis.","Tra i miei genitori regnava a lungo un rapporto teso.","B2","aussage"],
      ["Unsere Patchworkfamilie hat sich in den letzten Jahren gut zusammengefunden.","La nostra famiglia allargata negli ultimi anni si è amalgamata bene.","B2","aussage"],
      ["Meine Großeltern haben trotz aller Widrigkeiten ihr ganzes Leben zusammengehalten.","Nonostante tutte le difficoltà, i miei nonni sono rimasti uniti per tutta la vita.","B2","aussage"],
      ["Inwiefern prägt die eigene Familie den späteren Umgang mit Konflikten?","In che misura la propria famiglia influenza il modo in cui si affrontano i conflitti in seguito?","B2","frage"],
      ["Wäre es nicht sinnvoll, alte Familienstreitigkeiten endlich beizulegen?","Non sarebbe sensato risolvere finalmente le vecchie liti familiari?","B2","frage"],
      ["Wie hat sich eure Beziehung verändert, seit ihr Kinder habt?","Come è cambiato il vostro rapporto da quando avete dei figli?","B2","frage"],
      ["Obwohl meine Eltern sich scheiden ließen, blieben sie einander freundschaftlich verbunden.","Sebbene i miei genitori abbiano divorziato, sono rimasti legati da un rapporto amichevole.","B2","nebensatz"],
      ["Während meine Schwester Karriere machte, kümmerte sich mein Bruder um die Eltern.","Mentre mia sorella faceva carriera, mio fratello si occupava dei genitori.","B2","nebensatz"],
      ["Da meine Verwandten über ganz Europa verstreut leben, sehen wir uns nur zu besonderen Anlässen.","Poiché i miei parenti vivono sparsi per tutta l'Europa, ci vediamo solo in occasioni speciali.","B2","nebensatz"],
      ["Die Bindung zu den eigenen Geschwistern prägt oft das gesamte spätere Sozialverhalten.","Il legame con i propri fratelli spesso plasma tutto il comportamento sociale successivo.","C1","aussage"],
      ["Trotz jahrelanger Entfremdung fand die Familie am Sterbebett der Großmutter wieder zusammen.","Nonostante anni di allontanamento, la famiglia si è riunita al capezzale della nonna.","C1","aussage"],
      ["Der Generationenkonflikt zwischen ihr und ihrer Mutter zog sich wie ein roter Faden durch ihre Kindheit.","Il conflitto generazionale con sua madre attraversava come un filo conduttore tutta la sua infanzia.","C1","aussage"],
      ["Familiäre Verpflichtungen werden in dieser Kultur traditionell über individuelle Bedürfnisse gestellt.","In questa cultura gli obblighi familiari vengono tradizionalmente anteposti alle esigenze individuali.","C1","aussage"],
      ["Ihr Verhältnis zum Vater war zeitlebens von einer stillschweigenden Rivalität geprägt.","Il suo rapporto con il padre fu segnato per tutta la vita da una rivalità taciuta.","C1","aussage"],
      ["Die Vermögensaufteilung nach dem Tod des Patriarchen entzweite die Familie nachhaltig.","La divisione del patrimonio dopo la morte del patriarca divise la famiglia in modo duraturo.","C1","aussage"],
      ["Erst im Erwachsenenalter gelang es ihr, sich von den Erwartungen ihrer Eltern zu emanzipieren.","Solo da adulta riuscì a emanciparsi dalle aspettative dei genitori.","C1","aussage"],
      ["Wechselnde Bezugspersonen in der frühen Kindheit hinterlassen oft bleibende Spuren im Bindungsverhalten.","Figure di riferimento mutevoli nella prima infanzia lasciano spesso tracce durature nel comportamento di attaccamento.","C1","aussage"],
      ["Manche Familientraditionen überdauern selbst den radikalsten gesellschaftlichen Wandel.","Alcune tradizioni familiari sopravvivono persino al mutamento sociale più radicale.","C1","aussage"],
      ["Die Adoption ihres jüngeren Bruders wurde der Familie erst Jahre später offenbart.","L'adozione del fratello minore fu rivelata alla famiglia solo anni dopo.","C1","aussage"],
      ["Berufliche Ambitionen und familiäre Rücksichtnahme geraten in dieser Generation zunehmend in Konflikt.","In questa generazione le ambizioni professionali e i riguardi familiari entrano sempre più in conflitto.","C1","aussage"],
      ["Wie lässt sich der Zusammenhalt einer Großfamilie über geografische Distanzen hinweg aufrechterhalten?","Come si può mantenere la coesione di una famiglia numerosa nonostante le distanze geografiche?","C1","frage"],
      ["Inwieweit bestimmen ungeschriebene Familienregeln das Verhalten des Einzelnen?","In che misura le regole familiari non scritte determinano il comportamento del singolo?","C1","frage"],
      ["Lässt sich eine zerrüttete Geschwisterbeziehung im Erwachsenenalter überhaupt noch kitten?","Un rapporto tra fratelli ormai compromesso può ancora essere ricucito in età adulta?","C1","frage"],
      ["Während sie ihrer Familie stets loyal ergeben blieb, distanzierte sich ihr Bruder zunehmend von den gemeinsamen Wurzeln.","Mentre lei rimase sempre lealmente devota alla famiglia, suo fratello si allontanò sempre più dalle radici comuni.","C1","nebensatz"],
      ["Obschon die Geschwister denselben Werdegang durchlebt hatten, entwickelten sie grundverschiedene Lebensentwürfe.","Sebbene i fratelli avessero vissuto lo stesso percorso, svilupparono progetti di vita del tutto diversi.","C1","nebensatz"],
      ["Da die Großmutter als moralische Instanz der Familie galt, richtete sich jede wichtige Entscheidung nach ihrem Urteil.","Poiché la nonna era considerata l'autorità morale della famiglia, ogni decisione importante seguiva il suo giudizio.","C1","nebensatz"],
      ["Verwandtschaft ist bekanntlich kein Garant für gegenseitiges Verständnis.","È noto che i legami di sangue non garantiscono affatto una comprensione reciproca.","C2","aussage"],
      ["Die Familiengeschichte, über Generationen hinweg verschwiegen, kam erst durch einen zufälligen Fund ans Licht.","La storia familiare, taciuta per generazioni, venne alla luce solo grazie a un ritrovamento casuale.","C2","aussage"],
      ["Zwischen unbedingter Loyalität und dem Wunsch nach Selbstverwirklichung zerrieb sich manch eine Familienbeziehung.","Tra lealtà incondizionata e desiderio di realizzazione personale, non pochi rapporti familiari si sono logorati.","C2","aussage"],
      ["Die Rollenverteilung innerhalb der Familie wirkte lange über den Tod des Vaters hinaus fort.","La distribuzione dei ruoli in famiglia continuò a farsi sentire ben oltre la morte del padre.","C2","aussage"],
      ["Ihr Bruch mit der Familie erwies sich im Rückblick als schmerzhafte, aber notwendige Befreiung.","La sua rottura con la famiglia si rivelò, con il senno di poi, una liberazione dolorosa ma necessaria.","C2","aussage"],
      ["Die stillschweigend übernommene Fürsorgepflicht für die alternden Eltern lastet oft ungleich auf den Geschwistern verteilt.","Il dovere di cura verso i genitori anziani, assunto tacitamente, grava spesso in modo diseguale sui fratelli.","C2","aussage"],
      ["Familientraditionen entfalten ihre Wirkung meist gerade dann, wenn man sich am wenigsten dagegen wehren kann.","Le tradizioni familiari mostrano il loro effetto proprio quando meno ci si può opporre.","C2","aussage"],
      ["Erst der Verlust eines Elternteils offenbart oft, wie brüchig das Fundament einer Geschwisterbeziehung tatsächlich war.","Solo la perdita di un genitore rivela spesso quanto fragile fosse davvero il fondamento di un rapporto tra fratelli.","C2","aussage"],
      ["Was gemeinhin als bedingungslose Elternliebe gilt, erweist sich bei näherer Betrachtung oft als komplexes Geflecht aus Erwartung und Enttäuschung.","Ciò che comunemente si considera amore genitoriale incondizionato si rivela spesso, a ben guardare, un intreccio complesso di aspettative e delusioni.","C2","aussage"],
      ["Die stille Rivalität unter Geschwistern, kaum je offen ausgesprochen, prägt bisweilen ein ganzes Leben.","La sottile rivalità tra fratelli, raramente dichiarata apertamente, segna talvolta un'intera esistenza.","C2","aussage"],
      ["Familiäre Nähe und persönliche Autonomie auszubalancieren, gelingt wohl den wenigsten Angehörigen wirklich mühelos.","Bilanciare vicinanza familiare e autonomia personale riesce, in fondo, senza sforzo a ben pochi.","C2","aussage"],
      ["Inwiefern lässt sich überhaupt behaupten, dass man sich seine Familie nicht aussuchen kann und dennoch für sie verantwortlich bleibt?","In che misura si può davvero sostenere che non si sceglie la propria famiglia e ciononostante se ne resta responsabili?","C2","frage"],
      ["Wo verläuft die Grenze zwischen liebevoller Fürsorge und erdrückender familiärer Kontrolle?","Dove si colloca il confine tra premurosa sollecitudine e soffocante controllo familiare?","C2","frage"],
      ["Vermag eine späte Versöhnung überhaupt zu heilen, was über Jahrzehnte an Groll angehäuft wurde?","Una tardiva riconciliazione può davvero sanare il rancore accumulato nel corso di decenni?","C2","frage"],
      ["So sehr man sich auch von den Mustern der eigenen Familie zu lösen versucht, so hartnäckig kehren sie im eigenen Leben wieder.","Per quanto ci si sforzi di liberarsi dagli schemi della propria famiglia, altrettanto ostinatamente essi ritornano nella propria vita.","C2","nebensatz"],
      ["Während die einen Verwandtschaft als selbstverständliches Netz der Geborgenheit erleben, empfinden andere sie als lebenslange Bürde.","Mentre alcuni vivono la parentela come una rete di sicurezza data per scontata, altri la percepiscono come un fardello per tutta la vita.","C2","nebensatz"],
      ["Obgleich sich die Geschwister äußerlich kaum ähnelten, verband sie ein stillschweigendes Einverständnis, das keiner Worte bedurfte.","Sebbene i fratelli si somigliassero poco esteriormente, li univa un'intesa tacita che non aveva bisogno di parole.","C2","nebensatz"]
    ],
    "freizeit": [
      ["Ich spiele gern Fußball.","Mi piace giocare a calcio.","A1","aussage"],
      ["Am Samstag gehe ich schwimmen.","Sabato vado a nuotare.","A1","aussage"],
      ["Wir sehen heute Abend einen Film.","Stasera guardiamo un film.","A1","aussage"],
      ["Ich lese jeden Tag ein Buch.","Leggo un libro ogni giorno.","A1","aussage"],
      ["Mein Hobby ist Malen.","Il mio hobby è dipingere.","A1","aussage"],
      ["Er fährt gern Fahrrad.","A lui piace andare in bicicletta.","A1","aussage"],
      ["Wir gehen im Park spazieren.","Facciamo una passeggiata al parco.","A1","aussage"],
      ["Sie tanzt sehr gern.","A lei piace molto ballare.","A1","aussage"],
      ["Ich höre gern Musik.","Mi piace ascoltare musica.","A1","aussage"],
      ["Am Sonntag spielen wir Karten.","La domenica giochiamo a carte.","A1","aussage"],
      ["Mein Bruder spielt Gitarre.","Mio fratello suona la chitarra.","A1","aussage"],
      ["Was machst du am Wochenende?","Cosa fai nel weekend?","A1","frage"],
      ["Spielst du gern Tennis?","Ti piace giocare a tennis?","A1","frage"],
      ["Gehst du heute joggen?","Vai a correre oggi?","A1","frage"],
      ["Ich spiele Basketball, weil es Spaß macht.","Gioco a basket perché è divertente.","A1","nebensatz"],
      ["Ich gehe schwimmen, wenn es warm ist.","Vado a nuotare quando fa caldo.","A1","nebensatz"],
      ["Ich mag Fußball, aber ich spiele nicht gut.","Mi piace il calcio, ma non gioco bene.","A1","aussage"],
      ["Letztes Wochenende bin ich wandern gegangen.","Il fine settimana scorso sono andato a fare un'escursione.","A2","aussage"],
      ["Wir haben gestern zusammen Karten gespielt.","Ieri abbiamo giocato a carte insieme.","A2","aussage"],
      ["Ich habe ein neues Hobby angefangen.","Ho iniziato un nuovo hobby.","A2","aussage"],
      ["Meine Freundin hat mich zum Yoga eingeladen.","La mia amica mi ha invitato a fare yoga.","A2","aussage"],
      ["Wir sind am Samstag ins Kino gegangen.","Sabato siamo andati al cinema.","A2","aussage"],
      ["Er hat den ganzen Nachmittag Gitarre geübt.","Ha suonato la chitarra per tutto il pomeriggio.","A2","aussage"],
      ["Ich habe mir ein neues Fahrrad gekauft.","Mi sono comprato una nuova bicicletta.","A2","aussage"],
      ["Wir haben im Sommer oft im See gebadet.","In estate abbiamo fatto spesso il bagno nel lago.","A2","aussage"],
      ["Meine Mannschaft hat das Spiel am Sonntag gewonnen.","La mia squadra ha vinto la partita domenica.","A2","aussage"],
      ["Ich habe im Verein mit dem Klettern angefangen.","Ho iniziato ad arrampicare in un club.","A2","aussage"],
      ["Wir haben ein Picknick im Garten gemacht.","Abbiamo fatto un picnic in giardino.","A2","aussage"],
      ["Wie oft gehst du ins Fitnessstudio?","Quante volte vai in palestra?","A2","frage"],
      ["Hast du am Wochenende Zeit für einen Ausflug?","Hai tempo per una gita nel weekend?","A2","frage"],
      ["Warst du schon mal auf einem Konzert?","Sei mai stato a un concerto?","A2","frage"],
      ["Ich gehe ins Kino, wenn ein guter Film läuft.","Vado al cinema quando c'è un bel film.","A2","nebensatz"],
      ["Ich war müde, weil ich lange Sport gemacht habe.","Ero stanco perché avevo fatto sport a lungo.","A2","nebensatz"],
      ["Ich glaube, dass Malen sehr entspannend ist.","Penso che dipingere sia molto rilassante.","A2","nebensatz"],
      ["Nächstes Jahr werde ich einen Marathon laufen.","L'anno prossimo correrò una maratona.","B1","aussage"],
      ["Obwohl ich müde war, bin ich zum Training gegangen.","Anche se ero stanco, sono andato all'allenamento.","B1","aussage"],
      ["Meine Freizeit verbringe ich am liebsten in der Natur.","Preferisco trascorrere il tempo libero nella natura.","B1","aussage"],
      ["Wir werden im Urlaub einen Segelkurs machen.","In vacanza faremo un corso di vela.","B1","aussage"],
      ["Seit ich Yoga mache, schlafe ich viel besser.","Da quando pratico yoga, dormo molto meglio.","B1","aussage"],
      ["Ich habe mich einem Fotoklub angeschlossen, um neue Techniken zu lernen.","Mi sono iscritto a un club fotografico per imparare nuove tecniche.","B1","aussage"],
      ["Mein Vater sammelt seit Jahren alte Schallplatten.","Mio padre colleziona vecchi dischi in vinile da anni.","B1","aussage"],
      ["Wir werden nächsten Monat mit dem Chor auftreten.","Il mese prossimo ci esibiremo con il coro.","B1","aussage"],
      ["Beim Wandern entdecke ich immer neue Orte in der Umgebung.","Facendo escursioni scopro sempre posti nuovi nei dintorni.","B1","aussage"],
      ["Ich habe angefangen zu stricken, weil meine Oma es mir zeigen wollte.","Ho iniziato a lavorare a maglia perché mia nonna voleva insegnarmelo.","B1","aussage"],
      ["Unser Verein organisiert im Herbst ein großes Turnier.","Il nostro club organizza in autunno un grande torneo.","B1","aussage"],
      ["Wofür interessierst du dich in deiner Freizeit am meisten?","A cosa ti interessi di più nel tempo libero?","B1","frage"],
      ["Denkst du, dass regelmäßiger Sport wirklich glücklicher macht?","Pensi che fare sport regolarmente renda davvero più felici?","B1","frage"],
      ["Wie hast du zu deinem ungewöhnlichen Hobby gefunden?","Come sei arrivato a questo hobby insolito?","B1","frage"],
      ["Sobald das Wetter besser wird, gehen wir wieder segeln.","Appena il tempo migliora, torniamo a fare vela.","B1","nebensatz"],
      ["Weil ich mich beim Klettern verletzt hatte, musste ich pausieren.","Poiché mi ero fatto male arrampicando, ho dovuto fare una pausa.","B1","nebensatz"],
      ["Nachdem wir das Turnier gewonnen hatten, feierten wir bis spät in die Nacht.","Dopo aver vinto il torneo, abbiamo festeggiato fino a tarda notte.","B1","nebensatz"],
      ["Immer mehr Menschen entdecken das Angeln als entschleunigendes Hobby.","Sempre più persone scoprono la pesca come hobby rilassante.","B2","aussage"],
      ["Der Verein wird zunehmend von jüngeren Mitgliedern getragen.","Il club è sostenuto sempre più da membri giovani.","B2","aussage"],
      ["Ohne die wöchentlichen Chorproben würde mir ein wichtiger Ausgleich fehlen.","Senza le prove settimanali del coro mi mancherebbe un importante equilibrio.","B2","aussage"],
      ["Ihr Talent für das Zeichnen wurde erst durch einen Volkshochschulkurs entdeckt.","Il suo talento per il disegno è stato scoperto solo grazie a un corso serale.","B2","aussage"],
      ["Es wäre schön, wenn wir öfter gemeinsam wandern gehen könnten.","Sarebbe bello se potessimo andare più spesso insieme a fare escursioni.","B2","aussage"],
      ["Das Vereinsleben wird durch ehrenamtliches Engagement überhaupt erst möglich gemacht.","La vita associativa è resa possibile solo grazie all'impegno volontario.","B2","aussage"],
      ["Er widmet seine gesamte Freizeit dem Bau von Modellflugzeugen.","Dedica tutto il suo tempo libero alla costruzione di aeromodelli.","B2","aussage"],
      ["Meine Begeisterung fürs Klettern wurde durch einen einzigen Urlaub geweckt.","La mia passione per l'arrampicata è nata da una singola vacanza.","B2","aussage"],
      ["Zwischen Berufsalltag und Hobby einen guten Ausgleich zu finden, gelingt nicht jedem.","Trovare un buon equilibrio tra lavoro e hobby non riesce a tutti.","B2","aussage"],
      ["Beim Amateurtheater werden alljährlich zwei neue Stücke einstudiert.","Nel teatro amatoriale vengono provati ogni anno due nuovi spettacoli.","B2","aussage"],
      ["Manche Sammler investieren ein kleines Vermögen in ihre Leidenschaft.","Alcuni collezionisti investono un piccolo patrimonio nella loro passione.","B2","aussage"],
      ["Inwiefern trägt ein gemeinsames Hobby zum Zusammenhalt einer Freundschaft bei?","In che misura un hobby condiviso contribuisce alla coesione di un'amicizia?","B2","frage"],
      ["Sollte Freizeit nicht grundsätzlich frei von Leistungsdruck sein?","Il tempo libero non dovrebbe essere per principio privo di pressione da prestazione?","B2","frage"],
      ["Wie lässt sich ein anspruchsvolles Hobby mit einem vollen Terminkalender vereinbaren?","Come si può conciliare un hobby impegnativo con un'agenda piena?","B2","frage"],
      ["Während die einen im Garten Entspannung finden, suchen andere den Nervenkitzel beim Extremsport.","Mentre alcuni trovano relax in giardino, altri cercano l'emozione forte negli sport estremi.","B2","nebensatz"],
      ["Obwohl das Material teuer war, entschied sie sich für die professionelle Fotoausrüstung.","Sebbene il materiale fosse costoso, scelse l'attrezzatura fotografica professionale.","B2","nebensatz"],
      ["Da der Kletterpark im Winter geschlossen bleibt, weichen viele auf die Kletterhalle aus.","Poiché il parco avventura resta chiuso in inverno, molti si spostano nella palestra di arrampicata.","B2","nebensatz"],
      ["Die Rückbesinnung auf analoge Hobbys wie Töpfern oder Nähen erlebt derzeit einen bemerkenswerten Aufschwung.","Il ritorno a hobby analogici come la ceramica o il cucito vive attualmente una notevole rinascita.","C1","aussage"],
      ["Seine Leidenschaft für den Bergsport grenzte zunehmend an Besessenheit.","La sua passione per l'alpinismo confinava sempre più con l'ossessione.","C1","aussage"],
      ["Das gemeinsame Musizieren im Ensemble stiftet ein Zugehörigkeitsgefühl, das im Berufsalltag selten zu finden ist.","Il fare musica insieme in un ensemble crea un senso di appartenenza raramente riscontrabile nella vita lavorativa.","C1","aussage"],
      ["Die Kommerzialisierung des Wandersports hat dessen ursprünglich kontemplativen Charakter zunehmend verdrängt.","La commercializzazione dell'escursionismo ne ha progressivamente eroso il carattere contemplativo originario.","C1","aussage"],
      ["Ihr über Jahrzehnte gepflegtes Interesse an der Numismatik mündete schließlich in eine bedeutende Sammlung.","Il suo interesse per la numismatica, coltivato per decenni, sfociò infine in una collezione di rilievo.","C1","aussage"],
      ["Freizeitgestaltung wird in der modernen Leistungsgesellschaft zunehmend nach ökonomischen Maßstäben bewertet.","Nella moderna società della prestazione, il tempo libero viene sempre più valutato secondo criteri economici.","C1","aussage"],
      ["Das ehrenamtliche Engagement im Sportverein füllte eine Lücke, die der Beruf ihm nie hatte bieten können.","L'impegno volontario nella società sportiva colmava un vuoto che il lavoro non aveva mai potuto colmare.","C1","aussage"],
      ["Ihre Vorliebe für das Puppenspiel entwickelte sich unerwartet zu einer zweiten künstlerischen Berufung.","La sua predilezione per il teatro di marionette si trasformò inaspettatamente in una seconda vocazione artistica.","C1","aussage"],
      ["Das wiederentdeckte Interesse an handwerklichen Tätigkeiten spiegelt eine wachsende Sehnsucht nach Entschleunigung wider.","L'interesse riscoperto per le attività manuali riflette un crescente desiderio di rallentare i ritmi.","C1","aussage"],
      ["Der Vereinssport bot ihm über all die Jahre einen Rahmen, den seine wechselhafte Karriere nie hatte bieten können.","Lo sport in società gli offrì per tutti quegli anni un contesto che la sua carriera altalenante non era mai riuscita a garantire.","C1","aussage"],
      ["Die stille Konkurrenz unter Hobbyfotografen entfaltet sich meist erst bei der Betrachtung der fertigen Bilder.","La silenziosa competizione tra fotografi amatoriali emerge di solito solo osservando le foto finite.","C1","aussage"],
      ["Inwiefern lässt sich ein Hobby noch als Ausgleich bezeichnen, sobald es selbst zur Belastung wird?","In che misura un hobby può ancora dirsi tale nel momento in cui diventa esso stesso un peso?","C1","frage"],
      ["Wie erklärt sich die anhaltende Faszination für Sammelleidenschaften jenseits des rein materiellen Werts?","Come si spiega il fascino persistente delle passioni collezionistiche al di là del mero valore materiale?","C1","frage"],
      ["Verliert ein Hobby seinen erholsamen Charakter, sobald man es wettbewerbsmäßig betreibt?","Un hobby perde il suo carattere ricreativo nel momento in cui lo si pratica in modo agonistico?","C1","frage"],
      ["Während er seine Freizeit früher der Musik widmete, gilt seine Leidenschaft heute ausschließlich dem Gartenbau.","Mentre un tempo dedicava il tempo libero alla musica, oggi la sua passione è rivolta esclusivamente al giardinaggio.","C1","nebensatz"],
      ["Obschon das Hobby anfangs belächelt wurde, entwickelte es sich zu einer ernstzunehmenden Nebenbeschäftigung.","Sebbene l'hobby fosse inizialmente deriso, si trasformò in un'occupazione secondaria da prendere sul serio.","C1","nebensatz"],
      ["Da ihr das Reisen finanziell nicht möglich war, kompensierte sie dies durch ausgedehnte Kartenstudien und Reiseliteratur.","Poiché non poteva permettersi di viaggiare, compensava con approfonditi studi cartografici e letteratura di viaggio.","C1","nebensatz"],
      ["Müßiggang gilt gemeinhin als verpönt, dabei erweist er sich zunehmend als notwendiges Gegengewicht zur permanenten Erreichbarkeit.","L'ozio è comunemente malvisto, eppure si rivela sempre più un necessario contrappeso alla reperibilità permanente.","C2","aussage"],
      ["Die Vermarktung von Hobbys als Selbstoptimierungsprojekt läuft ihrem ursprünglichen Zweck geradezu diametral zuwider.","La commercializzazione degli hobby come progetti di auto-ottimizzazione contraddice quasi diametralmente il loro scopo originario.","C2","aussage"],
      ["Sein lebenslanges Sammeln botanischer Raritäten entpuppte sich posthum als wissenschaftlich bedeutsames Vermächtnis.","La sua raccolta, durata tutta la vita, di rarità botaniche si rivelò postuma un lascito scientificamente rilevante.","C2","aussage"],
      ["Die scheinbare Zwecklosigkeit mancher Freizeitbeschäftigungen entpuppt sich bei näherem Hinsehen als tief empfundenes Bedürfnis nach Sinnstiftung.","L'apparente inutilità di certe attività ricreative si rivela, a ben guardare, un profondo bisogno di dare senso alla vita.","C2","aussage"],
      ["Zwischen genuiner Leidenschaft und inszenierter Selbstdarstellung auf sozialen Medien verläuft die Grenze bei vielen Hobbys zunehmend fließend.","Tra passione autentica e autorappresentazione costruita sui social media, il confine si fa sempre più labile in molti hobby.","C2","aussage"],
      ["Ihre Hingabe an das Amateurtheater, von der Familie lange belächelt, mündete schließlich in eine anerkannte Bühnenkarriere.","La sua dedizione al teatro amatoriale, a lungo derisa dalla famiglia, sfociò infine in una carriera teatrale riconosciuta.","C2","aussage"],
      ["Der Rückzug ins private Bastelzimmer erwies sich rückblickend als stille Rebellion gegen die Erwartungen der Umwelt.","Il ritiro nel laboratorio hobbistico privato si rivelò, a posteriori, una silenziosa ribellione contro le aspettative altrui.","C2","aussage"],
      ["Was als bloßer Zeitvertreib begann, entwickelte sich unmerklich zu einer identitätsstiftenden Lebensaufgabe.","Ciò che iniziò come un semplice passatempo si trasformò impercettibilmente in un compito esistenziale identitario.","C2","aussage"],
      ["Die Sehnsucht nach unverzweckter Betätigung steht in eigentümlichem Widerspruch zu einer Kultur, die selbst die Muße noch optimieren will.","Il desiderio di un'attività priva di scopo utilitaristico è in singolare contraddizione con una cultura che vuole ottimizzare persino l'ozio.","C2","aussage"],
      ["Erst der Verlust der Sehkraft brachte ihn dazu, im Modellbau eine ihm zuvor unbekannte Form der Konzentration zu entdecken.","Solo la perdita della vista lo portò a scoprire nel modellismo una forma di concentrazione fino ad allora a lui sconosciuta.","C2","aussage"],
      ["Das Bedürfnis, Erlerntes weiterzugeben, verwandelte ihre einstmals private Leidenschaft für das Sticken in ein kleines Lehrgewerbe.","Il bisogno di tramandare ciò che aveva imparato trasformò la sua un tempo privata passione per il ricamo in una piccola attività didattica.","C2","aussage"],
      ["Lässt sich zwischen einem gesunden Hobby und einer heimlichen Sucht überhaupt eine trennscharfe Grenze ziehen?","Si può davvero tracciare un confine netto tra un hobby sano e una dipendenza nascosta?","C2","frage"],
      ["Inwiefern verrät die Wahl unserer Freizeitbeschäftigungen mehr über uns als unsere beruflichen Entscheidungen?","In che misura la scelta delle nostre attività nel tempo libero rivela più di noi rispetto alle scelte professionali?","C2","frage"],
      ["Verlernen wir nicht gerade, einen freien Nachmittag zu genießen, ohne ihn sofort mit irgendetwas füllen zu müssen?","Non stiamo forse disimparando a goderci un pomeriggio libero senza dover subito riempirlo con qualcosa?","C2","frage"],
      ["So sehr manche ihr Hobby als reine Erholung betrachten, so sehr wird es bei anderen zum heimlichen Ehrgeizfeld.","Per quanto alcuni considerino il proprio hobby puro relax, altrettanto esso diventa per altri un segreto campo di ambizione.","C2","nebensatz"],
      ["Während die eine Generation Freizeit noch als knappes Gut empfand, betrachtet die nächste sie als selbstverständliches Recht.","Mentre una generazione percepiva ancora il tempo libero come un bene scarso, la successiva lo considera un diritto scontato.","C2","nebensatz"],
      ["Obgleich sein Hobby von außen betrachtet skurril wirkte, verlieh es ihm eine innere Ruhe, die er sonst nirgends fand.","Sebbene il suo hobby apparisse bizzarro dall'esterno, gli conferiva una calma interiore che non trovava altrove.","C2","nebensatz"]
    ],
    "essen": [
      ["Ich trinke morgens Tee.","La mattina bevo il tè.","A1","aussage"],
      ["Wir essen jetzt zu Mittag.","Ora pranziamo.","A1","aussage"],
      ["Das Brot ist frisch.","Il pane è fresco.","A1","aussage"],
      ["Ich mag Äpfel sehr gern.","Mi piacciono molto le mele.","A1","aussage"],
      ["Sie kocht Nudeln mit Tomaten.","Lei cucina la pasta con i pomodori.","A1","aussage"],
      ["Er trinkt ein Glas Wasser.","Lui beve un bicchiere d'acqua.","A1","aussage"],
      ["Wir kaufen Milch und Eier.","Compriamo latte e uova.","A1","aussage"],
      ["Das Essen schmeckt sehr gut.","Il cibo è molto buono.","A1","aussage"],
      ["Ich esse gern Pizza.","Mi piace mangiare la pizza.","A1","aussage"],
      ["Meine Suppe ist noch heiß.","La mia zuppa è ancora calda.","A1","aussage"],
      ["Wir trinken Kaffee nach dem Essen.","Beviamo il caffè dopo il pasto.","A1","aussage"],
      ["Möchtest du noch etwas Wasser?","Vuoi ancora un po' d'acqua?","A1","frage"],
      ["Was isst du gern zum Frühstück?","Cosa ti piace mangiare a colazione?","A1","frage"],
      ["Schmeckt dir der Kuchen?","Ti piace la torta?","A1","frage"],
      ["Ich esse Obst, weil es gesund ist.","Mangio frutta perché fa bene.","A1","nebensatz"],
      ["Ich trinke Tee, wenn mir kalt ist.","Bevo il tè quando ho freddo.","A1","nebensatz"],
      ["Das Essen ist lecker, aber sehr scharf.","Il piatto è buono, ma molto piccante.","A1","aussage"],
      ["Gestern haben wir zusammen gekocht.","Ieri abbiamo cucinato insieme.","A2","aussage"],
      ["Ich habe im Restaurant Fisch bestellt.","Al ristorante ho ordinato del pesce.","A2","aussage"],
      ["Wir haben am Wochenende Kuchen gebacken.","Nel weekend abbiamo preparato una torta.","A2","aussage"],
      ["Sie hat mir ein neues Rezept gezeigt.","Mi ha mostrato una nuova ricetta.","A2","aussage"],
      ["Ich habe zu viel Salz in die Suppe getan.","Ho messo troppo sale nella zuppa.","A2","aussage"],
      ["Wir sind gestern in ein neues Café gegangen.","Ieri siamo andati in un nuovo bar.","A2","aussage"],
      ["Mein Vater hat den Grill angemacht.","Mio padre ha acceso la griglia.","A2","aussage"],
      ["Ich habe das Gemüse für das Abendessen geschnitten.","Ho tagliato le verdure per la cena.","A2","aussage"],
      ["Wir haben beim Italiener eine Pizza geteilt.","Dal ristorante italiano abbiamo diviso una pizza.","A2","aussage"],
      ["Ich habe vergessen, Brot zu kaufen.","Ho dimenticato di comprare il pane.","A2","aussage"],
      ["Meine Mutter hat den ganzen Tag für das Fest gekocht.","Mia madre ha cucinato tutto il giorno per la festa.","A2","aussage"],
      ["Was hast du gestern zu Abend gegessen?","Cosa hai mangiato ieri sera?","A2","frage"],
      ["Hast du schon mal Sushi probiert?","Hai mai provato il sushi?","A2","frage"],
      ["Isst du lieber süß oder herzhaft zum Frühstück?","A colazione preferisci il dolce o il salato?","A2","frage"],
      ["Ich koche gern, wenn ich Gäste eingeladen habe.","Mi piace cucinare quando ho invitato ospiti.","A2","nebensatz"],
      ["Ich habe nicht bestellt, weil ich keinen Hunger hatte.","Non ho ordinato perché non avevo fame.","A2","nebensatz"],
      ["Ich glaube, dass das Restaurant heute geschlossen ist.","Penso che il ristorante oggi sia chiuso.","A2","nebensatz"],
      ["Nächste Woche werden wir ein neues Restaurant ausprobieren.","La settimana prossima proveremo un nuovo ristorante.","B1","aussage"],
      ["Obwohl das Gericht ungewöhnlich klang, hat es hervorragend geschmeckt.","Anche se il piatto sembrava insolito, era davvero delizioso.","B1","aussage"],
      ["Seit ich vegetarisch esse, fühle ich mich viel fitter.","Da quando mangio vegetariano, mi sento molto più in forma.","B1","aussage"],
      ["Wir werden für die Hochzeit einen professionellen Koch engagieren.","Per il matrimonio assumeremo uno chef professionista.","B1","aussage"],
      ["Meine Großmutter kocht immer noch nach alten Familienrezepten.","Mia nonna cucina ancora secondo vecchie ricette di famiglia.","B1","aussage"],
      ["Ich habe angefangen, jeden Sonntag frisches Brot zu backen.","Ho iniziato a fare il pane fresco ogni domenica.","B1","aussage"],
      ["In diesem Lokal wird nur mit Zutaten aus der Region gekocht.","In questo locale si cucina solo con ingredienti locali.","B1","aussage"],
      ["Wir werden das Silvesteressen dieses Jahr gemeinsam vorbereiten.","Quest'anno prepareremo insieme la cena di Capodanno.","B1","aussage"],
      ["Der Kellner hat uns freundlich die Spezialitäten des Hauses empfohlen.","Il cameriere ci ha consigliato gentilmente le specialità della casa.","B1","aussage"],
      ["Ich versuche, weniger Zucker zu essen, weil es mir guttut.","Cerco di mangiare meno zucchero perché mi fa bene.","B1","aussage"],
      ["Unser Nachbar hat uns eingeladen, seinen selbstgemachten Wein zu probieren.","Il nostro vicino ci ha invitati ad assaggiare il suo vino fatto in casa.","B1","aussage"],
      ["Welches Gewürz passt am besten zu diesem Fischgericht?","Quale spezia si abbina meglio a questo piatto di pesce?","B1","frage"],
      ["Denkst du, dass man ohne Fleisch genauso gesund leben kann?","Pensi che si possa vivere altrettanto sani senza carne?","B1","frage"],
      ["Woher kennst du dieses überraschend leckere Rezept?","Da dove conosci questa ricetta sorprendentemente buona?","B1","frage"],
      ["Sobald der Teig aufgegangen ist, backen wir das Brot im Ofen.","Appena l'impasto è lievitato, cuociamo il pane nel forno.","B1","nebensatz"],
      ["Weil das Fleisch zu lange gebraten hatte, war es leider trocken.","Poiché la carne era stata cotta troppo a lungo, purtroppo era secca.","B1","nebensatz"],
      ["Nachdem wir das Menü durchgekostet hatten, bestellten wir noch einen Nachtisch.","Dopo aver assaggiato tutto il menù, abbiamo ordinato anche un dolce.","B1","nebensatz"],
      ["Regionale Küche wird zunehmend als Gegenentwurf zur industriellen Lebensmittelproduktion wahrgenommen.","La cucina regionale viene percepita sempre più come alternativa alla produzione alimentare industriale.","B2","aussage"],
      ["Das Menü wird täglich frisch nach dem Angebot des Marktes zusammengestellt.","Il menù viene composto ogni giorno fresco in base all'offerta del mercato.","B2","aussage"],
      ["Ohne die traditionelle Fermentation wäre diese Spezialität gar nicht denkbar.","Senza la tradizionale fermentazione questa specialità non sarebbe nemmeno concepibile.","B2","aussage"],
      ["Ihre Vorliebe für exotische Gewürze wurde durch ausgedehnte Reisen geprägt.","La sua predilezione per le spezie esotiche è stata plasmata da lunghi viaggi.","B2","aussage"],
      ["Es wäre wünschenswert, wenn mehr Restaurants auf Einwegverpackungen verzichten würden.","Sarebbe auspicabile che più ristoranti rinunciassero agli imballaggi monouso.","B2","aussage"],
      ["Die Weinkarte wird von einem erfahrenen Sommelier persönlich betreut.","La carta dei vini è curata personalmente da un sommelier esperto.","B2","aussage"],
      ["Er widmet sich seit Jahren der Wiederentdeckung vergessener Gemüsesorten.","Da anni si dedica alla riscoperta di varietà di verdure dimenticate.","B2","aussage"],
      ["Zwischen bodenständiger Hausmannskost und gehobener Küche einen Mittelweg zu finden, gelingt nur wenigen Köchen.","Trovare una via di mezzo tra cucina casalinga genuina e alta cucina riesce a pochi chef.","B2","aussage"],
      ["Die Zubereitung dieses Gerichts erfordert eine Geduld, die im hektischen Restaurantalltag selten aufgebracht wird.","La preparazione di questo piatto richiede una pazienza raramente presente nella frenetica routine di un ristorante.","B2","aussage"],
      ["In vielen Familien wird das sonntägliche Essen noch als heiliges Ritual behandelt.","In molte famiglie il pranzo della domenica viene ancora trattato come un rito sacro.","B2","aussage"],
      ["Der Trend zu pflanzlicher Ernährung verändert das Angebot der Supermärkte spürbar.","La tendenza verso l'alimentazione vegetale sta cambiando sensibilmente l'offerta dei supermercati.","B2","aussage"],
      ["Inwiefern beeinflusst die Art unserer Ernährung tatsächlich unser Wohlbefinden?","In che misura il tipo di alimentazione influisce davvero sul nostro benessere?","B2","frage"],
      ["Sollte man nicht generell mehr Wert auf die Herkunft der Lebensmittel legen?","Non si dovrebbe dare in generale più importanza alla provenienza degli alimenti?","B2","frage"],
      ["Wie lässt sich die Wertschätzung für selbst zubereitetes Essen wieder stärken?","Come si può rafforzare di nuovo l'apprezzamento per il cibo preparato in casa?","B2","frage"],
      ["Während die einen auf strenge Diäten setzen, plädieren andere für maßvollen Genuss ohne Verzicht.","Mentre alcuni puntano su diete rigide, altri sostengono un piacere moderato senza rinunce.","B2","nebensatz"],
      ["Obwohl das Restaurant teuer war, war jeder Gang die Ausgabe wert.","Sebbene il ristorante fosse costoso, ogni portata valeva la spesa.","B2","nebensatz"],
      ["Da die Zutaten ausschließlich saisonal eingekauft werden, ändert sich die Speisekarte jede Woche.","Poiché gli ingredienti vengono acquistati esclusivamente di stagione, il menù cambia ogni settimana.","B2","nebensatz"],
      ["Die Renaissance traditioneller Gärverfahren verweist auf ein wachsendes Bedürfnis nach kulinarischer Authentizität.","Il rinascimento delle tecniche di fermentazione tradizionali rimanda a un crescente bisogno di autenticità culinaria.","C1","aussage"],
      ["Ihre Kochkunst verband auf bemerkenswerte Weise bäuerliche Schlichtheit mit avantgardistischer Raffinesse.","La sua arte culinaria univa in modo notevole semplicità contadina e raffinatezza avanguardista.","C1","aussage"],
      ["Die zunehmende Ästhetisierung des Essens auf sozialen Medien verändert das Verhältnis zur Nahrung grundlegend.","La crescente estetizzazione del cibo sui social media sta cambiando radicalmente il rapporto con l'alimentazione.","C1","aussage"],
      ["Der Verzicht auf industriell verarbeitete Lebensmittel erwies sich für ihn als überraschend einschneidende Umstellung.","La rinuncia agli alimenti industrialmente lavorati si rivelò per lui un cambiamento sorprendentemente radicale.","C1","aussage"],
      ["Kulinarisches Wissen wurde in dieser Familie über Generationen hinweg mündlich weitergegeben, nie schriftlich fixiert.","Il sapere culinario in questa famiglia veniva tramandato oralmente di generazione in generazione, mai fissato per iscritto.","C1","aussage"],
      ["Die Globalisierung der Küchen hat regionale Spezialitäten teils bereichert, teils bis zur Unkenntlichkeit nivelliert.","La globalizzazione delle cucine ha in parte arricchito le specialità regionali, in parte le ha livellate fino a renderle irriconoscibili.","C1","aussage"],
      ["Sein Ruf als Koch gründete weniger auf Perfektion als auf einer unnachahmlichen Improvisationsgabe.","La sua fama di cuoco si fondava meno sulla perfezione che su un inimitabile talento improvvisativo.","C1","aussage"],
      ["Die neue Küchenphilosophie stellt bewusst das Unfertige und Rohe der Verarbeitung ins Zentrum.","La nuova filosofia culinaria mette deliberatamente al centro l'incompiuto e il grezzo della lavorazione.","C1","aussage"],
      ["Die Wiederentdeckung vergessener Innereiengerichte zeugt von einem gewandelten Verhältnis zur Nachhaltigkeit auf dem Teller.","La riscoperta di piatti a base di frattaglie dimenticati testimonia un mutato rapporto con la sostenibilità nel piatto.","C1","aussage"],
      ["Ihre kulinarische Ausbildung verdankte sie weniger einer Kochschule als der jahrelangen Mitarbeit in der elterlichen Küche.","La sua formazione culinaria la doveva meno a una scuola di cucina che agli anni trascorsi ad aiutare in cucina dai genitori.","C1","aussage"],
      ["Der Anspruch auf Perfektion in der Gourmetküche steht bisweilen der Spontaneität handwerklicher Kochkunst entgegen.","L'esigenza di perfezione nell'alta cucina si contrappone talvolta alla spontaneità dell'arte culinaria artigianale.","C1","aussage"],
      ["Inwieweit prägt die Esskultur eines Landes tatsächlich dessen kollektive Identität?","In che misura la cultura gastronomica di un paese plasma davvero la sua identità collettiva?","C1","frage"],
      ["Lässt sich Genuss überhaupt losgelöst von gesellschaftlichen Konventionen definieren?","Il piacere può essere definito davvero indipendentemente dalle convenzioni sociali?","C1","frage"],
      ["Wie verträgt sich der Anspruch auf Nachhaltigkeit mit der globalen Verfügbarkeit exotischer Zutaten?","Come si concilia l'esigenza di sostenibilità con la disponibilità globale di ingredienti esotici?","C1","frage"],
      ["Während die klassische Küche auf Präzision beharrt, setzt die moderne Gastronomie zunehmend auf kontrollierten Zufall.","Mentre la cucina classica insiste sulla precisione, la gastronomia moderna punta sempre più sul caso controllato.","C1","nebensatz"],
      ["Obschon das Rezept jahrhundertealt ist, wird es bis heute nahezu unverändert weitergegeben.","Sebbene la ricetta risalga a secoli fa, viene tramandata ancora oggi quasi immutata.","C1","nebensatz"],
      ["Da die Fermentation Wochen in Anspruch nimmt, wird dieses Gericht nur zu besonderen Anlässen zubereitet.","Poiché la fermentazione richiede settimane, questo piatto viene preparato solo in occasioni speciali.","C1","nebensatz"],
      ["Die Fetischisierung von Superfoods offenbart mehr über kulturelle Ängste als über tatsächliche ernährungsphysiologische Notwendigkeiten.","La feticizzazione dei superfood rivela più sulle ansie culturali che su reali necessità nutrizionali.","C2","aussage"],
      ["Was einst als bäuerliche Notküche galt, avancierte im Zuge der Gentrifizierung zur teuren Trenddelikatesse.","Ciò che un tempo era considerata cucina povera contadina è diventato, con la gentrificazione, una costosa prelibatezza di tendenza.","C2","aussage"],
      ["Die Sehnsucht nach kulinarischer Authentizität steht in eigentümlichem Widerspruch zur globalen Verfügbarkeit nahezu jeder Zutat.","Il desiderio di autenticità culinaria è in singolare contrasto con la disponibilità globale di quasi ogni ingrediente.","C2","aussage"],
      ["Zwischen genussvoller Verschwendung und asketischem Verzicht oszilliert das Verhältnis unserer Gesellschaft zum Essen fortwährend.","Il rapporto della nostra società con il cibo oscilla continuamente tra edonistico spreco e ascetica rinuncia.","C2","aussage"],
      ["Ihre stille Weigerung, dem Diktat der Diätkultur zu folgen, erwies sich rückblickend als bemerkenswerter Akt der Selbstbestimmung.","Il suo tacito rifiuto di sottostare al dettame della cultura delle diete si rivelò, retrospettivamente, un notevole atto di autodeterminazione.","C2","aussage"],
      ["Die industrielle Standardisierung des Geschmacks hat die sinnliche Vielfalt regionaler Küchen erheblich eingeebnet.","La standardizzazione industriale del gusto ha notevolmente appiattito la varietà sensoriale delle cucine regionali.","C2","aussage"],
      ["Was gemeinhin als bloßes Sättigungsbedürfnis abgetan wird, erweist sich bei genauerem Hinsehen als komplexes soziales Ritual.","Ciò che comunemente viene liquidato come mero bisogno di saziarsi si rivela, a un esame più attento, un complesso rito sociale.","C2","aussage"],
      ["Sein kulinarisches Erbe, lange von der Fachwelt übersehen, wurde erst posthum in seiner vollen Bedeutung gewürdigt.","Il suo lascito culinario, a lungo trascurato dagli esperti, fu apprezzato in tutta la sua importanza solo postumo.","C2","aussage"],
      ["Die Wiederkehr des Deftigen als kulinarischer Gegenentwurf zur asketischen Küche verweist auf eine tiefer sitzende Sehnsucht nach Bodenständigkeit.","Il ritorno dei sapori robusti come alternativa culinaria alla cucina ascetica rimanda a un desiderio più profondo di autenticità terrena.","C2","aussage"],
      ["Der Kult um handwerkliche Perfektion in der Konditorei kaschiert nicht selten den Verlust an spontaner Kochfreude im Alltag.","Il culto della perfezione artigianale in pasticceria nasconde non di rado la perdita della gioia spontanea di cucinare nella vita quotidiana.","C2","aussage"],
      ["Das kollektive Gedächtnis einer Region manifestiert sich nirgends deutlicher als in ihren unscheinbarsten, alltäglichsten Gerichten.","La memoria collettiva di una regione si manifesta in nessun luogo più chiaramente che nei suoi piatti più modesti e quotidiani.","C2","aussage"],
      ["Inwiefern lässt sich der wachsende Verzicht auf Fleisch als kollektives Schuldbewusstsein gegenüber der Natur deuten?","In che misura la crescente rinuncia alla carne può essere interpretata come senso collettivo di colpa verso la natura?","C2","frage"],
      ["Wo verläuft die Grenze zwischen kulinarischer Neugier und kultureller Aneignung fremder Traditionen?","Dove si colloca il confine tra curiosità culinaria e appropriazione culturale di tradizioni altrui?","C2","frage"],
      ["Vermag die Rückkehr zu einfachen Gerichten den Verlust an gemeinsamer Esskultur überhaupt aufzuwiegen?","Il ritorno a piatti semplici può davvero compensare la perdita di una cultura del mangiare condivisa?","C2","frage"],
      ["So sehr man sich auch um Nachhaltigkeit bemüht, so widersprüchlich bleibt der eigene Konsum exotischer Delikatessen.","Per quanto ci si sforzi verso la sostenibilità, altrettanto contraddittorio resta il proprio consumo di prelibatezze esotiche.","C2","nebensatz"],
      ["Während die eine Kultur das gemeinsame Mahl als sozialen Höhepunkt des Tages zelebriert, verkommt es andernorts zur beiläufigen Nebensache.","Mentre una cultura celebra il pasto condiviso come culmine sociale della giornata, altrove si riduce a un fatto accessorio.","C2","nebensatz"],
      ["Obgleich die Rezeptur seit Generationen unverändert weitergegeben wurde, entfaltet sie ihre Wirkung erst im Kontext des gemeinsamen Essens.","Sebbene la ricetta sia stata tramandata invariata per generazioni, essa dispiega il suo effetto solo nel contesto del pasto condiviso.","C2","nebensatz"]
    ],
    "reisen": [
      ["Ich fahre mit dem Zug nach Berlin.","Vado a Berlino in treno.","A1","aussage"],
      ["Der Bus kommt in fünf Minuten.","L'autobus arriva tra cinque minuti.","A1","aussage"],
      ["Wir fliegen im Sommer nach Italien.","In estate voliamo in Italia.","A1","aussage"],
      ["Mein Koffer ist sehr schwer.","La mia valigia è molto pesante.","A1","aussage"],
      ["Das Hotel liegt am Meer.","L'hotel si trova sul mare.","A1","aussage"],
      ["Ich kaufe eine Fahrkarte am Automaten.","Compro il biglietto alla macchinetta.","A1","aussage"],
      ["Der Flughafen ist weit von hier.","L'aeroporto è lontano da qui.","A1","aussage"],
      ["Wir packen heute die Koffer.","Oggi facciamo le valigie.","A1","aussage"],
      ["Ich fahre gern mit dem Auto.","Mi piace viaggiare in macchina.","A1","aussage"],
      ["Der Zug fährt von Gleis drei ab.","Il treno parte dal binario tre.","A1","aussage"],
      ["Wir übernachten in einem kleinen Hotel.","Dormiamo in un piccolo albergo.","A1","aussage"],
      ["Wo ist der Bahnhof?","Dov'è la stazione?","A1","frage"],
      ["Wann fährt der nächste Bus?","Quando parte il prossimo autobus?","A1","frage"],
      ["Fliegst du dieses Jahr in den Urlaub?","Voli in vacanza quest'anno?","A1","frage"],
      ["Ich nehme den Zug, weil er schnell ist.","Prendo il treno perché è veloce.","A1","nebensatz"],
      ["Wir fahren ans Meer, wenn die Sonne scheint.","Andiamo al mare quando c'è il sole.","A1","nebensatz"],
      ["Das Hotel ist schön, aber teuer.","L'hotel è bello, ma caro.","A1","aussage"],
      ["Letztes Jahr sind wir nach Spanien gereist.","L'anno scorso siamo andati in Spagna.","A2","aussage"],
      ["Ich habe mein Ticket schon online gekauft.","Ho già comprato il biglietto online.","A2","aussage"],
      ["Wir haben den Anschlusszug in Frankfurt verpasst.","A Francoforte abbiamo perso la coincidenza.","A2","aussage"],
      ["Mein Koffer ist am Flughafen verloren gegangen.","La mia valigia si è persa in aeroporto.","A2","aussage"],
      ["Wir sind mit dem Mietwagen durch die Berge gefahren.","Abbiamo attraversato le montagne con l'auto a noleggio.","A2","aussage"],
      ["Ich habe drei Wochen in Griechenland verbracht.","Ho passato tre settimane in Grecia.","A2","aussage"],
      ["Wir haben im Hotel ein günstiges Zimmer bekommen.","In hotel abbiamo trovato una stanza economica.","A2","aussage"],
      ["Ich habe mich auf der Reise sofort erkältet.","Durante il viaggio mi sono subito raffreddato.","A2","aussage"],
      ["Wir sind früh am Morgen losgefahren.","Siamo partiti presto la mattina.","A2","aussage"],
      ["Mein Freund hat mich vom Flughafen abgeholt.","Il mio amico mi ha preso in aeroporto.","A2","aussage"],
      ["Ich habe unterwegs viele Fotos gemacht.","Durante il viaggio ho fatto molte foto.","A2","aussage"],
      ["Wie lange dauert die Fahrt nach München?","Quanto dura il viaggio per Monaco?","A2","frage"],
      ["Hast du schon ein Zimmer reserviert?","Hai già prenotato una stanza?","A2","frage"],
      ["Warst du schon einmal in Japan?","Sei mai stato in Giappone?","A2","frage"],
      ["Ich fahre lieber mit dem Zug, weil ich das Fliegen nicht mag.","Preferisco viaggiare in treno perché non mi piace volare.","A2","nebensatz"],
      ["Wir kamen zu spät, weil der Bus Verspätung hatte.","Siamo arrivati tardi perché l'autobus era in ritardo.","A2","nebensatz"],
      ["Ich glaube, dass wir das Gate schon geschlossen haben.","Penso che il gate sia già chiuso.","A2","nebensatz"],
      ["Nächstes Jahr werden wir eine Rundreise durch Südamerika machen.","L'anno prossimo faremo un giro in Sudamerica.","B1","aussage"],
      ["Obwohl der Flug lange verspätet war, haben wir unseren Anschluss noch geschafft.","Anche se il volo era molto in ritardo, siamo riusciti comunque a prendere la coincidenza.","B1","aussage"],
      ["Seit ich viel reise, packe ich meinen Koffer viel effizienter.","Da quando viaggio molto, faccio la valigia in modo molto più efficiente.","B1","aussage"],
      ["Wir werden diesen Sommer mit dem Rucksack durch Osteuropa reisen.","Quest'estate viaggeremo con lo zaino attraverso l'Europa dell'Est.","B1","aussage"],
      ["Mein Reisepass ist letzten Monat abgelaufen.","Il mio passaporto è scaduto il mese scorso.","B1","aussage"],
      ["Ich habe angefangen, meine Reisen im Voraus genau zu planen.","Ho iniziato a pianificare i miei viaggi con largo anticipo.","B1","aussage"],
      ["An der Grenze wurden unsere Pässe gründlich kontrolliert.","Alla frontiera i nostri passaporti sono stati controllati accuratamente.","B1","aussage"],
      ["Wir werden nächste Woche mit dem Nachtzug nach Wien fahren.","La prossima settimana andremo a Vienna con il treno notturno.","B1","aussage"],
      ["Der Reiseleiter hat uns die wichtigsten Sehenswürdigkeiten der Stadt gezeigt.","La guida ci ha mostrato i principali luoghi d'interesse della città.","B1","aussage"],
      ["Ich versuche, auf Reisen möglichst wenig Gepäck mitzunehmen.","Cerco di portare il meno bagaglio possibile in viaggio.","B1","aussage"],
      ["Unser Zug hatte wegen eines technischen Defekts eine Stunde Verspätung.","Il nostro treno aveva un'ora di ritardo per un guasto tecnico.","B1","aussage"],
      ["Welches Verkehrsmittel eignet sich am besten für die Fahrt in die Innenstadt?","Quale mezzo di trasporto è più adatto per arrivare in centro?","B1","frage"],
      ["Denkst du, dass Reisen wirklich den Horizont erweitert?","Pensi che viaggiare allarghi davvero gli orizzonti?","B1","frage"],
      ["Wie hast du dich auf deiner langen Reise finanziell über Wasser gehalten?","Come ti sei mantenuto finanziariamente durante il tuo lungo viaggio?","B1","frage"],
      ["Sobald wir am Ziel angekommen waren, suchten wir sofort ein Restaurant.","Appena arrivati a destinazione, abbiamo subito cercato un ristorante.","B1","nebensatz"],
      ["Weil das Visum abgelehnt wurde, mussten wir unsere Reisepläne komplett ändern.","Poiché il visto è stato respinto, abbiamo dovuto cambiare completamente i piani di viaggio.","B1","nebensatz"],
      ["Nachdem wir tagelang gewandert waren, erreichten wir endlich die Küste.","Dopo aver camminato per giorni, abbiamo finalmente raggiunto la costa.","B1","nebensatz"],
      ["Individuelles Reisen abseits der Touristenpfade gewinnt zunehmend an Beliebtheit.","Il viaggio individuale lontano dai sentieri turistici sta guadagnando sempre più popolarità.","B2","aussage"],
      ["Der öffentliche Nahverkehr wird in dieser Stadt kontinuierlich ausgebaut.","Il trasporto pubblico locale viene continuamente ampliato in questa città.","B2","aussage"],
      ["Ohne eine sorgfältige Reiseversicherung hätten uns die Behandlungskosten ruiniert.","Senza un'assicurazione di viaggio accurata, le spese mediche ci avrebbero rovinato.","B2","aussage"],
      ["Ihre Reiseleidenschaft wurde durch ein Auslandssemester in ihrer Jugend geweckt.","La sua passione per i viaggi fu risvegliata da un semestre all'estero in gioventù.","B2","aussage"],
      ["Es wäre klug gewesen, die Unterkunft schon Monate im Voraus zu buchen.","Sarebbe stato saggio prenotare l'alloggio già mesi prima.","B2","aussage"],
      ["Die Reiseroute wurde kurzfristig wegen unerwarteter Unruhen im Land geändert.","L'itinerario è stato modificato all'ultimo momento a causa di disordini imprevisti nel paese.","B2","aussage"],
      ["Er widmet sich seit Jahren dem Fotografieren entlegener Bergregionen.","Da anni si dedica a fotografare regioni montane remote.","B2","aussage"],
      ["Zwischen Entdeckerfreude und ökologischer Verantwortung einen Ausgleich zu finden, fällt vielen Reisenden schwer.","Trovare un equilibrio tra voglia di scoperta e responsabilità ecologica risulta difficile per molti viaggiatori.","B2","aussage"],
      ["Die Sprachbarriere erwies sich als größere Herausforderung, als wir erwartet hatten.","La barriera linguistica si è rivelata una sfida più grande di quanto ci aspettassimo.","B2","aussage"],
      ["Der Flughafen wird derzeit erweitert, um dem steigenden Passagieraufkommen gerecht zu werden.","L'aeroporto viene attualmente ampliato per far fronte al crescente numero di passeggeri.","B2","aussage"],
      ["Viele Reisende schätzen mittlerweile die Langsamkeit einer Zugfahrt gegenüber der Hektik des Fliegens.","Molti viaggiatori ormai apprezzano la lentezza di un viaggio in treno rispetto alla frenesia del volo.","B2","aussage"],
      ["Inwiefern verändert das Reisen tatsächlich unsere Wahrnehmung der eigenen Kultur?","In che misura viaggiare cambia davvero la nostra percezione della propria cultura?","B2","frage"],
      ["Sollte man nicht grundsätzlich mehr auf klimafreundliche Verkehrsmittel umsteigen?","Non si dovrebbe in generale passare di più a mezzi di trasporto rispettosi del clima?","B2","frage"],
      ["Wie lässt sich Massentourismus mit dem Schutz empfindlicher Ökosysteme vereinbaren?","Come si può conciliare il turismo di massa con la tutela di ecosistemi fragili?","B2","frage"],
      ["Während die einen den Nervenkitzel des Backpackings suchen, bevorzugen andere den Komfort organisierter Pauschalreisen.","Mentre alcuni cercano l'emozione dello zaino in spalla, altri preferiscono il comfort dei viaggi organizzati.","B2","nebensatz"],
      ["Obwohl das Zugticket teurer war, entschieden wir uns wegen der Umwelt dagegen zu fliegen.","Sebbene il biglietto del treno fosse più caro, per motivi ambientali decidemmo di non volare.","B2","nebensatz"],
      ["Da der Flug annulliert wurde, mussten wir kurzfristig auf die Fähre umsteigen.","Poiché il volo era stato annullato, abbiamo dovuto passare all'ultimo momento al traghetto.","B2","nebensatz"],
      ["Die Demokratisierung des Reisens durch Billigflieger hat den Tourismus grundlegend verändert.","La democratizzazione dei viaggi grazie ai voli low-cost ha trasformato radicalmente il turismo.","C1","aussage"],
      ["Seine ausgedehnten Reisen durch entlegene Regionen prägten fortan seinen literarischen Stil.","I suoi lunghi viaggi in regioni remote plasmarono da allora in poi il suo stile letterario.","C1","aussage"],
      ["Die zunehmende Überfüllung beliebter Reiseziele stellt lokale Gemeinschaften vor erhebliche Herausforderungen.","Il crescente sovraffollamento delle mete turistiche popolari pone le comunità locali di fronte a sfide notevoli.","C1","aussage"],
      ["Der Wunsch nach unmittelbarer Erfahrung fremder Kulturen steht oft im Widerspruch zur bequemen Distanz des Pauschaltourismus.","Il desiderio di esperienza diretta di culture straniere è spesso in contrasto con la comoda distanza del turismo organizzato.","C1","aussage"],
      ["Ihre Reisetagebücher offenbaren eine bemerkenswerte Wandlung von naiver Neugier zu kritischer Reflexion.","I suoi diari di viaggio rivelano una notevole trasformazione da ingenua curiosità a riflessione critica.","C1","aussage"],
      ["Die Infrastruktur entlegener Regionen wurde durch den anhaltenden Zustrom von Reisenden nachhaltig überlastet.","L'infrastruttura di regioni remote è stata sovraccaricata in modo duraturo dall'afflusso costante di viaggiatori.","C1","aussage"],
      ["Sein Ruf als Weltenbummler gründete weniger auf der Zahl bereister Länder als auf der Tiefe seiner Beobachtungen.","La sua fama di giramondo si fondava meno sul numero di paesi visitati che sulla profondità delle sue osservazioni.","C1","aussage"],
      ["Die Romantisierung des Nomadentums verkennt häufig die prekären Bedingungen, unter denen es tatsächlich gelebt wird.","La romanticizzazione del nomadismo spesso ignora le condizioni precarie in cui esso viene realmente vissuto.","C1","aussage"],
      ["Die touristische Erschließung ehemals unzugänglicher Gebiete geht meist mit einem unwiderruflichen Wandel ihrer sozialen Gefüge einher.","Lo sviluppo turistico di zone un tempo inaccessibili comporta di solito un mutamento irreversibile dei loro assetti sociali.","C1","aussage"],
      ["Der bewusste Verzicht auf digitale Navigationshilfen verlieh seinen Reisen eine Unmittelbarkeit, die er zuvor vermisst hatte.","La rinuncia consapevole agli ausili di navigazione digitale conferì ai suoi viaggi un'immediatezza che prima gli era mancata.","C1","aussage"],
      ["Reisebeschreibungen des neunzehnten Jahrhunderts offenbaren oft mehr über die Vorurteile ihrer Verfasser als über die bereisten Länder selbst.","I resoconti di viaggio dell'Ottocento rivelano spesso più sui pregiudizi degli autori che sui paesi effettivamente visitati.","C1","aussage"],
      ["Inwieweit verändert die permanente Erreichbarkeit unterwegs den ursprünglichen Sinn des Reisens?","In che misura la reperibilità permanente in viaggio cambia il senso originario del viaggiare?","C1","frage"],
      ["Lässt sich echte kulturelle Begegnung überhaupt innerhalb der engen Grenzen einer Urlaubswoche verwirklichen?","Un vero incontro culturale può davvero realizzarsi entro i limiti angusti di una settimana di vacanza?","C1","frage"],
      ["Lohnt sich ein so langer Flug wirklich für ein paar Tage in der Sonne, wenn man die Klimabilanz bedenkt?","Vale davvero la pena di un volo così lungo per qualche giorno di sole, se si considera l'impatto climatico?","C1","frage"],
      ["Während der eine Reisende Sicherheit in der Routine sucht, findet der andere gerade im Unvorhergesehenen seinen Reiz.","Mentre un viaggiatore cerca sicurezza nella routine, l'altro trova proprio nell'imprevisto il suo fascino.","C1","nebensatz"],
      ["Obschon die Reise beschwerlich war, betrachtete sie die Strapazen im Nachhinein als bereichernden Teil der Erfahrung.","Sebbene il viaggio fosse faticoso, ella considerò a posteriori le difficoltà come parte arricchente dell'esperienza.","C1","nebensatz"],
      ["Da die Grenzen jahrelang geschlossen geblieben waren, erlangte das Reisen selbst wieder einen Hauch von Abenteuer.","Poiché i confini erano rimasti chiusi per anni, il viaggiare stesso riacquistò un tocco di avventura.","C1","nebensatz"],
      ["Die Sehnsucht nach dem Fremden erweist sich bei genauerem Hinsehen oft als Suche nach einer verlorenen Version des Eigenen.","Il desiderio dell'altrove si rivela spesso, a un esame più attento, una ricerca di una versione perduta di sé.","C2","aussage"],
      ["Was einst als beschwerliche Pilgerreise galt, wurde im Zuge der touristischen Erschließung zur bequemen Wochenendattraktion herabgestuft.","Ciò che un tempo era un faticoso pellegrinaggio è stato ridotto, con lo sviluppo turistico, a una comoda attrazione da fine settimana.","C2","aussage"],
      ["Zwischen dem Versprechen grenzenloser Freiheit und der Realität standardisierter Reiseabläufe klafft eine kaum zu überbrückende Lücke.","Tra la promessa di libertà senza confini e la realtà di procedure di viaggio standardizzate si apre un divario difficilmente colmabile.","C2","aussage"],
      ["Die Kommodifizierung entlegener Landschaften als Fotokulisse hat deren ursprüngliche Bedeutung für die dort lebenden Menschen zunehmend verdrängt.","La mercificazione di paesaggi remoti come scenografia fotografica ha progressivamente eroso il loro significato originario per chi vi abita.","C2","aussage"],
      ["Ihr Entschluss, ohne festen Wohnsitz umherzuziehen, erwies sich rückblickend als radikale Absage an gesellschaftliche Sesshaftigkeitsnormen.","La sua decisione di vagabondare senza fissa dimora si rivelò, retrospettivamente, un radicale rifiuto delle norme sociali di stanzialità.","C2","aussage"],
      ["Die Beschleunigung des globalen Reiseverkehrs hat paradoxerweise das eigentliche Erleben der Reise selbst zunehmend entwertet.","L'accelerazione del traffico turistico globale ha paradossalmente svalutato sempre più l'esperienza autentica del viaggio stesso.","C2","aussage"],
      ["Was gemeinhin als bloßer Ortswechsel abgetan wird, entpuppt sich bei näherer Betrachtung als tiefgreifender Prozess der Selbstbefragung.","Ciò che comunemente viene liquidato come mero cambio di luogo si rivela, a un esame più attento, un profondo processo di autoanalisi.","C2","aussage"],
      ["Sein rastloses Umherziehen, von der Familie lange als Flucht gedeutet, entpuppte sich später als konsequente Lebensform.","Il suo incessante vagabondare, a lungo interpretato dalla famiglia come fuga, si rivelò poi una coerente scelta di vita.","C2","aussage"],
      ["Die Vorstellung, sich durch bloße Ortsveränderung neu erfinden zu können, erweist sich als ebenso hartnäckiger wie trügerischer Mythos.","L'idea di potersi reinventare tramite il semplice cambio di luogo si rivela un mito tanto tenace quanto illusorio.","C2","aussage"],
      ["Die stille Erschöpfung nach wochenlangem Unterwegssein steht in eigentümlichem Kontrast zum vermeintlich erholsamen Zweck des Reisens.","La silenziosa spossatezza dopo settimane in viaggio è in singolare contrasto con lo scopo presuntamente rigenerante del viaggiare.","C2","aussage"],
      ["Erst die Rückkehr in vertraute Umgebung offenbart oft, wie sehr einen die Fremde im Innersten verändert hat.","Solo il ritorno in un ambiente familiare rivela spesso quanto l'esperienza dell'altrove ci abbia trasformati nel profondo.","C2","aussage"],
      ["Inwiefern lässt sich der wachsende Overtourismus als Symptom eines tieferliegenden gesellschaftlichen Bedürfnisses nach Flucht deuten?","In che misura il crescente overtourism può essere interpretato come sintomo di un più profondo bisogno sociale di fuga?","C2","frage"],
      ["Wo verläuft die Grenze zwischen respektvoller Neugier auf fremde Lebenswelten und deren touristischer Vereinnahmung?","Dove si colloca il confine tra rispettosa curiosità verso mondi altrui e la loro appropriazione turistica?","C2","frage"],
      ["Vermag das Reisen überhaupt jenen inneren Wandel zu bewirken, den ihm die Reiseliteratur seit jeher zuschreibt?","Il viaggio è davvero in grado di produrre quel mutamento interiore che la letteratura di viaggio gli attribuisce da sempre?","C2","frage"],
      ["So sehr man sich auch der Illusion grenzenloser Mobilität hingibt, so unübersehbar bleiben deren ökologische Folgekosten.","Per quanto ci si abbandoni all'illusione di una mobilità senza confini, altrettanto evidenti restano i suoi costi ecologici.","C2","nebensatz"],
      ["Während die eine Generation das Reisen als seltenes Privileg begriff, empfindet die nächste es als selbstverständlichen Anspruch.","Mentre una generazione concepiva il viaggiare come raro privilegio, la successiva lo percepisce come un diritto scontato.","C2","nebensatz"],
      ["Obgleich die Route minutiös geplant war, entfaltete die Reise ihren eigentlichen Reiz erst durch die unvorhergesehenen Abweichungen davon.","Sebbene l'itinerario fosse pianificato nei minimi dettagli, il viaggio dispiegò il suo vero fascino solo attraverso le deviazioni impreviste.","C2","nebensatz"]
    ],
    "bildung": [
      ["Ich gehe jeden Tag zur Schule.","Vado a scuola ogni giorno.","A1","aussage"],
      ["Der Lehrer schreibt an die Tafel.","L'insegnante scrive alla lavagna.","A1","aussage"],
      ["Wir lernen heute neue Wörter.","Oggi impariamo parole nuove.","A1","aussage"],
      ["Meine Schwester macht ihre Hausaufgaben.","Mia sorella fa i compiti.","A1","aussage"],
      ["Der Unterricht beginnt um acht Uhr.","La lezione inizia alle otto.","A1","aussage"],
      ["Ich habe einen neuen Bleistift.","Ho una matita nuova.","A1","aussage"],
      ["Die Kinder sitzen im Klassenzimmer.","I bambini sono seduti in classe.","A1","aussage"],
      ["Wir schreiben heute einen Test.","Oggi scriviamo un test.","A1","aussage"],
      ["Mein Freund lernt Deutsch und Englisch.","Il mio amico impara il tedesco e l'inglese.","A1","aussage"],
      ["Die Pause dauert zehn Minuten.","La pausa dura dieci minuti.","A1","aussage"],
      ["Ich lese jeden Abend ein Buch.","Ogni sera leggo un libro.","A1","aussage"],
      ["Wann beginnt die Schule?","Quando inizia la scuola?","A1","frage"],
      ["Hast du deine Hausaufgaben dabei?","Hai i compiti con te?","A1","frage"],
      ["Wer ist dein Lehrer?","Chi è il tuo insegnante?","A1","frage"],
      ["Ich bin froh, weil ich heute keine Hausaufgaben habe.","Sono contento perché oggi non ho compiti.","A1","nebensatz"],
      ["Er sagt, dass er die Antwort weiß.","Lui dice che sa la risposta.","A1","nebensatz"],
      ["Wir gehen nach Hause, wenn der Unterricht endet.","Andiamo a casa quando finisce la lezione.","A1","nebensatz"],
      ["Gestern habe ich eine Deutschprüfung geschrieben.","Ieri ho fatto un compito di tedesco.","A2","aussage"],
      ["Der Lehrer hat unsere Hefte korrigiert.","L'insegnante ha corretto i nostri quaderni.","A2","aussage"],
      ["Ich gehe jeden Morgen mit dem Bus zur Schule.","Ogni mattina vado a scuola in autobus.","A2","aussage"],
      ["Wir haben letzte Woche ein neues Buch bekommen.","La settimana scorsa abbiamo ricevuto un libro nuovo.","A2","aussage"],
      ["Meine Klasse macht einen Ausflug ins Museum.","La mia classe fa una gita al museo.","A2","aussage"],
      ["Ich habe meine Hausaufgaben schon gemacht.","Ho già fatto i compiti.","A2","aussage"],
      ["Der Sportunterricht findet in der Turnhalle statt.","La lezione di educazione fisica si svolge in palestra.","A2","aussage"],
      ["Wir haben letztes Jahr Französisch angefangen.","L'anno scorso abbiamo iniziato il francese.","A2","aussage"],
      ["Die Lehrerin erklärt die Grammatik sehr geduldig.","L'insegnante spiega la grammatica con molta pazienza.","A2","aussage"],
      ["Ich habe für die Prüfung viel gelernt.","Ho studiato molto per l'esame.","A2","aussage"],
      ["Am Freitag haben wir keine letzte Stunde.","Il venerdì non abbiamo l'ultima ora di lezione.","A2","aussage"],
      ["Hast du die Prüfung schon geschrieben?","Hai già fatto l'esame?","A2","frage"],
      ["Welches Fach magst du am liebsten?","Quale materia ti piace di più?","A2","frage"],
      ["Wie war der Test gestern?","Com'era il test ieri?","A2","frage"],
      ["Als der Lehrer ins Klassenzimmer kam, waren alle Schüler leise.","Quando l'insegnante è entrato in classe, tutti gli studenti erano in silenzio.","A2","nebensatz"],
      ["Er hat gesagt, dass er die Prüfung bestanden hat.","Ha detto che ha superato l'esame.","A2","nebensatz"],
      ["Wir gehen in die Bibliothek, wenn wir Zeit haben.","Andiamo in biblioteca quando abbiamo tempo.","A2","nebensatz"],
      ["Ich lerne jeden Tag Vokabeln, denn die Prüfung ist bald.","Studio il vocabolario ogni giorno, perché l'esame è vicino.","B1","aussage"],
      ["Nächstes Jahr werde ich auf eine andere Schule wechseln.","L'anno prossimo cambierò scuola.","B1","aussage"],
      ["Wir haben letztes Semester viel über Geschichte gelernt und es hat uns gut gefallen.","Il semestre scorso abbiamo imparato molto sulla storia e ci è piaciuto.","B1","aussage"],
      ["Der Lehrer korrigiert die Prüfungen und gibt uns bald die Noten zurück.","L'insegnante corregge gli esami e presto ci restituisce i voti.","B1","aussage"],
      ["Ich habe beschlossen, in den Ferien intensiv zu lernen.","Ho deciso di studiare intensamente durante le vacanze.","B1","aussage"],
      ["Am Ende des Schuljahres bekommen wir ein Zeugnis.","Alla fine dell'anno scolastico riceviamo la pagella.","B1","aussage"],
      ["Die Klasse wird nächste Woche eine Prüfung in Mathematik schreiben.","La prossima settimana la classe farà un compito di matematica.","B1","aussage"],
      ["Ich habe mir vorgenommen, mehr Bücher zu lesen.","Mi sono proposto di leggere più libri.","B1","aussage"],
      ["Unsere Lehrerin ist krank, deshalb fällt der Unterricht aus.","La nostra insegnante è malata, quindi la lezione salta.","B1","aussage"],
      ["In der Prüfung müssen wir einen Aufsatz schreiben und einige Fragen beantworten.","Nell'esame dobbiamo scrivere un tema e rispondere ad alcune domande.","B1","aussage"],
      ["Ich habe mich auf die Prüfung gut vorbereitet und bin ziemlich sicher.","Mi sono preparato bene per l'esame e sono abbastanza sicuro.","B1","aussage"],
      ["Wirst du die Prüfung am Freitag mitschreiben?","Farai anche tu l'esame venerdì?","B1","frage"],
      ["Warum hast du die Hausaufgaben nicht gemacht?","Perché non hai fatto i compiti?","B1","frage"],
      ["Welches Fach fällt dir am schwersten?","Quale materia ti risulta più difficile?","B1","frage"],
      ["Ich gehe zur Nachhilfe, weil ich in Mathe Probleme habe.","Vado a ripetizioni perché ho difficoltà in matematica.","B1","nebensatz"],
      ["Wenn ich die Prüfung bestehe, werde ich sehr erleichtert sein.","Se supererò l'esame, sarò molto sollevato.","B1","nebensatz"],
      ["Der Lehrer hat erklärt, dass die Prüfung verschoben wird.","L'insegnante ha spiegato che l'esame verrà rinviato.","B1","nebensatz"],
      ["Die Prüfungsergebnisse werden morgen veröffentlicht.","I risultati dell'esame saranno pubblicati domani.","B2","aussage"],
      ["An unserer Schule wird ab nächstem Jahr ein neues Fach eingeführt.","Nella nostra scuola, dal prossimo anno, verrà introdotta una nuova materia.","B2","aussage"],
      ["Ohne die Hilfe meines Tutors hätte ich die Prüfung wahrscheinlich nicht bestanden.","Senza l'aiuto del mio tutor, probabilmente non avrei superato l'esame.","B2","aussage"],
      ["Die Bibliothek wird derzeit renoviert, deshalb lernen wir im Computerraum.","La biblioteca è attualmente in ristrutturazione, perciò studiamo nell'aula computer.","B2","aussage"],
      ["Viele Schüler bereiten sich schon Monate im Voraus auf das Abitur vor.","Molti studenti si preparano alla maturità già con mesi di anticipo.","B2","aussage"],
      ["Der Vortrag wurde von einer ehemaligen Schülerin gehalten.","La conferenza è stata tenuta da un'ex studentessa.","B2","aussage"],
      ["Nächstes Semester werden zusätzliche Kurse in Informatik angeboten.","Il prossimo semestre verranno offerti corsi aggiuntivi di informatica.","B2","aussage"],
      ["Trotz intensiver Vorbereitung war die Prüfung schwieriger als erwartet.","Nonostante una preparazione intensa, l'esame è stato più difficile del previsto.","B2","aussage"],
      ["Es wäre sinnvoll, die Unterrichtszeiten zu überdenken.","Sarebbe utile ripensare gli orari delle lezioni.","B2","aussage"],
      ["Die neuen Lehrpläne wurden von einer Expertenkommission entwickelt.","I nuovi programmi scolastici sono stati sviluppati da una commissione di esperti.","B2","aussage"],
      ["Immer mehr Schulen setzen digitale Lernmittel im Unterricht ein.","Sempre più scuole utilizzano strumenti didattici digitali durante le lezioni.","B2","aussage"],
      ["Ist das neue Fach schon in den Stundenplan aufgenommen worden?","La nuova materia è già stata inserita nell'orario?","B2","frage"],
      ["Würdest du dich noch einmal für dasselbe Studienfach entscheiden?","Sceglieresti di nuovo la stessa facoltà?","B2","frage"],
      ["Wie wird die mündliche Prüfung eigentlich bewertet?","Come viene valutato esattamente l'esame orale?","B2","frage"],
      ["Obwohl er sich kaum vorbereitet hatte, bestand er die Prüfung mit Bravour.","Sebbene si fosse preparato a malapena, ha superato l'esame a pieni voti.","B2","nebensatz"],
      ["Die Schule hat angekündigt, dass ab Herbst eine Ganztagsbetreuung eingeführt wird.","La scuola ha annunciato che dall'autunno verrà introdotto un doposcuola.","B2","nebensatz"],
      ["Während die einen für die Prüfung büffeln, verlassen sich andere auf ihr Talent.","Mentre alcuni sgobbano per l'esame, altri contano sul proprio talento.","B2","nebensatz"],
      ["Der Bildungsweg vieler Studierender gestaltet sich heute weitaus individueller als früher.","Il percorso formativo di molti studenti oggi è molto più individuale rispetto al passato.","C1","aussage"],
      ["Gute Lehrkräfte üben zweifellos den größten Einfluss auf den Lernerfolg aus.","I bravi insegnanti esercitano senza dubbio la maggiore influenza sul successo scolastico.","C1","aussage"],
      ["Angesichts sinkender Prüfungsergebnisse wird eine Reform des Bewertungssystems immer dringlicher.","Visti i risultati d'esame in calo, una riforma del sistema di valutazione diventa sempre più urgente.","C1","aussage"],
      ["Die Universität hat sich zum Ziel gesetzt, die Abbrecherquote deutlich zu senken.","L'università si è posta l'obiettivo di ridurre notevolmente il tasso di abbandono.","C1","aussage"],
      ["Mit dem neuen Curriculum wurde ein längst überfälliger Schritt in Richtung Praxisnähe vollzogen.","Con il nuovo curriculum è stato compiuto un passo da tempo atteso verso una maggiore concretezza pratica.","C1","aussage"],
      ["Ihm ist es gelungen, trotz widriger Umstände seinen Abschluss mit Auszeichnung zu machen.","È riuscito a laurearsi con lode nonostante le circostanze avverse.","C1","aussage"],
      ["Die Debatte über Noten als Leistungsmaßstab reißt nicht ab.","Il dibattito sui voti come metro di valutazione non si placa.","C1","aussage"],
      ["Vielen Absolventen fällt der Übergang vom Studium ins Berufsleben schwerer als gedacht.","Per molti laureati il passaggio dagli studi alla vita professionale risulta più difficile del previsto.","C1","aussage"],
      ["Der Rektor hob in seiner Rede die Bedeutung lebenslangen Lernens hervor.","Nel suo discorso, il rettore ha sottolineato l'importanza dell'apprendimento permanente.","C1","aussage"],
      ["Es bedarf eines grundlegenden Umdenkens, um das Bildungssystem zukunftsfähig zu machen.","Serve un ripensamento radicale per rendere il sistema scolastico pronto al futuro.","C1","aussage"],
      ["Am Ende zahlte sich die jahrelange Mühe aus, und sie bestand die Doktorprüfung mit Bravour.","Alla fine anni di impegno sono stati ripagati e lei ha superato l'esame di dottorato con il massimo dei voti.","C1","aussage"],
      ["Inwiefern lässt sich der Erfolg eines Bildungssystems überhaupt messen?","In che misura si può realmente misurare il successo di un sistema scolastico?","C1","frage"],
      ["Wie zeitgemäß ist eigentlich noch ein Notensystem, das vor allem Fehler bestraft, statt Lernfortschritt zu fördern?","Quanto è ancora attuale, in fondo, un sistema di voti che punisce soprattutto gli errori invece di premiare i progressi nell'apprendimento?","C1","frage"],
      ["Woran liegt es, dass so viele Studierende ihr Studium abbrechen?","Come mai così tanti studenti abbandonano gli studi?","C1","frage"],
      ["Obschon das Bildungssystem in den letzten Jahren reformiert wurde, bleiben strukturelle Probleme bestehen.","Sebbene il sistema scolastico sia stato riformato negli ultimi anni, permangono problemi strutturali.","C1","nebensatz"],
      ["Man geht davon aus, dass digitale Kompetenzen künftig über den beruflichen Erfolg mitentscheiden werden.","Si presume che le competenze digitali determineranno in futuro, tra l'altro, il successo professionale.","C1","nebensatz"],
      ["Nachdem sie ihr Studium mit Bestnoten abgeschlossen hatte, wurde ihr ein Stipendium für die Promotion angeboten.","Dopo aver concluso gli studi con il massimo dei voti, le è stata offerta una borsa di studio per il dottorato.","C1","nebensatz"],
      ["Bildung entscheidet nach wie vor maßgeblich über gesellschaftliche Teilhabe – daran hat sich trotz aller Reformen wenig geändert.","L'istruzione continua a determinare in modo decisivo la partecipazione sociale: nonostante tutte le riforme, ben poco è cambiato.","C2","aussage"],
      ["Wer glaubt, gute Zeugnisse allein garantierten beruflichen Erfolg, irrt sich gewaltig.","Chi crede che dei buoni voti da soli garantiscano il successo professionale si sbaglia di grosso.","C2","aussage"],
      ["Das Renommee einer Universität sagt wenig über die tatsächliche Qualität der Lehre aus.","La reputazione di un'università dice poco sulla qualità effettiva dell'insegnamento.","C2","aussage"],
      ["Bildungsungleichheit lässt sich nicht allein durch mehr Geld beheben, sondern erfordert ein Umdenken auf vielen Ebenen.","Le disuguaglianze educative non si risolvono soltanto con più fondi, ma richiedono un cambio di mentalità su più livelli.","C2","aussage"],
      ["Ihm gebührt Anerkennung, denn er hat die akademische Laufbahn trotz widrigster Umstände nicht aufgegeben.","Merita riconoscimento per non aver abbandonato la carriera accademica nonostante le circostanze più avverse.","C2","aussage"],
      ["Selten hat eine Bildungsreform derart kontroverse Reaktionen hervorgerufen wie die jüngste.","Raramente una riforma scolastica ha suscitato reazioni tanto controverse quanto l'ultima.","C2","aussage"],
      ["Zwischen Theorie und Praxis klafft an vielen Hochschulen nach wie vor eine erhebliche Lücke.","Tra teoria e pratica, in molte università, permane tuttora un divario considerevole.","C2","aussage"],
      ["Der eklatante Lehrermangel dürfte die Unterrichtsqualität langfristig erheblich beeinträchtigen.","L'evidente carenza di insegnanti rischia di compromettere seriamente la qualità dell'insegnamento nel lungo periodo.","C2","aussage"],
      ["Kaum ein Thema wird in Bildungskreisen so kontrovers diskutiert wie die Frage der Notengebung.","Difficilmente un tema viene discusso in ambito scolastico in modo così controverso quanto la questione dei voti.","C2","aussage"],
      ["Die Digitalisierung der Schulen kommt, allen Ankündigungen zum Trotz, nur schleppend voran.","La digitalizzazione delle scuole, nonostante tutti gli annunci, procede solo a rilento.","C2","aussage"],
      ["Am Ende entscheidet oft weniger das Zeugnis als die Fähigkeit, sich stetig weiterzubilden.","Alla fine, spesso conta meno il diploma che la capacità di continuare a formarsi.","C2","aussage"],
      ["Ist es nicht bezeichnend, dass ausgerechnet in wohlhabenden Ländern die Bildungsschere weiter auseinanderklafft?","Non è significativo che proprio nei paesi ricchi il divario educativo continui ad allargarsi?","C2","frage"],
      ["Wie ließe sich der nach wie vor gravierende Einfluss der sozialen Herkunft auf den Bildungserfolg erklären?","Come si potrebbe spiegare l'influenza tuttora rilevante dell'origine sociale sul successo scolastico?","C2","frage"],
      ["Wann, wenn nicht jetzt, sollte das Bildungssystem grundlegend reformiert werden?","Se non ora, quando si dovrebbe riformare radicalmente il sistema scolastico?","C2","frage"],
      ["Obgleich viele Studien belegen, dass kleinere Klassen den Lernerfolg begünstigen, scheitert die Umsetzung oft am Geld.","Sebbene molti studi dimostrino che classi più piccole favoriscono il successo scolastico, l'attuazione spesso fallisce per mancanza di fondi.","C2","nebensatz"],
      ["Man mag einwenden, dass Talent nicht durch Fleiß ersetzt werden kann, doch ohne Ausdauer bleibt selbst das größte Talent ungenutzt.","Si potrebbe obiettare che il talento non può essere sostituito dall'impegno, eppure senza costanza anche il talento più grande resta inespresso.","C2","nebensatz"],
      ["Während die einen für ein Ende der Notengebung plädieren, warnen andere davor, dass dadurch jeglicher Leistungsanreiz verlorenginge.","Mentre alcuni si battono per l'abolizione dei voti, altri avvertono che ciò farebbe venire meno ogni stimolo al rendimento.","C2","nebensatz"]
    ],
    "gesundheit": [
      ["Mir tut der Kopf weh.","Mi fa male la testa.","A1","aussage"],
      ["Ich bin heute krank.","Oggi sono malato.","A1","aussage"],
      ["Der Arzt untersucht mich.","Il medico mi visita.","A1","aussage"],
      ["Ich nehme jeden Tag eine Tablette.","Prendo una compressa ogni giorno.","A1","aussage"],
      ["Meine Nase läuft.","Ho il naso che cola.","A1","aussage"],
      ["Wir gehen zusammen zur Apotheke.","Andiamo insieme in farmacia.","A1","aussage"],
      ["Er hat Fieber.","Lui ha la febbre.","A1","aussage"],
      ["Ich trinke viel Wasser, das ist gesund.","Bevo molta acqua, fa bene alla salute.","A1","aussage"],
      ["Die Krankenschwester misst meinen Puls.","L'infermiera mi misura il polso.","A1","aussage"],
      ["Mein Bauch tut weh.","Mi fa male la pancia.","A1","aussage"],
      ["Ich brauche ein Pflaster für den Finger.","Ho bisogno di un cerotto per il dito.","A1","aussage"],
      ["Wo tut es weh?","Dove ti fa male?","A1","frage"],
      ["Hast du Fieber?","Hai la febbre?","A1","frage"],
      ["Brauchst du einen Termin beim Arzt?","Hai bisogno di un appuntamento dal medico?","A1","frage"],
      ["Ich bleibe zu Hause, weil ich krank bin.","Resto a casa perché sono malato.","A1","nebensatz"],
      ["Der Arzt sagt, dass ich Ruhe brauche.","Il medico dice che ho bisogno di riposo.","A1","nebensatz"],
      ["Ich gehe zum Arzt, wenn der Husten nicht besser wird.","Vado dal medico se la tosse non migliora.","A1","nebensatz"],
      ["Ich habe gestern starke Kopfschmerzen gehabt.","Ieri ho avuto un forte mal di testa.","A2","aussage"],
      ["Der Arzt hat mir eine Salbe verschrieben.","Il medico mi ha prescritto una pomata.","A2","aussage"],
      ["Ich fühle mich heute viel besser.","Oggi mi sento molto meglio.","A2","aussage"],
      ["Wir haben einen Termin beim Zahnarzt gemacht.","Abbiamo preso un appuntamento dal dentista.","A2","aussage"],
      ["Meine Mutter hat mir Tee gegen die Erkältung gekocht.","Mia madre mi ha preparato una tisana contro il raffreddore.","A2","aussage"],
      ["Ich nehme die Tabletten dreimal am Tag.","Prendo le compresse tre volte al giorno.","A2","aussage"],
      ["Er hat sich beim Fußballspielen den Fuß verletzt.","Si è fatto male al piede giocando a calcio.","A2","aussage"],
      ["Die Apotheke hat bis achtzehn Uhr geöffnet.","La farmacia è aperta fino alle diciotto.","A2","aussage"],
      ["Ich habe letzte Woche eine Impfung bekommen.","La settimana scorsa ho fatto un vaccino.","A2","aussage"],
      ["Meine Oma geht jeden Morgen spazieren, das tut ihr gut.","La nonna fa una passeggiata ogni mattina, le fa bene.","A2","aussage"],
      ["Wir haben im Wartezimmer fast eine Stunde gewartet.","In sala d'attesa abbiamo aspettato quasi un'ora.","A2","aussage"],
      ["Was hat der Arzt gesagt?","Che cosa ha detto il medico?","A2","frage"],
      ["Wie lange dauert die Behandlung?","Quanto dura la cura?","A2","frage"],
      ["Hast du deine Medikamente schon genommen?","Hai già preso le medicine?","A2","frage"],
      ["Ich bin zu Hause geblieben, weil ich Fieber hatte.","Sono rimasto a casa perché avevo la febbre.","A2","nebensatz"],
      ["Die Ärztin hat erklärt, dass die Wunde bald heilt.","La dottoressa ha spiegato che la ferita guarirà presto.","A2","nebensatz"],
      ["Ich rufe den Arzt an, wenn die Schmerzen nicht weggehen.","Chiamo il medico se il dolore non passa.","A2","nebensatz"],
      ["Nächste Woche werde ich mich einer kleinen Operation unterziehen.","La prossima settimana mi sottoporrò a un piccolo intervento.","B1","aussage"],
      ["Ich habe beschlossen, mit dem Rauchen aufzuhören.","Ho deciso di smettere di fumare.","B1","aussage"],
      ["Der Hausarzt wird mich zu einem Spezialisten überweisen.","Il medico di base mi manderà da uno specialista.","B1","aussage"],
      ["Regelmäßiger Sport stärkt das Immunsystem und beugt vielen Krankheiten vor.","L'attività fisica regolare rafforza il sistema immunitario e previene molte malattie.","B1","aussage"],
      ["Ich habe mich für eine gesündere Ernährung entschieden und fühle mich schon besser.","Ho scelto un'alimentazione più sana e mi sento già meglio.","B1","aussage"],
      ["Nach der Operation muss ich mich einige Wochen schonen.","Dopo l'operazione dovrò riguardarmi per alcune settimane.","B1","aussage"],
      ["Die Krankenkasse übernimmt die Kosten für die Physiotherapie.","La cassa malati copre le spese della fisioterapia.","B1","aussage"],
      ["Ich werde nächstes Jahr an einem Gesundheitscheck teilnehmen.","L'anno prossimo parteciperò a un controllo medico generale.","B1","aussage"],
      ["Mein Rücken schmerzt schon seit Wochen, deshalb gehe ich zum Orthopäden.","La schiena mi fa male da settimane, perciò vado dall'ortopedico.","B1","aussage"],
      ["Der Impfstoff schützt vor der Grippe und wird jeden Herbst angeboten.","Il vaccino protegge dall'influenza e viene offerto ogni autunno.","B1","aussage"],
      ["Ich habe endlich einen Termin bei der Zahnärztin bekommen.","Finalmente ho ottenuto un appuntamento dalla dentista.","B1","aussage"],
      ["Wirst du dich gegen die Grippe impfen lassen?","Ti farai vaccinare contro l'influenza?","B1","frage"],
      ["Wie oft musst du zur Kontrolle gehen?","Ogni quanto devi andare al controllo?","B1","frage"],
      ["Hast du schon eine zweite Meinung eingeholt?","Hai già chiesto un secondo parere?","B1","frage"],
      ["Ich mache mir Sorgen, weil die Untersuchungsergebnisse noch nicht da sind.","Sono preoccupato perché i risultati degli esami non sono ancora arrivati.","B1","nebensatz"],
      ["Der Arzt hat gesagt, dass ich mich in den nächsten Tagen schonen soll.","Il medico ha detto che nei prossimi giorni dovrei riguardarmi.","B1","nebensatz"],
      ["Wenn die Schmerzen nicht besser werden, werde ich ins Krankenhaus gehen.","Se il dolore non migliora, andrò in ospedale.","B1","nebensatz"],
      ["Die Patienten werden vor der Operation ausführlich aufgeklärt.","I pazienti vengono informati in modo dettagliato prima dell'intervento.","B2","aussage"],
      ["An diesem Klinikum wird seit Kurzem eine neue Behandlungsmethode angewendet.","In questa clinica viene applicato da poco un nuovo metodo di cura.","B2","aussage"],
      ["Ohne die rechtzeitige Diagnose wäre die Krankheit vermutlich unentdeckt geblieben.","Senza una diagnosi tempestiva, la malattia sarebbe probabilmente rimasta scoperta.","B2","aussage"],
      ["Viele chronische Erkrankungen lassen sich durch eine Änderung des Lebensstils lindern.","Molte malattie croniche si possono alleviare cambiando stile di vita.","B2","aussage"],
      ["Die Wartezeiten für einen Facharzttermin haben sich in den letzten Jahren deutlich verlängert.","I tempi d'attesa per una visita specialistica si sono notevolmente allungati negli ultimi anni.","B2","aussage"],
      ["Der Impfstoff wurde innerhalb weniger Monate entwickelt und getestet.","Il vaccino è stato sviluppato e testato nel giro di pochi mesi.","B2","aussage"],
      ["Es wäre ratsam, sich regelmäßig ärztlich untersuchen zu lassen.","Sarebbe consigliabile sottoporsi regolarmente a controlli medici.","B2","aussage"],
      ["Trotz moderner Behandlungsmethoden bleibt die Genesung oft ein langwieriger Prozess.","Nonostante i moderni metodi di cura, la guarigione resta spesso un processo lungo.","B2","aussage"],
      ["Die Studie wurde von unabhängigen Wissenschaftlern durchgeführt.","Lo studio è stato condotto da scienziati indipendenti.","B2","aussage"],
      ["Immer mehr Menschen achten bewusst auf ihre psychische Gesundheit.","Sempre più persone prestano consapevolmente attenzione alla propria salute mentale.","B2","aussage"],
      ["Chronischer Stress belastet nachweislich das Herz-Kreislauf-System.","Lo stress cronico affatica in modo dimostrato il sistema cardiovascolare.","B2","aussage"],
      ["Wäre eine zweite Meinung in diesem Fall nicht sinnvoll?","Non sarebbe utile un secondo parere in questo caso?","B2","frage"],
      ["Wird die Behandlung von der Krankenkasse übernommen?","Il trattamento viene coperto dalla cassa malati?","B2","frage"],
      ["Wie hätte man diese Nebenwirkungen vermeiden können?","Come si sarebbero potuti evitare questi effetti collaterali?","B2","frage"],
      ["Obwohl die Behandlung schmerzhaft war, hat sie sich als wirksam erwiesen.","Sebbene la cura fosse dolorosa, si è rivelata efficace.","B2","nebensatz"],
      ["Die Ärzte vermuten, dass die Beschwerden durch Stress ausgelöst wurden.","I medici sospettano che i disturbi siano stati provocati dallo stress.","B2","nebensatz"],
      ["Während die einen auf Schulmedizin vertrauen, setzen andere auf alternative Heilmethoden.","Mentre alcuni si affidano alla medicina tradizionale, altri puntano su cure alternative.","B2","nebensatz"],
      ["Die Lebenserwartung hat sich in den letzten Jahrzehnten erheblich verlängert.","L'aspettativa di vita si è notevolmente allungata negli ultimi decenni.","C1","aussage"],
      ["Präventive Vorsorgeuntersuchungen tragen maßgeblich dazu bei, schwere Krankheiten frühzeitig zu erkennen.","I controlli preventivi contribuiscono in modo determinante a individuare precocemente malattie gravi.","C1","aussage"],
      ["Der behandelnde Arzt riet ihm eindringlich zu einer Operation.","Il medico curante gli consigliò con insistenza un intervento chirurgico.","C1","aussage"],
      ["Angesichts des Pflegenotstands gerät das Gesundheitssystem zunehmend an seine Grenzen.","Di fronte all'emergenza infermieristica, il sistema sanitario raggiunge sempre più i propri limiti.","C1","aussage"],
      ["Sie hat sich trotz widriger Prognosen vollständig von der Krankheit erholt.","Si è ripresa completamente dalla malattia nonostante prognosi avverse.","C1","aussage"],
      ["Bewegung und Ernährung beeinflussen die Gesundheit zweifellos maßgeblich.","Movimento e alimentazione influenzano senza dubbio in modo determinante la salute.","C1","aussage"],
      ["Der medizinische Fortschritt hat die Behandlung vieler früher unheilbarer Krankheiten revolutioniert.","Il progresso medico ha rivoluzionato la cura di molte malattie un tempo incurabili.","C1","aussage"],
      ["Ihm wurde geraten, den Eingriff so bald wie möglich vornehmen zu lassen.","Gli fu consigliato di sottoporsi all'intervento il prima possibile.","C1","aussage"],
      ["Das Gesundheitswesen steht angesichts der alternden Bevölkerung vor enormen Herausforderungen.","Il sistema sanitario si trova di fronte a enormi sfide a causa dell'invecchiamento della popolazione.","C1","aussage"],
      ["Nach monatelanger Reha erlangte er endlich seine volle Beweglichkeit zurück.","Dopo mesi di riabilitazione, ha finalmente riacquistato la piena mobilità.","C1","aussage"],
      ["Die Diagnose traf sie wie ein Schlag, doch sie ließ sich nicht entmutigen.","La diagnosi la colpì come un fulmine a ciel sereno, ma non si lasciò scoraggiare.","C1","aussage"],
      ["Inwieweit lässt sich der medizinische Fortschritt tatsächlich jedem zugänglich machen?","In che misura si può realmente rendere accessibile a tutti il progresso medico?","C1","frage"],
      ["Hätte man diese Epidemie durch frühzeitigeres Handeln eindämmen können?","Si sarebbe potuta contenere questa epidemia agendo prima?","C1","frage"],
      ["Woran erkennt man eigentlich, ob eine Erschöpfung bereits chronisch geworden ist?","Come si riconosce, in realtà, se una stanchezza è già diventata cronica?","C1","frage"],
      ["Obwohl die Ärzte zunächst wenig Hoffnung hatten, erholte sich die Patientin vollständig.","Sebbene i medici avessero inizialmente poche speranze, la paziente si è ripresa completamente.","C1","nebensatz"],
      ["Es wird vermutet, dass psychischer Druck erheblich zur Entstehung solcher Beschwerden beiträgt.","Si presume che la pressione psicologica contribuisca in modo significativo all'insorgenza di questi disturbi.","C1","nebensatz"],
      ["Nachdem er wochenlang unter starken Schmerzen gelitten hatte, entschied er sich endlich für die Operation.","Dopo aver sofferto per settimane di forti dolori, si è finalmente deciso per l'operazione.","C1","nebensatz"],
      ["Gesundheit lässt sich nicht käuflich erwerben, so viel Geld man auch investiert.","La salute non si può comprare, per quanto denaro si investa.","C2","aussage"],
      ["Das Gesundheitssystem krankt paradoxerweise an genau jenen Strukturen, die es eigentlich heilen sollen.","Il sistema sanitario soffre, paradossalmente, proprio delle strutture che dovrebbero curarlo.","C2","aussage"],
      ["Wer Vorsorge auf die lange Bank schiebt, riskiert im Ernstfall bittere Konsequenzen.","Chi rimanda la prevenzione rischia conseguenze amare in caso di emergenza.","C2","aussage"],
      ["Die Grenze zwischen notwendiger Behandlung und überflüssiger Medikalisierung verschwimmt zusehends.","Il confine tra cura necessaria e medicalizzazione superflua diventa sempre più labile.","C2","aussage"],
      ["Es ist ihrer zähen Willenskraft zu verdanken, dass sie die Krankheit letztlich besiegte.","È merito della sua tenace volontà se alla fine ha sconfitto la malattia.","C2","aussage"],
      ["An Ausreden, weshalb man den Arztbesuch weiter aufschiebt, mangelt es selten.","Di scuse per rimandare ancora la visita dal medico non se ne trovano mai poche.","C2","aussage"],
      ["Der schmale Grat zwischen Selbstfürsorge und Hypochondrie ist nicht immer leicht zu erkennen.","Il confine sottile tra cura di sé e ipocondria non è sempre facile da riconoscere.","C2","aussage"],
      ["Der medizinische Fortschritt wirft ebenso viele ethische Fragen auf, wie er Antworten liefert.","Il progresso medico solleva tante questioni etiche quante risposte fornisce.","C2","aussage"],
      ["Der Placebo-Effekt belegt eindrücklich die Macht der Psyche über den Körper.","L'effetto placebo dimostra in modo impressionante il potere della mente sul corpo.","C2","aussage"],
      ["Trotz aller Warnungen der Ärzteschaft hält sich hartnäckig der Mythos vom harmlosen Gelegenheitskonsum.","Nonostante tutti gli avvertimenti dei medici, resiste ostinatamente il mito del consumo occasionale innocuo.","C2","aussage"],
      ["Am Krankenbett zeigt sich oft die wahre Stärke eines Menschen, die im Alltag verborgen bleibt.","Al capezzale spesso emerge la vera forza di una persona, che nella vita quotidiana resta nascosta.","C2","aussage"],
      ["Ist es nicht widersinnig, dass ausgerechnet im Gesundheitswesen so oft am falschen Ende gespart wird?","Non è assurdo che proprio nella sanità si risparmi così spesso nel posto sbagliato?","C2","frage"],
      ["Wie weit darf die Eigenverantwortung für die eigene Gesundheit überhaupt gehen?","Fino a che punto può realmente spingersi la responsabilità personale per la propria salute?","C2","frage"],
      ["Wäre unser Gesundheitswesen nicht widerstandsfähiger, hätte man frühzeitiger in Prävention investiert?","Il nostro sistema sanitario non sarebbe più resiliente se si fosse investito prima nella prevenzione?","C2","frage"],
      ["Während die Medizin immer neue Wunder vollbringt, bleibt die Frage nach einem würdevollen Sterben oft unbeantwortet.","Mentre la medicina compie sempre nuovi miracoli, la questione di una morte dignitosa resta spesso senza risposta.","C2","nebensatz"],
      ["Auch wenn moderne Diagnostik vieles sichtbar macht, entzieht sich das Wesen mancher Leiden bis heute jeder Erklärung.","Anche se la diagnostica moderna rende visibili molte cose, la natura di certi disturbi sfugge tuttora a ogni spiegazione.","C2","nebensatz"],
      ["Erst wenn man selbst schwer erkrankt, begreift man, wie zerbrechlich das eigene Wohlbefinden in Wahrheit ist.","Solo quando ci si ammala gravemente, si capisce quanto sia in realtà fragile il proprio benessere.","C2","nebensatz"]
    ],
    "verwaltung": [
      ["Ich fülle das Formular aus.","Compilo il modulo.","A1","aussage"],
      ["Ich brauche einen neuen Ausweis.","Ho bisogno di una nuova carta d'identità.","A1","aussage"],
      ["Das Amt ist bis sechzehn Uhr geöffnet.","L'ufficio è aperto fino alle sedici.","A1","aussage"],
      ["Ich habe einen Termin beim Bürgeramt.","Ho un appuntamento all'anagrafe.","A1","aussage"],
      ["Wir brauchen eine Unterschrift von dir.","Abbiamo bisogno della tua firma.","A1","aussage"],
      ["Der Antrag liegt auf dem Tisch.","La domanda è sul tavolo.","A1","aussage"],
      ["Ich zahle die Rechnung online.","Pago la fattura online.","A1","aussage"],
      ["Meine Versicherung kostet fünfzig Euro im Monat.","La mia assicurazione costa cinquanta euro al mese.","A1","aussage"],
      ["Ich hole meinen Reisepass ab.","Ritiro il mio passaporto.","A1","aussage"],
      ["Die Beamtin prüft meine Papiere.","L'impiegata controlla i miei documenti.","A1","aussage"],
      ["Ich brauche eine Kopie von meinem Vertrag.","Ho bisogno di una copia del mio contratto.","A1","aussage"],
      ["Wo ist das Bürgeramt?","Dov'è l'anagrafe?","A1","frage"],
      ["Brauche ich einen Termin?","Ho bisogno di un appuntamento?","A1","frage"],
      ["Welche Papiere brauche ich?","Quali documenti mi servono?","A1","frage"],
      ["Ich gehe zum Amt, weil mein Ausweis abläuft.","Vado in ufficio perché la mia carta d'identità sta scadendo.","A1","nebensatz"],
      ["Der Beamte sagt, dass das Formular fehlt.","L'impiegato dice che manca il modulo.","A1","nebensatz"],
      ["Ich unterschreibe den Vertrag, wenn alles stimmt.","Firmo il contratto se va tutto bene.","A1","nebensatz"],
      ["Ich habe gestern das Formular beim Amt abgegeben.","Ieri ho consegnato il modulo in ufficio.","A2","aussage"],
      ["Der Beamte hat meinen Antrag angenommen.","L'impiegato ha accettato la mia domanda.","A2","aussage"],
      ["Ich habe einen neuen Mietvertrag unterschrieben.","Ho firmato un nuovo contratto d'affitto.","A2","aussage"],
      ["Wir haben die Versicherung gewechselt.","Abbiamo cambiato assicurazione.","A2","aussage"],
      ["Ich warte schon zwanzig Minuten im Wartezimmer.","Aspetto già da venti minuti in sala d'attesa.","A2","aussage"],
      ["Meine Anmeldung hat lange gedauert.","La mia registrazione anagrafica è durata a lungo.","A2","aussage"],
      ["Ich habe alle Unterlagen mitgebracht.","Ho portato con me tutti i documenti.","A2","aussage"],
      ["Der Antrag ist leider abgelehnt worden.","La domanda purtroppo è stata respinta.","A2","aussage"],
      ["Ich habe online einen Termin gebucht.","Ho prenotato un appuntamento online.","A2","aussage"],
      ["Wir haben letzte Woche unsere Steuererklärung abgegeben.","La settimana scorsa abbiamo presentato la dichiarazione dei redditi.","A2","aussage"],
      ["Ich habe die Bestätigung per Post bekommen.","Ho ricevuto la conferma per posta.","A2","aussage"],
      ["Hast du schon den Antrag gestellt?","Hai già presentato la domanda?","A2","frage"],
      ["Wie lange dauert die Bearbeitung?","Quanto tempo richiede la pratica?","A2","frage"],
      ["Welche Unterlagen fehlen noch?","Quali documenti mancano ancora?","A2","frage"],
      ["Ich war beim Amt, weil ich meinen Wohnsitz ändern musste.","Sono andato in ufficio perché dovevo cambiare residenza.","A2","nebensatz"],
      ["Die Sachbearbeiterin hat gesagt, dass die Unterlagen vollständig sind.","L'impiegata ha detto che i documenti sono completi.","A2","nebensatz"],
      ["Ich rufe an, wenn ich keine Antwort bekomme.","Chiamo se non ricevo risposta.","A2","nebensatz"],
      ["Nächste Woche werde ich meinen Wohnsitz ummelden müssen.","La prossima settimana dovrò cambiare la residenza anagrafica.","B1","aussage"],
      ["Ich habe mich entschieden, eine private Zusatzversicherung abzuschließen.","Ho deciso di stipulare un'assicurazione integrativa privata.","B1","aussage"],
      ["Die Bearbeitung meines Antrags wird voraussichtlich vier Wochen dauern.","L'elaborazione della mia domanda richiederà presumibilmente quattro settimane.","B1","aussage"],
      ["Ich habe alle nötigen Unterlagen kopiert und in eine Mappe sortiert.","Ho fotocopiato tutti i documenti necessari e li ho ordinati in una cartellina.","B1","aussage"],
      ["Vor der Unterschrift lese ich immer das Kleingedruckte im Vertrag genau durch.","Prima di firmare, leggo sempre con attenzione le clausole in piccolo del contratto.","B1","aussage"],
      ["Die Krankenkasse hat mir eine Erstattung für die Behandlung zugesagt.","La cassa malati mi ha promesso un rimborso per la cura.","B1","aussage"],
      ["Ich werde nächsten Monat eine Kfz-Versicherung abschließen müssen.","Il mese prossimo dovrò stipulare un'assicurazione per l'auto.","B1","aussage"],
      ["Der Antrag auf Kindergeld wird derzeit noch geprüft.","La domanda per gli assegni familiari è ancora in fase di esame.","B1","aussage"],
      ["Ich habe eine Frist von zwei Wochen, um Widerspruch einzulegen.","Ho un termine di due settimane per presentare ricorso.","B1","aussage"],
      ["Für die Verlängerung meines Passes brauche ich ein neues Foto und die Gebühr.","Per rinnovare il passaporto mi servono una nuova foto e la tassa.","B1","aussage"],
      ["Ich habe der Versicherung alle Belege per E-Mail geschickt.","Ho inviato all'assicurazione tutte le ricevute via e-mail.","B1","aussage"],
      ["Wirst du den Vertrag noch diese Woche kündigen?","Disdirai il contratto già questa settimana?","B1","frage"],
      ["Welche Frist muss ich beim Widerspruch einhalten?","Quale termine devo rispettare per il ricorso?","B1","frage"],
      ["Hast du die Bestätigung schon per Post erhalten?","Hai già ricevuto la conferma per posta?","B1","frage"],
      ["Ich muss zum Amt gehen, weil meine Aufenthaltserlaubnis bald abläuft.","Devo andare in ufficio perché il mio permesso di soggiorno sta per scadere.","B1","nebensatz"],
      ["Die Versicherung hat mitgeteilt, dass der Schaden nicht gedeckt ist.","L'assicurazione ha comunicato che il danno non è coperto.","B1","nebensatz"],
      ["Sobald ich die fehlenden Unterlagen habe, reiche ich den Antrag erneut ein.","Non appena avrò i documenti mancanti, presenterò di nuovo la domanda.","B1","nebensatz"],
      ["Der Antrag wird derzeit von einem anderen Sachbearbeiter geprüft.","La domanda è attualmente in esame presso un altro funzionario.","B2","aussage"],
      ["Ohne die fehlende Unterschrift wäre der Vertrag nicht gültig.","Senza la firma mancante, il contratto non sarebbe valido.","B2","aussage"],
      ["Die Fristen für die Steuererklärung wurden dieses Jahr verlängert.","Quest'anno le scadenze per la dichiarazione dei redditi sono state prorogate.","B2","aussage"],
      ["Viele Formulare können inzwischen bequem online eingereicht werden.","Molti moduli possono ormai essere inviati comodamente online.","B2","aussage"],
      ["Der Widerspruch wurde vom Amt aus formalen Gründen abgelehnt.","Il ricorso è stato respinto dall'ufficio per motivi formali.","B2","aussage"],
      ["Es wäre klüger gewesen, die Versicherungsbedingungen vorher genauer zu prüfen.","Sarebbe stato più saggio verificare prima con più attenzione le condizioni assicurative.","B2","aussage"],
      ["Der neue Personalausweis wird innerhalb von drei Wochen zugestellt.","La nuova carta d'identità viene consegnata entro tre settimane.","B2","aussage"],
      ["Zahlreiche Bürger klagen über die lange Bearbeitungsdauer bei den Behörden.","Numerosi cittadini si lamentano dei lunghi tempi di elaborazione presso gli uffici pubblici.","B2","aussage"],
      ["Die Kündigungsfrist beträgt laut Vertrag drei Monate zum Jahresende.","Secondo il contratto, il periodo di preavviso è di tre mesi a fine anno.","B2","aussage"],
      ["Der Datenschutz wird bei der Antragstellung mittlerweile sehr ernst genommen.","La protezione dei dati viene ormai presa molto sul serio nella presentazione delle domande.","B2","aussage"],
      ["Ohne gültige Versicherung darf man in Deutschland kein Auto anmelden.","Senza un'assicurazione valida non si può immatricolare un'auto in Germania.","B2","aussage"],
      ["Könnte man die Frist notfalls verlängern lassen?","Si potrebbe, in caso di necessità, far prorogare la scadenza?","B2","frage"],
      ["Wird die Gebühr bei einer Ablehnung zurückerstattet?","In caso di rifiuto, la tassa viene rimborsata?","B2","frage"],
      ["Was wäre bei verloren gegangenen Unterlagen zu tun?","Cosa si dovrebbe fare in caso di documenti smarriti?","B2","frage"],
      ["Obwohl der Antrag vollständig war, wurde er zunächst zurückgeschickt.","Sebbene la domanda fosse completa, all'inizio è stata rispedita al mittente.","B2","nebensatz"],
      ["Das Amt teilte mit, dass die Bearbeitung wegen Personalmangels länger dauert.","L'ufficio ha comunicato che l'elaborazione richiede più tempo per carenza di personale.","B2","nebensatz"],
      ["Während die einen Behördengänge online erledigen, bevorzugen andere weiterhin den persönlichen Termin.","Mentre alcuni sbrigano le pratiche amministrative online, altri preferiscono ancora l'appuntamento di persona.","B2","nebensatz"],
      ["Die Digitalisierung der Verwaltung schreitet nur schleppend voran.","La digitalizzazione della pubblica amministrazione procede solo lentamente.","C1","aussage"],
      ["Es empfiehlt sich, sämtliche Verträge vor der Unterzeichnung sorgfältig zu prüfen.","È consigliabile esaminare attentamente tutti i contratti prima di firmarli.","C1","aussage"],
      ["Angesichts der überlasteten Ämter müssen Bürger mit erheblichen Wartezeiten rechnen.","Vista la situazione degli uffici sovraccarichi, i cittadini devono mettere in conto attese considerevoli.","C1","aussage"],
      ["Der bürokratische Aufwand für eine simple Ummeldung steht in keinem Verhältnis zum Nutzen.","Il carico burocratico per un semplice cambio di residenza è del tutto sproporzionato rispetto all'utilità.","C1","aussage"],
      ["Ihm wurde nahegelegt, gegen den Bescheid fristgerecht Widerspruch einzulegen.","Gli è stato consigliato di presentare ricorso contro la decisione entro i termini previsti.","C1","aussage"],
      ["Die Behörde hat sich zu einer nachträglichen Korrektur des Bescheids bereit erklärt.","L'ufficio si è dichiarato disponibile a correggere successivamente la decisione.","C1","aussage"],
      ["Ein Vertrag entfaltet erst mit beiderseitiger Unterschrift seine volle Rechtskraft.","Un contratto acquista piena validità legale solo con la firma di entrambe le parti.","C1","aussage"],
      ["Sie hat es sich zur Aufgabe gemacht, den Papierkram ihrer Eltern zu übernehmen.","Si è presa il compito di occuparsi delle pratiche burocratiche dei genitori.","C1","aussage"],
      ["Der Antrag scheiterte letztlich an einer fehlenden Unterschrift.","Alla fine la domanda è naufragata per la mancanza di una firma.","C1","aussage"],
      ["Gerade bei Versicherungsverträgen lohnt sich ein genauer Blick auf die Ausschlussklauseln.","Proprio nei contratti assicurativi conviene dare uno sguardo attento alle clausole di esclusione.","C1","aussage"],
      ["Nach zähem Ringen mit der Behörde erhielt sie schließlich die Genehmigung.","Dopo un'estenuante trattativa con l'ufficio, alla fine ha ottenuto l'autorizzazione.","C1","aussage"],
      ["Inwiefern haftet die Versicherung eigentlich für Schäden durch grobe Fahrlässigkeit?","In che misura risponde davvero l'assicurazione per danni dovuti a colpa grave?","C1","frage"],
      ["Wäre es nicht ratsam, sich vor Vertragsabschluss rechtlich beraten zu lassen?","Non sarebbe consigliabile farsi consigliare legalmente prima di firmare il contratto?","C1","frage"],
      ["Woran scheitert es eigentlich so oft, dass Anträge fristgerecht bearbeitet werden?","Come mai così spesso le domande non vengono elaborate entro i termini previsti?","C1","frage"],
      ["Obwohl sämtliche Fristen eingehalten wurden, verzögerte sich die Bearbeitung um Monate.","Sebbene tutte le scadenze fossero state rispettate, l'elaborazione ha subito un ritardo di mesi.","C1","nebensatz"],
      ["Es wird davon ausgegangen, dass künftig noch mehr Behördengänge digital erledigt werden können.","Si presume che in futuro sarà possibile sbrigare online un numero ancora maggiore di pratiche amministrative.","C1","nebensatz"],
      ["Nachdem der erste Antrag abgelehnt worden war, legte sie sofort Widerspruch ein.","Dopo che la prima domanda era stata respinta, ha presentato subito ricorso.","C1","nebensatz"],
      ["Der berühmte deutsche Formularwahn ist mehr als nur ein Klischee – er prägt tagtäglich das Leben vieler Bürger.","La famosa mania tedesca dei moduli è più di un semplice cliché: condiziona ogni giorno la vita di molti cittadini.","C2","aussage"],
      ["Wer sich durch den Dschungel der Versicherungsklauseln kämpft, verliert leicht den Überblick.","Chi si addentra nella giungla delle clausole assicurative perde facilmente l'orientamento.","C2","aussage"],
      ["Zwischen dem Anspruch der Verwaltung auf Effizienz und der gelebten Realität klafft nach wie vor eine erhebliche Lücke.","Tra l'aspirazione dell'amministrazione all'efficienza e la realtà vissuta permane tuttora un divario considerevole.","C2","aussage"],
      ["Ein Vertrag ist letztlich nur so viel wert wie das Vertrauen der beiden Parteien zueinander.","Un contratto, in fondo, vale solo quanto la fiducia reciproca tra le due parti.","C2","aussage"],
      ["Bürokratische Hürden lassen sich selten durch Ungeduld, wohl aber durch Beharrlichkeit überwinden.","Gli ostacoli burocratici difficilmente si superano con l'impazienza, ma quasi sempre con la perseveranza.","C2","aussage"],
      ["Nirgendwo zeigt sich die Kluft zwischen Theorie und Praxis deutlicher als im Umgang mit Behördenformularen.","In nessun altro ambito il divario tra teoria e pratica appare più evidente che nella gestione dei moduli amministrativi.","C2","aussage"],
      ["Wer sein Kleingedrucktes nicht liest, zahlt am Ende oft doppelt.","Chi non legge le clausole in piccolo finisce spesso per pagare due volte.","C2","aussage"],
      ["Die vielgepriesene Bürgerfreundlichkeit mancher Ämter erweist sich in der Praxis oft als leeres Versprechen.","La tanto decantata disponibilità di certi uffici verso i cittadini si rivela spesso, nella pratica, una promessa vuota.","C2","aussage"],
      ["Manch ein Antrag verschwindet auf mysteriöse Weise irgendwo zwischen den Schreibtischen der Verwaltung.","Certe domande spariscono in modo misterioso da qualche parte tra le scrivanie dell'amministrazione.","C2","aussage"],
      ["Erst der Ernstfall offenbart, wie lückenhaft manch eine Versicherungspolice tatsächlich ist.","Solo in caso di emergenza si scopre quanto lacunosa sia in realtà certa polizza assicurativa.","C2","aussage"],
      ["Am Ende zahlt sich Sorgfalt beim Aktenstudium fast immer aus, mag sie auch mühsam erscheinen.","Alla fine, la cura nello studio delle pratiche quasi sempre ripaga, per quanto possa sembrare faticosa.","C2","aussage"],
      ["Muss ein simpler Wohnsitzwechsel wirklich vier verschiedene Formulare erfordern?","Un semplice cambio di residenza deve davvero richiedere quattro moduli diversi?","C2","frage"],
      ["Wie viel Eigenverantwortung darf man Bürgern beim Ausfüllen komplexer Formulare eigentlich zumuten?","Quanta responsabilità personale si può realmente chiedere ai cittadini nella compilazione di moduli complessi?","C2","frage"],
      ["Wäre der ganze Papierkram nicht deutlich schlanker zu gestalten, wenn man ihn von Grund auf überdächte?","Non si potrebbe snellire notevolmente tutta questa burocrazia se la si ripensasse da zero?","C2","frage"],
      ["Während die Verwaltung offiziell auf schlanke Prozesse setzt, wuchert im Alltag ein Formular nach dem anderen.","Mentre l'amministrazione punta ufficialmente su processi snelli, nella pratica quotidiana prolifera un modulo dopo l'altro.","C2","nebensatz"],
      ["Man mag einwenden, dass Bürokratie auch dem Schutz der Bürger dient, doch im Alltag überwiegt oft nur der Frust.","Si potrebbe obiettare che la burocrazia serve anche a tutelare i cittadini, eppure nella quotidianità prevale spesso solo la frustrazione.","C2","nebensatz"],
      ["Sobald man einmal die Geduld für den Papierkram verloren hat, fällt es doppelt schwer, sich erneut aufzuraffen.","Una volta persa la pazienza per la burocrazia, diventa doppiamente difficile trovare di nuovo la motivazione.","C2","nebensatz"]
    ]
  };
  function beispieleFuer(kategorie, level, art) {
    const liste = BEISPIELE[kategorie] || [];
    return liste
      .filter((b) => (!level || b[2] === level) && (!art || b[3] === art))
      .map((b) => ({ de: b[0], it: b[1], level: b[2], art: b[3] }));
  }
  function beispielAnzahl(kategorie) {
    return (BEISPIELE[kategorie] || []).length;
  }

  window.Satzbau = {
    ORTE, DINGE, PERSONEN, SUBJEKTE, VERBEN, ZEITEN, ARTEN, KATEGORIEN,
    bauSatz, ortsform, nominalgruppe, verschmelze,
    verbenFuer, orteFuer, dingeFuer, personenFuer, zeitenFuer, artenFuer, anzahlBeispiele,
    BEISPIELE, beispieleFuer, beispielAnzahl,
    WECHSEL, NUR_DATIV, NUR_AKKUSATIV,
  };
})();
