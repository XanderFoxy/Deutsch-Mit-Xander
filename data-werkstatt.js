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
  stand: "Runde 68 — Der Verlauf war nie gespeichert, die Wortmeldungen hatten einen dritten Zustand",

  inArbeit: [
    { seit: "2026-09-18T22:24",
      text: "Alte „Du bist hier Häuptling“-Zeilen nachträglich aus dem Verlauf nehmen" },
    { seit: "2026-09-18T22:24",
      text: "Bühnenansicht: wer auf der Bühne sitzt, sieht nur die anderen dort" },
    { seit: "2026-09-18T22:24",
      text: "Sitzende Seitenansicht fürs Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T22:24",
      text: "Der Chat wurde seit Wochen NICHT in der gemeinsamen Tabelle abgelegt: eine Spalte hiess „farbeName“, die Tabelle kannte sie nicht, und der Fehler lief ins Leere — die Tabelle war leer, deshalb konnte niemand nach oben scrollen" },
    { seit: "2026-09-18T22:24",
      text: "Spalte farbe_name ergänzt; ein fehlgeschlagenes Speichern meldet sich jetzt, statt still zu verschwinden" },
    { seit: "2026-09-18T22:24",
      text: "20.000 Zeilen kommen vom Server statt 2.000 — Bilder nur für die letzten 200, damit das Telefon nicht ertrinkt" },
    { seit: "2026-09-18T22:24",
      text: "Sprachnachrichten: die Zeile mit Ton im Lager stand als leerer Name im Chat — jetzt „wird geladen“, der Ton wird geholt, und alle Wortmeldungen bleiben hinter dem Tipp ins Leere" },
    { seit: "2026-09-18T22:24",
      text: "Benoten: ein Schalter „📋 Noten“ in der Kopfzeile (nur für dich) — dann steht der Notenknopf an jeder geschriebenen Zeile der anderen" },
  ],
};
