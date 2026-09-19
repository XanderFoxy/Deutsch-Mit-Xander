#!/usr/bin/env node
/* =========================================================
   DIE ZÄHNE DES TYRANNOSAURUS RICHTEN
   ---------------------------------------------------------
   GEMELDET: „Der hat die falschen Zähne, die Zähne gehen nach
   oben."

   Er hat recht, und es ist kein Geschmacksurteil, sondern ein
   Rechenfehler in der Zeichnung. Die 17 Zähne stehen als eigene
   Pfade in der Datei, alle mit derselben Füllung #efe6cd.
   Nachgemessen:

     Oberkiefer (9 Zähne): Wurzel bei y ≈ -54, Spitze bei y ≈ -56
       → die Spitze liegt HÖHER als die Wurzel. Der Zahn wächst
         nach oben aus der Schnauze heraus.
     Unterkiefer (8 Zähne): Wurzel bei y ≈ -47, Spitze bei -44
       → die Spitze liegt TIEFER als die Wurzel. Der Zahn wächst
         nach unten aus dem Kiefer heraus.

   Beide Reihen zeigen also nach aussen statt ins Maul. Die
   Behebung ist deshalb eine Spiegelung an der eigenen Wurzel —
   kein neues Zeichnen, keine fremde Hand. Dabei werden sie
   gleich auch länger: ein Tyrannosaurus-Zahn ist bananengross,
   und die vorderen sind die längsten. Genau daran erkennt das
   Auge, dass da kein Krokodil steht.

   Aufruf:  node werkzeug/zaehne-richten.js [--probe]
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.join(__dirname, "..");
const SZENE = path.join(WURZEL, "szenen", "dinosaurier.js");
const ZAHNFARBE = "#efe6cd";

/* Wie viel länger. Vorn am meisten — dort sitzen beim Tyrannosaurus
   die längsten Zähne, weil dort zugebissen wird. */
/* Einstellbar, damit sich das Maass am Bild pruefen laesst statt
   am Gefuehl: node werkzeug/zaehne-richten.js 1.5 1.25
   Der erste Entwurf hatte 2.15 / 1.55 — da ragten die
   Oberkieferzaehne unter den Unterkiefer hinaus. Am Bild
   nachgesehen und heruntergesetzt. */
const LAENGE_OBEN = Number(process.argv[2]) || 1.5;
const LAENGE_UNTEN = Number(process.argv[3]) || 1.25;

