/* =========================================================
   AUSSPRACHE-KURS — Alphabet, Vokallänge, Konsonantenbündel
   ---------------------------------------------------------
   GEWÜNSCHT: „Das Alphabet wurde auch noch nicht behandelt …
   mit den Umlauten und den Regeln, das mit dem Dehnungs-h und
   dem E nach dem I, dass es das I lang macht … wenn ein
   Konsonant nach einem Vokal steht, dass der Vokal lang
   gesprochen wird … wenn mehr als ein Konsonant nach einem
   Vokal steht, dass der Vokal kurz gesprochen wird, die
   Ausnahmen davon … dass sie nicht SETR sagen, sondern
   Straße … Tricks, wie man ein sauberes Ü nachfüllen kann,
   vom I, indem man einen Kussmund macht … das mit dem NG
   richtig erklärt, mit einer grafischen Darstellung."

   Diese Datei wird erst geladen, wenn jemand den Aussprache-
   Kurs öffnet — sie gehört nicht in den Start.

   Aufbau: zu jeder Sprache vier Bausteine.
     ALPHABET      — jeder Buchstabe mit Name, Laut, Beispiel
     VERBINDUNGEN  — ch, sch, ie, ng … (zwei Zeichen, ein Laut)
     REGELN        — die Längenregeln mit ihren Ausnahmen
     BUENDEL       — Konsonanten am Stück, ohne Zwischenvokal
     TRICKS        — wie man einen Laut körperlich herstellt
   ========================================================= */
