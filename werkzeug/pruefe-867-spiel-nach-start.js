#!/usr/bin/env node
/* =====================================================================
   SONDE 867 — DAS SPIEL KOMMT NACH DEM START (FASSUNG 849)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   spiel.js (280 KB gepackt) stand in der Startliste und teilte sich beim
   ersten Laden die Leitung mit app.js. Jetzt holt index.html es erst nach
   DOMContentLoaded.
   Geprüft:
     1. spiel.js steht nicht in der Startliste und wird erst angefragt,
        wenn alle Startskripte gelaufen sind (app.js vorher fertig).
     2. Danach ist window.DMA_SPIEL da (wie vorher).
     3. Spiel-Nachrichten, die vor spiel.js ankommen, gehen nicht verloren:
        der Stand wird übernommen; ein alter Schuss wird nicht nachgespielt.
     4. Das Angebot „Als App" (beforeinstallprompt) vor spiel.js wird
        übernommen.
     5. Keine Fehler in der Konsole.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  const startliste = (html.match(/var dateien = \[[\s\S]*?\];/) || [""])[0];
  console.log("\n1) Startliste und Reihenfolge\n");
  sage(startliste.length > 100 && !/"spiel\.js"/.test(startliste), "spiel.js steht nicht in der Startliste");

  /* spiel.js wird vom Server zurückgehalten, bis die Prüfung es freigibt – so lassen sich
     Nachrichten „vor spiel.js" sicher einspielen. */
  let freigeben, anfrageUm = 0;
  const frei = new Promise((r) => { freigeben = r; });
  const srv = http.createServer(async (q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (/(^|\/)spiel\.js$/.test(p)) { anfrageUm = Date.now(); await frei; }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await (await br.newContext({ viewport: { width: 393, height: 800 } })).newPage();
  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(m.text()) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + m.text().slice(0, 160));
  });
  await pg.addInitScript(() => {
    try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
    window.__dcl = 0;
    document.addEventListener("DOMContentLoaded", () => { window.__dcl = performance.now(); });
  });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefEmpfangen && window.DMA_SPIEL_BRUECKE, null, { timeout: 30000 });
  for (let i = 0; i < 50 && !anfrageUm; i++) await new Promise((r) => setTimeout(r, 100));
  const vorher = await pg.evaluate(() => ({ spiel: Boolean(window.DMA_SPIEL), dcl: window.__dcl,
    tags: [...document.scripts].filter((s) => /spiel\.js/.test(s.src)).map((s) => ({ defer: s.defer, async: s.async })) }));
  sage(anfrageUm > 0 && vorher.dcl > 0, "spiel.js wird nach DOMContentLoaded angefragt", "DOMContentLoaded bei " + Math.round(vorher.dcl) + " ms");
  sage(vorher.tags.length === 1 && !vorher.tags[0].defer, "genau ein spiel.js, nachträglich eingehängt", JSON.stringify(vorher.tags));
  sage(!vorher.spiel, "solange es unterwegs ist, gibt es noch kein DMA_SPIEL");

  console.log("\n3)–4) Was vor spiel.js ankommt\n");
  await pg.evaluate(() => {
    const L = window.LiveChat;
    L.pruefEmpfangen({ art: "spiel", ereignis: "stand", von: "fremd1", gid: "g-alt-1", stand: { id: "spieler-alt", name: "Bea", level: 7, mitspielen: true } });
    L.pruefEmpfangen({ art: "spiel", ereignis: "schuss", von: "fremd1", gid: "g-alt-2", zielChat: "x", waffe: "tomate", dx: 0, dy: 0, stand: { id: "spieler-schuss", name: "Cem", level: 3 } });
    /* Der Schuss ist „alt": sein Zeitstempel im Puffer wird zurückgedreht. */
    const w = window.DMA_SPIEL_WARTET || [];
    w.forEach((x) => { if (x.n.ereignis === "schuss") x.um -= 10000; });
    L.pruefEmpfangen({ art: "spiel", ereignis: "stand", von: "fremd2", gid: "g-neu-1", stand: { id: "spieler-neu", name: "Dana", level: 2 } });
    const e = new Event("beforeinstallprompt"); e.prompt = () => {}; window.dispatchEvent(e);
  });
  const puffer = await pg.evaluate(() => (window.DMA_SPIEL_WARTET || []).map((w) => w.n.ereignis).join(","));
  sage(puffer === "stand,schuss,stand", "livechat.js hebt die drei Nachrichten auf", puffer);
  freigeben();
  await pg.waitForFunction(() => window.DMA_SPIEL && window.DMA_SPIEL.pruef, null, { timeout: 30000 });
  const nachher = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand();
    return { alt: S.stand["spieler-alt"] && S.stand["spieler-alt"].name, schuss: S.stand["spieler-schuss"] && S.stand["spieler-schuss"].name,
      neu: S.stand["spieler-neu"] && S.stand["spieler-neu"].name, puffer: window.DMA_SPIEL_WARTET,
      fliegt: document.querySelectorAll(".sp-geschoss, .sp-schuss").length, app: Boolean(window.DMA_APP_ANGEBOT) };
  });
  sage(nachher.alt === "Bea" && nachher.neu === "Dana", "die Stände sind übernommen", nachher.alt + ", " + nachher.neu);
  sage(nachher.schuss === "Cem", "auch der Stand aus der alten Schuss-Nachricht", String(nachher.schuss));
  sage(nachher.fliegt === 0, "der alte Schuss wird nicht nachgespielt", nachher.fliegt + " Geschosse");
  sage(nachher.puffer === null, "der Puffer ist geleert und geschlossen");
  sage(nachher.app, "das Angebot „Als App“ ist aufgefangen");
  const quelle = fs.readFileSync(path.join(WURZEL, "spiel.js"), "utf8");
  sage(/var APP = \{ angebot: window\.DMA_APP_ANGEBOT \|\| null \};/.test(quelle), "spiel.js übernimmt es beim Laden");

  console.log("\n5) Danach\n");
  const neu = await pg.evaluate(() => {
    const vor = Object.keys(window.DMA_SPIEL.pruef.zustand().stand).length;
    window.LiveChat.pruefEmpfangen({ art: "spiel", ereignis: "stand", von: "fremd3", gid: "g-spaet", stand: { id: "spieler-spaet", name: "Emmi" } });
    return { direkt: Boolean(window.DMA_SPIEL.pruef.zustand().stand["spieler-spaet"]), puffer: window.DMA_SPIEL_WARTET };
  });
  sage(neu.direkt && neu.puffer === null, "spätere Nachrichten gehen direkt ans Spiel");
  await pg.waitForTimeout(800);
  sage(konsole.length === 0, "keine Fehler in der Konsole", konsole.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
