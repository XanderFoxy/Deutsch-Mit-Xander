#!/usr/bin/env node
/* =====================================================================
   SONDE 889 — DIE REIHE UNTER DEM HELFER (Nachbesserung Gesamt, Runde 2)
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die schnelle Performance und die Verbindung zu den
   anderen haben oberste Priorität“.

   Seit 889 lädt der Wortschatz in der Reihe (data-vocab.js ladeWoerter:
   höchstens 4 Dateien zugleich über die Leitung), damit ein Kartentipp
   unter „Lernen“ seinen Teil nicht mit 26 Dateien teilen muss. Die Weiche
   „liegt schon im Speicher → alle zugleich“ las transferSize. Durch den
   Helfer (sw.js) meldet Chromium für JEDE Antwort transferSize 0 – auch
   für eine, die er gerade über die Leitung geholt hat. Bis Runde 2 griff
   die Reihe darum fast nie, sobald der Helfer die Seite steuert (erster
   Besuch nach der Übernahme, zweiter Besuch, Helferwechsel). Alle Sonden
   davor liefen ohne Helfer. Seit Runde 2 sieht ladeWoerter unter dem
   Helfer in SEINEM Speicher nach (caches.match mit cacheName = KASTEN).

   H  nachgebauter Browser (Node: Skript-Tags, Resource Timing wie Chromium
      unter dem Helfer, navigator.serviceWorker, caches, Uhr):
      H1 Helfer, nichts in seinem Speicher, jede Antwort transferSize 0
         (auch data-vocab.js): höchstens 4 zugleich, alle 26 kommen
      H2 Helfer, alles in seinem Speicher: alle 26 zugleich (sobald der
         Speicher geantwortet hat), keine über die Leitung
      H3 Helfer, 10 von 26 im Speicher: die 10 sofort, über die Leitung nie
         mehr als 4 zugleich
      H4 Helfer, kein caches im Fenster → alle 26 zugleich (wie 888)
      H5 Helfer, caches.match scheitert → alle 26 zugleich (wie 888)
      H6 ohne Helfer begonnen, der Helfer übernimmt nach der ersten Datei
         (danach transferSize 0, workerStart > 0): die Reihe bleibt
      H7 Helfer, die ersten 4 hängen: nach 12 s die übrigen 22 (Frist)
      H8 Helfer, eilig() → die übrigen zugleich
      H9 nachgesehen wird genau unter der Adresse des Skripts (absolut, mit
         Stempel) und im Speicher KASTEN – derselbe Name wie in sw.js
   S  die echte Seite mit Helfer (Chromium, ?mit-sw, min/ wie ausgeliefert;
      der Prüfserver hält jede vokabeln/*.js WS_MS zurück, Standard 1,5 s;
      gezählt in der Seite: Wortschatz-Skripte eingefügt und noch nicht
      geladen; beim Server: Wortschatz-Antworten zugleich in Arbeit):
      S1 erster Besuch, „Lernen“ NACH der Übernahme: höchstens 4 zugleich
      S2 zweiter Besuch, Helfer steuert von Anfang an, Wortschatz nie
         geladen: höchstens 4 zugleich
      S3 „wieder“ (Wortschatz im Speicher des Helfers): keine Anfrage beim
         Server, alle zugleich (mindestens 20 gleichzeitig unterwegs);
         dazu: was das Nachsehen kostet (26 Abfragen)
      S4 erster Besuch, „Lernen“ VOR der Übernahme (sie kommt mitten im
         Laden): höchstens 4 zugleich
      S5 Helferwechsel: der Helfer von 888 (sw.js aus 4bd701b3) steuert die
         neue Seite – zweiter Besuch höchstens 4, „wieder“ alle zugleich
   K  (KLEIN 3) Ansichten über wortschatzNachziehen/wortschatzHolenFuer
      (ohne Helfer, WS_MS je Datei):
      K1 Lernen → Karte „wortstellung“: die Reihe bleibt (höchstens 4) –
         auch mit Lese-Betonung an (K1b)
      K2 Lernen → gleich „Wörterbuch“: 400 ms danach alle 26 angefordert
      K3 Wissen (Wortschatz aufgeschoben) mit Lese-Betonung an → Kompass
         holt ihn: alle 26 angefordert
      K4 Lernen → Wörterbuch im Raum (LiveChat.lage „drin“): die Reihe
         bleibt (höchstens 4)
   GP Gegenprobe – jede Zeile ist ok, wenn der Fehler AUFFÄLLT:
      data-vocab.js aus VOR (9642d82f, vor Runde 2): H1, H3, H6 rot;
      Mutante „ohne Nachsehen“ (frei nie gesetzt): H2 rot.
      S/K gegen einen Baum mit 9642d82f (WURZEL=…): S1, S2, S4, S5 zweit,
      K2, K3 rot.
   Aufruf:  node werkzeug/pruefe-889-helfer.js     (NUR=HGSK, VOR=9642d82f,
            WS_MS=1500; WURZEL=<Baum> für S/K gegen einen anderen Stand)
            Chromium nur in S und K – Läufer mit flock.
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm"), http = require("http"), os = require("os");
const { execFileSync } = require("child_process");
const HIER = path.resolve(path.join(__dirname, ".."));
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const VOR = process.env.VOR || "9642d82f", ALT_SW = process.env.ALT_SW || "4bd701b3";
const NUR = process.env.NUR || "HGSK";
const WS_MS = Number(process.env.WS_MS) || 1500;
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const lies = (f) => fs.readFileSync(path.join(WURZEL, f), "utf8");
const ausGit = (ref, f) => { try { return execFileSync("git", ["-C", HIER, "show", ref + ":" + f], { encoding: "utf8", maxBuffer: 1 << 28 }); } catch (e) { return null; } };

/* ---------- H: nachgebauter Browser mit Helfer ---------- */
function kasten(code, o) {
  o = o || {};
  const uhr = { t: 0, timer: [], id: 1 };
  const log = { start: [], fertig: [], offen: 0, max: 0, netzOffen: 0, netzMax: 0, netzN: 0, fragen: [] };
  const eintraege = [];
  let beobachter = null;
  const themen = JSON.parse(/const VOKABEL_THEMEN = (\[\[[^\n]*\]\]);/.exec(code)[1]);
  const nameVon = {}; themen.forEach(([n, d]) => { nameVon[d] = n; });
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, Promise, URL });
  ctx.setTimeout = (f, ms) => { const id = uhr.id++; uhr.timer.push({ id, f, wann: uhr.t + Math.max(0, ms || 0) }); return id; };
  ctx.clearTimeout = (id) => { uhr.timer = uhr.timer.filter((x) => x.id !== id); };
  ctx.performance = { getEntriesByType: () => eintraege.slice(), now: () => uhr.t };
  function PRT() {}
  PRT.prototype = { transferSize: 0, encodedBodySize: 0, workerStart: 0 };
  ctx.PerformanceResourceTiming = PRT;
  ctx.PerformanceObserver = function (cb) { this.cb = cb; beobachter = this; this.observe = () => {}; this.disconnect = () => { beobachter = null; }; };
  const sw = { controller: o.helfer ? {} : null };
  ctx.navigator = { serviceWorker: sw };
  const imSpeicher = (datei) => o.speicher === "alle" || (o.speicher instanceof Set && o.speicher.has(datei));
  if (o.caches !== "fehlt") {
    ctx.caches = { match(url, opt) {
      log.fragen.push({ url: String(url), cacheName: opt && opt.cacheName, t: uhr.t });
      return new Promise((ok, nein) => ctx.setTimeout(() => {
        if (o.caches === "ablehnen") return nein(new Error("SecurityError"));
        const m = /vokabeln\/([a-z0-9-]+)\.js/.exec(String(url));
        ok(m && imSpeicher(m[1]) ? { status: 200 } : undefined);
      }, o.speicherMs == null ? 3 : o.speicherMs));
    } };
  }
  /* data-vocab.js selbst: unter dem Helfer [0, voll] wie Chromium (die Gegenprüfung maß [0, 25658]) */
  const unterHelfer = () => Boolean(sw.controller);
  eintraege.push({ name: "https://x.test/min/data-vocab.js?v=1", transferSize: o.helfer ? 0 : 41000, encodedBodySize: 40000, workerStart: o.helfer ? 5 : 0 });
  const dauer = o.dauer || (() => 300);
  ctx.document = { hidden: false, baseURI: "https://x.test/", addEventListener() {}, createElement() { return {}; },
    head: { appendChild(s) {
      const datei = /vokabeln\/([a-z0-9-]+)\.js/.exec(String(s.src))[1];
      const helferJetzt = unterHelfer(), ausSpeicher = helferJetzt && imSpeicher(datei);
      log.start.push({ datei, t: uhr.t, src: String(s.src), ausSpeicher });
      log.offen++; log.max = Math.max(log.max, log.offen);
      if (!ausSpeicher) { log.netzOffen++; log.netzN++; log.netzMax = Math.max(log.netzMax, log.netzOffen); }
      const d = ausSpeicher ? 5 : dauer(datei, log.start.length - 1);
      if (d === Infinity) return;   // hängt: nie onload/onerror
      ctx.setTimeout(() => {
        ctx.DMA_VOKABELN = ctx.DMA_VOKABELN || {};
        ctx.DMA_VOKABELN[nameVon[datei]] = [{ word: "W-" + datei, de: "x", theme: nameVon[datei], level: "A1" }];
        /* Chromium: durch den Helfer transferSize 0 – ob aus seinem Speicher oder von der Leitung */
        const e = helferJetzt ? { name: "https://x.test/vokabeln/" + datei + ".js?v=1", transferSize: 0, encodedBodySize: 90000, workerStart: 7 }
          : { name: "https://x.test/vokabeln/" + datei + ".js?v=1", transferSize: 90300, encodedBodySize: 90000, workerStart: 0 };
        eintraege.push(e);
        log.offen--; if (!ausSpeicher) log.netzOffen--;
        log.fertig.push({ datei, t: uhr.t });
        if (o.uebernahmeNach != null && log.fertig.length === o.uebernahmeNach) sw.controller = {};
        s.onload && s.onload();
        if (beobachter) { const b = beobachter; ctx.setTimeout(() => { try { b.cb({ getEntries: () => [e] }); } catch (x) {} }, 100); }
      }, d);
    } } };
  ctx.window = ctx;
  vm.runInContext(code + "\n;globalThis.VocabData = VocabData;", ctx, { filename: "data-vocab.js" });
  const leeren = () => new Promise((r) => setImmediate(r));
  const vor = async (ms) => {
    const ziel = uhr.t + ms;
    for (;;) {
      await leeren(); await leeren();
      uhr.timer.sort((a, b) => a.wann - b.wann || a.id - b.id);
      const n = uhr.timer[0];
      if (!n || n.wann > ziel) break;
      uhr.timer.shift(); uhr.t = n.wann;
      try { n.f(); } catch (e) {}
    }
    uhr.t = ziel; await leeren(); await leeren();
  };
  return { ctx, log, uhr, vor, V: ctx.VocabData, themen };
}
async function hPruefen(code) {
  const r = {};
  { const k = kasten(code, { helfer: true }); let fertig = false;
    k.V.ladeWoerter().then(() => { fertig = true; });
    await k.vor(60000);
    r.H1 = { max: k.log.max, netzMax: k.log.netzMax, gestartet: k.log.start.length, da: k.V.alleThemenDa(), fertig }; }
  { const k = kasten(code, { helfer: true, speicher: "alle", dauer: () => 2000 });
    k.V.ladeWoerter();
    await k.vor(1); const sofort = k.log.start.length;
    await k.vor(20); const nachSpeicher = k.log.start.length;
    await k.vor(5000);
    r.H2 = { sofort, nachSpeicher, max: k.log.max, netz: k.log.netzN, da: k.V.alleThemenDa() }; }
  { const zehn = new Set(JSON.parse(/const VOKABEL_THEMEN = (\[\[[^\n]*\]\]);/.exec(code)[1]).slice(16).map((x) => x[1]));
    const k = kasten(code, { helfer: true, speicher: zehn, dauer: () => 2000 });
    let fertig = false;
    k.V.ladeWoerter().then(() => { fertig = true; });
    await k.vor(30);
    const ausSpeicherFrueh = k.log.start.filter((x) => x.ausSpeicher).length;
    await k.vor(60000);
    r.H3 = { ausSpeicherFrueh, netzMax: k.log.netzMax, netzN: k.log.netzN, fertig, da: k.V.alleThemenDa() }; }
  { const k = kasten(code, { helfer: true, caches: "fehlt", dauer: () => 2000 });
    k.V.ladeWoerter(); await k.vor(1);
    r.H4 = { sofort: k.log.start.length }; }
  { const k = kasten(code, { helfer: true, caches: "ablehnen", dauer: () => 2000 });
    k.V.ladeWoerter(); await k.vor(20);
    r.H5 = { nach: k.log.start.length }; }
  { const k = kasten(code, { helfer: false, uebernahmeNach: 1, dauer: () => 500 }); let fertig = false;
    k.V.ladeWoerter().then(() => { fertig = true; });
    await k.vor(60000);
    r.H6 = { max: k.log.max, gestartet: k.log.start.length, fertig, unterHelfer: k.log.start.filter((x, i) => i >= 4).length }; }
  { const k = kasten(code, { helfer: true, dauer: (d, i) => (i < 4 ? Infinity : 300) });
    k.V.ladeWoerter();
    await k.vor(11900); const vorFrist = k.log.start.length;
    await k.vor(5000);
    r.H7 = { vorFrist, nach: k.log.start.length, angekommen: k.log.fertig.length }; }
  { const k = kasten(code, { helfer: true, dauer: () => 2000 });
    k.V.ladeWoerter(); await k.vor(100);
    const vor = k.log.start.length; k.V.eilig(); await k.vor(10);
    r.H8 = { vor, nach: k.log.start.length }; }
  { const k = kasten(code, { helfer: true, speicher: "alle", dauer: () => 2000 });
    k.V.ladeWoerter(); await k.vor(50);
    const skripte = new Set(k.log.start.map((x) => new URL(x.src, "https://x.test/").href));
    r.H9 = { fragen: k.log.fragen.length, alleAdressen: k.log.fragen.length > 0 && k.log.fragen.every((f) => skripte.has(f.url)),
      namen: [...new Set(k.log.fragen.map((f) => f.cacheName))], vorErstem: k.log.fragen.length && k.log.start.length ? k.log.fragen[0].t <= k.log.start[0].t : false }; }
  return r;
}
const hUrteil = (r) => ({
  H1: r.H1.max <= 4 && r.H1.gestartet === 26 && r.H1.da && r.H1.fertig,
  H2: r.H2.nachSpeicher === 26 && r.H2.netz === 0 && r.H2.da,
  H3: r.H3.ausSpeicherFrueh === 10 && r.H3.netzMax <= 4 && r.H3.netzN === 16 && r.H3.fertig && r.H3.da,
  H4: r.H4.sofort === 26,
  H5: r.H5.nach === 26,
  H6: r.H6.max <= 4 && r.H6.gestartet === 26 && r.H6.fertig,
  H7: r.H7.vorFrist === 4 && r.H7.nach === 26 && r.H7.angekommen === 22,
  H8: r.H8.vor === 4 && r.H8.nach === 26,
});

