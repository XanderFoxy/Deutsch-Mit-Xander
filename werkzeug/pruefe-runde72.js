#!/usr/bin/env node
/* =========================================================
   RUNDE 72 — XANDERS FEHLERLISTE
   ---------------------------------------------------------
   Woertlich gemeldet, und hier steht zu jedem Punkt, woran
   man nachsehen kann, dass er behoben ist:

   · „wenn ich einen anderen Platz aussuche, ist der Schein
     immer noch auf der 1 da, wo ich hergekommen bin"
   · „das beamen hinterlaesst immer noch den Rueckstand"
   · „die Roehre ist immer noch nicht repariert"
   · „Das Wasser von dem Schwimmbecken … ist noch nicht
     buendig mit dem Profil Platz"
   · „Bringe bitte den Zufall nicht mit dem Geld durcheinander"
   · „Der Cowboy Sound ist immer noch am Anfang abgeschnitten"
   · „die Fassung ist immer noch nicht mit dem Glas verbunden"
   · „der lange Piepton ist immer noch da … ohne Explosionsknall"
   · „Beim Bumerang fehlt mir der Weg hin"
   · „Beim Tennis fehlt immer noch ein richtiger Sound"
   · „Der Schneeball soll … mehr Strecke zurueckleg[en]"
   · „Der Sound der Sprungfeder ist nicht an die Position
     gebunden, auf die sie springt"
   · „Der Lokomotive fehlt das Stampfen beim Anfahren"
   · „Der Raddampfer braucht ein typisches Dampfer-Extra"
   · „Der Landesound faellt nicht mit der visuellen Landung
     zusammen"
   · „Die zwei Gluehbirnen-Animationen sollten zwei einzelne
     Kacheln sein"
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
/* Ohne Kommentare — sonst springt eine Regel auf die Begruendung an
   statt auf die Anweisung. Genau das ist in Runde 66 passiert. */
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = ohneK(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"));
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const lc = ohneK(fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8"));
const ton = (n) => fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
                && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));
const gelistet = (n) => fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8")
  .split("|").some((x) => x.replace(/[^a-z0-9]/g, "") === n);

console.log("\nDER SCHEIN BLEIBT NICHT AM ALTEN PLATZ");
/* GEFUNDEN: die Marke wurde nach PLATZNUMMER gesetzt und nach
   PLATZNUMMER wieder abgenommen. Wer zwischendurch umzieht, dessen
   Nummer ist eine andere — das Abnehmen traf den neuen Platz, der
   Ring blieb am alten. */
pruefe("die Marke merkt sich das ELEMENT, nicht die Nummer",
  /let stimmeMarke = null;/.test(js)
  && /stimmeMarke = knopf;/.test(js));
