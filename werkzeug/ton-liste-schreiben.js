const fs = require("fs");
const path = require("path");
const WURZEL = path.dirname(__dirname);
const ZIEL = path.join(WURZEL, "data-aussprache-ton.js");

/* GEWUENSCHT: „Wenn du mit A1 komplett fertig bist, kannst du schon B1
   weitermachen." Es gibt also mehr als einen Ordner. Geschrieben wird
   deshalb eine Tabelle Niveau -> Woerter; die Seite sucht in allen und
   weiss dadurch auch, WO die Datei liegt. */
const STUFEN = ["a1", "a2", "b1", "b2", "c1", "c2"];
const teile = [];
let gesamt = 0, gross = 0;
STUFEN.forEach(function (stufe) {
  const ordner = path.join(WURZEL, "aussprache", stufe);
  if (!fs.existsSync(ordner)) return;
  const namen = fs.readdirSync(ordner).filter((f) => f.endsWith(".mp3"))
    .map((f) => f.slice(0, -4)).sort();
  if (!namen.length) return;
  gesamt += namen.length;
  gross += namen.reduce((s, n) => s + fs.statSync(path.join(ordner, n + ".mp3")).size, 0);
  teile.push("  " + stufe + ": \"" + namen.join("|") + "\"");
  console.log(stufe.toUpperCase() + ": " + namen.length + " Aufnahmen");
});

fs.writeFileSync(ZIEL,
  "/* =========================================================\n"
  + "   WELCHE WOERTER MIT ALEX' STIMME AUFGENOMMEN SIND\n"
  + "   ---------------------------------------------------------\n"
  + "   Geschrieben von werkzeug/ton-liste-schreiben.js — nicht von\n"
  + "   Hand aendern. Der Dateiname folgt aus dem Wort selbst\n"
  + "   (aussprTonStamm in app.js rechnet ihn genauso aus); hier steht\n"
  + "   nur, WAS da ist und in welchem Niveau-Ordner es liegt.\n"
  + "   Stand: " + gesamt + " Aufnahmen, " + (gross / 1048576).toFixed(2) + " MB.\n"
  + "   Fehlt ein Wort, spricht die Maschinenstimme wie bisher.\n"
  + "   ========================================================= */\n"
  + "window.DMA_TON = {\n" + teile.join(",\n") + "\n};\n"
  + "/* Die alte Form bleibt stehen, damit eine im Zwischenspeicher\n"
  + "   liegende aeltere app.js nicht ins Leere greift. */\n"
  + "window.DMA_TON_A1 = window.DMA_TON.a1 || \"\";\n");

console.log("Zusammen " + gesamt + " Aufnahmen, " + (gross / 1048576).toFixed(2) + " MB");
