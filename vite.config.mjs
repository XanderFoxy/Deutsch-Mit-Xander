/* =====================================================================
   MODUL-UMBAU (Schritt 1, MODULE-PLAN.md Abschnitt 3, M1) — VITE-BAU
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung".
   Jede Datei src/*.js ist ein eigener Eingang und wird zu
   bau/<name>-<hash>.js (Hash aus dem Inhalt: ändert sich nichts, bleibt
   die Adresse, und der Service Worker gibt sie ohne Nachfrage aus dem
   Speicher). Das Manifest bau/manifest.json sagt, welche Datei gilt;
   werkzeug/fassung-setzen.js --nur-stempel baut nur, wenn sich src/**,
   diese Datei oder package-lock.json geändert haben, und schreibt
   window.DMA_MODUL in index.html.

   FLACHER GRAPH (gegen die Hash-Kaskade): Eingänge importieren einander
   NICHT. Geteilt wird über die window-Brücke (window.LiveChat, Backend,
   DMA_*), Laden bei Bedarf über den Namen aus DMA_MODUL. Sonst bekäme
   jede Änderung an einem gemeinsamen Stück neue Namen für alle, die es
   importieren – und jedes Gerät holte nach jedem Update alles neu.

   Die Datei heißt .mjs, weil package.json KEIN "type": "module" haben
   darf (sonst brechen alle Sonden in werkzeug/, die require benutzen).
   ===================================================================== */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const HIER = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HIER, "src");

/* Jede Datei direkt in src/ (nicht in Unterordnern: die gehören als Stücke zu einem Eingang) */
const eingaenge = Object.fromEntries(
  readdirSync(SRC, { withFileTypes: true })
    .filter((e) => e.isFile() && /^[a-z0-9][a-z0-9-]*\.js$/.test(e.name))
    .map((e) => [e.name.replace(/\.js$/, ""), resolve(SRC, e.name)])
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
);

/* =====================================================================
   MODUL-UMBAU M5 (MODULE-PLAN.md Abschnitt 3) — DIE STADT ALS EIGENE VITE-SEITEN
   ---------------------------------------------------------------------
   Jede Datei src/<seite>.html ist eine eigene Seite (Vite-Mehrseiten-Eingang). Vite baut sie mit allem, was sie lädt
   – die Skripte in der Reihenfolge aus SEITEN, das Stilblatt –, zu Stücken mit Namen aus dem Inhalt in bau/
   (bau/stadt-XXXXXXXX.js, bau/t-stadt-XXXXXXXX.css …). werkzeug/modul-bauen.js legt die gebaute Seite als <seite>.html
   in den Hauptordner: dort öffnet sie der Browser, dort bettet das Spiel die leichte Stadt ein (spiel.js). Bearbeitet
   wird src/<seite>.html; die Seite im Hauptordner ist gebaut wie min/ (von Hand geändert → der Bau bricht laut ab).

   Vorher fügten die Packer werkzeug/stadt-packen.js und leicht-packen.js die Skripte von Hand zusammen und mussten nach
   jeder Änderung gerufen werden (sonst lief die Seite mit altem Code). Jetzt baut der Haken vor jedem Commit, sobald
   sich eine Datei geändert hat, die in den Bau eingeht (modul-bauen.js merkt sie sich in bau/quelle.json).

   WAS GLEICH BLEIBT: dieselben Dateien in derselben Reihenfolge wie bei den Packern (die Stadt: hinter modelle.js
   window.STADT.GEBUENDELT = true und die Modelle aus modelle.js, in deren Reihenfolge; die leichte Stadt: Auto-Schau,
   Quests und Äcker als kleine Vertretung, die Datei selbst kommt als eigenes Stück, sobald sie gebraucht wird).
   ?quelle=1 lädt weiter die Quellen einzeln, klassisch, mit ?t= (dazu das Quell-Stilblatt statt des gebauten).
   Jede Seite bekommt ihre eigene Kopie geteilter Dateien (stadt/boden.js steckt in beiden) – kein gemeinsames Stück,
   das bei jeder Änderung beide Seiten neu benennt (flacher Graph wie oben).

   WAS ANDERS IST (unsichtbar): das Bündel ist ein Modul (alle Dateien stehen ohnehin in "use strict"-Hüllen) und wird
   schon im Kopf der Seite angefordert (<link rel="modulepreload">) statt erst, wenn der Lader am Ende läuft – bei der
   leichten Stadt erst nach supabase-js. Ausgeführt wird es wie bisher am Ende der Seite, nach allen anderen Skripten.
   Das Stilblatt verkleinert Vite jetzt mit (leicht.css 36,9 → 26,3 KB). Ziel es2020 lässt ?. und ?? stehen (der Packer
   schrieb sie für es2019 um); Rollup wirft toten Code weg (Baukasten-Stadt −47 KB). Nachweis: Bildschirmfotos bei
   angehaltener Uhr Bildpunkt für Bildpunkt gleich (MODULE-PLAN.md, Logbuch M5).
   ===================================================================== */
