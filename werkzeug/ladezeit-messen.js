#!/usr/bin/env node
/* =====================================================================
   MESSUNG — WIE LANGE BIS INS KLASSENZIMMER? (Funk 263/271)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „es soll doch unter Wissen und Klassenzimmer dann
   ins Klassenzimmer gehen wie immer auch nur zehnmal schneller … alles
   insgesamt nur zehn Mal schneller".

   Ein Server wie GitHub Pages (gzip, max-age=600, ETag), ein Telefon im
   Mobilfunknetz (Leitung und Rechner gedrosselt). Gemessen wird:
     fcp        erstes Bild
     bereit     die Seite reagiert (Reiter da, app.js durchgelaufen)
     kz         Wissen → Klassenzimmer angetippt bis „Klassenzimmer
                betreten" zu sehen ist (ab dem Tippen)
     kzAbStart  dasselbe ab dem Öffnen der Seite (Tippen sofort, wenn
                die Reiter da sind)
     kb         übertragene Kilobyte bis „bereit"
     js         Rechenzeit je Skript (Stichproben des Profilers)
   Läufe: kalt (leerer Zwischenspeicher) und warm (zweites Öffnen).

   Aufruf: node werkzeug/ladezeit-messen.js [netz] [wurzel]
     netz = 3g (1,6 Mbit/s, 150 ms) | 4g (9 Mbit/s, 60 ms, Standard)
     wurzel = anderes Verzeichnis (zum Vergleich mit einem alten Stand)
   Ausgabe als Tabelle, dazu JSON in LADEZEIT_JSON (falls gesetzt).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib"), crypto = require("crypto");
const NETZ = process.argv[2] || "4g";
const WURZEL = path.resolve(process.argv[3] || path.join(__dirname, ".."));
const SUPA = process.env.SUPABASE_UMD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const LEITUNG = { "3g": { down: 1.6e6 / 8, up: 0.75e6 / 8, rtt: 150 }, "4g": { down: 9e6 / 8, up: 3e6 / 8, rtt: 60 } }[NETZ];
const CPU = Number(process.env.CPU || 4);
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const gz = {};
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    const ext = path.extname(f), inhalt = fs.readFileSync(f);
    const etag = '"' + crypto.createHash("md5").update(inhalt).digest("hex") + '"';
    const h = { "Content-Type": TYP[ext] || "application/octet-stream", "Cache-Control": "max-age=600", "ETag": etag };
    if (p === "/index.html" || p === "/fassung.json") h["Cache-Control"] = "no-cache";
    if (q.headers["if-none-match"] === etag) { a.writeHead(304, h); return a.end(); }
    if (/\.(js|css|json|html|svg)$/.test(ext)) { const k = f + etag; gz[k] = gz[k] || zlib.gzipSync(inhalt, { level: 9 }); h["Content-Encoding"] = "gzip"; a.writeHead(200, h); return a.end(gz[k]); }
    a.writeHead(200, h); a.end(inhalt);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
  /* Fremde Adressen über CDP abfangen, nicht mit ctx.route: Playwright schaltet bei route() den
     Zwischenspeicher ab – dann wäre „warm" nicht warm. supabase-js kommt aus einer lokalen Kopie
     (so groß wie vom CDN: gzip), alles andere Fremde fällt sofort aus. */
  const supaText = SUPA && fs.existsSync(SUPA) ? fs.readFileSync(SUPA) : null;
  const supaGz = supaText ? zlib.gzipSync(supaText, { level: 9 }) : null;

  async function lauf(name) {
    const pg = await ctx.newPage();
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Network.enable");
    await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://*" }] });
    cdp.on("Fetch.requestPaused", (e) => {
      if (supaGz && /supabase-js/.test(e.request.url)) {
        cdp.send("Fetch.fulfillRequest", { requestId: e.requestId, responseCode: 200, body: supaGz.toString("base64"),
          responseHeaders: [{ name: "Content-Type", value: "text/javascript" }, { name: "Content-Encoding", value: "gzip" }, { name: "Cache-Control", value: "max-age=604800" }] }).catch(() => {});
      } else cdp.send("Fetch.failRequest", { requestId: e.requestId, errorReason: "Failed" }).catch(() => {});
    });
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: LEITUNG.rtt, downloadThroughput: LEITUNG.down, uploadThroughput: LEITUNG.up });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.setSamplingInterval", { interval: 1000 });
    let bytes = 0, bisBereit = null;
    const proDatei = {};
    cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength || 0; });
    cdp.on("Network.responseReceived", (e) => { proDatei[e.requestId] = { url: e.response.url, kb: 0 }; });
    cdp.on("Network.dataReceived", (e) => { if (proDatei[e.requestId]) proDatei[e.requestId].kb += (e.encodedDataLength || 0); });
    await cdp.send("Profiler.start");
    const t0 = Date.now();
    await pg.goto(basis, { waitUntil: "commit", timeout: 300000 });
    /* Reiter da und angebunden: Wissen lässt sich antippen */
    await pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading" && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 300000, polling: 50 });
    const bereit = Date.now() - t0;
    bisBereit = bytes;
    const tKlick = Date.now();
    /* tippen, bis Wissen wirklich offen ist (falls die Seite den ersten Tipp noch nicht annimmt) */
    await pg.waitForFunction(() => {
      const v = document.getElementById("view-knowledge");
      if (v && v.dataset.active === "true") return true;
      const t = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (t) t.click();
      return false;
    }, null, { timeout: 120000, polling: 100 });
    await pg.waitForFunction(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]'), null, { timeout: 120000, polling: 50 });
    await pg.evaluate(() => { const b = document.querySelector('.subnav-pill[data-sub="sub-livechat"]'); b && b.click(); });
    await pg.waitForFunction(() => {
      const b = document.querySelector("#lcBetreten, #lcZumKlassenzimmer");
      return b && b.getBoundingClientRect().height > 0;
    }, null, { timeout: 120000, polling: 50 }).catch(async (e) => {
      console.log("Klassenzimmer nicht erreicht:", await pg.evaluate(() => ({ aktiv: (document.querySelector(".view[data-active=true]") || {}).id,
        lc: (document.getElementById("sub-livechat") || {}).dataset, text: ((document.getElementById("sub-livechat") || {}).innerText || "").slice(0, 300) })));
      throw e;
    });
    const kz = Date.now() - tKlick, kzAbStart = Date.now() - t0;
    const fcp = await pg.evaluate(() => { const e = performance.getEntriesByName("first-contentful-paint")[0]; return e ? Math.round(e.startTime) : null; });
    await schlaf(1500);
    const { profile } = await cdp.send("Profiler.stop");
    /* Rechenzeit je Skript: Selbstzeit der Stichproben nach Datei */
    const knoten = new Map(profile.nodes.map((n) => [n.id, n]));
    const zeit = {};
    const dt = profile.timeDeltas || [];
    (profile.samples || []).forEach((id, i) => {
      const n = knoten.get(id); const u = (n && n.callFrame.url) || ("(" + ((n && n.callFrame.functionName) || "intern") + ")");
      const k = u.replace(/^http:\/\/127\.0\.0\.1:\d+\//, "").replace(/\?.*$/, "") || "(intern)";
      zeit[k] = (zeit[k] || 0) + (dt[i] || 0) / 1000;
    });
    const js = Object.entries(zeit).filter(([k]) => !/^\((idle)\)$/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => [k, Math.round(v)]);
    const dateien = Object.values(proDatei).filter((d) => d.kb > 0).map((d) => [d.url.replace(/^http:\/\/127\.0\.0\.1:\d+\//, "").replace(/\?.*$/, ""), Math.round(d.kb / 1024)]).sort((a, b) => b[1] - a[1]).slice(0, 12);
    await pg.close();
    return { name, fcp, bereit, kz, kzAbStart, kbBisBereit: Math.round(bisBereit / 1024), kbGesamt: Math.round(bytes / 1024), js, dateien };
  }

  const kalt = await lauf("kalt");
  const warm = await lauf("warm");
  await br.close(); srv.close();
  console.log("\nNetz " + NETZ + ", Rechner " + CPU + "× gebremst, " + WURZEL + "\n");
  for (const r of [kalt, warm]) {
    console.log(r.name.padEnd(5) + "  erstes Bild " + r.fcp + " ms   bereit " + r.bereit + " ms   Klassenzimmer +" + r.kz + " ms (ab Start " + r.kzAbStart + " ms)   " + r.kbBisBereit + " KB bis bereit, " + r.kbGesamt + " KB gesamt");
    console.log("       Rechenzeit: " + r.js.map(([k, v]) => k + " " + v).join(", "));
    console.log("       Dateien KB: " + r.dateien.map(([k, v]) => k + " " + v).join(", "));
  }
  if (process.env.LADEZEIT_JSON) fs.writeFileSync(process.env.LADEZEIT_JSON, JSON.stringify({ netz: NETZ, cpu: CPU, kalt, warm }, null, 1));
})().catch((e) => { console.error(e); process.exit(2); });
