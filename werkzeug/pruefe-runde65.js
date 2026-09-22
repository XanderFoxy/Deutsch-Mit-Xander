#!/usr/bin/env node
/* =========================================================
   RUNDE 65 — MAULWURF IM KREIS, LASSO AM PLATZ, LOK MIT
   DETAILS, GREIFVOGEL, DREI-METER-TURM, AUFBLASEN
   ---------------------------------------------------------
   GEWUENSCHT, woertlich:
   · „der Maulwurfshuegel ist uebrigens nicht von oben. Er
     soll auf dem Platz in demselben kreisrunden Format wie
     mein Profilbild … dass zum Beispiel auf Platz 1 der
     Maulwurfshuegel wirklich aus dem Kreis rund gegraben
     wird … ohne dass das Loch mitgeht, sondern nur die
     aufgeschuettete Erde einen Streifen zieht."
   · „Das Lasso schlingt sich immer noch nicht um das Opfer an
     seinem Platz, sondern taucht erst auf, wenn derjenige
     neben dir ist … und dann zieht man den anderen Stueck
     fuer Stueck mit kraeftigen Zuegen heran."
   · „Im Uebrigen ist unsere Lokomotive noch nicht detailliert.
     Sie soll so schoen sein wie unsere urspruengliche Lok —
     und ich moechte, dass unsere urspruengliche Lok auch an
     seiner urspruenglichen Adresse zu finden ist, naemlich
     unter /LOK."
   · „Vielleicht schaffst du es noch, einen realistischen
     Vogel zu bauen, so ein Greifvogel, der unser Profilbild
     mitnimmt … mit realistischen Fluegelschlaegen."
   · „Vielleicht kannst du noch einen 3-Meter-Turm machen …
     und dann wirklich mit einem Platschgeraeusch, aber erst
     wenn derjenige ankommt im Wasser auf dem neuen Platz."
   · „dass man ein Profilbild noch ein bisschen aufblasen
     kann … und es dann zerplatzt wie ein Luftballon."
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
const da = (n) => fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
               && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));

console.log("\nDER MAULWURF GRAEBT AUS DEM EIGENEN KREIS");
pruefe("das Loch haengt am PLATZ, nicht an der Reihe",
  /platzEl\.appendChild\(l\)/.test(js) || /\.appendChild\(l\);/.test(js));
pruefe("es ist rund und so gross wie das Bild",
  /\.lc-grabloch\s*\{[^}]*width:\s*100%/.test(css)
  && /\.lc-grabloch\s*\{[^}]*aspect-ratio:\s*1/.test(css)
  && /\.lc-grabloch\s*\{[^}]*border-radius:\s*50%/.test(css));
pruefe("nur die Erdhaufen ziehen die Spur", /lc-erdhaufen/.test(js) && /lcErdhaufenR65/.test(css));
pruefe("am Ziel geht ein zweites Loch auf", /lochBauen\(zu\.el/.test(js));
pruefe("und dort taucht das Bild auf", /lc-maulwurf-auftauch/.test(js) && /lcAuftauchR65/.test(css));

console.log("\nDAS LASSO FESSELT AM PLATZ UND ZIEHT IN DREI ZUEGEN");
pruefe("die Schlinge bekommt dieselben Zugwerte wie der Kreis",
  /schicht\.style\.setProperty\("--zux"/.test(js) && /schicht\.style\.setProperty\("--zuy"/.test(js));
pruefe("lcZuMirZiehen gibt die gemessenen Werte heraus",
  /return \{ dx: dx, dy: dy, laenge: l, weit: weit,/.test(js));
pruefe("die Schlinge wandert mit (--zux in ihren Schluesselbildern)",
  /@keyframes lcSchlingeUmR65[\s\S]{0,2600}?var\(--zux/.test(css));
pruefe("drei Zuege mit Pausen: 46 %, 76 %, 100 %",
  /lcZuMirR65[\s\S]{0,2600}?\* \.46\)[\s\S]{0,1600}?\* \.76\)[\s\S]{0,1200}?var\(--zux, 0px\), var\(--zuy, 0px\)\) scale\(\.94\)/.test(css));
pruefe("das Seil bleibt straff und wird nur kuerzer",
  /@keyframes lcLassoSeilR65/.test(css) && /var\(--zugteil/.test(css));
pruefe("und um wie viel, ist GEMESSEN, nicht geraten",
  /zug\.weit \/ lang/.test(js));
pruefe("ferne und nahe Haelfte des Rings",
  /lc-lasso-fern/.test(js) && /lc-lasso-nah/.test(js)
  && /\.lc-lasso-fern\s*\{[^}]*clip-path/.test(css));
pruefe("der Knoten sitzt auf MEINER Seite",
  /zug\.dx > 0 \? "93%" : "7%"/.test(js));
pruefe("das Seil knarzt, wenn es sich strafft",
  /lcTonSpaeter\("seilstramm", 700/.test(js) && da("seilstramm"));
pruefe("der Lassowurf klingt nicht mehr nach einem Tritt",
  /lasso:\s*\{ ton: "swoosh"/.test(js) && !/lasso:\s*\{ ton: "tritt"/.test(js));

console.log("\nDIE LOK");
pruefe("Puffer, Rauchkammer, Dome, Laterne, Zylinder sind da",
  ["lc-lok-bohle", "lc-lok-puffer", "lc-lok-rauchkammer", "lc-lok-dom",
   "lc-lok-lampe", "lc-lok-linse", "lc-lok-zylinder", "lc-lok-pfeife",
   "lc-lok-band", "lc-lok-dach"].every((k) => js.indexOf(k) >= 0));
pruefe("die Raeder haben Speichen, Nabe und Gegengewicht",
  /lc-lok-speiche/.test(js) && /lc-lok-nabe/.test(js) && /lc-lok-gewicht/.test(js));
pruefe("acht Speichen je Rad", /i < 8; i\+\+/.test(js));
pruefe("die Kuppelstange wandert im Kreis, sie dreht sich nicht",
  /@keyframes lcLokKuppelR65[\s\S]{0,400}?translate\(6px, -6px\)/.test(css));
pruefe("keine CSS-Kreise als Raeder mehr",
  !/\.lc-lok-rad-1 \{ left: 16%; \}/.test(css));
pruefe("das Bild sitzt mitten im Fuehrerhaus",
  /\.lc-lok-fenster \{[\s\S]{0,400}?left: 84%;/.test(css));
pruefe("/lok allein zeigt weiterhin den Film",
  /if \(art === "lok" && !rest\) art = "zug";/.test(lc));
pruefe("und die Hilfe sagt das jetzt auch",
  /\/lok allein zeigt den Film/.test(lc));

console.log("\nDER GREIFVOGEL");
pruefe("er ist eine eigene Reise", /art === "greifvogel"/.test(js)
  && /greifvogel: \{ wirkung: "greifvogel"/.test(lc));
pruefe("er verdeckt /greif nicht — das ist die Kurzform von /adler",
  !/w: "greif",/.test(lc) && /kurz: "greif",  nutzt: "\/adler"/.test(lc));
/* RUNDE 80 — XANDER: „das Bild von seinen Fluegeln sehen aus wie
   Fledermausfluegel." Der Fluegel ist seitdem kein einziger Umriss
   mehr („flgFern"), sondern wird gerechnet: Armfittich plus einzelne
   Handschwingen, und der ferne bekommt denselben Bau mit dem
   Verkuerzungsfaktor 0,78. Geprueft wird deshalb die Regel: es gibt
   beide Fluegel, und der ferne ist verkuerzt. */
