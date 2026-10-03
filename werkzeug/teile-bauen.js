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
       steht in einem Stück min/app-teil-raum<N>.js bzw. -rest<N>.js (je
       etwa 250 000 Zeichen Quelltext, in der Reihenfolge der Datei).
     - Reine Datenblöcke („const"), die nur ausgelagerte Funktionen
       desselben Stücks lesen, wandern mit (im Kern bleibt „var NAME;").
     - Die Seite holt die Stücke nach dem Start über die Leitung und setzt
       sie ab 3 s nach dem Laden in Ruhepausen ein; die Raum-Stücke schon
       beim Öffnen des Klassenzimmers (app.js, dmaTeilGruppe).
     - data-exercises.js: große Datenblöcke, die nur Funktionen lesen, die
       beim Start nicht laufen, stehen in min/data-exercises-teil.js; jede
       lesende Stelle fragt vorher dmaUebTeil() (datenTeilen, Liste
       „daten" in app-teile.json).
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
     node werkzeug/teile-bauen.js          baut min/app.js, min/app-teil-*.js,
                                           min/data-exercises.js und
                                           min/data-exercises-teil.js (sonst
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
  /* Jede Gruppe (raum, rest) in Stücke von etwa STUECK Zeichen Quelltext, in der Reihenfolge der Datei (was
     nebeneinander steht, gehört meist zusammen). Kleine Stücke: das Einsetzen hält nie lange auf, und braucht
     ein Tipp früh eine Funktion, wird nur ihr Stück eingesetzt. */
  const STUECK = 250000;
  const gruppeVon = {};
  auswahl.forEach((st) => { gruppeVon[st.id.name] = teilVon[st.id.name]; });
  const stueckZahl = {}, stueckGroesse = {};
  auswahl.forEach((st) => {
    const g = gruppeVon[st.id.name];
    if (!stueckZahl[g] || stueckGroesse[g] >= STUECK) { stueckZahl[g] = (stueckZahl[g] || 0) + 1; stueckGroesse[g] = 0; }
    stueckGroesse[g] += st.end - st.start;
    teilVon[st.id.name] = g + stueckZahl[g];
  });
  const benutzt = [];
  teilNamen.forEach((g) => { for (let k = 1; k <= (stueckZahl[g] || 0); k++) benutzt.push(g + k); });
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
  /* Daten, die NUR ausgelagerte Funktionen eines Teils lesen (z. B. LC_PLATZ_SPIELZEUG), wandern mit in diesen Teil.
     Bedingungen (sonst bleiben sie, wo sie sind): „const" mit einem Namen, der nur einmal vorkommt; der Wert sind
     reine Daten (Zahlen, Texte, Listen, Objekte, Funktionen – kein Name, der beim Anlegen gelesen würde); jede
     Stelle, die den Namen nennt, liegt in einer ausgelagerten Funktion DESSELBEN Teils. Im Kern bleibt „var NAME;"
     stehen (var: kein Fehler, falls ein Teil früh gebraucht und eingesetzt wird). */
  const fnBereich = auswahl.map((st) => [st.start, st.end, teilVon[st.id.name]]).sort((a, b) => a[0] - b[0]);
  const teilAn = (pos) => {
    let lo = 0, hi = fnBereich.length - 1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (fnBereich[m][1] <= pos) lo = m + 1; else if (fnBereich[m][0] > pos) hi = m - 1; else return fnBereich[m][2]; }
    return null;
  };
  const kandidat = {};
  rumpf.forEach((st) => {
    if (st.type !== "VariableDeclaration" || st.kind !== "const" || st.declarations.length !== 1) return;
    const d = st.declarations[0];
    if (d.id.type !== "Identifier" || zahl[d.id.name] !== 1 || !reineDaten(d.init) || /^(dmaTeil|DMA_TEILE)/.test(d.id.name)) return;
    kandidat[d.id.name] = { st, decl: d.id, teil: undefined, ok: true };
  });
  namenNennungen(huelle.expression.callee.body, (name, knoten) => {
    const k = kandidat[name];
    if (!k || !k.ok || knoten === k.decl) return;
    const t = teilAn(knoten.start);
    if (!t || (k.teil !== undefined && k.teil !== t)) { k.ok = false; return; }
    k.teil = t;
  });
  const daten = Object.values(kandidat).filter((k) => k.ok && k.teil);
  daten.forEach((k) => {
    ersatz.push([k.st.start, k.st.end, "var " + k.decl.name + ";"]);
    (koerper[k.teil] = koerper[k.teil] || []).unshift(k.decl.name + " = " + quelle.slice(k.st.declarations[0].init.start, k.st.declarations[0].init.end) + ";");
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
  return { kern, teile, kennung, zahl: auswahl.length, daten: daten.length,
    fehlend: Object.keys(teilVon).filter((f) => !auswahl.some((st) => st.id.name === f)) };
}

/* Reine Daten: beim Anlegen wird kein Name gelesen und nichts aufgerufen (Funktionen im Wert laufen erst später). */
function reineDaten(n) {
  if (!n) return false;
  switch (n.type) {
    case "Literal": return true;
    case "TemplateLiteral": return n.expressions.length === 0;
    case "ArrayExpression": return n.elements.every((e) => e && e.type !== "SpreadElement" && reineDaten(e));
    case "ObjectExpression": return n.properties.every((p) => p.type === "Property" && !p.computed && p.kind === "init" && !p.shorthand && reineDaten(p.value));
    case "UnaryExpression": return n.operator === "-" || n.operator === "+" || n.operator === "!" ? reineDaten(n.argument) : false;
    case "BinaryExpression": return reineDaten(n.left) && reineDaten(n.right);
    case "ArrowFunctionExpression": case "FunctionExpression": return true;
    default: return false;
  }
}
/* Jede Stelle, an der ein Name als Name steht (nicht als Eigenschaft „a.name" oder Schlüssel „{ name: … }").
   Vorsichtig gezählt: auch ein gleichnamiger lokaler Name zählt mit – dann bleibt die Konstante eben im Kern. */
function namenNennungen(wurzel, melde) {
  (function gehe(k, eltern, feld) {
    if (!k || typeof k.type !== "string") return;
    if (k.type === "Identifier") {
      if (eltern && eltern.type === "MemberExpression" && feld === "property" && !eltern.computed) return;
      if (eltern && (eltern.type === "Property" || eltern.type === "MethodDefinition" || eltern.type === "PropertyDefinition") && feld === "key" && !eltern.computed) {
        if (!(eltern.type === "Property" && eltern.shorthand)) return;
      }
      if (eltern && (eltern.type === "LabeledStatement" || eltern.type === "BreakStatement" || eltern.type === "ContinueStatement") && feld === "label") return;
      melde(k.name, k);
      return;
    }
    for (const f in k) {
      if (f === "type" || f === "start" || f === "end" || f === "loc" || f === "range") continue;
      const w = k[f];
      if (Array.isArray(w)) w.forEach((x) => x && typeof x.type === "string" && gehe(x, k, f));
      else if (w && typeof w.type === "string") gehe(w, k, f);
    }
  })(wurzel, null, null);
}

/* =====================================================================
   DATEN AUSLAGERN (data-exercises.js)
   ---------------------------------------------------------------------
   Große Datenblöcke (Deutschland-Quiz, Wortschatz-Themen, Lückentexte …),
   die nur in Funktionen gelesen werden, die beim Start nicht laufen,
   kommen nach min/<datei>-teil.js. Jede Stelle, die so einen Namen liest,
   wird in der verkleinerten Kopie zu „(dmaUebTeil(), NAME)": vor dem
   ersten Lesen ist der Teil dann da (vorgeladen in der Ruhepause, sonst
   sofort geholt). In der Quelle ändert sich nichts.
   Bedingungen wie oben (reine Daten, Name nur einmal), dazu: keine
   Stelle auf der obersten Ebene (außerhalb jeder Funktion), sonst wäre
   der Name schon beim Laden der Datei gefragt.
   ===================================================================== */
function datenTeilen(quelle, namen, acorn, o) {
  if (quelle.indexOf(o.marke) < 0) throw new Error("es fehlt die Zeile „" + o.marke + "“");
  const ast = acorn.parse(quelle, { ecmaVersion: "latest", sourceType: "script" });
  let huelle = null;
  ast.body.forEach((st) => {
    const c = st.type === "ExpressionStatement" ? st.expression
      : st.type === "VariableDeclaration" && st.declarations.length === 1 ? st.declarations[0].init : null;
    if (!huelle && c && c.type === "CallExpression" && c.callee.type === "FunctionExpression") huelle = c.callee;
  });
  if (!huelle) throw new Error("keine äußere Hülle (function () { … })()");
  const rumpf = huelle.body.body;
  const marke = rumpf.find((st) => st.type === "VariableDeclaration" && st.declarations.length === 1 && st.declarations[0].id.name === o.bauName);
  if (!marke) throw new Error(o.bauName + " steht nicht auf der obersten Ebene");
  const zahl = namenZaehlen(rumpf);
  const gewuenscht = new Set(namen || []);
  const kandidat = {};
  rumpf.forEach((st) => {
    if (st.type !== "VariableDeclaration" || st.kind !== "const" || st.declarations.length !== 1) return;
    const d = st.declarations[0];
    if (d.id.type !== "Identifier" || !gewuenscht.has(d.id.name) || zahl[d.id.name] !== 1 || !reineDaten(d.init)) return;
    kandidat[d.id.name] = { st, decl: d.id, ok: true, stellen: [] };
  });
  (function gehe(k, eltern, feld, inFn, imMuster) {
    if (!k || typeof k.type !== "string") return;
    if (k.type === "Identifier") {
      const kd = kandidat[k.name];
      if (!kd || k === kd.decl) return;
      /* Derselbe Name als eigener, lokaler Name (Parameter, Muster, catch, Funktions- oder Klassenname): nicht anfassen */
      if (imMuster || (eltern && ((/Function/.test(eltern.type) && (feld === "params" || feld === "id"))
        || (eltern.type === "CatchClause" && feld === "param") || (/^Class/.test(eltern.type) && feld === "id")))) { kd.ok = false; return; }
      if (eltern && eltern.type === "MemberExpression" && feld === "property" && !eltern.computed) return;
      if (eltern && (eltern.type === "Property" || eltern.type === "MethodDefinition" || eltern.type === "PropertyDefinition") && feld === "key" && !eltern.computed && !(eltern.type === "Property" && eltern.shorthand)) return;
      if (eltern && /^(LabeledStatement|BreakStatement|ContinueStatement)$/.test(eltern.type) && feld === "label") return;
      if (!inFn) { kd.ok = false; return; }
      /* Schreiben (a = …, a++) oder als Muster: dann nicht anfassen */
      if (eltern && ((eltern.type === "AssignmentExpression" && feld === "left") || eltern.type === "UpdateExpression"
        || (eltern.type === "VariableDeclarator" && feld === "id") || (/Pattern$/.test(eltern.type) && !(eltern.type === "AssignmentPattern" && feld === "right"))
        || eltern.type === "RestElement" || ((eltern.type === "ForInStatement" || eltern.type === "ForOfStatement") && feld === "left"))) { kd.ok = false; return; }
      if (eltern && eltern.type === "Property" && eltern.shorthand) kd.stellen.push({ start: eltern.start, end: eltern.end, kurz: true });
      else kd.stellen.push({ start: k.start, end: k.end, kurz: false });
      return;
    }
    const fn = /Function/.test(k.type);
    for (const f in k) {
      if (f === "type" || f === "start" || f === "end") continue;
      const w = k[f];
      /* Muster: links in Deklarationen und Zuweisungen, Parameter */
      const muster = imMuster || k.type === "ObjectPattern" || k.type === "ArrayPattern"
        || (k.type === "VariableDeclarator" && f === "id") || (fn && f === "params") || (k.type === "CatchClause" && f === "param");
      const m2 = (k.type === "AssignmentPattern" && f === "right") || (k.type === "Property" && f === "key" && k.computed) ? imMuster && false : muster;
      if (Array.isArray(w)) w.forEach((x) => x && typeof x.type === "string" && gehe(x, k, f, inFn || fn, m2));
      else if (w && typeof w.type === "string") gehe(w, k, f, inFn || fn, m2);
    }
  })(huelle.body, null, null, false, false);
  const daten = Object.values(kandidat).filter((k) => k.ok && k.stellen.length);
  if (!daten.length) return null;
  const kennung = crypto.createHash("sha1").update(quelle).update(JSON.stringify(namen)).update(fs.readFileSync(__filename)).digest("hex").slice(0, 12);
  const ersatz = [];
  const gesehen = new Set();
  daten.forEach((k) => {
    ersatz.push([k.st.start, k.st.end, "var " + k.decl.name + ";"]);
    k.stellen.forEach((x) => {
      const schl = x.start + ":" + x.end;
      if (gesehen.has(schl)) return;   /* Kurzform { X }: Schlüssel und Wert sind dieselbe Stelle */
      gesehen.add(schl);
      ersatz.push([x.start, x.end, x.kurz ? k.decl.name + ": (" + o.ruf + "(), " + k.decl.name + ")" : "(" + o.ruf + "(), " + k.decl.name + ")"]);
    });
  });
  ersatz.push([marke.start, marke.end, "var " + o.bauName + " = " + JSON.stringify({ id: kennung, datei: o.datei }) + ";"]);
  ersatz.sort((a, b) => b[0] - a[0]);
  for (let i = 1; i < ersatz.length; i++) if (ersatz[i][1] > ersatz[i - 1][0]) throw new Error("überlappende Stellen");
  const stuecke = [];
  let bis = quelle.length;
  for (const [s0, e, text] of ersatz) { stuecke.push(quelle.slice(e, bis), text); bis = s0; }
  stuecke.push(quelle.slice(0, bis));
  const teil = o.passt + "(" + JSON.stringify(kennung) + ");\n"
    + daten.map((k) => k.decl.name + " = " + quelle.slice(k.st.declarations[0].init.start, k.st.declarations[0].init.end) + ";").join("\n") + "\n";
  return { kern: stuecke.reverse().join(""), teil, kennung, zahl: daten.length, namen: daten.map((k) => k.decl.name) };
}
const UEBUNG = { datei: "min/data-exercises-teil.js", marke: "var DMA_UEB_BAU = null;", bauName: "DMA_UEB_BAU", ruf: "dmaUebTeil", passt: "dmaUebPasst" };
/* Für fassung-setzen.js: data-exercises.js verkleinert und geteilt, oder null (dann wie bisher ganz). */
function uebungTeilen(quelle, eb, meldung) {
  const sag = meldung || (() => {});
  let liste;
  try { liste = listeLesen(); } catch (e) { return null; }
  const namen = liste.daten && liste.daten["data-exercises.js"];
  if (!namen || !namen.length) return null;
  const acorn = acornHolen();
  if (!acorn) { sag("acorn fehlt – data-exercises.js bleibt ganz"); return null; }
  try {
    const r = datenTeilen(quelle, namen, acorn, UEBUNG);
    if (!r) return null;
    const kern = eb.transformSync(r.kern, ESBUILD_OPT).code;
    const teil = eb.transformSync(r.teil, ESBUILD_OPT).code + "//# sourceURL=" + UEBUNG.datei + "\n";
    if (!/\beval\(/.test(kern)) throw new Error("dmaUebAuswerten fehlt im Kern");
    return { kern, teil, zahl: r.zahl, namen: r.namen };
  } catch (e) {
    sag("data-exercises.js nicht geteilt (" + String(e.message || e).split("\n")[0] + ") – bleibt ganz");
    return null;
  }
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
    /* sourceURL: in Fehlermeldungen und im Entwicklerwerkzeug heißt der Teil dann wie seine Datei */
    for (const [t, c] of Object.entries(r.teile)) teile[t] = eb.transformSync(c, ESBUILD_OPT).code + "//# sourceURL=min/app-teil-" + t + ".js\n";
    if (!/\beval\(/.test(kern)) throw new Error("dmaTeilAuswerten fehlt im Kern");
    return { kern, teile, kennung: r.kennung, zahl: r.zahl, daten: r.daten, fehlend: r.fehlend };
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

/* Neu schreiben statt überschreiben (neue Datei, dann umbenennen): eine harte Verknüpfung auf die alte Datei
   (Vergleichskopien) bleibt so, wie sie war. */
function ersetzen(ziel, inhalt) {
  const tmp = ziel + ".neu-" + process.pid;
  fs.writeFileSync(tmp, inhalt);
  fs.renameSync(tmp, ziel);
}
/* min/app.js und min/app-teil-*.js schreiben; alte Teile, die es nicht mehr gibt, löschen. */
function schreiben(minOrdner, erg) {
  const alt = fs.readdirSync(minOrdner).filter((n) => /^app-teil-[a-z0-9]+\.js$/.test(n));
  ersetzen(path.join(minOrdner, "app.js"), erg.kern);
  const neu = Object.keys(erg.teile).map((t) => "app-teil-" + t + ".js");
  Object.entries(erg.teile).forEach(([t, c]) => ersetzen(path.join(minOrdner, "app-teil-" + t + ".js"), c));
  alt.filter((n) => neu.indexOf(n) < 0).forEach((n) => fs.unlinkSync(path.join(minOrdner, n)));
  return neu;
}
function teileLoeschen(minOrdner) {
  try { fs.readdirSync(minOrdner).filter((n) => /^app-teil-[a-z0-9]+\.js$/.test(n)).forEach((n) => fs.unlinkSync(path.join(minOrdner, n))); } catch (e) {}
}

module.exports = { ersetzen, uebungTeilen, datenTeilen, UEBUNG, acornHolen, esbuildHolen, appTeilen, verkleinertTeilen, bauSumme, schreiben, teileLoeschen, LISTE, MARKE, istTeil: (n) => /^app-teil-[a-z0-9]+\.js$/.test(n) };

if (require.main === module) {
  const zlib = require("zlib");
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const eb = esbuildHolen();
  if (!eb) { console.error("esbuild fehlt"); process.exit(1); }
  const erg = verkleinertTeilen(quelle, eb, (m) => console.error("  " + m));
  if (!erg) process.exit(1);
  const gz = (s) => Math.round(zlib.gzipSync(s, { level: 9 }).length / 1024);
  console.log("ausgelagert: " + erg.zahl + " Funktionen, " + erg.daten + " Datenblöcke" + (erg.fehlend.length ? ", nicht gefunden/doppelt: " + erg.fehlend.length : ""));
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
  /* data-exercises.js genauso (Datenblöcke nach min/data-exercises-teil.js) */
  const uQuelle = fs.readFileSync(path.join(WURZEL, "data-exercises.js"), "utf8");
  const u = uebungTeilen(uQuelle, eb, (m) => console.error("  " + m));
  if (u) {
    ersetzen(path.join(MIN, "data-exercises.js"), u.kern);
    ersetzen(path.join(MIN, "data-exercises-teil.js"), u.teil);
    merk["data-exercises.js"] = bauSumme(uQuelle);
    console.log("min/data-exercises.js " + Math.round(u.kern.length / 1024) + " KB (gepackt " + gz(u.kern) + " KB), Teil "
      + Math.round(u.teil.length / 1024) + " KB (gepackt " + gz(u.teil) + " KB), " + u.zahl + " Datenblöcke");
  }
  fs.writeFileSync(merkPfad, JSON.stringify(merk, null, 1) + "\n");
  console.log("geschrieben (Stempel setzt fassung-setzen.js beim Ausliefern)");
}
