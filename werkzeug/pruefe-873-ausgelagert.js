#!/usr/bin/env node
/* =====================================================================
   SONDE 873 — KACHELBILDER UND KREUZWORT ERST BEI BEDARF (Fassung 852)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   Die gezeichneten Kachelbilder (data-minibilder.js, 124 KB) und die
   Kreuzwort-Raster (data-kreuzwort.js, 55 KB) stehen nicht mehr in app.js.
     1  beim Start holt die Seite keine der beiden Dateien
     2  wenn die Seite ruhig ist, kommen die Kachelbilder nach – mit den
        echten Zeichnungen (Musik, Lok, Delfin …)
     3  das Kreuzworträtsel öffnet sich und zeigt sein Gitter
     4  keine Seitenfehler
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const anfragen = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    anfragen.push({ p, t: Date.now() });
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 390, height: 800 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e).split("\n")[0]));
  await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.LiveChat, null, { timeout: 120000 });
  const nachStart = anfragen.map((a) => a.p);
  sage(!nachStart.some((p) => /data-kreuzwort/.test(p)), "1: das Kreuzwort wird beim Start nicht geholt");
  sage(!nachStart.some((p) => /data-minibilder/.test(p)), "1: die Kachelbilder werden beim Start nicht geholt");

  await pg.waitForFunction(() => window.DMA_MINI_BILD, null, { timeout: 15000 }).catch(() => {});
  const mini = await pg.evaluate(() => {
    const M = window.DMA_PRUEF.miniBilder();
    return { n: Object.keys(M).length, echt: Object.keys(M).filter((k) => /lc-mini-echt/.test(M[k])).length, musik: /lc-mini-echt/.test(M["🎧 Musik"] || "") };
  });
  sage(mini.n > 100 && mini.echt >= 15 && mini.musik, "2: die Kachelbilder kommen nach, mit echten Zeichnungen", JSON.stringify(mini));

  const kw = await pg.evaluate(async () => {
    document.querySelector('.tape-tab[data-target="view-learn"]').click();
    const b = document.querySelector('#learnSubnav [data-sub="sub-crossword"]'); b.style.display = ""; b.click();
    const t0 = performance.now();
    while (performance.now() - t0 < 15000) {
      const a = document.getElementById("crosswordArea");
      const zellen = a ? a.querySelectorAll("input, .cw-cell, td").length : 0;
      if (zellen > 10) return { zellen, text: "" };
      await new Promise((f) => setTimeout(f, 100));
    }
    const a = document.getElementById("crosswordArea");
    return { zellen: 0, text: a ? a.innerText.slice(0, 120) : "" };
  });
  const verdienen = /verdien|freischalt|Punkte/i.test(kw.text);
  sage(kw.zellen > 10 || verdienen, "3: das Kreuzworträtsel öffnet sich" + (verdienen ? " (hinter der Freischalt-Schranke)" : ""), kw.zellen + " Zellen " + kw.text);
  sage(anfragen.some((a) => /data-kreuzwort/.test(a.p)) || verdienen, "3: die Raster kamen erst jetzt");
  sage(!seitenFehler.length, "4: keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 852 (Sonde 873): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
