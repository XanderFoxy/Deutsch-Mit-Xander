#!/usr/bin/env node
/* =====================================================================
   MODUL-UMBAU M3b (MODULE-PLAN.md Abschnitt 3) — ÜBUNGSDATEN JE KATEGORIE, ALS SKRIPT
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk 255):
   „die schnelle Performance und die Verbindung zu den anderen haben oberste
   Priorität".

   „Lernen" wartete bisher auf die ganze Aufgabensammlung (data-uebungen.js,
   6,0 MB verkleinert, 1,2 MB gepackt: 4G ~1,1 s, 3G ~6 s Leitung, dazu
   262 ms Ausführen bei CPU 4× mit einem Langläufer von 75 ms) – obwohl die
   Übersicht ohne gewählte Kategorie gar keine Aufgabe braucht. M3 (JSON)
   war im Browser LANGSAMER als das Skript (Logbuch Modul, M3): der Hebel ist
   die Menge, nicht das Format. Deshalb bleibt es ein Skript (Code-Speicher
   des Browsers), nur je Kategorie eine Datei:

     bau/uebungen/<kategorie>-<hash>.js   eine Kategorie (9–86 KB gepackt)
       ((window.DMA_DATEN=window.DMA_DATEN||{}).ZUSATZ_TEILE=window.DMA_DATEN.ZUSATZ_TEILE||{})["<kategorie>"]=[…];
     bau/uebungen-<hash>.js               das Verzeichnis (~1 KB gepackt)
       (window.DMA_DATEN=window.DMA_DATEN||{}).ZUSATZ_KARTE={"<kategorie>":"<hash>",…};
     index.html: window.DMA_MODUL.uebungen = "bau/uebungen-<hash>.js"

   Der Lader (data-exercises.js, ladeUebungen(ids)) holt das Verzeichnis,
   dann nur die gebrauchten Kategorien; sind alle da, setzt er
   DMA_DATEN.ZUSATZ_FRAGEN in der Reihenfolge des Verzeichnisses zusammen
   (= Reihenfolge der Quelle; die Tagesaufgabe hängt daran). Fehlt ein Teil,
   holt er die ganze Datei wie bisher. Mit ?quelle oder ohne Eintrag in
   DMA_MODUL gilt der alte Weg (ganze Datei).

   BEARBEITET WIRD WEITER data-uebungen.js. Die Teile entstehen daraus vor
   jedem Commit (werkzeug/fassung-setzen.js --nur-stempel ruft bauen()):
     - die Quelle läuft in einem leeren Sandkasten; sie darf nur
       window.DMA_DATEN.ZUSATZ_FRAGEN anlegen, jede Kategorie heißt
       [a-z0-9-] und jeder Wert ist JSON-fähig – sonst KEINE Teile (laut,
       Rückgabe ≠ 0) und DMA_MODUL ohne „uebungen" (die Seite lädt die ganze
       Datei, also nie falsche Daten);
     - Tiefenvergleich: Verzeichnis + alle Teile (in umgekehrter Reihenfolge
       ausgeführt) und nach dem Verzeichnis zusammengesetzt = Quelle, Wert für
       Wert und in derselben Reihenfolge der Schlüssel;
     - Name aus dem Inhalt (sha256 der geschriebenen Bytes, base64url,
       8 Zeichen, wie daten-bauen.js): sw.js gibt bau/…-<8 Zeichen> ohne
       Nachfrage aus dem Speicher, unter einem Namen liegt nie ein anderer
       Inhalt; ändert sich eine Kategorie, bekommt NUR sie einen neuen Namen
       (und das Verzeichnis) – ein Gerät holt nur die geänderte Kategorie;
     - gebaut wird nur, wenn sich Quelle oder dieses Werkzeug geändert haben
       (bau/uebungen-quelle.json) oder eine Datei fehlt;
     - Aufräumen: gelöscht wird nur, was weder das neue Verzeichnis noch einer
       der letzten 3 Commits mit einem Verzeichnis nennt (eine ältere Seite im
       Speicher eines Geräts holt ihre Teile weiter vom Server). Ohne git wird
       nichts gelöscht.

   AUFRUF (allein, zum Nachsehen):  node werkzeug/uebungen-teilen.js [--pruefen]
     --pruefen: nur prüfen und vermessen, nichts schreiben
   Sonde: werkzeug/pruefe-887-daten.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto"), zlib = require("zlib");
const { execFileSync } = require("child_process");

const QUELLE = "data-uebungen.js";
const TEIL_ORDNER = "bau/uebungen";
const KARTE_GRUND = "bau/uebungen";
const MERK = "bau/uebungen-quelle.json";
const NAME = /^[a-z0-9][a-z0-9-]*$/;
const HASH_NAME = /-[A-Za-z0-9_-]{8}\.js$/;

function hashVon(buf) { return crypto.createHash("sha256").update(buf).digest("base64url").slice(0, 8); }
function summe(wurzel) {
  return crypto.createHash("sha1").update(fs.readFileSync(path.join(wurzel, QUELLE))).update("\0").update(fs.readFileSync(__filename)).digest("hex");
}
function jsonLesen(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } }

/* Sandkasten: nur window (= globalThis des Kontexts) */
function sandkasten() {
  const ctx = vm.createContext({});
  vm.runInContext("var window = globalThis;", ctx);
  return ctx;
}
/* JSON-fähig? (Pfad des ersten Problems oder "") – wie daten-bauen.js */
function jsonProblem(x, p, tiefe) {
  if (tiefe > 200) return p + ": zu tief";
  if (x === null || typeof x === "string" || typeof x === "boolean") return "";
  if (typeof x === "number") return isFinite(x) && !Object.is(x, -0) ? "" : p + ": Zahl " + x;
  if (typeof x !== "object") return p + ": " + typeof x;
  if (Array.isArray(x)) {
    for (let i = 0; i < x.length; i++) { if (!(i in x)) return p + "[" + i + "]: Loch"; const e = jsonProblem(x[i], p + "[" + i + "]", tiefe + 1); if (e) return e; }
    return "";
  }
  const proto = Object.getPrototypeOf(x);
  if (proto !== null && Object.getPrototypeOf(proto) !== null) return p + ": kein schlichtes Objekt";
  for (const k of Object.keys(x)) { const e = jsonProblem(x[k], p + "." + k, tiefe + 1); if (e) return e; }
  return "";
}
/* Tiefenvergleich mit Reihenfolge der Schlüssel ("" = gleich) */
function gleich(a, b, p) {
  if (a === b) return "";
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return p + ": " + String(JSON.stringify(a)).slice(0, 60) + " ≠ " + String(JSON.stringify(b)).slice(0, 60);
  if (Array.isArray(a) !== Array.isArray(b)) return p + ": Feld/Objekt";
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) return p + ": Schlüssel " + ka.slice(0, 4) + " / " + kb.slice(0, 4);
  for (const k of ka) { const e = gleich(a[k], b[k], p + "." + k); if (e) return e; }
  return "";
}
/* JSON als JS-Literal: U+2028/U+2029 in Zeichenketten maskieren (ältere Browser lasen sie als Zeilenende) */
function literal(x) { return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029"); }
function teilText(k, wert) {
  return "((window.DMA_DATEN=window.DMA_DATEN||{}).ZUSATZ_TEILE=window.DMA_DATEN.ZUSATZ_TEILE||{})[" + JSON.stringify(k) + "]=" + literal(wert) + ";\n";
}
function karteText(karte) { return "(window.DMA_DATEN=window.DMA_DATEN||{}).ZUSATZ_KARTE=" + JSON.stringify(karte) + ";\n"; }
/* So setzt der Lader zusammen (data-exercises.js, uebZusammen): in der Reihenfolge des Verzeichnisses */
function zusammensetzen(teile, karte) {
  const z = {};
  Object.keys(karte).forEach((k) => { z[k] = teile[k]; });
  return z;
}

/* Quelle ausführen: → { Z, fehler } */
function sammlungLesen(code) {
  const ctx = sandkasten();
  const vor = new Set(Object.getOwnPropertyNames(ctx));
  vm.runInContext(code, ctx, { timeout: 60000, filename: QUELLE });
  const neu = Object.getOwnPropertyNames(ctx).filter((k) => !vor.has(k));
  if (neu.length !== 1 || neu[0] !== "DMA_DATEN") return { fehler: "die Quelle legt mehr als window.DMA_DATEN an: " + neu.join(", ") };
  const D = ctx.DMA_DATEN;
  const dk = Object.keys(D || {});
  if (dk.length !== 1 || dk[0] !== "ZUSATZ_FRAGEN") return { fehler: "window.DMA_DATEN enthält mehr als ZUSATZ_FRAGEN: " + dk.join(", ") };
  /* in die Welt dieses Prozesses holen (Tiefenvergleich ohne fremde Prototypen) */
  const Z = JSON.parse(JSON.stringify(D.ZUSATZ_FRAGEN));
  const roh = D.ZUSATZ_FRAGEN;
  const schlecht = Object.keys(roh).filter((k) => !NAME.test(k) || /^\d+$/.test(k));
  if (schlecht.length) return { fehler: "Kategorie-Namen nicht als Dateiname geeignet: " + schlecht.slice(0, 5).join(", ") };
  for (const k of Object.keys(roh)) {
    if (!Array.isArray(roh[k])) return { fehler: "Kategorie " + k + " ist kein Feld" };
    const e = jsonProblem(roh[k], k, 0);
    if (e) return { fehler: "nicht JSON-fähig: " + e };
  }
  /* JSON-Rundreise muss dasselbe ergeben (sonst stünde in den Teilen etwas anderes) */
  const abw = gleich(JSON.parse(JSON.stringify(roh)), Z, "ZUSATZ_FRAGEN");
  if (abw) return { fehler: "JSON-Rundreise weicht ab: " + abw };
  return { Z };
}

/* Alles im Speicher erzeugen und prüfen: → { karte, karteName, karteBuf, teile: [{k, name, buf}], fehler } */
function erzeugen(wurzel) {
  const code = fs.readFileSync(path.join(wurzel, QUELLE), "utf8");
  const s = sammlungLesen(code);
  if (s.fehler) return { fehler: s.fehler };
  const Z = s.Z, karte = {}, teile = [];
  for (const k of Object.keys(Z)) {
    const buf = Buffer.from(teilText(k, Z[k]), "utf8");
    const h = hashVon(buf);
    karte[k] = h;
    teile.push({ k, name: TEIL_ORDNER + "/" + k + "-" + h + ".js", buf });
  }
  const karteBuf = Buffer.from(karteText(karte), "utf8");
  const karteName = KARTE_GRUND + "-" + hashVon(karteBuf) + ".js";
  /* Tiefenvergleich: Verzeichnis + Teile (umgekehrt ausgeführt, wie sie beim Laden in beliebiger Reihenfolge ankommen)
     im frischen Sandkasten, nach dem Verzeichnis zusammengesetzt = Quelle */
  const ctx = sandkasten();
  vm.runInContext(karteBuf.toString("utf8"), ctx);
  teile.slice().reverse().forEach((t) => vm.runInContext(t.buf.toString("utf8"), ctx, { filename: t.name }));
  const K = JSON.parse(JSON.stringify(ctx.DMA_DATEN.ZUSATZ_KARTE));
  const T = JSON.parse(JSON.stringify(ctx.DMA_DATEN.ZUSATZ_TEILE));
  const abw = gleich(zusammensetzen(T, K), Z, "zusammengesetzt") || gleich(K, karte, "Verzeichnis")
    || (Object.keys(ctx.DMA_DATEN).sort().join(",") !== "ZUSATZ_KARTE,ZUSATZ_TEILE" ? "Teile legen mehr an: " + Object.keys(ctx.DMA_DATEN).join(",") : "");
  if (abw) return { fehler: "Tiefenvergleich: " + abw };
  return { karte, karteName, karteBuf, teile, Z };
}

/* Nie einen Namen mit anderem Inhalt überschreiben; über eine Zwischendatei schreiben und zurückgelesen nachrechnen */
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
    const zurueck = fs.readFileSync(tmp);
    if (!zurueck.equals(buf)) throw new Error("zurückgelesen ≠ geschrieben: " + rel);
    fs.renameSync(tmp, ziel);
  } finally { try { fs.unlinkSync(tmp); } catch (e) {} }
  return true;
}

