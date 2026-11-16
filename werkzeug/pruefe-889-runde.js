#!/usr/bin/env node
/* =====================================================================
   SONDE 889 — „RUNDE STARTEN" OHNE DEN GANZEN WORTSCHATZ
   (Ladezeit, Vorrang 2; SPIELSYSTEM.md Abschnitt 889)
   ---------------------------------------------------------------------
   Was 889 verspricht: die erste Frage kommt, ohne auf alle 26
   Wortschatz-Dateien zu warten – und die Runde ist GENAU dieselbe wie
   bisher: dieselben Aufgaben, in derselben Folge, auf demselben Niveau,
   gleich bewertet. Das prüft dieser Teil G, ohne Browser, als
   Gleichlauf-Prüfer gegen die BISHERIGE Logik:

     ALT  = quiz.js aus Fassung 888 (git, REF, Standard 4bd701b3) mit dem
            GANZEN Wortschatz – so lief „Runde starten" bisher (erst warten,
            dann zählen, dann bauen);
     NEU  = quiz.js dieses Baums, OHNE Wortschatz, genau der Weg aus app.js:
            zählen ohne Einstufung (bedarf), dann je nach Antwort von
            Quiz.wortschatzWeg sofort, mit dem Auszug (bau/wortniveau-*.js
            aus DMA_MODUL, Stempel aus DMA_STEMPEL in index.html) oder – wie
            bisher – mit dem ganzen Wortschatz; Kategorien, die ihre
            Aufgaben aus dem Wörterbuch bauen, warten vorher (wie app.js).
   Beide Sandkästen bekommen vor jedem Fall dieselben Zufallszahlen
   (Startwert) und dieselbe Uhr. Verglichen werden Zahl der verfügbaren
   Aufgaben, jede Frage der Runde (Kategorie, Text, Antworten in ihrer
   Folge, richtige, Erklärung, Niveau-Angabe), die Einstufung jeder Frage
   und die Bewertung einer nachgespielten Runde (Antworten und Zeiten aus
   einem eigenen Zufall: richtig, falsch, mehrere, schnell/langsam).

     G0 Vorbedingungen: Daten, Auszug gültig, keine Kategorie außerhalb von
        BANK_AUS_WORTSCHATZ liest beim Bau ihrer Aufgaben VocabData, die
        Aufgabentexte hängen nicht am Zufall, keine wiederverwendete Aufgabe
        mit wortschatzabhängigem Niveau (sonst hinge das bisherige Ergebnis
        vom Zeitpunkt der ersten Einstufung ab – dieser Vergleich wäre dann
        unvollständig)
     G1 NEU mit ganzem Wortschatz = ALT (Code-Änderung allein, alle Fälle)
     G2 Einstufung JEDER Aufgabe aller Kategorien beider Räume: NEU beim
        Rundenbau ohne Wortschatz (mit Auszug) = ALT mit ganzem Wortschatz;
        dazu gezählt, wie viele ohne Auszug falsch wären
     G3 Runden: jede Kategorie beider Räume × Niveau (keins, A1…C2) ×
        Schwierigkeit × Startwerte; Quiz- und Wortschatz-Themen; viele
        gemischte Auswahlen (2–5 Kategorien, gemischt/der Reihe nach)
     G4 Auszug aus einem anderen Wörterbuch (Stempel falsch) oder ohne
        Auszug: wird nicht benutzt, die Runde wartet auf den ganzen
        Wortschatz – und ist wieder gleich
     GP Gegenprobe – absichtlich falsche Varianten MÜSSEN auffallen:
        GP1 ohne jedes Warten und ohne Auszug; GP2 ein Wort im Auszug auf
        falscher Stufe; GP3 BANK_AUS_WORTSCHATZ leer (Wortschatz-Kategorie
        ohne Wörterbuch); GP4 die Fünf-Wörter-Grenze falsch (< 9)

   Aufruf:   node werkzeug/pruefe-889-runde.js        (NUR=G|B, STARTWERTE=3, MISCH=240)
   Teil B (Browser, die echte Seite) folgt unten.
   Gegenprobe des ganzen Teils: WURZEL=<Baum mit 888> → rot (kein wortschatzWeg)
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm");
const { execFileSync } = require("child_process");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const REF = process.env.REF || "4bd701b3";
const NUR = process.env.NUR || "GB";
const STARTWERTE = Math.max(1, Number(process.env.STARTWERTE || 3));
const MISCH = Math.max(0, Number(process.env.MISCH || 240));
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
let fehler = 0;
const T0 = Date.now();
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "") + (process.env.ZEIT ? "  [" + Math.round((Date.now() - T0) / 1000) + " s]" : "")); };

/* ---------- Sandkasten wie die Seite (window = globalThis; Skript-Tags aus dem Baum) ---------- */
function zufall(start) {
  let s = (start >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const SKRIPTE = ["core.js", "data-vocab.js", "data-uebungen.js", "data-exercises.js", "data-italienisch.js", "quiz.js"];
function kasten(o) {
  o = o || {};
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, setTimeout, clearTimeout, setImmediate, Promise });
  ctx.__lauf = (f) => vm.runInContext(fs.readFileSync(path.join(WURZEL, f), "utf8"), ctx, { filename: f, timeout: 120000 });
  vm.runInContext(`var window = globalThis;
    var document = { hidden: false, addEventListener() {}, createElement() { return {}; },
      head: { appendChild(s) { const f = String(s.src).split("?")[0];
        setImmediate(() => { try { __lauf(f); } catch (e) { s.onerror && s.onerror(e); return; } s.onload && s.onload(); }); } } };
    window.addEventListener = function () {};`, ctx);
  SKRIPTE.forEach((f) => {
    if (f === "quiz.js" && o.quizCode) vm.runInContext(o.quizCode, ctx, { filename: "quiz.js (" + (o.name || "andere") + ")" });
    else ctx.__lauf(f);
  });
  vm.runInContext("globalThis.Core = Core; globalThis.VocabData = VocabData; globalThis.ExerciseData = ExerciseData; globalThis.Quiz = Quiz;", ctx);
  ctx.__M = vm.runInContext("Math", ctx);
  ctx.__D = vm.runInContext("Date", ctx);
  ctx.__uhr = { t: 1.7e12 };
  ctx.__D.now = () => ctx.__uhr.t;
  if (o.stempel) ctx.DMA_STEMPEL = o.stempel;
  return ctx;
}
const lies = (f) => { try { return fs.readFileSync(path.join(WURZEL, f), "utf8"); } catch (e) { return null; } };
const html = lies("index.html") || "";
let DMA_MODUL = null, DMA_STEMPEL = null;
try { DMA_MODUL = JSON.parse(/window\.DMA_MODUL = (\{[^\n]*?\});/.exec(html)[1]); } catch (e) {}
try { DMA_STEMPEL = JSON.parse(/window\.DMA_STEMPEL = (\{[^\n]*?\});<\/script>/.exec(html)[1]); } catch (e) {}

