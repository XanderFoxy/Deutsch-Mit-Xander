#!/usr/bin/env node
/* =========================================================
   RUNDE 76 — XANDERS GROSSE LISTE, ERSTER TEIL
   ---------------------------------------------------------
   Woertlich gemeldet, und hier steht zu jedem Punkt, woran
   sich nachsehen laesst, dass er behoben ist:

   · „Beim Lasso: erst soll derjenige mit dem Lasso gefangen
     werden, dann soll er von dieser Position herangezogen
     werden … Genauso bei dem Angeln. Die Animation kommt
     immer erst dann, wenn derjenige schon auf dem Platz
     sitzt."
   · „Der Bumerang soll auch richtig zu mir zurueckfliegen
     und nicht nur auf dem halben Weg."
   · „Der Schneeball hat ne Schleifspur, die nach unten geht,
     waehrend der Schneeball nach rechts runter[rutscht]."
   · „Die Muenze … soll etwas hoeher landen, nicht den Namen
     verdecken, sondern flach aufliegen."
   · „das ‚du' in Klammern kannst du auch generell rausnehmen."
   · „die Birne hat diese zwei Kacheln … das ist beides in der
     Birne drin, wenn man drauf klickt."
   · „die Hand beim Cowboyhut, die soll nach den Geraeuschen
     kommen … die Hand soll vorher gar nicht zu sehen sein."
   · „Der Hut vom Cowboy sieht auch noch nicht realistisch aus."
   · „Der Tonarm von dem Plattenspieler sitzt nicht richtig auf
     dem Plattenspieler drauf."
   · „bei der Gluehbirne soll die Fassung nicht erst obendrauf
     gestellt werden … und sie soll am Ende auch nicht auf der
     Gluehbirne bleiben … und wenn man es dunkel macht, soll
     die Fassung auch zu sehen sein."
   · „wenn man in dem Dunkeln die Seite nach oben scrollt, dann
     springen die Augen."
   · „Das Bild fliegt schon um, bevor der Bowling-Effekt mit
     der Animation ueberhaupt sichtbar wird."
   · „wenn ich jemandem sein Getraenk aufblasen will, dann
     sollen die Leute, die rechts von mir sitzen, von links mit
     dem Strohhalm aufgeblasen werden."
   · „den Spuckball … da brauchst du nicht zwei Ekelgeraeusche
     haben."
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

console.log("\nERST DIE ANIMATION, DANN DER PLATZWECHSEL\n");
/* Der Platzwechsel ging ZUERST hinaus, die Animation danach. Jedes
   Geraet hat also erst die Sitzreihe neu gezeichnet — die Person sitzt
   dann schon am Ziel — und liess erst danach das Lasso fliegen. */
pruefe("die Sitzordnung geht erst raus, wenn die Animation da ist",
  /setTimeout\(schickenH, wieH === "lasso" \? 2300 : 2250\);/.test(lc));
pruefe("und sie geht gar nicht raus, wenn der Raum gewechselt hat",
  /if \(zustand\.raum !== raumH\) return;/.test(lc));

console.log("\nDER BUMERANG\n");
/* Bei 70 % war er erst bei 55 % des Rueckwegs, und die letzten 45 %
   lagen in den letzten 30 % der Zeit — waehrend er ausblendete. */
