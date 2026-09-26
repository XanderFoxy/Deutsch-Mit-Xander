/* =========================================================
   DIE WERKSTATT — woran GERADE gebaut wird
   ---------------------------------------------------------
   DIESE DATEI WIRD GESCHRIEBEN, NICHT GEPFLEGT.
   Sie entsteht bei jedem Hochladen neu aus
   werkzeug/werkstatt-setzen.py. Von Hand geänderte Zeilen sind
   beim nächsten Mal weg.

   GEWÜNSCHT, und zwar genau so:
   „Zeige in der Werkstatt, woran du jetzt zuletzt gearbeitet
    hast — nicht nur das Datum, sondern auch die Uhrzeit. Dabei
    sind alle Sachen, die erledigt sind, irrelevant. Alles was
    jetzt gerade geupdatet wird, ist relevant. Und wenn Updates
    nicht mehr in Arbeit sind, verschwindet das Zeichen auch
    wieder."
   „Mit jedem einzelnen Ding, was du hochlädst, soll sich die
    Werkstatt auch aktualisieren. Und sie soll für normale
    Benutzer gar nicht sichtbar sein, nur für mich als
    Betreiber."

   Daraus folgen vier harte Regeln, und die Datei kann gar nichts
   anderes:

   1. HIER STEHT NUR, WAS OFFEN IST.
      Es gibt keine Liste „fertig" mehr. Was fertig ist, ist
      fertig — es gehört in den Ticker oder nirgendwohin, aber
      nicht in eine Werkstatt.

   2. JEDE ZEILE TRÄGT TAG UND UHRZEIT.
      „seit" ist der Zeitpunkt, an dem die Arbeit begonnen hat.

   3. IST DIE LISTE LEER, IST DAS ZEICHEN WEG.
      Kein leerer Knopf, kein „zurzeit nichts".

   4. NUR DER BETREIBER SIEHT SIE.
      nurBetreiber steht fest auf true. Eine Baustellenliste geht
      niemanden etwas an, der die Seite benutzen will.

   5. ZWEI LISTEN: OFFEN UND FERTIG.
      „Dass ich sehe, welche Sachen gerade fertig sind, Schritt für
      Schritt, damit ich es direkt überprüfen kann." Unter „fertig"
      steht deshalb, was mit dem letzten Hochladen oben angekommen
      ist — mit Uhrzeit, damit man weiss, was man sich ansehen kann.
   ========================================================= */
window.DMA_WERKSTATT = {
  /* true = nur der Betreiber sieht die Blase. Ausdrücklich so
     gewünscht: „sie soll für normale Benutzer gar nicht sichtbar
     sein, nur für mich als Betreiber." */
  nurBetreiber: true,

  /* Woran gerade gearbeitet wird — eine Zeile Klartext. */
  stand: "Fassung 701: Rundenkampf gegen echte Mitspieler als Arena (Züge oder Echtzeit, fair nach Level) – als Nächstes das Dorf (Berufe, Forschung, Automatik)",

  inArbeit: [
    { seit: "2026-09-26T15:57",
      text: "Dorf: Berufe + Ausbildung, Wissenschaft/geheime Forschung, Sehenswürdigkeiten + Besucher, Automatik Getreide→Mühle→Bäckerei, Hunger ernster" },
    { seit: "2026-09-26T15:57",
      text: "Premium: Stripe braucht deine Freigabe (claude.ai → Connectors), GoFundMe-Link" },
    { seit: "2026-09-26T15:57",
      text: "Rest Funk 139: Superwaffen je Level, Zauber-Wirkungen, Lenkrakete, deutsche Sachen, TD-Wellen, Tiere bei Beamen/Lok, Rüstung/Helm sichtbar, Waffen in der Hand, Android-Knöpfe, Aufgaben-Pool, Profil-Effekte, Kostüme, Quests" },
    { seit: "2026-09-26T15:57",
      text: "Bitte den Rundenkampf einmal mit jemandem echt testen (zwei Geräte)" },
    { seit: "2026-09-26T15:57",
      text: "ElevenLabs-Schlüssel bitte erneuern (stand im Chat)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-26T15:57",
      text: "Rundenkampf zu zweit: schnelle Antworten zählen, jeder auf der Bühne einladbar, verlorene Züge kommen nach, Arena mit beiden Profilbildern, K.O., Konter, Fairness" },
    { seit: "2026-09-26T15:57",
      text: "Dorf-Menü ruhig (144) und Dorf organisch (143)" },
    { seit: "2026-09-26T15:57",
      text: "699 Kämpferklassen (Beta)" },
  ],
};