function zahlen(d) {
  return (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
}

/* Einen Zahn spiegeln und strecken. Der Pfad hat immer die Form
   M x y  C x y x y x y  C x y x y x y  Z — also sieben Punkte,
   der erste und der letzte sind die beiden Wurzelecken. */
function richten(d, faktor) {
  const z = zahlen(d);
  if (z.length !== 14) return null;
  const ys = [];
  for (let i = 1; i < 14; i += 2) ys.push(z[i]);
  const wurzel = (ys[0] + ys[6]) / 2;
  const neu = z.slice();
  for (let i = 1; i < 14; i += 2) {
    /* Erst spiegeln, dann vom Wurzelpunkt aus strecken. */
    const gespiegelt = 2 * wurzel - z[i];
    neu[i] = +(wurzel + (gespiegelt - wurzel) * faktor).toFixed(2);
  }
  const p = [];
  for (let i = 0; i < 14; i += 2) p.push([neu[i], neu[i + 1]]);
  return "M" + p[0][0] + " " + p[0][1]
    + " C" + p[1][0] + " " + p[1][1] + " " + p[2][0] + " " + p[2][1] + " " + p[3][0] + " " + p[3][1]
    + " C" + p[4][0] + " " + p[4][1] + " " + p[5][0] + " " + p[5][1] + " " + p[6][0] + " " + p[6][1]
    + " Z";
}

function kunstHolen(txt) {
  const i = txt.indexOf('{"id"');
  const j = txt.lastIndexOf("}");
  return { i, j, d: JSON.parse(txt.slice(i, j + 1)) };
}

const txt = fs.readFileSync(SZENE, "utf8");
const { i, j, d } = kunstHolen(txt);
const teil = d.teile.find((t) => t.id === "tyrannosaurus");
if (!teil) { console.error("Kein Tyrannosaurus in der Szene."); process.exit(1); }

const re = new RegExp('<path d="([^"]+)" fill="' + ZAHNFARBE + '"', "g");
const gefunden = [];
let m;
while ((m = re.exec(teil.kunst))) gefunden.push(m[1]);
if (!gefunden.length) { console.error("Keine Zähne gefunden."); process.exit(1); }

/* Ober- und Unterkiefer trennen: die Oberkieferzähne liegen höher
   (kleineres y). Der Schnitt liegt in der Lücke dazwischen. */
const wurzeln = gefunden.map((dd) => {
  const z = zahlen(dd);
  return (z[1] + z[13]) / 2;
});
const sortiert = wurzeln.slice().sort((a, b) => a - b);
let groessteLuecke = 0, schnitt = sortiert[0];
for (let k = 1; k < sortiert.length; k++) {
  if (sortiert[k] - sortiert[k - 1] > groessteLuecke) {
    groessteLuecke = sortiert[k] - sortiert[k - 1];
    schnitt = (sortiert[k] + sortiert[k - 1]) / 2;
  }
}

/* SCHON GERICHTET? DANN NICHTS TUN.
   Dieses Werkzeug spiegelt — ein zweiter Lauf wuerde die Zaehne
   also wieder zurueckdrehen und den Fehler neu erzeugen. Deshalb
   wird zuerst geprueft, wohin sie ueberhaupt zeigen. Ein
   Werkzeug, das beim zweiten Aufruf kaputtmacht, was es beim
   ersten heil gemacht hat, ist eine Falle. */
const schnittVor = schnitt;
const falsch = gefunden.filter((dd, k) => {
  const z = zahlen(dd);
  const spitze = z[7], wurzel = wurzeln[k];
  const oben = wurzel < schnittVor;
  return oben ? spitze < wurzel : spitze > wurzel;
});
if (!falsch.length) {
  console.log("\nAlle " + gefunden.length + " Zaehne zeigen bereits ins Maul — nichts zu tun.\n");
  process.exit(0);
}

let kunst = teil.kunst, geaendert = 0;
const bericht = [];
gefunden.forEach((dd, k) => {
  const oben = wurzeln[k] < schnitt;
  const neu = richten(dd, oben ? LAENGE_OBEN : LAENGE_UNTEN);
  if (!neu) { bericht.push([k, "übersprungen (unerwartete Form)"]); return; }
  const z = zahlen(dd), n = zahlen(neu);
  const spitzeAlt = z[7], spitzeNeu = n[7];
  bericht.push([k, (oben ? "oben " : "unten") + "  Wurzel " + wurzeln[k].toFixed(1)
    + "  Spitze " + spitzeAlt.toFixed(1) + " → " + spitzeNeu.toFixed(1)
    + "  (" + (spitzeNeu > wurzeln[k] ? "zeigt nach unten" : "zeigt nach oben") + ")"]);
  kunst = kunst.split('<path d="' + dd + '" fill="' + ZAHNFARBE + '"')
               .join('<path d="' + neu + '" fill="' + ZAHNFARBE + '"');
  geaendert++;
});

console.log("\nDIE ZÄHNE, EINZELN NACHGEMESSEN\n");
bericht.forEach((b) => console.log("  Zahn " + String(b[0]).padStart(2) + ": " + b[1]));
console.log("\n  Schnitt zwischen den Kiefern bei y = " + schnitt.toFixed(1)
  + "   (grösste Lücke: " + groessteLuecke.toFixed(1) + ")");
console.log("  " + geaendert + " von " + gefunden.length + " Zähnen gerichtet.\n");

if (process.argv.indexOf("--probe") >= 0) process.exit(0);

teil.kunst = kunst;
const sicher = path.join(WURZEL, "sicherung",
  new Date().toISOString().slice(0, 10) + "-zaehne");
fs.mkdirSync(sicher, { recursive: true });
if (!fs.existsSync(path.join(sicher, "dinosaurier.js"))) fs.copyFileSync(SZENE, path.join(sicher, "dinosaurier.js"));
fs.writeFileSync(SZENE, txt.slice(0, i) + JSON.stringify(d) + txt.slice(j + 1));
console.log("Eingebaut. Gesichert in sicherung/.");
