/* =========================================================
   DER TUTOR — was Alex in jedem Bereich sagt
   ---------------------------------------------------------
   GEWUENSCHT: „Ich moechte, dass an der Seite von jedem Bereich
   beim Aufrufen dieses Bereiches eingeblendet wird — mit der
   Moeglichkeit, das abzuschalten, wenn man es nicht mehr braucht.
   Also ich komme dann animiert von der rechten Seite ins Bild
   hinein und sage dann zum Beispiel: willkommen im Lernbereich."

   Die Texte sind seine eigenen, nur in ganze Saetze gebracht.
   Sie stehen HIER und nicht in app.js, damit sie sich aendern
   lassen, ohne die Seite anzufassen — und damit sie erst geladen
   werden, wenn der Tutor wirklich eingeschaltet ist.

   „ton" ist der Dateiname unter tutor/ ohne Endung. Liegt die
   Datei da, spricht Alex selbst; liegt sie nicht da, steht der
   Text trotzdem in der Sprechblase. Kein stummer Knopf.
   ========================================================= */
window.DMA_TUTOR = {
  "view-about": {
    ton: "ueber-mich",
    text: "Schön, dass du da bist! Ich bin Alex — Musiker und Deutschlehrer. "
      + "Diese Seite baue ich in meiner Freizeit, weil ich glaube, dass man eine Sprache "
      + "nicht mit trockenem Frontalunterricht lernt, sondern mit kurzen, kurzweiligen "
      + "Übungen, die Spaß machen. Schau dich in Ruhe um."
  },
  "view-learn": {
    ton: "lernen",
    text: "Willkommen im Lernbereich! Hier findest du Übungen zur deutschen Sprache und "
      + "Spiele, die dir die Motivation zum Lernen geben. Es gibt die Ersten Schritte, "
      + "die dich als Neuling in die Sprache hineinführen; die Grammatikregeln, die du "
      + "brauchst, um Deutsch richtig zu sprechen; einen Satzbaukasten, mit dem du ein "
      + "Gefühl dafür bekommst, wie man deutsche Sätze baut; ein Wörterbuch mit "
      + "zehntausenden Vokabeln, nach Sprachniveau und Kategorien gefiltert; einen "
      + "Aussprache-Trainer, der dir eine ehrliche Auswertung deiner Aussprache gibt; "
      + "einen Aussprachekurs, der dir alle Laute des Deutschen beibringt und dir zeigt, "
      + "wie du die Umlaute richtig machst; typische Dialoge zum Nachspielen; die "
      + "Bilderwelt, in der du dir Wortschatz über das Sehen aneignest — und Wortlisten, "
      + "die du dir selbst anlegen kannst, um später damit deine eigenen Spiele zu spielen."
  },
  "view-knowledge": {
    ton: "wissen",
    text: "Das hier ist der Wissensbereich. Im Kompass findest du alles, was zum Leben in "
      + "Deutschland gehört. Im Schwarmwissen teilen alle ihr Wissen miteinander, und über "
      + "die eigenen Beiträge kannst du selbst etwas einreichen. Dazu weiterführende Links, "
      + "die typischen Dialekte aus den verschiedenen Regionen, das Klassenzimmer mit dem "
      + "Livestream, in dem wir uns wirklich hören, der Musikplayer — und der Wegweiser, "
      + "der dir hilft, wenn du nach Deutschland kommst."
  },
  "view-profile": {
    ton: "profil",
    text: "Das ist dein Profil. Hier siehst du deinen Rang, deine Punkte und alles, was du "
      + "schon geschafft hast. Du kannst deine Sammelfüchse ansehen, deinen Baukasten "
      + "gestalten, Freunde hinzufügen und sie zu Duellen herausfordern. Dein Postfach ist "
      + "auch hier — und die Einstellungen, in denen du unter anderem mich hier abschalten "
      + "kannst, wenn du mich nicht mehr brauchst."
  }
};
