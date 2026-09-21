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
  stand: "Runde 67 — das Tor ist eine stehende Wasserwand, und jeder Effekt geht auch an ALLE",

  inArbeit: [
    { seit: "2026-09-21T09:27",
      text: "Billard-Prallphysik" },
    { seit: "2026-09-21T09:27",
      text: "Whiteboard neu denken, alles ins Profil speichern statt lokal" },
    { seit: "2026-09-21T09:27", nurBetreiber: true,
      text: "GUTHABEN NOETIG: ueber-04b, ueber-03b und ueber-05 fehlen noch auf Greenscreen. Das ElevenLabs-Guthaben ist alle - zuletzt 14.152 von 19.439 noetigen Credits." },
    { seit: "2026-09-21T09:27", nurBetreiber: true,
      text: "Zwei Saetze neu einsprechen: „Schoen, dass du da bist! Ich bin Alex — Musiker und deutscher Muttersprachler. Ich helfe dir gerne mit Deutsch.\"" },
    { seit: "2026-09-21T09:27", nurBetreiber: true,
      text: "Und: „Oben stehen drei Knoepfe: der Kalender, dein Profilbild, die Kaffeetasse. Im Kalender loest du jeden Tag eine Aufgabe und kommst von da zur Tagesgeschichte — eine Leseuebung in jedem Niveau und in vielen Sprachen.\"" },
    { seit: "2026-09-21T09:27", nurBetreiber: true,
      text: "Frage: die Kompass-Erklaerung im Tutor ist mit 148 Woertern die laengste. Kuerzen — oder so lassen?" },
  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
    { seit: "2026-09-21T09:27",
      text: "Das Tor dreht sich nicht mehr. Es ist eine stehende Wasserflaeche: Ringe laufen von der Mitte nach aussen und werden dabei flacher" },
    { seit: "2026-09-21T09:27",
      text: "Fuenf Ringe statt drei - bei dreien war die Flaeche zeitweise glatt, und glattes Wasser sieht aus wie Lack" },
    { seit: "2026-09-21T09:27",
      text: "Die Ringe liegen IN der Flaeche und laufen am Rand aus, statt ueber die Fassung hinauszuwachsen" },
    { seit: "2026-09-21T09:27",
      text: "Der Glanzpunkt bei 44/38 Prozent ist weg - das war ein Kugel-Glanzlicht, und genau daran las das Auge eine Kugel statt einer Wand" },
    { seit: "2026-09-21T09:27",
      text: "Dazu der helle Saum am Ring, Tropfen als Partikel und zwei Plasmaboegen, die am Rand zucken. Nur die drehen sich noch" },
    { seit: "2026-09-21T09:27",
      text: "Die Tropfen sind aus k gerechnet statt gewuerfelt - so sehen sie auf JEDEM Geraet gleich aus" },
    { seit: "2026-09-21T09:27",
      text: "Jeder Platz-Effekt geht jetzt auch an ALLE auf einmal: /tritt alle, /kuss alle, /bombe alle, /umarmen alle" },
    { seit: "2026-09-21T09:27",
      text: "GEMESSEN: Tritt, Kuss und Umarmung treffen damit alle fuenf Plaetze - und mit einem Namen weiterhin genau einen" },
    { seit: "2026-09-21T09:27",
      text: "Es faehrt ausdruecklich als * mit. Vorher haette es nur ueber den Rueckfall geklappt, also WEIL die Namenssuche danebengeht" },
    { seit: "2026-09-21T09:27",
      text: "Bei der Umarmung ueberschrieb die Namenssuche die Liste wieder - zu * heisst natuerlich niemand. Sie laeuft bei * gar nicht erst an" },
    { seit: "2026-09-21T09:27",
      text: "Den Befehl /umarmen gab es gar nicht, nur /drueck. Jetzt fuehrt beides zum selben" },
    { seit: "2026-09-21T09:27",
      text: "Die Zeile bleibt deutsch: abgezaehlt 33 Saetze, die ganz verschieden enden. Eine Regel, die ein Wort anhaengt, kann da nicht stimmen - deshalb wird die Praeposition gekappt und eine feste Wendung angehaengt" },
  ],
};
