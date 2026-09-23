#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER KRAN HEBT JEMAND ANDEREN AUF EINEN PLATZ
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Dann haette ich gerne den Kran dafuer, dass man
   jemand anderen noch auf einen Platz heben kann."

   Den Kran gab es bisher nur als REISE: er hat MICH von hier nach dort
   gehoben. Als Werkzeug fuer jemand anderen fehlte er — dafuer gab es
   nur die Angel („/heb") und das Lasso.

   GEMESSEN WIRD:
     1  Es gibt den Befehl, und er steht im Platzmenue unter „Holen".
     2  Ausleger, Katze, Seil und Haken sind da — ein Kran, kein Kran-
        Symbol.
     3  Die Katze faehrt wirklich vom Start zum Ziel.
     4  Das Bild wird gehoben und kommt am Zielplatz an.
     5  Erst fangen, dann heben: das Bild bewegt sich erst, nachdem der
        Haken unten war.
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
  console.log("\n1  ES GIBT IHN ALS WERKZEUG\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/art === "kranheb"/.test(lc), "der Befehl /kranheb steht in livechat.js");
  sage(/var kranZieht = false;/.test(lc)
    && /lassoZieht \? "lasso" : \(kranZieht \? "kranheben" : "heber"\)/.test(lc),
    "und das Werkzeug sagt selbst an, welche Animation laeuft");

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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\n2  UND ER SIEHT AUS WIE EIN KRAN UND ARBEITET AUCH SO\n");
  const m = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const ziel = document.querySelector('[data-lc-platz="7"]').getBoundingClientRect();
    window.DMA_PRUEFUNG.wirkung("kranheben", "Bea", "Alex", { ziel: 7 });
    const t0 = performance.now();
    let teile = null, hakenUnten = -1, bildAb = -1;
    let katzeVon = null, katzeBis = null, bildHoch = 0, nahAmZiel = 1e9;
    const bis = t0 + 2700;
    while (performance.now() < bis) {
      const jetzt = Math.round(performance.now() - t0);
      const sch = document.querySelector(".lc-kranheb");
      if (sch && !teile) {
        teile = { ausleger: sch.querySelectorAll(".lc-kranheb-ausleger").length,
          gurte: sch.querySelectorAll(".lc-kranheb-gurt").length,
          streben: sch.querySelectorAll(".lc-kranheb-strebe").length,
          katze: sch.querySelectorAll(".lc-kranheb-wagen").length,
          seil: sch.querySelectorAll(".lc-kranheb-seil").length,
          haken: sch.querySelectorAll(".lc-kranheb-bogen").length };
      }
      const katze = document.querySelector(".lc-kranheb-katze");
      if (katze) {
        const r = katze.getBoundingClientRect();
        const x = Math.round(r.left + r.width / 2);
        if (katzeVon === null) katzeVon = x;
        katzeBis = x;
      }
      const haken = document.querySelector(".lc-kranheb-haken");
      if (haken && hakenUnten < 0) {
        const r = haken.getBoundingClientRect();
        const k = document.querySelector('[data-lc-platz="2"] .lc-kreis')
          .getBoundingClientRect();
        if (r.top + r.height >= k.top + k.height * 0.2) hakenUnten = jetzt;
      }
      const k2 = document.querySelector('[data-lc-platz="2"] .lc-kreis');
      if (k2) {
        const mm = /matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)/
          .exec(getComputedStyle(k2).transform);
        if (mm) {
          const dx = Number(mm[5]), dy = Number(mm[6]);
          if (bildAb < 0 && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) bildAb = jetzt;
          if (-dy > bildHoch) bildHoch = -dy;
          /* Wie nah kommt das Bild dem Zielplatz? Gemessen WAEHREND
             der Fahrt — danach faellt die Animation ab und das Bild
             steht wieder auf seinem Platz (den Sitzwechsel macht in
             Wirklichkeit livechat.js bei 2400 ms). */
          const rr = k2.getBoundingClientRect();
          const dd = Math.abs((rr.left + rr.width / 2) - (ziel.left + ziel.width / 2));
          if (dd < nahAmZiel) nahAmZiel = dd;
        }
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    const amZiel = Math.round(nahAmZiel);
    return { teile: teile, hakenUnten: hakenUnten, bildAb: bildAb,
      katzeWeg: katzeVon === null ? 0 : Math.abs(katzeBis - katzeVon),
      bildHoch: Math.round(bildHoch), amZiel: amZiel };
  });

  const t = m.teile || {};
  sage(t.ausleger === 1 && t.gurte > 0 && t.streben > 0,
    "der Ausleger ist ein Gittertraeger mit Gurten und Streben",
    "Gurte " + t.gurte + ", Streben " + t.streben);
  sage(t.katze === 1 && t.seil === 1 && t.haken === 1,
    "Katze, Seil und Haken sind da",
    "Katze " + t.katze + ", Seil " + t.seil + ", Haken " + t.haken);
  sage(m.katzeWeg > 60, "die Katze faehrt wirklich auf dem Ausleger hinueber",
    m.katzeWeg + " px gefahren");
  sage(m.bildHoch > 10, "das Bild wird angehoben", m.bildHoch + " px hoch");
  sage(m.amZiel <= 40, "und kommt am Zielplatz an", m.amZiel + " px daneben (waehrend der Fahrt gemessen)");

  console.log("\n3  ERST ANSCHLAGEN, DANN HEBEN\n");
  sage(m.hakenUnten >= 0, "der Haken kommt herunter", "ab " + m.hakenUnten + " ms");
  sage(m.bildAb > m.hakenUnten, "und das Bild bewegt sich erst DANACH",
    "Haken unten ab " + m.hakenUnten + " ms, Bild ab " + m.bildAb + " ms");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
