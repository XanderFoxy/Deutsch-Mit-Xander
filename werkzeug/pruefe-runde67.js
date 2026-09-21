#!/usr/bin/env node
/* =========================================================
   RUNDE 67 — DAS TOR ALS STEHENDE WASSERWAND UND
   EFFEKTE FUER ALLE GLEICHZEITIG
   ---------------------------------------------------------
   AUS DER WERKSTATT, woertlich gewuenscht:
   · ‚Tor als stehende Wasserwand mit Partikeln und Plasma‘
   · ‚Effekte fuer ALLE gleichzeitig — umarmen, kuessen,
     treten, Bombe‘
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
/* Ohne Kommentare — sonst springen Regeln auf die Begruendung an
   statt auf die Anweisung. Genau das ist in Runde 66 passiert. */
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const jsK = ohneK(js), lcK = ohneK(lc), cssK = ohneK(css);

console.log("\nDAS TOR IST EINE STEHENDE WASSERWAND");
pruefe("es traegt eine eigene Kennung", /lc-tor-wasserwand/.test(jsK)
  && /\.lc-tor-wasserwand/.test(cssK));
pruefe("der alte Sog ist abgeschaltet, nicht nur ueberdeckt",
  /\.lc-tor-wasserwand \.lc-tor-sog[\s\S]{0,200}?display: none;/.test(cssK));
pruefe("Ringe laufen von der Mitte nach aussen", /lc-tor-welle/.test(jsK)
  && /@keyframes lcTorWelleR67[\s\S]{0,300}?scale\(8\.4\)/.test(cssK));
pruefe("es sind fuenf, damit die Flaeche nie glatt ist",
  /* Die ELEMENTE zaehlen, nicht die Zeichenkette: in
     class="lc-tor-welle lc-tor-welle-2" steht sie zweimal, und beim
     ersten Anlauf kam die Regel deshalb auf neun statt fuenf. */
  (jsK.match(/<i class="lc-tor-welle/g) || []).length === 5
  && /\.lc-tor-welle-5/.test(cssK));
pruefe("sie liegen IN der Flaeche und laufen nicht ueber den Rand",
  /<i class="lc-tor-wasser">[\s\S]{0,700}?lc-tor-welle/.test(jsK)
  && /\.lc-tor-wasser \{[\s\S]{0,420}?overflow: hidden;/.test(cssK));
pruefe("das Wasser ist eine FLAECHE, keine Kugel — kein Glanzpunkt mehr",
  /\.lc-tor-wasser \{[\s\S]{0,420}?linear-gradient\(to bottom/.test(cssK)
  && !/radial-gradient\(circle at 44% 38%/.test(cssK));
pruefe("heller Saum, wo das Wasser am Ring haengt", /lc-tor-saum/.test(jsK)
  && /lcTorSaumR67/.test(cssK));
pruefe("Partikel: Tropfen springen ab", /lc-tor-tropfen/.test(jsK)
  && /lcTorTropfenR67/.test(cssK));
pruefe("und sie sehen auf JEDEM Geraet gleich aus — kein Math.random",
  /for \(let k = 0; k < 14; k\+\+\)/.test(jsK)
  && !/lc-tor-tropfen[\s\S]{0,400}?Math\.random/.test(jsK));
pruefe("Plasma zuckt am Rand — und nur das dreht sich noch",
  /lc-tor-plasma/.test(jsK) && /@keyframes lcTorPlasmaR67 \{ to \{ transform: rotate\(360deg\)/.test(cssK));
pruefe("die Fassung ist ein Ring, kein Kreis", /lc-tor-ring/.test(jsK)
  && /\.lc-tor-ring \{[\s\S]{0,420}?mask: radial-gradient/.test(cssK));

console.log("\nEFFEKTE FUER ALLE GLEICHZEITIG");
pruefe("‚alle‘ ist ein gueltiges Ziel bei den Platz-Effekten",
  /alle\|allen\|alles\|allesamt\|jeden\|jedem\|everyone\|all/.test(lcK));
pruefe("es faehrt ausdruecklich als ‚*‘ mit, nicht als Name",
  /wen: "\*"/.test(lcK));
pruefe("und lcZielPlaetze versteht ‚*‘ ausdruecklich",
  /if \(suche === "\*"\) \{[\s\S]{0,220}?lc-platz-frei/.test(jsK));
pruefe("die Umarmung auch — sie hat ihre eigene Zielsuche",
  (jsK.match(/suche === "\*"/g) || []).length >= 2);
pruefe("und die Namenssuche macht sie nicht wieder zunichte",
  /if \(suche !== "\*"\) \{[\s\S]{0,320}?ziele\.length > 1\) ziele = \[ziele\[0\]\];/.test(jsK));
pruefe("der Einzelfall bleibt einer: bei genau einem Namen wird verengt",
  /ziele\.length > 1\) ziele = \[ziele\[0\]\];/.test(jsK));
pruefe("‚umarmen‘ ist jetzt auch ein Wort — es gab nur /drueck",
  /umarmen: "drueck"/.test(lcK));
pruefe("die Zeile bleibt deutsch: Praeposition gekappt, feste Wendung",
  /function alleSatz\(satz\)/.test(lcK)
  && /ALLE auf einmal/.test(lcK));
pruefe("und ‚aus‘, ‚hoch‘ und ‚ab‘ werden NICHT gekappt — Vorsilben",
  !/\|aus\|/.test(lcK.slice(lcK.indexOf("function alleSatz"),
                            lcK.indexOf("function alleSatz") + 400)));
pruefe("der Hinweistext nennt beides", /oder\s*\\u2014?\s*\/" \+ art \+ " alle/.test(lcK)
  || /" alle"/.test(lcK));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 67 sitzt.\n");
process.exit(fehler ? 1 : 0);
