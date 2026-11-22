#!/usr/bin/env node
/* =====================================================================
   SONDE 889 — NACHBESSERUNG (Gesamt, Runde 1), ohne Browser
   ---------------------------------------------------------------------
   W  „Wortschatz – Alle Themen" (data-exercises.js bankWortschatzThemen)
      fror die Seite ein (schon in 888: in Node 176 s für EIN getBank()
      mit dem ganzen Wörterbuch). Jetzt Ablenker je Niveau vorsortiert,
      drei zufällig gezogen.
      W1 Zeit: getBank() ohne Thema und Quiz.poolSizeFor mit dem ganzen
         Wortschatz unter 5 s (gemessen ~0,3 s); ein Thema unter 1 s
      W2 Regel (künstliches Thema, eindeutige Bedeutungen): vier
         verschiedene Antworten, die richtige genau einmal, nie das Wort
         selbst, nur aus dem Thema; gleiches Niveau, wenn es dort
         mindestens drei andere gibt – sonst aus dem ganzen Thema
      W3 Verteilung: jede Dreiermenge von Ablenkern gleich oft (Chi² gegen
         die Gleichverteilung, |z| < 4) – genau wie Core.shuffle(...).slice
         bisher; für den Zweig „gleiches Niveau", „ganzes Thema" und die
         kleine Liste (bis 8 Kandidaten, gemischt wie bisher)
      W4 Lückenfragen: die Lücke trägt den Wortkörper, vier verschiedene
         Antworten
   R  Die Reihe in data-vocab.js (höchstens 4 Wortschatz-Dateien zugleich),
      mit nachgebautem Browser (Skript-Tags, Resource Timing, Uhr):
      R1 übers Netz: nie mehr als 4 zugleich, alle 26 kommen, das
         Versprechen löst sich
      R2 data-vocab.js kam mit transferSize 0 UND encodedBodySize 0
         (Helfer/Speicher, wie WebKit es melden könnte) → alle 26 zugleich
      R3 eine Wortschatz-Datei kommt so (Beobachter) → die übrigen zugleich
      R4 die ersten 4 hängen (nie onload/onerror): nach 12 s ohne fertige
         Datei gehen die übrigen 22 hinaus und kommen an; vorher keine
      R5 langsam, aber ohne Hänger (je Datei 8 s): nie mehr als 4 zugleich,
         die Frist greift nicht
      R6 eilig() → die übrigen zugleich (wie bisher)
   GP Gegenprobe – jede Zeile ist ok, wenn der Fehler AUFFÄLLT:
      bankWortschatzThemen aus REF (888): W1 zu langsam (Abbruch nach 20 s);
      Ablenker ohne Niveau-Regel, mit dem Wort selbst, immer dieselben drei
      (W2/W3 rot); data-vocab.js aus VOR (889 vor dieser Nachbesserung):
      R2 und R4 rot
   S  die echte Seite (Chromium, werkzeug/pruefe-889-nachbesserung-seite.js):
      S1 „Alle Themen“ mit ganzem Wortschatz friert den Kartentipp nicht ein,
      S2 im Raum bleibt die Reihe auch für „Wortschatz“, S3 Vokabelmeister
      (eilig; „❔“ wird nach dem ganzen Wortschatz „✅“)
   Aufruf:  node werkzeug/pruefe-889-nachbesserung.js   (NUR=WRGS, REF=4bd701b3 VOR=2260d4d0)
            Chromium nur in S – Läufer mit flock.
   Gegenprobe S: WURZEL=<Baum mit 888> NUR=S → S1, S2, S3 rot.
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm");
const { execFileSync, spawnSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const REF = process.env.REF || "4bd701b3", VOR = process.env.VOR || "2260d4d0";
const NUR = process.env.NUR || "WRGS";
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const lies = (f) => fs.readFileSync(path.join(WURZEL, f), "utf8");
const ausGit = (ref, f) => { try { return execFileSync("git", ["-C", WURZEL, "show", ref + ":" + f], { encoding: "utf8", maxBuffer: 1 << 28 }); } catch (e) { return null; } };

/* ---------- W: Sandkasten wie die Seite ---------- */
const SKRIPTE = ["core.js", "data-vocab.js", "data-uebungen.js", "data-exercises.js", "data-italienisch.js", "quiz.js"];
function kasten(ersatz) {
  ersatz = ersatz || {};
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, setTimeout, clearTimeout, setImmediate, Promise });
  ctx.__lauf = (f) => vm.runInContext(fs.readFileSync(path.join(WURZEL, f), "utf8"), ctx, { filename: f });
  vm.runInContext(`var window = globalThis;
    var document = { hidden: false, addEventListener() {}, createElement() { return {}; },
      head: { appendChild(s) { const f = String(s.src).split("?")[0];
        setImmediate(() => { try { __lauf(f); } catch (e) { s.onerror && s.onerror(e); return; } s.onload && s.onload(); }); } } };
    window.addEventListener = function () {};`, ctx);
  SKRIPTE.forEach((f) => { if (ersatz[f] != null) vm.runInContext(ersatz[f], ctx, { filename: f + " (Ersatz)" }); else if (fs.existsSync(path.join(WURZEL, f))) ctx.__lauf(f); });
  vm.runInContext("globalThis.Core = Core; globalThis.VocabData = VocabData; globalThis.ExerciseData = ExerciseData; globalThis.Quiz = Quiz;", ctx);
  return ctx;
}
const komb = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
/* Künstliches Thema: 12 Wörter A1 (Zweig „gleiches Niveau", Ziehen), 2 Wörter B2 (zu wenige → ganzes Thema, Ziehen),
   in einem zweiten Thema 4 Wörter C1 + 1 Wort A2 (kleine Liste: gemischt wie bisher). Bedeutungen eindeutig. */