pruefe("er ist bei 90 % angekommen und noch voll zu sehen",
  /90%  \{ opacity: 1;\s*\n\s*transform: translate\(var\(--wx, 220%\), var\(--wy, 0%\)\) rotate\(2060deg\)/.test(css));
pruefe("und keine Kurve ueber die ganze Animation verschiebt die Zeiten",
  /animation: lcBumerangFlug 2\.6s linear both;/.test(css));

console.log("\nDER SCHNEEBALL\n");
/* Der Klecks rutscht schraeg (nach unten UND zur Mitte), die Rinne
   wuchs nur in der Hoehe — und auf 104 % statt auf 42 %. */
pruefe("die Spur zeigt dorthin, wo der Klecks hinrutscht",
  /schicht\.style\.setProperty\("--spurdreh"/.test(js)
  && /transform: rotate\(var\(--spurdreh, 0deg\)\);/.test(css));
pruefe("und sie wird genau so lang wie sein Weg",
  /schicht\.style\.setProperty\("--spurlang"/.test(js)
  && /90%     \{ height: var\(--spurlang, 42%\);/.test(css));

console.log("\nDIE MUENZE\n");
/* Sie fiel bis translateY(61 %), und das ist die Mitte der
   Namenszeile. Alle Fallwerte sind mit 44/61 nach oben geholt. */
/* Der alte Wert 61 % steht noch im Kommentar daneben — deshalb wird
   im Regelwerk ohne Kommentare gesucht. */
const cssOhne = ohneK(css);
pruefe("sie landet ueber dem Namen",
  /85%   \{ transform: translateY\(44%\)/.test(css)
  && !/translateY\(61%\)/.test(cssOhne));
pruefe("und sie liegt flach, statt unsichtbar auf der Kante zu stehen",
  /rotateX\(74deg\)/.test(css) && !/rotateX\(88deg\)/.test(css));

console.log("\nKLEINIGKEITEN, DIE DAS DESIGN VERSCHIEBEN\n");
pruefe("hinter dem eigenen Namen steht kein \u201e(du)\u201c mehr",
  /name\.textContent = p\.leer \? "frei" : p\.name;/.test(js));
pruefe("die Birne ist eine Kachel mit zwei Eintraegen",
  /\["\\ud83d\\udca1", "Birne", "gluehbirne", false,/.test(js)
  && /\["\\ud83d\\udd0c", "Birne raus", "birneraus"\]\]\],/.test(js));

console.log("\nDER COWBOYHUT\n");
pruefe("die Animation dauert 4,2 s — Platz fuer die Hand nach dem Ton",
  /animation: lcHutR76 4\.2s linear both;/.test(css)
  && /hut:            \{ ton: "cowboy",    dauer: 4200/.test(js));
pruefe("die Hand ist bis 76 % gar nicht zu sehen",
  /0%, 76%  \{ opacity: 0; transform: translate\(52%, -26%\)/.test(css));
/* Die Krempe lief an beiden Seiten in einen PUNKT aus; ein Filzhut hat
   ueberall dieselbe Dicke, auch an der Spitze. */
pruefe("die Krempe hat auch an den Spitzen ihre Dicke",
  /C90 64 114 58 132 38 C136 41 137 45 134 48/.test(js)
  && !/M5 41 C24 60 50 66 70 66/.test(js));

console.log("\nDER PLATTENSPIELER\n");
/* Die Nadel lag bei (87 % | 6 %) — in der oberen rechten Ecke, wo der
   Bildkreis auf Hoehe 6 % nur von 30 bis 70 % reicht. */
pruefe("die Nadel liegt auf der Platte, nicht daneben",
  /right: -24\.9%;\s*\n\s*top: 14\.4%;/.test(css));
pruefe("und der Arm hebt weit genug ab, um sie freizugeben",
  /0%   \{ opacity: 0; transform: rotate\(26deg\); \}/.test(css));

console.log("\nDIE GLUEHBIRNE\n");
pruefe("die Fassung faellt nicht mehr von oben herein",
  /@keyframes lcBirneFassungR76/.test(css)
  && /0%   \{ opacity: 0; transform: none; \}/.test(css));
pruefe("sie bleibt nach dem Eindrehen nicht haengen",
  !/lcBirneFassungBleibt\(platz\);\s*\n\s*\/\* RUNDE 73/.test(js));
pruefe("beim Herausdrehen ist sie da",
  /if \(platz && !platz\.querySelector\("\.lc-birne-halt"\)\) lcBirneFassungBleibt\(platz\);/.test(js));

console.log("\nDIE AUGEN IM DUNKELN\n");
/* Die Augen wurden RELATIV ZUR BUEHNE gesetzt, und die Buehne wird in
   ihrem eigenen Bildtakt nachgezogen — ein Takt Verzug, und den sieht
   man als Springen. */
pruefe("die Buehne wird im selben Bildtakt zuerst nachgezogen",
  /const setzenA = \(\) => \{\s*\n\s*try \{ lcBuehneSetzen\(\); \} catch \(e\) \{\}/.test(js));

console.log("\nBOWLING UND STROHHALM\n");
/* lcWeggestossen setzte sich bei 30 % von 2,4 s in Bewegung (720 ms),
   die Kugel trifft aber erst bei 58 % (1392 ms). */
pruefe("beim Bowling faellt er erst, wenn die Kugel da ist",
  /const stossKlasse = art === "billard"/.test(js)
  && /0%, 58% \{ transform: translate\(0, 0\) rotate\(0deg\) scale\(1\); opacity: 1; \}/.test(css));
pruefe("der Strohhalm kommt von der Seite, auf der ich sitze",
  (js.match(/if \(r[SB] && r[SB]\.x < 0\) schicht\.classList\.add\("lc-halm-links"\);/g) || []).length === 2
  && /\.lc-halm-links \.lc-halm-seite \{ transform: scaleX\(-1\); \}/.test(css));
pruefe("und beide Halme sind gleich geringelt",
  (css.match(/repeating-linear-gradient\(to bottom,\s*\n\s*#ff5f7a 0 10%, #ffffff 10% 20%\)/g) || []).length >= 2);
pruefe("der Spuckball hat nur noch EIN Ekelgeraeusch",
  !/lcTonSpaeter\("spucktreffer", 1280, 0\.7\);/.test(js)
  && /lcStimmeZu\(platz, "ekelmann", "ekelfrau", 1620, 0\.62\);/.test(js)
  /* beim Zwille bleibt der Aufprall — dort ist er kein Ekel */
  && /lcTonSpaeter\("spucktreffer", 1440, 0\.8\);/.test(js));

console.log("\nDIE RICHTUNG BEIM STOSS\n");
/* Beide Kurven schoben den Getroffenen mit einem festen
   `translate(-16%, 0)` — also immer nach links, egal aus welcher
   Richtung die Kugel kam. */
pruefe("der Getroffene fliegt in die Stossrichtung",
  (js.match(/platz\.style\.setProperty\("--stossx"/g) || []).length === 2
  && /calc\(var\(--stossx, -1\) \* 16%\)/.test(css));
pruefe("und er kippt dorthin, wohin er gestossen wird",
  /rotate\(calc\(var\(--stossx, -1\) \* 10deg\)\)/.test(css));

console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                   : "\nRunde 76 sitzt.\n");
process.exit(fehler ? 1 : 0);
