#!/usr/bin/env node
/* =========================================================
   MODUL-UMBAU (Schritt 1, MODULE-PLAN.md Abschnitt 3, M1) — DER VITE-BAU
   ---------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung".
   Was in src/ steht, baut Vite (vite.config.mjs) zu bau/<name>-<hash>.js;
   bau/manifest.json sagt, welche Datei gilt, und daraus entsteht in
   index.html direkt hinter DMA_STEMPEL die Zeile
     <script>window.DMA_MODUL = {"rueckfrage":"bau/rueckfrage-XXXXXXXX.js"};</script>
   Gerufen wird das von werkzeug/fassung-setzen.js (--nur-stempel, also
   vom Haken vor jedem Commit; der Haken-Text bleibt, er gilt für alle
   Bäume).
   (a) Gebaut wird nur, wenn sich src/**, vite.config.mjs oder
       package-lock.json geändert haben (Prüfsumme gegen bau/quelle.json)
       oder eine Datei des Manifests fehlt. Gebaut wird in einen leeren
       Ordner außerhalb des Baums; erst wenn der Bau ganz gelungen ist,
       kommen die Dateien nach bau/, das Manifest zuletzt.
   (d) Scheitert der Bau oder fehlt Vite (kein node_modules): bau/ und
       DMA_MODUL bleiben, wie sie waren, laut auf stderr, Rückgabe ≠ 0
       (fassung-setzen.js setzt die Stempel für min/ trotzdem).
   (e) Aufräumen: gelöscht wird nur, was weder das neue Manifest noch
       eines der letzten 3 Manifeste aus git nennt – eine ältere Seite,
       die noch im Speicher eines Geräts liegt, holt ihre Stücke vom
       Server. Ohne git wird nichts gelöscht. min/ bleibt bis zum Ende
       des Umbaus.

   M5 (Stadt als eigene Seiten): src/<seite>.html baut Vite mit (siehe
   vite.config.mjs, SEITEN); die gebaute Seite liegt danach als
   <seite>.html im Hauptordner (ihre Stücke in bau/). Was in den Bau
   eingeht (auch stadt/…, stadt-leicht/…), merkt sich bau/quelle.json
   („eingaben“) – die Prüfsumme umfasst es, eine Änderung dort baut neu.
   Eine gebaute Seite, die jemand im Hauptordner von Hand geändert hat,
   wird nie still überschrieben: laute Meldung, Rückgabe ≠ 0 (die
   Änderung gehört nach src/<seite>.html).

   AUFRUF (allein, zum Nachsehen):  node werkzeug/modul-bauen.js
   ========================================================= */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync, spawnSync } = require("child_process");

const STUECK = /-[A-Za-z0-9_-]{8}\.(js|css|json)$/;

function baumDateien(ordner) {
  if (!fs.existsSync(ordner)) return [];
  return fs.readdirSync(ordner, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? baumDateien(path.join(ordner, e.name)) : [path.join(ordner, e.name)]).sort();
}
function jsonLesen(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } }

/* Prüfsumme über alles, was den Bau bestimmt (Pfad und Inhalt).
   M5: dazu jede Datei, die beim letzten Bau eingegangen ist (bau/quelle.json „eingaben“ – die Seiten laden aus stadt/
   und stadt-leicht/); ohne diese Liste dieselbe Summe wie bisher. */
function summe(wurzel, eingaben) {
  const h = crypto.createHash("sha1");
  if (eingaben === undefined) eingaben = (jsonLesen(path.join(wurzel, "bau", "quelle.json")) || {}).eingaben || [];
  const grund = baumDateien(path.join(wurzel, "src")).concat([path.join(wurzel, "vite.config.mjs"), path.join(wurzel, "package-lock.json")]);
  const dazu = [...new Set(eingaben)].sort().map((r) => path.join(wurzel, r)).filter((f) => grund.indexOf(f) < 0);
  grund.concat(dazu)
    .forEach((f) => {
      h.update(path.relative(wurzel, f).split(path.sep).join("/") + "\0");
      h.update(fs.existsSync(f) ? fs.readFileSync(f) : Buffer.from("-fehlt-"));
      h.update("\0");
    });
  return h.digest("hex");
}
/* Manifest → { name: "bau/datei" } (nur Eingänge aus src/*.js – die Seiten und ihre Stücke gehören nicht zu index.html) */
function karte(manifest) {
  const k = {};
  Object.keys(manifest || {}).sort().forEach((n) => {
    const e = manifest[n];
    if (e && e.isEntry && e.file && e.name && /^src\/[^/]+\.js$/.test(n)) k[e.name] = "bau/" + e.file;
  });
  return k;
}
/* Alle Dateien, die ein Manifest nennt (Eingänge, Stücke, Stile, Beigaben) – relativ zu bau/ */
function dateien(manifest) {
  const s = new Set();
  Object.values(manifest || {}).forEach((e) => {
    if (!e) return;
    if (e.file) s.add(e.file);
    (e.css || []).forEach((x) => s.add(x));
    (e.assets || []).forEach((x) => s.add(x));
  });
  return s;
}
/* M5: die gebauten Seiten. Vite legt src/<seite>.html gebaut unter <ausgabe>/src/ ab; sie gehören in den Hauptordner. */
const sha1 = (b) => crypto.createHash("sha1").update(b).digest("hex");
function gebauteSeiten(ausgabe) {
  const o = path.join(ausgabe, "src");
  return fs.existsSync(o) ? fs.readdirSync(o).filter((n) => /^[a-z0-9][a-z0-9-]*\.html$/.test(n)).sort() : [];
}
/* Seiten im Hauptordner, die nicht mehr so aussehen wie beim letzten Bau (von Hand geändert) → Liste der Namen */
function seitenVonHand(wurzel, merk) {
  return Object.keys((merk && merk.seiten) || {}).filter((n) => {
    const f = path.join(wurzel, n);
    return fs.existsSync(f) && sha1(fs.readFileSync(f)) !== merk.seiten[n];
  });
}
function vonHandFehler(namen) {
  return namen.join(", ") + " im Hauptordner von Hand geändert (anders als beim letzten Bau) – die Seite wird gebaut, die "
    + "Änderung gehört nach src/" + namen[0] + ". bau/ und die Seiten bleiben, wie sie sind, bis das gerichtet ist.";
}

