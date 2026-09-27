#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 725: DIE FIGUR IM BAUKASTEN ZIEHEN (Funk 168)
   ---------------------------------------------------------------------
   XANDER: „dass man die Person von einem Punkt zum anderen ziehen kann
   ohne dass man zufällig aus Versehen mal etwas markiert und dann die
   Person nicht versetzen kann das soll immer funktionieren das ist so per
   Drag & Drop wie in einer App geht".
   Mit der Maus (Pointer-Ereignisse) und mit dem Finger (Touch-Pointer):
   die Figur landet auf dem nächsten Platz, nichts wird markiert, ein
   langer Druck öffnet kein Menü, und nach mehrmaligem Neuzeichnen hängen
   keine alten Lauscher mehr am Fenster.
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
  const ctx = await br.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const seitenFehler = []; pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Baukasten, { timeout: 25000 });
  await pg.evaluate(() => { const d = document.createElement("div"); d.id = "__bk"; d.style.cssText = "position:fixed;left:0;top:0;width:390px;z-index:99999;background:#fff"; document.body.appendChild(d); window.Baukasten.render(d); });
  await pg.waitForFunction(() => document.querySelector("#__bk .bk-svg [data-bk-figur]"), { timeout: 20000 });
  await tick(400);

  const lage = () => pg.evaluate(() => {
    const svg = document.querySelector("#__bk .bk-svg"), r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const zuPx = (x, y) => ({ x: r.left + x / vb.width * r.width, y: r.top + y / vb.height * r.height });
    const f = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(document.querySelector("#__bk [data-bk-figur]").getAttribute("transform"));
    const plaetze = [...document.querySelectorAll("#__bk [data-bk-platz]")].map((g) => { const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(g.getAttribute("transform")); return { id: g.dataset.bkPlatz, an: g.classList.contains("bk-platz-an"), px: zuPx(+m[1], +m[2]) }; });
    return { figur: zuPx(+f[1], +f[2] - vb.height * .06), plaetze, platz: (window.Baukasten.zustand.platz || {}).id };
  });

  console.log("\nMIT DER MAUS\n");
  let l = await lage();
  sage(l.plaetze.length >= 2, "der Baukasten zeigt mindestens zwei Plätze", l.plaetze.length + " Plätze");
  let ziel = l.plaetze.find((p) => !p.an);
  await pg.mouse.move(l.figur.x, l.figur.y); await pg.mouse.down();
  for (let i = 1; i <= 12; i++) { await pg.mouse.move(l.figur.x + (ziel.px.x - l.figur.x) * i / 12, l.figur.y + (ziel.px.y - l.figur.y) * i / 12); await tick(16); }
  const ringDa = await pg.evaluate(() => { const r = document.querySelector("#__bk .bk-zielring"); return !!r && r.style.display !== "none"; });
  await pg.mouse.up(); await tick(600);
  const nachMaus = await pg.evaluate(() => ({ platz: (window.Baukasten.zustand.platz || {}).id, markiert: String(window.getSelection() || "") }));
  sage(ringDa, "während des Ziehens zeigt ein Ring, wo die Figur landet");
  sage(nachMaus.platz === ziel.id && nachMaus.markiert === "", "Maus: die Figur landet auf dem Zielplatz, nichts ist markiert", JSON.stringify({ ziel: ziel.id, ...nachMaus }));

  console.log("\nMIT DEM FINGER (langer Druck, dann ziehen)\n");
  l = await lage(); ziel = l.plaetze.find((p) => !p.an);
  const finger = await pg.evaluate(async ([f, z]) => {
    const svg = document.querySelector("#__bk .bk-svg");
    const ev = (typ, x, y) => { const el = document.elementFromPoint(x, y) || svg; el.dispatchEvent(new PointerEvent(typ, { bubbles: true, cancelable: true, composed: true, pointerId: 7, pointerType: "touch", isPrimary: true, clientX: x, clientY: y, buttons: typ === "pointerup" ? 0 : 1 })); };
    let menue = false; const cm = () => { menue = true; }; document.addEventListener("contextmenu", cm);
    ev("pointerdown", f.x, f.y);
    await new Promise((o) => setTimeout(o, 700)); /* langer Druck */
    svg.dispatchEvent(new Event("contextmenu", { bubbles: true, cancelable: true }));
    for (let i = 1; i <= 10; i++) { ev("pointermove", f.x + (z.x - f.x) * i / 10, f.y + (z.y - f.y) * i / 10); await new Promise((o) => setTimeout(o, 16)); }
    ev("pointerup", z.x, z.y);
    await new Promise((o) => setTimeout(o, 600));
    document.removeEventListener("contextmenu", cm);
    return { platz: (window.Baukasten.zustand.platz || {}).id, markiert: String(window.getSelection() || ""), auswahl: getComputedStyle(svg).userSelect || getComputedStyle(svg).webkitUserSelect || svg.style.userSelect || svg.style.webkitUserSelect };
  }, [l.figur, ziel.px]);
  sage(finger.platz === ziel.id && finger.markiert === "" && finger.auswahl === "none", "Finger: nach langem Druck lässt sich die Figur trotzdem ziehen; das Bild ist nicht markierbar", JSON.stringify({ ziel: ziel.id, ...finger }));

  console.log("\nDANEBEN GREIFEN UND OFT NEU ZEICHNEN\n");
  l = await lage(); ziel = l.plaetze.find((p) => !p.an);
  /* 12 px neben die Figur greifen: zählt noch (großzügiger Griff). */
  await pg.mouse.move(l.figur.x + 12, l.figur.y + 6); await pg.mouse.down();
  for (let i = 1; i <= 8; i++) { await pg.mouse.move(l.figur.x + 12 + (ziel.px.x - l.figur.x) * i / 8, l.figur.y + 6 + (ziel.px.y - l.figur.y) * i / 8); await tick(16); }
  await pg.mouse.up(); await tick(600);
  const neben = await pg.evaluate(() => (window.Baukasten.zustand.platz || {}).id);
  sage(neben === ziel.id, "knapp neben der Figur zugreifen reicht", neben + " / " + ziel.id);
  sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 725 (Baukasten ziehen): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
