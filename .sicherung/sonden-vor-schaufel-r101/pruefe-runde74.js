#!/usr/bin/env node
/* =========================================================
   RUNDE 74 — XANDERS LISTE VOM 21. SEPTEMBER, ZWEITER TEIL
   ---------------------------------------------------------
   Woertlich gemeldet, und hier steht zu jedem Punkt, woran
   sich nachsehen laesst, dass er behoben ist:

   · „Denk daran, dass du die Buegel mit der Kreisrundung
     mitfaehrst und dass oben dieser Zwischenhalt wie eine
     kleine Bruecke deutlich ist … die sind silbrig, also
     metallic … wie als wenn du so einen Tropfen links und
     rechts von dem Pflaster hast."
   · „Die koennen auch noch ein bisschen enger reingehen, dass
     jemand, der rechts oder links von mir sitzt, nicht mit
     meinem Design korreliert."
   · „Das Helikopterfenster ist immer noch nicht abgeschraegt
     vorne."
   · „Die Liane ist totaler Quatsch, sie hat immer noch keinen
     Mittelpunkt in der Bildmitte auf der X-Achse."
   · „Das Maulwurf-Grabgeraeusch klingt noch nach, waehrend der
     Maulwurf schon fertig mit Graben ist."
   · „Die Aufschuettung geht nicht von der Draufsicht."
   · „Kurz bevor es reingeht, wird es unten abgeschnitten …
     und wenn es rauskommt, gibt es einen Doppelungseffekt."
   · „Im Original sind es viel mehr Geraeusche, und die gehen
     ein bisschen langsamer … vom Hall-Verhaeltnis
     abgestumpft."
   · „Bei der Sprungfeder fehlt mir die Kongruenz zu den
     Plaetzen … das ist nicht dieses typische Comicgeraeusch."
   · „Der Helikopter-Sound klingt nicht durchgaengig bis zum
     Landen."
   · „Wenn der Queue die Kugel anstoesst, sieht das aus, als
     wenn er die Kugel an mich ran schlaegt."
   · „Der Angelhaken funktioniert immer noch nicht unabhaengig
     vom Lasso."
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

console.log("\nDIE KOPFHOERER LIEGEN AUF DEM KREIS\n");
pruefe("die Zeichnung ist quadratisch — sonst gibt es keinen Kreis",
  /viewBox="0 0 160 160"/.test(js));
pruefe("der Buegel ist ein echter Kreisbogen mit Radius 73,5",
  (js.match(/A 73\.5 73\.5 0 0 [01] /g) || []).length >= 2);
pruefe("die Bruecke ist ein Ringstueck, kein Balken",
  /A 77\.6 77\.6 0 0 1 /.test(js) && /A 69\.4 69\.4 0 0 0 /.test(js));
pruefe("und an ihren Enden sitzen zwei Tropfen",
  (js.match(/rx="5\.4" ry="4\.2"/g) || []).length === 2);
pruefe("der Buegel ist metallisch, nicht lackiert",
  /linearGradient id="apmStahl"/.test(js));
pruefe("und sie gehen dem Nachbarn nicht mehr ins Design",
  /\.lc-kopfhoerer-bild \{\s*\n\s*width: 112%;/.test(css));

console.log("\nDAS HELIKOPTERFENSTER IST SCHRAEG\n");
/* RUNDE 80: die Scheibe ist jetzt gewoelbt statt gerade — siehe
   pruefe-runde66. Geneigt nach hinten ist sie weiter, und die
   Kinnscheibe sitzt weiter darunter. */