pruefe("zwei Fluegel, der ferne verkuerzt",
  /fluegelHtml\(0\.78, "lc-greif-fluegel-fern"\)/.test(js)
  && /fluegelHtml\(1, "lc-greif-fluegel-nah"\)/.test(js));
pruefe("Abschlag kurz, Aufschlag lang — 30 zu 70",
  /@keyframes lcGreifSchlagR65[\s\S]{0,700}?30%\s*\{ transform: rotate\(36deg\)/.test(css));
pruefe("der Koerper steigt beim Abschlag", /lcGreifHebtR65/.test(css)
  && /@keyframes lcGreifHebtR65[\s\S]{0,300}?30%\s*\{ transform: translateY\(-3\.5px\)/.test(css));
pruefe("das Bild haengt in den Faengen", /lc-greif-beute/.test(js)
  && /lc-greif-kralle/.test(js));
pruefe("mit eigenem Geraeusch", /lcTonZu\("greifvogel"\)/.test(js) && da("greifvogel"));

console.log("\nDER DREI-METER-TURM");
pruefe("Leiter, Sprossen, Brett und Gelaender",
  ["lc-turm-holm", "lc-turm-sprosse", "lc-turm-brett", "lc-turm-gelaender"]
    .every((k) => js.indexOf(k) >= 0));
pruefe("das Brett zeigt in die Sprungrichtung", /--blick/.test(js) && /scaleX\(var\(--blick/.test(css));
pruefe("das Wasser liegt im Kreis des Zielbildes",
  /\.lc-becken \{[\s\S]{0,300}?width: var\(--gross/.test(css)
  && /\.lc-becken-wasser \{[\s\S]{0,300}?border-radius: 50%/.test(css));
pruefe("Anlauf, Sprung, eine ganze Drehung", /const anlauf =/.test(js) && /drehT/.test(js));
pruefe("das Platschen kommt beim EINSCHLAG, nicht am Ende",
  /lcTonSpaeter\("platsch", 2730/.test(js));
pruefe("und das Brett federt vorher", /lcTonSpaeter\("sprungbrett", 1000/.test(js)
  && da("sprungbrett"));
/* RUNDE 88 — DIESE REGEL SUCHTE ZWEI ZAHLEN, DIE ES NICHT MEHR GIBT.
   Sie stand auf „scale(.74)" und „scale(1.06)" — beide waren schon vor
   dieser Runde aus dem Sprung verschwunden (nachgesehen in
   werkzeug/backup und im Stand der Fassung 480), und die zweite fand
   sich nur noch beim ZAUBERER wieder. Die Regel war also halb blind
   und halb zufaellig gruen.
   Gemessen wird jetzt der VERLAUF im Sprungblock statt zweier
   Zeichenketten: es muss ein Bild geben, in dem der Springer deutlich
   kleiner ist als sein Platz (untertauchen), danach eines, in dem er
   groesser ist als sein Platz (aufploppen wie ein Gummireifen), und am
   Ende steht er wieder auf Groesse eins. Andere Zahlen sind dann kein
   Fehler mehr — eine andere Bewegung schon. */
const turmBlock = (() => {
  const a = js.indexOf('} else if (art === "turm") {');
  const b = js.indexOf('} else if (art === ', a + 10);
  return a < 0 ? "" : js.slice(a, b < 0 ? a + 20000 : b);
})();
const turmScale = (turmBlock.match(/scale\((\.?\d+(?:\.\d+)?)\)/g) || [])
  .map((x) => Number(x.slice(6, -1)));
const tief = turmScale.findIndex((v) => v < 0.7);
const hoch = turmScale.findIndex((v, i) => i > tief && tief >= 0 && v > 1.02);
pruefe("untertauchen und wieder hoch wie ein Gummireifen",
  tief >= 0 && hoch > tief && turmScale[turmScale.length - 1] === 1,
  "tiefster Punkt " + (tief >= 0 ? turmScale[tief] : "-")
    + ", hoechster danach " + (hoch > 0 ? turmScale[hoch] : "-")
    + ", am Ende " + turmScale[turmScale.length - 1]);
pruefe("die Zeitkurve verbiegt die ausgerechneten Zeiten nicht",
  (js.match(/easing: "linear", fill: "forwards"/g) || []).length >= 2);

console.log("\nAUFBLASEN UND PLATZEN");
pruefe("es gibt den Effekt", /function lcAufblasen\(wen\)/.test(js)
  && /aufblasen:  \{ wirkung: "aufblasen"/.test(lc));
pruefe("fuenf Pumpenhube mit Zurueckfedern",
  /@keyframes lcBlaehtR65[\s\S]{0,900}?scale\(1\.12\)[\s\S]{0,700}?scale\(1\.62\)/.test(css));
pruefe("am Ende zittert das Gummi", /rotate\(1\.4deg\)/.test(css));
pruefe("es platzt bei 71 % von 3,2 s = 2272 ms",
  /70\.9% \{ transform: scale\(1\.72\)/.test(css) && /lcTonSpaeter\("platzen", 2272/.test(js));
pruefe("zwoelf Fetzen, jeder anders weit und anders gedreht",
  /i < 12; i\+\+/.test(js) && /--weit:/.test(js) && /--dreh:/.test(js));
pruefe("die Fetzen sind auf jedem Geraet gleich — kein Math.random",
  /const weit = 120 \+ \(\(i \* 47\) % 90\);/.test(js));
pruefe("Pumpe und Knall liegen als Dateien da", da("aufblasen") && da("platzen"));

console.log("\nDIE BEIDEN NEUEN REISEN STEHEN IM MENUE UND IN DEN TABELLEN");
pruefe("im Anreise-Menue", /"Greifvogel", "greifvogel"/.test(js) && /"3-Meter-Turm", "turm"/.test(js));
pruefe("in LC_EFFEKTE", /greifvogel: \{ zeichen/.test(js) && /turm:     \{ zeichen/.test(js));
pruefe("nur am Platz, nicht ueber den ganzen Chat",
  /greifvogel: 1, turm: 1, aufblasen: 1/.test(js));
pruefe("mit Fahrzeit", /greifvogel: 3000, turm: 3400/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 65 sitzt.\n");
process.exit(fehler ? 1 : 0);
