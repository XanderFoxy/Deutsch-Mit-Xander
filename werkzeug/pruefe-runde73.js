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
pruefe("die Spur ist dichter und breiter",
  /Math\.round\(weite \/ \(d \* 0\.16\)\)/.test(js)
  && /\(d \* 0\.05\)/.test(js));
pruefe("und an den Plaetzen liegt sie dicker",
  /const dickeBei = \(x, y\) =>/.test(js)
  && /h\.style\.setProperty\("--gross", \(d \* dickeBei\(hx, hy\)\)/.test(js));
pruefe("jeder Platz auf dem Weg wird aufgegraben, nicht nur Start und Ziel",
  /const proj = \(g\.x - start\.x\) \* ex \+ \(g\.y - start\.y\) \* ey;/.test(js));
pruefe("und man hoert ihn die ganze Strecke graben",
  ton("graben") && gelistet("graben")
  && /lcTonSpaeter\("graben", 320 \+ g \* 2400/.test(js));

console.log("\nDIE LIANE SCHWINGT IN EINE RICHTUNG");
pruefe("der Bogen geht ueber die Sitzreihe hinweg",
  /Math\.min\(start\.y, ende\.y\) - d \* 0\.85/.test(js));
/* Die Falle, die uns beim Turm, bei der Muenze und beim Pfeil schon
   erwischt hat: eine cubic-bezier UEBER die ganze Animation dehnt
   die Abstaende ZWISCHEN den Schluesselbildern. Hier wird deshalb
   ausdruecklich geprueft, dass im Lianen-Zweig „linear" steht. */
pruefe("die Pendelbewegung steckt in den Werten, nicht in einer Kurve",
  (() => {
    const a = js.indexOf('art === "liane"');
    const b = js.indexOf('art === "feder"', a);
    const teil = js.slice(a, b);
    return /easing: "linear", fill: "forwards"/.test(teil)
        && !/easing: "ease-in-out"/.test(teil)
        && /const bogen = \(u\) =>/.test(teil);
  })());
pruefe("und die Person steigt am Ziel ab",
  /const last = liane\.querySelector\("\.lc-liane-last"\);/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 73 sitzt.\n");
process.exit(fehler ? 1 : 0);
