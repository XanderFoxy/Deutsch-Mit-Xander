/* =========================================================
   DIE WERKSTATT — woran GERADE gebaut wird
   ---------------------------------------------------------
   GEWÜNSCHT, und zwar genau so:
   „Zeige in der Werkstatt, woran du jetzt zuletzt gearbeitet
    hast — nicht nur das Datum, sondern auch die Uhrzeit. Dabei
    sind alle Sachen, die erledigt sind, irrelevant. Alles was
    jetzt gerade geupdatet wird, ist relevant. Und wenn Updates
    nicht mehr in Arbeit sind, verschwindet das Zeichen auch
    wieder."

   Daraus folgen drei harte Regeln, und die Datei kann gar nichts
   anderes:

   1. HIER STEHT NUR, WAS OFFEN IST.
      Es gibt keine Liste „fertig" mehr. Was fertig ist, ist
      fertig — es gehört in den Ticker oder nirgendwohin, aber
      nicht in eine Werkstatt.

   2. JEDE ZEILE TRÄGT TAG UND UHRZEIT.
      „seit" ist der Zeitpunkt, an dem die Arbeit begonnen hat.
      Format: "2026-09-17T23:40" (Ortszeit). Damit sieht man
      nicht nur DASS gebaut wird, sondern WIE FRISCH die Baustelle
      ist.

   3. IST DIE LISTE LEER, IST DAS ZEICHEN WEG.
      Kein leerer Knopf, kein „zurzeit nichts". Das Symbol
      erscheint, wenn gebaut wird, und verschwindet, wenn nicht.

   nurBetreiber (oben, für alles): true = nur du siehst die Blase.
   nurBetreiber (an einer Zeile): diese eine Zeile nur für dich.
   ========================================================= */
window.DMA_WERKSTATT = {
  /* false = alle sehen, dass gerade gebaut wird. Auf true
     umstellen, wenn es dich allein angehen soll. */
  nurBetreiber: false,

  inArbeit: [
    { seit: "2026-09-18T00:20",
      text: "Der Aussprache-Trainer bekommt getrennte Knöpfe: „noch einmal sprechen“ und „nebeneinander anhören“ sind zweierlei und dürfen nicht dasselbe auslösen." },
    { seit: "2026-09-18T00:20",
      text: "Blockierte Stellen in den Szenen — Dinge, die hinter einem Regalbrett liegen und sich nicht antippen lassen (Arztpraxis, Apotheke)." },
    { seit: "2026-09-18T00:20",
      text: "Die Menschen in der Bilderwelt: Körperbau, Haltung und die Stellen, an denen Figuren neben statt in den Möbeln sitzen." },
    { seit: "2026-09-18T00:20",
      text: "Der Hund, der Welpe und der Tyrannosaurus bekommen wieder mehr Form und Schattierung." },
    { seit: "2026-09-18T00:20",
      text: "Die Wolken im Kopf der Seite: weicher, mit mehr Struktur — und ohne den Sprung beim Laden." },
    { seit: "2026-09-18T00:20", nurBetreiber: true,
      text: "Das Wörterbuch mit deiner eigenen Stimme über ElevenLabs, Niveau für Niveau ab A1." },
  ],
};
