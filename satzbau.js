/* =====================================================================
   SATZBAU — Formenlehre und Satzbau für Deutsch und Italienisch
   ---------------------------------------------------------------------
   Was dieses Modul leistet
   ---------------------------------------------------------------------
   Ein Satz wird hier nicht aus fertigen Wendungen zusammengesteckt,
   sondern aus Wörtern mit ihren Eigenschaften gebaut. Deshalb steht bei
   einem Ort nicht „am Meer“, sondern „Meer, sächlich, Präposition an“.
   Welche Form daraus wird, entscheidet die FRAGE, die der Baustein im
   Satz beantwortet:

       wo?     an + Dativ      → am Meer      (ich bin am Meer)
       wohin?  an + Akkusativ  → ans Meer     (wir fahren ans Meer)
       woher?  von + Dativ     → vom Meer     (wir kommen vom Meer)

   Genauso bei Personen und Dingen: „mein Freund“ wird zu „meinen
   Freund“ (Akkusativ), „meinem Freund“ (Dativ) oder „meines Freundes“
   (Genitiv), und schwache Nomen bekommen ihr -n: „meinen Nachbarn“.

   Der Satz kennt die vier Umstandsbestimmungen:

       TEMPORAL  wann?    heute, jeden Morgen, seit drei Wochen
       KAUSAL    warum?   weil ich müde bin, wegen des Wetters
       MODAL     wie?     in Ruhe, mit dem Zug, sehr gern
       LOKAL     wo/wohin/woher?

   Im deutschen Mittelfeld stehen sie in genau dieser Reihenfolge
   (te-ka-mo-lo). Das ist keine Kür, sondern der Grund, warum ein Satz
   „richtig klingt“ oder eben nicht — und es ist genau das, was
   Lernende selten erklärt bekommen.

   Damit nie ein schiefer Satz entsteht, trägt jedes Verb ausdrücklich
   ein, welche Orte, Dinge, Personen, Gründe und Arten zu ihm passen.
   Was dort nicht steht, lässt sich gar nicht erst bauen. „Ich gehe im
   Bett“ ist unmöglich, weil gehen die Frage „wohin“ stellt und daraus
   „ins Bett“ wird.

   Für das Italienische ist vieles einfacher — „al mare“ gilt für „ich
   bin dort“ wie für „ich fahre hin“. Beide Sprachen stehen deshalb in
   EINEM Eintrag: Der italienische Satz bleibt gleich, die deutsche
   Übersetzung bekommt trotzdem die richtige Form. Genau daran scheitern
   Italienischlernende sonst.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     1. DEUTSCHE FORMENLEHRE
     =================================================================== */

  const ARTIKEL_BESTIMMT = {
    nom: { m: "der", f: "die", n: "das", pl: "die" },
    akk: { m: "den", f: "die", n: "das", pl: "die" },
    dat: { m: "dem", f: "der", n: "dem", pl: "den" },
    gen: { m: "des", f: "der", n: "des", pl: "der" },
  };
  const ARTIKEL_UNBESTIMMT = {
    nom: { m: "ein", f: "eine", n: "ein", pl: "" },
    akk: { m: "einen", f: "eine", n: "ein", pl: "" },
    dat: { m: "einem", f: "einer", n: "einem", pl: "" },
    gen: { m: "eines", f: "einer", n: "eines", pl: "" },
  };
  // Possessiv- und kein-Begleiter folgen demselben Muster wie „ein“.
  const POSSESSIV_ENDUNG = {
    nom: { m: "", f: "e", n: "", pl: "e" },
    akk: { m: "en", f: "e", n: "", pl: "e" },
    dat: { m: "em", f: "er", n: "em", pl: "en" },
    gen: { m: "es", f: "er", n: "es", pl: "er" },
  };

  /* Adjektivendungen — die drei Deklinationen. Welche gilt, hängt davon
     ab, wie viel der Begleiter schon verrät:
       schwach  nach der/die/das   (der Artikel zeigt den Fall)
       gemischt nach ein/mein/kein (er zeigt ihn nur teilweise)
       stark    ohne Begleiter     (das Adjektiv muss ihn allein zeigen) */
  const ADJ_SCHWACH = {
    nom: { m: "e", f: "e", n: "e", pl: "en" },
    akk: { m: "en", f: "e", n: "e", pl: "en" },
    dat: { m: "en", f: "en", n: "en", pl: "en" },
    gen: { m: "en", f: "en", n: "en", pl: "en" },
  };
  const ADJ_GEMISCHT = {
    nom: { m: "er", f: "e", n: "es", pl: "en" },
    akk: { m: "en", f: "e", n: "es", pl: "en" },
    dat: { m: "en", f: "en", n: "en", pl: "en" },
    gen: { m: "en", f: "en", n: "en", pl: "en" },
  };
  const ADJ_STARK = {
    nom: { m: "er", f: "e", n: "es", pl: "e" },
    akk: { m: "en", f: "e", n: "es", pl: "e" },
    dat: { m: "em", f: "er", n: "em", pl: "en" },
    gen: { m: "en", f: "er", n: "en", pl: "er" },
  };

  const VERSCHMELZUNG = {
    "an dem": "am", "an das": "ans",
    "in dem": "im", "in das": "ins",
    "bei dem": "beim",
    "zu dem": "zum", "zu der": "zur",
    "von dem": "vom",
    "auf das": "aufs",
    "für das": "fürs", "um das": "ums", "durch das": "durchs",
    "über das": "übers", "unter das": "unters",
    "vor das": "vors", "hinter das": "hinters",
  };
  // Wechselpräpositionen: Dativ auf „wo?“, Akkusativ auf „wohin?“.
  const WECHSEL = ["an", "auf", "in", "hinter", "neben", "über", "unter", "vor", "zwischen"];
  const NUR_DATIV = ["aus", "bei", "mit", "nach", "seit", "von", "zu", "gegenüber"];
  const NUR_AKKUSATIV = ["durch", "für", "gegen", "ohne", "um", "bis", "entlang"];
  const NUR_GENITIV = ["wegen", "trotz", "während", "aufgrund", "infolge", "statt"];

  function verschmelze(praep, artikel) {
    const paar = praep + " " + artikel;
    return VERSCHMELZUNG[paar] || paar;
  }

  /* Nomen beugen. Im Deutschen ändert sich am Nomen selbst wenig — aber
     was sich ändert, fällt sofort auf, wenn es fehlt:
       Genitiv Singular m/n:  des Hauses, des Vaters
       Dativ Plural:          den Bergen, den Kindern
       schwache Nomen:        den Nachbarn, den Studenten */
  function beugeNomen(eintrag, fall, genus) {
    if (eintrag.plural || genus === "pl") {
      const grund = eintrag.nomen;
      if (fall !== "dat") return grund;
      if (/[ns]$/.test(grund)) return grund;
      return grund + "n";
    }
    const wort = eintrag.nomen;
    if (eintrag.schwach && fall !== "nom") {
      if (/[aeiou]$/.test(wort)) return wort + "n";
      if (/(ent|ant|ist|at|ph|arch|nom|log|graf)$/.test(wort)) return wort + "en";
      if (wort === "Herr") return "Herrn";
      return wort + "n";
    }
    if (fall === "gen" && (genus === "m" || genus === "n") && !eintrag.eigenname) {
      if (eintrag.genitiv) return eintrag.genitiv;
      // Einsilbige und auf s/ß/x/z endende Wörter bekommen -es, sonst -s.
      if (/(s|ß|x|z|sch|st)$/.test(wort)) return wort + "es";
      // „des Schnees“, nicht „des Schneees“ — auf einen Vokal folgt nur -s.
      if (/[aeiouäöüy]$/i.test(wort)) return wort + "s";
      const silben = (wort.match(/[aeiouäöüy]+/gi) || []).length;
      return silben <= 1 ? wort + "es" : wort + "s";
    }
    return wort;
  }

  /* Die vollständige Nominalgruppe: Begleiter + Adjektiv + Nomen.
     begleiter: "bestimmt" | "unbestimmt" | "ohne" | "kein" | Possessivstamm */
  function nominalgruppe(eintrag, fall, begleiter, adjektiv, subjekt) {
    const genus = eintrag.plural ? "pl" : (eintrag.genus || "n");
    const nomen = beugeNomen(eintrag, fall, genus);
    let art = begleiter || eintrag.begleiter || "bestimmt";
    /* „possessiv“ ist nur der Name des Begleiters. Welches Wort daraus
       wird, hängt am Subjekt: ich → mein, du → dein, wir → unser. */
    if (art === "possessiv") art = (subjekt && subjekt.possessiv) || "mein";
    if (Array.isArray(art)) art = art[0] === "possessiv" ? ((subjekt && subjekt.possessiv) || "mein") : art[0];
    const adjStamm = adjektiv ? (adjektiv.stamm || adjektiv.de) : "";

    if (art === "ohne" || eintrag.eigenname) {
      // Ohne Begleiter trägt das Adjektiv die starke Endung.
      return (adjStamm ? adjStamm + ADJ_STARK[fall][genus] + " " : "") + nomen;
    }
    if (art === "bestimmt") {
      const a = ARTIKEL_BESTIMMT[fall][genus];
      return a + " " + (adjStamm ? adjStamm + ADJ_SCHWACH[fall][genus] + " " : "") + nomen;
    }
    if (art === "unbestimmt") {
      const a = ARTIKEL_UNBESTIMMT[fall][genus];
      if (!a) return (adjStamm ? adjStamm + ADJ_STARK[fall][genus] + " " : "") + nomen;
      return a + " " + (adjStamm ? adjStamm + ADJ_GEMISCHT[fall][genus] + " " : "") + nomen;
    }
    // Possessiv oder „kein“ — gemischte Deklination
    let stamm = art === "kein" ? "kein" : art;
    const endung = POSSESSIV_ENDUNG[fall][genus];
    // „euer“ wirft vor einer Endung sein e ab: eure, euren, eurem.
    if (stamm === "euer" && endung) stamm = "eur";
    const begl = stamm + endung;
    return begl + " " + (adjStamm ? adjStamm + ADJ_GEMISCHT[fall][genus] + " " : "") + nomen;
  }

  /* Italienische Adjektive richten sich nach Geschlecht und Zahl.
     Endung -o → o/a/i/e, Endung -e → e/e/i/i. */
  /* Italienische Adjektive richten sich nach Geschlecht und Zahl.
     Endung -o → o/a/i/e, Endung -e → e/e/i/i. Unveränderliche Wendungen
     wie „in ritardo“ bleiben, wie sie sind. */
  function itAdjektiv(adj, genus, plural) {
    if (!adj) return "";
    const s = adj.it || "";
    if (!s || adj.itUnveraenderlich) return s;
    if (/e$/.test(s) && !/[gc]he$/.test(s)) return plural ? s.replace(/e$/, "i") : s;
    const stamm = s.replace(/[oae]$/, "");
    if (!plural) return stamm + (genus === "f" ? "a" : "o");
    /* Im Plural behalten Wörter auf -co/-go ihren harten Klang und
       schieben ein h ein: bianco → bianchi, largo → larghi. Ausgenommen
       sind die auf -ico, die betont auf der drittletzten Silbe stehen:
       pratico → pratici, simpatico → simpatici. */
    if (genus === "f") {
      if (/[cg]$/.test(stamm)) return stamm + "he";
      return stamm + "e";
    }
    if (/i$/.test(stamm)) return stamm;        // vecchio → vecchi
    if (/ic$/.test(stamm)) return stamm + "i";
    if (/[cg]$/.test(stamm)) return stamm + "hi";
    return stamm + "i";
  }
  /* Ein paar häufige Adjektive stehen im Italienischen VOR dem Substantiv
     („una buona minestra“), die meisten dahinter („un libro interessante“).
     Ohne diese Unterscheidung klingt jeder Satz nach Wörterbuch. */
  const IT_ADJ_DAVOR = ["buono", "bello", "grande", "piccolo", "nuovo", "vecchio", "bravo", "brutto", "lungo", "corto", "giovane"];
  function itAdjektivDavor(adj) {
    return Boolean(adj && IT_ADJ_DAVOR.includes(adj.it));
  }

  /* --- Der italienische Artikel ------------------------------------
     Er richtet sich nicht nach dem Substantiv, sondern nach dem WORT,
     das direkt hinter ihm steht. „l'e-mail“ — aber sobald ein Adjektiv
     dazwischenrutscht, heißt es „la lunga e-mail“. Deshalb wird der
     Artikel hier immer neu gebildet und niemals aus einer fertigen
     Zeichenkette herausgeschnitten. Genau daran ist die alte Fassung
     gescheitert. */
  function itVokal(w) { return /^[aeiouàèéìòùh]/i.test(w || ""); }
  function itSImpuro(w) { return /^(s[^aeiouàèéìòù]|z|ps|pn|gn|x|y)/i.test(w || ""); }

  function itArtikel(typ, genus, plural, folgt) {
    const f = (folgt || "").toLowerCase();
    const v = itVokal(f), s = itSImpuro(f);
    if (typ === "bestimmt") {
      if (plural) return genus === "f" ? "le " : (v || s ? "gli " : "i ");
      if (genus === "f") return v ? "l'" : "la ";
      return v ? "l'" : (s ? "lo " : "il ");
    }
    if (typ === "unbestimmt") {
      if (plural) return genus === "f" ? "delle " : (v || s ? "degli " : "dei ");
      if (genus === "f") return v ? "un'" : "una ";
      return s ? "uno " : "un ";
    }
    return "";
  }

  /* „buono“ und „bello“ verkürzen sich vor dem Substantiv wie der
     unbestimmte Artikel: un buon libro, un bel film, begli occhi. */
  function itAdjektivVorForm(adj, genus, plural, folgt) {
    const it = adj.it;
    const v = itVokal(folgt), s = itSImpuro(folgt);
    if (it === "buono") {
      if (plural) return genus === "f" ? "buone" : "buoni";
      if (genus === "f") return v ? "buon'" : "buona";
      return s ? "buono" : "buon";
    }
    if (it === "bello") {
      if (plural) return genus === "f" ? "belle" : (v || s ? "begli" : "bei");
      if (genus === "f") return v ? "bell'" : "bella";
      return v ? "bell'" : (s ? "bello" : "bel");
    }
    return itAdjektiv(adj, genus, plural);
  }

  /* Italienische Possessivbegleiter: beim Ding immer mit Artikel
     („il mio libro“), bei Verwandten im Singular ohne („mio fratello“). */
  const IT_POSSESSIV = {
    "1sg": { m: "mio", f: "mia", mp: "miei", fp: "mie" },
    "2sg": { m: "tuo", f: "tua", mp: "tuoi", fp: "tue" },
    "3sgm": { m: "suo", f: "sua", mp: "suoi", fp: "sue" },
    "3sgf": { m: "suo", f: "sua", mp: "suoi", fp: "sue" },
    "1pl": { m: "nostro", f: "nostra", mp: "nostri", fp: "nostre" },
    "2pl": { m: "vostro", f: "vostra", mp: "vostri", fp: "vostre" },
    "3pl": { m: "loro", f: "loro", mp: "loro", fp: "loro" },
  };

  /* Das nackte Substantiv ohne Begleiter — entweder ausdrücklich
     eingetragen oder aus einer der fertigen Formen gewonnen. */
  /* Italienische Präpositionen verschmelzen mit dem bestimmten Artikel:
     „di + la chiave“ wird „della chiave“, niemals „di la chiave“. Weil
     der Artikel erst beim Zusammensetzen feststeht, geschieht das ganz
     am Schluss am fertigen Satz. */
  const IT_VERSCHMELZUNG = {
    di: { il: "del", lo: "dello", la: "della", "l'": "dell'", i: "dei", gli: "degli", le: "delle" },
    a: { il: "al", lo: "allo", la: "alla", "l'": "all'", i: "ai", gli: "agli", le: "alle" },
    da: { il: "dal", lo: "dallo", la: "dalla", "l'": "dall'", i: "dai", gli: "dagli", le: "dalle" },
    in: { il: "nel", lo: "nello", la: "nella", "l'": "nell'", i: "nei", gli: "negli", le: "nelle" },
    su: { il: "sul", lo: "sullo", la: "sulla", "l'": "sull'", i: "sui", gli: "sugli", le: "sulle" },
  };
  function itVerschmelzung(text) {
    return text
      .replace(/(^|[\s(])(di|a|da|in|su) (il|lo|la|i|gli|le)\b/gi, (m, vor, p, a) => {
        const t = IT_VERSCHMELZUNG[p.toLowerCase()];
        return t ? vor + t[a.toLowerCase()] : m;
      })
      .replace(/(^|[\s(])(di|a|da|in|su) l'/gi, (m, vor, p) => {
        const t = IT_VERSCHMELZUNG[p.toLowerCase()];
        return t ? vor + t["l'"] : m;
      })
      // „di acqua“ wird zu „d'acqua“ — aber nicht vor einem Artikel.
      .replace(/\bdi (?!un\b|un'|una\b|uno\b)([aeiouàèéìòù])/gi, "d'$1");
  }

  const IT_BEGLEITER_MUSTER = /^(un'|dell'|nell'|all'|sull'|l'|un |una |uno |il |lo |la |i |gli |le |dei |degli |delle |del |dello |della )\s*/i;
  function itNomenVon(ding) {
    if (ding.itNomen) return ding.itNomen;
    const s = ding.itBest || ding.itUnbest || ding.itOhne || ding.it || "";
    return s.replace(IT_BEGLEITER_MUSTER, "").trim();
  }

  /* ===================================================================
     2. ORTE — ein Eintrag, drei Fragen
     ===================================================================
     praep      die Präposition, die zu diesem Ort gehört
     genus      m/f/n, oder plural: true
     begleiter  "bestimmt" (Standard), "ohne" (zu Hause), eigenname
     festWo/festWohin/festWoher  für Wendungen, die sich nicht ableiten
                lassen (zu Hause → nach Hause → von zu Hause)
     it/itWoher die italienischen Formen; wo und wohin sind dort gleich
     =================================================================== */
  const ORTE = [
    { id: "zuhause", nomen: "Hause", genus: "n", praep: "zu", begleiter: "ohne", festWo: "zu Hause", festWohin: "nach Hause", festWoher: "von zu Hause", it: "a casa", itWoher: "da casa", kategorie: "alltag", level: "A1" },
    { id: "kueche", nomen: "Küche", genus: "f", praep: "in", it: "in cucina", itWoher: "dalla cucina", kategorie: "alltag", level: "A1" },
    { id: "garten", nomen: "Garten", genus: "m", praep: "in", it: "in giardino", itWoher: "dal giardino", kategorie: "alltag", level: "A1" },
    { id: "balkon", nomen: "Balkon", genus: "m", praep: "auf", it: "sul balcone", itWoher: "dal balcone", kategorie: "alltag", level: "A2" },
    { id: "bett", nomen: "Bett", genus: "n", praep: "in", it: "a letto", itWoher: "dal letto", kategorie: "alltag", level: "A1" },
    { id: "keller", nomen: "Keller", genus: "m", praep: "in", it: "in cantina", itWoher: "dalla cantina", kategorie: "alltag", level: "A2" },
    { id: "wohnzimmer", nomen: "Wohnzimmer", genus: "n", praep: "in", it: "in soggiorno", itWoher: "dal soggiorno", kategorie: "alltag", level: "A2" },
    { id: "badezimmer", nomen: "Badezimmer", genus: "n", praep: "in", it: "in bagno", itWoher: "dal bagno", kategorie: "alltag", level: "A2" },
    { id: "supermarkt", nomen: "Supermarkt", genus: "m", praep: "in", it: "al supermercato", itWoher: "dal supermercato", kategorie: "einkaufen", level: "A1" },
    { id: "markt", nomen: "Markt", genus: "m", praep: "auf", it: "al mercato", itWoher: "dal mercato", kategorie: "einkaufen", level: "A2" },
    { id: "baeckerei", nomen: "Bäckerei", verkauft: ["brot", "broetchen", "kuchen", "keks", "sandwich", "kaffee", "tee", "nachtisch"], genus: "f", praep: "in", it: "in panetteria", itWoher: "dalla panetteria", kategorie: "einkaufen", level: "A1" },
    { id: "apotheke", nomen: "Apotheke", verkauft: ["medikament", "tablette", "verband", "seife", "zahnbuerste", "rezept"], genus: "f", praep: "in", it: "in farmacia", itWoher: "dalla farmacia", kategorie: "einkaufen", level: "A2" },
    { id: "kaufhaus", nomen: "Kaufhaus", genus: "n", praep: "in", it: "al centro commerciale", itWoher: "dal centro commerciale", kategorie: "einkaufen", level: "A2" },
    { id: "buero", nomen: "Büro", genus: "n", praep: "in", it: "in ufficio", itWoher: "dall'ufficio", kategorie: "arbeit", level: "A1" },
    { id: "arbeit", nomen: "Arbeit", genus: "f", praep: "auf", festWohin: "zur Arbeit", it: "al lavoro", itWoher: "dal lavoro", kategorie: "arbeit", level: "A1" },
    { id: "besprechung", nomen: "Besprechung", genus: "f", praep: "in", it: "in riunione", itWoher: "dalla riunione", kategorie: "arbeit", level: "B1" },
    { id: "werkstatt", nomen: "Werkstatt", genus: "f", praep: "in", it: "in officina", itWoher: "dall'officina", kategorie: "arbeit", level: "B1" },
    { id: "baustelle", nomen: "Baustelle", genus: "f", praep: "auf", it: "in cantiere", itWoher: "dal cantiere", kategorie: "arbeit", level: "B1" },
    { id: "schule", nomen: "Schule", genus: "f", praep: "in", it: "a scuola", itWoher: "da scuola", kategorie: "bildung", level: "A1" },
    { id: "uni", nomen: "Universität", genus: "f", praep: "an", it: "all'università", itWoher: "dall'università", kategorie: "bildung", level: "A2" },
    { id: "bibliothek", nomen: "Bibliothek", genus: "f", praep: "in", it: "in biblioteca", itWoher: "dalla biblioteca", kategorie: "bildung", level: "A2" },
    { id: "kurs", nomen: "Kurs", genus: "m", praep: "in", it: "al corso", itWoher: "dal corso", kategorie: "bildung", level: "A2" },
    { id: "meer", nomen: "Meer", genus: "n", praep: "an", it: "al mare", itWoher: "dal mare", kategorie: "freizeit", level: "A1" },
    { id: "berge", nomen: "Berge", genus: "m", plural: true, praep: "in", it: "in montagna", itWoher: "dalla montagna", kategorie: "freizeit", level: "A1" },
    { id: "see", nomen: "See", genus: "m", praep: "an", it: "al lago", itWoher: "dal lago", kategorie: "freizeit", level: "A2" },
    { id: "park", nomen: "Park", genus: "m", praep: "in", it: "al parco", itWoher: "dal parco", kategorie: "freizeit", level: "A1" },
    { id: "kino", nomen: "Kino", genus: "n", praep: "in", it: "al cinema", itWoher: "dal cinema", kategorie: "freizeit", level: "A1" },
    { id: "theater", nomen: "Theater", genus: "n", praep: "in", it: "a teatro", itWoher: "dal teatro", kategorie: "freizeit", level: "A2" },
    { id: "museum", nomen: "Museum", genus: "n", praep: "in", genitiv: "Museums", it: "al museo", itWoher: "dal museo", kategorie: "freizeit", level: "A2" },
    { id: "schwimmbad", nomen: "Schwimmbad", genus: "n", praep: "in", it: "in piscina", itWoher: "dalla piscina", kategorie: "freizeit", level: "A2" },
    { id: "stadion", nomen: "Stadion", genus: "n", praep: "in", genitiv: "Stadions", it: "allo stadio", itWoher: "dallo stadio", kategorie: "freizeit", level: "B1" },
    { id: "konzert", nomen: "Konzert", genus: "n", praep: "auf", it: "al concerto", itWoher: "dal concerto", kategorie: "freizeit", level: "B1" },
    { id: "restaurant", nomen: "Restaurant", genus: "n", praep: "in", genitiv: "Restaurants", it: "al ristorante", itWoher: "dal ristorante", kategorie: "essen", level: "A1" },
    { id: "cafe", nomen: "Café", genus: "n", praep: "in", genitiv: "Cafés", it: "al bar", itWoher: "dal bar", kategorie: "essen", level: "A1" },
    { id: "kantine", nomen: "Kantine", genus: "f", praep: "in", it: "in mensa", itWoher: "dalla mensa", kategorie: "essen", level: "B1" },
    { id: "bahnhof", nomen: "Bahnhof", genus: "m", praep: "an", festWohin: "zum Bahnhof", it: "alla stazione", itWoher: "dalla stazione", kategorie: "reisen", level: "A1" },
    { id: "flughafen", nomen: "Flughafen", genus: "m", praep: "an", festWohin: "zum Flughafen", it: "all'aeroporto", itWoher: "dall'aeroporto", kategorie: "reisen", level: "A2" },
    { id: "hotel", nomen: "Hotel", genus: "n", praep: "in", genitiv: "Hotels", it: "in albergo", itWoher: "dall'albergo", kategorie: "reisen", level: "A2" },
    { id: "italien", nomen: "Italien", eigenname: true, genus: "n", praep: "in", festWohin: "nach Italien", it: "in Italia", itWoher: "dall'Italia", kategorie: "reisen", level: "A1" },
    { id: "berlin", nomen: "Berlin", eigenname: true, genus: "n", praep: "in", festWohin: "nach Berlin", it: "a Berlino", itWoher: "da Berlino", kategorie: "reisen", level: "A1" },
    { id: "rom", nomen: "Rom", eigenname: true, genus: "n", praep: "in", festWohin: "nach Rom", it: "a Roma", itWoher: "da Roma", kategorie: "reisen", level: "A1" },
    { id: "stadt", nomen: "Stadt", genus: "f", praep: "in", it: "in città", itWoher: "dalla città", kategorie: "reisen", level: "A1" },
    { id: "land", nomen: "Land", genus: "n", praep: "auf", festWo: "auf dem Land", festWohin: "aufs Land", festWoher: "vom Land", it: "in campagna", itWoher: "dalla campagna", kategorie: "reisen", level: "A2" },
    { id: "arzt", nomen: "Arzt", genus: "m", praep: "bei", festWohin: "zum Arzt", it: "dal medico", itWoher: "dal medico", kategorie: "gesundheit", level: "A1" },
    { id: "krankenhaus", nomen: "Krankenhaus", genus: "n", praep: "in", it: "in ospedale", itWoher: "dall'ospedale", kategorie: "gesundheit", level: "A2" },
    { id: "zahnarzt", nomen: "Zahnarzt", genus: "m", praep: "bei", festWohin: "zum Zahnarzt", it: "dal dentista", itWoher: "dal dentista", kategorie: "gesundheit", level: "A2" },
    { id: "amt", nomen: "Amt", genus: "n", praep: "auf", it: "in comune", itWoher: "dal comune", kategorie: "verwaltung", level: "B1" },
    { id: "bank", nomen: "Bank", genus: "f", praep: "auf", it: "in banca", itWoher: "dalla banca", kategorie: "verwaltung", level: "A2" },
    { id: "post", nomen: "Post", genus: "f", praep: "auf", it: "alla posta", itWoher: "dalla posta", kategorie: "verwaltung", level: "A2" },

    /* --- neu aufgenommen --- */
    { id: "flur", nomen: "Flur", genus: "m", praep: "in", it: "nel corridoio", itWoher: "dal corridoio", kategorie: "alltag", level: "A2" },
    { id: "schlafzimmer", nomen: "Schlafzimmer", genus: "n", praep: "in", it: "nella camera da letto", itWoher: "dalla camera da letto", kategorie: "alltag", level: "A1" },
    { id: "terrasse", nomen: "Terrasse", genus: "f", praep: "auf", it: "sulla terrazza", itWoher: "dalla terrazza", kategorie: "alltag", level: "A2" },
    { id: "garage", nomen: "Garage", genus: "f", praep: "in", it: "in garage", itWoher: "dal garage", kategorie: "alltag", level: "A2" },
    { id: "hof", nomen: "Hof", genus: "m", praep: "auf", it: "nel cortile", itWoher: "dal cortile", kategorie: "alltag", level: "A2" },
    { id: "dachboden", nomen: "Dachboden", genus: "m", praep: "auf", it: "in soffitta", itWoher: "dalla soffitta", kategorie: "alltag", level: "B1" },
    { id: "metzgerei", nomen: "Metzgerei", verkauft: ["fleisch", "fisch", "kaese", "wurst"], genus: "f", praep: "in", it: "in macelleria", itWoher: "dalla macelleria", kategorie: "einkaufen", level: "A2" },
    { id: "buchhandlung", nomen: "Buchhandlung", verkauft: ["buch", "zeitung", "zeitschrift", "roman", "gedicht", "woerterbuch", "heft", "stift", "grammatik", "karte", "spiel"], genus: "f", praep: "in", it: "in libreria", itWoher: "dalla libreria", kategorie: "einkaufen", level: "A2" },
    { id: "drogerie", nomen: "Drogerie", verkauft: ["seife", "zahnbuerste", "handtuch", "zucker", "salz", "joghurt", "schokolade", "keks", "blume"], genus: "f", praep: "in", it: "in profumeria", itWoher: "dalla profumeria", kategorie: "einkaufen", level: "A2" },
    { id: "schuhgeschaeft", nomen: "Schuhgeschäft", verkauft: ["schuhe", "handschuhe", "muetze", "schal"], genus: "n", praep: "in", it: "nel negozio di scarpe", itWoher: "dal negozio di scarpe", kategorie: "einkaufen", level: "A2" },
    { id: "fabrik", nomen: "Fabrik", genus: "f", praep: "in", it: "in fabbrica", itWoher: "dalla fabbrica", kategorie: "arbeit", level: "B1" },
    { id: "labor", nomen: "Labor", genus: "n", praep: "in", it: "in laboratorio", itWoher: "dal laboratorio", kategorie: "arbeit", level: "B1" },
    { id: "lager", nomen: "Lager", genus: "n", praep: "in", it: "in magazzino", itWoher: "dal magazzino", kategorie: "arbeit", level: "B1" },
    { id: "filiale", nomen: "Filiale", genus: "f", praep: "in", it: "nella filiale", itWoher: "dalla filiale", kategorie: "arbeit", level: "B1" },
    { id: "kinderzimmer", nomen: "Kinderzimmer", genus: "n", praep: "in", it: "nella cameretta", itWoher: "dalla cameretta", kategorie: "familie", level: "A1" },
    { id: "kindergarten", nomen: "Kindergarten", genus: "m", praep: "in", it: "all'asilo", itWoher: "dall'asilo", kategorie: "familie", level: "A1" },
    { id: "kita", nomen: "Kita", genus: "f", praep: "in", it: "al nido", itWoher: "dal nido", kategorie: "familie", level: "A2" },
    { id: "spielplatz", nomen: "Spielplatz", genus: "m", praep: "auf", it: "al parco giochi", itWoher: "dal parco giochi", kategorie: "familie", level: "A1" },
    { id: "elternhaus", nomen: "Elternhaus", genus: "n", praep: "in", it: "a casa dei genitori", itWoher: "da casa dei genitori", kategorie: "familie", level: "B1" },
    { id: "wald", nomen: "Wald", genus: "m", praep: "in", it: "nel bosco", itWoher: "dal bosco", kategorie: "freizeit", level: "A1" },
    { id: "strand", nomen: "Strand", genus: "m", praep: "an", it: "in spiaggia", itWoher: "dalla spiaggia", kategorie: "freizeit", level: "A1" },
    { id: "fluss", nomen: "Fluss", genus: "m", praep: "an", it: "al fiume", itWoher: "dal fiume", kategorie: "freizeit", level: "A2" },
    { id: "zoo", nomen: "Zoo", genus: "m", praep: "in", it: "allo zoo", itWoher: "dallo zoo", kategorie: "freizeit", level: "A1" },
    { id: "disko", nomen: "Disko", genus: "f", praep: "in", it: "in discoteca", itWoher: "dalla discoteca", kategorie: "freizeit", level: "A2" },
    { id: "imbiss", nomen: "Imbiss", verkauft: ["pizza", "sandwich", "broetchen", "kaffee", "eis"], genus: "m", praep: "an", it: "al chiosco", itWoher: "dal chiosco", kategorie: "essen", level: "A2" },
    { id: "eisdiele", nomen: "Eisdiele", verkauft: ["eis", "kaffee", "kuchen", "nachtisch"], genus: "f", praep: "in", it: "in gelateria", itWoher: "dalla gelateria", kategorie: "essen", level: "A2" },
    { id: "pizzeria", nomen: "Pizzeria", verkauft: ["pizza", "wein", "bier", "nachtisch", "salat", "nudeln"], genus: "f", praep: "in", it: "in pizzeria", itWoher: "dalla pizzeria", kategorie: "essen", level: "A1" },
    { id: "bar", nomen: "Bar", genus: "f", praep: "in", it: "al bar", itWoher: "dal bar", kategorie: "essen", level: "A1" },
    { id: "weinkeller", nomen: "Weinkeller", verkauft: ["wein", "bier", "kaese"], genus: "m", praep: "in", it: "in cantina", itWoher: "dalla cantina", kategorie: "essen", level: "B1" },
    { id: "hafen", nomen: "Hafen", genus: "m", praep: "in", it: "al porto", itWoher: "dal porto", kategorie: "reisen", level: "A2" },
    { id: "haltestelle", nomen: "Haltestelle", genus: "f", praep: "an", it: "alla fermata", itWoher: "dalla fermata", kategorie: "reisen", level: "A2" },
    { id: "faehre", nomen: "Fähre", genus: "f", praep: "auf", it: "sul traghetto", itWoher: "dal traghetto", kategorie: "reisen", level: "B1" },
    { id: "autobahn", nomen: "Autobahn", genus: "f", praep: "auf", it: "in autostrada", itWoher: "dall'autostrada", kategorie: "reisen", level: "A2" },
    { id: "schweiz", nomen: "Schweiz", genus: "f", praep: "in", eigenname: true, festWo: "in der Schweiz", festWohin: "in die Schweiz", festWoher: "aus der Schweiz", it: "in Svizzera", itWoher: "dalla Svizzera", kategorie: "reisen", level: "A1" },
    { id: "oesterreich", nomen: "Österreich", genus: "n", praep: "in", eigenname: true, festWohin: "nach Österreich", festWoher: "aus Österreich", it: "in Austria", itWoher: "dall'Austria", kategorie: "reisen", level: "A1" },
    { id: "klassenzimmer", nomen: "Klassenzimmer", genus: "n", praep: "in", it: "in aula", itWoher: "dall'aula", kategorie: "bildung", level: "A1" },
    { id: "hoersaal", nomen: "Hörsaal", genus: "m", praep: "in", it: "in aula magna", itWoher: "dall'aula magna", kategorie: "bildung", level: "B1" },
    { id: "sprachschule", nomen: "Sprachschule", genus: "f", praep: "in", it: "nella scuola di lingue", itWoher: "dalla scuola di lingue", kategorie: "bildung", level: "A2" },
    { id: "seminarraum", nomen: "Seminarraum", genus: "m", praep: "in", it: "nella sala seminari", itWoher: "dalla sala seminari", kategorie: "bildung", level: "B1" },
    { id: "schulhof", nomen: "Schulhof", genus: "m", praep: "auf", it: "nel cortile della scuola", itWoher: "dal cortile della scuola", kategorie: "bildung", level: "A2" },
    { id: "praxis", nomen: "Praxis", genus: "f", praep: "in", it: "in ambulatorio", itWoher: "dall'ambulatorio", kategorie: "gesundheit", level: "A2" },
    { id: "notaufnahme", nomen: "Notaufnahme", genus: "f", praep: "in", it: "al pronto soccorso", itWoher: "dal pronto soccorso", kategorie: "gesundheit", level: "B1" },
    { id: "physiotherapie", nomen: "Physiotherapie", genus: "f", praep: "in", it: "in fisioterapia", itWoher: "dalla fisioterapia", kategorie: "gesundheit", level: "B1" },
    { id: "sauna", nomen: "Sauna", genus: "f", praep: "in", it: "in sauna", itWoher: "dalla sauna", kategorie: "gesundheit", level: "A2" },
    { id: "fitnessstudio", nomen: "Fitnessstudio", genus: "n", praep: "in", it: "in palestra", itWoher: "dalla palestra", kategorie: "gesundheit", level: "A2" },
    { id: "rathaus", nomen: "Rathaus", genus: "n", praep: "in", it: "in municipio", itWoher: "dal municipio", kategorie: "verwaltung", level: "A2" },
    { id: "botschaft", nomen: "Botschaft", genus: "f", praep: "in", it: "all'ambasciata", itWoher: "dall'ambasciata", kategorie: "verwaltung", level: "B1" },
    { id: "polizei", nomen: "Polizei", genus: "f", praep: "bei", it: "alla polizia", itWoher: "dalla polizia", kategorie: "verwaltung", level: "A1" },
    { id: "gericht", nomen: "Gericht", genus: "n", praep: "vor", begleiter: "ohne", festWoher: "vom Gericht", it: "in tribunale", itWoher: "dal tribunale", kategorie: "verwaltung", level: "B2" },
    { id: "auslaenderbehoerde", nomen: "Ausländerbehörde", genus: "f", praep: "bei", it: "all'ufficio stranieri", itWoher: "dall'ufficio stranieri", kategorie: "verwaltung", level: "B2" },
  ];

  /* Die Ortsform für eine Frage. Hier steckt der Kern des Moduls: derselbe
     Eintrag, drei verschiedene Ergebnisse — und nichts davon ist als
     fertige Zeichenkette gespeichert. */
  function ortsform(ort, rolle) {
    if (!ort) return "";
    if (rolle === "wo" && ort.festWo) return ort.festWo;
    if (rolle === "wohin" && ort.festWohin) return ort.festWohin;
    if (rolle === "woher" && ort.festWoher) return ort.festWoher;

    if (rolle === "woher") {
      // „aus“ bei Räumen, „von“ bei Personen, Flächen und offenen Orten.
      const praep = ["bei", "auf", "an", "zu"].includes(ort.praep) ? "von" : "aus";
      if (ort.eigenname) return praep + " " + ort.nomen;
      if (ort.begleiter === "ohne") return praep + " " + ort.nomen;
      const genus = ort.plural ? "pl" : ort.genus;
      return verschmelze(praep, ARTIKEL_BESTIMMT.dat[genus]) + " " + beugeNomen(ort, "dat", genus);
    }
    let praep = ort.praep;
    let fall = "dat";
    if (rolle === "wohin") {
      if (WECHSEL.includes(praep)) fall = "akk";
      else if (praep === "bei") { praep = "zu"; fall = "dat"; }
    }
    if (ort.eigenname) return (rolle === "wohin" ? "nach" : praep) + " " + ort.nomen;
    if (ort.begleiter === "ohne") return praep + " " + ort.nomen;
    const genus = ort.plural ? "pl" : ort.genus;
    return verschmelze(praep, ARTIKEL_BESTIMMT[fall][genus]) + " " + beugeNomen(ort, fall, genus);
  }
  function itOrtsform(ort, rolle) {
    if (!ort) return "";
    return rolle === "woher" ? (ort.itWoher || ort.it) : ort.it;
  }

  /* ===================================================================
     3. DINGE, PERSONEN, ADJEKTIVE
     =================================================================== */
  const SUBJEKTE = [
    { id: "1sg", de: "ich", it: "io", person: 1, zahl: "sg", possessiv: "mein", itGenus: "m" },
    { id: "2sg", de: "du", it: "tu", person: 2, zahl: "sg", possessiv: "dein", itGenus: "m" },
    { id: "3sgm", de: "er", it: "lui", person: 3, zahl: "sg", possessiv: "sein", itGenus: "m" },
    { id: "3sgf", de: "sie", it: "lei", person: 3, zahl: "sg", possessiv: "ihr", itGenus: "f" },
    { id: "1pl", de: "wir", it: "noi", person: 1, zahl: "pl", possessiv: "unser", itGenus: "m" },
    { id: "2pl", de: "ihr", it: "voi", person: 2, zahl: "pl", possessiv: "euer", itGenus: "m" },
    { id: "3pl", de: "sie", it: "loro", person: 3, zahl: "pl", possessiv: "ihr", itGenus: "m" },
  ];

  /* Dinge. „rollen“ sagt, in welchen Zusammenhängen ein Ding auftreten
     kann; „adjektive“ nennt die Eigenschaften, die zu ihm passen — so
     entsteht nie „die müde Tür“. */
  /* Dinge.
     begleiter  welche Begleiter zu diesem Wort passen, der erste ist der
                natürliche Normalfall. Das ist der Unterschied zwischen
                „ich esse einen Apfel“ (so sagt man es) und „ich esse den
                Apfel“ (nur, wenn ein bestimmter gemeint ist).
                  unbestimmt  ein/eine/einen
                  bestimmt    der/die/das
                  ohne        gar keiner (Musik, Zeit, Hunger, Deutsch)
                  possessiv   mein/dein/…
                  kein        Verneinung: kein Brot, keine Zeit
     itBest/itUnbest/itOhne  die italienischen Entsprechungen dazu
     rollen     in welchen Zusammenhängen das Wort auftreten kann
     adjektive  welche Eigenschaften dazu passen — so entsteht nie
                „die müde Tür“ */
  const DINGE = [
    { id: "brot", nomen: "Brot", genus: "n", begleiter: ["unbestimmt", "bestimmt", "ohne", "kein"], itUnbest: "un pane", itBest: "il pane", itOhne: "pane", it: "un pane", itGenus: "m", kategorie: "essen", level: "A1", rollen: ["essen", "kaufen"], adjektive: ["frisch", "warm", "gut", "billig", "teuer", "lecker"] },
    { id: "apfel", nomen: "Apfel", genus: "m", begleiter: ["unbestimmt", "bestimmt", "possessiv", "kein"], itUnbest: "una mela", itBest: "la mela", it: "una mela", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["essen", "kaufen"], adjektive: ["frisch", "gross", "klein", "gut", "lecker", "billig"] },
    { id: "pizza", nomen: "Pizza", genus: "f", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una pizza", itBest: "la pizza", it: "una pizza", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["essen", "kaufen", "kochen"], adjektive: ["warm", "gut", "lecker", "gross", "teuer"] },
    { id: "suppe", nomen: "Suppe", genus: "f", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una minestra", itBest: "la minestra", it: "una minestra", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["essen", "kochen"], adjektive: ["warm", "heiss", "gut", "lecker"] },
    { id: "kuchen", nomen: "Kuchen", genus: "m", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una torta", itBest: "la torta", it: "una torta", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["essen", "kochen", "kaufen"], adjektive: ["frisch", "gut", "lecker", "gross", "teuer"] },
    { id: "nudeln", nomen: "Nudeln", genus: "f", plural: true, begleiter: ["ohne", "bestimmt", "kein"], itOhne: "pasta", itBest: "la pasta", it: "la pasta", itGenus: "f", itPlural: true, kategorie: "essen", level: "A1", rollen: ["essen", "kochen"], adjektive: ["warm", "gut", "lecker"] },
    { id: "kaffee", nomen: "Kaffee", genus: "m", begleiter: ["unbestimmt", "bestimmt", "ohne", "kein"], itUnbest: "un caffè", itBest: "il caffè", itOhne: "caffè", it: "un caffè", itGenus: "m", kategorie: "essen", level: "A1", rollen: ["trinken", "kaufen"], adjektive: ["heiss", "stark", "gut", "teuer", "billig"] },
    { id: "tee", nomen: "Tee", genus: "m", begleiter: ["unbestimmt", "bestimmt", "ohne", "kein"], itUnbest: "un tè", itBest: "il tè", itOhne: "tè", it: "un tè", itGenus: "m", kategorie: "essen", level: "A1", rollen: ["trinken", "kaufen"], adjektive: ["heiss", "warm", "gut", "stark"] },
    { id: "wasser", nomen: "Wasser", genus: "n", begleiter: ["ohne", "bestimmt", "kein"], itOhne: "acqua", itBest: "l'acqua", it: "dell'acqua", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["trinken"], adjektive: ["kalt", "warm", "frisch"] },
    { id: "wein", nomen: "Wein", genus: "m", begleiter: ["unbestimmt", "bestimmt", "ohne", "kein"], itUnbest: "un vino", itBest: "il vino", itOhne: "vino", it: "un vino", itGenus: "m", kategorie: "essen", level: "A2", rollen: ["trinken", "kaufen"], adjektive: ["gut", "teuer", "billig", "kalt"] },
    { id: "waesche", nomen: "Wäsche", genus: "f", begleiter: ["bestimmt"], itBest: "il bucato", it: "il bucato", itGenus: "m", kategorie: "alltag", level: "A2", rollen: ["machen"], adjektive: ["sauber", "schmutzig", "nass", "trocken"] },
    { id: "geschirr", nomen: "Geschirr", genus: "n", begleiter: ["bestimmt"], itBest: "i piatti", it: "i piatti", itGenus: "m", itPlural: true, kategorie: "alltag", level: "A2", rollen: ["machen"], adjektive: ["sauber", "schmutzig"] },
    { id: "einkauf", nomen: "Einkauf", genus: "m", begleiter: ["bestimmt"], itBest: "la spesa", it: "la spesa", itGenus: "f", kategorie: "einkaufen", level: "A2", rollen: ["machen"], adjektive: ["gross", "klein", "teuer"] },
    { id: "fruehstueck", nomen: "Frühstück", genus: "n", begleiter: ["ohne", "bestimmt"], itOhne: "colazione", itBest: "la colazione", it: "colazione", itGenus: "f", kategorie: "alltag", level: "A1", rollen: ["machen"], adjektive: [] },
    { id: "buch", nomen: "Buch", genus: "n", begleiter: ["unbestimmt", "bestimmt", "possessiv", "kein"], itUnbest: "un libro", itBest: "il libro", it: "un libro", itGenus: "m", kategorie: "bildung", level: "A1", rollen: ["lesen", "kaufen", "schreiben"], adjektive: ["gut", "neu", "alt", "spannend", "dick", "teuer", "schwierig"] },
    { id: "zeitung", nomen: "Zeitung", genus: "f", begleiter: ["bestimmt", "unbestimmt", "kein"], itBest: "il giornale", itUnbest: "un giornale", it: "il giornale", itGenus: "m", kategorie: "bildung", level: "A1", rollen: ["lesen", "kaufen"], adjektive: ["neu", "alt", "gut"] },
    { id: "brief", nomen: "Brief", genus: "m", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una lettera", itBest: "la lettera", it: "una lettera", itGenus: "f", kategorie: "arbeit", level: "A2", rollen: ["lesen", "schreiben"], adjektive: ["lang", "kurz", "wichtig", "freundlich"] },
    { id: "nachricht", nomen: "Nachricht", genus: "f", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "un messaggio", itBest: "il messaggio", it: "un messaggio", itGenus: "m", kategorie: "arbeit", level: "A2", rollen: ["lesen", "schreiben"], adjektive: ["kurz", "lang", "wichtig", "freundlich"] },
    { id: "bericht", nomen: "Bericht", genus: "m", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una relazione", itBest: "la relazione", it: "una relazione", itGenus: "f", kategorie: "arbeit", level: "B1", rollen: ["lesen", "schreiben"], adjektive: ["lang", "kurz", "wichtig", "schwierig", "genau"] },
    { id: "mail", nomen: "E-Mail", genus: "f", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "un'e-mail", itBest: "l'e-mail", it: "un'e-mail", itGenus: "f", kategorie: "arbeit", level: "A2", rollen: ["lesen", "schreiben"], adjektive: ["kurz", "lang", "wichtig", "freundlich"] },
    { id: "film", nomen: "Film", genus: "m", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "un film", itBest: "il film", it: "un film", itGenus: "m", kategorie: "freizeit", level: "A1", rollen: ["sehen"], adjektive: ["gut", "spannend", "lang", "kurz", "neu", "alt", "langweilig"] },
    { id: "musik", nomen: "Musik", genus: "f", begleiter: ["ohne", "bestimmt"], itOhne: "musica", itBest: "la musica", it: "musica", itGenus: "f", kategorie: "freizeit", level: "A1", rollen: ["hoeren"], adjektive: ["laut", "leise", "gut", "schoen"] },
    { id: "fussball", nomen: "Fußball", genus: "m", begleiter: ["ohne"], itOhne: "a calcio", it: "a calcio", itGenus: "m", kategorie: "freizeit", level: "A1", rollen: ["spielen"], adjektive: [] },
    { id: "klavier", nomen: "Klavier", genus: "n", begleiter: ["bestimmt"], itBest: "il pianoforte", it: "il pianoforte", itGenus: "m", kategorie: "freizeit", level: "A2", rollen: ["spielen"], adjektive: ["alt", "neu", "teuer"] },
    { id: "karten", nomen: "Karten", genus: "f", plural: true, begleiter: ["ohne"], itOhne: "a carte", it: "a carte", itGenus: "f", itPlural: true, kategorie: "freizeit", level: "A2", rollen: ["spielen"], adjektive: [] },
    { id: "foto", nomen: "Foto", genus: "n", genitiv: "Fotos", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una foto", itBest: "la foto", it: "una foto", itGenus: "f", kategorie: "freizeit", level: "A2", rollen: ["machen", "sehen"], adjektive: ["schoen", "alt", "neu", "gross"] },
    { id: "deutsch", nomen: "Deutsch", genus: "n", begleiter: ["ohne"], itOhne: "tedesco", itBest: "il tedesco", it: "il tedesco", itGenus: "m", kategorie: "bildung", level: "A1", rollen: ["sprechen", "lernen", "verstehen"], adjektive: [] },
    { id: "italienisch", nomen: "Italienisch", genus: "n", begleiter: ["ohne"], itOhne: "italiano", itBest: "l'italiano", it: "l'italiano", itGenus: "m", kategorie: "bildung", level: "A1", rollen: ["sprechen", "lernen", "verstehen"], adjektive: [] },
    { id: "termin", nomen: "Termin", genus: "m", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "un appuntamento", itBest: "l'appuntamento", it: "un appuntamento", itGenus: "m", kategorie: "arbeit", level: "A2", rollen: ["machen", "haben"], adjektive: ["wichtig", "neu"] },
    { id: "vertrag", nomen: "Vertrag", genus: "m", begleiter: ["bestimmt", "unbestimmt", "kein"], itBest: "il contratto", itUnbest: "un contratto", it: "il contratto", itGenus: "m", kategorie: "verwaltung", level: "B1", rollen: ["lesen", "schreiben"], adjektive: ["neu", "alt", "wichtig", "lang", "schwierig"] },
    { id: "antrag", nomen: "Antrag", genus: "m", begleiter: ["unbestimmt", "bestimmt", "kein"], itUnbest: "una domanda", itBest: "la domanda", it: "una domanda", itGenus: "f", kategorie: "verwaltung", level: "B1", rollen: ["schreiben", "machen"], adjektive: ["neu", "wichtig", "schwierig"] },
    { id: "zeit", nomen: "Zeit", genus: "f", begleiter: ["ohne", "kein"], itOhne: "tempo", it: "tempo", itGenus: "m", kategorie: "alltag", level: "A1", rollen: ["haben"], adjektive: [] },
    { id: "hunger", nomen: "Hunger", genus: "m", begleiter: ["ohne", "kein"], itOhne: "fame", it: "fame", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["haben"], adjektive: [] },
    { id: "durst", nomen: "Durst", genus: "m", begleiter: ["ohne", "kein"], itOhne: "sete", it: "sete", itGenus: "f", kategorie: "essen", level: "A1", rollen: ["haben"], adjektive: [] },

    /* --- neu aufgenommen --- */
    { id: "kaese", nomen: "Käse", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "formaggio", itGenus: "m", itBest: "il formaggio", itOhne: "formaggio", it: "formaggio", kategorie: "essen", level: "A1", rollen: ["essen","kaufen","bestellen","mitbringen"], adjektive: ["lecker","frisch","alt","teuer","guenstig","hart","weich"] },
    { id: "butter", nomen: "Butter", genus: "f", begleiter: ["ohne","bestimmt","kein"], itNomen: "burro", itGenus: "m", itBest: "il burro", itOhne: "burro", it: "burro", kategorie: "essen", level: "A1", rollen: ["essen","kaufen","brauchen"], adjektive: ["frisch","weich","teuer","guenstig"] },
    { id: "ei", nomen: "Ei", genus: "n", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "uovo", itGenus: "m", itBest: "l'uovo", itUnbest: "un uovo", it: "un uovo", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen","brauchen"], adjektive: ["frisch","gross","klein","gut"] },
    { id: "fleisch", nomen: "Fleisch", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "carne", itGenus: "f", itBest: "la carne", itOhne: "carne", it: "carne", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen","bestellen"], adjektive: ["frisch","teuer","guenstig","lecker"] },
    { id: "fisch", nomen: "Fisch", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "pesce", itGenus: "m", itBest: "il pesce", itOhne: "pesce", it: "pesce", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen","bestellen"], adjektive: ["frisch","lecker","teuer","guenstig"] },
    { id: "gemuese", nomen: "Gemüse", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "verdura", itGenus: "f", itBest: "la verdura", itOhne: "verdura", it: "verdura", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen"], adjektive: ["frisch","gesund","lecker","bunt"] },
    { id: "obst", nomen: "Obst", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "frutta", itGenus: "f", itBest: "la frutta", itOhne: "frutta", it: "frutta", kategorie: "essen", level: "A1", rollen: ["essen","kaufen"], adjektive: ["frisch","gesund","lecker","suess"] },
    { id: "salat", nomen: "Salat", genus: "m", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "insalata", itGenus: "f", itBest: "l'insalata", itUnbest: "un'insalata", it: "un'insalata", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen","bestellen","machen"], adjektive: ["frisch","lecker","gesund","gross","klein"] },
    { id: "reis", nomen: "Reis", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "riso", itGenus: "m", itBest: "il riso", itOhne: "riso", it: "riso", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen"], adjektive: ["lecker","gesund"] },
    { id: "kartoffeln", nomen: "Kartoffeln", genus: "f", plural: true, begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "patate", itGenus: "f", itPlural: true, itBest: "le patate", itUnbest: "delle patate", it: "delle patate", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen"], adjektive: ["frisch","lecker","klein","gross"] },
    { id: "tomaten", nomen: "Tomaten", genus: "f", plural: true, begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "pomodori", itGenus: "m", itPlural: true, itBest: "i pomodori", itUnbest: "dei pomodori", it: "dei pomodori", kategorie: "essen", level: "A1", rollen: ["essen","kochen","kaufen"], adjektive: ["frisch","rot","lecker","klein","gross"] },
    { id: "zwiebel", nomen: "Zwiebel", genus: "f", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "cipolla", itGenus: "f", itBest: "la cipolla", itUnbest: "una cipolla", it: "una cipolla", kategorie: "essen", level: "A2", rollen: ["kochen","kaufen","brauchen"], adjektive: ["klein","gross","frisch"] },
    { id: "milch", nomen: "Milch", genus: "f", begleiter: ["ohne","bestimmt","kein"], itNomen: "latte", itGenus: "m", itBest: "il latte", itOhne: "latte", it: "latte", kategorie: "essen", level: "A1", rollen: ["trinken","kaufen","brauchen"], adjektive: ["frisch","kalt","warm","guenstig"] },
    { id: "saft", nomen: "Saft", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "succo", itGenus: "m", itBest: "il succo", itOhne: "succo", it: "succo", kategorie: "essen", level: "A1", rollen: ["trinken","kaufen","machen"], adjektive: ["frisch","kalt","suess","lecker"] },
    { id: "bier", nomen: "Bier", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "birra", itGenus: "f", itBest: "la birra", itOhne: "birra", it: "birra", kategorie: "essen", level: "A1", rollen: ["trinken","kaufen","bestellen"], adjektive: ["kalt","lecker","teuer","guenstig"] },
    { id: "zucker", nomen: "Zucker", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "zucchero", itGenus: "m", itBest: "lo zucchero", itOhne: "zucchero", it: "zucchero", kategorie: "essen", level: "A1", rollen: ["brauchen","kaufen"], adjektive: ["suess","weiss"] },
    { id: "salz", nomen: "Salz", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "sale", itGenus: "m", itBest: "il sale", itOhne: "sale", it: "sale", kategorie: "essen", level: "A1", rollen: ["brauchen","kaufen"], adjektive: ["teuer","guenstig"] },
    { id: "pfeffer", nomen: "Pfeffer", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "pepe", itGenus: "m", itBest: "il pepe", itOhne: "pepe", it: "pepe", kategorie: "essen", level: "A2", rollen: ["brauchen","kaufen"], adjektive: ["scharf"] },
    { id: "oel", nomen: "Öl", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "olio", itGenus: "m", itBest: "l'olio", itOhne: "olio", it: "olio", kategorie: "essen", level: "A2", rollen: ["brauchen","kaufen","kochen"], adjektive: ["teuer","guenstig"] },
    { id: "marmelade", nomen: "Marmelade", genus: "f", begleiter: ["ohne","bestimmt","kein"], itNomen: "marmellata", itGenus: "f", itBest: "la marmellata", itOhne: "marmellata", it: "marmellata", kategorie: "essen", level: "A2", rollen: ["essen","kaufen","machen"], adjektive: ["suess","lecker"] },
    { id: "joghurt", nomen: "Joghurt", genus: "m", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "yogurt", itGenus: "m", itBest: "lo yogurt", itUnbest: "uno yogurt", it: "uno yogurt", kategorie: "essen", level: "A2", rollen: ["essen","kaufen"], adjektive: ["frisch","lecker","gesund"] },
    { id: "schokolade", nomen: "Schokolade", genus: "f", begleiter: ["ohne","bestimmt","kein"], itNomen: "cioccolato", itGenus: "m", itBest: "il cioccolato", itOhne: "cioccolato", it: "cioccolato", kategorie: "essen", level: "A1", rollen: ["essen","kaufen","schenken"], adjektive: ["suess","lecker","bitter","dunkel","teuer"] },
    { id: "eis", nomen: "Eis", genus: "n", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "gelato", itGenus: "m", itBest: "il gelato", itUnbest: "un gelato", it: "un gelato", kategorie: "essen", level: "A1", rollen: ["essen","kaufen"], adjektive: ["lecker","kalt","suess","teuer","guenstig"] },
    { id: "keks", nomen: "Keks", genus: "m", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "biscotto", itGenus: "m", itBest: "il biscotto", itUnbest: "un biscotto", it: "un biscotto", kategorie: "essen", level: "A1", rollen: ["essen","kaufen","machen"], adjektive: ["lecker","suess","hart","weich","klein"] },
    { id: "broetchen", nomen: "Brötchen", genus: "n", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "panino", itGenus: "m", itBest: "il panino", itUnbest: "un panino", it: "un panino", kategorie: "essen", level: "A1", rollen: ["essen","kaufen","machen","mitbringen"], adjektive: ["frisch","lecker","klein","gross"] },
    { id: "sandwich", nomen: "Sandwich", genus: "n", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "sandwich", itGenus: "m", itBest: "il sandwich", itUnbest: "un sandwich", it: "un sandwich", kategorie: "essen", level: "A2", rollen: ["essen","kaufen","machen","mitbringen"], adjektive: ["lecker","frisch","gross","klein"] },
    { id: "nachtisch", nomen: "Nachtisch", genus: "m", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "dolce", itGenus: "m", itBest: "il dolce", itUnbest: "un dolce", it: "un dolce", kategorie: "essen", level: "A2", rollen: ["essen","bestellen","machen"], adjektive: ["lecker","suess"] },
    { id: "rechnung", nomen: "Rechnung", genus: "f", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "conto", itGenus: "m", itBest: "il conto", itUnbest: "un conto", it: "un conto", kategorie: "einkaufen", level: "A2", rollen: ["bezahlen","bekommen","geben","brauchen"], adjektive: ["hoch","teuer","wichtig","richtig","falsch"] },
    { id: "tisch", nomen: "Tisch", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "tavolo", itGenus: "m", itBest: "il tavolo", itUnbest: "un tavolo", it: "un tavolo", kategorie: "alltag", level: "A1", rollen: ["haben","kaufen","putzen","aufraeumen","reparieren"], adjektive: ["gross","klein","alt","neu","rund","sauber","schmutzig"] },
    { id: "stuhl", nomen: "Stuhl", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "sedia", itGenus: "f", itBest: "la sedia", itUnbest: "una sedia", it: "una sedia", kategorie: "alltag", level: "A1", rollen: ["haben","kaufen","tragen","reparieren"], adjektive: ["bequem","alt","neu","kaputt","hart","weich"] },
    { id: "bett", nomen: "Bett", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "letto", itGenus: "m", itBest: "il letto", itUnbest: "un letto", it: "un letto", kategorie: "alltag", level: "A1", rollen: ["haben","kaufen","brauchen"], adjektive: ["gross","klein","bequem","weich","hart","neu","alt"] },
    { id: "schrank", nomen: "Schrank", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "armadio", itGenus: "m", itBest: "l'armadio", itUnbest: "un armadio", it: "un armadio", kategorie: "alltag", level: "A2", rollen: ["haben","kaufen","oeffnen","schliessen","aufraeumen"], adjektive: ["gross","klein","alt","neu","voll","leer"] },
    { id: "lampe", nomen: "Lampe", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "lampada", itGenus: "f", itBest: "la lampada", itUnbest: "una lampada", it: "una lampada", kategorie: "alltag", level: "A1", rollen: ["haben","kaufen","reparieren","benutzen"], adjektive: ["hell","dunkel","alt","neu","kaputt","modern"] },
    { id: "fenster", nomen: "Fenster", genus: "n", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "finestra", itGenus: "f", itBest: "la finestra", itUnbest: "una finestra", it: "una finestra", kategorie: "alltag", level: "A1", rollen: ["oeffnen","schliessen","haben","putzen"], adjektive: ["gross","klein","offen","zu","sauber","schmutzig","alt","neu"] },
    { id: "tuer", nomen: "Tür", genus: "f", begleiter: ["bestimmt","unbestimmt","kein"], itNomen: "porta", itGenus: "f", itBest: "la porta", itUnbest: "una porta", it: "una porta", kategorie: "alltag", level: "A1", rollen: ["oeffnen","schliessen","haben"], adjektive: ["offen","zu","gross","klein","alt","neu","kaputt"] },
    { id: "schluessel", nomen: "Schlüssel", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "chiave", itGenus: "f", itBest: "la chiave", itUnbest: "una chiave", it: "una chiave", kategorie: "alltag", level: "A1", rollen: ["haben","suchen","finden","verlieren","geben","bringen"], adjektive: ["klein","wichtig","neu","alt"] },
    { id: "handtuch", nomen: "Handtuch", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "asciugamano", itGenus: "m", itBest: "l'asciugamano", itUnbest: "un asciugamano", it: "un asciugamano", kategorie: "alltag", level: "A2", rollen: ["haben","waschen","brauchen","kaufen"], adjektive: ["sauber","schmutzig","nass","trocken","weich","gross","klein"] },
    { id: "seife", nomen: "Seife", genus: "f", begleiter: ["ohne","bestimmt","kein"], itNomen: "sapone", itGenus: "m", itBest: "il sapone", itOhne: "sapone", it: "sapone", kategorie: "alltag", level: "A2", rollen: ["brauchen","kaufen","benutzen"], adjektive: ["sauber","weich"] },
    { id: "zahnbuerste", nomen: "Zahnbürste", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "spazzolino", itGenus: "m", itBest: "lo spazzolino", itUnbest: "uno spazzolino", it: "uno spazzolino", kategorie: "alltag", level: "A2", rollen: ["haben","kaufen","brauchen","benutzen"], adjektive: ["neu","alt","sauber"] },
    { id: "muell", nomen: "Müll", genus: "m", begleiter: ["ohne","bestimmt","kein"], itNomen: "spazzatura", itGenus: "f", itBest: "la spazzatura", itOhne: "spazzatura", it: "spazzatura", kategorie: "alltag", level: "A2", rollen: ["aufraeumen","tragen","bringen"], adjektive: ["voll","schmutzig"] },
    { id: "blume", nomen: "Blume", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "fiore", itGenus: "m", itBest: "il fiore", itUnbest: "un fiore", it: "un fiore", kategorie: "alltag", level: "A1", rollen: ["kaufen","schenken","geben","haben"], adjektive: ["schoen","bunt","frisch","gross","klein","rot","gelb"] },
    { id: "topf", nomen: "Topf", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "pentola", itGenus: "f", itBest: "la pentola", itUnbest: "una pentola", it: "una pentola", kategorie: "alltag", level: "A2", rollen: ["kochen","haben","kaufen","waschen","benutzen"], adjektive: ["gross","klein","heiss","sauber","schmutzig","alt","neu"] },
    { id: "pfanne", nomen: "Pfanne", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "padella", itGenus: "f", itBest: "la padella", itUnbest: "una padella", it: "una padella", kategorie: "alltag", level: "A2", rollen: ["kochen","haben","waschen","benutzen","kaufen"], adjektive: ["heiss","sauber","schmutzig","gross","klein","neu","alt"] },
    { id: "messer", nomen: "Messer", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "coltello", itGenus: "m", itBest: "il coltello", itUnbest: "un coltello", it: "un coltello", kategorie: "alltag", level: "A1", rollen: ["brauchen","benutzen","haben","waschen"], adjektive: ["scharf","sauber","schmutzig","neu","alt","gross","klein"] },
    { id: "gabel", nomen: "Gabel", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "forchetta", itGenus: "f", itBest: "la forchetta", itUnbest: "una forchetta", it: "una forchetta", kategorie: "alltag", level: "A1", rollen: ["brauchen","benutzen","haben","waschen"], adjektive: ["sauber","schmutzig","klein","gross"] },
    { id: "loeffel", nomen: "Löffel", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "cucchiaio", itGenus: "m", itBest: "il cucchiaio", itUnbest: "un cucchiaio", it: "un cucchiaio", kategorie: "alltag", level: "A1", rollen: ["brauchen","benutzen","haben","waschen"], adjektive: ["sauber","schmutzig","klein","gross"] },
    { id: "teller", nomen: "Teller", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "piatto", itGenus: "m", itBest: "il piatto", itUnbest: "un piatto", it: "un piatto", kategorie: "alltag", level: "A1", rollen: ["brauchen","benutzen","haben","waschen"], adjektive: ["voll","leer","sauber","schmutzig","gross","klein","rund"] },
    { id: "tasse", nomen: "Tasse", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "tazza", itGenus: "f", itBest: "la tazza", itUnbest: "una tazza", it: "una tazza", kategorie: "alltag", level: "A1", rollen: ["haben","benutzen","waschen","kaufen"], adjektive: ["voll","leer","heiss","sauber","schmutzig","klein","gross"] },
    { id: "glas", nomen: "Glas", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "bicchiere", itGenus: "m", itBest: "il bicchiere", itUnbest: "un bicchiere", it: "un bicchiere", kategorie: "alltag", level: "A1", rollen: ["haben","benutzen","waschen","kaufen"], adjektive: ["voll","leer","sauber","kaputt","gross","klein"] },
    { id: "flasche", nomen: "Flasche", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "bottiglia", itGenus: "f", itBest: "la bottiglia", itUnbest: "una bottiglia", it: "una bottiglia", kategorie: "alltag", level: "A1", rollen: ["kaufen","haben","oeffnen","schliessen","tragen","bringen"], adjektive: ["voll","leer","gross","klein","teuer","guenstig"] },
    { id: "korb", nomen: "Korb", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "cesto", itGenus: "m", itBest: "il cesto", itUnbest: "un cesto", it: "un cesto", kategorie: "einkaufen", level: "A2", rollen: ["kaufen","tragen","haben","packen"], adjektive: ["gross","klein","voll","leer"] },
    { id: "geld", nomen: "Geld", genus: "n", begleiter: ["ohne","bestimmt","kein"], itNomen: "denaro", itGenus: "m", itBest: "il denaro", itOhne: "denaro", it: "denaro", kategorie: "einkaufen", level: "A1", rollen: ["haben","brauchen","geben","bezahlen"], adjektive: ["wichtig"] },
    { id: "preis", nomen: "Preis", genus: "m", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "prezzo", itGenus: "m", itBest: "il prezzo", itUnbest: "un prezzo", it: "un prezzo", kategorie: "einkaufen", level: "A1", rollen: ["haben","bezahlen","sehen","finden"], adjektive: ["hoch","niedrig","teuer","guenstig","richtig","falsch"] },
    { id: "quittung", nomen: "Quittung", genus: "f", begleiter: ["unbestimmt","bestimmt","kein"], itNomen: "ricevuta", itGenus: "f", itBest: "la ricevuta", itUnbest: "una ricevuta", it: "una ricevuta", kategorie: "einkaufen", level: "A2", rollen: ["bekommen","geben","brauchen","haben"], adjektive: ["wichtig"] },
    { id: "karte", nomen: "Karte", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "carta", itGenus: "f", itBest: "la carta", itUnbest: "una carta", it: "una carta", kategorie: "einkaufen", level: "A1", rollen: ["haben","bezahlen","benutzen","verlieren","suchen","finden"], adjektive: ["neu","alt","wichtig"] },
    { id: "hemd", nomen: "Hemd", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "camicia", itGenus: "f", itBest: "la camicia", itUnbest: "una camicia", it: "una camicia", kategorie: "alltag", level: "A1", rollen: ["tragen","kaufen","waschen","haben"], adjektive: ["sauber","schmutzig","neu","alt","schoen","bunt","weiss","schwarz","gross","klein"] },
    { id: "hose", nomen: "Hose", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "pantaloni", itGenus: "m", itPlural: true, itBest: "i pantaloni", itUnbest: "un paio di pantaloni", it: "un paio di pantaloni", kategorie: "alltag", level: "A1", rollen: ["tragen","kaufen","waschen","haben"], adjektive: ["neu","alt","sauber","schmutzig","lang","kurz","bequem","schwarz","blau"] },
    { id: "jacke", nomen: "Jacke", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "giacca", itGenus: "f", itBest: "la giacca", itUnbest: "una giacca", it: "una giacca", kategorie: "alltag", level: "A1", rollen: ["tragen","kaufen","haben","brauchen"], adjektive: ["warm","neu","alt","schoen","teuer","guenstig","schwarz","rot","blau"] },
    { id: "schuhe", nomen: "Schuhe", genus: "m", plural: true, begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "scarpe", itGenus: "f", itPlural: true, itBest: "le scarpe", itUnbest: "delle scarpe", it: "delle scarpe", kategorie: "alltag", level: "A1", rollen: ["tragen","kaufen","haben","suchen","finden"], adjektive: ["neu","alt","bequem","schoen","teuer","guenstig","schwarz","gross","klein"] },
    { id: "mantel", nomen: "Mantel", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "cappotto", itGenus: "m", itBest: "il cappotto", itUnbest: "un cappotto", it: "un cappotto", kategorie: "alltag", level: "A2", rollen: ["tragen","kaufen","haben","brauchen"], adjektive: ["warm","lang","kurz","neu","alt","schoen","teuer"] },
    { id: "kleid", nomen: "Kleid", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "vestito", itGenus: "m", itBest: "il vestito", itUnbest: "un vestito", it: "un vestito", kategorie: "alltag", level: "A1", rollen: ["tragen","kaufen","haben"], adjektive: ["schoen","neu","alt","teuer","guenstig","lang","kurz","bunt","rot","schwarz"] },
    { id: "pullover", nomen: "Pullover", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "maglione", itGenus: "m", itBest: "il maglione", itUnbest: "un maglione", it: "un maglione", kategorie: "alltag", level: "A2", rollen: ["tragen","kaufen","haben","brauchen"], adjektive: ["warm","weich","neu","alt","schoen","bunt"] },
    { id: "muetze", nomen: "Mütze", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "berretto", itGenus: "m", itBest: "il berretto", itUnbest: "un berretto", it: "un berretto", kategorie: "alltag", level: "A2", rollen: ["tragen","kaufen","haben"], adjektive: ["warm","neu","alt","bunt","klein"] },
    { id: "schal", nomen: "Schal", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "sciarpa", itGenus: "f", itBest: "la sciarpa", itUnbest: "una sciarpa", it: "una sciarpa", kategorie: "alltag", level: "A2", rollen: ["tragen","kaufen","haben","schenken"], adjektive: ["warm","lang","schoen","bunt","neu","alt"] },
    { id: "handschuhe", nomen: "Handschuhe", genus: "m", plural: true, begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "guanti", itGenus: "m", itPlural: true, itBest: "i guanti", itUnbest: "dei guanti", it: "dei guanti", kategorie: "alltag", level: "A2", rollen: ["tragen","kaufen","haben","brauchen"], adjektive: ["warm","neu","alt","weich"] },
    { id: "aufgabe", nomen: "Aufgabe", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "compito", itGenus: "m", itBest: "il compito", itUnbest: "un compito", it: "un compito", kategorie: "arbeit", level: "A2", rollen: ["machen","verstehen","vergessen","geben","bekommen","erklaeren","ueben"], adjektive: ["schwer","leicht","wichtig","schwierig","einfach","langweilig"] },
    { id: "projekt", nomen: "Projekt", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "progetto", itGenus: "m", itBest: "il progetto", itUnbest: "un progetto", it: "un progetto", kategorie: "arbeit", level: "B1", rollen: ["machen","haben","brauchen","zeigen","erklaeren","finden"], adjektive: ["wichtig","gross","klein","schwierig","spannend","interessant"] },
    { id: "protokoll", nomen: "Protokoll", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "verbale", itGenus: "m", itBest: "il verbale", itUnbest: "un verbale", it: "un verbale", kategorie: "arbeit", level: "B1", rollen: ["schreiben","lesen","brauchen","haben","finden","vergessen"], adjektive: ["wichtig","lang","kurz","genau"] },
    { id: "praesentation", nomen: "Präsentation", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "presentazione", itGenus: "f", itBest: "la presentazione", itUnbest: "una presentazione", it: "una presentazione", kategorie: "arbeit", level: "B1", rollen: ["machen","haben","zeigen","brauchen"], adjektive: ["gut","wichtig","lang","kurz","spannend","langweilig"] },
    { id: "pruefung", nomen: "Prüfung", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "esame", itGenus: "m", itBest: "l'esame", itUnbest: "un esame", it: "un esame", kategorie: "bildung", level: "A2", rollen: ["machen","haben","brauchen","vergessen"], adjektive: ["schwer","schwierig","leicht","einfach","wichtig","lang"] },
    { id: "note", nomen: "Note", genus: "f", begleiter: ["bestimmt","possessiv","unbestimmt","kein"], itNomen: "voto", itGenus: "m", itBest: "il voto", itUnbest: "un voto", it: "un voto", kategorie: "bildung", level: "A2", rollen: ["haben","bekommen","geben","brauchen"], adjektive: ["gut","wichtig"] },
    { id: "heft", nomen: "Heft", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "quaderno", itGenus: "m", itBest: "il quaderno", itUnbest: "un quaderno", it: "un quaderno", kategorie: "bildung", level: "A1", rollen: ["kaufen","haben","brauchen","schreiben","oeffnen","schliessen","tragen","verlieren","finden"], adjektive: ["neu","alt","klein","gross","bunt","sauber"] },
    { id: "stift", nomen: "Stift", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "penna", itGenus: "f", itBest: "la penna", itUnbest: "una penna", it: "una penna", kategorie: "bildung", level: "A1", rollen: ["kaufen","haben","brauchen","benutzen","verlieren","finden","suchen"], adjektive: ["neu","alt","teuer","billig","rot","blau","schwarz"] },
    { id: "tafel", nomen: "Tafel", genus: "f", begleiter: ["bestimmt","unbestimmt","kein"], itNomen: "lavagna", itGenus: "f", itBest: "la lavagna", itUnbest: "una lavagna", it: "una lavagna", kategorie: "bildung", level: "A1", rollen: ["sehen","putzen","schreiben"], adjektive: ["gross","klein","sauber","schmutzig","schwarz","gruen","weiss"] },
    { id: "woerterbuch", nomen: "Wörterbuch", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "dizionario", itGenus: "m", itBest: "il dizionario", itUnbest: "un dizionario", it: "un dizionario", kategorie: "bildung", level: "A2", rollen: ["benutzen","brauchen","haben","kaufen","suchen","finden"], adjektive: ["gross","klein","gut","neu","alt","dick"] },
    { id: "grammatik", nomen: "Grammatik", genus: "f", begleiter: ["bestimmt","ohne","unbestimmt"], itNomen: "grammatica", itGenus: "f", itBest: "la grammatica", itUnbest: "una grammatica", itOhne: "grammatica", it: "grammatica", kategorie: "bildung", level: "A2", rollen: ["lernen","verstehen","erklaeren","ueben","wiederholen"], adjektive: ["schwierig","einfach","wichtig","kompliziert"] },
    { id: "vokabel", nomen: "Vokabel", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "vocabolo", itGenus: "m", itBest: "il vocabolo", itUnbest: "un vocabolo", it: "un vocabolo", kategorie: "bildung", level: "A1", rollen: ["lernen","ueben","wiederholen","vergessen","schreiben","uebersetzen"], adjektive: ["neu","schwierig","einfach","wichtig"] },
    { id: "uebung", nomen: "Übung", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "esercizio", itGenus: "m", itBest: "l'esercizio", itUnbest: "un esercizio", it: "un esercizio", kategorie: "bildung", level: "A1", rollen: ["machen","ueben","wiederholen","verstehen","erklaeren"], adjektive: ["schwer","leicht","einfach","schwierig","lang","kurz"] },
    { id: "computer", nomen: "Computer", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "computer", itGenus: "m", itBest: "il computer", itUnbest: "un computer", it: "un computer", kategorie: "arbeit", level: "A1", rollen: ["haben","kaufen","benutzen","reparieren","brauchen"], adjektive: ["neu","alt","teuer","guenstig","kaputt","modern"] },
    { id: "laptop", nomen: "Laptop", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "portatile", itGenus: "m", itBest: "il portatile", itUnbest: "un portatile", it: "un portatile", kategorie: "arbeit", level: "A1", rollen: ["haben","kaufen","benutzen","reparieren","brauchen","tragen"], adjektive: ["neu","alt","teuer","guenstig","kaputt","leicht","schwer"] },
    { id: "handy", nomen: "Handy", genus: "n", genitiv: "Handys", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "cellulare", itGenus: "m", itBest: "il cellulare", itUnbest: "un cellulare", it: "un cellulare", kategorie: "alltag", level: "A1", rollen: ["haben","kaufen","benutzen","verlieren","finden","reparieren","brauchen"], adjektive: ["neu","alt","teuer","guenstig","kaputt","klein","gross"] },
    { id: "bildschirm", nomen: "Bildschirm", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "schermo", itGenus: "m", itBest: "lo schermo", itUnbest: "uno schermo", it: "uno schermo", kategorie: "arbeit", level: "A2", rollen: ["haben","kaufen","putzen","reparieren","sehen","benutzen"], adjektive: ["gross","klein","neu","alt","hell","dunkel","kaputt"] },
    { id: "drucker", nomen: "Drucker", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "stampante", itGenus: "f", itBest: "la stampante", itUnbest: "una stampante", it: "una stampante", kategorie: "arbeit", level: "A2", rollen: ["haben","kaufen","benutzen","reparieren","brauchen"], adjektive: ["neu","alt","kaputt","teuer","guenstig","laut"] },
    { id: "tastatur", nomen: "Tastatur", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "tastiera", itGenus: "f", itBest: "la tastiera", itUnbest: "una tastiera", it: "una tastiera", kategorie: "arbeit", level: "A2", rollen: ["haben","kaufen","benutzen","reparieren","putzen"], adjektive: ["neu","alt","kaputt","schmutzig","sauber"] },
    { id: "programm", nomen: "Programm", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "programma", itGenus: "m", itBest: "il programma", itUnbest: "un programma", it: "un programma", kategorie: "arbeit", level: "B1", rollen: ["haben","benutzen","oeffnen","schliessen","brauchen"], adjektive: ["neu","alt","gut","kompliziert","einfach","praktisch"] },
    { id: "datei", nomen: "Datei", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "file", itGenus: "m", itBest: "il file", itUnbest: "un file", it: "un file", kategorie: "arbeit", level: "B1", rollen: ["haben","oeffnen","schliessen","suchen","finden","verlieren"], adjektive: ["wichtig","neu","alt","gross","klein"] },
    { id: "ordner", nomen: "Ordner", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "cartella", itGenus: "f", itBest: "la cartella", itUnbest: "una cartella", it: "una cartella", kategorie: "arbeit", level: "A2", rollen: ["haben","oeffnen","schliessen","suchen","finden","aufraeumen"], adjektive: ["neu","alt","voll","leer","wichtig"] },
    { id: "app", nomen: "App", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "app", itGenus: "f", itBest: "l'app", itUnbest: "un'app", it: "un'app", kategorie: "freizeit", level: "A2", rollen: ["haben","benutzen","oeffnen","schliessen","brauchen","finden"], adjektive: ["neu","gut","praktisch","kompliziert","einfach"] },
    { id: "spiel", nomen: "Spiel", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "gioco", itGenus: "m", itBest: "il gioco", itUnbest: "un gioco", it: "un gioco", kategorie: "freizeit", level: "A1", rollen: ["spielen","haben","kaufen","mitbringen","verlieren","finden"], adjektive: ["lustig","spannend","langweilig","neu","alt","einfach","schwierig"] },
    { id: "ball", nomen: "Ball", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "palla", itGenus: "f", itBest: "la palla", itUnbest: "una palla", it: "una palla", kategorie: "freizeit", level: "A1", rollen: ["spielen","haben","kaufen","tragen","verlieren","finden"], adjektive: ["rund","gross","klein","bunt","neu","alt"] },
    { id: "fahrrad", nomen: "Fahrrad", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "bicicletta", itGenus: "f", itBest: "la bicicletta", itUnbest: "una bicicletta", it: "una bicicletta", kategorie: "freizeit", level: "A1", rollen: ["haben","kaufen","reparieren","verlieren","finden","brauchen"], adjektive: ["neu","alt","kaputt","teuer","guenstig","praktisch"] },
    { id: "roman", nomen: "Roman", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "romanzo", itGenus: "m", itBest: "il romanzo", itUnbest: "un romanzo", it: "un romanzo", kategorie: "freizeit", level: "B1", rollen: ["lesen","kaufen","schreiben","haben","finden","mitbringen"], adjektive: ["spannend","langweilig","gut","lang","kurz","interessant","traurig","lustig"] },
    { id: "gedicht", nomen: "Gedicht", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "poesia", itGenus: "f", itBest: "la poesia", itUnbest: "una poesia", it: "una poesia", kategorie: "bildung", level: "B1", rollen: ["lesen","schreiben","lernen","uebersetzen","wiederholen"], adjektive: ["schoen","kurz","lang","traurig","lustig"] },
    { id: "lied", nomen: "Lied", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "canzone", itGenus: "f", itBest: "la canzone", itUnbest: "una canzone", it: "una canzone", kategorie: "freizeit", level: "A2", rollen: ["hoeren","lernen","schreiben","mitbringen"], adjektive: ["schoen","traurig","lustig","neu","alt","laut","leise"] },
    { id: "zeitschrift", nomen: "Zeitschrift", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "rivista", itGenus: "f", itBest: "la rivista", itUnbest: "una rivista", it: "una rivista", kategorie: "freizeit", level: "A2", rollen: ["lesen","kaufen","mitbringen","finden","verlieren"], adjektive: ["neu","alt","interessant","langweilig"] },
    { id: "konzertkarte", nomen: "Konzertkarte", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "biglietto", itGenus: "m", itBest: "il biglietto", itUnbest: "un biglietto", it: "un biglietto", kategorie: "freizeit", level: "B1", rollen: ["kaufen","haben","brauchen","verlieren","finden","mitbringen"], adjektive: ["teuer","guenstig","wichtig"] },
    { id: "koffer", nomen: "Koffer", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "valigia", itGenus: "f", itBest: "la valigia", itUnbest: "una valigia", it: "una valigia", kategorie: "reisen", level: "A2", rollen: ["packen","haben","tragen","kaufen","oeffnen","schliessen","verlieren","finden"], adjektive: ["gross","klein","schwer","leicht","voll","leer","neu","alt"] },
    { id: "rucksack", nomen: "Rucksack", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "zaino", itGenus: "m", itBest: "lo zaino", itUnbest: "uno zaino", it: "uno zaino", kategorie: "reisen", level: "A1", rollen: ["packen","haben","tragen","kaufen","oeffnen","schliessen"], adjektive: ["gross","klein","schwer","leicht","voll","leer","praktisch","bequem"] },
    { id: "regenschirm", nomen: "Regenschirm", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "ombrello", itGenus: "m", itBest: "l'ombrello", itUnbest: "un ombrello", it: "un ombrello", kategorie: "alltag", level: "A2", rollen: ["haben","kaufen","brauchen","mitbringen","oeffnen","schliessen","verlieren","finden"], adjektive: ["neu","alt","gross","klein","kaputt"] },
    { id: "pass", nomen: "Pass", genus: "m", begleiter: ["possessiv","bestimmt","unbestimmt","kein"], itNomen: "passaporto", itGenus: "m", itBest: "il passaporto", itUnbest: "un passaporto", it: "un passaporto", kategorie: "reisen", level: "A2", rollen: ["haben","brauchen","zeigen","verlieren","finden","mitbringen","bekommen"], adjektive: ["wichtig","neu","alt"] },
    { id: "visum", nomen: "Visum", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "visto", itGenus: "m", itBest: "il visto", itUnbest: "un visto", it: "un visto", kategorie: "verwaltung", level: "B1", rollen: ["brauchen","haben","bekommen"], adjektive: ["wichtig","neu"] },
    { id: "bus", nomen: "Bus", genus: "m", begleiter: ["bestimmt","unbestimmt","kein"], itNomen: "autobus", itGenus: "m", itBest: "l'autobus", itUnbest: "un autobus", it: "un autobus", kategorie: "reisen", level: "A1", rollen: ["nehmen","sehen","suchen","finden"], adjektive: ["voll","leer","laut","neu","alt"] },
    { id: "fahrkarte", nomen: "Fahrkarte", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "biglietto", itGenus: "m", itBest: "il biglietto", itUnbest: "un biglietto", it: "un biglietto", kategorie: "reisen", level: "A1", rollen: ["kaufen","haben","brauchen","zeigen","verlieren","finden","bezahlen"], adjektive: ["teuer","guenstig","wichtig","neu"] },
    { id: "urlaub", nomen: "Urlaub", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "vacanza", itGenus: "f", itBest: "la vacanza", itUnbest: "una vacanza", it: "una vacanza", kategorie: "reisen", level: "A2", rollen: ["haben","brauchen","buchen"], adjektive: ["lang","kurz","schoen","teuer","guenstig","wichtig"] },
    { id: "wetter", nomen: "Wetter", genus: "n", begleiter: ["bestimmt","ohne"], itNomen: "tempo", itGenus: "m", itBest: "il tempo", itOhne: "tempo", it: "tempo", kategorie: "alltag", level: "A1", rollen: ["haben"], adjektive: ["gut","warm","kalt","schoen","nass","trocken"] },
    { id: "rezept", nomen: "Rezept", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "ricetta", itGenus: "f", itBest: "la ricetta", itUnbest: "una ricetta", it: "una ricetta", kategorie: "gesundheit", level: "B1", rollen: ["brauchen","haben","bekommen","geben","zeigen"], adjektive: ["wichtig","neu"] },
    { id: "medikament", nomen: "Medikament", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "farmaco", itGenus: "m", itBest: "il farmaco", itUnbest: "un farmaco", it: "un farmaco", kategorie: "gesundheit", level: "B1", rollen: ["nehmen","brauchen","haben","kaufen","bekommen","vergessen"], adjektive: ["wichtig","stark","teuer","guenstig"] },
    { id: "tablette", nomen: "Tablette", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "pastiglia", itGenus: "f", itBest: "la pastiglia", itUnbest: "una pastiglia", it: "una pastiglia", kategorie: "gesundheit", level: "B1", rollen: ["nehmen","brauchen","haben","vergessen"], adjektive: ["klein","gross","bitter","wichtig"] },
    { id: "verband", nomen: "Verband", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "benda", itGenus: "f", itBest: "la benda", itUnbest: "una benda", it: "una benda", kategorie: "gesundheit", level: "B1", rollen: ["brauchen","haben","tragen"], adjektive: ["sauber","schmutzig","neu"] },
    { id: "impfung", nomen: "Impfung", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "vaccinazione", itGenus: "f", itBest: "la vaccinazione", itUnbest: "una vaccinazione", it: "una vaccinazione", kategorie: "gesundheit", level: "B1", rollen: ["brauchen","haben","bekommen","machen"], adjektive: ["wichtig","neu"] },
    { id: "krankheit", nomen: "Krankheit", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "malattia", itGenus: "f", itBest: "la malattia", itUnbest: "una malattia", it: "una malattia", kategorie: "gesundheit", level: "A2", rollen: ["haben","bekommen"], adjektive: ["schwer","leicht","wichtig"] },
    { id: "ausweis", nomen: "Ausweis", genus: "m", begleiter: ["bestimmt","possessiv","unbestimmt","kein"], itNomen: "carta d'identità", itGenus: "f", itBest: "la carta d'identità", itUnbest: "una carta d'identità", it: "una carta d'identità", kategorie: "verwaltung", level: "A2", rollen: ["haben","brauchen","zeigen","verlieren","finden","mitbringen"], adjektive: ["wichtig","neu","alt"] },
    { id: "formular", nomen: "Formular", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "modulo", itGenus: "m", itBest: "il modulo", itUnbest: "un modulo", it: "un modulo", kategorie: "verwaltung", level: "B1", rollen: ["schreiben","haben","brauchen","bekommen","geben"], adjektive: ["wichtig","kompliziert","einfach","lang","kurz"] },
    { id: "anmeldung", nomen: "Anmeldung", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "iscrizione", itGenus: "f", itBest: "l'iscrizione", itUnbest: "un'iscrizione", it: "un'iscrizione", kategorie: "verwaltung", level: "B1", rollen: ["machen","brauchen","haben","bekommen"], adjektive: ["wichtig","kompliziert","einfach"] },
    { id: "kuendigung", nomen: "Kündigung", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "disdetta", itGenus: "f", itBest: "la disdetta", itUnbest: "una disdetta", it: "una disdetta", kategorie: "verwaltung", level: "B1", rollen: ["schreiben","haben","bekommen","geben","brauchen"], adjektive: ["wichtig","schwierig"] },
    { id: "versicherung", nomen: "Versicherung", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "assicurazione", itGenus: "f", itBest: "l'assicurazione", itUnbest: "un'assicurazione", it: "un'assicurazione", kategorie: "verwaltung", level: "B1", rollen: ["haben","brauchen","bezahlen","bekommen"], adjektive: ["wichtig","teuer","guenstig"] },
    { id: "steuer", nomen: "Steuer", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "tassa", itGenus: "f", itBest: "la tassa", itUnbest: "una tassa", it: "una tassa", kategorie: "verwaltung", level: "B1", rollen: ["bezahlen","haben","brauchen"], adjektive: ["hoch","niedrig","wichtig"] },
    { id: "wohnung", nomen: "Wohnung", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "appartamento", itGenus: "m", itBest: "l'appartamento", itUnbest: "un appartamento", it: "un appartamento", kategorie: "alltag", level: "A2", rollen: ["haben","suchen","finden","putzen","aufraeumen"], adjektive: ["gross","klein","gemuetlich","teuer","guenstig","hell","dunkel","sauber"] },
    { id: "miete", nomen: "Miete", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "affitto", itGenus: "m", itBest: "l'affitto", itUnbest: "un affitto", it: "un affitto", kategorie: "verwaltung", level: "B1", rollen: ["bezahlen","haben","brauchen"], adjektive: ["hoch","niedrig","teuer","guenstig"] },
    { id: "idee", nomen: "Idee", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "idea", itGenus: "f", itBest: "l'idea", itUnbest: "un'idea", it: "un'idea", kategorie: "alltag", level: "A2", rollen: ["haben","geben","finden","vergessen"], adjektive: ["gut","neu","wichtig","interessant"] },
    { id: "frage", nomen: "Frage", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "domanda", itGenus: "f", itBest: "la domanda", itUnbest: "una domanda", it: "una domanda", kategorie: "bildung", level: "A1", rollen: ["haben","verstehen","vergessen"], adjektive: ["wichtig","schwierig","einfach","gut"] },
    { id: "antwort", nomen: "Antwort", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "risposta", itGenus: "f", itBest: "la risposta", itUnbest: "una risposta", it: "una risposta", kategorie: "bildung", level: "A1", rollen: ["haben","geben","brauchen","finden","vergessen"], adjektive: ["richtig","falsch","wichtig","kurz","lang"] },
    { id: "problem", nomen: "Problem", genus: "n", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "problema", itGenus: "m", itBest: "il problema", itUnbest: "un problema", it: "un problema", kategorie: "alltag", level: "A2", rollen: ["haben","verstehen","finden","vergessen"], adjektive: ["gross","klein","wichtig","schwierig","kompliziert"] },
    { id: "loesung", nomen: "Lösung", genus: "f", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "soluzione", itGenus: "f", itBest: "la soluzione", itUnbest: "una soluzione", it: "una soluzione", kategorie: "alltag", level: "B1", rollen: ["haben","finden","brauchen","zeigen","erklaeren"], adjektive: ["gut","einfach","kompliziert","wichtig"] },
    { id: "fehler", nomen: "Fehler", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "errore", itGenus: "m", itBest: "l'errore", itUnbest: "un errore", it: "un errore", kategorie: "bildung", level: "A2", rollen: ["haben","machen","finden","verstehen","erklaeren"], adjektive: ["klein","gross","wichtig"] },
    { id: "regel", nomen: "Regel", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "regola", itGenus: "f", itBest: "la regola", itUnbest: "una regola", it: "una regola", kategorie: "bildung", level: "A2", rollen: ["haben","verstehen","erklaeren","lernen","wiederholen"], adjektive: ["wichtig","einfach","kompliziert","streng"] },
    { id: "plan", nomen: "Plan", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "piano", itGenus: "m", itBest: "il piano", itUnbest: "un piano", it: "un piano", kategorie: "alltag", level: "B1", rollen: ["haben","machen","brauchen"], adjektive: ["gut","wichtig","genau"] },
    { id: "meinung", nomen: "Meinung", genus: "f", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "opinione", itGenus: "f", itBest: "l'opinione", itUnbest: "un'opinione", it: "un'opinione", kategorie: "alltag", level: "B1", rollen: ["haben","geben","zeigen"], adjektive: ["wichtig","gut"] },
    { id: "grund", nomen: "Grund", genus: "m", begleiter: ["bestimmt","unbestimmt","possessiv","kein"], itNomen: "motivo", itGenus: "m", itBest: "il motivo", itUnbest: "un motivo", it: "un motivo", kategorie: "alltag", level: "B1", rollen: ["haben","geben","verstehen","finden"], adjektive: ["gut","wichtig","einfach"] },
    { id: "wunsch", nomen: "Wunsch", genus: "m", begleiter: ["unbestimmt","bestimmt","possessiv","kein"], itNomen: "desiderio", itGenus: "m", itBest: "il desiderio", itUnbest: "un desiderio", it: "un desiderio", kategorie: "alltag", level: "B1", rollen: ["haben"], adjektive: ["gross","klein","wichtig","schoen"] },
  ];
  const BEGLEITER_NAMEN = {
    unbestimmt: { de: "ein / eine", hinweis: "wenn es zum ersten Mal vorkommt — so redet man normalerweise" },
    bestimmt: { de: "der / die / das", hinweis: "wenn ein bestimmtes gemeint ist, das beide kennen" },
    ohne: { de: "ohne Begleiter", hinweis: "bei Stoffen, Sprachen und festen Wendungen" },
    possessiv: { de: "mein / dein", hinweis: "wenn es jemandem gehört" },
    kein: { de: "kein / keine", hinweis: "die Verneinung" },
  };
  /* Die vollständige italienische Nominalgruppe: Begleiter + Adjektiv +
     Substantiv, in der richtigen Reihenfolge und mit dem Artikel, der
     zum jeweils folgenden Wort passt.
       ohne Adjektiv:  l'e-mail
       mit Adjektiv:   la lunga e-mail
       nachgestellt:   un libro interessante
       Verkürzung:     un buon libro, un bel film            */
  function itDingform(ding, begleiter, adjektiv, subjekt) {
    if (!ding) return "";
    const genus = ding.itGenus || ding.genus || "m";
    const plural = ding.itPlural !== undefined ? ding.itPlural : Boolean(ding.plural);
    const nomen = itNomenVon(ding);

    /* Feste Wendungen („a calcio“, „a carte“, „a letto“) tragen ihre
       eigene Präposition und werden nicht auseinandergenommen. */
    if (ding.itFest) return ding.itFest;

    // Kein Adjektiv: die eingetragene Form ist die beste Form.
    if (!adjektiv) {
      if (begleiter === "bestimmt" && ding.itBest) return ding.itBest;
      if (begleiter === "unbestimmt" && ding.itUnbest) return ding.itUnbest;
      if (begleiter === "ohne" && ding.itOhne) return ding.itOhne;
      if (begleiter === "kein") {
        // „delle scarpe“ wird unter der Verneinung zu „scarpe“.
        const unbest = ding.itUnbest && !/^(dei |degli |delle )/.test(ding.itUnbest) ? ding.itUnbest : null;
        return ding.itOhne || unbest || nomen;
      }
      if (begleiter === "possessiv") return itPossessivform(ding, subjekt, nomen, genus, plural, "");
      return ding.it || nomen;
    }

    // Mit Adjektiv: Stellung entscheiden, dann den Artikel danach richten.
    const davor = itAdjektivDavor(adjektiv);
    const adjNach = itAdjektiv(adjektiv, genus, plural);
    const adjVor = davor ? itAdjektivVorForm(adjektiv, genus, plural, nomen) : "";
    const ersteswort = davor ? adjVor : nomen;
    const kern = davor
      ? adjVor + (adjVor.endsWith("'") ? "" : " ") + nomen
      : nomen + " " + adjNach;

    if (begleiter === "ohne") return kern;
    if (begleiter === "kein") return (ding.itOhne || plural) ? kern : itArtikel("unbestimmt", genus, plural, ersteswort) + kern;
    if (begleiter === "possessiv") return itPossessivform(ding, subjekt, kern, genus, plural, ersteswort);
    const typ = begleiter === "bestimmt" ? "bestimmt" : "unbestimmt";
    return itArtikel(typ, genus, plural, ersteswort) + kern;
  }

  /* Die italienische Personenangabe. Bisher stand dort immer „mio“ —
     „ihre Kinder“ wurde zu „i miei bambini“. Jetzt richtet sich das
     Possessivpronomen nach dem Subjekt, und Verwandte im Singular stehen
     wie im Italienischen üblich ohne Artikel: mio fratello, aber
     il mio amico und i miei fratelli. */
  function itPersonform(person, subjekt, feld) {
    if (!person) return "";
    if (!person.itNomen) return person[feld] || person.it;
    const praep = feld === "itMit" ? "con " : feld === "itAn" ? "a " : "";
    const genus = person.itGenus || "m";
    const plural = Boolean(person.itPlural);
    if (person.itModus === "ohne") {
      return praep + itArtikel("bestimmt", genus, plural, person.itNomen) + person.itNomen;
    }
    const tafel = IT_POSSESSIV[(subjekt && subjekt.id) || "1sg"] || IT_POSSESSIV["1sg"];
    const poss = plural ? (genus === "f" ? tafel.fp : tafel.mp) : (genus === "f" ? tafel.f : tafel.m);
    // „loro“ steht immer mit Artikel, auch bei Verwandten.
    const ohneArtikel = person.itModus === "verwandt" && !plural && poss !== "loro";
    const artikel = ohneArtikel ? "" : itArtikel("bestimmt", genus, plural, poss);
    return praep + artikel + poss + " " + person.itNomen;
  }

  function itPossessivform(ding, subjekt, kern, genus, plural, ersteswort) {
    const tafel = IT_POSSESSIV[(subjekt && subjekt.id) || "1sg"] || IT_POSSESSIV["1sg"];
    const poss = plural ? (genus === "f" ? tafel.fp : tafel.mp) : (genus === "f" ? tafel.f : tafel.m);
    const artikel = itArtikel("bestimmt", genus, plural, poss);
    return artikel + poss + " " + kern;
  }

  const PERSONEN = [
    { id: "freund", nomen: "Freund", genus: "m", itNomen: "amico", itGenus: "m", itModus: "poss", it: "il mio amico", itMit: "con il mio amico", itAn: "al mio amico", kategorie: "familie", level: "A1", adjektive: ["gut", "alt", "neu", "nett"] },
    { id: "freundin", nomen: "Freundin", genus: "f", itNomen: "amica", itGenus: "f", itModus: "poss", it: "la mia amica", itMit: "con la mia amica", itAn: "alla mia amica", kategorie: "familie", level: "A1", adjektive: ["gut", "alt", "neu", "nett"] },
    { id: "eltern", nomen: "Eltern", genus: "f", plural: true, itNomen: "genitori", itGenus: "m", itPlural: true, itModus: "poss", it: "i miei genitori", itMit: "con i miei genitori", itAn: "ai miei genitori", kategorie: "familie", level: "A1", adjektive: ["nett"] },
    { id: "bruder", nomen: "Bruder", genus: "m", itNomen: "fratello", itGenus: "m", itModus: "verwandt", it: "mio fratello", itMit: "con mio fratello", itAn: "a mio fratello", kategorie: "familie", level: "A1", adjektive: ["gross", "klein", "nett"] },
    { id: "schwester", nomen: "Schwester", genus: "f", itNomen: "sorella", itGenus: "f", itModus: "verwandt", it: "mia sorella", itMit: "con mia sorella", itAn: "a mia sorella", kategorie: "familie", level: "A1", adjektive: ["gross", "klein", "nett"] },
    { id: "kollege", nomen: "Kollege", genus: "m", schwach: true, itNomen: "collega", itGenus: "m", itModus: "poss", it: "il mio collega", itMit: "con il mio collega", itAn: "al mio collega", kategorie: "arbeit", level: "A2", adjektive: ["neu", "nett", "gut"] },
    { id: "nachbar", nomen: "Nachbar", genus: "m", schwach: true, itNomen: "vicino", itGenus: "m", itModus: "poss", it: "il mio vicino", itMit: "con il mio vicino", itAn: "al mio vicino", kategorie: "alltag", level: "A2", adjektive: ["neu", "nett", "alt"] },
    { id: "chef", nomen: "Chef", genus: "m", itNomen: "capo", itGenus: "m", itModus: "poss", it: "il mio capo", itMit: "con il mio capo", itAn: "al mio capo", kategorie: "arbeit", level: "A2", adjektive: ["neu", "nett", "streng"] },
    { id: "lehrerin", nomen: "Lehrerin", genus: "f", itNomen: "insegnante", itGenus: "f", itModus: "poss", it: "la mia insegnante", itMit: "con la mia insegnante", itAn: "alla mia insegnante", kategorie: "bildung", level: "A1", adjektive: ["neu", "nett", "streng", "gut"] },
    { id: "kind", nomen: "Kind", genus: "n", begleiter: "bestimmt", itNomen: "bambino", itGenus: "m", itModus: "ohne", begleiter: "bestimmt", it: "il bambino", itMit: "con il bambino", itAn: "al bambino", kategorie: "familie", level: "A1", adjektive: ["klein", "gross", "nett"] },

    /* --- neu aufgenommen --- */
    { id: "onkel", nomen: "Onkel", genus: "m", itNomen: "zio", itGenus: "m", itModus: "verwandt", it: "mio zio", itMit: "con mio zio", itAn: "a mio zio", kategorie: "familie", level: "A1", adjektive: ["nett","alt","lustig"] },
    { id: "tante", nomen: "Tante", genus: "f", itNomen: "zia", itGenus: "f", itModus: "verwandt", it: "mia zia", itMit: "con mia zia", itAn: "a mia zia", kategorie: "familie", level: "A1", adjektive: ["nett","alt","freundlich"] },
    { id: "oma", nomen: "Oma", genus: "f", itNomen: "nonna", itGenus: "f", itModus: "verwandt", it: "mia nonna", itMit: "con mia nonna", itAn: "a mia nonna", kategorie: "familie", level: "A1", adjektive: ["alt","nett","freundlich"] },
    { id: "opa", nomen: "Opa", genus: "m", itNomen: "nonno", itGenus: "m", itModus: "verwandt", it: "mio nonno", itMit: "con mio nonno", itAn: "a mio nonno", kategorie: "familie", level: "A1", adjektive: ["alt","nett","lustig"] },
    { id: "cousin", nomen: "Cousin", genus: "m", itNomen: "cugino", itGenus: "m", itModus: "verwandt", it: "mio cugino", itMit: "con mio cugino", itAn: "a mio cugino", kategorie: "familie", level: "A2", adjektive: ["jung","nett","lustig"] },
    { id: "cousine", nomen: "Cousine", genus: "f", itNomen: "cugina", itGenus: "f", itModus: "verwandt", it: "mia cugina", itMit: "con mia cugina", itAn: "a mia cugina", kategorie: "familie", level: "A2", adjektive: ["jung","nett","lustig"] },
    { id: "sohn", nomen: "Sohn", genus: "m", itNomen: "figlio", itGenus: "m", itModus: "verwandt", it: "mio figlio", itMit: "con mio figlio", itAn: "a mio figlio", kategorie: "familie", level: "A1", adjektive: ["klein","gross","nett"] },
    { id: "tochter", nomen: "Tochter", genus: "f", itNomen: "figlia", itGenus: "f", itModus: "verwandt", it: "mia figlia", itMit: "con mia figlia", itAn: "a mia figlia", kategorie: "familie", level: "A1", adjektive: ["klein","gross","nett"] },
    { id: "mann", nomen: "Mann", genus: "m", itNomen: "marito", itGenus: "m", itModus: "verwandt", it: "mio marito", itMit: "con mio marito", itAn: "a mio marito", kategorie: "familie", level: "A1", adjektive: ["nett","gross","freundlich"] },
    { id: "frau", nomen: "Frau", genus: "f", itNomen: "moglie", itGenus: "f", itModus: "verwandt", it: "mia moglie", itMit: "con mia moglie", itAn: "a mia moglie", kategorie: "familie", level: "A1", adjektive: ["nett","freundlich","gross"] },
    { id: "grosseltern", nomen: "Großeltern", genus: "f", plural: true, itNomen: "nonni", itGenus: "m", itPlural: true, itModus: "poss", it: "i miei nonni", itMit: "con i miei nonni", itAn: "ai miei nonni", kategorie: "familie", level: "A2", adjektive: ["alt","nett"] },
    { id: "kinder", nomen: "Kinder", genus: "f", plural: true, itNomen: "bambini", itGenus: "m", itPlural: true, itModus: "poss", it: "i bambini", itMit: "con i bambini", itAn: "ai bambini", kategorie: "familie", level: "A1", adjektive: ["klein","nett","lustig"] },
    { id: "freunde", nomen: "Freunde", genus: "f", plural: true, itNomen: "amici", itGenus: "m", itPlural: true, itModus: "poss", it: "i miei amici", itMit: "con i miei amici", itAn: "ai miei amici", kategorie: "familie", level: "A1", adjektive: ["gut","nett","lustig"] },
    { id: "kollegen", nomen: "Kollegen", genus: "f", plural: true, itNomen: "colleghi", itGenus: "m", itPlural: true, itModus: "poss", it: "i miei colleghi", itMit: "con i miei colleghi", itAn: "ai miei colleghi", kategorie: "arbeit", level: "A2", adjektive: ["nett","gut","neu"] },
    { id: "arzt", nomen: "Arzt", genus: "m", begleiter: "bestimmt", itNomen: "medico", itGenus: "m", itModus: "ohne", it: "il medico", itMit: "con il medico", itAn: "al medico", kategorie: "gesundheit", level: "A1", adjektive: ["nett","jung","freundlich"] },
    { id: "verkaeufer", nomen: "Verkäufer", genus: "m", begleiter: "bestimmt", itNomen: "commesso", itGenus: "m", itModus: "ohne", begleiter: "bestimmt", it: "il commesso", itMit: "con il commesso", itAn: "al commesso", kategorie: "einkaufen", level: "A2", adjektive: ["nett","freundlich","jung"] },
    { id: "kellner", nomen: "Kellner", genus: "m", begleiter: "bestimmt", itNomen: "cameriere", itGenus: "m", itModus: "ohne", begleiter: "bestimmt", it: "il cameriere", itMit: "con il cameriere", itAn: "al cameriere", kategorie: "essen", level: "A2", adjektive: ["nett","freundlich","jung"] },
    { id: "nachbarin", nomen: "Nachbarin", genus: "f", itNomen: "vicina", itGenus: "f", itModus: "poss", it: "la mia vicina", itMit: "con la mia vicina", itAn: "alla mia vicina", kategorie: "alltag", level: "A2", adjektive: ["neu","nett","alt"] },
    { id: "lehrer", nomen: "Lehrer", genus: "m", itNomen: "insegnante", itGenus: "m", itModus: "poss", it: "il mio insegnante", itMit: "con il mio insegnante", itAn: "al mio insegnante", kategorie: "bildung", level: "A1", adjektive: ["neu","nett","streng","gut"] },
    { id: "vermieter", nomen: "Vermieter", genus: "m", itNomen: "padrone di casa", itGenus: "m", itModus: "poss", it: "il mio padrone di casa", itMit: "con il mio padrone di casa", itAn: "al mio padrone di casa", kategorie: "alltag", level: "B1", adjektive: ["streng","nett","alt"] },
  ];

  /* Adjektive. „stamm“ ist die Form ohne Endung — daran hängt die
     Deklination. „praedikativ“ heißt: das Wort kann auch hinter „sein“
     stehen („das Brot ist frisch“). */
  const ADJEKTIVE = [
    { id: "gut", stamm: "gut", de: "gut", it: "buono", praedikativ: true, level: "A1" },
    { id: "neu", stamm: "neu", de: "neu", it: "nuovo", praedikativ: true, level: "A1" },
    { id: "alt", stamm: "alt", de: "alt", it: "vecchio", praedikativ: true, level: "A1" },
    { id: "gross", stamm: "groß", de: "groß", it: "grande", praedikativ: true, level: "A1" },
    { id: "klein", stamm: "klein", de: "klein", it: "piccolo", praedikativ: true, level: "A1" },
    { id: "warm", stamm: "warm", de: "warm", it: "caldo", praedikativ: true, level: "A1" },
    { id: "kalt", stamm: "kalt", de: "kalt", it: "freddo", praedikativ: true, level: "A1" },
    { id: "heiss", stamm: "heiß", de: "heiß", it: "bollente", praedikativ: true, level: "A2" },
    { id: "frisch", stamm: "frisch", de: "frisch", it: "fresco", praedikativ: true, level: "A2" },
    { id: "lecker", stamm: "lecker", de: "lecker", it: "buono", praedikativ: true, level: "A1" },
    { id: "teuer", stamm: "teur", de: "teuer", it: "caro", praedikativ: true, level: "A1", praedikativForm: "teuer" },
    { id: "billig", stamm: "billig", de: "billig", it: "economico", praedikativ: true, level: "A1" },
    { id: "lang", stamm: "lang", de: "lang", it: "lungo", praedikativ: true, level: "A1" },
    { id: "kurz", stamm: "kurz", de: "kurz", it: "corto", praedikativ: true, level: "A1" },
    { id: "schoen", stamm: "schön", de: "schön", it: "bello", praedikativ: true, level: "A1" },
    { id: "spannend", stamm: "spannend", de: "spannend", it: "avvincente", praedikativ: true, level: "B1" },
    { id: "langweilig", stamm: "langweilig", de: "langweilig", it: "noioso", praedikativ: true, level: "A2" },
    { id: "wichtig", stamm: "wichtig", de: "wichtig", it: "importante", praedikativ: true, level: "A2" },
    { id: "schwierig", stamm: "schwierig", de: "schwierig", it: "difficile", praedikativ: true, level: "A2" },
    { id: "laut", stamm: "laut", de: "laut", it: "forte", praedikativ: true, level: "A1" },
    { id: "leise", stamm: "leis", de: "leise", it: "silenzioso", praedikativ: true, level: "A2", praedikativForm: "leise" },
    { id: "sauber", stamm: "sauber", de: "sauber", it: "pulito", praedikativ: true, level: "A2", praedikativForm: "sauber" },
    { id: "schmutzig", stamm: "schmutzig", de: "schmutzig", it: "sporco", praedikativ: true, level: "A2" },
    { id: "nass", stamm: "nass", de: "nass", it: "bagnato", praedikativ: true, level: "A2" },
    { id: "trocken", stamm: "trocken", de: "trocken", it: "asciutto", praedikativ: true, level: "A2" },
    { id: "nett", stamm: "nett", de: "nett", it: "gentile", praedikativ: true, level: "A1" },
    { id: "streng", stamm: "streng", de: "streng", it: "severo", praedikativ: true, level: "B1" },
    { id: "stark", stamm: "stark", de: "stark", it: "forte", praedikativ: true, level: "A2" },
    { id: "dick", stamm: "dick", de: "dick", it: "grosso", praedikativ: true, level: "A2" },
    { id: "genau", stamm: "genau", de: "genau", it: "preciso", praedikativ: true, level: "B1" },

    /* --- neu aufgenommen --- */
    { id: "leicht", stamm: "leicht", de: "leicht", it: "leggero", praedikativ: true, level: "A2" },
    { id: "schwer", stamm: "schwer", de: "schwer", it: "pesante", praedikativ: true, level: "A2" },
    { id: "weich", stamm: "weich", de: "weich", it: "morbido", praedikativ: true, level: "A2" },
    { id: "hart", stamm: "hart", de: "hart", it: "duro", praedikativ: true, level: "A2" },
    { id: "hell", stamm: "hell", de: "hell", it: "chiaro", praedikativ: true, level: "A2" },
    { id: "dunkel", stamm: "dunkl", de: "dunkel", it: "scuro", praedikativ: true, praedikativForm: "dunkel", level: "A2" },
    { id: "voll", stamm: "voll", de: "voll", it: "pieno", praedikativ: true, level: "A2" },
    { id: "leer", stamm: "leer", de: "leer", it: "vuoto", praedikativ: true, level: "A2" },
    { id: "offen", stamm: "offen", de: "offen", it: "aperto", praedikativ: true, level: "A2" },
    { id: "zu", stamm: "geschlossen", de: "zu", it: "chiuso", praedikativ: true, praedikativForm: "zu", level: "A2" },
    { id: "richtig", stamm: "richtig", de: "richtig", it: "giusto", praedikativ: true, level: "A2" },
    { id: "falsch", stamm: "falsch", de: "falsch", it: "sbagliato", praedikativ: true, level: "A2" },
    { id: "einfach", stamm: "einfach", de: "einfach", it: "semplice", praedikativ: true, level: "A2" },
    { id: "kompliziert", stamm: "kompliziert", de: "kompliziert", it: "complicato", praedikativ: true, level: "A2" },
    { id: "praktisch", stamm: "praktisch", de: "praktisch", it: "pratico", praedikativ: true, level: "A2" },
    { id: "bequem", stamm: "bequem", de: "bequem", it: "comodo", praedikativ: true, level: "A2" },
    { id: "modern", stamm: "modern", de: "modern", it: "moderno", praedikativ: true, level: "A2" },
    { id: "altmodisch", stamm: "altmodisch", de: "altmodisch", it: "antiquato", praedikativ: true, level: "A2" },
    { id: "suess", stamm: "süß", de: "süß", it: "dolce", praedikativ: true, level: "A2" },
    { id: "salzig", stamm: "salzig", de: "salzig", it: "salato", praedikativ: true, level: "A2" },
    { id: "bitter", stamm: "bitter", de: "bitter", it: "amaro", praedikativ: true, level: "A2" },
    { id: "scharf", stamm: "scharf", de: "scharf", it: "piccante", praedikativ: true, level: "A2" },
    { id: "gesund", stamm: "gesund", de: "gesund", it: "sano", praedikativ: true, level: "A2" },
    { id: "ungesund", stamm: "ungesund", de: "ungesund", it: "malsano", praedikativ: true, level: "A2" },
    { id: "ruhig", stamm: "ruhig", de: "ruhig", it: "tranquillo", praedikativ: true, level: "A2" },
    { id: "gemuetlich", stamm: "gemütlich", de: "gemütlich", it: "accogliente", praedikativ: true, level: "A2" },
    { id: "hoch", stamm: "hoh", de: "hoch", it: "alto", praedikativ: true, praedikativForm: "hoch", level: "A2" },
    { id: "niedrig", stamm: "niedrig", de: "niedrig", it: "basso", praedikativ: true, level: "A2" },
    { id: "breit", stamm: "breit", de: "breit", it: "largo", praedikativ: true, level: "A2" },
    { id: "schmal", stamm: "schmal", de: "schmal", it: "stretto", praedikativ: true, level: "A2" },
    { id: "rund", stamm: "rund", de: "rund", it: "rotondo", praedikativ: true, level: "A2" },
    { id: "bunt", stamm: "bunt", de: "bunt", it: "colorato", praedikativ: true, level: "A2" },
    { id: "weiss", stamm: "weiß", de: "weiß", it: "bianco", praedikativ: true, level: "A2" },
    { id: "schwarz", stamm: "schwarz", de: "schwarz", it: "nero", praedikativ: true, level: "A2" },
    { id: "rot", stamm: "rot", de: "rot", it: "rosso", praedikativ: true, level: "A2" },
    { id: "blau", stamm: "blau", de: "blau", it: "blu", itUnveraenderlich: true, praedikativ: true, level: "A2" },
    { id: "gruen", stamm: "grün", de: "grün", it: "verde", praedikativ: true, level: "A2" },
    { id: "gelb", stamm: "gelb", de: "gelb", it: "giallo", praedikativ: true, level: "A2" },
    { id: "guenstig", stamm: "günstig", de: "günstig", it: "conveniente", praedikativ: true, level: "A2" },
    { id: "wertvoll", stamm: "wertvoll", de: "wertvoll", it: "prezioso", praedikativ: true, level: "A2" },
    { id: "kaputt", stamm: "kaputt", de: "kaputt", it: "rotto", praedikativ: true, level: "A2" },
    { id: "fertig", stamm: "fertig", de: "fertig", it: "pronto", praedikativ: true, level: "A2" },
    { id: "letzt", stamm: "letzt", de: "letzt", it: "ultimo", level: "A2" },
    { id: "naechst", stamm: "nächst", de: "nächst", it: "prossimo", level: "A2" },
    { id: "interessant", stamm: "interessant", de: "interessant", it: "interessante", praedikativ: true, level: "A2" },
    { id: "lustig", stamm: "lustig", de: "lustig", it: "divertente", praedikativ: true, level: "A2" },
    { id: "traurig", stamm: "traurig", de: "traurig", it: "triste", praedikativ: true, level: "A2" },
    { id: "muede", stamm: "müd", de: "müde", it: "stanco", praedikativ: true, praedikativForm: "müde", level: "A2" },
    { id: "jung", stamm: "jung", de: "jung", it: "giovane", praedikativ: true, level: "A1" },
    { id: "freundlich", stamm: "freundlich", de: "freundlich", it: "gentile", praedikativ: true, level: "A2" },
    { id: "krank", stamm: "krank", de: "krank", it: "malato", praedikativ: true, level: "A2" },
  ];
  const ADJ_NACH_ID = {};
  ADJEKTIVE.forEach((a) => { ADJ_NACH_ID[a.id] = a; });

  /* ===================================================================
     4. DIE VIER UMSTANDSBESTIMMUNGEN
     ===================================================================
     TEMPORAL wann, KAUSAL warum, MODAL wie, LOKAL wo/wohin/woher.
     Im deutschen Mittelfeld stehen sie in genau dieser Reihenfolge.
     =================================================================== */

  // --- TEMPORAL ---------------------------------------------------
  // art: "zeitpunkt" steht gern vorn im Satz, "haeufigkeit" beim Verb,
  // "dauer" hinten. Das entscheidet auch die italienische Stellung.
  const ZEITEN = [
    { id: "keine", de: "", it: "" },
    { id: "heute", de: "heute", it: "oggi", art: "zeitpunkt" },
    { id: "morgen", de: "morgen", it: "domani", art: "zeitpunkt", nurZukunft: true },
    { id: "gestern", de: "gestern", it: "ieri", art: "zeitpunkt", nurVergangenheit: true },
    { id: "vorgestern", de: "vorgestern", it: "l'altro ieri", art: "zeitpunkt", nurVergangenheit: true, level: "A2" },
    { id: "uebermorgen", de: "übermorgen", it: "dopodomani", art: "zeitpunkt", nurZukunft: true, level: "A2" },
    { id: "jetzt", de: "jetzt", it: "adesso", art: "zeitpunkt", nurGegenwart: true },
    { id: "frueh", de: "am Morgen", it: "la mattina", art: "zeitpunkt" },
    { id: "mittag", de: "am Mittag", it: "a mezzogiorno", art: "zeitpunkt", level: "A2" },
    { id: "abend", de: "am Abend", it: "la sera", art: "zeitpunkt" },
    { id: "nacht", de: "in der Nacht", it: "di notte", art: "zeitpunkt", level: "A2" },
    { id: "montags", de: "montags", it: "il lunedì", art: "zeitpunkt" },
    { id: "wochenende", de: "am Wochenende", it: "il fine settimana", art: "zeitpunkt" },
    { id: "jedentag", nichtVerneinbar: true, de: "jeden Tag", it: "ogni giorno", art: "haeufigkeit" },
    { id: "jedewoche", nichtVerneinbar: true, de: "jede Woche", it: "ogni settimana", art: "haeufigkeit", level: "A2" },
    { id: "oft", de: "oft", it: "spesso", art: "haeufigkeit" },
    { id: "immer", nichtVerneinbar: true, de: "immer", it: "sempre", art: "haeufigkeit" },
    { id: "manchmal", de: "manchmal", it: "a volte", art: "haeufigkeit" },
    { id: "selten", nichtVerneinbar: true, de: "selten", it: "raramente", art: "haeufigkeit", level: "A2" },
    { id: "nie", de: "nie", it: "mai", art: "haeufigkeit", itBrauchtNon: true, level: "A2" },
    { id: "letztewoche", de: "letzte Woche", it: "la settimana scorsa", art: "zeitpunkt", nurVergangenheit: true },
    { id: "letztesjahr", de: "letztes Jahr", it: "l'anno scorso", art: "zeitpunkt", nurVergangenheit: true, level: "A2" },
    { id: "naechstewoche", de: "nächste Woche", it: "la prossima settimana", art: "zeitpunkt", nurZukunft: true },
    { id: "naechstesjahr", de: "nächstes Jahr", it: "l'anno prossimo", art: "zeitpunkt", nurZukunft: true, level: "A2" },
    { id: "seitdrei", de: "seit drei Wochen", it: "da tre settimane", art: "dauer", nichtZukunft: true, level: "B1" },
    { id: "seiteinemjahr", de: "seit einem Jahr", it: "da un anno", art: "dauer", nichtZukunft: true, level: "B1" },
    { id: "zweistunden", de: "zwei Stunden lang", it: "per due ore", art: "dauer", level: "B1" },
    { id: "denganzentag", de: "den ganzen Tag", it: "tutto il giorno", art: "dauer", level: "A2" },
    { id: "baldig", de: "bald", it: "presto", art: "zeitpunkt", nurZukunft: true, level: "A2" },
    { id: "gerade", de: "gerade", it: "in questo momento", art: "zeitpunkt", nurGegenwart: true, level: "A2" },

    /* --- neu aufgenommen --- */
    { id: "heuteabend", de: "heute Abend", it: "stasera", art: "zeitpunkt", level: "A1" },
    { id: "heutemorgen", de: "heute Morgen", it: "stamattina", art: "zeitpunkt", level: "A1" },
    { id: "morgenfrueh", de: "morgen früh", it: "domani mattina", art: "zeitpunkt", nurZukunft: true, level: "A1" },
    { id: "gesternabend", de: "gestern Abend", it: "ieri sera", art: "zeitpunkt", nurVergangenheit: true, level: "A1" },
    { id: "letztenmonat", de: "letzten Monat", it: "il mese scorso", art: "zeitpunkt", nurVergangenheit: true, level: "A2" },
    { id: "naechstenmonat", de: "nächsten Monat", it: "il mese prossimo", art: "zeitpunkt", nurZukunft: true, level: "A2" },
    { id: "letztensommer", de: "letzten Sommer", it: "l'estate scorsa", art: "zeitpunkt", nurVergangenheit: true, level: "A2" },
    { id: "imurlaub", de: "im Urlaub", it: "in vacanza", art: "zeitpunkt", level: "A2" },
    { id: "vorhin", de: "vorhin", it: "poco fa", art: "zeitpunkt", nurVergangenheit: true, level: "B1" },
    { id: "spaeter", de: "später", it: "più tardi", art: "zeitpunkt", nurZukunft: true, level: "A2" },
    { id: "gleich", de: "gleich", it: "tra poco", art: "zeitpunkt", nurZukunft: true, level: "A2" },
    { id: "amanfang", de: "am Anfang", it: "all'inizio", art: "zeitpunkt", level: "B1" },
    { id: "amende", de: "am Ende", it: "alla fine", art: "zeitpunkt", level: "B1" },
    { id: "dienstags", de: "dienstags", it: "il martedì", art: "zeitpunkt", level: "A1" },
    { id: "samstags", de: "samstags", it: "il sabato", art: "zeitpunkt", level: "A1" },
    { id: "sonntags", de: "sonntags", it: "la domenica", art: "zeitpunkt", level: "A1" },
    { id: "jedenmorgen", nichtVerneinbar: true, de: "jeden Morgen", it: "ogni mattina", art: "haeufigkeit", level: "A2" },
    { id: "jedenabend", nichtVerneinbar: true, de: "jeden Abend", it: "ogni sera", art: "haeufigkeit", level: "A2" },
    { id: "zweimalinderwoche", de: "zweimal in der Woche", it: "due volte alla settimana", art: "haeufigkeit", level: "B1" },
    { id: "dreimalimmonat", de: "dreimal im Monat", it: "tre volte al mese", art: "haeufigkeit", level: "B1" },
    { id: "einestundelang", de: "eine Stunde lang", it: "per un'ora", art: "dauer", level: "B1" },
    { id: "dieganzewoche", de: "die ganze Woche", it: "tutta la settimana", art: "dauer", level: "B1" },
    { id: "denganzenabend", de: "den ganzen Abend", it: "tutta la sera", art: "dauer", level: "B1" },
    { id: "seiteinerstunde", de: "seit einer Stunde", it: "da un'ora", art: "dauer", nichtZukunft: true, level: "B1" },
  ];

  /* --- KAUSAL ------------------------------------------------------
     Zwei Bauarten, beide im Alltag verbreitet:
     1. weil-Satz aus einem Zustand: „weil ich müde bin“ — dabei muss das
        Adjektiv zur Person passen und im Italienischen angeglichen werden.
     2. wegen + Genitiv: „wegen des Wetters“ — dafür braucht es den
        Genitiv, den das Modul jetzt kann.
     „nurVerben“ grenzt ein, wo ein Grund wirklich passt: Man geht wegen
     des Regens nach Hause, aber man isst nicht wegen des Regens. */
  const GRUENDE = [
    { id: "keiner", art: "keiner", de: "", it: "" },
    { id: "muede", art: "zustand", adjektiv: "müde", it: "stanco", level: "A2" },
    { id: "krank", art: "zustand", adjektiv: "krank", it: "malato", level: "A2" },
    { id: "hungrig", nurDingRollen: ["essen", "kochen", "bestellen"], art: "zustand", adjektiv: "hungrig", it: "affamato", level: "A2" },
    { id: "durstig", nurDingRollen: ["trinken"], art: "zustand", adjektiv: "durstig", it: "assetato", level: "B1" },
    { id: "beschaeftigt", art: "zustand", adjektiv: "beschäftigt", it: "occupato", level: "B1" },
    { id: "spaet", art: "zustand", adjektiv: "spät dran", it: "in ritardo", itUnveraenderlich: true, level: "A2" },
    { id: "neugierig", art: "zustand", adjektiv: "neugierig", it: "curioso", level: "B1" },
    { id: "wetter", art: "wegen", nomen: "Wetter", genus: "n", it: "a causa del tempo", level: "B1" },
    { id: "regen", art: "wegen", nomen: "Regen", genus: "m", it: "a causa della pioggia", level: "B1" },
    { id: "hitze", art: "wegen", nomen: "Hitze", genus: "f", it: "a causa del caldo", level: "B1" },
    { id: "arbeitgrund", art: "wegen", nomen: "Arbeit", genus: "f", it: "per via del lavoro", level: "B1" },
    { id: "zeitmangel", art: "wegen", nomen: "Zeitmangel", genus: "m", it: "per mancanza di tempo", level: "B2" },
    { id: "laerm", art: "wegen", nomen: "Lärm", genus: "m", it: "a causa del rumore", level: "B2" },
    { id: "termingrund", art: "wegen", nomen: "Termin", genus: "m", it: "per via di un appuntamento", level: "B2" },

    /* --- neu aufgenommen --- */
    { id: "nervoes", art: "zustand", adjektiv: "nervös", it: "nervoso", level: "A2" },
    { id: "traurig", art: "zustand", adjektiv: "traurig", it: "triste", level: "A2" },
    { id: "gluecklich", art: "zustand", adjektiv: "glücklich", it: "felice", level: "A2" },
    { id: "allein", art: "zustand", adjektiv: "allein", it: "solo", level: "A2" },
    { id: "erkaeltet", art: "zustand", adjektiv: "erkältet", it: "raffreddato", level: "B1" },
    { id: "fertig", art: "zustand", adjektiv: "fertig", it: "pronto", level: "A2" },
    { id: "puenktlich", art: "zustand", adjektiv: "pünktlich", it: "puntuale", level: "B1" },
    { id: "unterwegs", art: "zustand", adjektiv: "unterwegs", it: "in viaggio", itUnveraenderlich: true, level: "B1" },
    { id: "frei", art: "zustand", adjektiv: "frei", it: "libero", level: "A2" },
    { id: "unsicher", art: "zustand", adjektiv: "unsicher", it: "insicuro", level: "B1" },
    { id: "stau", art: "wegen", nomen: "Stau", genus: "m", it: "a causa del traffico", level: "B1" },
    { id: "kaelte", art: "wegen", nomen: "Kälte", genus: "f", it: "a causa del freddo", level: "B1" },
    { id: "schnee", art: "wegen", nomen: "Schnee", genus: "m", genitiv: "Schnees", it: "a causa della neve", level: "B1" },
    { id: "sturm", art: "wegen", nomen: "Sturm", genus: "m", genitiv: "Sturms", it: "a causa della tempesta", level: "B1" },
    { id: "streik", art: "wegen", nomen: "Streik", genus: "m", genitiv: "Streiks", it: "a causa dello sciopero", level: "B1" },
    { id: "umzug", art: "wegen", nomen: "Umzug", genus: "m", genitiv: "Umzugs", it: "a causa del trasloco", level: "B1" },
    { id: "pruefung", art: "wegen", nomen: "Prüfung", genus: "f", it: "a causa dell'esame", level: "B1" },
    { id: "krankheit", art: "wegen", nomen: "Krankheit", genus: "f", it: "a causa della malattia", level: "B1" },
    { id: "baustelle", art: "wegen", nomen: "Baustelle", genus: "f", it: "a causa del cantiere", level: "B1" },
    { id: "zeitverschiebung", art: "wegen", nomen: "Zeitverschiebung", genus: "f", it: "a causa del fuso orario", level: "B1" },
  ];
  const GRUND_SEIN = ["bin", "bist", "ist", "sind", "seid", "sind"];
  const GRUND_WAR = ["war", "warst", "war", "waren", "wart", "waren"];
  const GRUND_IT_SEIN = ["sono", "sei", "è", "siamo", "siete", "sono"];
  const GRUND_IT_WAR = ["ero", "eri", "era", "eravamo", "eravate", "erano"];

  /* --- MODAL -------------------------------------------------------
     art: "weise" (wie man es tut), "mittel" (womit), "grad" (wie sehr).
     „passtVerben“ nennt ausdrücklich, wozu die Angabe passt — „gut“ geht
     mit sprechen und schlafen, nicht mit gehen. */
  const ARTEN = [
    { id: "keine", de: "", it: "", art: "keine" },
    { id: "gern", de: "gern", it: "volentieri", art: "grad",
      passtVerben: ["essen", "trinken", "kochen", "lesen", "schreiben", "sehen", "hoeren", "spielen", "lernen", "sprechen", "treffen", "helfen", "machen", "gehen", "fahren", "kommen", "arbeiten", "wohnen", "schlafen", "warten", "kaufen"] },
    { id: "sehrgern", de: "sehr gern", it: "molto volentieri", art: "grad", level: "A2",
      passtVerben: ["essen", "trinken", "kochen", "lesen", "sehen", "hoeren", "spielen", "lernen", "sprechen", "treffen", "helfen", "gehen", "fahren", "arbeiten", "wohnen"] },
    { id: "schnell", de: "schnell", it: "in fretta", art: "weise",
      passtVerben: ["essen", "trinken", "kochen", "lesen", "schreiben", "spielen", "lernen", "sprechen", "machen", "gehen", "fahren", "kommen", "arbeiten", "kaufen", "verstehen"] },
    { id: "langsam", de: "langsam", it: "lentamente", art: "weise",
      passtVerben: ["essen", "trinken", "lesen", "schreiben", "sprechen", "gehen", "fahren", "kommen", "arbeiten", "lernen"] },
    { id: "zusammen", de: "zusammen", it: "insieme", art: "weise", nurPlural: true,
      passtVerben: ["essen", "trinken", "kochen", "spielen", "lernen", "sprechen", "gehen", "fahren", "kommen", "arbeiten", "sehen", "hoeren", "machen", "warten", "sein", "wohnen", "kaufen", "lesen"] },
    { id: "allein", de: "allein", it: "da solo", itAngleichen: true, art: "weise",
      passtVerben: ["essen", "trinken", "kochen", "spielen", "lernen", "gehen", "fahren", "kommen", "arbeiten", "sehen", "machen", "warten", "sein", "wohnen", "kaufen", "lesen", "schlafen", "schreiben"] },
    { id: "ruhig", de: "in Ruhe", it: "con calma", art: "weise",
      passtVerben: ["essen", "trinken", "lesen", "schreiben", "sprechen", "arbeiten", "lernen", "kochen", "machen"] },
    { id: "gut", de: "gut", it: "bene", art: "weise",
      passtVerben: ["sprechen", "lesen", "schreiben", "kochen", "spielen", "verstehen", "lernen", "schlafen", "arbeiten", "essen", "sehen", "hoeren", "helfen"] },
    { id: "leise", de: "leise", it: "piano", art: "weise", level: "A2",
      passtVerben: ["sprechen", "lesen", "spielen", "arbeiten", "kommen", "gehen"] },
    { id: "laut", de: "laut", it: "ad alta voce", art: "weise", level: "A2",
      passtVerben: ["sprechen", "lesen", "spielen", "hoeren"] },
    { id: "sorgfaeltig", de: "sorgfältig", it: "con cura", art: "weise", level: "B1",
      passtVerben: ["lesen", "schreiben", "kochen", "arbeiten", "machen", "lernen"] },
    { id: "zufuss", de: "zu Fuß", it: "a piedi", art: "mittel", passtVerben: ["gehen", "kommen"] },
    { id: "mitdemzug", de: "mit dem Zug", it: "in treno", art: "mittel", passtVerben: ["fahren", "kommen"] },
    { id: "mitdembus", de: "mit dem Bus", it: "in autobus", art: "mittel", passtVerben: ["fahren", "kommen", "gehen"] },
    { id: "mitdemrad", de: "mit dem Fahrrad", it: "in bicicletta", art: "mittel", passtVerben: ["fahren", "kommen"] },
    { id: "mitdemauto", de: "mit dem Auto", it: "in macchina", art: "mittel", level: "A2", passtVerben: ["fahren", "kommen"] },

    /* --- neu aufgenommen --- */
    { id: "gruendlich", de: "gründlich", it: "a fondo", art: "weise", passtVerben: ["putzen","waschen","aufraeumen","lernen","ueben","wiederholen","reparieren"] },
    { id: "ordentlich", de: "ordentlich", it: "in modo ordinato", art: "weise", passtVerben: ["aufraeumen","schreiben","packen","arbeiten"] },
    { id: "vorsichtig", de: "vorsichtig", it: "con cautela", art: "weise", passtVerben: ["fahren","gehen","tragen","oeffnen","schliessen","reparieren"] },
    { id: "hoeflich", de: "höflich", it: "cortesemente", art: "weise", passtVerben: ["fragen","antworten","sprechen","schreiben"] },
    { id: "freundlich", de: "freundlich", it: "amichevolmente", art: "weise", passtVerben: ["sprechen","antworten","helfen","fragen","lachen"] },
    { id: "fleissig", de: "fleißig", it: "con impegno", art: "weise", passtVerben: ["arbeiten","lernen","ueben"] },
    { id: "geduldig", de: "geduldig", it: "pazientemente", art: "weise", passtVerben: ["warten","erklaeren","helfen"] },
    { id: "aufmerksam", de: "aufmerksam", it: "attentamente", art: "weise", passtVerben: ["hoeren","lesen"] },
    { id: "deutlich", de: "deutlich", it: "chiaramente", art: "weise", passtVerben: ["sprechen","schreiben","erklaeren"] },
    { id: "puenktlich", de: "pünktlich", it: "puntualmente", art: "weise", passtVerben: ["kommen","sein","anfangen","bezahlen"] },
    { id: "mitfreude", de: "mit Freude", it: "con gioia", art: "weise", passtVerben: ["singen","tanzen","feiern","spielen","kochen","arbeiten"] },
    { id: "zuzweit", de: "zu zweit", it: "in due", art: "weise", nurPlural: true, passtVerben: ["wandern","tanzen","spielen","reisen","kochen","singen","schwimmen"] },
    { id: "aufdeutsch", de: "auf Deutsch", it: "in tedesco", art: "mittel", passtVerben: ["sprechen","schreiben","lesen","lernen","verstehen","erklaeren","uebersetzen","singen"] , nichtMitDingen: ["deutsch","italienisch"] },
    { id: "aufitalienisch", de: "auf Italienisch", it: "in italiano", art: "mittel", passtVerben: ["sprechen","schreiben","lesen","lernen","verstehen","erklaeren","uebersetzen","singen"] , nichtMitDingen: ["deutsch","italienisch"] },
    { id: "mitderhand", de: "mit der Hand", it: "a mano", art: "mittel", passtVerben: ["schreiben","waschen","machen","zeigen"] },
    { id: "amtelefon", de: "am Telefon", it: "al telefono", art: "mittel", passtVerben: ["sprechen","fragen","antworten","erklaeren","bestellen"] },
    { id: "peremail", de: "per E-Mail", it: "per email", art: "mittel", passtVerben: ["schreiben","schicken","fragen","antworten","buchen","bestellen"] },
    { id: "iminternet", de: "im Internet", it: "su Internet", art: "mittel", passtVerben: ["suchen","finden","lesen","kaufen","bestellen","buchen","spielen","lernen"] },
    { id: "mitdemwoerterbuch", de: "mit dem Wörterbuch", it: "con il dizionario", art: "mittel", passtVerben: ["uebersetzen","lernen","lesen","schreiben","ueben"] },
    { id: "inbar", de: "in bar", it: "in contanti", art: "mittel", passtVerben: ["bezahlen"] },
    { id: "mitkarte", de: "mit Karte", it: "con la carta", art: "mittel", passtVerben: ["bezahlen","buchen","bestellen"] },
    { id: "sehr", de: "sehr", it: "molto", art: "grad", passtVerben: ["moegen","brauchen","helfen","lachen","weinen"] },
    { id: "einbisschen", de: "ein bisschen", it: "un po'", art: "grad", passtVerben: ["verstehen","sprechen","warten","helfen","schlafen"] },
    { id: "ueberhauptnicht", verneinend: true, nachObjekt: true, de: "überhaupt nicht", it: "per niente", art: "grad", passtVerben: ["verstehen","moegen","glauben","wissen"] },
  ];

  /* ===================================================================
     5. VERBEN
     ===================================================================
     lokal        welche Ortsfragen dieses Verb zulässt — daraus wird im
                  Baukasten die Auswahl „wo / wohin / woher“
     passtOrte    welche Orte wirklich dazugehören (je Ortsfrage getrennt,
                  wo es sich unterscheidet)
     passtDinge   welche Dinge als Objekt taugen
     passtPersonen wen oder wem
     passtGruende welche Gründe zu diesem Verb passen
     objekt       Fall des Objekts, objektPflicht wenn ohne Objekt kein Satz
     personFall   Fall der Person, personPraep die nötige Präposition
     =================================================================== */
  const VERBEN = [
    { id: "sein", inf: "sein", formen: ["bin", "bist", "ist", "sind", "seid", "sind"], hilfsverb: "sein", partizip: "gewesen",
      lokal: ["wo"], ortPflicht: true, praedikativ: true,
      passtOrte: {"wo":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","badezimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kinderzimmer","kindergarten","kita","spielplatz","elternhaus","wald","strand","fluss","zoo","disko","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","faehre","autobahn","schweiz","oesterreich","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","erkaeltet","beschaeftigt","hungrig","durstig","neugierig","nervoes","traurig","gluecklich","fertig","frei","wetter","regen","hitze","kaelte","schnee","sturm","streik","stau","arbeitgrund","termingrund","pruefung","krankheit","zeitmangel"],
      itInf: "essere", itFormen: ["sono", "sei", "è", "siamo", "siete", "sono"], itHilf: "essere", itPart: "stat", itFutStamm: "sar",
      kategorien: ["alltag", "arbeit", "freizeit", "reisen", "bildung", "gesundheit", "einkaufen", "essen", "familie", "verwaltung"] },

    { id: "gehen", inf: "gehen", formen: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"], hilfsverb: "sein", partizip: "gegangen",
      ortPflicht: true, lokal: ["wohin", "woher"],
      passtOrte: {"wohin":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","badezimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","stadt","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kinderzimmer","kindergarten","kita","spielplatz","wald","strand","fluss","zoo","disko","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"],"woher":["arbeit","buero","schule","uni","bibliothek","kurs","supermarkt","markt","baeckerei","kino","theater","restaurant","cafe","kantine","arzt","amt","bank","post","schwimmbad","apotheke","kaufhaus","werkstatt","besprechung","museum","krankenhaus","zahnarzt","klassenzimmer","hoersaal","sprachschule","seminarraum","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kindergarten","kita","disko","bar","pizzeria","eisdiele","imbiss","weinkeller","stadion","konzert"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","hungrig","durstig","spaet","beschaeftigt","neugierig","wetter","regen","hitze","kaelte","schnee","arbeitgrund","termingrund","zeitmangel","pruefung","krankheit","frei","fertig"],
      itInf: "andare", itFormen: ["vado", "vai", "va", "andiamo", "andate", "vanno"], itHilf: "essere", itPart: "andat", itFutStamm: "andr",
      deWoherInf: "kommen", deWoherFormen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], deWoherPartizip: "gekommen",
      itWoherInf: "venire", itWoherFormen: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], itWoherPart: "venut", itWoherFutStamm: "verr",
      kategorien: ["alltag", "arbeit", "freizeit", "reisen", "bildung", "gesundheit", "einkaufen", "essen", "verwaltung"] },

    { id: "fahren", inf: "fahren", formen: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], hilfsverb: "sein", partizip: "gefahren",
      ortPflicht: true, lokal: ["wohin", "woher"],
      passtOrte: {"wohin":["zuhause","supermarkt","markt","kaufhaus","arbeit","buero","baustelle","uni","meer","berge","see","stadion","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","krankenhaus","schule","bibliothek","kurs","apotheke","werkstatt","kindergarten","kita","elternhaus","fabrik","labor","lager","filiale","zoo","wald","strand","disko","pizzeria","restaurant","cafe","kino","theater","museum","konzert","arzt","zahnarzt","notaufnahme","praxis","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","auslaenderbehoerde","drogerie","buchhandlung","metzgerei","schuhgeschaeft","amt","bank","post","garage","autobahn","faehre","hafen","schweiz","oesterreich","besprechung"],"woher":["arbeit","buero","uni","meer","berge","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","baustelle","schule","bibliothek","kurs","krankenhaus","arzt","zahnarzt","werkstatt","fabrik","labor","lager","filiale","zoo","wald","strand","see","disko","restaurant","kino","theater","museum","konzert","notaufnahme","praxis","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","auslaenderbehoerde","amt","bank","post","autobahn","faehre","hafen","schweiz","oesterreich","garage","elternhaus","kindergarten","kita","apotheke","kaufhaus","supermarkt","markt","drogerie","buchhandlung","metzgerei","schuhgeschaeft","besprechung","pizzeria","cafe"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","spaet","wetter","regen","hitze","kaelte","schnee","sturm","stau","streik","baustelle","arbeitgrund","termingrund","zeitmangel","umzug","pruefung","krankheit"],
      itInf: "andare", itFormen: ["vado", "vai", "va", "andiamo", "andate", "vanno"], itHilf: "essere", itPart: "andat", itFutStamm: "andr",
      deWoherInf: "kommen", deWoherFormen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], deWoherPartizip: "gekommen",
      itWoherInf: "venire", itWoherFormen: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], itWoherPart: "venut", itWoherFutStamm: "verr",
      kategorien: ["reisen", "arbeit", "freizeit", "einkaufen"] },

    { id: "kommen", inf: "kommen", formen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], hilfsverb: "sein", partizip: "gekommen",
      ortPflicht: true, lokal: ["woher", "wohin"],
      passtOrte: {"wohin":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","badezimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kinderzimmer","kindergarten","kita","spielplatz","elternhaus","wald","strand","fluss","zoo","disko","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","faehre","autobahn","schweiz","oesterreich","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"],"woher":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","badezimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kinderzimmer","kindergarten","kita","spielplatz","elternhaus","wald","strand","fluss","zoo","disko","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","faehre","autobahn","schweiz","oesterreich","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","spaet","hungrig","durstig","beschaeftigt","wetter","regen","hitze","kaelte","schnee","sturm","stau","streik","baustelle","umzug","arbeitgrund","termingrund","zeitmangel","puenktlich","unterwegs","pruefung","krankheit","zeitverschiebung"],
      itInf: "venire", itFormen: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], itHilf: "essere", itPart: "venut", itFutStamm: "verr",
      kategorien: ["reisen", "alltag", "arbeit", "freizeit"] },

    { id: "wohnen", inf: "wohnen", formen: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"], hilfsverb: "haben", partizip: "gewohnt",
      ortPflicht: true, lokal: ["wo"],
      passtOrte: {"wo":["zuhause","berlin","rom","italien","schweiz","oesterreich","stadt","land","meer","berge","elternhaus"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["arbeitgrund","umzug"],
      itInf: "abitare", itFormen: ["abito", "abiti", "abita", "abitiamo", "abitate", "abitano"], itHilf: "avere", itPart: "abitato", itFutStamm: "abiter",
      kategorien: ["alltag", "reisen"] },

    { id: "arbeiten", inf: "arbeiten", formen: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"], hilfsverb: "haben", partizip: "gearbeitet",
      lokal: ["wo"],
      passtOrte: {"wo":["zuhause","buero","werkstatt","baustelle","garten","kueche","bibliothek","schule","uni","krankenhaus","restaurant","cafe","supermarkt","baeckerei","apotheke","kaufhaus","amt","bank","post","hotel","fabrik","labor","lager","filiale","metzgerei","buchhandlung","drogerie","schuhgeschaeft","kindergarten","kita","praxis","notaufnahme","physiotherapie","fitnessstudio","rathaus","botschaft","polizei","auslaenderbehoerde","zahnarzt","arzt","pizzeria","bar","imbiss","eisdiele","theater","museum","kino","zoo","hafen","flughafen","bahnhof","schwimmbad","stadion","kantine","sprachschule","klassenzimmer"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["termingrund","arbeitgrund","zeitmangel","muede","krank","beschaeftigt","spaet"],
      itInf: "lavorare", itFormen: ["lavoro", "lavori", "lavora", "lavoriamo", "lavorate", "lavorano"], itHilf: "avere", itPart: "lavorato", itFutStamm: "lavorer",
      kategorien: ["arbeit"] },

    { id: "essen", inf: "essen", formen: ["esse", "isst", "isst", "essen", "esst", "essen"], hilfsverb: "haben", partizip: "gegessen",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["zuhause","kueche","garten","balkon","restaurant","cafe","kantine","buero","park","meer","hotel","pizzeria","imbiss","eisdiele","strand","wald","flughafen"]},
      passtDinge: ["brot","apfel","pizza","suppe","kuchen","nudeln","kaese","butter","ei","fleisch","fisch","gemuese","obst","salat","reis","kartoffeln","tomaten","marmelade","joghurt","schokolade","eis","keks","broetchen","sandwich","nachtisch"], passtPersonen: [], passtGruende: ["hungrig","spaet","krank","erkaeltet","traurig","gluecklich","beschaeftigt","zeitmangel","termingrund","unterwegs"],
      itInf: "mangiare", itFormen: ["mangio", "mangi", "mangia", "mangiamo", "mangiate", "mangiano"], itHilf: "avere", itPart: "mangiato", itFutStamm: "manger",
      kategorien: ["essen", "alltag"] },

    { id: "trinken", inf: "trinken", formen: ["trinke", "trinkst", "trinkt", "trinken", "trinkt", "trinken"], hilfsverb: "haben", partizip: "getrunken",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["zuhause","kueche","garten","balkon","restaurant","cafe","kantine","buero","park","hotel","bar","weinkeller","disko","strand","flughafen","meer"]},
      passtDinge: ["kaffee","tee","wasser","wein","milch","saft","bier"], passtPersonen: [], passtGruende: ["durstig","muede","krank","erkaeltet","hitze","nervoes","traurig","gluecklich","beschaeftigt","kaelte"],
      itInf: "bere", itFormen: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"], itHilf: "avere", itPart: "bevuto", itFutStamm: "berr",
      kategorien: ["essen"] },

    { id: "kochen", inf: "kochen", formen: ["koche", "kochst", "kocht", "kochen", "kocht", "kochen"], hilfsverb: "haben", partizip: "gekocht",
      lokal: ["wo"], objekt: "akk", objektPflicht: true,
      passtOrte: {"wo":["zuhause","kueche","garten","restaurant","kantine","hotel"]},
      passtDinge: ["suppe","nudeln","kuchen","pizza","reis","kartoffeln","gemuese","fisch","fleisch","ei","kaffee","tee","zwiebel","tomaten"], passtPersonen: [], passtGruende: ["hungrig","krank","erkaeltet","beschaeftigt","zeitmangel"],
      itInf: "cucinare", itFormen: ["cucino", "cucini", "cucina", "cuciniamo", "cucinate", "cucinano"], itHilf: "avere", itPart: "cucinato", itFutStamm: "cuciner",
      kategorien: ["essen", "alltag"] },

    { id: "kaufen", inf: "kaufen", formen: ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"], hilfsverb: "haben", partizip: "gekauft",
      lokal: ["wo"], objekt: "akk", objektPflicht: true,
      passtOrte: {"wo":["supermarkt","markt","baeckerei","apotheke","kaufhaus","stadt","italien","metzgerei","buchhandlung","drogerie","schuhgeschaeft","weinkeller","schweiz","oesterreich"]},
      passtDinge: ["brot","apfel","pizza","kuchen","kaffee","tee","wein","buch","zeitung","kaese","butter","ei","fleisch","fisch","gemuese","obst","salat","reis","kartoffeln","tomaten","zwiebel","milch","saft","bier","zucker","salz","pfeffer","oel","marmelade","joghurt","schokolade","eis","keks","broetchen","sandwich","tisch","stuhl","bett","schrank","lampe","handtuch","seife","zahnbuerste","blume","topf","pfanne","tasse","glas","flasche","korb","hemd","hose","jacke","schuhe","mantel","kleid","pullover","muetze","schal","handschuhe","heft","stift","woerterbuch","computer","laptop","handy","bildschirm","drucker","tastatur","spiel","ball","fahrrad","roman","zeitschrift","konzertkarte","koffer","rucksack","regenschirm","fahrkarte","medikament","tablette","verband","wohnung"], passtPersonen: [], passtGruende: ["hungrig","durstig","termingrund","zeitmangel","krankheit","krank","erkaeltet","umzug","pruefung"],
      itInf: "comprare", itFormen: ["compro", "compri", "compra", "compriamo", "comprate", "comprano"], itHilf: "avere", itPart: "comprato", itFutStamm: "comprer",
      kategorien: ["einkaufen"] },

    { id: "lesen", inf: "lesen", formen: ["lese", "liest", "liest", "lesen", "lest", "lesen"], hilfsverb: "haben", partizip: "gelesen",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["zuhause","bett","garten","balkon","wohnzimmer","bibliothek","buero","cafe","park","meer","hotel","bahnhof","strand","flughafen","klassenzimmer","hoersaal","praxis"]},
      passtDinge: ["buch","zeitung","brief","nachricht","bericht","mail","vertrag","roman","gedicht","zeitschrift","rezept","formular","regel","antwort","datei","protokoll","kuendigung"], passtPersonen: [], passtGruende: ["neugierig","beschaeftigt","unterwegs","allein","frei"],
      itInf: "leggere", itFormen: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"], itHilf: "avere", itPart: "letto", itFutStamm: "legger",
      kategorien: ["bildung", "freizeit", "arbeit"] },

    { id: "schreiben", inf: "schreiben", formen: ["schreibe", "schreibst", "schreibt", "schreiben", "schreibt", "schreiben"], hilfsverb: "haben", partizip: "geschrieben",
      lokal: ["wo"], objekt: "akk", personPraep: "an", personFall: "akk",
      passtOrte: {"wo":["zuhause","buero","bibliothek","schule","uni","cafe","amt","klassenzimmer","hoersaal","seminarraum","sprachschule","rathaus"]},
      passtDinge: ["brief","nachricht","bericht","mail","antrag","buch","vertrag","protokoll","vokabel","roman","gedicht","lied","kuendigung","formular"],
      passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","chef","lehrerin","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","nachbar","nachbarin","kind","lehrer","vermieter","verkaeufer"],
      passtGruende: ["beschaeftigt","termingrund","arbeitgrund","umzug","krankheit"],
      itInf: "scrivere", itFormen: ["scrivo", "scrivi", "scrive", "scriviamo", "scrivete", "scrivono"], itHilf: "avere", itPart: "scritto", itFutStamm: "scriver", itPersonFeld: "itAn",
      kategorien: ["arbeit", "bildung", "verwaltung"] },

    { id: "sehen", inf: "sehen", formen: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"], hilfsverb: "haben", partizip: "gesehen",
      lokal: ["wo"], objekt: "akk", personFall: "akk",
      passtOrte: {"wo":["zuhause","wohnzimmer","balkon","garten","terrasse","buero","supermarkt","schule","uni","klassenzimmer","hoersaal","seminarraum","bibliothek","kurs","kino","theater","museum","stadion","konzert","park","stadt","bahnhof","zoo","meer","berge","see"]},
      passtDinge: ["film","foto","preis","tafel","bildschirm","bus","blume","fehler","loesung"],
      passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"],
      passtGruende: ["neugierig","frei","muede","allein","regen","krank","unterwegs"],
      itInf: "vedere", itFormen: ["vedo", "vedi", "vede", "vediamo", "vedete", "vedono"], itHilf: "avere", itPart: "visto", itFutStamm: "vedr",
      kategorien: ["freizeit", "familie"] },

    { id: "hoeren", inf: "hören", formen: ["höre", "hörst", "hört", "hören", "hört", "hören"], hilfsverb: "haben", partizip: "gehört",
      lokal: ["wo"], objekt: "akk", personFall: "akk",
      passtOrte: {"wo":["zuhause","wohnzimmer","garten","balkon","terrasse","kueche","schlafzimmer","buero","park","konzert","disko","bar","restaurant","cafe","stadion","fitnessstudio","schule","uni","kurs","sprachschule","klassenzimmer"]},
      passtDinge: ["musik","lied"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["muede","traurig","gluecklich","allein","nervoes","unterwegs","frei"],
      itInf: "ascoltare", itFormen: ["ascolto", "ascolti", "ascolta", "ascoltiamo", "ascoltate", "ascoltano"], itHilf: "avere", itPart: "ascoltato", itFutStamm: "ascolter",
      kategorien: ["freizeit"] },

    { id: "spielen", inf: "spielen", formen: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"], hilfsverb: "haben", partizip: "gespielt",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["zuhause","wohnzimmer","garten","balkon","terrasse","park","spielplatz","schule","schulhof","hof","stadion","schwimmbad","see","strand","cafe","bar","keller","kindergarten","kita"]},
      passtDinge: ["fussball","klavier","karten","spiel"], passtPersonen: [], passtGruende: ["frei","gluecklich","allein"],
      itVerbNachDing: { klavier: { itInf: "suonare", itFormen: ["suono","suoni","suona","suoniamo","suonate","suonano"], itPart: "suonato", itFutStamm: "suoner" } }, itInf: "giocare", itFormen: ["gioco", "giochi", "gioca", "giochiamo", "giocate", "giocano"], itHilf: "avere", itPart: "giocato", itFutStamm: "giocher",
      kategorien: ["freizeit"] },

    { id: "lernen", inf: "lernen", formen: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"], hilfsverb: "haben", partizip: "gelernt",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["zuhause","schule","uni","bibliothek","kurs","cafe","buero","klassenzimmer","hoersaal","sprachschule","seminarraum","bett","wohnzimmer","garten","balkon","terrasse","park"]},
      passtDinge: ["deutsch","italienisch","grammatik","vokabel","gedicht","lied","regel"], passtPersonen: [], passtGruende: ["neugierig","beschaeftigt","arbeitgrund","pruefung","unsicher","frei"],
      itInf: "studiare", itFormen: ["studio", "studi", "studia", "studiamo", "studiate", "studiano"], itHilf: "avere", itPart: "studiato", itFutStamm: "studier",
      kategorien: ["bildung"] },

    { id: "sprechen", inf: "sprechen", formen: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"], hilfsverb: "haben", partizip: "gesprochen",
      lokal: ["wo"], objekt: "akk", personPraep: "mit", personFall: "dat",
      passtOrte: {"wo":["zuhause","buero","besprechung","schule","uni","kurs","cafe","amt","bank","post","klassenzimmer","hoersaal","sprachschule","seminarraum","restaurant","hotel","bahnhof","flughafen","polizei","rathaus","botschaft","gericht","auslaenderbehoerde","praxis","arzt"]},
      passtDinge: ["deutsch","italienisch"],
      passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"],
      passtGruende: ["termingrund","arbeitgrund","neugierig","unsicher","pruefung","nervoes"],
      itInf: "parlare", itFormen: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"], itHilf: "avere", itPart: "parlato", itFutStamm: "parler", itPersonFeld: "itMit",
      kategorien: ["bildung", "arbeit", "familie"] },

    { id: "verstehen", inf: "verstehen", formen: ["verstehe", "verstehst", "versteht", "verstehen", "versteht", "verstehen"], hilfsverb: "haben", partizip: "verstanden",
      lokal: ["wo"], objekt: "akk", personFall: "akk",
      passtOrte: {"wo":["schule","uni","kurs","besprechung","klassenzimmer","hoersaal","sprachschule","seminarraum","bibliothek","buero","zuhause","cafe"]},
      passtDinge: ["deutsch","italienisch","aufgabe","grammatik","uebung","frage","problem","fehler","regel","grund","antwort"],
      passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["muede","unsicher","nervoes","laerm","zeitverschiebung"],
      itInf: "capire", itFormen: ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"], itHilf: "avere", itPart: "capito", itFutStamm: "capir",
      kategorien: ["bildung", "familie"] },

    { id: "treffen", inf: "treffen", formen: ["treffe", "triffst", "trifft", "treffen", "trefft", "treffen"], hilfsverb: "haben", partizip: "getroffen",
      lokal: ["wo"], personFall: "akk",
      passtOrte: {"wo":["zuhause","cafe","restaurant","park","stadt","bahnhof","kino","buero","bibliothek","flughafen","hotel","bar","disko","imbiss","eisdiele","pizzeria","museum","theater","konzert","zoo","spielplatz","schwimmbad","see","meer","strand","berge","wald","schule","uni","kurs","klassenzimmer","supermarkt","markt","kaufhaus","haltestelle","krankenhaus","arzt"]},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"],
      passtGruende: ["termingrund","neugierig","pruefung","frei","unterwegs","stau","umzug"],
      itInf: "incontrare", itFormen: ["incontro", "incontri", "incontra", "incontriamo", "incontrate", "incontrano"], itHilf: "avere", itPart: "incontrato", itFutStamm: "incontrer",
      kategorien: ["familie", "freizeit", "arbeit"] },

    { id: "helfen", inf: "helfen", formen: ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"], hilfsverb: "haben", partizip: "geholfen",
      lokal: ["wo"], personFall: "dat",
      passtOrte: {"wo":["zuhause","kueche","garten","buero","schule","werkstatt","baustelle","fabrik","labor","lager","filiale","krankenhaus","praxis","apotheke","supermarkt","kindergarten","kita","garage","keller","dachboden","wohnzimmer","terrasse","balkon","hof","bibliothek","uni","kurs","klassenzimmer","amt","rathaus"]},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"],
      passtGruende: ["frei","umzug","pruefung","krankheit"],
      itInf: "aiutare", itFormen: ["aiuto", "aiuti", "aiuta", "aiutiamo", "aiutate", "aiutano"], itHilf: "avere", itPart: "aiutato", itFutStamm: "aiuter", itPersonFeld: "it",
      kategorien: ["familie", "arbeit", "alltag"] },

    { id: "warten", inf: "warten", formen: ["warte", "wartest", "wartet", "warten", "wartet", "warten"], hilfsverb: "haben", partizip: "gewartet",
      lokal: ["wo"], personPraep: "auf", personFall: "akk",
      passtOrte: {"wo":["zuhause","bahnhof","flughafen","buero","cafe","park","krankenhaus","amt","bank","post","haltestelle","arzt","zahnarzt","praxis","notaufnahme","hafen","restaurant","schule","kindergarten","kita","rathaus","botschaft","polizei","auslaenderbehoerde","gericht","autobahn","werkstatt","bar"]},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"],
      passtGruende: ["termingrund","stau","streik","frei"],
      itInf: "aspettare", itFormen: ["aspetto", "aspetti", "aspetta", "aspettiamo", "aspettate", "aspettano"], itHilf: "avere", itPart: "aspettato", itFutStamm: "aspetter", itPersonFeld: "it",
      kategorien: ["alltag", "reisen", "familie"] },

    { id: "machen", inf: "machen", formen: ["mache", "machst", "macht", "machen", "macht", "machen"], hilfsverb: "haben", partizip: "gemacht",
      lokal: ["wo"], objekt: "akk", objektPflicht: true,
      passtOrte: {"wo":["zuhause","kueche","garten","buero","schule","uni","bibliothek","kurs","klassenzimmer","hoersaal","seminarraum"]},
      passtDinge: ["fruehstueck","waesche","geschirr","einkauf","termin","foto","antrag","salat","marmelade","keks","broetchen","sandwich","nachtisch","saft","aufgabe","projekt","praesentation","pruefung","uebung","anmeldung","impfung","fehler","plan"], passtPersonen: [], passtGruende: ["beschaeftigt","termingrund","arbeitgrund","zeitmangel"],
      itInf: "fare", itFormen: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"], itHilf: "avere", itPart: "fatto", itFutStamm: "far",
      kategorien: ["alltag", "arbeit", "freizeit", "einkaufen"] },

    { id: "haben", inf: "haben", formen: ["habe", "hast", "hat", "haben", "habt", "haben"], hilfsverb: "haben", partizip: "gehabt",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {}, passtDinge: ["termin","zeit","hunger","durst","tisch","stuhl","bett","schrank","lampe","fenster","tuer","schluessel","handtuch","zahnbuerste","blume","topf","pfanne","messer","gabel","loeffel","teller","tasse","glas","flasche","korb","geld","preis","quittung","karte","hemd","hose","jacke","schuhe","mantel","kleid","pullover","muetze","schal","handschuhe","aufgabe","projekt","protokoll","praesentation","pruefung","note","heft","stift","woerterbuch","computer","laptop","handy","bildschirm","drucker","tastatur","programm","datei","ordner","app","spiel","ball","fahrrad","roman","zeitschrift","konzertkarte","koffer","rucksack","regenschirm","pass","visum","fahrkarte","urlaub","wetter","rezept","medikament","tablette","verband","impfung","krankheit","ausweis","formular","anmeldung","kuendigung","versicherung","steuer","wohnung","miete","idee","frage","antwort","problem","loesung","fehler","regel","plan","meinung","grund","wunsch","vertrag","rechnung"], passtPersonen: [], passtGruende: [],
      itInf: "avere", itFormen: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"], itHilf: "avere", itPart: "avuto", itFutStamm: "avr",
      kategorien: ["alltag", "arbeit"] },

    { id: "schlafen", inf: "schlafen", formen: ["schlafe", "schläfst", "schläft", "schlafen", "schlaft", "schlafen"], hilfsverb: "haben", partizip: "geschlafen",
      lokal: ["wo"],
      passtOrte: {"wo":["zuhause","bett","schlafzimmer","wohnzimmer","garten","hotel","kinderzimmer","elternhaus","krankenhaus","wald","strand","flughafen"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","erkaeltet","fertig","zeitverschiebung","krankheit"],
      itInf: "dormire", itFormen: ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"], itHilf: "avere", itPart: "dormito", itFutStamm: "dormir",
      kategorien: ["alltag", "reisen"] },

    /* --- neu aufgenommen --- */
    { id: "fragen", inf: "fragen", formen: ["frage","fragst","fragt","fragen","fragt","fragen"], hilfsverb: "haben", partizip: "gefragt",
      lokal: [], personFall: "akk", itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["neugierig","unsicher"],
      itInf: "chiedere", itFormen: ["chiedo","chiedi","chiede","chiediamo","chiedete","chiedono"], itHilf: "avere", itPart: "chiesto", itFutStamm: "chieder",
      kategorien: ["alltag","bildung","arbeit"] },

    { id: "antworten", inf: "antworten", formen: ["antworte","antwortest","antwortet","antworten","antwortet","antworten"], hilfsverb: "haben", partizip: "geantwortet",
      lokal: [], personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["beschaeftigt","spaet"],
      itInf: "rispondere", itFormen: ["rispondo","rispondi","risponde","rispondiamo","rispondete","rispondono"], itHilf: "avere", itPart: "risposto", itFutStamm: "risponder",
      kategorien: ["alltag","bildung","arbeit"] },

    { id: "suchen", inf: "suchen", formen: ["suche","suchst","sucht","suchen","sucht","suchen"], hilfsverb: "haben", partizip: "gesucht",
      lokal: [], objekt: "akk", personFall: "akk", itPersonFeld: "it",
      passtOrte: {},
      passtDinge: ["schluessel","preis","karte","schuhe","projekt","protokoll","heft","stift","woerterbuch","handy","datei","ordner","app","spiel","ball","fahrrad","roman","zeitschrift","konzertkarte","koffer","regenschirm","pass","bus","fahrkarte","ausweis","wohnung","idee","antwort","problem","loesung","fehler","grund"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["zeitmangel","spaet"],
      itInf: "cercare", itFormen: ["cerco","cerchi","cerca","cerchiamo","cercate","cercano"], itHilf: "avere", itPart: "cercato", itFutStamm: "cercher",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "finden", inf: "finden", formen: ["finde","findest","findet","finden","findet","finden"], hilfsverb: "haben", partizip: "gefunden",
      lokal: [], objekt: "akk", personFall: "akk", itPersonFeld: "it",
      passtOrte: {},
      passtDinge: ["schluessel","preis","karte","schuhe","projekt","protokoll","heft","stift","woerterbuch","handy","datei","ordner","app","spiel","ball","fahrrad","roman","zeitschrift","konzertkarte","koffer","regenschirm","pass","bus","fahrkarte","ausweis","wohnung","idee","antwort","problem","loesung","fehler","grund"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: [],
      itInf: "trovare", itFormen: ["trovo","trovi","trova","troviamo","trovate","trovano"], itHilf: "avere", itPart: "trovato", itFutStamm: "trover",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "oeffnen", inf: "öffnen", formen: ["öffne","öffnest","öffnet","öffnen","öffnet","öffnen"], hilfsverb: "haben", partizip: "geöffnet",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["schrank","fenster","tuer","flasche","buch","brief","heft","programm","datei","ordner","app","koffer","rucksack","regenschirm","mail"], passtPersonen: [], passtGruende: ["hitze"],
      itInf: "aprire", itFormen: ["apro","apri","apre","apriamo","aprite","aprono"], itHilf: "avere", itPart: "aperto", itFutStamm: "aprir",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "schliessen", inf: "schließen", formen: ["schließe","schließt","schließt","schließen","schließt","schließen"], hilfsverb: "haben", partizip: "geschlossen",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["schrank","fenster","tuer","flasche","buch","heft","programm","datei","ordner","app","koffer","rucksack","regenschirm"], passtPersonen: [], passtGruende: ["kaelte","laerm","sturm","schnee"],
      itInf: "chiudere", itFormen: ["chiudo","chiudi","chiude","chiudiamo","chiudete","chiudono"], itHilf: "avere", itPart: "chiuso", itFutStamm: "chiuder",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "bringen", inf: "bringen", formen: ["bringe","bringst","bringt","bringen","bringt","bringen"], hilfsverb: "haben", partizip: "gebracht",
      lokal: ["wohin"], objekt: "akk", personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {"wohin":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","badezimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kinderzimmer","kindergarten","kita","spielplatz","elternhaus","wald","strand","fluss","zoo","disko","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","faehre","autobahn","schweiz","oesterreich","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"]},
      passtDinge: ["schluessel","muell","flasche","kaese","broetchen","sandwich","spiel","roman","lied","zeitschrift","konzertkarte","regenschirm","pass","ausweis","buch","brief","geld","koffer","rucksack","handy","blume","medikament","tablette","rezept","formular","kuchen","kaffee","wasser","wein","bier","zeitung","karte","fahrkarte","quittung","nachricht","suppe","salat","pizza","obst","gemuese","fleisch","fisch"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["termingrund","arbeitgrund"],
      itInf: "portare", itFormen: ["porto","porti","porta","portiamo","portate","portano"], itHilf: "avere", itPart: "portato", itFutStamm: "porter",
      kategorien: ["alltag","arbeit","reisen"] },

    { id: "geben", inf: "geben", formen: ["gebe","gibst","gibt","geben","gebt","geben"], hilfsverb: "haben", partizip: "gegeben",
      lokal: [], objekt: "akk", personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: ["rechnung","schluessel","blume","geld","quittung","aufgabe","note","rezept","formular","kuendigung","idee","antwort","meinung","grund","buch","brief","zeitung","karte","fahrkarte","pass","ausweis","tablette","medikament","verband","impfung","loesung","plan"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["gluecklich"],
      itInf: "dare", itFormen: ["do","dai","dà","diamo","date","danno"], itHilf: "avere", itPart: "dato", itFutStamm: "dar",
      kategorien: ["alltag","einkaufen","arbeit"] },

    { id: "nehmen", inf: "nehmen", formen: ["nehme","nimmst","nimmt","nehmen","nehmt","nehmen"], hilfsverb: "haben", partizip: "genommen",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["bus","medikament","tablette","schluessel","geld","koffer","rucksack","regenschirm","handy","kaffee","tee","wasser","wein","bier","pizza","salat","suppe","nudeln","fleisch","fisch","kuchen"], passtPersonen: [], passtGruende: ["spaet","zeitmangel","stau"],
      itInf: "prendere", itFormen: ["prendo","prendi","prende","prendiamo","prendete","prendono"], itHilf: "avere", itPart: "preso", itFutStamm: "prender",
      kategorien: ["alltag","reisen","essen"] },

    { id: "bezahlen", inf: "bezahlen", formen: ["bezahle","bezahlst","bezahlt","bezahlen","bezahlt","bezahlen"], hilfsverb: "haben", partizip: "bezahlt",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["rechnung","geld","preis","karte","fahrkarte","versicherung","steuer","miete","einkauf"], passtPersonen: [], passtGruende: ["fertig"],
      itInf: "pagare", itFormen: ["pago","paghi","paga","paghiamo","pagate","pagano"], itHilf: "avere", itPart: "pagato", itFutStamm: "pagher",
      kategorien: ["einkaufen","alltag","verwaltung"] },

    { id: "bestellen", inf: "bestellen", formen: ["bestelle","bestellst","bestellt","bestellen","bestellt","bestellen"], hilfsverb: "haben", partizip: "bestellt",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["brot","apfel","pizza","suppe","kuchen","nudeln","kaffee","tee","wasser","wein","kaese","fleisch","fisch","gemuese","obst","salat","reis","kartoffeln","tomaten","milch","saft","bier","marmelade","joghurt","schokolade","eis","keks","broetchen","sandwich","nachtisch"], passtPersonen: [], passtGruende: ["hungrig","durstig"],
      itInf: "ordinare", itFormen: ["ordino","ordini","ordina","ordiniamo","ordinate","ordinano"], itHilf: "avere", itPart: "ordinato", itFutStamm: "ordiner",
      kategorien: ["essen","einkaufen"] },

    { id: "brauchen", inf: "brauchen", formen: ["brauche","brauchst","braucht","brauchen","braucht","brauchen"], hilfsverb: "haben", partizip: "gebraucht",
      lokal: [], objekt: "akk", objektPflicht: true, personFall: "akk", itPersonFeld: "it",
      passtOrte: {},
      passtDinge: ["butter","ei","zwiebel","milch","zucker","salz","pfeffer","oel","rechnung","bett","handtuch","seife","zahnbuerste","messer","gabel","loeffel","teller","geld","quittung","jacke","mantel","pullover","handschuhe","projekt","protokoll","praesentation","pruefung","note","heft","stift","woerterbuch","computer","laptop","handy","drucker","programm","app","fahrrad","konzertkarte","regenschirm","pass","visum","fahrkarte","urlaub","rezept","medikament","tablette","verband","impfung","ausweis","formular","anmeldung","kuendigung","versicherung","steuer","miete","antwort","loesung","plan","wasser","kaffee","zeit","schluessel","buch","wohnung","tastatur","bildschirm","topf","pfanne","hemd","hose","schuhe","kleid","muetze","schal","termin","idee"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["hungrig","durstig","krank","erkaeltet"],
      itInf: "avere bisogno di", itFormen: ["ho","hai","ha","abbiamo","avete","hanno"], itHilf: "avere", itPart: "avuto", itFutStamm: "avr", itZusatz: "bisogno di",
      kategorien: ["alltag","einkaufen","gesundheit"] },

    { id: "bekommen", inf: "bekommen", formen: ["bekomme","bekommst","bekommt","bekommen","bekommt","bekommen"], hilfsverb: "haben", partizip: "bekommen",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["rechnung","quittung","aufgabe","note","pass","visum","rezept","medikament","impfung","krankheit","formular","anmeldung","kuendigung","versicherung"], passtPersonen: [], passtGruende: ["krank","erkaeltet","pruefung"],
      itInf: "ricevere", itFormen: ["ricevo","ricevi","riceve","riceviamo","ricevete","ricevono"], itHilf: "avere", itPart: "ricevuto", itFutStamm: "ricever",
      kategorien: ["alltag","einkaufen","verwaltung","gesundheit"] },

    { id: "vergessen", inf: "vergessen", formen: ["vergesse","vergisst","vergisst","vergessen","vergesst","vergessen"], hilfsverb: "haben", partizip: "vergessen",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["aufgabe","protokoll","pruefung","vokabel","medikament","tablette","idee","frage","antwort","problem","termin","schluessel","handy","regenschirm","pass","ausweis"], passtPersonen: [], passtGruende: ["muede","beschaeftigt","zeitmangel","spaet"],
      itInf: "dimenticare", itFormen: ["dimentico","dimentichi","dimentica","dimentichiamo","dimenticate","dimenticano"], itHilf: "avere", itPart: "dimenticato", itFutStamm: "dimenticher",
      kategorien: ["alltag","bildung","arbeit","gesundheit"] },

    { id: "verlieren", inf: "verlieren", formen: ["verliere","verlierst","verliert","verlieren","verliert","verlieren"], hilfsverb: "haben", partizip: "verloren",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["schluessel","karte","heft","stift","handy","datei","spiel","ball","fahrrad","zeitschrift","konzertkarte","koffer","regenschirm","pass","fahrkarte","ausweis"], passtPersonen: [], passtGruende: ["muede","beschaeftigt","spaet"],
      itInf: "perdere", itFormen: ["perdo","perdi","perde","perdiamo","perdete","perdono"], itHilf: "avere", itPart: "perso", itFutStamm: "perder",
      kategorien: ["alltag","reisen","bildung","freizeit"] },

    { id: "benutzen", inf: "benutzen", formen: ["benutze","benutzt","benutzt","benutzen","benutzt","benutzen"], hilfsverb: "haben", partizip: "benutzt",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["lampe","seife","zahnbuerste","topf","pfanne","messer","gabel","loeffel","teller","tasse","glas","karte","stift","woerterbuch","computer","laptop","handy","bildschirm","drucker","tastatur","programm","app"], passtPersonen: [], passtGruende: ["unsicher","zeitmangel"],
      itInf: "usare", itFormen: ["uso","usi","usa","usiamo","usate","usano"], itHilf: "avere", itPart: "usato", itFutStamm: "user",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "reparieren", inf: "reparieren", formen: ["repariere","reparierst","repariert","reparieren","repariert","reparieren"], hilfsverb: "haben", partizip: "repariert",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["tisch","stuhl","lampe","computer","laptop","handy","bildschirm","drucker","tastatur","fahrrad"], passtPersonen: [], passtGruende: [],
      itInf: "riparare", itFormen: ["riparo","ripari","ripara","ripariamo","riparate","riparano"], itHilf: "avere", itPart: "riparato", itFutStamm: "riparer",
      kategorien: ["alltag","arbeit"] },

    { id: "waschen", inf: "waschen", formen: ["wasche","wäschst","wäscht","waschen","wascht","waschen"], hilfsverb: "haben", partizip: "gewaschen",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["handtuch","topf","pfanne","messer","gabel","loeffel","teller","tasse","glas","hemd","hose"], passtPersonen: [], passtGruende: [],
      itInf: "lavare", itFormen: ["lavo","lavi","lava","laviamo","lavate","lavano"], itHilf: "avere", itPart: "lavato", itFutStamm: "laver",
      kategorien: ["alltag"] },

    { id: "putzen", inf: "putzen", formen: ["putze","putzt","putzt","putzen","putzt","putzen"], hilfsverb: "haben", partizip: "geputzt",
      lokal: [], objekt: "akk",
      passtOrte: {},
      passtDinge: ["tisch","fenster","tafel","bildschirm","tastatur","wohnung","schuhe"], passtPersonen: [], passtGruende: [],
      itInf: "pulire", itFormen: ["pulisco","pulisci","pulisce","puliamo","pulite","puliscono"], itHilf: "avere", itPart: "pulito", itFutStamm: "pulir",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "aufraeumen", inf: "aufräumen", formen: ["räume","räumst","räumt","räumen","räumt","räumen"], hilfsverb: "haben", partizip: "aufgeräumt", trennbar: "auf",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["zuhause","kueche","wohnzimmer","badezimmer","schlafzimmer","kinderzimmer","keller","garage","buero","flur","dachboden","balkon","terrasse","hof","garten"]},
      passtDinge: ["tisch","schrank","muell","ordner","wohnung"], passtPersonen: [], passtGruende: [],
      itInf: "riordinare", itFormen: ["riordino","riordini","riordina","riordiniamo","riordinate","riordinano"], itHilf: "avere", itPart: "riordinato", itFutStamm: "riordiner",
      kategorien: ["alltag","familie","arbeit"] },

    { id: "packen", inf: "packen", formen: ["packe","packst","packt","packen","packt","packen"], hilfsverb: "haben", partizip: "gepackt",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["korb","koffer","rucksack"], passtPersonen: [], passtGruende: [],
      itInf: "preparare", itFormen: ["preparo","prepari","prepara","prepariamo","preparate","preparano"], itHilf: "avere", itPart: "preparato", itFutStamm: "preparer",
      kategorien: ["reisen","einkaufen"] },

    { id: "buchen", inf: "buchen", formen: ["buche","buchst","bucht","buchen","bucht","buchen"], hilfsverb: "haben", partizip: "gebucht",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["urlaub"], passtPersonen: [], passtGruende: ["muede"],
      itInf: "prenotare", itFormen: ["prenoto","prenoti","prenota","prenotiamo","prenotate","prenotano"], itHilf: "avere", itPart: "prenotato", itFutStamm: "prenoter",
      kategorien: ["reisen"] },

    { id: "erklaeren", inf: "erklären", formen: ["erkläre","erklärst","erklärt","erklären","erklärt","erklären"], hilfsverb: "haben", partizip: "erklärt",
      lokal: [], objekt: "akk", personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: ["aufgabe","projekt","grammatik","uebung","loesung","fehler","regel"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: [],
      itInf: "spiegare", itFormen: ["spiego","spieghi","spiega","spieghiamo","spiegate","spiegano"], itHilf: "avere", itPart: "spiegato", itFutStamm: "spiegher",
      kategorien: ["bildung","arbeit"] },

    { id: "zeigen", inf: "zeigen", formen: ["zeige","zeigst","zeigt","zeigen","zeigt","zeigen"], hilfsverb: "haben", partizip: "gezeigt",
      lokal: [], objekt: "akk", personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: ["projekt","praesentation","pass","fahrkarte","rezept","ausweis","loesung","foto"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: [],
      itInf: "mostrare", itFormen: ["mostro","mostri","mostra","mostriamo","mostrate","mostrano"], itHilf: "avere", itPart: "mostrato", itFutStamm: "mostrer",
      kategorien: ["arbeit","reisen","gesundheit","verwaltung"] },

    { id: "ueben", inf: "üben", formen: ["übe","übst","übt","üben","übt","üben"], hilfsverb: "haben", partizip: "geübt",
      lokal: [], objekt: "akk",
      passtOrte: {},
      passtDinge: ["vokabel","grammatik","uebung","aufgabe","deutsch","italienisch","klavier"], passtPersonen: [], passtGruende: ["pruefung","unsicher","frei"],
      itInf: "ripassare", itFormen: ["ripasso","ripassi","ripassa","ripassiamo","ripassate","ripassano"], itHilf: "avere", itPart: "ripassato", itFutStamm: "ripasser",
      kategorien: ["bildung"] },

    { id: "wiederholen", inf: "wiederholen", formen: ["wiederhole","wiederholst","wiederholt","wiederholen","wiederholt","wiederholen"], hilfsverb: "haben", partizip: "wiederholt",
      lokal: [], objekt: "akk",
      passtOrte: {},
      passtDinge: ["grammatik","vokabel","uebung","gedicht","regel"], passtPersonen: [], passtGruende: ["pruefung","unsicher","frei"],
      itInf: "ripetere", itFormen: ["ripeto","ripeti","ripete","ripetiamo","ripetete","ripetono"], itHilf: "avere", itPart: "ripetuto", itFutStamm: "ripeter",
      kategorien: ["bildung"] },

    { id: "denken", inf: "denken", formen: ["denke","denkst","denkt","denken","denkt","denken"], hilfsverb: "haben", partizip: "gedacht",
      lokal: [],
      passtOrte: {},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","beschaeftigt","nervoes","unsicher"],
      itInf: "pensare", itFormen: ["penso","pensi","pensa","pensiamo","pensate","pensano"], itHilf: "avere", itPart: "pensato", itFutStamm: "penser",
      kategorien: ["alltag"] },

    { id: "glauben", inf: "glauben", formen: ["glaube","glaubst","glaubt","glauben","glaubt","glauben"], hilfsverb: "haben", partizip: "geglaubt",
      lokal: [], personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: [],
      itInf: "credere", itFormen: ["credo","credi","crede","crediamo","credete","credono"], itHilf: "avere", itPart: "creduto", itFutStamm: "creder",
      kategorien: ["alltag"] },

    { id: "wissen", inf: "wissen", formen: ["weiß","weißt","weiß","wissen","wisst","wissen"], hilfsverb: "haben", partizip: "gewusst",
      lokal: [], objekt: "akk",
      passtOrte: {},
      passtDinge: ["antwort","loesung","regel","grund","preis","termin"], passtPersonen: [], passtGruende: [],
      itInf: "sapere", itFormen: ["so","sai","sa","sappiamo","sapete","sanno"], itHilf: "avere", itPart: "saputo", itFutStamm: "sapr",
      kategorien: ["alltag","bildung"] },

    { id: "moegen", inf: "mögen", formen: ["mag","magst","mag","mögen","mögt","mögen"], hilfsverb: "haben", partizip: "gemocht",
      lokal: [], objekt: "akk", objektPflicht: true, nurBegleiter: ["bestimmt", "ohne"], itPersonFeld: "it",
      passtOrte: {},
      passtDinge: ["brot","apfel","pizza","suppe","kuchen","nudeln","kaffee","tee","wasser","wein","kaese","fleisch","fisch","gemuese","obst","salat","reis","kartoffeln","tomaten","zwiebel","milch","saft","bier","schokolade","eis","keks","broetchen","sandwich","nachtisch","joghurt","marmelade","film","musik","fussball","klavier","karten","spiel","buch","roman","gedicht","lied","zeitschrift","fahrrad","wetter","urlaub","blume","hemd","hose","jacke","schuhe","mantel","kleid","pullover","muetze","schal","handschuhe","handy","laptop","computer","app"], passtPersonen: [], passtGruende: [],
      itInf: "piacere", itFormen: ["piace","piace","piace","piace","piace","piace"], itHilf: "essere", itPart: "piaciut", itFutStamm: "piacer", itUmkehr: true,
      kategorien: ["alltag","essen","freizeit"] },

    { id: "reisen", inf: "reisen", formen: ["reise","reist","reist","reisen","reist","reisen"], hilfsverb: "sein", partizip: "gereist",
      ortPflicht: true, lokal: ["wohin","woher"],
      passtOrte: {"wohin":["italien","schweiz","oesterreich","berlin","rom","stadt","meer","berge","land"],"woher":["italien","schweiz","oesterreich","berlin","rom","stadt","meer","berge","land"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["frei","neugierig"],
      itInf: "viaggiare", itFormen: ["viaggio","viaggi","viaggia","viaggiamo","viaggiate","viaggiano"], itHilf: "avere", itPart: "viaggiato", itFutStamm: "viagger",
      kategorien: ["reisen"] },

    { id: "laufen", inf: "laufen", formen: ["laufe","läufst","läuft","laufen","lauft","laufen"], hilfsverb: "sein", partizip: "gelaufen",
      ortPflicht: true, lokal: ["wohin","woher"],
      passtOrte: {"wohin":["park","wald","see","strand","fluss","stadion","bahnhof","haltestelle","meer"],"woher":["park","wald","see","strand","fluss","stadion","bahnhof","haltestelle","meer"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["spaet","frei","gluecklich"],
      itInf: "correre", itFormen: ["corro","corri","corre","corriamo","correte","corrono"], itHilf: "essere", itPart: "cors", itFutStamm: "correr",
      kategorien: ["freizeit","gesundheit"] },

    { id: "fliegen", inf: "fliegen", formen: ["fliege","fliegst","fliegt","fliegen","fliegt","fliegen"], hilfsverb: "sein", partizip: "geflogen",
      ortPflicht: true, lokal: ["wohin","woher"],
      passtOrte: {"wohin":["italien","schweiz","oesterreich","berlin","rom","stadt","meer","flughafen"],"woher":["italien","schweiz","oesterreich","berlin","rom","stadt","meer","flughafen"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["frei","neugierig","arbeitgrund"],
      itInf: "volare", itFormen: ["volo","voli","vola","voliamo","volate","volano"], itHilf: "essere", itPart: "volat", itFutStamm: "voler",
      kategorien: ["reisen"] },

    { id: "tragen", inf: "tragen", formen: ["trage","trägst","trägt","tragen","tragt","tragen"], hilfsverb: "haben", partizip: "getragen",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["stuhl","muell","flasche","korb","hemd","hose","jacke","schuhe","mantel","kleid","pullover","muetze","schal","handschuhe","heft","laptop","ball","koffer","rucksack","verband"], passtPersonen: [], passtGruende: ["kaelte","regen","wetter"],
      itInf: "portare", itFormen: ["porto","porti","porta","portiamo","portate","portano"], itHilf: "avere", itPart: "portato", itFutStamm: "porter",
      kategorien: ["alltag"] },

    { id: "schenken", inf: "schenken", formen: ["schenke","schenkst","schenkt","schenken","schenkt","schenken"], hilfsverb: "haben", partizip: "geschenkt",
      lokal: [], objekt: "akk", objektPflicht: true, personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: ["blume","schokolade","schal"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["gluecklich"],
      itInf: "regalare", itFormen: ["regalo","regali","regala","regaliamo","regalate","regalano"], itHilf: "avere", itPart: "regalato", itFutStamm: "regaler",
      kategorien: ["alltag","familie"] },

    { id: "mitbringen", inf: "mitbringen", formen: ["bringe","bringst","bringt","bringen","bringt","bringen"], hilfsverb: "haben", partizip: "mitgebracht", trennbar: "mit",
      lokal: ["wohin"], objekt: "akk", objektPflicht: true, personFall: "dat", itPersonFeld: "itAn",
      passtOrte: {"wohin":["zuhause","buero","arbeit","schule","uni","kurs","besprechung","krankenhaus"]},
      passtDinge: ["kaese","broetchen","sandwich","spiel","roman","lied","zeitschrift","konzertkarte","regenschirm","pass","ausweis"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["gluecklich"],
      itInf: "portare", itFormen: ["porto","porti","porta","portiamo","portate","portano"], itHilf: "avere", itPart: "portato", itFutStamm: "porter",
      kategorien: ["alltag","familie"] },

    { id: "feiern", inf: "feiern", formen: ["feiere","feierst","feiert","feiern","feiert","feiern"], hilfsverb: "haben", partizip: "gefeiert",
      lokal: ["wo"],
      passtOrte: {"wo":["zuhause","garten","balkon","terrasse","wohnzimmer","restaurant","park","disko","hof","bar"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["gluecklich","pruefung","fertig"],
      itInf: "festeggiare", itFormen: ["festeggio","festeggi","festeggia","festeggiamo","festeggiate","festeggiano"], itHilf: "avere", itPart: "festeggiato", itFutStamm: "festegger",
      kategorien: ["freizeit","familie"] },

    { id: "tanzen", inf: "tanzen", formen: ["tanze","tanzt","tanzt","tanzen","tanzt","tanzen"], hilfsverb: "haben", partizip: "getanzt",
      lokal: ["wo"],
      passtOrte: {"wo":["disko","wohnzimmer","garten","park","hof","theater","konzert"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["gluecklich"],
      itInf: "ballare", itFormen: ["ballo","balli","balla","balliamo","ballate","ballano"], itHilf: "avere", itPart: "ballato", itFutStamm: "baller",
      kategorien: ["freizeit"] },

    { id: "singen", inf: "singen", formen: ["singe","singst","singt","singen","singt","singen"], hilfsverb: "haben", partizip: "gesungen",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["badezimmer","kueche","wohnzimmer","konzert","theater","schule","park"]},
      passtDinge: ["lied"], passtPersonen: [], passtGruende: ["gluecklich"],
      itInf: "cantare", itFormen: ["canto","canti","canta","cantiamo","cantate","cantano"], itHilf: "avere", itPart: "cantato", itFutStamm: "canter",
      kategorien: ["freizeit"] },

    { id: "schwimmen", inf: "schwimmen", formen: ["schwimme","schwimmst","schwimmt","schwimmen","schwimmt","schwimmen"], hilfsverb: "sein", partizip: "geschwommen",
      lokal: ["wo"],
      passtOrte: {"wo":["schwimmbad","meer","see","fluss","strand"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["hitze","frei"],
      itInf: "nuotare", itFormen: ["nuoto","nuoti","nuota","nuotiamo","nuotate","nuotano"], itHilf: "avere", itPart: "nuotato", itFutStamm: "nuoter",
      kategorien: ["freizeit","gesundheit"] },

    { id: "wandern", inf: "wandern", formen: ["wandere","wanderst","wandert","wandern","wandert","wandern"], hilfsverb: "sein", partizip: "gewandert",
      lokal: ["wo"],
      passtOrte: {"wo":["berge","wald","land","see"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["frei"],
      itInf: "camminare", itFormen: ["cammino","cammini","cammina","camminiamo","camminate","camminano"], itHilf: "avere", itPart: "camminato", itFutStamm: "camminer",
      kategorien: ["freizeit"] },

    { id: "einkaufen", inf: "einkaufen", formen: ["kaufe","kaufst","kauft","kaufen","kauft","kaufen"], hilfsverb: "haben", partizip: "eingekauft", trennbar: "ein",
      lokal: ["wo"], objekt: "akk",
      passtOrte: {"wo":["supermarkt","markt","baeckerei","metzgerei","kaufhaus","apotheke","drogerie","buchhandlung","schuhgeschaeft"]},
      passtDinge: ["brot","apfel","pizza","kuchen","kaffee","tee","wein","kaese","butter","ei","fleisch","fisch","gemuese","obst","salat","reis","kartoffeln","tomaten","zwiebel","milch","saft","bier","zucker","salz","pfeffer","oel","marmelade","joghurt","schokolade","eis","keks","broetchen","sandwich","seife","zahnbuerste","handtuch","regenschirm","blume","hemd","hose","jacke","schuhe","mantel","kleid","pullover","muetze","schal","handschuhe"], passtPersonen: [], passtGruende: ["frei"],
      itInf: "comprare", itFormen: ["compro","compri","compra","compriamo","comprate","comprano"], itHilf: "avere", itPart: "comprato", itFutStamm: "comprer",
      kategorien: ["einkaufen","alltag"] },

    { id: "telefonieren", inf: "telefonieren", formen: ["telefoniere","telefonierst","telefoniert","telefonieren","telefoniert","telefonieren"], hilfsverb: "haben", partizip: "telefoniert",
      lokal: ["wo"], personFall: "dat", personPraep: "mit", itPersonFeld: "itMit",
      passtOrte: {"wo":["zuhause","buero","kueche","garten","balkon","terrasse","wohnzimmer","schlafzimmer","bahnhof","flughafen","park","hotel"]},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","nachbarin","lehrer","vermieter"], passtGruende: ["krank","arbeitgrund","termingrund"],
      itInf: "telefonare", itFormen: ["telefono","telefoni","telefona","telefoniamo","telefonate","telefonano"], itHilf: "avere", itPart: "telefonato", itFutStamm: "telefoner",
      kategorien: ["alltag","arbeit"] },

    { id: "anrufen", inf: "anrufen", formen: ["rufe","rufst","ruft","rufen","ruft","rufen"], hilfsverb: "haben", partizip: "angerufen", trennbar: "an",
      lokal: ["wo"], personFall: "akk", itPersonFeld: "it",
      passtOrte: {"wo":["zuhause","buero","kueche","garten","balkon","terrasse","wohnzimmer","schlafzimmer","bahnhof","flughafen","park","hotel"]},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","nachbarin","lehrer","vermieter"], passtGruende: ["krank","arbeitgrund","termingrund"],
      itInf: "chiamare", itFormen: ["chiamo","chiami","chiama","chiamiamo","chiamate","chiamano"], itHilf: "avere", itPart: "chiamato", itFutStamm: "chiamer",
      kategorien: ["alltag","arbeit"] },

    { id: "schicken", inf: "schicken", formen: ["schicke","schickst","schickt","schicken","schickt","schicken"], hilfsverb: "haben", partizip: "geschickt",
      lokal: ["wo"], objekt: "akk", objektPflicht: true, personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {"wo":["buero","zuhause","post","cafe"]},
      passtDinge: ["brief","nachricht","mail","foto","geld","rechnung","vertrag","formular","bericht","protokoll","praesentation","aufgabe","kuendigung","gedicht","lied","blume","quittung","antrag","buch"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","nachbarin","lehrer","vermieter"], passtGruende: ["termingrund","arbeitgrund","zeitmangel"],
      itInf: "mandare", itFormen: ["mando","mandi","manda","mandiamo","mandate","mandano"], itHilf: "avere", itPart: "mandato", itFutStamm: "mander",
      kategorien: ["alltag","arbeit"] },

    { id: "lachen", inf: "lachen", formen: ["lache","lachst","lacht","lachen","lacht","lachen"], hilfsverb: "haben", partizip: "gelacht",
      lokal: ["wo"],
      passtOrte: {"wo":["zuhause","wohnzimmer","kueche","buero","park","kino","cafe","restaurant","schule","disko"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["gluecklich","nervoes"],
      itInf: "ridere", itFormen: ["rido","ridi","ride","ridiamo","ridete","ridono"], itHilf: "avere", itPart: "riso", itFutStamm: "rider",
      kategorien: ["alltag","freizeit"] },

    { id: "weinen", inf: "weinen", formen: ["weine","weinst","weint","weinen","weint","weinen"], hilfsverb: "haben", partizip: "geweint",
      lokal: ["wo"],
      passtOrte: {"wo":["zuhause","schlafzimmer","badezimmer","wohnzimmer","kino","buero","schule"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["traurig","muede","krank","allein","nervoes","unsicher"],
      itInf: "piangere", itFormen: ["piango","piangi","piange","piangiamo","piangete","piangono"], itHilf: "avere", itPart: "pianto", itFutStamm: "pianger",
      kategorien: ["alltag"] },

    { id: "bleiben", inf: "bleiben", formen: ["bleibe","bleibst","bleibt","bleiben","bleibt","bleiben"], hilfsverb: "sein", partizip: "geblieben",
      lokal: ["wo"], ortPflicht: true,
      passtOrte: {"wo":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","badezimmer","supermarkt","markt","baeckerei","apotheke","kaufhaus","buero","arbeit","besprechung","werkstatt","baustelle","schule","uni","bibliothek","kurs","meer","berge","see","park","kino","theater","museum","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","italien","berlin","rom","stadt","land","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","metzgerei","buchhandlung","drogerie","schuhgeschaeft","fabrik","labor","lager","filiale","kinderzimmer","kindergarten","kita","spielplatz","elternhaus","wald","strand","fluss","zoo","disko","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","faehre","autobahn","schweiz","oesterreich","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","fitnessstudio","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["krank","krankheit","erkaeltet","muede","beschaeftigt","traurig","nervoes","unsicher","wetter","regen","hitze","kaelte","schnee","sturm","stau","streik","umzug","termingrund","pruefung","baustelle"],
      itInf: "rimanere", itFormen: ["rimango","rimani","rimane","rimaniamo","rimanete","rimangono"], itHilf: "essere", itPart: "rimast", itFutStamm: "rimarr",
      kategorien: ["alltag","reisen"] },

    { id: "sitzen", inf: "sitzen", formen: ["sitze","sitzt","sitzt","sitzen","sitzt","sitzen"], hilfsverb: "haben", partizip: "gesessen",
      lokal: ["wo"], ortPflicht: true,
      passtOrte: {"wo":["zuhause","kueche","garten","balkon","bett","keller","wohnzimmer","buero","besprechung","schule","bibliothek","kurs","park","kino","theater","schwimmbad","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","terrasse","hof","spielplatz","wald","strand","fluss","zoo","imbiss","eisdiele","pizzeria","bar","weinkeller","hafen","haltestelle","faehre","klassenzimmer","hoersaal","sprachschule","seminarraum","schulhof","praxis","notaufnahme","physiotherapie","sauna","rathaus","botschaft","polizei","gericht","auslaenderbehoerde"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","wetter","regen","hitze","traurig","allein","erkaeltet","fertig","frei","kaelte","krankheit"],
      itZustand: "sedut", itInf: "sedersi", itFormen: ["mi siedo","ti siedi","si siede","ci sediamo","vi sedete","si siedono"], itHilf: "essere", itPart: "sedut", itFutStamm: "sieder",
      kategorien: ["alltag","freizeit"] },

    { id: "stehen", inf: "stehen", formen: ["stehe","stehst","steht","stehen","steht","stehen"], hilfsverb: "haben", partizip: "gestanden",
      lokal: ["wo"], ortPflicht: true,
      passtOrte: {"wo":["kueche","garten","balkon","badezimmer","wohnzimmer","keller","supermarkt","buero","arbeit","besprechung","werkstatt","baustelle","schule","bibliothek","meer","berge","see","park","museum","stadion","konzert","restaurant","cafe","kantine","bahnhof","flughafen","hotel","arzt","krankenhaus","zahnarzt","amt","bank","post","flur","schlafzimmer","terrasse","garage","hof","dachboden","kinderzimmer","spielplatz","wald","strand","fluss","zoo","disko","imbiss","eisdiele","bar","hafen","haltestelle","faehre","autobahn","klassenzimmer","gericht"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["unterwegs","stau"],
      itZustand: "in piedi", itZustandFest: true, itInf: "stare", itFormen: ["sto","stai","sta","stiamo","state","stanno"], itHilf: "essere", itPart: "stat", itFutStamm: "star",
      kategorien: ["alltag","arbeit"] },

    { id: "liegen", inf: "liegen", formen: ["liege","liegst","liegt","liegen","liegt","liegen"], hilfsverb: "haben", partizip: "gelegen",
      lokal: ["wo"], ortPflicht: true,
      passtOrte: {"wo":["bett","strand","wohnzimmer","krankenhaus","meer"]},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","erkaeltet","fertig","traurig","hitze"],
      itZustand: "sdraiat", itInf: "stare", itFormen: ["sto","stai","sta","stiamo","state","stanno"], itHilf: "essere", itPart: "stat", itFutStamm: "star",
      kategorien: ["alltag","gesundheit","freizeit"] },

    { id: "aufstehen", inf: "aufstehen", formen: ["stehe","stehst","steht","stehen","steht","stehen"], hilfsverb: "sein", partizip: "aufgestanden", trennbar: "auf",
      lokal: [],
      passtOrte: {},
      passtDinge: [], passtPersonen: [], passtGruende: ["spaet","termingrund","arbeitgrund","puenktlich","beschaeftigt","zeitmangel"],
      itInf: "alzarsi", itFormen: ["mi alzo","ti alzi","si alza","ci alziamo","vi alzate","si alzano"], itHilf: "essere", itReflexiv: true, itPart: "alzat", itFutStamm: "alzer",
      kategorien: ["alltag"] },

    { id: "anfangen", inf: "anfangen", formen: ["fange","fängst","fängt","fangen","fangt","fangen"], hilfsverb: "haben", partizip: "angefangen", trennbar: "an",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["buch","projekt","aufgabe","uebung","pruefung","film","roman","spiel","praesentation","urlaub","bericht","formular","anmeldung"], passtPersonen: [], passtGruende: ["termingrund","spaet","neugierig","frei"],
      itInf: "cominciare", itFormen: ["comincio","cominci","comincia","cominciamo","cominciate","cominciano"], itHilf: "avere", itPart: "cominciato", itFutStamm: "comincer",
      kategorien: ["alltag","arbeit","bildung"] },

    { id: "aufhoeren", inf: "aufhören", formen: ["höre","hörst","hört","hören","hört","hören"], hilfsverb: "haben", partizip: "aufgehört", trennbar: "auf",
      lokal: [],
      passtOrte: {},
      passtDinge: [], passtPersonen: [], passtGruende: ["muede","krank","erkaeltet","hungrig","durstig","spaet","wetter","regen","hitze","kaelte","fertig","traurig","zeitmangel","laerm","termingrund","krankheit","pruefung","umzug","streik"],
      itInf: "smettere", itFormen: ["smetto","smetti","smette","smettiamo","smettete","smettono"], itHilf: "avere", itPart: "smesso", itFutStamm: "smetter",
      kategorien: ["alltag","arbeit"] },

    { id: "steigen", inf: "steigen", formen: ["steige","steigst","steigt","steigen","steigt","steigen"], hilfsverb: "sein", partizip: "gestiegen",
      ortPflicht: true, lokal: ["wohin"],
      passtOrte: {"wohin":["berge","dachboden"]},
      passtDinge: [], passtPersonen: [], passtGruende: [],
      itInf: "salire", itFormen: ["salgo","sali","sale","saliamo","salite","salgono"], itHilf: "essere", itPart: "salit", itFutStamm: "salir",
      kategorien: ["freizeit","reisen"] },

    { id: "besuchen", inf: "besuchen", formen: ["besuche","besuchst","besucht","besuchen","besucht","besuchen"], hilfsverb: "haben", partizip: "besucht",
      lokal: ["wo"], personFall: "akk", personPflicht: true, itPersonFeld: "it",
      passtOrte: {"wo":["zoo","stadt","italien","berlin","rom","schweiz","oesterreich","museum","schule","uni","konzert","botschaft","rathaus","fabrik","park","stadion","berge","see","meer","strand","elternhaus"]},
      passtDinge: [], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","nachbarin","lehrer"], passtGruende: ["traurig","frei","allein","unterwegs","neugierig","krankheit"],
      itInf: "visitare", itFormen: ["visito","visiti","visita","visitiamo","visitate","visitano"], itHilf: "avere", itPart: "visitato", itFutStamm: "visiter",
      kategorien: ["familie","freizeit","reisen"] },

    { id: "erzaehlen", inf: "erzählen", formen: ["erzähle","erzählst","erzählt","erzählen","erzählt","erzählen"], hilfsverb: "haben", partizip: "erzählt",
      lokal: [], objekt: "akk", personFall: "dat", personPflicht: true, itPersonFeld: "itAn",
      passtOrte: {},
      passtDinge: ["roman","gedicht","idee","problem","grund","meinung","plan","wunsch"], passtPersonen: ["freund","freundin","eltern","bruder","schwester","kollege","nachbar","chef","lehrerin","kind","onkel","tante","oma","opa","cousin","cousine","sohn","tochter","mann","frau","grosseltern","kinder","freunde","kollegen","arzt","verkaeufer","kellner","nachbarin","lehrer","vermieter"], passtGruende: ["gluecklich","traurig","frei","nervoes"],
      itInf: "raccontare", itFormen: ["racconto","racconti","racconta","raccontiamo","raccontate","raccontano"], itHilf: "avere", itPart: "raccontato", itFutStamm: "racconter",
      kategorien: ["alltag","familie","freizeit"] },

    { id: "vorbereiten", inf: "vorbereiten", formen: ["bereite","bereitest","bereitet","bereiten","bereitet","bereiten"], hilfsverb: "haben", partizip: "vorbereitet", trennbar: "vor",
      lokal: [], objekt: "akk", objektPflicht: true,
      passtOrte: {},
      passtDinge: ["fruehstueck","pruefung","praesentation","projekt","aufgabe","urlaub","koffer","rucksack","formular","antrag","vertrag","bericht","protokoll","anmeldung","uebung","termin","plan"], passtPersonen: [], passtGruende: ["termingrund","pruefung","nervoes","unsicher"],
      itInf: "preparare", itFormen: ["preparo","prepari","prepara","prepariamo","preparate","preparano"], itHilf: "avere", itPart: "preparato", itFutStamm: "preparer",
      kategorien: ["alltag","arbeit","bildung","reisen"] },
  ];

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
    if (!level || !eintrag || !eintrag.level) return true;
    return NIVEAU_REIHE.indexOf(eintrag.level) <= NIVEAU_REIHE.indexOf(level);
  }

  /* ===================================================================
     6. DER SATZBAU
     ===================================================================
     wahl = { subjekt, verb, objekt, objektBegleiter, objektAdjektiv,
              person, ort, ortRolle, zeit, grund, art,
              zeitform: "praesens"|"perfekt"|"futur",
              satzart: "aussage"|"frage"|"nebensatz",
              vorfeld: "subjekt"|"zeit"|"ort"  (was vorn steht) }
     =================================================================== */
  const FORM_INDEX = { "1sg": 0, "2sg": 1, "3sgm": 2, "3sgf": 2, "1pl": 3, "2pl": 4, "3pl": 5 };
  const IT_FUTUR_ENDUNG = ["ò", "ai", "à", "emo", "ete", "anno"];

  function itPartizip(stamm, hilf, subjekt) {
    if (hilf === "avere") return stamm;
    if (subjekt.id === "3sgm") return stamm + "o";
    if (subjekt.id === "3sgf") return stamm + "a";
    if (subjekt.zahl === "sg") return stamm + "o/" + stamm + "a";
    return stamm + "i/" + stamm + "e";
  }
  function itHilfsform(hilf, subjekt) {
    const i = FORM_INDEX[subjekt.id];
    return (hilf === "essere" ? ["sono", "sei", "è", "siamo", "siete", "sono"] : ["ho", "hai", "ha", "abbiamo", "avete", "hanno"])[i];
  }

  /* Der kausale Baustein. Zwei Bauarten, beide mit richtiger Person:
       weil ich müde bin        (Zustand, Adjektiv passt zur Person)
       wegen des Wetters        (Genitiv — deshalb kann das Modul ihn) */
  function grundText(grund, subjekt, zeitform, sprache) {
    if (!grund || grund.art === "keiner") return "";
    const i = FORM_INDEX[subjekt.id];
    if (grund.art === "zustand") {
      if (sprache === "it") {
        const kopula = zeitform === "perfekt" ? GRUND_IT_WAR[i] : GRUND_IT_SEIN[i];
        const adj = itAdjektiv(grund, subjekt.itGenus || "m", subjekt.zahl === "pl");
        return "perché " + kopula + " " + adj;
      }
      const kopula = zeitform === "perfekt" ? GRUND_WAR[i] : GRUND_SEIN[i];
      return "weil " + subjekt.de + " " + grund.adjektiv + " " + kopula;
    }
    // wegen + Genitiv
    if (sprache === "it") return grund.it;
    const eintrag = { nomen: grund.nomen, genus: grund.genus, genitiv: grund.genitiv };
    return "wegen " + nominalgruppe(eintrag, "gen", "bestimmt");
  }

  function bauSatz(wahl) {
    const subjekt = wahl.subjekt;
    let verb = wahl.verb;
    const i = FORM_INDEX[subjekt.id];
    const zeitform = wahl.zeitform || "praesens";
    const satzart = wahl.satzart || "aussage";
    const ortRolle = wahl.ortRolle || (verb.lokal && verb.lokal[0]) || "wo";

    /* --- Die Bausteine des Mittelfelds --------------------------------
       Deutsche Reihenfolge: temporal, kausal, modal, lokal (te-ka-mo-lo).
       Das Objekt steht bei einem Nomen nach der Zeitangabe. Genau diese
       Ordnung ist der Unterschied zwischen einem Satz, der klingt, und
       einem, der stolpert. */
    const deTeile = [];
    const itTeile = [];

    // Ein Verb nimmt entweder ein Ding oder eine Person als Objekt.
    const nurEines = verb.objekt === "akk" && verb.personFall === "akk" && !verb.personPraep;
    const zeigeObjekt = wahl.objekt && !(nurEines && wahl.person);

    /* Zwei Verneinungen in einem Satz („Ich esse nie kein Brot“) heben
       sich auf. Steht schon eine Verneinung in der Zeitangabe, bekommt
       das Objekt seinen gewöhnlichen Begleiter. */
    const schonVerneint = (wahl.zeit && (wahl.zeit.itBrauchtNon || wahl.zeit.nichtVerneinbar))
      || (wahl.art && wahl.art.verneinend);
    if (schonVerneint && wahl.objektBegleiter === "kein" && wahl.objekt) {
      wahl = Object.assign({}, wahl, {
        objektBegleiter: ["ohne", "unbestimmt", "bestimmt"].find((b) => (wahl.objekt.begleiter || []).includes(b)) || "bestimmt",
      });
    }
    const zeitVorne = wahl.vorfeld === "zeit" && wahl.zeit && wahl.zeit.de;
    const ortVorne = wahl.vorfeld === "ort" && wahl.ort;

    if (wahl.zeit && wahl.zeit.de && !zeitVorne) deTeile.push({ t: wahl.zeit.de, rolle: "wann" });
    /* „Ich trinke nie Tee, weil ich neugierig bin“ — ein Grund, der für
       die Handlung spricht, passt nicht zu ihrer Verneinung. */
    if (schonVerneint || wahl.objektBegleiter === "kein") {
      if (wahl.grund && wahl.grund.art === "zustand") wahl = Object.assign({}, wahl, { grund: null });
    }
    /* „Ich bestelle ein Brötchen, weil ich durstig bin“ — der Grund muss
       zum Objekt passen. Was nicht passt, fällt weg. */
    if (wahl.grund && wahl.grund.nurDingRollen) {
      const rollen = (wahl.objekt && wahl.objekt.rollen) || [];
      if (!wahl.grund.nurDingRollen.some((r) => rollen.includes(r))) {
        wahl = Object.assign({}, wahl, { grund: null });
      }
    }
    // Derselbe Gedanke zweimal — als Art und als Grund — wird einmal gesagt.
    if (wahl.grund && wahl.art && wahl.grund.id === wahl.art.id) {
      wahl = Object.assign({}, wahl, { grund: null });
    }
    const grundDe = grundText(wahl.grund, subjekt, zeitform, "de");
    // Ein weil-Satz kann nicht mitten im Mittelfeld stehen — er kommt hinten
    // als eigener Nebensatz. „wegen des Wetters“ dagegen steht im Mittelfeld.
    const grundIstNebensatz = wahl.grund && wahl.grund.art === "zustand";
    if (grundDe && !grundIstNebensatz) deTeile.push({ t: grundDe, rolle: "warum" });
    const artNachObjekt = Boolean(wahl.art && wahl.art.nachObjekt);
    if (wahl.art && wahl.art.de && !artNachObjekt) deTeile.push({ t: wahl.art.de, rolle: "wie" });
    /* Stehen Dativ und Akkusativ beide als Nomen im Satz, kommt der
       Dativ zuerst: „Ich gebe meinem Bruder ein Buch.“ — nicht umgekehrt. */
    const zeigePerson = Boolean(wahl.person) && Boolean(verb.personFall);
    const personZuerst = zeigePerson && verb.personFall === "dat" && !verb.personPraep;
    function personTeil() {
      const fall = verb.personFall || "akk";
      /* Manche Personen gehören einem („mein Bruder“), andere nicht
         („der Arzt“, „der Kellner“). Das steht am Eintrag und muss zur
         italienischen Form passen. */
      const kern = nominalgruppe(wahl.person, fall, wahl.person.begleiter || "possessiv", wahl.personAdjektiv, subjekt);
      if (!verb.personPraep) return { t: kern, rolle: "wen" };
      /* Auch hier verschmilzt die Präposition mit dem Artikel:
         „an das Kind“ heißt „ans Kind“. */
      const teile = kern.split(" ");
      const zusammen = verschmelze(verb.personPraep, teile[0]);
      const text = zusammen === verb.personPraep + " " + teile[0]
        ? verb.personPraep + " " + kern
        : zusammen + (teile.length > 1 ? " " + teile.slice(1).join(" ") : "");
      return { t: text, rolle: "wen" };
    }
    if (personZuerst) deTeile.push(personTeil());
    if (zeigeObjekt) {
      const begl = wahl.objektBegleiter || (wahl.objekt.begleiter && wahl.objekt.begleiter[0]) || "bestimmt";
      deTeile.push({ t: nominalgruppe(wahl.objekt, verb.objekt || "akk", begl, wahl.objektAdjektiv, subjekt), rolle: "was" });
    }
    if (zeigePerson && !personZuerst) {
      deTeile.push(personTeil());
    }
    if (wahl.art && wahl.art.de && artNachObjekt) deTeile.push({ t: wahl.art.de, rolle: "wie" });
    if (wahl.ort && !ortVorne) deTeile.push({ t: ortsform(wahl.ort, ortRolle), rolle: ortRolle });

    /* --- Italienisch --------------------------------------------------
       Zeitpunkte stehen vorn, Häufigkeiten und Art beim Verb, alles
       andere folgt dem Verb. */
    const itZeitVorne = wahl.zeit && wahl.zeit.it && wahl.zeit.art === "zeitpunkt";
    const itZeitBeimVerb = wahl.zeit && wahl.zeit.it && wahl.zeit.art === "haeufigkeit";
    if (zeigeObjekt) {
      /* Nach „piacere“ steht das Ding im Italienischen immer mit dem
         bestimmten Artikel: „mi piace il formaggio“. */
      const begl = verb.itUmkehr ? "bestimmt"
        : (wahl.objektBegleiter || (wahl.objekt.begleiter && wahl.objekt.begleiter[0]) || "bestimmt");
      /* Geschlecht, Zahl und Artikel richten sich nach dem ITALIENISCHEN
         Wort, nicht nach dem deutschen — „la spesa“ ist weiblich, „der
         Einkauf“ männlich. Das erledigt itDingform vollständig. */
      const t = itDingform(wahl.objekt, begl, wahl.objektAdjektiv, subjekt);
      itTeile.push({ t, rolle: "was" });
    }
    if (zeigePerson) itTeile.push({ t: itPersonform(wahl.person, subjekt, verb.itPersonFeld || "it"), rolle: "wen" });
    if (wahl.ort) itTeile.push({ t: itOrtsform(wahl.ort, ortRolle), rolle: ortRolle });
    if (wahl.zeit && wahl.zeit.it && !itZeitVorne && !itZeitBeimVerb) itTeile.push({ t: wahl.zeit.it, rolle: "wann" });
    const grundIt = grundText(wahl.grund, subjekt, zeitform, "it");

    // --- Verbformen ---
    // Bei „woher“ wechselt das italienische Verb: andare → venire.
    const nutzeWoherVerb = ortRolle === "woher" && verb.itWoherFormen;
    /* Manche Objekte verlangen im Italienischen ein anderes Verb:
       Fußball spielt man (giocare), Klavier spielt man auch — aber auf
       Italienisch heißt das suonare. */
    if (verb.itVerbNachDing && wahl.objekt && verb.itVerbNachDing[wahl.objekt.id]) {
      verb = Object.assign({}, verb, verb.itVerbNachDing[wahl.objekt.id]);
    }
    /* Auch im Deutschen wechselt das Verb bei „woher“: Man geht irgendwohin,
       aber man KOMMT von irgendwoher. „vom Arzt gegangen“ sagt niemand. */
    const deWoher = ortRolle === "woher" && verb.deWoherFormen;
    const dFormen = deWoher ? verb.deWoherFormen : verb.formen;
    const dInf = deWoher ? verb.deWoherInf : verb.inf;
    const dPart = deWoher ? verb.deWoherPartizip : verb.partizip;
    const dHilf = deWoher ? "sein" : verb.hilfsverb;
    let deFinit, dePartizip = "", deInfinitiv = "";
    if (zeitform === "perfekt") {
      deFinit = (dHilf === "sein" ? ["bin", "bist", "ist", "sind", "seid", "sind"] : ["habe", "hast", "hat", "haben", "habt", "haben"])[i];
      dePartizip = dPart;
    } else if (zeitform === "futur") {
      deFinit = ["werde", "wirst", "wird", "werden", "werdet", "werden"][i];
      deInfinitiv = dInf;
    } else {
      deFinit = dFormen[i];
    }
    /* Trennbare Verben: im Präsens und im Hauptsatz wandert die Vorsilbe
       ans Ende („ich räume mein Zimmer auf“), im Nebensatz wächst sie
       wieder ans Verb („weil ich mein Zimmer aufräume“). Im Perfekt und
       im Futur steckt sie ohnehin schon im Partizip beziehungsweise im
       Infinitiv. */
    const trennbar = zeitform === "praesens" && !deWoher ? (verb.trennbar || "") : "";

    let itVerb;
    const itHilf = nutzeWoherVerb ? "essere" : verb.itHilf;
    if (verb.itZustand) {
      /* Ein Zustand wird im Italienischen mit essere und einem
         angeglichenen Partizip ausgedrückt, in der Vergangenheit im
         Imperfetto: sono seduto, ero seduto, sarò seduto. */
      const form = verb.itZustandFest ? verb.itZustand : itPartizip(verb.itZustand, "essere", subjekt);
      const kopula = zeitform === "perfekt" ? itHilfsform("essere", subjekt) + " " + itPartizip("stat", "essere", subjekt)
        : zeitform === "futur" ? "sar" + IT_FUTUR_ENDUNG[i]
        : GRUND_IT_SEIN[i];
      itVerb = kopula + " " + form;
    } else if (zeitform === "perfekt") {
      itVerb = itHilfsform(itHilf, subjekt) + " " + itPartizip(nutzeWoherVerb ? verb.itWoherPart : verb.itPart, itHilf, subjekt);
    } else if (zeitform === "futur") {
      itVerb = (nutzeWoherVerb ? verb.itWoherFutStamm : verb.itFutStamm) + IT_FUTUR_ENDUNG[i];
    } else {
      itVerb = (nutzeWoherVerb ? verb.itWoherFormen : verb.itFormen)[i];
    }
    /* Reflexive italienische Verben tragen ihr Pronomen vor dem Verb.
       Im Präsens steckt es schon in den Formen, in Perfekt und Futur
       muss es davor: „mi sono alzato“, „mi alzerò“. */
    if (verb.itReflexiv && zeitform !== "praesens") {
      itVerb = ["mi", "ti", "si", "ci", "vi", "si"][i] + " " + itVerb;
    }
    /* Feste Ergänzungen wie „bisogno di“ gehören unmittelbar vor das
       Objekt — sonst schiebt sich ein Adverb dazwischen: „ho bisogno di
       spesso un libro“. Sie werden deshalb erst später eingesetzt. */

    // --- Deutsch zusammensetzen ---
    const vorfeld = zeitVorne ? { t: wahl.zeit.de, rolle: "wann" }
      : ortVorne ? { t: ortsform(wahl.ort, ortRolle), rolle: ortRolle }
      : { t: subjekt.de, rolle: "wer" };
    const subjektTeil = { t: subjekt.de, rolle: "wer" };

    let de = [];
    let hinweis = "";
    if (satzart === "frage") {
      de = [{ t: deFinit, rolle: "verb" }, subjektTeil, ...deTeile];
      if (trennbar) de.push({ t: trennbar, rolle: "verb" });
      if (dePartizip) de.push({ t: dePartizip, rolle: "verb" });
      if (deInfinitiv) de.push({ t: deInfinitiv, rolle: "verb" });
      hinweis = trennbar
        ? "In der Ja-Nein-Frage steht das gebeugte Verb ganz vorn — die Vorsilbe bleibt am Satzende."
        : "In der Ja-Nein-Frage steht das gebeugte Verb ganz vorn.";
    } else if (satzart === "nebensatz") {
      de = [{ t: "weil", rolle: "konj" }, subjektTeil, ...deTeile];
      if (dePartizip) de.push({ t: dePartizip, rolle: "verb" });
      if (deInfinitiv) de.push({ t: deInfinitiv, rolle: "verb" });
      de.push({ t: trennbar + deFinit, rolle: "verb" });
      hinweis = trennbar
        ? "Im Nebensatz rutscht das Verb ans Ende — und die Vorsilbe wächst wieder daran fest."
        : "Im Nebensatz mit „weil“ rutscht das gebeugte Verb ganz ans Ende.";
    } else {
      // Aussage: das Vorfeld, dann das Verb, dann der Rest.
      de = [vorfeld, { t: deFinit, rolle: "verb" }];
      if (vorfeld.rolle !== "wer") de.push(subjektTeil);
      de = de.concat(deTeile);
      if (trennbar) de.push({ t: trennbar, rolle: "verb" });
      if (dePartizip) de.push({ t: dePartizip, rolle: "verb" });
      if (deInfinitiv) de.push({ t: deInfinitiv, rolle: "verb" });
      hinweis = trennbar
        ? "Trennbare Verben teilen sich: das gebeugte Verb steht an zweiter Stelle, die Vorsilbe ganz am Ende."
        : vorfeld.rolle === "wer"
        ? "In der Aussage steht das gebeugte Verb an zweiter Stelle."
        : "Steht etwas anderes vorn, rutscht das Subjekt hinter das Verb — das Verb bleibt an zweiter Stelle.";
    }
    // Ein weil-Satz als Grund hängt hinten dran.
    if (grundDe && grundIstNebensatz && satzart !== "nebensatz") de.push({ t: ", " + grundDe, rolle: "warum" });

    // --- Italienisch zusammensetzen ---
    const it = [];
    if (itZeitVorne) it.push({ t: wahl.zeit.it, rolle: "wann" });
    if (wahl.pronomen) it.push({ t: subjekt.it, rolle: "wer" });
    /* Das italienische „non“ steht vor dem Verb — sowohl bei der Verneinung
       eines Objekts („non mangio pane“) als auch bei „mai“, das ohne „non“
       gar nicht stehen kann („non ci sono mai stato“). */
    const verneint = (zeigeObjekt && wahl.objektBegleiter === "kein")
      || (wahl.zeit && wahl.zeit.itBrauchtNon)
      || Boolean(wahl.art && wahl.art.verneinend);

    /* „mögen“ dreht sich im Italienischen um: nicht ich mag den Kaffee,
       sondern der Kaffee gefällt mir. Das Verb richtet sich deshalb nach
       dem OBJEKT, und die Person steht als Pronomen davor. Ohne diesen
       Sonderfall käme „amo il caffè“ heraus — das heißt „ich liebe“. */
    if (verb.itUmkehr && zeigeObjekt) {
      const objPl = wahl.objekt.itPlural !== undefined ? wahl.objekt.itPlural : Boolean(wahl.objekt.plural);
      const objGen = wahl.objekt.itGenus || wahl.objekt.genus || "m";
      const pron = { "1sg": "mi", "2sg": "ti", "3sgm": "gli", "3sgf": "le", "1pl": "ci", "2pl": "vi", "3pl": "a loro" }[subjekt.id];
      let kern;
      if (zeitform === "perfekt") {
        kern = (objPl ? "sono" : "è") + " piaciut" + (objPl ? (objGen === "f" ? "e" : "i") : (objGen === "f" ? "a" : "o"));
      } else if (zeitform === "futur") {
        kern = objPl ? "piaceranno" : "piacerà";
      } else {
        kern = objPl ? "piacciono" : "piace";
      }
      // „Non mi piace“ — das non steht ganz vorn, vor dem Pronomen.
      if (verneint) it.push({ t: "non", rolle: "verb" });
      it.push({ t: pron, rolle: "wer" });
      it.push({ t: kern, rolle: "verb" });
      if (wahl.art && wahl.art.it) it.push({ t: wahl.art.it, rolle: "wie" });
      itTeile.forEach((x) => it.push(x));
      /* Ist der Satz selbst ein weil-Satz, fällt der kausale Baustein im
       Deutschen weg — dann darf er im Italienischen nicht auftauchen. */
    if (grundIt && !(grundIstNebensatz && satzart === "nebensatz")) it.push({ t: grundIt, rolle: "warum" });
      return fertig(de, it, satzart, hinweis, zeitform, ortRolle);
    }

    if (verneint) it.push({ t: "non", rolle: "verb" });
    /* Im passato prossimo rutscht die Häufigkeitsangabe zwischen
       Hilfsverb und Partizip: „ho sempre abitato“, nicht „ho abitato
       sempre“. */
    if (itZeitBeimVerb && (zeitform === "perfekt" || verb.itZustand) && itVerb.includes(" ")) {
      const luecke = itVerb.indexOf(" ");
      it.push({ t: itVerb.slice(0, luecke), rolle: "verb" });
      it.push({ t: wahl.zeit.it, rolle: "wann" });
      it.push({ t: itVerb.slice(luecke + 1), rolle: "verb" });
    } else {
      it.push({ t: itVerb, rolle: "verb" });
      if (itZeitBeimVerb) it.push({ t: wahl.zeit.it, rolle: "wann" });
    }
    if (wahl.art && wahl.art.it) {
      let artIt = wahl.art.it;
      if (wahl.art.itAngleichen) {
        if (subjekt.id === "3sgf") artIt = "da sola";
        else if (subjekt.zahl === "pl") artIt = "da soli/e";
        else if (subjekt.id !== "3sgm") artIt = "da solo/a";
      }
      it.push({ t: artIt, rolle: "wie" });
    }
    if (verb.itZusatz) it.push({ t: verb.itZusatz, rolle: "verb" });
    itTeile.forEach((x) => it.push(x));
    /* Ist der Satz selbst ein weil-Satz, fällt der kausale Baustein im
       Deutschen weg — dann darf er im Italienischen nicht auftauchen. */
    if (grundIt && !(grundIstNebensatz && satzart === "nebensatz")) it.push({ t: grundIt, rolle: "warum" });

    return fertig(de, it, satzart, hinweis, zeitform, ortRolle);
  }

  /* Aus den Bausteinen wird der fertige Satz: zusammenfügen, Leerzeichen
     vor Satzzeichen entfernen, groß anfangen, Schlusszeichen setzen. */
  function fertig(de, it, satzart, hinweis, zeitform, ortRolle) {
    const deText = de.map((x) => x.t).filter(Boolean).join(" ").replace(/\s+([,.])/g, "$1").replace(/\s+/g, " ").trim();
    const itText = itVerschmelzung(it.map((x) => x.t).filter(Boolean).join(" ").replace(/\s+([,.])/g, "$1").replace(/\s+/g, " ").trim());
    const schluss = satzart === "frage" ? "?" : satzart === "nebensatz" ? " …" : ".";
    return {
      de: deText.charAt(0).toUpperCase() + deText.slice(1) + schluss,
      it: itText.charAt(0).toUpperCase() + itText.slice(1) + schluss,
      deTeile: de, itTeile: it, hinweis, zeitform, satzart, ortRolle,
    };
  }

  /* ===================================================================
     7. AUSWAHL — was zu was passt
     =================================================================== */
  function verbenFuer(kategorie, level) {
    return VERBEN.filter((v) => !kategorie || (v.kategorien || []).includes(kategorie));
  }
  function ortRollenFuer(verb) {
    return (verb && verb.lokal) || [];
  }
  function orteFuer(kategorie, level, verb, rolle, objekt) {
    const erlaubt = verb && verb.passtOrte ? verb.passtOrte[rolle || (verb.lokal && verb.lokal[0])] : null;
    const liste = ORTE.filter((o) => {
      if (erlaubt && !erlaubt.includes(o.id)) return false;
      if (kategorie && o.kategorie !== kategorie) return false;
      /* Ein Fachgeschäft führt nur sein Sortiment — sonst entstünde
         „Ich kaufe Äpfel in der Buchhandlung“. */
      if (objekt && o.verkauft && !o.verkauft.includes(objekt.id)) return false;
      return passtZumNiveau(o, level);
    });
    /* Braucht das Verb zwingend eine Ortsangabe, darf der Kategorie- oder
       Niveaufilter die Liste nicht leerräumen — sonst entsteht „Ihr wohnt
       sonntags.“, und das ist kein Satz. */
    if (!liste.length && verb && verb.ortPflicht && erlaubt) {
      return ORTE.filter((o) => erlaubt.includes(o.id) && (!objekt || !o.verkauft || o.verkauft.includes(objekt.id)));
    }
    return liste;
  }
  function dingeFuer(verb, kategorie, level) {
    const liste = DINGE.filter((d) => {
      if (verb && verb.passtDinge && !verb.passtDinge.includes(d.id)) return false;
      if (kategorie && d.kategorie !== kategorie) return false;
      return passtZumNiveau(d, level);
    });
    // Ein Pflichtobjekt darf am Kategoriefilter nicht scheitern.
    if (!liste.length && verb && verb.objektPflicht && verb.passtDinge) {
      return DINGE.filter((d) => verb.passtDinge.includes(d.id));
    }
    return liste;
  }
  function personenFuer(kategorie, level, verb) {
    const liste = PERSONEN.filter((p) => {
      if (verb && verb.passtPersonen && !verb.passtPersonen.includes(p.id)) return false;
      if (kategorie && p.kategorie !== kategorie) return false;
      return passtZumNiveau(p, level);
    });
    // Eine Pflichtperson darf am Kategoriefilter nicht scheitern.
    if (!liste.length && verb && verb.personPflicht && verb.passtPersonen) {
      return PERSONEN.filter((p) => verb.passtPersonen.includes(p.id));
    }
    return liste;
  }
  function zeitenFuer(zeitform, level) {
    return ZEITEN.filter((z) => {
      if (z.nurVergangenheit && zeitform !== "perfekt") return false;
      if (z.nurZukunft && zeitform === "perfekt") return false;
      if (z.nichtZukunft && zeitform === "futur") return false;
      if (z.nurGegenwart && zeitform !== "praesens") return false;
      return passtZumNiveau(z, level);
    });
  }
  function gruendeFuer(verb, level) {
    return GRUENDE.filter((g) => {
      if (g.art === "keiner") return true;
      if (verb && verb.passtGruende && !verb.passtGruende.includes(g.id)) return false;
      return passtZumNiveau(g, level);
    });
  }
  function artenFuer(verb, level, subjekt, objekt) {
    return ARTEN.filter((a) => {
      if (a.passtVerben && verb && !a.passtVerben.includes(verb.id)) return false;
      if (a.nurPlural && subjekt && subjekt.zahl !== "pl") return false;
      // „auf Deutsch Deutsch sprechen“ — solche Dopplungen fallen hier weg.
      if (a.nichtMitDingen && objekt && a.nichtMitDingen.includes(objekt.id)) return false;
      return passtZumNiveau(a, level);
    });
  }
  function adjektiveFuer(eintrag, level) {
    if (!eintrag || !eintrag.adjektive) return [];
    return eintrag.adjektive.map((id) => ADJ_NACH_ID[id]).filter((a) => a && passtZumNiveau(a, level));
  }
  function begleiterFuer(ding, verb) {
    if (!ding) return [];
    /* Manche Verben lassen nur bestimmte Begleiter zu: „mögen“ steht im
       Italienischen immer mit Artikel („mi piace il caffè“), also auch
       im Deutschen. */
    if (verb && verb.nurBegleiter) {
      const erlaubt = (ding.begleiter || []).filter((b) => verb.nurBegleiter.includes(b));
      if (erlaubt.length) return erlaubt.map((b) => Object.assign({ id: b }, BEGLEITER_NAMEN[b]));
    }
    return (ding.begleiter || ["bestimmt"]).map((id) => ({ id, ...BEGLEITER_NAMEN[id] }));
  }

  // Wie viele sinnvolle Sätze eine Kategorie hergibt.
  function anzahlBeispiele(kategorie, level) {
    let summe = 0;
    verbenFuer(kategorie, level).forEach((v) => {
      (v.lokal && v.lokal.length ? v.lokal : [null]).forEach((rolle) => {
        const orte = rolle ? orteFuer(kategorie, level, v, rolle).length + 1 : 1;
        const dinge = v.objekt ? dingeFuer(v, null, level).length + 1 : 1;
        const personen = v.personFall ? personenFuer(null, level, v).length + 1 : 1;
        const gruende = gruendeFuer(v, level).length;
        summe += orte * dinge * personen * gruende;
      });
    });
    return summe * zeitenFuer("praesens", level).length;
  }
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
      ["Obgleich die technischen Haushaltshilfen stetig ausgefeilter werden, scheint die gefühlte Arbeitsbelastung kaum abzunehmen.","Sebbene gli elettrodomestici diventino sempre più sofisticati, il carico di lavoro percepito sembra diminuire ben poco.","C2","nebensatz"],
      ["Ich decke den Tisch.","Apparecchio la tavola.","A1","aussage"],
      ["Ich fege den Boden.","Scopo il pavimento.","A1","aussage"],
      ["Er duscht am Morgen.","Lui fa la doccia al mattino.","A1","aussage"],
      ["Ich putze mir die Zähne.","Mi lavo i denti.","A1","aussage"],
      ["Wir öffnen das Fenster.","Apriamo la finestra.","A1","aussage"],
      ["Sie macht das Licht an.","Lei accende la luce.","A1","aussage"],
      ["Ich falte die Wäsche.","Piego il bucato.","A1","aussage"],
      ["Der Hund schläft im Wohnzimmer.","Il cane dorme in soggiorno.","A1","aussage"],
      ["Ich füttere die Katze.","Do da mangiare al gatto.","A1","aussage"],
      ["Wir räumen den Tisch ab.","Sparecchiamo la tavola.","A1","aussage"],
      ["Ich lese abends die Zeitung.","La sera leggo il giornale.","A1","aussage"],
      ["Ich schließe die Tür.","Chiudo la porta.","A1","aussage"],
      ["Wir hören Radio beim Kochen.","Ascoltiamo la radio mentre cuciniamo.","A1","aussage"],
      ["Meine Schwester spült die Gläser.","Mia sorella lava i bicchieri.","A1","aussage"],
      ["Ich lade mein Handy auf.","Carico il telefono.","A1","aussage"],
      ["Machst du das Licht aus?","Spegni la luce?","A1","frage"],
      ["Wäschst du dir die Hände?","Ti lavi le mani?","A1","frage"],
      ["Wo sind die Handtücher?","Dove sono gli asciugamani?","A1","frage"],
      ["Kochst du heute Abend?","Cucini stasera?","A1","frage"],
      ["Ich föhne meine Haare, bevor ich gehe.","Mi asciugo i capelli prima di uscire.","A1","nebensatz"],
      ["Ich trinke Tee, weil mir kalt ist.","Bevo il tè perché ho freddo.","A1","nebensatz"],
      ["Ich putze das Bad, wenn ich Zeit habe.","Pulisco il bagno quando ho tempo.","A1","nebensatz"],
      ["Ich mache Hausaufgaben, bevor ich fernsehe.","Faccio i compiti prima di guardare la TV.","A1","nebensatz"],
      ["Ich habe heute Morgen das Bett neu bezogen.","Stamattina ho rifatto il letto con lenzuola pulite.","A2","aussage"],
      ["Wir haben den Rasen im Garten gemäht.","Abbiamo tagliato l'erba del giardino.","A2","aussage"],
      ["Ich habe das Regal endlich zusammengebaut.","Ho finalmente montato lo scaffale.","A2","aussage"],
      ["Meine Mutter hat die Fenster im ganzen Haus geputzt.","Mia madre ha pulito le finestre di tutta la casa.","A2","aussage"],
      ["Ich habe den Wasserhahn in der Küche repariert.","Ho riparato il rubinetto in cucina.","A2","aussage"],
      ["Wir haben die Möbel im Wohnzimmer umgestellt.","Abbiamo spostato i mobili in soggiorno.","A2","aussage"],
      ["Ich habe die schmutzige Wäsche sortiert.","Ho separato il bucato sporco.","A2","aussage"],
      ["Er hat den Boden im Flur gewischt.","Lui ha lavato per terra nel corridoio.","A2","aussage"],
      ["Ich habe den Hund vor der Arbeit ausgeführt.","Ho portato fuori il cane prima di andare al lavoro.","A2","aussage"],
      ["Wir haben das Bad neu gestrichen.","Abbiamo ridipinto il bagno.","A2","aussage"],
      ["Ich habe die Vorhänge gewaschen.","Ho lavato le tende.","A2","aussage"],
      ["Meine Oma hat uns ein leckeres Abendessen gekocht.","Nostra nonna ci ha cucinato una cena deliziosa.","A2","aussage"],
      ["Ich habe den Kühlschrank ausgeräumt und geputzt.","Ho svuotato e pulito il frigorifero.","A2","aussage"],
      ["Wir haben endlich die alten Kartons weggebracht.","Abbiamo finalmente portato via le vecchie scatole.","A2","aussage"],
      ["Ich habe vergessen, die Pflanzen zu gießen.","Ho dimenticato di innaffiare le piante.","A2","aussage"],
      ["Hast du den Techniker schon angerufen?","Hai già chiamato il tecnico?","A2","frage"],
      ["Wann kommt der Klempner vorbei?","Quando passa l'idraulico?","A2","frage"],
      ["Kannst du die Wäsche aufhängen?","Puoi stendere il bucato?","A2","frage"],
      ["Habt ihr die Möbel schon zusammengebaut?","Avete già montato i mobili?","A2","frage"],
      ["Ich rufe den Elektriker an, weil die Lampe nicht funktioniert.","Chiamo l'elettricista perché la lampada non funziona.","A2","nebensatz"],
      ["Wir putzen das Haus, bevor die Gäste kommen.","Puliamo la casa prima che arrivino gli ospiti.","A2","nebensatz"],
      ["Ich denke, dass wir bald einen neuen Staubsauger brauchen.","Penso che presto ci servirà un nuovo aspirapolvere.","A2","nebensatz"],
      ["Wenn die Sonne scheint, hänge ich die Wäsche draußen auf.","Quando c'è il sole, stendo il bucato fuori.","A2","nebensatz"],
      ["Da meine Mitbewohnerin ausgezogen ist, muss ich jetzt alle Hausarbeiten allein erledigen.","Poiché la mia coinquilina è andata via, ora devo sbrigare da sola tutte le faccende domestiche.","B1","aussage"],
      ["Ich würde gern einen Putzplan aufstellen, damit jeder weiß, was er zu tun hat.","Vorrei stilare un piano delle pulizie, in modo che ognuno sappia cosa deve fare.","B1","aussage"],
      ["Als ich klein war, musste ich jeden Samstag mein Zimmer aufräumen.","Da piccolo dovevo mettere in ordine la mia stanza ogni sabato.","B1","aussage"],
      ["Ich könnte mir vorstellen, einen Roboter-Staubsauger anzuschaffen.","Potrei immaginare di comprare un robot aspirapolvere.","B1","aussage"],
      ["Statt die Wäsche selbst zu waschen, bringe ich sie manchmal in die Reinigung.","Invece di lavare io stesso il bucato, a volte lo porto in lavanderia.","B1","aussage"],
      ["Ich habe herausgefunden, dass Schimmel im Bad meistens von schlechter Lüftung kommt.","Ho scoperto che la muffa in bagno di solito dipende da una cattiva areazione.","B1","aussage"],
      ["Meine Mitbewohner und ich haben uns darauf geeinigt, abwechselnd zu kochen.","Io e i miei coinquilini ci siamo accordati per cucinare a turno.","B1","aussage"],
      ["Anstatt neue Möbel zu kaufen, haben wir die alten einfach restauriert.","Invece di comprare mobili nuovi, abbiamo semplicemente restaurato quelli vecchi.","B1","aussage"],
      ["Ich hätte nie gedacht, dass Fensterputzen so viel Zeit kostet.","Non avrei mai pensato che pulire le finestre richiedesse così tanto tempo.","B1","aussage"],
      ["Um Energie zu sparen, hängen wir die Wäsche jetzt draußen auf, statt sie zu trocknen.","Per risparmiare energia, ora stendiamo il bucato fuori invece di asciugarlo in asciugatrice.","B1","aussage"],
      ["Die Nachbarn haben sich über den Baulärm während der Renovierung beschwert.","I vicini si sono lamentati del rumore dei lavori durante la ristrutturazione.","B1","aussage"],
      ["Ich habe den Eindruck, dass sich der Schmutz in dieser Wohnung von selbst vermehrt.","Ho l'impressione che lo sporco in questo appartamento si moltiplichi da solo.","B1","aussage"],
      ["Bevor wir umgezogen sind, hatten wir viel weniger Platz zum Aufräumen.","Prima di traslocare, avevamo molto meno spazio da mettere in ordine.","B1","aussage"],
      ["Es macht mir nichts aus, das Bad zu putzen, solange jemand anders kocht.","Non mi dispiace pulire il bagno, purché qualcun altro cucini.","B1","aussage"],
      ["Ich lasse die Fenster morgens immer kurz offen, damit frische Luft reinkommt.","Al mattino lascio sempre un po' aperte le finestre, in modo che entri aria fresca.","B1","aussage"],
      ["Wie oft putzt ihr eigentlich das Badezimmer bei euch zu Hause?","Ogni quanto pulite in realtà il bagno a casa vostra?","B1","frage"],
      ["Findest du nicht auch, dass Hausarbeit fair aufgeteilt werden sollte?","Non pensi anche tu che le faccende domestiche dovrebbero essere divise in modo equo?","B1","frage"],
      ["Würdest du mir zeigen, wie man die Waschmaschine entkalkt?","Mi mostreresti come si decalcifica la lavatrice?","B1","frage"],
      ["Wüsstest du, an wen ich mich wegen des Schimmels wenden sollte?","Sapresti dirmi a chi dovrei rivolgermi per la muffa?","B1","frage"],
      ["Damit die Wohnung ordentlich bleibt, räumen wir jeden Abend kurz auf.","Affinché l'appartamento resti in ordine, ogni sera facciamo un piccolo riordino.","B1","nebensatz"],
      ["Solange die Heizung nicht repariert ist, tragen wir dicke Pullover zu Hause.","Finché il riscaldamento non è riparato, a casa indossiamo maglioni pesanti.","B1","nebensatz"],
      ["Ich frage mich, ob es sich lohnt, eine Putzhilfe einzustellen.","Mi chiedo se valga la pena assumere una donna delle pulizie.","B1","nebensatz"],
      ["Kaum hatte ich die Küche geputzt, kam mein Sohn mit schmutzigen Schuhen herein.","Avevo appena pulito la cucina che mio figlio è entrato con le scarpe sporche.","B1","nebensatz"],
      ["Immer mehr Haushalte setzen auf smarte Geräte, um Energie und Zeit zu sparen.","Sempre più famiglie puntano su dispositivi intelligenti per risparmiare energia e tempo.","B2","aussage"],
      ["Dass mein Bruder nie abwäscht, sorgt bei uns regelmäßig für Streit.","Il fatto che mio fratello non lavi mai i piatti provoca regolarmente litigi tra noi.","B2","aussage"],
      ["Die Reparatur der Heizungsanlage wurde auf unbestimmte Zeit verschoben.","La riparazione dell'impianto di riscaldamento è stata rinviata a data da destinarsi.","B2","aussage"],
      ["Statt die Wohnung selbst zu putzen, greifen immer mehr Berufstätige auf professionelle Reinigungsdienste zurück.","Invece di pulire da soli l'appartamento, sempre più persone che lavorano ricorrono a servizi di pulizia professionali.","B2","aussage"],
      ["Der ständige Lärm der Baustelle nebenan macht ein geregeltes Familienleben derzeit fast unmöglich.","Il rumore continuo del cantiere accanto rende quasi impossibile, al momento, una vita familiare regolare.","B2","aussage"],
      ["Obwohl wir uns die Hausarbeit theoretisch teilen, bleibt in der Praxis meist an mir hängen, den Müll rauszubringen.","Sebbene in teoria ci dividiamo le faccende domestiche, in pratica tocca quasi sempre a me portare fuori la spazzatura.","B2","aussage"],
      ["Angesichts der hohen Mietpreise überlegen viele junge Leute, wieder bei den Eltern einzuziehen.","Di fronte agli alti prezzi degli affitti, molti giovani stanno pensando di tornare a vivere dai genitori.","B2","aussage"],
      ["Die Entrümpelung der elterlichen Wohnung erwies sich als weitaus emotionalere Angelegenheit, als wir angenommen hatten.","Lo sgombero dell'appartamento dei genitori si è rivelato una faccenda molto più emotiva di quanto avessimo immaginato.","B2","aussage"],
      ["Dank der neuen Isolierung sind unsere Heizkosten trotz der gestiegenen Preise nahezu gleich geblieben.","Grazie al nuovo isolamento, le nostre spese di riscaldamento sono rimaste quasi invariate nonostante l'aumento dei prezzi.","B2","aussage"],
      ["Es wird zunehmend als selbstverständlich angesehen, dass sich beide Partner die Kinderbetreuung und den Haushalt teilen.","Si dà sempre più per scontato che entrambi i partner si dividano la cura dei figli e le faccende domestiche.","B2","aussage"],
      ["Die Vermieterin besteht darauf, dass sämtliche Schäden vor dem Auszug behoben werden.","La proprietaria insiste che tutti i danni vengano riparati prima del trasloco.","B2","aussage"],
      ["Allerdings lässt sich nicht jede Aufgabe im Haushalt gleich gern erledigen, weshalb wir uns abwechseln.","Non tutti i compiti domestici, tuttavia, si svolgono con lo stesso piacere, motivo per cui ci alterniamo.","B2","aussage"],
      ["Der Trend zum minimalistischen Wohnen hat auch unseren Umgang mit alten Gegenständen verändert.","La tendenza verso un'abitazione minimalista ha cambiato anche il nostro rapporto con gli oggetti vecchi.","B2","aussage"],
      ["Dennoch bleibt die Frage offen, wer für die entstandenen Wasserschäden aufkommen muss.","Resta comunque aperta la questione di chi debba farsi carico dei danni causati dall'acqua.","B2","aussage"],
      ["Die energetische Bewertung des Hauses fiel schlechter aus, als der Vorbesitzer behauptet hatte.","La valutazione energetica della casa è risultata peggiore di quanto avesse sostenuto il precedente proprietario.","B2","aussage"],
      ["Ist es nicht widersprüchlich, dass wir immer mehr Zeit sparen wollen, aber immer weniger Zeit für den Haushalt haben?","Non è contraddittorio che vogliamo risparmiare sempre più tempo, ma abbiamo sempre meno tempo per la casa?","B2","frage"],
      ["Sollte die Hausarbeit angesichts ihres Umfangs nicht endlich finanziell anerkannt werden?","Non si dovrebbe finalmente riconoscere economicamente il lavoro domestico, visto quanto è impegnativo?","B2","frage"],
      ["Wie ließe sich verhindern, dass Konflikte über die Ordnung in der WG eskalieren?","Come si potrebbe evitare che i conflitti sull'ordine nell'appartamento condiviso degenerino?","B2","frage"],
      ["Woran erkennt man eigentlich, ob sich eine Renovierung finanziell überhaupt lohnt?","Da cosa si capisce, in realtà, se una ristrutturazione conviene davvero dal punto di vista finanziario?","B2","frage"],
      ["Während sich meine Generation eher für Ordnung interessiert, legen jüngere Mitbewohner mehr Wert auf Gemütlichkeit.","Mentre la mia generazione si interessa più all'ordine, i coinquilini più giovani danno più valore all'accoglienza.","B2","nebensatz"],
      ["Sofern die Versicherung den Schaden übernimmt, lassen wir die Wände sofort neu streichen.","Purché l'assicurazione copra il danno, faremo ridipingere subito le pareti.","B2","nebensatz"],
      ["Da die Nebenkosten stetig steigen, überlegen wir, in eine kleinere Wohnung zu ziehen.","Poiché le spese accessorie continuano ad aumentare, stiamo pensando di trasferirci in un appartamento più piccolo.","B2","nebensatz"],
      ["Vorausgesetzt, die Reparatur kostet nicht mehr als geplant, bleibt unser übriges Budget unangetastet.","A condizione che la riparazione non costi più del previsto, il resto del nostro budget resterà intatto.","B2","nebensatz"],
      ["Wer Beruf und Haushalt unter einen Hut bringen will, muss zwangsläufig Kompromisse eingehen.","Chi vuole conciliare lavoro e faccende domestiche deve necessariamente scendere a compromessi.","C1","aussage"],
      ["Es fällt mir zunehmend schwer, dem Gerede vom Wohnen als Statussymbol etwas abzugewinnen.","Mi risulta sempre più difficile trovare qualcosa di sensato nel discorso sulla casa come status symbol.","C1","aussage"],
      ["Die vielzitierte mentale Last, die mit der Organisation eines Haushalts einhergeht, wird gesellschaftlich noch immer unterschätzt.","Il tanto citato carico mentale legato all'organizzazione di una casa è ancora sottovalutato dalla società.","C1","aussage"],
      ["Nicht selten entpuppt sich das Ausmisten alter Sachen als eine Art Therapie im Kleinen.","Non di rado, liberarsi delle vecchie cose si rivela una sorta di piccola terapia.","C1","aussage"],
      ["Dass Ordnung das halbe Leben sei, mag abgedroschen klingen, trifft im Alltag jedoch erstaunlich oft zu.","Che l'ordine sia mezza vita può sembrare un luogo comune, ma nella vita di tutti i giorni si rivela sorprendentemente vero.","C1","aussage"],
      ["Wer sich einmal an ein aufgeräumtes Zuhause gewöhnt hat, tut sich schwer, zu alten Gewohnheiten zurückzukehren.","Chi si è abituato una volta a una casa in ordine fatica a tornare alle vecchie abitudini.","C1","aussage"],
      ["Die Weitergabe hauswirtschaftlicher Kenntnisse von einer Generation zur nächsten verliert zusehends an Selbstverständlichkeit.","La trasmissione delle competenze domestiche da una generazione all'altra sta perdendo sempre più la sua naturalezza.","C1","aussage"],
      ["Es steht außer Frage, dass ein gut organisierter Haushalt Zeit und Nerven spart.","È fuori discussione che una casa ben organizzata faccia risparmiare tempo e nervi.","C1","aussage"],
      ["Vielen fällt es schwer zuzugeben, dass Unordnung sie tatsächlich belastet, statt sie kalt zu lassen.","A molti risulta difficile ammettere che il disordine li pesa davvero, invece di lasciarli indifferenti.","C1","aussage"],
      ["Die zunehmende Automatisierung häuslicher Tätigkeiten wirft die Frage auf, was von der klassischen Hausarbeit überhaupt bleibt.","La crescente automazione delle attività domestiche solleva la questione di cosa resti effettivamente delle faccende domestiche tradizionali.","C1","aussage"],
      ["Selbst wohlmeinende Partnerschaften scheitern gelegentlich an der schlichten Frage, wer den Müll runterbringt.","Persino i rapporti di coppia più ben intenzionati falliscono a volte per la semplice questione di chi porta giù la spazzatura.","C1","aussage"],
      ["Man macht sich die Hände schmutzig, wenn man wirklich etwas im Haus bewegen will, im wörtlichen wie im übertragenen Sinn.","Ci si sporca le mani se si vuole davvero cambiare qualcosa in casa, in senso sia letterale che figurato.","C1","aussage"],
      ["Der vermeintliche Luxus eines aufgeräumten Zuhauses erweist sich bei genauerem Hinsehen als Ergebnis harter, unsichtbarer Arbeit.","Il presunto lusso di una casa in ordine si rivela, a uno sguardo più attento, il risultato di un duro lavoro invisibile.","C1","aussage"],
      ["Ausgerechnet die kleinen, wiederkehrenden Pflichten sind es, die den größten Widerstand hervorrufen.","Sono proprio i piccoli compiti ricorrenti a suscitare la maggiore resistenza.","C1","aussage"],
      ["Wer im Haushalt stets alles allein regelt, riskiert früher oder später auszubrennen.","Chi in casa gestisce sempre tutto da solo rischia, prima o poi, di andare in burnout.","C1","aussage"],
      ["Woher rührt eigentlich die verbreitete Annahme, Unordnung sei ein Zeichen von Kreativität?","Da dove nasce, in realtà, la diffusa convinzione che il disordine sia segno di creatività?","C1","frage"],
      ["Ließe sich die unsichtbare mentale Last der Haushaltsorganisation überhaupt objektiv messen?","Si potrebbe mai misurare oggettivamente il carico mentale invisibile legato all'organizzazione della casa?","C1","frage"],
      ["Inwiefern prägt die Wohnung, in der man aufwächst, das spätere Verhältnis zu Ordnung und Sauberkeit?","In che misura la casa in cui si cresce plasma il rapporto futuro con l'ordine e la pulizia?","C1","frage"],
      ["Wie viel Unordnung verträgt ein Zusammenleben, bevor sie zur echten Belastung wird?","Quanto disordine può sopportare una convivenza prima che diventi un vero peso?","C1","frage"],
      ["So gern man sich auch vom Perfektionismus im Haushalt verabschieden möchte, so hartnäckig hält er sich in vielen Köpfen.","Per quanto si desideri congedarsi dal perfezionismo domestico, questo resiste ostinatamente in molte teste.","C1","nebensatz"],
      ["Indem wir kleine Aufgaben sofort erledigen, verhindern wir, dass sich am Wochenende alles auftürmt.","Sbrigando subito i piccoli compiti, evitiamo che tutto si accumuli nel fine settimana.","C1","nebensatz"],
      ["Anstatt sich über verteilte Aufgaben zu streiten, sollte man klären, welche Erwartungen überhaupt dahinterstecken.","Invece di litigare sulla ripartizione dei compiti, si dovrebbe chiarire quali aspettative ci siano realmente dietro.","C1","nebensatz"],
      ["Je öfter man kleine Reparaturen selbst übernimmt, desto vertrauter wird einem das eigene Zuhause.","Quanto più spesso ci si occupa da soli delle piccole riparazioni, tanto più familiare diventa la propria casa.","C1","nebensatz"],
      ["Dass ausgerechnet die vermeintlich fortschrittlichsten Haushalte am meisten Putzhilfen beschäftigen, sagt einiges über unser Verständnis von Emanzipation.","Il fatto che siano proprio le famiglie apparentemente più progressiste ad assumere il maggior numero di collaboratrici domestiche la dice lunga sulla nostra idea di emancipazione.","C2","aussage"],
      ["Die Vorstellung, häusliche Ordnung sei ein rein privates Anliegen, blendet geflissentlich aus, wessen unbezahlte Arbeit sie erst ermöglicht.","L'idea che l'ordine domestico sia una questione puramente privata ignora abilmente di chi sia il lavoro non retribuito che lo rende possibile.","C2","aussage"],
      ["Kaum ein Ritual entlarvt die Diskrepanz zwischen gutem Vorsatz und gelebter Realität so gnadenlos wie der alljährliche Frühjahrsputz.","Difficilmente un rituale smaschera con altrettanta spietatezza il divario tra buoni propositi e realtà vissuta quanto le pulizie di primavera annuali.","C2","aussage"],
      ["Es hat etwas grotesk Ironisches, dass wir Geräte kaufen, die uns Zeit sparen sollen, und am Ende mehr Zeit mit deren Wartung verbringen.","C'è qualcosa di grottescamente ironico nel fatto che compriamo apparecchi pensati per farci risparmiare tempo e finiamo per passare più tempo a mantenerli.","C2","aussage"],
      ["Die Fotografien makellos aufgeräumter Wohnungen in sozialen Medien verraten meist mehr über die Inszenierung als über den tatsächlichen Alltag ihrer Bewohner.","Le fotografie di appartamenti impeccabilmente ordinati sui social media rivelano spesso più sulla messa in scena che sulla vita quotidiana reale di chi ci abita.","C2","aussage"],
      ["Man könnte fast meinen, der Staub kehre absichtlich stets an genau jenen Stellen zurück, die man zuletzt geputzt hat.","Si potrebbe quasi pensare che la polvere torni apposta proprio nei punti che si sono appena puliti.","C2","aussage"],
      ["Die stille Übereinkunft, wonach Sauberkeit über die Kompetenz einer Person als Gastgeberin urteilt, hält sich hartnäckiger, als es die Aufklärung vermuten ließe.","Il tacito accordo secondo cui la pulizia giudica la competenza di una persona come padrona di casa persiste più tenacemente di quanto l'illuminismo lascerebbe supporre.","C2","aussage"],
      ["Wer die Wohnungsauflösung der eigenen Großeltern miterlebt hat, weiß, wie viel Lebensgeschichte sich in vermeintlich wertlosen Gegenständen verbirgt.","Chi ha vissuto lo sgombero della casa dei propri nonni sa quanta storia di vita si nasconda in oggetti apparentemente privi di valore.","C2","aussage"],
      ["Die App-basierte Vermittlung von Putzkräften hat den Zugang zwar vereinfacht, an den strukturellen Bedingungen der Arbeit jedoch wenig geändert.","L'intermediazione tramite app per il personale delle pulizie ha semplificato l'accesso al servizio, ma ha cambiato ben poco le condizioni strutturali di quel lavoro.","C2","aussage"],
      ["Die Sehnsucht nach dem sprichwörtlichen Hausrat der Großmutter offenbart sich bei näherem Hinsehen oft als Flucht vor der eigenen Reizüberflutung.","La nostalgia per il proverbiale corredo domestico della nonna si rivela spesso, a uno sguardo più attento, una fuga dal proprio sovraccarico sensoriale.","C2","aussage"],
      ["So gewissenhaft manche Menschen ihre Wohnung hüten, so sorglos behandeln sie mitunter die Räume, die ihnen nicht gehören.","Per quanto scrupolosamente alcune persone custodiscano la propria casa, altrettanto sconsideratamente trattano talvolta gli spazi che non appartengono a loro.","C2","aussage"],
      ["Der vermeintlich unpolitische Akt des Saubermachens erweist sich bei genauem Hinsehen als zutiefst von Klasse und Geschlecht geprägt.","Il presunto atto apolitico di pulire si rivela, a uno sguardo attento, profondamente segnato da classe sociale e genere.","C2","aussage"],
      ["Es grenzt an Selbstbetrug, den eigenen Ordnungssinn als moralische Überlegenheit misszuverstehen.","Rasenta l'autoinganno scambiare il proprio senso dell'ordine per una superiorità morale.","C2","aussage"],
      ["Manch einer räumt lieber wortlos hinter anderen her, als das leidige Gespräch über Zuständigkeiten überhaupt erst zu suchen.","C'è chi preferisce rimettere in ordine dietro agli altri in silenzio piuttosto che affrontare la fastidiosa conversazione sulle responsabilità.","C2","aussage"],
      ["Die Entropie, so scheint es manchmal, hat sich ausgerechnet in unserer Abstellkammer ein Denkmal gesetzt.","L'entropia, verrebbe quasi da pensare, si è eretta un monumento proprio nel nostro ripostiglio.","C2","aussage"],
      ["Ist die vielbeschworene Achtsamkeit beim Aufräumen nicht letztlich bloß ein weiterer Anspruch, dem man genügen soll?","La tanto decantata consapevolezza nel riordinare non è, in fondo, solo un'altra esigenza a cui bisogna corrispondere?","C2","frage"],
      ["Wie kommt es, dass ausgerechnet jene, die am lautesten über Minimalismus predigen, oft in den größten Wohnungen leben?","Come mai proprio chi predica più forte il minimalismo vive spesso negli appartamenti più grandi?","C2","frage"],
      ["Verrät nicht gerade der Umgang mit dem eigenen Kram am meisten darüber, wie es um unser Verhältnis zur Vergänglichkeit steht?","Non è forse proprio il modo in cui trattiamo le nostre cianfrusaglie a rivelare di più sul nostro rapporto con la caducità?","C2","frage"],
      ["Wäre es nicht an der Zeit, den romantisierenden Blick auf vermeintlich einfachere Zeiten kritisch zu hinterfragen?","Non sarebbe ora di mettere criticamente in discussione lo sguardo romantico su tempi presuntamente più semplici?","C2","frage"],
      ["So sehr man dem Diktat der Perfektion im eigenen Zuhause auch zu entkommen versucht, so unweigerlich holt es einen bei der nächsten Einladung wieder ein.","Per quanto si tenti di sfuggire al dettato della perfezione nella propria casa, esso torna inesorabilmente a farsi sentire al prossimo invito.","C2","nebensatz"],
      ["Während die einen im Ausmisten eine befreiende Geste sehen, entlarven andere darin nur eine neue Spielart des Konsumzwangs.","Mentre alcuni vedono nel liberarsi delle cose un gesto liberatorio, altri vi smascherano soltanto una nuova forma di compulsione al consumo.","C2","nebensatz"],
      ["Kaum hat man sich mit dem Zustand der eigenen vier Wände abgefunden, meldet sich das schlechte Gewissen mit erneuter Wucht zurück.","Ci si è appena rassegnati allo stato della propria casa, che la cattiva coscienza torna a farsi sentire con rinnovata forza.","C2","nebensatz"],
      ["Sooft man sich vornimmt, dem Chaos ein für alle Mal Herr zu werden, so gewiss kehrt es binnen weniger Tage zurück.","Per quante volte ci si proponga di avere una volta per tutte ragione del caos, esso torna con altrettanta certezza nel giro di pochi giorni.","C2","nebensatz"],
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
      ["Obgleich die Vergleichsportale stetig ausgefeilter werden, scheint die gefühlte Unsicherheit beim Kauf kaum abzunehmen.","Sebbene i portali di comparazione diventino sempre più sofisticati, l'incertezza percepita al momento dell'acquisto sembra diminuire ben poco.","C2","nebensatz"],
      ["Ich kaufe Gemüse.","Compro la verdura.","A1","aussage"],
      ["Wir brauchen Zucker und Salz.","Ci servono zucchero e sale.","A1","aussage"],
      ["Der Fisch ist heute frisch.","Oggi il pesce è fresco.","A1","aussage"],
      ["Ich nehme zwei Kilo Kartoffeln.","Prendo due chili di patate.","A1","aussage"],
      ["Das Hemd ist mir zu teuer.","La camicia è troppo cara per me.","A1","aussage"],
      ["Ich mag diese Farbe.","Mi piace questo colore.","A1","aussage"],
      ["Der Verkäufer ist sehr nett.","Il commesso è molto gentile.","A1","aussage"],
      ["Das Geschäft öffnet um acht Uhr.","Il negozio apre alle otto.","A1","aussage"],
      ["Ich lege die Sachen in den Wagen.","Metto la roba nel carrello.","A1","aussage"],
      ["Die Schuhe sind mir zu groß.","Le scarpe mi stanno troppo grandi.","A1","aussage"],
      ["Ich probiere die Jacke an.","Provo la giacca.","A1","aussage"],
      ["Hier verkaufen sie auch Blumen.","Qui vendono anche i fiori.","A1","aussage"],
      ["Ich stehe an der Kasse in der Schlange.","Sto in fila alla cassa.","A1","aussage"],
      ["Ich brauche eine Quittung.","Mi serve una ricevuta.","A1","aussage"],
      ["Die Bananen sind noch grün.","Le banane sono ancora verdi.","A1","aussage"],
      ["Gibt es heute einen Rabatt?","Oggi c'è uno sconto?","A1","frage"],
      ["Kann ich das Hemd anprobieren?","Posso provare la camicia?","A1","frage"],
      ["Wie viel kosten die Kartoffeln?","Quanto costano le patate?","A1","frage"],
      ["Habt ihr auch kleine Größen?","Avete anche taglie piccole?","A1","frage"],
      ["Ich nehme den Wagen, weil ich viel kaufe.","Prendo il carrello perché compro tanta roba.","A1","nebensatz"],
      ["Ich warte, bis die Kasse frei ist.","Aspetto finché la cassa è libera.","A1","nebensatz"],
      ["Ich kaufe die Jacke, wenn sie mir passt.","Compro la giacca se mi sta bene.","A1","nebensatz"],
      ["Ich frage den Verkäufer, weil ich die Größe nicht finde.","Chiedo al commesso perché non trovo la taglia.","A1","nebensatz"],
      ["Ich habe mir einen neuen Rucksack gekauft.","Mi sono comprato uno zaino nuovo.","A2","aussage"],
      ["Ich habe drei Hosen anprobiert, aber keine hat gepasst.","Ho provato tre pantaloni, ma nessuno mi stava bene.","A2","aussage"],
      ["Der Laden hatte diese Woche eine besondere Aktion.","Questa settimana il negozio aveva una promozione speciale.","A2","aussage"],
      ["Ich habe mein Portemonnaie zu Hause vergessen.","Ho dimenticato il portafoglio a casa.","A2","aussage"],
      ["Wir haben die Preise in zwei Geschäften verglichen.","Abbiamo confrontato i prezzi in due negozi.","A2","aussage"],
      ["Ich habe meiner Freundin ein Geburtstagsgeschenk gekauft.","Ho comprato un regalo di compleanno per la mia amica.","A2","aussage"],
      ["Die Kassiererin hat mir zu wenig Wechselgeld gegeben.","La cassiera mi ha dato troppo poco resto.","A2","aussage"],
      ["Ich habe mich für die Kundenkarte angemeldet.","Mi sono iscritto alla carta fedeltà.","A2","aussage"],
      ["Der Artikel war leider schon ausverkauft.","L'articolo purtroppo era già esaurito.","A2","aussage"],
      ["Ich habe online die falsche Größe bestellt.","Ho ordinato la taglia sbagliata online.","A2","aussage"],
      ["Wir haben die Einkäufe in Taschen gepackt.","Abbiamo messo la spesa nei sacchetti.","A2","aussage"],
      ["Ich habe diesen Monat viel zu viel Geld ausgegeben.","Questo mese ho speso davvero troppi soldi.","A2","aussage"],
      ["Die Bäckerei hatte am Nachmittag kein Brot mehr.","Nel pomeriggio la panetteria non aveva più pane.","A2","aussage"],
      ["Ich habe den Ausverkauf genutzt und zwei Pullover gekauft.","Ho approfittato dei saldi e ho comprato due maglioni.","A2","aussage"],
      ["Wir haben lange nach einem Parkplatz vor dem Einkaufszentrum gesucht.","Abbiamo cercato a lungo un parcheggio davanti al centro commerciale.","A2","aussage"],
      ["Hast du den Beleg noch, falls wir umtauschen müssen?","Hai ancora lo scontrino, nel caso dovessimo cambiarlo?","A2","frage"],
      ["Wo bekommt man hier gute Second-Hand-Kleidung?","Dove si trovano qui vestiti usati di buona qualità?","A2","frage"],
      ["Wann beginnt eigentlich der Sommerschlussverkauf?","Quando iniziano in realtà i saldi estivi?","A2","frage"],
      ["Zahlst du das für mich vor, ich gebe dir das Geld später?","Mi anticipi tu i soldi, te li do dopo?","A2","frage"],
      ["Ich bestelle lieber online, weil ich keine Zeit für Geschäfte habe.","Preferisco ordinare online perché non ho tempo per i negozi.","A2","nebensatz"],
      ["Ich lege das Kleid zurück, weil die Farbe mir nicht gefällt.","Rimetto a posto il vestito perché il colore non mi piace.","A2","nebensatz"],
      ["Ich warte auf den Ausverkauf, bevor ich die Schuhe kaufe.","Aspetto i saldi prima di comprare le scarpe.","A2","nebensatz"],
      ["Ich denke, dass dieser Laden die besten Preise hat.","Penso che questo negozio abbia i prezzi migliori.","A2","nebensatz"],
      ["Falls das T-Shirt eingeht, werde ich es wahrscheinlich reklamieren.","Se la maglietta si restringerà, probabilmente la reclamerò.","B1","aussage"],
      ["Nachdem ich mehrere Rezensionen gelesen hatte, entschied ich mich doch für das teurere Modell.","Dopo aver letto diverse recensioni, mi sono comunque deciso per il modello più caro.","B1","aussage"],
      ["Ich versuche, beim Wocheneinkauf auf regionale Produkte zu achten, obwohl sie oft teurer sind.","Cerco di fare attenzione ai prodotti locali quando faccio la spesa settimanale, anche se spesso costano di più.","B1","aussage"],
      ["Seit ich ein Haushaltsbuch führe, kaufe ich deutlich überlegter ein.","Da quando tengo un libro delle spese di casa, faccio acquisti molto più ponderati.","B1","aussage"],
      ["Auf dem Flohmarkt habe ich versucht, den Preis für die alte Lampe herunterzuhandeln.","Al mercatino delle pulci ho provato a trattare il prezzo della vecchia lampada.","B1","aussage"],
      ["Ich habe mir vorgenommen, vor größeren Anschaffungen immer eine Nacht darüber zu schlafen.","Mi sono ripromesso di dormirci sempre sopra prima di fare acquisti importanti.","B1","aussage"],
      ["Bevor ich das Geschenk kaufe, frage ich lieber jemanden aus der Familie nach Ideen.","Prima di comprare il regalo, preferisco chiedere idee a qualcuno della famiglia.","B1","aussage"],
      ["Der Laden hat mir angeboten, das Ausstellungsstück günstiger zu verkaufen.","Il negozio mi ha offerto di vendermi il pezzo esposto a un prezzo più basso.","B1","aussage"],
      ["Ich ärgere mich noch immer über den Spontankauf, den ich letzte Woche gemacht habe.","Mi arrabbio ancora per l'acquisto d'impulso che ho fatto la settimana scorsa.","B1","aussage"],
      ["Sobald das Paket ankommt, werde ich prüfen, ob alles unbeschädigt ist.","Non appena arriva il pacco, controllerò che sia tutto integro.","B1","aussage"],
      ["Ich sammle die Punkte auf meiner Kundenkarte, obwohl ich sie selten einlöse.","Raccolgo i punti sulla mia carta fedeltà, anche se raramente li utilizzo.","B1","aussage"],
      ["Anstatt gleich zu kaufen, warte ich meistens ab, ob der Preis noch sinkt.","Invece di comprare subito, di solito aspetto per vedere se il prezzo scende ancora.","B1","aussage"],
      ["Ich habe beim Kundendienst nachgefragt, weil das Paket beschädigt angekommen war.","Ho chiesto al servizio clienti perché il pacco era arrivato danneggiato.","B1","aussage"],
      ["Es lohnt sich, größere Mengen zu kaufen, wenn man das Produkt sowieso oft braucht.","Conviene comprare quantità maggiori se comunque si usa spesso quel prodotto.","B1","aussage"],
      ["Ich habe das Geschenk zurückgebracht, weil meine Schwester es schon besaß.","Ho riportato indietro il regalo perché mia sorella lo aveva già.","B1","aussage"],
      ["Meinst du, es lohnt sich, auf den nächsten Ausverkauf zu warten?","Pensi che valga la pena aspettare i prossimi saldi?","B1","frage"],
      ["Weißt du zufällig, ob dieser Laden auch Ratenzahlung anbietet?","Sai per caso se questo negozio offre anche il pagamento a rate?","B1","frage"],
      ["Würdest du mir raten, das günstigere oder das hochwertigere Modell zu nehmen?","Mi consiglieresti di prendere il modello più economico o quello di qualità superiore?","B1","frage"],
      ["Hast du eine Ahnung, wie lange die Garantie auf dieses Gerät gilt?","Hai idea di quanto duri la garanzia su questo apparecchio?","B1","frage"],
      ["Ich zögere noch, weil ich mir nicht sicher bin, ob sich die Anschaffung lohnt.","Sono ancora indeciso perché non sono sicuro che l'acquisto valga la pena.","B1","nebensatz"],
      ["Sobald ich das Geld für die neue Kamera zusammenhabe, gehe ich sie kaufen.","Non appena avrò messo da parte i soldi per la nuova fotocamera, andrò a comprarla.","B1","nebensatz"],
      ["Ich habe vergessen, ob ich die Verpackung für die Rückgabe aufheben sollte.","Ho dimenticato se avrei dovuto conservare la confezione per la restituzione.","B1","nebensatz"],
      ["Während meine Freunde online bestellen, gehe ich lieber persönlich ins Geschäft.","Mentre i miei amici ordinano online, io preferisco andare di persona in negozio.","B1","nebensatz"],
      ["Die Regale werden neuerdings so gestaltet, dass unnötige Zusatzkäufe geradezu provoziert werden.","Ultimamente gli scaffali sono disposti in modo da provocare quasi acquisti aggiuntivi non necessari.","B2","aussage"],
      ["Trotz wachsender Kritik an der Wegwerfmentalität boomt der Markt für Fast Fashion nach wie vor ungebremst.","Nonostante le crescenti critiche alla mentalità dell'usa e getta, il mercato del fast fashion continua a prosperare senza freni.","B2","aussage"],
      ["Personalisierte Preise im Onlinehandel führen dazu, dass zwei Kunden für dasselbe Produkt Unterschiedliches zahlen.","I prezzi personalizzati nel commercio online fanno sì che due clienti paghino cifre diverse per lo stesso prodotto.","B2","aussage"],
      ["Die Zahl der Abo-Modelle im Handel ist inzwischen so groß geworden, dass viele Verbraucher den Überblick verlieren.","Il numero di modelli in abbonamento nel commercio è ormai diventato così grande che molti consumatori perdono il conto.","B2","aussage"],
      ["Kaufe-jetzt-zahle-später-Angebote verleiten gerade jüngere Kunden dazu, sich unbemerkt zu verschulden.","Le offerte compra ora, paga dopo spingono soprattutto i clienti più giovani a indebitarsi senza accorgersene.","B2","aussage"],
      ["Es wird zunehmend schwieriger, zwischen echten Rabatten und lediglich künstlich erhöhten Ausgangspreisen zu unterscheiden.","Diventa sempre più difficile distinguere tra sconti reali e prezzi di partenza semplicemente gonfiati ad arte.","B2","aussage"],
      ["Der Second-Hand-Markt profitiert derzeit stark davon, dass Nachhaltigkeit im Konsum an Bedeutung gewinnt.","Il mercato dell'usato beneficia attualmente molto del fatto che la sostenibilità nei consumi sta guadagnando importanza.","B2","aussage"],
      ["Kassenlose Läden versprechen zwar Komfort, werfen jedoch Fragen zum Datenschutz der Kundschaft auf.","I negozi senza cassa promettono comodità, ma sollevano interrogativi sulla protezione dei dati della clientela.","B2","aussage"],
      ["Allerdings hat sich gezeigt, dass viele der beworbenen Rabatte bei genauerem Hinsehen gar keine echten Ersparnisse darstellen.","Tuttavia si è visto che molti degli sconti pubblicizzati, a uno sguardo più attento, non rappresentano affatto risparmi reali.","B2","aussage"],
      ["Die geplante Obsoleszenz elektronischer Geräte zwingt Verbraucher zu Anschaffungen, die eigentlich vermeidbar wären.","L'obsolescenza programmata degli apparecchi elettronici costringe i consumatori ad acquisti che in realtà sarebbero evitabili.","B2","aussage"],
      ["Influencer-Werbung beeinflusst gerade jüngere Zielgruppen stärker, als klassische Anzeigen es je vermochten.","La pubblicità degli influencer influenza il pubblico più giovane più di quanto abbiano mai potuto fare gli annunci tradizionali.","B2","aussage"],
      ["Angesichts strengerer Verpackungsvorschriften müssen viele Hersteller ihre Produkte grundlegend überarbeiten.","Di fronte a normative più severe sugli imballaggi, molti produttori devono rivedere radicalmente i propri prodotti.","B2","aussage"],
      ["Kleine Fachgeschäfte behaupten sich gegen die Ketten meist nur durch außergewöhnlich persönliche Beratung.","I piccoli negozi specializzati riescono a resistere alle catene per lo più solo grazie a una consulenza straordinariamente personale.","B2","aussage"],
      ["Es wäre wünschenswert, dass Garantiebedingungen künftig verständlicher formuliert werden.","Sarebbe auspicabile che in futuro le condizioni di garanzia venissero formulate in modo più comprensibile.","B2","aussage"],
      ["Der künstlich erzeugte Zeitdruck bei Blitzangeboten führt nachweislich zu unüberlegten Käufen.","La pressione temporale artificialmente creata dalle offerte lampo porta comprovatamente ad acquisti sconsiderati.","B2","aussage"],
      ["Wäre es nicht angebracht, Verbraucher besser über personalisierte Preise aufzuklären?","Non sarebbe opportuno informare meglio i consumatori sui prezzi personalizzati?","B2","frage"],
      ["Inwiefern trägt die Werbung eigentlich zur Entstehung künstlicher Bedürfnisse bei?","In che misura la pubblicità contribuisce in realtà alla creazione di bisogni artificiali?","B2","frage"],
      ["Sollte man sich nicht generell fragen, weshalb ein Schnäppchen uns so viel zufriedener macht als ein normaler Kauf?","Non ci si dovrebbe chiedere in generale perché un affare ci renda molto più soddisfatti di un acquisto normale?","B2","frage"],
      ["Wie lässt sich verhindern, dass Rabattaktionen zu reinen Marketinginstrumenten ohne echten Mehrwert verkommen?","Come si può evitare che le promozioni si riducano a puri strumenti di marketing privi di un reale valore aggiunto?","B2","frage"],
      ["Obwohl die Rabattaktion großzügig beworben wurde, stellte sich heraus, dass kaum Ware tatsächlich reduziert war.","Sebbene la promozione fosse stata pubblicizzata generosamente, si è scoperto che quasi nessun articolo era davvero scontato.","B2","nebensatz"],
      ["Da die Versandkosten mittlerweile den Warenwert übersteigen können, überlegen es sich viele Kunden zweimal.","Poiché ormai i costi di spedizione possono superare il valore della merce, molti clienti ci pensano due volte.","B2","nebensatz"],
      ["Falls der Hersteller die Garantie nicht verlängert, werde ich das Gerät nicht erneut kaufen.","Se il produttore non estenderà la garanzia, non comprerò di nuovo quell'apparecchio.","B2","nebensatz"],
      ["Während kleine Läden auf Beratung setzen, punkten große Ketten vor allem mit Preis und Auswahl.","Mentre i piccoli negozi puntano sulla consulenza, le grandi catene si distinguono soprattutto per prezzo e assortimento.","B2","nebensatz"],
      ["Wer beim Einkaufen konsequent auf Nachhaltigkeit besteht, muss sich zwangsläufig mit höheren Kosten abfinden.","Chi, facendo acquisti, insiste rigorosamente sulla sostenibilità deve necessariamente fare i conti con costi più elevati.","C1","aussage"],
      ["Der vielzitierte Konsument als Wähler mit dem Portemonnaie trägt eine Verantwortung, die er im Alltag selten bewusst wahrnimmt.","Il tanto citato consumatore come elettore col portafoglio porta una responsabilità che nella vita quotidiana raramente percepisce consapevolmente.","C1","aussage"],
      ["Die Nostalgie für den Tante-Emma-Laden um die Ecke verklärt gern, wie mühsam der Alltag ohne Supermärkte tatsächlich war.","La nostalgia per il negozietto di quartiere idealizza volentieri quanto fosse in realtà faticosa la vita quotidiana senza supermercati.","C1","aussage"],
      ["Es grenzt an eine Kunst, sich der geschickt inszenierten Verknappung mancher Angebote nicht geschlagen zu geben.","Rasenta l'arte non lasciarsi vincere dall'abile messa in scena della scarsità di certe offerte.","C1","aussage"],
      ["Manch einer betreibt das Einkaufen regelrecht als eine Form der Selbsttherapie, ohne sich dessen bewusst zu sein.","C'è chi pratica lo shopping quasi come una forma di autoterapia, senza rendersene conto.","C1","aussage"],
      ["Die Behauptung, ein Produkt sei nachhaltig, entpuppt sich bei genauerem Hinsehen nicht selten als reines Marketinginstrument.","L'affermazione che un prodotto sia sostenibile si rivela, a uno sguardo più attento, non di rado un puro strumento di marketing.","C1","aussage"],
      ["Wer sich dem Konsumzwang der Feiertage entziehen will, tut gut daran, sich frühzeitig eine klare Grenze zu setzen.","Chi vuole sottrarsi alla pressione consumistica delle feste fa bene a darsi per tempo un limite chiaro.","C1","aussage"],
      ["Boykottaufrufe gegen einzelne Unternehmen verpuffen meist, sobald die anfängliche Empörung der Bequemlichkeit weicht.","Gli appelli al boicottaggio contro singole aziende svaniscono per lo più non appena l'indignazione iniziale lascia il posto alla comodità.","C1","aussage"],
      ["Es steht außer Frage, dass günstige Preise häufig auf Kosten weiter entfernter Arbeitsbedingungen erkauft werden.","È fuori discussione che i prezzi bassi vengano spesso pagati a spese di condizioni di lavoro lontane e poco visibili.","C1","aussage"],
      ["Der schmale Grat zwischen sparsamem und geizigem Konsumverhalten lässt sich selten eindeutig ziehen.","Il confine sottile tra un comportamento di consumo parsimonioso e uno tirchio raramente si può tracciare con chiarezza.","C1","aussage"],
      ["Second-Hand-Kleidung zu tragen, gilt längst nicht mehr als Makel, sondern zunehmend als Ausdruck von Stilbewusstsein.","Indossare abiti di seconda mano non è più considerato ormai un difetto, ma sempre più un'espressione di gusto stilistico.","C1","aussage"],
      ["Preisanker, die absichtlich hoch angesetzt werden, verzerren unsere Wahrnehmung dessen, was ein Produkt eigentlich wert ist.","Gli ancoraggi di prezzo, fissati apposta in modo elevato, distorcono la nostra percezione di quanto un prodotto valga realmente.","C1","aussage"],
      ["Es fällt schwer, sich der Suggestivkraft eines Countdowns beim Onlinekauf gänzlich zu entziehen.","È difficile sottrarsi del tutto al potere suggestivo di un conto alla rovescia durante un acquisto online.","C1","aussage"],
      ["Die Markentreue mancher Kunden gleicht mitunter eher einer emotionalen Bindung als einer rationalen Kaufentscheidung.","La fedeltà al marchio di alcuni clienti somiglia talvolta più a un legame emotivo che a una decisione d'acquisto razionale.","C1","aussage"],
      ["Wer glaubt, im Ausverkauf grundsätzlich zu sparen, übersieht leicht, wie viel dabei letztlich unnötig gekauft wird.","Chi crede di risparmiare sempre durante i saldi trascura facilmente quanto, alla fine, venga acquistato inutilmente.","C1","aussage"],
      ["Inwieweit lässt sich verantwortungsvoller Konsum überhaupt mit begrenztem Budget vereinbaren?","Fino a che punto un consumo responsabile può davvero conciliarsi con un budget limitato?","C1","frage"],
      ["Woran liegt es eigentlich, dass uns ein vermeintliches Schnäppchen ein derart triumphales Gefühl beschert?","Da cosa dipende in realtà il fatto che un presunto affare ci regali un sentimento così trionfale?","C1","frage"],
      ["Ließe sich der Herdentrieb beim Konsum durch bessere Aufklärung überhaupt eindämmen?","L'istinto del gregge nel consumo potrebbe mai essere arginato con una migliore informazione?","C1","frage"],
      ["Wäre gelegentlicher Verzicht nicht ein wirksameres Mittel gegen den Konsumrausch als jedes Sparbuch?","Un'occasionale rinuncia non sarebbe un rimedio più efficace contro la frenesia del consumo di qualsiasi libretto di risparmio?","C1","frage"],
      ["So verlockend ein Rabatt auch erscheinen mag, so genau sollte man prüfen, ob man den Artikel überhaupt braucht.","Per quanto allettante possa sembrare uno sconto, altrettanto attentamente si dovrebbe verificare se si abbia davvero bisogno dell'articolo.","C1","nebensatz"],
      ["Indem Geschäfte mit knapper Verfügbarkeit werben, erzeugen sie einen Kaufdruck, der objektiv oft unbegründet ist.","Pubblicizzando una disponibilità limitata, i negozi generano una pressione all'acquisto che spesso è oggettivamente infondata.","C1","nebensatz"],
      ["Wer die eigenen Kaufgewohnheiten kritisch hinterfragt, stößt nicht selten auf überraschend tief verwurzelte Muster.","Chi mette in discussione criticamente le proprie abitudini di consumo si imbatte non di rado in schemi sorprendentemente radicati.","C1","nebensatz"],
      ["Da Rezensionen zunehmend gefälscht werden können, verlässt man sich beim Kauf lieber auf den eigenen gesunden Menschenverstand.","Poiché le recensioni possono essere sempre più spesso false, negli acquisti ci si affida piuttosto al proprio buon senso.","C1","nebensatz"],
      ["Dass ethischer Konsum sich selbst zunehmend zu einem Statussymbol wandelt, unterläuft leise das eigentliche Anliegen, das er einst verfolgte.","Il fatto che il consumo etico si trasformi sempre più esso stesso in uno status symbol mina silenziosamente l'obiettivo originario che un tempo perseguiva.","C2","aussage"],
      ["Die schwindende Zahl menschlicher Verkäufer in automatisierten Läden lässt den Einkauf zu einer merkwürdig stummen Angelegenheit verkommen.","Il numero calante di commessi umani nei negozi automatizzati fa scadere lo shopping a una faccenda stranamente muta.","C2","aussage"],
      ["Es gehört zu den kleinen Absurditäten unserer Zeit, dass wir Dinge zurücksenden, kaum dass wir sie ausgepackt haben.","È una delle piccole assurdità del nostro tempo che rimandiamo indietro le cose non appena le abbiamo scartate.","C2","aussage"],
      ["Das Auswahlparadox, je mehr Optionen, desto größer die Unzufriedenheit, bewahrheitet sich nirgends so zuverlässig wie im Supermarktregal.","Il paradosso della scelta, più opzioni, maggiore insoddisfazione, si conferma in nessun luogo tanto affidabilmente quanto sullo scaffale del supermercato.","C2","aussage"],
      ["Verlassene Einkaufszentren aus den Neunzigern zeugen heute wie stumme Ruinen von einem Konsumoptimismus, der uns inzwischen fremd geworden ist.","I centri commerciali abbandonati degli anni Novanta testimoniano oggi, come rovine mute, un ottimismo consumistico che nel frattempo ci è diventato estraneo.","C2","aussage"],
      ["Der Kreislauf aus Spontankauf, schlechtem Gewissen und anschließender Spende an wohltätige Zwecke wiederholt sich bei vielen mit erstaunlicher Regelmäßigkeit.","Il ciclo di acquisto impulsivo, cattiva coscienza e successiva donazione in beneficenza si ripete in molti con sorprendente regolarità.","C2","aussage"],
      ["So paradox es klingen mag: Gerade der Überfluss an Auswahl erzeugt bei vielen ein diffuses Gefühl von Mangel.","Per quanto possa suonare paradossale, è proprio l'abbondanza di scelta a generare in molti una vaga sensazione di mancanza.","C2","aussage"],
      ["Das Auspacken eines Neukaufs vor laufender Kamera hat sich zu einem eigenen kleinen Ritual entwickelt, dessen Sinn sich dem Außenstehenden entzieht.","Scartare un nuovo acquisto davanti alla telecamera è diventato un piccolo rituale a sé stante, il cui senso sfugge a chi guarda dall'esterno.","C2","aussage"],
      ["Die vermeintlich freie Kaufentscheidung erweist sich bei näherer Betrachtung als Ergebnis unzähliger, kaum bewusst wahrgenommener Beeinflussungsversuche.","La presunta libera decisione d'acquisto si rivela, a uno sguardo più attento, il risultato di innumerevoli tentativi di influenza percepiti a malapena consapevolmente.","C2","aussage"],
      ["Es mutet fast zynisch an, wie sehr der Begriff der Nachhaltigkeit inzwischen zur bloßen Verpackungsfloskel verkommen ist.","Risulta quasi cinico quanto il concetto di sostenibilità sia ormai degradato a mera formula da imballaggio.","C2","aussage"],
      ["Der Kassierer als möglicherweise letzter menschlicher Kontakt im automatisierten Einkaufsalltag verdient eine Aufmerksamkeit, die ihm selten zuteilwird.","Il cassiere, forse ultimo contatto umano nella quotidianità dello shopping automatizzato, merita un'attenzione che gli viene raramente riservata.","C2","aussage"],
      ["Man könnte fast meinen, die Einkaufstüte fungiere längst weniger als Transportmittel denn als kleine Trophäe.","Si potrebbe quasi pensare che la busta della spesa funga ormai meno da mezzo di trasporto che da piccolo trofeo.","C2","aussage"],
      ["Die gefühlte Armut inmitten materiellen Überflusses ist eines der stillen Rätsel unserer Konsumgesellschaft.","La povertà percepita in mezzo all'abbondanza materiale è uno dei silenziosi enigmi della nostra società dei consumi.","C2","aussage"],
      ["Shopping als Ersatzhandlung für fehlende Erfüllung an anderer Stelle ist eine Diagnose, die sich kaum jemand selbst zu stellen wagt.","Lo shopping come attività sostitutiva per una mancata soddisfazione altrove è una diagnosi che quasi nessuno osa formulare a sé stesso.","C2","aussage"],
      ["Wer meint, dem Konsumdruck durch bloßen Verzicht zu entkommen, unterschätzt, wie sehr auch die Askese längst vermarktet wird.","Chi crede di sfuggire alla pressione consumistica con la semplice rinuncia sottovaluta quanto anche l'ascetismo sia ormai da tempo commercializzato.","C2","aussage"],
      ["Ist der vielbeschworene bewusste Konsument nicht letztlich eine ebenso hübsche wie folgenlose Selbsttäuschung?","Il tanto celebrato consumatore consapevole non è, in fondo, un'autoillusione tanto elegante quanto priva di conseguenze?","C2","frage"],
      ["Wie weit dürfen Algorithmen unser Kaufverhalten eigentlich lenken, bevor man von einer erodierten Wahlfreiheit sprechen muss?","Fino a che punto gli algoritmi possono davvero orientare il nostro comportamento d'acquisto prima di dover parlare di una libertà di scelta erosa?","C2","frage"],
      ["Was verrät es über uns, dass wir Dingen inzwischen mehr Aufmerksamkeit schenken als den Menschen, von denen wir sie kaufen?","Cosa rivela di noi il fatto che ormai dedichiamo più attenzione alle cose che alle persone da cui le acquistiamo?","C2","frage"],
      ["Ließe sich der Kult um limitierte Editionen nicht als moderne Form künstlich erzeugter Knappheit entlarven?","Il culto delle edizioni limitate non potrebbe essere smascherato come una forma moderna di scarsità creata artificialmente?","C2","frage"],
      ["So sehr man sich gegen den Sog der endlosen Produktvorschläge zu wehren versucht, so unmerklich landet man doch wieder im virtuellen Warenkorb.","Per quanto ci si sforzi di resistere al richiamo degli infiniti suggerimenti di prodotti, ci si ritrova comunque, quasi impercettibilmente, di nuovo nel carrello virtuale.","C2","nebensatz"],
      ["Während die einen im Verzicht auf Konsum eine Art Läuterung suchen, betreiben andere ihn als bloße Zurschaustellung von Selbstdisziplin.","Mentre alcuni cercano nella rinuncia al consumo una sorta di purificazione, altri la praticano come mera esibizione di autodisciplina.","C2","nebensatz"],
      ["Kaum hat man sich vom letzten Kaufrausch erholt, lockt bereits die nächste Rabattschlacht mit unwiderstehlichen Versprechen.","Ci si è appena ripresi dall'ultima frenesia d'acquisto, che già la prossima battaglia degli sconti attira con promesse irresistibili.","C2","nebensatz"],
      ["Sooft man sich vornimmt, dem Überangebot mit Gelassenheit zu begegnen, so gewiss erliegt man doch wieder der Illusion, etwas zu verpassen.","Per quante volte ci si proponga di affrontare con serenità la sovrabbondanza di offerte, altrettanto sicuramente si cede di nuovo all'illusione di perdersi qualcosa.","C2","nebensatz"],
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
      ["Obgleich die digitalen Arbeitsmittel stetig ausgefeilter werden, scheint die gefühlte Arbeitsbelastung kaum abzunehmen.","Sebbene gli strumenti digitali di lavoro diventino sempre più sofisticati, il carico di lavoro percepito sembra diminuire ben poco.","C2","nebensatz"],
      ["Ich bin Ärztin.","Sono dottoressa.","A1","aussage"],
      ["Er arbeitet in einer Bank.","Lui lavora in banca.","A1","aussage"],
      ["Meine Kollegin kommt aus Spanien.","La mia collega viene dalla Spagna.","A1","aussage"],
      ["Wir haben viel zu tun.","Abbiamo molto da fare.","A1","aussage"],
      ["Ich verdiene gutes Geld.","Guadagno bene.","A1","aussage"],
      ["Der Computer ist kaputt.","Il computer è rotto.","A1","aussage"],
      ["Ich trinke Kaffee im Büro.","Bevo il caffè in ufficio.","A1","aussage"],
      ["Meine Firma ist neu.","La mia azienda è nuova.","A1","aussage"],
      ["Er ist sehr fleißig.","Lui è molto diligente.","A1","aussage"],
      ["Ich benutze einen Laptop.","Uso un portatile.","A1","aussage"],
      ["Die Kollegen sind nett.","I colleghi sono gentili.","A1","aussage"],
      ["Ich helfe meinem Kollegen.","Aiuto il mio collega.","A1","aussage"],
      ["Wir telefonieren mit dem Kunden.","Telefoniamo con il cliente.","A1","aussage"],
      ["Ich bin oft gestresst.","Sono spesso stressato.","A1","aussage"],
      ["Die Arbeit macht Spaß.","Il lavoro è divertente.","A1","aussage"],
      ["Wo arbeitest du?","Dove lavori?","A1","frage"],
      ["Wie viele Stunden arbeitest du?","Quante ore lavori?","A1","frage"],
      ["Bist du zufrieden mit deiner Arbeit?","Sei soddisfatto del tuo lavoro?","A1","frage"],
      ["Arbeitest du auch samstags?","Lavori anche il sabato?","A1","frage"],
      ["Ich bin froh, wenn die Arbeit fertig ist.","Sono contento quando il lavoro è finito.","A1","nebensatz"],
      ["Ich esse, bevor ich arbeite.","Mangio prima di lavorare.","A1","nebensatz"],
      ["Ich lerne Deutsch, weil ich hier arbeite.","Imparo il tedesco perché lavoro qui.","A1","nebensatz"],
      ["Ich bleibe zu Hause, wenn ich krank bin.","Resto a casa quando sono malato.","A1","nebensatz"],
      ["Ich habe heute Morgen viele E-Mails beantwortet.","Stamattina ho risposto a molte e-mail.","A2","aussage"],
      ["Mein Chef hat die Besprechung kurzfristig abgesagt.","Il mio capo ha annullato la riunione all'ultimo momento.","A2","aussage"],
      ["Ich habe mich heute krankgemeldet.","Oggi mi sono messo in malattia.","A2","aussage"],
      ["Wir haben letzten Monat Überstunden gemacht.","Il mese scorso abbiamo fatto straordinari.","A2","aussage"],
      ["Der Drucker funktioniert schon wieder nicht.","La stampante di nuovo non funziona.","A2","aussage"],
      ["Ich habe um eine Gehaltserhöhung gebeten.","Ho chiesto un aumento di stipendio.","A2","aussage"],
      ["Nächste Woche fahre ich auf Geschäftsreise.","La prossima settimana vado in viaggio di lavoro.","A2","aussage"],
      ["Ich habe die Frist leider verpasst.","Purtroppo ho mancato la scadenza.","A2","aussage"],
      ["Ich habe in der Mittagspause etwas Neues gelernt.","Durante la pausa pranzo ho imparato qualcosa di nuovo.","A2","aussage"],
      ["Wir sind letzte Woche in ein neues Büro umgezogen.","La settimana scorsa ci siamo trasferiti in un nuovo ufficio.","A2","aussage"],
      ["Wir essen mittags oft zusammen in der Kantine.","A pranzo mangiamo spesso insieme in mensa.","A2","aussage"],
      ["Ich habe meinem Kollegen bei dem Bericht geholfen.","Ho aiutato il mio collega con il rapporto.","A2","aussage"],
      ["Das Internet ist heute im Büro ausgefallen.","Oggi in ufficio è saltata la connessione internet.","A2","aussage"],
      ["Meine Chefin hat mein neues Projekt gelobt.","La mia capa ha elogiato il mio nuovo progetto.","A2","aussage"],
      ["Ich habe ein Formular für den Urlaub ausgefüllt.","Ho compilato un modulo per le ferie.","A2","aussage"],
      ["Wann beginnt eure Schicht?","Quando comincia il vostro turno?","A2","frage"],
      ["Musst du heute Überstunden machen?","Devi fare gli straordinari oggi?","A2","frage"],
      ["Hast du das Formular schon abgeschickt?","Hai già inviato il modulo?","A2","frage"],
      ["Hast du dich schon krankgemeldet?","Ti sei già messo in malattia?","A2","frage"],
      ["Ich bin spät dran, weil die Bahn Verspätung hatte.","Sono in ritardo perché il treno aveva ritardo.","A2","nebensatz"],
      ["Ich rufe dich an, wenn ich im Büro ankomme.","Ti chiamo quando arrivo in ufficio.","A2","nebensatz"],
      ["Ich weiß nicht, ob wir heute pünktlich fertig werden.","Non so se oggi finiremo puntuali.","A2","nebensatz"],
      ["Bevor ich die E-Mail schicke, lese ich sie noch einmal.","Prima di inviare l'e-mail la rileggo ancora una volta.","A2","nebensatz"],
      ["Meine Kollegin ging letztes Jahr in Elternzeit und kommt bald zurück.","La mia collega l'anno scorso è andata in congedo parentale e presto tornerà.","B1","aussage"],
      ["Ich würde gern in Teilzeit arbeiten, wenn es möglich wäre.","Mi piacerebbe lavorare part-time, se fosse possibile.","B1","aussage"],
      ["Früher arbeitete ich in einer kleinen Werkstatt am Stadtrand.","Un tempo lavoravo in una piccola officina alla periferia della città.","B1","aussage"],
      ["Ich stelle mein Fahrrad immer vor das Büro.","Metto sempre la mia bicicletta davanti all'ufficio.","B1","aussage"],
      ["Mein Laptop steht normalerweise auf dem Schreibtisch neben dem Monitor.","Il mio portatile di solito sta sulla scrivania accanto al monitor.","B1","aussage"],
      ["Ich hätte gern etwas mehr Zeit für dieses Projekt.","Vorrei un po' più di tempo per questo progetto.","B1","aussage"],
      ["Die beiden Abteilungen haben den Konflikt letzte Woche endlich gelöst.","I due reparti hanno finalmente risolto il conflitto la settimana scorsa.","B1","aussage"],
      ["Ich nehme nächstes Jahr an einer Fortbildung im Ausland teil.","Il prossimo anno parteciperò a un corso di formazione all'estero.","B1","aussage"],
      ["Mein Vertrag läuft Ende des Jahres aus und wird hoffentlich verlängert.","Il mio contratto scade a fine anno e spero che venga rinnovato.","B1","aussage"],
      ["Ich hänge meine Jacke immer an den Haken neben der Tür.","Appendo sempre la giacca al gancio vicino alla porta.","B1","aussage"],
      ["Die neue Kollegin setzt sich meistens neben mich ins Großraumbüro.","La nuova collega di solito si siede accanto a me nell'open space.","B1","aussage"],
      ["Ich würde mich freuen, wenn wir das Projekt gemeinsam abschließen könnten.","Sarei felice se potessimo concludere insieme il progetto.","B1","aussage"],
      ["Mein Vater arbeitete dreißig Jahre lang in derselben Fabrik.","Mio padre ha lavorato per trent'anni nella stessa fabbrica.","B1","aussage"],
      ["Ich habe mich entschieden, die Kündigung zurückzuziehen.","Ho deciso di ritirare le dimissioni.","B1","aussage"],
      ["Ich lege die Verträge immer in die oberste Schublade.","Metto sempre i contratti nel primo cassetto.","B1","aussage"],
      ["Könnten Sie mir bitte bis morgen antworten?","Potrebbe rispondermi entro domani, per favore?","B1","frage"],
      ["Wüssten Sie zufällig, wann die neue Kollegin anfängt?","Saprebbe per caso quando inizia la nuova collega?","B1","frage"],
      ["Dürfte ich heute etwas früher gehen?","Potrei uscire un po' prima oggi?","B1","frage"],
      ["Wie lange dauerte deine letzte Stelle?","Quanto è durato il tuo ultimo impiego?","B1","frage"],
      ["Als ich jünger war, wollte ich unbedingt Journalist werden.","Da giovane volevo assolutamente diventare giornalista.","B1","nebensatz"],
      ["Ich arbeite lieber im Büro als zu Hause, obwohl das Pendeln anstrengend ist.","Preferisco lavorare in ufficio piuttosto che a casa, anche se il pendolarismo è faticoso.","B1","nebensatz"],
      ["Nachdem ich die Kündigung eingereicht hatte, fühlte ich mich erleichtert.","Dopo aver presentato le dimissioni, mi sono sentito sollevato.","B1","nebensatz"],
      ["Die Stelle, auf die ich mich beworben habe, wurde leider schon vergeben.","Il posto per cui mi sono candidato è stato purtroppo già assegnato.","B1","nebensatz"],
      ["Die Einführung des neuen Gehaltssystems sorgte anfangs für erhebliche Verunsicherung unter den Angestellten.","L'introduzione del nuovo sistema salariale ha creato all'inizio una notevole incertezza tra i dipendenti.","B2","aussage"],
      ["Trotz des großen Arbeitsaufwands wurde das Projekt termingerecht fertiggestellt.","Nonostante il grande carico di lavoro, il progetto è stato completato nei tempi previsti.","B2","aussage"],
      ["Die Entlassung mehrerer langjähriger Mitarbeiter hat das Vertrauen in die Geschäftsführung nachhaltig erschüttert.","Il licenziamento di diversi dipendenti di lunga data ha scosso durevolmente la fiducia nella direzione.","B2","aussage"],
      ["Allerdings wird die Vereinbarkeit von Beruf und Familie in unserem Unternehmen noch immer zu wenig gefördert.","Tuttavia, nella nostra azienda la conciliazione tra lavoro e famiglia viene ancora promossa troppo poco.","B2","aussage"],
      ["Der Vorschlag des Betriebsrats wurde von der Geschäftsleitung überraschend positiv aufgenommen.","La proposta del consiglio aziendale è stata accolta sorprendentemente bene dalla direzione.","B2","aussage"],
      ["Die Zufriedenheit der Mitarbeiter hängt maßgeblich von der Qualität der Führung ab.","La soddisfazione dei dipendenti dipende in gran parte dalla qualità della leadership.","B2","aussage"],
      ["Obwohl die Geschäftsführung Kürzungen angekündigt hatte, wurden alle Boni pünktlich ausgezahlt.","Sebbene la direzione avesse annunciato dei tagli, tutti i bonus sono stati pagati puntualmente.","B2","aussage"],
      ["Die Digitalisierung des Bewerbungsprozesses hat die Bearbeitungszeit deutlich verkürzt.","La digitalizzazione del processo di candidatura ha ridotto notevolmente i tempi di elaborazione.","B2","aussage"],
      ["Der Standort der neuen Filiale wurde erst nach monatelanger Prüfung festgelegt.","La sede della nuova filiale è stata stabilita solo dopo mesi di verifiche.","B2","aussage"],
      ["Dennoch bleibt die Frage der fairen Verteilung von Aufgaben innerhalb des Teams ungeklärt.","Resta comunque irrisolta la questione di una giusta ripartizione dei compiti all'interno del team.","B2","aussage"],
      ["Der Antrag auf Elternzeit wurde ihm ohne Begründung verweigert.","La sua richiesta di congedo parentale gli è stata negata senza motivazione.","B2","aussage"],
      ["Die Höhe des Jahresbonus richtet sich nach dem Erfolg der gesamten Abteilung.","L'ammontare del bonus annuale dipende dal successo dell'intero reparto.","B2","aussage"],
      ["Trotz wiederholter Beschwerden der Belegschaft wurde die Klimaanlage im Büro nicht repariert.","Nonostante i ripetuti reclami del personale, l'impianto di climatizzazione in ufficio non è stato riparato.","B2","aussage"],
      ["Die Verhandlungen über die Gehaltserhöhung zogen sich über mehrere Monate hin.","I negoziati sull'aumento salariale si sono protratti per diversi mesi.","B2","aussage"],
      ["Allerdings zeigte sich schon bald, dass die neue Software zusätzliche Schulungen erforderte.","Tuttavia si è visto presto che il nuovo software richiedeva ulteriore formazione.","B2","aussage"],
      ["Warum wurde die Entscheidung des Vorstands nicht mit den Mitarbeitern besprochen?","Perché la decisione del consiglio non è stata discussa con i dipendenti?","B2","frage"],
      ["Sollte die Verteilung der Aufgaben nicht transparenter gestaltet werden?","Non si dovrebbe rendere più trasparente la distribuzione dei compiti?","B2","frage"],
      ["Wie lässt sich die Motivation der Mitarbeiter trotz der Sparmaßnahmen aufrechterhalten?","Come si può mantenere la motivazione dei dipendenti nonostante le misure di risparmio?","B2","frage"],
      ["Weshalb wurde die Einführung der neuen Software immer wieder verschoben?","Perché l'introduzione del nuovo software è stata rinviata più volte?","B2","frage"],
      ["Obwohl die Fusion der beiden Unternehmen reibungslos verlief, verließen mehrere Führungskräfte die Firma.","Sebbene la fusione delle due aziende sia avvenuta senza intoppi, diversi dirigenti hanno lasciato l'azienda.","B2","nebensatz"],
      ["Während die eine Abteilung Überstunden anhäufte, hatte die andere kaum genug zu tun.","Mentre un reparto accumulava straordinari, l'altro aveva a malapena abbastanza da fare.","B2","nebensatz"],
      ["Da die Kündigungsfrist des Vertrags noch nicht abgelaufen war, konnte er die Stelle nicht sofort wechseln.","Poiché il termine di disdetta del contratto non era ancora scaduto, non poteva cambiare lavoro subito.","B2","nebensatz"],
      ["Nachdem die Umstrukturierung der Abteilung abgeschlossen worden war, herrschte zunächst allgemeine Verunsicherung.","Dopo che la ristrutturazione del reparto era stata completata, regnava dapprima un'incertezza generale.","B2","nebensatz"],
      ["Wer in Führungspositionen aufsteigen möchte, muss lernen, unbequeme Entscheidungen zu treffen und dafür geradezustehen.","Chi vuole fare carriera in posizioni dirigenziali deve imparare a prendere decisioni scomode e ad assumersene la responsabilità.","C1","aussage"],
      ["Auf lange Sicht zahlt sich ein wertschätzender Umgang mit den Mitarbeitern nahezu immer aus.","Sul lungo periodo, un trattamento rispettoso dei dipendenti quasi sempre ripaga.","C1","aussage"],
      ["Von seinem Vorgesetzten unerwartet gelobt, wagte er es kaum, seine eigenen Verdienste herunterzuspielen.","Elogiato inaspettatamente dal suo superiore, osava a stento sminuire i propri meriti.","C1","aussage"],
      ["Der Geschäftsführer erklärte, er sei über die sinkenden Umsatzzahlen keineswegs beunruhigt.","L'amministratore delegato dichiarò di non essere affatto preoccupato per il calo del fatturato.","C1","aussage"],
      ["Gestützt auf jahrelange Erfahrung, traf sie die Entscheidung ohne zu zögern.","Basandosi su anni di esperienza, prese la decisione senza esitare.","C1","aussage"],
      ["Es steht außer Frage, dass Loyalität in schwierigen Zeiten ihren Preis hat.","Non c'è dubbio che la lealtà, nei momenti difficili, abbia un prezzo.","C1","aussage"],
      ["Sich in neue Aufgabenbereiche einzuarbeiten, kostet zu Beginn stets mehr Zeit als geplant.","Familiarizzarsi con nuovi ambiti di competenza richiede sempre, all'inizio, più tempo del previsto.","C1","aussage"],
      ["Der Referent betonte, die Belegschaft sei über die anstehenden Veränderungen umfassend informiert worden.","Il relatore sottolineò che il personale fosse stato informato in modo esauriente sui cambiamenti imminenti.","C1","aussage"],
      ["Auf den ersten Blick unscheinbar, erwies sich die Umstrukturierung als überaus wirkungsvoll.","Apparentemente insignificante a prima vista, la ristrutturazione si rivelò estremamente efficace.","C1","aussage"],
      ["Es gehört mittlerweile zum guten Ton, flexible Arbeitszeiten anzubieten, auch wenn dies organisatorisch nicht immer leicht umzusetzen ist.","Ormai fa parte del galateo aziendale offrire orari flessibili, anche se dal punto di vista organizzativo non è sempre facile da attuare.","C1","aussage"],
      ["Erschöpft von der wochenlangen Verhandlung, willigte die Geschäftsführung schließlich in den Kompromiss ein.","Esausta dalla trattativa durata settimane, la direzione alla fine acconsentì al compromesso.","C1","aussage"],
      ["Man sagt ihm nach, er scheue keine Konfrontation, wenn es um die Interessen seines Teams gehe.","Si dice di lui che non tema alcun confronto quando si tratta degli interessi del suo team.","C1","aussage"],
      ["Die Kollegin ließ durchblicken, dass sie mit der aktuellen Aufgabenverteilung alles andere als zufrieden sei.","La collega lasciò intendere di essere tutt'altro che soddisfatta dell'attuale ripartizione dei compiti.","C1","aussage"],
      ["Angesichts der knappen Ressourcen bleibt der Führungsebene kaum etwas anderes übrig, als Prioritäten neu zu setzen.","Di fronte alle risorse scarse, ai vertici non resta altro che ridefinire le priorità.","C1","aussage"],
      ["Von den Kollegen respektiert und vom Chef geschätzt, konnte sie sich eine gewisse Unabhängigkeit erlauben.","Rispettata dai colleghi e stimata dal capo, poteva permettersi una certa indipendenza.","C1","aussage"],
      ["Wie weit darf beruflicher Ehrgeiz gehen, ohne dass darunter die Kollegialität leidet?","Fino a che punto può spingersi l'ambizione professionale senza che ne risenta lo spirito di squadra?","C1","frage"],
      ["Woran erkennt man eigentlich, ob eine Beförderung tatsächlich verdient oder bloß Ausdruck von Vetternwirtschaft ist?","Da cosa si riconosce, in realtà, se una promozione è davvero meritata o è solo espressione di nepotismo?","C1","frage"],
      ["Ließe sich der Fachkräftemangel nicht lindern, wenn Unternehmen mutiger in Weiterbildung investierten?","Non si potrebbe alleviare la carenza di personale qualificato se le aziende investissero con più coraggio nella formazione?","C1","frage"],
      ["Inwiefern rechtfertigt wirtschaftlicher Erfolg eigentlich einen rauen Umgangston innerhalb eines Unternehmens?","In che misura il successo economico giustifica davvero un tono di comunicazione brusco all'interno di un'azienda?","C1","frage"],
      ["Wer sich einmal den Ruf der Unzuverlässigkeit erworben hat, tut sich im Berufsleben ungleich schwerer.","Chi si è guadagnato una fama di inaffidabilità fa molta più fatica nella vita professionale.","C1","nebensatz"],
      ["Während der Vorstand nach außen Zuversicht demonstrierte, wuchsen intern die Zweifel an der Strategie.","Mentre il consiglio direttivo mostrava fiducia all'esterno, internamente crescevano i dubbi sulla strategia.","C1","nebensatz"],
      ["Da sich die Belegschaft seit Monaten überlastet fühlte, überrascht der plötzliche Anstieg der Kündigungen kaum.","Poiché il personale si sentiva sovraccarico da mesi, il brusco aumento delle dimissioni sorprende ben poco.","C1","nebensatz"],
      ["Sofern sich an den Arbeitsbedingungen nichts Grundlegendes ändert, dürfte die Fluktuation weiter zunehmen.","A meno che le condizioni di lavoro non cambino radicalmente, il turnover è destinato ad aumentare ulteriormente.","C1","nebensatz"],
      ["Dass ausgerechnet diejenigen, die am lautesten von Teamgeist sprechen, im entscheidenden Moment am wenigsten Verantwortung übernehmen, gehört zu den bitteren Ironien des Berufslebens.","Che siano proprio coloro che parlano più forte di spirito di squadra ad assumersi meno responsabilità nel momento decisivo è una delle amare ironie della vita professionale.","C2","aussage"],
      ["Der vielzitierte Fachkräftemangel entpuppt sich bei genauerem Hinsehen häufig als hausgemachtes Problem mangelnder Wertschätzung.","La tanto citata carenza di manodopera qualificata si rivela spesso, a un'analisi più attenta, un problema autoinflitto di mancata valorizzazione.","C2","aussage"],
      ["Wer glaubt, mit reiner Willenskraft ließen sich strukturelle Missstände am Arbeitsplatz beheben, verkennt gründlich die Trägheit gewachsener Organisationen.","Chi crede che con la sola forza di volontà si possano risolvere disfunzioni strutturali sul posto di lavoro fraintende profondamente l'inerzia delle organizzazioni consolidate.","C2","aussage"],
      ["Es steht zu befürchten, dass die vielbeschworene Vier-Tage-Woche für viele Branchen noch lange Zukunftsmusik bleiben wird.","C'è da temere che la tanto decantata settimana lavorativa di quattro giorni resti, per molti settori, ancora a lungo pura fantasia.","C2","aussage"],
      ["Zwischen dem, was Unternehmen in Hochglanzbroschüren versprechen, und dem, was Mitarbeiter im Alltag tatsächlich erleben, tut sich mitunter ein beträchtlicher Graben auf.","Tra ciò che le aziende promettono negli opuscoli patinati e ciò che i dipendenti vivono realmente ogni giorno si apre a volte un notevole solco.","C2","aussage"],
      ["Die stille Übereinkunft, wonach Führungskräfte grundsätzlich als Erste kommen und als Letzte gehen, hält sich hartnäckiger als jede offizielle Regelung.","La tacita convenzione secondo cui i dirigenti debbano essere sempre i primi ad arrivare e gli ultimi ad andarsene resiste più tenacemente di qualsiasi regola ufficiale.","C2","aussage"],
      ["Erst wenn die Routine ins Stocken gerät, offenbart sich, wie brüchig das Fundament mancher eingespielter Arbeitsabläufe tatsächlich ist.","Solo quando la routine si inceppa si rivela quanto fragile sia in realtà il fondamento di certi processi lavorativi consolidati.","C2","aussage"],
      ["Dass Fleiß allein selten zum beruflichen Aufstieg genügt, gehört zu den unbequemen Wahrheiten, über die kaum jemand offen spricht.","Che la sola diligenza raramente basti per fare carriera è una di quelle scomode verità di cui quasi nessuno parla apertamente.","C2","aussage"],
      ["Die Bereitschaft, Fehler einzugestehen, gilt in vielen Unternehmenskulturen paradoxerweise nach wie vor als Schwäche statt als Stärke.","La disponibilità ad ammettere i propri errori è, paradossalmente, ancora considerata in molte culture aziendali un segno di debolezza piuttosto che di forza.","C2","aussage"],
      ["Wer sich dem Diktat ständiger Erreichbarkeit widersetzt, gilt in manchen Kreisen schnell als mangelnd engagiert.","Chi si oppone al diktat della reperibilità costante viene presto etichettato, in certi ambienti, come poco impegnato.","C2","aussage"],
      ["Nicht selten sind es die unscheinbarsten Mitarbeiter, die im Verborgenen den reibungslosen Ablauf eines ganzen Unternehmens sichern.","Non di rado sono i dipendenti più anonimi a garantire, nell'ombra, il funzionamento senza intoppi di un'intera azienda.","C2","aussage"],
      ["Der Mythos der reinen Meritokratie am Arbeitsplatz übersieht geflissentlich, wie viel Zufall und Herkunft tatsächlich über Karrieren entscheiden.","Il mito della pura meritocrazia sul lavoro ignora deliberatamente quanto il caso e le origini determinino in realtà le carriere.","C2","aussage"],
      ["Was landläufig als gesunder Ehrgeiz durchgeht, grenzt bei näherem Hinsehen bisweilen schon an Selbstausbeutung.","Ciò che comunemente passa per sana ambizione sfiora talvolta, a uno sguardo più attento, già lo sfruttamento di sé stessi.","C2","aussage"],
      ["Die Vorstellung, Arbeit und Berufung müssten stets zusammenfallen, setzt viele Berufstätige einem stillen, aber beständigen Druck aus.","L'idea che lavoro e vocazione debbano sempre coincidere sottopone molti lavoratori a una pressione silenziosa ma costante.","C2","aussage"],
      ["Kaum etwas untergräbt das Vertrauen in eine Führungskraft so nachhaltig wie das Gefühl, für dumm verkauft zu werden.","Poche cose minano la fiducia in un dirigente in modo così duraturo quanto la sensazione di essere presi in giro.","C2","aussage"],
      ["Lässt sich der vielbeschworene Purpose eines Unternehmens überhaupt glaubwürdig vermitteln, wenn die Realität im Arbeitsalltag eine ganz andere Sprache spricht?","Si può davvero comunicare in modo credibile il tanto celebrato scopo di un'azienda, quando la realtà della vita lavorativa quotidiana racconta tutt'altro?","C2","frage"],
      ["Woran liegt es, dass ausgerechnet die engagiertesten Mitarbeiter am ehesten von Erschöpfung bedroht sind?","Da cosa dipende il fatto che siano proprio i dipendenti più impegnati a rischiare di più l'esaurimento?","C2","frage"],
      ["Wäre es nicht an der Zeit, den Mythos vom unentbehrlichen Mitarbeiter endlich zu den Akten zu legen?","Non sarebbe ora di archiviare finalmente il mito del dipendente insostituibile?","C2","frage"],
      ["Inwieweit prägt die Sprache, in der über Arbeit gesprochen wird, letztlich auch das Selbstverständnis der Arbeitenden?","In che misura il linguaggio con cui si parla del lavoro finisce per plasmare anche l'immagine che i lavoratori hanno di sé stessi?","C2","frage"],
      ["Während die einen im ständigen Multitasking ein Zeichen von Effizienz erblicken, halten andere es für den sicheren Weg in die Erschöpfung.","Mentre alcuni vedono nel continuo multitasking un segno di efficienza, altri lo considerano la via sicura verso l'esaurimento.","C2","nebensatz"],
      ["Sosehr sich Unternehmen auch um flache Hierarchien bemühen, so beharrlich behaupten sich am Ende doch die alten Machtstrukturen.","Per quanto le aziende si sforzino di adottare gerarchie orizzontali, alla fine le vecchie strutture di potere si affermano comunque con ostinazione.","C2","nebensatz"],
      ["Obgleich niemand offen zugibt, nach Statussymbolen zu streben, richtet sich die Bürogestaltung in den meisten Unternehmen erstaunlich genau danach.","Sebbene nessuno ammetta apertamente di ambire a simboli di status, l'arredamento degli uffici nella maggior parte delle aziende si orienta con sorprendente precisione proprio a questo.","C2","nebensatz"],
      ["Wer einmal erlebt hat, wie schnell jahrelanges Vertrauen durch eine einzige Fehlentscheidung zerstört werden kann, geht mit Verantwortung fortan behutsamer um.","Chi ha sperimentato quanto rapidamente anni di fiducia possano essere distrutti da un'unica decisione sbagliata, da allora gestisce la responsabilità con maggiore cautela.","C2","nebensatz"],
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
      ["Obgleich sich die Geschwister äußerlich kaum ähnelten, verband sie ein stillschweigendes Einverständnis, das keiner Worte bedurfte.","Sebbene i fratelli si somigliassero poco esteriormente, li univa un'intesa tacita che non aveva bisogno di parole.","C2","nebensatz"],
      ["Meine Tante wohnt in Frankreich.","Mia zia abita in Francia.","A1","aussage"],
      ["Mein Opa ist sehr lustig.","Mio nonno è molto simpatico.","A1","aussage"],
      ["Ich habe eine kleine Schwester.","Ho una sorellina.","A1","aussage"],
      ["Meine Cousine ist Studentin.","Mia cugina è studentessa.","A1","aussage"],
      ["Wir feiern heute Omas Geburtstag.","Oggi festeggiamo il compleanno della nonna.","A1","aussage"],
      ["Mein Vater kocht sehr gern.","A mio padre piace molto cucinare.","A1","aussage"],
      ["Meine Freundin heißt Laura.","La mia amica si chiama Laura.","A1","aussage"],
      ["Der Hund gehört meiner Schwester.","Il cane è di mia sorella.","A1","aussage"],
      ["Meine Eltern sind sehr geduldig.","I miei genitori sono molto pazienti.","A1","aussage"],
      ["Ich liebe meine Familie sehr.","Amo molto la mia famiglia.","A1","aussage"],
      ["Mein Bruder spielt Gitarre.","Mio fratello suona la chitarra.","A1","aussage"],
      ["Meine Nichte ist noch ein Baby.","Mia nipote è ancora una neonata.","A1","aussage"],
      ["Wir wohnen bei meinen Eltern.","Viviamo dai miei genitori.","A1","aussage"],
      ["Meine Mutter arbeitet als Ärztin.","Mia madre lavora come medico.","A1","aussage"],
      ["Meine Freunde kommen heute Abend.","I miei amici vengono stasera.","A1","aussage"],
      ["Wie alt ist dein Bruder?","Quanti anni ha tuo fratello?","A1","frage"],
      ["Wohnt deine Familie in Deutschland?","La tua famiglia abita in Germania?","A1","frage"],
      ["Hast du viele Cousins?","Hai molti cugini?","A1","frage"],
      ["Kommst du heute mit deiner Familie?","Vieni oggi con la tua famiglia?","A1","frage"],
      ["Ich besuche meine Oma, wenn ich Zeit habe.","Vado a trovare mia nonna quando ho tempo.","A1","nebensatz"],
      ["Ich bin traurig, weil mein Freund wegzieht.","Sono triste perché il mio amico trasloca.","A1","nebensatz"],
      ["Ich lache viel, wenn meine Familie da ist.","Rido molto quando c'è la mia famiglia.","A1","nebensatz"],
      ["Meine Schwester weint, weil sie müde ist.","Mia sorella piange perché è stanca.","A1","nebensatz"],
      ["Meine Schwester hat letztes Wochenende ihren Freund vorgestellt.","Il fine settimana scorso mia sorella ha presentato il suo ragazzo.","A2","aussage"],
      ["Wir haben gemeinsam ein Puzzle zusammengesetzt.","Abbiamo montato insieme un puzzle.","A2","aussage"],
      ["Mein Opa hat mir gestern eine alte Geschichte erzählt.","Ieri mio nonno mi ha raccontato una vecchia storia.","A2","aussage"],
      ["Meine Eltern sind am Wochenende zu uns gekommen.","I miei genitori sono venuti da noi nel weekend.","A2","aussage"],
      ["Ich muss meiner Schwester beim Umzug helfen.","Devo aiutare mia sorella con il trasloco.","A2","aussage"],
      ["Mein Cousin hat einen neuen Hund bekommen.","Mio cugino ha preso un nuovo cane.","A2","aussage"],
      ["Wir haben den Geburtstag meines Vaters gefeiert.","Abbiamo festeggiato il compleanno di mio padre.","A2","aussage"],
      ["Meine Tante ruft mich jeden Sonntag an.","Mia zia mi chiama ogni domenica.","A2","aussage"],
      ["Meine Nichte hat gerade laufen gelernt.","Mia nipote ha appena imparato a camminare.","A2","aussage"],
      ["Ich habe meinen Bruder am Flughafen abgeholt.","Ho preso mio fratello all'aeroporto.","A2","aussage"],
      ["Meine Großeltern sind vor Kurzem umgezogen.","I miei nonni si sono trasferiti da poco.","A2","aussage"],
      ["Wir haben lange über die Zukunft gesprochen.","Abbiamo parlato a lungo del futuro.","A2","aussage"],
      ["Meine Mutter hat mir beim Kochen geholfen.","Mia madre mi ha aiutato a cucinare.","A2","aussage"],
      ["Mein Bruder will nächstes Jahr heiraten.","Mio fratello vuole sposarsi il prossimo anno.","A2","aussage"],
      ["Wir haben unsere Cousins lange nicht getroffen.","Non abbiamo incontrato i nostri cugini da tanto tempo.","A2","aussage"],
      ["Habt ihr euren Opa schon angerufen?","Avete già chiamato vostro nonno?","A2","frage"],
      ["Wolltest du deine Schwester nicht besuchen?","Non volevi andare a trovare tua sorella?","A2","frage"],
      ["Kannst du mir bei der Familienfeier helfen?","Puoi aiutarmi con la festa di famiglia?","A2","frage"],
      ["Ist deine Tante schon angekommen?","È già arrivata tua zia?","A2","frage"],
      ["Ich rufe meinen Bruder an, weil ich seine Hilfe brauche.","Chiamo mio fratello perché ho bisogno del suo aiuto.","A2","nebensatz"],
      ["Wir bleiben länger, wenn meine Eltern zu Besuch sind.","Restiamo più a lungo quando i miei genitori sono in visita.","A2","nebensatz"],
      ["Ich glaube, dass meine Schwester bald ein Kind bekommt.","Penso che mia sorella avrà presto un bambino.","A2","nebensatz"],
      ["Meine Oma freut sich, wenn wir sie besuchen.","Mia nonna è contenta quando andiamo a trovarla.","A2","nebensatz"],
      ["Meine Schwester würde gern öfter zu Besuch kommen, aber die Entfernung ist groß.","A mia sorella piacerebbe venire a trovarci più spesso, ma la distanza è grande.","B1","aussage"],
      ["Als Kind saß ich stundenlang unter dem Küchentisch und hörte den Erwachsenen zu.","Da bambino stavo per ore seduto sotto il tavolo della cucina ad ascoltare gli adulti.","B1","aussage"],
      ["Wir hängen jedes Jahr ein Foto der ganzen Familie an die Wand im Flur.","Ogni anno appendiamo alla parete del corridoio una foto di tutta la famiglia.","B1","aussage"],
      ["Mein Großvater legte den Brief immer sorgfältig in die Schublade seines Schreibtisches.","Mio nonno metteva sempre con cura la lettera nel cassetto della sua scrivania.","B1","aussage"],
      ["Ich würde meiner Nichte gern mehr Zeit widmen, aber der Alltag lässt es kaum zu.","Vorrei dedicare più tempo a mia nipote, ma la routine quotidiana lo permette a malapena.","B1","aussage"],
      ["Meine Schwiegereltern setzten sich beim Familienessen immer an denselben Platz.","I miei suoceri si sedevano sempre allo stesso posto durante il pranzo di famiglia.","B1","aussage"],
      ["Ich stelle die Familienfotos gern auf das Regal im Wohnzimmer.","Metto volentieri le foto di famiglia sullo scaffale del soggiorno.","B1","aussage"],
      ["Mein Onkel wohnte früher direkt neben meinen Großeltern.","Mio zio prima abitava proprio accanto ai miei nonni.","B1","aussage"],
      ["Ich hätte nichts dagegen, wenn meine Eltern uns öfter besuchen würden.","Non avrei nulla in contrario se i miei genitori ci venissero a trovare più spesso.","B1","aussage"],
      ["Meine Cousine zog mit achtzehn Jahren in eine eigene Wohnung.","Mia cugina a diciotto anni andò a vivere in un appartamento tutto suo.","B1","aussage"],
      ["Meine Mutter legte großen Wert darauf, dass wir alle zusammen aßen.","Mia madre teneva molto a che mangiassimo tutti insieme.","B1","aussage"],
      ["Ich würde meiner Schwester gern helfen, aber sie bittet nie um Hilfe.","Vorrei aiutare mia sorella, ma lei non chiede mai aiuto.","B1","aussage"],
      ["Wir setzen die kleinen Kinder beim Essen immer zwischen die Erwachsenen.","A tavola mettiamo sempre i bambini piccoli tra gli adulti.","B1","aussage"],
      ["Mein Vater stellte sein Werkzeug immer unter die Treppe im Keller.","Mio padre metteva sempre i suoi attrezzi sotto le scale in cantina.","B1","aussage"],
      ["Meine Tante würde sich freuen, wenn wir sie öfter anrufen würden.","Mia zia sarebbe contenta se la chiamassimo più spesso.","B1","aussage"],
      ["Könnten wir das Familientreffen vielleicht auf nächstes Wochenende verschieben?","Potremmo forse spostare la riunione di famiglia al prossimo weekend?","B1","frage"],
      ["Wüsstest du, ob meine Cousine dieses Jahr zu Weihnachten kommt?","Sapresti se mia cugina viene per Natale quest'anno?","B1","frage"],
      ["Woran erinnerst du dich am liebsten aus deiner Kindheit?","Di che cosa ti ricordi più volentieri della tua infanzia?","B1","frage"],
      ["Hättest du Lust, das Familienfoto dieses Jahr zu organisieren?","Avresti voglia di organizzare la foto di famiglia quest'anno?","B1","frage"],
      ["Ich vermisse meine Großeltern, obwohl ich sie erst letzte Woche besucht habe.","Mi mancano i miei nonni, anche se li ho visitati solo la settimana scorsa.","B1","nebensatz"],
      ["Sobald meine Tochter aus der Schule kommt, essen wir gemeinsam zu Mittag.","Non appena mia figlia torna da scuola, pranziamo insieme.","B1","nebensatz"],
      ["Während mein Bruder studierte, wohnte ich noch bei meinen Eltern.","Mentre mio fratello studiava, io vivevo ancora dai miei genitori.","B1","nebensatz"],
      ["Die Tante, die mich als Kind oft gehütet hat, lebt jetzt in Portugal.","La zia che spesso mi faceva da babysitter da bambino ora vive in Portogallo.","B1","nebensatz"],
      ["Die Erziehung der Kinder wurde in unserer Familie traditionell den Großeltern überlassen.","L'educazione dei figli nella nostra famiglia veniva tradizionalmente affidata ai nonni.","B2","aussage"],
      ["Trotz der räumlichen Distanz zwischen den Geschwistern blieb der familiäre Zusammenhalt bestehen.","Nonostante la distanza fisica tra i fratelli, la coesione familiare è rimasta intatta.","B2","aussage"],
      ["Die Versöhnung zwischen meinem Vater und seinem Bruder wurde erst nach dem Tod der Großmutter möglich.","La riconciliazione tra mio padre e suo fratello divenne possibile solo dopo la morte della nonna.","B2","aussage"],
      ["Allerdings wird die Pflege der alternden Eltern in unserer Familie fast ausschließlich von meiner Schwester übernommen.","Tuttavia, la cura dei genitori anziani nella nostra famiglia viene assunta quasi esclusivamente da mia sorella.","B2","aussage"],
      ["Die Erbschaft des Großvaters wurde unter allen Enkelkindern zu gleichen Teilen aufgeteilt.","L'eredità del nonno è stata divisa in parti uguali tra tutti i nipoti.","B2","aussage"],
      ["Dennoch bleibt die Beziehung zwischen den beiden Schwestern von einer gewissen Distanz geprägt.","Ciononostante, il rapporto tra le due sorelle resta segnato da una certa distanza.","B2","aussage"],
      ["Der plötzliche Umzug meiner Eltern ins Ausland stellte die ganze Familie vor große Herausforderungen.","L'improvviso trasferimento dei miei genitori all'estero ha messo tutta la famiglia di fronte a grandi sfide.","B2","aussage"],
      ["Die Rolle des ältesten Sohnes wird in dieser Familie traditionell mit besonderer Verantwortung verbunden.","Il ruolo del figlio maggiore in questa famiglia è tradizionalmente legato a una particolare responsabilità.","B2","aussage"],
      ["Obwohl meine Eltern beruflich stark eingespannt waren, wurde die Kindheit meiner Schwester keineswegs vernachlässigt.","Sebbene i miei genitori fossero molto impegnati professionalmente, l'infanzia di mia sorella non fu affatto trascurata.","B2","aussage"],
      ["Die Entscheidung meiner Cousine, ins Ausland zu ziehen, wurde von der gesamten Verwandtschaft kontrovers diskutiert.","La decisione di mia cugina di trasferirsi all'estero fu discussa in modo controverso da tutta la parentela.","B2","aussage"],
      ["Der Zusammenhalt unserer Großfamilie wird jedes Jahr durch ein aufwendig organisiertes Sommerfest gefestigt.","La coesione della nostra famiglia numerosa viene rafforzata ogni anno da una festa estiva organizzata con cura.","B2","aussage"],
      ["Die Verantwortung für die Pflege des kranken Vaters wurde nie klar zwischen den Geschwistern geregelt.","La responsabilità della cura del padre malato non fu mai chiaramente regolata tra i fratelli.","B2","aussage"],
      ["Meine Schwiegereltern würden es begrüßen, öfter in die Erziehung ihrer Enkelkinder einbezogen zu werden.","I miei suoceri accoglierebbero volentieri l'idea di essere coinvolti più spesso nell'educazione dei nipoti.","B2","aussage"],
      ["Die Adoption meines jüngeren Cousins wurde innerhalb der Familie lange Zeit verschwiegen.","L'adozione di mio cugino minore fu taciuta a lungo all'interno della famiglia.","B2","aussage"],
      ["Allerdings zeigte sich bald, dass die Erwartungen meiner Schwiegermutter kaum zu erfüllen waren.","Tuttavia si è visto presto che le aspettative di mia suocera erano difficili da soddisfare.","B2","aussage"],
      ["Warum wird die Meinung der jüngeren Familienmitglieder bei wichtigen Entscheidungen so selten berücksichtigt?","Perché l'opinione dei membri più giovani della famiglia viene considerata così raramente nelle decisioni importanti?","B2","frage"],
      ["Sollte die Aufteilung des Erbes nicht schriftlich und rechtzeitig geregelt werden?","Non si dovrebbe regolare per iscritto e per tempo la divisione dell'eredità?","B2","frage"],
      ["Wie lässt sich der Kontakt zu entfernten Verwandten trotz des hektischen Alltags aufrechterhalten?","Come si può mantenere il contatto con i parenti lontani nonostante la vita frenetica?","B2","frage"],
      ["Weshalb wurde die Erziehung meiner Schwester so viel strenger gehandhabt als meine?","Perché l'educazione di mia sorella fu gestita in modo molto più severo della mia?","B2","frage"],
      ["Obwohl die Beziehung zu meiner Schwiegermutter anfangs schwierig war, hat sich das Verhältnis mit der Zeit deutlich entspannt.","Sebbene il rapporto con mia suocera fosse difficile all'inizio, col tempo si è notevolmente rasserenato.","B2","nebensatz"],
      ["Während meine Eltern die Verantwortung für das Familienunternehmen trugen, kümmerte sich meine Tante um den Haushalt.","Mentre i miei genitori portavano la responsabilità dell'azienda di famiglia, mia zia si occupava della casa.","B2","nebensatz"],
      ["Da die Beziehung zwischen den Cousins seit der Erbstreitigkeit zerrüttet war, mieden sie sich auf Familienfeiern.","Poiché il rapporto tra i cugini era compromesso fin dalla lite per l'eredità, si evitavano alle riunioni di famiglia.","B2","nebensatz"],
      ["Nachdem die Vormundschaft für die Nichte gerichtlich geregelt worden war, beruhigte sich die Situation innerhalb der Familie.","Dopo che la tutela della nipote era stata regolata per via giudiziaria, la situazione in famiglia si è calmata.","B2","nebensatz"],
      ["Vom Vater früh im Stich gelassen, entwickelte sie ein außergewöhnlich starkes Verantwortungsbewusstsein gegenüber ihren jüngeren Geschwistern.","Abbandonata presto dal padre, sviluppò un senso di responsabilità straordinariamente forte verso i fratelli minori.","C1","aussage"],
      ["Es gehört zu den stillen Gewissheiten mancher Familien, dass über bestimmte Dinge einfach nicht gesprochen wird.","Fa parte delle tacite certezze di certe famiglie il fatto che di determinate cose semplicemente non si parli.","C1","aussage"],
      ["Der Onkel erklärte auf der Feier, er sei mit dem Verlauf seines Lebens im Großen und Ganzen zufrieden.","Lo zio dichiarò alla festa di essere, tutto sommato, soddisfatto del corso della propria vita.","C1","aussage"],
      ["Getragen von der stillschweigenden Unterstützung ihrer Mutter, wagte sie schließlich den Bruch mit der Familientradition.","Sostenuta dal tacito appoggio della madre, osò infine rompere con la tradizione familiare.","C1","aussage"],
      ["Es steht außer Frage, dass familiäre Bindungen selbst die härtesten Krisen zu überdauern vermögen.","Non c'è dubbio che i legami familiari riescano a sopravvivere anche alle crisi più dure.","C1","aussage"],
      ["Von Kindheit an dazu erzogen, Konflikte zu vermeiden, tat sie sich als Erwachsene schwer mit offener Kritik.","Educata fin dall'infanzia a evitare i conflitti, da adulta faceva fatica ad accettare critiche esplicite.","C1","aussage"],
      ["Man sagt meiner Großmutter nach, sie habe nie ein böses Wort über ihre Schwiegertochter verloren.","Si dice di mia nonna che non abbia mai detto una parola cattiva su sua nuora.","C1","aussage"],
      ["Enttäuscht von den ständigen Absagen ihres Bruders, hörte sie irgendwann auf, ihn zu Familienfesten einzuladen.","Delusa dai continui rifiuti del fratello, a un certo punto smise di invitarlo alle feste di famiglia.","C1","aussage"],
      ["Es gilt in unserer Familie als ausgemachte Sache, dass die Weihnachtsfeier stets bei den Großeltern stattfindet.","Nella nostra famiglia è considerato scontato che la festa di Natale si svolga sempre dai nonni.","C1","aussage"],
      ["Von klein auf mit hohen Erwartungen konfrontiert, entwickelte er früh einen ausgeprägten Hang zum Perfektionismus.","Confrontato fin da piccolo con grandi aspettative, sviluppò presto una spiccata tendenza al perfezionismo.","C1","aussage"],
      ["Die Großmutter beteuerte, sie hege keinerlei Groll gegen ihre entfremdete Tochter.","La nonna assicurò di non nutrire alcun rancore verso la figlia da cui si era allontanata.","C1","aussage"],
      ["Getrieben von der Sorge um ihre kranke Mutter, sagte sie sämtliche beruflichen Verpflichtungen kurzerhand ab.","Spinta dalla preoccupazione per la madre malata, annullò senza esitazione tutti gli impegni professionali.","C1","aussage"],
      ["Es liegt mir fern, die Entscheidung meiner Eltern nachträglich zu verurteilen, auch wenn ich sie damals nicht verstand.","Non è mia intenzione condannare a posteriori la decisione dei miei genitori, anche se all'epoca non la capii.","C1","aussage"],
      ["Zwischen den Zeilen ihrer Briefe ließ sich unschwer erkennen, wie sehr sie sich nach ihrer Heimatfamilie sehnte.","Tra le righe delle sue lettere si poteva facilmente cogliere quanto le mancasse la famiglia d'origine.","C1","aussage"],
      ["Kaum etwas bindet Geschwister so nachhaltig aneinander wie gemeinsam durchlebtes Leid.","Poche cose legano i fratelli in modo così duraturo quanto un dolore vissuto insieme.","C1","aussage"],
      ["Inwieweit prägt die Reihenfolge der Geburt tatsächlich den späteren Charakter eines Menschen?","In che misura l'ordine di nascita influenza davvero il carattere futuro di una persona?","C1","frage"],
      ["Woran mag es liegen, dass manche Familiengeheimnisse über Generationen hinweg so hartnäckig gehütet werden?","Da cosa dipenderà il fatto che certi segreti di famiglia vengano custoditi con tanta ostinazione per generazioni?","C1","frage"],
      ["Ließe sich das zerrüttete Verhältnis zu meinem Bruder überhaupt noch kitten, oder ist es dafür zu spät?","Si potrebbe ancora ricucire il rapporto compromesso con mio fratello, o è ormai troppo tardi?","C1","frage"],
      ["Wie weit reicht eigentlich die Verpflichtung, sich um in Ungnade gefallene Verwandte zu kümmern?","Fino a che punto arriva davvero l'obbligo di prendersi cura di parenti caduti in disgrazia?","C1","frage"],
      ["Wer als Kind ständig zwischen den Fronten zerstrittener Eltern stand, trägt davon oft ein Leben lang Spuren.","Chi da bambino si è trovato costantemente tra i fuochi incrociati di genitori in conflitto ne porta spesso i segni per tutta la vita.","C1","nebensatz"],
      ["Während die Großmutter zeitlebens am Familienbetrieb festhielt, sehnte sich ihr Sohn nach einem gänzlich anderen Leben.","Mentre la nonna per tutta la vita rimase attaccata all'azienda di famiglia, suo figlio desiderava una vita del tutto diversa.","C1","nebensatz"],
      ["Da die Geschwister seit der Kindheit in ständiger Rivalität zueinander standen, überrascht ihre heutige Entfremdung kaum jemanden.","Poiché fin dall'infanzia i fratelli erano in costante rivalità tra loro, la loro attuale estraneità non sorprende quasi nessuno.","C1","nebensatz"],
      ["Sofern man den familiären Erwartungen nicht irgendwann bewusst entgegentritt, läuft man Gefahr, sich selbst dabei zu verlieren.","A meno che non ci si opponga consapevolmente, prima o poi, alle aspettative familiari, si rischia di perdere sé stessi.","C1","nebensatz"],
      ["Dass Blut angeblich dicker als Wasser sei, hindert so manche Familie nicht daran, sich über Jahrzehnte hinweg in eisigem Schweigen zu üben.","Che il sangue sia più denso dell'acqua, come si dice, non impedisce a certe famiglie di esercitarsi per decenni in un gelido silenzio.","C2","aussage"],
      ["Die Vorstellung einer heilen Familie erweist sich bei genauerem Hinsehen oft als nachträglich zurechtgelegte Erzählung, die mit der gelebten Wirklichkeit wenig gemein hat.","L'idea di una famiglia perfetta si rivela spesso, a un'analisi più attenta, un racconto costruito a posteriori che ha poco a che fare con la realtà vissuta.","C2","aussage"],
      ["Wer glaubt, familiäre Wunden heilten von selbst mit der Zeit, unterschätzt gewaltig, wie hartnäckig ungesagte Dinge über Generationen hinweg fortwirken.","Chi crede che le ferite familiari guariscano da sole con il tempo sottovaluta enormemente quanto ostinatamente le cose non dette continuino a farsi sentire per generazioni.","C2","aussage"],
      ["Es steht zu befürchten, dass sich das Schweigen über die Vergangenheit der Großeltern irgendwann bitter rächen wird.","C'è da temere che il silenzio sul passato dei nonni si vendicherà amaramente prima o poi.","C2","aussage"],
      ["Zwischen dem Anspruch, allen Familienmitgliedern gleichermaßen gerecht zu werden, und der Erfahrung, es letztlich niemandem recht machen zu können, bewegt sich wohl jedes Elternteil.","Tra la pretesa di essere equi con tutti i membri della famiglia allo stesso modo e l'esperienza di non riuscire ad accontentare nessuno, si muove probabilmente ogni genitore.","C2","aussage"],
      ["Die stille Erwartung, das eigene Leben müsse sich an den Wünschen der Eltern messen lassen, prägt manche Biografien bis ins hohe Alter.","La tacita aspettativa che la propria vita debba misurarsi con i desideri dei genitori segna alcune biografie fino alla vecchiaia.","C2","aussage"],
      ["Erst der eigene Nachwuchs offenbart vielen, wie sehr sie unbewusst die Muster ihrer Eltern wiederholen.","Solo la propria prole rivela a molti quanto inconsapevolmente ripetano gli schemi dei propri genitori.","C2","aussage"],
      ["Dass Geschwisterrivalität selten gänzlich verschwindet, sondern sich im Erwachsenenalter bloß raffinierter tarnt, gehört zu den unbequemen Wahrheiten der Familienpsychologie.","Che la rivalità tra fratelli raramente scompaia del tutto, ma in età adulta si mascheri solo più abilmente, è una delle scomode verità della psicologia familiare.","C2","aussage"],
      ["Die Rolle des Sündenbocks, einmal einem Familienmitglied zugewiesen, lässt sich erstaunlich selten wieder ablegen.","Il ruolo del capro espiatorio, una volta assegnato a un membro della famiglia, si riesce sorprendentemente di rado a scrollarselo di dosso.","C2","aussage"],
      ["Nicht wenige Familiengeheimnisse kommen ausgerechnet dann ans Licht, wenn niemand mehr da ist, der Rede und Antwort stehen könnte.","Non pochi segreti di famiglia vengono alla luce proprio quando non c'è più nessuno in grado di rendere conto.","C2","aussage"],
      ["Was gemeinhin als bedingungslose Geschwisterliebe gefeiert wird, hält einer nüchternen Betrachtung nicht immer stand.","Ciò che comunemente viene celebrato come amore fraterno incondizionato non sempre regge a un esame lucido.","C2","aussage"],
      ["Der Wunsch, es in der eigenen Erziehung anders zu machen als die eigenen Eltern, gerät im Alltag rasch an seine Grenzen.","Il desiderio di educare diversamente da come sono stati educati i propri genitori si scontra rapidamente con i limiti della vita quotidiana.","C2","aussage"],
      ["Manche Familien halten den äußeren Schein der Harmonie mit einer Beharrlichkeit aufrecht, die im umgekehrten Verhältnis zur tatsächlichen Nähe steht.","Alcune famiglie mantengono l'apparenza esteriore dell'armonia con una tenacia inversamente proporzionale alla vicinanza reale.","C2","aussage"],
      ["Die vermeintlich harmlose Frage nach dem Lieblingskind bringt in so mancher Familie jahrzehntealte Verletzungen unversehens wieder an die Oberfläche.","L'apparentemente innocua domanda su chi sia il figlio preferito riporta a galla, in certe famiglie, ferite vecchie di decenni.","C2","aussage"],
      ["Erst im Rückblick erkennt man häufig, wie viel stillschweigende Fürsorge sich hinter der scheinbaren Distanz eines Elternteils verborgen hatte.","Solo con il senno di poi si riconosce spesso quanta tacita premura si celasse dietro l'apparente distanza di un genitore.","C2","aussage"],
      ["Lässt sich der oft zitierte Satz, man könne sich seine Familie nicht aussuchen, wohl eher als Trost oder als Resignation verstehen?","La frase spesso citata secondo cui non si può scegliere la propria famiglia va intesa piuttosto come una consolazione o come una resa?","C2","frage"],
      ["Woran liegt es eigentlich, dass ausgerechnet in den engsten Beziehungen am seltensten offen über Verletzungen gesprochen wird?","Da cosa dipende, in fondo, il fatto che proprio nei rapporti più stretti si parli più raramente in modo aperto delle ferite subite?","C2","frage"],
      ["Vermag eine nachträgliche Entschuldigung überhaupt zu heilen, was über eine ganze Kindheit hinweg versäumt wurde?","Delle scuse tardive possono davvero sanare ciò che è mancato per un'intera infanzia?","C2","frage"],
      ["Wo genau verläuft die Grenze zwischen liebevoller Rücksicht und der stillschweigenden Aufopferung des eigenen Lebens für die Familie?","Dove passa esattamente il confine tra premurosa considerazione e il tacito sacrificio della propria vita per la famiglia?","C2","frage"],
      ["So sehr man sich auch bemüht, die eigenen Kinder anders zu behandeln als man selbst behandelt wurde, so oft ertappt man sich bei genau denselben Reaktionen.","Per quanto ci si sforzi di trattare i propri figli diversamente da come si è stati trattati, altrettanto spesso ci si sorprende nelle medesime identiche reazioni.","C2","nebensatz"],
      ["Während die eine Schwester zeitlebens die Rolle der Vermittlerin übernahm, zog sich die andere zunehmend aus dem Familiengeschehen zurück.","Mentre una sorella assunse per tutta la vita il ruolo di mediatrice, l'altra si ritirò sempre più dalle vicende familiari.","C2","nebensatz"],
      ["Obgleich zwischen den Brüdern nie ein offenes Wort über die alte Kränkung fiel, spürte doch jeder, dass sie nie ganz verwunden war.","Sebbene tra i fratelli non fosse mai stata detta apertamente una parola sul vecchio torto, ciascuno sentiva che non era mai stato del tutto superato.","C2","nebensatz"],
      ["Wer einmal miterlebt hat, wie eine ganze Familie am Sterbebett eines geliebten Menschen zueinanderfindet, versteht plötzlich, wie zerbrechlich vermeintlich unüberwindbare Zerwürfnisse tatsächlich sind.","Chi ha vissuto in prima persona come un'intera famiglia si ritrovi unita al capezzale di una persona amata capisce all'improvviso quanto siano in realtà fragili le rotture apparentemente insormontabili.","C2","nebensatz"],
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
      ["Obgleich sein Hobby von außen betrachtet skurril wirkte, verlieh es ihm eine innere Ruhe, die er sonst nirgends fand.","Sebbene il suo hobby apparisse bizzarro dall'esterno, gli conferiva una calma interiore che non trovava altrove.","C2","nebensatz"],
      ["Ich spiele oft Schach mit Opa.","Gioco spesso a scacchi con nonno.","A1","aussage"],
      ["Wir treffen uns heute im Park.","Oggi ci vediamo al parco.","A1","aussage"],
      ["Am Abend schaue ich eine Serie.","La sera guardo una serie.","A1","aussage"],
      ["Sie singt gern im Chor.","A lei piace cantare nel coro.","A1","aussage"],
      ["Ich zeichne gern kleine Tiere.","Mi piace disegnare piccoli animali.","A1","aussage"],
      ["Wir spielen freitags Volleyball.","Il venerdì giochiamo a pallavolo.","A1","aussage"],
      ["Mein Opa angelt jeden Sonntag.","Mio nonno pesca ogni domenica.","A1","aussage"],
      ["Ich sammle bunte Briefmarken.","Colleziono francobolli colorati.","A1","aussage"],
      ["Meine Schwester spielt Federball.","Mia sorella gioca a badminton.","A1","aussage"],
      ["Ich fotografiere gern Blumen.","Mi piace fotografare i fiori.","A1","aussage"],
      ["Er spielt Tischtennis mit Freunden.","Lui gioca a ping pong con gli amici.","A1","aussage"],
      ["Ich reite jeden Mittwoch.","Vado a cavallo ogni mercoledì.","A1","aussage"],
      ["Am Wochenende zelten wir gern.","Il fine settimana ci piace campeggiare.","A1","aussage"],
      ["Ich spiele draußen mit dem Hund.","Gioco fuori con il cane.","A1","aussage"],
      ["Wir gehen sonntags ins Museum.","La domenica andiamo al museo.","A1","aussage"],
      ["Spielst du auch Schach?","Giochi anche tu a scacchi?","A1","frage"],
      ["Malst du gern mit Wasserfarben?","Ti piace dipingere con gli acquerelli?","A1","frage"],
      ["Was ist dein liebstes Hobby?","Qual è il tuo hobby preferito?","A1","frage"],
      ["Triffst du dich oft mit Freunden?","Ti vedi spesso con gli amici?","A1","frage"],
      ["Ich angle gern, weil es ruhig ist.","Mi piace pescare perché è rilassante.","A1","nebensatz"],
      ["Wir spielen drinnen, wenn es regnet.","Giochiamo dentro quando piove.","A1","nebensatz"],
      ["Ich lese Comics, weil sie lustig sind.","Leggo fumetti perché sono divertenti.","A1","nebensatz"],
      ["Ich gehe reiten, wenn ich Zeit habe.","Vado a cavallo quando ho tempo.","A1","nebensatz"],
      ["Ich habe letzte Woche oft Tischtennis gespielt.","La settimana scorsa ho giocato spesso a ping pong.","A2","aussage"],
      ["Wir haben gestern gemeinsam ein Puzzle zusammengebaut.","Ieri abbiamo costruito insieme un puzzle.","A2","aussage"],
      ["Ich möchte am Wochenende Ski fahren lernen.","Il fine settimana vorrei imparare a sciare.","A2","aussage"],
      ["Er hat sich letztes Jahr einer Theatergruppe angeschlossen.","L'anno scorso si è unito a un gruppo teatrale.","A2","aussage"],
      ["Wir haben das Zelt im Garten aufgebaut.","Abbiamo montato la tenda in giardino.","A2","aussage"],
      ["Ich habe letzten Sommer endlich das Schwimmabzeichen geschafft.","L'estate scorsa ho finalmente ottenuto il diploma di nuoto.","A2","aussage"],
      ["Meine Tante hat mich zum Tanzen mitgenommen.","Mia zia mi ha portato a ballare.","A2","aussage"],
      ["Wir haben am Strand den Drachen steigen lassen.","Sulla spiaggia abbiamo fatto volare l'aquilone.","A2","aussage"],
      ["Ich muss meine Gitarrensaiten schon bald wechseln.","Devo cambiare presto le corde della chitarra.","A2","aussage"],
      ["Er hat beim Schach gegen mich gewonnen.","Ha vinto a scacchi contro di me.","A2","aussage"],
      ["Wir haben im Verein einen neuen Trainer bekommen.","Nel club abbiamo un nuovo allenatore.","A2","aussage"],
      ["Ich habe letzten Monat mit Yoga aufgehört.","Il mese scorso ho smesso di fare yoga.","A2","aussage"],
      ["Ich kann seit Kurzem ziemlich gut jonglieren.","Da poco riesco a fare abbastanza bene giocoleria.","A2","aussage"],
      ["Wir haben gestern zusammen im Chor gesungen.","Ieri abbiamo cantato insieme nel coro.","A2","aussage"],
      ["Meine Freunde haben mich zum Klettern überredet.","I miei amici mi hanno convinto ad arrampicare.","A2","aussage"],
      ["Hast du dein Fahrrad schon repariert?","Hai già riparato la tua bicicletta?","A2","frage"],
      ["Wolltest du nicht mit dem Klettern anfangen?","Non volevi iniziare ad arrampicare?","A2","frage"],
      ["Bist du schon mal Ski gefahren?","Sei mai andato a sciare?","A2","frage"],
      ["Nimmst du mich zum Training mit?","Mi porti con te all'allenamento?","A2","frage"],
      ["Ich habe aufgehört, weil ich keine Zeit mehr hatte.","Ho smesso perché non avevo più tempo.","A2","nebensatz"],
      ["Wir gehen zelten, wenn das Wetter mitspielt.","Andiamo in campeggio se il tempo lo permette.","A2","nebensatz"],
      ["Ich glaube, dass Klettern viel Mut braucht.","Penso che arrampicare richieda molto coraggio.","A2","nebensatz"],
      ["Ich habe mitgemacht, weil alle Freunde dabei waren.","Ho partecipato perché c'erano tutti gli amici.","A2","nebensatz"],
      ["Früher spielte ich jeden Tag stundenlang Videospiele.","Prima giocavo ai videogiochi per ore ogni giorno.","B1","aussage"],
      ["Ich würde gern einen Töpferkurs an der Volkshochschule besuchen.","Mi piacerebbe frequentare un corso di ceramica alla scuola serale.","B1","aussage"],
      ["Als Kind saß ich stundenlang am See und angelte.","Da bambino restavo ore seduto al lago a pescare.","B1","aussage"],
      ["Ich lege meine Sporttasche immer in den Schrank.","Metto sempre la mia borsa sportiva nell'armadio.","B1","aussage"],
      ["Wir hängen die Medaillen an die Wand im Flur.","Appendiamo le medaglie alla parete nel corridoio.","B1","aussage"],
      ["Ich würde gern lernen, wie man diesen Knoten bindet.","Mi piacerebbe imparare come si fa questo nodo.","B1","aussage"],
      ["Ich stellte mein Fahrrad immer unter das Vordach.","Mettevo sempre la bicicletta sotto la tettoia.","B1","aussage"],
      ["Ich würde gern öfter zum Bogenschießen gehen, aber es fehlt die Zeit.","Mi piacerebbe andare più spesso a tiro con l'arco, ma manca il tempo.","B1","aussage"],
      ["Das Vereinsheim liegt zwischen dem Sportplatz und dem Wald.","La sede del club si trova tra il campo sportivo e il bosco.","B1","aussage"],
      ["Ich lernte damals in kurzer Zeit das Segeln.","Allora imparai a fare vela in poco tempo.","B1","aussage"],
      ["Wir treffen uns immer im Café hinter der Bibliothek.","Ci vediamo sempre nel bar dietro la biblioteca.","B1","aussage"],
      ["Ich hätte Lust, mal einen Kletterkurs auszuprobieren.","Avrei voglia di provare un corso di arrampicata.","B1","aussage"],
      ["Als Jugendliche spielte sie leidenschaftlich gern Theater.","Da ragazza le piaceva molto recitare a teatro.","B1","aussage"],
      ["Ich stelle meine Angel immer neben die Tür.","Metto sempre la canna da pesca accanto alla porta.","B1","aussage"],
      ["Wir würden gern zusammen ein Boot mieten, wenn das Wetter passt.","Ci piacerebbe noleggiare insieme una barca, se il tempo lo permette.","B1","aussage"],
      ["Würden Sie mir raten, mit dem Reiten anzufangen?","Mi consiglierebbe di iniziare ad andare a cavallo?","B1","frage"],
      ["Wohin stellst du eigentlich deine ganzen Trophäen?","Dove metti in realtà tutti i tuoi trofei?","B1","frage"],
      ["Wie oft übtest du früher mit dem Orchester?","Quanto spesso ti esercitavi prima con l'orchestra?","B1","frage"],
      ["Könntest du mir erklären, wie das Kartenspiel funktioniert?","Potresti spiegarmi come funziona questo gioco di carte?","B1","frage"],
      ["Obwohl es regnete, gingen wir trotzdem zum Fußballtraining.","Anche se pioveva, siamo comunque andati all'allenamento di calcio.","B1","nebensatz"],
      ["Ich weiß nicht, ob ich diesen Sommer noch surfen lerne.","Non so se questa estate imparerò ancora a fare surf.","B1","nebensatz"],
      ["Nachdem sie das Turnier verpasst hatte, trainierte sie noch härter.","Dopo aver perso il torneo, si allenò ancora più duramente.","B1","nebensatz"],
      ["Wenn ich mehr Geld hätte, würde ich öfter reisen.","Se avessi più soldi, viaggerei più spesso.","B1","nebensatz"],
      ["Die Ausrüstung der Bergsteiger wird jedes Jahr von einem Fachgeschäft überprüft.","L'attrezzatura degli alpinisti viene controllata ogni anno da un negozio specializzato.","B2","aussage"],
      ["Trotz des schlechten Wetters wurde das Freiluftkonzert nicht abgesagt.","Nonostante il maltempo, il concerto all'aperto non è stato annullato.","B2","aussage"],
      ["Das Erlernen eines Instruments erfordert vor allem Geduld und tägliches Üben.","Imparare uno strumento richiede soprattutto pazienza ed esercizio quotidiano.","B2","aussage"],
      ["Der Verein wird größtenteils durch die Mitgliedsbeiträge der Sportler finanziert.","Il club è finanziato in gran parte dai contributi degli sportivi.","B2","aussage"],
      ["Allerdings wird das Vereinsleben durch den Mangel an jungen Freiwilligen zunehmend erschwert.","Tuttavia la vita associativa è sempre più ostacolata dalla mancanza di giovani volontari.","B2","aussage"],
      ["Die Organisation des jährlichen Stadtfestes liegt in den Händen ehrenamtlicher Helfer.","L'organizzazione della festa cittadina annuale è nelle mani di volontari.","B2","aussage"],
      ["Trotz des Sturms wurde der Wanderweg nur vorübergehend gesperrt.","Nonostante la tempesta, il sentiero è stato chiuso solo temporaneamente.","B2","aussage"],
      ["Die Begeisterung der jungen Sportlerin wurde von den Trainern schnell erkannt.","L'entusiasmo della giovane sportiva è stato riconosciuto rapidamente dagli allenatori.","B2","aussage"],
      ["Obwohl das Training anstrengend war, wurde es von keinem Spieler ausgelassen.","Sebbene l'allenamento fosse faticoso, non è stato saltato da nessun giocatore.","B2","aussage"],
      ["Die Renovierung des alten Vereinshauses wurde vollständig durch Spenden finanziert.","La ristrutturazione della vecchia sede del club è stata finanziata interamente con donazioni.","B2","aussage"],
      ["Der Reiz des Extremsports liegt gerade in der Überwindung der eigenen Angst.","Il fascino degli sport estremi sta proprio nel superamento della propria paura.","B2","aussage"],
      ["Die Teilnahme an dem Wettbewerb wurde ihm wegen einer Verletzung untersagt.","La partecipazione alla gara gli è stata vietata a causa di un infortunio.","B2","aussage"],
      ["Trotz ihres vollen Terminkalenders findet sie stets Zeit für ihr geliebtes Hobby.","Nonostante la sua agenda piena, trova sempre tempo per il suo amato hobby.","B2","aussage"],
      ["Die Anschaffung einer hochwertigen Kamera hat sein Interesse an der Fotografie neu entfacht.","L'acquisto di una fotocamera di alta qualità ha riacceso il suo interesse per la fotografia.","B2","aussage"],
      ["Das gemeinsame Musizieren wird von vielen Mitgliedern als wertvoller Ausgleich zum Berufsleben geschätzt.","Il fare musica insieme è apprezzato da molti membri come un prezioso equilibrio rispetto alla vita lavorativa.","B2","aussage"],
      ["Wird die Teilnahme an diesem Kurs von der Krankenkasse übernommen?","La partecipazione a questo corso viene coperta dalla cassa malattia?","B2","frage"],
      ["Warum wird die Bedeutung des Vereinssports oft unterschätzt?","Perché l'importanza dello sport in società viene spesso sottovalutata?","B2","frage"],
      ["Sollte die Finanzierung solcher Projekte nicht stärker vom Staat unterstützt werden?","Il finanziamento di tali progetti non dovrebbe essere sostenuto maggiormente dallo stato?","B2","frage"],
      ["Woran liegt es, dass trotz des großen Angebots so wenige mitmachen?","Come mai, nonostante l'ampia offerta, così pochi partecipano?","B2","frage"],
      ["Während die Halle renoviert wird, weichen die Sportler auf den Außenplatz aus.","Mentre la palestra viene ristrutturata, gli sportivi si spostano sul campo esterno.","B2","nebensatz"],
      ["Obwohl die Anmeldung des Vereins Wochen dauerte, ließ sich niemand entmutigen.","Sebbene l'iscrizione del club richiedesse settimane, nessuno si lasciò scoraggiare.","B2","nebensatz"],
      ["Da die Nachfrage nach Yogakursen stark gestiegen ist, wird ein zweiter Kurs angeboten.","Poiché la domanda di corsi di yoga è aumentata molto, viene offerto un secondo corso.","B2","nebensatz"],
      ["Weil das Turnier dieses Jahr wegen des Wetters verschoben wurde, trainieren alle länger.","Poiché il torneo quest'anno è stato rimandato a causa del tempo, tutti si allenano più a lungo.","B2","nebensatz"],
      ["Vom Ehrgeiz gepackt, investierte er jede freie Minute in die Perfektionierung seines Golfschwungs.","Preso dall'ambizione, investiva ogni minuto libero nel perfezionamento del suo swing nel golf.","C1","aussage"],
      ["Er berichtete, er widme sich seit Neuestem mit wachsender Hingabe dem Bogenschießen.","Riferì che si stava dedicando ultimamente con crescente dedizione al tiro con l'arco.","C1","aussage"],
      ["Getrieben von kindlicher Neugier, begann sie schon früh mit dem Sammeln seltener Käfer.","Spinta dalla curiosità infantile, iniziò presto a collezionare coleotteri rari.","C1","aussage"],
      ["Seine Vorliebe fürs Modellsegeln grenzte, wie Freunde behaupteten, bisweilen an Manie.","La sua predilezione per la vela in miniatura confinava, come sostenevano gli amici, talvolta con la mania.","C1","aussage"],
      ["Sie gestand, das Klettern sei für sie längst mehr als bloßer Zeitvertreib geworden.","Confessò che l'arrampicata era ormai diventata per lei molto più di un semplice passatempo.","C1","aussage"],
      ["Angetrieben von der Aussicht auf den Wanderpokal, trainierten die Kinder wie besessen.","Spinti dalla prospettiva della coppa itinerante, i bambini si allenavano come indemoniati.","C1","aussage"],
      ["Das Vereinsleben, einst blühend, drohte in der Bedeutungslosigkeit zu versinken.","La vita associativa, un tempo florida, rischiava di sprofondare nell'insignificanza.","C1","aussage"],
      ["Der Trainer merkte an, die Mannschaft habe in den letzten Wochen enorme Fortschritte gemacht.","L'allenatore osservò che la squadra avesse fatto enormi progressi nelle ultime settimane.","C1","aussage"],
      ["Von der Schönheit der Berge fasziniert, verfiel er dem Alpinismus mit Haut und Haaren.","Affascinato dalla bellezza delle montagne, si dedicò all'alpinismo anima e corpo.","C1","aussage"],
      ["Ihr Talent, so hieß es, sei bereits im Kindesalter unübersehbar gewesen.","Il suo talento, si diceva, era già evidente fin dall'infanzia.","C1","aussage"],
      ["Beseelt von grenzenloser Abenteuerlust, durchquerte er die Wüste allein zu Fuß.","Animato da una sconfinata voglia d'avventura, attraversò il deserto da solo a piedi.","C1","aussage"],
      ["Das Hobby, dem er sich mit schier unerschöpflicher Geduld widmete, wurde zu seiner zweiten Natur.","L'hobby a cui si dedicava con una pazienza quasi inesauribile divenne la sua seconda natura.","C1","aussage"],
      ["Enttäuscht von der Absage des Turniers, ließen die Spieler den Kopf keineswegs hängen.","Delusi dall'annullamento del torneo, i giocatori non si persero affatto d'animo.","C1","aussage"],
      ["Es hieß, der neue Trainer stelle althergebrachte Trainingsmethoden gänzlich infrage.","Si diceva che il nuovo allenatore mettesse completamente in discussione i metodi di allenamento tradizionali.","C1","aussage"],
      ["Geleitet von einer tiefen Naturverbundenheit, verbrachte sie jede freie Stunde beim Vogelbeobachten.","Guidata da un profondo legame con la natura, trascorreva ogni ora libera a osservare gli uccelli.","C1","aussage"],
      ["Wie erklärt man sich, dass manche Menschen ihrem Hobby geradezu hörig verfallen?","Come ci si spiega che alcune persone diventino quasi schiave del proprio hobby?","C1","frage"],
      ["Inwieweit lässt sich behaupten, ein Hobby verkomme zur Last, sobald Erwartungen ins Spiel kommen?","In che misura si può sostenere che un hobby degeneri in un peso non appena entrano in gioco le aspettative?","C1","frage"],
      ["Woran mag es liegen, dass gerade zeitraubende Hobbys die größte Erfüllung versprechen?","A cosa può essere dovuto che proprio gli hobby più dispendiosi in termini di tempo promettano la maggiore soddisfazione?","C1","frage"],
      ["Verdient ein derart zeitintensives Hobby überhaupt noch die Bezeichnung Freizeitbeschäftigung?","Un hobby così dispendioso in termini di tempo merita ancora la definizione di attività ricreativa?","C1","frage"],
      ["Wenngleich sie das Turnier haushoch verlor, blieb ihr sportlicher Ehrgeiz ungebrochen.","Sebbene abbia perso il torneo nettamente, la sua ambizione sportiva restò intatta.","C1","nebensatz"],
      ["Nachdem er sich jahrelang dem Amateurfunk verschrieben hatte, wurde er zum gefragten Experten.","Dopo essersi dedicato per anni alla radioamatoriale, divenne un esperto ricercato.","C1","nebensatz"],
      ["Da ihm die nötige Muße für aufwendige Hobbys fehlte, beschränkte er sich aufs Lesen.","Poiché gli mancava la calma necessaria per hobby impegnativi, si limitava alla lettura.","C1","nebensatz"],
      ["Während andere ihre Freizeit dem Nichtstun widmen, sucht er stets neue Herausforderungen.","Mentre altri dedicano il proprio tempo libero all'ozio, lui cerca sempre nuove sfide.","C1","nebensatz"],
      ["Wer sein Hobby zur Profession erhebt, läuft nicht selten Gefahr, ihm gerade jene Unbeschwertheit zu rauben, die es einst so kostbar machte.","Chi eleva il proprio hobby a professione rischia spesso di privarlo proprio di quella spensieratezza che un tempo lo rendeva così prezioso.","C2","aussage"],
      ["Die vermeintliche Selbstverwirklichung durch immer ausgefeiltere Freizeitprojekte entpuppt sich bei Lichte betrachtet oft als getarnter Konkurrenzkampf.","La presunta autorealizzazione attraverso progetti ricreativi sempre più elaborati si rivela, a un esame più attento, spesso una gara di competizione mascherata.","C2","aussage"],
      ["Sein unstillbares Verlangen nach immer neuen Herausforderungen ließ ihn ein Hobby nach dem anderen wie eine Modeerscheinung abstreifen.","Il suo insaziabile desiderio di sfide sempre nuove lo portava a scartare un hobby dopo l'altro come una moda passeggera.","C2","aussage"],
      ["Was einst als brotlose Liebhaberei belächelt wurde, verschaffte ihm im Alter eine Anerkennung, die ihm der Beruf zeitlebens verwehrt hatte.","Ciò che un tempo veniva deriso come una passione senza sbocchi gli procurò in vecchiaia un riconoscimento che il lavoro non gli aveva mai concesso in vita.","C2","aussage"],
      ["Zwischen dem stillen Glück des Bastlers und der lauten Anerkennungssucht des Wettkampfsportlers klafft ein Abgrund, den viele geflissentlich übersehen.","Tra la silenziosa felicità dell'hobbista e la fragorosa brama di riconoscimento dell'atleta agonista si apre un abisso che molti preferiscono ignorare.","C2","aussage"],
      ["Erst als ihm die Puste ausging, begriff er, dass sein rastloses Hobby längst zur Flucht vor sich selbst geworden war.","Solo quando gli mancò il fiato capì che il suo instancabile hobby era ormai diventato una fuga da se stesso.","C2","aussage"],
      ["Die Kunst, ein Hobby mit Hingabe und zugleich mit gesunder Gelassenheit zu betreiben, beherrschen nur die wenigsten.","L'arte di praticare un hobby con dedizione e al tempo stesso con sana serenità la padroneggiano davvero in pochi.","C2","aussage"],
      ["Ihre Passion fürs Sammeln alter Landkarten trug ihr, wenig schmeichelhaft, den Ruf einer versponnenen Eigenbrötlerin ein.","La sua passione per il collezionismo di vecchie mappe le valse, in modo poco lusinghiero, la fama di eccentrica solitaria.","C2","aussage"],
      ["Wo die einen im gemeinsamen Hobby Trost und Zugehörigkeit finden, wittern andere darin nur ein weiteres Feld der Selbstoptimierung.","Dove alcuni trovano nell'hobby condiviso conforto e appartenenza, altri vi fiutano solo un ulteriore campo di auto-ottimizzazione.","C2","aussage"],
      ["Dass ausgerechnet das scheinbar zwecklose Nichtstun ihm die fruchtbarsten Ideen bescherte, wollte ihm lange niemand glauben.","Che fosse proprio l'apparentemente inutile ozio a regalargli le idee più feconde, per molto tempo nessuno volle credergli.","C2","aussage"],
      ["Die Grenze zwischen leidenschaftlichem Sammeln und zwanghaftem Horten verläuft, wie sein Beispiel zeigt, erschreckend nah beieinander.","Il confine tra collezionismo appassionato e accumulo compulsivo corre, come dimostra il suo esempio, spaventosamente vicino.","C2","aussage"],
      ["Manch einer flüchtet sich so beharrlich in sein Hobby, dass die eigentliche Wirklichkeit dabei zunehmend aus dem Blick gerät.","C'è chi si rifugia nel proprio hobby con tale ostinazione che la realtà vera e propria finisce sempre più fuori dal suo orizzonte.","C2","aussage"],
      ["Der schmale Grat zwischen bewundernswerter Beharrlichkeit und bedenklicher Besessenheit wird von kaum jemandem so mühelos beschritten wie von echten Sammlern.","Il sottile confine tra ammirevole perseveranza e preoccupante ossessione viene percorso con tanta disinvoltura solo dai veri collezionisti.","C2","aussage"],
      ["Ihre stille Freude am Sticken, von der Umwelt lange als altmodischer Zeitvertreib abgetan, erwies sich schließlich als beharrliches Statement gegen die Hektik der Zeit.","La sua silenziosa gioia per il ricamo, a lungo liquidata dall'ambiente circostante come un passatempo antiquato, si rivelò infine una tenace dichiarazione contro la frenesia del tempo.","C2","aussage"],
      ["Wer glaubt, Freizeit ließe sich beliebig vermehren, indem man sie minutiös durchplant, hat ihr eigentliches Wesen gründlich missverstanden.","Chi crede che il tempo libero si possa moltiplicare a piacimento pianificandolo minuziosamente ne ha frainteso profondamente la vera essenza.","C2","aussage"],
      ["Ist es nicht zutiefst paradox, dass ausgerechnet die Suche nach Entspannung viele Menschen in einen neuen Leistungsdruck treibt?","Non è profondamente paradossale che sia proprio la ricerca del relax a spingere molte persone verso una nuova pressione da prestazione?","C2","frage"],
      ["Wo verläuft eigentlich die Grenze zwischen einer liebenswerten Marotte und einer ernstzunehmenden Zwangshandlung?","Dove passa in realtà il confine tra una simpatica mania e un comportamento compulsivo da prendere sul serio?","C2","frage"],
      ["Wie kommt es, dass ausgerechnet die vermeintlich sinnlosesten Hobbys oft das größte Glücksgefühl hervorrufen?","Come mai sono proprio gli hobby apparentemente più inutili a suscitare spesso la più grande sensazione di felicità?","C2","frage"],
      ["Verrät nicht schon die Wahl unserer Hobbys mehr über unsere heimlichen Sehnsüchte, als uns lieb ist?","La scelta dei nostri hobby non rivela forse già più dei nostri desideri segreti di quanto ci farebbe piacere?","C2","frage"],
      ["So sehr manche ihr Hobby als Zufluchtsort preisen, so wenig ahnen sie, dass es längst zur heimlichen Bürde geworden ist.","Per quanto alcuni celebrino il proprio hobby come un rifugio, altrettanto poco sospettano che sia ormai diventato un fardello segreto.","C2","nebensatz"],
      ["Während die einen ihr Leben lang treu bei einem einzigen Hobby bleiben, hangeln sich andere rastlos von einer Leidenschaft zur nächsten.","Mentre alcuni restano fedeli per tutta la vita a un unico hobby, altri passano irrequieti da una passione all'altra.","C2","nebensatz"],
      ["Obgleich ihm bewusst war, dass sein Hobby längst außer Kontrolle geraten war, brachte er es nicht übers Herz aufzuhören.","Sebbene fosse consapevole che il suo hobby era ormai fuori controllo, non ebbe il coraggio di smettere.","C2","nebensatz"],
      ["Kaum hatte er sich dem Modellbau verschrieben, geriet alles andere in seinem Leben unweigerlich in den Hintergrund.","Non appena si dedicò al modellismo, tutto il resto della sua vita finì inevitabilmente in secondo piano.","C2","nebensatz"],
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
      ["Obgleich die Rezeptur seit Generationen unverändert weitergegeben wurde, entfaltet sie ihre Wirkung erst im Kontext des gemeinsamen Essens.","Sebbene la ricetta sia stata tramandata invariata per generazioni, essa dispiega il suo effetto solo nel contesto del pasto condiviso.","C2","nebensatz"],
      ["Ich esse gern Reis mit Gemüse.","Mi piace mangiare riso con verdure.","A1","aussage"],
      ["Wir kochen heute Kartoffeln.","Oggi cuciniamo patate.","A1","aussage"],
      ["Der Kuchen ist noch warm.","La torta è ancora calda.","A1","aussage"],
      ["Ich mag keinen Fisch.","Non mi piace il pesce.","A1","aussage"],
      ["Wir trinken Saft zum Frühstück.","A colazione beviamo succo.","A1","aussage"],
      ["Meine Oma backt gern Brot.","A mia nonna piace fare il pane.","A1","aussage"],
      ["Ich esse Käse mit Brot.","Mangio formaggio con il pane.","A1","aussage"],
      ["Wir kaufen Obst auf dem Markt.","Compriamo frutta al mercato.","A1","aussage"],
      ["Der Salat schmeckt frisch.","L'insalata è fresca.","A1","aussage"],
      ["Ich koche gern Suppe.","Mi piace cucinare la zuppa.","A1","aussage"],
      ["Wir essen samstags oft Reis.","Il sabato mangiamo spesso riso.","A1","aussage"],
      ["Das Wasser ist sehr kalt.","L'acqua è molto fredda.","A1","aussage"],
      ["Ich mag süße Nachspeisen.","Mi piacciono i dolci.","A1","aussage"],
      ["Meine Mutter macht leckere Kekse.","Mia madre fa biscotti buoni.","A1","aussage"],
      ["Wir essen Fleisch nur selten.","Mangiamo carne solo raramente.","A1","aussage"],
      ["Isst du gern Käse?","Ti piace mangiare il formaggio?","A1","frage"],
      ["Trinkst du Kaffee oder Tee?","Bevi caffè o tè?","A1","frage"],
      ["Was kochst du heute Abend?","Cosa cucini stasera?","A1","frage"],
      ["Magst du scharfes Essen?","Ti piace il cibo piccante?","A1","frage"],
      ["Ich koche Reis, weil er einfach ist.","Cucino riso perché è semplice.","A1","nebensatz"],
      ["Wir essen draußen, wenn es warm ist.","Mangiamo fuori quando fa caldo.","A1","nebensatz"],
      ["Ich trinke Milch, weil sie mir schmeckt.","Bevo latte perché mi piace.","A1","nebensatz"],
      ["Ich kaufe Brot, wenn ich Zeit habe.","Compro pane quando ho tempo.","A1","nebensatz"],
      ["Ich habe gestern die Kartoffeln schon geschält.","Ieri ho già sbucciato le patate.","A2","aussage"],
      ["Wir haben den Tisch für das Abendessen gedeckt.","Abbiamo apparecchiato la tavola per la cena.","A2","aussage"],
      ["Ich habe die Reste vom Mittagessen aufgewärmt.","Ho riscaldato gli avanzi del pranzo.","A2","aussage"],
      ["Wir mussten das Fleisch heute länger braten.","Oggi abbiamo dovuto cuocere la carne più a lungo.","A2","aussage"],
      ["Ich habe gestern die Milch versehentlich umgeschüttet.","Ieri ho rovesciato per sbaglio il latte.","A2","aussage"],
      ["Er hat den Kuchen aus dem Ofen genommen.","Ha tolto la torta dal forno.","A2","aussage"],
      ["Wir haben das Rezept aus einem alten Kochbuch übernommen.","Abbiamo preso la ricetta da un vecchio libro di cucina.","A2","aussage"],
      ["Ich möchte heute Abend unbedingt selbst kochen.","Stasera vorrei assolutamente cucinare da solo.","A2","aussage"],
      ["Wir haben die Gäste zum Essen eingeladen.","Abbiamo invitato gli ospiti a cena.","A2","aussage"],
      ["Ich habe leider vergessen, den Herd auszuschalten.","Purtroppo ho dimenticato di spegnere il fornello.","A2","aussage"],
      ["Sie hat die Suppe extra scharf gewürzt.","Ha condito la zuppa particolarmente piccante.","A2","aussage"],
      ["Wir haben gestern alle zusammen Plätzchen ausgestochen.","Ieri abbiamo ritagliato tutti insieme i biscotti.","A2","aussage"],
      ["Ich darf leider überhaupt keine Nüsse essen.","Purtroppo non posso proprio mangiare le noci.","A2","aussage"],
      ["Wir haben gestern das Gemüse klein geschnitten.","Ieri abbiamo tagliato le verdure a pezzetti.","A2","aussage"],
      ["Ich habe den Teig zu lange geknetet.","Ho impastato l'impasto troppo a lungo.","A2","aussage"],
      ["Hast du den Braten schon rausgeholt?","Hai già tirato fuori l'arrosto?","A2","frage"],
      ["Musst du das Essen noch abschmecken?","Devi ancora assaggiare per regolare di sale?","A2","frage"],
      ["Willst du den Nachtisch jetzt oder später?","Vuoi il dolce ora o più tardi?","A2","frage"],
      ["Habt ihr schon abgewaschen?","Avete già lavato i piatti?","A2","frage"],
      ["Ich habe abgeschmeckt, weil die Suppe fade war.","Ho aggiustato di sale perché la zuppa era insipida.","A2","nebensatz"],
      ["Wir grillen draußen, wenn die Sonne scheint.","Facciamo il barbecue fuori quando c'è il sole.","A2","nebensatz"],
      ["Ich glaube, dass der Braten noch roh ist.","Penso che l'arrosto sia ancora crudo.","A2","nebensatz"],
      ["Ich habe eingekauft, weil der Kühlschrank leer war.","Ho fatto la spesa perché il frigo era vuoto.","A2","nebensatz"],
      ["Früher aß meine Familie sonntags immer gemeinsam am großen Tisch.","Un tempo la mia famiglia mangiava sempre insieme la domenica al tavolo grande.","B1","aussage"],
      ["Ich würde gern einen Kochkurs für italienische Küche belegen.","Mi piacerebbe iscrivermi a un corso di cucina italiana.","B1","aussage"],
      ["Ich stelle die Gewürze immer in den Schrank über dem Herd.","Metto sempre le spezie nell'armadietto sopra i fornelli.","B1","aussage"],
      ["Als Kind aß ich nie Gemüse, das grün war.","Da bambino non mangiavo mai verdure verdi.","B1","aussage"],
      ["Ich würde gern wissen, welches Gericht heute empfohlen wird.","Vorrei sapere quale piatto viene consigliato oggi.","B1","aussage"],
      ["Wir stellten den Salat immer zwischen die anderen Schüsseln.","Mettevamo sempre l'insalata tra le altre ciotole.","B1","aussage"],
      ["Ich hängte die Kräuter zum Trocknen an den Balken.","Appendevo le erbe al trave per farle seccare.","B1","aussage"],
      ["Das kleine Restaurant liegt zwischen der Bäckerei und dem Blumenladen.","Il piccolo ristorante si trova tra il panificio e il fioraio.","B1","aussage"],
      ["Ich hätte gern noch etwas von dem hausgemachten Kuchen.","Vorrei ancora un po' della torta fatta in casa.","B1","aussage"],
      ["Früher kochte meine Mutter jeden Freitag Fisch für die ganze Familie.","Una volta mia madre cucinava il pesce ogni venerdì per tutta la famiglia.","B1","aussage"],
      ["Ich lege das Obst immer auf den Teller neben das Brot.","Metto sempre la frutta sul piatto accanto al pane.","B1","aussage"],
      ["Ich würde das Gericht wahrscheinlich eher mild bestellen.","Probabilmente ordinerei il piatto piuttosto delicato.","B1","aussage"],
      ["Wir standen damals oft zusammen in der Küche und kochten.","Allora stavamo spesso insieme in cucina a cucinare.","B1","aussage"],
      ["Ich würde die Suppe gern noch etwas nachwürzen lassen.","Vorrei far condire ancora un po' la zuppa.","B1","aussage"],
      ["Wir setzten uns immer an den Tisch am Fenster.","Ci sedevamo sempre al tavolo vicino alla finestra.","B1","aussage"],
      ["Könnten Sie mir bitte die Zutatenliste zeigen?","Potrebbe mostrarmi per favore la lista degli ingredienti?","B1","frage"],
      ["Wohin stelltest du früher immer die Gewürze?","Dove mettevi sempre le spezie prima?","B1","frage"],
      ["Würden Sie uns einen Tisch am Fenster reservieren?","Ci riserverebbe un tavolo vicino alla finestra?","B1","frage"],
      ["Wie oft kochtet ihr früher gemeinsam am Wochenende?","Quanto spesso cucinavate insieme nel weekend prima?","B1","frage"],
      ["Obwohl die Suppe zu salzig war, aß er den ganzen Teller leer.","Anche se la zuppa era troppo salata, svuotò tutto il piatto.","B1","nebensatz"],
      ["Ich weiß nicht, ob der Fisch heute noch frisch ist.","Non so se il pesce oggi sia ancora fresco.","B1","nebensatz"],
      ["Nachdem wir gegessen hatten, räumten wir gemeinsam die Küche auf.","Dopo aver mangiato, riordinammo insieme la cucina.","B1","nebensatz"],
      ["Wenn ich mehr Zeit hätte, würde ich öfter selbst kochen.","Se avessi più tempo, cucinerei più spesso da solo.","B1","nebensatz"],
      ["Die Herstellung des traditionellen Käses wird noch heute größtenteils von Hand erledigt.","La produzione del formaggio tradizionale viene ancora oggi svolta in gran parte a mano.","B2","aussage"],
      ["Trotz des hohen Preises wird das Restaurant von Einheimischen sehr geschätzt.","Nonostante il prezzo elevato, il ristorante è molto apprezzato dagli abitanti del posto.","B2","aussage"],
      ["Das Verzehren von Straßenessen gilt in dieser Stadt als beliebte Freizeitbeschäftigung.","Mangiare cibo di strada è considerato in questa città un passatempo popolare.","B2","aussage"],
      ["Der Ruf des kleinen Lokals wird vor allem durch Mundpropaganda verbreitet.","La fama del piccolo locale si diffonde soprattutto tramite il passaparola.","B2","aussage"],
      ["Allerdings wird die Qualität des Gemüses durch den langen Transport erheblich gemindert.","Tuttavia la qualità delle verdure viene notevolmente ridotta dal lungo trasporto.","B2","aussage"],
      ["Die Zubereitung des Festessens nimmt jedes Jahr den ganzen Vormittag in Anspruch.","La preparazione del pranzo di festa richiede ogni anno l'intera mattinata.","B2","aussage"],
      ["Trotz seines strengen Geruchs wird der Fischmarkt von vielen Touristen besucht.","Nonostante il suo forte odore, il mercato del pesce è visitato da molti turisti.","B2","aussage"],
      ["Die Freude der Kinder am selbstgebackenen Kuchen war ihrer Mutter deutlich anzusehen.","La gioia dei bambini per la torta fatta da loro si vedeva chiaramente sul viso della madre.","B2","aussage"],
      ["Obwohl das Gericht aufwendig war, wurde es von keinem Gast übrig gelassen.","Sebbene il piatto fosse elaborato, non è stato lasciato da nessun ospite.","B2","aussage"],
      ["Die Sanierung der alten Markthalle wurde vollständig durch städtische Fördermittel finanziert.","Il restauro del vecchio mercato coperto è stato finanziato interamente con fondi comunali.","B2","aussage"],
      ["Der Reiz der Streetfood-Kultur liegt gerade in der Vielfalt kleiner, unkomplizierter Gerichte.","Il fascino della cultura dello street food sta proprio nella varietà di piatti piccoli e semplici.","B2","aussage"],
      ["Ihm wurde der Zutritt zur Küche wegen der strengen Hygienevorschriften verwehrt.","Gli è stato negato l'accesso alla cucina a causa delle rigide norme igieniche.","B2","aussage"],
      ["Trotz ihrer knappen Zeit bereitet sie jeden Abend ein warmes Essen zu.","Nonostante il suo poco tempo, prepara ogni sera un pasto caldo.","B2","aussage"],
      ["Die Anschaffung eines eigenen Gartens hat ihr Interesse am biologischen Anbau spürbar verstärkt.","L'acquisto di un giardino proprio ha rafforzato sensibilmente il suo interesse per la coltivazione biologica.","B2","aussage"],
      ["Das gemeinsame Kochen am Wochenende wird von der ganzen Familie als wertvolle Tradition angesehen.","Il cucinare insieme nel weekend è considerato da tutta la famiglia una preziosa tradizione.","B2","aussage"],
      ["Wird die Herkunft der Zutaten auf der Speisekarte überhaupt angegeben?","La provenienza degli ingredienti viene indicata sul menù?","B2","frage"],
      ["Warum wird der Wert einer ausgewogenen Ernährung oft unterschätzt?","Perché il valore di un'alimentazione equilibrata viene spesso sottovalutato?","B2","frage"],
      ["Sollte der Zugang zu gesundem Essen nicht stärker vom Staat gefördert werden?","L'accesso a un'alimentazione sana non dovrebbe essere promosso maggiormente dallo stato?","B2","frage"],
      ["Woran liegt es, dass trotz des großen Angebots so viel weggeworfen wird?","Come mai, nonostante l'ampia offerta, viene buttato via così tanto cibo?","B2","frage"],
      ["Während die Küche renoviert wird, weicht das Restaurant auf einen Foodtruck aus.","Mentre la cucina viene ristrutturata, il ristorante si sposta su un foodtruck.","B2","nebensatz"],
      ["Obwohl die Eröffnung des Lokals Monate dauerte, ließen sich die Besitzer nicht entmutigen.","Sebbene l'apertura del locale richiedesse mesi, i proprietari non si lasciarono scoraggiare.","B2","nebensatz"],
      ["Da die Nachfrage nach veganen Gerichten stark gestiegen ist, wird die Karte erweitert.","Poiché la domanda di piatti vegani è aumentata molto, il menù viene ampliato.","B2","nebensatz"],
      ["Weil das Festessen wegen des Wetters verschoben wurde, kochen alle nun am Sonntag.","Poiché il pranzo di festa è stato rimandato a causa del tempo, adesso tutti cucinano domenica.","B2","nebensatz"],
      ["Vom Duft des frischen Brotes angelockt, versammelten sich die Nachbarn schon früh vor der Bäckerei.","Attirati dal profumo del pane fresco, i vicini si radunavano già presto davanti al panificio.","C1","aussage"],
      ["Er berichtete, er widme sich seit Neuestem mit wachsender Begeisterung der Fermentation von Gemüse.","Riferì che si stava dedicando ultimamente con crescente entusiasmo alla fermentazione delle verdure.","C1","aussage"],
      ["Getrieben von purer Neugier, probierte sie schon als Kind die exotischsten Gewürze.","Spinta da pura curiosità, da bambina assaggiava già le spezie più esotiche.","C1","aussage"],
      ["Seine Vorliebe für ungewöhnliche Käsesorten grenzte, wie Freunde behaupteten, bisweilen an Besessenheit.","La sua predilezione per formaggi insoliti confinava, come sostenevano gli amici, talvolta con l'ossessione.","C1","aussage"],
      ["Sie gestand, das Kochen sei für sie längst mehr als bloße Notwendigkeit geworden.","Confessò che cucinare era ormai diventato per lei molto più di una semplice necessità.","C1","aussage"],
      ["Angetrieben von der Aussicht auf ein prämiertes Rezept, experimentierte der Koch wie besessen.","Spinto dalla prospettiva di una ricetta premiata, lo chef sperimentava come un ossesso.","C1","aussage"],
      ["Die Tradition des Sonntagsbratens, einst unantastbar, drohte allmählich in Vergessenheit zu geraten.","La tradizione dell'arrosto della domenica, un tempo intoccabile, rischiava di cadere lentamente nell'oblio.","C1","aussage"],
      ["Der Küchenchef merkte an, das Team habe in den letzten Monaten enorme Fortschritte gemacht.","Lo chef osservò che il team avesse fatto enormi progressi negli ultimi mesi.","C1","aussage"],
      ["Von der Vielfalt der Gewürze fasziniert, verfiel er der orientalischen Küche mit Haut und Haaren.","Affascinato dalla varietà delle spezie, si dedicò alla cucina orientale anima e corpo.","C1","aussage"],
      ["Ihr Geschmackssinn, so hieß es, sei bereits in jungen Jahren außergewöhnlich fein gewesen.","Il suo palato, si diceva, era già straordinariamente fine in giovane età.","C1","aussage"],
      ["Beseelt von grenzenloser Neugier, bereiste er den ganzen Kontinent auf der Suche nach vergessenen Rezepten.","Animato da una sconfinata curiosità, percorse l'intero continente alla ricerca di ricette dimenticate.","C1","aussage"],
      ["Das Rezept, dem sie sich mit schier unerschöpflicher Geduld widmete, wurde zu ihrem Markenzeichen.","La ricetta a cui si dedicava con una pazienza quasi inesauribile divenne il suo tratto distintivo.","C1","aussage"],
      ["Enttäuscht von der missglückten Soße, ließ der Koch den Kopf keineswegs hängen.","Deluso dalla salsa fallita, lo chef non si perse affatto d'animo.","C1","aussage"],
      ["Es hieß, der neue Küchenchef stelle althergebrachte Zubereitungsmethoden gänzlich infrage.","Si diceva che il nuovo chef mettesse completamente in discussione i metodi di preparazione tradizionali.","C1","aussage"],
      ["Geleitet von einer tiefen Wertschätzung für regionale Erzeugnisse, bezog sie ihre Zutaten ausschließlich von umliegenden Bauernhöfen.","Guidata da un profondo apprezzamento per i prodotti locali, si riforniva di ingredienti esclusivamente dalle fattorie circostanti.","C1","aussage"],
      ["Wie erklärt man sich, dass manche Feinschmecker exotischen Delikatessen geradezu hörig verfallen?","Come ci si spiega che alcuni buongustai diventino quasi schiavi di prelibatezze esotiche?","C1","frage"],
      ["Inwieweit lässt sich behaupten, gutes Essen verkomme zur bloßen Ablenkung, sobald es inszeniert wird?","In che misura si può sostenere che il buon cibo degeneri in mera distrazione non appena viene messo in scena?","C1","frage"],
      ["Woran mag es liegen, dass gerade die einfachsten Gerichte die größte Sehnsucht wecken?","A cosa può essere dovuto che siano proprio i piatti più semplici a suscitare la maggiore nostalgia?","C1","frage"],
      ["Verdient ein derart aufwendig inszeniertes Menü überhaupt noch die Bezeichnung Hausmannskost?","Un menù messo in scena in modo così elaborato merita ancora la definizione di cucina casalinga?","C1","frage"],
      ["Wenngleich das Gericht auf den ersten Blick abschreckend wirkte, entpuppte es sich als wahre Gaumenfreude.","Sebbene il piatto apparisse a prima vista poco invitante, si rivelò una vera gioia per il palato.","C1","nebensatz"],
      ["Nachdem er sich jahrelang der Patisserie verschrieben hatte, wurde er zum gefragten Konditormeister.","Dopo essersi dedicato per anni alla pasticceria, divenne un maestro pasticciere ricercato.","C1","nebensatz"],
      ["Da ihr die nötige Muße für aufwendige Rezepte fehlte, beschränkte sie sich auf schnelle Gerichte.","Poiché le mancava la calma necessaria per ricette elaborate, si limitava a piatti veloci.","C1","nebensatz"],
      ["Während andere ihre Mahlzeiten hastig herunterschlingen, nimmt er sich für jeden Bissen bewusst Zeit.","Mentre altri divorano in fretta i propri pasti, lui si prende consapevolmente tempo per ogni boccone.","C1","nebensatz"],
      ["Wer die Kochkunst zur reinen Selbstinszenierung erhebt, läuft Gefahr, ihr gerade jene Wärme zu rauben, die sie einst so kostbar machte.","Chi eleva l'arte culinaria a pura autorappresentazione rischia di privarla proprio di quel calore che un tempo la rendeva così preziosa.","C2","aussage"],
      ["Die vermeintliche Rückkehr zur Einfachheit in der Gourmetküche entpuppt sich bei Lichte betrachtet oft als raffiniert inszenierte Strategie.","Il presunto ritorno alla semplicità nell'alta cucina si rivela, a un esame più attento, spesso una strategia raffinatamente costruita.","C2","aussage"],
      ["Sein unstillbares Verlangen nach immer ausgefalleneren Aromen ließ ihn ein Restaurant nach dem anderen wie eine Modeerscheinung abstreifen.","Il suo insaziabile desiderio di sapori sempre più stravaganti lo portava a scartare un ristorante dopo l'altro come una moda passeggera.","C2","aussage"],
      ["Was einst als Arme-Leute-Küche belächelt wurde, verschaffte dem Koch später eine Anerkennung, die ihm die Sterneküche zeitlebens verwehrt hatte.","Ciò che un tempo veniva deriso come cucina povera procurò in seguito al cuoco un riconoscimento che l'alta cucina stellata non gli aveva mai concesso in vita.","C2","aussage"],
      ["Zwischen dem stillen Genuss eines einfachen Hausmannsgerichts und der lauten Inszenierung der Sterneküche klafft ein Abgrund, den viele geflissentlich übersehen.","Tra il silenzioso piacere di un semplice piatto casalingo e la fragorosa messa in scena dell'alta cucina si apre un abisso che molti preferiscono ignorare.","C2","aussage"],
      ["Erst als ihm der Geschmackssinn abhandenkam, begriff er, wie sehr er das bewusste Genießen bislang vernachlässigt hatte.","Solo quando perse il senso del gusto capì quanto avesse finora trascurato il piacere consapevole di gustare.","C2","aussage"],
      ["Die Kunst, ein Gericht mit Raffinesse und zugleich mit unaufdringlicher Schlichtheit zuzubereiten, beherrschen nur die wenigsten Köche.","L'arte di preparare un piatto con raffinatezza e al tempo stesso con discreta semplicità la padroneggiano davvero pochi cuochi.","C2","aussage"],
      ["Ihre Passion fürs Fermentieren trug ihr, wenig schmeichelhaft, den Ruf einer versponnenen Küchenhexe ein.","La sua passione per la fermentazione le valse, in modo poco lusinghiero, la fama di stravagante maga dei fornelli.","C2","aussage"],
      ["Wo die einen im gemeinsamen Essen Trost und Zugehörigkeit finden, wittern andere darin nur ein weiteres Feld sozialer Zurschaustellung.","Dove alcuni trovano nel pasto condiviso conforto e appartenenza, altri vi fiutano solo un ulteriore campo di ostentazione sociale.","C2","aussage"],
      ["Dass ausgerechnet das schlichteste Gericht ihm die größte Genugtuung bescherte, wollte ihm lange niemand glauben.","Che fosse proprio il piatto più semplice a regalargli la maggiore soddisfazione, per molto tempo nessuno volle credergli.","C2","aussage"],
      ["Die Grenze zwischen leidenschaftlichem Genuss und zwanghaftem Naschen verläuft, wie ihr Beispiel zeigt, erschreckend nah beieinander.","Il confine tra piacere appassionato e voglia compulsiva di dolci corre, come dimostra il suo esempio, spaventosamente vicino.","C2","aussage"],
      ["Manch einer flüchtet sich so beharrlich ins Kochen, dass die eigentliche Geselligkeit am Tisch dabei zunehmend aus dem Blick gerät.","C'è chi si rifugia nel cucinare con tale ostinazione che la vera convivialità a tavola finisce sempre più fuori dal suo orizzonte.","C2","aussage"],
      ["Der schmale Grat zwischen bewundernswerter Experimentierfreude und bedenklicher Verkopfung wird von kaum jemandem so mühelos beschritten wie von echten Feinschmeckern.","Il sottile confine tra ammirevole voglia di sperimentare e preoccupante eccesso di intellettualismo viene percorso con tanta disinvoltura solo dai veri buongustai.","C2","aussage"],
      ["Ihre stille Freude am Brotbacken, von der Umwelt lange als altmodischer Zeitvertreib abgetan, erwies sich schließlich als beharrliches Statement gegen die Hektik der Zeit.","La sua silenziosa gioia per la panificazione, a lungo liquidata dall'ambiente circostante come un passatempo antiquato, si rivelò infine una tenace dichiarazione contro la frenesia del tempo.","C2","aussage"],
      ["Wer glaubt, guter Geschmack ließe sich beliebig herbeizwingen, indem man jedes Detail durchplant, hat sein eigentliches Wesen gründlich missverstanden.","Chi crede che il buon gusto si possa forzare a piacimento pianificando ogni dettaglio ne ha frainteso profondamente la vera essenza.","C2","aussage"],
      ["Ist es nicht zutiefst paradox, dass ausgerechnet die Suche nach Genuss viele Menschen in einen neuen Leistungsdruck treibt?","Non è profondamente paradossale che sia proprio la ricerca del piacere a spingere molte persone verso una nuova pressione da prestazione?","C2","frage"],
      ["Wo verläuft eigentlich die Grenze zwischen einer liebenswerten Vorliebe und einer ernstzunehmenden Essstörung?","Dove passa in realtà il confine tra una simpatica preferenza e un disturbo alimentare da prendere sul serio?","C2","frage"],
      ["Wie kommt es, dass ausgerechnet die vermeintlich banalsten Gerichte oft das größte Glücksgefühl hervorrufen?","Come mai sono proprio i piatti apparentemente più banali a suscitare spesso la più grande sensazione di felicità?","C2","frage"],
      ["Verrät nicht schon die Wahl unserer Leibspeisen mehr über unsere Kindheit, als uns bewusst ist?","La scelta dei nostri piatti preferiti non rivela forse già più della nostra infanzia di quanto siamo consapevoli?","C2","frage"],
      ["So sehr manche das gemeinsame Essen als Höhepunkt des Tages preisen, so wenig ahnen sie, dass es längst zur bloßen Pflichtübung geworden ist.","Per quanto alcuni celebrino il pasto condiviso come il culmine della giornata, altrettanto poco sospettano che sia ormai diventato un mero atto dovuto.","C2","nebensatz"],
      ["Während die einen ihr Leben lang treu bei der Küche ihrer Kindheit bleiben, hangeln sich andere rastlos von einem Trend zum nächsten.","Mentre alcuni restano fedeli per tutta la vita alla cucina della propria infanzia, altri passano irrequieti da una tendenza all'altra.","C2","nebensatz"],
      ["Obgleich ihm bewusst war, dass sein Verhältnis zum Essen längst aus dem Gleichgewicht geraten war, brachte er es nicht übers Herz, etwas zu ändern.","Sebbene fosse consapevole che il suo rapporto con il cibo era ormai squilibrato, non ebbe il coraggio di cambiare qualcosa.","C2","nebensatz"],
      ["Kaum hatte sie sich der Patisserie verschrieben, geriet alles andere in ihrem Leben unweigerlich in den Hintergrund.","Non appena si dedicò alla pasticceria, tutto il resto della sua vita finì inevitabilmente in secondo piano.","C2","nebensatz"],
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
      ["Obgleich die Route minutiös geplant war, entfaltete die Reise ihren eigentlichen Reiz erst durch die unvorhergesehenen Abweichungen davon.","Sebbene l'itinerario fosse pianificato nei minimi dettagli, il viaggio dispiegò il suo vero fascino solo attraverso le deviazioni impreviste.","C2","nebensatz"],
      ["Ich reise gern nach Frankreich.","Mi piace viaggiare in Francia.","A1","aussage"],
      ["Das Zimmer hat einen Balkon.","La stanza ha un balcone.","A1","aussage"],
      ["Wir wechseln den Zug in Mailand.","Cambiamo treno a Milano.","A1","aussage"],
      ["Der Zug ist heute pünktlich.","Il treno oggi è puntuale.","A1","aussage"],
      ["Ich brauche einen neuen Reisepass.","Ho bisogno di un passaporto nuovo.","A1","aussage"],
      ["Das Taxi wartet vor dem Hotel.","Il taxi aspetta davanti all'hotel.","A1","aussage"],
      ["Wir gehen zu Fuß zum Markt.","Andiamo a piedi al mercato.","A1","aussage"],
      ["Ich habe eine Landkarte dabei.","Ho una cartina con me.","A1","aussage"],
      ["Der See ist wirklich sehr schön.","Il lago è davvero molto bello.","A1","aussage"],
      ["Wir suchen ein billiges Zimmer.","Cerchiamo una stanza economica.","A1","aussage"],
      ["Ich fotografiere gern alte Kirchen.","Mi piace fotografare vecchie chiese.","A1","aussage"],
      ["Der Strand liegt direkt vor uns.","La spiaggia è proprio davanti a noi.","A1","aussage"],
      ["Mein Zimmer ist im dritten Stock.","La mia camera è al terzo piano.","A1","aussage"],
      ["Ich trage meinen Rucksack allein.","Porto lo zaino da solo.","A1","aussage"],
      ["Das Ticket kostet zehn Euro.","Il biglietto costa dieci euro.","A1","aussage"],
      ["Gibt es hier einen Parkplatz?","C'è un parcheggio qui?","A1","frage"],
      ["Wie weit ist der Bahnhof?","Quanto dista la stazione?","A1","frage"],
      ["Wohin fährt dieser Zug?","Dove va questo treno?","A1","frage"],
      ["Ist das Frühstück inklusive?","La colazione è inclusa?","A1","frage"],
      ["Ich bleibe hier, weil das Wetter schön ist.","Resto qui perché il tempo è bello.","A1","nebensatz"],
      ["Wir warten, bis der Bus kommt.","Aspettiamo finché arriva l'autobus.","A1","nebensatz"],
      ["Sie sagt, dass das Hotel gut ist.","Lei dice che l'hotel è buono.","A1","nebensatz"],
      ["Wenn wir ankommen, sind wir müde.","Quando arriviamo, siamo stanchi.","A1","nebensatz"],
      ["Wir haben letztes Wochenende einen Ausflug ans Meer gemacht.","Il weekend scorso abbiamo fatto una gita al mare.","A2","aussage"],
      ["Ich muss morgen früh meinen Koffer packen.","Devo fare la valigia domani mattina presto.","A2","aussage"],
      ["Der Zug ist heute Morgen zehn Minuten zu spät angekommen.","Il treno stamattina è arrivato con dieci minuti di ritardo.","A2","aussage"],
      ["Wir sind gestern Abend in Rom angekommen.","Ieri sera siamo arrivati a Roma.","A2","aussage"],
      ["Ich habe im Reisebüro eine Rundreise gebucht.","Ho prenotato un tour in agenzia di viaggi.","A2","aussage"],
      ["Wir haben unsere Zimmer schon eingecheckt.","Abbiamo già fatto il check-in delle nostre stanze.","A2","aussage"],
      ["Ich möchte dieses Jahr nach Portugal fahren.","Quest'anno vorrei andare in Portogallo.","A2","aussage"],
      ["Wir sind mit dem Schiff nach Sardinien übergesetzt.","Siamo passati in Sardegna con la nave.","A2","aussage"],
      ["Ich habe meinen Reiseführer im Zug vergessen.","Ho dimenticato la mia guida turistica sul treno.","A2","aussage"],
      ["Wir haben die Sehenswürdigkeiten der Stadt besichtigt.","Abbiamo visitato i luoghi d'interesse della città.","A2","aussage"],
      ["Der Zoll hat unsere Koffer kontrolliert.","La dogana ha controllato le nostre valigie.","A2","aussage"],
      ["Ich bin am Flughafen zwei Stunden vorher angekommen.","Sono arrivato in aeroporto due ore prima.","A2","aussage"],
      ["Wir haben in einer Jugendherberge übernachtet.","Abbiamo dormito in un ostello.","A2","aussage"],
      ["Ich kann leider kein Zimmer mit Meerblick bekommen.","Purtroppo non posso avere una stanza con vista mare.","A2","aussage"],
      ["Wir sind am Wochenende mit dem Fahrrad die Küste entlanggefahren.","Nel weekend abbiamo percorso la costa in bicicletta.","A2","aussage"],
      ["Musst du für die Reise ein Visum beantragen?","Devi richiedere un visto per il viaggio?","A2","frage"],
      ["Wo kann ich hier Geld wechseln?","Dove posso cambiare soldi qui?","A2","frage"],
      ["Wann checkt ihr aus dem Hotel aus?","Quando fate il check-out dall'hotel?","A2","frage"],
      ["Hast du die Koffer schon abgegeben?","Hai già consegnato le valigie?","A2","frage"],
      ["Ich nehme lieber den Nachtzug, weil ich dann Geld spare.","Preferisco prendere il treno notturno perché così risparmio.","A2","nebensatz"],
      ["Wir mussten umsteigen, weil der Zug ausfiel.","Abbiamo dovuto cambiare treno perché era stato cancellato.","A2","nebensatz"],
      ["Ich hoffe, dass das Wetter am Wochenende schön bleibt.","Spero che il tempo rimanga bello nel weekend.","A2","nebensatz"],
      ["Wenn wir Zeit haben, besuchen wir noch das Museum.","Se abbiamo tempo, visitiamo ancora il museo.","A2","nebensatz"],
      ["Früher reiste meine Familie jeden Sommer an die Ostsee.","Un tempo la mia famiglia viaggiava ogni estate verso il Mar Baltico.","B1","aussage"],
      ["Ich lege meinen Pass immer in die Innentasche des Rucksacks.","Metto sempre il passaporto nella tasca interna dello zaino.","B1","aussage"],
      ["Der Koffer steht schon seit einer Stunde am Gate.","La valigia è già da un'ora al gate.","B1","aussage"],
      ["Damals verbrachten wir unsere Ferien meist bei den Großeltern am Land.","Allora passavamo le nostre vacanze per lo più dai nonni in campagna.","B1","aussage"],
      ["Wir hängten die nassen Handtücher über das Balkongeländer.","Abbiamo appeso gli asciugamani bagnati sulla ringhiera del balcone.","B1","aussage"],
      ["Ich stellte meinen Koffer neben die Tür des Zimmers.","Misi la valigia accanto alla porta della stanza.","B1","aussage"],
      ["Der Zug hielt mitten auf der Brücke unerwartet an.","Il treno si fermò inaspettatamente in mezzo al ponte.","B1","aussage"],
      ["Wir sollten unbedingt Reiseschecks statt Bargeld mitnehmen.","Dovremmo assolutamente portare travellers cheque invece di contanti.","B1","aussage"],
      ["Ich könnte mir vorstellen, ein Jahr im Ausland zu studieren.","Potrei immaginare di studiare un anno all'estero.","B1","aussage"],
      ["Die Fähre legte pünktlich um sechs Uhr vom Pier ab.","Il traghetto salpò puntualmente alle sei dal molo.","B1","aussage"],
      ["Ich setzte mich ans Fenster, um die Landschaft besser zu sehen.","Mi sedetti vicino al finestrino per vedere meglio il paesaggio.","B1","aussage"],
      ["Ich würde Ihnen empfehlen, das Zimmer frühzeitig zu buchen.","Le consiglierei di prenotare la stanza per tempo.","B1","aussage"],
      ["Wir stiegen am frühen Morgen auf den höchsten Turm der Stadt.","Salimmo di prima mattina sulla torre più alta della città.","B1","aussage"],
      ["Der Kellner stellte die Getränke auf den kleinen Tisch am Pool.","Il cameriere posò le bevande sul tavolino accanto alla piscina.","B1","aussage"],
      ["Ich reiste damals ohne festen Plan quer durch Skandinavien.","A quel tempo viaggiai senza un piano fisso attraverso la Scandinavia.","B1","aussage"],
      ["Könnten Sie mir bitte den Weg zum Hafen zeigen?","Potrebbe indicarmi la strada per il porto, per favore?","B1","frage"],
      ["Hätten Sie einen Moment Zeit, um uns den Stadtplan zu erklären?","Avrebbe un momento per spiegarci la piantina della città?","B1","frage"],
      ["Wüssten Sie zufällig, wo der nächste Geldautomat ist?","Saprebbe per caso dov'è il bancomat più vicino?","B1","frage"],
      ["Wann genau hielt der Zug damals in Innsbruck?","A che ora esattamente si fermava il treno a Innsbruck?","B1","frage"],
      ["Wir warteten geduldig, bis der Schnee von den Straßen geräumt war.","Aspettammo pazientemente finché la neve fu rimossa dalle strade.","B1","nebensatz"],
      ["Als wir in Venedig ankamen, regnete es in Strömen.","Quando arrivammo a Venezia, pioveva a dirotto.","B1","nebensatz"],
      ["Ich wüsste gern, ob man hier auch bar bezahlen kann.","Vorrei sapere se qui si può anche pagare in contanti.","B1","nebensatz"],
      ["Nachdem wir das Gepäck aufgegeben hatten, gingen wir zum Gate.","Dopo aver consegnato i bagagli, andammo al gate.","B1","nebensatz"],
      ["Die Reisekosten werden am Ende des Monats vom Unternehmen erstattet.","Le spese di viaggio vengono rimborsate dall'azienda alla fine del mese.","B2","aussage"],
      ["Der Zustand der historischen Altstadt wird durch den anhaltenden Touristenandrang zunehmend beeinträchtigt.","Lo stato del centro storico viene sempre più compromesso dall'incessante afflusso turistico.","B2","aussage"],
      ["Trotz des schlechten Wetters wurde die geplante Wanderung nicht abgesagt.","Nonostante il maltempo, l'escursione programmata non è stata annullata.","B2","aussage"],
      ["Die Buchung des Fluges erfolgte über die Website der Fluggesellschaft.","La prenotazione del volo è avvenuta tramite il sito della compagnia aerea.","B2","aussage"],
      ["Der Verlust des Gepäcks wurde uns erst am nächsten Tag mitgeteilt.","La perdita del bagaglio ci è stata comunicata solo il giorno seguente.","B2","aussage"],
      ["Allerdings wird die Unterkunft in der Hauptsaison deutlich teurer angeboten.","Tuttavia, in alta stagione l'alloggio viene offerto a un prezzo decisamente più alto.","B2","aussage"],
      ["Die Renovierung des alten Bahnhofsgebäudes wurde vor kurzem abgeschlossen.","Il restauro del vecchio edificio della stazione è stato completato di recente.","B2","aussage"],
      ["Dennoch entschieden sich viele Reisende für das günstigere, aber weniger komfortable Hostel.","Ciononostante molti viaggiatori scelsero l'ostello più economico ma meno confortevole.","B2","aussage"],
      ["Die Sicherheit der Passagiere wird an jedem Flughafen streng kontrolliert.","La sicurezza dei passeggeri viene controllata rigorosamente in ogni aeroporto.","B2","aussage"],
      ["Wegen der Bauarbeiten am Bahnsteig wurde der Zugverkehr vorübergehend eingestellt.","A causa dei lavori sulla banchina, la circolazione dei treni è stata temporaneamente sospesa.","B2","aussage"],
      ["Die Erschließung der Insel für den Tourismus veränderte das Leben ihrer Bewohner grundlegend.","Lo sviluppo turistico dell'isola cambiò radicalmente la vita dei suoi abitanti.","B2","aussage"],
      ["Obwohl das Zimmer klein war, überzeugte es durch seine herrliche Aussicht auf den Fluss.","Sebbene la stanza fosse piccola, convinceva per la sua magnifica vista sul fiume.","B2","aussage"],
      ["Der Ausbau des Radwegnetzes entlang der Küste wird von der Region finanziert.","L'ampliamento della rete di piste ciclabili lungo la costa è finanziato dalla regione.","B2","aussage"],
      ["Die Entscheidung des Reiseveranstalters, den Ausflug zu verschieben, sorgte für allgemeinen Unmut.","La decisione del tour operator di rinviare la gita provocò un malcontento generale.","B2","aussage"],
      ["Angesichts der langen Wartezeiten am Schalter wurde zusätzliches Personal eingesetzt.","Vista la lunga attesa allo sportello, è stato impiegato personale aggiuntivo.","B2","aussage"],
      ["Wird die Fähre trotz des starken Windes heute noch auslaufen?","La nave partirà comunque oggi nonostante il forte vento?","B2","frage"],
      ["Inwiefern beeinflusst die Digitalisierung der Buchungsplattformen das Reiseverhalten junger Menschen?","In che misura la digitalizzazione delle piattaforme di prenotazione influenza il comportamento di viaggio dei giovani?","B2","frage"],
      ["Sollte man angesichts steigender Preise nicht lieber die Nebensaison für Reisen wählen?","Non converrebbe piuttosto scegliere la bassa stagione per viaggiare, visti i prezzi in aumento?","B2","frage"],
      ["Wie wird die Instandhaltung der Bergpfade eigentlich finanziert?","Come viene finanziata, in realtà, la manutenzione dei sentieri di montagna?","B2","frage"],
      ["Obwohl der Ausflug wegen des Unwetters storniert wurde, blieb die Stimmung der Gruppe erstaunlich gut.","Sebbene la gita fosse stata annullata per il maltempo, l'umore del gruppo rimase sorprendentemente buono.","B2","nebensatz"],
      ["Da die Straßen des Dorfes für Autos gesperrt waren, mussten wir das Gepäck zu Fuß tragen.","Poiché le strade del paese erano chiuse alle auto, dovemmo portare i bagagli a piedi.","B2","nebensatz"],
      ["Während die Küstenregionen von Touristen überlaufen sind, bleibt das Hinterland weitgehend unentdeckt.","Mentre le zone costiere sono invase dai turisti, l'entroterra resta in gran parte inesplorato.","B2","nebensatz"],
      ["Nachdem die Grenze wegen der Kontrollen stundenlang gesperrt worden war, bildete sich ein kilometerlanger Stau.","Dopo che il confine era stato chiuso per ore a causa dei controlli, si formò una coda lunga chilometri.","B2","nebensatz"],
      ["Von der schieren Größe des Nationalparks überwältigt, verbrachten wir Stunden damit, die endlose Weite zu betrachten.","Sopraffatti dalla mera vastità del parco nazionale, passammo ore a contemplarne l'infinita ampiezza.","C1","aussage"],
      ["Der Reiseleiter erklärte, er habe die Route eigens auf die Bedürfnisse älterer Teilnehmer zugeschnitten.","La guida spiegò che aveva adattato appositamente il percorso alle esigenze dei partecipanti più anziani.","C1","aussage"],
      ["Angesichts der unberechenbaren Wetterlage empfiehlt es sich, den Aufstieg auf den Gipfel zu verschieben.","Vista l'imprevedibilità del meteo, è consigliabile rinviare la salita alla vetta.","C1","aussage"],
      ["Nach stundenlanger Wartezeit am überfüllten Schalter platzte ihm schließlich der Kragen.","Dopo ore di attesa allo sportello affollato, alla fine perse le staffe.","C1","aussage"],
      ["Die Reederei versicherte, sie werde für den entstandenen Schaden vollumfänglich aufkommen.","La compagnia di navigazione assicurò che avrebbe risarcito integralmente il danno subito.","C1","aussage"],
      ["Von einer unbändigen Abenteuerlust getrieben, brach sie ohne festen Rückreisetermin auf.","Spinta da un'incontenibile voglia di avventura, partì senza una data di ritorno stabilita.","C1","aussage"],
      ["Der erfahrene Bergführer riet den Wanderern eindringlich, bei einbrechender Dunkelheit umzukehren.","L'esperta guida alpina consigliò vivamente agli escursionisti di tornare indietro al calare del buio.","C1","aussage"],
      ["Sie gestand, dass ihr angesichts der schwindelerregenden Höhe des Aussichtsturms unwohl zumute war.","Confessò che, data la vertiginosa altezza della torre panoramica, si sentiva a disagio.","C1","aussage"],
      ["Erschöpft von der langen Anreise, sank er sofort ins weiche Hotelbett.","Sfinito dal lungo viaggio, sprofondò subito nel morbido letto dell'hotel.","C1","aussage"],
      ["Der Kapitän kündigte an, das Schiff werde wegen des aufziehenden Sturms den Hafen nicht verlassen.","Il capitano annunciò che la nave non avrebbe lasciato il porto a causa della tempesta in arrivo.","C1","aussage"],
      ["Mit wachsender Ungeduld verfolgten die Passagiere die stetig steigende Verspätungsanzeige.","Con crescente impazienza, i passeggeri seguivano l'indicatore di ritardo che aumentava costantemente.","C1","aussage"],
      ["Ein plötzlicher Wolkenbruch zwang uns, unsere Wanderung vorzeitig abzubrechen.","Un improvviso acquazzone ci costrinse a interrompere anticipatamente l'escursione.","C1","aussage"],
      ["Vom jahrelangen Umherziehen gezeichnet, sehnte er sich zunehmend nach einem festen Zuhause.","Segnato da anni di vagabondaggio, desiderava sempre più una dimora stabile.","C1","aussage"],
      ["Die Fluggesellschaft räumte ein, dass technische Probleme für die Verspätung verantwortlich seien.","La compagnia aerea ammise che problemi tecnici erano responsabili del ritardo.","C1","aussage"],
      ["Getrieben von der Neugier auf ferne Kulturen, bereiste er in jungen Jahren drei Kontinente.","Spinto dalla curiosità per culture lontane, in gioventù viaggiò per tre continenti.","C1","aussage"],
      ["Wie lässt sich der schmale Grat zwischen respektvoller Neugier und aufdringlichem Voyeurismus beim Reisen wahren?","Come si può mantenere il sottile confine tra rispettosa curiosità e fastidioso voyeurismo mentre si viaggia?","C1","frage"],
      ["Wäre es nicht ratsam, angesichts der angespannten Sicherheitslage von dieser Route gänzlich abzusehen?","Non sarebbe opportuno rinunciare del tutto a questo percorso, data la tesa situazione della sicurezza?","C1","frage"],
      ["Inwieweit rechtfertigt der kulturelle Gewinn einer Reise die damit verbundenen ökologischen Kosten?","In che misura il beneficio culturale di un viaggio giustifica i costi ecologici che comporta?","C1","frage"],
      ["Wer hätte gedacht, dass ausgerechnet dieser abgelegene Küstenort einmal zum gefragtesten Reiseziel der Region würde?","Chi avrebbe pensato che proprio questa località costiera remota sarebbe diventata la meta più ambita della regione?","C1","frage"],
      ["Obschon die Reisegruppe mehrfach vor den Strapazen der Route gewarnt worden war, ließ sich niemand davon abschrecken.","Sebbene il gruppo fosse stato più volte avvertito delle difficoltà del percorso, nessuno si lasciò scoraggiare.","C1","nebensatz"],
      ["Während der eine Teil der Delegation auf dem Landweg reiste, zog es der andere vor, zu fliegen.","Mentre una parte della delegazione viaggiava via terra, l'altra preferì volare.","C1","nebensatz"],
      ["Da sich das Unwetter rascher als erwartet zusammenbraute, brachen die Bergsteiger den Aufstieg vorzeitig ab.","Poiché il temporale si stava formando più rapidamente del previsto, gli alpinisti interruppero anticipatamente la salita.","C1","nebensatz"],
      ["Nachdem er Jahre damit verbracht hatte, entlegene Winkel der Erde zu erkunden, kehrte er unerwartet in sein Heimatdorf zurück.","Dopo aver trascorso anni a esplorare angoli remoti della terra, tornò inaspettatamente al suo villaggio natale.","C1","nebensatz"],
      ["Wer glaubt, das bloße Abhaken exotischer Reiseziele mache aus einem Touristen einen Weltbürger, verkennt den eigentlichen Sinn des Reisens.","Chi crede che il semplice spuntare mete esotiche trasformi un turista in un cittadino del mondo, fraintende il vero senso del viaggiare.","C2","aussage"],
      ["Kaum etwas ernüchtert schneller als die Erkenntnis, dass das vermeintlich unberührte Fischerdorf längst zur Kulisse für Hochglanzprospekte verkommen ist.","Poco disillude più in fretta della scoperta che il presunto intatto villaggio di pescatori sia ormai ridotto a scenografia per depliant patinati.","C2","aussage"],
      ["Es gehört zur bitteren Ironie des modernen Reisens, dass ausgerechnet die Suche nach Ursprünglichkeit deren endgültigen Untergang beschleunigt.","È una delle amare ironie del viaggiare moderno che proprio la ricerca dell'autenticità ne acceleri la definitiva scomparsa.","C2","aussage"],
      ["Nichts offenbart die Kluft zwischen Reiseprospekt und Wirklichkeit so schonungslos wie der erste Blick auf das überfüllte Hotelbecken.","Nulla rivela il divario tra depliant turistico e realtà in modo così spietato quanto il primo sguardo alla piscina affollata dell'hotel.","C2","aussage"],
      ["Die Verklärung des Vagabundendaseins übersieht geflissentlich, dass echte Heimatlosigkeit selten etwas mit romantischer Freiheit gemein hat.","L'idealizzazione della vita da vagabondo ignora deliberatamente che la vera assenza di una casa raramente ha qualcosa in comune con la libertà romantica.","C2","aussage"],
      ["Selbst der abgebrühteste Vielreisende gerät gelegentlich ins Staunen, wenn ihn eine unscheinbare Begegnung unterwegs eines Besseren belehrt.","Persino il viaggiatore più navigato resta ogni tanto sbalordito quando un incontro insignificante lungo la strada lo smentisce.","C2","aussage"],
      ["Manche Reisende scheinen weniger auf der Suche nach der Welt als vielmehr auf der Flucht vor sich selbst zu sein.","Alcuni viaggiatori sembrano meno alla ricerca del mondo che in fuga da se stessi.","C2","aussage"],
      ["Der stille Triumph des Reisenden liegt nicht im Abhaken von Zielen, sondern in jenen flüchtigen Momenten unverhoffter Klarheit.","Il trionfo silenzioso del viaggiatore non sta nello spuntare mete, bensì in quei fugaci momenti di inattesa lucidità.","C2","aussage"],
      ["Wo einst Karawanen durch unwegsames Gelände zogen, rollen heute klimatisierte Reisebusse im Halbstundentakt.","Dove un tempo carovane attraversavano terreni impervi, oggi sfrecciano pullman climatizzati ogni mezz'ora.","C2","aussage"],
      ["Die Behauptung, man kehre von jeder Reise als anderer Mensch zurück, entpuppt sich bei genauerem Hinsehen oft als bequeme Selbsttäuschung.","L'affermazione secondo cui si torna da ogni viaggio come persone diverse si rivela spesso, a ben guardare, una comoda autoillusione.","C2","aussage"],
      ["Zwischen dem Wunsch, dem Alltag zu entfliehen, und der Unmöglichkeit, sich selbst zu entkommen, bewegt sich jeder noch so weite Reisende.","Tra il desiderio di sfuggire alla routine e l'impossibilità di sfuggire a se stessi si muove ogni viaggiatore, per quanto lontano vada.","C2","aussage"],
      ["Es bedarf keiner fernen Länder, um sich fremd zu fühlen; oft genügt schon ein Blick hinter die eigene vertraute Fassade.","Non servono paesi lontani per sentirsi stranieri; spesso basta uno sguardo dietro la propria facciata familiare.","C2","aussage"],
      ["Das Gepäck mag mit den Jahren leichter geworden sein, doch der Ballast an Erwartungen wiegt bei manchen Reisenden schwerer denn je.","Il bagaglio sarà forse diventato più leggero con gli anni, ma il peso delle aspettative grava su alcuni viaggiatori più che mai.","C2","aussage"],
      ["So mancher Weltreisende musste erst am äußersten Ende der Welt begreifen, wonach er die ganze Zeit gesucht hatte.","Più di un giramondo ha dovuto capire proprio ai confini del mondo cosa stesse cercando per tutto quel tempo.","C2","aussage"],
      ["Erst wenn der letzte Zug der Neugier verklungen ist, zeigt sich, ob aus dem Reisenden ein Sesshafter geworden ist.","Solo quando l'ultimo slancio di curiosità si è spento, si vede se il viaggiatore è diventato un sedentario.","C2","aussage"],
      ["Ist es nicht bezeichnend, dass wir ausgerechnet dort nach Ursprünglichkeit suchen, wo längst jeder Winkel touristisch erschlossen wurde?","Non è significativo che cerchiamo l'autenticità proprio là dove ormai ogni angolo è stato reso turistico?","C2","frage"],
      ["Wie viel vom eigenen Selbst muss man eigentlich zurücklassen, um sich einer fremden Kultur wirklich zu öffnen?","Quanto di se stessi bisogna in fondo lasciarsi alle spalle per aprirsi davvero a una cultura straniera?","C2","frage"],
      ["Vermag die bloße Anhäufung bereister Länder überhaupt etwas über die Tiefe einer gelebten Erfahrung auszusagen?","Il mero accumulo di paesi visitati può dire qualcosa sulla profondità di un'esperienza vissuta?","C2","frage"],
      ["Wo, wenn nicht auf Reisen fernab jeder Routine, sollte sich die eigene Wahrhaftigkeit erweisen?","Dove, se non in viaggio lontano da ogni routine, dovrebbe manifestarsi la propria autenticità?","C2","frage"],
      ["Mag die Fernwehsehnsucht auch noch so übermächtig sein, so bleibt sie doch letztlich unstillbar, solange man sich selbst nicht entkommt.","Per quanto struggente possa essere la nostalgia dei luoghi lontani, essa resta comunque incolmabile finché non si sfugge a se stessi.","C2","nebensatz"],
      ["Während der unbedarfte Tourist die Postkartenidylle für bare Münze nimmt, ahnt der erfahrene Reisende längst, wie trügerisch solche Bilder sind.","Mentre il turista ingenuo prende per buona l'idillio da cartolina, il viaggiatore navigato intuisce già quanto ingannevoli siano tali immagini.","C2","nebensatz"],
      ["So sehr man sich auch vornimmt, ohne Vorurteile zu reisen, so unweigerlich schleichen sich doch die eigenen Prägungen in jede Begegnung ein.","Per quanto ci si proponga di viaggiare senza pregiudizi, i propri condizionamenti si insinuano inevitabilmente in ogni incontro.","C2","nebensatz"],
      ["Kaum ist man an einem Ort heimisch geworden, treibt einen die Rastlosigkeit schon wieder zum nächsten Aufbruch.","Non appena ci si è ambientati in un luogo, l'irrequietezza spinge già verso la prossima partenza.","C2","nebensatz"],
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
      ["Während die einen für ein Ende der Notengebung plädieren, warnen andere davor, dass dadurch jeglicher Leistungsanreiz verlorenginge.","Mentre alcuni si battono per l'abolizione dei voti, altri avvertono che ciò farebbe venire meno ogni stimolo al rendimento.","C2","nebensatz"],
      ["Ich habe heute drei Stunden Unterricht.","Oggi ho tre ore di lezione.","A1","aussage"],
      ["Die Schülerin liest laut vor der Klasse.","La studentessa legge ad alta voce davanti alla classe.","A1","aussage"],
      ["Wir malen bunte Bilder im Kunstunterricht.","Disegniamo immagini colorate a lezione di arte.","A1","aussage"],
      ["Mein Heft ist ganz neu.","Il mio quaderno è nuovissimo.","A1","aussage"],
      ["Der Lehrer ist heute sehr freundlich.","Oggi l'insegnante è molto gentile.","A1","aussage"],
      ["Ich zähle die Zahlen bis hundert.","Conto i numeri fino a cento.","A1","aussage"],
      ["Wir üben heute die Verben.","Oggi esercitiamo i verbi.","A1","aussage"],
      ["Meine Klasse hat zwanzig Schüler.","La mia classe ha venti studenti.","A1","aussage"],
      ["Der Rucksack liegt unter dem Tisch.","Lo zaino è sotto il tavolo.","A1","aussage"],
      ["Ich brauche einen roten Kugelschreiber.","Ho bisogno di una penna rossa.","A1","aussage"],
      ["Die Schule hat einen großen Garten.","La scuola ha un grande giardino.","A1","aussage"],
      ["Wir singen heute ein neues Lied.","Oggi cantiamo una canzone nuova.","A1","aussage"],
      ["Mein Bruder geht in die erste Klasse.","Mio fratello frequenta la prima classe.","A1","aussage"],
      ["Die Tafel ist heute ganz sauber.","Oggi la lavagna è tutta pulita.","A1","aussage"],
      ["Ich packe meine Bücher in die Tasche.","Metto i miei libri nella borsa.","A1","aussage"],
      ["Wie heißt deine Lehrerin?","Come si chiama la tua insegnante?","A1","frage"],
      ["Welches Buch liest du gerade?","Quale libro stai leggendo adesso?","A1","frage"],
      ["Wie viele Fächer hast du heute?","Quante materie hai oggi?","A1","frage"],
      ["Magst du Mathematik?","Ti piace la matematica?","A1","frage"],
      ["Ich lerne viel, weil die Prüfung wichtig ist.","Studio molto perché l'esame è importante.","A1","nebensatz"],
      ["Wir bleiben drinnen, wenn es regnet.","Restiamo dentro quando piove.","A1","nebensatz"],
      ["Ich glaube, dass die Aufgabe leicht ist.","Penso che l'esercizio sia facile.","A1","nebensatz"],
      ["Er lernt Deutsch, weil er nach Berlin fährt.","Impara il tedesco perché va a Berlino.","A1","nebensatz"],
      ["Ich habe mich für einen Sprachkurs angemeldet.","Mi sono iscritto a un corso di lingua.","A2","aussage"],
      ["Wir haben gestern eine mündliche Prüfung gehabt.","Ieri abbiamo avuto un esame orale.","A2","aussage"],
      ["Ich muss heute Abend noch ein Referat vorbereiten.","Stasera devo ancora preparare una relazione.","A2","aussage"],
      ["Der Lehrer hat die Hausaufgabe an die Tafel geschrieben.","L'insegnante ha scritto il compito alla lavagna.","A2","aussage"],
      ["Wir haben in der Pause über die Prüfung gesprochen.","Durante la pausa abbiamo parlato dell'esame.","A2","aussage"],
      ["Ich habe mein Zeugnis heute bekommen.","Oggi ho ricevuto la pagella.","A2","aussage"],
      ["Wir sollen bis morgen einen Aufsatz schreiben.","Dobbiamo scrivere un tema entro domani.","A2","aussage"],
      ["Ich habe im Unterricht eine Frage gestellt.","Ho fatto una domanda durante la lezione.","A2","aussage"],
      ["Die Schule hat einen neuen Computerraum eingerichtet.","La scuola ha allestito una nuova aula computer.","A2","aussage"],
      ["Ich habe mich sehr auf die Ferien gefreut.","Non vedevo l'ora che iniziassero le vacanze.","A2","aussage"],
      ["Wir haben letzte Woche einen Test zurückbekommen.","La settimana scorsa abbiamo ricevuto indietro un test.","A2","aussage"],
      ["Ich habe angefangen, jeden Tag zu üben.","Ho iniziato a esercitarmi ogni giorno.","A2","aussage"],
      ["Der Lehrer hat uns die Prüfungstermine mitgeteilt.","L'insegnante ci ha comunicato le date degli esami.","A2","aussage"],
      ["Wir haben in der Bibliothek für die Prüfung gelernt.","Abbiamo studiato in biblioteca per l'esame.","A2","aussage"],
      ["Ich bin dieses Jahr in die zehnte Klasse gekommen.","Quest'anno sono passato alla decima classe.","A2","aussage"],
      ["Kannst du mir bei den Hausaufgaben helfen?","Puoi aiutarmi con i compiti?","A2","frage"],
      ["Wann bekommt ihr eure Zeugnisse?","Quando ricevete le vostre pagelle?","A2","frage"],
      ["Musst du heute noch etwas für die Schule lernen?","Devi ancora studiare qualcosa per la scuola oggi?","A2","frage"],
      ["Wie viele Hausaufgaben habt ihr heute aufbekommen?","Quanti compiti vi hanno dato oggi?","A2","frage"],
      ["Ich gehe früher schlafen, weil ich morgen eine Prüfung habe.","Vado a dormire prima perché domani ho un esame.","A2","nebensatz"],
      ["Wir freuen uns, wenn der Unterricht ausfällt.","Siamo contenti quando la lezione salta.","A2","nebensatz"],
      ["Ich denke, dass die Lehrerin heute streng ist.","Penso che l'insegnante oggi sia severa.","A2","nebensatz"],
      ["Er lernt jeden Abend, weil er das Stipendium bekommen möchte.","Studia ogni sera perché vuole ottenere la borsa di studio.","A2","nebensatz"],
      ["Früher lernten die Schüler viele Gedichte auswendig.","Un tempo gli studenti imparavano molte poesie a memoria.","B1","aussage"],
      ["Ich lege meine Bücher immer in das oberste Fach.","Metto sempre i miei libri nel ripiano più alto.","B1","aussage"],
      ["Der Stundenplan hängt seit Montag an der Klassenzimmertür.","L'orario è appeso alla porta della classe da lunedì.","B1","aussage"],
      ["Ich würde gern an einem Austauschprogramm teilnehmen.","Mi piacerebbe partecipare a un programma di scambio.","B1","aussage"],
      ["Damals besuchte ich eine kleine Dorfschule mit nur zwei Klassenräumen.","Allora frequentavo una piccola scuola di paese con solo due aule.","B1","aussage"],
      ["Ich stellte meinen Rucksack neben die Tür des Klassenzimmers.","Misi lo zaino accanto alla porta dell'aula.","B1","aussage"],
      ["Der Direktor hängte die Prüfungsergebnisse ans schwarze Brett.","Il preside appese i risultati degli esami in bacheca.","B1","aussage"],
      ["Ich würde Ihnen raten, sich frühzeitig für den Kurs anzumelden.","Le consiglierei di iscriversi al corso per tempo.","B1","aussage"],
      ["Wir setzten uns in die erste Reihe, um besser zu hören.","Ci sedemmo in prima fila per sentire meglio.","B1","aussage"],
      ["Mein Lehrer schrieb die wichtigsten Punkte an die Tafel.","Il mio insegnante scrisse i punti più importanti alla lavagna.","B1","aussage"],
      ["Ich hätte gern mehr Zeit für die Prüfungsvorbereitung gehabt.","Avrei voluto avere più tempo per prepararmi all'esame.","B1","aussage"],
      ["Wir gingen jeden Nachmittag in die Bibliothek, um zu lernen.","Andavamo ogni pomeriggio in biblioteca per studiare.","B1","aussage"],
      ["Der Professor stellte anspruchsvolle Fragen zum behandelten Thema.","Il professore fece domande impegnative sull'argomento trattato.","B1","aussage"],
      ["Ich sollte eigentlich mehr Vokabeln pro Woche lernen.","In realtà dovrei imparare più vocaboli a settimana.","B1","aussage"],
      ["Die Klasse feierte gemeinsam den letzten Schultag vor den Ferien.","La classe festeggiò insieme l'ultimo giorno di scuola prima delle vacanze.","B1","aussage"],
      ["Könnten Sie mir die Aufgabe bitte noch einmal erklären?","Potrebbe spiegarmi di nuovo l'esercizio, per favore?","B1","frage"],
      ["Wüssten Sie, ob die Prüfung schriftlich oder mündlich ist?","Saprebbe se l'esame è scritto o orale?","B1","frage"],
      ["Hätten Sie einen Moment Zeit für eine Frage zur Hausaufgabe?","Avrebbe un momento per una domanda sui compiti?","B1","frage"],
      ["Wie lange dauerte damals eure Schulpause?","Quanto durava allora la vostra ricreazione?","B1","frage"],
      ["Als ich zum ersten Mal in die Schule kam, hatte ich große Angst.","Quando andai a scuola per la prima volta, avevo molta paura.","B1","nebensatz"],
      ["Ich wüsste gern, ob man diese Prüfung wiederholen kann.","Vorrei sapere se si può ripetere questo esame.","B1","nebensatz"],
      ["Nachdem wir die Prüfung geschrieben hatten, feierten wir zusammen.","Dopo aver fatto l'esame, festeggiammo insieme.","B1","nebensatz"],
      ["Während die Lehrerin sprach, machten sich alle Notizen.","Mentre l'insegnante parlava, tutti prendevano appunti.","B1","nebensatz"],
      ["Die Ergebnisse der landesweiten Vergleichsstudie werden nächste Woche veröffentlicht.","I risultati dello studio comparativo nazionale saranno pubblicati la prossima settimana.","B2","aussage"],
      ["Der Mangel an qualifizierten Lehrkräften wird von vielen Schulleitern als drängendstes Problem bezeichnet.","La carenza di insegnanti qualificati viene definita da molti presidi come il problema più urgente.","B2","aussage"],
      ["Trotz erheblicher Investitionen bleibt die Ausstattung der Schulen vielerorts unzureichend.","Nonostante ingenti investimenti, la dotazione delle scuole resta in molti luoghi insufficiente.","B2","aussage"],
      ["Die Einführung des neuen Bewertungssystems wurde von den Eltern kontrovers diskutiert.","L'introduzione del nuovo sistema di valutazione è stata discussa in modo controverso dai genitori.","B2","aussage"],
      ["Allerdings zeigen aktuelle Studien, dass Hausaufgaben den Lernerfolg kaum steigern.","Tuttavia, studi recenti dimostrano che i compiti a casa migliorano a malapena il rendimento scolastico.","B2","aussage"],
      ["Die Aufnahmeprüfung des Gymnasiums wird traditionell im Frühjahr abgehalten.","L'esame di ammissione al liceo si tiene tradizionalmente in primavera.","B2","aussage"],
      ["Dennoch entschied sich die Mehrheit der Eltern gegen die Abschaffung der Noten.","Ciononostante, la maggioranza dei genitori si oppose all'abolizione dei voti.","B2","aussage"],
      ["Die Sanierung des maroden Schulgebäudes wird von der Gemeinde vollständig finanziert.","Il risanamento del fatiscente edificio scolastico è interamente finanziato dal comune.","B2","aussage"],
      ["Der stetig wachsende Leistungsdruck belastet zunehmend die psychische Gesundheit der Schüler.","La pressione da rendimento in costante crescita grava sempre di più sulla salute psichica degli studenti.","B2","aussage"],
      ["Wegen der niedrigen Anmeldezahlen wurde der Kurs für Latein leider gestrichen.","A causa del basso numero di iscrizioni, il corso di latino è stato purtroppo eliminato.","B2","aussage"],
      ["Die Digitalisierung des Unterrichts erfordert eine grundlegende Fortbildung der Lehrkräfte.","La digitalizzazione della didattica richiede una formazione di base per gli insegnanti.","B2","aussage"],
      ["Obwohl die Klasse sehr groß ist, gelingt es der Lehrerin, jeden Schüler einzubeziehen.","Sebbene la classe sia molto numerosa, l'insegnante riesce a coinvolgere ogni studente.","B2","aussage"],
      ["Die Abschaffung der Hausaufgaben an dieser Schule wurde von den meisten Lehrkräften begrüßt.","L'abolizione dei compiti a casa in questa scuola è stata accolta con favore dalla maggior parte degli insegnanti.","B2","aussage"],
      ["Angesichts sinkender Schülerzahlen wird über die Schließung mehrerer kleiner Schulen nachgedacht.","Vista la diminuzione del numero di studenti, si sta valutando la chiusura di diverse piccole scuole.","B2","aussage"],
      ["Die Vernetzung der Universität mit lokalen Unternehmen soll den Berufseinstieg der Absolventen erleichtern.","Il collegamento dell'università con le aziende locali dovrebbe facilitare l'inserimento lavorativo dei laureati.","B2","aussage"],
      ["Wird die Notenvergabe an dieser Schule künftig transparenter gestaltet?","La valutazione dei voti in questa scuola verrà resa più trasparente in futuro?","B2","frage"],
      ["Inwiefern trägt frühkindliche Bildung tatsächlich zur Chancengleichheit bei?","In che misura l'istruzione nella prima infanzia contribuisce realmente alle pari opportunità?","B2","frage"],
      ["Sollte die Bewertung von Gruppenarbeiten nicht grundlegend überdacht werden?","Non si dovrebbe ripensare radicalmente la valutazione dei lavori di gruppo?","B2","frage"],
      ["Wie wird eigentlich die Qualität des Fernunterrichts an den Universitäten überprüft?","Come viene in realtà verificata la qualità della didattica a distanza nelle università?","B2","frage"],
      ["Obwohl die Reform des Lehrplans lange vorbereitet wurde, stieß sie bei vielen Lehrern auf Widerstand.","Sebbene la riforma del curriculum fosse stata preparata a lungo, incontrò resistenza tra molti insegnanti.","B2","nebensatz"],
      ["Da die Mittel des Bildungsministeriums gekürzt wurden, mussten mehrere Projekte eingestellt werden.","Poiché i fondi del ministero dell'istruzione sono stati tagliati, diversi progetti hanno dovuto essere sospesi.","B2","nebensatz"],
      ["Während die einen Schulen auf digitale Endgeräte setzen, verzichten andere bewusst darauf.","Mentre alcune scuole puntano sui dispositivi digitali, altre vi rinunciano consapevolmente.","B2","nebensatz"],
      ["Nachdem das neue Bewertungssystem eingeführt worden war, sank die Zahl der Beschwerden merklich.","Dopo che il nuovo sistema di valutazione era stato introdotto, il numero di reclami diminuì sensibilmente.","B2","nebensatz"],
      ["Von der Fülle des Lehrstoffs überfordert, brach mancher Student das Studium schon im ersten Semester ab.","Sopraffatto dalla mole di materiale didattico, più di uno studente abbandonò gli studi già al primo semestre.","C1","aussage"],
      ["Der Rektor erklärte, die Universität werde künftig verstärkt auf interdisziplinäre Studiengänge setzen.","Il rettore dichiarò che l'università avrebbe puntato in futuro maggiormente su corsi di laurea interdisciplinari.","C1","aussage"],
      ["Angesichts des eklatanten Fachkräftemangels drängt sich eine Reform der Berufsausbildung geradezu auf.","Data la palese carenza di manodopera qualificata, una riforma della formazione professionale si impone quasi da sé.","C1","aussage"],
      ["Nach jahrelangem Ringen um Anerkennung gelang es ihr endlich, ihre Doktorarbeit erfolgreich zu verteidigen.","Dopo anni di lotta per il riconoscimento, riuscì finalmente a discutere con successo la sua tesi di dottorato.","C1","aussage"],
      ["Die Kommission versicherte, sie werde die Studiengebühren in absehbarer Zeit nicht erhöhen.","La commissione assicurò che non avrebbe aumentato le tasse universitarie nel prossimo futuro.","C1","aussage"],
      ["Von einem unbändigen Wissensdurst getrieben, vertiefte er sich schon als Kind in dicke Fachbücher.","Spinto da un'insaziabile sete di sapere, già da bambino si immergeva in spessi libri specialistici.","C1","aussage"],
      ["Der erfahrene Professor riet den Doktoranden eindringlich, sich nicht in Nebensächlichkeiten zu verlieren.","Il professore esperto consigliò vivamente ai dottorandi di non perdersi in dettagli secondari.","C1","aussage"],
      ["Sie gab zu, dass ihr angesichts des bevorstehenden Rigorosums bange zumute war.","Ammise che, in vista dell'imminente esame di dottorato, si sentiva in ansia.","C1","aussage"],
      ["Erschöpft vom nächtelangen Pauken, schlief er noch während der Prüfung fast ein.","Sfinito dalle notti passate a sgobbare, durante l'esame si addormentò quasi.","C1","aussage"],
      ["Das Ministerium kündigte an, die Lehrpläne würden einer grundlegenden Überarbeitung unterzogen.","Il ministero annunciò che i programmi scolastici sarebbero stati sottoposti a una revisione radicale.","C1","aussage"],
      ["Mit wachsendem Unmut verfolgten die Studierenden die endlosen Verzögerungen bei der Anerkennung ihrer Abschlüsse.","Con crescente malcontento, gli studenti seguivano gli infiniti ritardi nel riconoscimento dei loro titoli.","C1","aussage"],
      ["Eine plötzliche Erkenntnis zwang ihn, seine gesamte Studienwahl noch einmal zu überdenken.","Un'improvvisa presa di coscienza lo costrinse a ripensare completamente la scelta degli studi.","C1","aussage"],
      ["Von jahrelanger Prüfungsangst gezeichnet, mied sie mündliche Prüfungen bis zuletzt, wo immer es ging.","Segnata da anni di ansia da esame, evitò gli esami orali fino alla fine, ove possibile.","C1","aussage"],
      ["Die Hochschule räumte ein, dass organisatorische Mängel für das Prüfungschaos mitverantwortlich seien.","L'università ammise che carenze organizzative erano corresponsabili del caos degli esami.","C1","aussage"],
      ["Getrieben von dem Ehrgeiz, es den eigenen Eltern zu beweisen, absolvierte sie gleich zwei Studiengänge parallel.","Spinta dall'ambizione di dimostrarlo ai propri genitori, portò avanti due corsi di laurea in parallelo.","C1","aussage"],
      ["Wie lässt sich der schmale Grat zwischen Förderung und Überforderung begabter Schüler wahren?","Come si può mantenere il sottile confine tra il sostegno e il sovraccarico degli studenti dotati?","C1","frage"],
      ["Wäre es nicht ratsam, angesichts der hohen Abbrecherquote das Betreuungsangebot grundlegend auszubauen?","Non sarebbe opportuno ampliare radicalmente l'offerta di tutoraggio, visto l'alto tasso di abbandono?","C1","frage"],
      ["Inwieweit rechtfertigt der spätere berufliche Erfolg den enormen Leistungsdruck während der Schulzeit?","In che misura il successo professionale futuro giustifica l'enorme pressione da rendimento durante gli anni scolastici?","C1","frage"],
      ["Wer hätte gedacht, dass ausgerechnet der schwächste Schüler der Klasse einmal ein renommiertes Stipendium erhalten würde?","Chi avrebbe pensato che proprio lo studente più debole della classe avrebbe un giorno ricevuto una prestigiosa borsa di studio?","C1","frage"],
      ["Obschon der Student mehrfach vor der Schwierigkeit des Fachs gewarnt worden war, ließ er sich nicht davon abschrecken.","Sebbene lo studente fosse stato più volte avvertito della difficoltà della materia, non si lasciò scoraggiare.","C1","nebensatz"],
      ["Während der eine Teil der Klasse mühelos folgte, kämpfte der andere sichtlich mit dem Stoff.","Mentre una parte della classe seguiva senza sforzo, l'altra lottava visibilmente con la materia.","C1","nebensatz"],
      ["Da sich die Prüfungsordnung kurzfristig geändert hatte, mussten viele Studierende ihre Planung über den Haufen werfen.","Poiché il regolamento d'esame era cambiato all'ultimo momento, molti studenti dovettero stravolgere i propri piani.","C1","nebensatz"],
      ["Nachdem sie Jahre damit verbracht hatte, sich durch endlose Fachliteratur zu arbeiten, verteidigte sie ihre These mit bemerkenswerter Sicherheit.","Dopo aver trascorso anni a lavorare su una letteratura specialistica sterminata, difese la sua tesi con notevole sicurezza.","C1","nebensatz"],
      ["Wer glaubt, ein makelloses Zeugnis sage mehr über die Klugheit eines Menschen aus als sein Umgang mit dem Scheitern, irrt gewaltig.","Chi crede che una pagella impeccabile riveli più sull'intelligenza di una persona del suo modo di affrontare il fallimento si sbaglia di grosso.","C2","aussage"],
      ["Kaum etwas entlarvt die Schwächen eines Bildungssystems so gnadenlos wie die Frage, was von ihm übrig bleibt, sobald die Prüfungen vergessen sind.","Poco smaschera le debolezze di un sistema scolastico in modo così spietato quanto chiedersi cosa ne resti una volta dimenticati gli esami.","C2","aussage"],
      ["Es gehört zur Tragik akademischer Laufbahnen, dass ausgerechnet die originellsten Köpfe sich am schwersten in starre Bewertungsraster fügen.","È una delle tragedie delle carriere accademiche che proprio le menti più originali facciano più fatica ad adattarsi a rigidi schemi di valutazione.","C2","aussage"],
      ["Nichts offenbart die Grenzen der Notengebung so unbarmherzig wie ein Schüler, dessen Talent sich jeder Rubrik entzieht.","Nulla rivela i limiti della valutazione con i voti in modo così impietoso quanto uno studente il cui talento sfugge a ogni categoria.","C2","aussage"],
      ["Die Verklärung der eigenen Schulzeit übersieht geflissentlich, wie viel Angst und Selbstzweifel sie tatsächlich mit sich brachte.","L'idealizzazione dei propri anni scolastici ignora deliberatamente quanta paura e insicurezza essi in realtà comportassero.","C2","aussage"],
      ["Selbst der überzeugteste Verfechter freien Lernens gerät ins Grübeln, sobald ihn die Frage nach messbaren Ergebnissen einholt.","Persino il più convinto sostenitore dell'apprendimento libero si ritrova a riflettere quando la questione dei risultati misurabili lo raggiunge.","C2","aussage"],
      ["Manche Institutionen scheinen weniger daran interessiert, kritisches Denken zu fördern, als vielmehr angepasste Absolventen hervorzubringen.","Alcune istituzioni sembrano meno interessate a promuovere il pensiero critico che a produrre laureati conformisti.","C2","aussage"],
      ["Der stille Triumph guter Bildung liegt nicht im Sammeln von Titeln, sondern im nie versiegenden Wunsch, weiter zu fragen.","Il trionfo silenzioso di una buona istruzione non sta nell'accumulo di titoli, bensì nel desiderio inesauribile di continuare a interrogarsi.","C2","aussage"],
      ["Wo einst der Rohrstock für Disziplin sorgte, sollen heute ausgeklügelte Motivationskonzepte dieselbe Wirkung erzielen.","Dove un tempo la bacchetta garantiva la disciplina, oggi sofisticati modelli motivazionali dovrebbero ottenere lo stesso effetto.","C2","aussage"],
      ["Die Behauptung, gute Bildung mache automatisch zu einem besseren Menschen, entpuppt sich bei genauerem Hinsehen als bequeme Illusion.","L'affermazione secondo cui una buona istruzione renda automaticamente persone migliori si rivela, a ben guardare, una comoda illusione.","C2","aussage"],
      ["Zwischen dem Anspruch, jeden Schüler individuell zu fördern, und der Realität überfüllter Klassenzimmer klafft eine kaum zu schließende Lücke.","Tra la pretesa di sostenere ogni studente individualmente e la realtà di aule sovraffollate si apre un divario difficilmente colmabile.","C2","aussage"],
      ["Es bedarf keiner glänzenden Abschlüsse, um gebildet zu sein; oft genügt schon die Bereitschaft, die eigene Meinung infrage zu stellen.","Non servono titoli brillanti per essere colti; spesso basta la disponibilità a mettere in discussione la propria opinione.","C2","aussage"],
      ["Das Diplom mag mit den Jahren an Glanz verlieren, doch der Zweifel an der eigenen Kompetenz bleibt manchem Absolventen ein Leben lang.","Il diploma potrà perdere lustro con gli anni, ma il dubbio sulla propria competenza resta ad alcuni laureati per tutta la vita.","C2","aussage"],
      ["So mancher Autodidakt musste erst außerhalb jeder Institution begreifen, wonach er die ganze Zeit gesucht hatte.","Più di un autodidatta ha dovuto capire proprio al di fuori di ogni istituzione cosa stesse cercando per tutto quel tempo.","C2","aussage"],
      ["Erst wenn der Prüfungsdruck verklungen ist, zeigt sich, ob aus dem gelernten Wissen echte Bildung geworden ist.","Solo quando la pressione degli esami si è dissolta, si vede se dal sapere appreso è nata una vera cultura.","C2","aussage"],
      ["Ist es nicht bezeichnend, dass wir Bildungserfolg ausgerechnet an dem messen, was sich am leichtesten in Zahlen fassen lässt?","Non è significativo che misuriamo il successo scolastico proprio con ciò che si può più facilmente ridurre a numeri?","C2","frage"],
      ["Wie viel Anpassung an das System muss man eigentlich leisten, um darin als gebildet zu gelten?","Quanto adattamento al sistema bisogna in fondo dimostrare per essere considerati colti al suo interno?","C2","frage"],
      ["Vermag die bloße Anhäufung von Diplomen überhaupt etwas über die Tiefe des eigenen Denkens auszusagen?","Il mero accumulo di diplomi può dire qualcosa sulla profondità del proprio pensiero?","C2","frage"],
      ["Wo, wenn nicht in der Bildung fernab jeden Leistungsdrucks, sollte sich echte Neugier entfalten können?","Dove, se non in un'istruzione lontana da ogni pressione da rendimento, dovrebbe potersi sviluppare una vera curiosità?","C2","frage"],
      ["Mag der Wissensdurst eines Kindes auch noch so groß sein, so erlahmt er doch rasch, sobald ihn ein starres System erstickt.","Per quanto grande possa essere la sete di sapere di un bambino, essa si affievolisce presto non appena un sistema rigido la soffoca.","C2","nebensatz"],
      ["Während der unbedarfte Schüler die Note für bare Münze nimmt, weiß der erfahrene Pädagoge längst, wie wenig sie oft aussagt.","Mentre lo studente ingenuo prende il voto per buono, il pedagogista esperto sa già da tempo quanto poco esso spesso dica.","C2","nebensatz"],
      ["So sehr man sich auch vornimmt, objektiv zu bewerten, so unweigerlich schleichen sich doch persönliche Vorlieben in jede Note ein.","Per quanto ci si proponga di valutare in modo obiettivo, le preferenze personali si insinuano inevitabilmente in ogni voto.","C2","nebensatz"],
      ["Kaum hat man einen Abschluss in der Tasche, verlangt der Arbeitsmarkt schon wieder nach der nächsten Qualifikation.","Non appena si ha un diploma in tasca, il mercato del lavoro richiede già la prossima qualifica.","C2","nebensatz"],
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
      ["Erst wenn man selbst schwer erkrankt, begreift man, wie zerbrechlich das eigene Wohlbefinden in Wahrheit ist.","Solo quando ci si ammala gravemente, si capisce quanto sia in realtà fragile il proprio benessere.","C2","nebensatz"],
      ["Ich habe Halsschmerzen.","Ho mal di gola.","A1","aussage"],
      ["Der Zahn tut mir weh.","Mi fa male il dente.","A1","aussage"],
      ["Ich schlafe heute Nacht schlecht.","Stanotte dormo male.","A1","aussage"],
      ["Meine Augen tun weh.","Mi fanno male gli occhi.","A1","aussage"],
      ["Ich mache jeden Tag Sport.","Faccio sport ogni giorno.","A1","aussage"],
      ["Wir kaufen Medikamente in der Apotheke.","Compriamo medicine in farmacia.","A1","aussage"],
      ["Ich trage eine Brille.","Porto gli occhiali.","A1","aussage"],
      ["Der Rücken tut mir weh.","Mi fa male la schiena.","A1","aussage"],
      ["Ich huste seit gestern.","Tossisco da ieri.","A1","aussage"],
      ["Meine Tochter braucht eine Impfung.","Mia figlia ha bisogno di un vaccino.","A1","aussage"],
      ["Ich zeige der Ärztin meine Karte.","Mostro la tessera alla dottoressa.","A1","aussage"],
      ["Wir laufen jeden Morgen im Park.","Corriamo ogni mattina al parco.","A1","aussage"],
      ["Ich esse viel Obst und Gemüse.","Mangio molta frutta e verdura.","A1","aussage"],
      ["Der Termin ist am Montag.","L'appuntamento è lunedì.","A1","aussage"],
      ["Ich vergesse oft meine Tabletten.","Dimentico spesso le mie compresse.","A1","aussage"],
      ["Nimmst du deine Vitamine?","Prendi le tue vitamine?","A1","frage"],
      ["Bist du erkältet?","Sei raffreddato?","A1","frage"],
      ["Schläfst du gut?","Dormi bene?","A1","frage"],
      ["Hast du eine Allergie?","Hai un'allergia?","A1","frage"],
      ["Ich trinke Tee, weil mein Hals wehtut.","Bevo una tisana perché mi fa male la gola.","A1","nebensatz"],
      ["Ich gehe schlafen, wenn ich müde bin.","Vado a dormire quando sono stanco.","A1","nebensatz"],
      ["Die Ärztin sagt, dass ich gesund bin.","La dottoressa dice che sono sano.","A1","nebensatz"],
      ["Ich mache Sport, weil das gesund ist.","Faccio sport perché fa bene alla salute.","A1","nebensatz"],
      ["Ich habe mir letzte Woche das Bein gebrochen.","La settimana scorsa mi sono rotto la gamba.","A2","aussage"],
      ["Der Arzt hat mich für drei Tage krankgeschrieben.","Il medico mi ha dato tre giorni di malattia.","A2","aussage"],
      ["Ich muss jeden Abend eine Salbe auftragen.","Devo applicare una pomata ogni sera.","A2","aussage"],
      ["Wir haben uns beide gegen Grippe impfen lassen.","Ci siamo vaccinati entrambi contro l'influenza.","A2","aussage"],
      ["Ich habe endlich einen Termin beim Hautarzt bekommen.","Ho finalmente ottenuto un appuntamento dal dermatologo.","A2","aussage"],
      ["Meine Tante hat vor Kurzem eine Diät angefangen.","Mia zia ha iniziato da poco una dieta.","A2","aussage"],
      ["Ich bin gestern zum Blutabnehmen gegangen.","Ieri sono andato a fare le analisi del sangue.","A2","aussage"],
      ["Er hat sich beim Skifahren die Schulter verletzt.","Si è fatto male alla spalla sciando.","A2","aussage"],
      ["Ich habe schon seit zwei Wochen Rückenschmerzen.","Ho già mal di schiena da due settimane.","A2","aussage"],
      ["Wir haben letzten Monat die Krankenkasse gewechselt.","Il mese scorso abbiamo cambiato cassa malati.","A2","aussage"],
      ["Ich habe vergessen, meine Tabletten einzupacken.","Ho dimenticato di mettere in valigia le mie compresse.","A2","aussage"],
      ["Die Apothekerin hat mir etwas gegen den Husten empfohlen.","La farmacista mi ha consigliato qualcosa contro la tosse.","A2","aussage"],
      ["Ich muss vor dem Termin nüchtern bleiben.","Devo restare a digiuno prima dell'appuntamento.","A2","aussage"],
      ["Meine Augen sind seit dem Sommer schlechter geworden.","I miei occhi sono peggiorati dall'estate.","A2","aussage"],
      ["Ich habe endlich wieder acht Stunden geschlafen.","Ho finalmente dormito di nuovo otto ore.","A2","aussage"],
      ["Wann hast du deinen nächsten Termin?","Quando hai il tuo prossimo appuntamento?","A2","frage"],
      ["Musst du die Tabletten mit Essen nehmen?","Devi prendere le compresse con il cibo?","A2","frage"],
      ["Bist du schon beim Orthopäden gewesen?","Sei già stato dall'ortopedico?","A2","frage"],
      ["Wie oft treibst du eigentlich Sport?","Quanto spesso fai sport, in realtà?","A2","frage"],
      ["Ich gehe früh schlafen, weil ich morgen früh aufstehen muss.","Vado a letto presto perché domani devo alzarmi presto.","A2","nebensatz"],
      ["Ich nehme die Salbe, wenn die Haut juckt.","Uso la pomata quando la pelle prude.","A2","nebensatz"],
      ["Der Arzt hat gesagt, dass ich mehr Wasser trinken soll.","Il medico ha detto che dovrei bere più acqua.","A2","nebensatz"],
      ["Ich habe abgesagt, weil ich mich nicht wohlgefühlt habe.","Ho disdetto perché non mi sentivo bene.","A2","nebensatz"],
      ["Ich legte mir letzten Winter eine Wärmflasche auf den Bauch.","L'inverno scorso mi sono messo una borsa dell'acqua calda sulla pancia.","B1","aussage"],
      ["Der Arzt setzte mir eine Spritze in den Arm.","Il medico mi ha fatto un'iniezione nel braccio.","B1","aussage"],
      ["Ich hätte gern einen Termin für nächste Woche.","Vorrei un appuntamento per la settimana prossima.","B1","aussage"],
      ["Früher ging ich nur selten zur Vorsorgeuntersuchung.","Prima andavo raramente ai controlli preventivi.","B1","aussage"],
      ["Ich stellte die Medikamente sofort in den Kühlschrank.","Ho messo subito le medicine nel frigorifero.","B1","aussage"],
      ["Könnten Sie mir bitte ein stärkeres Schmerzmittel verschreiben?","Potrebbe prescrivermi per favore un antidolorifico più forte.","B1","frage"],
      ["Ich hänge meinen Impfpass immer an dieselbe Stelle im Schrank.","Appendo sempre il libretto delle vaccinazioni nello stesso posto dell'armadio.","B1","aussage"],
      ["Der Physiotherapeut legte mir während der Übung ein Kissen unter das Knie.","Durante l'esercizio il fisioterapista mi ha messo un cuscino sotto il ginocchio.","B1","aussage"],
      ["Ich saß eine ganze Stunde zwischen zwei kranken Patienten im Wartezimmer.","Sono rimasto seduto un'ora intera tra due pazienti malati in sala d'attesa.","B1","aussage"],
      ["Ich würde gerne wissen, was diese Untersuchung eigentlich kostet.","Vorrei sapere quanto costa in realtà questo esame.","B1","aussage"],
      ["Damals nahm ich noch überhaupt keine Vitamine.","All'epoca non prendevo ancora affatto vitamine.","B1","aussage"],
      ["Ich lege das Rezept immer auf den Küchentisch, damit ich es nicht vergesse.","Metto sempre la ricetta sul tavolo della cucina, così non la dimentico.","B1","aussage"],
      ["Der Arzt schrieb mir sofort eine Überweisung zum Kardiologen.","Il medico mi ha scritto subito un'impegnativa per il cardiologo.","B1","aussage"],
      ["Es wäre besser, wenn du in letzter Zeit mehr schlafen würdest.","Sarebbe meglio se ultimamente dormissi di più.","B1","aussage"],
      ["Nach dem Sport stellte ich mich sofort unter die kalte Dusche.","Dopo lo sport mi sono subito messo sotto la doccia fredda.","B1","aussage"],
      ["Könnten Sie mir sagen, wann die Ergebnisse endlich da sind?","Potrebbe dirmi quando saranno finalmente pronti i risultati?","B1","frage"],
      ["Wärst du bereit, deine Ernährung grundlegend umzustellen?","Saresti disposto a cambiare radicalmente la tua alimentazione?","B1","frage"],
      ["Wie ging es dir eigentlich nach der Behandlung?","Come ti sei sentito, in realtà, dopo la cura?","B1","frage"],
      ["Hättest du Lust, am Wochenende mit mir joggen zu gehen?","Avresti voglia di venire a correre con me nel weekend?","B1","frage"],
      ["Ich weiß nicht, ob die Krankenkasse diese Behandlung überhaupt übernimmt.","Non so se la cassa malati copra davvero questa cura.","B1","nebensatz"],
      ["Als ich jünger war, hatte ich nie Rückenschmerzen.","Quando ero più giovane non avevo mai mal di schiena.","B1","nebensatz"],
      ["Nachdem der Arzt mich untersucht hatte, fühlte ich mich viel beruhigter.","Dopo che il medico mi aveva visitato, mi sono sentito molto più tranquillo.","B1","nebensatz"],
      ["Ich gehe zur Kontrolle, obwohl ich mich im Moment ziemlich gut fühle.","Vado al controllo, anche se al momento mi sento abbastanza bene.","B1","nebensatz"],
      ["Die Genesung nach einer Operation hängt maßgeblich vom Alter und der körperlichen Verfassung des Patienten ab.","Il recupero dopo un'operazione dipende in modo determinante dall'età e dalle condizioni fisiche del paziente.","B2","aussage"],
      ["Trotz zahlreicher Warnhinweise wird das gesundheitliche Risiko des Rauchens von vielen Jugendlichen nach wie vor unterschätzt.","Nonostante numerosi avvertimenti, il rischio per la salute legato al fumo viene tuttora sottovalutato da molti giovani.","B2","aussage"],
      ["Die Kosten der aufwendigen Behandlung werden von der Krankenkasse leider nur teilweise übernommen.","Le spese della costosa cura vengono purtroppo coperte solo in parte dalla cassa malati.","B2","aussage"],
      ["Allerdings zeigt die neue Studie, dass der allgemeine Bewegungsmangel in der Bevölkerung nach wie vor unterschätzt wird.","Tuttavia il nuovo studio dimostra che la generale mancanza di movimento nella popolazione viene tuttora sottovalutata.","B2","aussage"],
      ["Der Mangel an Fachärzten auf dem Land erschwert die medizinische Versorgung der dortigen Bevölkerung erheblich.","La carenza di medici specialisti nelle zone rurali complica notevolmente l'assistenza medica della popolazione locale.","B2","aussage"],
      ["Die tägliche Ernährung des Kindes wurde vom Kinderarzt im Rahmen der Vorsorgeuntersuchung genau analysiert.","L'alimentazione quotidiana del bambino è stata analizzata attentamente dal pediatra durante il controllo preventivo.","B2","aussage"],
      ["Dennoch entscheiden sich viele Patienten aus Angst vor möglichen Komplikationen gegen eine dringend empfohlene Operation.","Ciononostante molti pazienti, per paura di possibili complicazioni, decidono contro un intervento vivamente consigliato.","B2","aussage"],
      ["Die regelmäßige Einnahme des Medikaments sollte stets nach vorheriger ärztlicher Absprache erfolgen.","L'assunzione regolare del farmaco dovrebbe sempre avvenire dopo un consulto medico preventivo.","B2","aussage"],
      ["Obwohl die Diagnose bereits eindeutig war, veranlasste der Arzt sicherheitshalber noch eine weitere Untersuchung.","Sebbene la diagnosi fosse già chiara, il medico ha comunque disposto per sicurezza un ulteriore esame.","B2","aussage"],
      ["Die Verschreibung starker Schmerzmittel unterliegt in Deutschland strengen gesetzlichen Vorgaben.","La prescrizione di forti antidolorifici è soggetta in Germania a rigide disposizioni di legge.","B2","aussage"],
      ["Der Anstieg psychischer Erkrankungen wird zunehmend mit dem wachsenden beruflichen Druck in Verbindung gebracht.","L'aumento delle malattie psichiche viene sempre più collegato alla crescente pressione lavorativa.","B2","aussage"],
      ["Die frühzeitige Erkennung der Krankheit durch den aufmerksamen Hausarzt hat ihr vermutlich das Leben gerettet.","La diagnosi precoce della malattia, grazie all'attento medico di base, le ha probabilmente salvato la vita.","B2","aussage"],
      ["Allerdings lässt sich der Erfolg einer solchen Therapie erst nach mehreren Monaten wirklich beurteilen.","Tuttavia il successo di una simile terapia si può davvero valutare solo dopo diversi mesi.","B2","aussage"],
      ["Die Wirkung des neuen Medikaments wird derzeit an mehreren Universitätskliniken sorgfältig getestet.","L'efficacia del nuovo farmaco viene attualmente testata con cura in diverse cliniche universitarie.","B2","aussage"],
      ["Die regelmäßige Vorsorgeuntersuchung des Herzens wird Menschen ab einem gewissen Alter dringend empfohlen.","Il controllo cardiologico preventivo regolare è vivamente consigliato alle persone a partire da una certa età.","B2","aussage"],
      ["Sollte die Kostenübernahme durch die Krankenkasse in solchen Fällen nicht großzügiger geregelt werden?","Non dovrebbe essere regolata in modo più generoso, in questi casi, la copertura dei costi da parte della cassa malati?","B2","frage"],
      ["Inwieweit trägt der zunehmende berufliche Stress eigentlich zur Entstehung solcher Beschwerden bei?","In che misura contribuisce in realtà il crescente stress lavorativo all'insorgenza di questi disturbi?","B2","frage"],
      ["Wäre eine engmaschigere Kontrolle des Blutdrucks in diesem Fall nicht sinnvoller gewesen?","Non sarebbe stato più opportuno, in questo caso, un controllo più frequente della pressione sanguigna?","B2","frage"],
      ["Wird die Wartezeit für einen Facharzttermin jemals wirklich spürbar verkürzt werden?","I tempi d'attesa per una visita specialistica verranno mai davvero ridotti in modo sensibile?","B2","frage"],
      ["Obwohl die möglichen Nebenwirkungen bekannt waren, entschied sich der Patient dennoch für die Behandlung.","Sebbene i possibili effetti collaterali fossero noti, il paziente ha comunque scelto la cura.","B2","nebensatz"],
      ["Da die Wartezeiten in vielen Praxen enorm sind, weichen zahlreiche Patienten auf private Kliniken aus.","Poiché i tempi d'attesa in molti studi medici sono enormi, molti pazienti si rivolgono a cliniche private.","B2","nebensatz"],
      ["Es wird angenommen, dass eine ausgewogene Ernährung eine entscheidende Rolle bei der Vorbeugung spielt.","Si ritiene che un'alimentazione equilibrata svolga un ruolo decisivo nella prevenzione.","B2","nebensatz"],
      ["Während die Impfquote in manchen Regionen recht hoch ist, bleibt sie andernorts erschreckend niedrig.","Mentre il tasso di vaccinazione è piuttosto alto in alcune regioni, altrove resta spaventosamente basso.","B2","nebensatz"],
      ["Der Chefarzt erklärte den besorgten Angehörigen, die Operation sei trotz anfänglicher Bedenken ohne nennenswerte Komplikationen verlaufen.","Il primario ha spiegato ai familiari preoccupati che, nonostante i timori iniziali, l'operazione era andata senza complicazioni degne di nota.","C1","aussage"],
      ["Von starken Schmerzen geplagt, suchte sie schließlich einen Spezialisten auf, obwohl sie Arztbesuche sonst mied.","Tormentata da forti dolori, alla fine si è rivolta a uno specialista, sebbene di solito evitasse i medici.","C1","aussage"],
      ["Eine ausgewogene Ernährung gilt gemeinhin als einer der wichtigsten Grundpfeiler jeder wirksamen und nachhaltigen Gesundheitsvorsorge.","Un'alimentazione equilibrata è comunemente considerata uno dei pilastri più importanti di una prevenzione sanitaria efficace e duratura.","C1","aussage"],
      ["Der Patient gab bei der Erstuntersuchung an, bereits seit vielen Monaten unter hartnäckigen Schlafstörungen zu leiden.","Durante la prima visita, il paziente ha dichiarato di soffrire già da molti mesi di persistenti disturbi del sonno.","C1","aussage"],
      ["Angetrieben von der Angst vor einem Rückfall, hielt er sich fortan äußerst strikt an die verordnete Diät.","Spinto dalla paura di una ricaduta, da allora ha seguito in modo estremamente rigoroso la dieta prescritta.","C1","aussage"],
      ["Es gehört mittlerweile zum guten Ton, sich jährlich einer gründlichen Vorsorgeuntersuchung zu unterziehen.","Ormai è buona norma sottoporsi ogni anno a un accurato controllo preventivo.","C1","aussage"],
      ["Die behandelnde Ärztin betonte gegenüber der Familie, der Heilungsprozess brauche vor allem Ruhe und Geduld.","La dottoressa curante ha sottolineato alla famiglia che il processo di guarigione richiede soprattutto riposo e pazienza.","C1","aussage"],
      ["Von Selbstzweifeln geplagt, wandte sie sich nach langem Zögern schließlich an einen erfahrenen Therapeuten.","Tormentata da dubbi su di sé, dopo lunghe esitazioni si è infine rivolta a un terapeuta esperto.","C1","aussage"],
      ["Der abschließende Bericht kam zu dem Schluss, dass ausreichender Schlaf in unserer Gesellschaft nach wie vor unterschätzt werde.","Il rapporto conclusivo è giunto alla conclusione che un sonno sufficiente sia tuttora sottovalutato nella nostra società.","C1","aussage"],
      ["Erschöpft von der langen Reha, gönnte er sich endlich eine wohlverdiente Auszeit am Meer.","Sfinito dalla lunga riabilitazione, si è finalmente concesso una meritata pausa al mare.","C1","aussage"],
      ["Der Verzicht auf Alkohol und Nikotin wirkt sich nachweislich äußerst positiv auf die Leber aus.","La rinuncia all'alcol e alla nicotina ha un effetto dimostrato e molto positivo sul fegato.","C1","aussage"],
      ["Angesichts der beunruhigenden Diagnose fasste sie den mutigen Entschluss, ihr Leben grundlegend umzukrempeln.","Di fronte alla preoccupante diagnosi, ha preso la coraggiosa decisione di cambiare radicalmente vita.","C1","aussage"],
      ["Getrieben von blindem Ehrgeiz, ignorierte er über Jahre hinweg die deutlichen Warnsignale seines eigenen Körpers.","Spinto da un'ambizione cieca, per anni ha ignorato i chiari segnali d'allarme del proprio corpo.","C1","aussage"],
      ["Der Facharzt riet ihr eindringlich, sich künftig nicht ausschließlich auf Schmerzmittel zu verlassen.","Lo specialista le ha consigliato con insistenza di non affidarsi in futuro esclusivamente agli antidolorifici.","C1","aussage"],
      ["Nach eingehender Untersuchung stellte sich zur allgemeinen Erleichterung heraus, dass die Beschwerden völlig harmlos waren.","Dopo un esame approfondito, con grande sollievo generale, è emerso che i disturbi erano del tutto innocui.","C1","aussage"],
      ["Ließe sich der Anstieg solcher Beschwerden nicht durch gezielte Aufklärung wirksam eindämmen?","Non si potrebbe contenere efficacemente l'aumento di questi disturbi con una campagna di sensibilizzazione mirata?","C1","frage"],
      ["Wie lässt sich eigentlich erklären, dass so viele Menschen Vorsorgetermine schlichtweg konsequent meiden?","Come si spiega, in fondo, che così tante persone evitino sistematicamente le visite preventive?","C1","frage"],
      ["Wäre es nicht endlich an der Zeit, dem Pflegepersonal deutlich mehr Anerkennung entgegenzubringen?","Non sarebbe finalmente ora di mostrare molto più riconoscimento al personale infermieristico?","C1","frage"],
      ["Inwiefern lässt sich das seelische Wohlbefinden eines Menschen überhaupt objektiv messen?","In che misura si può realmente misurare in modo oggettivo il benessere psichico di una persona?","C1","frage"],
      ["Nachdem sie monatelang unter starker Erschöpfung gelitten hatte, riet man ihr dringend zu einer längeren Auszeit.","Dopo aver sofferto per mesi di una forte spossatezza, le fu vivamente consigliata una pausa più lunga.","C1","nebensatz"],
      ["Der Arzt erklärte ihr, dass eine ausgewogene Ernährung mehr bewirke als jedes teure Nahrungsergänzungsmittel.","Il medico le ha spiegato che un'alimentazione equilibrata fa più effetto di qualsiasi costoso integratore.","C1","nebensatz"],
      ["Obwohl sie den bevorstehenden Eingriff sehr scheute, ließ sie sich schließlich von ihrem Arzt überzeugen.","Sebbene temesse molto l'intervento imminente, alla fine si è lasciata convincere dal suo medico.","C1","nebensatz"],
      ["Während manche Beschwerden von selbst wieder verschwinden, bedürfen andere einer gründlichen fachärztlichen Abklärung.","Mentre alcuni disturbi scompaiono da soli, altri richiedono un accertamento approfondito da parte di uno specialista.","C1","nebensatz"],
      ["Wer stets auf der Suche nach der perfekten Diät ist, verliert womöglich den Blick für das, was seinem Körper tatsächlich guttut.","Chi è sempre alla ricerca della dieta perfetta rischia di perdere di vista ciò che davvero fa bene al proprio corpo.","C2","aussage"],
      ["Der Volksmund behält nicht immer recht, doch dass Lachen der Gesundheit zuträglich ist, hat sich inzwischen sogar wissenschaftlich bestätigt.","Il detto popolare non ha sempre ragione, ma che ridere faccia bene alla salute si è ormai confermato persino scientificamente.","C2","aussage"],
      ["So mancher selbsternannte Wunderheiler verspricht seinen verzweifelten Patienten mehr, als die etablierte Schulmedizin je zu halten vermag.","Non pochi guaritori miracolosi autoproclamati promettono ai loro disperati pazienti più di quanto la medicina tradizionale affermata possa mai mantenere.","C2","aussage"],
      ["Gesundheitliche Beschwerden lassen sich nur selten mit einem einzigen Wundermittel dauerhaft aus der Welt schaffen.","I disturbi di salute raramente si possono eliminare in modo duraturo con un unico rimedio miracoloso.","C2","aussage"],
      ["Wer sich buchstäblich zu Tode fürchtet, stirbt bekanntlich meistens eher an der Angst als an der Krankheit selbst.","Chi si spaventa letteralmente a morte, come si sa, muore per lo più a causa della paura piuttosto che della malattia stessa.","C2","aussage"],
      ["Zwischen echter Genesung und bloßer Unterdrückung der Symptome liegt oft ein schmaler, aber überaus entscheidender Grat.","Tra una vera guarigione e la semplice soppressione dei sintomi corre spesso un confine sottile ma assai decisivo.","C2","aussage"],
      ["Es gehört zu den Ironien des modernen Lebens, dass ausgerechnet der Wohlstand ganz neue Krankheitsbilder hervorbringt.","È una delle ironie della vita moderna che sia proprio il benessere a generare quadri patologici del tutto nuovi.","C2","aussage"],
      ["Manch einer schwört auf Hausmittel, die keiner einzigen Studie standhalten würden, und fährt damit erstaunlich gut.","C'è chi giura sui rimedi della nonna, che non reggerebbero a nessuno studio scientifico, e con essi se la cava sorprendentemente bene.","C2","aussage"],
      ["Die Angst vor der Diagnose treibt manchen Menschen paradoxerweise erst recht in die Arme der Krankheit.","La paura della diagnosi spinge, paradossalmente, alcune persone proprio tra le braccia della malattia stessa.","C2","aussage"],
      ["Wer gesund lebt, hat zwar keine Garantie, doch die Wahrscheinlichkeit spricht in den meisten Fällen eindeutig für ihn.","Chi vive in modo sano non ha garanzie, ma nella maggior parte dei casi la probabilità gioca chiaramente a suo favore.","C2","aussage"],
      ["Der schmale Grat zwischen Fürsorge und Bevormundung zeigt sich nirgends deutlicher als am Krankenbett der eigenen Eltern.","Il confine sottile tra premura e paternalismo non si manifesta mai più chiaramente che al capezzale dei propri genitori.","C2","aussage"],
      ["Manche Krankheiten scheinen geradezu darauf angelegt zu sein, uns unsere eigene Sterblichkeit schonungslos vor Augen zu führen.","Certe malattie sembrano quasi fatte apposta per metterci senza pietà di fronte alla nostra stessa mortalità.","C2","aussage"],
      ["Wer die deutlichen Signale seines Körpers dauerhaft ignoriert, wird früher oder später unweigerlich zur Kasse gebeten.","Chi ignora costantemente i chiari segnali del proprio corpo, prima o poi ne paga inevitabilmente le conseguenze.","C2","aussage"],
      ["Die vielbeschworene Vereinbarkeit von Beruf und Privatleben bleibt für viele nichts als ein schöner Vorsatz, der am Alltag zerschellt.","La tanto decantata conciliazione tra lavoro e vita privata resta per molti solo un buon proposito che si infrange nella quotidianità.","C2","aussage"],
      ["Selten wird einem die Zerbrechlichkeit des eigenen Körpers so deutlich vor Augen geführt wie im Wartezimmer eines Krankenhauses.","Raramente la fragilità del proprio corpo si manifesta con tanta evidenza quanto nella sala d'attesa di un ospedale.","C2","aussage"],
      ["Ist es nicht bezeichnend, dass wir erst im Angesicht der Krankheit wirklich lernen, unsere Gesundheit zu schätzen?","Non è significativo che impariamo davvero ad apprezzare la nostra salute solo di fronte alla malattia?","C2","frage"],
      ["Wie lässt es sich eigentlich rechtfertigen, dass Gesundheit vielerorts zunehmend zur Frage des Geldbeutels geworden ist?","Come si può in fondo giustificare che la salute sia diventata in molti luoghi sempre più una questione di portafoglio?","C2","frage"],
      ["Wäre der Mensch nicht deutlich gesünder, würde er öfter auf sein Bauchgefühl statt auf jeden neuen Trend hören?","L'uomo non sarebbe molto più sano se ascoltasse più spesso il proprio istinto invece di ogni nuova moda?","C2","frage"],
      ["Wer wollte ernsthaft bestreiten, dass ein Übermaß an Fürsorge manchmal ebenso schädlich ist wie deren völliges Fehlen?","Chi vorrebbe seriamente negare che un eccesso di premura è talvolta dannoso quanto la sua totale assenza?","C2","frage"],
      ["Auch wenn die Wissenschaft immer präzisere Diagnosen ermöglicht, bleibt dem Menschen letztlich die Ungewissheit über sein eigenes Schicksal.","Anche se la scienza consente diagnosi sempre più precise, all'uomo resta comunque l'incertezza sul proprio destino.","C2","nebensatz"],
      ["Während der eine Körper und Geist strikt voneinander trennt, geht der andere davon aus, dass beide untrennbar miteinander verwoben sind.","Mentre alcuni separano rigidamente corpo e mente, altri partono dal presupposto che i due siano indissolubilmente intrecciati.","C2","nebensatz"],
      ["Sosehr man sich auch um Prävention bemüht, lässt sich das Schicksal offenbar nicht in jedem Fall austricksen.","Per quanto ci si impegni nella prevenzione, a quanto pare il destino non si può ingannare in ogni caso.","C2","nebensatz"],
      ["Wer glaubt, mit Geld lasse sich jede Krankheit besiegen, hat die Grenzen der Medizin offenkundig noch nicht kennengelernt.","Chi crede che con il denaro si possa sconfiggere ogni malattia, evidentemente non ha ancora conosciuto i limiti della medicina.","C2","nebensatz"],
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
      ["Sobald man einmal die Geduld für den Papierkram verloren hat, fällt es doppelt schwer, sich erneut aufzuraffen.","Una volta persa la pazienza per la burocrazia, diventa doppiamente difficile trovare di nuovo la motivazione.","C2","nebensatz"],
      ["Ich brauche einen Stift.","Ho bisogno di una penna.","A1","aussage"],
      ["Das Formular ist sehr lang.","Il modulo è molto lungo.","A1","aussage"],
      ["Ich stehe in der Schlange.","Sono in fila.","A1","aussage"],
      ["Ich habe meinen Ausweis vergessen.","Ho dimenticato la carta d'identità.","A1","aussage"],
      ["Die Frau am Schalter hilft mir.","La donna allo sportello mi aiuta.","A1","aussage"],
      ["Ich brauche eine neue Steuernummer.","Ho bisogno di un nuovo codice fiscale.","A1","aussage"],
      ["Wir zahlen die Gebühr in bar.","Paghiamo la tassa in contanti.","A1","aussage"],
      ["Ich melde meine neue Adresse an.","Registro il mio nuovo indirizzo.","A1","aussage"],
      ["Das Amt schickt mir einen Brief.","L'ufficio mi manda una lettera.","A1","aussage"],
      ["Ich brauche ein Foto für den Ausweis.","Ho bisogno di una foto per la carta d'identità.","A1","aussage"],
      ["Der Ordner liegt im Schrank.","La cartella è nell'armadio.","A1","aussage"],
      ["Ich lese den Vertrag genau.","Leggo il contratto con attenzione.","A1","aussage"],
      ["Meine Nummer ist die achtzehn.","Il mio numero è il diciotto.","A1","aussage"],
      ["Ich brauche heute noch eine Bestätigung.","Ho bisogno di una conferma già oggi.","A1","aussage"],
      ["Wir warten auf die Antwort vom Amt.","Aspettiamo la risposta dell'ufficio.","A1","aussage"],
      ["Wie heißt du mit Nachnamen?","Come ti chiami di cognome?","A1","frage"],
      ["Hast du den Brief schon gelesen?","Hai già letto la lettera?","A1","frage"],
      ["Wann ist mein Termin?","Quando è il mio appuntamento?","A1","frage"],
      ["Ist das Formular kostenlos?","Il modulo è gratuito?","A1","frage"],
      ["Ich warte, bis ich dran bin.","Aspetto finché non tocca a me.","A1","nebensatz"],
      ["Ich brauche den Ausweis, weil ich ein Konto eröffne.","Ho bisogno della carta d'identità perché apro un conto.","A1","nebensatz"],
      ["Die Frau sagt, dass der Schalter geschlossen ist.","La donna dice che lo sportello è chiuso.","A1","nebensatz"],
      ["Ich gehe zum Amt, wenn ich Zeit habe.","Vado in ufficio quando ho tempo.","A1","nebensatz"],
      ["Ich habe meinen Personalausweis leider verloren.","Purtroppo ho perso la mia carta d'identità.","A2","aussage"],
      ["Ich muss morgen zum Einwohnermeldeamt gehen.","Devo andare domani all'ufficio anagrafe.","A2","aussage"],
      ["Der Sachbearbeiter hat mir alles genau erklärt.","Il funzionario mi ha spiegato tutto con precisione.","A2","aussage"],
      ["Ich habe das Formular gestern online ausgefüllt.","Ieri ho compilato il modulo online.","A2","aussage"],
      ["Wir haben gestern die Kfz-Versicherung abgeschlossen.","Ieri abbiamo stipulato l'assicurazione per l'auto.","A2","aussage"],
      ["Ich habe einen Brief vom Finanzamt bekommen.","Ho ricevuto una lettera dall'ufficio delle imposte.","A2","aussage"],
      ["Ich muss meinen Pass bis Freitag verlängern lassen.","Devo far rinnovare il passaporto entro venerdì.","A2","aussage"],
      ["Der Antrag hat viel länger gedauert als gedacht.","La domanda ha richiesto molto più tempo del previsto.","A2","aussage"],
      ["Ich habe leider vergessen, den Vertrag zu unterschreiben.","Purtroppo ho dimenticato di firmare il contratto.","A2","aussage"],
      ["Wir mussten für die Anmeldung extra einen Tag freinehmen.","Per la registrazione abbiamo dovuto prendere un giorno di ferie apposta.","A2","aussage"],
      ["Ich habe die Rechnung schon vor zwei Wochen bezahlt.","Ho già pagato la fattura due settimane fa.","A2","aussage"],
      ["Meine Kollegin hat mir bei den Papieren geholfen.","La mia collega mi ha aiutato con i documenti.","A2","aussage"],
      ["Ich habe meinen Termin leider verpasst.","Purtroppo ho perso il mio appuntamento.","A2","aussage"],
      ["Wir haben endlich die Genehmigung bekommen.","Abbiamo finalmente ricevuto l'autorizzazione.","A2","aussage"],
      ["Ich habe den Antrag zweimal ausdrucken müssen.","Ho dovuto stampare la domanda due volte.","A2","aussage"],
      ["Musst du den Antrag persönlich abgeben?","Devi consegnare la domanda di persona?","A2","frage"],
      ["Hast du schon eine Nummer gezogen?","Hai già preso un numero?","A2","frage"],
      ["Wann läuft eigentlich dein Ausweis ab?","Quando scade, in realtà, la tua carta d'identità?","A2","frage"],
      ["Kannst du mir bei dem Formular helfen?","Puoi aiutarmi con il modulo?","A2","frage"],
      ["Ich bin früh gekommen, weil ich keine Wartezeit wollte.","Sono venuto presto perché non volevo aspettare.","A2","nebensatz"],
      ["Ich rufe im Amt an, wenn ich Fragen habe.","Chiamo l'ufficio se ho domande.","A2","nebensatz"],
      ["Der Beamte hat gesagt, dass ich noch eine Kopie brauche.","L'impiegato ha detto che mi serve ancora una copia.","A2","nebensatz"],
      ["Ich habe den Termin verschoben, weil ich krank war.","Ho rimandato l'appuntamento perché ero malato.","A2","nebensatz"],
      ["Ich hätte gern eine Bescheinigung über meinen Wohnsitz.","Vorrei un certificato di residenza.","B1","aussage"],
      ["Früher füllte man solche Anträge noch von Hand aus.","Prima si compilavano ancora a mano queste domande.","B1","aussage"],
      ["Ich legte alle Unterlagen ordentlich in eine Mappe.","Ho messo tutti i documenti in ordine in una cartellina.","B1","aussage"],
      ["Könnten Sie mir bitte eine zweite Kopie davon ausstellen?","Potrebbe rilasciarmi per favore una seconda copia di questo?","B1","frage"],
      ["Der Beamte setzte seinen Stempel unter das fertige Dokument.","L'impiegato ha messo il timbro sotto il documento completato.","B1","aussage"],
      ["Ich hänge die wichtigen Unterlagen an die Pinnwand in der Küche.","Appendo i documenti importanti alla bacheca in cucina.","B1","aussage"],
      ["Ich erledigte den Antrag zwischen zwei Terminen, weil ich wenig Zeit hatte.","Ho sbrigato la domanda tra due appuntamenti perché avevo poco tempo.","B1","aussage"],
      ["Damals dauerte die Bearbeitung eines Antrags oft mehrere Monate.","All'epoca l'elaborazione di una domanda durava spesso diversi mesi.","B1","aussage"],
      ["Ich würde gerne wissen, welche Unterlagen mir noch fehlen.","Vorrei sapere quali documenti mi mancano ancora.","B1","aussage"],
      ["Ich legte den Vertrag vor der Unterschrift noch einmal auf den Tisch.","Ho posato di nuovo il contratto sul tavolo prima di firmarlo.","B1","aussage"],
      ["Es wäre freundlich, wenn Sie mir eine kurze Fristverlängerung gewähren könnten.","Sarebbe gentile se potesse concedermi una breve proroga del termine.","B1","aussage"],
      ["Ich stand fast eine Stunde vor dem Schalter, bevor ich endlich drankam.","Sono rimasto in piedi davanti allo sportello quasi un'ora prima che finalmente toccasse a me.","B1","aussage"],
      ["Der Antrag lag wochenlang unbearbeitet auf dem Schreibtisch des Sachbearbeiters.","La domanda è rimasta per settimane senza essere trattata sulla scrivania del funzionario.","B1","aussage"],
      ["Ich schickte die Unterlagen sicherheitshalber sowohl per Post als auch per E-Mail.","Ho inviato i documenti, per sicurezza, sia per posta che per e-mail.","B1","aussage"],
      ["Ich stellte mich geduldig in die Schlange vor dem Amt.","Mi sono messo pazientemente in fila davanti all'ufficio.","B1","aussage"],
      ["Könnten Sie mir erklären, warum mein Antrag abgelehnt wurde?","Potrebbe spiegarmi perché la mia domanda è stata respinta?","B1","frage"],
      ["Wärst du bereit, mir bei diesem Antrag zu helfen?","Saresti disposto ad aiutarmi con questa domanda?","B1","frage"],
      ["Wie lange dauerte deine Anmeldung damals eigentlich?","Quanto è durata, in realtà, la tua registrazione a suo tempo?","B1","frage"],
      ["Hättest du morgen Zeit, mit mir zum Amt zu gehen?","Avresti tempo domani di venire con me in ufficio?","B1","frage"],
      ["Ich weiß nicht, ob dieser Antrag überhaupt noch bearbeitet wird.","Non so se questa domanda venga ancora elaborata.","B1","nebensatz"],
      ["Als ich jung war, kannte ich mich mit solchen Formularen überhaupt nicht aus.","Quando ero giovane non me la cavavo affatto con questi moduli.","B1","nebensatz"],
      ["Nachdem ich den Antrag abgeschickt hatte, wartete ich wochenlang auf eine Antwort.","Dopo aver spedito la domanda, ho aspettato per settimane una risposta.","B1","nebensatz"],
      ["Ich gehe lieber persönlich hin, obwohl es online sicher schneller wäre.","Preferisco andare di persona, anche se online sarebbe di sicuro più veloce.","B1","nebensatz"],
      ["Die Bearbeitung des Antrags wurde aufgrund fehlender Unterlagen erheblich verzögert.","L'elaborazione della domanda è stata notevolmente ritardata per mancanza di documenti.","B2","aussage"],
      ["Trotz mehrfacher Nachfragen erhielt sie vom zuständigen Amt keine zufriedenstellende Antwort.","Nonostante ripetute richieste, non ha ricevuto dall'ufficio competente una risposta soddisfacente.","B2","aussage"],
      ["Die Einführung der elektronischen Akte soll die Verwaltung künftig erheblich beschleunigen.","L'introduzione del fascicolo elettronico dovrebbe velocizzare notevolmente l'amministrazione in futuro.","B2","aussage"],
      ["Der Inhalt des Vertrags wurde von beiden Seiten vor der Unterschrift sorgfältig geprüft.","Il contenuto del contratto è stato esaminato attentamente da entrambe le parti prima della firma.","B2","aussage"],
      ["Allerdings bleibt die genaue Zuständigkeit in solchen Fällen häufig unklar.","Tuttavia la competenza precisa in questi casi resta spesso poco chiara.","B2","aussage"],
      ["Die Verlängerung des Aufenthaltstitels wird derzeit von der zuständigen Ausländerbehörde bearbeitet.","Il rinnovo del permesso di soggiorno è attualmente in lavorazione presso l'ufficio stranieri competente.","B2","aussage"],
      ["Die Höhe der zu zahlenden Gebühr richtet sich nach der Art des jeweiligen Antrags.","L'importo della tassa da pagare dipende dal tipo di domanda in questione.","B2","aussage"],
      ["Dennoch wird von den Bürgern erwartet, sich selbstständig über die geltenden Fristen zu informieren.","Ciononostante ci si aspetta che i cittadini si informino autonomamente sulle scadenze in vigore.","B2","aussage"],
      ["Der Verlust des Ausweises muss der Polizei unverzüglich gemeldet werden.","La perdita della carta d'identità deve essere denunciata immediatamente alla polizia.","B2","aussage"],
      ["Die Vereinfachung der Formulare wird von vielen Bürgern seit Langem eindringlich gefordert.","La semplificazione dei moduli è richiesta con insistenza da tempo da molti cittadini.","B2","aussage"],
      ["Obwohl die Frist eingehalten wurde, meldete sich das zuständige Amt erst Wochen später.","Sebbene il termine fosse stato rispettato, l'ufficio competente si è fatto sentire solo settimane dopo.","B2","aussage"],
      ["Die Zusammenarbeit zwischen den verschiedenen Ämtern lässt in vielen Fällen deutlich zu wünschen übrig.","La collaborazione tra i vari uffici lascia spesso molto a desiderare.","B2","aussage"],
      ["Der Antrag auf Fristverlängerung wurde leider ohne nähere Begründung abgelehnt.","La domanda di proroga è stata purtroppo respinta senza una motivazione precisa.","B2","aussage"],
      ["Die Unterschrift des gesetzlichen Vertreters ist bei minderjährigen Antragstellern zwingend erforderlich.","La firma del rappresentante legale è obbligatoria per i richiedenti minorenni.","B2","aussage"],
      ["Allerdings wird die Digitalisierung der Behörden von vielen älteren Bürgern eher skeptisch betrachtet.","Tuttavia la digitalizzazione degli uffici pubblici viene vista con una certa scetticismo da molti cittadini più anziani.","B2","aussage"],
      ["Könnte die Vereinfachung der Formulare nicht schon längst umgesetzt worden sein?","La semplificazione dei moduli non avrebbe già potuto essere realizzata da tempo?","B2","frage"],
      ["Wird die Zuständigkeit für diesen speziellen Antrag inzwischen endlich geklärt?","La competenza per questa particolare domanda viene ormai finalmente chiarita?","B2","frage"],
      ["Wäre eine einheitliche Regelung für alle Bundesländer nicht durchaus wünschenswert?","Non sarebbe assolutamente auspicabile una normativa unica per tutti i Länder?","B2","frage"],
      ["Wie lässt sich die Verzögerung bei der Bearbeitung eigentlich noch rechtfertigen?","Come si può ancora, in realtà, giustificare il ritardo nell'elaborazione?","B2","frage"],
      ["Obwohl die Digitalisierung der Ämter stetig voranschreitet, bevorzugen viele Bürger weiterhin den persönlichen Kontakt.","Sebbene la digitalizzazione degli uffici avanzi costantemente, molti cittadini preferiscono ancora il contatto personale.","B2","nebensatz"],
      ["Da die Zuständigkeit lange ungeklärt war, wurde der Antrag zwischen zwei Ämtern hin- und hergeschickt.","Poiché la competenza è rimasta a lungo poco chiara, la domanda è stata rimbalzata tra due uffici.","B2","nebensatz"],
      ["Es wird erwartet, dass die Bearbeitungszeiten durch die neue Software deutlich verkürzt werden.","Ci si aspetta che i tempi di elaborazione vengano notevolmente ridotti grazie al nuovo software.","B2","nebensatz"],
      ["Während die einen von der Digitalisierung eindeutig profitieren, fühlen sich andere davon regelrecht überfordert.","Mentre alcuni traggono chiaramente vantaggio dalla digitalizzazione, altri se ne sentono decisamente sopraffatti.","B2","nebensatz"],
      ["Der zuständige Sachbearbeiter erklärte, der Antrag müsse aus rein formalen Gründen erneut eingereicht werden.","Il funzionario competente ha dichiarato che la domanda doveva essere ripresentata per motivi puramente formali.","C1","aussage"],
      ["Von der schieren Menge an Formularen überfordert, gab sie den gesamten Antrag schließlich in fremde Hände.","Sopraffatta dalla mera quantità di moduli, ha finalmente affidato l'intera pratica a qualcun altro.","C1","aussage"],
      ["Es zählt zu den Grundpflichten jedes Bürgers, seinen Wohnsitz fristgerecht bei der Behörde anzumelden.","Registrare la propria residenza presso l'ufficio entro i termini rientra tra i doveri fondamentali di ogni cittadino.","C1","aussage"],
      ["Die zuständige Behörde teilte mit, der endgültige Bescheid sei bereits seit einigen Tagen auf dem Postweg.","L'ufficio competente ha comunicato che la decisione definitiva era già in viaggio per posta da alcuni giorni.","C1","aussage"],
      ["Getrieben von der Angst vor einer Fristversäumnis, reichte er den Antrag gleich mehrere Tage zu früh ein.","Spinto dalla paura di non rispettare la scadenza, ha presentato la domanda con diversi giorni di anticipo.","C1","aussage"],
      ["Ein einmal beiderseitig unterschriebener Vertrag lässt sich nur unter erschwerten Bedingungen wieder rückgängig machen.","Un contratto già firmato da entrambe le parti si può annullare solo a condizioni difficili.","C1","aussage"],
      ["Die Ausländerbehörde bestätigte ihm schriftlich, der Aufenthaltstitel werde fristgerecht um zwei Jahre verlängert.","L'ufficio stranieri gli ha confermato per iscritto che il permesso di soggiorno sarebbe stato rinnovato nei termini per due anni.","C1","aussage"],
      ["Von zahlreichen Formularen förmlich erschlagen, verlor er allmählich den Überblick über seine eigenen Fristen.","Letteralmente sommerso da numerosi moduli, ha gradualmente perso il controllo delle proprie scadenze.","C1","aussage"],
      ["Es empfiehlt sich grundsätzlich, alle wichtigen und schwer wiederzubeschaffenden Unterlagen stets in Kopie aufzubewahren.","In linea di massima è consigliabile conservare sempre in copia tutti i documenti importanti e difficili da recuperare.","C1","aussage"],
      ["Der zuständige Beamte ließ am Ende des Gesprächs durchblicken, eine gütliche Einigung sei durchaus denkbar.","Alla fine del colloquio, l'impiegato competente ha lasciato intendere che un accordo bonario fosse del tutto possibile.","C1","aussage"],
      ["Ihr wurde geraten, sich rechtzeitig anwaltlichen Beistand zu sichern, bevor sie den Vertrag unterzeichnete.","Le fu consigliato di procurarsi per tempo assistenza legale prima di firmare il contratto.","C1","aussage"],
      ["Nach zähem Ringen um jede einzelne Klausel einigten sich beide Parteien schließlich auf einen Kompromiss.","Dopo un'estenuante trattativa su ogni singola clausola, le due parti hanno infine trovato un compromesso.","C1","aussage"],
      ["Die zuständige Behörde räumte nach längerem Zögern ein, der Fehler sei ausschließlich hausgemacht gewesen.","Dopo una lunga esitazione, l'ufficio competente ha ammesso che l'errore era stato interamente causato da loro stessi.","C1","aussage"],
      ["Wer sich im Behördendschungel zurechtfinden will, braucht vor allem viel Geduld und eiserne Beharrlichkeit.","Chi vuole orientarsi nella giungla burocratica ha bisogno soprattutto di molta pazienza e di una tenace perseveranza.","C1","aussage"],
      ["Der Antrag wurde, nachdem er monatelang unbeachtet liegen geblieben war, endlich bearbeitet.","La domanda, dopo essere rimasta ferma e inosservata per mesi, è stata finalmente elaborata.","C1","aussage"],
      ["Woran liegt es eigentlich, dass selbst einfache Behördengänge derart zäh und langwierig verlaufen?","Come mai, in fondo, anche le pratiche amministrative più semplici risultano così faticose e interminabili?","C1","frage"],
      ["Ließe sich der bürokratische Aufwand nicht durch klar formulierte Vorgaben spürbar reduzieren?","Non si potrebbe ridurre sensibilmente il carico burocratico con direttive formulate in modo chiaro?","C1","frage"],
      ["Wäre es nicht endlich an der Zeit, das Vertrauen der Bürger in die Verwaltung grundlegend wiederherzustellen?","Non sarebbe finalmente ora di ristabilire radicalmente la fiducia dei cittadini nell'amministrazione pubblica?","C1","frage"],
      ["Inwiefern lässt sich ein derart schwerfälliges und veraltetes System eigentlich noch rechtfertigen?","In che misura si può ancora giustificare, in fondo, un sistema così farraginoso e antiquato?","C1","frage"],
      ["Nachdem der Antrag mehrfach ohne Erklärung zurückgeschickt worden war, wandte sie sich schließlich an einen Anwalt.","Dopo che la domanda era stata rispedita più volte senza spiegazioni, alla fine si è rivolta a un avvocato.","C1","nebensatz"],
      ["Es wird vermutet, dass zahlreiche Anträge allein an einer fehlenden Unterschrift scheitern.","Si presume che numerose domande falliscano soltanto per una firma mancante.","C1","nebensatz"],
      ["Obwohl die Frist äußerst knapp bemessen war, gelang es ihm, alle Unterlagen rechtzeitig einzureichen.","Sebbene il termine fosse estremamente stretto, è riuscito a presentare tutti i documenti in tempo.","C1","nebensatz"],
      ["Während die Behörde stets auf Vollständigkeit besteht, fehlt den Bürgern oft schlicht die Übersicht über die Vorgaben.","Mentre l'ufficio insiste sempre sulla completezza, ai cittadini manca spesso semplicemente una visione chiara delle disposizioni.","C1","nebensatz"],
      ["Wer einmal im Räderwerk der Bürokratie gefangen ist, tut gut daran, sich mit Geduld gegen die Mühlen der Verwaltung zu wappnen.","Chi resta impigliato negli ingranaggi della burocrazia farebbe bene ad armarsi di pazienza contro i mulini dell'amministrazione.","C2","aussage"],
      ["Dass ausgerechnet die Digitalisierung, die alles vereinfachen sollte, ständig neue Formulare hervorbringt, gehört zu den kleinen Ironien unserer Zeit.","Che sia proprio la digitalizzazione, destinata a semplificare tutto, a generare continuamente nuovi moduli, è una delle piccole ironie del nostro tempo.","C2","aussage"],
      ["Manch ein behördlicher Bescheid liest sich, als hätte ihn jemand ganz bewusst möglichst unverständlich formuliert.","Certe decisioni amministrative sembrano scritte come se qualcuno le avesse formulate di proposito nel modo più incomprensibile possibile.","C2","aussage"],
      ["Wer glaubt, mit gesundem Menschenverstand käme man durch jedes Amtsgebäude, hat die Tücken der Bürokratie offenkundig gründlich unterschätzt.","Chi crede che il buon senso basti per cavarsela in ogni ufficio pubblico ha evidentemente sottovalutato di gran lunga le insidie della burocrazia.","C2","aussage"],
      ["Zwischen dem Anspruch auf Rechtssicherheit und der gelebten Willkür mancher Sachbearbeiter tut sich mitunter ein beträchtlicher Graben auf.","Tra l'aspirazione alla certezza del diritto e l'arbitrio praticato da certi funzionari si apre talvolta un notevole divario.","C2","aussage"],
      ["Der Aktenberg auf dem Schreibtisch wächst bekanntlich stets schneller, als ihn irgendjemand jemals abarbeiten könnte.","La pila di pratiche sulla scrivania, come è noto, cresce sempre più in fretta di quanto chiunque riuscirebbe mai a smaltirla.","C2","aussage"],
      ["Es gibt kaum etwas, das die Geduld eines Menschen so zuverlässig auf die Probe stellt wie ein Behördengang ohne vorherigen Termin.","Non c'è quasi nulla che metta alla prova la pazienza di una persona con tanta certezza quanto una pratica amministrativa senza appuntamento fissato prima.","C2","aussage"],
      ["Wer den Papierkram gründlich unterschätzt, wird über kurz oder lang unweigerlich eines Besseren belehrt.","Chi sottovaluta profondamente la burocrazia viene prima o poi inevitabilmente smentito dai fatti.","C2","aussage"],
      ["Der schmale Grat zwischen notwendiger Kontrolle und lähmender Überregulierung wird selten so deutlich wie im tristen Verwaltungsalltag.","Il confine sottile tra controllo necessario e sovraregolamentazione paralizzante raramente è così evidente come nella triste quotidianità amministrativa.","C2","aussage"],
      ["So mancher Antrag verschwindet spurlos, als hätte ihn ein regelrechtes Bermudadreieck der Behörden verschluckt.","Certe domande spariscono senza lasciare traccia, come inghiottite da un vero e proprio triangolo delle Bermuda della burocrazia.","C2","aussage"],
      ["Dass ein einziges fehlendes Kreuzchen einen ganzen sorgfältig vorbereiteten Antrag zu Fall bringen kann, grenzt schon an Absurdität.","Che una sola crocetta mancante possa far naufragare un'intera domanda preparata con cura rasenta ormai l'assurdo.","C2","aussage"],
      ["Wer vom Amt Geduld einfordert, sollte selbst reichlich davon mitbringen, sonst geht das Vorhaben meist schief.","Chi pretende pazienza dall'ufficio dovrebbe portarne con sé in abbondanza, altrimenti l'impresa va di solito storta.","C2","aussage"],
      ["Am Ende erweist sich Hartnäckigkeit im Umgang mit Behörden fast immer als die klügere Strategie im Vergleich zu blindem Gehorsam.","Alla fine, nei rapporti con la burocrazia, la tenacia si rivela quasi sempre una strategia più intelligente rispetto alla cieca obbedienza.","C2","aussage"],
      ["Zwischen dem Versprechen der schlanken Verwaltung und ihrer trägen alltäglichen Wirklichkeit liegen bekanntlich ganze Welten.","Tra la promessa di un'amministrazione snella e la sua pigra realtà quotidiana corrono, come noto, mondi interi.","C2","aussage"],
      ["Wer sich unbeschadet durch den zermürbenden Papierkrieg kämpft, darf sich zu Recht als kleiner Held des Alltags fühlen.","Chi si fa strada illeso attraverso l'estenuante guerra della carta può a ragione sentirsi un piccolo eroe quotidiano.","C2","aussage"],
      ["Ist es nicht bezeichnend, dass ausgerechnet die Verwaltung, die für Ordnung sorgen soll, selbst im Chaos versinkt?","Non è emblematico che sia proprio l'amministrazione, chiamata a garantire l'ordine, ad affondare nel caos?","C2","frage"],
      ["Wie viele kostbare Lebensjahre gehen der Menschheit wohl insgesamt durch das Ausfüllen überflüssiger Formulare verloren?","Quanti preziosi anni di vita, in totale, si perdono per l'umanità a causa della compilazione di moduli superflui?","C2","frage"],
      ["Wäre es nicht endlich an der Zeit, den sprichwörtlichen Amtsschimmel ein für alle Mal in Rente zu schicken?","Non sarebbe finalmente ora di mandare una volta per tutte in pensione la proverbiale burocrazia ottusa?","C2","frage"],
      ["Wer wollte ernsthaft bestreiten, dass so mancher Bescheid am Ende mehr Fragen aufwirft, als er tatsächlich beantwortet?","Chi vorrebbe seriamente negare che certe decisioni amministrative sollevano alla fine più domande di quante ne risolvano davvero?","C2","frage"],
      ["Auch wenn die Verwaltung offiziell auf Bürgernähe pocht, erlebt so mancher Antragsteller in der Praxis das genaue Gegenteil.","Anche se l'amministrazione insiste ufficialmente sulla vicinanza ai cittadini, molti richiedenti sperimentano nella pratica l'esatto contrario.","C2","nebensatz"],
      ["Während die einen jede Behördenpost mit stoischer Gelassenheit öffnen, gerät der andere schon beim bloßen Anblick des Briefumschlags in Panik.","Mentre alcuni aprono ogni lettera dell'ufficio con stoica calma, altri vanno nel panico già alla semplice vista della busta.","C2","nebensatz"],
      ["Wer einmal erlebt hat, wie ein einziges fehlendes Formular einen ganzen sorgsam geplanten Plan zunichtemacht, verliert den Glauben an reibungslose Bürokratie für immer.","Chi ha già vissuto come un solo modulo mancante possa mandare in fumo un piano pianificato con cura, perde per sempre la fede in una burocrazia senza intoppi.","C2","nebensatz"],
      ["Sosehr man sich auch um Verständnis für die Behörden bemüht, bleibt am Ende doch häufig nur die blanke Verzweiflung.","Per quanto ci si sforzi di comprendere la burocrazia, alla fine spesso resta soltanto la pura disperazione.","C2","nebensatz"],
    ]
  };  function beispieleFuer(kategorie, level, art) {
    const liste = BEISPIELE[kategorie] || [];
    return liste
      .filter((b) => (!level || b[2] === level) && (!art || b[3] === art))
      .map((b) => ({ de: b[0], it: b[1], level: b[2], art: b[3] }));
  }
  function beispielAnzahl(kategorie) {
    return (BEISPIELE[kategorie] || []).length;
  }

  window.Satzbau = {
    ORTE, DINGE, PERSONEN, SUBJEKTE, VERBEN, ZEITEN, ARTEN, GRUENDE, ADJEKTIVE, KATEGORIEN,
    BEGLEITER_NAMEN, BEISPIELE,
    bauSatz, ortsform, itOrtsform, nominalgruppe, verschmelze, itDingform, itAdjektiv, itAdjektivDavor, grundText,
    verbenFuer, orteFuer, dingeFuer, personenFuer, zeitenFuer, artenFuer, gruendeFuer,
    adjektiveFuer, begleiterFuer, ortRollenFuer, anzahlBeispiele, beispieleFuer, beispielAnzahl,
    WECHSEL, NUR_DATIV, NUR_AKKUSATIV, NUR_GENITIV,
  };
})();
