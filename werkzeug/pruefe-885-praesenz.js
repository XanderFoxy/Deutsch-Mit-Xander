#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — PRÄSENZ SOFORT BEIM TIPP AUF „KLASSENZIMMER“
   (Fassung 885, S3 des Ladezeit-Entwurfs, freigegeben Funk 311)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „sofort im Livestream wie bei HelloTalk" · (Funk
   271): „alles insgesamt nur zehn Mal schneller" · (Funk 255): „die
   schnelle Performance und die Verbindung zu den anderen haben oberste
   Priorität".
   Befund bis 885 (2ea2044c): wer gerade im Klassenzimmer sitzt und
   welche Räume offen sind („DIE RÄUME“, das Laufband, das Schulhaus in der
   Liste hinter dem grünen Licht), kommt über den Präsenzkanal
   „dma-klassenzimmer-da“. Den öffnete app.js fest 4 s nach dem Start. Wer
   früher auf „Klassenzimmer“ tippte, sah bis dahin „leer — geh ruhig
   hinein“.
   Jetzt öffnet ihn auch der Tipp (raumVorbereiten, gleich nach dem ersten
   Bild) – wer zuerst kommt; derselbe eine Kanal.

   Die Sonde ersetzt supabase-js durch einen nachgebauten Klienten (erst,
   wenn backend.js gelaufen ist – Backend bleibt im Demo-Betrieb; nur
   livechat.js bekommt den Kanal). Der Präsenzkanal meldet SUBSCRIBED nach
   KANAL_MS (Standard 300 ms ≈ Verbindung + Beitritt über 4G) und dann,
   wer da ist: Emmy im Hauptraum, Otto in „Ottos Raum“. Rechner 4×
   gebremst (Telefon), echte Tipps (Berührung). Nur min/ (vorher
   node werkzeug/fassung-setzen.js --nur-stempel).
     Q  Bau: kzEreignisSetzen, kzNurName, kzWohinText im Kern (app-teile.json
        „kern“, in min/app.js echte Funktionen); raumVorbereiten ruft
        dmaPraesenzLos, die 4 s rufen dieselbe Funktion
     A  früher Tipp (Gast, gleich nach „bereit“): Kanal ≤ 150 ms nach dem
        Tipp offen, erst nach dem ersten Bild des Klassenzimmers; Emmy in
        „DIE RÄUME“ und im Laufband ≤ KANAL_MS + 300 ms; ein zweiter Tipp,
        „Wissen“ und die 4 s öffnen nichts Zweites (genau ein Kanal, ein
        Aufruf von praesenzZuhoeren aus app.js, ein Mithörer fürs Laufband);
        kein synchroner Abruf, keine Seitenfehler
     B  ohne Tipp: wie bisher – kein Kanal vor 3,9 s nach dem Start von
        app.js, danach genau einer (kein Mehrverbrauch beim Seitenstart)
     C  Konto, die Anmeldung lädt noch (früher Tipp): der Kanal trägt die
        Konto-Kennung aus dem Gerät (sb-…-auth-token, sonst dma_lc_konto) –
        wie livechat.js beim Betreten – statt einer Zufallskennung
     D  Raum-Stücke zurückgehalten (langsame Leitung) und die Antwort des
        Kanals bringt Ereignisse fürs Laufband (Otto macht einen Raum auf):
        kein synchroner Abruf eines Raum-Stücks
     E  Rückkehr nach dem Neuladen (raumVorbereiten noch im Start von
        app.js): keine Seitenfehler, genau ein Kanal mit der Konto-Kennung,
        nach „drin“ setzt app.js die Kennung des Raums nicht mehr neu
        (vorher: nach 4 s praesenzZuhoeren("") – livechat.js nimmt daran
        „andere da“ ab)
     G  supabase-js kommt spät (nach den 4 s): der nächste Tipp öffnet den
        Kanal (vorher: nie, bis zum Betreten)
     M  Messung (nur mit GEGEN=<wurzel A>): A (GEGEN) und B (WURZEL)
        verschränkt, PAARE Paare (Standard 10): Tipp → Emmy in „DIE RÄUME“,
        Tipp → Knopf „Betreten“, früher Tipp und später Tipp (5 s nach dem
        Start; PAARE_SPAET, Standard 5)
   Aufruf: node werkzeug/pruefe-885-praesenz.js
           WURZEL=<stand> node werkzeug/pruefe-885-praesenz.js   (Gegenprobe)
           GEGEN=<stand vorher> node werkzeug/pruefe-885-praesenz.js (mit M)
           NUR=A,C …  nur diese Abschnitte im Browser (Q läuft immer)
   EHRLICH: der Kanal ist nachgebaut (fester Zeitpunkt). Draußen hängt die
   Zeit bis „Emmy steht da“ an der Leitung (Verbindung + Beitritt); der
   Gewinn ist der Teil der 4 s, der beim Tipp noch übrig war.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : "";
