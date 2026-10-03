#!/usr/bin/env node
/* =====================================================================
   SONDE 870 — DAS WETTER IM KOPF BLEIBT STEHEN (FASSUNG 852)
   ---------------------------------------------------------------------
   XANDER (Funk 280): „Das Wetter wird nicht mehr sauber angezeigt im
   Header der Hauptseite".
   1. Scheitert der erste Abruf, steht „—°" da, und nach 15 s wird neu
      geholt: dann steht die Temperatur da.
   2. Scheitert ein späterer Abruf, bleibt die gute Messung stehen.
   3. Keine Seitenfehler.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(e.message));
  let n = 0, kaputt = new Set([1]);
  await pg.route(/open-meteo/, (r) => { n++; if (kaputt.has(n)) return r.abort(); r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ current: { temperature_2m: 14.3, weather_code: 3, is_day: 1 } }) }); });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(3000);
  sage((await pg.textContent("#weatherOut")) === "—°", "erster Abruf gescheitert: „—°“", await pg.textContent("#weatherOut"));
  await pg.waitForFunction(() => /\d°/.test(document.getElementById("weatherOut").textContent), null, { timeout: 25000 }).catch(() => {});
  sage(/14°/.test(await pg.textContent("#weatherOut")), "nach 15 s neu geholt, Temperatur steht da", await pg.textContent("#weatherOut") + ", Abrufe " + n);
  /* später scheitert ein Abruf (Rückkehr aus dem Hintergrund) */
  kaputt.add(n + 1);
  await pg.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => false }); });
  const vorher = n;
  await pg.waitForTimeout(61000);   // Rückkehr holt höchstens einmal je Minute neu
  await pg.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await pg.waitForTimeout(1500);
  sage(n > vorher && /14°/.test(await pg.textContent("#weatherOut")), "späterer Abruf gescheitert: gute Messung bleibt stehen", n > vorher && await pg.textContent("#weatherOut") + ", Abrufe " + vorher + "→" + n);
  sage(!seitenfehler.length, "keine Seitenfehler", seitenfehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\nFEHL=" + fehler : "\nalles grün");
  process.exit(fehler ? 1 : 0);
})();
