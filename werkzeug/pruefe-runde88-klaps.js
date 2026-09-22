/* =====================================================================
   SONDE RUNDE 88 — DER KLAPS KOMMT VON OBEN UND HINTEN
   ---------------------------------------------------------------------
   XANDER: „ueberleg auch mal, wenn man jemanden schlaegt auf dem Popo,
   das bei den Emoji-Haenden, ob das auch richtig aussieht. Die kommen
   naemlich manchmal so von der Seite, als wenn sie mit der Rueckhand
   schlagen, oder dass die Physik nicht stimmt. Wenn man jemand auf die
   Wange schlaegt, schlaegt man seitlich. Wenn man auf den Popo
   schlaegt, schlaegt man so hinten drauf, und dann ist die Hand flach
   so von der Seite zu sehen und kommt auch so animiert auf dem Po
   geschlagen."

   Er hat den Unterschied anatomisch genau benannt:
   · Eine Ohrfeige geht QUER durch die Bildebene.
   · Ein Klaps geht von OBEN UND HINTEN nach unten vorn. Die
     Handflaeche zeigt dabei nach unten, also vom Betrachter weg — man
     sieht die Hand nie von der Flaeche, sondern immer von der KANTE.

   Bisher lag die Handflaeche flach VORN auf dem Bild (viewBox 64 x 62,
   also quadratisch) und kam von UNTEN AUSSEN herauf. Das ist die Bahn
   einer Ohrfeige, nur seitenverkehrt.

   Gemessen wird deshalb viererlei:
     1. Ist die Zeichnung ein PROFIL (breit und flach) statt einer
        Flaeche (quadratisch)?
     2. Kommt die Hand von OBEN — liegt sie 200 ms vor dem Aufprall
        hoeher als beim Aufprall?
     3. Liegt sie beim Aufprall WAAGERECHT auf der Backe?
     4. Kommt der Arm von AUSSEN — liegt die Manschette weiter vom
        Bildmittelpunkt entfernt als die Fingerkuppen?
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
  console.log("RUNDE 88 — der Klaps\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  console.log("DIE ZEICHNUNG\n");
  const vb = /<svg class="lc-klaps-hand" viewBox="0 0 (\d+) (\d+)"/.exec(js);
  const breit = vb ? Number(vb[1]) : 0, hoch = vb ? Number(vb[2]) : 1;
  /* 64 x 62 = 1,03 war eine Flaeche. Eine flache Hand von der Kante
     ist mindestens doppelt so lang wie hoch. */
  sage(breit / hoch >= 2,
    "die Hand ist im Profil gezeichnet, nicht als Flaeche",
    breit + " x " + hoch + " = " + (breit / hoch).toFixed(2) + " (vorher 64 x 62 = 1,03)");

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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const p = document.querySelectorAll(".lc-platz")[1];
    p.dataset.lcGeschlecht = "w";
    window.DMA_PRUEFUNG.wirkung("klaps", "2", "Alex", {});
  });
  await pg.waitForTimeout(250);

  const bei = async (t) => {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-zp, .lc-zp *").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(90);
    return pg.evaluate(() => {
      const h = document.querySelector(".lc-klaps-hand");
      const bl = document.querySelector(".lc-zp .lc-zp-blende, .lc-zp");
      if (!h) return null;
      const b = h.getBoundingClientRect();
      const p = (bl || h.parentElement).getBoundingClientRect();
      const m = getComputedStyle(h).transform;
      let grad = 0;
      if (m && m !== "none") {
        const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
        /* Bei gespiegelter Zeichnung (negatives a) zaehlt der Winkel
           der SICHTBAREN Kante — deshalb ueber die zweite Spalte. */
        grad = Math.atan2(-z[2], z[3]) * 180 / Math.PI;
      }
      return { mx: Number((b.left + b.width / 2 - p.left).toFixed(1)),
               unten: Number((b.bottom - p.top).toFixed(1)),
               my: Number((b.top + b.height / 2 - p.top).toFixed(1)),
               grad: Number(grad.toFixed(1)),
               deck: Number(getComputedStyle(h).opacity.toFixed ? getComputedStyle(h).opacity : 0),
               feld: [Number(p.width.toFixed(1)), Number(p.height.toFixed(1))] };
    });
  };

  console.log("\nDIE BAHN\n");
  const hoch1 = await bei(300);
  const hoch2 = await bei(450);
  const treffer = await bei(600);
  const nach = await bei(760);
  sage(hoch1 && treffer && hoch1.my < treffer.my - 20,
    "300 ms vor dem Aufprall ist die Hand deutlich weiter oben",
    hoch1 ? "Mitte bei y = " + hoch1.my + ", im Aufprall " + treffer.my : "-");
  sage(hoch2 && hoch2.my < treffer.my && hoch2.my > hoch1.my,
    "und sie faellt dazwischen — es ist ein Bogen, kein Sprung",
    hoch2 ? hoch1.my + " → " + hoch2.my + " → " + treffer.my : "-");
  /* Beim Aufprall liegt sie flach. Vorher stand sie dort mit -6 bis
     -14 Grad schraeg und kam von unten. */
  sage(treffer && Math.abs(treffer.grad) <= 10,
    "beim Aufprall liegt sie waagerecht auf der Backe",
    treffer ? treffer.grad + " Grad" : "-");
  sage(nach && nach.my >= treffer.my - 2,
    "und drueckt danach noch einmal nach, statt sofort wegzuspringen",
    nach ? "y = " + nach.my + " nach " + treffer.my : "-");

  console.log("\nWOHER DER ARM KOMMT\n");
  const seiten = await pg.evaluate(() => {
    const h = document.querySelector(".lc-klaps-hand");
    const bl = h.parentElement;
    const p = bl.getBoundingClientRect();
    /* Die Manschette ist der erste Pfad der Zeichnung, die
       Fingerkuppen sind die Kerben. */
    const stueck = (i) => {
      const e = h.querySelectorAll("path")[i].getBoundingClientRect();
      return Number((e.left + e.width / 2 - p.left - p.width / 2).toFixed(1));
    };
    return { manschette: stueck(0), kuppen: stueck(3),
             abdruck: (() => {
               const a = bl.querySelector(".lc-klaps-abdruck");
               if (!a) return null;
               const e = a.getBoundingClientRect();
               return Number((e.left + e.width / 2 - p.left - p.width / 2).toFixed(1));
             })() };
  });
  sage(Math.abs(seiten.manschette) > Math.abs(seiten.kuppen),
    "die Manschette liegt weiter aussen als die Fingerkuppen — der Arm kommt von aussen",
    "Manschette " + seiten.manschette + ", Kuppen " + seiten.kuppen + " (0 = Bildmitte)");
  sage(seiten.abdruck !== null
    && Math.sign(seiten.abdruck) === Math.sign(seiten.manschette),
    "und der Abdruck bleibt auf der Backe, auf die geschlagen wurde",
    "Abdruck bei " + seiten.abdruck);

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nVon oben und hinten, flach von der Kante — so schlaegt man auf den Popo.\n");
  process.exit(fehler ? 1 : 0);
})();
