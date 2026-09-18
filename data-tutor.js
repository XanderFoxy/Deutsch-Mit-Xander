/* =========================================================
   DER TUTOR — was Alex in jedem Bereich sagt
   ---------------------------------------------------------
   GEWUENSCHT: „Kriegst du das auch hin, dass der Tutor,
   waehrend er spricht, bei den Sektionen, von denen er
   spricht, dass die kurz hervorgehoben werden in dem Moment,
   wenn er die anspricht — also von der Zeit her, dass sie dann
   so markiert dastehen, dass jeder weiss: okay, wenn ich da
   drauf klicke, finde ich das. Da musst du das wahrscheinlich
   ausmessen, weil das, in welcher Zeit er das sagt."

   WARUM ES HIER NICHT AUSGEMESSEN WIRD — SONDERN GENAU IST
   Man koennte eine lange Aufnahme nehmen und schaetzen, wann
   darin welches Wort faellt. Das waere geraten: Alex macht
   Pausen, betont unterschiedlich, und nach dem dritten
   Nebensatz stimmt keine Rechnung mehr. Ich habe es mit einer
   Transkription versucht — die gibt den Text zurueck, aber
   keine Wort-Zeitstempel.

   Deshalb ist es anders geloest: JEDER SATZ IST EINE EIGENE
   AUFNAHME. Damit ist die Zeit kein Schaetzwert mehr, sondern
   der Sachverhalt selbst — solange das Stueck laeuft, ist
   genau dessen Bereich hervorgehoben. Laenger nicht, kuerzer
   auch nicht. Und es hat einen zweiten Vorteil: zu jedem
   Stueck kann eine eigene Hilfe und ein eigener Sprungknopf
   gehoeren.

   FELDER EINES STUECKS
     text  — was Alex sagt (steht auch in der Sprechblase)
     ton   — Dateiname unter tutor/ ohne Endung. Fehlt die
             Datei, steht der Text trotzdem da und das Stueck
             laeuft nach Lesezeit weiter. Kein stummer Tutor.
     ziel  — der Unterreiter, der so lange hervorgehoben wird
             (data-sub in index.html). Leer = nichts markieren.
     hilfe — ein Satz mehr, den man sich aufklappen kann.
   ========================================================= */
