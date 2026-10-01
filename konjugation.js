/* =====================================================================
   KONJUGATION — Beugungstabellen für die Verben im Wörterbuch
   ---------------------------------------------------------------------
   FASSUNG 832 — XANDER (Funk 255, wörtlich): „Beugungsknöpfe (ich/du/er …)
   für Verben im Wörterbuch wie im Duden".
   Maßstab: die Duden-Formen. Die Tabelle entsteht aus Regeln, nicht aus
   geratenen Listen:
     · starke und unregelmäßige Verben stehen hier von Hand (Präsens-Wechsel
       e→i/ie, a→ä, au→äu; Präteritum; Partizip II; Hilfsverb)
     · zusammengesetzte Verben erben vom Grundverb (verstehen → stehen,
       aufstehen → stehen; trennbare Vorsilben wandern ans Satzende,
       untrennbare bekommen kein ge-)
     · schwache Verben folgen den Regeln (e-Einschub bei arbeit-, atm-,
       öffn-; -eln/-ern; s-Laute im du; -ieren ohne ge-)
     · „sein“ als Hilfsverb bei Bewegung und Zustandswechsel (Liste unten)
   Verben, die in einer Bedeutung stark und in der anderen schwach sind
   (hängen, schaffen, erschrecken …), bekommen keine Tabelle – lieber keine
   als eine falsche.
   Aufruf: Konjugation.tabelle("sich waschen") → { zeiten: {...} } oder null.
   ===================================================================== */
