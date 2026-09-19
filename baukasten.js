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
};

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
  let eins = wer + " " + (BK_VERB[z.haltung] || "ist");
  if (platz) eins += " " + platz.wo;
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
  if (platz && platz.tut && !bkTutSagtDasselbe(platz)) eins += " und " + platz.tut;
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
  const an = anhabe.filter((st) => st !== schonGenannt);
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
   Der Browser legt die Ebenen übereinander. Die Reihenfolge steht
   in DMA_FIGUR_REIHENFOLGE, die Farben kommen als CSS-Variablen —
   so lässt sich die Hautfarbe wechseln, ohne die Ebene neu zu holen.
   ------------------------------------------------------------ */
/* Wie viele Bildeinheiten ein Zentimeter ist — der Kehrwert der Zahl
   aus DMA_PLATZ_MASS. Fehlt die Kulisse dort, gilt der Standardwert. */
function bkMassstab(szene) {
  const tafel = window.DMA_PLATZ_MASS || {};
  const cm = tafel[szene] || tafel._standard || 1.7;
  return 1 / cm;
}

function bkFigurSvg(z, hoehe) {
  const bau = (window.DMA_FIGUR || {})[z.alter + "-" + z.geschlecht];
  if (!bau) return null;
  const h = bau.haltungen[z.haltung] || bau.haltungen.stehen;
  if (!h) return null;

  /* Die Hautfarbe und die Haarfarbe gelten fuer die ganze Figur, also
     stehen sie am aeusseren Rahmen. Jedes Kleidungsstueck bekommt
     dagegen SEINE EIGENE Huelle mit seinen eigenen Stoffvariablen —
     sonst haetten Hose und Hemd zwangslaeufig dieselbe Farbe, weil
     beide dieselben Variablennamen benutzen. */
  const haut = (window.DMA_FIGUR_HAUT || {})[z.haut] || {};
  const haar = (window.DMA_FIGUR_HAAR || {})[z.haarfarbe] || {};
  const aussen = Object.keys(haut).map((k) => k + ":" + haut[k])
    .concat(Object.keys(haar).map((k) => k + ":" + haar[k])).join(";");

  const ebenen = [];
  const reihe = window.DMA_FIGUR_REIHENFOLGE
    || ["koerper", "unterteil", "kleid", "oberteil", "jacke", "schuhe",
        "kopf", "zubehoer", "gesicht", "frisur"];
  reihe.forEach((platz) => {
    if (platz === "koerper") { ebenen.push(h.koerper || ""); return; }
    if (platz === "gesicht") {
      /* Faellt die gemerkte Auswahl weg (die Figurendateien liefern
         jetzt vier Gesichter statt acht), wird das erste genommen —
         sonst stuende die Figur ohne Gesicht da. */
      const gs = h.gesichter || {};
      ebenen.push(gs[z.gesicht] || gs[Object.keys(gs)[0]] || "");
      return;
    }
    if (platz === "frisur") {
      /* Frisur UND Bart sind in den Figurendateien zwei ganz normale
         Frisur-Ebenen im selben Koordinatensystem. Sie lassen sich
         deshalb einfach übereinanderlegen — vorher schloss die eine
         die andere aus, und wer „Vollbart" wählte, bekam einen
         Glatzkopf mit Bart statt eines Mannes mit Haar und Bart. */
      ebenen.push((h.frisuren || {})[z.frisur] || "");
      if (z.bart) ebenen.push((h.frisuren || {})[z.bart] || "");
      return;
    }
    const w = z.kleidung[platz];
    if (!w || !w.stueck || w.stueck === "nichts") return;
    const teil = (h.kleidung || {})[w.stueck];
    if (!teil) return;
    ebenen.push('<g style="' + bkStoffStil(w) + '">' + teil + "</g>");
  });

  /* DER MASSSTAB.
     GEMELDET: „Wenn jemand sich auf den Stuhl oder auf die Couch setzt
     … die Größe soll sich dabei nicht ändern. Er soll in Relation zum
     Stuhl realistisch groß sein, auch wenn man sich auf die Toilette
     setzt, dann soll es keine Minifigur werden."

     Vorher brachte JEDER Platz seine eigene Wunschhöhe mit — 74 hier,
     58 dort. Dieselbe Person schrumpfte also beim Hinsetzen, und weil
     die Zahlen geschätzt waren, stimmte auch das Verhältnis zum Möbel
     nicht. Jetzt gibt es je Kulisse EINE Zahl: wie viele Zentimeter
     eine Bildeinheit sind (siehe DMA_PLATZ_MASS). Die Figurendateien
     sind in Zentimetern gezeichnet, also ist der Maßstab schlicht der
     Kehrwert. Eine Frau von 166 cm ist damit in jeder Haltung und an
     jedem Platz dieselbe Frau. */
  const k = hoehe > 0 ? hoehe / (h.hoehe || 100) : bkMassstab(z.szene);
  /* GEMELDET: „die Platzierung der Menschen funktioniert nicht. Wenn man
     sie auf Toilette setzt, dann sitzt sie nicht realistisch, oder wenn
     sie Fernsehen schaut, dann steht sie auf dem Fernseher."

     Ursache: die Figur wurde IMMER an den Fuessen aufgehaengt. Bei einer
     stehenden Figur ist das richtig — der Boden ist der Boden. Bei einer
     SITZENDEN Figur ist der entscheidende Punkt aber nicht der Fuss,
     sondern das Gesaess: es muss auf der Sitzflaeche liegen, dann fallen
     die Fuesse von allein dorthin, wo sie hingehoeren. Das Geruest
     kennt diesen Punkt bereits als „sitz". Er wird hier mitgegeben. */
  const pk = h.punkte || {};
  return {
    svg: '<g style="' + aussen + '" transform="scale(' + k.toFixed(4) + ')">'
         + ebenen.join("") + "</g>",
    breite: (h.breite || 40) * k,
    hoehe: (h.hoehe || 100) * k,
    fuss: (h.fuss || 0) * k,
    sitz: pk.sitz ? pk.sitz[1] * k : null,
    sitzX: pk.sitz ? pk.sitz[0] * k : 0,
  };
}

