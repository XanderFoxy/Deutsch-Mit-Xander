#!/usr/bin/env node
/* =========================================================
   DIE ELFTE HALTUNG: SEITLICHES SITZEN
   ---------------------------------------------------------
   GEWUENSCHT: „Das seitliche Sitzen, das wurde alles schon mal
   angelegt … zehn Haltungen da, aber keine sitzende im Profil."

   Nachgesehen: in der ganzen Git-Geschichte gab es nie mehr als
   zehn Haltungen, und „sitzen_seit" war nie dabei. Der Erzeuger
   bau-figuren.py lag nie im Projekt — die Figurendateien kamen
   als fertige Uploads.

   ABER: drei der zehn Haltungen SIND Seitenansichten — liegen,
   knien_vor und krabbeln. Damit muss nichts neu gezeichnet
   werden, und das ist auch gut so: neu zeichnen hiesse, eine
   fremde Hand neben zehn Bilder derselben Hand zu stellen.

   DIE IDEE
   Alle Haltungen haben DENSELBEN Ursprung: die Hueftmitte.
     * „liegen" ist der ganze Mensch im Profil, waagerecht, Kopf
       nach hinten (-x). Um 90 Grad gedreht steht der Oberkoerper
       aufrecht — Profilkopf, Hals, Brust, Becken.
     * „krabbeln" hat das Bein im Profil abgewinkelt: Oberschenkel
       nach unten, Unterschenkel nach hinten. Um -90 Grad gedreht
       zeigt der Oberschenkel nach vorn und der Unterschenkel nach
       unten — genau ein Sitzbein.
   Beide an der Huefte zusammengesetzt ergeben das seitliche
   Sitzen, ganz aus dem Original.

   UND DAS IST DER EIGENTLICHE GEWINN: dieselbe Zusammensetzung
   gilt Ebene fuer Ebene. Jede Haltung bringt ihre 47 Kleidungs-
   stuecke, 10 Frisuren und 4 Gesichter mit — die neue Haltung
   bekommt sie also alle, ohne dass ein Knopf fehlt.

   Geschrieben wird nach figuren/<typ>-teil4.js. Keine
   bestehende Datei wird angefasst.

   Aufruf:  node werkzeug/bau-seitsitz.js
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
const TYPEN = ["saeugling-m", "saeugling-w", "kleinkind-m", "kleinkind-w",
  "kind-m", "kind-w", "jugendlich-m", "jugendlich-w",
  "erwachsen-m", "erwachsen-w", "alt-m", "alt-w"];

/* WARUM NUR EINE KLEINE DATEI UND KEINE ZWOELF GROSSEN
   ---------------------------------------------------------
   Der erste Entwurf hat die zusammengesetzten Ebenen in zwoelf
   Dateien geschrieben: 380 kB je Figur, zusammen 4,5 MB. Das ist
   die logische Folge daraus, dass jede Ebene zwei Quellen hat —
   sie stuende dann zweimal im Projekt, einmal als „liegen" und
   „krabbeln" und noch einmal als Kopie darin.

   Beide Quellen sind aber im Browser laengst geladen, wenn die
   Figur gebraucht wird. Also wird hier nur NACHGEMESSEN (Breite,
   Hoehe, Boden, Gelenkpunkte je Figurentyp), und das Zusammen-
   setzen macht eine handvoll Zeilen zur Laufzeit. Aus 4,5 MB
   werden ein paar Kilobyte, und es kann nichts auseinanderlaufen:
   aendert sich „liegen", aendert sich das Sitzen mit.

   Geschrieben wird figuren/seitsitz.js. Keine bestehende Datei
   wird angefasst. */

const SCHNITT = '<defs>'
  + '<clipPath id="ssT" clipPathUnits="userSpaceOnUse">'
  + '<rect x="-600" y="-600" width="600" height="1200"/></clipPath></defs>';
function fuegen(oben, unten) {
  return SCHNITT
    + (unten ? '<g transform="rotate(-90)"><g clip-path="url(#ssT)">' + unten + '</g></g>' : "")
    + (oben ? '<g transform="rotate(90)"><g clip-path="url(#ssT)">' + oben + '</g></g>' : "");
}
const dreh90 = (p) => [-p[1], p[0]];
const r2 = (v) => Math.round(v * 100) / 100;

(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 400, height: 400 } });
  await pg.setContent("<body></body>");

  const tafel = {};
  for (const typ of TYPEN) {
    await pg.evaluate(() => { window.DMA_FIGUR = {}; });
    for (const s of ["", "-teil2", "-teil3"]) {
      await pg.addScriptTag({ content: fs.readFileSync(path.join(WURZEL, "figuren", typ + s + ".js"), "utf8") });
    }
    const roh = await pg.evaluate((typ) => {
      const H = window.DMA_FIGUR[typ].haltungen;
      return { liegenKoerper: H.liegen.koerper, krabbelnKoerper: H.krabbeln.koerper,
               liegenPunkte: H.liegen.punkte, sitzPunkt: H.sitzen.punkte.sitz,
               stuecke: Object.keys(H.liegen.kleidung || {}).length,
               frisuren: Object.keys(H.liegen.frisuren || {}).length,
               gesichter: Object.keys(H.liegen.gesichter || {}).length };
    }, typ);

    const zusammen = fuegen(roh.liegenKoerper, roh.krabbelnKoerper);
    const mass = await pg.evaluate((koerper) => {
      const ns = "http://www.w3.org/2000/svg";
      const s = document.createElementNS(ns, "svg");
      s.setAttribute("viewBox", "-300 -300 600 600");
      s.style.cssText = "position:absolute;left:-9999px;width:600px";
      s.innerHTML = (window.DMA_FIGUR_DEFS || "") + "<g id='mm'>" + koerper + "</g>";
      document.body.appendChild(s);
      const b = s.querySelector("#mm").getBBox();
      s.remove();
      return { l: b.x, r: b.x + b.width, o: b.y, u: b.y + b.height };
    }, zusammen);

    const L = roh.liegenPunkte;
    tafel[typ] = {
      breite: r2(mass.r - mass.l), hoehe: r2(mass.u - mass.o), fuss: r2(mass.u),
      punkte: {
        hand_links: dreh90(L.hand_links).map(r2), hand_rechts: dreh90(L.hand_rechts).map(r2),
        kopf: dreh90(L.kopf).map(r2), mund: dreh90(L.mund).map(r2),
        ruecken: dreh90(L.ruecken).map(r2), sitz: roh.sitzPunkt,
      },
    };
    console.log(`${typ.padEnd(14)} breite ${String(tafel[typ].breite).padStart(7)}`
      + `  hoehe ${String(tafel[typ].hoehe).padStart(7)}  fuss ${String(tafel[typ].fuss).padStart(6)}`
      + `  Stücke ${roh.stuecke} · Frisuren ${roh.frisuren} · Gesichter ${roh.gesichter}`);
  }
  await br.close();

  const datei = `// Erzeugt von werkzeug/bau-seitsitz.js — nicht von Hand ändern.
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
window.DMA_SEITSITZ_MASS = ${JSON.stringify(tafel)};
(function () {
  var SCHNITT = ${JSON.stringify(SCHNITT)};
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
`;
  fs.writeFileSync(path.join(WURZEL, "figuren", "seitsitz.js"), datei);
  console.log(`\nfiguren/seitsitz.js — ${(datei.length / 1024).toFixed(1)} kB statt 4,5 MB.`);
})();
