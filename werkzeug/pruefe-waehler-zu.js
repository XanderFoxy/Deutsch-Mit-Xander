#!/usr/bin/env node
/* =========================================================
   GEHT EIN WAEHLER WIEDER ZU?
   ---------------------------------------------------------
   GEMELDET: „Wenn ich auf mein eigenes Profilbild klicke, um
   das Menue aufzurufen, wo ich ein anderes Profilbild
   einstellen kann, moechte ich, dass es wieder schliesst,
   wenn ich in den Lernbereich klicke. Also intuitiv wie bei
   Apple. Bei dir gibt es nur, wenn man nach unten scrollt —
   es gibt gar kein Schliessen."

   Geprueft an allen Waehlern, die es gibt:
   1. Ein Tipp auf den dunklen Grund schliesst.
   2. Die Escape-Taste schliesst.
   3. Ein Tipp INNEN schliesst NICHT — sonst koennte man
      nichts mehr auswaehlen.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.bildWaehler, { timeout: 20000 });

  const oeffnen = async (welcher) => pg.evaluate((w) => {
    document.querySelectorAll(".lc-waehler-hinter").forEach((x) => x.remove());
    window.DMA_PRUEF[w]();
    return document.querySelectorAll(".lc-waehler-hinter").length;
  }, welcher);

  for (const welcher of ["bildWaehler", "sendeWaehler"]) {
    console.log("\n" + welcher.toUpperCase() + "\n");
    pruefe("geht auf", (await oeffnen(welcher)) === 1);

    const innen = await pg.evaluate(() => {
      const k = document.querySelector(".lc-waehler-hinter");
      const drin = k.querySelector(".lc-waehler") || k.firstElementChild;
      drin.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      return document.querySelectorAll(".lc-waehler-hinter").length;
    });
    pruefe("ein Tipp INNEN schliesst nicht", innen === 1, innen + " noch offen");

    const daneben = await pg.evaluate(() => {
      const k = document.querySelector(".lc-waehler-hinter");
      k.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      return document.querySelectorAll(".lc-waehler-hinter").length;
    });
    pruefe("ein Tipp DANEBEN schliesst", daneben === 0, daneben + " noch offen");

    await oeffnen(welcher);
    await pg.keyboard.press("Escape");
    const nachEsc = await pg.evaluate(() => document.querySelectorAll(".lc-waehler-hinter").length);
    pruefe("Escape schliesst auch", nachEsc === 0, nachEsc + " noch offen");
  }

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Jeder Waehler geht wieder zu.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
