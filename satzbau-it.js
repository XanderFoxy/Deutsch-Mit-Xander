/* =====================================================================
   SATZBAU ITALIENISCH — ein eigener Satzbaukasten nach italienischer
   Grammatik (FASSUNG 839)
   ---------------------------------------------------------------------
   FASSUNG 839 — XANDER (Funk 225, wörtlich): „Mache mir auch den
   italienisch satzbaukasten für den italienischen Kurs … dort möchte
   ich … einen funktionierenden satzbaukasten auf der Basis der
   italienischen originalen Grammatik haben … mit genauso vielen
   sinnvollen gebräuchlichen italienischen alltagsbeispielen … keine
   Quatschsätze achte ganz explizit darauf dass er niemals Unsinn
   rausgehen kann und dass das gesperrt wird wenn es Unsinn wird bzw
   dass der Hinweis kommt dass … der Satz so wie er jetzt gebaut ist
   eher komisch ist und dass dann eher Vorschläge kommen was man sagen
   will und man dann geführt wird … 100% idiotensicher und bulletproof
   … genauso beim italienischen weil hier kann ich es nicht
   kontrollieren ich spreche die italienische Sprache nicht … darf
   niemals irgendetwas falsches dabei rauskommen … das wie und mit wem
   und warum soll alles in alle Richtungen funktionieren“

   Was anders ist als früher
   ---------------------------------------------------------------------
   Bisher hing im Italienisch-Kurs unter jedem DEUTSCHEN Baukastensatz
   eine Übersetzung. Hier wird der Satz ITALIENISCH gebaut, mit den
   Regeln des Italienischen:

     · Artikel nach dem Wort, das direkt folgt: il/lo/l'/la/i/gli/le,
       un/uno/una/un' — „lo zaino“, aber „il nuovo zaino“.
     · Präposition + Artikel verschmelzen: al, allo, all', alla, ai,
       agli, alle — dal, nel, sul, del …
     · Adjektive stehen meist hinter dem Nomen und richten sich nach
       Geschlecht und Zahl; buono/bello verkürzen sich davor.
     · Das Subjekt-Pronomen fällt normalerweise weg (das Verb zeigt die
       Person schon), im congiuntivo wird es gesagt.
     · Zeiten je Niveau: presente, passato prossimo (essere/avere, mit
       Angleichung des Partizips bei essere), imperfetto, futuro
       semplice, condizionale, congiuntivo nach Auslösern, periodo
       ipotetico.
     · Reflexive Verben, Modalverben + Infinitiv, Verneinung mit non,
       Fragen, Nebensätze (perché, quando, se, che) und zwei Sätze mit
       e, ma, poi, o, quindi.

   Darunter steht die deutsche Bedeutung — eigens gebaut, mit deutscher
   Wortstellung (Verb an zweiter Stelle, Satzklammer, Verb am Ende im
   Nebensatz).

   Kein Unsinn
   ---------------------------------------------------------------------
   Jede Ergänzung gehört zu einer Liste, die beim Verb steht: nach der
   Wahl des Verbs werden nur passende Dinge, Orte, Personen, Zeiten,
   Gründe angeboten („geführtes Bauen“). Passt eine frühere Wahl nach
   einer Änderung nicht mehr, sagt pruefe() genau, was sich beißt, und
   vorschlaege() liefert zwei bis drei sinnvolle Sätze, die man
   stattdessen meinen könnte. Der Satz selbst wird dann nicht gezeigt.

   Die Datei wird nur im Italienisch-Raum nachgeladen; im Deutsch-Raum
   kommt kein italienisches Wort davon auf die Seite.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     1. ITALIENISCHE FORMENLEHRE
     =================================================================== */

  /* Person 0..5: io, tu, lui/lei, noi, voi, loro */
  const PRES_END = {
    are: ["o", "i", "a", "iamo", "ate", "ano"],
    ere: ["o", "i", "e", "iamo", "ete", "ono"],
    ire: ["o", "i", "e", "iamo", "ite", "ono"],
    isc: ["isco", "isci", "isce", "iamo", "ite", "iscono"],
  };
  const IMP_END = ["vo", "vi", "va", "vamo", "vate", "vano"];
  const FUT_END = ["ò", "ai", "à", "emo", "ete", "anno"];
  const COND_END = ["ei", "esti", "ebbe", "emmo", "este", "ebbero"];
  const CONG_END = {
    are: ["i", "i", "i", "iamo", "iate", "ino"],
    ere: ["a", "a", "a", "iamo", "iate", "ano"],
    ire: ["a", "a", "a", "iamo", "iate", "ano"],
    isc: ["isca", "isca", "isca", "iamo", "iate", "iscano"],
  };
  const CONG_IMP_END = ["ssi", "ssi", "sse", "ssimo", "ste", "ssero"];
  const RIFL = ["mi", "ti", "si", "ci", "vi", "si"];

  function klasse(v) {
    if (v.isc) return "isc";
    const e = v.inf.slice(-3);
    return e === "are" ? "are" : e === "ere" ? "ere" : "ire";
  }
  function stamm(v) { return v.inf.slice(0, -3); }

  /* Endung an einen Stamm hängen, mit den Schreibregeln:
       cerc + i → cerchi (das h hält den harten Klang)
       mangi + i → mangi, mangi + iamo → mangiamo (kein doppeltes i)
     Verben mit betontem i (inviare → invii) gibt es hier bewusst nicht. */
  function haenge(st, end, kl) {
    if (kl === "are" && /[cg]$/.test(st) && /^[ie]/.test(end)) return st + "h" + end;
    if (/i$/.test(st) && /^i/.test(end)) return st + end.slice(1);
    return st + end;
  }

  function praesens(v, p) {
    if (v.pres) return v.pres[p];
    const kl = klasse(v);
    return haenge(stamm(v), PRES_END[kl][p], kl === "isc" ? "ire" : kl);
  }
  function imperfetto(v, p) {
    if (v.inf === "essere") return ["ero", "eri", "era", "eravamo", "eravate", "erano"][p];
    const st = v.impStamm || v.inf.slice(0, -2);        // parla-, legge-, dormi-
    return st + IMP_END[p];
  }
  function futurStamm(v) {
    if (v.fut) return v.fut;
    const kl = klasse(v), st = stamm(v);
    if (kl === "are") {
      if (/[cg]$/.test(st)) return st + "her";          // cercherò, pagherò
      if (/[cg]i$/.test(st)) return st.slice(0, -1) + "er"; // mangerò, comincerò
      return st + "er";
    }
    if (kl === "ere") return st + "er";
    return st + "ir";
  }
  function futuro(v, p) { return futurStamm(v) + FUT_END[p]; }
  function condizionale(v, p) { return futurStamm(v) + COND_END[p]; }
  function congiuntivo(v, p) {
    if (v.cong) return v.cong[p];
    const kl = klasse(v);
    return haenge(stamm(v), CONG_END[kl][p], kl === "isc" ? "ire" : kl);
  }
  function congImperfetto(v, p) {
    const st = v.congImpStamm || v.inf.slice(0, -2);   // parla-, legge-, dormi-
    return st + CONG_IMP_END[p];
  }
  function partizip(v) {
    if (v.part) return v.part;
    const kl = klasse(v);
    return stamm(v) + (kl === "are" ? "ato" : kl === "ere" ? "uto" : "ito");
  }
  /* Angleichung des Partizips (nur bei essere): andato/andata/andati/andate */
  function partizipForm(v, genus, plural) {
    const p = partizip(v);
    if (!/o$/.test(p)) return p;
    return p.slice(0, -1) + (plural ? (genus === "f" ? "e" : "i") : (genus === "f" ? "a" : "o"));
  }
  function hilfsverb(v) { return v.rifl ? "essere" : (v.aux || "avere"); }

  const ESSERE = { inf: "essere", pres: ["sono", "sei", "è", "siamo", "siete", "sono"], fut: "sar",
    cong: ["sia", "sia", "sia", "siamo", "siate", "siano"], congImpStamm: "fo", part: "stato", aux: "essere" };
  const AVERE = { inf: "avere", pres: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"], fut: "avr",
    cong: ["abbia", "abbia", "abbia", "abbiamo", "abbiate", "abbiano"], part: "avuto", aux: "avere" };
  /* „fossi“ = fo + ssi */

  /* Eine einfache Zeitform eines Verbs */
  function einfach(v, zeit, p) {
    switch (zeit) {
      case "presente": return praesens(v, p);
      case "imperfetto": return imperfetto(v, p);
      case "futuro": return futuro(v, p);
      case "condizionale": return condizionale(v, p);
      case "congiuntivo": return congiuntivo(v, p);
      case "congImperfetto": return congImperfetto(v, p);
      default: return praesens(v, p);
    }
  }
  /* Zusammengesetzte Zeiten: Hilfsverb in der Zeit + Partizip */
  const ZUSAMMEN = {
    passato: "presente", trapassato: "imperfetto", condPassato: "condizionale",
    congPassato: "congiuntivo", congTrapassato: "congImperfetto",
  };
  function istZusammengesetzt(zeit) { return Boolean(ZUSAMMEN[zeit]); }
  function hilfsForm(aux, zeit, p) {
    return einfach(aux === "essere" ? ESSERE : AVERE, ZUSAMMEN[zeit], p);
  }

  /* --- Artikel -------------------------------------------------------
     Der Artikel richtet sich nach dem WORT, das direkt folgt. */
  function vokal(w) { return /^[aeiouàèéìòù]/i.test(w || ""); }
  /* s + Konsonant, z, gn, ps, pn, x, y */
  function sImpuro(w) { return /^(s[^aeiouàèéìòù]|z|gn|ps|pn|x|y)/i.test(w || ""); }

  function artikel(typ, genus, plural, folgt) {
    const v = vokal(folgt), s = sImpuro(folgt);
    if (typ === "def") {
      if (plural) return genus === "f" ? "le " : (v || s ? "gli " : "i ");
      if (genus === "f") return v ? "l'" : "la ";
      return v ? "l'" : (s ? "lo " : "il ");
    }
    if (typ === "indef") {
      if (genus === "f") return v ? "un'" : "una ";
      return s ? "uno " : "un ";
    }
    if (typ === "part") {                   // Teilungsartikel del/dello/della/dell'/dei/degli/delle
      const a = artikel("def", genus, plural, folgt);
      return verschmelze("di", a);
    }
    return "";
  }

  const VERSCHMELZUNG = {
    di: { "il ": "del ", "lo ": "dello ", "la ": "della ", "l'": "dell'", "i ": "dei ", "gli ": "degli ", "le ": "delle " },
    a: { "il ": "al ", "lo ": "allo ", "la ": "alla ", "l'": "all'", "i ": "ai ", "gli ": "agli ", "le ": "alle " },
    da: { "il ": "dal ", "lo ": "dallo ", "la ": "dalla ", "l'": "dall'", "i ": "dai ", "gli ": "dagli ", "le ": "dalle " },
    in: { "il ": "nel ", "lo ": "nello ", "la ": "nella ", "l'": "nell'", "i ": "nei ", "gli ": "negli ", "le ": "nelle " },
    su: { "il ": "sul ", "lo ": "sullo ", "la ": "sulla ", "l'": "sull'", "i ": "sui ", "gli ": "sugli ", "le ": "sulle " },
  };
  /* Präposition + fertiger Ausdruck: „a“ + „il mio amico“ → „al mio amico“ */
  function verschmelze(praep, ausdruck) {
    if (!praep) return ausdruck;
    const t = VERSCHMELZUNG[praep];
    if (t) {
      for (const a of ["il ", "lo ", "la ", "l'", "i ", "gli ", "le "]) {
        if (ausdruck.indexOf(a) === 0) return t[a] + ausdruck.slice(a.length);
      }
    }
    return praep + " " + ausdruck;
  }

  /* --- Adjektive ----------------------------------------------------- */
  function adjForm(adj, genus, plural) {
    const s = adj.it;
    if (adj.fest) return s;
    if (/e$/.test(s)) return plural ? s.slice(0, -1) + "i" : s;      // grande, interessante
    const st = s.slice(0, -1);
    if (!plural) return st + (genus === "f" ? "a" : "o");
    if (genus === "f") return (/[cg]$/.test(st) ? st + "h" : st) + "e";   // bianche, lunghe
    if (adj.plM) return adj.plM;                                        // z. B. vecchi
    if (/i$/.test(st)) return st;                                        // vecchio → vecchi
    return (/[cg]$/.test(st) && !adj.weichPl ? st + "h" : st) + "i";   // bianchi, lunghi
  }
  /* Vor dem Nomen verkürzen sich buono und bello */
  function adjVorForm(adj, genus, plural, folgt) {
    const v = vokal(folgt), s = sImpuro(folgt);
    if (adj.it === "buono" && !plural) {
      if (genus === "f") return "buona";
      return s ? "buono" : "buon";
    }
    if (adj.it === "bello") {
      if (plural) return genus === "f" ? "belle" : (v || s ? "begli" : "bei");
      if (genus === "f") return "bella";
      return v ? "bell'" : (s ? "bello" : "bel");
    }
    return adjForm(adj, genus, plural);
  }
  function wortKette(teile) {
    // „bell'“ und „l'“ kleben am nächsten Wort
    let s = "";
    teile.forEach((t) => { if (!t) return; s += (s && !/'$/.test(s) ? " " : "") + t; });
    return s;
  }

  /* Nominalgruppe: det = def | indef | part | ohne | poss
     poss: Possessiv des Subjekts (il mio libro …) */
  const POSSESSIV = [
    { m: "mio", f: "mia", mp: "miei", fp: "mie" },
    { m: "tuo", f: "tua", mp: "tuoi", fp: "tue" },
    { m: "suo", f: "sua", mp: "suoi", fp: "sue" },
    { m: "nostro", f: "nostra", mp: "nostri", fp: "nostre" },
    { m: "vostro", f: "vostra", mp: "vostri", fp: "vostre" },
    { m: "loro", f: "loro", mp: "loro", fp: "loro" },
  ];
  function possWort(p, genus, plural) {
    const t = POSSESSIV[p];
    return plural ? (genus === "f" ? t.fp : t.mp) : (genus === "f" ? t.f : t.m);
  }
  function nominal(n, det, adj, p) {
    const genus = n.g, pl = Boolean(n.pl);
    const nomen = n.it;
    let vor = "", nach = "";
    if (adj) {
      if (adj.davor) vor = adjVorForm(adj, genus, pl, nomen);
      else nach = adjForm(adj, genus, pl);
    }
    const kern = wortKette([vor, nomen, nach]);
    const erstes = vor || nomen;
    if (det === "ohne") return kern;
    if (det === "poss") {
      const pw = possWort(p, genus, pl);
      /* Verwandte in der Einzahl ohne Artikel („mia madre“), außer mit
         „loro“ und außer, wenn ein Adjektiv dabeisteht. */
      if (n.fam && !pl && p !== 5 && !adj) return pw + " " + kern;
      return artikel("def", genus, pl, pw) + pw + " " + kern;
    }
    if (det === "indef" && pl) return artikel("part", genus, pl, erstes) + kern;
    return artikel(det, genus, pl, erstes) + kern;
  }

  /* ===================================================================
     2. DEUTSCHE FORMENLEHRE FÜR DIE BEDEUTUNGSZEILE
     =================================================================== */
  /* Verben knapp: [Infinitiv, Präsens (6), Präteritum (w:/s:), Partizip,
     Hilfsverb h/s, abtrennbarer Teil, reflexiv a/d]. Ein abtrennbarer
     Teil mit Leerzeichen am Ende („spazieren “) wird nie zusammengeschrieben. */
  function praetReihe(spec) {
    const [art, b] = String(spec).split(":");
    if (art === "w") return [b, b + "st", b, b + "n", b + "t", b + "n"];
    const zischt = /(s|ß|z|x|sch)$/.test(b), dental = /[dt]$/.test(b);
    return [b, b + (zischt || dental ? "est" : "st"), b, b + "en", b + (dental ? "et" : "t"), b + "en"];
  }
  function deVerb(spec) {
    const [inf, praes, praet, part, hilf, pref, refl] = spec;
    return { inf, praes: praes.split(","), praet: praetReihe(praet), part, hilf: hilf === "s" ? "sein" : "haben",
      pref: pref || "", refl: refl || "" };
  }
  const DE_SEIN = deVerb(["sein", "bin,bist,ist,sind,seid,sind", "s:war", "gewesen", "s"]);
  const DE_HABEN = deVerb(["haben", "habe,hast,hat,haben,habt,haben", "w:hatte", "gehabt", "h"]);
  const DE_WERDEN = ["werde", "wirst", "wird", "werden", "werdet", "werden"];
  const DE_WUERDE = ["würde", "würdest", "würde", "würden", "würdet", "würden"];
  const DE_K2 = {
    sein: ["wäre", "wärst", "wäre", "wären", "wärt", "wären"],
    haben: ["hätte", "hättest", "hätte", "hätten", "hättet", "hätten"],
  };
  const DE_REFL = {
    a: ["mich", "dich", "sich", "uns", "euch", "sich"],
    d: ["mir", "dir", "sich", "uns", "euch", "sich"],
  };
  /* Deutsche Nominalgruppe (nutzt dieselben Endungen wie satzbau.js) */
  const DE_ART = {
    def: { nom: { m: "der", f: "die", n: "das", pl: "die" }, akk: { m: "den", f: "die", n: "das", pl: "die" }, dat: { m: "dem", f: "der", n: "dem", pl: "den" } },
    indef: { nom: { m: "ein", f: "eine", n: "ein" }, akk: { m: "einen", f: "eine", n: "ein" }, dat: { m: "einem", f: "einer", n: "einem" } },
  };
  const DE_POSS_END = { nom: { m: "", f: "e", n: "", pl: "e" }, akk: { m: "en", f: "e", n: "", pl: "e" }, dat: { m: "em", f: "er", n: "em", pl: "en" } };
  const DE_ADJ = {
    schwach: { nom: { m: "e", f: "e", n: "e", pl: "en" }, akk: { m: "en", f: "e", n: "e", pl: "en" }, dat: { m: "en", f: "en", n: "en", pl: "en" } },
    gemischt: { nom: { m: "er", f: "e", n: "es", pl: "en" }, akk: { m: "en", f: "e", n: "es", pl: "en" }, dat: { m: "en", f: "en", n: "en", pl: "en" } },
    stark: { nom: { m: "er", f: "e", n: "es", pl: "e" }, akk: { m: "en", f: "e", n: "es", pl: "e" }, dat: { m: "em", f: "er", n: "em", pl: "en" } },
  };
  const DE_POSS_STAMM = ["mein", "dein", "sein", "unser", "euer", "ihr"];
  function deNomen(n, fall) {
    const g = n.pl ? "pl" : n.g;
    let w = n.n;
    if (n.schwach && fall !== "nom" && !n.pl) w = w + (/e$/.test(w) ? "n" : "en");
    if (g === "pl" && fall === "dat" && !/[ns]$/.test(w)) w += "n";
    return w;
  }
  /* det: def | indef | ohne | kein | poss ; possStamm: mein/dein/sein/ihr … */
  function deNominal(n, fall, det, adjStamm, possStamm) {
    const g = n.pl ? "pl" : n.g;
    const nomen = deNomen(n, fall);
    const a = (typ) => adjStamm ? adjStamm + DE_ADJ[typ][fall][g] + " " : "";
    if (n.name) return nomen;
    if (det === "ohne" || (det === "indef" && g === "pl")) return a("stark") + nomen;
    if (det === "def") return DE_ART.def[fall][g] + " " + a("schwach") + nomen;
    if (det === "indef") return DE_ART.indef[fall][g] + " " + a("gemischt") + nomen;
    let st = det === "kein" ? "kein" : possStamm;
    const end = DE_POSS_END[fall][g];
    if (st === "euer" && end) st = "eur";
    return st + end + " " + a("gemischt") + nomen;
  }
  function gross(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* Die deutschen Verben der Bedeutungszeile. Präteritum und Partizip
     nach Duden (dieselben Formen wie satzbau.js; pruefe-839 vergleicht). */
  const DE_VERBEN = {
    gehen: ["gehen", "gehe,gehst,geht,gehen,geht,gehen", "s:ging", "gegangen", "s"],
    fahren: ["fahren", "fahre,fährst,fährt,fahren,fahrt,fahren", "s:fuhr", "gefahren", "s"],
    fliegen: ["fliegen", "fliege,fliegst,fliegt,fliegen,fliegt,fliegen", "s:flog", "geflogen", "s"],
    kommen: ["kommen", "komme,kommst,kommt,kommen,kommt,kommen", "s:kam", "gekommen", "s"],
    zurueckkommen: ["zurückkommen", "komme,kommst,kommt,kommen,kommt,kommen", "s:kam", "zurückgekommen", "s", "zurück"],
    zurueckgehen: ["zurückgehen", "gehe,gehst,geht,gehen,geht,gehen", "s:ging", "zurückgegangen", "s", "zurück"],
    zurueckfahren: ["zurückfahren", "fahre,fährst,fährt,fahren,fahrt,fahren", "s:fuhr", "zurückgefahren", "s", "zurück"],
    zurueckfliegen: ["zurückfliegen", "fliege,fliegst,fliegt,fliegen,fliegt,fliegen", "s:flog", "zurückgeflogen", "s", "zurück"],
    ausgehen: ["ausgehen", "gehe,gehst,geht,gehen,geht,gehen", "s:ging", "ausgegangen", "s", "aus"],
    abreisen: ["abreisen", "reise,reist,reist,reisen,reist,reisen", "w:reiste", "abgereist", "s", "ab"],
    ankommen: ["ankommen", "komme,kommst,kommt,kommen,kommt,kommen", "s:kam", "angekommen", "s", "an"],
    bleiben: ["bleiben", "bleibe,bleibst,bleibt,bleiben,bleibt,bleiben", "s:blieb", "geblieben", "s"],
    wohnen: ["wohnen", "wohne,wohnst,wohnt,wohnen,wohnt,wohnen", "w:wohnte", "gewohnt", "h"],
    reisen: ["reisen", "reise,reist,reist,reisen,reist,reisen", "w:reiste", "gereist", "s"],
    spazierengehen: ["spazieren gehen", "gehe,gehst,geht,gehen,geht,gehen", "s:ging", "spazieren gegangen", "s", "spazieren "],
    aufstehen: ["aufstehen", "stehe,stehst,steht,stehen,steht,stehen", "s:stand", "aufgestanden", "s", "auf"],
    aufwachen: ["aufwachen", "wache,wachst,wacht,wachen,wacht,wachen", "w:wachte", "aufgewacht", "s", "auf"],
    waschen_sich: ["waschen", "wasche,wäschst,wäscht,waschen,wascht,waschen", "s:wusch", "gewaschen", "h", "", "a"],
    waschen_sich_d: ["waschen", "wasche,wäschst,wäscht,waschen,wascht,waschen", "s:wusch", "gewaschen", "h", "", "d"],
    putzen_sich_d: ["putzen", "putze,putzt,putzt,putzen,putzt,putzen", "w:putzte", "geputzt", "h", "", "d"],
    anziehen_sich: ["anziehen", "ziehe,ziehst,zieht,ziehen,zieht,ziehen", "s:zog", "angezogen", "h", "an", "a"],
    ausruhen_sich: ["ausruhen", "ruhe,ruhst,ruht,ruhen,ruht,ruhen", "w:ruhte", "ausgeruht", "h", "aus", "a"],
    einschlafen: ["einschlafen", "schlafe,schläfst,schläft,schlafen,schlaft,schlafen", "s:schlief", "eingeschlafen", "s", "ein"],
    amuesieren_sich: ["amüsieren", "amüsiere,amüsierst,amüsiert,amüsieren,amüsiert,amüsieren", "w:amüsierte", "amüsiert", "h", "", "a"],
    vorbereiten_sich: ["vorbereiten", "bereite,bereitest,bereitet,bereiten,bereitet,bereiten", "w:bereitete", "vorbereitet", "h", "vor", "a"],
    setzen_sich: ["setzen", "setze,setzt,setzt,setzen,setzt,setzen", "w:setzte", "gesetzt", "h", "", "a"],
    langweilen_sich: ["langweilen", "langweile,langweilst,langweilt,langweilen,langweilt,langweilen", "w:langweilte", "gelangweilt", "h", "", "a"],
    umziehen: ["umziehen", "ziehe,ziehst,zieht,ziehen,zieht,ziehen", "s:zog", "umgezogen", "s", "um"],
    fuehlen_sich: ["fühlen", "fühle,fühlst,fühlt,fühlen,fühlt,fühlen", "w:fühlte", "gefühlt", "h", "", "a"],
    essen: ["essen", "esse,isst,isst,essen,esst,essen", "s:aß", "gegessen", "h"],
    trinken: ["trinken", "trinke,trinkst,trinkt,trinken,trinkt,trinken", "s:trank", "getrunken", "h"],
    kochen: ["kochen", "koche,kochst,kocht,kochen,kocht,kochen", "w:kochte", "gekocht", "h"],
    zubereiten: ["zubereiten", "bereite,bereitest,bereitet,bereiten,bereitet,bereiten", "w:bereitete", "zubereitet", "h", "zu"],
    machen: ["machen", "mache,machst,macht,machen,macht,machen", "w:machte", "gemacht", "h"],
    fertigmachen: ["fertig machen", "mache,machst,macht,machen,macht,machen", "w:machte", "fertig gemacht", "h", "fertig "],
    bestellen: ["bestellen", "bestelle,bestellst,bestellt,bestellen,bestellt,bestellen", "w:bestellte", "bestellt", "h"],
    fruehstuecken: ["frühstücken", "frühstücke,frühstückst,frühstückt,frühstücken,frühstückt,frühstücken", "w:frühstückte", "gefrühstückt", "h"],
    mittagessen: ["zu Mittag essen", "esse,isst,isst,essen,esst,essen", "s:aß", "zu Mittag gegessen", "h", "zu Mittag "],
    abendessen: ["zu Abend essen", "esse,isst,isst,essen,esst,essen", "s:aß", "zu Abend gegessen", "h", "zu Abend "],
    probieren: ["probieren", "probiere,probierst,probiert,probieren,probiert,probieren", "w:probierte", "probiert", "h"],
    bezahlen: ["bezahlen", "bezahle,bezahlst,bezahlt,bezahlen,bezahlt,bezahlen", "w:bezahlte", "bezahlt", "h"],
    kaufen: ["kaufen", "kaufe,kaufst,kauft,kaufen,kauft,kaufen", "w:kaufte", "gekauft", "h"],
    einkaufen: ["einkaufen", "kaufe,kaufst,kauft,kaufen,kauft,kaufen", "w:kaufte", "eingekauft", "h", "ein"],
    suchen: ["suchen", "suche,suchst,sucht,suchen,sucht,suchen", "w:suchte", "gesucht", "h"],
    aussuchen: ["aussuchen", "suche,suchst,sucht,suchen,sucht,suchen", "w:suchte", "ausgesucht", "h", "aus"],
    anprobieren: ["anprobieren", "probiere,probierst,probiert,probieren,probiert,probieren", "w:probierte", "anprobiert", "h", "an"],
    verkaufen: ["verkaufen", "verkaufe,verkaufst,verkauft,verkaufen,verkauft,verkaufen", "w:verkaufte", "verkauft", "h"],
    arbeiten: ["arbeiten", "arbeite,arbeitest,arbeitet,arbeiten,arbeitet,arbeiten", "w:arbeitete", "gearbeitet", "h"],
    schreiben: ["schreiben", "schreibe,schreibst,schreibt,schreiben,schreibt,schreiben", "s:schrieb", "geschrieben", "h"],
    lesen: ["lesen", "lese,liest,liest,lesen,lest,lesen", "s:las", "gelesen", "h"],
    anrufen: ["anrufen", "rufe,rufst,ruft,rufen,ruft,rufen", "s:rief", "angerufen", "h", "an"],
    rufen: ["rufen", "rufe,rufst,ruft,rufen,ruft,rufen", "s:rief", "gerufen", "h"],
    schicken: ["schicken", "schicke,schickst,schickt,schicken,schickt,schicken", "w:schickte", "geschickt", "h"],
    beginnen: ["beginnen", "beginne,beginnst,beginnt,beginnen,beginnt,beginnen", "s:begann", "begonnen", "h"],
    organisieren: ["organisieren", "organisiere,organisierst,organisiert,organisieren,organisiert,organisieren", "w:organisierte", "organisiert", "h"],
    antworten: ["antworten", "antworte,antwortest,antwortet,antworten,antwortet,antworten", "w:antwortete", "geantwortet", "h"],
    helfen: ["helfen", "helfe,hilfst,hilft,helfen,helft,helfen", "s:half", "geholfen", "h"],
    treffen: ["treffen", "treffe,triffst,trifft,treffen,trefft,treffen", "s:traf", "getroffen", "h"],
    warten: ["warten", "warte,wartest,wartet,warten,wartet,warten", "w:wartete", "gewartet", "h"],
    benutzen: ["benutzen", "benutze,benutzt,benutzt,benutzen,benutzt,benutzen", "w:benutzte", "benutzt", "h"],
    reparieren: ["reparieren", "repariere,reparierst,repariert,reparieren,repariert,reparieren", "w:reparierte", "repariert", "h"],
    drucken: ["drucken", "drucke,druckst,druckt,drucken,druckt,drucken", "w:druckte", "gedruckt", "h"],
    unterschreiben: ["unterschreiben", "unterschreibe,unterschreibst,unterschreibt,unterschreiben,unterschreibt,unterschreiben", "s:unterschrieb", "unterschrieben", "h"],
    ausfuellen: ["ausfüllen", "fülle,füllst,füllt,füllen,füllt,füllen", "w:füllte", "ausgefüllt", "h", "aus"],
    reservieren: ["reservieren", "reserviere,reservierst,reserviert,reservieren,reserviert,reservieren", "w:reservierte", "reserviert", "h"],
    buchen: ["buchen", "buche,buchst,bucht,buchen,bucht,buchen", "w:buchte", "gebucht", "h"],
    verlaengern: ["verlängern", "verlängere,verlängerst,verlängert,verlängern,verlängert,verlängern", "w:verlängerte", "verlängert", "h"],
    beantragen: ["beantragen", "beantrage,beantragst,beantragt,beantragen,beantragt,beantragen", "w:beantragte", "beantragt", "h"],
    abgeben: ["abgeben", "gebe,gibst,gibt,geben,gebt,geben", "s:gab", "abgegeben", "h", "ab"],
    spielen: ["spielen", "spiele,spielst,spielt,spielen,spielt,spielen", "w:spielte", "gespielt", "h"],
    hoeren: ["hören", "höre,hörst,hört,hören,hört,hören", "w:hörte", "gehört", "h"],
    sehen: ["sehen", "sehe,siehst,sieht,sehen,seht,sehen", "s:sah", "gesehen", "h"],
    fernsehen: ["fernsehen", "sehe,siehst,sieht,sehen,seht,sehen", "s:sah", "ferngesehen", "h", "fern"],
    tanzen: ["tanzen", "tanze,tanzt,tanzt,tanzen,tanzt,tanzen", "w:tanzte", "getanzt", "h"],
    singen: ["singen", "singe,singst,singt,singen,singt,singen", "s:sang", "gesungen", "h"],
    schwimmen: ["schwimmen", "schwimme,schwimmst,schwimmt,schwimmen,schwimmt,schwimmen", "s:schwamm", "geschwommen", "s"],
    laufen: ["laufen", "laufe,läufst,läuft,laufen,lauft,laufen", "s:lief", "gelaufen", "s"],
    besichtigen: ["besichtigen", "besichtige,besichtigst,besichtigt,besichtigen,besichtigt,besichtigen", "w:besichtigte", "besichtigt", "h"],
    zeichnen: ["zeichnen", "zeichne,zeichnest,zeichnet,zeichnen,zeichnet,zeichnen", "w:zeichnete", "gezeichnet", "h"],
    besuchen: ["besuchen", "besuche,besuchst,besucht,besuchen,besucht,besuchen", "w:besuchte", "besucht", "h"],
    feiern: ["feiern", "feiere,feierst,feiert,feiern,feiert,feiern", "w:feierte", "gefeiert", "h"],
    schenken: ["schenken", "schenke,schenkst,schenkt,schenken,schenkt,schenken", "w:schenkte", "geschenkt", "h"],
    bringen: ["bringen", "bringe,bringst,bringt,bringen,bringt,bringen", "w:brachte", "gebracht", "h"],
    mitbringen: ["mitbringen", "bringe,bringst,bringt,bringen,bringt,bringen", "w:brachte", "mitgebracht", "h", "mit"],
    geben: ["geben", "gebe,gibst,gibt,geben,gebt,geben", "s:gab", "gegeben", "h"],
    sprechen: ["sprechen", "spreche,sprichst,spricht,sprechen,sprecht,sprechen", "s:sprach", "gesprochen", "h"],
    erzaehlen: ["erzählen", "erzähle,erzählst,erzählt,erzählen,erzählt,erzählen", "w:erzählte", "erzählt", "h"],
    erklaeren: ["erklären", "erkläre,erklärst,erklärt,erklären,erklärt,erklären", "w:erklärte", "erklärt", "h"],
    zeigen: ["zeigen", "zeige,zeigst,zeigt,zeigen,zeigt,zeigen", "w:zeigte", "gezeigt", "h"],
    lernen: ["lernen", "lerne,lernst,lernt,lernen,lernt,lernen", "w:lernte", "gelernt", "h"],
    studieren: ["studieren", "studiere,studierst,studiert,studieren,studiert,studieren", "w:studierte", "studiert", "h"],
    wiederholen: ["wiederholen", "wiederhole,wiederholst,wiederholt,wiederholen,wiederholt,wiederholen", "w:wiederholte", "wiederholt", "h"],
    verstehen: ["verstehen", "verstehe,verstehst,versteht,verstehen,versteht,verstehen", "s:verstand", "verstanden", "h"],
    bestehen: ["bestehen", "bestehe,bestehst,besteht,bestehen,besteht,bestehen", "s:bestand", "bestanden", "h"],
    uebersetzen: ["übersetzen", "übersetze,übersetzt,übersetzt,übersetzen,übersetzt,übersetzen", "w:übersetzte", "übersetzt", "h"],
    bitten: ["bitten", "bitte,bittest,bittet,bitten,bittet,bitten", "s:bat", "gebeten", "h"],
    fragen: ["fragen", "frage,fragst,fragt,fragen,fragt,fragen", "w:fragte", "gefragt", "h"],
    nehmen: ["nehmen", "nehme,nimmst,nimmt,nehmen,nehmt,nehmen", "s:nahm", "genommen", "h"],
    schlafen: ["schlafen", "schlafe,schläfst,schläft,schlafen,schlaft,schlafen", "s:schlief", "geschlafen", "h"],
    messen: ["messen", "messe,misst,misst,messen,messt,messen", "s:maß", "gemessen", "h"],
    rauchen: ["rauchen", "rauche,rauchst,raucht,rauchen,raucht,rauchen", "w:rauchte", "geraucht", "h"],
    putzen: ["putzen", "putze,putzt,putzt,putzen,putzt,putzen", "w:putzte", "geputzt", "h"],
    spuelen: ["spülen", "spüle,spülst,spült,spülen,spült,spülen", "w:spülte", "gespült", "h"],
    waschen: ["waschen", "wasche,wäschst,wäscht,waschen,wascht,waschen", "s:wusch", "gewaschen", "h"],
    aufraeumen: ["aufräumen", "räume,räumst,räumt,räumen,räumt,räumen", "w:räumte", "aufgeräumt", "h", "auf"],
    buegeln: ["bügeln", "bügle,bügelst,bügelt,bügeln,bügelt,bügeln", "w:bügelte", "gebügelt", "h"],
    oeffnen: ["öffnen", "öffne,öffnest,öffnet,öffnen,öffnet,öffnen", "w:öffnete", "geöffnet", "h"],
    schliessen: ["schließen", "schließe,schließt,schließt,schließen,schließt,schließen", "s:schloss", "geschlossen", "h"],
    einschalten: ["einschalten", "schalte,schaltest,schaltet,schalten,schaltet,schalten", "w:schaltete", "eingeschaltet", "h", "ein"],
    ausschalten: ["ausschalten", "schalte,schaltest,schaltet,schalten,schaltet,schalten", "w:schaltete", "ausgeschaltet", "h", "aus"],
    rausbringen: ["rausbringen", "bringe,bringst,bringt,bringen,bringt,bringen", "w:brachte", "rausgebracht", "h", "raus"],
    giessen: ["gießen", "gieße,gießt,gießt,gießen,gießt,gießen", "s:goss", "gegossen", "h"],
    verlieren: ["verlieren", "verliere,verlierst,verliert,verlieren,verliert,verlieren", "s:verlor", "verloren", "h"],
    finden: ["finden", "finde,findest,findet,finden,findet,finden", "s:fand", "gefunden", "h"],
    vergessen: ["vergessen", "vergesse,vergisst,vergisst,vergessen,vergesst,vergessen", "s:vergaß", "vergessen", "h"],
    decken: ["decken", "decke,deckst,deckt,decken,deckt,decken", "w:deckte", "gedeckt", "h"],
    duschen: ["duschen", "dusche,duschst,duscht,duschen,duscht,duschen", "w:duschte", "geduscht", "h"],
    mieten: ["mieten", "miete,mietest,mietet,mieten,mietet,mieten", "w:mietete", "gemietet", "h"],
    telefonieren: ["telefonieren", "telefoniere,telefonierst,telefoniert,telefonieren,telefoniert,telefonieren", "w:telefonierte", "telefoniert", "h"],
    backen: ["backen", "backe,bäckst,bäckt,backen,backt,backen", "w:backte", "gebacken", "h"],
    ausdrucken: ["ausdrucken", "drucke,druckst,druckt,drucken,druckt,drucken", "w:druckte", "ausgedruckt", "h", "aus"],
    anschauen: ["anschauen", "schaue,schaust,schaut,schauen,schaut,schauen", "w:schaute", "angeschaut", "h", "an"],
    mitnehmen: ["mitnehmen", "nehme,nimmst,nimmt,nehmen,nehmt,nehmen", "s:nahm", "mitgenommen", "h", "mit"],
    verpassen: ["verpassen", "verpasse,verpasst,verpasst,verpassen,verpasst,verpassen", "w:verpasste", "verpasst", "h"],
    regnen: ["regnen", "regne,regnest,regnet,regnen,regnet,regnen", "w:regnete", "geregnet", "h"],
    geben_es: ["geben", "gebe,gibst,gibt,geben,gebt,geben", "s:gab", "gegeben", "h"],
    kosten: ["kosten", "koste,kostest,kostet,kosten,kostet,kosten", "w:kostete", "gekostet", "h"],
    streiken: ["streiken", "streike,streikst,streikt,streiken,streikt,streiken", "w:streikte", "gestreikt", "h"],
    sein: null, haben: null,
  };
  const DEV = {};
  Object.keys(DE_VERBEN).forEach((k) => { DEV[k] = DE_VERBEN[k] ? deVerb(DE_VERBEN[k]) : null; });
  DEV.sein = DE_SEIN; DEV.haben = DE_HABEN;

  /* Deutsche Modalverben: Präsens, Präteritum, Konjunktiv II */
  const DE_MODAL = {
    koennen: { inf: "können", praes: ["kann", "kannst", "kann", "können", "könnt", "können"],
      praet: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
      k2: ["könnte", "könntest", "könnte", "könnten", "könntet", "könnten"] },
    muessen: { inf: "müssen", praes: ["muss", "musst", "muss", "müssen", "müsst", "müssen"],
      praet: ["musste", "musstest", "musste", "mussten", "musstet", "mussten"],
      k2: ["müsste", "müsstest", "müsste", "müssten", "müsstet", "müssten"] },
    wollen: { inf: "wollen", praes: ["will", "willst", "will", "wollen", "wollt", "wollen"],
      praet: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"] },
    moechten: { inf: "möchten", praes: ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"] },
    sollen: { inf: "sollen", k2: ["sollte", "solltest", "sollte", "sollten", "solltet", "sollten"] },
    duerfen: { inf: "dürfen", praes: ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"],
      praet: ["durfte", "durftest", "durfte", "durften", "durftet", "durften"] },
  };

  /* ===================================================================
     3. DIE BAUSTEINE
     =================================================================== */
  const NIVEAUS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  function ab(level, niveau) { return NIVEAUS.indexOf(level || "A1") <= NIVEAUS.indexOf(niveau || "A1"); }

  /* --- Wer? ----------------------------------------------------------
     p = Person 0..5 (io … loro). Das Pronomen fällt im Satz normalerweise
     weg. Bei io/tu/noi/voi/loro entscheidet „genus“ (männlich/weiblich)
     über die Angleichung („sono andato/andata“). */
  const SOGGETTI = [
    { id: "io", it: "io", p: 0, de: "ich", pron: true },
    { id: "tu", it: "tu", p: 1, de: "du", pron: true },
    { id: "lui", it: "lui", p: 2, g: "m", de: "er", dePoss: "sein", pron: true },
    { id: "lei", it: "lei", p: 2, g: "f", de: "sie", dePoss: "ihr", pron: true },
    { id: "noi", it: "noi", p: 3, de: "wir", pron: true },
    { id: "voi", it: "voi", p: 4, de: "ihr", pron: true },
    { id: "loro", it: "loro", p: 5, de: "sie", dePoss: "ihr", pron: true },
    { id: "marco", it: "Marco", p: 2, g: "m", de: "Marco", dePoss: "sein", rel: "marco" },
    { id: "giulia", it: "Giulia", p: 2, g: "f", de: "Giulia", dePoss: "ihr", rel: "giulia" },
    { id: "fratello", it: "mio fratello", p: 2, g: "m", de: "mein Bruder", dePoss: "sein", rel: "fratello", fam: true },
    { id: "sorella", it: "mia sorella", p: 2, g: "f", de: "meine Schwester", dePoss: "ihr", rel: "sorella", fam: true },
    { id: "genitori", it: "i miei genitori", p: 5, g: "m", de: "meine Eltern", dePoss: "ihr", rel: "genitori", fam: true, level: "A2" },
    { id: "amici", it: "i miei amici", p: 5, g: "m", de: "meine Freunde", dePoss: "ihr", rel: "amici", level: "A2" },
  ];
  const DE_PERSON = [0, 1, 2, 3, 4, 5];
  function subjektInfo(sog, genus) {
    const pl = sog.p >= 3;
    const g = sog.g || genus || "m";
    const dePoss = sog.dePoss || ["mein", "dein", "sein", "unser", "euer", "ihr"][sog.p];
    return { sog, p: sog.p, pl, g, dePoss, dp: DE_PERSON[sog.p] };
  }

  /* --- Personen (mit wem? wen? wem?) ---------------------------------
     fam: Verwandte — in der Einzahl ohne Artikel beim Possessiv
     („mia madre“), außer mit „loro“ („la loro madre“). */
  function P(id, it, g, pl, det, deN, deG, tags, level, extra) {
    return Object.assign({ id, n: { it, g, pl: Boolean(pl), fam: /fam/.test(tags) }, det,
      de: { n: deN, g: deG, pl: Boolean(pl) }, tags: tags.split(" "), level }, extra || {});
  }
  const PERSONE = [
    P("madre", "madre", "f", 0, "poss", "Mutter", "f", "fam", "A1"),
    P("padre", "padre", "m", 0, "poss", "Vater", "m", "fam", "A1"),
    P("sorella", "sorella", "f", 0, "poss", "Schwester", "f", "fam", "A1"),
    P("fratello", "fratello", "m", 0, "poss", "Bruder", "m", "fam", "A1"),
    P("nonna", "nonna", "f", 0, "poss", "Oma", "f", "fam", "A1"),
    P("nonno", "nonno", "m", 0, "poss", "Opa", "m", "fam", "A1"),
    P("figlio", "figlio", "m", 0, "poss", "Sohn", "m", "fam", "A2"),
    P("figlia", "figlia", "f", 0, "poss", "Tochter", "f", "fam", "A2"),
    P("marito", "marito", "m", 0, "poss", "Mann", "m", "fam partner", "A2"),
    P("moglie", "moglie", "f", 0, "poss", "Frau", "f", "fam partner", "A2"),
    P("genitori", "genitori", "m", 1, "poss", "Eltern", "pl", "fam", "A1"),
    P("nonni", "nonni", "m", 1, "poss", "Großeltern", "pl", "fam", "A2"),
    P("figli", "figli", "m", 1, "poss", "Kinder", "pl", "fam", "A2"),
    P("amici", "amici", "m", 1, "poss", "Freunde", "pl", "freunde", "A1"),
    P("amiche", "amiche", "f", 1, "poss", "Freundinnen", "pl", "freunde", "A1"),
    P("amico", "amico", "m", 0, "indef", "Freund", "m", "freunde", "A1"),
    P("amica", "amica", "f", 0, "indef", "Freundin", "f", "freunde", "A1"),
    P("ragazzo", "ragazzo", "m", 0, "poss", "Freund", "m", "partner", "A2"),
    P("ragazza", "ragazza", "f", 0, "poss", "Freundin", "f", "partner", "A2"),
    P("colleghi", "colleghi", "m", 1, "poss", "Kollegen", "pl", "kollegen", "A2"),
    P("marco", "Marco", "m", 0, "name", "Marco", "m", "name", "A1", { name: true }),
    P("giulia", "Giulia", "f", 0, "name", "Giulia", "f", "name", "A1", { name: true }),
    P("medico", "medico", "m", 0, "def", "Arzt", "m", "medico", "A1"),
    P("cane", "cane", "m", 0, "poss", "Hund", "m", "cane", "A2"),
  ];
  /* Italienische Form der Person, mit Präposition (a, con, da) oder ohne */
  function personIt(pe, si, praep) {
    let kern;
    if (pe.name) kern = pe.n.it;
    else kern = nominal(pe.n, pe.det, null, si.p);
    return praep ? verschmelze(praep, kern) : kern;
  }
  function personDe(pe, si, fall) {
    const n = { n: pe.de.n, g: pe.de.g === "pl" ? "m" : pe.de.g, pl: pe.de.pl, name: pe.name };
    return deNominal(n, fall, pe.det === "name" ? "ohne" : pe.det, "", si.dePoss);
  }

  /* --- Orte ----------------------------------------------------------
     it     wo? UND wohin? (im Italienischen dieselbe Form: „al mare“)
     da     woher? („dal mare“)
     per    wohin bei partire („parto per Roma“, „per l'Italia“)
     de     wo | wohin | woher auf Deutsch */
  function L(id, it, da, de, tags, level, extra) {
    const [wo, wohin, woher] = de.split("|");
    return Object.assign({ id, it, da, de: { wo, wohin, woher }, tags: tags.split(" "), level }, extra || {});
  }
  const LUOGHI = [
    L("casa", "a casa", "da casa", "zu Hause|nach Hause|von zu Hause", "heim", "A1"),
    L("cucina", "in cucina", "dalla cucina", "in der Küche|in die Küche|aus der Küche", "raum", "A1"),
    L("bagno", "in bagno", "dal bagno", "im Badezimmer|ins Badezimmer|aus dem Badezimmer", "raum privat", "A1"),
    L("soggiorno", "in soggiorno", "dal soggiorno", "im Wohnzimmer|ins Wohnzimmer|aus dem Wohnzimmer", "raum", "A2"),
    L("camera", "in camera", "dalla camera", "im Zimmer|ins Zimmer|aus dem Zimmer", "raum privat", "A1"),
    L("giardino", "in giardino", "dal giardino", "im Garten|in den Garten|aus dem Garten", "raum draussen", "A1"),
    L("balcone", "sul balcone", "dal balcone", "auf dem Balkon|auf den Balkon|vom Balkon", "raum draussen", "A2"),
    L("terrazza", "in terrazza", "dalla terrazza", "auf der Terrasse|auf die Terrasse|von der Terrasse", "raum draussen", "A2"),
    L("letto", "a letto", "dal letto", "im Bett|ins Bett|aus dem Bett", "letto privat", "A1"),
    L("divano", "sul divano", "dal divano", "auf dem Sofa|aufs Sofa|vom Sofa", "raum privat", "A2"),
    L("tavola", "a tavola", "da tavola", "am Tisch|an den Tisch|vom Tisch", "raum", "B1"),
    L("supermercato", "al supermercato", "dal supermercato", "im Supermarkt|in den Supermarkt|aus dem Supermarkt", "shop lebensmittel", "A1"),
    L("mercato", "al mercato", "dal mercato", "auf dem Markt|auf den Markt|vom Markt", "shop lebensmittel", "A1"),
    L("panetteria", "in panetteria", "dalla panetteria", "in der Bäckerei|in die Bäckerei|aus der Bäckerei", "shop lebensmittel", "A2"),
    L("macelleria", "in macelleria", "dalla macelleria", "in der Metzgerei|in die Metzgerei|aus der Metzgerei", "shop lebensmittel", "B1"),
    L("farmacia", "in farmacia", "dalla farmacia", "in der Apotheke|in die Apotheke|aus der Apotheke", "shop gesund", "A1"),
    L("libreria", "in libreria", "dalla libreria", "in der Buchhandlung|in die Buchhandlung|aus der Buchhandlung", "shop", "A2"),
    L("negozio", "in negozio", "dal negozio", "im Geschäft|ins Geschäft|aus dem Geschäft", "shop kleidung", "A2"),
    L("centro_commerciale", "al centro commerciale", "dal centro commerciale", "im Einkaufszentrum|ins Einkaufszentrum|aus dem Einkaufszentrum", "shop kleidung", "A2"),
    L("ufficio", "in ufficio", "dall'ufficio", "im Büro|ins Büro|aus dem Büro", "arbeit", "A1"),
    L("lavoro", "al lavoro", "dal lavoro", "auf der Arbeit|zur Arbeit|von der Arbeit", "arbeit", "A1"),
    L("scuola", "a scuola", "da scuola", "in der Schule|in die Schule|aus der Schule", "bildung", "A1"),
    L("universita", "all'università", "dall'università", "an der Universität|an die Universität|von der Universität", "bildung", "A1"),
    L("biblioteca", "in biblioteca", "dalla biblioteca", "in der Bibliothek|in die Bibliothek|aus der Bibliothek", "bildung", "A1"),
    L("corso", "al corso d'italiano", "dal corso d'italiano", "im Italienischkurs|in den Italienischkurs|aus dem Italienischkurs", "bildung", "A2"),
    L("palestra", "in palestra", "dalla palestra", "im Fitnessstudio|ins Fitnessstudio|aus dem Fitnessstudio", "sport", "A1"),
    L("piscina", "in piscina", "dalla piscina", "im Schwimmbad|ins Schwimmbad|aus dem Schwimmbad", "sport bad", "A1"),
    L("stadio", "allo stadio", "dallo stadio", "im Stadion|ins Stadion|aus dem Stadion", "kultur", "A2"),
    L("cinema", "al cinema", "dal cinema", "im Kino|ins Kino|aus dem Kino", "kultur", "A1"),
    L("teatro", "a teatro", "dal teatro", "im Theater|ins Theater|aus dem Theater", "kultur", "A2"),
    L("museo", "al museo", "dal museo", "im Museum|ins Museum|aus dem Museum", "kultur", "A2"),
    L("concerto", "al concerto", "dal concerto", "auf dem Konzert|aufs Konzert|vom Konzert", "kultur", "B1"),
    L("ristorante", "al ristorante", "dal ristorante", "im Restaurant|ins Restaurant|aus dem Restaurant", "gastro", "A1"),
    L("bar", "al bar", "dal bar", "im Café|ins Café|aus dem Café", "gastro bar", "A1"),
    L("pizzeria", "in pizzeria", "dalla pizzeria", "in der Pizzeria|in die Pizzeria|aus der Pizzeria", "gastro", "A1"),
    L("gelateria", "in gelateria", "dalla gelateria", "in der Eisdiele|in die Eisdiele|aus der Eisdiele", "gastro eisdiele", "A2"),
    L("mensa", "in mensa", "dalla mensa", "in der Kantine|in die Kantine|aus der Kantine", "gastro kantine", "B1"),
    L("discoteca", "in discoteca", "dalla discoteca", "in der Disko|in die Disko|aus der Disko", "fest", "A2"),
    L("festa", "alla festa", "dalla festa", "auf der Party|zur Party|von der Party", "fest", "A2"),
    L("parco", "al parco", "dal parco", "im Park|in den Park|aus dem Park", "natur draussen nah", "A1"),
    L("mare", "al mare", "dal mare", "am Meer|ans Meer|vom Meer", "natur draussen bad urlaub weit", "A1"),
    L("montagna", "in montagna", "dalla montagna", "in den Bergen|in die Berge|aus den Bergen", "natur draussen urlaub weit", "A1"),
    L("lago", "al lago", "dal lago", "am See|an den See|vom See", "natur draussen bad urlaub weit", "A2"),
    L("campagna", "in campagna", "dalla campagna", "auf dem Land|aufs Land|vom Land", "natur draussen urlaub weit", "A2"),
    L("spiaggia", "in spiaggia", "dalla spiaggia", "am Strand|an den Strand|vom Strand", "natur draussen bad nah", "A1"),
    L("bosco", "nel bosco", "dal bosco", "im Wald|in den Wald|aus dem Wald", "natur draussen nah", "A2"),
    L("zoo", "allo zoo", "dallo zoo", "im Zoo|in den Zoo|aus dem Zoo", "draussen ausflug", "A2"),
    L("citta", "in città", "dalla città", "in der Stadt|in die Stadt|aus der Stadt", "stadt", "A1"),
    L("centro", "in centro", "dal centro", "in der Innenstadt|in die Innenstadt|aus der Innenstadt", "stadt", "A1"),
    L("stazione", "alla stazione", "dalla stazione", "am Bahnhof|zum Bahnhof|vom Bahnhof", "verkehr", "A1"),
    L("aeroporto", "all'aeroporto", "dall'aeroporto", "am Flughafen|zum Flughafen|vom Flughafen", "verkehr flughafen", "A1"),
    L("fermata", "alla fermata", "dalla fermata", "an der Haltestelle|zur Haltestelle|von der Haltestelle", "verkehr haltestelle", "A2"),
    L("albergo", "in albergo", "dall'albergo", "im Hotel|ins Hotel|aus dem Hotel", "hotel", "A2"),
    L("banca", "in banca", "dalla banca", "auf der Bank|zur Bank|von der Bank", "amt anlass", "A1"),
    L("posta", "alla posta", "dalla posta", "auf der Post|zur Post|von der Post", "amt anlass", "A1"),
    L("comune", "in comune", "dal comune", "im Rathaus|ins Rathaus|aus dem Rathaus", "amt anlass", "B1"),
    L("questura", "in questura", "dalla questura", "bei der Ausländerbehörde|zur Ausländerbehörde|von der Ausländerbehörde", "amt anlass", "B2"),
    L("medico", "dal medico", "dal medico", "beim Arzt|zum Arzt|vom Arzt", "gesund arzt anlass", "A1"),
    L("dentista", "dal dentista", "dal dentista", "beim Zahnarzt|zum Zahnarzt|vom Zahnarzt", "gesund zahnarzt anlass", "A2"),
    L("ospedale", "in ospedale", "dall'ospedale", "im Krankenhaus|ins Krankenhaus|aus dem Krankenhaus", "gesund arzt anlass", "A2"),
    L("pronto_soccorso", "al pronto soccorso", "dal pronto soccorso", "in der Notaufnahme|in die Notaufnahme|aus der Notaufnahme", "gesund arzt anlass", "B1"),
    L("parrucchiere", "dal parrucchiere", "dal parrucchiere", "beim Friseur|zum Friseur|vom Friseur", "friseur anlass", "A2"),
    L("nonni", "dai nonni", "dai nonni", "bei den Großeltern|zu den Großeltern|von den Großeltern", "person", "A1"),
    L("da_marco", "da Marco", "da Marco", "bei Marco|zu Marco|von Marco", "person", "A1"),
    L("roma", "a Roma", "da Roma", "in Rom|nach Rom|aus Rom", "fern stadtname", "A1", { per: "per Roma" }),
    L("milano", "a Milano", "da Milano", "in Mailand|nach Mailand|aus Mailand", "fern stadtname", "A1", { per: "per Milano" }),
    L("napoli", "a Napoli", "da Napoli", "in Neapel|nach Neapel|aus Neapel", "fern stadtname", "A2", { per: "per Napoli" }),
    L("venezia", "a Venezia", "da Venezia", "in Venedig|nach Venedig|aus Venedig", "fern stadtname", "A1", { per: "per Venezia" }),
    L("firenze", "a Firenze", "da Firenze", "in Florenz|nach Florenz|aus Florenz", "fern stadtname", "A2", { per: "per Firenze" }),
    L("berlino", "a Berlino", "da Berlino", "in Berlin|nach Berlin|aus Berlin", "fern stadtname", "A1", { per: "per Berlino" }),
    L("italia", "in Italia", "dall'Italia", "in Italien|nach Italien|aus Italien", "fern land", "A1", { per: "per l'Italia" }),
    L("germania", "in Germania", "dalla Germania", "in Deutschland|nach Deutschland|aus Deutschland", "fern land", "A1", { per: "per la Germania" }),
    L("svizzera", "in Svizzera", "dalla Svizzera", "in der Schweiz|in die Schweiz|aus der Schweiz", "fern land", "A2", { per: "per la Svizzera" }),
    L("austria", "in Austria", "dall'Austria", "in Österreich|nach Österreich|aus Österreich", "fern land", "A2", { per: "per l'Austria" }),
    L("spagna", "in Spagna", "dalla Spagna", "in Spanien|nach Spanien|aus Spanien", "fern land", "A2", { per: "per la Spagna" }),
    L("francia", "in Francia", "dalla Francia", "in Frankreich|nach Frankreich|aus Frankreich", "fern land", "A2", { per: "per la Francia" }),
    L("in_treno", "in treno", "", "im Zug||", "fahrzeug", "A2"),
    L("in_macchina", "in macchina", "", "im Auto||", "fahrzeug", "A2"),
    L("sull_autobus", "sull'autobus", "", "im Bus||", "fahrzeug", "A2"),
    L("coro", "nel coro", "", "im Chor||", "chor", "B1"),
    L("doccia", "sotto la doccia", "", "unter der Dusche||", "privat dusche", "A2"),
    L("da_casa_ho", "da casa", "", "von zu Hause||", "homeoffice", "A2"),
  ];
  const LUOGO = {}; LUOGHI.forEach((l) => { LUOGO[l.id] = l; });
  /* Pizzeria, Kino, Disko … nicht am Morgen */
  ["pizzeria", "ristorante", "discoteca", "cinema", "teatro", "concerto", "festa"].forEach((id) => { LUOGO[id].tzNicht = ["morgen"]; });
  const RAUM_ORTE = ["cucina", "bagno", "soggiorno", "camera", "giardino", "balcone", "terrazza"];
  function orteMit(tag) { return LUOGHI.filter((l) => l.tags.includes(tag)).map((l) => l.id); }

  /* --- Wie ist es? (Adjektive) ---------------------------------------
     davor: steht vor dem Nomen (un bel film, una nuova macchina) */
  const AGGETTIVI = [
    { id: "buono", it: "buono", de: "gut", davor: true, level: "A1" },
    { id: "bello", it: "bello", de: "schön", davor: true, level: "A1" },
    { id: "grande", it: "grande", de: "groß", davor: true, level: "A1" },
    { id: "piccolo", it: "piccolo", de: "klein", davor: true, level: "A1" },
    { id: "nuovo", it: "nuovo", de: "neu", davor: true, level: "A1" },
    { id: "vecchio", it: "vecchio", de: "alt", davor: true, level: "A1" },
    { id: "fresco", it: "fresco", de: "frisch", level: "A1" },
    { id: "caldo", it: "caldo", de: "warm", level: "A1" },
    { id: "rosso", it: "rosso", de: "rot", level: "A1" },
    { id: "nero", it: "nero", de: "schwarz", level: "A1" },
    { id: "bianco", it: "bianco", de: "weiß", level: "A1" },
    { id: "blu", it: "blu", de: "blau", fest: true, level: "A1" },
    { id: "comodo", it: "comodo", de: "bequem", level: "A2" },
    { id: "elegante", it: "elegante", de: "elegant", level: "A2" },
    { id: "interessante", it: "interessante", de: "interessant", level: "A1" },
    { id: "lungo", it: "lungo", de: "lang", level: "A1" },
    { id: "italiano", it: "italiano", de: "italienisch", level: "A1" },
    { id: "luminoso", it: "luminoso", de: "hell", level: "B1" },
    { id: "costoso", it: "costoso", de: "teur", level: "A2" },
    { id: "economico", it: "economico", de: "günstig", weichPl: true, level: "B1" },
    { id: "divertente", it: "divertente", de: "lustig", level: "A2" },
    { id: "difficile", it: "difficile", de: "schwierig", level: "A2" },
  ];
  const AGG = {}; AGGETTIVI.forEach((a) => { AGG[a.id] = a; });

  /* --- Was? (Dinge) ----------------------------------------------------
     dets     welche Begleiter natürlich sind, der erste ist der Normalfall
                indef  un/uno/una/un' (im Plural: dei/degli/delle)
                def    il/lo/la/l'/i/gli/le
                part   del/dello/della/dell'/dei/degli/delle (etwas von)
                poss   il mio …
                ohne   ohne Begleiter (parlo italiano, cerco lavoro)
     deDef    wie „def“ auf Deutsch heißt: der Kaffee im Allgemeinen ist
              „Kaffee“ (ohne), die Schlüssel sind „meine Schlüssel“
     a        wird mit „a“ angeschlossen (gioco a calcio, ai videogiochi) */
  function O(id, it, g, pl, dets, deN, deG, tags, level, extra) {
    return Object.assign({ id, n: { it, g, pl: Boolean(pl) }, dets: dets.split(" "),
      de: { n: deN, g: deG === "pl" ? "m" : deG, pl: deG === "pl" }, tags: tags ? tags.split(" ") : [], level }, extra || {});
  }
  const OGGETTI = [
    /* Essen */
    O("pizza", "pizza", "f", 0, "indef def", "Pizza", "f", "essen", "A1", { adj: ["buono"] }),
    O("pasta", "pasta", "f", 0, "def part", "Nudeln", "pl", "essen", "A1", { deDef: "ohne", masse: true }),
    O("spaghetti", "spaghetti", "m", 1, "def part", "Spaghetti", "pl", "essen", "A1", { deDef: "ohne" }),
    O("pane", "pane", "m", 0, "part def", "Brot", "n", "essen vorrat", "A1", { deDef: "ohne", masse: true, adj: ["fresco"] }),
    O("panino", "panino", "m", 0, "indef def", "Brötchen", "n", "essen", "A1", { adj: ["buono"] }),
    O("cornetto", "cornetto", "m", 0, "indef def", "Croissant", "n", "essen fruehstueck", "A1", { adj: ["caldo"] }),
    O("gelato", "gelato", "m", 0, "indef def", "Eis", "n", "essen eis", "A1", { adj: ["buono", "grande", "piccolo"] }),
    O("torta", "torta", "f", 0, "indef def part", "Kuchen", "m", "essen kuchen", "A1", { adj: ["buono"] }),
    O("insalata", "insalata", "f", 0, "indef def", "Salat", "m", "essen", "A1", { adj: ["fresco"] }),
    O("zuppa", "zuppa", "f", 0, "indef def", "Suppe", "f", "essen", "A1", { adj: ["caldo"] }),
    O("risotto", "risotto", "m", 0, "indef def", "Risotto", "n", "essen", "A2", { adj: ["buono"] }),
    O("lasagne", "lasagne", "f", 1, "def", "Lasagne", "f", "essen", "A2", { deN1: true }),
    O("frutta", "frutta", "f", 0, "def part", "Obst", "n", "essen vorrat", "A1", { deDef: "ohne", masse: true, adj: ["fresco"] }),
    O("verdura", "verdura", "f", 0, "def part", "Gemüse", "n", "essen vorrat", "A1", { deDef: "ohne", masse: true, adj: ["fresco"] }),
    O("mela", "mela", "f", 0, "indef def", "Apfel", "m", "essen", "A1"),
    O("mele", "mele", "f", 1, "part def", "Äpfel", "pl", "essen vorrat", "A1"),
    O("formaggio", "formaggio", "m", 0, "part def", "Käse", "m", "essen vorrat", "A1", { deDef: "ohne", masse: true, adj: ["italiano", "fresco"] }),
    O("pesce", "pesce", "m", 0, "def part", "Fisch", "m", "essen vorrat", "A1", { deDef: "ohne", masse: true, adj: ["fresco"] }),
    O("carne", "carne", "f", 0, "def part", "Fleisch", "n", "essen vorrat", "A1", { deDef: "ohne", masse: true }),
    O("uova", "uova", "f", 1, "part def", "Eier", "pl", "essen vorrat", "A2", { adj: ["fresco"] }),
    O("biscotti", "biscotti", "m", 1, "part def", "Kekse", "pl", "essen", "A2"),
    O("cioccolato", "cioccolato", "m", 0, "part def", "Schokolade", "f", "essen", "A1", { deDef: "ohne", masse: true }),
    O("cena", "cena", "f", 0, "def", "Abendessen", "n", "mahlzeit", "A1"),
    O("pranzo", "pranzo", "m", 0, "def", "Mittagessen", "n", "mahlzeit", "A1"),
    O("colazione", "colazione", "f", 0, "def", "Frühstück", "n", "mahlzeit", "A1"),
    /* Trinken */
    O("caffe", "caffè", "m", 0, "indef def", "Kaffee", "m", "trinken heissgetraenk", "A1", { deDef: "ohne" }),
    O("cappuccino", "cappuccino", "m", 0, "indef def", "Cappuccino", "m", "trinken heissgetraenk", "A1", { deDef: "ohne" }),
    O("te", "tè", "m", 0, "indef def", "Tee", "m", "trinken heissgetraenk", "A1", { deDef: "ohne" }),
    O("acqua", "acqua", "f", 0, "part def ohne", "Wasser", "n", "trinken erfrischung", "A1", { deDef: "ohne", masse: true, adj: ["fresco"] }),
    O("succo", "succo d'arancia", "m", 0, "indef def", "Orangensaft", "m", "trinken erfrischung", "A1", { deDef: "ohne" }),
    O("vino", "vino", "m", 0, "def part", "Wein", "m", "trinken alkohol", "A1", { deDef: "ohne", masse: true, alk: true, adj: ["italiano", "rosso", "bianco"] }),
    O("birra", "birra", "f", 0, "indef def", "Bier", "n", "trinken alkohol erfrischung", "A1", { deDef: "ohne", alk: true }),
    O("latte", "latte", "m", 0, "def part", "Milch", "f", "trinken", "A1", { deDef: "ohne", masse: true, adj: ["fresco", "caldo"] }),
    /* Kleidung */
    O("giacca", "giacca", "f", 0, "indef def poss", "Jacke", "f", "kleidung", "A1", { adj: ["nuovo", "bello", "caldo", "rosso", "nero", "blu", "elegante", "costoso"] }),
    O("vestito", "vestito", "m", 0, "indef def poss", "Kleid", "n", "kleidung", "A1", { adj: ["nuovo", "bello", "lungo", "rosso", "nero", "blu", "elegante", "bianco"] }),
    O("scarpe", "scarpe", "f", 1, "part def poss", "Schuhe", "pl", "kleidung", "A1", { adj: ["nuovo", "bello", "comodo", "nero", "rosso", "costoso"] }),
    O("maglione", "maglione", "m", 0, "indef def poss", "Pullover", "m", "kleidung", "A2", { adj: ["caldo", "nuovo", "rosso", "blu", "nero", "bianco"] }),
    O("cappotto", "cappotto", "m", 0, "indef def poss", "Mantel", "m", "kleidung", "A2", { adj: ["caldo", "nuovo", "nero", "lungo", "elegante"] }),
    O("camicia", "camicia", "f", 0, "indef def poss", "Hemd", "n", "kleidung", "A2", { adj: ["bianco", "nuovo", "elegante", "blu"] }),
    O("borsa", "borsa", "f", 0, "indef def poss", "Tasche", "f", "kleidung sachen", "A1", { adj: ["nuovo", "bello", "grande", "piccolo", "nero", "rosso", "costoso"] }),
    O("sciarpa", "sciarpa", "f", 0, "indef def", "Schal", "m", "kleidung", "A2", { adj: ["caldo", "rosso", "blu", "lungo", "bello"] }),
    /* Persönliche Sachen */
    O("chiavi", "chiavi", "f", 1, "def poss", "Schlüssel", "pl", "sachen", "A1", { deDef: "possSachen" }),
    O("portafoglio", "portafoglio", "m", 0, "def poss", "Geldbeutel", "m", "sachen", "A2", { deDef: "possSachen" }),
    O("telefono", "telefono", "m", 0, "def poss indef", "Handy", "n", "sachen technik", "A1", { deDef: "possSachen", adj: ["nuovo", "vecchio"], einmalig: true }),
    O("occhiali", "occhiali", "m", 1, "def poss", "Brille", "f", "sachen", "A2", { deDef: "possSachen", deSg: true }),
    O("ombrello", "ombrello", "m", 0, "def poss indef", "Regenschirm", "m", "sachen schirm", "A1", { deDef: "possSachen" }),
    O("passaporto", "passaporto", "m", 0, "def poss", "Reisepass", "m", "sachen dokument", "A2", { deDef: "possSachen" }),
    O("carta_identita", "carta d'identità", "f", 0, "def poss", "Personalausweis", "m", "sachen dokument", "B1", { deDef: "possSachen" }),
    O("permesso", "permesso di soggiorno", "m", 0, "def poss", "Aufenthaltserlaubnis", "f", "dokument", "B2", { deDef: "possSachen" }),
    O("abbonamento", "abbonamento", "m", 0, "def poss", "Abo", "n", "dokument", "B2", { deDef: "possSachen" }),
    O("certificato", "certificato", "m", 0, "indef def", "Bescheinigung", "f", "dokument", "B2"),
    O("numero", "numero di telefono", "m", 0, "poss", "Telefonnummer", "f", "sachen", "A2"),
    /* Lesen und Schreiben */
    O("libro", "libro", "m", 0, "indef def poss", "Buch", "n", "lesen", "A1", { adj: ["interessante", "nuovo", "vecchio", "bello", "lungo", "divertente", "difficile"], kind: true }),
    O("giornale", "giornale", "m", 0, "def indef", "Zeitung", "f", "lesen", "A1"),
    O("rivista", "rivista", "f", 0, "indef def", "Zeitschrift", "f", "lesen", "A2", { adj: ["interessante", "italiano"] }),
    O("romanzo", "romanzo", "m", 0, "indef def", "Roman", "m", "lesen", "B1", { adj: ["interessante", "lungo", "italiano"] }),
    O("fumetto", "fumetto", "m", 0, "indef def", "Comic", "m", "lesen", "A2", { adj: ["divertente"], kind: true }),
    O("lettera", "lettera", "f", 0, "indef def", "Brief", "m", "post", "A1", { adj: ["lungo"] }),
    O("email", "email", "f", 0, "indef def", "E-Mail", "f", "post", "A1", { adj: ["lungo"] }),
    O("messaggio", "messaggio", "m", 0, "indef def", "Nachricht", "f", "post", "A1", { adj: ["lungo"] }),
    O("cartolina", "cartolina", "f", 0, "indef", "Postkarte", "f", "post", "A1", { adj: ["bello"] }),
    O("pacco", "pacco", "m", 0, "indef def", "Paket", "n", "post", "A2", { adj: ["grande", "piccolo"] }),
    O("poesia", "poesia", "f", 0, "indef def", "Gedicht", "n", "lernen", "A2", { adj: ["lungo", "bello"] }),
    O("rapporto", "rapporto", "m", 0, "indef def", "Bericht", "m", "arbeit", "B1", { adj: ["lungo"] }),
    O("documenti", "documenti", "m", 1, "def poss", "Unterlagen", "pl", "arbeit dokument", "B1"),
    O("modulo", "modulo", "m", 0, "indef def", "Formular", "n", "dokument", "B1"),
    O("contratto", "contratto", "m", 0, "def indef", "Vertrag", "m", "dokument", "B1", { adj: ["nuovo"] }),
    /* Geschenke */
    O("regalo", "regalo", "m", 0, "indef def", "Geschenk", "n", "geschenk", "A1", { adj: ["piccolo", "bello", "grande"] }),
    O("fiori", "fiori", "m", 1, "part def", "Blumen", "pl", "geschenk pflanzen", "A1", { adj: ["bello", "rosso", "bianco"] }),
    O("profumo", "profumo", "m", 0, "indef", "Parfüm", "n", "geschenk", "A2", { adj: ["buono", "nuovo", "costoso"] }),
    O("orologio", "orologio", "m", 0, "indef def poss", "Uhr", "f", "geschenk sachen", "A2", { adj: ["nuovo", "bello", "vecchio", "costoso"], einmalig: true }),
    /* Rechnungen, Tickets */
    O("conto", "conto", "m", 0, "def", "Rechnung", "f", "rechnung", "A1"),
    O("affitto", "affitto", "m", 0, "def", "Miete", "f", "rechnung", "A2"),
    O("bolletta", "bolletta della luce", "f", 0, "def", "Stromrechnung", "f", "rechnung", "B1"),
    O("biglietto", "biglietto", "m", 0, "indef def", "Fahrkarte", "f", "ticket", "A1"),
    /* Größeres */
    O("macchina", "macchina", "f", 0, "indef def poss", "Auto", "n", "fahrzeug", "A1", { adj: ["nuovo", "vecchio", "rosso", "piccolo"], einmalig: true }),
    O("bici", "bici", "f", 0, "indef def poss", "Fahrrad", "n", "fahrzeug", "A1", { adj: ["nuovo", "vecchio"], einmalig: true, kind: true }),
    O("appartamento", "appartamento", "m", 0, "indef", "Wohnung", "f", "wohnung", "A2", { adj: ["piccolo", "grande", "nuovo", "luminoso"], einmalig: true }),
    O("lavoro_nomen", "lavoro", "m", 0, "ohne indef", "Arbeit", "f", "arbeit", "A1", { deIndefN: "Stelle" }),
    O("tavolo", "tavolo", "m", 0, "indef", "Tisch", "m", "reservierung", "A2"),
    O("camera_hotel", "camera", "f", 0, "indef", "Zimmer", "n", "reservierung", "A2"),
    O("volo", "volo", "m", 0, "indef def", "Flug", "m", "reise", "A2"),
    O("viaggio", "viaggio", "m", 0, "indef def", "Reise", "f", "reise", "A2", { adj: ["lungo", "bello"] }),
    /* Haus */
    O("finestra", "finestra", "f", 0, "def", "Fenster", "n", "haus", "A1"),
    O("finestre", "finestre", "f", 1, "def", "Fenster", "pl", "haus", "A1"),
    O("porta", "porta", "f", 0, "def", "Tür", "f", "haus", "A1"),
    O("luce", "luce", "f", 0, "def", "Licht", "n", "haus geraet", "A1"),
    O("tv", "TV", "f", 0, "def", "Fernseher", "m", "geraet", "A1"),
    O("computer", "computer", "m", 0, "def poss", "Computer", "m", "geraet technik", "A1"),
    O("riscaldamento", "riscaldamento", "m", 0, "def", "Heizung", "f", "geraet heizung", "A2"),
    O("radio", "radio", "f", 0, "def", "Radio", "n", "geraet musik", "A1"),
    O("lampada", "lampada", "f", 0, "def indef", "Lampe", "f", "geraet", "B1"),
    O("piatti", "piatti", "m", 1, "def", "Geschirr", "n", "haushalt", "A1", { deSg: true }),
    O("vestiti", "vestiti", "m", 1, "def", "Wäsche", "f", "haushalt", "A2", { deSg: true }),
    O("cucina_raum", "cucina", "f", 0, "def", "Küche", "f", "raum", "A1"),
    O("bagno_raum", "bagno", "m", 0, "def", "Bad", "n", "raum", "A1"),
    O("casa_obj", "casa", "f", 0, "def", "Wohnung", "f", "raum", "A1"),
    O("camera_mia", "camera", "f", 0, "poss def", "Zimmer", "n", "raum", "A1"),
    O("scrivania", "scrivania", "f", 0, "def poss", "Schreibtisch", "m", "raum", "A2"),
    O("spazzatura", "spazzatura", "f", 0, "def", "Müll", "m", "haushalt", "A2"),
    O("piante", "piante", "f", 1, "def poss", "Pflanzen", "pl", "pflanzen", "B1"),
    O("tavola", "tavola", "f", 0, "def", "Tisch", "m", "haushalt", "B1"),
    /* Lernen */
    O("compiti", "compiti", "m", 1, "def", "Hausaufgaben", "pl", "lernen", "A1"),
    O("esame", "esame", "m", 0, "def", "Prüfung", "f", "lernen", "A2"),
    O("lezione", "lezione", "f", 0, "def", "Lektion", "f", "lernen", "A2"),
    O("grammatica", "grammatica", "f", 0, "def", "Grammatik", "f", "lernen", "A1"),
    O("vocaboli", "vocaboli", "m", 1, "def", "Vokabeln", "pl", "lernen", "A2", { adj: ["nuovo"] }),
    O("frase", "frase", "f", 0, "indef def", "Satz", "m", "lernen", "A2", { adj: ["lungo", "difficile"] }),
    O("testo", "testo", "m", 0, "indef def", "Text", "m", "lernen", "A2", { adj: ["lungo", "difficile", "interessante"] }),
    O("domanda", "domanda", "f", 0, "def indef", "Frage", "f", "lernen", "A1", { adj: ["difficile"] }),
    O("problema", "problema", "m", 0, "def indef", "Problem", "n", "lernen", "A2", { adj: ["piccolo", "grande"] }),
    O("strada", "strada", "f", 0, "def", "Weg", "m", "weg", "A2"),
    O("storia", "storia", "f", 0, "indef", "Geschichte", "f", "erzaehlen", "A2", { adj: ["lungo", "bello", "divertente"], kind: true }),
    O("barzelletta", "barzelletta", "f", 0, "indef", "Witz", "m", "erzaehlen", "B1", { adj: ["divertente"] }),
    O("italiano", "italiano", "m", 0, "ohne def", "Italienisch", "n", "sprache", "A1", { deDef: "ohne" }),
    O("tedesco", "tedesco", "m", 0, "ohne def", "Deutsch", "n", "sprache", "A1", { deDef: "ohne" }),
    O("inglese", "inglese", "m", 0, "ohne def", "Englisch", "n", "sprache", "A1", { deDef: "ohne" }),
    O("spagnolo", "spagnolo", "m", 0, "ohne def", "Spanisch", "n", "sprache", "A2", { deDef: "ohne" }),
    O("francese", "francese", "m", 0, "ohne def", "Französisch", "n", "sprache", "A2", { deDef: "ohne" }),
    O("medicina_fach", "medicina", "f", 0, "ohne", "Medizin", "f", "fach", "B1"),
    O("economia", "economia", "f", 0, "ohne", "Wirtschaft", "f", "fach", "B1"),
    O("corso_obj", "corso d'italiano", "m", 0, "indef def", "Italienischkurs", "m", "lernen", "A2"),
    O("universita_obj", "università", "f", 0, "def", "Universität", "f", "lernen", "B1"),
    /* Musik, Film, Spiel */
    O("musica", "musica", "f", 0, "def", "Musik", "f", "musik", "A1", { deDef: "ohne", adj: ["italiano"] }),
    O("radio_hoeren", "radio", "f", 0, "def", "Radio", "n", "musik", "A1", { deDef: "ohne" }),
    O("canzone", "canzone", "f", 0, "indef def", "Lied", "n", "musik", "A1", { adj: ["bello", "nuovo", "italiano"], kind: true }),
    O("podcast", "podcast", "m", 0, "indef def", "Podcast", "m", "musik", "B1", { adj: ["interessante", "italiano"] }),
    O("film", "film", "m", 0, "indef def", "Film", "m", "film", "A1", { adj: ["bello", "interessante", "nuovo", "italiano", "divertente", "lungo"], kind: true }),
    O("serie", "serie", "f", 0, "indef def", "Serie", "f", "film", "A2", { adj: ["nuovo", "italiano", "divertente"] }),
    O("partita", "partita", "f", 0, "def indef", "Spiel", "n", "film sportschau", "A1"),
    O("foto", "foto", "f", 1, "def poss", "Fotos", "pl", "foto", "A1", { adj: ["vecchio", "bello"] }),
    O("chitarra", "chitarra", "f", 0, "def", "Gitarre", "f", "instrument", "A2", { deDef: "ohne", kind: true }),
    O("pianoforte", "pianoforte", "m", 0, "def", "Klavier", "n", "instrument", "A2", { deDef: "ohne", kind: true }),
    O("violino", "violino", "m", 0, "def", "Geige", "f", "instrument", "B1", { deDef: "ohne", kind: true }),
    O("calcio", "calcio", "m", 0, "ohne", "Fußball", "m", "sport draussen", "A1", { a: true, kind: true }),
    O("tennis", "tennis", "m", 0, "ohne", "Tennis", "n", "sport draussen", "A1", { a: true, kind: true }),
    O("pallavolo", "pallavolo", "f", 0, "ohne", "Volleyball", "m", "sport", "A2", { a: true, kind: true }),
    O("basket", "basket", "m", 0, "ohne", "Basketball", "m", "sport", "A2", { a: true, kind: true }),
    O("carte", "carte", "f", 1, "ohne", "Karten", "pl", "spiel_drinnen", "A1", { a: true, kind: true }),
    O("scacchi", "scacchi", "m", 1, "ohne", "Schach", "n", "spiel_drinnen", "A2", { a: true, kind: true, deSg: true }),
    O("videogiochi", "videogiochi", "m", 1, "def", "Videospiele", "pl", "spiel_drinnen", "A2", { a: true, kind: true, deDef: "ohne" }),
    /* Ausflug, Feste, Arbeit */
    O("festa_obj", "festa", "f", 0, "indef def", "Party", "f", "fest", "A2", { adj: ["grande", "piccolo", "bello"] }),
    O("cena_obj", "cena", "f", 0, "indef def", "Abendessen", "n", "essen", "A2", { adj: ["piccolo", "elegante"] }),
    O("riunione", "riunione", "f", 0, "indef def", "Besprechung", "f", "arbeit", "B1", { adj: ["lungo", "importante"] }),
    O("presentazione", "presentazione", "f", 0, "def indef", "Präsentation", "f", "arbeit", "B1", { adj: ["lungo", "interessante"] }),
    O("progetto", "progetto", "m", 0, "def indef", "Projekt", "n", "arbeit", "A2", { adj: ["nuovo", "grande", "interessante"] }),
    O("museo_obj", "museo", "m", 0, "indef def", "Museum", "n", "kultur", "A2", { adj: ["interessante", "piccolo", "grande"] }),
    O("citta_obj", "città", "f", 0, "def", "Stadt", "f", "kultur", "A2"),
    O("centro_storico", "centro storico", "m", 0, "def", "Altstadt", "f", "kultur", "B1"),
    O("mostra", "mostra", "f", 0, "indef def", "Ausstellung", "f", "kultur", "B1", { adj: ["interessante", "nuovo", "bello"] }),
    O("colosseo", "Colosseo", "m", 0, "def", "Kolosseum", "n", "kultur", "A2"),
    O("chiesa", "chiesa", "f", 0, "indef def", "Kirche", "f", "kultur", "A2", { adj: ["vecchio", "bello", "piccolo"] }),
    O("compleanno", "compleanno", "m", 0, "poss", "Geburtstag", "m", "fest", "A2"),
    O("natale", "Natale", "m", 0, "def", "Weihnachten", "n", "fest", "A2", { deDef: "ohne" }),
    /* Verkehr, Gesundheit, Sonstiges */
    O("autobus", "autobus", "m", 0, "def", "Bus", "m", "verkehr bus", "A1"),
    O("treno", "treno", "m", 0, "def", "Zug", "m", "verkehr treno", "A1"),
    O("metro", "metro", "f", 0, "def", "U-Bahn", "f", "verkehr metro", "A2"),
    O("taxi", "taxi", "m", 0, "indef", "Taxi", "n", "verkehr taxi", "A2"),
    O("medicina", "medicina", "f", 0, "indef def", "Medikament", "n", "medizin", "A2"),
    O("pastiglia", "pastiglia", "f", 0, "indef", "Tablette", "f", "medizin", "A2"),
    O("febbre", "febbre", "f", 0, "def", "Fieber", "n", "fieber", "A2", { deDef: "ohne" }),
    O("pressione", "pressione", "f", 0, "def", "Blutdruck", "m", "fieber", "B1"),
    O("sigaretta", "sigaretta", "f", 0, "indef", "Zigarette", "f", "rauchen", "A2"),
    O("aiuto", "aiuto", "m", 0, "ohne", "Hilfe", "f", "bitte", "A2"),
    O("informazioni", "informazioni", "f", 1, "ohne", "Auskunft", "f", "bitte", "A2", { deSg: true }),
    O("denti", "denti", "m", 1, "def", "Zähne", "pl", "koerper", "A1"),
    O("mani", "mani", "f", 1, "def", "Hände", "pl", "koerper", "A1"),
    O("capelli", "capelli", "m", 1, "def", "Haare", "pl", "koerper", "A1"),
    O("cane_obj", "cane", "m", 0, "indef", "Hund", "m", "tier", "A1", { einmalig: true }),
    O("gatto", "gatto", "m", 0, "indef", "Katze", "f", "tier", "A1", { einmalig: true }),
    /* Zustände mit avere */
    O("fame", "fame", "f", 0, "ohne", "Hunger", "m", "zustand", "A1"),
    O("sete", "sete", "f", 0, "ohne", "Durst", "m", "zustand", "A1"),
    O("tempo", "tempo", "m", 0, "ohne", "Zeit", "f", "zustand", "A1"),
    O("mal_testa", "mal di testa", "m", 0, "ohne", "Kopfschmerzen", "pl", "zustand", "A2"),
    O("influenza", "influenza", "f", 0, "def", "Grippe", "f", "zustand", "B1", { deDef: "ohne" }),
    O("appuntamento", "appuntamento", "m", 0, "indef", "Termin", "m", "termin", "A2"),
  ];
  const OGG = {}; OGGETTI.forEach((o) => { OGG[o.id] = o; });
  /* Dinge, die man nicht jeden Tag / jede Woche tut („ogni sera scrivo una lettera“ ✗) */
  ["lettera", "cartolina", "poesia", "rapporto", "pacco", "regalo", "profumo", "orologio", "contratto", "modulo", "documenti", "passaporto",
    "carta_identita", "permesso", "abbonamento", "certificato", "viaggio", "volo", "festa_obj", "museo_obj", "mostra", "citta_obj", "colosseo",
    "centro_storico", "compleanno", "natale", "esame", "camera_hotel", "taxi", "barzelletta", "riunione", "presentazione", "progetto", "sciarpa",
    "giacca", "cappotto", "vestito", "scarpe", "maglione", "camicia", "borsa", "lampada", "medicina_fach", "economia", "corso_obj", "universita_obj"].forEach((id) => { if (OGG[id]) OGG[id].selten = true; });
  /* Deutsche Einzahl bei italienischer Mehrzahl: gli occhiali → die Brille */
  OGGETTI.forEach((o) => { if (o.deSg) o.de.pl = false; });
  AGG.importante = AGG.importante || { id: "importante", it: "importante", de: "wichtig", level: "B1" };
  AGGETTIVI.push(AGG.importante);

  /* --- Wann? ---------------------------------------------------------
     grp bestimmt, zu welchen Zeitformen die Angabe passt (ZEIT_ZU_ZEITFORM).
     verb: steht im Verbblock (spesso, sempre, mai, già), sonst vorn.
     tz: Tageszeit — „stasera“ passt nicht zu „fare colazione“. */
  function T(id, it, de, grp, level, extra) { return Object.assign({ id, it, de, grp, level }, extra || {}); }
  const TEMPI = [
    T("adesso", "adesso", "jetzt", "jetzt", "A1"),
    T("oggi", "oggi", "heute", "heute", "A1"),
    T("stamattina", "stamattina", "heute Morgen", "stamattina", "A1", { tz: ["morgen"] }),
    T("oggi_pomeriggio", "oggi pomeriggio", "heute Nachmittag", "abend", "A2", { tz: ["nachmittag"] }),
    T("stasera", "stasera", "heute Abend", "abend", "A1", { tz: ["abend"] }),
    T("domani", "domani", "morgen", "zukunft", "A1"),
    T("domani_mattina", "domani mattina", "morgen früh", "zukunft", "A1", { tz: ["morgen"] }),
    T("domani_sera", "domani sera", "morgen Abend", "zukunft", "A1", { tz: ["abend"] }),
    T("dopodomani", "dopodomani", "übermorgen", "zukunft", "A2"),
    T("sabato", "sabato", "am Samstag", "samstag", "A1"),
    T("domenica", "domenica", "am Sonntag", "samstag", "A1"),
    T("fine_settimana", "il fine settimana", "am Wochenende", "wochenende", "A1"),
    T("prossima_settimana", "la prossima settimana", "nächste Woche", "zukunft", "A1"),
    T("mese_prossimo", "il mese prossimo", "nächsten Monat", "zukunft", "A2", { lang: true }),
    T("anno_prossimo", "l'anno prossimo", "nächstes Jahr", "zukunft", "A2", { lang: true }),
    T("fra_due_giorni", "fra due giorni", "in zwei Tagen", "zukunft", "A2"),
    T("prossima_estate", "la prossima estate", "nächsten Sommer", "zukunft", "B1", { lang: true }),
    T("ieri", "ieri", "gestern", "vergangen", "A1"),
    T("ieri_sera", "ieri sera", "gestern Abend", "vergangen", "A1", { tz: ["abend"] }),
    T("ieri_mattina", "ieri mattina", "gestern Morgen", "vergangen", "A1", { tz: ["morgen"] }),
    T("altro_ieri", "l'altro ieri", "vorgestern", "vergangen", "A2"),
    T("sabato_scorso", "sabato scorso", "letzten Samstag", "vergangen", "A1"),
    T("settimana_scorsa", "la settimana scorsa", "letzte Woche", "vergangen", "A1"),
    T("mese_scorso", "il mese scorso", "letzten Monat", "vergangen", "A2", { lang: true }),
    T("anno_scorso", "l'anno scorso", "letztes Jahr", "vergangen", "A1", { lang: true }),
    T("due_giorni_fa", "due giorni fa", "vor zwei Tagen", "vergangen", "A2"),
    T("estate_scorsa", "l'estate scorsa", "letzten Sommer", "vergangen", "A2", { lang: true }),
    T("ogni_giorno", "ogni giorno", "jeden Tag", "gewohnheit", "A1", { taeglich: true }),
    T("ogni_mattina", "ogni mattina", "jeden Morgen", "gewohnheit", "A1", { taeglich: true, tz: ["morgen"] }),
    T("ogni_sera", "ogni sera", "jeden Abend", "gewohnheit", "A1", { taeglich: true, tz: ["abend"] }),
    T("ogni_settimana", "ogni settimana", "jede Woche", "gewohnheit", "A2", { woechentlich: true }),
    T("il_sabato", "il sabato", "samstags", "gewohnheit", "A1", { woechentlich: true }),
    T("la_domenica", "la domenica", "sonntags", "gewohnheit", "A1", { woechentlich: true }),
    T("di_solito", "di solito", "normalerweise", "gewohnheit", "A2", { woechentlich: true }),
    T("qualche_volta", "qualche volta", "manchmal", "freqvorn", "A2"),
    T("d_estate", "d'estate", "im Sommer", "saison", "A2"),
    T("in_inverno", "in inverno", "im Winter", "saison", "A2"),
    T("spesso", "spesso", "oft", "freq", "A1", { verb: true }),
    T("sempre", "sempre", "immer", "freq", "A1", { verb: true }),
    T("mai", "mai", "nie", "mai", "A1", { verb: true }),
    T("gia", "già", "schon", "gia", "A2", { verb: true }),
    T("da_bambino", "da bambino", "als Kind", "kind", "A2", { agr: true }),
    T("alle_sette", "alle sette", "um sieben Uhr", "uhr", "A1", { tz: ["morgen", "abend"] }),
    T("alle_otto", "alle otto", "um acht Uhr", "uhr", "A1", { tz: ["morgen", "abend"] }),
    T("alle_nove", "alle nove", "um neun Uhr", "uhr", "A1", { tz: ["morgen", "abend"] }),
    T("all_una", "all'una", "um ein Uhr", "uhr", "A1", { tz: ["mittag"] }),
    T("mezzogiorno", "a mezzogiorno", "um zwölf Uhr", "uhr", "A1", { tz: ["mittag"] }),
    T("da_tre_anni", "da tre anni", "seit drei Jahren", "seit", "A2"),
    T("da_un_mese", "da un mese", "seit einem Monat", "seit", "A2"),
    T("per_tre_anni", "per tre anni", "drei Jahre lang", "dauerpast", "B1"),
    T("per_una_settimana", "per una settimana", "eine Woche lang", "dauerpast", "B1"),
    T("tutto_il_giorno", "tutto il giorno", "den ganzen Tag", "ganztag", "A2"),
  ];
  const TEMPO = {}; TEMPI.forEach((t) => { TEMPO[t.id] = t; });
  /* Welche Zeitangabe zu welcher Zeitform passt */
  const ZEIT_ZU_ZEITFORM = {
    jetzt: ["presente", "condizionale"],
    heute: ["presente", "passato", "futuro", "condizionale"],
    stamattina: ["presente", "passato"],
    abend: ["presente", "futuro", "condizionale"],
    zukunft: ["presente", "futuro", "condizionale"],
    samstag: ["presente", "futuro", "passato", "condizionale"],
    wochenende: ["presente", "futuro", "condizionale"],
    vergangen: ["passato", "imperfetto", "trapassato", "condPassato"],
    gewohnheit: ["presente", "imperfetto"],
    freqvorn: ["presente", "imperfetto"],
    saison: ["presente", "imperfetto"],
    freq: ["presente", "imperfetto", "passato"],
    mai: ["presente", "passato", "imperfetto", "futuro", "condizionale"],
    gia: ["passato", "trapassato"],
    kind: ["imperfetto"],
    uhr: ["presente", "passato", "futuro", "condizionale"],
    seit: ["presente"],
    dauerpast: ["passato"],
    ganztag: ["presente", "passato", "futuro"],
  };

  /* --- Wie? ----------------------------------------------------------
     pos: verb = direkt hinter dem Verb (mangio volentieri la pizza),
          ende = am Ende (vado al cinema da solo) */
  function M(id, it, de, pos, level, extra) { return Object.assign({ id, it, de, pos, level }, extra || {}); }
  const MODI = [
    M("volentieri", "volentieri", "gern", "verb", "A1"),
    M("bene", "bene", "gut", "verb", "A1"),
    M("male", "male", "schlecht", "verb", "A1"),
    M("meglio", "meglio", "besser", "verb", "B1"),
    M("molto", "molto", "viel", "verb", "A1"),
    M("poco", "poco", "wenig", "verb", "A1"),
    M("insieme", "insieme", "zusammen", "verb", "A1"),
    M("da_solo", "da solo", "allein", "ende", "A1", { agr: true }),
    M("con_calma", "con calma", "in Ruhe", "ende", "A2"),
    M("in_fretta", "in fretta", "schnell", "ende", "A2"),
    M("presto", "presto", "früh", "verb", "A1"),
    M("tardi", "tardi", "spät", "verb", "A1"),
    M("fino_tardi", "fino a tardi", "bis spät", "ende", "A2"),
    M("a_voce_alta", "a voce alta", "laut", "ende", "B1"),
    M("con_attenzione", "con attenzione", "genau", "ende", "B1"),
    M("con_carta", "con la carta", "mit Karte", "ende", "A2"),
    M("contanti", "in contanti", "bar", "ende", "A2"),
    M("al_telefono", "al telefono", "am Telefon", "ende", "A2"),
    M("in_italiano", "in italiano", "auf Italienisch", "ende", "A2"),
    M("in_tedesco", "in tedesco", "auf Deutsch", "ende", "A2"),
  ];
  const MODO = {}; MODI.forEach((m) => { MODO[m.id] = m; });

  /* --- Womit? (Verkehrsmittel) ------------------------------------- */
  const MEZZI = [
    { id: "piedi", it: "a piedi", de: "zu Fuß", keys: ["zu_fuss"], level: "A1" },
    { id: "bici", it: "in bici", de: "mit dem Fahrrad", keys: ["zu_fuss", "bici"], level: "A1" },
    { id: "autobus", it: "in autobus", de: "mit dem Bus", keys: ["bus", "oeffi"], level: "A1" },
    { id: "metro", it: "in metro", de: "mit der U-Bahn", keys: ["metro", "oeffi"], level: "A2" },
    { id: "taxi", it: "in taxi", de: "mit dem Taxi", keys: ["taxi"], level: "A2" },
    { id: "macchina", it: "in macchina", de: "mit dem Auto", keys: ["auto"], level: "A1" },
    { id: "treno", it: "in treno", de: "mit dem Zug", keys: ["treno", "oeffi"], level: "A1" },
    { id: "aereo", it: "in aereo", de: "mit dem Flugzeug", keys: ["flug"], level: "A1" },
  ];
  const MEZZO = {}; MEZZI.forEach((m) => { MEZZO[m.id] = m; });
  /* Welches Verkehrsmittel zu welchem Ort passt (kein „in aereo in cucina“) */
  function mezzoPasstZuOrt(mz, l) {
    if (!l) return true;
    const t = l.tags;
    const hat = (x) => t.includes(x);
    if (hat("raum") || hat("letto") || hat("privat") || hat("fahrzeug") || hat("chor") || hat("homeoffice")) return false;
    const id = mz.id;
    if (hat("fern")) return ["macchina", "treno", "aereo", "autobus"].includes(id);
    if (hat("weit")) return ["macchina", "treno", "autobus"].includes(id);
    if (id === "aereo") return false;
    if (hat("flughafen")) return ["autobus", "metro", "taxi", "macchina", "treno"].includes(id);
    if (hat("haltestelle")) return false;
    if (l.id === "stazione") return ["piedi", "bici", "autobus", "metro", "taxi", "macchina"].includes(id);
    if (id === "treno") return hat("arbeit") || l.id === "universita" || l.id === "nonni" || l.id === "casa";
    if (hat("nah") || l.id === "zoo") return ["piedi", "bici", "autobus", "macchina"].includes(id) && !(id === "autobus" && l.id === "bosco");
    return true;
  }

  /* --- Warum? Wann? Unter welcher Bedingung? -----------------------
     Ein Grund ist ein kleiner eigener Satz. Er steht hinter „perché“,
     vor „quindi“, hinter „se“ oder „quando“.
       pro      für welche Tätigkeiten er ein Grund ist, sie zu TUN
       contra   für welche er ein Grund ist, sie NICHT zu tun
       neg      darf verneint werden („non ho tempo“, „non piove“)
       wieder   wiederkehrend — passt zu „quando“ (immer wenn)
       zukunft  Form im Satz über die Zukunft: futuro (pioverà),
                presente (ho un appuntamento) oder gar nicht (sono stanco) */
  function G(id, level, it, de, pro, contra, extra) {
    return Object.assign({ id, level, it, de, pro: pro ? pro.split(" ") : [], contra: contra ? contra.split(" ") : [] }, extra || {});
  }
  const CAUSE = [
    G("stanco", "A1", { v: "essere", adj: "stanco" }, { s: "S", v: "sein", p: "müde", n: "nicht müde" },
      "ruhe insbett heim daheim taxi zst:stanco", "ausgehen sport fest lernen draussen", { neg: true, wieder: true }),
    G("fame", "A1", { v: "avere", rest: "fame" }, { s: "S", v: "haben", p: "Hunger", n: "keinen Hunger" },
      "essen", "", { neg: true, wieder: true }),
    G("sete", "A1", { v: "avere", rest: "sete" }, { s: "S", v: "haben", p: "Durst", n: "keinen Durst" },
      "trinken", "", { neg: true, wieder: true }),
    G("tempo", "A1", { v: "avere", rest: "tempo" }, { s: "S", v: "haben", p: "Zeit", n: "keine Zeit" },
      "ausgehen sport draussen sozial fest kultur reise", "", { neg: true, wieder: true, nurNegPerche: true, zukunft: "presente" }),
    G("piove", "A1", { v: "impers", f: { presente: "piove", imperfetto: "pioveva", futuro: "pioverà", congiuntivo: "piova", congImperfetto: "piovesse", congTrapassato: "avesse piovuto" } },
      { s: "es", v: "regnen" }, "daheim taxi auto bus metro schirm zst:triste", "draussen bad zu_fuss", { neg: true, wieder: true, zukunft: "futuro" }),
    G("bel_tempo", "A1", { v: "fare3", rest: "bel tempo" }, { s: "das Wetter", v: "sein", p: "schön", n: "nicht schön" },
      "draussen zu_fuss bad zst:contento zst:felice", "daheim", { neg: true, wieder: true, zukunft: "futuro" }),
    G("caldo", "A1", { v: "fare3", rest: "caldo" }, { s: "es", v: "sein", p: "heiß", n: "nicht heiß" },
      "bad eis erfrischung heizung_aus", "sport heizung", { neg: true, wieder: true, zukunft: "futuro" }),
    G("freddo", "A1", { v: "fare3", rest: "freddo" }, { s: "es", v: "sein", p: "kalt", n: "nicht kalt" },
      "daheim heizung heissgetraenk taxi", "bad draussen", { neg: true, wieder: true, zukunft: "futuro" }),
    G("malato", "A1", { v: "essere", adj: "malato" }, { s: "S", v: "sein", p: "krank", n: "nicht krank" },
      "arzt medizin daheim ruhe", "arbeit lernen sport ausgehen fest reise draussen", { negBedingung: true, wieder: true }),
    G("tardi", "A1", { v: "essere3v", rest: "tardi" }, { s: "es", v: "sein", p: "spät" },
      "heim insbett taxi", "ausgehen", {}),
    G("mal_testa", "A2", { v: "avere", rest: "mal di testa" }, { s: "S", v: "haben", p: "Kopfschmerzen", n: "keine Kopfschmerzen" },
      "medizin ruhe daheim arzt krank_fuehlen", "ausgehen fest sport musik", { neg: true, wieder: true }),
    G("mal_denti", "A2", { v: "avere", rest: "mal di denti" }, { s: "S", v: "haben", p: "Zahnschmerzen", n: "keine Zahnschmerzen" },
      "zahnarzt medizin", "essen", { wieder: true }),
    G("febbre", "A2", { v: "avere", rest: "la febbre" }, { s: "S", v: "haben", p: "Fieber", n: "kein Fieber" },
      "arzt medizin fieber daheim ruhe krank_fuehlen", "arbeit sport ausgehen lernen draussen fest", { negBedingung: true }),
    G("appuntamento", "A2", { v: "avere", rest: "un appuntamento" }, { s: "S", v: "haben", p: "einen Termin" },
      "arzt zahnarzt amt friseur", "", { zukunft: "presente" }),
    G("esame", "A2", { v: "avere", rest: "un esame" }, { s: "S", v: "haben", p: "eine Prüfung" },
      "lernen zst:nervoso zst:stressato", "ausgehen fest reise", { zukunft: "presente" }),
    G("compleanno", "A2", { v: "essere3v", rest: "il compleanno di Luca" }, { s: "Luca", v: "haben", p: "Geburtstag" },
      "fest geschenk kuchen", "", { zukunft: "presente" }),
    G("frigo_vuoto", "A2", { v: "essere3", subj: "il frigo", adj: "vuoto" }, { s: "der Kühlschrank", v: "sein", p: "leer" },
      "vorrat ausser_haus_essen", "", {}),
    G("ritardo", "A2", { v: "essere", fest: "in ritardo" }, { s: "S", v: "sein", p: "spät dran" },
      "taxi", "fruehstueck", {}),
    G("lavoro_molto", "A2", { v: "avere", rest: "molto lavoro" }, { s: "S", v: "haben", p: "viel Arbeit" },
      "arbeit buero_bleiben zst:stanco zst:stressato", "ausgehen reise fest sozial", { zukunft: "presente" }),
    G("vacanza", "A2", { v: "essere", fest: "in vacanza" }, { s: "S", v: "sein", p: "im Urlaub" },
      "draussen bad ausgehen urlaub zst:contento zst:felice gut_fuehlen", "arbeit", { zukunft: "presente" }),
    G("soldi_non", "A2", { v: "avere", rest: "soldi", fixNeg: true }, { s: "S", v: "haben", p: "kein Geld" },
      "daheim", "einkauf kleidung reise ausgehen taxi geschenk", {}),
    G("annoio", "B1", { v: "rifl", inf: "annoiare" }, { s: "S", v: "langweilen_sich" },
      "ausgehen sozial kultur", "", { wieder: true }),
    G("traffico", "B1", { v: "esserci", rest: "traffico" }, { s: "es", v: "geben_es", p: "viel Verkehr" },
      "metro treno zu_fuss zst:in_ritardo zst:nervoso", "auto taxi bus", { zukunft: "presente" }),
    G("sciopero", "B1", { v: "esserci", rest: "lo sciopero dei treni" }, { s: "die Bahn", v: "streiken" },
      "auto zst:in_ritardo", "treno", { zukunft: "futuro" }),
    G("saldi", "B1", { v: "esserci", rest: "i saldi", pl: true }, { s: "es", v: "geben_es", p: "Rabatte" },
      "kleidung stadt", "", { zukunft: "presente" }),
    G("festa", "B1", { v: "esserci", rest: "una festa" }, { s: "es", v: "geben_es", p: "eine Party" },
      "fest kleidung_kauf", "", { zukunft: "presente" }),
    G("influenza", "B1", { v: "avere", rest: "l'influenza" }, { s: "S", v: "haben", p: "Grippe", n: "keine Grippe" },
      "arzt medizin daheim ruhe krank_fuehlen", "arbeit lernen sport ausgehen fest", { negBedingung: true }),
    G("riunione", "B1", { v: "avere", rest: "una riunione" }, { s: "S", v: "haben", p: "eine Besprechung" },
      "arbeit buero_bleiben", "ausgehen sozial", { zukunft: "presente" }),
    G("fretta", "B1", { v: "avere", rest: "fretta" }, { s: "S", v: "haben", p: "es eilig" },
      "taxi", "fruehstueck ausser_haus_essen", {}),
    G("costa", "B1", { v: "costare" }, { s: "OBJ", v: "kosten", p: "zu viel" },
      "", "kaufen_obj", {}),
  ];
  const CAUSA = {}; CAUSE.forEach((c) => { CAUSA[c.id] = c; });
  /* Gründe, aus denen man etwas WILL — nicht MUSS („Mi annoio, quindi devo …“ klingt schief) */
  ["annoio", "bel_tempo", "caldo", "tempo", "vacanza", "saldi", "festa"].forEach((id) => { CAUSA[id].wunsch = true; });

  /* Zustände für „essere + Adjektiv“ */
  const STATI = [
    { id: "stanco", it: "stanco", de: "müde", level: "A1" },
    { id: "contento", it: "contento", de: "froh", level: "A1" },
    { id: "felice", it: "felice", de: "glücklich", level: "A1" },
    { id: "triste", it: "triste", de: "traurig", level: "A1" },
    { id: "malato", it: "malato", de: "krank", level: "A1" },
    { id: "nervoso", it: "nervoso", de: "nervös", level: "A2" },
    { id: "occupato", it: "occupato", de: "beschäftigt", level: "A2" },
    { id: "pronto", it: "pronto", de: "fertig", level: "A1" },
    { id: "stressato", it: "stressato", de: "gestresst", level: "B1" },
    { id: "arrabbiato", it: "arrabbiato", de: "sauer", level: "B1" },
    { id: "preoccupato", it: "preoccupato", de: "besorgt", level: "B1" },
    { id: "curioso", it: "curioso", de: "neugierig", level: "B1" },
    { id: "in_ritardo", it: "in ritardo", de: "spät dran", level: "A2", fest: true },
    { id: "in_vacanza", it: "in vacanza", de: "im Urlaub", level: "A2", fest: true },
    { id: "soddisfatto", it: "soddisfatto", de: "zufrieden", level: "B2" },
    { id: "deluso", it: "deluso", de: "enttäuscht", level: "B2" },
  ];
  const STATO = {}; STATI.forEach((s) => { STATO[s.id] = s; });

  /* --- Unregelmäßige Verben (Formen von Hand) ------------------------ */
  const C = {
    andare: { inf: "andare", pres: ["vado", "vai", "va", "andiamo", "andate", "vanno"], fut: "andr",
      cong: ["vada", "vada", "vada", "andiamo", "andiate", "vadano"], aux: "essere" },
    venire: { inf: "venire", pres: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], fut: "verr",
      cong: ["venga", "venga", "venga", "veniamo", "veniate", "vengano"], part: "venuto", aux: "essere" },
    fare: { inf: "fare", pres: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"], fut: "far", impStamm: "face",
      cong: ["faccia", "faccia", "faccia", "facciamo", "facciate", "facciano"], congImpStamm: "face", part: "fatto" },
    dare: { inf: "dare", pres: ["do", "dai", "dà", "diamo", "date", "danno"], fut: "dar",
      cong: ["dia", "dia", "dia", "diamo", "diate", "diano"], congImpStamm: "de", part: "dato" },
    uscire: { inf: "uscire", pres: ["esco", "esci", "esce", "usciamo", "uscite", "escono"],
      cong: ["esca", "esca", "esca", "usciamo", "usciate", "escano"], aux: "essere" },
    bere: { inf: "bere", pres: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"], fut: "berr", impStamm: "beve",
      cong: ["beva", "beva", "beva", "beviamo", "beviate", "bevano"], congImpStamm: "beve", part: "bevuto" },
    scegliere: { inf: "scegliere", pres: ["scelgo", "scegli", "sceglie", "scegliamo", "scegliete", "scelgono"],
      cong: ["scelga", "scelga", "scelga", "scegliamo", "scegliate", "scelgano"], part: "scelto" },
    spegnere: { inf: "spegnere", pres: ["spengo", "spegni", "spegne", "spegniamo", "spegnete", "spengono"],
      cong: ["spenga", "spenga", "spenga", "spegniamo", "spegniate", "spengano"], part: "spento" },
    sedere: { inf: "sedere", rifl: true, pres: ["siedo", "siedi", "siede", "sediamo", "sedete", "siedono"],
      cong: ["sieda", "sieda", "sieda", "sediamo", "sediate", "siedano"], part: "seduto" },
    tradurre: { inf: "tradurre", pres: ["traduco", "traduci", "traduce", "traduciamo", "traducete", "traducono"], fut: "tradurr",
      impStamm: "traduce", cong: ["traduca", "traduca", "traduca", "traduciamo", "traduciate", "traducano"], congImpStamm: "traduce", part: "tradotto" },
    vedere: { inf: "vedere", fut: "vedr", part: "visto" },
    potere: { inf: "potere", pres: ["posso", "puoi", "può", "possiamo", "potete", "possono"], fut: "potr",
      cong: ["possa", "possa", "possa", "possiamo", "possiate", "possano"], part: "potuto" },
    dovere: { inf: "dovere", pres: ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"], fut: "dovr",
      cong: ["debba", "debba", "debba", "dobbiamo", "dobbiate", "debbano"], part: "dovuto" },
    volere: { inf: "volere", pres: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"], fut: "vorr",
      cong: ["voglia", "voglia", "voglia", "vogliamo", "vogliate", "vogliano"], part: "voluto" },
    sapere: { inf: "sapere", pres: ["so", "sai", "sa", "sappiamo", "sapete", "sanno"], fut: "sapr",
      cong: ["sappia", "sappia", "sappia", "sappiamo", "sappiate", "sappiano"], part: "saputo" },
    essere: ESSERE, avere: AVERE,
  };
  function R(inf, extra) { return Object.assign({ inf }, extra || {}); }   // regelmäßig (evtl. mit eigenem Partizip)

  /* --- Modalverben ---------------------------------------------------- */
  const MODALI = [
    { id: "potere", it: "potere", v: C.potere, de: "koennen", level: "A1", zeiten: ["presente", "passato", "imperfetto", "futuro", "condizionale"] },
    { id: "dovere", it: "dovere", v: C.dovere, de: "muessen", level: "A1", zeiten: ["presente", "passato", "imperfetto", "futuro", "condizionale"] },
    { id: "volere", it: "volere", v: C.volere, de: "wollen", level: "A1", zeiten: ["presente", "imperfetto", "condizionale"] },
    { id: "vorrei", it: "vorrei", v: C.volere, de: "moechten", level: "A1", zeiten: ["presente"], festCond: true },
    { id: "sapere", it: "sapere", v: C.sapere, de: "koennen", level: "A2", zeiten: ["presente", "imperfetto"] },
  ];
  const MODALE = {}; MODALI.forEach((m) => { MODALE[m.id] = m; });

  /* --- Die Verben -------------------------------------------------------
     Jedes Verb sagt selbst, was zu ihm passt. Was hier nicht steht, wird
     nicht angeboten — so entsteht kein „mangio le chiavi“. */
  const FAM = "fam freunde partner name";
  const ALLE_ORTE_MOTO = LUOGHI.filter((l) => !["divano", "tavola", "in_treno", "in_macchina", "sull_autobus", "coro", "doccia", "da_casa_ho"].includes(l.id)).map((l) => l.id);
  const FERN = orteMit("fern");
  const SACHEN = ["chiavi", "portafoglio", "telefono", "occhiali", "ombrello", "passaporto", "carta_identita"];
  const LEBENSMITTEL = ["pane", "pasta", "spaghetti", "frutta", "verdura", "mele", "formaggio", "pesce", "carne", "uova", "biscotti", "cioccolato", "latte", "acqua", "vino", "birra", "succo", "caffe", "te", "torta", "gelato"];
  const KLEIDUNG = ["giacca", "vestito", "scarpe", "maglione", "cappotto", "camicia", "borsa", "sciarpa"];
  const LESESTOFF = ["libro", "giornale", "rivista", "romanzo", "fumetto"];
  function V(d) { return Object.assign({ modi: [], modali: [], habit: "ja", comp: false, mezzo: false }, d); }
  function deAndare(w) {
    if (w.mezzo === "aereo") return "fliegen";
    if (w.mezzo === "piedi") return "gehen";
    if (w.mezzo) return "fahren";
    const l = LUOGO[w.luogo];
    if (l && (l.tags.includes("fern") || l.tags.includes("weit") || l.tags.includes("flughafen"))) return "fahren";
    return "gehen";
  }
  const VERBI = [
    /* ---------- Unterwegs ---------- */
    V({ id: "andare", it: "andare", v: C.andare, de: deAndare, level: "A1", kat: "alltag freizeit reisen einkaufen arbeit bildung gesundheit verwaltung essen familie",
      ort: { moto: ALLE_ORTE_MOTO }, ortPflicht: true, mezzo: true, comp: FAM + " kollegen", modi: ["volentieri", "da_solo", "insieme", "presto", "tardi"],
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true }),
    V({ id: "tornare", it: "tornare", v: R("tornare", { aux: "essere" }), level: "A1", kat: "alltag reisen arbeit bildung familie",
      de: (w) => w.rolle === "da" ? "zurueckkommen" : (w.luogo === "casa" ? deAndare(w) : "zurueck" + deAndare(w)),
      ort: { moto: ["casa", "ufficio", "lavoro", "scuola", "universita", "albergo", "mare", "montagna", "lago", "campagna", "nonni"].concat(FERN),
        da: ["lavoro", "ufficio", "scuola", "universita", "palestra", "piscina", "supermercato", "mercato", "cinema", "teatro", "ristorante", "bar", "pizzeria",
          "medico", "dentista", "ospedale", "mare", "montagna", "lago", "campagna", "nonni", "da_marco", "festa", "discoteca", "biblioteca", "parco",
          "spiaggia", "centro", "stazione", "aeroporto", "banca", "posta", "corso"].concat(FERN) },
      ortPflicht: true, mezzo: true, comp: FAM + " kollegen", modi: ["presto", "tardi", "da_solo", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"],
      punkt: true, kind: true }),
    V({ id: "venire", it: "venire", v: C.venire, de: "kommen", level: "A1", kat: "alltag reisen",
      ort: { da: ["casa", "lavoro", "ufficio", "scuola", "universita", "palestra", "piscina", "supermercato", "mercato", "cinema", "ristorante", "bar",
        "medico", "dentista", "nonni", "da_marco", "festa", "biblioteca", "centro", "stazione", "aeroporto", "corso"].concat(FERN) },
      ortPflicht: true, mezzo: true, comp: FAM, habit: "nein", punkt: true }),
    V({ id: "uscire", it: "uscire", v: C.uscire, level: "A1", kat: "freizeit alltag familie",
      de: (w) => w.luogo ? "gehen" : "ausgehen", deOrt: { casa: "aus dem Haus", ufficio: "aus dem Büro" },
      ort: { da: ["casa", "ufficio"] }, itDa: { casa: "di casa" }, comp: FAM + " kollegen", modi: ["presto", "tardi", "da_solo", "insieme"],
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true, keys: (w) => w.luogo ? ["draussen"] : ["ausgehen", "draussen"] }),
    V({ id: "partire", it: "partire", v: R("partire", { aux: "essere" }), de: "abreisen", level: "A2", kat: "reisen",
      ort: { per: FERN }, mezzo: true, comp: FAM, modi: ["presto", "tardi"], modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein", punkt: true, keys: ["reise"] }),
    V({ id: "arrivare", it: "arrivare", v: R("arrivare", { aux: "essere" }), de: "ankommen", deRolle: { moto: "wo" }, level: "A1", kat: "reisen arbeit alltag",
      ort: { moto: ["casa", "ufficio", "lavoro", "scuola", "universita", "stazione", "aeroporto", "albergo", "festa", "cinema", "ristorante"].concat(FERN) },
      mezzo: true, comp: FAM + " kollegen", modi: ["presto", "tardi"], modali: ["potere", "dovere"], punkt: true }),
    V({ id: "restare", it: "restare", v: R("restare", { aux: "essere" }), de: "bleiben", level: "A1", kat: "alltag freizeit arbeit gesundheit reisen",
      ort: { stato: ["casa", "letto", "ufficio", "albergo", "mare", "montagna", "lago", "campagna", "citta", "nonni", "da_marco", "giardino"].concat(FERN) },
      ortPflicht: true, comp: FAM, modi: ["da_solo", "volentieri", "fino_tardi"], modali: ["potere", "dovere", "volere", "vorrei"], dauer: true, kind: true }),
    V({ id: "essere_luogo", it: "essere", name: "essere (wo?)", v: ESSERE, de: "sein", level: "A1", kat: "alltag freizeit reisen arbeit bildung gesundheit einkaufen essen familie verwaltung",
      ort: { stato: ["casa", "cucina", "giardino", "ufficio", "lavoro", "scuola", "universita", "biblioteca", "palestra", "piscina", "cinema", "teatro", "museo",
        "concerto", "ristorante", "bar", "pizzeria", "parco", "mare", "montagna", "lago", "campagna", "spiaggia", "citta", "centro", "stazione", "aeroporto",
        "albergo", "medico", "dentista", "ospedale", "nonni", "da_marco", "festa", "discoteca", "supermercato", "mercato", "banca", "posta", "zoo", "stadio",
        "letto", "corso"].concat(FERN) },
      ortPflicht: true, comp: FAM + " kollegen", modi: ["da_solo"], modali: ["potere", "dovere", "vorrei"], punkt: true, dauer: true, zustand: true, kind: true, keinCond: true }),
    V({ id: "abitare", it: "abitare", v: R("abitare"), de: "wohnen", level: "A1", kat: "alltag familie reisen",
      ort: { stato: ["centro", "citta", "campagna", "montagna", "mare", "nonni"].concat(FERN) }, einsVon: ["luogo", "modo", "compagnia"],
      comp: "fam freunde partner name", deCompZusammen: true, modi: ["da_solo"], modali: ["volere", "vorrei", "potere"], habit: "nein", dauer: true, zustand: true, kind: true, keys: ["wohnen"] }),
    V({ id: "viaggiare", it: "viaggiare", v: R("viaggiare"), de: "reisen", level: "A2", kat: "reisen freizeit",
      mezzo: true, mezziNur: ["treno", "macchina", "aereo", "autobus", "bici"], comp: FAM, modi: ["volentieri", "da_solo", "molto", "poco"],
      modali: ["potere", "volere", "vorrei"], einsVon: ["mezzo", "modo", "compagnia", "quando"], keys: ["reise"] }),
    V({ id: "passeggiata", it: "fare una passeggiata", v: C.fare, fest: "una passeggiata", de: "spazierengehen", level: "A1", kat: "freizeit alltag familie",
      ort: { stato: ["parco", "spiaggia", "centro", "bosco", "montagna", "lago", "campagna", "mare", "citta"] },
      comp: FAM + " cane", modi: ["volentieri", "da_solo", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true, keys: ["draussen", "zu_fuss"] }),
    /* ---------- Morgens und abends ---------- */
    V({ id: "alzarsi", it: "alzarsi", v: R("alzare", { rifl: true }), de: "aufstehen", level: "A1", kat: "alltag",
      modi: ["presto", "tardi"], modali: ["dovere", "volere", "potere"], punkt: true, tz: ["morgen"], kind: true, keys: ["aufstehen"] }),
    V({ id: "svegliarsi", it: "svegliarsi", v: R("svegliare", { rifl: true }), de: "aufwachen", level: "A1", kat: "alltag",
      modi: ["presto", "tardi"], modali: ["dovere"], punkt: true, tz: ["morgen"], kind: true, keys: ["aufstehen"] }),
    V({ id: "lavarsi", it: "lavarsi", v: R("lavare", { rifl: true }), level: "A1", kat: "alltag gesundheit",
      de: (w) => w.oggetto === "denti" ? "putzen_sich_d" : (w.oggetto ? "waschen_sich_d" : "waschen_sich"),
      obj: ["denti", "mani", "capelli"], ort: { stato: ["bagno"] }, modi: ["in_fretta"], modali: ["dovere"], punkt: true, kind: true, keys: ["koerperpflege"] }),
    V({ id: "vestirsi", it: "vestirsi", v: R("vestire", { rifl: true }), de: "anziehen_sich", level: "A1", kat: "alltag",
      ort: { stato: ["camera", "bagno"] }, modi: ["in_fretta", "con_calma"], modali: ["dovere"], punkt: true, kind: true, keys: ["anziehen"] }),
    V({ id: "fare_doccia", it: "fare la doccia", v: C.fare, fest: "la doccia", de: "duschen", level: "A1", kat: "alltag gesundheit",
      ort: { stato: ["palestra", "casa"] }, modi: ["in_fretta"], modali: ["dovere", "volere", "vorrei"], punkt: true, keys: ["duschen"] }),
    V({ id: "riposarsi", it: "riposarsi", v: R("riposare", { rifl: true }), de: "ausruhen_sich", level: "A2", kat: "alltag gesundheit freizeit",
      ort: { stato: ["casa", "divano", "giardino", "spiaggia", "camera"] }, modali: ["dovere", "volere", "vorrei", "potere"], dauer: true, keys: ["ruhe"] }),
    V({ id: "addormentarsi", it: "addormentarsi", v: R("addormentare", { rifl: true }), de: "einschlafen", level: "A2", kat: "alltag",
      ort: { stato: ["divano"] }, modi: ["presto", "tardi"], tz: ["abend"], kind: true, keys: ["ruhe", "insbett"] }),
    V({ id: "dormire", it: "dormire", v: R("dormire"), de: "schlafen", level: "A1", kat: "alltag gesundheit",
      ort: { stato: ["casa", "divano", "albergo", "nonni", "da_marco"] }, modi: ["bene", "male", "molto", "poco", "fino_tardi"],
      modali: ["potere", "dovere", "volere", "vorrei"], dauer: true, kind: true, keys: ["ruhe"] }),
    V({ id: "divertirsi", it: "divertirsi", v: R("divertire", { rifl: true }), de: "amuesieren_sich", level: "A2", kat: "freizeit",
      ort: { stato: ["festa", "discoteca", "mare", "parco", "spiaggia", "concerto", "da_marco", "montagna"] }, comp: FAM,
      modi: ["molto"], deModo: { molto: "sehr" }, modali: ["volere", "vorrei"], habit: "freq", kind: true, keys: ["ausgehen"] }),
    V({ id: "sentirsi", it: "sentirsi", v: R("sentire", { rifl: true }), de: "fuehlen_sich", level: "A2", kat: "gesundheit",
      modi: ["bene", "male", "meglio"], modoPflicht: true, habit: "nein", zustand: true,
      keys: (w) => w.modo === "male" ? ["krank_fuehlen"] : ["gut_fuehlen"] }),
    V({ id: "annoiarsi", it: "annoiarsi", v: R("annoiare", { rifl: true }), de: "langweilen_sich", level: "B1", kat: "freizeit",
      ort: { stato: ["casa"] }, modi: ["molto"], deModo: { molto: "sehr" }, habit: "freq", zustand: true, keys: ["langweile"] }),
    V({ id: "sedersi", it: "sedersi", v: C.sedere, de: "setzen_sich", deRolle: { moto: "wohin" }, level: "B1", kat: "alltag",
      ort: { moto: ["divano", "tavola", "giardino", "terrazza"] }, ortPflicht: true, comp: FAM, modali: ["potere"], habit: "nein", keys: ["ruhe_kurz"] }),
    V({ id: "trasferirsi", it: "trasferirsi", v: R("trasferire", { isc: true, rifl: true }), de: "umziehen", level: "B1", kat: "reisen familie arbeit",
      ort: { moto: ["centro", "campagna", "citta"].concat(FERN) }, ortPflicht: true, comp: "fam partner", modali: ["volere", "vorrei", "dovere"], habit: "nein", keys: ["umzug"] }),
    V({ id: "prepararsi", it: "prepararsi", v: R("preparare", { rifl: true }), de: "vorbereiten_sich", level: "B1", kat: "bildung arbeit reisen",
      obj: ["esame", "viaggio", "festa_obj", "presentazione"], objPflicht: true, objPraep: "per", deObjPraep: "auf", dets: ["def"],
      modi: ["con_calma", "in_fretta"], modali: ["dovere", "volere"], habit: "nein",
      keys: (w) => w.oggetto === "esame" ? ["lernen"] : ["vorbereitung"] }),
    /* ---------- Essen und Trinken ---------- */
    V({ id: "mangiare", it: "mangiare", v: R("mangiare"), de: "essen", level: "A1", kat: "essen alltag familie freizeit",
      obj: ["pizza", "pasta", "spaghetti", "pane", "panino", "cornetto", "gelato", "torta", "insalata", "zuppa", "risotto", "lasagne", "frutta", "verdura",
        "mela", "formaggio", "pesce", "carne", "uova", "biscotti", "cioccolato"],
      ort: { stato: ["casa", "cucina", "giardino", "terrazza", "ristorante", "pizzeria", "bar", "gelateria", "mensa", "ufficio", "parco", "spiaggia", "nonni", "da_marco"] },
      ortObj: {
        bar: ["cornetto", "panino", "torta"], pizzeria: ["pizza", "insalata"], gelateria: ["gelato"],
        ristorante: ["pasta", "spaghetti", "pesce", "carne", "insalata", "zuppa", "risotto", "lasagne", "pizza", "torta"],
        mensa: ["pasta", "spaghetti", "pesce", "carne", "insalata", "zuppa", "frutta", "verdura", "risotto", "mela"],
        parco: ["panino", "gelato", "frutta", "mela", "pizza"], spiaggia: ["panino", "gelato", "frutta", "mela", "pizza"],
        ufficio: ["panino", "insalata", "mela", "frutta", "biscotti", "cornetto", "pizza", "torta"] },
      comp: FAM + " kollegen", modi: ["volentieri", "con_calma", "in_fretta", "molto", "poco", "da_solo", "insieme"],
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true, keys: ["essen"] }),
    V({ id: "bere", it: "bere", v: C.bere, de: "trinken", level: "A1", kat: "essen alltag freizeit",
      obj: ["caffe", "cappuccino", "te", "acqua", "succo", "vino", "birra", "latte"],
      ort: { stato: ["casa", "cucina", "terrazza", "bar", "ristorante", "pizzeria", "ufficio", "nonni", "da_marco", "festa"] },
      ortObj: { bar: ["caffe", "cappuccino", "te", "acqua", "succo", "birra", "vino"], ristorante: ["acqua", "vino", "birra", "caffe"],
        pizzeria: ["birra", "acqua", "vino"], ufficio: ["caffe", "te", "acqua", "cappuccino"], festa: ["birra", "vino", "acqua", "succo"] },
      objPflicht: true, comp: FAM + " kollegen", modi: ["volentieri", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true, keys: ["trinken"] }),
    V({ id: "cucinare", it: "cucinare", v: R("cucinare"), de: "kochen", level: "A1", kat: "essen alltag familie",
      obj: ["pasta", "spaghetti", "zuppa", "risotto", "pesce", "carne", "verdura", "lasagne"], dets: ["def", "indef"],
      ort: { stato: ["casa", "cucina", "nonni", "da_marco"] }, comp: FAM, modi: ["volentieri", "bene", "con_calma", "insieme"],
      modali: ["potere", "dovere", "volere", "vorrei", "sapere"], punkt: true, keys: ["essen", "kochen"] }),
    V({ id: "preparare", it: "preparare", v: R("preparare"), level: "A1", kat: "essen alltag familie",
      de: (w) => w.oggetto === "torta" ? "backen" : "machen",
      obj: ["cena", "pranzo", "colazione", "torta", "insalata", "panino", "caffe", "te"], objPflicht: true, dets: ["def", "indef"],
      ort: { stato: ["casa", "cucina", "nonni"] }, comp: FAM, modi: ["in_fretta", "volentieri", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"],
      punkt: true, keys: (w) => w.oggetto === "torta" ? ["kuchen", "backen"] : (["caffe", "te"].includes(w.oggetto) ? ["heissgetraenk"] : ["essen", "kochen"]) }),
    V({ id: "ordinare", it: "ordinare", v: R("ordinare"), de: "bestellen", level: "A2", kat: "essen freizeit",
      obj: ["pizza", "pasta", "spaghetti", "risotto", "pesce", "insalata", "zuppa", "acqua", "vino", "birra", "torta", "caffe", "cappuccino", "te", "cornetto", "succo", "panino"],
      objPflicht: true, dets: ["indef", "def"],
      ort: { stato: ["ristorante", "pizzeria", "bar"] },
      ortObj: { ristorante: ["pizza", "pasta", "spaghetti", "risotto", "pesce", "insalata", "zuppa", "acqua", "vino", "birra", "torta", "caffe"],
        pizzeria: ["pizza", "birra", "acqua", "insalata"], bar: ["caffe", "cappuccino", "te", "cornetto", "succo", "birra", "acqua", "panino"] },
      comp: FAM, modali: ["potere", "volere", "vorrei"], punkt: true,
      keys: (w) => (!w.luogo && w.oggetto === "pizza") ? ["essen", "ausser_haus_essen"] : ["essen_bestellen"] }),
    V({ id: "fare_colazione", it: "fare colazione", v: C.fare, fest: "colazione", de: "fruehstuecken", level: "A1", kat: "essen alltag",
      ort: { stato: ["casa", "cucina", "bar", "albergo", "terrazza"] }, comp: FAM, modi: ["con_calma", "in_fretta", "presto", "tardi", "insieme"],
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, tz: ["morgen"], kind: true, keys: ["essen", "fruehstueck"] }),
    V({ id: "pranzare", it: "pranzare", v: R("pranzare"), de: "mittagessen", level: "A2", kat: "essen arbeit",
      ort: { stato: ["casa", "mensa", "ristorante", "pizzeria", "bar", "ufficio", "nonni"] }, comp: FAM + " kollegen", modi: ["in_fretta", "con_calma", "insieme"],
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, tz: ["mittag"], keys: ["essen"] }),
    V({ id: "cenare", it: "cenare", v: R("cenare"), de: "abendessen", level: "A2", kat: "essen familie freizeit",
      ort: { stato: ["casa", "ristorante", "pizzeria", "nonni", "da_marco", "terrazza"] }, comp: FAM, modi: ["tardi", "presto", "insieme"],
      modali: ["potere", "volere", "vorrei"], punkt: true, tz: ["abend"],
      keys: (w) => (w.luogo === "ristorante" || w.luogo === "pizzeria") ? ["essen", "ausser_haus_essen", "ausgehen"] : ["essen"] }),
    V({ id: "assaggiare", it: "assaggiare", v: R("assaggiare"), de: "probieren", level: "B1", kat: "essen",
      obj: ["vino", "torta", "formaggio", "risotto", "gelato", "zuppa"], objPflicht: true, dets: ["def", "indef"], modali: ["potere", "volere", "vorrei", "dovere"],
      habit: "nein", keys: ["essen"] }),
    V({ id: "pagare", it: "pagare", v: R("pagare"), de: "bezahlen", level: "A1", kat: "einkaufen essen verwaltung",
      obj: ["conto", "affitto", "bolletta", "caffe", "biglietto"], objPflicht: true, dets: ["def"],
      ort: { stato: ["bar", "ristorante", "pizzeria", "posta", "banca"] },
      ortObj: { bar: ["conto", "caffe"], ristorante: ["conto"], pizzeria: ["conto"], posta: ["bolletta"], banca: ["affitto", "bolletta"] },
      modi: ["con_carta", "contanti"], modali: ["potere", "dovere", "volere", "vorrei"], habit: "freq", keys: ["bezahlen"],
      zeitNur: ["jetzt", "heute", "vergangen", "freq", "mai", "gewohnheit", "uhr"] }),
    /* ---------- Einkaufen ---------- */
    V({ id: "comprare", it: "comprare", v: R("comprare"), de: "kaufen", level: "A1", kat: "einkaufen alltag",
      obj: LEBENSMITTEL.concat(KLEIDUNG, LESESTOFF, ["cornetto", "regalo", "fiori", "profumo", "orologio", "biglietto", "telefono", "macchina", "bici", "appartamento", "medicina"]),
      objPflicht: true, dets: ["indef", "part", "def"],
      ort: { stato: ["supermercato", "mercato", "panetteria", "macelleria", "farmacia", "libreria", "negozio", "centro_commerciale", "centro", "stazione", "gelateria"] },
      ortObj: {
        supermercato: LEBENSMITTEL.concat(["fiori"]), mercato: ["frutta", "verdura", "mele", "formaggio", "pesce", "carne", "uova", "fiori", "pane"],
        panetteria: ["pane", "cornetto", "torta", "biscotti"], macelleria: ["carne"], farmacia: ["medicina"], libreria: ["libro", "rivista", "romanzo", "fumetto"],
        negozio: KLEIDUNG, centro_commerciale: KLEIDUNG.concat(["telefono", "profumo", "regalo", "orologio", "libro"]),
        centro: KLEIDUNG.concat(["regalo", "fiori", "libro", "telefono", "profumo", "orologio"]), stazione: ["biglietto", "giornale", "rivista"], gelateria: ["gelato"] },
      comp: FAM, modali: ["potere", "dovere", "volere", "vorrei"], kind: true,
      keys: (w) => {
        const o = OGG[w.oggetto], k = ["einkauf", "kaufen_obj"];
        if (!o) return k;
        if (o.tags.includes("essen") || o.tags.includes("trinken")) k.push("vorrat");
        if (o.tags.includes("kleidung")) k.push("kleidung");
        if (o.tags.includes("geschenk")) k.push("geschenk");
        if (o.tags.includes("kuchen")) k.push("kuchen");
        if (o.tags.includes("eis")) k.push("eis");
        if (o.tags.includes("erfrischung")) k.push("erfrischung");
        if (o.id === "medicina") k.push("medizin");
        return k;
      } }),
    V({ id: "fare_spesa", it: "fare la spesa", v: C.fare, fest: "la spesa", de: "einkaufen", level: "A1", kat: "einkaufen alltag familie",
      ort: { stato: ["supermercato", "mercato"] }, comp: FAM, modi: ["da_solo", "in_fretta", "con_calma", "insieme"], modali: ["potere", "dovere", "volere"],
      punkt: true, keys: ["einkauf", "vorrat"] }),
    V({ id: "cercare", it: "cercare", v: R("cercare"), de: "suchen", level: "A1", kat: "alltag arbeit einkaufen",
      obj: SACHEN.concat(["lavoro_nomen", "appartamento", "regalo"]), objPflicht: true, possOk: true, besitz: true,
      ort: { stato: ["casa", "camera", "ufficio", "in_macchina", "centro", "citta"].concat(FERN) },
      ortObj: { casa: SACHEN, camera: SACHEN, ufficio: SACHEN, in_macchina: SACHEN, centro: ["appartamento", "lavoro_nomen", "regalo"], citta: ["appartamento", "lavoro_nomen"] },
      ortObjFern: ["appartamento", "lavoro_nomen"], modali: ["dovere", "volere"], habit: "freq",
      keys: (w) => w.oggetto === "regalo" ? ["geschenk"] : ["suche"] }),
    V({ id: "scegliere", it: "scegliere", v: C.scegliere, de: "aussuchen", level: "B1", kat: "einkaufen",
      obj: ["regalo", "vestito", "vino", "libro", "film", "giacca", "scarpe"], objPflicht: true, dets: ["indef", "def"], modi: ["con_calma"],
      modali: ["potere", "dovere", "volere"], habit: "nein", keys: ["einkauf"] }),
    V({ id: "provare", it: "provare", v: R("provare"), de: "anprobieren", level: "A2", kat: "einkaufen",
      obj: KLEIDUNG.filter((x) => x !== "borsa"), objPflicht: true, dets: ["indef", "def"], ort: { stato: ["negozio", "centro_commerciale"] },
      modali: ["potere", "volere", "vorrei"], habit: "nein", keys: ["kleidung"] }),
    V({ id: "vendere", it: "vendere", v: R("vendere"), de: "verkaufen", level: "A2", kat: "einkaufen alltag",
      obj: ["macchina", "bici", "libro", "telefono", "appartamento"], objPflicht: true, possOk: true, dets: ["poss", "def", "indef"],
      modali: ["volere", "dovere", "vorrei"], habit: "nein", keys: ["verkauf"] }),
    /* ---------- Arbeit ---------- */
    V({ id: "lavorare", it: "lavorare", v: R("lavorare"), de: "arbeiten", level: "A1", kat: "arbeit",
      ort: { stato: ["ufficio", "da_casa_ho", "banca", "ospedale", "scuola", "universita", "ristorante", "bar", "supermercato", "farmacia", "biblioteca",
        "albergo", "aeroporto", "stazione", "comune", "negozio", "giardino"].concat(FERN) },
      comp: "kollegen fam name", modi: ["molto", "poco", "volentieri", "fino_tardi"], modali: ["potere", "dovere", "volere"], dauer: true,
      keys: (w) => w.luogo === "giardino" ? ["garten"] : ["arbeit"] }),
    V({ id: "scrivere", it: "scrivere", v: R("scrivere", { part: "scritto" }), de: "schreiben", level: "A1", kat: "arbeit familie bildung alltag",
      obj: ["lettera", "email", "messaggio", "cartolina", "poesia", "rapporto"], dets: ["indef", "def"],
      pers: { typ: "a", tags: "fam freunde partner name kollegen" }, persObj: { cartolina: "fam freunde partner name", lettera: "fam freunde partner name", poesia: "", rapporto: "" },
      ort: { stato: ["casa", "ufficio", "biblioteca", "bar"] }, ortObj: { ufficio: ["email", "lettera", "messaggio", "rapporto"], bar: ["cartolina", "messaggio", "lettera", "email"] },
      einsVon: ["oggetto", "persona"], modi: ["in_italiano", "in_tedesco", "con_calma"], modali: ["potere", "dovere", "volere", "vorrei"], kind: true,
      keys: (w) => w.persona ? ["schreiben", "sozial"] : ["schreiben"] }),
    V({ id: "leggere", it: "leggere", v: R("leggere", { part: "letto" }), de: "lesen", level: "A1", kat: "freizeit bildung arbeit alltag",
      obj: LESESTOFF.concat(["lettera", "email", "messaggio", "documenti", "rapporto"]), dets: ["indef", "def"],
      ort: { stato: ["casa", "soggiorno", "letto", "divano", "biblioteca", "giardino", "parco", "spiaggia", "bar", "in_treno", "ufficio"] },
      ortObj: { ufficio: ["email", "documenti", "rapporto", "giornale", "lettera", "messaggio"], in_treno: LESESTOFF, bar: ["giornale", "rivista", "libro"],
        biblioteca: ["libro", "rivista", "romanzo", "giornale"], letto: LESESTOFF, divano: LESESTOFF, parco: LESESTOFF, spiaggia: LESESTOFF, giardino: LESESTOFF, soggiorno: LESESTOFF },
      modi: ["volentieri", "molto", "poco", "a_voce_alta", "con_attenzione", "con_calma"], modali: ["potere", "dovere", "volere", "vorrei"], dauer: true, kind: true, keys: ["lesen"] }),
    V({ id: "telefonare", it: "telefonare", v: R("telefonare"), level: "A1", kat: "familie arbeit alltag gesundheit",
      de: (w) => w.persona ? "anrufen" : "telefonieren", deFall: "akk",
      pers: { typ: "a", tags: "fam freunde partner name kollegen medico" }, ort: { da: ["casa", "ufficio"] }, deOrt: { casa: "von zu Hause", ufficio: "vom Büro aus" },
      modi: ["al_telefono"].filter(() => false), modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true,
      keys: (w) => w.persona === "medico" ? ["arzt"] : ["sozial"] }),
    V({ id: "chiamare", it: "chiamare", v: R("chiamare"), level: "A1", kat: "familie arbeit gesundheit reisen",
      de: (w) => w.oggetto === "taxi" ? "rufen" : "anrufen", deFall: "akk",
      obj: ["taxi"], pers: { typ: "dir", tags: "fam freunde partner name kollegen medico" }, einsVon: ["oggetto", "persona"], exklusiv: ["oggetto", "persona"],
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true,
      keys: (w) => w.oggetto === "taxi" ? ["taxi"] : (w.persona === "medico" ? ["arzt"] : ["sozial"]) }),
    V({ id: "mandare", it: "mandare", v: R("mandare"), de: "schicken", level: "A2", kat: "familie arbeit alltag",
      obj: ["messaggio", "email", "foto", "cartolina", "lettera"], objPflicht: true, dets: ["indef", "def"],
      pers: { typ: "a", tags: "fam freunde partner name kollegen" }, persObj: { cartolina: "fam freunde partner name", lettera: "fam freunde partner name", foto: "fam freunde partner name" },
      modali: ["potere", "dovere", "volere", "vorrei"], kind: true, keys: ["sozial"] }),
    V({ id: "finire", it: "finire", v: R("finire", { isc: true }), de: "fertigmachen", level: "A2", kat: "arbeit bildung",
      obj: ["progetto", "compiti", "presentazione", "rapporto"], objPflicht: true, dets: ["def"], modi: ["in_fretta"], modali: ["potere", "dovere", "volere"],
      habit: "nein", punkt: true, keys: (w) => w.oggetto === "compiti" ? ["lernen"] : ["arbeit"] }),
    V({ id: "cominciare", it: "cominciare", v: R("cominciare"), de: "beginnen", level: "A2", kat: "arbeit bildung",
      obj: ["corso_obj", "lavoro_nomen", "progetto"], objPflicht: true, dets: ["indef", "def"], objAdj: { lavoro_nomen: ["nuovo"] },
      modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein", keys: (w) => w.oggetto === "corso_obj" ? ["lernen"] : ["arbeit"] }),
    V({ id: "organizzare", it: "organizzare", v: R("organizzare"), de: "organisieren", level: "B1", kat: "arbeit freizeit familie",
      obj: ["festa_obj", "viaggio", "cena_obj", "riunione"], objPflicht: true, dets: ["indef", "def"], comp: FAM + " kollegen",
      modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein",
      keys: (w) => w.oggetto === "festa_obj" ? ["fest"] : (w.oggetto === "viaggio" ? ["reise"] : (w.oggetto === "riunione" ? ["arbeit"] : ["essen"])) }),
    V({ id: "rispondere", it: "rispondere", v: R("rispondere", { part: "risposto" }), de: "antworten", deFall: "dat", level: "A2", kat: "familie arbeit",
      pers: { typ: "a", tags: "fam freunde partner name kollegen" }, persPflicht: true, modi: ["in_italiano", "in_tedesco"], modali: ["dovere", "potere", "volere", "vorrei"],
      habit: "freq", keys: ["sozial"] }),
    V({ id: "aiutare", it: "aiutare", v: R("aiutare"), de: "helfen", deFall: "dat", level: "A1", kat: "familie alltag arbeit",
      pers: { typ: "dir", tags: "fam freunde partner name kollegen" }, persPflicht: true, ort: { stato: ["cucina", "giardino", "casa", "ufficio"] },
      persOrt: { ufficio: "kollegen" }, modi: ["volentieri"], modali: ["potere", "dovere", "volere", "vorrei"], kind: true, keys: ["sozial", "hilfe"] }),
    V({ id: "incontrare", it: "incontrare", v: R("incontrare"), de: "treffen", deFall: "akk", level: "A1", kat: "freizeit familie arbeit",
      pers: { typ: "dir", tags: "fam freunde partner name kollegen" }, persPflicht: true,
      ort: { stato: ["bar", "centro", "parco", "stazione", "ristorante", "cinema", "festa", "universita", "palestra", "piscina"] },
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true, keys: ["sozial"] }),
    V({ id: "vedere", it: "vedere", v: C.vedere, de: "sehen", deFall: "akk", level: "A2", kat: "freizeit familie",
      pers: { typ: "dir", tags: "fam freunde partner name" }, persPflicht: true, ort: { stato: ["bar", "centro"] },
      modali: ["potere", "volere", "vorrei"], keys: ["sozial"] }),
    V({ id: "aspettare", it: "aspettare", v: R("aspettare"), de: "warten", deFall: "aufAkk", deObjPraep: "auf", level: "A1", kat: "reisen alltag familie gesundheit",
      obj: ["autobus", "treno", "taxi", "pacco"], pers: { typ: "dir", tags: "fam freunde partner name kollegen medico" }, einsVon: ["oggetto", "persona"], exklusiv: ["oggetto", "persona"],
      ort: { stato: ["fermata", "stazione", "aeroporto", "bar", "casa", "centro", "cinema", "ristorante"] },
      ortObj: { fermata: ["autobus"], stazione: ["treno", "taxi"], casa: ["pacco"], aeroporto: ["taxi"], bar: [], centro: [], cinema: [], ristorante: [] },
      persOrt: { fermata: "fam freunde partner name", stazione: "fam freunde partner name kollegen", aeroporto: "fam freunde partner name kollegen",
        bar: "fam freunde partner name kollegen", casa: "fam freunde partner name medico", centro: "fam freunde partner name", cinema: "fam freunde partner name",
        ristorante: "fam freunde partner name kollegen" },
      modi: ["con_calma"], modali: ["dovere", "potere"], punkt: true, kind: true,
      keys: (w) => w.oggetto === "autobus" ? ["bus"] : (w.oggetto === "treno" ? ["treno"] : (w.oggetto === "taxi" ? ["taxi"] : ["warten"])) }),
    V({ id: "usare", it: "usare", v: R("usare"), de: "benutzen", level: "A2", kat: "alltag arbeit",
      obj: ["computer", "telefono", "macchina", "bici"], objPflicht: true, possOk: true, dets: ["def", "poss"], modali: ["potere", "dovere", "volere"],
      keys: (w) => w.oggetto === "macchina" ? ["auto"] : (w.oggetto === "bici" ? ["zu_fuss"] : ["technik"]) }),
    V({ id: "riparare", it: "riparare", v: R("riparare"), de: "reparieren", level: "B1", kat: "alltag arbeit",
      obj: ["bici", "macchina", "computer", "lampada", "porta"], objPflicht: true, possOk: true, dets: ["def", "poss"],
      modali: ["potere", "dovere", "volere", "sapere"], habit: "nein", keys: ["reparatur"] }),
    V({ id: "stampare", it: "stampare", v: R("stampare"), de: "ausdrucken", level: "B1", kat: "arbeit verwaltung bildung",
      obj: ["documenti", "biglietto", "foto", "modulo", "rapporto"], objPflicht: true, dets: ["def"], ort: { stato: ["ufficio", "casa", "biblioteca"] },
      modali: ["potere", "dovere", "volere"], habit: "nein", keys: ["arbeit_buero"] }),
    V({ id: "firmare", it: "firmare", v: R("firmare"), de: "unterschreiben", level: "B1", kat: "verwaltung arbeit",
      obj: ["contratto", "modulo", "lettera"], objPflicht: true, dets: ["def"], modali: ["dovere", "potere"], habit: "nein", keys: ["papier"] }),
    V({ id: "compilare", it: "compilare", v: R("compilare"), de: "ausfuellen", level: "B1", kat: "verwaltung",
      obj: ["modulo"], objPflicht: true, dets: ["def", "indef"], modi: ["con_attenzione"], modali: ["dovere", "potere"], habit: "nein", keys: ["papier"] }),
    V({ id: "prenotare", it: "prenotare", v: R("prenotare"), level: "A2", kat: "reisen freizeit essen",
      de: (w) => (w.oggetto === "tavolo" || w.oggetto === "camera_hotel") ? "reservieren" : "buchen",
      obj: ["tavolo", "camera_hotel", "volo", "viaggio", "biglietto"], objPflicht: true, dets: ["indef"],
      ort: { stato: ["ristorante", "pizzeria", "albergo"] }, ortObj: { ristorante: ["tavolo"], pizzeria: ["tavolo"], albergo: ["camera_hotel"] },
      modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein",
      keys: (w) => w.oggetto === "tavolo" ? ["ausser_haus_essen", "essen"] : ["reise"] }),
    V({ id: "rinnovare", it: "rinnovare", v: R("rinnovare"), de: "verlaengern", level: "B2", kat: "verwaltung",
      obj: ["passaporto", "carta_identita", "permesso", "contratto", "abbonamento"], objPflicht: true, possOk: true, dets: ["poss", "def"],
      ort: { stato: ["comune", "questura"] }, ortObj: { comune: ["carta_identita"], questura: ["passaporto", "permesso"] },
      modali: ["dovere", "potere", "volere"], habit: "nein", keys: ["papier"] }),
    V({ id: "richiedere", it: "richiedere", v: R("richiedere", { part: "richiesto" }), de: "beantragen", level: "B2", kat: "verwaltung",
      obj: ["passaporto", "carta_identita", "permesso", "certificato"], objPflicht: true, dets: ["indef", "def"],
      objDets: { passaporto: ["def", "indef"], carta_identita: ["def", "indef"], permesso: ["def", "indef"], certificato: ["indef"] },
      ort: { stato: ["comune", "questura"] }, ortObj: { comune: ["carta_identita", "certificato"], questura: ["passaporto", "permesso"] },
      modali: ["dovere", "potere", "volere"], habit: "nein", keys: ["papier"] }),
    V({ id: "consegnare", it: "consegnare", v: R("consegnare"), de: "abgeben", level: "B1", kat: "verwaltung bildung arbeit",
      obj: ["documenti", "modulo", "compiti", "rapporto"], objPflicht: true, dets: ["def"],
      ort: { stato: ["comune", "questura", "ufficio", "scuola"] }, ortObj: { comune: ["documenti", "modulo"], questura: ["documenti", "modulo"], ufficio: ["documenti", "rapporto", "modulo"], scuola: ["compiti"] },
      modali: ["dovere", "potere"], habit: "nein", keys: (w) => w.oggetto === "compiti" ? ["lernen"] : ["papier"] }),
    V({ id: "spedire", it: "spedire", v: R("spedire", { isc: true }), de: "schicken", level: "B1", kat: "verwaltung alltag",
      obj: ["pacco", "lettera", "cartolina"], objPflicht: true, dets: ["indef", "def"],
      pers: { typ: "a", tags: "fam freunde partner name" }, ort: { stato: ["posta"] }, modali: ["dovere", "potere", "volere", "vorrei"], habit: "nein", keys: ["post"] }),
    /* ---------- Freizeit ---------- */
    V({ id: "giocare", it: "giocare", v: R("giocare"), de: "spielen", level: "A1", kat: "freizeit familie",
      obj: ["calcio", "tennis", "pallavolo", "basket", "carte", "scacchi", "videogiochi"], objPflicht: true,
      ort: { stato: ["parco", "giardino", "spiaggia", "palestra", "casa", "soggiorno", "bar", "camera", "nonni"] },
      ortObj: { parco: ["calcio", "basket"], giardino: ["calcio", "carte"], spiaggia: ["calcio", "pallavolo"], palestra: ["basket", "pallavolo"],
        casa: ["carte", "scacchi", "videogiochi"], soggiorno: ["carte", "scacchi", "videogiochi"], bar: ["carte"], camera: ["videogiochi"], nonni: ["carte", "scacchi"] },
      comp: FAM + " kollegen", modi: ["volentieri", "bene", "insieme"], modali: ["potere", "volere", "vorrei", "sapere"], kind: true, dauer: true,
      keys: (w) => { const o = OGG[w.oggetto]; return o && o.tags.includes("sport") ? ["sport", "draussen_spiel"].concat(["parco", "giardino", "spiaggia"].includes(w.luogo) ? ["draussen"] : []) : ["spiel_drinnen"]; } }),
    V({ id: "suonare", it: "suonare", v: R("suonare"), de: "spielen", level: "A2", kat: "freizeit bildung",
      obj: ["chitarra", "pianoforte", "violino"], objPflicht: true, dets: ["def"], modi: ["bene", "volentieri"], modali: ["potere", "volere", "vorrei", "sapere"],
      dauer: true, kind: true, keys: ["musik"] }),
    V({ id: "ascoltare", it: "ascoltare", v: R("ascoltare"), de: "hoeren", level: "A1", kat: "freizeit alltag",
      obj: ["musica", "radio_hoeren", "canzone", "podcast"], objPflicht: true, dets: ["def", "indef"],
      ort: { stato: ["casa", "camera", "cucina", "in_macchina", "in_treno"] }, ortObj: { in_macchina: ["radio_hoeren", "musica", "podcast"], in_treno: ["musica", "podcast"] },
      modi: ["volentieri"], modali: ["potere", "volere", "vorrei"], dauer: true, kind: true, keys: ["musik"] }),
    V({ id: "guardare", it: "guardare", v: R("guardare"), level: "A1", kat: "freizeit familie",
      de: (w) => w.oggetto === "tv" ? "fernsehen" : (w.oggetto === "foto" ? "anschauen" : "sehen"),
      obj: ["tv", "film", "serie", "partita", "foto"], objPflicht: true, dets: ["indef", "def", "poss"], possNur: ["foto"],
      ort: { stato: ["casa", "soggiorno", "divano", "camera", "cinema", "bar", "stadio", "nonni", "da_marco"] },
      ortObj: { cinema: ["film"], bar: ["partita"], stadio: ["partita"], camera: ["tv", "film", "serie"], nonni: ["film", "partita", "foto", "tv"], da_marco: ["film", "partita", "foto", "serie"] },
      comp: FAM, modi: ["volentieri", "insieme"], modali: ["potere", "volere", "vorrei"], dauer: true, kind: true,
      keys: (w) => w.luogo === "cinema" || w.luogo === "stadio" ? ["ausgehen", "kultur", "film"] : ["film"] }),
    V({ id: "ballare", it: "ballare", v: R("ballare"), de: "tanzen", level: "A1", kat: "freizeit",
      ort: { stato: ["discoteca", "festa", "casa"] }, comp: FAM, modi: ["volentieri", "bene", "fino_tardi", "insieme"], modali: ["potere", "volere", "vorrei", "sapere"],
      kind: true, keys: ["ausgehen", "fest", "tanzen"] }),
    V({ id: "cantare", it: "cantare", v: R("cantare"), de: "singen", level: "A1", kat: "freizeit",
      obj: ["canzone"], dets: ["indef", "def"], ort: { stato: ["coro", "doccia", "festa", "casa"] }, comp: FAM, modi: ["bene", "volentieri", "a_voce_alta", "insieme"],
      modali: ["potere", "volere", "vorrei", "sapere"], kind: true, keys: ["musik"] }),
    V({ id: "nuotare", it: "nuotare", v: R("nuotare"), de: "schwimmen", level: "A1", kat: "freizeit gesundheit",
      ort: { stato: ["piscina", "mare", "lago"] }, comp: FAM, modi: ["volentieri", "bene", "molto", "insieme"], modali: ["potere", "volere", "vorrei", "sapere"],
      punkt: true, kind: true, keys: ["sport", "bad"] }),
    V({ id: "correre", it: "correre", v: R("correre", { part: "corso" }), de: "laufen", level: "A2", kat: "freizeit gesundheit",
      ort: { stato: ["parco", "spiaggia", "bosco", "palestra"] }, comp: FAM + " cane", modi: ["volentieri", "molto", "insieme"], modali: ["potere", "volere", "dovere", "vorrei"],
      punkt: true, kind: true, keys: (w) => w.luogo === "palestra" ? ["sport"] : ["sport", "draussen"] }),
    V({ id: "fare_sport", it: "fare sport", v: C.fare, fest: "sport", de: "machen", deFestObj: "Sport", level: "A1", kat: "freizeit gesundheit",
      ort: { stato: ["palestra", "parco"] }, comp: FAM + " kollegen", modi: ["volentieri", "molto", "poco", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"],
      dauer: true, kind: true, keys: (w) => w.luogo === "parco" ? ["sport", "draussen"] : ["sport"] }),
    V({ id: "visitare", it: "visitare", v: R("visitare"), de: "besichtigen", level: "A2", kat: "reisen freizeit",
      obj: ["museo_obj", "citta_obj", "centro_storico", "mostra", "colosseo", "chiesa"], objPflicht: true, dets: ["indef", "def"],
      ort: { stato: FERN.filter((x) => orteMit("stadtname").includes(x)) },
      ortObj: { roma: ["museo_obj", "citta_obj", "centro_storico", "mostra", "colosseo", "chiesa"] },
      ortObjStandard: ["museo_obj", "citta_obj", "centro_storico", "mostra", "chiesa"], comp: FAM, modi: ["con_calma"], modali: ["potere", "volere", "vorrei"],
      keys: ["kultur", "reise"] }),
    V({ id: "disegnare", it: "disegnare", v: R("disegnare"), de: "zeichnen", level: "B1", kat: "freizeit",
      ort: { stato: ["casa", "parco", "giardino"] }, modi: ["volentieri", "bene"], modali: ["potere", "volere", "sapere"], kind: true, keys: ["hobby"] }),
    /* ---------- Familie und Freunde ---------- */
    V({ id: "andare_trovare", it: "andare a trovare", v: C.andare, fest: "a trovare", festNachPerson: false, de: "besuchen", deFall: "akk", level: "A2", kat: "familie freizeit",
      pers: { typ: "dir", tags: "fam freunde partner name" }, persPflicht: true, mezzo: true, mezzoOrt: "nonni",
      comp: FAM, modi: ["volentieri"], modali: ["potere", "dovere", "volere", "vorrei"], kind: true, keys: ["sozial"] }),
    V({ id: "festeggiare", it: "festeggiare", v: R("festeggiare"), de: "feiern", level: "A2", kat: "familie freizeit",
      obj: ["compleanno", "natale"], dets: ["poss", "def"], objDets: { compleanno: ["poss"], natale: ["def"] },
      ort: { stato: ["casa", "ristorante", "nonni", "da_marco", "discoteca"] }, ortObj: { discoteca: ["compleanno"] }, comp: FAM + " kollegen",
      modi: ["insieme"], modali: ["volere", "vorrei", "potere"], habit: "nein", kind: true, keys: ["fest"] }),
    V({ id: "regalare", it: "regalare", v: R("regalare"), de: "schenken", level: "A2", kat: "familie einkaufen",
      obj: ["fiori", "libro", "profumo", "orologio", "borsa", "sciarpa", "cioccolato"], objPflicht: true, dets: ["indef", "part", "def"],
      pers: { typ: "a", tags: "fam freunde partner name" }, persPflicht: true, modali: ["volere", "vorrei", "potere"], habit: "nein", keys: ["geschenk"] }),
    V({ id: "portare", it: "portare", v: R("portare"), level: "A2", kat: "familie freizeit",
      de: (w) => w.persona ? "bringen" : "mitbringen",
      obj: ["fiori", "torta", "vino", "regalo", "libro", "biscotti"], objPflicht: true, dets: ["indef", "part", "def"],
      pers: { typ: "a", tags: "fam freunde partner name" }, ort: { moto: ["festa", "da_marco", "nonni"] }, exklusiv: ["persona", "luogo"],
      modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein", keys: ["geschenk", "mitbringen"] }),
    V({ id: "dare", it: "dare", v: C.dare, de: "geben", level: "A1", kat: "familie alltag",
      obj: ["chiavi", "libro", "numero"], objPflicht: true, dets: ["def", "poss", "indef"], objDets: { chiavi: ["def"], libro: ["def", "indef"], numero: ["poss"] }, possOk: true,
      pers: { typ: "a", tags: "fam freunde partner name kollegen" }, persPflicht: true, modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein", keys: ["geben"] }),
    V({ id: "parlare", it: "parlare", v: R("parlare"), de: "sprechen", level: "A1", kat: "familie bildung arbeit freizeit",
      obj: ["italiano", "tedesco", "inglese", "spagnolo", "francese"], dets: ["ohne"], comp: FAM + " kollegen medico",
      einsVon: ["oggetto", "compagnia"], modi: ["bene", "male", "al_telefono", "molto", "poco"],
      zeitNurObj: { italiano: ["jetzt", "kind", "seit", "freq", "mai", "heute"], tedesco: ["jetzt", "kind", "seit", "freq", "mai", "heute"], inglese: ["jetzt", "kind", "seit", "freq", "mai", "heute"],
        spagnolo: ["jetzt", "kind", "seit", "freq", "mai", "heute"], francese: ["jetzt", "kind", "seit", "freq", "mai", "heute"] },
      modali: ["potere", "dovere", "volere", "vorrei", "sapere"], dauer: false, kind: true,
      keys: (w) => w.compagnia ? (w.compagnia === "medico" ? ["arzt"] : ["sozial"]) : ["sprache"] }),
    V({ id: "raccontare", it: "raccontare", v: R("raccontare"), de: "erzaehlen", level: "B1", kat: "familie freizeit",
      obj: ["storia", "barzelletta"], objPflicht: true, dets: ["indef"], pers: { typ: "a", tags: "fam freunde partner name kollegen" },
      modi: ["volentieri"], modali: ["potere", "volere", "vorrei"], kind: true, keys: ["sozial"] }),
    V({ id: "spiegare", it: "spiegare", v: R("spiegare"), de: "erklaeren", level: "A2", kat: "bildung familie arbeit",
      obj: ["grammatica", "strada", "problema", "lezione"], objPflicht: true, dets: ["def"], pers: { typ: "a", tags: "fam freunde partner name kollegen" },
      modi: ["con_calma", "bene", "in_italiano", "in_tedesco"], modali: ["potere", "dovere", "volere"], habit: "nein", keys: ["erklaeren"] }),
    V({ id: "mostrare", it: "mostrare", v: R("mostrare"), de: "zeigen", level: "A2", kat: "familie freizeit",
      obj: ["foto", "citta_obj", "casa_obj", "appartamento"], objPflicht: true, dets: ["def", "poss"], objDets: { appartamento: ["def"], citta_obj: ["def"], casa_obj: ["def", "poss"], foto: ["def", "poss"] },
      possOk: true, pers: { typ: "a", tags: "fam freunde partner name kollegen" }, modali: ["potere", "volere", "vorrei"], habit: "nein", keys: ["zeigen"] }),
    /* ---------- Lernen ---------- */
    V({ id: "studiare", it: "studiare", v: R("studiare"), level: "A1", kat: "bildung",
      de: (w) => { const o = OGG[w.oggetto]; if (o && o.tags.includes("fach")) return "studieren"; if (!o && (w.luogo === "universita" || FERN.includes(w.luogo))) return "studieren"; return "lernen"; },
      obj: ["italiano", "tedesco", "inglese", "spagnolo", "francese", "grammatica", "medicina_fach", "economia"], dets: ["def", "ohne"],
      objDets: { italiano: ["def"], tedesco: ["def"], inglese: ["def"], spagnolo: ["def"], francese: ["def"], grammatica: ["def"], medicina_fach: ["ohne"], economia: ["ohne"] },
      ort: { stato: ["casa", "biblioteca", "universita", "camera", "scuola"].concat(FERN) },
      ortObj: { scuola: ["italiano", "tedesco", "inglese", "spagnolo", "francese", "grammatica"], casa: ["italiano", "tedesco", "inglese", "spagnolo", "francese", "grammatica", "medicina_fach", "economia"] },
      ortObjFern: ["medicina_fach", "economia"],
      comp: "freunde name partner", modi: ["molto", "poco", "fino_tardi", "volentieri", "con_calma"], modali: ["potere", "dovere", "volere", "vorrei"], dauer: true, kind: true, keys: ["lernen"] }),
    V({ id: "imparare", it: "imparare", v: R("imparare"), de: "lernen", level: "A2", kat: "bildung",
      obj: ["italiano", "tedesco", "inglese", "spagnolo", "francese", "vocaboli", "poesia"], objPflicht: true, dets: ["def", "indef"],
      objDets: { italiano: ["def"], tedesco: ["def"], inglese: ["def"], spagnolo: ["def"], francese: ["def"], vocaboli: ["def"], poesia: ["indef", "def"] },
      modi: ["con_calma", "volentieri"], modali: ["potere", "dovere", "volere", "vorrei"], dauer: true, kind: true, keys: ["lernen"] }),
    V({ id: "ripetere", it: "ripetere", v: R("ripetere"), de: "wiederholen", level: "A2", kat: "bildung",
      obj: ["vocaboli", "lezione", "grammatica", "frase"], objPflicht: true, dets: ["def"], modi: ["a_voce_alta", "con_calma"], modali: ["dovere", "potere", "volere"],
      keys: ["lernen"] }),
    V({ id: "capire", it: "capire", v: R("capire", { isc: true }), de: "verstehen", level: "A1", kat: "bildung arbeit",
      obj: ["domanda", "lezione", "grammatica", "problema", "frase", "film"], objPflicht: true, dets: ["def"], modi: ["bene"], habit: "nein",
      keys: ["verstehen"] }),
    V({ id: "fare_compiti", it: "fare i compiti", v: C.fare, fest: "i compiti", de: "machen", deFestObj: "Hausaufgaben", deFestDet: "def", level: "A1", kat: "bildung familie",
      ort: { stato: ["casa", "camera", "biblioteca", "scuola"] }, comp: "freunde name fam", modi: ["con_calma", "in_fretta", "insieme"], keinSubjekt: ["genitori"],
      modali: ["potere", "dovere", "volere"], punkt: true, kind: true, keys: ["lernen"] }),
    V({ id: "frequentare", it: "frequentare", v: R("frequentare"), de: "besuchen", level: "B1", kat: "bildung",
      obj: ["corso_obj", "universita_obj"], objPflicht: true, dets: ["indef", "def"], objDets: { corso_obj: ["indef", "def"], universita_obj: ["def"] },
      modali: ["potere", "volere", "vorrei", "dovere"], dauer: true, keys: ["lernen"] }),
    V({ id: "superare", it: "superare", v: R("superare"), de: "bestehen", level: "B1", kat: "bildung",
      obj: ["esame"], objPflicht: true, dets: ["def"], modali: ["dovere", "volere"], habit: "nein", keys: ["pruefung"] }),
    V({ id: "tradurre", it: "tradurre", v: C.tradurre, de: "uebersetzen", level: "B2", kat: "bildung arbeit",
      obj: ["frase", "testo", "lettera", "documenti"], objPflicht: true, dets: ["def", "indef"], modi: ["in_italiano", "in_tedesco", "con_attenzione"],
      deModo: { in_italiano: "ins Italienische", in_tedesco: "ins Deutsche" }, modali: ["potere", "dovere", "volere"], habit: "nein", keys: ["lernen"] }),
    V({ id: "chiedere", it: "chiedere", v: R("chiedere", { part: "chiesto" }), de: "bitten", deFall: "akk", deObjPraep: "um", level: "A2", kat: "alltag bildung essen",
      obj: ["aiuto", "informazioni", "conto"], objPflicht: true, objDets: { aiuto: ["ohne"], informazioni: ["ohne"], conto: ["def"] },
      pers: { typ: "a", tags: "fam freunde partner name kollegen" }, persObj: { conto: "" },
      modali: ["potere", "dovere", "volere"], habit: "nein", keys: ["bitte"] }),
    /* ---------- Gesundheit ---------- */
    V({ id: "prendere", it: "prendere", v: R("prendere", { part: "preso" }), level: "A1", kat: "reisen gesundheit essen alltag",
      de: (w) => { const o = w.oggetto; if (o === "caffe" || o === "cappuccino") return "trinken"; if (o === "ombrello") return "mitnehmen"; return "nehmen"; },
      obj: ["autobus", "treno", "metro", "taxi", "medicina", "pastiglia", "caffe", "cappuccino", "gelato", "ombrello"], objPflicht: true, possOk: true, besitz: true,
      objDets: { autobus: ["def"], treno: ["def"], metro: ["def"], taxi: ["indef"], medicina: ["indef", "def"], pastiglia: ["indef"], caffe: ["indef"], cappuccino: ["indef"], gelato: ["indef"], ombrello: ["def", "poss"] },
      ort: { stato: ["fermata", "stazione", "bar", "gelateria"] }, ortObj: { fermata: ["autobus"], stazione: ["treno", "taxi"], bar: ["caffe", "cappuccino"], gelateria: ["gelato"] },
      objModali: { caffe: ["potere", "volere", "vorrei"], cappuccino: ["potere", "volere", "vorrei"], gelato: ["potere", "volere", "vorrei"] },
      modali: ["potere", "dovere", "volere", "vorrei"], punkt: true,
      keys: (w) => { const o = OGG[w.oggetto]; if (!o) return []; if (o.tags.includes("verkehr")) return o.tags.filter((t) => t !== "verkehr");
        if (o.tags.includes("medizin")) return ["medizin"]; if (o.id === "ombrello") return ["schirm"]; if (o.id === "gelato") return ["eis"]; return ["trinken", "heissgetraenk"]; } }),
    V({ id: "misurare", it: "misurare", v: R("misurare"), de: "messen", level: "B1", kat: "gesundheit",
      obj: ["febbre", "pressione"], objPflicht: true, dets: ["def"], modali: ["dovere", "potere"], habit: "freq", keys: ["fieber"] }),
    V({ id: "avere", it: "avere", v: AVERE, de: "haben", level: "A1", kat: "alltag gesundheit familie bildung",
      obj: ["fame", "sete", "tempo", "mal_testa", "febbre", "influenza", "appuntamento", "macchina", "bici", "cane_obj", "gatto", "problema", "domanda"], objPflicht: true,
      objDets: { fame: ["ohne"], sete: ["ohne"], tempo: ["ohne"], mal_testa: ["ohne"], febbre: ["def"], influenza: ["def"], appuntamento: ["indef"], macchina: ["indef"],
        bici: ["indef"], cane_obj: ["indef"], gatto: ["indef"], problema: ["indef"], domanda: ["indef"] },
      ort: { stato: ["medico", "dentista", "comune", "banca", "parrucchiere", "questura"] }, ortObj: { medico: ["appuntamento"], dentista: ["appuntamento"], comune: ["appuntamento"],
        banca: ["appuntamento"], parrucchiere: ["appuntamento"], questura: ["appuntamento"] },
      habit: "freq", zustand: true, kind: true, keys: (w) => ["zustand:" + (w.oggetto || "")], objKeinPassato: ["fame", "sete", "tempo", "mal_testa"],
      zeitNurObj: { macchina: ["kind", "seit", "dauerpast", "mai", "jetzt"], bici: ["kind", "seit", "dauerpast", "mai", "jetzt"], cane_obj: ["kind", "seit", "dauerpast", "mai", "jetzt"],
        gatto: ["kind", "seit", "dauerpast", "mai", "jetzt"], febbre: ["jetzt", "heute", "stamattina", "vergangen", "dauerpast", "freq"], influenza: ["jetzt", "heute", "vergangen", "dauerpast"],
        problema: ["jetzt", "heute", "vergangen"], domanda: ["jetzt", "heute"] } }),
    V({ id: "essere_agg", it: "essere", name: "essere (wie?)", v: ESSERE, de: "sein", level: "A1", kat: "alltag gesundheit arbeit familie",
      stato: true, habit: "freq", zustand: true, kind: true, keinPassato: true,
      keys: (w) => ["zst:" + (w.stato || "")] }),
    V({ id: "fumare", it: "fumare", v: R("fumare"), de: "rauchen", level: "A2", kat: "gesundheit alltag",
      obj: ["sigaretta"], dets: ["indef"], ort: { stato: ["balcone", "terrazza", "giardino"] }, modi: ["molto", "poco"], modali: ["potere", "volere", "vorrei"],
      dauer: true, zeitNur: ["jetzt", "gewohnheit", "freq", "freqvorn", "mai", "seit"], keys: ["rauchen"] }),
    /* ---------- Haushalt ---------- */
    V({ id: "pulire", it: "pulire", v: R("pulire", { isc: true }), de: "putzen", level: "A1", kat: "alltag familie",
      obj: ["cucina_raum", "bagno_raum", "casa_obj", "finestre", "camera_mia"], objPflicht: true, dets: ["def", "poss"], objDets: { camera_mia: ["poss", "def"] }, possOk: true,
      comp: FAM, modi: ["in_fretta", "con_calma", "volentieri", "insieme"], modali: ["potere", "dovere", "volere"], keys: ["haushalt"] }),
    V({ id: "lavare", it: "lavare", v: R("lavare"), level: "A1", kat: "alltag familie",
      de: (w) => w.oggetto === "piatti" ? "spuelen" : "waschen",
      obj: ["piatti", "vestiti", "macchina"], objPflicht: true, dets: ["def", "poss"], objDets: { piatti: ["def"], vestiti: ["def"], macchina: ["def", "poss"] }, possOk: true,
      comp: FAM, modi: ["in_fretta", "insieme"], modali: ["potere", "dovere", "volere"], keys: ["haushalt"] }),
    V({ id: "riordinare", it: "riordinare", v: R("riordinare"), de: "aufraeumen", level: "A2", kat: "alltag familie",
      obj: ["camera_mia", "cucina_raum", "casa_obj", "scrivania"], objPflicht: true, dets: ["def", "poss"], possOk: true, comp: FAM, modi: ["in_fretta", "insieme"],
      modali: ["potere", "dovere", "volere"], kind: true, keys: ["haushalt"] }),
    V({ id: "stirare", it: "stirare", v: R("stirare"), de: "buegeln", level: "B1", kat: "alltag",
      obj: ["camicia", "vestiti"], objPflicht: true, dets: ["def", "poss"], objDets: { vestiti: ["def"] }, possOk: true, modali: ["dovere", "potere"], keys: ["haushalt"] }),
    V({ id: "aprire", it: "aprire", v: R("aprire", { part: "aperto" }), de: "oeffnen", level: "A1", kat: "alltag",
      obj: ["finestra", "porta", "lettera", "pacco"], objPflicht: true, dets: ["def"], modali: ["potere", "dovere", "volere"], habit: "nein", punkt: true, kind: true, keys: ["haus"] }),
    V({ id: "chiudere", it: "chiudere", v: R("chiudere", { part: "chiuso" }), de: "schliessen", level: "A1", kat: "alltag",
      obj: ["finestra", "porta"], objPflicht: true, dets: ["def"], modali: ["potere", "dovere", "volere"], habit: "nein", punkt: true, kind: true, keys: ["haus"] }),
    V({ id: "accendere", it: "accendere", v: R("accendere", { part: "acceso" }), de: "einschalten", level: "A2", kat: "alltag",
      obj: ["luce", "tv", "computer", "riscaldamento", "radio"], objPflicht: true, dets: ["def"], modali: ["potere", "dovere", "volere"], punkt: true,
      keys: (w) => w.oggetto === "riscaldamento" ? ["heizung"] : ["geraet"] }),
    V({ id: "spegnere", it: "spegnere", v: C.spegnere, de: "ausschalten", level: "A2", kat: "alltag",
      obj: ["luce", "tv", "computer", "riscaldamento", "radio"], objPflicht: true, dets: ["def"], modali: ["potere", "dovere", "volere"], punkt: true,
      keys: (w) => w.oggetto === "riscaldamento" ? ["heizung_aus"] : ["geraet"] }),
    V({ id: "buttare", it: "buttare", v: R("buttare"), de: "rausbringen", level: "A2", kat: "alltag familie",
      obj: ["spazzatura"], objPflicht: true, dets: ["def"], modali: ["dovere", "potere"], punkt: true, keys: ["haushalt"] }),
    V({ id: "innaffiare", it: "innaffiare", v: R("innaffiare"), de: "giessen", level: "B1", kat: "alltag",
      obj: ["piante", "fiori"], objPflicht: true, dets: ["def", "poss"], objDets: { fiori: ["def"] }, possOk: true, ort: { stato: ["giardino", "balcone", "terrazza"] },
      modali: ["dovere", "potere"], keys: ["garten"] }),
    V({ id: "fare_bucato", it: "fare il bucato", v: C.fare, fest: "il bucato", de: "waschen", deFestObj: "Wäsche", level: "B1", kat: "alltag",
      modali: ["dovere", "potere"], keys: ["haushalt"] }),
    V({ id: "apparecchiare", it: "apparecchiare", v: R("apparecchiare"), de: "decken", level: "B1", kat: "alltag essen familie",
      obj: ["tavola"], objPflicht: true, dets: ["def"], comp: FAM, modali: ["potere", "dovere"], punkt: true, keys: ["haushalt"] }),
    V({ id: "perdere", it: "perdere", v: R("perdere", { part: "perso" }), level: "A2", kat: "alltag reisen",
      de: (w) => (w.oggetto === "treno" || w.oggetto === "autobus") ? "verpassen" : "verlieren",
      obj: SACHEN.concat(["treno", "autobus"]), objPflicht: true, possOk: true, besitz: true, objDets: { treno: ["def"], autobus: ["def"] },
      ort: { stato: ["in_treno", "sull_autobus", "centro", "parco"] }, ortObj: { in_treno: SACHEN, sull_autobus: SACHEN, centro: SACHEN, parco: SACHEN },
      habit: "freq", negNurMai: true, keys: (w) => (w.oggetto === "treno" || w.oggetto === "autobus") ? ["verpasst"] : ["verloren"] }),
    V({ id: "trovare", it: "trovare", v: R("trovare"), de: "finden", level: "A1", kat: "alltag arbeit",
      obj: SACHEN.concat(["lavoro_nomen", "appartamento"]), objPflicht: true, possOk: true, besitz: true,
      ort: { stato: ["cucina", "camera", "in_macchina", "ufficio", "centro", "citta"].concat(FERN) },
      ortObj: { cucina: SACHEN, camera: SACHEN, in_macchina: SACHEN, ufficio: SACHEN, centro: ["appartamento", "lavoro_nomen"], citta: ["appartamento", "lavoro_nomen"] },
      ortObjFern: ["appartamento", "lavoro_nomen"], habit: "nein", keys: ["gefunden"] }),
    V({ id: "dimenticare", it: "dimenticare", v: R("dimenticare"), de: "vergessen", level: "A2", kat: "alltag",
      obj: SACHEN, objPflicht: true, possOk: true, besitz: true,
      ort: { stato: ["casa", "ufficio", "in_treno", "bar", "ristorante", "sull_autobus"] }, habit: "freq", modali: ["dovere"], modalNurNeg: true, keys: ["vergessen"] }),
  ];
  const VERBO = {}; VERBI.forEach((v) => { VERBO[v.id] = v; });

  /* ===================================================================
     4. ZEITFORMEN, VERBINDUNGEN, EINLEITUNGEN JE NIVEAU
     =================================================================== */
  const ZEITFORMEN = [
    { id: "presente", name: "Gegenwart", it: "presente", level: "A1" },
    { id: "passato", name: "Vergangenheit", it: "passato prossimo", level: "A1" },
    { id: "imperfetto", name: "Gewohnheit, Zustand früher", it: "imperfetto", level: "A2" },
    { id: "futuro", name: "Zukunft", it: "futuro semplice", level: "A2" },
    { id: "condizionale", name: "würde …", it: "condizionale", level: "B1" },
    { id: "trapassato", name: "Vorvergangenheit", it: "trapassato prossimo", level: "C1" },
    { id: "condPassato", name: "wäre/hätte … (Vergangenheit)", it: "condizionale passato", level: "C1" },
  ];
  const VERBINDUNGEN = [
    { id: "perche", it: "perché", de: "weil", name: "Grund dahinter", level: "A1", hinweis: "„perché“ + Grund: das Verb bleibt an seinem Platz, anders als im deutschen „weil“-Satz." },
    { id: "quindi", it: "quindi", de: "deshalb", name: "Grund davor", level: "A2", hinweis: "Grund zuerst, dann „quindi“ (deshalb) und die Folge." },
    { id: "quando", it: "quando", de: "wenn", name: "immer wenn …", level: "A2", hinweis: "„quando“ = wenn/als. Bei der Zukunft steht auch im quando-Satz das futuro." },
    { id: "se", it: "se", de: "wenn", name: "falls …", level: "A2", hinweis: "Wirkliche Bedingung: se + presente (oder futuro), dann der Hauptsatz." },
    { id: "se2", it: "se", de: "wenn", name: "wenn … würde (nicht wirklich)", level: "B2", hinweis: "Periodo ipotetico: se + congiuntivo imperfetto, Hauptsatz im condizionale — „Se avessi tempo, andrei …“." },
    { id: "se3", it: "se", de: "wenn … hätte", name: "wenn … gewesen wäre (verpasst)", level: "C1", hinweis: "Periodo ipotetico der Vergangenheit: se + congiuntivo trapassato, Hauptsatz im condizionale passato." },
  ];
  const EINLEITUNGEN = [
    { id: "so_che", it: "So che", de: "Ich weiß,", level: "A2", modus: "ind", keinIo: true },
    { id: "penso_che", it: "Penso che", de: "Ich glaube,", level: "B2", modus: "cong", keinIo: true },
    { id: "credo_che", it: "Credo che", de: "Ich glaube,", level: "B2", modus: "cong", keinIo: true },
    { id: "spero_che", it: "Spero che", de: "Ich hoffe,", level: "B2", modus: "cong", keinIo: true },
    { id: "non_credo_che", it: "Non credo che", de: "Ich glaube nicht,", level: "B2", modus: "cong", keinIo: true },
    { id: "importante_che", it: "È importante che", de: "Es ist wichtig,", level: "B2", modus: "cong", nurPresente: true },
    { id: "pensavo_che", it: "Pensavo che", de: "Ich dachte,", level: "C1", modus: "congPast", keinIo: true },
    { id: "speravo_che", it: "Speravo che", de: "Ich hoffte,", level: "C1", modus: "congPast", keinIo: true },
  ];
  const WFRAGEN = [
    { id: "checosa", it: "Che cosa", feld: "oggetto" }, { id: "chi", it: "Chi", feld: "persona" }, { id: "achi", it: "A chi", feld: "persona" },
    { id: "conchi", it: "Con chi", feld: "compagnia" }, { id: "dove", it: "Dove", feld: "luogo" }, { id: "dadove", it: "Da dove", feld: "luogo" },
    { id: "quando", it: "Quando", feld: "quando" }, { id: "come", it: "Come", feld: "mezzo" }, { id: "perche", it: "Perché", feld: "causa" },
  ];
  const KATEGORIEN = [
    { id: "alltag", name: "Haushalt & Alltag", icon: "🏠" }, { id: "einkaufen", name: "Einkaufen", icon: "🛒" },
    { id: "arbeit", name: "Arbeit & Beruf", icon: "💼" }, { id: "familie", name: "Familie & Freunde", icon: "👪" },
    { id: "freizeit", name: "Freizeit", icon: "⚽" }, { id: "essen", name: "Essen & Trinken", icon: "🍝" },
    { id: "reisen", name: "Reisen & Unterwegs", icon: "🚆" }, { id: "bildung", name: "Schule & Lernen", icon: "📚" },
    { id: "gesundheit", name: "Gesundheit", icon: "🩺" }, { id: "verwaltung", name: "Amt & Papierkram", icon: "📄" },
  ];
  const NIVEAU_INFO = {
    A1: ["presente", "passato prossimo mit essere/avere", "Verneinung mit non", "Fragen (sì/no und dove, quando, con chi …)", "potere, dovere, volere, vorrei + Infinitiv", "e, ma, o, poi", "perché + Grund"],
    A2: ["+ imperfetto (Gewohnheit, Zustand)", "+ futuro semplice", "+ sapere + Infinitiv (können)", "+ quindi, quando, se (wirklich)", "+ So che … (dass-Satz)", "+ già, da bambino, da tre anni"],
    B1: ["+ condizionale (andrei, vorrei, potrei)", "+ mehr Wörter für Arbeit, Amt, Lernen"],
    B2: ["+ congiuntivo presente nach Penso che, Credo che, Spero che, È importante che", "+ Se avessi …, andrei … (periodo ipotetico)", "+ Amt: rinnovare, richiedere"],
    C1: ["+ congiuntivo passato und imperfetto (Penso che sia andato …, Pensavo che …)", "+ trapassato prossimo, condizionale passato", "+ Se avessi avuto …, sarei andato …"],
    C2: ["alles aus A1 bis C1"],
  };
  function niveauInfo(lv) { return NIVEAU_INFO[lv] || NIVEAU_INFO.A1; }

  /* ===================================================================
     5. GEFÜHRTES BAUEN — was passt zu dem, was schon gewählt ist?
     =================================================================== */
  const leer = (x) => x === undefined || x === null || x === "";
  function wVerb(w) { return VERBO[w.verbo] || null; }
  function wSubj(w) { return SOGGETTI.find((s) => s.id === w.soggetto) || SOGGETTI[0]; }
  function verbDe(w, v) { const d = typeof v.de === "function" ? v.de(w) : v.de; return d; }
  function rollenVon(v) { return v.ort ? Object.keys(v.ort) : []; }
  function rolleVon(w, v) { const r = rollenVon(v); return r.includes(w.rolle) ? w.rolle : r[0] || ""; }
  /* Die Zeitform, auf die sich Zeitangaben und Gründe beziehen */
  function basisZeit(w) {
    if (w.verbindung === "se2") return "condizionale";
    if (w.verbindung === "se3") return "condPassato";
    return w.tempo || "presente";
  }
  const PRIVAT = (l) => l && (l.tags.includes("privat") || l.tags.includes("letto"));
  function istFrage(w) { return w.satzart === "wfrage"; }
  function wFeld(w) { if (!istFrage(w)) return ""; const f = WFRAGEN.find((x) => x.id === w.wort); return f ? f.feld : ""; }
  function feldAktiv(w, feld) { return !leer(w[feld]) && wFeld(w) !== feld; }

  function personenPassend(w, v, tagsStr, rolle) {
    const si = subjektInfo(wSubj(w), w.genus);
    const tags = (tagsStr || "").split(" ").filter(Boolean);
    return PERSONE.filter((pe) => ab(pe.level, w.niveau)
      && pe.tags.some((t) => tags.includes(t))
      && pe.id !== si.sog.rel
      && !(si.pl && pe.tags.includes("partner") && !pe.n.pl)
      && !(si.sog.fam && pe.tags.includes("fam"))
      && !(w.quando === "da_bambino" && (pe.tags.includes("partner") || pe.tags.includes("kollegen")))
      && !(rolle === "comp" && feldAktiv(w, "persona") && w.persona === pe.id)
      && !(rolle === "pers" && feldAktiv(w, "compagnia") && w.compagnia === pe.id));
  }

  /* Die Sinn-Schlüssel eines Satzes — daran hängen die Gründe. */
  const ORT_SCHLUESSEL = {
    shop: ["einkauf"], lebensmittel: ["vorrat"], kleidung: ["kleidung"], gastro: ["essen"], bar: ["trinken"], eisdiele: ["eis"],
    kultur: ["ausgehen", "kultur"], fest: ["ausgehen", "fest"], sport: ["sport"], bad: ["bad"], draussen: ["draussen"], urlaub: ["urlaub"],
    arbeit: ["arbeit"], bildung: ["lernen"], amt: ["amt"], arzt: ["arzt"], zahnarzt: ["zahnarzt"], friseur: ["friseur"], person: ["sozial"],
    fern: ["reise"], hotel: ["urlaub"], stadt: ["stadt"],
  };
  function schluessel(w) {
    const v = wVerb(w);
    if (!v) return [];
    let k = typeof v.keys === "function" ? v.keys(w) : (v.keys || []).slice();
    k = k.slice();
    const rolle = rolleVon(w, v);
    if (feldAktiv(w, "luogo") && rolle !== "da") {
      const l = LUOGO[w.luogo];
      if (l && ["andare", "essere_luogo", "restare", "tornare", "arrivare", "partire", "trasferirsi"].includes(v.id)) {
        l.tags.forEach((t) => { (ORT_SCHLUESSEL[t] || []).forEach((x) => k.push(x)); });
        if (l.tags.includes("gastro") && !l.tags.includes("kantine")) k.push("ausgehen", "ausser_haus_essen");
        if (l.id === "casa") k.push(rolle === "stato" ? "daheim" : "heim");
        if (l.id === "letto") k.push(rolle === "stato" ? "ruhe" : "insbett", "ruhe");
        if (l.id === "ufficio" && v.id === "restare") k.push("buero_bleiben");
        if (l.id === "farmacia") k.push("medizin");
        if (l.id === "gelateria") k.push("eis");
      }
    }
    if (feldAktiv(w, "mezzo") && MEZZO[w.mezzo]) MEZZO[w.mezzo].keys.forEach((x) => k.push(x));
    const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
    if (o && v.id === "mangiare" && o.tags.includes("eis")) k.push("eis");
    if (o && v.id === "bere") o.tags.forEach((t) => { if (["erfrischung", "heissgetraenk"].includes(t)) k.push(t); });
    if (v.id === "restare" && w.luogo === "casa") k.push("daheim");
    return Array.from(new Set(k));
  }

  function zeitPasstZumVerb(t, w, v, zf) {
    const g = t.grp;
    if (!(ZEIT_ZU_ZEITFORM[g] || []).includes(zf) && !(g === "uhr" && zf === "imperfetto" && v.zustand)) return false;
    const habitGrp = ["gewohnheit", "saison", "freqvorn"].includes(g);
    const l = feldAktiv(w, "luogo") ? LUOGO[w.luogo] : null;
    const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
    if (habitGrp && v.habit !== "ja" && !(g === "freqvorn" && v.habit === "freq")) return false;
    if (g === "freq" && v.habit === "nein") return false;
    if (g === "freq" && zf === "passato" && t.id === "sempre" && !(v.zustand || v.dauer)) return false;
    if (g === "freq" && zf === "passato" && t.id === "spesso" && v.habit !== "ja") return false;
    if (g === "uhr" && !v.punkt) return false;
    if (["seit", "dauerpast", "ganztag"].includes(g) && !v.dauer) return false;
    if (g === "kind" && !v.kind) return false;
    if (g === "vergangen" && zf === "imperfetto" && !(v.zustand || feldAktiv(w, "modale"))) return false;
    if (g === "gia" && (w.neg || feldAktiv(w, "modale"))) return false;
    if (g === "mai" && feldAktiv(w, "modale") && zf === "passato") return false;
    if (g === "freqvorn" && w.neg) return false;
    if (v.tz && t.tz && !t.tz.some((x) => v.tz.includes(x))) return false;
    if (v.tz && !t.tz && ["abend", "stamattina"].includes(g)) return false;
    /* Gewohnheit nicht bei Anlässen, Reisen, großen Einmal-Käufen */
    if ((t.taeglich || t.woechentlich || g === "freq" || g === "freqvorn") && l && (l.tags.includes("anlass") || l.tags.includes("fern") || l.tags.includes("weit") || l.tags.includes("hotel") || l.tags.includes("flughafen"))) return false;
    /* „il mese prossimo“, „l'anno scorso“ … nur bei Dingen, die man nicht jeden Tag tut */
    if (t.lang && !langOk(v, w, l, o)) return false;
    /* bene/male/molto/poco nicht an einem Uhrzeit- oder Zukunftstermin */
    if (feldAktiv(w, "modo") && ["bene", "male", "molto", "poco"].includes(w.modo) && !["gewohnheit", "freqvorn", "saison", "kind", "heute", "jetzt", "vergangen"].includes(g)) return false;
    if (feldAktiv(w, "modo") && MODO[w.modo] && MODO[w.modo].pos === "verb" && !["presto", "tardi"].includes(w.modo) && (g === "freq" || g === "mai")) return false;
    if (g === "uhr" && zf === "passato" && v.id === "essere_luogo") return false;
    if (g === "freq" && istFrage(w) && (t.id === "sempre" || zf !== "presente")) return false;
    if (v.zeitNurObj && o && v.zeitNurObj[o.id] && !v.zeitNurObj[o.id].includes(g) && !feldAktiv(w, "compagnia")) return false;
    if (g === "saison") {
      const k = schluessel(w);
      if (!(l && (l.tags.includes("urlaub") || l.tags.includes("fern") || l.tags.includes("draussen") || l.tags.includes("bad")))
        && !k.some((x) => ["draussen", "bad", "sport", "reise"].includes(x))) return false;
    }
    if (o && o.selten && (t.taeglich || t.woechentlich)) return false;
    if (w.neg && t.taeglich) return false;
    if (feldAktiv(w, "modale") && w.modale === "vorrei" && (habitGrp || g === "freq")) return false;
    if (g === "mai" && zf === "imperfetto" && v.habit === "nein") return false;
    if (g === "gia" && istFrage(w)) return false;
    if (feldAktiv(w, "einleitung") && w.einleitung === "importante_che" && (habitGrp || g === "freq")) return false;
    if (o && o.einmalig && (habitGrp || g === "freq" || g === "kind") && v.id !== "avere" && v.id !== "usare") return false;
    if (g === "kind" && o && o.alk) return false;
    if (g === "kind" && l && (l.tags.includes("arbeit") || l.tags.includes("amt") || l.tags.includes("fest") || l.tags.includes("hotel"))) return false;
    if (g === "uhr" && feldAktiv(w, "modo") && ["presto", "tardi", "fino_tardi"].includes(w.modo)) return false;
    if (g === "kind" && v.id === "lavorare") return false;
    if (v.zeitNur && !v.zeitNur.includes(g)) return false;
    if (["pranzare", "cenare", "fare_colazione"].includes(v.id) && (habitGrp || g === "freq") && !l) return false;
    if ((w.verbindung === "se2" || w.verbindung === "se3") && feldAktiv(w, "causa") && (g === "uhr" || habitGrp || g === "freq")) return false;
    if (feldAktiv(w, "modo") && (g === "freq" || g === "mai")) return false;
    if (v.id === "essere_luogo" && ["seit", "dauerpast"].includes(g) && !(l && l.tags.some((x) => ["fern", "stadt", "urlaub"].includes(x)) && !feldAktiv(w, "compagnia"))) return false;
    if (v.id === "andare" && w.luogo === "letto" && t.tz && !t.tz.includes("abend")) return false;
    if (l && l.tzNicht && t.tz && t.tz.every((x) => l.tzNicht.includes(x))) return false;
    if (["freq", "mai", "gia"].includes(g) && feldAktiv(w, "modale") && ["passato", "trapassato", "condPassato"].includes(zf)) return false;
    if (v.id === "essere_luogo" && (habitGrp || g === "freq") && l && (l.tags.includes("verkehr") || l.tags.includes("anlass"))) return false;
    if (["cercare", "trovare", "perdere", "dimenticare"].includes(v.id) && o && o.tags.includes("sachen") && !["jetzt", "heute", "stamattina", "vergangen", "freq", "mai", "gia", "freqvorn"].includes(g)) return false;
    if (v.id === "andare" && l && RAUM_ORTE.includes(l.id) && !["jetzt", "uhr", "heute"].includes(g)) return false;
    if (g === "freq" && zf === "passato" && istFrage(w)) return false;
    if (feldAktiv(w, "modo") && ["molto", "poco"].includes(w.modo) && !["gewohnheit", "freqvorn", "saison", "kind", "heute", "jetzt", "vergangen"].includes(g)) return false;
    /* Ein Grund aus einer bestimmten Lage passt nicht zu Gewohnheiten */
    const ca = feldAktiv(w, "causa") ? CAUSA[String(w.causa).replace(/^non:/, "")] : null;
    if (ca && (habitGrp || g === "freq" || g === "kind") && !ca.wieder) return false;
    if (ca && (habitGrp || g === "freq" || g === "kind") && ["perche", "quindi"].includes(w.verbindung || "perche")) return false;
    if (ca && ["perche", "quindi"].includes(w.verbindung || "perche") && !ca.zukunft && (g === "zukunft" || (g === "samstag" && zf !== "passato"))) return false;
    if (ca && ca.id === "tardi" && !["stasera", "ieri_sera", "domani_sera"].includes(t.id)) return false;
    return true;
  }

  const LANG_VERBEN = ["partire", "trasferirsi", "cominciare", "frequentare", "festeggiare", "organizzare", "prenotare", "visitare", "viaggiare",
    "abitare", "studiare", "imparare", "superare", "giocare", "suonare", "fare_sport", "nuotare", "correre", "lavorare", "andare_trovare", "rinnovare", "richiedere"];
  function langOk(v, w, l, o) {
    if (LANG_VERBEN.includes(v.id)) return true;
    if (["andare", "tornare", "restare", "essere_luogo", "arrivare"].includes(v.id)) return Boolean(l && l.tags.some((x) => ["fern", "urlaub", "weit"].includes(x)));
    if (["comprare", "vendere"].includes(v.id)) return Boolean(o && o.einmalig);
    if (["cercare", "trovare"].includes(v.id)) return Boolean(o && ["lavoro_nomen", "appartamento"].includes(o.id));
    if (v.id === "avere") return Boolean(o && (o.einmalig || ["influenza", "febbre"].includes(o.id)));
    return false;
  }
  /* Spricht der Satz über die Zukunft? (futuro, oder domani/la prossima settimana …) */
  function zukunftBezug(w) {
    const zf = basisZeit(w);
    const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
    return zf === "futuro" || Boolean(t && (t.grp === "zukunft" || (t.grp === "samstag" && zf !== "passato")));
  }
  /* Welche Gründe passen zu diesem Satz (und in welcher Richtung)? */
  function gruendeFuer(w) {
    const v = wVerb(w);
    if (!v) return [];
    const k = schluessel(w);
    const neg = Boolean(w.neg);
    const vb = w.verbindung || "perche";
    const zf = basisZeit(w);
    const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
    const habit = t && ["gewohnheit", "saison", "freqvorn", "freq", "kind"].includes(t.grp);
    const out = [];
    /* „Prendo sempre l'autobus perché piove“ widerspricht sich — bei
       Gewohnheiten nur „quando/se“: „… quando piove“. */
    if (habit && (vb === "perche" || vb === "quindi")) return out;
    const zb = zukunftBezug(w);
    CAUSE.forEach((r) => {
      if (!ab(r.level, w.niveau)) return;
      if (vb === "quando" && !r.wieder) return;
      if (habit && !r.wieder) return;
      if (zb && (vb === "perche" || vb === "quindi") && !r.zukunft) return;
      if (r.id === "costa" && !(feldAktiv(w, "oggetto") && v.id === "comprare")) return;
      if (r.wunsch && feldAktiv(w, "modale") && w.modale === "dovere") return;
      if (r.id === "tardi" && t && !["stasera", "ieri_sera", "domani_sera"].includes(t.id)) return;
      if (r.id === "vacanza" && w.stato === "in_vacanza") return;
      if (r.id === "ritardo" && w.stato === "in_ritardo") return;
      const pro = r.pro.some((x) => k.includes(x)), contra = r.contra.some((x) => k.includes(x));
      const bedingung = vb === "se" || vb === "quando" || vb === "se2" || vb === "se3";
      const darfNeg = r.neg || (vb !== "quando" && bedingung && r.negBedingung);
      if (!neg) {
        if (pro && !contra && !(r.nurNegPerche && !bedingung)) out.push({ id: r.id, neg: false });
        if (contra && !pro && darfNeg && bedingung) out.push({ id: "non:" + r.id, neg: true });
      } else {
        if (contra && !pro) out.push({ id: r.id, neg: false });
        if (pro && !contra && darfNeg && !r.fixNeg && !(w.modale === "dovere" && feldAktiv(w, "modale"))
          && !(w.modale === "potere" && feldAktiv(w, "modale") && r.id !== "tempo")) out.push({ id: "non:" + r.id, neg: true });
      }
    });
    return out;
  }

  function detsFuer(v, o) {
    if (!o) return [];
    let d = (v.objDets && v.objDets[o.id]) || (v.dets ? v.dets.filter((x) => o.dets.includes(x)) : o.dets.slice());
    if (!d.length) d = o.dets.slice(0, 1);
    if (!v.possOk) d = d.filter((x) => x !== "poss");
    if (v.possNur && !v.possNur.includes(o.id)) d = d.filter((x) => x !== "poss");
    return d;
  }

  /* Die Angebote für ein Feld — immer abhängig von allem anderen. */
  function angebote(w, feld) {
    const v = wVerb(w);
    const lv = w.niveau || "A1";
    const zf = basisZeit(w);
    switch (feld) {
      case "verbo": return VERBI.filter((x) => ab(x.level, lv) && (!w.kategorie || w.kategorie === "alle" || x.kat.split(" ").includes(w.kategorie)));
      case "soggetto": {
        const e = EINLEITUNGEN.find((x) => x.id === w.einleitung && feldAktiv(w, "einleitung"));
        return SOGGETTI.filter((s) => ab(s.level, lv)
          && !(e && e.keinIo && s.id === "io")
          && !((w.satzart === "frage" || w.satzart === "wfrage") && s.id === "io")
          && !(w.satzart === "wfrage" && w.wort === "chi" && !["tu", "noi", "voi", "loro"].includes(s.id))
          && !(w.satzart === "wfrage" && s.id === "noi" && basisZeit(w) !== "presente")
          && !(v && v.keinSubjekt && v.keinSubjekt.includes(s.id))
          && !((w.satzart === "frage" || w.satzart === "wfrage") && s.id === "noi" && ["passato", "imperfetto", "trapassato", "condPassato"].includes(basisZeit(w)))
          && !(feldAktiv(w, "modo") && w.modo === "insieme" && s.p < 3)
          && !(feldAktiv(w, "compagnia") && (w.compagnia === s.rel || (s.fam && (PERSONE.find((p) => p.id === w.compagnia) || { tags: [] }).tags.includes("fam"))))
          && !(feldAktiv(w, "persona") && (w.persona === s.rel || (s.fam && (PERSONE.find((p) => p.id === w.persona) || { tags: [] }).tags.includes("fam")))));
      }
      case "zeitform": {
        if (w.verbindung === "se2" || w.verbindung === "se3") return ZEITFORMEN.filter((z) => z.id === basisZeit(w));
        const e = feldAktiv(w, "einleitung") ? EINLEITUNGEN.find((x) => x.id === w.einleitung) : null;
        const m = feldAktiv(w, "modale") ? MODALE[w.modale] : null;
        return ZEITFORMEN.filter((z) => {
          if (!ab(z.level, lv)) return false;
          if (v && v.keinPassato && ["passato", "trapassato", "condPassato"].includes(z.id)) return false;
          if (v && v.objKeinPassato && v.objKeinPassato.includes(w.oggetto) && ["passato", "trapassato", "condPassato"].includes(z.id)) return false;
          if (v && v.keinCond && ["condizionale", "condPassato"].includes(z.id) && !feldAktiv(w, "modale")) return false;
          if (w.satzart === "wfrage" && ["condizionale", "condPassato"].includes(z.id)) return false;
          if (z.id === "condizionale" && w.neg && w.quando !== "mai") return false;
          if (w.neg && w.satzart === "frage" && !["presente", "passato"].includes(z.id)) return false;
          if (w.satzart === "wfrage" && w.soggetto === "noi" && z.id !== "presente") return false;
          if (e && e.id === "so_che" && !["presente", "passato", "futuro", "imperfetto"].includes(z.id)) return false;
          if (m && !m.zeiten.includes(z.id)) return false;
          if (e && e.nurPresente && z.id !== "presente") return false;
          if (e && e.modus === "cong" && !(z.id === "presente" || (ab("C1", lv) && (z.id === "passato" || z.id === "imperfetto")))) return false;
          if (e && e.modus === "congPast" && !(z.id === "presente" || z.id === "passato")) return false;
          if (w.verbindung === "se" && feldAktiv(w, "causa") && !["presente", "futuro"].includes(z.id)) return false;
          if (w.verbindung === "quando" && feldAktiv(w, "causa") && !["presente", "futuro", "passato", "imperfetto"].includes(z.id)) return false;
          if (feldAktiv(w, "quando") && v && !zeitPasstZumVerb(TEMPO[w.quando], w, v, z.id)) return false;
          if (z.id === "imperfetto" && v && !feldAktiv(w, "quando") && brauchtGewohnheit(Object.assign({}, w, { tempo: "imperfetto" }), v)
            && !TEMPI.some((t) => ab(t.level, lv) && zeitPasstZumVerb(t, Object.assign({}, w, { tempo: "imperfetto" }), v, "imperfetto"))) return false;
          if (feldAktiv(w, "causa")) {
            const ww = Object.assign({}, w, { tempo: z.id });
            if (!gruendeFuer(ww).some((g) => g.id === w.causa)) return false;
          }
          return true;
        });
      }
      case "modale": {
        if (!v) return [];
        if (w.verbindung === "se3" || ["trapassato", "condPassato"].includes(zf)) return [];
        return MODALI.filter((m) => ab(m.level, lv) && v.modali.includes(m.id) && m.zeiten.includes(zf === "condizionale" && m.id === "vorrei" ? "presente" : zf)
          && !(m.id === "vorrei" && zf !== "presente")
          && !(m.id === "sapere" && (feldAktiv(w, "luogo") || feldAktiv(w, "compagnia") || feldAktiv(w, "mezzo") || (feldAktiv(w, "quando") && w.quando !== "da_bambino") || feldAktiv(w, "oggetto") && v.id !== "parlare" && v.id !== "suonare" && v.id !== "giocare"))
          && !(m.id === "sapere" && w.verbindung && feldAktiv(w, "causa"))
          && !(v.modalNurNeg && !w.neg)
          && !((m.id === "dovere" || m.id === "vorrei") && w.neg && w.satzart !== "aussage")
          && !(m.id === "dovere" && w.neg && !NICHT_MUESSEN.includes(v.id))
          && !(v.id === "essere_luogo" && !["presente", "futuro"].includes(zf))
          && !(w.neg && w.satzart === "frage" && !(m.id === "potere" && zf === "presente"))
          && !(m.id === "dovere" && feldAktiv(w, "einleitung") && w.einleitung === "importante_che")
          && !(m.id === "vorrei" && feldAktiv(w, "einleitung") && EINLEITUNGEN.find((e) => e.id === w.einleitung).modus !== "ind")
          && !(m.id === "dovere" && feldAktiv(w, "causa") && CAUSA[String(w.causa).replace(/^non:/, "")] && CAUSA[String(w.causa).replace(/^non:/, "")].wunsch)
          && !(v.objModali && feldAktiv(w, "oggetto") && v.objModali[w.oggetto] && !v.objModali[w.oggetto].includes(m.id))
          && !(m.id === "vorrei" && v.id === "essere_luogo" && feldAktiv(w, "luogo") && !LUOGO[w.luogo].tags.some((x) => ["urlaub", "natur", "fern", "draussen"].includes(x)))
          && !(feldAktiv(w, "modo") && w.modo === "volentieri")
          && !(feldAktiv(w, "quando") && ["gia"].includes(TEMPO[w.quando].grp))
          && !(feldAktiv(w, "quando") && w.quando === "mai" && zf === "passato")
          && !(feldAktiv(w, "quando") && TEMPO[w.quando].grp === "vergangen" && zf === "imperfetto" && !v.zustand && false));
      }
      case "oggetto": {
        if (!v || !v.obj) return [];
        const l = feldAktiv(w, "luogo") ? LUOGO[w.luogo] : null;
        const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
        return v.obj.map((id) => OGG[id]).filter((o) => o && ab(o.level, lv)
          && ortObjOk(v, l, o)
          && !(feldAktiv(w, "persona") && v.persObj && v.persObj[o.id] !== undefined && !personenPassend(w, v, v.persObj[o.id], "pers").some((p) => p.id === w.persona))
          && !(t && t.grp === "kind" && (o.alk || (["pizza"].includes(o.id) && false)))
          && !(t && t.grp === "kind" && ["caffe", "cappuccino"].includes(o.id))
          && !(t && o.einmalig && ["gewohnheit", "saison", "freqvorn", "freq", "kind"].includes(t.grp) && v.id !== "avere" && v.id !== "usare")
          && !(v.objKeinPassato && v.objKeinPassato.includes(o.id) && ["passato", "trapassato", "condPassato"].includes(zf))
          && !(feldAktiv(w, "modo") && ["molto", "poco"].includes(w.modo) && v.id !== "parlare")
          && !(feldAktiv(w, "modo") && w.modo === "volentieri" && !o.tags.some((x) => VOLENTIERI_DING.includes(x)))
          && !(feldAktiv(w, "modo") && ["bene", "male"].includes(w.modo) && v.id === "parlare" && !o.tags.includes("sprache"))
          && !(v.exklusiv && v.exklusiv.includes("oggetto") && v.exklusiv.some((f) => f !== "oggetto" && feldAktiv(w, f)))
          && !(o.alk && l && (l.tags.includes("arbeit") || l.tags.includes("bildung") || l.tags.includes("kantine")))
          && !(feldAktiv(w, "causa") && w.causa === "costa" && !o.tags.length));
      }
      case "det": {
        const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
        if (!v || !o) return [];
        let d = detsFuer(v, o);
        if (feldAktiv(w, "modo") && w.modo === "volentieri" && w.neg) d = d.filter((x) => x !== "indef");
        return d;
      }
      case "agg": {
        const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
        if (!v || !o || o.a || v.id === "avere" || v.objPraep || w.neg) return [];
        const det = w.det || detsFuer(v, o)[0];
        if (det === "ohne") return [];
        const ids = (v.objAdj && v.objAdj[o.id]) || o.adj || [];
        /* „una buona pizza“ ja — „la buona pizza“ klingt schief */
        return ids.map((id) => AGG[id]).filter((a) => a && ab(a.level, lv) && !(a.davor && det === "def" && !["nuovo", "vecchio"].includes(a.id)) && !(a.id === "buono" && det === "poss"));
      }
      case "stato": {
        if (!v || !v.stato) return [];
        return STATI.filter((s) => ab(s.level, lv) && !(feldAktiv(w, "causa") && String(w.causa).replace(/^non:/, "") === "vacanza" && s.id === "in_vacanza"));
      }
      case "persona": {
        if (!v || !v.pers) return [];
        const l = feldAktiv(w, "luogo") ? LUOGO[w.luogo] : null;
        if (v.exklusiv && v.exklusiv.includes("persona") && v.exklusiv.some((f) => f !== "persona" && feldAktiv(w, f))) return [];
        let tags = v.pers.tags;
        const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
        if (o && v.persObj && v.persObj[o.id] !== undefined) tags = v.persObj[o.id];
        let liste = personenPassend(w, v, tags, "pers");
        if (l && v.persOrt) {
          const erlaubt = v.persOrt[l.id];
          if (erlaubt !== undefined) liste = liste.filter((p) => p.tags.some((t) => erlaubt.split(" ").includes(t)));
          else if (!v.persOrt[l.id]) liste = liste.filter(() => !v.persOrtStreng);
        }
        return liste;
      }
      case "compagnia": {
        if (!v || !v.comp) return [];
        const l = feldAktiv(w, "luogo") ? LUOGO[w.luogo] : null;
        if (PRIVAT(l) && v.id !== "restare") return [];
        if (v.id === "andare" && l && RAUM_ORTE.includes(l.id)) return [];
        if (l && l.id === "letto") return [];
        if (feldAktiv(w, "modo") && ["insieme", "da_solo"].includes(w.modo)) return [];
        let liste = personenPassend(w, v, v.comp, "comp");
        const nurKollegenOrt = l && (l.tags.includes("arbeit") || l.tags.includes("kantine"));
        liste = liste.filter((p) => {
          if (p.tags.includes("kollegen") && l && !(l.tags.includes("arbeit") || l.tags.includes("gastro") || l.tags.includes("stadt") || l.tags.includes("sport") || l.tags.includes("kantine"))) return false;
          if (p.tags.includes("kollegen") && v.id === "andare" && !l) return false;
          if (nurKollegenOrt && v.id !== "parlare" && !(p.tags.includes("kollegen") || p.tags.includes("name"))) return false;
          if (p.tags.includes("cane") && l && !(l.tags.includes("nah") || l.tags.includes("draussen"))) return false;
          if (p.tags.includes("medico") && v.id !== "parlare") return false;
          if (l && (l.tags.includes("gesund") || l.tags.includes("amt")) && (p.tags.includes("kollegen") || p.tags.includes("freunde"))) return false;
          if (l && l.tags.includes("fest") && p.tags.includes("fam") && ["nonno", "nonna", "nonni"].includes(p.id)) return false;
          if (["nonno", "nonna", "nonni"].includes(p.id) && schluessel(w).some((k) => ["sport", "fest", "tanzen"].includes(k))) return false;
          return true;
        });
        return liste;
      }
      case "rolle": return v ? rollenVon(v) : [];
      case "luogo": {
        if (!v || !v.ort) return [];
        const rolle = rolleVon(w, v);
        const ids = v.ort[rolle] || [];
        const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
        const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
        const mz = feldAktiv(w, "mezzo") ? MEZZO[w.mezzo] : null;
        if (v.exklusiv && v.exklusiv.includes("luogo") && v.exklusiv.some((f) => f !== "luogo" && feldAktiv(w, f))) return [];
        return ids.map((id) => LUOGO[id]).filter((l) => l && ab(l.level, lv)
          && (!o || ortObjOk(v, l, o))
          && !(mz && !mezzoPasstZuOrt(mz, l))
          && !(feldAktiv(w, "persona") && v.persOrt && v.persOrt[l.id] !== undefined && !personenPassend(w, v, v.persOrt[l.id], "pers").some((p) => p.id === w.persona))
          && !(feldAktiv(w, "persona") && v.persOrt && v.persOrt[l.id] === undefined && v.id !== "aiutare" && false)
          && !(feldAktiv(w, "compagnia") && (PRIVAT(l) && v.id !== "restare" || l.id === "letto"))
          && !(t && !zeitPasstZumVerb(t, Object.assign({}, w, { luogo: l.id }), v, zf))
          && !(o && o.alk && (l.tags.includes("arbeit") || l.tags.includes("bildung") || l.tags.includes("kantine")))
          && !(feldAktiv(w, "modo") && !prestoTardiOk(w.modo, v, w, l.id))
          && !(v.id === "andare" && RAUM_ORTE.includes(l.id) && (feldAktiv(w, "modo") || feldAktiv(w, "compagnia")))
          && !(feldAktiv(w, "modo") && w.modo === "volentieri" && ["andare", "tornare"].includes(v.id) && !l.tags.some((x) => FREIZEIT_ORT.includes(x)))
          && !(feldAktiv(w, "modale") && w.modale === "vorrei" && v.id === "essere_luogo" && !l.tags.some((x) => ["urlaub", "natur", "fern", "draussen"].includes(x)))
          && !(feldAktiv(w, "modo") && w.modo === "fino_tardi" && v.id === "restare" && l.id !== "ufficio")
          && !(feldAktiv(w, "modo") && w.modo === "volentieri" && !w.neg && (l.tags.includes("gesund") || l.tags.includes("amt") || l.tags.includes("anlass")))
          && !(feldAktiv(w, "compagnia") && personIstKollege(w.compagnia) && !(l.tags.includes("arbeit") || l.tags.includes("gastro") || l.tags.includes("stadt") || l.tags.includes("sport") || l.tags.includes("kantine")))
          && !(feldAktiv(w, "compagnia") && ["cane"].includes(w.compagnia) && !(l.tags.includes("nah") || l.tags.includes("draussen")))
          && !(feldAktiv(w, "compagnia") && (l.tags.includes("gesund") || l.tags.includes("amt")) && personHatTag(w.compagnia, ["kollegen", "freunde"]))
          && !(feldAktiv(w, "compagnia") && (l.tags.includes("arbeit") || l.tags.includes("kantine")) && v.id !== "parlare" && !personHatTag(w.compagnia, ["kollegen", "name"]))
          && !(feldAktiv(w, "compagnia") && l.tags.includes("fest") && ["nonno", "nonna", "nonni"].includes(w.compagnia))
          && !(feldAktiv(w, "stato") && false));
      }
      case "mezzo": {
        if (!v || !v.mezzo) return [];
        const l = feldAktiv(w, "luogo") ? LUOGO[w.luogo] : (v.mezzoOrt ? LUOGO[v.mezzoOrt] : null);
        if (!l && v.ort) return [];
        return MEZZI.filter((m) => ab(m.level, lv) && (!v.mezziNur || v.mezziNur.includes(m.id)) && (!l || mezzoPasstZuOrt(m, l))
          && !(v.id === "tornare" && rolleVon(w, v) === "da" && m.id === "aereo" && !(l && l.tags.includes("fern"))));
      }
      case "quando": {
        if (!v) return [];
        return TEMPI.filter((t) => ab(t.level, lv) && zeitPasstZumVerb(t, w, v, zf) && !(t.grp === "mai" && istFrage(w))
          && !(istFrage(w) && ["freqvorn", "gia"].includes(t.grp) && false));
      }
      case "modo": {
        if (!v) return [];
        const l = feldAktiv(w, "luogo") ? LUOGO[w.luogo] : null;
        const o = feldAktiv(w, "oggetto") ? OGG[w.oggetto] : null;
        const si = subjektInfo(wSubj(w), w.genus);
        const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
        return v.modi.map((id) => MODO[id]).filter((m) => m && ab(m.level, lv)
          && !(m.id === "insieme" && (!si.pl || feldAktiv(w, "compagnia")))
          && !(m.id === "da_solo" && feldAktiv(w, "compagnia"))
          && !(["molto", "poco"].includes(m.id) && o && v.id !== "parlare")
          && !(["molto", "poco"].includes(m.id) && v.id === "parlare" && feldAktiv(w, "compagnia") && !o)
          && !(["bene", "male"].includes(m.id) && v.id === "parlare" && (!o || feldAktiv(w, "compagnia")))
          && !(["molto", "poco", "bene", "male"].includes(m.id) && feldAktiv(w, "causa"))
          && !(w.neg && feldAktiv(w, "causa"))
          && !(w.neg && ["con_calma", "in_fretta", "a_voce_alta", "con_attenzione", "fino_tardi", "presto"].includes(m.id))
          && !((w.verbindung === "se2" || w.verbindung === "se3") && feldAktiv(w, "causa") && ["con_calma", "in_fretta"].includes(m.id))
          && !(w.neg && w.satzart === "frage")
          && !(m.id === "volentieri" && feldAktiv(w, "causa") && !(CAUSA[String(w.causa).replace(/^non:/, "")] || {}).wunsch)
          && !(["bene", "male"].includes(m.id) && v.id === "parlare" && w.satzart === "wfrage" && w.wort === "conchi")
          && !(m.id === "da_solo" && v.id === "essere_luogo" && l && !l.tags.some((x) => FREIZEIT_ORT.includes(x)))
          && !(m.id === "volentieri" && w.neg && w.satzart !== "aussage")
          && !(m.id === "volentieri" && feldAktiv(w, "modale"))
          && !(m.id === "volentieri" && w.neg && o && (w.det || detsFuer(v, o)[0]) === "indef")
          && !(m.id === "volentieri" && !w.neg && l && (l.tags.includes("gesund") || l.tags.includes("amt") || l.tags.includes("anlass")))
          && !(m.id === "volentieri" && ["andare", "tornare"].includes(v.id) && l && !l.tags.some((x) => FREIZEIT_ORT.includes(x)))
          && !(m.id === "volentieri" && o && !o.tags.some((x) => VOLENTIERI_DING.includes(x)))
          && !(["presto", "tardi", "fino_tardi"].includes(m.id) && istFrage(w))
          && !(["molto", "poco"].includes(m.id) && istFrage(w) && w.wort === "quando")
          && !(["molto", "poco"].includes(m.id) && t && !["gewohnheit", "freqvorn", "saison", "kind", "heute", "jetzt", "vergangen"].includes(t.grp))
          && prestoTardiOk(m.id, v, w, l ? l.id : "")
          && !(v.id === "andare" && l && RAUM_ORTE.includes(l.id))
          && !(["presto", "tardi", "fino_tardi"].includes(m.id) && t && t.grp === "uhr")
          && !(m.id === "fino_tardi" && v.id === "restare" && (!l || l.id !== "ufficio"))
          && !(m.id === "al_telefono" && !feldAktiv(w, "compagnia"))
          && !(["in_italiano", "in_tedesco"].includes(m.id) && v.id === "scrivere" && !o && false)
          && !(m.id === "insieme" && feldAktiv(w, "persona") && false));
      }
      case "causa": {
        if (!v) return [];
        if (wFeld(w) === "causa") return [];
        return gruendeFuer(w).map((g) => Object.assign({}, CAUSA[g.id.replace(/^non:/, "")], { id: g.id, gneg: g.neg }));
      }
      case "verbindung": {
        if (!v) return [];
        return VERBINDUNGEN.filter((b) => ab(b.level, lv)
          && !(w.satzart === "wfrage")
          && !(w.satzart === "frage" && b.id !== "perche")
          && !(feldAktiv(w, "einleitung") && b.id !== "perche")
          && !(b.id === "se" && !["presente", "futuro"].includes(w.tempo || "presente"))
          && !(b.id === "quando" && !["presente", "futuro", "passato", "imperfetto"].includes(w.tempo || "presente"))
          && !(b.id === "se2" && feldAktiv(w, "modale") && ["sapere", "vorrei"].includes(w.modale))
          && !(b.id === "se3" && feldAktiv(w, "modale"))
          && !((b.id === "se2" || b.id === "se3") && v.keinPassato && b.id === "se3")
          && !((b.id === "se2" || b.id === "se3") && v.keinCond)
          && !((b.id === "se2" || b.id === "se3") && feldAktiv(w, "quando") && !zeitPasstZumVerb(TEMPO[w.quando], Object.assign({}, w, { verbindung: b.id }), v, b.id === "se2" ? "condizionale" : "condPassato")));
      }
      case "einleitung": {
        if (!v || w.satzart !== "aussage") return [];
        if (feldAktiv(w, "verbindung") && w.verbindung !== "perche") return [];
        const si = wSubj(w);
        return EINLEITUNGEN.filter((e) => ab(e.level, lv) && !(e.keinIo && si.id === "io")
          && !(e.id === "so_che" && !["presente", "passato", "futuro", "imperfetto"].includes(zf))
          && !(e.nurPresente && zf !== "presente")
          && !(e.modus === "cong" && !(zf === "presente" || (ab("C1", lv) && (zf === "passato" || zf === "imperfetto"))))
          && !((e.modus === "cong" || e.modus === "congPast") && feldAktiv(w, "modale") && w.modale === "vorrei")
          && !(e.modus === "congPast" && !(zf === "presente" || zf === "passato")));
      }
      case "wort": {
        if (!v) return [];
        const r = rolleVon(w, v);
        return WFRAGEN.filter((f) => {
          if (f.id === "checosa") return Boolean(v.obj) && !["chiedere", "prepararsi", "giocare", "lavarsi", "avere", "chiamare"].includes(v.id) && !(v.exklusiv && feldAktiv(w, "persona"));
          /* „Chi aiuta Giulia?“ hieße „Wer hilft Giulia?“ — deshalb nur mit tu/noi/voi/loro */
          if (f.id === "chi") return v.pers && v.pers.typ === "dir" && !(v.exklusiv && feldAktiv(w, "oggetto")) && ["tu", "noi", "voi", "loro"].includes(w.soggetto);
          if (f.id === "achi") return v.pers && v.pers.typ === "a" && !(v.exklusiv && feldAktiv(w, "luogo"));
          if (f.id === "conchi") return Boolean(v.comp) && !(feldAktiv(w, "modo") && ["insieme", "da_solo"].includes(w.modo));
          if (f.id === "dove") return Boolean(v.ort) && (r === "stato" || r === "moto") && !(v.exklusiv && feldAktiv(w, "persona"))
            && angebote(Object.assign({}, w, { satzart: "aussage", luogo: "" }), "luogo").length > 0;
          if (f.id === "dadove") return Boolean(v.ort) && r === "da" && v.id !== "telefonare" && v.id !== "uscire";
          if (f.id === "come") return Boolean(v.mezzo) && (!v.ort || feldAktiv(w, "luogo") || v.mezzoOrt);
          if (f.id === "quando") return !(v.id === "avere" && basisZeit(w) === "passato") && !v.zeitNur;
          if (f.id === "perche") return true;
          return false;
        });
      }
      default: return [];
    }
  }
  /* „presto“ heißt früh — aber in „arriverà presto“ heißt es „bald“.
     Deshalb nur, wo es eindeutig „früh“ ist. */
  function prestoTardiOk(id, v, w, luogo) {
    if (id !== "presto" && id !== "tardi") return true;
    const zf = basisZeit(w);
    if (v.id === "andare") return luogo === "letto";
    if (v.id === "tornare" && luogo && luogo !== "casa") return false;
    if (v.id === "arrivare" && luogo && !["lavoro", "ufficio", "scuola", "universita", "casa"].includes(luogo)) return false;
    if (id === "presto" && ["arrivare", "tornare", "uscire", "partire"].includes(v.id) && !["passato", "imperfetto", "trapassato"].includes(zf)) return false;
    return true;
  }
  /* „non devo …“ = „ich muss nicht …“ nur, wo man sonst müsste */
  const NICHT_MUESSEN = ["alzarsi", "lavorare", "studiare", "andare", "fare_compiti", "fare_spesa", "pagare", "prendere", "cucinare", "tornare",
    "pulire", "lavare", "stirare", "fare_bucato", "ripetere", "finire", "partire", "arrivare", "restare", "fare_sport", "dimenticare", "fumare", "perdere"];
  const FREIZEIT_ORT = ["gastro", "kultur", "natur", "draussen", "sport", "fest", "person", "fern", "stadt", "shop", "urlaub", "bad", "ausflug"];
  const VOLENTIERI_DING = ["essen", "trinken", "lesen", "musik", "film", "sport", "spiel_drinnen", "sprache", "instrument"];
  function personIstKollege(id) { const p = PERSONE.find((x) => x.id === id); return Boolean(p && p.tags.includes("kollegen")); }
  function personHatTag(id, tags) { const p = PERSONE.find((x) => x.id === id); return Boolean(p && p.tags.some((t) => tags.includes(t))); }
  function ortObjOk(v, l, o) {
    if (!l || !o) return true;
    if (v.ortObj && v.ortObj[l.id]) return v.ortObj[l.id].includes(o.id);
    if (v.ortObjFern && l.tags.includes("fern")) return v.ortObjFern.includes(o.id);
    if (v.ortObjStandard) return v.ortObjStandard.includes(o.id);
    return true;
  }

  /* ===================================================================
     6. PRÜFEN — passt alles zusammen?
     =================================================================== */
  const FELDER = ["soggetto", "zeitform", "modale", "oggetto", "det", "agg", "stato", "persona", "compagnia", "rolle", "luogo", "mezzo",
    "quando", "modo", "causa", "verbindung", "einleitung", "wort"];
  const FELD_NAMEN = {
    soggetto: "Wer", zeitform: "Zeitform", modale: "Modalverb", oggetto: "Was", det: "Begleiter", agg: "Eigenschaft", stato: "Wie ist …",
    persona: "Wen/Wem", compagnia: "Mit wem", rolle: "Ortsfrage", luogo: "Wo/Wohin/Woher", mezzo: "Womit", quando: "Wann", modo: "Wie",
    causa: "Warum", verbindung: "Verbindung", einleitung: "Einleitung", wort: "Fragewort", verbo: "Verb", neg: "Verneinung",
  };
  function wert(w, feld) { return feld === "zeitform" ? w.tempo : w[feld]; }
  function effVerbindung(w) { return feldAktiv(w, "causa") ? (w.verbindung || "perche") : ""; }

  /* Fehlende Pflichtteile mit dem ersten passenden Angebot füllen */
  function normalisiere(w0) {
    const w = Object.assign({ niveau: "A1", soggetto: "io", genus: "m", tempo: "presente", satzart: "aussage" }, w0 || {});
    if (w.quando === "mai") w.neg = true;
    if (!feldAktiv(w, "causa")) { w.verbindung = w.verbindung === "se2" || w.verbindung === "se3" ? "" : w.verbindung; }
    if (feldAktiv(w, "causa") && (w.verbindung === "se2" || w.verbindung === "se3")) w.tempo = basisZeit(w);
    if (w.satzart !== "aussage") w.einleitung = "";
    if (w.satzart === "wfrage" && w.wort !== "perche") w.neg = w.quando === "mai" ? w.neg : false;
    const v = wVerb(w);
    if (!v) return w;
    const r = rollenVon(v);
    if (r.length && !r.includes(w.rolle)) w.rolle = r[0];
    if (!r.length) w.rolle = "";
    const wf = wFeld(w);
    if (wf && !leer(w[wf])) w[wf] = "";
    if (wf === "causa") w.verbindung = "";
    const erstes = (feld) => { const a = angebote(w, feld); return a.length ? a[0].id : ""; };
    if (v.stato && !w.stato) w.stato = erstes("stato");
    if (v.objPflicht && !w.oggetto && wf !== "oggetto") w.oggetto = erstes("oggetto");
    if (feldAktiv(w, "oggetto")) {
      const d = angebote(w, "det");
      if (!d.includes(w.det)) w.det = d[0] || "";
    } else { w.det = ""; w.agg = ""; }
    if (v.persPflicht && !w.persona && wf !== "persona") w.persona = erstes("persona");
    if (v.ortPflicht && !w.luogo && wf !== "luogo") w.luogo = erstes("luogo");
    if (v.modoPflicht && !w.modo) w.modo = erstes("modo");
    if (brauchtGewohnheit(w, v) && !w.quando) {
      const a = angebote(w, "quando");
      const lieb = a.find((x) => x.id === "di_solito") || a.find((x) => x.id === "da_bambino") || a[0];
      if (lieb) w.quando = lieb.id;
    }
    if (v.einsVon && !v.einsVon.some((f) => feldAktiv(w, f) || wf === f)) {
      for (const f of v.einsVon) { const x = erstes(f); if (x) { w[f] = x; if (f === "oggetto") { const d = angebote(w, "det"); w.det = d[0] || ""; } break; } }
    }
    return w;
  }

  /* „Giocavo a calcio.“ allein klingt unfertig — bei Handlungen braucht
     das imperfetto eine Gewohnheit (di solito, da bambino, ogni estate …)
     oder einen „quando“-Satz. */
  function brauchtGewohnheit(w, v) {
    return basisZeit(w) === "imperfetto" && !v.zustand && !feldAktiv(w, "modale")
      && !(effVerbindung(w) === "quando") && wFeld(w) !== "quando";
  }
  /* „Compilerebbe un modulo.“ klingt unfertig. Der condizionale braucht
     einen Anlass: volentieri, ein Modalverb (potrei, dovrei), einen
     se-Satz oder einen Zustand („sarei contento“). Das trapassato steht
     allein nur mit „già“ („Avevo già mangiato.“). */
  function condOhneAnlass(w, v) {
    const zf = basisZeit(w);
    const vb = effVerbindung(w);
    if (feldAktiv(w, "einleitung")) return "";
    if (zf === "condizionale" && vb !== "se2" && !feldAktiv(w, "modale") && w.modo !== "volentieri" && v.id !== "essere_agg")
      return "Der condizionale („würde …“) braucht hier einen Anlass: volentieri (gern), ein Modalverb (potrei, dovrei) oder einen se-Satz.";
    if (zf === "condPassato" && vb !== "se3" && w.modo !== "volentieri" && v.id !== "essere_agg")
      return "Der condizionale passato („wäre/hätte …“) braucht hier „volentieri“ oder einen se-Satz („Se avessi avuto tempo, …“).";
    if (zf === "trapassato" && w.quando !== "gia")
      return "Das trapassato prossimo („hatte … gemacht“) steht allein nur mit „già“: „Avevo già mangiato.“";
    return "";
  }
  function pruefe(w0) {
    const w = normalisiere(w0);
    const v = wVerb(w);
    const probleme = [];
    if (!v) return { ok: false, w, probleme: [{ feld: "verbo", text: "Kein Verb gewählt." }] };
    if (!angebote(w, "verbo").some((x) => x.id === v.id)) probleme.push({ feld: "verbo", text: "„" + v.it + "“ gibt es auf diesem Niveau oder in diesem Bereich nicht." });
    FELDER.forEach((f) => {
      const x = wert(w, f);
      if (leer(x)) return;
      if (f === "det" || f === "rolle") {
        const a = angebote(w, f);
        if (a.length && !a.includes(x)) probleme.push({ feld: f, wert: x });
        return;
      }
      if (f === "verbindung" && !feldAktiv(w, "causa")) return;
      if (f === "wort" && w.satzart !== "wfrage") return;
      if (wFeld(w) === f) return;
      const a = angebote(w, f);
      if (!a.some((y) => y.id === x)) probleme.push({ feld: f, wert: x });
    });
    const wf = wFeld(w);
    const fehlt = (f) => !feldAktiv(w, f) && wf !== f;
    if (v.objPflicht && fehlt("oggetto")) probleme.push({ feld: "oggetto", pflicht: true });
    if (v.ortPflicht && fehlt("luogo")) probleme.push({ feld: "luogo", pflicht: true });
    if (v.persPflicht && fehlt("persona")) probleme.push({ feld: "persona", pflicht: true });
    if (v.stato && fehlt("stato")) probleme.push({ feld: "stato", pflicht: true });
    if (v.modoPflicht && fehlt("modo")) probleme.push({ feld: "modo", pflicht: true });
    const anlassFehlt = condOhneAnlass(w, v);
    if (anlassFehlt) probleme.push({ feld: "condAnlass", text: anlassFehlt });
    if (brauchtGewohnheit(w, v) && !feldAktiv(w, "quando")) probleme.push({ feld: "quando", pflicht: true, text: "Im imperfetto braucht eine Handlung eine Gewohnheit: di solito, da bambino, ogni estate … — oder nimm das passato prossimo." });
    if (v.einsVon && !v.einsVon.some((f) => feldAktiv(w, f) || wf === f)) probleme.push({ feld: v.einsVon[0], pflicht: true });
    if (v.exklusiv && v.exklusiv.filter((f) => feldAktiv(w, f)).length > 1) probleme.push({ feld: v.exklusiv[1], wert: w[v.exklusiv[1]] });
    if (w.satzart === "wfrage" && w.neg && w.wort !== "perche") probleme.push({ feld: "neg", wert: true });
    /* Mehr als vier freie Angaben in einem Satz klingen nach Liste, nicht nach Sprache */
    const frei = ["quando", "modo", "compagnia", "mezzo", "agg", "causa"].filter((f) => feldAktiv(w, f)).length
      + (feldAktiv(w, "luogo") && !v.ortPflicht ? 1 : 0) + (feldAktiv(w, "persona") && !v.persPflicht ? 1 : 0)
      + (feldAktiv(w, "oggetto") && !v.objPflicht ? 1 : 0) + (feldAktiv(w, "modale") ? 1 : 0);
    const grenze = (feldAktiv(w, "einleitung") || feldAktiv(w, "causa") || w.neg) ? 3 : 4;
    if (frei > grenze) probleme.push({ feld: "zuviel", text: "Das sind zu viele Angaben für einen Satz — das klingt nach einer Liste. Lass eine weg oder erzähl mit „+ zweiter Satz“ weiter." });
    if (w.quando === "gia" && w.neg) probleme.push({ feld: "neg", wert: true });
    if (v.negNurMai && w.neg && w.quando !== "mai") probleme.push({ feld: "neg", wert: true, text: "„" + v.it + "“ verneint klingt komisch — außer mit „mai“ (nie): „Non ho mai perso …“." });
    probleme.forEach((p) => { p.text = p.text || problemText(w, p); });
    return { ok: probleme.length === 0, w, probleme };
  }
  function anzeigeWert(w, feld, x) {
    const v = wVerb(w);
    const si = subjektInfo(wSubj(w), w.genus);
    try {
      switch (feld) {
        case "soggetto": return (SOGGETTI.find((s) => s.id === x) || {}).it || x;
        case "zeitform": return (ZEITFORMEN.find((z) => z.id === x) || {}).it || x;
        case "modale": return (MODALE[x] || {}).it || x;
        case "oggetto": { const o = OGG[x]; return o ? o.n.it : x; }
        case "persona": case "compagnia": { const p = PERSONE.find((q) => q.id === x); return p ? personIt(p, si, feld === "compagnia" ? "con" : "") : x; }
        case "luogo": { const l = LUOGO[x]; return l ? l.it : x; }
        case "mezzo": return (MEZZO[x] || {}).it || x;
        case "quando": return (TEMPO[x] || {}).it || x;
        case "modo": return (MODO[x] || {}).it || x;
        case "causa": { const c = CAUSA[String(x).replace(/^non:/, "")]; return c ? (/^non:/.test(x) ? "non " : "") + grundItKurz(c) : x; }
        case "stato": return (STATO[x] || {}).it || x;
        case "neg": return "non";
        default: return String(x);
      }
    } catch (e) { return String(x); }
  }
  function grundItKurz(c) {
    const i = c.it;
    if (i.v === "essere") return "essere " + (i.adj || i.fest);
    if (i.v === "avere") return "avere " + i.rest;
    if (i.v === "impers") return i.f.presente;
    if (i.v === "fare3") return "fa " + i.rest;
    if (i.v === "esserci") return (i.pl ? "ci sono " : "c'è ") + i.rest;
    if (i.v === "essere3") return i.subj + " è " + i.adj;
    if (i.v === "essere3v") return "è " + i.rest;
    if (i.v === "rifl") return "annoiarsi";
    if (i.v === "costare") return "costa troppo";
    return c.id;
  }
  function problemText(w, p) {
    const n = FELD_NAMEN[p.feld] || p.feld;
    if (p.pflicht) return "Zu diesem Verb gehört noch „" + n + "“ — aber mit der jetzigen Wahl passt nichts dazu.";
    return "„" + anzeigeWert(w, p.feld, p.wert) + "“ (" + n + ") passt nicht zu dem, was sonst im Satz steht.";
  }

  /* ===================================================================
     7. DER ITALIENISCHE SATZ UND SEINE DEUTSCHE BEDEUTUNG
     =================================================================== */
  function itZeitVon(w) {
    const base = basisZeit(w);
    const e = w.satzart === "aussage" && feldAktiv(w, "einleitung") ? EINLEITUNGEN.find((x) => x.id === w.einleitung) : null;
    if (e && e.modus === "cong") return { presente: "congiuntivo", passato: "congPassato", imperfetto: "congImperfetto", condizionale: "condizionale" }[base] || "congiuntivo";
    if (e && e.modus === "congPast") return { presente: "congImperfetto", passato: "congTrapassato" }[base] || "congImperfetto";
    return base;
  }
  function deZeitVon(w, dv, modal) {
    const base = basisZeit(w);
    const e = w.satzart === "aussage" && feldAktiv(w, "einleitung") ? EINLEITUNGEN.find((x) => x.id === w.einleitung) : null;
    if (e && e.modus === "congPast") return base === "passato" ? "plusq" : "praes";
    switch (base) {
      case "presente": return "praes";
      case "passato": return (modal || dv === DE_SEIN || dv === DE_HABEN) ? "praet" : "perf";
      case "imperfetto": return "praet";
      case "futuro": return "fut";
      case "condizionale": return "k2";
      case "trapassato": return "plusq";
      case "condPassato": return "k2v";
      default: return "praes";
    }
  }
  function enklitisch(inf, p) { return inf.slice(0, -1) + RIFL[p]; }

  /* Der Verbblock: non + mi/ti/si + Verb (+ già/sempre/mai/spesso) + Partizip/Infinitiv */
  function itVerbblock(v, w, si, itZeit, freqWort0) {
    const t = [];
    /* sempre, mai, già stehen zwischen Hilfsverb und Partizip („non sono
       mai stato“), spesso lieber dahinter („sono andato spesso“) */
    const spaet = freqWort0 === "spesso";
    const freqWort = spaet ? "" : freqWort0;
    const m = feldAktiv(w, "modale") ? MODALE[w.modale] : null;
    const rifl = Boolean(v.v.rifl);
    const p = si.p;
    if (w.neg) t.push("non");
    if (!m) {
      if (rifl) t.push(RIFL[p]);
      if (istZusammengesetzt(itZeit)) {
        const aux = hilfsverb(v.v);
        t.push(hilfsForm(aux, itZeit, p));
        if (freqWort) t.push(freqWort);
        t.push(aux === "essere" ? partizipForm(v.v, si.g, si.pl) : partizip(v.v));
      } else {
        t.push(einfach(v.v, itZeit, p));
        if (freqWort) t.push(freqWort);
      }
    } else {
      const mz = m.festCond ? "condizionale" : itZeit;
      const inf = rifl ? enklitisch(v.v.inf, p) : v.v.inf;
      if (istZusammengesetzt(mz)) {
        const aux = rifl ? "avere" : hilfsverb(v.v);
        t.push(hilfsForm(aux, mz, p));
        if (freqWort) t.push(freqWort);
        t.push(aux === "essere" ? partizipForm(m.v, si.g, si.pl) : partizip(m.v));
      } else {
        t.push(einfach(m.v, mz, p));
        if (freqWort) t.push(freqWort);
      }
      t.push(inf);
    }
    if (spaet) t.push(freqWort0);
    return t;
  }

  function agrForm(basis, g, pl) {
    // da solo → da sola / da soli / da sole ; stanco → stanca / stanchi / stanche
    const teile = basis.split(" ");
    const letztes = teile.pop();
    return teile.concat([adjForm({ it: letztes }, g, pl)]).join(" ");
  }

  /* Teile des italienischen Hauptsatzes (ohne Grund/Einleitung)
     Aussage:  [Pronomen] [Zeit] [Nomen-Subjekt] Verb … Ergänzungen
     W-Frage:  Fragewort Verb … Ergänzungen [Subjekt] [Zeit]
               („Con chi va al cinema Marco stasera?“) — bei „perché“
               steht ein Subjekt vor dem Verb („Perché Marco resta a casa?“) */
  function itTeileHaupt(w, v, si, opt) {
    const itZeit = opt.itZeit;
    const teile = [];
    const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
    const freq = t && t.verb ? t.it : "";
    const zeitVorn = t && !t.verb ? (t.agr ? agrForm("da bambino", si.g, si.pl) : t.it) : "";
    const subjSichtbar = !opt.subjVerschwiegen && (!si.sog.pron || (w.pronome && w.satzart !== "wfrage") || opt.pronZwang);
    const subjTeil = subjSichtbar ? { t: si.sog.it, rolle: "wer" } : null;
    const wfrage = w.satzart === "wfrage";
    const warum = wfrage && w.wort === "perche";
    if (wfrage) {
      teile.push({ t: WFRAGEN.find((x) => x.id === w.wort).it, rolle: "w" });
      if (warum && subjTeil) teile.push(subjTeil);
    } else {
      if (subjTeil && si.sog.pron) teile.push(subjTeil);
      if (zeitVorn) teile.push({ t: zeitVorn, rolle: "wann" });
      if (subjTeil && !si.sog.pron) teile.push(subjTeil);
    }
    const vb = itVerbblock(v, w, si, itZeit, freq);
    teile.push({ t: vb.join(" "), rolle: "verb" });
    const modo = feldAktiv(w, "modo") ? MODO[w.modo] : null;
    if (modo && modo.pos === "verb") teile.push({ t: modo.it, rolle: "wie" });
    if (v.fest) teile.push({ t: v.fest, rolle: "verb" });
    const rest = [];
    if (feldAktiv(w, "oggetto")) {
      const o = OGG[w.oggetto];
      let det = w.det || detsFuer(v, o)[0];
      if (w.neg && det === "part") det = "ohne";
      const agg = feldAktiv(w, "agg") ? AGG[w.agg] : null;
      let ph;
      if (o.a) ph = det === "def" ? verschmelze("a", nominal(o.n, "def", null, si.p)) : "a " + o.n.it;
      else ph = nominal(o.n, det, agg, si.p);
      if (v.objPraep) ph = v.objPraep + " " + ph;
      rest.push({ t: ph, rolle: "was" });
    }
    if (feldAktiv(w, "stato")) {
      const st = STATO[w.stato];
      rest.push({ t: st.fest ? st.it : agrForm(st.it, si.g, si.pl), rolle: "was" });
    }
    if (feldAktiv(w, "persona")) {
      const pe = PERSONE.find((x) => x.id === w.persona);
      rest.push({ t: personIt(pe, si, v.pers.typ === "a" ? "a" : ""), rolle: "wen" });
    }
    if (feldAktiv(w, "luogo")) {
      const l = LUOGO[w.luogo];
      const r = rolleVon(w, v);
      const txt = r === "da" ? ((v.itDa && v.itDa[l.id]) || l.da) : (r === "per" ? l.per : l.it);
      rest.push({ t: txt, rolle: r === "da" ? "woher" : (r === "moto" || r === "per" ? "wohin" : "wo") });
    }
    if (feldAktiv(w, "mezzo")) rest.push({ t: MEZZO[w.mezzo].it, rolle: "womit" });
    if (feldAktiv(w, "compagnia")) {
      const pe = PERSONE.find((x) => x.id === w.compagnia);
      rest.push({ t: personIt(pe, si, "con"), rolle: "mitwem" });
    }
    if (modo && modo.pos === "ende") rest.push({ t: modo.agr ? agrForm(modo.it, si.g, si.pl) : modo.it, rolle: "wie" });
    rest.forEach((x) => teile.push(x));
    if (wfrage && !warum && subjTeil) teile.push(subjTeil);
    if (wfrage && zeitVorn) teile.push({ t: zeitVorn, rolle: "wann" });
    return teile;
  }

  /* --- Der Grund als kleiner italienischer Satz ---------------------- */
  function itGrund(c, neg, si, zeit, w) {
    const i = c.it;
    const non = neg || i.fixNeg ? "non " : "";
    const p = si.p;
    const E3 = (z) => z === "congTrapassato" ? null : einfach(ESSERE, z, 2);
    switch (i.v) {
      case "essere": {
        const pr = i.fest ? i.fest : agrForm(i.adj, si.g, si.pl);
        if (zeit === "congTrapassato") return non + einfach(ESSERE, "congImperfetto", p) + " " + partizipForm(ESSERE, si.g, si.pl) + " " + pr;
        return non + einfach(ESSERE, zeit, p) + " " + pr;
      }
      case "avere":
        if (zeit === "congTrapassato") return non + einfach(AVERE, "congImperfetto", p) + " avuto " + i.rest;
        return non + einfach(AVERE, zeit, p) + " " + i.rest;
      case "impers": return non + i.f[zeit];
      case "fare3":
        if (zeit === "congTrapassato") return non + "avesse fatto " + i.rest;
        return non + einfach(C.fare, zeit, 2) + " " + i.rest;
      case "esserci": {
        const n = i.pl ? 5 : 2;
        let f;
        if (zeit === "congTrapassato") f = einfach(ESSERE, "congImperfetto", n) + " " + partizipForm(ESSERE, "m", i.pl);
        else f = einfach(ESSERE, zeit, n);
        const ci = /^[eè]/.test(f) ? "c'" : "ci ";
        return non + ci + f + " " + i.rest;
      }
      case "essere3":
        if (zeit === "congTrapassato") return i.subj + " " + non + "fosse stato " + i.adj;
        return i.subj + " " + non + E3(zeit) + " " + i.adj;
      case "essere3v": {
        const g = /il compleanno/.test(i.rest) ? "m" : "m";
        if (zeit === "congTrapassato") return non + "fosse stato " + i.rest;
        return non + E3(zeit) + " " + i.rest;
      }
      case "rifl": {
        const vv = R(i.inf, { rifl: true });
        if (zeit === "congTrapassato") return non + RIFL[p] + " " + einfach(ESSERE, "congImperfetto", p) + " " + partizipForm(vv, si.g, si.pl);
        return non + RIFL[p] + " " + einfach(vv, zeit, p);
      }
      case "costare": {
        const o = OGG[w.oggetto];
        const n = o && o.n.pl ? 5 : 2;
        return non + einfach(R("costare"), zeit === "congTrapassato" ? "imperfetto" : zeit, n) + " troppo";
      }
      default: return "";
    }
  }
  /* --- Der Grund auf Deutsch ----------------------------------------- */
  const DE_PRON3 = { m: "er", f: "sie", n: "es", pl: "sie" };
  function deGrund(c, neg, si, dz, art, w, subjDe) {
    const d = c.de;
    let subj, pp;
    if (d.s === "S") { subj = subjDe; pp = si.dp; }
    else if (d.s === "OBJ") { const o = OGG[w.oggetto]; subj = o.de.pl ? "sie" : DE_PRON3[o.de.g]; pp = o.de.pl ? 5 : 2; }
    else { subj = d.s; pp = 2; }
    const dv = d.v === "sein" ? DE_SEIN : d.v === "haben" ? DE_HABEN : DEV[d.v];
    let praed = d.p || "";
    let nicht = "";
    if (neg) { if (d.n) praed = d.n; else nicht = "nicht"; }
    let finit, rest = [];
    if (dz === "praes") finit = dv.praes[pp];
    else if (dz === "praet") finit = dv.praet[pp];
    else if (dz === "fut") { finit = DE_WERDEN[pp]; rest = [dv.inf]; }
    else if (dz === "k2") { if (dv === DE_SEIN) finit = DE_K2.sein[pp]; else if (dv === DE_HABEN) finit = DE_K2.haben[pp]; else { finit = DE_WUERDE[pp]; rest = [dv.inf]; } }
    else if (dz === "k2v") { finit = (dv.hilf === "sein" ? DE_K2.sein : DE_K2.haben)[pp]; rest = [dv.part]; }
    const refl = dv.refl ? DE_REFL[dv.refl][pp] : "";
    const mitte = [refl, nicht, praed].filter(Boolean);
    if (art === "haupt") return [subj, finit].concat(mitte, rest).filter(Boolean).join(" ");
    return [subj].concat(mitte, rest, [finit]).filter(Boolean).join(" ");
  }

  /* --- Der deutsche Satz ------------------------------------------------
     art: haupt (Verb an 2. Stelle), frage (Verb vorn), w (Fragewort vorn),
          neben (Verb am Ende), invers (etwas anderes steht vorn: „deshalb“) */
  function deFormen(dv, modal, dz, dp) {
    let finit, rechts = [];
    const sep = dv.pref ? dv.pref.trim() : "";
    if (!modal) {
      if (dz === "praes") { finit = dv.praes[dp]; if (sep) rechts = [sep]; }
      else if (dz === "praet") { finit = dv.praet[dp]; if (sep) rechts = [sep]; }
      else if (dz === "perf") { finit = (dv.hilf === "sein" ? DE_SEIN : DE_HABEN).praes[dp]; rechts = [dv.part]; }
      else if (dz === "plusq") { finit = (dv.hilf === "sein" ? DE_SEIN : DE_HABEN).praet[dp]; rechts = [dv.part]; }
      else if (dz === "fut") { finit = DE_WERDEN[dp]; rechts = [dv.inf]; }
      else if (dz === "k2") {
        if (dv === DE_SEIN) finit = DE_K2.sein[dp];
        else if (dv === DE_HABEN) finit = DE_K2.haben[dp];
        else { finit = DE_WUERDE[dp]; rechts = [dv.inf]; }
      } else if (dz === "k2v") { finit = (dv.hilf === "sein" ? DE_K2.sein : DE_K2.haben)[dp]; rechts = [dv.part]; }
    } else {
      const md = DE_MODAL[modal];
      if (dz === "praes") finit = md.praes[dp];
      else if (dz === "praet" || dz === "perf") finit = md.praet[dp];
      else if (dz === "fut") { finit = DE_WERDEN[dp]; rechts = [dv.inf, md.inf]; return { finit, rechts, doppel: true }; }
      else if (dz === "k2") finit = (md.k2 || md.praes)[dp];
      else finit = md.praes[dp];
      rechts = [dv.inf];
    }
    return { finit, rechts, sep, doppel: false };
  }
  function deModalId(w) {
    if (!feldAktiv(w, "modale")) return "";
    const m = w.modale;
    const base = basisZeit(w);
    if (m === "potere" || m === "sapere") return "koennen";
    if (m === "dovere") {
      if (base === "condizionale") return "sollen";
      /* „non devo dimenticare“ = ich darf nicht vergessen (Verbot);
         „oggi non devo lavorare“ = ich muss heute nicht arbeiten */
      if (w.neg && verbotLesart(w)) return "duerfen";
      return "muessen";
    }
    if (m === "volere") return base === "condizionale" ? "moechten" : "wollen";
    if (m === "vorrei") return "moechten";
    return "";
  }
  /* Bei diesen Verben meint „il caffè“ Kaffee im Allgemeinen („Bevo il caffè“ = Ich trinke Kaffee) */
  const GENERISCH = ["mangiare", "bere", "comprare", "cucinare", "ascoltare", "suonare", "parlare", "studiare", "imparare", "avere", "misurare", "festeggiare", "giocare", "ordinare", "assaggiare", "preparare", "prendere"];
  function verbotLesart(w) {
    const o = OGG[w.oggetto];
    return ["dimenticare", "fumare", "perdere"].includes(w.verbo) || w.modo === "tardi" || Boolean(o && o.alk);
  }
  function deSatz(w, v, si, opt) {
    const wf = wFeld(w);
    const dvKey = verbDe(Object.assign({}, w, { rolle: rolleVon(w, v), [wf]: "" }), v);
    const dv = DEV[dvKey];
    const modal = deModalId(w);
    const dz = opt.deZeit || deZeitVon(w, dv, modal);
    const dp = si.dp;
    const f = deFormen(dv, modal, dz, dp);
    const t = feldAktiv(w, "quando") ? TEMPO[w.quando] : null;
    const subj = opt.subjDe;
    // Mittelfeld
    const M = { refl: "", zeit: "", dat: "", akk: "", nicht: "", art: "", begl: "", mezzo: "", obj: "", ort: "", praep: "", praed: "" };
    if (dv.refl) M.refl = DE_REFL[dv.refl][dp];
    let zeitVorfeld = false;
    const freqDe = t && t.verb ? (t.id === "mai" ? (basisZeit(w) === "passato" || basisZeit(w) === "trapassato" ? "noch nie" : "nie") : t.de) : "";
    if (t && !t.verb) {
      const txt = t.agr ? (si.pl ? "als Kinder" : "als Kind") : t.de;
      if (opt.art === "haupt" && opt.vorfeldZeit !== false) { zeitVorfeld = txt; } else M.zeit = txt;
    }
    const modo = feldAktiv(w, "modo") ? MODO[w.modo] : null;
    const artDe = modo ? ((v.deModo && v.deModo[modo.id]) || modo.de) : "";
    // Objekt
    let keinBenutzt = false;
    const negMitAdverb = w.neg && (Boolean(artDe) || (t && t.grp === "freq"));
    if (feldAktiv(w, "oggetto") && !(dvKey === "fernsehen")) {
      const o = OGG[w.oggetto];
      const det = w.det || detsFuer(v, o)[0];
      let dd = det === "indef" ? "indef" : det === "part" ? "ohne" : det === "poss" ? "poss" : det === "ohne" ? "ohne" : null;
      if (det === "def") dd = o.deDef === "possSachen" ? (v.besitz ? "poss" : "def") : (o.deDef === "ohne" && !GENERISCH.includes(v.id) ? "def" : (o.deDef || "def"));
      const praep = v.deObjPraep || "";
      if (w.neg && !praep && !negMitAdverb && !(t && t.id === "mai") && (dd === "indef" || dd === "ohne")) { dd = "kein"; keinBenutzt = true; }
      const agg = feldAktiv(w, "agg") ? AGG[w.agg] : null;
      const n = { n: o.de.n, g: o.de.g, pl: o.de.pl };
      const txt = deNominal(n, "akk", dd, agg ? agg.de : "", si.dePoss);
      if (praep) M.praep = praep + " " + txt;
      else if (dd === "def" || dd === "poss") M.akk = txt;
      else M.obj = txt;
    }
    if (v.deFestObj) {
      const n = { n: v.deFestObj, g: v.deFestObj === "Sport" ? "m" : "f", pl: v.deFestObj === "Hausaufgaben" };
      let dd = v.deFestDet || "ohne";
      if (w.neg && !negMitAdverb && !(t && t.id === "mai") && dd === "ohne") { dd = "kein"; keinBenutzt = true; }
      const txt = deNominal(n, "akk", dd, "", si.dePoss);
      if (dd === "def") M.akk = txt; else M.obj = txt;
    }
    if (feldAktiv(w, "stato")) M.praed = STATO[w.stato].de;
    if (feldAktiv(w, "persona")) {
      const pe = PERSONE.find((x) => x.id === w.persona);
      const fall = v.deFall || (v.pers.typ === "a" ? "dat" : "akk");
      /* „Non incontro un amico“ → „Ich treffe keinen Freund“ */
      const keinP = w.neg && pe.det === "indef" && fall !== "aufAkk" && !negMitAdverb && !(t && t.id === "mai") && !keinBenutzt;
      const pd = (f2) => keinP ? deNominal({ n: pe.de.n, g: pe.de.g, pl: pe.de.pl }, f2, "kein", "", si.dePoss) : personDe(pe, si, f2);
      if (keinP) keinBenutzt = true;
      if (fall === "dat") M.dat = pd("dat");
      else if (fall === "aufAkk") M.praep = "auf " + personDe(pe, si, "akk");
      else M.akk = (M.akk ? M.akk + " " : "") + pd("akk");
      if (v.id === "chiedere" && M.akk && M.praep) { /* „meinen Bruder um Hilfe“ */ }
    }
    if (feldAktiv(w, "luogo")) {
      const l = LUOGO[w.luogo];
      const r = rolleVon(w, v);
      const deR = (v.deRolle && v.deRolle[r]) || { stato: "wo", moto: "wohin", da: "woher", per: "wohin" }[r];
      M.ort = (v.deOrt && v.deOrt[l.id]) || l.de[deR];
    }
    if (feldAktiv(w, "mezzo") && !(dvKey.indexOf("fliegen") >= 0 && w.mezzo === "aereo")) M.mezzo = MEZZO[w.mezzo].de;
    if (feldAktiv(w, "compagnia")) {
      const pe = PERSONE.find((x) => x.id === w.compagnia);
      M.begl = "mit " + personDe(pe, si, "dat") + (v.deCompZusammen ? " zusammen" : "");
    }
    if (artDe) M.art = artDe;
    if (w.neg && !keinBenutzt && !(t && t.id === "mai")) M.nicht = "nicht";
    if (freqDe) M.nicht = (M.nicht ? M.nicht + " " : "") + freqDe;
    const mitte = [M.zeit, M.dat, M.akk, M.nicht, M.art, M.begl, M.mezzo, M.obj, M.ort, M.praep, M.praed].filter(Boolean);
    // Satzbau
    const rechts = f.rechts.slice();
    if (opt.art === "neben") {
      let fin = f.finit;
      let r = rechts;
      if (!modal && f.sep && (dz === "praes" || dz === "praet")) { fin = (dv.pref.endsWith(" ") ? dv.pref : f.sep) + fin; r = []; }
      const ende = f.doppel ? [fin].concat(r) : r.concat([fin]);
      return [opt.konj, subj, M.refl].concat(mitte, ende).filter(Boolean).join(" ");
    }
    /* „Wann wäscht sich Giulia?“ — das Reflexivpronomen rückt vor ein Nomen-Subjekt, hinter ein Pronomen */
    const sr = si.sog.pron || /^(er|sie|es)$/.test(subj) ? [subj, M.refl] : [M.refl, subj];
    if (opt.art === "frage") return [f.finit].concat(sr, mitte, rechts).filter(Boolean).join(" ");
    if (opt.art === "w" || opt.art === "invers") return [opt.vorfeld, f.finit].concat(sr, mitte, rechts).filter(Boolean).join(" ");
    // haupt
    if (zeitVorfeld) return [zeitVorfeld, f.finit].concat(sr, mitte, rechts).filter(Boolean).join(" ");
    return [subj, f.finit, M.refl].concat(mitte, rechts).filter(Boolean).join(" ");
  }
  function deWFrage(w, v) {
    const r = rolleVon(w, v);
    switch (w.wort) {
      case "checosa": return v.id === "aspettare" ? "Worauf" : "Was";
      case "chi": { const f = v.deFall || "akk"; return f === "dat" ? "Wem" : (f === "aufAkk" ? "Auf wen" : "Wen"); }
      case "achi": return (v.deFall === "akk") ? "Wen" : "Wem";
      case "conchi": return "Mit wem";
      case "dove": { const deR = (v.deRolle && v.deRolle[r]) || { stato: "wo", moto: "wohin", per: "wohin" }[r]; return deR === "wohin" ? "Wohin" : "Wo"; }
      case "dadove": return "Woher";
      case "quando": return "Wann";
      case "come": return "Wie";
      case "perche": return "Warum";
      default: return "";
    }
  }
  function deSubjekt(si, schonGenannt) {
    const s = si.sog;
    if (s.pron) return s.de;
    if (!schonGenannt) return s.de;
    return si.pl ? "sie" : (si.g === "f" ? "sie" : "er");
  }

  function itKette(teile) {
    let s = "";
    teile.forEach((x) => {
      const t = typeof x === "string" ? x : x.t;
      if (!t) return;
      if (!s) { s = t; return; }
      if (/^,/.test(t)) { s += t; return; }
      if (/'$/.test(s)) s += t; else s += " " + t;
    });
    return s.replace(/(^|\s)([Dd])ove è(?=\s|$|\?)/g, "$1$2ov'è").replace(/(^|\s)([Cc])ome è(?=\s|$|\?)/g, "$1$2om'è");
  }

  function bauen(w0) {
    const pr = pruefe(w0);
    const w = pr.w;
    if (!pr.ok) return { ok: false, probleme: pr.probleme, w };
    const v = wVerb(w);
    const si = subjektInfo(wSubj(w), w.genus);
    const itZeit = itZeitVon(w);
    const e = w.satzart === "aussage" && feldAktiv(w, "einleitung") ? EINLEITUNGEN.find((x) => x.id === w.einleitung) : null;
    const vb = effVerbindung(w);
    const causaId = feldAktiv(w, "causa") ? String(w.causa) : "";
    const c = causaId ? CAUSA[causaId.replace(/^non:/, "")] : null;
    const cneg = /^non:/.test(causaId);
    const cong = /^cong/.test(itZeit);
    const pronZwang = cong && !si.pl && si.sog.pron;
    const grundHatS = c && (c.de.s === "S");
    const itGrundSubjVorn = c && vb !== "perche" && c.it.v !== "impers" && c.it.v !== "fare3" && c.it.v !== "esserci" && c.it.v !== "essere3" && c.it.v !== "essere3v" && c.it.v !== "costare";
    // Hauptsatz italienisch
    const subjImGrund = itGrundSubjVorn && (!si.sog.pron || w.pronome || pronZwang);
    const teile = itTeileHaupt(w, v, si, { itZeit, pronZwang, subjVerschwiegen: subjImGrund });
    // Zeit des Grundes
    const base = basisZeit(w);
    let gz = "presente", gdz = "praes";
    if (vb === "se2") { gz = "congImperfetto"; gdz = "k2"; }
    else if (vb === "se3") { gz = "congTrapassato"; gdz = "k2v"; }
    else if (["passato", "imperfetto", "trapassato", "condPassato"].includes(base)) { gz = "imperfetto"; gdz = "praet"; }
    else if (base === "futuro" && (vb === "se" || vb === "quando")) { gz = "futuro"; gdz = "praes"; }
    else if (zukunftBezug(w) && (vb === "perche" || vb === "quindi") && c && c.zukunft === "futuro") { gz = "futuro"; gdz = "fut"; }
    let it, de;
    const deSubjErst = deSubjekt(si, false);
    const hauptIt = () => itKette(teile);
    if (!c) {
      it = hauptIt();
      if (w.satzart === "wfrage") de = deSatz(w, v, si, { art: "w", vorfeld: deWFrage(w, v), subjDe: deSubjErst });
      else if (w.satzart === "frage") de = deSatz(w, v, si, { art: "frage", subjDe: deSubjErst });
      else if (e) de = e.de + " " + deSatz(w, v, si, { art: "neben", konj: "dass", subjDe: deSubjErst });
      else de = deSatz(w, v, si, { art: "haupt", subjDe: deSubjErst });
    } else {
      const gIt = itGrund(c, cneg, si, gz, w);
      const gItMitS = subjImGrund ? si.sog.it + " " + gIt : gIt;
      if (vb === "perche") {
        it = hauptIt() + " perché " + gIt;
        const deG = deGrund(c, cneg, si, gdz, "neben", w, deSubjekt(si, true));
        let h;
        if (w.satzart === "wfrage") h = deSatz(w, v, si, { art: "w", vorfeld: deWFrage(w, v), subjDe: deSubjErst });
        else if (w.satzart === "frage") h = deSatz(w, v, si, { art: "frage", subjDe: deSubjErst });
        else if (e) h = e.de + " " + deSatz(w, v, si, { art: "neben", konj: "dass", subjDe: deSubjErst });
        else h = deSatz(w, v, si, { art: "haupt", subjDe: deSubjErst });
        de = h + ", weil " + deG;
      } else if (vb === "quindi") {
        it = gItMitS + ", quindi " + hauptIt();
        const deG = deGrund(c, cneg, si, gdz, "haupt", w, deSubjErst);
        de = deG + ", deshalb " + deSatz(w, v, si, { art: "invers", vorfeld: "", subjDe: deSubjekt(si, grundHatS), vorfeldZeit: false }).replace(/^\s+/, "");
      } else {
        const konjIt = vb === "quando" ? "quando" : "se";
        it = konjIt + " " + gItMitS + ", " + hauptIt();
        const konjDe = vb === "quando" && base === "passato" ? "als" : "wenn";
        const deG = deGrund(c, cneg, si, gdz, "neben", w, deSubjErst);
        de = konjDe + " " + deG + ", " + deSatz(w, v, si, { art: "invers", vorfeld: "", subjDe: deSubjekt(si, grundHatS), vorfeldZeit: false }).replace(/^\s+/, "");
      }
    }
    if (e) it = e.it + " " + it;
    const zeichen = w.satzart === "haupt" || w.satzart === "aussage" ? "." : "?";
    it = gross(it.trim()) + zeichen;
    de = gross(de.trim()) + zeichen;
    return { ok: true, w, it, de, teile, hinweise: hinweise(w, v, si, itZeit, teile), itZeit };
  }

  /* Kurze Erklärungen auf Deutsch — die wichtigste Regel dieses Satzes */
  function hinweise(w, v, si, itZeit, teile) {
    const h = [];
    const alles = teile.map((x) => x.t).join(" ");
    if (si.sog.pron && !w.pronome && !/^cong/.test(itZeit) && w.satzart !== "wfrage") {
      const vb = teile.find((x) => x.rolle === "verb");
      h.push("„" + si.sog.it + "“ fällt weg: die Verbform „" + (vb ? vb.t.replace(/^non /, "") : "") + "“ zeigt schon, wer es ist. Mitgesagt wird es nur zur Betonung.");
    }
    if (/^cong/.test(itZeit)) h.push("Nach „" + (EINLEITUNGEN.find((e) => e.id === w.einleitung) || { it: "che" }).it + "“ steht der congiuntivo. Weil io, tu, lui/lei dort gleich klingen, sagt man das Pronomen mit.");
    if (istZusammengesetzt(itZeit) && !feldAktiv(w, "modale")) {
      const aux = hilfsverb(v.v);
      if (aux === "essere") h.push("Mit essere richtet sich das Partizip nach der Person: " + partizipForm(v.v, "m", false) + " / " + partizipForm(v.v, "f", false) + " / " + partizipForm(v.v, "m", true) + " / " + partizipForm(v.v, "f", true) + ".");
      else h.push("Mit avere bleibt das Partizip gleich: „" + partizip(v.v) + "“ — egal wer.");
    }
    if (v.v.rifl) h.push(feldAktiv(w, "modale") ? "Reflexiv mit Modalverb: das Pronomen hängt am Infinitiv („" + enklitisch(v.v.inf, si.p) + "“)." : "Reflexiv: mi/ti/si/ci/vi/si steht vor dem Verb — in der Vergangenheit immer mit essere.");
    if (w.neg && w.quando === "mai") h.push("„non … mai“ = nie: non vor dem Verb, mai dahinter.");
    else if (w.neg) h.push("„non“ steht direkt vor dem Verb" + (v.v.rifl ? " (und vor mi/ti/si)" : "") + ".");
    if (itZeit === "imperfetto") h.push("imperfetto: für Gewohnheiten und Zustände in der Vergangenheit.");
    if (itZeit === "futuro") h.push("futuro semplice: Stamm + ò, ai, à, emo, ete, anno.");
    if (itZeit === "condizionale") h.push("condizionale: Stamm + ei, esti, ebbe … — so klingt „ich würde“, höflich oder als Wunsch.");
    const vs = alles.match(/\b(al|allo|all'|alla|ai|agli|alle|dal|dallo|dall'|dalla|dai|dagli|dalle|nel|nella|sul|sulla|del|della|dei|degli|delle|dell')\b/);
    if (vs) h.push("„" + vs[0] + "“ ist verschmolzen: " + ({ al: "a + il", allo: "a + lo", "all'": "a + l'", alla: "a + la", ai: "a + i", agli: "a + gli", alle: "a + le", dal: "da + il", dallo: "da + lo", "dall'": "da + l'", dalla: "da + la", dai: "da + i", dagli: "da + gli", dalle: "da + le", nel: "in + il", nella: "in + la", sul: "su + il", sulla: "su + la", del: "di + il (etwas von)", della: "di + la (etwas von)", dei: "di + i (einige)", degli: "di + gli (einige)", delle: "di + le (einige)", "dell'": "di + l' (etwas von)" }[vs[0]] || "") + ".");
    if (feldAktiv(w, "agg") && AGG[w.agg].davor) h.push("„" + AGG[w.agg].it + "“ steht meist VOR dem Nomen — die meisten Adjektive stehen dahinter.");
    if (w.satzart === "frage") h.push("Ja/Nein-Frage: dieselbe Wortstellung wie in der Aussage, nur mit Fragezeichen (die Stimme geht hoch).");
    if (w.satzart === "wfrage") h.push("W-Frage: das Fragewort steht vorn, ein Subjekt-Name rückt hinter das Verb.");
    return h.slice(0, 3);
  }

  /* ===================================================================
     8. VORSCHLÄGE, WENN ETWAS NICHT PASST
     =================================================================== */
  function vorschlaege(w0, zuletzt) {
    const pr = pruefe(w0);
    if (pr.ok) return [];
    const w = pr.w;
    const kand = [];
    let felder = Array.from(new Set(pr.probleme.map((p) => p.feld)));
    if (felder.includes("condAnlass")) {
      felder = felder.filter((f) => f !== "condAnlass");
      [{ modo: "volentieri" }, { modale: "potere" }, { modale: "dovere" }, { quando: "gia" }, { tempo: "presente" }, { tempo: "passato" }].forEach((x) => kand.push(Object.assign({}, w, x)));
    }
    if (felder.includes("zuviel")) {
      felder = felder.filter((f) => f !== "zuviel");
      ["agg", "modo", "mezzo", "compagnia", "causa", "quando", "modale"].forEach((f) => { if (feldAktiv(w, f)) { const z = Object.assign({}, w); z[f] = ""; kand.push(z); } });
    }
    // 1. Das, was nicht passt, weglassen
    const ohne = Object.assign({}, w);
    felder.forEach((f) => { if (f === "zeitform") ohne.tempo = "presente"; else if (f === "neg") ohne.neg = false; else if (f !== "verbo") ohne[f] = ""; });
    kand.push(ohne);
    // 2. Die letzte Änderung zurücknehmen
    if (zuletzt && zuletzt.feld) {
      const z = Object.assign({}, w);
      if (zuletzt.feld === "zeitform") z.tempo = zuletzt.wert; else z[zuletzt.feld] = zuletzt.wert;
      kand.push(z);
    }
    // 3. Das Problemfeld durch etwas Passendes ersetzen
    felder.forEach((f) => {
      if (f === "verbo" || f === "neg") return;
      const tmp = Object.assign({}, w); if (f === "zeitform") tmp.tempo = ""; else tmp[f] = "";
      const a = angebote(tmp, f);
      a.slice(0, 2).forEach((x) => { const z = Object.assign({}, w); if (f === "zeitform") z.tempo = x.id; else z[f] = typeof x === "string" ? x : x.id; kand.push(z); });
    });
    const out = [], gesehen = new Set();
    kand.forEach((k) => {
      if (out.length >= 3) return;
      const b = bauen(k);
      if (b.ok && !gesehen.has(b.it)) { gesehen.add(b.it); out.push({ w: b.w, it: b.it, de: b.de }); }
    });
    return out;
  }

  /* ===================================================================
     9. ZWEI UND MEHR SÄTZE: e, ma, poi, o
     =================================================================== */
  const SATZBINDER = [
    { id: "e", it: "e", de: "und", level: "A1", komma: false, hinweis: "„e“ verbindet ohne Komma." },
    { id: "ma", it: "ma", de: "aber", level: "A1", komma: true, hinweis: "Vor „ma“ steht ein Komma — es braucht einen Gegensatz (einer verneint, oder zwei Personen)." },
    { id: "poi", it: "poi", de: "dann", level: "A1", komma: true, hinweis: "„poi“ = danach. Auf Deutsch rückt das Verb direkt hinter „dann“." },
    { id: "o", it: "o", de: "oder", level: "A1", komma: false, hinweis: "„o“ stellt zwei Möglichkeiten nebeneinander." },
  ];
  /* Passen zwei Sätze mit diesem Bindewort zusammen? */
  function binderPasst(b, w1, w2) {
    const k1 = schluessel(w1), k2 = schluessel(w2);
    const gleich = w1.verbo === w2.verbo && (w1.oggetto || "") === (w2.oggetto || "") && (w1.luogo || "") === (w2.luogo || "") && (w1.persona || "") === (w2.persona || "");
    if (gleich) return { ok: false, text: "Zweimal dasselbe — das klingt komisch." };
    const drinnen = (k) => k.includes("daheim") || k.includes("ruhe");
    const raus = (k) => k.includes("ausgehen") || k.includes("reise") || k.includes("draussen");
    if (b === "e" && ((drinnen(k1) && raus(k2)) || (raus(k1) && drinnen(k2))) && w1.soggetto === w2.soggetto && !w1.neg && !w2.neg)
      return { ok: false, text: "Zu Hause bleiben UND ausgehen zugleich geht nicht — meinst du „poi“ (danach) oder „ma“?" };
    if (b === "ma" && w1.neg === w2.neg && w1.soggetto === w2.soggetto)
      return { ok: false, text: "„ma“ braucht einen Gegensatz: verneine einen der beiden Sätze oder nimm eine andere Person." };
    if (b === "o" && (w1.neg || w2.neg)) return { ok: false, text: "„o“ (oder) mit Verneinung klingt komisch." };
    if (b === "o" && w1.soggetto !== w2.soggetto) return { ok: false, text: "„o“ passt hier nur, wenn dieselbe Person entscheidet." };
    return { ok: true };
  }
  function geschichte(liste) {
    // liste: [{ w }, { w, binder }, …] — alle in derselben Zeitform
    const teileIt = [], teileDe = [];
    let vorher = null;
    for (let i = 0; i < liste.length; i++) {
      const w = Object.assign({}, liste[i].w, { satzart: "aussage", einleitung: "" });
      if (i && vorher) w.tempo = vorher.tempo;
      const b = i ? SATZBINDER.find((x) => x.id === liste[i].binder) || SATZBINDER[0] : null;
      const selbe = vorher && vorher.soggetto === w.soggetto;
      const zwing = vorher && !selbe;
      if (zwing) { w.pronome = true; }
      const r = bauen(w);
      if (!r.ok) return { ok: false, index: i, probleme: r.probleme };
      if (b) { const bp = binderPasst(b.id, vorher, r.w); if (!bp.ok) return { ok: false, index: i, binder: true, text: bp.text }; }
      let it = r.it.replace(/[.?]$/, "");
      let de = r.de.replace(/[.?]$/, "");
      if (i === 0) {
        teileIt.push(zwing ? it : it); teileDe.push(de);
        if (liste.length > 1 && !selbe && liste[1] && liste[1].w.soggetto !== w.soggetto && subjektInfo(wSubj(w), w.genus).sog.pron && !w.pronome) {
          // die erste Person auch nennen, wenn die zweite eine andere ist
          const r0 = bauen(Object.assign({}, w, { pronome: true }));
          teileIt[0] = r0.it.replace(/[.?]$/, "");
        }
      } else {
        const itKlein = it.charAt(0).toLowerCase() + it.slice(1);
        let deTeil;
        const si = subjektInfo(wSubj(r.w), r.w.genus);
        const subjDe = deSubjekt(si, selbe);
        const v = wVerb(r.w);
        if (b.id === "poi") deTeil = "dann " + deSatz(r.w, v, si, { art: "invers", vorfeld: "", subjDe, vorfeldZeit: false });
        else deTeil = b.de + " " + (r.w.causa ? de.charAt(0).toLowerCase() + de.slice(1) : deSatz(r.w, v, si, { art: "haupt", subjDe }));
        if (r.w.causa && b.id !== "poi") deTeil = b.de + " " + deKlein(de, si, selbe);
        if (r.w.causa && b.id === "poi") deTeil = deTeil + de.slice(de.indexOf(", weil"));
        teileIt.push((b.komma ? ", " : " ") + b.it + " " + (selbe && subjektInfo(wSubj(r.w), r.w.genus).sog.pron ? itKlein : itKlein));
        teileDe.push((b.komma ? ", " : " ") + deTeil.replace(/\s+/g, " "));
      }
      vorher = r.w;
    }
    const it = gross(teileIt.join("").replace(/\s+,/g, ",")) + ".";
    const de = gross(teileDe.join("").replace(/\s+,/g, ",")) + ".";
    return { ok: true, it, de };
  }
  function deKlein(de, si, selbe) {
    let s = de.charAt(0).toLowerCase() + de.slice(1);
    if (!si.sog.pron && selbe) s = s.replace(new RegExp("^" + si.sog.de.charAt(0).toLowerCase() + si.sog.de.slice(1)), deSubjekt(si, true));
    else if (!si.sog.pron) s = si.sog.de + s.slice(si.sog.de.length);
    return s;
  }

  /* ===================================================================
     10. ZUFALL UND BEISPIELE — nur aus geprüften Bausteinen
     =================================================================== */
  function zufallsWahl(niveau, kategorie, zufall, extra) {
    const eins = (l) => l[Math.floor(zufall() * l.length)];
    const ex = extra || {};
    for (let versuch = 0; versuch < 40; versuch++) {
      const verben = angebote({ niveau, kategorie }, "verbo").filter((v) => !ex.verbo || v.id === ex.verbo);
      if (!verben.length) return null;
      let w = { niveau, kategorie, verbo: eins(verben).id, soggetto: ex.soggetto || eins(SOGGETTI.filter((s) => ab(s.level, niveau))).id, genus: zufall() < 0.5 ? "m" : "f",
        tempo: ex.tempo || eins(ZEITFORMEN.filter((z) => ab(z.level, niveau))).id, satzart: ex.satzart || "aussage", neg: ex.neg !== undefined ? ex.neg : zufall() < 0.2,
        pronome: zufall() < 0.1 };
      const v = wVerb(w);
      if (v.modali.length && zufall() < 0.25) { const m = angebote(w, "modale"); if (m.length) w.modale = eins(m).id; }
      const r = rollenVon(v); if (r.length) w.rolle = eins(r);
      const reihenfolge = ["oggetto", "persona", "luogo", "mezzo", "compagnia", "quando", "modo", "stato"];
      reihenfolge.sort(() => zufall() - 0.5);
      w = normalisiere(w);
      for (const f of reihenfolge) {
        const a = angebote(w, f);
        if (!a.length) continue;
        const pflicht = (f === "oggetto" && v.objPflicht) || (f === "luogo" && v.ortPflicht) || (f === "persona" && v.persPflicht) || f === "stato";
        if (pflicht || zufall() < 0.45) { w[f] = eins(a).id; if (f === "oggetto") { const d = angebote(w, "det"); w.det = eins(d) || ""; const ag = angebote(w, "agg"); if (ag.length && zufall() < 0.3) w.agg = eins(ag).id; } }
      }
      if (ex.mitGrund || zufall() < 0.3) {
        const vbs = angebote(w, "verbindung");
        if (vbs.length) {
          const vb = ex.verbindung ? vbs.find((x) => x.id === ex.verbindung) : eins(vbs);
          if (vb) {
            const probe = Object.assign({}, w, { verbindung: vb.id });
            if (vb.id === "se2") probe.tempo = "condizionale";
            if (vb.id === "se3") probe.tempo = "condPassato";
            const g = angebote(probe, "causa");
            if (g.length) { Object.assign(w, probe); w.causa = eins(g).id; }
          }
        }
      }
      if (ex.einleitung !== false && (ex.einleitung || zufall() < 0.15)) {
        const e = angebote(w, "einleitung");
        if (e.length) w.einleitung = ex.einleitung && e.find((x) => x.id === ex.einleitung) ? ex.einleitung : eins(e).id;
      }
      if (w.satzart === "wfrage") { const wf = angebote(w, "wort"); if (!wf.length) continue; w.wort = eins(wf).id; }
      const b = bauen(w);
      if (b.ok) return b;
    }
    return null;
  }
  /* Beispiele je Bereich und Niveau: fest gesät, damit sie gleich bleiben */
  const beispielCache = {};
  function beispiele(kategorie, niveau, anzahl) {
    const key = kategorie + "|" + niveau + "|" + (anzahl || 40);
    if (beispielCache[key]) return beispielCache[key];
    let samen = 839 + NIVEAUS.indexOf(niveau) * 1000 + KATEGORIEN.findIndex((k) => k.id === kategorie) * 37;
    const zufall = () => { samen = (samen * 1103515245 + 12345) % 2147483648; return samen / 2147483648; };
    const out = [], gesehen = new Set();
    const arten = ["aussage", "aussage", "aussage", "frage", "wfrage"];
    for (let i = 0; out.length < (anzahl || 40) && i < 600; i++) {
      const b = zufallsWahl(niveau, kategorie, zufall, { satzart: arten[i % arten.length], mitGrund: i % 3 === 0 });
      if (b && !gesehen.has(b.it)) { gesehen.add(b.it); out.push({ it: b.it, de: b.de, art: b.w.satzart === "aussage" ? (b.w.causa ? "mit Nebensatz" : "Aussage") : "Frage", zeit: b.itZeit }); }
    }
    beispielCache[key] = out;
    return out;
  }

  const API = {
    NIVEAUS, SOGGETTI, PERSONE, LUOGHI, OGGETTI, AGGETTIVI, TEMPI, MODI, MEZZI, CAUSE, STATI, MODALI, VERBI, ZEITFORMEN, VERBINDUNGEN,
    EINLEITUNGEN, WFRAGEN, KATEGORIEN, SATZBINDER, FELD_NAMEN, DE_VERBEN: DEV, DE_MODAL,
    angebote, pruefe, normalisiere, bauen, vorschlaege, geschichte, binderPasst, zufallsWahl, beispiele, niveauInfo, schluessel, anzeigeWert,
    konj: { praesens, imperfetto, futuro, condizionale, congiuntivo, congImperfetto, partizip, partizipForm, hilfsverb, einfach, hilfsForm, enklitisch },
    artikel, verschmelze, nominal, adjForm, adjVorForm, deNominal, subjektInfo, personIt, personDe, itGrund, deGrund, C, ESSERE, AVERE,
  };
  if (typeof window !== "undefined") window.SatzbauIt = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})();
