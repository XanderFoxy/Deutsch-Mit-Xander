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
import { readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HIER, "src");

/* Jede Datei direkt in src/ (nicht in Unterordnern: die gehören als Stücke zu einem Eingang) */
const eingaenge = Object.fromEntries(
  readdirSync(SRC, { withFileTypes: true })
    .filter((e) => e.isFile() && /^[a-z0-9][a-z0-9-]*\.js$/.test(e.name))
    .map((e) => [e.name.replace(/\.js$/, ""), resolve(SRC, e.name)])
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
);

/* Diese Warnungen sind beim Bau Fehler: ein leerer Eingang, ein fehlender Export, ein Kreis im Graphen
   und eval (verhindert das Verkleinern und den Code-Cache) */
const HART = new Set(["EMPTY_BUNDLE", "MISSING_EXPORT", "CIRCULAR_DEPENDENCY", "EVAL"]);

export default {
  base: "./",
  publicDir: false,
  logLevel: "warn",
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
      input: eingaenge,
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
