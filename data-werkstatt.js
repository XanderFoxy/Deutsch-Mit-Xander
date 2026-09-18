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
  stand: "Runde 66 — Tutor, Stimme im Klassenzimmer und Unterricht",

  inArbeit: [
    { seit: "2026-09-18T16:56",
      text: "18 Tutor-Saetze haben noch keine Aufnahme — darunter ALLE fuenf von „Ueber mich“ (ElevenLabs-Guthaben war leer)" },
    { seit: "2026-09-18T16:56", nurBetreiber: true,
      text: "Cloudflare-Schluessel fuer den Livestream fehlt noch — Einstellungen, Karte „Klassenzimmer-Relais“" },
    { seit: "2026-09-18T16:56",
      text: "Platztausch per Klick auf einen anderen Platz" },
    { seit: "2026-09-18T16:56",
      text: "Echte Bilder fuer „Menschen, Dinge, Geschichten“ im Kompass" },
    { seit: "2026-09-18T16:56",
      text: "Fehlende Animationen: Umarmung, Boxen, Route 66" },
    { seit: "2026-09-18T16:56",
      text: "Animationen ueberarbeiten: Aquarium, Aegypten, KITT, Weihnachtsmann, Strudel, Zombie, Jalousie, Spukschloss" },
    { seit: "2026-09-18T16:56",
      text: "Stripe-Stufen 1-5 Euro (Super User)" },
    { seit: "2026-09-18T16:56",
      text: "Sitzende Seitenansicht fuers Profil" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-18T16:56",
      text: "Tutor springt nicht mehr: nur ein echter Tastendruck unterbricht ihn, und ein Satz ohne Aufnahme bleibt stehen, bis man ihn gelesen hat (gemessen: vorher 6 Saetze in 20 ms)" },
    { seit: "2026-09-18T16:56",
      text: "Tutor kommt nur noch beim ERSTEN Oeffnen eines Bereichs am Tag — das ueberlebt jetzt auch das Neuladen der Seite" },
    { seit: "2026-09-18T16:56",
      text: "Tutor-Reiter geht beim Schreiben aus dem Weg: der Senden-Knopf liegt nicht mehr unter ihm" },
    { seit: "2026-09-18T16:56",
      text: "Sprachnachrichten laufen jetzt ALLE ueber die Warteschlange — man hoert sie auch ausserhalb des Klassenzimmers" },
    { seit: "2026-09-18T16:56",
      text: "Quittung nach dem Sprechen: Dauer, Zuhoererzahl, Nachhoeren und Herunterladen; allein im Raum hoert man sich selbst" },
    { seit: "2026-09-18T16:56",
      text: "Der Platz der sprechenden Person leuchtet, solange ihre Aufnahme laeuft — eigene Animation, anders als beim Direktton" },
    { seit: "2026-09-18T16:56",
      text: "Sprachnachrichten stehen nicht mehr im Chat; sichtbar macht man sie mit langem Druck aufs Halte-Zeichen oder /mitschrieb" },
    { seit: "2026-09-18T16:56",
      text: "Chatleiste aufgeraeumt: Ohr-Knopf raus, Bild in den Anhang, „dauernd“ ist ein Halte-Schloss geworden" },
    { seit: "2026-09-18T16:56",
      text: "Neue Befehle /c name und /c schrift — Name und Schrift getrennt einfaerben" },
    { seit: "2026-09-18T16:56",
      text: "Klassenzimmer-Aufgaben: /satz und /wort verdrehen Woerter und Buchstaben, die Teile sind anklickbar, richtige Antworten geben Punkte" },
    { seit: "2026-09-18T16:56",
      text: "/note Name 1-6 — Zensuren vom Haeuptling, mit Punkten fuer gute Noten" },
    { seit: "2026-09-18T16:56",
      text: "/rw schreibt rueckwaerts — der Fehler von neulich, jetzt mit Absicht" },
    { seit: "2026-09-18T16:56",
      text: "Orkan verdreht die Woerter nicht mehr dauerhaft (zwei Stuerme gleichzeitig haben den Urtext ueberschrieben)" },
    { seit: "2026-09-18T16:56",
      text: "Schulglocke in den Einstellungen: eine Einladung in jedes Postfach und direkt ins Klassenzimmer" },
    { seit: "2026-09-18T16:56",
      text: "Rauswurf steht jetzt oben im Laufband, mit Grund" },
  ],
};
