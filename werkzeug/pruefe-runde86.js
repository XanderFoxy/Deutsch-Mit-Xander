/* =====================================================================
   SONDE RUNDE 86 — Spruehdose, Spuckton und der Zauberer
   ---------------------------------------------------------------------
   Gemessen wird, was man sehen und hoeren kann: wie dicht der Lack mit
   der Zeit wird (das ist der „magische Tinten-Effekt"), dass die Dose
   von der richtigen Seite kommt, und dass wieder die alte Aufnahme des
   Spuckgeraeusches liegt.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 86 — Spruehdose, Spuckton, Zauberer");

  /* =================================================================
     1. DER ALTE SPUCKTON IST ZURUECK
     ================================================================= */
  console.log("\nDer Spuckton");
  const roh = "/tmp/claude-0/pr86-rotze.raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", "rotze.opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const dauer = fs.readFileSync(roh).length / 2 / 24000;
  sage(Math.abs(dauer - 1.35) < 0.08,
    "es ist wieder die Aufnahme von vorher (1,35 s)", dauer.toFixed(2) + " s");
  sage(fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde85", "rotze.opus")),
    "und die neue liegt im Backup, falls er es sich anders ueberlegt");

  /* =================================================================
     2. DIE SPRUEHDOSE
     ================================================================= */
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
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("\nDie Spruehdose");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => {
    window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex", { stueck: "froh" });
    window.DMA_PRUEFUNG.wirkung("spray", "Cem", "Alex", { stueck: "traurig" });
    window.DMA_PRUEFUNG.wirkung("spray", "Dana", "Alex", { stueck: "herz" });
  });
  const dichte = [];
  for (const wann of [250, 700, 1900]) {
    await new Promise((f) => setTimeout(f, wann === 250 ? 250 : wann === 700 ? 450 : 1200));
    dichte.push(await pg.evaluate(() => {
      const c = document.querySelectorAll(".lc-spray-lack")[0];
      if (!c) return -1;
      const b = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      let voll = 0;
      for (let i = 3; i < b.length; i += 4) if (b[i] > 20) voll++;
      return +(voll / (b.length / 4) * 100).toFixed(1);
    }));
  }
  sage(dichte[0] > 2 && dichte[1] > dichte[0] * 1.8 && dichte[2] > dichte[1],
    "der Lack wird Punkt fuer Punkt dichter (der magische Tinten-Effekt)",
    dichte.map((x, i) => [250, 700, 1900][i] + " ms: " + x + " %").join(", "));
  const teile = await pg.evaluate(() => ({
    dosen: document.querySelectorAll(".lc-spray-dose").length,
    nebel: document.querySelectorAll(".lc-spray-nebel").length,
    lack: document.querySelectorAll(".lc-spray-lack").length
  }));
  sage(teile.dosen === 3 && teile.lack === 3 && teile.nebel >= 40,
    "zu jedem Bild gehoeren eine Dose, ein Nebelkegel und eine Leinwand",
    teile.dosen + " Dosen, " + teile.nebel + " Nebel, " + teile.lack + " Leinwaende");
  /* Zwei Motive muessen sich unterscheiden — sonst waere die Wahl
     zwischen lachend und traurig keine. */
  const gleich = await pg.evaluate(() => {
    const c = [...document.querySelectorAll(".lc-spray-lack")];
    if (c.length < 2) return true;
    const a = c[0].getContext("2d").getImageData(0, 0, c[0].width, c[0].height).data;
    const b = c[1].getContext("2d").getImageData(0, 0, c[1].width, c[1].height).data;
    let anders = 0;
    for (let i = 0; i < a.length; i += 40) if (Math.abs(a[i] - b[i]) > 40) anders++;
    return anders < 40;
  });
  sage(!gleich, "das lachende und das traurige Gesicht sind wirklich verschieden");
  /* Und die Dose kommt von der Seite, auf der der Spruehende sitzt. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Alex sitzt auf Platz 1 (links oben). Auf Platz 4 rechts muss
     die Dose von LINKS kommen, denn von dort kommt er.
     WICHTIG: lcSpray baut die Schicht erst in einem setTimeout(i * 90),
     darum erst warten, dann lesen — sonst misst man das leere DOM. */
  await pg.evaluate(() => {
    window.DMA_PRUEFUNG.wirkung("spray", "Dana", "Alex", { stueck: "froh" });
  });
  await new Promise((f) => setTimeout(f, 250));
  const seiten = await pg.evaluate(() => {
    const d = document.querySelector(".lc-spray-dose");
    return d ? (d.classList.contains("lc-spray-dose-rechts") ? "rechts" : "links") : "-";
  });
  sage(seiten === "links",
    "die Dose kommt von der Seite, auf der der Spruehende sitzt", "Dana: von " + seiten);

  /* =================================================================
     3. DIE BEFEHLE
     ================================================================= */
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/art === "spray"\)/.test(lc) && /wirkung: "spray"/.test(lc),
    "/spray gibt es, mit Gesicht und mit Bild");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/const grund = \{ frosch: 2400, zylinder: 3400,/.test(js),
    "der Zaubertrick hat mehr Zeit bekommen");
  sage(/easing: "linear", fill: "forwards" \}\);/.test(js)
    && /ein „easing" in den OPTIONEN verbiegt/.test(js),
    "und seine Zeitachse ist linear, damit jeder Abschnitt seine Zeit behaelt");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
