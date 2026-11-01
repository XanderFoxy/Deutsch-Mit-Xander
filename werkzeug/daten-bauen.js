#!/usr/bin/env node
/* =====================================================================
   MODUL-UMBAU (MODULE-PLAN.md Abschnitt 3, M3) — ÜBUNGSDATEN ALS JSON
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   310/312): „die maximal professionellste Lösung".

   Die reinen Daten-Dateien (data-uebungen.js, vokabeln/*.js, kalender/*.js
   …) sind JavaScript, das nur Werte auf window ablegt. Der Browser muss
   sie als Programm übersetzen und ausführen; JSON.parse liest dieselben
   Werte schneller (Node, frischer Prozess, min/data-uebungen.js 6,0 MB:
   Ausführen 151–170 ms, JSON.parse 69–87 ms).

   Dieses Werkzeug führt eine Daten-Datei in einem leeren Sandkasten aus
   (nur window, sonst nichts), hält fest, was sie auf window ablegt, und
   schreibt das als „Wirkung“:
     { "setzen": [ [["DMA_DATEN","ZUSATZ_FRAGEN"], { … }], … ] }
   Ein Lader legt jeden Wert an seinem Pfad ab (fehlende Zwischen-Objekte
   neu) – dasselbe Ergebnis wie das Ausführen der Datei. Geprüft wird:
     - nur JSON-fähige Werte (keine Funktion, kein undefined/NaN/Infinity,
       kein Date/RegExp/Map …), sonst wird die Datei NICHT umgewandelt;
     - Tiefenvergleich: die Wirkung, in einen frischen Sandkasten
       eingespielt, ergibt Wert für Wert dasselbe window wie die Datei.
   Bearbeitet wird weiter die JS-Quelle; die JSON-Datei entsteht daraus.

   STAND: nur Prüfen und Vermessen (ohne --schreiben schreibt das Werkzeug
   nichts). Eingebunden wird erst, wenn die Messung im Browser (CPU 4×,
   kalt/wieder) einen Gewinn über der Rauschgrenze zeigt – der Browser hat
   für Skripte einen Code-Speicher, für JSON nicht.

   AUFRUF:
     node werkzeug/daten-bauen.js                    → Bericht für alle Kandidaten
     node werkzeug/daten-bauen.js data-uebungen.js   → nur diese
     node werkzeug/daten-bauen.js --schreiben …      → bau/daten/<name>-<hash>.json
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
/* Ausgenommen (MODULE-PLAN.md M3): data-lesetexte (Bau-Funktion), data-exercises und data-vocab (Code) */
const AUSGENOMMEN = new Set(["data-lesetexte.js", "data-exercises.js", "data-vocab.js"]);

function kandidaten() {
  const l = ["data-uebungen.js"];
  ["vokabeln", "kalender"].forEach((o) => {
    const d = path.join(WURZEL, o);
    if (fs.existsSync(d)) fs.readdirSync(d).filter((n) => /\.js$/.test(n)).sort().forEach((n) => l.push(o + "/" + n));
  });
  fs.readdirSync(WURZEL).filter((n) => /^data-[a-z0-9-]+\.js$/.test(n) && !AUSGENOMMEN.has(n) && n !== "data-uebungen.js").sort()
    .forEach((n) => l.push(n));
  return l;
}

/* Sandkasten: nur window (= globalThis des Kontexts) */
function ausfuehren(code, vorher) {
  const ctx = vm.createContext({});
  vm.runInContext("var window = globalThis;", ctx);
  if (vorher) einspielen(ctx, vorher);
  const namenVor = new Set(Object.getOwnPropertyNames(ctx));
  const vor = {};
  namenVor.forEach((k) => { vor[k] = ctx[k]; });
  vm.runInContext(code, ctx, { timeout: 60000 });
  return { ctx, namenVor, vor };
}

