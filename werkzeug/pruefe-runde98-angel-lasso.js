#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — ERST FANGEN, DANN ZIEHEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „repariere noch das Lasso und die Angel, weil
   die sind immer noch von ihrer Animation erst dann, wenn derjenige
   schon an den Platz gezogen wurde. Sie sollen aber erst mal denjenigen
   fangen und dann zu sich ziehen. Die Angel kann auch ein bisschen
   klassischer sein. Also das soll so 'ne Angelrute sein, wo man dann
   die Angelschnur einrollt, und man denjenigen wirklich hochzieht, und
   er baumelt dann so ein bisschen."

   GEFUNDEN: in Runde 76 wurde die NACHRICHT verzoegert — aber
   „sitzTausch" wurde trotzdem sofort gesetzt. Und sitzTausch IST die
   Sitzordnung: jedes melden() aus irgendeinem anderen Anlass zeichnet
   die Sitzreihe daraufhin neu. Die Person sass also schon auf dem
   Zielplatz, waehrend das Lasso noch flog.

   GEMESSEN WIRD:
     1  Die Reihenfolge im Programm: sitzTausch wird erst in schickenH
        gesetzt, also gemeinsam mit dem Verschicken.
     2  Das Bild bewegt sich erst, nachdem das Fangwerkzeug da ist.
     3  Die Angel hat eine Rute mit Rolle, und die Rolle dreht sich.
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
  console.log("\n1  DIE REIHENFOLGE IM PROGRAMM\n");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  /* Die Zuweisung darf NUR noch innerhalb von schickenH stehen. */
  const stelleSchicken = lc.indexOf("var schickenH = function () {");
  const stelleTausch = lc.indexOf("sitzTausch[wenH.id] = nummerH - 1;");
  sage(stelleTausch > stelleSchicken && stelleSchicken > 0,
    "die Sitzordnung wird erst beim Verschicken geaendert, nicht vorher",
    stelleTausch > stelleSchicken ? "in schickenH" : "davor — wie vorher");
  sage((lc.match(/sitzTausch\[wenH\.id\] = nummerH - 1;/g) || []).length === 1,
    "und nur an dieser einen Stelle",
    (lc.match(/sitzTausch\[wenH\.id\] = nummerH - 1;/g) || []).length + "×");

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

  console.log("\n2  ERST IST DAS WERKZEUG DA, DANN BEWEGT SICH DAS BILD\n");
  /* Die Schlinge haengt AM PLATZ, die Angelleine liegt in der
     Sitzreihe (sie geht ja von meinem Platz aus) \u2014 deshalb zwei
     verschiedene Wege, sie zu finden. */
  for (const [art, wahl, wort] of [["lasso", '[data-lc-platz="2"] .lc-lasso-schlinge', "Lasso"],
                                   ["heber", ".lc-leine-angel .lc-leine-haken", "Angel"]]) {
    const r = await pg.evaluate(async ([art, wahl]) => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", { ziel: 7 });
      const t0 = performance.now();
      let werkzeugAb = -1, bewegungAb = -1;
      const bis = t0 + 2600;
      while (performance.now() < bis) {
        const jetzt = Math.round(performance.now() - t0);
        if (werkzeugAb < 0 && document.querySelector(wahl)) {
          werkzeugAb = jetzt;
        }
        const k = document.querySelector('[data-lc-platz="2"] .lc-kreis');
        if (bewegungAb < 0 && k) {
          const m = /matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)/
            .exec(getComputedStyle(k).transform);
          if (m && (Math.abs(Number(m[5])) > 3 || Math.abs(Number(m[6])) > 3)) {
            bewegungAb = jetzt;
          }
        }
        await new Promise((f) => requestAnimationFrame(f));
      }
      return { werkzeugAb: werkzeugAb, bewegungAb: bewegungAb };
    }, [art, wahl]);
    sage(r.werkzeugAb >= 0, wort + ": das Werkzeug ist zu sehen",
      "ab " + r.werkzeugAb + " ms");
    sage(r.bewegungAb > r.werkzeugAb + 200,
      wort + ": das Bild bewegt sich erst DANACH",
      "Werkzeug ab " + r.werkzeugAb + " ms, Bewegung ab " + r.bewegungAb + " ms");
  }

  console.log("\n3  DIE ANGEL IST EINE RICHTIGE RUTE\n");
  const rute = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("heber", "Bea", "Alex", { ziel: 7 });
    await new Promise((f) => setTimeout(f, 400));
    const r = document.querySelector(".lc-angel-rute");
    if (!r) return null;
    const spule = r.querySelector(".lc-angel-spule");
    const dreht = [];
    for (let i = 0; i < 8; i++) {
      await new Promise((f) => setTimeout(f, 140));
      const t = getComputedStyle(spule).transform;
      if (dreht.indexOf(t) < 0) dreht.push(t);
    }
    return { rute: 1, griff: r.querySelectorAll(".lc-angel-griff").length,
      rolle: r.querySelectorAll(".lc-angel-rollengehaeuse").length,
      kurbel: r.querySelectorAll(".lc-angel-kurbel").length,
      ringe: r.querySelectorAll(".lc-angel-ringe circle").length,
      drehstufen: dreht.length };
  });
  if (!rute) {
    sage(false, "eine Angelrute ist ueberhaupt nicht da");
  } else {
    sage(rute.griff > 0 && rute.rolle > 0 && rute.kurbel > 0,
      "Griff, Rolle und Kurbel sind gezeichnet",
      "Griff " + rute.griff + ", Rolle " + rute.rolle + ", Kurbel " + rute.kurbel);
    sage(rute.ringe >= 3, "und die Schnur laeuft durch Ringe",
      rute.ringe + " Ringe");
    sage(rute.drehstufen >= 4, "die Spule dreht sich — die Schnur wird eingerollt",
      rute.drehstufen + " verschiedene Stellungen gemessen");
  }

  /* Ein Bild von der Rute. */
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("heber", "Dana", "Alex", { ziel: 7 });
  });
  await pg.waitForTimeout(900);
  const el = await pg.$("#lcPlaetze");
  if (el) await el.screenshot({ path: "/tmp/claude-0/angel.png" });

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