export const SEITEN = {
  /* stadt.html — die Baukasten-Stadt (vorher werkzeug/stadt-packen.js) */
  stadt: {
    quelle: ["stadt/kern.js", "stadt/pinsel.js", "stadt/boden.js", "stadt/szene.js", "stadt/himmel.js", "stadt/baustelle.js",
      "stadt/modelle.js", "stadt/oberflaeche.js", "stadt/dorf.js", "stadt/start.js"],
    /* gebaut: hinter dieser Datei die Modelle selbst – mit ?quelle=1 lädt start.js sie einzeln nach */
    modelleNach: "stadt/modelle.js",
  },
  /* stadt-leicht.html — die leichte Stadt, auch im Rahmen des Spiels (vorher werkzeug/leicht-packen.js).
     FASSUNG 832/833 — dazu verwalten.js (833) und quests.js (832, wird nachgeladen) */
  "stadt-leicht": {
    quelle: ["stadt-leicht/kern.js", "stadt/boden.js", "stadt-leicht/bilder.js", "stadt-leicht/szene.js", "stadt-leicht/leute.js",
      "stadt-leicht/boote.js", "stadt-leicht/tiere.js", "stadt-leicht/ton.js", "stadt-leicht/bahn.js", "stadt-leicht/fuhrwerk.js",
      "stadt-leicht/autos.js", "stadt-leicht/autoschau.js", "stadt-leicht/windmuehle.js", "stadt-leicht/himmel.js",
      "stadt-leicht/dorf.js", "stadt-leicht/spiel.js", "stadt-leicht/drehen.js", "stadt-leicht/oberflaeche.js",
      "stadt-leicht/korn.js", "stadt-leicht/verwalten.js", "stadt-leicht/start.js", "stadt-leicht/quests.js"],
    /* FASSUNG 812 — die Auto-Schau (40 KB) erst beim ersten Auto (der kleine Rahmen lädt unter 300 KB);
       FASSUNG 832 — die Quests ebenso; FASSUNG 835 — die Getreidefelder: korn-laden.js malt eine einfache Fläche und
       holt das Stück, sobald die Stadt ihr erstes Bild hat (Funk 263: zuerst schnell, dann schön).
       Im Bündel steht die Vertretung, die Datei selbst wird ein eigenes Stück; window.<name> nennt es der Vertretung. */
    nachladen: {
      "stadt-leicht/autoschau.js": { vertretung: "stadt-leicht/autoschau-laden.js", fenster: "LEICHT_AUTOSCHAU", stueck: "leicht-autoschau" },
      "stadt-leicht/korn.js": { vertretung: "stadt-leicht/korn-laden.js", fenster: "LEICHT_KORN", stueck: "leicht-korn" },
      "stadt-leicht/quests.js": { vertretung: "stadt-leicht/quests-laden.js", fenster: "LEICHT_QUESTS", stueck: "leicht-quests" },
    },
    /* window.<name> = Stempel aus dem Inhalt (auch mit ?quelle=1): neu gebackene Bilder kommen sofort */
    stempel: { LEICHT_STEMPEL: "stadt-leicht/bilder/verzeichnis.json" },
  },
};

/* Die Seiten, deren Quelle da ist (im Wegwerf-Ordner der Sonde 887-bau B7 gibt es keine) */
const seitenDa = Object.keys(SEITEN).filter((n) => existsSync(resolve(SRC, n + ".html")));
for (const n of readdirSync(SRC).filter((d) => /\.html$/.test(d))) {
  if (!SEITEN[n.replace(/\.html$/, "")]) throw new Error("Bau abgebrochen: src/" + n + " hat keinen Plan in SEITEN (vite.config.mjs)");
}
const seitenEingaenge = {};
for (const n of seitenDa) {
  seitenEingaenge[n] = resolve(SRC, n + ".html");
  for (const [datei, x] of Object.entries(SEITEN[n].nachladen || {})) seitenEingaenge[x.stueck] = resolve(HIER, datei);
}

