#!/usr/bin/env node
/* =========================================================
   RUNDE 66 — HELIKOPTER, GEWICKELTER GRIFF, DIE
   NEUNSCHWAENZIGE UND DIE ROHRREISE AUF BEIDEN SEITEN
   ---------------------------------------------------------
   AUS DER WERKSTATT, woertlich gewuenscht:
   · „Lok und Helikopter brauchen noch mehr Details"
     (die Lok kam in Runde 65, jetzt der Helikopter)
   · „Peitsche: echter gewickelter Griff, und eine
     mehrschwaenzige fuer alle auf einmal"
   · „Rohrreise: der Reisende ist auf beiden Seiten
     gleichzeitig zu sehen"
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
/* Nur der Rumpf von lcNeunschwanz — sonst schlagen Regeln an, die
   andere Effekte betreffen. preserveAspectRatio="none" zum Beispiel
   benutzen Liane und Wegmalen voellig zu Recht. */
const nszRoh = js.slice(js.indexOf("function lcNeunschwanz("),
                        js.indexOf("function lcPeitsche("));
/* OHNE KOMMENTARE. Beim ersten Anlauf schlug die Regel auf meinen
   EIGENEN Kommentar an, in dem steht, warum preserveAspectRatio hier
   falsch waere — der Code war laengst richtig. Ein Pruefsatz, der den
   Kommentar liest statt die Anweisung, prueft nichts. */