/* ---------- eine Runde ---------- */
function setze(ctx, start) { ctx.__M.random = zufall(start); ctx.__uhr.t = 1.7e12; }
/* Bewertung nachspielen: Antworten und Zeiten aus einem EIGENEN Zufall (gleich für beide), dann alles als Text */
function auswerten(ctx, vorrat, fall, weg) {
  const Q = ctx.Quiz, st = Q.getState();
  const fragen = JSON.parse(JSON.stringify(st.questions));
  const r = zufall((fall.start * 2654435761) ^ 0x5bd1e995);
  for (let i = 0; i < st.questions.length; i++) {
    Q.markShown();
    const q = Q.currentQuestion(), n = (q.options || []).length, w = r();
    let wahl;
    if (w < 0.45) wahl = q.correct.slice();
    else if (w < 0.75) wahl = [(q.correct[0] + 1) % Math.max(1, n)];
    else if (w < 0.9) wahl = q.correct.concat([(q.correct[0] + 1) % Math.max(1, n)]);
    else wahl = [];
    ctx.__uhr.t += r() < 0.5 ? 1500 : 6500;
    Q.submitAnswer(wahl);
    Q.advance();
  }
  const res = st.questions.length ? Q.computeResults() : null;
  if (res) delete res.playedAt;
  return { text: JSON.stringify({ vorrat, kat: st.categoryIds, level: st.level, diff: st.difficulty, fragen, antworten: st.answers, res }), weg, n: fragen.length };
}
function rundeAlt(ctx, fall) {
  setze(ctx, fall.start);
  const Q = ctx.Quiz;
  const vorrat = Q.poolSizeFor(fall.ids, fall.themen, fall.level);
  Q.startSession(fall.ids, fall.diff, null, fall.folge, fall.themen, fall.level);
  return auswerten(ctx, vorrat, fall, "alt");
}
/* der Weg aus app.js („Runde starten"); var: GP1 = ohne Warten/ohne Auszug */
function rundeNeu(ctx, ctxVoll, auszug, fall, variante) {
  const Q = ctx.Quiz;
  if (Q.bankBrauchtWortschatz(fall.ids) && variante !== "GP3") {
    /* wie app.js: erst der ganze Wortschatz (hier: der Sandkasten mit Wortschatz), dann wie bisher */
    setze(ctxVoll, fall.start);
    const vorrat = ctxVoll.Quiz.poolSizeFor(fall.ids, fall.themen, fall.level);
    ctxVoll.Quiz.startSession(fall.ids, fall.diff, null, fall.folge, fall.themen, fall.level, { auszug: false });
    return auswerten(ctxVoll, vorrat, fall, "bank");
  }
  if (ctx.DMA_DATEN) delete ctx.DMA_DATEN.WORTNIVEAU;   /* jede Runde fängt ohne Auszug an (wie eine frische Seite) */
  setze(ctx, fall.start);
  const bedarf = { ohneNiveau: true };
  const n = Q.poolSizeFor(fall.ids, fall.themen, fall.level, bedarf);
  let weg = Q.wortschatzWeg(bedarf);
  if (variante === "GP1") weg = "keiner";
  if (weg === "fehlt" && auszug) { ctx.DMA_DATEN.WORTNIVEAU = auszug; weg = Q.wortschatzWeg(bedarf); }
  if (weg !== "keiner" && weg !== "auszug") {
    /* der ganze Wortschatz: dieselben Zufallszahlen bis hierher; im Sandkasten mit Wortschatz weiter (das Zählen ohne
       Einstufung hängt nicht am Wortschatz – G0 prüft, dass keine solche Bank ihn liest) */
    setze(ctxVoll, fall.start);
    const b2 = { ohneNiveau: true };
    const n2 = ctxVoll.Quiz.poolSizeFor(fall.ids, fall.themen, fall.level, b2);
    ctxVoll.Quiz.startSession(fall.ids, fall.diff, null, fall.folge, fall.themen, fall.level, { auszug: true });
    return auswerten(ctxVoll, n2 === n ? n2 : "abweichend " + n + "/" + n2, fall, "voll");
  }
  Q.startSession(fall.ids, fall.diff, null, fall.folge, fall.themen, fall.level, { auszug: variante !== "GP1" });
  return auswerten(ctx, n, fall, weg);
}

