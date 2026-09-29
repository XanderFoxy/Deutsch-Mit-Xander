/* ============================================================
   DER SITUATIONS-BAUKASTEN
   ------------------------------------------------------------
   GEWÜNSCHT: „Ich hätte gern so eine Art Situations-Baukasten …
   die Frau steht am Strand und hat einen Bikini an, und man kann
   ihr anziehen, was man will … man kann den Hintergrund wechseln,
   man kann die Frau in die Dusche stellen … und dann steht im
   Ergebnis immer so eine Ausgabe: die Frau am Strand hat einen
   roten Bikini an … dass das System versteht, wie die Sachen im
   Deutschen heißen, dass sich jeder die Situation selber bauen
   kann und sofort versteht, wie das im Kontext klingt."

   Und: „Man soll die Personen per Drag and Drop an einen Platz
   ziehen können … dass das System dann weiß, wo derjenige steht,
   wie er steht, was er anhat, was er macht, und von diesen
   Kausalitäten soll dann der Satz entsprechend dem Kontext
   ausgegeben werden."

   SO IST ES GEBAUT
   Drei Datenquellen, alle erst beim Öffnen geladen:
     szenen/<id>.js      die Kulisse (dieselbe wie in der Bilderwelt)
     data-plaetze.js     wohin man ziehen kann, und wie das heißt
     figuren/<a>-<g>.js  die Figur in Ebenen: Körper, Kleidung,
                         Frisur, Gesicht — alle im selben
                         Koordinatensystem, Farben als CSS-Variablen

   Der Satz entsteht NICHT aus einer Liste fertiger Sätze, sondern
   aus den Bestandteilen: Subjekt (Alter + Geschlecht), Verb (aus
   der Haltung), Ortsangabe (aus dem Platz), Tätigkeit (aus dem
   Platz), Kleidung (aus dem, was angezogen ist). Deshalb stimmt er
   auch für Kombinationen, an die beim Bauen niemand gedacht hat.
   ============================================================ */

/* ------------------------------------------------------------
   1 — DIE WÖRTER
   ------------------------------------------------------------ */
const BK_SUBJEKT = {
  "saeugling-m": { wort: "das Baby", artikel: "das", pron: "es", syl: "BA-by" },
  "saeugling-w": { wort: "das Baby", artikel: "das", pron: "es", syl: "BA-by" },
  "kleinkind-m": { wort: "der kleine Junge", artikel: "der", pron: "er", syl: "KLEI-ne JUN-ge" },
  "kleinkind-w": { wort: "das kleine Mädchen", artikel: "das", pron: "es", syl: "KLEI-ne MÄD-chen" },
  "kind-m":      { wort: "der Junge", artikel: "der", pron: "er", syl: "JUN-ge" },
  "kind-w":      { wort: "das Mädchen", artikel: "das", pron: "es", syl: "MÄD-chen" },
  "jugendlich-m": { wort: "der Jugendliche", artikel: "der", pron: "er", syl: "JU-gend-li-che" },
  "jugendlich-w": { wort: "die Jugendliche", artikel: "die", pron: "sie", syl: "JU-gend-li-che" },
  "erwachsen-m": { wort: "der Mann", artikel: "der", pron: "er", syl: "MANN" },
  "erwachsen-w": { wort: "die Frau", artikel: "die", pron: "sie", syl: "FRAU" },
  "alt-m":       { wort: "der alte Mann", artikel: "der", pron: "er", syl: "AL-te MANN" },
  "alt-w":       { wort: "die alte Frau", artikel: "die", pron: "sie", syl: "AL-te FRAU" },
};

/* GEMELDET: „im Baukasten sollen wir diese Positionen auch einnehmen
   können." Seit die Figurendateien auch Knien, Fersensitz,
   Schneidersitz, Sitzen am Boden und Krabbeln mitbringen, kann man sie
   wählen — und dann muss auch ein Verb dazu dastehen. Fehlte es, las
   der Satz „Die Frau ist in der Küche": bkSatz() greift auf „ist"
   zurück, wenn die Haltung hier nicht steht. */
const BK_VERB = {
  stehen: "steht", sitzen: "sitzt", liegen: "liegt",
  gehen: "geht", halten: "hält", winken: "winkt",
  werfen: "wirft", zeigen: "zeigt",
  knien: "kniet", knien_vor: "kniet", fersensitz: "kniet",
  schneidersitz: "sitzt", sitzen_boden: "sitzt", sitzen_seit: "sitzt",
  krabbeln: "krabbelt", hocken: "hockt", knien_halb: "kniet",
  /* FASSUNG 834: die neuen Haltungen */
  kontrapost: "steht", lesen: "liest", servieren: "serviert",
};
/* FASSUNG 834 — Verben, die im Satz noch etwas brauchen.
   „Die Frau hält am Tisch.“ ist kein Deutsch (halten ohne Objekt heißt
   anhalten), „Der Mann zeigt im Flur.“ auch nicht. Deshalb: halten und
   lesen bekommen das Ding aus der Hand als Akkusativobjekt („hält ein
   Tablett“, „liest ein Buch“), zeigen die Richtung („zeigt nach vorn“).
   Und auf allen vieren krabbelt nur ein Kind; ein Erwachsener „ist auf
   allen vieren“ (Duden: klein geschrieben). */
function bkVerbFuer(z) {
  const h = z.haltung;
  const zub = (z.kleidung || {}).zubehoer;
  const ding = zub && BK_STUECK[zub.stueck] && ["tablett", "buch", "tasche", "besen"].indexOf(zub.stueck) >= 0 ? zub : null;
  const akk = (w) => {
    const e = BK_STUECK[w.stueck];
    const g = e[1];
    const farbe = w.farbe && BK_FARBE[w.farbe];
    return BK_UNBESTIMMT[g] + " " + (farbe && w.stueck !== "tablett" ? farbe[1][g] + " " : "") + e[0].replace(/^(der|die|das)\s+/, "");
  };
  if (h === "krabbeln") {
    return ["saeugling", "kleinkind"].indexOf(z.alter) >= 0 ? { verb: "krabbelt" } : { verb: "ist", nach: "auf allen vieren", vorOrt: true };
  }
  if (h === "halten") return ding ? { verb: "hält", nach: akk(ding), ding } : { verb: "steht" };
  if (h === "lesen") return zub && zub.stueck === "buch" ? { verb: "liest", nach: akk(zub), ding: zub } : { verb: "liest" };
  if (h === "zeigen") return { verb: "zeigt", nach: "nach vorn" };
  if (h === "servieren" && ding && ding.stueck === "tablett") return { verb: "serviert" };
  return { verb: BK_VERB[h] || "ist" };
}

/* Kleidungsstücke mit Artikel, Geschlecht und Betonung. Das
   Geschlecht braucht der Satz für den Akkusativ: „Er trägt EINEN
   Pullover", aber „Er trägt EIN T-Shirt". */
const BK_STUECK = {
  tshirt:        ["das T-Shirt", "n", "T-Shirt"],
  hemd:          ["das Hemd", "n", "HEMD"],
  pullover:      ["der Pullover", "m", "Pull-O-ver"],
  bluse:         ["die Bluse", "f", "BLU-se"],
  kellnerhemd:   ["das Kellnerhemd", "n", "KELL-ner-hemd"],
  arztkittel:    ["der Arztkittel", "m", "ARZT-kit-tel"],
  warnweste:     ["die Warnweste", "f", "WARN-wes-te"],
  feuerwehrjacke: ["die Feuerwehrjacke", "f", "FEU-er-wehr-ja-cke"],
  polizeihemd:   ["das Polizeihemd", "n", "Po-li-ZEI-hemd"],
  weihnachtsmantel: ["der Weihnachtsmantel", "m", "WEIH-nachts-man-tel"],
  badeanzug:     ["der Badeanzug", "m", "BA-de-an-zug"],
  bikinioberteil: ["das Bikinioberteil", "n", "Bi-KI-ni-o-ber-teil"],
  hose:          ["die Hose", "f", "HO-se"],
  jeans:         ["die Jeans", "f", "JEANS"],
  rock:          ["der Rock", "m", "ROCK"],
  shorts:        ["die Shorts", "f", "SHORTS"],
  anzughose:     ["die Anzughose", "f", "AN-zug-ho-se"],
  arbeitshose:   ["die Arbeitshose", "f", "AR-beits-ho-se"],
  badehose:      ["die Badehose", "f", "BA-de-ho-se"],
  bikinihose:    ["die Bikinihose", "f", "Bi-KI-ni-ho-se"],
  sommerkleid:   ["das Sommerkleid", "n", "SOM-mer-kleid"],
  abendkleid:    ["das Abendkleid", "n", "A-bend-kleid"],
  schuerze:      ["die Schürze", "f", "SCHÜR-ze"],
  halbschuh:     ["die Schuhe", "p", "SCHU-he"],
  turnschuh:     ["die Turnschuhe", "p", "TURN-schu-he"],
  stiefel:       ["die Stiefel", "p", "STIE-fel"],
  sandale:       ["die Sandalen", "p", "San-DA-len"],
  gummistiefel:  ["die Gummistiefel", "p", "GUM-mi-stie-fel"],
  muetze:        ["die Mütze", "f", "MÜT-ze"],
  hut:           ["der Hut", "m", "HUT"],
  kappe:         ["die Kappe", "f", "KAP-pe"],
  helm:          ["der Helm", "m", "HELM"],
  weihnachtsmuetze: ["die Weihnachtsmütze", "f", "WEIH-nachts-müt-ze"],
  kopftuch:      ["das Kopftuch", "n", "KOPF-tuch"],
  jacke:         ["die Jacke", "f", "JA-cke"],
  mantel:        ["der Mantel", "m", "MAN-tel"],
  weste:         ["die Weste", "f", "WES-te"],
  kittel:        ["der Kittel", "m", "KIT-tel"],
  brille:        ["die Brille", "f", "BRIL-le"],
  tasche:        ["die Tasche", "f", "TA-sche"],
  rucksack:      ["der Rucksack", "m", "RUCK-sack"],
  schal:         ["der Schal", "m", "SCHAL"],
  handschuhe:    ["die Handschuhe", "p", "HAND-schu-he"],
  tablett:       ["das Tablett", "n", "Ta-BLETT"],
  bademantel:    ["der Bademantel", "m", "BA-de-man-tel"],
  besen:         ["der Besen", "m", "BE-sen"],
  buch:          ["das Buch", "n", "BUCH"],
};