/* ---------- S/K: Prüfserver und Chromium ---------- */
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
async function prüfserver() {
  const S = { swAlt: null, vokOffen: 0, vokMax: 0, vokN: 0 };
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    if (p === "/sw.js" && S.swAlt) { a.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" }); return a.end(S.swAlt); }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream",
      "Cache-Control": p === "/index.html" || p === "/fassung.json" || p === "/sw.js" ? "no-cache" : "max-age=600" };
    const senden = () => { a.writeHead(200, kopf); fs.createReadStream(f).pipe(a); };
    if (/^\/vokabeln\//.test(p)) {
      S.vokN++; S.vokOffen++; S.vokMax = Math.max(S.vokMax, S.vokOffen);
      let zu = false; const weg = () => { if (!zu) { zu = true; S.vokOffen--; } };
      a.on("finish", weg); a.on("close", weg);
      setTimeout(senden, WS_MS);
    } else senden();
  });
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  S.basis = "http://127.0.0.1:" + srv.address().port;
  S.zu = () => new Promise((r) => srv.close(r));
  S.neu = () => { S.vokMax = S.vokOffen; S.vokN = 0; };
  return S;
}
/* In der Seite: jedes eingefügte Wortschatz-Skript (Zeit, unter dem Helfer?) und wann es fertig war */
function seitenMesser() {
  try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {}
  const V = window.__vok = { ein: [], aus: 0, offen: 0, max: 0, vorErster: null, claim: null };
  try { navigator.serviceWorker.addEventListener("controllerchange", () => { if (V.claim == null) V.claim = performance.now(); }); } catch (e) {}
  /* fertig im Einfangen am Dokument: das läuft VOR dem onload des Skripts (data-vocab.js fügt darin schon das nächste ein) */
  const laeuft = new WeakSet();
  const f = (e) => { const n = e.target; if (!laeuft.has(n)) return; laeuft.delete(n); V.offen--; V.aus++; if (V.vorErster == null) V.vorErster = V.ein.length; };
  document.addEventListener("load", f, true); document.addEventListener("error", f, true);
  new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) {
      if (n.tagName !== "SCRIPT" || !/\/vokabeln\/[a-z0-9-]+\.js/.test(n.src || "")) continue;
      V.ein.push([Math.round(performance.now()), Boolean(navigator.serviceWorker && navigator.serviceWorker.controller)]);
      V.offen++; V.max = Math.max(V.max, V.offen); laeuft.add(n);
    }
  }).observe(document, { childList: true, subtree: true });
}
async function teilS(br) {
  console.log("\nS  DIE ECHTE SEITE MIT HELFER (Chromium, ?mit-sw, je Wortschatz-Datei " + WS_MS + " ms beim Server)   " + WURZEL + "\n");
  const srv = await prüfserver();
  const bereit = (pg) => pg.waitForFunction(() => typeof ExerciseData !== "undefined" && window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading"
    && document.querySelector('.tape-tab[data-target="view-learn"]'), null, { timeout: 60000 });
  const kontext = async () => {
    const c = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await c.addInitScript(seitenMesser);
    return c;
  };
  const besuch = async (pg, o) => {
    o = o || {};
    const pe = [];
    const fe = (e) => pe.push(String(e.message || e).slice(0, 160));
    pg.on("pageerror", fe);
    try {
      await pg.goto(srv.basis + "/index.html?mit-sw", { waitUntil: "load", timeout: 60000 });
      await bereit(pg);
      const helferBeimStart = await pg.evaluate(() => Boolean(navigator.serviceWorker.controller));
      if (o.uebernahmeAbwarten) { await pg.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 30000 }); await pg.waitForTimeout(500); }
      if (o.ohneLernen) { await pg.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 30000 }).catch(() => {}); await pg.waitForTimeout(1500); return { helferBeimStart, pe }; }
      if (!o.sofort) await pg.waitForTimeout(800);
      srv.neu();
      const helferBeimTipp = await pg.evaluate(() => Boolean(navigator.serviceWorker.controller));
      const t0 = await pg.evaluate(() => performance.now());
      await pg.click('.tape-tab[data-target="view-learn"]');
      const ganz = await pg.waitForFunction(() => typeof VocabData !== "undefined" && VocabData.alleThemenDa(), null, { timeout: WS_MS * 14 + 30000 }).then(() => true, () => false);
      const v = await pg.evaluate((t0) => { const V = window.__vok; return { ein: V.ein.length, max: V.max, vorErster: V.vorErster, claim: V.claim, erstes: V.ein.length ? V.ein[0][0] - t0 : null,
        spanne: V.ein.length ? V.ein[V.ein.length - 1][0] - V.ein[0][0] : null, unterHelfer: V.ein.filter((x) => x[1]).length, letztes: V.ein.length ? V.ein[V.ein.length - 1][0] : null, ersteZeit: V.ein.length ? V.ein[0][0] : null,
        ganzMs: Math.round(performance.now() - t0) }; }, t0);
      let nachsehen = null;
      if (o.nachsehenMessen) nachsehen = await pg.evaluate(async () => {
        const st = window.DMA_STEMPEL || {}, liste = Object.keys(st).filter((k) => /^vokabeln\/[a-z]+\.js$/.test(k) && !/teil-/.test(k));
        const adr = liste.map((k) => new URL(k + window.DMA_V(k), document.baseURI).href);
        const t = performance.now();
        const da = await Promise.all(adr.map((u) => caches.match(u, { cacheName: "dma-dateien-1" })));
        return { n: adr.length, treffer: da.filter(Boolean).length, ms: Math.round((performance.now() - t) * 10) / 10 };
      }).catch((e) => ({ fehler: String(e.message || e).slice(0, 80) }));
      return Object.assign(v, { helferBeimStart, helferBeimTipp, ganz, srvMax: srv.vokMax, srvN: srv.vokN, nachsehen, pe });
    } finally { pg.off("pageerror", fe); }
  };
  const zeile = (r) => "Seite höchstens " + r.max + " zugleich (vor der ersten fertigen " + r.vorErster + " eingefügt), Server höchstens " + r.srvMax + " zugleich, " + r.srvN
    + " Anfragen, " + r.ein + " eingefügt (" + r.unterHelfer + " unter dem Helfer), ganz " + (r.ganz ? "ja" : "NEIN") + " nach " + r.ganzMs + " ms" + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : "");
  try {
    /* S1 */
    { const c = await kontext(); try { const pg = await c.newPage();
      const r = await besuch(pg, { uebernahmeAbwarten: true });
      sage(r.helferBeimTipp && !r.helferBeimStart && r.max <= 4 && r.srvMax <= 4 && r.ein === 26 && r.srvN === 26 && r.ganz && !r.pe.length,
        "S1 erster Besuch, „Lernen“ nach der Übernahme: höchstens 4 Wortschatz-Dateien zugleich (Seite und Server), alle 26 kommen", zeile(r));
    } finally { await c.close(); } }
    /* S2, S3 */
    { const c = await kontext(); try { const pg = await c.newPage();
      await besuch(pg, { ohneLernen: true });
      const r2 = await besuch(pg, {});
      sage(r2.helferBeimStart && r2.max <= 4 && r2.srvMax <= 4 && r2.ein === 26 && r2.srvN === 26 && r2.ganz && !r2.pe.length,
        "S2 zweiter Besuch, Helfer steuert von Anfang an, Wortschatz nie geladen: höchstens 4 zugleich, alle 26 kommen", zeile(r2));
      await pg.waitForTimeout(1500);   // der Helfer legt die letzten ab
      const r3 = await besuch(pg, { nachsehenMessen: true });
      sage(r3.helferBeimStart && r3.srvN === 0 && r3.max >= 20 && r3.ein === 26 && r3.ganz && !r3.pe.length,
        "S3 „wieder“ (Wortschatz im Speicher des Helfers): keine Anfrage beim Server, alle zugleich (mindestens 20 gleichzeitig unterwegs)",
        zeile(r3) + ", vom ersten bis zum letzten Einfügen " + r3.spanne + " ms");
      const n = r3.nachsehen || {};
      sage(n.n === 26 && n.treffer === 26 && n.ms < 250, "S3 Nachsehen im Speicher: 26 Abfragen (caches.match mit cacheName) in der ruhigen Seite", JSON.stringify(n));
    } finally { await c.close(); } }
    /* S4 */
    { const c = await kontext(); try { const pg = await c.newPage();
      const r = await besuch(pg, { sofort: true });
      const mitten = r.claim != null && r.ersteZeit != null && r.claim > r.ersteZeit && r.claim < r.letztes;
      sage(mitten && !r.helferBeimTipp && r.max <= 4 && r.srvMax <= 4 && r.ein === 26 && r.ganz && !r.pe.length,
        "S4 erster Besuch, „Lernen“ vor der Übernahme (sie kommt mitten im Laden): die Reihe bleibt (höchstens 4)",
        zeile(r) + ", Übernahme " + (r.claim == null ? "NIE" : Math.round(r.claim - r.ersteZeit) + " ms nach dem ersten Einfügen") + (mitten ? "" : " – NICHT mitten im Laden, Fall nicht nachgestellt"));
    } finally { await c.close(); } }
    /* S5 */
    { const alt = ausGit(ALT_SW, "sw.js");
      if (!alt) sage(false, "S5 sw.js aus " + ALT_SW + " nicht lesbar");
      else { srv.swAlt = alt; const c = await kontext(); try { const pg = await c.newPage();
        await besuch(pg, { ohneLernen: true });
        const swText = await pg.evaluate(() => fetch("sw.js", { cache: "no-store" }).then((a) => a.text())).catch(() => "");
        const r2 = await besuch(pg, {});
        sage(swText === alt && r2.helferBeimStart && r2.max <= 4 && r2.srvMax <= 4 && r2.ein === 26 && r2.ganz && !r2.pe.length,
          "S5 Helferwechsel (Helfer aus " + ALT_SW + " steuert die neue Seite), zweiter Besuch: höchstens 4 zugleich", zeile(r2));
        await pg.waitForTimeout(1500);
        const r3 = await besuch(pg, {});
        sage(r3.helferBeimStart && r3.srvN === 0 && r3.max >= 20 && r3.ganz && !r3.pe.length,
          "S5 Helferwechsel, „wieder“: keine Anfrage beim Server, alle zugleich", zeile(r3));
      } finally { await c.close(); srv.swAlt = null; } } }
  } finally { await srv.zu(); }
}
async function teilK(br) {
  console.log("\nK  ANSICHTEN ÜBER wortschatzNachziehen (Chromium ohne Helfer, je Wortschatz-Datei " + WS_MS + " ms)   " + WURZEL + "\n");
  const srv = await prüfserver();
  const fall = async (o) => {
    const c = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await c.addInitScript(seitenMesser);
    if (o.lese) await c.addInitScript(() => { try { localStorage.setItem("dma_lese_betonung", "1"); } catch (e) {} });
    try {
      const pg = await c.newPage(); const pe = [];
      pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160)));
      await pg.goto(srv.basis + "/index.html", { waitUntil: "load", timeout: 60000 });
      await pg.waitForFunction(() => typeof ExerciseData !== "undefined" && window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading"
        && document.querySelector('.tape-tab[data-target="view-learn"]'), null, { timeout: 60000 });
      await pg.waitForTimeout(1200);
      if (o.raum) await pg.evaluate(() => { window.LiveChat.lage = () => ({ lage: "drin" }); });
      await o.tun(pg);
      await pg.waitForTimeout(400);
      const r = await pg.evaluate(() => ({ n: document.querySelectorAll('script[src*="vokabeln/"]').length, max: window.__vok.max, alle: VocabData.themenListe().length }));
      r.pe = pe;
      return r;
    } finally { await c.close(); }
  };
  const lernen = async (pg) => {
    await pg.click('.tape-tab[data-target="view-learn"]');
    await pg.waitForFunction(() => { const g = document.querySelector("#exerciseSetup .category-grid .category-card"); return g && g.offsetParent !== null; }, null, { timeout: 30000 });
  };
  const karte = async (pg) => {
    await lernen(pg);
    await pg.evaluate(() => { const e = document.querySelector('#exerciseSetup .category-card[data-cat="wortstellung"] .cat-checkbox'); e.scrollIntoView({ block: "center" }); e.click(); });
    await pg.waitForFunction(() => { const b = document.getElementById("startBtn"); return b && !b.disabled; }, null, { timeout: 30000 });
    await pg.waitForTimeout(1600);   // der geplante Start (Ruhepause bis 1,5 s) ist sicher vorbei
  };
  const woerterbuch = async (pg) => {
    await lernen(pg);
    await pg.evaluate(() => document.querySelector('#learnSubnav [data-sub="sub-dictionary"]').click());
  };
  const zeile = (r) => r.n + " von " + r.alle + " angefordert (höchstens " + r.max + " zugleich unterwegs)" + (r.pe.length ? ", Fehler: " + r.pe.join(" | ") : "");
  try {
    let r = await fall({ tun: karte });
    sage(r.alle === 26 && r.max <= 4 && r.n < 26 && !r.pe.length, "K1 Lernen → Karte „wortstellung“: die Reihe bleibt (höchstens 4 zugleich unterwegs)", zeile(r));
    r = await fall({ tun: karte, lese: true });
    sage(r.alle === 26 && r.max <= 4 && r.n < 26 && !r.pe.length, "K1b dasselbe mit Lese-Betonung an: die Reihe bleibt", zeile(r));
    r = await fall({ tun: woerterbuch });
    sage(r.alle === 26 && r.n === 26 && !r.pe.length, "K2 Lernen → gleich „Wörterbuch“: alle 26 angefordert (wortschatzEilig)", zeile(r));
    r = await fall({ lese: true, tun: async (pg) => {
      await pg.click('.tape-tab[data-target="view-knowledge"]');
      await pg.waitForFunction(() => { const a = document.getElementById("kompassArea"); return a && a.offsetParent !== null && a.textContent.length > 50; }, null, { timeout: 30000 });
    } });
    sage(r.alle === 26 && r.n === 26 && !r.pe.length, "K3 Wissen (Wortschatz aufgeschoben), Lese-Betonung an → der Kompass holt ihn: alle 26 angefordert", zeile(r));
    r = await fall({ raum: true, tun: woerterbuch });
    sage(r.alle === 26 && r.max <= 4 && r.n < 26 && !r.pe.length, "K4 Lernen → Wörterbuch im Raum (LiveChat.lage „drin“): die Reihe bleibt (höchstens 4 zugleich unterwegs)", zeile(r));
  } finally { await srv.zu(); }
}

