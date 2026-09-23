#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 94 — DIE TYPISCHEN MARIO-GERAEUSCHE
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Beim Ueberspringen der Personen im Mario-Modus
   moechte ich, dass die typischen Geraeusche kommen, denn Mario
   bespringt diese Personen entweder von oben oder kickt sie weg,
   genauso wie mit den Muenzen. Da hast du ja auch einen typischen
   Sound."

   Dort lagen „bonk" (Holzklopfen) und „tritt" (Fusstritt) — Geraeusche
   aus der wirklichen Welt. Jetzt zwei eigene Signale im Klang der
   Achtziger: „mariostampf" faellt von 300 auf 90 Hz, „mariokick"
   steigt von 180 auf 900 Hz. Gemessen wird beides: dass sie beim
   Springen und Kicken WIRKLICH abgespielt werden, und dass sie
   klingen wie beschrieben (fallend bzw. steigend).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Die Tonhoehe am Anfang und am Ende — ueber Nulldurchgaenge gezaehlt.
   Das genuegt vollkommen: ein Rechteckton hat in jeder Periode genau
   zwei davon. */
function hoehe(name) {
  const datei = path.join(WURZEL, "ton", name + ".opus");
  if (!fs.existsSync(datei)) return null;
  const roh = execFileSync(FFMPEG,
    ["-v", "error", "-i", datei, "-f", "f32le", "-ac", "1", "-ar", "24000", "-"],
    { maxBuffer: 1 << 28 });
  const x = new Float32Array(roh.buffer, roh.byteOffset, Math.floor(roh.length / 4));
  const teil = (von, bis) => {
    let wechsel = 0;
    const a = Math.floor(von * 24000), b = Math.min(x.length, Math.floor(bis * 24000));
    for (let i = a + 1; i < b; i++) if ((x[i - 1] < 0) !== (x[i] < 0)) wechsel++;
    return Math.round(wechsel / 2 / ((b - a) / 24000));
  };
  return { anfang: teil(0.005, 0.03), ende: teil(0.10, 0.20),
           laenge: Math.round(x.length / 24000 * 1000) };
}

(async () => {
  console.log("\nWIE DIE ZWEI TOENE GEBAUT SIND\n");
  const st = hoehe("mariostampf");
  const ki = hoehe("mariokick");
  sage(Boolean(st && ki), "beide Dateien liegen da");
  if (st) sage(st.anfang > st.ende + 40, "\u201emariostampf\u201c FAELLT \u2014 etwas wird flachgedrueckt",
    st.anfang + " Hz → " + st.ende + " Hz, " + st.laenge + " ms");
  if (ki) sage(ki.ende > ki.anfang + 40, "\u201emariokick\u201c STEIGT \u2014 etwas fliegt davon",
    ki.anfang + " Hz → " + ki.ende + " Hz, " + ki.laenge + " ms");
  if (st) sage(st.laenge <= 400, "der Stampfer ist kurz wie ein Signal", st.laenge + " ms");

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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a|mp3)$/, ""));
      return ap.call(this);
    };
  });

  console.log("\nUND OB SIE IM SPIEL WIRKLICH KLINGEN\n");
  const gehoert = await pg.evaluate(async () => {
    window.__toene = [];
    window.DMA_PRUEF.effektBuehne();
    /* Ein Weg ueber die BESETZTEN Plaetze — dort sind die Gegner. */
    window.DMA_PRUEFUNG.wirkung("mariolauf", "2-3-4", "Emmi", { los: 0.42 });
    await new Promise((f) => setTimeout(f, 6000));
    return window.__toene.slice();
  });
  const hatStampf = gehoert.indexOf("mariostampf") >= 0;
  const hatKick = gehoert.indexOf("mariokick") >= 0;
  sage(hatStampf || hatKick,
    "beim Lauf ueber die Gegner klingt ein Mario-Signal",
    gehoert.join(", ") || "nichts");
  sage(gehoert.indexOf("bonk") < 0 && gehoert.indexOf("tritt") < 0,
    "und kein Holzklopfen und kein Fusstritt mehr",
    gehoert.join(", ") || "nichts");
  /* Muenzen gibt es an den BLOECKEN, nicht an den Gegnern — dafuer
     ein zweiter Lauf ueber freie Plaetze. */
  const gaben = await pg.evaluate(async () => {
    window.__toene = [];
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("mariolauf", "6-7-8", "Alex", { los: 0.31 });
    await new Promise((f) => setTimeout(f, 6000));
    return window.__toene.slice();
  });
  sage(gaben.indexOf("mariomuenze") >= 0 || gaben.indexOf("mariopilz") >= 0,
    "an den Bloecken klingen Muenze und Pilz wie gehabt",
    gaben.join(", ") || "nichts");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
