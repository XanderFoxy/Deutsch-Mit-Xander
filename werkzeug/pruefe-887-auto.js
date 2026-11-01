#!/usr/bin/env node
/* PRÜFT FASSUNG 887 (L4): AUTO-BLÄTTER OHNE RUCK.
   ---------------------------------------------------------------
   Bis 886 malte lcAuto3dLaden jedes Drehblatt (bis 2040 × 4084 Bildpunkte) einmal auf eine 16×16-Leinwand, damit das
   Entpacken nicht mitten im Auftritt ruckt – gemessen 1 130 ms am Stück im Hauptfaden (CPU 4×), im Klassenzimmer.
   Jetzt: img.decode() (abseits des Hauptfadens), im Auftritt ImageBitmaps (≤ 250 ms gewartet, danach close()).
     V  Vorladen von Viper und Batmobil bei CPU 4×: kein langes Bild (LoAF) über 100 ms
     S  der Auftritt startet nicht später als bei 886 (Uhr läuft; Median aus je 3 Läufen, Rauschgrenze 120 ms)
     P  erstes Bild, Kurve und mittleres Bild der Leinwand sind pixelgleich mit 886
     C  nach dem Auftritt sind die Bitmaps geschlossen (close)
   Vergleich: VERGLEICH=<886-Baum> (sonst wird 7e23e157 per git archive in TMPDIR gebaut).
   ERGEBNIS 887 (01.11.): NICHT ausgeliefert. Mit Bitmaps startete der Auftritt 285–305 ms SPÄTER als 886 (Median 466 gegen
   181 ms Viper, 441 gegen 136 ms Batmobil), das längste Bild im Auftritt wurde nicht kürzer (137/143 gegen 101/128 ms), und
   das Bild in der Kurve war nicht pixelgleich; das Vorab-Malen von 886 erzeugte hier keinen Langläufer (0 ms), ein Gewinn war
   also nicht messbar. Der Code ist zurückgenommen; die Sonde bleibt als Messgerät für den nächsten Versuch (Logbuch 887, L4). */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), { execSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b[Math.floor((b.length - 1) / 2)]; };

function vergleichsBaum() {
  if (process.env.VERGLEICH) return path.resolve(process.env.VERGLEICH);
  const ziel = path.join(os.tmpdir(), "dma-887-auto-886");
  if (fs.existsSync(path.join(ziel, "app.js"))) return ziel;
  fs.mkdirSync(ziel, { recursive: true });
  const repo = path.join(__dirname, "..");
  const dateien = execSync("git -C " + JSON.stringify(repo) + " ls-tree --name-only 7e23e157", { encoding: "utf8" }).split("\n").filter(Boolean);
  const blobs = dateien.filter((f) => execSync("git -C " + JSON.stringify(repo) + " cat-file -t 7e23e157:" + JSON.stringify(f), { encoding: "utf8" }).trim() === "blob");
  execSync("git -C " + JSON.stringify(repo) + " archive 7e23e157 " + blobs.concat(["min"]).map((f) => JSON.stringify(f)).join(" ") + " | tar -x -C " + JSON.stringify(ziel));
  dateien.filter((f) => !blobs.includes(f) && !["min", "werkzeug", ".sicherung"].includes(f)).forEach((d) => { try { fs.symlinkSync(path.join(repo, d), path.join(ziel, d)); } catch (e) {} });
  return ziel;
}
function server(wurzel) {
  return new Promise((ok) => {
    const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(wurzel, p);
      if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "max-age=600" }); fs.createReadStream(f).pipe(a); }).listen(0, () => ok(srv));
  });
}

