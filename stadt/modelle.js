/* Welche Modelle es gibt – jede Datei in stadt/modelle/ meldet sich selbst an. */
window.STADT = window.STADT || {};
STADT.MODELL_DATEIEN = [
  "fachwerkhaus", "fachwerkerker", "wassermuehle", "bahnhof",
  "kirche", "koelnerdom",
  /* FASSUNG 795 — eigene Modelle für die Spielgebäude und Wahrzeichen */
  "kuhstall", "huehnerstall", "rathaus", "schule", "kaserne", "gefaengnis", "bergwerk", "brauerei", "bibliothek", "krankenhaus", "labor",
  "neuschwanstein", "fernsehturm", "holstentor", "brandenburger",
  "rathaus_doebeln",
  "weihnachtsbaum", "marktbude", "pyramide", "krippe", "karussell", "schneemann",
  "brunnen", "laterne", "bank", "bruecke", "zaun",
  "tanne", "laubbaum", "obstbaum",
  "tretboot", "bootshaus",
  "pferdebahn", "pferdewagen_korn", "gleis_pferdebahn",
  "auto_viper",
  "auto_batmobil",
  "menschen"
];
/* Rundum gleiche Dinge: die Drehung ändert das Bild nicht → ein Bild im Speicher für alle Winkel */
STADT.OHNE_DREHUNG = ["tanne", "laubbaum", "obstbaum"];