const CPU = Number(process.env.CPU || 4);
const KANAL_MS = Number(process.env.KANAL_MS || 300);
const PAARE = Number(process.env.PAARE || 10), PAARE_SPAET = Number(process.env.PAARE_SPAET || 5);
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg",
  ".woff2": "font/woff2", ".gif": "image/gif", ".webmanifest": "application/manifest+json" };
let fehler = 0;
const rot = [];
let abschnitt = "";
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; rot.push(abschnitt); }
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const titel = (k, t) => { abschnitt = k; console.log("\n" + k + ") " + t + "\n"); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const lies = (p) => { try { return fs.readFileSync(p, "utf8"); } catch (e) { return ""; } };
const NUR = (process.env.NUR || "").split(",").map((x) => x.trim()).filter(Boolean);
const lauf = (k) => !NUR.length || NUR.indexOf(k) >= 0;
const KONTO = "aaaaaaaa-1111-4222-8333-444444444444", LC_KONTO = "bbbbbbbb-1111-4222-8333-555555555555";
const LEUTE = { "u-emmy": [{ name: "Emmy", raum: "klassenzimmer", seit: 1 }], "u-otto": [{ name: "Otto", raum: "ottos-raum", seit: 2 }] };
const med = (a) => { const s = a.filter((x) => x != null && isFinite(x)).sort((x, y) => x - y); if (!s.length) return NaN; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/* In jeder Seite, vor allen Skripten: synchrone Abrufe zählen, LiveChat und supabase-js nachgebaut beobachten. */
function seitenSonde(o) {
  o = o || {};
  window.__sync = [];
  const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u, a) {
    const rest = Array.prototype.slice.call(arguments, 2);
    if (a === false) { this.__sondeSync = String(u); u = String(u) + (String(u).indexOf("?") < 0 ? "?" : "&") + "sonde-sync=1"; }
    return open.apply(this, [m, u].concat(rest));
  };
  XMLHttpRequest.prototype.send = function () {
    if (!this.__sondeSync) return send.apply(this, arguments);
    const a = performance.now();
    try { return send.apply(this, arguments); }
    finally { window.__sync.push({ u: this.__sondeSync.replace(/\?.*$/, ""), a: Math.round(a), d: Math.round(performance.now() - a) }); }
  };
  try {
    localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus");
    if (!sessionStorage.getItem("dma-neu-geladen")) sessionStorage.setItem("dma-neu-geladen", "x");
    if (o.konto) localStorage.setItem("sb-sonde-auth-token", JSON.stringify({ user: { id: o.konto } }));
    if (o.lcKonto) localStorage.setItem("dma_lc_konto", o.lcKonto);
    if (o.rueckkehr) sessionStorage.setItem("dma_livechat_zurueck", JSON.stringify({ raum: "sonde885praesenz", name: "Sonde", mitBild: false, zeit: Date.now() }));
  } catch (e) {}
  const P = window.__p = { kanaele: [], zuhoeren: [], horcher: 0, horcherKz: 0, init: 0, tipps: [] };
  let ini;
  Object.defineProperty(window, "__dmaAppInitialized", { configurable: true, get: () => ini,
    set: (v) => { ini = v; if (v && !P.init) P.init = performance.now(); } });
  /* LiveChat: Aufrufe aus app.js mitschreiben (livechat.js ruft seine eigenen Funktionen direkt, nicht über das Objekt) */
  let lc;
  Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => {
    lc = v;
    try {
      const z = v.praesenzZuhoeren, b = v.beiPraesenz;
      v.praesenzZuhoeren = function (id) {
        P.zuhoeren.push({ t: performance.now(), id: String(id), lage: (v.lage && v.lage().lage) || "" });
        return z.apply(this, arguments);
      };
      v.beiPraesenz = function (f) { P.horcher++; if (/kzDaJetzt/.test(String(f))) P.horcherKz++; return b.apply(this, arguments); };
    } catch (e) {}
  } });
  /* supabase-js nachgebaut: Kanäle mitschreiben; der Präsenzkanal meldet nach kanalMs SUBSCRIBED und wer da ist */
  const kanalMs = o.kanalMs || 300;
  const leute = o.leute || {};
  const FAKE = { createClient: () => ({
    realtime: { connect() {}, isConnected: () => false },
    channel(name, opt) {
      const k = { name, key: (((opt || {}).config || {}).presence || {}).key, t: performance.now(), h: {}, st: {}, ok: 0,
        on(art, f, fn) { const ev = (f && f.event) || art; (this.h[ev] = this.h[ev] || []).push(fn); return this; },
        subscribe(fn) {
          setTimeout(() => {
            if (name === "dma-klassenzimmer-da") this.st = JSON.parse(JSON.stringify(leute));
            this.ok = performance.now();
            try { if (fn) fn("SUBSCRIBED"); } catch (e) {}
            (this.h.sync || []).forEach((g) => { try { g(); } catch (e) {} });
          }, kanalMs);
          return this;
        },
        presenceState() { return this.st; },
        track() { return Promise.resolve("ok"); }, untrack() { return Promise.resolve("ok"); },
        send() { return Promise.resolve("ok"); }, unsubscribe() { return Promise.resolve("ok"); } };
      P.kanaele.push(k);
      return k;
    },
    removeChannel() { return Promise.resolve("ok"); }, getChannels: () => [],
    from() {
      const q = {}; ["select", "eq", "neq", "in", "gte", "lte", "gt", "lt", "order", "limit", "insert", "update", "upsert", "delete", "ilike", "or", "is", "not", "range"]
        .forEach((n) => { q[n] = () => q; });
      q.maybeSingle = () => Promise.resolve({ data: null, error: null });
      q.single = () => Promise.resolve({ data: null, error: null });
      q.then = (ok, no) => Promise.resolve({ data: [], error: null }).then(ok, no);
      return q;
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
    functions: { invoke: () => Promise.resolve({ data: null, error: { message: "sonde" } }) },
    auth: { getSession: () => Promise.resolve({ data: { session: null } }),
      signInAnonymously: () => Promise.resolve({ data: { session: null }, error: { message: "sonde" } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) }
  }) };
  /* erst nach backend.js (Backend bleibt Demo); G: erst ab supaAb ms nach dem Öffnen */
  Object.defineProperty(window, "supabase", { configurable: true, set() {}, get() {
    if (o.supaAb != null && performance.now() < o.supaAb) return undefined;
    try { return typeof Backend !== "undefined" ? FAKE : undefined; } catch (e) { return undefined; }
  } });
  /* Tipp auf „Klassenzimmer“: Zeit bis Knopf „Betreten“, bis Emmy in „DIE RÄUME“, bis Emmy im Laufband (rAF) */
  document.addEventListener("click", (ev) => {
    if (!ev.target || !ev.target.closest || !ev.target.closest('[data-sub="sub-livechat"]')) return;
    const m = { t: ev.timeStamp, knopf: 0, leute: 0, ticker: 0, kanal: 0 };
    P.tipps.push(m);
    const schau = () => {
      const jetzt = performance.now();
      if (!m.knopf && document.getElementById("lcBetreten")) m.knopf = jetzt - m.t;
      const rl = document.getElementById("lcRaumListe");
      if (!m.leute && rl && /Emmy/.test(rl.textContent)) m.leute = jetzt - m.t;
      const tk = document.getElementById("tickerTrack");
      if (!m.ticker && tk && /Emmy/.test(tk.textContent)) m.ticker = jetzt - m.t;
      if ((!m.knopf || !m.leute || !m.ticker) && jetzt - m.t < 15000) requestAnimationFrame(schau);
    };
    requestAnimationFrame(schau);
  }, true);
}

/* Server: ein Stand je Server (für M zwei) */
function server(wurzel) {
  const anfragen = [];
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i)); if (p === "/") p = "/index.html";
    anfragen.push({ p, sync: /[?&]sonde-sync=1/.test(q.url), t: Date.now() });
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    a.end(fs.readFileSync(f));
  }).listen(0);
  return { srv, anfragen, lauscht: new Promise((r) => srv.on("listening", r)), url: () => "http://127.0.0.1:" + srv.address().port };
}

