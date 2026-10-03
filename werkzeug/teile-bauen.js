#!/usr/bin/env node
/* =====================================================================
   FASSUNG 876 — APP.JS IN TEILEN (nur die verkleinerte Kopie in min/)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · „die
   schnelle Performance und die Verbindung zu den anderen haben oberste
   Priorität".

   GEMESSEN (Playwright-Coverage, werkzeug/teile-messen.js): von den rund
   5 MB Quelltext in app.js laufen beim Start, im Klassenzimmer und beim
   Betreten des Raums gut 0,6 MB. Rund 3,5 MB sind Funktionen, die erst
   später gebraucht werden (Chat-Effekte, Reise, Einstellungen, Spiele,
   Postfach …). Trotzdem musste jedes Telefon sie vor dem ersten Tipp
   holen (752 KB gepackt) und übersetzen (0,8 s Rechenzeit).

   JETZT: Die Quelle app.js bleibt EINE Datei – alle Werkzeuge und Sonden
   lesen sie wie bisher, und ?quelle lädt sie wie immer ganz. Nur die
   verkleinerte Kopie min/app.js wird geteilt:
     - Jede Funktion aus werkzeug/app-teile.json wird in min/app.js durch
       einen kurzen Platzhalter mit demselben Namen ersetzt. Ihr Körper
       steht in min/app-teil-<teil>.js.
     - Die Seite holt die Teile nach dem Start in einer Ruhepause, den
       Teil „raum" schon beim Öffnen des Klassenzimmers (app.js,
       dmaTeilHolen).
     - Ruft jemand eine ausgelagerte Funktion, bevor ihr Teil da ist, holt
       der Platzhalter ihn sofort (dmaTeilRuf) – die Funktion läuft genau
       wie vorher, nur beim allerersten Mal etwas später. Nichts geht
       verloren, kein Effekt wird verschluckt.
     - Eingesetzt wird ein Teil mit eval IM INNEREN von app.js
       (dmaTeilAuswerten). So sieht er alle Namen von app.js wie vorher.
       Deshalb lässt esbuild die obersten Namen in min/app.js unverkürzt
       (das kostet gepackt gut 10 KB und spart ein Vielfaches).
     - Was nicht sicher auszulagern ist, bleibt einfach in min/app.js:
       doppelte Namen, Namen, die es nicht (mehr) gibt, alles außer
       Funktionen der obersten Ebene. Neue Funktionen bleiben ebenfalls
       drin, bis werkzeug/teile-messen.js sie neu einordnet.
     - Klappt der Bau nicht (acorn fehlt, Fehler), entsteht min/app.js wie
       bisher ganz – die Seite funktioniert dann wie vor 876.

   AUFRUF
     node werkzeug/teile-bauen.js          baut min/app.js und
                                           min/app-teil-*.js (sonst
                                           macht das fassung-setzen.js)
     node werkzeug/teile-bauen.js --zeigen nur zählen, nichts schreiben
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const WURZEL = path.dirname(__dirname);
const LISTE = path.join(__dirname, "app-teile.json");
const MARKE = "var DMA_TEILE_BAU = null;";
const ESBUILD_OPT = { loader: "js", minify: true, legalComments: "none", charset: "utf8" };

/* Ein Modul suchen wie esbuildHolen in fassung-setzen.js: erst normal, dann im npx-Zwischenspeicher. */
function modulSuchen(name) {
  try { return require(name); } catch (e) {}
  const orte = [];
  try {
    const basis = path.join(require("os").homedir(), ".npm", "_npx");
    fs.readdirSync(basis).forEach((d) => orte.push(path.join(basis, d, "node_modules", name)));
  } catch (e) {}
  orte.push(path.join("/tmp/claude-0/node_modules", name));
  for (const p of orte) {
    try { if (fs.existsSync(path.join(p, "package.json"))) return require(p); } catch (e) {}
  }
  return null;
}
function acornHolen() {
  let a = modulSuchen("acorn");
  if (!a) {
    try {
      require("child_process").execSync("npx --yes -p acorn@8.15.0 node -e 0", { stdio: "ignore", timeout: 180000 });
    } catch (e) {}
    a = modulSuchen("acorn");
  }
  return a;
}
function esbuildHolen() {
  let eb = modulSuchen("esbuild");
  if (!eb) {
    try { require("child_process").execSync("npx --yes esbuild@0.28.2 --version", { stdio: "ignore", timeout: 180000 }); } catch (e) {}
    eb = modulSuchen("esbuild");
  }
  return eb;
}

function listeLesen() {
  const l = JSON.parse(fs.readFileSync(LISTE, "utf8"));
  if (!l || !l.teile || typeof l.teile !== "object") throw new Error("app-teile.json ohne „teile“");
  return l;
}

/* Alle Namen, die auf der obersten Ebene der app.js-Hülle vergeben werden (Funktionen, var/let/const,
   Klassen; „var" auch aus Blöcken, weil es an die Hülle gebunden ist). Ein Name, der zweimal vorkommt,
   wird nie ausgelagert: welche Fassung gilt, hängt dann von der Reihenfolge ab. */