/* Farbwörter, dekliniert für den Akkusativ nach „ein/eine". Ohne
   die Endung klingt jeder Satz falsch — „ein rot T-Shirt". */
const BK_FARBE = {
  rot:     ["rot",     { m: "roten",     f: "rote",     n: "rotes",     p: "rote" }],
  blau:    ["blau",    { m: "blauen",    f: "blaue",    n: "blaues",    p: "blaue" }],
  gruen:   ["grün",    { m: "grünen",    f: "grüne",    n: "grünes",    p: "grüne" }],
  gelb:    ["gelb",    { m: "gelben",    f: "gelbe",    n: "gelbes",    p: "gelbe" }],
  schwarz: ["schwarz", { m: "schwarzen", f: "schwarze", n: "schwarzes", p: "schwarze" }],
  weiss:   ["weiß",    { m: "weißen",    f: "weiße",    n: "weißes",    p: "weiße" }],
  grau:    ["grau",    { m: "grauen",    f: "graue",    n: "graues",    p: "graue" }],
  braun:   ["braun",   { m: "braunen",   f: "braune",   n: "braunes",   p: "braune" }],
  gruen_d: ["dunkelgrün", { m: "dunkelgrünen", f: "dunkelgrüne", n: "dunkelgrünes", p: "dunkelgrüne" }],
  rosa:    ["rosa",    { m: "rosa", f: "rosa", n: "rosa", p: "rosa" }],
};

const BK_UNBESTIMMT = { m: "einen", f: "eine", n: "ein", p: "" };

/* ------------------------------------------------------------
   2 — DER SATZ
   ------------------------------------------------------------
   Aus den Bestandteilen gebaut, nicht aus einer Liste geholt.
   ------------------------------------------------------------ */
function bkSatz(z) {
  const subj = BK_SUBJEKT[z.alter + "-" + z.geschlecht];
  if (!subj) return "";
  const platz = z.platz;
  const saetze = [];

  /* Satz 1: Wer ist wo, und wie?

     GEWÜNSCHT: „Die NACKTE Frau sitzt am Küchentisch — und nicht: die
     Frau sitzt am Küchentisch. Sie ist nackt. Die Frau MIT DEM BLAUEN
     T-SHIRT steht in der Dusche."

     Das Subjekt trägt also die Beschreibung mit. Zwei Formen:
       — nichts an  → ein Adjektiv vor dem Nomen („die nackte Frau")
       — etwas an   → eine Angabe dahinter („die Frau mit dem blauen
                       T-Shirt"), und zwar mit dem AUFFÄLLIGSTEN Stück:
                       zuerst das Kleid, dann das Oberteil, dann die
                       Jacke — das ist die Reihenfolge, in der man einen
                       Menschen beschreibt.
     Die vollständige Aufzählung steht weiter im zweiten Satz; hier
     steht nur das eine Stück, an dem man die Person erkennt. */
  const anhabe = bkAngezogen(z);
  let wer;
  /* Welches Stück im ersten Satz schon genannt wurde — es darf im
     zweiten nicht noch einmal vorkommen. */
  let schonGenannt = null;
  if (!anhabe.length) {
    wer = bkGross(bkNackt(subj));
  } else {
    schonGenannt = bkMerkmalStueck(anhabe);
    const merk = bkMerkmal(anhabe);
    wer = bkGross(subj.wort) + (merk ? " " + merk : "");
  }
  const vb = bkVerbFuer(z);
  let eins = wer + " " + vb.verb;
  /* „ist auf allen vieren im Flur“: die Wendung vor den Ort; ein
     Objekt („hält ein Tablett“) oder eine Richtung dahinter. */
  if (vb.nach && vb.vorOrt) eins += " " + vb.nach;
  if (platz) eins += " " + platz.wo;
  if (vb.nach && !vb.vorOrt) eins += " " + vb.nach;
  /* GEMELDET: „die nackte Frau sitzt in der Küche, sie ist nackt“ ist
     doppelt gemoppelt.

     Dasselbe passiert zwischen Ort und Tätigkeit: „steht in der Dusche
     UND DUSCHT“, „liegt in der Badewanne und badet“, „steht vor dem
     Spiegel und schaut in den Spiegel“, „sitzt im Wartezimmer und
     wartet“. Die Ortsangabe sagt die Tätigkeit bereits. Deshalb fällt
     sie weg, sobald sie dasselbe Wort noch einmal bringt — der Ort
     bleibt stehen, denn an ihm hängt die eigentliche Lektion (der
     Dativ nach „wo?“). „Am Herd und kocht“ oder „auf dem Bahnsteig
     und wartet auf den Zug“ bleiben dagegen: dort sagt die Tätigkeit
     etwas Neues. */
  /* FASSUNG 834: Die Tätigkeit des Platzes („und isst“) passt nur zur
     Haltung des Platzes. Wer am Tisch winkt, serviert oder auf allen
     vieren ist, „isst“ dabei nicht — sonst stand da „Der Kellner
     serviert am Tisch und isst“. */
  const haltungPasst = platz && (z.haltung === platz.haltung
    || (platz.haltung === "stehen" && z.haltung === "kontrapost")
    || (platz.haltung === "sitzen" && z.haltung === "sitzen_seit"));
  if (platz && platz.tut && haltungPasst && !bkTutSagtDasselbe(platz)) eins += " und " + platz.tut;
  saetze.push(eins + ".");

  /* Satz 2: Was hat er an?

     GEMELDET: „Wenn du sagst, die nackte Frau sitzt am Küchentisch —
     sie ist nackt, das ist doppelt gemoppelt. Du brauchst dann nur
     sagen: die nackte Frau sitzt am Küchentisch."

     Genau. „Nackt" steht schon im ersten Satz am Subjekt. Ein zweiter
     Satz „Sie hat nichts an." sagt dasselbe noch einmal — er bleibt
     deshalb weg. Ein zweiter Satz kommt nur, wenn es auch etwas
     aufzuzählen gibt. */
  /* GEMELDET, derselbe Fehler eine Ebene weiter: Stand im ersten Satz
     schon „die Frau MIT DEM BLAUEN T-SHIRT“, dann las der zweite
     „Sie trägt EIN BLAUES T-SHIRT und eine rote Hose.“ — das T-Shirt
     zweimal. Der zweite Satz zählt deshalb nur noch auf, was oben NICHT
     schon stand. Bleibt danach nichts übrig (die Person trägt genau ein
     Stück), fällt der zweite Satz ganz weg. */
  /* Was als Objekt schon im ersten Satz stand („hält ein Tablett“),
     steht nicht noch einmal in der Aufzählung. */
  const an = anhabe.filter((st) => st !== schonGenannt && !(vb.ding && st.stueck === vb.ding.stueck));
  if (!an.length) {
    /* nichts zu ergänzen — der erste Satz sagt es bereits */
  } else {
    const teile = an.map((s) => {
      const w = BK_STUECK[s.stueck];
      if (!w) return "";
      const g = w[1];
      const farbe = s.farbe && BK_FARBE[s.farbe];
      const nomen = w[0].replace(/^(der|die|das)\s+/, "");
      if (g === "p") return (farbe ? farbe[1].p + " " : "") + nomen;
      return BK_UNBESTIMMT[g] + " " + (farbe ? farbe[1][g] + " " : "") + nomen;
    }).filter(Boolean);
    /* Absicherung: kennt die Wortliste ein Stück nicht, bleibt die
       Aufzählung leer — dann stand hier „Sie trägt ." im Bild. */
    if (!teile.length) saetze.push(bkGross(subj.pron) + " hat nichts an.");
    else saetze.push(bkGross(subj.pron) + " trägt " + bkUnd(teile) + ".");
  }
  return saetze.join(" ");
}