/* Alle Dateien dieses Werkzeugs im Baum (relativ, mit /) */
function eigeneDateien(wurzel) {
  const l = [];
  const ord = path.join(wurzel, TEIL_ORDNER);
  if (fs.existsSync(ord)) fs.readdirSync(ord).forEach((n) => l.push(TEIL_ORDNER + "/" + n));
  const bau = path.join(wurzel, "bau");
  if (fs.existsSync(bau)) fs.readdirSync(bau).filter((n) => /^uebungen-[A-Za-z0-9_-]{8}\.js$/.test(n)).forEach((n) => l.push("bau/" + n));
  return l.sort();
}
/* Was die letzten n Commits mit einem Verzeichnis enthielten (null: kein git) */
function gitBehalten(wurzel, n) {
  const git = (a) => execFileSync("git", ["-C", wurzel].concat(a), { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }).toString("utf8");
  try {
    if (!fs.existsSync(path.join(wurzel, ".git"))) return null;
    const s = new Set();
    git(["log", "-n", String(n), "--format=%H", "--", "bau/uebungen-*.js"]).split("\n").filter(Boolean).forEach((h) => {
      git(["ls-tree", "-r", "--name-only", h, "--", "bau"]).split("\n").filter(Boolean)
        .filter((p) => p.indexOf(TEIL_ORDNER + "/") === 0 || /^bau\/uebungen-[A-Za-z0-9_-]{8}\.js$/.test(p)).forEach((p) => s.add(p));
    });
    return s;
  } catch (e) { return null; }
}

