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

const BK_VERB = {
  stehen: "steht", sitzen: "sitzt", liegen: "liegt",
  gehen: "geht", halten: "hält", winken: "winkt",
  werfen: "wirft", zeigen: "zeigt",
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

  /* Satz 1: Wer ist wo, und wie? */
  let eins = bkGross(subj.wort) + " " + (BK_VERB[z.haltung] || "ist");
  if (platz) eins += " " + platz.wo;
  if (platz && platz.tut) eins += " und " + platz.tut;
  saetze.push(eins + ".");

  /* Satz 2: Was hat er an? */
  const an = bkAngezogen(z);
  if (!an.length) {
    saetze.push(bkGross(subj.pron) + " hat nichts an.");
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
    saetze.push(bkGross(subj.pron) + " trägt " + bkUnd(teile) + ".");
  }
  return saetze.join(" ");
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
      raus.push(w);
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
    if (platz === "gesicht") { ebenen.push((h.gesichter || {})[z.gesicht] || ""); return; }
    if (platz === "frisur") { ebenen.push((h.frisuren || {})[z.frisur] || ""); return; }
    const w = z.kleidung[platz];
    if (!w || !w.stueck || w.stueck === "nichts") return;
    const teil = (h.kleidung || {})[w.stueck];
    if (!teil) return;
    ebenen.push('<g style="' + bkStoffStil(w) + '">' + teil + "</g>");
  });

  const k = hoehe / (h.hoehe || 100);
  return {
    svg: '<g style="' + aussen + '" transform="scale(' + k.toFixed(4) + ')">'
         + ebenen.join("") + "</g>",
    breite: (h.breite || 40) * k,
    hoehe: (h.hoehe || 100) * k,
    fuss: (h.fuss || 0) * k,
  };
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
    gesicht: "g1",
    haltung: "stehen",
    kleidung: {
      oberteil: { stueck: "tshirt", farbe: "rot" },
      unterteil: { stueck: "jeans", farbe: "blau" },
      schuhe: { stueck: "halbschuh", farbe: "braun" },
    },
  };

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
    if (!(window.DMA_FIGUR || {})[f]) {
      await datei("figuren/" + f + ".js");
      await datei("figuren/" + f + "-teil2.js");
    } else if (!((window.DMA_FIGUR[f].haltungen || {})[zustand.haltung])) {
      await datei("figuren/" + f + "-teil2.js");
    }
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
      if (zustand.platz) {
        zustand.haltung = zustand.platz.haltung === "gehen" ? "stehen" : zustand.platz.haltung;
      }
    }
    const platz = zustand.platz;
    const fig = bkFigurSvg(zustand, platz ? platz.hoehe : 74);

    const marken = plaetze().map((p) => {
      const an = platz && p.id === platz.id;
      return '<g class="bk-platz ' + (an ? "bk-platz-an" : "") + '" data-bk-platz="'
        + p.id + '" transform="translate(' + p.x + ',' + p.y + ')">'
        + '<circle r="9" fill="rgba(255,255,255,0.5)" stroke="#b4553c" '
        + 'stroke-width="1.4" stroke-dasharray="3 2"/>'
        + '<circle r="2.6" fill="#b4553c"/></g>';
    }).join("");

    const figur = fig && platz
      ? '<g class="bk-figur" data-bk-figur="1" transform="translate('
        + p2(platz.x) + ',' + p2(platz.y - fig.fuss) + ')">' + fig.svg + "</g>"
      : "";

    return '<div class="bk-buehne"><svg viewBox="0 0 ' + sz.breite + " " + sz.hoehe
      + '" class="bk-svg" role="img" aria-label="Die gebaute Situation">'
      + (window.DMA_FIGUR_DEFS || "")
      + '<g class="bk-kulisse">' + sz.kulisse + "</g>"
      + (sz.teile || []).map((t) =>
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

  function steuerung() {
    const bau = (window.DMA_FIGUR || {})[zustand.alter + "-" + zustand.geschlecht];
    const stuecke = (platz) => {
      const alle = window.DMA_FIGUR_PLATZ && window.DMA_FIGUR_PLATZ[platz];
      if (alle) return alle;
      const h = bau && (bau.haltungen[zustand.haltung] || bau.haltungen.stehen);
      if (!h) return [];
      return Object.keys(h.kleidung || {}).filter((k) => (h.platz || {})[k] === platz);
    };
    const anGezogen = (platz) => (zustand.kleidung[platz] || {}).stueck || "nichts";

    const teile = [];
    teile.push(wahlHtml("szene", "Wo?", szenen().map((s) => [s.id, (s.emoji || "") + " " + s.titel]), zustand.szene));
    teile.push(wahlHtml("alter", "Wer?", [
      ["saeugling", "Baby"], ["kleinkind", "Kleinkind"], ["kind", "Kind"],
      ["jugendlich", "Jugendliche"], ["erwachsen", "Erwachsen"], ["alt", "Alt"]], zustand.alter));
    teile.push(wahlHtml("geschlecht", "Mann oder Frau?", [["m", "männlich"], ["w", "weiblich"]], zustand.geschlecht));
    teile.push(wahlHtml("haut", "Hautfarbe",
      Object.keys(window.DMA_FIGUR_HAUT || {}).map((k) => [k, BK_HAUT_NAME[k] || k]), zustand.haut));
    const frisuren = Object.keys((bau && (bau.haltungen[zustand.haltung] || bau.haltungen.stehen) || {}).frisuren || {});
    teile.push(wahlHtml("frisur", "Frisur",
      frisuren.map((k) => [k, BK_FRISUR_NAME[k] || k]), zustand.frisur));
    teile.push(wahlHtml("haarfarbe", "Haarfarbe",
      Object.keys(window.DMA_FIGUR_HAAR || {}).map((k) => [k, BK_HAAR_NAME[k] || k]), zustand.haarfarbe));
    teile.push(wahlHtml("gesicht", "Gesicht",
      ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"].map((k, i) => [k, "Gesicht " + (i + 1)]), zustand.gesicht));

    ["kopf", "oberteil", "kleid", "jacke", "unterteil", "schuhe", "zubehoer"].forEach((platz) => {
      const liste = stuecke(platz);
      if (!liste.length) return;
      const namen = [["nichts", "—"]].concat(liste.map((s) => [s, (BK_STUECK[s] || [s])[0].replace(/^(der|die|das)\s+/, "")]));
      teile.push(wahlHtml("kl-" + platz, bkPlatzName(platz), namen, anGezogen(platz)));
    });
    teile.push(wahlHtml("farbe", "Farbe für das zuletzt Gewählte",
      Object.keys(BK_FARBE).map((f) => [f, BK_FARBE[f][0]]), zustand.letzteFarbe || "rot"));
    return '<div class="bk-steuerung">' + teile.join("") + "</div>";
  }

  const BK_FRISUR_NAME = {
    kurz: "kurz", lang: "lang", locken: "Locken", zopf: "Zopf",
    dutt: "Dutt", glatze: "Glatze", pony: "Pony", kahl: "kahl",
    bart_kurz: "kurzer Bart", bart_voll: "Vollbart",
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

  function binden() {
    flaeche.querySelectorAll("[data-bk]").forEach((b) => {
      b.addEventListener("click", async () => {
        const was = b.dataset.bk, wert = b.dataset.wert;
        if (was === "szene") {
          zustand.szene = wert;
          zustand.platz = null;
          /* Wer die Dusche verlaesst, zieht sich wieder an. */
          if (!Object.keys(zustand.kleidung).length) zustand.kleidung = bkGrundkleidung();
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
        } else zustand[was] = wert;
        await nachladen();
        zeichnen();
      });
    });
    flaeche.querySelectorAll("[data-bk-platz]").forEach((g) => {
      g.addEventListener("click", () => {
        const p = (window.DMA_PLAETZE || []).find((x) => x.id === g.dataset.bkPlatz);
        if (!p) return;
        zustand.platz = p;
        zustand.haltung = p.haltung === "gehen" ? "stehen" : p.haltung;
        /* An manchen Plätzen ist man nicht angezogen — in der Dusche,
           in der Badewanne. Das gehört zum Kontext, den der Satz
           beschreiben soll. */
        if (!p.an) zustand.kleidung = {};
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
      if (ziel) {
        zustand.platz = ziel;
        zustand.haltung = ziel.haltung === "gehen" ? "stehen" : ziel.haltung;
        if (!ziel.an) zustand.kleidung = {};
      }
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
      if (zustand.platz) zustand.haltung = zustand.platz.haltung === "gehen" ? "stehen" : zustand.platz.haltung;
    }
    zeichnen();
  }

  return { render: render, zustand: zustand, satz: () => bkSatz(zustand) };
})();

window.Baukasten = Baukasten;