/* „die nackte Frau", „der nackte Mann", „das nackte Baby".
   Nach dem bestimmten Artikel heißt es im Nominativ immer „nackte" —
   ein Fall, in dem Deutsch einmal einfach ist. Das Adjektiv wird
   deshalb nur hinter den Artikel geschoben; steht dort schon eines
   („der kleine Junge"), reihen sie sich: „der nackte kleine Junge". */
function bkNackt(subj) {
  const art = subj.artikel;
  const rest = subj.wort.replace(new RegExp("^" + art + "\\s+"), "");
  return art + " nackte " + rest;
}

/* „… mit dem blauen T-Shirt". Genommen wird das auffälligste Stück:
   erst das Kleid, dann das Oberteil, dann die Jacke, dann die Hose.
   Nach dem bestimmten Artikel endet das Farbadjektiv im Dativ in
   JEDEM Geschlecht auf -en („dem blauen", „der blauen") — genau die
   Form, die in BK_FARBE schon als Maskulinum steht. Stücke im Plural
   (Schuhe, Socken) bleiben außen vor: sie bräuchten zusätzlich das
   Dativ-n am Nomen, und ein falsch gebeugter Satz ist schlimmer als
   ein kürzerer. */
const BK_MERKMAL_FOLGE = ["kleid", "oberteil", "jacke", "unterteil", "kopf"];
const BK_DATIV = { m: "dem", f: "der", n: "dem" };
/* Genau dasselbe Auswahlverfahren wie in bkMerkmal — aber es gibt das
   gewählte Stück selbst zurück, damit der zweite Satz es weglassen kann.
   Bewusst EINE gemeinsame Regel statt zweier, die auseinanderlaufen. */
function bkMerkmalStueck(an) {
  for (const platz of BK_MERKMAL_FOLGE) {
    const s = an.find((x) => x.platz === platz);
    if (!s) continue;
    const w = BK_STUECK[s.stueck];
    if (!w) continue;
    if (w[1] === "p") continue;              // Plural bleibt aussen vor
    return s;
  }
  return null;
}

/* Sagt die Tätigkeit dasselbe wie die Ortsangabe?
   „in der Dusche“ + „ducht“, „am Waschbecken“ + „wäscht sich“,
   „vor dem Spiegel“ + „schaut in den Spiegel“ — alles doppelt.
   Verglichen wird das Nomen des Platzes mit den Wörtern der Tätigkeit:
   gleicher Wortanfang (vier Buchstaben) oder das Nomen taucht wörtlich
   wieder auf. Umlaute werden vorher geglichen, sonst fände man
   „wäscht“ nicht in „Waschbecken“. */
function bkSchlicht(w) {
  return String(w || "").toLowerCase()
    .replace(/\u00e4/g, "a").replace(/\u00f6/g, "o").replace(/\u00fc/g, "u").replace(/\u00df/g, "ss");
}
function bkTutSagtDasselbe(platz) {
  if (!platz || !platz.tut || !platz.wort) return false;
  const nomen = bkSchlicht(String(platz.wort).replace(/^(der|die|das)\s+/, ""));
  if (!nomen) return false;
  const woerter = bkSchlicht(platz.tut).split(/[^a-z]+/).filter(Boolean);
  return woerter.some((w) => {
    if (w === nomen) return true;                       // „Tafel“ — „an die Tafel“
    if (w.length >= 4 && nomen.indexOf(w.slice(0, 4)) === 0) return true;  // duscht — Dusche
    if (w.length >= 4 && nomen.indexOf(w) >= 0) return true;               // Wasser — Wasserkocher
    return false;
  });
}

function bkMerkmal(an) {
  for (const platz of BK_MERKMAL_FOLGE) {
    const s = an.find((x) => x.platz === platz);
    if (!s) continue;
    const w = BK_STUECK[s.stueck];
    if (!w) continue;
    const g = w[1];
    if (g === "p") continue;                 // Plural: siehe oben
    const nomen = w[0].replace(/^(der|die|das)\s+/, "");
    const farbe = s.farbe && BK_FARBE[s.farbe];
    return "mit " + BK_DATIV[g] + " " + (farbe ? farbe[1].m + " " : "") + nomen;
  }
  return "";
}

function bkUnd(liste) {
  if (liste.length <= 1) return liste[0] || "";
  return liste.slice(0, -1).join(", ") + " und " + liste[liste.length - 1];
}
function bkGross(w) { return w.charAt(0).toUpperCase() + w.slice(1); }

/* Welche Stücke trägt die Figur gerade — in der Reihenfolge, in der
   man sie im Deutschen aufzählt: von oben nach unten. */
function bkAngezogen(z) {
  const folge = ["kopf", "oberteil", "kleid", "jacke", "unterteil", "schuhe", "zubehoer"];
  const raus = [];
  folge.forEach((platz) => {
    const w = z.kleidung[platz];
    if (w && w.stueck && w.stueck !== "nichts" && w.stueck !== "barfuss") {
      /* Den Platz mitgeben: bkMerkmal() braucht ihn, um das
         auffälligste Stück auszuwählen. */
      raus.push(Object.assign({ platz: platz }, w));
    }
  });
  return raus;
}

/* ------------------------------------------------------------
   3 — DIE FIGUR ZEICHNEN
   ------------------------------------------------------------
   FASSUNG 834 — XANDER (Funk 213): „dass wir wirklich diesmal
   realistische Personen haben … dass der Kellner nicht mehr so steif
   da steht … dass sie sich … innerhalb der Bilder … auch bewegen ja
   dann nur auf so einem 2D Level aber man soll sie dort auch hinsetzen
   können … mit ein paar einfachen Animationen“.

   Die Figur kommt jetzt aus figuren/mensch.js: ein Skelett mit
   Gelenken, jede Haltung ist eine Liste von Gelenkwinkeln. Deshalb
   kann sie sich bewegen (Gehen, Hinsetzen, Winken) — die alten
   Einzelbilder (36 MB) konnten das nicht. Geladen wird eine einzige
   Datei von rund 70 KB, für alle Alter, Geschlechter und Haltungen.
   ------------------------------------------------------------ */
/* Wie viele Bildeinheiten ein Zentimeter ist — der Kehrwert der Zahl
   aus DMA_PLATZ_MASS. Fehlt die Kulisse dort, gilt der Standardwert. */
function bkMassstab(szene) {
  const tafel = window.DMA_PLATZ_MASS || {};
  const cm = tafel[szene] || tafel._standard || 1.7;
  return 1 / cm;
}

/* Wohin schaut die Figur? Sitzend und stehend schräg nach vorn (so
   sieht man Gesicht UND Oberschenkel), liegend im Profil. Steht sie in
   der rechten Bildhälfte, schaut sie in den Raum hinein — also nach
   links. Wer „umdrehen“ gedrückt hat, bestimmt es selbst. */
const BK_BLICK = {
  stehen: 24, kontrapost: 26, gehen: 70, sitzen: 36, lesen: 40, sitzen_seit: 70,
  sitzen_boden: 50, schneidersitz: 30, fersensitz: 55, hocken: 55, knien: 40,
  knien_halb: 62, knien_vor: 60, krabbeln: 64, liegen: 90, winken: 22, halten: 30,
  zeigen: 40, servieren: 34,
};
function bkBlick(z, szBreite, haltung) {
  const h = haltung || z.haltung;
  const blick = BK_BLICK[h] != null ? BK_BLICK[h] : 26;
  let spiegel = false;
  if (z.platz && szBreite) spiegel = z.platz.x > szBreite * 0.56;
  /* Liegend: der Kopf gehört aufs Kissen (data-plaetze: „kopf“). */
  if (h === "liegen" && z.platz && z.platz.kopf) spiegel = z.platz.kopf === "rechts";
  if (z.umgedreht) spiegel = !spiegel;
  return { blick, spiegel };
}

/* Die Menschen im Baukasten sind immer bekleidet. Fehlt oben oder
   unten etwas (weil jemand das letzte Stück abgewählt hat), kommt das
   Grundstück dazu — ein Kleid, ein Badeanzug oder ein langer Mantel
   zählen dabei für beides. */
