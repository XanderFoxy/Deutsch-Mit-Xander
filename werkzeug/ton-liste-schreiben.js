#!/usr/bin/env node
/* SCHREIBT DIE LISTE DER VORHANDENEN AUFNAHMEN.
   ---------------------------------------------------------------
   Die Website muss wissen, WELCHE Woerter schon mit Alex' Stimme
   aufgenommen sind — sonst wuerde sie bei jedem Wort erst eine Datei
   anfragen, die es nicht gibt, und 2000 Fehlschlaege erzeugen.

   Die Liste wird GESCHRIEBEN, nicht gepflegt: sie sieht im Ordner
   nach. Von Hand gepflegte Listen veralten immer (siehe Werkstatt).

   Aufruf:  node werkzeug/ton-liste-schreiben.js
*/
const fs = require("fs");
const path = require("path");
const WURZEL = path.dirname(__dirname);
const ORDNER = path.join(WURZEL, "aussprache", "a1");
const ZIEL = path.join(WURZEL, "data-aussprache-ton.js");

const namen = fs.existsSync(ORDNER)
  ? fs.readdirSync(ORDNER).filter((f) => f.endsWith(".mp3"))
      .map((f) => f.slice(0, -4)).sort()
  : [];

const groesse = namen.reduce(
  (s, n) => s + fs.statSync(path.join(ORDNER, n + ".mp3")).size, 0);

fs.writeFileSync(ZIEL,
  "/* =========================================================\n"
  + "   WELCHE WOERTER MIT ALEX' STIMME AUFGENOMMEN SIND\n"
  + "   ---------------------------------------------------------\n"
  + "   Geschrieben von werkzeug/ton-liste-schreiben.js — nicht von\n"
  + "   Hand aendern. Der Dateiname folgt aus dem Wort selbst\n"
  + "   (aussprTonStamm in app.js rechnet ihn genauso aus), deshalb\n"
  + "   steht hier nur, WAS da ist, und nicht, wo es liegt.\n"
  + "   Stand: " + namen.length + " Aufnahmen, "
  + (groesse / 1048576).toFixed(2) + " MB.\n"
  + "   Fehlt ein Wort, spricht die Maschinenstimme wie bisher.\n"
  + "   ========================================================= */\n"
  + "window.DMA_TON_A1 = \"" + namen.join("|") + "\";\n");

console.log(namen.length + " Aufnahmen eingetragen, "
  + (groesse / 1048576).toFixed(2) + " MB");
