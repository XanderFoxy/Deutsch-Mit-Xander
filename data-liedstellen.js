/* =========================================================
   DIE SONGABSCHNITTE — je Lied, in Sekunden
   ---------------------------------------------------------
   XANDER (Runde 88): „Man soll die Möglichkeit haben, einen
   Teilbereich des Liedes festzusetzen und zu benennen wie
   einen Button, den man dann daraus generiert … die Lieder
   sollen getaggt sein mit ihren Songabschnitten, dass ich
   die als Buttons anwählen kann, die Songabschnitte, die ich
   festlege, und die sollen für alle hörbar werden."

   UND ER HAT DIE ZEITEN SELBST DIKTIERT:
     „125-167 ist die Zeitmarke für [A Lovers] Fairytale."
     „Für Nah habe ich 45 Sekunden bis 1 Minute 19."
     „Für Ein Leben lang habe ich 1 Minute 18 bis 1 Minute 53."
     „Für Du habe ich 52 Sekunden bis 1 Minute 32."
     „Setze die Zeit, die ich dir am Anfang gesagt habe, als
      Letzteren; bei den anderen ist es immer der erste."

   Deshalb heisst der Abschnitt bei „A Lovers Fairytale"
   „Letzter Refrain" und bei den drei anderen „Refrain" —
   dort ist es jeweils der erste.

   ALLES IN SEKUNDEN. „1:19" sind 79 Sekunden; gerechnet wird
   nie mit Doppelpunkten, angezeigt immer mit.

   Zwei Lieder hat er noch nicht bemasst („Nur mit mir" und
   „Mein stiller Schmerz"). Dort steht der Anfang, den
   werkzeug/refrain-messen.js gemessen hat, und als Ende die
   halbe Minute danach — bis er eigene Zeiten nennt.

   WER HIER EINEN ABSCHNITT DAZUSCHREIBT, hat ihn sofort im
   Menü. Was ein Benutzer selbst festlegt, landet dagegen in
   seinem Profil und nicht in dieser Datei.
   ========================================================= */
window.DMA_LIEDSTELLEN = {
  "One Day In Rome - A Lovers Fairytale.mp3": [
    { name: "Letzter Refrain", ab: 125, bis: 167 }
  ],
  "Nah (2011).mp3": [
    { name: "Refrain", ab: 45, bis: 79 }
  ],
  "One Day In Rome - Ein Leben Lang.mp3": [
    { name: "Refrain", ab: 78, bis: 113 }
  ],
  "Du.mp3": [
    { name: "Refrain", ab: 52, bis: 92 }
  ],
  /* Noch nicht von Hand bemasst — gemessener Refrainanfang. */
  "Nur Mit Mir (Demo 1)-3.mp3": [
    { name: "Refrain (gemessen)", ab: 55, bis: 85 }
  ],
  "promised-eden_mein-stiller-schmerz.mp3": [
    { name: "Refrain (gemessen)", ab: 173, bis: 203 }
  ]
};
