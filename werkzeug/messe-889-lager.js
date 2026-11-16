#!/usr/bin/env node
/* MISST FASSUNG 889 (Chat-Lager in Stücken) im Nachbau, verschränkt gegen einen Vergleichsbaum (888), mit A/A.
   ---------------------------------------------------------------
   Nachbau (wie die 887-Messung, ohne Server – die Lager-Wege sind dieselben): echte Seite (min/), Telefon-Ansicht
   390×844, Klassenzimmer offen (pruefSitz, 6 andere im Raum), Raum „klassenzimmer" mit 7 000 Zeilen im Lager, Profilfotos
   bei 3 von 30 Autoren (je ≈ 16 KB als data:image), CPU 4×.
     1. Vorbereitung: Verlauf anlegen (sofort gesichert) und neu laden.
     2. BETRETEN (gemessen): Klassenzimmer auf, Raum betreten wie betreten(): erst die 300 Zeilen aus dem localStorage
        einmischen und zeichnen, dann den ganzen Verlauf aus dem Lager (pruefVerlaufAusLager = chatAusLager, dabei
        „Verlauf laden" einzeln gemessen) einmischen und zeichnen.
     3. FLUT (gemessen): 50 Zeilen in 50 s (1 Zeile/s) über den echten Empfang (pruefEmpfangen); die Sicherung im
        Leerlauf läuft wie im Feld (≥ 20 s Abstand, die erste ~20 s nach dem Betreten), also 2–3 Mal.
   Gemessen über die Chromium-Spur (Kategorie toplevel): jede Aufgabe des Hauptfadens; je Abschnitt die längste Aufgabe,
   die Blockade (Summe über 50 ms) und wie viel der Zeit belegt war; dazu in der Seite die Schritte der Sicherung (Leerlauf-
   und IndexedDB-Rückrufe aus livechat.js) und die langen Bilder (LoAF ≥ 50 ms).
   Aufruf: node werkzeug/messe-889-lager.js [Runden=3]   ZEILEN=<Verlauf> (Vorgabe 7 000)   VERGLEICH=<Baum> (Vorgabe /tmp/claude-0/v888)
           AA=1: beide Seiten derselbe Baum (A/A). Ergebnis als JSON nach ERGEBNIS (Vorgabe: $TMPDIR/messe-889.json). */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const VGL = path.resolve(process.env.VERGLEICH || "/tmp/claude-0/v888");
const RUNDEN = Number(process.argv[2] || 3);
const ZEILEN = Number(process.env.ZEILEN || 7000);
const ERGEBNIS = process.env.ERGEBNIS || path.join(os.tmpdir(), "messe-889.json");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => { const b = a.filter((x) => x != null).slice().sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };

