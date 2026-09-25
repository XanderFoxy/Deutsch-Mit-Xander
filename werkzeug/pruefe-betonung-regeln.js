#!/usr/bin/env node
/* =========================================================
   PRUEFT DIE BETONUNGSANGABEN GEGEN DREI FESTE REGELN
   ---------------------------------------------------------
   GEWUENSCHT (Xander): „Scanne Betonung seitenweit … Hör auf,
   sinnvolle Wörter zu zerstören … recherchiere … Duden."

   Ohne Browser. Laedt alle Quellen mit Silbenangaben ueber einen
   window-Ersatz und prueft jede Angabe („syl“) auf drei Regeln,
   die der Duden ohne Ausnahme so betont:

   K1  Gleitlaut-i ist nie betont. Betont ist der Vokal DANACH:
       Na-ti-ON, of-fi-zi-ELL, so-zi-AL, re-li-gi-ÖS, Pa-ti-EN-ten
       (falsch: Na-TI-on, of-fi-ZI-ell …).
   K2  Zweisilbige Verbpartikeln tragen den Ton auf der ZWEITEN
       Silbe: zu-RÜCK, zu-SAM-men, vo-RAUS, he-RAUS, hi-NEIN,
       vor-BEI, her-VOR, hin-ZU, ent-GE-gen, ge-gen-Ü-ber,
       ü-ber-EIN (falsch: ZU-rück …). Ausnahmen: Woerter, in denen
       die Buchstabenfolge nur zufaellig vorkommt (Vorüberlegung,
       Vorannahme, Vorankündigung, hinzudeuten = hin-zu-deuten …).
   K3  Verben auf -ieren und ihre Formen (-iert, -ierte, -ierung)
       tragen den Ton auf „ie“ (pro-fi-TIE-ren, sta-bi-li-SIE-rung).
       Ausnahme: ein trennbares Praefix oder ein Erstglied davor
       nimmt den Ton (AUS-pro-bie-ren, EIN-stu-die-ren). Solche
       Woerter werden hier nicht bemaengelt; bemaengelt wird nur ein
       Ton, der im Fremdwortstamm steht (PRO-fi-tie-ren) oder hinter
       dem „ie“ (dra-ma-ti-sie-RUNG).

   Aufruf:  node werkzeug/pruefe-betonung-regeln.js [wurzelordner]
   Rueckgabe 1, sobald ein Verstoss gefunden wird.
   ========================================================= */
const fs = require("fs"), path = require("path"), vm = require("vm");
const WURZEL = path.resolve(process.argv[2] || path.join(__dirname, ".."));

/* ---------- Laden ---------- */
const eintraege = [];   // { datei, wort, syl }
function neuerKontext() {
  const w = {};
  const ctx = { window: w, console, document: undefined, localStorage: undefined };
  w.window = w;
  vm.createContext(ctx);
  return ctx;
}
function lade(datei, anhang) {
  const ctx = neuerKontext();
  const code = fs.readFileSync(path.join(WURZEL, datei), "utf8");
  vm.runInContext(code + "\n;" + (anhang || ""), ctx, { filename: datei });
  return ctx;
}
function nimm(datei, wort, syl) {
  if (typeof syl === "string" && syl.trim()) eintraege.push({ datei, wort: String(wort || ""), syl });
}
/* Sammelt rekursiv jedes Objekt mit einem „syl“. */
function sammle(datei, wert, schluessel) {
  if (!wert || typeof wert !== "object") return;
  if (Array.isArray(wert)) { wert.forEach((x) => sammle(datei, x, schluessel)); return; }
  if (typeof wert.syl === "string") nimm(datei, wert.word || wert.wort || wert.name || schluessel, wert.syl);
  for (const k of Object.keys(wert)) if (k !== "syl") sammle(datei, wert[k], k);
}
function sammleTabelle(datei, tabelle) {
  for (const [k, v] of Object.entries(tabelle || {})) nimm(datei, k, v);
}

