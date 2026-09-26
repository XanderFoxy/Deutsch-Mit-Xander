#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 696: DIE NEUEN AUFTRITTE
   ---------------------------------------------------------------------
   XANDER: „Monstertruck … wie bei Colt Seavers … K.I.T.T. mit dem roten
   Scanner … eine rote Dodge Viper … Liane … Transformers … Lass dir da
   Zeit". Jeder Auftritt läuft rein und raus; die Sonde sieht nach, dass
   die Bühne entsteht, die Töne laufen, das Bild am Ende auf dem Platz
   sitzt (bzw. weg ist) und danach alles aufgeräumt ist.
   BILD=/pfad/x  legt Bildschirmfotos zu mehreren Zeitpunkten ab.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} window.DMA_TONLOG = []; });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF && window.DMA_AUFTRITT, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    document.documentElement.style.scrollBehavior = "auto";
    document.getElementById("lcPlaetze").scrollIntoView({ block: "center" });
  });
  const tick = (ms) => pg.waitForTimeout(ms);
  const B = process.env.BILD;
  await tick(600);
  const ARTEN = { monstertruck: [3600, "auftritt-colt"], kitt: [3600, "auftritt-kitt"], viper: [3600, "auftritt-viper"], liane: [3600, "auftritt-liane"], transformer: [6400, "auftritt-trafo"] };
  for (const art of Object.keys(ARTEN)) {
    const [D, ton] = ARTEN[art];
    for (const r of ["rein", "raus"]) {
      console.log("\n" + art.toUpperCase() + " " + r + "\n");
      await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
      const los = await pg.evaluate(([a, r]) => window.DMA_AUFTRITT("ich", a, r), [art, r]);
      const anteile = [0.12, 0.3, 0.45, 0.55, 0.62, 0.72, 0.9];
      /* Die Zeitpunkte zählen ab dem Start — Bildschirmfotos kosten Zeit und dürfen nicht aufsummieren. */
      const start = Date.now(); let t0 = 0; const lagen = [];
      for (const f of anteile) {
        const t = Math.round(f * D); await tick(Math.max(0, t - (Date.now() - start))); t0 = Date.now() - start;
        lagen.push(await pg.evaluate((a) => { const b = document.querySelector(".lc-auftritt .lc-auftritt-bild"), k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis');
          if (!b || !k) return null; const rb = b.getBoundingClientRect(), rk = k.getBoundingClientRect();
          const z = document.querySelector(".lc-auftritt .lc-reisewagen, .lc-auftritt-trafo, .lc-auftritt-seil"), rz = z && z.getBoundingClientRect();
          return { dx: Math.round(rb.left + rb.width / 2 - rk.left - rk.width / 2), dy: Math.round(rb.top + rb.height / 2 - rk.top - rk.height / 2), gr: +(rb.width / rk.width).toFixed(2),
            sx: window.scrollX, bl: b.style.left, kl: rk.left, zug: rz ? [Math.round(rz.left), Math.round(rz.top), Math.round(rz.width), Math.round(rz.height)] : null }; }, art));
        if (B) await pg.screenshot({ path: B + "-" + art + "-" + r + "-" + Math.round(f * 100) + ".png" });
      }
      await tick(Math.max(0, D + 250 - (Date.now() - start)));
      const ende = await pg.evaluate(() => ({ buehne: Boolean(document.querySelector(".lc-auftritt")), sicht: getComputedStyle(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis')).visibility,
        toene: window.DMA_TONLOG.map((x) => x.name) }));
      sage(los === true, art + " " + r + ": startet", String(los));
      if (r === "rein") {
        const l = lagen[5];
        sage(l && Math.abs(l.dx) <= 3 && Math.abs(l.dy) <= 3 && Math.abs(l.gr - 1) < 0.06, art + ": das Bild sitzt am Ende genau auf dem Platz", JSON.stringify(l));
        const a = lagen[0];
        sage(a && (Math.abs(a.dx) > 10 || Math.abs(a.dy) > 10), art + ": am Anfang ist das Bild noch unterwegs", JSON.stringify(a));
      } else {
        const l = lagen[6];
        sage(l && (Math.abs(l.dx) > 40 || Math.abs(l.dy) > 40 || l.gr < 0.7), art + ": am Ende ist das Bild fort vom Platz", JSON.stringify(l));
      }
      console.log("         Bahn: " + lagen.map((x) => x ? x.dx + "/" + x.dy + "@" + x.gr : "-").join("  "));
      sage(!ende.buehne && ende.sicht === "visible", art + " " + r + ": danach aufgeräumt", JSON.stringify(ende));
      sage(ende.toene.indexOf(ton) >= 0, art + " " + r + ": sein Ton „" + ton + "“ läuft", ende.toene.join(","));
    }
  }
  sage(kf.length === 0, "keine Fehler in der Konsole", kf.join(" | "));
  console.log("\nFassung 696 auf dem Telefon: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
