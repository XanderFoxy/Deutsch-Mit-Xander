#!/usr/bin/env node
/* =====================================================================
   SONDE 887 — DIE STADT ALS EIGENE VITE-SEITEN (MODULE-PLAN.md Abschnitt 3, M5)
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität".

   Was gebaut ist: src/stadt.html und src/stadt-leicht.html sind Vite-
   Mehrseiten-Eingänge (vite.config.mjs, SEITEN); werkzeug/modul-bauen.js
   (Haken vor jedem Commit) legt die gebauten Seiten als stadt.html und
   stadt-leicht.html in den Hauptordner, ihre Stücke in bau/. Die Packer
   werkzeug/stadt-packen.js und leicht-packen.js sind weg.

   TEILE (ohne Browser)
     B1  Quellen: src/<seite>.html mit genau einem Block SKRIPTE und dem
         Eingang /@seite/<seite>; die Packer sind weg
     B2  Vertrag mit den Packern (Stand fc5e3ae3, unten fest): dieselben
         Dateien in derselben Reihenfolge, dieselben Vertretungen, dasselbe
         ?quelle=1
     B3  Manifest: je Seite ein Eingang mit Stilblatt, je nachgeladenes
         Stück ein Eingang; alle Dateien liegen in bau/ (8-Zeichen-Hash);
         DMA_MODUL in index.html nennt keines davon
     B4  die Seite im Hauptordner ist gebaut: Hinweis hinter dem doctype,
         derselbe Inhalt wie beim letzten Bau (bau/quelle.json), und ein
         frischer Vite-Bau aus den Quellen gibt Byte für Byte dieselbe Seite
     B5  die Seite: modulepreload und Stilblatt aus bau/ im Kopf, der Lader
         mit der ?quelle-Liste aus SEITEN, window.LEICHT_* zeigen auf die
         Stücke aus dem Manifest, LEICHT_STEMPEL = Stempel des Verzeichnisses
     B6  bau/quelle.json kennt die Eingaben der Seiten (stadt/…, stadt-leicht/…,
         das Verzeichnis der Bilder) – eine Änderung dort baut neu
     B7  sw.js gibt die Stücke der Seiten ohne Nachfrage aus dem Speicher
         (Regel für bau/), die Seiten selbst aus dem Netz
     B8  Wächter (in einem Wegwerf-Ordner mit werkzeug/modul-bauen.js): eine
         Änderung in stadt-leicht/ baut neu (nur die leichte Stadt bekommt
         neue Namen, die Baukasten-Stadt nicht); eine im Hauptordner von Hand
         geänderte Seite wird nicht überschrieben (laute Meldung, bau/ bleibt)
   S (Browser, Chromium, ohne Helfer)
     S1  stadt-leicht.html?demo=1 gebaut: genau ein Modul aus bau/, keine
         Quelle, keine 404, kein Seitenfehler, Ladebild steht vor den
         Skripten, das erste Bild kommt (__fertig), die Äcker kommen danach
         als Modul aus bau/
     S2  dasselbe mit ?quelle=1: die Quellen einzeln in Reihenfolge, das
         Quell-Stilblatt, kein Modul läuft
     S3  gebaut und ?quelle=1 haben dieselbe Stadt (window.STADT: dieselben
         Namen)
     S4  im Rahmen wie im Spiel (?eingebettet=1&mini=1): Ladebild klein,
         erstes Bild, Auto-Schau und Quests auf Abruf aus bau/
     S5  stadt.html?neu=1 gebaut und ?quelle=1: dasselbe (Modelle gleich,
         GEBUENDELT nur gebaut)

   Aufruf:     node werkzeug/pruefe-887-stadt.js          (NUR=B|S)
   Gegenprobe: WURZEL=<ordner mit fc5e3ae3> node werkzeug/pruefe-887-stadt.js  → rot
   ===================================================================== */
