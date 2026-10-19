#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — VERDECKTE BEREICHE SPÄTER ZEICHNEN (Fassung 885,
   Ladezeit-Entwurf Schritt D)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität".
   Befund (Grundlinie 884, Spur und Profil): der Kompass wurde beim Start
   verdeckt gezeichnet und beim ersten Tipp auf „Wissen" noch einmal; davor
   erzwang bereichSichtbar das Layout der ganzen Ansicht mit dem alten
   Inhalt (erzwungenes Stil/Layout 96–137 ms je Wissen-Tipp, CPU 4×).
   Weiterführende Links, Schwarmwissen, Memory und das Profil wurden im
   Seitenaufbau verdeckt gezeichnet; dafür gingen vier der acht
   Datenbank-Abfragen im Aufbau hinaus (Links, Tipps, Wissen-Bild,
   Anmeldebild), dazu die Filmliste.
   Ab 885: verdeckt wird in der Ruhepause nach dem Laden vorgezeichnet
   (nachLadenInRuhe, je Arbeit eine Pause); der Kompass wird beim Öffnen
   nur neu gezeichnet, wenn sich sein Stand geändert hat (kompassStand),
   und geht er auf, bevor er vorgezeichnet ist, zeichnet ihn eine Wache
   (ResizeObserver) vor dem nächsten Bild.
   Geprüft auf einem Telefon (390 × 844, echte Fingertipps):
     A  Start als Gast (Demo-Modus, alles nach draußen gesperrt):
        A1 bei DOMContentLoaded und load sind Kompass, Links, Schwarmwissen
           und Memory noch leer (nicht im Seitenaufbau gezeichnet)
        A2 die Filmliste (filme/liste.json) wird nicht vor load geholt
        A3 3 s nach load (Ruhepause) sind alle vier vorgezeichnet und die
           Filmliste geholt; der vorgezeichnete Kompass sagt „wird geladen
           …" (wie ein geöffneter, solange der Kalender fehlt); kein
           Kalender geholt, solange der Kompass zu ist
        A4 kein synchron nachgeladenes Stück
     B  Datenbank nachgestellt (supabase-js aus der lokalen Kopie des
        Messwerkzeugs, jede Antwort 300 ms, „[]"):
        B1 vor load keine Abfrage für user_links, community_tips,
           site_image_wissen_banner, site_image_login_banner
        B2 bis 5 s nach load kamen alle vier doch (die Bereiche füllen sich)
        B3 was man sieht, bleibt im Aufbau: about und feature_flags vor load
        B4 Einsprung mit #view-profile: das Profil wird im Aufbau gezeichnet
           (Anmeldebild vor load)
     C  Wissen-Tipp:
        C1 Tipp, BEVOR vorgezeichnet ist (load wird von einem Bild 4 s
           aufgehalten): vorher leer, im ersten Bild nach dem Tipp steht der
           Kompass (die Wache zeichnet vor dem Bild), genau einmal gezeichnet
        C2 Tipp NACH dem Vorzeichnen: im ersten Bild da, beim Öffnen NICHT
           neu gezeichnet; danach holt er den Kalender (1,2-s-Regel aus 840)
        C3 Stand geändert (Anmeldung nach dem Vorzeichnen): beim Öffnen genau
           einmal neu gezeichnet, „Es war einmal" als besucht vermerkt
        C3b mit Konto gestartet (Attrappe): vorgezeichnet gilt nicht als
           besucht; beim Öffnen nicht neu gezeichnet, aber jetzt besucht
        C4 die Anmeldung kommt erst nach dem Vorzeichnen (wie draußen; Attrappe
           „spaet“: restoreSession nach 1,5 s): verdeckt einmal neu vorgezeichnet,
           beim Öffnen dann nicht neu gezeichnet
        C5 Einsprung mit #view-knowledge: der Kompass steht schon im Aufbau
     D  Andere Wege hinein, bevor die Ruhepause kam (load aufgehalten):
        D1 „Weiterführende Links" öffnen: gezeichnet, die Ruhepause zeichnet
           nicht noch einmal
        D2 Memory öffnen: 12 Karten; die Ruhepause mischt nicht neu
     E  Beta-Person (Attrappe wie Sonde 884-beta, angemeldet vor app.js):
        4 s nach load 0 Beta-Meldungen und nichts synchron geholt; die
        Lesebereiche (Dichter & Denker …) sind verdeckt NICHT gezeichnet
        (Nachbesserung 1), im ersten Bild nach dem Wissen-Tipp stehen sie;
        danach weiter 0 Meldungen (erst echtes Ansehen meldet: 884-beta)
     G  (Nachbesserung 1, Prüfbericht zu 8437dc48) Betreiber und Beta wie
        draußen: die Anmeldung kommt erst 300 ms nach dem Start
        (restoreSession asynchron), Leitung gedrosselt (CDP: 4G 9 Mbit/s
        60 ms, 3G 1,6 Mbit/s 150 ms), CPU 4×, gepackt ausgeliefert:
        G-a angemeldet mit der Rolle (sonst ist der Lauf nichts wert)
        G-b bis load + 10 s KEIN Stück synchron geholt (XHR mit async=false
            und DMA_TEILE.stand().sofort) – in 8437dc48 holte das verdeckte
            Vorzeichnen rest1 und rest3 synchron (4G 457 ms, 3G 2625 ms Stillstand)
        G-c längste Aufgabe nach load unter 250 ms
        G-d im ersten Bild nach dem Wissen-Tipp steht „Dichter & Denker“
     H  (Nachbesserung 1) Klassenzimmer offen, bevor die Ruhepause kam
        (Datenbank nachgestellt): solange es offen ist, zeichnet die Ruhepause
        nichts vor und fragt nichts ab (Links, Schwarmwissen, Memory leer,
        keine Abfrage user_links, community_tips); die Filmliste kommt
        trotzdem; nach dem Verlassen füllt sich alles. Das Profil zeichnet
        wie vor 885 restoreSession (nicht die Ruhepause) – nur angezeigt.
     I  (Nachbesserung 1) Gast tippt oben auf „Anmelden“, bevor das Profil
        gezeichnet ist: das Zeichnen beginnt beim Tipp (Anmeldebild-Abfrage
        spätestens 150 ms danach), das Formular steht binnen 1,5 s
     F  keine Seitenfehler
   Schalter: QUELLE=1 (index.html?quelle; B entfällt, weil app.js dort erst nach
   load läuft), WURZEL=/pfad (ganzer Baum woanders).
   Gegenprobe (Stand vor diesem Schritt, 66aba333):
     S=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/<sitzung>/scratchpad
     Baum aus gegen885/stuecke-cadb (cp -al) + git archive 66aba333 der dort
     geänderten Dateien → $S/gegen885/bereiche-vorher
     WURZEL=$S/gegen885/bereiche-vorher node werkzeug/pruefe-885-bereiche.js
   ERGEBNIS (19.10.): min/ 31 grün, ?quelle grün (B entfällt). Gegenprobe
   66aba333: 11–12 rot (A1 ×2, A2 – je nach Zeitpunkt, in 2 von 3 Läufen –,
   A3, B1, C1, C2 ×2, C3b ×2, C4 ×2); grün bleibt, was gleich bleiben soll
   (A4, B2–B4, C3, C5, D, E, F). Stand ohne kompassNachAnmeldung: 2 rot (C4).
   NACHBESSERUNG 1: siehe SPIELSYSTEM.md (Fassung 885 — Verdeckte Bereiche,
   „Nachbesserung 1“) für Ergebnis und Gegenproben (8437dc48: G-b und G-c rot
   für Betreiber und Beta; 66aba333: G grün). G entfällt mit QUELLE=1 (dort
   gibt es keine Stücke). Nur G: NUR_G=1.
   EHRLICH: Demo-Modus bzw. nachgestellte Datenbank; was echte Leitung und
   echtes Gerät kosten, misst werkzeug/ladezeit-messen.js (SPIELSYSTEM.md).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const QUELLE = Boolean(process.env.QUELLE);
const NUR_G = Boolean(process.env.NUR_G);
const UMD = process.env.SUPABASE_UMD || "/tmp/dma-mess-supabase-js-2.117.3.umd.js";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".webp": "image/webp", ".webmanifest": "application/manifest+json" };

