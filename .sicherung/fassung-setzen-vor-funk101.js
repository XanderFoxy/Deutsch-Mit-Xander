#!/usr/bin/env node
/* =========================================================
   DIE FASSUNGSNUMMER STEHT AN EINER STELLE — NICHT AN ZWEI
   ---------------------------------------------------------
   XANDER: „Ich weiss nicht, ob du die Adressen richtig
   aufgesetzt hast. Alles, was du mir in dem Update
   beschreibst, ist nirgendswo sichtbar."

   GEFUNDEN, und es ist keine Kleinigkeit: die Seite haengt
   JEDE Datei an „?v=" + DMA_VERSION — Skripte, Stilblaetter,
   Toene. Das wirkt aber nur, wenn die index.html selbst neu
   geholt wird. Genau das tut ein Browser nicht: GitHub Pages
   schickt seine eigenen Cache-Header mit, und die drei
   <meta http-equiv="Cache-Control">-Zeilen oben in der Datei
   beachtet kein Browser fuer das Dokument selbst (sie gelten
   nur fuer Dinge, die ueber echte HTTP-Kopfzeilen laufen).
   Wer die Seite einmal geladen hat, bekommt also weiter die
   ALTE index.html — mit der alten Fassungsnummer, und damit
   das alte Javascript, das alte Aussehen und die alten Toene.
   Im privaten Fenster ging es, weil das nie einen Cache hat.

   Deshalb gibt es jetzt „fassung.json": eine winzige Datei,
   die die Seite beim Start mit „cache: no-store" holt — das
   umgeht jeden Zwischenspeicher. Steht dort eine andere Zahl
   als die geladene, laedt sich die Seite EINMAL unter einer
   neuen Adresse neu und ist damit auf dem Stand.

   Damit die beiden Zahlen nie auseinanderlaufen, setzt dieses
   Werkzeug sie gemeinsam.

   AUFRUF:  node werkzeug/fassung-setzen.js 421
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.dirname(__dirname);

const zahl = String(process.argv[2] || "").trim();
if (!/^\d+$/.test(zahl)) {
  console.error("Bitte eine Zahl angeben, z. B.:  node werkzeug/fassung-setzen.js 421");
  process.exit(1);
}

const indexPfad = path.join(WURZEL, "index.html");
let html = fs.readFileSync(indexPfad, "utf8");
const muster = /<script>window\.DMA_VERSION = "(\d+)";<\/script>/;
const treffer = html.match(muster);
if (!treffer) {
  console.error("In index.html steht keine Zeile  window.DMA_VERSION = \"…\";  — abgebrochen.");
  process.exit(1);
}
const vorher = treffer[1];
html = html.replace(muster, '<script>window.DMA_VERSION = "' + zahl + '";</script>');
fs.writeFileSync(indexPfad, html);

fs.writeFileSync(path.join(WURZEL, "fassung.json"),
  JSON.stringify({ fassung: zahl, stand: new Date().toISOString() }, null, 2) + "\n");

console.log("Fassung " + vorher + " → " + zahl + " (index.html und fassung.json)");
