/* =========================================================
   CORE — geteilte Hilfsfunktionen für alle Module
   ========================================================= */
const Core = (function () {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Zieht `count` einzigartige Elemente aus `pool`, ohne Wiederholung.
  // Wenn der Pool kleiner ist als `count`, wird der ganze (gemischte) Pool zurückgegeben.
  function drawUnique(pool, count) {
    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (v !== undefined && v !== null && v !== false) {
          node.setAttribute(k, v);
        }
      });
    }
    children.flat().forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* Zweiter Parameter „sprache": ein Sprachkürzel wie "it". Ohne
     Angabe bleibt es bei Deutsch. Gebraucht wird das vom Lernraum
     Italienisch — ein italienisches Wort mit deutscher Stimme
     vorgelesen ist als Aussprachehilfe wertlos. */
  function speak(text, sprache) {
    if (!("speechSynthesis" in window)) return;
    const kurz = (sprache || "de").slice(0, 2).toLowerCase();
    const voll = { de: "de-DE", it: "it-IT", en: "en-GB", fr: "fr-FR", es: "es-ES" }[kurz] || "de-DE";
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = voll;
    utter.rate = 0.92;
    // Viele Geräte (besonders iPhone) bieten mehrere Stimmen je Sprache an — eine "Standard"-
    // Stimme, die oft roboterhaft klingt, und daneben oft bessere "Enhanced"/"Premium"-Stimmen.
    // Wenn eine davon verfügbar ist, wird sie bevorzugt statt der ersten besten Stimme.
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang && v.lang.startsWith(kurz));
    const preferred = voices.find((v) => /enhanced|premium|natural/i.test(v.name)) || voices[0];
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  /* ============================================================
     AUSSPRACHE HÖREN UND PRÜFEN
     ------------------------------------------------------------
     Was hier gemessen wird — und was nicht:

     Der Browser bringt eine Spracherkennung mit (Web Speech API). Sie
     hört zu und liefert zurück, welches Wort sie VERSTANDEN hat, dazu
     eine eigene Sicherheit zwischen 0 und 1. Daraus lässt sich ehrlich
     ableiten, ob das gesprochene Wort ANKOMMT: Wer „Betriebskosten-
     abrechnung“ sagt und die Erkennung schreibt genau das, hat sich
     verständlich gemacht.

     Was hier NICHT gemessen wird, ist die Lautqualität — ob das „ö“
     wirklich ein „ö“ ist oder eher ein „ø“. Das können nur eigens dafür
     gebaute Dienste (z. B. die Aussprachebewertung von Azure), und die
     brauchen einen Server und kosten Geld. Deshalb heißt die Anzeige in
     der Oberfläche „Verständlichkeit“ und nicht „Aussprachenote“ — ein
     Prozentwert, der etwas anderes verspricht, als er misst, wäre
     Augenwischerei.

     Die Anbindung ist so geschnitten, dass ein solcher Dienst später nur
     eine weitere Bewertungsquelle wäre: hoerePruefung() gibt Text und
     Sicherheit zurück, bewerteAussprache() macht daraus die Zahl.
     ============================================================ */
  function spracherkennungDa() {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  /* Hört EINMAL zu und meldet, was verstanden wurde.
     Auflösung: { text, sicherheit, alternativen } oder { fehler }. */
  function hoereZu(optionen) {
    const o = optionen || {};
    return new Promise((fertig) => {
      const Erkenner = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Erkenner) { fertig({ fehler: "nicht-verfuegbar" }); return; }
      let erkenner;
      try { erkenner = new Erkenner(); } catch (e) { fertig({ fehler: "nicht-verfuegbar" }); return; }
      erkenner.lang = o.sprache || "de-DE";
      erkenner.interimResults = false;
      erkenner.continuous = false;
      /* Mehrere Vorschläge anfordern: die Erkennung schreibt oft eine
         gängigere Schreibweise an die erste Stelle („Bahn hofs“ statt
         „Bahnhofs“). Wer richtig gesprochen hat, soll daran nicht
         scheitern — deshalb zählt der beste Treffer, nicht der erste. */
      erkenner.maxAlternatives = 5;
      let beendet = false;
      const schluss = (ergebnis) => { if (beendet) return; beendet = true; try { erkenner.stop(); } catch (e) {} fertig(ergebnis); };
      erkenner.onresult = (e) => {
        const treffer = e.results && e.results[0];
        if (!treffer || !treffer.length) { schluss({ fehler: "nichts-verstanden" }); return; }
        const alternativen = [];
        for (let i = 0; i < treffer.length; i++) alternativen.push({ text: treffer[i].transcript, sicherheit: treffer[i].confidence || 0 });
        schluss({ text: alternativen[0].text, sicherheit: alternativen[0].sicherheit, alternativen });
      };
      erkenner.onerror = (e) => {
        // "not-allowed" heißt: das Mikrofon wurde abgelehnt oder ist gesperrt.
        schluss({ fehler: e && e.error ? e.error : "fehler" });
      };
      erkenner.onend = () => schluss({ fehler: "nichts-verstanden" });
      // Notbremse: manche Geräte lösen weder onend noch onerror aus.
      setTimeout(() => schluss({ fehler: "zeit-abgelaufen" }), o.hoechstdauer || 8000);
      try { erkenner.start(); } catch (e) { schluss({ fehler: "start-fehlgeschlagen" }); }
    });
  }
  /* Wie ähnlich sind zwei Wörter? Levenshtein-Abstand, auf 0–1 normiert.
     Klein geschrieben, ohne Satzzeichen — „Bahnhof.“ und „bahnhof“ sind
     dieselbe Aussprache. */
  function wortAehnlichkeit(a, b) {
    /* Leerzeichen fallen weg, wenn das Zielwort selbst keines hat: die
       Erkennung trennt zusammengesetzte Wörter gern („Bahn Hof“), wer sie
       richtig ausgesprochen hat, soll daran nicht scheitern. Auch der
       Artikel wird abgeschnitten — geprüft wird die Aussprache des Wortes,
       nicht ob jemand „der“ mitgesprochen hat. */
    const grund = (s) => String(s || "").toLowerCase()
      .replace(/^(der|die|das|ein|eine)\s+/, "")
      .replace(/[^a-zäöüß\s]/g, "").replace(/\s+/g, " ").trim();
    const zielHatLuecke = grund(a).includes(" ");
    const norm = (s) => (zielHatLuecke ? grund(s) : grund(s).replace(/\s+/g, ""));
    const x = norm(a), y = norm(b);
    if (!x || !y) return 0;
    if (x === y) return 1;
    const m = x.length, n = y.length;
    let vorher = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const jetzt = [i];
      for (let j = 1; j <= n; j++) {
        jetzt[j] = Math.min(vorher[j] + 1, jetzt[j - 1] + 1, vorher[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
      }
      vorher = jetzt;
    }
    return Math.max(0, 1 - vorher[n] / Math.max(m, n));
  }
  /* Aus dem Gehörten eine Zahl machen.
     Die Ähnlichkeit wiegt schwer (sie sagt, OB das Wort ankam), die
     Sicherheit der Erkennung ergänzt sie (sie sagt, wie deutlich).
     Bei Geräten, die gar keine Sicherheit liefern (Safari gibt oft 0),
     zählt allein die Ähnlichkeit — sonst wäre dort jede Aufnahme
     schlecht bewertet, obwohl richtig gesprochen wurde. */
  function bewerteAussprache(ziel, gehoert) {
    const liste = (gehoert && gehoert.alternativen) || (gehoert && gehoert.text ? [{ text: gehoert.text, sicherheit: gehoert.sicherheit || 0 }] : []);
    if (!liste.length) return { prozent: 0, beste: "", aehnlichkeit: 0 };
    let beste = liste[0], besteAehnlichkeit = -1;
    liste.forEach((a) => { const w = wortAehnlichkeit(ziel, a.text); if (w > besteAehnlichkeit) { besteAehnlichkeit = w; beste = a; } });
    const sicherheit = beste.sicherheit > 0 ? beste.sicherheit : null;
    /* Die Sicherheit wird MULTIPLIZIERT, nicht addiert. Sie sagt ja nur,
       wie sicher sich die Erkennung ihrer eigenen Abschrift ist — nicht,
       ob das Wort stimmt. Addiert man sie, bekäme ein selbstsicher
       erkanntes FALSCHES Wort trotzdem eine ordentliche Note; „Banane“
       für „Bahnhof“ kam so auf 55 %. Multipliziert kann sie eine gute
       Aussprache bestätigen, aber eine falsche nie retten. */
    const wert = sicherheit === null ? besteAehnlichkeit : besteAehnlichkeit * (0.7 + 0.3 * sicherheit);
    return { prozent: Math.round(clamp(wert, 0, 1) * 100), beste: beste.text, aehnlichkeit: besteAehnlichkeit, sicherheit };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }

  // Wandelt "HA-ben" in Duden-Stil um: betonte Silbe fett + Punkt darunter.
  /* ============================================================
     BETONUNG — Kennzeichnung wie im Duden
     ------------------------------------------------------------
     Der Duden markiert nicht die ganze Silbe, sondern den betonten
     VOKAL, und unterscheidet dabei die Länge:
       · Punkt darunter  = kurzer Vokal (Bạnk, Lọch)
       ‗ Strich darunter = langer Vokal  (Ta̲g, Wie̲se)
     Die Länge wird nicht geraten, sondern nach den deutschen
     Schreibregeln am ganzen Wort abgelesen: Dehnungs-h, Doppelvokal,
     „ie", Diphthong und die Zahl der folgenden Konsonanten.
     ============================================================ */
  const VOKALE = "aeiouäöüy";
  const DIPHTHONGE = ["ei", "ai", "au", "eu", "äu", "ey", "ay"];
  const LANGE_PAARE = ["ie", "aa", "ee", "oo"];
  // Häufige kurze Wörter, die trotz nur eines Konsonanten kurz gesprochen werden —
  // die allgemeine Regel würde sie sonst fälschlich als lang markieren.
  const KURZE_AUSNAHMEN = new Set(["das", "was", "es", "in", "an", "um", "am", "im", "hat", "bis", "man", "von", "vom", "zum", "ab", "ob", "bin", "hin", "des", "un", "hin", "dran", "drin", "dass", "bis", "mit"]);
  /* Stämme mit LANGEM betontem Vokal. Abgeleitet aus den einsilbigen
     Wörterbucheinträgen, bei denen die Schreibung die Länge eindeutig
     hergibt — „die Tür" entscheidet damit auch „Türschwelle". */
  const STAMM_LANG = new Set([
    "aal", "ab", "ahn", "an", "auch", "auf", "auf zeit", "aus", "bad", "bahn", "bar", "bau",
    "bauch", "baum", "beet", "bei", "beil", "bein", "bier", "bis", "blau", "blei", "bleich",
    "blog", "bloß", "blut", "bon", "boom", "boot", "bot", "brauch", "braun", "braut", "brav",
    "brei", "breit", "brief", "brot", "brut", "buch", "bus", "bär", "bö", "chef", "chlor",
    "chor", "deich", "dein", "deutsch", "dieb", "dienst", "dir", "dom", "doof", "draht",
    "dreh", "drei", "dschob", "du", "ei", "eid", "eins", "einst", "eis", "er", "es", "euch",
    "fahrt", "fair", "faul", "faust", "fax", "fee", "fein", "feucht", "fied", "fit", "fleisch",
    "fleiß", "floh", "flug", "flur", "flut", "frau", "freund", "froh", "früh", "fuß", "fän",
    "föhn", "für", "gag", "gas", "geist", "geiz", "gen", "gier", "glas", "gleich", "gleis",
    "glut", "gnu", "grab", "grad", "graf", "gras", "grat", "grau", "greis", "grieß", "grob",
    "groß", "gruß", "grün", "gut", "haar", "hahn", "hai", "hain", "haus", "haut", "heer",
    "heiß", "heu", "hier", "hin", "hit", "hof", "hohl", "hohn", "huf", "huhn", "hut", "ihm",
    "ihn", "ihr", "in", "ja", "jahr", "jahr für jahr", "je", "kahl", "kahn", "kai", "kap",
    "kaum", "kauz", "keim", "kein", "kies", "klar", "klaud", "klee", "kleid", "klein", "kloß",
    "klug", "knie", "kohl", "kran", "kraut", "kreis", "kreuz", "krieg", "krug", "krux", "kuh",
    "kur", "kühl", "laib", "laich", "lau", "laub", "lauch", "lauf", "laus", "laut", "leer",
    "lehm", "leicht", "leid", "leim", "lieb", "lied", "lob", "lohn", "los", "lot", "mai",
    "mais", "mal", "man", "maul", "maus", "maut", "maß", "meer", "mehl", "mehr", "mein",
    "meist", "mief", "mir", "mit", "mohn", "mond", "moor", "moos", "mut", "na", "nah", "naht",
    "neid", "nein", "neu", "neun", "nie", "not", "nun", "nur", "ob", "oh", "ohr", "paar",
    "pfeil", "pflug", "pin", "plan", "plot", "po", "pol", "pool", "pop", "preis", "pro", "rad",
    "rap", "rat", "rau", "raub", "rauch", "raum", "reh", "reich", "reif", "reim", "rein",
    "reis", "reiz", "roh", "rohr", "rot", "ruf", "rum", "ruß", "saal", "sau", "saum", "schaf",
    "schal", "scham", "schaum", "scheu", "schlaf", "schlag", "schlau", "schlauch", "schmal",
    "schmied", "schnee", "schnur", "schon", "schrei", "schrein", "schräg", "schuh", "schul",
    "schwan", "schwein", "schweiß", "schwer", "schwur", "schwül", "schön", "see", "sehr",
    "seil", "sein", "seit", "set", "show", "sie", "sieb", "sieg", "skat", "ski", "slip",
    "smog", "sog", "sohn", "spam", "spaß", "speer", "spiel", "spieß", "spuk", "spur", "spät",
    "staat", "stahl", "star", "stau", "staub", "steg", "steif", "steik", "steil", "stein",
    "stiel", "stier", "stil", "stoß", "strahl", "strauch", "strauß", "streich", "streik",
    "streit", "stroh", "strom", "stuhl", "stur", "stör", "sud", "süß", "tag", "tal", "tat",
    "tau", "taub", "tee", "teer", "teich", "teig", "teil", "teils", "thron", "tief", "tier",
    "tja", "tod", "ton", "top", "tor", "tot", "trab", "traum", "treu", "trieb", "trog", "trüb",
    "tschet", "tschip", "tun", "tweed", "tüp", "tür", "uhr", "um", "viel", "vier", "vlies",
    "von", "vor", "wahl", "wahr", "wal", "was", "wehr", "weich", "weil", "weg", "wein", "weit",
    "weiß", "wem", "wen", "wer", "wie", "wir", "wo", "wohl", "wok", "wrap", "wut", "zahl",
    "zahm", "zahn", "zaum", "zaun", "zehn", "zehnt", "zeit", "zeug", "ziel", "zu", "zug",
    "zwar", "zwei", "zweig", "zäh", "öl"
  ]);

  /* Dasselbe für kurze Vokale: Doppelkonsonant, ck, tz, dt. */
  const STAMM_KURZ = new Set([
    "app", "arm", "arzt", "ass", "ball", "bann", "bass", "berg", "bett", "bild", "biss",
    "blass", "blatt", "blick", "blitz", "block", "bock", "bord", "brett", "burg", "bürg",
    "damm", "dann", "dass", "deck", "denn", "dick", "dill", "dort", "dreck", "druck", "dumm",
    "durch", "dünn", "dürr", "fall", "falls", "fass", "fell", "fett", "fleck", "flott",
    "fluss", "frack", "furcht", "förd", "gar", "glatt", "glück", "gott", "gramm", "grell",
    "griff", "grill", "groll", "gurt", "hart", "hass", "heck", "hell", "herr", "herz", "jazz",
    "jetzt", "kamm", "keck", "kind", "kinn", "kirch", "kitt", "kitz", "klamm", "klecks",
    "klick", "knapp", "knick", "knicks", "kniff", "krumm", "kurz", "kuss", "körp", "lack",
    "lamm", "leck", "mann", "matt", "mopp", "morg", "müll", "nackt", "narr", "nass", "nett",
    "netz", "nord", "null", "nuss", "ort", "pass", "pfiff", "platt", "platz", "puck", "putz",
    "reck", "riff", "riss", "rock", "sack", "satt", "satz", "schall", "schatz", "schick",
    "schiff", "schlamm", "schlapp", "schlimm", "schlitz", "schloss", "schluck", "schluss",
    "schmuck", "schmutz", "schnell", "schnitt", "schock", "schreck", "schrill", "schritt",
    "schritt für schritt", "schroff", "schrott", "schuss", "schutz", "schwamm", "sinn", "sitz",
    "snack", "sorg", "spatz", "speck", "spitz", "sport", "spott", "spross", "stadt", "stall",
    "stamm", "starr", "statt", "still", "stoff", "straff", "strass", "stress", "stuck",
    "stumm", "stück", "stück für stück", "tipp", "toll", "trick", "troll", "trotz", "tschüss",
    "tüll", "voll", "wall", "wann", "war", "warm", "wart", "watt", "wenn", "werb", "wind",
    "wirt", "witz", "wort", "wrack", "zinn", "zoff", "zoll", "zweck", "zwecks"
  ]);

  /* Lang, OBWOHL zwei Konsonanten folgen. Die Regel „Vokal plus zwei
     Konsonanten ist kurz" stimmt fast immer — aber nicht bei Ur-laub,
     Vor-trag, Nach-bar, Obst, Mond, Pferd, Erde. */
  const LANG_TROTZ_HAEUFUNG = new Set([
    "art", "bart", "beschwerd", "bewähr", "blut", "boot", "brot", "brut", "düst", "empör",
    "erd", "erde", "erhör", "erklär", "ernähr", "erst", "erz", "flut", "geburt", "gefährd",
    "gespräch", "gewähr", "glut", "grad", "gut", "gär", "harn", "herd", "hoch", "hust", "hut",
    "höch", "hör", "jagd", "kehr", "kloster", "krebs", "magd", "mond", "mut", "mär", "märz",
    "nach", "not", "nähr", "obst", "ost", "oster", "papst", "pfad", "pferd", "propst", "quart",
    "rot", "schul", "schwert", "sprach", "sprüch", "start", "stör", "tot", "trost", "ur",
    "verkehr", "verzehr", "vor", "wert", "west", "wohl", "wut", "wähl", "wär", "wärm", "wüst", "zart",
    "zerstör", "zu", "zähl", "über"
  ]);

  /* Vor ch und sch ist der Vokal überwiegend kurz: Fisch, Tasche,
     Woche, Küche, machen, waschen, Dach, Loch. Lang nur hier. */
  const CH_LANG = new Set([
    "besuch", "brach", "buch", "büch", "dusch", "flach", "flieh", "fluch", "früh", "geruch",
    "hoch", "husch", "höch", "kuch", "mär", "nach", "rach", "ruch", "räch", "sa", "sach",
    "schmach", "schuh", "spie", "spra", "sprach", "spruch", "sprüch", "such", "tuch", "tüch",
    "versuch", "wuch", "wüchs", "zieh"
  ]);

  /* Umgekehrt: Vorsilben, die trotz nur EINES folgenden Konsonanten
     kurz bleiben — ab-, an-, in-, un-, mit-. */
  const KURZE_SILBEN = new Set([
    "ab", "am", "an", "bis", "dann", "das", "denn", "des", "emp", "ent", "es", "hat", "hin",
    "im", "in", "man", "miss", "mit", "ob", "um", "un", "vom", "von", "wann", "was", ,
    "wenn", "zer", "zum"
  ]);

  // Ergebnis: { von, bis, lang } — lang ist true (lang), false (kurz) oder null.
  // null heißt ausdrücklich: die SCHREIBUNG gibt die Länge nicht eindeutig her.
  // Dann wird die Betonung angezeigt, aber keine Länge behauptet — lieber ehrlich
  // als geraten. Eindeutig sind: Dehnungs-h, Doppelvokal, „ie", Diphthong und ß
  // (lang) sowie Doppelkonsonant, ck, tz und ein zweifach geschlossener Silbenauslaut
  // (kurz).
  function betonterVokal(wort, start, laenge) {
    const silbe = wort.slice(start, start + laenge);
    let i = 0;
    while (i < silbe.length && !VOKALE.includes(silbe[i])) i += 1;
    if (i >= silbe.length) return null;
    let ende = i + 1;
    let lang = null;
    const paar = silbe.slice(i, i + 2);
    if (DIPHTHONGE.includes(paar)) { ende = i + 2; lang = true; }
    else if (LANGE_PAARE.includes(paar)) { ende = i + 2; lang = true; }
    if (lang === null) {
      // Alles, was im GANZEN Wort nach dem Vokal folgt — die Silbengrenze läuft
      // mitten durch Doppelkonsonanten („Löf-fel"), deshalb reicht die Silbe allein nicht.
      const rest = wort.slice(start + ende);
      let k = 0;
      while (k < rest.length && !VOKALE.includes(rest[k])) k += 1;
      const cluster = rest.slice(0, k);
      const imSilbenrest = silbe.slice(ende); // Konsonanten, die noch zur betonten Silbe gehören
      /* Erst die geprüften Tabellen, dann die Regel. Der Schlüssel ist
         die betonte Silbe selbst und, falls sie am Wortanfang steht,
         auch das ganze Wort bis zu ihrem Ende. */
      const silbeKlein = silbe;
      const bisHier = wort.slice(0, start + laenge);
      const ausTabelle = (schl) =>
        STAMM_LANG.has(schl) ? true : STAMM_KURZ.has(schl) ? false : null;
      const tab = ausTabelle(silbeKlein);
      const tab2 = tab === null ? ausTabelle(bisHier) : tab;

      // Zuerst, was die Schreibung sicher hergibt:
      if (rest[0] === "h" && !VOKALE.includes(rest[1] || "")) lang = true;      // Dehnungs-h: Bahn, Uhr
      else if (cluster.startsWith("ß")) lang = true;                            // Straße, Fuß
      else if (/^(ck|tz|dt)/.test(cluster)) lang = false;                       // Zucker, Katze
      else if (cluster.length >= 2 && cluster[0] === cluster[1]) lang = false;  // Doppelkonsonant: Löffel
      /* Vor ch und sch steht diese Prüfung GANZ VORNE. „wo" ist lang
         (die Frage), „Wo-che" kurz — die Stammtabelle würde sonst das
         Falsche sagen. Kurz ist hier die Regel: Fisch, Tasche, Woche,
         Küche, machen, waschen, Dach, Loch. Lang steht in der Liste. */
      else if (/^(ch|sch)/.test(cluster) || /(ch|sch)$/.test(imSilbenrest)) {
        const mitCh = silbeKlein + cluster;
        lang = (CH_LANG.has(silbeKlein) || CH_LANG.has(bisHier) || CH_LANG.has(mitCh)
          || CH_LANG.has(bisHier + cluster)) ? true : false;
      }
      /* Dann die geprüften Tabellen. Die kurzen Vorsilben stehen vor der
         Stammtabelle: „ab" und „an" sähen nach der Regel wie „Bad" aus —
         ein Vokal, ein Konsonant — werden aber kurz gesprochen. */
      else if (KURZE_SILBEN.has(silbeKlein)) lang = false;
      else if (LANG_TROTZ_HAEUFUNG.has(silbeKlein) || LANG_TROTZ_HAEUFUNG.has(bisHier)
        || LANG_TROTZ_HAEUFUNG.has(silbeKlein + cluster)) lang = true;
      else if (tab2 !== null) lang = tab2;
      // Und zuletzt die allgemeine Regel:
      else if (imSilbenrest.length === 0 && cluster.length <= 1) lang = true;   // offene Silbe: Ta-ge
      else if (imSilbenrest.length === 0 && cluster.length >= 2) lang = true;   // offene Silbe: A-bend
      else if (cluster.length === 1 && start + ende + 1 >= wort.length) lang = true; // Zug, Tag
      else if (imSilbenrest.length >= 1) lang = false;                          // geschlossene Silbe: un-ter, Kin-der
      else lang = null;
      if (KURZE_AUSNAHMEN.has(wort)) lang = false;
    }
    return { von: i, bis: ende, lang };
  }
  /* Ist diese Silbe komplett großgeschrieben, also die betonte?

     Zwei Fallen stecken darin, und beide sind echte Fehlerquellen gewesen:

     1. Das ß. „MAß-band" ist eine Großsilbe, aber `"MAß" === "MAß".toUpperCase()`
        ist falsch, weil JavaScript aus ß beim Großschreiben „SS" macht. Wörter
        mit ß in der betonten Silbe (Maßband, Fußsohle, Straßenschild, Bußgeld …)
        galten dadurch als „ohne Betonung" und fielen aus dem Betonungs-Trainer
        heraus. Deshalb wird ß hier als Zeichen ohne Groß-/Kleinform behandelt.
     2. Einzelne Großbuchstaben am Wortanfang. „E-le-MENT" schreibt das E groß,
        weil das Wort nun einmal so geschrieben wird — betont ist trotzdem MENT.
        Darum entscheidet betonteSilbenIndex() bei mehreren Kandidaten für die
        erste MEHRbuchstabige Silbe. */
  function silbeIstGross(p) {
    return /[A-ZÄÖÜ]/.test(p) && !/[a-zäöü]/.test(p.replace(/ß/g, ""));
  }
  function betonteSilbenIndex(teile) {
    const kandidaten = [];
    teile.forEach((p, i) => { if (silbeIstGross(p)) kandidaten.push(i); });
    if (!kandidaten.length) return -1;
    if (kandidaten.length === 1) return kandidaten[0];
    const mehrbuchstabig = kandidaten.filter((i) => teile[i].length > 1);
    return mehrbuchstabig.length ? mehrbuchstabig[0] : kandidaten[0];
  }
  function formatStress(syl) {
    if (!syl) return "";
    // Mehrteilige Angaben („das ZIEL") Wort für Wort behandeln.
    if (syl.includes(" ")) return syl.split(" ").map(formatStress).join(" ");
    const rohTeile = syl.split("-");
    /* Ein Stern vor einer Silbe kennzeichnet eine NEBENbetonung. Lange
       zusammengesetzte Wörter haben nämlich mehr als eine betonte Silbe:
       „Be-TRIEBS-kos-ten-ab-rech-nung" wird auf BETRIEBS haupt-, auf
       KOSten und ABrechnung nebenbetont. Wer nur die erste Betonung
       sieht, liest den Rest flach — und genau das klingt falsch. */
    const nebenIdx = new Set();
    const parts = rohTeile.map((p, i) => {
      if (p.startsWith("*")) { nebenIdx.add(i); return p.slice(1); }
      return p;
    });
    // Betonte Silbe finden. Achtung: die ERSTE Silbe ist bei Nomen ohnehin groß
    // geschrieben — ein einzelner Großbuchstabe („Ü-ber-LIE-fe-rung") ist deshalb
    // kein Betonungszeichen, solange es eine echte Großbuchstaben-Silbe gibt.
    const betontIdx = betonteSilbenIndex(parts);
    if (betontIdx < 0 && !nebenIdx.size) return syl;
    const klein = parts.map((p) => p.toLowerCase());
    const wort = klein.join("");
    const versatz = betontIdx > 0 ? klein.slice(0, betontIdx).join("").length : 0;
    const marke = betontIdx >= 0 ? betonterVokal(wort, versatz, klein[betontIdx].length) : null;
    return parts.map((part, i) => {
      let shown = part.toLowerCase();
      if (i === 0) shown = shown.charAt(0).toUpperCase() + shown.slice(1);
      if (i !== betontIdx) {
        if (!nebenIdx.has(i)) return shown;
        // Nebenbetonung: schwächer als die Hauptbetonung, aber sichtbar.
        const nebenMarke = betonterVokal(wort, klein.slice(0, i).join("").length, klein[i].length);
        if (!nebenMarke) return `<span class="stress-neben" title="nebenbetont">${shown}</span>`;
        const nv = shown.slice(0, nebenMarke.von);
        const nk = shown.slice(nebenMarke.von, nebenMarke.bis);
        const nh = shown.slice(nebenMarke.bis);
        const nart = nebenMarke.lang === true ? "stress-lang" : nebenMarke.lang === false ? "stress-kurz" : "stress-offen";
        return `<span class="stress-neben" title="nebenbetont"><span class="stress-vokal ${nart}">${nv}${nk}${nh}</span></span>`;
      }
      if (!marke) return `<span class="stress-mark">${shown}</span>`;
      const vorne = shown.slice(0, marke.von);
      const kern = shown.slice(marke.von, marke.bis);
      const hinten = shown.slice(marke.bis);
      const art = marke.lang === true ? "stress-lang" : marke.lang === false ? "stress-kurz" : "stress-offen";
      const titel = marke.lang === true ? "betont, langer Vokal" : marke.lang === false ? "betont, kurzer Vokal" : "betont — die Vokallänge lässt sich der Schreibung nicht eindeutig entnehmen";
      return `<span class="stress-mark">${vorne}<span class="stress-vokal ${art}" title="${titel}">${kern}</span>${hinten}</span>`;
    }).join("");
  }

  /* ============================================================
     DIE ITALIENISCHE BETONUNG — eigenes System, eigene Regeln
     ------------------------------------------------------------
     GEWÜNSCHT: „Der Betonungsmodus soll seitenweit auch ein eigener
     Betonungsmodus für die italienische Version sein, die auch geprüft
     ist mit allen Regeln, nichts im Zufall überlassen. Kein
     Pseudosystem."

     Warum die deutsche Anzeige für Italienisch nicht taugt: Die
     deutschen Betonungszeichen sagen nicht nur WO betont wird, sondern
     auch WIE — langer Strich, kurzer Punkt. Das Italienische kennt
     diesen Unterschied gar nicht. Ein Duden-Strich über einem
     italienischen Vokal behauptet also etwas, was es in der Sprache
     nicht gibt. Deshalb hat Italienisch hier eine eigene Anzeige: nur
     die betonte Silbe, mit dem Akzentzeichen, das im Italienischen
     dafür üblich ist.

     Und eine eigene Vorhersage. Das Italienische ist darin viel
     regelmäßiger als das Deutsche:

       1. Steht am Wortende ein Akzent (caffè, città, perché, così),
          ist die LETZTE Silbe betont. Das ist die einzige Betonung,
          die man wirklich sehen kann.
       2. Sonst ist der Normalfall die VORLETZTE Silbe — „parola
          piana", etwa vier von fünf Wörtern (amico, finestra, gatto).
       3. Ein kleinerer, aber fester Teil wird auf der DRITTLETZTEN
          betont — „parola sdrucciola" (tavolo, musica, telefono).
          Das sieht man dem Wort nicht an, das steht in der Liste
          SDRUCCIOLE unten.
       4. Verbformen der 3. Person Plural behalten die Betonung des
          Singulars und landen so auf der viertletzten Silbe
          (telèfona → telèfonano). Endung -ano/-ono nach einer
          sdrucciola-Form.

     Die Liste wurde nicht geraten: sie ist aus den italienischen
     Einträgen der Seite selbst aufgebaut und gegen sie geprüft
     (scratchpad/it-betonung-pruefen.js).
     ============================================================ */
  const IT_VOKALE = "aeiouàèéìíòóùú";
  const IT_AKZENT_ENDE = /[àèéìíòóùú]$/;
  // Silben, die im Italienischen als Einheit gelten: nach diesen
  // Buchstabengruppen wird nicht getrennt.
  const IT_DIGRAPHEN = ["ch", "gh", "gn", "gl", "sc", "ci", "gi", "sci"];
  const IT_MUTA_LIQUIDA = /^[bcdfgptv][lr]$/;

  /* Silbentrennung nach den italienischen Regeln. Sie ist deutlich
     berechenbarer als die deutsche, deshalb steht hier wirklich eine
     Regel und keine Tabelle. */
  function italienischeSilben(wortRoh) {
    const wort = String(wortRoh || "").toLowerCase().replace(/[^a-zàèéìíòóùúü']/g, "");
    if (!wort) return [];
    const istV = (z) => IT_VOKALE.includes(z);
    // 1. Das Wort in Vokal- und Konsonantengruppen zerlegen.
    const gruppen = [];
    for (let i = 0; i < wort.length; i++) {
      const v = istV(wort[i]);
      if (gruppen.length && gruppen[gruppen.length - 1].v === v) gruppen[gruppen.length - 1].t += wort[i];
      else gruppen.push({ v, t: wort[i] });
    }
    /* 2. Vokalgruppen weiter zerlegen: „ia, ie, io, iu, ua, ue, ui, uo"
       und „ai, ei, oi, au, eu" bleiben zusammen (Diphthong), zwei
       kräftige Vokale nebeneinander bilden zwei Silben (pa-e-se,
       mi-o wäre falsch — „mio" ist einsilbig, „paese" dreisilbig). */
    const zerlegt = [];
    gruppen.forEach((g) => {
      if (!g.v || g.t.length < 2) { zerlegt.push(g); return; }
      let rest = g.t, teil = "";
      const schwach = (z) => z === "i" || z === "u";
      for (let i = 0; i < rest.length; i++) {
        const z = rest[i], vor = teil[teil.length - 1];
        if (!teil) { teil = z; continue; }
        // steigender Diphthong (schwach + stark) oder fallender (stark + schwach)
        if (schwach(vor) || schwach(z)) { teil += z; continue; }
        zerlegt.push({ v: true, t: teil }); teil = z;
      }
      if (teil) zerlegt.push({ v: true, t: teil });
    });
    /* 3. Die Konsonantengruppen zwischen den Vokalen aufteilen.
       0 Konsonanten → Silbengrenze direkt dazwischen.
       1 Konsonant   → zur folgenden Silbe (ca-sa).
       2 Konsonanten → zusammen zur folgenden, wenn Digraph oder
                       „muta cum liquida" (li-bro, fi-glio); sonst
                       getrennt (let-to, por-ta).
       3+            → beginnt die Gruppe mit s, geht alles nach hinten
                       (co-stru-zio-ne); sonst bleibt der erste vorn. */
    const silben = [];
    let aktuell = "";
    for (let i = 0; i < zerlegt.length; i++) {
      const g = zerlegt[i];
      if (g.v) { aktuell += g.t; continue; }
      const k = g.t;
      const letzteGruppe = i === zerlegt.length - 1;
      if (letzteGruppe) { aktuell += k; continue; }   // Konsonant am Wortende
      if (!aktuell) { aktuell += k; continue; }        // Konsonant am Wortanfang
      let vorn = "", hinten = k;
      if (k.length === 1) { hinten = k; }
      else if (k.length === 2) {
        if (IT_DIGRAPHEN.includes(k) || IT_MUTA_LIQUIDA.test(k)) hinten = k;
        else { vorn = k[0]; hinten = k.slice(1); }
      } else {
        if (k[0] === "s") hinten = k;
        else if (IT_DIGRAPHEN.includes(k.slice(1)) || IT_MUTA_LIQUIDA.test(k.slice(1))) { vorn = k[0]; hinten = k.slice(1); }
        else { vorn = k.slice(0, k.length - 2); hinten = k.slice(-2); }
      }
      silben.push(aktuell + vorn);
      aktuell = hinten;
    }
    if (aktuell) silben.push(aktuell);
    return silben.filter(Boolean);
  }

  /* Wörter mit Betonung auf der DRITTletzten Silbe. Regelmäßig ist im
     Italienischen die vorletzte — diese hier sind es nicht, und man kann
     es der Schreibung nicht ansehen. Daher: Liste.

     Sie ist NICHT aus dem Gedächtnis geschrieben, sondern aus den
     italienischen Einträgen dieser Seite erzeugt: jedes Wort, dessen
     hinterlegte Betonung von der Regel „vorletzte Silbe" abweicht,
     steht hier. Gebaut und geprüft von
     scratchpad/it-betonung-pruefen.js — dort auch die Trefferquote.
     Stand: 24 Wörter, geprüft gegen 247 italienische Einträge. */
  const IT_SDRUCCIOLE = new Set([
    "albero", "autobus", "bambola", "barattolo", "camice", "cattedra", "compiti",
    "forbici", "frigorifero", "fulmine", "giocattoli", "igienica", "lampada", "macchina",
    "mettere", "nuvola", "ordine", "pantofole", "pecora", "pentola", "semaforo",
    "spazzola", "tavolo", "trapano"
  ]);

  /* Grundformen der Verben, die auf dieser Seite vorkommen. Gebraucht
     werden sie nur für eine Sache: zu erkennen, ob ein Wort auf -ano/-ono
     wirklich eine Verbform der 3. Person Plural ist (pàrlano) oder ein
     Nomen, das nur so aussieht (divano, asciugamano). */
  const IT_VERBEN = new Set([
    "abitare", "accendere", "andare", "aprire", "arrivare", "ascoltare",
    "aspettare", "avere", "ballare", "bere", "cadere", "cambiare",
    "camminare", "cantare", "capire", "cenare", "cercare", "chiamare",
    "chiedere", "chiudere", "cominciare", "comprare", "conoscere",
    "correre", "costare", "credere", "cucinare", "dare", "decidere",
    "dimenticare", "dire", "dormire", "dovere", "entrare", "essere",
    "fare", "finire", "girare", "giocare", "guardare", "guidare",
    "imparare", "incontrare", "insegnare", "lavare", "lavorare",
    "leggere", "mandare", "mangiare", "mettere", "nuotare", "offrire",
    "pagare", "parlare", "partire", "pensare", "perdere", "piacere",
    "portare", "potere", "pranzare", "preferire", "prendere",
    "preparare", "provare", "pulire", "ricordare", "ridere", "ripetere",
    "rispondere", "sapere", "scegliere", "scendere", "scrivere",
    "sentire", "spedire", "spiegare", "stare", "studiare", "suonare",
    "svegliare", "telefonare", "tornare", "trovare", "uscire", "vedere",
    "vendere", "venire", "vestire", "viaggiare", "vivere", "volare",
    "volere",
  ]);

  /* Hier kommt nichts dazu, was nicht auch nachschlagbar wäre: Endungen,
     die im Italienischen VERLÄSSLICH die drittletzte Silbe betonen. */
  const IT_SDRUCCIOLA_ENDUNGEN = [
    "abile", "ibile", "evole", "issimo", "issima", "issimi", "issime",
    "ologo", "ologa", "ografo", "ometro", "onimo", "ologia" /* → -logìa, siehe unten */,
  ];
  // Ausnahme zu -ologia: dort liegt die Betonung auf dem i (bio-lo-GI-a),
  // also NICHT sdrucciola. Wird unten eigens behandelt.
  const IT_IA_ENDBETONT = /(log|graf|nom|terap|farmac|chirurg)ia$/;
  /* Auf der letzten Silbe betont, obwohl kein Akzent geschrieben wird —
     meist Fremdwörter und verkürzte Formen. */
  const IT_TRONCHE_OHNE_AKZENT = new Set([
    "robot", "film", "sport", "castel", "san", "gran", "buon",
    "bel", "quel", "nessun", "alcun", "ciascun", "suol", "vien", "andar",
  ]);

  /* Die Vorhersage: welche Silbe ist betont? Rückgabe ist der Index in
     das Ergebnis von italienischeSilben(), oder -1, wenn unklar. */
  function betonungItAuto(wortRoh) {
    const wort = String(wortRoh || "").toLowerCase().trim();
    if (!wort) return { silben: [], index: -1, regel: null };
    const silben = italienischeSilben(wort);
    if (!silben.length) return { silben, index: -1, regel: null };
    /* Ein „einsilbiges" Wort, das auf einen fallenden Diphthong endet,
       ist in Wahrheit zweisilbig: „sdraio" ist sdrà-io, nicht sdraio.
       Die Silbentrennung fasst -aio/-eio/-oio zusammen; hier wird es
       wieder getrennt, damit der Ton vorn sitzt. */
    if (silben.length === 1 && /^.{2,}[aeo]io$/.test(wort)) {
      return { silben: [wort.slice(0, -2), wort.slice(-2)], index: 0, regel: "diphthong-vorn" };
    }
    if (silben.length === 1) return { silben, index: 0, regel: "einsilbig" };
    // 1. Geschriebener Akzent am Wortende
    if (IT_AKZENT_ENDE.test(wort)) return { silben, index: silben.length - 1, regel: "akzent" };
    // Akzent irgendwo im Wort (selten, aber eindeutig): pàtina, è
    const mitAkzent = silben.findIndex((s) => /[àèéìíòóùú]/.test(s));
    if (mitAkzent >= 0) return { silben, index: mitAkzent, regel: "akzent" };
    /* 2. 3. Person Plural: -ano/-ono ziehen die Betonung NICHT mit,
       sie bleibt, wo sie im Singular lag (pàrla → pàrlano).

       GEMESSEN und korrigiert: Die Endung allein genügt als Erkennung
       nicht. „divano" und „asciugamano" enden auch auf -ano, sind aber
       Nomen und regelmäßig auf der vorletzten Silbe betont — die
       Prüfung hat das aufgedeckt (scratchpad/it-betonung-pruefen.js).
       Die Regel greift deshalb nur, wenn zur Form auch ein Verb
       gehört, dessen Grundform in IT_VERBEN steht. */
    const plural = wort.match(/^(.*?)(iscono|ano|ono)$/);
    if (plural && silben.length >= 3) {
      const stamm = plural[1];
      const istVerb = plural[2] === "ano" ? IT_VERBEN.has(stamm + "are")
        : plural[2] === "iscono" ? (IT_VERBEN.has(stamm + "ire") || IT_VERBEN.has(stamm + "ire"))
        : (IT_VERBEN.has(stamm + "ere") || IT_VERBEN.has(stamm + "ire"));
      if (istVerb) {
        const singular = stamm + (plural[2] === "ano" ? "a" : "e");
        if (IT_SDRUCCIOLE.has(singular) || IT_SDRUCCIOLE.has(stamm + "a") || IT_SDRUCCIOLE.has(stamm + "o")) {
          return { silben, index: Math.max(0, silben.length - 4), regel: "verb-plural-sdrucciola" };
        }
        return { silben, index: silben.length - 3, regel: "verb-plural" };
      }
    }
    // 3. Endungen, die zuverlässig die drittletzte Silbe betonen
    /* -logìa, -grafìa, -nomìa: die Betonung sitzt auf dem i der Endung.
       Die Silbentrennung oben fasst „gia" zu einer Silbe zusammen, die
       betonte Stelle ist damit die letzte. */
    if (IT_IA_ENDBETONT.test(wort)) return { silben, index: silben.length - 1, regel: "ia-endbetont" };
    if (IT_SDRUCCIOLA_ENDUNGEN.some((e) => wort.endsWith(e)) && silben.length >= 3) {
      return { silben, index: silben.length - 3, regel: "endung-sdrucciola" };
    }
    // 4. Die Liste
    if (IT_SDRUCCIOLE.has(wort) && silben.length >= 3) {
      return { silben, index: silben.length - 3, regel: "liste-sdrucciola" };
    }
    /* 4b. Wörter, die auf dem letzten Vokal betont werden, obwohl dort
       kein Akzent steht: Fremdwörter (robot, film) und verkürzte Formen
       wie „castel" in Castel Sant'Angelo. Ohne diese Liste läge der Ton
       eine Silbe zu weit vorn. */
    if (IT_TRONCHE_OHNE_AKZENT.has(wort) && silben.length >= 2) {
      return { silben, index: silben.length - 1, regel: "tronca-ohne-akzent" };
    }
    // 5. Der Normalfall
    return { silben, index: silben.length - 2, regel: "piana" };
  }

  /* Die Anzeige. Eingabe ist dieselbe Silbenangabe wie im Deutschen —
     Silben mit Bindestrich, die betonte in GROSSBUCHSTABEN. Ausgabe ist
     die Silbenkette mit einem Akzentzeichen über dem betonten Vokal,
     so wie italienische Wörterbücher die Betonung angeben. Ausdrücklich
     KEINE Längenzeichen: die gibt es im Italienischen nicht. */
  function formatStressIt(syl) {
    if (!syl) return "";
    if (syl.includes(" ")) return syl.split(" ").map(formatStressIt).join(" ");
    const parts = syl.split("-").map((p) => p.replace(/^\*/, ""));
    const betontIdx = betonteSilbenIndex(parts);
    return parts.map((teil, i) => {
      const gezeigt = teil.toLowerCase();
      if (i !== betontIdx) return gezeigt;
      /* Den Vokal der betonten Silbe finden — bei einem Diphthong den
         KRÄFTIGEN (in „PIE-de" das e, in „AU-to" das a), denn dort sitzt
         der Ton. Trägt der Vokal schon einen Akzent (caffè), bleibt er
         wie er ist. */
      const vokale = [...gezeigt].map((z, k) => ({ z, k })).filter((x) => IT_VOKALE.includes(x.z));
      if (!vokale.length) return `<span class="stress-it">${gezeigt}</span>`;
      let ziel = vokale[0];
      if (vokale.length > 1) {
        const stark = vokale.find((x) => !"iu".includes(x.z));
        if (stark) ziel = stark;
        else ziel = vokale[vokale.length - 1];   // „piu", „giu" → auf dem u
      }
      if (/[àèéìíòóùú]/.test(ziel.z)) {
        return `<span class="stress-it">${gezeigt}</span>`;
      }
      const vorn = gezeigt.slice(0, ziel.k);
      const kern = gezeigt.slice(ziel.k, ziel.k + 1);
      const hinten = gezeigt.slice(ziel.k + 1);
      return `<span class="stress-it" title="betonte Silbe">${vorn}<span class="stress-it-vokal">${kern}</span>${hinten}</span>`;
    }).join('<span class="stress-it-trenn">\u00b7</span>');
  }

  /* Erklärt in einem Satz, WARUM diese Silbe betont ist — für den
     Betonungstrainer im Italienisch-Raum. */
  function betonungItErklaerung(wort, syl) {
    const teile = syl.split("-").map((p) => p.replace(/^\*/, ""));
    const idx = betonteSilbenIndex(teile);
    const vonHinten = teile.length - 1 - idx;
    const auto = betonungItAuto(wort);
    if (auto.regel === "akzent") {
      return "Der geschriebene Akzent zeigt die Betonung direkt an — das ist im Italienischen die einzige Betonung, die man sehen kann (caffè, città, perché).";
    }
    if (auto.regel === "verb-plural" || auto.regel === "verb-plural-sdrucciola") {
      return "3. Person Plural: Die Endung -ano/-ono zieht die Betonung nicht mit. Sie bleibt, wo sie im Singular lag — (lui) pàrla → (loro) pàrlano.";
    }
    if (vonHinten === 0) return "Endbetont (parola tronca) — solche Wörter tragen fast immer einen geschriebenen Akzent.";
    if (vonHinten === 1) return "Vorletzte Silbe — der Normalfall im Italienischen (parola piana). Etwa vier von fünf Wörtern werden so betont.";
    if (vonHinten === 2) return "Drittletzte Silbe (parola sdrucciola). Das sieht man dem Wort nicht an, das muss man lernen: TA-vo-lo, MU-si-ca, TE-le-fo-no.";
    return "Viertletzte Silbe (parola bisdrucciola). Fast immer die 3. Person Plural, die die Betonung des Singulars behält.";
  }

  // ---------- Soundeffekte (synthetisiert, keine Audiodateien nötig) ----------
  let audioCtx = null;
  function getCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function tone(freq, start, duration, type = "sine", volume = 0.15) {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  }
  // Weißes Rauschen, gefiltert und mit Lautstärke-Hüllkurve — klingt deutlich authentischer nach
  // einem echten Explosions-/Knall-Geräusch als reine Sinus-/Sägezahn-Töne allein.
  function noiseBurst(start, duration, volume = 0.2, filterFreq = 800) {
    const ctx = getCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime + start);
    filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + start + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime + start);
    noise.stop(ctx.currentTime + start + duration);
  }

  const sound = {
    correct() { tone(880, 0, 0.12, "sine"); tone(1318, 0.08, 0.18, "sine"); },
    wrong() { tone(180, 0, 0.22, "sawtooth", 0.12); },
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.25, "triangle", 0.14));
    },
    okay() {
      [523, 587].forEach((f, i) => tone(f, i * 0.12, 0.18, "triangle", 0.12));
    },
    // Ein kurzer, leiser Tipp-Ton — für die Bilderwelt, wo man viel antippt
    // und ein „richtig/falsch" gar nicht gemeint ist.
    click() { tone(1046, 0, 0.05, "sine", 0.06); },
    fail() {
      // "Sad trombone" — absteigende Töne
      [400, 360, 320, 260].forEach((f, i) => tone(f, i * 0.18, 0.24, "sawtooth", 0.12));
    },
    explosion() {
      // Echter Knall: gefiltertes Rauschen für den initialen "Wumms", darunter tiefe, abfallende
      // Töne fürs Nachrumpeln — klingt deutlich authentischer als reine Sinus-/Sägezahn-Töne.
      noiseBurst(0, 0.22, 0.28, 1400);
      tone(90, 0, 0.28, "sawtooth", 0.2);
      tone(55, 0.02, 0.32, "square", 0.16);
      tone(180, 0, 0.06, "square", 0.08);
    },
    zonk() {
      // Zweisilbiger "Falsch!"-Buzzer, wie bei Quizshows ("eh-EH") — zwei kurze, tiefe Töne mit
      // fallender Tonhöhe innerhalb jeder Silbe, deutlich vom normalen wrong()-Ton unterscheidbar.
      tone(220, 0, 0.14, "square", 0.16); tone(160, 0.05, 0.14, "square", 0.14);
      tone(200, 0.28, 0.16, "square", 0.18); tone(130, 0.34, 0.18, "square", 0.16);
    },
    miau() {
      /* Ein Katzenlaut aus zwei Teilen: das "mi" steigt kurz an, das "au"
         fällt langsam ab. Zusammen mit dem leichten Vibrato klingt es nach
         Katze statt nach Piepton. Rein erzeugt, keine Audiodatei nötig. */
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      osc.type = "sawtooth";
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.linearRampToValueAtTime(760, t + 0.09);   // „mi“ steigt
      osc.frequency.linearRampToValueAtTime(430, t + 0.42);   // „au“ fällt
      vib.type = "sine";
      vib.frequency.setValueAtTime(16, t);
      vibGain.gain.setValueAtTime(22, t);
      vib.connect(vibGain).connect(osc.frequency);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.13, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1600, t);
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t); vib.start(t);
      osc.stop(t + 0.5); vib.stop(t + 0.5);
    },
    bubblePop() {
      // Kurzes, helles "Blubb" wie eine echte Seifenblase — bewusst deutlich anders als
      // explosion() (dumpfer Knall): ein kurzer, hoher Ton, der schnell in der Tonhöhe absackt
      // und leise ausklingt, statt eines lauten, tiefen "Wumms".
      tone(1100, 0, 0.05, "sine", 0.1);
      tone(700, 0.03, 0.08, "sine", 0.09);
    },
    whistle(duration = 0.22) {
      // Kurzes, absteigendes Pfeifen — wie ein Geschoss im Anflug, kurz bevor es einschlägt.
      // Frequenz sinkt exponentiell während der gesamten Flugdauer, synchron zur Kugel-Animation.
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    },
  };

  return { shuffle, drawUnique, el, speak, clamp, uid, formatStress, sound,
    silbeIstGross, betonteSilbenIndex,
    /* Italienisch: eigene Silbentrennung, eigene Betonungsregel, eigene Anzeige. */
    italienischeSilben, betonungItAuto, formatStressIt, betonungItErklaerung,
    spracherkennungDa, hoereZu, wortAehnlichkeit, bewerteAussprache };
})();