function namenZaehlen(rumpf) {
  const n = {};
  const plus = (x) => { if (x) n[x] = (n[x] || 0) + 1; };
  const muster = (p) => {
    if (!p) return;
    if (p.type === "Identifier") plus(p.name);
    else if (p.type === "ObjectPattern") p.properties.forEach((q) => muster(q.type === "RestElement" ? q.argument : q.value));
    else if (p.type === "ArrayPattern") p.elements.forEach(muster);
    else if (p.type === "AssignmentPattern") muster(p.left);
    else if (p.type === "RestElement") muster(p.argument);
  };
  const gehe = (k, oben) => {
    if (!k || typeof k.type !== "string") return;
    if (k.type === "FunctionDeclaration") { if (oben) plus(k.id && k.id.name); return; }
    if (k.type === "FunctionExpression" || k.type === "ArrowFunctionExpression" || k.type === "ClassExpression") return;
    if (k.type === "ClassDeclaration") { if (oben) plus(k.id && k.id.name); return; }
    if (k.type === "VariableDeclaration") {
      if (k.kind === "var" || oben) k.declarations.forEach((d) => muster(d.id));
    }
    for (const s in k) {
      if (s === "type" || s === "start" || s === "end") continue;
      const w = k[s];
      if (Array.isArray(w)) w.forEach((x) => x && typeof x.type === "string" && gehe(x, false));
      else if (w && typeof w.type === "string") gehe(w, false);
    }
  };
  rumpf.forEach((st) => gehe(st, true));
  return n;
}

/* Kern: aus dem Quelltext von app.js den schlanken Kern und die Teile machen (noch nicht verkleinert). */
function appTeilen(quelle, liste, acorn) {
  if (quelle.indexOf(MARKE) < 0) throw new Error("in app.js fehlt die Zeile „" + MARKE + "“");
  const ast = acorn.parse(quelle, { ecmaVersion: "latest", sourceType: "script" });
  const huelle = ast.body.find((st) => st.type === "ExpressionStatement" && st.expression.type === "CallExpression"
    && st.expression.callee.type === "FunctionExpression");
  if (!huelle) throw new Error("app.js: die äußere Hülle (function () { … })() fehlt");
  const rumpf = huelle.expression.callee.body.body;
  const marke = rumpf.find((st) => st.type === "VariableDeclaration" && st.declarations.length === 1
    && st.declarations[0].id.name === "DMA_TEILE_BAU");
  if (!marke) throw new Error("DMA_TEILE_BAU steht nicht auf der obersten Ebene von app.js");
  const zahl = namenZaehlen(rumpf);
  const teilVon = {};
  const teilNamen = Object.keys(liste.teile).filter((t) => /^[a-z0-9]+$/.test(t));
  teilNamen.forEach((t) => (liste.teile[t] || []).forEach((f) => { if (!teilVon[f]) teilVon[f] = t; }));
  const auswahl = rumpf.filter((st) => st.type === "FunctionDeclaration" && st.id && teilVon[st.id.name]
    && zahl[st.id.name] === 1 && !/^dmaTeil/.test(st.id.name));
  const benutzt = teilNamen.filter((t) => auswahl.some((st) => teilVon[st.id.name] === t));
  const ersatz = [], koerper = {}, fnTeil = [];
  auswahl.forEach((st, i) => {
    const t = teilVon[st.id.name];
    fnTeil.push(benutzt.indexOf(t));
    /* Gleiche Länge (fn.length) wie das Original: Parameter bis zum ersten mit Vorgabe oder „...". */
    let laenge = 0;
    for (const p of st.params) { if (p.type === "AssignmentPattern" || p.type === "RestElement") break; laenge++; }
    const param = Array.from({ length: laenge }, (_, k) => "dmaP" + k).join(", ");
    const ruf = st.async ? "dmaTeilRufA" : "dmaTeilRuf";
    ersatz.push([st.start, st.end, "function " + st.id.name + "(" + param + ") { return " + ruf + "(" + i + ", this, arguments, new.target); }"]);
    /* Der Körper ohne Namen: so meint „lcReise" im Inneren weiter die Funktion der Hülle (den Platzhalter),
       genau wie vorher – Vergleiche, removeEventListener und angehängte Eigenschaften bleiben gleich. */
    const kopf = quelle.slice(st.start, st.id.start).replace(/\s+$/, "");
    (koerper[t] = koerper[t] || []).push("dmaTeilImpl[" + i + "] = " + kopf + " " + quelle.slice(st.id.end, st.end) + ";");
  });
  const kennung = crypto.createHash("sha1").update(quelle).update(JSON.stringify(liste.teile)).update(fs.readFileSync(__filename)).digest("hex").slice(0, 12);
  const bau = { id: kennung, teile: benutzt, fn: fnTeil };
  ersatz.push([marke.start, marke.end, "var DMA_TEILE_BAU = " + JSON.stringify(bau) + ";"]);
  ersatz.sort((a, b) => b[0] - a[0]);
  const stuecke = [];
  let bis = quelle.length;
  for (const [s, e, text] of ersatz) { stuecke.push(quelle.slice(e, bis), text); bis = s; }
  stuecke.push(quelle.slice(0, bis));
  const kern = stuecke.reverse().join("");
  const teile = {};
  benutzt.forEach((t) => { teile[t] = "dmaTeilPasst(" + JSON.stringify(kennung) + ");\n" + koerper[t].join("\n") + "\n"; });
  return { kern, teile, kennung, zahl: auswahl.length,
    fehlend: Object.keys(teilVon).filter((f) => !auswahl.some((st) => st.id.name === f)) };
}