(function () {
  "use strict";
  /* Präsens 3. Person (nur wenn der Stamm wechselt) | Präteritum (1./3. Person) | Partizip II | Hilfsverb (h, s) */
  var STARK = {
    backen: "bäckt|backte|gebacken|h", befehlen: "befiehlt|befahl|befohlen|h", beginnen: "|begann|begonnen|h", beißen: "|biss|gebissen|h",
    betrügen: "|betrog|betrogen|h", biegen: "|bog|gebogen|h", bieten: "|bot|geboten|h", binden: "|band|gebunden|h", bitten: "|bat|gebeten|h",
    blasen: "bläst|blies|geblasen|h", bleiben: "|blieb|geblieben|s", braten: "brät|briet|gebraten|h", brechen: "bricht|brach|gebrochen|h",
    brennen: "|brannte|gebrannt|h", bringen: "|brachte|gebracht|h", denken: "|dachte|gedacht|h", empfehlen: "empfiehlt|empfahl|empfohlen|h",
    essen: "isst|aß|gegessen|h", fahren: "fährt|fuhr|gefahren|s", fallen: "fällt|fiel|gefallen|s", fangen: "fängt|fing|gefangen|h",
    finden: "|fand|gefunden|h", fliegen: "|flog|geflogen|s", fliehen: "|floh|geflohen|s", fließen: "|floss|geflossen|s",
    fressen: "frisst|fraß|gefressen|h", frieren: "|fror|gefroren|h", geben: "gibt|gab|gegeben|h", gehen: "|ging|gegangen|s",
    gelingen: "|gelang|gelungen|s", gelten: "gilt|galt|gegolten|h", genießen: "|genoss|genossen|h", geschehen: "geschieht|geschah|geschehen|s",
    gewinnen: "|gewann|gewonnen|h", gießen: "|goss|gegossen|h", gleichen: "|glich|geglichen|h", gleiten: "|glitt|geglitten|s",
    graben: "gräbt|grub|gegraben|h", greifen: "|griff|gegriffen|h", halten: "hält|hielt|gehalten|h", heben: "|hob|gehoben|h",
    heißen: "|hieß|geheißen|h", helfen: "hilft|half|geholfen|h", kennen: "|kannte|gekannt|h", klingen: "|klang|geklungen|h",
    kommen: "|kam|gekommen|s", kriechen: "|kroch|gekrochen|s", laden: "lädt|lud|geladen|h", lassen: "lässt|ließ|gelassen|h",
    laufen: "läuft|lief|gelaufen|s", leiden: "|litt|gelitten|h", leihen: "|lieh|geliehen|h", lesen: "liest|las|gelesen|h",
    liegen: "|lag|gelegen|h", lügen: "|log|gelogen|h", meiden: "|mied|gemieden|h", messen: "misst|maß|gemessen|h",
    misslingen: "|misslang|misslungen|s", nehmen: "nimmt|nahm|genommen|h", nennen: "|nannte|genannt|h", pfeifen: "|pfiff|gepfiffen|h",
    raten: "rät|riet|geraten|h", reiben: "|rieb|gerieben|h", reißen: "|riss|gerissen|h", reiten: "|ritt|geritten|s", rennen: "|rannte|gerannt|s",
    riechen: "|roch|gerochen|h", rufen: "|rief|gerufen|h", scheinen: "|schien|geschienen|h", schieben: "|schob|geschoben|h",
    schießen: "|schoss|geschossen|h", schlafen: "schläft|schlief|geschlafen|h", schlagen: "schlägt|schlug|geschlagen|h",
    schleichen: "|schlich|geschlichen|s", schließen: "|schloss|geschlossen|h", schmeißen: "|schmiss|geschmissen|h",
    schmelzen: "schmilzt|schmolz|geschmolzen|s", schneiden: "|schnitt|geschnitten|h", schreiben: "|schrieb|geschrieben|h",
    schreien: "|schrie|geschrien|h", schweigen: "|schwieg|geschwiegen|h", schwimmen: "|schwamm|geschwommen|s", schwingen: "|schwang|geschwungen|h",
    schwören: "|schwor|geschworen|h", sehen: "sieht|sah|gesehen|h", singen: "|sang|gesungen|h", sinken: "|sank|gesunken|s",
    sitzen: "|saß|gesessen|h", sprechen: "spricht|sprach|gesprochen|h", springen: "|sprang|gesprungen|s", stechen: "sticht|stach|gestochen|h",
    stehen: "|stand|gestanden|h", stehlen: "stiehlt|stahl|gestohlen|h", steigen: "|stieg|gestiegen|s", sterben: "stirbt|starb|gestorben|s",
    stinken: "|stank|gestunken|h", stoßen: "stößt|stieß|gestoßen|h", streichen: "|strich|gestrichen|h", streiten: "|stritt|gestritten|h",
    tragen: "trägt|trug|getragen|h", treffen: "trifft|traf|getroffen|h", treiben: "|trieb|getrieben|h", treten: "tritt|trat|getreten|h",
    trinken: "|trank|getrunken|h", verderben: "verdirbt|verdarb|verdorben|h", vergessen: "vergisst|vergaß|vergessen|h",
    verlieren: "|verlor|verloren|h", verschwinden: "|verschwand|verschwunden|s", verzeihen: "|verzieh|verziehen|h",
    wachsen: "wächst|wuchs|gewachsen|s", waschen: "wäscht|wusch|gewaschen|h", weisen: "|wies|gewiesen|h", werben: "wirbt|warb|geworben|h",
    werfen: "wirft|warf|geworfen|h", ziehen: "|zog|gezogen|h", zwingen: "|zwang|gezwungen|h", fechten: "ficht|focht|gefochten|h",
    saufen: "säuft|soff|gesoffen|h", schelten: "schilt|schalt|gescholten|h", schinden: "|schindete|geschunden|h",
    preisen: "|pries|gepriesen|h", schreiten: "|schritt|geschritten|s", wringen: "|wrang|gewrungen|h",
    erlöschen: "erlischt|erlosch|erloschen|s", bergen: "birgt|barg|geborgen|h", dreschen: "drischt|drosch|gedroschen|h",
    flechten: "flicht|flocht|geflochten|h", verschleißen: "|verschliss|verschlissen|h", scheiden: "|schied|geschieden|h",
    kneifen: "|kniff|gekniffen|h", sprießen: "|spross|gesprossen|s", dringen: "|drang|gedrungen|s", schwinden: "|schwand|geschwunden|s",
    ringen: "|rang|gerungen|h", schlingen: "|schlang|geschlungen|h", spinnen: "|spann|gesponnen|h", rinnen: "|rann|geronnen|s",
    mahlen: "|mahlte|gemahlen|h"
  };
  /* ganz unregelmäßig: [ich, du, er, wir, ihr, sie] Präsens · Präteritumstamm · Partizip · Hilfsverb */
  var UNREG = {
    sein: [["bin", "bist", "ist", "sind", "seid", "sind"], "war", "gewesen", "s", "sei"],
    haben: [["habe", "hast", "hat", "haben", "habt", "haben"], "hatte", "gehabt", "h", "hab"],
    werden: [["werde", "wirst", "wird", "werden", "werdet", "werden"], "wurde", "geworden", "s", "werd"],
    wissen: [["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"], "wusste", "gewusst", "h", "wisse"],
    tun: [["tue", "tust", "tut", "tun", "tut", "tun"], "tat", "getan", "h", "tu"],
    können: [["kann", "kannst", "kann", "können", "könnt", "können"], "konnte", "gekonnt", "h", ""],
    müssen: [["muss", "musst", "muss", "müssen", "müsst", "müssen"], "musste", "gemusst", "h", ""],
    dürfen: [["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"], "durfte", "gedurft", "h", ""],
    sollen: [["soll", "sollst", "soll", "sollen", "sollt", "sollen"], "sollte", "gesollt", "h", ""],
    wollen: [["will", "willst", "will", "wollen", "wollt", "wollen"], "wollte", "gewollt", "h", ""],
    mögen: [["mag", "magst", "mag", "mögen", "mögt", "mögen"], "mochte", "gemocht", "h", ""]
  };
  /* in einer Bedeutung stark, in der anderen schwach (oder beides gebräuchlich) – keine Tabelle */
  var ZWEIDEUTIG = { outsourcen: 1, interviewen: 1, downloaden: 1, uploaden: 1, updaten: 1, recyceln: 1, babysitten: 1, hängen: 1, schaffen: 1, erschrecken: 1, wiegen: 1, schleifen: 1, senden: 1, wenden: 1, stecken: 1, bewegen: 1, quellen: 1,
    weichen: 1, löschen: 1, saugen: 1, melken: 1, gären: 1, glimmen: 1, schwellen: 1, scheren: 1, uraufführen: 1, sieden: 1, gebären: 1,
    ausziehen: 1, durchfahren: 1, umfahren: 1, umgehen: 1, überziehen: 1, };
  /* Hilfsverb „sein“ bei schwachen Verben und dort, wo das Kompositum anders ist als das Grundverb */
  var SEIN = { reisen: 1, wandern: 1, joggen: 1, segeln: 1, klettern: 1, landen: 1, folgen: 1, eilen: 1, begegnen: 1, passieren: 1, stolpern: 1,
    rutschen: 1, scheitern: 1, explodieren: 1, aufwachen: 1, erwachen: 1, einschlafen: 1, aufstehen: 1, umziehen: 1, einziehen: 1, entstehen: 1,
    erscheinen: 1, vergehen: 1, verunglücken: 1, erkranken: 1, auftauchen: 1, umkippen: 1, aufbrechen: 1, zerfallen: 1,
    sterben: 1, wachsen: 1, emigrieren: 1, immigrieren: 1, verreisen: 1, zurückkehren: 1, umsteigen: 1, abreisen: 1, ankommen: 1,
    ertrinken: 1, entkommen: 1, gelangen: 1, geraten: 1, misslingen: 1, verblühen: 1, verhungern: 1, verdursten: 1, erfrieren: 1,
    platzen: 1, schmelzen: 1, verschwinden: 1, umfallen: 1, hinfallen: 1, verwelken: 1, rasen: 1, flitzen: 1, ausrutschen: 1, abstürzen: 1, stürzen: 1 };
  /* Grundverben, die mit untrennbarer Vorsilbe „haben“ nehmen, obwohl das Grundverb „sein“ hat (bekommen, verstehen …) – Regel:
     untrennbar zusammengesetzt → „haben“, außer es steht in SEIN */
  var TRENNBAR = ["drauf", "drüber", "runter", "rauf", "raus", "rein", "rüber", "kaputt", "bereit", "offen", "auseinander", "hindurch", "hinweg", "herum", "herbei", "hervor", "umher", "voran", "vorüber", "entlang", "inne", "zurück", "zusammen", "entgegen", "gegenüber", "herein", "heraus", "herauf", "herunter", "hinein", "hinaus", "hinauf", "hinunter", "vorbei", "voraus",
    "weiter", "fort", "empor", "nieder", "heim", "fest", "fern", "frei", "hoch", "kennen", "statt", "teil", "los", "weg", "nach", "vor", "mit", "auf", "aus", "ab", "an",
    "bei", "ein", "zu", "her", "hin", "dar", "um", "durch", "wieder"];
  /* um-, durch-, wieder- sind meist untrennbar (umarmen, durchsuchen, wiederholen) – trennbar nur bei diesen */
  var TRENNBAR_NUR = { um: ["ziehen", "steigen", "fallen", "drehen", "bringen", "tauschen", "schalten", "kehren", "rühren", "kippen", "ziehen", "sehen", "schauen", "denken"],
    durch: ["fallen", "lesen", "führen", "halten", "kommen", "machen", "streichen", "schlafen"], wieder: ["kommen", "sehen", "finden", "geben", "erkennen", "treffen", "bekommen"] };
  /* (um-, durch-, wieder-, voll-: hier landen nur die untrennbaren – die trennbaren hat zerlegen() schon abgespalten) */
  TRENNBAR.sort(function (a, b) { return b.length - a.length; });
  var UNTRENNBAR = ["miss", "emp", "ent", "ver", "zer", "be", "ge", "er", "über", "unter", "hinter", "wider", "durch", "wieder", "voll", "um"];

  /* fangen nur zufällig wie eine trennbare Vorsilbe an */
  var OHNE_VORSILBE = { reinigen: 1, rauschen: 1, reichen: 1, reiben: 1, reisen: 1, reizen: 1, rennen: 1, raufen: 1, offenbaren: 1, antworten: 1, angeln: 1, abonnieren: 1, ankern: 1, anfeinden: 0, ahnen: 1, achten: 1, ändern: 1, eilen: 1, einen: 1, ehren: 1, herrschen: 1,
    zielen: 1, zählen: 1, zaubern: 1, zeichnen: 1, zittern: 1, zögern: 1, zupfen: 1, zucken: 1, zünden: 1, zwingen: 1, umarmen: 1, mitteln: 1, nachten: 0,
    vorne: 0, losen: 1, wegen: 0, fernen: 0, festen: 0, freien: 1, hoffen: 1, holen: 1, hören: 1, heilen: 1, heizen: 1, hinken: 1, dauern: 1, darben: 1,
    durchqueren: 1, wiederholen: 1, unterrichten: 1, aufen: 0, auszen: 0, beben: 1, beten: 1, beißen: 1, beugen: 1, bergen: 1, beizen: 1, bellen: 1, betteln: 1,
    mitarbeiten: 0, abstrahieren: 1, adoptieren: 1, addieren: 1, analysieren: 1, animieren: 1, annoncieren: 1, appellieren: 1, absolvieren: 1, akzeptieren: 1, ausradieren: 0 };
  /* Verben, die wirklich mit ge- (untrennbar) anfangen; andere ge-Wörter sind Partizipien oder Adjektive (gestellten, gegeben) */
  var GE_VERBEN = { gehorchen: 1, gehören: 1, gelingen: 1, genießen: 1, geschehen: 1, gestatten: 1, gestehen: 1, gewinnen: 1, gewöhnen: 1, gefallen: 1,
    gebrauchen: 1, gedenken: 1, gelangen: 1, geleiten: 1, genesen: 1, gestalten: 1, gebieten: 1, gewähren: 1, getrauen: 1, gefährden: 1, genehmigen: 1,
    gedulden: 1, gefrieren: 1, gewährleisten: 1, geraten: 1, gebärden: 1, gehen: 1, geben: 1, gelten: 1, gerben: 1, geigen: 1, geizen: 1, gähnen: 1, gießen: 1, gleichen: 1, gleiten: 1, glauben: 1, glänzen: 1, grüßen: 1 };
  /* gebeugte Formen der starken Verben (zum Aussortieren): gingen, hingen, fuhren … · gegangen, gefallen … · gangen, fallen … */
  var FORMEN_PRAET = { hingen: 1, hing: 1 }, FORMEN_PART = {}, FORMEN_PART_OHNE = {};
  for (var sv in STARK) {
    var sd = STARK[sv].split("|"); if (sd.length < 3) continue;
    if (!/te$/.test(sd[1])) { FORMEN_PRAET[sd[1] + "en"] = 1; FORMEN_PRAET[sd[1]] = 1; }
    if (sd[2] !== sv) { FORMEN_PART[sd[2]] = 1; FORMEN_PART_OHNE[sd[2].replace(/^ge/, "")] = 1; }
  }
  /* (Infinitive, die zufällig so aussehen, bleiben erlaubt: gefallen, geraten, verlassen, empfangen …) */
  var klein = function (s) { return String(s || "").trim().toLowerCase(); };
  function zerlegen(inf, verben) {
    /* trennbare Vorsilbe? (der Rest muss selbst ein Verb sein) */
    for (var i = 0; i < TRENNBAR.length; i++) {
      var p = TRENNBAR[i];
      if (inf.indexOf(p) !== 0 || inf.length - p.length < 4) continue;
      var rest = inf.slice(p.length);
      if (TRENNBAR_NUR[p] && TRENNBAR_NUR[p].indexOf(rest) < 0) continue;
      if (inf === "wiederholen" || inf === "unterrichten") continue;
      if (UNREG[rest] || STARK[rest] || grundVon(rest) || (verben && verben[rest])) return { trenn: p, kern: rest };
      /* sieht aus wie Vorsilbe + Verb, aber das Grundverb ist unbekannt: ohne Gewissheit keine Tabelle (außer bei Verben,
         die nur zufällig so anfangen: antworten, angeln, abonnieren …) */
      if (/(en|ern|eln)$/.test(rest) && !OHNE_VORSILBE[inf]) return null;
    }
    return { trenn: "", kern: inf };
  }
  /* starkes Grundverb im Kern finden: exakt oder als Endung hinter untrennbaren Vorsilben */
  function grundVon(kern) {
    if (UNREG[kern] || (STARK[kern] && STARK[kern].indexOf("|") >= 0)) return { vor: "", grund: kern };
    if (KEINE_VORSILBE[kern] || NICHT_STARK[kern]) return null;
    for (var j = 0; j < UNTRENNBAR.length; j++) {
      var v = UNTRENNBAR[j];
      if (kern.indexOf(v) === 0 && kern.length - v.length >= 4) {
        var r = kern.slice(v.length);
        if (UNREG[r] || (STARK[r] && STARK[r].indexOf("|") >= 0)) return { vor: v, grund: r };
      }
    }
    return null;
  }
  /* Wörter, die nur so aussehen, als hätten sie eine Vorsilbe (ernten, beten, erben …) */
  var KEINE_VORSILBE = { ernten: 1, erben: 1, beten: 1, betteln: 1, beben: 1, bellen: 1, beugen: 1, geigen: 1, gerben: 1, geizen: 1, entern: 1, erden: 1,
    beizen: 1, betten: 1, beuteln: 1, erzen: 1, gellen: 1, };
  /* echte untrennbare Vorsilbe, aber kein starkes Grundverb dahinter (be-gleiten ≠ be + gleiten) */
  var NICHT_STARK = { bereiten: 1, begleiten: 1, vorbereiten: 1, aufbereiten: 1, verbreiten: 1, erweitern: 1, };
  function untrennbarVor(kern) {
    if (KEINE_VORSILBE[kern]) return "";
    for (var j = 0; j < UNTRENNBAR.length; j++) if (kern.indexOf(UNTRENNBAR[j]) === 0 && kern.length - UNTRENNBAR[j].length >= 4) return UNTRENNBAR[j];
    return "";
  }

  /* Endungen */
  var sLaut = function (st) { return /(s|ß|z|x)$/.test(st); };
  /* e-Einschub (Duden): Stamm auf -d/-t oder auf Konsonant + m/n (atmen, rechnen, öffnen) – nicht nach l/r (lernen, qualmen),
     nicht nach Dehnungs-h (wohnen) und nicht bei mm/nn (kämmen, rennen) */
  var eEinschub = function (st) { return /(t|d)$/.test(st) || (/[^aeiouäöülr][mn]$/.test(st) && !/(mm|nn)$/.test(st) && !/[aeiouäöü]h[mn]$/.test(st)); };

  function praesensSchwach(st, eln) {
    if (eln === "eln") { return [st.slice(0, -2) + "le", st + "st", st + "t", st + "n", st + "t", st + "n"]; }
    if (eln === "ern") return [st + "e", st + "st", st + "t", st + "n", st + "t", st + "n"];
    var e = eEinschub(st) ? "e" : "";
    return [st + "e", st + (sLaut(st) ? "t" : e + "st"), st + e + "t", st + "en", st + e + "t", st + "en"];
  }

  /* Formen eines (Kern-)Verbs ohne trennbare Vorsilbe */
  function kernFormen(kern) {
    var u = UNREG[kern];
    if (u) return { praes: u[0].slice(), praet: u[1], part: u[2], hilf: u[3], imp: u[4], unreg: true };
    var g = grundVon(kern);
    var eln = /eln$/.test(kern) ? "eln" : /ern$/.test(kern) ? "ern" : "";
    var st = eln ? kern.slice(0, -1) : kern.replace(/e?n$/, "");
    if (g && UNREG[g.grund]) {
      var uu = UNREG[g.grund];
      return { praes: uu[0].map(function (x, i) { return i === 3 || i === 5 ? kern : g.vor + x; }), praet: g.vor + uu[1], part: g.vor + uu[2].replace(/^ge/, ""), hilf: "h", imp: g.vor + uu[4] };
    }
    if (g) {
      var d = STARK[g.grund].split("|"), drei = d[0] ? g.vor + d[0] : "", praes = praesensSchwach(st, ""), imp = st;
      if (drei) {
        /* Stammwechsel im du und er: gibst/gibt, fährst/fährt, liest, isst, wäschst; bei Stamm auf -t (halten, raten, treten,
           gelten) bekommt er kein weiteres -t: hält, rät, tritt, gilt – du hältst, rätst, trittst, giltst */
        if (/t$/.test(st)) { praes[1] = drei + "st"; praes[2] = drei; }
        else { var st3 = drei.replace(/t$/, ""); praes[1] = sLaut(st3) ? st3 + "t" : st3 + "st"; praes[2] = drei; }
        /* Imperativ: e→i/ie auch im Befehl (gib, nimm, lies, sieh, iss, tritt), a→ä nicht (fahr, lauf, halt) */
        if (/e/.test(st) && /i/.test(drei.slice(g.vor.length)) && !/i/.test(st.slice(g.vor.length))) imp = /t$/.test(st) ? drei : drei.replace(/t$/, "");
      }
      /* ohne e→i-Wechsel: -e nach -d/-t usw. (bitte, biete, entscheide, reite, halte) */
      if (imp === st && (eEinschub(st) || /ig$/.test(st))) imp = st + "e";
      var praet = g.vor + d[1], part = d[2];
      if (g.vor) part = g.vor + part.replace(/^ge/, "");
      return { praes: praes, praet: praet, part: part, hilf: g.vor ? "h" : d[3], imp: imp, stark: !/te$/.test(d[1]) };
    }
    /* schwach */
    var pr = praesensSchwach(st, eln), stp = eln ? st : st;
    var e2 = eEinschub(st) && !eln ? "e" : "";
    var vor = untrennbarVor(kern), ieren = /ieren$/.test(kern);
    var partS = (vor || ieren ? "" : "ge") + st + e2 + "t";
    /* Imperativ: -e ist Pflicht nach -d/-t, Konsonant+m/n, -ig (arbeite, öffne, entschuldige) */
    return { praes: pr, praet: st + e2 + "te", part: partS, hilf: "h", imp: eln === "eln" ? st.slice(0, -2) + "le" : eln === "ern" ? st + "e" : st + (eEinschub(st) || /ig$/.test(st) ? "e" : ""), schwach: true };
  }

  var REFL = ["mich", "dich", "sich", "uns", "euch", "sich"];
  var PERS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

  /* Die Tabelle für einen Wörterbucheintrag ("sich waschen", "aufstehen") – oder null */
  function tabelle(wort, verben) {
    var w = klein(wort), sich = /^sich /.test(w);
    if (sich) w = w.slice(5);
    if ((!/^[a-zäöüß]+(en|ern|eln)$/.test(w) && !UNREG[w]) || w.length < 3 || ZWEIDEUTIG[w]) return null;
    if (w === "möchten") return null;
    /* Infinitiv mit zu (aufzustehen, einzuordnen) ist keine Grundform */
    for (var q = 0; q < TRENNBAR.length; q++) { var pq = TRENNBAR[q]; if (w.indexOf(pq + "zu") === 0 && w.length - pq.length - 2 >= 4 && !OHNE_VORSILBE[w]) { var r2 = w.slice(pq.length + 2); if (UNREG[r2] || STARK[r2] || grundVon(r2) || (verben && verben[r2]) || /(en|ern|eln)$/.test(r2)) return null; } }
    for (var zi = 2; zi < w.length - 5; zi++) if (w.substr(zi, 2) === "zu") { var r3 = w.slice(zi + 2); if (UNREG[r3] || (STARK[r3] && STARK[r3].indexOf("|") >= 0) || (verben && verben[r3])) return null; }
    /* gebeugte Formen mit untrennbarer Vorsilbe: erwiesen, verbundenen, erlittenen (starkes Partizip), bewachten (= bewachen + -ten) */
    var vor0 = "";
    for (var u0 = 0; u0 < UNTRENNBAR.length; u0++) if (w.indexOf(UNTRENNBAR[u0]) === 0) { vor0 = UNTRENNBAR[u0]; break; }
    if (vor0 && !KEINE_VORSILBE[w]) {
      var rest0 = w.slice(vor0.length);
      for (var sk in STARK) { var dd = STARK[sk].split("|"); if (dd.length < 3) continue; var pp = dd[2].replace(/^ge/, ""); if (pp !== sk && rest0.indexOf(pp) === 0 && rest0.length - pp.length <= 3 && !(STARK[w] || grundVon(w) && grundVon(w).grund === rest0)) return null; }
    }
    if (/ten$/.test(w) && verben && verben[w.slice(0, -3) + "en"] && !STARK[w] && !(verben[w] && /^(?!be|ver|er|ent|zer|ge)/.test(w))) return null;
    /* weitere gebeugte Formen: Präteritum Plural (hingen, erfuhren), Partizip mit Vorsilbe (vorgefallen, mitbeschlossen),
       Partizip I als Adjektiv (übereinstimmenden) */
    if (!STARK[w] && !GE_VERBEN[w] && (FORMEN_PRAET[w] || (vor0 && FORMEN_PRAET[w.slice(vor0.length)]))) return null;
    for (var t0 = 0; t0 < TRENNBAR.length; t0++) {
      var tp = TRENNBAR[t0]; if (w.indexOf(tp) !== 0) continue;
      var tr0 = w.slice(tp.length);
      if (FORMEN_PART[tr0] || FORMEN_PRAET[tr0]) return null;
      for (var pk in FORMEN_PART) if (tr0.indexOf(pk) === 0 && tr0.length - pk.length <= 3 && tr0.length > pk.length) return null;   // wiedergewonnenen
      for (var t1 = 0; t1 < TRENNBAR.length; t1++) if (tr0.indexOf(TRENNBAR[t1]) === 0 && FORMEN_PART[tr0.slice(TRENNBAR[t1].length)]) return null;   // wiederaufgenommen
      for (var u1 = 0; u1 < UNTRENNBAR.length; u1++) if (tr0.indexOf(UNTRENNBAR[u1]) === 0 && FORMEN_PART_OHNE[tr0.slice(UNTRENNBAR[u1].length)]) return null;
    }
    var pI = /end(e|en|er|es|em)?$/.exec(w);
    if (pI && verben && verben[w.slice(0, pI.index) + "en"]) return null;
    var z = zerlegen(w, verben); if (!z) return null;
    var kern = z.kern, tr = z.trenn;
    /* ge-…: nur echte ge-Verben (gehören, genießen …), sonst ist es ein Partizip oder Adjektiv (gegeben, gestellten) */
    if (/^ge/.test(kern) && !GE_VERBEN[kern] && !UNREG[kern] && !(STARK[kern] && STARK[kern].indexOf("|") >= 0) && !KEINE_VORSILBE[kern]) return null;
    if (ZWEIDEUTIG[kern] && !UNREG[kern]) return null;
    var f = kernFormen(kern); if (!f) return null;
    /* Hilfsverb: reflexiv immer „haben“; sonst die Liste der ganzen Wörter; sonst wie das Grundverb (untrennbar
       zusammengesetzte starke Verben nehmen „haben“: bekommen, verstehen – außer sie stehen in SEIN: entstehen …) */
    var basis = f.schwach ? "h" : f.hilf;
    if (SEIN[kern]) basis = "s";
    var hilf = sich ? "h" : SEIN[w] ? "s" : basis;
    var part = (tr || "") + f.part;
    var hinten = function (i) { return (sich ? " " + REFL[i] : "") + (tr ? " " + tr : ""); };
    var praes = f.praes.map(function (x, i) { return PERS[i] + " " + x + hinten(i); });
    var pst = f.praet, praetEnd;
    if (f.unreg || f.stark) {
      var stA = pst, e = /(t|d)$/.test(stA) ? "e" : "", e2 = /(s|ß|z|x|t|d)$/.test(stA) ? "e" : "";
      praetEnd = [stA, stA + e2 + "st", stA, stA + "en", stA + e + "t", stA + "en"];
      if (/e$/.test(stA)) praetEnd = [stA, stA + "st", stA, stA + "n", stA + "t", stA + "n"];
    } else praetEnd = [pst, pst + "st", pst, pst + "n", pst + "t", pst + "n"];
    var praet = praetEnd.map(function (x, i) { return PERS[i] + " " + x + hinten(i); });
    var H = hilf === "s" ? ["bin", "bist", "ist", "sind", "seid", "sind"] : ["habe", "hast", "hat", "haben", "habt", "haben"];
    var perf = H.map(function (x, i) { return PERS[i] + " " + x + (sich ? " " + REFL[i] : "") + " " + part; });
    var imp = null;
    if (f.imp) {
      var ihr = f.praes[4], sie = f.praes[5];
      imp = [f.imp + (sich ? " dich" : "") + (tr ? " " + tr : "") + "!", ihr + (sich ? " euch" : "") + (tr ? " " + tr : "") + "!", sie + " Sie" + (sich ? " sich" : "") + (tr ? " " + tr : "") + "!"];
      if (w === "sein") imp = ["sei!", "seid!", "seien Sie!"];
    }
    return { wort: wort, zeiten: { "Präsens": praes, "Präteritum": praet, "Perfekt": perf }, imperativ: imp, partizip: part, hilf: hilf === "s" ? "sein" : "haben" };
  }
  var Konjugation = { tabelle: tabelle, _STARK: STARK, _UNREG: UNREG };
  if (typeof window !== "undefined") window.Konjugation = Konjugation;
  if (typeof module !== "undefined") module.exports = Konjugation;
})();
