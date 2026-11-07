#!/usr/bin/env node
/* =====================================================================
   SONDE 887 — DER MODUL-BAU (MODULE-PLAN.md Abschnitt 3, M1/M2)
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität".

   Was gebaut ist: src/*.js baut Vite (vite.config.mjs) zu
   bau/<name>-<hash>.js; werkzeug/fassung-setzen.js --nur-stempel (der
   Haken vor jedem Commit) baut nur bei geänderter Prüfsumme und schreibt
   window.DMA_MODUL hinter DMA_STEMPEL in index.html. Erstes Modul: das
   Walkie (src/rueckfrage.js), geladen von dmaWalkieLaden.

   TEILE (ohne Browser, außer S)
     B1  keine Eingangsdatei ist leer (src/*.js mit Code; jede Datei des
         Manifests > 0 Byte)
     B2  kein Name in bau/ und src/ beginnt mit _ oder . (Jekyll/GitHub Pages
         veröffentlicht solche Namen nicht)
     B3  Manifest = DMA_MODUL = Dateien: jeder Eingang aus src/ steht im
         Manifest, DMA_MODUL in index.html ist genau die Karte aus dem
         Manifest und steht vorn im Skriptblock von DMA_STEMPEL (seit M3,
         kein eigenes <script>), sw.js liest DMA_STEMPEL weiter, jede genannte Datei
         liegt da, keine verwaiste Datei in bau/
     B4  die Stücke der letzten 3 Manifeste aus git liegen in bau/ und sind
         in git (alte Seiten in einem Speicher holen sie vom Server)
     B5  Prüfsumme über src/**, vite.config.mjs, package-lock.json =
         bau/quelle.json (fängt einen Commit, bei dem der Bau gescheitert ist)
     B6  Gleichlauf: src/rueckfrage.js ist der Körper der klassischen
         rueckfrage.js (werkzeug/quelle-lesen.js) – der Rückfall ist derselbe
         Code; die Rundreise src → klassisch ist Byte für Byte gleich; der
         Haken meldet ein Auseinanderlaufen bei jedem Commit
     B7  Kaskade (Vite in einem Wegwerf-Ordner): mit zwei weiteren Eingängen
         gebaut; eine 1-Zeilen-Änderung in einem benennt NUR dessen Stück um;
         der Bau ist wiederholbar (rueckfrage bekommt denselben Namen wie in
         bau/)
     B8  Baufehler (Syntaxfehler) und fehlendes Vite: modul-bauen meldet den
         Fehler, bau/ bleibt Byte für Byte, DMA_MODUL bleibt; eine echte
         Fassung (fassung-setzen.js <zahl>) bricht dann ab, ohne DMA_VERSION
         oder fassung.json zu ändern (M3, Prüfung M2 c)
     B9  package.json ohne "type"; esbuild für min/ ist 0.28.2
     B10 keine Sonde prüft fest den Hauptbaum (M0, Befehl 0.1)
     B11 Name aus dem Inhalt (M3, Prüfung M2 b): sw.js gibt bau/…-<8 Zeichen>
         ungefragt aus dem Speicher; jede Datei in bau/daten/ heißt nach
         sha256(Inhalt) (mit Gegenprobe), kein Hash-Name unter bau/ hatte in
         git je zwei Inhalte, der Arbeitsbaum weicht davon nicht ab
     S   Start im Browser (Chromium, ohne Helfer): Gast, Betreiber-Gerät
         (Merker dma-walkie) mit min und mit ?quelle: keine 404, das Walkie
         kommt als Modul (bau/… bzw. src/rueckfrage.js), window.Rueckfrage
         steht, keine Seitenfehler aus dem Walkie; ohne Modul-Unterstützung
         (noModule fehlt) der klassische Weg

   Aufruf:     node werkzeug/pruefe-887-bau.js        (NUR=B|S)
   Gegenprobe: WURZEL=<ordner mit 7e23e157> node werkzeug/pruefe-887-bau.js  → rot
   ===================================================================== */
