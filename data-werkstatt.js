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
  stand: "Runde 98 — Fassung 508",

  inArbeit: [
    { seit: "2026-09-23T07:22",
      text: "Vier Gesichter fehlen noch: schockiert, Leute, Hallo, okay — das Tageslimit des ElevenLabs-Zugangs war nach drei Bildern erreicht" },
    { seit: "2026-09-23T07:22",
      text: "Bild-Aufspruehen pixelweise auch fuer bewegte GIF-Einzelbilder (heute laeuft das GIF, gemalt wird das erste Bild)" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-23T07:22",
      text: "Zu zweit reisen: Fahrrad, Huepfball mit Hoernern, und der selbst gezeichnete Weg (/gemeinsam Bea ball 3-4-8)" },
    { seit: "2026-09-23T07:22",
      text: "Das aufgespruehte Bild: echte Pixel (94 % statt 32 %), GIF bleibt GIF, und fremde Bilder (GIPHY) gehen ueberhaupt erst" },
    { seit: "2026-09-23T07:22",
      text: "Zwei neue Profil-Effekte: die aufbluehende Blume und die Leiter zum Hochklettern" },
    { seit: "2026-09-23T07:22",
      text: "Die Ueberschrift der Lesetafel steht wieder waagerecht — bei 360 px waren es 18 Zeilen, jetzt 2" },
    { seit: "2026-09-23T07:22",
      text: "Der Fokus gilt fuer alle und steht im neuen Fokusband unter dem Chat — dreissig neue Zeilen ruecken ihn nicht mehr weg" },
    { seit: "2026-09-23T07:22",
      text: "Aufdecken geht wirklich reihum; wer dazwischenruft, dreht die Runde nicht weiter" },
    { seit: "2026-09-23T07:22",
      text: "Schiffe versenken laesst sich wirklich beenden — auch beim Schiedsrichter bleibt nichts liegen" },
    { seit: "2026-09-23T07:22",
      text: "Stadt-Land-Fluss: der Punktbeste wird Spielfuehrer und bestimmt den naechsten Buchstaben" },
    { seit: "2026-09-23T07:22",
      text: "Alex' Gesicht als Reaktion: ohmygod, wow, verbissen (/gesicht wow)" },
    { seit: "2026-09-23T07:22",
      text: "Elf rote Sonden wieder gruen — Kran, Befehlsreihenfolge, ueberfahren und sechs alte Regeln auf deinen Stand gebracht" },
  ],
};