async function messen(br, wurzel, name) {
  const srv = await server(wurzel);
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e).slice(0, 160)));
  await pg.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
    window.__loaf = [];
    try { new PerformanceObserver((l) => l.getEntries().forEach((x) => { if (x.duration >= 50) window.__loaf.push({ t: x.startTime, d: Math.round(x.duration), sk: (x.scripts || []).map((s) => [Math.round(s.duration), String(s.sourceURL || "").replace(/^.*\//, "").replace(/\?.*$/, "") + "@" + s.sourceCharPosition, s.invokerType]) }); })).observe({ type: "long-animation-frame", buffered: true }); } catch (e) {}
    /* Bitmaps mitzählen (nur 887 hat sie): erzeugt / geschlossen */
    window.__bm = { neu: 0, zu: 0 };
    if (window.createImageBitmap) { const c = window.createImageBitmap; window.createImageBitmap = function () { return c.apply(this, arguments).then((b) => { window.__bm.neu++; const z = b.close; b.close = function () { window.__bm.zu++; return z.apply(this, arguments); }; return b; }); }; }
  });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_AUFTRITT && window.DMA_AUTO3D_VORLADEN, null, { timeout: 30000 });
  await schlaf(6000);   /* der Start der Seite ist vorbei */
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await schlaf(500);
  /* V: Vorladen */
  const v = await pg.evaluate(async () => {
    /* Wie im Klassenzimmer: die Seite zeichnet laufend (Videos, Sprechring). Ohne laufende Bilder fällt das Entpacken
       des Vorab-Malens in keinen Bildaufbau und bleibt unsichtbar – so hatte die erste Fassung dieser Sonde 0 ms gemessen. */
    const punkt = document.createElement("div"); punkt.style.cssText = "position:fixed;left:0;top:0;width:2px;height:2px;background:#000;z-index:2";
    document.body.appendChild(punkt); let laeuft = true, k = 0;
    const takt = () => { if (!laeuft) return; punkt.style.transform = "translateX(" + (k++ % 50) + "px)"; requestAnimationFrame(takt); }; requestAnimationFrame(takt);
    const t0 = performance.now();
    for (const a of ["viper", "batmobil"]) {
      const L = window.DMA_AUTO3D_VORLADEN(a);
      for (let i = 0; i < 600 && L && !L.fertig && !L.fehler; i++) await new Promise((r) => setTimeout(r, 50));
    }
    await new Promise((r) => setTimeout(r, 3000));
    laeuft = false; punkt.remove();
    const t1 = performance.now();
    const l = window.__loaf.filter((x) => x.t >= t0 && x.t <= t1);
    return { ms: Math.round(t1 - t0), max: Math.max(0, ...l.map((x) => x.d)), n: l.length, top: l.sort((a, b) => b.d - a.d).slice(0, 3) };
  });
  /* Raum nachstellen (wie pruefe-812-auftritt-autos.js) */
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
  await schlaf(800);
  /* S: Start (Uhr läuft), je Auto 3 Läufe, echt abgespielt */
  const start = {};
  for (const art of ["viper", "batmobil"]) {
    start[art] = [];
    for (let k = 0; k < 3; k++) {
      const r = await pg.evaluate((art) => new Promise((fertig) => {
        window.DMA_AUFTRITT_HALTEN = false; window.DMA_AUTO3D = null;
        const t0 = performance.now(), l0 = window.__loaf.length;
        window.DMA_AUFTRITT("ich", art, "rein", 0, false, true);
        let erstesBild = null;
        const sieh = () => {
          const c = document.querySelector(".lc-auftritt canvas.lc-auftritt-3d");
          const a = c && c.getAnimations ? c.getAnimations()[0] : null;
          if (erstesBild == null && window.DMA_AUTO3D && window.DMA_AUTO3D.jetzt && window.DMA_AUTO3D.jetzt()) erstesBild = performance.now() - t0;
          if (a && a.playState === "running" && a.currentTime > 0) {
            const los = performance.now() - t0;
            setTimeout(() => { const l = window.__loaf.slice(l0); fertig({ los: Math.round(los), erstesBild: Math.round(erstesBild == null ? -1 : erstesBild), maxLoaf: Math.max(0, ...l.map((x) => x.d)) }); }, 5600);
            return;
          }
          if (performance.now() - t0 > 8000) return fertig({ los: -1 });
          requestAnimationFrame(sieh);
        };
        requestAnimationFrame(sieh);
      }), art);
      start[art].push(r);
      await schlaf(800);
    }
  }
  const bm = await pg.evaluate(() => Object.assign({}, window.__bm));
  /* P: Pixel (CPU 1×, angehalten) */
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const pixel = {};
  for (const art of ["viper", "batmobil"]) {
    await pg.evaluate((a) => { document.querySelectorAll(".lc-auftritt").forEach((b) => b.remove()); window.DMA_AUTO3D = null; window.DMA_AUFTRITT_HALTEN = true; window.DMA_AUFTRITT("ich", a, "rein", 0, false, true); }, art);
    await pg.waitForFunction(() => document.querySelector(".lc-auftritt canvas.lc-auftritt-3d") && window.DMA_AUTO3D && window.DMA_AUTO3D.jetzt(), null, { timeout: 12000 }).catch(() => {});
    await schlaf(600);
    const plan = await pg.evaluate(() => window.DMA_AUTO3D && window.DMA_AUTO3D.plan);
    pixel[art] = {};
    for (const [k, t] of [["erstes", 0], ["kurve", plan ? plan.tKurve : 1], ["mitte", plan ? plan.D / 2 : 2.6]]) {
      pixel[art][k] = await pg.evaluate((t) => new Promise((fertig) => {
        const b = document.querySelector(".lc-auftritt");
        if (!b) return fertig(null);
        b.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000; });
        requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => {
          const c = b.querySelector("canvas.lc-auftritt-3d"), d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
          let h = 2166136261, voll = 0;
          for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); }
          for (let i = 3; i < d.length; i += 4) if (d[i]) voll++;
          fertig({ h: (h >>> 0).toString(16), voll });
        })));
      }), t);
    }
    await pg.evaluate(() => { window.DMA_AUFTRITT_HALTEN = false; document.querySelectorAll(".lc-auftritt").forEach((b) => b.remove()); });
  }
  await ctx.close(); srv.close();
  return { name, v, start, pixel, bm, kf };
}