function kuenstlich(ctx) {
  const W = ctx.VocabData.WORDS;
  for (let i = 0; i < 12; i++) W.push({ word: "Awort" + i, de: "Bedeutung A" + i, theme: "SondeEins", level: "A1" });
  for (let i = 0; i < 2; i++) W.push({ word: "Bwort" + i, de: "Bedeutung B" + i, theme: "SondeEins", level: "B2" });
  for (let i = 0; i < 4; i++) W.push({ word: "Cwort" + i, de: "Bedeutung C" + i, theme: "SondeZwei", level: "C1" });
  W.push({ word: "Dwort0", de: "Bedeutung D0", theme: "SondeZwei", level: "A2" });
  for (let i = 0; i < 12; i++) W.push({ word: "die Lueckenform" + "abcdefghijkl"[i], de: "Lückenbedeutung " + i, theme: "SondeDrei", level: "B1",
    example: "Heute sehe ich Lueckenform" + "abcdefghijkl"[i] + " im Park." });
}
/* Kandidaten je künstlichem Wort (wer darf Ablenker sein?) */
const ERLAUBT = {
  A: (k) => /^Bedeutung A/.test(k), B: (k) => /^Bedeutung [AB]/.test(k), C: (k) => /^Bedeutung C/.test(k), D: (k) => /^Bedeutung [CD]/.test(k)
};
const KANDIDATEN = { A: 11, B: 13, C: 3, D: 4 };
function regelUndVerteilung(ctx, laeufe) {
  const c = ctx.ExerciseData.activeGetCategory("wortschatz");
  const h = new Map(), n = new Map();
  let regel = 0, fragen = 0, beispiel = "";
  for (let r = 0; r < laeufe; r++) ["SondeEins", "SondeZwei"].forEach((t) => c.getBank(t).forEach((q) => {
    const m = /^Was bedeutet „([ABCD])wort(\d+)“\?$/.exec(q.prompt); if (!m) return;
    fragen++;
    const richtig = q.options[q.correct[0]], falsch = q.options.filter((x, i) => i !== q.correct[0]);
    const soll = Math.min(3, KANDIDATEN[m[1]]);
    const gut = q.correct.length === 1 && richtig === "Bedeutung " + m[1] + m[2] && new Set(q.options).size === q.options.length
      && falsch.length === soll && falsch.every((f) => f !== richtig && ERLAUBT[m[1]](f));
    if (!gut) { regel++; if (!beispiel) beispiel = q.prompt + " " + JSON.stringify(q.options); }
    const k = m[1] + m[2] + "::" + falsch.slice().sort().join("|");
    h.set(k, (h.get(k) || 0) + 1); n.set(m[1] + m[2], (n.get(m[1] + m[2]) || 0) + 1);
  }));
  /* Chi² je Zweig: jede Dreiermenge (bei C: die eine Menge in 3! Folgen – egal, Mengen) gleich oft */
  const zweig = {};
  n.forEach((anz, wort) => {
    const art = wort[0], kk = komb(KANDIDATEN[art], Math.min(3, KANDIDATEN[art])), e = anz / kk;
    const z = zweig[art] || (zweig[art] = { chi: 0, df: 0 });
    let gesehen = 0;
    h.forEach((o, k) => { if (k.split("::")[0] === wort) { z.chi += (o - e) ** 2 / e; gesehen++; } });
    z.chi += (kk - gesehen) * e;
    z.df += kk - 1;
  });
  const zwert = (z) => (z && z.df ? (z.chi - z.df) / Math.sqrt(2 * z.df) : 0);
  return { regel, fragen, beispiel, zA: zwert(zweig.A), zB: zwert(zweig.B), zD: zwert(zweig.D), dfC: zweig.C ? zweig.C.df : -1 };
}
function lueckenPruefen(ctx) {
  const c = ctx.ExerciseData.activeGetCategory("wortschatz");
  let luecken = 0, schlecht = 0;
  for (let r = 0; r < 50; r++) c.getBank("SondeDrei").forEach((q) => {
    if (!/___/.test(q.prompt) || !/^Heute sehe ich ___ im Park\.$/.test(q.prompt)) return;
    luecken++;
    const richtig = q.options[q.correct[0]];
    if (q.options.length !== 4 || new Set(q.options).size !== 4 || !/^Lueckenform[a-l]$/.test(richtig) || q.options.some((o) => /^die /.test(o))) schlecht++;
  });
  return { luecken, schlecht };
}
/* W1 in einem eigenen Vorgang (die alte Fassung braucht Minuten – Abbruch nach FRIST ms) */
function zeitMessen(ersatzDatei, fristMs) {
  const kind = `
    const vm = require("vm"), fs = require("fs"), path = require("path");
    const W = ${JSON.stringify(WURZEL)};
    const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, setTimeout, clearTimeout, setImmediate, Promise });
    ctx.__lauf = (f) => vm.runInContext(fs.readFileSync(path.join(W, f), "utf8"), ctx, { filename: f });
    vm.runInContext('var window = globalThis; var document = { hidden: false, addEventListener() {}, createElement() { return {}; }, head: { appendChild(s) { const f = String(s.src).split("?")[0]; setImmediate(() => { try { __lauf(f); } catch (e) { s.onerror && s.onerror(e); return; } s.onload && s.onload(); }); } } }; window.addEventListener = function () {};', ctx);
    for (const f of ${JSON.stringify(SKRIPTE)}) {
      if (f === "data-exercises.js" && ${JSON.stringify(ersatzDatei || "")}) vm.runInContext(fs.readFileSync(${JSON.stringify(ersatzDatei || "")}, "utf8"), ctx, { filename: f });
      else ctx.__lauf(f);
    }
    vm.runInContext("globalThis.VocabData = VocabData; globalThis.ExerciseData = ExerciseData; globalThis.Quiz = Quiz;", ctx);
    ctx.VocabData.ladeWoerter().then(() => {
      const c = ctx.ExerciseData.activeGetCategory("wortschatz");
      let t = Date.now(); const b1 = c.getBank("Essen & Trinken"); const eins = Date.now() - t;
      t = Date.now(); const b0 = c.getBank(); const alle = Date.now() - t;
      t = Date.now(); const n = ctx.Quiz.poolSizeFor(["wortschatz"], { wortschatz: "" }, "B1"); const pool = Date.now() - t;
      console.log(JSON.stringify({ woerter: ctx.VocabData.WORDS.length, eins, n1: b1.length, alle, n0: b0.length, pool, np: n }));
    });`;
  const r = spawnSync(process.execPath, ["-e", kind], { encoding: "utf8", timeout: fristMs });
  if (r.error || r.signal) return { abbruch: true };
  try { return JSON.parse(String(r.stdout).trim().split("\n").pop()); } catch (e) { return { kaputt: String(r.stderr).slice(0, 200) }; }
}

