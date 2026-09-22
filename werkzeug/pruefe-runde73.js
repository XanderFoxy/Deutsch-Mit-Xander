#!/usr/bin/env node
/* =========================================================
   RUNDE 73 — DIE GROSSE LISTE VOM 21. SEPTEMBER, TEIL 1
   ---------------------------------------------------------
   Woertlich gemeldet und hier nachpruefbar:
   · „Man kann die Einladung, wenn man jemand einlaedt, nicht
     absenden … ich moechte auch Leute einladen, die grad
     nicht online sind."
   · „Der Neuankoemmling soll auch den naechsten freien Platz
     bekommen. Und nicht auf dem ersten Platz landen."
   · „Die Gluehbirne soll nur an meinem Platz ausgemacht
     werden … dann wird es besonders hell im Raum."
   · „Das Flugzeuggeraeusch ist nicht lang genug … es klingt
     eher wie ein Rennauto."
   · „Beide Fluegel sind nicht gleichzeitig zu sehen."
   · „Bei dem Helikopter ist das Fenster so eckig."
   · „Diese Kessel der Lok, die muessen Gold sein."
   · „Die Maulwurf-Nase ist noch zu sehen an dem Platz, wo er
     die Position verlaesst … der Streifen soll breiter sein
     … im Ton soll zu hoeren sein, dass dort lang gegraben
     wird."
   · „Die Liane trifft zwischendurch auf einem anderen Platz
     auf … sie soll praktisch eine Richtung und dann landen."
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
const lc = ohneK(fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8"));
const ton = (n) => fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
                && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));
const gelistet = (n) => fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8")
  .split("|").some((x) => x.replace(/[^a-z0-9]/g, "") === n);

console.log("\nDIE EINLADUNG ERREICHT AUCH, WER NICHT DA IST");
pruefe("es gibt ein Suchfeld ueber alle Profile",
  /id="lcEinladeSuche"/.test(js) && /Backend\.searchUsers\(q\)/.test(js));
pruefe("und sie geht ins Postfach, nicht in einen Raum",
  /await lcEinladungSchicken\(b\.dataset\.lcPostfach, b\.dataset\.lcPostname\)/.test(js));
pruefe("schlaegt es fehl, steht der Grund wirklich da",
  /showToast\("⚠️ " \+ \(\(e && e\.message\) \|\| "Die Einladung ging nicht raus\."\)\)/.test(js));
pruefe("und das Feld ist auch gestaltet", /\.lc-einladezeile \{/.test(css));

console.log("\nDER NEUE BEKOMMT DEN NAECHSTEN FREIEN PLATZ");
pruefe("der Puls traegt die eigene Ankunftszeit mit",
  /seit: zustand\.seit \|\| 0 \}\)/.test(lc));
pruefe("und sie wird uebernommen, wenn sie FRUEHER ist",
  /function ankunftUebernehmen\(id, gemeldet\)/.test(lc)
  && /if \(!p\.seit \|\| beiMir < p\.seit\)/.test(lc));
pruefe("die Uhr der Gegenseite wird herausgerechnet",
  /var versatz = \(typeof uhrVersatz\[id\] === "number"\) \? uhrVersatz\[id\] : 0;/.test(lc));
pruefe("und der Platz wird dann neu vergeben",
  /if \(platzJe\[id\] != null\) delete platzJe\[id\];/.test(lc));

console.log("\nDIE BIRNE IST DER LICHTSCHALTER MEINES PLATZES");
pruefe("das Herausdrehen sucht keinen Namen mehr",
  /function lcGluehbirneRaus\(\) \{/.test(js)
  && /if \(art === "birneraus" && lcGluehbirneRaus\(\)\) return;/.test(js));
pruefe("es nimmt meinen eigenen Platz", /function lcMeinPlatz\(\)/.test(js)
  && /const meiner = lcMeinPlatz\(\);/.test(js));
pruefe("und loescht JEDEN brennenden Schein im Raum",
  /querySelectorAll\("\.lc-kreis\.lc-birne-an"\)/.test(js)
  && /querySelectorAll\("\.lc-birne-halt"\)\.forEach\(\(x\) => x\.remove\(\)\)/.test(js));
pruefe("das Eindrehen blendet den ganzen Raum",
  /function lcBlendung\(\)/.test(js)
  && /if \(platz\.classList\.contains\("lc-platz-ich"\)\) lcBlendung\(\);/.test(js)
  && /\.lc-blendung \{/.test(css));

console.log("\nDAS FLUGZEUG");
pruefe("der Ton haengt an der wirklichen Flugzeit",
  /lcTonReise\("flug", hin\);/.test(js) && !/lcTonZu\("flugzeug"\)/.test(js));
pruefe("beide Fluegel gehen nach hinten und unten",
  /d="M62 28 L36 38 L52 40 L80 30 Z"/.test(js)
  && /d="M66 31 L30 46 L50 48 L86 33 Z"/.test(js));
pruefe("und das Triebwerk haengt unter dem nahen Fluegel",
  /x="44" y="38" width="19" height="8"/.test(js));

console.log("\nDAS HELIKOPTER-FENSTER");
pruefe("vorne schraeg, hinten rund — und kein Rechteck mehr",
  /\.lc-heli-kanzel \{[\s\S]{0,900}?clip-path: polygon\(/.test(css)
  && /\.lc-heli-kanzel \{[\s\S]{0,900}?border-radius: 0;/.test(css));

console.log("\nDIE LOK: LACK UND GOLD");
pruefe("es gibt einen Lackverlauf und einen Goldverlauf",
  /id="lokLack"/.test(js) && /id="lokGold"/.test(js));
pruefe("der Kessel ist lackiert, nicht nur schwarz",
  /\.lc-lok-kessel\s+\{ fill: url\(#lokLack\)/.test(css));
pruefe("und Dome, Pfeife und Griffe sind Gold",
  /\.lc-lok-dom\s+\{ fill: url\(#lokGold\)/.test(css)
  && /\.lc-lok-pfeife\s+\{ fill: url\(#lokGold\)/.test(css));

console.log("\nDER MAULWURF");
pruefe("am Startplatz bleibt keine Nase stehen",
  /lochAb\.querySelector\("\.lc-maulwurf-tier"\)\?\.remove\(\)/.test(js));
/* RUNDE 75 — die Zahlen haben sich geaendert, der Sinn nicht.
   XANDER: „Die Erde soll viel breiter aufgeschuettet werden. Also das
   soll von der Breite so ein Profilplatz einnehmen."
   Die Haufen sind jetzt fast eine ganze Bildbreite gross (0,92 statt
   0,40). Bei einem Abstand von 0,16 Bildbreiten laegen damit sechs
   uebereinander — deshalb 0,34. Sie ueberlappen sich immer noch zu
   zwei Dritteln, der Wall bleibt also geschlossen. Und die Streuung
   zur Seite ist kleiner (0,035 statt 0,05), weil breite Haufen sonst
   einen 1,4 Bildbreiten breiten Streifen ergeben. */