function bkKleidungFuerFigur(z) {
  const k = Object.assign({}, z.kleidung || {});
  const s = (p) => (k[p] && k[p].stueck && k[p].stueck !== "nichts") ? k[p].stueck : "";
  const kleid = ["sommerkleid", "abendkleid"].indexOf(s("kleid")) >= 0;
  const langerMantel = ["mantel", "bademantel", "kittel"].indexOf(s("jacke")) >= 0;
  const badeanzug = s("oberteil") === "badeanzug";
  if (!s("oberteil") && !kleid && !s("jacke")) k.oberteil = { stueck: "tshirt", farbe: "weiss" };
  if (!s("unterteil") && !kleid && !badeanzug && !langerMantel) k.unterteil = { stueck: "hose", farbe: "blau" };
  return k;
}

/* Welche Haltung wirklich gezeichnet wird. Sitzen ohne Sitzfläche (mitten
   im Raum): auf dem Boden — sonst säße die Figur in der Luft. In der
   Badewanne liegt man zurückgelehnt, nicht flach. Der Satz bleibt
   dabei „sitzt“ bzw. „liegt“. */
function bkGezeichneteHaltung(z, haltung) {
  let h = haltung || z.haltung;
  if ((h === "sitzen" || h === "lesen" || h === "sitzen_seit") && z.platz && typeof z.platz.sitzY !== "number") h = "sitzen_boden";
  const pose = h === "liegen" && z.platz && z.platz.bild === "baden" ? "baden" : h;
  return { haltung: h, pose };
}

function bkFigurSvg(z, hoehe, extra) {
  const M = window.DMA_MENSCH;
  if (!M) return null;
  extra = extra || {};
  const sz = (window.DMA_SZENE || {})[z.szene];
  const gh = bkGezeichneteHaltung(z, extra.haltung);
  const haltung = gh.haltung;
  const b = bkBlick(z, sz && sz.breite, haltung);
  const r = M.zeichne({
    id: extra.id || "bk", alter: z.alter, geschlecht: z.geschlecht, haut: z.haut,
    haarfarbe: z.haarfarbe, frisur: z.frisur, bart: z.bart, gesicht: z.gesicht,
    kleidung: bkKleidungFuerFigur(z),
    pose: extra.pose || gh.pose,
    blick: extra.blick != null ? extra.blick : b.blick,
    spiegel: extra.spiegel != null ? extra.spiegel : b.spiegel,
  });
  /* DER MASSSTAB — eine Zahl je Kulisse (DMA_PLATZ_MASS), damit dieselbe
     Frau auf dem Stuhl so groß ist wie am Herd. Die Figur ist in
     Zentimetern gebaut. */
  const k = hoehe > 0 ? hoehe / (r.hoehe || 100) : bkMassstab(z.szene);
  return {
    svg: '<g transform="scale(' + k.toFixed(4) + ')">' + r.svg + "</g>",
    breite: (r.box.x1 - r.box.x0) * k,
    hoehe: (r.hoehe || 100) * k,
    /* Der Ursprung der neuen Figur liegt schon auf dem Boden unter der
       Hüfte — „fuss“ ist deshalb 0. */
    fuss: 0,
    sitz: r.sitz ? r.sitz.y * k : null,
    sitzX: r.sitz ? r.sitz.x * k : 0,
    blick: b,
  };
}

/* Wo hängt die Figur? Stehend, kniend, liegend: am Boden unter der
   Hüfte. Sitzend am Gesäß — es liegt auf der Sitzfläche des Platzes
   (sitzY), die Füße fallen von selbst dorthin, wo sie hingehören. So
   „rastet“ die Figur auf dem Stuhl ein. */
const BK_SITZHALTUNG = { sitzen: 1, lesen: 1, sitzen_seit: 1, fersensitz: 1,
                         schneidersitz: 1, sitzen_boden: 1 };
function bkFigurAnker(fig, platz, haltung) {
  if (!fig || !platz) return { x: 0, y: 0 };
  const h = haltung || platz.haltung;
  const sitzend = BK_SITZHALTUNG[h] && fig.sitz !== null
    && typeof platz.sitzY === "number";
  if (sitzend) return { x: platz.x - fig.sitzX, y: platz.sitzY - fig.sitz };
  /* FASSUNG 834: Wer an einem Sitzplatz steht, kniet oder krabbelt, tut
     das VOR dem Möbel auf dem Boden — nicht auf der Rückenlehne (dort
     liegt platz.y). Der Boden ist eine Sitzhöhe (47 cm) unter der
     Sitzfläche. */
  if (h === "liegen" && typeof platz.liegY === "number") return { x: platz.x, y: platz.liegY - fig.fuss };
  if (typeof platz.sitzY === "number" && h !== "liegen") {
    return { x: platz.x, y: platz.sitzY + 47 * bkMassstab(platz.szene) - fig.fuss };
  }
  return { x: platz.x, y: platz.y - fig.fuss };
}

/* ------------------------------------------------------------
   4 — DIE BEDIENOBERFLÄCHE
   ------------------------------------------------------------ */
