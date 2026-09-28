#!/usr/bin/env node
/* =====================================================================
   LEICHTE STADT PACKEN — eine kleine Datei fürs Telefon
   ---------------------------------------------------------------------
   Fügt die Skripte der leichten Stadt (stadt-leicht/*.js und den Boden
   stadt/boden.js) zu stadt-leicht/leicht.min.js zusammen (esbuild: ohne
   Kommentare) und schreibt in stadt-leicht.html den Lader mit Stempel.
   Der Stempel der Bilder (verzeichnis.json) sorgt dafür, dass neu
   gebackene Bilder sofort geladen werden. ?quelle=1 lädt die Quellen.
   AUFRUF:  node werkzeug/leicht-packen.js
   ===================================================================== */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const WURZEL = path.join(__dirname, "..");
const DATEIEN = ["stadt-leicht/kern.js", "stadt/boden.js", "stadt-leicht/bilder.js", "stadt-leicht/szene.js", "stadt-leicht/leute.js", "stadt-leicht/boote.js", "stadt-leicht/bahn.js", "stadt-leicht/fuhrwerk.js", "stadt-leicht/himmel.js", "stadt-leicht/dorf.js", "stadt-leicht/spiel.js", "stadt-leicht/oberflaeche.js", "stadt-leicht/start.js"];
function esbuildHolen() {
  try { return require("esbuild"); } catch (e) {}
  const basis = path.join(require("os").homedir(), ".npm", "_npx");
  try { for (const d of fs.readdirSync(basis)) { const p = path.join(basis, d, "node_modules", "esbuild"); if (fs.existsSync(path.join(p, "package.json"))) return require(p); } } catch (e) {}
  return null;
}
const hash = (b) => crypto.createHash("sha1").update(b).digest("hex").slice(0, 10);
const quelle = DATEIEN.map((f) => fs.readFileSync(path.join(WURZEL, f), "utf8") + "\n;").join("\n");
const eb = esbuildHolen();
const aus = eb ? eb.transformSync(quelle, { minify: true, target: "es2019", legalComments: "none" }).code : quelle;
fs.writeFileSync(path.join(WURZEL, "stadt-leicht", "leicht.min.js"), aus);
const stempel = hash(aus);
/* FASSUNG 805 — vor dem Stempeln die Zwergbilder und das kleine Verzeichnis nachziehen (werkzeug/leicht-zwerg.py). */
try { require("child_process").execSync("python3 " + JSON.stringify(path.join(__dirname, "leicht-zwerg.py")), { stdio: "inherit" }); } catch (e) { console.error("Zwergbilder: " + e.message); }
const vz = path.join(WURZEL, "stadt-leicht", "bilder", "verzeichnis.json");
const bildStempel = fs.existsSync(vz) ? hash(fs.readFileSync(vz)) : "";
const cssStempel = hash(fs.readFileSync(path.join(WURZEL, "stadt-leicht", "leicht.css")));
const lader = `<script>
/* Gebündelt (werkzeug/leicht-packen.js) – ?quelle=1 lädt die Einzeldateien */
window.LEICHT_STEMPEL = "${bildStempel}";
(function () {
  var q = /[?&]quelle=1/.test(location.search);
  var liste = q ? ${JSON.stringify(DATEIEN)} : ["stadt-leicht/leicht.min.js?v=${stempel}"];
  liste.forEach(function (s) { document.write('<script src="' + s + (q ? "?t=" + Date.now() : "") + '"><\\/script>'); });
})();
</script>`;
const htmlDatei = path.join(WURZEL, "stadt-leicht.html");
const html = fs.readFileSync(htmlDatei, "utf8")
  .replace(/<link rel="stylesheet" href="stadt-leicht\/leicht\.css[^"]*">/, `<link rel="stylesheet" href="stadt-leicht/leicht.css?v=${cssStempel}">`)
  .replace(/<!-- SKRIPTE -->[\s\S]*?<!-- \/SKRIPTE -->/, "<!-- SKRIPTE -->\n" + lader + "\n<!-- /SKRIPTE -->");
fs.writeFileSync(htmlDatei, html);
console.log("stadt-leicht/leicht.min.js: " + (aus.length / 1024).toFixed(0) + " KB (Quelle " + (quelle.length / 1024).toFixed(0) + " KB), Stempel " + stempel + ", Bilder " + bildStempel);
