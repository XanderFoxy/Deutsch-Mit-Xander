/* =====================================================================
   SONDE RUNDE 99 — WESSEN KUSS MAN HOERT
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Beim Kussmund: der Mann soll einen Frauenkuss
   hoeren und die Frau einen Maennerkuss."

   GEFUNDEN UND HIER NACHGEMESSEN: gewaehlt wurde bisher nach dem Platz,
   auf dem der ZUSCHAUER sitzt. Derselbe Kuss klang deshalb auf jedem
   Geraet anders. Jetzt zaehlt, WER GEKUESST HAT.

   Gemessen wird ueber window.DMA_TONLOG — eine Liste, in die jeder
   abgespielte Ton seinen Namen schreibt. Damit laesst sich zum ersten
   Mal pruefen, welche Datei ein Effekt WAEHLT, und nicht nur, wie sie
   klingt.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 99 — wessen Kuss man hoert\n");
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
  const pg = await br.newPage({ viewport: { width: 900, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
    && window.DMA_PRUEFUNG, { timeout: 25000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(250);

  /* Wer kuesst wen, und wer hat welches Geschlecht eingetragen? */
  const kuessen = async (kuesser, gKuesser, gEmpfaenger) => {
    await pg.evaluate((w) => {
      const setz = (nr, g) => {
        const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"]');
        if (!p) return;
        if (g) p.dataset.lcGeschlecht = g; else delete p.dataset.lcGeschlecht;
      };
      setz(1, w.gK);   /* Platz 1 ist Alex — der Kuesser */
      setz(2, w.gE);   /* Platz 2 ist Bea — die Empfaengerin */
      document.querySelectorAll(".lc-kuss").forEach((e) => e.remove());
      window.DMA_TONLOG = [];
      window.DMA_PRUEFUNG.wirkung("kuss", "Bea", w.wer);
    }, { wer: kuesser, gK: gKuesser || "", gE: gEmpfaenger || "" });
    /* Der Schmatz liegt 441 ms nach dem Start. */
    await pg.waitForTimeout(900);
    return pg.evaluate(() => (window.DMA_TONLOG || [])
      .map((t) => t.name).filter((n) => n.indexOf("kuss") === 0));
  };

  console.log("1  ES ZAEHLT, WER GEKUESST HAT\n");
  const a1 = await kuessen("Alex", "frau", "mann");
  sage(a1.indexOf("kussfrau") >= 0 && a1.indexOf("kussmann") < 0,
    "Eine Frau kuesst einen Mann — er hoert den FRAUENKUSS",
    a1.join(", ") || "gar nichts");
  const a2 = await kuessen("Alex", "mann", "frau");
  sage(a2.indexOf("kussmann") >= 0 && a2.indexOf("kussfrau") < 0,
    "Ein Mann kuesst eine Frau — sie hoert den MAENNERKUSS",
    a2.join(", ") || "gar nichts");

  console.log("\n2  OHNE ANGABE GILT SEINE REGEL WOERTLICH\n");
  const a3 = await kuessen("Alex", "", "mann");
  sage(a3.indexOf("kussfrau") >= 0,
    "Kuesser ohne Angabe, Empfaenger ist ein Mann — er hoert Frau",
    a3.join(", ") || "gar nichts");
  const a4 = await kuessen("Alex", "", "frau");
  sage(a4.indexOf("kussmann") >= 0,
    "Kuesser ohne Angabe, Empfaengerin ist eine Frau — sie hoert Mann",
    a4.join(", ") || "gar nichts");

  console.log("\n3  UND ER KLINGT AUF JEDEM GERAET GLEICH\n");
  /* Der alte Fehler: gewaehlt wurde nach dem EIGENEN Platz. Also
     dasselbe zweimal, nur mit einem anderen eigenen Geschlecht — es
     muss beide Male dasselbe herauskommen. */
  await pg.evaluate(() => {
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="1"]');
    if (p) p.classList.add("lc-platz-ich");
  });
  const b1 = await kuessen("Alex", "mann", "frau");
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-platz-ich").forEach((p) => p.classList.remove("lc-platz-ich"));
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="3"]');
    if (p) p.classList.add("lc-platz-ich");
  });
  const b2 = await kuessen("Alex", "mann", "frau");
  sage(JSON.stringify(b1) === JSON.stringify(b2),
    "Derselbe Kuss klingt gleich, egal wer zuschaut",
    "[" + b1.join(", ") + "] gegen [" + b2.join(", ") + "]");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
