#!/usr/bin/env node
/* =====================================================================
   MODUL-UMBAU M4 (MODULE-PLAN.md Abschnitt 3) — EINE GRUPPE AUS app.js
   IN EIN MODUL ZIEHEN
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung".
   Nimmt die Deklarationen einer Gruppe (Funktionen, const/let) von der
   obersten Ebene der app.js-Hülle – samt dem Kommentar davor – und
   schreibt sie unverändert (zwei Leerzeichen weniger eingerückt; Zeilen,
   die in einem String beginnen – mehrzeilige Template-Literale –, bleiben
   genau, wie sie sind) nach src/app/<gruppe>.js. In app.js bleibt an der Stelle der ersten
   Deklaration ein Block dünner Weiterleitungen, aber nur für die Namen,
   die der Rest von app.js wirklich ruft:
       function tutorRufen(bereich, nochmal) { return dmaModul("tutorRufen", arguments); }
   dmaModul (app.js) ruft <name> aus der Tabelle DMA_BRUECKE.fn, die
   src/bruecke.js anlegt (dort kommen die Eingänge auch auf window – nie
   über einen fremden Wert). Was das Modul aus app.js braucht (showToast …), bekommt
   es über window.DMA_APP – als kleine Helfer oben im Modul, die erst
   beim Aufruf nachsehen (das Modul läuft VOR app.js).
   Anweisungen, die keine Deklaration sind (Ohren am Dokument, Zeitgeber),
   zieht das Werkzeug nicht: sie bleiben, wo sie sind, und rufen die
   Weiterleitung – so bleibt die Reihenfolge am Dokument dieselbe.
   Abgelehnt (Fehler, nichts wird geschrieben): ein Name fehlt oder steht
   nicht auf der obersten Ebene, eine Deklaration nennt Namen aus und
   außerhalb der Gruppe, das Modul liest eine VARIABLE von app.js (nur
   Funktionen gehen über window.DMA_APP), oder app.js liest/schreibt eine
   Variable der Gruppe (nur Funktionen bekommen Weiterleitungen).

   AUFRUF
     node werkzeug/app-modul-ziehen.js <gruppe.json>            zeigt nur
     node werkzeug/app-modul-ziehen.js <gruppe.json> --schreiben
     node werkzeug/app-modul-ziehen.js <gruppe.json> --pruefen <alte app.js>
                  vergleicht src/app/<gruppe>.js mit der alten app.js
   gruppe.json: { "gruppe": "tutor", "namen": [...],
                  "ersatz": { "tutorAn": "false" },     Rückgabe ohne Modul
                  "kopf": "Text für den Kopf des Moduls" }
   Ohne Eintrag in „ersatz" wird ein Ruf ohne Modul gemerkt und nachgeholt,
   sobald es da ist (dmaModulNachholen in app.js).
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));

function namenDerAnweisung(st) {
  if (st.type === "FunctionDeclaration" || st.type === "ClassDeclaration") return [st.id.name];
  if (st.type === "VariableDeclaration") return st.declarations.map((d) => (d.id.type === "Identifier" ? d.id.name : "?muster"));
  return [];
}
/* Jede Stelle, an der ein Name als Name steht (nicht a.name, nicht { name: … }) */
function nennungen(knoten, melde) {
  (function gehe(k, eltern, feld) {
    if (!k || typeof k.type !== "string") return;
    if (k.type === "Identifier") {
      if (eltern && eltern.type === "MemberExpression" && feld === "property" && !eltern.computed) return;
      if (eltern && (eltern.type === "Property" || eltern.type === "MethodDefinition" || eltern.type === "PropertyDefinition")
        && feld === "key" && !eltern.computed && !(eltern.type === "Property" && eltern.shorthand)) return;
      if (eltern && /^(LabeledStatement|BreakStatement|ContinueStatement)$/.test(eltern.type) && feld === "label") return;
      melde(k.name, k, eltern, feld);
      return;
    }
    for (const f in k) {
      if (f === "type" || f === "start" || f === "end" || f === "loc") continue;
      const w = k[f];
      if (Array.isArray(w)) w.forEach((x) => x && typeof x.type === "string" && gehe(x, k, f));
      else if (w && typeof w.type === "string") gehe(w, k, f);
    }
  })(knoten, null, null);
}
/* Die eigenen (lokalen) Namen einer Funktion/eines Blocks sind hier egal: gefragt ist nur, ob ein Name der obersten
   Ebene gemeint sein KANN. Vorsichtig gezählt – ein gleichnamiger lokaler Name zählt mit (wie teile-bauen.js). */

