#!/usr/bin/env node
/* =====================================================================
   DIE ÜBERSICHT, DIE ER VERLANGT HAT — AUS DEN SONDEN GEBAUT
   ---------------------------------------------------------------------
   XANDER, mehrfach und zuletzt sehr deutlich:
   „Ich habe immer noch keine Übersicht von dir zu allen Punkten, die
    ich dir im gesamten Verlauf genannt habe: was wir davon schon
    abgearbeitet haben und was davon noch offen ist, zu sämtlichen
    Sachen, die mit dem Livestream in Verbindung sind."
   „Ich möchte keine People-Pleasing-Antwort. Ich möchte eine
    realistische Analyse."

   WARUM DIE ÜBERSICHT AUS DEN SONDEN KOMMT UND NICHT AUS MEINEM KOPF:
   Eine Liste, die ich aufschreibe, sagt nur, woran ich mich erinnere.
   Eine Liste, die aus den Sonden entsteht, sagt, was die Seite HEUTE
   wirklich tut — denn jede Sonde trägt seinen Wunsch als Zitat im Kopf
   und misst genau diesen Wunsch am laufenden Programm. Steht dort
   „grün", ist der Wunsch nachweisbar erfüllt; steht dort „rot", ist er
   es nachweisbar nicht. Das ist der Unterschied zwischen einer
   Behauptung und einem Befund.

   Aufruf:
     bash werkzeug/alle-pruefen.sh > /tmp/stand.txt
     node werkzeug/uebersicht-bauen.js /tmp/stand.txt > KLASSENZIMMER-LISTE.md

   Ohne Standdatei entsteht die Liste trotzdem — dann ohne Urteil.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const WURZEL = path.join(__dirname, "..");

/* --- 1. Der Stand aus alle-pruefen.sh, falls einer mitgegeben wurde --- */
const stand = {};
if (process.argv[2] && fs.existsSync(process.argv[2])) {
  fs.readFileSync(process.argv[2], "utf8").split("\n").forEach((z) => {
    const m = /^(ok|ROT)\s+(pruefe-[\w-]+)/.exec(z.trim());
    if (m) stand[m[2]] = m[1] === "ok" ? "gruen" : "rot";
  });
}

/* --- 2. Jede Sonde: Titel und seine Zitate aus dem Kopf ------------- */
const zitatAus = (kopf) => {
  const raus = [];
  /* Er wird in den Köpfen immer gleich zitiert: ein deutsches
     Anführungszeichen unten, dann sein Satz, dann ein schliessendes
     (mal typografisch, mal gerade). */
  const re = /„([\s\S]{10,600}?)[“"]/g;
  let m;
  while ((m = re.exec(kopf))) {
    const t = m[1].replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
    if (t.length >= 25 && raus.indexOf(t) < 0) raus.push(t);
  }
  return raus;
};

const sonden = fs.readdirSync(path.join(WURZEL, "werkzeug"))
  .filter((f) => /^pruefe-.*\.js$/.test(f)).sort();

const zeilen = [];
let mitZitat = 0, gruen = 0, rot = 0, ohneUrteil = 0;

sonden.forEach((f) => {
  const name = f.replace(/\.js$/, "");
  const s = fs.readFileSync(path.join(WURZEL, "werkzeug", f), "utf8");
  const ende = s.indexOf("*/");
  const kopf = ende > 0 ? s.slice(0, ende) : s.slice(0, 3000);
  /* Die Ueberschrift ist die erste Zeile im Kopf, die wirklich etwas
     sagt: keine Trennlinie, kein Kommentaranfang, kein leerer Rest. */
  const titel = (kopf.split("\n")
    .map((z) => z.replace(/^\s*\/?\*+\s*/, "").trim())
    .find((z) => z.length > 6 && !/^[=\-_*\s]+$/.test(z) && !/^#!/.test(z)) || name)
    .replace(/^SONDE[\s\u2014:-]*/i, "")
    .replace(/^RUNDE\s+\d+[\s\u2014:-]*/i, "")
    .trim() || name;
  const zitate = zitatAus(kopf);
  if (zitate.length) mitZitat++;
  const urteil = stand[name] || "";
  if (urteil === "gruen") gruen++; else if (urteil === "rot") rot++; else ohneUrteil++;
  zeilen.push({ name, titel, zitate, urteil });
});

/* --- 3. Ausgabe ---------------------------------------------------- */
const zeichen = (u) => u === "gruen" ? "✅" : u === "rot" ? "❌" : "·";
const heute = new Date().toISOString().slice(0, 16).replace("T", " ");

console.log("# Was du gesagt hast — und was die Seite heute wirklich tut\n");
console.log("> Stand: " + heute + " · " + sonden.length + " Sonden · "
  + gruen + " grün, " + rot + " rot, " + ohneUrteil + " ohne Urteil\n");
console.log("Diese Liste ist nicht aufgeschrieben, sondern **gemessen**. Jede Zeile");
console.log("ist eine Sonde: im Kopf steht dein Satz, im Programm läuft die Messung");
console.log("dazu. ✅ heisst, die Messung bestätigt ihn heute; ❌ heisst, sie");
console.log("widerlegt ihn; · heisst, diese Sonde lief beim letzten Sammellauf");
console.log("nicht mit.\n");
console.log("Neu messen:\n");
console.log("```");
console.log("bash werkzeug/alle-pruefen.sh > /tmp/stand.txt");
console.log("node werkzeug/uebersicht-bauen.js /tmp/stand.txt > KLASSENZIMMER-LISTE.md");
console.log("```\n");

/* Erst die roten — was offen ist, steht oben. */
const rote = zeilen.filter((z) => z.urteil === "rot");
console.log("## Was JETZT offen ist\n");
if (!rote.length) {
  console.log("Keine Sonde ist rot. Was noch offen ist, steht in der Werkstatt");
  console.log("(`data-werkstatt.js`) — das sind die Dinge, für die es noch keine");
  console.log("Messung gibt, nicht die, die eine Messung widerlegt.\n");
} else {
  rote.forEach((z) => {
    console.log("### ❌ " + z.titel + "  \n`" + z.name + "`\n");
    z.zitate.slice(0, 3).forEach((q) => console.log("> „" + q + "“\n"));
  });
}

console.log("## Alles, Sonde für Sonde\n");
zeilen.forEach((z) => {
  console.log("### " + zeichen(z.urteil) + " " + z.titel + "  \n`" + z.name + "`\n");
  if (!z.zitate.length) {
    console.log("_(kein wörtliches Zitat im Kopf dieser Sonde)_\n");
  } else {
    z.zitate.slice(0, 4).forEach((q) => console.log("> „" + q + "“\n"));
  }
});