/* Wo haengt die Figur? Beim Stehen und Liegen an den Fuessen (der Boden
   ist der Boden), beim Sitzen am Gesaess (die Sitzflaeche ist die
   Sitzflaeche). Der Platz sagt mit „sitzY", wo seine Sitzflaeche liegt —
   fehlt die Angabe, bleibt es beim alten Verhalten. */
/* Welche Haltungen auf einer Sitzfläche aufliegen. Maßgeblich ist die
   Haltung der FIGUR, nicht die des Platzes: seit man die Haltung selbst
   wählen kann, kann jemand auf dem Stuhl auch stehen oder knien — dann
   gehört er an die Füße gehängt und nicht ans Gesäß. */
const BK_SITZHALTUNG = { sitzen: 1, sitzen_seit: 1, fersensitz: 1,
                         schneidersitz: 1, sitzen_boden: 1 };
function bkFigurAnker(fig, platz, haltung) {
  if (!fig || !platz) return { x: 0, y: 0 };
  const h = haltung || platz.haltung;
  const sitzend = BK_SITZHALTUNG[h] && fig.sitz !== null
    && typeof platz.sitzY === "number";
  if (sitzend) return { x: platz.x - fig.sitzX, y: platz.sitzY - fig.sitz };
  return { x: platz.x, y: platz.y - fig.fuss };
}

/* Die Stoffvariablen eines einzelnen Stuecks: erst die Farben, die das
   Stueck von Haus aus hat, dann — falls jemand eine Farbe gewaehlt hat —
   die gewaehlte darueber. */