window.DMA_TUTOR = {
  "view-about": {
    stuecke: [
      { ton: "ueber-01", ziel: "",
        text: "Schön, dass du da bist! Ich bin Alex — Musiker und Deutschlehrer." },
      { ton: "ueber-02", ziel: "",
        text: "Diese Seite baue ich in meiner Freizeit, weil ich glaube, dass man eine Sprache nicht mit trockenem Frontalunterricht lernt, sondern mit kurzen Übungen, die Spaß machen. Schau dich in Ruhe um." },
    ],
  },

  "view-learn": {
    stuecke: [
      { ton: "lern-00", ziel: "",
        text: "Willkommen im Lernbereich! Hier findest du Übungen zur deutschen Sprache und Spiele, die dir die Motivation zum Lernen geben." },
      { ton: "lern-01", ziel: "sub-exercises",
        text: "Bei den Übungen trainierst du nach Thema und Sprachniveau — Artikel, Bedeutung, Schreibweise.",
        hilfe: "Du wählst Kategorie und Niveau, und bekommst daraus eine Runde. Deine eigenen gemerkten Wörter kannst du dazunehmen." },
      { ton: "lern-02", ziel: "sub-games",
        text: "In den Spielen übst du dasselbe, nur als Spiel — Memory, Wortkanone, Buchstabensalat und mehr.",
        hilfe: "Die Spiele schalten sich nach und nach frei, je mehr du übst." },
      { ton: "lern-03", ziel: "sub-erste-schritte",
        text: "Die Ersten Schritte führen dich als Neuling in die Sprache hinein.",
        hilfe: "Begrüßung, Zahlen, die ersten Sätze — alles, was man am ersten Tag braucht." },
      { ton: "lern-04", ziel: "sub-grammatik",
        text: "Bei der Grammatik stehen die Regeln, die du brauchst, um Deutsch richtig zu sprechen.",
        hilfe: "Fälle, Zeiten, Wortstellung — jeweils mit Beispielen statt mit Fachwörtern." },
      { ton: "lern-05", ziel: "sub-satzbaukasten-de",
        text: "Im Satzbaukasten bekommst du ein Gefühl dafür, wie man deutsche Sätze baut.",
        hilfe: "Du setzt Sätze aus Bausteinen zusammen und siehst sofort, ob die Reihenfolge stimmt." },
      { ton: "lern-06", ziel: "sub-dictionary",
        text: "Das Wörterbuch hat über vierzigtausend Wörter, nach Sprachniveau und Kategorien gefiltert.",
        hilfe: "Gezählt: 40.641 verschiedene Einträge in 33 Kategorien. Jedes Wort mit Artikel, Übersetzung, Beispielsatz und Betonung." },
      { ton: "lern-07", ziel: "sub-aussprache",
        text: "Der Aussprache-Trainer gibt dir eine ehrliche Auswertung deiner Aussprache.",
        hilfe: "Du sprichst ein Wort ins Mikrofon und bekommst eine Bewertung — keine Beschönigung." },
      { ton: "lern-08", ziel: "sub-alphabet",
        text: "Der Aussprachekurs bringt dir alle Laute des Deutschen bei und zeigt dir, wie du die Umlaute richtig machst.",
        hilfe: "Mit Schnittbildern durch Mund und Rachen — man sieht, wo die Zunge hin muss." },
      { ton: "lern-09", ziel: "sub-dialoge",
        text: "Bei den Dialogen spielst du typische Situationen nach.",
        hilfe: "Amt, Arzt, Wohnungsbesichtigung, Nachbarn — in der Sie-Form und in der du-Form." },
      { ton: "lern-10", ziel: "sub-bilderwelt",
        text: "In der Bilderwelt eignest du dir Wortschatz über das Sehen an.",
        hilfe: "Du tippst auf Dinge im Bild und hörst, wie sie heißen." },
      { ton: "lern-11", ziel: "sub-wortlisten",
        text: "Und in den Wortlisten legst du dir eigene Listen an, um später damit deine eigenen Spiele zu spielen.",
        hilfe: "Eigene Listen kannst du im Vokabeltrainer als Kategorie auswählen." },
    ],
  },

  "view-knowledge": {
    stuecke: [
      { ton: "wiss-00", ziel: "",
        text: "Das hier ist der Wissensbereich — alles, was zum Leben in Deutschland gehört." },
      /* HIER STAND ETWAS FALSCHES. Gemeldet: „Wenn du über den
         Kompass redest, dann sag wirklich nur das, was im Kompass
         drin ist." Ich hatte „Behörden, Wohnen, Arbeit, Gesundheit"
         behauptet — das ist der Wegweiser, nicht der Kompass.
         Nachgesehen, was renderKompass wirklich zeichnet: die
         Tagesgeschichte, Dichter & Denker, Schnee von gestern,
         Menschen/Dinge/Geschichten, Redewendungen, Umgangssprache
         und die kleinen Wörter. Genau das steht jetzt hier. */
      { ton: "wiss-01", ziel: "sub-kompass",
        text: "Im Kompass steht jeden Tag eine Geschichte aus Deutschland — dazu Dichter und Denker, Schnee von gestern, Redewendungen und die kleinen Wörter, die den Unterschied machen.",
        hilfe: "Jeder Text gibt es in sechs Niveaustufen von A1 bis C2 und in zehn Sprachen. Du liest also immer auf deiner Höhe." },
      { ton: "wiss-02", ziel: "sub-tips",
        text: "Im Schwarmwissen teilen alle ihr Wissen miteinander.",
        hilfe: "Was einer herausgefunden hat, muss der nächste nicht noch einmal herausfinden." },
      { ton: "wiss-03", ziel: "sub-community",
        text: "Über die eigenen Beiträge kannst du selbst etwas einreichen.",
        hilfe: "Texte, Tipps, Erfahrungen — andere können sie lesen, kommentieren und mögen." },
      { ton: "wiss-04", ziel: "sub-links",
        text: "Dazu kommen weiterführende Links.",
        hilfe: "Geprüfte Anlaufstellen — Ämter, Beratung, Sprachkurse." },
      { ton: "wiss-05", ziel: "sub-dialekt",
        text: "Bei den Dialekten hörst du, wie in den verschiedenen Regionen wirklich gesprochen wird.",
        hilfe: "Hochdeutsch lernt man im Kurs; verstanden wird man erst, wenn man den Rest auch kennt." },
      { ton: "wiss-06", ziel: "sub-livechat",
        text: "Im Klassenzimmer ist der Livestream — da hören wir uns wirklich.",
        hilfe: "Ton, Bild, Chat und Sprachnachrichten. Du brauchst nur ein Konto." },
      { ton: "wiss-07", ziel: "sub-music",
        text: "Der Musikplayer läuft nebenher.",
        hilfe: "Deutsche Lieder zum Mitlesen — Musik bleibt besser hängen als Listen." },
      { ton: "wiss-08", ziel: "sub-wegweiser",
        text: "Und der Wegweiser hilft dir, wenn du nach Deutschland kommst.",
        hilfe: "Was du vorher regeln solltest und was erst hier geht — in der richtigen Reihenfolge." },
    ],
  },

  "view-profile": {
    stuecke: [
      { ton: "prof-00", ziel: "sub-account",
        text: "Das ist dein Profil. Hier siehst du deinen Rang, deine Punkte und alles, was du schon geschafft hast." },
      { ton: "prof-01", ziel: "sub-album",
        text: "Im Sticker-Album sammelst du deine Füchse.",
        hilfe: "Jeder Fuchs steht für etwas, das du geschafft hast." },
      { ton: "prof-02", ziel: "sub-design",
        text: "Im Design gestaltest du deinen Baukasten und dein Aussehen auf der Seite.",
        hilfe: "Farben, Banner, Schriften — dein Profil soll nach dir aussehen." },
      { ton: "prof-03", ziel: "sub-friends",
        text: "Bei den Freunden fügst du Leute hinzu und forderst sie zu Duellen heraus.",
        hilfe: "Ein Duell ist eine Runde gegen eine andere Person — gleiche Fragen, getrennt gespielt." },
      { ton: "prof-04", ziel: "sub-inbox",
        text: "Dein Postfach ist auch hier.",
        hilfe: "Nachrichten, Einladungen ins Klassenzimmer und Herausforderungen." },
      { ton: "prof-05", ziel: "sub-settings",
        text: "Und in den Einstellungen kannst du unter anderem mich hier abschalten, wenn du mich nicht mehr brauchst.",
        hilfe: "Dort stellst du auch ein, ob ich als Foto oder als Comic komme." },
    ],
  },
};

