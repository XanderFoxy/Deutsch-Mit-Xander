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
      /* RUNDE 99: der Kran ist eine Zeichnung ueber der Sitzreihe
         (.lc-kran-buehne) — Gurte und Streben sind Pfade darin. */
      const sch = document.querySelector(".lc-kran-buehne");
      if (sch && !teile) {
        const gurt = sch.querySelector(".lc-kr-gurt"), str = sch.querySelector(".lc-kr-strebe");
        teile = { ausleger: gurt ? 1 : 0,
          gurte: gurt ? ((gurt.getAttribute("d") || "").match(/M/g) || []).length : 0,
          streben: str ? ((str.getAttribute("d") || "").match(/M/g) || []).length : 0,
          katze: sch.querySelectorAll(".lc-kr-katze").length,
          seil: sch.querySelectorAll(".lc-kr-seil").length,
          haken: sch.querySelectorAll(".lc-kr-haken").length };
      }
      const katze = document.querySelector(".lc-kr-katze");
      if (katze) {
        const r = katze.getBoundingClientRect();
        const x = Math.round(r.left + r.width / 2);
        if (katzeVon === null) katzeVon = x;
        katzeBis = x;
      }
      const haken = document.querySelector(".lc-kr-haken");
      if (haken && hakenUnten < 0) {
        const r = haken.getBoundingClientRect();
        const k = document.querySelector('[data-lc-platz="2"] .lc-kreis')
          .getBoundingClientRect();
        /* Der Haken greift OBEN am Bild an (seit Runde 99 — er haengt
           am Seil, er steckt nicht im Gesicht). */
        if (r.top + r.height >= k.top + 2) hakenUnten = jetzt;
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

  console.log("\n4  RUNDE 99 — VON UNTEN NACH OBEN: DER AUSLEGER STEHT UEBER DEM ZIEL\n");
  /* XANDER: „der Kran muss ueber der Zielposition stehen, wenn er
     jemanden von unten nach oben hebt — jetzt faengt er auf der unteren
     Ebene an und traegt ihn darueber hinaus." */
  const h = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    const zielK = document.querySelector('[data-lc-platz="3"] .lc-kreis').getBoundingClientRect();
    const k5 = document.querySelector('[data-lc-platz="5"] .lc-kreis');
    window.DMA_PRUEFUNG.wirkung("kranheben", "Emmi", "Alex", { ziel: 3 });
    const t0 = performance.now();
    let auslegerUnten = null, hoechstesBild = 1e9, nahAmZiel = 1e9;
    while (performance.now() < t0 + 2600) {
      const gurt = document.querySelector(".lc-kr-gurt");
      if (gurt && auslegerUnten === null) {
        const g = gurt.getBoundingClientRect();
        auslegerUnten = g.bottom;
      }
      const r = k5.getBoundingClientRect();
      if (r.top < hoechstesBild) hoechstesBild = r.top;
      const d = Math.hypot((r.left + r.width / 2) - (zielK.left + zielK.width / 2),
                           (r.top + r.height / 2) - (zielK.top + zielK.height / 2));
      if (d < nahAmZiel) nahAmZiel = d;
      await new Promise((f) => requestAnimationFrame(f));
    }
    return { auslegerUnten: Math.round(auslegerUnten), zielOben: Math.round(zielK.top),
             hoechstesBild: Math.round(hoechstesBild), nahAmZiel: Math.round(nahAmZiel) };
  });
  sage(h.auslegerUnten !== null && h.auslegerUnten <= h.zielOben,
    "der Ausleger steht UEBER dem Zielplatz oben", "Ausleger bis y=" + h.auslegerUnten
    + ", Zielbild ab y=" + h.zielOben);
  sage(h.hoechstesBild >= h.auslegerUnten,
    "das Bild kommt nie ueber den Ausleger hinaus", "hoechster Bildrand y=" + h.hoechstesBild);
  sage(h.nahAmZiel <= 4, "und es kommt genau auf dem Zielplatz an", h.nahAmZiel + " px daneben");

  /* RUNDE 100 — XANDER: „Der Kran ist manchmal langsamer oder schneller
     als die Person eigentlich am Zielort ist." Gemessen wird, wie weit
     Laufkatze und Bild waehrend der Querfahrt (48–72 %) waagerecht
     auseinanderliegen. Vorher bis 52 px (easing ueber die ganze
     Zeitleiste), jetzt eine gemeinsame Kurve. Und: der Kran hat oben
     Fuehrerhaus, Turmspitze, Abspannseile und Gegengewicht. */
  console.log("\n5  RUNDE 100 — KATZE UND BILD IM GLEICHSCHRITT, EIN ECHTER TURMDREHKRAN\n");
  const gleich = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 300));
    const k5 = document.querySelector('[data-lc-platz="5"] .lc-kreis');
    window.DMA_PRUEFUNG.wirkung("kranheben", "Emmi", "Alex", { ziel: 3 });
    const t0 = performance.now(), ab = [];
    let teile = null;
    while (performance.now() < t0 + 2700) {
      const t = performance.now() - t0, kz = document.querySelector(".lc-kr-katze");
      if (kz && t > 2800 * 0.49 && t < 2800 * 0.71) {
        const a = kz.getBoundingClientRect(), b = k5.getBoundingClientRect();
        ab.push(Math.abs((a.left + a.width / 2) - (b.left + b.width / 2)));
      }
      if (!teile && document.querySelector(".lc-kran-buehne")) {
        const q = (c) => document.querySelectorAll(".lc-kran-buehne ." + c).length;
        teile = { haus: q("lc-kr-haus"), fenster: q("lc-kr-fenster"), gewicht: q("lc-kr-gewicht"),
                  abspann: q("lc-kr-abspann"),
                  staerken: [...new Set([...document.querySelectorAll(".lc-kran-buehne .lc-kr-gurt")]
                    .map((g) => getComputedStyle(g).strokeWidth))] };
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    return { max: ab.length ? Math.max.apply(null, ab) : 999, n: ab.length, teile: teile };
  });
  /* 15 px: das Bild pendelt am Haken (±7° um den oberen Rand) — das
     allein verschiebt seine Mitte um bis zu 6 px. Vorher waren es 52–61. */
  sage(gleich.n > 5 && gleich.max <= 15, "Katze und Bild fahren im Gleichschritt",
    "groesster Abstand " + Math.round(gleich.max) + " px (" + gleich.n + " Bilder)");
  const tl = gleich.teile || {};
  sage(tl.haus === 1 && tl.fenster === 1 && tl.gewicht === 1 && tl.abspann === 1,
    "oben: Fuehrerhaus mit Fenster, Gegengewicht, Abspannseile", JSON.stringify(tl));
  sage(tl.staerken && tl.staerken.length === 1, "Turm und Ausleger: dieselbe Gurtstaerke",
    tl.staerken ? tl.staerken.join(", ") : "-");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