/* → { eintrag: "bau/uebungen-XXXXXXXX.js" | null, gebaut, neu, geloescht, fehler }
   eintrag null + fehler: DMA_MODUL bekommt KEIN „uebungen" (die Seite lädt die ganze Datei) */
function bauen(wurzel) {
  if (!fs.existsSync(path.join(wurzel, QUELLE))) return { eintrag: null, gebaut: false, neu: 0, geloescht: 0, fehler: null };
  const s = summe(wurzel);
  const merk = jsonLesen(path.join(wurzel, MERK)) || {};
  let eintrag = null, gebaut = false, neu = 0;
  const vollstaendig = () => {
    if (!merk.karte || !fs.existsSync(path.join(wurzel, merk.karte))) return false;
    const K = karteAusDatei(path.join(wurzel, merk.karte));
    return Boolean(K) && Object.keys(K).every((k) => fs.existsSync(path.join(wurzel, TEIL_ORDNER, k + "-" + K[k] + ".js")));
  };
  if (merk.summe === s && vollstaendig()) eintrag = merk.karte;
  else {
    let e;
    try { e = erzeugen(wurzel); } catch (x) { e = { fehler: String(x.message || x).split("\n")[0] }; }
    if (e.fehler) return { eintrag: null, gebaut: false, neu: 0, geloescht: 0, fehler: e.fehler };
    try {
      /* erst alle Teile, dann das Verzeichnis, zuletzt der Merkzettel */
      e.teile.forEach((t) => { if (schreiben(wurzel, t.name, t.buf)) neu++; });
      if (schreiben(wurzel, e.karteName, e.karteBuf)) neu++;
      fs.writeFileSync(path.join(wurzel, MERK), JSON.stringify({ summe: s, karte: e.karteName, teile: e.teile.length }, null, 1) + "\n");
    } catch (x) { return { eintrag: null, gebaut: false, neu, geloescht: 0, fehler: String(x.message || x).split("\n")[0] }; }
    eintrag = e.karteName; gebaut = true;
  }
  /* Aufräumen */
  let geloescht = 0;
  const alt = gitBehalten(wurzel, 3);
  if (alt) {
    const K = karteAusDatei(path.join(wurzel, eintrag)) || {};
    const behalten = new Set([eintrag].concat(Object.keys(K).map((k) => TEIL_ORDNER + "/" + k + "-" + K[k] + ".js")));
    alt.forEach((p) => behalten.add(p));
    eigeneDateien(wurzel).forEach((p) => {
      if (HASH_NAME.test(p) && !behalten.has(p)) { fs.unlinkSync(path.join(wurzel, p)); geloescht++; }
    });
  }
  return { eintrag, gebaut, neu, geloescht, fehler: null };
}

