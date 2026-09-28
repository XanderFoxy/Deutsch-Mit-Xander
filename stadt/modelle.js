/* Welche Modelle es gibt – jede Datei in stadt/modelle/ meldet sich selbst an. */
window.STADT = window.STADT || {};
STADT.MODELL_DATEIEN = [
  "fachwerkhaus", "fachwerkerker", "wassermuehle", "bahnhof",
  "kirche", "koelnerdom",
  "weihnachtsbaum", "marktbude", "pyramide", "krippe", "karussell", "schneemann",
  "brunnen", "laterne", "bank", "bruecke", "zaun",
  "tanne", "laubbaum", "obstbaum",
  "menschen"
];
/* Rundum gleiche Dinge: die Drehung ändert das Bild nicht → ein Bild im Speicher für alle Winkel */
STADT.OHNE_DREHUNG = ["tanne", "laubbaum", "obstbaum"];
