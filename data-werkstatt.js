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
  stand: "Fassung 424 — Runde 73, dritter Teil: das Tor, Bowling, Helikopter, Raddampfer, die Geigen, der Vogel und das Pferd.",

  inArbeit: [
    { seit: "2026-09-21T17:30",
      text: "Bowling mit Menschen als Kegel; Billard-Physik; Basketballkorb." },
    { seit: "2026-09-21T17:30",
      text: "Strohhalm, Knüllen, Maulwurf in der Draufsicht." },
    { seit: "2026-09-21T17:30",
      text: "Leuchten am Platz: für alle sichtbar und abschaltbar; die Fassung darf nicht stehenbleiben." },
    { seit: "2026-09-21T17:30",
      text: "Sprechbilder Feuer, Blut, Regen und die übrigen aus der Liste." },
    { seit: "2026-09-21T17:30",
      text: "Aufgabe im Unterricht, Schiffe-versenken-Reihenfolge, Android-Layout, Stadt-Land-Fluss." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T17:30",
      text: "Tor: die fünf harten Ringe sind raus — von vorn gesehen waren das konzentrische Streifen, also die Tapeten- beziehungsweise Nudelholzrolle. Stattdessen ein Trichter, der langsam atmet: Tiefe statt Scheibe." },
    { seit: "2026-09-21T17:30",
      text: "Tor: die Krümel oben links waren alle vierzehn Tropfen. Gemessen standen sie in einem Häufchen von 16 x 17 px in der linken oberen Ecke, weil eine stärkere Regel (.lc-tor-wirbel > b mit inset:0) ihr left/top überschrieben hat. Jetzt fliegen sie rundum bis an den Rand." },
    { seit: "2026-09-21T17:30",
      text: "Bowling: die Kugel traf bei 605 ms, der Kegel kippte bei 1455 ms — 850 ms auseinander. Jetzt beides bei 1392 ms, und der Ton hat genau dort seinen Schlag." },
    { seit: "2026-09-21T17:30",
      text: "Bowling: das Regal-Einsturz-Geräusch war der zweite Scheppersatz bei 3,0 bis 3,4 s einer 6-Sekunden-Datei über einer 2,4-Sekunden-Animation. Der Ton ist jetzt auf 2,4 s gedeckelt." },
    { seit: "2026-09-21T17:30",
      text: "Helikopter: die Landung war „bonk\", ein einzelner dumpfer Schlag — daher der Trommelklang. Neu helilanden: erste Kufe, zweite Kufe 90 ms später, Streben klingen nach, Rotor läuft langsamer aus." },
    { seit: "2026-09-21T17:30",
      text: "Raddampfer: dazu die Dampforgel, dampferdixie, 3,30 s, ein eigener munterer Lauf in G-Dur — kein fremdes Stück." },
    { seit: "2026-09-21T17:30",
      text: "Geigen im Dunkeln: vier Stiche in 1,10 s waren ein Hacken. geigenquartett spielt sie in 4,11 s mit zwei tieferen Lagen." },
    { seit: "2026-09-21T17:30",
      text: "Greifvogel: die Flügelwurzel sass bei x=70 auf einem Rumpf von 58 bis 122 — im hinteren Fünftel, also wirklich am Hinterteil. Jetzt an der Schulter bei x=96." },
    { seit: "2026-09-21T17:30",
      text: "Pferd: die Blesse war 6 von 9 Einheiten breit, also zwei Drittel des Gesichts. Jetzt 2,4 und nach unten auslaufend. Die Kruppe fällt schräg ab statt rund zu bleiben." },
  ],
};
