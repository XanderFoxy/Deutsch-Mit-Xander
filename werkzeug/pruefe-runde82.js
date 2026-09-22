/* =====================================================================
   SONDE RUNDE 82 — der Rest von Xanders Liste aus Runde 76
   ---------------------------------------------------------------------
   Drei Punkte, die seit Runde 76 offen standen:
     · „Salve auf mehrere"
     · „Hammer mit Zufall und Glasbruch"
     · „Katapult groesser"
   Gemessen wird nicht, ob es im Quelltext steht, sondern was im
   Browser dabei herauskommt: welche Plaetze getroffen werden, wie
   viele Risse gezeichnet sind und wie breit das Katapult wirklich ist.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 82 — was aus Runde 76 offen war");
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

  /* =================================================================
     1. DIE SALVE AUF MEHRERE
     -----------------------------------------------------------------
     Die Pruefbuehne hat acht Plaetze: 1 Alex (ich), 2 Bea, 3 Cem,
     4 Dana, 5 Emmi, 6-8 frei.
     ================================================================= */
  console.log("\nDie Salve");
  const pfeilAuf = async (wen) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((w) => window.DMA_PRUEFUNG.wirkung("saugpfeil", w, "Alex"), wen);
    await new Promise((f) => setTimeout(f, 540));
    const aus = await pg.evaluate(() => [...document.querySelectorAll(".lc-platz")]
      .filter((p) => p.querySelector(".lc-pfeil")).map((p) => p.dataset.lcPlatz));
    await new Promise((f) => setTimeout(f, 2600));
    return aus;
  };
  const einer = await pfeilAuf("Bea");
  sage(einer.join(",") === "2", "ein Name trifft genau einen Platz", "getroffen: " + einer.join(","));
  const zwei = await pfeilAuf("Bea, Dana");
  sage(zwei.join(",") === "2,4", "zwei Namen mit Komma treffen beide",
    "getroffen: " + zwei.join(","));
  const nummern = await pfeilAuf("2,4");
  sage(nummern.join(",") === "2,4", "und Platznummern gehen genauso",
    "getroffen: " + nummern.join(","));
  const alle = await pfeilAuf("*");
  sage(alle.length === 5, "\u201ealle\u201c trifft weiterhin jeden besetzten Platz",
    alle.length + " Plaetze");
  /* Der gefaehrliche Fall: ein leerer Teil in der Kette. Ohne die
     Sperre faende er ueber den Rueckfall ALLE — aus der Salve wuerde
     ein Flaechenbombardement. */
  const luecke = await pfeilAuf("Bea, , Dana");
  sage(luecke.join(",") === "2,4", "eine Luecke in der Kette trifft nicht plötzlich alle",
    "getroffen: " + luecke.join(","));

  /* =================================================================
     2. HAMMER MIT ZUFALL UND GLASBRUCH
     ================================================================= */
  console.log("\nHammer mit Zufall und Glasbruch");
  const hammer = async (los) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((l) => window.DMA_PRUEFUNG.wirkung("hammer", "Bea", "Alex", { los: l }), los);
    await new Promise((f) => setTimeout(f, 900));
    const aus = await pg.evaluate(() => {
      const pl = document.querySelectorAll(".lc-platz")[1];
      const risse = [...pl.querySelectorAll(".lc-hriss")].map((p) => p.getAttribute("d"));
      const bl = pl.querySelector(".lc-hglas");
      const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
      const r = bl ? bl.getBoundingClientRect() : null;
      return { risse: risse.length, form: risse.join("|"),
               sterne: pl.querySelectorAll(".lc-zhammer-stern").length,
               deckt: r ? [r.width - k.width, r.height - k.height,
                           r.left - k.left, r.top - k.top].map((x) => Math.round(x)) : null };
    });
    await new Promise((f) => setTimeout(f, 1800));
    return aus;
  };
  const bruch = await hammer("0.1000");
  const heil = await hammer("0.8000");
  sage(bruch.risse > 8 && bruch.sterne === 0,
    "bei kleinem Los zerspringt die Scheibe statt Sterne zu werfen",
    bruch.risse + " Risse, " + bruch.sterne + " Sterne");
  sage(heil.risse === 0 && heil.sterne === 8,
    "bei grossem Los bleibt es beim alten Bild",
    heil.risse + " Risse, " + heil.sterne + " Sterne");
  sage(bruch.deckt && bruch.deckt.every((x) => Math.abs(x) <= 1),
    "die Risse bleiben IM Profilbild",
    bruch.deckt ? "Blende gegen Bild " + bruch.deckt.join(" / ") + " px" : "keine Blende");
  /* Und derselbe Wurf muss auf jedem Geraet dasselbe Bild ergeben —
     sonst sieht jeder ein anderes Muster. */
  const nochmal = await hammer("0.1000");
  sage(nochmal.form === bruch.form && bruch.form.length > 0,
    "dasselbe Los ergibt dieselben Risse (auf jedem Geraet)",
    bruch.risse + " Risse, Muster gleich: " + (nochmal.form === bruch.form));

  /* =================================================================
     3. KATAPULT GROESSER
     ================================================================= */
  console.log("\nKatapult");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("katapult", "Bea", "Alex"));
  await new Promise((f) => setTimeout(f, 700));
  const kata = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const b = pl.querySelector(".lc-katapult-bild");
    if (!b) return null;
    const r = b.getBoundingClientRect();
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    return { anteil: r.width / k.width, breit: Math.round(r.width), bild: Math.round(k.width) };
  });
  sage(kata && kata.anteil > 1.35,
    "das Katapult ist groesser als vorher (war 1,20 Bildbreiten)",
    kata ? kata.breit + " px = " + kata.anteil.toFixed(2) + " Bildbreiten (Bild "
      + kata.bild + " px)" : "nicht gefunden");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  sage(/\.lc-katapult-bild \{[\s\S]{0,180}?width: 164%;/.test(css)
    && /margin-left: -82%;/.test(css),
    "und es bleibt dabei mittig ueber dem Platz");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