(async () => {
  const t0 = Date.now();
  if (NUR.includes("H")) {
    console.log("\nH  DIE REIHE UNTER DEM HELFER (nachgebauter Browser)\n");
    const code = lies("data-vocab.js");
    const r = await hPruefen(code), u = hUrteil(r);
    sage(u.H1, "H1 Helfer, nichts in seinem Speicher, jede Antwort transferSize 0: höchstens 4 zugleich, alle 26 kommen", JSON.stringify(r.H1));
    sage(u.H2, "H2 Helfer, alles in seinem Speicher: alle 26 zugleich, keine über die Leitung", JSON.stringify(r.H2));
    sage(u.H3, "H3 Helfer, 10 von 26 im Speicher: die 10 sofort, über die Leitung höchstens 4 zugleich", JSON.stringify(r.H3));
    sage(u.H4, "H4 Helfer, kein caches im Fenster: alle 26 zugleich (wie 888)", JSON.stringify(r.H4));
    sage(u.H5, "H5 Helfer, caches.match scheitert: alle 26 zugleich (wie 888)", JSON.stringify(r.H5));
    sage(u.H6, "H6 ohne Helfer begonnen, Übernahme nach der ersten Datei (transferSize 0, workerStart > 0): die Reihe bleibt", JSON.stringify(r.H6));
    sage(u.H7, "H7 Helfer, die ersten 4 hängen: nach 12 s die übrigen 22 (Frist)", JSON.stringify(r.H7));
    sage(u.H8, "H8 Helfer, eilig(): die übrigen zugleich", JSON.stringify(r.H8));
    const swK = (/var KASTEN = "([^"]+)";/.exec(lies("sw.js")) || [])[1], dvK = (/const KASTEN = "([^"]+)";/.exec(code) || [])[1];
    sage(r.H9.fragen === 26 && r.H9.alleAdressen && r.H9.vorErstem && r.H9.namen.length === 1 && r.H9.namen[0] === swK && dvK === swK,
      "H9 nachgesehen unter der Adresse des Skripts (absolut, mit Stempel), vor dem ersten Skript, im Speicher KASTEN von sw.js", JSON.stringify(r.H9) + ", sw.js „" + swK + "“, data-vocab.js „" + dvK + "“");
  }
  if (NUR.includes("G")) {
    console.log("\nGP GEGENPROBE (jede Zeile ist ok, wenn der Fehler AUFFÄLLT)\n");
    const alt = ausGit(VOR, "data-vocab.js");
    if (!alt) sage(false, "GP data-vocab.js aus " + VOR + " nicht lesbar");
    else {
      const g = hUrteil(await hPruefen(alt));
      sage(!g.H1, "GP H1: data-vocab.js aus " + VOR + " (transferSize 0 unter dem Helfer = Speicher) fällt auf");
      sage(!g.H3, "GP H3: … gemischt fällt auf");
      sage(!g.H6, "GP H6: … Übernahme mitten im Laden fällt auf");
      sage(g.H2 && g.H4 && g.H5, "GP (Kontrolle): H2, H4, H5 sind dort grün (unter dem Helfer schickt es ohnehin alle zugleich; H7/H8 ohne Reihe dort sinnlos)");
    }
    const code = lies("data-vocab.js"), ohne = code.replace("if (da.length && da.every(Boolean)) frei[thema] = true;", "if (da.length && da.every(Boolean)) void 0;");
    sage(ohne !== code && !hUrteil(await hPruefen(ohne)).H2, "GP H2: Mutante ohne Nachsehen (nichts gilt als im Speicher) fällt auf");
  }
  if (NUR.includes("S") || NUR.includes("K")) {
    const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), "p889h-"));
    process.env.TMPDIR = tmp;
    const { chromium } = require("/tmp/claude-0/node_modules/playwright");
    const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
    try {
      if (NUR.includes("S")) await teilS(br).catch((e) => sage(false, "S lief nicht durch", String(e.message || e).slice(0, 200)));
      if (NUR.includes("K")) await teilK(br).catch((e) => sage(false, "K lief nicht durch", String(e.message || e).slice(0, 200)));
    } finally { await br.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  }
  console.log("\n  (" + Math.round((Date.now() - t0) / 1000) + " s)");
  console.log("\n" + (fehler ? fehler + " FEHL" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.log("FEHLER", e && e.stack || e); process.exit(2); });
