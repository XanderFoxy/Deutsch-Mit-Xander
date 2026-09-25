#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 660: KLEINE FARBIGE BILDER AUF DEN KACHELN
   ---------------------------------------------------------------------
   XANDER: „die kleinen SVG Grafiken … für unseren Bagger und
   Schaufelradbagger und alle Sachen, die wir bei uns in den
   Profileffekten haben, dass die auf den Kacheln so ihre großen Version
   in ganz kleinen Miniatur sind auch in Farbe".
   Android-Telefon (360 px).
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
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
  });
  const zaehle = () => pg.evaluate(() => { const k = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")];
    const mit = k.filter((b) => b.querySelector(".lc-platzmenue-zeichen svg"));
    const ohne = k.filter((b) => !b.querySelector(".lc-platzmenue-zeichen svg")).map((b) => (b.querySelector(".lc-platzmenue-wort") || {}).textContent);
    const g = mit[0] ? mit[0].querySelector("svg").getBoundingClientRect() : { width: 0, height: 0 };
    return { alle: k.length, mit: mit.length, ohne, w: Math.round(g.width), h: Math.round(g.height) }; });

  console.log("\nPLATZMENÜ BEI BEA\n");
  await pg.evaluate(() => window.DMA_PRUEFUNG.platzMenue(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]')));
  await pg.waitForTimeout(250);
  const a = await zaehle();
  sage(a.alle > 50 && a.mit === a.alle, "jede Kachel hat ihr kleines farbiges Bild", a.mit + " von " + a.alle + (a.ohne.length ? " — ohne: " + a.ohne.join(", ") : ""));
  sage(a.w >= 20 && a.w <= 30 && a.w === a.h, "Größe passt auf die Kachel (quadratisch, ~24 px)", a.w + "×" + a.h);
  await pg.evaluate(() => document.getElementById("lcPlatzMenue").scrollIntoView({ block: "center" }));
  await pg.locator("#lcPlatzMenue").screenshot({ path: "/tmp/claude-0/p-660-menue.png" });

  console.log("\nTRANSPORT (BAGGER, SCHAUFELRADBAGGER, KRAN)\n");
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Transport/.test(x.textContent)); b.click(); });
  await pg.waitForTimeout(250);
  const t = await zaehle();
  const tNamen = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].filter((b) => b.querySelector("svg")).map((b) => b.querySelector(".lc-platzmenue-wort").textContent));
  sage(tNamen.indexOf("Schaufelradbagger") >= 0 && tNamen.indexOf("Bagger mit Schaufel") >= 0 && tNamen.indexOf("Kran") >= 0, "Schaufelradbagger, Bagger und Kran zeigen ihre Maschine", tNamen.join(", "));
  sage(t.mit === t.alle, "auch im Untermenü hat jede Kachel ein Bild", t.mit + " von " + t.alle + (t.ohne.length ? " — ohne: " + t.ohne.join(", ") : ""));
  await pg.locator("#lcPlatzMenue").screenshot({ path: "/tmp/claude-0/p-660-transport.png" });
  await pg.evaluate(() => { const m = document.getElementById("lcPlatzMenue"); if (m) m.remove(); });

  console.log("\nREISEN AM EIGENEN PLATZ\n");
  await pg.evaluate(() => window.DMA_PRUEFUNG.platzMenue(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]')));
  await pg.waitForTimeout(200);
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Reisen/.test(x.textContent)); if (b) b.click(); });
  await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => { const k = [...document.querySelectorAll("#lcPlatzMenue .lc-anreise-knopf, #lcPlatzMenue .lc-platzmenue-knopf")];
    return { alle: k.length, mit: k.filter((b) => b.querySelector("svg")).length, ohne: k.filter((b) => !b.querySelector("svg")).map((b) => b.title || b.textContent) }; });
  sage(r.alle > 5 && r.mit === r.alle, "Reisen: Flugzeug, Boot, Lok … alle mit Bild", r.mit + " von " + r.alle + (r.ohne.length ? " — ohne: " + r.ohne.join(", ") : ""));
  if (r.alle) await pg.locator("#lcPlatzMenue").screenshot({ path: "/tmp/claude-0/p-660-reisen.png" });

  sage(kf.length === 0, "keine Fehler in der Konsole", kf.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 660: " + fehler + " rot." : "Fassung 660 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close(); process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
