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
/* RUNDE 72 ZURUECKGENOMMEN: diese Regel hielt meinen eigenen
   Fehlgriff fest. „ueber den Bildrand hinaus" meinte den Rand des
   Profilbilds beim Landen, nicht die Kartenkante — die Liane wurde
   durch meine Aenderung zum Stummel („die Liane ist schlimmer
   geworden"). Geprueft wird jetzt, dass sie wieder lang haengt. */
pruefe("sie haengt wieder lang von oben herunter",
  /const hochL = Math\.min\(\(kk\.top - rk\.top\) - d \* 0\.25, -d \* 1\.6\);/.test(js));
/* RUNDE 74 — DIESE DREI REGELN BESCHRIEBEN DEN AUFBAU, DEN XANDER
   VERWORFEN HAT.
   „Die Liane ist totaler Quatsch, sie hat immer noch keinen
   Mittelpunkt in der Bildmitte auf der X-Achse, und sie schwingt
   nicht mit einem Ruecklauf … sie tanzt immer herum. Es gibt gar
   keinen richtigen realistischen, physikalischen Schwung."
   Sie pinnten eine VERSCHIEBUNG entlang einer Parabel fest (anlaufX,
   punkt(0.10), wegX) — und genau die ist das Problem: wenn sich das
   ganze Gebilde verschiebt, wandert der Aufhaengepunkt mit, und ein
   Seil mit wanderndem Ende ist kein Pendel. Jetzt haengt das Seil an
   einem festen Anker ueber der Mitte, und bewegt wird nur der
   Winkel. Die Regeln pruefen jetzt das. */
pruefe("der Anker liegt fest in der Mitte zwischen beiden Plaetzen",
  /const ankerX = \(start\.x \+ ende\.x\) \/ 2;/.test(js)
  && !/const anlaufX = -dxL \* 0\.16/.test(js));
pruefe("und der Anlauf geht GEGEN die Richtung des Ziels",
  /const wA = w0 \+ \(w0 - w1\) \* 0\.30;/.test(js));
pruefe("gelandet wird am Zielwinkel, nicht mit einer Ueberblendung",
  /bild\(w1 \+ \(w1 - mitteW\) \* 0\.55, L1,/.test(js));
pruefe("und die Person faehrt danach nicht mit dem Seil weiter",
  /const last = liane\.querySelector\("\.lc-liane-last"\);/.test(js)
  && /\{ opacity: 0, offset: Math\.min\(1, zieL \+ 0\.04\) \}/.test(js));

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
/* RUNDE 72 ZURUECKGENOMMEN. XANDER: „ich glaub das Pferd, was du
   gestaltet hast, sieht noch haesslicher aus als das vorherige. ich
   wollte bei unserem vorherigen Pferd lediglich den Koerper nicht
   ganz so lang gestreckt haben." Das Pony ist weg, das Pferd aus
   Runde 65 ist zurueck — nur kuerzer im Rumpf und mit ein paar
   Zuegen im Gesicht. Es liegt zusaetzlich im Backup. */
/* RUNDE 73 — XANDER: „Beim Pferd soll das Hinterteil nicht so
   wurstig sein." GEMESSEN: die Kruppe lief von x=38 bis x=56 als EIN
   runder Bogen mit gleichem Radius oben wie unten — daher der
   Wurstzipfel. Jetzt faellt sie von oben schraeg ab (38|48 wird
   40|44) und zieht sich unten ein (Zusatzpunkt 41|55). Alles
   andere am Pferd aus Runde 65 bleibt Strich fuer Strich stehen;
   die Regel prueft das an den Hinterbeinen mit. */
/* RUNDE 80 — XANDER: „Das Pferd hat immer noch hinten diese Wulst am
   Koerper … achte dabei auf den Arsch, dass die Beine am Arsch sind,
   und die Beine sind so komisch gefaltet wie so eine Ziehharmonika."
   Rumpf und Beine sind deshalb neu gezeichnet. Was diese Regel meint,
   bleibt richtig und wird weiter gemessen: der Rumpf ist kurz (nicht
   das lange Pony von Runde 70), und die Kruppe faellt schraeg ab,
   statt als Bogen mit gleichem Radius zu enden. Dazu jetzt das, was
   Xander in Runde 80 verlangt hat — siehe pruefe-runde80. */
pruefe("das Pferd hat einen kurzen Rumpf und eine abfallende Kruppe",
  /lc-pferd-rumpf" d="M58 29 L88 29/.test(js)
  && /Q54 63 49 56 Q45 48 46 40 Q48 31 58 29 Z/.test(js)
  && !/d="M40 56 Q38 42 58 39 L94 39/.test(js));
pruefe("Hals und Kopf sind um dieselben 10 Einheiten mitgerueckt",
  /lc-pferd-hals" d="M94 38 Q106 30 110 16 L122 18/.test(js)
  && /lc-pferd-kopf" d="M108 14 Q116 6 124 8 Q132 10 135 18/.test(js));
pruefe("im Gesicht ein paar Zuege mehr",
  /lc-pferd-blesse/.test(js) && /lc-pferd-zug/.test(js));
pruefe("das vorherige Pferd liegt im Backup",
  fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "pferd-vor-runde71.txt")));