/* ---------- R: nachgebauter Browser für die Reihe in data-vocab.js ---------- */
function reiheKasten(code, o) {
  o = o || {};
  const uhr = { t: 0, timer: [], id: 1 };
  const log = { start: [], fertig: [], maxZugleich: 0, offen: 0 };
  const eintraege = [];
  let beobachter = null;
  const themen = JSON.parse(/const VOKABEL_THEMEN = (\[\[[^\n]*\]\]);/.exec(code)[1]);
  const nameVon = {}; themen.forEach(([n, d]) => { nameVon[d] = n; });
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, Promise });
  ctx.setTimeout = (f, ms) => { const id = uhr.id++; uhr.timer.push({ id, f, wann: uhr.t + Math.max(0, ms || 0) }); return id; };
  ctx.clearTimeout = (id) => { uhr.timer = uhr.timer.filter((x) => x.id !== id); };
  ctx.performance = { getEntriesByType: () => eintraege.slice(), now: () => uhr.t };
  function PRT() {}
  PRT.prototype = { transferSize: 0, encodedBodySize: 0 };
  ctx.PerformanceResourceTiming = PRT;
  ctx.PerformanceObserver = function (cb) { this.cb = cb; beobachter = this; this.observe = () => {}; this.disconnect = () => { beobachter = null; }; };
  /* data-vocab.js selbst schon in Resource Timing (Startweg) */
  eintraege.push({ name: "https://x.test/min/data-vocab.js?v=1", transferSize: o.startTransfer == null ? 41000 : o.startTransfer, encodedBodySize: o.startEncoded == null ? 40000 : o.startEncoded });
  const dauer = o.dauer || (() => 300);
  ctx.document = { hidden: false, addEventListener() {}, createElement() { return {}; },
    head: { appendChild(s) {
      const datei = /vokabeln\/([a-z0-9-]+)\.js/.exec(String(s.src))[1];
      log.start.push({ datei, t: uhr.t }); log.offen++; log.maxZugleich = Math.max(log.maxZugleich, log.offen);
      const d = dauer(datei, log.start.length - 1);
      if (d === Infinity) return;   // hängt: nie onload/onerror
      ctx.setTimeout(() => {
        ctx.DMA_VOKABELN = ctx.DMA_VOKABELN || {};
        ctx.DMA_VOKABELN[nameVon[datei]] = [{ word: "W-" + datei, de: "x", theme: nameVon[datei], level: "A1" }];
        const e = Object.assign({ name: "https://x.test/vokabeln/" + datei + ".js?v=1" }, o.eintrag ? o.eintrag(datei) : { transferSize: 90300, encodedBodySize: 90000 });
        eintraege.push(e);
        log.offen--; log.fertig.push({ datei, t: uhr.t });
        s.onload && s.onload();
        /* der Beobachter meldet in einer eigenen Aufgabe (~100 ms später, wie gemessen) */
        if (beobachter) { const b = beobachter; ctx.setTimeout(() => { try { b.cb({ getEntries: () => [e] }); } catch (x) {} }, 100); }
      }, d);
    } } };
  ctx.window = ctx;
  vm.runInContext(code + "\n;globalThis.VocabData = VocabData;", ctx, { filename: "data-vocab.js" });
  const leeren = () => new Promise((r) => setImmediate(r));
  const vor = async (ms) => {
    const ziel = uhr.t + ms;
    for (;;) {
      await leeren(); await leeren();
      uhr.timer.sort((a, b) => a.wann - b.wann || a.id - b.id);
      const n = uhr.timer[0];
      if (!n || n.wann > ziel) break;
      uhr.timer.shift(); uhr.t = n.wann;
      try { n.f(); } catch (e) {}
    }
    uhr.t = ziel; await leeren(); await leeren();
  };
  return { ctx, log, uhr, vor, V: ctx.VocabData, themen };
}
async function reihePruefen(code, art) {
  const r = {};
  /* R1 */
  {
    const k = reiheKasten(code); let fertig = false;
    k.V.ladeWoerter().then(() => { fertig = true; });
    await k.vor(60000);
    r.R1 = { max: k.log.maxZugleich, gestartet: k.log.start.length, da: k.V.alleThemenDa(), fertig };
  }
  /* R2 */
  {
    const k = reiheKasten(code, { startTransfer: 0, startEncoded: 0 });
    k.V.ladeWoerter();
    await k.vor(1);
    r.R2 = { sofort: k.log.start.length };
  }
  /* R3 */
  {
    const k = reiheKasten(code, { eintrag: () => ({ transferSize: 0, encodedBodySize: 0 }) });
    k.V.ladeWoerter();
    await k.vor(250);
    const vorher = k.log.start.length;
    await k.vor(500);
    r.R3 = { vorher, nachher: k.log.start.length };
  }
  /* R4 */
  {
    const k = reiheKasten(code, { dauer: (d, i) => (i < 4 ? Infinity : 300) });
    k.V.ladeWoerter();
    await k.vor(11900);
    const vor = k.log.start.length;
    await k.vor(5000);
    const fehlend = k.themen.filter(([n]) => !(k.ctx.DMA_VOKABELN || {})[n]).length;
    r.R4 = { vor, nach: k.log.start.length, angekommen: k.log.fertig.length, fehlend };
  }
  /* R5 */
  {
    const k = reiheKasten(code, { dauer: () => 8000 });
    let fertig = false;
    k.V.ladeWoerter().then(() => { fertig = true; });
    await k.vor(70000);
    r.R5 = { max: k.log.maxZugleich, fertig, da: k.V.alleThemenDa() };
  }
  /* R6 */
  {
    const k = reiheKasten(code, { dauer: () => 2000 });
    k.V.ladeWoerter();
    await k.vor(100);
    const vor = k.log.start.length;
    k.V.eilig();
    await k.vor(10);
    r.R6 = { vor, nach: k.log.start.length };
  }
  return r;
}
const reiheUrteil = (r) => ({
  R1: r.R1.max <= 4 && r.R1.gestartet === 26 && r.R1.da && r.R1.fertig,
  R2: r.R2.sofort === 26,
  R3: r.R3.vorher === 4 && r.R3.nachher === 26,
  R4: r.R4.vor === 4 && r.R4.nach === 26 && r.R4.angekommen === 22 && r.R4.fehlend === 4,
  R5: r.R5.max <= 4 && r.R5.fertig && r.R5.da,
  R6: r.R6.vor === 4 && r.R6.nach === 26
});

