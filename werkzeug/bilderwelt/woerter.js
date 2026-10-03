#!/usr/bin/env node
/* Wortliste einer ALTEN Szene (szenen/<id>.js) — für den Neubau (FASSUNG 852).
   node werkzeug/bilderwelt/woerter.js <id>
   Gibt je Teil (und Lupen-Teil) id, Wort, Silben, Italienisch, Englisch, Lage und Tipp aus.
   Die neue Szene behält jedes dieser Wörter mit derselben id. */
"use strict";
const fs = require("fs"), path = require("path");
const id = process.argv[2];
const w = {}; new Function("window", fs.readFileSync(path.join(__dirname, "../../szenen/" + id + ".js"), "utf8"))(w);
const sz = w.DMA_SZENE[id];
console.log(`${sz.id} — ${sz.titel} ${sz.emoji} (${sz.thema}) ${sz.breite}×${sz.hoehe}`);
const zeile = (t, e) => console.log(e + JSON.stringify({ id: t.id, de: t.de, syl: t.syl, it: t.it, itSyl: t.itSyl, en: t.en, x: t.x, y: t.y, tipp: t.tipp }));
for (const t of sz.teile) { zeile(t, ""); for (const u of t.unter || []) zeile(u, "   ↳ "); }
