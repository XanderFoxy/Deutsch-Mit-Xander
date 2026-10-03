#!/usr/bin/env node
/* FASSUNG 852 — trägt die neu gebauten Szenen ein:
   - bilderwelt-neu/data-szenen.js: Maße, Wortzahl (zahl), Lupen-Verweise (lupen) und
     Lupenstellen (stellen) aus der gebauten Datei;
   - index.html: NEUE_SZENEN = genau die Dateien in bilderwelt-neu/szenen.
   node werkzeug/bilderwelt/verzeichnis.js */
"use strict";
const fs = require("fs"), path = require("path");
const W = path.join(__dirname, "../..");
const ordner = path.join(W, "bilderwelt-neu/szenen");
const ids = fs.readdirSync(ordner).filter((n) => n.endsWith(".js")).map((n) => n.slice(0, -3)).sort();
const vz = path.join(W, "bilderwelt-neu/data-szenen.js");
const quelle = fs.readFileSync(vz, "utf8");
const w = {}; new Function("window", quelle)(w);
const liste = w.DMA_SZENEN;
let geaendert = 0;
for (const id of ids) {
  const text = fs.readFileSync(path.join(ordner, id + ".js"), "utf8");
  /* nur Szenen aus dem Baukasten (werkzeug/bilderwelt); die älteren neuen Szenen bleiben, wie sie eingetragen sind */
  if (!/gebaut von werkzeug\/bilderwelt/.test(text.slice(0, 300))) continue;
  const s = {}; new Function("window", text)(s);
  const sz = s.DMA_SZENE[id];
  let e = liste.find((x) => x.id === id);
  if (!sz) { console.log("FEHLT in der Datei: " + id); continue; }
  /* FASSUNG 854 — neue Szenen (Städte, Länder, Lebensräume) bekommen ihren Eintrag aus dem Kopf der Datei,
     direkt hinter die letzte Szene desselben Themas */
  if (!e) {
    e = { id, titel: sz.titel, emoji: sz.emoji, thema: sz.thema };
    let i = -1; liste.forEach((x, j) => { if (x.thema === sz.thema) i = j; });
    liste.splice(i >= 0 ? i + 1 : liste.length, 0, e);
    console.log("neu im Verzeichnis: " + id + " (" + sz.thema + ")"); geaendert++;
  }
  const alle = sz.teile.flatMap((t) => [t, ...(t.unter || [])]);
  const neu = { breite: sz.breite, hoehe: sz.hoehe, zahl: alle.length, lupen: [...new Set(alle.filter((t) => t.lupe).map((t) => t.lupe))],
    stellen: sz.teile.filter((t) => t.zoom || t.lupe).length };
  const gleich = (a, b) => JSON.stringify(Array.isArray(a) ? [...a].sort() : a) === JSON.stringify(Array.isArray(b) ? [...b].sort() : b);
  for (const k of Object.keys(neu)) if (!gleich(e[k], neu[k])) { e[k] = neu[k]; geaendert++; }
}
const kopf = quelle.slice(0, quelle.indexOf("window.DMA_SZENEN"));
fs.writeFileSync(vz, kopf + "window.DMA_SZENEN = " + JSON.stringify(liste, null, 1) + ";\n");
const htmlPfad = path.join(W, "index.html");
const html = fs.readFileSync(htmlPfad, "utf8").replace(/var NEUE_SZENEN = \[[^\]]*\]/, "var NEUE_SZENEN = " + JSON.stringify(ids).replace(/","/g, '", "'));
fs.writeFileSync(htmlPfad, html);
console.log(ids.length + " neue Szenen, " + geaendert + " Werte im Verzeichnis geändert");