const Baukasten = (function () {
  "use strict";

  const zustand = {
    szene: "badezimmer",
    platz: null,
    alter: "erwachsen",
    geschlecht: "w",
    haut: "mittel",
    frisur: "lang",
    haarfarbe: "braun",
    bart: "",
    gesicht: "g1",
    haltung: "stehen",
    umgedreht: false,
    kleidung: {
      oberteil: { stueck: "tshirt", farbe: "rot" },
      unterteil: { stueck: "jeans", farbe: "blau" },
      schuhe: { stueck: "halbschuh", farbe: "braun" },
    },
  };

  /* ------------------------------------------------------------
     WAS DIE VORGABE IST — UND WAS DER NUTZER SELBST GEWÄHLT HAT
     ------------------------------------------------------------
     GEMELDET: „Wenn man die Frau zum Mann macht, hat der Mann immer
     noch die langen Haare. Und es macht auch keinen Unterschied, wenn
     man ihn zum alten Mann macht oder zur alten Frau — da gibt's keine
     grauen Haare."
     Je Alter und Geschlecht gibt es eine Vorgabe; sie wird beim
     Umschalten übernommen — ABER NUR, SOLANGE DER NUTZER NICHT SELBST
     GEWÄHLT HAT (`eigen`). ------------------------------------------ */
  const eigen = {};         // Feld -> true, sobald der Nutzer es wählt

  const BK_VORGABE = {
    "saeugling-m":  { frisur: "kurz",   haarfarbe: "hellblond",   bart: "" },
    "saeugling-w":  { frisur: "kurz",   haarfarbe: "hellblond",   bart: "" },
    "kleinkind-m":  { frisur: "kurz",   haarfarbe: "hellblond",   bart: "" },
    "kleinkind-w":  { frisur: "pony",   haarfarbe: "hellblond",   bart: "" },
    "kind-m":       { frisur: "kurz",   haarfarbe: "hellbraun",   bart: "" },
    "kind-w":       { frisur: "zopf",   haarfarbe: "hellbraun",   bart: "" },
    "jugendlich-m": { frisur: "kurz",   haarfarbe: "braun",       bart: "" },
    "jugendlich-w": { frisur: "lang",   haarfarbe: "braun",       bart: "" },
    "erwachsen-m":  { frisur: "kurz",   haarfarbe: "dunkelbraun", bart: "" },
    "erwachsen-w":  { frisur: "lang",   haarfarbe: "braun",       bart: "" },
    "alt-m":        { frisur: "glatze", haarfarbe: "grau",        bart: "bart_kurz" },
    "alt-w":        { frisur: "dutt",   haarfarbe: "weiss",       bart: "" },
  };
  const BK_NACHGEZOGEN = ["frisur", "haarfarbe", "bart"];

  function bkVorgabe() {
    return BK_VORGABE[zustand.alter + "-" + zustand.geschlecht]
      || BK_VORGABE["erwachsen-w"];
  }
  function bkVorgabenNachziehen() {
    const v = bkVorgabe();
    BK_NACHGEZOGEN.forEach((feld) => {
      if (!eigen[feld]) zustand[feld] = v[feld];
    });
    if (!bkBartErlaubt()) zustand.bart = "";
    /* Ein Säugling kann nicht stehen oder gehen: dann liegt, sitzt oder
       krabbelt er — was der Platz eher nahelegt. */
    if (!bkHaltungErlaubt(zustand.haltung)) {
      delete eigen.haltung;
      zustand.haltung = zustand.platz ? bkHaltungVomPlatz(zustand.platz) : "stehen";
    }
    /* Bikini nur für Erwachsene und Jugendliche. */
    if (["saeugling", "kleinkind", "kind"].indexOf(zustand.alter) >= 0) {
      ["oberteil", "unterteil"].forEach((p) => {
        const w = zustand.kleidung[p];
        if (w && /^bikini/.test(w.stueck)) zustand.kleidung[p] = p === "oberteil"
          ? { stueck: "tshirt", farbe: w.farbe } : { stueck: "shorts", farbe: w.farbe };
      });
    }
  }
  function bkBartErlaubt() {
    return zustand.geschlecht === "m"
      && ["jugendlich", "erwachsen", "alt"].indexOf(zustand.alter) >= 0;
  }

  /* Womit eine Figur anfaengt, wenn sie wieder etwas anziehen soll. */
  function bkGrundkleidung() {
    if (zustand.alter === "saeugling") {
      return { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "hose", farbe: "gelb" } };
    }
    return {
      oberteil: { stueck: "tshirt", farbe: "rot" },
      unterteil: { stueck: "jeans", farbe: "blau" },
      schuhe: { stueck: "halbschuh", farbe: "braun" },
    };
  }

  let geladen = {};      // was schon vom Netz geholt wurde
  let flaeche = null;    // der Bereich im Seitenaufbau

  function datei(weg) {
    if (geladen[weg]) return geladen[weg];
    geladen[weg] = new Promise((fertig) => {
      const s = document.createElement("script");
      /* Fassung 694: verkleinerte Kopie und eigener Stempel, wenn es sie gibt. */
      s.src = (window.DMA_Q ? DMA_Q(weg) : weg) + (window.DMA_V ? DMA_V(weg) : "?v=" + (window.DMA_VERSION || "1"));
      s.async = true;
      s.onload = () => fertig(true);
      s.onerror = () => { geladen[weg] = null; fertig(false); };
      document.head.appendChild(s);
    });
    return geladen[weg];
  }

  function plaetze() {
    return (window.DMA_PLAETZE || []).filter((p) => p.szene === zustand.szene);
  }
  function szenen() {
    const da = new Set((window.DMA_PLAETZE || []).map((p) => p.szene));
    return (window.DMA_SZENEN || []).filter((s) => da.has(s.id));
  }

  /* Alles holen, was für die aktuelle Auswahl gebraucht wird.
     FASSUNG 834: statt drei Figurendateien je Alter und Geschlecht
     (zusammen bis zu 3,4 MB) eine einzige für alle — figuren/mensch.js. */
  async function nachladen() {
    await datei("data-plaetze.js");
    if (!window.DMA_SZENEN) await datei("data-szenen.js");
    const s = zustand.szene;
    if (!(window.DMA_SZENE || {})[s]) await datei("szenen/" + s + ".js");
    if (!window.DMA_MENSCH) await datei("figuren/mensch.js");
  }

  /* ------------------------------------------------------------
     Zeichnen
     ------------------------------------------------------------ */
  function buehne() {
    const sz = (window.DMA_SZENE || {})[zustand.szene];
    if (!sz) return '<p class="empty-note">Die Kulisse wird geladen …</p>';
    if (!zustand.platz || zustand.platz.szene !== zustand.szene) {
      zustand.platz = plaetze().find((p) => p.frei) || plaetze()[0] || null;
      if (zustand.platz && !eigen.haltung) {
        zustand.haltung = bkHaltungVomPlatz(zustand.platz);
      }
    }
    const platz = zustand.platz;
    const fig = bkFigurSvg(zustand, 0);

    /* Sitzplätze bekommen einen eigenen Ring (gefüllter Kern): dort
       setzt sich die Figur hin, wenn man sie loslässt. */
    const marken = plaetze().map((p) => {
      const an = platz && p.id === platz.id;
      const sitz = typeof p.sitzY === "number";
      return '<g class="bk-platz ' + (an ? "bk-platz-an" : "") + (sitz ? " bk-platz-sitz" : "") + '" data-bk-platz="'
        + p.id + '" transform="translate(' + p.x + ',' + p.y + ')">'
        + '<circle r="9" fill="rgba(255,255,255,0.5)" stroke="#b4553c" '
        + 'stroke-width="1.4" stroke-dasharray="3 2"/>'
        + '<circle r="' + (sitz ? 4 : 2.6) + '" fill="#b4553c"/></g>';
    }).join("");

    const anker = bkFigurAnker(fig, platz, zustand.haltung);
    let figur = fig && platz
      ? '<g class="bk-figur" data-bk-figur="1" transform="translate('
        + p2(anker.x) + ',' + p2(anker.y) + ')">' + fig.svg + "</g>"
      : "";
    /* In der Badewanne verdeckt das Wasser alles unter dem Wasserspiegel. */
    if (figur && platz && typeof platz.wasserY === "number" && zustand.haltung === "liegen") {
      figur = '<clipPath id="bkWasser"><rect x="0" y="0" width="' + sz.breite + '" height="' + platz.wasserY + '"/></clipPath>'
        + '<g clip-path="url(#bkWasser)">' + figur + "</g>"
        + '<path d="M' + (platz.x - 34) + " " + platz.wasserY + "q17 -2 34 0t34 0" + '" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.2" stroke-linecap="round"/>';
    }

    return '<div class="bk-buehne"><svg viewBox="0 0 ' + sz.breite + " " + sz.hoehe
      + '" class="bk-svg" role="img" aria-label="Die gebaute Situation">'
      + '<g class="bk-kulisse">' + sz.kulisse + "</g>"
      /* Auf dem Stuhl sass schon ein gemalter Gast — der Platz sagt mit
         „verdeckt", wen er einnimmt; der tritt dann zur Seite. */
      + (sz.teile || []).filter((t) =>
          !platz || (platz.verdeckt || []).indexOf(t.id) < 0)
        .map((t) =>
          '<g transform="translate(' + t.x + "," + t.y + ')">' + t.kunst + "</g>").join("")
      + marken + figur + "</svg></div>"
      /* Die kleinen Bewegungen: winken, umdrehen, ein paar Schritte. */
      + '<div class="bk-aktionen">'
      + '<button type="button" class="bk-chip" data-bk-tu="winken">Winken</button>'
      + '<button type="button" class="bk-chip" data-bk-tu="umdrehen">Umdrehen</button>'
      + '<button type="button" class="bk-chip" data-bk-tu="gehen">Ein paar Schritte</button>'
      + "</div>";
  }
  function p2(v) { return Math.round(v * 10) / 10; }

  function wahlHtml(name, titel, werte, jetzt) {
    return '<div class="bk-wahl"><span class="bk-wahl-titel">' + titel + "</span>"
      + '<div class="bk-chips">' + werte.map((w) => {
          const wert = Array.isArray(w) ? w[0] : w;
          const text = Array.isArray(w) ? w[1] : w;
          return '<button type="button" class="bk-chip' + (wert === jetzt ? " bk-chip-an" : "")
            + '" data-bk="' + name + '" data-wert="' + wert + '">' + text + "</button>";
        }).join("") + "</div></div>";
  }

  /* Vier Fächer, immer nur EINES offen (Wo? · Wer? · Aussehen · Anziehen). */
  const BK_FAECHER = [
    ["wo", "📍 Wo?"], ["wer", "🧍 Wer?"],
    ["aussehen", "🎨 Aussehen"], ["kleidung", "👕 Anziehen"],
  ];

  function faecherHtml() {
    const offen = zustand.fach || "wo";
    return '<div class="bk-faecher">' + BK_FAECHER.map(([k, t]) =>
      '<button type="button" class="bk-fach' + (k === offen ? " bk-fach-an" : "")
      + '" data-bk-fach="' + k + '">' + t + "</button>").join("") + "</div>";
  }

  /* Welche Stücke zu welchem Platz am Körper gehören. Früher kam das
     aus den alten Figurendateien (DMA_FIGUR_PLATZ); jetzt steht es hier,
     und angeboten wird nur, was figuren/mensch.js auch zeichnet. */
  const BK_PLATZ_STUECKE = {
    kopf: ["muetze", "hut", "kappe", "helm", "weihnachtsmuetze", "kopftuch"],
    oberteil: ["tshirt", "hemd", "pullover", "bluse", "kellnerhemd", "polizeihemd", "arztkittel",
      "warnweste", "feuerwehrjacke", "weihnachtsmantel", "badeanzug", "bikinioberteil"],
    kleid: ["sommerkleid", "abendkleid", "schuerze"],
    jacke: ["jacke", "mantel", "weste", "kittel", "bademantel"],
    unterteil: ["hose", "jeans", "anzughose", "arbeitshose", "shorts", "rock", "badehose", "bikinihose"],
    schuhe: ["halbschuh", "turnschuh", "stiefel", "sandale", "gummistiefel"],
    zubehoer: ["brille", "tasche", "rucksack", "schal", "handschuhe", "tablett", "besen", "buch"],
  };
  function bkStueckeFuer(platz) {
    const kind = ["saeugling", "kleinkind", "kind"].indexOf(zustand.alter) >= 0;
    return (BK_PLATZ_STUECKE[platz] || []).filter((s) => {
      if (!BK_STUECK[s]) return false;
      if (kind && /^bikini|abendkleid|arztkittel|polizeihemd|feuerwehrjacke|kellnerhemd|anzughose|arbeitshose/.test(s)) return false;
      if (zustand.alter === "saeugling" && platz === "zubehoer") return false;
      return true;
    });
  }

  /* Welche Haltungen es für wen gibt: Säuglinge liegen, sitzen und
     krabbeln — sie stehen noch nicht, und servieren tut man erst als
     Erwachsener. */
  const BK_HALTUNGEN = ["stehen", "kontrapost", "gehen", "sitzen", "lesen", "sitzen_boden", "schneidersitz",
    "fersensitz", "hocken", "knien", "knien_halb", "knien_vor", "krabbeln", "liegen", "winken", "halten",
    "zeigen", "servieren"];
  function bkHaltungErlaubt(h) {
    if (zustand.alter === "saeugling") return ["sitzen_boden", "krabbeln", "liegen", "sitzen"].indexOf(h) >= 0;
    if (zustand.alter === "kleinkind") return h !== "servieren" && h !== "lesen";
    return true;
  }

  function steuerung() {
    const anGezogen = (platz) => (zustand.kleidung[platz] || {}).stueck || "nichts";
    const fach = zustand.fach || "wo";
    const teile = [];

    if (fach === "wo") {
      teile.push(wahlHtml("szene", "Der Ort", szenen().map((s) => [s.id, (s.emoji || "") + " " + s.titel]), zustand.szene));
      const pl = plaetze();
      if (pl.length) {
        teile.push(wahlHtml("platz", "Der Platz",
          pl.map((p) => [p.id, p.wo]), (zustand.platz || {}).id));
      }
    } else if (fach === "wer") {
      teile.push(wahlHtml("alter", "Das Alter", [
        ["saeugling", "Baby"], ["kleinkind", "Kleinkind"], ["kind", "Kind"],
        ["jugendlich", "Jugendliche"], ["erwachsen", "Erwachsen"], ["alt", "Alt"]], zustand.alter));
      teile.push(wahlHtml("geschlecht", "Mann oder Frau?",
        [["m", "♂ männlich"], ["w", "♀ weiblich"]], zustand.geschlecht));
      /* Der erste Knopf gibt die Entscheidung an den Platz zurück. */
      const liste = [[BK_HALTUNG_PLATZ, "wie es der Platz will"]]
        .concat(BK_HALTUNGEN.filter(bkHaltungErlaubt).map((k) => [k, BK_HALTUNG_NAME[k] || k]));
      teile.push(wahlHtml("haltung", "Die Haltung", liste,
        eigen.haltung ? zustand.haltung : BK_HALTUNG_PLATZ));
    } else if (fach === "aussehen") {
      teile.push(wahlHtml("haut", "Hautfarbe",
        Object.keys(BK_HAUT_NAME).map((k) => [k, BK_HAUT_NAME[k]]), zustand.haut));
      teile.push(wahlHtml("frisur", "Frisur",
        ["kurz", "lang", "locken", "zopf", "dutt", "pony", "glatze"].map((k) => [k, BK_FRISUR_NAME[k] || k]), zustand.frisur));
      if (bkBartErlaubt()) {
        teile.push(wahlHtml("bart", "Bart",
          [["", "— kein Bart"], ["bart_kurz", BK_FRISUR_NAME.bart_kurz], ["bart_voll", BK_FRISUR_NAME.bart_voll]],
          zustand.bart || ""));
      }
      teile.push(wahlHtml("haarfarbe", "Haarfarbe",
        Object.keys(BK_HAAR_NAME).map((k) => [k, BK_HAAR_NAME[k]]), zustand.haarfarbe));
      teile.push(wahlHtml("gesicht", "Gesicht",
        ["g1", "g2", "g3", "g4"].map((k, i) => [k, "Gesicht " + (i + 1)]), zustand.gesicht));
    } else {
      /* FASSUNG 834: Die Menschen im Baukasten sind bekleidet — es gibt
         keinen Schalter mehr für „nichts an“. Oberteil und Unterteil
         haben kein „—“: man tauscht sie, statt sie wegzunehmen (ein
         Kleid ersetzt beides). */
      ["kopf", "oberteil", "kleid", "jacke", "unterteil", "schuhe", "zubehoer"].forEach((platz) => {
        const liste = bkStueckeFuer(platz);
        if (!liste.length) return;
        const pflicht = platz === "oberteil" || platz === "unterteil";
        const leer = pflicht ? [] : [["nichts", platz === "schuhe" ? "barfuß" : "—"]];
        const namen = leer.concat(liste.map((s) => [s, (BK_STUECK[s] || [s])[0].replace(/^(der|die|das)\s+/, "")]));
        teile.push(wahlHtml("kl-" + platz, bkPlatzName(platz), namen, anGezogen(platz)));
      });
      teile.push(wahlHtml("farbe", "Farbe für das zuletzt Gewählte",
        Object.keys(BK_FARBE).map((f) => [f, BK_FARBE[f][0]]), zustand.letzteFarbe || "rot"));
    }
    return faecherHtml() + '<div class="bk-steuerung">' + teile.join("") + "</div>";
  }

  const BK_FRISUR_NAME = {
    kurz: "kurz", lang: "lang", locken: "Locken", zopf: "Zopf",
    dutt: "Dutt", glatze: "Glatze", pony: "Pony", kahl: "kahl",
    bart_kurz: "kurzer Bart", bart_voll: "Vollbart",
  };
  const BK_HALTUNG_PLATZ = "_platz";   // „der Platz entscheidet"
  const BK_HALTUNG_NAME = {
    stehen: "stehen", kontrapost: "locker stehen", gehen: "gehen",
    sitzen: "sitzen", lesen: "sitzen und lesen", sitzen_boden: "am Boden sitzen",
    schneidersitz: "Schneidersitz", fersensitz: "Fersensitz", hocken: "hocken",
    knien: "knien", knien_halb: "auf einem Knie", knien_vor: "vorgebeugt knien",
    krabbeln: "auf allen vieren", liegen: "liegen", winken: "winken",
    halten: "etwas halten", zeigen: "zeigen", servieren: "servieren",
    sitzen_seit: "seitlich sitzen",
  };
  const BK_HAUT_NAME = {
    sehrhell: "sehr hell", hell: "hell", mittel: "mittel",
    oliv: "oliv", dunkel: "dunkel", sehrdunkel: "sehr dunkel",
  };
  const BK_HAAR_NAME = {
    schwarz: "schwarz", dunkelbraun: "dunkelbraun", braun: "braun",
    hellbraun: "hellbraun", blond: "blond", hellblond: "hellblond",
    rot: "rot", grau: "grau", weiss: "weiß",
  };

  const BK_PLATZ_NAME = {
    kopf: "Auf dem Kopf", oberteil: "Oberteil", kleid: "Kleid oder Schürze",
    jacke: "Jacke", unterteil: "Unterteil", schuhe: "Schuhe",
    zubehoer: "Dazu",
  };
  function bkPlatzName(p) { return BK_PLATZ_NAME[p] || p; }

  function satzHtml() {
    const s = bkSatz(zustand);
    return '<div class="bk-satz"><p class="bk-satz-text">' + s + "</p>"
      + '<button type="button" class="btn btn-ghost bk-hoeren" data-bk-sprich="'
      + s.replace(/"/g, "&quot;") + '">🔊 Vorlesen</button></div>';
  }

  function zeichnen() {
    if (!flaeche) return;
    stopp();
    const bild = buehne();
    flaeche.innerHTML =
      '<h3 class="bk-titel">🧩 Der Situations-Baukasten</h3>'
      + '<p class="empty-note bk-hinweis">Bau dir eine Situation zusammen: such einen Ort,'
      + ' zieh die Figur auf einen Platz — auf einem Stuhl oder Sofa setzt sie sich hin —,'
      + ' zieh ihr an, was du willst, und lies unten, wie man das auf Deutsch sagt.</p>'
      + bild + satzHtml() + steuerung();
    binden();
  }

  /* Welche Haltung ein Platz nahelegt. */
  function bkHaltungVomPlatz(p) {
    if (zustand.alter === "saeugling") {
      return p.haltung === "liegen" ? "liegen" : (typeof p.sitzY === "number" ? "sitzen" : "sitzen_boden");
    }
    return p.haltung === "gehen" ? "gehen" : p.haltung;
  }

  /* Einen Platz einnehmen — an EINER Stelle, damit Ring, Knopf und
     Ziehen sich nicht unterschiedlich verhalten.
     FASSUNG 834: In der Dusche und in der Badewanne trägt die Figur
     einen Bademantel; danach bekommt sie ihre Sachen zurück. */
  const BK_BADEPLATZ = { dusche: 1, badewanne: 1 };
  function bkPlatzNehmen(p) {
    const warBad = zustand.platz && BK_BADEPLATZ[zustand.platz.teil];
    zustand.platz = p;
    if (!eigen.haltung) zustand.haltung = bkHaltungVomPlatz(p);
    if (BK_BADEPLATZ[p.teil]) {
      if (!warBad) zustand.vorher = zustand.kleidung;
      zustand.kleidung = { jacke: { stueck: "bademantel", farbe: "weiss" } };
    } else if (warBad) {
      zustand.kleidung = zustand.vorher || bkGrundkleidung();
    } else if (!Object.keys(zustand.kleidung).length) {
      zustand.kleidung = bkGrundkleidung();
    }
  }

  /* ------------------------------------------------------------
     DIE BEWEGUNG
     ------------------------------------------------------------
     Die Figur ist ein Skelett; jede Haltung ist eine Liste von Winkeln.
     Zwischen zwei Haltungen wird überblendet (Hinsetzen, Aufstehen),
     beim Platzwechsel geht sie hinüber (Gangzyklus), beim Winken
     schwingt der Unterarm. Gemalt wird nur die Figur neu, nicht die
     ganze Kulisse. */
  let lauf = null;
  function stopp() { if (lauf) { cancelAnimationFrame(lauf); lauf = null; } }
  function figurEl() { return flaeche && flaeche.querySelector("[data-bk-figur]"); }
  function figurMalen(st) {
    const el = figurEl();
    if (!el) return;
    const fig = bkFigurSvg(zustand, 0, { pose: st.pose, haltung: st.haltung, blick: st.blick, spiegel: st.spiegel, id: "bkb" });
    if (!fig) return;
    el.setAttribute("transform", "translate(" + p2(st.x) + "," + p2(st.y) + ")");
    el.innerHTML = fig.svg;
  }
  /* Wie die Figur gerade aussieht — Ausgangspunkt jeder Bewegung. */
  function jetzt() {
    const fig = bkFigurSvg(zustand, 0);
    const a = bkFigurAnker(fig, zustand.platz, zustand.haltung);
    return { x: a.x, y: a.y, pose: window.DMA_MENSCH.pose(bkGezeichneteHaltung(zustand).pose), blick: fig.blick.blick, spiegel: fig.blick.spiegel, haltung: zustand.haltung };
  }
  function ablauf(dauer, schritt, fertig) {
    stopp();
    const t0 = performance.now();
    const tick = (t) => {
      const u = Math.min(1, (t - t0) / dauer);
      schritt(u);
      if (u < 1) lauf = requestAnimationFrame(tick);
      else { lauf = null; if (fertig) fertig(); }
    };
    lauf = requestAnimationFrame(tick);
  }
  const weich = (u) => u * u * (3 - 2 * u);
  /* Überblenden von a nach b (Ort, Haltung, Blick). */
  function ueberblenden(a, b, dauer, fertig) {
    const M = window.DMA_MENSCH;
    ablauf(dauer, (u) => {
      const w = weich(u);
      figurMalen({ x: a.x + (b.x - a.x) * w, y: a.y + (b.y - a.y) * w,
        pose: M.mische(a.pose, b.pose, w), blick: a.blick + (b.blick - a.blick) * w,
        spiegel: w < 0.5 ? a.spiegel : b.spiegel, haltung: b.haltung });
    }, fertig);
  }
  /* Hinübergehen: aufstehen (falls nötig), gehen, am Ziel die Haltung
     des Platzes einnehmen — sitzend rastet das Gesäß auf der Sitzfläche ein. */
  function hinuebergehen(von, zu) {
    const M = window.DMA_MENSCH;
    const k = bkMassstab(zustand.szene);
    /* Zum Gehen steht die Figur auf dem Boden: der Punkt unter der Hüfte. */
    /* Der Anker jeder Haltung liegt auf dem Boden unter der Hüfte — auch
       beim Sitzen (dort, wo die Füße stehen). Gegangen wird also von
       Boden zu Boden, nicht zur Rückenlehne hinauf. */
    const startY = von.y;
    const zielBoden = zu.y;
    const dx = zu.x - von.x, dy = zielBoden - startY;
    const weg = Math.hypot(dx, dy);
    if (weg < 6) { ueberblenden(von, zu, 420); return; }
    const spiegel = dx < 0;
    const gehBlick = 72;
    const doppelschritt = 140 * k;
    const dauer = Math.min(2600, Math.max(700, weg / (95 * k) * 1000));
    const stand = { x: von.x, y: startY, pose: M.gehPose(0), blick: gehBlick, spiegel, haltung: "gehen" };
    /* 1. aufstehen / loslaufen */
    ueberblenden(von, stand, 260, () => {
      /* 2. gehen */
      ablauf(dauer, (u) => {
        const x = von.x + dx * u, y = startY + dy * u;
        const phase = (weg * u) / doppelschritt;
        figurMalen({ x, y, pose: M.gehPose(phase % 1), blick: gehBlick, spiegel, haltung: "gehen" });
      }, () => {
        /* 3. ankommen: in die Haltung des Platzes */
        const ende = { x: von.x + dx, y: zielBoden, pose: M.gehPose(((weg) / doppelschritt) % 1), blick: gehBlick, spiegel, haltung: "gehen" };
        ueberblenden(ende, zu, 480);
      });
    });
  }
  function winken() {
    const M = window.DMA_MENSCH;
    const a = jetzt();
    /* Wer sitzt, kniet oder liegt, winkt in dieser Haltung — die Beine
       bleiben, nur der rechte Arm geht hoch. */
    const oben = Object.assign({}, a.pose, {
      schulterR: M.POSEN.winken.schulterR, ellbogenR: M.POSEN.winken.ellbogenR,
      unterarmR: M.POSEN.winken.unterarmR, handR: M.POSEN.winken.handR, fingerR: M.POSEN.winken.fingerR,
      kopf: -8,
    });
    const b = Object.assign({}, a, { pose: oben, blick: Math.min(a.blick, 30) });
    ueberblenden(a, b, 380, () => {
      ablauf(1800, (u) => {
        const s = Math.sin(u * Math.PI * 2 * 3);
        const p = Object.assign({}, oben, {
          ellbogenR: M.POSEN.winken.ellbogenR - 10 + 22 * s,
          schulterR: Object.assign({}, M.POSEN.winken.schulterR, { seit: M.POSEN.winken.schulterR.seit + 6 * s }),
          handR: 8 + 12 * s,
        });
        figurMalen(Object.assign({}, b, { pose: p }));
      }, () => ueberblenden(b, a, 420));
    });
  }
  /* Ein paar Schritte hin und zurück — ohne den Platz zu wechseln. */
  function paarSchritte() {
    const M = window.DMA_MENSCH;
    const sz = (window.DMA_SZENE || {})[zustand.szene];
    const a = jetzt();
    const k = bkMassstab(zustand.szene);
    const richtung = zustand.platz && sz && zustand.platz.x > sz.breite / 2 ? -1 : 1;
    const boden = zustand.platz ? zustand.platz.y : a.y;
    const weite = 120 * k;
    const start = { x: a.x, y: boden, pose: M.gehPose(0), blick: 72, spiegel: richtung < 0, haltung: "gehen" };
    ueberblenden(a, start, 260, () => {
      ablauf(1500, (u) => {
        const hin = u < 0.5;
        const w = hin ? u * 2 : (1 - u) * 2;
        figurMalen({ x: a.x + richtung * weite * w, y: boden, pose: M.gehPose((u * 2.2) % 1), blick: 72,
          spiegel: hin ? richtung < 0 : richtung > 0, haltung: "gehen" });
      }, () => ueberblenden(Object.assign({}, start, { spiegel: richtung > 0 }), a, 420));
    });
  }

  function binden() {
    flaeche.querySelectorAll("[data-bk]").forEach((b) => {
      b.addEventListener("click", async () => {
        const was = b.dataset.bk, wert = b.dataset.wert;
        const vorher = jetzt();
        let bewegung = null;
        if (was === "szene") {
          zustand.szene = wert;
          zustand.platz = null;
          if (!Object.keys(zustand.kleidung).length) zustand.kleidung = bkGrundkleidung();
        }
        else if (was === "platz") {
          const p = plaetze().find((x) => x.id === wert);
          if (p) { zustand.platzVorher = zustand.platz; bkPlatzNehmen(p); bewegung = "gehen"; }
        }
        else if (was === "farbe") {
          zustand.letzteFarbe = wert;
          const p = zustand.letzterPlatz;
          if (p && zustand.kleidung[p]) zustand.kleidung[p].farbe = wert;
        } else if (was.indexOf("kl-") === 0) {
          const platz = was.slice(3);
          zustand.letzterPlatz = platz;
          if (wert === "nichts") delete zustand.kleidung[platz];
          else zustand.kleidung[platz] = { stueck: wert, farbe: zustand.letzteFarbe || "rot" };
          /* Ein Kleid ersetzt Oberteil und Unterteil; wer es wieder
             ablegt, bekommt die Grundsachen zurück. */
          if (platz === "kleid" && /kleid$/.test(wert)) { delete zustand.kleidung.oberteil; delete zustand.kleidung.unterteil; }
          if (platz === "kleid" && wert === "nichts") {
            const g = bkGrundkleidung();
            if (!zustand.kleidung.oberteil) zustand.kleidung.oberteil = g.oberteil;
            if (!zustand.kleidung.unterteil) zustand.kleidung.unterteil = g.unterteil;
          }
          if ((platz === "oberteil" || platz === "unterteil") && zustand.kleidung.kleid && /kleid$/.test(zustand.kleidung.kleid.stueck)) {
            delete zustand.kleidung.kleid;
            const g = bkGrundkleidung();
            if (!zustand.kleidung.oberteil) zustand.kleidung.oberteil = g.oberteil;
            if (!zustand.kleidung.unterteil) zustand.kleidung.unterteil = g.unterteil;
          }
        } else if (was === "haltung" && wert === BK_HALTUNG_PLATZ) {
          delete eigen.haltung;
          if (zustand.platz) zustand.haltung = bkHaltungVomPlatz(zustand.platz);
          bewegung = "blenden";
        } else if (was === "haltung") {
          eigen.haltung = true;
          zustand.haltung = wert;
          bewegung = "blenden";
        } else if (was === "alter" || was === "geschlecht") {
          zustand[was] = wert;
          bkVorgabenNachziehen();
        } else {
          eigen[was] = true;
          zustand[was] = wert;
        }
        await nachladen();
        zeichnen();
        if (bewegung && window.DMA_MENSCH) {
          const nachher = jetzt();
          figurMalen(vorher);
          if (bewegung === "gehen") hinuebergehen(vorher, nachher);
          else ueberblenden(vorher, nachher, 520);
        }
      });
    });
    flaeche.querySelectorAll("[data-bk-fach]").forEach((b) => {
      b.addEventListener("click", () => { zustand.fach = b.dataset.bkFach; zeichnen(); });
    });
    flaeche.querySelectorAll("[data-bk-tu]").forEach((b) => {
      b.addEventListener("click", () => {
        if (!window.DMA_MENSCH) return;
        const tu = b.dataset.bkTu;
        if (tu === "winken") winken();
        else if (tu === "gehen") paarSchritte();
        else if (tu === "umdrehen") {
          const a = jetzt();
          zustand.umgedreht = !zustand.umgedreht;
          zeichnen();
          const z = jetzt();
          figurMalen(a);
          /* Umdrehen über das Profil: erst zur Seite, dann andersherum. */
          const mitte = Object.assign({}, a, { blick: 88 });
          ueberblenden(a, mitte, 220, () => ueberblenden(Object.assign({}, mitte, { spiegel: z.spiegel }), z, 260));
        }
      });
    });
    flaeche.querySelectorAll("[data-bk-platz]").forEach((g) => {
      g.addEventListener("click", () => {
        const p = (window.DMA_PLAETZE || []).find((x) => x.id === g.dataset.bkPlatz);
        if (!p) return;
        const vorher = jetzt();
        zustand.platzVorher = zustand.platz;
        bkPlatzNehmen(p);
        nachladen().then(() => {
          zeichnen();
          const nachher = jetzt();
          figurMalen(vorher);
          hinuebergehen(vorher, nachher);
        });
      });
    });
    const sprich = flaeche.querySelector("[data-bk-sprich]");
    if (sprich) sprich.addEventListener("click", () => {
      if (window.Core && Core.speak) Core.speak(sprich.dataset.bkSprich, "de");
    });
    bkZiehen(flaeche);
  }

  /* Ziehen und Ablegen: die Figur lässt sich mit dem Finger auf einen
     anderen Platz schieben.
     FASSUNG 725 — XANDER (Funk 168): „dass man die Person von einem Punkt
     zum anderen ziehen kann ohne dass man zufällig aus Versehen mal etwas
     markiert … das ist so per Drag & Drop wie in einer App geht".
     Pointer-Ereignisse mit „Capture", großzügiger Griff, nichts markierbar,
     ein Ring zeigt den Zielplatz.
     FASSUNG 834: Beim Loslassen rastet die Figur ein — auf einem Stuhl,
     einer Bank oder dem Sofa setzt sie sich dabei hin (das Gesäß gleitet
     auf die Sitzfläche), sonst stellt sie sich auf den Platz. */
  function bkZiehen(wurzel) {
    const svg = wurzel.querySelector(".bk-svg");
    const figur = wurzel.querySelector("[data-bk-figur]");
    if (!svg || !figur) return;
    let zieht = null, ring = null, gezogen = false;

    const punkt = (e) => {
      const r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      return { x: (e.clientX - r.left) / r.width * vb.width, y: (e.clientY - r.top) / r.height * vb.height };
    };
    const naechster = (p) => {
      let best = null, weit = 1e9;
      plaetze().forEach((q) => {
        const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
        if (d < weit) { weit = d; best = q; }
      });
      return best;
    };
    const figurOrt = () => { const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(figur.getAttribute("transform") || ""); return m ? { x: +m[1], y: +m[2] } : null; };
    svg.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button > 0) return;
      const p = punkt(e), f = figurOrt(), vb = svg.viewBox.baseVal;
      const nah = e.target.closest && e.target.closest("[data-bk-figur]");
      /* FASSUNG 834: gegriffen wird überall am Körper — auch zwischen den
         Beinen oder neben dem Arm (Umriss der Figur plus 12 px). */
      const fr = figur.getBoundingClientRect();
      const imUmriss = e.clientX >= fr.left - 12 && e.clientX <= fr.right + 12 && e.clientY >= fr.top - 12 && e.clientY <= fr.bottom + 12;
      if (!nah && !imUmriss && !(f && Math.hypot(p.x - f.x, p.y - (f.y - vb.width * .03)) < vb.width * .09)) return;
      e.preventDefault();
      stopp();
      zieht = { id: e.pointerId, dx: f ? f.x - p.x : 0, dy: f ? f.y - p.y : 0 };
      gezogen = false;
      try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      figur.classList.add("bk-zieht");
      ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("class", "bk-zielring"); ring.setAttribute("r", String(vb.width * .035));
      ring.style.display = "none";
      svg.appendChild(ring);
    });
    svg.addEventListener("pointermove", (e) => {
      if (!zieht || e.pointerId !== zieht.id) return;
      e.preventDefault();
      const p = punkt(e), x = p.x + zieht.dx, y = p.y + zieht.dy;
      gezogen = true;
      figur.setAttribute("transform", "translate(" + p2(x) + "," + p2(y) + ")");
      /* Das Ziel ist der Platz unter dem FINGER (dort, wo man die Figur
         hinhält) — nicht der unter ihren Füßen. */
      const z = naechster(p);
      if (z && ring) {
        ring.setAttribute("cx", p2(z.x)); ring.setAttribute("cy", p2(z.y)); ring.style.display = "";
        ring.classList.toggle("bk-zielring-sitz", typeof z.sitzY === "number");
      }
    });
    const ab = (e) => {
      if (!zieht || e.pointerId !== zieht.id) return;
      const p = punkt(e), losX = p.x + zieht.dx, losY = p.y + zieht.dy;
      const ziel = gezogen ? naechster(p) : null;
      zieht = null;
      figur.classList.remove("bk-zieht");
      if (ring) { ring.remove(); ring = null; }
      try { svg.releasePointerCapture(e.pointerId); } catch (x) {}
      if (!gezogen) return;
      svg.addEventListener("click", (k) => { k.stopPropagation(); k.preventDefault(); }, { capture: true, once: true });
      setTimeout(() => { gezogen = false; }, 0);
      const vorher = jetzt();
      vorher.x = losX; vorher.y = losY;
      if (ziel) bkPlatzNehmen(ziel);
      nachladen().then(() => {
        zeichnen();
        if (!window.DMA_MENSCH) return;
        /* Einrasten: von der Stelle, an der der Finger losließ, auf den
           Platz — und dabei in dessen Haltung (Hinsetzen). */
        const nachher = jetzt();
        figurMalen(vorher);
        ueberblenden(vorher, nachher, 460);
      });
    };
    svg.addEventListener("pointerup", ab);
    svg.addEventListener("pointercancel", ab);
    svg.style.userSelect = "none"; svg.style.webkitUserSelect = "none"; svg.style.webkitTouchCallout = "none"; svg.style.touchAction = "none";
    svg.addEventListener("selectstart", (e) => e.preventDefault());
    svg.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  async function render(el) {
    flaeche = el || document.getElementById("baukastenArea");
    if (!flaeche) return;
    flaeche.innerHTML = '<p class="empty-note">Der Baukasten wird geladen …</p>';
    await nachladen();
    if (!zustand.platz) {
      const p = plaetze();
      zustand.platz = p.find((x) => x.frei) || p[0] || null;
      if (zustand.platz && !eigen.haltung) {
        zustand.haltung = bkHaltungVomPlatz(zustand.platz);
      }
    }
    zeichnen();
  }

  return {
    render: render, zustand: zustand, satz: () => bkSatz(zustand),
    /* für Sonden: läuft gerade eine Bewegung? */
    bewegt: () => Boolean(lauf),
  };
})();

window.Baukasten = Baukasten;
