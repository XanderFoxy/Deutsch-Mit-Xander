#!/usr/bin/env node
/* =========================================================
   RUNDE 75 — XANDERS LISTE VOM 21. SEPTEMBER, DRITTER TEIL
   ---------------------------------------------------------
   Woertlich gemeldet, und hier steht zu jedem Punkt, woran
   sich nachsehen laesst, dass er behoben ist:

   · „Ich moechte noch eine Bewegungsanimation mit einem UFO
     … was mich rein beamt von meinem Platz, ohne dass da
     Rueckstaende sind … der Beameffekt soll dann auch ein
     eigener sein in diesem Strahl."
   · „Eine Katze soll noch dabei sein, die mit meinem
     Profilbild spielt wie mit einem Wollknaeuel … die kann
     zwischendurch auch miau machen."
   · „Irgendeine ueberdimensionale Hand soll mich anfassen und
     auf einen anderen Platz setzen … vielleicht kann man sich
     die Hand auch aussuchen … so ein Plopp-Geraeusch, als
     wenn ich da rausgezupft wurde … und dann wieder so ein
     Aufsatzgeraeusch."
   · „Dann noch Frisbee, eine Animation … die sich wirklich so
     drehend animiert."
   · „Es soll noch ein Profileffekt geben, wo man sich ne
     Sonnenbrille aufsetzt."
   · „Der Cowboy Sound ist immer noch abgeschnitten … man
     hoert diesen typischen Ruf ueberhaupt nicht."
   · „Der Cowboyhut … die Hand, die ihn zurechtrueckt, das
     soll am Schluss kommen."
   · „Der Plattenteller ist immer noch nicht … an der Stelle,
     wo der Sound auch das Drehen hoerbar macht."
   · „Schau mal, dass das bei dem Helikopter oben kreisrund
     abschneidet."
   · „Der Raddampfer kommt mir noch nicht imposant genug vor
     … da ist noch dieses Leiern der Hupen … die Dixie-Melodie
     koennte typischer sein, mit Banjo und Brush-Drums."
   · „Bei der BH-Animation ist das Pfeifen scheinbar im
     Hintergrund noch zu hoeren … erst sollte der Effekt den
     BH wegreissen und dann kommt das doppelte Pfeifen."
   · „Der Feuereffekt ist noch nicht buendig am Profilrahmen …
     dann hat er Aussenffekte, die da gar nicht hingehoeren."
   · „Das Maulwurfgeraeusch … klingt wie ein Klopfen … die
     Erde soll viel breiter aufgeschuettet werden."
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
const cssOhne = ohneK(css);
const lc = ohneK(fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8"));
const ton = (n) => fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
                && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));
const gelistet = (n) => fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8")
  .split("|").some((x) => x.replace(/[^a-z0-9]/g, "") === n);

console.log("\nDAS UFO\n");
pruefe("es gibt den Befehl und er schickt eine Wirkung",
  /untertasse: \{ wirkung: "untertasse"/.test(lc)
  && /art === "untertasse"/.test(lc));
/* „/ufo" war seit langem ein Alias fuer den Film /raumschiff —
   deshalb heisst der neue Befehl /untertasse. Wer den alten Namen
   nimmt, bekommt weiter den Film. */
pruefe("und er nimmt /ufo nicht dem Raumschiff weg",
  /ufo: "raumschiff"/.test(lc));
pruefe("die Untertasse hat Kuppel, Rumpf und blinkende Lampen",
  /lc-ufo-kuppel/.test(js) && /ellipse cx="80" cy="34" rx="78"/.test(js)
  && /lc-ufo-lampe/.test(js) && /@keyframes lcUfoLampeR75/.test(css));
pruefe("der Strahl ist ein eigener Effekt, kein Kreis",
  /clip-path: polygon\(38% 0%, 62% 0%, 100% 100%, 0% 100%\)/.test(css)
  && /@keyframes lcUfoStrahlR75/.test(css));
pruefe("er ist nur an, waehrend das Bild steigt und sinkt",
  /opacity: \.9, transform: "translateX\(-50%\) scaleY\(1\)", offset: T\(0\.23\)/.test(js)
  && /opacity: 0, transform: "translateX\(-50%\) scaleY\(\.1\)", offset: T\(0\.44\)/.test(js));
/* „ohne dass das Bild wieder haengen bleibt": das Bild am Platz
   wird nur mit `fill: "none"` ausgeblendet — danach steht sein Stil
   wieder unveraendert da, es kann also nichts haengen bleiben. */