/* Die Modelle aus stadt/modelle.js, in deren Reihenfolge (wie stadt-packen.js: die Datei ausführen, nicht lesen) */
function modelleListe(datei) {
  const fenster = { STADT: {} };
  new Function("window", "STADT", readFileSync(datei, "utf8").replace(/window\.STADT = window\.STADT \|\| \{\};/, ""))(fenster, fenster.STADT);
  const liste = fenster.STADT.MODELL_DATEIEN;
  if (!Array.isArray(liste) || !liste.length) throw new Error("Bau abgebrochen: keine Modelle in " + datei);
  return liste;
}
const stempelVon = (datei) => createHash("sha1").update(readFileSync(datei)).digest("hex").slice(0, 10);
/* Prüfung Runde 2: steht vor dem Code jedes Seiten-Bündels (renderChunk unten) – mit ?quelle=1 läuft sein Code nicht */
const WACHE = "if(!/[?&]quelle=1/.test(location.search)){";

function seitenBau() {
  const VOR = "/@seite/", GEBUENDELT = "/@seite-gebuendelt";
  return {
    name: "dma-seiten",
    enforce: "pre",
    resolveId(id) {
      if (id.startsWith(VOR) && SEITEN[id.slice(VOR.length)]) return "\0seite:" + id.slice(VOR.length);
      if (id === GEBUENDELT) return "\0seite-gebuendelt";
      return null;
    },
    /* Der Eingang einer Seite: ihre Dateien in Reihenfolge. Jede mit ?seite=<name> – so ist jede Datei je Seite ein
       eigenes Modul und kein Stück wird zwischen den Seiten geteilt. */
    load(id) {
      if (id === "\0seite-gebuendelt") return "window.STADT.GEBUENDELT = true;\n";
      if (!id.startsWith("\0seite:")) return null;
      const name = id.slice("\0seite:".length), plan = SEITEN[name];
      const imp = (f) => {
        if (!existsSync(resolve(HIER, f))) this.error("Seite " + name + ": " + f + " fehlt");
        return "import " + JSON.stringify("/" + f + "?seite=" + name) + ";";
      };
      const zeilen = [];
      for (const f of plan.quelle) {
        const n = plan.nachladen && plan.nachladen[f];
        zeilen.push(imp(n ? n.vertretung : f));
        if (f === plan.modelleNach) {
          zeilen.push("import " + JSON.stringify(GEBUENDELT) + ";");
          const datei = resolve(HIER, f);
          this.addWatchFile(datei);
          for (const m of modelleListe(datei)) zeilen.push(imp("stadt/modelle/" + m + ".js"));
        }
      }
      return zeilen.join("\n") + "\n";
    },
    /* Prüfung Runde 2: die Wache am Anfang jedes Seiten-Bündels. Das Bündel steht fest in der Seite (unten), läuft also
       auch mit ?quelle=1 – dann laufen schon die Quellen, und die Wache lässt den ganzen Code des Bündels aus. Gesetzt
       NACH dem Verkleinern (order "post"), aber vor dem Namen aus dem Inhalt: der Code dazwischen bleibt Byte für Byte,
       wie esbuild ihn schreibt, und der neue Name zeigt, dass sich die Datei geändert hat (bau/ gibt der Helfer ohne
       Nachfrage aus dem Speicher). Im Block gilt dasselbe wie oben im Modul (Module sind immer streng, Funktionen im Block
       gelten im ganzen Block); das Bündel hat kein import/export (generateBundle). Die nachgeladenen Stücke brauchen keine
       Wache: mit ?quelle=1 nennt der Lader sie nicht. */
    renderChunk: {
      order: "post",
      handler(code, chunk) {
        if (!chunk.isEntry || seitenDa.indexOf(chunk.name) < 0) return null;
        return { code: WACHE + code + (code.endsWith("\n") ? "" : "\n") + "}\n", map: null };
      },
    },
    /* Die gebaute Seite: Vite hat das Bündel als <script type="module"> und das Stilblatt in den Kopf gesetzt.
       Im Kopf wird es nur angefordert (modulepreload); laufen tut es fest am Ende hinter dem Lader (Prüfung Runde 2).
       Prüfung Runde 1: mit ?quelle=1 kam das Quell-Stilblatt erst mit dem Lader am Ende (das gebaute entfernte er), bis
       dahin konnte die Seite ohne Gestaltung stehen. Jetzt schreibt ein kleines Skript VOR den beiden Zeilen mit ?quelle=1
       gleich das Quell-Stilblatt in den Kopf. Die beiden Zeilen selbst bleiben fest im HTML: geschrieben (nur ohne
       ?quelle=1) fragte die Seite Bündel und Stilblatt messbar später an (CPU 4×: +13 … +22 ms, in jedem Lauf), denn
       feste Zeilen findet der Vorab-Leser des Browsers schon in den ersten Bytes. Dass ?quelle=1 das Bündel trotzdem
       mitholt, kostet nur die Prüf- und Backwege (MODULE-PLAN.md, Logbuch M5). */
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const name = basename(ctx.filename || "").replace(/\.html$/, "");
        const plan = SEITEN[name];
        if (!plan || !ctx.chunk) return html;
        const js = "bau/" + ctx.chunk.fileName;
        const tag = '<script type="module" crossorigin src="' + js + '"></script>';
        if (html.split(tag).length !== 2) throw new Error("Bau abgebrochen: " + name + ".html – Vite hat das Bündel nicht wie erwartet eingesetzt");
        /* Stilblätter der Quelle (für ?quelle=1) */
        const quellHtml = readFileSync(ctx.filename, "utf8");
        const stile = [...quellHtml.matchAll(/<link rel="stylesheet" href="\/([^"]+)">/g)].map((m) => m[1]);
        if (!stile.length) throw new Error("Bau abgebrochen: src/" + name + ".html – kein Stilblatt");
        html = html.replace(tag, "<script>/* ?quelle=1: gleich das Quell-Stilblatt (das gebaute nimmt der Lader am Ende weg) */ "
          + "if (/[?&]quelle=1/.test(location.search)) " + JSON.stringify(stile) + ".forEach(function (s) { document.write('<link rel=\"stylesheet\" href=\"' + s + '?t=' + Date.now() + '\">'); });</script>\n"
          + '  <link rel="modulepreload" crossorigin href="' + js + '">');
        const fenster = [];
        for (const [k, datei] of Object.entries(plan.stempel || {})) {
          const f = resolve(HIER, datei);
          fenster.push("window." + k + " = " + JSON.stringify(existsSync(f) ? stempelVon(f) : "") + ";");
        }
        const stuecke = Object.values(ctx.bundle || {});
        for (const [datei, x] of Object.entries(plan.nachladen || {})) {
          const c = stuecke.find((b) => b.type === "chunk" && b.isEntry && b.name === x.stueck);
          if (!c) throw new Error("Bau abgebrochen: Stück " + x.stueck + " (" + datei + ") fehlt");
          fenster.push("if (!q) window." + x.fenster + " = " + JSON.stringify("bau/" + c.fileName) + ";");
        }
        /* Prüfung Runde 2: das Bündel steht FEST als <script type="module" src> hinter dem Lader. Vorher schrieb der Lader
           es per document.write; ob Safari unter iOS 14–17 ein so geschriebenes Modul ausführt, war nicht prüfbar. Ein
           festes Modul läuft in jedem Browser mit Modulen gleich (HTML-Norm): nach dem Parsen, vor DOMContentLoaded, nach
           allen klassischen Skripten – wie bisher. Mit ?quelle=1 lässt die Wache am Anfang des Bündels (WACHE, renderChunk
           oben) seinen Code aus. Die Quellen schreibt der Lader klassisch per document.write wie vor M5 (so lief die
           Stadt bis M5 auf allen Geräten): nur so laufen sie vor DOMContentLoaded, und darauf wartet stadt/baustelle.js
           (?baustelle, ?bauan, ?kdreh). Per createElement eingesetzt liefen sie danach, und diese Prüfbilder fielen still
           aus (gemessen, MODULE-PLAN.md, Logbuch M5). */
        const lader = "<!-- SKRIPTE -->\n<script>\n"
          + "/* Gebaut (Vite: src/" + name + ".html, werkzeug/modul-bauen.js) – das Bündel steht fest dahinter; ?quelle=1 lädt die Quellen einzeln, das Bündel lässt dann seinen Code aus */\n"
          + "(function () {\n"
          + "  var q = /[?&]quelle=1/.test(location.search);\n"
          + fenster.map((z) => "  " + z + "\n").join("")
          + "  if (!q) return;\n"
          + "  var t = \"?t=\" + Date.now();\n"
          + "  [].forEach.call(document.querySelectorAll('link[rel=\"stylesheet\"][href^=\"bau/\"]'), function (l) { l.parentNode.removeChild(l); });\n"
          + "  " + JSON.stringify(plan.quelle) + ".forEach(function (s) { document.write('<script src=\"' + s + t + '\"><\\/script>'); });\n"
          + "})();\n</script>\n" + tag + "\n<!-- /SKRIPTE -->";
        const teile = html.split(/<!-- SKRIPTE -->[\s\S]*?<!-- \/SKRIPTE -->/);
        if (teile.length !== 2) throw new Error("Bau abgebrochen: src/" + name + ".html braucht genau einen Block <!-- SKRIPTE --> … <!-- /SKRIPTE -->");
        html = teile[0] + lader + teile[1];
        /* Was nur in der Quelle steht (<!-- QUELLE: … -->) und das weggefallene vite-ignore („<img  src“) */
        html = html.replace(/<!-- QUELLE:[\s\S]*?-->\n?/g, "").replace(/<(img|script|link)  +/g, "<$1 ");
        /* Hinweis für alle, die die Seite im Hauptordner öffnen (hinter dem doctype: davor schaltete er den Quirks-Modus ein) */
        return html.replace(/^(<!doctype html>\n?)/i, "$1<!-- GEBAUT aus src/" + name + ".html (Vite, werkzeug/modul-bauen.js) – hier nichts ändern, sonst bricht der nächste Bau ab -->\n");
      },
    },
    /* Bündel und nachgeladene Stücke laufen ohne import/export (ein Stück je Seite; die Vertretungen holen ihr Stück als
       klassisches Skript) */
    generateBundle(o, bundle) {
      /* Was in den Bau eingeht (jede Datei des Modul-Graphen und die Stempel-Dateien): modul-bauen.js merkt es sich in
         bau/quelle.json und baut neu, sobald sich eine davon ändert */
      if (process.env.DMA_EINGABEN) {
        const e = new Set();
        for (const id of this.getModuleIds()) {
          const f = id.split("?")[0];
          if (id[0] !== "\0" && f.startsWith(HIER + "/") && existsSync(f)) e.add(f.slice(HIER.length + 1));
        }
        for (const n of seitenDa) for (const d of Object.values(SEITEN[n].stempel || {})) e.add(d);
        writeFileSync(process.env.DMA_EINGABEN, JSON.stringify([...e].sort(), null, 1) + "\n");
      }
      const namen = new Set(seitenDa.concat(seitenDa.flatMap((n) => Object.values(SEITEN[n].nachladen || {}).map((x) => x.stueck))));
      for (const b of Object.values(bundle)) {
        if (b.type !== "chunk" || !namen.has(b.name)) continue;
        if (b.imports.length || b.dynamicImports.length || b.exports.length || /\bimport\.meta\b/.test(b.code))
          throw new Error("Bau abgebrochen: " + b.fileName + " ist nicht eigenständig (import/export) – jede Seite und jedes nachgeladene Stück ist genau eine Datei");
        if (seitenDa.indexOf(b.name) >= 0 && !(b.code.startsWith(WACHE) && b.code.endsWith("\n}\n")))
          throw new Error("Bau abgebrochen: " + b.fileName + " ohne Wache für ?quelle=1 – mit ?quelle=1 liefen Bündel UND Quellen");
      }
    },
  };
}

