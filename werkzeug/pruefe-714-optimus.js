#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 714: OPTIMUS PRIME SETZT DAS BILD AB UND GEHT
   ---------------------------------------------------------------------
   XANDER (Funk 158, wörtlich): „er soll praktisch nicht mein Bild dahin
   setzen mit seinen Händen oder irgendwas und dann als Transformer
   weiteren und nicht als Auto weiterfahren vielleicht kannst du da den
   originalen Optimus Prime nehmen" (das „nicht" gelesen als „noch",
   siehe SPIELSYSTEM.md, Fassung 714). Die Sonde misst zu festen Zeitpunkten: Truck sichtbar, dann
   Roboter; das Bild zwischen den Händen; das Bild auf dem Platz; der
   Roboter (nicht der Truck) geht davon, die Beine wechseln; Schritte
   hörbar. Bildschirmfotos nach /tmp/claude-0/p-714-*.png.
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
  const D = 6400;
  const messen = () => pg.evaluate(() => {
    const t = document.querySelector(".lc-auftritt-trafo"), b = document.querySelector(".lc-auftritt .lc-auftritt-bild"),
      k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis');
    if (!t || !b || !k) return null;
    const op = (sel) => { const e = t.querySelector(sel); return e ? +getComputedStyle(e).opacity : -1; };
    const box = (sel) => { const e = t.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
    const rb = b.getBoundingClientRect(), rk = k.getBoundingClientRect(), rt = t.getBoundingClientRect();
    const hL = box(".op-arm-l rect:last-of-type"), hR = box(".op-arm-r rect:last-of-type");
    const bl = t.querySelector(".op-bein-l"), br = t.querySelector(".op-bein-r");
    return { truck: op(".op-truck"), robo: op(".op-robot"),
      bild: { dx: Math.round(rb.left + rb.width / 2 - rk.left - rk.width / 2), dy: Math.round(rb.top + rb.height / 2 - rk.top - rk.height / 2), gr: +(rb.width / rk.width).toFixed(2) },
      bildMitte: [Math.round(rb.left + rb.width / 2), Math.round(rb.top + rb.height / 2)], haende: [hL, hR],
      trafoX: Math.round(rt.left - rk.left),
      beine: [bl ? getComputedStyle(bl).transform : "", br ? getComputedStyle(br).transform : ""] };
  });
  const lauf = async (r, zeiten) => {
    await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
    const los = await pg.evaluate((r) => window.DMA_AUFTRITT("ich", "transformer", r), r);
    const start = Date.now(), aus = {};
    for (const f of zeiten) {
      await tick(Math.max(0, Math.round(f * D) - (Date.now() - start)));
      aus[f] = await messen();
      await pg.screenshot({ path: "/tmp/claude-0/p-714-" + r + "-" + Math.round(f * 100) + ".png" });
    }
    await tick(Math.max(0, D + 300 - (Date.now() - start)));
    const ende = await pg.evaluate(() => ({ buehne: Boolean(document.querySelector(".lc-auftritt")), toene: window.DMA_TONLOG.map((x) => x.name) }));
    return { los, aus, ende };
  };

  console.log("\nKOMMEN\n");
  const R = await lauf("rein", [0.12, 0.28, 0.46, 0.52, 0.63, 0.78, 0.92]);
  const a = R.aus;
  sage(R.los === true, "der Auftritt startet");
  sage(a[0.12] && a[0.12].truck > 0.9 && a[0.12].robo < 0.1, "erst kommt der Truck (Roboter unsichtbar)", JSON.stringify(a[0.12] && [a[0.12].truck, a[0.12].robo]));
  sage(a[0.46] && a[0.46].robo > 0.9 && a[0.46].truck < 0.1, "dann steht Optimus Prime da (Truck weg)", JSON.stringify(a[0.46] && [a[0.46].truck, a[0.46].robo]));
  const h = a[0.46] && a[0.46].haende, m = a[0.46] && a[0.46].bildMitte;
  const zwischen = h && h[0] && h[1] && m && m[0] > h[0][0] && m[0] < h[1][0] + h[1][2] && Math.abs(m[1] - (h[0][1] + h[1][1]) / 2) < 40;
  sage(zwischen, "das Bild liegt zwischen seinen Händen", JSON.stringify({ haende: h, bild: m }));
  sage(a[0.63] && Math.abs(a[0.63].bild.dx) <= 3 && Math.abs(a[0.63].bild.dy) <= 3 && Math.abs(a[0.63].bild.gr - 1) < 0.06, "er hat das Bild auf den Platz gesetzt", JSON.stringify(a[0.63] && a[0.63].bild));
  sage(a[0.92] && a[0.92].robo > 0.9 && a[0.92].truck < 0.1 && a[0.92].trafoX > a[0.63].trafoX + 30, "er GEHT als Roboter davon (nicht als Auto)", JSON.stringify(a[0.92] && [a[0.92].robo, a[0.92].truck, a[0.63].trafoX, a[0.92].trafoX]));
  sage(a[0.78] && a[0.92] && (a[0.78].beine[0] !== a[0.92].beine[0] || a[0.78].beine[1] !== a[0.92].beine[1]), "die Beine machen Schritte", JSON.stringify(a[0.78] && a[0.78].beine));
  sage(a[0.92] && Math.abs(a[0.92].bild.dx) <= 3 && Math.abs(a[0.92].bild.dy) <= 3, "das Bild bleibt auf dem Platz, während er geht");
  const toene = R.ende.toene;
  sage(toene.indexOf("auftritt-trafo") >= 0 && toene.filter((x) => x === "schritt").length >= 4 && toene.indexOf("aufsetzen") >= 0, "Verwandlung, Absetzen und Schritte sind zu hören", toene.join(","));
  sage(!R.ende.buehne, "danach aufgeräumt");

  console.log("\nGEHEN\n");
  const G = await lauf("raus", [0.15, 0.45, 0.7, 0.9]);
  sage(G.aus[0.15] && G.aus[0.15].robo > 0.9, "beim Gehen kommt erst der Roboter zu Fuß", JSON.stringify(G.aus[0.15] && [G.aus[0.15].robo, G.aus[0.15].truck]));
  sage(G.aus[0.7] && G.aus[0.7].truck > 0.9, "dann wird er wieder zum Truck", JSON.stringify(G.aus[0.7] && [G.aus[0.7].robo, G.aus[0.7].truck]));
  sage(G.aus[0.9] && (Math.abs(G.aus[0.9].bild.dx) > 40 || G.aus[0.9].bild.gr < 0.7), "und fährt mit dem Bild davon", JSON.stringify(G.aus[0.9] && G.aus[0.9].bild));
  sage(!G.ende.buehne, "danach aufgeräumt");

  sage(kf.length === 0, "keine Fehler in der Konsole", kf.join(" | "));
  console.log("\n" + (fehler ? "Fassung 714: " + fehler + " rot." : "Fassung 714 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