/* JSON-fähig? (Pfad des ersten Problems oder "") */
function jsonProblem(x, p, tiefe) {
  if (tiefe > 200) return p + ": zu tief";
  if (x === null || typeof x === "string" || typeof x === "boolean") return "";
  if (typeof x === "number") return isFinite(x) && !Object.is(x, -0) ? "" : p + ": Zahl " + x;
  if (typeof x !== "object") return p + ": " + typeof x;
  const proto = Object.getPrototypeOf(x);
  if (Array.isArray(x)) {
    for (let i = 0; i < x.length; i++) { if (!(i in x)) return p + "[" + i + "]: Loch"; const e = jsonProblem(x[i], p + "[" + i + "]", tiefe + 1); if (e) return e; }
    return "";
  }
  if (proto !== null && Object.getPrototypeOf(proto) !== null) return p + ": kein schlichtes Objekt";
  for (const k of Object.keys(x)) { const e = jsonProblem(x[k], p + "." + k, tiefe + 1); if (e) return e; }
  return "";
}

/* WIRKUNG MIT MISCHEN ODER ERSETZEN. Eine Datei legt Werte auf window ab – manche ERSETZEN (window.X = {…}), manche
   MISCHEN in eine Sammlung, die schon da sein kann (X = X || {}; X["Alltag"] = […]; Object.assign(X.Y, {…})). Ein
   Lader, der einfach window.X ersetzt, würde dann andere Monate/Themen löschen. Deshalb zweimal ausführen:
     1. im leeren Sandkasten → was entsteht (R);
     2. im Sandkasten mit „Vorgängern": jedes Objekt aus R (bis Tiefe 4) als leeres Objekt mit einer Marke
        vorher angelegt. Steht danach an einem Pfad noch DASSELBE Objekt (mit Marke), mischt die Datei dort ein →
        hinabsteigen; sonst ersetzt sie dort → „setzen" mit dem ganzen Wert.
   Ergebnis: { "setzen": [ [pfad, wert], … ] } – der Lader legt jeden Wert an seinem Pfad ab und legt fehlende
   Zwischen-Objekte an; vorhandene bleiben (mischen). */
const MARKE = "__dmaDatenMarke";
function vorgaenger(R, tiefe) {
  const p = {};
  if (tiefe > 4) return p;
  Object.defineProperty(p, MARKE, { value: true, enumerable: false });
  for (const k of Object.keys(R)) if (istObjekt(R[k])) p[k] = vorgaenger(R[k], tiefe + 1);
  return p;
}
function istObjekt(x) { return x !== null && typeof x === "object" && !Array.isArray(x); }
function neueNamen(lauf) { return Object.getOwnPropertyNames(lauf.ctx).filter((k) => k !== "window" && (!lauf.namenVor.has(k) || lauf.vor[k] !== lauf.ctx[k])); }
function wirkung(code, lauf1) {
  const R = {};
  neueNamen(lauf1).forEach((k) => { R[k] = lauf1.ctx[k]; });
  const P = vorgaenger(R, 0);
  const lauf2 = ausfuehrenMit(code, P);
  const setzen = [];
  const geh = (vor, nach, rein, pfad) => {
    for (const k of Object.keys(rein)) {
      const v = vor ? vor[k] : undefined, n = nach ? nach[k] : undefined;
      if (istObjekt(v) && v === n && v[MARKE]) geh(v, n, rein[k], pfad.concat([k]));
      else setzen.push([pfad.concat([k]), rein[k]]);
    }
  };
  geh(P, lauf2.ctx, R, []);
  return { setzen };
}
/* Sandkasten mit vorher angelegten Objekten (Vorgänger, auch mit fremden Schlüsseln für die Gegenprobe) */
function ausfuehrenMit(code, P) {
  const ctx = vm.createContext({});
  vm.runInContext("var window = globalThis;", ctx);
  for (const k of Object.keys(P)) ctx[k] = P[k];
  const namenVor = new Set(Object.getOwnPropertyNames(ctx)), vor = {};
  namenVor.forEach((k) => { vor[k] = ctx[k]; });
  vm.runInContext(code, ctx, { timeout: 60000 });
  return { ctx, namenVor, vor };
}
/* Wirkung einspielen: Pfad für Pfad, fehlende Zwischen-Objekte neu, vorhandene bleiben (so macht es auch der Lader) */
function einspielen(ziel, w) {
  (w.setzen || []).forEach(([pfad, wert]) => {
    let o = ziel;
    for (let i = 0; i < pfad.length - 1; i++) {
      if (!istObjekt(o[pfad[i]])) o[pfad[i]] = {};
      o = o[pfad[i]];
    }
    o[pfad[pfad.length - 1]] = JSON.parse(JSON.stringify(wert));
  });
}
function gleich(a, b, p) {
  if (a === b) return "";
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return p + ": " + String(JSON.stringify(a)).slice(0, 60) + " ≠ " + String(JSON.stringify(b)).slice(0, 60);
  if (Array.isArray(a) !== Array.isArray(b)) return p + ": Feld/Objekt";
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) return p + ": Schlüssel " + ka.slice(0, 4) + " / " + kb.slice(0, 4);
  for (const k of ka) { const e = gleich(a[k], b[k], p + "." + k); if (e) return e; }
  return "";
}
/* „Fremder Vorbestand": jedes Objekt der Wirkung schon da, mit einem fremden Schlüssel (anderer Monat, anderes Thema) */
function fremd(R, tiefe) {
  const p = { __fremd: tiefe };
  if (tiefe > 4) return p;
  for (const k of Object.keys(R)) if (istObjekt(R[k])) p[k] = fremd(R[k], tiefe + 1);
  return p;
}

