#!/usr/bin/env node
/* =========================================================
   SPIELT EIN GERAEUSCH LAENGER, ALS ES SOLL?
   ---------------------------------------------------------
   GEMELDET: „Beim Paintball ist der Sound so lange — am
   Anfang wird nur kurz geschossen, und du hast das geloopt.
   Bei manchen Sachen passt dieser Loop einfach nicht, weil
   das im ersten Moment schon zu Ende ist … und bei solchen
   Sachen, wo du den Schuss machst, brauchst du auch nicht
   loopen, dass es dann noch mal schiesst, wenn die Animation
   laengst vorbei ist. Suche nach solchen Sachen und aendere
   das wieder, dass es wieder normal ist."

   Die Unterscheidung, um die es geht, ist einfach:
     · ein ZUSTAND darf in Schleife laufen (Regen, Feuer,
       Sturm, Wellen — das hoert ja nicht auf);
     · ein EREIGNIS darf es nicht (ein Schuss, ein Einschlag,
       ein Klirren, ein Aufgehen).

   Diese Sonde liest den Tonplan aus app.js, misst die echte
   Laenge jeder Tondatei und rechnet aus, wie oft ein
   Geraeusch laufen wuerde. Fuer jedes Ereignis muss dabei
   „einmal" herauskommen.
   ========================================================= */
const fs = require("fs"), path = require("path"), cp = require("child_process");
const WURZEL = path.join(__dirname, "..");
const FF = process.env.FF || "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Was ein EREIGNIS ist — hier steht es, damit man es nachlesen und
   streiten kann, statt es im Code zu suchen. */
const EREIGNISSE = [
  "paintball", "schuss", "glasbruch", "geschenk", "prunk", "jubel",
  "gg", "ggelefant", "gghai", "ggbaer", "boxen", "umarmen", "lecken",
  "handdurch", "tore", "jalousie", "kitt", "fratze", "schloss",
  "sternschnuppe", "rennauto", "dino", "augen", "katze", "ballon",
  "falten", "schwamm", "halloween", "weihnachten",
  /* Die Profilbild-Animationen sind alle Ereignisse: ein Schlag, ein
     Tritt, ein Guss, ein Klingeln. Keines davon wiederholt sich. */
  "wecker", "hammer", "tritt", "eimer", "reichtum", "zucker",
  "heber", "lasso"
];

/* Und: hat jede dieser Animationen ueberhaupt ein Geraeusch, das
   auch WIRKLICH als Datei daliegt? Ein Plan, der auf eine Datei
   zeigt, die es nicht gibt, ist schlimmer als kein Plan — er sieht
   richtig aus und bleibt stumm. */
const BRAUCHT_TON = ["wecker", "hammer", "tritt", "eimer",
                     "regenwolke", "donnerwolke", "reichtum", "zucker"];

