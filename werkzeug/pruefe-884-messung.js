#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — MESSUNG BEI ECHTEN NUTZERN (Fassung 884)
   ---------------------------------------------------------------------
   XANDER (Funk 255): „… niemals abstürzt und alles optimiert ist".
   Zugesagt (Funk 258, Punkt 5): echte Messung bei echten Nutzern.
   index.html schreibt von Anfang an mit (DMA_MESS), messung.js kommt
   4 s nach dem Laden und sendet in spiel_diagnose („mess-start",
   „mess-fehler", „mess-raum"). Die Sonde ersetzt den Server durch eine
   Attrappe (Backend.zugang().rpc) und schaltet mit dma-mess-pruef =
   „schnell" die kurzen Zeiten ein (Start 0,3 s, Fenster 1 s, tot 3 s).
   Geprüft:
     A  der Start bleibt unverändert: messung.js erst nach load + 3 s,
        vor DOMContentLoaded keine neue Anfrage, Mitschreiber < 500 µs,
        messung.js < 5 ms und ohne Langläufer, kein DOM; mit ALT=<alter
        Stand> zusätzlich FCP/DCL neu gegen alt (Rechner 4× gebremst,
        PAARE=16 verschränkte Paare, paarweise ausgewertet: rot nur, wenn
        neu nachweisbar langsamer ist als 20 ms bzw. 3 % – Mittel der
        Paar-Unterschiede minus zwei Standardfehler über der Grenze. Ein
        Median-Vergleich von 9 Läufen schlug bei dieser Streuung zufällig
        an; genau ist die direkte Messung des Mitschreibers: Median < 2 ms)
     B  genau eine Startzeile mit den Zeiten der Seite, klein, ohne Namen
     C  echte Tipps Wissen → Klassenzimmer werden gemessen
     D  Fehler: gezählt, gereinigt (auch Ausschnitte in echten Meldungen
        von JSON.parse und querySelector), mit Ort, gebündelt, nichts
        verschluckt, ResizeObserver-Schleifen zählen nicht
     E  Klassenzimmer: Langläufer je Fenster, LoAF, „zäh" erst ab 300/200 ms
     F  Absturz-Indiz: dieselbe Registerkarte („weg"/„hinten"), fremde nach
        der Frist („weg"), sauber geschlossen und lebende Seiten: nichts
     G  Abbruch beim Laden („laden"); eine neue Fassung zählt nicht
     H  ohne Anmeldung kein Aufruf, die Zeile wartet in der Kiste und geht
        mit „gast: 1" raus; eine Kisten-Zeile von Konto A nie unter Konto B
     I  sparsam: Tagesdeckel 1 (alter Server) bzw. 8, „genug für heute"
     J  Prüfläufe ohne dma-mess-pruef senden nichts
     K  (nachgebessert) die Raumzeile beim Weggehen: Neuladen und Schließen
        mitten im Raum, Tab-Wechsel mit Teilzeile, im Hintergrund
        weggeräumt, kurzer Aufenthalt – jede Raumzeile kommt genau einmal,
        nie eine leere, und sie frisst nicht die Startzeile der nächsten
        Seite. Die Attrappe geht wie supabase-js erst nach einem
        asynchronen Schritt raus (beim Entladen also nie mehr); keepalive-
        Aufrufe landen beim Sonden-Server (/__supa).
   Gegenprobe: WURZEL=<Stand vor 884> → B bis K rot, ohne Absturz;
   WURZEL=<messung.js vor der Nachbesserung> → K, I und die Reinigung rot.
   Aufruf: node werkzeug/pruefe-884-messung.js
           ALT=/pfad/zum/alten/stand [PAARE=16] node werkzeug/pruefe-884-messung.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const ALT = process.env.ALT ? path.resolve(process.env.ALT) : "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };
setTimeout(() => { console.log("\nZeitlimit erreicht."); process.exit(2); }, 15 * 60 * 1000).unref();

/* Der Server: schreibt mit, kann app.js einmal zurückhalten, fassung.json fälschen, liefert die Fehler-Datei – und
   nimmt die keepalive-Aufrufe von messung.js an (/__supa/rest/v1/rpc/…, Antwort auf Wunsch verzögert). */
function server(wurzel) {
  const s = { anfragen: [], appZurueck: 0, fassung: "", supa: [], supaWarte: 0, supaAntwort: { ok: true, mess: 12 } }, cache = new Map();
  s.srv = http.createServer(async (q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    s.anfragen.push({ p, t: Date.now() });
    if (p.startsWith("/__supa/")) {
      let roh = ""; for await (const c of q) roh += c;
      if (q.method === "POST") { try { const b = JSON.parse(roh); s.supa.push({ p, art: b.p_art, d: b.p_daten, auth: q.headers.authorization || "", t: Date.now() }); } catch (e) {} }
      if (s.supaWarte) await schlaf(s.supaWarte);
      a.writeHead(200, { "Content-Type": "application/json" });
      return a.end(JSON.stringify(s.supaAntwort));
    }
    if (p === "/__sonde-fehler.js") {
      a.writeHead(200, { "Content-Type": "text/javascript" });
      return a.end('window.__wirf = function () {\n  throw new Error("Kaputt bei test@example.com 1234567");\n};\n'
        + 'window.__wirfAnders = function (i) {\n  throw new TypeError("Anders " + "abcdefghijklmnop".charAt(i));\n};\n');
    }
    if (p === "/fassung.json" && s.fassung) { a.writeHead(200, { "Content-Type": "application/json" }); return a.end(JSON.stringify({ fassung: s.fassung })); }
    if (s.appZurueck && /^\/(min\/)?app\.js$/.test(p)) { const w = s.appZurueck; s.appZurueck = 0; await schlaf(w); }
    const f = path.join(wurzel, p);
    /* Dateien einmal lesen, dann aus dem Speicher (weniger Streuung in den Zeitmessungen) */
    if (!cache.has(f)) cache.set(f, f.startsWith(wurzel) && fs.existsSync(f) && !fs.statSync(f).isDirectory() ? fs.readFileSync(f) : null);
    const inhalt = cache.get(f);
    if (!inhalt) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); a.end(inhalt);
  }).listen(0);
  return new Promise((r) => s.srv.on("listening", () => { s.url = "http://127.0.0.1:" + s.srv.address().port + "/index.html"; r(s); }));
}

(async () => {
  const S = await server(WURZEL);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const alleZeilen = [];   /* alle „mess-*"-Zeilen der ganzen Sonde (für B: keine Namen) */

  async function fenster(o) {
    o = o || {};
    const ctx = await (o.br || br).newContext({ viewport: { width: 393, height: 800 } });
    await ctx.addInitScript(([pruef, neuGeladen, domHaken]) => {
      try {
        localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus");
        if (pruef) localStorage.setItem("dma-mess-pruef", pruef);
        if (neuGeladen) sessionStorage.setItem("dma-neu-geladen", "x");
      } catch (e) {}
      if (domHaken) {
        /* Was tut messung.js beim Ausführen am DOM? Sobald es DMA_MESS.da setzt, läuft ein Beobachter; der erste
           Mikroschritt danach (direkt nach dem Skript) liest ab, was sich bis dahin verändert hat. */
        let m;
        Object.defineProperty(window, "DMA_MESS", { configurable: true, get() { return m; }, set(v) {
          m = v; let da;
          Object.defineProperty(v, "da", { configurable: true, enumerable: true, get() { return da; }, set(x) {
            da = x;
            const mo = new MutationObserver(() => {});
            mo.observe(document, { childList: true, subtree: true, attributes: true, characterData: true });
            Promise.resolve().then(() => { window.__messDom = mo.takeRecords().length; mo.disconnect(); });
          } });
        } });
      }
    }, [o.pruef === undefined ? "schnell" : o.pruef, o.neuGeladen !== false, Boolean(o.domHaken)]);
    ctx.__fehler = [];
    if (!o.br) await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    ctx.on("page", (pg) => beobachten(ctx, pg));
    return ctx;
  }
  function beobachten(ctx, pg) {
    pg.__pageerror = [];
    pg.on("pageerror", (e) => { const t = String(e.message || e).split("\n")[0]; pg.__pageerror.push(t); if (!pg.__erwarteFehler) ctx.__fehler.push(t); });
    pg.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text()) && !pg.__erwarteFehler) ctx.__fehler.push("console: " + m.text().slice(0, 160)); });
  }
  /* Server-Attrappe: Backend.zugang().rpc schreibt mit; angemeldet (true = Konto „u1", oder eine Kennung) oder nicht;
     Antwort wählbar („fehler" = Fehler des Servers). Standard ist der neue Server ({ ok, mess: 12 }) – der alte erlaubt
     nur 1 Zeile am Tag (I prüft das eigens). Wie supabase-js geht der Aufruf erst nach einem asynchronen Schritt raus
     (dort: Marke holen) – beim Entladen der Seite also nie mehr. Mitgeschrieben wird auch in localStorage
     („__sonde-rpc"), damit die nächste Seite es lesen kann. o.marke: auth.getSession liefert eine Marke, und
     SUPABASE_CONFIG.url zeigt auf den Sonden-Server – dort landen die keepalive-Aufrufe (S.supa). o.srv: das Gerät
     kennt den neuen Server schon (wie ab dem zweiten Tag). */
  const NEU = { ok: true, mess: 12 };
  async function attrappe(pg, login, antwort, o) {
    o = o || {};
    await pg.evaluate(([login, antwort, marke, srv]) => {
      window.__berichte = []; window.__login = login === true ? "u1" : login; window.__antwort = antwort;
      const be = typeof Backend !== "undefined" ? Backend : window.Backend;
      be.zugang = () => ({
        rpc: (n, a) => new Promise((fertig) => setTimeout(() => {
          const z = { n, art: a && a.p_art, d: a && a.p_daten !== undefined ? JSON.parse(JSON.stringify(a.p_daten)) : null };
          window.__berichte.push(z);
          try { const l = JSON.parse(localStorage.getItem("__sonde-rpc") || "[]"); l.push(z); localStorage.setItem("__sonde-rpc", JSON.stringify(l)); } catch (e) {}
          fertig(window.__antwort === "fehler" ? { data: null, error: { message: "kaputt" } } : { data: window.__antwort, error: null });
        }, window.__rpcWarte || 0)),
        auth: marke ? { getSession: () => Promise.resolve({ data: { session: { access_token: "sonde-marke", expires_at: Math.floor(Date.now() / 1000) + 3600 } } }) } : undefined
      });
      be.currentUser = () => (window.__login ? { id: window.__login } : null);
      if (marke) window.SUPABASE_CONFIG = Object.assign({}, window.SUPABASE_CONFIG, { url: location.origin + "/__supa" });
      if (srv) {
        const d = new Date(), tag = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        let t = null; try { t = JSON.parse(localStorage.getItem("dma-mess-tag") || "null"); } catch (e) {}
        localStorage.setItem("dma-mess-tag", JSON.stringify(Object.assign(t && t.tag === tag ? t : { tag, n: 0 }, { srv: 1 })));
      }
    }, [login, antwort || NEU, Boolean(o.marke), Boolean(o.srv)]);
  }
  async function laden(pg, url, login, antwort, o) {
    await pg.goto(url || S.url, { waitUntil: "load", timeout: 60000 });
    await attrappe(pg, login === undefined ? true : login, antwort, o);
  }
  /* Gibt es gar keine Messung (Gegenprobe mit dem alten Stand), wird ab dem ersten Mal nur noch kurz gewartet. */
  let KEINE = false;
  const frist = (ms) => (KEINE ? 1500 : ms);
  const messDa = async (pg, ms) => {
    const ok = await pg.waitForFunction(() => window.DMA_MESS && window.DMA_MESS.da && window.DMA_MESS.stand, null, { timeout: frist(ms || 15000), polling: 50 }).then(() => true, () => false);
    if (!ok && !(await pg.evaluate(() => Boolean(window.DMA_MESS)).catch(() => false))) KEINE = true;
    return ok;
  };
  /* bis die Startzeile gebaut ist und alles, was messung.js senden wollte, bei der Attrappe angekommen ist */
  const startRaus = (pg) => pg.waitForFunction(() => {
    if (!(window.DMA_MESS && DMA_MESS.stand)) return false;
    const s = DMA_MESS.stand();
    return s.startRaus && (window.__berichte || []).filter((b) => /^mess-/.test(b.art || "")).length >= s.gesendet.length;
  }, null, { timeout: frist(15000), polling: 50 }).then(() => schlaf(150)).then(() => true, () => false);
  const zu = (x) => Promise.race([x.close().catch(() => {}), schlaf(5000)]);
  const berichte = async (pg) => { try { const b = await pg.evaluate(() => window.__berichte || []); return b.filter((x) => /^mess-/.test(x.art || "")); } catch (e) { return []; } };
  const stand = (pg) => pg.evaluate(() => window.DMA_MESS && DMA_MESS.stand ? DMA_MESS.stand() : null).catch(() => null);
  const merken = (zeilen) => { zeilen.forEach((z) => alleZeilen.push(z)); return zeilen; };
  async function absturz(ctx, pg) {
    const cdp = await ctx.newCDPSession(pg);
    await Promise.race([cdp.send("Page.crash").catch(() => {}), schlaf(1500)]);
    await schlaf(300);
    await pg.close().catch(() => {});
  }
  const buchEintrag = (pg, s) => pg.waitForFunction((s) => { try { const b = JSON.parse(localStorage.getItem("dma-mess-lauf") || "{}"); return Object.values(b).some((e) => !s || e.s === s); } catch (e) { return false; } }, s || "", { timeout: frist(15000), polling: 50 }).then(() => true, () => false);
  const tabVon = (pg) => pg.evaluate(() => sessionStorage.getItem("dma-mess-tab")).catch(() => "");

  /* ================= A + B + C ================= */
  console.log("\nA/B/C) START, STARTZEILE, TIPPS\n");
  {
    const ctx = await fenster({ domHaken: true });
    const pg = await ctx.newPage();
    const ab = S.anfragen.length;
    await laden(pg);
    /* C: echte Tipps (isTrusted), solange messung.js noch nicht da ist – sie landen in der Startzeile */
    let eigenW = null, eigenK = null;
    try {
      let t = Date.now();
      await pg.click('.tape-tab[data-target="view-knowledge"]', { timeout: 5000 });
      await pg.waitForFunction(() => document.querySelector('#view-knowledge[data-active="true"]'), null, { timeout: 10000, polling: "raf" });
      eigenW = Date.now() - t;
      t = Date.now();
      await pg.click('#knowledgeSubnav [data-sub="sub-livechat"]', { timeout: 5000 });
      await pg.waitForFunction(() => document.querySelector('#sub-livechat[data-active="true"] #livechatArea > *'), null, { timeout: 15000, polling: "raf" });
      eigenK = Date.now() - t;
    } catch (e) { console.log("   (Tipp: " + String(e.message).split("\n")[0] + ")"); }
    const da = await messDa(pg);
    sage(da, "messung.js ist geladen (DMA_MESS.da)");
    await startRaus(pg);
    const zeilen = merken(await berichte(pg));
    const st = await stand(pg);
    const zeit = await pg.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] || {};
      const r = performance.getEntriesByType("resource").filter((x) => /messung\.js/.test(x.name)).map((x) => Math.round(x.startTime));
      const vorDcl = performance.getEntriesByType("resource").filter((x) => x.startTime < nav.domContentLoadedEventEnd).map((x) => x.name.replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, ""));
      return { load: nav.loadEventEnd, dcl: nav.domContentLoadedEventEnd, messung: r, vorDcl, kosten: window.DMA_MESS && DMA_MESS.kosten, dom: window.__messDom };
    }).catch(() => ({}));
    /* LoAF: kein langes Bild, in dem messung.js lief */
    const loafMessung = await pg.evaluate(() => new Promise((r) => {
      const typen = PerformanceObserver.supportedEntryTypes || [];
      if (typen.indexOf("long-animation-frame") < 0) return r(null);
      const raus = []; const o = new PerformanceObserver((l) => l.getEntries().forEach((e) => (e.scripts || []).forEach((s) => { if (/messung\.js/.test(s.sourceURL || "") && s.duration >= 50) raus.push(Math.round(s.duration)); })));
      o.observe({ type: "long-animation-frame", buffered: true });
      setTimeout(() => { o.disconnect(); r(raus); }, 200);
    })).catch(() => null);
    const qMessung = S.anfragen.slice(ab).filter((x) => /messung\.js$/.test(x.p));
    sage(zeit.messung && zeit.messung.length === 1 && zeit.messung[0] >= zeit.load + 3000 && qMessung.length === 1,
      "A: messung.js wird genau einmal und erst nach load + 3 s angefragt", "load " + Math.round(zeit.load) + " ms, messung.js ab " + JSON.stringify(zeit.messung));
    sage(zeit.vorDcl && !zeit.vorDcl.some((n) => /messung/.test(n)), "A: vor DOMContentLoaded keine Anfrage für die Messung", (zeit.vorDcl || []).length + " Dateien vor DCL");
    sage(zeit.kosten != null && zeit.kosten < 500, "A: der Mitschreiber in index.html kostet < 500 µs", zeit.kosten + " µs");
    const s0 = zeilen.find((z) => z.art === "mess-start"), d0 = s0 && s0.d;
    sage(d0 && d0.kosten && d0.kosten[1] < 5, "A: messung.js braucht beim Einrichten < 5 ms", d0 && JSON.stringify(d0.kosten));
    sage(Array.isArray(loafMessung) && loafMessung.length === 0, "A: kein langes Bild (LoAF ≥ 50 ms), in dem messung.js lief", JSON.stringify(loafMessung));
    sage(zeit.dom === 0, "A: messung.js verändert beim Ausführen kein DOM", "Änderungen: " + zeit.dom);
    const quelle = fs.existsSync(path.join(WURZEL, "messung.js")) ? fs.readFileSync(path.join(WURZEL, "messung.js"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "") : "";
    sage(quelle && !/createElement|innerHTML|appendChild|insertAdjacent|console\./.test(quelle), "A: messung.js baut nichts ins DOM und schreibt nie in die Konsole (Quelle)");
    sage(!ctx.__fehler.length, "A: keine Seitenfehler und keine Konsolenfehler", ctx.__fehler.slice(0, 3).join(" | "));

    /* B */
    const starts = zeilen.filter((z) => z.art === "mess-start");
    sage(starts.length === 1, "B: genau eine Startzeile „mess-start“", starts.length + " Zeilen");
    console.log("   " + JSON.stringify(d0 || null).slice(0, 900));
    sage(d0 && Math.abs(d0.t.bereit - zeit.dcl) <= 1 && d0.t.fcp > 0 && d0.kb > 0 && d0.n > 0 && d0.ua && d0.f && d0.bau,
      "B: t.bereit = domContentLoadedEventEnd (±1 ms); fcp, kb, n, ua, f, bau gesetzt", d0 && ("bereit " + d0.t.bereit + " / " + Math.round(zeit.dcl) + ", fcp " + d0.t.fcp + ", " + d0.kb + " KB, " + d0.n + " Dateien, bau " + d0.bau));
    sage(d0 && JSON.stringify(d0).length < 6000, "B: die Zeile bleibt klein (< 6000 Zeichen)", d0 && JSON.stringify(d0).length + " Zeichen");
    sage(st && st.buch && st.buch[st.pid] && st.buch[st.pid].zu === 0, "B: das Laufbuch hat den eigenen Eintrag (offen)");

    /* C */
    const tw = d0 && d0.tipp && d0.tipp.wissen && d0.tipp.wissen[0], tk = d0 && d0.tipp && d0.tipp.kz && d0.tipp.kz[0];
    sage(tw && tw[1] > 0 && eigenW != null && tw[1] <= eigenW + 150, "C: Tipp „Wissen“ gemessen (bis das Bild steht)", tw ? tw[1] + " ms (Sonde selbst " + eigenW + " ms)" : "fehlt");
    sage(tk && tk[1] > 0 && eigenK != null && tk[1] <= eigenK + 150, "C: Tipp „Klassenzimmer“ gemessen", tk ? tk[1] + " ms (Sonde selbst " + eigenK + " ms)" : "fehlt");
    await zu(ctx);
  }

  /* ---- J läuft ab hier nebenher (normale Zeiten: die Startzeile wäre erst 20 s nach messung.js fällig) ---- */
  const ctxJ = await fenster({ pruef: "" });
  const pgJ = await ctxJ.newPage();
  const jLos = (async () => { try { await laden(pgJ); } catch (e) {} })();

  /* ================= A: Vergleich mit dem alten Stand ================= */
  if (ALT) {
    const PAARE = Math.max(4, Number(process.env.PAARE) || 16);
    console.log("\nA) ERSTES BILD UND „BEREIT“ – NEU GEGEN ALT (Rechner 4× gebremst, " + PAARE + " verschränkte Paare)\n");
    const SA = await server(ALT);
    const lauf = async (url) => {
      const ctx = await fenster({ pruef: "" });
      const pg = await ctx.newPage();
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await pg.goto(url, { waitUntil: "load", timeout: 90000 });
      const w = await pg.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        return { fcp: (performance.getEntriesByName("first-contentful-paint")[0] || {}).startTime, dcl: nav.domContentLoadedEventEnd, kosten: window.DMA_MESS ? DMA_MESS.kosten : null,
          vorDcl: performance.getEntriesByType("resource").filter((x) => x.startTime < nav.domContentLoadedEventEnd).map((x) => x.name.replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, "")).sort() };
      });
      await zu(ctx);
      return w;
    };
    const neu = [], alt = [];
    await lauf(S.url); await lauf(SA.url);   /* warmlaufen */
    for (let i = 0; i < PAARE; i++) {
      if (i % 2) { const a = await lauf(SA.url); const n = await lauf(S.url); alt.push(a); neu.push(n); }
      else { const n = await lauf(S.url); const a = await lauf(SA.url); neu.push(n); alt.push(a); }
    }
    /* Paarweise: jeder Lauf „neu" hat seinen Partner „alt" direkt davor oder danach (Reihenfolge wechselt), so fällt
       die Drift der Maschine heraus. Einseitig (neu tut nur mehr, nicht weniger): rot nur, wenn neu NACHWEISBAR
       langsamer ist als die Grenze – Mittel der Unterschiede minus zwei Standardfehler über 20 ms bzw. 3 %. */
    const paar = (k) => {
      const d = neu.map((x, i) => x[k] - alt[i][k]), m = d.reduce((s, x) => s + x, 0) / d.length;
      const sd = Math.sqrt(d.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, d.length - 1));
      return { m, se: sd / Math.sqrt(d.length), med: median(d) };
    };
    const med = (a, k) => Math.round(median(a.map((x) => x[k])));
    const grenze = (k) => Math.max(20, 0.03 * med(alt, k));
    console.log("   FCP neu " + neu.map((x) => Math.round(x.fcp)).join("/") + "  alt " + alt.map((x) => Math.round(x.fcp)).join("/"));
    console.log("   DCL neu " + neu.map((x) => Math.round(x.dcl)).join("/") + "  alt " + alt.map((x) => Math.round(x.dcl)).join("/"));
    [["fcp", "erstes Bild (FCP)"], ["dcl", "bereit (DOMContentLoaded)"]].forEach(([k, name]) => {
      const p = paar(k), g = grenze(k);
      sage(p.m - 2 * p.se <= g, "A: " + name + " neu nicht nachweisbar langsamer als alt (paarweise)",
        "Median " + med(neu, k) + " gegen " + med(alt, k) + " ms; je Paar " + (p.m >= 0 ? "+" : "") + Math.round(p.m) + " ± " + Math.round(p.se) +
        " ms (Mittel ± Standardfehler), Median " + (p.med >= 0 ? "+" : "") + Math.round(p.med) + " ms; Grenze " + Math.round(g) + " ms");
    });
    const kMed = median(neu.map((x) => x.kosten));
    sage(kMed < 2000, "A: der Mitschreiber kostet auch 4× gebremst wenig (Median < 2 ms)", neu.map((x) => x.kosten).join("/") + " µs");
    sage(JSON.stringify(neu[0].vorDcl) === JSON.stringify(alt[0].vorDcl), "A: vor DOMContentLoaded dieselben Dateien wie vorher", neu[0].vorDcl.length + " / " + alt[0].vorDcl.length);
    SA.srv.close();
  }

  /* ================= D ================= */
  console.log("\nD) FEHLER\n");
  {
    const ctx = await fenster();
    const pg = await ctx.newPage();
    await laden(pg);
    const da = (await messDa(pg)) && (await startRaus(pg));
    pg.__erwarteFehler = true;
    const vorher = pg.__pageerror.length;
    await pg.addScriptTag({ url: "/__sonde-fehler.js" }).catch(() => {});
    await pg.evaluate(() => {
      for (let i = 0; i < 50; i++) setTimeout(window.__wirf, 0);
      Promise.reject(new Error("abgelehnt"));
      for (let i = 0; i < 12; i++) setTimeout(() => window.__wirfAnders(i), 5);
      /* ResizeObserver-Schleife: einmal echt, einmal als Ereignis */
      const d = document.createElement("div"); d.style.cssText = "position:absolute;left:-9999px;width:10px;height:10px"; document.body.appendChild(d);
      const ro = new ResizeObserver(() => { d.style.width = (d.offsetWidth + 1) + "px"; }); ro.observe(d);
      setTimeout(() => { ro.disconnect(); d.remove(); }, 300);
      window.dispatchEvent(new ErrorEvent("error", { message: "ResizeObserver loop completed with undelivered notifications." }));
    }).catch(() => {});
    await schlaf(2500);
    let zeilen = await berichte(pg);
    const f1 = zeilen.filter((z) => z.art === "mess-fehler");
    const sd = zeilen.find((z) => z.art === "mess-start"), vorStart = sd ? sd.d.fehler.length : 0;
    const d1 = f1[0] && f1[0].d;
    console.log("   " + JSON.stringify(d1 || null).slice(0, 700));
    const e50 = d1 && d1.fehler.find((e) => e[0] === 50);
    sage(da && f1.length === 1, "D: eine Zeile „mess-fehler“ für alle Fehler danach", f1.length + " Zeilen");
    sage(e50 && /‹mail›/.test(e50[2]) && /‹zahl›/.test(e50[2]) && !/example|1234567/.test(JSON.stringify(d1)), "D: derselbe Fehler 50× ist ein Eintrag mit n = 50, gereinigt", e50 && JSON.stringify(e50));
    sage(e50 && /^__sonde-fehler\.js:\d+:\d+$/.test(e50[3]), "D: Ort als „Datei:Zeile:Spalte“", e50 && e50[3]);
    sage(d1 && d1.fehler.some((e) => e[1] === "versprechen" && /abgelehnt/.test(e[2])), "D: das abgelehnte Versprechen ist dabei");
    sage(d1 && vorStart + d1.fehler.length === 8 && d1.fehlerMehr >= 4, "D: höchstens 8 Einträge je Seite (Startzeile + diese), der Rest wird nur gezählt",
      d1 && (vorStart + " in der Startzeile + " + d1.fehler.length + " hier, fehlerMehr " + d1.fehlerMehr));
    sage(pg.__pageerror.length - vorher >= 62, "D: die Seite selbst meldet die Fehler weiter (nichts verschluckt)", (pg.__pageerror.length - vorher) + " Seitenfehler");
    const st = await stand(pg);
    sage(st && !Object.keys(st.fehler).some((k) => /ResizeObserver/.test(k)), "D: ResizeObserver-Schleifen zählen nicht");
    /* Chrome hängt bei JSON.parse und ungültigen Selektoren einen Ausschnitt der Eingabe an – echte Meldungen */
    const echt = await pg.evaluate(() => {
      const raus = [];
      try { JSON.parse("Hallo Zuzana Testperson"); } catch (e) { raus.push(e.message); }
      try { JSON.parse('{"a":1,"name":Zuzana Testperson}'); } catch (e) { raus.push(e.message); }
      try { document.querySelector("[data-name=Zuzana Testperson]"); } catch (e) { raus.push(e.message); }
      return raus.map((m) => [m, DMA_MESS.stand().sauber(m)]);
    }).catch(() => []);
    sage(echt.length === 3 && echt.every(([roh, s]) => /Zuz/.test(roh) && !/Zuz|Testp/.test(s)), "D: Ausschnitte in echten Browser-Meldungen (JSON.parse, querySelector) werden entfernt",
      echt.map((x) => x[1]).join(" | "));
    /* derselbe Fehler noch einmal: kein neuer Schlüssel → keine zweite Zeile */
    await pg.evaluate(() => setTimeout(window.__wirf, 0)).catch(() => {});
    await schlaf(4000);
    zeilen = merken(await berichte(pg));
    sage(zeilen.filter((z) => z.art === "mess-fehler").length === 1, "D: derselbe Fehler später ergibt keine zweite Zeile");
    await zu(ctx);
  }

  /* ================= E ================= */
  console.log("\nE) KLASSENZIMMER\n");
  {
    const ctx = await fenster();
    const pg = await ctx.newPage();
    await laden(pg);
    const da = await messDa(pg);
    /* melden() auslösen, ohne eine Leitung aufzubauen: ein Bild einer Person kommt an */
    const melde = (n) => pg.evaluate((n) => window.LiveChat.pruefEmpfangen({ art: "bild-voll", von: "p" + n, name: "P", bild: "data:image/png;base64,AA" + n }), n).catch(() => {});
    async function aufenthalt(blocke, n) {
      await pg.evaluate(() => window.LiveChat.pruefSitz({ lage: "verbindet", ichId: "ich", ichName: "Zuzana Testperson", seit: 1000, zuruecksetzen: true, leute: {} })).catch(() => {});
      await melde(n);
      await schlaf(120);
      await pg.evaluate(() => window.LiveChat.pruefSitz({ lage: "drin" })).catch(() => {});
      await melde(n + 1);
      const r = await stand(pg);
      const ab = r && r.raumRoh && r.raumRoh.ab;
      for (const [um, ms] of blocke) {
        await pg.evaluate(([ab, um, ms]) => new Promise((fertig) => {
          const warte = () => { if (performance.now() < ab + um) return setTimeout(warte, 5); const t = performance.now(); while (performance.now() - t < ms) {} fertig(); };
          warte();
        }), [ab, um, ms]).catch(() => {});
      }
      await schlaf(400);
      await pg.evaluate(() => window.LiveChat.pruefSitz({ lage: "aus" })).catch(() => {});
      await melde(n + 2);
      await schlaf(600);
      return ab;
    }
    const ab1 = await aufenthalt([[150, 180], [1250, 180]], 1);
    sage(da && ab1 > 0, "E: „drin“ kommt an (der Zuhörer aus index.html greift, raum.ab gesetzt)", "ab " + Math.round(ab1 || 0) + " ms");
    let zeilen = await berichte(pg);
    const r1 = zeilen.filter((z) => z.art === "mess-raum")[0], d1 = r1 && r1.d;
    console.log("   " + JSON.stringify(d1 || null).slice(0, 700));
    const f = (d1 && d1.fenster) || [];
    sage(f.filter((w) => w[1] >= 170).length === 2 && f.find((w) => w[0] === 0) && f.find((w) => w[0] === 1), "E: zwei Fenster mit je ≥ 170 ms Langläufer", JSON.stringify(f));
    sage(d1 && d1.ges[2] >= 170 && d1.ges[0] >= 2, "E: Gesamt: Anzahl ≥ 2, längster ≥ 170 ms", d1 && JSON.stringify(d1.ges));
    sage(d1 && d1.loaf && d1.loaf.length > 0 && d1.loaf[0][0] >= 170, "E: die längsten Bilder (LoAF) stehen drin", d1 && JSON.stringify(d1.loaf));
    sage(d1 && d1.zaeh === 0, "E: 180 ms je Fenster ist noch nicht „zäh“", d1 && "zaeh " + d1.zaeh);
    sage(d1 && d1.drin >= 100 && d1.uhr === 0, "E: Betreten bis drin gemessen, echte Langläufer (keine Ersatzuhr)", d1 && ("drin " + d1.drin + " ms"));
    await aufenthalt([[150, 350]], 10);
    zeilen = merken(await berichte(pg));
    const r2 = zeilen.filter((z) => z.art === "mess-raum")[1], d2 = r2 && r2.d;
    sage(d2 && d2.zaeh === 1, "E: 350 ms in einem Fenster ist „zäh“", d2 && ("zaeh " + d2.zaeh + " " + JSON.stringify(d2.fenster)));
    const alles = JSON.stringify(zeilen);
    sage(zeilen.length >= 3 && !/Zuzana|Testperson/.test(alles) && !/"(ichName|raumName|nachrichten|raum)":/.test(alles), "B: kein Name, kein Raumname, keine Nachrichten in den Zeilen");
    sage(!ctx.__fehler.length, "E: keine Seitenfehler", ctx.__fehler.slice(0, 3).join(" | "));
    await zu(ctx);
  }

  {
    /* Raum betreten und verlassen, BEVOR messung.js da ist (Rückkehr gleich nach dem Laden): der Puffer aus index.html
       wird nachgespielt – eine Raumzeile, „drinAb" in der Startzeile, kein kaputter Laufbuch-Eintrag. */
    const ctx = await fenster();
    const pg = await ctx.newPage();
    await laden(pg);
    const vorMessung = await pg.evaluate(async () => {
      const melde = (n) => window.LiveChat.pruefEmpfangen({ art: "bild-voll", von: "q" + n, name: "Q", bild: "data:image/png;base64,BB" + n });
      window.LiveChat.pruefSitz({ lage: "verbindet", ichId: "ich", ichName: "Zuzana Testperson", seit: 1000, zuruecksetzen: true, leute: {} }); melde(1);
      await new Promise((r) => setTimeout(r, 150));
      window.LiveChat.pruefSitz({ lage: "drin" }); melde(2);
      await new Promise((r) => setTimeout(r, 300));
      window.LiveChat.pruefSitz({ lage: "aus" }); melde(3);
      return { da: Boolean(window.DMA_MESS.da), puffer: window.DMA_MESS.lg.length };
    }).catch(() => ({}));
    await messDa(pg); await startRaus(pg);
    const z = merken(await berichte(pg)), st = await stand(pg);
    const r = z.find((x) => x.art === "mess-raum"), s0 = z.find((x) => x.art === "mess-start");
    sage(!vorMessung.da && vorMessung.puffer === 3 && r && r.d.drin >= 100 && s0 && s0.d.t.drinAb > 0,
      "E: Raum vor messung.js betreten/verlassen → nachgespielt (Raumzeile, drinAb in der Startzeile)", JSON.stringify({ vorMessung, drin: r && r.d.drin, drinAb: s0 && s0.d.t.drinAb }));
    sage(st && !Object.keys(st.buch).some((k) => !/^[a-z0-9]{6}$/.test(k)) && Object.values(st.buch).every((e) => e.tab), "E: das Laufbuch bleibt sauber (keine Kennung „undefined“)", st && Object.keys(st.buch).join(","));
    await zu(ctx);
  }

  /* ================= F ================= */
  console.log("\nF) ABSTURZ-INDIZ\n");
  async function nachher(ctx, tab) {
    const pg = await ctx.newPage();
    if (tab) await pg.addInitScript((t) => { try { sessionStorage.setItem("dma-mess-tab", t); } catch (e) {} }, tab);
    await laden(pg);
    await messDa(pg);
    await startRaus(pg);
    const z = merken(await berichte(pg)).find((x) => x.art === "mess-start");
    return { pg, d: z && z.d };
  }
  {
    /* F1: dieselbe Registerkarte stürzt ab (sichtbar) und wird neu geladen */
    const ctx = await fenster();
    const p1 = await ctx.newPage();
    await laden(p1);
    const ok = (await messDa(p1)) && (await buchEintrag(p1));
    const tab = await tabVon(p1);
    await absturz(ctx, p1);
    const { pg, d } = await nachher(ctx, tab);
    const v = d && d.vorher && d.vorher[0];
    sage(ok && v && v.ende === "weg" && v.eigen === 1 && v.dauer >= 0, "F: dieselbe Registerkarte nach Absturz (sichtbar) → „weg“", JSON.stringify(d && d.vorher));
    await zu(pg); await zu(ctx);
  }
  {
    /* F2: im Hintergrund weggeräumt */
    const ctx = await fenster();
    const p1 = await ctx.newPage();
    await laden(p1);
    let ok = await messDa(p1);
    await p1.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); }).catch(() => {});
    ok = ok && (await buchEintrag(p1, "h"));
    const tab = await tabVon(p1);
    await absturz(ctx, p1);
    const { pg, d } = await nachher(ctx, tab);
    const v = d && d.vorher && d.vorher[0];
    sage(ok && v && v.ende === "hinten", "F: dieselbe Registerkarte, vorher im Hintergrund → „hinten“", JSON.stringify(d && d.vorher));
    await zu(pg); await zu(ctx);
  }
  {
    /* F3: eine fremde Registerkarte ist abgestürzt; nach der Frist (tot) zählt sie */
    const ctx = await fenster();
    const p1 = await ctx.newPage();
    await laden(p1);
    const ok = (await messDa(p1)) && (await buchEintrag(p1));
    await absturz(ctx, p1);
    await schlaf(3500);
    const { pg, d } = await nachher(ctx, "");
    const v = d && d.vorher && d.vorher[0];
    sage(ok && v && v.ende === "weg" && v.eigen === 0, "F: fremde Registerkarte, länger als die Frist still → „weg“", JSON.stringify(d && d.vorher));
    await zu(pg); await zu(ctx);
  }
  {
    /* F4: sauber geschlossen */
    const ctx = await fenster();
    const p1 = await ctx.newPage();
    await laden(p1);
    const ok = (await messDa(p1)) && (await buchEintrag(p1));
    await p1.close().catch(() => {});
    const { pg, d } = await nachher(ctx, "");
    sage(ok && d && d.vorher.length === 0, "F: sauber geschlossen → kein „vorher“", JSON.stringify(d && d.vorher));
    await zu(pg); await zu(ctx);
  }
  {
    /* F5: eine fremde Seite lebt noch – im Hintergrund, schreibt also nicht mehr; sie antwortet über den Kanal */
    const ctx = await fenster();
    const p1 = await ctx.newPage();
    await laden(p1);
    let ok = await messDa(p1);
    await p1.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); }).catch(() => {});
    ok = ok && (await buchEintrag(p1, "h"));
    await schlaf(3500);
    const { pg, d } = await nachher(ctx, "");
    const st = await stand(p1);
    sage(ok && d && d.vorher.length === 0 && st && st.buch[st.pid], "F: lebende fremde Seite (Hintergrund) → kein „vorher“, ihr Eintrag bleibt", JSON.stringify(d && d.vorher));
    await zu(pg); await zu(p1); await zu(ctx);
  }

  /* ================= G ================= */
  console.log("\nG) ABBRUCH BEIM LADEN\n");
  {
    const ctx = await fenster();
    const p1 = await ctx.newPage();
    S.appZurueck = 3000;
    await p1.goto(S.url, { waitUntil: "commit" });
    await schlaf(700);
    const vorDcl = await p1.evaluate(() => !(window.DMA_MESS && DMA_MESS.dcl)).catch(() => false);
    await p1.goto("about:blank");
    await schlaf(2600);
    const { pg, d } = await nachher(ctx, "");
    const v = d && d.vorher && d.vorher.find((x) => x.ende === "laden");
    sage(vorDcl && v && v.ms > 0, "G: weggegangen vor DOMContentLoaded → „laden“", JSON.stringify(d && d.vorher));
    await zu(pg); await zu(p1); await zu(ctx);
  }
  {
    /* neue Fassung über fassung.json: die Seite lädt sich selbst neu (location.replace) – kein Abbruch */
    const ctx = await fenster({ neuGeladen: false });
    const p1 = await ctx.newPage();
    S.fassung = "999"; S.appZurueck = 3000;
    await p1.goto(S.url, { waitUntil: "commit" });
    await p1.waitForURL(/[?&]f=999/, { timeout: 10000 }).catch(() => {});
    const ersetzt = /[?&]f=999/.test(p1.url());
    await p1.waitForLoadState("load").catch(() => {});
    await attrappe(p1, true);
    await messDa(p1); await startRaus(p1);
    const z = merken(await berichte(p1)).find((x) => x.art === "mess-start");
    S.fassung = ""; S.appZurueck = 0;
    sage(ersetzt && z && !z.d.vorher.some((x) => x.ende === "laden"), "G: neue Fassung (fassung.json → location.replace) zählt nicht als Abbruch", JSON.stringify(z && z.d.vorher));
    await zu(ctx);
  }

  /* ================= H ================= */
  console.log("\nH) OHNE ANMELDUNG\n");
  {
    const ctx = await fenster();
    const pg = await ctx.newPage();
    await laden(pg, null, false);
    await messDa(pg);
    await pg.waitForFunction(() => DMA_MESS.stand().kiste.length > 0, null, { timeout: 10000, polling: 100 }).catch(() => {});
    const roh = await pg.evaluate(() => window.__berichte.length).catch(() => -1);
    const st = await stand(pg);
    sage(roh === 0 && st && st.kiste.length === 1 && st.kiste[0].a === "mess-start", "H: ohne Anmeldung kein Aufruf – die Startzeile liegt in der Kiste", "Aufrufe " + roh + ", Kiste " + (st ? st.kiste.length : "?"));
    const bereit1 = st && st.kiste[0] && st.kiste[0].d.t.bereit;
    await pg.reload({ waitUntil: "load" });
    /* srv: das Gerät kennt den neuen Server schon – sonst ginge am ersten Tag vor der ersten Antwort nur 1 Zeile raus */
    await attrappe(pg, true, NEU, { srv: true });
    await messDa(pg); await startRaus(pg);
    await schlaf(300);
    const z = merken(await berichte(pg)).filter((x) => x.art === "mess-start");
    const ausKiste = z.filter((x) => x.d.alt != null);
    sage(ausKiste.length === 1 && ausKiste[0].d.t.bereit === bereit1 && z.length === 2, "H: nach dem Anmelden kommt die Zeile aus der Kiste genau einmal (dazu die neue)", z.map((x) => (x.d.alt != null ? "Kiste" : "neu") + " " + x.d.t.bereit).join(", "));
    sage(ausKiste.length === 1 && ausKiste[0].d.gast === 1 && z.filter((x) => x.d.gast).length === 1, "H: die Zeile aus der Gast-Zeit trägt „gast: 1“ (wem sie gehört, ist nicht sicher), die neue nicht");
    const st2 = await stand(pg);
    sage(st2 && st2.kiste.length === 0, "H: die Kiste ist danach leer");
    await zu(ctx);
  }
  {
    /* geteiltes Gerät: eine Zeile, die unter Konto A in die Kiste kam (Server-Fehler), geht nie unter Konto B raus */
    const ctx = await fenster();
    const pg = await ctx.newPage();
    await laden(pg, null, "konto-a", "fehler");
    await messDa(pg);
    await pg.waitForFunction(() => DMA_MESS.stand().kiste.length > 0, null, { timeout: frist(10000), polling: 100 }).catch(() => {});
    const k1 = ((await stand(pg)) || {}).kiste || [];
    await pg.reload({ waitUntil: "load" });
    await attrappe(pg, "konto-b", NEU, { srv: true });
    await messDa(pg); await startRaus(pg);
    await schlaf(300);
    const z = merken(await berichte(pg)).filter((x) => x.art === "mess-start"), st = await stand(pg);
    sage(k1.length === 1 && k1[0].u && z.length === 1 && z[0].d.alt == null && st && st.kiste.length === 0,
      "H: eine Kisten-Zeile von Konto A geht nicht unter Konto B raus (verworfen)", "Kiste vorher " + k1.length + ", danach " + (st ? st.kiste.length : "?") + "; Startzeilen " + z.map((x) => (x.d.alt != null ? "Kiste" : "neu")).join(","));
    await zu(ctx);
  }

  /* ================= I ================= */
  console.log("\nI) SPARSAM\n");
  async function neuLaden(n, antwort) {
    const ctx = await fenster();
    /* feste Uhr (läuft weiter): der Tagesdeckel hängt am Kalendertag – kein Mitternachtswechsel mitten in der Prüfung */
    await ctx.clock.install({ time: new Date("2026-10-03T10:00:00") }); await ctx.clock.resume();
    const pg = await ctx.newPage();
    let alle = 0, tag = null;
    for (let i = 0; i < n; i++) {
      if (i === 0) await laden(pg, null, true, antwort); else { await pg.reload({ waitUntil: "load" }); await attrappe(pg, true, antwort); }
      await messDa(pg); await startRaus(pg);
      alle += (await berichte(pg)).length;
      tag = (await stand(pg) || {}).tag;
    }
    await zu(ctx);
    return { alle, tag };
  }
  {
    const a = await neuLaden(5, { ok: true });
    sage(a.alle === 1, "I: alter Server (zählt mit den Leitungs-Zeilen zusammen): höchstens 1 Zeile am Tag", a.alle + " Zeilen bei 5 Neuladungen, " + JSON.stringify(a.tag));
    const b = await neuLaden(15, { ok: true, mess: 12 });
    sage(b.alle <= 8 && b.alle >= 8, "I: neuer Server (antwortet mit „mess“): höchstens 8 Zeilen am Tag", b.alle + " Zeilen bei 15 Neuladungen, " + JSON.stringify(b.tag));
    const c = await neuLaden(3, { ok: false, grund: "genug für heute" });
    sage(c.alle === 1 && c.tag && c.tag.n >= 8, "I: „genug für heute“ vom Server stoppt das Senden für den Tag", c.alle + " Zeile(n), " + JSON.stringify(c.tag));
  }

  /* ================= K ================= */
  console.log("\nK) RAUMZEILE BEIM WEGGEHEN (nachgebessert)\n");
  /* Die Prüfung fand: wer ≥ 2 min im Raum war und dann schloss oder neu lud, verlor die Raumzeile (sie wartete auf eine
     Ruhepause, die beim Entladen nie kommt), und die nächste Seite schickte stattdessen eine leere Zeile, die den
     Tagesplatz der Startzeile fraß. Hier: Schnellmodus, Teilzeile ab 2 s im Raum. */
  async function raumRein(pg, n) {
    await pg.evaluate((n) => { LiveChat.pruefSitz({ lage: "verbindet", ichId: "ich", ichName: "Zuzana Testperson", seit: 1000, zuruecksetzen: true, leute: {} });
      LiveChat.pruefEmpfangen({ art: "bild-voll", von: "k" + n, name: "K", bild: "data:image/png;base64,KK" + n }); }, n).catch(() => {});
    await schlaf(120);
    await pg.evaluate((n) => { LiveChat.pruefSitz({ lage: "drin" }); LiveChat.pruefEmpfangen({ art: "bild-voll", von: "k" + (n + 1), name: "K", bild: "data:image/png;base64,KK" + (n + 1) }); }, n).catch(() => {});
  }
  const blockiere = (pg, ms) => pg.evaluate((ms) => new Promise((f) => setTimeout(() => { const t = performance.now(); while (performance.now() - t < ms) {} f(); }, 10)), ms).catch(() => {});
  const zweiLanglaeufer = async (pg) => { await blockiere(pg, 220); await schlaf(1100); await blockiere(pg, 260); await schlaf(1200); };
  const verstecken = (pg, h) => pg.evaluate((h) => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (h ? "hidden" : "visible") }); document.dispatchEvent(new Event("visibilitychange")); }, h).catch(() => {});
  const rpcAlle = (pg) => pg.evaluate(() => JSON.parse(localStorage.getItem("__sonde-rpc") || "[]")).then((l) => l.filter((x) => /^mess-/.test(x.art || "")), () => []);
  const hatMarke = (pg) => pg.waitForFunction(() => DMA_MESS.stand().marke, null, { timeout: frist(5000), polling: 50 }).then(() => true, () => false);
  const kurz = (z) => z.map((x) => x.art.replace("mess-", "") + (x.art === "mess-raum" ? "(" + [x.d.grund, "teil" + x.d.teil, "folge" + x.d.folge, x.d.spaet ? "spaet" : "", "dauer" + x.d.dauer, "ges" + JSON.stringify(x.d.ges)].filter(Boolean).join(" ") + ")" : "")).join(", ");
  const nieLeer = (raeume) => raeume.every((x) => x.d && x.d.ges && x.d.ges[0] >= 1);
  /* Ein eigener Browser OHNE Playwright-Umleitung (ctx.route): die verschluckt keepalive-Aufrufe einer Seite, die gerade
     geht (Versuch: beim Navigieren kamen mit Umleitung 3 von 11 an, ohne 11 von 11; beim Schließen 12/12 bzw. 12/12).
     Fremde Adressen sperrt hier die Namensauflösung. */
  const brK = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"] });
  const fensterK = () => fenster({ br: brK });
  {
    /* K1: Neuladen mitten im Raum (≥ Teilzeit), mit Marke → keepalive */
    S.supa = [];
    const ctx = await fensterK();
    const pg = await ctx.newPage();
    await laden(pg, null, true, NEU, { marke: true });
    const da = (await messDa(pg)) && (await startRaus(pg));
    await raumRein(pg, 1);
    const mk = await hatMarke(pg);
    await zweiLanglaeufer(pg);
    await pg.reload({ waitUntil: "load" });
    await attrappe(pg, true, NEU);
    await messDa(pg); await startRaus(pg); await schlaf(400);
    const rpc = await rpcAlle(pg), ka = S.supa.filter((x) => x.art === "mess-raum"), raeume = ka.concat(rpc.filter((x) => x.art === "mess-raum"));
    console.log("   keepalive: " + kurz(S.supa) + "   |  rpc: " + kurz(rpc));
    sage(da && mk && raeume.length === 1 && ka.length === 1 && ka[0].d.ges[0] >= 2 && ka[0].auth === "Bearer sonde-marke",
      "K: Neuladen mitten im Raum → die Raumzeile geht mit keepalive raus, genau einmal, mit beiden Langläufern", ka[0] && ("grund " + ka[0].d.grund + ", ges " + JSON.stringify(ka[0].d.ges)));
    sage(rpc.filter((x) => x.art === "mess-start").length === 2 && nieLeer(raeume), "K: … keine leere Raumzeile, und die Startzeile der nächsten Seite kommt auch");
    await zu(ctx);
  }
  {
    /* K2: Schließen mitten im Raum, OHNE Marke → nichts auf gut Glück beim Entladen; die nächste Seite schickt die
       Zeile genau einmal nach (in Playwright laufen nach dem Schließen sogar noch Zeitgeber – ein Aufruf nach pagehide
       könnte also ankommen UND nachgeschickt werden; genau das darf nicht passieren) */
    const ctx = await fensterK();
    const p1 = await ctx.newPage();
    await laden(p1, null, true, NEU);
    const da = (await messDa(p1)) && (await startRaus(p1));
    await raumRein(p1, 1);
    await zweiLanglaeufer(p1);
    await p1.close({ runBeforeUnload: false }).catch(() => {});
    await schlaf(300);
    const p2 = await ctx.newPage();
    await laden(p2, null, true, NEU);
    await messDa(p2); await startRaus(p2); await schlaf(400);
    const rpc = await rpcAlle(p2), raeume = rpc.filter((x) => x.art === "mess-raum");
    console.log("   rpc: " + kurz(rpc));
    sage(da && raeume.length === 1 && raeume[0].d.spaet === 1 && raeume[0].d.ges[0] >= 2,
      "K: Schließen mitten im Raum ohne Marke → die nächste Seite schickt die Raumzeile nach, genau einmal, mit den Langläufern");
    sage(rpc.filter((x) => x.art === "mess-start").length === 2 && nieLeer(raeume), "K: … keine leere Raumzeile, beide Startzeilen da");
    await zu(p2); await zu(ctx);
  }
  {
    /* K3: Tab-Wechsel (Hintergrund) → Teilzeile, zurück, ein Langläufer, „aus" → Folgezeile nur mit der Zeit seitdem */
    const ctx = await fensterK();
    const pg = await ctx.newPage();
    await laden(pg, null, true, NEU);
    await messDa(pg); await startRaus(pg);
    await raumRein(pg, 1);
    await zweiLanglaeufer(pg);
    await verstecken(pg, true); await schlaf(400);
    const mitte = await stand(pg);
    await verstecken(pg, false);
    await blockiere(pg, 210); await schlaf(400);
    await pg.evaluate(() => { LiveChat.pruefSitz({ lage: "aus" }); LiveChat.pruefEmpfangen({ art: "bild-voll", von: "k9", name: "K", bild: "data:image/png;base64,KK9" }); }).catch(() => {});
    await schlaf(900);
    const raeume = (await rpcAlle(pg)).filter((x) => x.art === "mess-raum"), st = await stand(pg);
    console.log("   rpc: " + kurz(raeume));
    const r0 = raeume[0] && raeume[0].d, r1 = raeume[1] && raeume[1].d;
    sage(raeume.length === 2 && r0.teil === 1 && r0.grund === "hidden" && r0.ges[0] >= 2 && r1.folge === 1 && r1.grund === "aus" && r1.ges[0] === 1,
      "K: Hintergrund → Teilzeile; zurück und „aus“ → die Folgezeile trägt nur die Zeit seitdem");
    const e1 = mitte && mitte.buch[mitte.pid], e2 = st && st.buch[st.pid];
    sage(e1 && !e1.ro && !e1.ru && e2 && !e2.ro && !e2.ru, "K: im Hintergrund steht keine leere Zusammenfassung im Laufbuch, und nach der Bestätigung nichts mehr unterwegs",
      JSON.stringify({ mitte: e1 && { ro: e1.ro, ru: e1.ru }, ende: e2 && { ro: e2.ro, ru: e2.ru } }).slice(0, 200));
    await zu(ctx);
  }
  {
    /* K4: Android – Teilzeile im Hintergrund mit keepalive, die Antwort kommt nicht mehr an, das System räumt die Seite
       weg (Page.crash). Die nächste Seite meldet „hinten" und schickt nichts doppelt und nichts Leeres. */
    S.supa = []; S.supaWarte = 4000;
    const ctx = await fensterK();
    const p1 = await ctx.newPage();
    await laden(p1, null, true, NEU, { marke: true });
    await messDa(p1); await startRaus(p1);
    await raumRein(p1, 1);
    const mk = await hatMarke(p1);
    await zweiLanglaeufer(p1);
    await verstecken(p1, true);
    for (let i = 0; i < 30 && !S.supa.some((x) => x.art === "mess-raum"); i++) await schlaf(100);
    const st1 = await stand(p1), ru = st1 && st1.buch[st1.pid] && st1.buch[st1.pid].ru;
    const tab = await tabVon(p1);
    await absturz(ctx, p1);
    S.supaWarte = 0;
    const { pg, d } = await nachher(ctx, tab);
    const rpc = await rpcAlle(pg), ka = S.supa.filter((x) => x.art === "mess-raum");
    console.log("   keepalive: " + kurz(S.supa) + "   |  rpc: " + kurz(rpc) + "   |  vorher " + JSON.stringify(d && d.vorher));
    sage(mk && ru && ru.length === 1 && ru[0].ka === 1 && ka.length === 1 && ka[0].d.teil === 1 && ka[0].d.ges[0] >= 2,
      "K: Teilzeile im Hintergrund geht mit keepalive raus und steht bis zur Antwort als „ka“ im Laufbuch");
    sage(d && d.vorher[0] && d.vorher[0].ende === "hinten" && !rpc.some((x) => x.art === "mess-raum"),
      "K: danach weggeräumt → „hinten“; die Zeile kommt genau einmal (kein Nachsenden, keine leere Zeile)");
    await zu(pg); await zu(ctx);
  }
  {
    /* K4b: Tab-Wechsel OHNE Marke → Teilzeile über rpc; die Antwort kommt nicht mehr (Seite weggeräumt, bevor die
       Attrappe antwortet) → die Zeile steht unbestätigt im Laufbuch, die nächste Seite schickt sie genau einmal nach */
    const ctx = await fensterK();
    const p1 = await ctx.newPage();
    await laden(p1, null, true, NEU);
    await messDa(p1); await startRaus(p1);
    await raumRein(p1, 1);
    await zweiLanglaeufer(p1);
    await p1.evaluate(() => { window.__rpcWarte = 5000; }).catch(() => {});
    await verstecken(p1, true); await schlaf(300);
    const st1 = await stand(p1), ru = st1 && st1.buch[st1.pid] && st1.buch[st1.pid].ru;
    const tab = await tabVon(p1);
    await absturz(ctx, p1);
    const { pg, d } = await nachher(ctx, tab);
    const raeume = (await rpcAlle(pg)).filter((x) => x.art === "mess-raum");
    console.log("   rpc: " + kurz(raeume) + "   |  vorher " + JSON.stringify(d && d.vorher));
    sage(ru && ru.length === 1 && !ru[0].ka && raeume.length === 1 && raeume[0].d.spaet === 1 && raeume[0].d.teil === 1 && raeume[0].d.ges[0] >= 2 && d && d.vorher[0] && d.vorher[0].ende === "hinten",
      "K: Teilzeile ohne Marke, Antwort bleibt aus, Seite weggeräumt → die nächste Seite schickt sie genau einmal nach");
    await zu(pg); await zu(ctx);
  }
  {
    /* K5: kurzer Aufenthalt (unter der Teilzeit), Seite zu, mit Marke → pagehide schickt die Zeile (grund „weg") */
    S.supa = [];
    const ctx = await fensterK();
    const p1 = await ctx.newPage();
    await laden(p1, null, true, NEU, { marke: true });
    await messDa(p1); await startRaus(p1);
    await raumRein(p1, 1);
    const mk = await hatMarke(p1);
    await blockiere(p1, 230); await schlaf(300);
    await p1.close({ runBeforeUnload: false }).catch(() => {});
    await schlaf(600);
    const p2 = await ctx.newPage();
    await laden(p2, null, true, NEU);
    await messDa(p2); await startRaus(p2); await schlaf(400);
    const rpc = await rpcAlle(p2), ka = S.supa.filter((x) => x.art === "mess-raum");
    console.log("   keepalive: " + kurz(S.supa) + "   |  rpc: " + kurz(rpc));
    sage(mk && ka.length === 1 && ka[0].d.grund === "weg" && ka[0].d.folge === 0 && ka[0].d.ges[0] === 1 && ka[0].d.drin >= 100 && !rpc.some((x) => x.art === "mess-raum"),
      "K: kurzer Aufenthalt, Seite zu → die Zeile geht beim Weggehen mit keepalive raus (mit „drin“), die nächste Seite schickt nichts doppelt", "Marke " + mk);
    await zu(p2); await zu(ctx);
  }
  sage(!/Zuzana|Testperson/.test(JSON.stringify(S.supa)), "B: auch in den keepalive-Zeilen kein Name");
  await Promise.race([brK.close(), schlaf(5000)]);

  /* ================= J ================= */
  console.log("\nJ) PRÜFLÄUFE OHNE dma-mess-pruef\n");
  {
    await jLos;
    const da = await messDa(pgJ, 30000);
    const st = await stand(pgJ);
    /* die Startzeile wäre 20 s nach messung.js fällig – so lange (plus Luft) warten */
    await pgJ.waitForFunction(() => DMA_MESS.stand().startRaus, null, { timeout: 40000, polling: 500 }).catch(() => {});
    await schlaf(500);
    const roh = await pgJ.evaluate(() => (window.__berichte || []).length).catch(() => -1);
    const st2 = await stand(pgJ);
    sage(da && st && st.zeit.start === 20000 && st2 && st2.startRaus && roh === 0 && st2.kiste.length === 0, "J: unter webdriver ohne dma-mess-pruef kein einziger Aufruf (auch nicht in die Kiste)", "Aufrufe " + roh);
    await zu(ctxJ);
  }

  sage(alleZeilen.length > 0 && !/Zuzana|Testperson|test@example|1234567/.test(JSON.stringify(alleZeilen)), "B: in keiner der " + alleZeilen.length + " Zeilen der Sonde stehen Namen oder Rohdaten");
  console.log("\nFassung 884 (Sonde 884): " + (fehler ? fehler + " rot." : "alles grün."));
  await Promise.race([br.close(), schlaf(5000)]);
  S.srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
