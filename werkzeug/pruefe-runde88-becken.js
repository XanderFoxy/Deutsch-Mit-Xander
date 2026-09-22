/* =====================================================================
   SONDE RUNDE 88 — DER SPRUNG INS BECKEN
   ---------------------------------------------------------------------
   XANDER: „Beim Schwimmbecken sieht man immer noch nicht, dass das
   Profilbild unters Wasser taucht und dann wieder aufploppt, wenn es
   ankommt."

   NACHGESEHEN, und er hatte recht: es tauchte nie unter. Das Becken
   (.lc-becken, z-index 6) lag UNTER dem Springer (.lc-turm-springer,
   z-index 9). Beim Eintauchen wurde der Springer nur kleiner und halb
   durchsichtig — aber er blieb VOR dem Wasser. Was vor dem Wasser
   liegt, ist nicht darin.

   Geprueft wird deshalb nicht, ob sich etwas bewegt, sondern ob man
   ihn WIRKLICH NICHT MEHR SIEHT. Dazu wird ein Bildpunkt genau in der
   Mitte des Zielplatzes gemessen:
     · vor dem Sprung: die Farbe des leeren Platzes
     · waehrend er unten ist: Wasserblau
     · nachdem er aufgetaucht ist: wieder sein Bild
   Ein Bildpunkt luegt nicht.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
/* Die Farbe eines einzelnen Bildpunktes aus einer PNG-Datei. */
function punkt(datei, x, y) {
  const roh = execFileSync(FF, ["-v", "error", "-i", datei,
    "-vf", "crop=1:1:" + Math.round(x) + ":" + Math.round(y),
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 20 });
  return [roh[0], roh[1], roh[2]];
}
/* Wasserblau ist HELL (der Verlauf geht von #86d4f4 nach #1f6892)
   und deutlich blauer als rot. Die Schwelle ist mit Absicht streng:
   der Buchstabe im Springer ist #1f3b52 — dunkel und ebenfalls
   blaeulich. Eine lockere Regel haette ihn fuer Wasser gehalten, und
   genau das ist beim ersten Lauf passiert. */
const blau = (c) => c[2] > 150 && c[2] > c[0] + 60;

(async () => {
  console.log("RUNDE 88 — der Sprung ins Becken\n");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  /* Platz 6 ist frei — auf einen besetzten Platz springt niemand. */
  const bau = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const zu = document.querySelector('.lc-platz[data-lc-platz="6"]');
    const r = zu.getBoundingClientRect();
    window.DMA_PRUEFUNG.wirkung("turm", "6", "Alex", {});
    return { mitte: [r.left + r.width / 2, r.top + r.width / 2] };
  });
  await pg.waitForTimeout(300);
  const lagen = await pg.evaluate(() => {
    const d = document.querySelector(".lc-becken-decke");
    const s = document.querySelector(".lc-turm-springer");
    const b = document.querySelector(".lc-becken:not(.lc-becken-decke)");
    return { decke: d ? Number(getComputedStyle(d).zIndex) : null,
             springer: s ? Number(getComputedStyle(s).zIndex) : null,
             becken: b ? Number(getComputedStyle(b).zIndex) : null };
  });
  sage(lagen.decke !== null, "es gibt eine Wasserdecke über dem Springer");
  sage(lagen.decke > lagen.springer && lagen.springer > lagen.becken,
    "und sie liegt wirklich darüber — Becken, dann Springer, dann Decke",
    "z-index " + lagen.becken + " / " + lagen.springer + " / " + lagen.decke);

  /* Vier Aufnahmen: vor dem Einschlag, tief unten, beim Auftauchen,
     und wenn alles vorbei ist. Die Zeiten stammen aus dem Quelltext
     (Einschlag 2730 ms, tiefster Punkt 3060–3240, Auftauchen 3480). */
  const ordner = "/tmp/claude-0";
  const bilder = {};
  const nehmen = async (name, bis, vorher) => {
    await pg.waitForTimeout(Math.max(0, bis - vorher));
    const f = path.join(ordner, "becken-" + name + ".png");
    await pg.screenshot({ path: f });
    bilder[name] = f;
    return bis;
  };
  /* Die Deckkraft der Wasserdecke ueber die Zeit — sie ist das
     Neue an diesem Effekt und muss VOR dem Einschlag Null sein,
     sonst waere er schon auf dem Weg nach unten verdeckt. */
  const decke = { };
  let jetzt = 300;
  const deckkraft = () => pg.evaluate(() => {
    const d = document.querySelector(".lc-becken-decke");
    return d ? Number(getComputedStyle(d).opacity) : -1;
  });
  await pg.waitForTimeout(2100); jetzt = 2400;
  decke.vorEinschlag = await deckkraft();
  jetzt = await nehmen("unten", 3150, jetzt);
  jetzt = await nehmen("auftauchen", 3520, jetzt);
  jetzt = await nehmen("danach", 4300, jetzt);
  decke.amEnde = await deckkraft();
  await br.close(); srv.close();

  const [mx, my] = bau.mitte;
  const cUnten = punkt(bilder.unten, mx, my);
  const cAuf = punkt(bilder.auftauchen, mx, my);
  const cNach = punkt(bilder.danach, mx, my);
  const zeig = (c) => "rgb(" + c.join(",") + ")";

  console.log("\nDIE WASSERDECKE\n");
  sage(decke.vorEinschlag === 0,
    "vor dem Einschlag ist sie durchsichtig — man sieht ihn fliegen",
    "Deckkraft " + decke.vorEinschlag);
  sage(decke.amEnde === 0,
    "und wenn er aufgetaucht ist, ist sie wieder durchsichtig",
    "Deckkraft " + decke.amEnde);

  console.log("\nEIN BILDPUNKT IN DER MITTE DES ZIELPLATZES\n");
  /* Waehrend er unten ist, steht dort NUR Wasser — kein Profilbild,
     kein Buchstabe, nichts Helles. Genau das war sein Punkt. */
  sage(blau(cUnten), "waehrend er untergetaucht ist, sieht man nur Wasser", zeig(cUnten));
  sage(!blau(cAuf), "beim Auftauchen ist er wieder da", zeig(cAuf));
  sage(!blau(cNach), "und danach sitzt er auf dem Platz", zeig(cNach));

  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nEr taucht unter — und ploppt wieder auf.\n");
  process.exit(fehler ? 1 : 0);
})();
