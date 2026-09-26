#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 698: FUNK 139–142
   ---------------------------------------------------------------------
   141 „das Wetter-Symbol … in der Nacht auch die Symbole mit dem Mond …
       Wetter auch für Döbeln einstellbar"
   139 „Beim Schiffe versenken sieht man immer noch die Sprechbild-
       Animationen … Stadt Land Fluss verschiebt immer noch den Chat,
       das soll ein Overlay sein"
   (142 Update-Blase: pruefe-neue-fassung.js · 140 Gesicht beim Auftritt:
   pruefe-690-tiere-effekte.js · 141 Mauer gegen Waffe: im Rollback auf
   dem Server geprüft, Hinweis hier.)
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
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const kf = [];

  console.log("\nWETTER: SONNE AM TAG, MOND IN DER NACHT, ORT WÄHLBAR\n");
  /* NUR_AUFTRITT=1 prüft nur den letzten Teil (für die Gegenprobe mit einem alten Stand). */
  for (const [tag, code] of (process.env.NUR_AUFTRITT ? [] : [[1, 2], [0, 2], [0, 0], [1, 0]])) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
    const pg = await ctx.newPage(); pg.on("pageerror", (e) => kf.push(String(e.message || e)));
    const anfragen = [];
    await pg.route(/open-meteo/, (r) => { anfragen.push(r.request().url()); r.fulfill({ contentType: "application/json", body: JSON.stringify({ current: { time: "2026-09-26T12:00", temperature_2m: 14, weather_code: code, is_day: tag } }) }); });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_wetter_ort"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => document.querySelector("#weatherIcon")?.dataset.code != null, { timeout: 20000 });
    const s = await pg.evaluate(() => { const i = document.getElementById("weatherIcon"); return { tag: i.dataset.tag, html: i.innerHTML, emoji: /[☀-➿\u{1F300}-\u{1FAFF}]/u.test(i.textContent) }; });
    const sonne = /#ffc93c/.test(s.html), mond = /#f6ecc0/.test(s.html);
    sage(!s.emoji && (tag ? sonne && !mond : mond && !sonne), (tag ? "Tag" : "Nacht") + ", Code " + code + ": " + (tag ? "Sonne" : "Mond") + " gezeichnet, kein Emoji", JSON.stringify({ sonne, mond, emoji: s.emoji }));
    if (tag === 1 && code === 2) {
      sage(anfragen.some((u) => /is_day/.test(u) && /latitude=52\.52/.test(u)), "gefragt wird mit is_day, zuerst für Berlin", (anfragen[0] || "").replace(/^.*\?/, "").slice(0, 90));
      await pg.click(".weather-readout");
      const m = await pg.evaluate(() => { const e = document.getElementById("wetterOrtMenue"); const r = e && e.getBoundingClientRect();
        return e ? { texte: [...e.querySelectorAll("button")].map((b) => b.textContent), imBild: r.left >= 0 && r.right <= innerWidth } : null; });
      sage(m && m.texte.join("|").startsWith("Berlin|Döbeln|Mein Standort") && m.imBild, "ein Tipp aufs Wetter: Berlin, Döbeln, Mein Standort (im Bild)", JSON.stringify(m));
      await pg.click('#wetterOrtMenue button[data-ort="doebeln"]');
      await pg.waitForTimeout(700);
      const gemerkt = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("dma_wetter_ort")); } catch (e) { return null; } });
      sage(anfragen.some((u) => /latitude=51\.12/.test(u)) && gemerkt && gemerkt.id === "doebeln", "Döbeln gewählt: neu gefragt für 51,12 N, gemerkt", JSON.stringify(gemerkt));
      await pg.screenshot({ path: path.join(process.env.BILD || "/tmp", "698-wetter.png"), clip: { x: 0, y: 60, width: 390, height: 60 } }).catch(() => {});
    }
    await ctx.close();
  }

  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage(); pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.route(/open-meteo/, (r) => r.fulfill({ contentType: "application/json", body: '{"current":{"temperature_2m":14,"weather_code":1,"is_day":1}}' }));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SCHIFFE && window.DMA_SLF_LIVE, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "", spricht: true, sprechbild: "welle" } } });
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
  });
  await pg.waitForTimeout(500);

  if (!process.env.NUR_AUFTRITT) {
  console.log("\nSCHIFFE VERSENKEN: KEIN SPRECHBILD AUF DEM BRETT\n");
  const vor = await pg.evaluate(() => document.querySelectorAll("#lcPlaetze .lc-platz-spricht").length);
  await pg.evaluate(() => { window.DMA_SCHIFFE({ phase: "verstecken", plaetze: 16, tafel: {}, meins: 0, reihe: [{ id: "ich", name: "Alex" }, { id: "bea", name: "Bea" }], ichBin: "ich", text: "Such dir heimlich einen Platz" }); window.DMA_PRUEF.neuZeichnen(); });
  await pg.waitForTimeout(400);
  const im = await pg.evaluate(() => ({ spricht: document.querySelectorAll("#lcPlaetze .lc-platz-spricht").length,
    feld: [...document.querySelectorAll("#lcPlaetze .lc-sprechfeld")].filter((e) => getComputedStyle(e).display !== "none").length }));
  sage(vor >= 1, "vorher: Bea spricht, ihr Sprechbild läuft", String(vor));
  sage(im.spricht === 0 && im.feld === 0, "im Spiel: kein Sprechbild auf irgendeinem Feld", JSON.stringify(im));
  await pg.evaluate(() => { window.DMA_SCHIFFE(null); window.DMA_PRUEF.neuZeichnen(); });
  await pg.waitForTimeout(300);
  const nach = await pg.evaluate(() => document.querySelectorAll("#lcPlaetze .lc-platz-spricht").length);
  sage(nach >= 1, "nach dem Spiel: das Sprechbild ist wieder da", String(nach));

  console.log("\nSTADT · LAND · FLUSS SCHWEBT ÜBER DEM CHAT\n");
  const lage = () => pg.evaluate(() => { const k = document.getElementById("livechatKarte");
    return [...k.children].filter((e) => e.id !== "lcSlfLive" && e.offsetParent).map((e) => (e.id || e.className.split(" ")[0]) + ":" + Math.round(e.getBoundingClientRect().top)); });
  const vorher = await lage();
  await pg.evaluate(() => window.DMA_SLF_LIVE({ runde: 1, phase: "schreiben", buchstabe: "b", endeUm: Date.now() + 90000, leiter: "ich", leiterName: "Alex",
    spalten: [{ id: "stadt", name: "Stadt" }, { id: "land", name: "Land" }, { id: "fluss", name: "Fluss" }, { id: "name", name: "Name" }], blatt: {} }));
  await pg.waitForTimeout(300);
  const nachher = await lage();
  const slf = await pg.evaluate(() => { const f = document.getElementById("lcSlfLive"), r = f.getBoundingClientRect(), l = document.getElementById("lcLeiste").getBoundingClientRect();
    return { pos: getComputedStyle(f).position, oben: Math.round(r.top - l.bottom), links: Math.round(r.left), rechts: Math.round(innerWidth - r.right), hoch: Math.round(r.height) }; });
  const verschoben = vorher.filter((x, i) => x !== nachher[i]);
  sage(verschoben.length === 0, "nichts im Chat hat sich bewegt", verschoben.join(", ") + (verschoben.length ? " → " + nachher.join(", ") : ""));
  sage(slf.pos === "absolute" && slf.oben >= 0 && slf.oben < 12 && slf.hoch > 120, "das Blatt schwebt direkt unter der Knopfleiste", JSON.stringify(slf));
  if (process.env.BILD) await pg.screenshot({ path: path.join(process.env.BILD, "698-slf.png") });
  await pg.evaluate(() => window.DMA_SLF_LIVE(null));

  console.log("\nANZIEHEN: DIE LETZTE ANWEISUNG GILT, AUCH WENN DIE ZEILEN VERKEHRT ANKOMMEN\n");
  const kleid = await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: Date.now(), zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    const t0 = Date.now() - 3600000;
    /* erst das NEUERE „ausziehen", danach das ÄLTERE „anziehen krone" (wie aus Zwischenspeicher + Server) */
    [["aus", 2], ["krone", 1]].forEach(([st, z]) => { window.LiveChat.pruefAnhaengen({ id: "kl" + z, art: "aktion", text: "…", name: "Alex", von: "ich", zeit: t0 + z * 1000, wirkung: "anziehen", wen: "Alex", stueck: st }); window.DMA_PRUEF.neuZeichnen(); });
    return new Promise((ok) => setTimeout(() => ok([...document.querySelectorAll("#lcPlaetze .lc-platz-ich .lc-kleid")].map((e) => e.dataset.lcKleid)), 600));
  });
  sage(kleid.length === 0, "neueres „ausziehen“ vor älterem „anziehen“ angekommen → nichts an (vorher: Krone wieder auf)", JSON.stringify(kleid));
  }

  console.log("\nAUFTRITT: KEIN FAHRZEUG ÜBER DEM GESICHT DES NACHBARN\n");
  const { PNG } = require("/tmp/claude-0/node_modules/pngjs");
  const anders = (a, b) => { const A = PNG.sync.read(a), B = PNG.sync.read(b); let n = 0, x = 0;
    for (let k = 0; k < A.data.length; k += 4) { n++; if (Math.abs(A.data[k] - B.data[k]) + Math.abs(A.data[k + 1] - B.data[k + 1]) + Math.abs(A.data[k + 2] - B.data[k + 2]) > 40) x++; }
    return Math.round(100 * x / n); };
  await pg.evaluate(() => { window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } }); window.DMA_PRUEF.neuZeichnen();
    document.documentElement.style.scrollBehavior = "auto"; document.getElementById("lcPlaetze").scrollIntoView({ block: "center" }); });
  await pg.waitForTimeout(400);
  const gesicht = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis').getBoundingClientRect();
    return { x: r.left + r.width * 0.15, y: r.top + r.height * 0.15, width: r.width * 0.7, height: r.height * 0.7 }; });
  const vorherBild = await pg.screenshot({ clip: gesicht });
  for (const art of ["sportwagen", "monstertruck", "kitt", "liane", "transformer"]) {
    const D = art === "transformer" ? 6400 : 3600, werte = [];
    await pg.evaluate((art) => { window.__t0 = performance.now(); window.DMA_AUFTRITT("ich", art, "rein"); }, art);
    for (const f of [0.1, 0.2, 0.3, 0.7, 0.8, 0.9]) {
      await pg.waitForFunction((z) => performance.now() - window.__t0 >= z, Math.round(f * D));
      /* Gemessen werden Fahrzeug, Seil und Roboter — das eigene Bild, das hereinkommt, darf vorbeischwingen. */
      await pg.evaluate(() => { document.getAnimations().forEach((a) => a.pause());
        document.querySelectorAll(".lc-auftritt .lc-auftritt-bild:not(.lc-auftritt-nachbar)").forEach((e) => { e.style.visibility = "hidden"; }); });
      werte.push(anders(vorherBild, await pg.screenshot({ clip: gesicht })));
      await pg.evaluate(() => { document.querySelectorAll(".lc-auftritt .lc-auftritt-bild").forEach((e) => { e.style.visibility = ""; });
        document.getAnimations().forEach((a) => a.play()); });
    }
    await pg.waitForTimeout(D + 400);
    sage(Math.max(...werte) <= 6, "„" + art + "“ fährt hinter Beas Gesicht durch (höchstens 6 % anders)", JSON.stringify(werte));
  }

  if (!process.env.NUR_AUFTRITT) {
    console.log("\nWALKIE IM LIVESTREAM: DAS MIKROFON WIRD FÜRS DIKTAT AUSGELIEHEN\n");
    const br2 = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] });
    const c2 = await br2.newContext({ permissions: ["microphone", "camera"] });
    const p2 = await c2.newPage(); p2.on("pageerror", (e) => kf.push(String(e.message || e)));
    await p2.route(/open-meteo/, (r) => r.fulfill({ contentType: "application/json", body: '{"current":{"temperature_2m":14,"weather_code":1,"is_day":1}}' }));
    await p2.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await p2.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await p2.waitForFunction(() => window.LiveChat && window.LiveChat.mikrofonLeihen && window.LiveChat.pruefEigenerStrom, { timeout: 25000 });
    const mik = await p2.evaluate(async () => {
      const strom = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: {} });
      window.LiveChat.pruefEigenerStrom(strom, true);
      const alt = strom.getAudioTracks()[0];
      const geliehen = window.LiveChat.mikrofonLeihen();
      const waehrend = { alteSpur: alt.readyState, spuren: strom.getAudioTracks().length, merkt: window.LiveChat.mikrofonGeliehen() };
      const zurueck = await window.LiveChat.mikrofonZurueck();
      const neu = strom.getAudioTracks()[0];
      return { geliehen, waehrend, zurueck, neu: neu ? neu.readyState : "keine", an: neu ? neu.enabled : null };
    });
    sage(mik.geliehen && mik.waehrend.alteSpur === "ended" && mik.waehrend.spuren === 0, "Diktat startet: der Livestream gibt sein Mikrofon ab (Spur beendet)", JSON.stringify(mik.waehrend));
    sage(mik.zurueck && mik.neu === "live" && mik.an === true, "Diktat vorbei: das Mikrofon ist wieder im Livestream, wie vorher an", JSON.stringify(mik));
    await br2.close();
  }

  sage(kf.length === 0, "keine Seitenfehler", kf.join(" | "));
  console.log("\nFassung 698: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
