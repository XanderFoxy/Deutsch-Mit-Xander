#!/usr/bin/env node
/* =====================================================================
   SONDE — LADEZEIT NACH EINEM UPDATE (Funk 101)
   ---------------------------------------------------------------------
   XANDER: „warum es im Chat manchmal so extrem lange lädt … liegt das an
   diesen Updates … bitte mach das der Chat immer flüssig bleibt und dass
   er von den Updates nicht beeinträchtigt ist."

   Gemessen wird mit gedrosselter Leitung (10 Mbit/s, 60 ms) und vierfach
   gebremstem Rechner:
     1. erstes Laden (leerer Zwischenspeicher)
     2. „Update", in dem sich nur livechat.js ändert: es darf nur diese
        eine Datei neu kommen, nicht wieder alles
     3. Neuladen ohne Update
   Der Server spielt GitHub Pages nach: gzip, max-age=600, ETag.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  /* „Update": index.html bekommt eine neue Fassung und für livechat.js
     einen neuen Stempel — so wie es fassung-setzen.js nach einer
     Änderung an livechat.js täte. */
  let update = false;
  const gz = {};
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    const ext = path.extname(f);
    let inhalt = fs.readFileSync(f);
    if (p === "/index.html" && update) {
      inhalt = Buffer.from(String(inhalt)
        .replace(/DMA_VERSION = "(\d+)"/, (m, z) => 'DMA_VERSION = "' + (Number(z) + 1) + '"')
        .replace(/"livechat\.js":"[0-9a-f]+"/, '"livechat.js":"neu0000000"'));
    }
    if (p === "/fassung.json" && update) {
      inhalt = Buffer.from(String(inhalt).replace(/"fassung": "(\d+)"/, (m, z) => '"fassung": "' + (Number(z) + 1) + '"'));
    }
    const etag = '"' + require("crypto").createHash("md5").update(inhalt).digest("hex") + '"';
    const h = { "Content-Type": TYP[ext] || "application/octet-stream", "Cache-Control": "max-age=600", "ETag": etag };
    if (p === "/index.html" || p === "/fassung.json") h["Cache-Control"] = "no-cache";
    if (q.headers["if-none-match"] === etag) { a.writeHead(304, h); return a.end(); }
    if (TYP[ext]) { const k = f + etag; gz[k] = gz[k] || zlib.gzipSync(inhalt); h["Content-Encoding"] = "gzip"; a.writeHead(200, h); return a.end(gz[k]); }
    a.writeHead(200, h); a.end(inhalt);
  }).listen(0);
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 400, height: 850 } });
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 60, downloadThroughput: 10 * 125000, uploadThroughput: 3 * 125000 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
  let bytes = 0, neu = [];
  /* „Neu geholt" heisst: es kamen wirklich Bytes über die Leitung
     (mehr als ein 304 oder ein Kopf). */
  const adresse = {};
  cdp.on("Network.requestWillBeSent", (e) => { adresse[e.requestId] = e.request.url; });
  cdp.on("Network.loadingFinished", (e) => {
    bytes += e.encodedDataLength;
    const u = adresse[e.requestId] || "";
    if (e.encodedDataLength > 1500 && /\.(js|css)\?/.test(u) && u.startsWith("http://127.0.0.1")) neu.push(u.split("/").pop());
  });
  const lauf = async () => {
    bytes = 0; neu = [];
    const t0 = Date.now();
    await pg.goto(url, { waitUntil: "load", timeout: 180000 });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_SPIEL && window.DMA_V, { timeout: 60000 });
    return { ms: Date.now() - t0, kb: Math.round(bytes / 1024), neu: neu.slice() };
  };
  const kalt = await lauf();
  console.log("  erstes Laden:   " + kalt.ms + " ms, " + kalt.kb + " KB");
  update = true;
  const nachUpdate = await lauf();
  console.log("  nach Update:    " + nachUpdate.ms + " ms, " + nachUpdate.kb + " KB, neu geholt: " + nachUpdate.neu.join(", "));
  const warm = await lauf();
  console.log("  ohne Update:    " + warm.ms + " ms, " + warm.kb + " KB");

  /* Was schon beim ersten Laden da war, darf nach dem Update nicht noch
     einmal kommen — ausser livechat.js. (Nachgeladenes wie
     filmspieler.js kommt erst Sekunden nach dem Start und kann beim
     ersten Mal noch gefehlt haben; das zählt hier nicht.) */
  const schonDa = new Set(kalt.neu.map((u) => u.split("?")[0]));
  const doppelt = nachUpdate.neu.filter((u) => schonDa.has(u.split("?")[0]) && !/^livechat\.js/.test(u));
  sage(nachUpdate.neu.some((u) => /^livechat\.js\?v=neu/.test(u)) && doppelt.length === 0,
    "nach dem Update kommt nur livechat.js neu", doppelt.length ? "doppelt: " + doppelt.join(", ") : nachUpdate.neu.join(", "));
  sage(nachUpdate.kb < kalt.kb / 4, "nach dem Update weniger als ein Viertel der Daten", nachUpdate.kb + " von " + kalt.kb + " KB");
  sage(warm.kb < 60, "ohne Update fast nichts übertragen", warm.kb + " KB");
  const st = await pg.evaluate(() => ({ app: DMA_V("app.js"), ton: DMA_V("ton/a.mp3"), fremd: DMA_V("gibtsnicht.js") }));
  sage(/^\?v=[0-9a-f]{10}$/.test(st.app) && /^\?v=[0-9a-f]{10}$/.test(st.ton), "Stempel für Dateien und Ordner", JSON.stringify(st));
  sage(/^\?v=\d+$/.test(st.fremd), "unbekannte Datei fällt auf die Fassung zurück", st.fremd);

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