// 1) Woerterbuch nach Themen — gepflegter und erzeugter Teil. Die alten
//    Sammeldateien teil-*.js laedt die App nicht mehr; sie bleiben aussen vor.
const vokDir = path.join(WURZEL, "vokabeln");
for (const f of fs.readdirSync(vokDir).filter((f) => f.endsWith(".js") && !/^teil-/.test(f)).sort()) {
  const ctx = lade("vokabeln/" + f);
  sammle("vokabeln/" + f, ctx.window.DMA_VOKABELN);
  sammle("vokabeln/" + f, ctx.window.DMA_VOKABELN_ZUSATZ);
}
// 2) data-exercises.js — NUR die drei Silbentabellen
{
  const ctx = lade("data-exercises.js", "globalThis.__ED = ExerciseData;");
  const ED = ctx.__ED;
  sammleTabelle("data-exercises.js", ED.WORD_SYL);
  sammleTabelle("data-exercises.js", ED.STRESS_PROBLEM_WORDS);
  sammleTabelle("data-exercises.js", ED.FIRST_STEPS_SYLLABLES);
}
// 3) data-vocab.js (Sprachen-Tabelle und alles mit syl)
{
  const ctx = lade("data-vocab.js", "globalThis.__VD = VocabData;");
  const VD = ctx.__VD;
  sammleTabelle("data-vocab.js", VD.LANGUAGE_SYL);
  for (const k of Object.keys(VD)) if (k !== "LANGUAGE_SYL" && k !== "HOBBIES_IT") sammle("data-vocab.js", VD[k]);
}
// 4) data-vocab-extra.js, data-umgangssprache.js
sammle("data-vocab-extra.js", lade("data-vocab-extra.js").window.VOCAB_EXTRA);
sammle("data-umgangssprache.js", lade("data-umgangssprache.js").window.DMA_UMGANGSSPRACHE);
// 5) baukasten.js — die BK_-Tabellen
{
  const code = fs.readFileSync(path.join(WURZEL, "baukasten.js"), "utf8");
  const namen = [...code.matchAll(/^const (BK_[A-Z_]+)\s*=/gm)].map((m) => m[1]);
  const ctx = lade("baukasten.js", "globalThis.__BK = {" + namen.map((n) => `${n}: typeof ${n} !== "undefined" ? ${n} : null`).join(",") + "};");
  sammle("baukasten.js", ctx.__BK);
}
// 6) data-feste.js und data-aussprache.js — nur der deutsche Teil
{
  const F = lade("data-feste.js").window.DMA_FESTE;
  for (const k of Object.keys(F)) sammle("data-feste.js", F[k].de);
  const A = lade("data-aussprache.js").window.DMA_AUSSPRACHE;
  for (const k of Object.keys(A)) if (A[k] && A[k].de) sammle("data-aussprache.js", A[k].de);
}
// 7) KLEINE_WOERTER aus app.js — nur dieses eine Objekt herausschneiden
{
  const code = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const start = code.indexOf("const KLEINE_WOERTER = {");
  if (start < 0) { console.log("FEHL  KLEINE_WOERTER in app.js nicht gefunden"); process.exit(1); }
  let i = code.indexOf("{", start), tiefe = 0, ende = -1;
  for (; i < code.length; i++) {
    const z = code[i];
    if (z === '"' || z === "'") { const q = z; i++; while (code[i] !== q) { if (code[i] === "\\") i++; i++; } continue; }
    if (z === "/" && code[i + 1] === "/") { while (code[i] !== "\n") i++; continue; }
    if (z === "/" && code[i + 1] === "*") { i = code.indexOf("*/", i) + 1; continue; }
    if (z === "{") tiefe++;
    if (z === "}") { tiefe--; if (tiefe === 0) { ende = i; break; } }
  }
  const ctx = neuerKontext();
  vm.runInContext("globalThis.__KW = " + code.slice(code.indexOf("{", start), ende + 1), ctx);
  sammleTabelle("app.js (KLEINE_WOERTER)", ctx.__KW);
}

/* ---------- Hilfen ---------- */
const istGross = (p) => { const q = p.replace(/^\*/, "").replace(/ß/g, ""); return /[A-ZÄÖÜ]/.test(q) && !/[a-zäöü]/.test(q); };
function betont(teile) {           // wie Core.betonteSilbenIndex
  const k = []; teile.forEach((p, i) => { if (istGross(p)) k.push(i); });
  if (!k.length) return -1;
  if (k.length === 1) return k[0];
  const m = k.filter((i) => teile[i].replace(/^\*/, "").length > 1);
  return m.length ? m[0] : k[0];
}
const blank = (w) => String(w).trim().replace(/^(der|die|das|sich)\s+/i, "");

/* Bewusst NICHT geaendert (Duden unsicher oder das Wort selbst ist
   verstuemmelt) — steht so im Bericht der Runde 636. */
const BEWUSST_OFFEN = new Set(["Konventionalstraf", "darüberhinaus", "Freiarbeit", "Fiat"]);

/* ---------- K1 ---------- */
const K1 = /([A-ZÄÖÜ]*[A-ZÄÖÜ]I)-(on|ons|o-nen|ös|ö-se|ell|el-le|el-len|al|a-le|a-len|ät|ent|en-ten|at|a-ten)(?=$|[- ])/;
/* ---------- K2 ---------- */
const PARTIKELN = ["zurück", "zusammen", "voraus", "voran", "vorbei", "heraus", "herein", "herunter", "herauf",
  "hinaus", "hinein", "hinauf", "hinunter", "hinüber", "herüber", "heran", "entgegen", "gegenüber", "vorüber",
  "herbei", "davon", "dazu", "hinzu", "hervor", "überein", "hinweg", "darüber"];
const K2_AUSNAHMEN = new Set(["Vorüberlegung", "Vorannahme", "Vorankündigung", "hinzudeuten", "hinzuweisen",
  "hinzusehen", "hinzugehen", "hinzukommen", "hinzunehmen", "hinzunehmend", "hinzunehmende"]);
