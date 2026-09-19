// Erzeugt von werkzeug/bau-seitsitz.js — nicht von Hand ändern.
//
// DIE ELFTE HALTUNG: SEITLICHES SITZEN.
// Sie ist NICHT neu gezeichnet. Drei der zehn gelieferten Haltungen
// sind bereits Seitenansichten: liegen, knien_vor und krabbeln.
// Alle Haltungen haben denselben Ursprung — die Hüftmitte. Richtet
// man "liegen" um 90 Grad auf, steht der Oberkörper im Profil;
// dreht man "krabbeln" um -90 Grad, zeigt der Oberschenkel nach
// vorn und der Unterschenkel nach unten. Das ist ein Sitzbein.
// Beides an der Hüfte zusammengesetzt ergibt das seitliche Sitzen,
// ganz aus der Hand, die auch die anderen zehn gezeichnet hat.
//
// Und weil dieselbe Zusammensetzung Ebene für Ebene gilt, bekommt
// die neue Haltung alle Kleidungsstücke, Frisuren und Gesichter
// automatisch mit — es fehlt kein einziger Knopf.
//
// Zusammengesetzt wird zur Laufzeit: die Quellen sind ohnehin
// geladen. Hier stehen nur die nachgemessenen Maße.
window.DMA_FIGUR = window.DMA_FIGUR || {};
window.DMA_SEITSITZ_MASS = {"saeugling-m":{"breite":28.5,"hoehe":51.19,"fuss":20.66,"punkte":{"hand_links":[-7.65,2.76],"hand_rechts":[4.01,4.06],"kopf":[0.17,-24.45],"mund":[-0.68,-18.41],"ruecken":[0.05,-11.98],"sitz":[0,2.97]}},"saeugling-w":{"breite":28.02,"hoehe":50.51,"fuss":20.46,"punkte":{"hand_links":[-7.54,2.71],"hand_rechts":[3.95,4],"kopf":[0.17,-24.06],"mund":[-0.67,-18.11],"ruecken":[0.06,-11.84],"sitz":[0,2.95]}},"kleinkind-m":{"breite":45.02,"hoehe":89.87,"fuss":38.12,"punkte":{"hand_links":[-12.95,0.62],"hand_rechts":[6.28,2.25],"kopf":[-0.37,-43.2],"mund":[-1.5,-35.22],"ruecken":[-0.6,-22.27],"sitz":[0,4.09]}},"kleinkind-w":{"breite":44.62,"hoehe":88.97,"fuss":37.82,"punkte":{"hand_links":[-12.81,0.6],"hand_rechts":[6.21,2.23],"kopf":[-0.37,-42.71],"mund":[-1.48,-34.82],"ruecken":[-0.59,-22.07],"sitz":[0,4.06]}},"kind-m":{"breite":68.51,"hoehe":129.94,"fuss":62.2,"punkte":{"hand_links":[-21.26,10.98],"hand_rechts":[11.22,13.21],"kopf":[-0.81,-57.38],"mund":[-2.03,-48.69],"ruecken":[-1.02,-29.58],"sitz":[0,5.27]}},"kind-w":{"breite":67.82,"hoehe":128.73,"fuss":61.61,"punkte":{"hand_links":[-21.05,10.87],"hand_rechts":[11.11,13.09],"kopf":[-0.8,-56.84],"mund":[-2.01,-48.23],"ruecken":[-1.01,-29.14],"sitz":[0,5.34]}},"jugendlich-m":{"breite":81.41,"hoehe":164.36,"fuss":86.07,"punkte":{"hand_links":[-25.47,14.63],"hand_rechts":[13.63,17.14],"kopf":[-1.15,-66.91],"mund":[-2.34,-58.5],"ruecken":[-1.28,-34.85],"sitz":[0,6.07]}},"jugendlich-w":{"breite":80.77,"hoehe":162.83,"fuss":85.22,"punkte":{"hand_links":[-25.21,14.5],"hand_rechts":[13.48,17],"kopf":[-1.14,-66.33],"mund":[-2.32,-58],"ruecken":[-1.26,-33.88],"sitz":[0,6.65]}},"erwachsen-m":{"breite":87.89,"hoehe":179.16,"fuss":94.77,"punkte":{"hand_links":[-26.78,11.49],"hand_rechts":[13.97,14.06],"kopf":[-1.38,-72.44],"mund":[-2.54,-64.2],"ruecken":[-1.56,-39.93],"sitz":[0,7.32]}},"erwachsen-w":{"breite":82.64,"hoehe":168.13,"fuss":88.84,"punkte":{"hand_links":[-25.14,10.76],"hand_rechts":[13.09,13.23],"kopf":[-1.3,-68.12],"mund":[-2.39,-60.37],"ruecken":[-1.43,-36.66],"sitz":[0,7.71]}},"alt-m":{"breite":92.32,"hoehe":173.59,"fuss":92.12,"punkte":{"hand_links":[-26.41,13.01],"hand_rechts":[13.93,15.57],"kopf":[-7.76,-69.8],"mund":[-9.61,-61.81],"ruecken":[-3.43,-36.74],"sitz":[0,7.3]}},"alt-w":{"breite":85.76,"hoehe":160.68,"fuss":85.19,"punkte":{"hand_links":[-24.46,12],"hand_rechts":[12.9,14.44],"kopf":[-7.2,-64.71],"mund":[-8.91,-57.3],"ruecken":[-3.14,-33.82],"sitz":[0,7.65]}}};
(function () {
  var SCHNITT = "<defs><clipPath id=\"ssT\" clipPathUnits=\"userSpaceOnUse\"><rect x=\"-600\" y=\"-600\" width=\"600\" height=\"1200\"/></clipPath></defs>";
  function fuegen(oben, unten) {
    return SCHNITT
      + (unten ? '<g transform="rotate(-90)"><g clip-path="url(#ssT)">' + unten + '</g></g>' : "")
      + (oben ? '<g transform="rotate(90)"><g clip-path="url(#ssT)">' + oben + '</g></g>' : "");
  }
  /* Kopf, Gesicht und Frisur kommen ganz aus "liegen". */
  function aufrichten(inh) {
    return inh ? SCHNITT + '<g transform="rotate(90)"><g clip-path="url(#ssT)">' + inh + '</g></g>' : "";
  }
  window.DMA_SEITSITZ_BAUEN = function (nurTyp) {
    var alle = window.DMA_FIGUR || {}, gebaut = 0;
    Object.keys(alle).forEach(function (typ) {
      if (nurTyp && typ !== nurTyp) return;
      var bau = alle[typ];
      if (!bau || !bau.haltungen) return;
      var H = bau.haltungen;
      if (H.sitzen_seit) return;                 // schon da
      if (!H.liegen || !H.krabbeln || !H.sitzen) return;   // Teile fehlen noch
      var m = (window.DMA_SEITSITZ_MASS || {})[typ];
      if (!m) return;
      var L = H.liegen, K = H.krabbeln;
      var kleidung = {};
      var namen = {};
      Object.keys(L.kleidung || {}).forEach(function (k) { namen[k] = 1; });
      Object.keys(K.kleidung || {}).forEach(function (k) { namen[k] = 1; });
      Object.keys(namen).forEach(function (k) {
        kleidung[k] = fuegen((L.kleidung || {})[k] || "", (K.kleidung || {})[k] || "");
      });
      var frisuren = {}, gesichter = {};
      Object.keys(L.frisuren || {}).forEach(function (k) { frisuren[k] = aufrichten(L.frisuren[k]); });
      Object.keys(L.gesichter || {}).forEach(function (k) { gesichter[k] = aufrichten(L.gesichter[k]); });
      H.sitzen_seit = {
        breite: m.breite, hoehe: m.hoehe, fuss: m.fuss, punkte: m.punkte,
        koerper: fuegen(L.koerper, K.koerper),
        kleidung: kleidung, frisuren: frisuren, gesichter: gesichter,
      };
      gebaut++;
    });
    return gebaut;
  };
  window.DMA_SEITSITZ_BAUEN();
})();