(async () => {
  console.log("Stand: " + WURZEL + (GEGEN ? "   (M gegen " + GEGEN + ")" : ""));
  /* ---------- Q) Bau ---------- */
  titel("Q", "DER BAU");
  const liste = JSON.parse(lies(path.join(WURZEL, "werkzeug/app-teile.json")) || "{}");
  const minApp = lies(path.join(WURZEL, "min/app.js"));
  const DREI = ["kzEreignisSetzen", "kzNurName", "kzWohinText"];
  const kern = Array.isArray(liste.kern) ? liste.kern : [];
  sage(DREI.every((n) => kern.includes(n)), "app-teile.json „kern“ nennt kzEreignisSetzen, kzNurName, kzWohinText (Rückruf des Präsenzkanals)",
    DREI.filter((n) => !kern.includes(n)).join(", ") || "alle drei");
  const platz = DREI.filter((n) => new RegExp("function " + n + "\\([^)]*\\)\\{return dmaTeilRufA?\\(").test(minApp));
  sage(minApp && !platz.length, "in min/app.js sind sie echte Funktionen (kein Platzhalter, der ein Raum-Stück holt)", platz.length ? "Platzhalter: " + platz.join(", ") : "ok");
  const rv = (minApp.match(/function raumVorbereiten\(\)\{[\s\S]*?\n?function /) || [""])[0];
  sage(/dmaPraesenzLos/.test(rv), "raumVorbereiten (Tipp, Rückkehr, Betreten) startet die Präsenz (dmaPraesenzLos)", rv ? "" : "raumVorbereiten nicht gefunden");
  sage(/setTimeout\(dmaPraesenzLos,4e3\)/.test(minApp), "die 4 s nach dem Start rufen dieselbe Funktion (einmal, wer zuerst kommt)");

  const S = server(WURZEL); await S.lauscht;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  /* teile: { halten: /…/ } hält diese app-Stücke zurück, bis freigeben(pg) */
  async function fenster(o, teile) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.addInitScript(seitenSonde, Object.assign({ kanalMs: KANAL_MS, leute: LEUTE }, o || {}));
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e).split("\n")[0]));
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    pg.__gehalten = [];
    await pg.route(/\/min\/app-teil-\w+\.js/, (r) => {
      const u = r.request().url(), t = (u.match(/app-teil-(\w+)\.js/) || [])[1] || "";
      if (/[?&]sonde-sync=1/.test(u) || !teile) return r.continue().catch(() => {});
      if (teile.halten && teile.halten.test(t)) { pg.__gehalten.push(r); return; }
      r.continue().catch(() => {});
    });
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    return { ctx, pg };
  }
  const freigeben = (pg) => { pg.__gehalten.splice(0).forEach((r) => r.continue().catch(() => {})); };
  const bereit = (pg) => pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND && window.DMA_TEILE
    && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 60000, polling: 20 });
  const tippe = async (pg, sel) => {
    const b = await pg.evaluate((s) => {
      const e = [...document.querySelectorAll(s)].find((x) => x.getBoundingClientRect().height > 0);
      if (!e) return null;
      e.scrollIntoView({ block: "center", behavior: "instant" });
      const r = e.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, sel);
    if (b) await pg.touchscreen.tap(b.x, b.y);
    return Boolean(b);
  };
  const WISSEN = '.tape-tab[data-target="view-knowledge"]', KZ = '#knowledgeSubnav [data-sub="sub-livechat"]';
  /* Wissen, dann Klassenzimmer (echte Tipps) */
  const insKlassenzimmer = async (pg) => {
    await tippe(pg, WISSEN);
    await pg.waitForFunction((s) => { const e = document.querySelector(s); return e && e.getBoundingClientRect().height > 0; }, KZ, { timeout: 15000, polling: 20 }).catch(() => {});
    return tippe(pg, KZ);
  };
  const stand = (pg) => pg.evaluate(() => {
    const P = window.__p;
    const pk = P.kanaele.filter((k) => k.name === "dma-klassenzimmer-da");
    return { init: Math.round(P.init), jetzt: Math.round(performance.now()),
      kanaele: pk.map((k) => ({ t: Math.round(k.t), ok: Math.round(k.ok), key: String(k.key) })),
      alle: P.kanaele.map((k) => k.name), zuhoeren: P.zuhoeren.map((z) => ({ t: Math.round(z.t), id: z.id, lage: z.lage })),
      horcher: P.horcher, horcherKz: P.horcherKz,
      tipps: P.tipps.map((m) => ({ t: Math.round(m.t), knopf: Math.round(m.knopf), leute: Math.round(m.leute), ticker: Math.round(m.ticker) })),
      sync: window.__sync.slice(), sofort: (window.DMA_TEIL_SOFORT || []).slice(),
      lage: window.LiveChat && window.LiveChat.lage ? window.LiveChat.lage().lage : "" };
  });
  const syncText = (s) => s.sync.map((x) => x.u.replace(/^.*\//, "") + " " + x.d + " ms").concat(s.sofort).join(", ");

  /* ---------- A) früher Tipp ---------- */
  titel("A", "FRÜHER TIPP AUF „KLASSENZIMMER“ (GAST)");
  if (lauf("A")) {
    const { ctx, pg } = await fenster();
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    await insKlassenzimmer(pg);
    await schlaf(KANAL_MS + 900);
    const s1 = await stand(pg);
    const m = s1.tipps[0] || {};
    const k = s1.kanaele[0];
    const kNach = k && m.t ? k.t - m.t : null;
    console.log("  info App-Start " + s1.init + " ms, Tipp " + (m.t || "–") + " ms (" + (m.t ? m.t - s1.init : "–") + " ms nach dem Start von app.js)");
    sage(k && kNach >= 0 && kNach <= 150, "der Präsenzkanal geht beim Tipp auf (≤ 150 ms danach)", k ? Math.round(kNach) + " ms nach dem Tipp" : "noch kein Kanal");
    sage(k && m.knopf && kNach >= m.knopf - 20, "erst das Bild des Klassenzimmers, dann die Leitung", k && m.knopf ? "Knopf nach " + m.knopf + " ms, Kanal nach " + Math.round(kNach) + " ms" : "–");
    sage(m.leute > 0 && m.leute <= KANAL_MS + 300, "„DIE RÄUME“ zeigt Emmy ≤ " + (KANAL_MS + 300) + " ms nach dem Tipp", m.leute ? m.leute + " ms" : "nach " + (s1.jetzt - (m.t || 0)) + " ms noch nicht");
    sage(m.ticker > 0 && m.ticker <= KANAL_MS + 400, "das Laufband nennt Emmy ≤ " + (KANAL_MS + 400) + " ms nach dem Tipp", m.ticker ? m.ticker + " ms" : "noch nicht");
    /* zweiter Tipp, Wissen hin und her, und über die 4 s hinaus */
    await tippe(pg, '.tape-tab[data-target="view-learn"]').catch(() => {});
    await schlaf(200);
    await insKlassenzimmer(pg);
    const bis = Math.max(0, s1.init + 5500 - (await pg.evaluate(() => performance.now())));
    await schlaf(bis + 300);
    const s2 = await stand(pg);
    sage(s2.kanaele.length === 1, "genau ein Präsenzkanal (zweiter Tipp, „Lernen“, die 4 s)", s2.kanaele.length + " · alle Kanäle: " + (s2.alle.join(", ") || "–"));
    sage(s2.zuhoeren.length === 1, "app.js ruft praesenzZuhoeren genau einmal", s2.zuhoeren.length + "× (" + s2.zuhoeren.map((z) => z.t + " ms").join(", ") + ")");
    sage(s2.horcherKz === 1, "ein Mithörer fürs Laufband und die Online-Liste", s2.horcherKz + "× (alle beiPraesenz: " + s2.horcher + ")");
    sage(!s2.sync.length && !s2.sofort.length, "kein synchroner Abruf", syncText(s2) || "0");
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
    await ctx.close();
  }

  /* ---------- B) ohne Tipp ---------- */
  titel("B", "OHNE TIPP: WIE BISHER NACH 4 s");
  if (lauf("B")) {
    const { ctx, pg } = await fenster();
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    const init = await pg.evaluate(() => window.__p.init);
    const bisVor = Math.max(0, init + 3800 - (await pg.evaluate(() => performance.now())));
    await schlaf(bisVor);
    const vor = await stand(pg);
    await schlaf(Math.max(0, init + 5000 - (await pg.evaluate(() => performance.now()))));
    const nach = await stand(pg);
    const k = nach.kanaele[0];
    sage(!vor.kanaele.length, "kein Präsenzkanal vor 3,8 s nach dem Start von app.js", vor.kanaele.length ? "Kanal nach " + (vor.kanaele[0].t - init) + " ms" : "keiner (" + (vor.jetzt - init) + " ms)");
    sage(nach.kanaele.length === 1 && k.t - init >= 3900 && k.t - init <= 4600, "genau einer nach 4 s, wie bisher", k ? (k.t - init) + " ms nach dem Start" : "keiner");
    sage(nach.zuhoeren.length === 1 && nach.horcherKz === 1, "ein Aufruf, ein Mithörer", nach.zuhoeren.length + " / " + nach.horcherKz);
    sage(!nach.sync.length && !nach.sofort.length && !pg.__fehler.length, "kein synchroner Abruf, keine Seitenfehler", (syncText(nach) + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
    await ctx.close();
  }

  /* ---------- C) Konto, Anmeldung lädt noch ---------- */
  titel("C", "KONTO, DIE ANMELDUNG LÄDT NOCH: DIE KENNUNG AUS DEM GERÄT");
  if (lauf("C")) {
    for (const [fall, o, soll] of [["sb-…-auth-token", { konto: KONTO, lcKonto: LC_KONTO }, KONTO], ["nur dma_lc_konto", { lcKonto: LC_KONTO }, LC_KONTO]]) {
      const { ctx, pg } = await fenster(o);
      await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await insKlassenzimmer(pg);
      await schlaf(KANAL_MS + 500);
      const s = await stand(pg);
      const k = s.kanaele[0];
      sage(k && k.key === soll, fall + ": der Präsenzkanal trägt die Konto-Kennung (wie livechat.js beim Betreten)", k ? "Schlüssel " + k.key : "noch kein Kanal");
      sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 2).join(" | "));
      await ctx.close();
    }
  }

  /* ---------- D) Raum-Stücke zurückgehalten ---------- */
  titel("D", "RAUM-STÜCKE ZURÜCKGEHALTEN, DER KANAL BRINGT EREIGNISSE FÜRS LAUFBAND");
  if (lauf("D")) {
    const { ctx, pg } = await fenster(null, { halten: /^raum/ });
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    await insKlassenzimmer(pg);
    const init = await pg.evaluate(() => window.__p.init);
    await schlaf(Math.max(KANAL_MS + 800, init + 5000 - (await pg.evaluate(() => performance.now()))));
    const s = await stand(pg);
    const lauftext = await pg.evaluate(() => (document.getElementById("tickerTrack") || {}).textContent || "");
    const raumDa = await pg.evaluate(() => Object.keys(window.DMA_TEILE.stand().da).filter((t) => /^raum/.test(t)).length);
    console.log("  info Raum-Stücke eingesetzt: " + raumDa + " · Laufband: " + (lauftext.match(/[^·•]*Otto[^·•]*/) || [""])[0].trim().slice(0, 80));
    sage(/Otto/.test(lauftext), "der Rückruf lief (Otto steht im Laufband)");
    sage(!s.sync.length && !s.sofort.length, "kein synchroner Abruf eines Raum-Stücks", syncText(s) || "0");
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 2).join(" | "));
    freigeben(pg);
    await ctx.close();
  }

  /* ---------- E) Rückkehr nach dem Neuladen ---------- */
  titel("E", "RÜCKKEHR NACH DEM NEULADEN (raumVorbereiten NOCH IM START)");
  if (lauf("E")) {
    const { ctx, pg } = await fenster({ rueckkehr: true, konto: KONTO });
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    await pg.waitForFunction(() => window.LiveChat.lage().lage === "drin", null, { timeout: 30000, polling: 50 }).catch(() => {});
    const drinAb = await pg.evaluate(() => performance.now());
    const init = await pg.evaluate(() => window.__p.init);
    await schlaf(Math.max(500, init + 5500 - drinAb));
    const s = await stand(pg);
    const k = s.kanaele[0];
    const spaet = s.zuhoeren.filter((z) => z.lage === "drin" && (!k || z.id !== k.key));
    console.log("  info drin nach " + Math.round(drinAb - init) + " ms; app.js ruft praesenzZuhoeren: " + (s.zuhoeren.map((z) => (z.t - init) + " ms „" + z.id.slice(0, 8) + "“ " + z.lage).join(", ") || "nie"));
    sage(s.lage === "drin", "zurück im Raum", s.lage);
    sage(s.kanaele.length === 1 && k.key === KONTO, "genau ein Präsenzkanal, mit der Konto-Kennung", s.kanaele.length + (k ? " · " + k.key : ""));
    sage(!spaet.length, "nach „drin“ setzt app.js die Kennung des Raums nicht neu", spaet.length ? spaet.map((z) => (z.t - init) + " ms mit „" + z.id + "“").join(", ") : "ok");
    sage(!s.sync.length && !s.sofort.length && !pg.__fehler.length, "kein synchroner Abruf, keine Seitenfehler", (syncText(s) + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
    await ctx.close();
  }

  /* ---------- G) supabase-js kommt spät ---------- */
  titel("G", "SUPABASE-JS KOMMT ERST NACH DEN 4 s");
  if (lauf("G")) {
    const { ctx, pg } = await fenster({ supaAb: 1e9 });
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    await insKlassenzimmer(pg);
    const init = await pg.evaluate(() => window.__p.init);
    await schlaf(Math.max(0, init + 4600 - (await pg.evaluate(() => performance.now()))));
    const vor = await stand(pg);
    await pg.evaluate(() => { Object.defineProperty(window, "__sondeSupaJetzt", { value: 1 }); });
    /* jetzt ist supabase-js da (die Sonde gibt den nachgebauten Klienten ab hier heraus) */
    await pg.evaluate(() => { const d = Object.getOwnPropertyDescriptor(window, "supabase"); const g = d.get;
      Object.defineProperty(window, "supabase", { configurable: true, set() {}, get() { try { return typeof Backend !== "undefined" ? (g.call(window) || window.__sondeFake) : undefined; } catch (e) { return undefined; } } }); });
    await pg.evaluate(() => { /* den nachgebauten Klienten aus seitenSonde holen: einmal mit supaAb = 0 */ });
    await ctx.close();
    /* einfacher und sauber: eigener Lauf, supabase-js ab 4,6 s */
    const f2 = await fenster({ supaAb: 0 });
    const pg2 = f2.pg;
    await pg2.addInitScript(() => {});
    await f2.ctx.close();
    const { ctx: c3, pg: p3 } = await fenster({ supaAb: 4800 });
    await p3.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(p3);
    await insKlassenzimmer(p3);
    await schlaf(Math.max(0, 5000 - (await p3.evaluate(() => performance.now()))));
    const s1 = await stand(p3);
    await insKlassenzimmer(p3);
    await schlaf(KANAL_MS + 600);
    const s2 = await stand(p3);
    sage(!vor.kanaele.length && !s1.kanaele.length, "ohne supabase-js kein Kanal (Tipp und die 4 s gehen ins Leere)", s1.kanaele.length + " Kanal");
    sage(s2.kanaele.length === 1, "der nächste Tipp danach öffnet ihn (genau einen)", s2.kanaele.length + " · praesenzZuhoeren " + s2.zuhoeren.length + "× · Mithörer " + s2.horcherKz);
    sage(s2.tipps.length >= 2 && s2.tipps[s2.tipps.length - 1].leute > 0, "„DIE RÄUME“ zeigt Emmy nach diesem Tipp", s2.tipps.length ? (s2.tipps[s2.tipps.length - 1].leute || "nie") + " ms" : "–");
    sage(!p3.__fehler.length, "keine Seitenfehler", p3.__fehler.slice(0, 2).join(" | "));
    await c3.close();
  }

  /* ---------- M) Messung A/B ---------- */
  if (GEGEN && lauf("M")) {
    titel("M", "MESSUNG: A = " + GEGEN + ", B = " + WURZEL + " (verschränkt)");
    const SA = server(GEGEN); await SA.lauscht;
    const staende = { A: SA, B: S };
    const erg = { frueh: { A: [], B: [] }, spaet: { A: [], B: [] } };
    for (const [art, paare, warte] of [["frueh", PAARE, 0], ["spaet", PAARE_SPAET, 5000]]) {
      for (let i = 0; i < paare; i++) {
        for (const st of (i % 2 ? ["B", "A"] : ["A", "B"])) {
          const { ctx, pg } = await fenster();
          await pg.goto(staende[st].url() + "/index.html", { waitUntil: "commit" });
          await bereit(pg);
          const bereitT = await pg.evaluate(() => performance.now());
          if (warte) await schlaf(Math.max(0, warte - bereitT));
          await insKlassenzimmer(pg);
          await pg.waitForFunction(() => { const m = window.__p.tipps[0]; return m && m.leute && m.knopf; }, null, { timeout: 15000, polling: 50 }).catch(() => {});
          const s = await stand(pg);
          const m = s.tipps[0] || {};
          const k = s.kanaele[0];
          erg[art][st].push({ leute: m.leute || null, knopf: m.knopf || null, ticker: m.ticker || null, tippNachStart: m.t ? m.t - s.init : null,
            kanal: k && m.t ? k.t - m.t : null, bereit: Math.round(bereitT), fehler: pg.__fehler.length, sync: s.sync.length });
          await ctx.close();
        }
      }
      const A = erg[art].A, B = erg[art].B;
      console.log("\n  " + (art === "frueh" ? "früher Tipp (gleich nach „bereit“)" : "später Tipp (" + warte / 1000 + " s nach dem Öffnen)") + ", " + A.length + " Paare, Median ms:");
      for (const mass of ["leute", "ticker", "knopf", "kanal", "tippNachStart", "bereit"]) {
        const d = A.map((a, j) => (B[j][mass] != null && a[mass] != null ? B[j][mass] - a[mass] : null)).filter((x) => x != null);
        const hoch = d.filter((x) => x > 0).length, tief = d.filter((x) => x < 0).length;
        console.log("    " + mass.padEnd(14) + String(Math.round(med(A.map((x) => x[mass])))).padStart(7) + " → " + String(Math.round(med(B.map((x) => x[mass])))).padStart(7)
          + "   B−A gepaart " + Math.round(med(d)) + " (" + tief + "↓/" + hoch + "↑)");
      }
      sage(A.concat(B).every((x) => !x.fehler && !x.sync), art + ": keine Seitenfehler, kein synchroner Abruf");
    }
    const datei = process.env.MESS_JSON || "";
    if (datei) fs.writeFileSync(datei, JSON.stringify(erg, null, 1));
    SA.srv.close();
  }

  await br.close();
  S.srv.close();
  console.log("\n" + (fehler ? fehler + " ROT (" + Array.from(new Set(rot)).join(", ") + ")" : "ALLES GRÜN"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
