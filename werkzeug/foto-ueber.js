#!/usr/bin/env node
/* =====================================================================
   FASSUNG 886 — DAS FOTO AUF „ÜBER MICH“ ALS EIGENE KOPIE (S8, freigegeben Funk 311)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk 263):
   „sofort im Livestream wie bei HelloTalk" · (Funk 310/312): „das Maximum
   rausholen", „die maximal professionellste Lösung".
   BEFUND bis 886/S2: Das Foto kam von github.com/XanderFoxy/Deutsch/…?raw=true –
   ein fremder Server (eigene Verbindung), eine Umleitung auf
   raw.githubusercontent.com (noch eine Verbindung) und das ganze Original-
   foto (1 369 667 Byte, 4632 × 6176 Pixel), obwohl es nur 76 × 76 Punkte groß
   gezeigt wird (84 px minus 2 × 4 px Rahmen, box-sizing: border-box). Dazu
   loading="lazy": geholt wurde es erst nach dem ersten Layout.
   DIESES WERKZEUG baut aus dem Original drei kleine Kopien für 1x/2x/3x
   (76, 152, 228 Pixel, WebP), genau so zugeschnitten wie object-fit: cover
   es zeigt (die Mitte, quadratisch), und schreibt sie mit Stempel (?v= aus
   dem Inhalt) in index.html. Danach hält der Pre-Commit-Haken
   (fassung-setzen.js --nur-stempel) die Stempel aktuell.
   DAS ORIGINAL KOMMT NICHT INS REPO (1,3 MB; jede Kopie des Repos trüge es
   mit): es liegt in XanderFoxy/Deutsch, Bilder2/9ob2nzt2.jpeg, und wird für
   einen neuen Bau von dort geholt und als Pfad übergeben. Ins Repo kommen nur
   die drei Kopien (zusammen wenige KB).
   Aufruf:  node werkzeug/foto-ueber.js <Original.jpeg>
            QUALITAET=90 node werkzeug/foto-ueber.js <Original>   (dazu FILTER=Lanczos|Mitchell|Triangle)
   Abstimmen gegen das Original: NUR_V=1 QUELLE=<Original> GEGEN=<Stand vorher> node werkzeug/pruefe-886-foto.js
   Braucht ImageMagick (convert, identify: Zuschnitt und Verkleinern) und ffmpeg mit libwebp (Kodieren).
   Warum zwei Werkzeuge: ImageMagick 6.9.12 auf dem Prüfrechner übergeht -quality beim Schreiben von WebP
   (gemessen 26.10.: Qualität 50, 75, 85, 95 ergaben Byte für Byte dieselbe Datei, ≈ Qualität 75). ffmpeg
   (libwebp) hält die Qualität ein. Die Farben stimmen (Mittelwert je Kanal ±0,2 gegen das verkleinerte
   Original, libwebp und ffmpeg rechnen beide BT.601 mit begrenztem Bereich).
   ===================================================================== */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const { execFileSync } = require("child_process");
const WURZEL = path.dirname(__dirname);
const GROESSEN = [76, 152, 228];
const QUALITAET = Number(process.env.QUALITAET || 90);
const name = (g) => "bilder/ueber-alex-" + g + ".webp";
const stempel = (f) => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10);

if (!process.argv[2]) { console.error("Aufruf: node werkzeug/foto-ueber.js <Original.jpeg>  (das Original liegt nicht im Repo)"); process.exit(1); }
const quelle = path.resolve(process.argv[2]);
if (!fs.existsSync(quelle)) { console.error("Original fehlt: " + quelle); process.exit(1); }
fs.mkdirSync(path.join(WURZEL, "bilder"), { recursive: true });

/* Ausrichtung wie im Browser (EXIF), dann die Mitte quadratisch (object-fit: cover, object-position 50 % 50 %).
   Kamera-Angaben und Ort fallen weg. Das heutige Original hat weder Farbprofil noch Ausrichtung (sRGB). */
const [b, h] = execFileSync("identify", ["-format", "%w %h", quelle + "[0]"]).toString().trim().split(" ").map(Number);
const orient = execFileSync("identify", ["-format", "%[orientation]", quelle + "[0]"]).toString().trim();
const dreht = /RightTop|LeftBottom|RightBottom|LeftTop/.test(orient);
const seite = Math.min(b, h);
console.log("Original: " + (dreht ? h + " × " + b + " (gedreht)" : b + " × " + h) + ", " + fs.statSync(quelle).size + " Byte, Ausrichtung " + orient);
/* Hat ein neues Original ein Farbprofil (z. B. iPhone, Display P3), wird es nach sRGB umgerechnet (Chrome zeigt ein WebP
   ohne Profil als sRGB, sonst sähe es blasser aus) – dafür SRGB=<sRGB.icc> angeben; ohne Angabe bricht das Werkzeug ab. */
const SRGB = process.env.SRGB || "";
let profil = 0;
try { profil = execFileSync("convert", [quelle + "[0]", "icc:-"], { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 24 }).length; } catch (x) {}
if (profil && !SRGB) {
  console.error("Das Original hat ein Farbprofil: SRGB=<Pfad zu sRGB.icc> angeben"); process.exit(1);
}
const dateien = {};
const zwischen = fs.mkdtempSync(path.join(require("os").tmpdir(), "foto-ueber-"));
GROESSEN.forEach((g) => {
  const ziel = path.join(WURZEL, name(g)), png = path.join(zwischen, g + ".png");
  execFileSync("convert", [quelle + "[0]", "-auto-orient"].concat(SRGB ? ["-profile", SRGB] : []).concat(["-gravity", "center",
    "-crop", seite + "x" + seite + "+0+0", "+repage", "-filter", process.env.FILTER || "Lanczos", "-resize", g + "x" + g + "!", "-strip", "PNG24:" + png]));
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-c:v", "libwebp", "-quality", String(QUALITAET),
    "-compression_level", "6", "-preset", "photo", "-map_metadata", "-1", ziel]);
  dateien[g] = name(g) + "?v=" + stempel(ziel);
  console.log("  " + name(g).padEnd(28) + String(fs.statSync(ziel).size).padStart(7) + " Bytes");
});
fs.rmSync(zwischen, { recursive: true, force: true });

/* In index.html: das Bild in „Über mich“ (.avatar-wrap) – src = 2x (Browser ohne srcset), srcset 1x/2x/3x. */
const indexPfad = path.join(WURZEL, "index.html");
let html = fs.readFileSync(indexPfad, "utf8");
const a = html.indexOf("<img", html.indexOf('<div class="avatar-wrap">', html.indexOf('id="view-about"'))), e = html.indexOf(">", a) + 1;
if (a < 0 || e <= a || html.indexOf('id="view-about"') < 0 || a > html.indexOf('id="view-learn"')) { console.error("„Über mich“-Foto in index.html nicht gefunden"); process.exit(1); }
const block = html.slice(a, e);
const neu = block.replace(/<img [^>]*>/, (img) => {
  let t = img.replace(/ src="[^"]*"/, ' src="' + dateien[152] + '"').replace(/ srcset="[^"]*"/, "");
  return t.replace(/ src="[^"]*"/, (m) => m + ' srcset="' + dateien[76] + " 1x, " + dateien[152] + " 2x, " + dateien[228] + ' 3x"');
});
html = html.slice(0, a) + neu + html.slice(e);
fs.writeFileSync(indexPfad, html);
console.log("index.html: " + (neu.match(/<img [^>]*>/) || [""])[0]);
