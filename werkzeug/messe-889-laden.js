#!/usr/bin/env node
/* MISST FASSUNG 889: „Verlauf laden" beim Betreten – den ganzen Verlauf aus dem Lager holen (chatAusLager über
   pruefVerlaufAusLager) – gegen einen Vergleichsbaum (888), verschränkt, mit dem Lager AUF DER PLATTE (eigenes Profil
   je Lauf wie auf einem Gerät; die flüchtigen Playwright-Kontexte halten die IndexedDB im Arbeitsspeicher).
   Schwere Seite: Telefon-Ansicht, Klassenzimmer offen, 7 000 Zeilen (Profilfotos bei 3 von 30 Autoren), CPU 4×.
   Je Lauf 9 Lesungen (Median); dazu der längste Leerlauf-/IndexedDB-Rückruf aus livechat.js während des Lesens.
   Aufruf: node werkzeug/messe-889-laden.js [Runden=3]   VERGLEICH=<Baum> (Vorgabe /tmp/claude-0/v888)  ZEILEN=7000 */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const VGL = path.resolve(process.env.VERGLEICH || "/tmp/claude-0/v888");
const RUNDEN = Number(process.argv[2] || 3), ZEILEN = Number(process.env.ZEILEN || 7000);
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };
function server(wurzel) {
  return new Promise((ok) => {
    const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(wurzel, p);
      if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0, () => ok(srv));
  });
}
function messen() {
  window.__m = { an: false, d: [] };
  const vonChat = () => /livechat/.test(new Error().stack || "");
  const huellen = (proto, namen) => namen.forEach((p) => {
    const d = Object.getOwnPropertyDescriptor(proto, p);
    if (!d || !d.set) return;
    Object.defineProperty(proto, p, { configurable: true, enumerable: d.enumerable, get: d.get, set(f) {
      if (typeof f !== "function" || !vonChat()) return d.set.call(this, f);
      d.set.call(this, function (e) { const t = performance.now(); try { return f.call(this, e); } finally { if (window.__m.an) window.__m.d.push(performance.now() - t); } });
    } });
  });
  huellen(IDBRequest.prototype, ["onsuccess"]);
  huellen(IDBTransaction.prototype, ["oncomplete"]);
  try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
}
async function lauf(wurzel) {
  const srv = await server(wurzel);
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "laden889-"));
  const ctx = await chromium.launchPersistentContext(profil, { executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"],
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75, serviceWorkers: "block" });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await ctx.addInitScript(messen);
  const pg = ctx.pages()[0] || await ctx.newPage();
  const fehler = []; pg.on("pageerror", (e) => fehler.push(String(e.message || e).slice(0, 120)));
  const bereit = async () => { await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefSitz && window.DMA_PRUEF, null, { timeout: 60000 }); await schlaf(4000); };
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" }); await bereit();
  await pg.evaluate(async (ZEILEN) => {
    const foto = (seed) => { let s = "data:image/png;base64,iVBORw0KGgo"; let x = seed * 7919; const z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; while (s.length < 16000) { x = (x * 1103515245 + 12345) % 2147483648; s += z[x % 64]; } return s; };
    const fotos = [foto(1), foto(2), foto(3)];
    LiveChat.pruefRaum("klassenzimmer"); await LiveChat.pruefVerlaufAusLager("klassenzimmer");
    const l = [], t0 = Date.now() - ZEILEN * 30000;
    for (let i = 0; i < ZEILEN; i++) { const a = i % 30; l.push({ id: "z" + i, von: "p" + a, name: "Schüler" + a, text: "Hallo zusammen, Zeile " + i + (i % 7 ? "" : " lang ".repeat(20)), art: "text", zeit: t0 + i * 30000, bild: a < 3 ? fotos[a] : "", eigen: false }); }
    LiveChat.pruefVerlaufSetzen(l);
    await new Promise((f) => setTimeout(f, 1500));
  }, ZEILEN);
  await pg.reload({ waitUntil: "domcontentloaded" }); await bereit();
  await pg.evaluate(() => {
    LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Xander", seit: 1000, zuruecksetzen: true, leute: {} });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    LiveChat.pruefRaum("anderswo");   // lesen, ohne dass „gelesen" den Raum freigibt (keine Sicherung dazwischen)
  });
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await schlaf(1000);
  const r = await pg.evaluate(async () => {
    const o = { ms: [], rueckruf: [], n: [] };
    for (let k = 0; k < 9; k++) {
      await new Promise((f) => setTimeout(f, 300));
      window.__m.d = []; window.__m.an = true;
      const t = performance.now(); const g = await LiveChat.pruefVerlaufAusLager("klassenzimmer"); o.ms.push(performance.now() - t);
      window.__m.an = false;
      o.rueckruf.push(Math.max(0, ...window.__m.d)); o.n.push(g.length);
    }
    return o;
  });
  await ctx.close(); srv.close(); fs.rmSync(profil, { recursive: true, force: true });
  return { ms: med(r.ms), alle: r.ms.map(Math.round), rueckruf: med(r.rueckruf), n: [...new Set(r.n)], fehler };
}
(async () => {
  const baeume = [["neu", WURZEL], ["vgl", VGL]], alle = [];
  for (let r = 0; r < RUNDEN; r++) for (const [name, b] of (r % 2 ? baeume.slice().reverse() : baeume)) {
    const e = await lauf(b); e.name = name; e.runde = r; alle.push(e);
    console.log(name.padEnd(4) + " R" + r + "  Verlauf laden " + e.ms.toFixed(1) + " ms (Median aus 9: " + e.alle.join(" ") + "), längster Rückruf " + e.rueckruf.toFixed(1) + " ms, Zeilen " + e.n.join("/") + (e.fehler.length ? "  FEHLER " + e.fehler.join(" | ") : ""));
  }
  for (const n of ["neu", "vgl"]) { const l = alle.filter((e) => e.name === n); console.log(n + ": Median der Läufe " + med(l.map((e) => e.ms)).toFixed(1) + " ms (Läufe " + l.map((e) => e.ms.toFixed(1)).join(", ") + "), längster Rückruf " + med(l.map((e) => e.rueckruf)).toFixed(1) + " ms"); }
})().catch((e) => { console.error(e); process.exit(2); });
