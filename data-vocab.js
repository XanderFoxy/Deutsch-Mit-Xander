/* =========================================================
   DATA — VOKABELN, KOMPASS, MATERIALIEN, LINKS
   ========================================================= */

const VocabData = (function () {
  "use strict";

  // Vokabeltrainer — Starter-Set der nützlichsten Wörter.
  // stress: Betonungssilbe fett markiert über Großschreibung im Kommentar-Feld "syl".
  const WORDS = [
    { word: "sein", syl: "sein", en: "to be", example: "Ich bin müde." },
    { word: "haben", syl: "HA-ben", en: "to have", example: "Ich habe Zeit." },
    { word: "werden", syl: "WER-den", en: "to become", example: "Es wird kalt." },
    { word: "können", syl: "KÖN-nen", en: "to be able to", example: "Ich kann schwimmen." },
    { word: "müssen", syl: "MÜS-sen", en: "to have to", example: "Ich muss arbeiten." },
    { word: "wollen", syl: "WOL-len", en: "to want", example: "Ich will nach Hause." },
    { word: "machen", syl: "MA-chen", en: "to do/make", example: "Was machst du?" },
    { word: "gehen", syl: "GE-hen", en: "to go", example: "Wir gehen ins Kino." },
    { word: "kommen", syl: "KOM-men", en: "to come", example: "Kommst du mit?" },
    { word: "sagen", syl: "SA-gen", en: "to say", example: "Sag mir die Wahrheit." },
    { word: "sehen", syl: "SE-hen", en: "to see", example: "Ich sehe dich später." },
    { word: "wissen", syl: "WIS-sen", en: "to know (facts)", example: "Ich weiß es nicht." },
    { word: "finden", syl: "FIN-den", en: "to find", example: "Ich finde das gut." },
    { word: "geben", syl: "GE-ben", en: "to give", example: "Gib mir das Buch." },
    { word: "nehmen", syl: "NEH-men", en: "to take", example: "Nimm Platz." },
    { word: "denken", syl: "DEN-ken", en: "to think", example: "Ich denke an dich." },
    { word: "stehen", syl: "STE-hen", en: "to stand", example: "Der Bus steht da." },
    { word: "bleiben", syl: "BLEI-ben", en: "to stay", example: "Bleib ruhig." },
    { word: "liegen", syl: "LIE-gen", en: "to lie/be located", example: "Das Buch liegt auf dem Tisch." },
    { word: "sprechen", syl: "SPRE-chen", en: "to speak", example: "Sprichst du Deutsch?" },
    { word: "arbeiten", syl: "AR-bei-ten", en: "to work", example: "Ich arbeite von zu Hause." },
    { word: "spielen", syl: "SPIE-len", en: "to play", example: "Die Kinder spielen draußen." },
    { word: "brauchen", syl: "BRAU-chen", en: "to need", example: "Ich brauche Hilfe." },
    { word: "kaufen", syl: "KAU-fen", en: "to buy", example: "Ich kaufe Brot." },
    { word: "verstehen", syl: "ver-STE-hen", en: "to understand", example: "Verstehst du mich?" },
    { word: "beginnen", syl: "be-GIN-nen", en: "to begin", example: "Der Film beginnt jetzt." },
    { word: "erzählen", syl: "er-ZÄH-len", en: "to tell/narrate", example: "Erzähl mir eine Geschichte." },
    { word: "helfen", syl: "HEL-fen", en: "to help", example: "Kannst du mir helfen?" },
    { word: "fahren", syl: "FAH-ren", en: "to drive/travel", example: "Wir fahren nach Berlin." },
    { word: "fühlen", syl: "FÜH-len", en: "to feel", example: "Ich fühle mich gut." },
    { word: "die Zeit", syl: "die ZEIT", en: "time", example: "Ich habe keine Zeit." },
    { word: "der Tag", syl: "der TAG", en: "day", example: "Schönen Tag noch!" },
    { word: "das Jahr", syl: "das JAHR", en: "year", example: "Nächstes Jahr reisen wir." },
    { word: "die Frau", syl: "die FRAU", en: "woman/wife", example: "Das ist meine Frau." },
    { word: "der Mann", syl: "der MANN", en: "man/husband", example: "Der Mann dort ist nett." },
    { word: "das Kind", syl: "das KIND", en: "child", example: "Das Kind lacht." },
    { word: "die Hand", syl: "die HAND", en: "hand", example: "Gib mir die Hand." },
    { word: "der Kopf", syl: "der KOPF", en: "head", example: "Mein Kopf tut weh." },
    { word: "das Haus", syl: "das HAUS", en: "house", example: "Wir bauen ein Haus." },
    { word: "die Arbeit", syl: "die AR-beit", en: "work", example: "Die Arbeit macht Spaß." },
    { word: "der Freund", syl: "der FREUND", en: "friend (m)", example: "Er ist mein bester Freund." },
    { word: "die Frage", syl: "die FRA-ge", en: "question", example: "Ich habe eine Frage." },
    { word: "wichtig", syl: "WICH-tig", en: "important", example: "Das ist sehr wichtig." },
    { word: "möglich", syl: "MÖG-lich", en: "possible", example: "Ist das möglich?" },
    { word: "vielleicht", syl: "viel-LEICHT", en: "maybe", example: "Vielleicht komme ich später." },
    { word: "eigentlich", syl: "EI-gent-lich", en: "actually", example: "Eigentlich habe ich keine Zeit." },
    { word: "natürlich", syl: "na-TÜR-lich", en: "of course", example: "Natürlich helfe ich dir." },
    { word: "immer", syl: "IM-mer", en: "always", example: "Sie lächelt immer." },
    { word: "manchmal", syl: "MANCH-mal", en: "sometimes", example: "Manchmal regnet es." },
    { word: "trotzdem", syl: "TROTZ-dem", en: "nevertheless", example: "Es regnet, trotzdem gehe ich raus." },
    { word: "deshalb", syl: "DES-halb", en: "therefore", example: "Ich bin müde, deshalb gehe ich schlafen." },
    { word: "unbedingt", syl: "un-be-DINGT", en: "absolutely", example: "Das musst du unbedingt sehen." },
    { word: "besonders", syl: "be-SON-ders", en: "especially", example: "Ich mag besonders Musik." },
    { word: "gemeinsam", syl: "ge-MEIN-sam", en: "together", example: "Wir machen das gemeinsam." },
    { word: "endlich", syl: "END-lich", en: "finally", example: "Endlich Wochenende!" },
    { word: "plötzlich", syl: "PLÖTZ-lich", en: "suddenly", example: "Plötzlich klingelte das Telefon." },
    { word: "unterwegs", syl: "un-ter-WEGS", en: "on the way", example: "Ich bin gerade unterwegs." },
    { word: "gemütlich", syl: "ge-MÜT-lich", en: "cozy", example: "Das Café ist sehr gemütlich." },
    { word: "die Ausrede", syl: "die AUS-re-de", en: "excuse", example: "Das ist keine gute Ausrede." },
    { word: "die Erfahrung", syl: "die Er-FAH-rung", en: "experience", example: "Das war eine gute Erfahrung." },
    { word: "die Gelegenheit", syl: "die Ge-LE-gen-heit", en: "opportunity", example: "Nutze die Gelegenheit!" },
  ];

  // Kompass — Partikeln & Nuancen
  const PARTIKELN = [
    { word: "doch", explain: "Widerspruch, Bestätigung oder Nachdruck.", example: "„Kommst du nicht?“ – „Doch, ich komme!“", syl: "doch" },
    { word: "ja", explain: "Betont etwas als bekannt/offensichtlich.", example: "Das ist ja wunderschön hier!", syl: "ja" },
    { word: "denn", explain: "Macht Fragen freundlicher/interessierter.", example: "Wie geht es dir denn?", syl: "denn" },
    { word: "mal", explain: "Macht Aufforderungen beiläufiger, weniger streng.", example: "Komm mal her.", syl: "mal" },
    { word: "eben", explain: "Drückt Zustimmung zu einer nicht änderbaren Tatsache aus.", example: "So ist das eben.", syl: "E-ben" },
    { word: "halt", explain: "Ähnlich wie „eben“ — süddeutsch geprägt.", example: "Das ist halt so.", syl: "halt" },
    { word: "eigentlich", explain: "Leitet eine Einschränkung oder Themenwechsel ein.", example: "Eigentlich wollte ich früher gehen.", syl: "EI-gent-lich" },
    { word: "na ja", explain: "Zögern, leichte Skepsis oder Relativierung.", example: "Na ja, so toll war es auch nicht.", syl: "NA ja" },
    { word: "ach so", explain: "Plötzliches Verstehen.", example: "Ach so, jetzt verstehe ich!", syl: "ACH so" },
    { word: "tja", explain: "Resignation oder Ratlosigkeit.", example: "Tja, das war's dann wohl.", syl: "tja" },
    { word: "ruhig", explain: "Erlaubnis, etwas ohne Bedenken zu tun.", example: "Du kannst ruhig fragen.", syl: "RU-hig" },
    { word: "wohl", explain: "Vermutung, Unsicherheit.", example: "Das wird wohl stimmen.", syl: "wohl" },
  ];

  // Materialien — kompakte Grammatik-Referenzkarten
  const MATERIALS = [
    {
      title: "Peter und der Wolf",
      body: "Eine klassische Geschichte zum Deutschlernen — auf das Cover tippen, um die ganze Erzählung zu lesen.",
      type: "story",
      coverImage: "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/IMG_1206.jpeg?raw=true",
      fullImage: "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/08F0448F-C2C5-44E1-B80D-7BA5E0525FE9.png?raw=true",
    },
    {
      title: "Deutschland-Toolbox",
      body: "Eine visuelle Übersicht der wichtigsten Alltagsbegriffe — antippen für die Großansicht.",
      type: "preview",
      image: "https://github.com/XanderFoxy/Deutsch/blob/main/Bilder2/9C6B2BCE-2AE7-486A-B0F0-D62D1D3701EA.png?raw=true",
    },
    {
      title: "Die 4 Fälle (Kasus)",
      body: "Nominativ (wer/was — Subjekt), Akkusativ (wen/was — direktes Objekt), Dativ (wem — indirektes Objekt), Genitiv (wessen — Besitz). Beispiel: Der Mann (Nom.) gibt der Frau (Dat.) den Blumenstrauß (Akk.) des Nachbarn (Gen.).",
    },
    {
      title: "Verbstellung im Satz",
      body: "Hauptsatz: Verb an Position 2 (Ich gehe heute ins Kino). Nebensatz: Verb am Ende (…, weil ich heute ins Kino gehe). W-Frage: Verb an Position 2 nach dem Fragewort.",
    },
    {
      title: "Perfekt bilden",
      body: "haben/sein + Partizip II. Die meisten Verben nutzen „haben“. „Sein“ nutzen Bewegungsverben (gehen, fahren, kommen) und Zustandsänderungen (aufwachen, sterben, werden).",
    },
    {
      title: "Adjektivendungen (Grundmuster)",
      body: "Nach „der/die/das“: schwache Endung meist -e/-en. Nach „ein/kein“ + Possessiv: gemischte Deklination. Ohne Artikel: starke Endung, die den Artikel „ersetzt“.",
    },
  ];

  // Kompass — kleine Auswahl beliebter Redewendungen (Kurzüberblick;
  // die vollständigen 30 mit Multiple-Choice-Abfrage stecken in der Übungskategorie "Redewendungen")
  const REDEWENDUNGEN_KURZ = [
    { phrase: "Da liegt der Hund begraben.", explain: "Das ist der eigentliche Grund für ein Problem.", example: "Ah, da liegt also der Hund begraben!" },
    { phrase: "Die Daumen drücken.", explain: "Jemandem Glück wünschen.", example: "Ich drück dir die Daumen für die Prüfung." },
    { phrase: "Ins kalte Wasser springen.", explain: "Etwas Neues ohne viel Vorbereitung wagen.", example: "Beim neuen Job bin ich einfach ins kalte Wasser gesprungen." },
    { phrase: "Die Nase voll haben.", explain: "Von etwas genervt sein.", example: "Ich hab die Nase voll von dem Regen." },
    { phrase: "Schwein haben.", explain: "Glück haben.", example: "Da hast du aber Schwein gehabt!" },
    { phrase: "Kein Blatt vor den Mund nehmen.", explain: "Offen und direkt seine Meinung sagen.", example: "Sie nimmt nie ein Blatt vor den Mund." },
  ];

  // Kompass — Umgangssprache & Jugendsprache
  const JUGENDSPRACHE = [
    { word: "chillen", explain: "sich entspannen, nichts tun", example: "Lass uns heute einfach chillen." },
    { word: "Digga / Alter", explain: "lockere, freundschaftliche Anrede", example: "Was geht, Digga?" },
    { word: "Bock haben (auf)", explain: "Lust haben auf etwas", example: "Ich hab keinen Bock auf Hausaufgaben." },
    { word: "flexen", explain: "mit etwas angeben, protzen", example: "Er flext mit seinem neuen Handy." },
    { word: "krass", explain: "beeindruckend oder heftig (positiv wie negativ)", example: "Das war echt krass, dieser Film!" },
    { word: "läuft bei dir", explain: "anerkennende Reaktion auf etwas Gutes", example: "Neuer Job? Läuft bei dir!" },
    { word: "cringe", explain: "fremdschämen, unangenehm peinlich", example: "Der Auftritt war so cringe." },
    { word: "Babo", explain: "der Chef, die Anführerin/der Anführer", example: "Sie ist die Babo in der Gruppe." },
    { word: "auf jeden (Fall)", explain: "klare Zustimmung", example: "Kommst du mit? – Auf jeden!" },
    { word: "sus", explain: "verdächtig, komisch (aus dem Spiel Among Us)", example: "Der Typ ist voll sus." },
    { word: "Sigma", explain: "(ironisch) ein unabhängiger, cooler Typ", example: "Er tut so, als wäre er der Sigma der Klasse." },
    { word: "low-key", explain: "irgendwie, ein bisschen, heimlich", example: "Ich bin low-key genervt davon." },
    { word: "high-key", explain: "total, ganz offensichtlich", example: "Ich hab high-key keine Lust mehr." },
    { word: "Aura", explain: "Ausstrahlung/Coolness-Punkte (oft ironisch gezählt)", example: "Das hat ihm richtig Aura gebracht." },
    { word: "goofy", explain: "albern, tollpatschig auf sympathische Art", example: "Er ist manchmal richtig goofy." },
    { word: "NPC", explain: "jemand, der sich uninteressant/vorhersehbar verhält", example: "Hör auf, dich wie ein NPC zu verhalten." },
    { word: "mid", explain: "mittelmäßig, nicht besonders gut", example: "Der Film war ehrlich gesagt mid." },
    { word: "Rizz", explain: "Charisma, Charme beim Flirten", example: "Er hat einfach Rizz." },
    { word: "krank (positiv gemeint)", explain: "beeindruckend, verrückt gut", example: "Das Konzert war einfach krank." },
    { word: "based", explain: "(ironisch) mutig die eigene Meinung vertretend, cool", example: "Ehrliche Antwort, das ist based." },
  ];

  // Hobbys & Interessen fürs Profil — bewusst mit Artikel gezeigt,
  // damit man das Genus nebenbei mitlernt (kleiner Lern-Kniff).
  // Herkunftsländer fürs Profil — Land + Sprache, damit man sieht wer woher kommt
  const COUNTRIES = [
    { name: "Deutschland", flag: "🇩🇪", syl: "DEUTSCH-land" }, { name: "Österreich", flag: "🇦🇹", syl: "ÖS-ter-reich" }, { name: "Schweiz", flag: "🇨🇭", syl: "Schweiz" },
    { name: "Türkei", flag: "🇹🇷", syl: "Tür-KEI" }, { name: "Polen", flag: "🇵🇱", syl: "PO-len" }, { name: "Ukraine", flag: "🇺🇦", syl: "Ukra-I-ne" },
    { name: "Russland", flag: "🇷🇺", syl: "RUSS-land" }, { name: "Syrien", flag: "🇸🇾", syl: "SY-ri-en" }, { name: "Afghanistan", flag: "🇦🇫", syl: "Af-GHA-ni-stan" },
    { name: "Italien", flag: "🇮🇹", syl: "I-TA-li-en" }, { name: "Spanien", flag: "🇪🇸", syl: "SPA-ni-en" }, { name: "Frankreich", flag: "🇫🇷", syl: "FRANK-reich" },
    { name: "Griechenland", flag: "🇬🇷", syl: "GRIE-chen-land" }, { name: "Portugal", flag: "🇵🇹", syl: "POR-tu-gal" }, { name: "Rumänien", flag: "🇷🇴", syl: "Ru-MÄ-ni-en" },
    { name: "Vereinigtes Königreich", flag: "🇬🇧", syl: "Ver-EI-nig-tes KÖ-nig-reich" }, { name: "USA", flag: "🇺🇸", syl: "U-S-A" }, { name: "Brasilien", flag: "🇧🇷", syl: "Bra-SI-li-en" },
    { name: "Indien", flag: "🇮🇳", syl: "IN-di-en" }, { name: "China", flag: "🇨🇳", syl: "CHI-na" }, { name: "Japan", flag: "🇯🇵", syl: "JA-pan" },
    { name: "Vietnam", flag: "🇻🇳", syl: "Viet-NAM" }, { name: "Marokko", flag: "🇲🇦", syl: "Ma-ROK-ko" }, { name: "Nigeria", flag: "🇳🇬", syl: "Ni-GE-ri-a" },
    { name: "Sonstiges", flag: "🌍", syl: "SON-sti-ges" },
  ];

  const HOBBIES = [
    { noun: "Kunst", article: "die", emoji: "🎨", syl: "Kunst" },
    { noun: "Sport", article: "der", emoji: "⚽", syl: "Sport" },
    { noun: "Lesen", article: "das", emoji: "📚", syl: "LE-sen" },
    { noun: "Musik", article: "die", emoji: "🎵", syl: "Mu-SIK" },
    { noun: "Kochen", article: "das", emoji: "🍳", syl: "KO-chen" },
    { noun: "Reisen", article: "das", emoji: "✈️", syl: "REI-sen" },
    { noun: "Fotografie", article: "die", emoji: "📷", syl: "Foto-gra-FIE" },
    { noun: "Tanzen", article: "das", emoji: "💃", syl: "TAN-zen" },
    { noun: "Natur", article: "die", emoji: "🌳", syl: "Na-TUR" },
    { noun: "Gaming", article: "das", emoji: "🎮", syl: "GEI-ming" },
    { noun: "Yoga", article: "das", emoji: "🧘", syl: "YO-ga" },
    { noun: "Handarbeit", article: "die", emoji: "🧵", syl: "HAND-ar-beit" },
    { noun: "Backen", article: "das", emoji: "🧁", syl: "BA-cken" },
    { noun: "Gartenarbeit", article: "die", emoji: "🌱", syl: "GAR-ten-ar-beit" },
  ];

  const LINKS = [
    { title: "Duden", url: "https://www.duden.de", desc: "Rechtschreibung, Grammatik & Bedeutungen nachschlagen." },
    { title: "DWDS", url: "https://www.dwds.de", desc: "Digitales Wörterbuch der deutschen Sprache." },
    { title: "Goethe-Institut", url: "https://www.goethe.de", desc: "Offizielle Sprachkurse & Prüfungsvorbereitung." },
    { title: "Deutsche Welle – Deutsch lernen", url: "https://www.dw.com/de/deutsch-lernen/s-2055", desc: "Kostenlose Kurse, Podcasts & Nachrichten in einfacher Sprache." },
    { title: "Redensarten-Index", url: "https://www.redensarten-index.de", desc: "Nachschlagewerk für deutsche Redewendungen und ihre Bedeutung." },
    { title: "Reverso Context", url: "https://context.reverso.net/übersetzung/deutsch-englisch/", desc: "Wörter und Redewendungen in echten Beispielsätzen nachschlagen." },
    { title: "Bundeskampf", url: "https://www.bundeskampf.com", desc: "Augenzwinkerndes Browsergame über die deutschen Bundesländer — mit Gartenzwergen als Sammelobjekt." },
  ];

  // Sprachen fürs Profil — welche Sprachen jemand spricht oder gerade lernt
  const LANGUAGES = [
    "Deutsch", "Englisch", "Französisch", "Spanisch", "Italienisch", "Portugiesisch",
    "Türkisch", "Arabisch", "Hebräisch", "Russisch", "Polnisch", "Niederländisch", "Persisch/Farsi",
    "Kurdisch", "Ukrainisch", "Griechisch", "Chinesisch", "Japanisch", "Koreanisch", "Hindi",
    "Schwedisch", "Norwegisch", "Dänisch", "Finnisch", "Rumänisch", "Bulgarisch", "Tschechisch",
    "Serbisch/Kroatisch", "Albanisch", "Vietnamesisch", "Thailändisch", "Suaheli", "Urdu",
  ];
  // Betonung der Sprachnamen (Duden-Muster) — für die Betonungs-Anzeige im ganzen Wortschatz
  const LANGUAGE_SYL = {
    "Deutsch": "Deutsch", "Englisch": "ENG-lisch", "Französisch": "Fran-ZÖ-sisch", "Spanisch": "SPA-nisch",
    "Italienisch": "I-ta-LIE-nisch", "Portugiesisch": "Por-tu-GIE-sisch", "Türkisch": "TÜR-kisch",
    "Arabisch": "A-RA-bisch", "Hebräisch": "He-BRÄ-isch", "Russisch": "RUS-sisch", "Polnisch": "POL-nisch",
    "Niederländisch": "NIE-der-län-disch", "Persisch/Farsi": "PER-sisch/FAR-si", "Kurdisch": "KUR-disch",
    "Ukrainisch": "U-kra-I-nisch", "Griechisch": "GRIE-chisch", "Chinesisch": "Chi-NE-sisch",
    "Japanisch": "Ja-PA-nisch", "Koreanisch": "Ko-re-A-nisch", "Hindi": "HIN-di", "Schwedisch": "SCHWE-disch",
    "Norwegisch": "Nor-WE-gisch", "Dänisch": "DÄ-nisch", "Finnisch": "FIN-nisch", "Rumänisch": "Ru-MÄ-nisch",
    "Bulgarisch": "Bul-GA-risch", "Tschechisch": "TSCHE-chisch", "Serbisch/Kroatisch": "SER-bisch/Kro-A-tisch",
    "Albanisch": "Al-BA-nisch", "Vietnamesisch": "Viet-na-ME-sisch", "Thailändisch": "Thai-LÄN-disch",
    "Suaheli": "Sua-HE-li", "Urdu": "Ur-DU",
  };

  return { WORDS, PARTIKELN, REDEWENDUNGEN_KURZ, JUGENDSPRACHE, MATERIALS, LINKS, HOBBIES, COUNTRIES, LANGUAGES, LANGUAGE_SYL };
})();
