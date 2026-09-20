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
  stand: "Fassung 357 — der Rest der Wunschliste",

  inArbeit: [
    { seit: "2026-09-20T02:01",
      text: "Galgenmaennchen/Aufdecken reihum spielen und benoten" },
    { seit: "2026-09-20T02:01", nurBetreiber: true,
      text: "Sechs alte doppelte Animationsnamen im Stilblatt aufloesen (lcRufAn, lcSteigt, lcFunke, lcSteigtAuf, lcZuengelt, lcSprichtPuls) — bei doppelten Namen gewinnt der letzte" },
    { seit: "2026-09-20T02:01", nurBetreiber: true,
      text: "TURN nachmessen: zwei Geraete an einem Tag in turn_nutzung" },
    { seit: "2026-09-20T02:01", nurBetreiber: true,
      text: "Standardbudget in der Edge-Function von 1 GB auf 25 GB hochsetzen" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-20T02:01",
      text: "Angel und Lasso sind jetzt zwei verschiedene Leinen: sie kommen von MEINEM Platz, krallen sich am fremden Bild fest und holen ein. Ich bleibe sitzen, nur der andere bewegt sich." },
    { seit: "2026-09-20T02:01",
      text: "Der Saugnapf-Pfeil bleibt stecken und schwingt gedaempft aus (neun Ausschlaege, jeder kleiner), mit eigenem Gummi-Geraeusch." },
    { seit: "2026-09-20T02:01",
      text: "Paintball trifft mit Namen genau ein Profilbild: Klecks, sechs Schlieren, Spritzer." },
    { seit: "2026-09-20T02:01",
      text: "Der Stromeffekt beim Sprechen macht echte Zickzack-Blitze; der alte Keilkranz (das Kreuz) ist weg." },
    { seit: "2026-09-20T02:01",
      text: "Die Schlagsahne kommt aus einer Spruehdose, baut sich Ring fuer Ring auf, dann kommt die Kirsche." },
    { seit: "2026-09-20T02:01",
      text: "Der Schneeball klatscht an die SEITE des Bildes, laeuft die Kante herunter und tropft davor ab." },
    { seit: "2026-09-20T02:01",
      text: "Der Strudel verzerrt das Bild wirklich in seinen Pixeln (SVG-Filter feTurbulence + feDisplacementMap)." },
    { seit: "2026-09-20T02:01",
      text: "Die Stoerung ist kein Klick-Effekt mehr, sondern ein Sprechbild: das Bild zerreisst, solange die Person spricht." },
    { seit: "2026-09-20T02:01",
      text: "Losfahren und Spielzuege: mein eigenes Bild rollt wie ein Rad hinueber oder huepft Platz fuer Platz." },
    { seit: "2026-09-20T02:01",
      text: "Ein Ei wird von oben auf dem Kopf aufgeschlagen; Schale klappt auf, Eiklar und Dotter laufen herunter." },
    { seit: "2026-09-20T02:01",
      text: "Regentropfen laufen jetzt an der runden Bildkante herunter und tropfen davor ab." },
    { seit: "2026-09-20T02:01",
      text: "Zwoelf Effekte aus der alten Wunschliste nachgeholt: Katapult, Strohhalm, Peitsche, Bowling, Billard, Kopfhoerer, Fensterluke, DJ-Platte, Ohrfeige, Basketball, Tennis, Kekskruemel — dazu ein Zufallsmodus." },
    { seit: "2026-09-20T02:01",
      text: "Das Platzmenue hat jetzt vier Spalten und passt mit 36 Kacheln ohne Rollen auf den Bildschirm (512 px statt 779 px)." },
    { seit: "2026-09-20T02:01",
      text: "Sechs neue Geraeusche gebaut: Gummi (Saugpfeil), Spruehdose, Ei-Knacken, Motor mit Bremse, Peitschenknall und Strohhalm." },
  ],
};
