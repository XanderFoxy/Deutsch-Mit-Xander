#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — „ÜBER MICH“ SOFORT (S2, freigegeben Funk 311; Ladezeit-Entwurf)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   263): „sofort im Livestream wie bei HelloTalk" · (Funk 310/312): „das
   Maximum rausholen", „die maximal professionellste Lösung".
   Befund bis 884: „Über mich“ ist die Startansicht. Das erste Bild zeigte
   den Text aus index.html; erst wenn app.js gelaufen war UND die Datenbank
   (site_content „about“) geantwortet hatte, sprang er auf den gespeicherten
   – ebenso das Foto (erst das Standardbild geholt, dann das gespeicherte).
   Ab 885: app.js merkt sich jeden gelesenen Stand (localStorage „dma-ueber“
   = { f: Fassung, t: Zeitstempel, w: Wert }); ein kleiner Wächter im Kopf
   von index.html setzt ihn ein, bevor das erste Bild gemalt wird; app.js
   gleicht danach still an (schreibt nur, was sich unterscheidet).

   Geprüft (Telefon 390 × 844, Datenbank nachgestellt: supabase-js aus der
   lokalen Kopie des Messwerkzeugs, „about“ nach 300 ms, alles andere „[]“;
   jedes gemalte Bild wird per requestAnimationFrame mitgeschrieben – Text
   der vier Felder und Foto-Adresse):
     Q  Bauweise: der Wächter steht im Kopf VOR den Stilblättern (hält den
        Aufbau nie an), app.js (Kern, min/app.js) schreibt den Merker
     A  Erstbesuch, Datenbank = X: erstes Bild zeigt den Text aus index.html
        (unverändert, ohne Merker geht es nicht anders), am Ende X; danach
        steht der Merker: f = Fassung, t = jetzt, w = X
     B  Wiederkehr, Datenbank = X:
        B1 schon das erste Bild mit „Über mich“ zeigt X (vier Texte + Foto)
        B2 kein Umspringen: genau ein Stand über die ganze Zeit
        B3 nach der Antwort schreibt niemand in „Über mich“ (gleich = still)
        B4 das Standardfoto aus index.html wird gar nicht erst geholt
        B5 der Merker ist aufgefrischt (neuer Zeitstempel)
     C  Wiederkehr, Datenbank inzwischen = Y (Überschrift und Hinweis neu,
        Kurztext leer, Foto zurückgesetzt):
        C1 erstes Bild = X (der Merker)
        C2 am Ende genau das, was 884 aus Y machte (leerer Kurztext und
           leeres Foto = Text/Bild aus index.html)
        C3 genau ein Wechsel X → Y, kein Bild mit dem Text aus index.html
           dazwischen
        C4 der Merker ist jetzt Y
     D  Wiederkehr, Datenbank nicht erreichbar (Funkloch): der gemerkte Stand
        bleibt die ganze Zeit, der Merker unverändert
     E  Wiederkehr, Datenbank antwortet „nichts“ (null – getSiteContent
        unterscheidet das nicht von einem Fehler): wie D
     F  kaputter Merker (kein JSON / w kein Objekt): Text aus index.html,
        keine Seitenfehler, danach repariert (w = X)
     M  (MESSEN=n) Zeit bis der endgültige Text steht, verschränkt gegen
        GEGEN=<Stand>: 4G (60 ms, 9 Mbit/s) und CPU 4× über das
        Prüfprotokoll, gepackt, Wiederkehr mit Merker X; je Lauf erstes
        Öffnen (Dateien aus dem Netz) und zweites (aus dem HTTP-Speicher)
     P  keine Seitenfehler
   Aufruf:   node werkzeug/pruefe-885-ueber.js
   Gegenprobe (Stand vor diesem Schritt, c30a68f7):
     S=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/<sitzung>/scratchpad
     git archive c30a68f7 index.html app.js min | tar -x -C $S/gegen885/ueber-vorher
     (alles andere als Verweis auf den Arbeitsbaum)
     WURZEL=$S/gegen885/ueber-vorher node werkzeug/pruefe-885-ueber.js
   Messen:   MESSEN=10 GEGEN=$S/gegen885/ueber-vorher node werkzeug/pruefe-885-ueber.js
   EHRLICH: Datenbank nachgestellt; was echte Leitung und Gerät beim Start
   kosten, misst werkzeug/ladezeit-messen.js (dort ist die Datenbank
   gesperrt, also läuft dort nur der Weg ohne Merker).
   ERGEBNIS: siehe SPIELSYSTEM.md, „Fassung 886 — „Über mich“ sofort“.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), zlib = require("zlib"), crypto = require("crypto");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : "";
