#!/usr/bin/env node
/* =====================================================================
   BAUKASTEN-STADT PACKEN — eine verkleinerte Datei fürs Telefon
   ---------------------------------------------------------------------
   Die Stadt besteht aus gut zwanzig Skripten (Kern, Boden, Szene, jedes
   Modell eine Datei, zusammen ~3,5 MB mit allen Kommentaren). Einzeln
   geladen heißt das viele Anfragen und viel Text, den der Browser lesen
   muss. Dieses Werkzeug fügt alles in der richtigen Reihenfolge zu
   stadt/stadt.min.js zusammen (esbuild: ohne Kommentare, ohne Leerraum)
   und schreibt den Inhalts-Stempel in stadt.html. Die Quellen bleiben
   unverändert: stadt.html?quelle=1 lädt sie einzeln (zum Prüfen).

   AUFRUF:  node werkzeug/stadt-packen.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const WURZEL = path.join(__dirname, "..");
const S = (f) => path.join(WURZEL, "stadt", f);

function esbuildHolen() {
  try { return require("esbuild"); } catch (e) {}
  const basis = path.join(require("os").homedir(), ".npm", "_npx");
  try {
    for (const d of fs.readdirSync(basis)) {
      const p = path.join(basis, d, "node_modules", "esbuild");
      if (fs.existsSync(path.join(p, "package.json"))) return require(p);
    }
  } catch (e) {}
  return null;
}

/* Reihenfolge wie in stadt.html, danach die Modelle aus modelle.js */
const KOPF = ["kern.js", "pinsel.js", "boden.js", "szene.js", "himmel.js", "baustelle.js", "modelle.js"];
const FUSS = ["oberflaeche.js", "dorf.js", "start.js"];
const fenster = {};
new Function("window", "STADT", fs.readFileSync(S("modelle.js"), "utf8").replace(/window\.STADT = window\.STADT \|\| \{\};/, ""))(fenster, (fenster.STADT = {}));
const MODELLE = fenster.STADT.MODELL_DATEIEN || [];

const teile = [];
for (const f of KOPF) teile.push(fs.readFileSync(S(f), "utf8"));
/* Die Modelle sind schon da – start.js lädt sie dann nicht noch einmal */
teile.push("window.STADT.GEBUENDELT = true;");
for (const m of MODELLE) teile.push(fs.readFileSync(S("modelle/" + m + ".js"), "utf8"));
for (const f of FUSS) teile.push(fs.readFileSync(S(f), "utf8"));
const quelle = teile.map((t) => t + "\n;").join("\n");

const eb = esbuildHolen();
let aus = quelle;
if (eb) {
  aus = eb.transformSync(quelle, { minify: true, target: "es2019", legalComments: "none" }).code;
} else {
  console.warn("esbuild fehlt – die Datei wird nur zusammengefügt, nicht verkleinert.");
}
fs.writeFileSync(S("stadt.min.js"), aus);
const stempel = crypto.createHash("sha1").update(aus).digest("hex").slice(0, 10);
const cssStempel = crypto.createHash("sha1").update(fs.readFileSync(S("stadt.css"))).digest("hex").slice(0, 10);

/* stadt.html: Bündel mit Stempel; ?quelle=1 lädt die Einzeldateien */
const html = fs.readFileSync(path.join(WURZEL, "stadt.html"), "utf8");
const lader = `<script>
/* Gebündelt (werkzeug/stadt-packen.js) – ?quelle=1 lädt die Einzeldateien */
(function () {
  var q = /[?&]quelle=1/.test(location.search);
  var liste = q ? ${JSON.stringify(KOPF.concat(FUSS).map((f) => "stadt/" + f))} : ["stadt/stadt.min.js?v=${stempel}"];
  liste.forEach(function (s) { document.write('<script src="' + s + (q ? "?t=" + Date.now() : "") + '"><\\/script>'); });
})();
</script>`;
const neu = html
  .replace(/<link rel="stylesheet" href="stadt\/stadt\.css[^"]*">/, `<link rel="stylesheet" href="stadt/stadt.css?v=${cssStempel}">`)
  .replace(/<!-- SKRIPTE -->[\s\S]*?<!-- \/SKRIPTE -->|(<script src="stadt\/[^"]+"><\/script>\s*)+/, "<!-- SKRIPTE -->\n" + lader + "\n<!-- /SKRIPTE -->\n");
fs.writeFileSync(path.join(WURZEL, "stadt.html"), neu);
console.log("stadt/stadt.min.js: " + (aus.length / 1024).toFixed(0) + " KB (Quelle " + (quelle.length / 1024).toFixed(0) + " KB), Stempel " + stempel + ", " + MODELLE.length + " Modelle");