/* Wo im Text Strings über das Zeilenende gehen: [Anfang, Ende) jedes Template-Teils (TemplateElement, ohne ${…})
   und jedes String-Literals mit Zeilenumbruch. Eine Zeile, die darin beginnt, wird nicht ausgerückt. */
function stringSpannen(anweisungen) {
  const sp = [];
  (function gehe(k) {
    if (!k || typeof k.type !== "string") return;
    if (k.type === "TemplateElement") sp.push([k.start, k.end]);
    else if (k.type === "Literal" && typeof k.value === "string" && /[\n\r\u2028\u2029]/.test(k.raw || "")) sp.push([k.start, k.end]);
    for (const f in k) {
      if (f === "type" || f === "start" || f === "end" || f === "loc") continue;
      const w = k[f];
      if (Array.isArray(w)) w.forEach(gehe); else if (w && typeof w.type === "string") gehe(w);
    }
  })({ type: "Programm", body: anweisungen });
  return sp;
}
function ausruecken(quelle, a, e, inString) {
  let aus = "", p = a;
  while (p < e) {
    const n = quelle.indexOf("\n", p), z = n < 0 || n >= e ? e : n + 1;
    const zeile = quelle.slice(p, z);
    const drin = inString.some(([s, t]) => s < p && p <= t);
    aus += !drin && zeile.startsWith("  ") ? zeile.slice(2) : zeile;
    p = z;
  }
  return aus;
}