const MESSEN = Math.max(0, Number(process.env.MESSEN || 0));
const NUR_M = Boolean(process.env.NUR_M);
const UMD = process.env.SUPABASE_UMD || "/tmp/dma-mess-supabase-js-2.117.3.umd.js";
const UMD_TEXT = fs.readFileSync(UMD, "utf8");
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".webp": "image/webp",
  ".webmanifest": "application/manifest+json", ".woff2": "font/woff2" };

let fehler = 0, teil = "";
const roteTeile = {};
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; roteTeile[teil] = (roteTeile[teil] || 0) + 1; }
  console.log((gut ? "  ok   " : "  FEHL ") + teil.padEnd(4) + was + (zusatz ? "   " + zusatz : ""));
};
const abschnitt = (titel) => console.log("\n" + titel + "\n");
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (a) => { const s = a.filter((x) => x != null && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/* Text und Bild aus index.html (Stand WURZEL) – das, was 884 im ersten Bild zeigte */
function original(wurzel) {
  const html = fs.readFileSync(path.join(wurzel, "index.html"), "utf8");
  const sek = html.slice(html.indexOf('id="view-about"'), html.indexOf('id="view-learn"'));
  const ent = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  const nimm = (re) => ent((sek.match(re) || [])[1] || "");
  return [nimm(/<h2>([^<]*)<\/h2>/), nimm(/class="role">([^<]*)</), nimm(/class="about-text-short">([^<]*)</), nimm(/class="about-support-note">([^<]*)</),
    (sek.match(/<img src="([^"]*)"/) || [])[1] || ""];
}

/* Server wie GitHub Pages: gepackt, ETag, max-age=600; index.html no-cache */
function server(wurzel) {
  const datei = new Map();
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    let d = datei.get(p);
    if (!d) {
      const f = path.join(wurzel, p);
      if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
      const inhalt = fs.readFileSync(f), ext = path.extname(f).toLowerCase();
      d = { inhalt, ext, etag: '"' + crypto.createHash("md5").update(inhalt).digest("hex") + '"' };
      if (/\.(js|css|json|html|svg|webmanifest)$/.test(ext)) d.gz = zlib.gzipSync(inhalt, { level: 6 });
      datei.set(p, d);
    }
    const h = { "Content-Type": TYP[d.ext] || "application/octet-stream", "Cache-Control": p === "/index.html" || p === "/fassung.json" ? "no-cache" : "max-age=600", ETag: d.etag };
    if (q.headers["if-none-match"] === d.etag) { a.writeHead(304, h); return a.end(); }
    const gz = d.gz && /gzip/.test(q.headers["accept-encoding"] || "");
    if (gz) h["Content-Encoding"] = "gzip";
    a.writeHead(200, h);
    a.end(gz ? d.gz : d.inhalt);
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok({ srv, basis: "http://127.0.0.1:" + srv.address().port + "/index.html" })));
}

(async () => {
  const ORIG = original(WURZEL);
  /* Fotos: eigener Server (wie die Speicher-Adresse der Datenbank), jede Anfrage mitgezählt */
  const fotoAnfragen = [];
  const fotoSrv = http.createServer((q, a) => {
    fotoAnfragen.push(q.url);
    a.writeHead(200, { "Content-Type": "image/svg+xml", "Cache-Control": "max-age=600" });
    a.end('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#c85"/></svg>');
  });
  await new Promise((ok) => fotoSrv.listen(0, "127.0.0.1", ok));
  const FOTO = "http://127.0.0.1:" + fotoSrv.address().port;
  const X = { heading: "Hallo, ich bin X!", role: "Rolle X", shortText: "Kurztext X – gespeichert in der Datenbank.", supportNote: "Hinweis X", photoUrl: FOTO + "/x.svg" };
  const Y = { heading: "Überschrift Y", role: "Rolle X", shortText: "", supportNote: "Hinweis Y", photoUrl: "" };
  const S_X = JSON.stringify([X.heading, X.role, X.shortText, X.supportNote, X.photoUrl]);
  const S_Y = JSON.stringify([Y.heading, Y.role, ORIG[2], Y.supportNote, ORIG[4]]);
  const S_ORIG = JSON.stringify(ORIG);

  const haupt = await server(WURZEL);
  const gegen = GEGEN ? await server(GEGEN) : null;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"] });
  const seitenFehler = [];

  /* z: { about: {wert} | "leer" | "weg", dbMs, standardFoto, aboutAbfragen } – gilt für den ganzen Kontext */
  async function kontext(z, saat, drossel) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, serviceWorkers: "block",
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => {
      const u = r.request().url();
      if (/cdn\.jsdelivr\.net\/.*supabase/.test(u)) return r.fulfill({ status: 200, contentType: "text/javascript", body: UMD_TEXT });
      if (/github\.com\/XanderFoxy\//.test(u) || /githubusercontent\.com/.test(u)) { z.standardFoto++; return r.abort(); }
      const k = decodeURIComponent(u);
      if (/supabase\.co\/rest\/v1\/site_content/.test(k) && /key=eq\.about(&|$)/.test(k)) {
        z.aboutAbfragen++;
        const modus = z.about;
        return warte(z.dbMs).then(() => {
          z.aboutAntwort = Date.now();
          if (modus === "weg") return r.abort();
          return r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: modus === "leer" ? "[]" : JSON.stringify([{ value: modus.wert }]) });
        }).catch(() => {});
      }
      if (/supabase\.co\/rest\//.test(u)) return warte(300).then(() => r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: "[]" })).catch(() => {});
      return r.abort();
    });
    await ctx.addInitScript(([saat]) => {
      try {
        localStorage.setItem("dma_tour_seen", "1");
        if (saat !== null && !localStorage.getItem("__sonde_gesaet")) { localStorage.setItem("dma-ueber", saat); localStorage.setItem("__sonde_gesaet", "1"); }
      } catch (e) {}
      window.__bilder = []; window.__fcp = null; window.__schreiben = -1;
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.name === "first-contentful-paint") window.__fcp = Math.round(e.startTime); })).observe({ type: "paint", buffered: true }); } catch (e) {}
      const stand = () => {
        const v = document.getElementById("view-about"), h = v && v.querySelector("h2");
        if (!h) return null;
        const t = (s) => { const e = v.querySelector(s); return e ? e.textContent : null; };
        const i = v.querySelector(".avatar-wrap img");
        return JSON.stringify([t("h2"), t(".role"), t(".about-text-short"), t(".about-support-note"), i ? i.getAttribute("src") : null]);
      };
      let letzte, n = 0;
      const schritt = () => {
        n++;
        const s = stand();
        if (s !== letzte) { window.__bilder.push({ t: Math.round(performance.now()), n, s }); letzte = s; }
        requestAnimationFrame(schritt);
      };
      requestAnimationFrame(schritt);
      document.addEventListener("DOMContentLoaded", () => {
        window.__dcl = Math.round(performance.now());
        const v = document.getElementById("view-about");
        window.__schreiben = 0;
        if (v) new MutationObserver((l) => { window.__schreiben += l.length; }).observe(v, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["src"] });
      });
    }, [saat === undefined ? null : saat]);
    if (drossel) ctx.__drossel = true;
    return ctx;
  }

  async function oeffnen(ctx, z, basis) {
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    if (ctx.__drossel) {
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 750e3 / 8 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    const vorAbfragen = z.aboutAbfragen;
    z.standardFoto = 0;
    const fotoVor = fotoAnfragen.length;
    await pg.goto(basis, { waitUntil: "domcontentloaded", timeout: 60000 });
    const t0 = Date.now();
    while (z.aboutAbfragen === vorAbfragen && Date.now() - t0 < 20000) await warte(50);
    await warte(z.dbMs + 1500);
    const st = await pg.evaluate(() => {
      let m = null;
      try { m = localStorage.getItem("dma-ueber"); } catch (e) {}
      return { bilder: window.__bilder.slice(), fcp: window.__fcp, dcl: window.__dcl, schreiben: window.__schreiben, merker: m, version: window.DMA_VERSION };
    });
    st.standardFoto = z.standardFoto;
    st.fotos = fotoAnfragen.slice(fotoVor);
    st.abfragen = z.aboutAbfragen - vorAbfragen;
    const mitText = st.bilder.filter((b) => b.s !== null);
    st.erstes = mitText.length ? mitText[0] : null;
    st.ende = mitText.length ? mitText[mitText.length - 1].s : null;
    st.staende = mitText.map((b) => b.s);
    await pg.close();
    return st;
  }
  const kurz = (s) => { if (s === null || s === undefined) return "–"; if (s === S_X) return "X"; if (s === S_Y) return "Y"; if (s === S_ORIG) return "index.html"; return s.slice(0, 120); };
  const merkerLesen = (m) => { try { return JSON.parse(m); } catch (e) { return null; } };
  const gleichX = (w) => w && ["heading", "role", "shortText", "supportNote", "photoUrl"].every((k) => w[k] === X[k]);

  try {
    if (!NUR_M) {
      /* ---------------- Q: Bauweise ---------------- */
      abschnitt("Q  Bauweise");
      {
        teil = "Q";
        const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
        const wache = html.indexOf('localStorage.getItem("dma-ueber")'), blaetter = html.indexOf("document.write('<link rel=\"stylesheet\"");
        sage(wache > 0 && blaetter > 0 && wache < blaetter && wache < html.indexOf("</head>"), "der Wächter steht im Kopf VOR den Stilblättern (hält den Aufbau nie an)",
          "Wächter an " + wache + ", Stilblätter an " + blaetter);
        const kern = fs.readFileSync(path.join(WURZEL, "min/app.js"), "utf8");
        const teile = fs.readdirSync(path.join(WURZEL, "min")).filter((f) => /^app-teil-.*\.js$/.test(f))
          .filter((f) => fs.readFileSync(path.join(WURZEL, "min", f), "utf8").indexOf("dma-ueber") >= 0);
        sage(kern.indexOf('"dma-ueber"') >= 0 && teile.length === 0, "app.js schreibt den Merker aus dem Kern (min/app.js, kein Nachladen beim Start)",
          "Kern: " + (kern.indexOf('"dma-ueber"') >= 0) + ", in Stücken: " + (teile.join(", ") || "keinem"));
      }

      /* ---------------- A, B, C, D, E: ein Gerät, nacheinander ---------------- */
      const z = { about: { wert: X }, dbMs: 300, standardFoto: 0, aboutAbfragen: 0 };
      const ctx = await kontext(z);
      abschnitt("A  Erstbesuch, Datenbank = X");
      const tA = Date.now();
      const a = await oeffnen(ctx, z, haupt.basis);
      const mA = merkerLesen(a.merker);
      teil = "A1";
      sage(a.erstes && a.erstes.s === S_ORIG, "erstes Bild zeigt den Text aus index.html (ohne Merker unvermeidlich)", "erstes Bild " + (a.erstes ? a.erstes.t + " ms: " + kurz(a.erstes.s) : "keins"));
      teil = "A2";
      sage(a.ende === S_X, "am Ende steht X (vier Texte + Foto)", "Stände: " + a.staende.map(kurz).join(" → "));
      teil = "A3";
      sage(Boolean(mA && mA.f === a.version && mA.t >= tA && mA.t <= Date.now() && gleichX(mA.w)), "der Merker steht: f = Fassung, t = jetzt, w = X",
        a.merker ? a.merker.slice(0, 160) : "kein Merker");

      abschnitt("B  Wiederkehr, Datenbank = X");
      const tB = mA ? mA.t : 0;
      await warte(20);
      const b = await oeffnen(ctx, z, haupt.basis);
      const mB = merkerLesen(b.merker);
      teil = "B1";
      sage(b.erstes && b.erstes.s === S_X, "schon das erste Bild mit „Über mich“ zeigt X", "erstes Bild " + (b.erstes ? b.erstes.t + " ms (FCP " + b.fcp + "): " + kurz(b.erstes.s) : "keins"));
      teil = "B2";
      sage(b.staende.length === 1, "kein Umspringen: genau ein Stand über die ganze Zeit", "Stände: " + b.staende.map(kurz).join(" → "));
      teil = "B3";
      sage(b.schreiben === 0 && b.abfragen === 1, "nach DOMContentLoaded schreibt niemand in „Über mich“ (Antwort gleich = still)", "Änderungen " + b.schreiben + ", about-Abfragen " + b.abfragen);
      teil = "B4";
      sage(b.standardFoto === 0, "das Standardfoto aus index.html wird gar nicht erst geholt", "Anfragen an github.com: " + b.standardFoto + "; X-Foto: " + b.fotos.length + " (HTTP-Speicher)");
      teil = "B5";
      sage(Boolean(mB && mB.t > tB && gleichX(mB.w)), "der Merker ist aufgefrischt (neuer Zeitstempel, w = X)", (mB ? "t " + tB + " → " + mB.t : "kein Merker"));

      abschnitt("C  Wiederkehr, Datenbank inzwischen = Y (Überschrift/Hinweis neu, Kurztext leer, Foto zurückgesetzt)");
      z.about = { wert: Y };
      const c = await oeffnen(ctx, z, haupt.basis);
      const mC = merkerLesen(c.merker);
      teil = "C1";
      sage(c.erstes && c.erstes.s === S_X, "erstes Bild = X (der Merker)", "erstes Bild: " + (c.erstes ? kurz(c.erstes.s) : "keins"));
      teil = "C2";
      sage(c.ende === S_Y, "am Ende genau das, was 884 aus Y machte (leerer Kurztext/leeres Foto = index.html)", "Ende: " + kurz(c.ende));
      teil = "C3";
      sage(c.staende.length === 2 && c.staende[0] === S_X && c.staende[1] === S_Y, "genau ein Wechsel X → Y, kein Bild mit dem Text aus index.html dazwischen", "Stände: " + c.staende.map(kurz).join(" → "));
      teil = "C4";
      sage(Boolean(mC && mC.w && mC.w.heading === Y.heading && mC.w.shortText === "" && mC.w.photoUrl === ""), "der Merker ist jetzt Y", c.merker ? c.merker.slice(0, 160) : "kein Merker");

      abschnitt("D  Wiederkehr, Datenbank nicht erreichbar (Funkloch)");
      z.about = "weg";
      const d = await oeffnen(ctx, z, haupt.basis);
      const mD = merkerLesen(d.merker);
      teil = "D";
      sage(d.staende.length === 1 && d.staende[0] === S_Y, "der gemerkte Stand (Y) steht die ganze Zeit, nichts springt zurück", "Stände: " + d.staende.map(kurz).join(" → "));
      sage(Boolean(mD && mC && mD.t === mC.t), "der Merker bleibt unverändert", mD && mC ? "t " + mC.t + " → " + mD.t : "kein Merker");

      abschnitt("E  Wiederkehr, Datenbank antwortet „nichts“ (null)");
      z.about = "leer";
      const e = await oeffnen(ctx, z, haupt.basis);
      const mE = merkerLesen(e.merker);
      teil = "E";
      sage(e.staende.length === 1 && e.staende[0] === S_Y, "der gemerkte Stand (Y) bleibt", "Stände: " + e.staende.map(kurz).join(" → "));
      sage(Boolean(mE && mC && mE.t === mC.t), "der Merker bleibt unverändert", mE && mC ? "t " + mC.t + " → " + mE.t : "kein Merker");
      await ctx.close();

      /* ---------------- F: kaputter Merker ---------------- */
      abschnitt("F  Kaputter Merker");
      for (const [name, saat] of [["kein JSON", "{kaputt"], ["w ist kein Objekt", JSON.stringify({ f: "884", t: 1, w: "Text" })], ["Felder keine Texte", JSON.stringify({ f: "885", t: 1, w: { heading: 5, photoUrl: {} } })]]) {
        const zf = { about: { wert: X }, dbMs: 300, standardFoto: 0, aboutAbfragen: 0 };
        const cf = await kontext(zf, saat);
        const fehlerVor = seitenFehler.length;
        const f = await oeffnen(cf, zf, haupt.basis);
        const mF = merkerLesen(f.merker);
        teil = "F";
        sage(f.erstes && f.erstes.s === S_ORIG && f.ende === S_X && seitenFehler.length === fehlerVor && gleichX(mF && mF.w),
          name + ": erstes Bild = index.html, am Ende X, keine Seitenfehler, Merker repariert",
          "Stände: " + f.staende.map(kurz).join(" → ") + ", Seitenfehler " + (seitenFehler.length - fehlerVor) + ", Merker " + (gleichX(mF && mF.w) ? "X" : String(f.merker).slice(0, 60)));
        await cf.close();
      }
    }

    /* ---------------- M: Messung ---------------- */
    if (MESSEN) {
      abschnitt("M  Zeit bis der endgültige Text steht – 4G, CPU 4×, Wiederkehr mit Merker X, Datenbank 300 ms; " + MESSEN + " Läufe"
        + (gegen ? ", verschränkt: A = GEGEN (" + GEGEN + "), B = WURZEL" : ""));
      const staende = gegen ? [["A", gegen.basis], ["B", haupt.basis]] : [["B", haupt.basis]];
      const werte = {};
      for (let i = 0; i < MESSEN; i++) {
        const reihe = i % 2 ? staende.slice().reverse() : staende;
        for (const [name, basis] of reihe) {
          const zm = { about: { wert: X }, dbMs: 300, standardFoto: 0, aboutAbfragen: 0 };
          const cm = await kontext(zm, JSON.stringify({ f: "885", t: Date.now(), w: X }), true);
          for (const art of ["netz", "speicher"]) {
            const r = await oeffnen(cm, zm, basis);
            const mitText = r.bilder.filter((x) => x.s !== null);
            const end = mitText.find((x) => x.s === S_X);
            const w = { fcp: r.fcp, erstes: r.erstes ? r.erstes.t : null, endgueltig: end ? end.t : null, altBilder: end && r.erstes ? end.n - r.erstes.n : null,
              dcl: r.dcl, stdFoto: r.standardFoto };
            ((werte[art] = werte[art] || {})[name] = werte[art][name] || []).push(w);
          }
          await cm.close();
        }
      }
      const MASSE = [["fcp", "erstes Bild (FCP)"], ["erstes", "erstes Bild mit „Über mich“"], ["endgueltig", "endgültiger Text steht"], ["altBilder", "Bilder mit altem Text"],
        ["dcl", "DOMContentLoaded"], ["stdFoto", "Standardfoto geholt"]];
      for (const art of Object.keys(werte)) {
        console.log("  " + (art === "netz" ? "erstes Öffnen (Dateien aus dem Netz)" : "zweites Öffnen (Dateien aus dem HTTP-Speicher)"));
        for (const [k, titel] of MASSE) {
          const A = werte[art].A ? werte[art].A.map((x) => x[k]) : null, B = werte[art].B.map((x) => x[k]);
          let zeile = "    " + titel.padEnd(30) + (A ? "A " + String(median(A)).padStart(6) + "   " : "") + "B " + String(median(B)).padStart(6);
          if (A) {
            const d = A.map((x, j) => (B[j] != null && x != null ? B[j] - x : null)).filter((x) => x != null);
            zeile += "   B−A Median " + String(median(d)).padStart(6) + " (" + d.filter((x) => x < 0).length + " schneller, " + d.filter((x) => x > 0).length + " langsamer von " + d.length + ")";
          }
          console.log(zeile);
        }
        console.log("    Einzelwerte B endgültig: " + werte[art].B.map((x) => x.endgueltig).join(", ") + (werte[art].A ? "   A: " + werte[art].A.map((x) => x.endgueltig).join(", ") : ""));
      }
      if (process.env.MESS_JSON) fs.writeFileSync(process.env.MESS_JSON, JSON.stringify(werte, null, 1));
      teil = "M";
      const bAlt = Object.keys(werte).flatMap((art) => werte[art].B.map((x) => x.altBilder));
      if (!process.env.WURZEL) sage(bAlt.every((x) => x === 0), "gedrosselt (4G, CPU 4×): in keinem Lauf ein Bild mit altem Text (WURZEL = dieser Stand)", "Bilder mit altem Text je Lauf: " + bAlt.join(", "));
    }
  } catch (e) {
    fehler++;
    console.log("  FEHL Abbruch: " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join(" / ") : e));
  }
  teil = "P";
  const echte = seitenFehler.filter((x) => !/Failed to fetch|NetworkError|ERR_|Load failed/i.test(x));
  sage(echte.length === 0, "keine Seitenfehler", echte.slice(0, 5).join(" | "));
  await br.close();
  haupt.srv.close(); if (gegen) gegen.srv.close(); fotoSrv.close();
  console.log("\n" + (fehler ? "ROT: " + fehler + " (" + Object.entries(roteTeile).map(([t, n]) => t + ":" + n).join(", ") + ")" : "GRÜN") + "  [" + (process.env.WURZEL ? "WURZEL=" + WURZEL : "Arbeitsbaum") + "]");
  process.exit(fehler ? 1 : 0);
})();