const fs = require("fs"), path = require("path"), os = require("os"), http = require("http"), crypto = require("crypto");
const { spawnSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const NUR = process.env.NUR || "BS";
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const lies = (f) => { try { return fs.readFileSync(path.join(WURZEL, f), "utf8"); } catch (e) { return null; } };
const jsonLies = (f) => { try { return JSON.parse(fs.readFileSync(path.join(WURZEL, f), "utf8")); } catch (e) { return null; } };
const sha1 = (b) => crypto.createHash("sha1").update(b).digest("hex");
const HASH = "[A-Za-z0-9_-]{8}";

/* Der Vertrag: was die Packer (werkzeug/stadt-packen.js, leicht-packen.js, Stand fc5e3ae3) taten */
const PACKER = {
  stadt: {
    quelle: ["stadt/kern.js", "stadt/pinsel.js", "stadt/boden.js", "stadt/szene.js", "stadt/himmel.js", "stadt/baustelle.js", "stadt/modelle.js",
      "stadt/oberflaeche.js", "stadt/dorf.js", "stadt/start.js"],
    stil: ["stadt/stadt.css"], modelleNach: "stadt/modelle.js", nachladen: {}, stempel: {},
  },
  "stadt-leicht": {
    quelle: ["stadt-leicht/kern.js", "stadt/boden.js", "stadt-leicht/bilder.js", "stadt-leicht/szene.js", "stadt-leicht/leute.js", "stadt-leicht/boote.js",
      "stadt-leicht/tiere.js", "stadt-leicht/ton.js", "stadt-leicht/bahn.js", "stadt-leicht/fuhrwerk.js", "stadt-leicht/autos.js", "stadt-leicht/autoschau.js",
      "stadt-leicht/windmuehle.js", "stadt-leicht/himmel.js", "stadt-leicht/dorf.js", "stadt-leicht/spiel.js", "stadt-leicht/drehen.js",
      "stadt-leicht/oberflaeche.js", "stadt-leicht/korn.js", "stadt-leicht/verwalten.js", "stadt-leicht/start.js", "stadt-leicht/quests.js"],
    stil: ["stadt-leicht/leicht.css"], modelleNach: null,
    nachladen: { "stadt-leicht/autoschau.js": ["stadt-leicht/autoschau-laden.js", "LEICHT_AUTOSCHAU"],
      "stadt-leicht/quests.js": ["stadt-leicht/quests-laden.js", "LEICHT_QUESTS"], "stadt-leicht/korn.js": ["stadt-leicht/korn-laden.js", "LEICHT_KORN"] },
    stempel: { LEICHT_STEMPEL: "stadt-leicht/bilder/verzeichnis.json" },
  },
};

(async () => {
  console.log("SONDE 887 — Stadt als eigene Vite-Seiten (M5)   WURZEL " + WURZEL + "\n");
  let SEITEN = null;
  try { SEITEN = (await import(path.join(WURZEL, "vite.config.mjs"))).SEITEN || null; } catch (e) { SEITEN = null; }
  const manifest = jsonLies("bau/manifest.json") || {};
  const merk = jsonLies("bau/quelle.json") || {};
  const html = {};
  for (const n of Object.keys(PACKER)) html[n] = lies(n + ".html") || "";

  if (NUR.includes("B")) {
    /* B1 */
    for (const n of Object.keys(PACKER)) {
      const q = lies("src/" + n + ".html");
      sage(q != null && (q.match(/<!-- SKRIPTE -->/g) || []).length === 1 && q.indexOf('<script type="module" src="/@seite/' + n + '"></script>') > 0,
        "B1 src/" + n + ".html ist die Quelle (ein Block SKRIPTE, Eingang /@seite/" + n + ")", q == null ? "fehlt" : "");
    }
    const packer = ["werkzeug/stadt-packen.js", "werkzeug/leicht-packen.js"].filter((f) => fs.existsSync(path.join(WURZEL, f)));
    sage(!packer.length, "B1 die Packer sind weg (der Haken baut die Seiten)", packer.join(", "));
    /* B2 */
    sage(Boolean(SEITEN), "B2 vite.config.mjs nennt SEITEN");
    for (const [n, p] of Object.entries(PACKER)) {
      const s = SEITEN && SEITEN[n];
      sage(Boolean(s) && JSON.stringify(s.quelle) === JSON.stringify(p.quelle), "B2 " + n + ": dieselben Dateien in derselben Reihenfolge wie der Packer", s ? "" : "kein Plan");
      sage(Boolean(s) && (s.modelleNach || null) === p.modelleNach, "B2 " + n + ": Modelle " + (p.modelleNach ? "hinter " + p.modelleNach : "keine") + " (wie der Packer)");
      const nl = s ? Object.fromEntries(Object.entries(s.nachladen || {}).map(([k, x]) => [k, [x.vertretung, x.fenster]])) : null;
      sage(Boolean(s) && JSON.stringify(nl, Object.keys(nl || {}).sort()) === JSON.stringify(p.nachladen, Object.keys(p.nachladen).sort())
        && JSON.stringify(Object.keys(nl).sort()) === JSON.stringify(Object.keys(p.nachladen).sort()),
        "B2 " + n + ": dieselben Vertretungen und window-Namen (" + (Object.keys(p.nachladen).length ? Object.values(p.nachladen).map((x) => x[1]).join(", ") : "keine") + ")");
      sage(Boolean(s) && JSON.stringify(s.stempel || {}) === JSON.stringify(p.stempel), "B2 " + n + ": dieselben Stempel (" + (Object.keys(p.stempel).join(", ") || "keine") + ")");
    }
    /* B3 */
    for (const [n, p] of Object.entries(PACKER)) {
      const e = manifest["src/" + n + ".html"];
      sage(Boolean(e && e.isEntry && new RegExp("^" + n + "-" + HASH + "\\.js$").test(e.file) && (e.css || []).length === 1 && new RegExp("^t-" + n + "-" + HASH + "\\.css$").test(e.css[0])),
        "B3 Manifest: " + n + " ist ein Eingang (bau/" + n + "-<hash>.js, ein Stilblatt)", e ? e.file + " " + (e.css || []).join(",") : "fehlt");
      for (const datei of Object.keys(p.nachladen)) {
        const x = manifest[datei];
        sage(Boolean(x && x.isEntry && /^leicht-[a-z]+-[A-Za-z0-9_-]{8}\.js$/.test(x.file)), "B3 Manifest: " + datei + " ist ein eigenes Stück", x ? x.file : "fehlt");
      }
    }
    const genannt = [];
    Object.values(manifest).forEach((e) => { if (e && e.file) genannt.push(e.file); (e && e.css || []).forEach((c) => genannt.push(c)); });
    const fehlen = genannt.filter((f) => !fs.existsSync(path.join(WURZEL, "bau", f)) || !fs.statSync(path.join(WURZEL, "bau", f)).size);
    sage(genannt.length > 1 && !fehlen.length, "B3 jede Datei des Manifests liegt in bau/ und ist nicht leer", fehlen.join(", "));
    const idx = lies("index.html") || "";
    const dm = /window\.DMA_MODUL = (\{[^\n]*?\});/.exec(idx);
    let dmk = {}; try { dmk = dm ? JSON.parse(dm[1]) : {}; } catch (e) { dmk = {}; }
    sage(Boolean(dm) && !Object.keys(dmk).some((k) => /stadt|leicht/.test(k)) && !/bau\/(stadt|leicht|t-stadt)/.test(idx),
      "B3 index.html bleibt unberührt: DMA_MODUL und die Seite nennen keine Stücke der Stadt", Object.keys(dmk).join(", "));
    /* B4 */
    for (const n of Object.keys(PACKER)) {
      const h = html[n];
      sage(/^<!doctype html>\n<!-- GEBAUT aus src\//i.test(h), "B4 " + n + ".html ist gebaut (Hinweis direkt hinter dem doctype)");
      sage(Boolean(merk.seiten && merk.seiten[n + ".html"]) && merk.seiten[n + ".html"] === sha1(h), "B4 " + n + ".html = Stand des letzten Baus (bau/quelle.json, nicht von Hand geändert)",
        merk.seiten ? String(merk.seiten[n + ".html"]).slice(0, 10) + " / " + sha1(h).slice(0, 10) : "keine Angabe");
    }
    const vite = path.join(WURZEL, "node_modules", ".bin", "vite");
    if (!fs.existsSync(vite) || !fs.existsSync(path.join(WURZEL, "src", "stadt.html"))) sage(false, "B4 frischer Bau: Vite und src/stadt.html nötig");
    else {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dma-887-stadt-"));
      try {
        const r = spawnSync(vite, ["build", "--outDir", tmp, "--emptyOutDir", "--logLevel", "error"], { cwd: WURZEL, encoding: "utf8", timeout: 300000,
          env: Object.assign({}, process.env, { NODE_ENV: "production", DMA_EINGABEN: tmp + "-e.json" }) });
        const frisch = {};
        for (const n of Object.keys(PACKER)) { try { frisch[n] = fs.readFileSync(path.join(tmp, "src", n + ".html"), "utf8"); } catch (e) { frisch[n] = null; } }
        for (const n of Object.keys(PACKER)) sage(r.status === 0 && frisch[n] === html[n], "B4 ein frischer Vite-Bau aus den Quellen gibt Byte für Byte dieselbe " + n + ".html (kein veralteter Stand)",
          r.status !== 0 ? String(r.stderr || "").split("\n")[0].slice(0, 120) : "");
        const eing = (() => { try { return JSON.parse(fs.readFileSync(tmp + "-e.json", "utf8")); } catch (e) { return null; } })();
        sage(Boolean(eing) && JSON.stringify(eing) === JSON.stringify(merk.eingaben), "B6 bau/quelle.json „eingaben“ = was ein frischer Bau liest", eing ? eing.length + " Dateien" : "–");
      } finally { fs.rmSync(tmp, { recursive: true, force: true }); fs.rmSync(tmp + "-e.json", { force: true }); }
    }
    /* B5 */
    for (const [n, p] of Object.entries(PACKER)) {
      const h = html[n], e = manifest["src/" + n + ".html"] || {};
      const kopf = (h.split("</head>")[0] || "");
      sage(Boolean(e.file) && kopf.indexOf('<link rel="modulepreload" crossorigin href="bau/' + e.file + '">') >= 0 && kopf.indexOf('<link rel="stylesheet" crossorigin href="bau/' + (e.css || [])[0] + '">') >= 0
        && !/<script[^>]*type="module"/.test(kopf), "B5 " + n + ": im Kopf modulepreload und Stilblatt aus bau/ (kein Modul läuft vor dem Lader)");
      const lader = (/<!-- SKRIPTE -->([\s\S]*?)<!-- \/SKRIPTE -->/.exec(h) || [])[1] || "";
      const liste = (/\n {2}(\[[^\n]*\])\.forEach\(function \(s\) \{ document\.write\('<script src=/.exec(lader) || [])[1];
      sage(Boolean(liste) && liste === JSON.stringify(p.quelle), "B5 " + n + ": ?quelle=1 lädt die Quellen des Packers einzeln, in derselben Reihenfolge");
      sage(lader.indexOf("document.write('<script type=\"module\" crossorigin src=\"bau/" + e.file + "\"><\\/script>')") > 0 && !/<script[^>]*src="bau\//.test(h.replace(/<!-- SKRIPTE -->[\s\S]*?<!-- \/SKRIPTE -->/, "")),
        "B5 " + n + ": gebaut läuft genau das eine Modul aus bau/ (im Lader, nach allen anderen Skripten)");
      sage((/\[("[^"\]]+\.css")\]\.forEach/.exec(lader) || [])[1] === JSON.stringify(p.stil[0]), "B5 " + n + ": ?quelle=1 nimmt das Quell-Stilblatt " + p.stil[0]);
      for (const [datei, [, fenster]] of Object.entries(p.nachladen)) {
        const x = manifest[datei];
        sage(Boolean(x) && lader.indexOf("if (!q) window." + fenster + ' = "bau/' + x.file + '";') >= 0, "B5 " + n + ": window." + fenster + " = bau/" + (x ? x.file : "?") + " (nur gebaut)");
      }
      for (const [k, d] of Object.entries(p.stempel)) {
        const soll = fs.existsSync(path.join(WURZEL, d)) ? sha1(fs.readFileSync(path.join(WURZEL, d))).slice(0, 10) : "";
        sage(lader.indexOf("window." + k + ' = "' + soll + '";') >= 0, "B5 " + n + ": window." + k + " = Stempel von " + d + " (" + soll + ", auch mit ?quelle=1)");
      }
      sage(!/\.min\.js/.test(h), "B5 " + n + ": nennt keine alte .min.js mehr");
    }
    /* B6 */
    const ein = merk.eingaben || [];
    const muss = ["src/stadt.html", "src/stadt-leicht.html", "stadt/modelle.js", "stadt/kern.js", "stadt/modelle/koelnerdom.js", "stadt/stadt.css", "stadt/boden.js",
      "stadt-leicht/korn.js", "stadt-leicht/korn-laden.js", "stadt-leicht/leicht.css", "stadt-leicht/bilder/verzeichnis.json"];
    sage(muss.every((f) => ein.indexOf(f) >= 0), "B6 bau/quelle.json kennt die Eingaben der Seiten (" + ein.length + ", u. a. stadt/modelle/…, das Verzeichnis der Bilder)",
      muss.filter((f) => ein.indexOf(f) < 0).join(", "));
    let MB = null; try { MB = require(path.join(WURZEL, "werkzeug", "modul-bauen.js")); } catch (e) { MB = null; }
    sage(Boolean(MB) && MB.summe(WURZEL) === merk.summe, "B6 Prüfsumme (mit den Eingaben der Seiten) = bau/quelle.json");
    if (MB && ein.length) {
      const ohne = MB.summe(WURZEL, []), mit = MB.summe(WURZEL);
      sage(ohne !== mit, "B6 eine Datei aus stadt/ oder stadt-leicht/ gehört zur Prüfsumme (sonst baute eine Änderung dort nicht neu)");
    }
    /* B7 */
    const sw = lies("sw.js") || "";
    const BAU = (/var BAU = (\/.*\/);/.exec(sw) || [])[1];
    let re = null; try { re = BAU ? eval(BAU) : null; } catch (e) { re = null; }
    const stuecke = genannt.filter((f) => /^(stadt|leicht|t-stadt)/.test(f)).map((f) => "bau/" + f);
    sage(Boolean(re) && stuecke.length >= 7 && stuecke.every((f) => re.test(f)), "B7 sw.js: die Stücke der Seiten fallen unter die Regel für bau/ (ohne Nachfrage aus dem Speicher)", stuecke.length + " Stücke");
    /* B8 im Wegwerf-Ordner */
    if (!MB || !fs.existsSync(path.join(WURZEL, "src", "stadt-leicht.html"))) sage(false, "B8 Wächter: modul-bauen.js und src/stadt-leicht.html nötig");
    else {
      const T = fs.mkdtempSync(path.join(os.tmpdir(), "dma-887-waechter-"));
      try {
        const kopie = (rel) => { const q = path.join(WURZEL, rel), z = path.join(T, rel); fs.mkdirSync(path.dirname(z), { recursive: true }); fs.copyFileSync(q, z); };
        const baumL = (o) => !fs.existsSync(o) ? [] : fs.readdirSync(o, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? baumL(path.join(o, e.name)) : [path.join(o, e.name)]);
        ["vite.config.mjs", "package-lock.json", "stadt.html", "stadt-leicht.html"].concat(ein).forEach(kopie);
        baumL(path.join(WURZEL, "src")).forEach((f) => kopie(path.relative(WURZEL, f)));
        baumL(path.join(WURZEL, "bau")).forEach((f) => kopie(path.relative(WURZEL, f)));
        fs.symlinkSync(path.join(WURZEL, "node_modules"), path.join(T, "node_modules"));
        const r0 = MB.bauen(T);
        sage(!r0.fehler && !r0.gebaut, "B8 Ausgangslage: die Kopie gilt als gebaut (Prüfsumme gleich, nichts zu tun)", r0.fehler || (r0.gebaut ? "baute neu" : ""));
        const m0 = JSON.parse(fs.readFileSync(path.join(T, "bau", "manifest.json"), "utf8"));
        fs.appendFileSync(path.join(T, "stadt-leicht", "korn-laden.js"), "\nwindow.__sonde887 = 1;\n");   /* Code, kein Kommentar: der fiele beim Verkleinern weg */
        const r1 = MB.bauen(T);
        const m1 = JSON.parse(fs.readFileSync(path.join(T, "bau", "manifest.json"), "utf8"));
        const name = (m, k) => (m[k] || {}).file;
        sage(!r1.fehler && r1.gebaut && name(m1, "src/stadt-leicht.html") !== name(m0, "src/stadt-leicht.html") && name(m1, "src/stadt.html") === name(m0, "src/stadt.html")
          && name(m1, "src/rueckfrage.js") === name(m0, "src/rueckfrage.js") && fs.readFileSync(path.join(T, "stadt-leicht.html"), "utf8").indexOf("bau/" + name(m1, "src/stadt-leicht.html")) > 0,
          "B8 eine Zeile Code in stadt-leicht/korn-laden.js baut neu: nur stadt-leicht bekommt einen neuen Namen, die Seite nennt ihn",
          name(m0, "src/stadt-leicht.html") + " → " + name(m1, "src/stadt-leicht.html") + "; stadt " + (name(m1, "src/stadt.html") === name(m0, "src/stadt.html") ? "gleich" : "NEU"));
        fs.appendFileSync(path.join(T, "stadt.html"), "<!-- von Hand -->\n");
        const vorher = baumL(path.join(T, "bau")).map((f) => f + sha1(fs.readFileSync(f))).sort().join("|");
        fs.appendFileSync(path.join(T, "stadt-leicht", "korn-laden.js"), "\n/* noch eine Zeile */\n");
        const r2 = MB.bauen(T);
        const nachher = baumL(path.join(T, "bau")).map((f) => f + sha1(fs.readFileSync(f))).sort().join("|");
        sage(Boolean(r2.fehler) && /von Hand/.test(r2.fehler) && r2.karte === null && nachher === vorher && /<!-- von Hand -->\n$/.test(fs.readFileSync(path.join(T, "stadt.html"), "utf8")),
          "B8 stadt.html im Hauptordner von Hand geändert: laute Meldung, nichts überschrieben, bau/ Byte für Byte wie vorher", String(r2.fehler || "kein Fehler").slice(0, 100));
      } finally { fs.rmSync(T, { recursive: true, force: true }); }
    }
    sage(/function hauptseite\(u\)/.test(sw) && /return u\.pathname === w \|\| u\.pathname === w \+ "index\.html";/.test(sw), "B7 sw.js: die Seiten selbst laufen am Helfer vorbei (nur index.html ist Hauptseite)");
  }

  /* ===================== S: im Browser ===================== */
  if (NUR.includes("S")) {
    console.log("");
    const { chromium } = require("/tmp/claude-0/node_modules/playwright");
    const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
    const log = [];
    const ELTERN = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><body style="margin:0">'
      + '<div style="width:360px;height:225px"><iframe id="r" style="border:0;width:100%;height:100%" src="/stadt-leicht.html?eingebettet=1&mini=1&demo=1&leute=0&gaeste=0&quest=1&jahr=herbst"></iframe></div></body>';
    const srv = http.createServer((q, a) => {
      const p = decodeURIComponent(q.url.split("?")[0]);
      if (p === "/__eltern887.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end(ELTERN); }
      const f = path.join(WURZEL, p);
      const da = f.startsWith(WURZEL) && fs.existsSync(f) && !fs.statSync(f).isDirectory();
      log.push({ p, url: q.url, s: da ? 200 : 404, t: Date.now() });
      if (!da) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      fs.createReadStream(f).pipe(a);
    });
    await new Promise((r) => srv.listen(0, "127.0.0.1", r));
    const B = "http://127.0.0.1:" + srv.address().port;
    const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    const lauf = async (url, o) => {
      o = o || {};
      const ctx = await br.newContext({ viewport: o.vp || { width: 900, height: 600 }, serviceWorkers: "block" });
      await ctx.route(/cdn\.jsdelivr\.net/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "window.supabase=null;" }));
      await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
      /* Ladebild: steht es, bevor das erste Skript der Stadt läuft? (bei DOMContentLoaded und beim ersten Bild nachgesehen) */
      await ctx.addInitScript(() => {
        window.__l887 = { dcl: null };
        document.addEventListener("DOMContentLoaded", () => { const l = document.getElementById("lLade"); window.__l887.dcl = l ? l.className : "fehlt"; });
      });
      const pg = await ctx.newPage(); const pe = [];
      pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
      const ab = log.length;
      await pg.goto(B + url, { waitUntil: "load", timeout: 180000 });
      const ziel = o.rahmen ? pg.frames().find((f) => /stadt-leicht\.html/.test(f.url())) : pg;
      const fertig = await ziel.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 180000 }).then(() => true, () => false);
      const t = await (o.danach ? o.danach(ziel) : null);
      await pg.waitForTimeout(o.warte || 1500);
      const info = await ziel.evaluate(() => ({
        fehler: window.__fehler || null,
        module: [...document.querySelectorAll('script[type="module"]')].map((s) => s.getAttribute("src")),
        klassisch: [...document.scripts].filter((s) => s.src && s.type !== "module").map((s) => s.getAttribute("src").replace(/\?t=\d+$/, "")),
        stile: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href").replace(/\?t=\d+$/, "")),
        stadt: window.STADT ? Object.keys(window.STADT).sort() : null,
        modelle: window.STADT && window.STADT.MODELLE ? Object.keys(window.STADT.MODELLE).sort() : null,
        geb: window.STADT ? window.STADT.GEBUENDELT === true : null,
        lade: window.__l887 ? window.__l887.dcl : null,
        korn: !!(window.STADT && window.STADT.korn && !window.STADT.korn.vertretung),
      })).catch((e) => ({ fehler: String(e.message || e) }));
      await ctx.close();
      const l = log.slice(ab);
      return Object.assign(info, { fertig, pe, n404: l.filter((x) => x.s === 404).map((x) => x.p), abrufe: l.map((x) => x.p), extra: t });
    };
    const quellen = (r) => r.abrufe.filter((p) => /^\/stadt(-leicht)?\/[a-z-]+\.js$/.test(p));
    const LE = manifest["src/stadt-leicht.html"] || {}, ST = manifest["src/stadt.html"] || {};

    /* S1 */
    const g = await lauf("/stadt-leicht.html?demo=1&jahr=herbst");
    sage(g.fertig && !g.fehler, "S1 stadt-leicht gebaut: das erste Bild kommt (__fertig)", g.fehler || "");
    sage(!g.n404.length, "S1 … keine 404", g.n404.join(", "));
    sage(!g.pe.length, "S1 … kein Seitenfehler", g.pe.join(" | "));
    const mods = (g.module || []).filter((m) => !/leicht-(korn|quests|autoschau)-/.test(m));
    sage(mods.length === 1 && mods[0] === "bau/" + LE.file && !quellen(g).length, "S1 … genau ein Modul aus bau/ (" + (LE.file || "?") + "), keine Quelle geholt",
      (g.module || []).join(", ") + (quellen(g).length ? " · Quellen: " + quellen(g).join(", ") : ""));
    sage(JSON.stringify(g.stile) === JSON.stringify(["bau/" + (LE.css || [])[0]]), "S1 … das Stilblatt aus bau/", (g.stile || []).join(", "));
    sage(g.lade === "lk-lade lk-vorhang", "S1 … das Ladebild steht, bevor die Stadt läuft (bei DOMContentLoaded da)", String(g.lade));
    const korn = manifest["stadt-leicht/korn.js"] || {};
    sage(g.korn && (g.module || []).indexOf("bau/" + korn.file) >= 0, "S1 … die Äcker kommen nach dem ersten Bild als Modul aus bau/ (" + (korn.file || "?") + ")", (g.module || []).join(", "));
    /* S2 */
    const q = await lauf("/stadt-leicht.html?demo=1&jahr=herbst&quelle=1");
    sage(q.fertig && !q.fehler && !q.n404.length && !q.pe.length, "S2 stadt-leicht ?quelle=1: erstes Bild, keine 404, kein Seitenfehler", [q.fehler].concat(q.n404, q.pe).filter(Boolean).join(" | "));
    const qsoll = PACKER["stadt-leicht"].quelle;
    sage(JSON.stringify((q.klassisch || []).filter((s) => /^stadt/.test(s))) === JSON.stringify(qsoll), "S2 … die Quellen einzeln, in der Reihenfolge des Packers (" + qsoll.length + ")",
      (q.klassisch || []).filter((s) => /^stadt/.test(s)).length + " Skripte");
    sage(!(q.module || []).length, "S2 … kein Modul läuft (das Bündel ist nur vorgeladen)", (q.module || []).join(", "));
    sage(JSON.stringify(q.stile) === JSON.stringify(["stadt-leicht/leicht.css"]), "S2 … das Quell-Stilblatt statt des gebauten", (q.stile || []).join(", "));
    /* S3 — ausgenommen, was nur die Vertretungen im Bündel anlegen (wie beim Packer): questInfo legt quests-laden.js
       immer an, quests.js unter Sonden (?quelle=1, navigator.webdriver) nicht; korn kommt gebaut erst nach dem Bild */
    const nurVertretung = (k) => k !== "korn" && k !== "questInfo";
    sage(Boolean(g.stadt && q.stadt) && JSON.stringify(g.stadt.filter(nurVertretung)) === JSON.stringify(q.stadt.filter(nurVertretung)),
      "S3 gebaut und ?quelle=1: dieselbe Stadt (window.STADT, " + (q.stadt || []).length + " Namen)",
      g.stadt && q.stadt ? "nur gebaut: " + g.stadt.filter((k) => q.stadt.indexOf(k) < 0).join(",") + " · nur Quelle: " + q.stadt.filter((k) => g.stadt.indexOf(k) < 0).join(",") : "");
    /* S4 */
    const r = await lauf("/__eltern887.html", { rahmen: true, vp: { width: 360, height: 740 }, warte: 2500, danach: async (f) => {
      return f.evaluate(() => new Promise((ja) => {
        const ST = window.STADT, t0 = performance.now();
        const fertig = () => ja({ quests: !!(ST.quests && !ST.quests.vertretung), schau: !!(ST.autoschau && !ST.autoschau.vertretung) });
        const p = ST.autoschau && ST.autoschau.vorladen ? ST.autoschau.vorladen().catch(() => {}) : Promise.resolve();
        p.then(() => { const w = setInterval(() => { if ((ST.quests && !ST.quests.vertretung) || performance.now() - t0 > 15000) { clearInterval(w); fertig(); } }, 200); });
      }));
    } });
    sage(r.fertig && !r.n404.length && !r.pe.length, "S4 im Rahmen wie im Spiel (?eingebettet=1&mini=1): erstes Bild, keine 404, kein Seitenfehler", [r.fehler].concat(r.n404, r.pe).filter(Boolean).join(" | "));
    sage(r.lade === "lk-lade lk-vorhang lk-lade-klein", "S4 … das Ladebild steht klein", String(r.lade));
    const qs = manifest["stadt-leicht/quests.js"] || {}, as = manifest["stadt-leicht/autoschau.js"] || {};
    sage(Boolean(r.extra && r.extra.schau) && (r.module || []).indexOf("bau/" + as.file) >= 0, "S4 … die Auto-Schau kommt auf Abruf als Modul aus bau/ (" + (as.file || "?") + ")", JSON.stringify(r.extra) + " " + (r.module || []).join(", "));
    sage(Boolean(r.extra && r.extra.quests) && (r.module || []).indexOf("bau/" + qs.file) >= 0, "S4 … die Quests (?quest=1) kommen als Modul aus bau/ (" + (qs.file || "?") + ")");
    /* S5 */
    const sg = await lauf("/stadt.html?neu=1", { warte: 500 });
    const sq = await lauf("/stadt.html?neu=1&quelle=1", { warte: 500 });
    sage(sg.fertig && !sg.fehler && !sg.n404.length && !sg.pe.length, "S5 stadt.html gebaut: erstes Bild, keine 404, kein Seitenfehler", [sg.fehler].concat(sg.n404, sg.pe).filter(Boolean).join(" | "));
    sage((sg.module || []).length === 1 && sg.module[0] === "bau/" + ST.file && sg.geb === true && !sg.abrufe.some((p) => /^\/stadt\/(modelle\/)?[a-z_]+\.js$/.test(p)),
      "S5 … genau ein Modul aus bau/ (" + (ST.file || "?") + "), die Modelle stecken drin (GEBUENDELT, keine Quelle geholt)", (sg.module || []).join(", "));
    sage(sq.fertig && !sq.fehler && !sq.n404.length && !sq.pe.length && sq.geb === false && !(sq.module || []).length,
      "S5 stadt.html ?quelle=1: erstes Bild, Quellen einzeln (Modelle nachgeladen), kein Modul", [sq.fehler].concat(sq.n404, sq.pe).filter(Boolean).join(" | "));
    sage(Boolean(sg.modelle && sq.modelle) && JSON.stringify(sg.modelle) === JSON.stringify(sq.modelle) && sg.modelle.length >= 53,
      "S5 … gebaut und ?quelle=1 haben dieselben Modelle (" + (sg.modelle || []).length + ")", sg.modelle && sq.modelle ? "nur gebaut: " + sg.modelle.filter((k) => sq.modelle.indexOf(k) < 0).join(",") + " · nur Quelle: " + sq.modelle.filter((k) => sg.modelle.indexOf(k) < 0).join(",") : "");
    await br.close(); srv.close();
  }

  console.log("\n  " + (fehler ? fehler + " FEHL" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
