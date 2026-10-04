#!/usr/bin/env node
/* =====================================================================
   SONDE 878 — DER WEG ÜBER DIE ÜBERSICHTSKARTEN (Fassung 877/878)
   ---------------------------------------------------------------------
   XANDER (Funk 291): „die Sehenswürdigkeiten Städte und Länder … mit
   größte Sorgfalt und Präzision auf höchstem Niveau".
   Geprüft wird mit ECHTEN Mausklicks auf die Mitte der Lupenmarke (nicht
   mit dispatchEvent), denn der Fehler war, dass ein Fangrechteck über der
   Marke lag und der Tipp nur die Wortkarte öffnete (Karten-Kritik A1):
     1  Weltkarte: direkte Marke (Rio) führt in die Szene, Zurück auf die Karte
     2  Weltkarte → Lupe Europa → Marke Deutschland → Deutschlandkarte
     3  Deutschlandkarte → Lupe Süden → Marke München → München
     4  Zurück landet in der Süden-Lupe, noch einmal Zurück in der Europa-Lupe
     5  „Alle Szenen" löscht die Lupe: die Weltkarte öffnet wieder ganz
     6  über jeder Marke liegt ein Kreis im Marken-Dach, Mitte trifft ihn
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const basis = "http://127.0.0.1:" + srv.address().port + "/";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 390, height: 800 }, hasTouch: false });
  await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); localStorage.removeItem("dma_bilderwelt"); } catch (e) {} });
  const pg = await ctx.newPage();
  const seitenfehler = [];
  pg.on("pageerror", (e) => seitenfehler.push(String(e.message || e).split("\n")[0]));
  await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await pg.goto(basis + "index.html?bilderwelt=neu", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'), null, { timeout: 120000 });
  await pg.evaluate(() => {
    document.querySelector('.tape-tab[data-target="view-learn"]').click();
    const b = document.querySelector('#learnSubnav [data-sub="sub-bilderwelt"]'); b.style.display = ""; b.click();
  });
  await pg.waitForFunction(() => document.querySelector("#bilderweltArea [data-bw-szene]"), null, { timeout: 60000 });

  const szene = (id, zoom) => pg.waitForFunction(([id, zoom]) => {
    const s = document.querySelector("#bilderweltArea svg.bw-szene-" + id);
    return !!(s && s.querySelector("[data-bw-teil]") && (zoom === null || s.classList.contains("bw-bild-zoom") === zoom));
  }, [id, zoom], { timeout: 15000 }).then(() => true, () => false);
  /* echter Klick auf die Mitte des Kreises im Marken-Dach */
  const markeTippen = async (ziel) => {
    const kreis = pg.locator('#bilderweltArea .bw-marken-dach circle[data-bw-lupe-sofort="' + ziel + '"]').first();
    if (!(await kreis.count())) return "kein Kreis";
    await kreis.scrollIntoViewIfNeeded();
    const b = await kreis.boundingBox();
    if (!b) return "unsichtbar";
    const oben = await pg.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e && e.getAttribute && e.getAttribute("data-bw-lupe-sofort"); }, [b.x + b.width / 2, b.y + b.height / 2]);
    await pg.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    return oben === ziel ? "" : "Mitte trifft " + oben;
  };
  const zurueck = () => pg.click("#bwZurueck");

  console.log("\n1 · WELTKARTE: DIREKTE MARKE\n");
  await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-szene="weltkarte"]').click());
  sage(await szene("weltkarte", false), "die Weltkarte öffnet sich ganz");
  let r = await markeTippen("rio");
  sage(!r && (await szene("rio", null)), "Marke Rio → Rio", r);
  await zurueck();
  sage(await szene("weltkarte", false), "Zurück → Weltkarte");

  console.log("\n2–3 · WELTKARTE → EUROPA → DEUTSCHLAND → SÜDEN → MÜNCHEN\n");
  await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-zoom="europa"]').dispatchEvent(new MouseEvent("click", { bubbles: true })));
  sage(await szene("weltkarte", true), "Lupe Europa öffnet sich");
  r = await markeTippen("deutschlandkarte");
  sage(!r && (await szene("deutschlandkarte", false)), "Marke Deutschland → Deutschlandkarte (1 Tipp)", r);
  await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-zoom="sueden"]').dispatchEvent(new MouseEvent("click", { bubbles: true })));
  sage(await szene("deutschlandkarte", true), "Lupe Süden öffnet sich");
  r = await markeTippen("muenchen");
  sage(!r && (await szene("muenchen", null)), "Marke München → München (Region → Stadt in 2 Tipps)", r);

  console.log("\n4 · ZURÜCK LANDET IN DER LUPE\n");
  await zurueck();
  sage(await szene("deutschlandkarte", true), "Zurück → Deutschlandkarte, Süden-Lupe");
  await zurueck();
  sage(await szene("weltkarte", true), "Zurück → Weltkarte, Europa-Lupe");

  console.log("\n5 · ALLE SZENEN LÖSCHT DIE LUPE\n");
  await zurueck();
  await pg.waitForFunction(() => document.querySelector('#bilderweltArea [data-bw-szene="weltkarte"]'), null, { timeout: 15000 });
  await pg.evaluate(() => document.querySelector('#bilderweltArea [data-bw-szene="weltkarte"]').click());
  sage(await szene("weltkarte", false), "die Weltkarte öffnet wieder ganz");

  console.log("\n6 · JEDE MARKE HAT IHREN KREIS OBEN\n");
  const kreise = await pg.evaluate(() => {
    const aus = [];
    document.querySelectorAll("#bilderweltArea .bw-marken-dach circle").forEach((c) => {
      const b = c.getBoundingClientRect();
      if (b.bottom < 0 || b.top > innerHeight) return;
      const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      aus.push([c.dataset.bwLupeSofort, e === c]);
    });
    return { sichtbar: aus.length, marken: document.querySelectorAll("#bilderweltArea .bw-lupenmarke[data-bw-lupe-sofort]").length, schlecht: aus.filter((a) => !a[1]).map((a) => a[0]) };
  });
  sage(kreise.marken === 11, "11 direkte Marken auf der Weltkarte", String(kreise.marken));
  sage(!kreise.schlecht.length, "die Mitte jeder sichtbaren Marke trifft ihren Kreis", kreise.sichtbar + " geprüft; " + kreise.schlecht.join(", "));
  sage(!seitenfehler.length, "keine Seitenfehler", seitenfehler.slice(0, 3).join(" | "));

  await br.close(); srv.close();
  console.log("\nFassung 878 (Sonde 878): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
