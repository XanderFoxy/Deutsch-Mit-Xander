#!/usr/bin/env node
/* =====================================================================
   MESSUNG 886 — RÜCKKEHR IN DEN RAUM NACH DEM NEULADEN, MEHRERE STÄNDE
   VERSCHRÄNKT (Abschluss der Nachbesserung 1 zu „Rückkehr“)
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die schnelle Performance und die Verbindung zu den
   anderen haben oberste Priorität“ · Auftrag: „nie langsamer als 884“.
   Wie Teil M von pruefe-885-rueckkehr.js (Falle für LiveChat.betreten,
   Uhrzeit ab dem Neuladen; Server wie GitHub Pages, index.html und
   fassung.json je D ms), aber für beliebig viele Stände in jeder Runde
   (Reihenfolge rotiert, jede zweite umgedreht) und mit Zeitmarken beider
   Seiten (navigate des Helfers, Wechsel, interaktiv, app.js,
   DOMContentLoaded, betreten) sowie der blockierten Zeit des Hauptfadens
   in den 1,5 s nach betreten (Summe der Lücken über 50 ms).
   Fälle: u = Update noch nicht gesehen, g = ohne Update, k = Update
   schon gesehen (Blase); CPU; D; -goto = Öffnen statt Neuladen.
   Fassung 886 (Prüfbericht zu 1abc32b2, nach dem Werkzeug des Prüfers):
   f<ms> = fassung.json mit eigener Verzögerung (u4-250f5800); -n = der
   Browser hat index.html nicht mehr frisch im eigenen Speicher (der
   Server schickt sie mit no-cache, wie nach mehr als 10 min); je Lauf
   jede Blase auf jeder Seite (auch kurz vor dem Wechsel), „draussen“ im
   Seitenspeicher am Ende, und auf der letzten Seite, wann die Antwort des
   Helfers („gleich“/„nichts“/„neu“) und die von fassung.json ankamen.
   KALT=1: der Helfer wird vor dem Neuladen angehalten (kalter Start) –
   aber erst, wenn die Seite ruhig ist; sonst scheiterten laufende
   Anfragen, dmaMinFehlt lud neu und schaltete min/ ab (so war eine
   frühere Kalt-Messung verdorben; Ruheprüfung nach dem Werkzeug des
   Prüfers). Ein verdorbener Versuch wird verworfen und wiederholt.
   Aufruf:
     VAR="A=<baum 884>,E=<baum>,C=<baum>" FAELLE="u4-250,u4-500" PAARE=10        AUS=<datei.json> [ZEIT=1] node werkzeug/messe-885-rueckkehr.js
     node werkzeug/messe-885-rueckkehr.js --auswerten <datei.json> …
       (Median je Stand, gepaart gegen A mit 95-%-Bereich, Wechsel,
       blockierte Zeit)
   Ergebnisse: SPIELSYSTEM.md, „Rückkehr: Nachbesserung 1“, Messung
   Abschluss 886; Runde 2 und Runde 3 (Fall B: Öffnen ohne Update über
   die Antwortzeit, FAELLE="g1-250-goto,g1-800-goto,…,g1-250-goto-n").
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const VAR = (process.env.VAR || "").split(",").filter(Boolean).map((x) => x.split("=")).map(([n, p]) => ({ n, p: path.resolve(p) }));
const FAELLE = (process.env.FAELLE || "u4-250").split(",").map((x) => { const m = /^([ugk])(\d+)-(\d+)(?:f(\d+))?(-goto)?(-n)?$/.exec(x.trim()); return { name: x.trim(), update: m[1] !== "g", bekannt: m[1] === "k", cpu: Number(m[2]), D: Number(m[3]), fD: m[4] != null ? Number(m[4]) : Number(m[3]), art: m[5] ? "goto" : "reload", netz: Boolean(m[6]) }; });
const PAARE = Number(process.env.PAARE || 6), AUS = process.env.AUS || "";
const PRE = "/Deutsch-Mit-Xander";
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
const grund = (w) => (fs.readFileSync(path.join(w, "index.html"), "utf8").match(/window\.DMA_VERSION = "(\d+)"/) || [])[1];
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const s = a.filter((x) => typeof x === "number" && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
function server(wurzel) {
  const S = { seite: "", stau: 0, fjStau: 0, ohneSpeicher: false };
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?"); let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i));
    if (!p.startsWith(PRE + "/")) { a.writeHead(404); return a.end(); }
    p = p.slice(PRE.length); if (p === "/") p = "/index.html";
    if (p === "/fassung.json") { const los = () => { if (!a.destroyed) { a.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "max-age=600" }); a.end(JSON.stringify({ fassung: S.seite || grund(wurzel) })); } }; return S.fjStau ? setTimeout(los, S.fjStau) : los(); }
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    let body = fs.readFileSync(f); const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream" };
    if (p === "/index.html") { let t = String(body); if (S.seite) t = t.replace(/window\.DMA_VERSION = "[^"]*";/, 'window.DMA_VERSION = "' + S.seite + '";'); body = Buffer.from(t); kopf["Cache-Control"] = S.ohneSpeicher ? "no-cache" : "max-age=600";
      if (S.stau) return setTimeout(() => { if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } }, S.stau); }
    if (p === "/sw.js") kopf["Cache-Control"] = "no-cache";
    a.writeHead(200, kopf); a.end(body);
  }).listen(0, "127.0.0.1");
  return new Promise((r) => srv.on("listening", () => r({ S, srv, hier: "http://127.0.0.1:" + srv.address().port + PRE })));
}
function falle() {
  if (window.top !== window) return;
  try {
    localStorage.setItem("dma_tour_seen", "1");
    const n = Number(sessionStorage.getItem("__s") || 0) + 1; sessionStorage.setItem("__s", String(n));
    if (sessionStorage.getItem("__rueck") === "1") sessionStorage.setItem("dma_livechat_zurueck", JSON.stringify({ raum: "pruefraum885", name: "Pruef", mitBild: false, zeit: Date.now() }));
    const ms = window.__ms = {}; const mark = (k) => { if (ms[k] == null) ms[k] = Math.round(performance.now()); };
    document.addEventListener("readystatechange", () => mark(document.readyState));
    /* 886 (Prüfer): jede Blase auf jeder Seite mitschreiben (auch kurz vor dem Wechsel) */
    try { const mo = new MutationObserver(() => { const b = document.getElementById("dmaNeueFassung"); if (b && !b.__gesehen) { b.__gesehen = 1; const l = JSON.parse(sessionStorage.getItem("__bl") || "[]"); l.push({ seite: n, t: Math.round(performance.now()), f: String(window.DMA_VERSION) }); sessionStorage.setItem("__bl", JSON.stringify(l)); } });
      mo.observe(document, { childList: true, subtree: true }); } catch (e) {}
    /* 886: wann die Antwort des Helfers und die von fassung.json auf dieser Seite ankamen */
    try { navigator.serviceWorker.addEventListener("message", (e) => { const w = e.data && e.data.dmaHelfer; if (w) mark("helfer_" + w); }); } catch (e) {}
    try { const op = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function (m, u) { if (/fassung\.json/.test(String(u))) { mark("fjLos"); this.addEventListener("loadend", () => mark("fj")); } return op.apply(this, arguments); }; } catch (e) {}
    let dt; Object.defineProperty(window, "DMA_TEILE", { configurable: true, get: () => dt, set: (v) => { dt = v; mark("appjs"); } });
    document.addEventListener("DOMContentLoaded", () => mark("dcl"));
    addEventListener("pagehide", () => { const l = JSON.parse(sessionStorage.getItem("__ph") || "[]"); l.push({ seite: n, uhr: Date.now(), ms, to: performance.timeOrigin }); sessionStorage.setItem("__ph", JSON.stringify(l)); });
    let lc;
    Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => { lc = v; mark("livechat"); try { v.betreten = function () {
      mark("betreten");
      /* Hauptfaden nach betreten (Ersatz für den Verbindungsaufbau): blockierte Zeit in den 1,5 s danach (Summe der Lücken über 50 ms
         zwischen Zeitgebern, je minus 50) und längste Lücke */
      (() => { const ab = performance.now(); let vor = ab, blo = 0, max = 0;
        const tick = () => { const t = performance.now(), g = t - vor; if (g > 50) blo += g - 50; if (g > max) max = g; vor = t;
          if (t - ab < 1500) setTimeout(tick, 0); else { ms.blockiert = Math.round(blo); ms.luecke = Math.round(max); try { sessionStorage.setItem("__blo", JSON.stringify([Math.round(blo), Math.round(max)])); } catch (e) {} } };
        setTimeout(tick, 0); })();
      const b = JSON.parse(sessionStorage.getItem("__b") || "[]"); b.push({ seite: n, t: Math.round(performance.now()), uhr: Date.now(), f: String(window.DMA_VERSION) }); sessionStorage.setItem("__b", JSON.stringify(b));
      try { v.pruefLageSetzen("verbindet"); } catch (e) {} return new Promise(() => {}); }; } catch (e) {} } });
  } catch (e) {}
}
let zaehler = 0;
async function lauf(br, sv, wurzel, fa) {
  const { S, hier } = sv; const G = Number(grund(wurzel));
  const V = String(G + 10 * (++zaehler)), V1 = fa.update ? String(Number(V) + 1) : V;
  S.seite = V; S.stau = 0; S.fjStau = 0; S.ohneSpeicher = fa.netz;
  const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(falle);
  const pg = await ctx.newPage(); const cdp = await ctx.newCDPSession(pg);
  await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" });
  await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
  await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" });
  await schlaf(1500);
  await pg.evaluate(() => { sessionStorage.setItem("__rueck", "1"); sessionStorage.setItem("__s", "0"); ["__b", "__ph", "__bl"].forEach((x) => sessionStorage.setItem(x, "[]")); });
  if (fa.bekannt) { S.seite = V1; await pg.evaluate(() => document.dispatchEvent(new Event("visibilitychange"))); await pg.waitForFunction(() => document.getElementById("dmaNeueFassung"), null, { timeout: 5000 }).catch(() => {}); await schlaf(400); }
  let kaltVersuche = 0, kaltSchmutz = 0;
  if (process.env.KALT) {
    await cdp.send("ServiceWorker.enable").catch(() => {});
    for (kaltVersuche = 1; kaltVersuche <= 4; kaltVersuche++) {
      let n0 = -1;
      for (let i = 0; i < 40; i++) { const n = await pg.evaluate(() => performance.getEntriesByType("resource").length).catch(() => -2); if (n === n0) break; n0 = n; await schlaf(250); }
      const vor = await pg.evaluate(() => ({ s: sessionStorage.getItem("__s"), o: localStorage.getItem("dma-ohne-min") })).catch(() => null);
      await cdp.send("ServiceWorker.stopAllWorkers").catch((x) => console.log("SW stop", x.message));
      await schlaf(600);
      const nach = await pg.evaluate(() => ({ s: sessionStorage.getItem("__s"), o: localStorage.getItem("dma-ohne-min") })).catch(() => null);
      if (vor && nach && vor.s === nach.s && !nach.o) break;
      kaltSchmutz++;
      await pg.waitForLoadState("load").catch(() => {});
      await pg.evaluate(() => { localStorage.removeItem("dma-ohne-min"); sessionStorage.removeItem("dma-min-neu"); }).catch(() => {});
      await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" }); await schlaf(1500);
    }
  }
  S.seite = V1; S.stau = fa.D; S.fjStau = fa.fD;
  if (fa.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: fa.cpu });
  const t0 = Date.now();
  if (fa.art === "goto") await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "commit" }).catch(() => {});
  else await pg.reload({ waitUntil: "commit" }).catch(() => {});
  const bis = Date.now() + 9000; let l = null;
  while (Date.now() < bis) { await schlaf(250); l = await pg.evaluate(() => JSON.parse(sessionStorage.getItem("__b") || "[]")).catch(() => null); if (l && l.length && Date.now() - l[l.length - 1].uhr > 2000) break; }
  const e = await pg.evaluate(async () => ({ f: String(window.DMA_VERSION), b: JSON.parse(sessionStorage.getItem("__b") || "[]"), ph: JSON.parse(sessionStorage.getItem("__ph") || "[]"), s: Number(sessionStorage.getItem("__s")), to: performance.timeOrigin,
    blase: Boolean(document.getElementById("dmaNeueFassung")), marke: document.documentElement.hasAttribute("data-dma-speicher"), bl: JSON.parse(sessionStorage.getItem("__bl") || "[]"),
    draussen: await (async () => { try { const k = await caches.open("dma-seite-1"); const c = navigator.serviceWorker.controller; const a = (c && await k.match(new URL("draussen", c.scriptURL).href)) || await k.match("draussen"); return a ? await a.text() : ""; } catch (e) { return "?"; } })(), ms: window.__ms || {}, blo: JSON.parse(sessionStorage.getItem("__blo") || "null"),
    nav: (() => { const n = performance.getEntriesByType("navigation")[0] || {}; return { typ: n.type, ws: Math.round(n.workerStart || 0), rs: Math.round(n.responseStart || 0), re: Math.round(n.responseEnd || 0) }; })() })).catch((x) => ({ fehler: String(x) }));
  await ctx.close();
  S.ohneSpeicher = false;
  const b = e.b || [];
  return { V, V1, f: e.f, neu: e.f === V1, seiten: e.s, nb: b.length, bl: e.bl, draussen: e.draussen, marke: e.marke, kaltVersuche, kaltSchmutz, ab: b.length ? b[0].uhr - t0 : null, abLetzt: b.length ? b[b.length - 1].uhr - t0 : null, blase: e.blase,
    blo: e.blo, navLetzt: e.to ? Math.round(e.to - t0) : null, letzt: Object.assign({ nav: e.nav }, e.ms), ph: (e.ph || []).map((x) => ({ seite: x.seite, ab: x.uhr - t0, ms: x.ms })) };
}
function auswerten(dateien) {
const medA = (a) => { const s = a.filter((x) => typeof x === "number" && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
let seed = 7; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const boot = (d) => { const m = []; for (let k = 0; k < 4000; k++) { const s = d.map(() => d[Math.floor(rnd() * d.length)]); m.push(medA(s)); } m.sort((x, y) => x - y); return [m[Math.floor(0.025 * m.length)], m[Math.floor(0.975 * m.length)]]; };
for (const f of dateien) {
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  const faelle = [...new Set(j.laeufe.map((l) => l.fall))];
  for (const fa of faelle) {
    const L = j.laeufe.filter((l) => l.fall === fa), vars = [...new Set(L.map((l) => l.var))];
    const je = {}; vars.forEach((v) => (je[v] = {})); L.forEach((l) => (je[l.var][l.runde] = l));
    const runden = Object.keys(je[vars[0]]);
    const teile = vars.map((v) => {
      const a = runden.map((r) => je[v][r] && je[v][r].ab);
      let s = v + " " + medA(a);
      if (v !== "A" && je.A) {
        const d = runden.filter((r) => je[v][r] && je.A[r] && je[v][r].ab != null && je.A[r].ab != null).map((r) => je[v][r].ab - je.A[r].ab);
        const [u, o] = boot(d);
        s += " (" + v + "−A " + (medA(d) > 0 ? "+" : "") + medA(d) + " [" + u + " … " + o + "], schneller " + d.filter((x) => x < 0).length + "/" + d.length + ")";
      }
      const neu = runden.filter((r) => je[v][r] && je[v][r].neu).length;
      const zwei = runden.filter((r) => je[v][r] && je[v][r].nb > 1).length;
      const wechsel = runden.map((r) => { const l = je[v][r]; const p = l && l.ph && l.ph.find((x) => x.seite === 1 && l.seiten > 1); return p ? p.ab - l.navLetzt : null; });
      const bl = runden.map((r) => je[v][r] && je[v][r].blo ? je[v][r].blo[0] : null);
      return s + ", neu " + neu + "/" + runden.length + (zwei ? ", zweimal betreten " + zwei : "") + (wechsel.some((x) => x != null) ? ", Wechsel " + medA(wechsel) + " ms (max " + Math.max(...wechsel.filter((x) => x != null)) + ")" : "") + ", blockiert " + medA(bl);
    });
    console.log(fa.padEnd(14) + teile.join("  ·  "));
  }
}
}
if (process.argv[2] === "--auswerten") { auswerten(process.argv.slice(3)); process.exit(0); }
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });
  const sv = {}; for (const v of VAR) sv[v.n] = await server(v.p);
  const ERG = { var: VAR, faelle: FAELLE, laeufe: [] };
  const zusammen = [];
  for (const fa of FAELLE) {
    const je = {}; VAR.forEach((v) => (je[v.n] = []));
    for (let r = 0; r < PAARE; r++) {
      const reihe = VAR.map((_, i) => VAR[(i + r) % VAR.length]);
      if (r % 2) reihe.reverse();
      const runde = {};
      for (const v of reihe) { const e = await lauf(br, sv[v.n], v.p, fa); runde[v.n] = e; je[v.n].push(e); ERG.laeufe.push(Object.assign({ fall: fa.name, runde: r, var: v.n }, e)); if (AUS) fs.writeFileSync(AUS, JSON.stringify(ERG, null, 1)); }
      if (process.env.ZEIT) VAR.forEach((v) => { const x = runde[v.n], L = x.letzt || {}, o = x.navLetzt || 0, rel = (k) => (L[k] != null ? L[k] + o : "-");
        console.log("   " + v.n + ": nav " + o + " (" + (L.nav && L.nav.typ) + ", Antwort " + (L.nav ? L.nav.rs + o : "-") + ")" + ", alt weg " + ((x.ph.find((y) => y.seite === 1 && x.seiten > 1) || {}).ab || "-") + ", interaktiv " + rel("interactive") + ", livechat " + rel("livechat") + ", app.js " + rel("appjs") + ", DCL " + rel("dcl") + ", betreten " + rel("betreten")); });
      console.log(fa.name + " Runde " + (r + 1) + ": " + VAR.map((v) => v.n + " " + runde[v.n].ab + (runde[v.n].neu ? "" : "(ALT)") + (runde[v.n].nb !== 1 ? "(betreten×" + runde[v.n].nb + ")" : "") + (runde[v.n].bl && runde[v.n].bl.length ? "(BLASE " + JSON.stringify(runde[v.n].bl) + ")" : "") + (runde[v.n].draussen ? "(draussen " + runde[v.n].draussen + ")" : "") + " s" + runde[v.n].seiten + (runde[v.n].marke ? "m" : "") + (process.env.KALT ? " k" + runde[v.n].kaltVersuche + "/" + runde[v.n].kaltSchmutz : "") + (runde[v.n].letzt && runde[v.n].letzt.fj != null ? " [fj " + runde[v.n].letzt.fj + (Object.keys(runde[v.n].letzt).filter((k) => /^helfer_/.test(k)).map((k) => ", " + k.slice(7) + " " + runde[v.n].letzt[k]).join("")) + "]" : "") + (runde[v.n].navLetzt > 30 ? " [nav " + runde[v.n].navLetzt + ", weg " + ((runde[v.n].ph.find((x) => x.seite === 1) || {}).ab) + "]" : "")).join("   "));
    }
    const erst = VAR[0].n;
    const zeile = fa.name + ": " + VAR.map((v) => {
      const a = je[v.n].map((e) => e.ab); let s = v.n + " " + med(a);
      if (v.n !== erst) { const d = je[v.n].map((e, i) => e.ab - je[erst][i].ab); s += " (" + v.n + "−" + erst + " " + med(d) + ", schneller " + d.filter((x) => x < 0).length + "/" + d.length + ", " + JSON.stringify(d) + ")"; }
      const bl = je[v.n].map((e) => (e.blo ? e.blo[0] : null));
      return s + " neu " + je[v.n].filter((e) => e.neu).length + "/" + je[v.n].length + " [blockiert nach betreten " + med(bl) + " ms]";
    }).join("  ·  ");
    console.log("== " + zeile); zusammen.push(zeile);
  }
  console.log("\n" + zusammen.join("\n"));
  await br.close(); Object.values(sv).forEach((s) => s.srv.close());
})().catch((e) => { console.error(e); process.exit(2); });
