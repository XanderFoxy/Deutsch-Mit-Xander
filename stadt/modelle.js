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
  /* FASSUNG 809 — die Eisenbahn (Dampflok BR 50 mit Tender, drei Güterwagen) */
  "dampflok", "gueterwagen",
  "menschen",
  /* FASSUNG 811 — XANDER: „Tiere im Dorf: Hühner, Kühe, Schweine – nachts nicht draußen" (Laufblätter für die leichte Stadt) */
  "kuh", "schwein", "huhn",
  /* FASSUNG 833 — XANDER (Funk 255): „die Sachen die ich weiter baue tauchen niemals auf der Karte auf die Jagdhütte oder Kuhstall oder sowas" */
  "schweinestall", "holzhuette", "jagdhuette", "sternwarte"
];
/* Rundum gleiche Dinge: die Drehung ändert das Bild nicht → ein Bild im Speicher für alle Winkel */
STADT.OHNE_DREHUNG = ["tanne", "laubbaum", "obstbaum"];
