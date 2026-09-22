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
  stand: "Fassung 437 — Runde 80, vierter Teil: die Toene. Tennis klingt nach Saiten statt nach Klatschen, der Kuss hat sein MMM, die Schneekugel klingt beim Schuetteln, die Sprungfeder macht das bekannte Boing, das Schnurren haelt bis zum Ende durch, der Zufall ist eine echte Slotmaschine, der Basketball trifft synchron — dazu der Schrei beim Licht aus, das Fenster staucht nicht mehr, die Jalousie bleibt offen, und im Rollo ziehen Sternschnuppen durch.",

  inArbeit: [
    { seit: "2026-09-22T02:06",
      text: "Der Rest von Xanders Liste vom 22. September" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-22T02:06",
      text: "tennistreffer neu gebaut: Saitenanschlag, Ballton bei 480 Hz, Rahmennachklang — 0,42 s statt eines Klatschens;kussmund neu: 0,62 s gesummtes MMM, Schmatzer bei 0,66 s, kurzes mh zum Ausklang;kugelschuetteln neu: sechs Schuettelbewegungen, rieselnde Flocken, Fuss setzt bei 1,18 s auf;feder neu: Tonhoehe schnellt von 150 auf 900 Hz und wackelt aus — das traditionelle Boing;schnurren von 2,00 s auf 3,40 s verlaengert, genau die Laenge der Animation;slot2 neu gerechnet: Hebel, Walzenticken das langsamer wird, drei einzeln einrastende Walzen, Gewinnglocken, Muenzregen;korbrattern von 4,00 s auf 1,25 s — der zweite laute Teil ab 2,05 s klang, als der Ball laengst durchs Netz war;Dribbeln endet bei 2250 ms statt 3250 ms, also genau beim Wurf;Schrei beim Licht aus, 900 ms nach dem Schalter, mit der Stimme des Platzes;Fensterfluegel: Fluchtabstand 420 auf 1600 px — die Hoehe waechst jetzt um 2,6 statt um 11 Prozent;Jalousie bleibt offen bis zum Schluss statt bei 74 Prozent wieder zuzuklappen;drei Sternschnuppen im Nachthimmel hinter dem Rollo;Ohrfeige: Hand holt aus, haelt, und schlaegt dann in 130 ms zu statt in 728 ms;alle 136 Sonden gruen" },
  ],
};