/* Die Manifeste der letzten n Commits, die bau/manifest.json geändert haben (null: kein git) */
function gitManifeste(wurzel, n) {
  const git = (a) => execFileSync("git", ["-C", wurzel].concat(a), { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }).toString("utf8");
  try {
    if (!fs.existsSync(path.join(wurzel, ".git"))) return null;
    return git(["log", "-n", String(n), "--format=%H", "--", "bau/manifest.json"]).split("\n").filter(Boolean)
      .map((h) => { try { return JSON.parse(git(["show", h + ":bau/manifest.json"])); } catch (e) { return null; } })
      .filter(Boolean);
  } catch (e) { return null; }
}

/* → { karte, gebaut, fehler, geloescht } ; karte = null heißt: DMA_MODUL nicht anfassen */
function bauen(wurzel) {
  const SRC = path.join(wurzel, "src"), BAU = path.join(wurzel, "bau");
  const MANIFEST = path.join(BAU, "manifest.json"), QUELLE = path.join(BAU, "quelle.json");
  if (!fs.existsSync(SRC)) return { karte: null, gebaut: false, fehler: null, geloescht: 0, seiten: [] };
  const s = summe(wurzel);
  const merk = jsonLesen(QUELLE) || {};
  /* M5: eine gebaute Seite, die im Hauptordner von Hand geändert wurde, nie still überschreiben (bei jedem Lauf geprüft) */
  const vonHand = seitenVonHand(wurzel, merk);
  if (vonHand.length) return { karte: null, gebaut: false, geloescht: 0, seiten: [], fehler: vonHandFehler(vonHand) };
  let seitenMerk = merk.seiten || {};
  let manifest = jsonLesen(MANIFEST);
  const vollstaendig = Boolean(manifest) && [...dateien(manifest)].every((f) => fs.existsSync(path.join(BAU, f)))
    && Object.keys(seitenMerk).every((n) => fs.existsSync(path.join(wurzel, n)));
  let gebaut = false;
  if (merk.summe !== s || !vollstaendig) {
    const vite = path.join(wurzel, "node_modules", ".bin", "vite");
    if (!fs.existsSync(vite)) {
      return { karte: null, gebaut: false, geloescht: 0, seiten: [], fehler: "Vite fehlt (node_modules/.bin/vite) – src/ hat sich geändert, "
        + "bau/ und DMA_MODUL sind NICHT neu. Abhilfe: npm ci --prefix " + wurzel };
    }
    const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "dma-bau-"));
    const einDatei = tmp + "-eingaben.json";   /* M5: vite.config.mjs schreibt hierhin, was in den Bau eingegangen ist */
    try {
      const r = spawnSync(vite, ["build", "--outDir", tmp, "--emptyOutDir", "--logLevel", "warn"],
        { cwd: wurzel, encoding: "utf8", timeout: 300000, env: Object.assign({}, process.env, { NODE_ENV: "production", DMA_EINGABEN: einDatei }) });
      if (r.status !== 0) {
        throw new Error((String(r.stderr || "") + String(r.stdout || "") + String(r.error || "")).trim().split("\n")
          .filter((z) => z.trim()).slice(0, 8).join(" | ") || "Rückgabe " + r.status);
      }
      const neu = jsonLesen(path.join(tmp, "manifest.json"));
      if (!neu || !Object.keys(neu).length) throw new Error("kein Manifest");
      const liste = [...dateien(neu)];
      liste.forEach((f) => {
        const q = path.join(tmp, f);
        if (!fs.existsSync(q) || !fs.statSync(q).size) throw new Error("leere oder fehlende Datei " + f);
        if (/^[_.]/.test(path.basename(f))) throw new Error("Name beginnt mit _ oder . (Jekyll veröffentlicht ihn nicht): " + f);
        if (!STUECK.test(f)) throw new Error("Name ohne Hash: " + f);
      });
      /* M5: die gebauten Seiten – jede Datei aus bau/, die sie nennen, stammt aus diesem Bau; der Lader steht drin */
      const seiten = gebauteSeiten(tmp).map((n) => {
        const t = fs.readFileSync(path.join(tmp, "src", n), "utf8");
        const fremd = [...t.matchAll(/["'(]bau\/([^"'?)\s]+)/g)].map((m) => m[1]).filter((f) => liste.indexOf(f) < 0);
        if (fremd.length) throw new Error(n + " nennt Dateien, die nicht aus diesem Bau stammen: " + fremd.join(", "));
        if (!/<!-- SKRIPTE -->[\s\S]*<!-- \/SKRIPTE -->/.test(t)) throw new Error(n + ": kein Lader (<!-- SKRIPTE --> … <!-- /SKRIPTE -->)");
        return { n, t };
      });
      const eingaben = jsonLesen(einDatei) || [];
      /* erst alle Stücke, dann die Seiten (sie nennen die Stücke), dann das Manifest, zuletzt die Prüfsumme */
      liste.forEach((f) => {
        const z = path.join(BAU, f);
        fs.mkdirSync(path.dirname(z), { recursive: true });
        fs.copyFileSync(path.join(tmp, f), z);
      });
      seitenMerk = {};
      seiten.forEach(({ n, t }) => {
        /* über eine neue Datei und Umbenennen: ein Server, der die Seite gerade ausliefert, liest nie eine halbe */
        const z = path.join(wurzel, n);
        if (!fs.existsSync(z) || fs.readFileSync(z, "utf8") !== t) { fs.writeFileSync(z + ".neu", t); fs.renameSync(z + ".neu", z); }
        seitenMerk[n] = sha1(t);
      });
      fs.writeFileSync(MANIFEST, JSON.stringify(neu, null, 2) + "\n");
      let vf = "";
      try { vf = JSON.parse(fs.readFileSync(path.join(wurzel, "node_modules", "vite", "package.json"), "utf8")).version; } catch (e) {}
      const merkNeu = { summe: summe(wurzel, eingaben), vite: vf };
      if (eingaben.length) merkNeu.eingaben = eingaben;
      if (seiten.length) merkNeu.seiten = seitenMerk;
      fs.writeFileSync(QUELLE, JSON.stringify(merkNeu, null, 1) + "\n");
      manifest = neu;
      gebaut = true;
    } catch (e) {
      return { karte: null, gebaut: false, geloescht: 0, seiten: [],
        fehler: "Vite-Bau gescheitert – bau/, die Seiten und DMA_MODUL bleiben wie vorher: " + String(e.message || e).slice(0, 1500) };
    } finally {
      try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
      try { fs.rmSync(einDatei, { force: true }); } catch (e) {}
    }
  }
  /* (e) Aufräumen */
  let geloescht = 0;
  const alt = gitManifeste(wurzel, 3);
  if (alt) {
    const behalten = dateien(manifest);
    alt.forEach((m) => dateien(m).forEach((f) => behalten.add(f)));
    baumDateien(BAU).forEach((f) => {
      const rel = path.relative(BAU, f).split(path.sep).join("/");
      /* bau/daten/ verwaltet werkzeug/daten-bauen.js selbst */
      if (STUECK.test(rel) && !/^daten\//.test(rel) && !behalten.has(rel)) { fs.unlinkSync(f); geloescht++; }
    });
  }
  return { karte: karte(manifest), gebaut, fehler: null, geloescht, seiten: Object.keys(seitenMerk) };
}

/* Die Zeile in index.html (direkt hinter DMA_STEMPEL). karte = null: die bestehende Zeile bleibt. */
const ZEILE = /<script>window\.DMA_MODUL = \{[^\n]*\};<\/script>/;
function zeileSetzen(html, k) {
  if (k == null) return html;
  const z = "<script>window.DMA_MODUL = " + JSON.stringify(k) + ";</script>";
  if (ZEILE.test(html)) return html.replace(ZEILE, z);
  return html.replace(/(<script>window\.DMA_STEMPEL = \{[^\n]*\};<\/script>)/, "$1\n" + z);
}

module.exports = { bauen, summe, karte, dateien, gitManifeste, zeileSetzen, STUECK, ZEILE };

if (require.main === module) {
  const w = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
  const r = bauen(w);
  if (r.fehler) { console.error("MODUL-BAU: " + r.fehler); process.exit(2); }
  console.log((r.gebaut ? "neu gebaut: " : "unverändert: ") + JSON.stringify(r.karte) + (r.geloescht ? ", " + r.geloescht + " alte Stücke gelöscht" : ""));
}