function server(wurzel) {
  return new Promise((ok) => {
    const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(wurzel, p);
      if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0, () => ok(srv));
  });
}
/* vor dem Seitencode: Schritte der Sicherung (Rückrufe aus livechat.js), lange Bilder */
function messen() {
  window.__m = { an: false, schritte: [], loaf: [] };
  const vonChat = () => /livechat/.test(new Error().stack || "");
  const ric = window.requestIdleCallback;
  if (ric) window.requestIdleCallback = function (f, o) {
    const chat = vonChat();
    return ric.call(window, function (d) { const t = performance.now(); try { return f(d); } finally { if (chat && window.__m.an) window.__m.schritte.push(["leerlauf", t, performance.now() - t]); } }, o);
  };
  const huellen = (proto, namen) => namen.forEach((p) => {
    const d = Object.getOwnPropertyDescriptor(proto, p);
    if (!d || !d.set) return;
    Object.defineProperty(proto, p, { configurable: true, enumerable: d.enumerable, get: d.get, set(f) {
      if (typeof f !== "function" || !vonChat()) return d.set.call(this, f);
      d.set.call(this, function (e) { const t = performance.now(); try { return f.call(this, e); } finally { if (window.__m.an) window.__m.schritte.push(["idb-" + p, t, performance.now() - t]); } });
    } });
  });
  huellen(IDBRequest.prototype, ["onsuccess", "onerror"]);
  huellen(IDBTransaction.prototype, ["oncomplete", "onabort", "onerror"]);
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.loaf.push({ start: e.startTime, dauer: e.duration, block: e.blockingDuration,
      skripte: (e.scripts || []).map((s) => [Math.round(s.duration), s.invoker, (s.sourceURL || "").split("/").pop().split("?")[0], s.sourceFunctionName || ""]).slice(0, 4) }); })
      .observe({ type: "long-animation-frame", buffered: true });
  } catch (e) {}
  try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
}
async function oeffnen(pg) {
  await pg.evaluate(() => {
    const leute = {};
    for (let i = 1; i <= 6; i++) leute["p" + i] = { id: "p" + i, name: "Schüler" + i, seit: 6000 + i, gesehen: 9e15, buehne: i < 3, bild: "" };
    LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Xander", seit: 1000, zuruecksetzen: true, leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
  });
}
async function lauf(br, wurzel, name) {
  const srv = await server(wurzel);
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75, serviceWorkers: "block" });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await ctx.addInitScript(messen);
  const pg = await ctx.newPage();
  const fehler = []; pg.on("pageerror", (e) => fehler.push(String(e.message || e).slice(0, 120)));
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const bereit = async () => { await pg.waitForFunction(() => window.LiveChat && LiveChat.pruefSitz && window.DMA_PRUEF, null, { timeout: 60000 }); await schlaf(4000); };
  await pg.goto(adresse, { waitUntil: "domcontentloaded" }); await bereit();
  /* 1. Vorbereitung */
  await oeffnen(pg);
  await pg.evaluate(async (ZEILEN) => {
    const foto = (seed) => { let s = "data:image/png;base64,iVBORw0KGgo"; let x = seed * 7919; const z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      while (s.length < 16000) { x = (x * 1103515245 + 12345) % 2147483648; s += z[x % 64]; } return s; };
    const fotos = [foto(1), foto(2), foto(3)];
    LiveChat.pruefRaum("klassenzimmer"); await LiveChat.pruefVerlaufAusLager("klassenzimmer");
    const l = [], t0 = Date.now() - ZEILEN * 30000;
    for (let i = 0; i < ZEILEN; i++) { const a = i % 30; l.push({ id: "z" + i, von: "p" + a, name: "Schüler" + a, text: "Hallo zusammen, Zeile " + i + (i % 7 ? "" : " lang ".repeat(20)), art: "text", zeit: t0 + i * 30000, bild: a < 3 ? fotos[a] : "", eigen: false }); }   // eigen wie im Feld (empfangene Zeilen tragen es)
    LiveChat.pruefVerlaufSetzen(l);
    await new Promise((f) => setTimeout(f, 1500));
  }, ZEILEN);
  await pg.reload({ waitUntil: "domcontentloaded" }); await bereit();
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await schlaf(1500);
  await br.startTracing(pg, { categories: ["toplevel", "blink.user_timing"] });
  /* 2. Betreten */
  await oeffnen(pg);
  const betreten = await pg.evaluate(async () => {
    const bild = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    window.__m.an = true;
    performance.mark("m889:betreten");
    const raum = "klassenzimmer";
    LiveChat.pruefRaum(raum); LiveChat.pruefLagerVergessen();
    const kurz = LiveChat.pruefVerlaufAusSpeicher(raum);
    LiveChat.pruefVerlaufFensterAuf(); LiveChat.pruefEmpfangen({ art: "verlauf", von: "geraet", name: "Gerät", zeilen: kurz }); LiveChat.pruefVerlaufFensterZu();
    window.DMA_PRUEF.neuZeichnen();
    await bild();
    performance.mark("m889:laden");
    const t = performance.now();
    const ausLager = await LiveChat.pruefVerlaufAusLager(raum);
    const laden = performance.now() - t;
    performance.mark("m889:geladen");
    LiveChat.pruefVerlaufFensterAuf(); LiveChat.pruefEmpfangen({ art: "verlauf", von: "lager", name: "Lager", zeilen: ausLager }); LiveChat.pruefVerlaufFensterZu();
    window.DMA_PRUEF.neuZeichnen();
    await bild(); await bild();
    performance.mark("m889:betreten-ende");
    return { kurz: kurz.length, lager: ausLager.length, zeilen: LiveChat.lage().nachrichten.length, laden };
  });
  await schlaf(1000);
  /* 3. Flut: 50 Zeilen in 50 s */
  await pg.evaluate(() => performance.mark("m889:flut"));
  for (let i = 0; i < 50; i++) {
    await pg.evaluate((i) => { const a = (i * 7) % 30; LiveChat.pruefEmpfangen({ art: "text", von: "p" + (1 + (i % 6)), name: "Schüler" + (1 + (i % 6)), text: "Flut " + i + " – ein kurzer Satz im Livestream.", id: "f" + Date.now() + "-" + i, zeit: Date.now(), chatArt: "text", kf: 1 }); }, i);
    await schlaf(1000);
  }
  await schlaf(3000);
  await pg.evaluate(() => performance.mark("m889:flut-ende"));
  const seite = await pg.evaluate(() => ({ schritte: window.__m.schritte, loaf: window.__m.loaf, stand: LiveChat.pruefSichernStand(), lager: LiveChat.pruefLager ? LiveChat.pruefLager("klassenzimmer").letzte : null,
    marken: performance.getEntriesByType("mark").filter((m) => /^m889:/.test(m.name)).map((m) => [m.name.slice(5), m.startTime]) }));
  const spur = JSON.parse(String(await br.stopTracing()));
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 }).catch(() => {});
  await ctx.close(); srv.close();
  return auswerten(name, spur, seite, betreten, fehler);
}
function auswerten(name, spur, seite, betreten, fehler) {
  const ev = spur.traceEvents || spur;
  const marken = {};
  ev.forEach((e) => { if (e.cat && e.cat.indexOf("blink.user_timing") >= 0 && /^m889:/.test(e.name || "")) marken[e.name.slice(5)] = { ts: e.ts, pid: e.pid, tid: e.tid }; });
  const pid = marken.betreten && marken.betreten.pid;
  let tid = null;
  ev.forEach((e) => { if (e.ph === "M" && e.name === "thread_name" && e.pid === pid && e.args && e.args.name === "CrRendererMain") tid = e.tid; });
  let aufgaben = ev.filter((e) => e.ph === "X" && e.pid === pid && e.tid === tid && /RunTask/.test(e.name || "") && e.dur != null).sort((a, b) => a.ts - b.ts);
  const oben = []; let bis = -1;   // nur äußere Aufgaben
  aufgaben.forEach((e) => { if (e.ts >= bis) { oben.push(e); bis = e.ts + e.dur; } });
  /* Uhr der Seite (performance.now) ↔ Spur: über die Marke „betreten" */
  const abschnitt = (von, bisTs) => {
    const a = oben.filter((e) => e.ts >= von && e.ts < bisTs).map((e) => e.dur / 1000);
    const dauer = (bisTs - von) / 1000;
    return { laengste: a.length ? Math.max(...a) : 0, blockade: a.reduce((s, d) => s + Math.max(0, d - 50), 0), belegt: dauer > 0 ? a.reduce((s, d) => s + d, 0) / dauer : 0,
             ueber16: a.filter((d) => d > 16).length, ueber50: a.filter((d) => d > 50).length, aufgaben: a.length };
  };
  const m = (k) => marken[k] && marken[k].ts;
  const betretenA = abschnitt(m("betreten"), m("betreten-ende") + 1000000);
  const ladenA = abschnitt(m("laden"), m("geladen") + 1);
  const flutA = abschnitt(m("flut"), m("flut-ende"));
  /* Die Rückrufe der Sicherung allein (Seitenuhr) sehen nicht, was danach in derselben Aufgabe als Mikroaufgabe läuft –
     888 legt den ganzen Text in einem .then nach dem Leerlauf-Rückruf ins Lager. Darum je Schritt die GANZE Aufgabe aus
     der Spur, in der er lag (Seitenuhr → Spur über die Marke „betreten"). */
  const seitenMarke = (seite.marken || []).find((x) => x[0] === "betreten");
  const versatz = seitenMarke && m("betreten") ? m("betreten") - seitenMarke[1] * 1000 : null;   // µs
  const aufgabeUm = (t) => { const tt = t * 1000 + versatz; let lo = 0, hi = oben.length - 1, f = null;
    while (lo <= hi) { const mi = (lo + hi) >> 1; if (oben[mi].ts <= tt) { f = oben[mi]; lo = mi + 1; } else hi = mi - 1; }
    return f && f.ts + f.dur >= tt ? f : null; };
  const ganz = new Map();
  if (versatz != null) seite.schritte.forEach((s) => { const a = aufgabeUm(s[1] + s[2] / 2); if (a) ganz.set(a, a.dur / 1000); });
  const ganzeAufgaben = [...ganz.values()];
  const sicherung = seite.schritte.map((s) => s[2]);
  const r = { name, betreten: Object.assign(betretenA, { zeilen: betreten.zeilen, lager: betreten.lager }), laden: Object.assign(ladenA, { ms: betreten.laden }), flut: flutA,
              sicherung: { schritte: sicherung.length, laengster: sicherung.length ? Math.max(...sicherung) : 0, summe: sicherung.reduce((a, b) => a + b, 0), ueber16: sicherung.filter((d) => d > 16).length,
                           aufgaben: ganzeAufgaben.length, laengsteAufgabe: ganzeAufgaben.length ? Math.max(...ganzeAufgaben) : null, aufgabenSumme: ganzeAufgaben.reduce((a, b) => a + b, 0),
                           aufgabenUeber16: ganzeAufgaben.filter((d) => d > 16).length, aufgabenUeber50: ganzeAufgaben.filter((d) => d > 50).length },
              loafLeerlauf: seite.loaf.filter((l) => l.dauer >= 50 && l.skripte.some((x) => /IdleRequestCallback/.test(String(x[1])))).map((l) => Math.round(l.dauer)),
              loaf: seite.loaf.filter((l) => l.dauer >= 50).map((l) => [Math.round(l.dauer), Math.round(l.block), l.skripte.map((s) => s.join(" ")).join(" | ")]).slice(0, 40),
              stand: seite.stand ? { zahl: seite.stand.zeiten.length, zeichen: seite.stand.zeichen } : null, lager: seite.lager, fehler };
  return r;
}
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
  const aa = process.env.AA === "1";
  const baeume = [["neu", WURZEL], [aa ? "neu2" : "vgl", aa ? WURZEL : VGL]];
  const alle = [];
  for (let r = 0; r < RUNDEN; r++) {
    for (const [name, b] of (r % 2 ? baeume.slice().reverse() : baeume)) {
      const t = Date.now();
      const e = await lauf(br, b, name);
      e.runde = r; e.sek = Math.round((Date.now() - t) / 1000);
      alle.push(e);
      console.log(name.padEnd(5) + " R" + r + "  betreten längste " + e.betreten.laengste.toFixed(0) + " ms, Blockade " + e.betreten.blockade.toFixed(0) + "  | laden " + e.laden.ms.toFixed(0) + " ms (längste " + e.laden.laengste.toFixed(0) + ")"
        + "  | Flut längste " + e.flut.laengste.toFixed(0) + " ms, Blockade " + e.flut.blockade.toFixed(0) + ", belegt " + (100 * e.flut.belegt).toFixed(1) + " %, >16 " + e.flut.ueber16 + ", >50 " + e.flut.ueber50
        + "  | Sicherung: " + e.sicherung.schritte + " Rückrufe (längster " + e.sicherung.laengster.toFixed(1) + " ms), als ganze Aufgaben: " + e.sicherung.aufgaben + ", längste " + (e.sicherung.laengsteAufgabe == null ? "?" : e.sicherung.laengsteAufgabe.toFixed(1)) + " ms, >16 " + e.sicherung.aufgabenUeber16 + ", >50 " + e.sicherung.aufgabenUeber50 + ", zusammen " + e.sicherung.aufgabenSumme.toFixed(0) + " ms; LoAF Leerlauf ≥ 50: " + JSON.stringify(e.loafLeerlauf) + (e.fehler.length ? "  FEHLER " + e.fehler.join(" | ") : ""));
      fs.writeFileSync(ERGEBNIS, JSON.stringify(alle, null, 1));
    }
  }
  await br.close();
  const zus = {};
  for (const n of [...new Set(alle.map((e) => e.name))]) {
    const l = alle.filter((e) => e.name === n);
    zus[n] = { runden: l.length, betretenLaengste: med(l.map((e) => e.betreten.laengste)), betretenBlockade: med(l.map((e) => e.betreten.blockade)), laden: med(l.map((e) => e.laden.ms)), ladenLaengste: med(l.map((e) => e.laden.laengste)),
               flutLaengste: med(l.map((e) => e.flut.laengste)), flutBlockade: med(l.map((e) => e.flut.blockade)), flutBelegt: med(l.map((e) => e.flut.belegt)), flutUeber50: med(l.map((e) => e.flut.ueber50)), flutUeber16: med(l.map((e) => e.flut.ueber16)),
               sicherungLaengster: med(l.map((e) => e.sicherung.laengster)), sicherungSumme: med(l.map((e) => e.sicherung.summe)),
               sicherungLaengsteAufgabe: med(l.map((e) => e.sicherung.laengsteAufgabe)), sicherungAufgabenSumme: med(l.map((e) => e.sicherung.aufgabenSumme)),
               sicherungUeber16: med(l.map((e) => e.sicherung.aufgabenUeber16)), sicherungUeber50: med(l.map((e) => e.sicherung.aufgabenUeber50)) };
  }
  console.log("\nMedian je Baum: " + JSON.stringify(zus, (k, v) => typeof v === "number" ? Math.round(v * 10) / 10 : v, 1));
  fs.writeFileSync(ERGEBNIS, JSON.stringify({ laeufe: alle, median: zus }, null, 1));
})().catch((e) => { console.error(e); process.exit(2); });
