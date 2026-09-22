#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — DIE KUGEL FAELLT NICHT IMMER INS SELBE LOCH
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Billard-Physik ist immer noch nicht da. Du
   sagst, du machst es fertig, hast es aber nicht fertig."
   Und frueher: „weil sie immer an dasselbe Loch fliegt."

   NACHGEMESSEN, und er hatte recht — schlimmer, als es aussah: die
   Rechnung fand ueberhaupt KEIN Loch (sie verglich ein Feld, das es
   nicht gibt: „nummer" statt „nr"). Was man fallen sah, war jedes Mal
   der Ersatzweg, und der nimmt immer denselben Platz. Dazu war die
   Streuung mit 14 Grad zu klein und die Stossstaerke fest.

   JETZT: 34 Grad Faecher, die Haerte haengt am Stoss (0,20-0,40 r je
   Schritt), Reibung auf dem Tuch, und ein Loch nimmt die Kugel nur,
   wenn sie es MITTIG trifft.

   Gemessen wird hier die Rechnung selbst, ueber 24 Stoesse auf
   derselben Buehne: es muessen MEHRERE Loecher vorkommen, keines darf
   die Haelfte fuer sich haben, und die allermeisten Stoesse muessen
   ueberhaupt irgendwo hineinfallen.
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.billardBahn,
    { timeout: 20000 });

  console.log("\n24 STOESSE AUF DEMSELBEN TISCH\n");
  const erg = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const zaehl = {};
    const banden = [];
    for (let i = 0; i < 24; i++) {
      const b = window.DMA_PRUEF.billardBahn("Alex", "Bea", i / 24 + 0.02);
      const l = (b && b.loch) || 0;
      zaehl[l] = (zaehl[l] || 0) + 1;
      banden.push(b ? b.banden : -1);
    }
    const frei = window.DMA_PRUEF.platzGitter().filter((p) => p.frei).length;
    return { zaehl: zaehl, frei: frei,
             banden: Math.max.apply(null, banden), bandenMin: Math.min.apply(null, banden) };
  });

  const loecher = Object.keys(erg.zaehl).filter((k) => k !== "0");
  const daneben = erg.zaehl["0"] || 0;
  const meiste = Math.max.apply(null, loecher.map((k) => erg.zaehl[k]));
  console.log("  Verteilung: " + JSON.stringify(erg.zaehl)
    + "   (freie Loecher auf dem Tisch: " + erg.frei + ")\n");

  sage(loecher.length >= 3, "die Kugel findet mehrere verschiedene Loecher",
    loecher.length + " von " + erg.frei);
  sage(meiste <= 12, "und keines bekommt die Haelfte aller Stoesse",
    "haeufigstes Loch: " + meiste + " von 24");
  sage(daneben <= 8, "die meisten Stoesse fallen ueberhaupt hinein",
    daneben + " von 24 gehen daneben");
  sage(erg.banden >= 1, "es wird an den Banden gespielt",
    "hoechstens " + erg.banden + " Banden, mindestens " + erg.bandenMin);

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