/* =========================================================
   JEDER EINZELNE BEREICH — beim Anklicken
   ---------------------------------------------------------
   GEWUENSCHT: „Ich moechte fuer die einzelnen Bereiche, wenn
   man auf Spiele klickt oder auf Erste Schritte oder
   Grammatik, dass dieser Bereich noch mal kurz erklaert
   wird im Einzelnen — speziell zur Bilderwelt noch mal eine
   Erklaerung, was man da genau machen kann."

   Der Unterschied zum Text oben: dort nennt Alex den Bereich
   im Vorbeigehen („…und in der Bilderwelt eignest du dir
   Wortschatz ueber das Sehen an"). HIER steht, was man
   wirklich tut, wenn man drin ist.

   Kommt einmal je Besuch und Bereich. Wer den Tutor
   abgeschaltet hat, sieht auch das nicht.

   WOHER DIE ANGABEN STAMMEN: aus der Seite selbst — aus der
   Bereichstabelle in app.js und aus dem, was die jeweilige
   Ansicht wirklich zeichnet. Nicht aus dem Gedaechtnis.
   Beim Kompass ist mir genau das einmal danebengegangen.
   ========================================================= */
window.DMA_TUTOR_BEREICHE = {
  "sub-exercises": {
    ton: "b-uebungen",
    text: "In den Übungen wählst du oben eine Kategorie und dein Niveau — dann kommt eine Runde daraus. Du kannst Artikel üben, Bedeutungen, Schreibweisen. Deine gemerkten Wörter und deine eigenen Listen kannst du als Kategorie dazunehmen.",
  },
  "sub-games": {
    ton: "b-spiele",
    text: "Über dreißig Spiele, und alle arbeiten mit echtem Wortschatz — Memory, Buchstabensalat, Kreuzworträtsel, die Wortkanone und viele mehr. Manche sind von Anfang an da, andere schaltest du dir frei, indem du fleißig übst.",
  },
  "sub-erste-schritte": {
    ton: "b-erste",
    text: "Die Ersten Schritte sind für den allerersten Tag gedacht, ganz ohne Vorwissen: begrüßen, sich vorstellen, Zahlen, die Uhrzeit, die allerersten Sätze. Wenn dir hier alles leicht fällt, bist du bereit für die Übungen.",
  },
  "sub-grammatik": {
    ton: "b-grammatik",
    text: "Hier stehen die Regeln erklärt — und zwar in normalem Deutsch, nicht in Fachsprache. Zu jeder Regel gibt es einen Sprung direkt in die passende Übung. Du liest also nicht nur, warum etwas so heißt, sondern probierst es gleich aus.",
  },
  "sub-satzbaukasten-de": {
    ton: "b-satzbau",
    text: "Im Satzbaukasten setzt du Sätze aus Bausteinen zusammen und siehst dabei, wie sich die Formen mitändern — der Artikel, die Endung, die Stellung des Verbs. Genau daran merkt man, wie ein deutscher Satz gebaut ist.",
  },
  "sub-dictionary": {
    ton: "b-woerterbuch",
    text: "Über vierzigtausend Wörter, in dreiunddreißig Kategorien und nach Niveau filterbar. Zu jedem Wort gehören Artikel, Übersetzung, ein Beispielsatz und die Betonung. Was du dir mit dem Stern merkst, kannst du später gezielt üben.",
  },
  "sub-aussprache": {
    ton: "b-aussprache",
    text: "Du sprichst ein Wort ins Mikrofon, und du bekommst eine ehrliche Auswertung zurück — keine Beschönigung. Üben kannst du mit deinem gemerkten Wortschatz, mit einem Themenbereich oder mit einem ganzen Niveau.",
  },
  "sub-alphabet": {
    ton: "b-ausspracheKurs",
    text: "Der Aussprachekurs geht das komplette Alphabet durch, mit Umlauten und ß. Dazu die Regeln für lange und kurze Vokale, wie man Konsonanten am Stück spricht — Straße, nicht Se-tra-ße — und die Tricks für ü, ö, ng und ch, mit Schnittbildern durch Mund und Rachen.",
  },
  "sub-dialoge": {
    ton: "b-dialoge",
    text: "Erst das Gesprächsformular: für jeden Schritt eines Gesprächs fertige Sätze, in der Sie-Form und in der du-Form. Danach spielst du echte Situationen durch — Bürgeramt, Arzt, Wohnungsbesichtigung, Vorstellungsgespräch, Nachbarn, Sprachkurs.",
  },
  "sub-bilderwelt": {
    ton: "b-bilderwelt",
    text: "Die Bilderwelt ist gezeichnet, nicht fotografiert — und jedes Ding darin trägt seinen Namen. Du tippst auf einen Gegenstand und hörst, wie er heißt, mit Artikel und Betonung. Mit der Lupe kommst du an die kleinen Einzelheiten heran. Und du kannst umschalten: entweder die Wörterbuchform oder die Umgangssprache. Also „das Toilettenpapier“ — oder eben „das Klopapier“. Beides steht auf der Karte, du entscheidest nur, was oben steht.",
  },
  "sub-wortlisten": {
    ton: "b-wortlisten",
    text: "Hier legst du eigene Wortlisten an — Wort für Wort oder gleich aus einem ganzen Text auf einmal. Die Listen tauchen danach im Vokabeltrainer als eigene Kategorie auf, und du kannst mit ihnen auch die Spiele spielen.",
  },
  "sub-kompass": {
    ton: "b-kompass",
    text: "Der Kompass ist zum Lesen da. Jeden Tag eine Geschichte aus Deutschland, dazu Dichter und Denker, Schnee von gestern — also Dinge, die es mal gab —, Menschen und Geschichten, Redewendungen, Umgangssprache und die kleinen Wörter, die einen Satz erst deutsch klingen lassen. Jeden Text gibt es in sechs Niveaustufen und in zehn Sprachen.",
  },
  "sub-tips": {
    ton: "b-schwarm",
    text: "Im Schwarmwissen steht, was bei anderen Lernenden wirklich funktioniert hat. Keine Ratschläge von oben herab, sondern Erfahrungen von Leuten, die denselben Weg gegangen sind.",
  },
  "sub-community": {
    ton: "b-beitraege",
    text: "Hier schreibst du selbst etwas und veröffentlichst es. Andere können es lesen, kommentieren und mögen. Wenn du etwas herausgefunden hast, das dir keiner gesagt hat — schreib es auf, dann muss der Nächste nicht suchen.",
  },
  "sub-dialekt": {
    ton: "b-dialekt",
    text: "Hochdeutsch lernt man im Kurs. Verstanden wirst du erst, wenn du auch den Rest kennst. Hier hörst du, wie in den verschiedenen Regionen wirklich gesprochen wird.",
  },
  "sub-livechat": {
    ton: "b-klassenzimmer",
    text: "Das Klassenzimmer ist der Livestream. Du kommst herein, setzt dich hin und redest mit — per Ton, wenn du willst auch mit Bild, sonst im Chat. Es gibt Sprachnachrichten, und mit dem Freisprechen musst du nicht einmal einen Knopf drücken: sobald du sprichst, wird aufgenommen und der Reihe nach abgespielt.",
  },
  "sub-music": {
    ton: "b-musik",
    text: "Der Musikplayer läuft nebenher, während du übst. Deutsche Lieder zum Mitlesen — Musik bleibt besser hängen als eine Liste, das ist keine Meinung, das merkt man.",
  },
  "sub-wegweiser": {
    ton: "b-wegweiser",
    text: "Der Wegweiser ist für die praktischen Dinge: was du regeln musst, wenn du nach Deutschland, Österreich oder in die Schweiz kommst. Acht Bereiche, jeder mit den Schritten der Reihe nach, Tipps und den geprüften Quellen zum Nachlesen.",
  },
  "sub-feste": {
    ton: "b-feste",
    text: "Der Jahreslauf mit allen Festen — und dazu das Ungeschriebene: Pünktlichkeit, Ruhezeiten, Mülltrennung, Pfand, wie man mit Behörden umgeht und was ein Verein ist. Die Dinge, die alle kennen und niemand erklärt.",
  },
  "sub-album": {
    ton: "b-album",
    text: "Im Sticker-Album sammelst du deine Füchse. Jeder Fuchs steht für etwas, das du geschafft hast — und man sieht auf einen Blick, was noch fehlt.",
  },
  "sub-friends": {
    ton: "b-freunde",
    text: "Freunde hinzufügen und sie zu Duellen herausfordern. Ein Duell ist eine Runde gegen eine andere Person: gleiche Fragen, getrennt gespielt, danach wird verglichen.",
  },
  "sub-settings": {
    ton: "b-einstellungen",
    text: "In den Einstellungen stellst du ein, wie dich die Seite unterstützt: die Sprache der Erklärungen, ob Umgangssprache oder Wörterbuchform oben steht — und ob ich hier auftauche oder nicht. Als Foto oder als Comic, ganz wie du magst.",
  },
};