function ziehen(gruppe, quelle, acorn) {
  const ast = acorn.parse(quelle, { ecmaVersion: "latest", sourceType: "script" });
  const huelle = ast.body.find((st) => st.type === "ExpressionStatement" && st.expression.type === "CallExpression"
    && st.expression.callee.type === "FunctionExpression");
  if (!huelle) throw new Error("app.js: die äußere Hülle fehlt");
  const koerper = huelle.expression.callee.body;
  const rumpf = koerper.body;
  const namen = new Set(gruppe.namen);
  const oben = new Map();
  rumpf.forEach((st) => namenDerAnweisung(st).forEach((n) => oben.set(n, st)));
  const fehlt = gruppe.namen.filter((n) => !oben.has(n));
  if (fehlt.length) throw new Error("nicht auf der obersten Ebene von app.js: " + fehlt.join(", "));
  const gezogen = rumpf.filter((st) => { const d = namenDerAnweisung(st); return d.length && d.every((n) => namen.has(n)); });
  const halb = rumpf.filter((st) => { const d = namenDerAnweisung(st); return d.some((n) => namen.has(n)) && !d.every((n) => namen.has(n)); });
  if (halb.length) throw new Error("Deklaration mit Namen aus und außerhalb der Gruppe: " + halb.map((s) => namenDerAnweisung(s).join(",")).join(" | "));
  const istGezogen = new Set(gezogen);
  /* Was das Modul aus app.js braucht – nur Funktionen gehen */
  const braucht = new Set(), problem = [];
  gezogen.forEach((st) => nennungen(st, (n) => {
    if (!oben.has(n) || namen.has(n)) return;
    const d = oben.get(n);
    if (d.type === "FunctionDeclaration") braucht.add(n);
    else problem.push("das Modul liest die Variable " + n + " von app.js (" + d.type + ")");
  }));
  /* Was der Rest von app.js aus der Gruppe ruft – nur Funktionen bekommen eine Weiterleitung */
  const eingang = new Set();
  rumpf.filter((st) => !istGezogen.has(st)).forEach((st) => nennungen(st, (n) => {
    if (!namen.has(n)) return;
    const d = oben.get(n);
    if (d.type === "FunctionDeclaration") eingang.add(n);
    else problem.push("app.js nennt die Variable " + n + " der Gruppe");
  }));
  if (problem.length) throw new Error([...new Set(problem)].join("\n  "));
  /* Spannen: vom Zeilenanfang nach der vorigen Anweisung (also mit dem Kommentar davor) bis zum Zeilenende */
  const zeilenEnde = (pos) => { const i = quelle.indexOf("\n", pos); return i < 0 ? quelle.length : i + 1; };
  const spannen = [];
  rumpf.forEach((st, i) => {
    if (!istGezogen.has(st)) return;
    const vorEnde = i > 0 ? rumpf[i - 1].end : koerper.start + 1;
    const a = zeilenEnde(vorEnde);
    const e = zeilenEnde(st.end);
    if (i + 1 < rumpf.length && rumpf[i + 1].start < e) throw new Error("hinter " + namenDerAnweisung(st).join(",") + " steht auf derselben Zeile noch Code");
    if (a > st.start) throw new Error("vor " + namenDerAnweisung(st).join(",") + " steht auf derselben Zeile noch Code");
    spannen.push([a, e, st]);
  });
  /* Weiterleitungen (Parameter bis zum ersten mit Vorgabe oder „…", wie teile-bauen.js – gleiche fn.length) */
  const ersatz = gruppe.ersatz || {};
  const weiter = [...eingang].sort((x, y) => oben.get(x).start - oben.get(y).start).map((n) => {
    const st = oben.get(n);
    const p = [];
    for (const q of st.params) { if (q.type !== "Identifier") break; p.push(q.name); }
    const e = Object.prototype.hasOwnProperty.call(ersatz, n) ? ", " + ersatz[n] : "";
    return "  function " + n + "(" + p.join(", ") + ") { return dmaModul(\"" + n + "\", arguments" + e + "); }";
  });
  const block = "\n  /* MODUL M4 — " + gruppe.gruppe + ": der Code steht in src/app/" + gruppe.gruppe + ".js (gebaut nach bau/bruecke-*.js,\n"
    + "     geladen VOR app.js; src/bruecke.js stellt die Eingänge auf window). Hier bleiben nur die Weiterleitungen für\n"
    + "     den Rest von app.js (MODULE-PLAN.md Abschnitt 3, M4; werkzeug/app-modul-ziehen.js). */\n"
    + weiter.join("\n") + "\n";
  /* app.js neu: Spannen heraus, Block an die Stelle der ersten */
  let neu = "", bis = 0;
  spannen.forEach(([a, e], k) => { neu += quelle.slice(bis, a) + (k === 0 ? block : ""); bis = e; });
  neu += quelle.slice(bis);
  /* Modul: die Spannen, zwei Leerzeichen weniger eingerückt – außer Zeilen, die IN einem String beginnen
     (mehrzeiliges Template-Literal, String mit „\" am Zeilenende): dort gehört der Leerraum zum Inhalt. */
  const inString = stringSpannen(gezogen);
  const rumpfText = spannen.map(([a, e]) => ausruecken(quelle, a, e, inString)).join("");
  const helfer = [...braucht].sort().map((n) =>
    "function " + n + "(...a) { return window.DMA_APP." + n + "(...a); }");
  const modul = "/* =====================================================================\n"
    + "   MODUL-UMBAU M4 (MODULE-PLAN.md Abschnitt 3) — " + gruppe.gruppe.toUpperCase() + " (aus app.js)\n"
    + "   ---------------------------------------------------------------------\n"
    + String(gruppe.kopf || "").split("\n").map((z) => "   " + z).join("\n") + "\n"
    + "   Gezogen mit werkzeug/app-modul-ziehen.js: der Code unten ist der aus\n"
    + "   app.js, Zeichen für Zeichen (zwei Leerzeichen weniger eingerückt,\n"
    + "   nicht in Strings).\n"
    + "   Eingänge (export) stellt src/bruecke.js unter dem alten Namen auf\n"
    + "   window; app.js ruft sie über dünne Weiterleitungen (dmaModul, aus der\n"
    + "   eigenen Tabelle DMA_BRUECKE.fn).\n"
    + "   ===================================================================== */\n"
    + (helfer.length ? "/* Helfer aus app.js – über window.DMA_APP, erst beim Aufruf gelesen (dieses Modul läuft VOR app.js) */\n"
      + helfer.join("\n") + "\n" : "")
    + "\n" + rumpfText.replace(/^\n+/, "")
    + "\nexport { " + [...eingang].sort().join(", ") + " };\n";
  return { app: neu, modul, braucht: [...braucht].sort(), eingang: [...eingang].sort(), zahl: gezogen.length,
    zeichen: spannen.reduce((s, [a, e]) => s + e - a, 0) };
}

