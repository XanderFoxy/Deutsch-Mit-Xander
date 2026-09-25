#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 636: KEIN ITALIENISCH IM DEUTSCHKURS
   ---------------------------------------------------------------------
   XANDER (25.09.): „diese italienischen Sachen dürfen auch nicht mehr
   auftauchen".
   Prüfbericht 25.09.: Im Satzbaukasten („Beispiele lesen") stand unter
   jedem deutschen Satz auch im Deutsch-Raum die italienische
   Übersetzung. Geprüft: im Deutsch-Raum keine, im Italienisch-Raum
   weiterhin eine je Satz.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Satzbau && document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]'), { timeout: 25000 });
  const zaehle = (ziel) => pg.evaluate(async (ziel) => {
    const area = document.getElementById(ziel);
    if (!area) return { da: false };
    let knopf = ziel === "satzbaukastenDeArea" ? document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]') : null;
    if (knopf) knopf.click();
    await new Promise((r) => setTimeout(r, 300));
    const b = area.querySelector('[data-sbk-ansicht="beispiele"]'); if (b) b.click();
    await new Promise((r) => setTimeout(r, 300));
    return { da: true, saetze: area.querySelectorAll(".beispiel-satz").length, it: area.querySelectorAll(".beispiel-it").length };
  }, ziel);
  console.log("\nSATZBAUKASTEN, BEISPIELE LESEN\n");
  const de = await zaehle("satzbaukastenDeArea");
  sage(de.saetze > 0, "im Deutsch-Raum stehen Beispielsätze", de.saetze + " Sätze");
  sage(de.it === 0, "… ohne italienische Übersetzung", de.it + " italienische Zeilen");
  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nKein Italienisch im Deutsch-Satzbaukasten.\n");
  process.exit(fehler ? 1 : 0);
})();
