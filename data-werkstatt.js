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
  stand: "Runde 65 — Maulwurf im Kreis, Lasso fesselt am Platz, Lok mit Details, Greifvogel, 3-Meter-Turm, Aufblasen",

  inArbeit: [
    { seit: "2026-09-21T07:16",
      text: "Tor als stehende Wasserwand mit Partikeln und Plasma" },
    { seit: "2026-09-21T07:16",
      text: "Peitsche: echter gewickelter Griff, und eine mehrschwaenzige fuer alle auf einmal" },
    { seit: "2026-09-21T07:16",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T07:16",
      text: "Rohrreise: der Reisende ist auf beiden Seiten gleichzeitig zu sehen" },
    { seit: "2026-09-21T07:16",
      text: "Effekte fuer ALLE gleichzeitig - umarmen, kuessen, treten, Bombe" },
    { seit: "2026-09-21T07:16",
      text: "Helikopter braucht noch mehr Details" },
    { seit: "2026-09-21T07:16",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T07:16", nurBetreiber: true,
      text: "IN ARBEIT: die fuenf Tutorfilme auf Greenscreen neu erzeugen - freigegeben mit „Ja, kuemmere dich um die Videos\". Voranschlag 1,73 $ je 9,8 Sekunden, alle fuenf rund 9,60 $." },
    { seit: "2026-09-21T07:16", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T07:16", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T07:16", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
    { seit: "2026-09-21T07:16", nurBetreiber: true,
      text: "Die fuenf neuen Geraeusche haben zusammen 0,03 $ gekostet (20 Erzeugungen, je vier Fassungen zur Auswahl)." },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T07:16",
      text: "Der Maulwurf graebt jetzt wirklich aus DEINEM Bildkreis heraus — rund, gleich gross, an derselben Stelle" },
    { seit: "2026-09-21T07:16",
      text: "Das Loch bleibt liegen; unterwegs sieht man nur die aufgeschuettete Erde als Streifen bis zum Ziel" },
    { seit: "2026-09-21T07:16",
      text: "Am Ziel geht ein zweites rundes Loch auf, und dort steigt das Bild heraus" },
    { seit: "2026-09-21T07:16",
      text: "Das Lasso legt sich jetzt am PLATZ des anderen um ihn — und wandert beim Ziehen mit" },
    { seit: "2026-09-21T07:16",
      text: "GEMESSEN, warum es vorher falsch aussah: bei 900 ms lag die Schlinge auf x=266, der Kreis aber auf x=234. Sie blieb stehen, waehrend das Bild unter ihr weggezogen wurde" },
    { seit: "2026-09-21T07:16",
      text: "Gezogen wird in DREI kraeftigen Zuegen mit Pausen dazwischen: 46, 76 und 100 Prozent der Strecke" },
    { seit: "2026-09-21T07:16",
      text: "Das Seil bleibt die ganze Zeit straff und wird nur kuerzer — um genau den Anteil, den der andere naeher kommt" },
    { seit: "2026-09-21T07:16",
      text: "Neues Geraeusch seilstramm: trockenes Knarzen von Hanf unter Spannung, nicht tonal" },
    { seit: "2026-09-21T07:16",
      text: "Der Lassowurf klang bisher nach einem TRITT — jetzt zischt das Seil" },
    { seit: "2026-09-21T07:16",
      text: "Die Reiselok hat Puffer, runde Rauchkammer mit Tuerkreuz, Laterne, Dampfdom, Sanddom, Pfeife, Zylinder und ein gewoelbtes Dach" },
    { seit: "2026-09-21T07:16",
      text: "Ihre Raeder haben acht Speichen, Nabe und Gegengewicht, und die Kuppelstange wandert im Kreis wie bei einer echten Lok" },
    { seit: "2026-09-21T07:16",
      text: "/lok allein zeigt weiterhin den Film — das steht jetzt auch in der Befehlsliste, vorher stand dort nur /lok 5" },
    { seit: "2026-09-21T07:16",
      text: "NEU: der Greifvogel. Er packt dein Bild in die Faenge und traegt es hinueber (/greifvogel 5)" },
    { seit: "2026-09-21T07:16",
      text: "Sein Fluegelschlag ist ungleich, wie bei einem echten Vogel: 30 Prozent Abschlag, 70 Prozent Aufschlag — und der Koerper steigt genau beim Abschlag" },
    { seit: "2026-09-21T07:16",
      text: "NEU: der 3-Meter-Turm (/turm 5). Leiter hoch, Anlauf auf dem Brett, Sprung mit ganzer Drehung, untertauchen, wieder hoch wie ein Gummireifen" },
    { seit: "2026-09-21T07:16",
      text: "Das Platschen kommt beim EINSCHLAG bei 2730 ms, nicht am Ende — genau so gewuenscht" },
    { seit: "2026-09-21T07:16",
      text: "NEU: aufblasen (/aufblasen Name). Fuenf Pumpenhube, dazwischen federt das Gummi zurueck, dann zittert es, dann platzt es" },
    { seit: "2026-09-21T07:16",
      text: "Fuenf neue Geraeusche: seilstramm, greifvogel, aufblasen, platzen, sprungbrett" },
  ],
};
