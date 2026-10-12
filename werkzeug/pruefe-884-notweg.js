#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — NOTWEG INS KLASSENZIMMER (Fassung 884)
   ---------------------------------------------------------------------
   XANDER (Funk 268/270): „…fallbeck auf das Klassenzimmer" · Zusage
   Claude (Funk 272/273): fällt der neue schlanke Weg ins Klassenzimmer
   aus (ein Stück von min/app.js fehlt, lädt nicht oder passt nicht zur
   Fassung), lädt die Seite von selbst das ganze app.js und man kommt
   trotzdem ins Klassenzimmer.

   Die Fehler macht der SERVER dieser Sonde (nicht page.route): die
   Platzhalter holen ihr Stück mit synchronem XHR.
     fehlt       404 für /min/app-teil-raum<N>.js
     passtnicht  das Raum-Stück trägt eine falsche Kennung (dmaTeilPasst)
     offline     Raum-Stücke 404 UND /app.js 404 (keine Leitung zur Quelle)
     neuer       Raum-Stücke passen nicht, und auf dem Server liegt eine
                 neuere Fassung (fassung.json); ab /index.html?f=<neu>
                 kommt diese, und dort passen die Stücke wieder
   Geprüft:
     1  Bau: dmaTeilNotweg und dmaTeilRaum stehen als echte Funktionen in
        min/app.js (kein Platzhalter), index.html hat dmaGanzLaden.
     A  Stück fehlt, Tipp auf „Klassenzimmer betreten": genau EIN Neuladen,
        die ganze app.js (?v=<Stempel>) wird geholt; Seite 2 läuft mit der
        Quelle (keine Stücke), das Klassenzimmer ist ohne Tipp offen, das
        Tor kommt, ein Auftritt („Rakete") läuft, keine Seitenfehler.
     B  Stück passt nicht, Rückkehr nach dem Neuladen (dma_livechat_zurueck):
        ein Neuladen; Seite 1 betritt NICHT mit halbem app.js, Seite 2
        betritt mit der ganzen Quelle.
     C  keine Leitung zur Quelle: kein Neuladen, kein „dma-ganz", KEINE
        Blase „Neue Fassung <dieselbe>"; „Lernen" geht noch.
     D  Normalfall: Tor, kein Neuladen, keine /app.js-Anfrage, kein dma-ganz.
     E  „dma-ganz" einer alten Fassung wird weggeräumt (min/app.js), einer
        gleichen Fassung befolgt (Quelle, Klassenzimmer geht).
     F  neuere Fassung auf dem Server: die Seite landet auf ?f=<neu> mit
        min/app.js (nicht der Quelle), das Tor kommt.
     G  mit sw.js (?mit-sw): die vorab geholte app.js kommt beim Neuladen
        aus dem Zwischenspeicher (der Server sieht /app.js genau einmal).

   Aufruf:  node werkzeug/pruefe-884-notweg.js
   Gegenprobe: WURZEL=<ordner mit altem index.html, app.js, min/> node …
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const warte = async (f, ms) => { const bis = Date.now() + ms; while (Date.now() < bis) { if (f()) return true; await schlaf(50); } return f(); };

const INDEX = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
const FASSUNG = (INDEX.match(/window\.DMA_VERSION = "(\d+)"/) || [0, "0"])[1];
const NEU = String(Number(FASSUNG) + 1), ALT = String(Number(FASSUNG) - 1);

(async () => {
  /* ---- 1. Bau ---- */
  console.log("\n1) DER BAU (Fassung " + FASSUNG + ")\n");
  {
    const minApp = fs.readFileSync(path.join(WURZEL, "min/app.js"), "utf8");
    const echt = (n) => { const m = minApp.match(new RegExp("function " + n + "\\([^)]*\\)\\{(.{0,60})")); return Boolean(m && !/^return dmaTeilRufA?\(/.test(m[1])); };
    sage(echt("dmaTeilNotweg") && echt("dmaTeilRaum"), "dmaTeilNotweg und dmaTeilRaum stehen als echte Funktionen in min/app.js (nicht ausgelagert)");
    sage(/window\.dmaGanzLaden = function/.test(INDEX) && /window\.dmaFassungLaden = function/.test(INDEX) && /dma-ganz/.test(INDEX), "index.html hat dmaGanzLaden und dmaFassungLaden");
  }

  /* ---- Server, der mitschreibt und Fehler macht ---- */
  let modus = "", fassungNeu = false, neuStufe = 0;
  const anfragen = [];
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i)); if (p === "/") p = "/index.html";
    const such = i < 0 ? "" : q.url.slice(i + 1);
    anfragen.push({ p, such, t: Date.now() });
    const raumTeil = /^\/min\/app-teil-raum\d+\.js$/.test(p);
    const nicht = () => { a.writeHead(404); a.end(); };
    if ((modus === "fehlt" || modus === "offline") && raumTeil) return nicht();
    if (modus === "offline" && p === "/app.js") return nicht();
    if (modus === "neuer" && p === "/index.html" && new RegExp("(^|&)f=" + NEU + "(&|$)").test(such)) neuStufe = 2;
    if (modus === "neuer" && p === "/fassung.json" && (fassungNeu || neuStufe === 2)) {
      a.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      return a.end(JSON.stringify({ fassung: NEU }));
    }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return nicht();
    let body = fs.readFileSync(f);
    const kopf = { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" };
    if (raumTeil && (modus === "passtnicht" || (modus === "neuer" && neuStufe < 2))) {
      body = Buffer.from(String(body).replace(/dmaTeilPasst\("[^"]+"\)/, 'dmaTeilPasst("000000000000")'));
      kopf["Cache-Control"] = "no-store";
    }
    if (modus === "neuer" && neuStufe === 2 && p === "/index.html") body = Buffer.from(String(body).replace(/window\.DMA_VERSION = "\d+"/, 'window.DMA_VERSION = "' + NEU + '"'));
    a.writeHead(200, kopf); a.end(body);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });

  async function fenster(init, arg) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus");
      if (!sessionStorage.getItem("dma-neu-geladen")) sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
    if (init) await ctx.addInitScript(init, arg);
    const pg = await ctx.newPage();
    pg.__seite = 0; pg.__fehler = [];
    pg.on("request", (r) => { if (r.isNavigationRequest() && r.frame() === pg.mainFrame()) pg.__seite++; });
    pg.on("pageerror", (e) => pg.__fehler.push({ s: pg.__seite, t: String(e.message || e).split("\n")[0] }));
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    return { ctx, pg };
  }
  const bereit = (pg) => pg.waitForFunction(() => window.LiveChat && window.DMA_TEILE && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 60000, polling: 50 });
  const indexZahl = (ab) => anfragen.slice(ab).filter((x) => x.p === "/index.html").length;
  /* Supabase-Attrappe (wie Sonde 871): sonst zeigt die Seite nur „Zum Klassenzimmer" statt „Klassenzimmer betreten" */
  const attrappe = (pg) => pg.evaluate(() => {
    const rt = { pendingHeartbeatRef: null, connect() {}, isConnected: () => true, sendHeartbeat() {} };
    window.SUPABASE_CONFIG = window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url ? window.SUPABASE_CONFIG : { url: "https://beispiel.supabase.co", anonKey: "x" };
    window.supabase = { createClient: () => ({ realtime: rt,
      channel: (name) => ({ name, on() { return this; }, subscribe(fn) { setTimeout(() => fn("SUBSCRIBED"), 200); return this; }, send() { return Promise.resolve("ok"); },
        unsubscribe() { return Promise.resolve("ok"); }, track() { return Promise.resolve(); }, untrack() { return Promise.resolve(); }, presenceState() { return {}; } }),
      removeChannel() { return Promise.resolve(); },
      from() { const q = { select: () => q, eq: () => q, order: () => q, limit: () => q, maybeSingle: () => Promise.resolve({ data: null, error: null }), then: (ok) => ok({ data: [], error: null }) }; return q; },
      rpc: () => Promise.resolve({ data: null, error: null }), auth: { getSession: () => Promise.resolve({ data: { session: null } }) } }) };
  });
  async function zumKlassenzimmer(pg) {
    await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-knowledge"]').click());
    await pg.waitForFunction(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]'), null, { timeout: 20000 });
    await pg.evaluate(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click());
    return pg.waitForFunction(() => { const b = document.querySelector("#lcBetreten"); return b && b.getBoundingClientRect().height > 0; }, null, { timeout: 20000 }).then(() => true, () => false);
  }
  /* der Tipp auf „Klassenzimmer betreten" (Fehler im Klick-Hörer landen in pageerror, nicht hier) */
  const betreten = (pg) => pg.evaluate(() => { const b = document.querySelector("#lcBetreten"); if (b) b.click(); return Boolean(b); }).catch(() => false);
  const torDa = (pg, ms) => pg.waitForFunction(() => document.getElementById("lcTor"), null, { timeout: ms }).then(() => true, () => false);
  /* auf das Neuladen warten: der Server sieht /index.html noch einmal, dann die neue Seite bereit */
  async function neueSeite(pg, ab, n, ms) {
    const da = await warte(() => indexZahl(ab) >= n, ms);
    if (!da) return false;
    await schlaf(300);
    try { await pg.waitForLoadState("load", { timeout: 30000 }); await bereit(pg); return true; } catch (e) { return false; }
  }
  const nachIndex = (ab, n) => { let k = 0; for (let i = ab; i < anfragen.length; i++) if (anfragen[i].p === "/index.html" && ++k === n) return i; return anfragen.length; };

  /* ---- A: Stück fehlt, Tipp ---- */
  console.log("\nA) EIN RAUM-STÜCK FEHLT – TIPP AUF „KLASSENZIMMER BETRETEN\"\n");
  {
    modus = "fehlt";
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "load" });
    await bereit(pg);
    await attrappe(pg);
    sage(await zumKlassenzimmer(pg), "Seite 1: Wissen → Klassenzimmer zeigt „Klassenzimmer betreten\"");
    await schlaf(1200);
    const t0 = Date.now();
    await betreten(pg);
    const neu = await neueSeite(pg, ab, 2, 20000);
    const msNeu = Date.now() - t0;
    await schlaf(2500);
    sage(neu && indexZahl(ab) === 2, "genau EIN Neuladen (index.html " + indexZahl(ab) + "×)", neu ? "neue Seite " + msNeu + " ms nach dem Tipp" : "");
    const st = await pg.evaluate(() => ({ q: window.DMA_Q("app.js"), stand: window.DMA_TEILE.stand(), stempel: (window.DMA_STEMPEL || {})["app.js"],
      kz: document.getElementById("sub-livechat")?.dataset.active, wissen: document.getElementById("view-knowledge")?.dataset.active,
      ganzSpeicher: localStorage.getItem("dma-ganz") })).catch((e) => ({ fehler: e.message }));
    const quelle = anfragen.slice(ab).filter((x) => x.p === "/app.js");
    sage(quelle.some((x) => x.such === "v=" + st.stempel), "die ganze app.js wurde geholt (/app.js?v=" + st.stempel + ")", quelle.map((x) => "?" + x.such).join(" "));
    const ab2 = nachIndex(ab, 2);
    const seite2 = anfragen.slice(ab2).map((x) => x.p);
    sage(st.q === "app.js" && st.stand && st.stand.gebaut === false && st.stand.ganz === true && !seite2.some((p) => /^\/min\/app(-teil-[a-z0-9]+)?\.js$/.test(p)),
      "Seite 2 läuft mit der ganzen Quelle (DMA_Q → app.js, keine Stücke, kein min/app.js)", JSON.stringify({ q: st.q, gebaut: st.stand && st.stand.gebaut, ganz: st.stand && st.stand.ganz, speicher: st.ganzSpeicher }));
    sage(st.stand && /raum/.test(st.stand.notweg || ""), "der Grund steht bei (dma-ganz-grund)", st.stand && st.stand.notweg);
    sage(st.kz === "true" && st.wissen === "true", "das Klassenzimmer ist ohne Tipp wieder offen", "Wissen " + st.wissen + ", Klassenzimmer " + st.kz);
    await attrappe(pg);
    const ok2 = await zumKlassenzimmer(pg);
    await betreten(pg);
    sage(ok2 && await torDa(pg, 8000), "Seite 2: „Klassenzimmer betreten\" → das Tor kommt");
    await pg.evaluate(() => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: {} });
      document.querySelector('.tape-tab[data-target="view-knowledge"]').click();
      document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click();
    }).catch(() => {});
    await schlaf(600);
    await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "cem", name: "Cem", buehne: true, seit: 7000, auftritt: "rakete" })).catch(() => {});
    sage(await pg.waitForFunction(() => document.querySelector(".lc-auftritt-rakete"), null, { timeout: 5000 }).then(() => true, () => false), "im Raum: Cem kommt mit „Rakete\" – der Auftritt läuft");
    const f1 = pg.__fehler.filter((x) => x.s === 1).map((x) => x.t), f2 = pg.__fehler.filter((x) => x.s >= 2).map((x) => x.t);
    console.log("   (Seite 1, erwartet: der eine gescheiterte Tipp) " + (f1.slice(0, 2).join(" | ") || "–"));
    sage(!f2.length, "keine Seitenfehler auf Seite 2", f2.slice(0, 3).join(" | "));
    await ctx.close();
  }

  /* ---- B: Stück passt nicht, Rückkehr nach dem Neuladen ---- */
  console.log("\nB) EIN RAUM-STÜCK PASST NICHT – RÜCKKEHR NACH DEM NEULADEN\n");
  {
    modus = "passtnicht";
    const { ctx, pg } = await fenster(() => {
      try { if (!sessionStorage.getItem("dma_livechat_zurueck")) sessionStorage.setItem("dma_livechat_zurueck", JSON.stringify({ raum: "sonde884notweg", name: "Sonde", mitBild: false, zeit: Date.now() })); } catch (e) {}
      /* Falle: jedes LiveChat.betreten schreibt auf, ob die Seite da mit Stücken (gebaut) lief */
      let lc;
      Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => {
        lc = v;
        try {
          const echt = v.betreten;
          v.betreten = function () {
            try { const l = JSON.parse(sessionStorage.getItem("sonde-betreten") || "[]");
              l.push({ gebaut: window.DMA_TEILE ? window.DMA_TEILE.stand().gebaut : null, f: window.DMA_VERSION }); sessionStorage.setItem("sonde-betreten", JSON.stringify(l)); } catch (e) {}
            return echt.apply(this, arguments);
          };
        } catch (e) {}
      } });
    });
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
    const neu = await neueSeite(pg, ab, 2, 20000);
    await schlaf(4000);
    const r = await pg.evaluate(() => ({ liste: JSON.parse(sessionStorage.getItem("sonde-betreten") || "[]"), stand: window.DMA_TEILE.stand() })).catch((e) => ({ liste: [], fehler: e.message }));
    sage(neu && indexZahl(ab) === 2, "genau EIN Neuladen (index.html " + indexZahl(ab) + "×)");
    sage(!r.liste.some((x) => x.gebaut === true), "Seite 1 betritt NICHT mit halbem app.js", JSON.stringify(r.liste));
    sage(r.liste.length >= 1 && r.liste.every((x) => x.gebaut === false), "Seite 2 betritt mit der ganzen Quelle (Rückkehr wie gewohnt)", r.liste.length + "× betreten");
    sage(r.stand && r.stand.ganz && /passt nicht/.test(r.stand.notweg || ""), "Grund: Stück passt nicht", r.stand && r.stand.notweg);
    await ctx.close();
  }

  /* ---- C: keine Leitung zur Quelle ---- */
  console.log("\nC) KEINE LEITUNG ZUR GANZEN QUELLE\n");
  {
    modus = "offline";
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "load" });
    await bereit(pg);
    await attrappe(pg);
    await zumKlassenzimmer(pg);
    await schlaf(1200);
    await betreten(pg);
    await schlaf(8000);
    const r = await pg.evaluate(() => ({ ganz: localStorage.getItem("dma-ganz"), blase: (document.getElementById("dmaNeueFassung") || {}).textContent || "",
      fehler: (window.DMA_TEIL_FEHLER || []).slice(), q: window.DMA_Q("app.js") })).catch((e) => ({ fehler: [], x: e.message }));
    sage(indexZahl(ab) === 1, "kein Neuladen in 8 s (index.html " + indexZahl(ab) + "×)");
    sage(r.ganz === null && r.q === "min/app.js", "dma-ganz nicht gesetzt, die Seite bleibt schlank", String(r.ganz));
    sage(anfragen.slice(ab).some((x) => x.p === "/app.js"), "der Notweg hat die Quelle versucht (404)");
    sage(!r.blase, "keine Blase „Neue Fassung " + FASSUNG + "\" bei gleicher Fassung", JSON.stringify(r.blase));
    sage(r.fehler.some((x) => /^raum/.test(x)), "DMA_TEIL_FEHLER nennt das Raum-Stück", r.fehler.slice(0, 2).join(" | "));
    await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-learn"]').click()).catch(() => {});
    sage(await pg.waitForFunction(() => document.getElementById("view-learn")?.dataset.active === "true", null, { timeout: 5000 }).then(() => true, () => false), "der Reiter „Lernen\" geht noch");
    await ctx.close();
  }

  /* ---- D: Normalfall ---- */
  console.log("\nD) NORMALFALL: NICHTS ÄNDERT SICH\n");
  {
    modus = "";
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "load" });
    await bereit(pg);
    await attrappe(pg);
    await zumKlassenzimmer(pg);
    await schlaf(1200);
    await betreten(pg);
    const tor = await torDa(pg, 8000);
    await schlaf(1500);
    const r = await pg.evaluate(() => ({ ganz: localStorage.getItem("dma-ganz"), stand: window.DMA_TEILE.stand() }));
    sage(tor, "das Tor kommt");
    sage(indexZahl(ab) === 1 && !anfragen.slice(ab).some((x) => x.p === "/app.js") && r.ganz === null && r.stand.gebaut && !r.stand.ganz,
      "kein Neuladen, keine /app.js-Anfrage, kein dma-ganz, Stücke wie immer", "index " + indexZahl(ab) + "×, ganz " + r.ganz);
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).map((x) => x.t).join(" | "));
    await ctx.close();
  }

  /* ---- E: dma-ganz einer anderen / derselben Fassung ---- */
  console.log("\nE) DER MERKER GILT NUR FÜR SEINE FASSUNG\n");
  {
    modus = "";
    const { ctx, pg } = await fenster((alt) => { try { if (!sessionStorage.getItem("sonde-e")) { localStorage.setItem("dma-ganz", JSON.stringify({ f: alt, d: ["app.js"] })); sessionStorage.setItem("sonde-e", "1"); } } catch (e) {} }, ALT);
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "load" });
    await bereit(pg);
    const r = await pg.evaluate(() => ({ ganz: localStorage.getItem("dma-ganz"), q: window.DMA_Q("app.js"), gebaut: window.DMA_TEILE.stand().gebaut }));
    sage(r.ganz === null, "dma-ganz der Fassung " + ALT + " wird weggeräumt", String(r.ganz));
    sage(r.q === "min/app.js" && r.gebaut && anfragen.slice(ab).some((x) => x.p === "/min/app.js") && !anfragen.slice(ab).some((x) => x.p === "/app.js"), "es kommt min/app.js wie immer");
    await ctx.close();
  }
  {
    modus = "";
    const { ctx, pg } = await fenster((f) => { try { localStorage.setItem("dma-ganz", JSON.stringify({ f, d: ["app.js"] })); } catch (e) {} }, FASSUNG);
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "load" });
    await bereit(pg);
    await attrappe(pg);
    await zumKlassenzimmer(pg);
    await betreten(pg);
    const tor = await torDa(pg, 8000);
    const r = await pg.evaluate(() => ({ q: window.DMA_Q("app.js"), stand: window.DMA_TEILE.stand(), livechat: window.DMA_Q("livechat.js") }));
    sage(r.q === "app.js" && !r.stand.gebaut && r.livechat === "min/livechat.js" && !anfragen.slice(ab).some((x) => /^\/min\/app(-teil-[a-z0-9]+)?\.js$/.test(x.p)),
      "dma-ganz derselben Fassung (neuer Tab): ganze app.js, alle anderen Dateien bleiben verkleinert", JSON.stringify({ q: r.q, livechat: r.livechat }));
    sage(tor && !pg.__fehler.length, "das Klassenzimmer geht (Tor), keine Seitenfehler", pg.__fehler.slice(0, 2).map((x) => x.t).join(" | "));
    await ctx.close();
  }

  /* ---- F: neuere Fassung auf dem Server ---- */
  console.log("\nF) AUF DEM SERVER LIEGT SCHON FASSUNG " + NEU + "\n");
  {
    modus = "neuer"; fassungNeu = false; neuStufe = 0;
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "load" });
    await bereit(pg);
    await warte(() => anfragen.slice(ab).some((x) => x.p === "/fassung.json"), 5000);
    await schlaf(400);
    fassungNeu = true;   /* erst jetzt erscheint die neue Fassung (der erste Blick des Wächters sah noch die alte) */
    await attrappe(pg);
    await zumKlassenzimmer(pg);
    await schlaf(1200);
    await betreten(pg);
    const neu = await neueSeite(pg, ab, 2, 20000);
    await schlaf(1500);
    const r = await pg.evaluate(() => ({ url: location.search, f: window.DMA_VERSION, q: window.DMA_Q("app.js"), stand: window.DMA_TEILE.stand(), ganz: localStorage.getItem("dma-ganz"),
      kz: document.getElementById("sub-livechat")?.dataset.active })).catch((e) => ({ x: e.message, stand: {} }));
    sage(neu && new RegExp("f=" + NEU).test(r.url || "") && r.f === NEU, "die Seite holt Fassung " + NEU + " (?f=" + NEU + ")", (r.url || "") + " → " + r.f);
    sage(r.q === "min/app.js" && r.stand.gebaut && r.ganz === null, "dort schlank wie immer (min/app.js, kein dma-ganz – nie die neue Quelle auf alter Seite)", JSON.stringify({ q: r.q, ganz: r.ganz }));
    sage(r.kz === "true", "das Klassenzimmer ist wieder offen");
    await attrappe(pg);
    const ok2 = await zumKlassenzimmer(pg);
    await betreten(pg);
    const tor = await torDa(pg, 8000);
    const st = await pg.evaluate(() => window.DMA_TEILE.stand()).catch(() => ({ fehler: ["?"] }));
    sage(ok2 && tor && !(st.fehler || []).length, "Tor kommt, die Stücke passen", (st.fehler || []).slice(0, 2).join(" | "));
    modus = "";
    await ctx.close();
  }

  /* ---- G: mit sw.js ---- */
  console.log("\nG) MIT DEM ZWISCHENSPEICHER sw.js (?mit-sw)\n");
  {
    modus = "fehlt";
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
    await bereit(pg);
    const sw = await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 15000 }).then(() => true, () => false);
    sage(sw, "sw.js führt die Seite");
    await attrappe(pg);
    await zumKlassenzimmer(pg);
    await schlaf(1200);
    await betreten(pg);
    const neu = await neueSeite(pg, ab, 2, 20000);
    await schlaf(1500);
    const r = await pg.evaluate(() => ({ q: window.DMA_Q("app.js"), stand: window.DMA_TEILE.stand(),
      res: performance.getEntriesByType("resource").filter((e) => /\/app\.js\?v=/.test(e.name)).map((e) => ({ w: e.workerStart > 0 ? 1 : 0, t: e.transferSize })) })).catch((e) => ({ x: e.message, stand: {} }));
    const n = anfragen.slice(ab).filter((x) => x.p === "/app.js").length;
    sage(neu && r.q === "app.js" && r.stand.ganz, "ein Neuladen, Seite 2 mit der ganzen Quelle");
    sage(n === 1, "der Server sieht /app.js genau einmal (das Vorab-Holen) – beim Neuladen kommt sie aus sw.js", n + "×, " + JSON.stringify(r.res));
    modus = "";
    await ctx.close();
  }

  await br.close(); srv.close();
  console.log("\nFassung 884 (Sonde 884-notweg): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
