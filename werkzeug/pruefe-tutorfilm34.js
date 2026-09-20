#!/usr/bin/env node
/* =========================================================
   IST JEDER TUTOR-FILM FREIGESTELLT — UND HAT ER SEINE MASKE?
   ---------------------------------------------------------
   GEMELDET: „den Tutor auf dem Android sieht man ihn
   freigestellt. Auf dem iPhone sieht man ihn mit einem
   schwarzen Hintergrund."

   Deshalb braucht jeder Tutor-Film ZWEI Dateien: das webm mit
   Alphaspur und daneben <name>-maske.mp4, aus dem das iPhone
   die Durchsichtigkeit selbst ausrechnet.

   Gemessen wird je Film:
   1. Beide Dateien liegen da und sind gleich lang.
   2. Die Alphaspur ist ECHT: die Ecken sind frei, und es gibt
      sowohl Freies als auch Deckendes. (Ein Film, dem beim
      Umkodieren die Alphaspur abhandenkommt, sieht sonst
      voellig gesund aus — genau das ist beim T-Rex schon
      einmal passiert.)
   3. Die Maske ist doppelt so breit wie der Film: links das
      Bild, rechts die Maske.
   4. Jeder Film heisst wie ein Tutor-Stueck — ein Film ohne
      Stueck wird nie gespielt.
   ========================================================= */
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const ORDNER = path.join(WURZEL, "tutor", "video");
const FF = process.env.FF || "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const PNG = require("/tmp/claude-0/node_modules/pngjs").PNG;

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const dauer = (datei, vp9) => {
  const args = [];
  if (vp9) args.push("-c:v", "libvpx-vp9");
  args.push("-i", datei);
  try { execFileSync(FF, args, { stdio: ["ignore", "ignore", "pipe"] }); }
  catch (e) {
    const m = String(e.stderr || "").match(/Duration: (\d+):(\d+):([\d.]+)/);
    if (m) return (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
  }
  return 0;
};

/* Ein Einzelbild der ALPHASPUR — und zwar mit „-c:v libvpx-vp9" vor
   dem -i. Ohne das liest ffmpeg die Alphaspur gar nicht erst und
   liefert eine Maske, die ueberall deckend ist. */
const alphaBild = (webm, ziel) => {
  execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y",
    "-c:v", "libvpx-vp9", "-i", webm,
    "-vf", "format=yuva420p,alphaextract,format=gray,select=eq(n\\,12)",
    "-frames:v", "1", ziel], { stdio: "ignore" });
};

global.window = {};
require(path.join(WURZEL, "data-tutor.js"));
const STUECKE = new Set();
for (const b in global.window.DMA_TUTOR) {
  global.window.DMA_TUTOR[b].stuecke.forEach((s) => STUECKE.add(s.ton));
}

const filme = fs.readdirSync(ORDNER).filter((f) => f.endsWith(".webm")).sort();
console.log("\nJEDER TUTOR-FILM\n");
pruefe("es gibt ueberhaupt Filme", filme.length > 0, filme.length + " Stueck");

const tmp = process.env.TMPDIR || "/tmp";
filme.forEach((f) => {
  const name = f.replace(/\.webm$/, "");
  const webm = path.join(ORDNER, f);
  const maske = path.join(ORDNER, name + "-maske.mp4");

  pruefe(name + ": heisst wie ein Tutor-Stueck", STUECKE.has(name));
  pruefe(name + ": die Maske liegt daneben", fs.existsSync(maske));
  if (!fs.existsSync(maske)) return;

  const dW = dauer(webm, true), dM = dauer(maske, false);
  pruefe(name + ": Film und Maske sind gleich lang", Math.abs(dW - dM) < 0.2,
    dW.toFixed(2) + " s / " + dM.toFixed(2) + " s");

  const bild = path.join(tmp, "tutoralpha-" + name + ".png");
  try { alphaBild(webm, bild); } catch (e) {
    pruefe(name + ": die Alphaspur laesst sich lesen", false, String(e.message).slice(0, 80));
    return;
  }
  const d = PNG.sync.read(fs.readFileSync(bild));
  const punkt = (x, y) => d.data[(d.width * y + x) << 2];
  const ecken = [punkt(2, 2), punkt(d.width - 3, 2), punkt(2, d.height - 3), punkt(d.width - 3, d.height - 3)];
  pruefe(name + ": die vier Ecken sind durchsichtig", ecken.every((v) => v < 40),
    ecken.join(", ") + " (erlaubt bis 40)");
  let frei = 0, voll = 0, ges = 0;
  for (let y = 0; y < d.height; y += 3) for (let x = 0; x < d.width; x += 3) {
    const v = punkt(x, y); ges++;
    if (v < 32) frei++; else if (v > 224) voll++;
  }
  const pFrei = frei / ges * 100, pVoll = voll / ges * 100;
  pruefe(name + ": es ist etwas zu sehen und etwas frei", pFrei > 20 && pVoll > 10,
    pFrei.toFixed(1) + " % frei, " + pVoll.toFixed(1) + " % deckend, " + d.width + "x" + d.height);
  try { fs.unlinkSync(bild); } catch (e) {}
});

console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                   : "\nJeder Tutor-Film ist freigestellt und hat seine Maske.\n");
process.exit(fehler ? 1 : 0);