/* Diese Warnungen sind beim Bau Fehler: ein leerer Eingang, ein fehlender Export, ein Kreis im Graphen
   und eval (verhindert das Verkleinern und den Code-Cache) */
const HART = new Set(["EMPTY_BUNDLE", "MISSING_EXPORT", "CIRCULAR_DEPENDENCY", "EVAL"]);

export default {
  base: "./",
  publicDir: false,
  logLevel: "warn",
  plugins: [seitenBau()],
  /* M5: die gebauten Seiten liegen im Hauptordner, ihre Stücke in bau/ – in der Seite also „bau/<datei>“
     (Stücke untereinander bleiben relativ) */
  experimental: {
    renderBuiltUrl(datei, { hostType }) { return hostType === "html" ? "bau/" + datei : { relative: true }; },
  },
  build: {
    outDir: "bau",
    emptyOutDir: false,
    manifest: "manifest.json",
    target: "es2020",
    modulePreload: { polyfill: false },
    minify: "esbuild",
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      input: { ...eingaenge, ...seitenEingaenge },
      preserveEntrySignatures: "strict",
      treeshake: { moduleSideEffects: true },
      output: {
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "t-[name]-[hash].js",
        assetFileNames: "t-[name]-[hash][extname]",
      },
      onwarn(w, weiter) {
        if (HART.has(w.code)) throw new Error("Bau abgebrochen (" + w.code + "): " + (w.message || w));
        weiter(w);
      },
    },
  },
};
