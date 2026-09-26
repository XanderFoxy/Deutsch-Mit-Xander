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
  await pg.evaluate(() => { const l = LiveChat.lieder()[0];
    window.DMA_PRUEF.musikSpielen(l.datei, l.titel, 2, 4, true);
    window.DMA_PRUEF.musikSpielen(l.datei, l.titel, 5, 8, true);  // bricht das erste play() ab
  });
  await pg.waitForTimeout(300);
  const zustand = () => pg.evaluate(() => { const a = [...document.querySelectorAll("audio[playsinline]")].find((x) => x.src && /music/.test(x.src));
    return a ? { laeuft: !a.paused, t: a.currentTime } : { laeuft: false, t: -1 }; });
  const mitte = await (async () => { await pg.waitForTimeout(1200); return zustand(); })();
  sage(mitte.laeuft && mitte.t >= 4.5 && mitte.t < 8.2, "Der Ausschnitt läuft ab 0:05", mitte.t.toFixed(1) + " s");
  await pg.waitForTimeout(3200);
  const ende = await zustand();
  sage(!ende.laeuft, "Nach 0:08 ist Schluss");
  await pg.evaluate(() => { const l = LiveChat.lieder()[0]; window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Alex", "Alex", { lied: l.datei, liedTitel: l.titel, liedAb: 5, liedBis: 8 }); });
  await pg.waitForTimeout(900);
  const nachEcho = await zustand();
  sage(!nachEcho.laeuft, "Das späte Echo aus dem Raum startet nichts neu", nachEcho.t.toFixed(1) + " s");
  await pg.mouse.click(200, 300);
  await pg.waitForTimeout(900);
  const nachTipp = await zustand();
  sage(!nachTipp.laeuft, "Ein Tipp danach spielt nicht das ganze Lied", nachTipp.t.toFixed(1) + " s");

  /* --- Liedteile loeschen ------------------------------------------ */
  const erg = await pg.evaluate(async () => {
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    const l = LiveChat.lieder()[0];
    window.DMA_LIEDSTELLEN = Object.assign({}, window.DMA_LIEDSTELLEN || {});
    window.DMA_LIEDSTELLEN[l.datei] = [{ name: "Geliefert", ab: 30, bis: 40 }];
    document.getElementById("lcPlatzMenue")?.remove();
    window.DMA_PRUEF.ausschnittWahl("Alex", 1, l.titel);
    await warte(300);
    let k = document.getElementById("lcPlatzMenue");
    k.querySelector(".lc-ausschnitt-ab").value = "0:10";
    k.querySelector(".lc-ausschnitt-bis").value = "0:20";
    k.querySelector(".lc-stelle-name").value = "Probeteil";
    k.querySelector(".lc-stelle-merken").click();
    await warte(400);
    k = document.getElementById("lcPlatzMenue");
    const namen = () => [...document.querySelectorAll("#lcPlatzMenue .lc-stelle-farbig .lc-stelle-wort")].map((x) => x.textContent);
    const r = { vorher: namen() };
    const halter = [...k.querySelectorAll(".lc-stelle-halter")].find((h) => /Probeteil/.test(h.textContent));
    r.hatWeg = Boolean(halter && halter.querySelector(".lc-stelle-weg"));
    if (!halter) return r;
    halter.querySelector(".lc-stelle-weg").click();
    await warte(100);
    r.nachEinemTipp = namen();
    r.fragt = halter.querySelector(".lc-stelle-weg").classList.contains("lc-stelle-weg-sicher");
    halter.querySelector(".lc-stelle-weg").click();
    await warte(400);
    r.nachZweitem = namen();
    r.speicher = localStorage.getItem("dma_liedstellen");
    /* mitgelieferte Stelle */
    const h2 = [...document.querySelectorAll("#lcPlatzMenue .lc-stelle-halter")].find((h) => /Geliefert/.test(h.textContent));
    if (h2) { h2.querySelector(".lc-stelle-weg").click(); await warte(50); h2.querySelector(".lc-stelle-weg").click(); await warte(400); }
    r.nachGeliefert = namen();
    r.weg = localStorage.getItem("dma_liedstellen_weg");
    /* Panel: neu merken, dort loeschen */
    document.getElementById("lcPlatzMenue")?.remove();
    window.DMA_PRUEF.ausschnittWahl("Alex", 1, l.titel);
    await warte(300);
    k = document.getElementById("lcPlatzMenue");
    k.querySelector(".lc-ausschnitt-ab").value = "0:50";
    k.querySelector(".lc-ausschnitt-bis").value = "1:00";
    k.querySelector(".lc-stelle-name").value = "Panelteil";
    k.querySelector(".lc-stelle-merken").click();
    await warte(300);
    k.querySelector(".lc-lied-zurueck")?.click();
    await warte(300);
    document.querySelector("#lcPlatzMenue .lc-musik-panel")?.click();
    await warte(300);
    const pz = () => [...document.querySelectorAll("#lcPlatzMenue .lc-stelle-halter-zeile")].map((h) => h.textContent);
    r.panelVorher = pz();
    const ph = [...document.querySelectorAll("#lcPlatzMenue .lc-stelle-halter-zeile")].find((h) => /Panelteil/.test(h.textContent));
    if (ph) { ph.querySelector(".lc-stelle-weg").click(); await warte(50); ph.querySelector(".lc-stelle-weg").click(); await warte(400); }
    r.panelNachher = pz();
    return r;
  });
  sage(erg.vorher && erg.vorher.includes("Probeteil"), "Gemerkter Liedteil steht als Knopf da", JSON.stringify(erg.vorher));
  sage(erg.hatWeg, "Er hat ein Löschzeichen");
  sage(erg.fragt && erg.nachEinemTipp.includes("Probeteil"), "Erster Tipp fragt nur (Löschen?)");
  sage(erg.nachZweitem && !erg.nachZweitem.includes("Probeteil"), "Zweiter Tipp löscht", JSON.stringify(erg.nachZweitem));
  sage(!/Probeteil/.test(erg.speicher || ""), "Auch aus dem Speicher weg");
  sage(erg.nachGeliefert && !erg.nachGeliefert.includes("Geliefert") && /Geliefert/.test(erg.weg || ""),
    "Mitgelieferte Stelle lässt sich ausblenden", erg.weg);
  sage((erg.panelVorher || []).some((t) => /Panelteil/.test(t)), "Im Panel „Meine Abschnitte“ steht er mit Löschzeichen");
  sage(!(erg.panelNachher || []).some((t) => /Panelteil/.test(t)), "Im Panel gelöscht", JSON.stringify(erg.panelNachher));
  await pg.evaluate(() => { const l = LiveChat.lieder()[0]; window.DMA_PRUEF.ausschnittWahl("Alex", 1, l.titel); });
  await pg.waitForTimeout(400);
  if (process.argv[2]) await pg.screenshot({ path: process.argv[2] });
  await br.close(); srv.close();
  console.log(fehler ? "  " + fehler + " FEHLER" : "  alles gut");
  process.exit(fehler ? 1 : 0);
})();
