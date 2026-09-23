#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DRECK BLEIBT LIEGEN, UND MAN KANN IHN WEGPUTZEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Dann haette ich gern noch alternativen
   Putzlappen, der die Scheibe wischt. Also alternativ zum
   Scheibenwischer. Und beim Scheibenwischer: wenn man ueber ein
   draufgespritztes Bild wischt, dann darf die Grundeinstellung von dem
   Dreck nicht da sein, dann muss er nur den Smiley wegwischen …
   Die Leute muessen das selber putzen entweder mit dem Scheibenwischer
   oder mit dem Schwamm, ja vielleicht ist dabei auch noch ein Eimer
   Wasser daneben, wo der Schwamm dann in den Eimer Wasser geht und dann
   wischt man die Scheibe und dann quietscht es so … oder alternativ
   dran spucken und wegputzen, und saemtlicher Dreck, der erzeugt wird
   wie durch die Vogelkacke oder irgendwas anderes, das koennen wir
   wieder sauber putzen."

   VIER MESSUNGEN:
     1. Die Vogelkacke bleibt liegen — auch nach dem Neuzeichnen.
     2. Der Schwamm holt den Eimer, wischt und macht sauber.
     3. Lappen und Spucke machen dasselbe, sehen aber anders aus.
     4. Der Scheibenwischer malt sich KEINEN eigenen Dreck mehr hin,
        wenn schon etwas auf der Scheibe liegt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
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
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDIE VOGELKACKE BLEIBT LIEGEN\n");
  const kot = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const bea = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEFUNG.wirkung("vogelkot", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 4200));
    const nachEffekt = bea().querySelectorAll(".lc-dreckfleck").length;
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 400));
    return { nachEffekt: nachEffekt,
             nachNeuZeichnen: bea().querySelectorAll(".lc-dreckfleck").length };
  });
  sage(kot.nachEffekt >= 1, "der Vogel hinterlaesst einen Fleck",
    kot.nachEffekt + " Fleck(en)");
  sage(kot.nachNeuZeichnen >= 1, "und der bleibt auch nach dem Neuzeichnen liegen",
    kot.nachNeuZeichnen + " Fleck(en)");

  console.log("\nDER SCHWAMM MIT DEM EIMER\n");
  const schwamm = await pg.evaluate(async () => {
    const bea = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    window.DMA_PRUEFUNG.wirkung("putzen", "Bea", "Alex", { stueck: "schwamm" });
    let eimer = 0, zeug = 0;
    for (let i = 0; i < 16; i++) {
      await new Promise((f) => setTimeout(f, 120));
      eimer = Math.max(eimer, document.querySelectorAll(".lc-putz-eimer").length);
      zeug = Math.max(zeug, document.querySelectorAll(".lc-putzzeug-schwamm").length);
    }
    await new Promise((f) => setTimeout(f, 2200));
    return { eimer: eimer, zeug: zeug,
             flecken: bea().querySelectorAll(".lc-dreckfleck").length };
  });
  sage(schwamm.eimer >= 1, "der Wassereimer steht daneben", schwamm.eimer + " Eimer");
  sage(schwamm.zeug >= 1, "der Schwamm wischt", schwamm.zeug + " Schwamm");
  sage(schwamm.flecken === 0, "und danach ist die Scheibe sauber",
    schwamm.flecken + " Flecken uebrig");

  console.log("\nLAPPEN UND SPUCKE\n");
  for (const [zeug, wahl] of [["lappen", ".lc-putzzeug-lappen"],
                              ["spucke", ".lc-putzzeug-spucke"]]) {
    const e = await pg.evaluate(async ([zeug, wahl]) => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung("vogelkot", "Cem", "Alex", {});
      await new Promise((f) => setTimeout(f, 4200));
      const cem = () => [...document.querySelectorAll(".lc-platz")].filter((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf("cem") >= 0)[0];
      const vorher = cem().querySelectorAll(".lc-dreckfleck").length;
      window.DMA_PRUEFUNG.wirkung("putzen", "Cem", "Alex", { stueck: zeug });
      let gesehen = 0, spucke = 0;
      for (let i = 0; i < 16; i++) {
        await new Promise((f) => setTimeout(f, 120));
        gesehen = Math.max(gesehen, document.querySelectorAll(wahl).length);
        spucke = Math.max(spucke, document.querySelectorAll(".lc-putz-spucke").length);
      }
      await new Promise((f) => setTimeout(f, 2200));
      return { vorher: vorher, gesehen: gesehen, spucke: spucke,
               nachher: cem().querySelectorAll(".lc-dreckfleck").length };
    }, [zeug, wahl]);
    sage(e.vorher >= 1 && e.gesehen >= 1 && e.nachher === 0,
      "/putzen " + zeug + " macht sauber",
      e.vorher + " Flecken → " + e.nachher + (zeug === "spucke"
        ? ", " + e.spucke + " Spucker" : ""));
  }

  console.log("\nDER SCHEIBENWISCHER MALT SICH KEINEN DRECK MEHR HIN\n");
  const wischer = await pg.evaluate(async () => {
    /* 1. Auf sauberer Scheibe darf er seinen Dreck zeigen — das ist
       der alte Gag und der bleibt. */
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("wischer", "Dana", "Alex", {});
    await new Promise((f) => setTimeout(f, 500));
    const sauber = document.querySelectorAll(".lc-wischer-klecks").length;
    await new Promise((f) => setTimeout(f, 4200));
    /* 2. Liegt aber ein aufgespruehtes Bild darauf, wischt er NUR das
       weg. */
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("spray", "Emmi", "Alex", { stueck: "herz" });
    await new Promise((f) => setTimeout(f, 7200));
    window.DMA_PRUEFUNG.wirkung("wischer", "Emmi", "Alex", {});
    await new Promise((f) => setTimeout(f, 500));
    const dreckig = document.querySelectorAll(".lc-wischer-klecks").length;
    await new Promise((f) => setTimeout(f, 3600));
    const emmi = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("emmi") >= 0)[0];
    return { sauber: sauber, dreckig: dreckig,
             lack: emmi ? emmi.querySelectorAll(".lc-sprayfarbe").length : -1 };
  });
  sage(wischer.sauber >= 10, "auf sauberer Scheibe bringt er seinen eigenen Dreck mit",
    wischer.sauber + " Kleckse");
  sage(wischer.dreckig === 0,
    "auf einer bespruehten Scheibe aber NICHT — er wischt nur das Motiv weg",
    wischer.dreckig + " Kleckse");
  sage(wischer.lack === 0, "und danach ist der Lack ab", wischer.lack + " Lackschichten");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
