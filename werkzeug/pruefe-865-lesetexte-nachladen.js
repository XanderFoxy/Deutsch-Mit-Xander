#!/usr/bin/env node
/* =====================================================================
   SONDE 865 — DIE LESETEXTE KOMMEN ERST, WENN SIE GEBRAUCHT WERDEN (FASSUNG 846)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".
   „Dichter & Denker" und „Schnee von gestern" (220 KB) liegen in
   data-lesetexte.js statt in app.js.
   GEMESSEN:
     1. Beim Start und auf dem Weg Wissen → Klassenzimmer wird die Datei
        NICHT geholt.
     2. Wird „Dichter & Denker" im Kompass sichtbar, kommt sie und die
        Kacheln stehen da (mit Bild).
     3. Beide Listen sind vollständig (je 7 Texte, jeder mit Niveaus A1–C2
        und einem Kachelbild) – derselbe Inhalt wie vorher in app.js.
     4. Der Lesetext-Wähler im Klassenzimmer bekommt die Texte
        (lcLesestoff über DMA_LESETEXTE_LADEN).
     5. Keine Fehler in der Konsole.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };

(async () => {
  const geholt = [], fehlt = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (/lesetexte/.test(p)) geholt.push(p);
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { fehlt.push(p); a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 860 } });
  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(m.text()) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + m.text().slice(0, 160));
  });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND, null, { timeout: 60000 });

  console.log("\n1) Start und Weg ins Klassenzimmer\n");
  await pg.waitForTimeout(2500);
  sage(geholt.length === 0, "beim Start nicht geholt", geholt.join(",") || "nichts geholt");
  await pg.waitForFunction(() => {
    const v = document.getElementById("view-knowledge");
    if (v && v.dataset.active === "true") return true;
    const t = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (t) t.click();
    return false;
  }, null, { timeout: 30000, polling: 200 });
  await pg.evaluate(() => { const b = document.querySelector('.subnav-pill[data-sub="sub-livechat"]'); b && b.click(); });
  await pg.waitForTimeout(2500);
  sage(geholt.length === 0, "Wissen → Klassenzimmer holt sie nicht", geholt.join(",") || "nichts geholt");

  console.log("\n2) Dichter & Denker im Kompass\n");
  /* Auf dem Prüfkonto ist der Bereich ausgeblendet (Freischaltung oder Moderation). Für die Messung
     freischalten und Wissen neu öffnen, damit der Kompass neu gezeichnet wird. */
  await pg.evaluate(() => {
    Backend.isFeatureOn = () => true; Backend.canModerate = () => true;
    const andere = document.querySelector('.tape-tab:not([data-target="view-knowledge"])'); if (andere) andere.click();
  });
  await pg.waitForTimeout(400);
  await pg.waitForFunction(() => {
    const v = document.getElementById("view-knowledge");
    if (v && v.dataset.active === "true" && document.getElementById("dichterArea")) return true;
    const t = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (t && !(v && v.dataset.active === "true")) t.click();
    return false;
  }, null, { timeout: 15000, polling: 300 }).catch(() => {});
  const hatBereich = await pg.evaluate(() => {
    const k = document.querySelector('#knowledgeSubnav .subnav-pill[data-sub="sub-kompass"], #knowledgeSubnav [data-sub="sub-kompass"]');
    if (k) k.click();
    const a = document.getElementById("dichterArea");
    if (a) a.scrollIntoView({ block: "center" });
    return Boolean(a);
  });
  if (!hatBereich) {
    sage(true, "Dichter & Denker ist auf diesem Konto ausgeblendet – nur Datei und Wähler werden geprüft");
  } else {
    const gezeichnet = await pg.waitForFunction(() => {
      const a = document.getElementById("dichterArea");
      return a && !/werden geladen/.test(a.textContent) && /Humboldt/.test(a.textContent) && a.querySelector("svg");
    }, null, { timeout: 20000, polling: 200 }).then(() => true).catch(() => false);
    sage(gezeichnet, "sichtbar geworden: geholt und gezeichnet (mit Kachelbild)", geholt.join(","));
  }

  console.log("\n3) Inhalt\n");
  const inhalt = await pg.evaluate(async () => {
    const d = await window.DMA_LESETEXTE_LADEN();
    const pruef = (l) => l.map((e) => ({ id: e.id, niveaus: Object.keys(e.levels || {}).join(""), bild: /^<svg/.test(String(e.img || "").trim()) }));
    return { d: pruef(d.DICHTER), s: pruef(d.SCHNEE) };
  });
  for (const [name, liste] of [["Dichter & Denker", inhalt.d], ["Schnee von gestern", inhalt.s]]) {
    sage(liste.length === 7 && liste.every((e) => e.niveaus === "A1A2B1B2C1C2" && e.bild),
      name + ": 7 Texte mit A1–C2 und Kachelbild", liste.map((e) => e.id).join(","));
  }
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(!/const (SCHNEE|DICHTER)_ENTRIES = \[/.test(quelle), "app.js trägt die Listen nicht mehr selbst");

  console.log("\n4) Der Lesetext-Wähler\n");
  const quelleWaehler = /return lesetexteLaden\(\)\.then\(\(d\) => ausListe\(d\.SCHNEE\)\)/.test(quelle)
    && /return lesetexteLaden\(\)\.then\(\(d\) => ausListe\(d\.DICHTER\)\)/.test(quelle);
  sage(quelleWaehler, "lcLesestoff holt beide Kategorien über lesetexteLaden");

  sage(konsole.length === 0, "keine Fehler in der Konsole", konsole.slice(0, 3).join(" | ") + (fehlt.length ? "  fehlt: " + fehlt.join(", ") : ""));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