const nsz = nszRoh.replace(/\/\*[\s\S]*?\*\//g, "");

console.log("\nDER HELIKOPTER");
/* RUNDE 71 NACHGEZOGEN: die Zelle ist hoeher geworden (XANDER: „der
   Helikopter kann nicht so laenglich sein vom Koerper"), und damit
   ist der Mastkopf von y=10 auf y=7,5 gewandert — das sind 10,71 %
   statt 14,29 % von 70. Diese Pruefung hat den Fehler gemeldet,
   BEVOR er auffiel; deshalb steht hier jetzt der neue Wert und nicht
   weniger streng als vorher. */
pruefe("der Rotor sitzt auf dem Mast, nicht daneben",
  /\.lc-heli-rotor \{[\s\S]{0,260}?left: 43\.85%;/.test(css)
  && /\.lc-heli-rotor \{ top: 10\.71%; \}/.test(css));
pruefe("und der Mastkopf steht im Bild wirklich dort",
  /<circle class="lc-heli-kopf" cx="57" cy="7\.5"/.test(js));
pruefe("er dreht nicht mehr wie ein Flugzeugpropeller",
  /@keyframes lcHeliBlattR66/.test(css)
  && !/@keyframes lcHeliBlattR66[\s\S]{0,600}?rotate\(/.test(css));
pruefe("stattdessen wandert das Blatt nach hinten und kommt vorn heraus",
  /lcHeliBlattR66[\s\S]{0,600}?translateY\(20%\) scaleX\(1\)[\s\S]{0,300}?scaleX\(\.08\)/.test(css));
pruefe("das zweite Blatt liegt eine halbe Umdrehung dahinter",
  /\.lc-heli-blatt-2 \{ animation-delay: -\.09s; \}/.test(css));
/* RUNDE 71: die Kanzel ist mitgewandert — Glas jetzt x 9,5…42
   (Mitte 19,2 %), das Fenster steht auf 19,8 %. Nachgemessen im
   Browser: Glas 104…156 px, Fenster 110…152 px. */
pruefe("das Profilbild sitzt in der Kanzel, nicht mitten im Rumpf",
  /\.lc-heli-kanzel \{\s*\n\s*left: 19\.8%;[\s\S]{0,160}?width: 19\.5%;/.test(css));
/* RUNDE 74 — XANDER: „Das Helikopterfenster ist immer noch nicht
   abgeschraegt vorne. Das ist keine schraege Scheibe."
   Der alte Umriss lief mit zwei Boegen von (11|39) ueber (30|18) und
   (42|18) bis (30|45) — vorn UND unten rund, also ein Klumpen. Eine
   Hubschrauberkanzel besteht aus zwei GERADEN Scheiben: der um 47
   Grad geneigten Frontscheibe und der Kinnscheibe darunter. */
/* RUNDE 80 — XANDER: „Beim Helikopter gibt es im Hintergrund vom Bild
   noch so Erweiterung von dem Glas … das ist noch viel zu eckig."
   Die Kanzel ist deshalb nicht mehr aus GERADEN Strecken gebaut,
   sondern gewoelbt. Was diese Regel wirklich meint, bleibt richtig
   und wird weiter gemessen: die Front ist nach hinten geneigt (sie
   laeuft von unten vorn nach oben hinten), und darunter sitzt eine
   eigene Kinnscheibe. */
/* RUNDE 101 — XANDER (Funk 91): „das Glas, was du hinter dem
   Profilbild hast, das kann weg … da soll dieses kreisrunde sein …
   aus dem Profilbild herausgestanzt." Front- und Kinnscheibe sind
   deshalb absichtlich weg; gemessen wird jetzt das runde Fenster. */
pruefe("kein eckiges Glas mehr hinter dem Bild — das Fenster ist das Bild",
  !/lc-heli-glas" d=/.test(js)
  && /\.lc-heli \.lc-heli-kanzel \{[\s\S]{0,200}?clip-path: none;[\s\S]{0,80}?border-radius: 50% 50%/.test(css));
pruefe("er steht auf seinem eigenen Abwind", /lc-heli-wind/.test(js) && /lcHeliWindR66/.test(css));

console.log("\nDER GEWICKELTE GRIFF");
pruefe("es gibt eine echte Zeichnung, kein Streifenmuster mehr",
  /function lcPeitschenGriff\(\)/.test(js)
  && /\.lc-peitsche-griff \{\s*background: none;/.test(css));
pruefe("Knauf, Koerper, Zwinge und Glanz",
  ["lc-griff-knauf", "lc-griff-koerper", "lc-griff-zwinge", "lc-griff-glanz"]
    .every((k) => js.indexOf(k) >= 0));
pruefe("neun Riemen, jeder mit einer hellen Kante",
  /i < 9; i\+\+/.test(js) && /lc-griff-riemen/.test(js) && /lc-griff-kante/.test(js));
pruefe("und die einschwaenzige Peitsche benutzt denselben Griff",
  /'<span class="lc-peitsche-griff">'\s*\+ lcPeitschenGriff\(\)/.test(js));

console.log("\nDIE NEUNSCHWAENZIGE — FUER ALLE AUF EINMAL");
pruefe("es gibt sie", /function lcNeunschwanz\(von\)/.test(js)
  && /neunschwanz: \{ wirkung: "neunschwanz"/.test(lc));
pruefe("sie nimmt JEDEN, der dasitzt",
  /!pl\.classList\.contains\("lc-platz-frei"\) && pl !== vonPlatz/.test(js));
pruefe("jeder Schwanz bekommt gemessenen Winkel und gemessene Laenge",
  /Math\.atan2\(by - ay, bx - ax\)/.test(js) && /roh - radius \* 0\.72/.test(js));
pruefe("die Schwaenze liegen nicht uebereinander — jeder schwingt anders",
  /setProperty\("--welle"/.test(js) && /setProperty\("--seite"/.test(js)
  && /\.lc-nsz-welle \{[\s\S]{0,300}?scaleY\(calc\(var\(--welle/.test(css));
pruefe("die Bahn wird in der gemessenen Laenge gezeichnet, nicht gestreckt",
  /const k = laenge \/ 100;/.test(nsz) && !/preserveAspectRatio/.test(nsz)
  && !/non-scaling-stroke/.test(nsz));
pruefe("vier Abschnitte, nach aussen duenner, mit Knoten an der Spitze",
  /const DICK = \[4\.6, 3\.2, 2\.0, 1\.1\];/.test(js) && /lc-nsz-knoten/.test(js));
/* Der Knall gehoert EINMAL ans Ende, nicht in die Schleife ueber die
   Plaetze — sonst knallt es einmal je Person. Gemessen wird deshalb,
   dass er NACH „if (!wieViele) return false;" steht, also ausserhalb
   des forEach. */
pruefe("es knallt EINMAL, nicht einmal je Person",
  (nsz.match(/lcTonSpaeter\("peitschenknall", 780/g) || []).length === 1
  && nsz.indexOf('lcTonSpaeter("peitschenknall"')
     > nsz.indexOf("if (!wieViele) return false;"));
pruefe("und die einschwaenzige knallt weiterhin zur selben Zeit",
  (js.match(/lcTonSpaeter\("peitschenknall", 780/g) || []).length === 2);
pruefe("sie steht in den Tabellen", /neunschwanz: \{ zeichen/.test(js)
  && /neunschwanz: 1,/.test(js));

console.log("\nDIE ROHRREISE — NACHEINANDER, NICHT GLEICHZEITIG");
/* RUNDE 72 — DIESE DREI REGELN HIELTEN EINEN FEHLER VON MIR FEST.
   In Runde 66 hatte ich Xanders Satz „der Reisende ist auf beiden
   Seiten gleichzeitig zu sehen" als WUNSCH gelesen und die
   Ueberschneidung eigens eingebaut — samt dieser Sonde, die sie
   festschreibt. Nachgelesen im Verlauf sagt er woertlich das
   Gegenteil: „Nachdem man denjenigen wieder ausspuckt, spuckt es
   ihn auf beiden Seiten gleichzeitig aus … Zusaetzlich: das Bild auf
   der anderen Seite klingt zwar ab, aber es soll UEBERHAUPT NICHT
   auf beiden Seiten auftauchen." Es war eine Fehlermeldung.
   Die Regeln sagen jetzt das Gegenteil, und sie sind gemessen:
   das Startbild ist ab 1,2 s ganz weg (clipPath 100 %), die
   Zielroehre kommt erst ab 1,8 s hoch, das Zielbild steigt ab
   2,4 s heraus. Es gibt keinen Augenblick mit zwei Bildern. */
pruefe("es gibt ein zweites Bild an der Zielroehre", /lc-rohr-doppel/.test(js)
  && /\.lc-rohr-doppel \{/.test(css));
/* RUNDE 73 — DIE ZWEI REGELN SUCHTEN HANDGESCHRIEBENE ZAHLEN.
   Genau die waren der Fehler: der Zuschnitt war von Hand gesetzt
   (bei 40 % Absinken 52 % weg, bei 62 % gleich 100 %) und lief dem
   Bild davon. XANDER: „das Bild wird abgeschnitten, bevor es ganz
   drin ist." Jetzt kommen Absinken und Zuschnitt aus EINER Zeile —
   `rohrBild(v)` — und genau das wird hier geprueft. Eine Regel auf
   die alten Zahlen haette die Rechnung wieder auseinandergerissen. */
pruefe("Absinken und Zuschnitt kommen aus derselben Rechnung",
  /const rohrBild = \(v, vorne, zeit\) => \(\{/.test(js)
  && /translateY\(" \+ \(v \* 100\)/.test(js)
  && /\(ROHR_MUND \+ v\) \* 100/.test(js));
pruefe("am Startrohr sinkt er bis ganz hinein und bleibt weg",
  /rohrBild\(0\.62,  false, 0\.26\)/.test(js)
  && /rohrBild\(0\.62,  false, 0\.95\)/.test(js));
pruefe("und drueben taucht er erst danach auf — keine Ueberschneidung",
  /rohrBild\(0\.62, true, 0\.557\)/.test(js));
pruefe("die Roehre steht nicht mehr auf dem Nachbarplatz",
  /const ROHR_HOCH = 0\.62;/.test(js)
  && /const ROHR_MITTE = 0\.12 \+ ROHR_HOCH \/ 2;/.test(js));
pruefe("und das Ausstiegsbild geht, wenn das echte kommt",
  /const schnittR = Math\.min\(0\.98, \(hin \+ 120\) \/ dauer\);/.test(js));
pruefe("die Zielroehre faehrt erst hoch, wenn die Startroehre unten ist",
  /const abR = i \? taktR\(0\.46\) : 0;/.test(js)
  && /const spanneR = i \? taktR\(0\.44\) : taktR\(0\.34\);/.test(js));
pruefe("und die Roehren haengen an gerechneten Zeiten, nicht an einer festen Dauer",
  /roehre\.style\.animation = "none";/.test(js)
  && /const taktR = \(anteil\) => Math\.round\(dauer \* anteil\);/.test(js));
pruefe("die feste Dauer im Stilblatt ist weg",
  !/\.lc-roehre-rein \{ animation-duration: 1\.5s; \}/.test(css));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 66 sitzt.\n");
process.exit(fehler ? 1 : 0);
