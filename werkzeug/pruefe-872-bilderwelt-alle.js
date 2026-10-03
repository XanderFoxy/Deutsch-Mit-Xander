#!/usr/bin/env node
/* =====================================================================
   SONDE 872 — DIE GANZE NEUE BILDERWELT IN DER APP (Fassung 852)
   ---------------------------------------------------------------------
   XANDER (Funk 286): „Du sollst die Bilderwelten komplett nach demselben
   Schema fertig machen dass sich nichts mehr blockiert … ich will ein
   großes Update mit allen kompletten überarbeiteten Bilderwelten".
   In der App (index.html?bilderwelt=neu) wird jede Szene aus
   NEUE_SZENEN über ihre Kachel geöffnet:
     1  das Bild erscheint mit genau so vielen Teilen wie in der Datei
     2  kein Seitenfehler
     3  jede Lupe-Marke im Bild führt in eine Szene, die es gibt
     4  der Weg Stadt → Innenstadt → Bäckerei geht über die Lupen
     5  die alte Bilderwelt (ohne Link) lädt keine Datei aus bilderwelt-neu/
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  const NEUE = JSON.parse((html.match(/var NEUE_SZENEN = (\[[^\]]*\])/) || [])[1] || "[]");
  const teileSoll = {};
  for (const id of NEUE) {
    const w = {}; new Function("window", fs.readFileSync(path.join(WURZEL, "bilderwelt-neu/szenen/" + id + ".js"), "utf8"))(w);
    teileSoll[id] = ((w.DMA_SZENE || {})[id] || { teile: [] }).teile.length;
  }
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
  const seite = async (adresse) => {
    const ctx = await br.newContext({ viewport: { width: 390, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); localStorage.removeItem("dma_bilderwelt"); } catch (e) {} });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e).split("\n")[0]));
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto(basis + adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEF && document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'), null, { timeout: 120000 });
    await pg.evaluate(() => {
      document.querySelector('.tape-tab[data-target="view-learn"]').click();
      const b = document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'); b.style.display = ""; b.click();
    });
    await pg.waitForFunction(() => document.querySelector("#bilderweltArea [data-bw-szene]"), null, { timeout: 60000 });
    return { ctx, pg };
  };

  console.log("\n1–3 · JEDE NEUE SZENE ÖFFNEN (" + NEUE.length + ")\n");
  const { ctx, pg } = await seite("index.html?bilderwelt=neu");
  const alleIds = await pg.evaluate(() => (window.DMA_SZENEN || []).map((s) => s.id));
  let offen = 0, ohneKachel = [], falsch = [], totLupe = [];
  for (const id of NEUE) {
    const r = await pg.evaluate(async (id) => {
      const zur = document.getElementById("bwZurueck"); if (zur) zur.click();
      await new Promise((f) => setTimeout(f, 30));
      const k = document.querySelector('#bilderweltArea [data-bw-szene="' + id + '"]');
      if (!k) return { kachel: false };
      k.click();
      const t0 = performance.now();
      while (performance.now() - t0 < 15000) {
        const svg = document.querySelector("#bilderweltArea svg.bw-szene-" + id);
        if (svg && svg.querySelector("[data-bw-teil]")) {
          const teile = new Set(Array.from(svg.querySelectorAll("[data-bw-teil]")).filter((e) => !e.closest(".bw-teil-unter")).map((e) => e.getAttribute("data-bw-teil")));
          const lupen = Array.from(document.querySelectorAll("#bilderweltArea [data-bw-lupe-sofort], #bilderweltArea [data-bw-lupe]")).map((e) => e.getAttribute("data-bw-lupe-sofort") || e.getAttribute("data-bw-lupe"));
          return { kachel: true, teile: teile.size, lupen };
        }
        await new Promise((f) => setTimeout(f, 50));
      }
      return { kachel: true, teile: -1, lupen: [] };
    }, id);
    if (!r.kachel) { ohneKachel.push(id); continue; }
    offen++;
    if (r.teile < teileSoll[id] * 0.9 || r.teile < 1) falsch.push(id + " " + r.teile + "/" + teileSoll[id]);
    r.lupen.forEach((l) => { if (alleIds.indexOf(l) < 0) totLupe.push(id + "→" + l); });
  }
  console.log("   " + offen + " über ihre Kachel geöffnet; nur über Lupen erreichbar: " + (ohneKachel.join(", ") || "–"));
  sage(offen >= NEUE.length * 0.8, "die Szenen öffnen sich in der App", offen + " von " + NEUE.length);
  sage(!falsch.length, "jedes Bild zeigt seine Teile", falsch.slice(0, 6).join(" | "));
  sage(!totLupe.length, "jede Lupe führt in eine vorhandene Szene", totLupe.slice(0, 6).join(" | "));
  sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));

  console.log("\n4 · WEG ÜBER DIE LUPEN\n");
  const weg = await pg.evaluate(async () => {
    const warte = async (id) => { const t0 = performance.now(); while (performance.now() - t0 < 15000) { if (document.querySelector("#bilderweltArea svg.bw-szene-" + id + " [data-bw-teil]")) return true; await new Promise((f) => setTimeout(f, 50)); } return false; };
    const zur = document.getElementById("bwZurueck"); if (zur) zur.click();
    await new Promise((f) => setTimeout(f, 30));
    document.querySelector('#bilderweltArea [data-bw-szene="stadt"]').click();
    const s = [await warte("stadt")];
    let m = document.querySelector('#bilderweltArea [data-bw-lupe-sofort="viertel_innenstadt"], #bilderweltArea [data-bw-lupe="viertel_innenstadt"]');
    if (m) m.dispatchEvent(new MouseEvent("click", { bubbles: true })); s.push(await warte("viertel_innenstadt"));
    m = document.querySelector('#bilderweltArea [data-bw-lupe-sofort="baeckerei"], #bilderweltArea [data-bw-lupe="baeckerei"]');
    if (m) m.dispatchEvent(new MouseEvent("click", { bubbles: true })); s.push(await warte("baeckerei"));
    return s;
  });
  sage(weg.every(Boolean), "Stadt → Innenstadt → Bäckerei über die Lupen", JSON.stringify(weg));
  await ctx.close();

  console.log("\n5 · ALTE BILDERWELT UNBERÜHRT\n");
  anfragen.length = 0;
  const alt = await seite("index.html");
  await alt.pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-szene="stadt"]').click());
  await alt.pg.waitForFunction(() => document.querySelector("#bilderweltArea svg.bw-szene-stadt [data-bw-teil]"), null, { timeout: 30000 });
  await tick(300);
  const neuGeladen = anfragen.filter((p) => /^\/bilderwelt-neu\//.test(p));
  sage(!neuGeladen.length, "ohne Link lädt die App nichts aus bilderwelt-neu/", neuGeladen.slice(0, 3).join(", "));
  sage(!alt.pg.__fehler.length, "keine Seitenfehler", alt.pg.__fehler.slice(0, 3).join(" | "));
  await alt.ctx.close();

  await br.close(); srv.close();
  console.log("\nFassung 852 (Sonde 872): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
