#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 812: DREH-SCHIEBER UNTER DEM KOMPASS
   ---------------------------------------------------------------------
   XANDER (29.09., wörtlich): „erklär mir mal bitte wie dieser Händel
   unterm Kompass funktioniert … der springt immer irgendwo hin aber ich
   weiß gar nicht wohin er springt … Ich wollte eigentlich den Slider,
   der die Karte so hin dreht und zurückdreht".
   Geprüft (stadt-leicht.html?demo=1&mini=1, als iframe im kleinen Rahmen 280 × 175):
     • ohne Kompass-Nähe kein Schieber; mit Kompass (nah) steht er unter
       dem Kompass, ganz im Bild, ohne Überlappung mit Kompass/Uhr/Schild
     • Griff ziehen dreht stufenlos (Zwischenwerte), die Karte springt
       dabei nicht weg (Bildmitte bleibt auf demselben Boden)
     • loslassen rastet auf eine der acht Richtungen ein
     • senkrecht am Rand unter dem Kompass (29.09.: „von oben nach unten … unter dem Kompass“);
       kurzer Tipp oben/unten auf die Bahn dreht um 45°
     • Nadel („festnageln … PIN"): hält Lage, Nähe und Richtung fest,
       nach dem Neuladen öffnet der Rahmen genau dort; noch ein Tipp löst sie
   Bildschirmfoto: BILD=/pfad/praefix.
   Mit dem alten Stand (Knopf lk-drehknopf) ist alles rot.
   Aufruf: node werkzeug/pruefe-812-drehschieber.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/stadt-leicht.html";
    /* der kleine Rahmen: stadt-leicht.html als iframe (280 × 175) wie im Spiel */
    if (p === "/rahmen.html") { a.writeHead(200, { "Content-Type": "text/html" }); return a.end('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#222"><iframe id="f" src="/stadt-leicht.html?demo=1&zeit=tag&mini=1&eingebettet=1" style="border:0;width:280px;height:175px;margin:20px 10px"></iframe>'); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const seite = await br.newPage({ viewport: { width: 300, height: 215 }, deviceScaleFactor: 2 });
  seite.setDefaultTimeout(120000);
  const fehlerSeite = []; seite.on("pageerror", (e) => fehlerSeite.push(e.message));
  await seite.goto("http://127.0.0.1:" + srv.address().port + "/rahmen.html", { waitUntil: "load" });
  await seite.waitForTimeout(500);
  const pgF = seite.frames().find((f) => /stadt-leicht/.test(f.url()));
  const pg = pgF; pg.mouse = seite.mouse;
  await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
  await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {});
  await pg.waitForTimeout(800);
  const sicht = () => pg.evaluate(() => { const e = document.querySelector(".lk-drehschieber"); if (!e) return null; const r = e.getBoundingClientRect(); return { an: getComputedStyle(e).display !== "none" && r.width > 0, l: r.left, t: r.top, r: r.right, b: r.bottom }; });
  const s0 = await sicht();
  sage(!!s0 && !s0.an, "im Überblick (ohne Kompass) kein Dreh-Schieber", JSON.stringify(s0));
  await pg.click(".lk-lupe"); await pg.waitForTimeout(1500);
  const s1 = await sicht();
  const um = await pg.evaluate(() => [".lk-lupe", ".lk-uhr", ".lk-ortsschild", ".lk-wetter", ".lk-vollknopf"].map((s) => { const e = document.querySelector(s); if (!e || getComputedStyle(e).display === "none") return null; const r = e.getBoundingClientRect(); return r.width ? [s, r.left, r.top, r.right, r.bottom] : null; }).filter(Boolean));
  const ueber = s1 ? um.filter((u) => u[1] < s1.r - 0.5 && s1.l < u[3] - 0.5 && u[2] < s1.b - 0.5 && s1.t < u[4] - 0.5).map((u) => u[0]) : ["?"];
  sage(!!s1 && s1.b - s1.t > (s1.r - s1.l) * 2, "der Schieber steht senkrecht (höher als breit)", JSON.stringify(s1));
  sage(!!s1 && s1.an && s1.l >= 0 && s1.t >= 0 && s1.r <= 280 && s1.b <= 175 && !ueber.length, "mit dem Kompass steht der Schieber im Bild, ohne Überlappung", JSON.stringify({ s1, ueber }));
  if (process.env.BILD) await seite.screenshot({ path: process.env.BILD + "-schieber.png" });
  const bahn = await pg.evaluate(() => { const r = document.querySelector(".lk-schieber-bahn").getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  const d0 = await pg.evaluate(() => STADT.kamera.dreh);
  const mitte0 = await pg.evaluate(() => STADT.aufBoden(STADT.kamera.W / 2, STADT.kamera.H / 2));
  bahn[0] += 10; bahn[1] += 20;   // Lage des iframes in der Seite
  await pg.mouse.move(bahn[0], bahn[1]); await pg.mouse.down();
  const werte = [];
  for (let i = 1; i <= 6; i++) { await pg.mouse.move(bahn[0], bahn[1] + i * 5); werte.push(await pg.evaluate(() => STADT.kamera.dreh)); }
  const mitte1 = await pg.evaluate(() => STADT.aufBoden(STADT.kamera.W / 2, STADT.kamera.H / 2));
  const zwischen = werte.filter((w) => Math.abs(w * 2 - Math.round(w * 2)) > 0.02).length;
  sage(zwischen >= 3 && werte.every((w, i) => i === 0 || Math.abs(w - werte[i - 1]) < 0.2), "Griff ziehen dreht stufenlos mit (Zwischenwerte)", werte.map((w) => w.toFixed(3)).join(" "));
  sage(Math.hypot(mitte1[0] - mitte0[0], mitte1[1] - mitte0[1]) < 0.5, "die Karte dreht um die Bildmitte (springt nicht weg)", JSON.stringify([mitte0, mitte1].map((m) => m.map((v) => +v.toFixed(2)))));
  await pg.mouse.up(); await pg.waitForTimeout(900);
  const d1 = await pg.evaluate(() => STADT.kamera.dreh);
  sage(Math.abs(d1 * 2 - Math.round(d1 * 2)) < 1e-6 && Math.abs(d1 - d0) > 0.01, "loslassen rastet auf eine der acht Richtungen ein", d0 + " → " + d1);
  /* kurzer Tipp in die untere Hälfte der Bahn = rechts herum (45°) */
  const unten = await pg.evaluate(() => { const r = document.querySelector(".lk-schieber-bahn").getBoundingClientRect(); return [r.left + r.width / 2, r.bottom - 8]; });
  await pg.mouse.click(unten[0] + 10, unten[1] + 20); await pg.waitForTimeout(900);
  const d2 = await pg.evaluate(() => STADT.kamera.dreh);
  const diff = ((d1 - d2) % 4 + 4) % 4;
  sage(Math.abs(diff - 0.5) < 1e-6, "kurzer Tipp unten auf die Bahn dreht um 45° rechts herum", d1 + " → " + d2);
  sage(await pg.evaluate(() => document.body.classList.contains("lk-nah")), "nach dem Drehen bleibt man nah dran (kein Sprung auf die ganze Stadt)");
  /* ---- Nadel: Ansicht festhalten ---- */
  const pin0 = await pg.evaluate(() => { const e = document.querySelector(".lk-pinknopf"); if (!e) return null; const r = e.getBoundingClientRect(), s = document.querySelector(".lk-drehschieber").getBoundingClientRect(); return { an: getComputedStyle(e).display !== "none" && r.width > 0, frei: r.left >= s.right - 0.5, im: r.right <= 280 && r.bottom <= 175, w: r.width }; });
  sage(!!pin0 && pin0.an && pin0.frei && pin0.im, "nah dran: Nadel neben dem Schieber, im Bild", JSON.stringify(pin0));
  await pg.click(".lk-pinknopf"); await pg.waitForTimeout(300);
  const gemerkt = await pg.evaluate(() => ({ v: JSON.parse(localStorage.getItem("lk-pin-ansicht") || "null"), K: [STADT.kamera.x, STADT.kamera.y, STADT.kamera.s / STADT.kamera.dpr, STADT.kamera.dreh], an: document.querySelector(".lk-pinknopf").classList.contains("lk-an") }));
  sage(!!gemerkt.v && gemerkt.an, "Tipp auf die Nadel hält die Ansicht fest (gespeichert, Nadel leuchtet)", JSON.stringify(gemerkt));
  await pg.goto(pg.url()); await pg.waitForFunction(() => window.__fertig || window.__fehler, null, { timeout: 120000 });
  await pg.waitForFunction(() => !document.querySelector(".lk-vorhang"), null, { timeout: 30000 }).catch(() => {}); await pg.waitForTimeout(1200);
  const nachher = await pg.evaluate(() => ({ K: [STADT.kamera.x, STADT.kamera.y, STADT.kamera.s / STADT.kamera.dpr, STADT.kamera.dreh], nah: document.body.classList.contains("lk-nah") }));
  const gleich = nachher.K.every((v, i) => Math.abs(v - gemerkt.K[i]) < 0.05 * Math.max(1, Math.abs(gemerkt.K[i])));
  sage(gleich && nachher.nah, "neu geladen: der Rahmen öffnet genau in der festgehaltenen Ansicht", JSON.stringify({ vorher: gemerkt.K.map((v) => +v.toFixed(2)), nachher: nachher.K.map((v) => +v.toFixed(2)) }));
  await pg.click(".lk-pinknopf"); await pg.waitForTimeout(300);
  const los = await pg.evaluate(() => ({ v: localStorage.getItem("lk-pin-ansicht"), an: document.querySelector(".lk-pinknopf").classList.contains("lk-an") }));
  sage(!los.v && !los.an, "noch ein Tipp löst die Nadel wieder", JSON.stringify(los));
  sage(!fehlerSeite.length, "keine Seitenfehler", fehlerSeite.join(" | "));
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GUT") + "\n"); process.exit(fehler ? 1 : 0);
})();
