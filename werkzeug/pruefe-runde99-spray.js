/* =====================================================================
   SONDE RUNDE 99 — WORTE AUS DER SPRUEHDOSE
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „bei der Spruehdose koennen mehr Motive sein
   und vielleicht auch Worte, geil, wow."

   GEMESSEN WIRD AM LACK SELBST — also an der Leinwand, auf die
   getropft wird. Gezaehlt werden die Bildpunkte, die wirklich Farbe
   abbekommen haben, und ihr umschliessendes Rechteck:
     ein WORT ist breit und flach (Breite geteilt durch Hoehe > 2),
     ein GESICHT ist rund (ungefaehr 1).
   Damit laesst sich unterscheiden, ob da wirklich ein Wort steht oder
   ob nur derselbe Smiley mit einem anderen Namen kommt.

   Und: die Kachelwand muss die neuen Motive auch anbieten — ein Motiv,
   das nur ueber einen getippten Befehl erreichbar ist, findet niemand.
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
  console.log("RUNDE 99 — Worte aus der Spruehdose\n");
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

  const spruehen = async (stueck) => {
    await pg.evaluate(() => {
      document.querySelectorAll(".lc-spray, .lc-spraydose").forEach((e) => e.remove());
      document.querySelectorAll(".lc-spray-lack").forEach((e) => e.remove());
    });
    await pg.evaluate((st) => window.DMA_PRUEFUNG.wirkung("spray", "Bea", "Alex",
      { stueck: st }), stueck);
    await pg.waitForSelector(".lc-spray-lack", { timeout: 8000 });
    /* Der Lack wird ueber 1700 ms aufgetropft — vorher ist er nur halb
       da, und ein halbes Wort waere ein falsches Mass. */
    await pg.waitForTimeout(2000);
    return pg.evaluate(() => {
      const c = document.querySelector(".lc-spray-lack");
      if (!c || !c.getContext) return null;
      const g = c.getContext("2d");
      let d;
      try { d = g.getImageData(0, 0, c.width, c.height).data; } catch (e) { return { gesperrt: true }; }
      let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, punkte = 0;
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          if (d[(y * c.width + x) * 4 + 3] > 40) {
            punkte++;
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      if (punkte < 10) return { punkte: punkte };
      return { punkte: punkte, breit: x1 - x0 + 1, hoch: y1 - y0 + 1,
               gross: c.width + "x" + c.height };
    });
  };

  console.log("1  EIN WORT IST BREIT UND FLACH, EIN GESICHT IST RUND\n");
  const wort = await spruehen("wort-wow");
  const smiley = await spruehen("froh");
  if (!wort || !smiley || wort.gesperrt || smiley.gesperrt) {
    sage(false, "Der Lack liess sich nicht auslesen",
      JSON.stringify(wort) + " / " + JSON.stringify(smiley));
  } else {
    sage(wort.punkte > 500, "Das Wort kommt wirklich auf die Wand",
      wort.punkte + " Bildpunkte Farbe");
    const vWort = wort.breit / wort.hoch;
    const vSmiley = smiley.breit / smiley.hoch;
    sage(vWort > 2, "Und es ist breit und flach wie ein Wort",
      wort.breit + " x " + wort.hoch + " = " + vWort.toFixed(2));
    sage(vSmiley < 1.6, "Das Gesicht dagegen ist rund",
      smiley.breit + " x " + smiley.hoch + " = " + vSmiley.toFixed(2));
    sage(vWort > vSmiley * 1.6, "Es ist also wirklich etwas anderes",
      vWort.toFixed(2) + " gegen " + vSmiley.toFixed(2));
  }

  const lang = await spruehen("wort-wahnsinn");
  if (lang && lang.breit) {
    sage(lang.breit <= wort.breit * 1.25,
      "Ein langes Wort laeuft nicht ueber den Rand",
      "„WAHNSINN“ " + lang.breit + " px, „WOW“ " + wort.breit + " px");
  } else {
    sage(false, "Das lange Wort kam nicht an");
  }

  console.log("\n2  STEHEN DIE NEUEN MOTIVE AUCH IM MENUE?\n");
  const kacheln = await pg.evaluate(() => {
    document.getElementById("lcPlatzMenue")?.remove();
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"]');
    window.DMA_PRUEFUNG.platzMenue(p);
    const knopf = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")]
      .find((b) => (b.querySelector(".lc-platzmenue-wort") || {}).textContent.trim() === "Schmutzig");
    if (knopf) knopf.click();
    const spr = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")]
      .find((b) => (b.querySelector(".lc-platzmenue-wort") || {}).textContent.trim() === "Sprühdose");
    if (spr) spr.click();
    return [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .map((e) => e.textContent.trim());
  });
  sage(kacheln.length >= 18, "Die Spruehdose bietet jetzt deutlich mehr an",
    kacheln.length + " Kacheln");
  ["Daumen", "Pokal", "Party", "Musik", "Katze", "Sonne", "Schnee", "Kaffee"]
    .forEach((m) => {
      if (kacheln.indexOf(m) < 0) sage(false, "Motiv fehlt im Menue: " + m);
    });
  sage(["Daumen", "Pokal", "Party", "Musik", "Katze", "Sonne", "Schnee", "Kaffee"]
    .every((m) => kacheln.indexOf(m) >= 0), "Die acht neuen Motive stehen alle da");
  sage(kacheln.indexOf("WOW") >= 0 && kacheln.indexOf("GEIL") >= 0
    && kacheln.some((k) => k.indexOf("Eigenes Wort") === 0),
    "Und die Worte: WOW, GEIL und ein eigenes");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
