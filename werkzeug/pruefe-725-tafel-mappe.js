#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 725: BILDERWELTEN UND AUSSPRACHE-BILDER AUF DIE TAFEL
   ---------------------------------------------------------------------
   XANDER (Funk 168): „dass wir diese Inhalte von den Bilderwelten auch auf
   unserem Whiteboard nutzen können und … diese Tricks wie man das NG
   produziert … dass man die auf diese Tafel legen kann … dafür muss es
   irgendwie extra Ordner geben".
   Der Bild-Knopf der Tafel öffnet eine Mappe mit drei Ordnern; ein Tipp
   legt das Bild auf die Tafel und schickt es allen im Raum.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); a.end(); return; }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 390, height: 820 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const seitenFehler = []; pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_TAFEL, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    window.__gesendet = []; window.LiveChat.tafelSenden = (d) => window.__gesendet.push(d);
    window.DMA_TAFEL({ t: "blick", z: 1, x: .5, y: .5 }, "Alex", "Alex");
  });
  await tick(600);
  const klick = (sel) => pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);

  console.log("\nDIE MAPPE\n");
  sage(await klick('#lcTafel [data-tafel="bild"]'), "die Tafel hat den Bild-Knopf");
  await tick(300);
  let r = await pg.evaluate(() => [...document.querySelectorAll(".lc-tafel-bildmappe .lc-tafel-bm-ordner span")].map((s) => s.textContent));
  sage(JSON.stringify(r) === JSON.stringify(["Vom Gerät", "Bilderwelten", "Aussprache"]), "drei Ordner: Vom Gerät, Bilderwelten, Aussprache", JSON.stringify(r));

  console.log("\nAUSSPRACHE: NG AUF DIE TAFEL\n");
  await klick('.lc-tafel-bildmappe [data-o="laute"]');
  await pg.waitForFunction(() => document.querySelectorAll(".lc-tafel-bildmappe [data-mappe=laut]").length > 0, { timeout: 15000 }).catch(() => {});
  r = await pg.evaluate(() => [...document.querySelectorAll(".lc-tafel-bildmappe [data-mappe=laut]")].map((b) => b.dataset.k + (b.querySelector("svg") ? "+svg" : "")));
  sage(r.length >= 8 && r[0] === "ng+svg", "Aussprache-Ordner mit Vorschaubildern (NG zuerst)", JSON.stringify(r));
  await klick('.lc-tafel-bildmappe [data-mappe="laut"][data-k="ng"]');
  await pg.waitForFunction(() => window.__gesendet.some((d) => d.t === "bild"), { timeout: 10000 }).catch(() => {});
  r = await pg.evaluate(() => { const b = document.getElementById("lcTafelBild"), g = window.__gesendet.filter((d) => d.t === "bild").pop();
    return { sichtbar: b && !b.hidden, jpeg: b && /^data:image\/jpeg/.test(b.src), laenge: g ? g.q.length : 0, mappeZu: !document.querySelector(".lc-tafel-bildmappe"), breit: b ? b.naturalWidth : 0 }; });
  sage(r.sichtbar && r.jpeg && r.laenge > 5000 && r.laenge < 300000 && r.mappeZu, "NG-Bild liegt auf der Tafel und geht an alle (als JPEG, klein genug)", JSON.stringify(r));
  /* Ist wirklich etwas gezeichnet (nicht nur weiß)? Mittlere Helligkeit < 250. */
  const hell = await pg.evaluate(() => new Promise((ok) => { const i = new Image(); i.onload = () => { const c = document.createElement("canvas"); c.width = 60; c.height = 40; const g = c.getContext("2d"); g.drawImage(i, 0, 0, 60, 40); const d = g.getImageData(0, 0, 60, 40).data; let s = 0; for (let k = 0; k < d.length; k += 4) s += (d[k] + d[k + 1] + d[k + 2]) / 3; ok(Math.round(s / (d.length / 4))); }; i.src = document.getElementById("lcTafelBild").src; }));
  sage(hell < 248, "das Bild zeigt die Zeichnung (nicht nur Weiß)", "mittlere Helligkeit " + hell);

  console.log("\nBILDERWELTEN: NACH THEMA, EINE SZENE AUF DIE TAFEL\n");
  await klick('#lcTafel [data-tafel="bild"]'); await tick(200);
  await klick('.lc-tafel-bildmappe [data-o="welten"]');
  await pg.waitForFunction(() => document.querySelectorAll('.lc-tafel-bildmappe [data-o^="welten:"]').length > 2, { timeout: 20000 }).catch(() => {});
  r = await pg.evaluate(() => [...document.querySelectorAll('.lc-tafel-bildmappe [data-o^="welten:"]')].map((b) => b.dataset.o.slice(7)));
  sage(r.length >= 4, "Bilderwelten in Themen-Ordnern", r.length + " Themen: " + r.slice(0, 5).join(", "));
  await klick('.lc-tafel-bildmappe [data-o^="welten:"]'); await tick(300);
  const szene = await pg.evaluate(() => { const b = document.querySelector('.lc-tafel-bildmappe [data-mappe="szene"]'); return b ? b.dataset.id : ""; });
  const vorher = await pg.evaluate(() => window.__gesendet.length);
  await klick('.lc-tafel-bildmappe [data-mappe="szene"]');
  await pg.waitForFunction((v) => window.__gesendet.length > v, { timeout: 15000 }, vorher).catch(() => {});
  r = await pg.evaluate(() => { const g = window.__gesendet.filter((d) => d.t === "bild").pop(), b = document.getElementById("lcTafelBild"); return { laenge: g ? g.q.length : 0, breit: b ? b.naturalWidth : 0, hoch: b ? b.naturalHeight : 0 }; });
  sage(szene && r.laenge > 10000 && r.laenge < 300000 && r.breit >= 600, "Szene „" + szene + "“ liegt auf der Tafel (mit allen Teilen, für alle)", JSON.stringify(r));
  sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.slice(0, 2).join(" | "));
  if (process.env.BILD) await (await pg.$("#lcTafel")).screenshot({ path: process.env.BILD });
  await br.close(); srv.close();
  console.log("\nFassung 725 (Tafel-Mappe): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