function bkStoffStil(w) {
  const stil = [];
  const grund = (window.DMA_FIGUR_STUECK || {})[w.stueck] || {};
  Object.keys(grund).forEach((k) => stil.push(k + ":" + grund[k]));
  if (w.farbe) {
    const f = (window.DMA_FIGUR_STOFF || {})[w.farbe];
    if (f) {
      /* Die Stofftabelle nennt die Toene f/d/dd/h/naht; die Ebenen
         erwarten sie als --stoff-1, --stoff-1-d und so weiter. */
      const zu = { f: "--stoff-1", d: "--stoff-1-d", dd: "--stoff-1-dd",
                   h: "--stoff-1-h", naht: "--stoff-1-naht" };
      Object.keys(zu).forEach((k) => { if (f[k]) stil.push(zu[k] + ":" + f[k]); });
    } else {
      const grundton = bkFarbwert(w.farbe);
      stil.push("--stoff-1:" + grundton);
      stil.push("--stoff-1-d:" + bkDunkler(grundton, 0.22));
      stil.push("--stoff-1-dd:" + bkDunkler(grundton, 0.40));
      stil.push("--stoff-1-h:" + bkHeller(grundton, 0.22));
      stil.push("--stoff-1-naht:" + bkDunkler(grundton, 0.32));
    }
  }
  return stil.join(";");
}

