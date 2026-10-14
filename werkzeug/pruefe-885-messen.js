#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — DAS MESSWERKZEUG MISST, WAS ES SAGT (Fassung 885, Schritt A)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   310/312): „das Maximum rausholen", „die maximal professionellste
   Lösung". Bevor irgendetwas schneller gemacht wird, muss die Messung
   stimmen – sonst ist jeder „Gewinn" geraten.

   Teil A läuft werkzeug/ladezeit-messen.js gegen eine PRÜFSEITE, deren
   Zeiten die Sonde selbst festlegt (eigener Ordner im Zwischenordner):
     - beim Laden 150 ms Arbeit (pruefLast), zwei kaum packbare Skripte
       (je 400 KB) vor „bereit", ein kleiner Service Worker wie sw.js;
     - Tipp „Wissen": 200 ms Arbeit + 10× erzwungenes Layout;
     - Tipp „Klassenzimmer": 120 ms Arbeit, dann der Knopf „Betreten";
     - ein Abruf an example.com (muss sofort scheitern: das Werkzeug löst
       keinen fremden Namen auf – nie ein Geist im echten Klassenzimmer).
   Geprüft (je Fall 2 Läufe, Fenster 3 s):
     1  läuft durch: alle vier Fälle, je 2 Läufe, kein Abbruch, JSON
     2  echte Tipps: je ein Tipp genügt; Wissen Tipp → Bild ≥ 200 ms und
        < 600 ms; Klassenzimmer ≥ 120 ms und < 400 ms
     3  Zerlegung: alte Spalte = Wissen + Werkzeug-Pause + Klassenzimmer
     4  Leitung im Server: kalt und pause erstes Byte ≥ 2,5 RTT (Aufbau
        TCP+TLS + Anfrage = 3 RTT; Chrome beginnt den Aufbau teils schon vor
        dem Nullpunkt der Seite), warm ≈ 1 RTT, sw ≥ 1 RTT – der Helfer holt
        die Seite durch die Leitung (das alte Verfahren: nicht, siehe B2)
     5  Bandbreite gemeinsam: kalt „bereit" − erstes Byte ≥ 90 % der Zeit,
        die beide großen Skripte zusammen über 9 Mbit/s brauchen
     6  Fälle: kalt aus dem Netz, warm aus dem Speicher, pause nachgefragt
        (304), sw vom Service Worker
     7  Langläufer: der 150-ms-Block beim Start wird gezählt, das längste
        Bild (LoAF) nennt pruefLast
     8  Spur: die 200 ms liegen im Abschnitt „wissen" (Nullpunkt stimmt),
        erzwungenes Layout wird erkannt; „start" enthält die 150 ms
     9  Server packt nichts während der Messung (aufgewärmt)
    10  Zusammenfassung = Median der Einzelläufe (nachgerechnet)
    11  fremde Adresse scheitert sofort (< 1 s)
    12  echte Seite (kalt, warm, wieder; je ein Lauf): DMA_MESS (index.html)
        zählt den Tipp; Wissen gleich wie das Werkzeug (± 10 ms), beim
        Klassenzimmer ± 80 ms – beide warten rAF + setTimeout 0, und
        zwischen den zwei setTimeout-Rückrufen kann eine Aufgabe der Seite
        liegen (gesehen: 0–68 ms, DMA später)
    13  Profil auf der Platte: beim dritten Öffnen nimmt min/app.js den
        übersetzten Code aus dem Speicher (V8-Code-Cache), beim zweiten wird
        er angelegt; kalt nicht
   Teil B – Belege, warum das alte Werkzeug falsch maß (ohne Werkzeug; bleiben
   in der Gegenprobe grün):
    B1  el.click() auf „Wissen" zählt DMA_MESS nicht (isTrusted), ein Tipp schon
    B2  Drosselung über die Entwicklerwerkzeuge (1 Mbit/s) erreicht die Seite
        nicht, die der Service Worker holt: eine 150-KB-Seite kommt über den
        Helfer in < 300 ms, ohne Helfer braucht sie ≥ 900 ms

   Aufruf: node werkzeug/pruefe-885-messen.js
   Gegenprobe: WURZEL=<ordner mit werkzeug/ladezeit-messen.js aus 02613a7> node …
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto"), { spawnSync } = require("child_process");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const WERKZEUG = path.join(WURZEL, "werkzeug/ladezeit-messen.js");
const SEITE = process.env.SEITE || (fs.existsSync(path.join(WURZEL, "index.html")) ? WURZEL : HIER);
const RTT = 60, RATE = 9e6 / 8;

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz != null ? "   " + zusatz : ""));
};
const med = (v) => { const s = v.slice().sort((a, b) => a - b), i = (s.length - 1) / 2; return Math.round((s[Math.floor(i)] + s[Math.ceil(i)]) / 2); };

