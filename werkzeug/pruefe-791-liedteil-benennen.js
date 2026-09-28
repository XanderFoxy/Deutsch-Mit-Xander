/* =====================================================================
   SONDE 689 — FUNK 135: LIEDAUSSCHNITT ENDET WIRKLICH, LIEDTEILE LOESCHEN
   ---------------------------------------------------------------------
   XANDER: „wenn man einen liedausschnitt hört ist nach dem Ende des
   liedausschnittes es so dass das Lied noch mal komplett von vorne
   anfängt in voller Länge und außerdem lassen sich erstellte liedteile
   nicht löschen"
   Gemessen:
     1. Zwei Starts kurz hintereinander (das erste play() wird
        abgebrochen), Ausschnitt 0:05–0:08 laeuft und endet.
     2. Das Echo aus dem Raum kommt NACH dem Ende — es startet nichts neu.
     3. Ein Tipp irgendwo danach startet auch nichts.
     4. Ein gemerkter Liedteil hat ein Loeschzeichen; ein Tipp fragt,
        der zweite loescht — im Waehler und im Panel.
     5. Eine mitgelieferte Stelle laesst sich ausblenden.
   ===================================================================== */
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    const st = fs.statSync(f); const typ = TYP[path.extname(f)] || "application/octet-stream";
    const r = q.headers.range && /bytes=(\d+)-(\d*)/.exec(q.headers.range);
    if (r) { const von = +r[1], bis = r[2] ? +r[2] : st.size - 1;
      a.writeHead(206, { "Content-Type": typ, "Accept-Ranges": "bytes", "Content-Range": "bytes " + von + "-" + bis + "/" + st.size, "Content-Length": bis - von + 1 });
      return fs.createReadStream(f, { start: von, end: bis }).pipe(a); }
    a.writeHead(200, { "Content-Type": typ, "Accept-Ranges": "bytes", "Content-Length": st.size }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => {
    const echt = LiveChat.lage;
    LiveChat.lage = () => Object.assign(echt(), { lage: "drin", ichName: "Alex" });
    window.__g = [];
    LiveChat.schreiben = (z) => { window.__g.push(z); return Promise.resolve(); };
  });
  console.log("\nFASSUNG 791: LIEDTEIL BENENNEN BRICHT NICHT MEHR AB (Walkie 276)\n");
  await pg.evaluate(async () => {
    const l = LiveChat.lieder()[0];
    document.getElementById("lcPlatzMenue")?.remove();
    window.DMA_PRUEF.ausschnittWahl("Alex", 1, l.titel);
    await new Promise((r) => setTimeout(r, 500));
    /* Platz zum Rollen schaffen, wie auf dem Handy mit offener Tastatur */
    document.body.style.minHeight = "4000px";
  });
  await pg.click("#lcPlatzMenue .lc-stelle-name");
  await pg.keyboard.type("Refr", { delay: 40 });
  /* Die Tastatur geht auf: die Seite rollt das Feld ins Bild – kurz nach einem Tastendruck. */
  await pg.evaluate(() => { window.scrollBy(0, 120); });
  await pg.waitForTimeout(150);
  await pg.keyboard.type("ain", { delay: 40 });
  await pg.evaluate(() => { window.scrollBy(0, 60); });
  await pg.waitForTimeout(300);
  let r = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); const f = k && k.querySelector(".lc-stelle-name"); return { offen: !!k, wert: f ? f.value : null, fokus: !!(f && document.activeElement === f) }; });
  sage(r.offen && r.wert === "Refrain", "beim Tippen des Namens rollt die Seite – das Menü bleibt offen, der Name bleibt stehen", JSON.stringify(r));
  /* Ohne Schreibfeld im Fokus schließt ein Rollen mit dem Finger weiterhin (wie bisher). */
  await pg.evaluate(() => document.activeElement && document.activeElement.blur());
  const neben = await pg.evaluate(() => { const q = document.getElementById("lcPlatzMenue").getBoundingClientRect(); return { x: 4, y: Math.min(innerHeight - 4, q.bottom + 20) }; });
  await pg.mouse.move(neben.x, neben.y);
  await pg.mouse.wheel(0, 300);
  await pg.waitForTimeout(400);
  r = await pg.evaluate(() => !!document.getElementById("lcPlatzMenue"));
  sage(!r, "ohne Schreibfeld: Rollen mit dem Rad schließt das Menü wie gewohnt", String(r));
  await br.close(); srv.close();
  console.log(fehler ? "  " + fehler + " FEHLER" : "  alles gut");
  process.exit(fehler ? 1 : 0);
})();
