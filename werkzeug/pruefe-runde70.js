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
pruefe("das Beamen bleibt ein Sprung", /art === "beamen" \? grund/.test(js));
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
pruefe("Bumerang: Schrei nach Geschlecht auf dem TOCK (860 ms)",
  /lcStimmeZu\(platz, "schreimann", "schreifrau", 920, 0\.7\)/.test(js));
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
pruefe("Bowling: Rollen und Kegel",
  /bowling:\s+\{ ton: "bowling2", dauer: 6000, laut: 0\.55 \}/.test(js));
/* EHRLICH GEBLIEBEN: die Aufnahme mit Schwung UND Treffer hatte
   GEMESSEN nur den Treffer (Spitze bei 80 ms, davor nichts). Sie ist
   geloescht. Der Treffer bleibt „hammerbonk" auf 300 ms, das Ausholen
   kommt aus „swoosh", das schon da war. */
pruefe("Hammer: der Treffer bleibt, das Ausholen kommt dazu",
  /hammer:\s+\{ ton: "hammerbonk"/.test(js)
  && /lcTonSpaeter\("swoosh", 40, 0\.4\)/.test(js)
  && !fs.existsSync(path.join(WURZEL, "ton", "hammerschwung.opus")));
pruefe("Gluehbirne: Gewinde statt Quietschen",
  /gluehbirne:\s+\{ ton: "birneschrauben"/.test(js));
pruefe("Katapult: die Aufnahme, die im Plan stand, liegt endlich da",
  /katapult: 0,/.test(js) && da("katapult3"));
/* RUNDE 72 NACHGEFUEHRT: der Einschlag liegt nicht bei 714 ms,
   sondern gemessen bei 656 ms (Bild fuer Bild im Browser verfolgt).
   Die 714 kamen aus „21 % von 3,4 s" — aber auf der Animation liegt
   eine cubic-bezier ueber die ganze Laenge, und die dehnt die
   Abstaende zwischen den Schluesselbildern. Das Sausen faengt jetzt
   bei 545 ms an; seine Spitze liegt gemessen 75 ms spaeter, also
   bei 620 ms und damit unmittelbar VOR dem Einschlag. */
pruefe("Pfeil: das Sausen liegt vor dem Einschlag bei 656 ms",
  /lcTonSpaeter\("pfeilflug", 545, 0\.55\)/.test(js)
  && /saugpfeil: 656,/.test(js));
pruefe("Greifvogel: Fluegelschlag unter dem Ruf",
  /lcTonSpaeter\("fluegelschlag", 340, 0\.55\)/.test(js));
pruefe("Turm: die Leiter ist zu hoeren",
  /lcTonSpaeter\("sprungturm", 0, 0\.6\)/.test(js));

console.log("\nDER LICHTSCHALTER");
pruefe("der Plan traegt wieder das Klacken",
  /lichtaus:\s+\{ ton: "lichtschalter", dauer: 6200, laut: 0\.7 \}/.test(js));
pruefe("die vier Geigenstiche kommen in der Dunkelheit",
  /lcTonSpaeter\("geigenstich", 1780, 0\.62\)/.test(js));
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
pruefe("ein Tipp neben den Waehler macht ihn zu",
  /const drin = e\.target && e\.target\.closest\s*\n?\s*&& e\.target\.closest\("\.lc-waehler"\);/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 70 sitzt.\n");
process.exit(fehler ? 1 : 0);
