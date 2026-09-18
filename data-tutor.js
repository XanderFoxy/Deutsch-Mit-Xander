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
        text: "Das Wörterbuch hat zehntausende Vokabeln, nach Sprachniveau und Kategorien gefiltert.",
        hilfe: "Jedes Wort mit Artikel, Übersetzung und Aussprache. Was du dir merkst, kannst du später üben." },
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
      { ton: "wiss-01", ziel: "sub-kompass",
        text: "Im Kompass findest du die Grundlagen: Behörden, Wohnen, Arbeit, Gesundheit.",
        hilfe: "Sortiert nach Lebenslage, nicht nach Amtsdeutsch." },
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
