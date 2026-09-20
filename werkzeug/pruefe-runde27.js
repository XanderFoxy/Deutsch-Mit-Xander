#!/usr/bin/env node
/* =========================================================
   RUNDE 27 — DIE TAGESGRENZE UND DER TON
   ---------------------------------------------------------
   GEMELDET, woertlich:
   „Bei mir steht: das Gespraechs-Kontingent ist aufgebraucht,
    ab jetzt gilt der Fokus-Modus … und drunter: dieses Geraet
    laeuft ohne eigenes Relais, ueber Netze hinweg Deutschland
    – Aegypten kann der Ton deshalb ausbleiben. Dieses Konto
    hat heute schon 60-mal Zugangsdaten geholt … kann man
    nicht 100.000-mal Request machen? … Ich moechte in Zukunft
    die Leute immer hoeren."

   ZWEI VERSCHIEDENE SACHEN, die ich vorher in einen Topf
   geworfen hatte:
     · turn_budget_gb  — die Bremse gegen die RECHNUNG.
       Aufgebraucht heisst: kein Relais, Fokus-Modus. Bleibt.
     · tagesgrenze     — ein Zaehler, der NICHTS kostet. Stand
       auf 60 und war damit nach einem Nachmittag Ausprobieren
       erreicht. Sperrt ab jetzt niemanden mehr aus.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
const fn = fs.readFileSync(path.join(WURZEL, "supabase/functions/klassenzimmer/index.ts"), "utf8");
const doku = fs.readFileSync(path.join(WURZEL, "supabase/LIVESTREAM-ANLEITUNG.md"), "utf8");

console.log("\nDIE ZUGANGSDATEN UEBERLEBEN DAS NEULADEN\n");
pruefe("sie liegen im Geraet", /var RELAIS_SCHLUESSEL = "dma_relais_v1"/.test(lc));
pruefe("und werden von dort genommen, bevor abgerufen wird",
  /if \(!neu && !relaisStand\.server\) \{[\s\S]{0,200}relaisAusGeraet\(\)/.test(lc));
pruefe("zehn Minuten vor Ablauf werden sie erneuert",
  /RELAIS_VORLAUF_MS = 10 \* 60 \* 1000/.test(lc)
  && /RELAIS_GILT_MS - RELAIS_VORLAUF_MS/.test(lc));
pruefe("ein frischer Abruf legt sie gleich ab",
  /relaisInsGeraet\(a\.server\);/.test(lc));
pruefe("und /leitung sagt, ob dieser Besuch einen Abruf gekostet hat",
  /hat KEINEN Abruf gekostet/.test(lc) && /ausGeraet: Boolean\(relaisStand\.ausGeraet\)/.test(lc));

console.log("\nDIE TAGESGRENZE SPERRT NIEMANDEN MEHR AUS\n");
pruefe("der Fokus-Modus wird nur noch vom BUDGET erzwungen",
  /if \(relaisStand\.grund === "budget-erschoepft"\) \{/.test(lc)
  && !/grund === "budget-erschoepft" \|\| relaisStand\.grund === "tagesgrenze"/.test(lc));
pruefe("die Tagesgrenze sagt nur noch Bescheid",
  /if \(relaisStand\.grund === "tagesgrenze"\) \{[\s\S]{0,400}kostet nichts/.test(lc));
pruefe("und die Zeile nennt die Stellschraube",
  /turn_tagesgrenze/.test(lc));

console.log("\nDIE GRENZE STEHT NICHT MEHR FEST BEI 60\n");
pruefe("die Voreinstellung ist 1000", /const TAGESGRENZE_STANDARD = 1000;/.test(fn));
pruefe("und sie kommt aus betreiber_geheimnisse",
  /"turn_tagesgrenze"\]\)/.test(fn) && /tagesgrenze: Number\.isFinite/.test(fn));
pruefe("die alte feste Zahl ist weg", !/const TAGESGRENZE = 60;/.test(fn));
pruefe("die Absage sagt, wie viele es schon waren",
  /fehler: "tagesgrenze", grenze: tagesgrenze, heute: bisher/.test(fn));
pruefe("das Monatsbudget steht unveraendert davor",
  /fehler: "budget-erschoepft"/.test(fn) && /const BUDGET_STANDARD_GB = 25;/.test(fn));
pruefe("und die Anleitung erklaert beides",
  /Das kostet nichts/.test(doku) && /supabase functions deploy klassenzimmer/.test(doku));

console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nRunde 27 sitzt.");
process.exit(fehler ? 1 : 0);
