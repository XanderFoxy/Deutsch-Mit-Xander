#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 748: POSTFACH (Walkie 295/297/298)
   „wenn dieser Link einfach oben drüber wäre dann wäre das glaube ich viel
   aufgeräumt und viel logischer" · Punkte als Knopf neben Senden ·
   Knopfreihe Bild/Datei/Sticker/Fuchs · Sticker kleiner, ohne Scrollen.
   Aufruf: node werkzeug/pruefe-748-postfach.js [bildpraefix]
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = path.join(__dirname, "..");
let fehler = 0; const sage = (gut, was, z) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (z ? "   " + z : "")); };
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(W, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); } a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); if (location.search.indexOf("gal") >= 0) localStorage.setItem("dma_theme", "galaxie"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await pg.evaluate(() => { const jetzt = Date.now(); Backend.currentUser = () => ({ id: "u-x", display_name: "Xander" }); Backend.canModerate = () => true;
    Backend.getMyMessages = async () => ({ inbox: [1,2,3,4].map((i) => ({ id: "m" + i, body: "Hallo Nummer " + i + " [sticker:herz]", author_name: "Freund " + i, from_user: "f" + i, read: i > 1, created_at: new Date(jetzt - i * 36e5).toISOString() })), outbox: [] });
    Backend.getFriends = async () => [{ id: "f1", display_name: "Freund 1" }]; });
  await pg.evaluate(() => { const b = document.querySelector('[data-view="view-profile"], [data-target="view-profile"], a[href="#view-profile"]'); if (b) b.click(); });
  await pg.waitForTimeout(600);
  await pg.evaluate(() => { const b = document.querySelector('[data-sub="sub-inbox"]'); if (b) b.click(); });
  await pg.waitForTimeout(1200);
  const info = await pg.evaluate(() => { const v = document.getElementById("view-profile"); const sn = document.getElementById("profileSubnav"); const ib = document.getElementById("inboxArea");
    return { aktiv: v && v.dataset.active, subnavH: sn && Math.round(sn.getBoundingClientRect().height), inboxTop: ib && Math.round(ib.getBoundingClientRect().top), inboxHtml: ib ? ib.innerHTML.slice(0, 600) : "" }; });
  await pg.evaluate(() => { document.querySelectorAll("body > div").forEach((d) => { if (/Profil konnte nicht/.test(d.textContent) && d.textContent.length < 400) d.remove(); }); const sn = document.getElementById("profileSubnav"); window.scrollTo(0, sn.getBoundingClientRect().top + scrollY - 10); });
  await pg.waitForTimeout(300);
  const ib = await pg.$("#inboxArea");
  const zu = await pg.evaluate(() => { const t = document.querySelector(".inbox-titel"), sch = document.getElementById("inboxSchreiben"), li = document.querySelector(".inbox-liste");
    return { reihenfolge: t && sch && li && t.compareDocumentPosition(sch) & 4 && sch.compareDocumentPosition(li) & 4, zu: sch && !sch.open, hoehe: sch && Math.round(sch.getBoundingClientRect().height) }; });
  sage(zu.reihenfolge && zu.zu && zu.hoehe < 110, "Überschrift → „Neue Nachricht schreiben“ (zu, schmal) → Posteingang", JSON.stringify(zu));
  if (process.argv[2]) await ib.screenshot({ path: process.argv[2] + "-zu.png" });
  await pg.evaluate(() => { document.getElementById("inboxSchreiben").open = true; });
  await pg.waitForTimeout(200);
  await pg.click('[data-inbox-klappe="sticker"]'); await pg.waitForTimeout(150);
  const m = await pg.evaluate(() => { const r = document.getElementById("inboxStickerRow"); const b = r.getBoundingClientRect(); const k = document.querySelector('.inbox-klappe[data-klappe="sticker"]');
    return { stickerH: Math.round(b.height), sw: r.scrollWidth, cw: r.clientWidth, anzahl: r.children.length, doc: document.documentElement.scrollWidth,
      titelOben: Math.round(document.querySelector(".inbox-titel").getBoundingClientRect().top), schreibenOben: Math.round(document.getElementById("inboxSchreiben").getBoundingClientRect().top), listeOben: Math.round(document.querySelector(".inbox-liste").getBoundingClientRect().top), klappeZu: k.hidden }; });
  sage(m.anzahl >= 30 && m.sw <= m.cw && m.stickerH < 160 && m.doc <= 360, "Sticker: kleine Vorschau als Raster, kein Scrollen, nichts ragt heraus", JSON.stringify(m));
  await pg.click('[data-inbox-klappe="punkte"]'); await pg.waitForTimeout(150);
  const m2 = await pg.evaluate(() => ({ stickerZu: document.querySelector('.inbox-klappe[data-klappe="sticker"]').hidden, punkteAuf: !document.querySelector('.inbox-klappe[data-klappe="punkte"]').hidden }));
  await pg.evaluate(() => { const s = document.getElementById("pointsGiftSlider"); s.value = 50; s.dispatchEvent(new Event("input")); });
  const m3 = await pg.evaluate(() => document.getElementById("inboxPunkteKnopf").textContent);
  sage(m2.stickerZu && m2.punkteAuf, "Punkte-Knopf klappt seinen Kasten auf, die Sticker-Klappe geht zu", JSON.stringify(m2));
  sage(m3 === "🎁 +50 Punkte", "Der Punkte-Knopf zeigt, dass Punkte mitgehen", m3);
  const gross = await pg.evaluate(() => { const b = document.querySelector('#inboxStickerRow [data-sticker]'); b.click(); return document.getElementById("inboxMessageInput").value; });
  sage(/\[sticker:\w+\]/.test(gross), "Antippen fügt wie immer den Platzhalter ein (Sendegröße unverändert)", gross);
  await pg.click('[data-inbox-klappe="sticker"]'); await pg.waitForTimeout(150);
  if (process.argv[2]) await ib.screenshot({ path: process.argv[2] + "-auf.png" });
  await br.close(); srv.close();
  console.log("\nFassung 748 (Postfach): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})();
