#!/usr/bin/env node
/* =====================================================================
   FASSUNG 889 — „RUNDE STARTEN" OHNE DEN GANZEN WORTSCHATZ: DER AUSZUG
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die schnelle Performance … oberste Priorität" ·
   Vorrang 2: Ladezeiten. SPIELSYSTEM.md, Abschnitt 889.

   „Runde starten" wartete auf alle 26 Wortschatz-Dateien (2,3 MB gepackt),
   weil quiz.js jede Aufgabe OHNE eigenes Niveau zusätzlich nach ihren
   Wörtern einstuft (wortschatzNiveauIndex: das Niveau, auf dem neun von
   zehn erkannten Wörtern liegen, erst ab fünf Wörtern). Diese Einstufung
   braucht vom Wörterbuch aber nur eines: für jedes Wort, das in so einer
   Aufgabe vorkommt, sein niedrigstes Niveau. Das rechnet dieses Werkzeug
   VORHER aus – mit genau dem Code der Seite (quiz.js, data-vocab.js samt
   aller Wortschatz-Dateien, data-exercises.js, data-uebungen.js,
   data-italienisch.js in einem Sandkasten) – und schreibt es klein:

     bau/wortniveau-<hash>.js   (≈ 25 KB, gepackt ≈ 9 KB)
       (window.DMA_DATEN=window.DMA_DATEN||{}).WORTNIVEAU={
         "quelle": { "vokabeln/alltag.js": "<Stempel>", … alle 26 },
         "stufen": [ "<Wörter A1>", "<A2>", "<B1>", "<B2>", "<C1>", "<C2>" ],
         "ohne":   "<Wörter, die im Wörterbuch nicht stehen>" };
     index.html: window.DMA_MODUL.wortniveau = "bau/wortniveau-<hash>.js"

   Die Seite nimmt ihn NUR beim Bau einer Runde (Quiz.startSession mit
   { auszug: true }), nur solange der Wortschatz nicht ganz da ist, nur
   wenn jeder Stempel in „quelle" gleich dem Stempel der Seite ist
   (DMA_STEMPEL – sonst ist der Auszug aus einem anderen Wörterbuch) und
   nur für eine Aufgabe, deren Wörter ALLE im Auszug stehen („stufen" +
   „ohne"). Sonst wartet sie wie bisher auf den ganzen Wortschatz.

   Geprüft wird hier, bevor geschrieben wird:
     - keine Kategorie außer denen in Quiz.bankBrauchtWortschatz liest beim
       Bau ihrer Aufgaben VocabData (sonst: Fehler, kein Auszug – und laut);
     - die Aufgabentexte jeder Kategorie hängen nicht am Zufall (zweimal mit
       verschiedenen Zufallszahlen geholt, dieselbe Menge von Texten);
     - der ganze Wortschatz ist im Sandkasten angekommen (alle Themen).
   Gebaut wird nur, wenn sich eine Eingabe geändert hat
   (bau/wortniveau-quelle.json) oder die Datei fehlt; Name = sha256 des
   Inhalts (wie uebungen-teilen.js). Aufräumen: nur, was weder der neue
   Eintrag noch einer der letzten 3 Commits mit einem Auszug nennt.

   AUFRUF (allein): node werkzeug/wortniveau-bauen.js [--pruefen]
   Gleichlauf-Prüfer und Sonde: werkzeug/pruefe-889-runde.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto"), zlib = require("zlib");
const { execFileSync } = require("child_process");

const GRUND = "bau/wortniveau";
const MERK = "bau/wortniveau-quelle.json";
const NAME = /^bau\/wortniveau-[A-Za-z0-9_-]{8}\.js$/;
const SKRIPTE = ["core.js", "data-vocab.js", "data-uebungen.js", "data-exercises.js", "data-italienisch.js", "quiz.js"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const WORT = /[a-zäöüß]{3,}/g;

function hashVon(buf) { return crypto.createHash("sha256").update(buf).digest("base64url").slice(0, 8); }
function stempelVon(buf) { return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 10); }   /* wie fassung-setzen.js */
function jsonLesen(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } }
function vokabelDateien(wurzel) {
  const o = path.join(wurzel, "vokabeln");
  return fs.existsSync(o) ? fs.readdirSync(o).filter((n) => /\.js$/.test(n)).sort().map((n) => "vokabeln/" + n) : [];
}
/* alles, was den Auszug bestimmt: die Skripte, alle Wortschatz-Dateien, dieses Werkzeug */
function summe(wurzel) {
  const h = crypto.createHash("sha1");
  SKRIPTE.concat(vokabelDateien(wurzel)).forEach((f) => {
    h.update(f + "\0");
    const p = path.join(wurzel, f);
    h.update(fs.existsSync(p) ? fs.readFileSync(p) : Buffer.from("-"));
  });
  h.update(fs.readFileSync(__filename));
  return h.digest("hex");
}