/* ---------- die Prüfseite ---------- */
function pruefseite() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "dma-pruef885-"));
  const gross = (n) => "/* " + crypto.randomBytes(300 * 1024).toString("base64") + " */ window.__g" + n + " = 1;\n";
  fs.writeFileSync(d + "/gross1.js", gross(1));
  fs.writeFileSync(d + "/gross2.js", gross(2));
  fs.writeFileSync(d + "/a.css", ".view[data-active=false],#sub-livechat[data-active=false]{display:none} button{font-size:18px;min-height:48px;margin:4px} #viele div{padding:2px}\n");
  fs.writeFileSync(d + "/index.html", `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prüfseite 885</title><link rel="stylesheet" href="a.css?v=1">
<script src="gross1.js?v=1" defer></script><script src="gross2.js?v=1" defer></script><script src="seite.js?v=1" defer></script>
</head><body>
<nav><button class="tape-tab" data-target="view-start">Start</button><button class="tape-tab" data-target="view-knowledge">Wissen</button></nav>
<section id="view-start" class="view" data-active="true"><p>Start</p></section>
<section id="view-knowledge" class="view" data-active="false"><div id="knowledgeSubnav"><button class="subnav-pill" data-sub="sub-livechat">Klassenzimmer</button></div>
<div id="sub-livechat" data-active="false"><div id="livechatArea"></div></div></section>
<div id="viele"></div></body></html>`);
  /* B2: dieselbe Seite mit 150 KB Ballast (ungepackt ausgeliefert), damit man die Bandbreite sieht */
  fs.writeFileSync(d + "/gross.html", fs.readFileSync(d + "/index.html", "utf8").replace("</body>", "<!-- " + crypto.randomBytes(112 * 1024).toString("base64") + " --></body>"));
  fs.writeFileSync(d + "/seite.js", `function pruefLast(ms) { var t = performance.now(); while (performance.now() - t < ms) {} }
document.addEventListener("DOMContentLoaded", function () {
  pruefLast(150);
  var v = document.getElementById("viele"), h = "";
  for (var i = 0; i < 600; i++) h += "<div>Zeile " + i + " mit etwas Text zum Umbrechen</div>";
  v.innerHTML = h;
  window.LiveChat = {}; window.DMA_TAFEL_STAND = {};
  document.querySelectorAll(".tape-tab").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.target === "view-knowledge") { pruefLast(200); for (var j = 0; j < 10; j++) { v.style.width = (300 + j) + "px"; void v.offsetHeight; } }
      document.querySelectorAll(".view").forEach(function (x) { x.dataset.active = String(x.id === b.dataset.target); });
    });
  });
  document.querySelector('.subnav-pill[data-sub="sub-livechat"]').addEventListener("click", function () {
    pruefLast(120);
    document.getElementById("sub-livechat").dataset.active = "true";
    document.getElementById("livechatArea").innerHTML = '<button id="lcBetreten">Klassenzimmer betreten</button>';
  });
  var t0 = performance.now();
  fetch("https://example.com/").then(function () { window.__dmaPruef = { fremd: "erreicht", ms: Math.round(performance.now() - t0) }; },
    function () { window.__dmaPruef = { fremd: "gescheitert", ms: Math.round(performance.now() - t0) }; });
  if ("serviceWorker" in navigator && (!navigator.webdriver || /mit-sw/.test(location.search)))
    addEventListener("load", function () { setTimeout(function () { navigator.serviceWorker.register("sw.js"); }, 300); });
});
`);
  fs.writeFileSync(d + "/sw.js", `self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.mode === "navigate") { e.respondWith(fetch(e.request)); return; }
  if (!u.searchParams.get("v")) return;
  e.respondWith(caches.open("k").then(function (k) { return k.match(e.request).then(function (da) { return da || fetch(e.request).then(function (a) { k.put(e.request, a.clone()); return a; }); }); }));
});
`);
  return d;
}