const BK_FARBWERT = {
  rot: "#c0503f", blau: "#2d6da3", gruen: "#4e8a45", gelb: "#d9b23a",
  schwarz: "#33343a", weiss: "#f1f2f0", grau: "#8d8f93", braun: "#8a6142",
  gruen_d: "#2f5c34", rosa: "#d98ca8",
};
function bkFarbwert(n) { return BK_FARBWERT[n] || "#7a8fa6"; }
function bkMischen(hex, ziel, anteil) {
  const a = hex.replace("#", ""), b = ziel.replace("#", "");
  const z = (s, i) => parseInt(s.substr(i, 2), 16);
  const m = [0, 2, 4].map((i) => Math.round(z(a, i) + (z(b, i) - z(a, i)) * anteil));
  return "#" + m.map((v) => ("0" + v.toString(16)).slice(-2)).join("");
}
function bkDunkler(h, t) { return bkMischen(h, "#000000", t); }
function bkHeller(h, t) { return bkMischen(h, "#ffffff", t); }

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

     Ursache: `frisur` und `haarfarbe` standen als feste Anfangswerte im
     Zustand und wurden beim Umschalten von Alter oder Geschlecht nie
     nachgezogen. Jetzt gibt es je Alter und Geschlecht eine Vorgabe,
     und beim Umschalten wird sie übernommen.

     ABER NUR, SOLANGE DER NUTZER NICHT SELBST GEWÄHLT HAT. Wer der
     Frau ausdrücklich einen Dutt gegeben hat, will ihn nicht verlieren,
     bloß weil er danach das Alter ändert. Deshalb merkt sich `eigen`
     für jedes betroffene Feld, ob dort noch die Vorgabe steht oder eine
     eigene Wahl. Nur Felder, die noch auf der Vorgabe stehen, werden
     nachgezogen. ------------------------------------------------- */
  const eigen = {};         // Feld -> true, sobald der Nutzer es wählt

  /* Die Vorgaben. Beim Säugling und beim Kleinkind ist das Haar dünn
     und hell und es gibt keinen Bart; beim alten Menschen ist es grau
     oder weiß. */
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
  /* Nach jedem Wechsel von Alter oder Geschlecht: alles nachziehen, was
     noch auf der Vorgabe steht. */
  function bkVorgabenNachziehen() {
    const v = bkVorgabe();
    BK_NACHGEZOGEN.forEach((feld) => {
      if (!eigen[feld]) zustand[feld] = v[feld];
    });
    /* Ein Bart am Kind bleibt auch dann weg, wenn ihn jemand vorher
       ausdrücklich gewählt hat — es gibt für Kinder keine Bartebene,
       und „Vollbart" stünde dann als Knopf ohne Wirkung da. */
    if (!bkBartErlaubt()) zustand.bart = "";
  }
  function bkBartErlaubt() {
    return zustand.geschlecht === "m"
      && ["jugendlich", "erwachsen", "alt"].indexOf(zustand.alter) >= 0;
  }

  /* Womit eine Figur anfaengt, wenn sie wieder etwas anziehen soll. */
  function bkGrundkleidung() {
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
      s.src = weg + "?v=" + (window.DMA_VERSION || "1");
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

  /* Alles holen, was für die aktuelle Auswahl gebraucht wird. */
  async function nachladen() {
    /* Das Verzeichnis der Bilderwelt wird auch hier gebraucht — daraus
       kommen Titel, Emoji und Masse der Kulissen. Ohne es gaebe es im
       Baukasten keine Auswahl der Orte. */
    await datei("data-plaetze.js");
    if (!window.DMA_SZENEN) await datei("data-szenen.js");
    const s = zustand.szene;
    if (!(window.DMA_SZENE || {})[s]) await datei("szenen/" + s + ".js");
    const f = zustand.alter + "-" + zustand.geschlecht;
    /* Je Figur liegen DREI Dateien vor: Teil 1 stehen und halten,
       Teil 2 sitzen und liegen, Teil 3 die Haltungen am Boden (knien,
       Fersensitz, Schneidersitz, auf dem Boden sitzen, krabbeln).
       Teil 3 wurde hier nie geholt — die Haltungen darin waren damit
       nicht zu erreichen. */
    if (!(window.DMA_FIGUR || {})[f]) {
      await datei("figuren/" + f + ".js");
      await datei("figuren/" + f + "-teil2.js");
      await datei("figuren/" + f + "-teil3.js");
    } else if (!((window.DMA_FIGUR[f].haltungen || {})[zustand.haltung])) {
      await datei("figuren/" + f + "-teil2.js");
      await datei("figuren/" + f + "-teil3.js");
    }
    /* Und die elfte Haltung dazu: seitliches Sitzen. Sie steht in
       keiner der drei Dateien, weil sie nicht gezeichnet, sondern
       aus „liegen" und „krabbeln" zusammengesetzt wird — erst hier,
       wenn beide da sind. Die Datei ist fuer alle Figuren dieselbe
       und wird nur einmal geholt. */
    if (!window.DMA_SEITSITZ_BAUEN) await datei("figuren/seitsitz.js");
    try { window.DMA_SEITSITZ_BAUEN && window.DMA_SEITSITZ_BAUEN(f); } catch (e) {}
  }

  /* ------------------------------------------------------------
     Zeichnen
     ------------------------------------------------------------ */
  function buehne() {
    const sz = (window.DMA_SZENE || {})[zustand.szene];
    if (!sz) return '<p class="empty-note">Die Kulisse wird geladen …</p>';
    /* Wenn noch kein Platz gewaehlt ist, nimmt die Figur den freien Platz
       des Raumes. Der Satz muss denselben kennen, sonst beschreibt er eine
       andere Stelle als das Bild zeigt — deshalb wird er zurueckgeschrieben. */
    if (!zustand.platz || zustand.platz.szene !== zustand.szene) {
      zustand.platz = plaetze().find((p) => p.frei) || plaetze()[0] || null;
      if (zustand.platz && !eigen.haltung) {
        zustand.haltung = bkHaltungVomPlatz(zustand.platz);
      }
    }
    const platz = zustand.platz;
    /* 0 heisst: nicht auf eine Wunschhoehe zwingen, sondern den
       Massstab der Kulisse nehmen — die Figur ist dann ueberall so
       gross, wie sie in Wirklichkeit waere. */
    const fig = bkFigurSvg(zustand, 0);

    const marken = plaetze().map((p) => {
      const an = platz && p.id === platz.id;
      return '<g class="bk-platz ' + (an ? "bk-platz-an" : "") + '" data-bk-platz="'
        + p.id + '" transform="translate(' + p.x + ',' + p.y + ')">'
        + '<circle r="9" fill="rgba(255,255,255,0.5)" stroke="#b4553c" '
        + 'stroke-width="1.4" stroke-dasharray="3 2"/>'
        + '<circle r="2.6" fill="#b4553c"/></g>';
    }).join("");

    /* Aufhaengung ueber bkFigurAnker: stehend an den Fuessen, sitzend am
       Gesaess. Vorher stand hier platz.y - fig.fuss fuer ALLE Haltungen —
       daher sass die Figur nicht auf der Toilette, sondern stand mit den
       Fuessen auf deren Rand, und vor dem Fernseher stand sie oben drauf. */
    const anker = bkFigurAnker(fig, platz, zustand.haltung);
    const figur = fig && platz
      ? '<g class="bk-figur" data-bk-figur="1" transform="translate('
        + p2(anker.x) + ',' + p2(anker.y) + ')">' + fig.svg + "</g>"
      : "";

    return '<div class="bk-buehne"><svg viewBox="0 0 ' + sz.breite + " " + sz.hoehe
      + '" class="bk-svg" role="img" aria-label="Die gebaute Situation">'
      + (window.DMA_FIGUR_DEFS || "")
      + '<g class="bk-kulisse">' + sz.kulisse + "</g>"
      /* Derselbe Grund wie im Bilderraetsel: auf dem Stuhl sass schon
         ein gemalter Gast, und die eigene Figur wurde einfach
         darueberglegt — zwei Koerper auf einem Fleck. Der Platz sagt
         mit „verdeckt", wen er einnimmt; der tritt dann zur Seite. */
      + (sz.teile || []).filter((t) =>
          !platz || (platz.verdeckt || []).indexOf(t.id) < 0)
        .map((t) =>
          '<g transform="translate(' + t.x + "," + t.y + ')">' + t.kunst + "</g>").join("")
      + marken + figur + "</svg></div>";
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

  /* ------------------------------------------------------------
     GEMELDET: „Das System soll viel lockerer sein und nicht so
     überladen mit so vielen Möglichkeiten aufgeklappt — das soll man
     auswählen können. Außerdem habe ich keine Option, sie anzuziehen."

     Beides derselbe Grund: unter dem Bild standen fünfzehn Reihen
     Knöpfe UNTEREINANDER und alle offen. Was man suchte — das
     Anziehen — lag weit unterhalb des Bildrandes und war auf dem
     Telefon praktisch unerreichbar.

     Jetzt vier Fächer, immer nur EINES offen:
       📍 Wo?      Ort und Platz
       🧍 Wer?     Alter, Mann/Frau
       🎨 Aussehen Haut, Frisur, Haarfarbe, Gesicht
       👕 Anziehen an/aus und jedes Kleidungsstück
     ------------------------------------------------------------ */
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

  function steuerung() {
    const bau = (window.DMA_FIGUR || {})[zustand.alter + "-" + zustand.geschlecht];
    /* Angeboten wird nur, wofür BK_STUECK ein deutsches Wort kennt.
       Kommt aus den Figurendateien einmal ein Stück, das hier noch
       nicht steht, stünde sonst sein interner Name als Knopf da
       („rock_knie") und der Satz ließe es stillschweigend weg — in
       einem Werkzeug, dessen ganzer Zweck das deutsche Wort ist, ist
       ein Knopf ohne Wort schlimmer als gar kein Knopf. */
    const bekannt = (liste) => liste.filter((s) => BK_STUECK[s]);
    const stuecke = (platz) => {
      const alle = window.DMA_FIGUR_PLATZ && window.DMA_FIGUR_PLATZ[platz];
      if (alle) return bekannt(alle);
      const h = bau && (bau.haltungen[zustand.haltung] || bau.haltungen.stehen);
      if (!h) return [];
      return bekannt(Object.keys(h.kleidung || {})
        .filter((k) => (h.platz || {})[k] === platz));
    };
    const anGezogen = (platz) => (zustand.kleidung[platz] || {}).stueck || "nichts";

    const fach = zustand.fach || "wo";
    const teile = [];

    if (fach === "wo") {
      teile.push(wahlHtml("szene", "Der Ort", szenen().map((s) => [s.id, (s.emoji || "") + " " + s.titel]), zustand.szene));
      /* Die Plätze auch als Knöpfe, nicht nur als Ringe im Bild: mit dem
         Finger ist ein Knopf leichter zu treffen als ein Ring von neun
         Punkt Durchmesser. */
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
      /* GEWÜNSCHT: „Diese Positionen sollen alle Menschen immer
         einnehmen können … und im Baukasten sollen wir diese
         Positionen auch einnehmen können."
         Angeboten wird, was die geladenen Figurendateien wirklich
         mitbringen — eine Haltung ohne Ebenen wäre ein Knopf, der die
         Figur bloß aufstellt. */
      const halt = bau ? Object.keys(bau.haltungen || {}) : [];
      if (halt.length) {
        /* Der erste Knopf gibt die Entscheidung an den Platz zurück:
           sonst käme man aus einer einmal gewählten Haltung nie wieder
           heraus, und wer sich einmal hingekniet hat, kniete auch noch
           in der Badewanne. */
        const liste = [[BK_HALTUNG_PLATZ, "📍 wie es der Platz will"]]
          .concat(halt.map((k) => [k, BK_HALTUNG_NAME[k] || k]));
        teile.push(wahlHtml("haltung", "Die Haltung", liste,
          eigen.haltung ? zustand.haltung : BK_HALTUNG_PLATZ));
      }
    } else if (fach === "aussehen") {
      teile.push(wahlHtml("haut", "Hautfarbe",
        Object.keys(window.DMA_FIGUR_HAUT || {}).map((k) => [k, BK_HAUT_NAME[k] || k]), zustand.haut));
      const alleF = Object.keys((bau && (bau.haltungen[zustand.haltung] || bau.haltungen.stehen) || {}).frisuren || {});
      /* Frisur und Bart sind zwei getrennte Reihen. Vorher standen sie
         in EINER: wer „Vollbart" wählte, verlor damit die Frisur und
         bekam einen Glatzkopf mit Bart. */
      const frisuren = alleF.filter((k) => k.indexOf("bart") !== 0);
      teile.push(wahlHtml("frisur", "Frisur",
        frisuren.map((k) => [k, BK_FRISUR_NAME[k] || k]), zustand.frisur));
      const baerte = bkBartErlaubt() ? alleF.filter((k) => k.indexOf("bart") === 0) : [];
      if (baerte.length) {
        teile.push(wahlHtml("bart", "Bart",
          [["", "— kein Bart"]].concat(baerte.map((k) => [k, BK_FRISUR_NAME[k] || k])),
          zustand.bart || ""));
      }
      teile.push(wahlHtml("haarfarbe", "Haarfarbe",
        Object.keys(window.DMA_FIGUR_HAAR || {}).map((k) => [k, BK_HAAR_NAME[k] || k]), zustand.haarfarbe));
      /* Nur die Gesichter anbieten, die es wirklich gibt: die
         Figurendateien liefern vier statt acht, und die vier fehlenden
         Knöpfe zeigten alle dasselbe Gesicht. */
      const ges = Object.keys((bau && (bau.haltungen[zustand.haltung] || bau.haltungen.stehen) || {}).gesichter || {});
      if (ges.length) {
        teile.push(wahlHtml("gesicht", "Gesicht",
          ges.map((k, i) => [k, "Gesicht " + (i + 1)]), zustand.gesicht));
      }
    } else {
      /* Der Schalter, der gefehlt hat: mit einem Griff alles an oder
         alles aus. Darunter dann jedes Stück einzeln. */
      const etwasAn = Object.keys(zustand.kleidung).length > 0;
      teile.push(wahlHtml("anhaben", "Angezogen oder nicht?",
        [["an", "👕 angezogen"], ["aus", "🚿 nichts an"]], etwasAn ? "an" : "aus"));
      ["kopf", "oberteil", "kleid", "jacke", "unterteil", "schuhe", "zubehoer"].forEach((platz) => {
        const liste = stuecke(platz);
        if (!liste.length) return;
        const namen = [["nichts", "—"]].concat(liste.map((s) => [s, (BK_STUECK[s] || [s])[0].replace(/^(der|die|das)\s+/, "")]));
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
    stehen: "🧍 stehen", halten: "🤲 etwas halten",
    sitzen: "🪑 sitzen", liegen: "🛏️ liegen",
    knien: "🧎 knien", knien_vor: "🧎 vorgebeugt knien",
    fersensitz: "🧎 Fersensitz", schneidersitz: "🧘 Schneidersitz",
    sitzen_boden: "🧑‍🦯 am Boden sitzen", krabbeln: "🍼 krabbeln",
    sitzen_seit: "🪑 seitlich sitzen",
    gehen: "🚶 gehen", hocken: "🧎 hocken",
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
    kopf: "Auf dem Kopf", oberteil: "Oberteil", kleid: "Kleid",
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
    const bild = buehne();
    flaeche.innerHTML =
      '<h3 class="bk-titel">🧩 Der Situations-Baukasten</h3>'
      + '<p class="empty-note bk-hinweis">Bau dir eine Situation zusammen: such einen Ort,'
      + ' zieh die Figur auf einen Platz, zieh ihr an, was du willst — und lies unten,'
      + ' wie man das auf Deutsch sagt.</p>'
      + bild + satzHtml() + steuerung();
    binden();
  }

  /* Einen Platz einnehmen — an EINER Stelle, damit Ring, Knopf und
     Ziehen sich nicht unterschiedlich verhalten.

     An manchen Plätzen ist man nicht angezogen (Dusche, Badewanne). An
     allen anderen zieht sich die Figur wieder an, wenn sie von so einem
     Platz kommt — sonst saß sie nackt am Küchentisch, ohne dass das
     jemand wollte. Wer ausdrücklich „nichts an" gewählt hat, bleibt
     nackt. */
  /* Welche Haltung ein Platz nahelegt. „gehen" gibt es als Ebene nicht,
     dort steht die Figur. */
  function bkHaltungVomPlatz(p) {
    return p.haltung === "gehen" ? "stehen" : p.haltung;
  }

  function bkPlatzNehmen(p) {
    zustand.platz = p;
    /* Hat der Nutzer die Haltung selbst gewählt, bleibt sie stehen —
       sonst hätte er sie hingesetzt und der nächste Platz hätte sie
       wieder aufgestellt. */
    if (!eigen.haltung) zustand.haltung = bkHaltungVomPlatz(p);
    if (!p.an) zustand.kleidung = {};
    else if (!Object.keys(zustand.kleidung).length && !zustand.nacktGewollt) {
      zustand.kleidung = bkGrundkleidung();
    }
  }

  function binden() {
    flaeche.querySelectorAll("[data-bk]").forEach((b) => {
      b.addEventListener("click", async () => {
        const was = b.dataset.bk, wert = b.dataset.wert;
        if (was === "szene") {
          zustand.szene = wert;
          zustand.platz = null;
          /* Wer die Dusche verlaesst, zieht sich wieder an — es sei denn,
             das Ausziehen war ausdrücklich gewollt. */
          if (!Object.keys(zustand.kleidung).length && !zustand.nacktGewollt) {
            zustand.kleidung = bkGrundkleidung();
          }
        }
        else if (was === "platz") {
          const p = plaetze().find((x) => x.id === wert);
          if (p) bkPlatzNehmen(p);
        }
        else if (was === "anhaben") {
          zustand.nacktGewollt = wert === "aus";
          zustand.kleidung = wert === "aus" ? {} : bkGrundkleidung();
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
          /* Von Hand ausgezogen heißt: so soll es bleiben, auch wenn die
             Figur den Raum wechselt. */
          zustand.nacktGewollt = Object.keys(zustand.kleidung).length === 0;
        } else if (was === "haltung" && wert === BK_HALTUNG_PLATZ) {
          delete eigen.haltung;
          if (zustand.platz) zustand.haltung = bkHaltungVomPlatz(zustand.platz);
        } else if (was === "alter" || was === "geschlecht") {
          /* Erst umschalten, dann alles nachziehen, was noch auf der
             Vorgabe steht — daher hatte der Mann vorher die langen
             Haare der Frau und der Alte keine grauen. */
          zustand[was] = wert;
          bkVorgabenNachziehen();
        } else {
          /* Eine eigene Wahl. Ab jetzt wird dieses Feld nicht mehr
             nachgezogen. */
          eigen[was] = true;
          zustand[was] = wert;
        }
        await nachladen();
        zeichnen();
      });
    });
    flaeche.querySelectorAll("[data-bk-fach]").forEach((b) => {
      b.addEventListener("click", () => { zustand.fach = b.dataset.bkFach; zeichnen(); });
    });
    flaeche.querySelectorAll("[data-bk-platz]").forEach((g) => {
      g.addEventListener("click", () => {
        const p = (window.DMA_PLAETZE || []).find((x) => x.id === g.dataset.bkPlatz);
        if (!p) return;
        bkPlatzNehmen(p);
        nachladen().then(zeichnen);
      });
    });
    const sprich = flaeche.querySelector("[data-bk-sprich]");
    if (sprich) sprich.addEventListener("click", () => {
      if (window.Core && Core.speak) Core.speak(sprich.dataset.bkSprich, "de");
    });
    bkZiehen(flaeche);
  }

  /* Ziehen und Ablegen: die Figur lässt sich mit dem Finger auf einen
     anderen Platz schieben. Auf dem Telefon zählt dabei die Berührung,
     nicht die Maus — deshalb beides. */
  function bkZiehen(wurzel) {
    const svg = wurzel.querySelector(".bk-svg");
    const figur = wurzel.querySelector("[data-bk-figur]");
    if (!svg || !figur) return;
    let zieht = false;

    const punkt = (e) => {
      const r = svg.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      const vb = svg.viewBox.baseVal;
      return {
        x: (t.clientX - r.left) / r.width * vb.width,
        y: (t.clientY - r.top) / r.height * vb.height,
      };
    };
    const naechster = (p) => {
      let best = null, weit = 1e9;
      plaetze().forEach((q) => {
        const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
        if (d < weit) { weit = d; best = q; }
      });
      return best;
    };
    const los = (e) => { zieht = true; figur.classList.add("bk-zieht"); e.preventDefault(); };
    const zieh = (e) => {
      if (!zieht) return;
      const p = punkt(e);
      figur.setAttribute("transform", "translate(" + p2(p.x) + "," + p2(p.y) + ")");
      e.preventDefault();
    };
    const ab = (e) => {
      if (!zieht) return;
      zieht = false;
      figur.classList.remove("bk-zieht");
      const ziel = naechster(punkt(e.changedTouches ? { touches: e.changedTouches } : e));
      if (ziel) bkPlatzNehmen(ziel);
      nachladen().then(zeichnen);
    };
    figur.addEventListener("mousedown", los);
    figur.addEventListener("touchstart", los, { passive: false });
    window.addEventListener("mousemove", zieh);
    window.addEventListener("touchmove", zieh, { passive: false });
    window.addEventListener("mouseup", ab);
    window.addEventListener("touchend", ab);
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

  return { render: render, zustand: zustand, satz: () => bkSatz(zustand) };
})();

window.Baukasten = Baukasten;
