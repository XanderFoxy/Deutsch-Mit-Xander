#!/usr/bin/env node
/* =====================================================================
   FASSUNG 876 — WAS BRAUCHT DER START WIRKLICH? (Coverage)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".

   Öffnet die Seite (Quellen, ?quelle) in mehreren Lagen und schreibt mit,
   was dabei läuft und greift:
     Lagen    abgemeldet/angemeldet (nachgebauter Supabase-Klient) ×
              Telefon (393 px)/breiter Schirm (1280 px)
     Schritte start   bis die Reiter antworten
              kz      Wissen → Klassenzimmer (die Seite mit „Betreten")
              ruhe    6 s Ruhe (Vorladen, Tutor, Kachelbilder …)
              reiter  alle vier Hauptreiter einmal geöffnet
              raum    „Betreten" → Tor → im Raum (nachgebauter Kanal)
   Daraus entstehen:
     werkzeug/app-teile.json   Funktionen der obersten Ebene von app.js,
                               die in keiner Lage bis „reiter" liefen:
                               „raum" (läuft beim Betreten oder heißt lc…/
                               livechat…/kz…/sit…) und „rest".
     werkzeug/stil-teile.json  Regeln von korrekturen.css, app-styles.css
                               und spiel.css, die in keiner Lage bis
                               „reiter" greifen können (weder im Coverage
                               noch per querySelector auf das ganze DOM,
                               Zustände wie :hover abgezogen).
   Gebaut wird daraus mit werkzeug/teile-bauen.js und stil-bauen.js (aus
   fassung-setzen.js). Aufruf: node werkzeug/teile-messen.js [--nur-zeigen]
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const teile = require("./teile-bauen.js");
const stil = require("./stil-bauen.js");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
const STIL_DATEIEN = ["korrekturen.css", "app-styles.css", "spiel.css"];
const PHASEN = ["start", "kz", "ruhe", "reiter", "raum"];
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

/* Nachgebauter, angemeldeter Supabase-Klient: jede Abfrage antwortet leer, das Profil gibt es. */
function falscherKlient() {
  const profil = { id: "u-sonde", display_name: "Sonde", name: "Sonde", email: "s@beispiel.de", points: 1234, badges: ["a"], trophies: [],
    theme: "", is_premium: true, extra_profile_data: {}, collected_figures: [], avatar_url: "", bio: "Hallo", level: 5, created_at: "2026-01-01T00:00:00Z" };
  function kette(tabelle) {
    let einzel = false;
    const p = new Proxy(function () {}, {
      get(t, k) {
        if (k === "then") return (ok, nein) => Promise.resolve({ data: einzel ? (tabelle === "profiles" ? Object.assign({}, profil) : null) : [], error: null, count: 0 }).then(ok, nein);
        if (k === "single" || k === "maybeSingle") return () => { einzel = true; return p; };
        return () => p;
      },
      apply() { return p; }
    });
    return p;
  }
  const angemeldet = Boolean(window.__SONDE_ANGEMELDET);
  const sitzung = { access_token: "x", user: { id: "u-sonde", email: "s@beispiel.de", user_metadata: { name: "Sonde" } } };
  return { createClient: () => ({
    auth: { getSession: () => Promise.resolve({ data: { session: angemeldet ? sitzung : null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: angemeldet ? sitzung.user : null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }), signOut: () => Promise.resolve({}),
      refreshSession: () => Promise.resolve({ data: { session: angemeldet ? sitzung : null } }) },
    from: (t) => kette(t), rpc: () => kette("rpc"),
    realtime: { connect() {}, isConnected: () => false, setAuth() {} },
    channel: (name) => { const k = { name, on() { return k; }, subscribe(fn) { setTimeout(() => fn && fn("SUBSCRIBED"), 50); return k; },
      send() { return Promise.resolve("ok"); }, unsubscribe() { return Promise.resolve("ok"); }, track() { return Promise.resolve(); },
      untrack() { return Promise.resolve(); }, presenceState() { return {}; } }; return k; },
    removeChannel: () => Promise.resolve(), getChannels: () => [],
    storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: "" } }), upload: () => Promise.resolve({ data: null, error: null }), list: () => Promise.resolve({ data: [], error: null }) }) },
    functions: { invoke: () => Promise.resolve({ data: null, error: null }) } }) };
}

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); a.end(fs.readFileSync(f));
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });

  /* Regeln der Stilblätter (Quelle) mit Schlüssel und abgespecktem Wähler für querySelector */
  const stilRegeln = {};
  STIL_DATEIEN.forEach((d) => { stilRegeln[d] = stil.regeln(d, fs.readFileSync(path.join(WURZEL, d), "utf8")); });
  const waehler = {};
  STIL_DATEIEN.forEach((d) => stilRegeln[d].forEach((r) => { waehler[r.key] = r.sel; }));

  const fnPhase = {};          /* "start,end" -> früheste Phase (Index) über alle Lagen */
  const stilFrueh = new Set(); /* Schlüssel, die bis „reiter" greifen */
  const animNamen = new Set();
  const lagenBericht = [];

  async function lage(name, angemeldet, breit) {
    const ctx = await br.newContext(breit ? { viewport: { width: 1280, height: 900 } } : { viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript((a) => { try { localStorage.setItem("dma_tour_seen", "1"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} window.__SONDE_ANGEMELDET = a; }, angemeldet);
    if (angemeldet) await ctx.addInitScript("(" + function (fk) { const k = eval("(" + fk + ")")(); Object.defineProperty(window, "supabase", { value: k, writable: false, configurable: true }); } + ")(" + JSON.stringify(falscherKlient.toString()) + ")");
    const pg = await ctx.newPage();
    const fehler = [];
    pg.on("pageerror", (e) => fehler.push(String(e.message || e).split("\n")[0]));
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.startPreciseCoverage", { callCount: true, detailed: false });
    await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
    await cdp.send("CSS.startRuleUsageTracking");
    const blaetter = {};
    cdp.on("CSS.styleSheetAdded", (e) => { blaetter[e.header.styleSheetId] = (e.header.sourceURL || "").replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, ""); });
    async function schnapp(phase) {
      const ph = PHASEN.indexOf(phase);
      const { result } = await cdp.send("Profiler.takePreciseCoverage");
      for (const s of result) {
        if (!/\/app\.js(\?|$)/.test(s.url) || /min\//.test(s.url)) continue;
        for (const f of s.functions) {
          const r = f.ranges[0];
          if (r.count > 0) { const k = r.startOffset + "," + r.endOffset; if (!(k in fnPhase) || fnPhase[k] > ph) fnPhase[k] = ph; }
        }
      }
      const cd = await cdp.send("CSS.takeCoverageDelta");
      if (phase !== "raum") {
        for (const r of (cd.coverage || cd.ruleUsage || [])) {
          if (!r.used) continue;
          const d = blaetter[r.styleSheetId];
          if (!stilRegeln[d]) continue;
          stilRegeln[d].forEach((x) => { if (x.start <= r.startOffset && r.startOffset < x.end) stilFrueh.add(x.key); });
        }
        /* Jede Regel, deren Wähler (ohne Zustände wie :hover) jetzt irgendein Element trifft */
        const treffer = await pg.evaluate((w) => {
          const aus = [];
          const ab = (s) => {
            let t = s.replace(/::?[\w-]+(\((?:[^()]|\([^()]*\))*\))?/g, "");
            t = t.replace(/(^|[\s>+~(,])(?=\s*([>+~),]|$))/g, "$1*");
            return t.trim() || "*";
          };
          for (const [k, s] of Object.entries(w)) {
            let ja = false;
            try { ja = Boolean(document.querySelector(s)); } catch (e) {}
            if (!ja) { try { ja = Boolean(document.querySelector(ab(s))); } catch (e) { ja = true; } }
            if (ja) aus.push(k);
          }
          const namen = [];
          try { document.getAnimations().forEach((a) => { if (a.animationName) namen.push(a.animationName); }); } catch (e) {}
          return { aus, namen };
        }, waehler);
        treffer.aus.forEach((k) => stilFrueh.add(k));
        treffer.namen.forEach((n) => animNamen.add(n));
      }
    }
    await pg.goto(HIER + "/index.html?quelle", { waitUntil: "commit" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading" && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 120000, polling: 50 });
    await schnapp("start");
    await pg.waitForFunction(() => { const v = document.getElementById("view-knowledge"); if (v && v.dataset.active === "true") return true; const t = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (t) t.click(); return false; }, null, { timeout: 60000, polling: 100 });
    await pg.waitForFunction(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]'), null, { timeout: 60000 });
    await pg.evaluate(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click());
    await pg.waitForFunction(() => { const b = document.querySelector("#lcBetreten, #lcZumKlassenzimmer"); return b && b.getBoundingClientRect().height > 0; }, null, { timeout: 60000, polling: 50 });
    await schnapp("kz");
    await schlaf(6000);
    await schnapp("ruhe");
    for (const z of ["view-about", "view-learn", "view-profile", "view-knowledge"]) {
      await pg.evaluate((z) => { const t = document.querySelector('.tape-tab[data-target="' + z + '"]'); if (t) t.click(); }, z);
      await schlaf(1500);
    }
    await pg.evaluate(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click());
    await schlaf(800);
    await schnapp("reiter");
    /* Betreten wie ein Mensch: Knopf → Tor → „hinein" */
    if (!angemeldet) await pg.addScriptTag({ content: "(" + function (fk) { window.supabase = eval("(" + fk + ")")(); } + ")(" + JSON.stringify(falscherKlient.toString()) + ")" });
    let drin = false;
    try {
      await pg.evaluate(() => { const b = document.getElementById("lcBetreten"); if (b) b.click(); });
      await pg.waitForFunction(() => document.getElementById("lcTorRein") || (window.LiveChat.lage().lage === "drin"), null, { timeout: 15000 });
      await pg.evaluate(() => { const b = document.getElementById("lcTorNurTon") || document.getElementById("lcTorRein"); if (b) b.click(); });
      await pg.waitForFunction(() => window.LiveChat.lage().lage === "drin", null, { timeout: 20000 });
      drin = true;
    } catch (e) {}
    await schlaf(4000);
    await schnapp("raum");
    lagenBericht.push(name + (drin ? "" : " (Raum nicht erreicht)") + (fehler.length ? " Fehler: " + fehler.slice(0, 2).join(" | ") : ""));
    await ctx.close();
  }

  await lage("abgemeldet, Telefon", false, false);
  await lage("angemeldet, Telefon", true, false);
  await lage("abgemeldet, breit", false, true);
  await lage("angemeldet, breit", true, true);
  await br.close(); srv.close();
  console.log("Lagen:\n  " + lagenBericht.join("\n  "));

  /* ---- app.js: Funktionen der obersten Ebene nach frühester Phase ---- */
  const acorn = teile.acornHolen();
  const quelle = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const ast = acorn.parse(quelle, { ecmaVersion: "latest" });
  const huelle = ast.body.find((st) => st.type === "ExpressionStatement" && st.expression.type === "CallExpression" && st.expression.callee.type === "FunctionExpression");
  const rumpf = huelle.expression.callee.body.body;
  const bereiche = Object.entries(fnPhase).map(([k, ph]) => { const [s] = k.split(",").map(Number); return [s, ph]; }).sort((a, b) => a[0] - b[0]);
  function frueh(s, e) {
    let lo = 0, hi = bereiche.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (bereiche[m][0] < s) lo = m + 1; else hi = m; }
    let b = 99;
    for (let i = lo; i < bereiche.length && bereiche[i][0] < e; i++) b = Math.min(b, bereiche[i][1]);
    return b;
  }
  const raum = [], rest = [];
  const groesse = { kern: 0, raum: 0, rest: 0 };
  rumpf.forEach((st) => {
    if (st.type !== "FunctionDeclaration" || !st.id || /^dmaTeil/.test(st.id.name)) return;
    const ph = frueh(st.start, st.end);
    if (ph <= PHASEN.indexOf("reiter")) { groesse.kern += st.end - st.start; return; }
    if (ph === PHASEN.indexOf("raum") || /^(lc|livechat|kz|sit|klass)/i.test(st.id.name)) { raum.push(st.id.name); groesse.raum += st.end - st.start; }
    else { rest.push(st.id.name); groesse.rest += st.end - st.start; }
  });
  console.log("app.js: Kern-Funktionen " + Math.round(groesse.kern / 1024) + " KB, raum " + raum.length + " (" + Math.round(groesse.raum / 1024) + " KB), rest " + rest.length + " (" + Math.round(groesse.rest / 1024) + " KB) Quelltext");

  /* ---- Stilblätter: was nie früh greift ---- */
  const spaet = {};
  STIL_DATEIEN.forEach((d) => {
    spaet[d] = [...new Set(stilRegeln[d].filter((r) => !stilFrueh.has(r.key)).map((r) => r.key))].sort();
    /* derselbe Schlüssel früh und spät (gleicher Wähler zweimal)? dann früh */
    spaet[d] = spaet[d].filter((k) => !stilFrueh.has(k));
    console.log(d + ": " + stilRegeln[d].length + " Regeln, später " + spaet[d].length);
  });
  if (process.argv[2] === "--nur-zeigen") return;
  fs.writeFileSync(teile.LISTE, JSON.stringify({
    erklaerung: "FASSUNG 876 — Funktionen von app.js, die nur in min/ ausgelagert werden (werkzeug/teile-bauen.js). Erzeugt von werkzeug/teile-messen.js.",
    teile: { raum, rest } }, null, 0).replace(/\],"/g, "],\n\"") + "\n");
  fs.writeFileSync(stil.LISTE, JSON.stringify({
    erklaerung: "FASSUNG 876 — Regeln, die beim Start nicht greifen (Prüfsummen, werkzeug/stil-bauen.js). Erzeugt von werkzeug/teile-messen.js. Unbekannte Regeln kommen ins Startblatt.",
    immer: [...animNamen].sort(), spaet }, null, 0).replace(/\],"/g, "],\n\"") + "\n");
  console.log("geschrieben: werkzeug/app-teile.json, werkzeug/stil-teile.json");
})().catch((e) => { console.error(e); process.exit(2); });