/* einfacher Server ohne Drosselung (für Teil B) */
function einfach(wurzel) {
  const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
  const s = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": p === "/index.html" ? "no-cache" : "max-age=600" });
    a.end(fs.readFileSync(f));
  });
  return new Promise((r) => s.listen(0, "127.0.0.1", () => r(s)));
}

function werkzeug(args, json) {
  const r = spawnSync(process.execPath, [WERKZEUG].concat(args), { encoding: "utf8", timeout: 900000, env: Object.assign({}, process.env, { LADEZEIT_JSON: json }) });
  let j = null;
  try { j = JSON.parse(fs.readFileSync(json, "utf8")); } catch (e) {}
  return { code: r.status, aus: (r.stdout || "") + (r.stderr || ""), j };
}

(async () => {
  console.log("Sonde 885-messen – Werkzeug: " + WERKZEUG);
  const P = pruefseite();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dma-pruef885-json-"));

  console.log("\nTeil A – Prüfseite (" + P + ")");
  const A = werkzeug(["4g", P, "--sw", "--laeufe", "2", "--fenster", "3000", "--supabase", "-", "--leise"], path.join(tmp, "a.json"));
  const j = A.j, L = (j && j.laeufe) || [];
  const fall = (art) => L.filter((r) => r.art === art && !r.abbruch);
  /* 1 */
  sage(!!(j && j.laeufe), "1  JSON mit Einzelläufen", j ? "" : A.aus.split("\n").slice(-4).join(" | "));
  sage(["kalt", "warm", "pause", "sw"].every((a) => fall(a).length === 2), "1  je Fall 2 Läufe ohne Abbruch", ["kalt", "warm", "pause", "sw"].map((a) => a + " " + fall(a).length).join(", "));
  const alle = L.filter((r) => !r.abbruch);
  /* 2 */
  sage(alle.length && alle.every((r) => r.versuche && r.versuche[0] === 1 && r.versuche[1] === 1), "2  ein echter Tipp genügt (Wissen und Klassenzimmer)", alle.map((r) => (r.versuche || []).join("/")).join(" "));
  sage(alle.length && alle.every((r) => r.wissen >= 200 && r.wissen < 600), "2  Wissen: Tipp → Bild 200…600 ms", alle.map((r) => r.wissen).join(" "));
  sage(alle.length && alle.every((r) => r.kzKnopf >= 120 && r.kzKnopf < 400 && r.kzBild >= 120), "2  Klassenzimmer: Tipp → Knopf 120…400 ms", alle.map((r) => r.kzBild + "/" + r.kzKnopf).join(" "));
  /* 3 */
  sage(alle.length && alle.every((r) => { const W = r.tippW, K = r.tippK; return W && K && Math.abs(r.kzAlt - (r.wissen + (K.ab - W.ab - W.bild) + r.kzKnopf)) <= 2 && r.pause >= 0; }),
    "3  alte Spalte = Wissen + Werkzeug-Pause + Klassenzimmer", alle.map((r) => r.kzAlt + "=" + r.wissen + "+" + Math.round(r.tippK.ab - r.tippW.ab - r.tippW.bild) + "+" + r.kzKnopf).join(" "));
  /* 4 */
  const tt = (art) => fall(art).map((r) => r.ttfb);
  sage(fall("kalt").length && tt("kalt").every((x) => x >= 2.5 * RTT), "4  kalt: erstes Byte ≥ 2,5 RTT (Aufbau TCP+TLS + Anfrage)", tt("kalt").join(" "));
  sage(fall("warm").length && tt("warm").every((x) => x >= RTT - 5 && x < 2 * RTT + 30), "4  warm: erstes Byte ≈ 1 RTT (Verbindung steht)", tt("warm").join(" "));
  sage(fall("pause").length && tt("pause").every((x) => x >= 2.5 * RTT), "4  pause: Verbindung neu aufgebaut (≥ 2,5 RTT)", tt("pause").join(" "));
  sage(fall("sw").length && tt("sw").every((x) => x >= RTT - 5), "4  sw: der Helfer holt die Seite durch die gedrosselte Leitung", tt("sw").join(" "));
  /* 5 */
  const gz = ["gross1.js", "gross2.js"].reduce((s, f) => s + require("zlib").gzipSync(fs.readFileSync(path.join(P, f)), { level: 9 }).length, 0);
  const soll = gz / RATE * 1000;
  sage(fall("kalt").length && fall("kalt").every((r) => r.bereit - r.ttfb >= 0.9 * soll), "5  Bandbreite gemeinsam: bereit − erstes Byte ≥ 90 % von " + Math.round(soll) + " ms", fall("kalt").map((r) => r.bereit - r.ttfb).join(" "));
  /* 6 */
  sage(fall("kalt").length === 2 && fall("kalt").every((r) => r.netz.ausNetz >= 4 && r.netz.ausSpeicher === 0), "6  kalt: alles aus dem Netz", fall("kalt").map((r) => r.netz.ausNetz).join(" "));
  sage(fall("warm").length === 2 && fall("warm").every((r) => r.netz.ausSpeicher >= 4 && r.netz.kbBisBereit < 5), "6  warm: aus dem Speicher, < 5 KB", fall("warm").map((r) => r.netz.ausSpeicher + "/" + r.netz.kbBisBereit + " KB").join(" "));
  sage(fall("pause").length === 2 && fall("pause").every((r) => r.netz.nachgefragt >= 4), "6  pause: beim Server nachgefragt (304)", fall("pause").map((r) => r.netz.nachgefragt).join(" "));
  sage(fall("sw").length === 2 && fall("sw").every((r) => r.sw && r.netz.ausSw >= 4), "6  sw: vom Service Worker", fall("sw").map((r) => r.sw + "/" + r.netz.ausSw).join(" "));
  /* 7 */
  sage(fall("kalt").length === 2 && fall("kalt").every((r) => r.lang.max >= 150), "7  Langläufer beim Start ≥ 150 ms gezählt", fall("kalt").map((r) => r.lang.max).join(" "));
  sage(fall("kalt").length === 2 && fall("kalt").every((r) => r.loaf.some((x) => x.skripte.some((s) => /pruefLast|seite\.js/.test(s.join(" "))))), "7  LoAF nennt Datei/Funktion", fall("kalt").map((r) => (r.loaf[0] && r.loaf[0].skripte[0] || []).join(",")).join(" | "));
  /* 8 */
  const sp = (r, w, k) => (r.spur && r.spur.fenster && r.spur.fenster[w] && r.spur.fenster[w][k]) || 0;
  sage(alle.length && alle.every((r) => sp(r, "wissen", "skript") >= 170), "8  Spur: die 200 ms liegen im Abschnitt „wissen\"", alle.map((r) => sp(r, "wissen", "skript")).join(" "));
  sage(alle.length && alle.every((r) => sp(r, "wissen", "erzwungen") > 0), "8  Spur: erzwungenes Layout erkannt", alle.map((r) => sp(r, "wissen", "erzwungen")).join(" "));
  sage(alle.length && alle.every((r) => sp(r, "start", "skript") >= 140 && sp(r, "werkzeug", "skript") < 100), "8  Spur: die 150 ms liegen in „start\", nicht bei den Werkzeug-Pausen", alle.map((r) => sp(r, "start", "skript") + "/" + sp(r, "werkzeug", "skript")).join(" "));
  /* 9 */
  sage(alle.length && alle.every((r) => r.server && r.server.packMs === 0), "9  Server packt während der Messung nichts", alle.map((r) => r.server && r.server.packMs).join(" "));
  /* 10 */
  let zus = !!(j && j.zusammenfassung && j.zusammenfassung.A);
  const zeig = [];
  if (zus) for (const art of ["kalt", "warm", "pause", "sw"]) for (const m of ["bereit", "wissen", "kzKnopf", "lang.summe"]) {
    const v = fall(art).map((r) => m.split(".").reduce((o, k) => o[k], r)), s = j.zusammenfassung.A[art] && j.zusammenfassung.A[art][m];
    if (!s || s.median !== med(v) || s.n !== v.length || s.min !== Math.min(...v) || s.max !== Math.max(...v)) { zus = false; zeig.push(art + "." + m + " " + (s && s.median) + "≠" + med(v)); }
  }
  sage(zus, "10 Zusammenfassung = Median/Min/Max der Einzelläufe", zeig.join(", "));
  /* 11 */
  sage(alle.length && alle.every((r) => r.roh && r.roh.pruef && r.roh.pruef.fremd === "gescheitert" && r.roh.pruef.ms < 1000), "11 fremde Adresse scheitert sofort (kein Weg ins Internet)", alle.map((r) => r.roh && r.roh.pruef ? r.roh.pruef.fremd + " " + r.roh.pruef.ms + " ms" : "–").join(", "));

  /* 12/13 – echte Seite, je ein Lauf kalt, warm, wieder */
  console.log("\nTeil A – echte Seite (" + SEITE + ")");
  const E = werkzeug(["4g", SEITE, "--arten", "kalt,warm,wieder", "--laeufe", "1", "--fenster", "6000", "--supabase", "-", "--leise"], path.join(tmp, "e.json"));
  const EL = (E.j && E.j.laeufe) || [], e = EL.find((r) => r.art === "kalt");
  sage(!!(e && !e.abbruch), "12 echte Seite: Lauf ohne Abbruch", e ? e.abbruch || "" : E.aus.split("\n").slice(-3).join(" | "));
  const dm = EL.filter((r) => !r.abbruch && r.dma);
  sage(dm.length === 3 && dm.every((r) => r.dma.wissen > 0 && Math.abs(r.dma.wissen - r.wissen) <= 10), "12 DMA_MESS zählt den Wissen-Tipp, gleich wie das Werkzeug (± 10 ms)", dm.map((r) => r.art + " " + r.dma.wissen + "/" + r.wissen).join(", "));
  sage(dm.length === 3 && dm.every((r) => r.dma.kz > 0 && Math.abs(r.dma.kz - r.kzBild) <= 80), "12 DMA_MESS zählt den Klassenzimmer-Tipp (± 80 ms)", dm.map((r) => r.art + " " + r.dma.kz + "/" + r.kzBild).join(", "));
  sage(!!(e && e.versuche && e.versuche.join() === "1,1" && !e.fehler.length), "12 je ein Tipp, keine Seitenfehler", e ? e.versuche + " / " + e.fehler.join("; ") : "–");
  const cc = (art) => { const r = EL.find((x) => x.art === art); return r && r.spur && r.spur.codeCache; };
  const ck = cc("kalt"), cw = cc("warm"), cx = cc("wieder");
  sage(!!(ck && !ck.benutzt["app.js"] && cw && !cw.benutzt["app.js"] && cw.angelegt["app.js"] != null && cx && cx.benutzt["app.js"] > 100),
    "13 V8-Code-Cache: warm legt ihn an, wieder nimmt ihn (app.js), kalt nicht", ck ? "kalt " + JSON.stringify(ck.benutzt) + " · warm angelegt " + JSON.stringify(cw && cw.angelegt) + " · wieder " + JSON.stringify(cx && cx.benutzt) : "–");

  /* ---------- Teil B – Belege ---------- */
  console.log("\nTeil B – Belege (ohne Werkzeug)");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });
  const neu = async () => { const c = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true });
    await c.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (x) {} }); return c; };
  {
    const s = await einfach(SEITE), url = "http://127.0.0.1:" + s.address().port + "/index.html";
    const ctx = await neu(), pg = await ctx.newPage();
    await pg.goto(url);
    await pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 120000 });
    await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-knowledge"]').click());
    await pg.waitForTimeout(1500);
    const vorher = await pg.evaluate(() => ({ offen: !!document.querySelector('#view-knowledge[data-active="true"]'), n: ((window.DMA_MESS && DMA_MESS.tipp.wissen) || []).length }));
    const b = await pg.evaluate(() => { const r = document.querySelector('.tape-tab[data-target="view-knowledge"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await pg.touchscreen.tap(b.x, b.y);
    await pg.waitForTimeout(1500);
    const nachher = await pg.evaluate(() => ((window.DMA_MESS && DMA_MESS.tipp.wissen) || []).length);
    sage(vorher.offen && vorher.n === 0 && nachher === 1, "B1 el.click() öffnet Wissen, DMA_MESS zählt ihn nicht; ein Tipp wird gezählt", "el.click: offen " + vorher.offen + ", gezählt " + vorher.n + " · Tipp: gezählt " + nachher);
    await ctx.close(); s.close();
  }
  {
    const s = await einfach(P), url = "http://127.0.0.1:" + s.address().port + "/index.html?mit-sw";
    const ctx = await neu(), p1 = await ctx.newPage();
    await p1.goto(url);
    await p1.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 });
    await p1.close();
    /* Gemessen wird, wie lange die Seite selbst zum Herunterladen braucht (responseEnd − fetchStart): die Verzögerung
       der Entwicklerwerkzeuge zeigt sich in Resource Timing nicht verlässlich, die Bandbreite schon. */
    const laden = () => { const n = performance.getEntriesByType("navigation")[0]; return { t: Math.round(n.responseEnd - n.fetchStart), sw: !!navigator.serviceWorker.controller }; };
    const gross = url.replace("index.html", "gross.html");
    const pg = await ctx.newPage(), cdp = await ctx.newCDPSession(pg);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 300, downloadThroughput: 1e6 / 8, uploadThroughput: 1e6 / 8 });
    await pg.goto(gross, { waitUntil: "domcontentloaded" });
    const mit = await pg.evaluate(laden);
    const ctx2 = await neu(), pg2 = await ctx2.newPage(), c2 = await ctx2.newCDPSession(pg2);
    await c2.send("Network.enable");
    await c2.send("Network.emulateNetworkConditions", { offline: false, latency: 300, downloadThroughput: 1e6 / 8, uploadThroughput: 1e6 / 8 });
    await pg2.goto(gross.replace("?mit-sw", ""), { waitUntil: "domcontentloaded" });
    const ohne = await pg2.evaluate(laden);
    sage(mit.sw && !ohne.sw && mit.t < 300 && ohne.t >= 900, "B2 Drosselung der Entwicklerwerkzeuge (1 Mbit/s): 150-KB-Seite ohne Helfer ≥ 900 ms, über den Helfer < 300 ms", "ohne " + ohne.t + " ms · mit Helfer " + mit.t + " ms (gesteuert " + mit.sw + ")");
    await ctx.close(); await ctx2.close(); s.close();
  }
  await br.close();
  fs.rmSync(P, { recursive: true, force: true });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fehler ? "\n" + fehler + " FEHL" : "\nalles grün");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
