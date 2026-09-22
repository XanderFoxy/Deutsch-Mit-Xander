#!/usr/bin/env node
/* =========================================================
   RUNDE 70 — DIE TOENE STIMMEN WIEDER
   ---------------------------------------------------------
   Aus seiner langen Liste alles, was mit GERAEUSCH und
   ZEITPUNKT zu tun hat. Jede Regel hier prueft eine Sache,
   die vorher NACHGEMESSEN wurde — nicht eine, die ich mir
   ausgedacht habe.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
/* Kommentare raus: sonst trifft eine Regel meinen eigenen
   Begruendungstext statt des Codes. */
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = ohneK(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"));
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const liste = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");
const da = (n) => new RegExp("(^|\\|)" + n + "(\\||\")").test(liste)
  && fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
  && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));

console.log("\nDIE NEUEN AUFNAHMEN LIEGEN WIRKLICH DA");
[
  "portaldunkel", "muenze2", "raddampfer", "segelboot", "gummiband",
  "katapult3", "explosion2", "geigenstich", "tarzanmann", "tarzanfrau",
  "sprungturm", "lichtschalter", "lunte", "pfeilflug", "kussmann",
  "kussfrau", "ekelmann", "ekelfrau", "fluegelschlag", "birneschrauben",
  "bowling2", "strudel4"
].forEach((n) => pruefe(n, da(n)));

console.log("\nDER RADDAMPFER KLANG WIE EIN SEGELBOOT");
pruefe("sein Zweig ruft jetzt seinen eigenen Ton",
  /lcTonReise\("dampfer", dauer\)/.test(js));