/* Verkleinert Kern und Teile. Gibt null zurück, wenn es nicht geht – dann baut der Aufrufer min/app.js ganz. */
function verkleinertTeilen(quelle, eb, meldung) {
  const sag = meldung || (() => {});
  let liste;
  try { liste = listeLesen(); } catch (e) { sag("app-teile.json nicht lesbar (" + e.message + ") – app.js bleibt ganz"); return null; }
  const acorn = acornHolen();
  if (!acorn) { sag("acorn fehlt – app.js bleibt ganz"); return null; }
  try {
    const r = appTeilen(quelle, liste, acorn);
    const kern = eb.transformSync(r.kern, ESBUILD_OPT).code;
    const teile = {};
    for (const [t, c] of Object.entries(r.teile)) teile[t] = eb.transformSync(c, ESBUILD_OPT).code;
    if (!/\beval\(/.test(kern)) throw new Error("dmaTeilAuswerten fehlt im Kern");
    return { kern, teile, kennung: r.kennung, zahl: r.zahl, fehlend: r.fehlend };
  } catch (e) {
    sag("app.js nicht geteilt (" + String(e.message || e).split("\n")[0] + ") – app.js bleibt ganz");
    return null;
  }
}

/* Prüfsumme über alles, was das Ergebnis bestimmt – für min/.quelle.json. */
function bauSumme(quelle) {
  const h = crypto.createHash("sha1").update(quelle);
  try { h.update(fs.readFileSync(LISTE)); } catch (e) {}
  h.update(fs.readFileSync(__filename));
  return h.digest("hex");
}

/* min/app.js und min/app-teil-*.js schreiben; alte Teile, die es nicht mehr gibt, löschen. */
function schreiben(minOrdner, erg) {
  const alt = fs.readdirSync(minOrdner).filter((n) => /^app-teil-[a-z0-9]+\.js$/.test(n));
  fs.writeFileSync(path.join(minOrdner, "app.js"), erg.kern);
  const neu = Object.keys(erg.teile).map((t) => "app-teil-" + t + ".js");
  Object.entries(erg.teile).forEach(([t, c]) => fs.writeFileSync(path.join(minOrdner, "app-teil-" + t + ".js"), c));
  alt.filter((n) => neu.indexOf(n) < 0).forEach((n) => fs.unlinkSync(path.join(minOrdner, n)));
  return neu;
}
function teileLoeschen(minOrdner) {
  try { fs.readdirSync(minOrdner).filter((n) => /^app-teil-[a-z0-9]+\.js$/.test(n)).forEach((n) => fs.unlinkSync(path.join(minOrdner, n))); } catch (e) {}
}

module.exports = { appTeilen, verkleinertTeilen, bauSumme, schreiben, teileLoeschen, LISTE, MARKE, istTeil: (n) => /^app-teil-[a-z0-9]+\.js$/.test(n) };

if (require.main === module) {
  const zlib = require("zlib");
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const eb = esbuildHolen();
  if (!eb) { console.error("esbuild fehlt"); process.exit(1); }
  const erg = verkleinertTeilen(quelle, eb, (m) => console.error("  " + m));
  if (!erg) process.exit(1);
  const gz = (s) => Math.round(zlib.gzipSync(s, { level: 9 }).length / 1024);
  console.log("ausgelagert: " + erg.zahl + " Funktionen" + (erg.fehlend.length ? ", nicht gefunden/doppelt: " + erg.fehlend.length : ""));
  console.log("min/app.js " + Math.round(erg.kern.length / 1024) + " KB (gepackt " + gz(erg.kern) + " KB)");
  Object.entries(erg.teile).forEach(([t, c]) => console.log("min/app-teil-" + t + ".js " + Math.round(c.length / 1024) + " KB (gepackt " + gz(c) + " KB)"));
  if (process.argv[2] === "--zeigen") process.exit(0);
  const MIN = path.join(WURZEL, "min");
  schreiben(MIN, erg);
  /* min/.quelle.json wie in fassung-setzen.js: app.js gilt als gebaut für genau diesen Stand. */
  const merkPfad = path.join(MIN, ".quelle.json");
  let merk = {};
  try { merk = JSON.parse(fs.readFileSync(merkPfad, "utf8")); } catch (e) {}
  merk["app.js"] = bauSumme(quelle);
  fs.writeFileSync(merkPfad, JSON.stringify(merk, null, 1) + "\n");
  console.log("geschrieben (Stempel setzt fassung-setzen.js beim Ausliefern)");
}
