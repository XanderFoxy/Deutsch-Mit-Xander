#!/usr/bin/env node
/* =====================================================================
   SONDE 869 — DIE NEUE BÄCKEREI (FASSUNG 851)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „wie sieht es in der Bäckerei richtig aus …
   recherchiere bis ins kleinste Detail … dass man auch wenn jemand auf
   dem Stuhl sitzt den Stuhl noch anwählen kann … sie sollen richtig
   klickbar sein … mit der Lupen Funktion … zu erforschen sein".
   Geprüft (Telefon 360 × 740):
     1. Bau-Prüfung: jedes Ding und jedes Lupen-Ding ist gut antippbar
        (werkzeug/bilderwelt/pruefe-szene.js).
     2. NEUE Bilderwelt: die Bäckerei kommt aus bilderwelt-neu/, hat 22
        Dinge, Glas und Licht liegen vorne, ohne Tipps abzufangen.
     3. Antippen der Verkäuferin zeigt ihr Wort; die Lupe an der Vitrine
        geht näher heran, und dort lässt sich die Torte einzeln antippen.
     4. ALTE Bilderwelt (Standard): die alte Bäckerei, unverändert.
     5. Keine Seitenfehler.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), cp = require("child_process");
const WURZEL = path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log("\n1 · BAU-PRÜFUNG\n");
  let bau = "";
  try { bau = cp.execSync("node " + path.join(__dirname, "bilderwelt/pruefe-szene.js") + " " + path.join(WURZEL, "bilderwelt-neu/szenen/baeckerei.js")).toString(); }
  catch (e) { bau = String(e.stdout || e.message); }
  const zeilen = bau.split("\n").filter((z) => /Treffer/.test(z));
  sage(/alle Teile gut erreichbar/.test(bau), "jedes Ding ist gut antippbar", zeilen.length + " Dinge geprüft" + (/FEHL/.test(bau) ? ": " + zeilen.filter((z) => /FEHL/.test(z)).join(" | ") : ""));

  const anfragen = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    anfragen.push(p);
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const basis = "http://127.0.0.1:" + srv.address().port + "/";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const seitenFehler = [];
  const neueSeite = async (adresse) => {
    const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); localStorage.removeItem("dma_bilderwelt"); } catch (e) {} });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e).split("\n")[0]));
    await pg.goto(basis + adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEF && document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'), null, { timeout: 120000 });
    await pg.evaluate(() => {
      document.querySelector('.tape-tab[data-target="view-learn"]').click();
      const b = document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'); b.style.display = ""; b.click();
    });
    await pg.waitForFunction(() => document.querySelector('#bilderweltArea [data-bw-szene="baeckerei"]'), null, { timeout: 60000 });
    await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-szene="baeckerei"]').click());
    await pg.waitForFunction(() => document.querySelector("#bilderweltArea svg.bw-szene-baeckerei [data-bw-teil]"), null, { timeout: 60000 });
    await tick(500);
    return { ctx, pg };
  };

  console.log("\n2 · NEUE BILDERWELT\n");
  anfragen.length = 0;
  const n = await neueSeite("index.html?bilderwelt=neu");
  const r2 = await n.pg.evaluate(() => {
    const s = document.querySelector("#bilderweltArea svg.bw-szene-baeckerei");
    const v = s.querySelector(".bw-vorne");
    return { teile: s.querySelectorAll(":scope > g > [data-bw-teil]").length, vorne: !!v, pe: v && v.getAttribute("pointer-events"),
      quer: document.documentElement.scrollWidth - window.innerWidth };
  });
  sage(anfragen.some((p) => /bilderwelt-neu\/szenen\/baeckerei\.js$/.test(p)), "die Bäckerei kommt aus bilderwelt-neu/szenen/");
  sage(r2.teile === 22, "22 Dinge im Bild", r2.teile + "");
  sage(r2.vorne && r2.pe === "none", "Glas und Licht liegen vorne und fangen keinen Tipp ab");
  sage(r2.quer <= 0, "kein Querscrollen");
  if (BILD) await n.pg.screenshot({ path: BILD + "-neu.png" });

  console.log("\n3 · ANTIPPEN UND LUPE\n");
  const tippe = async (pg, sel) => {
    const b = await pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    if (b) await pg.mouse.click(b.x, b.y);
    await tick(400);
    return !!b;
  };
  /* Die Verkäuferin: auf ihr Gesicht tippen (oberes Viertel ihrer Fläche) */
  const vk = await n.pg.evaluate(() => { const e = document.querySelector('#bilderweltArea [data-bw-teil="verkaeuferin"]'); e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.15 }; });
  await n.pg.mouse.click(vk.x, vk.y); await tick(500);
  const w1 = await n.pg.evaluate(() => (document.querySelector("#bilderweltArea .bw-teil-aktiv") || {}).getAttribute ? document.querySelector("#bilderweltArea .bw-teil-aktiv").getAttribute("data-bw-teil") : (document.getElementById("bilderweltArea").innerText.match(/die Verkäuferin/) || [""])[0]);
  sage(/verkaeuferin|die Verkäuferin/.test(w1), "Tipp auf die Verkäuferin wählt die Verkäuferin", w1);
  const lupe = await tippe(n.pg, '#bilderweltArea [data-bw-zoom="vitrine"]');
  await tick(600);
  const r3 = await n.pg.evaluate(() => ({ zoom: !!document.querySelector("#bilderweltArea svg.bw-bild-zoom"), unter: document.querySelectorAll("#bilderweltArea .bw-teil-unter").length }));
  sage(lupe && r3.zoom && r3.unter === 7, "die Lupe an der Vitrine geht näher heran: 7 Kuchen und Teilchen einzeln", JSON.stringify(r3));
  if (BILD) await n.pg.screenshot({ path: BILD + "-lupe.png" });
  const t = await n.pg.evaluate(() => { const e = document.querySelector('#bilderweltArea [data-bw-teil="torte"]'); const r = e.getBoundingClientRect(); return { x: r.left + r.width * 0.4, y: r.top + r.height * 0.6 }; });
  await n.pg.mouse.click(t.x, t.y); await tick(500);
  const w2 = await n.pg.evaluate(() => { const a = document.querySelector("#bilderweltArea .bw-teil-aktiv"); return a ? a.getAttribute("data-bw-teil") : ""; });
  sage(w2 === "torte", "in der Lupe lässt sich die Torte antippen", w2);
  await n.ctx.close();

  console.log("\n4 · ALTE BILDERWELT\n");
  anfragen.length = 0;
  const a = await neueSeite("index.html");
  const r4 = await a.pg.evaluate(() => ({ teile: document.querySelectorAll("#bilderweltArea svg.bw-szene-baeckerei [data-bw-teil]").length, vorne: !!document.querySelector("#bilderweltArea .bw-vorne") }));
  sage(r4.teile === 9 && !r4.vorne && !anfragen.some((p) => /bilderwelt-neu\//.test(p)), "Standard: die alte Bäckerei (9 Dinge), nichts aus bilderwelt-neu/", r4.teile + " Dinge");
  await a.ctx.close();

  const echte = seitenFehler.filter((e) => !/Failed to fetch|NetworkError|supabase|Load failed|ERR_/i.test(e));
  sage(!echte.length, "keine Seitenfehler", echte.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