/* Ein Zufall mit Startwert (für die Prüfung „Texte hängen nicht am Zufall") */
function zufall(start) {
  let s = start >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* Sandkasten wie die Seite: window = globalThis; Skript-Tags (Wortschatz, nachgeladene Teile) werden aus dem Baum
   ausgeführt und ihre Namen gemerkt. → { ctx, geladen: [Pfade] } */
function sandkasten(wurzel, skripte) {
  const geladen = [];
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, setTimeout, clearTimeout, setImmediate, Promise });
  ctx.__lauf = (f) => vm.runInContext(fs.readFileSync(path.join(wurzel, f), "utf8"), ctx, { filename: f, timeout: 120000 });
  ctx.__geladen = (f) => geladen.push(f);
  vm.runInContext(`var window = globalThis;
    var document = { hidden: false, addEventListener() {}, createElement() { return {}; },
      head: { appendChild(s) { const f = String(s.src).split("?")[0]; __geladen(f);
        setImmediate(() => { try { __lauf(f); } catch (e) { s.onerror && s.onerror(e); return; } s.onload && s.onload(); }); } } };
    window.addEventListener = function () {};`, ctx);
  (skripte || SKRIPTE).forEach((f) => { if (fs.existsSync(path.join(wurzel, f))) ctx.__lauf(f); });
  vm.runInContext("globalThis.Core = Core; globalThis.VocabData = VocabData; globalThis.ExerciseData = ExerciseData; globalThis.Quiz = Quiz;", ctx);
  return { ctx, geladen };
}

/* Wer liest beim Bau seiner Aufgaben VocabData? (alle Eigenschaften des Objekts werden zu zählenden Gettern) */
function wortschatzLeser(ctx) {
  const V = ctx.VocabData;
  let gelesen = 0;
  Object.keys(V).forEach((k) => {
    const d = Object.getOwnPropertyDescriptor(V, k);
    if (!d || !d.configurable) return;
    const wert = d.get ? d.get : (() => d.value);
    Object.defineProperty(V, k, { configurable: true, enumerable: d.enumerable, get() { gelesen++; return wert.call(V); } });
  });
  return { zaehler: () => gelesen };
}

/* Alle Banken beider Räume (ohne die, die ihre Aufgaben aus dem Wörterbuch bauen), je Thema der filterbaren Kategorien.
   → { banken: [{ raum, id, thema, fragen }], fehler } */
function alleBanken(ctx) {
  const E = ctx.ExerciseData, Q = ctx.Quiz;
  const leser = wortschatzLeser(ctx);
  const M = vm.runInContext("Math", ctx), echt = M.random;
  const banken = [], fehler = [];
  try {
    for (const raum of ["de", "it"]) {
      E.setLernraum(raum);
      for (const c of E.activeCategories()) {
        const themen = [undefined].concat(c.id === "quiz" ? E.getQuizTopics() : []);
        const vorher = leser.zaehler();
        for (const t of themen) {
          if (Q.bankBrauchtWortschatz([c.id])) continue;
          const texte = [];
          let fragen = null;
          for (const s of [11, 977]) {
            M.random = zufall(s);
            const b = t === undefined ? c.getBank() : c.getBank(t);
            texte.push(b.map((q) => String((q && q.prompt) || "")).sort().join("\u0000"));
            if (!fragen) fragen = b;
          }
          if (texte[0] !== texte[1]) fehler.push("Aufgabentexte hängen am Zufall: " + raum + "/" + c.id + (t ? "/" + t : ""));
          banken.push({ raum, id: c.id, thema: t || "", fragen });
        }
        if (!Q.bankBrauchtWortschatz([c.id]) && leser.zaehler() !== vorher) fehler.push("liest VocabData beim Bau der Aufgaben, steht aber nicht in BANK_AUS_WORTSCHATZ (quiz.js): " + raum + "/" + c.id);
      }
    }
  } finally { M.random = echt; E.setLernraum("de"); }
  return { banken, fehler };
}
/* die Wörter der Aufgaben, deren Niveau am Wortschatz hängt (dieselbe Regel wie Quiz: niveauOhneWortschatz) */
function woerterDerBanken(banken) {
  const w = new Set();
  let aufgaben = 0;
  banken.forEach((b) => b.fragen.forEach((q) => {
    if (q && q.level && LEVELS.includes(q.level)) return;
    const t = String((q && q.prompt) || "").toLowerCase().match(WORT) || [];
    if (t.length < 5) return;
    aufgaben++;
    t.forEach((x) => w.add(x));
  }));
  return { woerter: w, aufgaben };
}