(async () => {
  const t0 = Date.now();
  if (NUR.includes("W")) {
  console.log("\nW  „WORTSCHATZ – ALLE THEMEN“ (bankWortschatzThemen)\n");
  const z = zeitMessen(null, 60000);
  sage(!z.abbruch && z.alle < 5000 && z.n0 > 40000, "W1 getBank() ohne Thema mit dem ganzen Wortschatz unter 5 s", JSON.stringify(z));
  sage(!z.abbruch && z.pool < 5000 && z.np > 0, "W1 Quiz.poolSizeFor(Wortschatz, alle Themen) unter 5 s (renderSetup beim Kartentipp)", z.pool + " ms");
  sage(!z.abbruch && z.eins < 1000 && z.n1 > 1000, "W1 ein Thema unter 1 s", z.eins + " ms");
  const ctx = kasten(); kuenstlich(ctx);
  const v = regelUndVerteilung(ctx, 1500);
  sage(v.fragen > 20000 && v.regel === 0, "W2 Regel: vier verschiedene Antworten, die richtige einmal, nie das Wort selbst, Thema, Niveau (sonst ganzes Thema)", v.fragen + " Fragen, " + v.regel + " falsch " + v.beispiel);
  sage(Math.abs(v.zA) < 4, "W3 Verteilung „gleiches Niveau“ gleichmäßig (Chi²)", "z " + v.zA.toFixed(2));
  sage(Math.abs(v.zB) < 4, "W3 Verteilung „zu wenige auf dem Niveau → ganzes Thema“ gleichmäßig", "z " + v.zB.toFixed(2));
  sage(Math.abs(v.zD) < 4 && v.dfC === 0, "W3 kleine Liste (bis 8 Kandidaten) wie bisher gemischt, gleichmäßig", "z " + v.zD.toFixed(2) + ", C1 genau eine Menge");
  const l = lueckenPruefen(ctx);
  sage(l.luecken > 100 && l.schlecht === 0, "W4 Lückenfragen: Wortkörper ohne Artikel, vier verschiedene Antworten", JSON.stringify(l));
  }
  if (NUR.includes("R")) {

  console.log("\nR  DIE REIHE IN data-vocab.js (nachgebauter Browser)\n");
  const neu = await reihePruefen(lies("data-vocab.js"));
  const u = reiheUrteil(neu);
  sage(u.R1, "R1 übers Netz: höchstens 4 zugleich, alle 26 kommen, Versprechen löst sich", JSON.stringify(neu.R1));
  sage(u.R2, "R2 data-vocab.js mit transferSize 0 und encodedBodySize 0 → alle 26 zugleich", JSON.stringify(neu.R2));
  sage(u.R3, "R3 eine Wortschatz-Datei mit transferSize 0 (Beobachter) → die übrigen zugleich", JSON.stringify(neu.R3));
  sage(u.R4, "R4 die ersten 4 hängen: nach 12 s gehen die übrigen 22 hinaus und kommen an, vorher keine", JSON.stringify(neu.R4));
  sage(u.R5, "R5 langsam ohne Hänger (8 s je Datei): höchstens 4 zugleich, Frist greift nicht", JSON.stringify(neu.R5));
  sage(u.R6, "R6 eilig() → die übrigen zugleich", JSON.stringify(neu.R6));
  }
  if (NUR.includes("G")) {

  console.log("\nGP GEGENPROBE (jede Zeile ist ok, wenn der Fehler AUFFÄLLT)\n");
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || require("os").tmpdir(), "p889n-"));
  try {
    const alt = ausGit(REF, "data-exercises.js");
    if (alt) {
      const f = path.join(tmp, "de-alt.js"); fs.writeFileSync(f, alt);
      const za = zeitMessen(f, 20000);
      sage(za.abbruch || za.alle >= 5000, "GP W1: bankWortschatzThemen aus " + REF + " ist zu langsam", za.abbruch ? "nach 20 s abgebrochen" : JSON.stringify(za));
    } else sage(false, "GP W1: data-exercises.js aus " + REF + " nicht lesbar");
    const quelle = lies("data-exercises.js");
    const mutante = (was, von, nach) => {
      if (quelle.indexOf(von) < 0) { sage(false, "GP " + was + ": Stelle nicht gefunden"); return null; }
      const m = kasten({ "data-exercises.js": quelle.replace(von, nach) }); kuenstlich(m); return regelUndVerteilung(m, 400);
    };
    let m = mutante("ohne Niveau", "wsAblenkerZiehen(gleich.length - 1 >= 3 ? gleich : pool, e.wort)", "wsAblenkerZiehen(pool, e.wort)");
    if (m) sage(m.regel > 0, "GP W2: Ablenker ohne Niveau-Regel fallen auf", m.regel + " falsch");
    m = mutante("mit dem Wort selbst", "if (x.wort === wort || schon.has(x)) continue;", "if (schon.has(x)) continue;");
    if (m) sage(m.regel > 0, "GP W2: das Wort selbst als Ablenker fällt auf", m.regel + " falsch");
    m = mutante("immer dieselben", "const x = liste[Math.floor(Math.random() * liste.length)];", "const x = liste[(versuch * 7) % liste.length];");
    if (m) sage(Math.abs(m.zA) >= 4, "GP W3: immer dieselben drei Ablenker fallen auf (Chi²)", "z " + m.zA.toFixed(1));
    const vorher = ausGit(VOR, "data-vocab.js");
    if (vorher) {
      const g = reiheUrteil(await reihePruefen(vorher));
      sage(!g.R2, "GP R2: data-vocab.js aus " + VOR + " (transferSize 0 = Netz) fällt auf");
      sage(!g.R4, "GP R4: data-vocab.js aus " + VOR + " (keine Frist) fällt auf");
      sage(g.R1 && g.R5 && g.R6, "GP (Kontrolle): R1, R5, R6 sind auch dort grün");
    } else sage(false, "GP R: data-vocab.js aus " + VOR + " nicht lesbar");
    const ohneFrist = lies("data-vocab.js").replace("const VOKABEL_FRIST = 12000;", "const VOKABEL_FRIST = 1e9;");
    sage(ohneFrist !== lies("data-vocab.js") && !reiheUrteil(await reihePruefen(ohneFrist)).R4, "GP R4: Frist ausgeschaltet fällt auf");
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  }
  if (NUR.includes("S")) {
    console.log("\nS  DIE ECHTE SEITE (Chromium, min/ wie ausgeliefert)   " + WURZEL + "\n");
    try { await require("./pruefe-889-nachbesserung-seite.js").teilS(WURZEL, sage); } catch (e) { sage(false, "S lief nicht durch", String(e.message || e).slice(0, 200)); }
  }

  console.log("\n  (" + Math.round((Date.now() - t0) / 1000) + " s)");
  console.log("\n" + (fehler ? fehler + " FEHL" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