/* PRÜFEN: steht im Modul jede Deklaration Zeichen für Zeichen so, wie das Werkzeug sie aus der alten app.js gezogen
   hätte? (Deklaration ohne den Kommentar davor; Deklarationen, die es in der alten app.js nicht gab – z. B. vor dem
   Ziehen in eine Funktion gefasste Anweisungen –, werden als „neu" genannt.) */
function vergleichen(modul, alteQuelle, acorn) {
  const ast = acorn.parse(alteQuelle, { ecmaVersion: "latest", sourceType: "script" });
  const huelle = ast.body.find((st) => st.type === "ExpressionStatement" && st.expression.type === "CallExpression"
    && st.expression.callee.type === "FunctionExpression");
  const alt = new Map();
  (huelle ? huelle.expression.callee.body.body : []).forEach((st) => namenDerAnweisung(st).forEach((n) => alt.set(n, st)));
  const m = acorn.parse(modul, { ecmaVersion: "latest", sourceType: "module" });
  const anfang = (text, pos) => text.lastIndexOf("\n", pos - 1) + 1;
  const gleich = [], anders = [], neu = [];
  m.body.forEach((st) => {
    const n = namenDerAnweisung(st);
    if (!n.length) return;
    const text = modul.slice(anfang(modul, st.start), st.end);
    if (/^function \w+\(\.\.\.a\) \{ return window\.DMA_APP\.\w+\(\.\.\.a\); \}$/.test(text)) return;   /* Helfer */
    const a = alt.get(n[0]);
    if (!a) { neu.push(n.join(",")); return; }
    const vorher = ausruecken(alteQuelle, anfang(alteQuelle, a.start), a.end, stringSpannen([a]));
    (vorher === text ? gleich : anders).push(n.join(","));
  });
  return { gleich, anders, neu };
}

module.exports = { ziehen, vergleichen, stringSpannen, ausruecken, nennungen, namenDerAnweisung };

if (require.main === module) {
  const datei = process.argv[2];
  if (!datei) { console.error("Aufruf: node werkzeug/app-modul-ziehen.js <gruppe.json> [--schreiben]"); process.exit(1); }
  const gruppe = JSON.parse(fs.readFileSync(datei, "utf8"));
  const acorn = require("./teile-bauen.js").acornHolen();
  if (!acorn) { console.error("acorn fehlt"); process.exit(1); }
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  if (process.argv.includes("--pruefen")) {
    /* node werkzeug/app-modul-ziehen.js <gruppe.json> --pruefen <alte app.js> */
    const alte = fs.readFileSync(process.argv[process.argv.indexOf("--pruefen") + 1], "utf8");
    const modul = fs.readFileSync(path.join(WURZEL, "src", "app", gruppe.gruppe + ".js"), "utf8");
    const v = vergleichen(modul, alte, acorn);
    console.log(gruppe.gruppe + ": " + v.gleich.length + " Deklarationen Zeichen für Zeichen gleich, " + v.anders.length + " anders"
      + (v.anders.length ? " (" + v.anders.join(", ") + ")" : "") + ", " + v.neu.length + " neu" + (v.neu.length ? " (" + v.neu.join(", ") + ")" : ""));
    process.exit(v.anders.length ? 1 : 0);
  }
  let r;
  try { r = ziehen(gruppe, quelle, acorn); } catch (e) { console.error("ABGELEHNT: " + e.message); process.exit(1); }
  /* beides muss sich übersetzen lassen */
  acorn.parse(r.app, { ecmaVersion: "latest", sourceType: "script" });
  acorn.parse(r.modul, { ecmaVersion: "latest", sourceType: "module" });
  console.log(gruppe.gruppe + ": " + r.zahl + " Deklarationen, " + r.zeichen + " Zeichen");
  console.log("  braucht aus app.js (window.DMA_APP): " + r.braucht.join(", "));
  console.log("  Eingänge (Weiterleitungen in app.js): " + r.eingang.join(", "));
  if (process.argv.includes("--schreiben")) {
    const ziel = path.join(WURZEL, "src", "app", gruppe.gruppe + ".js");
    if (fs.existsSync(ziel)) { console.error("gibt es schon: " + ziel); process.exit(1); }
    fs.mkdirSync(path.dirname(ziel), { recursive: true });
    fs.writeFileSync(ziel, r.modul);
    fs.writeFileSync(path.join(WURZEL, "app.js"), r.app);
    console.log("geschrieben: src/app/" + gruppe.gruppe + ".js und app.js");
  }
}
