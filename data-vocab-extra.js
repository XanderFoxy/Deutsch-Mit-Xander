/* ============================================================
   Wörterbuch — Nachtrag für höhere Niveaus (C1/C2) und neue Themen
   ------------------------------------------------------------
   Anders als der Grundbestand tragen diese Einträge ihr Niveau und ihr
   Thema ausdrücklich bei sich (level / theme), statt vom Programm
   geschätzt zu werden. Wo ein Wort hier steht, gilt diese Angabe.

   Felder:
     word    Stichwort (Substantive mit Artikel)
     syl     Silbentrennung mit GROSSGESCHRIEBENER Betonungssilbe
     de      deutsche Erklärung
     en      englische Entsprechung
     example natürlicher Beispielsatz
     level   A1 | A2 | B1 | B2 | C1 | C2
     theme   Themenbereich für den Filter
   ============================================================ */
window.VOCAB_STAND = "2026-09-04T12:55";

window.VOCAB_EXTRA = [
  /* ---------- Denken & Argumentieren ---------- */
  { word: "die These", syl: "THE-se", de: "eine Behauptung, die man begründen will", en: "thesis, claim", example: "Seine These überzeugt mich nicht.", level: "C1", theme: "Denken & Argumentieren" },
  { word: "der Einwand", syl: "EIN-wand", de: "ein Gegenargument gegen eine Aussage", en: "objection", example: "Dein Einwand ist berechtigt.", level: "C1", theme: "Denken & Argumentieren" },
  { word: "die Voraussetzung", syl: "VOR-aus-set-zung", de: "etwas, das erfüllt sein muss, damit etwas anderes möglich ist", en: "prerequisite", example: "Vertrauen ist die Voraussetzung für jede Zusammenarbeit.", level: "C1", theme: "Denken & Argumentieren" },
  { word: "der Widerspruch", syl: "WI-der-spruch", de: "zwei Aussagen, die sich gegenseitig ausschließen", en: "contradiction", example: "Das ist ein Widerspruch in sich.", level: "C1", theme: "Denken & Argumentieren" },
  { word: "die Schlussfolgerung", syl: "SCHLUSS-fol-ge-rung", de: "das, was sich logisch aus etwas ergibt", en: "conclusion", example: "Aus den Zahlen lässt sich nur eine Schlussfolgerung ziehen.", level: "C1", theme: "Denken & Argumentieren" },
  { word: "die Ambivalenz", syl: "Am-bi-va-LENZ", de: "das gleichzeitige Vorhandensein gegensätzlicher Gefühle oder Bewertungen", en: "ambivalence", example: "Seine Haltung ist von großer Ambivalenz geprägt.", level: "C2", theme: "Denken & Argumentieren" },
  { word: "die Prämisse", syl: "Prä-MIS-se", de: "die Annahme, von der eine Überlegung ausgeht", en: "premise", example: "Die ganze Rechnung steht und fällt mit dieser Prämisse.", level: "C2", theme: "Denken & Argumentieren" },
  { word: "der Trugschluss", syl: "TRUG-schluss", de: "eine Folgerung, die falsch ist, obwohl sie richtig wirkt", en: "fallacy", example: "Das ist ein klassischer Trugschluss.", level: "C2", theme: "Denken & Argumentieren" },
  { word: "die Nuance", syl: "Nu-AN-ce", de: "ein feiner Unterschied", en: "nuance", example: "In dieser Frage kommt es auf die Nuancen an.", level: "C2", theme: "Denken & Argumentieren" },
  { word: "beiläufig", syl: "BEI-läu-fig", de: "nebenbei, ohne besondere Betonung", en: "casual, in passing", example: "Er erwähnte es nur beiläufig.", level: "C1", theme: "Denken & Argumentieren" },

  /* ---------- Politik & Gesellschaft ---------- */
  { word: "die Zuständigkeit", syl: "ZU-stän-dig-keit", de: "die Frage, wer für etwas verantwortlich ist", en: "responsibility, jurisdiction", example: "Dafür liegt die Zuständigkeit beim Land, nicht beim Bund.", level: "C1", theme: "Politik & Gesellschaft" },
  { word: "der Kompromiss", syl: "Kom-pro-MISS", de: "eine Lösung, bei der beide Seiten nachgeben", en: "compromise", example: "Am Ende fanden sie doch einen Kompromiss.", level: "B2", theme: "Politik & Gesellschaft" },
  { word: "die Mehrheit", syl: "MEHR-heit", de: "der größere Teil einer Gruppe", en: "majority", example: "Der Antrag fand keine Mehrheit.", level: "B1", theme: "Politik & Gesellschaft" },
  { word: "die Gewaltenteilung", syl: "Ge-WAL-ten-tei-lung", de: "die Aufteilung staatlicher Macht auf Parlament, Regierung und Gerichte", en: "separation of powers", example: "Die Gewaltenteilung schützt vor Machtmissbrauch.", level: "C1", theme: "Politik & Gesellschaft" },
  { word: "die Teilhabe", syl: "TEIL-ha-be", de: "die Möglichkeit, am gesellschaftlichen Leben mitzuwirken", en: "participation", example: "Bildung ist der Schlüssel zur Teilhabe.", level: "C1", theme: "Politik & Gesellschaft" },
  { word: "der Konsens", syl: "Kon-SENS", de: "eine Übereinstimmung, die alle mittragen", en: "consensus", example: "In dieser Frage gibt es einen breiten Konsens.", level: "C1", theme: "Politik & Gesellschaft" },
  { word: "die Legitimation", syl: "Le-gi-ti-ma-TION", de: "die Berechtigung, im Namen anderer zu handeln", en: "legitimacy", example: "Ohne Wahl fehlt der Regierung jede Legitimation.", level: "C2", theme: "Politik & Gesellschaft" },
  { word: "der Populismus", syl: "Po-pu-LIS-mus", de: "Politik, die einfache Antworten gegen „die da oben“ verspricht", en: "populism", example: "Populismus lebt davon, komplexe Fragen zu vereinfachen.", level: "C2", theme: "Politik & Gesellschaft" },
  { word: "die Zivilcourage", syl: "Zi-VIL-cou-ra-ge", de: "der Mut, öffentlich für das Richtige einzustehen", en: "moral courage", example: "Es hätte nur ein bisschen Zivilcourage gebraucht.", level: "C1", theme: "Politik & Gesellschaft" },

  /* ---------- Wirtschaft & Arbeit ---------- */
  { word: "die Rücklage", syl: "RÜCK-la-ge", de: "Geld, das für später zurückgelegt wird", en: "reserve, savings", example: "Ohne Rücklagen wird jede Reparatur zum Problem.", level: "B2", theme: "Wirtschaft & Arbeit" },
  { word: "die Kündigungsfrist", syl: "KÜN-di-gungs-frist", de: "die Zeit zwischen Kündigung und tatsächlichem Ende", en: "notice period", example: "Meine Kündigungsfrist beträgt drei Monate.", level: "B2", theme: "Wirtschaft & Arbeit" },
  { word: "die Fachkraft", syl: "FACH-kraft", de: "jemand mit abgeschlossener Ausbildung in einem Beruf", en: "skilled worker", example: "Der Betrieb sucht dringend Fachkräfte.", level: "B2", theme: "Wirtschaft & Arbeit" },
  { word: "die Wertschöpfung", syl: "WERT-schöp-fung", de: "der Wert, der in einem Betrieb zusätzlich entsteht", en: "value creation", example: "Die eigentliche Wertschöpfung findet hier im Haus statt.", level: "C1", theme: "Wirtschaft & Arbeit" },
  { word: "die Rentabilität", syl: "Ren-ta-bi-li-TÄT", de: "das Verhältnis von Ertrag zu eingesetztem Geld", en: "profitability", example: "Die Rentabilität des Projekts ist fraglich.", level: "C1", theme: "Wirtschaft & Arbeit" },
  { word: "die Konjunktur", syl: "Kon-junk-TUR", de: "die allgemeine wirtschaftliche Lage in einem Zeitraum", en: "economic situation", example: "Die Konjunktur zieht langsam wieder an.", level: "C1", theme: "Wirtschaft & Arbeit" },
  { word: "die Betriebsvereinbarung", syl: "Be-TRIEBS-ver-ein-ba-rung", de: "eine verbindliche Absprache zwischen Firma und Betriebsrat", en: "works agreement", example: "Das ist in der Betriebsvereinbarung geregelt.", level: "C2", theme: "Wirtschaft & Arbeit" },
  { word: "der Engpass", syl: "ENG-pass", de: "eine Stelle, an der etwas knapp wird und alles stockt", en: "bottleneck", example: "Der Engpass liegt nicht beim Material, sondern beim Personal.", level: "C1", theme: "Wirtschaft & Arbeit" },

  /* ---------- Recht & Verwaltung ---------- */
  { word: "der Antrag", syl: "AN-trag", de: "eine schriftliche Bitte an eine Behörde", en: "application", example: "Der Antrag muss bis Freitag eingereicht sein.", level: "B1", theme: "Recht & Verwaltung" },
  { word: "die Frist", syl: "Frist", de: "ein Zeitraum, in dem etwas erledigt sein muss", en: "deadline", example: "Die Frist läuft am Monatsende ab.", level: "B1", theme: "Recht & Verwaltung" },
  { word: "der Bescheid", syl: "Be-SCHEID", de: "die schriftliche Entscheidung einer Behörde", en: "official notice", example: "Der Bescheid kam nach sechs Wochen.", level: "B2", theme: "Recht & Verwaltung" },
  { word: "der Einspruch", syl: "EIN-spruch", de: "der offizielle Widerspruch gegen eine Entscheidung", en: "formal objection", example: "Gegen den Bescheid kannst du Einspruch erheben.", level: "B2", theme: "Recht & Verwaltung" },
  { word: "die Auflage", syl: "AUF-la-ge", de: "eine Bedingung, die man zusätzlich erfüllen muss", en: "condition, requirement", example: "Die Genehmigung gilt nur unter strengen Auflagen.", level: "C1", theme: "Recht & Verwaltung" },
  { word: "die Verjährung", syl: "Ver-JÄH-rung", de: "das Ablaufen einer Frist, nach der ein Anspruch nicht mehr gilt", en: "statute of limitations", example: "Der Anspruch unterliegt der Verjährung.", level: "C2", theme: "Recht & Verwaltung" },
  { word: "die Zumutbarkeit", syl: "ZU-mut-bar-keit", de: "die Frage, was man jemandem billigerweise abverlangen kann", en: "reasonableness", example: "Hier stellt sich die Frage der Zumutbarkeit.", level: "C2", theme: "Recht & Verwaltung" },

  /* ---------- Wissenschaft & Forschung ---------- */
  { word: "die Hypothese", syl: "Hy-po-THE-se", de: "eine Vermutung, die man überprüfen will", en: "hypothesis", example: "Die Hypothese ließ sich im Versuch nicht bestätigen.", level: "C1", theme: "Wissenschaft & Forschung" },
  { word: "der Nachweis", syl: "NACH-weis", de: "der Beleg dafür, dass etwas stimmt", en: "proof, evidence", example: "Für diese Behauptung fehlt bislang jeder Nachweis.", level: "B2", theme: "Wissenschaft & Forschung" },
  { word: "die Stichprobe", syl: "STICH-pro-be", de: "eine kleine Auswahl, die für das Ganze stehen soll", en: "sample", example: "Die Stichprobe war zu klein für eine Aussage.", level: "C1", theme: "Wissenschaft & Forschung" },
  { word: "reproduzierbar", syl: "re-pro-du-ZIER-bar", de: "so, dass andere zum selben Ergebnis kommen", en: "reproducible", example: "Ein Ergebnis zählt erst, wenn es reproduzierbar ist.", level: "C2", theme: "Wissenschaft & Forschung" },
  { word: "die Wechselwirkung", syl: "WECH-sel-wir-kung", de: "die gegenseitige Beeinflussung zweier Dinge", en: "interaction", example: "Zwischen beiden Faktoren besteht eine Wechselwirkung.", level: "C1", theme: "Wissenschaft & Forschung" },
  { word: "die Entropie", syl: "En-tro-PIE", de: "ein Maß für Unordnung in einem System", en: "entropy", example: "Die Entropie eines geschlossenen Systems nimmt zu.", level: "C2", theme: "Wissenschaft & Forschung" },

  /* ---------- Sprache & Kommunikation ---------- */
  { word: "die Andeutung", syl: "AN-deu-tung", de: "ein Hinweis, der etwas nur vorsichtig anspricht", en: "hint, allusion", example: "Sie machte nur eine Andeutung, mehr nicht.", level: "C1", theme: "Sprache & Kommunikation" },
  { word: "der Beiklang", syl: "BEI-klang", de: "die zusätzliche Bedeutung, die ein Wort mitschwingen lässt", en: "connotation", example: "Das Wort hat einen unangenehmen Beiklang.", level: "C2", theme: "Sprache & Kommunikation" },
  { word: "die Redewendung", syl: "RE-de-wen-dung", de: "ein fester Ausdruck, dessen Sinn man nicht wörtlich versteht", en: "idiom", example: "„Die Nase voll haben“ ist eine Redewendung.", level: "B2", theme: "Sprache & Kommunikation" },
  { word: "das Missverständnis", syl: "MISS-ver-ständ-nis", de: "wenn zwei etwas unterschiedlich verstehen", en: "misunderstanding", example: "Das war ein reines Missverständnis.", level: "B1", theme: "Sprache & Kommunikation" },
  { word: "die Wortwahl", syl: "WORT-wahl", de: "die Entscheidung, welche Wörter man benutzt", en: "choice of words", example: "Auf die Wortwahl kommt es hier besonders an.", level: "B2", theme: "Sprache & Kommunikation" },
  { word: "die Verbindlichkeit", syl: "Ver-BIND-lich-keit", de: "wie verlässlich und ernst gemeint eine Zusage ist", en: "commitment, bindingness", example: "Der Absprache fehlt jede Verbindlichkeit.", level: "C1", theme: "Sprache & Kommunikation" },

  /* ---------- Umwelt & Klima ---------- */
  { word: "die Nachhaltigkeit", syl: "NACH-hal-tig-keit", de: "so wirtschaften, dass auch später noch genug da ist", en: "sustainability", example: "Nachhaltigkeit ist mehr als ein Werbewort.", level: "B2", theme: "Umwelt & Klima" },
  { word: "der Kreislauf", syl: "KREIS-lauf", de: "ein Ablauf, der immer wieder zum Anfang zurückkehrt", en: "cycle", example: "Wasser bewegt sich in einem geschlossenen Kreislauf.", level: "B2", theme: "Umwelt & Klima" },
  { word: "die Artenvielfalt", syl: "AR-ten-viel-falt", de: "die Zahl verschiedener Tier- und Pflanzenarten in einem Gebiet", en: "biodiversity", example: "Die Artenvielfalt nimmt seit Jahren ab.", level: "C1", theme: "Umwelt & Klima" },
  { word: "der Fußabdruck", syl: "FUSS-ab-druck", de: "hier: wie stark jemand die Umwelt belastet", en: "footprint", example: "Der ökologische Fußabdruck lässt sich ausrechnen.", level: "C1", theme: "Umwelt & Klima" },
  { word: "die Kipppunkte", syl: "KIPP-punk-te", de: "Schwellen, ab denen eine Entwicklung nicht mehr umkehrbar ist", en: "tipping points", example: "Forscher warnen vor mehreren Kipppunkten im Klimasystem.", level: "C2", theme: "Umwelt & Klima" },

  /* ---------- Gefühle & Charakter ---------- */
  { word: "die Gelassenheit", syl: "Ge-LAS-sen-heit", de: "die Ruhe, sich nicht aus der Fassung bringen zu lassen", en: "composure", example: "Ich bewundere ihre Gelassenheit in solchen Situationen.", level: "C1", theme: "Gefühle & Charakter" },
  { word: "die Beharrlichkeit", syl: "Be-HARR-lich-keit", de: "das Durchhalten, auch wenn es lange dauert", en: "persistence", example: "Mit Beharrlichkeit kommt man weiter als mit Talent.", level: "C1", theme: "Gefühle & Charakter" },
  { word: "die Nachsicht", syl: "NACH-sicht", de: "die Bereitschaft, Fehler milder zu beurteilen", en: "leniency", example: "Ich bitte um Nachsicht, es war ein langer Tag.", level: "C1", theme: "Gefühle & Charakter" },
  { word: "die Wehmut", syl: "WEH-mut", de: "eine leise Traurigkeit beim Gedanken an Vergangenes", en: "melancholy", example: "Mit einer gewissen Wehmut schloss er die Tür ab.", level: "C2", theme: "Gefühle & Charakter" },
  { word: "die Zerrissenheit", syl: "Zer-RIS-sen-heit", de: "das Gefühl, innerlich in zwei Richtungen gezogen zu werden", en: "inner conflict", example: "Seine Briefe zeugen von großer Zerrissenheit.", level: "C2", theme: "Gefühle & Charakter" },
  { word: "der Übermut", syl: "Ü-ber-mut", de: "eine ausgelassene Stimmung, die leicht zu weit geht", en: "high spirits, recklessness", example: "Im Übermut hat er die Wette angenommen.", level: "C1", theme: "Gefühle & Charakter" },

  /* ---------- Medien & Öffentlichkeit ---------- */
  { word: "die Reichweite", syl: "REICH-wei-te", de: "wie viele Menschen etwas erreicht", en: "reach", example: "Der Beitrag hatte eine erstaunliche Reichweite.", level: "B2", theme: "Medien & Öffentlichkeit" },
  { word: "die Glaubwürdigkeit", syl: "GLAUB-wür-dig-keit", de: "wie sehr man jemandem oder etwas vertrauen kann", en: "credibility", example: "Ein einziger Fehler kann die Glaubwürdigkeit kosten.", level: "C1", theme: "Medien & Öffentlichkeit" },
  { word: "die Quelle", syl: "QUEL-le", de: "der Ursprung einer Information", en: "source", example: "Nenn mir bitte deine Quelle.", level: "B1", theme: "Medien & Öffentlichkeit" },
  { word: "die Deutungshoheit", syl: "DEU-tungs-ho-heit", de: "die Macht darüber, wie etwas verstanden wird", en: "interpretive authority", example: "Es ging beiden Seiten um die Deutungshoheit.", level: "C2", theme: "Medien & Öffentlichkeit" },
  { word: "der Sachverhalt", syl: "SACH-ver-halt", de: "die tatsächliche Lage, um die es geht", en: "state of affairs", example: "Schildern Sie bitte den Sachverhalt.", level: "C1", theme: "Medien & Öffentlichkeit" }
];