pruefe("die Frontscheibe ist nach hinten geneigt",
  /d="M12\.2 41\.6/.test(js) && /C13\.8 32 20\.6 23\.4 31\.4 18\.1/.test(js));
pruefe("darunter sitzt die Kinnscheibe",
  /d="M11\.8 41\.4/.test(js));
/* RUNDE 75 — XANDER: „schau mal, dass das bei dem Helikopter oben
   kreisrund abschneidet. Da war noch ne Ecke … rechts ist wirklich vom
   unteren Eckpunkt zum oberen kreisrund in der Form vom Helikopter."
   „44% 0%, 86% 0%" war eine GERADE Oberkante mit einer spitzen Ecke
   bei 44 % — genau die Ecke, die er gesehen hat. Dach und rechte
   Seite sind jetzt EIN Kreisbogen um (48 | 56,5) mit r = 51. */
pruefe("das Kabinenfenster schneidet oben kreisrund ab",
  /80\.3% 96%, 88\.8% 87\.1%, 94\.9% 76\.5%/.test(css)
  && /50\.4% 5\.6%, 38\.2% 6\.5%, 26\.4% 10\.3%/.test(css)
  && !/44% 0%, 86% 0%,/.test(css));

console.log("\nDIE LIANE IST EIN PENDEL\n");
pruefe("der Anker liegt in der Mitte zwischen beiden Plaetzen",
  /const ankerX = \(start\.x \+ ende\.x\) \/ 2;/.test(js));
pruefe("bewegt wird nur der Winkel, nicht das ganze Gebilde",
  /transform: "translate\(-50%, 0\) rotate\(" \+ grad\(w\)/.test(js));
pruefe("und der Winkel folgt dem Pendelgesetz",
  /mitteW \+ weiteW \* Math\.cos\(Math\.PI \* u\)/.test(js));
pruefe("mit einem Anlauf nach hinten",
  /const wA = w0 \+ \(w0 - w1\) \* 0\.30;/.test(js));
pruefe("das Seil haengt mit seinem oberen Ende am Anker",
  /\.lc-liane\.lc-liane-pendel \{[\s\S]{0,200}?transform-origin: 50% 0;/.test(css));

console.log("\nDER MAULWURF\n");
pruefe("das Grabgeraeusch hoert auf, wenn er ankommt",
  /lcTonSpaeter\("graben", abG, g \? 0\.4 : 0\.5,/.test(js)
  && /function lcTonSpaeter\(name, nachMs, laut, hoechstens\)/.test(js));
/* RUNDE 75 — rund ist sie geblieben, aber viel breiter.
   XANDER: „Genauso breit sollen die Haufen sein ueber die
   Profilbilder hinweg." 0,92 statt 0,40 — ein Haufen nimmt jetzt die
   Breite eines Profilbildes ein. */
pruefe("die Aufschuettung ist rund und so breit wie ein Profilbild",
  /\.lc-erdhaufen \{\s*\n\s*width: calc\(var\(--gross, 64px\) \* \.92\);/.test(css)
  && /border-radius: 50%;/.test(css));
pruefe("und sie besteht aus vielen Kruemeln verschiedener Groesse",
  (css.match(/radial-gradient\(circle at \d+% \d+%, #[0-9a-f]{6} 0 \d+%/g) || []).length >= 9);
pruefe("die Kruemel am Loch sind Kreise, keine liegenden Ellipsen",
  /<circle class="lc-maulwurf-krume"/.test(js)
  && !/<ellipse class="lc-maulwurf-krume"/.test(js));

console.log("\nDIE ROEHRE\n");
pruefe("sie sitzt am BILD, nicht in der Mitte des ganzen Platzes",
  /const versatzR = lcBildVersatz\(ab\.el\);/.test(js)
  && /setzen\(roehre, wo\.x, wo\.y \+ versatzR \+ d \* ROHR_MITTE\);/.test(js));
pruefe("und das Ausstiegsbild ebenso — das war die Doppelung",
  /setzen\(doppel, ende\.x, ende\.y \+ lcBildVersatz\(zu\.el\)\);/.test(js));
pruefe("die Toene haben mehr Stufen und gehen langsamer",
  ton("rohrsog") && ton("rohrspuck"));
pruefe("die alten liegen im Backup",
  fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde73", "rohrsog.opus")));

console.log("\nSPRUNGFEDER, HELIKOPTER, BILLARD, ANGEL\n");
/* RUNDE 76 — seit die Feder auch einem gemalten Weg folgen kann,
   stehen die Aufsetzer in „federLand"; ohne gemalten Weg ist das
   genau wie vorher einer je ueberquertem Platz. */
pruefe("die Feder setzt auf Plaetzen auf, nicht dazwischen",
  /Array\.from\(\{ length: Math\.max\(1, plaetzeR\) \}/.test(js));
pruefe("und sie macht ein Comic-Boing",
  ton("federboing") && gelistet("federboing")
  && /lcTonSpaeter\("federboing",/.test(js));
pruefe("der Helikopter klingt bis zur Landung durch",
  /heli:           \{ ton: "helikopter", dauer: 4400, schleife: true/.test(js));
pruefe("der Queue stoesst durch, statt zurueckzuziehen",
  /@keyframes lcQueueR74/.test(css) && /animation: lcQueueR74 2\.4s linear both;/.test(css));
pruefe("und die Kugel rollt nicht zum Spieler zurueck",
  /@keyframes lcBillardKugelR74/.test(css)
  && /56%, 88% \{ opacity: 1; transform: translate\(-8%, 0\)/.test(css));
/* RUNDE 98 — dazugekommen ist der Kran: XANDER: „Dann haette ich
   gerne den Kran dafuer, dass man jemand anderen noch auf einen Platz
   heben kann." Es sind also drei Werkzeuge statt zwei — die Regel
   bleibt dieselbe: das WERKZEUG entscheidet, nicht die Sitzreihe. */
/* RUNDE 101 — dazugekommen sind Bagger und „Hau ab" (Fassung 562/563);
   die Kette hat damit fuenf Glieder. Die alte Zeile („reiheNeu <
   reiheAlt") steht nur noch in einem Kommentar, der erklaert, warum sie
   weg ist — geprueft wird deshalb der Code OHNE Kommentare. */
pruefe("das Werkzeug entscheidet, nicht die Sitzreihe",
  /var wieH = lassoZieht \? "lasso" : \(kranZieht \? "kranheben" : \(baggerZieht \? "bagger"\s*: \(hauabZieht \? "hauab" : "heber"\)\)\);/.test(lc)
  && !/reiheNeu < reiheAlt \? "heber" : "lasso"/.test(lc.replace(/\/\*[\s\S]*?\*\//g, "")));
pruefe("die Angel bekommt ihr Ziel mitgeschickt",
  /wirkung: wieH, wen: wenH\.name, ziel: nummerH/.test(lc)
  && /const zielNr = Number\(nachricht && nachricht\.ziel\) \|\| 0;/.test(js));
pruefe("und sie zieht dorthin, nicht zu mir",
  /@keyframes lcGeangeltR74/.test(css)
  && !/lcZuMirZiehen\(platz, kreis\);\s*\n\s*kreis\.classList\.remove\("lc-gehoben"\)/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 74 sitzt.\n");
process.exit(fehler ? 1 : 0);