/* ---------- Fälle ---------- */
function faelle(E, raum, auchMisch) {
  E.setLernraum(raum);
  const kats = E.activeCategories().map((c) => c.id);
  const L = [null, ...LEVELS];
  const D = ["leicht", "mittel", "schwer"];
  const f = [];
  let k = 0;
  /* „Wortschatz" mit „Alle Themen" und ganzem Wörterbuch braucht für EIN getBank() rund 3 min (gemessen in Node: die
     Ablenker werden je Wort aus dem ganzen Bestand gefiltert, 41 063 Wörter – quadratisch; FASSUNG 889, Fund, siehe
     Logbuch). Hier darum nur mit Thema; die Wörterbuch-Kategorien gehen ohnehin den alten Weg (erst der Wortschatz). */
  const wsThemen = raum === "de" ? E.getWortschatzThemen() : [];
  let wsI = 0;
  const wsThema = () => wsThemen.length ? wsThemen[(wsI++ * 7) % wsThemen.length] : "";
  kats.forEach((id) => L.forEach((level) => D.forEach((diff) => {
    if (id === "wortschatz" && (diff !== "leicht")) return;
    for (let s = 0; s < (id === "wortschatz" ? 1 : STARTWERTE); s++) f.push({ raum, ids: [id], level, diff, folge: "mix", themen: { quiz: "", wortschatz: id === "wortschatz" ? wsThema() : "" }, start: 1000 + (k++) * 7 + s });
  })));
  if (raum === "de") {
    E.getQuizTopics().forEach((t) => ["A2", "B1", "C1"].forEach((level) => f.push({ raum, ids: ["quiz"], level, diff: "mittel", folge: "mix", themen: { quiz: t, wortschatz: "" }, start: 5000 + (k++) })));
  }
  if (auchMisch) {
    const r = zufall(raum === "de" ? 4242 : 2424);
    const anzahl = raum === "de" ? MISCH : Math.round(MISCH / 4);
    for (let i = 0; i < anzahl; i++) {
      const m = 2 + Math.floor(r() * 4), ids = [];
      while (ids.length < m) { const id = kats[Math.floor(r() * kats.length)]; if (!ids.includes(id)) ids.push(id); }
      f.push({ raum, ids, level: L[Math.floor(r() * L.length)], diff: D[Math.floor(r() * D.length)], folge: r() < 0.5 ? "mix" : "sequential",
        themen: { quiz: r() < 0.3 && raum === "de" ? E.getQuizTopics()[0] : "", wortschatz: ids.includes("wortschatz") ? wsThema() : "" }, start: 9000 + i });
    }
  }
  return f;
}

