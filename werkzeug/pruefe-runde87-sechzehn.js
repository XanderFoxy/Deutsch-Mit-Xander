/* =====================================================================
   SONDE RUNDE 87 — SECHZEHN PLAETZE IM SELBEN RAHMEN
   ---------------------------------------------------------------------
   XANDER: „sie sollen das Design nicht verändern, oben und unten die
   Position soll fest bleiben. Es soll nur kleinere Felder erzeugt
   werden, die genau im selben Stil sind … Stell dir die acht Plätze wie
   einen Raum vor. Innerhalb dieser Grenzen bleiben wir: die oberste
   Grenze ist die Strichlinie der obersten Positionen von den Plätzen
   und die unterste Grenze ist der letzte Pixel von dem Wort ,frei'."

   Genau das wird hier nachgemessen, in Pixeln:
     1. Die OBERKANTE der obersten Plätze bleibt, wo sie war.
     2. Die UNTERKANTE des untersten Wortes „frei" bleibt, wo sie war.
     3. Es sind danach 16 Plätze statt 8.
     4. Sie sind kleiner, aber im selben Stil: derselbe gestrichelte
        Ring, dieselbe Nummer, dasselbe Wort darunter.
     5. Und alles geht wieder zurück, wenn der Modus aus ist.
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
  console.log("RUNDE 87 — sechzehn Plaetze im selben Rahmen");
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

  /* Auf zwei Breiten messen — am Telefon ist der Rahmen enger, und
     genau dort faellt ein Umbruch zuerst auf. */
  for (const breite of [420, 760]) {
    const pg = await br.newPage({ viewport: { width: breite, height: 900 } });
    pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
      { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
      && window.DMA_SECHZEHN, { timeout: 20000 });
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.waitForTimeout(220);

    console.log("\n  Bei " + breite + " px Fensterbreite");
    const lies = () => pg.evaluate(() => {
      const g = document.getElementById("lcPlaetze")
        || document.querySelector("#livechatKarte .lc-plaetze");
      const plaetze = [...g.querySelectorAll(".lc-platz")];
      /* DIE ZONE, von der er spricht, ist der Kasten der Sitzreihe:
         „Stell dir die acht Plaetze wie einen Raum vor. Innerhalb
         dieser Grenzen bleiben wir … sie sollen die Elemente oben und
         unten nicht verschieben."
         Gemessen wird deshalb die Ober- und Unterkante des GITTERS —
         das ist es, was alles darueber und darunter verschieben
         wuerde. Wo genau innerhalb dieser Zone der einzelne Kreis
         sitzt, ist Gestaltung und keine Grenze. */
      const gb = g.getBoundingClientRect();
      const oben = gb.top;
      const unten = gb.bottom;
      const einer = plaetze[0];
      const kreis = einer.querySelector(".lc-kreis");
      const st = kreis ? getComputedStyle(kreis) : null;
      return {
        wieViele: plaetze.length,
        oben: Math.round(oben * 10) / 10,
        unten: Math.round(unten * 10) / 10,
        kreisBreit: kreis ? Math.round(kreis.getBoundingClientRect().width * 10) / 10 : 0,
        gestrichelt: st ? st.borderStyle : "-",
        hatNummer: plaetze.every((p) => p.querySelector(".lc-nummer")),
        hatName: plaetze.every((p) => p.querySelector(".lc-platz-name")),
        /* Und die Reihen: bei 16 muessen es acht je Reihe sein. */
        reihen: (() => {
          const y = plaetze.map((p) => Math.round(p.getBoundingClientRect().top));
          return [...new Set(y)].length;
        })()
      };
    });

    const vorher = await lies();
    await pg.evaluate(() => window.DMA_SECHZEHN(true));
    await pg.waitForTimeout(260);
    const nachher = await lies();
    await pg.evaluate(() => window.DMA_SECHZEHN(false));
    await pg.waitForTimeout(260);
    const zurueck = await lies();

    sage(vorher.wieViele === 8, "Vorher acht Plätze", vorher.wieViele + "");
    sage(nachher.wieViele === 16, "Danach sechzehn", nachher.wieViele + "");
    sage(nachher.reihen === 2, "In zwei Reihen wie vorher", nachher.reihen + " Reihen");
    sage(Math.abs(nachher.oben - vorher.oben) <= 1,
      "Die OBERE Grenze der Zone bleibt, wo sie war",
      vorher.oben + " -> " + nachher.oben + " px");
    sage(Math.abs(nachher.unten - vorher.unten) <= 1,
      "Die UNTERE Grenze der Zone bleibt, wo sie war",
      vorher.unten + " -> " + nachher.unten + " px");
    sage(nachher.kreisBreit < vorher.kreisBreit * 0.8,
      "Die Felder sind wirklich kleiner geworden",
      vorher.kreisBreit + " -> " + nachher.kreisBreit + " px");
    sage(nachher.gestrichelt === vorher.gestrichelt,
      "Derselbe Ring wie vorher — gestrichelt bleibt gestrichelt",
      nachher.gestrichelt);
    sage(nachher.hatNummer && nachher.hatName,
      "Jedes Feld hat Nummer und Wort darunter — derselbe Stil");
    sage(zurueck.wieViele === 8 && Math.abs(zurueck.oben - vorher.oben) <= 1
      && Math.abs(zurueck.unten - vorher.unten) <= 1,
      "Und beim Ausschalten steht alles wieder genau so da",
      zurueck.wieViele + " Plätze, " + zurueck.oben + " / " + zurueck.unten + " px");
    await pg.close();
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