pruefe("die Spur bleibt ein geschlossener Wall",
  /Math\.round\(weite \/ \(d \* 0\.34\)\)/.test(js)
  && /\(d \* 0\.035\)/.test(js));
pruefe("und an den Plaetzen liegt sie dicker",
  /const dickeBei = \(x, y\) =>/.test(js)
  /* RUNDE 74: jeder Haufen bekommt zusaetzlich seine eigene Groesse.
     XANDER: „keine Klumpen in verschiedener Groesse, die wirklich
     nach Erdaufschuettung aussehen." */
  && /h\.style\.setProperty\("--gross", \(d \* dickeBei\(hx, hy\) \* eigen\)/.test(js));
pruefe("jeder Platz auf dem Weg wird aufgegraben, nicht nur Start und Ziel",
  /const proj = \(g\.x - start\.x\) \* ex \+ \(g\.y - start\.y\) \* ey;/.test(js));
pruefe("und man hoert ihn die ganze Strecke graben",
  ton("graben") && gelistet("graben")
  /* RUNDE 74: das Graben bekommt eine Grenze — XANDER: „Das
     Maulwurf-Grabgeraeusch klingt noch nach, waehrend der Maulwurf
     schon fertig mit Graben ist." Gemessen lief es bis zu 1,33 s
     ueber die Ankunft hinaus, weil die Datei 2,66 s lang ist. */
  && /lcTonSpaeter\("graben", abG, g \? 0\.4 : 0\.5,/.test(js));

console.log("\nDIE LIANE SCHWINGT IN EINE RICHTUNG");
/* RUNDE 74 — DIE LIANE IST JETZT EIN PENDEL.
   XANDER: „Die Liane ist totaler Quatsch, sie hat immer noch keinen
   Mittelpunkt in der Bildmitte auf der X-Achse … sie tanzt immer
   herum." Die alte Regel pinnte den Scheitel einer PARABEL fest —
   also die Verschiebung, die er verworfen hat. Ein Seil, dessen
   oberes Ende mitwandert, ist kein Pendel. */
pruefe("der Anker liegt in der Mitte zwischen beiden Bildern",
  /const ankerX = \(start\.x \+ ende\.x\) \/ 2;/.test(js)
  && /const ankerY = Math\.min\(8, Math\.min\(startY, endeY\) - d \* 1\.7\);/.test(js));
/* Die Falle, die uns beim Turm, bei der Muenze und beim Pfeil schon
   erwischt hat: eine cubic-bezier UEBER die ganze Animation dehnt
   die Abstaende ZWISCHEN den Schluesselbildern. Hier wird deshalb
   ausdruecklich geprueft, dass im Lianen-Zweig „linear" steht. */
/* RUNDE 74: `bogen(u)` war die Parabel, an der entlang verschoben
   wurde — die gibt es nicht mehr. Die Pendelbewegung steckt jetzt im
   WINKEL, und zwar als Kosinuswelle: eine Schaukel steht an den
   Umkehrpunkten still und ist unten am schnellsten. */
pruefe("die Pendelbewegung steckt in den Werten, nicht in einer Kurve",
  (() => {
    const a = js.indexOf('art === "liane"');
    const b = js.indexOf('art === "feder"', a);
    const teil = js.slice(a, b);
    return /easing: "linear", fill: "forwards"/.test(teil)
        && !/easing: "ease-in-out"/.test(teil)
        && /mitteW \+ weiteW \* Math\.cos\(Math\.PI \* u\)/.test(teil);
  })());
pruefe("und die Person steigt am Ziel ab",
  /const last = liane\.querySelector\("\.lc-liane-last"\);/.test(js));

console.log("\nZWEITER TEIL: WAS ER ZUM WIEDERHOLTEN MAL GEMELDET HAT");
/* „Alles, was du mir in dem Update beschreibst, ist nirgendswo
   sichtbar." Das war der wichtigste Punkt der ganzen Liste. */
pruefe("die Seite merkt selbst, dass sie veraltet ist",
  fs.existsSync(path.join(WURZEL, "fassung.json"))
  && /fetch\("fassung\.json\?t=" \+ Date\.now\(\), \{ cache: "no-store" \}\)/
       .test(fs.readFileSync(path.join(WURZEL, "index.html"), "utf8")));
pruefe("und die beiden Zahlen koennen nicht auseinanderlaufen",
  (() => {
    const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
    const a = (html.match(/window\.DMA_VERSION = "(\d+)"/) || [])[1];
    const b = JSON.parse(fs.readFileSync(path.join(WURZEL, "fassung.json"), "utf8")).fassung;
    return a && b && String(a) === String(b);
  })(),
  "index.html und fassung.json");
pruefe("es gibt ein Werkzeug, das beide gemeinsam setzt",
  fs.existsSync(path.join(WURZEL, "werkzeug", "fassung-setzen.js")));

pruefe("die Effekte fuer ALLE schicken wirklich das Wort „alle“",
  /\["\\ud83d\\ude18", "K\\u00fcssen", "kuss", "alle"\]/.test(js)
  && /\+ \(name \? " " \+ name : \(zusatz \? " " \+ zusatz : ""\)\)/.test(js));
pruefe("schwebende Panels gehen auch im Leerraum zu",
  /const LC_BEDIENBAR = /.test(js)
  && /if \(ziel\.closest\(LC_BEDIENBAR\)\) return;/.test(js));
pruefe("und sie bleiben auf dem Bildschirm",
  /max-height: calc\(100dvh/.test(css));
pruefe("die Birne dreht trocken statt zu quietschen",
  ton("birnedrehen") && gelistet("birnedrehen")
  && /gluehbirne:\s+\{ ton: "birnedrehen"/.test(js));
pruefe("und sonst quietscht nur noch die Bremse beim Fahren",
  (js.match(/lcTonSpaeter\("quietschen"/g) || []).length === 2
  && !/lcTonZu\("quietschen"\)/.test(js));
pruefe("das Geld faellt schneller",
  /\(1\.9 \+ Math\.random\(\) \* 1\.4\)/.test(js)
  && /\(1\.25 \+ Math\.random\(\) \* 0\.85\)/.test(js));
/* RUNDE 76 — der Kippwinkel ist jetzt 74 statt 86 Grad. XANDER:
   „sie soll etwas hoeher landen, nicht den Namen verdecken, sondern
   flach aufliegen." Bei 86 Grad war von ihr gar nichts mehr zu sehen
   (nachgesehen: nur noch der Schatten), bei 74 liegt sie als flache
   Ellipse da. Kleiner wird sie weiterhin nicht. */
pruefe("die Muenze wird beim Landen nicht mehr kleiner",
  /rotateX\(74deg\) rotateY\(4500deg\) scale\(\.9\)/.test(css)
  && !/rotateY\(4500deg\) scale\(\.55\)/.test(css));
pruefe("die Trommel hoert auf, wenn der Ton aufhoert",
  /\}, marsch \? 1600 : 1400, marsch \? "marsch" : "trommel"\);/.test(js)
  && /lcStockAR73 1\.4s/.test(css));
/* RUNDE 80: der Arm wird jetzt aus einer Rueckgratlinie gerechnet —
   siehe pruefe-runde72 und pruefe-runde80. Die Forderung bleibt
   dieselbe: eine stetige Fuehrung ohne Knick. */
pruefe("der Arm der Umarmung ist eine stetige Fuehrung",
  /const rippe = \(t\) => \{/.test(js));
pruefe("die Kopfhoerer klemmen am Bild statt daneben zu haengen",
  /\.lc-kopfhoerer-bild \{[\s\S]{0,200}?width: 122%;/.test(css));


console.log("\nTEIL 3 — ROEHRE, STRUDEL, HUT, ZWILLE, HAMMER\n");
/* Alles hier ist vorher GEMESSEN worden, und die Messung steht im
   Kommentar an der Stelle, an der der Wert im Programm steht. */
pruefe("die Roehre steht nicht mehr auf dem Nachbarplatz",
  /const ROHR_HOCH = 0\.62;/.test(js)
  && /const ROHR_MITTE = 0\.12 \+ ROHR_HOCH \/ 2;/.test(js));
pruefe("Absinken und Zuschnitt kommen aus einer Rechnung",
  /const rohrBild = \(v, vorne, zeit\) =>/.test(js)
  && /\(ROHR_MUND \+ v\) \* 100/.test(js));
pruefe("und das Ausstiegsbild geht, wenn das echte kommt",
  /const schnittR = Math\.min\(0\.98, \(hin \+ 120\) \/ dauer\);/.test(js));
pruefe("der Strudel klingt 4,6 s lang, nicht wie ein Schalter",
  ton("strudelsog") && gelistet("strudelsog")
  && /sog:\s+\{ ton: "strudelsog", dauer: 4600/.test(js));
pruefe("und er ruckelt nicht mehr — keine Kurve ueber die ganze Animation",
  /\.lc-kreis\.lc-gesogen \{ animation: lcSogZiehtR19 4\.2s linear both; \}/.test(css));
/* RUNDE 75 — die Animation dauert 3,4 s statt 2,8 s, weil der neue
   Ruf 3,01 s lang ist. Der Aufschlag liegt damit bei 16,9 % statt
   20,5 % — dieselben 575 ms. */
/* RUNDE 76 — 4,2 s statt 3,4 s, damit die Hand NACH dem Ton kommt
   (XANDER: „die Hand … soll nach den Geraeuschen kommen"). Der
   Aufschlag liegt damit bei 13,7 % — dieselben 575 ms.
   RUNDE 77 — jetzt 3 s, weil der neue Cowboy-Ruf 1,86 s dauert statt
   3,13 s. Die 13,7 % bleiben stehen: sie sind jetzt 411 ms statt
   575 ms. Das ist richtig so, denn der Hut faellt gegen den Ruf, und
   der Ruf faengt frueher an zu tragen — bei 0,33 s ist das erste
   „Yee" schon vorbei. */
pruefe("der Hut setzt auf, wenn man ihn aufsetzen hoert",
  /animation: lcHutR76 3s linear both;/.test(css)
  && /13\.7% \{ transform: translateY\(0\)/.test(css)
  && /hut:            \{ ton: "cowboy",    dauer: 3000/.test(js));
/* RUNDE 75 — XANDER: „die Hand, die ihn zurechtrueckt, das soll am
   Schluss kommen." Sie kommt jetzt bei 72 % und zieht bei 81 %; vorher
   war sie bei 26 % da und bei 54 % schon wieder weg. */
pruefe("und eine Hand rueckt ihn ganz zum Schluss zurecht",
  /lc-hut-hand/.test(js) && /@keyframes lcHutHandR76/.test(css)
  && /0%, 76%  \{ opacity: 0;/.test(css)
  && /79%      \{ opacity: 1;/.test(css));
pruefe("die Zwille spannt, saust und schlaegt ein",
  /lcTonSpaeter\("gummizug", 180, 0\.95\);/.test(js)
  && /lcTonSpaeter\("swoosh", 1290, 0\.55\);/.test(js)
  && /lcTonSpaeter\("spucktreffer", 1440, 0\.8\);/.test(js));
pruefe("und der Schrei kommt NACH dem Einschlag",
  js.indexOf('lcTonSpaeter("spucktreffer", 1440')
    < js.indexOf('lcStimmeZu(platz, "schreimann", "schreifrau", 1560'));
pruefe("der Hammer hat den Amboss-Klang",
  /lcTonSpaeter\("hammerschlag", 300, 0\.45\);/.test(js));


console.log("\nTEIL 4 — TOR, BOWLING, HELI, DAMPFER, GEIGEN, VOGEL, PFERD\n");
pruefe("das Tor hat keine Nudelholz-Ringe mehr",
  /\.lc-tor-wasserwand \.lc-tor-welle \{ display: none; \}/.test(css));
pruefe("und dafuer einen Trichter, der Tiefe macht",
  /@keyframes lcTorTrichterR73/.test(css));
pruefe("die Kruemel oben links sind weg — die Tropfen stehen am Rand",
  /\.lc-tor-wirbel \.lc-tor-tropfen \{[\s\S]{0,120}?left: 50%;/.test(css)
  && /\(480 \+ \(\(k \* 37\) % 46\) \* 5\)/.test(js));
pruefe("die Bowlingkugel trifft, wenn es im Ton kracht",
  /@keyframes lcBowlingRolltR73/.test(css)
  && /58%  \{ transform: translate\(0, 0\) scale\(1\) rotate\(520deg\); \}/.test(css)
  && /bowling: 0,/.test(js));
pruefe("und der Kegel kippt danach, nicht 850 ms spaeter",
  /@keyframes lcBowlingKegelR73/.test(css)
  && /58%  \{ opacity: 1; transform: rotate\(0deg\) translateY\(0\); \}/.test(css));
pruefe("das Regal stuerzt nicht mehr ein — der Ton ist gedeckelt",
  /bowling:        \{ ton: "bowling2", dauer: 2400/.test(js));
pruefe("der Helikopter landet nicht mehr wie eine Trommel",
  ton("helilanden") && gelistet("helilanden")
  && /heli: "helilanden"/.test(js));
/* RUNDE 75 — aus der Dampforgel ist eine BAND geworden.
   XANDER: „die Dixie-Melodie koennte noch ein bisschen typischer sein,
   wie so ne Dixie-Band spielt, mit Banjo und diesen Brush-Drums."
   Eine Calliope ist ein Instrument, keine Band. Jetzt Banjo, Tuba,
   Trompete und Besen — und lauter (0,52), weil der Dampfer
   „imposanter" sein soll. */
pruefe("der Raddampfer hat seine Dixie-Band",
  ton("dampferdixie") && gelistet("dampferdixie")
  && /lcTonSpaeter\("dampferdixie", 520, 0\.52,/.test(js));
pruefe("die Geigen spielen langsam wie ein Quartett",
  ton("geigenquartett") && gelistet("geigenquartett")
  && /lcTonSpaeter\("geigenquartett", 1780, 0\.62\);/.test(js));
pruefe("die Fluegel sitzen an der Schulter, nicht am Hinterteil",
  /const flg = "M96 28/.test(js)
  && /transform-origin:96px 28px/.test(js)
  && !/transform-origin:70px 30px/.test(js));
pruefe("die Blesse ist ein schmaler Streifen",
  /M119\.4 11\.4 Q124 10\.2 128\.4 12\.8/.test(js));
/* RUNDE 80: der Rumpf ist neu gezeichnet — die Kruppe faellt jetzt
   vom Widerrist (58|29) nach hinten auf (46|40) ab, also deutlicher
   als vorher. Siehe pruefe-runde71 und pruefe-runde80. */
pruefe("und die Kruppe faellt ab, statt eine Wurst zu sein",
  /M58 29 L88 29/.test(js) && /Q45 48 46 40 Q48 31 58 29 Z/.test(js));


console.log("\nTEIL 5 — DAS FEUER UND DAS BLUT\n");
/* Die Flamme hatte als Fuss EINEN PUNKT („50% 100%") — deshalb stand
   sie auf dem Reifen wie eine Kerze auf einem Leuchter. Jetzt ist der
   Fuss breit, und die Breite waechst von der Spitze stetig bis zum
   Bauch. Geprueft wird, dass KEIN Umriss mehr mit einem Punkt
   aufsetzt und dass der Bauch unten sitzt. */
pruefe("die Flamme sitzt mit breitem Fuss auf dem Reifen",
  !/clip-path: polygon\(50% 0%, 64% 20%/.test(css)
  && (css.match(/\.lc-tfeuer \.lc-teilchen\[data-v="\d"\] \{\s*\n\s*clip-path: polygon\(/g) || []).length === 5);
pruefe("und sie ist breiter als die alte Nadel",
  /width: calc\(0\.30rem \* var\(--gross, 1\) \+ 0\.13rem\);/.test(css));
pruefe("Funken steigen auf",
  /@keyframes lcFunkenSteigenR73/.test(css)
  && /\.lc-sprechfeld\.lc-tfeuer::after \{/.test(css));
pruefe("das Blut laeuft an den Seiten, nicht ueber das Gesicht",
  /14% 0%, 9% -22%, 19% -47%, 5% -71%, 24% -96%/.test(css)
  && !/18% 0%, 41% -22%, 60% -47%/.test(css));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 73 sitzt.\n");
process.exit(fehler ? 1 : 0);