(async () => {
  const VGL = vergleichsBaum();
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--autoplay-policy=no-user-gesture-required"] });
  const a = await messen(br, WURZEL, "dieser Stand");
  const b = await messen(br, VGL, "886");
  await br.close();
  let fehler = 0;
  const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  console.log("\n  V  Vorladen bei CPU 4×");
  console.log("     886: längstes Bild " + b.v.max + " ms (" + b.v.n + " ≥ 50 ms) " + JSON.stringify(b.v.top.map((x) => [x.d, (x.sk[0] || [])[1]])));
  ok(a.v.max <= 100, "kein langes Bild über 100 ms beim Vorladen", a.v.max + " ms (" + a.v.n + " ≥ 50 ms) " + JSON.stringify(a.v.top.map((x) => [x.d, (x.sk[0] || [])[1]])));
  console.log("\n  S  Start des Auftritts (Uhr läuft, ms nach dem Aufruf, CPU 4×)");
  for (const art of ["viper", "batmobil"]) {
    const x = a.start[art].map((r) => r.los), y = b.start[art].map((r) => r.los);
    const sp = Math.max(...y) - Math.min(...y);
    console.log("     " + art + ": dieser " + JSON.stringify(a.start[art]) + "\n     " + art + ": 886    " + JSON.stringify(b.start[art]));
    ok(x.every((q) => q >= 0) && med(x) <= med(y) + Math.max(120, sp), art + ": startet nicht später als 886", "Median " + med(x) + " gegen " + med(y) + " ms (Rauschgrenze " + Math.max(120, sp) + ")");
    console.log("     " + art + ": längstes Bild im Auftritt " + med(a.start[art].map((r) => r.maxLoaf)) + " gegen " + med(b.start[art].map((r) => r.maxLoaf)) + " ms (Median)");
  }
  console.log("\n  P  Pixel");
  for (const art of ["viper", "batmobil"]) for (const k of ["erstes", "kurve", "mitte"]) {
    const x = a.pixel[art][k], y = b.pixel[art][k];
    ok(x && y && x.h === y.h, art + " " + k + ": pixelgleich mit 886", JSON.stringify(x) + " / " + JSON.stringify(y));
  }
  ok(a.pixel.batmobil.mitte && a.pixel.batmobil.mitte.voll > 1000, "das mittlere Bild zeigt wirklich ein Auto", (a.pixel.batmobil.mitte || {}).voll + " Bildpunkte");
  console.log("\n  C  Bitmaps");
  ok(a.bm.neu === 0 || a.bm.zu === a.bm.neu, "alle Bitmaps nach dem Auftritt geschlossen", JSON.stringify(a.bm));
  ok(a.kf.length === 0, "keine Seitenfehler", a.kf.slice(0, 3).join(" | "));
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Die Autos fahren ohne Ruck – und sehen aus wie vorher.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