window.DMA_AUSSPRACHE = (() => {

  /* ---------------------------------------------------------
     GRAFIKEN
     Kleine Schnittbilder durch Mund und Rachen. Sie sind
     bewusst schematisch: Es geht nicht um Anatomie, sondern
     darum, WO die Zunge liegt und WOHIN die Luft geht.
     --------------------------------------------------------- */

  /* Kopf im Schnitt, von der Seite, Gesicht nach links.

     Aufteilung der Fläche, damit sich nichts überlagert:
       x   8 … 236  der Kopf selbst
       x 244 … 396  die Beschriftungsspalte, mit dünnen Zeigelinien
       y 218 … 232  die Legende (Luftweg / Verschluss)
       y 244 … 268  die Bildunterschrift, zwei Zeilen

     inhalt = das, was je nach Laut anders aussieht.
     marken = die Beschriftungen in der rechten Spalte.
     zeilen = die Bildunterschrift, als Liste von Zeilen. */
  function kopfSchnitt(inhalt, marken, zeilen, mitVerschluss) {
    const titel = zeilen.join(" ");
    return `<svg class="aus-grafik" viewBox="0 0 400 274" role="img" aria-label="${titel}">
      <defs>
        <marker id="luftpfeil" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="15"
                refX="13" refY="7.5" orient="auto">
          <path d="M0,0 L15,7.5 L0,15 z" fill="#2f7fae"/>
        </marker>
      </defs>
      <!-- Kopfumriss: Stirn, Nase, Lippen, Kinn -->
      <path d="M130,12 C82,14 50,46 48,86 L32,102 C26,110 32,117 40,117 L47,119
               L48,141 C49,154 60,161 72,159 L72,186 C72,202 86,212 104,212
               L235,212 L235,12 Z"
            fill="#fbf4e8" stroke="#c7b8a2" stroke-width="2.2"/>
      <!-- Nasenraum -->
      <path d="M52,64 C84,54 130,52 178,56 L178,78 C130,76 88,80 58,92 Z"
            fill="#eaf3fa" stroke="#b8cfe0" stroke-width="1.6"/>
      <text x="108" y="72" class="aus-lab">Nasenraum</text>
      <!-- harter Gaumen -->
      <path d="M58,96 C96,86 138,84 170,88" fill="none" stroke="#c7a98a" stroke-width="4" stroke-linecap="round"/>
      <!-- Zähne und Lippen -->
      <path d="M50,98 L50,108" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M50,130 L50,140" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M40,98 C32,106 32,140 40,148" fill="none" stroke="#d98b8b" stroke-width="5" stroke-linecap="round"/>
      <!-- Rachen -->
      <path d="M196,90 L196,200" stroke="#c7b8a2" stroke-width="2" stroke-dasharray="4 4"/>
      ${inhalt}
      ${marken}
      <!-- Legende -->
      <path d="M14,226 L38,226" stroke="#2f7fae" stroke-width="3" stroke-linecap="round" marker-end="url(#luftpfeil)"/>
      <text x="48" y="230" class="aus-lab">Weg der Luft</text>
      ${mitVerschluss ? `<circle cx="146" cy="226" r="7" fill="none" stroke="#d94f4f" stroke-width="2.4"/>
      <text x="158" y="230" class="aus-lab">Verschluss — hier ist zu</text>` : ""}
      ${zeilen.map((z, i) => `<text x="200" y="${250 + i * 13}" class="aus-unter" text-anchor="middle">${z}</text>`).join("")}
    </svg>`;
  }

  /* Eine Beschriftung rechts, mit Zeigelinie zum Ort im Bild. */
  function marke(x, y, zielX, zielY, zeilen) {
    return `<path d="M${x - 6},${y - 4} L${zielX},${zielY}" fill="none" stroke="#c2b6a3" stroke-width="1" stroke-dasharray="3 3"/>
      <circle cx="${zielX}" cy="${zielY}" r="2.6" fill="#a2957f"/>
      <text x="${x}" y="${y}" class="aus-lab">${zeilen.map((z, i) =>
        i === 0 ? z : `<tspan x="${x}" dy="12">${z}</tspan>`).join("")}</text>`;
  }

  // ng: Gaumensegel UNTEN (Nase offen), Zungenrücken HINTEN ZU.
  const SVG_NG = kopfSchnitt(`
      <!-- Gaumensegel hängt herunter: der Weg zur Nase ist offen -->
      <path d="M170,88 C180,98 182,110 178,124" fill="none" stroke="#8f6f4f" stroke-width="6" stroke-linecap="round"/>
      <!-- Zunge: vorne flach, hinten hoch bis an das Gaumensegel -->
      <path d="M52,146 C86,140 122,140 148,130 C164,124 172,110 174,94
               C176,112 176,132 170,142 C154,154 100,160 56,156 Z"
            fill="#e8908f" stroke="#c06e6d" stroke-width="2"/>
      <!-- Verschluss markieren -->
      <circle cx="172" cy="94" r="10" fill="none" stroke="#d94f4f" stroke-width="2.6"/>
      <!-- Luftweg: aus dem Rachen hoch und durch die Nase hinaus -->
      <path d="M196,178 C196,140 190,102 180,72 C152,60 104,56 58,64"
            fill="none" stroke="#2f7fae" stroke-width="3" stroke-linecap="round"
            marker-end="url(#luftpfeil)"/>
      <!-- der Mund ist versperrt -->
      <path d="M64,116 L92,116" stroke="#d94f4f" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="6 5"/>
      <path d="M100,110 L112,122 M112,110 L100,122" stroke="#d94f4f" stroke-width="2.6" stroke-linecap="round"/>
  `,
    marke(248, 60, 86, 66, ["Luft raus durch die Nase"])
    + marke(248, 104, 178, 110, ["Gaumensegel unten —", "der Weg zur Nase ist frei"])
    + marke(248, 150, 146, 132, ["Zungenrücken hoch:", "der Mund ist versperrt"]),
    ["ng — der Zungenrücken schließt hinten,", "die Luft geht durch die Nase"], true);

  // k/g zum Vergleich: Gaumensegel OBEN (Nase zu), Verschluss löst sich hörbar.
  const SVG_K = kopfSchnitt(`
      <path d="M170,88 C182,86 190,78 192,66" fill="none" stroke="#8f6f4f" stroke-width="6" stroke-linecap="round"/>
      <path d="M52,146 C86,140 122,140 148,130 C164,124 172,110 174,94
               C176,112 176,132 170,142 C154,154 100,160 56,156 Z"
            fill="#e8908f" stroke="#c06e6d" stroke-width="2"/>
      <circle cx="172" cy="94" r="10" fill="none" stroke="#d94f4f" stroke-width="2.6"/>
      <path d="M196,178 C192,142 184,114 174,102 C140,112 96,118 58,120"
            fill="none" stroke="#2f7fae" stroke-width="3" stroke-linecap="round"
            marker-end="url(#luftpfeil)"/>
      <path d="M58,62 L72,76 M72,62 L58,76" stroke="#d94f4f" stroke-width="2.6" stroke-linecap="round"/>
  `,
    marke(248, 64, 186, 74, ["Gaumensegel oben —", "die Nase ist zu"])
    + marke(248, 120, 116, 120, ["die Luft platzt", "durch den Mund"]),
    ["k und g — dieselbe Stelle, aber die Nase ist zu", "und der Verschluss löst sich hörbar"], true);

  // ich-Laut: Zunge vorne hoch am harten Gaumen.
  const SVG_ICH = kopfSchnitt(`
      <path d="M170,88 C182,86 190,78 192,66" fill="none" stroke="#8f6f4f" stroke-width="6" stroke-linecap="round"/>
      <path d="M52,146 C80,128 112,114 146,114 C168,114 176,122 180,136
               C166,148 100,158 56,156 Z"
            fill="#e8908f" stroke="#c06e6d" stroke-width="2"/>
      <path d="M196,178 C182,150 158,124 132,112 C104,102 76,102 56,106"
            fill="none" stroke="#2f7fae" stroke-width="3" stroke-linecap="round"
            marker-end="url(#luftpfeil)"/>
      <ellipse cx="112" cy="104" rx="30" ry="7" fill="none" stroke="#2f7fae" stroke-width="2" stroke-dasharray="4 4"/>
  `,
    marke(248, 100, 118, 104, ["enge Rille vorne —", "hier zischt es"])
    + marke(248, 148, 122, 130, ["Zungenspitze unten,", "Zungenblatt hoch"]),
    ["ich-Laut — die Enge liegt vorne am harten Gaumen", "(ich, nicht, Milch, durch, Mädchen)"]);

  // ach-Laut: Enge ganz hinten.
  const SVG_ACH = kopfSchnitt(`
      <path d="M170,88 C182,86 190,78 192,66" fill="none" stroke="#8f6f4f" stroke-width="6" stroke-linecap="round"/>
      <path d="M52,150 C92,146 128,142 152,130 C166,122 172,110 174,100
               C176,116 174,134 168,144 C152,156 100,160 56,158 Z"
            fill="#e8908f" stroke="#c06e6d" stroke-width="2"/>
      <path d="M196,178 C192,146 184,116 172,100 C138,110 96,118 58,120"
            fill="none" stroke="#2f7fae" stroke-width="3" stroke-linecap="round"
            marker-end="url(#luftpfeil)"/>
      <ellipse cx="172" cy="96" rx="15" ry="8" fill="none" stroke="#2f7fae" stroke-width="2" stroke-dasharray="4 4"/>
  `,
    marke(248, 92, 172, 96, ["die Enge liegt", "ganz hinten"])
    + marke(248, 146, 124, 144, ["Zungenrücken hoch,", "aber nicht ganz zu"]),
    ["ach-Laut — dieselbe Luft, aber die Enge liegt hinten", "(Bach, Buch, doch, auch)"]);

  /* Lippen von vorn: drei Bilder nebeneinander — i, unterwegs, ü. */
  function lippenReihe(a, b, c, unterschrift) {
    const mund = (x, breite, hoehe, farbe, titel) => `
      <g transform="translate(${x},70)">
        <ellipse cx="0" cy="0" rx="${breite}" ry="${hoehe}" fill="#6d2f34" stroke="${farbe}" stroke-width="7"/>
        <ellipse cx="0" cy="0" rx="${Math.max(3, breite * 0.45)}" ry="${Math.max(3, hoehe * 0.45)}" fill="#2a1013"/>
        <text x="0" y="${hoehe + 30}" class="aus-unter" text-anchor="middle">${titel}</text>
      </g>`;
    return `<svg class="aus-grafik aus-grafik-lippen" viewBox="0 0 330 140" role="img" aria-label="${unterschrift}">
      ${mund(58, 42, 13, "#d98b8b", a)}
      ${mund(165, 28, 17, "#d98b8b", b)}
      ${mund(272, 15, 15, "#c96a6a", c)}
      <path d="M104,70 L124,70" stroke="#8a7a66" stroke-width="2.4" marker-end="url(#lippenpfeil)"/>
      <path d="M210,70 L230,70" stroke="#8a7a66" stroke-width="2.4" marker-end="url(#lippenpfeil)"/>
      <defs><marker id="lippenpfeil" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill="#8a7a66"/></marker></defs>
      <text x="165" y="22" class="aus-unter" text-anchor="middle">${unterschrift}</text>
    </svg>`;
  }
  const SVG_UE = lippenReihe("iiii", "Lippen vor", "üüüü",
    "Die Zunge bleibt, wo sie ist — nur die Lippen runden sich.");
  const SVG_OE = lippenReihe("eeee", "Lippen vor", "öööö",
    "Dasselbe eine Etage tiefer: aus dem e wird ö.");

  /* Vokallänge als Bild: ein Balken lang, einer kurz. */
  const SVG_LAENGE = `<svg class="aus-grafik" viewBox="0 0 330 150" role="img" aria-label="Langer und kurzer Vokal">
    <text x="12" y="30" class="aus-unter">ein Konsonant → lang</text>
    <rect x="12" y="40" width="150" height="22" rx="11" fill="#8fc7a4"/>
    <text x="176" y="57" class="aus-lab">der Weg — Weeeg</text>
    <text x="12" y="96" class="aus-unter">zwei Konsonanten → kurz</text>
    <rect x="12" y="106" width="44" height="22" rx="11" fill="#e59a6a"/>
    <text x="70" y="123" class="aus-lab">das Bett — Bett</text>
  </svg>`;

  /* Das Dehnungs-h als stummer Verlängerer. */
  const SVG_DEHNH = `<svg class="aus-grafik" viewBox="0 0 330 130" role="img" aria-label="Das Dehnungs-h wird nicht gesprochen">
    <text x="165" y="44" class="aus-gross" text-anchor="middle">f a <tspan fill="#c9c2b6">h</tspan> r e n</text>
    <path d="M150,54 L182,54" stroke="#8fc7a4" stroke-width="5" stroke-linecap="round"/>
    <text x="165" y="82" class="aus-unter" text-anchor="middle">das h hört man nicht — es macht nur das a lang</text>
    <text x="165" y="110" class="aus-lab" text-anchor="middle">„faaren“, nicht „fa-hren“</text>
  </svg>`;

  /* Das Bündel: so sieht es aus, wenn ein Vokal dazwischenrutscht. */
  const SVG_BUENDEL = `<svg class="aus-grafik" viewBox="0 0 330 150" role="img" aria-label="Konsonanten am Stück">
    <text x="14" y="40" class="aus-gross">S t r a ß e</text>
    <path d="M16,50 L86,50" stroke="#8fc7a4" stroke-width="5" stroke-linecap="round"/>
    <text x="150" y="40" class="aus-lab aus-gruen">richtig: ein Anlauf</text>
    <text x="14" y="104" class="aus-gross" opacity="0.6">S <tspan fill="#d94f4f">e</tspan> t <tspan fill="#d94f4f">e</tspan> r a ß e</text>
    <path d="M16,114 L120,114" stroke="#d94f4f" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 6"/>
    <text x="170" y="104" class="aus-lab aus-rot">falsch: zwei Extra-Vokale</text>
  </svg>`;

  /* =========================================================
     DEUTSCH — DAS ALPHABET
     ========================================================= */
  const ALPHABET_DE = [
    { b: "A a", name: "a", ipa: "aː", laut: "Offen und klar, wie im Italienischen oder Arabischen.", bsp: "der Apfel", syl: "AP-fel", hinweis: "Kurz in „Apfel“, lang in „Abend“." },
    { b: "B b", name: "be", ipa: "beː", laut: "Wie im Englischen.", bsp: "das Buch", syl: "BUCH", hinweis: "Am Wortende wird daraus ein p: „halb“ klingt wie „halp“." },
    { b: "C c", name: "ze", ipa: "tseː", laut: "Allein fast nur in Fremdwörtern. Meist steckt es in ch, sch oder ck.", bsp: "der Chor", syl: "CHOR", hinweis: "Vor e und i oft wie z: „Cent“, „Celsius“." },
    { b: "D d", name: "de", ipa: "deː", laut: "Wie im Englischen.", bsp: "das Dach", syl: "DACH", hinweis: "Am Wortende wird daraus ein t: „Kind“ klingt wie „Kint“." },
    { b: "E e", name: "e", ipa: "eː", laut: "Geschlossen wie in „gehen“.", bsp: "der Esel", syl: "E-sel", hinweis: "Am Wortende nur gemurmelt: „bitte“ endet nicht auf ein klares e." },
    { b: "F f", name: "ef", ipa: "ɛf", laut: "Wie f.", bsp: "der Fuchs", syl: "FUCHS", hinweis: "Das v klingt in deutschen Wörtern genauso." },
    { b: "G g", name: "ge", ipa: "geː", laut: "Immer hart wie in „gut“ — nie wie im italienischen „gelato“.", bsp: "gut", syl: "GUT", hinweis: "Am Wortende wird daraus ein k: „Tag“ klingt wie „Tak“." },
    { b: "H h", name: "ha", ipa: "haː", laut: "Am Wortanfang gehaucht.", bsp: "das Haus", syl: "HAUS", hinweis: "Nach einem Vokal ist es stumm und macht ihn nur lang: „gehen“, „fahren“." },
    { b: "I i", name: "i", ipa: "iː", laut: "Wie i.", bsp: "der Igel", syl: "I-gel", hinweis: "Geschrieben als „ie“ ist es immer lang: „Liebe“." },
    { b: "J j", name: "jott", ipa: "jɔt", laut: "Wie das j in „ja“.", bsp: "ja", syl: "JA", hinweis: "Nicht wie das englische j in „job“ und nicht wie das spanische j." },
    { b: "K k", name: "ka", ipa: "kaː", laut: "Mit einem kleinen Hauch danach.", bsp: "die Katze", syl: "KAT-ze", hinweis: "Der Hauch fehlt im Italienischen — daran hört man den Unterschied." },
    { b: "L l", name: "el", ipa: "ɛl", laut: "Hell, die Zungenspitze liegt an den oberen Zähnen.", bsp: "laufen", syl: "LAU-fen", hinweis: "Nie dumpf wie das englische „well“." },
    { b: "M m", name: "em", ipa: "ɛm", laut: "Wie m.", bsp: "die Mutter", syl: "MUT-ter", hinweis: "" },
    { b: "N n", name: "en", ipa: "ɛn", laut: "Wie n.", bsp: "die Nacht", syl: "NACHT", hinweis: "Vor k und g wird daraus der ng-Laut: „danke“, „singen“." },
    { b: "O o", name: "o", ipa: "oː", laut: "Wie o.", bsp: "der Ofen", syl: "O-fen", hinweis: "Kurz in „Kopf“, lang in „Ofen“." },
    { b: "P p", name: "pe", ipa: "peː", laut: "Mit Hauch.", bsp: "das Papier", syl: "Pa-PIER", hinweis: "" },
    { b: "Q q", name: "ku", ipa: "kuː", laut: "Kommt nur als „qu“ vor und klingt dann wie kw.", bsp: "die Quelle", syl: "QUEL-le", hinweis: "„Quelle“ spricht man „Kwelle“." },
    { b: "R r", name: "er", ipa: "ɛʁ", laut: "Hinten im Rachen, fast ein leises Gurgeln.", bsp: "rot", syl: "ROT", hinweis: "Nach einem Vokal am Silbenende klingt es fast wie a: „Vater“ → „Vata“." },
    { b: "S s", name: "es", ipa: "ɛs", laut: "Vor einem Vokal summend, sonst scharf.", bsp: "die Sonne", syl: "SON-ne", hinweis: "„Sonne“ summt, „Haus“ nicht." },
    { b: "T t", name: "te", ipa: "teː", laut: "Mit Hauch.", bsp: "der Tisch", syl: "TISCH", hinweis: "" },
    { b: "U u", name: "u", ipa: "uː", laut: "Wie u — nie wie ü.", bsp: "die Uhr", syl: "UHR", hinweis: "" },
    { b: "V v", name: "vau", ipa: "faʊ̯", laut: "In deutschen Wörtern wie f.", bsp: "der Vater", syl: "VA-ter", hinweis: "In Fremdwörtern wie w: „die Vase“, „die Villa“." },
    { b: "W w", name: "we", ipa: "veː", laut: "Wie das englische v.", bsp: "das Wasser", syl: "WAS-ser", hinweis: "Nie wie das englische w in „water“." },
    { b: "X x", name: "ix", ipa: "ɪks", laut: "Wie ks.", bsp: "der Text", syl: "TEXT", hinweis: "" },
    { b: "Y y", name: "Ypsilon", ipa: "ˈʏpsilɔn", laut: "Meist wie ü.", bsp: "das System", syl: "Sys-TEM", hinweis: "„typisch“ klingt wie „tüpisch“." },
    { b: "Z z", name: "zett", ipa: "tsɛt", laut: "Immer ts.", bsp: "die Zeit", syl: "ZEIT", hinweis: "„Zeit“ spricht man „Tseit“ — nie wie das englische z." },
    { b: "Ä ä", name: "a-Umlaut", ipa: "ɛː", laut: "Ein offenes e.", bsp: "der Bär", syl: "BÄR", hinweis: "Lang in „Bär“, kurz in „die Äpfel“." },
    { b: "Ö ö", name: "o-Umlaut", ipa: "øː", laut: "Ein e mit gerundeten Lippen.", bsp: "schön", syl: "SCHÖN", hinweis: "Wie man es herstellt, steht unten bei den Tricks." },
    { b: "Ü ü", name: "u-Umlaut", ipa: "yː", laut: "Ein i mit gerundeten Lippen.", bsp: "die Tür", syl: "TÜR", hinweis: "Wie man es herstellt, steht unten bei den Tricks." },
    { b: "ß", name: "Eszett, scharfes s", ipa: "s", laut: "Immer scharf, nie summend.", bsp: "die Straße", syl: "STRA-ße", hinweis: "Steht nur nach langem Vokal oder Doppellaut: „Straße“ lang, „Fluss“ kurz." },
  ];

  /* =========================================================
     DEUTSCH — ZWEI ZEICHEN, EIN LAUT
     ========================================================= */
  const VERBINDUNGEN_DE = [
    { schrift: "ch", gesprochen: "ach-Laut", wann: "nach a, o, u und au", bsp: ["der Bach", "das Buch", "doch", "auch", "die Nacht"], hinweis: "Ganz hinten, wie ein sehr sanftes Gurgeln ohne Stimme." },
    { schrift: "ch", gesprochen: "ich-Laut", wann: "nach e, i, ä, ö, ü, ei, eu und nach l, n, r", bsp: ["ich", "nicht", "die Milch", "durch", "die Bücher"], hinweis: "Wie ein geflüstertes j. Die Endung -chen hat ihn immer: „das Mädchen“." },
    { schrift: "ch", gesprochen: "k oder sch", wann: "am Anfang von Fremdwörtern", bsp: ["der Chor", "der Charakter", "der Chef", "die Chance"], hinweis: "Griechisch → k, französisch → sch." },
    { schrift: "chs", gesprochen: "ks", wann: "wenn das s zum Wortstamm gehört", bsp: ["der Fuchs", "sechs", "wachsen"], hinweis: "Aber: „du machst“ = mach + st, dort bleibt der ach-Laut." },
    { schrift: "sch", gesprochen: "sch", wann: "immer", bsp: ["die Schule", "waschen", "der Tisch"], hinweis: "" },
    { schrift: "sp", gesprochen: "schp", wann: "am Wort- oder Silbenanfang", bsp: ["der Sport", "sprechen", "spät"], hinweis: "In der Mitte bleibt es sp: „die Wespe“, „knuspern“." },
    { schrift: "st", gesprochen: "scht", wann: "am Wort- oder Silbenanfang", bsp: ["die Stadt", "das Stück", "verstehen"], hinweis: "In der Mitte und am Ende bleibt es st: „der Fenster“-Teil „-ster“, „du bist“." },
    { schrift: "ie", gesprochen: "langes i", wann: "fast immer", bsp: ["die Liebe", "spielen", "wieder", "das Bier"], hinweis: "Das e spricht man nicht — es macht das i nur lang. Ausnahme in Fremdwörtern: „die Fa-mi-li-e“." },
    { schrift: "ei / ai", gesprochen: "ai", wann: "immer", bsp: ["das Ei", "die Zeit", "der Mai"], hinweis: "Nie „e-i“ getrennt." },
    { schrift: "eu / äu", gesprochen: "oi", wann: "immer", bsp: ["heute", "neu", "die Häuser"], hinweis: "" },
    { schrift: "au", gesprochen: "au", wann: "immer", bsp: ["das Auto", "laufen", "braun"], hinweis: "" },
    { schrift: "ng", gesprochen: "ein einziger Nasenlaut", wann: "immer", bsp: ["singen", "lang", "die Zeitung", "jung"], hinweis: "Danach kommt KEIN g. „singen“ ist nicht „sin-gen“." },
    { schrift: "nk", gesprochen: "ngk", wann: "immer", bsp: ["die Bank", "danke", "trinken"], hinweis: "Wie ng, aber der Verschluss löst sich hörbar." },
    { schrift: "pf", gesprochen: "p und f in einem Zug", wann: "immer", bsp: ["der Apfel", "die Pflanze", "der Kopf"], hinweis: "Beide Laute, ohne Pause dazwischen." },
    { schrift: "tsch", gesprochen: "wie das englische ch", wann: "immer", bsp: ["Deutsch", "tschüss", "die Rutsche"], hinweis: "" },
    { schrift: "th", gesprochen: "t", wann: "immer", bsp: ["das Theater", "die Apotheke", "das Thema"], hinweis: "Kein englisches th — einfach ein t." },
    { schrift: "ph", gesprochen: "f", wann: "in Fremdwörtern", bsp: ["die Physik", "das Alphabet"], hinweis: "" },
    { schrift: "qu", gesprochen: "kw", wann: "immer", bsp: ["die Quelle", "die Qualität", "bequem"], hinweis: "" },
    { schrift: "-er am Wortende", gesprochen: "a", wann: "unbetont am Ende", bsp: ["die Mutter", "wieder", "das Fenster"], hinweis: "„Mutter“ klingt wie „Mutta“." },
    { schrift: "-e am Wortende", gesprochen: "Murmellaut", wann: "unbetont am Ende", bsp: ["die Blume", "bitte", "gehen"], hinweis: "Nie ein klares e." },
    { schrift: "-ig am Wortende", gesprochen: "ich", wann: "unbetont am Ende", bsp: ["richtig", "wenig", "fertig"], hinweis: "Kommt eine Endung dazu, wird daraus ein g: „richtige“." },
    { schrift: "tz", gesprochen: "ts", wann: "nach kurzem Vokal", bsp: ["die Katze", "jetzt", "der Platz"], hinweis: "Zählt wie zwei Konsonanten — der Vokal davor ist kurz." },
    { schrift: "ck", gesprochen: "k", wann: "nach kurzem Vokal", bsp: ["der Zucker", "dick", "die Brücke"], hinweis: "Zählt wie zwei Konsonanten — der Vokal davor ist kurz." },
    { schrift: "ss / ß", gesprochen: "scharfes s", wann: "ss nach kurzem, ß nach langem Vokal", bsp: ["essen", "der Fluss", "die Straße", "groß"], hinweis: "Die Schreibung verrät die Länge des Vokals." },
  ];

  /* =========================================================
     DEUTSCH — DIE REGELN ZUR VOKALLÄNGE
     ========================================================= */
  const REGELN_DE = [
    {
      id: "einkons", titel: "Ein Konsonant nach dem Vokal → der Vokal ist lang", svg: SVG_LAENGE,
      text: "Steht hinter dem betonten Vokal nur ein einziger Konsonant, wird der Vokal lang gezogen. Das ist die häufigste Regel im Deutschen — und beim Lesen die nützlichste.",
      beispiele: [
        { wort: "der Tag", syl: "TAG" }, { wort: "der Weg", syl: "WEG" },
        { wort: "gut", syl: "GUT" }, { wort: "der Ofen", syl: "O-fen" },
        { wort: "die Blume", syl: "BLU-me" }, { wort: "lesen", syl: "LE-sen" },
        { wort: "der Name", syl: "NA-me" }, { wort: "das Leben", syl: "LE-ben" },
      ],
      ausnahmen: {
        text: "Kurz trotz nur einem Konsonanten — das sind fast nur kleine, sehr häufige Wörter. Sie lernt man als Liste:",
        woerter: ["das", "was", "man", "hat", "ab", "an", "in", "im", "um", "mit", "bis", "von", "vom", "hin", "ob", "es", "des", "weg (los!)", "bin", "ist"],
      },
    },
    {
      id: "mehrkons", titel: "Zwei oder mehr Konsonanten → der Vokal ist kurz",
      text: "Folgen dem Vokal zwei oder mehr Konsonanten, bleibt er kurz. ck und tz zählen dabei mit wie zwei.",
      beispiele: [
        { wort: "das Bett", syl: "BETT" }, { wort: "der Mann", syl: "MANN" },
        { wort: "der Kopf", syl: "KOPF" }, { wort: "die Wurst", syl: "WURST" },
        { wort: "kalt", syl: "KALT" }, { wort: "schnell", syl: "SCHNELL" },
        { wort: "die Katze", syl: "KAT-ze" }, { wort: "der Zucker", syl: "ZU-cker" },
      ],
      ausnahmen: {
        text: "Lang trotz Konsonantenhäufung — auch das ist eine überschaubare Liste:",
        woerter: ["der Mond", "das Obst", "der Papst", "die Magd", "die Jagd", "der Trost", "das Kloster", "Ostern", "die Erde", "das Pferd", "das Schwert", "die Art", "der Arzt", "der Bart", "zart", "der Wert", "die Geburt", "werden"],
      },
    },
    {
      id: "dehnh", titel: "Das Dehnungs-h macht lang und wird nicht gesprochen", svg: SVG_DEHNH,
      text: "Steht hinter dem Vokal ein h, das man nicht hört, ist es ein Dehnungs-h: Es ist nur ein Längenzeichen. Es steht fast immer vor l, m, n, r — oder am Wortende.",
      beispiele: [
        { wort: "fahren", syl: "FAH-ren" }, { wort: "der Sohn", syl: "SOHN" },
        { wort: "ihn", syl: "IHN" }, { wort: "die Uhr", syl: "UHR" },
        { wort: "der Zahn", syl: "ZAHN" }, { wort: "mehr", syl: "MEHR" },
        { wort: "wohnen", syl: "WOH-nen" }, { wort: "nehmen", syl: "NEH-men" },
        { wort: "die Kuh", syl: "KUH" }, { wort: "die Bahn", syl: "BAHN" },
      ],
      ausnahmen: {
        text: "Aufpassen: am Wort- oder Silbenanfang ist das h ein echter Laut und wird gehaucht:",
        woerter: ["das Haus", "die Hand", "hundert", "der Bahnhof (Bahn-HOF: das zweite h hört man)", "wohin (wo-HIN)"],
      },
    },
    {
      id: "ie", titel: "ie ist immer ein langes i — das e macht es lang",
      text: "Das e hinter dem i wird nicht gesprochen. Es ist, wie das Dehnungs-h, nur ein Längenzeichen. Deshalb gibt es „ieh“ (mit beidem) sogar doppelt gemoppelt: „sie zieht“.",
      beispiele: [
        { wort: "die Liebe", syl: "LIE-be" }, { wort: "spielen", syl: "SPIE-len" },
        { wort: "wieder", syl: "WIE-der" }, { wort: "viel", syl: "VIEL" },
        { wort: "das Bier", syl: "BIER" }, { wort: "tief", syl: "TIEF" },
        { wort: "der Brief", syl: "BRIEF" }, { wort: "ziehen", syl: "ZIE-hen" },
      ],
      ausnahmen: {
        text: "In Fremdwörtern gehören i und e zu zwei verschiedenen Silben und werden getrennt gesprochen:",
        woerter: ["die Fa-mi-li-e", "die Li-ni-e", "die Fe-ri-en", "die Ma-te-ri-a-li-en", "der Pa-ti-ent"],
      },
    },
    {
      id: "doppelvokal", titel: "Doppelvokal aa, ee, oo → immer lang",
      text: "Der dritte Weg, die Länge zu schreiben: den Vokal einfach zweimal hinschreiben. Gesprochen wird er trotzdem nur einmal — nur eben lang.",
      beispiele: [
        { wort: "der Saal", syl: "SAAL" }, { wort: "das Haar", syl: "HAAR" },
        { wort: "der See", syl: "SEE" }, { wort: "der Tee", syl: "TEE" },
        { wort: "das Boot", syl: "BOOT" }, { wort: "das Moos", syl: "MOOS" },
        { wort: "der Zoo", syl: "ZOO" }, { wort: "das Paar", syl: "PAAR" },
      ],
      ausnahmen: { text: "Es gibt kein ii, kein uu und kein doppeltes ä, ö, ü — dafür stehen ie und das Dehnungs-h.", woerter: [] },
    },
    {
      id: "doppelkons", titel: "Doppelkonsonant → der Vokal davor ist kurz",
      text: "Der doppelte Konsonant ist das Gegenstück zum Dehnungs-h: Er zeigt an, dass der Vokal KURZ ist. Gesprochen wird der Konsonant nur einmal — anders als im Italienischen.",
      beispiele: [
        { wort: "kommen", syl: "KOM-men" }, { wort: "die Sonne", syl: "SON-ne" },
        { wort: "der Hammer", syl: "HAM-mer" }, { wort: "bitte", syl: "BIT-te" },
        { wort: "alle", syl: "AL-le" }, { wort: "immer", syl: "IM-mer" },
        { wort: "der Fluss", syl: "FLUSS" }, { wort: "wissen", syl: "WIS-sen" },
      ],
      ausnahmen: { text: "Im Italienischen hält man den Doppelkonsonanten wirklich länger — im Deutschen nicht. „Sonne“ ist kein „Son-ne“ mit Pause.", woerter: [] },
    },
    {
      id: "offen", titel: "Vokal am Silbenende (offene Silbe) → lang",
      text: "Endet die betonte Silbe auf den Vokal selbst, ist er lang. Deshalb ist das a in „sa-gen“ lang, in „sagt“ aber nicht mehr.",
      beispiele: [
        { wort: "da", syl: "DA" }, { wort: "so", syl: "SO" },
        { wort: "du", syl: "DU" }, { wort: "wo", syl: "WO" },
        { wort: "sagen", syl: "SA-gen" }, { wort: "geben", syl: "GE-ben" },
        { wort: "der Vater", syl: "VA-ter" }, { wort: "die Nase", syl: "NA-se" },
      ],
      ausnahmen: { text: "Kurz bleiben trotzdem die kleinen Wörter aus der ersten Liste: „das“, „was“, „man“, „ab“, „in“.", woerter: [] },
    },
    {
      id: "sslaut", titel: "ß nach langem Vokal, ss nach kurzem",
      text: "Die Schreibung verrät die Länge. Wer das weiß, liest ein unbekanntes Wort auf Anhieb richtig.",
      beispiele: [
        { wort: "die Straße", syl: "STRA-ße" }, { wort: "der Fluss", syl: "FLUSS" },
        { wort: "groß", syl: "GROSS" }, { wort: "muss", syl: "MUSS" },
        { wort: "heißen", syl: "HEI-ßen" }, { wort: "essen", syl: "ES-sen" },
        { wort: "der Fuß", syl: "FUSS" }, { wort: "das Schloss", syl: "SCHLOSS" },
      ],
      ausnahmen: { text: "In der Schweiz schreibt man überall ss. Die Länge steht dann nicht im Wort — man muss sie kennen.", woerter: [] },
    },
    {
      id: "murmel", titel: "Das unbetonte e ist nur ein Murmeln",
      text: "In den Endungen -e, -en, -el, -er und in den Vorsilben be- und ge- ist das e kein klares e. Wer es klar ausspricht, klingt wie ein Roboter.",
      beispiele: [
        { wort: "die Blume", syl: "BLU-me" }, { wort: "gehen", syl: "GE-hen" },
        { wort: "der Löffel", syl: "LÖF-fel" }, { wort: "das Fenster", syl: "FENS-ter" },
        { wort: "besuchen", syl: "be-SU-chen" }, { wort: "gefallen", syl: "ge-FAL-len" },
      ],
      ausnahmen: { text: "Am Wortende klingt -er fast wie ein a: „Mutter“ → „Mutta“, „wieder“ → „wieda“.", woerter: [] },
    },
    {
      id: "auslaut", titel: "Am Wortende werden b, d, g hart",
      text: "Steht b, d oder g am Wort- oder Silbenende, wird daraus p, t oder k. Geschrieben wird trotzdem weiter b, d, g — deshalb hört man es nur, wenn man es weiß.",
      beispiele: [
        { wort: "der Tag", syl: "TAG", hinweis: "klingt wie „Tak“" },
        { wort: "das Kind", syl: "KIND", hinweis: "klingt wie „Kint“" },
        { wort: "halb", syl: "HALB", hinweis: "klingt wie „halp“" },
        { wort: "und", syl: "UND", hinweis: "klingt wie „unt“" },
        { wort: "der Berg", syl: "BERG", hinweis: "klingt wie „Berk“" },
        { wort: "der Dieb", syl: "DIEB", hinweis: "klingt wie „Diep“" },
      ],
      ausnahmen: { text: "Kommt eine Endung dazu, ist der Laut wieder weich: „die Tage“, „die Kinder“, „halbe“, „die Berge“.", woerter: [] },
    },
    {
      id: "knacklaut", titel: "Der Knacklaut: Wörter kleben nicht aneinander",
      text: "Jedes deutsche Wort, das mit einem Vokal beginnt, fängt mit einem winzigen Stopp im Hals an. Ohne ihn verschwimmt der Satz. Probe: Sag „oh-oh!“ — der kleine Stopp in der Mitte ist genau gemeint.",
      beispiele: [
        { wort: "am Abend", syl: "am A-bend", hinweis: "nicht „amabend“" },
        { wort: "das Auto", syl: "das AU-to", hinweis: "nicht „dasauto“" },
        { wort: "ein Ei", syl: "ein EI" },
        { wort: "im Oktober", syl: "im Ok-TO-ber" },
        { wort: "beobachten", syl: "be-OB-ach-ten", hinweis: "auch mitten im Wort" },
        { wort: "vereinbaren", syl: "ver-EIN-ba-ren" },
      ],
      ausnahmen: { text: "Im Französischen und im Italienischen bindet man genau umgekehrt — dort fließen die Wörter ineinander. Das ist der auffälligste Unterschied.", woerter: [] },
    },
    {
      id: "wortbetonung", titel: "Wo liegt die Betonung?",
      text: "Deutsche Wörter betonen fast immer die erste Silbe. Drei Gruppen weichen davon ab — und die muss man kennen.",
      beispiele: [
        { wort: "die Arbeit", syl: "AR-beit", hinweis: "Regel: erste Silbe" },
        { wort: "das Fenster", syl: "FENS-ter", hinweis: "Regel: erste Silbe" },
        { wort: "besuchen", syl: "be-SU-chen", hinweis: "be-, ge-, ver-, er-, ent-, zer-, emp- sind NIE betont" },
        { wort: "verstehen", syl: "ver-STE-hen", hinweis: "nie betont" },
        { wort: "aufstehen", syl: "AUF-ste-hen", hinweis: "trennbare Vorsilben sind IMMER betont" },
        { wort: "einkaufen", syl: "EIN-kau-fen", hinweis: "trennbar, also betont" },
        { wort: "die Situation", syl: "Si-tu-a-TI-on", hinweis: "-ion, -ität, -ieren betonen hinten" },
        { wort: "die Universität", syl: "U-ni-ver-si-TÄT", hinweis: "hinten betont" },
        { wort: "telefonieren", syl: "te-le-fo-NIE-ren", hinweis: "hinten betont" },
      ],
      ausnahmen: { text: "Bei zusammengesetzten Wörtern trägt das ERSTE Glied die Hauptbetonung: „der HAUStür“-Typ, also „die HAUS-tür“, „der SCHREIB-tisch“, „die ZAHN-arzt-pra-xis“.", woerter: [] },
    },
  ];

  /* =========================================================
     DEUTSCH — KONSONANTEN AM STÜCK
     GEWÜNSCHT: „dass sie nicht SETR sagen … sondern Straße"
     ========================================================= */
  const BUENDEL_DE = [
    { schrift: "str-", gesprochen: "schtr", bsp: "die Straße", syl: "STRA-ße", falsch: "Se-tra-ße / Es-tra-ße", weitere: ["der Strand", "der Strom", "streng", "der Strumpf", "die Straßenbahn"] },
    { schrift: "spr-", gesprochen: "schpr", bsp: "sprechen", syl: "SPRE-chen", falsch: "Se-pre-chen", weitere: ["die Sprache", "springen", "der Spruch", "die Spritze"] },
    { schrift: "st-", gesprochen: "scht", bsp: "die Stadt", syl: "STADT", falsch: "Es-tadt / Se-tadt", weitere: ["der Stuhl", "stehen", "das Stück", "die Straße"] },
    { schrift: "sp-", gesprochen: "schp", bsp: "der Sport", syl: "SPORT", falsch: "Es-port", weitere: ["spielen", "spät", "der Spiegel", "sparen"] },
    { schrift: "schw-", gesprochen: "schw", bsp: "schwer", syl: "SCHWER", falsch: "sche-wer", weitere: ["die Schwester", "schwimmen", "schwarz"] },
    { schrift: "schl-", gesprochen: "schl", bsp: "schlafen", syl: "SCHLA-fen", falsch: "sche-lafen", weitere: ["der Schlüssel", "schlecht", "schlimm"] },
    { schrift: "schn-", gesprochen: "schn", bsp: "schnell", syl: "SCHNELL", falsch: "sche-nell", weitere: ["der Schnee", "schneiden", "die Schnur"] },
    { schrift: "schm-", gesprochen: "schm", bsp: "schmecken", syl: "SCHME-cken", falsch: "sche-mecken", weitere: ["der Schmerz", "schmal", "der Schmuck"] },
    { schrift: "pfl-", gesprochen: "pfl", bsp: "die Pflanze", syl: "PFLAN-ze", falsch: "pe-flanze", weitere: ["die Pflicht", "pflegen", "die Pflaume"] },
    { schrift: "kn-", gesprochen: "kn", bsp: "das Knie", syl: "KNIE", falsch: "ke-nie", weitere: ["der Knopf", "der Knoten", "knapp"] },
    { schrift: "gn-", gesprochen: "gn", bsp: "gnädig", syl: "GNÄ-dig", falsch: "ge-nädig", weitere: ["das Gnu"] },
    { schrift: "zw-", gesprochen: "tsw", bsp: "zwei", syl: "ZWEI", falsch: "tse-wei", weitere: ["zwischen", "der Zweck", "der Zwilling"] },
    { schrift: "tr- / dr- / gr- / kr- / br-", gesprochen: "am Stück", bsp: "trinken", syl: "TRIN-ken", falsch: "te-rinken", weitere: ["drei", "groß", "krank", "das Brot", "das Gras"] },
    { schrift: "fl- / bl- / kl- / pl- / gl-", gesprochen: "am Stück", bsp: "das Glas", syl: "GLAS", falsch: "ge-las", weitere: ["fliegen", "blau", "klein", "der Platz"] },
    { schrift: "-rst", gesprochen: "rst", bsp: "die Wurst", syl: "WURST", falsch: "Wu-res-t", weitere: ["der Herbst", "du weißt", "der Durst", "zuerst"] },
    { schrift: "-ngst", gesprochen: "ngst", bsp: "die Angst", syl: "ANGST", falsch: "An-ge-st", weitere: ["du bringst", "du singst", "längst"] },
    { schrift: "-mpf", gesprochen: "mpf", bsp: "der Kampf", syl: "KAMPF", falsch: "Kam-pef", weitere: ["der Strumpf", "der Sumpf", "impfen"] },
    { schrift: "-chst", gesprochen: "chst", bsp: "nächste", syl: "NÄCHS-te", falsch: "näch-es-te", weitere: ["du machst", "höchste", "du sprichst"] },
    { schrift: "-rzt", gesprochen: "rtst", bsp: "der Arzt", syl: "ARZT", falsch: "A-re-tset", weitere: ["du tanzt", "der Schmerz"] },
    { schrift: "-rbst", gesprochen: "rbst", bsp: "der Herbst", syl: "HERBST", falsch: "Her-be-st", weitere: ["du stirbst", "du wirbst"] },
    { schrift: "-tzt", gesprochen: "tst", bsp: "jetzt", syl: "JETZT", falsch: "jet-set", weitere: ["zuletzt", "du sitzt", "besetzt"] },
    { schrift: "-pft", gesprochen: "pft", bsp: "er kämpft", syl: "KÄMPFT", falsch: "käm-pe-fet", weitere: ["geimpft", "er hüpft"] },
  ];

  /* Zungenbrecher — kurz, alltagsnah, nicht albern. */
  const ZUNGENBRECHER_DE = [
    { satz: "Die Straßenbahn steht am Strand.", uebt: "str und st" },
    { satz: "Im Herbst schmeckt der Kuchen am besten.", uebt: "-rbst und sch" },
    { satz: "Der Arzt hat jetzt keine Angst mehr.", uebt: "-rzt, -tzt, -ngst" },
    { satz: "Fischers Fritz fischt frische Fische.", uebt: "f und fr" },
    { satz: "Zwischen zwei Zwetschgenzweigen sitzen zwei Zwillinge.", uebt: "zw" },
    { satz: "Ich spreche Deutsch und spiele Schach.", uebt: "sp, sch, ich-Laut" },
    { satz: "Der Kampf um den Strumpf im Sumpf.", uebt: "-mpf" },
    { satz: "Nächste Woche kaufe ich sechs Bücher.", uebt: "-chst, chs, ch" },
    { satz: "Am Abend isst Anna einen Apfel.", uebt: "der Knacklaut" },
    { satz: "Singen macht die Wohnung jung.", uebt: "ng" },
  ];

  /* =========================================================
     DEUTSCH — DIE TRICKS
     GEWÜNSCHT: Ü vom I mit Kussmund, Ö vom E, ng grafisch
     ========================================================= */
  const TRICKS_DE = [
    {
      id: "ue", titel: "Ü holst du dir aus dem I", svg: SVG_UE,
      worum: "Im Arabischen, Englischen, Italienischen, Spanischen, Russischen und Polnischen gibt es kein ü. (Im Türkischen und im Französischen schon.) Man muss den Laut auch nicht suchen — man baut ihn aus einem i.",
      schritte: [
        "Sag ein langes „iiiii“ und halte es.",
        "Lass die Zunge genau dort, wo sie ist. Sie bewegt sich in diesem ganzen Trick kein Stück.",
        "Schiebe jetzt nur die Lippen nach vorn, als wolltest du jemandem einen Kuss geben.",
        "Aus dem i wird von selbst ein ü: iiii → üüüü. Hin und her, bis es sitzt.",
      ],
      beispiele: [
        { wort: "die Tür", syl: "TÜR" }, { wort: "über", syl: "Ü-ber" },
        { wort: "fünf", syl: "FÜNF" }, { wort: "müde", syl: "MÜ-de" },
        { wort: "grün", syl: "GRÜN" }, { wort: "früh", syl: "FRÜH" },
        { wort: "die Bücher", syl: "BÜ-cher" }, { wort: "die Brücke", syl: "BRÜ-cke" },
      ],
      probe: "Hörprobe: „die Tür“ und „die Tour“ dürfen nicht gleich klingen. Wer bei „Tür“ ein u hört, hat die Zunge mitbewegt.",
    },
    {
      id: "oe", titel: "Ö holst du dir aus dem E", svg: SVG_OE,
      worum: "Derselbe Trick eine Etage tiefer.",
      schritte: [
        "Sag ein langes „eeeee“ wie in „gehen“ und halte es.",
        "Zunge bleibt liegen — wieder ohne jede Bewegung.",
        "Lippen nach vorn runden, Kussmund.",
        "Aus dem e wird ein ö: eeee → öööö.",
      ],
      beispiele: [
        { wort: "schön", syl: "SCHÖN" }, { wort: "hören", syl: "HÖ-ren" },
        { wort: "zwölf", syl: "ZWÖLF" }, { wort: "öffnen", syl: "ÖFF-nen" },
        { wort: "die Möbel", syl: "MÖ-bel" }, { wort: "können", syl: "KÖN-nen" },
        { wort: "der Löffel", syl: "LÖF-fel" }, { wort: "böse", syl: "BÖ-se" },
      ],
      probe: "Hörprobe: „schön“ und „schon“ sind zwei verschiedene Wörter.",
    },
    {
      id: "ae", titel: "Ä ist ein offenes E",
      worum: "Kein neuer Laut, sondern ein e mit weiter geöffnetem Mund. Viele sprechen es wie ein normales e — das fällt kaum auf, ist aber nicht dasselbe.",
      schritte: [
        "Sag ein „e“ wie in „gehen“.",
        "Mach den Mund einen Finger breit weiter auf, ohne den Ton zu ändern.",
        "Das ist das ä.",
      ],
      beispiele: [
        { wort: "der Bär", syl: "BÄR" }, { wort: "spät", syl: "SPÄT" },
        { wort: "der Käse", syl: "KÄ-se" }, { wort: "das Mädchen", syl: "MÄD-chen" },
        { wort: "die Äpfel", syl: "ÄP-fel" }, { wort: "die Männer", syl: "MÄN-ner" },
        { wort: "hätte", syl: "HÄT-te" }, { wort: "wählen", syl: "WÄH-len" },
      ],
      probe: "Wichtig fürs Verstehen: „die Bären“ und „die Beeren“ hört man im Alltag auseinander.",
    },
    {
      id: "ng", titel: "NG — die Zunge macht hinten zu", svg: SVG_NG, svg2: SVG_K,
      worum: "Der häufigste Fehler im Deutschen: „singen“ wird zu „sin-gen“ mit hörbarem g. Es ist aber EIN Laut, und danach kommt nichts mehr.",
      schritte: [
        "Sag ein langes „aaaa“.",
        "Hebe hinten den Zungenrücken, bis er das weiche Gaumensegel berührt. Der Mund ist jetzt versperrt.",
        "Das Gaumensegel hängt dabei unten — dadurch ist der Weg zur Nase offen.",
        "Die Luft findet nur noch einen Weg: durch die Nase. Der Ton läuft weiter: nnnnng…",
        "Und jetzt das Wichtigste: Lass den Verschluss NICHT los. Es folgt kein g und kein k.",
      ],
      beispiele: [
        { wort: "singen", syl: "SIN-gen" }, { wort: "lang", syl: "LANG" },
        { wort: "die Zeitung", syl: "ZEI-tung" }, { wort: "die Wohnung", syl: "WOH-nung" },
        { wort: "jung", syl: "JUNG" }, { wort: "der Junge", syl: "JUN-ge" },
        { wort: "die Prüfung", syl: "PRÜ-fung" }, { wort: "England", syl: "ENG-land" },
      ],
      probe: "Gegenprobe mit dem zweiten Bild: „die Bank“ und „danke“ haben ein k — dort löst sich der Verschluss hörbar. Halte „lang…“ und „Bank“ nebeneinander, dann hörst du den Unterschied sofort.",
    },
    {
      id: "ch", titel: "CH — zwei Laute, eine Schreibung", svg: SVG_ICH, svg2: SVG_ACH,
      worum: "Dasselbe Zeichen steht für zwei verschiedene Laute. Welcher gilt, entscheidet der Vokal davor.",
      schritte: [
        "Nach hellen Lauten (e, i, ä, ö, ü, ei, eu) und nach l, n, r gilt der ich-Laut: Flüstere einfach ein „j“.",
        "Nach dunklen Lauten (a, o, u, au) gilt der ach-Laut: wie ein sehr sanftes Gurgeln, aber ohne Stimme.",
        "Die Endung -chen hat IMMER den ich-Laut, egal was davor steht.",
        "Wichtig: Beides ist kein sch und kein k.",
      ],
      beispiele: [
        { wort: "ich", syl: "ICH", hinweis: "ich-Laut" },
        { wort: "nicht", syl: "NICHT", hinweis: "ich-Laut" },
        { wort: "die Milch", syl: "MILCH", hinweis: "ich-Laut (nach l)" },
        { wort: "durch", syl: "DURCH", hinweis: "ich-Laut (nach r)" },
        { wort: "der Bach", syl: "BACH", hinweis: "ach-Laut" },
        { wort: "das Buch", syl: "BUCH", hinweis: "ach-Laut" },
        { wort: "doch", syl: "DOCH", hinweis: "ach-Laut" },
        { wort: "auch", syl: "AUCH", hinweis: "ach-Laut" },
      ],
      probe: "Das schönste Paar: „der Kuchen“ (ach-Laut) und „das Kühchen“ (ich-Laut). Gleiche Buchstaben, zwei Laute.",
    },
    {
      id: "r", titel: "Das R sitzt hinten, nicht vorne",
      worum: "Wer Italienisch, Spanisch, Russisch, Türkisch oder Arabisch spricht, rollt das r mit der Zungenspitze. Im Deutschen entsteht es ganz hinten.",
      schritte: [
        "Gurgle ohne Wasser und mach daraus einen Ton — das ist schon fast das deutsche r.",
        "Die Zungenspitze bleibt dabei unten liegen und rührt sich nicht.",
        "Und der zweite Teil: Steht das r nach einem Vokal am Silbenende, wird daraus fast ein a.",
      ],
      beispiele: [
        { wort: "rot", syl: "ROT", hinweis: "am Anfang: hinten gurgeln" },
        { wort: "der Regen", syl: "RE-gen" },
        { wort: "das Brot", syl: "BROT" },
        { wort: "der Vater", syl: "VA-ter", hinweis: "klingt wie „Vata“" },
        { wort: "die Uhr", syl: "UHR", hinweis: "klingt fast wie „Ua“" },
        { wort: "wir", syl: "WIR", hinweis: "klingt wie „wia“" },
        { wort: "mehr", syl: "MEHR", hinweis: "klingt wie „mea“" },
      ],
      probe: "Ein gerolltes r ist kein Fehler, den niemand versteht — es klingt nur nach Süddeutschland oder Ausland. Wichtiger ist das a am Ende: Wer „Vater“ mit deutlichem r spricht, klingt sofort fremd.",
    },
    {
      id: "knack", titel: "Der Knacklaut vor jedem Vokal",
      worum: "Der Grund, warum Deutsch so „abgehackt“ klingt — und warum Deutsche einen fließenden Satz manchmal nicht verstehen.",
      schritte: [
        "Sag „oh-oh!“. Der kleine Stopp in der Mitte ist der Knacklaut.",
        "Genau dieser Stopp steht vor jedem Wort, das mit einem Vokal beginnt.",
        "Er steht auch im Wort, wenn eine Vorsilbe vor einem Vokal sitzt: be|obachten, ver|einbaren.",
      ],
      beispiele: [
        { wort: "am Abend", syl: "am A-bend", hinweis: "nicht „amabend“" },
        { wort: "das Auto", syl: "das AU-to" },
        { wort: "ein Ei", syl: "ein EI" },
        { wort: "die Antwort", syl: "ANT-wort" },
        { wort: "beobachten", syl: "be-OB-ach-ten" },
        { wort: "verabreden", syl: "ver-AB-re-den" },
      ],
      probe: "Probe: „ein Eis“ und „einheiß“ — nur der Knacklaut hält die Wörter auseinander.",
    },
    {
      id: "hauch", titel: "P, T, K haben einen Hauch",
      worum: "Im Italienischen, Spanischen, Französischen und Arabischen kommen p, t, k ohne Luftstoß. Im Deutschen mit — und daran erkennt das Ohr, dass es nicht b, d, g war.",
      schritte: [
        "Halte ein Blatt Papier locker vor den Mund.",
        "Sag „Papier“, „Tisch“, „Kind“ — das Blatt muss sich sichtbar bewegen.",
        "Sag „Bier“, „Tisch“ mit d („disch“), „Kind“ mit g — jetzt darf es sich nicht bewegen.",
      ],
      beispiele: [
        { wort: "das Papier", syl: "Pa-PIER" }, { wort: "der Tisch", syl: "TISCH" },
        { wort: "das Kind", syl: "KIND" }, { wort: "die Karte", syl: "KAR-te" },
        { wort: "der Park", syl: "PARK" }, { wort: "die Tasche", syl: "TA-sche" },
      ],
      probe: "Paare zum Üben: Paar – Bar, Tanne – danne, Kasse – Gasse.",
    },
    {
      id: "s", titel: "S — summend oder scharf",
      worum: "Ein Zeichen, zwei Laute. Die Stelle im Wort entscheidet.",
      schritte: [
        "Vor einem Vokal summt das s wie eine Biene (Stimme an): die Sonne, lesen.",
        "Am Wortende und vor Konsonanten ist es scharf (Stimme aus): das Haus, ist.",
        "ss und ß sind immer scharf: essen, die Straße.",
        "Am Wortanfang vor p und t wird daraus sch: der Sport, die Stadt.",
      ],
      beispiele: [
        { wort: "die Sonne", syl: "SON-ne", hinweis: "summend" },
        { wort: "lesen", syl: "LE-sen", hinweis: "summend" },
        { wort: "die Reise", syl: "REI-se", hinweis: "summend" },
        { wort: "das Haus", syl: "HAUS", hinweis: "scharf" },
        { wort: "ist", syl: "IST", hinweis: "scharf" },
        { wort: "essen", syl: "ES-sen", hinweis: "scharf" },
      ],
      probe: "„Die weiße Rose“ — das erste s scharf (ß), das zweite summend.",
    },
    {
      id: "buendel", titel: "Konsonanten am Stück — ohne Zwischenvokal", svg: SVG_BUENDEL,
      worum: "GEWÜNSCHT und wichtig: Im Arabischen, Türkischen, Persischen und Spanischen baut die Zunge instinktiv einen kleinen Vokal zwischen zwei Konsonanten ein — „Se-tra-ße“ statt „Straße“. Im Deutschen gibt es diesen Vokal nicht. Was geschrieben steht, wird auch gesprochen — aber nur das.",
      schritte: [
        "Fang beim letzten Konsonanten des Bündels an: „raße“.",
        "Setz den nächsten davor, ohne Pause: „traße“.",
        "Und den nächsten: „schtraße“. Fertig — „Straße“.",
        "Rückwärts bauen funktioniert, weil die Zunge dann keine Gelegenheit bekommt, einen Vokal einzuschieben.",
        "Spanisch sprechende Menschen setzen oft ein e davor: „Es-traße“. Auch das gibt es im Deutschen nicht.",
      ],
      beispiele: [
        { wort: "die Straße", syl: "STRA-ße" }, { wort: "sprechen", syl: "SPRE-chen" },
        { wort: "das Knie", syl: "KNIE" }, { wort: "die Pflanze", syl: "PFLAN-ze" },
        { wort: "der Herbst", syl: "HERBST" }, { wort: "die Angst", syl: "ANGST" },
        { wort: "zwei", syl: "ZWEI" }, { wort: "der Strumpf", syl: "STRUMPF" },
      ],
      probe: "Die volle Probe: „Im Herbst kämpft der Arzt gegen die Angst.“ Fünf Bündel in einem Satz.",
    },
    {
      id: "murmel", titel: "Das Murmel-e am Ende",
      worum: "Deutsch hat sehr viele unbetonte Endungen. Wer sie klar ausspricht, klingt auswendig gelernt.",
      schritte: [
        "Die Endungen -e, -en, -el, -em, -en bekommen kein klares e, sondern nur ein kurzes Murmeln.",
        "Die Endung -er klingt am Wortende fast wie ein a.",
        "Die Vorsilben be- und ge- ebenso: „besuchen“, „gefallen“.",
      ],
      beispiele: [
        { wort: "die Blume", syl: "BLU-me" }, { wort: "bitte", syl: "BIT-te" },
        { wort: "gehen", syl: "GE-hen" }, { wort: "der Löffel", syl: "LÖF-fel" },
        { wort: "die Mutter", syl: "MUT-ter", hinweis: "→ „Mutta“" },
        { wort: "wieder", syl: "WIE-der", hinweis: "→ „wieda“" },
      ],
      probe: "Hör auf den Unterschied zwischen „die Blume“ (Murmel-e) und „die Idee“ (klares, betontes e).",
    },
  ];

  /* =========================================================
     ITALIENISCH — ALPHABET
     GEWÜNSCHT: „Das soll im Italienischen auch noch mal das
     Alphabet sein, das einzeln funktioniert wie im Deutschen."
     ========================================================= */
  const ALPHABET_IT = [
    { b: "A a", name: "a", ipa: "a", laut: "Immer offen und klar, nie gemurmelt.", bsp: "l'acqua", syl: "AC-qua", hinweis: "Auch am Wortende voll ausgesprochen." },
    { b: "B b", name: "bi", ipa: "bi", laut: "Wie im Deutschen, aber am Wortende nie hart.", bsp: "la barca", syl: "BAR-ca", hinweis: "" },
    { b: "C c", name: "ci", ipa: "tʃi", laut: "Vor a, o, u wie k — vor e und i wie tsch.", bsp: "la casa / la cena", syl: "CA-sa", hinweis: "Der wichtigste Unterschied zum Deutschen." },
    { b: "D d", name: "di", ipa: "di", laut: "Zungenspitze an den Zähnen, weicher als im Deutschen.", bsp: "due", syl: "DU-e", hinweis: "" },
    { b: "E e", name: "e", ipa: "e", laut: "Offen oder geschlossen — nie gemurmelt.", bsp: "bene", syl: "BE-ne", hinweis: "Das e am Wortende wird immer gesprochen." },
    { b: "F f", name: "effe", ipa: "ˈɛffe", laut: "Wie f.", bsp: "la festa", syl: "FE-sta", hinweis: "" },
    { b: "G g", name: "gi", ipa: "dʒi", laut: "Vor a, o, u hart — vor e und i wie dsch.", bsp: "il gatto / il gelato", syl: "GAT-to", hinweis: "Dieselbe Logik wie beim c." },
    { b: "H h", name: "acca", ipa: "ˈakka", laut: "Wird NIE gesprochen.", bsp: "ho", syl: "HO", hinweis: "Es macht nur c und g hart: „che“, „ghi“." },
    { b: "I i", name: "i", ipa: "i", laut: "Wie i.", bsp: "il vino", syl: "VI-no", hinweis: "Vor einem anderen Vokal wird es zum kurzen j: „ieri“." },
    { b: "L l", name: "elle", ipa: "ˈɛlle", laut: "Hell, wie im Deutschen.", bsp: "la luna", syl: "LU-na", hinweis: "" },
    { b: "M m", name: "emme", ipa: "ˈɛmme", laut: "Wie m.", bsp: "la mano", syl: "MA-no", hinweis: "" },
    { b: "N n", name: "enne", ipa: "ˈɛnne", laut: "Wie n.", bsp: "il naso", syl: "NA-so", hinweis: "" },
    { b: "O o", name: "o", ipa: "o", laut: "Offen oder geschlossen, immer klar.", bsp: "il sole", syl: "SO-le", hinweis: "" },
    { b: "P p", name: "pi", ipa: "pi", laut: "OHNE Hauch.", bsp: "il pane", syl: "PA-ne", hinweis: "Genau hier hört man deutsche Sprecher sofort heraus." },
    { b: "Q q", name: "cu", ipa: "ku", laut: "Immer als „qu“ = kw.", bsp: "questo", syl: "QUE-sto", hinweis: "" },
    { b: "R r", name: "erre", ipa: "ˈɛrre", laut: "Mit der Zungenspitze gerollt.", bsp: "il ragazzo", syl: "ra-GAZ-zo", hinweis: "Ganz anders als das deutsche Rachen-r." },
    { b: "S s", name: "esse", ipa: "ˈɛsse", laut: "Zwischen zwei Vokalen summend, sonst scharf.", bsp: "il sole / la rosa", syl: "SO-le", hinweis: "" },
    { b: "T t", name: "ti", ipa: "ti", laut: "OHNE Hauch, Zunge an den Zähnen.", bsp: "il tavolo", syl: "TA-vo-lo", hinweis: "" },
    { b: "U u", name: "u", ipa: "u", laut: "Immer u — es gibt kein ü.", bsp: "la luna", syl: "LU-na", hinweis: "" },
    { b: "V v", name: "vu / vi", ipa: "vu", laut: "Wie das deutsche w.", bsp: "la vita", syl: "VI-ta", hinweis: "" },
    { b: "Z z", name: "zeta", ipa: "ˈdzɛta", laut: "ts oder ds.", bsp: "la pizza / lo zaino", syl: "PIZ-za", hinweis: "" },
    { b: "J j", name: "i lunga", ipa: "i ˈlunga", laut: "Nur in Fremdwörtern.", bsp: "i jeans", syl: "JEANS", hinweis: "Gehört nicht zum eigentlichen Alphabet." },
    { b: "K k", name: "cappa", ipa: "ˈkappa", laut: "Nur in Fremdwörtern.", bsp: "il karate", syl: "ka-RA-te", hinweis: "Gehört nicht zum eigentlichen Alphabet." },
    { b: "W w", name: "doppia vu", ipa: "ˈdoppja vu", laut: "Nur in Fremdwörtern.", bsp: "il weekend", syl: "WEEK-end", hinweis: "Gehört nicht zum eigentlichen Alphabet." },
    { b: "X x", name: "ics", ipa: "iks", laut: "Nur in Fremdwörtern.", bsp: "lo xilofono", syl: "xi-LO-fo-no", hinweis: "Gehört nicht zum eigentlichen Alphabet." },
    { b: "Y y", name: "ipsilon / i greca", ipa: "ˈipsilon", laut: "Nur in Fremdwörtern.", bsp: "lo yogurt", syl: "YO-gurt", hinweis: "Gehört nicht zum eigentlichen Alphabet." },
  ];

  const VERBINDUNGEN_IT = [
    { schrift: "ca / co / cu", gesprochen: "k", wann: "vor a, o, u", bsp: ["la casa", "il conto", "il cuore"], hinweis: "" },
    { schrift: "ce / ci", gesprochen: "tsch", wann: "vor e, i", bsp: ["la cena", "il cinema", "la voce"], hinweis: "" },
    { schrift: "che / chi", gesprochen: "k", wann: "das h macht hart", bsp: ["che", "chi", "la chiesa", "i tedeschi"], hinweis: "Das h hört man nie — es ist nur ein Hart-Zeichen." },
    { schrift: "ga / go / gu", gesprochen: "hartes g", wann: "vor a, o, u", bsp: ["il gatto", "la gola", "il gusto"], hinweis: "" },
    { schrift: "ge / gi", gesprochen: "dsch", wann: "vor e, i", bsp: ["il gelato", "il giro", "la gente"], hinweis: "" },
    { schrift: "ghe / ghi", gesprochen: "hartes g", wann: "das h macht hart", bsp: ["gli spaghetti", "il ghiaccio", "i laghi"], hinweis: "" },
    { schrift: "gn", gesprochen: "nj — EIN Laut", wann: "immer", bsp: ["gli gnocchi", "il bagno", "il signore", "la Spagna"], hinweis: "Nicht g + n. Zungenrücken flach an den Gaumen." },
    { schrift: "gli", gesprochen: "lj — EIN Laut", wann: "vor i", bsp: ["la famiglia", "il figlio", "l'aglio", "meglio"], hinweis: "Ausnahme: „negligente“ wird getrennt gesprochen." },
    { schrift: "sce / sci", gesprochen: "sch", wann: "vor e, i", bsp: ["il pesce", "sciare", "la scienza"], hinweis: "" },
    { schrift: "sca / sco / scu", gesprochen: "sk", wann: "vor a, o, u", bsp: ["la scuola", "la scarpa", "lo sconto"], hinweis: "" },
    { schrift: "qu", gesprochen: "kw", wann: "immer", bsp: ["questo", "quando", "quattro"], hinweis: "" },
    { schrift: "z / zz", gesprochen: "ts oder ds", wann: "immer", bsp: ["la pizza", "la stazione", "lo zaino"], hinweis: "" },
    { schrift: "Doppelkonsonanten", gesprochen: "wirklich länger gehalten", wann: "immer", bsp: ["il nonno", "la palla", "il carro", "fatto"], hinweis: "Anders als im Deutschen — und bedeutungsunterscheidend." },
    { schrift: "h", gesprochen: "stumm", wann: "immer", bsp: ["ho", "hai", "ha", "hanno"], hinweis: "Unterscheidet nur in der Schrift: „ho“ (ich habe) und „o“ (oder)." },
  ];

  const REGELN_IT = [
    {
      id: "cg", titel: "c und g: hart oder weich — der nächste Buchstabe entscheidet",
      text: "Die wichtigste Leseregel des Italienischen. Vor a, o, u sind c und g hart. Vor e und i werden sie weich. Ein h dazwischen macht sie wieder hart.",
      beispiele: [
        { wort: "la casa", syl: "CA-sa", hinweis: "k" }, { wort: "la cena", syl: "CE-na", hinweis: "tsch" },
        { wort: "chi", syl: "CHI", hinweis: "k" }, { wort: "il gatto", syl: "GAT-to", hinweis: "hartes g" },
        { wort: "il gelato", syl: "ge-LA-to", hinweis: "dsch" }, { wort: "gli spaghetti", syl: "spa-GHET-ti", hinweis: "hartes g" },
      ],
      ausnahmen: { text: "Merksatz: c-h und g-h sind keine eigenen Laute, sondern Bremsen — sie verhindern das Weichwerden.", woerter: [] },
    },
    {
      id: "hstumm", titel: "Das h ist immer stumm",
      text: "Es gibt im Italienischen keinen h-Laut. Weder am Anfang noch sonst irgendwo.",
      beispiele: [
        { wort: "ho", syl: "HO", hinweis: "„o“" }, { wort: "hai", syl: "HAI", hinweis: "„ai“" },
        { wort: "hanno", syl: "HAN-no", hinweis: "„anno“" }, { wort: "l'hotel", syl: "ho-TEL", hinweis: "„otel“" },
      ],
      ausnahmen: { text: "Deshalb klingen „hanno“ (sie haben) und „anno“ (Jahr) gleich — der Unterschied steht nur auf dem Papier.", woerter: [] },
    },
    {
      id: "doppel", titel: "Doppelkonsonanten werden wirklich länger gehalten",
      text: "Im Deutschen zeigt der doppelte Konsonant nur, dass der Vokal kurz ist. Im Italienischen hält man ihn tatsächlich länger — und das unterscheidet Wörter.",
      beispiele: [
        { wort: "il nonno / il nono", syl: "NON-no", hinweis: "Großvater / neunter" },
        { wort: "la palla / la pala", syl: "PAL-la", hinweis: "Ball / Schaufel" },
        { wort: "il carro / caro", syl: "CAR-ro", hinweis: "Wagen / teuer" },
        { wort: "sette / sete", syl: "SET-te", hinweis: "sieben / Durst" },
        { wort: "la cassa / la casa", syl: "CAS-sa", hinweis: "Kasse / Haus" },
      ],
      ausnahmen: { text: "Trick: Mach eine winzige Pause VOR dem Doppelkonsonanten, dann hält er von selbst länger: „non-no“.", woerter: [] },
    },
    {
      id: "vokalklar", titel: "Jeder Vokal wird klar gesprochen — auch am Ende",
      text: "Es gibt keinen Murmellaut. Kein Vokal wird verschluckt, kein Endvokal fällt weg.",
      beispiele: [
        { wort: "grazie", syl: "GRA-zi-e", hinweis: "drei Silben" },
        { wort: "buonasera", syl: "buo-na-SE-ra" },
        { wort: "la notte", syl: "NOT-te" },
        { wort: "arrivederci", syl: "ar-ri-ve-DER-ci" },
      ],
      ausnahmen: { text: "Genau umgekehrt zum Deutschen: Dort ist das Endungs-e nur ein Murmeln, hier ist es ein voller Vokal.", woerter: [] },
    },
    {
      id: "betonung", titel: "Die Betonung liegt meist auf der vorletzten Silbe",
      text: "Das ist der Normalfall. Steht ein Akzent auf dem letzten Vokal, wird das Wort hinten betont.",
      beispiele: [
        { wort: "l'amico", syl: "a-MI-co" }, { wort: "la giornata", syl: "gior-NA-ta" },
        { wort: "il ragazzo", syl: "ra-GAZ-zo" }, { wort: "la città", syl: "cit-TÀ", hinweis: "Akzent = Endbetonung" },
        { wort: "il caffè", syl: "caf-FÈ", hinweis: "Akzent = Endbetonung" },
        { wort: "perché", syl: "per-CHÉ" }, { wort: "lunedì", syl: "lu-ne-DÌ" },
      ],
      ausnahmen: { text: "Eine kleine Gruppe betont die drittletzte Silbe: „il TA-vo-lo“, „la MU-si-ca“, „TE-le-fo-no“, „SU-bi-to“. Das steht nicht in der Schreibung — das lernt man mit dem Wort.", woerter: [] },
    },
    {
      id: "keinhauch", titel: "p, t, k ohne Hauch",
      text: "Im Deutschen kommt nach p, t, k ein Luftstoß. Im Italienischen nicht. Wer ihn mitbringt, klingt sofort deutsch.",
      beispiele: [
        { wort: "il pane", syl: "PA-ne" }, { wort: "il tavolo", syl: "TA-vo-lo" },
        { wort: "il cane", syl: "CA-ne" }, { wort: "la carta", syl: "CAR-ta" },
      ],
      ausnahmen: { text: "Probe mit dem Blatt Papier vor dem Mund: Bei „pane“ darf es sich nicht bewegen.", woerter: [] },
    },
    {
      id: "keinue", titel: "Es gibt kein ü und kein ö",
      text: "u bleibt u, o bleibt o. „gu“ ist gw, „qu“ ist kw.",
      beispiele: [
        { wort: "la luna", syl: "LU-na" }, { wort: "la musica", syl: "MU-si-ca" },
        { wort: "la lingua", syl: "LIN-gua", hinweis: "„lingwa“" },
        { wort: "la guerra", syl: "GUER-ra", hinweis: "„gwerra“" },
      ],
      ausnahmen: { text: "Umgekehrt zum Deutschen: Dort sind ü und ö bedeutungsunterscheidend, hier gibt es sie gar nicht.", woerter: [] },
    },
    {
      id: "svor", titel: "s vor Konsonant zieht den Artikel „lo“ nach sich",
      text: "Eine Aussprache-Regel mit Grammatikfolge: Vor s + Konsonant (und vor z, gn, ps, x) heißt der Artikel „lo“ statt „il“ — weil „il studente“ nicht auszusprechen wäre.",
      beispiele: [
        { wort: "lo studente", syl: "stu-DEN-te" }, { wort: "lo sport", syl: "SPORT" },
        { wort: "lo zaino", syl: "ZAI-no" }, { wort: "lo gnocco", syl: "GNOC-co" },
        { wort: "lo psicologo", syl: "psi-CO-lo-go" },
      ],
      ausnahmen: { text: "In der Mehrzahl wird daraus „gli“: gli studenti, gli sport, gli zaini.", woerter: [] },
    },
  ];

  const BUENDEL_IT = [
    { schrift: "str-", gesprochen: "str (mit scharfem s, kein sch!)", bsp: "la strada", syl: "STRA-da", falsch: "schtrada / se-trada", weitere: ["stretto", "lo strumento"] },
    { schrift: "st- / sp-", gesprochen: "st und sp (kein sch)", bsp: "lo studente", syl: "stu-DEN-te", falsch: "schtudente", weitere: ["lo sport", "spesso", "la stanza"] },
    { schrift: "sc + e/i", gesprochen: "sch", bsp: "il pesce", syl: "PE-sce", falsch: "pes-ke", weitere: ["sciare", "la scienza", "uscire"] },
    { schrift: "gn", gesprochen: "nj", bsp: "gli gnocchi", syl: "GNOC-chi", falsch: "ge-nocchi", weitere: ["il bagno", "ogni", "il sogno"] },
    { schrift: "gli", gesprochen: "lj", bsp: "la famiglia", syl: "fa-MI-glia", falsch: "fa-mi-glia mit hartem g", weitere: ["il figlio", "l'aglio", "voglio"] },
    { schrift: "ps- / pn-", gesprochen: "am Stück", bsp: "lo psicologo", syl: "psi-CO-lo-go", falsch: "pe-sicologo", weitere: ["lo pneumatico"] },
    { schrift: "zz", gesprochen: "langes ts", bsp: "la pizza", syl: "PIZ-za", falsch: "pi-sa", weitere: ["il ragazzo", "la piazza", "il pezzo"] },
  ];

  const ZUNGENBRECHER_IT = [
    { satz: "Trentatré trentini entrarono a Trento tutti e trentatré trotterellando.", uebt: "das gerollte r und tr" },
    { satz: "Sopra la panca la capra campa, sotto la panca la capra crepa.", uebt: "harte c und p ohne Hauch" },
    { satz: "Gli gnocchi della famiglia sono buoni.", uebt: "gn und gli" },
    { satz: "Il nonno di Nino ha nove anni.", uebt: "Doppelkonsonanten" },
    { satz: "Chi cerca il cinema in centro?", uebt: "hartes ch gegen weiches c" },
  ];

  const TRICKS_IT = [
    {
      id: "rr", titel: "Das gerollte R",
      worum: "Der auffälligste Unterschied zum Deutschen. Es entsteht vorne, nicht hinten.",
      schritte: [
        "Leg die Zungenspitze locker an den Zahndamm hinter den oberen Zähnen.",
        "Lass sie ganz locker — sie darf nicht drücken.",
        "Schick Luft darüber. Die Zungenspitze flattert von selbst.",
        "Trick zum Anfangen: Sag schnell „dede-dede-dede“ und lass die Zunge dabei immer lockerer werden.",
      ],
      beispiele: [
        { wort: "Roma", syl: "RO-ma" }, { wort: "il ragazzo", syl: "ra-GAZ-zo" },
        { wort: "la terra", syl: "TER-ra", hinweis: "doppeltes r = länger rollen" },
        { wort: "arrivederci", syl: "ar-ri-ve-DER-ci" },
      ],
      probe: "„caro“ (teuer) und „carro“ (Wagen): einmal kurz antippen, einmal richtig rollen.",
    },
    {
      id: "gn", titel: "GN — ein Laut, nicht zwei", svg: SVG_NG,
      worum: "Ähnlich wie das deutsche ng, aber weiter vorne: Der Zungenrücken legt sich flach an den harten Gaumen, die Luft geht durch die Nase.",
      schritte: [
        "Sag ein „nj“ wie in „Kognak“ — aber nicht als zwei Laute nacheinander.",
        "Die Zunge liegt dabei breit am Gaumen an, nicht nur mit der Spitze.",
        "Der Ton läuft durch die Nase weiter.",
      ],
      beispiele: [
        { wort: "gli gnocchi", syl: "GNOC-chi" }, { wort: "il bagno", syl: "BA-gno" },
        { wort: "il signore", syl: "si-GNO-re" }, { wort: "la Spagna", syl: "SPA-gna" },
        { wort: "ogni", syl: "O-gni" },
      ],
      probe: "Kein g zu hören! „bagno“ ist nicht „bag-no“.",
    },
    {
      id: "gli", titel: "GLI — die Zunge liegt breit am Gaumen",
      worum: "Es gibt diesen Laut im Deutschen nicht. Er liegt zwischen „lj“ und einem sehr weichen l.",
      schritte: [
        "Sag ein „l“ und schieb die Zunge dabei flach nach hinten an den Gaumen.",
        "Die Zungenspitze verlässt die Zähne — sie liegt jetzt unten.",
        "Die Luft fließt seitlich vorbei.",
      ],
      beispiele: [
        { wort: "la famiglia", syl: "fa-MI-glia" }, { wort: "il figlio", syl: "FI-glio" },
        { wort: "l'aglio", syl: "A-glio" }, { wort: "meglio", syl: "ME-glio" },
        { wort: "voglio", syl: "VO-glio" },
      ],
      probe: "Nicht „fa-mi-gli-a“ mit hartem g — das g gehört zum Laut, nicht zur Silbe davor.",
    },
    {
      id: "doppelhalten", titel: "Doppelkonsonanten wirklich halten",
      worum: "Für deutsche Ohren ungewohnt: Der Konsonant dauert doppelt so lange, und das ändert das Wort.",
      schritte: [
        "Sprich das Wort in zwei Teilen, mit einer winzigen Pause vor dem Doppelkonsonanten: „non-no“, „fat-to“, „pal-la“.",
        "Dann die Pause immer kleiner machen, aber die Länge des Konsonanten behalten.",
      ],
      beispiele: [
        { wort: "il nonno", syl: "NON-no" }, { wort: "fatto", syl: "FAT-to" },
        { wort: "la palla", syl: "PAL-la" }, { wort: "la pizza", syl: "PIZ-za" },
        { wort: "bello", syl: "BEL-lo" },
      ],
      probe: "Paare: nonno/nono, palla/pala, carro/caro, sette/sete, cassa/casa.",
    },
    {
      id: "keinhauch2", titel: "Kein Hauch bei p, t, k",
      worum: "Wer Deutsch spricht, pustet automatisch. Italienisch nicht.",
      schritte: [
        "Blatt Papier locker vor den Mund halten.",
        "„il pane“, „il tavolo“, „il cane“ sagen — das Blatt darf sich nicht bewegen.",
        "Wenn es sich bewegt: Den Laut weicher ansetzen, fast wie b, d, g.",
      ],
      beispiele: [
        { wort: "il pane", syl: "PA-ne" }, { wort: "il tavolo", syl: "TA-vo-lo" },
        { wort: "il cane", syl: "CA-ne" }, { wort: "la porta", syl: "POR-ta" },
      ],
      probe: "Dasselbe Blatt, zwei Sprachen: Bei „Papier“ bewegt es sich, bei „pane“ nicht.",
    },
    {
      id: "keinmurmel", titel: "Keinen Vokal verschlucken",
      worum: "Der häufigste Fehler deutscher Sprecher: Das Endungs-e wird zum Murmeln.",
      schritte: [
        "Jeder geschriebene Vokal wird gesprochen, gleich lang und gleich klar.",
        "„grazie“ hat drei Silben: gra-zi-e. Nicht „gratsje“.",
        "Auch unbetonte Vokale behalten ihre Farbe: „telefono“ ist te-LE-fo-no, nicht „telefonu“.",
      ],
      beispiele: [
        { wort: "grazie", syl: "GRA-zi-e" }, { wort: "il telefono", syl: "te-LE-fo-no" },
        { wort: "la notte", syl: "NOT-te" }, { wort: "buonasera", syl: "buo-na-SE-ra" },
      ],
      probe: "Zähle die Vokale im geschriebenen Wort und dann beim Sprechen — es müssen gleich viele sein.",
    },
  ];

  /* =========================================================
     DER TEST
     Fragen, die aus den Regeln oben folgen — nichts anderes.
     Format: {frage, richtig, falsch:[...], erkl, teil}
     ========================================================= */
  const TEST_DE = [
    { teil: "Alphabet", frage: "Wie heißt der Buchstabe „W“ auf Deutsch?", richtig: "we", falsch: ["doppel-u", "vau", "wi"], erkl: "„W“ heißt „we“ und klingt wie das englische v: „das Wasser“." },
    { teil: "Alphabet", frage: "Wie heißt der Buchstabe „Z“ auf Deutsch?", richtig: "zett", falsch: ["zi", "zeta", "tse-tse"], erkl: "„Z“ heißt „zett“ und klingt immer wie ts: „die Zeit“ = „Tseit“." },
    { teil: "Alphabet", frage: "Wie heißt „ß“?", richtig: "Eszett oder scharfes s", falsch: ["Beta", "Doppel-b", "langes f"], erkl: "Das ß heißt Eszett. Es steht nur nach langem Vokal oder Doppellaut: „die Straße“." },
    { teil: "Alphabet", frage: "Wie klingt „v“ in „der Vater“?", richtig: "wie f", falsch: ["wie w", "wie b", "wie p"], erkl: "In deutschen Wörtern klingt v wie f. Nur in Fremdwörtern wie w: „die Vase“." },
    { teil: "Alphabet", frage: "Wie klingt „qu“ in „die Quelle“?", richtig: "kw", falsch: ["k", "kju", "gw"], erkl: "„qu“ ist immer kw: „Quelle“ spricht man „Kwelle“." },
    { teil: "Alphabet", frage: "Wie klingt „j“ in „ja“?", richtig: "wie das j in „ja“ — ein Gleitlaut", falsch: ["wie das englische j in „job“", "wie ch", "wie g"], erkl: "Das deutsche j ist ein Gleitlaut, kein dsch." },

    { teil: "Vokallänge", frage: "Ist der Vokal in „der Weg“ lang oder kurz?", richtig: "lang", falsch: ["kurz", "beides möglich", "das hört man nicht"], erkl: "Ein einziger Konsonant nach dem Vokal → der Vokal ist lang: „Weeeg“." },
    { teil: "Vokallänge", frage: "Ist der Vokal in „das Bett“ lang oder kurz?", richtig: "kurz", falsch: ["lang", "beides möglich", "das hört man nicht"], erkl: "Zwei Konsonanten nach dem Vokal → der Vokal ist kurz." },
    { teil: "Vokallänge", frage: "Warum ist das a in „fahren“ lang?", richtig: "Wegen des Dehnungs-h — es wird nicht gesprochen", falsch: ["Weil ein h gesprochen wird", "Weil r folgt", "Weil das Wort zwei Silben hat"], erkl: "Das Dehnungs-h ist stumm. Es ist nur ein Längenzeichen: „faaren“." },
    { teil: "Vokallänge", frage: "Wie lang ist das i in „die Liebe“?", richtig: "lang — „ie“ ist immer ein langes i", falsch: ["kurz", "man spricht i und e getrennt", "wie ein ü"], erkl: "Das e hinter dem i wird nicht gesprochen, es macht das i nur lang." },
    { teil: "Vokallänge", frage: "Was verrät „ß“ über den Vokal davor?", richtig: "Er ist lang", falsch: ["Er ist kurz", "Nichts", "Er ist betont"], erkl: "ß steht nach langem Vokal („die Straße“), ss nach kurzem („der Fluss“)." },
    { teil: "Vokallänge", frage: "Was verrät ein Doppelkonsonant wie in „die Sonne“?", richtig: "Der Vokal davor ist kurz", falsch: ["Der Vokal davor ist lang", "Der Konsonant wird länger gehalten", "Das Wort ist ein Fremdwort"], erkl: "Der doppelte Konsonant zeigt die Kürze an. Gesprochen wird er nur einmal — anders als im Italienischen." },
    { teil: "Vokallänge", frage: "Welches Wort ist eine Ausnahme: kurz, obwohl nur ein Konsonant folgt?", richtig: "das", falsch: ["der Tag", "gut", "lesen"], erkl: "„das“, „was“, „man“, „hat“, „ab“, „in“, „mit“ und ein paar weitere kleine Wörter sind kurz — trotz nur einem Konsonanten." },
    { teil: "Vokallänge", frage: "Welches Wort ist eine Ausnahme: lang, obwohl mehrere Konsonanten folgen?", richtig: "der Mond", falsch: ["der Kopf", "kalt", "die Wurst"], erkl: "Mond, Obst, Papst, Magd, Jagd, Trost, Erde, Pferd, Arzt und Art sind lang — trotz Konsonantenhäufung." },

    { teil: "Bündel", frage: "Wie spricht man „die Straße“?", richtig: "schtra-ße, alles am Stück", falsch: ["se-tra-ße", "es-tra-ße", "s-tra-ße mit scharfem s"], erkl: "st am Wortanfang wird scht. Zwischen sch, t und r kommt kein Vokal." },
    { teil: "Bündel", frage: "Wie spricht man „der Sport“?", richtig: "schport", falsch: ["es-port", "sport mit scharfem s", "se-port"], erkl: "sp am Wortanfang wird schp." },
    { teil: "Bündel", frage: "Was ist an „Se-tra-ße“ falsch?", richtig: "Es wird ein Vokal eingeschoben, den es nicht gibt", falsch: ["Die Betonung liegt falsch", "Das ß ist falsch", "Nichts, das ist Umgangssprache"], erkl: "Deutsch duldet lange Konsonantenketten ohne Zwischenvokal. Tipp: von hinten aufbauen — raße, traße, schtraße." },
    { teil: "Bündel", frage: "Wie viele Konsonanten stehen in „der Herbst“ hinter dem Vokal?", richtig: "vier: r, b, s, t", falsch: ["zwei", "drei", "fünf"], erkl: "„Herbst“ ist das Musterwort für lange Konsonantenketten — und alle vier werden gesprochen." },
    { teil: "Bündel", frage: "Wie spricht man das k in „das Knie“?", richtig: "Es wird mitgesprochen: knie", falsch: ["gar nicht, wie im Englischen", "wie ein g", "wie ke-nie"], erkl: "Anders als im Englischen („knee“) bleibt das k hörbar." },

    { teil: "Laute", frage: "Was ist bei „singen“ wichtig?", richtig: "ng ist ein Laut — danach kommt KEIN g", falsch: ["Das g wird hart gesprochen", "Man sagt sin-gen mit Pause", "Das n fällt weg"], erkl: "Der Zungenrücken schließt hinten ab, die Luft geht durch die Nase, der Verschluss löst sich nicht." },
    { teil: "Laute", frage: "Womit stellt man ein sauberes ü her?", richtig: "Ein i sagen und dabei nur die Lippen runden", falsch: ["Ein u sagen und die Zunge heben", "Ein e sagen und die Lippen breit ziehen", "Ein o sagen und den Mund schließen"], erkl: "Zunge bleibt beim i, Lippen zum Kussmund: iiii → üüüü." },
    { teil: "Laute", frage: "Womit stellt man ein sauberes ö her?", richtig: "Ein e sagen und dabei nur die Lippen runden", falsch: ["Ein o sagen und die Zunge heben", "Ein u sagen und den Mund öffnen", "Ein a sagen und die Lippen spitzen"], erkl: "Derselbe Trick wie beim ü, nur eine Etage tiefer: eeee → öööö." },
    { teil: "Laute", frage: "Welches ch steckt in „die Milch“?", richtig: "der ich-Laut", falsch: ["der ach-Laut", "ein k", "ein sch"], erkl: "Nach l, n, r und nach hellen Vokalen gilt der ich-Laut." },
    { teil: "Laute", frage: "Welches ch steckt in „das Buch“?", richtig: "der ach-Laut", falsch: ["der ich-Laut", "ein k", "ein sch"], erkl: "Nach a, o, u und au gilt der ach-Laut." },
    { teil: "Laute", frage: "Wie klingt „der Tag“ am Ende?", richtig: "wie „Tak“", falsch: ["wie „Tag“ mit weichem g", "wie „Tach“", "wie „Tank“"], erkl: "Auslautverhärtung: b, d, g werden am Wortende zu p, t, k. In „die Tage“ ist das g wieder weich." },
    { teil: "Laute", frage: "Wie klingt „-er“ am Wortende, etwa in „die Mutter“?", richtig: "fast wie ein a: „Mutta“", falsch: ["wie ein klares er", "wie ein ä", "es fällt ganz weg"], erkl: "Das unbetonte -er am Wortende wird zu einem a-ähnlichen Laut." },
    { teil: "Laute", frage: "Warum sagt man „am ’Abend“ mit einem kleinen Stopp?", richtig: "Der Knacklaut steht vor jedem Vokal am Wortanfang", falsch: ["Damit es höflicher klingt", "Weil „Abend“ betont ist", "Das ist nur beim Vorlesen so"], erkl: "Ohne Knacklaut kleben die Wörter aneinander: „amabend“. Probe: „oh-oh!“" },
    { teil: "Laute", frage: "Wie klingt das s in „die Sonne“?", richtig: "summend, mit Stimme", falsch: ["scharf", "wie sch", "wie ts"], erkl: "Vor einem Vokal summt das s. Am Wortende ist es scharf: „das Haus“." },

    { teil: "Betonung", frage: "Wo liegt die Betonung in „besuchen“?", richtig: "auf der zweiten Silbe: be-SU-chen", falsch: ["auf der ersten: BE-su-chen", "auf der letzten: be-su-CHEN", "das ist egal"], erkl: "Die Vorsilben be-, ge-, ver-, er-, ent-, zer- sind nie betont." },
    { teil: "Betonung", frage: "Wo liegt die Betonung in „aufstehen“?", richtig: "auf der Vorsilbe: AUF-ste-hen", falsch: ["auf-STE-hen", "auf-ste-HEN", "das ist egal"], erkl: "Trennbare Vorsilben sind immer betont — daran erkennt man sie auch." },
    { teil: "Betonung", frage: "Wo liegt die Betonung in „die Universität“?", richtig: "hinten: U-ni-ver-si-TÄT", falsch: ["vorn: U-ni-ver-si-tät", "in der Mitte: u-ni-VER-si-tät", "das ist egal"], erkl: "Die Endungen -ion, -ität und -ieren ziehen die Betonung ans Wortende." },
    { teil: "Betonung", frage: "Wo liegt die Betonung bei „der Schreibtisch“?", richtig: "auf dem ersten Glied: SCHREIB-tisch", falsch: ["auf dem zweiten: schreib-TISCH", "auf beiden gleich", "das ist egal"], erkl: "Bei zusammengesetzten Wörtern trägt das erste Glied die Hauptbetonung." },
  ];

  const TEST_IT = [
    { teil: "Alfabeto", frage: "Wie viele Buchstaben hat das italienische Alphabet?", richtig: "21", falsch: ["26", "24", "29"], erkl: "j, k, w, x und y kommen nur in Fremdwörtern vor und gehören nicht dazu." },
    { teil: "Alfabeto", frage: "Wie heißt der Buchstabe „h“ auf Italienisch?", richtig: "acca", falsch: ["hacca", "ha", "acco"], erkl: "„acca“ — und gesprochen wird das h nie." },
    { teil: "Alfabeto", frage: "Wie heißt „z“ auf Italienisch?", richtig: "zeta", falsch: ["zett", "zi", "tseta"], erkl: "„zeta“. Der Laut ist ts oder ds: „la pizza“, „lo zaino“." },
    { teil: "Regeln", frage: "Wie klingt „c“ in „la cena“?", richtig: "wie tsch", falsch: ["wie k", "wie ts", "wie sch"], erkl: "Vor e und i wird c weich: „la cena“, „il cinema“." },
    { teil: "Regeln", frage: "Wie klingt „c“ in „la casa“?", richtig: "wie k", falsch: ["wie tsch", "wie ts", "wie sch"], erkl: "Vor a, o, u bleibt c hart." },
    { teil: "Regeln", frage: "Wozu dient das h in „chi“?", richtig: "Es macht das c hart", falsch: ["Es wird gehaucht", "Es macht das i lang", "Es ist ein Rechtschreibfehler"], erkl: "c-h und g-h sind Bremsen: Sie verhindern, dass c und g vor e/i weich werden." },
    { teil: "Regeln", frage: "Wie spricht man „gli spaghetti“?", richtig: "mit hartem g — spa-GHET-ti", falsch: ["mit dsch", "mit sch", "mit ch wie in „ich“"], erkl: "gh = hartes g. Und „gli“ am Anfang ist der lj-Laut." },
    { teil: "Regeln", frage: "Wie klingt „gn“ in „il bagno“?", richtig: "wie ein einziger nj-Laut", falsch: ["wie g + n", "wie ng", "wie nk"], erkl: "Ein Laut, kein g zu hören." },
    { teil: "Regeln", frage: "Wie klingt „gli“ in „la famiglia“?", richtig: "wie ein weiches lj", falsch: ["wie g + l + i", "wie ein hartes g", "wie j"], erkl: "Die Zunge liegt breit am Gaumen, die Luft fließt seitlich vorbei." },
    { teil: "Regeln", frage: "Wie klingt „sc“ in „il pesce“?", richtig: "wie sch", falsch: ["wie sk", "wie s + k", "wie ts"], erkl: "sc + e/i = sch, sc + a/o/u = sk („la scuola“)." },
    { teil: "Regeln", frage: "Was ist der Unterschied zwischen „il nonno“ und „il nono“?", richtig: "Großvater und neunter — der Doppelkonsonant unterscheidet sie", falsch: ["Nichts, nur die Schreibung", "Einer ist Mehrzahl", "Einer ist ein Fremdwort"], erkl: "Im Italienischen wird der Doppelkonsonant wirklich länger gehalten." },
    { teil: "Regeln", frage: "Wie viele Silben hat „grazie“?", richtig: "drei: gra-zi-e", falsch: ["zwei", "vier", "eine"], erkl: "Jeder Vokal wird gesprochen — auch der am Ende." },
    { teil: "Regeln", frage: "Wo liegt die Betonung bei italienischen Wörtern normalerweise?", richtig: "auf der vorletzten Silbe", falsch: ["auf der ersten", "auf der letzten", "auf der drittletzten"], erkl: "a-MI-co, gior-NA-ta, ra-GAZ-zo. Ein Akzent zeigt Endbetonung an: cit-TÀ." },
    { teil: "Regeln", frage: "Warum heißt es „lo studente“ und nicht „il studente“?", richtig: "Vor s + Konsonant steht „lo“ — sonst wäre es nicht auszusprechen", falsch: ["Weil „studente“ männlich ist", "Weil es ein Fremdwort ist", "Das ist ein Fehler"], erkl: "Dieselbe Regel gilt vor z, gn, ps und x: lo zaino, lo gnocco, lo psicologo." },
    { teil: "Laute", frage: "Wie ist das italienische r?", richtig: "mit der Zungenspitze gerollt", falsch: ["hinten im Rachen wie im Deutschen", "stumm", "wie ein englisches r"], erkl: "Zungenspitze locker an den Zahndamm, Luft darüber — sie flattert von selbst." },
    { teil: "Laute", frage: "Was passiert bei italienischem p, t, k?", richtig: "Sie kommen ohne Hauch", falsch: ["Sie werden gehaucht wie im Deutschen", "Sie werden weich gesprochen", "Sie fallen am Wortende weg"], erkl: "Blatt-Papier-Probe: Bei „il pane“ darf sich das Blatt nicht bewegen." },
    { teil: "Laute", frage: "Gibt es im Italienischen ein ü?", richtig: "Nein — u bleibt immer u", falsch: ["Ja, in „luna“", "Ja, aber nur im Norden", "Ja, geschrieben als „ù“"], erkl: "„la luna“, „la musica“ — immer klares u. „gu“ ist gw, „qu“ ist kw." },
  ];

  return {
    ALPHABET: { de: ALPHABET_DE, it: ALPHABET_IT },
    VERBINDUNGEN: { de: VERBINDUNGEN_DE, it: VERBINDUNGEN_IT },
    REGELN: { de: REGELN_DE, it: REGELN_IT },
    BUENDEL: { de: BUENDEL_DE, it: BUENDEL_IT },
    TRICKS: { de: TRICKS_DE, it: TRICKS_IT },
    ZUNGENBRECHER: { de: ZUNGENBRECHER_DE, it: ZUNGENBRECHER_IT },
    TEST: { de: TEST_DE, it: TEST_IT },
    // Einzelne Grafiken, die auch außerhalb eines Tricks gebraucht werden.
    GRAFIK: { buendel: SVG_BUENDEL, laenge: SVG_LAENGE, dehnh: SVG_DEHNH, ng: SVG_NG, k: SVG_K, ich: SVG_ICH, ach: SVG_ACH, ue: SVG_UE, oe: SVG_OE },
  };
})();
