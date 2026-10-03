#!/usr/bin/env node
/* FASSUNG 852 — XANDER (Funk 286): „dass sich nichts mehr blockiert“.
   Die älteren neuen Szenen (gebaut von scratchpad/bau-szenen.py, Quelle verloren) zeichnen ihre
   Lupen-Teile nur als unsichtbare Fläche; die App fängt solche Flächen nicht (korrekturen.css),
   ihre Trefferfläche lag UNTER dem großen Ding → in der Lupe war z. B. die Bettdecke nicht
   antippbar. Wie im Baukasten (bau.js) bekommt jedes Lupen-Teil die obere Fangfläche („oben“),
   dazu die kleinen Dinge, die die Prüfung als verdeckt meldet.
   node werkzeug/bilderwelt/oben-setzen.js <id> [teil-id …] */
"use strict";
const fs = require("fs"), path = require("path");
const [id, ...extra] = process.argv.slice(2);
const datei = path.join(__dirname, "../../bilderwelt-neu/szenen", id + ".js");
const text = fs.readFileSync(datei, "utf8");
if (/gebaut von werkzeug\/bilderwelt/.test(text.slice(0, 300))) { console.log(id + ": Baukasten-Szene, bitte in der Bau-Datei ändern"); process.exit(1); }
const marke = `window.DMA_SZENE[${JSON.stringify(id)}] = `;
const i = text.indexOf(marke);
if (i < 0) throw new Error("Szene nicht gefunden: " + id);
const w = {}; new Function("window", text)(w);
const sz = w.DMA_SZENE[id];
let n = 0;
for (const t of sz.teile) {
  if (extra.includes(t.id) && !t.oben) { t.oben = true; n++; }
  for (const u of t.unter || []) if (!u.oben) { u.oben = true; n++; }
}
fs.writeFileSync(datei, text.slice(0, i) + marke + JSON.stringify(sz) + ";\n");
console.log(id + ": " + n + " Teile mit oberer Fangfläche");
