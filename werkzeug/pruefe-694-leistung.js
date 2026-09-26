#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 694: SCHNELLER LADEN, WENIGER RECHNEN
   ---------------------------------------------------------------------
   XANDER: „wenn die Ladl nicht so groß wäre oder man das alles so ein
   bisschen professioneller aufteilen könnte … ohne dass jemand ne
   Grafikeinbuße" · „sobald ich drei oder vier Mitspieler hab wird das
   alles ganz schwer"

   Gemessen wird:
   1. Die Seite lädt die verkleinerten Kopien (min/) — und nichts fehlt.
   2. Fehlt eine Kopie, lädt die Seite von selbst die Quellen.
   3. Der Zwischenspeicher (sw.js): beim zweiten Öffnen kommen die
      gestempelten Dateien ohne Netz.
   4. Gefragt wird fassung.json, nicht mehr die ganze index.html.
   5. Im Klassenzimmer mit vier Leuten rechnet die Seite im Leerlauf
      fast nichts (vorher ~50 ms je Sekunde).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  let fehlt = "";            // diese min/-Datei antwortet mit 404
  const geholt = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    geholt.push(q.url);
    const f = path.join(WURZEL, p);
    if ((fehlt && p === "/" + fehlt) || !f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const neuesFenster = async () => {
    const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });
    const pg = await ctx.newPage();
    const fehlerListe = [];
    pg.on("pageerror", (e) => fehlerListe.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.route(/supabase\.co|giphy|googleapis|gstatic|open-meteo|youtube|jsdelivr/, (r) => r.abort());
    return { ctx, pg, fehlerListe };
  };

  /* ---- 1. min/ ---- */
  console.log("\n  1) DIE VERKLEINERTEN KOPIEN");
  {
    const { ctx, pg, fehlerListe } = await neuesFenster();
    await pg.goto(basis, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_SPIEL && window.DMA_PRUEF, { timeout: 30000 });
    const r = await pg.evaluate(() => {
      const skripte = [...document.scripts].map((s) => s.getAttribute("src") || "").filter((s) => s && !/^https?:/.test(s));
      const stil = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href") || "").filter((s) => !/^https?:/.test(s));
      return { skripte, stil, q: window.DMA_Q("app.js"), v: window.DMA_V("app.js") };
    });
    const ohneMin = r.skripte.concat(r.stil).filter((s) => !/^min\//.test(s));
    sage(r.skripte.length >= 25 && r.stil.length >= 8 && !ohneMin.length, "alle Skripte und Stilblätter kommen aus min/",
      r.skripte.length + " Skripte, " + r.stil.length + " Stilblätter" + (ohneMin.length ? " — ohne: " + ohneMin.join(", ") : ""));
    const quelle = fs.statSync(path.join(WURZEL, "app.js")).size, klein = fs.statSync(path.join(WURZEL, "min/app.js")).size;
    sage(klein < quelle * 0.7, "min/app.js ist deutlich kleiner als die Quelle", (quelle / 1e6).toFixed(2) + " MB → " + (klein / 1e6).toFixed(2) + " MB");
    sage(r.q === "min/app.js" && /^\?v=[0-9a-f]{10}$/.test(r.v), "DMA_Q/DMA_V für Nachgeladenes", r.q + r.v);
    /* Nachgeladene Datei (Wortkategorien) kommt auch verkleinert. */
    await pg.evaluate(() => new Promise((f) => { const s = document.createElement("script");
      s.src = DMA_Q("data-witze.js") + DMA_V("data-witze.js"); s.onload = f; s.onerror = f; document.head.appendChild(s); }));
    sage(geholt.some((u) => /^\/min\/data-witze\.js\?v=/.test(u)), "nachgeladene Datendateien kommen ebenfalls aus min/");
    sage(!fehlerListe.length, "keine Fehler beim Start mit den Kopien", fehlerListe.slice(0, 2).join(" | "));
    /* Das Klassenzimmer läuft mit den Kopien (Sitze, Spiel). */
    const kz = await pg.evaluate(() => {
      const leute = { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      if (window.DMA_PRUEF && window.DMA_PRUEF.neuZeichnen) window.DMA_PRUEF.neuZeichnen();
      return document.querySelectorAll("#lcPlaetze .lc-platz-belegt").length;
    });
    sage(kz >= 2, "das Klassenzimmer baut sich mit den Kopien auf", kz + " belegte Plätze");
    await ctx.close();
  }

  /* ---- 2. Rückfall ---- */
  console.log("\n  2) FEHLT EINE KOPIE, KOMMT DIE QUELLE");
  {
    fehlt = "min/quiz.js";
    const { ctx, pg } = await neuesFenster();
    await pg.goto(basis, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_SPIEL, { timeout: 30000 }).catch(() => {});
    await pg.waitForTimeout(1500);
    const r = await pg.evaluate(() => ({
      q: window.DMA_Q("quiz.js"),
      quiz: [...document.scripts].some((s) => (s.getAttribute("src") || "").indexOf("quiz.js") === 0),
      merk: localStorage.getItem("dma-ohne-min"), da: Boolean(window.LiveChat && window.DMA_SPIEL)
    }));
    sage(r.q === "quiz.js" && r.quiz && r.merk === String(await pg.evaluate(() => window.DMA_VERSION)) && r.da,
      "404 auf min/quiz.js → einmal neu geladen, jetzt aus den Quellen, alles da", JSON.stringify(r));
    fehlt = "";
    await ctx.close();
  }

  /* ---- 3. Service Worker ---- */
  console.log("\n  3) DER ZWISCHENSPEICHER WIE BEI EINER APP");
  {
    const { ctx, pg } = await neuesFenster();
    await pg.goto(basis + "?mit-sw", { waitUntil: "load" });
    const bereit = await pg.evaluate(() => new Promise((f) => {
      navigator.serviceWorker.ready.then(() => f(true));
      setTimeout(() => f(false), 12000);
    }));
    sage(bereit, "sw.js ist angemeldet (nach dem Laden, nicht davor)");
    /* Erst füllen: einmal neu laden, jetzt läuft alles durch den Helfer. */
    await pg.reload({ waitUntil: "load" });
    await pg.waitForTimeout(1500);
    const vorher = geholt.length;
    await pg.reload({ waitUntil: "load" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_SPIEL, { timeout: 30000 });
    await pg.waitForTimeout(800);
    const danach = geholt.slice(vorher);
    const gestempelt = danach.filter((u) => /\?v=[0-9a-f]{10}$/.test(u));
    sage(gestempelt.length === 0, "beim erneuten Öffnen kommt KEINE gestempelte Datei mehr übers Netz",
      danach.length + " Anfragen ans Netz: " + danach.slice(0, 6).join(", "));
    sage(danach.some((u) => /^\/index\.html/.test(u)), "die Seite selbst wird trotzdem frisch gefragt");
    const kasten = await pg.evaluate(async () => {
      const k = await caches.open("dma-dateien-1"); const alle = await k.keys();
      return alle.length;
    });
    sage(kasten >= 30, "im Speicher liegen die Dateien", kasten + " Einträge");
    /* Notaus */
    await pg.goto(basis + "?ohne-sw", { waitUntil: "load" });
    const weg = await pg.waitForFunction(() => navigator.serviceWorker.getRegistrations().then((r) => r.length === 0), null, { timeout: 8000 })
      .then(() => 0).catch(() => pg.evaluate(() => navigator.serviceWorker.getRegistrations().then((r) => r.length)));
    sage(weg === 0, "?ohne-sw meldet den Helfer ab");
    await ctx.close();
  }

  /* ---- 4. fassung.json ---- */
  console.log("\n  4) NACH NEUEN FASSUNGEN FRAGEN — KLEIN");
  {
    const { ctx, pg } = await neuesFenster();
    const vorher = geholt.length;
    await pg.goto(basis, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat, { timeout: 30000 });
    await pg.evaluate(() => { document.dispatchEvent(new Event("visibilitychange")); });
    await pg.waitForTimeout(7000);
    const d = geholt.slice(vorher);
    sage(!d.some((u) => /index\.html\?frisch=/.test(u)), "die ganze index.html wird nicht mehr nachgefragt",
      d.filter((u) => /index\.html\?/.test(u)).join(", ") || "keine");
    sage(d.some((u) => /^\/fassung\.json\?t=/.test(u)), "gefragt wird fassung.json");
    await ctx.close();
  }

  /* ---- 5. Leerlauf ---- */
  console.log("\n  5) VIER LEUTE IM KLASSENZIMMER, NIEMAND TUT WAS");
  {
    const { ctx, pg } = await neuesFenster();
    await pg.goto(basis, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF, { timeout: 30000 });
    await pg.evaluate(() => {
      const leute = {
        bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" },
        cem: { id: "cem", name: "Cem", seit: 7000, gesehen: 9e15, buehne: true, bild: "" },
        dora: { id: "dora", name: "Dora", seit: 8000, gesehen: 9e15, buehne: true, bild: "" }
      };
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    });
    await pg.waitForTimeout(4000);
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Performance.enable");
    const m = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
    const a = await m();
    await pg.waitForTimeout(5000);
    const b = await m();
    const task = (b.TaskDuration - a.TaskDuration) / 5 * 1000;
    const lauf = await pg.evaluate(() => document.getAnimations().filter((x) => x.playState === "running").map((x) => x.animationName));
    sage(task < 15, "Rechenzeit im Leerlauf unter 15 ms je Sekunde (vorher ~50)", task.toFixed(1) + " ms/s");
    sage(lauf.indexOf("lcMagicGlanz") < 0 && lauf.indexOf("lcMagicAtmen") < 0 && lauf.indexOf("lcMagicGlanzBlende") >= 0,
      "Magic-Knopf glänzt und atmet weiter — über die Grafikkarte", lauf.filter((n) => /Magic/.test(n)).join(", "));
    sage(lauf.indexOf("lcHintergrund") < 0, "der Farbschein hinter dem Chat ruht bei vier Leuten");
    await ctx.close();
  }

  console.log("\n  " + (fehler ? fehler + " FEHLER" : "Alles in Ordnung.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