let fehler = 0;
const roteTeile = {};
let teil = "";
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; roteTeile[teil] = (roteTeile[teil] || 0) + 1; }
  console.log((gut ? "  ok   " : "  FEHL ") + teil.padEnd(4) + was + (zusatz ? "   " + zusatz : ""));
};
const abschnitt = (titel) => console.log("\n" + titel + "\n");
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
/* Am Ende von backend.js: die Beta-Attrappe einhängen, bevor app.js läuft (wie Sonde 884-beta). */
const ANHANG = "\n;(function(){try{if(window.__attrappe)window.__attrappe(Backend);}catch(e){console.error('Attrappe:',e);}})();\n";

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    /* ein Bild, das load aufhält (C1, D): erst nach ?ms ein leeres GIF */
    if (p === "/__halt.gif") {
      const ms = +(new URL(q.url, "http://x").searchParams.get("ms") || 4000);
      setTimeout(() => { a.writeHead(200, { "Content-Type": "image/gif", "Cache-Control": "no-store" }); a.end(Buffer.from("R0lGODlhAQABAAAAACw=", "base64")); }, ms);
      return;
    }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    if (/(^|\/)backend\.js$/.test(p)) { a.end(fs.readFileSync(f, "utf8") + ANHANG); return; }
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html" + (QUELLE ? "?quelle" : "");
  /* G: derselbe Baum gepackt ausgeliefert (wie GitHub Pages) – gedrosselt zählt, was über die Leitung geht */
  const gepackt = {};
  const srvGz = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    const typ = TYP[path.extname(f)] || "application/octet-stream";
    const h = { "Content-Type": typ, "Cache-Control": "no-store" };
    if (!/text|javascript|json|svg/.test(typ) || !/gzip/.test(q.headers["accept-encoding"] || "")) {
      a.writeHead(200, h);
      if (/(^|\/)backend\.js$/.test(p)) { a.end(fs.readFileSync(f, "utf8") + ANHANG); return; }
      fs.createReadStream(f).pipe(a);
      return;
    }
    if (!gepackt[p]) {
      let roh = fs.readFileSync(f);
      if (/(^|\/)backend\.js$/.test(p)) roh = Buffer.concat([roh, Buffer.from(ANHANG)]);
      gepackt[p] = zlib.gzipSync(roh, { level: 6 });
    }
    h["Content-Encoding"] = "gzip";
    a.writeHead(200, h);
    a.end(gepackt[p]);
  }).listen(0);
  const basisGz = "http://127.0.0.1:" + srvGz.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"] });
  const seitenFehler = [];

  /* G: Rolle mit später Anmeldung (restoreSession erst ms nach dem Start, wie draußen), gedrosselt, CPU 4× */
  const NETZE = { "4g": { latency: 60, down: 9e6 / 8 }, "3g": { latency: 150, down: 1.6e6 / 8 } };
  async function rollenLauf(rolle, netz, ms) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, serviceWorkers: "block",
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: NETZE[netz].latency, downloadThroughput: NETZE[netz].down, uploadThroughput: 750e3 / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await pg.addInitScript(([rolle, ms]) => {
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
      window.__sync = []; window.__lang = []; window.__beta = [];
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lang.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: "longtask", buffered: true }); } catch (e) {}
      const o = XMLHttpRequest.prototype.open, s = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (m, u, as) { this.__u = u; this.__sync = as === false; return o.apply(this, arguments); };
      XMLHttpRequest.prototype.send = function () {
        const t = performance.now();
        try { return s.apply(this, arguments); }
        finally { if (this.__sync) window.__sync.push([String(this.__u).replace(/\?.*/, "").split("/").pop(), Math.round(t), Math.round(performance.now() - t)]); }
      };
      window.__attrappe = (B) => {
        B.restoreSession = () => new Promise((fertig) => setTimeout(() => {
          B.signUp(rolle + "@attrappe.test", "attrappe", rolle);
          const p = B.currentProfile();
          if (p) {
            if (rolle === "beta") p.isBetaTester = true;
            if (rolle === "betreiber") p.isOwner = true;
            p.extraProfileData = Object.assign({}, p.extraProfileData, { seenFoxIntro: true });
          }
          B.notifyAdminsBetaTesting = async (name, bereich) => { window.__beta.push(String(bereich || "?")); };
          fertig();
        }, ms));
      };
      document.addEventListener("click", (e) => {
        if (!e.isTrusted || !e.target.closest || !e.target.closest('[data-target="view-knowledge"]')) return;
        requestAnimationFrame(() => setTimeout(() => {
          const l = (id) => (document.getElementById(id) || { innerHTML: "" }).innerHTML.length;
          window.__ersterRahmen = { kompass: l("kompassArea"), dichter: l("dichterArea"), daDichter: Boolean(document.getElementById("dichterArea")) };
        }, 0));
      }, true);
    }, [rolle, ms]);
    await pg.goto(basisGz, { waitUntil: "load", timeout: 120000 });
    await warte(10000);
    const st = await pg.evaluate(() => {
      const load = Math.round(performance.getEntriesByType("navigation")[0].loadEventStart);
      const nach = window.__lang.filter(([t]) => t >= load);
      const s = window.DMA_TEILE ? window.DMA_TEILE.stand() : { sofort: [], gebaut: false };
      return { load, gebaut: s.gebaut, sync: window.__sync.map(([u, t, d]) => u + "@" + (t - load >= 0 ? "+" : "") + (t - load) + " (" + d + " ms)"),
        sofort: s.sofort.map((x) => x.split(" ")[0] + " " + ((x.match(/at (\w+)/) || [])[1] || "?")),
        maxNach: Math.max(0, ...nach.map(([, d]) => d)), rolle: [Boolean(Backend.currentUser()), Boolean(Backend.canModerate && Backend.canModerate()), Boolean(Backend.isBetaTester && Backend.isBetaTester())],
        kompass: (document.getElementById("kompassArea") || { innerHTML: "" }).innerHTML.length,
        dichter: (document.getElementById("dichterArea") || { innerHTML: "" }).innerHTML.length };
    });
    await pg.evaluate(() => { window.__ersterRahmen = null; });
    await pg.tap('[data-target="view-knowledge"]');
    await pg.waitForFunction(() => window.__ersterRahmen, null, { timeout: 20000 });
    st.rahmen = await pg.evaluate(() => window.__ersterRahmen);
    await warte(1500);
    st.syncNachTipp = await pg.evaluate(() => window.__sync.length);
    st.beta = await pg.evaluate(() => window.__beta.slice());
    await ctx.close();
    return st;
  }

  /* opt: halt (ms, load aufhalten), supa (Datenbank nachstellen: Liste der Abfragen), hash, attrappe ("beta") */
  async function neueSeite(opt) {
    opt = opt || {};
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, serviceWorkers: "block",
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    const t = { null: 0 };
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => {
      const u = r.request().url();
      if (opt.supa && /cdn\.jsdelivr\.net\/.*supabase/.test(u)) return r.fulfill({ status: 200, contentType: "text/javascript", body: fs.readFileSync(UMD) });
      if (opt.supa && /supabase\.co\/rest\//.test(u)) {
        const x = new URL(u);
        opt.supa.push({ t: Date.now() - t.null, tabelle: x.pathname.replace("/rest/v1/", ""), q: decodeURIComponent(x.search) });
        return warte(300).then(() => r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: "[]" })).catch(() => {});
      }
      return r.abort();
    });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    await pg.addInitScript(([halt, attrappe]) => {
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
      window.__beta = [];
      window.__attrappe = (B) => {
        /* „spaet“: die Anmeldung wird erst 1,5 s nach dem Start wiederhergestellt (wie draußen: nach load und nach der
           ersten Ruhepause) */
        if (attrappe === "spaet") {
          B.restoreSession = () => new Promise((fertig) => setTimeout(() => {
            B.signUp("spaet@attrappe.test", "attrappe", "Spaet");
            const p = B.currentProfile();
            if (p) p.extraProfileData = Object.assign({}, p.extraProfileData, { seenFoxIntro: true });
            fertig();
          }, 1500));
          return;
        }
        if (!attrappe) return;
        B.signUp(attrappe + "@attrappe.test", "attrappe", attrappe);
        const p = B.currentProfile();
        if (p) { p.isBetaTester = attrappe === "beta"; p.extraProfileData = Object.assign({}, p.extraProfileData, { seenFoxIntro: true }); }
        B.notifyAdminsBetaTesting = async (name, bereich) => { window.__beta.push(String(bereich || "?")); };
      };
      /* Wie oft wurde der Kompass ersetzt (innerHTML: genau eine Meldung je Zuweisung), und was stand im ersten Bild
         nach einem echten Tipp auf „Wissen“ (Tipp → rAF → setTimeout 0, dieselbe Regel wie DMA_MESS) */
      window.__kompassGezeichnet = 0;
      /* was bei load (in diesem Augenblick, vor jeder Ruhepause) gezeichnet war – dieser Horcher kommt vor dem der Seite */
      const schnapp = () => {
        const l = (id) => (document.getElementById(id) || { innerHTML: "" }).innerHTML.length;
        return { kompass: l("kompassArea"), links: l("linksArea"), tipps: l("tipsArea"), memory: l("memoryArea"), zustand: document.readyState,
          film: performance.getEntriesByType("resource").filter((e) => /filme\/liste\.json/.test(e.name)).length };
      };
      window.addEventListener("load", () => { window.__beiLoad = schnapp(); });
      /* … und gleich nachdem app.js gelaufen ist (load-Ereignis des Skripts; mit ?quelle kommt app.js erst nach load) */
      new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.tagName === "SCRIPT" && /(^|\/)app\.js(\?|$)/.test(n.getAttribute("src") || "")) n.addEventListener("load", () => { window.__nachApp = schnapp(); });
      }))).observe(document, { childList: true, subtree: true });
      document.addEventListener("DOMContentLoaded", () => {
        const k = document.getElementById("kompassArea");
        if (k) new MutationObserver((l) => { l.forEach((m) => { if (m.addedNodes.length) window.__kompassGezeichnet++; }); }).observe(k, { childList: true });
        if (halt) { const i = document.createElement("img"); i.src = "/__halt.gif?ms=" + halt; i.alt = ""; i.style.cssText = "position:absolute;width:1px;height:1px;opacity:0"; document.body.appendChild(i); }
      });
      document.addEventListener("click", (e) => {
        if (!e.isTrusted || !e.target.closest || !e.target.closest('[data-target="view-knowledge"]')) return;
        requestAnimationFrame(() => setTimeout(() => {
          const k = document.getElementById("kompassArea"), d = document.getElementById("dichterArea");
          window.__ersterRahmen = { laenge: k ? k.innerHTML.length : -1, sichtbar: Boolean(k && k.getBoundingClientRect().height > 100), dichter: d ? d.innerHTML.length : -1 };
        }, 0));
      }, true);
    }, [opt.halt || 0, opt.attrappe || ""]);
    t.null = Date.now();
    await pg.goto(basis + (opt.hash ? "#" + opt.hash : ""), { waitUntil: "domcontentloaded" });
    return { ctx, pg, t };
  }
  const bereiche = (pg) => pg.evaluate(() => {
    const l = (id) => (document.getElementById(id) || { innerHTML: "" }).innerHTML.length;
    const res = performance.getEntriesByType("resource");
    return { kompass: l("kompassArea"), links: l("linksArea"), tipps: l("tipsArea"), memory: l("memoryArea"), profil: l("accountArea"),
      film: res.filter((e) => /filme\/liste\.json/.test(e.name)).length, kalender: res.filter((e) => /\/kalender\//.test(e.name)).length,
      laden: /wird geladen/.test((document.getElementById("kompassArea") || {}).textContent || ""),
      gezeichnet: window.__kompassGezeichnet, zustand: document.readyState,
      sofort: window.DMA_TEILE ? window.DMA_TEILE.stand().sofort.length : 0 };
  });
  const appBereit = (pg) => pg.waitForFunction(() => window.__dmaAppInitialized && document.querySelector('[data-target="view-knowledge"]') && window.DMA_TEILE, null, { timeout: 30000 });
  const tippWissen = async (pg) => {
    await pg.evaluate(() => { window.__ersterRahmen = null; });
    await pg.tap('[data-target="view-knowledge"]');
    await pg.waitForFunction(() => window.__ersterRahmen, null, { timeout: 10000 });
    return pg.evaluate(() => window.__ersterRahmen);
  };
  const zs = (b) => "Kompass " + b.kompass + ", Links " + b.links + ", Tipps " + b.tipps + ", Memory " + b.memory + ", Filmliste " + b.film + ", Kalender " + b.kalender;

  try {
    if (!NUR_G) {   // A–E, H, I (mit NUR_G=1 nur G)
    /* ---------------- A: Start als Gast ---------------- */
    abschnitt("A  Start als Gast (Demo-Modus)");
    {
      const { ctx, pg } = await neueSeite();
      await appBereit(pg);
      await pg.waitForLoadState("load");
      await pg.waitForFunction(() => window.__nachApp, null, { timeout: 30000 }).catch(() => {});
      const dcl = await pg.evaluate(() => window.__nachApp || { kompass: -1, links: -1, tipps: -1, memory: -1, zustand: "app.js-Skript nicht gefunden" });
      const geladen = await pg.evaluate(() => window.__beiLoad);
      teil = "A1";
      sage(dcl.kompass === 0 && dcl.links === 0 && dcl.tipps === 0 && dcl.memory === 0, "gleich nachdem app.js gelaufen ist: Kompass, Links, Schwarmwissen, Memory noch nicht gezeichnet",
        "Kompass " + dcl.kompass + ", Links " + dcl.links + ", Tipps " + dcl.tipps + ", Memory " + dcl.memory + " (Dokument " + dcl.zustand + ")");
      sage(geladen.kompass === 0 && geladen.links === 0 && geladen.tipps === 0 && geladen.memory === 0, "beim load-Ereignis: noch nicht gezeichnet",
        "Kompass " + geladen.kompass + ", Links " + geladen.links + ", Tipps " + geladen.tipps + ", Memory " + geladen.memory);
      teil = "A2";
      sage(geladen.film === 0, "die Filmliste wird nicht vor load geholt", "Abrufe bis load: " + geladen.film);
      await warte(3000);
      const ruhe = await bereiche(pg);
      teil = "A3";
      sage(ruhe.kompass > 5000 && ruhe.links > 500 && ruhe.tipps > 500 && ruhe.memory > 1000, "3 s nach load: alle vier in der Ruhepause vorgezeichnet", zs(ruhe));
      sage(ruhe.film >= 1, "3 s nach load: die Filmliste ist geholt", "Abrufe: " + ruhe.film);
      sage(ruhe.laden && ruhe.kalender === 0, "der vorgezeichnete Kompass sagt „wird geladen …“ wie ein geöffneter, der Kalender wird erst beim Öffnen geholt",
        "„wird geladen“: " + ruhe.laden + ", Kalender-Abrufe: " + ruhe.kalender);
      teil = "A4";
      sage(ruhe.sofort === 0, "kein Stück synchron nachgeladen", "DMA_TEIL_SOFORT: " + ruhe.sofort);
      await ctx.close();
    }

    /* ---------------- B: Datenbank-Abfragen im Aufbau ---------------- */
    abschnitt("B  Datenbank nachgestellt (jede Antwort 300 ms): was geht im Seitenaufbau hinaus?" + (QUELLE ? " – entfällt mit ?quelle (app.js kommt dort erst nach load)" : ""));
    if (!QUELLE) {
      const supa = [];
      const { ctx, pg, t } = await neueSeite({ supa });
      await pg.waitForLoadState("load");
      const tLoad = Date.now() - t.null;
      await warte(5000);
      const name = (a) => a.tabelle === "site_content" ? (a.q.match(/key=eq\.([\w]+)/) || [])[1] || "site_content?" : a.tabelle;
      const vor = supa.filter((a) => a.t <= tLoad).map(name), alle = supa.map(name);
      const SPAETER = ["user_links", "community_tips", "site_image_wissen_banner", "site_image_login_banner"];
      teil = "B1";
      sage(SPAETER.every((n) => vor.indexOf(n) < 0), "vor load keine Abfrage für Links, Tipps, Wissen-Bild, Anmeldebild",
        "vor load (" + vor.length + "): " + vor.join(", "));
      teil = "B2";
      sage(SPAETER.every((n) => alle.indexOf(n) >= 0), "bis 5 s nach load kamen alle vier doch (die Bereiche füllen sich in der Ruhepause)",
        "danach: " + supa.filter((a) => a.t > tLoad).map((a) => name(a) + " +" + (a.t - tLoad) + " ms").join(", "));
      teil = "B3";
      sage(vor.indexOf("about") >= 0 && vor.indexOf("feature_flags") >= 0, "was man beim Start sieht oder braucht, bleibt im Aufbau (about, feature_flags vor load)");
      await ctx.close();
      const supa2 = [];
      const s2 = await neueSeite({ supa: supa2, hash: "view-profile" });
      await s2.pg.waitForLoadState("load");
      const tLoad2 = Date.now() - s2.t.null;
      await warte(500);
      teil = "B4";
      const vor2 = supa2.filter((a) => a.t <= tLoad2).map(name);
      const profil2 = (await bereiche(s2.pg)).profil;
      sage(vor2.indexOf("site_image_login_banner") >= 0 && profil2 > 500, "Einsprung mit #view-profile: das Profil wird im Aufbau gezeichnet", "Anmeldebild vor load: " + (vor2.indexOf("site_image_login_banner") >= 0) + ", Profil " + profil2);
      await s2.ctx.close();
    }

    /* ---------------- C: Wissen-Tipp ---------------- */
    abschnitt("C  Wissen-Tipp");
    {
      const { ctx, pg } = await neueSeite({ halt: 4000 });
      await appBereit(pg);
      await warte(300);
      const vorher = await bereiche(pg);
      const r = await tippWissen(pg);
      await warte(300);
      const nachher = await bereiche(pg);
      teil = "C1";
      sage(vorher.zustand !== "complete" && vorher.kompass === 0, "vor dem Tipp: load noch nicht da, Kompass nicht gezeichnet", vorher.zustand + ", Kompass " + vorher.kompass);
      sage(r.laenge > 5000 && r.sichtbar, "im ersten Bild nach dem Tipp steht der Kompass (die Wache zeichnet vor dem Bild)", JSON.stringify(r));
      sage(vorher.gezeichnet === 0 && nachher.gezeichnet === 1, "genau einmal gezeichnet (vorher nie)", "Zeichnungen: " + vorher.gezeichnet + " → " + nachher.gezeichnet);
      await ctx.close();
    }
    {
      const { ctx, pg } = await neueSeite();
      await pg.waitForLoadState("load");
      await warte(3000);
      const vorher = await bereiche(pg);
      const r = await tippWissen(pg);
      await warte(300);
      const nachher = await bereiche(pg);
      teil = "C2";
      sage(vorher.kompass > 5000 && vorher.gezeichnet === 1, "vorgezeichnet (einmal, in der Ruhepause)", "Kompass " + vorher.kompass + ", Zeichnungen " + vorher.gezeichnet);
      sage(r.laenge > 5000 && r.sichtbar, "im ersten Bild nach dem Tipp da", JSON.stringify(r));
      sage(nachher.gezeichnet === vorher.gezeichnet, "beim Öffnen NICHT neu gezeichnet (Stand unverändert)", "Zeichnungen: " + vorher.gezeichnet + " → " + nachher.gezeichnet);
      await warte(2500);
      const spaeter = await bereiche(pg);
      sage(vorher.kalender === 0 && spaeter.kalender >= 1, "danach holt er den Kalender (1,2-s-Regel aus 840)", "Kalender-Abrufe " + vorher.kalender + " → " + spaeter.kalender);
      await ctx.close();
    }
    {
      const { ctx, pg } = await neueSeite();
      await pg.waitForLoadState("load");
      await warte(3000);
      const vorher = await bereiche(pg);
      await pg.evaluate(() => Backend.signUp("c3@attrappe.test", "attrappe", "C3"));
      await tippWissen(pg);
      await warte(400);
      const nachher = await bereiche(pg);
      const besucht = await pg.evaluate(() => ((Backend.currentProfile() || {}).extraProfileData || {}).visitedSections || []);
      teil = "C3";
      sage(nachher.gezeichnet === vorher.gezeichnet + 1, "angemeldet nach dem Vorzeichnen: beim Öffnen genau einmal neu gezeichnet", "Zeichnungen " + vorher.gezeichnet + " → " + nachher.gezeichnet);
      sage(besucht.indexOf("es-war-einmal") >= 0, "„Es war einmal in Deutschland“ als besucht vermerkt", JSON.stringify(besucht));
      await ctx.close();
    }
    {
      const { ctx, pg } = await neueSeite({ attrappe: "konto" });
      await pg.waitForLoadState("load");
      await warte(3000);
      const vorher = await bereiche(pg);
      const besuchtVor = await pg.evaluate(() => ((Backend.currentProfile() || {}).extraProfileData || {}).visitedSections || []);
      await tippWissen(pg);
      await warte(400);
      const nachher = await bereiche(pg);
      const besuchtNach = await pg.evaluate(() => ((Backend.currentProfile() || {}).extraProfileData || {}).visitedSections || []);
      teil = "C3b";
      sage(vorher.kompass > 5000 && besuchtVor.indexOf("es-war-einmal") < 0, "angemeldet vor dem Vorzeichnen: vorgezeichnet, aber nicht als besucht vermerkt", "Kompass " + vorher.kompass + ", besucht " + JSON.stringify(besuchtVor));
      sage(nachher.gezeichnet === vorher.gezeichnet && besuchtNach.indexOf("es-war-einmal") >= 0, "beim Öffnen nicht neu gezeichnet, jetzt besucht",
        "Zeichnungen " + vorher.gezeichnet + " → " + nachher.gezeichnet + ", besucht " + JSON.stringify(besuchtNach));
      await ctx.close();
    }
    {
      const { ctx, pg } = await neueSeite({ attrappe: "spaet" });
      await pg.waitForLoadState("load");
      await warte(500);
      const vorAnmeldung = await bereiche(pg);
      await warte(3000);
      const vorher = await bereiche(pg);
      const angemeldet = await pg.evaluate(() => Boolean(Backend.currentUser()));
      await tippWissen(pg);
      await warte(400);
      const nachher = await bereiche(pg);
      const besucht = await pg.evaluate(() => ((Backend.currentProfile() || {}).extraProfileData || {}).visitedSections || []);
      teil = "C4";
      sage(vorAnmeldung.gezeichnet === 1 && angemeldet && vorher.gezeichnet === 2, "Anmeldung erst nach dem Vorzeichnen (1,5 s): verdeckt einmal neu vorgezeichnet",
        "Zeichnungen vor der Anmeldung " + vorAnmeldung.gezeichnet + ", danach " + vorher.gezeichnet + ", angemeldet " + angemeldet);
      sage(nachher.gezeichnet === vorher.gezeichnet && besucht.indexOf("es-war-einmal") >= 0, "beim Öffnen nicht neu gezeichnet, „Es war einmal“ besucht",
        "Zeichnungen " + vorher.gezeichnet + " → " + nachher.gezeichnet + ", besucht " + JSON.stringify(besucht));
      await ctx.close();
    }
    {
      const { ctx, pg } = await neueSeite({ hash: "view-knowledge" });
      await appBereit(pg);
      const b = await bereiche(pg);
      teil = "C5";
      sage(b.kompass > 5000, "Einsprung mit #view-knowledge: der Kompass steht schon im Aufbau", "Kompass " + b.kompass + " (" + b.zustand + ")");
      await ctx.close();
    }

    /* ---------------- D: andere Wege hinein, vor der Ruhepause ---------------- */
    abschnitt("D  Links und Memory öffnen, bevor die Ruhepause kam");
    {
      const { ctx, pg } = await neueSeite({ halt: 3000 });
      await appBereit(pg);
      await warte(200);
      await pg.tap('[data-target="view-knowledge"]');
      await warte(300);
      await pg.evaluate(() => document.querySelector('#knowledgeSubnav [data-sub="sub-links"]').click());
      await warte(300);
      const offen = await pg.evaluate(() => document.getElementById("linksArea").innerHTML);
      await pg.waitForLoadState("load");
      await warte(2500);
      const spaeter = await pg.evaluate(() => document.getElementById("linksArea").innerHTML);
      teil = "D1";
      sage(offen.length > 500 && spaeter === offen, "„Weiterführende Links“ vor der Ruhepause geöffnet: gezeichnet, die Ruhepause zeichnet nicht noch einmal",
        "beim Öffnen " + offen.length + ", danach " + (spaeter === offen ? "gleich" : "anders (" + spaeter.length + ")"));
      await ctx.close();
    }
    {
      const { ctx, pg } = await neueSeite({ halt: 3000 });
      await appBereit(pg);
      await warte(200);
      await pg.tap('[data-target="view-learn"]');
      await warte(300);
      await pg.evaluate(() => document.querySelector('#learnSubnav [data-sub="sub-memory"]').click());
      await warte(400);
      const offen = await pg.evaluate(() => { const g = document.getElementById("memoryGrid"); return { karten: g ? g.querySelectorAll(".memory-card").length : 0, html: g ? g.innerHTML : "" }; });
      await pg.waitForLoadState("load");
      await warte(2500);
      const spaeter = await pg.evaluate(() => { const g = document.getElementById("memoryGrid"); return g ? g.innerHTML : ""; });
      teil = "D2";
      sage(offen.karten === 12, "Memory vor der Ruhepause geöffnet: 12 Karten", "Karten: " + offen.karten);
      sage(spaeter === offen.html, "die Ruhepause mischt nicht neu", spaeter === offen.html ? "gleich" : "anders");
      await ctx.close();
    }

    /* ---------------- E: Beta-Person ---------------- */
    abschnitt("E  Beta-Person (Attrappe): die Wache aus 884 bleibt, die Lesebereiche kommen beim Öffnen");
    {
      const { ctx, pg } = await neueSeite({ attrappe: "beta" });
      await pg.waitForLoadState("load");
      await warte(4000);
      const st = await pg.evaluate(() => ({ beta: window.__beta.slice(), dichter: (document.getElementById("dichterArea") || { innerHTML: "" }).innerHTML.length,
        daDichter: Boolean(document.getElementById("dichterArea")), kompass: (document.getElementById("kompassArea") || { innerHTML: "" }).innerHTML.length,
        sofort: window.DMA_TEILE ? window.DMA_TEILE.stand().sofort.map((x) => x.split(" ")[0]) : [] }));
      teil = "E";
      sage(st.beta.length === 0, "4 s nach load: keine Beta-Meldung (nichts angesehen)", JSON.stringify(st.beta));
      sage(st.sofort.length === 0, "nichts synchron geholt", "synchron: " + (st.sofort.join(", ") || "nichts"));
      sage(st.kompass > 5000 && st.daDichter && st.dichter === 0, "Kompass vorgezeichnet, „Dichter & Denker“ darin verdeckt NICHT gezeichnet (erst beim Öffnen)",
        "Kompass " + st.kompass + ", dichterArea " + (st.daDichter ? st.dichter + " Zeichen" : "fehlt"));
      const r = await tippWissen(pg);
      await warte(2500);
      const beta2 = await pg.evaluate(() => window.__beta.slice());
      sage(r.laenge > 5000 && r.dichter > 0, "im ersten Bild nach dem Wissen-Tipp stehen Kompass und „Dichter & Denker“", JSON.stringify(r));
      sage(beta2.length === 0, "2,5 s nach dem Öffnen weiter keine Meldung (der Bereich ist nicht im Blick; echtes Ansehen: 884-beta)", JSON.stringify(beta2));
      await ctx.close();
    }

    /* ---------------- H: Klassenzimmer offen, bevor die Ruhepause kam ---------------- */
    abschnitt("H  Klassenzimmer offen: die Ruhepause wartet (Datenbank nachgestellt, load 3 s aufgehalten)");
    {
      const supa = [];
      const { ctx, pg, t } = await neueSeite({ halt: 3000, supa });
      await appBereit(pg);
      await warte(200);
      await pg.tap('[data-target="view-knowledge"]');
      await warte(300);
      await pg.evaluate(() => document.querySelector('#knowledgeSubnav [data-sub="sub-livechat"]').click());
      await pg.waitForLoadState("load");
      await warte(4000);
      const name = (a) => a.tabelle === "site_content" ? (a.q.match(/key=eq\.([\w]+)/) || [])[1] || "site_content?" : a.tabelle;
      const SPAETER = ["user_links", "community_tips"];
      const imRaum = await bereiche(pg);
      const offen = await pg.evaluate(() => document.getElementById("sub-livechat").dataset.active === "true" && document.getElementById("view-knowledge").dataset.active === "true");
      const abfragenImRaum = supa.map(name).filter((n) => SPAETER.indexOf(n) >= 0);
      teil = "H";
      sage(offen && imRaum.links === 0 && imRaum.tipps === 0 && imRaum.memory === 0,
        "4 s nach load, Klassenzimmer offen: Links, Schwarmwissen, Memory nicht vorgezeichnet", "offen " + offen + ", " + zs(imRaum) + " (Profil " + imRaum.profil + ": restoreSession, wie vor 885)");
      sage(abfragenImRaum.length === 0, "keine Abfrage für Links und Tipps, solange es offen ist", abfragenImRaum.join(", ") || "keine");
      sage(imRaum.film >= 1, "die Filmliste kommt trotzdem (sie dient dem Raum)", "Abrufe: " + imRaum.film);
      const tRaus = Date.now() - t.null;
      await pg.tap('[data-target="view-learn"]');
      await warte(5000);
      const draussen = await bereiche(pg);
      const danach = supa.filter((a) => a.t > tRaus).map(name).filter((n) => SPAETER.indexOf(n) >= 0);
      sage(draussen.links > 500 && draussen.tipps > 500 && draussen.memory > 1000 && SPAETER.every((n) => danach.indexOf(n) >= 0),
        "nach dem Verlassen (Tipp auf „Lernen“) binnen 5 s alles vorgezeichnet und abgefragt", zs(draussen) + "; Abfragen danach: " + danach.join(", "));
      await ctx.close();
    }

    /* ---------------- I: Gast tippt früh auf „Anmelden“ ---------------- */
    abschnitt("I  Gast tippt oben auf „Anmelden“, bevor das Profil gezeichnet ist (Datenbank nachgestellt, load 3 s aufgehalten)");
    {
      const supa = [];
      const { ctx, pg, t } = await neueSeite({ halt: 3000, supa });
      await appBereit(pg);
      const leerVorher = await pg.evaluate(() => !document.getElementById("accountArea").childElementCount);
      const tTipp = Date.now() - t.null;
      await pg.tap("#loginBtn");
      const ms = await pg.evaluate(() => new Promise((ok) => {
        const t0 = performance.now();
        const schau = () => {
          if (document.querySelector("#accountArea #authForm")) return ok(Math.round(performance.now() - t0));
          if (performance.now() - t0 > 5000) return ok(-1);
          requestAnimationFrame(schau);
        };
        schau();
      }));
      const name = (a) => a.tabelle === "site_content" ? (a.q.match(/key=eq\.([\w]+)/) || [])[1] || "site_content?" : a.tabelle;
      const bild = supa.filter((a) => name(a) === "site_image_login_banner").map((a) => a.t - tTipp);
      teil = "I";
      sage(bild.length > 0 && Math.min(...bild) <= 150, "das Zeichnen beginnt spätestens mit dem Tipp (Anmeldebild-Abfrage ≤ 150 ms danach)",
        "Profil vorher leer: " + leerVorher + "; Anmeldebild-Abfragen relativ zum Tipp: " + (bild.map((x) => (x >= 0 ? "+" : "") + x + " ms").join(", ") || "keine"));
      sage(ms >= 0 && ms <= 1500, "das Anmeldeformular steht binnen 1,5 s", ms < 0 ? "nach 5 s noch nicht" : ms + " ms nach dem Tipp (jede Datenbank-Antwort 300 ms)");
      await ctx.close();
    }
    }   // Ende A–E, H, I

    /* ---------------- G: Betreiber und Beta wie draußen ---------------- */
    abschnitt("G  Betreiber und Beta: Anmeldung 300 ms nach dem Start, gedrosselt, CPU 4×, gepackt" + (QUELLE ? " – entfällt mit ?quelle (keine Stücke)" : ""));
    if (!QUELLE) {
      for (const [rolle, netz] of [["betreiber", "4g"], ["beta", "4g"], ["betreiber", "3g"], ["beta", "3g"]]) {
        const st = await rollenLauf(rolle, netz, 300);
        teil = "G-" + rolle.slice(0, 4) + "-" + netz + " ";
        const soll = rolle === "beta" ? st.rolle[0] && st.rolle[2] : st.rolle[0] && st.rolle[1];
        sage(soll && st.gebaut, "angemeldet als " + rolle + " (Attrappe, 300 ms nach dem Start), Stücke gebaut", "Konto/Moderation/Beta " + st.rolle.join("/") + ", load " + st.load + " ms");
        sage(st.sync.length === 0 && st.sofort.length === 0, "bis load + 10 s kein Stück synchron geholt",
          (st.sync.join(", ") || "keins") + (st.sofort.length ? "  · sofort: " + st.sofort.join(", ") : ""));
        sage(st.maxNach < 250, "längste Aufgabe nach load unter 250 ms", st.maxNach + " ms; Kompass " + st.kompass + ", dichterArea " + st.dichter);
        sage(st.rahmen && st.rahmen.daDichter && st.rahmen.dichter > 0, "im ersten Bild nach dem Wissen-Tipp steht „Dichter & Denker“",
          JSON.stringify(st.rahmen) + "; synchron nach dem Tipp gesamt " + st.syncNachTipp + ", Beta-Meldungen " + st.beta.length);
      }
    }
  } catch (e) {
    fehler++;
    console.log("  FEHL Abbruch: " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join(" / ") : e));
  }
  teil = "F";
  const echte = seitenFehler.filter((x) => !/Failed to fetch|NetworkError|ERR_|Load failed/i.test(x));
  sage(echte.length === 0, "keine Seitenfehler", echte.slice(0, 5).join(" | "));
  await br.close();
  srv.close();
  srvGz.close();
  console.log("\n" + (fehler ? "ROT: " + fehler + " (" + Object.entries(roteTeile).map(([t, n]) => t + ":" + n).join(", ") + ")" : "GRÜN") + "  [" + (process.env.WURZEL ? "WURZEL=" + WURZEL : QUELLE ? "?quelle" : "min/") + "]");
  process.exit(fehler ? 1 : 0);
})();
