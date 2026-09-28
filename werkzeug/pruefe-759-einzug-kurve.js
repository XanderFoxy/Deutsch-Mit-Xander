#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 759: EINZUG IN DER KURVE, VON VORN; OPTIMUS PRIME (Walkie 293)
   ---------------------------------------------------------------------
   XANDER: „dieser Dodge Viper oder der Kit … so eine geile Kurve rein
   fährt und dann nach vorne zu sehen ist … mit seinen Lichtern … um die
   Kurve quietscht … man sieht den voll im Bild von vorn … und dann steige
   ich halt aus" und „den Optimus Prime … nach seinem originalen Vorbild".
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
  await tick(600);
  const zeit = async (ab, ms) => { await tick(Math.max(0, ms - (Date.now() - ab))); };
  /* Seit Fassung 812 fährt die Viper als 3D-Modell (werkzeug/pruefe-812-auftritt-autos.js) – hier bleibt KITT. */
  for (const art of ["kitt"]) {
    console.log("\n" + art.toUpperCase() + " KOMMT\n");
    await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
    const D = 5400, ab = Date.now();
    await pg.evaluate((a) => window.DMA_AUFTRITT("ich", a, "rein"), art);
    await zeit(ab, 0.22 * D);
    let R = await pg.evaluate(() => { const w = document.querySelector(".lc-auftritt .lc-auftritt-wagen"); const m = w ? new DOMMatrix(getComputedStyle(w).transform) : null;
      return { winkel: m ? Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI) : null, rauch: document.querySelectorAll(".lc-auftritt-reifenrauch").length }; });
    sage(R.winkel >= 8 && R.winkel <= 30, art + ": in der Kurve steht er schräg (" + R.winkel + "°)", JSON.stringify(R));
    sage(R.rauch >= 1, art + ": Reifenqualm in der Kurve", String(R.rauch));
    if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-" + art + "-kurve.png" });
    await zeit(ab, 0.5 * D);
    R = await pg.evaluate(() => { const f = document.querySelector(".lc-auftritt-front"); if (!f) return null; const r = f.getBoundingClientRect(), cs = getComputedStyle(f);
      const kegel = [...f.querySelectorAll(".lc-front-kegel")].map((k) => +getComputedStyle(k).opacity);
      const w = document.querySelector(".lc-auftritt .lc-auftritt-wagen");
      const b = document.querySelector(".lc-auftritt .lc-auftritt-bild:not(.lc-auftritt-nachbar)").getBoundingClientRect();
      const svg = f.querySelector("svg").getBoundingClientRect(), sx = svg.width / 240;
      return { links: Math.round(r.left), rechts: Math.round(r.right), vw: innerWidth, deck: +cs.opacity, breit: Math.round(r.width), kegel,
        seite: w ? +getComputedStyle(w).opacity : -1, scheibe: [Math.round(svg.left + 120 * sx), Math.round(svg.top + 40 * (svg.height / 150))], bild: [Math.round(b.left + b.width / 2), Math.round(b.top + b.height / 2)], emoji: /\p{Extended_Pictographic}/u.test(f.textContent) }; });
    sage(R && R.deck > 0.9 && R.seite < 0.1, art + ": jetzt von vorn (die Seitenansicht ist weg)", JSON.stringify(R && { deck: R.deck, seite: R.seite }));
    sage(R && R.links >= 0 && R.rechts <= R.vw, art + ": voll im Bild (" + (R && R.links) + "…" + (R && R.rechts) + " von " + (R && R.vw) + " px)", "");
    sage(R && R.kegel.every((o) => o > 0.5), art + ": mit Licht (Scheinwerferkegel an)", JSON.stringify(R && R.kegel));
    sage(R && Math.abs(R.scheibe[0] - R.bild[0]) <= 6 && Math.abs(R.scheibe[1] - R.bild[1]) <= 6, art + ": das Bild sitzt hinter der Frontscheibe", JSON.stringify(R && { scheibe: R.scheibe, bild: R.bild }));
    sage(R && !R.emoji, art + ": gezeichnet, kein Emoji", "");
    if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-" + art + "-vorn.png" });
    await zeit(ab, D + 300);
    R = await pg.evaluate(() => ({ weg: !document.querySelector(".lc-auftritt"), toene: window.DMA_TONLOG.map((t) => t.name) }));
    sage(R.weg && R.toene.indexOf("reifenquietschen") >= 0 && R.toene.indexOf("auftritt-" + art) >= 0, art + ": Motor und Reifenquietschen zu hören, danach aufgeräumt", R.toene.join(","));
  }

  console.log("\nOPTIMUS PRIME\n");
  const O = await pg.evaluate(() => { window.DMA_AUFTRITT("ich", "transformer", "rein");
    const t = document.querySelector(".lc-auftritt-trafo"); const q = (k) => t ? t.querySelectorAll(k).length : 0;
    const r = { kopf: q(".op-kopf"), arme: q(".op-arm"), beine: q(".op-bein"), raeder: q(".op-truck .op-rad"), augen: 0 };
    if (t) { r.augen = [...t.querySelectorAll(".op-kopf path")].filter((p) => /opAuge/.test(p.getAttribute("fill") || "")).length;
      r.tanks = [...t.querySelectorAll(".op-bein rect")].filter((p) => /opChromV/.test(p.getAttribute("fill") || "")).length;
      r.grillStreben = (t.querySelector(".op-robot").innerHTML.match(/M\d+ 116 V134/g) || []).length;
      r.rohre = [...t.querySelectorAll(".op-truck rect")].filter((p) => +p.getAttribute("height") > 80).length; }
    return r; });
  sage(O.kopf === 1 && O.arme === 2 && O.beine === 2 && O.raeder === 3, "Optimus: Kopf, zwei Arme, zwei Beine, drei Truck-Räder (für die Verwandlung)", JSON.stringify(O));
  sage(O.augen === 2 && O.tanks === 2 && O.grillStreben >= 8 && O.rohre === 2, "Optimus nach G1: leuchtende Augen, Tanks an den Beinen, Grill-Bauch, zwei Auspuffrohre am Truck", JSON.stringify(O));
  await tick(6800);
  sage(kf.length === 0, "keine Fehler in der Konsole", kf.join(" | "));
  console.log("\nFassung 759 (Einzug in der Kurve, Optimus Prime): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
