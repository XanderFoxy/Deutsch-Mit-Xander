#!/usr/bin/env node
/* =========================================================
   RUNDE 71 — DIE ZEICHNUNGEN, ERSTER TEIL
   ---------------------------------------------------------
   Aus seiner Liste: das Tor, die Feder und die Liane.
   Jede Regel haelt etwas fest, das vorher GEMESSEN wurde —
   am Bild oder an der Rechnung, nicht am Gefuehl.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = ohneK(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"));
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const cssK = ohneK(css);

console.log("\nDAS TOR SITZT MITTIG AUF DEM BILD");
pruefe("der Versatz wird gemessen, nicht geschaetzt",
  /function lcBildVersatz\(platzEl\)/.test(js)
  && /return \(k\.top \+ k\.height \/ 2\) - \(p\.top \+ p\.height \/ 2\);/.test(js));
pruefe("und das Tor benutzt ihn",
  /setzen\(tor, wo\.x, wo\.y \+ lcBildVersatz\(ab\.el\)\);/.test(js));
/* NACHGEMESSEN im Browser (werkzeug, Playwright): Mitte des Tors
   gegen Mitte des Bildes — 0 px in beiden Richtungen. */

console.log("\nDAS TOR IST SCHWARZ UND HAT SCHICHTEN");
pruefe("drei durchsichtige Schichten und ein Spiegel",
  (js.match(/<i class="lc-tor-schicht/g) || []).length === 3
  && /<i class="lc-tor-spiegel">/.test(js));
pruefe("das Wasserblau ist weg",
  !/\.lc-tor-wasserwand \.lc-tor-wasser \{[\s\S]{0,300}?#56b9e4/.test(cssK)
  && /\.lc-tor-wasserwand \.lc-tor-wasser \{/.test(cssK));
pruefe("die Flaeche ist dunkel",
  /linear-gradient\(to bottom, #2a2739 0%, #1a1826 48%, #0d0c14 100%\)/.test(cssK));
pruefe("der Spiegel liegt AUF der Flaeche, nicht als eigene Schicht darueber",
  /@keyframes lcTorSpiegelFlaecheR71/.test(cssK)
  && /animation: lcTorSpiegelFlaecheR71 3\.4s/.test(cssK));
pruefe("und alles laeuft langsam",
  /\.lc-tor-wasserwand \{ animation-duration: 3\.4s; \}/.test(cssK)
  && /portal: 3400,/.test(js));

console.log("\nDIE FEDER BLENDET NICHT MEHR AUS");
pruefe("jedes Sprungbild traegt seine Deckkraft",
  /offset: Math\.min\(1, \(t \* hin\) \/ dauer\)/.test(js)
  && /opacity: 1,\s*\n\s*offset: Math\.min\(1, \(t \* hin\) \/ dauer\)/.test(js));
pruefe("und verschwunden wird erst nach der Ankunft",
  /offset: Math\.min\(0\.97, \(hin \+ 180\) \/ dauer\)/.test(js));

console.log("\nDIE LIANE HOLT ANLAUF UND BLEIBT IM BILD");
pruefe("sie haengt von der Kartenkante, nicht darueber",
  /const kanteL = \(kk\.top - rk\.top\) \+ 4;/.test(js)
  && /const hochL = Math\.max\(kanteL, -d \* 3\.2\);/.test(js)
  && !/Math\.min\(\(kk\.top - rk\.top\) - d \* 0\.25/.test(js));
pruefe("der Anlauf geht GEGEN die Richtung des Ziels",
  /const anlaufX = -dxL \* 0\.16/.test(js));
pruefe("und er kommt vor dem Schwung",
  js.indexOf("opacity: 1, offset: vorL") > 0
  && js.indexOf("opacity: 1, offset: vorL")
     < js.indexOf('+ "px) translate(-50%, -50%) rotate(0deg)", opacity: 1,'));
pruefe("gelandet wird nicht mit einer Ueberblendung auf der Stelle",
  /const wegX = dxL \+ dxL \* 0\.22, wegY = dyL - d \* 0\.9;/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 71, erster Teil, sitzt.\n");
process.exit(fehler ? 1 : 0);