function pruefen(name) {
  const code = fs.readFileSync(path.join(WURZEL, name), "utf8");
  const t0 = process.hrtime.bigint();
  const lauf = ausfuehren(code);
  const msJs = Number(process.hrtime.bigint() - t0) / 1e6;
  const w = wirkung(code, lauf);
  const fehler = [];
  w.setzen.forEach(([p, x]) => { const e = jsonProblem(x, p.join("."), 0); if (e) fehler.push(e); });
  if (fehler.length) return { name, ok: false, grund: fehler[0], msJs };
  const json = JSON.stringify(w);
  const t1 = process.hrtime.bigint();
  const zurueck = JSON.parse(json);
  const msJson = Number(process.hrtime.bigint() - t1) / 1e6;
  /* Tiefenvergleich 1: leeres window – Datei ausführen = Wirkung einspielen */
  const R = {};
  neueNamen(lauf).forEach((k) => { R[k] = JSON.parse(JSON.stringify(lauf.ctx[k])); });
  const leer = {};
  einspielen(leer, zurueck);
  let abw = gleich(R, leer, "window");
  /* Tiefenvergleich 2: window mit fremdem Vorbestand – was die Datei stehen lässt, lässt auch der Lader stehen */
  if (!abw) {
    const F1 = fremd(R, 0), F2 = JSON.parse(JSON.stringify(F1));
    const l2 = ausfuehrenMit(code, F1);
    const A = {};
    Object.keys(F1).concat(neueNamen(l2)).forEach((k) => { A[k] = JSON.parse(JSON.stringify(l2.ctx[k])); });
    einspielen(F2, zurueck);
    abw = gleich(A, F2, "window(Vorbestand)");
  }
  const hash = crypto.createHash("sha256").update(json).digest("base64url").slice(0, 8);
  return { name, ok: !abw, grund: abw, msJs, msJson, bytesJs: Buffer.byteLength(code), bytesJson: Buffer.byteLength(json), wirkung: zurueck, json, hash,
    pfade: w.setzen.map(([p]) => p.join(".")) };
}

module.exports = { pruefen, kandidaten, einspielen };

if (require.main === module) {
  const a = process.argv.slice(2), schreiben = a.includes("--schreiben");
  const liste = a.filter((x) => !x.startsWith("--"));
  const namen = liste.length ? liste : kandidaten();
  let schlecht = 0;
  for (const n of namen) {
    let r;
    try { r = pruefen(n); } catch (e) { r = { name: n, ok: false, grund: "Fehler: " + String(e.message || e).slice(0, 100) }; }
    if (!r.ok) schlecht++;
    console.log((r.ok ? "  ok   " : "  NEIN ") + n.padEnd(32) + (r.ok
      ? (r.bytesJs / 1024).toFixed(0).padStart(6) + " KB JS → " + (r.bytesJson / 1024).toFixed(0).padStart(6) + " KB JSON   Pfade: " + r.pfade.slice(0, 3).join(", ") + (r.pfade.length > 3 ? " … (" + r.pfade.length + ")" : "")
      : "   " + r.grund));
    if (r.ok && schreiben) {
      const ziel = path.join(WURZEL, "bau", "daten", n.replace(/\.js$/, "").replace(/\//g, "-") + "-" + r.hash + ".json");
      fs.mkdirSync(path.dirname(ziel), { recursive: true });
      fs.writeFileSync(ziel, r.json);
    }
  }
  process.exit(schlecht && liste.length ? 1 : 0);
}