function text(daten) {
  return "(window.DMA_DATEN=window.DMA_DATEN||{}).WORTNIVEAU=" + JSON.stringify(daten).split(String.fromCharCode(0x2028)).join("\\u2028").split(String.fromCharCode(0x2029)).join("\\u2029") + ";\n";
}

/* → { name, buf, daten, stand, fehler } (nichts geschrieben) */
async function erzeugen(wurzel) {
  const { ctx, geladen } = sandkasten(wurzel);
  const ok = await ctx.VocabData.ladeWoerter();
  if (!ok || !ctx.VocabData.alleThemenDa()) return { fehler: "der Wortschatz kam im Sandkasten nicht ganz an" };
  const dateien = [...new Set(geladen.filter((f) => /^vokabeln\//.test(f)))].sort();
  if (dateien.length !== ctx.VocabData.themenListe().length) return { fehler: "Wortschatz-Dateien " + dateien.length + " ≠ Themen " + ctx.VocabData.themenListe().length };
  const { banken, fehler } = alleBanken(ctx);
  if (fehler.length) return { fehler: fehler.slice(0, 3).join(" · ") };
  const { woerter, aufgaben } = woerterDerBanken(banken);
  const liste = [...woerter].sort();
  const stufe = ctx.Quiz.wortniveauAuszug(liste);
  const stufen = LEVELS.map(() => []), ohne = [];
  liste.forEach((w) => { const i = stufe[w]; if (i >= 0 && i < LEVELS.length) stufen[i].push(w); else ohne.push(w); });
  const quelle = {};
  dateien.forEach((f) => { quelle[f] = stempelVon(fs.readFileSync(path.join(wurzel, f))); });
  const daten = { quelle, stufen: stufen.map((l) => l.join(" ")), ohne: ohne.join(" ") };
  const buf = Buffer.from(text(daten), "utf8");
  /* zurückgelesen: derselbe Inhalt im frischen Sandkasten */
  const z = vm.createContext({}); vm.runInContext("var window = globalThis;", z); vm.runInContext(buf.toString("utf8"), z);
  if (JSON.stringify(z.DMA_DATEN.WORTNIVEAU) !== JSON.stringify(daten)) return { fehler: "zurückgelesen ≠ geschrieben" };
  return { name: GRUND + "-" + hashVon(buf) + ".js", buf, daten,
    stand: { woerter: liste.length, imWoerterbuch: liste.length - ohne.length, aufgaben, banken: banken.length, dateien: dateien.length } };
}

function schreiben(wurzel, rel, buf) {
  const ziel = path.join(wurzel, rel);
  if (fs.existsSync(ziel)) {
    if (!fs.readFileSync(ziel).equals(buf)) throw new Error("unter " + rel + " liegt ein anderer Inhalt – nicht überschrieben");
    return false;
  }
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  const tmp = path.join(path.dirname(ziel), "zwischen-" + process.pid + "-" + Date.now() + ".tmp");
  try {
    fs.writeFileSync(tmp, buf);
    if (!fs.readFileSync(tmp).equals(buf)) throw new Error("zurückgelesen ≠ geschrieben: " + rel);
    fs.renameSync(tmp, ziel);
  } finally { try { fs.unlinkSync(tmp); } catch (e) {} }
  return true;
}
function eigeneDateien(wurzel) {
  const bau = path.join(wurzel, "bau");
  return fs.existsSync(bau) ? fs.readdirSync(bau).map((n) => "bau/" + n).filter((p) => NAME.test(p)).sort() : [];
}
function gitBehalten(wurzel, n) {
  try {
    if (!fs.existsSync(path.join(wurzel, ".git"))) return null;
    const git = (a) => execFileSync("git", ["-C", wurzel].concat(a), { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }).toString("utf8");
    const s = new Set();
    git(["log", "-n", String(n), "--format=%H", "--", "bau/wortniveau-*.js"]).split("\n").filter(Boolean).forEach((h) => {
      git(["ls-tree", "--name-only", h, "--", "bau/"]).split("\n").filter((p) => NAME.test(p)).forEach((p) => s.add(p));
    });
    return s;
  } catch (e) { return null; }
}

/* → { eintrag: "bau/wortniveau-XXXXXXXX.js" | null, gebaut, geloescht, stand, fehler }
   eintrag null + fehler: DMA_MODUL bekommt KEIN „wortniveau" (die Runde wartet dann wie bisher auf den Wortschatz) */
async function bauen(wurzel) {
  if (!fs.existsSync(path.join(wurzel, "quiz.js")) || !vokabelDateien(wurzel).length) return { eintrag: null, gebaut: false, geloescht: 0, fehler: null };
  const s = summe(wurzel);
  const merk = jsonLesen(path.join(wurzel, MERK)) || {};
  let eintrag = null, gebaut = false, stand = merk.stand || null;
  if (merk.summe === s && merk.datei && NAME.test(merk.datei) && fs.existsSync(path.join(wurzel, merk.datei))) eintrag = merk.datei;
  else {
    let e;
    try { e = await erzeugen(wurzel); } catch (x) { e = { fehler: String(x.message || x).split("\n")[0] }; }
    if (e.fehler) return { eintrag: null, gebaut: false, geloescht: 0, fehler: e.fehler };
    try {
      schreiben(wurzel, e.name, e.buf);
      fs.writeFileSync(path.join(wurzel, MERK), JSON.stringify({ summe: s, datei: e.name, stand: e.stand }, null, 1) + "\n");
    } catch (x) { return { eintrag: null, gebaut: false, geloescht: 0, fehler: String(x.message || x).split("\n")[0] }; }
    eintrag = e.name; gebaut = true; stand = e.stand;
  }
  let geloescht = 0;
  const alt = gitBehalten(wurzel, 3);
  if (alt) {
    alt.add(eintrag);
    eigeneDateien(wurzel).forEach((p) => { if (!alt.has(p)) { fs.unlinkSync(path.join(wurzel, p)); geloescht++; } });
  }
  return { eintrag, gebaut, geloescht, stand, fehler: null };
}

module.exports = { bauen, erzeugen, summe, sandkasten, alleBanken, woerterDerBanken, wortschatzLeser, zufall, stempelVon, GRUND, MERK, NAME };

if (require.main === module) {
  const w = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
  (async () => {
    if (process.argv.includes("--pruefen")) {
      const t0 = Date.now();
      const e = await erzeugen(w);
      if (e.fehler) { console.error("NEIN: " + e.fehler); process.exit(1); }
      console.log("ok: " + e.name + ", " + e.buf.length + " B (gepackt " + zlib.gzipSync(e.buf, { level: 9 }).length + " B), "
        + JSON.stringify(e.stand) + ", " + (Date.now() - t0) + " ms");
      process.exit(0);
    }
    const r = await bauen(w);
    /* --json: für fassung-setzen.js (läuft dort als eigener Vorgang, weil das Laden des Wortschatzes asynchron ist) */
    if (process.argv.includes("--json")) { process.stdout.write(JSON.stringify(r) + "\n"); process.exit(r.fehler ? 2 : 0); }
    if (r.fehler) { console.error("WORTNIVEAU: " + r.fehler); process.exit(2); }
    console.log((r.gebaut ? "neu gebaut: " : "unverändert: ") + r.eintrag + (r.geloescht ? " (" + r.geloescht + " alte gelöscht)" : "") + " " + JSON.stringify(r.stand));
  })();
}
