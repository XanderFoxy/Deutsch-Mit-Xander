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
   DIESES WERKZEUG baut aus dem Original kleine Kopien (WebP), genau so
   zugeschnitten wie object-fit: cover es zeigt (die Mitte, quadratisch), und
   schreibt sie mit Stempel (?v= aus dem Inhalt) als src/srcset in index.html.
   Danach hält der Pre-Commit-Haken (fassung-setzen.js --nur-stempel) die
   Stempel aktuell.
   WELCHE GRÖSSE – „es muss gleich aussehen“: Chrome malt ein großes Bild nicht
   aus dem Original, sondern aus einer Mip-Stufe (das Bild je Stufe halbiert,
   Kästchen-Mittel), und zwar der kleinsten, die noch mindestens so groß ist
   wie die Fläche auf dem Schirm; das Kippen um −3° (.avatar-wrap) tastet
   daraus ab. Beim heutigen Original (Seite 4632) sind das 144,75 px für
   1x (76 Gerätepixel) und 289,5 px für 2x und 3x (152 bzw. 228). Genau diese
   Stufen baut das Werkzeug nach (Kästchenfilter, Größen aus dem Original
   gerechnet) – dann tastet Chrome aus demselben Bild ab wie bisher.
   Gemessen 26.10. (Sonde pruefe-886-foto.js, Teil V, gegen das echte
   Original von github): Kopien in Gerätegröße (76/152/228, Lanczos) wirkten
   sichtbar weicher (roh 34,7/35,1/36,3 dB), die Mip-Stufen 145/290 kommen
   näher (37,5/36,6/36,6 dB); schärfen, mehr Qualität (95/99: +0,1…0,5 dB)
   oder größere Kopien bringen nichts Nennenswertes mehr.
   DAS ORIGINAL KOMMT NICHT INS REPO (1,3 MB; jede Kopie des Repos trüge es
   mit): es liegt in XanderFoxy/Deutsch, Bilder2/9ob2nzt2.jpeg, und wird für
   einen neuen Bau von dort geholt und als Pfad übergeben. Ins Repo kommen nur
   die Kopien (zusammen ~15 KB; ein Gerät holt eine davon).
   Aufruf:  node werkzeug/foto-ueber.js <Original.jpeg>
            QUALITAET=90 FILTER=Box GROESSEN=145,290,290 node werkzeug/foto-ueber.js <Original>
            (GROESSEN = Pixel der Kopie für 1x,2x,3x; sonst aus dem Original gerechnet)
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
const PUNKTE = 76;   // Fläche des Fotos in CSS-Pixeln (styles.css: .avatar-wrap img 84 px, Rahmen 4 px, border-box)
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
/* Je Dichte 1x/2x/3x die Mip-Stufe, aus der Chrome das Original malt: so lange halbieren, wie es noch für die Fläche reicht. */
const mipStufe = (ziel) => { let s = seite; while (s / 2 >= ziel) s /= 2; return Math.round(s); };
const GROESSEN = process.env.GROESSEN ? process.env.GROESSEN.split(",").map(Number) : [1, 2, 3].map((d) => mipStufe(PUNKTE * d));
const dateien = {};
const zwischen = fs.mkdtempSync(path.join(require("os").tmpdir(), "foto-ueber-"));
[...new Set(GROESSEN)].forEach((g) => {
  const ziel = path.join(WURZEL, name(g)), png = path.join(zwischen, g + ".png");
  execFileSync("convert", [quelle + "[0]", "-auto-orient"].concat(SRGB ? ["-profile", SRGB] : [], ["-gravity", "center",
    "-crop", seite + "x" + seite + "+0+0", "+repage", "-filter", process.env.FILTER || "Box", "-resize", g + "x" + g + "!", "-strip", "PNG24:" + png]));
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-c:v", "libwebp", "-quality", String(QUALITAET),
    "-compression_level", "6", "-preset", "photo", "-map_metadata", "-1", ziel]);
  dateien[g] = name(g) + "?v=" + stempel(ziel);
  console.log("  " + name(g).padEnd(28) + String(fs.statSync(ziel).size).padStart(7) + " Bytes");
});
fs.rmSync(zwischen, { recursive: true, force: true });
/* Alte Kopien, die nicht mehr gebraucht werden, fliegen raus */
fs.readdirSync(path.join(WURZEL, "bilder")).filter((n) => /^ueber-alex-\d+\.webp$/.test(n) && !GROESSEN.some((g) => n === "ueber-alex-" + g + ".webp"))
  .forEach((n) => { fs.unlinkSync(path.join(WURZEL, "bilder", n)); console.log("  entfernt: bilder/" + n); });

/* In index.html: das Bild in „Über mich“ (.avatar-wrap) – src = die 2x-Kopie (Browser ohne srcset), srcset je Dichte;
   ist die Kopie für 3x dieselbe wie für 2x, steht sie nur einmal da (ein Gerät mit 3x nimmt dann die 2x-Kopie). */
const indexPfad = path.join(WURZEL, "index.html");
let html = fs.readFileSync(indexPfad, "utf8");
const a = html.indexOf("<img", html.indexOf('<div class="avatar-wrap">', html.indexOf('id="view-about"'))), e = html.indexOf(">", a) + 1;
if (a < 0 || e <= a || html.indexOf('id="view-about"') < 0 || a > html.indexOf('id="view-learn"')) { console.error("„Über mich“-Foto in index.html nicht gefunden"); process.exit(1); }
const block = html.slice(a, e);
const kandidaten = GROESSEN.map((g, i) => ({ u: dateien[g], d: i + 1 })).filter((k, i, l) => !l.slice(0, i).some((v) => v.u === k.u));
const neu = block.replace(/<img [^>]*>/, (img) => {
  const t = img.replace(/ src="[^"]*"/, ' src="' + dateien[GROESSEN[1]] + '"').replace(/ srcset="[^"]*"/, "");
  return t.replace(/ src="[^"]*"/, (m) => m + ' srcset="' + kandidaten.map((k) => k.u + " " + k.d + "x").join(", ") + '"');
});
html = html.slice(0, a) + neu + html.slice(e);
fs.writeFileSync(indexPfad, html);
console.log("index.html: " + (neu.match(/<img [^>]*>/) || [""])[0]);
