#!/usr/bin/env node
/* =========================================================
   RUNDE 69 — DAS WHITEBOARD GEHOERT INS PROFIL
   ---------------------------------------------------------
   GEWUENSCHT: „Whiteboard neu denken, alles ins Profil
   speichern statt lokal."

   „Sichern" lud bisher eine PNG-Datei herunter. Die liegt dann
   auf genau EINEM Geraet — auf dem Telefon ist sie weg, und
   wer den Rechner wechselt, faengt von vorn an.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = ohneK(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"));
const be = ohneK(fs.readFileSync(path.join(WURZEL, "backend.js"), "utf8"));
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");

console.log("\nDIE TAFEL LIEGT AM KONTO");
pruefe("es gibt einen Weg ins Profil", /async function lcTafelInsProfil\(\)/.test(js));
pruefe("und einen Knopf dafuer", /data-tafel="profil"/.test(js)
  && /if \(was === "profil"\) \{ lcTafelInsProfil\(\); return; \}/.test(js));
pruefe("der Knopf steht VOR dem Herunterladen",
  js.indexOf('data-tafel="profil"') < js.indexOf('data-tafel="sichern" title'));
pruefe("das Sichern selbst gibt es weiterhin — als Ausnahme",
  /function lcTafelSichern\(\)/.test(js) && /data-tafel="sichern"/.test(js));

console.log("\nDIE ABLAGE IM BACKEND");
pruefe("sichern, holen und wegwerfen",
  /async function saveWhiteboard\(/.test(be)
  && /async function getMyWhiteboards\(\)/.test(be)
  && /async function deleteMyWhiteboard\(/.test(be));
pruefe("und alle drei sind auch herausgegeben",
  /saveWhiteboard, getMyWhiteboards, deleteMyWhiteboard,/.test(be));
pruefe("gelesen wird nur das Eigene", /\.eq\("owner_id", demo\.user\.id\)/.test(be));
pruefe("und geloescht auch nur das Eigene",
  /\.delete\(\)\s*\n?\s*\.eq\("id", id\)\.eq\("owner_id", demo\.user\.id\)/.test(be));
pruefe("ohne Anmeldung wird nichts geschrieben",
  /if \(!demo\.user\) throw new Error\("Bitte zuerst anmelden\."\);[\s\S]{0,200}?saveWhiteboard|async function saveWhiteboard\([\s\S]{0,160}?Bitte zuerst anmelden/.test(be));
pruefe("es gibt einen Rueckfall ohne Datenbank", /demo\.whiteboards/.test(be));

console.log("\nWAS MAN ABGELEGT HAT, KOMMT MAN AUCH WIEDER HERAN");
pruefe("es gibt eine Mappe", /async function lcTafelMappe\(\)/.test(js)
  && /data-tafel="mappe"/.test(js));
pruefe("zurueckholen und wegwerfen",
  /lc-mappe-holen/.test(js) && /lc-mappe-weg/.test(js));
pruefe("ist sie leer, sagt sie das", /lc-mappe-leer/.test(js));
pruefe("und sie ist auch gestaltet", /\.lc-tafel-mappe \{/.test(css)
  && /\.lc-mappe-blatt img \{/.test(css));
pruefe("Namen und Adressen werden entschaerft",
  (js.match(/escapeHtml\(String\(t\./g) || []).length >= 3);

console.log("\nEHRLICH GEBLIEBEN");
pruefe("zurueckgeholt wird als Hintergrund, nicht als Striche",
  /lcTafelBildSetzen\(bild\.getAttribute\("src"\)\)/.test(js));
pruefe("ein zu grosses Bild wird verkleinert statt abgelehnt",
  /url\.length > 900000/.test(js));
pruefe("das Bildbauen steht einmal da, nicht zweimal",
  /function lcTafelBildBauen\(\)/.test(js)
  /* Mit Wortgrenze: „kg.fillStyle" (die Leinwand zum Verkleinern)
     enthaelt „g.fillStyle" als Teilstueck, und beim ersten Anlauf kam
     die Regel deshalb auf zwei statt eins. */
  && (js.match(/(?:^|[^a-zA-Z])g\.fillStyle = "#ffffff";/gm) || []).length === 1);
pruefe("geht das Ablegen schief, wird wenigstens heruntergeladen",
  /lcTafelSichern\(\);\s*\n\s*\}\s*\n\s*\}/.test(js));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 69 sitzt.\n");
process.exit(fehler ? 1 : 0);