/* Verzeichnis aus einer Datei lesen (im Sandkasten ausgeführt) */
function karteAusDatei(f) {
  try {
    const ctx = sandkasten();
    vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { timeout: 5000 });
    return JSON.parse(JSON.stringify(ctx.DMA_DATEN.ZUSATZ_KARTE));
  } catch (e) { return null; }
}

module.exports = { bauen, erzeugen, sammlungLesen, teilText, karteText, karteAusDatei, zusammensetzen, gleich, hashVon, summe,
  eigeneDateien, QUELLE, TEIL_ORDNER, KARTE_GRUND, MERK };

if (require.main === module) {
  const w = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
  if (process.argv.includes("--pruefen")) {
    const t0 = Date.now();
    const e = erzeugen(w);
    if (e.fehler) { console.error("NEIN: " + e.fehler); process.exit(1); }
    const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
    const g = e.teile.map((t) => gz(t.buf)).sort((a, b) => a - b);
    const roh = e.teile.reduce((s, t) => s + t.buf.length, 0);
    console.log("ok: " + e.teile.length + " Teile, zusammen " + Math.round(roh / 1024) + " KB (gepackt " + Math.round(g.reduce((a, b) => a + b, 0) / 1024) + " KB; Median "
      + Math.round(g[g.length >> 1] / 1024) + " KB, größter " + Math.round(g[g.length - 1] / 1024) + " KB), Verzeichnis " + e.karteBuf.length + " B (gepackt " + gz(e.karteBuf)
      + " B) " + e.karteName + ", Tiefenvergleich gleich, " + (Date.now() - t0) + " ms");
    process.exit(0);
  }
  const r = bauen(w);
  if (r.fehler) { console.error("ÜBUNGSTEILE: " + r.fehler); process.exit(2); }
  console.log((r.gebaut ? "neu gebaut: " : "unverändert: ") + r.eintrag + " (" + r.neu + " Dateien neu" + (r.geloescht ? ", " + r.geloescht + " alte gelöscht" : "") + ")");
}