async function teilG() {
  console.log("\nG  GLEICHLAUF: neue „Runde starten“ (ohne Wortschatz) gegen die bisherige Logik (888, mit Wortschatz)   REF " + REF + "\n");
  let altCode = null;
  try { altCode = execFileSync("git", ["-C", WURZEL, "show", REF + ":quiz.js"], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "ignore"] }); } catch (e) {}
  if (!altCode) altCode = (() => { try { return execFileSync("git", ["-C", HIER, "show", REF + ":quiz.js"], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "ignore"] }); } catch (e) { return null; } })();
  sage(Boolean(altCode) && !/wortschatzWeg/.test(altCode), "G0 bisherige quiz.js aus " + REF + " lesbar (ohne 889-Weg)");
  const neuCode = lies("quiz.js") || "";
  sage(/wortschatzWeg/.test(neuCode) && /bankBrauchtWortschatz/.test(neuCode), "G0 quiz.js dieses Baums hat den 889-Weg (wortschatzWeg, bankBrauchtWortschatz)");
  if (!altCode || !/wortschatzWeg/.test(neuCode)) return;
  const wnPfad = DMA_MODUL && DMA_MODUL.wortniveau;
  sage(Boolean(wnPfad && /^bau\/wortniveau-[A-Za-z0-9_-]{8}\.js$/.test(wnPfad) && lies(wnPfad)), "G0 DMA_MODUL.wortniveau in index.html, Datei liegt da", String(wnPfad));
  sage(Boolean(DMA_STEMPEL), "G0 DMA_STEMPEL in index.html lesbar");

  const t0 = Date.now();
  const alt = kasten({ quizCode: altCode, name: REF });
  const neu = kasten({ stempel: DMA_STEMPEL });
  const neuVoll = kasten({ stempel: DMA_STEMPEL });
  await Promise.all([alt.VocabData.ladeWoerter(), neuVoll.VocabData.ladeWoerter()]);
  sage(alt.VocabData.alleThemenDa() && neuVoll.VocabData.alleThemenDa() && !neu.VocabData.ladenLaeuft(), "G0 ALT und NEU-voll mit ganzem Wortschatz (" + alt.VocabData.WORDS.length + " Einträge), NEU ohne");
  /* der Auszug, wie ihn die Seite lädt */
  let auszug = null;
  try { const z = vm.createContext({}); vm.runInContext("var window = globalThis;", z); vm.runInContext(lies(wnPfad), z); auszug = JSON.parse(JSON.stringify(z.DMA_DATEN.WORTNIVEAU)); } catch (e) {}
  sage(Boolean(auszug), "G0 Auszug ausführbar (DMA_DATEN.WORTNIVEAU)", auszug ? auszug.stufen.map((s) => s ? s.split(" ").length : 0).join("/") + " + ohne " + auszug.ohne.split(" ").length : "");
  const wnStempelOk = auszug && Object.keys(auszug.quelle).every((k) => DMA_STEMPEL && DMA_STEMPEL[k] === auszug.quelle[k]) && Object.keys(auszug.quelle).length === neu.VocabData.themenListe().length;
  sage(Boolean(wnStempelOk), "G0 Auszug aus genau den Wortschatz-Dateien der Seite (jeder Stempel = DMA_STEMPEL, " + (auszug ? Object.keys(auszug.quelle).length : 0) + " Dateien)");
  neu.DMA_DATEN.WORTNIVEAU = auszug;   /* nur zum Prüfen jetzt; jede Runde fängt ohne an */
  /* die Wortschatz-Leser und Zufalls-Texte (dasselbe Werkzeug wie der Bau) */
  let WB = null; try { WB = require(path.join(WURZEL, "werkzeug", "wortniveau-bauen.js")); } catch (e) {}
  if (WB) {
    const probe = kasten({ stempel: DMA_STEMPEL });
    const { banken, fehler: f } = WB.alleBanken(probe);
    sage(!f.length, "G0 keine Kategorie außer Wortschatz/Meine Wörter liest beim Bau ihrer Aufgaben VocabData; Aufgabentexte hängen nicht am Zufall", f.slice(0, 2).join(" · ") || banken.length + " Banken (beide Räume, Quiz-Themen)");
    /* wiederverwendete Aufgaben (zweimal dasselbe Objekt) mit wortschatzabhängigem Niveau? */
    let geteilt = 0, geteiltAbh = 0;
    for (const raum of ["de", "it"]) {
      probe.ExerciseData.setLernraum(raum);
      probe.ExerciseData.activeCategories().forEach((c) => {
        if (probe.Quiz.bankBrauchtWortschatz([c.id])) return;
        const a = new Set(c.getBank()), b = c.getBank().filter((q) => a.has(q));
        geteilt += b.length;
        geteiltAbh += b.filter((q) => !(q.level && LEVELS.includes(q.level)) && (String(q.prompt || "").toLowerCase().match(/[a-zäöüß]{3,}/g) || []).length >= 5).length;
      });
    }
    probe.ExerciseData.setLernraum("de");
    sage(geteiltAbh === 0, "G0 keine wiederverwendete Aufgabe mit wortschatzabhängigem Niveau", geteilt + " wiederverwendete Aufgaben, davon abhängig " + geteiltAbh);
  } else sage(false, "G0 werkzeug/wortniveau-bauen.js fehlt");

  /* G2 — Einstufung jeder Aufgabe */
  {
    const ohneAuszug = kasten({ stempel: DMA_STEMPEL });
    let alle = 0, abh = 0, abw = 0, ohneFalsch = 0, beispiel = "";
    for (const raum of ["de", "it"]) {
      for (const k of [alt, neu, ohneAuszug]) k.ExerciseData.setLernraum(raum);
      const cats = alt.ExerciseData.activeCategories();
      for (const c of cats) {
        if (neu.Quiz.bankBrauchtWortschatz([c.id])) continue;
        for (const s of [17, 3301]) {
          setze(alt, s); setze(neu, s); setze(ohneAuszug, s);
          const ba = c.getBank(), bn = neu.ExerciseData.activeGetCategory(c.id).getBank(), bo = ohneAuszug.ExerciseData.activeGetCategory(c.id).getBank();
          if (ba.length !== bn.length) { abw++; beispiel = beispiel || c.id + ": Länge " + ba.length + "/" + bn.length; continue; }
          ba.forEach((q, i) => {
            alle++;
            if (!(q.level && LEVELS.includes(q.level))) abh++;
            const la = alt.Quiz.questionLevel(q, c.id), ln = neu.Quiz.niveauBeimRundenbau(bn[i], c.id), lo = ohneAuszug.Quiz.questionLevel(bo[i], c.id);
            if (q.prompt !== bn[i].prompt || la !== ln) { abw++; if (!beispiel) beispiel = raum + "/" + c.id + " „" + String(q.prompt).slice(0, 50) + "“ " + la + "≠" + ln; }
            if (la !== lo) ohneFalsch++;
          });
        }
      }
    }
    for (const k of [alt, neu, ohneAuszug]) k.ExerciseData.setLernraum("de");
    sage(abw === 0 && alle > 40000, "G2 Einstufung jeder Aufgabe (beide Räume, 2 Startwerte): beim Rundenbau ohne Wortschatz = bisher mit Wortschatz",
      alle + " Aufgaben, davon " + abh + " ohne eigenes Niveau; abweichend " + abw + (beispiel ? " – " + beispiel : "") + "; ohne Auszug wären " + ohneFalsch + " falsch eingestuft");
    sage(ohneFalsch > 0, "G2 der Auszug ist nötig (ohne ihn wäre die Einstufung anders – sonst prüfte G2 nichts)", ohneFalsch + " Aufgaben");
  }

  /* G1 + G3 — Runden */
  const stats = { keiner: 0, auszug: 0, voll: 0, bank: 0 };
  async function vergleiche(liste, titel, variante, nurZaehlen) {
    let abw = 0, beispiel = "", leer = 0, gesamt = 0;
    for (const fall of liste) {
      for (const k of [alt, neu, neuVoll]) k.ExerciseData.setLernraum(fall.raum);
      const a = rundeAlt(alt, fall);
      const b = variante === "G1" ? (() => { setze(neuVoll, fall.start); const v = neuVoll.Quiz.poolSizeFor(fall.ids, fall.themen, fall.level); neuVoll.Quiz.startSession(fall.ids, fall.diff, null, fall.folge, fall.themen, fall.level); return auswerten(neuVoll, v, fall, "g1"); })()
        : rundeNeu(neu, neuVoll, auszug, fall, variante);
      gesamt++;
      if (process.env.ZEIT && gesamt % 100 === 0) console.log("    … " + titel + " " + gesamt + "/" + liste.length + " [" + Math.round((Date.now() - T0) / 1000) + " s] " + fall.raum + "/" + fall.ids.join("+"));
      if (!nurZaehlen && stats[b.weg] !== undefined) stats[b.weg]++;
      if (!a.n) leer++;
      if (a.text !== b.text) { abw++; if (!beispiel) beispiel = fall.raum + "/" + fall.ids.join("+") + " " + fall.level + " " + fall.diff + " " + fall.folge + " (Start " + fall.start + ", Weg " + b.weg + ")"; }
    }
    for (const k of [alt, neu, neuVoll]) k.ExerciseData.setLernraum("de");
    return { abw, beispiel, leer, gesamt };
  }
  const deF = faelle(alt.ExerciseData, "de", true), itF = faelle(alt.ExerciseData, "it", true);
  alt.ExerciseData.setLernraum("de");
  const alleF = deF.concat(itF);
  {
    const r = await vergleiche(alleF, "G1", "G1", true);
    sage(r.abw === 0, "G1 NEU mit ganzem Wortschatz und dem bisherigen Aufruf = ALT (" + r.gesamt + " Runden)", r.abw ? r.abw + " abweichend, z. B. " + r.beispiel : "");
  }
  {
    const r = await vergleiche(alleF, "G3", "", false);
    sage(r.abw === 0 && r.gesamt === alleF.length && r.gesamt > 1500, "G3 Runden (je Kategorie beider Räume × 7 Niveaus × 3 Schwierigkeiten × " + STARTWERTE + " Startwerte, Quiz-/Wortschatz-Themen, " + (MISCH + Math.round(MISCH / 4)) + " gemischte Auswahlen): NEU = ALT",
      r.gesamt + " Runden (" + r.leer + " ohne Aufgaben, z. B. Meine Wörter ohne Konto), abweichend " + r.abw + (r.beispiel ? " – " + r.beispiel : ""));
    sage(stats.keiner > 0 && stats.auszug > 0 && stats.voll === 0, "G3 Wege: sofort " + stats.keiner + ", mit Auszug " + stats.auszug + ", Kategorie baut aus dem Wörterbuch " + stats.bank + ", ganzer Wortschatz nötig " + stats.voll,
      "erwartet: kein Fall braucht den ganzen Wortschatz, außer den Wörterbuch-Kategorien");
  }

  /* G4 — Auszug ungültig oder fehlt: nicht benutzt, Weg „voll“, Runde gleich */
  {
    const falsch = JSON.parse(JSON.stringify(auszug));
    const erste = Object.keys(falsch.quelle)[0];
    falsch.quelle[erste] = "0000000000";
    const proben = deF.filter((f) => ["plural", "quiz", "ss-eszett", "lueckentext"].includes(f.ids[0]) && f.ids.length === 1 && f.level).slice(0, 40);
    let wege = new Set(), abw = 0;
    for (const fall of proben) {
      const a = rundeAlt(alt, fall);
      const b = rundeNeu(neu, neuVoll, falsch, fall, "");
      wege.add(b.weg);
      if (a.text !== b.text) abw++;
    }
    sage(wege.size === 1 && wege.has("voll") && abw === 0, "G4 Auszug mit falschem Stempel (" + erste + "): nicht benutzt, Weg „voll“ (ganzer Wortschatz), Runden gleich", proben.length + " Runden, Wege " + [...wege].join(",") + ", abweichend " + abw);
    wege = new Set(); abw = 0;
    for (const fall of proben.slice(0, 12)) { const a = rundeAlt(alt, fall); const b = rundeNeu(neu, neuVoll, null, fall, ""); wege.add(b.weg); if (a.text !== b.text) abw++; }
    sage(wege.size === 1 && wege.has("voll") && abw === 0, "G4 ohne Auszug (404): Weg „voll“, Runden gleich", "Wege " + [...wege].join(",") + ", abweichend " + abw);
  }

  /* GP — Gegenprobe: absichtlich falsche Varianten müssen auffallen */
  console.log("\nGP GEGENPROBE (jede Zeile ist ok, wenn der Fehler AUFFÄLLT)\n");
  const abhF = deF.filter((f) => f.ids.length === 1 && ["plural", "quiz", "ss-eszett", "lueckentext", "wenn-ob", "redewendungen"].includes(f.ids[0]) && f.level);
  {
    const r = await vergleiche(abhF, "GP1", "GP1", true);
    sage(r.abw > 0, "GP1 ohne Warten und ohne Auszug (die Runde nähme die Einstufung ohne Wörterbuch): fällt auf", r.abw + " von " + r.gesamt + " Runden anders, z. B. " + r.beispiel);
  }
  {
    /* ein Wort, das in vielen abhängigen Aufgaben steht, auf die falsche Stufe */
    const zaehl = new Map();
    for (const raum of ["de"]) {
      neuVoll.ExerciseData.setLernraum(raum);
      neuVoll.ExerciseData.activeCategories().forEach((c) => { if (neuVoll.Quiz.bankBrauchtWortschatz([c.id])) return; c.getBank().forEach((q) => {
        if (q.level && LEVELS.includes(q.level)) return;
        const w = String(q.prompt || "").toLowerCase().match(/[a-zäöüß]{3,}/g) || [];
        if (w.length >= 5) new Set(w).forEach((x) => zaehl.set(x, (zaehl.get(x) || 0) + 1));
      }); });
    }
    const kandidaten = [4, 5, 3].flatMap((i) => auszug.stufen[i].split(" ").filter(Boolean)).sort((a, b) => (zaehl.get(b) || 0) - (zaehl.get(a) || 0));
    let gefunden = null, anders = 0;
    for (const wort of kandidaten.slice(0, 12)) {
      const f2 = JSON.parse(JSON.stringify(auszug));
      f2.stufen = f2.stufen.map((s) => s.split(" ").filter((x) => x && x !== wort).join(" "));
      f2.stufen[0] = (f2.stufen[0] + " " + wort).trim();
      const nk = kasten({ stempel: DMA_STEMPEL });
      nk.DMA_DATEN.WORTNIVEAU = f2;
      anders = 0;
      nk.ExerciseData.activeCategories().forEach((c) => {
        if (nk.Quiz.bankBrauchtWortschatz([c.id])) return;
        setze(nk, 5); setze(alt, 5);
        const bn = nk.ExerciseData.activeGetCategory(c.id).getBank(), ba = alt.ExerciseData.activeGetCategory(c.id).getBank();
        bn.forEach((q, i) => { if (nk.Quiz.niveauBeimRundenbau(q, c.id) !== alt.Quiz.questionLevel(ba[i], c.id)) anders++; });
      });
      if (anders) { gefunden = wort; break; }
    }
    sage(Boolean(gefunden), "GP2 ein Wort im Auszug auf falscher Stufe („" + gefunden + "“ " + (zaehl.get(gefunden) || 0) + "× in abhängigen Aufgaben, nach A1): G2 fällt auf", anders + " Aufgaben anders eingestuft");
  }
  {
    const code = neuCode.replace('const BANK_AUS_WORTSCHATZ = ["wortschatz", "meinwortschatz"];', "const BANK_AUS_WORTSCHATZ = [];");
    const gk = kasten({ quizCode: code, name: "GP3", stempel: DMA_STEMPEL });
    const fall = deF.filter((f) => f.ids[0] === "wortschatz" && f.level).slice(0, 12);
    let abw = 0;
    for (const f of fall) { const a = rundeAlt(alt, f); const b = rundeNeu(gk, neuVoll, auszug, f, "GP3"); if (a.text !== b.text) abw++; }
    sage(code !== neuCode && abw > 0, "GP3 BANK_AUS_WORTSCHATZ leer (Wortschatz-Kategorie ohne Wörterbuch): fällt auf", abw + " von " + fall.length + " Runden anders");
  }
  {
    const code = neuCode.replace(".match(WORT_MUSTER) || []).length < 5;", ".match(WORT_MUSTER) || []).length < 9;");
    const gk = kasten({ quizCode: code, name: "GP4", stempel: DMA_STEMPEL });
    const gv = kasten({ quizCode: code, name: "GP4v", stempel: DMA_STEMPEL });
    await gv.VocabData.ladeWoerter();
    let abw = 0, n = 0;
    for (const f of abhF) { n++; const a = rundeAlt(alt, f); const b = rundeNeu(gk, gv, auszug, f, ""); if (a.text !== b.text) abw++; }
    sage(code !== neuCode && abw > 0, "GP4 Fünf-Wörter-Grenze falsch (< 9: abhängige Aufgaben gälten als fest, die Runde startete ohne Auszug): fällt auf", abw + " von " + n + " Runden anders");
  }
  console.log("\n  (Teil G: " + Math.round((Date.now() - t0) / 1000) + " s)");
}

(async () => {
  console.log("SONDE 889 — „Runde starten“ ohne den ganzen Wortschatz   WURZEL " + WURZEL);
  if (NUR.includes("G")) await teilG();
  if (NUR.includes("B")) {
    let B = null;
    try { B = require("./pruefe-889-runde-seite.js"); } catch (e) { B = null; }
    if (!B) sage(false, "B Teil Seite (werkzeug/pruefe-889-runde-seite.js) fehlt");
    else { const n = await B.teilB(WURZEL, sage); fehler += n; }   /* sage() zählt schon mit (erst nach dem await lesen) */
  }
  console.log("\n" + (fehler ? fehler + " FEHL" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
