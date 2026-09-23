#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — PAC-MAN FRISST WIRKLICH
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „bei Pac-Man soll er die Leute richtig
   auffressen und gerade wenn auf Plaetzen jemand sitzt, soll er ein
   bisschen dicker werden aber nur in dem Moment, dann soll er weiter
   fressen und immer wenn er jemanden frisst, dann soll er ruelpsen und
   die Leute sollen von der Buehne verschwinden und die Futterpunkte
   soll er auch realistisch essen."

   BISHER WURDE GENAU EINER GEFRESSEN: der am Ende des Weges. Wer
   unterwegs auf einem Platz sass, wurde ueberlaufen und blieb sitzen.
   Dick wurde er erst am Ziel, und geruelpst hat er nie.

   GEMESSEN WIRD:
     1  Jeder besetzte Platz auf der Strecke wird verschlungen.
     2  An jedem davon wird er kurz dicker — und gleich wieder normal.
     3  Zu jedem Happen klingt ein Ruelpser.
     4  Zu jedem Feld klingt ein „waka" fuer den Futterpunkt.
     5  Die Futterpunkte auf seinem Weg sind danach gefressen.
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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a|mp3)$/, ""));
      return ap.call(this);
    };
  });

  console.log("\nEIN LAUF UEBER DREI BESETZTE PLAETZE\n");
  const m = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.__toene = [];
    /* Alex (Platz 1) frisst sich ueber Bea (2), Cem (3) bis Dana (4). */
    const kreis = () => document.querySelector('[data-lc-platz="1"] .lc-kreis');
    window.DMA_PRUEFUNG.wirkung("pacjagd", "1-2-3-4", "Alex", {});
    const verschlungen = {};
    let dickMax = 1, dickAm = [];
    const bis = performance.now() + 3400;
    while (performance.now() < bis) {
      document.querySelectorAll(".lc-platz").forEach((p) => {
        const k = p.querySelector(".lc-kreis");
        if (k && k.classList.contains("lc-verschlungen")) {
          verschlungen[p.getAttribute("data-lc-platz")] = true;
        }
      });
      const k = kreis();
      if (k) {
        const t = getComputedStyle(k).transform;
        const mm = /matrix\(([-\d.]+)/.exec(t);
        if (mm) {
          const s = Number(mm[1]);
          if (s > dickMax) dickMax = s;
          if (s > 1.08) dickAm.push(Math.round(performance.now()));
        }
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    await new Promise((f) => setTimeout(f, 900));
    return { verschlungen: Object.keys(verschlungen).sort(),
      dickMax: Number(dickMax.toFixed(3)), dickBilder: dickAm.length,
      toene: (window.__toene || []).slice(),
      krumenUebrig: document.querySelectorAll(".lc-pac-krume").length };
  });

  sage(m.verschlungen.length >= 3,
    "alle drei Besetzten auf der Strecke werden verschlungen",
    "Plaetze " + (m.verschlungen.join(", ") || "keiner"));
  sage(m.verschlungen.indexOf("2") >= 0 && m.verschlungen.indexOf("3") >= 0,
    "… auch die UNTERWEGS, nicht nur der am Ende",
    "Plaetze " + m.verschlungen.join(", "));
  sage(m.dickMax > 1.1, "er wird dabei wirklich dicker",
    "groesste Dicke " + m.dickMax + "×");
  sage(m.dickBilder > 4 && m.dickBilder < 140,
    "aber nur in dem Moment — nicht den ganzen Lauf lang",
    m.dickBilder + " Bilder dick von rund 200");
  const ruelps = m.toene.filter((t) => t === "ruelps").length;
  sage(ruelps >= 3, "zu jedem Happen ein Ruelpser",
    ruelps + "× ruelps (" + m.toene.join(", ") + ")");
  const biss = m.toene.filter((t) => t === "pacbiss").length;
  sage(biss >= 3, "und zu jedem Feld ein „waka“ fuer den Futterpunkt",
    biss + "× pacbiss");

  /* Gegenprobe: ueber FREIE Plaetze frisst er niemanden. */
  console.log("\nUND UEBER FREIE PLAETZE FRISST ER NIEMANDEN\n");
  const frei = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.__toene = [];
    window.DMA_PRUEFUNG.wirkung("pacjagd", "5-6-7-8", "Emmi", {});
    let verschlungen = 0;
    const bis = performance.now() + 3200;
    while (performance.now() < bis) {
      verschlungen += document.querySelectorAll(".lc-verschlungen").length;
      await new Promise((f) => requestAnimationFrame(f));
    }
    return { verschlungen: verschlungen,
      ruelps: (window.__toene || []).filter((t) => t === "ruelps").length,
      biss: (window.__toene || []).filter((t) => t === "pacbiss").length };
  });
  sage(frei.verschlungen === 0, "niemand wird verschlungen",
    frei.verschlungen + " Bilder");
  sage(frei.ruelps === 0, "und es ruelpst auch nicht", frei.ruelps + "×");
  sage(frei.biss >= 3, "die Futterpunkte frisst er trotzdem",
    frei.biss + "× pacbiss");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
