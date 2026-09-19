#!/usr/bin/env node
/* =========================================================
   PRUEFT: ZEIGEN DIE ZÄHNE DES TYRANNOSAURUS INS MAUL?
   ---------------------------------------------------------
   GEMELDET: „Der hat die falschen Zähne, die Zähne gehen nach
   oben."

   Es war kein Geschmacksurteil, sondern ein Rechenfehler: beide
   Reihen waren an ihrer Wurzel gespiegelt. Der Oberkiefer liess
   die Zähne nach oben aus der Schnauze wachsen, der Unterkiefer
   nach unten aus dem Kiefer. Damit das nicht wiederkommt — auch
   nicht durch einen zweiten Lauf des Richtwerkzeugs, das ja
   spiegelt — wird es hier nachgerechnet.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.join(__dirname, "..");
global.window = {};
eval(fs.readFileSync(path.join(WURZEL, "szenen", "dinosaurier.js"), "utf8"));
const teil = (window.DMA_SZENE.dinosaurier.teile || []).find((t) => t.id === "tyrannosaurus");
if (!teil) { console.error("Kein Tyrannosaurus in der Szene."); process.exit(1); }

const zahlen = (d) => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
const re = /<path d="([^"]+)" fill="#efe6cd"/g;
const zaehne = [];
let m;
while ((m = re.exec(teil.kunst))) zaehne.push(m[1]);

let fehler = 0;
function pruefe(was, gut, zusatz) {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
}

console.log("\nDIE ZÄHNE\n");
pruefe("es sind 17 Zähne", zaehne.length === 17, zaehne.length + " gefunden");

const wurzeln = zaehne.map((d) => { const z = zahlen(d); return (z[1] + z[13]) / 2; });
const sortiert = wurzeln.slice().sort((a, b) => a - b);
let luecke = 0, schnitt = sortiert[0];
for (let k = 1; k < sortiert.length; k++) {
  if (sortiert[k] - sortiert[k - 1] > luecke) { luecke = sortiert[k] - sortiert[k - 1]; schnitt = (sortiert[k] + sortiert[k - 1]) / 2; }
}
let oben = 0, unten = 0, verkehrt = 0;
zaehne.forEach((d, k) => {
  const z = zahlen(d), spitze = z[7], wurzel = wurzeln[k];
  const istOben = wurzel < schnitt;
  if (istOben) oben++; else unten++;
  /* Oberkiefer: die Spitze muss TIEFER liegen als die Wurzel.
     Unterkiefer: die Spitze muss HÖHER liegen. Beides heisst:
     der Zahn zeigt ins Maul. */
  const richtig = istOben ? spitze > wurzel : spitze < wurzel;
  if (!richtig) verkehrt++;
});
pruefe("Oberkiefer und Unterkiefer getrennt erkannt", oben > 0 && unten > 0, oben + " oben, " + unten + " unten");
pruefe("kein Zahn zeigt nach aussen", verkehrt === 0, verkehrt + " verkehrt herum");

/* Und sie muessen ineinandergreifen: die laengsten Oberkieferzähne
   reichen unter die Wurzellinie des Unterkiefers. Ein Raubtiergebiss
   schliesst, es stösst nicht stumpf aufeinander. */
const obenSpitzen = zaehne.map((d, k) => ({ s: zahlen(d)[7], o: wurzeln[k] < schnitt })).filter((x) => x.o).map((x) => x.s);
const untenWurzel = Math.min(...wurzeln.filter((w) => w >= schnitt));
pruefe("die Zähne greifen ineinander", Math.max(...obenSpitzen) > untenWurzel,
  "längster Oberkieferzahn bis " + Math.max(...obenSpitzen).toFixed(1)
  + ", Unterkieferlinie bei " + untenWurzel.toFixed(1));

console.log("\nUND DER KOPF IST EIN TYRANNOSAURUS-KOPF\n");
const auflage = teil.kunst.indexOf('<g id="rexplus">') >= 0;
pruefe("Brauenwulst, Augenschatten, Schläfengrube, Kaumuskel liegen auf", auflage);
pruefe("die Auflage steckt im Schädelausschnitt und kann nicht danebenliegen",
  teil.kunst.indexOf('<g id="rexplus"><g clip-path="url(#cf105)">') >= 0);

console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Das Gebiss schliesst, und der Kopf hat Knochen.") + "\n");
process.exit(fehler ? 1 : 0);