/* ---------- K3 ---------- */
const K3_ENDE = /(ieren|iert|ierte|ierten|iertem|ierter|iertes|ierst|ierung|ierungen)$/i;
/* Trennbare Praefixe und Erstglieder, die den Ton vor dem -ieren
   nehmen duerfen (AUS-pro-bie-ren, UM-pro-gram-mie-ren). */
const K3_VORNE = /^(un|des|hoch|meist|viel|nano|ab|an|auf|aus|bei|ein|mit|nach|vor|weg|zu|zurück|zusammen|um|über|unter|durch|wieder|fest|los|her|hin|heraus|hinein|vorbei|voran|voraus|hinzu|dazu|davon|gegen|fort|weiter|nieder|miss|mit|dar|voll|fehl|gleich|gut|schwarz|sicher|selbst|neu|über|um|auto|uni)/i;

/* Kompositum: Steht der Ton in einem Erstglied, hinter dem ein eigenes
   Woerterbuchwort auf -ieren/-ierung folgt (Bundes|regierung,
   Spiegel|poliert, un|trainiert), ist er richtig. */
const LEXIKON = new Set(eintraege.map((e) => blank(e.wort).toLowerCase()));
const grundform = (x) => [x, x.replace(/(ierte[nmrs]?|iert|ierst)$/, "ieren"), x.replace(/ierungen$/, "ierung"),
  x.replace(/ierung(en)?$/, "ieren"), x.replace(/en$/, "")];
function istKompositum(teile, idx, ie) {
  const ganz = teile.join("").toLowerCase();
  // Das Zweitglied beginnt an einer Silbengrenze hinter der betonten
  // Silbe und VOR der ie-Silbe (sonst waere es nur die Endung „-zieren“).
  for (let s = idx + 1; s < ie; s++) {
    const rest = teile.slice(s).join("").toLowerCase();
    if (rest.length >= 6 && grundform(rest).some((x) => LEXIKON.has(x))) return true;
  }
  return false;
}

/* Komposita, deren Zweitglied (noch) nicht als eigenes Wort im
   Woerterbuch steht — der Ton im Erstglied ist richtig. */
const K3_KOMPOSITA = new Set(["Sportkommerzialisierung", "Datenmonetarisierung"]);

const verstoesse = { K1: [], K2: [], K3: [] };
for (const e of eintraege) {
  const w = blank(e.wort);
  if (BEWUSST_OFFEN.has(w)) continue;
  const tokens = e.syl.split(/\s+/);
  const woerter = String(e.wort).trim().split(/\s+/);
  // K1
  for (const t of tokens) {
    const m = t.match(K1);
    if (m && m[1].length >= 2) { verstoesse.K1.push(e); break; }
  }
  // K2 und K3 je Wort
  tokens.forEach((t, ti) => {
    const roh = t.split("-");
    const teile = roh.map((p) => p.replace(/^\*/, ""));
    const ganz = teile.join("").toLowerCase();
    const idx = betont(roh);
    const wortHier = tokens.length === woerter.length ? woerter[ti] : w;
    // K2: Partikel am Wortanfang, erste Silbe betont, Partikel laenger als diese Silbe
    if (!K2_AUSNAHMEN.has(blank(wortHier)) && !K2_AUSNAHMEN.has(w)) {
      for (const p of PARTIKELN) {
        if (ganz.startsWith(p) && ganz.length > p.length + 1) {
          if (idx === 0 && teile[0].length < p.length) verstoesse.K2.push(e);
          break;
        }
      }
    }
    // K3: Ton gehoert auf die (letzte) Silbe mit „ie“
    if (K3_ENDE.test(ganz) && idx >= 0 && !K3_KOMPOSITA.has(blank(wortHier))) {
      let ie = -1;
      teile.forEach((p, i) => { if (/ie/i.test(p)) ie = i; });
      const bindestrich = /-/.test(blank(wortHier));   // West-Alliierte: zwei Woerter
      if (ie >= 0 && idx !== ie && (idx > ie || !(K3_VORNE.test(ganz) || bindestrich || istKompositum(teile, idx, ie)))) verstoesse.K3.push(e);
    }
  });
}

/* ---------- Ausgabe ---------- */
if (process.env.BETONUNG_JSON) fs.writeFileSync(process.env.BETONUNG_JSON, JSON.stringify(eintraege));
console.log(`Geprüft: ${eintraege.length} Silbenangaben aus ${new Set(eintraege.map((e) => e.datei)).size} Quellen.`);
let summe = 0;
for (const [k, liste] of Object.entries(verstoesse)) {
  const einmal = [...new Map(liste.map((e) => [e.datei + "|" + e.wort + "|" + e.syl, e])).values()];
  summe += einmal.length;
  console.log(`${k}: ${einmal.length} Verstoß/Verstöße`);
  einmal.slice(0, 400).forEach((e) => console.log(`  FEHL ${k}  ${e.datei}  ${e.wort}  „${e.syl}“`));
}
if (summe) { console.log(`\n${summe} Abweichungen von den Betonungsregeln K1–K3.`); process.exit(1); }
console.log("\nok — keine Verstöße gegen K1 (Gleitlaut-i), K2 (Verbpartikel), K3 (-ieren).");
