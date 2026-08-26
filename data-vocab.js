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
    { word: "doch", explain: "Widerspruch, Bestätigung oder Nachdruck.", example: "„Kommst du nicht?“ – „Doch, ich komme!“" },
    { word: "ja", explain: "Betont etwas als bekannt/offensichtlich.", example: "Das ist ja wunderschön hier!" },
    { word: "denn", explain: "Macht Fragen freundlicher/interessierter.", example: "Wie geht es dir denn?" },
    { word: "mal", explain: "Macht Aufforderungen beiläufiger, weniger streng.", example: "Komm mal her." },
    { word: "eben", explain: "Drückt Zustimmung zu einer nicht änderbaren Tatsache aus.", example: "So ist das eben." },
    { word: "halt", explain: "Ähnlich wie „eben“ — süddeutsch geprägt.", example: "Das ist halt so." },
    { word: "eigentlich", explain: "Leitet eine Einschränkung oder Themenwechsel ein.", example: "Eigentlich wollte ich früher gehen." },
    { word: "na ja", explain: "Zögern, leichte Skepsis oder Relativierung.", example: "Na ja, so toll war es auch nicht." },
    { word: "ach so", explain: "Plötzliches Verstehen.", example: "Ach so, jetzt verstehe ich!" },
    { word: "tja", explain: "Resignation oder Ratlosigkeit.", example: "Tja, das war's dann wohl." },
    { word: "ruhig", explain: "Erlaubnis, etwas ohne Bedenken zu tun.", example: "Du kannst ruhig fragen." },
    { word: "wohl", explain: "Vermutung, Unsicherheit.", example: "Das wird wohl stimmen." },
  ];

  // Materialien — kompakte Grammatik-Referenzkarten
  const MATERIALS = [
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

  const LINKS = [
    { title: "Duden", url: "https://www.duden.de", desc: "Rechtschreibung, Grammatik & Bedeutungen nachschlagen." },
    { title: "DWDS", url: "https://www.dwds.de", desc: "Digitales Wörterbuch der deutschen Sprache." },
    { title: "Goethe-Institut", url: "https://www.goethe.de", desc: "Offizielle Sprachkurse & Prüfungsvorbereitung." },
    { title: "Deutsche Welle – Deutsch lernen", url: "https://www.dw.com/de/deutsch-lernen/s-2055", desc: "Kostenlose Kurse, Podcasts & Nachrichten in einfacher Sprache." },
  ];

  return { WORDS, PARTIKELN, MATERIALS, LINKS };
})();