pruefe("das Bild am Platz behaelt nichts zurueck",
  (js.match(/duration: dauer, easing: "linear", fill: "none"/g) || []).length >= 4);
/* RUNDE 80 — XANDER: „Wenn man mit dem UFO fliegt, kann das UFO etwas
   tiefer sein." Die Schwebehoehe ist von 1,45 auf 1,12 Bildbreiten
   zurueckgenommen. Geprueft wird deshalb, was die Regel meint: die
   Untertasse schwebt ueber dem Platz (also mehr als eine Bildbreite
   hoch), und sie ist schmal genug, dass sie nicht ueber den Rand des
   Klassenzimmers hinausragt (deshalb 1,7 statt der frueheren 2,3). */
pruefe("und die Untertasse bleibt am Klassenzimmer",
  /const schweb = d \* ([\d.]+);/.test(js)
  && Number(RegExp.$1) >= 1.0 && Number(RegExp.$1) <= 1.7
  && /width: calc\(var\(--gross, 64px\) \* 1\.7\);/.test(css));

console.log("\nDIE KATZE\n");
pruefe("es gibt den Befehl /mieze",
  /mieze:    \{ wirkung: "mieze"/.test(lc) && /art === "mieze"/.test(lc));
/* „/katze" ist seit langem der Film mit dem Katzenbaby. */
pruefe("und /katze bleibt der Film",
  /w: "katze",     kurz: "kaetzchen"/.test(lc));
pruefe("die Katze hat Ohren, Schnurrhaare und einen Schwanz",
  /lc-katze-schwanz/.test(js) && /lc-katze-pupille/.test(js)
  && /stroke="rgba\(255,255,255,\.72\)"/.test(js));
pruefe("sie spielt in Schlaegen, nicht in einem Zug",
  /const schlaege = Math\.max\(2, Math\.min\(4, plaetzeR\)\);/.test(js));
pruefe("und der Ball rollt so weit, wie er sich dreht",
  /weit \* 360 \/ \(Math\.PI \* d\)/.test(js));
pruefe("sie miaut zweimal — beim Auftauchen und unterwegs",
  ton("katze") && gelistet("katze")
  && /lcTonZu\("mieze"\)/.test(js)
  && /lcTonSpaeter\("katze", Math\.round\(hin \* 0\.55\), 0\.42\)/.test(js));

console.log("\nDIE UEBERDIMENSIONALE HAND\n");
pruefe("man kann sich die Hand aussuchen: Gotteshand oder Gorilla",
  /gotteshand: \{ wirkung: "gotteshand"/.test(lc)
  && /pranke:   \{ wirkung: "pranke"/.test(lc)
  && /const gorilla = art === "pranke";/.test(js));
/* RUNDE 88 NACHGEFUEHRT: die Finger heissen seit Runde 87 nicht
   mehr nur „lc-rhand-finger", sondern tragen zusaetzlich ihr
   Gelenk („lc-rhand-finger lc-rf-mcp"), weil jeder Finger jetzt
   drei Gelenke hat. Gezaehlt wird also die Klasse, nicht die
   ganze Zeichenkette — vier Finger bleiben vier Finger. */
pruefe("sie hat vier Finger und einen abstehenden Daumen",
  (js.match(/lc-rhand-finger lc-rf-mcp/g) || []).length === 1
  && /rhFinger\.map/.test(js) && /rhFinger = \[/.test(js)
  && /lc-rhand-daumen/.test(js)
  /* eigener Name: „lc-hand-finger" gehoert der klatschenden Hand */
  && !/class="lc-hand-finger" d="M34 84/.test(js));
pruefe("nur die Gotteshand leuchtet von oben",
  /\.lc-riesenhand:not\(\.lc-riesenhand-affe\) \.lc-riesenhand-form/.test(css));
/* „Das soll aber realistisch von der Physik sein": eine Hand hebt
   schneller an, als sie absetzt, und das Bild haengt ihr nach. */
pruefe("sie setzt langsamer ab, als sie anhebt",
  /handBei\(0, 0, hochH, -4, 0\.36 \* tAnH, 1\)/.test(js)
  && /handBei\(1, 1, hochH \* 0\.10, -1, 0\.97 \* tAnH, 1\)/.test(js));
pruefe("und das Bild haengt der Hand nach",
  /lastBei\(0\.10, 0\.10, hochH \* 1\.02, -6, 0\.46 \* tAnH, 1\)/.test(js));
/* RUNDE 77 NACHGEFUEHRT — XANDER: „das Herauszupfgeraeusch
   realistischer sein und das Aufsatzgeraeusch auch realistischer."
   Bis dahin standen hier zwei geliehene Toene: „birneplopp" (eine
   Gluehbirne aus der Fassung — trocken, Glas in Metall) und „bonk"
   (ein Comic-Schlag ohne Nachlauf). Jetzt zwei eigene:
   „zupfraus" (1,00 s; gemessen Dehnen 0 bis 0,24 s, Schnalzer bei
   0,25 s, Spitze -2,7 dB) und „aufsetzen" (0,60 s; gemessen Aufsatz
   bei 0,087 s, Spitze -3,0 dB, Mittel -24,3 dB).
   Die Frisbee behaelt „bonk": eine gefangene Scheibe klatscht. */
pruefe("es ploppt beim Zupfen und setzt hoerbar auf",
  ton("zupfraus") && gelistet("zupfraus")
  && ton("aufsetzen") && gelistet("aufsetzen")
  && /lcTonSpaeter\("zupfraus", Math\.round\(hin \* 0\.29\), 0\.8\)/.test(js)
  && /gotteshand: "aufsetzen", pranke: "aufsetzen", frisbee: "bonk"/.test(js));

console.log("\nDIE FRISBEE\n");
pruefe("es gibt den Befehl", /frisbee:  \{ wirkung: "frisbee"/.test(lc));
pruefe("sie liegt flach in der Luft, sie ist keine Kugel",
  /scaleY\(" \+ \(0\.34 \+ 0\.66/.test(js));
pruefe("sie dreht sich gleichmaessig — eine Frisbee wird nicht langsamer",
  /const drehungen = Math\.max\(4, Math\.round\(Math\.hypot\(dxF, dyF\) \/ d \* 1\.6\)\);/.test(js));
/* Zwei Drehungen in EINEM transform wuerden sich verrechnen: die
   Neigung der Scheibe und ihr Kreiseln sind zwei Achsen. */
pruefe("und die Drehung sitzt in einer eigenen Lage",
  /scheibe\.querySelector\("\.lc-frisbee-bild"\)\.animate/.test(js));
pruefe("sie hat einen Wulst und einen Glanz",
  /\.lc-frisbee-rand/.test(css) && /\.lc-frisbee-glanz/.test(css));
pruefe("und sie zischt beim Wurf",
  ton("swoosh") && gelistet("swoosh") && /lcTonZu\("frisbee"\)/.test(js));

console.log("\nDIE SONNENBRILLE\n");
pruefe("es gibt den Profileffekt",
  /function lcSonnenbrille\(wen\)/.test(js)
  && /sonnenbrille: \{ wirkung: "sonnenbrille"/.test(lc));
pruefe("sie kommt von der Seite, nicht von oben",
  /0%   \{ opacity: 0; transform: translate\(96%, -22%\)/.test(css));
pruefe("erst sitzt sie, dann blitzt das Glas",
  /0%, 52%  \{ transform: translateX\(0\) skewX\(-14deg\); opacity: 0; \}/.test(css)
  && /lcTonSpaeter\("bling", 1350, 0\.5\)/.test(js));

console.log("\nDER COWBOY-RUF\n");
/* NACHGEMESSEN am alten cowboy.opus: -21 -25 -18 -15 -15 -17 -19
   -24 -29 -46 -75 -92 -92 -57 -14 dB. Ein gleichmaessiges Rauschen
   und bei 1,4 s ein Knall — kein Ruf. Der neue ist 3,01 s lang und
   von 0,00 s an laut (-17 -19 -31 -16 -15 -15 -16 …). */
/* RUNDE 77 NACHGEFUEHRT — XANDER: „der Cowboy Sound kann noch ein
   bisschen besser."
   Die alte Regel mass die DATEIGROESSE (ueber 8000 Byte) als Beleg
   dafuer, dass der Ton laenger als zwei Sekunden ist. Das war schon
   damals ein Umweg, und jetzt fuehrt er in die Irre: der neue Ruf ist
   ein einzelnes „Yee-haw" von 1,86 s (gemessen: „Yee" 0,00 bis
   0,33 s, Atempause bis 0,48 s, „haw" bis 1,75 s) und damit 6290
   Byte gross. Kuerzer ist hier BESSER — der alte Ton war 3,01 s,
   und in der zweiten Haelfte passierte nichts mehr.
   Gemessen wird deshalb jetzt, was die Regel eigentlich meinte:
   dass es den Ton gibt, dass er in der Liste steht, und dass die
   Animation zu seiner Laenge passt (3000 ms). */
pruefe("der Cowboy-Ruf ist da und die Animation passt zu seiner Laenge",
  ton("cowboy") && gelistet("cowboy")
  && /hut:            \{ ton: "cowboy",    dauer: 3000/.test(js),
  fs.statSync(path.join(WURZEL, "ton", "cowboy.opus")).size + " Byte");
pruefe("er faengt am Anfang der Animation an, nicht auf dem Aufschlag",
  /hut: 120,/.test(js) && /hut:            \{ ton: "cowboy",    dauer: 3000/.test(js));
/* RUNDE 76 — XANDER: „Die Hand soll vorher gar nicht zu sehen sein"
   und „sie soll nach den Geraeuschen kommen". Der Ton ist bei
   3130 ms zu Ende, die Hand kommt bei 79 % von 4,2 s = 3318 ms.
   RUNDE 88 NACHGEFUEHRT: die Regel ist dieselbe, die Zahlen sind
   andere. Der Ruf ist bei 2420 ms verklungen, die Animation
   dauert 4400 ms, die Hand erscheint bei 61,36 % = 2700 ms und
   ist bis 59,09 % unsichtbar. */
pruefe("die Hand kommt erst NACH dem Ton",
  /@keyframes lcHutHandR76/.test(css)
  && /0%, 59\.09% \{ opacity: 0;/.test(css));
/* NACHGESEHEN an der alten Zeichnung: die Mitte der Krone lag bei
   y = 24,5 und damit HOEHER als die Schultern daneben (y = 30) — von
   vorn also drei Buckel. Eine Cattleman-Falte hat in der Mitte eine
   DELLE. Jetzt Mitte 33,6, Schultern 28,4, Grate 14. */
/* RUNDE 80 — XANDER: „diese Hoecker sind noch zu duenn." Die Grate
   sind breiter geworden (44 bis 55 statt 46 bis 54,5), die Senke
   dazwischen schmaler. Die Delle in der Mitte bleibt — sie ist das,
   was diesen Hut zu einem Stetson macht. Geprueft wird deshalb die
   FORM und nicht die alte Zeichenkette: der Punkt bei x = 70 liegt
   tiefer als die Schultern daneben. */
pruefe("die Krone hat eine Delle in der Mitte, keinen dritten Buckel", (() => {
  const m = /C64 31\.4 66\.8 ([\d.]+) 70 ([\d.]+) C73\.2 ([\d.]+) 76 31\.4 78\.5 ([\d.]+)/.exec(js);
  if (!m) return false;
  const mitte = Number(m[2]), schulter = Number(m[4]);
  /* Grosse y sind WEITER UNTEN: die Mitte muss tiefer liegen. */
  return mitte > schulter && !/C61\.5 26 65\.5 24\.5 70 24\.5/.test(js);
})());
/* RUNDE 88 — DIESE REGEL WIRD UMGEDREHT, UND ZWAR AUF SEINEN
   WUNSCH HIN. Sie hiess bisher „der Hut sitzt bis dahin gerade".
   XANDER, Runde 88: „Bei dem Cowboyhut sieht man auch noch nicht,
   dass er am Ende mit seiner Hand den Cowboyhut ausrichtet."
   Man sah es nicht, WEIL er vorher gerade sass: eine Hand, die
   einen geraden Hut schief zieht, richtet nichts aus. Jetzt faellt
   er schief (-7 Grad), liegt so bis die Hand kommt, und erst sie
   macht ihn gerade. Geprueft wird also genau andersherum: bis zur
   Hand schief, danach gerade. */
pruefe("und der Hut sitzt bis dahin SCHIEF — sonst gibt es nichts auszurichten",
  /22\.27%, 61\.36% \{ opacity: 1; transform: translateY\(2%\) rotate\(-7deg\)/.test(css)
  && /84\.09%, 96\.59% \{ opacity: 1; transform: translateY\(3%\) rotate\(0deg\)/.test(css));

console.log("\nDER PLATTENTELLER\n");
/* NACHGEMESSEN: scratch.opus ist 1,01 s lang und von 0,00 bis
   0,90 s durchgehend gleich laut (-20 -18 -19 -20 -19 -18 -19 -20
   -19 dB). Das Kratzen lag aber bei 30 bis 48 % von 3,6 s, also
   1080 bis 1728 ms — da war der Ton schon 700 ms vorbei. */
pruefe("das Kratzen liegt jetzt da, wo man es hoert",
  /4%   \{ transform: rotate\(118deg\); \}/.test(css)
  && /28%  \{ transform: rotate\(148deg\); \}/.test(css));
pruefe("die Nadel setzt vorher auf, nicht erst bei 26 %",
  /4%   \{ transform: rotate\(0deg\); \}/.test(css));
pruefe("und keine Kurve ueber die ganze Animation verschiebt die Zeiten",
  /animation: lcPlatteArm 3\.6s linear both;/.test(css));

console.log("\nDAS HELIKOPTERFENSTER\n");
pruefe("Dach und rechte Seite sind ein Kreisbogen",
  /80\.3% 96%, 88\.8% 87\.1%, 94\.9% 76\.5%/.test(css)
  && /50\.4% 5\.6%, 38\.2% 6\.5%, 26\.4% 10\.3%/.test(css));
pruefe("die Ecke oben ist ausgerundet",
  /22% 14\.2%, 18% 19%/.test(css));
pruefe("und das Fenster ist etwas kleiner", /width: 22%;/.test(css));

console.log("\nDER RADDAMPFER\n");
/* Die alte Pfeife war aus zwei dicht beieinander liegenden Toenen
   (436 und 519 Hz) mit Vibrato — zwei nahe Toene erzeugen eine
   Schwebung, und die hoert man als Leiern. */
pruefe("die Pfeife ist lauter — der Dampfer soll imposanter sein",
  ton("dampferpfiff") && /lcTonSpaeter\("dampferpfiff", 180, 0\.75\)/.test(js));
pruefe("und aus der Dampforgel ist eine Dixie-Band geworden",
  ton("dampferdixie") && gelistet("dampferdixie")
  && /lcTonSpaeter\("dampferdixie", 520, 0\.52,/.test(js));

console.log("\nDIE BH-ANIMATION\n");
/* NACHGEMESSEN an pfiff2.opus: -19 -22 -60 -79 | -24 -18 -19 -18
   -17 -17 -16 -16 | -24 -35 … Ein kurzer Pfiff von 0,00 bis 0,20 s,
   Stille, dann ein langer von 0,40 bis 1,20 s. */
pruefe("der Riss ist der Planton, nicht der Pfiff",
  /entbloessung:   \{ ton: "bhriss",   dauer: 3000, laut: 0\.95 \}/.test(js)
  && /entbloessung: 620,/.test(js));
pruefe("und der Pfiff kommt danach und ist kuerzer",
  /lcTonSpaeter\("pfiff2", 1320, 0\.6, 1450\)/.test(js));

console.log("\nDAS FEUER\n");
/* NACHGEMESSEN im Browser: Bild 84 px, Feld 120,94 px, Feldmitte
   zur Bildmitte y = -3,84 px. Der Feuerkreis lag also fast vier
   Pixel ueber dem Kreis des Profilbildes. `top: -22%` zaehlt die
   HOEHE des Platzes, und dazu gehoert der Name unter dem Bild;
   `margin-top` rechnet dagegen in der BREITE. Nach der Korrektur
   gemessen: Feldmitte 0,00 / 0,00, Fusspunkte 41,24 bis 42,98 px
   bei einem Bildradius von 42,00 px. */
pruefe("das Sprechfeld sitzt konzentrisch auf dem Bild",
  /top: 0;\n  margin-top: -22%;/.test(cssOhne));
/* RUNDE 77 NACHGEFUEHRT — XANDER: „Kannst du da noch versuchen,
   dass die Flammen vielleicht noch ein bisschen weiter runter sind?"
   Der Bildrand liegt bei 34,73 % vom Mittelpunkt. Das Band stand auf
   34,0 bis 35,6 % — Mitte 34,8 %, also genau auf dem Reifen. Jetzt
   33,2 bis 34,8 %, Mitte 34,0 %: das sind 0,73 Prozentpunkte
   INNERHALB des Randes, knapp 0,9 px. Die Fuesse sitzen damit
   im Bild und die Flamme steht auf dem Reifen, statt daneben. */
/* RUNDE 80 — XANDER: „beim Feuer kannst du noch ein bisschen die
   Flammen nach unten bringen." Das Band ist noch einmal nach innen
   gerueckt. Geprueft wird die Regel: die Fusspunkte liegen INNERHALB
   des Bildrandes (34,73 %) und nicht mehr als drei Prozentpunkte
   darunter — sonst schwebte die Flamme mitten im Gesicht. */
pruefe("und die Flammen stehen auf dem Ring",
  /band: \[([\d.]+), ([\d.]+)\], zeichen: \[""\] \},/.test(js.slice(js.indexOf('feuer:  { menge: 30')))
  && Number(RegExp.$2) < 34.73 && Number(RegExp.$1) > 31.7);
/* Erst wurden die Funken kleiner gemacht — sie blieben trotzdem als
   weiche Punkte NEBEN dem Reifen stehen. Die Maske liess ein Band von
   40 bis 59 px stehen, der Bildradius ist aber 42 px. Also ganz weg. */
pruefe("ausserhalb des Reifens schwebt nichts mehr",
  /\.lc-sprechfeld\.lc-tfeuer::after \{[\s\S]{0,1600}?content: none;/.test(css));
pruefe("und die Flammen lodern in feinen Wellen",
  (css.match(/@keyframes lcZuengeltR55[abcd] \{/g) || []).length >= 8
  && /8%   \{ transform: translate\(-50%, -100%\)/.test(css));

console.log("\nDER BILLARDQUEUE\n");
/* NACHGEMESSEN im Browser (Feld 103 px, --wx -240 %, --wdreh 0 Grad),
   Spitze des Queues und Mitte der Kugel vom linken Feldrand:
     624 ms  Spitze  25,6   Kugelmitte -14,6  Radius 16,3
     760 ms  Spitze  42,4   Kugelmitte   2,3
   Die Spitze lag zu jedem Zeitpunkt RECHTS von der Kugel, also in
   Fahrtrichtung VOR ihr — der Queue hat sie nie getroffen. Nach der
   Aenderung gemessen: bei 624 ms Spitze -35,6, hinterer Rand der
   Kugel -33,9 — Beruehrung auf 1,7 px genau; bei 860 ms liegt der
   Queue 20 px HINTER der Kugel, sie zieht ihm also davon. */
pruefe("der Queue dreht sich um die Bildmitte, nicht um sein Ende",
  /\.lc-billard \.lc-stoss-queue \{[\s\S]{0,400}?left: 50%;/.test(css)
  && /transform: rotate\(calc\(var\(--wdreh, 0deg\) \+ 180deg\)\)/.test(css));
pruefe("und er steht hinter der Kugel, gerechnet aus der Strecke",
  /--qfern: calc\(var\(--wlang, 240%\) \* 0\.2763 \+ 17\.7%\);/.test(css)
  && /schicht\.style\.setProperty\("--wlang"/.test(js));
pruefe("die Spitze sitzt vorn — der Verlauf ist umgedreht",
  /#2f3542 0 6%, #d8c49a 6% 22%, #6b4a22 22% 100%/.test(css));

console.log("\nDER MAULWURF\n");
/* NACHGEMESSEN an maulwurf.opus: 1,00 s, Start bei -13 dB und von
   da an nur noch leiser — die Huellkurve eines SCHLAGS. „erdeauf"
   macht es umgekehrt: -51 -37 -29 -24 -21 -17 -16 -18 -20 …, der
   lauteste Punkt liegt bei 0,34 der Laenge. */
pruefe("das Graben klingt nicht mehr nach Klopfen",
  ton("erdeauf") && gelistet("erdeauf")
  && /maulwurf:       \{ ton: "erdeauf", dauer: 2400, laut: 0\.55 \}/.test(js));
pruefe("die Haufen sind so breit wie ein Profilbild",
  /width: calc\(var\(--gross, 64px\) \* \.92\);/.test(css)
  && /margin: calc\(var\(--gross, 64px\) \* -\.41\) 0 0 calc\(var\(--gross, 64px\) \* -\.46\);/.test(css));
pruefe("und die Spur bleibt trotzdem ein geschlossener Wall",
  /Math\.round\(weite \/ \(d \* 0\.34\)\)/.test(js)
  && /return 1 \+ nah \* nah \* 0\.22;/.test(js));

console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                   : "\nRunde 75 sitzt.\n");
process.exit(fehler ? 1 : 0);
