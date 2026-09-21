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

console.log("\nDER 3-METER-TURM BLEIBT STEHEN");
pruefe("er blendet erst NACH dem Einschlag aus (2730 ms)",
  /offset: t\(2900\) \}/.test(js) && /offset: t\(3300\) \}/.test(js)
  && !/scaleY\(1\)", offset: t\(1500\) \}/.test(js));
pruefe("das Brett ist laenger — 48 statt 39 Einheiten",
  /d="M11 22 L59 22 L59 27 L11 27 Z"/.test(js));
pruefe("und die Leiter steht weiter hinten",
  /d="M14 119 V28 M28 119 V28"/.test(js));
pruefe("das Brett federt beim Anlauf",
  /brett\.animate\(\[/.test(js) && /rotate\(-4\.6deg\)", offset: t\(1420\)/.test(js));

console.log("\nDIE ROHRREISE GEHT INS ROHR");
pruefe("die Einstiegsroehre steht VOR dem reisenden Platz",
  /\.lc-roehre-rein \{ z-index: 8; \}/.test(cssK));
pruefe("und das zweite Bild steigt HINTER der Zielroehre heraus",
  /\.lc-roehre-raus \{ z-index: 4; \}/.test(cssK)
  && /\.lc-rohr-doppel \{[\s\S]{0,420}?z-index: 3;/.test(cssK));
pruefe("der duenne gruene Ring ist weg",
  !/box-shadow: 0 0 0 3px #57a83c/.test(cssK));

console.log("\nDER GREIFVOGEL KRALLT WIRKLICH ZU");
pruefe("die Beine stehen fast senkrecht statt gespreizt",
  /d="M81 46 L80 56 M89 46 L90 56"/.test(js)
  && !/d="M79 46 L76 55 M91 46 L94 55"/.test(js));
pruefe("die Faenge sind eine eigene Gruppe",
  /<g class="lc-greif-faenge">/.test(js));
pruefe("und sie packen beim Aufnehmen zu",
  /faenge\.animate\(\[/.test(js)
  && /transform: "scaleX\(\.72\) scaleY\(\.86\)", offset: 0\.16/.test(js));

console.log("\nDER HELIKOPTER IST KURZ UND DUNKEL");
pruefe("die Zelle ist kuerzer und hoeher (2,3 statt 3,3 zu 1)",
  /d="M10 40 Q8 21 30 16 L60 16/.test(js));
pruefe("Licht oben, Schatten unten",
  /lc-heli-licht/.test(js) && /lc-heli-schatten/.test(js)
  && /\.lc-heli-licht    \{ fill: #40495a; \}/.test(cssK)
  && /\.lc-heli-schatten \{ fill: #0c0e13; \}/.test(cssK));
pruefe("das Spielzeugblau ist weg",
  /\.lc-heli-rumpf    \{ fill: #1c2029; \}/.test(cssK));
pruefe("und das Bild sitzt als Fenster in der Kanzel, nicht als Kreis davor",
  /\.lc-heli-kanzel \{[\s\S]{0,260}?border-radius: 34% 34% 26% 26%/.test(cssK));
/* NACHGEMESSEN im Browser: Glas 104…156 px, Fenster 110…152 px —
   das Fenster liegt wirklich im Glas. */

console.log("\nDAS PFERD IST EIN PONY GEWORDEN");
pruefe("kurze Beine: Rumpf tiefer, Hufe gleich",
  /d="M40 56 Q38 42 58 39 L94 39/.test(js)
  && /d="M62 74 L57 82 L62 89 L59 94"/.test(js)
  && !/d="M60 64 L54 76 L60 86 L57 94"/.test(js));
pruefe("kurzer, dicker Hals und groesserer Kopf",
  /lc-pferd-hals" d="M102 46 Q113 40 117 28 L130 30/.test(js)
  && /lc-pferd-kopf" d="M114 26 Q121 15 132 16 Q143 18 146 28/.test(js));
pruefe("runde Ohren statt spitzer",
  /lc-pferd-ohr" d="M117 24 Q117 14 122 12 Q125 17 124 23 Z"/.test(js));
pruefe("dicke Maehne — zwei Teile statt einem",
  (js.match(/class="lc-pferd-maehne"/g) || []).length === 2);
pruefe("und der Reiter sitzt im Sattel, nicht darueber",
  /\.lc-pferd-reiter \{ top: 19%; \}/.test(cssK));

console.log("\nDAS FLUGZEUG HAT DETAILS UND EIN FENSTER");
pruefe("eine Reihe Kabinenfenster",
  /lc-flieger-kabinenfenster/.test(js) && /\.lc-flieger-kabinenfenster \{/.test(cssK));
pruefe("Cockpitscheibe, Tueren, Zierstreifen",
  /lc-flieger-cockpit/.test(js) && /lc-flieger-tuer/.test(js)
  && /lc-flieger-streifen/.test(js));
pruefe("Fahrwerk mit Raedern",
  /lc-flieger-fahrwerk/.test(js)
  && (js.match(/class="lc-flieger-rad"/g) || []).length === 2);
pruefe("und das Bild ist kleiner als der Rumpf",
  /\.lc-flieger-fenster \{\s*\n\s*left: 70%;[\s\S]{0,200}?height: 25\.4%;/.test(css));
/* GERECHNET: der Rumpf ist 38 % der Bildhoehe hoch (y 16…36 von 52).
   Das Fenster war 62 % hoch — groesser als der Rumpf. */

console.log("\nDER MAULWURF FUELLT DEN PLATZ");
pruefe("das Loch greift ueber den Bildrand",
  /\.lc-grabloch \{\s*\n\s*width: 128%;/.test(cssK));
pruefe("die Spur ist breiter",
  /\.lc-erdhaufen \{\s*\n\s*width: calc\(var\(--gross, 64px\) \* \.42\);/.test(cssK));
pruefe("die Strichlinie wird aufgegraben",
  /lc-platz-untergraben/.test(js)
  && /@keyframes lcLinieAufgegrabenR71/.test(cssK));
pruefe("und der Platz sackt kurz ein",
  /@keyframes lcPlatzSacktR71/.test(cssK));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 71 sitzt.\n");
process.exit(fehler ? 1 : 0);
