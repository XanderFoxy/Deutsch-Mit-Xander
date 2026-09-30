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
    O("macchina", "macchina", "f", 0, "indef def poss", "Auto", "n", "fahrzeug", "A1", { adj: ["nuovo", "vecchio", "rosso", "piccolo", "grande"], einmalig: true }),
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
    T("mese_prossimo", "il mese prossimo", "nächsten Monat", "zukunft", "A2"),
    T("anno_prossimo", "l'anno prossimo", "nächstes Jahr", "zukunft", "A2"),
    T("fra_due_giorni", "fra due giorni", "in zwei Tagen", "zukunft", "A2"),
    T("prossima_estate", "la prossima estate", "nächsten Sommer", "zukunft", "B1"),
    T("ieri", "ieri", "gestern", "vergangen", "A1"),
    T("ieri_sera", "ieri sera", "gestern Abend", "vergangen", "A1", { tz: ["abend"] }),
    T("ieri_mattina", "ieri mattina", "gestern Morgen", "vergangen", "A1", { tz: ["morgen"] }),
    T("altro_ieri", "l'altro ieri", "vorgestern", "vergangen", "A2"),
    T("sabato_scorso", "sabato scorso", "letzten Samstag", "vergangen", "A1"),
    T("settimana_scorsa", "la settimana scorsa", "letzte Woche", "vergangen", "A1"),
    T("mese_scorso", "il mese scorso", "letzten Monat", "vergangen", "A2"),
    T("anno_scorso", "l'anno scorso", "letztes Jahr", "vergangen", "A1"),
    T("due_giorni_fa", "due giorni fa", "vor zwei Tagen", "vergangen", "A2"),
    T("estate_scorsa", "l'estate scorsa", "letzten Sommer", "vergangen", "A2"),
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
    uhr: ["presente", "passato", "futuro", "imperfetto", "condizionale"],
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
    M("presto", "presto", "früh", "ende", "A1"),
    M("tardi", "tardi", "spät", "ende", "A1"),
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
    if (hat("haltestelle")) return ["piedi", "bici"].includes(id);
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
      ortPflicht: true, comp: FAM + " kollegen", modi: ["da_solo"], modali: ["potere", "dovere", "vorrei"], punkt: true, dauer: true, zustand: true, kind: true }),
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
      comp: FAM + " kollegen", modi: ["volentieri", "molto", "poco", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"], punkt: true, kind: true, keys: ["trinken"] }),
    V({ id: "cucinare", it: "cucinare", v: R("cucinare"), de: "kochen", level: "A1", kat: "essen alltag familie",
      obj: ["pasta", "spaghetti", "zuppa", "risotto", "pesce", "carne", "verdura", "lasagne"], dets: ["def", "indef"],
      ort: { stato: ["casa", "cucina", "nonni", "da_marco"] }, comp: FAM, modi: ["volentieri", "bene", "con_calma", "insieme"],
      modali: ["potere", "dovere", "volere", "vorrei", "sapere"], punkt: true, keys: ["essen", "kochen"] }),
    V({ id: "preparare", it: "preparare", v: R("preparare"), level: "A1", kat: "essen alltag familie",
      de: (w) => w.oggetto === "torta" ? "backen" : "machen",
      obj: ["cena", "pranzo", "colazione", "torta", "insalata", "panino", "caffe", "te"], objPflicht: true, dets: ["def", "indef"],
      ort: { stato: ["casa", "cucina", "nonni"] }, comp: FAM, modi: ["con_calma", "in_fretta", "volentieri", "insieme"], modali: ["potere", "dovere", "volere", "vorrei"],
      punkt: true, keys: (w) => w.oggetto === "torta" ? ["essen", "kochen", "kuchen"] : ["essen", "kochen"] }),
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
      modi: ["con_carta", "contanti"], modali: ["potere", "dovere", "volere", "vorrei"], habit: "freq", keys: ["bezahlen"] }),
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
      comp: FAM, modi: ["da_solo"], modali: ["potere", "dovere", "volere", "vorrei"], kind: true,
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
      pers: { typ: "a", tags: "fam freunde partner name kollegen medico" }, ort: { stato: ["casa", "ufficio"] },
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
    V({ id: "aspettare", it: "aspettare", v: R("aspettare"), de: "warten", deFall: "aufAkk", level: "A1", kat: "reisen alltag familie gesundheit",
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
      obj: ["contratto", "modulo", "lettera"], objPflicht: true, dets: ["def"], modali: ["dovere", "potere"], habit: "nein", keys: ["amt"] }),
    V({ id: "compilare", it: "compilare", v: R("compilare"), de: "ausfuellen", level: "B1", kat: "verwaltung",
      obj: ["modulo"], objPflicht: true, dets: ["def", "indef"], modi: ["con_attenzione"], modali: ["dovere", "potere"], habit: "nein", keys: ["amt"] }),
    V({ id: "prenotare", it: "prenotare", v: R("prenotare"), level: "A2", kat: "reisen freizeit essen",
      de: (w) => (w.oggetto === "tavolo" || w.oggetto === "camera_hotel") ? "reservieren" : "buchen",
      obj: ["tavolo", "camera_hotel", "volo", "viaggio", "biglietto"], objPflicht: true, dets: ["indef"],
      ort: { stato: ["ristorante", "pizzeria", "albergo"] }, ortObj: { ristorante: ["tavolo"], pizzeria: ["tavolo"], albergo: ["camera_hotel"] },
      modali: ["potere", "dovere", "volere", "vorrei"], habit: "nein",
      keys: (w) => w.oggetto === "tavolo" ? ["ausser_haus_essen", "essen"] : ["reise"] }),
    V({ id: "rinnovare", it: "rinnovare", v: R("rinnovare"), de: "verlaengern", level: "B2", kat: "verwaltung",
      obj: ["passaporto", "carta_identita", "permesso", "contratto", "abbonamento"], objPflicht: true, possOk: true, dets: ["poss", "def"],
      ort: { stato: ["comune", "questura"] }, ortObj: { comune: ["carta_identita"], questura: ["passaporto", "permesso"] },
      modali: ["dovere", "potere", "volere"], habit: "nein", keys: ["amt"] }),
    V({ id: "richiedere", it: "richiedere", v: R("richiedere", { part: "richiesto" }), de: "beantragen", level: "B2", kat: "verwaltung",
      obj: ["passaporto", "carta_identita", "permesso", "certificato"], objPflicht: true, dets: ["indef", "def"],
      objDets: { passaporto: ["def", "indef"], carta_identita: ["def", "indef"], permesso: ["def", "indef"], certificato: ["indef"] },
      ort: { stato: ["comune", "questura"] }, ortObj: { comune: ["carta_identita", "certificato"], questura: ["passaporto", "permesso"] },
      modali: ["dovere", "potere", "volere"], habit: "nein", keys: ["amt"] }),
    V({ id: "consegnare", it: "consegnare", v: R("consegnare"), de: "abgeben", level: "B1", kat: "verwaltung bildung arbeit",
      obj: ["documenti", "modulo", "compiti", "rapporto"], objPflicht: true, dets: ["def"],
      ort: { stato: ["comune", "questura", "ufficio", "scuola"] }, ortObj: { comune: ["documenti", "modulo"], questura: ["documenti", "modulo"], ufficio: ["documenti", "rapporto", "modulo"], scuola: ["compiti"] },
      modali: ["dovere", "potere"], habit: "nein", keys: (w) => w.oggetto === "compiti" ? ["lernen"] : ["amt"] }),
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
      pers: { typ: "a", tags: "fam freunde partner name" }, modali: ["volere", "vorrei", "potere"], habit: "nein", keys: ["geschenk"] }),
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
      obj: ["domanda", "lezione", "grammatica", "problema", "frase", "film"], objPflicht: true, dets: ["def"], modi: ["bene"], habit: "nein", zustand: true,
      keys: ["verstehen"] }),
    V({ id: "fare_compiti", it: "fare i compiti", v: C.fare, fest: "i compiti", de: "machen", deFestObj: "Hausaufgaben", deFestDet: "def", level: "A1", kat: "bildung familie",
      ort: { stato: ["casa", "camera", "biblioteca", "scuola"] }, comp: "freunde name fam", modi: ["con_calma", "in_fretta", "insieme"],
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
      habit: "freq", zustand: true, kind: true, keys: (w) => ["zustand:" + (w.oggetto || "")] }),
    V({ id: "essere_agg", it: "essere", name: "essere (wie?)", v: ESSERE, de: "sein", level: "A1", kat: "alltag gesundheit arbeit familie",
      stato: true, habit: "freq", zustand: true, kind: true, keinPassato: true,
      keys: (w) => ["zst:" + (w.stato || "")] }),
    V({ id: "fumare", it: "fumare", v: R("fumare"), de: "rauchen", level: "A2", kat: "gesundheit alltag",
      obj: ["sigaretta"], dets: ["indef"], ort: { stato: ["balcone", "terrazza", "giardino"] }, modi: ["molto", "poco"], modali: ["potere", "volere", "vorrei"],
      keys: ["rauchen"] }),
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
      habit: "freq", keys: (w) => (w.oggetto === "treno" || w.oggetto === "autobus") ? ["verpasst"] : ["verloren"] }),
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