const fs = require("fs"), path = require("path"), os = require("os"), http = require("http");
const { execFileSync, spawnSync } = require("child_process");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const NUR = process.env.NUR || "BS";
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const lies = (f) => { try { return fs.readFileSync(path.join(WURZEL, f), "utf8"); } catch (e) { return null; } };
const jsonLies = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } };
const baum = (o) => !fs.existsSync(o) ? [] : fs.readdirSync(o, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? baum(path.join(o, e.name)) : [path.join(o, e.name)]).sort();
let MB = null;
try { MB = require(path.join(WURZEL, "werkzeug", "modul-bauen.js")); } catch (e) { MB = null; }

(async () => {
  console.log("SONDE 887 — Modul-Bau   WURZEL " + WURZEL + "\n");
  const BAU = path.join(WURZEL, "bau"), SRC = path.join(WURZEL, "src");
  const manifest = jsonLies(path.join(BAU, "manifest.json"));
  const html = lies("index.html") || "";
  /* seit M3 (Prüfung M2 a) im Block von DMA_STEMPEL, vorn: <script>window.DMA_MODUL = {…};window.DMA_STEMPEL = {…};</script> */
  const zeile = /window\.DMA_MODUL = (\{[^\n]*?\});(?:window\.DMA_STEMPEL = |<\/script>)/.exec(html);
  let dmaModul = null; try { dmaModul = zeile ? JSON.parse(zeile[1]) : null; } catch (e) { dmaModul = null; }

  if (NUR.includes("B")) {
    sage(Boolean(MB), "werkzeug/modul-bauen.js da");
    /* B1 */
    const eing = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((n) => /^[a-z0-9][a-z0-9-]*\.js$/.test(n)).sort() : [];
    const leer = eing.filter((n) => !fs.readFileSync(path.join(SRC, n), "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "").trim());
    sage(eing.length > 0 && !leer.length, "B1 keine Eingangsdatei in src/ ist leer", eing.join(", ") + (leer.length ? "; leer: " + leer.join(", ") : ""));
    const mDateien = MB && manifest ? [...MB.dateien(manifest)] : [];
    const mLeer = mDateien.filter((f) => !fs.existsSync(path.join(BAU, f)) || !fs.statSync(path.join(BAU, f)).size);
    sage(mDateien.length > 0 && !mLeer.length, "B1 jede Datei des Manifests liegt da und ist nicht leer", mDateien.join(", ") + (mLeer.length ? "; fehlt/leer: " + mLeer.join(", ") : ""));
    /* B2 */
    const schlecht = baum(BAU).concat(baum(SRC)).map((f) => path.relative(WURZEL, f)).filter((r) => r.split(path.sep).some((t) => /^[_.]/.test(t)));
    sage(fs.existsSync(BAU) && !schlecht.length, "B2 kein Name in bau/ und src/ beginnt mit _ oder .", schlecht.join(", "));
    /* B3 */
    const fehlend = eing.filter((n) => !(manifest && manifest["src/" + n] && manifest["src/" + n].isEntry));
    sage(Boolean(manifest) && !fehlend.length, "B3 jeder Eingang aus src/ steht im Manifest", fehlend.length ? "fehlt: " + fehlend.join(", ") : "");
    const karte = MB && manifest ? MB.karte(manifest) : null;
    /* M3b: dazu „uebungen" = Verzeichnis der Übungsteile aus bau/uebungen-quelle.json (werkzeug/uebungen-teilen.js; die Teile
       selbst prüft pruefe-887-daten.js) */
    const uMerk = jsonLies(path.join(BAU, "uebungen-quelle.json"));
    const karteSoll = karte ? Object.assign({}, karte, uMerk && uMerk.karte ? { uebungen: uMerk.karte } : {}) : null;
    sage(Boolean(karteSoll && dmaModul) && JSON.stringify(karteSoll) === JSON.stringify(dmaModul), "B3 DMA_MODUL in index.html = Karte aus bau/manifest.json (+ uebungen aus bau/uebungen-quelle.json, M3b)",
      JSON.stringify(dmaModul) + (karteSoll && JSON.stringify(karteSoll) !== JSON.stringify(dmaModul) ? " ≠ " + JSON.stringify(karteSoll) : ""));
    sage(/\n<script>window\.DMA_MODUL = \{[^\n]*?\};window\.DMA_STEMPEL = \{[^\n]*\};<\/script>\n/.test(html) && (html.match(/window\.DMA_MODUL = /g) || []).length === 1,
      "B3 DMA_MODUL steht vorn im Skriptblock von DMA_STEMPEL (kein eigenes <script>-Element, nur einmal)");
    /* sw.js liest DMA_STEMPEL aus der gespeicherten Seite mit diesem Muster (auch die alten Helfer auf den Geräten) */
    let swKarte = null;
    try { const m = /window\.DMA_STEMPEL = (\{[^\n]*?\});<\/script>/.exec(html); swKarte = m ? JSON.parse(m[1]) : null; } catch (e) { swKarte = null; }
    sage(Boolean(swKarte && swKarte["index.html"] === undefined && swKarte["min/app.js"]), "B3 sw.js (karteAus) liest DMA_STEMPEL weiter fehlerfrei", swKarte ? Object.keys(swKarte).length + " Einträge" : "JSON.parse scheitert");
    sage(Boolean(dmaModul) && Object.values(dmaModul).every((f) => /^bau\/[a-z0-9-]+-[A-Za-z0-9_-]{8}\.js$/.test(f) && fs.existsSync(path.join(WURZEL, f))),
      "B3 jede Datei aus DMA_MODUL liegt in bau/ (Name mit 8-Zeichen-Hash)");
    let alt = null;
    try { alt = MB ? MB.gitManifeste(WURZEL, 3) : null; } catch (e) { alt = null; }
    const genannt = new Set(mDateien);
    (alt || []).forEach((m) => MB.dateien(m).forEach((f) => genannt.add(f)));
    const waisen = baum(BAU).map((f) => path.relative(BAU, f).split(path.sep).join("/"))
      .filter((r) => MB && MB.STUECK.test(r) && !(MB.FREMD ? MB.FREMD.test(r) : /^daten\//.test(r)) && !genannt.has(r));
    sage(Boolean(MB) && fs.existsSync(BAU) && !waisen.length, "B3 keine verwaiste Vite-Datei in bau/ (jede nennt das Manifest oder eines der letzten 3 aus git; bau/daten und bau/uebungen* verwalten ihre Werkzeuge)", waisen.join(", "));
    /* B4 */
    if (alt == null) sage(false, "B4 die letzten 3 Manifeste aus git lesbar (git-Baum?)");
    else {
      let inGit = new Set();
      try { inGit = new Set(execFileSync("git", ["-C", WURZEL, "ls-files", "bau"], { encoding: "utf8" }).split("\n").filter(Boolean)); } catch (e) {}
      const fehlt = [];
      alt.forEach((m) => MB.dateien(m).forEach((f) => { if (!fs.existsSync(path.join(BAU, f)) || !inGit.has("bau/" + f)) fehlt.push(f); }));
      sage(alt.length > 0 && !fehlt.length, "B4 die Stücke der letzten " + alt.length + " Manifeste aus git liegen in bau/ und sind in git", fehlt.join(", "));
    }
    /* B5 */
    const q = jsonLies(path.join(BAU, "quelle.json"));
    const s = MB ? MB.summe(WURZEL) : null;
    sage(Boolean(q && s) && q.summe === s, "B5 Prüfsumme (src/**, vite.config.mjs, package-lock.json) = bau/quelle.json", (q && q.summe) + " / " + s);
    /* B6 */
    let gl = null;
    try { gl = require(path.join(WURZEL, "werkzeug", "quelle-lesen.js")).gleichlauf("rueckfrage.js", WURZEL); } catch (e) { gl = { gleich: false, grund: String(e.message || e).slice(0, 120) }; }
    sage(gl && gl.gleich, "B6 Gleichlauf: src/rueckfrage.js = Körper der klassischen rueckfrage.js (Rückfall ist derselbe Code)", gl && gl.grund);
    let rund = null;
    try {
      const ql = require(path.join(WURZEL, "werkzeug", "quelle-lesen.js"));
      rund = ql.klassischAusModul(fs.readFileSync(path.join(SRC, "rueckfrage.js"), "utf8")) === fs.readFileSync(path.join(WURZEL, "rueckfrage.js"), "utf8");
    } catch (e) { rund = false; }
    sage(rund === true, "B6 Rundreise: aus src/rueckfrage.js entsteht die klassische rueckfrage.js Byte für Byte (quelle-lesen --klassisch)");
    const fsz = lies("werkzeug/fassung-setzen.js") || "";
    sage(/function gleichlaufPruefen\(\)/.test(fsz) && /gleichlaufPruefen\(\);\n  hakenAnlegen\(\);/.test(fsz) && /stempelSetzen\(\);\n  gleichlaufPruefen\(\);/.test(fsz),
      "B6 der Haken (fassung-setzen.js) meldet auseinanderlaufende Paare bei jedem Commit (Rückgabe 2)");
    /* B7/B8 im Wegwerf-Ordner */
    const vite = path.join(WURZEL, "node_modules", ".bin", "vite");
    if (!MB || !fs.existsSync(vite) || !fs.existsSync(SRC)) {
      sage(false, "B7 Kaskaden-Test: Vite und src/ nötig", fs.existsSync(vite) ? "" : "node_modules/.bin/vite fehlt");
      sage(false, "B8 Baufehler-Test: modul-bauen.js und Vite nötig");
    } else {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dma-887-bau-"));
      try {
        const kopie = (ziel) => {
          fs.mkdirSync(path.join(ziel, "src"), { recursive: true });
          eing.forEach((n) => fs.copyFileSync(path.join(SRC, n), path.join(ziel, "src", n)));
          fs.copyFileSync(path.join(WURZEL, "vite.config.mjs"), path.join(ziel, "vite.config.mjs"));
          fs.copyFileSync(path.join(WURZEL, "package-lock.json"), path.join(ziel, "package-lock.json"));
          fs.symlinkSync(path.join(WURZEL, "node_modules"), path.join(ziel, "node_modules"));
        };
        const bau = (ziel) => {
          const r = spawnSync(vite, ["build", "--logLevel", "error"], { cwd: ziel, encoding: "utf8", timeout: 180000 });
          return r.status === 0 ? jsonLies(path.join(ziel, "bau", "manifest.json")) : null;
        };
        const K = path.join(tmp, "k");
        kopie(K);
        fs.writeFileSync(path.join(K, "src", "sonde-eins.js"), "/* Sonde */\nwindow.__sondeEins = 1;\nwindow.__sondeEinsZwei = function (a) { return a + 1; };\n");
        fs.writeFileSync(path.join(K, "src", "sonde-zwei.js"), "/* Sonde */\nwindow.__sondeZwei = [1, 2, 3].map(function (x) { return x * 2; });\n");
        const m1 = bau(K);
        fs.writeFileSync(path.join(K, "src", "sonde-eins.js"), "/* Sonde */\nwindow.__sondeEins = 2;\nwindow.__sondeEinsZwei = function (a) { return a + 1; };\n");
        const m2 = bau(K);
        const name = (m, k) => (m && m["src/" + k + ".js"] ? m["src/" + k + ".js"].file : null);
        const andere = eing.map((n) => n.replace(/\.js$/, "")).concat(["sonde-zwei"]);
        const gleichBlieben = andere.filter((k) => name(m1, k) && name(m1, k) === name(m2, k));
        sage(Boolean(m1 && m2) && name(m1, "sonde-eins") !== name(m2, "sonde-eins") && gleichBlieben.length === andere.length
          && Object.keys(m1).length === Object.keys(m2).length,
          "B7 Kaskade: eine 1-Zeilen-Änderung benennt nur ihr eigenes Stück um",
          "sonde-eins " + name(m1, "sonde-eins") + " → " + name(m2, "sonde-eins") + "; gleich geblieben " + gleichBlieben.length + "/" + andere.length
          + "; Stücke " + (m1 ? Object.keys(m1).length : "–") + " → " + (m2 ? Object.keys(m2).length : "–"));
        const rf = name(m1, "rueckfrage");
        sage(Boolean(rf) && manifest && manifest["src/rueckfrage.js"] && manifest["src/rueckfrage.js"].file === rf,
          "B7 wiederholbar: derselbe Inhalt bekommt denselben Namen wie in bau/", rf + " / " + (manifest && manifest["src/rueckfrage.js"] ? manifest["src/rueckfrage.js"].file : "–"));
        /* B8: Baufehler und fehlendes Vite – mit dem modul-bauen.js aus WURZEL */
        const F = path.join(tmp, "f");
        kopie(F);
        fs.mkdirSync(path.join(F, "bau"));
        baum(BAU).forEach((f) => { const z = path.join(F, "bau", path.relative(BAU, f)); fs.mkdirSync(path.dirname(z), { recursive: true }); fs.copyFileSync(f, z); });
        const vorher = baum(path.join(F, "bau")).map((f) => path.relative(F, f) + ":" + require("crypto").createHash("sha1").update(fs.readFileSync(f)).digest("hex")).join("\n");
        const r0 = MB.bauen(F);
        sage(!r0.fehler && r0.karte && JSON.stringify(r0.karte) === JSON.stringify(karte), "B8 Ausgangslage: Kopie baut ohne Fehler zur selben Karte", r0.fehler || JSON.stringify(r0.karte));
        const nachher0 = baum(path.join(F, "bau")).map((f) => path.relative(F, f) + ":" + require("crypto").createHash("sha1").update(fs.readFileSync(f)).digest("hex")).join("\n");
        fs.appendFileSync(path.join(F, "src", eing[0]), "\nvar kaputt = ;\n");
        const r1 = MB.bauen(F);
        const nachher1 = baum(path.join(F, "bau")).map((f) => path.relative(F, f) + ":" + require("crypto").createHash("sha1").update(fs.readFileSync(f)).digest("hex")).join("\n");
        sage(Boolean(r1.fehler) && r1.karte === null && nachher1 === nachher0, "B8 Syntaxfehler: Fehler gemeldet, bau/ Byte für Byte wie vorher, DMA_MODUL bleibt (karte null)",
          String(r1.fehler || "kein Fehler gemeldet").slice(0, 110));
        fs.unlinkSync(path.join(F, "node_modules"));
        const r2 = MB.bauen(F);
        const nachher2 = baum(path.join(F, "bau")).map((f) => path.relative(F, f) + ":" + require("crypto").createHash("sha1").update(fs.readFileSync(f)).digest("hex")).join("\n");
        sage(Boolean(r2.fehler) && /Vite fehlt/.test(r2.fehler) && r2.karte === null && nachher2 === nachher0, "B8 ohne Vite (kein node_modules): Fehler gemeldet, bau/ bleibt", String(r2.fehler || "").slice(0, 90));
        const probe = "<script>window.DMA_MODUL = {\"a\":\"bau/a-12345678.js\"};window.DMA_STEMPEL = {\"x.js\":\"1\"};</script>\n";
        sage(MB.zeileSetzen(probe, null) === probe, "B8 zeileSetzen(null) lässt die alte Angabe DMA_MODUL stehen");
        sage(MB.zeileSetzen(probe, { b: "bau/b-87654321.js" }) === probe.replace('{"a":"bau/a-12345678.js"}', '{"b":"bau/b-87654321.js"}')
          && MB.zeileSetzen("<script>window.DMA_STEMPEL = {\"x.js\":\"1\"};</script>\n<script>window.DMA_MODUL = {\"a\":\"bau/a-12345678.js\"};</script>\n<p>", { a: "bau/a-12345678.js" })
            === probe + "<p>", "B8 zeileSetzen ersetzt im Block und zieht die alte eigene Zeile (bis M2) hinein");
        if (!vorher) console.log("       (bau/ war leer)");
        /* M3 (Prüfung M2 c): eine ECHTE Fassung (fassung-setzen.js <zahl>) bricht bei einem Baufehler ab, bevor
           DMA_VERSION oder fassung.json sich ändern – im Wegwerf-Ordner mit dem Werkzeug aus WURZEL */
        {
          const G = path.join(tmp, "g");
          kopie(G);
          fs.mkdirSync(path.join(G, "werkzeug"));
          ["fassung-setzen.js", "modul-bauen.js", "quelle-lesen.js"].forEach((n) => {
            if (fs.existsSync(path.join(WURZEL, "werkzeug", n))) fs.copyFileSync(path.join(WURZEL, "werkzeug", n), path.join(G, "werkzeug", n));
          });
          ["index.html", "fassung.json", "package.json"].forEach((n) => { if (fs.existsSync(path.join(WURZEL, n))) fs.copyFileSync(path.join(WURZEL, n), path.join(G, n)); });
          fs.mkdirSync(path.join(G, "bau"));
          baum(BAU).filter((f) => !/[\/]daten[\/]/.test(f)).forEach((f) => { const z = path.join(G, "bau", path.relative(BAU, f)); fs.mkdirSync(path.dirname(z), { recursive: true }); fs.copyFileSync(f, z); });
          fs.appendFileSync(path.join(G, "src", eing[0]), "\nvar kaputt = ;\n");
          const vorI = fs.readFileSync(path.join(G, "index.html")), vorF = fs.existsSync(path.join(G, "fassung.json")) ? fs.readFileSync(path.join(G, "fassung.json")) : null;
          const r3 = spawnSync(process.execPath, [path.join(G, "werkzeug", "fassung-setzen.js"), "9999"], { cwd: G, encoding: "utf8", timeout: 180000 });
          const nachI = fs.readFileSync(path.join(G, "index.html")), nachF = fs.existsSync(path.join(G, "fassung.json")) ? fs.readFileSync(path.join(G, "fassung.json")) : null;
          sage(r3.status !== 0 && vorI.equals(nachI) && String(vorF) === String(nachF) && /NICHT gesetzt/.test(r3.stderr || ""),
            "B8 echte Fassung (fassung-setzen.js 9999) bei Baufehler: Abbruch, Rückgabe ≠ 0, index.html und fassung.json unverändert",
            "Rückgabe " + r3.status + (vorI.equals(nachI) ? "" : ", index.html geändert") + (String(vorF) === String(nachF) ? "" : ", fassung.json geändert"));
        }
        /* Rückgabe von fassung-setzen.js bei Baufehler: steht im Werkzeug (process.exit(modulFehler ? 2 : 0)) */
        const fs2 = lies("werkzeug/fassung-setzen.js") || "";
        sage(/process\.exit\(modulFehler \? 2 : 0\)/.test(fs2) && /"add", "--", "index\.html", "min"\]/.test(fs2),
          "B8 fassung-setzen.js: Rückgabe 2 bei Baufehler, legt index.html, min/ und bau/ selbst an (git add)");
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    }
    /* B10 (M0, MODULE-PLAN.md 0.1): keine Sonde prüft fest den Hauptbaum – in einem anderen Arbeitsbaum meldete sie sonst
       still dessen Ergebnis */
    const fest = fs.readdirSync(path.join(WURZEL, "werkzeug")).filter((n) => /^pruefe-.*\.js$/.test(n))
      .filter((n) => fs.readFileSync(path.join(WURZEL, "werkzeug", n), "utf8").indexOf("/home/user/" + "Deutsch-Mit-Xander") >= 0);
    sage(!fest.length, "B10 keine Sonde mit festem Hauptbaum (/home/user/" + "Deutsch-Mit-Xander)", fest.length ? fest.length + " Dateien, z. B. " + fest.slice(0, 3).join(", ") : "");
    /* B11 (M3, Prüfung M2 b): sw.js gibt jede Datei bau/…-<8 Zeichen>.(js|css|json) OHNE Nachfrage aus dem Speicher –
       unter einem Namen darf also nie ein anderer Inhalt liegen. Vite nimmt den Hash aus dem Inhalt (B7: wiederholbar);
       werkzeug/daten-bauen.js nimmt sha256(Inhalt) als base64url, die ersten 8 Zeichen. */
    {
      const crypto = require("crypto");
      const datenFalsch = (ordner) => baum(ordner).filter((f) => /\.json$/.test(f)).filter((f) => {
        const m = /-([A-Za-z0-9_-]{8})\.json$/.exec(f);
        return !m || crypto.createHash("sha256").update(fs.readFileSync(f)).digest("base64url").slice(0, 8) !== m[1];
      }).map((f) => path.relative(WURZEL, f));
      const DATEN = path.join(BAU, "daten");
      const df = datenFalsch(DATEN);
      const dn = baum(DATEN).filter((f) => /\.json$/.test(f)).length;
      sage(!df.length, "B11 jede Datei in bau/daten/ heißt nach ihrem Inhalt (sha256, base64url, 8 Zeichen)", dn + " Dateien" + (df.length ? "; falsch: " + df.slice(0, 4).join(", ") : ""));
      /* Gegenprobe der Prüfung selbst: eine Datei mit fremdem Inhalt unter einem Hash-Namen wird erkannt */
      const tmpD = fs.mkdtempSync(path.join(os.tmpdir(), "dma-887-b11-"));
      try {
        const echt = Buffer.from("{\"a\":1}");
        const h = crypto.createHash("sha256").update(echt).digest("base64url").slice(0, 8);
        fs.writeFileSync(path.join(tmpD, "x-" + h + ".json"), echt);
        const gut = datenFalsch(tmpD).length === 0;
        fs.writeFileSync(path.join(tmpD, "x-" + h + ".json"), "{\"a\":2}");
        sage(gut && datenFalsch(tmpD).length === 1, "B11 Gegenprobe: ein fremder Inhalt unter einem Hash-Namen wird erkannt");
      } finally { fs.rmSync(tmpD, { recursive: true, force: true }); }
      /* git: kein Pfad unter bau/ mit Hash-Namen hatte je zwei Inhalte, und der Arbeitsbaum weicht von git nicht ab */
      if (fs.existsSync(path.join(WURZEL, ".git"))) {
        const git = (a) => execFileSync("git", ["-C", WURZEL].concat(a), { encoding: "utf8", maxBuffer: 1 << 26 });
        const inhalte = new Map();
        let commits = [];
        try { commits = git(["log", "--format=%H", "--", "bau"]).split("\n").filter(Boolean); } catch (e) {}
        commits.forEach((c) => git(["ls-tree", "-r", c, "--", "bau"]).split("\n").filter(Boolean).forEach((z) => {
          const m = /^\d+ blob ([0-9a-f]+)\t(.+)$/.exec(z);
          if (m && MB && MB.STUECK.test(m[2])) { if (!inhalte.has(m[2])) inhalte.set(m[2], new Set()); inhalte.get(m[2]).add(m[1]); }
        }));
        const doppelt = [...inhalte].filter(([, v]) => v.size > 1).map(([k]) => k);
        sage(commits.length > 0 && !doppelt.length, "B11 git: kein Hash-Name unter bau/ hatte je zwei Inhalte", inhalte.size + " Namen in " + commits.length + " Commits" + (doppelt.length ? "; doppelt: " + doppelt.join(", ") : ""));
        const kopf = new Map();
        try { git(["ls-tree", "-r", "HEAD", "--", "bau"]).split("\n").filter(Boolean).forEach((z) => { const m = /^\d+ blob ([0-9a-f]+)\t(.+)$/.exec(z); if (m) kopf.set(m[2], m[1]); }); } catch (e) {}
        const pfade = [...kopf.keys()].filter((p) => MB && MB.STUECK.test(p) && fs.existsSync(path.join(WURZEL, p)));
        let anders = [];
        if (pfade.length) {
          const h = execFileSync("git", ["-C", WURZEL, "hash-object", "--stdin-paths"], { input: pfade.join("\n") + "\n", encoding: "utf8" }).split("\n");
          anders = pfade.filter((p, i) => h[i] !== kopf.get(p));
        }
        sage(!anders.length, "B11 Arbeitsbaum: keine Datei mit Hash-Namen weicht vom Stand in git ab", pfade.length + " geprüft" + (anders.length ? "; anders: " + anders.join(", ") : ""));
      } else sage(false, "B11 git-Baum nötig");
    }
    /* B9 */
    const pj = jsonLies(path.join(WURZEL, "package.json"));
    sage(Boolean(pj) && pj.private === true && !("type" in pj), "B9 package.json privat und ohne \"type\" (sonst brechen die Sonden mit require)");
    let ebv = null;
    try { ebv = require(path.join(WURZEL, "node_modules", "esbuild", "package.json")).version; } catch (e) {}
    sage(ebv === "0.28.2" && /m\.version === "0\.28\.2"/.test(lies("werkzeug/fassung-setzen.js") || ""), "B9 esbuild für min/ ist 0.28.2 (oben gepinnt und im Werkzeug geprüft)", "node_modules/esbuild " + ebv);
  }

  /* ===================== S: Start im Browser ===================== */
  if (NUR.includes("S")) {
    console.log("");
    const { chromium } = require("/tmp/claude-0/node_modules/playwright");
    const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
      ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
    const log = [];
    const srv = http.createServer((q, a) => {
      let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
      const f = path.join(WURZEL, p);
      const da = f.startsWith(WURZEL) && fs.existsSync(f) && !fs.statSync(f).isDirectory();
      log.push({ p, url: q.url, s: da ? 200 : 404 });
      if (!da) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      fs.createReadStream(f).pipe(a);
    });
    await new Promise((r) => srv.listen(0, "127.0.0.1", r));
    const BASIS = "http://127.0.0.1:" + srv.address().port;
    const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
    const lauf = async (o) => {
      const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
      await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
      await ctx.addInitScript(([merker, ohneModul]) => {
        try { localStorage.setItem("dma_tour_seen", "1"); if (merker) localStorage.setItem("dma-walkie", "1"); } catch (e) {}
        if (ohneModul) try { delete HTMLScriptElement.prototype.noModule; } catch (e) {}
      }, [Boolean(o.merker), Boolean(o.ohneModul)]);
      const pg = await ctx.newPage();
      const pe = [];
      pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
      const ab = log.length;
      await pg.goto(BASIS + "/index.html" + (o.quelle ? "?quelle" : ""), { waitUntil: "load", timeout: 60000 });
      const walkie = o.merker ? await pg.waitForFunction(() => window.Rueckfrage && typeof window.Rueckfrage.holen === "function", null, { timeout: 20000 }).then(() => true, () => false) : null;
      await pg.waitForTimeout(o.merker ? 800 : 3000);
      const typ = await pg.evaluate(() => [...document.querySelectorAll("script[src]")].filter((s) => /rueckfrage/.test(s.getAttribute("src")))
        .map((s) => (s.type || "klassisch") + " " + s.getAttribute("src"))).catch(() => []);
      const rf = await pg.evaluate(() => typeof window.Rueckfrage).catch(() => "?");
      await ctx.close();
      const l = log.slice(ab);
      return { l, n404: l.filter((x) => x.s === 404).map((x) => x.p), walkie, typ, rf, pe: pe.filter((m) => /Rueckfrage|rueckfrage|walkie|import|module/i.test(m)), alle: pe };
    };
    const rfAbrufe = (l) => l.filter((x) => /rueckfrage/.test(x.p)).map((x) => x.p);
    const mod = dmaModul && dmaModul.rueckfrage;

    const g = await lauf({});
    sage(!g.n404.length, "S  Gast: beim Start keine 404", g.n404.slice(0, 5).join(", "));
    sage(!rfAbrufe(g.l).length && g.rf === "undefined", "S  Gast: kein Walkie geholt", rfAbrufe(g.l).join(", "));
    const b = await lauf({ merker: true });
    sage(!b.n404.length, "S  Betreiber-Gerät (min): keine 404", b.n404.slice(0, 5).join(", "));
    sage(b.walkie === true && Boolean(mod) && rfAbrufe(b.l).length === 1 && rfAbrufe(b.l)[0] === "/" + mod && b.typ.length === 1 && /^module /.test(b.typ[0]),
      "S  Betreiber-Gerät (min): Walkie kommt als Modul aus bau/ (eine Datei), window.Rueckfrage steht", rfAbrufe(b.l).join(", ") + " · " + b.typ.join(", "));
    sage(!b.pe.length, "S  … keine Seitenfehler aus dem Walkie", b.pe.join(" | "));
    const qq = await lauf({ merker: true, quelle: true });
    sage(!qq.n404.length, "S  Betreiber-Gerät (?quelle): keine 404", qq.n404.slice(0, 5).join(", "));
    sage(qq.walkie === true && rfAbrufe(qq.l).length === 1 && rfAbrufe(qq.l)[0] === "/src/rueckfrage.js" && /^module /.test(qq.typ[0] || ""),
      "S  Betreiber-Gerät (?quelle): src/rueckfrage.js als natives Modul, window.Rueckfrage steht", rfAbrufe(qq.l).join(", ") + " · " + qq.typ.join(", "));
    sage(!qq.pe.length, "S  … keine Seitenfehler aus dem Walkie", qq.pe.join(" | "));
    const k = await lauf({ merker: true, ohneModul: true });
    sage(k.walkie === true && rfAbrufe(k.l).length === 1 && rfAbrufe(k.l)[0] === "/min/rueckfrage.js" && /^klassisch /.test(k.typ[0] || ""),
      "S  Browser ohne Module (noModule fehlt): klassisch min/rueckfrage.js, Walkie steht", rfAbrufe(k.l).join(", ") + " · " + k.typ.join(", "));
    await br.close(); srv.close();
  }

  console.log("\n  " + (fehler ? fehler + " FEHL" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