pruefe("und der Reiter sitzt wieder, wo er in Runde 65 sass",
  /\.lc-pferd-reiter \{ top: 11%; \}/.test(cssK));

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

console.log("\nDIE BOMBE HAT ZWEI FASSUNGEN ZUM AUSWAEHLEN");
pruefe("beide stehen unter EINER Kachel",
  /\["\\ud83d\\udca3", "Bombe",    "bombe", false,/.test(js)
  && /"Zeitz\\u00fcnder", "bombe"/.test(js)
  && /"Lunte",       "lunte"/.test(js));
pruefe("die Zuendschnur prasselt von Anfang an",
  /lcTonSpaeter\("lunte", 0, 0\.6\)/.test(js));
/* RUNDE 72 NACHGEFUEHRT — und zwar, weil die Regel zwar gestimmt hat,
   aber am falschen Ort gemessen wurde. XANDER: „der lange Piepton ist
   immer noch da, immer noch ohne Explosionsknall, und dauert viel zu
   lang." NACHGEMESSEN: „bombedigital2" ist 5,03 s lang und piept
   durchgehend bei -15 bis -25 dB; bei 1500 ms gestartet lief es bis
   6,5 s, bei 4,6 s Animation. Und weil lcTonSpaeter ohne Plan-Eintrag
   keine Dauer kennt, wurde auch nichts abgeschnitten. Der Knall lag
   genau darunter. Jetzt piept „bombehektik" (gemessen 0,57 s, acht
   Piepse) von 1530 bis 2100 ms und ist zur Null fertig. */
pruefe("das Piepsen kommt nur kurz vor der Null",
  /lcTonSpaeter\("bombehektik", 1530, 0\.6\)/.test(js)
  && !/bombe:\s+\{ ton: "bombedigital2"/.test(js)
  && !/lcTonSpaeter\("bombedigital2"/.test(js));
pruefe("und am Ende knallt eine echte Explosion",
  /bombe:\s+\{ ton: "explosion2", dauer: 2600, laut: 0\.9 \}/.test(js));
/* RUNDE 72: der Countdown war stumm — die Datei „ticken", die
   lcTonZu("ticken") rief, lag ueberhaupt nicht im Ordner. */
pruefe("und der Countdown tickt ueberhaupt",
  /lcTonSpaeter\("ticken", 0, 0\.62\)/.test(js)
  && fs.existsSync(path.join(WURZEL, "ton", "ticken.opus")));
/* RUNDE 72 — XANDER: „die Staubwolke sollte unten ueber dem Namen
   gelassen werden, auf einer Seite gehaeuft und flacher, wie eine
   Endmoraene." Die alte Regel verlangte eine SYMMETRISCH gedehnte
   Glocke; jetzt ist sie ausdruecklich schief. */
pruefe("die Asche liegt breiter und auf einer Seite gehaeuft",
  /const GIPFEL = 0\.34;/.test(js)
  && /const seite = glocke < 0\.5 \? \(glocke - 0\.5\) \* 1\.1 : \(glocke - 0\.5\) \* 3\.0;/.test(js)
  && /const x = 1 \+ mitte \* 98;/.test(js));
pruefe("und sie liegt UNTER dem Bild, also ueber dem Namen",
  /\.lc-bombe-asche \{[\s\S]{0,240}?bottom: -19%;/.test(css)
  && /\.lc-bombe-asche \{[\s\S]{0,300}?overflow: hidden;/.test(css));

console.log("\nDIE KOPFHOERER SIND FLACH");
/* RUNDE 74 — DIE KOPFHOERER LIEGEN JETZT AUF DEM KREIS.
   XANDER: „Denk daran, dass du die Buegel mit der Kreisrundung
   mitfaehrst … das aber kreisrund am Verlauf des Profilbildes
   auslegen. Die koennen auch noch ein bisschen enger reingehen."
   Die drei Regeln pinnten feste Pixelstellen fest (BR = 20,
   lcApmMuschel(128), ein Buegel als Bezierkurve) — also genau das,
   was er geaendert haben wollte. Jetzt haengt alles am Kreis: die
   Muschel bekommt ihre Mitte gerechnet, der Buegel ist ein echter
   Kreisbogen. */
pruefe("die Muschel ist schmaler geworden — 18 statt 20 Einheiten",
  /const BR = 18, HO = 40;/.test(js));
pruefe("sie bekommt ihre Stelle gerechnet, nicht als feste Zahl",
  /function lcApmMuschel\(cx, cy, rechts\)/.test(js)
  && !/lcApmMuschel\(128, true\)/.test(js));
pruefe("und der Buegel ist ein Kreisbogen um dieselbe Mitte",
  (js.match(/A 73\.5 73\.5 0 0 [01] /g) || []).length >= 2
  && !/d="M10 58 C10 22 38 8 74 8 C110 8 138 22 138 58"/.test(js));

console.log("\nDIE LOK IST SCHWARZ MIT MESSING");
pruefe("das Blaugrau ist weg",
  /\.lc-lok-kessel   \{ fill: #14181c;/.test(cssK)
  && !/\.lc-lok-kessel   \{ fill: #2f4a63;/.test(cssK));
pruefe("Licht oben, Schatten unten",
  /lc-lok-glanz/.test(js) && /lc-lok-schatten/.test(js)
  && /\.lc-lok-glanz    \{ fill: #39424c;/.test(cssK));
pruefe("die goldenen Teile sitzen OBEN auf dem Koerper",
  /lc-lok-handlauf/.test(js) && /lc-lok-domfuss/.test(js)
  && /\.lc-lok-dom      \{ fill: #c8992e;/.test(cssK));

console.log("\nDIE MUENZE DREHT DURCH, STATT ZU STOTTERN");
/* ----------------------------------------------------------------
   RUNDE 73 — DIESE FUENF REGELN HABEN AUF DEN FALSCHEN BLOCK GEZEIGT
   ----------------------------------------------------------------
   Sie suchten `lcMuenzeR18`. Diesen Block hat aber schon Runde 53
   ueberschrieben und Runde 72 danach noch einmal. Die Regeln waren
   also gruen, waehrend der Browser etwas voellig anderes abspielte —
   genau deshalb hat Xander die Muenze dreimal hintereinander
   beanstandet, obwohl hier jedesmal „ok" stand. Der tote Block ist
   inzwischen geloescht; die Regeln zeigen jetzt auf das, was
   wirklich laeuft: `lcMuenzeR72`, 5,4 s, linear.
   ---------------------------------------------------------------- */
pruefe("keine Kurve mehr ueber die ganze Animation",
  /animation: lcMuenzeR72 5\.4s linear both;/.test(cssK)
  && !/animation: lcMuenzeR72 5\.4s cubic-bezier/.test(cssK));
/* RUNDE 76 — DIE FALLHOEHEN SIND ALLE UM 44/61 = 0,7213 KLEINER.
   XANDER: „Die Muenze … soll etwas hoeher landen, nicht den Namen
   verdecken, auf dem sie landet, sondern flach aufliegen."
   Der VERLAUF ist derselbe geblieben — dieselben Zeitpunkte, dieselbe
   gleichmaessig gebremste Drehung, dasselbe Ausscheppern; nur der Weg
   nach unten ist kuerzer, damit sie ueber dem Namen liegen bleibt.
   Und die Kippwinkel sind flacher (74 statt 86 Grad): bei 86 Grad war
   von ihr nichts mehr zu sehen, weil eine Flaeche ohne Dicke von der
   Seite ein Strich ist. */
pruefe("die Verzoegerung steht in den Werten, die Abstaende werden kleiner",
  /7\.4%  \{ transform: translateY\(0\.29%\)  rotateX\(0deg\)  rotateY\(855deg\)/.test(cssK)
  && /14\.8% \{ transform: translateY\(1\.08%\)  rotateX\(0deg\)  rotateY\(1620deg\)/.test(cssK)
  && /22\.2% \{ transform: translateY\(2\.16%\)    rotateX\(2deg\)  rotateY\(2295deg\)/.test(cssK));
pruefe("bei 74 Prozent steht sie, danach kippt sie nur noch",
  /74%   \{ transform: translateY\(31\.02%\)   rotateX\(66deg\) rotateY\(4500deg\)/.test(cssK));
pruefe("und dann scheppert sie aus — jeder Ausschlag kleiner",
  /88%   \{ transform: translateY\(41\.11%\)   rotateX\(64deg\)/.test(cssK)
  && /91%   \{ transform: translateY\(44%\)   rotateX\(74deg\)/.test(cssK)
  && /94%   \{ transform: translateY\(42\.92%\) rotateX\(69deg\)/.test(cssK)
  && /98%   \{ transform: translateY\(43\.57%\) rotateX\(72deg\)/.test(cssK));
pruefe("auch der Schatten laeuft linear mit",
  /animation: lcMuenzeSchattenR72 5\.4s linear both;/.test(cssK));

console.log("\nDER STRUDEL HAT EINEN SWIRL — UND UNTERBRICHT NICHT MEHR");
pruefe("zwei helle Sektoren laufen mit",
  (js.match(/class="lc-strudel-wirbel/g) || []).length === 2
  && /@keyframes lcStrudelWirbelR71/.test(cssK));
/* RUNDE 80: der Sektor hat einen laengeren, weicheren Verlauf
   bekommen („man sieht die Kontrastkante … es soll eher von innen
   nach aussen so wabern"), deshalb steht mehr zwischen der Regel und
   ihrer Dauer. Gemessen wird jetzt ohne feste Zeichenzahl. */
pruefe("innen dreht es schneller als aussen",
  /animation: lcStrudelWirbelR71 2\.4s linear infinite;/.test(cssK)
  && /\.lc-strudel-wirbel-2 \{[\s\S]{0,200}?animation-duration: 1\.45s;/.test(cssK));
/* Der Schlund bleibt frei — die Maske faengt erst hinter der Mitte
   an. Seit Runde 80 laeuft sie aussen weicher aus (74 % statt 92 %),
   damit dort keine Kante steht; die Regel selbst ist dieselbe. */
pruefe("der Schlund bleibt frei — der Sektor liegt nur auf dem Ring",
  /mask: radial-gradient\(circle, rgba\(0,0,0,0\) 0 1[0-9]%, #000 3[0-9]%/.test(cssK));
pruefe("die Karte dreht sich nicht mehr einmal ganz herum",
  /45%  \{ transform: rotate\(16deg\) scale\(\.9\); \}/.test(cssK)
  && !/transform: rotate\(360deg\) scale\(1\); \}/.test(cssK));
pruefe("und der Sog dauert 4,2 s statt 6",
  /\.lc-saugt \{ animation: lcStrudelSaugt 4\.2s/.test(cssK));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 71 sitzt.\n");
process.exit(fehler ? 1 : 0);
