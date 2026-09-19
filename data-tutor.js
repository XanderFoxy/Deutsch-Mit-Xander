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
      { ton: "ueber-01b", ziel: "",
        text: "Schön, dass du da bist! Ich bin Alex — Musiker und Deutsch-Helfer. Lehrer nenne ich mich nicht; ich helfe dir einfach beim Deutschlernen." },
      { ton: "ueber-02b", ziel: "",
        text: "Diese Seite baue ich in meiner Freizeit, weil ich glaube, dass man eine Sprache nicht mit trockenem Frontalunterricht lernt, sondern mit kurzen Übungen, die Spaß machen." },
      /* GEWUENSCHT: „Bei Hallo, ich bin Alex kannst du auch erklaeren,
         was die Sachen im Head bedeuten, damit das dort schon
         verstanden wird." Von links nach rechts durchgegangen — der
         Kalender, das Profil, die Tasse — und danach das, was
         darunter laeuft: Wetter, Uhrzeit, Newsticker. */
      { ton: "ueber-03", ziel: "",
        text: "Ganz oben siehst du drei Sachen. Der Kalender links: dort löst du jeden Tag eine Aufgabe, und von da kommst du direkt zur Tagesgeschichte — dem bekanntesten Ereignis in Deutschland an genau diesem Datum, als Leseübung in jedem Sprachniveau und in vielen Sprachen. Das Profilbild daneben bringt dich in deinen Bereich. Und die Tasse rechts ist zum Kaffee ausgeben: wenn dir die Seite gefällt, kannst du mich damit unterstützen. Musst du nicht — es hilft mir aber, die laufenden Kosten zu tragen, zum Beispiel für den Livestream." },
      { ton: "ueber-04", ziel: "",
        text: "Darunter läuft das echte deutsche Wetter mit — animiert, je nach Tageszeit: Sonne, Regen, Schnee, Wolken, Gewitter, und nachts ein Sternenhimmel, wenn die Sicht frei ist. Daneben steht die deutsche Uhrzeit. Und der Newsticker zeigt, wer gerade was macht, welche Fortschritte die Leute machen, wer online ist, woher er kommt und wo er sich gerade befindet — ob im Klassenzimmer oder einfach auf der Seite." },
      { ton: "ueber-05", ziel: "",
        text: "Noch ein Tipp, der leicht übersehen wird: Klick in einen geschriebenen Text hinein, dann wird dir die Betonung angezeigt. Ein Punkt unter dem Vokal heißt kurz, ein Strich heißt lang. So liest du es gleich richtig und gewöhnst dir keine Aussprachefehler an. Und wenn dich meine Musik interessiert — die Links zu YouTube und TikTok stehen hier auch." },
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
      { ton: "wiss-01b", ziel: "sub-kompass",
        text: "Der Kompass sammelt sieben Sachen zum Lesen: Es war einmal in Deutschland, Dichter und Denker, Schnee von gestern, Menschen und Geschichten, Redewendungen, Umgangssprache und Jugendslang, und kleine Wörter mit großer Wirkung.",
        hilfe: "Jeden Text gibt es in sechs Niveaustufen von A1 bis C2 und in zehn Sprachen. Du liest also immer auf deiner Höhe." },
      { ton: "wiss-02", ziel: "sub-tips",
        text: "Im Schwarmwissen teilen alle ihr Wissen miteinander.",
        hilfe: "Was einer herausgefunden hat, muss der nächste nicht noch einmal herausfinden." },
      { ton: "wiss-03", ziel: "sub-community",
        text: "Über die eigenen Beiträge kannst du selbst etwas einreichen.",
        hilfe: "Texte, Tipps, Erfahrungen — andere können sie lesen, kommentieren und mögen." },
      /* GEMELDET: „Zum Beispiel sagt er ‚weiterfuehrende Links‘ und
         macht das so wie eine Aufzaehlung, und dann springt er
         ploetzlich zum anderen Punkt … das wirkt total aus dem
         Kontext gerissen, als wenn er Fehler macht."
         Stimmt: ein Satz, der wie ein Doppelpunkt klingt, muss auch
         liefern. Jeder Satz steht jetzt fuer sich. */
      { ton: "wiss-04b", ziel: "sub-links",
        text: "Unter den weiterführenden Links sind geprüfte Adressen gesammelt, die außerhalb dieser Seite weiterhelfen — und jeder kann eigene dazutun, die er kennt. So liegt alles an einem Ort.",
        hilfe: "Du kannst selbst Links einreichen. Was anderen geholfen hat, hilft dem Nächsten auch." },
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
  /* DRITTER ANLAUF, und diesmal nach seiner eigenen Beschreibung.
     Erst hatte ich den Wegweiser beschrieben, dann zu ungenau. Was
     hier steht, ist Punkt fuer Punkt das, was er gesagt hat —
     abgeglichen mit den Ueberschriften, die renderKompass wirklich
     zeichnet. */
  "sub-kompass": {
    ton: "b-kompass2",
    text: "Der Kompass ist zum Lesen da, und er hat sieben Bereiche. "
      + "In „Es war einmal in Deutschland“ findest du jeden Tag eine neue Geschichte, passend zum Datum: das bekannteste historische Ereignis in Deutschland an genau diesem Tag. Das ist deine Leseübung — in jedem Sprachniveau und in viele Sprachen übersetzt. "
      + "Bei „Dichter und Denker“ geht es um berühmte Deutsche. "
      + "„Schnee von gestern“ sind Dinge, die in Deutschland einmal bekannt waren und die es heute so nicht mehr gibt — oder die man heute nicht mehr sagt und nicht mehr macht. "
      + "Die Redewendungen sind typisch deutsch und werden wirklich benutzt, nicht nur im Buch. "
      + "Umgangssprache und Jugendslang sagt der Name schon: wie man wirklich spricht, wenn man nicht auf dem Amt ist. "
      + "Und „Kleine Wörter, große Wirkung“ sind die Wörtchen wie doch, mal, eben oder halt — die stehen in keiner Regel, aber ohne sie klingt kein Satz deutsch.",
  },
  "sub-tips": {
    ton: "b-schwarm2",
    text: "Das Schwarmwissen ist gesammeltes Wissen von den Leuten selbst. Hier zeigen sie einander, was ihnen beim Lernen geholfen hat oder gerade hilft — damit dieses Wissen in der Gemeinschaft bleibt und nicht jeder bei null anfängt. Keine Ratschläge von oben herab, sondern Erfahrungen von Leuten, die denselben Weg gehen.",
  },
  "sub-community": {
    ton: "b-beitraege",
    text: "Bei den eigenen Beiträgen kannst du selbst etwas zur Verfügung stellen, und zwar in allen Sprachniveaus. Andere lesen es, kommentieren und mögen es. Wenn du etwas herausgefunden hast, das dir keiner gesagt hat: schreib es auf, dann muss der Nächste nicht suchen.",
  },
  "sub-dialekt": {
    ton: "b-dialekt2",
    text: "Dasselbe Ding, sieben Namen. Hier siehst du, wie ein Wort in Bayern heißt, bei den Schwaben, in Sachsen, im Ruhrgebiet, in Berlin, in Österreich und in der Schweiz. Hochdeutsch lernst du im Kurs — verstanden wirst du erst, wenn du den Rest auch kennst.",
  },
  "sub-livechat": {
    /* NACHGEFUEHRT im September. Der Raum kann inzwischen deutlich
       mehr, als hier stand — und ein Text von siebzig Sekunden in
       EINER Sprechblase liest niemand zu Ende. Deshalb vier Stuecke,
       wie bei den grossen Bereichen auch. Was hier steht, ist
       nachgemessen, nicht angekuendigt.
       Der alte Ton (b-klassenzimmer) gehoert zum ersten Stueck; die
       anderen drei laufen nach Lesezeit, bis sie aufgenommen sind. */
    ton: "b-klassenzimmer",
    text: "Das Klassenzimmer ist echter Unterricht, nicht nur ein Livestream.",
    stuecke: [
      { ton: "b-klassenzimmer",
        text: "Das Klassenzimmer ist echter Unterricht, nicht nur ein Livestream. Wer etwas sagen möchte, hält das Mikrofon gedrückt und spricht — gehört wird er, sobald der vor ihm fertig ist. So redet niemand in jemanden hinein." },
      { ton: "",
        text: "Die Wortmeldungen stehen nicht im Chat herum. Tipp einmal in den leeren Teil des Chats, dann siehst du sie alle — zum Nachhören, zum Herunterladen und zum Zurückrufen, solange sie noch niemand gehört hat.",
        hilfe: "Bleibt der grüne Balken einmal stehen: tipp ihn an. Er sagt dir, ob die Leitung wirklich belegt ist — und gibt sie frei, wenn nur die Anzeige hängt." },
      { ton: "",
        text: "Willst du jemandem etwas nur für ihn sagen, schreibst du „/w“ und seinen Namen. Geflüstert wird der Person, nicht dem Raum: sie sieht es auch später noch und in jedem anderen Raum, in dem sie sitzt. Und wenn du eine geflüsterte Zeile antippst, steht die Antwort schon vorbereitet im Schreibfeld.",
        hilfe: "Die Namen schlägt dir das Feld beim Tippen vor — auch von Leuten aus anderen Räumen." },
      { ton: "",
        text: "Aufgaben stellst du mit „/satz“, mit „/wort“ oder mit „/aufgabe“ in deinen eigenen Worten. An der Antwort darauf steht dann ein Knopf, mit dem du eine Note von eins bis sechs geben kannst — nur an der Antwort, nicht an jeder Zeile. Und oben rechts wechselst du zwischen dem Klassenzimmer mit allen acht Plätzen und dem Gegenüber, in dem nur zu sehen ist, wer wirklich auf der Bühne sitzt.",
        hilfe: "Alle Befehle stehen unter „ⓘ Befehle“. Tipp im Vorschlagsfeld einen Befehl lang an, dann steht er künftig als Favorit ganz vorn." }
    ],
  },
  "sub-music": {
    ton: "b-musik",
    text: "Der Musikplayer läuft nebenher, während du übst. Deutsche Lieder zum Mitlesen — Musik bleibt besser hängen als eine Liste, das ist keine Meinung, das merkt man.",
  },
  "sub-wegweiser": {
    ton: "b-wegweiser",
    text: "Der Wegweiser zeigt dir für alle deutschsprachigen Länder, wie du ankommst und dich einlebst — Deutschland, Österreich, die Schweiz. Acht Bereiche, jeder mit den Schritten der Reihe nach, den geprüften Quellen und den Tipps und Tricks, die dir sonst keiner sagt. Zu finden ist das alles auch woanders; hier steht es an einer Stelle und kurz.",
  },
  "sub-feste": {
    ton: "b-feste",
    text: "Wie in Deutschland gefeiert wird und welche Feiertage es gibt — und vor allem: ob ein Tag ein gesetzlicher Feiertag ist, ob es nur Brauch ist, und in welchem Bundesland er überhaupt gilt. Dazu das Ungeschriebene: Pünktlichkeit, Ruhezeiten, Mülltrennung, Pfand, Behörden und Vereine.",
  },
  "sub-album": {
    ton: "b-album",
    text: "Im Sticker-Album stehen alle Füchse, die du gesammelt hast. Jeder Fuchs ist eine Belohnung für etwas, das du geschafft hast — und man sieht auf einen Blick, was noch fehlt. Das ist der ganze Sinn: fleißig sein lohnt sich sichtbar.",
  },
  "sub-friends": {
    ton: "b-freunde",
    text: "Hier findest du Freunde, verbindest dich mit ihnen und forderst sie zu Duellen heraus — gleiche Fragen, getrennt gespielt, danach wird verglichen. Du kannst auch Leute einladen, die noch nicht dabei sind; dafür bekommst du Punkte. Und Punkte bringen dich im Rang weiter.",
  },
  "sub-settings": {
    ton: "b-einstellungen",
    text: "In den Einstellungen findest du alles, was die Seite an dich anpasst: die Sprache der Erklärungen, ob die Umgangssprache oder die Wörterbuchform oben steht, ob die Betonung auf der ganzen Seite angezeigt wird, ob du Beta-Tester werden möchtest — und ob ich hier überhaupt auftauche. Als Foto oder als Comic, ganz wie du magst.",
  },
};
