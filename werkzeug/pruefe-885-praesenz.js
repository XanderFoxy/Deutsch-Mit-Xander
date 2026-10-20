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
   NACHBESSERUNG 1 (Prüfer): Die Rückkehr nach dem Neuladen (und raumDrin
   ohne vorherigen Klick auf die Pille) öffnet früh nur den Kanal; den
   Mithörer fürs Laufband gibt es dort wie bis 884 erst nach 4 s. Im
   Zwischenstand 09fedd06 kam er dort schon beim ersten Bild, bekam den noch
   leeren Stand als erste Aufnahme, und das Laufband meldete alle, die längst
   da waren (nach dem Neuladen auch einen selbst), als „gerade gekommen“.
   NACHBESSERUNG 2 (Prüfer): Der Einladungslink geht NICHT über raumDrin,
   sondern klickt die Pille (app.js „EIN EINLADUNGSLINK …“: pille.click()) –
   wie Benachrichtigung, Briefkasten, Unterricht-Einladung und Notweg-Ziel.
   Er ist also der Tipp-Weg (Teil L, neu); F ruft LiveChat.betreten direkt,
   ein Weg, den keine Oberfläche nimmt (nur der Schutz für raumDrin).

   Die Sonde ersetzt supabase-js durch einen nachgebauten Klienten (erst,
   wenn backend.js gelaufen ist – Backend bleibt im Demo-Betrieb; nur
   livechat.js bekommt den Kanal). Der Präsenzkanal meldet SUBSCRIBED nach
   KANAL_MS (Standard 300 ms ≈ Verbindung + Beitritt über 4G) und dann,
   wer da ist: Emmy im Hauptraum, Otto in „Ottos Raum“; wer sich selbst
   einträgt (track), steht 100 ms später auch darin. Rechner 4×
   gebremst (Telefon), echte Tipps (Berührung). Nur min/ (vorher
   node werkzeug/fassung-setzen.js --nur-stempel).
     Q  Bau: kzEreignisSetzen, kzNurName, kzWohinText im Kern (app-teile.json
        „kern“, in min/app.js echte Funktionen); raumVorbereiten ruft
        dmaPraesenzLos, die 4 s rufen dieselbe Funktion; nur der Tipp auf die
        Pille gibt raumVorbereiten „tipp“ mit, Rückkehr und Betreten nicht,
        und ohne „tipp“ meldet dmaPraesenzLos keinen Mithörer an
     A  früher Tipp (Gast, gleich nach „bereit“): Kanal gleich nach dem
        ersten Bild des Klassenzimmers offen (≤ Knopf + 200 ms, ≤ 500 ms nach
        dem Tipp), nicht davor; Emmy in
        „DIE RÄUME“ ≤ KANAL_MS + 500 ms, im Laufband ≤ KANAL_MS + 600 ms; ein zweiter Tipp,
        „Wissen“ und die 4 s öffnen nichts Zweites (genau ein Kanal, ein
        Aufruf von praesenzZuhoeren aus app.js, ein Mithörer fürs Laufband);
        kein synchroner Abruf, keine Seitenfehler
     B  ohne Tipp: wie bisher – kein Kanal vor 3,8 s nach dem Start von
        app.js, danach genau einer (kein Mehrverbrauch beim Seitenstart; die
        obere Grenze ist nur „bis 8 s“: der Zeitgeber feuert bei gebremstem
        Rechner auch einmal spät)
     C  Konto, die Anmeldung lädt noch (früher Tipp): der Kanal trägt die
        Konto-Kennung aus dem Gerät (sb-…-auth-token, sonst dma_lc_konto) –
        wie livechat.js beim Betreten – statt einer Zufallskennung
     D  Raum-Stücke zurückgehalten (langsame Leitung), und nach dem ersten
        Stand kommt jemand dazu (Lena macht „Lenas Raum“ auf): das Ereignis
        steht im Laufband, kein synchroner Abruf eines Raum-Stücks. „Otto
        macht gerade … auf“ ist KEIN Erfolg (Otto war schon da) – das ist
        der Fehler beim ersten Öffnen nach dem Tipp (Offen 1, in 2ea2044c nach
        den 4 s genauso) und wird nur genannt
     E  Rückkehr nach dem Neuladen (raumVorbereiten noch im Start von
        app.js), mit Konto und als Gast: keine Seitenfehler, genau ein Kanal
        mit der Konto- bzw. Raum-Kennung, nach „drin“ übergibt app.js keine
        andere Kennung (vorher: nach 4 s praesenzZuhoeren(u ? u.id : "") –
        lädt die Anmeldung noch oder ist es ein Gast, hält livechat.js den
        eigenen Eintrag für „andere da“); der Mithörer fürs Laufband kommt
        wie bis 884 erst nach 3,8 s, und das Laufband meldet niemanden, der
        beim Öffnen schon da war (auch nicht einen selbst), als „gekommen“,
        „macht gerade … auf“ oder „gewechselt“ (gegen 2ea2044c grün, gegen
        09fedd06 rot)
     F  raumDrin ohne vorherigen Klick auf die Pille (Gast, LiveChat.betreten
        direkt, vor den 4 s – kein Weg der Oberfläche, die klickt vorher
        immer die Pille; über die Oberfläche kommt raumDrin ohne Klick nur
        bei der Rückkehr, E): dasselbe wie E. Beweist nichts für den
        Einladungslink – dafür L
     G  supabase-js kommt spät (nach den 4 s): der nächste Tipp öffnet den
        Kanal (vorher: nie, bis zum Betreten)
     L  der echte Einladungslink (index.html#raum=sonde885einl, Gast): die
        Seite klickt die Pille selbst; Kanal und Mithörer fürs Laufband
        kommen mit diesem Klick (Tipp-Weg, S3), „DIE RÄUME“ zeigt Emmy mit
        der Antwort des Kanals; genau ein Kanal, ein Aufruf, ein Mithörer;
        einmal ohne hineinzugehen, einmal hinein (Aufruf 0,3 s nach dem
        Klick, wie Benachrichtigung und Briefkasten; Kennung wie E); kein
        synchroner Abruf eines Raum-Stücks. Was das Laufband dabei meldet,
        steht nur als „info“ da (Offen 1, nicht freigegeben zu ändern), der
        synchrone Abruf von rest2 (wortschatzHolenFuer, schon in 884) auch
     M  Messung (nur mit GEGEN=<wurzel A>): A (GEGEN) und B (WURZEL)
        verschränkt, PAARE Paare (Standard 10): Tipp → Emmy in „DIE RÄUME“,
        Tipp → Knopf „Betreten“, früher Tipp und später Tipp (5 s nach dem
        Start; PAARE_SPAET, Standard 5)
     R  Messung Rückkehr nach dem Neuladen (nur mit GEGEN=, Konto, PAARE_R
        Paare, Standard 7, verschränkt): „drin“ ab dem Öffnen, Kanal ab dem
        Öffnen, falsche „gekommen“-Meldungen im Laufband
     LM Messung (nur mit GEGEN=, Gast, PAARE_L Paare, Standard 5,
        verschränkt): Einladungslink ohne hineinzugehen und mit Hineingehen,
        dazu „Tipp auf Klassenzimmer, gleich hinein“: Klick, Antwort des
        Kanals, Emmy in „DIE RÄUME“, Mithörer, „drin“ ab dem Start von
        app.js, Läufe mit Meldungen über Leute, die schon da waren
   Aufruf: node werkzeug/pruefe-885-praesenz.js
           WURZEL=<stand> node werkzeug/pruefe-885-praesenz.js   (Gegenprobe)
           GEGEN=<stand vorher> node werkzeug/pruefe-885-praesenz.js (mit M, R und LM)
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
const PAARE = Number(process.env.PAARE || 10), PAARE_SPAET = Number(process.env.PAARE_SPAET || 5), PAARE_R = Number(process.env.PAARE_R || 7);
const PAARE_L = Number(process.env.PAARE_L || 5);
const LINK = "sonde885einl";
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
  const P = window.__p = { kanaele: [], zuhoeren: [], horcher: 0, horcherKz: 0, kzReg: [], init: 0, drin: 0, tipps: [] };
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
      v.beiPraesenz = function (f) {
        P.horcher++;
        if (/kzDaJetzt/.test(String(f))) {
          P.horcherKz++;
          /* leer = der Präsenzkanal hatte noch nicht geantwortet: dann ist die erste Aufnahme {} */
          const pk = P.kanaele.filter((k) => k.name === "dma-klassenzimmer-da")[0];
          P.kzReg.push({ t: performance.now(), leer: !(pk && pk.ok) });
        }
        return b.apply(this, arguments);
      };
      if (v.beiAenderung) v.beiAenderung((l) => { if (l && l.lage === "drin" && !P.drin) P.drin = performance.now(); });
    } catch (e) {}
  } });
  /* supabase-js nachgebaut: Kanäle mitschreiben; der Präsenzkanal meldet nach kanalMs SUBSCRIBED und wer da ist */
  const kanalMs = o.kanalMs || 300;
  const leute = o.leute || {};
  const FAKE = { createClient: () => ({
    realtime: { connect() {}, isConnected: () => false },
    channel(name, opt) {
      const k = { name, key: (((opt || {}).config || {}).presence || {}).key, t: performance.now(), h: {}, st: {}, eigen: {}, ok: 0,
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
        presenceState() { return Object.assign({}, this.st, this.ok ? this.eigen : {}); },
        /* sich selbst eintragen: 100 ms später (Rundreise) steht man im Stand wie alle anderen */
        melde() { setTimeout(() => { if (this.ok) ["join", "sync"].forEach((ev) => (this.h[ev] || []).forEach((g) => { try { g(); } catch (e) {} })); }, 100); },
        track(p) { if (name === "dma-klassenzimmer-da") { this.eigen = {}; this.eigen[String(this.key)] = [p || {}]; this.melde(); } return Promise.resolve("ok"); },
        untrack() { if (name === "dma-klassenzimmer-da") { this.eigen = {}; this.melde(); } return Promise.resolve("ok"); },
        send() { return Promise.resolve("ok"); }, unsubscribe() { return Promise.resolve("ok"); } };
      P.kanaele.push(k);
      if (name === "dma-klassenzimmer-da") {
        /* D: jemand kommt dazu (nach dem ersten Stand) */
        window.__sondeKommt = (schl, e) => { k.st[schl] = [e]; ["join", "sync"].forEach((ev) => (k.h[ev] || []).forEach((g) => { try { g(); } catch (x) {} })); };
      }
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
  /* erst nach backend.js (Backend bleibt Demo); G: erst ab window.__sondeSupaAb ms nach dem Öffnen */
  window.__sondeSupaAb = o.supaAb;
  Object.defineProperty(window, "supabase", { configurable: true, set() {}, get() {
    if (window.__sondeSupaAb != null && performance.now() < window.__sondeSupaAb) return undefined;
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
  const rvM = minApp.match(/function raumVorbereiten\((\w*)\)\{[\s\S]*?\n?function /);
  const rv = rvM ? rvM[0] : "", rvArg = rvM ? rvM[1] : "";
  sage(/dmaPraesenzLos/.test(rv), "raumVorbereiten (Tipp, Rückkehr, Betreten) startet die Präsenz (dmaPraesenzLos)", rv ? "" : "raumVorbereiten nicht gefunden");
  sage(/setTimeout\(\(\)=>dmaPraesenzLos\(!1\),4e3\)/.test(minApp), "die 4 s nach dem Start rufen dieselbe Funktion (einmal, wer zuerst kommt), mit Mithörer");
  /* Nachbesserung 1: nur der Tipp auf die Pille gibt „tipp“ mit; ohne meldet dmaPraesenzLos keinen Mithörer an */
  const pille = (minApp.match(/\[data-sub="sub-livechat"\]'\)\?\.addEventListener\("click",\(\)=>\{[^}]{0,80}/) || [""])[0];
  sage(/raumVorbereiten\(!0\)/.test(pille), "der Tipp auf die Pille „Klassenzimmer“ ruft raumVorbereiten(tipp)", pille.slice(0, 120) || "Pille nicht gefunden");
  const ohne = (minApp.match(/raumVorbereiten\(\)/g) || []).length;
  sage(ohne === 2, "Rückkehr und raumDrin rufen raumVorbereiten ohne „tipp“", ohne + "×");
  sage(Boolean(rvArg) && new RegExp("dmaPraesenzLos\\(!" + rvArg + "\\)").test(rv), "raumVorbereiten gibt dmaPraesenzLos „nur Kanal“ = !tipp", rvArg ? "" : "ohne Parameter");
  sage(/dmaPraesenzLos=(\w+)=>\{[\s\S]{0,1500}?\1===!0\|\|kzPraesenzHorcht/.test(minApp), "dmaPraesenzLos(true) endet vor dem Mithörer fürs Laufband");

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
      horcher: P.horcher, horcherKz: P.horcherKz, kzReg: P.kzReg.map((r) => ({ t: Math.round(r.t), leer: r.leer })), drin: Math.round(P.drin),
      ticker: ((document.getElementById("tickerTrack") || {}).textContent || "").replace(/\s+/g, " "),
      tipps: P.tipps.map((m) => ({ t: Math.round(m.t), knopf: Math.round(m.knopf), leute: Math.round(m.leute), ticker: Math.round(m.ticker) })),
      sync: window.__sync.slice(), sofort: (window.DMA_TEIL_SOFORT || []).slice(),
      lage: window.LiveChat && window.LiveChat.lage ? window.LiveChat.lage().lage : "",
      ichId: window.LiveChat && window.LiveChat.lage ? String(window.LiveChat.lage().ichId || "") : "" };
  });
  const syncText = (s) => s.sync.map((x) => x.u.replace(/^.*\//, "") + " " + x.d + " ms").concat(s.sofort).join(", ");
  /* Laufband-Ereignisse (kzEreignisseAbleiten, app.js): „… ist gerade ins Klassenzimmer gekommen“, „… macht gerade „…“
     auf“, „… ist in „…“ gewechselt“ – je Name einmal, auch wenn das Laufband sich zum Weiterlaufen verdoppelt */
  const EREIGNIS = /([A-ZÄÖÜ][\wäöüß]*) (?:ist gerade (?:ins|in) [^·•]{1,60}? gekommen|macht gerade [^·•]{1,60}? auf|ist (?:ins|in) [^·•]{1,60}? gewechselt)/g;
  const ereignisse = (text) => Array.from(new Set((String(text).match(EREIGNIS) || []).map((x) => x.trim())));

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
    /* gleich nach dem ersten Bild des Klassenzimmers (rAF → setTimeout 0, also nach dem Malen dieses Bilds): ≤ 200 ms nach dem Knopf, höchstens 500 ms nach dem Tipp */
    sage(k && kNach >= 0 && kNach <= 500 && (!m.knopf || kNach <= m.knopf + 200), "der Präsenzkanal geht beim Tipp auf (gleich nach dem ersten Bild: ≤ Knopf + 200 ms, ≤ 500 ms)",
      k ? Math.round(kNach) + " ms nach dem Tipp (Knopf nach " + (m.knopf || "–") + " ms)" : "noch kein Kanal");
    sage(k && m.knopf && kNach >= m.knopf - 20, "erst das Bild des Klassenzimmers, dann die Leitung", k && m.knopf ? "Knopf nach " + m.knopf + " ms, Kanal nach " + Math.round(kNach) + " ms" : "–");
    sage(m.leute > 0 && m.leute <= KANAL_MS + 500, "„DIE RÄUME“ zeigt Emmy ≤ " + (KANAL_MS + 500) + " ms nach dem Tipp (vorher erst nach den 4 s)", m.leute ? m.leute + " ms" : "nach " + (s1.jetzt - (m.t || 0)) + " ms noch nicht");
    sage(m.ticker > 0 && m.ticker <= KANAL_MS + 600, "das Laufband nennt Emmy ≤ " + (KANAL_MS + 600) + " ms nach dem Tipp", m.ticker ? m.ticker + " ms" : "noch nicht");
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
    const init = Math.round(await pg.evaluate(() => window.__p.init));
    const bisVor = Math.max(0, init + 3800 - (await pg.evaluate(() => performance.now())));
    await schlaf(bisVor);
    const vor = await stand(pg);
    /* Nachbesserung 1 (Prüfer): bei 4× gebremstem Rechner feuert der 4-s-Zeitgeber auch einmal spät (gemessen 4252 ms);
       geprüft wird „nicht vor 3,8 s und genau einer“, gewartet höchstens bis 8 s nach dem Start */
    await pg.waitForFunction((g) => performance.now() >= g && window.__p.kanaele.some((k) => k.name === "dma-klassenzimmer-da"), init + 4300,
      { timeout: Math.max(1000, init + 8000 - (await pg.evaluate(() => performance.now()))), polling: 50 }).catch(() => {});
    await schlaf(300);
    const nach = await stand(pg);
    const k = nach.kanaele[0];
    sage(!vor.kanaele.length, "kein Präsenzkanal vor 3,8 s nach dem Start von app.js", vor.kanaele.length ? "Kanal nach " + (vor.kanaele[0].t - init) + " ms" : "keiner (" + (vor.jetzt - init) + " ms)");
    sage(nach.kanaele.length === 1 && k.t - init >= 3800, "genau einer nach 4 s, wie bisher", k ? (k.t - init) + " ms nach dem Start" : "keiner (bis 8 s)");
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
    const init = Math.round(await pg.evaluate(() => window.__p.init));
    await schlaf(KANAL_MS + 800);
    /* erst nach dem ersten Stand kommt jemand dazu – ein echtes Ereignis fürs Laufband */
    await pg.evaluate(() => window.__sondeKommt && window.__sondeKommt("u-lena", { name: "Lena", raum: "lenas-raum", seit: 3 }));
    await schlaf(Math.max(600, init + 5000 - (await pg.evaluate(() => performance.now()))));
    const s = await stand(pg);
    const raumDa = await pg.evaluate(() => Object.keys(window.DMA_TEILE.stand().da).filter((t) => /^raum/.test(t)).length);
    const erD = ereignisse(s.ticker);
    console.log("  info Raum-Stücke eingesetzt: " + raumDa + " · Ereignisse im Laufband: " + (erD.join(" · ") || "keine"));
    sage(erD.some((x) => /^Lena macht gerade/.test(x)), "der Rückruf lief: „Lena macht gerade „Lenas Raum“ auf“ steht im Laufband (sie kam nach dem ersten Stand)");
    sage(/Otto/.test(s.ticker), "wer schon da war, steht im Laufband (Otto in „Ottos Raum“)");
    if (erD.some((x) => /^(Emmy|Otto) /.test(x))) console.log("  info bekannt (Offen 1, in 2ea2044c nach den 4 s genauso): nach dem Tipp meldet das Laufband auch, wer schon da war – " + erD.filter((x) => /^(Emmy|Otto) /.test(x)).join(" · "));
    sage(!s.sync.length && !s.sofort.length, "kein synchroner Abruf eines Raum-Stücks", syncText(s) || "0");
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 2).join(" | "));
    freigeben(pg);
    await ctx.close();
  }

  /* ---------- E) Rückkehr nach dem Neuladen ---------- */
  /* Der eigene Eintrag im Präsenzkanal steht unter dessen Schlüssel; livechat.js erkennt „andere da“ daran, dass ein
     Schlüssel ≠ der zuletzt übergebenen Kennung ist. Nach „drin“ darf app.js also keine andere Kennung mehr übergeben. */
  const kennungPruefen = (s, soll) => {
    const k = s.kanaele[0];
    const spaet = s.zuhoeren.filter((z) => (z.lage === "drin" || z.lage === "verbindet") && (!k || z.id !== k.key));
    sage(s.kanaele.length === 1 && k && (soll ? k.key === soll : k.key === s.ichId && Boolean(k.key)),
      "genau ein Präsenzkanal, mit " + (soll ? "der Konto-Kennung" : "der Raum-Kennung des Gasts (lage().ichId)"),
      s.kanaele.length + (k ? " · Schlüssel " + k.key + " · ichId " + s.ichId : ""));
    sage(!spaet.length, "nach dem Betreten übergibt app.js keine andere Kennung (sonst gilt der eigene Eintrag als „andere da“)",
      spaet.length ? spaet.map((z) => (z.t - s.init) + " ms mit „" + z.id + "“ (" + z.lage + ")").join(", ") : "ok");
  };
  /* Nachbesserung 1: auf diesen Wegen kein Mithörer vor den 4 s und keine „gekommen“-Meldung für Leute, die beim Öffnen
     schon da waren (Emmy, Otto – und man selbst, der nach dem Neuladen wieder einträgt) */
  const laufbandPruefen = (s, ich) => {
    const r = s.kzReg[0];
    sage(s.horcherKz === 1 && r && r.t - s.init >= 3800, "der Mithörer fürs Laufband kommt wie bis 884 erst nach den 4 s (genau einer)",
      s.horcherKz + "× · " + (r ? (r.t - s.init) + " ms nach dem Start" + (r.leer ? ", Kanal hatte noch nicht geantwortet" : ", Stand schon da") : "keiner"));
    const er = ereignisse(s.ticker).filter((x) => new RegExp("^(Emmy|Otto|" + ich + ") ").test(x));
    sage(!er.length, "das Laufband meldet niemanden, der schon da war, als gerade gekommen (auch nicht einen selbst)", er.join(" · ") || "keine");
    sage(/Emmy/.test(s.ticker), "das Laufband nennt Emmy (der Mithörer läuft)", /Emmy/.test(s.ticker) ? "ja" : "nein");
  };
  titel("E", "RÜCKKEHR NACH DEM NEULADEN (raumVorbereiten NOCH IM START)");
  if (lauf("E")) {
    for (const [fall, o, soll] of [["Konto", { rueckkehr: true, konto: KONTO }, KONTO], ["Gast", { rueckkehr: true }, ""]]) {
      console.log("  – " + fall);
      const { ctx, pg } = await fenster(o);
      await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await pg.waitForFunction(() => window.LiveChat.lage().lage === "drin", null, { timeout: 30000, polling: 50 }).catch(() => {});
      const drinAb = await pg.evaluate(() => performance.now());
      const init = Math.round(await pg.evaluate(() => window.__p.init));
      await schlaf(Math.max(500, init + 5500 - drinAb));
      const s = await stand(pg);
      console.log("  info drin nach " + Math.round(drinAb - init) + " ms; app.js ruft praesenzZuhoeren: " + (s.zuhoeren.map((z) => (z.t - init) + " ms „" + z.id.slice(0, 12) + "“ " + (z.lage || "–")).join(", ") || "nie"));
      sage(s.lage === "drin", "zurück im Raum", s.lage);
      kennungPruefen(s, soll);
      laufbandPruefen(s, "Sonde");
      sage(!s.sync.length && !s.sofort.length && !pg.__fehler.length, "kein synchroner Abruf, keine Seitenfehler", (syncText(s) + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
      await ctx.close();
    }
  }

  /* ---------- F) raumDrin ohne vorherigen Klick auf die Pille ---------- */
  /* Nachbesserung 2 (Prüfer): LiveChat.betreten direkt – diesen Weg nimmt keine Oberfläche (Tipp, Einladungslink,
     Benachrichtigung, Briefkasten, Unterricht-Einladung, Notweg-Ziel klicken vorher die Pille; ohne Klick kommt raumDrin
     über die Oberfläche nur bei der Rückkehr, E). F hält nur den Schutz fest; der Einladungslink steht in L. */
  titel("F", "raumDrin OHNE VORHERIGEN KLICK AUF DIE PILLE (GAST, LiveChat.betreten DIREKT, VOR DEN 4 s; KEIN WEG DER OBERFLÄCHE)");
  if (lauf("F")) {
    const { ctx, pg } = await fenster();
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    await pg.evaluate(() => { try { window.LiveChat.betreten("sonde885gast", { name: "Gast", mitBild: false }); } catch (e) {} });
    await pg.waitForFunction(() => window.LiveChat.lage().lage === "drin", null, { timeout: 30000, polling: 50 }).catch(() => {});
    const init = Math.round(await pg.evaluate(() => window.__p.init));
    await schlaf(Math.max(500, init + 5500 - (await pg.evaluate(() => performance.now()))));
    const s = await stand(pg);
    console.log("  info app.js ruft praesenzZuhoeren: " + (s.zuhoeren.map((z) => (z.t - init) + " ms „" + z.id.slice(0, 12) + "“ " + (z.lage || "–")).join(", ") || "nie"));
    sage(s.lage === "drin", "im Raum", s.lage);
    kennungPruefen(s, "");
    laufbandPruefen(s, "Gast");
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 2).join(" | "));
    await ctx.close();
  }

  /* ---------- G) supabase-js kommt spät ---------- */
  titel("G", "SUPABASE-JS KOMMT ERST NACH DEN 4 s");
  if (lauf("G")) {
    /* window.__sondeSupaAb: bis dahin gibt es kein supabase-js (die Sonde stellt es unten auf 0) */
    const { ctx, pg } = await fenster({ supaAb: 1e9 });
    await pg.goto(S.url() + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    await insKlassenzimmer(pg);
    const init = Math.round(await pg.evaluate(() => window.__p.init));
    await schlaf(Math.max(0, init + 4600 - (await pg.evaluate(() => performance.now()))));
    const vor = await stand(pg);
    sage(!vor.kanaele.length, "ohne supabase-js kein Kanal (Tipp und die 4 s gehen ins Leere)", vor.kanaele.length + " Kanal");
    await pg.evaluate(() => { window.__sondeSupaAb = 0; });
    await tippe(pg, '.tape-tab[data-target="view-learn"]').catch(() => {});
    await schlaf(200);
    await insKlassenzimmer(pg);
    await schlaf(KANAL_MS + 700);
    const nach = await stand(pg);
    const m = nach.tipps[nach.tipps.length - 1] || {};
    sage(nach.kanaele.length === 1, "der nächste Tipp danach öffnet ihn (genau einen)", nach.kanaele.length + " · praesenzZuhoeren " + nach.zuhoeren.length + "× · Mithörer " + nach.horcherKz);
    sage(nach.tipps.length >= 2 && m.leute > 0, "„DIE RÄUME“ zeigt Emmy nach diesem Tipp", nach.tipps.length >= 2 ? (m.leute || "nie") + (m.leute ? " ms" : "") : "–");
    sage(nach.horcherKz === 1, "ein Mithörer fürs Laufband (auch nach zwei Tipps und den 4 s)", String(nach.horcherKz));
    sage(!nach.sync.length && !nach.sofort.length && !pg.__fehler.length, "kein synchroner Abruf, keine Seitenfehler", (syncText(nach) + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
    await ctx.close();
  }

  /* ---------- L) der echte Einladungslink ---------- */
  /* Nachbesserung 2 (Prüfer): index.html#raum=… – app.js („EIN EINLADUNGSLINK …“) klickt 360 ms nach dem Start die
     Pille selbst (pille.click()), der Klick-Rückruf ruft raumVorbereiten(true): derselbe Weg wie der Tipp. „rein“: 0,3 s
     nach dem Klick hinein (LiveChat.betreten wie livechatHinein hinter dem Tor; Benachrichtigung und Briefkasten gehen
     320 ms nach ihrem Klick hinein). Der Aufruf läuft erst, wenn der Hauptfaden frei ist: auf dem Link-Weg zeichnet der
     Start „Wissen“ samt ganzer Wortliste (renderVocab, schon in 884; Nebenbefund im Logbuch) – bei 4× gebremstem
     Rechner bis ~3,5–4 s. „tipp“ (nur für LM): normaler Start, echte Tipps auf „Wissen“ und „Klassenzimmer“ gleich nach
     „bereit“ – der Teilfall des Prüfers „Tipp und schnell hinein“. */
  const linkLauf = async (url, rein, tipp) => {
    const { ctx, pg } = await fenster();
    await pg.goto(url + "/index.html" + (tipp ? "" : "#raum=" + LINK), { waitUntil: "commit" });
    await bereit(pg);
    if (tipp) await insKlassenzimmer(pg);
    await pg.waitForFunction(() => window.__p.tipps.length > 0, null, { timeout: 15000, polling: 20 }).catch(() => {});
    if (rein) {
      await schlaf(300);
      await pg.evaluate((r) => { try { window.LiveChat.betreten(window.LiveChat.raumAusAdresse() || r, { name: "Gast", mitBild: false }); } catch (e) {} }, LINK);
      await pg.waitForFunction(() => window.LiveChat.lage().lage === "drin", null, { timeout: 30000, polling: 50 }).catch(() => {});
    }
    const init = Math.round(await pg.evaluate(() => window.__p.init));
    await schlaf(Math.max(500, init + 5500 - (await pg.evaluate(() => performance.now()))));
    const s = await stand(pg);
    s.fehler = pg.__fehler.slice();
    await ctx.close();
    const m = s.tipps[0] || {}, k = s.kanaele[0], r = s.kzReg[0];
    s.klickNachStart = m.t ? m.t - s.init : null;
    s.kanalNachKlick = k && m.t ? k.t - m.t : null;
    s.antwortNachStart = k && k.ok ? k.ok - s.init : null;
    s.emmyNachStart = m.t && m.leute ? m.t + m.leute - s.init : null;
    s.mithoererNachStart = r ? r.t - s.init : null;
    s.drinNachStart = s.drin ? s.drin - s.init : null;
    s.alt = ereignisse(s.ticker).filter((x) => /^(Emmy|Otto|Gast) /.test(x));
    s.syncRaum = s.sync.filter((x) => /app-teil-raum/.test(x.u)).map((x) => x.u.replace(/^.*\//, "")).concat(s.sofort.filter((x) => /^raum/.test(String(x))));
    return s;
  };
  titel("L", "DER ECHTE EINLADUNGSLINK (#raum=" + LINK + ", GAST): DIE SEITE KLICKT DIE PILLE – DER TIPP-WEG");
  if (lauf("L")) {
    for (const [fall, rein] of [["ohne hineinzugehen", false], ["hinein (Aufruf 0,3 s nach dem Klick)", true]]) {
      console.log("  – " + fall);
      const s = await linkLauf(S.url(), rein);
      const r = s.kzReg[0];
      console.log("  info ab dem Start von app.js: Klick " + (s.klickNachStart != null ? s.klickNachStart : "–") + " ms, Kanal antwortet " + (s.antwortNachStart != null ? s.antwortNachStart : "–")
        + " ms, Emmy in „DIE RÄUME“ " + (s.emmyNachStart != null ? s.emmyNachStart : "–") + " ms" + (rein ? ", drin " + (s.drinNachStart != null ? s.drinNachStart : "–") + " ms" : ""));
      sage(s.tipps.length >= 1, "die Seite klickt die Pille „Klassenzimmer“ selbst (Einladungslink → Tipp-Weg)", s.tipps.length + " Klick(s)");
      /* Nicht „≤ 500 ms nach dem Klick“ wie in A: auf dem Link-Weg zeichnet der Start gleich nach dem Klick „Wissen“ samt
         Wortliste (renderVocab, ein Langläufer von ~1,6 s bei 4× gebremstem Rechner, schon in 884). Fällt der Klick davor,
         kommt das erste Bild danach – und mit ihm der Kanal – erst nach diesem Langläufer (gemessen 152–2068 ms nach dem
         Klick). Geprüft wird deshalb: geöffnet vom Klick, also vor den 4 s (ohne S3: ≥ 4 s nach dem Start). */
      sage(s.kanaele[0] && s.kanalNachKlick >= 0 && s.kanaele[0].t - s.init < 3800, "der Präsenzkanal geht mit diesem Klick auf (vor den 4 s nach dem Start, nicht erst mit ihnen)",
        s.kanalNachKlick != null ? s.kanalNachKlick + " ms nach dem Klick, " + (s.kanaele[0].t - s.init) + " ms nach dem Start" : "kein Kanal oder kein Klick");
      sage(r && s.mithoererNachStart < 3800, "der Mithörer fürs Laufband kommt mit dem Klick (Tipp-Weg, S3) – nicht nurKanal",
        r ? s.mithoererNachStart + " ms nach dem Start" + (r.leer ? ", Kanal hatte noch nicht geantwortet (erste Aufnahme {})" : ", Stand schon da") : "keiner");
      if (!rein) sage(s.emmyNachStart != null && s.antwortNachStart != null && s.emmyNachStart - s.antwortNachStart <= 600,
        "„DIE RÄUME“ zeigt Emmy mit der Antwort des Kanals (≤ 600 ms danach) – nicht erst nach den 4 s",
        s.emmyNachStart != null && s.antwortNachStart != null ? (s.emmyNachStart - s.antwortNachStart) + " ms nach der Antwort" : "nicht bis " + (s.jetzt - s.init) + " ms nach dem Start");
      sage(s.kanaele.length === 1 && s.zuhoeren.length === 1 && s.horcherKz === 1, "genau ein Kanal, ein Aufruf, ein Mithörer (auch nach den 4 s)",
        s.kanaele.length + " / " + s.zuhoeren.length + " / " + s.horcherKz);
      if (rein) { sage(s.lage === "drin", "im Raum", s.lage); kennungPruefen(s, ""); }
      console.log("  info Laufband (Offen 1, bekannt; nicht freigegeben zu ändern): " + (s.alt.join(" · ") || "keine Meldung über Leute, die schon da waren"));
      sage(!s.syncRaum.length && !s.fehler.length, "kein synchroner Abruf eines Raum-Stücks, keine Seitenfehler", (s.syncRaum.join(", ") + " " + s.fehler.slice(0, 2).join(" | ")).trim() || "0");
      if (s.sync.length || s.sofort.length) console.log("  info Nebenbefund (schon in 884, nicht S3): synchron geholt " + syncText(s));
    }
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

  /* ---------- R) Messung Rückkehr ---------- */
  if (GEGEN && lauf("R")) {
    titel("R", "MESSUNG RÜCKKEHR NACH DEM NEULADEN (KONTO): A = " + GEGEN + ", B = " + WURZEL + " (verschränkt)");
    const SA = server(GEGEN); await SA.lauscht;
    const staende = { A: SA, B: S };
    const erg = { A: [], B: [] };
    for (let i = 0; i < PAARE_R; i++) {
      for (const st of (i % 2 ? ["B", "A"] : ["A", "B"])) {
        const { ctx, pg } = await fenster({ rueckkehr: true, konto: KONTO });
        await pg.goto(staende[st].url() + "/index.html", { waitUntil: "commit" });
        await bereit(pg);
        await pg.waitForFunction(() => window.__p.drin > 0, null, { timeout: 30000, polling: 50 }).catch(() => {});
        const init = Math.round(await pg.evaluate(() => window.__p.init));
        await schlaf(Math.max(300, init + 5500 - (await pg.evaluate(() => performance.now()))));
        const s = await stand(pg);
        const k = s.kanaele[0];
        const er = ereignisse(s.ticker).filter((x) => /^(Emmy|Otto|Sonde) /.test(x));
        erg[st].push({ drin: s.drin || null, kanal: k ? k.t : null, init: s.init, falsch: er.length, mithoerer: s.kzReg[0] ? s.kzReg[0].t - s.init : null,
          fehler: pg.__fehler.length, sync: s.sync.length });
        await ctx.close();
      }
    }
    const A = erg.A, B = erg.B;
    console.log("\n  " + A.length + " Paare, Median ms (ab dem Öffnen):");
    for (const mass of ["drin", "kanal", "init", "mithoerer", "falsch"]) {
      const d = A.map((a, j) => (B[j][mass] != null && a[mass] != null ? B[j][mass] - a[mass] : null)).filter((x) => x != null);
      const hoch = d.filter((x) => x > 0).length, tief = d.filter((x) => x < 0).length;
      console.log("    " + mass.padEnd(10) + String(Math.round(med(A.map((x) => x[mass])))).padStart(7) + " → " + String(Math.round(med(B.map((x) => x[mass])))).padStart(7)
        + "   B−A gepaart " + Math.round(med(d)) + " (" + tief + "↓/" + hoch + "↑)");
    }
    console.log("    falsche „gekommen“-Meldungen: A in " + A.filter((x) => x.falsch).length + "/" + A.length + ", B in " + B.filter((x) => x.falsch).length + "/" + B.length + " Läufen");
    sage(B.every((x) => !x.falsch), "B: keine falsche „gekommen“-Meldung nach der Rückkehr", B.map((x) => x.falsch).join(","));
    sage(A.concat(B).every((x) => !x.fehler && !x.sync), "keine Seitenfehler, kein synchroner Abruf");
    const datei = process.env.MESS_JSON_R || "";
    if (datei) fs.writeFileSync(datei, JSON.stringify(erg, null, 1));
    SA.srv.close();
  }

  /* ---------- LM) Messung Einladungslink ---------- */
  if (GEGEN && lauf("LM")) {
    titel("LM", "MESSUNG EINLADUNGSLINK UND „TIPP, GLEICH HINEIN“ (GAST): A = " + GEGEN + ", B = " + WURZEL + " (verschränkt)");
    const SA = server(GEGEN); await SA.lauscht;
    const staende = { A: SA, B: S };
    const ergL = {};
    for (const [fall, rein, tipp, text] of [["link", false, false, "Einladungslink, ohne hineinzugehen"], ["link-rein", true, false, "Einladungslink, hinein (Aufruf 0,3 s nach dem Klick)"],
      ["tipp-rein", true, true, "Tipp auf „Klassenzimmer“ gleich nach „bereit“, hinein 0,3 s danach"]]) {
      const erg = ergL[fall] = { A: [], B: [] };
      for (let i = 0; i < PAARE_L; i++) {
        for (const st of (i % 2 ? ["B", "A"] : ["A", "B"])) {
          const s = await linkLauf(staende[st].url(), rein, tipp);
          erg[st].push({ emmy: s.emmyNachStart, antwort: s.antwortNachStart, mithoerer: s.mithoererNachStart, klick: s.klickNachStart, drin: s.drinNachStart,
            falsch: s.alt.length, alt: s.alt, fehler: s.fehler.length, syncRaum: s.syncRaum.length });
        }
      }
      const A = erg.A, B = erg.B;
      console.log("\n  " + text + ", " + A.length + " Paare, Median ms ab dem Start von app.js:");
      for (const mass of (rein ? ["klick", "drin", "antwort", "mithoerer"] : ["klick", "antwort", "emmy", "mithoerer"])) {
        const d = A.map((a, j) => (B[j][mass] != null && a[mass] != null ? B[j][mass] - a[mass] : null)).filter((x) => x != null);
        const hoch = d.filter((x) => x > 0).length, tief = d.filter((x) => x < 0).length;
        console.log("    " + mass.padEnd(10) + String(Math.round(med(A.map((x) => x[mass])))).padStart(7) + " → " + String(Math.round(med(B.map((x) => x[mass])))).padStart(7)
          + "   B−A gepaart " + Math.round(med(d)) + " (" + tief + "↓/" + hoch + "↑)");
      }
      console.log("    Meldungen über Leute, die schon da waren: A in " + A.filter((x) => x.falsch).length + "/" + A.length + ", B in " + B.filter((x) => x.falsch).length + "/" + B.length + " Läufen"
        + (rein ? " · drin vor 3,8 s: A " + A.filter((x) => x.drin != null && x.drin < 3800).length + "/" + A.length + ", B " + B.filter((x) => x.drin != null && x.drin < 3800).length + "/" + B.length : "")
        + (B.find((x) => x.falsch) ? " (B z. B.: " + B.find((x) => x.falsch).alt.join(" · ") + ")" : ""));
      sage(A.concat(B).every((x) => !x.fehler && !x.syncRaum), text + ": keine Seitenfehler, kein synchroner Abruf eines Raum-Stücks");
    }
    const datei = process.env.MESS_JSON_L || "";
    if (datei) fs.writeFileSync(datei, JSON.stringify(ergL, null, 1));
    SA.srv.close();
  }

  await br.close();
  S.srv.close();
  console.log("\n" + (fehler ? fehler + " ROT (" + Array.from(new Set(rot)).join(", ") + ")" : "ALLES GRÜN"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