pruefe("und vor dem Setzen wird ueberall abgeraeumt",
  /querySelectorAll\("\.lc-platz-stimme"\)\.forEach\(\(x\) => \{\s*\n?\s*if \(!an \|\| x !== stimmeMarke\)/.test(js));

console.log("\nDAS BEAMEN LAESST NICHTS ZURUECK");
pruefe("es gibt eine Stelle, die Reste kennt", /const LC_RESTE = \[/.test(js)
  && /function lcPlaetzeSaeubern\(\)/.test(js));
pruefe("sie nimmt den Beam-Rest mit", /"lc-gebeamt"/.test(js)
  && /querySelectorAll\("\.lc-beam-glanz"\)/.test(js)
  && /removeProperty\("--beamzeit"\)/.test(js));
pruefe("sie laeuft vor JEDER Reise und nach jeder Reise",
  (js.match(/lcPlaetzeSaeubern\(\)/g) || []).length >= 3);
/* AUS SCHADEN GELERNT: „lc-eingedreht", „lc-ausgedreht" und
   „lc-gesprengt" standen kurzzeitig mit in der Liste. Die TRAGEN
   aber die Animation und laufen vier bis fuenf Sekunden — eine
   Reise dazwischen hat sie mitten in der Bewegung abgeraeumt
   (gemessen in pruefe-runde58.js: m34 = 0, die Birne drehte nicht
   mehr). Aufraeumen darf nur, was wirklich ein Rest ist. */
pruefe("aber NICHT, was gerade arbeitet",
  !/LC_RESTE = \[[\s\S]{0,400}?"lc-eingedreht"/.test(js)
  && !/LC_RESTE = \[[\s\S]{0,400}?"lc-gesprengt"/.test(js));

console.log("\nDIE ROEHRE: ERST HINEIN, DANN HERAUS — NIE BEIDES");
pruefe("die Zeiten haengen an der Reisedauer",
  /const taktR = \(anteil\) => Math\.round\(dauer \* anteil\);/.test(js));
/* RUNDE 73 — DIESE ZWEI REGELN SUCHTEN HANDGESCHRIEBENE ZAHLEN, UND
   GENAU DIE WAREN DER FEHLER. Der Zuschnitt war von Hand gesetzt und
   lief dem Absinken davon (bei 40 % Absinken 52 % weggeschnitten).
   XANDER: „das Bild wird abgeschnitten, bevor es ganz drin ist."
   Jetzt kommen beide aus EINER Zeile, `rohrBild(v)`, und die Regeln
   pruefen das — nicht mehr die alten Einzelwerte. */
pruefe("das Startbild sinkt ganz hinein und bleibt weg",
  /rohrBild\(0\.62,  false, 0\.26\)/.test(js)
  && /rohrBild\(0\.62,  false, 0\.95\)/.test(js));
pruefe("das Zielbild kommt erst, wenn die Zielroehre steht (55,7 %)",
  /rohrBild\(0\.62, true, 0\.557\)/.test(js));
pruefe("die Zielroehre faehrt erst ab 46 % hoch",
  /const abR = i \? taktR\(0\.46\) : 0;/.test(js));
pruefe("der Sog hat drei Impulse — und es gibt ihn wirklich",
  ton("rohrsog") && ton("rohrspuck")
  && gelistet("rohrsog") && gelistet("rohrspuck"));
/* RUNDE 73: die Marken haben sich um einen Hauch verschoben, weil
   der Zuschnitt erst einsetzt, wenn die Roehre wirklich steht
   (0,08 statt 0,07), und das Ausstiegsbild erst, wenn die zweite
   Roehre oben ist (0,557 statt 0,55). Die Toene sind mitgewandert —
   sie sollen ja am BILD haengen, nicht an einer runden Zahl. */
pruefe("und er liegt am Einfahren, nicht am Reisebeginn",
  /lcTonSpaeter\("rohrsog", taktR\(0\.08\), 0\.7\)/.test(js)
  && /lcTonSpaeter\("rohrspuck", taktR\(0\.557\), 0\.7\)/.test(js));
pruefe("der alte Brummton ist aus dem Plan",
  /rohr:\s+\{ still: true \}/.test(js));

console.log("\nBUENDIG: DAS BECKEN SITZT AUF DEM BILD, NICHT AUF DEM NAMEN");
pruefe("der Versatz wird gemessen, nicht geschaetzt",
  /const versatzT = lcBildVersatz\(ab\.el\);/.test(js));
pruefe("und Turm, Springer und Becken benutzen denselben",
  (js.match(/versatzT\)/g) || []).length >= 3);

console.log("\nGELD UND ZUFALL SIND ZWEIERLEI");
pruefe("die Kasse klingelt hoerbar — und zwar eine neue",
  ton("kasse2") && gelistet("kasse2")
  && /lcTonSpaeter\("kasse2", 0, 1\.0\)/.test(js));
pruefe("das Geldbett kommt erst danach", /geld:[\s\S]{0,90}?spaet: 1300/.test(js));
pruefe("der Zufall ist ein Spielautomat", ton("slot2") && gelistet("slot2")
  && /zufall:\s+\{ ton: "slot2",\s+dauer: 4200, laut: 0\.68 \}/.test(js));
pruefe("und das Los faellt erst, wenn die Walzen stehen",
  /\}, 2400\);/.test(js));

/* RUNDE 75 — DIESE REGEL IST UEBERHOLT, UND ZWAR VON XANDER SELBST.
   Sie hielt fest, dass der Ton 45 ms frueher startet, weil in Runde 72
   ein Vorlauf in die Datei gekommen war: 620 - 45 = 575 ms.
   XANDER in Runde 75: „Der Cowboy Sound ist immer noch abgeschnitten
   … man hoert diesen typischen Ruf ueberhaupt nicht." NACHGEMESSEN am
   damaligen cowboy.opus: -21 -25 -18 -15 -15 -17 -19 -24 -29 -46 -75
   -92 -92 -57 -14 dB — ein gleichmaessiges Rauschen und bei 1,4 s ein
   Knall. Es war kein Ruf darin. Der Vorlauf half also nichts, weil
   gar nichts zum Vorlaufen da war.
   Jetzt ist der Ton neu (ein echtes „Yee-haw", 3,01 s, sofort laut)
   und beginnt bei 120 ms, also am ANFANG der Animation statt auf dem
   Aufschlag. Gemessen wird deshalb das Neue. */
console.log("\nDER COWBOY-RUF FAENGT SOFORT AN");
pruefe("der Ruf liegt am Anfang der Animation, nicht auf dem Aufschlag",
  /hut: 120,/.test(js));

console.log("\nDIE GLUEHBIRNE");
pruefe("zwei Kacheln statt einer", /\["\\ud83d\\udd0c", "Birne raus", "birneraus"\]/.test(js)
  && /birneraus:\s+\{ zeichen/.test(js));
pruefe("und ein eigener Befehl dazu", /birneraus:\s+\{ wirkung: "birneraus"/.test(lc)
  && /w: "birneraus"/.test(lc));
pruefe("das Gewinde reicht bis an das Glas",
  /<rect x="13" y="17" width="34" height="27"/.test(js));
pruefe("und die Fassung bleibt haengen, solange sie brennt",
  /function lcBirneFassungBleibt\(platz\)/.test(js)
  && /lcBirneFassungBleibt\(platz\);/.test(js)
  && /\.lc-birne-fassung-bleibt \{/.test(css));
pruefe("sie sitzt im Kasten des BILDES, nicht des ganzen Platzes",
  /halt\.className = "lc-zp lc-birne-halt";/.test(js));
/* NUR BEI DER BIRNE nachsehen: das Quietschen bleibt anderswo
   richtig — beim Fahren zum Beispiel ist es die Bremse, und das war
   Xanders eigener Wunsch („wenn er wirklich auf dem Platz landet,
   muss das quietschen schon kommen"). Deshalb wird hier das Stueck
   zwischen lcGluehbirne und der naechsten Funktion geprueft. */
pruefe("kein Auto-Quietschen mehr — jedenfalls nicht an der Birne",
  (() => {
    const a = js.indexOf("function lcGluehbirne(wen)");
    const b = js.indexOf("function lcEntbloessung", a);
    if (a < 0 || b < 0) return false;
    const teil = js.slice(a, b);
    return teil.indexOf("quietschen") === -1
        && /lcTonSpaeter\("birneplopp", 2320, 0\.5\)/.test(teil);
  })());
pruefe("das Schrauben faengt beim Schrauben an, nicht am Ende",
  /gluehbirne: 0,/.test(js));
pruefe("die Dunkelheit haelt an", /const LC_DUNKEL_DAUER = 5600;/.test(js)
  && /\.lc-stromaus-lang \{ animation: lcStromAusLangR72 5\.6s/.test(css));
pruefe("und darin gehen an den besetzten Plaetzen Augen auf",
  /paar\.className = "lc-dunkel-augen";/.test(js)
  && /if \(!el \|\| g\.frei\) return;/.test(js)
  && /\.lc-dunkel-augen \{/.test(css));
/* RUNDE 73 — XANDER: „Die Augen duerfen beim Scrollen nicht
   mitwandern." Gemessen wurde die Stelle vorher EINMAL und in
   Prozent der Effektbuehne abgelegt; die Buehne aendert beim
   Scrollen aber ihre Hoehe, also wanderten dieselben Prozente
   woanders hin. Jetzt setzt ein Bildtakt sie in Pixeln neu — genau
   darauf sieht diese Regel jetzt. */
pruefe("ihre Stelle kommt aus den gemessenen Sitzmitten",
  /const gitter = lcPlatzGitter\(\);/.test(js)
  && /const hoch = lcBildVersatz\(p\.el\);/.test(js));
pruefe("und sie wird in JEDEM Bild neu gesetzt, sonst wandert sie",
  /takt = requestAnimationFrame\(takten\);/.test(js)
  && /paare\.forEach\(\(p\) => \{/.test(js));
pruefe("die Pupille ist rund, kein Katzenschlitz",
  /aspect-ratio: 1;/.test(css) && !/width: 34%; height: 62%;/.test(css));
pruefe("und sie blinzeln hoerbar", ton("blinzeln") && ton("dunkelbrumm")
  && gelistet("blinzeln") && gelistet("dunkelbrumm")
  && /lcTonSpaeter\("blinzeln",/.test(js));

console.log("\nDIE BOMBE");
pruefe("der Countdown tickt ueberhaupt", ton("ticken") && gelistet("ticken")
  && /lcTonSpaeter\("ticken", 0, 0\.62\)/.test(js));
pruefe("das Piepsen ist kurz statt fuenf Sekunden",
  ton("bombehektik") && gelistet("bombehektik")
  && /lcTonSpaeter\("bombehektik", 1530, 0\.6\)/.test(js)
  && !/bombedigital2/.test(js));
pruefe("und der Knall darf der lauteste Punkt sein",
  /bombe:\s+\{ ton: "explosion2", dauer: 2600, laut: 0\.9 \}/.test(js));
pruefe("die Asche liegt unter dem Bild, ueber dem Namen",
  /\.lc-bombe-asche \{[\s\S]{0,240}?bottom: -19%;/.test(css));
pruefe("sie ist auf einer Seite gehaeuft — wie eine Endmoraene",
  /const GIPFEL = 0\.34;/.test(js));
pruefe("und nichts weht mehr auf den Nachbarplatz",
  /\.lc-bombe-asche \{[\s\S]{0,300}?overflow: hidden;/.test(css)
  && /"--weht:" \+ \(4 \+ Math\.random\(\) \* 10\)/.test(js));

console.log("\nDER BUMERANG: SAUSEN, KLOPFEN, SCHMERZ");
pruefe("erst saust er — schon auf dem Hinweg", /bumerang: 250,/.test(js)
  && /bumerang:\s+\{ ton: "swoosh", dauer: 1100, laut: 0\.6 \}/.test(js));
pruefe("dann klopft es hoelzern auf dem TOCK", ton("holzklopf") && gelistet("holzklopf")
  && /lcTonSpaeter\("holzklopf", 860, 0\.78\)/.test(js));
/* RUNDE 73: 920 -> 1060. 60 ms hinter dem Klopfen hoert man als
   EINEN Laut — „das muss ja erst mal weh tun". */
pruefe("und dann tut es weh, nach Mann und Frau getrennt",
  /lcStimmeZu\(platz, "schreimann", "schreifrau", 1060, 0\.7\)/.test(js));

console.log("\nDIE MUENZE DREHT DURCH UND LEGT SICH HOERBAR HIN");
/* Die Falle: in Runde 71 hatte ich „linear" am FALSCHEN Block
   gesetzt — aktiv war lcMuenzeR53, nicht lcMuenzeR18. */
pruefe("die aktive Animation ist linear", /\.lc-gedreht \{ animation: lcMuenzeR72 5\.4s linear both; \}/.test(css));
pruefe("und der tote R18-Block gibt den Ton nicht mehr an",
  css.lastIndexOf(".lc-gedreht { animation: lcMuenzeR72") > css.lastIndexOf("animation: lcMuenzeR53"));
pruefe("die Bremsung steckt in den Werten",
  /rotateY\(855deg\)/.test(css) && /rotateY\(4455deg\)/.test(css));
/* RUNDE 76 — der Aufschlag liegt zeitlich unveraendert bei 85 %; nur
   die Fallhoehe ist kleiner, weil die Muenze nicht mehr auf dem
   Namen landen soll (61 % war genau die Mitte der Namenszeile). */
pruefe("der Aufschlag liegt auf der gemessenen Stelle im Ton",
  /85%   \{ transform: translateY\(44%\)/.test(css));
pruefe("und die Animation dauert so lange wie die Aufnahme",
  /\}, 5400, "muenze"\);/.test(js));

console.log("\nTENNIS: AUFWURF, SAITEN, BODEN");
pruefe("es sind drei eigene Toene",
  ton("tenniswurf") && ton("tennistreffer") && ton("tennisflop")
  && gelistet("tenniswurf") && gelistet("tennistreffer") && gelistet("tennisflop"));
pruefe("der Schlag sitzt auf der gerechneten Stelle, nicht auf 30 %",
  /tennis: 768,/.test(js));
pruefe("und Aufwurf und Boden liegen an ihren eigenen Zeiten",
  /lcTonSpaeter\("tenniswurf", 408, 0\.45\)/.test(js)
  && /lcTonSpaeter\("tennisflop", 1903, 0\.6\)/.test(js));

console.log("\nDER SCHNEEBALL RUTSCHT ZU ENDE");
pruefe("er rutscht bis unter den Bildrand", /translateY\(104%\)/.test(css)
  && /translateY\(105%\)/.test(css));
pruefe("und blendet erst dort aus, nicht unterwegs",
  /90%     \{ opacity: 1; transform: translateX\(var\(--mitte, 0%\)\) translateY\(98%\)/.test(css));
/* Am Bild bei 4000 ms gesehen: der Klecks klatscht seitlich an und
   rutschte SENKRECHT nach unten — genau dorthin, wo der Bildkreis
   wegkrummt, und die runde Blende schnitt ihn an einer harten Kante
   ab. Nasser Schnee rutscht zum tiefsten Punkt. */
pruefe("und er rutscht dabei zur Mitte, nicht an die Kante",
  /schicht\.style\.setProperty\("--mitte", \(-r\.x \* 38 \* 2\.174\)/.test(js)
  && /translateX\(calc\(var\(--mitte, 0%\) \* \.42\)\)/.test(css));
/* RUNDE 76 — die Spur waechst weiter mit, aber nicht mehr auf eine
   feste Hoehe: sie folgt jetzt dem Weg des Kleckses (--spurlang) und
   zeigt in seine Richtung (--spurdreh). XANDER: „Der Schneeball hat
   ne Schleifspur, die nach unten geht, waehrend der Schneeball nach
   rechts runter[rutscht]." Die alten 101 % waren ausserdem
   zweieinhalbmal so lang wie sein Weg. */
pruefe("die Spur waechst mit", /lcSchneeRinneR76/.test(css)
  && /90%     \{ height: var\(--spurlang, 42%\); opacity: \.95; \}/.test(css));
pruefe("und er bekommt die Zeit dafuer", /\}, 4600, "schneeball"\);/.test(js));

console.log("\nDIE SPRUNGFEDER TRIFFT DIE FELDER");
/* RUNDE 74 — XANDER: „Bei der Sprungfeder fehlt mir die Kongruenz zu
   den Plaetzen, dass immer dann das Geraeusch kommt, wenn man auf
   einen Platz trifft."
   Mit `Math.max(2, plaetzeR)` machte die Feder beim Sprung auf den
   NACHBARPLATZ trotzdem zwei Spruenge — der erste setzte mitten
   zwischen zwei Plaetzen auf. Jetzt ist die Zahl der Spruenge gleich
   der Zahl der ueberquerten Plaetze. */
pruefe("die Zahl der Spruenge ist die Zahl der Plaetze",
  /const federSpruenge = Math\.max\(1, plaetzeR\);/.test(js)
  && /const federSchritte = federSpruenge \* 2;/.test(js));
pruefe("und der Ton liegt auf jedem Aufsetzen",
  /for \(let i = 0; i <= federSchritte; i \+= 2\)/.test(js));

console.log("\nLOK UND DAMPFER");
pruefe("die Lok stampft beim Anfahren", ton("lokstampf") && gelistet("lokstampf")
  && /lcTonSpaeter\("lokstampf", 0, 0\.6\)/.test(js));
pruefe("und die Raeder gehen ueber die Schienenstoesse",
  ton("lokschiene") && gelistet("lokschiene")
  && /lcTonSpaeter\("lokschiene", Math\.round\(hin \* 0\.2\), 0\.42\)/.test(js));
/* RUNDE 75 — lauter, weil XANDER den Dampfer „imposanter" wollte:
   0,75 statt 0,55. */
pruefe("der Raddampfer pfeift beim Ablegen",
  ton("dampferpfiff") && gelistet("dampferpfiff")
  && /lcTonSpaeter\("dampferpfiff", 180, 0\.75\)/.test(js));

console.log("\nDIE UMARMUNG: DIE ARME KNICKEN NICHT MEHR NACH UNTEN");
/* XANDER wollte „die erste Version zurueck, die von damals, als die
   Maenner- und Frauenstimmen kamen". NACHGESEHEN: die kamen in
   Runde 59 (2fa8b1e), und dort steht Zeichen fuer Zeichen dieselbe
   Zeichnung wie heute. Zurueckzuholen gab es also nichts — die Form
   war nie anders. Der Knick steckt in ihr: die Oberkante fiel von
   42,5 auf 66,5, also 24 Einheiten ueber die Armlaenge. */
/* RUNDE 73 NACHGEFUEHRT — und das ist meine zweite Korrektur an
   derselben Stelle. In Runde 72 hatte ich nur die NEIGUNG verringert;
   der Arm lief weiter als Bezier-Kurve und knickte in der Mitte
   durch. XANDER: „du sollst da, wo die Arme anfangen, sollen sie in
   eine FUEHRUNG gehen und nicht aus einer Kurve heraus nach unten
   umarmen, sondern wirklich realistisch eine Linienfuehrung haben."
   Jetzt sind Ober- und Unterkante STRECKEN (L-Befehle); rund ist nur
   noch die Schulter und der Uebergang zum Handgelenk. */
pruefe("der Arm ist eine gerade Fuehrung, keine Kurve",
  /" L " \+ x\(38\) \+ " 51\.4"/.test(js)
  && /" L " \+ x\(15\) \+ " 60\.8"/.test(js));
pruefe("und die Dicke bleibt, wie sie war — 21 an der Schulter, 14,5 am Gelenk",
  /x\(hgx\) \+ " 53\.6"/.test(js) && /x\(hgx\) \+ " 68\.1"/.test(js));
pruefe("die Hand sitzt in der Mitte des neuen Handgelenks",
  /x\(hgx\) \+ ' 60\.9\) '/.test(js));

console.log("\nDER PFEIL LANDET, WENN MAN IHN LANDEN SIEHT");
pruefe("die Trefferzeit ist gemessen, nicht aus Prozenten geraten",
  /saugpfeil: 656,/.test(js));
/* RUNDE 73: 545 -> 400, und das Sausen wird bei 260 ms abgeblendet
   (eigener Plan-Eintrag) — sonst zieht seine Rauschfahne ueber den
   Einschlag hinweg. */
pruefe("das Sausen liegt davor und ist zum Einschlag fertig",
  /lcTonSpaeter\("pfeilflug", 400, 0\.55\)/.test(js)
  && /pfeilflug:\s+\{ ton: "pfeilflug", dauer: 260/.test(js));
pruefe("und das PLOPP auch", /animation: lcZpWort 0\.9s ease-out 0\.656s both;/.test(css));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 72 sitzt.\n");
process.exit(fehler ? 1 : 0);