const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const ab = quelle.indexOf("const LC_TON_PLAN = {");
const roh = quelle.slice(ab, quelle.indexOf("\n  };", ab));
const plan = [];
const re = /(\w+):\s*\{ ton: "(\w+)", dauer: (\d+)(, schleife: true)?/g;
let t;
while ((t = re.exec(roh))) plan.push({ eff: t[1], ton: t[2], dauer: +t[3], loop: Boolean(t[4]) });

const laenge = (ton) => {
  const datei = path.join(WURZEL, "ton", ton + ".opus");
  if (!fs.existsSync(datei)) return null;
  try {
    const aus = cp.execFileSync(FF, ["-hide_banner", "-i", datei],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    void aus;
    return null;
  } catch (e) {
    const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(String(e.stderr || ""));
    return m ? (+m[2]) * 60 + parseFloat(m[3]) : null;
  }
};

console.log("\nDER TONPLAN — " + plan.length + " Eintraege\n");
pruefe("der Plan liess sich lesen", plan.length > 40, plan.length + " Eintraege");

console.log("\nEREIGNISSE DUERFEN NICHT IN SCHLEIFE LAUFEN\n");
const schlingen = [];
EREIGNISSE.forEach((e) => {
  const z = plan.find((x) => x.eff === e);
  if (!z) return;
  if (z.loop) schlingen.push(e);
});
pruefe("kein Ereignis wiederholt sich", schlingen.length === 0,
  schlingen.length ? schlingen.join(", ") : EREIGNISSE.length + " geprueft");

console.log("\nHAT JEDE PROFILBILD-ANIMATION IHREN TON?\n");
const ohne = [];
BRAUCHT_TON.forEach((e) => {
  const z = plan.find((x) => x.eff === e);
  if (!z) { ohne.push(e + " (steht nicht im Plan)"); return; }
  const datei = path.join(WURZEL, "ton", z.ton + ".opus");
  const safari = path.join(WURZEL, "ton", z.ton + ".m4a");
  if (!fs.existsSync(datei)) ohne.push(e + " \u2192 " + z.ton + ".opus fehlt");
  else if (!fs.existsSync(safari)) ohne.push(e + " \u2192 " + z.ton + ".m4a fehlt (iPhone stumm)");
});
pruefe("jede hat ein Geraeusch, das wirklich daliegt", ohne.length === 0,
  ohne.length ? ohne.join(", ") : BRAUCHT_TON.length + " geprueft");
/* Und steht es auch in der Liste, die die Seite liest? Liegt die
   Datei da, ohne dort zu stehen, sucht die Seite gar nicht erst. */
const listeText = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");
const fehltInListe = BRAUCHT_TON
  .map((e) => (plan.find((x) => x.eff === e) || {}).ton)
  .filter(Boolean)
  .filter((t, i, a) => a.indexOf(t) === i)
  .filter((t) => listeText.indexOf("|" + t + "|") < 0
               && listeText.indexOf("\"" + t + "|") < 0
               && listeText.indexOf("|" + t + "\"") < 0);
pruefe("und steht in data-geraeusche.js", fehltInListe.length === 0,
  fehltInListe.length ? fehltInListe.join(", ") : "alle eingetragen");

console.log("\nUND WIE OFT LAEUFT EINE SCHLEIFE WIRKLICH?\n");
const zuOft = [];
let gemessen = 0;
plan.forEach((z) => {
  if (!z.loop) return;
  const l = laenge(z.ton);
  if (!l) return;
  gemessen++;
  const wdh = z.dauer / 1000 / l;
  /* Mehr als sechs Wiederholungen hoert man als Wiederholung — dann
     ist es kein Rauschen mehr, sondern eine Endlosschleife. */
  if (wdh > 6.2) zuOft.push(z.eff + " (" + wdh.toFixed(1) + "x)");
});
pruefe("keine Schleife wiederholt sich mehr als sechsmal", zuOft.length === 0,
  zuOft.length ? zuOft.join(", ") : gemessen + " Schleifen gemessen");

console.log("\nUND KEIN TON LAEUFT LAENGER ALS SEINE ANIMATION\n");
/* ACHTUNG, ERSTER ENTWURF WAR FALSCH: er hat die DATEILAENGE mit der
   Animation verglichen und fuenf Fehler gemeldet, die keine sind. Der
   Abspieler dreht jeden Ton nach „dauer" ueber eine halbe Sekunde
   leise und haelt ihn an (siehe lcGeraeusch in app.js) — eine Datei
   darf also laenger sein als ihre Animation, sie wird ja abgeschnitten.
   Falsch waere das Umgekehrte: ein „dauer", das LAENGER ist als die
   Animation. Dann spielt der Ton weiter, waehrend nichts mehr zu
   sehen ist, und genau das war die Klage. */
const animationen = {};
const reA = /\},\s*(\d+),\s*"(\w+)"\);/g;
let a2;
while ((a2 = reA.exec(quelle))) animationen[a2[2]] = +a2[1];
const zuLang = [];
Object.keys(animationen).forEach((eff) => {
  const z = plan.find((x) => x.eff === eff);
  if (!z) return;
  if (z.dauer > animationen[eff] + 200) {
    zuLang.push(eff + " (Ton " + (z.dauer / 1000) + " s, Animation "
      + (animationen[eff] / 1000) + " s)");
  }
});
pruefe("kein Ton spielt laenger als seine Animation", zuLang.length === 0,
  zuLang.length ? zuLang.join(", ")
    : Object.keys(animationen).length + " Animationen mit Ton geprueft");

console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Die Toene passen zu ihren Animationen.") + "\n");
process.exit(fehler ? 1 : 0);