pruefe("und der Plan zeigt auf die Raddampfer-Aufnahme",
  /dampfer:\s+\{ ton: "raddampfer"/.test(js));
pruefe("das Segelboot behaelt seinen",
  /lcTonReise\("boot", dauer\)/.test(js)
  && /boot:\s+\{ ton: "segelboot"/.test(js));

console.log("\nDIE FAHRT WAECHST MIT DER STRECKE");
pruefe("die Strecke wird in Plaetzen gemessen",
  /const einheitR = lcPlatzAbstand\(/.test(js)
  && /const plaetzeR = einheitR \?/.test(js));
pruefe("und die Fahrzeit haengt daran",
  /Math\.round\(grund \* \(0\.72 \+ 0\.28 \* plaetzeR\)\)/.test(js));
/* RUNDE 85: der Fahrstuhl steht jetzt neben dem Beamen — auch er
   braucht immer dieselbe Zeit, weil Tuer und Glocke am Geraet haengen
   und nicht an der Entfernung. Gemessen wird deshalb der Sinn (beide
   nehmen „grund" unveraendert), nicht mehr der Wortlaut. */
pruefe("das Beamen bleibt ein Sprung — und der Fahrstuhl auch",
  /\(art === "beamen" \|\| art === "fahrstuhl"\) \? grund/.test(js));
pruefe("der Ton laeuft genau so lange wie die Fahrt",
  /function lcTonReise\(was, ms\)/.test(js)
  && /plan\.dauer = Math\.max\(600, Math\.round\(ms\)\)/.test(js));

console.log("\nDER SCHMERZ KOMMT NACH DEM TREFFER");
pruefe("Zwille: das Gummiband traegt den ganzen Ablauf",
  /zwille:\s+\{ ton: "gummiband", dauer: 2600, laut: 0\.7, spaet: 300 \}/.test(js));
pruefe("Zwille: der Schrei liegt hinter dem Einschlag (1500 ms)",
  /lcStimmeZu\(platz, "schreimann", "schreifrau", 1560, 0\.72\)/.test(js));
pruefe("Zwille: die Kugel schlaegt bei 57,7 % ein",
  /57\.7%\s+\{ opacity: 1; transform: translate\(var\(--px/.test(css));
pruefe("Zwille: das AUA erscheint mit dem Einschlag",
  /animation: lcZpWort \.9s ease-out 1\.5s both;/.test(css));
/* RUNDE 73 NACHGEFUEHRT. XANDER: „Er muss erst mal auftreffen, man
   muss das hoelzerne Geraeusch, und dann muss der Schrei kommen — und
   nicht so getimet, dass der Schrei sofort zu hoeren ist. Das muss ja
   erst mal weh tun." 60 ms Abstand hoert man als EINEN Laut; jetzt
   sind es 200 (Holz 860, Schrei 1060). */
pruefe("Bumerang: Schrei nach Geschlecht, 200 ms nach dem TOCK",
  /lcTonSpaeter\("holzklopf", 860, 0\.78\)/.test(js)
  && /lcStimmeZu\(platz, "schreimann", "schreifrau", 1060, 0\.7\)/.test(js));
pruefe("Bumerang: und ein zweites Sausen fuer den Rueckflug",
  /lcTonSpaeter\("bumerang2", 1560, 0\.45\)/.test(js));
pruefe("Anspucken: ein Ekellaut statt des kurzen au",
  /lcStimmeZu\(platz, "ekelmann", "ekelfrau", 1620, 0\.62\)/.test(js)
  && !/"aumann", "aufrau", 1400/.test(js));

console.log("\nMANN UND FRAU");
pruefe("Tarzan ruft verschieden",
  /lcStimmeZu\(ab\.el, "tarzanmann", "tarzanfrau", 260, 0\.75\)/.test(js));
pruefe("der Kuss auch",
  /lcStimmeZu\(meiner, "kussmann", "kussfrau", 520, 0\.62\)/.test(js));
pruefe("und der Plan mischt sich beim Kuss nicht mehr ein",
  /kuss:\s+\{ still: true/.test(js)
  && /if \(plan && plan\.still\) return;/.test(js));

console.log("\nWAS ABGESCHNITTEN ODER UEBERTOENT WURDE");
/* RUNDE 72 NACHGEFUEHRT. Der Plan zeigt jetzt auf „slot2" und laeuft
   4200 ms statt 2800. XANDER: „Der Zufall braucht ein Slotmaschinen-
   oder Flipper-Klingeln, und man muss die Entscheidung der Walzen
   hoeren." Gemessen hatte „slot" zwei Ausbrueche und danach zwei
   Sekunden Rauschteppich — keine Walzen, kein Einrasten, kein
   Klingeln. Worum es dieser Regel eigentlich geht, bleibt aber
   gleich: die Aufnahme darf nicht mitten im Klingeln abgeschnitten
   werden. „slot2" ist 4,14 s lang, die Dauer 4200 deckt sie ganz. */
pruefe("Zufall: die Slotmaschine wird nicht mehr im Gewinn abgeblendet",
  /zufall:\s+\{ ton: "slot2",\s+dauer: 4200, laut: 0\.68 \}/.test(js));
pruefe("Geld: die Kasse klingelt fertig, bevor es regnet",
  /geld:\s+\{ ton: "geld", dauer: 9500, schleife: true , laut: 0\.5, spaet: 1300 \}/.test(js));
pruefe("Strudel: eine Aufnahme, die durchdreht",
  /strudel:\s+\{ ton: "strudel4", dauer: 11000, schleife: true, laut: 0\.55 \}/.test(js));
pruefe("Muenze: drehen, eiern, liegenbleiben",
  /muenze:\s+\{ ton: "muenze2",\s+dauer: 5500, laut: 0\.55 \}/.test(js));
/* RUNDE 73 — XANDER: „Der Bowling-Sound hat so ein
   Regal-Einsturz-Geraeusch und ist nicht synchron."
   NACHGEMESSEN: die Datei ist 6,0 s lang, die Animation 2,4 s, und
   bei 3,0 bis 3,4 s liegt ein zweiter, langer Scheppersatz — das
   Regal. Es klang 1,4 s nachdem alles vorbei war. Der Plan deckelt
   jetzt bei 2,4 s, und der Ton faengt bei 0 an (LC_TREFFER), damit
   das Rollen (0 bis 1,4 s) mitlaeuft und der Schlag bei 1,4 s
   genau auf den Treffer faellt. */
pruefe("Bowling: Rollen und Kegel, aber kein Regal mehr",
  /bowling:\s+\{ ton: "bowling2", dauer: 2400, laut: 0\.6 \}/.test(js)
  && /bowling: 0,/.test(js));
/* EHRLICH GEBLIEBEN: die Aufnahme mit Schwung UND Treffer hatte
   GEMESSEN nur den Treffer (Spitze bei 80 ms, davor nichts). Sie ist
   geloescht. Der Treffer bleibt „hammerbonk" auf 300 ms, das Ausholen
   kommt aus „swoosh", das schon da war. */
pruefe("Hammer: der Treffer bleibt, das Ausholen kommt dazu",
  /hammer:\s+\{ ton: "hammerbonk"/.test(js)
  && /lcTonSpaeter\("swoosh", 40, 0\.4\)/.test(js)
  && !fs.existsSync(path.join(WURZEL, "ton", "hammerschwung.opus")));
/* RUNDE 73 NACHGEFUEHRT. XANDER: „Bei der Gluehbirne ist ein
   zusaetzliches Auto-Quietsch-Geraeusch noch." NACHGEMESSEN: das kam
   aus „birneschrauben" selbst — deren Energie liegt bei etwa 5000 Hz,
   und so klingt eine Autobremse. „birnedrehen" ist selbst gebaut und
   trocken. Worum es dieser Regel geht, bleibt dasselbe: kein
   Quietschen an der Birne. */
pruefe("Gluehbirne: Gewinde statt Quietschen",
  /gluehbirne:\s+\{ ton: "birnedrehen"/.test(js));
pruefe("Katapult: die Aufnahme, die im Plan stand, liegt endlich da",
  /katapult: 0,/.test(js) && da("katapult3"));
/* RUNDE 72 NACHGEFUEHRT: der Einschlag liegt nicht bei 714 ms,
   sondern gemessen bei 656 ms (Bild fuer Bild im Browser verfolgt).
   Die 714 kamen aus „21 % von 3,4 s" — aber auf der Animation liegt
   eine cubic-bezier ueber die ganze Laenge, und die dehnt die
   Abstaende zwischen den Schluesselbildern. Das Sausen faengt jetzt
   bei 545 ms an; seine Spitze liegt gemessen 75 ms spaeter, also
   bei 620 ms und damit unmittelbar VOR dem Einschlag. */
/* RUNDE 73 NACHGEFUEHRT. XANDER: „Der Pfeil hat, wenn er schon
   auftrifft, den Wind-Sound und danach erst den Ankommen-Sound."
   GEMESSEN: „pfeilflug" ist 1,62 s lang und zieht eine Rauschfahne
   weit hinter den Einschlag. Jetzt faengt es bei 400 ms an und wird
   ueber einen eigenen Plan-Eintrag bei 260 ms abgeblendet — es ist
   also zum Einschlag bei 656 ms fertig. */
pruefe("Pfeil: das Sausen liegt vor dem Einschlag bei 656 ms",
  /lcTonSpaeter\("pfeilflug", 400, 0\.55\)/.test(js)
  && /pfeilflug:\s+\{ ton: "pfeilflug", dauer: 260/.test(js)
  && /saugpfeil: 656,/.test(js));
/* RUNDE 80 — XANDER: „und der Sound ist auch nicht durchgaengig."
   Die Aufnahme ist ab 0,9 s praktisch tot, geflogen wird drei
   Sekunden. Der Schlag wird deshalb VIERMAL angesetzt — der erste
   weiterhin bei 340 ms mit 0,55. */
pruefe("Greifvogel: Fluegelschlag unter dem Ruf",
  /\[340, 0\.55\]/.test(js)
  && /lcTonSpaeter\("fluegelschlag", wann, laut, 700\)/.test(js));
pruefe("Turm: die Leiter ist zu hoeren",
  /lcTonSpaeter\("sprungturm", 0, 0\.6\)/.test(js));

console.log("\nDER LICHTSCHALTER");
pruefe("der Plan traegt wieder das Klacken",
  /lichtaus:\s+\{ ton: "lichtschalter", dauer: 6200, laut: 0\.7 \}/.test(js));
/* RUNDE 73 — XANDER: „Die Geigen-Horror-Sache soll langsamer sein,
   wie ein Streichquartett." GEMESSEN: „geigenstich" setzt vier
   Stiche in 1,10 s, also alle 0,30 s. „geigenquartett" ist dieselbe
   Aufnahme auf 55 % Tempo mit zwei tieferen Lagen: vier Stiche in
   4,11 s, also alle 1,1 s. */
pruefe("die vier Geigenstiche kommen langsam in der Dunkelheit",
  /lcTonSpaeter\("geigenquartett", 1780, 0\.62\)/.test(js));
pruefe("die Wirkung dauert 6,2 s", /\}, 6200, "lichtaus"\);/.test(js));
pruefe("und die Dunkelheit haelt bis 88 %",
  /88%\s+\{ filter: brightness\(\.05\); \}/.test(css)
  && /88%\s+\{ opacity: 1; \}/.test(css));
/* NACHGEZAEHLT: es sind sechs — Verdunkelt, Schalter, Wippe,
   Faden, Nacht, Summen. Beim ersten Anlauf stand hier 5, und die
   Regel schlug an, obwohl im Code nichts fehlte. */
pruefe("alle sechs Bilder laufen gleich lang",
  (css.match(/R18 6\.2s/g) || []).length === 6
  && /lcAugenDaR70 6\.2s/.test(css));
pruefe("die Augen suchen wirklich",
  /@keyframes lcPupilleSuchtR70/.test(css)
  && /lc-lichtaus-augen/.test(js));

console.log("\nDIE PEITSCHE UEBERALL GLEICH");
pruefe("Welle und Ausholschlaufe stehen als eigene Bausteine da",
  /function lcPeitschenWelle\(\)/.test(js)
  && /function lcPeitschenHolen\(\)/.test(js));
pruefe("die Leine benutzt sie",
  /lcPeitschenHolen\(\)\s*\n\s*\+ lcPeitschenWelle\(\)/.test(js));
pruefe("und der Selbstschlag auch",
  /lc-peitsche-selbst/.test(js) && /\.lc-peitsche-selbst \{/.test(css));
pruefe("das alte braune Seil ist fort",
  !/stroke="#6b4a22" stroke-width="4"/.test(js));
pruefe("die Laenge wird gemessen, nicht geraten",
  /Math\.round\(br \* 0\.95\) \+ "px"/.test(js));

console.log("\nKLEINKRAM, DEN ER GENANNT HAT");
/* Drei Stellen duerfen bleiben: die Kachel UNTER dem Strohhalm,
   die Wirkung selbst und die Weiche. Weg ist nur die eigene Kachel
   mit dem Wort „Pusten" — sie hatte dasselbe Zeichen wie der Halm. */
pruefe("die doppelte Pusten-Kachel ist weg",
  !/"Pusten",\s+"pusterohr"/.test(js)
  && /"Spuckkugel", "pusterohr"/.test(js)
  && (js.match(/"pusterohr"/g) || []).length === 3);
/* RUNDE 73 NACHGEFUEHRT: es schliesst jetzt AUCH der Leerraum IM
   Kasten. XANDER, zum wiederholten Mal: „man soll in ein Leeres
   klicken koennen und dann schliesst sich das Panel. Das soll bei
   jeglichen schwebenden Panels moeglich sein." Der Tipp NEBEN den
   Kasten schliesst weiterhin — das ist der Sinn dieser Regel. */
pruefe("ein Tipp neben den Waehler macht ihn zu",
  /const drin = ziel && ziel\.closest && ziel\.closest\("\.lc-waehler"\);/.test(js)
  && /offen\.forEach\(\(k\) => k\.remove\(\)\);/.test(js));
pruefe("und der Leerraum IM Kasten jetzt auch",
  /const LC_BEDIENBAR = /.test(js)
  && /if \(ziel\.closest\(LC_BEDIENBAR\)\) return;/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 70 sitzt.\n");
process.exit(fehler ? 1 : 0);
